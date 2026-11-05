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


class Quiet(http.server.SimpleHTTPRequestHandler):
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
                    fits(page)
                    page.screenshot(path=str(OUT / f'{section}-{current}-{width}.png'), full_page=True)

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
