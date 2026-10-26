"""Synthetic Equality Desk journeys through the real app and notebook transfer."""
import copy
from fractions import Fraction
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import threading

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('EQUALITY_ARTIFACTS', '/tmp/equality-desk-browser'))
OUT.mkdir(parents=True, exist_ok=True)
ROUTE = '#learn/math/equality'
checks = 0
errors = []


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def node(source):
    return json.loads(subprocess.check_output(
        ['node', '--input-type=module', '-e', source], cwd=ROOT, text=True))


def fixtures():
    return node("""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startPostOffice,setPostPackingInput} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
import {startAdaptiveRival} from './dist/post-rival.mjs';
import {generateRivalTask} from './dist/post-rival-generator.mjs';
import {startEquality,pageEquality,editEquality,checkEquality,keepEquality} from './dist/equality-desk-core.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
startPostOffice(base,deliveries[0].id);setPostPackingInput(base,'17');
const pending=structuredClone(base);startAdaptiveRival(pending);
const rival=pending.postOffice.visits.find(v=>v.id===pending.postOffice.current).rival;
rival.task=generateRivalTask('multiply',2,3,0);rival.input='7';
const saved=structuredClone(base),o={canExport:()=>true};
startEquality(saved,'twins',o);pageEquality(saved,3,o);
editEquality(saved,'choice','one',o);editEquality(saved,'answer','-3',o);
editEquality(saved,'note','Original synthetic explanation.',o);checkEquality(saved,o);keepEquality(saved,o);
const s=saved.equalityDesk.visits[saved.equalityDesk.current];
s.source.id='retired-original-source';s.source.title='Earlier original investigation';
s.source.story='Earlier fictional surveyor prompt retained exactly.';
s.source.choices.reverse();s.help.push('earlier-help');
s.firstCheck.feedback='Original saved first feedback retained exactly.';
s.checks[0].feedback='Original saved latest feedback retained exactly.';
const malformed=structuredClone(saved),w=malformed.equalityDesk.visits[malformed.equalityDesk.current];
w.tests.push({synthetic:'unreadable original test'});w.checks.push({synthetic:'unreadable latest check'});
w.kept={synthetic:'unreadable latest kept version'};
malformed.equalityDesk.visits['broken-sibling']={synthetic:'unreadable original work'};
const future=structuredClone(base);future.equalityDesk={version:99,current:'future',visits:{future:{raw:'exact future words'}}};
console.log(JSON.stringify({base,pending,saved,malformed,future}));
""")


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class PreviewServer(http.server.ThreadingHTTPServer):
    request_queue_size = 128


def book(p):
    return p.evaluate('()=>window.__equalityRead()')


def root(p):
    return book(p)['equalityDesk']


def work(p):
    r = root(p)
    return r['visits'][r['current']]


def click(p, selector):
    control = p.locator(selector).first
    if not control.is_visible():
        control.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
    control.click()


def turn(p, n):
    click(p, f'[data-equality-page="{n}"]')


def start(p, family='twins'):
    family_control = p.locator('[data-equality-family]')
    if not family_control.is_visible():
        family_control.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
    family_control.select_option(family)
    click(p, '[data-equality-start]')


def field(p, name, text):
    p.locator(f'[data-equality-field="{name}"]').fill(text)


def active(p):
    return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")


def settle(p):
    p.locator('#explorer-header').wait_for()
    chosen = active(p)
    picker = p.locator(f'[data-select-explorer="{chosen}"]')
    if picker.count():
        click(p, f'[data-select-explorer="{chosen}"]')
    p.locator('[data-equality-root]').wait_for()


def go(p, base):
    p.goto(base + ROUTE)
    settle(p)


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no page overflow')
    small = p.locator('.equality-page button,.equality-page a,.equality-page summary,.equality-page input,.equality-page select,.equality-page textarea').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&"
        "(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44))"
        ".map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not small, '44px visible native targets: ' + str(small))


def setup(browser, width, seed):
    context = browser.new_context(viewport={'width': width, 'height': 1000},
                                  has_touch=True, accept_downloads=True,
                                  reduced_motion='reduce')
    context.add_init_script('('+r"""seed=>{
      if(!localStorage.getItem('equality-synthetic-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('equality-synthetic-fixture','1');
      }
      window.__equalityRefuse=false;
    }"""+')('+json.dumps(seed)+')')

    def app(route):
        response = route.fetch()
        body = response.text()
        assert 'let graph=null;' in body, 'host read seam changed'
        body = body.replace('let graph=null;',
                            'window.__equalityRead=()=>structuredClone(state);let graph=null;', 1)
        needle = 'function priceOptions(){return {canExport:candidate=>'
        assert needle in body, 'host export-preflight seam changed'
        body = body.replace(needle,
            'function priceOptions(){return {canExport:candidate=>!window.__equalityRefuse&&', 1)
        route.fulfill(response=response, body=body)

    context.route('**/app.mjs', app)
    page = context.new_page()
    page.set_default_timeout(12000)
    page.on('pageerror', lambda error: errors.append(str(error)))
    return context, page


def rational(q):
    return Fraction(q['n'], q['d'])


def evaluate(expr, raw):
    x = Fraction(raw)
    return Fraction(expr['k']) * (Fraction(expr['a']) * x + Fraction(expr['b'])) + Fraction(expr['c'])


def assert_probe(p, raw):
    latest = work(p)['tests'][-1]
    s = work(p)['source']
    left, right = evaluate(s['left'], raw), evaluate(s['right'], raw)
    ok(latest['raw'] == raw, 'probe retains exact raw numeric syntax')
    ok(rational(latest['left']) == left and rational(latest['right']) == right, 'both outputs match independent rational oracle')
    ok(latest['equal'] == (left == right), 'probe equality agrees with exact arithmetic')
    ok(p.locator('[data-equality-probe-result]').count() == 1, 'latest probe visible beside input')


def reveal_all(p):
    turn(p, 2)
    source = work(p)['source']
    ok(work(p)['seenLine'] == 0, 'proof begins with original equation only')
    for n in range(1, len(source['steps'])):
        click(p, f'[data-equality-line="{n}"]')
        ok(work(p)['line'] == n and work(p)['seenLine'] == n, 'one explicit proof reveal advances depth')
        ok(p.locator('[data-equality-proof]').count() == 1, 'proof has a readable text representation')
    deepest = work(p)['seenLine']
    for n in range(len(source['steps'])-2, -1, -1):
        click(p, f'[data-equality-line="{n}"]')
    ok(work(p)['line'] == 0 and work(p)['seenLine'] == deepest, 'reviewing earlier line retains deepest support separately')


def claim(p, choice, answer=None):
    click(p, f'[data-equality-choice="{choice}"]')
    if answer is not None:
        field(p, 'answer', answer)
    click(p, '[data-equality-check]')


def journey(browser, width, base, initial):
    c, p = setup(browser, width, initial)
    try:
        go(p, base)
        before = book(p)
        ok('equalityDesk' not in before, 'preview creates no equation visit')
        ok(p.locator('.welcome-film').count() == 0, 'direct equality route skips unrelated story film')
        bounds(p)
        p.reload();settle(p)
        ok(book(p) == before, 'preview reload preserves exact notebook')
        start(p)
        first_id = root(p)['current']
        ok(work(p)['page'] == 0 and work(p)['source']['domain'] == 'real', 'explicit start opens teaching and all-real domain')
        ok(p.locator('#equality-heading').evaluate('x=>document.activeElement===x'), 'start focuses local heading')
        ok(p.locator('[data-equality-equation]').count() >= 1, 'source equation persists above task')
        source = copy.deepcopy(work(p)['source'])
        turn(p, 1);bounds(p)
        for raw in ['-2', '0', '2']:
            click(p, f'[data-equality-preset="{raw}"]')
            assert_probe(p, raw)
        ok(not any(t['equal'] for t in work(p)['tests']), 'sample table has no match without implying no solution')
        ok('none of' in p.locator('main').inner_text().lower(), 'failed sample table is qualified as tested numbers')
        field(p, 'input', '1/2');click(p, '[data-equality-probe]');assert_probe(p, '1/2')
        field(p, 'input', '1e2');held = copy.deepcopy(work(p)['tests']);click(p, '[data-equality-probe]')
        ok(work(p)['tests'] == held, 'unsupported syntax adds no probe')
        field(p, 'input', ' -3.000 ');click(p, '[data-equality-probe]');assert_probe(p, ' -3.000 ')
        ok(work(p)['tests'][-1]['equal'], 'exact decimal form finds unique solution')
        reveal_all(p);bounds(p)
        turn(p, 3)
        held = copy.deepcopy(work(p)['checks']);click(p, '[data-equality-check]')
        ok(work(p)['checks'] == held, 'unselected classification is not a checked attempt')
        claim(p, 'one', 'not a number')
        ok(work(p)['checks'] == held, 'invalid unique witness is not a checked attempt')
        claim(p, 'none')
        first_check = copy.deepcopy(work(p)['firstCheck'])
        ok(first_check['outcome'] == 'different', 'wrong classification records a revisable supported claim')
        ok(first_check['seenLineBefore'] == work(p)['seenLine'], 'first claim freezes already shown proof depth')
        click(p, '[data-equality-help="hint"]');click(p, '[data-equality-help="example"]')
        ok({'hint', 'example'}.issubset(work(p)['help']), 'separate requested support is recorded')
        claim(p, 'one', '2')
        ok(work(p)['checks'][-1]['outcome'] == 'different', 'wrong unique witness receives numeric feedback')
        note = '\nSynthetic explanation <script> & exact punctuation.'
        field(p, 'note', note);claim(p, 'one', '-3')
        latest = copy.deepcopy(work(p)['checks'][-1])
        ok(latest['outcome'] == 'match', 'classification and exact unique witness must both fit')
        ok(latest['raw']['note'] == note, 'claim freezes exact explanatory writing')
        ok(p.locator('[data-equality-field="note"]').input_value() == note, 'rerender preserves a leading newline in visible writing')
        ok({'hint', 'example'}.issubset(latest['helpBefore']), 'latest claim owns requested help-before')
        ok(work(p)['firstCheck'] == first_check, 'later correct answer never rewrites first check')
        ok(p.locator('#equality-result').evaluate('x=>document.activeElement===x'), 'check focuses its feedback')
        click(p, '[data-equality-keep]')
        first_keep = copy.deepcopy(work(p)['firstKept'])
        field(p, 'note', 'Revised synthetic reason.');click(p, '[data-equality-keep]')
        ok(work(p)['firstKept'] == first_keep and work(p)['kept'] != first_keep, 'first and latest keeps remain independent snapshots')
        ok(work(p)['source'] == source, 'edits and help preserve complete original source')
        bounds(p);p.screenshot(path=str(OUT/f'unique-claim-{width}.png'), full_page=True)
        stale = p.locator('[data-equality-check]').element_handle()
        turn(p, 1);held = book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == held, 'detached check cannot act on another page')
        # The next serials rotate outcomes without replacing earlier work.
        start(p, 'twins');none_id = root(p)['current'];turn(p, 3);claim(p, 'none')
        ok(work(p)['source']['key'] == 'none' and work(p)['checks'][-1]['outcome'] == 'match', 'contradiction receives no-real-solutions explanation')
        start(p, 'twins');every_id = root(p)['current'];turn(p, 1)
        click(p, '[data-equality-preset="0"]');assert_probe(p, '0')
        ok(work(p)['tests'][-1]['equal'], 'identity example provides a valid witness')
        turn(p, 3);claim(p, 'one', '0')
        ok(work(p)['checks'][-1]['outcome'] == 'different', 'a valid identity witness does not establish one solution')
        claim(p, 'every')
        ok(work(p)['checks'][-1]['outcome'] == 'match', 'identity permits every real number rather than only zero')
        ok(root(p)['visits'][first_id]['firstCheck'] == first_check, 'new visits keep earlier first outcome intact')
        ok(root(p)['visits'][none_id]['source']['key'] == 'none' and root(p)['visits'][every_id]['source']['key'] == 'every', 'different cases coexist')
        # Dirty drafts must survive every route-changing surface until explicit recovery.
        turn(p, 3);saved_note = work(p)['note'];p.evaluate('window.__equalityRefuse=true');held = book(p)
        field(p, 'note', 'Unsaved visible synthetic words.')
        ok(book(p) == held and p.locator('[data-equality-field="note"]').input_value() == 'Unsaved visible synthetic words.', 'refused input remains visible and saved notebook is unchanged')
        for selector in ['[data-equality-check]', '[data-equality-keep]', '[data-equality-page="1"]', '#explorer-switch']:
            click(p, selector)
            ok(book(p) == held and p.locator('[data-equality-field="note"]').input_value() == 'Unsaved visible synthetic words.', 'pending words survive blocked action '+selector)
        p.locator('[data-equality-page="1"]').first.focus();p.keyboard.press('Enter')
        ok(work(p)['page'] == 3 and book(p) == held, 'keyboard activation cannot discard refused writing')
        p.keyboard.press('Tab')
        ok(p.evaluate('document.activeElement!==document.body'), 'Tab remains available during pending input')
        p.evaluate("location.hash='#home'");p.wait_for_function("location.hash==='#learn/math/equality'")
        ok(book(p) == held and p.locator('[data-equality-field="note"]').input_value() == 'Unsaved visible synthetic words.', 'direct hash restores route and preserves refused writing')
        p.evaluate("history.replaceState(null,'','#home');history.pushState(null,'','#learn/math/equality')")
        p.go_back();p.wait_for_function("location.hash==='#learn/math/equality'")
        ok(book(p) == held and p.locator('[data-equality-field="note"]').input_value() == 'Unsaved visible synthetic words.', 'browser Back restores route and preserves refused writing')
        p.once('dialog', lambda dialog: dialog.dismiss());click(p, '[data-equality-restore]')
        ok(p.locator('[data-equality-field="note"]').input_value() == 'Unsaved visible synthetic words.', 'cancel restoration preserves visible words')
        p.once('dialog', lambda dialog: dialog.accept());click(p, '[data-equality-restore]')
        ok(p.locator('[data-equality-field="note"]').input_value() == saved_note and book(p) == held, 'confirmed restoration explicitly recovers saved writing')
        for selector in ['[data-equality-help="hint"]', '[data-equality-keep]', '[data-equality-check]']:
            click(p, selector);ok(book(p) == held, 'normal preflight refusal remains atomic '+selector)
        p.evaluate('window.__equalityRefuse=false');field(p, 'note', 'Recovered editable words.');click(p, '[data-equality-keep]')
        ok(work(p)['note'] == 'Recovered editable words.', 'normal edits resume after recovery')
        saved = copy.deepcopy(root(p));identity = active(p)
        p.reload();settle(p);ok(root(p) == saved, 'reload retains exact sources, proof, outcomes and writing')
        # Real export/import and separate explorers use the app's public controls.
        p.goto(base+'#notes');p.locator('#download').wait_for()
        ok('Equality Desk' in p.locator('main').inner_text(), 'grown-up notes name the new activity')
        with p.expect_download() as downloaded:
            click(p, '#download')
        exported = json.loads(Path(downloaded.value.path()).read_text())
        ok(exported['equalityDesk'] == saved, 'actual notebook download owns exact equality root')
        p.locator('#progress-file').set_input_files({'name':'synthetic-equality.json','mimeType':'application/json','buffer':json.dumps(exported).encode()})
        p.locator('#progress-import-confirm').wait_for()
        ok('Equality Desk' in p.locator('.import-preview').inner_text(), 'actual import summary registers equality destination')
        click(p, '#progress-import-confirm')
        ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'real import succeeds')
        imported = active(p);ok(imported != identity, 'import creates a separate explorer')
        go(p, base);ok(root(p) == saved, 'imported work retains complete frozen sources and outcomes')
        turn(p, 3);field(p, 'note', 'Imported explorer synthetic words.')
        imported_work = copy.deepcopy(root(p));stale = p.locator('[data-equality-check]').element_handle()
        click(p, '#explorer-switch');click(p, f'[data-select-explorer="{identity}"]');p.locator('[data-equality-root]').wait_for()
        held = book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == held and root(p) == saved, 'stale explorer handler cannot mutate selected original explorer')
        click(p, '#explorer-switch');click(p, f'[data-select-explorer="{imported}"]');p.locator('[data-equality-root]').wait_for()
        ok(root(p) == imported_work, 'imported explorer retains its independent words')
        # Explicit visit removal is cancellable and preserves the allocator.
        doomed = root(p)['current'];serial = root(p)['next'];held = book(p)
        p.locator('[data-equality-remove-choice]').evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
        p.locator('[data-equality-remove-choice]').select_option(doomed)
        p.once('dialog', lambda dialog: dialog.dismiss());click(p, '[data-equality-delete]')
        ok(book(p) == held, 'cancelled removal changes nothing')
        p.once('dialog', lambda dialog: dialog.accept());click(p, '[data-equality-delete]')
        ok(doomed not in root(p)['visits'] and root(p)['next'] == serial, 'confirmed selected removal preserves monotone serial')
        ok(root(p)['visits'][first_id] == saved['visits'][first_id], 'removal preserves a different complete visit')
        p.goto(base+'#pathways/math');p.locator('[data-pathway-root]').wait_for()
        ok(p.locator(f'a[href="{ROUTE}"]').count() >= 1, 'math pathway offers open Equality Desk invitation')
        p.goto(base+'#learn/math');p.locator('[data-linear-root]').wait_for()
        ok(p.locator(f'a[href="{ROUTE}"]').count() >= 1, 'linear menu offers next algebra bridge')
    finally:
        c.close()


def edge_journeys(browser, base, seeds):
    # Frozen sources and original results survive catalog changes; malformed optional
    # children remain raw, while a healthy sibling and new investigations remain open.
    c, p = setup(browser, 820, seeds['malformed'])
    try:
        go(p, base)
        held = copy.deepcopy(root(p));text = p.locator('main').inner_text().lower()
        ok('retained' in text and ('unreadable' in text or 'cannot' in text), 'malformed latest records are visibly retained rather than replaced by first')
        ok('Earlier fictional surveyor prompt retained exactly.' in p.locator('main').inner_text() or 'Earlier original investigation' in p.locator('main').inner_text(), 'unknown source id remains readable with its saved wording')
        turn(p, 3);field(p, 'note', 'Healthy edited words beside raw history.')
        ok(work(p)['tests'][0] == held['visits'][held['current']]['tests'][0], 'raw malformed test stays exact while other writing remains editable')
        ok(work(p)['checks'][-1] == {'synthetic':'unreadable latest check'}, 'latest unreadable check is not regraded or overwritten')
        ok(work(p)['firstCheck']['feedback'] == 'Original saved first feedback retained exactly.', 'original first feedback remains source-owned')
        start(p, 'beyond');new_id = root(p)['current']
        ok(new_id != held['current'] and root(p)['visits']['broken-sibling'] == {'synthetic':'unreadable original work'}, 'new visit preserves malformed sibling exactly')
        p.goto(base+'#notes');p.locator('#download').wait_for()
        with p.expect_download() as downloaded:click(p, '#download')
        exported=json.loads(Path(downloaded.value.path()).read_text())
        ok(exported['equalityDesk']['visits'][held['current']]['checks'][-1] == {'synthetic':'unreadable latest check'}, 'actual export retains malformed latest raw data')
    finally:
        c.close()
    c, p = setup(browser, 320, seeds['future'])
    try:
        go(p, base);held = book(p)
        ok(not p.locator('[data-equality-start]').count(), 'future wrapper offers no editing controls')
        ok(book(p) == held, 'future wrapper remains byte-identical on display')
        p.goto(base+'#pathways/math');p.locator('[data-pathway-root]').wait_for()
        ok(book(p)['equalityDesk'] == seeds['future']['equalityDesk'], 'other destinations stay open around a future root')
    finally:
        c.close()
    # Work outside the tiny test sample must not be misclassified as contradiction.
    outside = copy.deepcopy(seeds['base'])
    outside['equalityDesk']={'version':1,'current':'','next':7,'visits':{}}
    c, p = setup(browser, 820, outside)
    try:
        go(p, base);start(p, 'beyond');s=work(p)['source']
        ok(s['key']=='one' and rational(s['solution'])==9, 'outside-sample source has exact unique solution9')
        turn(p,1)
        for raw in ['-2','0','2']:
            click(p,f'[data-equality-preset="{raw}"]');assert_probe(p,raw)
        ok(not any(t['equal'] for t in work(p)['tests']), 'three failed sample inputs do not change unique key')
        reveal_all(p);turn(p,3);claim(p,'one','9')
        ok(work(p)['checks'][-1]['outcome']=='match','equivalent reasoning reaches solution outside sampled inputs')
        p.screenshot(path=str(OUT/'outside-table-820.png'),full_page=True)
    finally:
        c.close()
    c, p = setup(browser, 820, seeds['base'])
    try:
        go(p,base);start(p,'halves')
        ok(rational(work(p)['source']['solution']) == Fraction(1,2), 'fractional-rate case has an exact fractional unique solution')
        turn(p,1);field(p,'input','0.5');click(p,'[data-equality-probe]');assert_probe(p,'0.5')
        ok(work(p)['tests'][-1]['equal'], 'decimal and fractional value give matching outputs')
        turn(p,3);claim(p,'one','2/4')
        ok(work(p)['checks'][-1]['outcome']=='match' and work(p)['checks'][-1]['raw']['answer']=='2/4', 'unreduced equivalent witness fits while raw fraction stays unchanged')
        claim(p,'one','-1/2')
        ok(work(p)['checks'][-1]['outcome']=='different', 'opposite signed fractional witness receives different outcome')
    finally:
        c.close()
    # The worked example exposes2×3 before overlapping Bramble evidence is assessed.
    c, p = setup(browser, 820, seeds['pending'])
    try:
        go(p,base)
        rival=lambda:next(v for v in book(p)['postOffice']['visits'] if v['id']==book(p)['postOffice']['current'])['rival']
        original=copy.deepcopy(rival());ok(not rival().get('priorFactShown'),'numeric-free preview keeps pending fact fresh')
        held=book(p);p.evaluate('window.__equalityRefuse=true');start(p)
        ok(book(p)==held and 'equalityDesk' not in book(p),'refused start reveals no work and qualifies no pending facts')
        p.evaluate('window.__equalityRefuse=false');start(p)
        ok(rival().get('priorFactShown') is True,'actual displayed example qualifies pending exact multiplication fact')
        expected=copy.deepcopy(original);expected['priorFactShown']=True
        ok(rival()==expected,'pending Bramble task, raw input and attempts stay otherwise exact')
        ok('2x3' in book(p).get('exposures',[]),'actual host records displayed product exposure')
    finally:
        c.close()


if __name__ == '__main__':
    server = None
    base = os.environ.get('EQUALITY_TEST_URL')
    if not base:
        server = PreviewServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    try:
        seeds=fixtures()
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get(
                'CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
            try:
                for width in [320,820]:
                    journey(browser,width,base,seeds['base'])
                edge_journeys(browser,base,seeds)
                ok(not errors,'no browser page errors: '+str(errors))
                print(f'Equality Desk Chrome: {checks} assertions passed; screenshots {OUT}')
            finally:
                browser.close()
    finally:
        if server:
            server.shutdown();server.server_close()
