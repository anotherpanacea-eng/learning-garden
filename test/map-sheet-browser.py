"""Native368: one tablet journey, phone samples and real Notes transfers.

Synthetic notebooks only. No app interception or speech stubs. SVG assertions
read actual drawing coordinates; storage faults are separate explicit cases.
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

# Imported native helpers must never leave repository bytecode artifacts.
sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('MAP_SHEET_ARTIFACTS', tempfile.mkdtemp(prefix='map-sheet-', dir='/private/tmp')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
os.environ['RHYTHM_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('map_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h
ROUTE = '#learn/math/map-sheet'


def go(p, base):
    h.go(p, base, ROUTE, '[data-ms-root]')


def turn(p, page):
    h.click(p, f'[data-ms-page="{page}"]')


def start(p, name='wide'):
    h.click(p, f'[data-ms-start="{name}"]')


def key(p, value):
    h.click(p, f'[data-ms-key="{value}"]')


def reload(p):
    identity = h.active(p)
    p.reload(wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():
        h.click(p, f'[data-select-explorer="{identity}"]')
    p.locator('[data-ms-root]').wait_for()


def text(p):
    return p.locator('[data-ms-root]').inner_text()


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator('[data-ms-root] button,[data-ms-root] a,[data-ms-root] summary').evaluate_all('''xs=>xs.filter(x=>x.getClientRects().length&&
        (x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16))
        .map(x=>({text:x.textContent.trim(),width:x.getBoundingClientRect().width,height:x.getBoundingClientRect().height,font:getComputedStyle(x).fontSize}))''')
    h.ok(not bad, '44px controls and16px text: '+str(bad))
    bad_svg = p.locator('[data-ms-root] svg text').evaluate_all('''xs=>xs.filter(x=>x.getClientRects().length&&
        parseFloat(getComputedStyle(x).fontSize)*Math.min(Math.hypot(x.getScreenCTM().a,x.getScreenCTM().b),Math.hypot(x.getScreenCTM().c,x.getScreenCTM().d))<15.99)
        .map(x=>x.textContent)''')
    h.ok(not bad_svg, 'SVG text remains effectively16CSSpx: '+str(bad_svg))


def fit(p, ground, scale, width, alternate):
    viewport = max(30, width, alternate)
    native.near(native.attr(p, '[data-ms-paper]', ['x','width']), [40,420*width/viewport], 'paper uses declared shared pitch')
    native.near(native.attr(p, '[data-ms-route]', ['x1','y1','x2','y2']), [40,110,40+420*min(ground/scale,width)/viewport,110], 'actual SVG route is proportional and clips only at paper edge')
    h.ok(bool(p.locator('[data-ms-overflow]').count()) == (ground>scale*width), 'continuation exists exactly for overflowing route')
    if ground>scale*width:
        labels = p.locator('[data-ms-paper]').evaluate('''e=>[...e.ownerSVGElement.querySelectorAll('text')].map(t=>({text:t.textContent,x:+t.getAttribute('x')}))''')
        h.ok(not any(x['text'].strip() == 'Bend' and abs(x['x']-(40+420*width/viewport))<1 for x in labels), 'destination does not masquerade as clipped endpoint')


def detail(p, scale=20, inset=5, features=(('narrows',24),('ford',15)), window=6):
    boxes = p.locator('[data-ms-overview-window],[data-ms-inset-window]')
    h.ok(boxes.count()==2, 'overview and inset both rendered')
    h.ok(boxes.evaluate_all('xs=>xs.map(x=>x.getAttribute("viewBox"))') == [f'0 0 500 {80*len(features)+80}']*2, 'equal detail viewBoxes')
    for i,(identity,meters) in enumerate(features):
        overview = native.attr(p, f'[data-ms-overview-window] [data-ms-feature="{identity}"]', ['x','y','width','height'])
        closer = native.attr(p, f'[data-ms-inset-window] [data-ms-feature="{identity}"]', ['x','y','width','height'])
        native.near([overview[0],overview[1]+overview[3]/2,overview[2]], [40,60+80*i,420*min(meters/scale,window)/window], 'overview feature drawn from frozen meters')
        native.near([closer[0],closer[1]+closer[3]/2,closer[2]], [40,60+80*i,420*min(meters/inset,window)/window], 'inset feature uses same paper pitch')
        if meters/scale<=window and meters/inset<=window:
            h.ok(abs(closer[2]/overview[2]-scale/inset)<.001, 'actual bar ratio equals key ratio')


def saved(p, identity='map-sheet-1'):
    return next(x for x in h.book(p)['mapSheets'] if isinstance(x,dict) and x.get('id')==identity)


def main():
    fixture_code = """
import {mapSheetSource} from './dist/map-sheet-core.mjs';
import {mapFixtures} from './test/map-sheet-checks.mjs';
import {waitingNotebook} from './test/story-arrivals-checks.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startPostOffice} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
import {startAdaptiveRival,generateRivalTask,validPostRival} from './dist/post-rival.mjs';
const base=waitingNotebook();base.syntheticOther.payload='x'.repeat(512000);
function pending(a,b){const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;const d=startPostOffice(s,deliveries[0].id);if(!startAdaptiveRival(s))throw Error('pending start');d.rival.task=generateRivalTask('multiply',a,b,0);if(!validPostRival(d.rival))throw Error('pending validation');return s;}
console.log(JSON.stringify({base,pending:pending(3,5),pendingReadback:pending(7,11),maxImportBytes:MAX_IMPORT_BYTES,source:mapSheetSource('wide'),fixtures:mapFixtures()}));
"""
    fixtures = json.loads(subprocess.check_output(['node','--input-type=module','-e',fixture_code],cwd=ROOT,text=True))
    server=None
    base=os.environ.get('MAP_SHEET_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            protocol_version='HTTP/1.1'
            def log_message(self,*args):
                pass
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
            go(p,base)
            before=h.book(p)
            h.ok('mapSheets' not in before,'direct entry creates no optional owner')
            h.ok(not p.locator('dialog.welcome-film[open]').count(),'exact learn route has no automatic film')
            start(p)
            h.ok(p.evaluate('document.activeElement.matches("[data-ms-root] h2,[data-ms-root] h3")'),'Start focuses the active heading')
            turn(p,0)
            key(p,10)
            fit(p,600,10,30,12)
            h.ok('60 centimeters' in text(p) and 'continues' in text(p),'overflow is described explicitly')
            key(p,50)
            fit(p,600,50,30,12)
            h.ok('18 centimeters' in text(p),'wide fitting route names spare width')
            key(p,20)
            fit(p,600,20,30,12)
            h.ok('filling the usable width' in text(p),'equal paper width counts as fit')
            h.click(p,'[data-ms-worked]')
            h.ok('400-meter path' in text(p),'manual worked example opens its first line')
            h.click(p,'[data-ms-step="1"]')
            h.ok('400 ÷ 20 = 20' in text(p),'manual Next reveals the second line')
            h.click(p,'[data-ms-step="1"]')
            h.ok('leaving 5 centimeters' in text(p),'manual Next reveals final helper step')
            h.click(p,'[data-ms-worked]')
            bounds(p)
            turn(p,1)
            h.click(p,'[data-ms-inset]')
            detail(p)
            h.ok('4 × overview drawn length' in text(p),'fourfold inset ratio disclosed')
            bounds(p)
            turn(p,2)
            h.click(p,'[data-ms-source-fold]')
            h.ok('150' not in text(p),'readback answer absent even from opened child source')
            h.click(p,'[data-ms-hear]')
            spoken=p.locator('[data-ms-hear]').get_attribute('data-speak')
            h.ok(bool(spoken) and '7.5' in spoken and '150' not in spoken,'actual requested readback narration hides ground answer')
            h.click(p,'[data-ms-hear]')
            h.ok(p.locator('[data-ms-hear]').get_attribute('data-speak')==spoken,'repeated Hear excludes the inserted voice controls')
            h.click(p,'[data-ms-readback]')
            h.ok('7.5 × 20 = 150 meters' in text(p),'Show reveals exact150m calculation')
            h.click(p,'[data-ms-hear]')
            bounds(p)
            handle=p.locator('[data-ms-keep]').element_handle()
            h.click(p,'[data-ms-keep]')
            handle.evaluate('(e)=>e.click()')
            h.ok(len(h.book(p)['mapSheets'])==1,'detached duplicate Keep appends only once')
            first=copy.deepcopy(saved(p))
            h.ok(p.locator('[data-ms-kept]').count()==1 and not p.locator('[data-ms-keep],[data-ms-key],[data-ms-inset],[data-ms-resize]').count(),'kept view is immutable')
            turn(p,0)
            h.ok(not p.locator('#ms-teaching').count(),'Keep closes Earlier teaching fold')
            h.click(p,'[data-ms-worked]')
            h.ok(p.locator('#ms-teaching').count()==1 and p.locator('.ms-teaching li').count()==3,'kept helper shows exactly saved three-line prefix')
            h.click(p,'[data-ms-choose]')
            h.click(p,'[data-ms-open="map-sheet-1"]')
            h.ok(not p.locator('#ms-teaching').count(),'explicit Open closes earlier teaching again')
            h.click(p,'[data-ms-again="map-sheet-1"]')
            turn(p,2)
            h.click(p,'[data-ms-resize]')
            turn(p,0)
            fit(p,600,20,12,30)
            h.ok('only 12' in text(p),'same key carried to smaller paper now overflows')
            key(p,50)
            fit(p,600,50,12,30)
            turn(p,2)
            h.click(p,'[data-ms-resize]')
            turn(p,0)
            fit(p,600,20,30,12)
            turn(p,2)
            h.click(p,'[data-ms-resize]')
            h.ok('earlier draft is still here' in text(p),'alternating resize resumes earlier choices')
            turn(p,0)
            fit(p,600,50,12,30)
            h.ok(saved(p)==first,'retry and resizing preserve complete kept snapshot')
            stale=p.locator('[data-ms-keep]').element_handle()
            h.go(p,base,'#learn/math/paired','[data-pp-root]')
            stale.evaluate('(e)=>e.click()')
            h.ok(len(h.book(p)['mapSheets'])==1,'route-exited Keep cannot append')
            go(p,base)
            start(p)
            fit(p,600,20,30,12)
            reload(p)
            h.ok(p.locator('[data-ms-start="wide"]').count()==1,'reload discards unkept visit slots')
            h.click(p,'[data-ms-open="map-sheet-1"]')
            h.ok(saved(p)==first,'saved source remains exact after reload')
            p.screenshot(path=str(OUT/'tablet-kept.png'),full_page=True)
            exported=native.download(p,base,'tablet-export')
            h.ok(exported['mapSheets'][0]==first and len(exported['syntheticOther']['payload'])>=512000,'real Notes export retains large sibling and map')

            mixed=copy.deepcopy(exported)
            historical=copy.deepcopy(first)
            historical['id']='map-sheet-70'
            source=historical['source']
            source.update({'id':'earlier-source','title':'Earlier <map> & paper','sheetWidthCm':40,'otherWidthCm':18,'keys':[7,11],'insetKey':7})
            source['route']['lengthM']=700
            source['readback']['groundM']=77
            historical['key']=7
            historical['readbackShown']=False
            historical['workedSeen']=2
            farther=copy.deepcopy(historical)
            farther['id']='map-sheet-71'
            farther['source']['insetKey']=11
            source['worked']={'steps':['Synthetic unavailable helper'],'factsByStep':'unreadable'}
            mixed['mapSheets'] += [historical,farther,{'kind':'future','v':99,'id':'map-sheet-90','raw':'Synthetic unreadable map'}]
            _,q=native.setup(browser,fixtures['base'],'transfer')
            go(q,base)
            original_id,original_book=h.active(q),h.book(q)
            import_stale=q.locator('[data-ms-start="wide"]').element_handle()
            h.go(q,base,'#notes','#progress-file')
            q.locator('#progress-file').set_input_files({'name':'synthetic-map-sheets.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
            q.locator('#progress-import-confirm').wait_for()
            h.ok('A Map That Fits' in q.locator('.import-preview').inner_text(),'real import preview names map owner')
            h.click(q,'#progress-import-confirm')
            go(q,base)
            import_stale.evaluate('(e)=>e.click()')
            h.ok(q.locator('[data-ms-start="wide"]').count()==1,'detached pre-import Start cannot open a draft in replacement notebook')
            h.ok(h.active(q)!=original_id,'import creates separate explorer')
            reload(q)
            h.ok('Earlier <map> & paper' in text(q),'historical chooser labels render literally')
            h.click(q,'[data-ms-open="map-sheet-70"]')
            h.click(q,'[data-ms-again="map-sheet-70"]')
            turn(q,0)
            fit(q,700,7,40,18)
            h.ok(not q.locator('[data-ms-worked]').count(),'invalid historical helper does not block main map')
            turn(q,1)
            if q.locator('[data-ms-inset-window]').count()==0:
                h.click(q,'[data-ms-inset]')
            detail(q,7,7)
            h.ok('same scale' in text(q),'equal historical keys say same scale')
            turn(q,2)
            h.click(q,'[data-ms-resize]')
            turn(q,0)
            fit(q,700,7,18,40)
            h.click(q,'[data-ms-source-fold]')
            h.ok('Earlier source wording' in text(q),'resized historical source retains own provenance')
            h.click(q,'[data-ms-choose]')
            h.click(q,'[data-ms-open="map-sheet-71"]')
            h.click(q,'[data-ms-again="map-sheet-71"]')
            turn(q,1)
            if q.locator('[data-ms-inset-window]').count()==0:
                h.click(q,'[data-ms-inset]')
            detail(q,7,11)
            h.ok('farther scale' in text(q) and '7/11' in text(q),'farther inset uses its exact historical ratio')
            redownload=native.download(q,base,'imported-redownload')
            h.ok(redownload['mapSheets']==mixed['mapSheets'] and redownload['syntheticOther']==mixed['syntheticOther'],'actual import/reload/redownload preserves historical and unreadable roots')
            go(q,base)
            owner_stale=q.locator('[data-ms-start="wide"]').element_handle()
            h.click(q,'#explorer-switch')
            h.click(q,f'[data-select-explorer="{original_id}"]')
            q.locator('[data-ms-root]').wait_for()
            owner_stale.evaluate('(e)=>e.click()')
            h.ok(h.book(q)==original_book and q.locator('[data-ms-start="wide"]').count()==1,'owner switch preserves original and rejects detached old-owner Start')

            _,phone=native.setup(browser,fixtures['base'],'phone',width=320)
            go(phone,base)
            start(phone,'small')
            for page in [0,1,2]:
                turn(phone,page)
                h.ok(phone.evaluate('document.activeElement.matches("[data-ms-root] h2,[data-ms-root] h3")'),'turn focuses heading on phone')
                if page==1:
                    h.click(phone,'[data-ms-inset]')
                    detail(phone)
                    phone.screenshot(path=str(OUT/'phone-detail.png'),full_page=True)
                bounds(phone)
            phone.screenshot(path=str(OUT/'phone-readback.png'),full_page=True)

            # Actual shared-helper exposure: waiting3x5 is untouched until inset.
            _,pending=native.setup(browser,fixtures['pending'],'pending-inset')
            go(pending,base)
            start(pending)
            turn(pending,1)
            pending_before=h.book(pending)
            h.ok('3x5' not in pending_before['broad']['seenFacts'] and not pending_before['postOffice']['visits'][0]['rival'].get('priorFactShown'),'overview does not invent3x5 exposure')
            h.click(pending,'[data-ms-inset]')
            pending_after=h.book(pending)
            h.ok('3x5' in pending_after['broad']['seenFacts'] and pending_after['postOffice']['visits'][0]['rival'].get('priorFactShown') is True,'shown Ford15/5 qualifies actual waiting3x5')
            expected=copy.deepcopy(pending_before)
            expected['postOffice']['visits'][0]['rival']['priorFactShown']=True
            h.ok(native.without_fact_lists(pending_after)==native.without_fact_lists(expected),'inset exposure preserves every nonfact root and no answers/attempts are added')

            # A historical readback uses its own operands, only after Show.
            readback_seed=copy.deepcopy(fixtures['pendingReadback'])
            readback_seed['mapSheets']=[historical]
            _,readback=native.setup(browser,readback_seed,'pending-historical-readback')
            go(readback,base)
            h.click(readback,'[data-ms-open="map-sheet-70"]')
            h.click(readback,'[data-ms-again="map-sheet-70"]')
            turn(readback,2)
            h.ok('7x11' not in h.book(readback)['broad']['seenFacts'] and '77' not in text(readback),'historical ground answer and7x11 remain hidden before Show')
            h.click(readback,'[data-ms-readback]')
            h.ok('11 × 7 = 77 meters' in text(readback),'historical Show derives its actual77m answer')
            h.ok('7x11' in h.book(readback)['broad']['seenFacts'] and h.book(readback)['postOffice']['visits'][0]['rival'].get('priorFactShown') is True,'historical Show qualifies the actual waiting7x11')

            # Directly seed an actual exported report at its real pretty-report
            # cap. Import keeps a second recovery copy and may hit Chrome quota.
            _,full_source=native.setup(browser,fixtures['base'],'capacity-source')
            go(full_source,base)
            report=native.download(full_source,base,'before-display-capacity')
            full_raw=full_source.evaluate('''({report,cap})=>{
                const facts=[];for(let a=1;a<=12;a++)for(let b=a;b<=12;b++)if(!(a===3&&b===5))facts.push(`${a}x${b}`);
                report.exposures=[...new Set(facts.flatMap(k=>{const [a,b]=k.split('x');return [k,`${b}x${a}`]}))];
                report.broad.seenFacts=facts;report.broad.seenItems=facts.map(k=>`legacy-${k}`);
                report.broad.seenVariants=facts.map(k=>`legacy-${k}:authored`);
                report.syntheticOther.payload='';
                const size=new TextEncoder().encode(JSON.stringify(report,null,2)).length;
                report.syntheticOther.payload='x'.repeat(cap-size);
                return JSON.stringify(report,null,2);
            }''',{'report':report,'cap':fixtures['maxImportBytes']})
            h.ok(len(full_raw.encode())==fixtures['maxImportBytes'],'synthetic exported report reaches actual byte boundary')
            full_seed=json.loads(full_raw)
            for name in ['title','exportedAt','note','explorer','recommendation']:
                full_seed.pop(name,None)
            _,full=native.setup(browser,full_seed,'display-capacity')
            go(full,base)
            start(full)
            turn(full,1)
            full_before=h.book(full)
            old_svg=full.locator('[data-ms-overview-window]').inner_html()
            h.click(full,'[data-ms-inset]')
            h.ok('could not open' in full.locator('#ms-status').inner_text() and full.locator('#ms-status').evaluate('e=>e===document.activeElement'),'real report preflight refuses new fact with focused recovery status')
            h.ok(not full.locator('[data-ms-inset-window]').count() and full.locator('[data-ms-overview-window]').inner_html()==old_svg,'refused inset never renders and preserves old qualified SVG')
            h.ok(h.book(full)==full_before and '3x5' not in h.book(full)['broad']['seenFacts'],'refused supplied calculation leaves every notebook root unchanged')
            h.click(full,'[data-ms-hear]')
            spoken=full.locator('[data-ms-hear]').get_attribute('data-speak')
            h.ok(bool(spoken) and 'Overview detail' in spoken and '3 times 5' not in spoken and 'Inset drawn length' not in spoken,'actual requested narration retains old view after refused disclosure')
            h.click(full,'[data-ms-keep]')
            h.ok(h.book(full)==full_before and 'could not be kept' in full.locator('#ms-status').inner_text(),'real report Keep refusal retains existing model and all notebook data')

            # Explicit device failure uses real memory Keep and download.
            _,quota=native.setup(browser,fixtures['base'],'device-quota')
            go(quota,base)
            disk_before=h.book(quota)
            quota.evaluate('''()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Synthetic quota','QuotaExceededError');return original.call(this,k,v)}}''')
            start(quota)
            h.click(quota,'[data-ms-keep]')
            h.ok(h.book(quota)==disk_before,'storage failure leaves disk unchanged')
            h.ok('in this session' in quota.locator('#ms-status').inner_text() and quota.locator('[data-save-warning]').is_visible(),'device failure gives actual persistence warning')
            quota_export=native.download(quota,base,'quota-memory')
            h.ok(len(quota_export['mapSheets'])==1,'actual download recovers memory-only kept map')
            _,temporary=native.setup(browser,fixtures['base'],'saving-off')
            go(temporary,base)
            h.go(temporary,base,'#notes','#remember')
            temporary.locator('#remember').uncheck()
            temporary.evaluate('location.hash="'+ROUTE+'"')
            temporary.locator('[data-ms-root]').wait_for()
            start(temporary)
            h.click(temporary,'[data-ms-keep]')
            h.ok('Saving on this device is off' in temporary.locator('#ms-status').inner_text(),'saving off has distinct temporary notice')
            h.ok(len(native.download(temporary,base,'temporary-memory')['mapSheets'])==1,'saving-off explicit download retains kept map')

            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'consoleErrors':h.console_errors,'requestFailures':h.request_failures,'httpFailures':h.http_failures,'scope':'One820 native journey,320 samples, SVG coordinates, persistent two-owner transfer; separately labelled saving-off and quota faults. No audible/Safari/physical-device/learning qualification.'},indent=2))
            print(f'A Map That Fits browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for page,label in h.pages:
                if not page.is_closed():
                    try:
                        page.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True)
                        (OUT/(label+'-failure.html')).write_text(page.content())
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


if __name__=='__main__':
    main()
