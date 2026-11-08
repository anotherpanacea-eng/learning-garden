"""Spec605 actual-app journey: a chosen path's project (Make, the Show line, Change, Keep a limit), binding it into the
Keeper's Pages, and the ending with its season, at 820 and 320, with motion checks. Synthetic explorers only. Chrome only;
no Safari, physical-device, audible-speech or learning qualification."""
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


def seed(started=False):
    code = ("import {endedSeed,startedSeed} from './test/act-five-checks.mjs';const s=" + ("startedSeed()" if started else "endedSeed()") +
            ";s.garden={guide:'mira',welcomeFilmSeen:true};console.log(JSON.stringify(s));")
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def book(p): return p.evaluate("()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')||'{}')")


def setup(browser, data, width=820, motion='reduce'):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True, reduced_motion=motion)
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-11-03T12:00:00Z'}]}
    c.add_init_script("(d=>{if(!localStorage.getItem('a5p-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a5p-fixture','1');}})(" + json.dumps({'registry': registry, 'seed': data}) + ")")
    p = c.new_page(); p.set_default_timeout(15000); p.on('pageerror', lambda e: errors.append(str(e)))
    return c, p


def go(p, base, route, root='[data-act-five-root]'):
    p.goto(base + route, wait_until='networkidle'); p.locator(root).first.wait_for()
    p.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")


def layout(p, label):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), label + ' no overflow')
    tiny = p.locator('.act-five-page button:visible,.act-five-page a:visible,.act-five-page summary:visible').evaluate_all('els=>els.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent.trim())')
    eq(tiny, [], label + ' 44px targets')


def chosen():
    code = ("import {startedSeed} from './test/act-five-checks.mjs';import {chooseActFivePath} from './dist/act-five-core.mjs';import {canExport} from './test/act-two-checks.mjs';"
            "const s=startedSeed();chooseActFivePath(s,'sky-night',{canExport});s.garden={guide:'mira',welcomeFilmSeen:true};console.log(JSON.stringify(s));")
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def run(base, browser):
    data = chosen()
    for width in (820, 320):
        c, p = setup(browser, data, width)
        go(p, base, '#almanac/own-question/sky-night'); p.locator('#a5-project').wait_for()
        ok(p.locator('[data-a5-made]').count() == 1 and p.locator('.a5-show').count() == 0, f'{width}: Make first, the Show line waits')
        eq(book(p), data, f'{width}: reading writes nothing')
        layout(p, f'{width} make')
        p.locator('[data-a5-made]').tap(); p.locator('.a5-show').wait_for()
        eq(book(p)['story']['acts']['V']['projects'], {'sky-night': {'made': True}}, f'{width}: a first version is a code')
        ok('dragon-shaped' in p.locator('.a5-show').inner_text(), f'{width}: the Show line appears')
        ok(p.evaluate("document.activeElement&&document.activeElement.id==='a5-change'"), f'{width}: focus moves to Change')
        p.locator('input[name="a5-change"][value="changed"]').check(); p.locator('[data-a5-change-save]').tap(); p.locator('#a5-keep').wait_for()
        ok(p.evaluate("document.activeElement&&document.activeElement.id==='a5-keep'"), f'{width}: focus moves to Keep')
        eq(p.locator('input[name="a5-limit"]').count(), 3, f'{width}: three limit cards')
        layout(p, f'{width} keep')
        p.locator('input[name="a5-limit"][value="cloudy"]').check(); p.locator('[data-a5-limit-save]').tap(); p.locator('#a5-project-page').wait_for()
        eq(book(p)['story']['acts']['V']['projects']['sky-night'], {'made': True, 'change': 'changed', 'limit': 'cloudy'}, f'{width}: codes only')
        ok('Some nights were cloudy.' in p.locator('#a5-project-page').inner_text(), f'{width}: the project page shows its limit')
        p.reload(wait_until='networkidle'); p.locator('#a5-project-page').wait_for(); ok(True, f'{width}: the project survives a reload')
        if width == 820:
            p.locator('[data-a5-end]').tap(); p.wait_for_function("location.hash==='#almanac/question-of-our-own'"); p.locator('[data-a5-binding]').wait_for()
            a = book(p)['story']['acts']['V']
            ok(a['ended'] is True and a['kept'] == 'sky-night' and a['season'] in ('spring', 'summer', 'autumn', 'winter'), 'binding ends the act with a season')
            eq(book(p)['story']['acts']['IV'], data['story']['acts']['IV'], 'Act IV is unchanged')
            text = p.locator('[data-act-five-root]').inner_text()
            ok('Our project: A sky-watching night. What it can\'t tell us yet: Some nights were cloudy.' in text, 'the almanac line names the project and its limit')
            ok(p.locator(f'[data-a5-season-art="{a["season"]}"]').count() == 1, 'the picture wears the season it ended in')
            layout(p, 'ending')
            go(p, base, '#almanac/own-question/sky-night')
            ok(p.locator('[data-a5-end]').count() == 0 and p.locator('[data-a5-limit-save]').count() == 0 and 'bound into the Keeper' in p.locator('#a5-project').inner_text(), 'afterwards the project is a record')
        c.close()
    ended = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {keptSeed} from './test/act-five-projects-checks.mjs';import {endActFive} from './dist/act-five-core.mjs';import {canExport} from './test/act-two-checks.mjs';const s=keptSeed();endActFive(s,'night-garden',0,{canExport});s.garden={guide:'ari',welcomeFilmSeen:true};console.log(JSON.stringify(s));"], cwd=ROOT, text=True))
    c, p = setup(browser, ended, 320)
    go(p, base, '#almanac/question-of-our-own'); p.locator('[data-a5-binding]').wait_for()
    ok(p.locator('[data-a5-season-art="winter"]').count() == 1 and 'Ember breathes on the glue' in p.locator('[data-act-five-root]').inner_text(), '320: the winter ending')
    layout(p, '320 ending')
    c.close()
    measure = '''sel=>[...document.querySelectorAll(sel)].map(e=>{const s=getComputedStyle(e);return {name:s.animationName,count:s.animationIterationCount,dur:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay)};})'''
    for motion, still in (('reduce', True), ('no-preference', False)):
        c, p = setup(browser, ended, 820, motion)
        go(p, base, '#almanac/question-of-our-own'); p.locator('[data-a5-binding]').wait_for()
        anim = p.evaluate(measure, '.a5-newpage,.a5-stitch')
        ok(p.locator('.a5-newpage').count() == 1 and p.locator('.a5-stitch').count() > 0, 'the new page and its stitches')
        if still: ok(all(a['name'] == 'none' for a in anim), 'reduced motion: the page is already bound')
        else:
            ok(all(a['name'] != 'none' and a['count'] != 'infinite' for a in anim), 'motion: every part animates once')
            ok(max(a['delay'] + a['dur'] * float(a['count']) for a in anim) <= 5, 'motion settles within five seconds')
        c.close()
    ok(not errors, 'no page errors ' + str(errors))


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
    print(f'Act V projects and ending app: {checks} checks passed.')
