"""Synthetic306 native Chrome. Shared real305 fixture helpers, no app interception.
LEVER_DELIVERIES_TEST_URL targets verified deployed bytes only. Not physical iPad/Safari.
"""
import sys
sys.dont_write_bytecode=True
import importlib.util,functools,http.server,json,math,os,re,subprocess,tempfile,threading
from pathlib import Path
spec=importlib.util.spec_from_file_location('ramp_journeys',Path(__file__).with_name('lift-yard-browser.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
ROOT=m.ROOT;OUT=Path(os.environ.get('LEVER_DELIVERIES_ARTIFACTS',tempfile.mkdtemp(prefix='lever-')));OUT.mkdir(parents=True,exist_ok=True);m.OUT=OUT;ok=m.ok

def click(p,a,value=None):p.locator(f'[data-lever-action="{a}"]'+(f'[data-lever-value="{value}"]' if value is not None else '')).click()
def mode(p,value):m.click(p,'mode',value);ready(p) if value=='lever' else m.css(p)
def ready(p):
 p.locator('.ly-lever').wait_for();p.wait_for_function("getComputedStyle(document.querySelector('.ly-lever .ly-tag')||document.querySelector('.ly-lever')).fontSize==='14.4px'||!document.querySelector('.ly-tag')&&[...document.styleSheets].some(s=>s.href?.endsWith('/lift-lever.css')&&s.cssRules.length>0)");m.css(p)
def equipment(p):
 t=p.locator('.ly-tag').inner_text();r=re.search(r'Load weight: (\d+) N · Push unit can provide up to (\d+) N · Space from the pivot for the push side: (\d+) m',t);return tuple(map(int,r.groups()))
def geometry(p,r,d):
 a,b={1:(6,6),2:(4,8),3:(3,9)}[r]
 g=p.locator('[data-lever-drawing]').evaluate(r'''s=>{const n=t=>(t.match(/[-+]?[0-9]+(?:[.][0-9]+)?(?:e[-+]?[0-9]+)?/gi)||[]).map(Number),line=n(s.querySelector('[data-lever-centreline]').getAttribute('d')),h=s.querySelector('[data-lever-handle]'),c=s.querySelector('[data-lever-load]').transform.baseVal.consolidate().matrix;return {line,e:[+h.getAttribute('cx'),+h.getAttribute('cy')],c:[c.e,c.f],pole:n(s.querySelector('[data-lever-pole]').getAttribute('points')),labels:[...s.querySelectorAll('[data-lever-arm-label]')].map(t=>{const b=t.getBBox();return {kind:t.dataset.leverArmLabel,x:+t.getAttribute('x'),y:+t.getAttribute('y'),box:[b.x,b.y,b.width,b.height]}}),arrow:n(s.querySelector('[data-lever-push-arrow]').getAttribute('d')),force:+s.querySelector('[data-lever-force]').getAttribute('height'),bracket:s.querySelector('[data-lever-drop-bracket]').getAttribute('d'),arc:s.querySelector('[data-lever-end-path]').getAttribute('d')}}''')
 ex,ey,tx,ty=g['line'];d=(ey-145)/40 if d is None else d;ok(abs(math.hypot(tx-ex,ty-ey)-480)<.0001,'actual rigid480-unit pole');ok(abs(ey-145-40*d)<.0001 and abs(145-ty-40*d/r)<.0001,'vertical displacement relation');ok(abs(math.hypot(ex-380,ey-145)-40*b)<.0001 and abs(math.hypot(tx-380,ty-145)-40*a)<.0001,'actual fixed arm lengths');ok(abs(g['c'][0]-tx)<.0001 and abs(g['c'][1]-ty-28)<.0001,'actual hanger/load attachment');ok(ey+9<=274 and g['arrow'][2]+.75<=297.7501,'load/arrow above ground')
 ux,uy=(tx-ex)/480,(ty-ey)/480;nx,ny=-uy,ux
 for label in g['labels']:
  end=(ex,ey) if label['kind']=='push' else (tx,ty);ok(abs(label['x']-((380+end[0])/2-30*nx))<.0001 and abs(label['y']-((145+end[1])/2-30*ny))<.0001,'arm labels follow current actual pole')
  bx,by,bw,bh=label['box'];corners=[(bx,by),(bx+bw,by),(bx,by+bh),(bx+bw,by+bh)];signed=[(x-380)*nx+(y-145)*ny for x,y in corners];ok(max(signed)<-5.5,f'actual text box clears pole plus stroke: r{r},d{d},label{label},signed{signed}')
 ok(all(0<=label['box'][0] and label['box'][0]+label['box'][2]<=740 for label in g['labels']),'labels stay in viewport');return g

def journey(browser,base,seed,width):
 c,p=m.setup(browser,base,seed,width)
 try:
  raw=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");writes=p.evaluate('liftWrites');mode(p,'lever');ok('Try a lever' in p.locator('.ly-room header').inner_text(),'machine-specific introduction');m.layout(p)
  if width==820:
   rect=p.locator('[data-lever-action=start]').bounding_box();ok(rect['y']+rect['height']<=1000,'first lever action and scene together on tablet')
  p.screenshot(path=str(OUT/f'lever-start-{width}.png'),full_page=True)
  seen=set()
  for shift in range(3):
   for slot in range(6):
    if shift or slot:click(p,'jobs');click(p,'job',slot);ready(p)
    w,cap,space=equipment(p);seen.add((w,cap,space))
    for r in [1,2,3]:
     click(p,'pivot',r);ready(p);geometry(p,r,0);m.layout(p);ok(p.locator('[data-lever-action=keep]').count()==0,'fresh key never invents waiting trip');click(p,'view','numbers');ok(p.locator('[data-lift-cell=current]').count()==w and p.locator('[data-lift-cell=current][data-filled=true]').count()==0,'actual current work cells');ok('Vertical push drop (m)' in p.locator('[data-lift-work-picture]').text_content(),'lever axis direction');click(p,'view','yard')
    r=next(r for r in [1,2,3] if 12*r/(r+1)<=space and w/r<=cap);click(p,'pivot',r);click(p,'start')
    for d in range(1,r+1):click(p,'push');geometry(p,r,d);ok(p.locator('[data-lever-distance]').inner_text()==f'{d} of {r} m','explicit one-metre push');ok(not p.locator('[data-lever-moving]').count(),'reduced motion immediate endpoint')
    ok(p.locator('[data-lever-action=push]').is_disabled() and p.evaluate('document.activeElement.dataset.leverAction')=='next','endpoint gate/focus');click(p,'hold');ok(f'{w/r:g} N downwards through {r} m' in p.locator('.ly-held').inner_text(),'typed lever held values');click(p,'view','numbers');ok(p.locator('[data-lift-cell=held][data-filled=true]').count()==w,'held completed work cells');click(p,'view','yard')
   ok(p.locator('.ly-complete').count()==1,'own lever shift milestone');p.screenshot(path=str(OUT/f'lever-complete-{width}.png'),full_page=True) if shift==0 else None;held=p.locator('.ly-held p').first.inner_text();click(p,'shift');ok(p.locator('.ly-held p').first.inner_text()==held and not p.locator('.ly-complete').count(),'new lever shift keeps shared reference and clears own win')
  ok(len(seen)==17,'all17 cases in native changing shifts');ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==raw and p.evaluate('liftWrites')==writes,'all controls leave Bell/Rhythm/science/unknown/large siblings unchanged')
  p.evaluate('window.oldLever=document.querySelector("[data-lever-action=start]")');mode(p,'ramp');p.evaluate('oldLever.click()');ok(p.locator('[data-lift-action=start]').count()==1,'old lever control cannot mutate ramp');mode(p,'lever');ok(p.locator('[data-lever-action=start]').count()==1,'switch retains unstarted lever');p.locator('#explorer-switch').click();p.locator('[data-select-explorer=explorer-2]').click();m.ready(p,'explorer-2');ok(not p.locator('.ly-lever').count(),'new explorer starts fresh ramp mode');p.evaluate('oldLever.click()');mode(p,'lever');ok(p.locator('[data-lever-distance]').inner_text()=='0 of 1 m','detached previous-owner control rejected');p.reload(wait_until='networkidle');m.ready(p,'explorer-2');ok(not p.locator('.ly-lever').count() and json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')"))==seed,'reload starts ramp and preserves saved owners')
 finally:c.close()

def spiral(browser,base,seed):
 c,p=m.setup(browser,base,seed,820)
 try:
  m.click(p,'start');m.click(p,'pull');m.click(p,'jobs');ok('current trip 1 of 2 m rope pulled' in p.locator('.ly-jobs').inner_text(),'ramp progress is a count, not a fractional metre');m.click(p,'job',0);p.evaluate('window.oldRamp=document.querySelector("[data-lift-action=pull]")');mode(p,'lever');p.evaluate('oldRamp.click()');ok(p.locator('[data-lever-action=start]').count()==1,'detached ramp cannot start lever');click(p,'pivot',3);click(p,'start');[click(p,'push') for _ in range(3)];click(p,'hold');click(p,'jobs');click(p,'job',1);click(p,'pivot',2);click(p,'start');click(p,'push');click(p,'plan');click(p,'pivot',3);p.locator('[data-lever-details=lever-model] summary').click();click(p,'jobs');ok('current trip 1 of 2 m pushed down' in p.locator('.ly-jobs').inner_text(),'lever progress is a count, not a fractional metre');click(p,'job',1);mode(p,'ramp');ok(p.locator('[data-lift-distance]').inner_text()=='1 of 2 m','partial ramp retained across tool switch');ok('Held completed lever trip' in p.locator('.ly-held').inner_text() and '4 N vertically down 3 m' in p.locator('.ly-held').inner_text(),'ramp consumes typed lever reference');m.click(p,'view','numbers');ok('Vertical push drop (m)' in p.locator('[data-lift-grid=held]').text_content() and 'Rope distance (m)' in p.locator('[data-lift-grid=current]').text_content(),'both input directions in one figure');ok('Held completed lever trip' in p.locator('[data-lift-work-picture] desc').text_content(),'typed accessible description')
  for slot in range(6):
   m.click(p,'jobs');m.click(p,'job',slot)
   if p.locator('[data-lift-action=plan]').count():m.click(p,'plan')
   w,cap,boards=m.equipment(p);L=next(L for L in [2,3,4,6] if L in boards and w/L<=cap);m.click(p,'board',L);m.click(p,'start');distance=int(p.locator('[data-lift-distance]').inner_text().split()[0]);[m.click(p,'pull') for _ in range(L-distance)]
  ok(p.locator('.ly-complete').count()==1,'ramp own win');m.click(p,'shift');mode(p,'lever');ok(p.locator('[data-lever-action=pivot][data-lever-value="3"]').get_attribute('aria-pressed')=='true' and p.locator('[data-lever-details=lever-model]').get_attribute('open') is not None,'ramp shift preserves lever draft/detail');click(p,'keep');ok(p.locator('[data-lever-distance]').inner_text()=='1 of 2 m','ramp shift preserves active lever checkpoint');ok('4 N downwards through 3 m' in p.locator('.ly-held').inner_text(),'ramp shift keeps lever reference kind/drop');ok(not p.locator('.ly-complete').count(),'ramp win never displayed as lever win')
  # Reverse reference direction and an invalid current lever draft.
  mode(p,'ramp');m.click(p,'jobs');m.click(p,'job',1);m.click(p,'board',4);m.click(p,'start');[m.click(p,'pull') for _ in range(4)];m.click(p,'hold');mode(p,'lever');click(p,'plan');click(p,'pivot',1);click(p,'start');ok(p.evaluate('document.activeElement.id')=='lever-notice','refusal focus');ok('Current planned lever: 12 N vertically down 1 m' in p.locator('.ly-held').inner_text() and 'Held ramp:' in p.locator('.ly-held').inner_text(),'unstartable planned lever against held ramp explicit');ok('Your 8 m push arm / 4 m load arm trip waits at 1 of 2 m' in p.locator('.ly-console').inner_text(),'waiting label uses active arms');click(p,'view','numbers');ok('Vertical push drop (m)' in p.locator('[data-lift-grid=current]').text_content() and 'Rope distance (m)' in p.locator('[data-lift-grid=held]').text_content(),'reverse reference axes');ok('Current planned lever' in p.locator('[data-speak]').get_attribute('data-speak'),'narration labels planned trip');p.screenshot(path=str(OUT/'lever-cross-machine.png'),full_page=True)
  # Large-sibling, active import and reset use the real Notes UI.
  p.evaluate('window.preLeverImport=document.querySelector("[data-lever-action=start]")');p.evaluate('location.hash="#notes"');p.locator('#progress-file').wait_for()
  with p.expect_download() as download:p.locator('#download').click()
  file=OUT/'synthetic-lever-notes.json';download.value.save_as(str(file));ok(file.stat().st_size>550000,'real Notes file retains large sibling');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId!=='explorer-1'");owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.evaluate('location.hash="#workshop/lift"');m.ready(p,owner);p.evaluate('preLeverImport.click()');mode(p,'lever');ok(p.locator('[data-lever-distance]').inner_text()=='0 of 1 m','import rejects stale lever and resets both operations');data=json.loads(p.evaluate("id=>localStorage.getItem('number-garden-v1:'+id)",owner));ok(data['syntheticOther']==seed['syntheticOther'] and data['bellStudio']==seed['bellStudio'] and data['rhythm']==seed['rhythm'],'real import preserves large Bell/Rhythm siblings')
 finally:c.close()

def movement(browser,base,seed):
 c,p=m.setup(browser,base,seed,820,False)
 try:
  mode(p,'lever');click(p,'pivot',3);click(p,'start');p.evaluate('document.querySelector("[data-lever-action=push]").click()');p.wait_for_selector('[data-lever-moving]');p.wait_for_timeout(55);g=geometry(p,3,None);ok(145<g['e'][1]<185,'actual intermediate pose');p.evaluate('document.querySelector("[data-lever-action=push]").click()');p.wait_for_function("!document.querySelector('[data-lever-moving]')");geometry(p,3,2);p.evaluate('document.querySelector("[data-lever-action=push]").click();document.dispatchEvent(new CustomEvent("garden-speak-request",{detail:{text:"",language:"en"}}))');ok(not p.locator('[data-lever-moving]').count(),'narration cancels finite movement');geometry(p,3,3);click(p,'bottom');ok(not p.locator('[data-lever-moving]').count(),'return to bottom static');p.evaluate('window.savedMedia=window.matchMedia;window.matchMedia=undefined;document.querySelector("[data-lever-action=push]").click()');ok(not p.locator('[data-lever-moving]').count(),'labelled missing-matchMedia fallback');geometry(p,3,1);p.evaluate('window.matchMedia=savedMedia');p.evaluate('document.querySelector("[data-lever-action=push]").click();window.dispatchEvent(new Event("pagehide"))');ok(not p.locator('[data-lever-moving]').count(),'pagehide cancels finite movement');geometry(p,3,2);mode(p,'ramp');p.wait_for_timeout(220);ok(not p.locator('[data-lever-drawing]').count(),'stale lever frame cannot redraw ramp');p.evaluate('location.hash="#science/ice"');p.locator('[data-water-phase-root]').wait_for();p.evaluate('location.hash="#workshop/lift"');m.ready(p);mode(p,'lever');ok(p.locator('[data-lever-distance]').inner_text()=='0 of 1 m','route leave resets both visits')
 finally:c.close()

def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.workshop={version:99,opaque:'kept'};s.fairTests={version:99,opaque:'kept'};s.science={version:99,opaque:'kept'};s.bellStudio={version:99,opaque:'kept'};s.rhythm={version:99,opaque:'kept'};s.syntheticOther={payload:'z'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('LEVER_DELIVERIES_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with m.sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
   try:
    for width in[320,820,1024]:journey(browser,base,seed,width);print('lever catalogue width',width,'passed',flush=True)
    spiral(browser,base,seed);movement(browser,base,seed);ok(not m.errors,'no page errors '+str(m.errors));print(m.checks,'lever native assertions passed; no physical-device/learner claim',flush=True)
   finally:browser.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
