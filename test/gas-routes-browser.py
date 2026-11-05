"""Air and Blood379 native Chromium, invented notebooks only.

One820 touch/keyboard journey and320/1024 responsive samples use the real app
and Notes. An explicitly isolated actual-UI harness covers external notebook,
mode and raw replacement unavailable through ordinary navigation. This suite
qualifies neither physical iPad/Safari, audible speech, VoiceOver nor learning.
"""
import sys
sys.dont_write_bytecode = True
import copy
import functools
import http.server
import importlib.util
import json
import math
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('GAS_ROUTES_ARTIFACTS',tempfile.mkdtemp(prefix='gas-routes-')))
OUT.mkdir(parents=True,exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS']=str(OUT)
_spec=importlib.util.spec_from_file_location('gas_native_helpers',ROOT/'test/courier-estimates-browser.py')
native=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(native)
h=native.h
ROUTE='#living/bodies'


def sel(name,value=None):
    if name=='root':return '[data-gas-root]'
    if name=='status':return '#gas-status'
    return '[data-gas-'+name+('="'+str(value)+'"' if value is not None else '')+']'
def click(p,name,value=None):h.click(p,sel(name,value))
def records(p):return h.book(p).get('gasGuides',[])
def dispatch(e,kind='click'):e.evaluate('(e,k)=>e.dispatchEvent(new Event(k,{bubbles:true,cancelable:true}))',kind)
def enter(p,base=None,full=False):
    if base:h.go(p,base,ROUTE,'[data-cs-gas]')
    if full:h.click(p,'[data-cs-enter]')
    h.click(p,'[data-cs-gas]');p.locator(sel('root')).wait_for()
def keep(p):
    click(p,'keep');return copy.deepcopy(records(p)[-1])
def hear(p):
    click(p,'hear');spoken=p.locator(sel('hear')).get_attribute('data-speak') or ''
    if p.locator('[data-stop-speech]').count():h.click(p,'[data-stop-speech]')
    return spoken

def fixture():
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',r'''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {gasCases} from './dist/gas-routes-content.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={payload:'Invented sibling stays exact'};
console.log(JSON.stringify({base,sources:gasCases,maxImportBytes:MAX_IMPORT_BYTES}));
'''],cwd=ROOT,text=True))

def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no page horizontal overflow')
    bad=p.locator('[data-gas-root] button,[data-gas-root] a,[data-gas-root] summary,[data-gas-root] select').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().width<44||e.getBoundingClientRect().height<44||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))''')
    h.ok(not bad,'visible controls have44px targets and16px text: '+str(bad))

def near(a,b,label):h.ok(len(a)==len(b) and all(abs(x-y)<.025 for x,y in zip(a,b)),label+': '+str(a))
def geometry(p,s):
    svg=p.locator('.gas-diagram').first
    h.ok(svg.get_attribute('viewBox')==f"0 0 {s['world']['width']} {s['world']['height']}",'diagram uses own source world')
    r=s['world']['width']*.045
    for leg in s['legs']:
        a=next(n for n in s['nodes'] if n['id']==leg['from']);b=next(n for n in s['nodes'] if n['id']==leg['to'])
        dx,dy=b['x']-a['x'],b['y']-a['y'];d=math.hypot(dx,dy);ux,uy=dx/d,dy/d
        line=svg.locator('[data-gas-arrow] line').nth(s['legs'].index(leg))
        xy=line.evaluate('e=>["x1","y1","x2","y2"].map(k=>+e.getAttribute(k))')
        near(xy,[a['x']+r*ux,a['y']+r*uy,b['x']-r*ux,b['y']-r*uy],'rendered arrow trimmed toward own next node '+leg['id'])
        head=svg.locator('[data-gas-arrow] polygon').nth(s['legs'].index(leg)).get_attribute('points')
        pts=[float(n) for n in head.replace(',',' ').split()]
        tip=pts[:2];near(tip,xy[2:],'arrowhead tip reaches directed endpoint')
        h.ok(all((tip[0]-pts[i])*ux+(tip[1]-pts[i+1])*uy>0 for i in range(2,len(pts),2)),'arrowhead wings point backwards even for diagonal or reversed route')
    nums=svg.locator('[data-gas-icon] text').evaluate_all('''es=>es.map(e=>{const m=e.getScreenCTM(),b=e.getBBox();return {text:e.textContent,size:parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.a,m.b),box:[b.x,b.y,b.width,b.height]}})''')
    h.ok([n['text'] for n in nums]==[str(i+1) for i in range(len(s['nodes']))],'numbers follow source itinerary')
    h.ok(all(n['size']>=15.9 for n in nums),'effective SVG numbers stay at least16px')
    badge=svg.locator('[data-gas-badge]').evaluate('e=>{const b=e.getBBox(),m=e.ownerSVGElement.getScreenCTM().inverse().multiply(e.getScreenCTM());return [b.x*m.a+b.y*m.c+m.e,b.x*m.b+b.y*m.d+m.f,b.width,b.height]}')
    active=p.locator('[data-gas-node][aria-pressed="true"]').get_attribute('data-gas-node')
    node=next(n for n in s['nodes'] if n['id']==active)
    h.ok(badge[0]>=node['x']-1.2*r-.1 and badge[1]>=node['y']-1.2*r-.1 and badge[0]+badge[2]<=node['x']+1.2*r+.1 and badge[1]+badge[3]<=node['y']+1.2*r+.1,'actual badge stays within source node bounds')
    # The circle/diamond's lower-left extent clears the central number patch.
    bx,by=badge[0]+badge[2]/2,badge[1]+badge[3]/2
    h.ok(math.hypot(bx-node['x'],by-node['y'])-max(badge[2],badge[3])/2>=.65*r-.1,'badge clears central number patch')

def make_geometry(p,identity):
    selected=p.locator('[data-gas-selected-link="true"]')
    h.ok(selected.count()==1 and selected.get_attribute('data-gas-arrow')==identity,'Make highlights exactly its active own link')
    width=float(selected.locator('line').get_attribute('stroke-width'))
    others=p.locator('[data-gas-selected-link="false"] line').evaluate_all('es=>es.map(e=>+e.getAttribute("stroke-width"))')
    h.ok(all(width>x for x in others) and p.locator('[data-gas-badge]').count()==0,'Make uses a stronger active arrow and suppresses the Follow stop badge')


def journey(browser,base,f):
    print('Air and blood: native tablet journey',flush=True)
    _,p=native.setup(browser,f['base'],'tablet');enter(p,base)
    before=h.book(p);h.ok('gasGuides' not in before,'entry leaves saved root absent');bounds(p);geometry(p,f['sources'][0])
    spoken=hear(p);h.ok('oxygen' in spoken.lower() and f['sources'][0]['nodes'][0]['description'] in spoken,'actual Hear names the gas and current stop')
    h.ok(f['sources'][0]['nodes'][-1]['description'] not in spoken and f['sources'][0]['gradientNote'] not in spoken and f['sources'][0]['teaching'][0] not in spoken,'Hear excludes unseen stops, closed definitions and unshown help')
    # A direct jump records only that stop and the original; previous is native keyboard.
    p.locator(sel('node','cell')).tap();p.locator(sel('previous')).focus();p.keyboard.press('Enter')
    h.ok(p.locator(sel('node','body')).get_attribute('aria-pressed')=='true','keyboard previous follows source itinerary')
    click(p,'turn','make');p.locator(sel('leg')).select_option('leg-2');make_geometry(p,'leg-2');click(p,'method','blood')
    h.ok(p.locator(sel('method','blood')).evaluate('e=>e===document.activeElement'),'label selection retains enabled focus')
    click(p,'remove');h.ok(p.locator(sel('leg')).evaluate('e=>e===document.activeElement'),'remove at empty boundary focuses active leg select')
    click(p,'method','air') # Deliberately unexpected; the game must preserve it ungraded.
    click(p,'reference');p.locator('[data-gas-fold="help"] summary').click();click(p,'example')
    p.screenshot(path=str(OUT/'tablet-working.png'),full_page=True)
    stale=p.locator(sel('keep')).element_handle();first=keep(p);dispatch(stale)
    h.ok(len(records(p))==1,'detached duplicate Keep cannot append twice')
    h.ok(first['work']['seen']==['outside','cell','body'] and first['work']['at']=='body','jump/previous keep exact sparse seen bookkeeping')
    h.ok(first['work']['guide']==[{'legId':'leg-2','methodId':'air'}],'unexpected label is kept without correction')
    h.ok(first['work']['referenceShown'] and first['work']['exampleSeen']==1,'elected reference and help prefix are independent')
    h.ok({k:v for k,v in h.book(p).items() if k!='gasGuides'}==before,'Keep changes only gas owner')
    h.ok(not p.locator(sel('keep')+','+sel('method')+','+sel('reference')+','+sel('example')).count(),'frozen guide cannot add labels or exposure')
    click(p,'turn','follow');click(p,'previous')
    h.ok(p.locator(sel('node','outside')).get_attribute('aria-pressed')=='true' and p.locator(sel('node','sac')).is_disabled(),'frozen previous skips unseen stops and unseen controls stay disabled')
    click(p,'next');h.ok(records(p)[0]==first,'frozen navigation never rewrites saved seen/current')
    click(p,'copy');click(p,'turn','make');p.locator(sel('leg')).select_option('leg-1');click(p,'method','blood')
    click(p,'case','carbon');geometry(p,f['sources'][1]);click(p,'node','lung');click(p,'turn','make');click(p,'method','air')
    click(p,'shelf');click(p,'card',first['id']);click(p,'copy');h.ok(p.locator(sel('method','blood')).get_attribute('aria-pressed')=='true','repeated Work on a copy resumes its continuing draft')
    second=keep(p);h.ok(records(p)[0]==first and len(second['work']['guide'])==2,'copy keeps new work while first stays exact')
    click(p,'case','carbon');carbon=keep(p);h.ok(carbon['work']['seen']==['cell','lung'],'independent carbon draft survives another Keep')
    exported=native.download(p,base,'tablet-export');h.ok(exported['gasGuides']==records(p),'real Notes exports exact guides')
    if os.environ.get('GAS_ROUTES_SMOKE')=='1':return
    lifecycle(browser,base,f,first)
    transfer(browser,base,f,exported,first)
    boundaries(browser,base,f,first,exported)
    returns(browser,base,f,first)
    for width in [320,1024]:
        _,q=native.setup(browser,f['base'],'width-'+str(width),width=width);enter(q,base);bounds(q);geometry(q,f['sources'][0]);click(q,'case','carbon');geometry(q,f['sources'][1]);click(q,'turn','make');bounds(q)
        q.screenshot(path=str(OUT/f'width-{width}.png'),full_page=True)


def lifecycle(browser,base,f,first):
    _,p=native.setup(browser,f['base'],'lifecycle');enter(p,base,full=True)
    click(p,'node','cell');click(p,'turn','make')
    controls=[p.locator(sel(n)).first.element_handle() for n in ['method','leg','hear']]
    for e in controls:e.evaluate('e=>{e.gasOriginalParent=e.parentNode;document.body.append(e)}')
    dispatch(controls[0]);controls[1].evaluate('e=>{e.value="leg-3";e.dispatchEvent(new Event("change",{bubbles:true}))}')
    controls[2].evaluate('e=>{e.dataset.speak="Captured sentinel";e.click()}')
    h.ok(controls[2].get_attribute('data-speak')=='Captured sentinel','reparented Hear never acquires narration')
    for e in controls:e.evaluate('e=>e.gasOriginalParent.append(e)')
    saved=keep(p);h.ok(saved['work']['guide']==[],'wrong-parent controls cannot change accepted guide')
    click(p,'copy');stale=p.locator(sel('keep')).element_handle();click(p,'back')
    dispatch(stale);h.ok(records(p)==[saved] and p.locator('[data-cs-root]').count()==1,'parent-mode exit rejects stale child Keep')
    h.click(p,'[data-cs-gas]');click(p,'shelf');click(p,'card',saved['id']);click(p,'copy')
    click(p,'turn','follow');h.ok(p.locator(sel('node','cell')).get_attribute('aria-pressed')=='true','same-route parent return preserves copy')
    stale=p.locator(sel('keep')).element_handle();p.evaluate('location.hash="#science"');p.locator('[data-gas-root]').wait_for(state='detached');dispatch(stale)
    h.ok(records(p)==[saved],'route exit cannot resurrect an unkept draft')
    p.evaluate('location.hash="#living/bodies"');p.locator('[data-cs-gas]').wait_for();enter(p)
    h.ok(p.locator(sel('node','outside')).get_attribute('aria-pressed')=='true','leaving the exact route discards unkept copy slots')
    external_lifecycle(browser,base,f,first)


def historical(first):
    x=copy.deepcopy(first);x['id']='gas-guide-80';s=x['source'];w=x['work']
    s.update(id='earlier-route',title='Earlier <route> & "air"',futureSource={'kept':True},world={'width':1000,'height':800,'futureWorld':True})
    # Three diagonal stops and two own methods with punctuation IDs.
    s['nodes']=[dict(s['nodes'][0],id='old"start\\node',x=100,y=150,label='Repeated name'),dict(s['nodes'][1],id='middle:node',x=430,y=420,label='Repeated name'),dict(s['nodes'][4],id='last.node',x=850,y=650)]
    s['methods']=[dict(s['methods'][0],id='earlier"method\\id'),dict(s['methods'][1],id='second:method')]
    s['legs']=[dict(s['legs'][0],id='old"leg\\id',**{'from':s['nodes'][0]['id'],'to':s['nodes'][1]['id'],'methodId':s['methods'][0]['id']}),dict(s['legs'][1],id='second:leg',**{'from':s['nodes'][1]['id'],'to':s['nodes'][2]['id'],'methodId':s['methods'][1]['id']})]
    s['teaching']=['Earlier single help frame'];w.update(at=s['nodes'][0]['id'],seen=[s['nodes'][0]['id'],s['nodes'][2]['id']],guide=[{'legId':s['legs'][0]['id'],'methodId':s['methods'][1]['id'],'futureChoice':True}],exampleSeen=1,futureWork={'kept':True})
    x['futureOuter']={'originalOnly':True};return x


def transfer(browser,base,f,exported,first):
    old=historical(first);unknown={'id':'gas-guide-900','v':99,'raw':'Invented unavailable guide'}
    mixed=copy.deepcopy(exported);mixed['gasGuides']=[unknown,old]+[{'id':'gas-guide-'+str(i),'v':99} for i in range(81,89)]+[first]
    _,p=native.setup(browser,f['base'],'notes-transfer');enter(p,base);identity=h.active(p);original=h.book(p)
    h.go(p,base,'#notes','#progress-file');p.locator('#progress-file').set_input_files({'name':'synthetic-gas-guides.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
    p.locator('#progress-import-confirm').wait_for();h.ok('Air and blood guides' in p.locator('.import-preview').inner_text(),'Notes preview names the opaque owner')
    h.click(p,'#progress-import-confirm');enter(p,base);h.ok(h.active(p)!=identity,'real import creates separate explorer')
    click(p,'shelf');h.ok('Guide 11' in p.locator(sel('root')).inner_text(),'shelf default uses last readable raw page')
    click(p,'page','-1');h.ok('Guide 2' in p.locator(sel('root')).inner_text(),'raw numbering includes unknown siblings')
    click(p,'card',old['id']);geometry(p,old['source'])
    h.ok(old['source']['title'] in p.locator(sel('root')).inner_text(),'historical source text is escaped and literal')
    click(p,'copy');click(p,'turn','make');p.locator(sel('leg')).select_option(old['source']['legs'][0]['id'])
    h.ok(p.locator(sel('method')).count()==2 and p.locator(sel('leg')+' option').count()==2,'historical own method/leg counts are used')
    p.locator(sel('method')).first.focus();p.keyboard.press('Enter')
    h.ok(p.locator(sel('method')).first.evaluate('e=>e===document.activeElement'),'punctuation IDs retain canonical selector focus')
    click(p,'remove');p.locator(sel('leg')).select_option(old['source']['legs'][1]['id']);p.locator(sel('method')).last.click()
    latest=keep(p)
    h.ok(latest['id']=='gas-guide-901' and latest['source']==old['source'] and latest['work']['futureWork']==old['work']['futureWork'] and 'futureOuter' not in latest,'copy preserves source/nested unknowns, excludes outer extras and reserves unknown ID')
    redownload=native.download(p,base,'historical-redownload');h.ok(redownload['gasGuides'][:-1]==mixed['gasGuides'],'Notes roundtrip preserves raw historical/unreadable entries exactly')
    enter(p,base);h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{identity}"]')
    h.ok(h.book(p)==original,'import and edits leave original explorer exact')


def external_lifecycle(browser,base,f,first):
    # Isolated actual-UI harness: mutate external context while retaining DOM.
    # Ordinary app navigation deliberately rebuilds DOM before these can occur.
    _,p=native.setup(browser,f['base'],'external-lifecycle-harness');enter(p,base)
    setup=r'''async seed=>{
      const ui=await import('./gas-routes-ui.mjs');ui.resetGasRoutes();document.querySelectorAll('[data-gas-root]').forEach(e=>e.remove());
      const book=structuredClone(seed),mount=document.querySelector('main');
      const h={book,currentBook:book,owner:'synthetic-owner',active:true,mode:true};
      const render=()=>{mount.innerHTML=ui.gasRoutesPage(book,'synthetic-owner');ui.bindGasRoutes(book,{explorerId:()=>h.owner,notebook:()=>h.currentBook,isActive:()=>h.active,isGasActive:()=>h.mode,onBack:()=>{},save:()=>({enabled:true,ok:true}),canExport:()=>true,render,focus:s=>document.querySelector(s)?.focus()})};
      h.render=render;h.ui=ui;window.gasHarness=h;render();
    }'''
    for fault,mutation in [('owner','h.owner="another-owner"'),('book','h.currentBook=structuredClone(h.book)'),('mode','h.mode=false'),('active','h.active=false'),('root','document.body.append(document.querySelector("[data-gas-root]"))'),('reset','h.ui.resetGasRoutes()')]:
        p.evaluate(setup,f['base']);old=p.evaluate('JSON.stringify(gasHarness.book)');action=p.locator(sel('keep')).element_handle();speech=p.locator(sel('hear')).element_handle()
        p.evaluate('(code)=>{const h=gasHarness;eval(code)}',mutation);dispatch(action);speech.evaluate('e=>{e.dataset.speak="Captured sentinel";e.click()}')
        h.ok(p.evaluate('JSON.stringify(gasHarness.book)')==old and speech.get_attribute('data-speak')=='Captured sentinel',fault+' invalidates Keep and speech before side effects')
    seed=copy.deepcopy(f['base']);seed['gasGuides']=[first]
    for prop in ['source','work']:
        p.evaluate(setup,seed);click(p,'shelf');click(p,'card',first['id']);action=p.locator(sel('copy')).element_handle()
        p.evaluate('(key)=>{gasHarness.book.gasGuides[0][key]=structuredClone(gasHarness.book.gasGuides[0][key])}',prop);dispatch(action)
        h.ok(not p.locator(sel('keep')).count(),'raw '+prop+' replacement invalidates frozen Copy')


def boundaries(browser,base,f,first,exported):
    for label,value in [('unsupported',{'v':99}),('exhausted',[{'id':'gas-guide-999999','v':99}])]:
        seed=copy.deepcopy(f['base']);seed['gasGuides']=value
        _,p=native.setup(browser,seed,label);enter(p,base);old=h.book(p)
        if p.locator(sel('keep')).is_enabled():click(p,'keep')
        h.ok(h.book(p)==old and p.locator(sel('keep')).count()==1,label+' blocks Keep only and retains draft')
    seed=copy.deepcopy(f['base']);probe=copy.deepcopy(exported);blank=copy.deepcopy(first);blank['id']='gas-guide-2'
    blank['work']={'v':1,'at':blank['source']['nodes'][0]['id'],'seen':[blank['source']['nodes'][0]['id']],'guide':[],'referenceShown':False,'exampleSeen':0}
    seed['gasGuides']=[first];probe['gasGuides']=[first,blank];probe['syntheticOther']['payload']=''
    sizing=browser.new_page();sizing.goto(base,wait_until='domcontentloaded');overhead=sizing.evaluate('x=>new TextEncoder().encode(JSON.stringify(x,null,2)).length',probe);sizing.close()
    seed['syntheticOther']['payload']='x'*(f['maxImportBytes']-overhead+128)
    _,p=native.setup(browser,seed,'capacity-refusal');enter(p,base);old=h.book(p);click(p,'keep')
    h.ok(h.book(p)==old and p.locator(sel('keep')).count()==1,'actual app Notes preflight refuses oversized Keep and retains draft')
    h.ok('download' in p.locator(sel('status')).inner_text().lower(),'capacity refusal offers recovery download')
    for fault in ['saving-off','quota']:
        _,p=native.setup(browser,f['base'],fault)
        if fault=='saving-off':
            h.go(p,base,'#notes','#remember');p.locator('#remember').uncheck()
            p.evaluate('location.hash="#living/bodies"');p.locator('[data-cs-gas]').wait_for();enter(p)
        else:enter(p,base)
        if fault=='quota':p.evaluate("()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Invented fault','QuotaExceededError');return native.call(this,k,v)}}")
        click(p,'keep');status=p.locator(sel('status')).inner_text().lower()
        h.ok('session' in status or 'off' in status or 'open page' in status,fault+' truthfully distinguishes memory from device persistence')
        recovered=native.download(p,base,fault+'-recovery');h.ok(len(recovered['gasGuides'])==1,fault+' actual Notes recovers kept in-memory guide')


def returns(browser,base,f,first):
    seed=copy.deepcopy(f['base']);seed['gasGuides']=[{'v':99},first]
    _,p=native.setup(browser,seed,'diffusion-return');h.go(p,base,'#science/ice','[data-dt-enter]')
    for full in [False,True]:
        if full:h.click(p,'[data-dt-enter]');p.locator('[data-dt-root]').wait_for()
        before=h.book(p);fold=p.locator('[data-gas-diffusion-return]')
        if fold.get_attribute('open') is None:fold.locator('summary').click()
        text=fold.inner_text();h.ok('Guide 2' in text and first['source']['title'] in text and first['source']['loopNote'] in text,'Diffusion return uses own frozen title/raw position/loop in mode '+str(full))
        h.ok(first['source']['returnQuestion'] in text and first['source']['notice'] in text,'return includes source limits and comparison question')
        if full:
            h.click(p,'[data-dt-hear]');spoken=p.locator('[data-dt-hear]').get_attribute('data-speak') or ''
            h.ok(first['source']['returnQuestion'] in spoken,'full Tray Hear includes elected open return')
            if p.locator('[data-stop-speech]').count():h.click(p,'[data-stop-speech]')
        h.ok(h.book(p)==before,'return fold and narration never write either owner')
        anchor=fold.locator('a').element_handle();anchor.evaluate('e=>{e.gasOriginalParent=e.parentNode;document.body.append(e)}');dispatch(anchor)
        h.ok(p.evaluate('location.hash')=='#science/ice' and h.book(p)==before,'reparented return link rejected in mode '+str(full))
        anchor.evaluate('e=>e.gasOriginalParent.append(e)')
    # Normal return follows the truthful existing destination.
    h.click(p,'[data-gas-diffusion-return] a');p.locator('[data-cs-gas]').wait_for()
    h.ok(h.book(p)==before,'ordinary return changes destination without a notebook write')


def main():
    f=fixture();server=None;base=os.environ.get('GAS_ROUTES_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            protocol_version='HTTP/1.1'
            def log_message(self,*args):pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            journey(browser,base,f)
            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors));h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'scope':__doc__,'smoke':os.environ.get('GAS_ROUTES_SMOKE')=='1'},indent=2))
            print(f'Air and blood browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for p,label in h.pages:
                if not p.is_closed():
                    try:p.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True);(OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception:pass
            raise
        finally:
            for c in h.contexts:
                try:c.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()

if __name__=='__main__':main()
