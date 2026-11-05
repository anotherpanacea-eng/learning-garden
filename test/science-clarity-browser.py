"""Real-app checks of saved science choices, replacement warnings and reload.

Fictional fixtures only. CHROME_PATH selects Chromium; SCIENCE_CLARITY_ARTIFACTS
selects screenshots and receipts. No application-module interception.
"""
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

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('SCIENCE_CLARITY_ARTIFACTS', tempfile.mkdtemp(prefix='science-clarity-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['CAFE_TOUCH_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('cafe_helpers', ROOT / 'test/cafe-touch-browser.py')
helpers = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helpers)
program = """
import {cafeTouchFixtures} from './test/cafe-touch-checks.mjs';
import * as F from './dist/field-notebook-core.mjs';
import * as R from './dist/rain-paths-core.mjs';
import * as N from './dist/rain-notebook-core.mjs';
import * as P from './dist/plant-study-core.mjs';
import {plantQuestions} from './dist/plant-study-content.mjs';
import * as A from './dist/living-adaptive-core.mjs';
import * as B from './dist/bell-studio-core.mjs';
import {BELL_CARDS} from './dist/bell-studio-content.mjs';
const s=cafeTouchFixtures().base;
F.chooseFieldCase(s,'light-day-6-A');
for(const id of ['day-6-light-A','day-6-dim-A'])F.toggleFieldRow(s,id);
F.setFieldValue(s,'day-6-light-A',38);F.setFieldValue(s,'day-6-dim-A',65);F.keepFieldDraft(s);F.setFieldValue(s,'day-6-light-A',1);F.setFieldPage(s,'keep');
R.chooseRainCase(s,'cover-12');while(!R.currentRainView(s).complete)R.nextRainPhase(s);
N.inviteRainNotebook(s,N.rainNotebookInvitation(s,'cover-12','current-completed'));
for(const id of ['A:runoffNew','B:runoffNew'])N.toggleRainNotebookRow(s,id);
N.setRainNotebookQuantity(s,'runoffNew');N.setRainNotebookValue(s,'A:runoffNew',0);N.setRainNotebookValue(s,'B:runoffNew',12);N.checkRainNotebookChart(s);N.keepRainNotebookDraft(s);N.setRainNotebookValue(s,'A:runoffNew',2);N.setRainNotebookPage(s,'keep');
R.chooseRainPlan(s,'A','straight');R.keepRainPlan(s,'A');R.setRainPlanRoute(s,'A','holding12');R.setRainPage(s,'plan');
P.ensurePlantStudy(s);P.recordPlantObservation(s);P.choosePlantLocation(s,'light');P.carryPlantPlan(s,P.currentPlantObservation(s).id);
P.setPlantDay(s,6);P.setPlantSpecimen(s,'dim','A');P.recordPlantObservation(s);P.choosePlantLocation(s,'dim');P.setPlantPage(s,'compare');
A.setAdaptiveChoice(s,'science',3);A.startAdaptiveSpiral(s);A.inspectAdaptive(s,0);A.inspectAdaptive(s,1);A.inspectAdaptive(s,2);A.setAdaptivePage(s,'compare');A.revealAdaptiveChange(s);A.supportAdaptive(s,'science','help');
B.chooseBellCard(s,BELL_CARDS[0].id);B.appendBellSlot(s,'low');B.appendBellSlot(s,'high');B.saveBellBefore(s);B.keepBellCall(s);B.appendBellSlot(s,'rest');B.setBellPage(s,'keep');
console.log(JSON.stringify({seed:s,legacyPlant:plantQuestions(6).map(q=>({id:q.id,choices:q.choices.map(c=>c.id)}))}));
"""
fixture = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', program], cwd=ROOT, text=True))
checks = 0


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def described(page, selector):
    note = page.locator(selector).get_attribute('aria-describedby')
    ok(bool(note) and page.locator('#' + note).is_visible(), selector + ' has visible warning')
    ok(bool(helpers.ax(page, selector).get('description', {}).get('value')), selector + ' has computed warning')


def go(page, base, route, selector):
    page.goto(base + route, wait_until='domcontentloaded')
    page.locator('#explorer-header').wait_for()
    chooser = page.locator('[data-select-explorer="explorer-1"]')
    if chooser.count():
        chooser.click()
        page.evaluate('(r)=>location.hash=r', route)
    page.locator(selector).first.wait_for()


def fits(page):
    if not page.evaluate('document.documentElement.scrollWidth<=innerWidth'):
        page.screenshot(path=str(OUT / 'overflow.png'), full_page=True)
        print(page.url, page.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,outside:[...document.querySelectorAll("main *")].filter(e=>e.checkVisibility()&&e.getBoundingClientRect().right>innerWidth+1).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,100),right:e.getBoundingClientRect().right}))})'))
    ok(page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'no sideways overflow at ' + page.url)


def damaged_choice_journey(browser, base, width):
    for kind in ['duplicate', 'malformed']:
        seed = copy.deepcopy(fixture['seed'])
        q, other = fixture['legacyPlant'][:2]
        sets = seed['plantStudy']['choiceSets']
        sets[q['id']] = [copy.deepcopy(sets[q['id']][0])] * 2 if kind == 'duplicate' else {'unreadable': 'retained'}
        sets[other['id']].reverse()
        seed['plantStudy']['questions'][q['id']] = {'attempts': [{'choice': 'retired-response', 'support': {}, 'practice': True, 'familiar': True}], 'support': {}}
        visit = seed['livingExploration']['current']
        choices = visit['task']['teaching']['scienceChoices']
        visit['task']['teaching']['scienceChoices'] = [copy.deepcopy(choices[0])] * 2 if kind == 'duplicate' else [None]
        visit['science']['detail'] = 'retired-response'
        page = helpers.setup(browser, seed, width, f'broken-choices-{kind}-{width}')
        go(page, base, '#living/plants', '[data-ps-answer]')
        before = copy.deepcopy(helpers.h.book(page)['plantStudy'])
        ok(before == seed['plantStudy'], 'JSON reload opens damaged labels without rewriting notebook')
        current = page.locator(f'[data-ps-answer^="{q["id"]}:"]').evaluate_all('(es)=>es.map(e=>e.dataset.psAnswer.split(":")[1])')
        ok(current == q['choices'], 'damaged Plant question alone uses original choices')
        current = page.locator(f'[data-ps-answer^="{other["id"]}:"]').evaluate_all('(es)=>es.map(e=>e.dataset.psAnswer.split(":")[1])')
        ok(current == [c['id'] for c in sets[other['id']]], 'other Plant question retains saved order')
        page.locator('[data-ps-day="2"]').click()
        page.locator('.ps-steps [data-ps-page="observe"]').click()
        page.locator('[data-ps-keep]').click()
        after = helpers.h.book(page)['plantStudy']
        ok(len(after['observations']) == len(before['observations']) + 1, 'new observation can be kept despite damaged optional labels')
        ok(after['choiceSets'] == before['choiceSets'] and after['questions'] == before['questions'] and after['plan'] == before['plan'], 'observation action preserves raw labels, old responses and carried plan')
        page.reload(wait_until='domcontentloaded')
        page.locator('[data-ps-keep]').wait_for()
        ok(helpers.h.book(page)['plantStudy'] == after, 'notebook action survives reload without normalizing labels')
        go(page, base, '#living/visit', '[data-adapt-science-detail]')
        before_visit = copy.deepcopy(helpers.h.book(page)['livingExploration']['current'])
        ok(before_visit == visit, 'damaged Living labels and retired selection load exactly')
        ok(page.locator('[data-adapt-science-detail]').evaluate_all('(es)=>es.map(e=>e.dataset.adaptScienceDetail)') == ['recheck', 'unchanged', 'no-need'], 'Living question falls back locally')
        page.locator('[data-adapt-page="notice"]').first.click()
        page.locator('[data-adapt-habitat="1"]').click()
        page.locator('[data-adapt-inspect="1"]').click()
        after_visit = helpers.h.book(page)['livingExploration']['current']
        ok(after_visit['view']['habitat'] == 1 and after_visit['task'] == before_visit['task'], 'habitat exploration remains usable without repairing saved metadata')
        ok(all(after_visit[k] == before_visit[k] for k in ['science', 'reading', 'math']), 'all strand responses remain exact')
        fits(page)
        go(page, base, '#notes', '#download')
        with page.expect_download() as event:
            page.locator('#download').click()
        report = json.loads(Path(event.value.path()).read_text(encoding='utf8'))
        ok(report['plantStudy'] == after and report['livingExploration']['current'] == after_visit, 'actual Notes download retains damaged raw labels and unaffected work')
        page.context.close()


class Quiet(http.server.SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    def log_message(self, *_args):
        pass


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True


def main():
    server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/'
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH'), args=['--disable-quic'])
            for width, theme in [(1280, 'light'), (320, 'dark')]:
                page = helpers.setup(browser, copy.deepcopy(fixture['seed']), width, f'science-{width}')
                page.emulate_media(color_scheme=theme)
                for route, selector, section, current, snapshot in [
                    ('#living/notebook', '[data-fn-keep]', 'fieldNotebook', 'light-day-6-A', 'kept'),
                    ('#living/notebook/rain', '[data-rn-keep]', 'fieldNotebook', 'cover-12', 'kept'),
                    ('#science/rain', '[data-rp-keep-plan]', 'rainPaths', 'cover-12', 'keptPlans'),
                ]:
                    go(page, base, route, selector)
                    described(page, selector)
                    before = helpers.h.book(page)[section]
                    if current == 'cover-12' and section == 'fieldNotebook':
                        before = before['rain']
                    old = copy.deepcopy(before['cases'][current][snapshot])
                    if section == 'rainPaths':
                        ok('no runoff' in page.locator('#rp-plan-status').inner_text(), 'zero runoff is not described as zero rain')
                    page.locator(selector).focus()
                    page.keyboard.press('Enter')
                    after = helpers.h.book(page)[section]
                    if current == 'cover-12' and section == 'fieldNotebook':
                        after = after['rain']
                    new = copy.deepcopy(after['cases'][current][snapshot])
                    ok(new != old, 'repeat keep actually replaces the displayed snapshot')
                    page.reload(wait_until='domcontentloaded')
                    page.locator(selector).wait_for()
                    resumed = helpers.h.book(page)[section]
                    if current == 'cover-12' and section == 'fieldNotebook':
                        resumed = resumed['rain']
                    ok(resumed['cases'][current][snapshot] == new, 'replacement survives reload exactly')
                    if section == 'rainPaths' and width == 320:
                        for selector in ['.rp-planning-board .rp-table-scroll', '.rp-kept .rp-table-scroll']:
                            if selector.startswith('.rp-kept'):
                                page.locator('.rp-kept summary').click()
                            drawing = page.locator(selector)
                            drawing.focus()
                            page.keyboard.press('ArrowRight')
                            page.wait_for_function('(s)=>document.querySelector(s).scrollLeft>0', arg=selector)
                            ok(drawing.evaluate('e=>e.scrollLeft>0'), 'planning diagram scrolls with the keyboard')
                    fits(page)
                    page.screenshot(path=str(OUT / f'{section}-{current}-{width}.png'), full_page=True)
                    if section == 'fieldNotebook' and current == 'light-day-6-A':
                        page.locator('.fn-steps [data-fn-page="chart"]').click()
                        ok(helpers.ax(page, '.fn-controls[aria-label^="Adjust"]')['role']['value'] == 'group', 'bar controls expose their named group')
                        page.locator('.fn-steps [data-fn-page="read"]').click()
                        ok(helpers.ax(page, '.fn-read-tabs')['role']['value'] == 'group', 'reading tabs expose their named group')

                go(page, base, '#living/plants', '[data-ps-answer]')
                choices = helpers.h.book(page)['plantStudy']['choiceSets']
                for q in fixture['legacyPlant']:
                    selector = f'[data-ps-answer^="{q["id"]}:"]'
                    expected = [c['id'] for c in choices[q['id']]]
                    ok(page.locator(selector).evaluate_all('(es)=>es.map(e=>e.dataset.psAnswer.split(":")[1])') == expected, 'new notebook displays its saved choice order')
                    page.reload(wait_until='domcontentloaded')
                    page.locator(selector).first.wait_for()
                    ok(page.locator(selector).evaluate_all('(es)=>es.map(e=>e.dataset.psAnswer.split(":")[1])') == expected, 'unanswered choices retain order on reload')
                page.locator('.ps-steps [data-ps-page="plan"]').click()
                described(page, '[data-ps-carry]')
                before = helpers.h.book(page)['plantStudy']
                page.locator('[data-ps-carry]').click()
                page.wait_for_url('**/#regrow')
                after = helpers.h.book(page)['plantStudy']
                ok(after['plan'] != before['plan'] and after['observations'] == before['observations'], 'carrying replaces the plan and preserves notebook observations')
                go(page, base, '#living/plants', '[data-ps-carry]')
                ok(helpers.h.book(page)['plantStudy']['plan'] == after['plan'], 'carried plan survives navigation and reload')
                fits(page)
                page.screenshot(path=str(OUT / f'plant-{width}.png'), full_page=True)

                go(page, base, '#living/visit', '[data-adapt-science-detail]')
                saved = helpers.h.book(page)['livingExploration']['current']['task']['teaching']['scienceChoices']
                ok(page.locator('[data-adapt-science-detail]').evaluate_all('(es)=>es.map(e=>e.dataset.adaptScienceDetail)') == [o['id'] for o in saved], 'adaptive visit displays saved order')
                ok(next(o['text'] for o in saved if o['id'] == 'recheck') in page.locator('#adapt-science-help').inner_text(), 'help finds fitting clue by id')
                fits(page)

                go(page, base, '#studio/bells', '[data-bs-keep]')
                described(page, '[data-bs-keep]')
                book = helpers.h.book(page)['bellStudio']
                card = book['currentCard']
                before = copy.deepcopy(book['cards'][card])
                page.locator('[data-bs-keep]').focus()
                page.keyboard.press('Enter')
                after = helpers.h.book(page)['bellStudio']['cards'][card]
                ok(after['kept'] != before['kept'] and after['before'] == before['before'] and after['sequence'] == before['sequence'], 'keeping replaces Bell draft and preserves before-version and current call')
                page.locator('.bs-pages [data-bs-page="make"]').click()
                described(page, '[data-bs-before]')
                described(page, '[data-bs-clear]')
                before = copy.deepcopy(helpers.h.book(page)['bellStudio']['cards'][card])
                page.locator('[data-bs-before]').click()
                after = helpers.h.book(page)['bellStudio']['cards'][card]
                ok(after['before'] != before['before'] and after['kept'] == before['kept'] and after['sequence'] == before['sequence'], 'replacing Bell before-version preserves draft and current call')
                before = copy.deepcopy(after)
                page.locator('[data-bs-clear]').click()
                after = helpers.h.book(page)['bellStudio']['cards'][card]
                ok(after['sequence'] == [] and all(after[k] == before[k] for k in ['before', 'kept', 'checks']), 'clearing Bell call preserves before-version, kept draft and earlier checks')
                page.reload(wait_until='domcontentloaded')
                page.locator('[data-bs-clear]').wait_for()
                ok(helpers.h.book(page)['bellStudio']['cards'][card] == after, 'Bell clearing survives reload exactly')
                ok(helpers.ax(page, '.bs-previews').get('name', {}).get('value') == 'Try one tone', 'single-tone previews have their spoken region name')
                fits(page)
                page.screenshot(path=str(OUT / f'bell-{width}.png'), full_page=True)
                page.context.close()

                legacy = copy.deepcopy(fixture['seed'])
                del legacy['plantStudy']['choiceSets']
                del legacy['livingExploration']['current']['task']['teaching']['scienceChoices']
                page = helpers.setup(browser, legacy, width, f'legacy-science-{width}')
                go(page, base, '#living/plants', '[data-ps-answer]')
                for q in fixture['legacyPlant']:
                    ok(page.locator(f'[data-ps-answer^="{q["id"]}:"]').evaluate_all('(es)=>es.map(e=>e.dataset.psAnswer.split(":")[1])') == q['choices'], 'legacy unanswered question keeps original order')
                page.reload(wait_until='domcontentloaded')
                page.locator('[data-ps-answer]').first.wait_for()
                ok('choiceSets' not in helpers.h.book(page)['plantStudy'], 'legacy notebook is not migrated on load')
                go(page, base, '#living/visit', '[data-adapt-science-detail]')
                ok(page.locator('[data-adapt-science-detail]').evaluate_all('(es)=>es.map(e=>e.dataset.adaptScienceDetail)') == ['recheck', 'unchanged', 'no-need'], 'legacy visit keeps original order')
                ok('scienceChoices' not in helpers.h.book(page)['livingExploration']['current']['task']['teaching'], 'legacy visit is not migrated on load')
                page.context.close()
            for width in [1280, 320]:
                damaged_choice_journey(browser, base, width)
            ok(not helpers.h.errors and not helpers.h.console_errors, 'no browser errors')
            receipt = dict(passed=True, checks=checks, browser=browser.version, widths=[1280, 320],
                           scope='Actual app, fictional fixtures, computed descriptions, keyboard replacements, new and legacy choice order, reload',
                           limits='Chromium emulation; physical devices, audible speech and learning outcomes untested')
            (OUT / 'RESULT.json').write_text(json.dumps(receipt, indent=2), encoding='utf8')
            print(json.dumps(receipt))
            browser.close()
    finally:
        server.shutdown()
        server.server_close()


if __name__ == '__main__':
    main()
