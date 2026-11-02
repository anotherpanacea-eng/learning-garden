"""Spec361 real-app checks: the calmer Number Garden front page.

NUMBERS_FRONT_TEST_URL targets hosted builds. CHROME_PATH selects a local Chrome.
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
# Area grid heights on claude/lg57-post-front, measured at build for a fresh explorer.
BEFORE = {375: 2395, 820: 1384}

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
    base = os.environ.get('NUMBERS_FRONT_TEST_URL')
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
                go(p, base, '#numbers')
                cards = p.locator('.paths .area-card')
                ok(cards.count() == 7, f'{width}: seven area cards')
                beside = cards.evaluate_all("cs=>cs.map(c=>{const i=c.querySelector('.area-icon').getBoundingClientRect(),t=c.querySelector('h2,h3').getBoundingClientRect();return i.right<=t.left&&i.top<t.bottom&&t.top<i.bottom;})")
                ok(all(beside), f'{width}: each picture sits beside its title: {beside}')
                links = cards.evaluate_all("cs=>cs.map(c=>c.querySelectorAll('.area-actions a,.area-actions button').length)")
                ok(all(n == 2 for n in links), f'{width}: each card keeps its walk button and Adventures link: {links}')
                spill = p.evaluate("()=>[...document.querySelectorAll('.paths .area-card')].flatMap(c=>{const r=c.getBoundingClientRect();return [...c.querySelectorAll('*')].filter(e=>{const q=e.getBoundingClientRect();return q.width&&(q.right>r.right+1||q.left<r.left-1);}).map(e=>e.tagName+'.'+e.className)})")
                ok(not spill, f'{width}: nothing spills out of a card: {spill[:5]}')
                grid = p.evaluate("document.querySelector('.paths .area-grid').getBoundingClientRect().height")
                ok(grid <= 0.85 * BEFORE[width], f'{width}: area grid {grid:.0f}px is at least 15% shorter than {BEFORE[width]}px')
                fold = p.locator('main details.place-onward')
                ok(fold.count() == 1 and not fold.evaluate('d=>d.open'), f'{width}: onward suggestions folded on #numbers')
                ok(fold.locator('.learning-invitations a[href="#science"]').count() == 1, f'{width}: the fold keeps the invitation links')
                fold.locator(':scope > summary').click()
                link = fold.locator('.learning-invitations a[href="#science"]')
                ok(fold.evaluate('d=>d.open') and link.is_visible(), f'{width}: the fold opens and shows its links')
                link.click()
                p.wait_for_timeout(500)
                ok(p.evaluate('location.hash') == '#science', f'{width}: an invitation link opens its place')
                p.evaluate('location.hash="#numbers"')
                p.wait_for_timeout(500)
                ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{width}: no sideways scroll')
                p.evaluate('location.hash="#science"')
                p.wait_for_timeout(500)
                ok(p.locator('main details.place-onward').count() == 0 and p.locator('main .learning-invitations').count() == 1, f'{width}: other places keep open invitations')
                c.close()
            ok(not errors, 'no page errors: ' + json.dumps(errors))
            print(f'Number Garden front browser: {checks} assertions passed')
        finally:
            browser.close()
            if server:
                server.shutdown()

if __name__ == '__main__':
    main()
