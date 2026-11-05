"""Native377 lens geometry, frozen views and genuine Notes transfers.

Invented notebooks only. One820px touch/keyboard journey plus320/1024 samples.
Chromium emulation leaves PHYSICAL qualification untested: microscope skill,
iPad, Safari, VoiceOver, audible speech and learning are not measured.
"""
import sys
sys.dont_write_bytecode = True
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
import traceback
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('LENS_ARTIFACTS',tempfile.mkdtemp(prefix='lens-bench-')))
OUT.mkdir(parents=True,exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS']=str(OUT)
spec=importlib.util.spec_from_file_location('lens_native_helpers',ROOT/'test/courier-estimates-browser.py')
native=importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h=native.h
ROUTE='#science/lens'


def enter(p,base):h.go(p,base,ROUTE,'[data-lens-root]')
def click(p,name,value=None):h.click(p,'[data-lens-'+name+('="'+str(value)+'"' if value is not None else '')+']')
def turn(p,n):click(p,'turn',n)
def choose(p,n):
    p.locator('[data-lens-chooser]').evaluate('e=>e.open=true');click(p,'case',n)
def focus_is(p,s):return p.locator(s).evaluate('e=>e===document.activeElement')
def dispatch(e,event='click'):e.evaluate('(e,t)=>e.dispatchEvent(new Event(t,{bubbles:true,cancelable:true}))',event)
def near(a,b,label,tol=.002):h.ok(len(a)==len(b) and all(abs(x-y)<tol for x,y in zip(a,b)),label+': '+str(a))
def records(p):return h.book(p).get('lensViews',[])
def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    bad=p.locator('[data-lens-root] button,[data-lens-root] a,[data-lens-root] summary,[data-lens-root] select').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().width<44||e.getBoundingClientRect().height<44||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,font:getComputedStyle(e).fontSize}))''')
    h.ok(not bad,'44px controls and16px text: '+str(bad))

def reload(p):
    identity=h.active(p);p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():h.click(p,f'[data-select-explorer="{identity}"]')
    p.locator('[data-lens-root]').wait_for()


def fixtures():
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',r'''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {lensSource,newLensWork} from './dist/lens-bench-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={payload:'Invented sibling remains exact'};
const source=lensSource('crossed');source.id='earlier';source.title='Earlier <field> & powers';
source.world={width:800,height:600,baseDiameter:320,baseObjectiveId:'low',center:{x:300,y:250}};
source.eyepiece=7;source.objectives=[{id:'low',label:'Earlier low',power:5},{id:'high',label:'Earlier high',power:20}];
source.focus=[{id:'mist',label:'Earlier mist',blur:2},{id:'sharp',label:'Earlier clear',blur:0}];source.initialFocusId='mist';
source.marks=[{id:'old-a',label:'Earlier circle',art:'ring',x:300,y:250,size:10},{id:'old-b',label:'Earlier box',art:'box',x:380,y:250,size:10}];source.targetId='old-b';
source.teaching=[{text:'Frozen earlier teaching only',view:{objectiveId:'high',focusId:'sharp',center:{x:380,y:250}}}];source.photo.zooms=[1,3,8];source.futureSource={kept:true};
const work=newLensWork(source);work.view={objectiveId:'high',focusId:'mist',center:{x:300,y:250}};work.futureWork={kept:true};
const historical={id:'lens-view-80',source,work,futureOuter:{originalOnly:true}};
const extremes=[200,200.01].map((sigma,i)=>{const s=lensSource('crossed');s.id='extreme-'+i;s.title='Extreme field '+sigma;s.world.baseDiameter=16;s.objectives=[{id:'base',label:'Base',power:1},{id:'narrow',label:'Narrow',power:100}];s.world.baseObjectiveId='base';s.focus=[{id:'extreme',label:'Soft',blur:sigma/2500}];s.initialFocusId='extreme';const v={objectiveId:'narrow',focusId:'extreme',center:{x:200,y:200}};s.teaching=[{text:'Frozen extreme teaching',view:v}];const w=newLensWork(s);w.view=v;return {id:'lens-view-'+(81+i),source:s,work:w};});
console.log(JSON.stringify({base,historical,extremes,maxImportBytes:MAX_IMPORT_BYTES}));
'''],cwd=ROOT,text=True))


def geometry(p,historical=False):
    field=p.locator('[data-lens-field]')
    target=field.locator('[data-lens-target]')
    if historical:
        near(target.evaluate('e=>[+e.getAttribute("cx"),+e.getAttribute("cy"),+e.getAttribute("r")]'),[600,200,62.5],'historical world projects target from own field80 and mark size10')
        return
    # At low power after left arrow, center is(100,200); target(90,90).
    near(target.evaluate('e=>[+e.getAttribute("cx"),+e.getAttribute("cy"),+e.getAttribute("r")]'),[190,90,15],'independent mark target projection after quarter-field pan')
    clip=target.evaluate('e=>{const g=e.closest("[clip-path]");const id=g.getAttribute("clip-path").slice(5,-1);const c=e.ownerSVGElement.querySelector("#"+id+" circle");return [+c.getAttribute("cx"),+c.getAttribute("cy"),+c.getAttribute("r")]}')
    near(clip,[200,200,200],'annotation and marks share final circular aperture')
    # Force letterboxing: the actual SVG CTM must drive input conversion.
    field.evaluate('e=>{e.style.width="360px";e.style.height="260px";e.style.maxWidth="100%"}')
    point=field.evaluate('e=>{const p=new DOMPoint(250,200).matrixTransform(e.getScreenCTM());return {x:p.x,y:p.y}}')
    p.mouse.click(point['x'],point['y'])
    near(p.locator('[data-lens-target]').first.evaluate('e=>[+e.getAttribute("cx"),+e.getAttribute("cy")]'),[140,90],'actual rendered CTM maps tap to world center150,200',1.2)
    h.ok(focus_is(p,'#lens-field-title'),'pointer recenter focuses field heading')
    click(p,'pan','right')
    near(p.locator('[data-lens-target]').first.evaluate('e=>[+e.getAttribute("cx"),+e.getAttribute("cy")]'),[40,90],'right arrow moves center by current diameter quarter',1.2)
    click(p,'pan','left')
    # Outside circular aperture is not an input even inside SVG square.
    point=p.locator('[data-lens-field]').evaluate('e=>{const p=new DOMPoint(10,10).matrixTransform(e.getScreenCTM());return {x:p.x,y:p.y}}')
    p.mouse.click(point['x'],point['y'])
    near(p.locator('[data-lens-target]').first.evaluate('e=>[+e.getAttribute("cx"),+e.getAttribute("cy")]'),[140,90],'square corner tap outside circular field leaves center unchanged',1.2)
    h.ok(not p.locator('[data-lens-field] filter').count(),'clear focus omits blur filter')


def relative_blur(p):
    # Compare the actual raster edge distribution of the same cross, normalized
    # to its drawing size. This catches fixed-screen blur falsely sharpening it.
    from PIL import Image
    import math
    click(p,'focus',-1)
    target=p.locator('[data-lens-target]').first
    point=target.evaluate('e=>{const p=new DOMPoint(+e.getAttribute("cx"),+e.getAttribute("cy")).matrixTransform(e.ownerSVGElement.getScreenCTM());return {x:p.x,y:p.y}}')
    p.mouse.click(point['x'],point['y'])
    spreads=[]
    for objective,scale in [('o4',1),('o40',10)]:
        click(p,'objective',objective)
        field=p.locator('[data-lens-field]');field.evaluate('e=>{e.style.width="400px";e.style.height="400px";e.style.maxWidth="none"}')
        path=OUT/('blur-'+objective+'.png');field.screenshot(path=str(path))
        image=Image.open(path).convert('RGB');factor=image.width/400
        cx,cy=field.locator("[data-lens-target]").evaluate('e=>[+e.getAttribute("cx"),+e.getAttribute("cy")]')
        x=round((cx+5*scale)*factor);center=cy*factor;radius=round(5*scale*factor)
        weighted=[]
        for y in range(round(center)-radius,round(center)+radius+1):
            r,g,b=image.getpixel((x,y));dark=max(0,245-(r+g+b)/3)
            weighted.append(((y-center)/factor/scale,dark))
        total=sum(w for _,w in weighted);mean=sum(y*w for y,w in weighted)/total
        spreads.append(math.sqrt(sum((y-mean)**2*w for y,w in weighted)/total))
    h.ok(abs(spreads[0]-spreads[1])<.35,'actual raster blur remains similarly soft relative to mark size at4/40 objectives: '+str(spreads))
    click(p,'objective','o4');click(p,'focus',1)


def photo_geometry(p,z=1,x=.5,y=.5):
    img=p.locator('[data-lens-photo-image]');img.scroll_into_view_if_needed()
    img.evaluate('e=>e.decode()')
    dims=img.evaluate('e=>[e.naturalWidth,e.naturalHeight]');near(dims,[3264,1840],'actual JPEG intrinsic dimensions')
    crop=img.evaluate('e=>{const a=e.getBoundingClientRect(),w=e.parentElement,b=w.getBoundingClientRect();return [(b.left+w.clientLeft-a.left)/a.width,(b.top+w.clientTop-a.top)/a.height,w.clientWidth/a.width,w.clientHeight/a.height,w.clientWidth/w.clientHeight]}')
    near(crop,[x-.5/z,y-.5/z,1/z,1/z,3264/1840],'actual CSS photo viewport realizes independent normalized source rectangle',.003)


def journey(browser,base,f):
    _,p=native.setup(browser,f['base'],'tablet');enter(p,base);before=h.book(p)
    h.ok('lensViews' not in before,'entry does not create kept views')
    bounds(p)
    p.screenshot(path=str(OUT/'tablet-viewfinder.png'),full_page=True)
    # Touch and keyboard controls preserve their own focus, with no draft writes.
    p.locator('[data-lens-focus="-1"]').focus();p.keyboard.press('Enter')
    h.ok(focus_is(p,'[data-lens-focus="1"]'),'left endpoint moves keyboard focus to enabled sibling')
    for _ in range(4):p.keyboard.press('Enter')
    h.ok(focus_is(p,'[data-lens-focus="-1"]'),'right endpoint moves keyboard focus to enabled sibling')
    for _ in range(3):p.keyboard.press('Enter')
    click(p,'hear');spoken=p.locator('[data-lens-hear]').get_attribute('data-speak') or ''
    h.ok('Focus: Soft' in spoken and 'Use the arrows' not in spoken and 'Choose an objective' not in spoken,'Hear includes settings and excludes practice control instructions')
    p.locator('[data-lens-pan="left"]').tap()
    p.locator('[data-lens-objective="o10"]').focus();p.keyboard.press('Enter')
    h.ok(focus_is(p,'[data-lens-objective="o10"]'),'objective keyboard action preserves control focus')
    click(p,'focus',1);click(p,'pin');click(p,'objective','o40')
    h.ok('400× total' in p.locator('[data-lens-root]').inner_text(),'eyepiece times objective is visible')
    turn(p,1)
    h.ok('100× total' in p.locator('[data-lens-root]').inner_text() and '400× total' in p.locator('[data-lens-root]').inner_text(),'comparison distinguishes frozen pin and current products')
    turn(p,0);click(p,'objective','o4')
    geometry(p)
    relative_blur(p)
    # Help is an independent worked view, never applied to the learner draft.
    p.locator('[data-lens-help] summary').click();click(p,'example');click(p,'example')
    turn(p,2)
    h.ok(not p.locator('[data-lens-root] img').count(),'photograph requires explicit exposure')
    click(p,'photo');photo_geometry(p)
    h.ok(not p.locator('[data-lens-objective],[data-lens-focus],[data-lens-field]').count(),'photograph has independent digital controls and rectangle')
    click(p,'photo-zoom',4);click(p,'photo-pan','right');photo_geometry(p,4,.5625,.5)
    p.screenshot(path=str(OUT/'tablet-photo.png'),full_page=True)
    h.ok(h.book(p)==before,'settings, pin, help and photograph exploration do not write notebook')
    click(p,'hear');h.ok(p.locator('.speech-controls').is_visible(),'real Hear opens native speech controls')
    spoken=p.locator('[data-lens-hear]').get_attribute('data-speak') or ''
    h.ok('Digital enlargement' in spoken and 'Enlarge the recorded pixels' not in spoken,'photo Hear reads caption and excludes photo control instructions')
    stale=p.locator('[data-lens-keep]').element_handle();click(p,'keep');dispatch(stale)
    first=copy.deepcopy(records(p)[0]);work=first['work']
    h.ok(len(records(p))==1 and work['photoShown'] and work['exampleSeen']>0 and work['pin'] is not None,'Keep freezes disclosures and own pin once')
    h.ok(work['pin']['objectiveId']=='o10' and work['view']['objectiveId']=='o4' and work['view']['focusId']=='f2','help and current controls leave pinned settings unchanged')
    near([work['photoView']['zoom'],work['photoView']['x'],work['photoView']['y']],[4,.5625,.5],'kept digital crop retains independent settings')
    h.ok({k:v for k,v in h.book(p).items() if k!='lensViews'}==before,'Keep changes only owned collection')
    click(p,'copy');turn(p,0);click(p,'pan','right');choose(p,'scattered');click(p,'objective','o10')
    choose(p,'crossed');turn(p,0);h.ok('40× total' in p.locator('[data-lens-root]').inner_text(),'current-case draft is separate from kept copy')
    click(p,'shelf');click(p,'card',first['id']);click(p,'copy');turn(p,0)
    click(p,'keep');second=records(p)[-1]
    h.ok(second['work']['view']['center']!=first['work']['view']['center'] and records(p)[0]==first,'returning copy resumes edited slot without mutating original')
    exported=native.download(p,base,'tablet-export')
    h.ok(exported['lensViews']==records(p) and exported['syntheticOther']==before['syntheticOther'],'actual Notes exports frozen records and unknown sibling')
    historical_transfer(browser,base,f,exported,first)
    boundaries(browser,base,f,exported)
    cells(browser,base,f,first)
    for width in [320,1024]:
        _,sample=native.setup(browser,f['base'],f'width-{width}',width=width);enter(sample,base);bounds(sample)
        if width==320:
            for label in ['0','2']:
                rows=sample.locator('[data-lens-turn="'+label+'"]').evaluate('e=>{const r=document.createRange();r.selectNodeContents(e);return [...new Set([...r.getClientRects()].map(x=>Math.round(x.y)))].length}')
                h.ok(rows==1,'single-word phone turn label remains on one line')
        click(sample,'pin');turn(sample,1);bounds(sample);turn(sample,2);click(sample,'photo');bounds(sample)
        sample.screenshot(path=str(OUT/f'width-{width}.png'),full_page=True)
    unseen=copy.deepcopy(f['base']);unseen['garden']['welcomeFilmSeen']=False
    _,fresh=native.setup(browser,unseen,'fresh-deep-link');enter(fresh,base)
    h.ok(not fresh.locator('[data-film-root],.welcome-film').count() and h.book(fresh)['garden']['welcomeFilmSeen'] is False,'unseen welcome deep link remains in Lens Bench without marking film')
    # Captured controls must reject reparenting, route exit and stale owner slots.
    action=fresh.locator('[data-lens-pan="left"]').element_handle();speech=fresh.locator('[data-lens-hear]').element_handle()
    speech.evaluate('e=>{e.dataset.speak="Captured sentinel";document.body.append(e)}');dispatch(speech)
    h.ok(speech.get_attribute('data-speak')=='Captured sentinel','connected reparented speech does not acquire room narration')
    field=fresh.locator('[data-lens-field]').element_handle();point=field.evaluate('e=>{const p=new DOMPoint(250,200).matrixTransform(e.getScreenCTM());return {x:p.x,y:p.y}}')
    field.evaluate('e=>document.body.append(e)')
    field.evaluate('(e,p)=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,clientX:p.x,clientY:p.y}))',point)
    action.evaluate('e=>document.body.append(e)');dispatch(action)
    field.evaluate('e=>document.querySelector("[data-lens-root]").append(e)')
    action.evaluate('e=>document.querySelector("[data-lens-root]").append(e)')
    click(fresh,'keep');near([records(fresh)[0]['work']['view']['center']['x'],records(fresh)[0]['work']['view']['center']['y']],[200,200],'connected reparented pointer and pan controls cannot alter draft')
    h.go(fresh,base,'#science','main');old=h.book(fresh);dispatch(action)
    h.ok(h.book(fresh)==old,'route-exited action cannot write old notebook')
    h.ok(fresh.locator('a[href="'+ROUTE+'"]').count()==1,'Water Lab has one deliberate More rooms entry')


def historical_transfer(browser,base,f,exported,first):
    mixed=copy.deepcopy(exported);dupe=copy.deepcopy(first);dupe['id']='lens-view-5'
    cards=[first,{'id':'lens-view-070','v':99},dupe,copy.deepcopy(dupe),f['historical'],*f['extremes']]
    for n in range(90,99):
        card=copy.deepcopy(first);card['id']='lens-view-'+str(n);cards.append(card)
    cards.append({'id':'lens-view-900','v':99,'raw':'Invented unavailable view'});mixed['lensViews']=cards
    _,q=native.setup(browser,f['base'],'transfer');enter(q,base);original_id,original_book=h.active(q),h.book(q)
    h.go(q,base,'#notes','#progress-file')
    q.locator('#progress-file').set_input_files({'name':'invented-lens.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
    q.locator('#progress-import-confirm').wait_for();h.ok('Lens Bench views' in q.locator('.import-preview').inner_text(),'actual Notes preview names Lens owner')
    h.click(q,'#progress-import-confirm');h.ok(h.active(q)!=original_id,'actual import creates second explorer')
    enter(q,base);reload(q);click(q,'shelf')
    h.ok('9–16 of 17' in q.locator('[data-lens-root]').inner_text(),'shelf defaults to last readable raw page')
    click(q,'page',1);h.ok('17–17 of 17' in q.locator('[data-lens-root]').inner_text() and not q.locator('[data-lens-card]').count(),'unknown final raw record retains page')
    click(q,'page',-1);click(q,'page',-1)
    h.ok(not q.locator('[data-lens-card="lens-view-5"]').count(),'duplicate canonical ids unavailable without compression')
    click(q,'card','lens-view-80');turn(q,0)
    h.ok('Earlier <field> & powers' in q.locator('[data-lens-root]').inner_text() and '140× total' in q.locator('[data-lens-root]').inner_text(),'history uses own escaped title and numeric product')
    click(q,'copy');geometry(q,historical=True);turn(q,2)
    h.ok(not q.locator('[data-lens-root] img').count(),'historical unopened photo stays undisclosed')
    click(q,'photo');h.ok(q.locator('[data-lens-photo-zoom]').count()==3 and q.locator('[data-lens-photo-zoom="8"]').count()==1,'historical own zoom list preserved')
    click(q,'photo-zoom',8);photo_geometry(q,8,.5,.5);click(q,'keep')
    newest=records(q)[-1]
    h.ok(newest['id']=='lens-view-901' and newest['source']==f['historical']['source'] and newest['work']['futureWork']=={'kept':True} and 'futureOuter' not in newest,'copy reserves raw canonical IDs and keeps source/work unknowns only')
    for i,sigma in enumerate([200,200.01]):
        click(q,'shelf')
        while not q.locator('[data-lens-card="lens-view-'+str(81+i)+'"]').count():click(q,'page',-1)
        click(q,'card','lens-view-'+str(81+i));turn(q,0)
        if i==0:
            filt=q.locator('.lens-workspace svg filter');h.ok(filt.count()==1,'sigma200 remains rendered')
            h.ok(filt.get_attribute('filterUnits')=='userSpaceOnUse' and all(float(filt.get_attribute(k))==v for k,v in [('x',0),('y',0),('width',400),('height',400)]),'extreme blur uses bounded fixed user-space region')
        else:h.ok('Blur exceeds this model' in q.locator('[data-lens-root]').inner_text() and not q.locator('.lens-workspace svg filter').count(),'sigma above200 is honest bounded placeholder')
    downloaded=native.download(q,base,'imported-redownload')
    h.ok(downloaded['lensViews'][:-1]==cards and downloaded['syntheticOther']==mixed['syntheticOther'],'actual reload/redownload preserves malformed/history/unknown raw records unchanged')
    enter(q,base);h.click(q,'#explorer-switch');h.click(q,f'[data-select-explorer="{original_id}"]');q.locator('[data-lens-root]').wait_for()
    h.ok(h.book(q)==original_book,'second explorer transfer leaves original notebook exact')

    _,unavailable=native.setup(browser,f['base'],'unavailable-card-harness');enter(unavailable,base)
    unavailable.evaluate('''async seed=>{const ui=await import('./lens-bench-ui.mjs');const book=structuredClone(seed),owner='invented-unavailable';const mount=document.querySelector('main');const render=()=>{mount.innerHTML=ui.lensBenchPage(book,owner);ui.bindLensBench(book,{explorerId:()=>owner,notebook:()=>book,isActive:()=>true,save:()=>({enabled:true,ok:true}),canExport:()=>true,render,focus:s=>document.querySelector(s)?.focus()});};window.lensHarness={book,render};render();}''',dict(f['base'],lensViews=[first]))
    click(unavailable,'shelf');click(unavailable,'card',first['id'])
    unavailable.evaluate('()=>{window.lensHarness.book.lensViews[0].work={v:99};window.lensHarness.render()}')
    h.ok('unavailable' in unavailable.locator('#lens-title').inner_text().lower() and not unavailable.locator('[data-lens-copy]').count(),'an open record becoming unreadable removes copy')
    click(unavailable,'hear');click(unavailable,'shelf');click(unavailable,'draft');choose(unavailable,'scattered')
    h.ok(unavailable.locator('[data-lens-turn]').count()==3,'unavailable saved view retains Hear/shelf/draft/case navigation')


def boundaries(browser,base,f,exported):
    for name,owner in [('unsupported',{'v':99}),('exhausted',[{'id':'lens-view-999999','v':99}])]:
        seed=copy.deepcopy(f['base']);seed['lensViews']=owner
        _,p=native.setup(browser,seed,name);enter(p,base);click(p,'pan','left');old=h.book(p)
        if p.locator('[data-lens-keep]').is_enabled():click(p,'keep')
        h.ok(h.book(p)==old,name+' owner remains exact')
        click(p,'shelf');h.ok('Keep a practice view to leave it here' not in p.locator('[data-lens-root]').inner_text(),name+' shelf makes no blocked Keep promise');click(p,'hear');click(p,'draft');h.ok(p.locator('[data-lens-turn]').count()==3,name+' retains Hear/shelf/fresh navigation')
    wrapper={k:v for k,v in exported.items() if k in ['title','exportedAt','note','explorer','recommendation']}
    probe=copy.deepcopy(exported)
    seed={k:v for k,v in probe.items() if k not in wrapper}
    # Compute only a synthetic candidate size. The action under test still calls
    # the real app's Notes preflight, with no intercepted callback.
    sizing=browser.new_page()
    sizing.goto(base,wait_until='domcontentloaded')
    sized=sizing.evaluate('''async ({seed,wrapper,cap})=>{const {lensSource,newLensWork,changeLensWork,keepLensView}=await import('./lens-bench-core.mjs');seed.syntheticOther.payload='';const s=lensSource('crossed'),w=changeLensWork(s,newLensWork(s),'pan','left'),candidate=structuredClone(seed);if(!keepLensView(candidate,s,w,{canExport:()=>true}))throw Error('Sizing candidate refused');const bytes=x=>new TextEncoder().encode(JSON.stringify(x,null,2)).length,pad=cap-bytes(candidate)-64;seed.syntheticOther.payload='x'.repeat(pad);candidate.syntheticOther.payload=seed.syntheticOther.payload;return {seed,stored:bytes(candidate),report:bytes({...wrapper,...candidate})};}''',{'seed':seed,'wrapper':wrapper,'cap':f['maxImportBytes']})
    sizing.close();seed=sized['seed']
    h.ok(sized['stored']<=f['maxImportBytes']<sized['report'],'refusal candidate fits raw notebook but exceeds actual report wrapper cap')
    _,p=native.setup(browser,seed,'report-wrapper-refusal');enter(p,base);click(p,'pan','left');old=h.book(p);click(p,'keep')
    h.ok(h.book(p)==old and focus_is(p,'#lens-status'),'real Notes report wrapper refuses Keep atomically and focuses recovery')
    for fault in ['quota','saving-off']:
        _,p=native.setup(browser,f['base'],fault)
        if fault=='saving-off':
            h.go(p,base,'#notes','#remember');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-lens-root]').wait_for()
        else:enter(p,base)
        if fault=='quota':p.evaluate("()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Invented quota fault','QuotaExceededError');return native.call(this,k,v)}}")
        click(p,'keep');status=p.locator('#lens-status').inner_text()
        h.ok('Download' in status and ('session' in status or 'open page' in status),fault+' Keep truthfully reports memory and recovery')
        recovered=native.download(p,base,fault+'-memory-export');h.ok(len(recovered['lensViews'])==1,fault+' same-page actual Notes download recovers kept memory')


def cells(browser,base,f,first):
    for shown in [False,True]:
        seed=copy.deepcopy(f['base']);card=copy.deepcopy(first);card['work']['photoShown']=shown;seed['lensViews']=[card]
        _,p=native.setup(browser,seed,'cell-photo-'+str(shown));h.go(p,base,'#living/bodies','[data-cs-enter]')
        for full in [False,True]:
            if full:h.click(p,'[data-cs-enter]');p.locator('[data-cs-root]').wait_for()
            old=h.book(p);fold=p.locator('[data-lens-cell-return]')
            if fold.get_attribute('open') is None:fold.locator('summary').click()
            text=fold.inner_text();h.ok('View 1' in text and first['source']['notice'] in text and first['source']['returnQuestion'] in text,'Cell return uses frozen record and model limit in '+str(full))
            h.ok((fold.locator('img').count()>0)==shown and (first['source']['photoQuestion'] in text)==shown,'Cell return photograph and question follow saved exposure only')
            if shown:photo_geometry(p,card['work']['photoView']['zoom'],card['work']['photoView']['x'],card['work']['photoView']['y'])
            h.ok(h.book(p)==old and 'cellModels' not in old,'opening Cell return never saves unkept illustration or unrelated state')
            anchor=fold.locator('a[href="'+ROUTE+'"]').element_handle();anchor.evaluate('e=>document.body.append(e)');dispatch(anchor)
            h.ok(p.evaluate('location.hash')=='#living/bodies' and h.book(p)==old,'connected reparented Cell link rejected in '+str(full))


def main():
    f=fixtures();server=None;base=os.environ.get('LENS_TEST_URL')
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
            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'scope':'820 touch/keyboard journey;320/1024 samples; independent projection/crop arithmetic; actual Notes/two explorers; separate quota/off/report refusal. PHYSICAL qualification untested.'},indent=2))
            print(f'Lens Bench browser: {h.checks} assertions passed; artifacts {OUT}')
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
