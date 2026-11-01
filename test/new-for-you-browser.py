"""Spec358 real-app journeys: New for you shelf, New marks, registry coverage and two explorers on one device.

NEW_TEST_URL targets hosted builds. CHROME_PATH selects a local Chrome. The page clock is fixed so day rules are exact.
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
    return {'id': f'explorer-{n}', 'avatar': 'sky', 'color': ['blue', 'gold'][n - 1], 'symbol': 'leaf', 'createdAt': '2026-10-20T12:00:00.000Z'}

def notebook(rooms=None):
    book = {'version': 1, 'baseline': {'index': 0, 'observations': [], 'complete': False}, 'practice': [], 'puzzles': [], 'sessions': 0}
    if rooms is not None:
        book['rooms'] = rooms
    return book

def setup(browser, width, height, books, active='explorer-1', when=TODAY):
    c = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True, reduced_motion='reduce')
    seed = {'registry': {'version': 1, 'activeId': active, 'explorers': [explorer(i + 1) for i in range(len(books))]},
            'books': {f'explorer-{i + 1}': b for i, b in enumerate(books)}}
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

def main():
    server = None
    base = os.environ.get('NEW_TEST_URL')
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
            registry = None
            for width, height in [(375, 812), (820, 1180)]:
                c, p = setup(browser, width, height, [notebook()])
                go(p, base, '#home')
                if registry is None:
                    registry = p.evaluate("async()=>(await import('./room-registry.mjs')).rooms.map(r=>({route:r.route,places:[...r.places],added:r.added}))")
                cards = p.locator('.nfy-shelf .nfy-card')
                ok(p.locator('.nfy-shelf h2').inner_text().strip().endswith('New for you'), f'{width}: fresh explorer sees the shelf')
                ok(1 <= cards.count() <= 4, f'{width}: one to four cards')
                record = book(p)['rooms']
                ok(record == {'opened': {}, 'since': '2026-10-29', 'lastDay': '2026-11-01'}, f'{width}: first use starts three days back: {record}')
                expected = sorted({pl for r in registry if r['added'] >= '2026-10-29' for pl in r['places']})
                dotted = p.eval_on_selector_all('.header nav a', 'as=>as.filter(a=>a.querySelector(".nfy-place")).map(a=>a.getAttribute("href"))')
                nav = p.eval_on_selector_all('.header nav a', 'as=>as.map(a=>a.getAttribute("href"))')
                ok(sorted(dotted) == sorted(x for x in nav if x in expected), f'{width}: top-bar dots follow new rooms: {dotted}')
                ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{width}: no sideways scroll')
                first = cards.first.get_attribute('href')
                cards.first.click()
                p.wait_for_timeout(400)
                ok(p.evaluate('location.hash') == first, f'{width}: shelf card opens its room')
                ok(book(p)['rooms']['opened'].get(first) == '2026-11-01', f'{width}: opening is recorded')
                hop(p, '#home')
                ok(first not in p.eval_on_selector_all('.nfy-card', 'as=>as.map(a=>a.getAttribute("href"))'), f'{width}: an opened room leaves the shelf')
                place = next(r for r in registry if r['route'] == first)['places'][0]
                hop(p, place)
                marked = p.eval_on_selector_all(f'main a[href="{first}"]', 'as=>as.map(a=>!!a.querySelector(".nfy-mark"))')
                ok(marked and not any(marked), f'{width}: no New mark once opened')
                if width == 820:
                    hop(p, '#workshop')
                    groups = p.eval_on_selector_all('.workshop-shelf h2', 'hs=>hs.map(h=>h.textContent)')
                    ok(groups == ['Build and test', 'Measure, count and share', 'Maps, sources and stories'], 'Workshop groups')
                    ok(p.locator('.workshop-shelves a').count() == 22, 'Workshop keeps 22 tables')
                    for g in range(3):
                        flags = p.eval_on_selector_all(f'.workshop-shelf:nth-child({g + 1}) a', 'as=>as.map(a=>!!a.querySelector(".nfy-mark"))')
                        ok(flags == sorted(flags, reverse=True), f'Workshop group {g + 1}: new tables first')
                    # Registry coverage: every room link on every place page is registered, with its place.
                    by_route = {r['route']: r for r in registry}
                    for pl in PLACES:
                        hop(p, pl)
                        for h in set(p.eval_on_selector_all('main a[href^="#"]', 'as=>as.map(a=>a.getAttribute("href"))')):
                            if '/' not in h or SKIP.search(h) or h == '#new':
                                continue
                            ok(h in by_route, f'{pl}: {h} is in the room registry')
                            ok(pl in by_route[h]['places'], f'{pl}: registry lists {pl} for {h}')
                    hop(p, '#new')
                    ok(p.locator('.nfy-page h1').inner_text() == 'New rooms', '#new page')
                c.close()

            # Shared device. A last visited Monday; the picker shows on load; B is chosen on Wednesday. A's record must not move.
            monday = {'opened': {}, 'since': '2026-10-24', 'lastDay': '2026-10-27'}
            c, p = setup(browser, 820, 1180, [notebook(monday), notebook()], when=datetime.datetime(2026, 10, 29, 9, 0))
            p.goto(base + '#home', wait_until='domcontentloaded')
            p.locator('[data-select-explorer="explorer-2"]').wait_for()
            ok(book(p, 1)['rooms'] == monday, 'the picker never moves the previous explorer')
            p.locator('[data-select-explorer="explorer-2"]').click()
            p.wait_for_timeout(500)
            film = p.locator('dialog.welcome-film[open] [data-film-skip]')
            if film.count():
                film.click()
            ok(book(p, 1)['rooms'] == monday, 'choosing B leaves A unchanged')
            ok(book(p, 2)['rooms']['lastDay'] == '2026-10-29', 'B gets their own record')
            c.close()
            c, p = setup(browser, 820, 1180, [notebook(monday), notebook()], when=datetime.datetime(2026, 10, 29, 18, 0))
            p.goto(base + '#home', wait_until='domcontentloaded')
            p.locator('[data-select-explorer="explorer-1"]').click()
            p.wait_for_timeout(500)
            ok(book(p, 1)['rooms']['since'] == '2026-10-27' and book(p, 1)['rooms']['lastDay'] == '2026-10-29', 'A returning sees rooms since Monday')
            c.close()
            ok(not errors, 'no page errors: ' + json.dumps(errors))
            print(f'New for you browser: {checks} assertions passed')
        finally:
            browser.close()
            if server:
                server.shutdown()

if __name__ == '__main__':
    main()
