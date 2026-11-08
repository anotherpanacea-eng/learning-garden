"""Spec603 actual-app journey for Act IV chapter 3: hub link, the Gazette front page, offering a kept Travelers' Archive
reply, reload, the archive's way back, 44px targets and no overflow at 820 and 320, and motion. Synthetic explorers only.
Chrome only; no Safari, physical-device, audible-speech or learning qualification."""
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


def fixture(mode='kept'):
    code = ("import {orchardSeed} from './test/act-four-orchard-checks.mjs';import {keepReply} from './test/act-four-gazette-checks.mjs';"
            "const s=orchardSeed();" + ("keepReply(s);" if mode == 'kept' else "") + "s.garden={guide:'rowan',welcomeFilmSeen:true};console.log(JSON.stringify(s));")
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def book(p): return p.evaluate("()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')||'{}')")


def setup(browser, base, seed, width=820, motion='reduce'):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True, reduced_motion=motion)
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-11-03T12:00:00Z'}]}
    c.add_init_script("(d=>{if(!localStorage.getItem('a4g-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a4g-fixture','1');}})(" + json.dumps({'registry': registry, 'seed': seed}) + ")")
    p = c.new_page(); p.set_default_timeout(15000); p.on('pageerror', lambda e: errors.append(str(e)))
    return c, p


def go(p, base, route):
    p.goto(base + route, wait_until='networkidle'); p.locator('[data-act-four-root],main#main *').first.wait_for()
    p.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")


def layout(p, label):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), label + ' no overflow')
    tiny = p.locator('[data-act-four-root] button:visible,[data-act-four-root] a:visible,[data-act-four-root] select:visible,[data-act-four-root] summary:visible').evaluate_all('els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.height<44}).map(e=>e.textContent.trim())')
    eq(tiny, [], label + ' 44px targets')


def run(base, browser):
    seed = fixture('kept')
    for width in (820, 320):
        c, p = setup(browser, base, seed, width)
        go(p, base, '#almanac/two-stories')
        ok(p.locator('a[href="#almanac/two-stories/gazette"]').count() == 1, f'{width}: the hub links chapter 3')
        go(p, base, '#almanac/two-stories/gazette'); p.locator('[data-a4-gazette]').wait_for()
        ok('two explanations' in p.locator('#act-four-heading').inner_text(), f'{width}: chapter 3 heading')
        ok(p.locator('[data-a4-gazette] svg[role="img"]').get_attribute('aria-label').startswith('The front page of the Willowbank Gazette'), f'{width}: the Gazette is described')
        heads = p.locator('[data-a4-gazette] .a4g-head').evaluate_all('els=>els.map(e=>e.textContent)')
        ok(len(heads) == 2 and 'MILLER' in heads[0] and 'LIBRARIAN' in heads[1], f'{width}: both headlines, side by side')
        eq(p.locator('[data-a4-candidate] option').all_inner_texts(), ['Kept archive reply: Paris, 1910'], f'{width}: the kept reply is labelled by its visit')
        layout(p, f'{width} chapter')
        eq(book(p), seed, f'{width}: reading writes nothing')
        if width == 820:
            p.locator('[data-a4-offer]').tap(); p.locator('.a4-kept').wait_for()
            eq(book(p)['story']['acts']['IV']['contributions']['gazette']['ref'], {'packId': 'paris-flood-1910-v1'}, 'the offer writes a pack-id receipt')
            ok('Rowan reads both headlines again' in p.locator('.a4-guess').inner_text(), 'the guide line names Rowan')
            eq(book(p)['travelersArchive'], seed['travelersArchive'], 'offering leaves the archive unchanged')
            p.reload(wait_until='networkidle'); p.locator('.a4-kept').wait_for(); ok(True, 'the receipt survives a reload')
            go(p, base, '#archive')
            ok(p.locator('.a4-return a[href="#almanac/two-stories/gazette"]').count() == 1, 'the archive offers the way back to chapter 3')
        c.close()
    for motion, still in (('reduce', True), ('no-preference', False)):
        c, p = setup(browser, base, seed, 820, motion)
        go(p, base, '#almanac/two-stories/gazette'); p.locator('[data-a4-gazette]').wait_for()
        anim = p.evaluate("()=>[...document.querySelectorAll('.a4g-paper,.a4g-head,.a4g-copy')].map(e=>{const s=getComputedStyle(e);return {name:s.animationName,count:s.animationIterationCount,dur:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay)};})")
        if still:
            ok(all(a['name'] == 'none' for a in anim), 'reduced motion: the front page is set')
        else:
            ok(all(a['name'] != 'none' and a['count'] != 'infinite' for a in anim) and max(a['delay'] + a['dur'] * float(a['count']) for a in anim) <= 5, 'motion: the page settles and the headlines appear within five seconds')
        c.close()
    c, p = setup(browser, base, fixture('none'))
    go(p, base, '#almanac/two-stories/gazette')
    ok('Nothing from the Travelers' in p.locator('[data-act-four-root]').inner_text() and p.locator('[data-a4-offer]').count() == 0, 'no kept reply: the chapter says so, with no offer')
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
    print(f'Act IV chapter 3 app: {checks} checks passed.')
