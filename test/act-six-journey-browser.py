"""Spec608 actual-app journey: the first journey and someone new. The gate, packing the first parcel, sending it, Léon's
letter and Hollis coming home, at 820 and 320, with motion checks. Synthetic explorers only. Chrome only; no Safari,
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
    code = ("import {journeySeed} from './test/act-six-journey-checks.mjs';const s=journeySeed();" + tail +
            "s.garden={guide:'mira',welcomeFilmSeen:true};console.log(JSON.stringify(s));")
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def run(base, browser):
    data = seed()
    for width in (820, 320):
        c, p = setup(browser, data, width)
        go(p, base, '#almanac/opening-ways/journey'); p.locator('#a6h-pack').wait_for()
        ok(p.locator('[data-a6h-send]').count() == 1 and p.locator('[data-a6h-home]').count() == 0, f'{width}: Send, and Hollis waits')
        layout(p, f'{width} before sending')
        if width == 320:
            c.close(); continue
        p.locator('[data-a6h-pack-check]').tap()
        ok('Put all three goods in first.' in p.locator('#a6h-pack-result').inner_text(), 'an unfinished parcel says so')
        for item in ('recipe', 'apples', 'drawings'):
            p.locator(f'[data-a6h-pack="{item}"]').tap()
        p.locator('[data-a6h-pack-check]').tap()
        ok('Apples go at the bottom' in p.locator('#a6h-pack-result').inner_text(), 'apples on top of the recipe get the bottom hint')
        p.locator('[data-a6h-pack-clear]').tap()
        for item in ('apples', 'drawings', 'recipe'):
            p.locator(f'[data-a6h-pack="{item}"]').tap()
        p.locator('[data-a6h-pack-check]').tap()
        ok('The drawings go on top' in p.locator('#a6h-pack-result').inner_text(), 'drawings under the recipe get the top hint')
        p.locator('[data-a6h-pack-clear]').tap()
        for item in ('apples', 'recipe', 'drawings'):
            p.locator(f'[data-a6h-pack="{item}"]').tap()
        p.locator('[data-a6h-pack-check]').tap()
        ok('tied with one of Bramble' in p.locator('#a6h-pack-result').inner_text(), 'the right order gets the kept line')
        ok(p.evaluate("document.activeElement&&document.activeElement.id==='a6h-pack-result'"), 'focus moves to the result')
        eq(book(p), data, 'packing writes nothing')
        p.locator('[data-a6h-send]').tap(); p.locator('[data-a6h-home]').wait_for()
        a = book(p)['story']
        ok(a['acts']['VI'].get('journey') is True and a['acts']['V'] == data['story']['acts']['V'], 'Send records the journey and nothing else')
        text = p.locator('[data-act-six-root]').inner_text()
        ok('A tall grey heron came off the coast boat today.' in text and '"Hollis!" says Nuria.' in text and 'They stay for supper.' in text, "Léon's letter, Hollis home, supper")
        ok(p.evaluate("document.activeElement&&document.activeElement.id==='a6h-home'"), 'focus moves to the homecoming')
        layout(p, 'after sending')
        p.reload(wait_until='networkidle'); p.locator('[data-a6h-home]').wait_for(); ok(p.locator('[data-a6h-send]').count() == 0, 'the journey survives a reload')
        c.close()
    sent = seed("import {sendFirstParcel} from './dist/act-six-core.mjs';import {canExport} from './test/act-two-checks.mjs';sendFirstParcel(s,{canExport});")
    c, p = setup(browser, sent, 320)
    go(p, base, '#almanac/opening-ways/journey'); p.locator('[data-a6h-home]').wait_for()
    layout(p, '320 after sending')
    c.close()
    measure = '''sel=>[...document.querySelectorAll(sel)].map(e=>{const s=getComputedStyle(e);return {name:s.animationName,count:s.animationIterationCount,dur:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay)};})'''
    for motion, still in (('reduce', True), ('no-preference', False)):
        c, p = setup(browser, sent, 820, motion)
        go(p, base, '#almanac/opening-ways/journey'); p.locator('[data-a6h-home]').wait_for()
        anim = p.evaluate(measure, '.a6h-walk')
        ok(len(anim) == 1, 'the heron walks')
        if still: ok(anim[0]['name'] == 'none', 'reduced motion: the heron is already at the post')
        else: ok(anim[0]['name'] != 'none' and anim[0]['count'] != 'infinite' and anim[0]['delay'] + anim[0]['dur'] <= 5, 'motion: the heron walks once and stops within five seconds')
        if not still:
            p.locator('[data-a6h-pack-clear]').tap(); p.locator('[data-a6h-home]').wait_for()
            ok(p.evaluate("getComputedStyle(document.querySelector('.a6h-walk')).animationName") == 'none', 'motion: unpacking afterwards does not replay the walk')
        c.close()
    ok(not errors, 'no page errors ' + str(errors))


def book(p): return p.evaluate("()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')||'{}')")


def setup(browser, data, width=820, motion='reduce'):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True, reduced_motion=motion)
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-11-03T12:00:00Z'}]}
    c.add_init_script("(d=>{if(!localStorage.getItem('a6h-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a6h-fixture','1');}})(" + json.dumps({'registry': registry, 'seed': data}) + ")")
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
    print(f'Act VI first journey app: {checks} checks passed.')
