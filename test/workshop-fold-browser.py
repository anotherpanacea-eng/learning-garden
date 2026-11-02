"""Spec365 real-app checks: the Workshop folds its onward list.

WORKSHOP_FOLD_TEST_URL targets hosted builds. CHROME_PATH selects a local Chrome.
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
    base = os.environ.get('WORKSHOP_FOLD_TEST_URL')
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
                go(p, base, '#workshop')
                fold = p.locator('main details.place-onward')
                ok(fold.count() == 1 and not fold.evaluate('d=>d.open') and fold.locator('.learning-invitations').count() == 1, f'{width}: invitations folded on #workshop')
                ok(p.locator('main .learning-invitations').count() == 1, f'{width}: no open copy outside the fold')
                ok(p.eval_on_selector_all('.workshop-shelf h2', 'hs=>hs.map(h=>h.textContent)') == ['Build and test', 'Measure, count and share', 'Maps, sources and stories'], f'{width}: Workshop groups unchanged')
                ok(p.locator('.workshop-shelves a').count() == 22, f'{width}: 22 tables unchanged')
                ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{width}: no sideways scroll')
                # A comparison's controls redraw the page; an opened fold stays open (Codex build review).
                p.locator('.workshop-page button[type="submit"]').first.click()
                p.wait_for_timeout(500)
                fold.locator(':scope > summary').click()
                setting = p.locator('[data-workshop-setting][aria-pressed="false"]').first
                setting.click()
                p.wait_for_timeout(400)
                ok(p.locator('[data-workshop-setting][aria-pressed="true"]').count() == 1, f'{width}: a setting was chosen (redraw ran)')
                ok(p.locator('main details#workshop-onward').evaluate('d=>d.open'), f'{width}: the opened fold survives a redraw')
                fold = p.locator('main details#workshop-onward')
                link = fold.locator('.learning-invitations a').first
                ok(link.is_visible(), f'{width}: the fold opens and shows its links')
                href = link.get_attribute('href')
                link.click()
                p.wait_for_timeout(500)
                ok(p.evaluate('location.hash') == href, f'{width}: an invitation opens its place ({href})')
                c.close()
            ok(not errors, 'no page errors: ' + json.dumps(errors))
            print(f'Workshop fold browser: {checks} assertions passed')
        finally:
            browser.close()
            if server:
                server.shutdown()

if __name__ == '__main__':
    main()
