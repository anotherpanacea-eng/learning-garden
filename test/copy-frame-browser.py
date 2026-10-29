"""Synthetic native Chrome probes for Copy Frame295.
Actual material, lifecycle and interface journeys; synthetic notebooks only.
No physical iPad/Safari, audible output, screen-reader or learning-effect proof.
"""
import functools
from fractions import Fraction
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CFRAME_ARTIFACTS',tempfile.mkdtemp(prefix='copy-frame-')))
OUT.mkdir(parents=True,exist_ok=True)
checks=0
errors=[]
pages=[]
def ok(value,message):
    global checks
    assert value,message
    checks+=1
def action(p,name):p.locator(f'[data-cframe-action="{name}"]').tap()
def saved(p):return p.evaluate('()=>{const id=JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId;return JSON.parse(localStorage.getItem("number-garden-v1:"+id));}')
def measures(p):
    return p.locator('.cframe-figure svg').evaluate('s=>{const box=q=>{const b=s.querySelector(q).getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height};};return {unit:box("[data-cframe-unit]"),square:box("[data-cframe-square]"),original:box("[data-cframe-original]"),copy:box("[data-cframe-copy]"),cells:[...s.querySelectorAll("[data-cframe-cell]")].map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height};}),panels:[...s.querySelectorAll("[data-cframe-panel]")].map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height};})};}')
def dims(p):
    m=measures(p);return [round(m['copy']['width']/m['unit']['width']),round(m['copy']['height']/m['unit']['width'])]
def setdims(p,w,h):
    for side,target,index in [('width',w,0),('height',h,1)]:
        current=dims(p)[index]
        for _ in range(abs(target-current)):action(p,side+('-more' if target>current else '-less'))
    ok(dims(p)==[w,h],'native side actions construct requested dimensions')
def geometry(p,a,b,w,h,tiles=False):
    m=measures(p);u=m['unit']['width']
    for n,expect in [('original',(a,b)),('copy',(w,h))]:
        ok(abs(m[n]['width']/u-expect[0])<.01 and abs(m[n]['height']/u-expect[1])<.01,'drawn '+n+' uses same length scale')
    ok(abs(m['square']['width']-u)<.2 and abs(m['square']['height']-u)<.2,'square unit and length segment have equal edges')
    ok(abs(m['original']['x']-m['copy']['x'])<.2 and abs(m['original']['y']+m['original']['height']-m['copy']['y']-m['copy']['height'])<.2,'panels share their lower-left corner')
    ok(p.locator('[data-cframe-original]').evaluate('e=>[...e.parentNode.querySelectorAll("[data-cframe-copy],[data-cframe-cell]")].every(x=>e.compareDocumentPosition(x)&Node.DOCUMENT_POSITION_PRECEDING)'),'original outline drawn after every copy material element')
    unit=lambda n:f'{n} length unit'+('' if n==1 else 's')
    original=p.locator('.cframe-refs p').nth(0).inner_text();current=p.locator('.cframe-refs p').nth(1).inner_text()
    ok(f'width {unit(a)}' in original and f'height {unit(b)}' in original,'HTML original reference matches drawn original')
    ok(f'width {unit(w)}' in current and f'height {unit(h)}' in current,'HTML copy reference matches drawn current dimensions')
    ok(len(m['cells'])==(w*h if tiles else 0),'actual unit-square count')
    if tiles:
        occupied=set()
        for cell in m['cells']:
            ok(abs(cell['width']-u)<.2 and abs(cell['height']-u)<.2,'each cell has one-unit edges')
            x=(cell['x']-m['copy']['x'])/u;y=(cell['y']-m['copy']['y'])/u
            ok(abs(x-round(x))<.01 and abs(y-round(y))<.01,'cell aligned on unit grid')
            occupied.add((round(x),round(y)))
        ok(occupied=={(x,y) for x in range(w) for y in range(h)},'drawn cells are exact disjoint full cover')
    return m

def setup(browser,base,seed,width,height):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
    fixture={'registry':{'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-29T12:00:00.000Z'}]},'seed':seed}
    c.add_init_script('(d=>{if(!localStorage.getItem("cframe-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(d.seed));localStorage.setItem("cframe-fixture","1");}})('+json.dumps(fixture)+')')
    p=c.new_page();pages.append((p,str(width)));p.set_default_timeout(15000)
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    p.goto(base+'#workshop/copy-frame',wait_until='domcontentloaded');p.locator('[data-cframe-root]').wait_for()
    return c,p

def journey(browser,base,seed,width,height):
    c,p=setup(browser,base,seed,width,height);before=saved(p)
    ok(p.locator('dialog.welcome-film[open]').count()==0,'no unsolicited film')
    if width==820:
        boxes=[p.locator(s).bounding_box() for s in ['#cframe-title','.cframe-refs','[data-cframe-action="width-more"]','.cframe-figure svg']]
        ok(all(b['y']>=0 and b['y']+b['height']<=height for b in boxes),'first tablet screen has task, references, primary action and diagram')
        p.screenshot(path=str(OUT/'first-screen.png'))
    for id,a,b,w,h in [('small-panel',2,3,4,6),('long-panel',3,5,6,10),('half-panel',4,6,2,3),('square-panel',3,3,6,6),('small-square',6,6,3,3),('triple-panel',3,4,9,12)]:
        p.locator('[data-cframe-case]').select_option(id);geometry(p,a,b,a,b)
        action(p,'compare');ok('Same shape and same size.' in p.locator('.cframe-comparison').inner_text(),'unchanged original is factor-one same shape')
        setdims(p,w,h);ok(p.locator('.cframe-comparison').count()==0,'no automatic requested-match interpretation after edits')
        action(p,'tiles');geometry(p,a,b,w,h,True);action(p,'compare');ok('requested factor' in p.locator('.cframe-comparison').inner_text(),'explicit comparison describes matching target')
        action(p,'turn');geometry(p,a,b,h,w,True);ok(p.locator('.cframe-comparison').count()==0,'turn closes supplied interpretation')
        action(p,'compare');text=p.locator('.cframe-comparison').inner_text();ok('requested factor' in text,'turned copy equally valid')
        ok(('The copy is turned.' in text)==(a!=b),'turned correspondence explicit for non-square targets')
        row=p.locator('.cframe-comparison tbody tr').first;ok(row.locator('th').inner_text()==('width to height' if a!=b else 'width to width'),'table names actual corresponding sides')
        values=row.locator('td').all_inner_texts();ok(values[0].startswith(str(a)+' length') and values[1].startswith(str(w)+' length') and values[2]=='×'+str(Fraction(w,a)),'table uses original-to-copy factor in turned and direct modes')
        if a==b:ok('added or taken away' in text,'square note does not assume addition history')
        ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no case overflow')
        p.screenshot(path=str(OUT/f'{width}-{id}.png'),full_page=True)
    # A non-square equal addition and the square exception are both genuine discoveries.
    p.locator('[data-cframe-case]').select_option('long-panel');setdims(p,6,8);action(p,'compare');ok('another shape' in p.locator('.cframe-comparison').inner_text(),'equal addition to non-square changes shape')
    p.locator('[data-cframe-case]').select_option('square-panel');setdims(p,4,4);action(p,'compare');ok('factor 4/3' in p.locator('.cframe-comparison').inner_text(),'square equal addition retains shape at another exact factor')
    # All144 cells fit at the domain limit.
    setdims(p,12,12);geometry(p,3,3,12,12,True)
    material=dims(p);action(p,'compare');action(p,'example')
    ratios=[]
    for index,(w,h) in enumerate([(2,3),(2,6),(4,6),(3,4)]):
        ok(f'picture {index+1} of 4' in p.locator('[data-cframe-view="example"]').inner_text(),'worked picture numbers one-based')
        m=geometry(p,2,3,w,h,True);ratios.append(min(w,h)/max(w,h))
        ok(len(m['panels'])==(4 if index==2 else 0),'four original-sized panels only in displayed picture3')
        if index==2:
            u=m['unit']['width'];occupied=set()
            for panel in m['panels']:
                ok(abs(panel['width']/u-2)<.01 and abs(panel['height']/u-3)<.01,'each outlined example panel has original dimensions')
                x=round((panel['x']-m['copy']['x'])/u);y=round((panel['y']-m['copy']['y'])/u)
                cells={(i,j) for i in range(x,x+2) for j in range(y,y+3)};ok(not cells&occupied,'outlined panels do not overlap');occupied|=cells
            ok(occupied=={(x,y) for x in range(4) for y in range(6)},'four original-sized panels exactly tile the copy')
        for control in p.locator('[data-cframe-root] button,[data-cframe-root] select,[data-cframe-root] summary').all():
            if control.is_visible():ok(control.bounding_box()['height']>=43.9,'worked native target at least44px')
        ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'worked example has no overflow')
        if index<3:action(p,'next')
    ok(ratios[1]!=ratios[3],'worked equal-area pair really has different shapes')
    action(p,'close');ok(dims(p)==material,'worked example preserves actual copy');ok(p.locator('.cframe-comparison').count()==1,'worked example preserves open comparison')
    ok(saved(p)==before,'all material/read/help actions preserve actual notebook')
    for control in p.locator('[data-cframe-root] button,[data-cframe-root] select,[data-cframe-root] summary').all():
        if control.is_visible():ok(control.bounding_box()['height']>=43.9,'live native target at least44px')
    c.close()

check=ok
click=action
CONTEXTS=[]
PAGES=[]
FAULTS=[]
def active_id(p):return p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
def saved(p,owner=None):
    owner=owner or active_id(p)
    return p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',owner)
def choose_initial(p):
    p.locator('#explorer-header').wait_for()
    q=p.locator('[data-select-explorer="explorer-1"]')
    if q.count():q.tap()
    p.locator('[data-cframe-root]').wait_for()
def release_setup(browser,base,seed,label,second=False,mode=None):
    c=browser.new_context(viewport={'width':820,'height':1180},has_touch=True,reduced_motion='reduce',accept_downloads=True)
    CONTEXTS.append(c)
    profiles=[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-28T12:00:00.000Z'}]
    if second:profiles.append({'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-10-28T12:00:00.000Z'})
    fixture={'registry':{'version':1,'activeId':'explorer-1','explorers':profiles},'seed':seed,'second':second,'mode':mode}
    c.add_init_script('(data=>{if(!localStorage.getItem("cframe-release-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(data.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(data.seed));if(data.second)localStorage.setItem("number-garden-v1:explorer-2",JSON.stringify(data.seed));if(data.mode==="off")localStorage.setItem("number-garden-save","off");localStorage.setItem("cframe-release-fixture","1");}if(data.mode==="failure"){const old=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith("number-garden")||k==="learning-garden-explorers")throw new DOMException("Synthetic storage failure","QuotaExceededError");return old.call(this,k,v);};}})('+json.dumps(fixture)+')')
    c.add_init_script('window.cframeSpeech=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{cframeSpeech.push(u.text);return native(u);};}')
    p=c.new_page();PAGES.append((p,label));p.set_default_timeout(15000)
    p.on('pageerror',lambda e:FAULTS.append({'case':label,'error':str(e)}))
    p.on('console',lambda m:FAULTS.append({'case':label,'error':m.text}) if m.type=='error' else None)
    p.on('response',lambda r:FAULTS.append({'case':label,'status':r.status,'url':r.url}) if r.status>=400 else None)
    p.goto(base+'#workshop/copy-frame',wait_until='domcontentloaded');choose_initial(p)
    return p

def route(p,path):p.evaluate('(path)=>location.hash=path',path)
def board(p):p.locator('[data-cframe-root]').wait_for()
def stash(p):p.evaluate('window.cframeOld=[...document.querySelectorAll("[data-cframe-action],[data-cframe-case],[data-cframe-root] [data-speak],summary")]')
def invoke_old(p):
    count=p.evaluate('cframeSpeech.length');before=saved(p)
    check(p.evaluate('cframeOld.every(e=>!e.isConnected)'),'actual old controls are detached')
    p.evaluate('cframeOld.forEach(e=>{if(e.matches("select")){e.value="long-panel";e.dispatchEvent(new Event("change",{bubbles:true}));}else e.click();})')
    check(saved(p)==before,'stale controls preserve notebook');check(p.evaluate('cframeSpeech.length')==count,'stale Hear is inert')
def export(p,name):
    route(p,'#notes');p.locator('#download').wait_for()
    with p.expect_download() as d:p.locator('#download').tap()
    path=OUT/(name+'.json');d.value.save_as(path)
    return json.loads(path.read_text())
def file_input(p,report):
    p.locator('#progress-file').set_input_files({'name':'synthetic-cframe.json','mimeType':'application/json','buffer':json.dumps(report).encode()})


def lifecycle(browser,base,seed):
    p=release_setup(browser,base,seed,'lifecycle',True);first=saved(p,'explorer-1');second=saved(p,'explorer-2')
    action(p,'width-more');stash(p);p.locator('[data-cframe-case]').select_option('long-panel');invoke_old(p);ok(dims(p)==[3,5],'stale case actions preserve current panel');action(p,'width-more');ok(dims(p)==[4,5],'current side action after stale case callbacks');p.locator('[data-cframe-case]').select_option('small-panel');ok(dims(p)==[3,3],'former case retained exactly')
    action(p,'reset');stash(p);action(p,'height-more');invoke_old(p);ok(dims(p)==[2,4],'stale material callbacks inert');action(p,'width-more');ok(dims(p)==[3,4],'legitimate action sees actual current material')
    stash(p);before=saved(p);proof=p.evaluate('()=>{const root=document.querySelector("[data-cframe-root]"),count=cframeSpeech.length;location.hash="#notes";cframeOld.forEach(e=>e.click());return {connected:root.isConnected&&document.querySelector("[data-cframe-root]")===root,speech:cframeSpeech.length===count};}')
    ok(proof['connected'] and proof['speech'],'same-tick departed controls neither rerender nor speak');p.locator('#download').wait_for();ok(saved(p)==before,'same-tick departure preserves notebook')
    route(p,'#workshop/copy-frame');board(p);ok(dims(p)==[2,3],'ordinary departure clears transient copy');action(p,'width-more');p.evaluate('()=>{location.hash="#numbers";location.hash="#workshop/copy-frame";}');p.wait_for_function('document.querySelector("[data-cframe-original]")&&document.querySelector("[data-cframe-copy]").getAttribute("width")===document.querySelector("[data-cframe-original]").getAttribute("width")');ok(dims(p)==[2,3],'same-tick away/back clears through oldURL')
    action(p,'width-more');stash(p);p.locator('#explorer-switch').tap();ok(p.locator('[data-cframe-root]').count()==0,'explorer chooser has no material board');p.locator('#explorer-cancel').tap();board(p);invoke_old(p);ok(dims(p)==[2,3],'chooser cancellation starts fresh visit');action(p,'height-more');ok(dims(p)==[2,4],'usable current action after stale chooser callbacks')
    stash(p);p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();board(p);invoke_old(p);ok(dims(p)==[2,3],'new explorer gets fresh material');action(p,'width-more');ok(dims(p)==[3,3],'second explorer actually explores');ok(saved(p,'explorer-1')==first,'first explorer retained');ok(saved(p,'explorer-2')['sentinel']==second['sentinel'],'second unrelated content retained')
    stash(p);report=export(p,'transfer');ok(report['copyFrame']==seed['copyFrame'] and report['sentinel']==seed['sentinel'],'real download retains unknown future data');source=active_id(p);before=saved(p)
    file_input(p,{'not':'a notebook'});p.locator('#progress-import-status').filter(has_text='not supported').wait_for();ok(saved(p)==before,'failed import preserves source');route(p,'#workshop/copy-frame');board(p);invoke_old(p);ok(dims(p)==[2,3],'failed import journey returns fresh board');action(p,'width-more')
    route(p,'#notes');file_input(p,report);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-cancel').tap();ok(saved(p)==before,'cancelled valid import preserves source');route(p,'#workshop/copy-frame');board(p);ok(dims(p)==[2,3],'cancelled import journey leaves no old copy')
    action(p,'width-more');stash(p);route(p,'#notes');file_input(p,report);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();newid=active_id(p);ok(newid!=source,'successful import creates separate explorer');ok(saved(p,source)==before,'successful import retains source explorer');route(p,'#workshop/copy-frame');board(p);invoke_old(p);ok(dims(p)==[2,3],'imported explorer gets fresh copy');action(p,'height-more');ok(dims(p)==[2,4],'current imported visit works after stale callbacks');again=export(p,'redownload');ok(again['copyFrame']==report['copyFrame'] and again['sentinel']==report['sentinel'],'literal redownload retains imported unknown data')
    p.reload();p.locator('#explorer-header').wait_for();choice=p.locator(f'[data-select-explorer="{newid}"]')
    if choice.count():choice.tap()
    route(p,'#workshop/copy-frame');board(p);ok(dims(p)==[2,3],'persistent reload starts fresh material');ok(saved(p)['copyFrame']==report['copyFrame'],'persistent reload retains unknown imported field')
    action(p,'width-more');stash(p);route(p,'#notes');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');film=p.locator('dialog.welcome-film[open]')
    if film.count():film.locator('[data-film-skip]').tap()
    route(p,'#workshop/copy-frame');board(p);invoke_old(p);ok(dims(p)==[2,3],'reset journey invalidates old material');action(p,'height-more');ok(dims(p)==[2,4],'fresh reset board plays');ok(saved(p,'explorer-1')==first,'reset preserves other explorer')

def interfaces(browser,base,seed):
    p=release_setup(browser,base,seed,'interfaces');before=saved(p);ok(p.evaluate('cframeSpeech.length')==0,'no unsolicited narration')
    cdp=p.context.new_cdp_session(p);obj=cdp.send('Runtime.evaluate',{'expression':'document.querySelector(".cframe-status")'})['result']['objectId'];ax=cdp.send('Accessibility.getPartialAXTree',{'objectId':obj,'fetchRelatives':False})['nodes'][0];ok(not ax['ignored'] and ax['role']['value']=='status','empty status exposed to Chrome accessibility tree')
    p.locator('[data-cframe-action="width-more"]').focus();p.keyboard.press('Enter');p.locator('[data-cframe-action="height-more"]').focus();p.keyboard.press('Space');ok(dims(p)==[3,4],'native Enter and Space change real panel')
    action(p,'compare');ok(p.locator('.cframe-comparison').evaluate('e=>e===document.activeElement'),'Compare focuses newly supplied interpretation');hear=p.locator('[data-cframe-root] [data-speak]');hear.tap();text=hear.get_attribute('data-speak');ok('another shape' in text and text.count('Make the matching lengths twice as long.')==1,'first Hear has current task and interpretation once');ok('Worked example, picture' not in text,'hidden worked text absent from live Hear')
    voices=p.evaluate('speechSynthesis.getVoices().filter(v=>v.localService&&/^en(?:[-_]|$)/i.test(v.lang)).length')
    if voices:p.wait_for_function('cframeSpeech.length===1');ok('another shape' in p.evaluate('cframeSpeech[0]'),'native local speech request uses current interpretation')
    else:ok(p.evaluate('cframeSpeech.length')==0,'no remote substitute for unavailable local voice')
    action(p,'tiles');ok(p.locator('.cframe-comparison').count()==1,'area-square view preserves comparison');p.locator('[data-cframe-case]').select_option('long-panel');p.locator('[data-cframe-case]').select_option('small-panel');ok(dims(p)==[3,4] and p.locator('.cframe-comparison').count()==1,'case switch preserves dimensions and open support')
    stash(p);action(p,'example');invoke_old(p);ok(dims(p)==[2,3],'old live actions cannot mutate example');action(p,'next');stash(p);action(p,'next');invoke_old(p);ok(dims(p)==[4,6],'earlier worked-frame actions inert');action(p,'next');ok(p.locator('[data-cframe-action="previous"]').evaluate('e=>e===document.activeElement'),'last frame focuses Previous');action(p,'previous');action(p,'previous');action(p,'previous');ok(p.locator('[data-cframe-action="next"]').evaluate('e=>e===document.activeElement'),'first frame focuses Next')
    action(p,'close');ok(dims(p)==[3,4],'example leaves live material intact');ok(p.locator('[data-cframe-action="example"]').evaluate('e=>e===document.activeElement'),'example closes to its opener');action(p,'example');action(p,'next');p.locator('[data-cframe-case]').select_option('long-panel');ok(p.locator('[data-cframe-view="live"]').count()==1,'case choice closes example');action(p,'example');ok('picture 1 of 4' in p.locator('[data-cframe-view="example"]').inner_text(),'reopening example starts at first picture');action(p,'close')
    setdims(p,1,12);ok(p.locator('[data-cframe-action="width-less"]').is_disabled() and p.locator('[data-cframe-action="height-more"]').is_disabled(),'board bounds disable unavailable directions');ok(p.locator('[data-cframe-action="height-less"]').evaluate('e=>e===document.activeElement'),'upper bound focuses usable opposite direction');ok(p.locator('[data-cframe-action="width-less"]').get_attribute('aria-describedby')=='cframe-limits','boundary direction linked to finite-board explanation')
    action(p,'compare');action(p,'turn');ok(p.locator('.cframe-comparison').count()==0,'turn closes supplied comparison');action(p,'compare');action(p,'reset');ok(p.locator('.cframe-comparison').count()==0,'Reset closes supplied comparison');ok(p.locator('[data-cframe-action="reset"]').evaluate('e=>e===document.activeElement'),'Reset retains enabled focus')
    p.evaluate('window.cframeAnnouncements=[];new MutationObserver(ms=>{for(const m of ms)if(m.target.matches?.(".cframe-status")&&m.target.isConnected)cframeAnnouncements.push(m.target.textContent);}).observe(document.querySelector("main"),{subtree:true,childList:true,characterData:true})');action(p,'width-more');p.locator('.cframe-status').filter(has_text='Width is now').wait_for();ok(p.evaluate('cframeAnnouncements.some(s=>s.startsWith("Width is now"))'),'specific announcement mutates connected region');p.locator('[data-cframe-case]').select_option('small-panel');ok(p.locator('.cframe-status').inner_text()=='','prior announcement does not replay after case choice');ok(saved(p)==before,'interface actions write no notebook')
    for width,height in [(320,800),(820,1180),(1024,768)]:
        c,q=setup(browser,base,seed,width,height);b=q.locator('[data-cframe-action="width-more"]');b.scroll_into_view_if_needed();box=b.bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2;scroll=q.evaluate('scrollY')
        for expected in range(3,13):
            q.touchscreen.tap(x,y);q.wait_for_function('(expected)=>Math.round(document.querySelector("[data-cframe-copy]").getBoundingClientRect().width/document.querySelector("[data-cframe-unit]").getBoundingClientRect().width)===expected',arg=expected);now=q.locator('[data-cframe-action="width-more"]').bounding_box();ok(abs(now['x']-box['x'])<.5 and abs(now['y']+q.evaluate('scrollY')-box['y']-scroll)<.5,'stable primary shelf document position');ok(expected==12 or abs(now['y']-box['y'])<.5,'repeated available tap stays at same screen coordinate')
        ok(q.locator('[data-cframe-action="width-less"]').evaluate('e=>e===document.activeElement'),'last grow focuses enabled shrink');ok(q.evaluate('document.documentElement.scrollWidth<=innerWidth'),'wide material preserves narrow layout');c.close()
    for mode in ['off','failure']:
        q=release_setup(browser,base,seed,'storage-'+mode,mode=mode);before=saved(q);action(q,'width-more');action(q,'compare');ok(dims(q)==[3,3],'material works with storage '+mode);ok(saved(q)==before,'material makes no persistence write in '+mode);report=export(q,'storage-'+mode);ok(report['version']==1,'actual temporary Notes export in '+mode)
        if mode=='failure':ok(report['copyFrame']==seed['copyFrame'],'failed writes preserve unknown source content')
    fresh=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';console.log(JSON.stringify(freshState()));"],cwd=ROOT,text=True));q=release_setup(browser,base,fresh,'uninitialized');now=saved(q);expected=json.loads(json.dumps(fresh));now.get('garden',{}).pop('avatar',None);expected.get('garden',{}).pop('avatar',None)
    if now.get('garden')=={} and 'garden' not in expected:now.pop('garden')
    ok(now==expected,'uninitialized entry creates no unrelated game');action(q,'width-more');ok('workshop' not in saved(q),'explicit material action creates no Workshop owner');ok(q.locator('dialog.welcome-film[open]').count()==0,'uninitialized direct entry plays no film')

def main():
    js="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.copyFrame={version:77,panels:'Unreadable future field'};s.sentinel={note:'Synthetic retained work'};console.log(JSON.stringify(s));"
    seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):
        request_queue_size=128
        daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('CFRAME_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
        try:
            parts=set(os.environ.get('CFRAME_TEST_PARTS','material,lifecycle,interfaces').split(','))
            if 'material' in parts:
                for width,height in [(820,1180),(1024,768),(320,800)]:journey(browser,base,seed,width,height)
            if 'lifecycle' in parts:lifecycle(browser,base,seed)
            if 'interfaces' in parts:interfaces(browser,base,seed)
            ok(not FAULTS,'no release page/http/console errors: '+json.dumps(FAULTS))
            ok(not errors,'no page/console errors: '+json.dumps(errors));result={'status':'passed','checks':checks,'parts':sorted(parts),'scope':[{'material':'six-case drawn material and units, turns/squares/addition,144cells, exact four-panel cover and all worked frames','lifecycle':'stale controls, synchronous departed controls, route/chooser/two explorers and actual Notes import/export/reset/reload; Notes departure is not isolated import-hook proof','interfaces':'native keyboard/focus, first Hear composition and local request when available, empty Chrome AX status, connected announcements, fixed-coordinate taps, storage off/failure and uninitialized entry'}[part] for part in sorted(parts)],'limits':'No physical iPad/Safari, audible output, screen-reader announcement or learning-effect proof'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
        except Exception:
            for p,label in pages+PAGES:
                try:p.screenshot(path=str(OUT/f'failure-{label}.png'),full_page=True)
                except Exception:pass
            raise
        finally:browser.close();server.shutdown()
if __name__=='__main__':main()
