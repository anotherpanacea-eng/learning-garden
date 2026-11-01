"""Spec360 real-app journeys: the calmer Post Office front page.

POST_FRONT_TEST_URL targets hosted builds. CHROME_PATH selects a local Chrome. The page clock is fixed so New marks are exact.
"""
import datetime
import functools
import http.server
import json
import os
from pathlib import Path
import threading
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
checks, errors = 0, []
TODAY = datetime.datetime(2026, 11, 1, 10, 0)
SIDE = ['#post/ferry', '#post/descriptions', '#post/codes', '#post/sorting', '#post/double-check']

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def setup(browser, width, height):
    c = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True, reduced_motion='reduce')
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-10-20T12:00:00.000Z'}]}
    book = {'version': 1, 'baseline': {'index': 0, 'observations': [], 'complete': False}, 'practice': [], 'puzzles': [], 'sessions': 0}
    c.add_init_script('(s=>{if(localStorage.getItem("pf-fixture"))return;localStorage.setItem("learning-garden-explorers",JSON.stringify(s.r));' +
                      'localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(s.b));localStorage.setItem("pf-fixture","1");})(' + json.dumps({'r': registry, 'b': book}) + ')')
    p = c.new_page()
    p.clock.set_fixed_time(TODAY)
    p.set_default_timeout(12000)
    p.on('pageerror', lambda e: errors.append(str(e)))
    return c, p

def go(p, base, route):
    p.goto(base + route, wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    film = p.locator('dialog.welcome-film[open] [data-film-skip]')
    p.wait_for_timeout(300)
    if film.count():
        film.click()
    p.wait_for_timeout(250)

def hop(p, route):
    p.evaluate(f'location.hash={json.dumps(route)}')
    p.wait_for_timeout(400)

def shelf_routes(p):
    return p.eval_on_selector_all('.room-shelf-grid > *', 'cs=>cs.map(c=>[...c.querySelectorAll("a[href^=\'#\']")].map(a=>a.getAttribute("href")))')

def main():
    server = None
    base = os.environ.get('POST_FRONT_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *args):
                pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size = 128
            daemon_threads = True
        server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    base = base.rstrip('/') + '/'
    with sync_playwright() as pw:
        launch = {'headless': True, 'args': ['--disable-quic']}
        if os.environ.get('CHROME_PATH'):
            launch['executable_path'] = os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**launch)
        try:
            for width, height in [(375, 812), (820, 1180)]:
                c, p = setup(browser, width, height)
                go(p, base, '#post')
                page = p.locator('.post-office-page')
                order = p.evaluate("()=>[...document.querySelector('.post-office-page').children].map(e=>e.classList[0]||e.tagName.toLowerCase())")
                ok(order.index('post-welcome') + 1 == order.index('post-catalog') and order.index('post-catalog') < order.index('post-switch'), f'{width}: welcome, then the sorting board, then the link row: {order}')
                body = page.evaluate('e=>[...e.querySelectorAll("a[href^=\'#\']")].map(a=>a.getAttribute("href"))')
                ok(not [r for r in SIDE if r in body], f'{width}: no side-room entry in the page body')
                ok(p.locator('.post-office-page > .post-courier-picker').count() == 1, f'{width}: a new explorer sees the courier picker open')
                onward = p.locator('.post-office-page > details.post-onward')
                ok(onward.count() == 1 and not onward.evaluate('d=>d.open') and onward.locator('.learning-invitations a').count() >= 3, f'{width}: onward suggestions folded with their links')
                cards = shelf_routes(p)
                ok(len(cards) == 13, f'{width}: 13 shelf entries on the front page, got {len(cards)}')
                flat = [h for card in cards for h in card]
                ok(all(flat.count(r) == 1 for r in SIDE), f'{width}: each side room once on the shelf: {flat}')
                ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{width}: no sideways scroll')
                fresh_height = p.evaluate('document.documentElement.scrollHeight')
                # Take a delivery: the delivery view keeps the eight-room shelf.
                p.locator('[data-post-start]').first.click()
                p.wait_for_timeout(500)
                ok(p.locator('.post-welcome').count() == 0, f'{width}: delivery view')
                ok(len(shelf_routes(p)) == 8, f'{width}: 8 shelf entries during a delivery')
                # Back on the front page with one kept visit: the picker folds.
                hop(p, '#post/choose')
                ok(p.locator('.post-office-page > .post-courier-picker').count() == 0, f'{width}: the picker is not open once a delivery is kept')
                fold = p.locator('details#post-active-courier')
                ok(fold.count() == 1 and not fold.evaluate('d=>d.open'), f'{width}: the picker is folded')
                fold.locator(':scope > summary').click()
                p.locator('[data-post-courier="sorcerer"]').click()
                p.wait_for_timeout(400)
                ok(p.locator('details#post-active-courier').evaluate('d=>d.open'), f'{width}: the fold stays open after choosing')
                ok(p.locator('[data-post-courier="sorcerer"]').get_attribute('aria-pressed') == 'true', f'{width}: the chosen courier is selected')
                ok(len(shelf_routes(p)) == 13, f'{width}: 13 shelf entries on #post/choose')
                if width == 820:
                    p.evaluate("document.querySelector('#post-active-courier').open=false")
                    kept = p.evaluate('document.documentElement.scrollHeight')
                    ok(kept <= 0.85 * 5300, f'returning explorer front page {kept}px is at least 15% shorter than about 5,300px (fresh: {fresh_height}px)')
                c.close()
            ok(not errors, 'no page errors: ' + json.dumps(errors))
            print(f'Post Office front browser: {checks} assertions passed')
        finally:
            browser.close()
            if server:
                server.shutdown()

if __name__ == '__main__':
    main()
