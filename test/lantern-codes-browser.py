"""Synthetic Lantern Codes journeys through the real app, speech and notebook transfer."""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import threading

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('CODES_ARTIFACTS', '/tmp/lantern-codes-browser'))
OUT.mkdir(parents=True, exist_ok=True)
checks = 0
errors = []


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def node(source, *args):
    return json.loads(subprocess.check_output(
        ['node', '--input-type=module', '-e', source, *map(json.dumps, args)],
        cwd=ROOT, text=True))


fixture = node("""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startPostOffice,setPostPackingInput} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;
startPostOffice(s,deliveries[0].id);setPostPackingInput(s,'17');
console.log(JSON.stringify(s));
""")


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class PreviewServer(http.server.ThreadingHTTPServer):
    request_queue_size = 128


def book(p):
    return p.evaluate('()=>window.__codesRead()')


def root(p):
    return book(p)['lanternCodes']


def work(p):
    r = root(p)
    return r['visits'][r['current']]


def last(p):
    return work(p)['tests'][-1]


def click(p, selector):
    p.locator(selector).click()


def turn(p, name):
    click(p, f'.codes-pages [data-code-page="{name}"]')


def go(p, base):
    p.goto(base + '#post/codes')
    p.locator('[data-codes-root]').wait_for()


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no page overflow')
    small = p.locator('.codes-page button,.codes-page a,.codes-page summary').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&"
        "(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44))"
        ".map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not small, '44px visible targets: ' + str(small))


def setup(browser, width, seed=None):
    context = browser.new_context(viewport={'width': width, 'height': 1000},
                                  has_touch=True, accept_downloads=True,
                                  reduced_motion='reduce')
    context.add_init_script('('+r"""seed=>{
      if(!localStorage.getItem('codes-synthetic-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('codes-synthetic-fixture','1');
      }
      window.__codesRefuse=false;window.__codesSpoken=[];
      window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
      Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},
        getVoices(){return [{name:'Synthetic English',lang:'en-US',localService:true,default:true,voiceURI:'synthetic'}]},
        speak(u){const s=window.__codesRead(),r=s.lanternCodes;
          window.__codesSpoken.push({text:u.text,support:r?.visits[r.current]?.support.slice()??[]});
          queueMicrotask(()=>u.onstart?.());},addEventListener(){},removeEventListener(){}}});
    }"""+')('+json.dumps(seed if seed is not None else fixture)+')')

    def app(route):
        response = route.fetch()
        body = response.text()
        assert 'let graph=null,' in body, 'host read seam changed'
        body = body.replace('let graph=null,',
                            'window.__codesRead=()=>structuredClone(state);let graph=null,', 1)
        needle = 'bindCodes(state,{save,render,focus:focusElement,canExport:priceOptions().canExport,'
        assert needle in body, 'host preflight seam changed'
        body = body.replace(needle,
            'bindCodes(state,{save,render,focus:focusElement,canExport:c=>!window.__codesRefuse&&priceOptions().canExport(c),', 1)
        route.fulfill(response=response, body=body)

    context.route('**/app.mjs', app)
    page = context.new_page()
    page.set_default_timeout(10000)
    page.on('pageerror', lambda error: errors.append(str(error)))
    return context, page


def send(p, outcome):
    click(p, '[data-code-test="send"]')
    ok(last(p)['rows'][0]['outcome'] == outcome, 'actual receiver outcome ' + outcome)
    ok(p.locator('#code-result-heading').evaluate('x=>document.activeElement===x'), 'result receives focus')


def journey(browser, width, base):
    c, p = setup(browser, width)
    try:
        go(p, base)
        before = book(p)
        ok('lanternCodes' not in before, 'preview does not create a code record')
        ok(p.locator('.welcome-film').count() == 0, 'direct code route has no film')
        bounds(p)
        p.reload();p.locator('[data-codes-root]').wait_for()
        ok(book(p) == before, 'reloaded preview keeps exact notebook')
        click(p, '[data-code-start="blank"]')
        original_id = root(p)['current']
        ok(work(p)['page'] == 'learn', 'explicit start creates a learning visit')
        ok(p.locator('#code-heading').evaluate('x=>document.activeElement===x'), 'start receives local focus')
        turn(p, 'build')
        p.locator('[data-code-append="S"]').focus()
        p.keyboard.press('Enter')
        ok(work(p)['patterns']['safe'] == 'S', 'keyboard appends a short flash')
        ok(p.locator('[data-code-append="S"]').evaluate('x=>document.activeElement===x'), 'editor restores focus')
        turn(p, 'compare')
        partial_row = p.locator('.codes-comparison tbody tr').first.inner_text()
        ok('Not complete' in partial_row and 'Invisible' not in partial_row, 'partial reference code is unassigned, not rain-erased')
        turn(p, 'build')

        turn(p, 'send');send(p, 'no-card')
        first_test = copy.deepcopy(last(p))
        ok(first_test['card'] is None, 'no-card test freezes absent receiver agreement')
        click(p, '[data-code-share]');send(p, 'read')
        ok(work(p)['card']['water'] == '', 'partial shared card keeps unassigned entries')
        p.get_by_text('Compare your two cards', exact=True).click()
        ok('Not assigned' in p.locator('main').inner_text(), 'partial card labels unassigned messages')
        turn(p, 'build');click(p, '[data-code-select="water"]');click(p, '[data-code-append="L"]')
        click(p, '[data-code-share]');click(p, '[data-code-select="safe"]');click(p, '[data-code-clear]')
        click(p, '[data-code-append="L"]')
        ok(work(p)['card']['safe'] == 'S' and work(p)['patterns']['safe'] == 'L', 'edits retain Dot’s older copy')
        ok('earlier copy' in p.locator('.codes-shared').inner_text(), 'outdated agreement visible')
        turn(p, 'send');send(p, 'read-other')
        ok(last(p)['rows'][0]['candidates'] == ['water'], 'different decoded meaning shown from actual card')
        click(p, '[data-code-share]');send(p, 'ambiguous')
        ok(set(last(p)['rows'][0]['candidates']) == {'safe', 'water'}, 'all duplicate candidates retained')
        turn(p, 'build');click(p, '[data-code-clear]');click(p, '[data-code-append="S"]')
        turn(p, 'send');click(p, '[data-code-weather="rain"]');send(p, 'invisible')
        ok(last(p)['rows'][0]['observed'] == '', 'pretend rain transmits no hidden position cue')
        ok(p.locator('[data-code-trace]').count() == 0, 'invisible transmission has no trace flashes')
        ok(work(p)['tests'][0] == first_test, 'later sends never regrade first test')
        click(p, '[data-code-help="help"]');click(p, '[data-code-help="example"]')
        ok({'help', 'example'}.issubset(work(p)['support']), 'reveals record both requested supports')
        click(p, '[data-code-keep]')
        old_work = copy.deepcopy(work(p))
        turn(p, 'compare');bounds(p)
        ok(p.locator('.codes-comparison tbody tr').count() == 3, 'comparison includes current and two reference designs')
        costs = p.locator('.codes-comparison tbody tr td:first-of-type').all_text_contents()
        ok(costs[1:] == ['12', '36'], 'reference comparison labels sender cost')
        ok('matching receiver card' in p.locator('.codes-comparison').inner_text(), 'reference is separate from actual Dot card')
        p.locator('.codes-comparison details > summary').nth(1).click()
        click(p, '[data-code-start="b"]')
        robust_id = root(p)['current']
        ok(robust_id != original_id, 'preset copy creates a separate visit')
        previous = root(p)['visits'][original_id]
        ok(previous['patterns'] == old_work['patterns'] and previous['tests'] == old_work['tests'] and previous['kept'] == old_work['kept'], 'preset copy preserves prior designs and tests')
        ok(work(p)['card'] is None, 'new preset does not silently share a card')
        ok(work(p)['patterns'] == {'safe':'L','water':'LL','boards':'LLL','help':'LLLL'}, 'Code B is copied for editing')
        click(p, '[data-code-share]');turn(p, 'compare')
        click(p, '[data-code-test="all"]')
        ok(all(r['outcome']=='read' for r in last(p)['rows']), 'all-four actual clear test reads every message')
        ok(p.locator('.codes-goal').count() == 0, 'clear-only success does not claim the rain goal')
        click(p, '[data-code-weather="rain"]')
        click(p, '[data-code-test="all"]')
        ok(len(last(p)['rows']) == 4 and all(r['outcome']=='read' for r in last(p)['rows']), 'all-four actual rain test reads every message')
        ok(p.locator('.codes-goal').count() == 1, 'successful actual rain test offers stopping point')
        ok(last(p)['totalBeats'] == 36, 'test freezes full sender cost')
        frozen = copy.deepcopy(last(p))
        click(p, '[data-code-trace]')
        ok('trace' in work(p)['support'], 'manual trace stores support before revealing pointer')
        ok('Visible flash 1 of 1: long.' in p.locator('[data-code-trace-text]').inner_text(), 'manual trace uses visible flashes only')
        ok(p.locator('.codes-visible .pointed').count() == 1, 'one stationary pointer')
        ok(last(p) == frozen, 'manual trace leaves original help-before and results frozen')
        click(p, '[data-speak]')
        spoken = p.evaluate('window.__codesSpoken')
        ok(len(spoken) == 1 and 'audio' in spoken[0]['support'], 'real speech path sees audio support before playback')
        ok('audio' not in last(p)['helpBefore'], 'later narration does not rewrite test support')
        click(p, '[data-code-keep]')
        keep = copy.deepcopy(work(p)['kept'][0])
        bounds(p);p.screenshot(path=str(OUT/f'compare-rain-{width}.png'), full_page=True)
        turn(p, 'build');click(p, '[data-code-append="S"]');turn(p, 'compare')
        ok(p.locator('.codes-goal').count() == 0, 'edit removes current goal claim')
        ok('An earlier test' in p.locator('#code-result-heading').inner_text(), 'test after edit is labeled earlier')
        ok(last(p) == frozen and work(p)['kept'][0] == keep, 'changed design preserves test and kept card')
        p.get_by_text('Your code visits', exact=True).click()
        click(p, f'[data-code-resume="{original_id}"]')
        ok(work(p)['patterns'] == old_work['patterns'] and work(p)['tests'] == old_work['tests'], 'resume restores original work and original test results')
        p.get_by_text('Earlier tests and kept designs', exact=True).click()
        ok('5 readable tests; 1 readable kept designs.' in p.locator('.codes-history').inner_text(), 'earlier tests and kept design are available together')
        p.get_by_text('Your code visits', exact=True).click()
        click(p, f'[data-code-resume="{robust_id}"]')
        ok(last(p) == frozen and work(p)['kept'][0] == keep, 'return restores revised current card and separate kept design')
        stale = p.locator('[data-code-test="all"]').element_handle()
        turn(p, 'send')
        snapshot = book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == snapshot, 'detached control cannot repeat a test')
        stale = p.locator('[data-code-test="send"]').element_handle()
        p.goto(base+'#pathways/science');p.locator('[data-pathway-root]').wait_for()
        snapshot = book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == snapshot, 'route-stale control is inert')
        go(p, base)
        ok(p.locator('[data-codes-root]').count() == 1, 'codes route remains independently available')
        # The host preflight is toggled, preserving its actual success path otherwise.
        p.evaluate('window.__codesRefuse=true')
        snapshot = book(p)
        for selector in ['[data-code-share]', '[data-code-keep]', '[data-code-help="together"]', '[data-code-test="send"]']:
            click(p, selector)
            ok(book(p) == snapshot, 'preflight refusal preserves whole notebook: '+selector)
        count = len(p.evaluate('window.__codesSpoken'))
        click(p, '[data-speak]')
        ok(len(p.evaluate('window.__codesSpoken')) == count, 'refused audio never reaches playback')
        ok(book(p) == snapshot, 'refused audio preserves whole notebook')
        ok('exportable' in p.locator('#code-status').inner_text(), 'refusal explains how work was preserved')
        p.evaluate('window.__codesRefuse=false')
        turn(p, 'compare')
        snapshot = book(p);p.evaluate('window.__codesRefuse=true')
        trace = p.locator('[data-code-trace-text]').inner_text()
        click(p, '[data-code-trace]')
        ok(book(p) == snapshot and p.locator('[data-code-trace-text]').inner_text() == trace, 'refused trace reveals no new pointer')
        p.evaluate('window.__codesRefuse=false')
        # Real export/import controls and independent explorer records.
        saved = copy.deepcopy(root(p))
        initial = p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        p.goto(base+'#notes');p.locator('#download').wait_for()
        with p.expect_download() as downloaded:
            click(p, '#download')
        exported = json.loads(Path(downloaded.value.path()).read_text())
        ok(exported['lanternCodes'] == saved, 'actual notes download includes exact sources, tests and designs')
        ok('Lantern Codes' in p.locator('main').inner_text(), 'notes render the code destination')
        p.locator('#progress-file').set_input_files({'name':'synthetic-lantern-codes.json','mimeType':'application/json','buffer':json.dumps(exported).encode()})
        p.locator('#progress-import-confirm').wait_for()
        ok('Lantern Codes' in p.locator('.import-preview').inner_text(), 'actual import preview registers destination')
        click(p, '#progress-import-confirm')
        ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'real import completes')
        imported = p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        ok(imported != initial, 'import creates separate explorer')
        go(p, base)
        if p.locator('[data-select-explorer]').count():
            click(p, f'[data-select-explorer="{imported}"]')
        p.locator('[data-codes-root]').wait_for()
        ok(root(p) == saved, 'imported explorer restores exact code root')
        stale = p.locator('[data-code-test="all"]').element_handle()
        click(p, '[data-code-help="together"]')
        imported_codes = copy.deepcopy(root(p))
        click(p, '#explorer-switch');click(p, f'[data-select-explorer="{initial}"]')
        p.locator('[data-codes-root]').wait_for()
        ok(p.url.endswith('#post/codes'), 'explorer switch preserves requested code route')
        snapshot = book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == snapshot, 'old explorer control cannot change selected explorer')
        ok(root(p) == saved, 'original explorer retains its code root')
        click(p, '#explorer-switch');click(p, f'[data-select-explorer="{imported}"]')
        p.locator('[data-codes-root]').wait_for()
        ok(root(p) == imported_codes, 'imported explorer keeps its independent support change')
        p.reload();p.locator(f'[data-select-explorer="{imported}"]').wait_for()
        click(p, f'[data-select-explorer="{imported}"]');p.locator('[data-codes-root]').wait_for()
        ok(root(p) == imported_codes, 'reload and picker retain exact saved code state')
        # Removal is explicit and leaves the allocation counter monotonic.
        p.locator('details').filter(has=p.locator('[data-code-start="blank"]')).last.locator('summary').first.click()
        click(p, '[data-code-start="blank"]');turn(p, 'build')
        disposable = root(p)['current'];serial = root(p)['nextSerial']
        p.locator('details').filter(has=p.locator(f'[data-code-remove="{disposable}"]')).last.locator('summary').first.click()
        snapshot = book(p)
        p.once('dialog', lambda dialog: dialog.dismiss())
        click(p, f'[data-code-remove="{disposable}"]')
        ok(book(p) == snapshot, 'cancel removal writes nothing')
        confirmations = []
        def accept(dialog):
            confirmations.append(dialog.message);dialog.accept()
        p.once('dialog', accept);click(p, f'[data-code-remove="{disposable}"]')
        ok('0 tests and 0 kept designs' in confirmations[0], 'removal warning states exact retained record counts')
        ok(disposable not in root(p)['visits'] and root(p)['nextSerial'] == serial, 'confirmed removal deletes only selected visit and retains serial')
        ok(root(p)['visits'] == imported_codes['visits'], 'other visits survive confirmed removal exactly')
        bounds(p);p.screenshot(path=str(OUT/f'retained-visits-{width}.png'), full_page=True)
    finally:
        c.close()


def retained_preview(browser, base):
    seed = copy.deepcopy(fixture)
    seed['garden'] = {'avatar':'sky','guide':'synthetic-future-guide',
                      'visits':[{'id':'synthetic-future','drafts':{'retained':'exact pending words'}}],
                      'current':'synthetic-future','seen':['synthetic-future-node'],
                      'observations':[{'future':'retained original'}]}
    seed['baseline']['draft'] = {'questionId':'groups','attempts':[],'input':'synthetic pending check-in'}
    c, p = setup(browser, 320, seed)
    try:
        go(p, base)
        got = book(p)
        ok(got == seed, 'preview retains future garden and pending Post Office without normalizing; changed roots: '+str({k:got.get(k) for k in set(got)|set(seed) if got.get(k)!=seed.get(k)}))
        click(p, '[data-code-start="blank"]');turn(p, 'build')
        click(p, '[data-code-append="L"]');click(p, '[data-code-share]')
        turn(p, 'send');click(p, '[data-code-test="send"]')
        got = book(p);got.pop('lanternCodes')
        ok(got == seed, 'all actual code mutations preserve every foreign root exactly')
        ok(book(p)['postOffice']['visits'][0]['packing']['input'] == '17', 'waiting parcel input remains exact')
        held = book(p)
        owner = p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        click(p, '#explorer-switch')
        click(p, f'[data-select-explorer="{owner}"]')
        p.locator('[data-codes-root]').wait_for()
        ok(p.locator('.welcome-film').count() == 0, 'choosing explorer on direct code route does not open welcome film')
        ok(book(p) == held, 'chooser return preserves the retained foreign garden and all code work')
        click(p, '#explorer-switch')
        click(p, '#explorer-new')
        click(p, '#explorer-create')
        p.locator('[data-codes-root]').wait_for()
        ok(p.locator('.welcome-film').count() == 0, 'creating fresh explorer on codes route does not open film')
        ok('welcomeFilmSeen' not in book(p).get('garden', {}), 'fresh explorer has no unrelated film flag')
        old = p.evaluate("id=>JSON.parse(localStorage.getItem('number-garden-v1:'+id))", owner)
        ok(old == held, 'creating another explorer retains earlier code and foreign work exactly')
    finally:
        c.close()


if __name__ == '__main__':
    server = None
    base = os.environ.get('CODES_TEST_URL')
    if not base:
        server = PreviewServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    base = base.rstrip('/')+'/'
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path=os.environ.get(
                'CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
            try:
                for width in [320, 820]:
                    journey(browser, width, base)
                retained_preview(browser, base)
                ok(not errors, 'no browser page errors: '+str(errors))
                print(f'Lantern Codes Chrome: {checks} assertions passed; screenshots {OUT}')
            finally:
                browser.close()
    finally:
        if server:
            server.shutdown();server.server_close()
