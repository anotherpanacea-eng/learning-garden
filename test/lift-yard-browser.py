"""Synthetic305 native Chrome journeys. No app-module interception.
LIFT_YARD_TEST_URL is for deployed bytes only after all-file verification.
Actual rendered geometry, finite motion and native ownership/save transfer; no iPad claim.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,math,os,subprocess,tempfile,threading,re
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('LIFT_YARD_ARTIFACTS',tempfile.mkdtemp(prefix='lift-yard-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def click(p,a,value=None):
 sel=f'[data-lift-action="{a}"]'+(f'[data-lift-value="{value}"]' if value is not None else '')
 p.locator(sel).click()
def ready(p,owner='explorer-1'):
 p.wait_for_selector('[data-lift-root],[data-select-explorer]')
 if p.locator(f'[data-select-explorer="{owner}"]').count():p.locator(f'[data-select-explorer="{owner}"]').click()
 p.locator('[data-lift-root]').wait_for();css(p)
def css(p):p.wait_for_function("[...document.querySelectorAll('[data-lift-root] button')].every(b=>getComputedStyle(b).minHeight==='44px')")
def setup(b,base,seed,width,reduce=True):
 c=b.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce' if reduce else 'no-preference')
 c.add_init_script('''(seed=>{if(!localStorage.getItem('lift-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-29T12:00:00.000Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'acorn',createdAt:'2026-10-29T12:00:00.000Z'}]}));for(const id of ['explorer-1','explorer-2'])localStorage.setItem('number-garden-v1:'+id,JSON.stringify(seed));localStorage.setItem('lift-fixture','1');}window.liftWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1'))window.liftWrites++;return set.call(this,k,v);};})('''+json.dumps(seed)+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+'#workshop/lift',wait_until='networkidle');ready(p);return c,p

def equipment(p):
 m=re.search(r'Load weight: (\d+) N · Winch can pull up to (\d+) N · Boards available: ([\d, ]+) m',p.locator('.ly-tag').inner_text());return int(m[1]),int(m[2]),[int(n) for n in m[3].split(',')]
def layout(p):
 css(p);ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no horizontal overflow')
 for r in p.locator('[data-lift-root] button').evaluate_all('xs=>xs.map(b=>{const r=b.getBoundingClientRect();return [r.width,r.height]})'):ok(min(r)>=43.9,'current controls44px')
def geom(p,L,d,w):
 actual=p.locator('[data-lift-drawing]').evaluate(r'''s=>{const line=s.querySelector('[data-lift-slope]').getAttribute('d').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number),dr=s.querySelector('[data-lift-drum]').transform.baseVal.consolidate().matrix,r=s.querySelector('[data-lift-rope]');return {line,c:[dr.e,dr.f],r:['x1','y1','x2','y2'].map(k=>+r.getAttribute(k)),force:+s.querySelector('[data-lift-force]').getAttribute('height'),marks:s.querySelectorAll('[data-lift-metre]').length}}''')
 fx,fy,tx,ty=actual['line'];cx,cy=actual['c'];u=((tx-fx)/(80*L),(ty-fy)/(80*L));n=(u[1],-u[0]);a=actual['r']
 ok(abs(math.hypot(tx-fx,ty-fy)-80*L)<1e-4 and fy-ty==80,'actual ramp sloped length/fixed rise');ok(abs(cx-18*n[0]-fx-80*d*u[0])<1e-4 and abs(cy-18*n[1]-fy-80*d*u[1])<1e-4,'actual drum contact and checkpoint');ok(abs((a[2]-a[0])*u[1]-(a[3]-a[1])*u[0])<1e-4 and abs(math.hypot(a[0]-cx,a[1]-cy)-18)<1e-4,'actual rope parallel/attached');ok(cy+18<286 and math.hypot(a[2]-cx,a[3]-cy)>=64-1e-4,'ground and winch clear');ok(actual['force']==w/L*10 and actual['marks']==L+1,'fixed force scale/unit marks')

def journey(b,base,seed,width):
 c,p=setup(b,base,seed,width)
 try:
  raw=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");writes=p.evaluate('liftWrites');ok(json.loads(raw)==seed,'direct entry preserves all unknown owners');ok(not p.locator('video,audio,dialog.welcome-film[open]').count(),'no movie or automatic welcome');layout(p)
  spoken=p.locator('[data-speak]').get_attribute('data-speak');ok(spoken.startswith('The shops need dry stores after the storm. ') and spoken.count('The shops need dry stores after the storm.')==1,'ramp Hear text gives the Willowbank reason once (text only, not audibility)')
  if width==820:
   r=p.locator('[data-lift-action=start]').bounding_box();ok(r['y']+r['height']<=1000,'scene instruction and primary plan action visible together on tablet')
  p.screenshot(path=str(OUT/f'lift-start-{width}.png'),full_page=True)
  # First fresh refusal has no fictitious trip; partial-trip preview really restores it.
  click(p,'board',6);click(p,'start');ok('still waiting' not in p.locator('.ly-notice').inner_text() and not p.locator('[data-lift-action=keep]').count(),'fresh refusal never invents a trip');click(p,'board',2);click(p,'start');click(p,'pull');click(p,'plan');click(p,'board',6);click(p,'start');ok('still waiting' in p.locator('.ly-notice').inner_text(),'started refusal preserves trip');ok('Starting this ramp ends' not in p.locator('.ly-console').inner_text(),'invalid draft has no contradictory replacement warning');click(p,'jobs');click(p,'job',1);click(p,'view','numbers');click(p,'jobs');click(p,'job',0);click(p,'keep');ok(p.locator('[data-lift-distance]').inner_text()=='1 of 2 m','partial trip survives tags/different view/invalid preview');click(p,'view','yard');geom(p,2,1,12);click(p,'bottom');click(p,'plan')
  seen=set()
  for shift in range(5):
   for slot in range(6):
    if slot or shift:click(p,'jobs');click(p,'job',slot)
    w,cap,boards=equipment(p);seen.add((w,cap,max(boards)))
    if p.locator('[data-lift-action=plan]').count():click(p,'plan')
    for L in [2,3,4,6]:
     click(p,'board',L);css(p);geom(p,L,0,w);ok(f'{w/L:g} N' in p.locator('.ly-preview').inner_text(),'calculated pull visible');ok(bool(p.locator('.ly-unsupplied').count())==(L not in boards),'actual unsupplied planned board');layout(p)
     click(p,'view','numbers');cells=p.locator('[data-lift-cell=current]');ok(cells.count()==w and p.locator('[data-lift-cell=current][data-filled=true]').count()==0,'actual work cell count and fresh fill');ok(cells.evaluate_all('xs=>xs.every(c=>c.getAttribute("width")==="18"&&c.getAttribute("height")==="18")'),'fixed work cell size');click(p,'view','yard')
    L=next(L for L in [2,3,4,6] if L in boards and w/L<=cap);click(p,'board',L);click(p,'start')
    for d in range(1,L+1):
     click(p,'pull');geom(p,L,d,w);ok(p.locator('[data-lift-distance]').inner_text()==f'{d} of {L} m','one pull one metre');ok(not p.locator('[data-lift-moving]').count(),'reduced motion immediate pose')
    ok(p.locator('[data-lift-action=pull]').is_disabled(),'top stops further pulls');ok(p.evaluate('document.activeElement.dataset.liftAction')=='next','endpoint focus to usable next');click(p,'hold');ok(f'{w} J whole-trip work' in p.locator('.ly-held').inner_text(),'held full work visible');click(p,'view','numbers');ok(p.locator('[data-lift-cell=held][data-filled=true]').count()==w,'held grid fully filled');click(p,'view','yard')
    if shift==0 and slot==0:
     click(p,'bottom');ok(not p.locator('[data-lift-action=next]').count(),'earlier delivery does not falsely enable next');click(p,'pull');click(p,'pull');click(p,'jobs');ok('1 reached the top' in p.locator('.ly-jobs h2').inner_text(),'replay counts delivery once');click(p,'job',0)
   ok(p.locator('.ly-complete').count()==1,'six jobs yield shift win');p.screenshot(path=str(OUT/f'lift-complete-{width}.png'),full_page=True) if shift==0 else None
   held=p.locator('.ly-held p').first.inner_text();click(p,'shift');ok(p.locator('.ly-held p').first.inner_text()==held,'explicit new shift keeps held trip');ok(not p.locator('.ly-complete').count() and '0 of 2 m'==p.locator('[data-lift-distance]').inner_text(),'new shift starts six fresh jobs')
  ok(len(seen)==28,'native changing shifts cover every catalogue case')
  p.locator('[data-lift-details=model] summary').click();click(p,'board',4);ok(p.locator('[data-lift-details=model]').get_attribute('open') is not None,'disclosure survives redraw');p.locator('[data-lift-action=board][data-lift-value="2"]').focus();p.keyboard.press('Enter');ok(p.locator('[data-lift-action=board][data-lift-value="2"]').get_attribute('aria-pressed')=='true','keyboard equivalent')
  ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==raw and p.evaluate('liftWrites')==writes,'whole catalogue controls write no saved owners')
  p.evaluate('window.oldLift=document.querySelector("[data-lift-action=start]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p,'explorer-2');p.evaluate('oldLift.click()');ok(p.locator('[data-lift-action=start]').count()==1,'detached control cannot start new owner');p.reload(wait_until='networkidle');ready(p,'explorer-2');ok(p.locator('[data-lift-distance]').inner_text()=='0 of 2 m' and json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')"))==seed,'reload resets yard only')
 finally:c.close()

def motion(b,base,seed):
 c,p=setup(b,base,seed,820,False)
 try:
  click(p,'start');p.evaluate('document.querySelector("[data-lift-action=pull]").click()');p.wait_for_selector('[data-lift-moving]');a=p.locator('[data-lift-drum]').get_attribute('transform');p.wait_for_timeout(55);bpose=p.locator('[data-lift-drum]').get_attribute('transform');ok(a!=bpose,'actual finite user-triggered movement');p.evaluate('document.querySelector("[data-lift-action=pull]").click()');p.wait_for_function("!document.querySelector('[data-lift-moving]')");geom(p,2,2,12);ok(p.locator('[data-lift-distance]').inner_text()=='2 of 2 m','rapid pull reaches correct checkpoint without delayed model writes');click(p,'bottom');ok(not p.locator('[data-lift-moving]').count(),'return to bottom immediate');p.evaluate('document.querySelector("[data-lift-action=pull]").click();document.dispatchEvent(new CustomEvent("garden-speak-request",{detail:{text:"",language:"en"}}))');ok(not p.locator('[data-lift-moving]').count(),'narration cancels and settles UI motion');geom(p,2,1,12)
  click(p,'bottom');p.evaluate('document.querySelector("[data-lift-action=pull]").click();window.dispatchEvent(new Event("pagehide"))');ok(not p.locator('[data-lift-moving]').count(),'pagehide cancels finite movement');geom(p,2,1,12)
  p.evaluate('location.hash="#science/ice"');p.locator('[data-water-phase-root]').wait_for();p.wait_for_timeout(220);ok(not p.locator('[data-lift-root]').count(),'old motion cannot redraw another room');p.evaluate('location.hash="#workshop/lift"');ready(p);ok(p.locator('[data-lift-distance]').inner_text()=='0 of 2 m','leaving exact route resets yard')
 finally:c.close()

def transfer(b,base):
 script="""import {freshState} from './dist/core.mjs';import {startWorkshop,releaseWorkshop,stepWorkshop,finishWorkshop} from './dist/workshop-core.mjs';import {startFair,revealFair,setFairPage,keepFair} from './dist/fair-test-core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};startWorkshop(s);releaseWorkshop(s);stepWorkshop(s);stepWorkshop(s);finishWorkshop(s);startFair(s);revealFair(s,'A');revealFair(s,'B');keepFair(s);setFairPage(s,'tell');s.syntheticOther={payload:'x'.repeat(550000)};console.log(JSON.stringify(s));"""
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True));c,p=setup(b,base,seed,820)
 try:
  for route,selector in [('#workshop','.workshop-page'),('#workshop/fair','.fair-page')]:
   p.evaluate('(r)=>location.hash=r',route);p.locator(selector).wait_for();before=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"));p.locator(f'{selector} a[href="#workshop/lift"]').click();ready(p);click(p,'start');click(p,'pull');p.locator('.ly-room header a' if route=='#workshop' else '.ly-exit').click();p.locator(selector).wait_for();after=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"));ok(after['workshop']==before['workshop'] and after['fairTests']==before['fairTests'],'actual old Workshop/Fair source work and page preserved on entry/return');ok(after['syntheticOther']==before['syntheticOther'],'large sibling survives real legacy navigation')
  p.evaluate('location.hash="#workshop/lift"');ready(p);click(p,'start');click(p,'pull');p.evaluate('window.preImportLift=document.querySelector("[data-lift-action=pull]")');p.evaluate('location.hash="#notes"');p.locator('#progress-file').wait_for();export=p.locator('#download');
  with p.expect_download() as download:export.click()
  file=OUT/'synthetic-notes.json';download.value.save_as(str(file));data=json.loads(file.read_text());ok(file.stat().st_size>550000,'real Notes export contains large sibling')
  p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId!=='explorer-1'");owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");after=json.loads(p.evaluate("id=>localStorage.getItem('number-garden-v1:'+id)",owner));ok(after['workshop']==seed['workshop'] and after['fairTests']==seed['fairTests'] and after['syntheticOther']==seed['syntheticOther'],'real Notes import preserves healthy historical work and large sibling');p.evaluate('location.hash="#workshop/lift"');ready(p,owner);p.evaluate('preImportLift.click()');ok(p.locator('[data-lift-distance]').inner_text()=='0 of 2 m' and p.locator('[data-lift-action=start]').count()==1,'import starts fresh yard and rejects old control')
 finally:c.close()

def reset_flow(b,base,seed):
 c,p=setup(b,base,seed,820)
 try:
  click(p,'start');click(p,'pull');p.evaluate('window.preResetLift=document.querySelector("[data-lift-action=pull]")');other=p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')")
  p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click()
  if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').click()
  p.evaluate('location.hash="#workshop/lift"');ready(p);p.evaluate('preResetLift.click()');ok(p.locator('[data-lift-distance]').inner_text()=='0 of 2 m' and p.locator('[data-lift-action=start]').count()==1,'global reset invalidates old trip/control');ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')")==other,'explicit active reset leaves other explorer unchanged')
 finally:c.close()

def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.workshop={version:99,opaque:'retained'};s.fairTests={version:99,opaque:'retained'};s.science={version:99,opaque:'retained'};s.bellStudio={version:99,opaque:'retained'};s.rhythm={version:99,opaque:'retained'};s.syntheticOther={payload:'z'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('LIFT_YARD_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
   try:
    for width in [320,820,1024]:journey(b,base,seed,width);print('catalogue width',width,'passed',flush=True)
    motion(b,base,seed);transfer(b,base);reset_flow(b,base,seed);ok(not errors,'no page errors '+str(errors));print(checks,'Lift Yard native assertions passed; no physical-device/learning claim',flush=True)
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
