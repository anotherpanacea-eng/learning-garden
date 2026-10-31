"""Native Chrome material and preservation release probes for293.
Synthetic notebooks only. Not physical iPad/Safari or audibility evidence.
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
OUT=Path(os.environ.get('GROUND_ARTIFACTS',tempfile.mkdtemp(prefix='ground-browser-')))
OUT.mkdir(parents=True,exist_ok=True)
checks=0
def check(value,message):
    global checks
    assert value,message
    checks+=1
def click(p,action):p.locator(f'[data-ground-action="{action}"]').tap()
def snapshot(p):return p.evaluate('()=>localStorage.getItem("number-garden-v1:explorer-1")')
def run(browser,base,width,height,seed):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce')
    fixture={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-28T12:00:00.000Z'}]}
    c.add_init_script('(data=>{if(!localStorage.getItem("ground-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(data.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(data.seed));localStorage.setItem("ground-fixture","1");}})('+json.dumps({'registry':fixture,'seed':seed})+')')
    p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    p.on('requestfailed',lambda r:errors.append(str((r.url,r.failure))) if 'ERR_ABORTED' not in (r.failure or '') else None)
    p.goto(base+'#workshop/same-ground',wait_until='domcontentloaded')
    try:p.locator('#explorer-header').wait_for(timeout=10000)
    except Exception:
        p.screenshot(path=str(OUT/f'failure-{width}.png'),full_page=True)
        print(json.dumps({'pageErrors':errors,'body':p.locator('body').inner_text()[:2000]}),flush=True)
        raise
    choice=p.locator('[data-select-explorer="explorer-1"]')
    if choice.count():choice.tap()
    p.locator('[data-ground-root]').wait_for()
    before=snapshot(p)
    check('All 4 tiles' in p.locator('.ground-counts').inner_text(),'starts with full stock in tray')
    check(p.locator('[data-ground-diagram="plot"] [data-ground-unit]').count()==0,'no ghost tiles')
    click(p,'lay');check(p.locator('.ground-tray').inner_text().startswith('0 tiles'),'tray moves actual stock')
    check(p.locator('[data-ground-action="lift"]').evaluate('(e)=>e===document.activeElement'),'final Lay moves focus to enabled Lift')
    click(p,'keep');click(p,'return');p.locator('[data-ground-width]').select_option('2');click(p,'lay');click(p,'lay')
    check('Both cover 4 square units' in p.locator('.ground-comparison').inner_text(),'same area comparison')
    check('fewer length units' in p.locator('.ground-comparison').inner_text(),'different boundary comparison')
    a=p.locator('[data-ground-diagram="plot"] [data-ground-unit]').first.bounding_box();b=p.locator('[data-ground-diagram="picture"] [data-ground-unit]').first.bounding_box()
    check(abs(a['width']-a['height'])<.2,'current tiles are square');check(abs(a['width']-b['width'])<.2,'picture and current use same unit scale')
    for _ in range(8):click(p,'walk')
    check('Back at the start' in p.locator('.ground-controls').inner_text(),'closed walk')
    check(p.locator('.ground-edge.walked').count()==8,'eight outside unit segments, not four border tiles')
    check(p.locator('[data-ground-action="restart"]').evaluate('(e)=>e===document.activeElement'),'last Walk focus fallback')
    click(p,'lift');check(p.locator('.ground-edge.walked').count()==0,'edit clears old walk')
    check('At least one arrangement' in p.locator('.ground-comparison').inner_text(),'partial build qualifier')
    click(p,'return');p.locator('[data-ground-shortcut] summary').tap();check('no outside boundary' in p.locator('[data-ground-shortcut]').inner_text(),'empty shortcut has no phantom fence')
    p.locator('[data-ground-case]').select_option('twenty-four');check(p.locator('.ground-budget').count()==0,'empty final has no within-budget claim')
    p.locator('[data-ground-width]').select_option('6')
    for _ in range(4):click(p,'lay')
    check('All 24 tiles' in p.locator('.ground-budget').inner_text(),'all stock used');check('20 length units of fence is within' in p.locator('.ground-budget').inner_text(),'inclusive fence budget')
    click(p,'keep');click(p,'return');p.locator('[data-ground-width]').select_option('3')
    for _ in range(8):click(p,'lay')
    check('22 length units of fence is over' in p.locator('.ground-budget').inner_text(),'larger fence remains factual')
    p.locator('[data-ground-case]').select_option('four');check('A picture' in p.locator('.ground-picture').inner_text(),'case picture retained during visit')
    check(p.locator('[data-ground-shortcut]').get_attribute('open') is not None,'support disclosure retained')
    check(snapshot(p)==before,'construction and support do not save a notebook')
    check(p.evaluate('()=>document.documentElement.scrollWidth<=innerWidth'),'no document overflow')
    for box in p.locator('[data-ground-root] button,[data-ground-root] select,[data-ground-root] summary').all():
        if box.is_visible():check(box.bounding_box()['height']>=43.9,'native target at least44px')
    p.screenshot(path=str(OUT/f'board-{width}.png'),full_page=True)
    p.reload();p.locator('#explorer-header').wait_for();choice=p.locator('[data-select-explorer="explorer-1"]');
    if choice.count():choice.tap()
    p.locator('[data-ground-root]').wait_for();check(p.locator('[data-ground-unit]').count()==0,'reload clears transient work');check(snapshot(p)==before,'reload retains unrelated notebook')
    check(not errors,'no page errors');c.close()


# Release probes use native actions. Actual storage/downloads are inspected separately
# from the synthetic source fixture. No application helper is called to build a plot.
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
    p.locator('[data-ground-root]').wait_for()
def setup(browser,base,seed,label,second=False,mode=None):
    c=browser.new_context(viewport={'width':820,'height':1180},has_touch=True,reduced_motion='reduce',accept_downloads=True)
    CONTEXTS.append(c)
    profiles=[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-28T12:00:00.000Z'}]
    if second:profiles.append({'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-10-28T12:00:00.000Z'})
    fixture={'registry':{'version':1,'activeId':'explorer-1','explorers':profiles},'seed':seed,'second':second,'mode':mode}
    c.add_init_script('(data=>{if(!localStorage.getItem("ground-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(data.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(data.seed));if(data.second)localStorage.setItem("number-garden-v1:explorer-2",JSON.stringify(data.seed));if(data.mode==="off")localStorage.setItem("number-garden-save","off");localStorage.setItem("ground-fixture","1");}if(data.mode==="failure"){const old=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith("number-garden")||k==="learning-garden-explorers")throw new DOMException("Synthetic storage failure","QuotaExceededError");return old.call(this,k,v);};}})('+json.dumps(fixture)+')')
    c.add_init_script('window.groundSpeech=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{groundSpeech.push(u.text);return native(u);};}')
    p=c.new_page();PAGES.append((p,label));p.set_default_timeout(15000)
    p.on('pageerror',lambda e:FAULTS.append({'case':label,'error':str(e)}))
    p.on('console',lambda m:FAULTS.append({'case':label,'error':m.text}) if m.type=='error' else None)
    p.on('response',lambda r:FAULTS.append({'case':label,'status':r.status,'url':r.url}) if r.status>=400 else None)
    p.goto(base+'#workshop/same-ground',wait_until='domcontentloaded');choose_initial(p)
    return p

def unit_count(p):return p.locator('[data-ground-diagram="plot"] [data-ground-unit]').count()
def route(p,path):p.evaluate('(path)=>location.hash=path',path)
def board(p):p.locator('[data-ground-root]').wait_for()
def stash(p):p.evaluate('window.groundOld=[...document.querySelectorAll("[data-ground-action],[data-ground-case],[data-ground-width],[data-ground-root] [data-speak],[data-ground-shared] summary")]')
def invoke_old(p):
    count=p.evaluate('groundSpeech.length');before=saved(p)
    check(p.evaluate('groundOld.every(e=>!e.isConnected)'),'actual old controls are detached')
    p.evaluate('groundOld.forEach(e=>{if(e.matches("select")){e.value=e.matches("[data-ground-case]")?"six":"1";e.dispatchEvent(new Event("change",{bubbles:true}));}else e.click();})')
    check(saved(p)==before,'stale controls preserve notebook');check(p.evaluate('groundSpeech.length')==count,'stale Hear is inert')
def export(p,name):
    route(p,'#notes');p.locator('#download').wait_for()
    with p.expect_download() as d:p.locator('#download').tap()
    path=OUT/(name+'.json');d.value.save_as(path)
    return json.loads(path.read_text())
def file_input(p,report):
    p.locator('#progress-file').set_input_files({'name':'synthetic-ground.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
def all_cases(browser,base,seed):
    p=setup(browser,base,seed,'all-cases');before=saved(p)
    for id,w,h,other_w,other_h,firstP,secondP in [('four',4,1,2,2,10,8),('six',6,1,3,2,14,10),('twelve',6,2,4,3,16,14),('turn',4,3,3,4,14,14),('sixteen',8,2,4,4,20,16),('twenty-four',12,2,6,4,28,20)]:
        p.locator('[data-ground-case]').select_option(id);p.locator('[data-ground-width]').select_option(str(w))
        for _ in range(h):click(p,'lay')
        check(unit_count(p)==w*h,'authored first stock really constructed');check(f'{firstP} length units' in p.locator('.ground-counts').inner_text(),'first boundary count')
        click(p,'keep');click(p,'return');p.locator('[data-ground-width]').select_option(str(other_w))
        for _ in range(other_h):click(p,'lay')
        check(f'{secondP} length units' in p.locator('.ground-counts').inner_text(),'return boundary count')
        check('Both cover' in p.locator('.ground-comparison').inner_text(),'all stock compared')
        if id=='turn':check('the same number' in p.locator('.ground-comparison').inner_text(),'rotation not misreported as changed fence')
        for _ in range(secondP):click(p,'walk')
        check(p.locator('.ground-edge.walked').count()==secondP,'every exposed edge walked once')
        geom=p.locator('[data-ground-diagram]').evaluate_all('xs=>xs.map(s=>{const r=s.querySelector("[data-ground-unit]").getBoundingClientRect();return {w:r.width,h:r.height,v:s.getAttribute("viewBox"),box:s.getBoundingClientRect().height};})')
        check(abs(geom[0]['w']-geom[0]['h'])<.2 and abs(geom[0]['w']-geom[1]['w'])<.2,'all-case physical units equal and square');check(geom[0]['v']==geom[1]['v'],'common crop bounds')
        p.screenshot(path=str(OUT/f'case-{id}.png'),full_page=True)
    click(p,'return');p.locator('[data-ground-width]').select_option('2')
    for _ in range(12):click(p,'lay')
    r=p.locator('[data-ground-diagram="plot"] [data-ground-unit]').last.bounding_box();svg=p.locator('[data-ground-diagram="plot"]').bounding_box()
    check(r['y']+r['height']<=svg['y']+svg['height'],'12-row extreme not clipped')
    check('28 length units' in p.locator('.ground-counts').inner_text(),'tall rotation keeps perimeter')
    check(saved(p)==before,'all finite encounters write no notebook')

def lifecycle(browser,base,seed):
    p=setup(browser,base,seed,'lifecycle',True);original1=saved(p,'explorer-1');original2=saved(p,'explorer-2')
    click(p,'lay');stash(p);p.locator('[data-ground-case]').select_option('six');invoke_old(p);check(unit_count(p)==0,'stale case action cannot build current plot');click(p,'lay');check(unit_count(p)==6,'native action proves current case unchanged');p.locator('[data-ground-case]').select_option('four');check(unit_count(p)==4,'old case unchanged by stale action')
    click(p,'return');stash(p);click(p,'lay');invoke_old(p);check(unit_count(p)==4,'stale previous-phase action cannot lift current row');click(p,'lift');check(unit_count(p)==0,'subsequent legitimate lift sees current one-row state')
    click(p,'lay');stash(p);before=saved(p);p.evaluate('()=>{location.hash="#notes";groundOld.forEach(e=>e.click());}')
    p.locator('#download').wait_for();check(saved(p)==before,'same-tick departed handlers inert')
    route(p,'#workshop/same-ground');board(p);check(unit_count(p)==0,'ordinary route departure clears board');click(p,'lay')
    p.evaluate('()=>{location.hash="#numbers";location.hash="#workshop/same-ground";}');p.wait_for_function('document.querySelector("[data-ground-diagram=plot]")?.querySelectorAll("[data-ground-unit]").length===0')
    check(unit_count(p)==0,'same-tick away/back clears via oldURL')
    click(p,'lay');stash(p);p.locator('#explorer-switch').tap();check(p.locator('[data-ground-root]').count()==0,'chooser has no board binders');p.locator('#explorer-cancel').tap();board(p);invoke_old(p);check(unit_count(p)==0,'canceling chooser starts fresh visit');click(p,'lay');check(unit_count(p)==4,'current action after stale chooser callbacks')
    stash(p);p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();board(p);invoke_old(p);check(unit_count(p)==0,'second explorer gets fresh board');p.locator('[data-ground-case]').select_option('six');click(p,'lay');check(unit_count(p)==6,'second explorer actually explores');check(saved(p,'explorer-1')==original1,'first explorer preserved');check(saved(p,'explorer-2')['sentinel']==original2['sentinel'],'second retained data preserved')
    # The actual Notes download/import path proves content preservation beyond helper shape checks.
    stash(p);report=export(p,'transfer');check(report['sameGround']==seed['sameGround'] and report['sentinel']==seed['sentinel'],'actual export retains malformed/unknown293 fields')
    source_id=active_id(p);before=saved(p);file_input(p,{'not':'a notebook'});p.locator('#progress-import-status').filter(has_text='not supported').wait_for();check(saved(p)==before,'failed import leaves original notebook');check(p.locator('#progress-import-cancel').count()==0,'failed file has no pending import to cancel');route(p,'#workshop/same-ground');board(p);invoke_old(p);check(unit_count(p)==0,'failed/canceled import invalidates old model');click(p,'lay')
    route(p,'#notes');file_input(p,report);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-cancel').tap();check(saved(p)==before,'canceling valid import leaves source untouched');route(p,'#workshop/same-ground');board(p);check(unit_count(p)==0,'valid-import cancel leaves no transient work')
    click(p,'lay');stash(p);route(p,'#notes');file_input(p,report);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();newid=active_id(p);check(newid!=source_id,'import creates separate explorer');check(saved(p,source_id)==before,'import preserves source explorer');route(p,'#workshop/same-ground');board(p);invoke_old(p);check(unit_count(p)==0,'successful import clears board');click(p,'lay');check(unit_count(p)==4,'post-import native action uses new visit');again=export(p,'redownload');check(again['sameGround']==report['sameGround'] and again['sentinel']==report['sentinel'],'literal redownload preserves unknown source content')
    p.reload();p.locator('#explorer-header').wait_for();choice=p.locator(f'[data-select-explorer="{newid}"]');
    if choice.count():choice.tap()
    route(p,'#workshop/same-ground');board(p);check(unit_count(p)==0,'persistent import/reload has fresh board');check(saved(p)['sameGround']==report['sameGround'],'persistent imported unknown content survives reload')
    click(p,'lay');stash(p);route(p,'#notes');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"')
    film=p.locator('dialog.welcome-film[open]')
    if film.count():film.locator('[data-film-skip]').tap()
    route(p,'#workshop/same-ground');board(p);invoke_old(p);check(unit_count(p)==0,'reset invalidates old board');click(p,'lay');check(unit_count(p)==4,'fresh board playable after reset');check(saved(p,'explorer-1')==original1,'reset imported explorer preserves other explorer')

def speech_keyboard_storage(browser,base,seed,fresh):
    p=setup(browser,base,seed,'speech');before=saved(p);check(p.evaluate('groundSpeech.length')==0,'no unsolicited narration');check(p.locator('dialog.welcome-film[open]').count()==0,'no automatic film')
    p.locator('[data-ground-width]').select_option('2');p.locator('[data-ground-action="lay"]').focus();p.keyboard.press('Enter');p.locator('[data-ground-action="lay"]').focus();p.keyboard.press('Space');check(unit_count(p)==4,'native Enter and Space build two rows');click(p,'keep');click(p,'walk')
    hear=p.locator('[data-ground-root] [data-speak]');hear.tap();text=hear.get_attribute('data-speak');check('Covers 4 square units' in text and '8 length units' in text and 'Walked 1 of 8' in text,'first native Hear has current counts');reason=p.locator('.section-heading p').text_content().strip();prompt=p.locator('#ground-title').text_content().strip();check(bool(reason) and text.count(reason)==1 and text.startswith(reason+' '+prompt),'Hear reads the rendered Willowbank reason once before the plot prompt');check(bool(prompt) and text.count(prompt)==1,'prompt spoken once');voices=p.evaluate('speechSynthesis.getVoices().filter(v=>v.localService&&/^en(?:[-_]|$)/i.test(v.lang)).length')
    if voices:p.wait_for_function('groundSpeech.length===1')
    else:check(p.evaluate('groundSpeech.length')==0,'no remote speech substitute')
    check(saved(p)==before,'Hear writes no assessment record');stash(p);click(p,'lift');invoke_old(p);check(unit_count(p)==2,'stale Hear/controls cannot change phase');click(p,'lift');check(p.locator('[data-ground-action="lay"]').evaluate('e=>e===document.activeElement'),'final Lift focuses enabled Lay')
    p=setup(browser,base,fresh,'uninitialized');now=saved(p);expected=json.loads(json.dumps(fresh));now.get('garden',{}).pop('avatar',None);expected.get('garden',{}).pop('avatar',None)
    if now.get('garden')=={} and 'garden' not in expected:now.pop('garden')
    check(now==expected,'direct entry initializes no unrelated game');click(p,'lay');check('workshop' not in saved(p),'explicit tile action does not initialize Workshop');check(p.locator('dialog.welcome-film[open]').count()==0,'unseen direct entry no film')
    for mode in ['off','failure']:
        p=setup(browser,base,seed,'storage-'+mode,mode=mode);raw=snapshot(p);click(p,'lay');click(p,'keep');click(p,'return');p.locator('[data-ground-width]').select_option('2');click(p,'lay');click(p,'lay');check('Both cover 4 square units' in p.locator('.ground-comparison').inner_text(),'board playable with storage '+mode);check(snapshot(p)==raw,'tile model makes no persistence write in '+mode);report=export(p,'storage-'+mode);check(report['version']==1,'actual temporary notebook export with '+mode)
        if mode=='failure':check(report['sameGround']==seed['sameGround'],'failed writes preserve unknown original content')


def repaired_interface(browser,base,seed):
    p=setup(browser,base,seed,'repaired-interface');before=saved(p)
    p.locator('[data-ground-width]').select_option('5');check('A row of 5 needs 5 tiles; there are only 4' in p.locator('.ground-lay-reason').inner_text(),'unavailable row reason beside action');check('Lay a row to begin' not in p.locator('.ground-counts').inner_text(),'no impossible empty instruction');check('Walked 0 of 0' not in p.locator('[data-ground-root]').inner_text(),'no empty walk')
    p.locator('[data-ground-width]').select_option('3');click(p,'lay');check('there are only 1' in p.locator('.ground-lay-reason').inner_text(),'partial remainder reason');click(p,'return');p.locator('[data-ground-width]').select_option('2');click(p,'lay')
    p.evaluate('()=>{window.groundAnnouncements=[];new MutationObserver(ms=>{for(const m of ms)if(m.target.matches?.(".ground-status")&&m.target.isConnected)groundAnnouncements.push(m.target.textContent);}).observe(document.querySelector("main"),{subtree:true,childList:true,characterData:true});}')
    for action,text in [('keep','Picture kept.'),('keep','Kept picture replaced.'),('reveal','Outside edges shown.'),('reveal','Outside edges hidden.'),('walk','Walked 1 of 6 length units.'),('restart','Walk reset to 0 of 6 length units.'),('clear','Picture cleared.')]:
        click(p,action);p.locator('.ground-status').filter(has_text=text).wait_for();check(p.locator('.ground-status').inner_text()==text,'specific connected action status: '+action)
    check(p.evaluate('groundAnnouncements.includes("Picture kept.")&&groundAnnouncements.includes("Outside edges shown.")'),'status text actually mutates a connected live region')
    check(p.locator('[data-ground-action="keep"]').evaluate('e=>e===document.activeElement'),'Clear focus returns to Keep')
    ref=p.locator('.ground-reference');check('1 square unit' in ref.text_content() and '1 length unit' in ref.text_content(),'separate square/length labels drawn')
    geometry=ref.evaluate('s=>{const a=s.querySelector("rect").getBBox(),b=s.querySelector("path").getBBox();return {square:{width:a.width,height:a.height},line:{width:b.width,height:b.height}};}')
    check(geometry['square']['width']==geometry['square']['height']==geometry['line']['width']==16,'unit reference shows an area square and one equal-length edge')
    p.locator('[data-ground-root] [data-speak]').tap();check('□' not in p.locator('[data-ground-root] [data-speak]').get_attribute('data-speak'),'decorative square absent from Hear text')
    check(saved(p)==before,'repaired UI and status preserve notebook')
    # All primary row buttons stay at the original screen coordinates as rows grow.
    for width in [320,1024]:
        p.set_viewport_size({'width':width,'height':800});p.locator('[data-ground-case]').select_option('twenty-four');click(p,'return') if unit_count(p) else None;p.locator('[data-ground-width]').select_option('1')
        if width==1024:
            click(p,'lay');click(p,'keep');click(p,'return')
        lay=p.locator('[data-ground-action="lay"]');lay.scroll_into_view_if_needed();b=lay.bounding_box();x=b['x']+b['width']/2;y=b['y']+b['height']/2
        for n in range(1,13):
            p.touchscreen.tap(x,y);p.wait_for_function('(n)=>document.querySelectorAll("[data-ground-diagram=plot] [data-ground-unit]").length===n',arg=n)
            now=p.locator('[data-ground-action="lay"]').bounding_box();check(abs(now['x']-b['x'])<.5 and abs(now['y']-b['y'])<.5,'fixed-coordinate Lay stays still at '+str(width))
        check('This board holds up to 12 rows' in p.locator('.ground-lay-reason').inner_text(),'row-limit reason not mathematical impossibility');p.screenshot(path=str(OUT/f'fixed-controls-{width}.png'),full_page=True)
    # First-screen tablet check is a fresh board, with no saved scroll or kept image.
    q=setup(browser,base,seed,'first-screen');box=q.locator('[data-ground-action="lay"]').bounding_box();prompt=q.locator('#ground-title').bounding_box();plot=q.locator('[data-ground-diagram="plot"]').bounding_box()
    check(min(box['y'],prompt['y'],plot['y'])>=0 and max(box['y']+box['height'],plot['y']+plot['height'])<=1180,'tablet first screen shows prompt, board and primary action');q.screenshot(path=str(OUT/'first-screen.png'))

def main():
    js="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.sameGround={version:77,kept:{width:999,rows:-1},rows:'not our schema',retained:'Synthetic unknown field'};s.sentinel={note:'Synthetic retained work'};console.log(JSON.stringify({seed:s,fresh:freshState()}));"
    fixture=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True));seed=fixture['seed']
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):
        request_queue_size=128
        daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('GROUND_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
        try:
            parts=set(os.environ.get('GROUND_TEST_PARTS','journey,lifecycle,speech,repairs').split(','))
            if 'journey' in parts:
                for w,h in [(820,1180),(1024,768),(320,800)]:run(browser,base,w,h,seed)
                all_cases(browser,base,seed)
            if 'lifecycle' in parts:lifecycle(browser,base,seed)
            if 'speech' in parts:speech_keyboard_storage(browser,base,seed,fixture['fresh'])
            if 'repairs' in parts:repaired_interface(browser,base,seed)
            check(not FAULTS,'no page/http/console faults: '+json.dumps(FAULTS))
            result={'status':'passed','parts':sorted(parts),'checks':checks,'scope':[{'journey':'three viewport material/focus/unit geometry and all six encounters','lifecycle':'stale controls, route, chooser, two explorers, import/cancel/failure/reset, reload and actual export preservation','speech':'first speech request, keyboard, uninitialized entry, storage off/failure','repairs':'disabled action reasons, connected action statuses, separate unit drawings, fixed-coordinate taps and first-screen tablet layout'}[part] for part in sorted(parts)],'limits':'No physical iPad/Safari, screen-reader audibility or learning-effect claim'}
            (OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
        except Exception:
            for page,label in PAGES:
                try:page.screenshot(path=str(OUT/('failure-'+label+'.png')),full_page=True)
                except Exception:pass
            raise
        finally:browser.close();server.shutdown()
if __name__=='__main__':main()
