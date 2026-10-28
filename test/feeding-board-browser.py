"""Spec286 real-app journeys. Synthetic notebooks only; no app interception.

FEEDING_TEST_URL targets hosted builds. FEEDING_ARTIFACTS retains original
screenshots/downloads and receipt. Speech observer forwards native speak calls;
it establishes requests, never audibility or understanding.
"""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('FEEDING_ARTIFACTS', tempfile.mkdtemp(prefix='feeding-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
checks, contexts, pages, errors, faults = 0, [], [], [], []
VIEW = '[data-feeding-board-view]'

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def active(p):
    return p.evaluate("()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")

def book(p):
    return p.evaluate("()=>{const i=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+i));}")

def owner(p):
    return book(p)['feedingBoard']

def entry(p, section, case):
    return next((x for x in owner(p)[section] if x.get('caseId') == case), None)

def raw_report(s):
    return {k: v for k, v in s.items() if k not in ['title', 'exportedAt', 'note', 'explorer', 'recommendation']}

def setup(browser, width, height, seed, label):
    c = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True,
                            reduced_motion='reduce', accept_downloads=True)
    contexts.append(c)
    c.add_init_script('(seed=>{if(!localStorage.getItem("feeding-fixture")){' +
                      'localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(seed));' +
                      'localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:"explorer-1",explorers:[{id:"explorer-1",avatar:"sky",color:"blue",symbol:"leaf",createdAt:"2026-10-28T12:00:00.000Z"}]}));' +
                      'localStorage.setItem("feeding-fixture","1");}})(' + json.dumps(seed) + ')')
    c.add_init_script('window.feedingSpeechRequests=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{window.feedingSpeechRequests.push(u.text);return native(u);};}')
    p = c.new_page()
    pages.append((p, label))
    p.set_default_timeout(12000)
    p.on('pageerror', lambda e: errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda m: faults.append({'case': label, 'type': 'console', 'text': m.text}) if m.type == 'error' else None)
    p.on('response', lambda r: faults.append({'case': label, 'type': 'http', 'status': r.status, 'url': r.url}) if r.status >= 400 else None)
    p.on('requestfailed', lambda r: faults.append({'case': label, 'type': 'request', 'error': r.failure, 'url': r.url}) if 'ERR_ABORTED' not in (r.failure or '') else None)
    return p

def go(p, base, route='#living/who-eats', selector=VIEW):
    p.goto(base + route, wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    identity = active(p)
    choice = p.locator(f'[data-select-explorer="{identity}"]')
    if choice.count():
        choice.click()
    p.locator(selector).wait_for()
    if selector != VIEW and p.locator('dialog.welcome-film[open] [data-film-skip]').count():
        p.locator('dialog.welcome-film[open] [data-film-skip]').click()

def click(p, selector):
    p.locator(selector).first.click()

def button(p, text):
    p.locator(VIEW).get_by_role('button', name=text, exact=True).click()

def snap(p, name):
    p.screenshot(path=str(OUT / (name + '.png')), full_page=True)

def select_case(p, case):
    loc = p.locator(f'[data-fb-case="{case}"]')
    if not loc.is_visible():
        rail = p.locator(VIEW + ' details').filter(has=p.locator(f'[data-fb-case="{case}"]'))
        if rail.count() and not rail.get_attribute('open'):
            rail.locator('summary').click()
    loc.click()

def choose(p, value):
    p.locator(VIEW + f' input[type=radio][data-fb-choice="{value}"]').check()

def stage_bounds(p, tablet):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator(VIEW + ' button,' + VIEW + ' a,' + VIEW + ' summary,' + VIEW + ' label').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight,font:getComputedStyle(x).fontSize}))")
    ok(not bad, '44px visible targets and16px control text: ' + str(bad))
    bad_text = p.locator('.fb-stage p,.fb-stage legend,.fb-stage label,.fb-stage h2').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)")
    ok(not bad_text, 'task text at least16px: ' + str(bad_text))
    if tablet:
        p.evaluate('window.scrollTo(0,0)')
        for loc in [p.locator('.fb-stage .fb-evidence'), *p.locator('.fb-stage .fb-baskets label').all(), p.get_by_role('button', name='Check this basket', exact=True)]:
            r = loc.bounding_box()
            ok(r and r['y'] >= 0 and r['y'] + r['height'] <= p.viewport_size['height'] + 1, 'animal, food and Check fit initial tablet viewport: ' + str(r))
        ok(p.locator('.fb-stage input[type=radio]').count() == 3, 'three native basket targets in stage')
    ok(not p.locator(VIEW + ' [style*="position: fixed"]').count(), 'board has no fixed overlay')

def download(p, base, name):
    go(p, base, '#notes', '#download')
    with p.expect_download() as d:
        click(p, '#download')
    path = OUT / (name + '.json')
    d.value.save_as(path)
    return json.loads(path.read_text())

def bring(p, base, report):
    go(p, base, '#notes', '#progress-file')
    p.locator('#progress-file').set_input_files({'name': 'synthetic-feeding-notebook.json', 'mimeType': 'application/json', 'buffer': json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for()
    ok('Feeding Board' in p.locator('.import-preview').inner_text(), 'actual import preview identifies optional root')
    click(p, '#progress-import-confirm')
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual confirmed import')

def stale(p, transition):
    p.evaluate("window.oldFeedingCheck=document.querySelector('[data-fb-check]');window.oldFeedingRadio=document.querySelector('.fb-stage input[type=radio]')")
    transition()
    before = book(p)
    p.evaluate("()=>{oldFeedingRadio?.dispatchEvent(new Event('change',{bubbles:true}));oldFeedingCheck?.click();}")
    ok(book(p) == before, 'detached old radio/Check cannot answer after owner/view change')

def route_exit(browser, base, seed):
    # Both paths use actual Notes normalization. Only the first activates old controls.
    p = setup(browser, 820, 1180, seed, 'immediate-route-exit')
    go(p, base)
    select_case(p, 'cow')
    before = copy.deepcopy(owner(p))
    ok(entry(p, 'sorts', 'cow') is None and p.locator('[data-fb-check]').is_enabled(),
       'route-exit target has a real saved draft and no check')
    result = p.evaluate("""()=>{
      const check=document.querySelector('[data-fb-check]');
      const source=document.querySelector('[data-fb-helper="source"]');
      const hear=document.querySelector('[data-feeding-board-view] [data-speak]');
      const requests=feedingSpeechRequests.length;
      location.hash='#notes';
      const connected=check.isConnected;
      check.click();source.click();hear.click();
      const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;
      return {connected,owner:JSON.parse(localStorage.getItem('number-garden-v1:'+id)).feedingBoard,
              speechRequests:feedingSpeechRequests.length-requests,
              helperOpened:!!document.querySelector('#fb-helper-focus')};
    }""")
    ok(result['connected'], 'old native controls are still connected before hashchange render')
    ok(result['owner'] == before, 'same-block route exit blocks old Check and Source before rerender')
    ok(result['speechRequests'] == 0 and not result['helperOpened'], 'same-block route exit blocks old Hear and helper disclosure')
    p.locator('#download').wait_for()
    if p.locator('dialog.welcome-film[open] [data-film-skip]').count():
        click(p, 'dialog.welcome-film[open] [data-film-skip]')
    ok(owner(p) == before, 'Feeding Board remains exact after actual Notes render')
    actual = book(p)
    q = setup(browser, 820, 1180, seed, 'route-exit-normalizer-baseline')
    go(q, base)
    select_case(q, 'cow')
    q.evaluate("()=>{location.hash='#notes';}")
    q.locator('#download').wait_for()
    if q.locator('dialog.welcome-film[open] [data-film-skip]').count():
        click(q, 'dialog.welcome-film[open] [data-film-skip]')
    ok(actual == book(q), 'complete notebook matches actual Notes baseline, including legacy normalization')
    snap(p, 'immediate-route-exit-notes')

def main():
    fixtures = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {feedingFixtures} from './test/feeding-board-checks.mjs';console.log(JSON.stringify(feedingFixtures()));"], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('FEEDING_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *args):
                pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size = 128
            daemon_threads = True
        server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    base = base.rstrip('/') + '/'
    sizes = [(w, h) for w, h in [(320, 568), (820, 1180), (1024, 768)] if not os.environ.get('FEEDING_WIDTHS') or str(w) in os.environ['FEEDING_WIDTHS'].split(',')]
    with sync_playwright() as pw:
        launch = {'headless': True, 'args': ['--disable-quic']}
        if os.environ.get('CHROME_PATH'):
            launch['executable_path'] = os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**launch)
        try:
            route_exit(browser, base, fixtures['partial'])
            if os.environ.get('FEEDING_FOCUS') == 'route-exit':
                ok(not errors, 'no route-exit page errors')
                ok(not faults, 'no route-exit browser faults')
                (OUT / 'receipt.json').write_text(json.dumps({'status': 'passed', 'checks': checks, 'base': base, 'scope': 'immediate native route exit before rerender and actual Notes normalization baseline', 'pageErrors': errors, 'faults': faults}, indent=2))
                print(f'Feeding route-exit browser: {checks} assertions passed; artifacts {OUT}')
                return
            for width, height in sizes:
                p = setup(browser, width, height, fixtures['base'], f'board-{width}')
                go(p, base)
                before = book(p)
                ok('feedingBoard' not in before, 'entry never creates source or evidence')
                ok(not p.locator('dialog.welcome-film[open]').count(), 'entry has no welcome film')
                p.get_by_role('button', name='Start a board', exact=True).focus()
                p.keyboard.press('Enter')
                ok(owner(p)['sorts'] == [] and owner(p)['draft']['sorts'] == [], 'native Start creates empty editable board')
                ok(p.locator('#fb-focus').evaluate('x=>document.activeElement===x'), 'Start focuses case heading')
                ok({k: v for k, v in book(p).items() if k != 'feedingBoard'} == before, 'Start creates only optional owner, no legacy living/story roots')
                ok(not p.locator('.fb-stage input:checked').count(), 'unchecked first animal has no selected basket')
                ok(p.get_by_role('button', name='Check this basket', exact=True).is_disabled(), 'blank Check disabled')
                stage_bounds(p, width > 320)
                snap(p, f'initial-{width}')
                choose(p, 'carnivore')
                ok(owner(p)['sorts'] == [], 'radio only persists an ungraded arrangement')
                ok('Trying here' in p.locator(VIEW).inner_text(), 'preview identified as unchecked')
                ok(p.locator('.fb-stage input[data-fb-choice=carnivore]').evaluate('x=>document.activeElement===x'), 'preview preserves native radio focus')
                p.keyboard.press('ArrowRight')
                ok(owner(p)['draft']['sorts'][0]['basketId'] == 'omnivore', 'native radio arrow keys move saved draft')
                choose(p, 'carnivore')
                button(p, 'Check this basket')
                ok(p.locator('#fb-feedback').evaluate('x=>document.activeElement===x'), 'Check focuses feedback heading')
                first = copy.deepcopy(entry(p, 'sorts', 'rabbit')['first'])
                ok(first['outcome'] == 'other' and not first['afterFeedback'], 'explicit first wrong choice retained honestly')
                button(p, 'Check this basket')
                ok(entry(p, 'sorts', 'rabbit')['checkCount'] == 1, 'identical explicit Check is a no-op')
                button(p, 'Try the idea')
                ok(owner(p)['teaching'], 'opening worked teaching records context')
                ok(p.locator('#fb-helper-focus').evaluate('x=>document.activeElement===x'), 'helper opening focuses its heading')
                snap(p, f'teaching-{width}')
                click(p, '[data-fb-close]')
                ok(p.locator('[data-fb-helper=teaching]').evaluate('x=>document.activeElement===x'), 'helper close returns focus to trigger')
                ok(owner(p)['draft']['sorts'][0]['basketId'] == 'carnivore', 'teaching returns exact waiting draft')
                button(p, 'Check this basket')
                ok(entry(p, 'sorts', 'rabbit')['checkCount'] == 2 and entry(p, 'sorts', 'rabbit')['latest']['teachingBefore'], 'teaching-only explicit retry')
                button(p, 'Check this basket')
                ok(entry(p, 'sorts', 'rabbit')['checkCount'] == 2, 'unchanged teaching retry is a no-op')
                choose(p, 'herbivore')
                ok(entry(p, 'sorts', 'rabbit')['latest']['basketId'] == 'carnivore', 'draft never rewrites checked placement')
                button(p, 'Check this basket')
                ok(entry(p, 'sorts', 'rabbit')['first'] == first and entry(p, 'sorts', 'rabbit')['latest']['outcome'] == 'fits', 'revision keeps immutable first and actual latest')
                # Every actual authored animal/food rendering is retained for independent visual review.
                animals = owner(p)['source']['animals']
                for animal in animals:
                    select_case(p, animal['id'])
                    text = p.locator('.fb-stage').inner_text()
                    ok(animal['name'] in text and animal['usualDiet'] in text and all(x['label'] in text for x in animal['foods']), 'literal frozen animal and visible named foods: ' + animal['id'])
                    ok(p.locator('.fb-stage svg').count() >= 1 + len(animal['foods']), 'original animal and food pictures: ' + animal['id'])
                    snap(p, f'art-{width}-{animal["id"]}')
                    if width == 820:
                        p.locator('.fb-stage .fb-evidence').first.screenshot(path=str(OUT / f'art-evidence-820-{animal["id"]}.png'))
                select_case(p, 'cow')
                choose(p, 'omnivore')
                draft = copy.deepcopy(owner(p)['draft'])
                button(p, 'Another example')
                snap(p, f'example-{width}')
                click(p, '[data-fb-close]')
                ok(owner(p)['draft'] == draft and p.locator('.fb-stage input[data-fb-choice=omnivore]').is_checked(), 'worked example returns exact case and draft')
                button(p, 'Source')
                ok(owner(p)['support'][-1]['source'], 'Source records local note exposure')
                snap(p, f'source-{width}')
                click(p, '[data-fb-close]')
                requests = p.evaluate('feedingSpeechRequests.length')
                click(p, VIEW + ' [data-speak]')
                ok(p.evaluate('feedingSpeechRequests.length') == requests + 1, 'manual Hear reaches actual native speech request seam')
                ok(next(x for x in owner(p)['support'] if x['caseId'] == 'cow')['narration'], 'Hear records requested, no audibility inference')
                select_case(p, 'elephant')
                choose(p, 'carnivore')
                select_case(p, 'cow')
                stale(p, lambda: button(p, 'Next animal'))
                stale(p, lambda: button(p, 'Looks and food'))
                for case in owner(p)['source']['contrasts']:
                    select_case(p, case['id'])
                    chosen = next(x for x in case['options'] if x['outcome'] == 'fits')
                    choose(p, chosen['id'])
                    button(p, 'Check this idea')
                    ok(entry(p, 'ideas', case['id'])['first']['outcome'] == 'fits', 'paired evidence comparison: ' + case['id'])
                    snap(p, f'contrast-{width}-{case["id"]}')
                button(p, 'Animal baskets')
                # Two persistent explorers, each with actual saved work.
                first_id, first_root = active(p), copy.deepcopy(owner(p))
                stale(p, lambda: (click(p, '#explorer-switch'), click(p, '#explorer-new'), click(p, '#explorer-create')))
                second_id = active(p)
                ok(second_id != first_id and 'feedingBoard' not in book(p), 'new explorer has no invented source/evidence')
                button(p, 'Start a board')
                choose(p, 'omnivore')
                second_root = copy.deepcopy(owner(p))
                click(p, '#explorer-switch')
                click(p, f'[data-select-explorer="{first_id}"]')
                ok(owner(p) == first_root, 'original explorer restored exactly')
                go(p, base)
                ok(owner(p) == first_root, 'real page reload retains draft/source/first/latest')
                exported = download(p, base, f'notes-{width}')
                ok(exported['feedingBoard'] == first_root and len(exported['syntheticOther']['payload']) == 512000, 'actual download includes owner and500KiB unrelated sibling')
                go(p, base)
                stale(p, lambda: bring(p, base, exported))
                imported_id = active(p)
                ok(imported_id not in [first_id, second_id], 'import creates separate explorer')
                go(p, base)
                ok(owner(p) == first_root, 'import preserves exact owner')
                go(p, base)
                redownload = download(p, base, f'redownload-{width}')
                ok(redownload['feedingBoard'] == exported['feedingBoard'] and redownload['syntheticOther'] == exported['syntheticOther'], 'reload/redownload retains exact roots')
                click(p, '#explorer-switch')
                click(p, f'[data-select-explorer="{second_id}"]')
                go(p, base)
                ok(owner(p) == second_root, 'second persistent explorer retains its different partial draft')
                go(p, base, '#notes', '#reset')
                click(p, '#reset')
                click(p, '#confirm-reset')
                go(p, base)
                ok('feedingBoard' not in book(p), 'existing confirmed reset clears only current explorer owner')
                click(p, '#explorer-switch')
                click(p, f'[data-select-explorer="{first_id}"]')
                go(p, base)
                ok(owner(p) == first_root, 'other explorer unaffected by reset')
            # Bounded fault/historical journeys run once; main paths retain normal browser APIs.
            p = setup(browser, 820, 1180, fixtures['refusal'], 'report-refusal')
            go(p, base)
            select_case(p, 'cow')
            before = copy.deepcopy(book(p))
            requests = p.evaluate('feedingSpeechRequests.length')
            button(p, 'Source')
            ok(book(p) == before, 'actual pretty-report refusal preserves complete notebook')
            ok(not p.locator('#fb-helper-focus').count(), 'refused first Source discloses no helper')
            click(p, VIEW + ' [data-speak]')
            ok(p.evaluate('feedingSpeechRequests.length') == requests, 'refused Hear never reaches actual speech request')
            ok(book(p) == before, 'refused Hear records no request/support')
            ok(p.locator('#fb-status').inner_text().strip(), 'refusal is announced')
            snap(p, 'report-refusal')
            p = setup(browser, 820, 1180, fixtures['historical'], 'historical')
            go(p, base)
            select_case(p, 'rabbit')
            ok(not p.locator('.fb-stage input:checked').count(), 'historical checked animal without draft has no fabricated choice')
            ok('Earlier check' in p.locator(VIEW).inner_text(), 'checked position remains visible without draft')
            rabbit = p.locator('[data-fb-case="rabbit"]').inner_text()
            ok('Not checked yet' not in rabbit, 'historical checked animal waiting rail never claims unchecked')
            click(p, '[data-fb-helper="bridge"]')
            text = p.locator('#fb-helper-focus').locator('..').inner_text()
            ok('Earlier larval beetle' in text and 'Earlier retained food note.' in text, 'bridge carries literal historical card')
            ok('Adult seven-spot' not in text, 'ladybird ID does not manufacture adult species equivalence')
            snap(p, 'historical-bridge')
            p = setup(browser, 820, 1180, fixtures['damaged'], 'damage')
            go(p, base)
            before = copy.deepcopy(owner(p))
            select_case(p, 'cow')
            choose(p, 'herbivore')
            button(p, 'Check this basket')
            ok(owner(p)['sorts'][1] == before['sorts'][1], 'actual sibling edit retains malformed raw case')
            report = download(p, base, 'damage-notes')
            ok(report['feedingBoard']['sorts'][1] == before['sorts'][1], 'actual Notes download retains malformed case')
            bring(p, base, report)
            go(p, base)
            ok(owner(p) == report['feedingBoard'], 'actual import preserves malformed sibling exactly')
            # Storage errors preserve the current memory observation; download proves memory truth.
            p = setup(browser, 820, 1180, fixtures['partial'], 'storage-fault')
            go(p, base)
            select_case(p, 'cow')
            p.evaluate("()=>{window.originalFeedingSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Synthetic unavailable storage','QuotaExceededError');};}")
            choose(p, 'herbivore')
            button(p, 'Check this basket')
            ok('download' in p.locator('#fb-status').inner_text().lower() or 'not' in p.locator('#fb-status').inner_text().lower(), 'storage failure offers honest recovery status')
            report = download(p, base, 'storage-fault-notes')
            cow = next(x for x in report['feedingBoard']['sorts'] if x['caseId'] == 'cow')
            ok(cow['first']['basketId'] == 'herbivore', 'failed persistent save retains in-memory observation in actual download')
            p.evaluate('()=>{Storage.prototype.setItem=window.originalFeedingSet;}')
            # Saving off deliberately removes disk copies; use actual download to inspect memory.
            p = setup(browser, 820, 1180, fixtures['partial'], 'saving-off')
            go(p, base, '#notes', '#remember')
            p.locator('#remember').uncheck()
            p.goto(base + '#living/who-eats', wait_until='domcontentloaded')
            p.locator(VIEW).wait_for()
            select_case(p, 'cow')
            choose(p, 'herbivore')
            button(p, 'Check this basket')
            ok('temporary' in p.locator(VIEW).inner_text().lower() or 'off' in p.locator(VIEW).inner_text().lower(), 'saving-off work described as temporary')
            p.goto(base + '#notes', wait_until='domcontentloaded')
            with p.expect_download() as result:
                click(p, '#download')
            result.value.save_as(OUT / 'saving-off-notes.json')
            report = json.loads((OUT / 'saving-off-notes.json').read_text())
            ok(next(x for x in report['feedingBoard']['sorts'] if x['caseId'] == 'cow')['first']['basketId'] == 'herbivore', 'temporary-session observation is fully downloadable')
            ok(not errors, 'no page errors: ' + json.dumps(errors))
            ok(not faults, 'no console/request/HTTP faults: ' + json.dumps(faults))
            (OUT / 'receipt.json').write_text(json.dumps({'status': 'passed', 'checks': checks, 'base': base, 'viewports': sizes, 'pageErrors': errors, 'faults': faults, 'scope': 'actual native controls, frozen rendered art, persistent two-explorer transfer; speech requests only'}, indent=2))
            print(f'Feeding browser: {checks} assertions passed at{sizes}; artifacts {OUT}')
        except Exception:
            (OUT / 'failure.txt').write_text(traceback.format_exc())
            (OUT / 'faults.json').write_text(json.dumps({'errors': errors, 'faults': faults}, indent=2))
            for p, label in pages:
                if not p.is_closed():
                    try:
                        snap(p, label + '-failure')
                        (OUT / (label + '-failure.html')).write_text(p.content())
                    except Exception:
                        pass
            raise
        finally:
            for c in contexts:
                c.close()
            browser.close()
            if server:
                server.shutdown()
if __name__ == '__main__':
    main()
