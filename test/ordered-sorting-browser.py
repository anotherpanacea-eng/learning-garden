"""Synthetic Which test first? journeys, unchanged on local and canonical assets.

The intercepted app adds read-only state/report readers, never a mutation hook.
Set ORDERED_TEST_URL and ORDERED_ARTIFACTS; all notebook fixtures are fictional.
"""
import copy
import json
import os
from pathlib import Path
import subprocess

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('ORDERED_TEST_URL', 'http://127.0.0.1:4197/').rstrip('/') + '/'
OUT = Path(os.environ.get('ORDERED_ARTIFACTS', '/tmp/ordered-sorting-browser'))
OUT.mkdir(parents=True, exist_ok=True)
ROUTE = '#post/sorting/order'
LIMIT = 5 * 1024 * 1024
checks, errors, network_errors, contexts = 0, [], [], []
last_page = None


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def book(p):
    return p.evaluate('()=>window.__orderedRead()')


def root(p):
    return book(p)['orderedSorting']


def work(p):
    r = root(p)
    return r['cases'][r['currentCaseId']]


def active(p):
    return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")


def setup(browser, width, seed, failed=False):
    global last_page
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True,
                            accept_downloads=True)
    contexts.append(c)
    c.add_init_script('''(({seed,failed})=>{
      if(!localStorage.getItem('ordered-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('ordered-fixture','1');
      }
      if(failed)Storage.prototype.setItem=function(){throw Error('Synthetic storage failure');};
    })(''' + json.dumps({'seed': seed, 'failed': failed}) + ')')

    def app(route):
        response = route.fetch()
        code = response.text()
        anchor = 'let graph=null;'
        assert anchor in code, 'app read-only closure anchor missing'
        route.fulfill(response=response, body=code.replace(anchor,
            'window.__orderedRead=()=>structuredClone(state);'
            'window.__orderedReport=()=>JSON.stringify(notesReport(state),null,2);' + anchor, 1))

    c.route('**/app.mjs', app)
    p = c.new_page()
    last_page = p
    p.on('pageerror', lambda e: errors.append(str(e)))
    p.on('requestfailed', lambda r: network_errors.append(r.url + ': ' + str(r.failure)) if '.mjs' in r.url else None)
    return c, p


def go(p, route=ROUTE):
    p.goto(BASE + route)
    selector = {ROUTE: '[data-ordered-root]', '#notes': '#download',
                '#post/sorting': '[data-sorting-root]',
                '#post/double-check': '[data-double-root]'}.get(route, 'main')
    p.locator(selector).first.wait_for()
    p.wait_for_function("typeof window.__orderedRead==='function'")


def tap(p, selector):
    p.locator(selector).first.tap()


def page(p, name):
    if name == 'history':
        page(p, 'compare')
        p.locator('[data-ordered-history]').select_option(str(work(p)['firstKept']['id']))
        return
    tap(p, '[data-ordered-page="' + name + '"]')


def case(p, name):
    tap(p, '[data-ordered-case="' + name + '"]')


def field(p, name, value):
    p.locator('[data-ordered-field="' + name + '"]').select_option(value)


def program(p, first='size-large', first_basket='cart', second='stamp-star',
            second_basket='lantern', otherwise='leaf', first_not=False, second_not=False):
    page(p, 'build')
    for name, value in [('first-test', first), ('first-basket', first_basket),
                        ('second-test', second), ('second-basket', second_basket),
                        ('otherwise-basket', otherwise)]:
        if second == 'off' and name == 'second-basket':
            continue
        field(p, name, value)
    for row, value in [('first', first_not), ('second', second_not)]:
        control = p.locator('[data-ordered-not="' + row + '"]')
        if control.is_enabled():
            control.set_checked(value)


def parcel(p, size, wrap, stamp):
    row = next(c for c in work(p)['source']['parcels']
               if (c['size'], c['wrap'], c['stamp']) == (size, wrap, stamp))
    previous = work(p)['page']
    if p.locator('[data-ordered-parcel]').count() == 0:
        page(p, 'build')
    p.locator('[data-ordered-parcel]').select_option(row['id'])
    if previous != 'build':
        page(p, previous)
    return row['id']


def step(p, keyboard=False):
    control = p.locator('[data-ordered-step]')
    if keyboard:
        control.focus()
        p.keyboard.press('Space')
    else:
        control.tap()



def active_not(program):
    return program['first']['not'] or (program['second']['test'] not in [None, 'off'] and program['second']['not'])


def catches(row, card):
    if row['test'] in [None, 'off']:
        return False
    feature, value = row['test'].split('-', 1)
    answer = card[feature] == value
    return not answer if row['not'] else answer


def result_replies(p, recorded):
    source, program = recorded['source'], recorded['program']
    card = next(v for v in source['parcels'] if v['id'] == recorded['parcelId'])
    expected = {'firstMatch': recorded['steps'][-1]['second'] == 'not-tested',
                'overlap': catches(program['first'], card) and catches(program['second'], card),
                'notReply': active_not(program)}
    container = p.locator('[data-ordered-result]')
    for key, visible in expected.items():
        reply = container.locator('[data-ordered-reply="' + key + '"]')
        ok(reply.count() == (1 if visible else 0), 'result condition selects source-owned ' + key)
        if visible:
            ok(reply.inner_text() == source['text'][key], 'result renders its frozen ' + key + ' reply')


def comparison_replies(p, recorded):
    source, program = recorded['source'], recorded['program']
    expected = {'finite': recorded['matchCount'] == len(source['parcels']), 'equivalent': True,
                'notReply': active_not(program) or active_not(source['requestProgram'])}
    container = p.locator('[data-ordered-comparison]')
    for key, visible in expected.items():
        reply = container.locator('[data-ordered-reply="' + key + '"]')
        ok(reply.count() == (1 if visible else 0), 'comparison condition selects source-owned ' + key)
        if visible:
            ok(reply.inner_text() == source['text'][key], 'comparison renders its frozen ' + key + ' reply')


def sent(p, presses, expected):
    before = len(work(p)['runs'])
    for i in range(presses):
        step(p, keyboard=i == 0)
        if i < presses - 1:
            ok(len(work(p)['runs']) == before, 'no immutable run before Send')
            ok(p.locator('[data-ordered-result]').count() == 0, 'no result before Send')
            ok(p.locator('[data-ordered-basket][data-selected="true"]').count() == 0,
               'no basket highlight before Send')
            ok(p.locator('[data-ordered-arrived-parcel]').count() == 0, 'parcel has not visibly arrived before Send')
    w = work(p)
    result = next(v for v in w['runs'] if v.get('id') == w['currentResultId'])
    ok(result['actualBasket'] == expected, 'Send records the first matching basket')
    ok(p.locator('[data-ordered-result]').count() == 1, 'exactly one sent result is shown')
    ok(p.locator('[data-ordered-result]').evaluate('el=>el===document.activeElement'),
       'Send focuses the newly shown result beside the chosen destination')
    ok(p.locator('[data-ordered-basket][data-selected="true"]').count() == 1 and
       p.locator('[data-ordered-basket="' + expected + '"]').get_attribute('data-selected') == 'true',
       'only the actual basket highlights after Send')
    arrived = p.locator('[data-ordered-arrived-parcel]')
    ok(arrived.count() == 1 and arrived.evaluate("el=>el.closest('[data-ordered-basket]').dataset.orderedBasket") == expected,
       'one parcel visibly arrives in exactly the selected destination basket')
    result_replies(p, result)
    return result


def compare(p, expected):
    page(p, 'compare')
    tap(p, '[data-ordered-compare]')
    rows = p.locator('[data-ordered-compare-row]')
    ok(rows.count() == len(work(p)['source']['parcels']), 'comparison renders each frozen parcel once')
    ok(p.locator('[data-ordered-compare-row][data-match="true"]').count() == expected,
       'comparison match count follows independent routing expectation')
    recorded = copy.deepcopy(work(p)['comparison'])
    comparison_replies(p, recorded)
    return recorded


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    small = p.locator('[data-ordered-root] button,[data-ordered-root] a,[data-ordered-root] summary,[data-ordered-root] input:not([type=checkbox]),[data-ordered-root] .ordered-not,[data-ordered-root] select').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44)).map(x=>({text:x.textContent,h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width}))")
    ok(not small, '44px visible native targets: ' + str(small))


def size_picture(p, size):
    art = p.locator('.ordered-selected [data-ordered-card][data-size="' + size + '"]').first
    ok(art.count() == 1 and art.get_attribute('data-wrap') in ['blue', 'yellow'],
       'selected parcel SVG exposes the actual size and patterned wrap')
    box = art.locator('[data-ordered-size-box]').bounding_box()
    ok(box is not None, 'parcel dimension is actual geometry')
    return box['width']


def shot(p, name):
    p.evaluate('window.scrollTo(0,0)')
    p.screenshot(path=str(OUT / name), full_page=True)


def download(p):
    go(p, '#notes')
    with p.expect_download() as event:
        p.locator('#download').click()
    return json.loads(Path(event.value.path()).read_text())


def bring(p, data):
    go(p, '#notes')
    p.locator('#progress-file').set_input_files({'name': 'synthetic-ordered-sorting.json',
        'mimeType': 'application/json', 'buffer': json.dumps(data).encode()})
    p.locator('#progress-import-confirm').click()
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),
       'actual Notes import creates a separate explorer')


def reload(p):
    identity = active(p)
    p.reload()
    p.locator('#explorer-header').wait_for()
    choice = p.locator('[data-select-explorer="' + identity + '"]')
    if choice.count():
        choice.click()
    p.locator('[data-ordered-root]').wait_for()


# Fixtures use the shipped core but expected browser routes/counts below are
# independently specified. No runtime write access is added to the browser.
def fixtures():
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', FIXTURE_JS],
                                              cwd=ROOT, text=True))


FIXTURE_JS = r'''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startSorting} from './dist/sorting-desk-core.mjs';
import {startDouble} from './dist/willow-double-core.mjs';
import * as D from './dist/ordered-sorting-core.mjs';
const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
const waiting=fresh();startSorting(waiting);startDouble(waiting);
const allow=()=>true,ready=structuredClone(waiting);D.startOrdered(ready,'large-first',allow);
for(const [r,k,v] of [['first','test','size-large'],['first','basket','cart'],['second','test','stamp-star'],['second','basket','lantern'],['otherwise','basket','leaf']])D.editOrdered(ready,r,k,v,allow);
D.selectOrderedParcel(ready,'large-blue-star',allow);
const send=s=>{D.restartOrdered(s,allow);D.stepOrdered(s,allow);D.stepOrdered(s,allow);D.stepOrdered(s,allow);};
const capped=structuredClone(ready);for(let i=0;i<8;i++)send(capped);
const chosen=structuredClone(capped);D.restartOrdered(chosen,allow);D.stepOrdered(chosen,allow);D.stepOrdered(chosen,allow);
console.log(JSON.stringify({fresh:fresh(),waiting,ready,capped,chosen}));
'''


def journeys(browser, fx, width):
    c, p = setup(browser, width, fx['waiting'])
    go(p, '#post/sorting')
    original = book(p)
    ok(p.locator('a[href="' + ROUTE + '"]').count() > 0, 'existing Sorting Desk links to new mode')
    go(p)
    ok('orderedSorting' not in book(p), 'passive route visit allocates no progress')
    bounds(p)
    shot(p, f'entry-{width}.png')
    p.locator('[data-ordered-case="large-first"]').focus()
    p.keyboard.press('Enter')
    ok(root(p)['currentCaseId'] == 'large-first', 'explicit Start chooses first open case')
    ok(p.locator('[data-ordered-case]').count() == 3, 'all three requests are open immediately')
    ok(p.locator('[data-ordered-field="first-test"]').input_value() == '', 'tests begin unset')
    ok(p.locator('[data-ordered-not="first"]').is_checked() is False, 'NOT begins false')
    program(p)
    page(p, 'step')
    large_star = parcel(p, 'large', 'blue', 'star')
    large_width = size_picture(p, 'large')
    tap(p, '[data-ordered-predict="leaf"]')
    ok(work(p)['prediction'] == 'leaf', 'optional prediction is recorded without a score')
    before_runs = copy.deepcopy(work(p)['runs'])
    step(p, keyboard=True)
    ok(p.locator('[data-ordered-predict]').count() == 0, 'prediction closes on first read')
    ok(p.evaluate("document.activeElement?.hasAttribute('data-ordered-step')"),
       'keyboard first read focuses the next step button beside the current work')
    ok(work(p)['runs'] == before_runs, 'first read has no sent result')
    partial = copy.deepcopy(work(p)['trace'])
    page(p, 'compare')
    page(p, 'step')
    ok(work(p)['trace'] == partial, 'page navigation preserves partial trace')
    case(p, 'star-first')
    case(p, 'large-first')
    page(p, 'step')
    ok(work(p)['trace'] == partial, 'case navigation preserves its waiting trace')
    reload(p)
    ok(work(p)['trace'] == partial, 'reload preserves frozen partial trace')
    step(p)
    ok('not tested' in p.locator('[data-ordered-root]').inner_text().lower(),
       'first Yes explicitly leaves second predicate Not tested')
    ok(work(p)['runs'] == before_runs, 'choosing a basket still requires explicit Send')
    step(p)
    first = copy.deepcopy(work(p)['runs'][-1])
    ok(first['actualBasket'] == 'cart' and first['prediction'] == 'leaf',
       'large star first-match destination is distinct from unscored prediction')
    ok(len(first['steps']) == 2 and first['steps'][-1]['second'] == 'not-tested' and
       not any(v.get('row') == 'second' for v in first['steps']),
       'first-match record contains no evaluated second predicate or false substitute')
    ok('not tested' in p.locator('[data-ordered-trace]').inner_text().lower(),
       'sent first-match trace keeps the unvisited row distinct from false')
    result_replies(p, first)
    bounds(p)
    shot(p, f'large-first-trace-{width}.png')
    page(p, 'build')
    tap(p, '[data-ordered-swap]')
    page(p, 'step')
    ok(work(p)['trace'] is None and work(p)['prediction'] is None, 'swap resets only live trace and prediction')
    ok(work(p)['runs'] == [first], 'swap preserves immutable earlier run')
    wrong = sent(p, 3, 'lantern')
    ok(wrong['matches'] is False, 'same large star detects the wrong priority')
    comparison = compare(p, 10)
    ok(p.locator('[data-ordered-compare-row="' + large_star + '"][data-match="false"]').count() == 1,
       'large-star witness remains visible among comparison differences')
    bounds(p)
    shot(p, f'priority-comparison-{width}.png')
    page(p, 'build')
    tap(p, '[data-ordered-swap]')
    page(p, 'compare')
    ok(work(p)['comparison'] == comparison and 'earlier' in p.locator('[data-ordered-root]').inner_text().lower(),
       'editor changes retain recorded comparison with an earlier label')
    compare(p, 12)
    page(p, 'step')
    parcel(p, 'small', 'yellow', 'square')
    small_width = size_picture(p, 'small')
    ok(small_width < large_width * .85, 'small and large use visibly different actual dimensions in the same reference frame')
    shot(p, f'small-card-{width}.png')
    default = sent(p, 4, 'leaf')
    ok(default['matches'] is True, 'both No routes through Otherwise in four presses')
    parcel(p, 'small', 'yellow', 'star')
    sent(p, 4, 'lantern')
    page(p, 'build')
    field(p, 'first-test', 'size-small')
    field(p, 'second-test', 'size-large')
    before = copy.deepcopy(work(p))
    tap(p, '[data-ordered-overlap]')
    after = work(p)
    ok(after['selectedParcel'] == before['selectedParcel'] and after['program'] == before['program'],
       'disjoint tests report no overlap without changing parcel or program')
    ok('no' in p.locator('#ordered-status').inner_text().lower(), 'no-overlap explanation is visible')
    program(p)
    tap(p, '[data-ordered-overlap]')
    selected = next(v for v in work(p)['source']['parcels'] if v['id'] == work(p)['selectedParcel'])
    ok(selected['size'] == 'large' and selected['stamp'] == 'star' and work(p)['support']['contrast'],
       'overlap search selects a real shared witness and records supplied support')
    case(p, 'star-first')
    program(p, 'stamp-star', 'lantern', 'size-large', 'cart', 'leaf')
    page(p, 'step')
    parcel(p, 'large', 'blue', 'star')
    sent(p, 3, 'lantern')
    compare(p, 12)
    case(p, 'not-blue')
    program(p, 'wrap-blue', 'leaf', 'off', otherwise='lantern', first_not=True)
    ok(p.locator('[data-ordered-not="second"]').is_disabled(), 'off second row is visibly inactive')
    ok(p.locator('[data-ordered-swap]').is_disabled(), 'off test cannot swap as a real test')
    page(p, 'step')
    parcel(p, 'large', 'yellow', 'square')
    sent(p, 3, 'leaf')
    parcel(p, 'small', 'blue', 'circle')
    off_result = sent(p, 3, 'lantern')
    ok(off_result['steps'][-1]['second'] == 'off', 'explicit off row is recorded off rather than false')
    compare(p, 12)
    program(p, 'wrap-blue', 'lantern', 'off', otherwise='leaf')
    compare(p, 12)
    program(p, 'wrap-blue', 'lantern', 'off', otherwise='leaf', first_not=True)
    compare(p, 0)
    for name in ['large-first', 'star-first', 'not-blue']:
        case(p, name)
        before = copy.deepcopy(work(p)['program'])
        records = copy.deepcopy(work(p)['runs'])
        for flag in ['hint', 'example', 'skip']:
            tap(p, '[data-ordered-help]')
            ok(work(p)['support'][flag], name + ' records separate supplied ' + flag)
        ok(work(p)['program'] == before and work(p)['runs'] == records,
           name + ' help and skip do not alter rule or create a result')
        tap(p, '[data-ordered-help]')
        ok(work(p)['helpStage'] == 1, 'skip can return to the hint')
        tap(p, '[data-ordered-fold="true"]')
        ok(work(p)['folded'], 'learn guidance can fold without erasing supplied support')
        tap(p, '[data-ordered-fold="false"]')
        tap(p, '[data-ordered-learn]')
        ok(work(p)['support']['learn'], 'learn press records supplied guidance')
    bounds(p)
    shot(p, f'help-{width}.png')
    for key in ['sortingDesk', 'willowDoubleCheck', 'postOffice', 'baseline', 'practice', 'puzzles', 'sessions']:
        ok(book(p)[key] == original[key], 'new desk leaves existing ' + key + ' unchanged')
    identity = active(p)
    raw = download(p)
    saved = copy.deepcopy(raw['orderedSorting'])
    ok(saved == root(p), 'actual Notes download contains exact ordered work')
    bring(p, raw)
    go(p)
    ok(root(p) == saved, 'actual import preserves traces, comparisons and source-owned help')
    imported_id = active(p)
    p.locator('#explorer-switch').click()
    p.locator('[data-select-explorer="' + identity + '"]').click()
    go(p)
    ok(root(p) == saved and active(p) != imported_id, 'original and imported explorers remain separate')
    c.close()
    print(f'Ordered sorting width {width}: journeys complete ({checks} cumulative assertions).', flush=True)
    return raw



def retained_and_refusals(browser, fx, raw):
    # History must be read from the selected frozen run, including old outcomes.
    historic = copy.deepcopy(raw)
    w = historic['orderedSorting']['cases']['large-first']
    historic['orderedSorting']['currentCaseId'] = 'large-first'
    w['page'] = 'history'
    w['source']['request'] = 'Synthetic later request: current wording must not regrade earlier runs.'
    w['runs'][0]['matches'] = False
    w['runs'][0]['source']['request'] = 'Synthetic recorded request <as kept>.'
    w['historyId'] = w['runs'][0]['id']
    # firstKept has its own identity. Select another readable version here.
    w['runs'][1]['matches'] = False
    w['runs'][1]['source']['request'] = 'Synthetic second recorded request <as kept>.'
    w['historyId'] = w['runs'][1]['id']
    c, p = setup(browser, 320, fx['fresh'])
    go(p, '#notes')
    bring(p, historic)
    go(p)
    ok('Synthetic second recorded request <as kept>.' in p.locator('[data-ordered-root]').inner_text(),
       'selected history uses its own frozen source and escapes literal markup')
    ok(p.locator('[data-ordered-root] as').count() == 0, 'recorded markup is text, never an injected element')
    ok('recorded' in p.locator('[data-ordered-root]').inner_text().lower(), 'history is visibly recorded')
    ok(work(p)['runs'] == w['runs'], 'source wording and current editor do not recompute saved outcomes')
    p.locator('[data-ordered-history]').select_option(str(w['firstKept']['id']))
    ok('Synthetic second recorded request' not in p.locator('[data-ordered-root]').inner_text(),
       'history displays only the explicitly selected record')
    c.close()

    # A malformed newest row cannot make an older matching run current.
    broken = copy.deepcopy(fx['capped'])
    w = broken['orderedSorting']['cases']['large-first']
    w['page'] = 'step'
    bad = {'id': w['currentResultId'], 'future': 'Synthetic <raw> final run'}
    w['runs'][-1] = bad
    w['runs'].insert(2, {'future': 'Synthetic <raw> sibling'})
    c, p = setup(browser, 320, broken)
    go(p)
    ok(p.locator('[data-ordered-result]').count() == 0, 'malformed final run never borrows an older result')
    text = p.locator('[data-ordered-root]').inner_text().lower()
    ok('unavailable' in text or 'cannot' in text, 'unavailable current result is explained')
    ok(p.locator('a[href="#notes"]').count() > 0, 'unavailable result offers Notes recovery')
    page(p, 'history')
    p.locator('[data-ordered-history]').select_option(str(w['firstKept']['id']))
    ok('recorded' in p.locator('[data-ordered-root]').inner_text().lower(), 'healthy first record remains available')
    case(p, 'star-first')
    ok(root(p)['cases']['large-first']['runs'] == w['runs'], 'other-case action preserves malformed/raw siblings')
    exported = download(p)
    ok(exported['orderedSorting']['cases']['large-first']['runs'] == w['runs'],
       'actual notes download preserves malformed/raw rows')
    c.close()

    # Duplicate IDs are both ambiguous, even when one complete row came first.
    duplicate = copy.deepcopy(fx['capped'])
    w = duplicate['orderedSorting']['cases']['large-first']
    w['page'] = 'compare'
    duplicate_row = copy.deepcopy(w['runs'][2])
    duplicate_row['syntheticRawNote'] = 'Synthetic duplicate identity stays raw.'
    w['runs'].append(duplicate_row)
    saved_rows = copy.deepcopy(w['runs'])
    c, p = setup(browser, 320, duplicate)
    go(p)
    ok('2 unreadable recent record(s)' in p.locator('[data-ordered-root]').inner_text(),
       'both duplicate-ID slots are unavailable rather than selecting an arbitrary first row')
    choices = p.locator('[data-ordered-history]')
    ok(choices.locator('option[value="3"]').count() == 0 and
       choices.locator('option[value="2"]').count() == 1,
       'ambiguous history ID is absent while an independent healthy run remains selectable')
    choices.select_option('2')
    ok('Recorded run 2' in p.locator('[data-ordered-record]').inner_text(),
       'healthy history still opens beside both unreadable duplicate slots')
    ok(work(p)['runs'] == saved_rows, 'viewing healthy history preserves both duplicate slots unchanged')
    exported = download(p)
    ok(exported['orderedSorting']['cases']['large-first']['runs'] == saved_rows,
       'actual Notes download preserves both duplicate-ID slots exactly')
    c.close()

    # Partial supported imported sources name and compare their actual space.
    partial = copy.deepcopy(fx['ready'])
    w = partial['orderedSorting']['cases'].pop('large-first')
    w['source']['id'] = 'synthetic-partial'
    w['source']['title'] = 'Synthetic partial source'
    w['source']['parcels'] = w['source']['parcels'][:2]
    w['selectedParcel'] = w['source']['parcels'][0]['id']
    partial['orderedSorting']['cases']['synthetic-partial'] = w
    partial['orderedSorting']['currentCaseId'] = 'synthetic-partial'
    c, p = setup(browser, 320, fx['fresh'])
    bring(p, partial)
    go(p)
    page(p, 'compare')
    tap(p, '[data-ordered-compare]')
    ok(p.locator('[data-ordered-compare-row]').count() == 2, 'supported unknown case compares its two frozen cards')
    ok('2' in p.locator('[data-ordered-comparison]').inner_text(), 'partial source names its actual count')
    c.close()

    malformed = copy.deepcopy(fx['ready'])
    w = malformed['orderedSorting']['cases']['large-first']
    w['trace'] = {'future': 'Synthetic unreadable waiting trace'}
    c, p = setup(browser, 320, malformed)
    go(p)
    before = copy.deepcopy(root(p))
    ok(p.locator('[data-ordered-field]').count() == 0 and p.locator('[data-ordered-step]').count() == 0,
       'unreadable live trace is view-only rather than silently restarted')
    ok(p.locator('a[href="#notes"]').count() > 0, 'view-only trace offers Notes')
    case(p, 'star-first')
    ok(root(p)['cases']['large-first'] == before['cases']['large-first'], 'other case preserves malformed trace raw')
    c.close()

    for unsupported in [None, {'version': 99, 'future': 'Synthetic future root <raw>'}]:
        seed = copy.deepcopy(fx['waiting'])
        seed['orderedSorting'] = unsupported
        c, p = setup(browser, 320, seed)
        go(p)
        ok(book(p)['orderedSorting'] == unsupported and p.locator('[data-ordered-case]').count() == 0,
           'unknown root is read-only and retained without overwrite')
        for route, selector in [('#post/sorting', '[data-sorting-root]'),
                                ('#post/double-check', '[data-double-root]'), ('#post', 'main')]:
            go(p, route)
            ok(p.locator(selector).is_visible(), 'existing destination remains open under unknown ordered format')
        c.close()

    # Capacity is disclosed and cancelled before any old readable row leaves.
    capped = copy.deepcopy(fx['chosen'])
    w = capped['orderedSorting']['cases']['large-first']
    w['page'] = 'step'
    w['runs'].insert(2, {'future': 'Synthetic capacity raw sibling'})
    w['firstKept']['futureNote'] = 'Synthetic immutable first copy'
    c, p = setup(browser, 820, capped)
    go(p)
    before = copy.deepcopy(work(p))
    step(p)
    ok(work(p) == before, 'opening capacity confirmation appends and evicts nothing')
    ok(p.locator('[data-ordered-evict-confirm]').is_visible(), 'Send names a confirmation at eight recent runs')
    tap(p, '[data-ordered-evict-cancel]')
    ok(work(p) == before, 'cancel preserves trace and every earlier record')
    step(p)
    tap(p, '[data-ordered-evict-confirm]')
    after = work(p)
    ok(after['firstKept'] == before['firstKept'], 'confirmed ninth Send preserves firstKept separately')
    ok(after['runs'][0]['id'] == before['runs'][1]['id'] and len(after['runs']) == len(before['runs']),
       'confirmed Send evicts exactly one named oldest readable row')
    ok({'future': 'Synthetic capacity raw sibling'} in after['runs'], 'capacity leaves raw sibling intact')
    bounds(p)
    shot(p, 'capacity-recorded-820.png')
    c.close()

    # Stale handlers must check DOM attachment, pending route and explorer owner.
    c, p = setup(browser, 320, fx['ready'])
    go(p)
    page(p, 'step')
    stale = p.locator('[data-ordered-step]').element_handle()
    page(p, 'build')
    before = copy.deepcopy(book(p))
    stale.evaluate('el=>el.click()')
    ok(book(p) == before, 'detached step cannot mutate after a page change')
    page(p, 'step')
    before = copy.deepcopy(root(p))
    p.evaluate("()=>{const el=document.querySelector('[data-ordered-step]');location.hash='#post';el.click();}")
    p.locator('[data-ordered-root]').wait_for(state='detached')
    ok(root(p) == before, 'queued route change refuses an old still-attached callback')
    go(p)
    page(p, 'step')
    stale = p.locator('[data-ordered-step]').element_handle()
    identity = active(p)
    tap(p, '#explorer-switch')
    before = copy.deepcopy(book(p))
    stale.evaluate('el=>el.click()')
    ok(book(p) == before, 'chooser invalidates callbacks from the previous explorer screen')
    p.locator('[data-select-explorer="' + identity + '"]').click()
    go(p)
    ok(work(p)['trace'] is None, 'explorer return keeps the waiting unstarted trace')
    c.close()

    for failed in [False, True]:
        c, p = setup(browser, 320, fx['fresh'], failed=failed)
        go(p, '#notes')
        if not failed:
            p.locator('#remember').uncheck()
        go(p)
        case(p, 'large-first')
        program(p)
        page(p, 'step')
        parcel(p, 'large', 'blue', 'star')
        sent(p, 3, 'cart')
        saved = copy.deepcopy(root(p))
        actual = download(p)
        ok(actual['orderedSorting'] == saved, 'save-off/storage-failure session is playable and actually downloadable')
        if failed:
            ok('Progress could not be saved' in p.locator('body').inner_text(), 'storage refusal is disclosed')
        else:
            ok(p.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:')).length===0"),
               'save-off leaves no persisted explorer state')
        c.close()



def frozen_reply_sources(browser, fx, raw):
    # Current case wording can change without reinterpreting a recorded Send or
    # comparison. Each record keeps its own complete source, including replies.
    frozen = copy.deepcopy(raw)
    for name, w in frozen['orderedSorting']['cases'].items():
        recorded = w['runs'][-1]
        w['trace'] = {key: copy.deepcopy(recorded[key]) for key in
                      ['source', 'program', 'parcelId', 'prediction', 'steps', 'actualBasket']}
        w['trace']['phase'] = 'sent'
        w['currentResultId'] = recorded['id']
        w['page'] = 'step'
        for key in w['source']['text']:
            w['source']['text'][key] = 'Synthetic current ' + name + ' ' + key + ' replacement.'
    c, p = setup(browser, 320, fx['fresh'])
    bring(p, frozen)
    go(p)
    for name in ['large-first', 'star-first', 'not-blue']:
        case(p, name)
        w = work(p)
        result = next(v for v in w['runs'] if v['id'] == w['currentResultId'])
        result_replies(p, result)
        ok('Synthetic current' not in p.locator('[data-ordered-result]').inner_text(),
           name + ' result never borrows current case reply wording')
        page(p, 'compare')
        comparison_replies(p, work(p)['comparison'])
        ok('Synthetic current' not in p.locator('[data-ordered-comparison]').inner_text(),
           name + ' comparison never borrows current case reply wording')
    c.close()


def near_limit_refusals(browser, fx):
    # At the real shared bound, the plain notebook fits while the actual notes
    # report does not. Every attempted DOM action must leave the root identical.
    seed = copy.deepcopy(fx['ready'])
    seed['orderedSorting']['cases']['large-first']['folded'] = True
    encoded = len(json.dumps(seed, ensure_ascii=False, indent=2).encode())
    seed['syntheticPadding'] = 'x' * (LIMIT - encoded - 100)
    c, p = setup(browser, 820, seed)
    go(p)
    ok(len(json.dumps(book(p), ensure_ascii=False, indent=2).encode()) < LIMIT,
       'synthetic notebook is below the raw shared bound')
    ok(p.evaluate('new TextEncoder().encode(window.__orderedReport()).length') > LIMIT,
       'actual formatted notesReport exceeds the shared import cap')
    before = copy.deepcopy(root(p))
    targets = [('[data-ordered-field="first-test"]', 'stamp-star'),
               ('[data-ordered-field="first-basket"]', 'leaf'),
               ('[data-ordered-field="second-test"]', 'off'),
               ('[data-ordered-field="otherwise-basket"]', 'cart'),
               ('[data-ordered-parcel]', 'small-blue-circle')]
    for selector, value in targets:
        old = p.locator(selector).input_value()
        p.locator(selector).select_option(value)
        ok(root(p) == before and p.locator(selector).input_value() == old,
           'actual report refusal atomically reverts native select ' + selector)
    control = p.locator('[data-ordered-not="first"]')
    old = control.is_checked()
    control.tap()
    ok(root(p) == before and p.locator('[data-ordered-not="first"]').is_checked() == old,
       'actual report refusal atomically reverts native NOT checkbox')
    for selector in ['[data-ordered-swap]', '[data-ordered-overlap]',
                     '[data-ordered-help]', '[data-ordered-fold="false"]',
                     '[data-ordered-together]', '[data-ordered-audio] [data-speak]',
                     '[data-ordered-page="step"]', '[data-ordered-case="star-first"]']:
        tap(p, selector)
        ok(root(p) == before, 'actual report refusal is atomic for ' + selector)
    # Each page needs its own seeded selection because navigation itself refuses.
    c.close()
    for view, selectors in [('step', ['[data-ordered-predict="leaf"]', '[data-ordered-step]', '[data-ordered-restart]']),
                            ('compare', ['[data-ordered-compare]'])]:
        sample = copy.deepcopy(seed)
        sample['orderedSorting']['cases']['large-first']['page'] = view
        c, p = setup(browser, 820, sample)
        go(p)
        before = copy.deepcopy(root(p))
        for selector in selectors:
            if p.locator(selector).count():
                tap(p, selector)
                ok(root(p) == before, 'actual report refusal preserves ' + selector)
        c.close()

    def at_limit(sample):
        sample = copy.deepcopy(sample)
        sample.pop('syntheticPadding', None)
        count = len(json.dumps(sample, ensure_ascii=False, indent=2).encode())
        sample['syntheticPadding'] = 'x' * (LIMIT - count - 100)
        return sample

    unstarted = at_limit(fx['waiting'])
    c, p = setup(browser, 320, unstarted)
    go(p)
    before = copy.deepcopy(book(p))
    case(p, 'large-first')
    ok(book(p) == before, 'actual report refusal keeps a missing ordered root missing on Start')
    c.close()

    unfolded = copy.deepcopy(fx['ready'])
    w = unfolded['orderedSorting']['cases']['large-first']
    w['support']['learn'] = w['support']['guided'] = True
    c, p = setup(browser, 820, at_limit(unfolded))
    go(p)
    before = copy.deepcopy(root(p))
    for selector in ['[data-ordered-learn]', '[data-ordered-fold="true"]']:
        tap(p, selector)
        ok(root(p) == before, 'actual report refusal preserves teaching state for ' + selector)
    c.close()

    history = copy.deepcopy(fx['capped'])
    w = history['orderedSorting']['cases']['large-first']
    w['folded'] = True
    w['page'] = 'history'
    c, p = setup(browser, 820, at_limit(history))
    go(p)
    before = copy.deepcopy(root(p))
    old = p.locator('[data-ordered-history]').input_value()
    p.locator('[data-ordered-history]').select_option('1')
    ok(root(p) == before and p.locator('[data-ordered-history]').input_value() == old,
       'actual report refusal reverts history selector and preserves its recorded selection')
    c.close()

    chosen = copy.deepcopy(fx['chosen'])
    w = chosen['orderedSorting']['cases']['large-first']
    w['folded'] = True
    w['page'] = 'step'
    # Restart removes the frozen trace. Pad against that smaller candidate so
    # its plain notebook fits but its real formatted report still cannot.
    restarted = copy.deepcopy(chosen)
    rw = restarted['orderedSorting']['cases']['large-first']
    rw['trace'] = rw['prediction'] = rw['currentResultId'] = None
    chosen['syntheticPadding'] = at_limit(restarted)['syntheticPadding']
    c, p = setup(browser, 820, chosen)
    go(p)
    before = copy.deepcopy(root(p))
    tap(p, '[data-ordered-restart]')
    ok(root(p) == before, 'actual report refusal preserves chosen trace on Restart')
    step(p)
    tap(p, '[data-ordered-evict-confirm]')
    ok(root(p) == before, 'failed confirmed Send preserves all eight recent rows and firstKept atomically')
    c.close()


def main():
    fx = fixtures()
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=os.environ.get(
            'CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
        p = None
        try:
            for width in [320, 820]:
                raw = journeys(browser, fx, width)
            retained_and_refusals(browser, fx, raw)
            frozen_reply_sources(browser, fx, raw)
            near_limit_refusals(browser, fx)
            ok(not errors, 'zero browser runtime errors: ' + str(errors))
            ok(not network_errors, 'zero module network failures: ' + str(network_errors))
            print(f'Ordered sorting Chrome: {checks} assertions passed at320/820.', flush=True)
        except Exception:
            print('Assertions before failure:', checks, flush=True)
            print('Browser errors:', errors, flush=True)
            print('Module request failures:', network_errors, flush=True)
            try:
                shot(last_page, 'failure.png')
                print('Failed URL:', last_page.url, flush=True)
                print('Main text:', last_page.locator('main').inner_text()[:2200], flush=True)
            except Exception:
                pass
            raise
        finally:
            for c in contexts:
                try:
                    c.close()
                except Exception:
                    pass
            browser.close()


if __name__ == '__main__':
    main()
