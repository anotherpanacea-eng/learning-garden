"""Which values fit380: real-app Chromium play and Notes transfer.

One tablet journey and a phone sample use real application navigation. An
explicitly isolated actual-UI harness exercises otherwise unreachable context
replacement and export refusal. Invented notebooks only; this does not qualify
physical Safari/iPad, VoiceOver, audible speech or learning outcomes.
"""
import sys
sys.dont_write_bytecode = True
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('INEQUALITY_ARTIFACTS', tempfile.mkdtemp(prefix='inequality-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
_spec = importlib.util.spec_from_file_location('inequality_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(native)
h = native.h
ROUTE = '#learn/math/equality'


def sel(name, value=None):
    return '[data-ineq-' + name + ('="' + str(value) + '"' if value is not None else '') + ']'


def click(p, name, value=None):
    h.click(p, sel(name, value))


def enter(p, base=None):
    if base:
        h.go(p, base, ROUTE, '[data-equality-inequality]')
    h.click(p, '[data-equality-inequality]')
    p.locator(sel('root')).wait_for()


def records(p):
    return h.book(p).get('inequalitySheets', [])


def family(p, identity):
    fold = p.locator('[data-ineq-families]')
    if fold.get_attribute('open') is None:
        fold.locator('summary').click()
    p.locator(sel('family')).select_option(identity)
    h.ok(p.locator('[data-ineq-families]').get_attribute('open') is not None, 'family chooser stays open after its explicit selection')


def fixture():
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', '''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startEquality,pageEquality,editEquality} from './dist/equality-desk-core.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={payload:'Invented sibling remains exact'};
const o={canExport:()=>true};startEquality(base,'twins',o);pageEquality(base,3,o);
editEquality(base,'note','An invented waiting explanation.',o);
console.log(JSON.stringify(base));
'''], cwd=ROOT, text=True))


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal page overflow')
    bad = p.locator('[data-ineq-root] button,[data-ineq-root] a,[data-ineq-root] summary,[data-ineq-root] select').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().width<44||e.getBoundingClientRect().height<44||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))''')
    h.ok(not bad, 'visible controls have44px targets and16px text: ' + str(bad))


def near(actual, expected, label):
    h.ok(len(actual) == len(expected) and all(abs(a-b) < .03 for a, b in zip(actual, expected)), label + ': ' + str(actual))


def ray(p, which, boundary, direction, inclusive):
    svg = p.locator(sel('ray', which))
    h.ok(svg.count() == 1, 'one separate ' + which + ' ray')
    h.ok(svg.get_attribute('viewBox') == '0 0 700 160', 'ray uses the specified readable world')
    endpoint = svg.locator('[data-ineq-endpoint]')
    x = 60 + (boundary+6)*580/12
    near(endpoint.evaluate('e=>[+e.getAttribute("cx"),+e.getAttribute("cy")]'), [x, 65], 'rendered endpoint follows the selected boundary')
    fill = endpoint.get_attribute('fill')
    h.ok((fill not in ['white', '#fff', '#ffffff', 'none', 'transparent']) == inclusive, 'filled versus hollow endpoint follows inclusion')
    polygon = svg.locator('[data-ineq-arrow]').get_attribute('points')
    pts = [float(n) for n in polygon.replace(',', ' ').split()]
    tip = 60 if direction == 'lower' else 640
    near(pts[:2], [tip, 65], 'ray points toward the intended unbounded side')
    h.ok(all((q > tip if direction == 'lower' else q < tip) for q in [pts[2], pts[4]]), 'ray arrow wings lie behind its tip')
    segment = svg.locator('[data-ineq-segment]').evaluate('e=>[+e.getAttribute("x1"),+e.getAttribute("x2")]')
    near(segment, [78, x] if direction == 'lower' else [x, 622], 'continuous ray reaches the boundary and ends its stem at the arrow base')
    sizes = svg.locator('text').evaluate_all('''xs=>xs.map(e=>{const m=e.getScreenCTM();return parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.a,m.b)})''')
    h.ok(sizes and min(sizes) >= 15.9, 'effective SVG number labels are at least16px')
    labels = svg.locator('text').all_text_contents()
    h.ok(labels == ['-6', '-4', '-2', '0', '2', '4', '6'] or labels == ['−6', '−4', '−2', '0', '2', '4', '6'], 'integer ticks identify the window without reducing the continuous ray to points')


def stop_voice(p):
    if p.locator('[data-stop-speech]').count():
        h.click(p, '[data-stop-speech]')


def journey(browser, base, seed):
    print('Which values fit: actual tablet journey', flush=True)
    _, p = native.setup(browser, seed, 'tablet')
    h.go(p, base, ROUTE, '[data-equality-inequality]')
    p.locator('[data-equality-field="note"]').fill('A waiting synthetic note remains available.')
    before = h.book(p)
    enter(p)
    h.ok('inequalitySheets' not in h.book(p), 'entry/render leaves the new root absent')
    bounds(p)
    family(p, 'negative-less')
    click(p, 'turn', 'draw')
    p.locator(sel('boundary')).select_option('0')
    p.locator(sel('direction', 'lower')).tap()
    p.locator(sel('inclusive', 'false')).focus(); p.keyboard.press('Enter')
    p.locator(sel('probe')).select_option('2')
    ray(p, 'learner', 0, 'lower', False)
    h.ok(p.locator('[data-ineq-fit]').inner_text() == 'Fits' and p.locator('[data-ineq-in-ray]').inner_text() == 'Excludes 2', 'the same test value fits the actual negative rule but is excluded by the unexpected learner ray')
    cells = p.locator(sel('probe-result')+' td').all_text_contents()
    h.ok(cells[0] == '2' and any('-1 < 7' in cell for cell in cells), 'rendered probe arithmetic independently gives negative two times two plus three equals negative one')
    p.locator(sel('probe')).select_option('-2')
    h.ok(p.locator('[data-ineq-fit]').inner_text() == 'Does not fit', 'strict rule excludes the exact source boundary')
    p.locator(sel('probe')).select_option('-1.5')
    h.ok(p.locator('[data-ineq-fit]').inner_text() == 'Fits', 'a fractional value above the source boundary fits the negative-coefficient rule')
    p.locator(sel('probe')).select_option('2')
    click(p, 'reference')
    ray(p, 'reference', -2, 'higher', False)
    ray(p, 'learner', 0, 'lower', False)
    text = p.locator(sel('root')).inner_text().lower()
    h.ok('negative' in text and 'reverse' in text and 'divide' in text, 'source reasoning explains negative division while preserving the learner ray')
    click(p, 'hear')
    speech = p.locator(sel('hear')).get_attribute('data-speak') or ''
    h.ok('greater than' in speech.lower() or 'less than' in speech.lower(), 'Hear uses comparison words')
    stop_voice(p)
    click(p, 'keep')
    first = copy.deepcopy(records(p)[0])
    h.ok(first['work']['boundary'] == 0 and first['work']['direction'] == 'lower' and not first['work']['inclusive'], 'Keep preserves the unexpected learner ray')
    h.ok(first['work']['probe'] == 2 and first['work']['referenceShown'], 'Keep preserves selected probe and elected reasoning')
    unchanged = copy.deepcopy(h.book(p)); unchanged.pop('inequalitySheets')
    h.ok(unchanged == before, 'child play and Keep leave every other notebook root exact')
    click(p, 'shelf')
    click(p, 'card', first['id'])
    h.ok(p.locator(sel('boundary')).is_disabled() and p.locator(sel('probe')).is_disabled(), 'frozen sheet disables changes to probe and ray')
    h.ok(p.locator(sel('reference')).count() == 0 or p.locator(sel('reference')).is_disabled(), 'frozen view cannot add reasoning exposure')
    ray(p, 'learner', 0, 'lower', False)
    click(p, 'turn', 'try')
    h.ok(records(p) == [first], 'frozen view navigation does not alter the saved record')
    click(p, 'copy')
    click(p, 'turn', 'draw')
    p.locator(sel('boundary')).select_option('-2')
    click(p, 'direction', 'higher')
    click(p, 'inclusive', 'true')
    click(p, 'keep')
    h.ok(records(p)[0] == first and len(records(p)) == 2, 'editing a copy adds an independent sheet without changing the original')
    click(p, 'draft')
    family(p, 'positive-more')
    click(p, 'another')
    h.ok(records(p)[0] == first, 'changing family and source never regrades earlier sheets')
    click(p, 'back')
    p.locator('[data-equality-field="note"]').wait_for()
    h.ok(p.locator('[data-equality-field="note"]').input_value() == 'A waiting synthetic note remains available.', 'return is a working mode button and restores the waiting equality note')
    h.ok(h.book(p)['equalityDesk'] == before['equalityDesk'], 'equality notebook stays exact through child mode return')
    enter(p)
    h.ok(p.locator(sel('family')).input_value() == 'positive-more', 'reopening resumes the waiting child draft during this page session')
    p.screenshot(path=str(OUT/'tablet.png'), full_page=True)
    exported = native.download(p, base, 'kept-inequality-sheets')
    h.ok(exported['inequalitySheets'] == records(p), 'actual Notes download contains exact kept sheets')
    return first, exported


def transfer(browser, base, seed, first, exported):
    print('Which values fit: actual Notes import and historical source', flush=True)
    old = copy.deepcopy(first)
    old.update(id='inequality-sheet-80', futureOuter={'originalOnly': True})
    old['source'].update(id='earlier"source\\id', title='Earlier <rule> & "marks"', a=-3, b=4, c=1, relation='le', futureSource={'unchanged': True})
    old['work'].update(probe=1, boundary=.5, direction='lower', inclusive=False, referenceShown=False, futureWork={'unchanged': True})
    mixed = copy.deepcopy(exported)
    mixed['inequalitySheets'] = [{'id':'inequality-sheet-900','v':99,'raw':'Invented unavailable sheet'}, old] + [{'id':'inequality-sheet-'+str(i),'v':99} for i in range(81, 88)] + [first]
    _, p = native.setup(browser, seed, 'transfer')
    h.go(p, base, '#notes', '#progress-file')
    identity = h.active(p); original = h.book(p)
    p.locator('#progress-file').set_input_files({'name':'synthetic-inequality-sheets.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
    p.locator('#progress-import-confirm').wait_for()
    h.ok('Which values fit' in p.locator('.import-preview').inner_text(), 'import preview identifies the new saved owner')
    h.click(p, '#progress-import-confirm')
    enter(p, base)
    h.ok(h.active(p) != identity, 'actual import creates a separate explorer')
    click(p, 'shelf')
    click(p, 'page', '-1')
    click(p, 'card', old['id'])
    h.ok(old['source']['title'] in p.locator(sel('root')).inner_text(), 'historical source title renders literally and is escaped')
    h.ok(p.locator(sel('ray', 'reference')).count() == 0, 'frozen historical source does not invent unshown reasoning')
    ray(p, 'learner', .5, 'lower', False)
    click(p, 'copy')
    click(p, 'turn', 'draw')
    click(p, 'reference')
    ray(p, 'reference', 1, 'higher', True)
    click(p, 'keep')
    last = records(p)[-1]
    h.ok(last['id'] == 'inequality-sheet-901', 'unreadable canonical IDs reserve future allocation')
    h.ok(last['source'] == old['source'] and last['work']['futureWork'] == old['work']['futureWork'] and 'futureOuter' not in last, 'copy retains source/work unknown fields without propagating outer extras')
    redownload = native.download(p, base, 'historical-redownload')
    h.ok(redownload['inequalitySheets'][:-1] == mixed['inequalitySheets'], 'real Notes roundtrip preserves all historical and unreadable sibling records exactly')
    h.click(p, '#explorer-switch'); h.click(p, '[data-select-explorer="'+identity+'"]')
    h.ok(h.book(p) == original, 'import/copy leaves the original explorer unchanged')


def phone(browser, base, seed):
    print('Which values fit: phone layout and keyboard sample', flush=True)
    _, p = native.setup(browser, seed, 'phone', width=320)
    enter(p, base)
    click(p, 'turn', 'draw')
    bounds(p)
    ray(p, 'learner', 0, 'lower', False)
    p.locator(sel('inclusive', 'true')).focus(); p.keyboard.press('Enter')
    ray(p, 'learner', 0, 'lower', True)
    h.ok(p.locator(sel('inclusive', 'true')).evaluate('e=>e===document.activeElement'), 'keyboard choice retains useful control focus')
    p.locator(sel('probe')).select_option('6')
    h.ok(p.locator(sel('step', '1')).is_disabled(), 'last halfstep has a disabled higher probe control')
    p.locator(sel('step', '-1')).tap()
    h.ok(p.locator(sel('probe')).input_value() == '5.5', 'native phone tap moves by the intended half unit')
    p.screenshot(path=str(OUT/'phone.png'), full_page=True)


def lifecycle(browser, base, seed):
    print('Which values fit: isolated actual-UI external-context harness', flush=True)
    _, p = native.setup(browser, seed, 'external-context-harness')
    enter(p, base)
    setup = '''async seed=>{
      const parent=await import('./equality-desk-ui.mjs'),ui=await import('./inequality-ui.mjs');
      const media=await import('./play-media.mjs'),transfer=await import('./progress-transfer.mjs');
      const mount=document.querySelector('main');mount.replaceChildren();
      const h={book:structuredClone(seed),owner:'synthetic-owner',active:true,allow:true,saves:0};
      h.book.inequalitySheets=[];h.original=h.book;
      h.render=()=>{mount.innerHTML=parent.equalityPage(h.book,h.owner);parent.bindEquality(h.book,{
        notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,
        save:()=>{h.saves++;return {enabled:true,ok:true}},render:h.render,
        canExport:c=>h.allow&&transfer.prepareProgressImport(JSON.stringify(c)).ok,
        focus:s=>document.querySelector(s)?.focus()
      });media.bindSpeech()};
      ui.openInequality(h.book,h.owner);window.ineqHarness=h;h.render();
    }'''

    def install():
        p.evaluate(setup, seed)
        p.locator(sel('root')).wait_for()

    def dispatch(handle):
        handle.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')

    install()
    click(p, 'turn', 'draw')
    p.locator(sel('boundary')).select_option('1')
    p.evaluate('ineqHarness.allow=false')
    before = p.evaluate('JSON.stringify(ineqHarness.book)')
    click(p, 'keep')
    h.ok(p.evaluate('JSON.stringify(ineqHarness.book)') == before and p.evaluate('ineqHarness.saves') == 0, 'explicit rejected Notes preflight leaves the complete notebook exact')
    h.ok(p.locator(sel('boundary')).input_value() == '1' and 'download' in p.locator('#ineq-status').inner_text().lower(), 'refusal preserves local draft and offers recovery')

    for fault in ['owner', 'book', 'inactive', 'raw-identity', 'raw-content', 'root', 'control-parent']:
        install()
        button = p.locator(sel('keep')).element_handle()
        if fault == 'owner': p.evaluate('ineqHarness.owner="different-synthetic-owner"')
        elif fault == 'book': p.evaluate('ineqHarness.book=structuredClone(ineqHarness.book)')
        elif fault == 'inactive': p.evaluate('ineqHarness.active=false')
        elif fault == 'raw-identity': p.evaluate('ineqHarness.book.inequalitySheets=[]')
        elif fault == 'raw-content': p.evaluate('ineqHarness.book.inequalitySheets.push({synthetic:"external raw addition"})')
        elif fault == 'root': p.locator(sel('root')).evaluate('e=>{const clone=e.cloneNode(true);e.replaceWith(clone)}')
        elif fault == 'control-parent': button.evaluate('e=>{const box=document.createElement("section");e.closest("[data-ineq-root]").append(box);box.append(e)}')
        before = p.evaluate('JSON.stringify([ineqHarness.original,ineqHarness.book])')
        dispatch(button)
        h.ok(p.evaluate('JSON.stringify([ineqHarness.original,ineqHarness.book])') == before and p.evaluate('ineqHarness.saves') == 0, 'stale '+fault+' Keep is inert in both original and current notebook')

    install()
    stale_root = p.locator(sel('root')).element_handle()
    stale_keep = p.locator(sel('keep')).element_handle()
    click(p, 'back')
    # Reattach the original child DOM while retaining its old callbacks. The
    # current parent mode is equality; DOM connectivity alone must not suffice.
    stale_root.evaluate('e=>document.querySelector("main").append(e)')
    before = p.evaluate('JSON.stringify(ineqHarness.book)')
    dispatch(stale_keep)
    h.ok(p.evaluate('JSON.stringify(ineqHarness.book)') == before and p.evaluate('ineqHarness.saves') == 0, 'retained child controls cannot write after returning to parent mode')

    install()
    fold = p.locator(sel('fold', 'teaching')).element_handle()
    fold.evaluate('e=>{e.originalParent=e.parentNode;const box=document.createElement("section");e.closest("[data-ineq-root]").append(box);box.append(e);e.open=true}')
    p.wait_for_timeout(40)
    fold.evaluate('e=>e.originalParent.append(e)')
    p.evaluate('ineqHarness.render()')
    h.ok(p.locator(sel('fold', 'teaching')).get_attribute('open') is None, 'reparented fold cannot retain elected open state')

    install()
    hear = p.locator(sel('hear')).element_handle()
    hear.evaluate('e=>document.body.append(e)')
    # Test the real guard before the ordinary global speech binding. This checks
    # that no prevented stale passage reaches bubble listeners, not audibility.
    hear.evaluate('e=>{window.ineqStaleHearReached=false;e.addEventListener("click",()=>{window.ineqStaleHearReached=true})}')
    dispatch(hear)
    h.ok(not p.evaluate('ineqStaleHearReached'), 'reparented Hear is stopped before ordinary speech handlers')


def saving_off(browser, base, seed):
    print('Which values fit: actual saving-off recovery', flush=True)
    _, p = native.setup(browser, seed, 'saving-off')
    h.go(p, base, '#notes', '#remember')
    p.locator('#remember').uncheck()
    p.evaluate('location.hash="#learn/math/equality"')
    p.locator('[data-equality-inequality]').wait_for()
    enter(p)
    # Turning saving off deliberately removes the explorer registry, so the
    # ordinary persisted-book helper no longer applies. Inspect storage itself.
    old_storage = p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')
    click(p, 'keep')
    status = p.locator('#ineq-status').inner_text().lower()
    h.ok('open page' in status and 'saving is off' in status and 'download' in status, 'Keep truthfully identifies session-only persistence when saving is off')
    h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())') == old_storage, 'saving-off Keep does not change device storage')
    recovered = native.download(p, base, 'saving-off-recovery')
    h.ok(len(recovered['inequalitySheets']) == 1, 'actual Notes download recovers the in-memory sheet with saving off')


def main():
    seed = fixture(); server = None; base = os.environ.get('INEQUALITY_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            protocol_version = 'HTTP/1.1'
            def log_message(self, *args): pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size = 128
            daemon_threads = True
        server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = 'http://127.0.0.1:'+str(server.server_port)+'/'
    base = base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=os.environ.get('CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'), args=['--disable-quic'])
        try:
            first, exported = journey(browser, base, seed)
            transfer(browser, base, seed, first, exported)
            phone(browser, base, seed)
            lifecycle(browser, base, seed)
            saving_off(browser, base, seed)
            h.ok(not h.errors, 'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors, 'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures, 'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'scope':__doc__}, indent=2))
            print('Which values fit browser: '+str(h.checks)+' assertions passed; artifacts '+str(OUT))
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for p, label in h.pages:
                if not p.is_closed():
                    try:
                        p.screenshot(path=str(OUT/(label+'-failure.png')), full_page=True)
                        (OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception: pass
            raise
        finally:
            for c in h.contexts:
                try: c.close()
                except Exception: pass
            browser.close()
            if server: server.shutdown()


if __name__ == '__main__':
    main()
