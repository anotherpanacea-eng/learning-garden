"""Native369: shared-scale geometry, disclosure bounds and real saved-work transfer.

Synthetic notebooks only. One tablet journey and phone samples. No app-module
interception or speech stubs; storage/report faults are explicitly separate.
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
OUT = Path(os.environ.get('COMPARE_RECORDS_ARTIFACTS', tempfile.mkdtemp(prefix='compare-records-', dir='/private/tmp')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
os.environ['RHYTHM_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('compare_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h
ROUTE = '#learn/math/compare-records'


def go(p, base):
    h.go(p, base, ROUTE, '[data-cr-root]')


def turn(p, number):
    h.click(p, f'[data-cr-page="{number}"]')


def start(p, source='courier'):
    h.click(p, f'[data-cr-start="{source}"]')


def content(p):
    return p.locator('[data-cr-root]').inner_text()


def reload(p):
    identity=h.active(p)
    p.reload(wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():
        h.click(p, f'[data-select-explorer="{identity}"]')
    p.locator('[data-cr-root]').wait_for()


def saved(p, identity='comparison-1'):
    return next(x for x in h.book(p)['compareRecords'] if isinstance(x,dict) and x.get('id')==identity)


def equation(p, total, count, mean, selector='[data-cr-root]'):
    return bool(re.search(rf'{re.escape(str(total))}\s*÷\s*{count}\s*=\s*{re.escape(str(mean))}(?![\d.])',p.locator(selector).inner_text()))


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    bad=p.locator('[data-cr-root] button,[data-cr-root] a,[data-cr-root] summary,[data-cr-root] select').evaluate_all('''xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent.trim(),w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height,font:getComputedStyle(x).fontSize}))''')
    h.ok(not bad,'44px controls and16px text: '+str(bad))
    bad_svg=p.locator('[data-cr-root] svg text').evaluate_all('''xs=>xs.filter(x=>x.getClientRects().length&&parseFloat(getComputedStyle(x).fontSize)*Math.min(Math.hypot(x.getScreenCTM().a,x.getScreenCTM().b),Math.hypot(x.getScreenCTM().c,x.getScreenCTM().d))<15.99).map(x=>x.textContent)''')
    h.ok(not bad_svg,'effective SVG text at least16CSSpx: '+str(bad_svg))
    labels=p.locator('[data-cr-tick]').evaluate_all('''xs=>xs.map(x=>{let b=x.getBBox(),v=x.ownerSVGElement.viewBox.baseVal;return{text:x.textContent,x:b.x,y:b.y,w:b.width,h:b.height,vw:v.width,vh:v.height}})''')
    h.ok(bool(labels) and all(x['x']>=-.01 and x['y']>=-.01 and x['x']+x['w']<=x['vw']+.01 and x['y']+x['h']<=x['vh']+.01 for x in labels),'actual tick labels stay in their viewBox')
    h.ok(all(a['x']+a['w']<=b['x']+.01 or b['x']+b['w']<=a['x']+.01 or a['y']+a['h']<=b['y']+.01 or b['y']+b['h']<=a['y']+.01 for a,b in itertools.combinations(labels,2)),'actual tick-label bounding boxes do not overlap')


def dot_positions(p):
    return p.locator('[data-cr-dot]').evaluate_all("xs=>xs.map(x=>({group:x.dataset.crGroup,id:x.dataset.crId,value:+x.dataset.crValue,x:+x.getAttribute('cx'),y:+x.getAttribute('cy'),r:+x.getAttribute('r')}))")


def highlight(p, source, focus, summaries):
    for group,values in zip(source['groups'],summaries):
        box=p.locator(f'[data-cr-highlight][data-cr-group="{group["id"]}"]').evaluate('e=>{const b=e.getBBox();return[b.x,b.width]}')
        expected=[60+500*values[focus]/source['axis']['max'],0] if focus!='range' else [60+500*values['min']/source['axis']['max'],500*(values['max']-values['min'])/source['axis']['max']]
        native.near(box,expected,'actual '+focus+' highlight follows its own group summary')


def plot(p, source, lanes=None):
    dots=p.locator('[data-cr-dot]').evaluate_all('''xs=>xs.map(x=>({group:x.dataset.crGroup,id:x.dataset.crId,value:+x.dataset.crValue,x:+x.getAttribute('cx'),y:+x.getAttribute('cy'),r:+x.getAttribute('r'),stroke:parseFloat(getComputedStyle(x).strokeWidth)}))''')
    h.ok(len(dots)==sum(len(g['records']) for g in source['groups']),'one actual circle per original record, including set-aside and duplicates')
    if lanes is None:
        lanes=[]
        for group in source['groups']:
            placed=[]
            for index,r in sorted(enumerate(group['records']),key=lambda pair:(pair[1]['value'],pair[0])):
                lane=0
                while any(l==lane and 500*abs(r['value']-v)<16*source['axis']['max'] for v,l in placed):
                    lane+=1
                placed.append((r['value'],lane))
            lanes.append([l for _,l in placed])
    level=1+max(x for group in lanes for x in group)
    band=110+20*level
    baselines=[40+20*level,40+20*level+band]
    for gi,group in enumerate(source['groups']):
        actual=[d for d in dots if d['group']==group['id']]
        ordered=sorted(enumerate(group['records']),key=lambda pair:(pair[1]['value'],pair[0]))
        h.ok(len(actual)==len(ordered),'correct original marker count for '+group['id'])
        for j,(_,record) in enumerate(ordered):
            dot=next(d for d in actual if d['id']==record['id'])
            native.near([dot['value'],dot['x'],dot['y'],dot['r']],[record['value'],60+500*record['value']/source['axis']['max'],baselines[gi]-20*lanes[gi][j],6],'actual marker uses shared scale and stable clear lane')
        h.ok(all(math.hypot(a['x']-b['x'],a['y']-b['y'])+1e-7>=a['r']+a['stroke']/2+b['r']+b['stroke']/2+2 for a,b in itertools.combinations(actual,2)),'actual stroked dots remain distinct, not merely present in DOM')
    view=p.locator('[data-cr-plot]').get_attribute('viewBox').split()
    native.near([float(x) for x in view],[0,0,600,2*band+40],'declared diagram contains its complete two-row geometry')
    return [{k:d[k] for k in ['group','id','value','x','y','r']} for d in dots]


def main():
    fixture_code="""
import {waitingNotebook} from './test/story-arrivals-checks.mjs';
import {compareSource,validCompareWork} from './dist/compare-records-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startPostOffice} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
import {startAdaptiveRival,generateRivalTask,validPostRival} from './dist/post-rival.mjs';
const base=waitingNotebook();base.garden.welcomeFilmSeen=true;base.syntheticOther.payload='x'.repeat(512000);
const source=compareSource('courier');source.id='own-small-records';source.title='Own ordinary records';source.purpose='Compare these original records.';source.axis={max:6,tick:1};source.groups=[{id:'old-west',label:'West',records:[2,4,6].map((value,i)=>({id:'w'+(i+1),value}))},{id:'old-east',label:'East',records:[3,4,5].map((value,i)=>({id:'e'+(i+1),value}))}];source.comparison={groupId:'old-west',recordId:'w3',note:'Ordinary clear run.'};delete source.worked;source.opaque={raw:'Synthetic nested source value'};
const small={kind:'record-comparison',v:1,id:'comparison-70',source,focus:'mean',aside:false,workingsShown:false,secondaryWorkingsSeen:false,workedSeen:2,narration:false,purpose:null};if(!validCompareWork(small))throw Error('Small fixture invalid');
const pending=initializeExplorerState(freshState());pending.garden.welcomeFilmSeen=true;pending.syntheticOther={raw:'Synthetic retained sibling',payload:''};const visit=startPostOffice(pending,deliveries[0].id);if(!startAdaptiveRival(pending))throw Error('pending start');visit.rival.task=generateRivalTask('multiply',2,3,0);if(!validPostRival(visit.rival))throw Error('invalid rival');pending.compareRecords=[small];
console.log(JSON.stringify({base,pending,small,maxImportBytes:MAX_IMPORT_BYTES,courier:compareSource('courier'),parcels:compareSource('parcels')}));
"""
    fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',fixture_code],cwd=ROOT,text=True))
    server=None
    base=os.environ.get('COMPARE_RECORDS_TEST_URL')
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
            go(p,base)
            before=h.book(p)
            h.ok('compareRecords' not in before,'entry creates neither optional owner nor source')
            start(p)
            h.ok(p.evaluate('document.activeElement.id==="cr-heading"'),'Start focuses active heading')
            original_dots=plot(p,fixtures['courier'],[[0,1,0,2,1,0,1],[0,1,2,0,1,0,0]])
            cells=p.locator('[data-cr-summary]').evaluate_all("xs=>xs.map(x=>[x.dataset.crSummary,x.dataset.crGroup,x.textContent.trim()])")
            h.ok(cells==[['n','bridge','7'],['n','ford','7'],['mean','bridge','42'],['mean','ford','40'],['median','bridge','42'],['median','ford','34'],['range','bridge','8'],['range','ford','45']],'centers and spreads are attached to the correct original groups')
            for focus in ['median','range','mean']:
                h.click(p,f'[data-cr-focus="{focus}"]')
                h.ok(p.locator(f'[data-cr-focus="{focus}"]').get_attribute('aria-pressed')=='true','selected summary highlight is explicit')
                h.ok(dot_positions(p)==original_dots,'summary changes never move original observations')
                highlight(p,fixtures['courier'],focus,[{'mean':42,'median':42,'min':38,'max':46},{'mean':40,'median':34,'min':31,'max':76}])
            h.click(p,'[data-cr-worked]')
            h.ok('60 ÷ 3 = 20' in content(p),'different example starts at its own first step')
            for _ in range(3): h.click(p,'[data-cr-step="1"]')
            h.ok('(20 + 30) ÷ 2 = 25' in content(p),'manual last step explains even-count middle')
            h.click(p,'[data-cr-worked]')
            h.click(p,'[data-cr-workings]')
            h.ok(equation(p,294,7,42) and equation(p,280,7,40),'original calculations use the actual lists')
            bounds(p)
            turn(p,1)
            h.click(p,'[data-cr-aside]')
            h.ok(dot_positions(p)==original_dots,'secondary comparison preserves every original position')
            h.ok(p.locator('[data-cr-aside-dot]').count()==1,'named set-aside observation remains visible and distinguished')
            h.ok(equation(p,204,6,34,'[data-cr-secondary-workings]'),'secondary mean is computed from the narrower six-trip list')
            h.ok('33.5' in content(p) and '76' in content(p),'even median and retained long observation remain inspectable')
            h.click(p,'[data-cr-aside]')
            h.ok(not p.locator('[data-cr-aside-dot]').count() and dot_positions(p)==original_dots,'Use all records restores highlight without moving or deleting data')
            h.click(p,'[data-cr-aside]')
            turn(p,2)
            h.click(p,'[data-cr-purpose="variation"]')
            h.ok(p.locator('[data-cr-purpose="variation"]').get_attribute('aria-pressed')=='true','purpose is an explicit ungraded choice')
            h.click(p,'[data-cr-hear]')
            spoken=p.locator('[data-cr-hear]').get_attribute('data-speak')
            h.ok(bool(spoken) and '204' in spoken,'actual requested narration reads current visible calculations')
            h.click(p,'[data-cr-hear]')
            h.ok(p.locator('[data-cr-hear]').get_attribute('data-speak')==spoken,'repeated Hear excludes its own inserted voice panel')
            bounds(p)
            stale=p.locator('[data-cr-keep]').element_handle()
            h.click(p,'[data-cr-keep]')
            stale.evaluate('(e)=>e.click()')
            h.ok(len(h.book(p)['compareRecords'])==1,'detached duplicate Keep appends once')
            first=copy.deepcopy(saved(p))
            h.ok(first['secondaryWorkingsSeen'] is True and first['workedSeen']==4,'only actually disclosed secondary workings and teaching extent are retained')
            h.ok(p.locator('[data-cr-kept]').count()==1 and not p.locator('[data-cr-keep],[data-cr-focus],[data-cr-aside],[data-cr-purpose]').count(),'kept comparison offers no editing controls')
            turn(p,0)
            h.ok(not p.locator('#cr-teaching-heading').count(),'Keep closes earlier teaching')
            h.click(p,'[data-cr-worked]')
            h.ok(p.locator('#cr-teaching-heading').count()==1,'saved teaching can explicitly reopen')
            h.click(p,'[data-cr-choose]')
            h.click(p,'[data-cr-open="comparison-1"]')
            h.ok(not p.locator('#cr-teaching-heading').count(),'Open closes the saved teaching fold again')
            h.click(p,'[data-cr-again="comparison-1"]')
            h.click(p,'[data-cr-focus="range"]')
            h.ok(saved(p)==first,'retry choices preserve the immutable original')
            route_stale=p.locator('[data-cr-keep]').element_handle()
            h.go(p,base,'#learn/math/map-sheet','[data-ms-root]')
            route_stale.evaluate('(e)=>e.click()')
            h.ok(len(h.book(p)['compareRecords'])==1,'route-exited Keep is inert')
            go(p,base)
            start(p,'parcels')
            plot(p,fixtures['parcels'],[[0]*5,[0]*5])
            h.ok('24' in p.locator('[data-cr-summarytable]').inner_text() and '26' in p.locator('[data-cr-summarytable]').inner_text(),'equal centers retain different ranges')
            turn(p,1)
            h.ok(not p.locator('[data-cr-aside]').count() and 'Which single summary' in content(p),'second set invites a different contrast without inventing an excluded trip')
            reload(p)
            h.ok(p.locator('[data-cr-start="parcels"]').count()==1,'reload discards unkept local slots')
            h.click(p,'[data-cr-open="comparison-1"]')
            h.ok(saved(p)==first,'reload retains exact source and choices')
            p.screenshot(path=str(OUT/'tablet-kept.png'),full_page=True)
            exported=native.download(p,base,'tablet-export')
            h.ok(exported['compareRecords'][0]==first and len(exported['syntheticOther']['payload'])>=512000,'real Notes export retains source and large unrelated work')

            # A real imported source uses its own unequal counts, fractions,
            # labels, optional malformed helper and future sibling.
            historical=copy.deepcopy(first)
            historical['id']='comparison-71'
            historical['source'].update({'id':'earlier-source','title':'Earlier <routes> & notes','purpose':'Compare these copied observations.','axis':{'max':12,'tick':2}})
            historical['source']['groups']=[{'id':'earlier-west','label':'Earlier <West>','records':[{'id':f'w{i+1}','value':v} for i,v in enumerate([1,2,3,4,5,6,8])]},{'id':'earlier-east','label':'Earlier East','records':[{'id':f'e{i+1}','value':v} for i,v in enumerate([0,0,1])]}]
            historical['source']['comparison']={'groupId':'earlier-west','recordId':'w7','note':'Ordinary copied trip.'}
            historical['source']['worked']={'steps':['Synthetic broken helper'],'factsByStep':'unreadable'}
            historical.update({'aside':False,'workingsShown':False,'secondaryWorkingsSeen':False,'workedSeen':2})
            mixed=copy.deepcopy(exported)
            mixed['compareRecords'] += [historical,{'kind':'future','v':99,'id':'comparison-90','raw':'Synthetic unreadable comparison'}]
            _,q=native.setup(browser,fixtures['base'],'transfer')
            go(q,base)
            original_id,original_book=h.active(q),h.book(q)
            import_stale=q.locator('[data-cr-start="courier"]').element_handle()
            h.go(q,base,'#notes','#progress-file')
            q.locator('#progress-file').set_input_files({'name':'synthetic-comparisons.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
            q.locator('#progress-import-confirm').wait_for()
            h.ok('Compare Shelf' in q.locator('.import-preview').inner_text(),'import preview names optional comparison owner')
            h.click(q,'#progress-import-confirm')
            go(q,base)
            import_stale.evaluate('(e)=>e.click()')
            h.ok(q.locator('[data-cr-start="courier"]').count()==1 and h.active(q)!=original_id,'detached Start cannot attach to replacement notebook')
            reload(q)
            h.ok('Earlier <routes> & notes' in content(q),'historical title is escaped and displayed literally')
            h.click(q,'[data-cr-open="comparison-71"]')
            plot(q,historical['source'])
            h.ok('29/7' in content(q) and '1/3' in content(q),'historical summaries retain exact reduced nonterminating fractions')
            h.click(q,'[data-cr-again="comparison-71"]')
            h.ok(not q.locator('[data-cr-worked]').count(),'malformed optional helper leaves the original records open')
            turn(q,1)
            h.click(q,'[data-cr-aside]')
            h.ok('Ordinary copied trip.' in content(q) and 'ford was closed' not in content(q),'historical source note is quoted without today’s closure narrative')
            h.ok(len(h.book(q)['compareRecords'])==3,'unkept historical exploration does not rewrite kept records')
            redownload=native.download(q,base,'imported-redownload')
            h.ok(redownload['compareRecords']==mixed['compareRecords'] and redownload['syntheticOther']==mixed['syntheticOther'],'real import/reload/redownload preserves historical and unreadable work exactly')
            go(q,base)
            owner_stale=q.locator('[data-cr-start="courier"]').element_handle()
            h.click(q,'#explorer-switch')
            h.click(q,f'[data-select-explorer="{original_id}"]')
            q.locator('[data-cr-root]').wait_for()
            owner_stale.evaluate('(e)=>e.click()')
            h.ok(h.book(q)==original_book and q.locator('[data-cr-start="courier"]').count()==1,'owner switch preserves the original and rejects detached old-owner Start')

            _,phone=native.setup(browser,fixtures['base'],'phone',width=320)
            go(phone,base)
            start(phone)
            phone_dots=plot(phone,fixtures['courier'])
            for page in [0,1,2]:
                turn(phone,page)
                h.ok(phone.evaluate('document.activeElement.id==="cr-heading"'),'phone turn focuses active heading')
                if page==1: h.click(phone,'[data-cr-aside]')
                h.ok(dot_positions(phone)==phone_dots,'responsive turn changes preserve observed positions')
                bounds(phone)
            phone.screenshot(path=str(OUT/'phone-case.png'),full_page=True)

            # Hostile saved-view sequence: aside alone must not authorize later
            # secondary arithmetic after original workings are opened elsewhere.
            _,pending=native.setup(browser,fixtures['pending'],'pending-secondary')
            go(pending,base)
            h.click(pending,'[data-cr-open="comparison-70"]')
            h.click(pending,'[data-cr-again="comparison-70"]')
            turn(pending,1)
            h.click(pending,'[data-cr-aside]')
            h.ok(not pending.locator('[data-cr-secondary-workings]').count(),'aside summary alone discloses no secondary calculation')
            turn(pending,0)
            h.click(pending,'[data-cr-workings]')
            h.ok(equation(pending,12,3,4) and not equation(pending,6,2,3),'Compare reveals original workings only')
            h.ok('3x4' in h.book(pending)['broad']['seenFacts'] and '2x3' not in h.book(pending)['broad']['seenFacts'],'actual original arithmetic qualifies3x4 but not unseen secondary2x3')
            h.click(pending,'[data-cr-keep]')
            snapshot=copy.deepcopy(saved(pending,'comparison-71'))
            h.ok(snapshot['aside'] and snapshot['workingsShown'] and not snapshot['secondaryWorkingsSeen'],'saved flags distinguish original and undisclosed secondary workings')
            reload(pending)
            h.click(pending,'[data-cr-open="comparison-71"]')
            turn(pending,1)
            h.ok(not pending.locator('[data-cr-secondary-workings]').count() and not equation(pending,6,2,3),'saved navigation does not reveal new secondary arithmetic')
            h.ok('2x3' not in h.book(pending)['broad']['seenFacts'] and not h.book(pending)['postOffice']['visits'][0]['rival'].get('priorFactShown'),'waiting2x3 remains unshown after hostile saved sequence')
            h.click(pending,'[data-cr-again="comparison-71"]')
            turn(pending,1)
            h.ok(equation(pending,6,2,3,'[data-cr-secondary-workings]'),'editable return can explicitly show the secondary calculation')
            after=h.book(pending)
            h.ok('2x3' in after['broad']['seenFacts'] and after['postOffice']['visits'][0]['rival'].get('priorFactShown') is True and after['postOffice']['visits'][0]['rival']['attempts']==[],'actual supplied secondary2x3 qualifies waiting Bramble without an answer')
            h.click(pending,'[data-cr-keep]')
            h.ok(saved(pending,'comparison-72')['secondaryWorkingsSeen'] is True and saved(pending,'comparison-71')==snapshot,'successful editable disclosure sets only new snapshot’s bound')

            # A separately seeded actual Notes report avoids import’s duplicate
            # recovery payload. Only growth for2x3 can exceed the real report cap.
            _,full_source=native.setup(browser,fixtures['pending'],'capacity-source')
            go(full_source,base)
            report=native.download(full_source,base,'before-display-capacity')
            full_raw=full_source.evaluate('''({report,cap})=>{const facts=[];for(let a=1;a<=12;a++)for(let b=a;b<=12;b++)if(!(a===2&&b===3))facts.push(`${a}x${b}`);report.exposures=[...new Set(facts.flatMap(k=>{const[a,b]=k.split('x');return[k,`${b}x${a}`]}))];report.broad.seenFacts=facts;report.broad.seenItems=facts.map(k=>`legacy-${k}`);report.broad.seenVariants=facts.map(k=>`legacy-${k}:authored`);report.syntheticOther.payload='';const size=new TextEncoder().encode(JSON.stringify(report,null,2)).length;report.syntheticOther.payload='x'.repeat(cap-size);return JSON.stringify(report,null,2);}''',{'report':report,'cap':fixtures['maxImportBytes']})
            h.ok(len(full_raw.encode())==fixtures['maxImportBytes'],'synthetic report is exactly at the actual pretty-report byte cap')
            full_seed=json.loads(full_raw)
            for name in ['title','exportedAt','note','explorer','recommendation']: full_seed.pop(name,None)
            _,full=native.setup(browser,full_seed,'display-capacity')
            go(full,base)
            h.click(full,'[data-cr-open="comparison-70"]')
            h.click(full,'[data-cr-again="comparison-70"]')
            turn(full,1)
            h.click(full,'[data-cr-aside]')
            turn(full,0)
            h.click(full,'[data-cr-workings]')
            full_before=h.book(full)
            old_plot=full.locator('[data-cr-plot]').inner_html()
            turn(full,1)
            h.ok('could not open' in full.locator('#cr-status').inner_text() and full.locator('#cr-status').evaluate('e=>e===document.activeElement'),'real growth preflight refuses secondary display with focused recovery')
            h.ok(full.locator('#cr-heading').inner_text()=='Compare the records' and not full.locator('[data-cr-secondary-workings]').count() and full.locator('[data-cr-plot]').inner_html()==old_plot,'refused page change retains qualified original view and source positions')
            h.ok(h.book(full)==full_before and '2x3' not in h.book(full)['broad']['seenFacts'],'refusal preserves every notebook root and no new supplied fact')
            h.click(full,'[data-cr-hear]')
            requested=full.locator('[data-cr-hear]').get_attribute('data-speak')
            h.ok(bool(requested) and '12' in requested and not re.search(r'6\s+divided by\s+2\s*=\s*3',requested),'actual requested narration excludes the refused secondary calculation')
            h.click(full,'[data-cr-keep]')
            h.ok(h.book(full)==full_before and 'could not be kept' in full.locator('#cr-status').inner_text(),'real Keep refusal preserves draft and original notebook')

            _,quota=native.setup(browser,fixtures['base'],'device-quota')
            go(quota,base)
            disk_before=h.book(quota)
            quota.evaluate('''()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Synthetic quota','QuotaExceededError');return original.call(this,k,v)}}''')
            start(quota)
            h.click(quota,'[data-cr-keep]')
            h.ok(h.book(quota)==disk_before,'quota failure leaves disk unchanged')
            h.ok('in this session' in quota.locator('#cr-status').inner_text() and quota.locator('[data-save-warning]').is_visible(),'quota warning distinguishes memory from device persistence')
            h.ok(len(native.download(quota,base,'quota-memory')['compareRecords'])==1,'real download recovers memory-only comparison')
            _,temporary=native.setup(browser,fixtures['base'],'saving-off')
            go(temporary,base)
            h.go(temporary,base,'#notes','#remember')
            temporary.locator('#remember').click();temporary.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click()
            temporary.evaluate('location.hash="'+ROUTE+'"')
            temporary.locator('[data-cr-root]').wait_for()
            start(temporary)
            h.click(temporary,'[data-cr-keep]')
            h.ok('Saving on this device is off' in temporary.locator('#cr-status').inner_text(),'saving-off notice is distinct')
            h.ok(len(native.download(temporary,base,'temporary-memory')['compareRecords'])==1,'saving-off explicit download preserves comparison')
            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'consoleErrors':h.console_errors,'requestFailures':h.request_failures,'httpFailures':h.http_failures,'scope':'One820 journey,320 samples, actual clear SVG geometry, persistent two-owner transfer, saved disclosure subset and actual report preflight. Quota/saving-off are separate faults. No audible/Safari/physical-device/learning qualification.'},indent=2))
            print(f'Compare Shelf browser: {h.checks} assertions passed; artifacts {OUT}')
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
