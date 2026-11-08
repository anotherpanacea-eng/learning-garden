"""Spec604 actual-app journey: Continue the story after the Act IV ending, Page 5 and its animated blank pages, the hub's
six paths, choosing and switching a path, at 820 and 320, with motion checks. Synthetic explorers only. Chrome only; no
Safari, physical-device, audible-speech or learning qualification."""
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
    c.add_init_script("(d=>{if(!localStorage.getItem('a5-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a5-fixture','1');}})(" + json.dumps({'registry': registry, 'seed': data}) + ")")
    p = c.new_page(); p.set_default_timeout(15000); p.on('pageerror', lambda e: errors.append(str(e)))
    return c, p


def go(p, base, route, root='[data-act-five-root]'):
    p.goto(base + route, wait_until='networkidle'); p.locator(root).first.wait_for()
    p.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")


def layout(p, label):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), label + ' no overflow')
    tiny = p.locator('.act-five-page button:visible,.act-five-page a:visible,.act-five-page summary:visible').evaluate_all('els=>els.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent.trim())')
    eq(tiny, [], label + ' 44px targets')


def run(base, browser):
    ended = seed()
    for width in (820, 320):
        c, p = setup(browser, ended, width)
        go(p, base, '#almanac/map-we-changed', '[data-act-four-root]')
        ok(p.locator('[data-a5-start]').count() == 1, f'{width}: the Act IV ending offers Continue the story')
        eq(book(p), ended, f'{width}: reading the ending writes nothing')
        p.locator('[data-a5-start]').tap(); p.wait_for_function("location.hash==='#almanac/next-keeper'"); p.locator('[data-a5-pages]').wait_for()
        story = book(p)['story']
        ok(story['acts']['V'] == {'started': True} and 'next-keeper-page-revealed' in story['seenScenes'], f'{width}: Act V starts and Page 5 is freed')
        eq(story['acts']['IV'], ended['story']['acts']['IV'], f'{width}: Act IV is unchanged')
        ok(p.locator('[data-a5-pages] svg[role="img"]').get_attribute('aria-label').startswith('A stack of blank pages'), f'{width}: the scene is described')
        ok('For the next Keeper' in p.locator('.a5-heading').text_content(), f'{width}: the heading is on the first page')
        ok('Mira: "Blank pages are the best kind of invitation."' in p.locator('[data-act-five-root]').inner_text(), f'{width}: the guide line names Mira')
        box = p.locator('.a5-first').evaluate('e=>{const s=e.ownerSVGElement.getBoundingClientRect(),r=e.getBoundingClientRect();return {l:r.left-s.left,r:s.right-r.right};}')
        ok(box['l'] > 0 and box['r'] > 0, f'{width}: the first page sits inside the picture')
        layout(p, f'{width} page')
        p.locator('a[href="#almanac/own-question"]').first.tap(); p.locator('.a5-paths').wait_for()
        eq(p.locator('.a5-path').count(), 6, f'{width}: six project paths')
        eq(p.locator('.a5-steps li').count(), 6, f'{width}: six project steps')
        layout(p, f'{width} hub')
        if width == 820:
            p.locator('a[href="#almanac/own-question/night-garden"]').tap(); p.locator('[data-a5-choose]').wait_for()
            ok(p.locator('a[href="#living/plants"]').count() == 1 and p.locator('[data-a5-off-screen]').count() == 1 and p.locator('a[href="#workshop/fair"]').count() == 1, 'the path links its jobs and the Question Bench')
            before = book(p)
            p.locator('[data-a5-choose="night-garden"]').tap(); p.locator('[data-a5-chosen]').wait_for()
            eq(book(p)['story']['acts']['V']['path'], 'night-garden', 'the path is kept as a code')
            ok(p.evaluate("document.activeElement&&document.activeElement.id==='act-five-choose'"), 'focus moves to the choice')
            eq({k: v for k, v in book(p).items() if k != 'story'}, {k: v for k, v in before.items() if k != 'story'}, 'choosing touches only the story')
            layout(p, 'path')
            p.reload(wait_until='networkidle'); p.locator('[data-a5-chosen]').wait_for(); ok(True, 'the path survives a reload')
            go(p, base, '#almanac/own-question/gazette'); p.locator('[data-a5-choose="gazette"]').tap(); p.locator('[data-a5-chosen]').wait_for()
            eq(book(p)['story']['acts']['V']['path'], 'gazette', 'switching keeps one path')
            go(p, base, '#almanac/own-question')
            ok(p.locator('[data-a5-path="gazette"][data-a5-current="true"]').count() == 1, 'the hub marks the chosen path')
            go(p, base, '#almanac/keepers', '[data-keeper-root]')
            ok(p.locator('a[href="#almanac/own-question"]').count() >= 1, "the Keeper's Pages link to Act V")
        c.close()
    # Review fixes: real destinations, read-aloud, frame controls with only Act V, unrelated saves kept, no surprise film.
    started = seed(True)
    titles = {'#living': 'garden', '#living/plants': 'Seedlings after the storm', '#loft/printer': 'Puppet Notice Printer', '#post/messages': 'letter-mending desk',
              '#science/evidence': 'Water Evidence Shelf', '#almanac/sky': 'Sky notes', '#loft': 'Story Loft', '#post/groups': 'ribbon bench',
              '#workshop/maps': "Cartographer", '#workshop/scale': 'Same route, different scale', '#living/collection': 'My Count Collection'}
    hrefs = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {actFiveContent as C} from './dist/act-five-content.mjs';console.log(JSON.stringify([...new Set(C.paths.flatMap(p=>p.jobs.map(j=>j.href)).filter(Boolean))]))"], cwd=ROOT, text=True))
    eq(sorted(hrefs), sorted(titles), 'every linked job has an expected destination')
    c, p = setup(browser, started)
    for href, title in titles.items():
        p.goto(base + href, wait_until='networkidle'); p.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
        ok(title.lower() in p.locator('main').inner_text().lower(), f'{href} opens {title}')
    go(p, base, '#almanac/own-question')
    p.locator('.act-five-page [data-speak]').first.dispatch_event('click')
    ok('What do you want to find out?' in (p.locator('.act-five-page [data-speak]').first.get_attribute('data-speak') or ''), 'Hear speaks the visible opening')
    go(p, base, '#almanac/own-question/gazette'); p.locator('.act-five-page [data-speak]').first.dispatch_event('click')
    ok('A good report says' not in (p.locator('.act-five-page [data-speak]').first.get_attribute('data-speak') or ''), 'Hear skips a closed Keeper\'s note')
    p.locator('.a5-note summary').click(); p.locator('.act-five-page [data-speak]').first.dispatch_event('click')
    ok('A good report says' in (p.locator('.act-five-page [data-speak]').first.get_attribute('data-speak') or ''), 'and reads it once opened')
    c.close()
    only = json.loads(json.dumps(started)); only['story']['acts'] = {'V': started['story']['acts']['V']}; only['story'].pop('frameAmount', None)
    c, p = setup(browser, only)
    go(p, base, '#almanac/own-question'); p.locator('[data-a5-frame-amount="longer"]').tap()
    p.wait_for_function("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).story.frameAmount==='longer'")
    ok('pancakes' in p.locator('[data-act-five-root]').inner_text(), 'the frame controls work with only Act V readable')
    c.close()
    kept = json.loads(json.dumps(started)); kept['garden'] = {'guide': 'a-future-guide', 'seen': ['future-story-node']}
    c, p = setup(browser, kept)
    go(p, base, '#almanac/own-question/courier-route')
    eq(p.locator('dialog.welcome-film[open]').count(), 0, 'no welcome film opens on an Act V page')
    p.locator('[data-a5-choose="courier-route"]').tap(); p.locator('[data-a5-chosen]').wait_for()
    g = book(p)['garden']; eq([g.get('guide'), g.get('seen')], ['a-future-guide', ['future-story-node']], 'choosing a path leaves an unknown guide and future seen nodes as they were')
    c.close()
    # Motion: reduced motion shows the finished page; otherwise every part animates once and settles within five seconds.
    measure = '''sel=>[...document.querySelectorAll(sel)].map(e=>{const s=getComputedStyle(e);return {name:s.animationName,count:s.animationIterationCount,dur:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay),offset:s.strokeDashoffset};})'''
    for motion, still in (('reduce', True), ('no-preference', False)):
        c, p = setup(browser, started, 820, motion)
        go(p, base, '#almanac/next-keeper'); p.locator('[data-a5-pages]').wait_for()
        anim = p.evaluate(measure, '.a5-leaf,.a5-ink-wipe,.a5-rule')
        ok(len(anim) == 6, 'four loose pages, the ink and the rule')
        if still:
            ok(all(a['name'] == 'none' for a in anim), 'reduced motion: the page is still')
            ok(all(a['offset'] in ('0', '0px') for a in p.evaluate(measure, '.a5-rule')), 'reduced motion: the rule is drawn')
        else:
            ok(all(a['name'] != 'none' and a['count'] != 'infinite' for a in anim), 'motion: every part animates finitely')
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
    print(f'Act V opening app: {checks} checks passed.')
