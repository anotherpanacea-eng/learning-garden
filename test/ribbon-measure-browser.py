"""Synthetic native Chrome material and lifecycle probes for294.
No physical iPad/Safari, audible speech or learning-effect proof.
"""
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('RMEASURE_ARTIFACTS',tempfile.mkdtemp(prefix='ribbon-measures-')))
OUT.mkdir(parents=True,exist_ok=True)
checks=0
pages=[]
errors=[]
def ok(v,message):
    global checks
    assert v,message
    checks+=1
def action(p,name):p.locator(f'[data-rmeasure-action="{name}"]').tap()
def split(p,n):p.locator(f'[data-rmeasure-split="{n}"]').tap()
def qs(p):return p.locator('[data-rmeasure-laid]').evaluate_all('xs=>xs.map(e=>Number(e.dataset.q))')
def book(p):return p.evaluate('()=>{const id=JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId;return JSON.parse(localStorage.getItem("number-garden-v1:"+id));}')
def setup(browser,base,width,height,seed):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
    fixture={'registry':{'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-29T12:00:00.000Z'}]},'seed':seed}
    c.add_init_script('(data=>{if(!localStorage.getItem("rmeasure-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(data.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(data.seed));localStorage.setItem("rmeasure-fixture","1");}})('+json.dumps(fixture)+')')
    p=c.new_page();pages.append((p,str(width)));p.set_default_timeout(15000)
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    p.goto(base+'#workshop/ribbon-measures',wait_until='domcontentloaded');p.locator('[data-rmeasure-root]').wait_for()
    return c,p

def geometry(p,amount,group):
    actual=p.locator('.rmeasure-art').evaluate('s=>{const box=q=>{const r=s.querySelector(q).getBoundingClientRect();return {x:r.x,width:r.width};};return {unit:box("[data-rmeasure-unit]"),amount:box("[data-rmeasure-amount]"),group:box("[data-rmeasure-group]"),selected:box("[data-rmeasure-selected]"),q:s.querySelectorAll("[data-rmeasure-cut]").length+1,pieces:[...s.querySelectorAll("[data-rmeasure-laid]")].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,width:r.width,q:Number(e.dataset.q)};})};}')
    unit=actual['unit']['width']
    ok(abs(actual['amount']['width']/unit-amount)<.01,'fixed ribbon drawn in original units')
    ok(abs(actual['group']['width']/unit-group)<.01,'whole measuring group drawn on same scale')
    ok(abs(actual['selected']['width']/unit-group/actual['q'])<.01,'selected piece uses group reference')
    point=actual['amount']['x']
    for piece in actual['pieces']:
        ok(abs(piece['x']-point)<1,'laid pieces contiguous')
        ok(abs(piece['width']/unit-group/piece['q'])<.01,'old piece retains its own group fraction')
        point+=piece['width']
    ok(point<=actual['amount']['x']+actual['amount']['width']+1,'pieces do not overshoot')
    return actual

def journey(browser,base,seed,width,height):
    c,p=setup(browser,base,width,height,seed);before=book(p)
    ok(p.locator('dialog.welcome-film[open]').count()==0,'no unsolicited film')
    for id,amount,group,whole,part in [('unit-quarter',1,.25,4,None),('three-quarters',.75,.25,3,None),('eighth-group',.75,.375,2,None),('partial-group',.5,.75,0,3),('mixed-groups',5/6,1/3,2,2),('beyond-one',1.5,.75,2,None)]:
        p.locator('[data-rmeasure-case]').select_option(id);geometry(p,amount,group)
        if id=='partial-group':ok(p.locator('[data-rmeasure-action="lay"]').is_disabled(),'full group does not fit half-unit ribbon')
        for _ in range(whole):action(p,'lay')
        if part:
            split(p,part)
            for _ in range(2 if id=='partial-group' else 1):action(p,'lay')
        ok(p.locator('.rmeasure-complete').count()==1,'actual construction covers ribbon')
        action(p,'read');ok(p.locator('.rmeasure-reading').count()==1,'explicit measurement visible')
        if id=='partial-group':ok('2/3 of one measuring group' in p.locator('.rmeasure-reading').inner_text(),'fractional quotient counts groups')
        if id=='mixed-groups':ok('2 1/2 measuring groups (5/2 groups)' in p.locator('.rmeasure-reading').inner_text(),'mixed quotient and improper alias')
        before_pieces=geometry(p,amount,group)['pieces'];split(p,2);ok(p.locator('.rmeasure-reading').count()==0,'material edit closes supplied readout');after=geometry(p,amount,group)['pieces'];ok(before_pieces==after,'changing template leaves laid geometry intact');action(p,'undo')
        p.screenshot(path=str(OUT/f'{width}-{id}.png'),full_page=True)
    # Construct a valid mixed-size alternative, then a finite-tool tiny gap.
    p.locator('[data-rmeasure-case]').select_option('partial-group');action(p,'return');action(p,'undo');split(p,2);split(p,2);action(p,'lay');action(p,'lay')
    ok('Undo last split' in p.locator('.rmeasure-reason').inner_text(),'quarter template needs Undo to reach fitting sixth')
    action(p,'undo');split(p,3);action(p,'lay');ok(qs(p)==[4,4,6],'native mixed piece construction')
    action(p,'read');ok('2 quarter-group pieces; 1 sixth-group piece' in p.locator('.rmeasure-reading').inner_text(),'literal mixed tally')
    action(p,'return');action(p,'undo');action(p,'undo');split(p,3);action(p,'lay');action(p,'undo');split(p,2);split(p,2);action(p,'lay')
    ok(qs(p)==[3,4],'tiny-gap path built natively');ok('smaller than any piece' in p.locator('.rmeasure-reason').inner_text(),'honest finite-tool gap advice');ok(p.locator('.rmeasure-complete').count()==0,'tiny gap never rounded to success');ok(p.locator('[data-rmeasure-gap]').bounding_box()['width']>0,'tiny gap physically present')
    action(p,'lift');action(p,'undo');action(p,'undo');split(p,3);action(p,'lay');ok(p.locator('.rmeasure-complete').count()==1,'Lift and alternate piece recover')
    action(p,'read');material=qs(p);action(p,'example');ok(p.locator('[data-rmeasure-view="example"]').count()==1,'worked view distinct')
    for index in range(4):
        ok(f'picture {index+1} of 4' in p.locator('[data-rmeasure-view="example"]').inner_text(),'displayed frame one-based');geometry(p,.5,1/3)
        ok(p.locator('[data-rmeasure-sixth]').count()==(5 if index>=2 else 0),'worked bridge cuts original unit into sixths')
        if index<3:action(p,'next')
    action(p,'previous');action(p,'close');ok(qs(p)==material,'worked example preserves live piece order');ok(p.locator('.rmeasure-reading').count()==1,'worked example preserves optional read flag')
    ok(book(p)==before,'all material/help/read actions leave notebook unchanged');ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no horizontal overflow')
    for node in p.locator('[data-rmeasure-root] button,[data-rmeasure-root] select,[data-rmeasure-root] summary').all():
        if node.is_visible():ok(node.bounding_box()['height']>=43.9,'44px native target')
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
    p.locator('[data-rmeasure-root]').wait_for()
def release_setup(browser,base,seed,label,second=False,mode=None):
    c=browser.new_context(viewport={'width':820,'height':1180},has_touch=True,reduced_motion='reduce',accept_downloads=True)
    CONTEXTS.append(c)
    profiles=[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-28T12:00:00.000Z'}]
    if second:profiles.append({'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-10-28T12:00:00.000Z'})
    fixture={'registry':{'version':1,'activeId':'explorer-1','explorers':profiles},'seed':seed,'second':second,'mode':mode}
    c.add_init_script('(data=>{if(!localStorage.getItem("ribbon-release-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(data.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(data.seed));if(data.second)localStorage.setItem("number-garden-v1:explorer-2",JSON.stringify(data.seed));if(data.mode==="off")localStorage.setItem("number-garden-save","off");localStorage.setItem("ribbon-release-fixture","1");}if(data.mode==="failure"){const old=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith("number-garden")||k==="learning-garden-explorers")throw new DOMException("Synthetic storage failure","QuotaExceededError");return old.call(this,k,v);};}})('+json.dumps(fixture)+')')
    c.add_init_script('window.ribbonSpeech=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{ribbonSpeech.push(u.text);return native(u);};}')
    p=c.new_page();PAGES.append((p,label));p.set_default_timeout(15000)
    p.on('pageerror',lambda e:FAULTS.append({'case':label,'error':str(e)}))
    p.on('console',lambda m:FAULTS.append({'case':label,'error':m.text}) if m.type=='error' else None)
    p.on('response',lambda r:FAULTS.append({'case':label,'status':r.status,'url':r.url}) if r.status>=400 else None)
    p.goto(base+'#workshop/ribbon-measures',wait_until='domcontentloaded');choose_initial(p)
    return p

def unit_count(p):return p.locator('[data-rmeasure-laid]').count()
def route(p,path):p.evaluate('(path)=>location.hash=path',path)
def board(p):p.locator('[data-rmeasure-root]').wait_for()
def stash(p):p.evaluate('window.ribbonOld=[...document.querySelectorAll("[data-rmeasure-action],[data-rmeasure-case],[data-rmeasure-split],[data-rmeasure-root] [data-speak],summary")]')
def invoke_old(p):
    count=p.evaluate('ribbonSpeech.length');before=saved(p)
    check(p.evaluate('ribbonOld.every(e=>!e.isConnected)'),'actual old controls are detached')
    p.evaluate('ribbonOld.forEach(e=>{if(e.matches("select")){e.value="three-quarters";e.dispatchEvent(new Event("change",{bubbles:true}));}else e.click();})')
    check(saved(p)==before,'stale controls preserve notebook');check(p.evaluate('ribbonSpeech.length')==count,'stale Hear is inert')
def export(p,name):
    route(p,'#notes');p.locator('#download').wait_for()
    with p.expect_download() as d:p.locator('#download').tap()
    path=OUT/(name+'.json');d.value.save_as(path)
    return json.loads(path.read_text())
def file_input(p,report):
    p.locator('#progress-file').set_input_files({'name':'synthetic-rmeasure.json','mimeType':'application/json','buffer':json.dumps(report).encode()})

def lifecycle(browser,base,seed):
    p=release_setup(browser,base,seed,'lifecycle',True);original1=saved(p,'explorer-1');original2=saved(p,'explorer-2')
    click(p,'lay');stash(p);p.locator('[data-rmeasure-case]').select_option('three-quarters');invoke_old(p);check(unit_count(p)==0,'stale case action cannot build current ribbon');click(p,'lay');check(unit_count(p)==1,'native action proves current case unchanged');p.locator('[data-rmeasure-case]').select_option('unit-quarter');check(unit_count(p)==1,'old case unchanged by stale action')
    click(p,'return');stash(p);click(p,'lay');invoke_old(p);check(unit_count(p)==1,'stale previous-phase action cannot lift current piece');click(p,'lift');check(unit_count(p)==0,'subsequent legitimate lift sees current one-piece state')
    click(p,'lay');stash(p);before=saved(p);p.evaluate('()=>{location.hash="#notes";ribbonOld.forEach(e=>e.click());}')
    p.locator('#download').wait_for();check(saved(p)==before,'same-tick departed handlers inert')
    route(p,'#workshop/ribbon-measures');board(p);check(unit_count(p)==0,'ordinary route departure clears board');click(p,'lay')
    p.evaluate('()=>{location.hash="#numbers";location.hash="#workshop/ribbon-measures";}');p.wait_for_function('document.querySelector("[data-rmeasure-root]")?.querySelectorAll("[data-rmeasure-laid]").length===0')
    check(unit_count(p)==0,'same-tick away/back clears via oldURL')
    click(p,'lay');stash(p);p.locator('#explorer-switch').tap();check(p.locator('[data-rmeasure-root]').count()==0,'chooser has no board binders');p.locator('#explorer-cancel').tap();board(p);invoke_old(p);check(unit_count(p)==0,'canceling chooser starts fresh visit');click(p,'lay');check(unit_count(p)==1,'current action after stale chooser callbacks')
    stash(p);p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();board(p);invoke_old(p);check(unit_count(p)==0,'second explorer gets fresh board');p.locator('[data-rmeasure-case]').select_option('three-quarters');click(p,'lay');check(unit_count(p)==1,'second explorer actually explores');check(saved(p,'explorer-1')==original1,'first explorer preserved');check(saved(p,'explorer-2')['sentinel']==original2['sentinel'],'second retained data preserved')
    # The actual Notes download/import path proves content preservation beyond helper shape checks.
    stash(p);report=export(p,'transfer');check(report['ribbonMeasure']==seed['ribbonMeasure'] and report['sentinel']==seed['sentinel'],'actual export retains malformed/unknown294 fields')
    source_id=active_id(p);before=saved(p);file_input(p,{'not':'a notebook'});p.locator('#progress-import-status').filter(has_text='not supported').wait_for();check(saved(p)==before,'failed import leaves original notebook');check(p.locator('#progress-import-cancel').count()==0,'failed file has no pending import to cancel');route(p,'#workshop/ribbon-measures');board(p);invoke_old(p);check(unit_count(p)==0,'failed/canceled import invalidates old model');click(p,'lay')
    route(p,'#notes');file_input(p,report);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-cancel').tap();check(saved(p)==before,'canceling valid import leaves source untouched');route(p,'#workshop/ribbon-measures');board(p);check(unit_count(p)==0,'valid-import cancel leaves no transient work')
    click(p,'lay');stash(p);route(p,'#notes');file_input(p,report);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();newid=active_id(p);check(newid!=source_id,'import creates separate explorer');check(saved(p,source_id)==before,'import preserves source explorer');route(p,'#workshop/ribbon-measures');board(p);invoke_old(p);check(unit_count(p)==0,'successful import clears board');click(p,'lay');check(unit_count(p)==1,'post-import native action uses new visit');again=export(p,'redownload');check(again['ribbonMeasure']==report['ribbonMeasure'] and again['sentinel']==report['sentinel'],'literal redownload preserves unknown source content')
    p.reload();p.locator('#explorer-header').wait_for();choice=p.locator(f'[data-select-explorer="{newid}"]');
    if choice.count():choice.tap()
    route(p,'#workshop/ribbon-measures');board(p);check(unit_count(p)==0,'persistent import/reload has fresh board');check(saved(p)['ribbonMeasure']==report['ribbonMeasure'],'persistent imported unknown content survives reload')
    click(p,'lay');stash(p);route(p,'#notes');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"')
    film=p.locator('dialog.welcome-film[open]')
    if film.count():film.locator('[data-film-skip]').tap()
    route(p,'#workshop/ribbon-measures');board(p);invoke_old(p);check(unit_count(p)==0,'reset invalidates old board');click(p,'lay');check(unit_count(p)==1,'fresh board playable after reset');check(saved(p,'explorer-1')==original1,'reset imported explorer preserves other explorer')


def interfaces(browser,base,seed):
    p=release_setup(browser,base,seed,'interfaces');before=saved(p)
    ok(p.evaluate('ribbonSpeech.length')==0,'no unsolicited speech')
    lay=p.locator('[data-rmeasure-action="lay"]');lay.focus();p.keyboard.press('Enter');p.locator('[data-rmeasure-action="lay"]').focus();p.keyboard.press('Space')
    ok(qs(p)==[1,1],'native Enter and Space lay real pieces')
    action(p,'read');hear=p.locator('[data-rmeasure-root] [data-speak]');hear.tap();spoken=hear.get_attribute('data-speak')
    ok('2 measuring groups' in spoken and 'not fully measured' in spoken,'first Hear includes current partial measurement')
    ok(spoken.count('Lay measuring pieces end to end.')==1,'task narrated once')
    ok('Worked example, picture' not in spoken,'hidden example absent from live Hear')
    action(p,'example');stash(p);action(p,'next');invoke_old(p);ok('picture 2 of 4' in p.locator('[data-rmeasure-view="example"]').inner_text(),'old frame controls are inert')
    action(p,'next');hear=p.locator('[data-rmeasure-root] [data-speak]');hear.tap();spoken=hear.get_attribute('data-speak')
    ok('picture 3 of 4' in spoken and '1/6 of one length unit' in spoken,'example Hear includes current sixths bridge')
    ok('2 measuring groups' not in spoken,'example narration excludes hidden live result')
    action(p,'next');ok(p.locator('[data-rmeasure-action="previous"]').evaluate('e=>e===document.activeElement'),'last frame focuses Previous')
    stash(p);action(p,'close');invoke_old(p);ok(qs(p)==[1,1],'example controls cannot mutate live material');action(p,'lift');ok(qs(p)==[1],'legitimate action after stale example callbacks')
    action(p,'lift');ok(p.locator('[data-rmeasure-action="lay"]').evaluate('e=>e===document.activeElement'),'last Lift focuses Lay')
    split(p,3);ok(p.locator('[data-rmeasure-split="2"]').evaluate('e=>e===document.activeElement'),'thirds focus other enabled split')
    split(p,2);ok(p.locator('[data-rmeasure-action="undo"]').evaluate('e=>e===document.activeElement'),'sixths focus Undo')
    action(p,'undo');action(p,'undo');ok(p.locator('[data-rmeasure-split="2"]').evaluate('e=>e===document.activeElement'),'last Undo focuses first enabled split')
    split(p,2);split(p,2);ok(p.locator('[data-rmeasure-action="undo"]').evaluate('e=>e===document.activeElement'),'quarters focus Undo')
    action(p,'undo');action(p,'undo')
    p.evaluate('window.ribbonAnnouncements=[];new MutationObserver(ms=>{for(const m of ms)if(m.target.matches?.(".rmeasure-status")&&m.target.isConnected)ribbonAnnouncements.push(m.target.textContent);}).observe(document.querySelector("main"),{subtree:true,childList:true,characterData:true})')
    action(p,'lay');p.locator('.rmeasure-status').filter(has_text='Piece laid.').wait_for();ok(p.evaluate('ribbonAnnouncements.some(s=>s.startsWith("Piece laid."))'),'status changes on connected live region')
    p.locator('[data-rmeasure-case]').select_option('three-quarters');p.locator('[data-rmeasure-case]').select_option('unit-quarter');p.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
    ok(p.locator('.rmeasure-status').inner_text()=='','consumed status does not replay on case return');ok(qs(p)==[1],'case return retains material')
    ok(saved(p)==before,'keyboard/Hear/status leave notebook untouched')
    for width,height in [(320,800),(820,1180),(1024,768)]:
        c,q=setup(browser,base,width,height,seed)
        b=q.locator('[data-rmeasure-action="lay"]');b.scroll_into_view_if_needed();box=b.bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
        start_scroll=q.evaluate('scrollY')
        for n in range(1,5):
            q.touchscreen.tap(x,y);q.wait_for_function('(n)=>document.querySelectorAll("[data-rmeasure-laid]").length===n',arg=n)
            now=q.locator('[data-rmeasure-action="lay"]').bounding_box();ok(abs(now['x']-box['x'])<.5 and abs(now['y']+q.evaluate('scrollY')-box['y']-start_scroll)<.5,'Lay shelf retains document coordinates');ok(n==4 or abs(now['y']-box['y'])<.5,'repeated available Lay stays at same screen coordinate')
        ok(q.locator('[data-rmeasure-action="lift"]').evaluate('e=>e===document.activeElement'),'full measurement focuses Lift')
        action(q,'return');b=q.locator('[data-rmeasure-split="2"]');b.scroll_into_view_if_needed();box=b.bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
        q.touchscreen.tap(x,y);q.wait_for_function('document.querySelectorAll("[data-rmeasure-cut]").length===1');q.touchscreen.tap(x,y);q.wait_for_function('document.querySelectorAll("[data-rmeasure-cut]").length===3');now=q.locator('[data-rmeasure-split="2"]').bounding_box();ok(abs(now['x']-box['x'])<.5 and abs(now['y']-box['y'])<.5,'fixed coordinate Split stays put')
        c.close()
    q=release_setup(browser,base,seed,'first-screen');boxes=[q.locator(sel).bounding_box() for sel in ['#rmeasure-title','.rmeasure-references','[data-rmeasure-action="lay"]','.rmeasure-art']]
    ok(all(b['y']>=0 and b['y']+b['height']<=1180 for b in boxes),'tablet first screen includes task, references, Lay and diagram');q.screenshot(path=str(OUT/'first-screen.png'))
    for mode in ['off','failure']:
        q=release_setup(browser,base,seed,'storage-'+mode,mode=mode);before=saved(q);split(q,3);action(q,'lay');action(q,'read');ok(qs(q)==[3],'material works with storage '+mode);ok(saved(q)==before,'no persistence mutation in '+mode);report=export(q,'storage-'+mode);ok(report['version']==1,'real temporary notebook exported in '+mode)
        if mode=='failure':ok(report['ribbonMeasure']==seed['ribbonMeasure'],'failed writes retain unknown source field')
    fresh=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';console.log(JSON.stringify(freshState()));"],cwd=ROOT,text=True))
    q=release_setup(browser,base,fresh,'uninitialized');now=saved(q);expected=json.loads(json.dumps(fresh));now.get('garden',{}).pop('avatar',None);expected.get('garden',{}).pop('avatar',None)
    if now.get('garden')=={} and 'garden' not in expected:now.pop('garden')
    ok(now==expected,'direct entry initializes no unrelated game');action(q,'lay');ok('workshop' not in saved(q),'material action initializes no Workshop record');ok(q.locator('dialog.welcome-film[open]').count()==0,'uninitialized direct entry plays no film')

def main():
    js="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.ribbonMeasure={version:77,cuts:'unreadable future field'};s.sentinel={note:'Synthetic retained work'};console.log(JSON.stringify(s));"
    seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):
        request_queue_size=128
        daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('RMEASURE_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
        try:
            parts=set(os.environ.get('RMEASURE_TEST_PARTS','material,lifecycle,interfaces').split(','))
            if 'material' in parts:
                for width,height in [(820,1180),(1024,768),(320,800)]:journey(browser,base,seed,width,height)
            if 'lifecycle' in parts:lifecycle(browser,base,seed)
            if 'interfaces' in parts:interfaces(browser,base,seed)
            ok(not FAULTS,'no release page/http/console faults: '+json.dumps(FAULTS))
            ok(not errors,'no page/console errors');result={'status':'passed','checks':checks,'parts':sorted(parts),'scope':'native material, lifecycle, keyboard, speech requests, statuses, fixed-coordinate taps, first-screen layout and storage isolation; no physical iPad/Safari or audible speech proof'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
        except Exception:
            for p,label in pages:
                try:p.screenshot(path=str(OUT/f'failure-{label}.png'),full_page=True)
                except Exception:pass
            raise
        finally:browser.close();server.shutdown()
if __name__=='__main__':main()
