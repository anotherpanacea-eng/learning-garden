"""Spec602 actual-app journey: the meeting board (open plans, keep a plan and a worry, choose again) and the Act IV
ending (mind change, the guide unpinning the card, season and almanac lines), at 820 and 320, with motion checks.
Synthetic explorers only. Chrome only; no Safari, physical-device, audible-speech or learning qualification."""
import sys
sys.dont_write_bytecode = True
import functools, http.server, json, subprocess, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
checks = 0; errors = []
SEASONS = None


def ok(v, label):
    global checks
    assert v, label
    checks += 1


def eq(a, b, label): ok(a == b, label)


def fixture():
    code = ("import {meetingSeed} from './test/act-four-meeting-checks.mjs';const s=meetingSeed();"
            "s.garden={guide:'mira',welcomeFilmSeen:true};console.log(JSON.stringify(s));")
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def content():
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {actFourContent as C} from './dist/act-four-content.mjs';console.log(JSON.stringify({meeting:C.meeting,ending:C.ending}));"], cwd=ROOT, text=True))


def book(p): return p.evaluate("()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')||'{}')")


def setup(browser, seed, width=820, motion='reduce'):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True, reduced_motion=motion)
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [{'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-11-03T12:00:00Z'}]}
    c.add_init_script("(d=>{if(!localStorage.getItem('a4m-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a4m-fixture','1');}})(" + json.dumps({'registry': registry, 'seed': seed}) + ")")
    p = c.new_page(); p.set_default_timeout(15000); p.on('pageerror', lambda e: errors.append(str(e)))
    return c, p


def go(p, base, route):
    p.goto(base + route, wait_until='networkidle'); p.locator('[data-act-four-root]').first.wait_for()
    p.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")


def layout(p, label):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), label + ' no overflow')
    tiny = p.locator('[data-act-four-root] button:visible,[data-act-four-root] a:visible,[data-act-four-root] summary:visible,[data-act-four-root] .a4-keep label:visible').evaluate_all('els=>els.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent.trim())')
    eq(tiny, [], label + ' 44px targets')


def run(base, browser):
    seed, C = fixture(), content()
    for width in (820, 320):
        c, p = setup(browser, seed, width)
        go(p, base, '#almanac/two-stories')
        ok(p.locator('a[href="#almanac/two-stories/meeting"]').count() == 1, f'{width}: the hub links chapter 4')
        eq(p.locator('[data-a4-end]').count(), 0, f'{width}: no ending offer before a plan')
        go(p, base, '#almanac/two-stories/meeting'); p.locator('[data-a4-meeting]').wait_for()
        ok(p.locator('[data-a4-meeting] svg[role="img"]').get_attribute('aria-label').startswith('The library on meeting night'), f'{width}: the meeting scene is described')
        eq(p.locator('[data-a4-plan]').count(), 3, f'{width}: three plans on the board')
        boxes = p.locator('[data-a4-meeting] .a4m-card').evaluate_all('els=>{const s=els[0].ownerSVGElement.getBoundingClientRect();return els.map(e=>{const r=e.getBoundingClientRect();return {cx:(r.left+r.right)/2-s.left,cy:(r.top+r.bottom)/2-s.top,w:s.width,h:s.height};});}')
        ok(len(boxes) == 3 and all(0.1 * b['w'] < b['cx'] < 0.9 * b['w'] and 0.5 * b['h'] < b['cy'] < b['h'] for b in boxes) and len({round(b['cx']) for b in boxes}) == 3, f'{width}: the three plan cards sit on the lower board, apart from each other')
        p.locator('[data-a4-plan="wall"] summary').tap()
        ok(C['meeting']['plans'][0]['costs'][:20] in p.locator('[data-a4-plan="wall"]').inner_text(), f'{width}: opening a plan shows what it costs')
        eq(book(p), seed, f'{width}: reading the board writes nothing')
        layout(p, f'{width} meeting')
        if width == 820:
            p.locator('input[name="a4-plan"][value="sponge"]').check()
            ok(p.locator('[data-a4-worries="sponge"]').is_visible() and p.locator('[data-a4-worries="wall"]').is_hidden(), 'the chosen plan shows its own worries')
            p.locator('input[name="a4-worry-sponge"][value="sponge-years"]').check()
            p.locator('[data-a4-keep-plan]').tap(); p.locator('.a4-kept-plan').wait_for()
            eq([book(p)['story']['plan'], book(p)['story']['planWorry']], ['sponge', 'sponge-years'], 'the plan and worry are kept as codes')
            ok('Your worry: It will take years for a marsh to grow back.' in p.locator('.a4-kept-plan').inner_text(), 'the kept worry shows')
            ok(p.evaluate("document.activeElement&&document.activeElement.id==='act-four-offer'"), 'focus moves to the keeping section')
            eq(book(p)['rainPaths'], seed['rainPaths'], 'keeping a plan leaves Rain Paths unchanged')
            # Choose again: another plan, no worry.
            p.locator('input[name="a4-plan"][value="wall"]').check(); p.locator('[data-a4-keep-plan]').tap()
            p.wait_for_function("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).story.plan==='wall'")
            eq(book(p)['story']['planWorry'], None, 'choosing again with no worry clears the worry')
            p.reload(wait_until='networkidle'); p.locator('.a4-kept-plan').wait_for(); ok('The Wall' in p.locator('.a4-kept-plan').inner_text(), 'the plan survives a reload')
            # End the meeting.
            p.locator('[data-a4-end]').first.tap(); p.wait_for_function("location.hash==='#almanac/map-we-changed'"); p.locator('[data-penciled="true"]').wait_for()
            story = book(p)['story']
            ok(story['acts']['IV']['ended'] is True and story['acts']['IV']['season'] in ('spring', 'summer', 'autumn', 'winter') and 'map-changed' in story['seenScenes'], 'the ending records ended, a season and its scene')
            text = p.locator('[data-act-four-root]').inner_text()
            ok(C['ending']['mind']['orchard']['line'] in text, 'the orchard keeper changes their mind')
            ok('Mira unpins the card' in text and 'Mira draws a small question mark' in text and 'Rowan grins' not in text, 'the guide unpins the card, with Mira’s own tail')
            ok(C['ending']['seasons'][story['acts']['IV']['season']] in text, 'the season line for the season it ended in')
            ok('We kept a plan: The Wall.' in text, 'the almanac line names the plan')
            layout(p, 'ending')
            go(p, base, '#almanac/two-stories/meeting')
            ok(p.locator('[data-a4-keep-plan]').count() == 0 and 'The meeting is over' in p.locator('[data-act-four-root]').inner_text(), 'after the ending the plan is fixed')
        c.close()
    # Motion: reduced motion shows the finished pictures; otherwise every part animates once and settles within five seconds.
    ended = fixture()
    for motion, still in (('reduce', True), ('no-preference', False)):
        c, p = setup(browser, ended, 820, motion)
        go(p, base, '#almanac/two-stories/meeting'); p.locator('[data-a4-meeting]').wait_for()
        anim = p.evaluate('''()=>[...document.querySelectorAll('.a4m-card,.a4m-glow')].map(e=>{const s=getComputedStyle(e);return {name:s.animationName,count:s.animationIterationCount,dur:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay)};})''')
        if still:
            ok(all(a['name'] == 'none' for a in anim), 'reduced motion: the meeting scene is still')
        else:
            ok(all(a['name'] != 'none' and a['count'] != 'infinite' for a in anim), 'motion: cards pin and lanterns glow, finitely')
            ok(max(a['delay'] + a['dur'] * float(a['count']) for a in anim) <= 5, 'the meeting scene settles within five seconds')
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
    print(f'Act IV meeting and ending app: {checks} checks passed.')
