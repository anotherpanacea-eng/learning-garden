"""Spec606 actual-app journey: Continue the story after the Act V ending, Nuria's letter, the goods-sorting game, the
animated map and which-Way puzzle, and keeping the exchange plan, at 820 and 320, with motion checks. Synthetic explorers
only. Chrome only; no Safari, physical-device, audible-speech or learning qualification."""
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
    code = ("import {boundSeed,sixSeed} from './test/act-six-checks.mjs';const s=" + ("sixSeed()" if started else "boundSeed()") +
            ";s.garden={guide:'mira',welcomeFilmSeen:true};console.log(JSON.stringify(s));")
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def run(base, browser):
    bound = seed()
    for width in (820, 320):
        c, p = setup(browser, bound, width)
        go(p, base, '#almanac/question-of-our-own', '[data-act-five-root]')
        ok(p.locator('[data-a6-start]').count() == 1, f'{width}: the Act V ending offers Continue the story')
        eq(book(p), bound, f'{width}: reading writes nothing')
        p.locator('[data-a6-start]').tap(); p.wait_for_function("location.hash==='#almanac/opening-ways'"); p.locator('.a6-letter').wait_for()
        story = book(p)['story']
        ok(story['acts']['VI'] == {'started': True} and 'nurias-list' in story['seenScenes'], f'{width}: Act VI starts')
        eq(story['acts']['V'], bound['story']['acts']['V'], f'{width}: Act V is unchanged')
        ok('Apples up the river, reed down.' in p.locator('.a6-letter').inner_text(), f"{width}: Nuria's letter")
        layout(p, f'{width} hub')
        p.locator('a[href="#almanac/opening-ways/exchange"]').first.tap(); p.locator('.a6-sort').wait_for()
        before = book(p)
        for good, way in (('apples', 'down'), ('reed', 'down'), ('honey', 'down'), ('drawings', 'up')):
            p.locator(f'[data-a6-sort="{good}:{way}"]').tap()
        p.locator('[data-a6-sort-check]').tap()
        ok("Vadoalto's bakers want the apples." in p.locator('.a6-sort').inner_text() and 'Pip tries to put himself' not in p.locator('.a6-sort').inner_text(), f'{width}: a wrong pile gets its hint')
        p.locator('[data-a6-sort="apples:up"]').tap(); p.locator('[data-a6-sort-check]').tap()
        ok('Pip tries to put himself in the up pile.' in p.locator('#a6-sort-result').inner_text(), f'{width}: right piles get the kept line')
        ok(p.evaluate("document.activeElement&&document.activeElement.id==='a6-sort-result'"), f'{width}: focus moves to the result')
        eq(book(p), before, f'{width}: the game writes nothing')
        layout(p, f'{width} exchange')
        go(p, base, '#almanac/opening-ways/routes'); p.locator('[data-a6-map]').wait_for()
        p.locator('[data-a6-way-choice="ford"]').tap()
        ok('wet feet' in p.locator('#a6-way-result').inner_text() and p.locator('[data-a6-chosen="ford"]').count() == 1, f'{width}: the ford gets its feedback and is picked out on the map')
        p.locator('[data-a6-way-choice="bridge"]').tap()
        ok('Slow, dry and very boring' in p.locator('#a6-way-result').inner_text(), f'{width}: the bridge road keeps the parcel dry')
        eq(book(p), before, f'{width}: the puzzle writes nothing')
        layout(p, f'{width} routes')
        if width == 820:
            p.locator('[data-a6-plan="later"]').tap()
            ok('The map stays on the table.' in p.locator('#a6-keep-result').inner_text(), 'Not yet says so')
            eq(book(p), before, 'and writes nothing')
            p.locator('[data-a6-plan="small"]').tap(); p.wait_for_function("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).story.acts.VI.plan==='small'")
            text = p.locator('#a6-keep-result').inner_text()
            ok('Mira: "One Way, once a week' in text and 'Nuria will get a copy' in text, 'the smaller plan with the guide line and the kept line')
            ok(p.evaluate("document.activeElement&&document.activeElement.id==='a6-keep-result'"), 'focus moves to the kept plan')
            p.reload(wait_until='networkidle'); p.locator('#a6-keep-result').wait_for(); ok('smaller exchange plan is kept' in p.locator('#a6-keep-result').inner_text(), 'the plan survives a reload')
            go(p, base, '#almanac/keepers', '[data-keeper-root]')
            ok(p.locator('a[href="#almanac/opening-ways"]').count() >= 1, "the Keeper's Pages link to Act VI")
        c.close()
    started = seed(True)
    kept = json.loads(json.dumps(started)); kept['garden'] = {'guide': 'a-future-guide', 'seen': ['future-story-node']}
    c, p = setup(browser, kept)
    go(p, base, '#almanac/opening-ways/routes')
    eq(p.locator('dialog.welcome-film[open]').count(), 0, 'no welcome film opens on an Act VI page')
    p.locator('[data-a6-plan="full"]').tap(); p.wait_for_function("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).story.acts.VI.plan==='full'")
    g = book(p)['garden']; eq([g.get('guide'), g.get('seen')], ['a-future-guide', ['future-story-node']], 'keeping a plan leaves unrelated saves as they were')
    p.locator('.act-six-page [data-speak]').first.dispatch_event('click')
    spoken = p.locator('.act-six-page [data-speak]').first.get_attribute('data-speak') or ''
    ok('Three Ways' in spoken and 'half a plan' not in spoken, 'Hear speaks visible prose and skips the closed note')
    c.close()
    measure = '''sel=>[...document.querySelectorAll(sel)].map(e=>{const s=getComputedStyle(e);return {name:s.animationName,count:s.animationIterationCount,dur:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay)};})'''
    for motion, still in (('reduce', True), ('no-preference', False)):
        c, p = setup(browser, started, 820, motion)
        go(p, base, '#almanac/opening-ways/routes'); p.locator('[data-a6-map]').wait_for()
        anim = p.evaluate(measure, '.a6-paper,.a6-jar,.a6-way')
        ok(p.locator('.a6-way').count() == 3 and p.locator('.a6-jar').count() > 0, 'the map, its jars and three Ways')
        if still: ok(all(a['name'] == 'none' for a in anim), 'reduced motion: the map is already drawn')
        else:
            ok(all(a['name'] != 'none' and a['count'] != 'infinite' for a in anim), 'motion: every part animates once')
            ok(max(a['delay'] + a['dur'] * float(a['count']) for a in anim) <= 5, 'motion settles within five seconds')
        c.close()
    ok(not errors, 'no page errors ' + str(errors))
def book(p): return p.evaluate("()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')||'{}')")


def setup(browser, data, width=820, motion='reduce'):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True, reduced_motion=motion)
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-11-03T12:00:00Z'}]}
    c.add_init_script("(d=>{if(!localStorage.getItem('a6-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a6-fixture','1');}})(" + json.dumps({'registry': registry, 'seed': data}) + ")")
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
    print(f'Act VI opening app: {checks} checks passed.')
