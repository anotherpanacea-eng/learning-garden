"""Spec609 actual-app journey: after supper, Hollis's letter (page 6), then The Opening of the Ways with Bramble's ribbons,
its season and the village line, at 820 and 320, with motion checks. Synthetic explorers only. Chrome only; no Safari,
physical-device, audible-speech or learning qualification."""
import sys
sys.dont_write_bytecode = True
import functools, http.server, json, subprocess, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
checks = 0; errors = []


def ok(v, label):
    global checks
    assert v, label
    checks += 1


def eq(a, b, label): ok(a == b, label)


def seed(tail=''):
    code = ("import {homeSeed} from './test/act-six-ending-checks.mjs';const s=homeSeed();" + tail +
            "s.garden={guide:'mira',welcomeFilmSeen:true};console.log(JSON.stringify(s));")
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def run(base, browser):
    data = seed()
    c, p = setup(browser, data, 820)
    go(p, base, '#almanac/opening-ways/journey'); p.locator('[data-a6e-end]').wait_for()
    eq(book(p), data, 'reading writes nothing')
    p.locator('[data-a6e-end]').tap(); p.wait_for_function("location.hash==='#almanac/hollis-letter'"); p.locator('.a6e-letter').wait_for()
    a = book(p)['story']['acts']['VI']
    ok(a.get('ended') is True and a.get('season') in ('spring', 'summer', 'autumn', 'winter'), 'reading the letter ends the act with a season')
    eq(book(p)['story']['acts']['V'], data['story']['acts']['V'], 'Act V is unchanged')
    ok('Anyone can be the Keeper of the Ways.' in p.locator('.a6e-letter').inner_text() and 'from their coat' in p.locator('[data-act-six-root]').inner_text(), "Hollis's letter, given after supper")
    layout(p, 'letter')
    p.locator('a[href="#almanac/ways-open"]').first.tap(); p.locator('[data-a6e-ways]').wait_for()
    text = p.locator('[data-act-six-root]').inner_text()
    ok('Bramble ties a ribbon on each Way' in text and 'The Ways are open. Hollis came home.' in text and 'Willowbank, by Willow Brook. The Ways are open.' in text, 'the ending, the almanac line and the village line')
    ok(p.locator(f'[data-a6e-season-art="{a["season"]}"]').count() == 1, 'the picture wears the season it ended in')
    layout(p, 'ending')
    go(p, base, '#almanac/keepers', '[data-keeper-root]')
    ok('The Ways are open.' in p.locator('[data-keeper-root]').inner_text() and p.locator('a[href="#almanac/ways-open"]').count() >= 1, "the Keeper's Pages show the village line and the ending")
    c.close()
    ended = seed("import {endActSix} from './dist/act-six-core.mjs';import {canExport} from './test/act-two-checks.mjs';endActSix(s,11,{canExport});")
    c, p = setup(browser, ended, 320)
    for route, sel in (('#almanac/hollis-letter', '.a6e-letter'), ('#almanac/ways-open', '[data-a6e-ways]')):
        go(p, base, route); p.locator(sel).wait_for(); layout(p, f'320 {route}')
    ok(p.locator('[data-a6e-season-art="winter"]').count() == 1 and 'Snow on the ribbons' in p.locator('[data-act-six-root]').inner_text(), '320: the winter ending')
    c.close()
    # A child who has not seen the welcome film opens these pages directly: no film appears.
    unseen = json.loads(json.dumps(ended)); unseen['garden'] = {'guide': 'mira'}
    c, p = setup(browser, unseen, 820)
    for route in ('#almanac/hollis-letter', '#almanac/ways-open'):
        p.goto(base + route, wait_until='networkidle'); p.locator('[data-act-six-root]').first.wait_for()
        eq(p.locator('dialog.welcome-film[open]').count(), 0, f'no welcome film on {route}')
    c.close()
    measure = '''sel=>[...document.querySelectorAll(sel)].map(e=>{const s=getComputedStyle(e);return {name:s.animationName,count:s.animationIterationCount,dur:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay)};})'''
    for motion, still in (('reduce', True), ('no-preference', False)):
        c, p = setup(browser, ended, 820, motion)
        go(p, base, '#almanac/ways-open'); p.locator('[data-a6e-ways]').wait_for()
        anim = p.evaluate(measure, '.a6e-ribbon')
        ok(len(anim) == 3, 'three ribbons')
        if still: ok(all(x['name'] == 'none' for x in anim), 'reduced motion: the ribbons are tied')
        else:
            ok(all(x['name'] != 'none' and x['count'] != 'infinite' for x in anim), 'motion: each ribbon ties once')
            ok(max(x['delay'] + x['dur'] * float(x['count']) for x in anim) <= 5, 'motion settles within five seconds')
        c.close()
    ok(not errors, 'no page errors ' + str(errors))


def book(p): return p.evaluate("()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')||'{}')")


def setup(browser, data, width=820, motion='reduce'):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True, reduced_motion=motion)
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-11-03T12:00:00Z'}]}
    c.add_init_script("(d=>{if(!localStorage.getItem('a6e-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a6e-fixture','1');}})(" + json.dumps({'registry': registry, 'seed': data}) + ")")
    p = c.new_page(); p.set_default_timeout(15000); p.on('pageerror', lambda e: errors.append(str(e)))
    return c, p


def go(p, base, route, root='[data-act-six-root]'):
    p.goto(base + route, wait_until='networkidle'); p.locator(root).first.wait_for()
    p.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")


def layout(p, label):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), label + ' no overflow')
    tiny = p.locator('.act-six-page button:visible,.act-six-page a:visible,.act-six-page summary:visible').evaluate_all('els=>els.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent.trim())')
    eq(tiny, [], label + ' 44px targets')

if __name__ == '__main__':
    class Server(http.server.ThreadingHTTPServer):
        daemon_threads = True

    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args): pass

    server = Server(('127.0.0.1', 0), functools.partial(Handler, directory=str(ROOT / 'dist')))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/'
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel='chrome')
            try: run(base, browser)
            finally: browser.close()
    finally:
        server.shutdown()
    print(f'Act VI ending app: {checks} checks passed.')
