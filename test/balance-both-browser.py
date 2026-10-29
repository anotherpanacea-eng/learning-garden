"""Synthetic both-pan Balance Chrome journeys; no learner data or service calls.

The test response adds a read-only closure reader for session-only state checks.
Set BOTH_TEST_URL and BOTH_ARTIFACTS to use a local preview and evidence folder.
"""
import copy
import json
import os
import subprocess
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('BOTH_TEST_URL', 'http://127.0.0.1:4195/')
OUT = Path(os.environ.get('BOTH_ARTIFACTS', '/tmp/balance-both-browser'))
OUT.mkdir(parents=True, exist_ok=True)
ROUTE = '#workshop/balance/both'
fixtures = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', """
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startDesk,setDeskLocation,setDeskDraft} from './dist/keepers-desk-core.mjs';
import {startPostOffice} from './dist/post-office-core.mjs';
import {startAdaptiveRival,setBrambleMode} from './dist/post-rival.mjs';
import {generateRivalTask} from './dist/post-rival-generator.mjs';
import {startBalance,chooseBalanceMass} from './dist/balance-stall-core.mjs';
const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
const waiting=fresh();startDesk(waiting);setDeskLocation(waiting,'cost','1a');
setDeskDraft(waiting,'1a','Synthetic waiting value');
const v=startPostOffice(waiting,'purl-blankets');setBrambleMode(waiting,'multiply');
startAdaptiveRival(waiting);v.rival.task=generateRivalTask('multiply',3,4,0);v.rival.input='7';
waiting.baseline.draft={questionId:'groups',attempts:[],input:'',hinted:false,revealed:false};
startBalance(waiting,'leaf-parcel');chooseBalanceMass(waiting,4);
console.log(JSON.stringify({fresh:fresh(),waiting}));
"""], cwd=ROOT, text=True))
checks = 0
errors = []
network_errors = []
contexts = []


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def book(p):
    return p.evaluate('()=>window.__bothRead()')


def work(p, case=None):
    b = book(p)['balanceBoth']
    return b['cases'][case or b['currentId']]


def active(p):
    return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")


def setup(browser, width, seed='waiting', failed=False):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True,
                            accept_downloads=True)
    contexts.append(c)
    seed = copy.deepcopy(fixtures[seed] if isinstance(seed, str) else seed)
    init = """({seed,failed})=>{
      if(!localStorage.getItem('both-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('both-fixture','1');
      }
      if(failed)Storage.prototype.setItem=function(){throw Error('Synthetic storage failure');};
    }"""
    c.add_init_script('(' + init + ')(' + json.dumps({'seed': seed, 'failed': failed}) + ')')

    def app(route):
        response = route.fetch()
        body = response.text()
        anchor = 'let graph=null,'
        if anchor not in body:
            raise AssertionError('app closure reader insertion anchor missing')
        route.fulfill(response=response, body=body.replace(
            anchor, 'window.__bothRead=()=>structuredClone(state);' + anchor, 1))

    c.route('**/app.mjs', app)
    p = c.new_page()
    p.on('pageerror', lambda e: errors.append(str(e)))
    p.on('requestfailed', lambda r: network_errors.append(r.url + ': ' + str(r.failure)) if '.mjs' in r.url else None)
    return c, p


def go(p, route=ROUTE):
    p.goto(BASE + route)
    selector = {ROUTE: '[data-both-root]', '#notes': '#download',
                '#desk': '[data-desk-root]', '#workshop/balance': '.balance-scene'}
    p.locator(selector.get(route, 'main')).first.wait_for()
    p.wait_for_function("typeof window.__bothRead==='function'")


def tap(p, selector):
    item = p.locator(selector).first
    if not item.is_visible():
        fold = item.locator('xpath=ancestor::details[1]')
        if fold.count():
            fold.locator('summary').first.tap()
    item.tap()


def card(p, case):
    tap(p, '[data-both-start="' + case + '"]')


def page(p, name):
    tap(p, '[data-both-page="' + name + '"]')


def action(p, name):
    tap(p, '[data-both-action="' + name + '"]')


def proposal(p, value):
    p.locator('[data-both-proposal]').fill(value)


def keep(p, kind='arrangement'):
    tap(p, '[data-both-check="' + kind + '"]')


def fold(p, folded=True):
    if work(p)['folded'] != folded:
        tap(p, '[data-both-fold]')


def share(p, groups):
    p.locator('#both-groups').select_option(str(groups))
    action(p, 'share')


def shot(p, name):
    p.evaluate('window.scrollTo(0,0)')
    p.screenshot(path=str(OUT / name), full_page=True)


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    small = p.locator('.both-page button,.both-page summary,.both-page a,.both-page input,.both-page select').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44)).map(x=>({text:x.textContent,h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width}))")
    ok(not small, '44px visible targets: ' + str(small))
    ok(p.locator('.both-page').evaluate('x=>parseFloat(getComputedStyle(x).fontSize)>=16'), '16px base text')


def geometry(p, expected):
    scene = p.locator('.both-scene').first
    ok(scene.get_attribute('data-both-relation') == expected, 'picture reports actual relation ' + expected)
    a = scene.locator('[data-both-pan="left"]').bounding_box()
    b = scene.locator('[data-both-pan="right"]').bounding_box()
    ok(bool(a and b), 'both attached pans are visible')
    delta = (a['y'] + a['height']) - (b['y'] + b['height'])
    ok(abs(delta) < 2 if expected == 'equal' else delta > 2 if expected == 'left' else delta < -2,
       'pixel pan bases agree with heavier/lower relation')


def share_sketch(p, groups):
    row = work(p)['moves'][-1]
    ok(row['operation'] == {'kind': 'share', 'groups': groups}, 'sketch belongs to the frozen last share row')
    sketch = p.locator('[data-both-share-sketch]')
    ok(sketch.count() == 1, 'a share has one visible before/group sketch')
    for side in ['left', 'right']:
        before = row['before'][side]
        pan = sketch.locator('[data-both-share-side="' + side + '"]')
        ok(pan.count() == 1 and 'before sharing' in pan.inner_text(), side + ' sketch names its before arrangement')
        ok(f"{before['parcels']} whole parcels and {before['units']} unit weights" in pan.inner_text(),
           side + ' before counts come from the frozen row')
        drawn = pan.locator('[data-both-group]')
        ok(drawn.count() == groups and pan.locator('[data-both-group="compared"]').count() == 1 and
           pan.locator('[data-both-group="aside"]').count() == groups - 1,
           side + ' shows one compared group and every other group set aside')
        for i in range(groups):
            group = drawn.nth(i)
            ok(group.locator('.both-mini-parcel').count() * groups == before['parcels'] and
               group.locator('.both-mini-unit').count() * groups == before['units'],
               side + ' group tokens reconstruct the exact before parcel and unit counts')


def proposed_wording(p, check, relation):
    feedback = check['feedback'].lower()
    ok('is lower' not in feedback and 'model mass' not in feedback,
       'a different proposal reply never asserts a new physical pan relation')
    text = p.locator('[data-both-recorded-substitution]').inner_text().lower()
    expected = 'the proposed totals are equal' if relation == 'equal' else f'the proposed {relation} total is greater'
    ok(expected in text and 'is lower' not in text and 'model mass' not in text,
       'recorded proposed-total wording remains separate from the actual apparatus')


def live(left, right):
    return dict(zip(['left', 'right'], [dict(zip(['parcels', 'units', 'bags'], x)) for x in [left, right]]))


def download(p):
    go(p, '#notes')
    with p.expect_download() as d:
        p.locator('#download').click()
    return json.loads(Path(d.value.path()).read_text())


def bring(p, raw):
    go(p, '#notes')
    p.locator('#progress-file').set_input_files({'name': 'synthetic-balance-both.json',
                                               'mimeType': 'application/json',
                                               'buffer': json.dumps(raw).encode()})
    p.locator('#progress-import-confirm').click()
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual notes import completed')


def reload(p):
    identity = active(p)
    p.reload()
    p.locator('#explorer-header').wait_for()
    chooser = p.locator('[data-select-explorer="' + identity + '"]')
    if chooser.count():
        chooser.click()
    p.locator('[data-both-root]').wait_for()


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, executable_path=os.environ.get(
        'CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
    try:
        for width in [320, 820]:
            c, p = setup(browser, width)
            go(p)
            initial = book(p)
            ok('balanceBoth' not in initial, 'passive entry allocates no both-pan work')
            ok(p.locator('[data-both-start]').count() == 4, 'all four cases are open immediately')
            bounds(p)
            shot(p, f'entry-{width}.png')

            # No multiplication is revealed by the generic line or an unopened worked example.
            card(p, 'both-sides-2')
            ok(work(p)['learnSeen'] == 1 and not work(p)['support']['example'], 'generic teaching only at first entry')
            ok(not book(p)['baseline']['draft'].get('exposed'), 'unopened example does not qualify pending baseline')
            ok(not book(p)['postOffice']['visits'][0]['rival'].get('priorFactShown'), 'unopened example does not qualify pending Bramble')
            for revealed in [2, 3]:
                tap(p, '[data-both-learn]')
                ok(work(p)['learnSeen'] == revealed, 'learn reveals exactly one additional line')
                ok('2x4' not in book(p).get('exposures', []), 'unshown learn product is not exposed early')
            tap(p, '[data-both-learn]')
            ok(work(p)['learnSeen'] == 4 and '2x4' in book(p).get('exposures', []),
               'actually revealed multiplication line records its product')
            fold(p)
            fold(p, False)
            ok(work(p)['learnSeen'] == 4 and work(p)['support']['learn'], 'fold/reopen preserves already shown teaching')

            # Case 1 has an actually visible guided substitution, which is support.
            card(p, 'both-sides-1')
            geometry(p, 'equal')
            ok(work(p)['support']['guided'], 'visible first-case guidance recorded separately')
            ok('3 × 4' in p.locator('.both-page').inner_text(), 'guided displayed product is real visible content')
            ok(book(p)['baseline']['draft'].get('exposed') is True, 'shown 3×4 qualifies pending baseline 4×3')
            ok(book(p)['postOffice']['visits'][0]['rival'].get('priorFactShown') is True, 'shown 3×4 qualifies pending Bramble')
            fold(p)
            proposal(p, '4')
            keep(p, 'proposal')
            checked = work(p)['checks'][-1]
            ok(checked['valueMatch'] is True and checked['isolated'] is False,
               'a matching guess is separate from isolating P')
            first = copy.deepcopy(work(p)['firstKept'])
            page(p, 'balance')
            prior = copy.deepcopy(work(p)['checks'])
            # Deliberately skip the input event: Check must read current DOM, not persisted valid 4.
            p.locator('[data-both-proposal]').evaluate("x=>x.value='4x'")
            keep(p, 'proposal')
            ok(work(p)['checks'] == prior, 'raw nonnumeric DOM cannot regrade an earlier valid draft')
            proposal(p, '')
            keep(p, 'proposal')
            ok(work(p)['checks'] == prior, 'blank proposal is an instruction, not an incorrect attempt')

            # Keyboard activation, then actual typed→tap and typed→Tab interactions.
            remove = p.locator('[data-both-action="parcel-pair"]')
            remove.focus()
            p.keyboard.press('Enter')
            ok(work(p)['live'] == live((2, 4, 0), (0, 12, 0)), 'keyboard paired removal changes both pans')
            row_source = work(p)['moves'][-1]['source']
            ok(set(row_source) == {'version', 'kind', 'id', 'parcelMass', 'bagUnits'} and
               row_source['kind'] == 'balance-both-row', 'new ledger rows keep only their compact frozen model source')
            ok(p.locator('[data-both-action="parcel-pair"]').evaluate('x=>document.activeElement===x'),
               'move restores local keyboard focus')
            proposal(p, '8')
            action(p, 'unit-pair')
            ok(work(p)['draft'] == '8' and work(p)['live'] == live((2, 3, 0), (0, 11, 0)),
               'typed proposal then direct tap keeps draft and enacts tapped move')
            for _ in range(3):
                action(p, 'unit-pair')
            before = copy.deepcopy(work(p)['live'])
            share(p, 3)
            ok(work(p)['live'] == before, 'nondivisible whole groups refuse atomically')
            share(p, 2)
            ok(work(p)['live'] == live((1, 0, 0), (0, 4, 0)), 'whole-group sharing isolates one parcel without splitting it')
            ok('set aside' in p.locator('.both-page').inner_text(), 'sharing explains the other whole groups set aside')
            share_sketch(p, 2)
            shared = copy.deepcopy(work(p)['live'])
            action(p, 'unit-right')
            ok(p.locator('[data-both-share-sketch]').count() == 0, 'a following move hides the earlier share sketch')
            geometry(p, 'left')
            tap(p, '[data-both-undo]')
            ok(work(p)['live'] == shared, 'Undo restores the shared arrangement without changing its frozen sketch inputs')
            share_sketch(p, 2)
            proposal(p, '')
            keep(p)
            last = work(p)['checks'][-1]
            ok(last['valueMatch'] is None and last['isolated'] is True and last['proposal'] is None,
               'blank keep records isolation with value-match unobserved')
            page(p, 'balance')
            proposal(p, '5')
            p.locator('[data-both-proposal]').focus()
            p.keyboard.press('Tab')
            ok(p.evaluate("document.activeElement?.getAttribute('data-both-check')") == 'proposal',
               'typed proposal Tabs to its check without focus bounce')
            p.keyboard.press('Enter')
            last = work(p)['checks'][-1]
            ok(last['valueMatch'] is False and last['isolated'] is True and last['model']['relation'] == 'equal',
               'different proposed value does not change the actual level isolated picture')
            ok(last['proposedModel'] == {'left': 19, 'right': 17, 'relation': 'left'}, 'P5 gives proposed totals 19/17')
            proposed_wording(p, last, 'left')
            page(p, 'balance')
            geometry(p, 'equal')
            bounds(p)
            shot(p, f'isolated-{width}.png')
            kept = copy.deepcopy(work(p)['checks'])
            support = copy.deepcopy(work(p)['support'])
            tap(p, '[data-both-reset]')
            ok(work(p)['live'] == work(p)['source']['start'] and work(p)['draft'] == '' and not work(p)['moves'],
               'explicit reset clears only current arrangement, path and proposal')
            ok(work(p)['checks'] == kept and work(p)['firstKept'] == first and work(p)['support'] == support,
               'reset preserves earlier checks, first kept work and support')

            # One-sided experiments can break and then restore equality; older pictures remain distinct.
            action(p, 'parcel-left')
            geometry(p, 'right')
            action(p, 'parcel-pair')
            geometry(p, 'right')
            tap(p, '[data-both-undo]')
            ok(work(p)['live'] == live((2, 4, 0), (1, 12, 0)), 'Undo restores preceding pictured counts')
            ok(len(work(p)['moves']) == 1, 'Undo pops its live ledger row')
            action(p, 'parcel-right')
            geometry(p, 'equal')
            current = copy.deepcopy(work(p)['live'])
            page(p, 'ledger')
            tap(p, '[data-both-inspect="0"]')
            ok(work(p)['live'] == current and work(p)['inspection'] == 0, 'ledger inspection leaves current counts waiting')
            geometry(p, 'right')
            ok('Earlier line' in p.locator('.both-page').inner_text(), 'historical picture is explicitly labeled')
            movable = p.locator('[data-both-action]').evaluate_all(
                "xs=>xs.filter(x=>x.getClientRects().length&&!x.disabled&&x.getAttribute('aria-disabled')!=='true').length")
            ok(movable == 0, 'earlier picture offers no active live moves')
            shot(p, f'earlier-line-{width}.png')
            tap(p, '[data-both-current]')
            ok(work(p)['inspection'] is None and work(p)['live'] == current, 'Back to current restores live view')
            geometry(p, 'equal')
            page(p, 'balance')
            saved_case1 = copy.deepcopy(work(p))

            # Other cases exercise their shortest distinct whole-object routes.
            routes = [('both-sides-2', 2, 0, 3, live((0, 3, 0), (1, 0, 0))),
                      ('both-sides-3', 2, 1, 2, live((1, 0, 0), (0, 5, 0))),
                      ('bags-of-three', 1, 6, 2, live((1, 0, 0), (0, 4, 0)))]
            for case, parcels, units, groups, expected in routes:
                card(p, case)
                fold(p)
                geometry(p, 'equal')
                if case == 'bags-of-three':
                    before = copy.deepcopy(work(p)['live'])
                    ok(p.locator('.both-scene [data-both-pan="left"] .both-bag').count() == 3,
                       'three closed bags are individually drawn')
                    shot(p, f'closed-bags-{width}.png')
                    share(p, 3)
                    ok(work(p)['live'] == before, 'closed bags cannot be divided or auto-opened')
                    for remaining in [2, 1, 0]:
                        action(p, 'open-left')
                        ok(work(p)['live']['left']['bags'] == remaining, 'one selected bag opens per action')
                        pan = p.locator('.both-scene [data-both-pan="left"]')
                        ok(pan.locator('.both-bag').count() == remaining and
                           pan.locator('.both-parcel').count() == 3 - remaining and
                           pan.locator('.both-units span').count() == 2 * (3 - remaining),
                           'bag picture shows the exact opened parcels and loose units')
                        geometry(p, 'equal')
                        if remaining == 2:
                            shot(p, f'one-open-bag-{width}.png')
                    ok(work(p)['live'] == live((3, 6, 0), (1, 14, 0)), 'bag contents match three parcels and six units')
                for _ in range(parcels):
                    action(p, 'parcel-pair')
                for _ in range(units):
                    action(p, 'unit-pair')
                share(p, groups)
                ok(work(p)['live'] == expected, case + ' isolates by exact whole groups')
                share_sketch(p, groups)
                proposal(p, '')
                keep(p)
                ok(work(p)['checks'][-1]['isolated'] and work(p)['checks'][-1]['valueMatch'] is None,
                   case + ' blank isolated keep remains ungraded for value')
                page(p, 'balance')
                bounds(p)
                shot(p, case + '-' + str(width) + '.png')

            # Every help stage has its own support and preserves the waiting work.
            before = copy.deepcopy(work(p))
            for stage, flag in [(1, 'hint'), (2, 'example'), (3, 'skip')]:
                tap(p, '[data-both-help]')
                ok(work(p)['helpStage'] == stage and work(p)['support'][flag], 'ladder stage records ' + flag)
                if stage < 3:
                    ok(work(p)['checks'] == before['checks'], 'hint/example do not manufacture answer attempts')
            ok(work(p)['live'] == before['live'] and work(p)['draft'] == before['draft'] and
               work(p)['checks'][:-1] == before['checks'] and work(p)['checks'][-1]['kind'] == 'skipped' and
               work(p)['checks'][-1]['valueMatch'] is None and work(p)['firstKept'] == before['firstKept'],
               'skip keeps pans, proposal, prior checks and first keep while recording an ungraded skipped response')
            tap(p, '[data-both-reveal]')
            tap(p, '[data-both-together]')
            ok(work(p)['support']['reveal'] and work(p)['support']['together'], 'reveal/together separate from an answer')
            card(p, 'both-sides-1')
            ok(work(p) == saved_case1, 'case switching preserves each waiting source and work')
            reload(p)
            ok(work(p) == saved_case1, 'same-case reload preserves exact work')
            after = book(p)
            ok(after['desk'] == initial['desk'] and after['balanceStall'] == initial['balanceStall'],
               'waiting Desk and old single-parcel Balance are unchanged')
            rival = after['postOffice']['visits'][0]['rival']
            old_rival = initial['postOffice']['visits'][0]['rival']
            ok(rival['input'] == old_rival['input'] and rival['attempts'] == old_rival['attempts'],
               'pending Bramble keeps its input and attempts')
            ok(all(after.get(k) == initial.get(k) for k in ['practice', 'puzzles', 'sessions']) and
               after['baseline']['observations'] == initial['baseline']['observations'],
               'model teaching adds no scored generic observation')

            raw = download(p)
            expected = copy.deepcopy(raw['balanceBoth'])
            ok(expected == book(p)['balanceBoth'], 'actual notes download contains exact both-pan work')
            original = active(p)
            bring(p, raw)
            go(p)
            ok(book(p)['balanceBoth'] == expected, 'actual notes import retains all case work')
            p.locator('#explorer-switch').click()
            p.locator('[data-select-explorer="' + original + '"]').click()
            go(p)
            ok(book(p)['balanceBoth'] == expected, 'original explorer remains isolated after importing another')

            # Imported full row sources from the earlier format remain readable, unchanged.
            legacy = copy.deepcopy(raw)
            w = legacy['balanceBoth']['cases']['both-sides-1']
            full_source = copy.deepcopy(w['source'])
            w['moves'][0]['source'] = full_source
            w['inspection'] = 0
            w['page'] = 'balance'
            legacy['balanceBoth']['currentId'] = 'both-sides-1'
            bring(p, legacy)
            go(p)
            ok(work(p)['moves'][0]['source'] == full_source, 'full historical row source is retained without compaction')
            geometry(p, 'right')
            ok('2P + 4' in p.locator('.both-equation').first.inner_text(), 'full historical source still renders its recorded expression')
            tap(p, '[data-both-current]')
            geometry(p, 'equal')
            legacy_export = download(p)
            ok(legacy_export['balanceBoth']['cases']['both-sides-1']['moves'][0]['source'] == full_source,
               'actual download retains the old full row source exactly')

            # Supported historical sources and contradictory old outcomes stay authoritative.
            revised = copy.deepcopy(raw)
            w = revised['balanceBoth']['cases']['both-sides-1']
            historic = w['checks'][-1]
            historic['valueMatch'] = True
            historic['isolated'] = False
            historic['model'] = {'left': 0, 'right': 5, 'relation': 'right'}
            historic['proposedModel'] = {'left': 41, 'right': 7, 'relation': 'left'}
            historic['feedback'] = 'Synthetic historical recorded feedback.'
            old_checks = copy.deepcopy(w['checks'])
            w['source']['start'] = live((2, 4, 0), (1, 10, 0))
            w['live'] = copy.deepcopy(w['source']['start'])
            w['moves'] = []
            w['inspection'] = None
            w['page'] = 'kept'
            w['keptView'] = 'latest'
            w['folded'] = True
            w['source']['guided'] = []
            w['support']['guided'] = False
            revised['balanceBoth']['currentId'] = 'both-sides-1'
            bring(p, revised)
            go(p)
            ok(work(p)['checks'] == old_checks, 'changed saved source does not regrade earlier outcomes')
            recorded = p.locator('.both-record')
            ok(recorded.count() == 1 and 'Synthetic historical recorded feedback.' in recorded.inner_text(),
               'kept page shows only the selected stored record')
            ok('41' in recorded.inner_text() and '7' in recorded.inner_text(),
               'historical proposed totals remain as recorded rather than recomputed')
            p.locator('[data-both-kept]').select_option('first')
            ok(p.locator('.both-record').count() == 1 and 'First kept version' in p.locator('.both-record').inner_text(),
               'explicit history selection opens only the selected first version')
            p.locator('[data-both-kept]').select_option('latest')
            shot(p, f'historical-record-{width}.png')
            page(p, 'balance')
            geometry(p, 'right')
            proposal(p, '6')
            keep(p, 'proposal')
            last = work(p)['checks'][-1]
            ok(last['valueMatch'] is False and last['proposedModel']['relation'] == 'equal' and last['model']['relation'] == 'right',
               'P6 balances imported 2P+4/P+10 while differing from fixed model P4')
            ok(last['proposedModel']['left'] == last['proposedModel']['right'] == 16 and
               last['model']['left'] == 12 and last['model']['right'] == 14,
               'equal proposed 16/16 remains distinct from fixed-model 12/14')
            proposed_wording(p, last, 'equal')
            ok('not level' in p.locator('.both-page').inner_text(), 'unequal saved starting model is disclosed')
            p.locator('.both-record details > summary').click()
            geometry(p, 'right')
            shot(p, f'proposed-vs-model-{width}.png')
            page(p, 'balance')
            proposal(p, '4')
            keep(p, 'proposal')
            last = work(p)['checks'][-1]
            ok(last['valueMatch'] is True and last['proposedModel']['relation'] == 'right',
               'matching source value can preserve unequal source totals')
            bounds(p)
            shot(p, f'imported-unequal-{width}.png')

            mixed = copy.deepcopy(raw)
            mixed['balanceBoth']['cases']['both-sides-2'] = {'future': 'Synthetic <raw> sibling'}
            mixed['balanceBoth']['cases']['saved-case'] = copy.deepcopy(mixed['balanceBoth']['cases']['both-sides-1'])
            mixed['balanceBoth']['cases']['saved-case']['source']['id'] = 'saved-case'
            mixed['balanceBoth']['cases']['saved-case']['source']['title'] = 'Synthetic earlier parcels'
            mixed['balanceBoth']['currentId'] = 'saved-case'
            bring(p, mixed)
            go(p)
            ok(work(p)['source']['id'] == 'saved-case', 'unknown supported saved case remains resumable')
            card(p, 'both-sides-3')
            ok(book(p)['balanceBoth']['cases']['both-sides-2'] == mixed['balanceBoth']['cases']['both-sides-2'],
               'unreadable sibling survives another readable case action')
            roundtrip = download(p)
            ok(roundtrip['balanceBoth']['cases']['both-sides-2'] == mixed['balanceBoth']['cases']['both-sides-2'],
               'actual download retains raw unsupported sibling')
            go(p, '#workshop/balance')
            ok(p.locator('a[href="' + ROUTE + '"]').count() > 0, 'old stall visibly links to new mode')
            c.close()
            print(f'Balance both-pan width {width}: journeys complete ({checks} cumulative assertions).', flush=True)

        # Future wrappers remain read-only, while other destinations stay accessible.
        seed = copy.deepcopy(fixtures['waiting'])
        seed['balanceBoth'] = {'version': 99, 'raw': 'Synthetic future <balance> notebook'}
        c, p = setup(browser, 320, seed)
        go(p)
        ok(book(p)['balanceBoth'] == seed['balanceBoth'], 'future wrapper preserved exactly')
        ok(p.locator('[data-both-start]').count() == 0, 'future wrapper cannot silently fork work')
        go(p, '#desk')
        ok(p.locator('[data-desk-root]').is_visible(), 'future wrapper leaves other places open')
        c.close()

        # Saving off and storage failure retain usable session work and export.
        for failed in [False, True]:
            c, p = setup(browser, 320, failed=failed)
            go(p, '#notes')
            if not failed:
                p.locator('#remember').uncheck()
            go(p)
            card(p, 'both-sides-2')
            fold(p)
            proposal(p, '3')
            keep(p, 'proposal')
            ok(work(p)['checks'][-1]['valueMatch'] is True, 'session work remains usable with saving off or failed')
            if failed:
                ok('Progress could not be saved' in p.locator('body').inner_text(), 'storage failure is disclosed')
            else:
                ok(p.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:')).length===0"),
                   'save-off removes persisted explorer state')
            raw = download(p)
            ok(raw['balanceBoth'] == book(p)['balanceBoth'], 'session-only work is actually downloadable')
            c.close()
        ok(not errors, 'no browser runtime errors: ' + str(errors))
        print(f'Balance both-pan Chrome: {checks} assertions passed at320/820.')
    except Exception:
        print('Assertions before failure:', checks)
        print('Browser errors:', errors)
        print('Module request failures:', network_errors)
        try:
            shot(p, 'failure.png')
            print('Failed page:', p.url)
            print('Main text:', p.locator('main').inner_text()[:1800])
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
