"""Synthetic283 native journeys and real persistent two-explorer Notes transfer.

No app-module interception/tracing or ordinary speech stubs. Optional fault-only
speech observer calls through to native speech and tests refusal, not audibility.
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
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('PAIRED_ARTIFACTS',tempfile.mkdtemp(prefix='paired-points-')))
OUT.mkdir(parents=True,exist_ok=True)
os.environ['RHYTHM_ARTIFACTS']=str(OUT)
spec=importlib.util.spec_from_file_location('native_notebook_helpers',ROOT/'test/rhythm-browser.py')
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
ROUTE='#learn/math/paired'

def setup(browser,width,seed,label):
    c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce',accept_downloads=True)
    h.contexts.append(c)
    c.add_init_script('(seed=>{if(!localStorage.getItem("paired-fixture")){const p={id:"explorer-1",avatar:"sky",color:"gold",symbol:"leaf",createdAt:"2026-10-28T12:00:00.000Z"};localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:p.id,explorers:[p]}));localStorage.setItem("number-garden-v1:"+p.id,JSON.stringify(seed));localStorage.setItem("paired-fixture","1");}})('+json.dumps(seed)+')')
    p=c.new_page();h.pages.append((p,label));p.set_default_timeout(12000)
    p.on('pageerror',lambda e:h.errors.append({'case':label,'error':str(e)}))
    p.on('console',lambda x:h.console_errors.append({'case':label,'text':x.text}) if x.type=='error' else None)
    def failed(r):
        e={'case':label,'url':r.url,'failure':r.failure}
        (h.navigation_aborts if 'ERR_ABORTED' in (r.failure or '') else h.request_failures).append(e)
    p.on('requestfailed',failed);p.on('response',lambda r:h.http_failures.append({'case':label,'url':r.url,'status':r.status}) if r.status>=400 else None)
    return c,p

def go(p,base):h.go(p,base,ROUTE,'[data-pp-root]')
def packet(p,identity):return next(x for x in h.book(p)['pairedPoints'] if isinstance(x,dict) and x.get('id')==identity)
def start(p,case):
    if p.locator('[data-pp-choose]:visible').count():h.click(p,'[data-pp-choose]')
    before=h.book(p);h.click(p,f'[data-pp-source="{case}"]');h.ok(h.book(p)==before,'source selection is read-only')
    h.click(p,'[data-pp-start]');return h.book(p)['pairedPoints'][-1]['id']
def reopen(p,identity):
    if p.locator('[data-pp-choose]:visible').count():h.click(p,'[data-pp-choose]')
    h.click(p,f'[data-pp-open="{identity}"]')
def place(p,x,y):
    p.locator('[data-pp-x]').select_option(str(x));p.locator('[data-pp-y]').select_option(str(y));h.click(p,'[data-pp-place]')
def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
    bad=p.locator('[data-pp-root] button,[data-pp-root] a,[data-pp-root] summary,[data-pp-root] select').evaluate_all('xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent.trim())')
    h.ok(not bad,'native44px targets/16px text '+str(bad))
    for box in p.locator('[data-pp-own-plot]:visible,[data-pp-pattern-plot]:visible').all():
        h.ok(box.bounding_box()['width']>=224,'plot is at least224CSSpx wide')
def snap(p,label):p.screenshot(path=str(OUT/(label+'.png')),full_page=True)
def reload(p):
    identity=h.active(p);p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():h.click(p,f'[data-select-explorer="{identity}"]')
    p.locator('[data-pp-root]').wait_for()
def kept(p):h.ok(not p.locator('[data-pp-place],[data-pp-undo],[data-pp-compare],[data-pp-keep],[data-pp-worked],[data-pp-patterns],[data-pp-hear],[data-pp-together]').count(),'kept chart exposes no mutation/support controls')
def download(p,base,label):
    h.go(p,base,'#notes','#download')
    h.ok('Paired points' in p.locator('main').inner_text(),'Notes names paired destination')
    with p.expect_download() as result:h.click(p,'#download')
    path=OUT/(label+'.json');result.value.save_as(path);return json.loads(path.read_text())
def memory_download(p,label):
    # Hash navigation preserves the actual in-memory notebook when disk is off/faulted.
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
    with p.expect_download() as result:h.click(p,'#download')
    path=OUT/(label+'.json');result.value.save_as(path);return json.loads(path.read_text())
def geometry(p,points,xmax=10,ymax=20):
    circles=p.locator('[data-pp-own-plot] .pp-own-point').evaluate_all('xs=>xs.map(x=>[+x.getAttribute("cx"),+x.getAttribute("cy")])')
    h.ok(len(circles)==len(points),'each record retains its own SVG marker, including overlaps')
    for actual,point in zip(circles,points):h.ok(abs(actual[0]-(72+384*point['x']/xmax))<.001 and abs(actual[1]-(320-296*point['y']/ymax))<.001,'actual SVG uses independent source-axis mapping')

def main():
    fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {pairedFixtures} from './test/paired-points-checks.mjs';console.log(JSON.stringify(pairedFixtures()));"],cwd=ROOT,text=True))
    server=None;base=os.environ.get('PAIRED_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self,*args):pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    with sync_playwright() as pw:
        chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
        browser=pw.chromium.launch(headless=True,executable_path=chrome,args=['--disable-quic'])
        try:
            for width in [320,820]:
                _,p=setup(browser,width,fixtures['base'],f'ordinary-{width}');go(p,base)
                before=h.book(p);h.ok('pairedPoints' not in before,'entry initializes no owner');h.ok(not p.locator('dialog.welcome-film[open]').count(),'exact route bypasses automatic film')
                for case in ['a','b','c']:
                    identity=start(p,case);source=copy.deepcopy(packet(p,identity)['source']);rows=next(x['rows'] for x in source['datasets'] if x['id']==case)
                    h.ok(p.locator('[data-pp-compare]').is_disabled() and p.locator('[data-pp-undo]').is_disabled(),'zero Compare/Back disabled')
                    h.ok(p.locator('[data-pp-place]').is_disabled(),'blank selects disable Place');p.locator('[data-pp-x]').select_option('1');h.ok(p.locator('[data-pp-place]').is_disabled(),'one value still disables Place')
                    h.ok(p.locator('[data-pp-x] option').count()==12 and p.locator('[data-pp-y] option').count()==22,'native blank plus every integer axis choice')
                    h.click(p,'[data-pp-worked]');h.ok(packet(p,identity)['support']['worked'],'example support saved before exposure')
                    for step in range(3):
                        h.ok(p.locator('[data-pp-example]').count()==1,'worked example separate from own plot')
                        label=p.locator('[data-pp-example] svg').get_attribute('aria-label');h.ok(['origin','across','point'][step] in label and ('2' in label if step else '0' in label),'worked accessible SVG names actual stage and coordinate')
                        h.ok(p.locator('[data-pp-worked-step="-1"]').is_disabled()==(step==0),'worked Back disabled only at first step')
                        if step<2:h.click(p,'[data-pp-worked-step="1"]')
                    h.ok(p.locator('[data-pp-worked-step="1"]').is_disabled(),'worked Next disabled at final step');h.click(p,'[data-pp-worked-close]')
                    h.ok(p.locator('[data-pp-worked]').evaluate('x=>document.activeElement===x'),'closing helper restores trigger focus')
                    h.click(p,'[data-pp-patterns]');h.ok(p.locator('[data-pp-pattern-plot]').count()==3,'three supplied patterns use shared source')
                    h.ok('Steeper does not mean stronger association' in p.locator('[data-pp-root]').inner_text(),'pattern contrasts remain explicit')
                    for case_id,values in [('a',[2,3,4,5,6,7,8,9]),('b',[3,5,7,9,11,13,15,17]),('c',[4,1,2,7,8,5,6,11])]:
                        coords=p.locator(f'[data-pp-pattern-plot][data-case="{case_id}"] .pp-source-point').evaluate_all('xs=>xs.map(x=>[+x.getAttribute("x")+12,+x.getAttribute("y")+12])')
                        h.ok(len(coords)==8,'each supplied pattern renders all eight records')
                        h.ok(all(abs(c[0]-(72+384*(i+1)/10))<.001 and abs(c[1]-(320-296*y/20))<.001 for i,(c,y) in enumerate(zip(coords,values))),'supplied pattern actual coordinates share authored axes')
                    bounds(p);h.click(p,'[data-pp-patterns-close]')
                    for i,r in enumerate(rows):
                        h.ok(f'Record {i+1}' in p.locator('#pp-row-heading').inner_text().replace('Record'+str(i+1),'Record '+str(i+1)),'each source card advances in order')
                        place(p,r['x'],r['y'] if i else 20)
                        if i==0:
                            description=p.locator('[data-pp-x]').evaluate('x=>(x.getAttribute("aria-describedby")||"").split(/\\s+/).map(id=>document.getElementById(id)?.textContent).join(" ")')
                            h.ok('2' in description and '1 of' in description,'live focus describes next source row and progress')
                            h.click(p,'[data-pp-compare]');check=copy.deepcopy(packet(p,identity)['checks'][0]);h.ok(check['matches']==[False] and not check['complete'],'intentional wrong placement recorded without correction')
                            geometry(p,[{'x':r['x'],'y':20}]);h.ok(p.locator('[data-pp-own-plot] .pp-source-point').count()==8,'overlay shows supplied pairs beside untouched own point')
                            h.click(p,'[data-pp-undo]');h.ok(not p.locator('[data-pp-own-plot] .pp-source-point').count(),'Back clears transient overlay');place(p,r['x'],r['y']);h.ok(packet(p,identity)['checks'][0]==check,'earlier check stays literal')
                    geometry(p,[{'x':r['x'],'y':r['y']} for r in rows]);h.ok(p.locator('[data-pp-own-table] tbody tr').count()==8,'ordered table retains all eight placed records');h.click(p,'[data-pp-compare]');h.ok(packet(p,identity)['checks'][-1]['matches']==[True]*8,'all eight actual native pairs compare')
                    h.click(p,'[data-pp-hear]');h.ok(packet(p,identity)['support']['narration'],'native Hear records request without claiming audibility');h.ok(p.locator('[data-pp-together]').get_attribute('aria-pressed') is None,'working together is a report action without toggle semantics');h.click(p,'[data-pp-together]');h.ok('reported' in p.locator('[data-pp-together]').inner_text().lower() and p.locator('[data-pp-together]').get_attribute('aria-pressed') is None,'reported together remains plain action');h.click(p,'[data-pp-keep]');kept(p);old=copy.deepcopy(packet(p,identity));h.click(p,'[data-pp-revise]');revision=h.book(p)['pairedPoints'][-1]['id'];h.click(p,'[data-pp-undo]');h.click(p,'[data-pp-keep]');kept(p)
                    h.ok(packet(p,identity)==old,'revision leaves entire old kept packet exact');h.click(p,'[data-pp-revise]');draft=h.book(p)['pairedPoints'][-1]['id'];h.ok(len(packet(p,draft)['placements'])==7,'unfinished kept chart revises as a separate draft')
                    bounds(p);snap(p,f'{case}-revision-{width}')
                waiting=h.book(p);reload(p);h.ok(p.locator('[data-pp-start]').count()==1,'reload opens chooser without automatic selection');reopen(p,draft);h.ok(h.book(p)==waiting,'reload and explicit Open preserve partial/kept/check work')
                original=h.active(p);h.click(p,'#explorer-switch');h.click(p,'#explorer-new');h.click(p,'#explorer-create');p.locator('[data-pp-root]').wait_for();h.ok(p.url.endswith(ROUTE) and 'pairedPoints' not in h.book(p),'new explorer stays on exact route without root initialization');h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{original}"]');p.locator('[data-pp-root]').wait_for();h.ok(h.book(p)==waiting,'explorer switch keeps all owner/sibling records exact')
                exported=download(p,base,f'paired-export-{width}');h.ok(h.raw_report(exported)==waiting and len(exported['syntheticOther']['payload'])>=512000,'actual export retains complete notebook and500KiB sibling')
                _,q=setup(browser,width,fixtures['partial'],f'transfer-{width}');go(q,base);original_id=h.active(q);original_book=h.book(q);h.go(q,base,'#notes','#progress-file');q.locator('#progress-file').set_input_files({'name':'synthetic-paired.json','mimeType':'application/json','buffer':json.dumps(exported).encode()});q.locator('#progress-import-confirm').wait_for();h.ok('Paired points' in q.locator('.import-preview').inner_text(),'real preview recognizes paired owner');h.click(q,'#progress-import-confirm');go(q,base);h.ok(h.active(q)!=original_id,'import creates separate explorer');reload(q);reopen(q,draft);again=download(q,base,f'paired-redownload-{width}');h.ok(again['pairedPoints']==exported['pairedPoints'] and again['syntheticOther']==exported['syntheticOther'],'persistent import/reload/redownload keeps multiple packets/checks/kept and large sibling');go(q,base);h.click(q,'#explorer-switch');h.click(q,f'[data-select-explorer="{original_id}"]');q.locator('[data-pp-root]').wait_for();h.ok(h.book(q)==original_book,'import does not overwrite original explorer')
                if width==820:
                    h.go(p,base,'#living/collection','a[href="#learn/math/paired"]')
                    h.ok('Count Collection' in p.locator('main').inner_text(),'actual adjacent Count Collection remains available')
                    h.ok(p.locator('a[href="#learn/math/paired"]').count()==1,'Count Collection has one optional paired invitation')
                    h.click(p,'a[href="#learn/math/paired"]');p.locator('[data-pp-root]').wait_for();h.ok(p.url.endswith(ROUTE),'actual collection invitation reaches exact route')
                    h.go(p,base,'#learn/math','[data-linear-root]');h.ok(p.locator('[data-linear-root] footer a[href="#learn/math/paired"]').count()==1,'advanced math footer has one paired invitation')
                    h.ok(p.locator('[data-linear-start]').count()>=6,'adjacent six open linear lessons remain present')
                _,old=setup(browser,width,fixtures['historical'],f'historical-{width}');go(old,base);reopen(old,fixtures['historicalId']);h.ok('Earlier <horizontal> units' in old.locator('[data-pp-root]').inner_text(),'historical labels escaped and literal');h.ok(old.locator('[data-pp-x] option').count()==6 and old.locator('[data-pp-y] option').count()==8,'historical smaller maxima govern controls')
                for x,y in [(0,0),(4,6),(4,6)]:place(old,x,y)
                geometry(old,[{'x':0,'y':0},{'x':4,'y':6},{'x':4,'y':6}],4,6);h.click(old,'[data-pp-patterns]');h.ok('Earlier supplied pattern stays literal.' in old.locator('[data-pp-root]').inner_text(),'historical helper uses own source text');h.click(old,'[data-pp-patterns-close]');bounds(old);snap(old,f'historical-{width}')
                _,bad=setup(browser,width,fixtures['malformedHelper'],f'bad-helper-{width}');go(bad,base);reopen(bad,fixtures['historicalId']);h.ok(not bad.locator('[data-pp-worked],[data-pp-patterns]').count(),'unreadable helper hidden independently');place(bad,0,0);h.ok(len(packet(bad,fixtures['historicalId'])['placements'])==1,'bad helper leaves plotting open')
                unsupported=copy.deepcopy(fixtures['base']);unsupported['pairedPoints']={'version':99,'raw':'Synthetic raw paired notes'};_,u=setup(browser,width,unsupported,f'unsupported-{width}');go(u,base);h.ok(h.book(u)['pairedPoints']==unsupported['pairedPoints'],'unsupported root retained');raw_export=download(u,base,f'unsupported-{width}');h.ok(raw_export['pairedPoints']==unsupported['pairedPoints'],'Notes is nonthrowing and downloads unsupported owner')
                cap=copy.deepcopy(fixtures['partial']);cap['pairedPoints'] += [None]*(24-len(cap['pairedPoints']));_,c=setup(browser,width,cap,f'cap-{width}');go(c,base);h.click(c,'[data-pp-source="a"]');h.ok(c.locator('[data-pp-source="a"]').get_attribute('aria-pressed')=='true','capacity test explicitly selects a source');h.ok(c.locator('[data-pp-start]').is_disabled() and 'all the charts it can hold' in c.locator('[data-pp-root]').inner_text(),'24raw packets block selected-source creation with capacity notice');reopen(c,fixtures['revisedId']);h.ok(c.locator('[data-pp-place]').count()==1,'existing healthy packet remains open at cap')
                check_cap=copy.deepcopy(fixtures['partial']);cp=next(x for x in check_cap['pairedPoints'] if isinstance(x,dict) and x.get('id')==fixtures['revisedId']);cp['checks']=[None]*8
                _,limited=setup(browser,width,check_cap,f'check-cap-{width}');go(limited,base);reopen(limited,fixtures['revisedId']);limited_before=h.book(limited)
                h.ok(limited.locator('[data-pp-compare]').is_disabled(),'eight raw comparisons disable ninth without losing sheet');h.ok(h.book(limited)==limited_before,'check cap never rewrites raw history')
                malformed=copy.deepcopy(fixtures['partial']);next(x for x in malformed['pairedPoints'] if isinstance(x,dict) and x.get('id')==fixtures['revisedId'])['checks']=None
                _,m=setup(browser,width,malformed,f'malformed-checks-{width}');go(m,base);reopen(m,fixtures['revisedId']);h.ok(m.locator('[data-pp-compare]').is_disabled(),'malformed earlier comparison list blocks only Check');place(m,2,3);h.ok(len(packet(m,fixtures['revisedId'])['placements'])==2,'malformed checks leave placement open')
                refusal_context,r=setup(browser,width,fixtures['refusal'],f'preflight-refusal-{width}')
                # Fault-only call-through observer: proves no speech attempt on refusal;
                # it neither replaces ordinary speech nor claims voice audibility.
                refusal_context.add_init_script('window.__ppFaultSpeech=[];const speak=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{window.__ppFaultSpeech.push(u.text);return speak(u)};')
                go(r,base);reopen(r,fixtures['refusalId']);safe=h.book(r);h.click(r,'[data-pp-worked]');h.ok(h.book(r)==safe and not r.locator('[data-pp-example]').count(),'actual pretty-report refusal exposes no example');h.ok('could not be kept safely' in r.locator('#pp-status').inner_text(),'preflight refusal gives recovery status');h.click(r,'[data-pp-patterns]');h.ok(h.book(r)==safe and not r.locator('[data-pp-pattern-plot]').count(),'refused pattern support exposes no supplied plots');speech_before=r.locator('.speech-controls').evaluate('x=>({hidden:x.hidden,status:x.querySelector("[data-speech-status]").textContent})');h.ok(speech_before['hidden'],'fault context speech controls initially hidden');h.click(r,'[data-pp-hear]');speech_after=r.locator('.speech-controls').evaluate('x=>({hidden:x.hidden,status:x.querySelector("[data-speech-status]").textContent})');h.ok(speech_after==speech_before and not packet(r,fixtures['refusalId'])['support']['narration'],'refused Hear stops before speech controls/status and support, independent of available voices');h.ok(h.book(r)==safe and r.evaluate('window.__ppFaultSpeech.length')==0,'fault-only native call-through observer sees no speech on refused first request')
                ticks=copy.deepcopy(fixtures['historical']);tick_source=next(x for x in ticks['pairedPoints'] if x.get('id')==fixtures['historicalId'])['source'];tick_source['axes']['x']['max']=11;tick_source['axes']['y']['max']=16
                _,t=setup(browser,width,ticks,f'historical-ticks-{width}');go(t,base);reopen(t,fixtures['historicalId'])
                boxes=t.locator('[data-pp-own-plot] .pp-ticks text').evaluate_all('xs=>xs.map(x=>({text:x.textContent,axis:x.getAttribute("y")=="362"?"x":"y",left:x.getBoundingClientRect().left,right:x.getBoundingClientRect().right,top:x.getBoundingClientRect().top,bottom:x.getBoundingClientRect().bottom}))')
                for axis in ['x','y']:
                    line=sorted([b for b in boxes if b['axis']==axis],key=lambda b:b['left'] if axis=='x' else b['top'])
                    h.ok(all((a['right']<=b['left']) if axis=='x' else (a['bottom']<=b['top']) for a,b in zip(line,line[1:])),f'historical{axis} max11/16 tick labels do not overlap')
                snap(t,f'historical-ticks-{width}')
                # Separate native Storage write-fault context; normal journeys keep real writes.
                _,quota=setup(browser,width,fixtures['base'],f'device-write-fault-{width}');go(quota,base);disk_before=h.book(quota)
                quota.evaluate('()=>{window.__ppNativeSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith("number-garden-v1:"))throw new DOMException("Synthetic device quota fault","QuotaExceededError");return window.__ppNativeSetItem.call(this,k,v)}}')
                h.click(quota,'[data-pp-source="a"]');h.click(quota,'[data-pp-start]');place(quota,1,2);h.click(quota,'[data-pp-keep]');kept(quota)
                h.ok(h.book(quota)==disk_before,'native write failure leaves persisted notebook exact');h.ok('in this session' in quota.locator('#pp-status').inner_text() and 'Chart kept.' not in quota.locator('#pp-status').inner_text(),'failed Keep reports session work without disk-success toast');h.ok(quota.locator('[data-save-warning]').is_visible(),'ordinary app storage warning remains visible');snap(quota,f'device-write-fault-{width}')
                quota_export=memory_download(quota,f'device-write-fault-{width}');qp=quota_export['pairedPoints'][-1];h.ok(qp['kept']['placements']==[{'x':1,'y':2}],'actual Notes download retains logically kept in-memory work after device failure')
                _,temporary=setup(browser,width,fixtures['base'],f'temporary-session-{width}');go(temporary,base);temporary.evaluate('location.hash="#notes"');temporary.locator('#remember').wait_for();temporary.locator('#remember').uncheck();h.ok('lasts only while this page stays open' in temporary.locator('[data-saving-status]').inner_text(),'actual Remember-off gives existing temporary-session notice')
                temporary.evaluate('location.hash="#learn/math/paired"');temporary.locator('[data-pp-root]').wait_for();h.click(temporary,'[data-pp-source="b"]');h.click(temporary,'[data-pp-start]');place(temporary,2,5);h.click(temporary,'[data-pp-keep]');kept(temporary);h.ok('could not be saved' not in temporary.locator('#pp-status').inner_text(),'saving-off is not reported as device failure');snap(temporary,f'temporary-session-{width}')
                temporary_export=memory_download(temporary,f'temporary-session-{width}');h.ok(temporary_export['pairedPoints'][-1]['kept']['placements']==[{'x':2,'y':5}],'actual download retains kept temporary-session work');h.ok('lasts only while this page stays open' in temporary.locator('[data-saving-status]').inner_text(),'existing temporary-session warning remains accurate after actions')
            h.ok(not h.errors,'no page errors '+json.dumps(h.errors));h.ok(not h.console_errors,'no console errors '+json.dumps(h.console_errors));h.ok(not h.request_failures,'no failed requests '+json.dumps(h.request_failures));h.ok(not h.http_failures,'no HTTP failures '+json.dumps(h.http_failures))
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'consoleErrors':h.console_errors,'requestFailures':h.request_failures,'httpFailures':h.http_failures,'scope':'320/820 native controls, actual persistent multi-packet two-explorer Notes transfer, historical axes and overlap; separate refusal-only native speech call-through observer; no app interception/tracing or ordinary speech substitutions'},indent=2));print(f'Paired points browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            (OUT/'browser-faults.json').write_text(json.dumps({'checks':h.checks,'pageErrors':h.errors,'consoleErrors':h.console_errors,'requestFailures':h.request_failures,'httpFailures':h.http_failures,'navigationAborts':h.navigation_aborts},indent=2))
            for p,label in h.pages:
                if not p.is_closed():
                    try:snap(p,label+'-failure');(OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception:pass
            raise
        finally:
            for c in h.contexts:
                try:c.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()
if __name__=='__main__':main()
