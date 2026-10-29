"""Synthetic native Chrome journeys. Optional MILL_ENERGY_TEST_URL uses verified hosted bytes."""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('MILL_ENERGY_ARTIFACTS',tempfile.mkdtemp(prefix='mill-energy-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def button(p,action,value=None):return p.locator(f'[data-energy-action="{action}"]'+(f'[data-energy-value="{value}"]' if value is not None else ''))
def act(p,action,value=None):button(p,action,value).tap()
def counts(p):return [int(p.locator(f'[data-energy-count="{k}"]').text_content()) for k in ['waiting','moving','thermal','total']]
def ready(p):
 p.wait_for_selector('[data-energy-root],[data-select-explorer]')
 if p.locator('[data-select-explorer=explorer-1]').count():p.locator('[data-select-explorer=explorer-1]').tap()
 p.locator('[data-energy-root]').wait_for()
 p.wait_for_function("[...document.styleSheets].some(s=>s.href?.endsWith('/mill-energy.css')&&s.cssRules.length)")
 p.evaluate('async()=>{await document.fonts.ready}')
def pose(p):return p.locator('[data-energy-root]').evaluate("r=>({words:r.textContent,svg:[...r.querySelectorAll('svg')].map(x=>x.outerHTML),details:[...r.querySelectorAll('details')].map(x=>[x.dataset.energyDetails,x.open]),buttons:[...r.querySelectorAll('button')].map(x=>[x.textContent,x.disabled,x.getAttribute('aria-pressed')])})")
def setup(b,base,seed,width=820,reduce=True):
 c=b.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce' if reduce else 'no-preference')
 c.add_init_script('''(seed=>{if(!localStorage.getItem('synthetic-mill')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-29T12:00:00.000Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'acorn',createdAt:'2026-10-29T12:00:00.000Z'}]}));for(const id of ['explorer-1','explorer-2'])localStorage.setItem('number-garden-v1:'+id,JSON.stringify(seed));localStorage.setItem('synthetic-mill','1');}window.millWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1'))window.millWrites++;return set.call(this,k,v);};})('''+json.dumps(seed)+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));requests=[];p.on('request',lambda r:requests.append(r.url));p.goto(base+'#mill/energy',wait_until='networkidle');ready(p)
 return c,p,requests

def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 for el in p.locator('[data-energy-root] button,[data-energy-root] summary,[data-energy-root] a').all():
  if el.is_visible():
   r=el.bounding_box();ok(r['width']>=43.9 and r['height']>=43.9,'visible native target at least44px: '+str(el.text_content()))
 # Check actual font glyph extents in drawing coordinates, not just its viewBox.
 for svg in p.locator('[data-energy-scene],[data-energy-book]').all():
  if svg.is_visible():
   clipped=svg.evaluate("s=>[...s.querySelectorAll('text')].filter(t=>{const r=t.getBBox();return r.x<0||r.y<0||r.x+r.width>740||r.y+r.height>350}).map(t=>[t.textContent,t.getBBox().x,t.getBBox().y,t.getBBox().width,t.getBBox().height])")
   ok(not clipped,'no cropped SVG words '+str(clipped))
def goal(p,N,job):
 def repeat(a,n):
  for _ in range(n):act(p,a)
 if job==0:repeat('pour',N//4);repeat('grind',N//2)
 elif job==1:act(p,'pour');act(p,'gate');act(p,'grind')
 elif job==2:repeat('pour',N//2);repeat('rub',N)
 elif job==3:repeat('pour',(N//4+1)//2);repeat('rub',N//4)
 elif job==4:repeat('pour',N//4);repeat('grind',N//4);repeat('rub',N//4)
 else:repeat('pour',(N//4+1)//2);repeat('grind',N//4);repeat('rub',(N//4)%2);act(p,'gate')
 ok('This picture meets the request' in p.locator('.me-status').text_content(),'actual controls meet size/family '+str((N,job)))

def journey(b,base,seed,width):
 c,p,requests=setup(b,base,seed,width)
 try:
  raw=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");sibling=p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')");writes=p.evaluate('millWrites')
  ok(counts(p)==[8,0,0,8],'fresh visit ledger');ok(not p.locator('video').count() and not any('.mp4' in r for r in requests),'quiet cold entry does not start storm film');layout(p)
  if width>=820:
   p.evaluate('scrollTo(0,0)');ok(p.locator('[data-energy-scene]').bounding_box()['y']<1000 and button(p,'gate').bounding_box()['y']+button(p,'gate').bounding_box()['height']<1000,'picture and four primary actions in initial tablet viewport')
  act(p,'pour');ok(counts(p)==[6,2,0,8],'actual Pour');ok(p.locator('[data-energy-water-place=high]').count()==3 and p.locator('[data-energy-water-place=low]').count()==1,'poured matter stays in lower race')
  stale=button(p,'pour').element_handle();act(p,'grind');stale.evaluate('x=>x.click()');ok(counts(p)==[6,1,1,8],'detached control cannot mutate replacement DOM');act(p,'rub');ok(counts(p)==[6,0,2,8],'actual Rub')
  ok(p.evaluate('document.activeElement.dataset.energyAction')=='pour','disabled final Rub places focus on available Pour')
  for key in ['example','model','why']:p.locator(f'[data-energy-details="{key}"] summary').tap()
  act(p,'keep');act(p,'view','book');layout(p);ok(p.locator('[data-energy-book=current] [data-energy-chip]').count()==8,'all chips conserved in visible book')
  p.locator('[data-energy-details=held] summary').tap();saved=pose(p);act(p,'jobs');act(p,'return');ok(pose(p)==saved,'chooser roundtrip retains drawing/counts/details/held/last feedback')
  act(p,'size',16);ok(counts(p)==[16,0,0,16],'size has own picture');layout(p);ok(p.locator('[data-energy-book=held] [data-energy-chip]').count()==8,'kept reference retains separate batch')
  ok(p.locator('[data-energy-chip]').evaluate_all('xs=>xs.every(x=>x.getAttribute("width")==="18"&&x.getAttribute("height")==="18")'),'same square scale current/held')
  act(p,'pour');act(p,'size',8);ok(pose(p)==saved,'size roundtrip preserves exact previous picture');act(p,'view','scene');layout(p)
  p.locator('[data-energy-root]').screenshot(path=str(OUT/f'mill-scene-{width}.png'))
  act(p,'view','book');p.locator('[data-energy-root]').screenshot(path=str(OUT/f'mill-book-{width}.png'))
  # All eighteen requests through native touch, without module interception.
  for N in [8,12,16]:
   act(p,'size',N)
   for job in range(6):
    act(p,'jobs');act(p,'job',job);act(p,'restart');goal(p,N,job)
    ledger=counts(p);ok(sum(ledger[:3])==N and ledger[3]==N,'visible total conserved')
   ok(p.locator('.me-complete').count()==1,'six met milestone for size '+str(N))
  # A past nonmonotone success is distinct from what the present picture meets.
  act(p,'size',8);act(p,'jobs');act(p,'job',3);act(p,'pour');act(p,'grind');ok('met earlier' in p.locator('.me-status').text_content(),'past Rub success not false current success')
  act(p,'size',12);act(p,'fresh-six');ok(not p.locator('.me-complete').count() and counts(p)==[12,0,0,12],'fresh six clears only selected size')
  act(p,'size',16);ok(p.locator('.me-complete').count()==1,'other size milestone preserved');act(p,'clear');ok(not p.locator('.me-kept').count(),'clear only kept reference')
  ok(p.evaluate('millWrites')==writes and p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==raw and p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')")==sibling,'all actions preserve byte-exact owner/sibling future notebooks')
  old=button(p,'pour').element_handle();p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();ready(p);old.evaluate('x=>x.click()');ok(counts(p)==[8,0,0,8],'owner switch resets and old owner control cannot mutate')
  act(p,'pour');p.reload(wait_until='networkidle');ready(p);ok(counts(p)==[8,0,0,8],'reload is a fresh visit')
 finally:c.close()

def asynchronous(b,base,seed):
 c,p,_=setup(b,base,seed,820,False)
 try:
  button(p,'pour').focus();p.keyboard.press('Enter');ok(counts(p)==[6,2,0,8],'native Enter advances exactly once');p.wait_for_function("!document.querySelector('[data-energy-moving]')")
  button(p,'grind').focus();p.keyboard.press('Space');ok(counts(p)==[6,1,1,8],'native Space advances exactly once');p.wait_for_function("!document.querySelector('[data-energy-moving]')")
  # Programmatic dispatch only for precisely timed motion/cancellation, separate from native journeys.
  p.evaluate('document.querySelector("[data-energy-action=pour]").click()');ok(p.locator('[data-energy-moving]').count()==1,'optional motion starts');p.wait_for_timeout(60)
  a=float(p.locator('[data-energy-wheel]').get_attribute('data-energy-angle'));ok(30<a<45,'wheel has intermediate actual displayed angle')
  p.evaluate('document.querySelector("[data-energy-action=rub]").click()');a2=float(p.locator('[data-energy-wheel]').get_attribute('data-energy-angle'));ok(a2>=a,'rapid replacement begins from displayed pose')
  p.evaluate("document.dispatchEvent(new Event('garden-speak-request'))");ok(not p.locator('[data-energy-moving]').count(),'narration stops visual motion');ok(float(p.locator('[data-energy-wheel]').get_attribute('data-energy-angle'))==60,'cancel settles final pose')
  p.evaluate('document.querySelector("[data-energy-action=pour]").click();Object.defineProperty(document,"hidden",{configurable:true,value:true});document.dispatchEvent(new Event("visibilitychange"))');p.wait_for_timeout(220);ok(not p.locator('[data-energy-moving]').count(),'hidden page settles and stops');p.evaluate('Object.defineProperty(document,"hidden",{configurable:true,value:false})')
  for missing in ['matchMedia','requestAnimationFrame']:
   p.evaluate(f'window.{missing}=undefined');act(p,'grind');ok(not p.locator('[data-energy-moving]').count(),'missing '+missing+' gives immediate picture')
 finally:c.close()

def transfer_and_entry(b,base):
 script="""import {freshState} from './dist/core.mjs';import {startWorkshop,releaseWorkshop,stepWorkshop,finishWorkshop} from './dist/workshop-core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};startWorkshop(s);releaseWorkshop(s);stepWorkshop(s);stepWorkshop(s);finishWorkshop(s);s.syntheticOther={payload:'x'.repeat(550000)};console.log(JSON.stringify(s));"""
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True));c,p,_=setup(b,base,seed)
 try:
  p.evaluate('location.hash="#workshop"');p.locator('.workshop-page').wait_for();before=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"));p.locator('.workshop-page a[href="#mill/energy"]').tap();ready(p);act(p,'pour');p.locator('.me-room header a').tap();p.locator('.workshop-page').wait_for();after=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"));ok(before['workshop']==after['workshop'] and before['syntheticOther']==after['syntheticOther'],'Workshop entry and return preserve actual old work')
  p.evaluate('location.hash="#workshop/lantern"');p.locator('[data-lc-root]').wait_for();p.locator('a[href="#mill/energy"]').tap();ready(p);ok(counts(p)==[8,0,0,8],'Lantern entry reaches fresh table');act(p,'pour');old=button(p,'grind').element_handle()
  p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
  with p.expect_download() as download:p.locator('#download').tap()
  file=OUT/'synthetic-notes.json';download.value.save_as(str(file));ok(file.stat().st_size>550000,'real Notes export contains large unrelated work');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId!=='explorer-1'")
  owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");after=json.loads(p.evaluate("id=>localStorage.getItem('number-garden-v1:'+id)",owner));ok(after['workshop']==seed['workshop'] and after['syntheticOther']==seed['syntheticOther'],'real import retains healthy historical and large work')
  p.evaluate('location.hash="#mill/energy"');ready(p);old.evaluate('x=>x.click()');ok(counts(p)==[8,0,0,8],'import invalidates old owner control and starts fresh table');act(p,'pour');old=button(p,'grind').element_handle();sibling=p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')")
  p.evaluate('location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap()
  if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').tap()
  p.evaluate('location.hash="#mill/energy"');ready(p);old.evaluate('x=>x.click()');ok(counts(p)==[8,0,0,8],'actual reset starts a fresh visit and rejects detached control');ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')")==sibling,'explicit active reset preserves other explorer')
 finally:c.close()

def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:false};for(const k of ['science','workshop','fairTests','bellStudio','rhythm','lanternCircuits'])s[k]={version:99,future:'retained'};s.syntheticOther={payload:'z'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('MILL_ENERGY_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
  try:
   for width in [320,820,1024]:journey(b,base,seed,width);print('mill width',width,'passed',flush=True)
   asynchronous(b,base,seed);transfer_and_entry(b,base);ok(not errors,'no native page errors '+str(errors));receipt={'status':'passed','checks':checks,'base':base,'limits':'Synthetic Chrome touch/keyboard, not physical iPad/Safari, human comprehension or learning outcomes'};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
  finally:b.close();server.shutdown()
if __name__=='__main__':main()
