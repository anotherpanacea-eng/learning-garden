"""Synthetic two-seed journeys in Chrome; no learner records or service calls.

The intercepted app response adds only a read-only session-state reader. Set
PAIR_TEST_URL and PAIR_ARTIFACTS for the same test on local or hosted assets.
"""
import copy
import json
import os
from pathlib import Path
import subprocess

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('PAIR_TEST_URL', 'http://127.0.0.1:4196/').rstrip('/') + '/'
OUT = Path(os.environ.get('PAIR_ARTIFACTS', '/tmp/seed-pairs-browser'))
OUT.mkdir(parents=True, exist_ok=True)
ROUTE = '#numbers/seeds/pairs'
fixtures = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', """
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startSeed,drawSeed} from './dist/seed-stall-core.mjs';
import {startPairs,setPairMode,beginPairRun,drawPairFirst,drawPairSecond} from './dist/seed-pairs-core.mjs';
import {startDesk,setDeskLocation,setDeskDraft} from './dist/keepers-desk-core.mjs';
import {startPostOffice} from './dist/post-office-core.mjs';
import {startAdaptiveRival,setBrambleMode} from './dist/post-rival.mjs';
import {generateRivalTask} from './dist/post-rival-generator.mjs';
const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
const waiting=fresh();startSeed(waiting,3);drawSeed(waiting,0);drawSeed(waiting,4);
startDesk(waiting);setDeskLocation(waiting,'cost','1a');setDeskDraft(waiting,'1a','Synthetic waiting rule');
const visit=startPostOffice(waiting,'purl-blankets');setBrambleMode(waiting,'multiply');startAdaptiveRival(waiting);visit.rival.task=generateRivalTask('multiply',2,4,0);visit.rival.input='7';
waiting.baseline.draft={questionId:'groups',attempts:[],input:'',hinted:false,revealed:false};
const ready=fresh();startPairs(ready);
const compositions=Array.from({length:7},(_,sun)=>{const s=structuredClone(ready);s.seedPairs.source.slots=[...Array(sun).fill('sun'),...Array(6-sun).fill('moon')];return s;});
const capped=structuredClone(ready);
for(const mode of ['keep','return'])for(let run=0;run<3;run++){
  setPairMode(capped,mode);beginPairRun(capped,mode);
  for(let i=0;i<(run===2?14:15);i++){drawPairFirst(capped,0);drawPairSecond(capped,0);}
}
console.log(JSON.stringify({fresh:fresh(),waiting,ready,compositions,capped}));
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
    return p.evaluate('()=>window.__pairRead()')


def root(p):
    return book(p)['seedPairs']


def work(p):
    r = root(p)
    return r['tasks'][r['taskId']]


def run(p):
    r = root(p)
    return next((v for v in r['runs'] if v.get('id') == r['currentRun'][r['mode']]), None)


def active(p):
    return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")


def setup(browser, width, seed='waiting', failed=False):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True,
                            accept_downloads=True)
    contexts.append(c)
    state = copy.deepcopy(fixtures[seed] if isinstance(seed, str) else seed)
    c.add_init_script('''({seed,failed})=>{
      if(!localStorage.getItem('pair-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('pair-fixture','1');
      }
      // Uniform production selection is covered by core tests. This synthetic
      // browser fixture selects available index zero to make pictures exact.
      Object.defineProperty(crypto,'getRandomValues',{value:values=>{if(window.__pairEntropyFail)throw Error('Synthetic entropy failure');values.fill(0);return values;}});
      if(failed)Storage.prototype.setItem=function(){throw Error('Synthetic storage failure');};
    }'''.replace('({seed,failed})=>', '(({seed,failed})=>') + ')(' +
                      json.dumps({'seed': state, 'failed': failed}) + ')')

    def app(route):
        response = route.fetch()
        text = response.text()
        anchor = 'let graph=null;'
        assert anchor in text, 'app read-only closure anchor missing'
        route.fulfill(response=response, body=text.replace(
            anchor, 'window.__pairRead=()=>structuredClone(state);' + anchor, 1))

    c.route('**/app.mjs', app)
    p = c.new_page()
    p.on('pageerror', lambda e: errors.append(str(e)))
    p.on('requestfailed', lambda r: network_errors.append(r.url + ': ' + str(r.failure)) if '.mjs' in r.url else None)
    return c, p


def go(p, route=ROUTE):
    p.goto(BASE + route)
    selectors = {ROUTE: '[data-pairs-root]', '#notes': '#download',
                 '#numbers/seeds': '[data-seed-root]', '#desk': '[data-desk-root]'}
    p.locator(selectors.get(route, 'main')).first.wait_for()
    p.wait_for_function("typeof window.__pairRead==='function'")


def tap(p, selector):
    p.locator(selector).first.tap()


def page(p, name):
    tap(p, '[data-pair-page="' + name + '"]')


def mode(p, name):
    tap(p, '[data-pair-mode="' + name + '"]')


def task(p, name):
    p.locator('[data-pair-task]').select_option(name)
    if work(p).get('checkView') is not None:
        p.locator('[data-pair-kept]').select_option('none')


def draft(p, values):
    for i, value in enumerate(values):
        p.locator('[data-pair-draft="' + str(i) + '"]').fill(value)


def selected_check(p):
    w = work(p)
    key = w.get('checkView')
    return w['firstKept'] if key == 'first' else w['checks'][-1] if key == 'latest' else w['checks'][key]


def ask(p, values=None, choice=None):
    if choice is not None:
        tap(p, '[data-pair-option="' + choice + '"]')
    else:
        draft(p, values)
    tap(p, '[data-pair-check]')
    return selected_check(p)


def first(p):
    tap(p, '[data-pair-first]')


def second(p):
    tap(p, '[data-pair-second]')


def full_pair(p):
    first(p)
    second(p)


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    short = p.locator('[data-pairs-root] button,[data-pairs-root] a,[data-pairs-root] summary,[data-pairs-root] input,[data-pairs-root] select').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44)).map(x=>({text:x.textContent,h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width}))")
    ok(not short, '44px visible targets: ' + str(short))


def bag(p, expected):
    cells = p.locator('[data-pair-bag] [data-pair-slot]')
    ok(cells.count() == 6, 'bag preserves all six original position markers')
    # Query from the picture rather than the source record to catch rendering errors.
    available = p.locator('[data-pair-bag] [data-pair-slot][data-available="true"]')
    ok(available.count() == expected, 'picture has exactly ' + str(expected) + ' available positions')
    s = root(p)['source']['slots']
    for i in range(6):
        ok(p.locator('[data-pair-bag] [data-pair-slot="' + str(i) + '"]').get_attribute('data-mark') == s[i],
           'pictured mark matches frozen original position')



def tree_bags(p):
    r = root(p)
    slots = r['source']['slots']
    initial = p.locator('[data-pair-tree-bag="first"]')
    ok(initial.count() == 1 and initial.locator('[data-pair-tree-slot][data-available="true"]').count() == 6,
       'tree first stage pictures all six frozen positions')
    remaining = p.locator('[data-pair-tree-bag="remaining"]')
    first_index = slots.index(r['branch']['first'])
    allowed = [i for i in range(6) if r['mode'] == 'return' or i != first_index]
    ok(remaining.count() == 1 and remaining.locator('[data-pair-tree-slot][data-available="true"]').count() == len(allowed),
       'tree second stage pictures the five/six positions available under its rule')
    for name in ['sun', 'moon']:
        ok(initial.locator('[data-pair-tree-slot][data-mark="' + name + '"][data-available="true"]').count() == slots.count(name),
           'tree initial picture has exact ' + name + ' count')
        ok(remaining.locator('[data-pair-tree-slot][data-mark="' + name + '"][data-available="true"]').count() == sum(slots[i] == name for i in allowed),
           'tree remaining picture has exact conditional ' + name + ' count')


def tally(p, expected):
    bars = p.locator('[data-pair-bar]')
    ok(bars.count() == 3, 'three pair-category bars')
    for mark in ['ss', 'mixed', 'mm']:
        item = p.locator('[data-pair-bar="' + mark + '"]')
        ok(int(item.get_attribute('data-value')) == expected[mark], 'actual tally matches ' + mark)
    g = p.evaluate('''()=>{
      const bars=[...document.querySelectorAll('[data-pair-bar]')];
      const ticks=[...document.querySelectorAll('[data-pair-tick]')].map(x=>({n:Number(x.dataset.pairTick),r:x.getBoundingClientRect().toJSON()}));
      return {bars:bars.map(x=>({n:Number(x.dataset.value),r:x.getBoundingClientRect().toJSON()})),ticks};
    }''')
    if g['ticks']:
        ticks = {v['n']: v['r']['x'] + v['r']['width'] / 2 for v in g['ticks']}
        for bar in g['bars']:
            ok(abs(bar['r']['x'] - ticks[0]) < 2, 'bar starts at the shared zero baseline')
            ok(abs(bar['r']['x'] + bar['r']['width'] - ticks[bar['n']]) < 2,
               'bar ends at its fixed zero-to15 count tick')


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
    p.locator('#progress-file').set_input_files({'name': 'synthetic-seed-pairs.json',
                                               'mimeType': 'application/json',
                                               'buffer': json.dumps(data).encode()})
    p.locator('#progress-import-confirm').click()
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual notes import completed')


def reload(p):
    identity = active(p)
    p.reload()
    p.locator('#explorer-header').wait_for()
    item = p.locator('[data-select-explorer="' + identity + '"]')
    if item.count():
        item.click()
    p.locator('[data-pairs-root]').wait_for()


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, executable_path=os.environ.get(
        'CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
    try:
        for width in [320, 820]:
            c, p = setup(browser, width)
            go(p, '#numbers/seeds')
            original = book(p)
            ok(p.locator('a[href="#numbers/seeds/pairs"]').count() > 0, 'old Seed Stall links to the new investigation')
            go(p)
            ok('seedPairs' not in book(p), 'passive route visit allocates no new progress')
            bounds(p)
            shot(p, f'entry-{width}.png')
            p.locator('[data-pair-start]').focus()
            p.keyboard.press('Enter')
            ok(root(p)['source']['slots'] == ['sun', 'sun', 'moon', 'moon', 'moon', 'moon'],
               'explicit Start freezes the authored bag')
            ok(book(p)['seedStall'] == original['seedStall'], 'starting new mode preserves old Seed Stall')
            tap(p, '[data-pair-begin]')
            tap(p, '[data-pair-predict="mixed"]')
            ok(run(p)['prediction'] == 'mixed', 'prediction is optional pre-draw context')
            before_entropy = copy.deepcopy(root(p))
            p.evaluate('window.__pairEntropyFail=true')
            first(p)
            ok(root(p) == before_entropy, 'unavailable entropy leaves the first draw unrecorded')
            p.evaluate('window.__pairEntropyFail=false')
            first(p)
            ok(p.locator('[data-pair-predict]').count() == 0, 'prediction controls close after first draw')
            ok(run(p)['pending'] == 0 and run(p)['pairs'] == [], 'first draw waits without counting a completed pair')
            bag(p, 5)
            waiting_entropy = copy.deepcopy(root(p))
            p.evaluate('window.__pairEntropyFail=true')
            second(p)
            ok(root(p) == waiting_entropy, 'unavailable entropy preserves the pending first seed')
            p.evaluate('window.__pairEntropyFail=false')
            ok(p.locator('[data-pair-tray="first"]').get_attribute('data-mark') == 'sun', 'first tray shows the selected sun')
            stale = p.locator('[data-pair-second]').element_handle()
            shot(p, f'keep-pending-{width}.png')
            page(p, 'results')
            tally(p, {'ss': 0, 'mixed': 0, 'mm': 0})
            page(p, 'draw')
            ok(run(p)['pending'] == 0, 'page changes preserve the pending first seed')
            mode(p, 'return')
            before = copy.deepcopy(root(p))
            stale.evaluate('el=>el.click()')
            ok(root(p) == before, 'detached stale draw control cannot alter another mode')
            tap(p, '[data-pair-begin]')
            first(p)
            bag(p, 6)
            ok(run(p)['pending'] == 0 and 'return' in p.locator('[data-pairs-root]').inner_text().lower(),
               'returned first seed is visibly available again')
            second(p)
            ok(run(p)['pairs'] == [{'first': 0, 'second': 0}], 'return mode can select the same original position again')
            bag(p, 6)
            shot(p, f'returned-pair-{width}.png')
            mode(p, 'keep')
            ok(run(p)['pending'] == 0, 'other mode still has its waiting first seed')
            frozen = copy.deepcopy(root(p)['source'])
            reload(p)
            ok(run(p)['pending'] == 0 and root(p)['source'] == frozen, 'reload preserves pending first draw and source')
            second(p)
            ok(run(p)['pairs'] == [{'first': 0, 'second': 1}], 'keep second index maps through five remaining original slots')
            bag(p, 6)
            ok('refill' in p.locator('[data-pairs-root]').inner_text().lower(), 'full bag after pair is labeled refilled')
            for _ in range(14):
                full_pair(p)
            ok(len(run(p)['pairs']) == 15 and run(p)['pending'] is None, 'exactly15 completed pairs end the set')
            ok(p.locator('[data-pair-first]').count() == 0 and p.locator('[data-pair-second]').count() == 0,
               'completed set cannot draw trial16')
            page(p, 'results')
            tally(p, {'ss': 15, 'mixed': 0, 'mm': 0})
            body = p.locator('[data-pairs-root]').inner_text().lower()
            ok('average' in body and 'due' in body, 'short-run explanation separates averages and no-due reasoning')
            bounds(p)
            shot(p, f'keep-results-{width}.png')
            page(p, 'draw')
            tap(p, '[data-pair-begin]')
            ok(run(p)['pairs'] == [] and run(p)['prediction'] is None, 'another set starts with an unset prediction')
            first(p)
            pairs_before = copy.deepcopy(root(p)['runs'])
            page(p, 'tree')
            ok('not a random' in p.locator('[data-pairs-root]').inner_text().lower(), 'chosen branch is explicitly distinct from a random trial')
            tap(p, '[data-pair-branch-stage="first"][data-pair-mark="sun"]')
            tap(p, '[data-pair-branch-stage="second"][data-pair-mark="moon"]')
            ok(root(p)['runs'] == pairs_before, 'deliberate branch exploration creates no random observation')
            ok('2/6' in p.locator('[data-pair-first-fraction]').inner_text() and
               '4/5' in p.locator('[data-pair-second-fraction]').inner_text() and
               '8/30' in p.locator('[data-pair-path-fraction]').inner_text(), 'chosen mixed branch has exact conditional fractions')
            ok(root(p)['treeSeen'], 'tree use is kept as supplied support')
            tree_bags(p)
            bounds(p)
            shot(p, f'tree-{width}.png')

            answers = {'first-sun': ['1', '3'], 'after-sun': ['1', '5'], 'after-moon': ['2', '5'],
                       'path-ss': ['1', '15'], 'path-mixed': ['8', '15'], 'path-mm': ['2', '5'],
                       'total': ['1', '1'], 'averages': ['1', '8', '6']}
            choice_answers = {'likely': 'mixed', 'compare': 'yes'}
            for name in ['first-sun', 'after-sun', 'after-moon', 'path-ss', 'path-mixed', 'path-mm',
                         'total', 'likely', 'compare', 'averages']:
                task(p, name)
                old_checks = copy.deepcopy(work(p)['checks'])
                old_draft = copy.deepcopy(work(p)['draft'])
                for stage, flag in [(1, 'hint'), (2, 'example'), (3, 'skip')]:
                    tap(p, '[data-pair-help]')
                    ok(work(p)['helpStage'] == stage and work(p)['support'][flag], name + ' records separate ' + flag)
                ok(work(p)['draft'] == old_draft and work(p)['checks'] == old_checks,
                   name + ' skip preserves input and creates no checked response')
                tap(p, '[data-pair-help]')
                ok(work(p)['helpStage'] == 1 and work(p)['support']['skip'], name + ' can reopen help after skip')
                if name == 'after-sun':
                    draft(p, ['1', '5'])
                    p.locator('[data-pair-draft="0"]').focus()
                    p.keyboard.press('Tab')
                    ok(p.evaluate("document.activeElement?.dataset.pairDraft==='1'"), 'typed numerator Tabs directly to denominator')
                    p.keyboard.press('Tab')
                    ok(p.evaluate("document.activeElement?.hasAttribute('data-pair-check')"), 'typed denominator Tabs directly to Check')
                    before = copy.deepcopy(work(p))
                    draft(p, ['1x', '5'])
                    tap(p, '[data-pair-check]')
                    ok(work(p)['checks'] == before['checks'] and work(p)['draft'] == before['draft'],
                       'invalid actual DOM text never checks an earlier valid draft')
                    draft(p, ['1', '0'])
                    tap(p, '[data-pair-check]')
                    ok(work(p)['checks'] == before['checks'], 'zero denominator is input repair, not an incorrect attempt')
                if name == 'after-sun':
                    wrong = ask(p, ['2', '6'])
                    ok(wrong['correct'] is False and ('five' in wrong['feedback'].lower() or '5' in wrong['feedback']),
                       'reused first-draw chance gets the remaining-five explanation')
                    p.locator('[data-pair-kept]').select_option('none')
                if name == 'path-ss':
                    wrong = ask(p, ['8', '15'])
                    ok(wrong['correct'] is False and 'multiply' in wrong['feedback'].lower(),
                       'adding branch probabilities gets the multiplication explanation')
                    p.locator('[data-pair-kept]').select_option('none')
                checked = ask(p, answers.get(name), choice_answers.get(name))
                ok(checked['correct'] is True and checked['support']['tree'] and checked['support']['skip'] and checked['support']['theory'],
                   name + ' checked value and earlier support remain distinct')
                ok(checked['source']['slots'] == ['sun', 'sun', 'moon', 'moon', 'moon', 'moon'],
                   name + ' records its own question bag')
                ok(p.locator('[data-pair-record]').count() == 1, name + ' shows only one selected check')
            bounds(p)
            shot(p, f'averages-check-{width}.png')

            task(p, 'first-sun')
            first_kept = copy.deepcopy(work(p)['firstKept'])
            for value in ['0', '1', '2', '3', '4']:
                checked = ask(p, [value, '6'])
                p.locator('[data-pair-kept]').select_option('none')
            ok(len(work(p)['checks']) == 4 and work(p)['firstKept'] == first_kept,
               'latest-four retention preserves first explicitly checked version')
            p.locator('[data-pair-kept]').select_option('first')
            ok(selected_check(p) == first_kept and p.locator('[data-pair-record]').count() == 1,
               'first check opens only after explicit version selection')
            retained = copy.deepcopy(root(p))
            reload(p)
            ok(root(p) == retained, 'all work and selected check survive reload')
            current = book(p)
            ok(current['seedStall'] == original['seedStall'] and current['desk'] == original['desk'],
               'old Seed Stall and waiting Desk stay unchanged')
            ok(current['practice'] == original['practice'] and current['puzzles'] == original['puzzles'] and
               current['sessions'] == original['sessions'] and current['baseline']['observations'] == original['baseline']['observations'],
               'probability teaching adds no scored generic observations')
            ok(current['postOffice']['visits'][0]['rival']['input'] == original['postOffice']['visits'][0]['rival']['input'],
               'pending Bramble input survives picture exposure')
            identity = active(p)
            raw = download(p)
            expected = copy.deepcopy(raw['seedPairs'])
            ok(expected == root(p), 'actual notes download contains exact two-seed records')
            bring(p, raw)
            go(p)
            ok(root(p) == expected, 'actual notes import preserves two-seed progress')
            p.locator('#explorer-switch').click()
            p.locator('[data-select-explorer="' + identity + '"]').click()
            go(p)
            ok(root(p) == expected, 'original explorer remains isolated after a new imported explorer')

            historic = copy.deepcopy(raw)
            r = historic['seedPairs']
            r['source']['slots'] = ['sun'] * 3 + ['moon'] * 3
            r['page'] = 'tree'
            r['taskId'] = 'first-sun'
            w = r['tasks']['first-sun']
            w['checkView'] = 'latest'
            w['checks'][-1]['correct'] = False
            w['checks'][-1]['feedback'] = 'Synthetic recorded feedback remains authoritative.'
            saved_checks = copy.deepcopy(w['checks'])
            bring(p, historic)
            go(p)
            ok(work(p)['checks'] == saved_checks, 'changed experiment bag does not regrade historical outcomes')
            ok('Synthetic recorded feedback' in p.locator('[data-pair-record]').inner_text(), 'kept feedback is displayed as recorded')
            p.locator('[data-pair-kept]').select_option('none')
            question_bag = p.locator('[data-pair-question-bag]').inner_text().lower()
            ok('2' in question_bag and '4' in question_bag and 'separate' in p.locator('[data-pairs-root]').inner_text().lower(),
               'question keeps its own2/4 bag when live experiment is3/3')
            checked = ask(p, ['2', '6'])
            ok(checked['correct'] is True and checked['source']['slots'] == ['sun', 'sun', 'moon', 'moon', 'moon', 'moon'],
               'new check uses its explicitly displayed question source, not the experiment bag')
            shot(p, f'separate-question-bag-{width}.png')

            mixed = copy.deepcopy(raw)
            r = mixed['seedPairs']
            r['tasks']['after-sun'] = {'future': 'Synthetic <raw> question work'}
            r['runs'].append({'id': 999, 'future': 'Synthetic <raw> run'})
            r['taskId'] = 'after-sun'
            r['page'] = 'tree'
            bring(p, mixed)
            go(p)
            ok(p.locator('a[href="#notes"]').count() > 0, 'unreadable question offers notes')
            task(p, 'after-moon')
            ok(work(p)['source']['id'] == 'after-moon', 'another readable question remains open')
            page(p, 'draw')
            ok(root(p)['tasks']['after-sun'] == mixed['seedPairs']['tasks']['after-sun'] and
               root(p)['runs'][-1] == mixed['seedPairs']['runs'][-1], 'malformed siblings remain raw during another action')
            again = download(p)
            ok(again['seedPairs']['tasks']['after-sun'] == mixed['seedPairs']['tasks']['after-sun'],
               'unreadable task is retained in actual download')
            c.close()
            print(f'Seed pairs width {width}: journeys complete ({checks} cumulative assertions).', flush=True)

        # Every supported frozen bag uses its own branch counts rather than today's2/4.
        for sun, seed in enumerate(fixtures['compositions']):
            c, p = setup(browser, 320, seed)
            go(p)
            page(p, 'tree')
            first_mark = 'sun' if sun else 'moon'
            second_mark = 'sun' if sun > 1 else 'moon'
            tap(p, '[data-pair-branch-stage="first"][data-pair-mark="' + first_mark + '"]')
            tap(p, '[data-pair-branch-stage="second"][data-pair-mark="' + second_mark + '"]')
            first_count = sun if first_mark == 'sun' else 6 - sun
            second_count = (sun if second_mark == 'sun' else 6 - sun) - (first_mark == second_mark)
            ok(f'{first_count}/6' in p.locator('[data-pair-first-fraction]').inner_text() and
               f'{second_count}/5' in p.locator('[data-pair-second-fraction]').inner_text(),
               'keep tree uses frozen composition ' + str(sun) + '/' + str(6 - sun))
            ok(f'{first_count * second_count}/30' in p.locator('[data-pair-path-fraction]').inner_text(),
               'keep path product matches independent count enumeration')
            tree_bags(p)
            page(p, 'results')
            moon = 6 - sun
            keep_numerators = {'ss': sun * (sun - 1), 'mixed': 2 * sun * moon, 'mm': moon * (moon - 1)}
            for outcome in ['ss', 'mixed', 'mm']:
                ok(p.locator('[data-pair-theory="' + outcome + '"]').inner_text() == f'{keep_numerators[outcome]}/30',
                   'keep theory table follows frozen bag for ' + outcome)
                ok(p.locator('[data-pair-expected="' + outcome + '"]').inner_text() == str(keep_numerators[outcome] // 2),
                   'keep15-trial average is derived from frozen bag for ' + outcome)
            page(p, 'tree')
            mode(p, 'return')
            tap(p, '[data-pair-branch-stage="first"][data-pair-mark="' + first_mark + '"]')
            tap(p, '[data-pair-branch-stage="second"][data-pair-mark="' + second_mark + '"]')
            second_count = sun if second_mark == 'sun' else 6 - sun
            ok(f'{second_count}/6' in p.locator('[data-pair-second-fraction]').inner_text() and
               f'{first_count * second_count}/36' in p.locator('[data-pair-path-fraction]').inner_text(),
               'return tree restores six slots for the same frozen composition')
            tree_bags(p)
            page(p, 'results')
            return_numerators = {'ss': sun * sun, 'mixed': 2 * sun * moon, 'mm': moon * moon}
            for outcome in ['ss', 'mixed', 'mm']:
                ok(p.locator('[data-pair-theory="' + outcome + '"]').inner_text() == f'{return_numerators[outcome]}/36',
                   'return theory table follows frozen bag for ' + outcome)
            ok(p.locator('[data-pair-expected]').count() == 0, 'return mode omits whole averages for all frozen bags')
            page(p, 'tree')
            if sun in [0, 6]:
                absent = 'sun' if sun == 0 else 'moon'
                ok(p.locator('[data-pair-branch-stage="first"][data-pair-mark="' + absent + '"]').is_disabled(),
                   'absent first mark is unavailable rather than drawn')
            c.close()

        # A retained absent-first branch is kept raw without inventing a condition.
        absent_seed = copy.deepcopy(fixtures['compositions'][0])
        absent_seed['seedPairs']['page'] = 'tree'
        absent_seed['seedPairs']['branch'] = {'first': 'sun', 'second': 'moon'}
        c, p = setup(browser, 320, absent_seed)
        go(p)
        ok(root(p)['branch'] == {'first': 'sun', 'second': 'moon'}, 'absent stored branch is not rewritten on load')
        ok(p.locator('[data-pair-second-fraction]').count() == 0 and
           p.locator('[data-pair-path-fraction]').count() == 0 and
           'absent' in p.locator('[data-pair-branch]').inner_text().lower(),
           'absent first mark shows no invented conditional fraction or product')
        ok(p.locator('[data-pair-tree-bag="remaining"]').count() == 0,
           'absent retained first mark does not invent a remaining-bag picture')
        tap(p, '[data-pair-branch-stage="first"][data-pair-mark="moon"]')
        tap(p, '[data-pair-branch-stage="second"][data-pair-mark="moon"]')
        ok('30/30' in p.locator('[data-pair-path-fraction]').inner_text(), 'explicit present-mark choice restores a meaningful path')
        tree_bags(p)
        c.close()

        # Finish the third set in each mode through UI, then verify the hard cap.
        c, p = setup(browser, 820, 'capped')
        go(p)
        for name in ['keep', 'return']:
            mode(p, name)
            ok(len(run(p)['pairs']) == 14, 'third set starts with14 preserved pairs')
            full_pair(p)
            ok(len(run(p)['pairs']) == 15 and len([v for v in root(p)['runs'] if v['mode'] == name]) == 3,
               'third set completes without growing another run')
            ok(p.locator('[data-pair-begin]').count() == 0 or p.locator('[data-pair-begin]').is_disabled(),
               'a fourth set is unavailable')
            page(p, 'results')
            tally(p, {'ss': 15, 'mixed': 0, 'mm': 0})
            if name == 'return':
                ok(p.locator('[data-pair-expected]').count() == 0, 'return results do not reuse whole keep-mode means')
            page(p, 'draw')
        c.close()

        for unsupported in [None, {'version': 99, 'future': 'Synthetic raw format'}]:
            seed = copy.deepcopy(fixtures['fresh'])
            seed['seedPairs'] = unsupported
            c, p = setup(browser, 320, seed)
            go(p)
            ok(book(p)['seedPairs'] == unsupported and p.locator('[data-pair-start]').count() == 0,
               'unknown wrapper is retained and cannot silently overwrite progress')
            go(p, '#numbers/seeds')
            ok(p.locator('[data-seed-root]').is_visible(), 'old Seed Stall remains open under unknown new format')
            c.close()

        for failed in [False, True]:
            c, p = setup(browser, 320, failed=failed)
            go(p, '#notes')
            if not failed:
                p.locator('#remember').uncheck()
            go(p)
            tap(p, '[data-pair-start]')
            tap(p, '[data-pair-begin]')
            full_pair(p)
            ok(len(run(p)['pairs']) == 1, 'session-only experiment remains playable')
            raw = download(p)
            ok(raw['seedPairs'] == root(p), 'session-only progress is actually downloadable')
            if failed:
                ok('Progress could not be saved' in p.locator('body').inner_text(), 'storage failure is disclosed')
            else:
                ok(p.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:')).length===0"),
                   'save-off leaves no persisted explorer state')
            c.close()
        ok(not errors, 'zero browser runtime errors: ' + str(errors))
        print(f'Seed pairs Chrome: {checks} assertions passed at320/820.', flush=True)
    except Exception:
        print('Assertions before failure:', checks, flush=True)
        print('Browser errors:', errors, flush=True)
        print('Module request failures:', network_errors, flush=True)
        try:
            shot(p, 'failure.png')
            print('Failed URL:', p.url, flush=True)
            print('Main text:', p.locator('main').inner_text()[:1800], flush=True)
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
