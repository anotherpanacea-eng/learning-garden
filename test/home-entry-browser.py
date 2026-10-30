"""Synthetic Home journeys with real controls, separate explorers and notebook transfer."""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('HOME_ARTIFACTS',tempfile.mkdtemp(prefix='home-entry-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[];bad_requests=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1

def fixture():
 js="""import {freshState} from './dist/core.mjs';import {initializeExplorerState,prepareProgressImport} from './dist/progress-transfer.mjs';import {startVisit} from './dist/garden-core.mjs';import {nextGuest,adjustBite} from './dist/cafe-core.mjs';import {ingredients} from './dist/cafe-content.mjs';import {startPostOffice,setPostPackingInput} from './dist/post-office-core.mjs';import {deliveries} from './dist/post-office-content.mjs';import {startShow,setSceneDialogue} from './dist/loft-core.mjs';import {invitations} from './dist/loft-content.mjs';import {startLinear,setLinearField,showLinearHelp} from './dist/linear-pathway-core.mjs';import {linearLessons} from './dist/linear-pathway-content.mjs';import {startMotion} from './dist/motion-evidence-core.mjs';import {motionLessons} from './dist/motion-evidence-content.mjs';import {startFrenchRooms} from './dist/french-rooms-core.mjs';import {frenchRoomsLessons} from './dist/french-rooms-content.mjs';import {startEvidenceVoice} from './dist/evidence-voice-core.mjs';import {chooseStoryArrival} from './dist/story-arrivals-core.mjs';const s=initializeExplorerState(freshState()),o={canExport:()=>true};chooseStoryArrival(s,'letter');s.garden.welcomeFilmSeen=false;startVisit(s,'paris',{destination:'bookstall',variant:1});nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);setPostPackingInput(s,'12');startShow(s,invitations[0].id);setSceneDialogue(s,'The puppet brought an umbrella for a dragon.');startLinear(s,linearLessons[0].id,o);const i=linearLessons[0].items[0];setLinearField(s,i.id,i.fields[0].id,'-2',o);showLinearHelp(s,i.id,'hint',o);startMotion(s,motionLessons[0].id,o);startFrenchRooms(s,frenchRoomsLessons[0].id,o);startEvidenceVoice(s,'clock-river',o);s.syntheticFuture={version:99,payload:['keep',false]};const b=initializeExplorerState(freshState());b.garden.welcomeFilmSeen=true;console.log(JSON.stringify({a:s,b,importable:prepareProgressImport(JSON.stringify(s)).ok}));"""
 result=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True));ok(result['importable'],'mixed synthetic notebook actually importable');return result

def setup(b,base,seeds,width,height,denied=False):
 c=b.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 c.add_init_script("""(x=>{if(!localStorage.getItem('synthetic-home')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-30T12:00:00Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'shell',createdAt:'2026-10-30T12:00:00Z'}]}));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(x.a));localStorage.setItem('number-garden-v1:explorer-2',JSON.stringify(x.b));localStorage.setItem('synthetic-home','1');}window.homeWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='learning-garden-explorers'||String(k).startsWith('number-garden')){homeWrites++;if(x.denied)throw Error('Synthetic storage denial');}return set.call(this,k,v);};})("""+json.dumps({**seeds,'denied':denied})+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:bad_requests.append(r.url) if r.status>=400 else None)
 p.goto(base+'#home',wait_until='networkidle');p.locator('[data-select-explorer="explorer-1"]').tap();ready(p);return c,p

def ready(p):
 p.locator('[data-home-entry]').wait_for();p.wait_for_function("[...document.styleSheets].some(s=>s.href?.endsWith('/home-entry.css')&&s.cssRules.length)");p.evaluate('async()=>{await document.fonts.ready}')
def home(p):
 p.locator('header a[href="#home"]').first.tap();ready(p)
def raw(p,id='explorer-1'):return p.evaluate('(id)=>localStorage.getItem("number-garden-v1:"+id)',id)
def book(p,id='explorer-1'):return json.loads(raw(p,id))
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no horizontal overflow')
 for e in p.locator('[data-home-entry] button:visible,[data-home-entry] a:visible,[data-home-entry] summary:visible').all():
  r=e.bounding_box();ok(r is not None and r['height']>=43.9 and r['width']>=43.9,'44px visible Home control '+e.text_content()[:50])
def panel(p,id):
 before=raw(p),p.evaluate('homeWrites'),p.url
 p.locator(f'[data-home-choice="{id}"]').tap()
 ok(p.locator('[data-home-panel]:not([hidden])').count()==1,'exactly one visible panel')
 ok(p.locator(f'[data-home-panel="{id}"]').is_visible(),'chosen panel visible '+id)
 ok(p.locator(f'#home-title-{id}').evaluate('e=>e===document.activeElement'),'new panel heading has actual focus')
 ok((raw(p),p.evaluate('homeWrites'),p.url)==before,'panel choice causes no save or route change')
 layout(p)
def retained(p,expected):
 actual=book(p)
 for key in ['cafe','postOffice','loft','syntheticFuture']:
  ok(actual[key]==expected[key],'retained complete '+key)
 ok(actual['garden']['current']==expected['garden']['current'] and actual['garden']['visits']==expected['garden']['visits'],'waiting Paris source/route/draft preserved')
 for key in ['linearPathway','evidenceVoice','motionEvidence','frenchRooms']:
  ok(actual[key]==expected[key],'retained unit drafts, checks and support '+key)

def journey(b,base,seeds,width,height):
 c,p=setup(b,base,seeds,width,height)
 try:
  ok('A town full of possibilities.' in p.locator('[data-home-entry] h1').text_content(),'later arrival welcome is coherent')
  ok(not p.locator('dialog.welcome-film[open]').count(),'later arrival does not auto-launch first-day film')
  ok(p.locator('[data-home-choice=continue]').get_attribute('aria-pressed')=='true','retained work initially selected')
  for control in p.locator('[data-home-choice]').all():
   r=control.bounding_box();ok(r['y']>=0 and r['y']+r['height']<=height,'all three primary choices visible initially '+str((width,r)))
  layout(p);p.screenshot(path=str(OUT/f'home-{width}.png'),full_page=True)
  expected=book(p);ok(len(p.locator('.home-returns a').all())==8,'all eight current work destinations available')
  # Hidden story controls are inert even if invoked programmatically.
  before=(raw(p),p.evaluate('homeWrites'),p.url);p.locator('[data-start-path=creature]').evaluate('e=>e.click()');ok((raw(p),p.evaluate('homeWrites'),p.url)==before,'hidden story start cannot bypass selected panel')
  panel(p,'questions');p.evaluate("window.oldHomeStart=document.querySelector('[data-start-path=creature]').onclick;window.oldHomeButton=document.querySelector('[data-start-path=creature]');window.oldHomeReplay=document.querySelector('[data-film-replay=welcome]');window.oldHomePanel=document.querySelector('[data-home-choice=town]')")
  p.locator('[data-start-path=creature]').tap();p.locator('.visit-decision').wait_for();ok(book(p)['garden']['current']==expected['garden']['current'],'new curiosity preserves waiting visit before decision');home(p);panel(p,'continue')
  p.locator('.home-returns a[href="#learn/math"]').tap();p.locator('[data-linear-root]').wait_for();home(p);retained(p,expected)
  p.locator('.home-returns a[href="#learn/french"]').tap();p.locator('[data-rooms-root]').wait_for();home(p);retained(p,expected)
  p.locator('.home-returns a[href="#cafe"]').tap();p.locator('[data-cafe-view]').wait_for();home(p);retained(p,expected)
  panel(p,'town');ok(p.locator('.home-places a[href="#post"]').count()==1 and p.locator('.home-places a[href="#workshop"]').count()==1,'previously omitted destinations remain explicit')
  p.locator('.home-places a[href="#town/remembers"]').tap();p.locator('.town-page h1').wait_for();ok(p.locator('.town-page h1').text_content()=='The Town Remembers','Town stories opens actual town scene');home(p);panel(p,'town');
  p.locator('.home-places a[href="#french"]').tap();p.locator('h1').first.wait_for();home(p);retained(p,expected)
  # Native keyboard activation and hidden links staying outside the active panel.
  p.locator('[data-home-choice=questions]').focus();p.keyboard.press('Enter');ok(p.locator('#home-title-questions').evaluate('e=>e===document.activeElement'),'Enter activates panel with focus');p.locator('[data-home-choice=continue]').focus();p.keyboard.press('Space');ok(p.locator('#home-title-continue').evaluate('e=>e===document.activeElement'),'Space activates panel with focus')
  p.locator('.home-options summary').tap();p.locator('[data-film-replay=welcome]').tap();p.locator('dialog.welcome-film[open]').wait_for();p.locator('[data-film-skip]').tap();ready(p)
  # A real explorer switch invalidates retained callbacks and native detached links.
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();ready(p);ok(p.locator('[data-home-choice=questions]').get_attribute('aria-pressed')=='true','new explorer gets its own empty default')
  other=raw(p,'explorer-2');writes=p.evaluate('homeWrites');url=p.url;p.evaluate('oldHomeStart();oldHomeButton.click();oldHomeReplay.click();oldHomePanel.click()');ok(raw(p,'explorer-2')==other and p.evaluate('homeWrites')==writes and p.url==url,'stale callbacks neither mutate nor navigate another explorer');ok(not p.locator('dialog.welcome-film[open]').count(),'stale replay cannot open another explorer’s film')
  # Actual Notes export/import retains the mixed work and resets Home panel ownership.
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();ready(p);p.locator('.home-options summary').tap();p.locator('.home-options a[href="#notes"]').tap();p.locator('#download').wait_for()
  with p.expect_download() as dl:p.locator('#download').tap()
  file=OUT/f'notes-{width}.json';dl.value.save_as(str(file));export=json.loads(file.read_text());ok(export['loft']['draft']['frames'][0]['dialogue']==expected['loft']['draft']['frames'][0]['dialogue'],'actual export retains puppet dialogue');ok(export['linearPathway']==expected['linearPathway'],'actual export retains math draft and support')
  p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId==='explorer-3'");home(p);ok(p.locator('[data-home-choice=continue]').get_attribute('aria-pressed')=='true','imported explorer selects its own retained work')
  p.locator('.home-options summary').tap();p.locator('.home-options a[href="#notes"]').tap();p.locator('#remember').uncheck();home(p);ok('Saving is off.' in p.locator('.home-save-note').text_content(),'save-off copy honest');panel(p,'questions');panel(p,'town');ok(not p.evaluate("Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"),'panel changes never recreate saves while saving off')
  print('Home',width,height,'passed',flush=True)
 finally:c.close()

def first_visit(b,base,seeds):
 fresh=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';console.log(JSON.stringify(initializeExplorerState(freshState())));"],cwd=ROOT,text=True))
 c,p=setup(b,base,{**seeds,'a':fresh},820,1000)
 try:
  p.locator('dialog.welcome-film[open]').wait_for();ok(True,'fresh first visit still launches actual storm film');p.locator('[data-film-skip]').tap();ready(p);ok('The storm has passed.' in p.locator('[data-home-entry] h1').text_content(),'fresh storm welcome');ok(p.locator('[data-home-choice=questions]').get_attribute('aria-pressed')=='true','fresh explorer has open curiosity, not invented pending work');panel(p,'continue');ok('No place is open here yet.' in p.locator('[data-home-panel=continue]').text_content(),'honest empty continuation');layout(p)
 finally:c.close()
 c,p=setup(b,base,seeds,820,1000,True)
 try:
  ok('could not be saved' in p.locator('[data-save-warning]').text_content().lower(),'denied saves visible');panel(p,'questions');panel(p,'town');ok(p.locator('.home-places a[href="#pathways"]').is_visible(),'denied storage does not lock learning entry')
 finally:c.close()

def main():
 seeds=fixture()
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*a):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('HOME_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    for width,height in [(320,600),(820,1000),(1024,768)]:journey(b,base,seeds,width,height)
    first_visit(b,base,seeds);ok(not errors,'no page errors '+str(errors));ok(not bad_requests,'no missing assets '+str(bad_requests));receipt={'checks':checks,'status':'passed','base':base,'limits':'Synthetic Chrome touch/keyboard and actual local transfer, not physical iPad/Safari, VoiceOver or learning outcomes.'};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
   finally:b.close()
 finally:server.shutdown()
if __name__=='__main__':main()
