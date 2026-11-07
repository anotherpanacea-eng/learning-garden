"""Native spec406 journey; one tablet exploration plus focused phone/wide samples.

Uses actual app storage, Notes transfer and lifecycle predicates. Only the isolated
speech case supplies a local synthetic voice; it does not qualify audible output.
Artifacts stay outside the checkout. MOONLIGHT_TEST_URL optionally selects a server.
"""
import functools
import http.server
import io
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import threading
import traceback
from PIL import Image
from playwright.sync_api import sync_playwright

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('MOONLIGHT_ARTIFACTS', '/private/tmp/lg406-native'))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['RHYTHM_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('native_helpers', ROOT / 'test/rhythm-browser.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
PLACES = ['Right side', 'Upper right', 'Top', 'Upper left', 'Left side', 'Lower left', 'Bottom', 'Lower right']
NAMES = ['New Moon', 'Thin and growing (waxing crescent)', 'Half and growing (first quarter)',
         'Nearly full and growing (waxing gibbous)', 'Full Moon', 'Nearly full and shrinking (waning gibbous)',
         'Half and shrinking (last quarter)', 'Thin and shrinking (waning crescent)']
HELP = ['One half faces the Sun', 'Our view is another half', 'A phase is not Earth’s shadow', 'Same phase, flipped drawing']
CHILD = '[data-moonlight-root]'
EARTH = '[data-ml-earth-view]'


def action(p, name):
    h.click(p, f'[data-ml-action="{name}"]')


def enter(p):
    h.click(p, '[data-moonlight-entry]')
    p.locator(CHILD).wait_for()


def go(p, base):
    h.go(p, base, '#almanac/sky', '[data-sky-root]')


def storage(p):
    return p.evaluate('()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))')


def notebook_bytes(p):
    return p.evaluate("()=>localStorage.getItem('number-garden-v1:'+JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId)")


def selected(p):
    return p.locator('[data-ml-place][aria-pressed="true"]').get_attribute('data-ml-place')


def spoken(p):
    h.click(p, CHILD + ' [data-speak]')
    return p.locator(CHILD + ' [data-speak]').get_attribute('data-speak')


def hidden(p, phase):
    h.ok(p.locator(EARTH + ' svg').count() == 0, 'hidden Earth view has no phase art')
    h.ok(not p.locator('[data-ml-action="flip"]').count(), 'hidden view has no flip control')
    surface = p.locator(CHILD).evaluate("x=>[x.textContent,...[x,...x.querySelectorAll('*')].flatMap(n=>[n.getAttribute('aria-label')||'',n.getAttribute('aria-description')||'',n.getAttribute('data-speak')||''])].join(' ')")
    for key in ['name', 'description', 'amount']:
        h.ok(phase[key] not in surface, 'hidden current ' + key + ' absent from DOM, aria and Hear')
    h.ok('Northern-style drawing' not in surface and 'Southern-style drawing' not in surface, 'hidden orientation label absent')


def layout(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator(CHILD + ' button,' + CHILD + ' a,' + CHILD + ' summary').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)")
    h.ok(not bad, '44px targets and 16px labels: ' + str(bad))
    geometry = p.locator('[data-ml-board]').evaluate("""b=>{const r=b.getBoundingClientRect();const xs=[...b.querySelectorAll('[data-ml-place]')].map(x=>{const q=x.getBoundingClientRect();return {i:+x.dataset.mlPlace,x:q.x-r.x,y:q.y-r.y,w:q.width,h:q.height};});return {w:r.width,h:r.height,xs};}""")
    w = geometry['w']
    h.ok(259.9 <= w <= 340.1 and abs(geometry['h'] - w) < 1, 'bounded square orbit board')
    xs = geometry['xs']
    h.ok(len(xs) == 8, 'eight native ring targets')
    import math
    for q in xs:
        i = q['i']
        h.ok(abs(q['x'] + q['w']/2 - (170 + 112*math.cos(i*math.pi/4))*w/340) < 1.5 and
             abs(q['y'] + q['h']/2 - (170 - 112*math.sin(i*math.pi/4))*w/340) < 1.5, 'target center follows ring ' + str(i))
        h.ok(q['x'] >= -.5 and q['y'] >= -.5 and q['x']+q['w'] <= w+.5 and q['y']+q['h'] <= w+.5, 'target inside board')
    for i, a in enumerate(xs):
        for b in xs[i+1:]:
            h.ok(a['x']+a['w'] <= b['x']+.5 or b['x']+b['w'] <= a['x']+.5 or a['y']+a['h'] <= b['y']+.5 or b['y']+b['h'] <= a['y']+.5, 'ring targets do not overlap')
    h.ok(p.locator('[data-ml-space-ball]').count() == 8, 'eight alternative space balls remain visible')
    # Sample actual rendered half disks, independent of SVG path serialization.
    for ball in p.locator('[data-ml-space-ball]').all():
        im = Image.open(io.BytesIO(ball.screenshot())).convert('RGB')
        left = im.getpixel((round(im.width*.3), round(im.height*.5)))
        right = im.getpixel((round(im.width*.7), round(im.height*.5)))
        h.ok(sum(right) > sum(left) + 60, 'each space Moon has its right half sunlit')
    guide = p.locator('[data-ml-view-line]').evaluate("x=>{const a=x.getPointAtLength(0),b=x.getPointAtLength(x.getTotalLength());return [a.x,a.y,b.x,b.y];}")
    i = int(selected(p))
    h.ok(abs(guide[0]-170)<.01 and abs(guide[1]-170)<.01 and
         abs(guide[2]-(170+112*math.cos(i*math.pi/4)))<.01 and
         abs(guide[3]-(170-112*math.sin(i*math.pi/4)))<.01, 'view guide joins Earth to elected place')
    light = p.locator('[data-ml-sunlight]').evaluate("x=>{const r=x.getBBox();return {x:r.x,y:r.y,w:r.width,h:r.height};}")
    h.ok(p.locator('[data-ml-sunlight]').evaluate('x=>x.getPointAtLength(0).x>x.getPointAtLength(20).x'), 'sunlight points left toward ring')
    h.ok(light['x'] >= 315 and light['x']+light['w'] <= 335.01 and light['y'] >= 135 and light['y']+light['h'] <= 205, 'separated sunlight arrows stay right of ring')


def silhouette(p, index, south):
    im = Image.open(io.BytesIO(p.locator(EARTH + ' svg').first.screenshot())).convert('RGB')
    # Compare each rendered location with the dark center of the always-half-lit
    # space ball. Normal CSS colors stay unconstrained; only relative light matters.
    ball = Image.open(io.BytesIO(p.locator('[data-ml-space-ball]').first.screenshot())).convert('RGB')
    dark = sum(ball.getpixel((round(ball.width*.3), round(ball.height*.5))))
    offsets = [-17, -8, 8, 17]
    expected = [[0,0,0,0],[0,0,0,1],[0,0,1,1],[0,1,1,1],
                [1,1,1,1],[1,1,1,0],[1,1,0,0],[1,0,0,0]][index]
    if south:
        expected = expected[::-1]
    actual = [int(sum(im.getpixel((round((24+x)*im.width/48),round(im.height/2)))) > dark+60) for x in offsets]
    h.ok(actual == expected, 'rendered Earth silhouette '+str(index)+(' south' if south else ' north')+': '+str(actual))


def setup(browser, width, seed, label, clock=False, speech=False):
    c, p = h.setup(browser, width, seed, label)
    if clock:
        c.add_init_script("""window.__mlNow='2026-10-15T12:00:00';const RealDate=Date;window.Date=class extends RealDate{constructor(...a){super(...(a.length?a:[window.__mlNow]));}static now(){return new RealDate(window.__mlNow).getTime();}};""")
    if speech:
        c.add_init_script("""window.__mlSpoken=[];window.__mlCanceled=0;const voice={name:'Synthetic local test voice',lang:'en-US',localService:true,default:true,voiceURI:'synthetic-local'};Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[voice],cancel:()=>window.__mlCanceled++,speak:u=>window.__mlSpoken.push(u.text),addEventListener(){},removeEventListener(){}}});window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};""")
    return c, p


def stale_click(p, handle):
    handle.evaluate("x=>{document.body.append(x);x.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));x.remove();}")


def main():
    seed = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {waitingNotebook} from './test/story-arrivals-checks.mjs';const s=waitingNotebook();s.sky=[{date:'2026-08-09',shape:'full'},{date:'2026-09-02',shape:'half-growing'},null,{date:'2027-01-01',shape:'full'}];s.hemisphere='north';s.syntheticOther={kept:'synthetic sibling'};console.log(JSON.stringify(s));"], cwd=ROOT, text=True))
    # These strings supply exact omission probes, not content correctness assertions.
    phases = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {moonlightPlaces} from './dist/moonlight-content.mjs';console.log(JSON.stringify(moonlightPlaces));"], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('MOONLIGHT_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *args):
                pass
        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    base = base.rstrip('/') + '/'
    with sync_playwright() as pw:
        args = {'headless': True, 'args': ['--disable-quic']}
        if os.environ.get('CHROME_PATH'):
            args['executable_path'] = os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**args)
        try:
            _, p = setup(browser, 820, seed, 'tablet', clock=True)
            go(p, base)
            h.click(p, '[data-sky-month="earlier"]')
            h.click(p, '[data-sky-save]')
            parent_status = p.locator('#sky-status').inner_text()
            h.click(p, '[data-sky-shape="fat-shrinking"]')
            # Keep a meaningful parent status with a pending draft.
            h.click(p, '[data-sky-hemisphere="south"]')
            parent_status = p.locator('#sky-status').inner_text()
            parent_month = p.locator('#sky-month-title').inner_text()
            parent_hear = p.locator('[data-sky-hear] [data-speak]').element_handle()
            parent_edit = p.locator('[data-sky-shape="full"]').element_handle()
            parent_save = p.locator('[data-sky-save]').element_handle()
            parent_link = p.locator('.sky-links a').first.element_handle()
            baseline, raw = storage(p), notebook_bytes(p)
            enter(p)
            h.ok(selected(p) == '0', 'new visit starts at right-side new Moon, hidden')
            hidden(p, phases[0])
            h.ok(p.locator(CHILD + ' [data-speak]').count() == 1, 'one current-page Hear')
            for handle in [parent_edit, parent_save, parent_hear, parent_link]:
                stale_click(p, handle)
            h.ok(p.url.endswith('#almanac/sky') and selected(p) == '0' and notebook_bytes(p) == raw, 'retired parent edits, Save, Hear and links cannot act while child active')
            layout(p)
            control = p.locator('[data-ml-action="next"]').element_handle()
            for flag in ['hidden', 'disabled']:
                control.evaluate('(x,flag)=>{x[flag]=true;x.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));x[flag]=false;}', flag)
                h.ok(selected(p) == '0', flag + ' control cannot change model')
            control.evaluate('x=>{const parent=x.parentNode,after=x.nextSibling;x.remove();parent.insertBefore(x,after);x.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));}')
            h.ok(selected(p) == '0', 'detached and reinserted current control remains retired')
            action(p, 'reveal')
            h.ok('Southern-style drawing' in p.locator(EARTH).inner_text(), 'first model seeds existing southern setting')
            for i, name in enumerate(NAMES):
                h.click(p, f'[data-ml-place="{i}"]')
                h.ok(selected(p) == str(i) and p.locator(f'[data-ml-place="{i}"]').get_attribute('aria-label') == PLACES[i], 'place selection and finite accessible location')
                h.ok(name in p.locator(EARTH).inner_text(), 'independent phase mapping ' + str(i))
                h.ok(name in spoken(p), 'Hear follows elected phase')
                silhouette(p, i, True)
                action(p, 'flip')
                silhouette(p, i, False)
                action(p, 'flip')
                action(p, 'reveal')
                hidden(p, phases[i])
                action(p, 'reveal')
            action(p, 'next')
            h.ok(selected(p) == '0', 'Next wraps counterclockwise cycle')
            p.locator('[data-ml-action="previous"]').focus()
            p.keyboard.press('Enter')
            h.ok(selected(p) == '7' and p.locator('[data-ml-action="previous"]').evaluate('x=>x===document.activeElement'), 'keyboard Previous wraps and holds focus')
            action(p, 'flip')
            h.ok('Northern-style drawing' in p.locator(EARTH).inner_text() and NAMES[7] in p.locator(EARTH).inner_text(), 'flip changes only drawing orientation')
            tasks = []
            for _ in range(4):
                tasks.append(p.locator('#ml-task').inner_text())
                action(p, 'invitation')
                h.ok(selected(p) == '7' and NAMES[7] in p.locator(EARTH).inner_text(), 'invitation leaves model exact')
            h.ok(len(set(tasks)) == 4 and p.locator('#ml-task').inner_text() == tasks[0], 'four invitations cycle')
            retired = p.locator('[data-ml-action="next"]').element_handle()
            action(p, 'teaching')
            h.ok(p.locator('#ml-task').evaluate('x=>x===document.activeElement'), 'teaching heading receives focus')
            for i, title in enumerate(HELP):
                text = p.locator(CHILD).inner_text()
                h.ok(title in text and all(other not in text for other in HELP if other != title), 'only current teaching page mounted')
                h.ok(not p.locator('[data-ml-place],[data-ml-action="reveal"],[data-ml-action="flip"],[data-ml-action="invitation"]').count(), 'teaching board is static and separate')
                h.ok('Separate example' in text and title in spoken(p), 'current separate example narrated')
                h.ok(p.locator(EARTH + ' svg').count() == (2 if i == 3 else 1), 'last teaching page compares both styles')
                prev = p.locator('[data-ml-action="step"][data-ml-step="' + str(max(0, i-1)) + '"]')
                if i == 0:
                    h.ok(p.get_by_role('button', name='Previous step', exact=True).is_disabled(), 'teaching first boundary disabled')
                if i < 3:
                    h.click(p, f'[data-ml-action="step"][data-ml-step="{i+1}"]')
            h.ok(p.get_by_role('button', name='Next step', exact=True).is_disabled(), 'teaching final boundary disabled')
            stale_click(p, retired)
            h.ok(HELP[3] in p.locator(CHILD).inner_text(), 'retired exploration control cannot change teaching')
            action(p, 'explore')
            h.ok(selected(p) == '7' and 'Northern-style drawing' in p.locator(EARTH).inner_text(), 'help restores own selected phase and flip')
            h.ok(storage(p) == baseline and notebook_bytes(p) == raw, 'all same-day model operations leave every storage key and notebook byte exact')
            h.snap(p, 'tablet-model')
            retired_back = p.locator('[data-ml-action="back"]').first.element_handle()
            action(p, 'back')
            h.ok(p.locator('[data-moonlight-entry]').evaluate('x=>x===document.activeElement'), 'Back focuses parent entry')
            h.ok(p.locator('[data-sky-shape="fat-shrinking"]').get_attribute('aria-pressed') == 'true' and p.locator('#sky-month-title').inner_text() == parent_month and p.locator('#sky-status').inner_text() == parent_status, 'Back preserves pending parent shape, month and status')
            # Parent setting changes are explicit writes, but cannot re-seed local work.
            h.click(p, '[data-sky-hemisphere="north"]')
            h.click(p, '[data-sky-hemisphere="south"]')
            enter(p)
            h.ok(selected(p) == '7' and 'Northern-style drawing' in p.locator(EARTH).inner_text(), 'reentry retains local work after parent setting change')
            stale_click(p, retired_back)
            h.ok(p.locator(CHILD).count() == 1, 'retired Back cannot navigate a later child root')
            midnight_before = storage(p)
            midnight_raw = notebook_bytes(p)
            p.evaluate("window.__mlNow='2026-10-16T12:00:00'")
            action(p, 'next')
            action(p, 'back')
            changed = {k for k in set(midnight_before) | set(storage(p)) if midnight_before.get(k) != storage(p).get(k)}
            h.ok(changed <= {'learning-garden-rooms-v1:'+h.active(p)} and notebook_bytes(p) == midnight_raw, 'midnight allows only existing room date bookkeeping: '+repr(changed))
            rooms_key = 'learning-garden-rooms-v1:'+h.active(p)
            if rooms_key in changed:
                before_rooms, after_rooms = json.loads(midnight_before[rooms_key]), json.loads(storage(p)[rooms_key])
                h.ok(after_rooms == {**before_rooms, 'since':before_rooms['lastDay'], 'lastDay':'2026-10-16'}, 'only existing rooms daily since/lastDay fields change')
            h.click(p, '[data-sky-save]')
            h.ok('date on this device changed' in p.locator('#sky-status').inner_text() and p.locator('[data-sky-save]').is_disabled() and notebook_bytes(p) == midnight_raw, 'actual parent Save refuses date rollover without saving draft')
            # Route departure clears work; actual Notes export contains earlier raw observations.
            exported = h.download(p, base, 'moonlight-notes')
            h.ok(h.raw_report(exported) == json.loads(midnight_raw), 'Notes download preserves whole actual notebook with no model records')
            go(p, base)
            enter(p)
            h.ok(selected(p) == '0' and not p.locator(EARTH + ' svg').count(), 'route departure clears model')
            h.go(p, base, '#notes', '#progress-file')
            p.locator('#progress-file').set_input_files({'name':'synthetic-moonlight.json','mimeType':'application/json','buffer':json.dumps(exported).encode()})
            h.click(p, '#progress-import-confirm')
            p.locator('#progress-import-status').wait_for()
            go(p, base)
            enter(p)
            h.ok(selected(p) == '0' and h.book(p)['sky'] == seed['sky'], 'actual import opens clean model and preserves raw sky entries')
            owner = h.active(p)
            h.click(p, '#explorer-switch')
            h.click(p, '#explorer-new')
            h.click(p, '#explorer-create')
            p.locator('[data-sky-root]').wait_for()
            enter(p)
            h.ok(h.active(p) != owner and selected(p) == '0', 'owner change clears model')
            action(p, 'next')
            h.go(p, base, '#notes', '#reset')
            h.click(p, '#reset')
            h.click(p, '#confirm-reset')
            go(p, base)
            enter(p)
            h.ok(selected(p) == '0' and 'sky' not in h.book(p), 'actual reset clears model without creating observations')
            # Only layout samples are repeated at the other screen widths.
            for width in [320, 1024]:
                _, q = setup(browser, width, seed, f'layout-{width}')
                go(q, base)
                enter(q)
                layout(q)
                action(q, 'reveal')
                h.ok(q.locator(EARTH + ' svg').first.bounding_box()['width'] <= 220.5, 'bounded Earth disk')
                h.snap(q, f'moonlight-{width}')
            # Separate local synthetic speech context: no automatic speech, current
            # page only, cancellation and detached/reinserted Hear suppression.
            _, s = setup(browser, 820, seed, 'speech', speech=True)
            go(s, base)
            old_parent_hear = s.locator('[data-sky-hear] [data-speak]').element_handle()
            enter(s)
            h.ok(s.evaluate('window.__mlSpoken.length') == 0, 'speech requires explicit Hear tap')
            stale_click(s, old_parent_hear)
            h.ok(s.evaluate('window.__mlSpoken.length') == 0, 'retired parent Hear cannot reach local sink')
            h.click(s, CHILD + ' [data-speak]')
            h.ok(s.evaluate('window.__mlSpoken.length') == 1 and NAMES[0] not in s.evaluate('window.__mlSpoken.at(-1)'), 'hidden Hear reaches local sink without current phase')
            old_hear = s.locator(CHILD + ' [data-speak]').element_handle()
            cancellations = s.evaluate('window.__mlCanceled')
            action(s, 'reveal')
            h.ok(s.evaluate('window.__mlCanceled') > cancellations, 'meaningful action cancels speech')
            stale_click(s, old_hear)
            h.ok(s.evaluate('window.__mlSpoken.length') == 1, 'retired child Hear cannot speak')
            h.click(s, CHILD + ' [data-speak]')
            h.ok(NAMES[0] in s.evaluate('window.__mlSpoken.at(-1)'), 'revealed Hear speaks elected current phase')
            action(s, 'teaching')
            h.click(s, CHILD + ' [data-speak]')
            h.ok(HELP[0] in s.evaluate('window.__mlSpoken.at(-1)') and HELP[1] not in s.evaluate('window.__mlSpoken.at(-1)'), 'teaching Hear speaks only current example')
            # Storage unavailable/off are separate platform faults, never substitute
            # a permissive predicate or change a module implementation.
            for mode in ['unreadable', 'failure', 'off']:
                odd = dict(seed)
                if mode == 'unreadable':
                    odd['sky'], odd['hemisphere'] = {'kept':'earlier sky'}, {'kept':'earlier setting'}
                _, f = setup(browser, 820, odd, mode)
                go(f, base)
                if mode == 'failure':
                    f.evaluate("()=>{Storage.prototype.setItem=function(){throw new DOMException('Synthetic storage full','QuotaExceededError')};}")
                if mode == 'off':
                    h.go(f, base, '#notes', '#remember')
                    h.click(f, '#remember')
                    h.click(f, '[data-confirm-do]')
                    f.evaluate("location.hash='#almanac/sky'")
                    f.locator('[data-sky-root]').wait_for()
                before = storage(f)
                enter(f)
                action(f, 'next')
                action(f, 'reveal')
                action(f, 'flip')
                h.ok(NAMES[1] in f.locator(EARTH).inner_text() and storage(f) == before, mode + ': model remains usable without writing storage')
            h.ok(not h.errors and not h.console_errors and not h.request_failures and not h.http_failures, 'no browser/page/transport failures: ' + json.dumps([h.errors,h.console_errors,h.request_failures,h.http_failures]))
            (OUT / 'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'scope':'one native tablet journey; phone/wide layout samples; isolated local speech sink'}, indent=2))
            print(f'Moonlight browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT / 'failure.txt').write_text(traceback.format_exc())
            for page, label in h.pages:
                if not page.is_closed():
                    try:
                        page.screenshot(path=str(OUT / (label + '-failure.png')), full_page=True)
                        (OUT / (label + '-failure.html')).write_text(page.content())
                    except Exception:
                        pass
            raise
        finally:
            for c in h.contexts:
                c.close()
            browser.close()
            if server:
                server.shutdown()


if __name__ == '__main__':
    main()
