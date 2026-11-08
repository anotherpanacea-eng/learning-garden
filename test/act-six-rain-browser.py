"""Spec607 actual-app journey: the long rain. The gate, the shelf game, the French warning card at three depths, sending
the warning, and the water arriving for a known plan and through spec 120 §12's missing-plan fallback, at 820 and 320,
with motion checks. Synthetic explorers only. Chrome only; no Safari, physical-device, audible-speech or learning
qualification."""
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


def seed(code_tail):
    code = ("import {rainSeed} from './test/act-six-rain-checks.mjs';const s=rainSeed();" + code_tail +
            "s.garden={guide:'mira',welcomeFilmSeen:true};console.log(JSON.stringify(s));")
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def run(base, browser):
    data = seed('')
    for width in (820, 320):
        c, p = setup(browser, data, width)
        go(p, base, '#almanac/opening-ways/long-rain'); p.locator('[data-a6r-post]').wait_for()
        ok(p.locator('[data-a6r-post][data-arrived="false"]').count() == 1 and p.locator('[data-a6r-send]').count() == 1, f'{width}: the rain scene and Send')
        if width == 320:
            layout(p, '320 before sending'); c.close(); continue
        for item, shelf in (('flour-1', 'top'), ('flour-2', 'middle'), ('honey', 'middle'), ('jam', 'middle')):
            p.locator(f'[data-a6r-shelf="{item}:{shelf}"]').tap()
        p.locator('[data-a6r-shelf-check]').tap()
        ok('bags go on the top shelf' in p.locator('#a6r-shelf').inner_text(), f'{width}: a wrong shelf gets its hint')
        p.locator('[data-a6r-shelf="flour-2:top"]').tap(); p.locator('[data-a6r-shelf-check]').tap()
        ok('The flour is up high and dry.' in p.locator('#a6r-shelf-result').inner_text(), f'{width}: right shelves get the kept line')
        p.locator('[data-a6r-choose="down"]').tap()
        ok('going down' in p.locator('#a6r-choose-result').inner_text(), f'{width}: a wrong French card explains itself')
        eq(p.locator('#a6r-choose-result em').get_attribute('lang'), 'fr', f'{width}: the quoted French in the feedback is marked as French')
        p.locator('[data-a6r-choose="right"]').tap()
        ok('rising' in p.locator('#a6r-choose-result').inner_text(), f'{width}: the right French card')
        for card in ('ruisseau', 'monte', 'arrivera', 'chez-vous', 'soir', 'de-la-part'):
            p.locator(f'[data-a6r-card="{card}"]').tap()
        p.locator('[data-a6r-build-check]').tap()
        ok('this evening' in p.locator('#a6r-build-result').inner_text(), f'{width}: ce soir is explained')
        p.locator('[data-a6r-build-clear]').tap()
        for card in ('ruisseau', 'monte', 'arrivera', 'chez-vous', 'demain', 'de-la-part'):
            p.locator(f'[data-a6r-card="{card}"]').tap()
        p.locator('[data-a6r-build-check]').tap()
        ok('That is the warning, in French.' in p.locator('#a6r-build-result').inner_text(), f'{width}: the card is built')
        eq(book(p), data, f'{width}: the games write nothing')
        layout(p, f'{width} before sending')
        if width == 820:
            p.locator('[data-a6r-send]').tap(); p.locator('#a6r-water [data-a6r-post]').wait_for()
            a = book(p)['story']
            ok(a['acts']['VI'].get('warned') is True and a['plan'] == data['story']['plan'], 'Send records the warning and nothing else')
            text = p.locator('[data-act-six-root]').inner_text()
            ok('halfway down the river path' in text and 'Warned in time.' in text, 'the courier sets off and the water arrives')
            ok(p.evaluate("document.activeElement&&document.activeElement.id==='a6r-water'"), 'focus moves to the water')
            layout(p, 'after sending')
        c.close()
    # The missing-plan fallback in the real app: the meeting offered again, and Let the water come.
    none = seed("import {sendWarning} from './dist/act-six-core.mjs';import {canExport} from './test/act-two-checks.mjs';sendWarning(s,{canExport});delete s.story.plan;s.story.planWorry='a-future-worry';")
    for width in (820, 320):
        c, p = setup(browser, none, width)
        go(p, base, '#almanac/opening-ways/long-rain'); p.locator('[data-a6r-plan="wall"]').wait_for()
        ok("I can't find the plan we kept" in p.locator('[data-act-six-root]').inner_text() and p.locator('#a6r-water [data-a6r-post]').count() == 0, f'{width}: the meeting is offered again, before any scene')
        ok("orchard keepers' living" in p.locator('[data-a6r-plan-card="sponge"]').inner_text(), f'{width}: each plan shows its costs before choosing')
        layout(p, f'{width} offer')
        if width == 820:
            p.locator('[data-a6r-plan="none"]').tap()
            text = p.locator('#a6r-water').inner_text()
            ok('Then let\'s watch what the water does.' in text and 'just when the runner said' in text, 'Let the water come plays the plain scene')
            eq(book(p), none, 'and writes nothing')
            p.reload(wait_until='networkidle'); p.locator('[data-a6r-plan="sponge"]').wait_for()
            p.locator('[data-a6r-plan="sponge"]').tap(); p.wait_for_function("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).story.plan==='sponge'")
            s = book(p)['story']; eq(s['planWorry'], 'a-future-worry', 'choosing a plan leaves the saved worry')
            ok('Dot pins it up, just in time.' in p.locator('#a6r-water').inner_text() and 'Three apple trees' in p.locator('#a6r-water').inner_text(), 'the chosen plan\'s scene plays')
        c.close()
    later = seed("import {sendWarning} from './dist/act-six-core.mjs';import {canExport} from './test/act-two-checks.mjs';sendWarning(s,{canExport});s.story.plan='a-future-plan';")
    c, p = setup(browser, later)
    go(p, base, '#almanac/opening-ways/long-rain'); p.locator('#a6r-water').wait_for()
    ok("page this story can't read yet" in p.locator('#a6r-water').inner_text() and p.locator('[data-a6r-plan]').count() == 0, 'a plan from another version: the line, the plain scene, no choice')
    eq(book(p)['story']['plan'], 'a-future-plan', 'and it stays as saved')
    c.close()
    measure = '''sel=>[...document.querySelectorAll(sel)].map(e=>{const s=getComputedStyle(e);return {name:s.animationName,count:s.animationIterationCount,dur:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay)};})'''
    sent = seed("import {sendWarning} from './dist/act-six-core.mjs';import {canExport} from './test/act-two-checks.mjs';sendWarning(s,{canExport});")
    for motion, still in (('reduce', True), ('no-preference', False)):
        for d, sel in ((data, '.a6r-drop'), (sent, '.a6r-rise,.a6r-mark,.a6r-words')):
            c, p = setup(browser, d, 820, motion)
            go(p, base, '#almanac/opening-ways/long-rain'); p.locator('[data-a6r-post]').first.wait_for()
            anim = p.evaluate(measure, sel)
            ok(len(anim) > 0, f'{sel}: present')
            if still: ok(all(a['name'] == 'none' for a in anim), f'reduced motion: {sel} still')
            else:
                ok(all(a['name'] != 'none' and a['count'] != 'infinite' for a in anim), f'motion: {sel} animates finitely')
                ok(max(a['delay'] + a['dur'] * float(a['count']) for a in anim) <= 5, f'{sel} settles within five seconds')
            c.close()
    ok(not errors, 'no page errors ' + str(errors))


def book(p): return p.evaluate("()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')||'{}')")


def setup(browser, data, width=820, motion='reduce'):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True, reduced_motion=motion)
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-11-03T12:00:00Z'}]}
    c.add_init_script("(d=>{if(!localStorage.getItem('a6r-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a6r-fixture','1');}})(" + json.dumps({'registry': registry, 'seed': data}) + ")")
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
    print(f'Act VI long rain app: {checks} checks passed.')
