"""Native367 model exploration, rendered geometry and persistent Notes transfer.

One full tablet journey plus phone samples. Invented fixtures only; no app-module
interception, learner data or ordinary speech stubs. Separate storage faults are
explicitly labelled. This does not qualify Safari, audible speech or learning.
"""
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright
sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('ESTIMATES_ARTIFACTS', tempfile.mkdtemp(prefix='courier-estimates-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['RHYTHM_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('native_notebook_helpers', ROOT/'test/rhythm-browser.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
ROUTE = '#learn/math/estimates'


def setup(browser, seed, label, width=820):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True,
                            reduced_motion='reduce', accept_downloads=True)
    h.contexts.append(c)
    c.add_init_script('(seed=>{if(!localStorage.getItem("estimate-fixture")){' +
        'const p={id:"explorer-1",avatar:"sky",color:"gold",symbol:"leaf",createdAt:"2026-11-03T12:00:00.000Z"};' +
        'localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:p.id,explorers:[p]}));' +
        'localStorage.setItem("number-garden-v1:"+p.id,JSON.stringify(seed));' +
        'localStorage.setItem("estimate-fixture","1");}})(' + json.dumps(seed) + ')')
    p = c.new_page()
    h.pages.append((p, label))
    p.set_default_timeout(12000)
    p.on('pageerror', lambda e: h.errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda x: h.console_errors.append({'case': label, 'text': x.text}) if x.type == 'error' else None)
    p.on('requestfailed', lambda r: (h.navigation_aborts if 'ERR_ABORTED' in (r.failure or '') else h.request_failures).append({'case': label, 'url': r.url, 'failure': r.failure}))
    p.on('response', lambda r: h.http_failures.append({'case': label, 'url': r.url, 'status': r.status}) if r.status >= 400 else None)
    return c, p


def go(p, base):
    h.go(p, base, ROUTE, '[data-ce-root]')


def turn(p, page):
    h.click(p, f'[data-ce-page="{page}"]')


def start(p, source='orchard'):
    h.click(p, f'[data-ce-start="{source}"]')


def line(p, start_value, rate):
    turn(p, 1)
    p.locator('[data-ce-start-value]').select_option(str(start_value))
    p.locator('[data-ce-rate]').select_option(str(rate))


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator('[data-ce-root] button,[data-ce-root] a,[data-ce-root] summary,[data-ce-root] select').evaluate_all('xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight,font:getComputedStyle(x).fontSize}))')
    h.ok(not bad, '44px native controls and16px text: ' + str(bad))


def attr(p, selector, names):
    return p.locator(selector).evaluate('(e,names)=>names.map(n=>+e.getAttribute(n))', names)


def near(actual, expected, label):
    h.ok(len(actual) == len(expected) and all(abs(a-b) < .001 for a, b in zip(actual, expected)), label + ': ' + str(actual))


def xy(x, y, xmax=10, ymax=28):
    return [64+392*x/xmax, 292-268*y/ymax]


def saved(p, identity):
    return next(x for x in h.book(p)['courierEstimates'] if isinstance(x, dict) and x.get('id') == identity)


def download(p, base, label):
    p.evaluate('location.hash="#notes"')
    p.locator('#download').wait_for()
    with p.expect_download() as result:
        h.click(p, '#download')
    target = OUT/(label+'.json')
    result.value.save_as(target)
    return json.loads(target.read_text())


def reload(p):
    identity = h.active(p)
    p.reload(wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():
        h.click(p, f'[data-select-explorer="{identity}"]')
    p.locator('[data-ce-root]').wait_for()


def main():
    fixture_code = """
import {waitingNotebook} from './test/story-arrivals-checks.mjs';
import {estimateSource} from './dist/courier-estimates-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const base=waitingNotebook();base.syntheticOther.payload='x'.repeat(512000);
const old=estimateSource('orchard');old.id='earlier-source';old.title='Earlier <route> & rule';
old.context='A smaller synthetic source keeps its original values.';
old.axes={x:{label:'Earlier route blocks',max:1},y:{label:'Earlier minutes',max:3}};
old.rows=[{id:'old-zero',x:0,y:1},{id:'old-one',x:1,y:2}];old.starts=[1];old.rates=[1];old.requests=[0.5,1];delete old.worked;
const earlier={kind:'courier-estimate',v:1,id:'estimate-70',source:old,line:{start:1,rate:1},pin:null,recordId:'old-zero',requestX:0.5,result:{x:0.5,line:{start:1,rate:1},pin:null},support:{worked:true,gaps:false,rise:false,narration:false}};
const refusal=structuredClone(base);refusal.syntheticOther.payload='';
refusal.syntheticOther.payload='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(JSON.stringify(refusal,null,2))-1024);
console.log(JSON.stringify({base,earlier,refusal}));
"""
    fixtures = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', fixture_code], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('ESTIMATES_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            protocol_version = 'HTTP/1.1'
            def log_message(self, *args):
                pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size = 128
            daemon_threads = True
        server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    base = base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=os.environ.get('CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'), args=['--disable-quic'])
        try:
            _, p = setup(browser, fixtures['base'], 'tablet')
            go(p, base)
            before = h.book(p)
            h.ok('courierEstimates' not in before, 'entry does not initialize a saved owner')
            h.ok(not p.locator('dialog.welcome-film[open]').count(), 'direct learn route does not play the storm film')
            start(p)
            h.ok(h.book(p) == before, 'Start creates a session draft without writing the notebook')
            h.click(p, '[data-ce-worked]')
            h.ok(p.locator('[data-ce-example-plot]').count() == 1, 'different worked example owns a separate diagram')
            for _ in range(3):
                h.click(p, '[data-ce-step="1"]')
            h.ok(p.locator('[data-ce-step="1"]').is_disabled(), 'worked example stops at the last authored step')
            line(p, 1, 1.5)
            p.locator('[data-ce-change="start"][data-ce-delta="-1"]').focus()
            p.keyboard.press('Enter')
            h.ok(p.locator('[data-ce-start-value]').input_value() == '0' and p.locator('[data-ce-start-value]').evaluate('e=>e===document.activeElement'), 'keyboard decrement reaching the lower bound keeps focus on the start select')
            p.locator('[data-ce-change="rate"][data-ce-delta="1"]').focus()
            p.keyboard.press('Enter')
            h.ok(p.locator('[data-ce-rate]').input_value() == '2' and p.locator('[data-ce-rate]').evaluate('e=>e===document.activeElement'), 'keyboard increment reaching the upper bound keeps focus on the rate select')
            line(p, 4, 1)
            h.click(p, '[data-ce-record="r3"]')
            observation = attr(p, '[data-ce-observation="r3"]', ['cx', 'cy'])
            near(observation, xy(3, 6), 'record3 is independently mapped onto axis units')
            near(attr(p, '[data-ce-line]', ['x1', 'y1', 'x2', 'y2']), xy(0, 4)+xy(10, 14), 'candidate endpoints match rate1/start4')
            gap = attr(p, '[data-ce-gap]', ['x1', 'y1', 'x2', 'y2'])
            h.ok(abs(gap[0]-xy(3, 6)[0]) < .001 and abs(gap[2]-gap[0]) < .001, 'selected gap is vertical at its record x')
            near(sorted([gap[1], gap[3]]), sorted([xy(3, 6)[1], xy(3, 7)[1]]), 'gap endpoints join recorded6 to estimated7')
            h.ok('−1 minute' in p.locator('[data-ce-root]').inner_text(), 'recorded-minus-estimated sign and singular unit agree')
            h.click(p, '[data-ce-gaps]')
            h.click(p, '[data-ce-rise]')
            h.click(p, '[data-ce-pin]')
            bounds(p)
            turn(p, 2)
            h.click(p, '[data-ce-use]')
            h.ok('8.5 minutes' in p.locator('[data-ce-root]').inner_text(), 'inside estimate uses the current line')
            near(attr(p, '[data-ce-diamond="current"]', ['data-x', 'data-y']), [4.5, 8.5], 'current diamond represents used operands')
            h.ok(p.locator('[data-ce-diamond="pin"]').count() == 1, 'coincident pinned estimate remains separately identified')
            line(p, 5, 1)
            near(attr(p, '[data-ce-observation="r3"]', ['cx', 'cy']), observation, 'changing model leaves observed dot fixed')
            h.ok(not p.locator('[data-ce-diamond]').count(), 'changed line removes stale prediction diamonds')
            turn(p, 2)
            h.ok('8.5 minutes' in p.locator('[data-ce-root]').inner_text() and 'line has changed' in p.locator('[data-ce-root]').inner_text(), 'earlier used estimate remains labelled in text')
            h.click(p, '[data-ce-use]')
            near(attr(p, '[data-ce-diamond="current"]', ['data-x', 'data-y']), [4.5, 9.5], 'Use redraws from the changed line only when requested')
            h.click(p, '[data-ce-request="10"]')
            h.ok(not p.locator('[data-ce-diamond]').count(), 'changing request hides previous result markers')
            h.click(p, '[data-ce-request="4.5"]')
            h.ok(p.locator('[data-ce-diamond="current"]').count() == 1, 'returning to its request reveals matching earlier result')
            h.click(p, '[data-ce-request="10"]')
            h.click(p, '[data-ce-use]')
            h.ok('15 minutes' in p.locator('[data-ce-root]').inner_text() and 'less support' in p.locator('[data-ce-root]').inner_text(), 'outside estimate has its support limit')
            keep_button = p.locator('[data-ce-keep]').element_handle()
            h.click(p, '[data-ce-keep]')
            keep_button.evaluate('(e)=>e.click()')
            h.ok(len(h.book(p)['courierEstimates']) == 1, 'detached duplicate Keep cannot append a second item')
            h.ok(p.locator('[data-ce-kept]').count() == 1 and not p.locator('[data-ce-keep],[data-ce-start-value],[data-ce-rate]').count(), 'Keep moves to an immutable view')
            first = copy.deepcopy(saved(p, 'estimate-1'))
            h.ok(first['line'] == {'start': 5, 'rate': 1} and first['pin'] == {'start': 4, 'rate': 1}, 'kept current and pinned rules remain distinct')
            h.ok(first['support']['worked'] and first['support']['gaps'] and first['support']['rise'], 'opened support retained independently')
            h.ok({k:v for k,v in h.book(p).items() if k != 'courierEstimates'} == before, 'Keep changes only its owner')
            h.click(p, '[data-ce-again="estimate-1"]')
            line(p, 3, 0)
            near(attr(p, '[data-ce-line]', ['y1', 'y2']), [xy(0, 3)[1]]*2, 'zero rate draws a level line')
            h.click(p, '[data-ce-choose]')
            start(p, 'library')
            line(p, 5, 1)
            h.click(p, '[data-ce-record="r2"]')
            h.ok('−1 minute' in p.locator('[data-ce-root]').inner_text(), 'other records provide a different comparison')
            h.click(p, '[data-ce-keep]')
            h.click(p, '[data-ce-choose]')
            h.click(p, '[data-ce-open="estimate-1"]')
            h.click(p, '[data-ce-again="estimate-1"]')
            turn(p, 1)
            h.ok(p.locator('[data-ce-start-value]').input_value() == '3' and p.locator('[data-ce-rate]').input_value() == '0', 'Try again resumes its unkept slot without overwriting it')
            h.ok(saved(p, 'estimate-1') == first, 'new draft leaves the first kept item exact')
            stale = p.locator('[data-ce-keep]').element_handle()
            h.go(p, base, '#learn/math/paired', '[data-pp-root]')
            stale.evaluate('(e)=>e.click()')
            h.ok(len(h.book(p)['courierEstimates']) == 2, 'route-exited controls cannot keep a draft')
            h.ok(p.locator('a[href="'+ROUTE+'"]').count() == 1, 'Paired Points has a deliberate model invitation')
            h.click(p, 'a[href="'+ROUTE+'"]')
            p.locator('[data-ce-root]').wait_for()
            start(p)
            turn(p, 1)
            h.ok(p.locator('[data-ce-start-value]').input_value() == '2', 'leaving the exact route clears unkept work')
            reload(p)
            h.ok(p.locator('[data-ce-start="orchard"]').count() == 1, 'reload opens the chooser without creating a source')
            h.click(p, '[data-ce-open="estimate-1"]')
            h.ok(saved(p, 'estimate-1') == first, 'kept snapshot survives reload')
            p.screenshot(path=str(OUT/'tablet-kept.png'), full_page=True)
            exported = download(p, base, 'tablet-export')
            h.ok(len(exported['syntheticOther']['payload']) >= 512000 and exported['courierEstimates'][0] == first, 'actual export retains complete model and large sibling')

            # Actual import creates another explorer; unknown history remains raw.
            mixed = copy.deepcopy(exported)
            mixed['courierEstimates'] += [fixtures['earlier'], {'kind':'future', 'v':99, 'id':'estimate-90', 'raw':'Synthetic unreadable model'}]
            _, q = setup(browser, fixtures['base'], 'transfer')
            go(q, base)
            original_id, original_book = h.active(q), h.book(q)
            h.go(q, base, '#notes', '#progress-file')
            q.locator('#progress-file').set_input_files({'name':'synthetic-estimates.json', 'mimeType':'application/json', 'buffer':json.dumps(mixed).encode()})
            q.locator('#progress-import-confirm').wait_for()
            h.ok('Courier Estimates' in q.locator('.import-preview').inner_text(), 'real import preview names the new owner')
            h.click(q, '#progress-import-confirm')
            go(q, base)
            h.ok(h.active(q) != original_id, 'import preserves the original explorer in a separate notebook')
            reload(q)
            h.click(q, '[data-ce-open="estimate-70"]')
            h.ok('Earlier <route> & rule' in q.locator('[data-ce-root]').inner_text(), 'historical source title is literal escaped text')
            h.click(q, '[data-ce-again="estimate-70"]')
            turn(q, 1)
            h.ok(not q.locator('[data-ce-worked]').count(), 'missing historical helper does not become current example data')
            h.ok(q.locator('[data-ce-start-value] option').count() == 1 and q.locator('[data-ce-rate] option').count() == 1, 'historical finite controls stay source-owned')
            h.click(q, '[data-ce-rise]')
            h.ok('Across 1 model block' in q.locator('[data-ce-root]').inner_text() and 'zero-block record' in q.locator('[data-ce-root]').inner_text(), 'historical narrow guide and zero-record caveat are honest')
            near(attr(q, '[data-ce-observation="old-zero"]', ['cx', 'cy']), xy(0, 1, 1, 3), 'historical point uses its own axes')
            bounds(q)
            redownload = download(q, base, 'imported-redownload')
            h.ok(redownload['courierEstimates'] == mixed['courierEstimates'] and redownload['syntheticOther'] == mixed['syntheticOther'], 'import/reload/redownload preserves historical and unreadable siblings')
            go(q, base)
            h.click(q, '#explorer-switch')
            h.click(q, f'[data-select-explorer="{original_id}"]')
            q.locator('[data-ce-root]').wait_for()
            h.ok(h.book(q) == original_book, 'import and explorer switch leave the original notebook exact')

            # Representative phone pages, not a duplicate full journey.
            _, phone = setup(browser, fixtures['base'], 'phone', width=320)
            go(phone, base)
            start(phone)
            for page in [0, 1, 2]:
                turn(phone, page)
                bounds(phone)
            line(phone, 6, 2)
            near(attr(phone, '[data-ce-line]', ['x2', 'y2']), xy(10, 26), 'maximum line fits at the boundary')
            phone.screenshot(path=str(OUT/'phone-model.png'), full_page=True)

            # The real report boundary refuses a new Keep but leaves draft work.
            _, limited = setup(browser, fixtures['refusal'], 'report-capacity-fault')
            go(limited, base)
            start(limited)
            line(limited, 4, 1)
            limited_before = h.book(limited)
            h.click(limited, '[data-ce-keep]')
            h.ok(h.book(limited) == limited_before and limited.locator('[data-ce-start-value]').input_value() == '4', 'real report refusal retains notebook and local draft')
            h.ok('could not be kept' in limited.locator('#ce-status').inner_text(), 'preflight failure gives a useful recovery message')

            # Separate disk fault: normal journeys above use genuine persistence.
            _, quota = setup(browser, fixtures['base'], 'device-write-fault')
            go(quota, base)
            disk_before = h.book(quota)
            quota.evaluate('()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith("number-garden-v1:"))throw new DOMException("Synthetic quota fault","QuotaExceededError");return native.call(this,k,v)}}')
            start(quota)
            h.click(quota, '[data-ce-keep]')
            h.ok(h.book(quota) == disk_before, 'quota fault does not claim a persisted write')
            h.ok('in this session' in quota.locator('#ce-status').inner_text() and quota.locator('[data-save-warning]').is_visible(), 'device failure keeps in-memory work with the real warning')
            quota_export = download(quota, base, 'quota-memory-export')
            h.ok(len(quota_export['courierEstimates']) == 1, 'actual download recovers the kept in-memory model')

            _, temporary = setup(browser, fixtures['base'], 'saving-off')
            go(temporary, base)
            h.go(temporary, base, '#notes', '#remember')
            temporary.locator('#remember').uncheck()
            temporary.evaluate('location.hash="'+ROUTE+'"')
            temporary.locator('[data-ce-root]').wait_for()
            start(temporary)
            h.click(temporary, '[data-ce-keep]')
            h.ok('Saving on this device is off' in temporary.locator('#ce-status').inner_text(), 'saving-off is a temporary session rather than storage failure')
            temporary_export = download(temporary, base, 'temporary-export')
            h.ok(len(temporary_export['courierEstimates']) == 1, 'saving-off still permits explicit model Keep and download')

            h.go(p, base, '#learn/math', '[data-linear-root]')
            h.ok(p.locator('[data-linear-root] a[href="'+ROUTE+'"]').count() == 1, 'Linear lessons have the new optional invitation')
            h.ok(not h.errors, 'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors, 'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures, 'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed', 'checks':h.checks, 'base':base, 'pageErrors':h.errors, 'consoleErrors':h.console_errors, 'requestFailures':h.request_failures, 'httpFailures':h.http_failures, 'scope':'One820 native journey,320 page samples, independent SVG geometry, actual two-explorer Notes transfer; separate report-capacity/device-write/saving-off cases. No app interception or audible qualification.'}, indent=2))
            print(f'Courier Estimates browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for p, label in h.pages:
                if not p.is_closed():
                    try:
                        p.screenshot(path=str(OUT/(label+'-failure.png')), full_page=True)
                        (OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception:
                        pass
            raise
        finally:
            for context in h.contexts:
                try:
                    context.close()
                except Exception:
                    pass
            browser.close()
            if server:
                server.shutdown()


if __name__ == '__main__':
    main()
