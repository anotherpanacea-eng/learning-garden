"""Spec601 actual-app journey for Act IV chapter 2: hub link, the corner scene, offering a kept Rain Paths
result, reload, the Rain Paths return link, focus, targets and no overflow at 320 and 820, and reduced motion.
Synthetic explorers only. Chrome only; no Safari, physical-device, audible-speech or learning qualification."""
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
    code = ("import {actFourHosts} from './test/act-four-checks.mjs';import {startActFour} from './dist/act-four-core.mjs';"
            "import {canExport} from './test/act-two-checks.mjs';import {ensureRainPaths,chooseRainCase,nextRainPhase,keepRainResult} from './dist/rain-paths-core.mjs';"
            "const s=actFourHosts();startActFour(s,{canExport});")
    if mode == 'kept':
        code += "for(const id of ['cover-12','space-24']){ensureRainPaths(s);chooseRainCase(s,id);while(nextRainPhase(s));keepRainResult(s);}"
    code += "s.garden={guide:'ari',welcomeFilmSeen:true};console.log(JSON.stringify(s));"
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def book(p): return p.evaluate("()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')||'{}')")


def setup(browser, base, seed, width=820, motion='reduce'):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True, reduced_motion=motion)
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-11-03T12:00:00Z'}]}
    c.add_init_script("(d=>{if(!localStorage.getItem('a4o-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a4o-fixture','1');}})(" + json.dumps({'registry': registry, 'seed': seed}) + ")")
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
        eq(book(p), seed, f'{width}: the hub writes nothing')
        link = p.locator('a[href="#almanac/two-stories/orchard"]')
        ok(link.count() == 1, f'{width}: the hub links chapter 2')
        link.tap(); p.wait_for_function("location.hash==='#almanac/two-stories/orchard'"); p.locator('[data-a4-corner]').wait_for()
        ok('puzzling change' in p.locator('#act-four-heading').inner_text(), f'{width}: chapter 2 heading')
        ok(p.locator('[data-a4-corner] svg[role="img"]').get_attribute('aria-label').startswith('The low corner'), f'{width}: the scene is described')
        ok(p.locator('a[href="#science/rain"]').count() >= 1, f'{width}: the chapter links Rain Paths')
        options = p.locator('[data-a4-candidate] option').all_inner_texts()
        eq(options, ['Kept rain result: Cover · 12 new tokens per tray', 'Kept rain result: Starting storage · 24 new tokens per tray'], f'{width}: kept results labelled by case')
        layout(p, f'{width} chapter')
        eq(book(p), seed, f'{width}: reading the chapter writes nothing')
        if width == 820:
            # A choice made in one chapter survives a visit to the other chapter.
            p.locator('[data-a4-candidate]').select_option(index=1)
            go(p, base, '#almanac/two-stories/account'); p.locator('#act-four-heading').wait_for()
            go(p, base, '#almanac/two-stories/orchard'); p.locator('[data-a4-candidate]').wait_for()
            eq(p.locator('[data-a4-candidate]').input_value(), '["orchard","space-24"]', 'chapter 2 keeps its choice after visiting chapter 1')
            p.locator('[data-a4-offer]').tap(); p.locator('.a4-kept').wait_for()
            receipt = book(p)['story']['acts']['IV']['contributions']['orchard']
            eq(receipt, {'kind': 'act-four-offer', 'version': 1, 'chapter': 'orchard', 'activity': 'rain-paths', 'artifactKind': 'kept-result', 'ref': {'caseId': 'space-24'}}, 'the offer writes one id-only receipt')
            ok(p.evaluate("document.activeElement&&document.activeElement.id==='act-four-offer'"), 'focus moves to the offer section')
            ok('Ari looks at the trays' in p.locator('.a4-guess').inner_text(), 'the guide line names Ari')
            eq(book(p)['rainPaths'], seed['rainPaths'], 'offering leaves Rain Paths unchanged')
            p.reload(wait_until='networkidle'); p.locator('.a4-kept').wait_for()
            ok(True, 'the receipt survives a reload')
            go(p, base, '#science/rain')
            back = p.locator('.a4-return a[href="#almanac/two-stories/orchard"]')
            ok(back.count() == 1, 'Rain Paths offers the way back to chapter 2')
            go(p, base, '#almanac/two-stories/account')
            ok('old map' in p.locator('#act-four-heading').inner_text(), 'chapter 1 still opens')
        c.close()
    # Reduced motion shows the finished picture; otherwise the rain and reeds move.
    for motion, still in (('reduce', True), ('no-preference', False)):
        c, p = setup(browser, base, seed, 820, motion)
        go(p, base, '#almanac/two-stories/orchard'); p.locator('[data-a4-corner]').wait_for()
        anim = p.evaluate('''()=>Object.fromEntries(['a4c-drop','a4c-reed','a4c-puddle','a4c-glint'].map(k=>[k,[...document.querySelectorAll('.'+k)].map(e=>{const s=getComputedStyle(e);return {name:s.animationName,count:s.animationIterationCount,dur:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay)};})]))''')
        rain = p.locator('.a4c-rain').evaluate('e=>getComputedStyle(e).display')
        if still:
            ok(all(a['name'] == 'none' for v in anim.values() for a in v) and rain == 'none', 'reduced motion: nothing in the scene moves and no rain shows')
        else:
            expect = {'a4c-drop': 'a4c-fall', 'a4c-reed': 'a4c-grow', 'a4c-puddle': 'a4c-shimmer', 'a4c-glint': 'a4c-glint'}
            ok(all(a['name'] == expect[k] for k, v in anim.items() for a in v) and rain != 'none', 'motion: rain falls, reeds grow, the puddle and glints shimmer')
            ends = [a['delay'] + a['dur'] * float(a['count']) for v in anim.values() for a in v]
            ok(all(a['count'] != 'infinite' for v in anim.values() for a in v) and max(ends) <= 5, f'every animation settles within five seconds (latest {max(ends):.1f}s)')
        c.close()
    # No kept result yet: the chapter says so and offers the way to Rain Paths.
    c, p = setup(browser, base, fixture('none'))
    go(p, base, '#almanac/two-stories/orchard')
    ok('Nothing from Rain Paths is ready' in p.locator('[data-act-four-root]').inner_text(), 'no kept result: the chapter says so')
    eq(p.locator('[data-a4-offer]').count(), 0, 'no offer button without work')
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
    print(f'Act IV chapter 2 app: {checks} checks passed.')
