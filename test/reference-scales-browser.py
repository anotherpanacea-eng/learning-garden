"""Native371: unchanged originals, explicit model views and real Notes transfer.

Invented notebooks only. One complete820 journey and320 samples. The ordinary
journey uses installed Chrome without module interception or speech stubs.
"""
import copy
import functools
import http.server
import importlib.util
import itertools
import json
import math
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('REFERENCE_SCALES_ARTIFACTS', tempfile.mkdtemp(prefix='reference-scales-', dir='/private/tmp')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['COMPARE_RECORDS_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('reference_native_helpers', ROOT/'test/compare-records-browser.py')
old = importlib.util.module_from_spec(spec)
spec.loader.exec_module(old)
native, h = old.native, old.h
go, turn, content, reload = old.go, old.turn, old.content, old.reload


def start(p):
    h.click(p, '[data-cr-start="reference-scales"]')


def originals(p):
    return p.locator('[data-rs-original]').evaluate_all('''xs=>xs.map(e=>({id:e.dataset.rsId,group:e.dataset.rsGroup,value:+e.dataset.rsValue,x:+e.getAttribute('cx'),y:+e.getAttribute('cy'),r:+e.getAttribute('r')}))''')


def geometry(p, groups, maximum, adjustment=None, adjustable='blue'):
    dots = originals(p)
    expected = {(g['id'],r['id']):r['value'] for g in groups for r in g['records']}
    h.ok(len(dots)==len(expected) and {(d['group'],d['id']):d['value'] for d in dots}==expected,
         'every source-owned original reading has its own solid circle')
    for d in dots:
        native.near([d['x']], [60+500*d['value']/maximum], 'original reading uses common numerical scale')
    h.ok(all(math.hypot(a['x']-b['x'],a['y']-b['y'])>=a['r']+b['r']+2 for a,b in itertools.combinations(dots,2)),
         'original markers are spatially distinct')
    previews=p.locator('[data-rs-preview]').evaluate_all('''xs=>xs.map(e=>({tag:e.tagName.toLowerCase(),value:+e.dataset.rsValue,x:e.getBBox().x+e.getBBox().width/2,y:e.getBBox().y+e.getBBox().height/2}))''')
    if adjustment is None:
        h.ok(not previews,'undisclosed preview has no marks')
    else:
        values=sorted(r['value']+adjustment for g in groups if g['id']==adjustable for r in g['records'])
        h.ok(sorted(d['value'] for d in previews)==values,'preview derives from actual adjustable group only')
        for d in previews:
            native.near([d['x']],[60+500*d['value']/maximum],'preview shares original horizontal scale')
        h.ok(all(d['tag']!='circle' and all(abs(d['y']-o['y'])>=16 for o in dots) for d in previews),
             'preview uses a different shape in a separate row, including zero adjustment')
    return dots


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    bad=p.locator('[data-cr-root] button,[data-cr-root] a,[data-cr-root] summary,[data-cr-root] select').evaluate_all('''xs=>xs.filter(e=>e.getClientRects().length&&(e.getBoundingClientRect().width<44||e.getBoundingClientRect().height<44||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>e.textContent.trim())''')
    h.ok(not bad,'visible44px controls with16px text: '+str(bad))
    bad=p.locator('[data-rs-plot] text').evaluate_all('''xs=>xs.filter(e=>e.getClientRects().length&&parseFloat(getComputedStyle(e).fontSize)*Math.min(Math.hypot(e.getScreenCTM().a,e.getScreenCTM().b),Math.hypot(e.getScreenCTM().c,e.getScreenCTM().d))<15.99).map(e=>e.textContent)''')
    h.ok(not bad,'effective plot text at least16CSSpx: '+str(bad))
    boxes=p.locator('[data-rs-plot] text').evaluate_all('''xs=>xs.map(e=>{const b=e.getBBox(),v=e.ownerSVGElement.viewBox.baseVal;return{x:b.x,y:b.y,w:b.width,h:b.height,vw:v.width,vh:v.height,text:e.textContent}})''')
    h.ok(all(b['x']>=-.01 and b['y']>=-.01 and b['x']+b['w']<=b['vw']+.01 and b['y']+b['h']<=b['vh']+.01 for b in boxes),'plot labels fit their viewBox')
    h.ok(all(a['x']+a['w']<=b['x']+.01 or b['x']+b['w']<=a['x']+.01 or a['y']+a['h']<=b['y']+.01 or b['y']+b['h']<=a['y']+.01 for a,b in itertools.combinations(boxes,2)), 'actual plot label boxes do not overlap')


def adjust(p, delta, count=1):
    for _ in range(count): h.click(p, f'[data-rs-adjust="{delta}"]')


def speech(p):
    h.click(p,'[data-cr-hear]')
    requested=p.locator('[data-cr-hear]').get_attribute('data-speak')
    h.ok(bool(requested),'actual Hear exposes current requested text')
    return requested


def main():
    code="""
import {waitingNotebook} from './test/story-arrivals-checks.mjs';
import {compareSource,validCompareWork} from './dist/compare-records-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startPostOffice} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
import {startAdaptiveRival,generateRivalTask} from './dist/post-rival.mjs';
const base=waitingNotebook();base.garden.welcomeFilmSeen=true;base.syntheticOther.payload='x'.repeat(512000);
const source=compareSource('reference-scales');if(!source)throw Error('Reference Scales source missing');
const own=structuredClone(source);own.id='historical-scales';own.title='Earlier <scales> & notes';own.axis={max:30,tick:5};
own.groups=[{id:'blue',label:'Earlier amber',records:[1,2,3].map((value,i)=>({id:'old-b'+i,value}))},{id:'copper',label:'Earlier violet',records:[0,2,4,9].map((value,i)=>({id:'old-c'+i,value}))}];
Object.assign(own.referenceScales,{reference:4,adjustment:{min:-1,max:4},check:{reference:8,groups:[{id:'copper',label:'Check violet',records:[1,3,7].map((value,i)=>({id:'old-cc'+i,value}))},{id:'blue',label:'Check amber',records:[4,6,8,10].map((value,i)=>({id:'old-cb'+i,value}))}]}});
own.referenceScales.glossary=[{term:'Earlier term',meaning:'Earlier frozen explanation.'}];own.opaque={raw:'Synthetic nested value'};
const work={kind:'record-comparison',v:1,id:'comparison-70',source:own,focus:'mean',aside:false,workingsShown:false,secondaryWorkingsSeen:false,workedSeen:0,narration:false,purpose:null,referenceView:{v:1,referenceShown:false,adjustmentShown:false,adjustment:0,checkShown:false,opaque:'Synthetic retained flag'}};
if(!validCompareWork(work))throw Error('Historical scale fixture invalid');
const pending=initializeExplorerState(freshState());pending.garden.welcomeFilmSeen=true;pending.syntheticOther={payload:'',raw:'Synthetic retained sibling'};const visit=startPostOffice(pending,deliveries[0].id);startAdaptiveRival(pending);visit.rival.task=generateRivalTask('multiply',2,3,0);pending.compareRecords=[work];
console.log(JSON.stringify({base,source,pending,work,maxImportBytes:MAX_IMPORT_BYTES}));
"""
    fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))
    server=None
    base=os.environ.get('REFERENCE_SCALES_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            protocol_version='HTTP/1.1'
            def log_message(self,*args): pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            _,p=native.setup(browser,fixtures['base'],'tablet')
            h.go(p,base,'#science/measure','[data-measure-root]')
            initial=h.book(p)
            h.ok(not p.locator('[data-reference-scale-return]').count(),'no kept artifact promise on an empty shelf')
            h.click(p,'[data-reference-scale-entry]')
            p.locator('[data-cr-start="reference-scales"]').wait_for()
            h.ok(h.book(p)==initial and not p.locator('[data-rs-plot]').count(),'real-jug invitation opens chooser lazily')
            start(p)
            source=fixtures['source']; groups=source['groups']
            dots=geometry(p,groups,150)
            h.ok(not p.locator('[data-rs-reference-line]').count(),'reference line requires explicit reveal')
            hidden=speech(p)
            h.ok(not re.search(r'(?<!\d)50\s*(?:g\b|grams)|\b61\s*[, ]+62',hidden),'initial narration excludes unopened check numbers')
            h.ok(speech(p)==hidden,'repeated requested narration excludes its own inserted voice controls')
            for focus in ['median','range','mean']:
                h.click(p,f'[data-cr-focus="{focus}"]')
                h.ok(originals(p)==dots,'summary highlight leaves originals fixed')
            h.click(p,'[data-rs-reference]')
            native.near(p.locator('[data-rs-reference-line]').evaluate('e=>[+e.getAttribute("x1"),+e.getAttribute("x2")]'),[60+500*100/150]*2,'reference marker uses stipulated100g')
            turn(p,1)
            h.click(p,'[data-rs-adjust-start]')
            geometry(p,groups,150,0)
            h.ok(originals(p)==dots,'opening separate zero preview never moves originals')
            adjust(p,'-1',12)
            geometry(p,groups,150,-12)
            h.ok(originals(p)==dots and '−12' in p.locator('[data-rs-adjustment]').inner_text(),'minus12 preview leaves originals unchanged')
            h.click(p,'[data-cr-workings]')
            h.ok(old.equation(p,300,3,100),'preview sums actual99,100,101 then divides by3')
            h.ok(p.evaluate('''()=>{const a=document.querySelector('.rs-model-controls').getBoundingClientRect(),b=document.querySelector('.rs-paper').getBoundingClientRect();return a.left>=b.right-1&&Math.abs(a.top-b.top)<40&&a.top<b.bottom;}'''),'tablet adjustment controls sit alongside the original/preview plot')
            p.locator('.rs-model-grid').scroll_into_view_if_needed()
            p.screenshot(path=str(OUT/'tablet-adjustment.png'),full_page=True)
            bounds(p)
            turn(p,2)
            h.ok(not p.locator('[data-rs-check-original]').count() and not re.search(r'61\s*[, ]+62',content(p)),'check invitation does not prematurely reveal its readings')
            h.click(p,'[data-rs-check]')
            geometry(p,source['referenceScales']['check']['groups'],150,-12)
            h.ok(old.equation(p,150,3,50),'new check retains minus12 with49,50,51 mean50')
            native.near(p.locator('[data-rs-reference-line]').evaluate('e=>[+e.getAttribute("x1")]'),[60+500*50/150],'check marker uses its own50g reference')
            adjust(p,'reset')
            adjust(p,'1',20)
            h.ok(p.locator('[data-rs-adjust="1"]').is_disabled(),'positive adjustment stops at inclusive upper bound')
            h.ok(p.evaluate('document.activeElement.getClientRects().length>0&&!document.activeElement.disabled'),'endpoint leaves focus on a usable visible control')
            geometry(p,source['referenceScales']['check']['groups'],150,20)
            turn(p,0)
            h.ok(originals(p)==dots,'returning parcel after check restores exactly the same originals')
            glossary_before=h.book(p)
            h.click(p,'[data-rs-glossary] summary')
            h.ok('Precision' in content(p) and h.book(p)==glossary_before,'manual glossary opens without an evidence write')
            turn(p,2)
            stale=p.locator('[data-cr-keep]').element_handle()
            h.click(p,'[data-cr-keep]'); stale.evaluate('e=>e.click()')
            first=copy.deepcopy(h.book(p)['compareRecords'][0])
            h.ok(len(h.book(p)['compareRecords'])==1 and first['referenceView']=={'v':1,'referenceShown':True,'adjustmentShown':True,'adjustment':20,'checkShown':True},'wrong positive adjustment may be kept once without grading')
            h.ok(not p.locator('[data-rs-adjust],[data-rs-reference],[data-rs-check]').count(),'kept numeric panels offer no new disclosures')
            p.screenshot(path=str(OUT/'tablet-kept.png'),full_page=True)
            h.click(p,'[data-cr-again="comparison-1"]')
            turn(p,1)
            adjust(p,'-1')
            h.ok(h.book(p)['compareRecords'][0]==first and '19' in p.locator('[data-rs-adjustment]').inner_text(),'Try again retains flags and adjustment; edit never replaces kept original')
            route_stale=p.locator('[data-rs-adjust="-1"]').element_handle()
            h.go(p,base,'#science/measure','[data-measure-root]')
            route_stale.evaluate('e=>e.click()')
            h.ok(h.book(p)['compareRecords']==[first] and 'measurementNotes' not in h.book(p),'model return and stale adjustment never write real-jug readings')
            h.ok('Comparison 1' in p.locator('[data-reference-scale-return]').locator('..').inner_text(),'later jug visit names the kept artifact')
            exported=native.download(p,base,'tablet-export')
            h.ok(exported['compareRecords']==[first] and len(exported['syntheticOther']['payload'])>=512000,'actual Notes export retains full frozen source and500KB sibling')

            # The imported notebook has changed labels/order/counts, two same
            # titles and an unreadable sibling occupying a stable raw index.
            earlier=copy.deepcopy(fixtures['work']); earlier['source']['title']=first['source']['title']
            malformed=copy.deepcopy(earlier); malformed['id']='comparison-71'; malformed['source']['model']='reference-scales-v99'
            later=copy.deepcopy(earlier); later['id']='comparison-72'
            mixed=copy.deepcopy(exported); mixed['compareRecords']=[earlier,malformed,later]
            _,q=native.setup(browser,fixtures['base'],'transfer')
            go(q,base); old_owner=h.active(q); old_book=h.book(q)
            import_stale=q.locator('[data-cr-start="reference-scales"]').element_handle()
            h.go(q,base,'#notes','#progress-file')
            q.locator('#progress-file').set_input_files({'name':'synthetic-scales.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
            q.locator('#progress-import-confirm').wait_for(); h.click(q,'#progress-import-confirm')
            go(q,base); import_stale.evaluate('e=>e.click()')
            h.ok(h.active(q)!=old_owner and q.locator('[data-cr-start="reference-scales"]').count()==1,'stale imported-owner Start cannot attach to replacement notebook')
            reload(q)
            h.ok(q.locator('[data-cr-open="comparison-70"]').count()==1 and q.locator('[data-cr-open="comparison-72"]').count()==1 and not q.locator('[data-cr-open="comparison-71"]').count(),'future reserved mode stays isolated while both same-title entries remain readable')
            h.click(q,'[data-cr-open="comparison-70"]')
            geometry(q,earlier['source']['groups'],30)
            turn(q,2)
            h.ok(not q.locator('[data-rs-check]').count() and not q.locator('[data-rs-reference-line]').count(),'kept unopened check and reference cannot disclose new numbers')
            h.click(q,'[data-cr-again="comparison-70"]')
            turn(q,0); h.click(q,'[data-rs-reference]'); turn(q,1); h.click(q,'[data-rs-adjust-start]')
            geometry(q,earlier['source']['groups'],30,0)
            adjust(q,'1',4)
            h.ok(q.locator('[data-rs-adjust="1"]').is_disabled(),'historical positive bound uses frozen+4 rather than today’s+20')
            adjust(q,'-1',5)
            h.ok(q.locator('[data-rs-adjust="-1"]').is_disabled(),'historical negative bound uses frozen−1 rather than today’s−20')
            geometry(q,earlier['source']['groups'],30,-1)
            adjust(q,'reset')
            h.click(q,'[data-rs-glossary] summary')
            h.ok('Earlier frozen explanation.' in content(q) and 'How closely repeated readings agree' not in content(q),'historical glossary comes from the frozen source')
            turn(q,2); h.click(q,'[data-rs-check]')
            geometry(q,earlier['source']['referenceScales']['check']['groups'],30,0)
            h.ok('Check violet' in content(q) and 'Check amber' in content(q),'historical reversed groups and changed counts retain own labels')
            native.near(q.locator('[data-rs-reference-line]').evaluate('e=>[+e.getAttribute("x1")]'),[60+500*8/30],'historical check uses frozen8g reference')
            h.go(q,base,'#science/measure','[data-measure-root]')
            h.ok('Comparison 3 · '+first['source']['title'] in q.locator('[data-reference-scale-return]').locator('..').inner_text(),'later return uses last readable raw index despite identical titles and malformed sibling')
            redownload=native.download(q,base,'imported-redownload')
            h.ok(redownload['compareRecords']==mixed['compareRecords'] and redownload['syntheticOther']==mixed['syntheticOther'],'real import/reload/redownload preserves every raw source and unrelated sibling exactly')
            go(q,base); owner_stale=q.locator('[data-cr-start="reference-scales"]').element_handle()
            h.click(q,'#explorer-switch'); h.click(q,f'[data-select-explorer="{old_owner}"]')
            q.locator('[data-cr-root]').wait_for(); owner_stale.evaluate('e=>e.click()')
            h.ok(h.book(q)==old_book and q.locator('[data-cr-start="reference-scales"]').count()==1,'owner switch preserves original notebook and rejects detached source control')

            _,phone=native.setup(browser,fixtures['base'],'phone',width=320)
            go(phone,base); start(phone); phone_dots=geometry(phone,groups,150)
            bounds(phone); h.click(phone,'[data-rs-reference]'); turn(phone,1); h.click(phone,'[data-rs-adjust-start]')
            adjust(phone,'-1'); geometry(phone,groups,150,-1)
            h.ok(originals(phone)==phone_dots,'phone minus1 preview retains original coordinates')
            h.ok(phone.evaluate('document.activeElement.getClientRects().length>0'),'phone parameter control keeps visible focus')
            bounds(phone)
            phone.evaluate('''()=>window.scrollTo(0,scrollY+document.querySelector('[data-rs-plot]').getBoundingClientRect().top-300)''')
            phone.evaluate('''()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))''')
            h.ok(phone.evaluate('''()=>{const controls=[...document.querySelectorAll('[data-rs-adjust]')].map(e=>e.getBoundingClientRect()),plot=document.querySelector('[data-rs-plot]').getBoundingClientRect();return controls.length===3&&controls.every(b=>b.top>=0&&b.bottom<=innerHeight)&&plot.bottom>Math.max(...controls.map(b=>b.bottom))+80&&plot.top<innerHeight-80;}'''),'phone adjustment buttons stay visible while inspecting the scrolled plot')
            phone.screenshot(path=str(OUT/'phone-plot-viewport.png'))
            phone.screenshot(path=str(OUT/'phone-preview.png'),full_page=True)

            # Historical supplied arithmetic qualifies waiting work, never recall.
            _,pending=native.setup(browser,fixtures['pending'],'historical-given')
            go(pending,base); h.click(pending,'[data-cr-open="comparison-70"]'); h.click(pending,'[data-cr-again="comparison-70"]')
            h.ok('2x3' not in h.book(pending)['broad']['seenFacts'],'unopened historical mean/median supplies no fact')
            h.click(pending,'[data-cr-workings]')
            h.ok(old.equation(pending,6,3,2) and '(2 + 4) ÷ 2 = 3' in content(pending),'actual historical mean3×2 and even median2×3 are visible')
            state=h.book(pending)
            h.ok('2x3' in state['broad']['seenFacts'] and state['postOffice']['visits'][0]['rival'].get('priorFactShown') is True and state['postOffice']['visits'][0]['rival']['attempts']==[],'given arithmetic qualifies waiting2×3 without a recall response')
            task_stale=pending.locator('[data-cr-workings]').element_handle()
            speech(pending)
            speech_stale=pending.locator('[data-cr-hear]').element_handle()
            h.click(pending,'[data-cr-choose]'); start(pending); task_stale.evaluate('e=>e.click()')
            h.ok(not pending.locator('.cr-workings').count() and not old.equation(pending,6,3,2),'detached prior-task workings control cannot alter new source')
            speech_stale.evaluate('e=>e.click()')
            h.ok(not pending.locator('[data-cr-hear]').get_attribute('data-speak'),'detached prior-task Hear cannot narrate the new source')

            # Real report size refusal is separate from ordinary browsing.
            _,report_page=native.setup(browser,fixtures['pending'],'capacity-report')
            go(report_page,base); report=native.download(report_page,base,'before-capacity')
            raw=report_page.evaluate('''({report,cap})=>{report.syntheticOther.payload='';const n=new TextEncoder().encode(JSON.stringify(report,null,2)).length;report.syntheticOther.payload='x'.repeat(cap-n);return JSON.stringify(report,null,2)}''',{'report':report,'cap':fixtures['maxImportBytes']})
            h.ok(len(raw.encode())==fixtures['maxImportBytes'],'synthetic real Notes report reaches actual pretty-byte cap')
            full_seed=h.raw_report(json.loads(raw))
            _,full=native.setup(browser,full_seed,'capacity-refusal')
            go(full,base); h.click(full,'[data-cr-open="comparison-70"]'); h.click(full,'[data-cr-again="comparison-70"]')
            full_before=h.book(full); full_dots=originals(full)
            h.click(full,'[data-cr-workings]')
            h.ok('could not open' in full.locator('#cr-status').inner_text(),'real report preflight refuses growth before supplied arithmetic appears')
            h.ok(h.book(full)==full_before and originals(full)==full_dots and not old.equation(full,6,3,2),'refusal restores entire notebook, flags and visible original geometry')
            h.ok(not re.search(r'6\s+divided by\s+3\s*=\s*2',speech(full)),'requested narration excludes refused formula')
            h.click(full,'[data-cr-keep]')
            h.ok(h.book(full)==full_before and 'could not be kept' in full.locator('#cr-status').inner_text(),'real Keep refusal preserves draft and all notebook roots')

            cap_seed=copy.deepcopy(fixtures['base']); cap_seed['compareRecords']=[{**copy.deepcopy(fixtures['work']),'id':f'comparison-{i+1}'} for i in range(24)]
            _,cap=native.setup(browser,cap_seed,'owner-cap'); go(cap,base); start(cap); cap_before=h.book(cap)
            h.click(cap,'[data-cr-keep]')
            h.ok(h.book(cap)==cap_before,'24-entry append refusal never evicts a prior comparison')
            _,quota=native.setup(browser,fixtures['base'],'device-quota'); go(quota,base); disk=h.book(quota)
            quota.evaluate('''()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Synthetic quota','QuotaExceededError');return original.call(this,k,v)}}''')
            start(quota); h.click(quota,'[data-cr-keep]')
            h.ok(h.book(quota)==disk and 'in this session' in quota.locator('#cr-status').inner_text(),'explicit quota fault preserves disk and reports memory-only work')
            h.ok(len(native.download(quota,base,'quota-memory')['compareRecords'])==1,'real Notes download recovers memory-only scale comparison')
            _,temporary=native.setup(browser,fixtures['base'],'saving-off'); h.go(temporary,base,'#notes','#remember'); temporary.locator('#remember').uncheck()
            temporary.evaluate('location.hash="#learn/math/compare-records"')
            temporary.locator('[data-cr-root]').wait_for(); start(temporary); h.click(temporary,'[data-cr-keep]')
            h.ok('Saving on this device is off' in temporary.locator('#cr-status').inner_text(),'saving-off message remains distinct from quota')
            h.ok(len(native.download(temporary,base,'temporary-memory')['compareRecords'])==1,'explicit saving-off Notes download retains frozen scale source')
            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'consoleErrors':h.console_errors,'scope':'One820 journey,320 samples; actual native controls, frozen historical source, two-owner real Notes transfer, supplied-fact qualification and real report capacity. Separate quota fault. No speech stubs or app-module interception.'},indent=2))
            print(f'Reference Scales browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for page,label in h.pages:
                if not page.is_closed():
                    try:
                        page.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True)
                        (OUT/(label+'-failure.html')).write_text(page.content())
                    except Exception: pass
            raise
        finally:
            for context in h.contexts:
                try: context.close()
                except Exception: pass
            browser.close()
            if server: server.shutdown()


if __name__=='__main__':
    main()
