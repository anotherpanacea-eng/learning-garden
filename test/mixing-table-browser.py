"""Spec287 real-app journeys. Synthetic notebooks only; no app interception.

MIXING_TEST_URL targets hosted builds. MIXING_ARTIFACTS retains original
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
OUT = Path(os.environ.get('MIXING_ARTIFACTS', tempfile.mkdtemp(prefix='mixing-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
checks, contexts, pages, errors, faults = 0, [], [], [], []
VIEW = '[data-mixing-table-view]'

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def active(p):
    return p.evaluate("()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")

def book(p):
    return p.evaluate("()=>{const i=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+i));}")

def owner(p):
    return book(p)['mixingTable']

def entry(p, section, case):
    return next((x for x in owner(p)[section] if x.get('caseId') == case), None)

def raw_report(s):
    return {k: v for k, v in s.items() if k not in ['title', 'exportedAt', 'note', 'explorer', 'recommendation']}

def setup(browser, width, height, seed, label):
    c = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True,
                            reduced_motion='reduce', accept_downloads=True)
    contexts.append(c)
    c.add_init_script('(seed=>{if(!localStorage.getItem("mixing-fixture")){' +
                      'localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(seed));' +
                      'localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:"explorer-1",explorers:[{id:"explorer-1",avatar:"sky",color:"blue",symbol:"leaf",createdAt:"2026-10-28T12:00:00.000Z"}]}));' +
                      'localStorage.setItem("mixing-fixture","1");}})(' + json.dumps(seed) + ')')
    c.add_init_script('window.mixingSpeechRequests=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{window.mixingSpeechRequests.push(u.text);return native(u);};}')
    p = c.new_page()
    pages.append((p, label))
    p.set_default_timeout(12000)
    p.on('pageerror', lambda e: errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda m: faults.append({'case': label, 'type': 'console', 'text': m.text}) if m.type == 'error' else None)
    p.on('response', lambda r: faults.append({'case': label, 'type': 'http', 'status': r.status, 'url': r.url}) if r.status >= 400 else None)
    p.on('requestfailed', lambda r: faults.append({'case': label, 'type': 'request', 'error': r.failure, 'url': r.url}) if 'ERR_ABORTED' not in (r.failure or '') else None)
    return p

def go(p, base, route='#studio/mixing', selector=VIEW):
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
    loc = p.locator(f'[data-mt-case="{case}"]')
    if not loc.is_visible():
        rail = p.locator(VIEW + ' details').filter(has=p.locator(f'[data-mt-case="{case}"]'))
        if rail.count() and not rail.get_attribute('open'):
            rail.locator('summary').click()
    loc.click()

def download(p, base, name):
    if p.locator(VIEW).count():
        p.locator(VIEW+' a[href="#notes"]').click()
        p.locator('#download').wait_for()
    else:
        go(p, base, '#notes', '#download')
    with p.expect_download() as d:
        click(p, '#download')
    path = OUT / (name + '.json')
    d.value.save_as(path)
    return json.loads(path.read_text())

def bring(p, base, report):
    go(p, base, '#notes', '#progress-file')
    p.locator('#progress-file').set_input_files({'name': 'synthetic-mixing-notebook.json', 'mimeType': 'application/json', 'buffer': json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for()
    ok('Mixing Table' in p.locator('.import-preview').inner_text(), 'actual import preview identifies optional root')
    click(p, '#progress-import-confirm')
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual confirmed import')

def counts(p):
    return {axis: int(p.locator(f'[data-mt-count="{axis}"]').inner_text()) for axis in ['a','b']}

def set_pot(p, a, b):
    for axis, target in [('a',a),('b',b)]:
        now=counts(p)[axis]
        for _ in range(abs(target-now)):
            click(p, f'[data-mt-adjust="{axis}"][data-delta="{1 if target>now else -1}"]')
    ok(counts(p)=={'a':a,'b':b}, 'native scoop controls reach actual counts')

def observation(p, case):
    return entry(p, 'observations', case)

def bounds(p, tablet):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad=p.locator(VIEW+' button,'+VIEW+' a,'+VIEW+' summary').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent,w:x.offsetWidth,h:x.offsetHeight,font:getComputedStyle(x).fontSize}))")
    ok(not bad, '44px targets and 16px text: '+str(bad))
    if tablet:
        p.evaluate('window.scrollTo(0,0)')
        for selector in ['.mt-sample','.mt-jars','.mt-pot','[data-mt-adjust="a"][data-delta="1"]','[data-mt-adjust="b"][data-delta="1"]','[data-mt-paint]','[data-mt-count="a"]','[data-mt-count="b"]']:
            r=p.locator(selector).bounding_box()
            ok(r and r['y']>=0 and r['y']+r['height']<=p.viewport_size['height']+1, 'initial tablet play control/count fits: '+selector+' '+str(r))

def old_callbacks(p, transition):
    p.evaluate("window.oldMixingControls=[document.querySelector('[data-mt-paint]'),document.querySelector('[data-mt-adjust]'),document.querySelector('[data-mt-helper=clue]'),document.querySelector('[data-mixing-table-view] [data-speak]')]")
    transition()
    before=book(p);speech=p.evaluate('mixingSpeechRequests.length')
    p.evaluate('oldMixingControls.forEach(x=>x?.click())')
    ok(book(p)==before, 'detached old controls cannot edit, paint or expose help after transition')
    ok(p.evaluate('mixingSpeechRequests.length')==speech,'detached Hear makes no speech request')

def same_block_exit(p, base):
    before=owner(p)
    result=p.evaluate("""()=>{const xs=[document.querySelector('[data-mt-paint]'),document.querySelector('[data-mt-adjust]'),document.querySelector('[data-mt-helper=clue]'),document.querySelector('[data-mixing-table-view] [data-speak]')];const requests=mixingSpeechRequests.length;location.hash='#notes';const connected=xs[0].isConnected;xs.forEach(x=>x?.click());const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return {connected,owner:JSON.parse(localStorage.getItem('number-garden-v1:'+id)).mixingTable,speech:mixingSpeechRequests.length-requests};}""")
    ok(result['connected'],'old controls still connected before same-block hash render')
    ok(result['owner']==before and result['speech']==0,'hash guard blocks old native edit/Paint/help/Hear before rerender')
    p.locator('#download').wait_for()
    ok(owner(p)==before,'actual Notes render keeps owner unchanged')
    go(p,base)

def main():
    fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {mixingFixtures} from './test/mixing-table-checks.mjs';console.log(JSON.stringify(mixingFixtures()));"],cwd=ROOT,text=True))
    server=None;base=os.environ.get('MIXING_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self,*args): pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    sizes=[(320,568),(820,1180),(1024,768)]
    goals={'guided-heron':(4,6),'more-heron':(6,9),'repair-sky':(4,6),'one-two':(3,6),'white-change':(2,2),'equal-green':(2,2),'orange-difference':(3,4),'one-group':(2,3)}
    with sync_playwright() as pw:
        launch={'headless':True,'args':['--disable-quic']}
        if os.environ.get('CHROME_PATH'): launch['executable_path']=os.environ['CHROME_PATH']
        browser=pw.chromium.launch(**launch)
        try:
            for width,height in sizes:
                p=setup(browser,width,height,fixtures['base'],f'mixing-{width}');go(p,base)
                before=book(p)
                ok('mixingTable' not in before,'entry freezes no source')
                ok(not p.locator('dialog.welcome-film[open]').count(),'no automatic entry film')
                p.get_by_role('button',name='Open the table',exact=True).focus();p.keyboard.press('Enter')
                ok(owner(p)['drafts']==[] and owner(p)['observations']==[],'native keyboard Open freezes only source')
                ok({k:v for k,v in book(p).items() if k!='mixingTable'}==before,'Open mutates only optional owner')
                bounds(p,width>320);snap(p,f'initial-{width}')
                # Eight fully reachable constructions, all native control edits.
                for case,target in goals.items():
                    select_case(p,case);set_pot(p,*target)
                    button(p,'Paint a stripe')
                    record=observation(p,case)
                    ok(record['first']['goal']=='fits','actual fitting Paint '+case)
                    ok(p.locator('[data-mt-stripe] svg').count()>0,'rendered stripe diagram '+case)
                    snap(p,f'art-{width}-{case}')
                    if case=='guided-heron':
                        report=download(p,base,f'guided-notes-{width}')
                        ok(not any(record['first']['supportBefore'].values()),'guided construction optional support remains false')
                        p.locator('.mt-notes > summary').click()
                        text=p.locator('.mt-notes').inner_text()
                        ok('Guided example shown with this invitation' in text and 'Supplied starting pot: 0 white and 6 blue' in text,'actual Notes derives source-guided and supplied context')
                        go(p,base)
                select_case(p,'repair-sky');stripe=copy.deepcopy(observation(p,'repair-sky'));set_pot(p,5,6)
                ok('Pot changed since this stripe' in p.locator(VIEW).inner_text(),'editing leaves labelled stale stripe')
                go(p,base);select_case(p,'repair-sky')
                ok(observation(p,'repair-sky')==stripe and counts(p)=={'a':5,'b':6},'reload retains separate stale stripe and draft')
                exact=copy.deepcopy(owner(p)['drafts'])
                for label,key in [('Try one group','teaching'),('Clue','clue'),('Another example','example'),('Show groups','groups'),('Show a table','table')]:
                    button(p,label)
                    if key in ['teaching','example']:
                        button(p,'Next step');button(p,'Next step')
                    snap(p,f'helper-{width}-{key}')
                    click(p,'[data-mt-close]')
                    ok(owner(p)['drafts']==exact,'help returns exact pot '+key)
                    ok(p.locator(f'[data-mt-helper="{key}"]').evaluate('x=>document.activeElement===x'),'helper close restores trigger focus '+key)
                requests=p.evaluate('mixingSpeechRequests.length');click(p,VIEW+' [data-speak]')
                ok(p.evaluate('mixingSpeechRequests.length')==requests+1,'Hear reaches native speech request seam only')
                ok('Pot changed since this stripe' in p.evaluate('mixingSpeechRequests.at(-1)'), 'Hear labels stale stripe literally')
                click(p,VIEW+' [data-speak]')
                ok(p.evaluate('mixingSpeechRequests.length')==requests+2,'second Hear remains usable after support capture')
                set_pot(p,6,6)
                button(p,'Clue');click(p,'[data-mt-close]')
                button(p,'Paint a stripe');count=observation(p,'repair-sky')['paintCount'];button(p,'Paint a stripe')
                ok(observation(p,'repair-sky')['paintCount']==count,'unchanged actual Paint is no-op')
                same_block_exit(p,base)
                select_case(p,'repair-sky')
                first_id,first_root=active(p),copy.deepcopy(owner(p))
                old_callbacks(p,lambda:(click(p,'#explorer-switch'),click(p,'#explorer-new'),click(p,'#explorer-create')))
                second_id=active(p);ok(second_id!=first_id and 'mixingTable' not in book(p),'second fictional explorer independent')
                button(p,'Open the table');select_case(p,'equal-green');set_pot(p,2,2);button(p,'Paint a stripe');second_root=copy.deepcopy(owner(p))
                click(p,'#explorer-switch');click(p,f'[data-select-explorer="{first_id}"]');go(p,base)
                ok(owner(p)==first_root,'first explorer exact restoration')
                exported=download(p,base,f'notes-{width}')
                ok(exported['mixingTable']==first_root and len(exported['syntheticOther']['payload'])>=500*1024,'actual notesReport downloads full owner and sibling')
                bring(p,base,exported);ok(active(p) not in [first_id,second_id],'import creates third explorer')
                go(p,base);ok(owner(p)==first_root,'import and reload retain source/drafts/first/latest')
                redownload=download(p,base,f'redownload-{width}')
                ok(redownload['mixingTable']==first_root and redownload['syntheticOther']==exported['syntheticOther'],'reload/redownload exact roots')
                click(p,'#explorer-switch');click(p,f'[data-select-explorer="{second_id}"]');go(p,base)
                ok(owner(p)==second_root,'second explorer keeps separate work')
                go(p,base,'#notes','#reset');click(p,'#reset');click(p,'#confirm-reset')
                # The existing global reset visits Home and may open its welcome film.
                film=p.locator('dialog.welcome-film[open] [data-film-skip]')
                if film.count():film.click()
                go(p,base)
                ok('mixingTable' not in book(p),'confirmed reset clears current table')
                if film.count():film.click()
                click(p,'#explorer-switch');click(p,f'[data-select-explorer="{first_id}"]');go(p,base)
                ok(owner(p)==first_root,'reset preserves other explorer')
            p=setup(browser,820,1180,fixtures['refusal'],'pretty-report-refusal');go(p,base)
            select_case(p,'guided-heron');before=book(p);requests=p.evaluate('mixingSpeechRequests.length')
            for selector in ['[data-mt-helper="clue"]',VIEW+' [data-speak]','[data-mt-adjust="a"][data-delta="1"]','[data-mt-paint]']:
                click(p,selector);ok(book(p)==before,'actual whole-pretty-notes preflight refuses before mutation/disclosure: '+selector)
            ok(p.evaluate('mixingSpeechRequests.length')==requests,'report-refused Hear requests no speech')
            ok(not p.locator('[data-mt-close]').count(),'report refusal opens no helper');snap(p,'report-refusal')
            for key in ['historical','unknown','damaged']:
                p=setup(browser,820,1180,fixtures[key],key);go(p,base);before=owner(p)
                if key!='damaged':
                    select_case(p,'repair-sky');ok(p.locator('[data-mt-paint]').count()==0 or p.locator('[data-mt-paint]').is_disabled(),'historical unsupported model read-only')
                else:
                    select_case(p,'one-two')
                    ok('There are no' not in p.locator('.mt-jars').inner_text(), 'unreadable draft never invents zero scoops')
                    select_case(p,'equal-green');set_pot(p,2,2);button(p,'Paint a stripe');ok(owner(p)['observations'][1]==before['observations'][1],'healthy case edit retains unreadable raw sibling')
                report=download(p,base,key+'-notes');ok(report['mixingTable']==owner(p),'actual download retains literal raw owner');snap(p,key+'-notes')
            p=setup(browser,820,1180,fixtures['partial'],'storage-fault');go(p,base);select_case(p,'equal-green')
            p.evaluate("()=>{window.originalMixingSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Synthetic storage failure','QuotaExceededError')};}")
            set_pot(p,2,2);button(p,'Paint a stripe')
            ok('could not be saved' in p.locator('#mt-status').inner_text(),'storage failure disclosed')
            report=download(p,base,'storage-fault-notes');ok(next(x for x in report['mixingTable']['observations'] if x['caseId']=='equal-green')['first']['goal']=='fits','storage-failed memory downloadable')
            p.evaluate('()=>{Storage.prototype.setItem=window.originalMixingSet;}')
            p=setup(browser,820,1180,fixtures['partial'],'save-off');go(p,base,'#notes','#remember');p.locator('#remember').uncheck()
            p.goto(base+'#studio/mixing',wait_until='domcontentloaded');p.locator(VIEW).wait_for();select_case(p,'equal-green');set_pot(p,2,2);button(p,'Paint a stripe')
            ok('Saving is off' in p.locator(VIEW).inner_text(),'save-off session disclosed')
            report=download(p,base,'save-off-notes');ok(next(x for x in report['mixingTable']['observations'] if x['caseId']=='equal-green')['first']['goal']=='fits','save-off memory downloadable')
            ok(not errors,'no page errors '+json.dumps(errors));ok(not faults,'no browser faults '+json.dumps(faults))
            receipt={'status':'passed','checks':checks,'base':base,'viewports':sizes,'pageErrors':errors,'faults':faults,'scope':'actual app native controls and downloads; synthetic fictional explorers; speech requests only; physical iPad unverified'}
            (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(f'Mixing browser: {checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for p,label in pages:
                if not p.is_closed():
                    try: snap(p,label+'-failure');(OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception: pass
            raise
        finally:
            for c in contexts:c.close()
            browser.close()
            if server:server.shutdown()
if __name__=='__main__':main()
