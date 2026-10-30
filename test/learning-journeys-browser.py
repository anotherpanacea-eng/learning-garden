"""Native synthetic journey navigation, support provenance and local work preservation."""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('JOURNEY_ARTIFACTS',tempfile.mkdtemp(prefix='learning-journeys-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True

def seed():
 js="""import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import {nextGuest,adjustBite} from './dist/cafe-core.mjs';import {ingredients} from './dist/cafe-content.mjs';import {startLinear,setLinearField} from './dist/linear-pathway-core.mjs';import {linearLessons} from './dist/linear-pathway-content.mjs';const a=initializeExplorerState(freshState()),b=initializeExplorerState(freshState());a.garden.welcomeFilmSeen=true;b.garden.welcomeFilmSeen=true;nextGuest(a);adjustBite(a,ingredients[0].id,1);startLinear(a,linearLessons[0].id,{canExport:()=>true});const i=linearLessons[0].items[0];setLinearField(a,i.id,i.fields[0].id,'-2',{canExport:()=>true});a.syntheticFuture={payload:['keep',false]};console.log(JSON.stringify({a,b}));"""
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
def book(p,id='explorer-1'):return p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',id)
def ready(p):p.locator('[data-journeys]').wait_for()
def goto(p,route):p.evaluate('(r)=>location.hash=r',route)
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no horizontal overflow')
 for el in p.locator('[data-journeys] button:visible,[data-journeys] a:visible,[data-journeys] summary:visible').all():
  box=el.bounding_box();ok(box and box['width']>=43.9 and box['height']>=43.9,'44px control '+el.text_content()[:40])
def setup(b,base,seeds,width,height,route='#home',off=False):
 c=b.new_context(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True,reduced_motion='reduce')
 c.add_init_script("""(s=>{if(!localStorage.getItem('synthetic-journey')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-30T12:00:00Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'shell',createdAt:'2026-10-30T12:00:00Z'}]}));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(s.a));localStorage.setItem('number-garden-v1:explorer-2',JSON.stringify(s.b));localStorage.setItem('synthetic-journey','1');}window.journeyWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith('number-garden')||k==='learning-garden-explorers')journeyWrites++;return set.call(this,k,v);};})("""+json.dumps(seeds)+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+route,wait_until='networkidle');p.locator('[data-select-explorer=explorer-1]').tap()
 return c,p

def journey(b,base,seeds,width,height):
 c,p=setup(b,base,seeds,width,height)
 try:
  p.locator('[data-home-choice=questions]').tap();p.locator('a[href="#journeys"]').tap();ready(p)
  expected=seeds['a'];actual=book(p)
  ok(actual['cafe']==expected['cafe'] and actual['linearPathway']==expected['linearPathway'],'entering journey retains waiting plate and math draft')
  ok(actual['syntheticFuture']==expected['syntheticFuture'],'additive payload exact')
  ok('3x4' in actual['exposures'] and '4x3' in actual['exposures'],'shown array records both supported orientations')
  for choice in ['twelve','change']:
   p.locator(f'[data-journey={choice}]').tap();ready(p)
   for step in [3,1,0,2]:
    p.locator(f'[data-journey-stop="{step}"]').tap();ready(p)
    ok(p.locator('[data-journey-heading]').evaluate('e=>e===document.activeElement'),'deliberate step focuses heading')
    ok(p.locator(f'[data-journey-stop="{step}"]').get_attribute('aria-pressed')=='true','all stops open and selected')
    layout(p)
    if choice=='twelve' and step in [2,3]:
     boxes=p.locator('.journey-pair .journey-tiles i').evaluate_all('xs=>xs.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))')
     ok(len(boxes)==24 and all(abs(x['w']-boxes[0]['w'])<.1 and abs(x['w']-x['h'])<.1 for x in boxes),'comparison keeps the same square unit on both plots')
   p.screenshot(path=str(OUT/f'{choice}-{width}.png'),full_page=True)
  # Explicit preview keeps the actual waiting linear work.
  p.locator('.journey-sheet a[href="#learn/math/zero"]').tap();p.locator('[data-linear-root]').wait_for();ok(book(p)['linearPathway']==expected['linearPathway'],'lesson preview preserves current answers and draft')
  goto(p,'#journeys');ready(p);ok(p.locator('[data-journey-stop="2"]').get_attribute('aria-pressed')=='true','same-tab return retains local stop')
  # Actual keyboard activation, then visit existing board and return.
  p.locator('[data-journey=twelve]').focus();p.keyboard.press('Enter');p.locator('[data-journey-stop="1"]').tap();p.locator('.journey-sheet a[href="#post/groups"]').tap();p.locator('[data-eg-case="little-table"]').tap();p.locator('[data-eg-action]').first.wait_for();goto(p,'#journeys');ready(p)
  ok(p.locator('[data-journey-stop="1"]').get_attribute('aria-pressed')=='true','existing activity return retains itinerary stop')
  ok(book(p)['cafe']==expected['cafe'],'group display bookkeeping leaves waiting café order exact')
  p.evaluate("window.oldJourney=document.querySelector('[data-journey-stop=\"3\"]').onclick;window.oldJourneyButton=document.querySelector('[data-journey-stop=\"3\"]')")
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();goto(p,'#journeys');ready(p)
  before=book(p,'explorer-2');p.evaluate('oldJourney();oldJourneyButton.click()')
  ok(book(p,'explorer-2')==before,'stale first-owner actions never change second notebook')
  ok(p.locator('[data-journey=twelve]').get_attribute('aria-pressed')=='true' and p.locator('[data-journey-stop="0"]').get_attribute('aria-pressed')=='true','new owner resets local choice')
  p.locator('[data-journey=change]').tap();p.locator('[data-journey-stop="3"]').tap();p.reload(wait_until='networkidle');p.locator('[data-select-explorer=explorer-2]').tap();ready(p)
  ok(p.locator('[data-journey=twelve]').get_attribute('aria-pressed')=='true' and p.locator('[data-journey-stop="0"]').get_attribute('aria-pressed')=='true','reload resets local journey')
  goto(p,'#notes');p.locator('#download').wait_for()
  with p.expect_download() as dl:p.locator('#download').tap()
  exported=json.loads(Path(dl.value.path()).read_text());ok(not any('journey' in k.lower() for k in exported),'no journey progress schema in actual download')
  file=OUT/f'notes-{width}.json';dl.value.save_as(str(file));p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId==='explorer-3'");goto(p,'#journeys');ready(p);ok(p.locator('[data-journey-stop="0"]').get_attribute('aria-pressed')=='true','imported notebook gets fresh local journey')
  goto(p,'#notes');p.locator('#remember').uncheck();goto(p,'#journeys/unknown');ready(p)
  p.locator('[data-journey=change]').tap();p.locator('[data-journey-stop="1"]').tap();ok(not p.evaluate("Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"),'save-off teaching does not recreate browser notebooks')
  print('journeys',width,height,'passed',flush=True)
 finally:c.close()

def checkin(b,base,seeds):
 c,p=setup(b,base,seeds,820,1000,route='#journeys')
 try:
  ready(p);goto(p,'#multiplication');p.locator('#begin-checkin').tap();p.locator('#answer').wait_for();p.locator('#answer').fill('12');p.locator('#answer-form button[type=submit]').tap();p.locator('[data-method=knew]').tap();p.locator('#next').tap();actual=book(p)['baseline']['observations'][0]
  ok(actual['correct'] and actual['exposed'] and not actual['independent'],'journey directly to check-in cannot claim independent recall')
  ok(actual['method']=='knew','reported method remains distinct from prior exposure')
 finally:c.close()
 # A malformed exposure root must refuse examples without normalizing it.
 bad={**seeds,'a':{**seeds['a'],'broad':[]}}
 c,p=setup(b,base,bad,820,1000,route='#journeys/unknown')
 try:
  ready(p);ok('could not safely keep track' in p.locator('.journey-sheet').text_content(),'unsafe exposure shows local refusal')
  ok(book(p)['broad']==[],'unreadable original root stays exact');ok(not p.locator('.journey-picture').count(),'refused example is not revealed')
  p.locator('[data-journey=change]').tap();p.locator('[data-journey-stop="2"]').tap();ok(p.locator('.journey-picture').count()==1,'unrelated zero-fact lesson remains open')
 finally:c.close()

def main():
 seeds=seed();server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('JOURNEY_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
   try:
    for w,h in [(320,600),(820,1000),(1024,768)]:journey(b,base,seeds,w,h)
    checkin(b,base,seeds);ok(not errors,'no page errors '+str(errors));result={'checks':checks,'status':'passed','base':base,'limits':'Synthetic Chrome touch/keyboard and transfer; not physical iPad/Safari, VoiceOver or learning outcomes.'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
   finally:b.close()
 finally:server.shutdown()
if __name__=='__main__':main()
