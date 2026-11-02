"""Spec359 real-app journeys: room shelves on the Number Garden, Post Office and Living Garden.

SHELF_TEST_URL targets hosted builds. CHROME_PATH selects a local Chrome. The page clock is fixed so day rules are exact.
"""
import datetime
import functools
import http.server
import json
import os
from pathlib import Path
import re
import threading
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
checks, errors = 0, []
TODAY = datetime.datetime(2026, 11, 1, 10, 0)
PLACES = ['#cafe', '#science', '#workshop', '#post', '#numbers', '#words', '#desk', '#living', '#loft', '#orchard', '#field', '#almanac', '#archive', '#learn',
          '#pathways/math', '#pathways/english', '#pathways/science', '#pathways/french']
SKIP = re.compile(r'^#(activities|pathways|wonder)/|^#orchard/gather/')

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def explorer(n):
    return {'id': f'explorer-{n}', 'avatar': 'sky', 'color': ['blue', 'gold'][n - 1], 'symbol': 'leaf', 'createdAt': CREATED}

CREATED = '2026-10-20T12:00:00.000Z'

def notebook():
    return {'version': 1, 'baseline': {'index': 0, 'observations': [], 'complete': False}, 'practice': [], 'puzzles': [], 'sessions': 0}

def setup(browser, width, height, books, active='explorer-1', when=TODAY, records=None):
    c = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True, reduced_motion='reduce')
    seed = {'registry': {'version': 1, 'activeId': active, 'explorers': [explorer(i + 1) for i in range(len(books))]},
            'books': {f'explorer-{i + 1}': b for i, b in enumerate(books)}}
    for k, v in (records or {}).items():
        seed['books'][f'{k}:rooms'] = v
    c.add_init_script('(s=>{if(localStorage.getItem("nfy-fixture"))return;localStorage.setItem("learning-garden-explorers",JSON.stringify(s.registry));' +
                      'for(const [k,v] of Object.entries(s.books))localStorage.setItem("number-garden-v1:"+k,JSON.stringify(v));' +
                      'localStorage.setItem("nfy-fixture","1");})(' + json.dumps(seed) + ')')
    p = c.new_page()
    p.clock.set_fixed_time(when)
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
    p.wait_for_timeout(350)

def book(p, n=1):
    return p.evaluate(f"()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-{n}'))")

def rooms(p, n=1):
    return p.evaluate(f"()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-{n}:rooms'))")

def main():
    server = None
    base = os.environ.get('SHELF_TEST_URL')
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
    shelves = {'#numbers': ('More rooms in the Number Garden', 15, '#desk/rods'), '#post': ('More rooms at the Post Office', 13, '#post/ferry'), '#living': ('More Living Garden rooms', 7, None)}
    with sync_playwright() as pw:
        launch = {'headless': True, 'args': ['--disable-quic']}
        if os.environ.get('CHROME_PATH'):
            launch['executable_path'] = os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**launch)
        try:
            for width, height in [(375, 812), (820, 1180), (920, 900), (1280, 900)]:
                c, p = setup(browser, width, height, [notebook()])
                go(p, base, '#home')
                for place, (title, count, newest) in shelves.items():
                    hop(p, place)
                    p.wait_for_timeout(300)
                    ok(p.locator('.room-shelf').count() == 1, f'{width} {place}: one shelf')
                    ok(p.locator('.room-shelf h2').first.inner_text().strip() == title, f'{width} {place}: titled {title}')
                    cards = p.locator('.room-shelf-grid > *')
                    ok(cards.count() == count, f'{width} {place}: {count} entries, got {cards.count()}')
                    if newest:
                        hrefs = cards.first.evaluate('e=>[...e.querySelectorAll("a[href^=\'#\']")].map(a=>a.getAttribute("href"))')
                        ok(newest in hrefs, f'{width} {place}: a new room first: {hrefs}')
                    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{width} {place}: no sideways scroll')
                    spill = p.evaluate("()=>[...document.querySelectorAll('.room-shelf-grid > *')].flatMap(card=>{const r=card.getBoundingClientRect();return [...card.querySelectorAll('*')].filter(e=>{const q=e.getBoundingClientRect();return q.width&&(q.right>r.right+1||q.left<r.left-1);}).map(e=>card.className+' > '+e.tagName+'.'+e.className)})")
                    ok(not spill, f'{width} {place}: nothing spills out of a card: {spill[:5]}')
                    if width == 820:
                        grid, stacked = p.evaluate("()=>{const g=document.querySelector('.room-shelf-grid');const kids=[...g.children];return [g.getBoundingClientRect().height,kids.reduce((s,k)=>s+k.getBoundingClientRect().height,0)+14*(kids.length-1)];}")
                        ok(grid <= 0.75 * stacked, f'{place}: grid {grid:.0f}px is at least 25% shorter than stacked {stacked:.0f}px')
                hop(p, '#living/movement')
                p.wait_for_timeout(300)
                ok(p.locator('.room-shelf').count() == 0 and p.locator('details.body-movement-other').count() == 1, f'{width}: slugged Living pages keep their markup')
                c.close()
            ok(not errors, 'no page errors: ' + json.dumps(errors))
            print(f'Room shelves browser: {checks} assertions passed')
        finally:
            browser.close()
            if server:
                server.shutdown()

if __name__ == '__main__':
    main()
