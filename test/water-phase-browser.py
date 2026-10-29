"""Synthetic301 native Chrome controls; no app-module interception.
WATER_PHASE_TEST_URL targets a deployed build only after tracked-byte verification.
No physicaliPad/Safari, audible, screen-reader or learning-outcome claim.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('WATER_PHASE_ARTIFACTS',tempfile.mkdtemp(prefix='water-phase-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0
errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def click(p,a):p.locator(f'[data-phase-action="{a}"]').click()
def stage(p):return int(p.locator('.phase-stage').inner_text().split()[1])-1
def pose(p):return p.locator('[data-phase-dot]').evaluate_all('xs=>xs.map(g=>{const c=g.querySelector("[data-phase-symbol]");return [Number(g.dataset.phaseDot),g.dataset.phase,+c.getAttribute("cx"),+c.getAttribute("cy"),+c.getAttribute("r")];})')
def setup(b,base,seed,width,height=1000):
 c=b.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce')
 c.add_init_script('''(seed=>{if(!localStorage.getItem('phase-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-29T12:00:00.000Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'acorn',createdAt:'2026-10-29T12:00:00.000Z'}]}));for(const id of ['explorer-1','explorer-2'])localStorage.setItem('number-garden-v1:'+id,JSON.stringify(seed));localStorage.setItem('phase-fixture','1');}window.phaseWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1'))window.phaseWrites++;return set.call(this,k,v);};})('''+json.dumps(seed)+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));requests=[];p.on('request',lambda r:requests.append(r.url));p.goto(base+'#science/ice',wait_until='networkidle');ready(p,'explorer-1');return c,p,requests
def ready(p,owner):
 p.wait_for_selector('[data-water-phase-root],[data-select-explorer]')
 if p.locator(f'[data-select-explorer="{owner}"]').count():p.locator(f'[data-select-explorer="{owner}"]').click()
 p.locator('[data-water-phase-root]').wait_for()
 # Explorer selection renders this route after the initial navigation has settled.
 p.wait_for_function("getComputedStyle(document.querySelector('[data-phase-action=in]')).minHeight==='44px'")
def inspect(p,index):
 ds=pose(p);liquid=[0,0,4,8,12,12][index];ok(len(ds)==12 and len({d[0] for d in ds})==12,'twelve stable identities');ok([d[0] for d in ds if d[1]=='liquid']==list(range(1,liquid+1)),'nested liquid set matches actual drawing');ok(all(d[4]==7 for d in ds),'actual fixed radius');ok(p.locator('.phase-count').inner_text()==f'{12-liquid} in ice · {liquid} in liquid','count matches drawing');ok(p.locator('.phase-trace circle.selected').get_attribute('data-phase-trace')==str(index),'categorical trace highlights correct point');ok(p.locator('.phase-temperature .sr-only').inner_text()==['minus five degrees Celsius','zero degrees Celsius','zero degrees Celsius','zero degrees Celsius','zero degrees Celsius','plus five degrees Celsius'][index],'accessible temperature');
 for a,d in enumerate(ds):
  for e in ds[a+1:]:ok(((d[2]-e[2])**2+(d[3]-e[3])**2)**.5>=18,'rendered symbols do not overlap')
 ok(not any(t in p.locator('.phase-explanation').inner_text().lower() for t in ['has reached','more energy has entered','all the ice has melted']),'cooling never claims heating history')
def journey(b,base,seed,width,height):
 c,p,requests=setup(b,base,seed,width,height)
 try:
  raw=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");w=p.evaluate('phaseWrites');ok(json.loads(raw)['science']==seed['science'],'direct route keeps unsupported science unchanged');ok(not p.locator('video,audio,dialog.welcome-film[open]').count(),'no movie or automatic film');ok(not any('.mp4' in x or '.vtt' in x for x in requests),'no withheld media fetched');ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no sideways overflow')
  sizes=p.locator('[data-phase-action]').evaluate_all('xs=>xs.map(x=>x.getBoundingClientRect().height)');ok(all(x>=44 for x in sizes),'all game controls touch-sized')
  if width==820:ok(p.locator('[data-phase-action=in]').bounding_box()['y']+p.locator('[data-phase-action=in]').bounding_box()['height']<=height,'energy controls visible beside picture on tablet')
  inspect(p,0);initial=pose(p)
  for i in range(1,6):click(p,'in');ok(stage(p)==i,'energy in advances one categorical step');inspect(p,i)
  ok(p.locator('[data-phase-action=out]').evaluate('x=>x===document.activeElement'),'endpoint focus moves to available opposite control')
  for i in range(4,-1,-1):click(p,'out');ok(stage(p)==i,'energy out reverses same stages');inspect(p,i)
  ok(pose(p)==initial,'cooling returns identical ice coordinates and IDs');ok(p.locator('[data-phase-action=in]').evaluate('x=>x===document.activeElement'),'cold endpoint focus stays usable')
  for i in range(2,14):click(p,'follow');ok(p.locator('.phase-follow').inner_text()==f'Following particle {(i-1)%12+1}: in ice.','follow cycles exact stable identity')
  click(p,'in');click(p,'in');click(p,'follow');p.locator('[data-phase-details=table] summary').click();ok(p.locator('tbody tr').count()==6,'equivalent six-stage table');click(p,'in');ok(p.locator('[data-phase-details=table]').get_attribute('open') is not None,'disclosure survives model changes');click(p,'reset');ok(stage(p)==0 and 'particle 1:' in p.locator('.phase-follow').inner_text(),'reset restores both local controls');p.locator('[data-phase-action=in]').focus();p.keyboard.press('Enter');ok(stage(p)==1,'keyboard control equivalent');p.keyboard.press('Space');ok(stage(p)==2,'space activates focused button')
  ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==raw and p.evaluate('phaseWrites')==w,'all model controls leave unknown science and large sibling byte-for-byte unchanged')
  p.screenshot(path=str(OUT/f'phase-{width}.png'),full_page=True)
  p.evaluate('window.oldPhase=document.querySelector("[data-phase-action=in]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.locator('[data-water-phase-root]').wait_for();ok(stage(p)==0,'different explorer starts fresh model');p.evaluate('oldPhase.click()');ok(stage(p)==0,'old detached control cannot affect new explorer');ok(p.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-2')).science.version")==99,'switch preserves unsupported science root')
  click(p,'in');p.reload(wait_until='networkidle');ready(p,'explorer-2');ok(stage(p)==0,'reload resets only visit-local model');ok(p.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-2')).science.visits")== 'retained','direct reload keeps malformed science field')
 finally:c.close()
def entry(b,base):
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {startScience,openScienceExplanation,scienceFrame} from './dist/science-core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};startScience(s,'melt');openScienceExplanation(s);scienceFrame(s,1);console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 c,p,_=setup(b,base,seed,820)
 try:
  p.evaluate('location.hash="#science/play"');p.locator('.science-explanation').wait_for();raw=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");source=json.loads(raw)['science'];p.locator('.science-explanation a[href="#science/ice"]').click();p.locator('[data-water-phase-root]').wait_for();click(p,'in');click(p,'in');p.locator('.phase-room header a').click();p.locator('.science-explanation').wait_for();ok(json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"))['science']==source,'melt invitation and return retain actual original visit/frame/prediction');ok(p.locator('.science-frame-heading span').inner_text().startswith('Picture 2'),'return resumes exact original explanation picture')
 finally:c.close()
def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.science={version:99,visits:'retained'};s.syntheticOther={payload:'z'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('WATER_PHASE_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
  try:
   for width,height in [(320,1000),(820,1000),(1024,768)]:journey(b,base,seed,width,height)
   entry(b,base);ok(not errors,'no page errors '+str(errors));receipt={'status':'passed','checks':checks,'base':base,'limits':'native Chrome only; not physical iPad/Safari, screen-reader speech or learning outcomes'};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
  finally:b.close();server.shutdown()
if __name__=='__main__':main()
