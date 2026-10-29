"""Synthetic303 journeys with real native Chrome controls/decoding.
Optional WATER_FILM_TEST_URL targets deployed bytes after verification.
Fault cases are separate from the normal movie journey. No app-module interception.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('WATER_FILM_ARTIFACTS',tempfile.mkdtemp(prefix='water-film-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def click(p,a):p.locator(f'[data-phase-action="{a}"]' if a in ['watch','return','in','out','follow','reset'] else f'[data-water-film-action="{a}"]').click()
def ready(p,owner='explorer-1'):
 p.wait_for_selector('[data-water-phase-root],[data-select-explorer]')
 if p.locator(f'[data-select-explorer="{owner}"]').count():p.locator(f'[data-select-explorer="{owner}"]').click()
 p.locator('[data-water-phase-root]').wait_for();p.wait_for_function("getComputedStyle(document.querySelector('[data-phase-action]')).minHeight==='44px'")
def setup(b,base,seed,width,reduce=True):
 c=b.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce' if reduce else 'no-preference')
 c.add_init_script('''(seed=>{if(!localStorage.getItem('water-film-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-29T12:00:00.000Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'acorn',createdAt:'2026-10-29T12:00:00.000Z'}]}));for(const id of ['explorer-1','explorer-2'])localStorage.setItem('number-garden-v1:'+id,JSON.stringify(seed));localStorage.setItem('water-film-fixture','1');}window.waterWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1'))window.waterWrites++;return set.call(this,k,v);};window.waterCreated=[];window.waterRevoked=[];const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=x=>{const u=create(x);waterCreated.push(u);return u;};URL.revokeObjectURL=u=>{waterRevoked.push(u);revoke(u);};})('''+json.dumps(seed)+')')
 c.add_init_script("window.waterAudioContexts=[];const Native=window.AudioContext;if(Native)window.AudioContext=class extends Native{constructor(){super();waterAudioContexts.push(this);}};void 0")
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));requests=[];p.on('request',lambda r:requests.append(r.url));p.goto(base+'#science/ice',wait_until='networkidle');ready(p);return c,p,requests


def pose(p):return [int(p.locator('.phase-stage').inner_text().split()[1])-1,p.locator('.phase-follow').inner_text(),p.locator('[data-phase-details=table]').get_attribute('open') is not None,p.locator('[data-phase-dot]').evaluate_all('xs=>xs.map(g=>[g.dataset.phaseDot,g.dataset.phase,g.querySelector("circle").getAttribute("cx"),g.querySelector("circle").getAttribute("cy")])')]
def movie_ready(p):p.wait_for_function("document.querySelector('video')?.readyState>=2&&document.querySelector('video').duration>34.9");ok(p.locator('video').evaluate('v=>v.currentSrc.startsWith("blob:")&&v.muted'),'actual complete movie decodes from muted Blob')
def layout(p):
 p.wait_for_function("[...document.querySelectorAll('[data-water-phase-root] button')].every(b=>getComputedStyle(b).minHeight==='44px')")
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no sideways overflow')
 for b in p.locator('[data-water-phase-root] button').all():
  r=b.bounding_box();ok(r is not None and r['height']>=43.9 and r['width']>=43.9,'all current buttons44px')
def journey(b,base,seed,width):
 c,p,requests=setup(b,base,seed,width)
 try:
  raw=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");writes=p.evaluate('waterWrites');ok(not any('.mp4' in r for r in requests) and not p.locator('video').count(),'no entry movie/fetch');layout(p)
  for _ in range(11):click(p,'follow')
  p.locator('[data-phase-details=table] summary').click()
  for stage in range(6):
   if stage:click(p,'in')
   saved=pose(p);ok(saved[0]==stage and 'particle 12:' in saved[1] and saved[2],'selected particle12 and table retained at each stage');click(p,'watch');movie_ready(p);ok(p.locator('video').evaluate('v=>v.paused'),'reduced-motion Watch stays still');ok(p.locator('[data-water-film-transcript] li').count()==6,'complete corrected transcript');layout(p)
   if stage==3:
    click(p,'play');p.wait_for_function("document.querySelector('video').currentTime>.1&&!document.querySelector('video').paused");click(p,'play');ok(p.locator('video').evaluate('v=>v.paused'),'large Pause works')
    for t,words in [(3.5,'icicle'),(7,'open pattern'),(14.7,'water molecules'),(22.5,'same mass'),(29.3,'still vibrate'),(33,'No new substance')]:
     p.locator('video').evaluate('(v,t)=>{v.currentTime=t}',t);p.wait_for_function('(text)=>document.querySelector("[data-water-film-caption]").textContent.includes(text)',arg=words);ok(True,'real seek supplies correct full caption')
    click(p,'play');p.wait_for_function("!document.querySelector('video').paused");p.evaluate("document.dispatchEvent(new Event('garden-speak-request'))");p.wait_for_function("document.querySelector('video').paused");ok(True,'narration pauses active film');p.screenshot(path=str(OUT/f'water-film-{width}.png'),full_page=True);p.keyboard.press('Escape')
   else:click(p,'return')
   ok(pose(p)==saved,'movie Return preserves exact stage/particle/drawing/disclosures');ok(p.evaluate('document.activeElement.dataset.phaseAction')=='watch','Return/Escape restores Watch focus')
  ok(p.evaluate('waterCreated.length===waterRevoked.length&&new Set(waterRevoked).size===waterRevoked.length'),'all six sources revoked exactly once');ok(p.evaluate('waterAudioContexts.length')==0,'silent entry/movie/controls allocate no audio context');ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==raw and p.evaluate('waterWrites')==writes,'no saved owner writes across all six movies');p.screenshot(path=str(OUT/f'water-model-{width}.png'),full_page=True)
  p.evaluate('window.oldWaterWatch=document.querySelector("[data-phase-action=watch]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p,'explorer-2');p.evaluate('oldWaterWatch.click()');ok(pose(p)[0]==0 and not p.locator('video').count(),'old controls cannot open movie for new explorer');p.reload(wait_until='networkidle');ready(p,'explorer-2');ok(pose(p)[0]==0 and json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')"))==seed,'reload resets visit only and keeps unsupported owners')
 finally:c.close()
def faults(b,base,seed):
 c,p,_=setup(b,base,seed,820)
 try:
  p.route('**/assets/water-molecules-corrected.mp4',lambda r:r.fulfill(status=503,body='Synthetic failure'));click(p,'watch');p.wait_for_function("document.querySelector('[data-water-film-load-status]').textContent.includes('could not play')");ok(p.locator('[data-water-film-transcript] li').count()==6,'failed fetch retains transcript and Return');p.unroute('**/assets/water-molecules-corrected.mp4');click(p,'retry');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'explicit retry does not autoplay');click(p,'return');ok(p.evaluate('waterCreated.length===waterRevoked.length'),'retry source revoked exactly once');
  pending=[];p.route('**/assets/water-molecules-corrected.mp4',lambda route:pending.append(route));click(p,'watch');p.wait_for_timeout(150);ok(bool(pending),'fault-case download genuinely pending');p.evaluate("location.hash='#notes'");p.wait_for_timeout(150)
  for r in pending:
   try:r.continue_()
   except Exception:pass
  p.wait_for_timeout(200);ok(not p.locator('video').count(),'departure prevents late movie attachment');p.unroute('**/assets/water-molecules-corrected.mp4')
 finally:c.close()
def asynchronous(b,base,seed):
 c,p,requests=setup(b,base,seed,820,False)
 try:
  p.evaluate('window.oldWatch=document.querySelector("[data-phase-action=watch]")');click(p,'watch');movie_ready(p);p.wait_for_function("document.querySelector('video').currentTime>.2&&!document.querySelector('video').paused");ok(True,'explicit non-reduced Watch starts real muted playback');count=sum('.mp4' in x for x in requests);p.evaluate('oldWatch.click()');ok(sum('.mp4' in x for x in requests)==count,'detached duplicate Watch cannot fetch again');p.evaluate("window.waterHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>waterHidden});document.dispatchEvent(new Event('visibilitychange'))");p.wait_for_function("document.querySelector('video').paused");p.evaluate("waterHidden=false;document.dispatchEvent(new Event('visibilitychange'))");ok(p.locator('video').evaluate('x=>x.paused'),'synthetic hidden/visible cycle does not resume');click(p,'return')
  held=[];p.route('**/assets/water-molecules-corrected.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);click(p,'retry');p.wait_for_timeout(100);ok(len(held)==2,'two distinct fault-case requests genuinely pending');data=(ROOT/'dist/assets/water-molecules-corrected.mp4').read_bytes();held[1].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p)
  try:held[0].fulfill(status=200,body=data,content_type='video/mp4')
  except Exception:pass
  p.wait_for_timeout(100);ok(p.evaluate('waterCreated.length===2'),'aborted older fetch creates no extra Blob');ok(p.locator('video').evaluate('x=>x.paused'),'retry winner remains paused');p.unroute('**/assets/water-molecules-corrected.mp4')
  p.evaluate("window.originalSoundPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const media=this;return new Promise((resolve,reject)=>{window.releaseSoundPlay=()=>originalSoundPlay.call(media).then(resolve,reject);});};void 0");click(p,'play');p.evaluate("window.dispatchEvent(new Event('pagehide'));releaseSoundPlay()");p.wait_for_timeout(200);ok(p.locator('video').evaluate('x=>x.paused'),'late programmatic play cannot undo pagehide pause');p.evaluate('HTMLMediaElement.prototype.play=originalSoundPlay;void 0');click(p,'return');ok(p.evaluate('waterCreated.length===waterRevoked.length&&new Set(waterRevoked).size===waterRevoked.length'),'each created source revoked exactly once across retry/return')
  held=[];p.route('**/assets/water-molecules-corrected.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);ok(len(held)==1,'visibility fault holds a real pending fetch');p.evaluate("waterHidden=true;document.dispatchEvent(new Event('visibilitychange'));waterHidden=false;document.dispatchEvent(new Event('visibilitychange'))");held[0].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'download finishing after hidden/visible cannot autoplay');p.unroute('**/assets/water-molecules-corrected.mp4');p.evaluate('window.oldMoviePlay=document.querySelector("[data-water-film-action=play]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p,'explorer-2');p.evaluate('oldMoviePlay.click()');ok(not p.locator('video').count(),'old movie controls cannot open playback for replacement explorer');ok(p.evaluate('waterCreated.length===waterRevoked.length'),'explorer replacement disposes active source')
 finally:c.close()
def transfer_and_entry(b,base):
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {startScience,openScienceExplanation,scienceFrame} from './dist/science-core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};startScience(s,'melt');openScienceExplanation(s);scienceFrame(s,1);s.syntheticOther={payload:'x'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 c,p,_=setup(b,base,seed,820)
 try:
  before=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"))['science'];p.evaluate("location.hash='#science/play'");p.locator('.science-explanation').wait_for();p.locator('a[href="#science/ice"]').click();ready(p);click(p,'in');click(p,'in');click(p,'follow');saved=pose(p);click(p,'watch');movie_ready(p);click(p,'return');ok(pose(p)==saved,'real old science entry also retains local model');p.locator('.phase-room header a').click();p.locator('.science-explanation').wait_for();after=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"))['science'];ok(after==before,'old healthy science visit/frame/source unchanged through real movie and Return');ok(p.locator('.science-frame-heading span').inner_text().startswith('Picture 2'),'old explanation resumes exact picture')
  p.locator('a[href="#science/ice"]').click();ready(p);p.evaluate('window.preImportWater=document.querySelector("[data-phase-action=watch]");location.hash="#notes"');p.locator('#download').wait_for()
  with p.expect_download() as info:p.locator('#download').click()
  file=OUT/'synthetic-water-notes.json';info.value.save_as(str(file));report=json.loads(file.read_text());ok(report['science']==before and report['syntheticOther']==seed['syntheticOther'],'real download keeps healthy science and large sibling');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId!=='explorer-1'");owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.evaluate("location.hash='#science/ice'");ready(p,owner);p.evaluate('preImportWater.click()');ok(pose(p)[0]==0 and not p.locator('video').count(),'real import invalidates old Watch');imported=json.loads(p.evaluate("id=>localStorage.getItem('number-garden-v1:'+id)",owner));ok(imported['science']==before and imported['syntheticOther']==seed['syntheticOther'],'real imported healthy history and sibling retained')
 finally:c.close()
def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.science={version:99,visits:'retained'};s.bellStudio={version:99,future:'kept'};s.rhythm={version:99,future:'kept'};s.syntheticOther={payload:'z'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('WATER_FILM_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
  try:
   for width in [320,820,1024]:journey(b,base,seed,width)
   faults(b,base,seed);asynchronous(b,base,seed);transfer_and_entry(b,base);ok(not errors,'no page errors '+str(errors));r={'status':'passed','checks':checks,'base':base,'limits':'nativeChrome and labelled faults; no physicaliPad/Safari, screen-reader speech, human continuous viewing, physical experiment or learning outcomes'};(OUT/'receipt.json').write_text(json.dumps(r,indent=2));print(json.dumps(r))
  finally:b.close();server.shutdown()
if __name__=='__main__':main()
