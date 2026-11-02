"""Spec363 real-app checks: the Living Garden front page puts the main activity first.

LIVING_FRONT_TEST_URL targets hosted builds. CHROME_PATH selects a local Chrome.
"""
import functools
import http.server
import json
import os
from pathlib import Path
import threading
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
checks, errors = 0, []
STRIPS = ['#living/food', '#living/fork', '#living/stages', '#living/bodies']

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def setup(browser, width, height):
    c = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True, reduced_motion='reduce')
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-10-20T12:00:00.000Z'}]}
    book = {'version': 1, 'baseline': {'index': 0, 'observations': [], 'complete': False}, 'practice': [], 'puzzles': [], 'sessions': 0}
    c.add_init_script('(s=>{if(localStorage.getItem("nf-fixture"))return;localStorage.setItem("learning-garden-explorers",JSON.stringify(s.r));' +
                      'localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(s.b));localStorage.setItem("nf-fixture","1");})(' + json.dumps({'r': registry, 'b': book}) + ')')
    p = c.new_page()
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
    p.wait_for_timeout(300)

def main():
    server = None
    base = os.environ.get('LIVING_FRONT_TEST_URL')
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
                go(p, base, '#living')
                order = p.evaluate("()=>[...document.querySelector('.living-page').children].map(e=>e.classList[0]||e.tagName.toLowerCase())")
                ok(order[:3] == ['page-heading', 'drawn-howto', 'spiral-welcome'], f'{width}: the animal choice follows the heading: {order[:4]}')
                ok(p.locator('.living-page .body-hub-entry').count() == 0, f'{width}: no strip above the animal choice')
                shelf = p.locator('main .room-shelf')
                ok(shelf.count() == 1 and shelf.locator('.room-shelf-grid > *').count() == 11, f'{width}: eleven shelf entries')
                inside = shelf.evaluate("s=>[...s.querySelectorAll('a[href^=\\'#\\']')].map(a=>a.getAttribute('href'))")
                ok(all(inside.count(r) == 1 for r in STRIPS), f'{width}: each strip once on the shelf: {inside}')
                spill = p.evaluate("()=>[...document.querySelectorAll('.room-shelf-grid > *')].flatMap(c=>{const r=c.getBoundingClientRect();return [...c.querySelectorAll('*')].filter(e=>{const q=e.getBoundingClientRect();return q.width&&(q.right>r.right+1||q.left<r.left-1);}).map(e=>e.tagName+'.'+e.className)})")
                ok(not spill, f'{width}: nothing spills out of a card: {spill[:5]}')
                ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{width}: no sideways scroll')
                p.evaluate('location.hash="#living/visit"')
                p.wait_for_timeout(500)
                here = p.eval_on_selector_all('main .living-page .body-hub-entry a', 'as=>as.map(a=>a.getAttribute("href"))')
                ok(here == STRIPS, f'{width}: with no visit waiting, #living/visit keeps the strips in place: {here}')
                c.close()
            ok(not errors, 'no page errors: ' + json.dumps(errors))
            print(f'Living Garden front browser: {checks} assertions passed')
        finally:
            browser.close()
            if server:
                server.shutdown()

if __name__ == '__main__':
    main()
