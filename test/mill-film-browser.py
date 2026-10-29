"""Synthetic309 journeys with real native Chrome controls/decoding.
Optional MILL_FILM_TEST_URL targets deployed bytes after verification.
Fault cases are separate from the normal movie journey. No app-module interception.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('MILL_FILM_ARTIFACTS',tempfile.mkdtemp(prefix='mill-film-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def click(p,a,value=None):
 sel='[data-mill-film-return]' if a=='return' and p.locator('[data-mill-film-return]').count() else f'[data-mill-film-action="{a}"]' if a in ['play','replay','retry'] else f'[data-energy-action="{a}"]'+(f'[data-energy-value="{value}"]' if value is not None else '')
 p.locator(sel).tap() if p.viewport_size['width']==320 else p.locator(sel).click()
def ready(p,owner='explorer-1'):
 p.wait_for_selector('[data-energy-root],[data-select-explorer]')
 if p.locator(f'[data-select-explorer="{owner}"]').count():p.locator(f'[data-select-explorer="{owner}"]').click()
 p.locator('[data-energy-root]').wait_for();p.wait_for_function("[...document.querySelectorAll('[data-energy-root] button')].every(b=>getComputedStyle(b).minHeight==='44px')")
 # Layout assertions wait for actual mill styles/fonts; state snapshots use DOM words, not layout-added line breaks.
 p.wait_for_function("[...document.styleSheets].some(s=>s.href?.endsWith('/mill-energy.css')&&s.cssRules.length>0)");p.evaluate('async()=>{await document.fonts.ready;return true}')
def setup(b,base,seed,width,reduce=True):
 c=b.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce' if reduce else 'no-preference')
 c.add_init_script('''(seed=>{if(!localStorage.getItem('mill-film-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-29T12:00:00.000Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'acorn',createdAt:'2026-10-29T12:00:00.000Z'}]}));for(const id of ['explorer-1','explorer-2'])localStorage.setItem('number-garden-v1:'+id,JSON.stringify(seed));localStorage.setItem('mill-film-fixture','1');}window.filmWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1'))window.filmWrites++;return set.call(this,k,v);};window.filmCreated=[];window.filmRevoked=[];const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=x=>{const u=create(x);filmCreated.push(u);return u;};URL.revokeObjectURL=u=>{filmRevoked.push(u);revoke(u);};})('''+json.dumps(seed)+')')
 c.add_init_script("window.filmAudioContexts=[];const Native=window.AudioContext;if(Native)window.AudioContext=class extends Native{constructor(){super();filmAudioContexts.push(this);}};void 0")
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));requests=[];p.on('request',lambda r:requests.append(r.url));p.goto(base+'#mill/energy',wait_until='networkidle');ready(p);return c,p,requests


def pose(p):return p.locator('[data-energy-root]').evaluate("r=>({text:r.textContent,pictures:[...r.querySelectorAll('svg')].map(e=>e.outerHTML),pressed:[...r.querySelectorAll('[aria-pressed]')].map(e=>[e.dataset.energyAction,e.dataset.energyValue,e.getAttribute('aria-pressed')]),details:[...r.querySelectorAll('[data-energy-details]')].map(e=>[e.dataset.energyDetails,e.open]),buttons:[...r.querySelectorAll('button')].map(e=>[e.textContent,e.disabled])})")
def counts(p):return [int(p.locator(f'[data-energy-count="{k}"]').text_content()) for k in ['waiting','moving','thermal','total']]
def select(p,N,job):
 click(p,'size',N);click(p,'jobs');click(p,'job',job)
def goal(p,N,job):
 def repeat(a,n):
  for _ in range(n):click(p,a)
 if job==0:repeat('pour',N//4);repeat('grind',N//2)
 elif job==1:click(p,'pour');click(p,'gate');click(p,'grind')
 elif job==2:repeat('pour',N//2);repeat('rub',N)
 elif job==3:repeat('pour',(N//4+1)//2);repeat('rub',N//4)
 elif job==4:repeat('pour',N//4);repeat('grind',N//4);repeat('rub',N//4)
 else:repeat('pour',(N//4+1)//2);repeat('grind',N//4);repeat('rub',(N//4)%2);click(p,'gate')
 ok('This picture meets the request' in p.locator('.me-status').text_content(),'actual controls meet '+str((N,job)))
def movie_ready(p):p.wait_for_function("document.querySelector('video')?.readyState>=2&&Math.abs(document.querySelector('video').duration-32)<.02");ok(p.locator('video').evaluate('v=>v.currentSrc.startsWith("blob:")&&v.muted'),'actual complete movie decodes from muted Blob')
def layout(p):
 p.wait_for_function("[...document.querySelectorAll('[data-energy-root] button')].every(b=>getComputedStyle(b).minHeight==='44px')")
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no sideways overflow')
 for b in p.locator('[data-energy-root] button,[data-energy-root] a,[data-energy-root] summary').all():
  if b.is_visible():
   r=b.bounding_box();ok(r is not None and r['height']>=43.9 and r['width']>=43.9,'visible button/link/summary44px')
def roundtrip(p,escape=False):
 saved=pose(p);click(p,'watch');movie_ready(p);layout(p)
 ok(not p.locator('[data-energy-action],.me-kept,.me-facts,.me-complete').count(),'film is a separate turn; no hidden manual controls')
 ok(p.locator('video').evaluate('v=>v.paused'),'reduced motion keeps an actual still');ok(p.locator('[data-mill-film-transcript] li').count()==12,'full readable transcript')
 ok(p.evaluate('document.activeElement.hasAttribute("data-mill-film-return")'),'Watch focuses Return')
 if escape:p.keyboard.press('Escape')
 else:click(p,'return')
 current=pose(p)
 if current!=saved:(OUT/'preservation-mismatch.json').write_text(json.dumps({'before':saved,'after':current},indent=2))
 ok(current==saved,'Return restores exact mill page/counts/feedback/drawing/details/held reference');ok(p.evaluate('document.activeElement.dataset.energyAction')=='watch','Return restores Watch focus')
def journey(b,base,seed,width):
 c,p,requests=setup(b,base,seed,width)
 try:
  raw=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");sibling=p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')");writes=p.evaluate('filmWrites');style=p.locator('head link[href="./mill-energy.css"]').element_handle()
  ok(not any('/assets/mill-energy-corrected.' in r for r in requests) and not p.locator('video').count(),'no movie/poster request before Watch');layout(p)
  p.evaluate('window.oldPour=document.querySelector("[data-energy-action=pour]");window.oldWatch=document.querySelector("[data-energy-action=watch]")');saved=pose(p);click(p,'watch');movie_ready(p);p.evaluate('oldPour.click();oldWatch.click()');ok(p.locator('[data-mill-film-movie]').count()==1 and sum('/assets/mill-energy-corrected.mp4' in x for x in requests)==1,'detached manual/Watch cannot mutate or refetch');layout(p)
  # Exact twelve cues and their genuine gaps through native decode/seek.
  cues=[(.2,2.2,'An overshot wheel: the water arrives at the top.'),(2.2,4.4,'Follow one bucketful high in the chute.'),(4.4,7,'High water and Earth have a gravitational store.'),(7.2,9.4,'It pours into a bucket at the top of the wheel.'),(9.4,12.2,'Its weight pulls that side down, helping the wheel turn.'),(12.2,16,'Energy transfers to the turning wheel: a kinetic store.'),(16.2,19,'The axle turns the millstone, and it grinds the grain.'),(19,21.5,'Grinding and rubbing warm the stones, the flour and the air.'),(21.5,24,'Moving energy spreads into thermal stores.'),(24.2,26.8,'The tracked energy was not destroyed. It spread out.'),(26.8,29.4,'Spread-out warmth is hard to use again.'),(29.4,32,'Sunlight drives evaporation. Rain feeds high streams.')]
  for start,end,words in cues:
   p.locator('video').evaluate('(v,t)=>v.currentTime=t',(start+end)/2);p.wait_for_function('(text)=>document.querySelector("[data-mill-film-caption]").textContent===text',arg=words);ok(True,'actual decoder seek gives exact cue')
  for t in [.1,7.1,16.1,24.1]:
   p.locator('video').evaluate('(v,t)=>v.currentTime=t',t);p.wait_for_function("document.querySelector('[data-mill-film-caption]').textContent==='\u00a0'");ok(True,'gap keeps a nonbreaking space')
  click(p,'play');p.wait_for_function("!document.querySelector('video').paused");p.locator('[data-mill-film-transcript] summary').click();p.wait_for_function("document.querySelector('video').paused");ok(True,'opening complete transcript pauses film');p.locator('[data-mill-film-transcript] summary').click()
  click(p,'play');p.evaluate("document.dispatchEvent(new CustomEvent('garden-speak-request',{detail:{text:'Synthetic narration request',language:'en'}}))");p.wait_for_function("document.querySelector('video').paused");ok(True,'real narration event with detail pauses film')
  r=p.locator('[data-mill-film-return]').bounding_box();ok(r['y']>=0 and r['y']+r['height']<=1000,'Return visible above movie '+str(r));p.screenshot(path=str(OUT/f'mill-film-{width}.png'),full_page=True);p.keyboard.press('Escape');ok(pose(p)==saved,'seek/play/narration preserve initial table')
  # Native UI creates eighteen independently pending pictures; retain all snapshots.
  pending={}
  for N in [8,12,16]:
   for job in range(6):
    select(p,N,job);click(p,'pour');click(p,'grind' if job%2 else 'rub');pending[N,job]=pose(p)
  select(p,8,0);click(p,'keep');click(p,'size',16);click(p,'view','book')
  for key in ['example','model','why','held']:p.locator(f'[data-energy-details="{key}"] summary').click()
  ok(p.locator('[data-energy-book=held] [data-energy-chip]').count()==8 and counts(p)[3]==16,'held/current unequal totals visible');roundtrip(p,True)
  # Return all eighteen to the saved representation/disclosures for exact comparison.
  click(p,'clear');click(p,'view','scene')
  for key in ['example','model','why']:p.locator(f'[data-energy-details="{key}"] summary').click()
  for N in [8,12,16]:
   for job in range(6):select(p,N,job);ok(pose(p)==pending[N,job],'all eighteen pending pictures survive movie '+str((N,job)))
  click(p,'jobs');roundtrip(p);click(p,'return')
  # Each size reaches its own milestone; only three representative movie cycles.
  for N in [8,12,16]:
   for job in range(6):select(p,N,job);click(p,'restart');goal(p,N,job)
   ok(p.locator('.me-complete').count()==1,'size-specific six-met milestone '+str(N));roundtrip(p)
  select(p,8,3);click(p,'pour');click(p,'grind');ok('met earlier' in p.locator('.me-status').text_content(),'historical met differs from present target');roundtrip(p,True)
  click(p,'size',12);click(p,'fresh-six');ok(counts(p)==[12,0,0,12] and not p.locator('.me-complete').count(),'fresh six clears selected size');click(p,'size',16);ok(p.locator('.me-complete').count()==1,'fresh six retains other-size milestone')
  ok(style.evaluate('x=>x.isConnected&&x.parentElement.tagName==="HEAD"'),'same permanent stylesheet node through manual/movie turns');ok(p.evaluate('filmCreated.length===filmRevoked.length&&new Set(filmRevoked).size===filmRevoked.length'),'every film Blob revoked exactly once');ok(p.evaluate('filmAudioContexts.length')==0,'silent film allocates no audio contexts');ok(p.evaluate('filmWrites')==writes and p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==raw and p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')")==sibling,'all film/manual actions preserve byte-exact large owner/sibling roots')
  p.evaluate('window.staleWatch=document.querySelector("[data-energy-action=watch]")');click(p,'watch');movie_ready(p);p.evaluate('window.staleReturn=document.querySelector("[data-mill-film-return]");window.stalePlay=document.querySelector("[data-mill-film-action=play]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer=explorer-2]').click();ready(p,'explorer-2');p.evaluate('staleWatch.click();staleReturn.click();stalePlay.click()');ok(not p.locator('video').count() and counts(p)==[8,0,0,8],'replacement owner rejects detached Watch/Return/Play');p.reload(wait_until='networkidle');ready(p,'explorer-2');ok(not p.locator('video').count() and counts(p)==[8,0,0,8],'reload clears visit and movie')
 finally:c.close()
def faults(b,base,seed):
 c,p,_=setup(b,base,seed,820)
 try:
  p.route('**/assets/mill-energy-corrected.mp4',lambda r:r.fulfill(status=503,body='Synthetic failure'));click(p,'watch');p.wait_for_function("document.querySelector('[data-mill-film-load-status]').textContent.includes('could not play')");ok(p.locator('[data-mill-film-transcript] li').count()==12,'failed fetch retains transcript and Return');p.unroute('**/assets/mill-energy-corrected.mp4');click(p,'retry');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'explicit retry does not autoplay');click(p,'return');ok(p.evaluate('filmCreated.length===filmRevoked.length'),'retry source revoked exactly once');
  p.route('**/assets/mill-energy-corrected.mp4',lambda r:r.fulfill(status=200,body='Synthetic invalid video',content_type='video/mp4'));click(p,'watch');p.wait_for_function("document.querySelector('[data-mill-film-load-status]').textContent.includes('could not play')");ok(p.locator('[data-mill-film-transcript] li').count()==12 and p.locator('[data-mill-film-return]').is_enabled(),'real native decoder failure retains complete transcript and Return');click(p,'return');p.unroute('**/assets/mill-energy-corrected.mp4')
  p.route('**/assets/mill-energy-corrected.vtt',lambda r:r.fulfill(status=503,body='Synthetic missing captions'));click(p,'watch');movie_ready(p);p.wait_for_function("document.querySelector('track').readyState===3");p.locator('video').evaluate('v=>{v.currentTime=14}');p.wait_for_function("document.querySelector('[data-mill-film-caption]').textContent.includes('turning wheel')");ok(p.locator('[data-mill-film-transcript] li').count()==12,'real failed caption track still has current caption and full reading alternative');click(p,'return');p.unroute('**/assets/mill-energy-corrected.vtt')
  pending=[];p.route('**/assets/mill-energy-corrected.mp4',lambda route:pending.append(route));click(p,'watch');p.wait_for_timeout(150);ok(bool(pending),'fault-case download genuinely pending');p.evaluate("location.hash='#notes'");p.wait_for_timeout(150)
  for r in pending:
   try:r.continue_()
   except Exception:pass
  p.wait_for_timeout(200);ok(not p.locator('video').count(),'departure prevents late movie attachment');p.unroute('**/assets/mill-energy-corrected.mp4')
 finally:c.close()
def asynchronous(b,base,seed):
 c,p,requests=setup(b,base,seed,820,False)
 try:
  # Precisely timed UI dispatch isolates interrupting the finite model animation.
  p.evaluate('document.querySelector("[data-energy-action=pour]").click();document.querySelector("[data-energy-action=watch]").click()');movie_ready(p);click(p,'return');ok(counts(p)==[6,2,0,8] and not p.locator('[data-energy-moving]').count() and float(p.locator('[data-energy-wheel]').get_attribute('data-energy-angle'))==15,'moving Watch returns the settled already-recorded Pour')
  p.evaluate('window.oldWatch=document.querySelector("[data-energy-action=watch]")');click(p,'watch');movie_ready(p);p.wait_for_function("document.querySelector('video').currentTime>.2&&!document.querySelector('video').paused");ok(True,'explicit non-reduced Watch starts real muted playback');count=sum('.mp4' in x for x in requests);p.evaluate('oldWatch.click()');ok(sum('.mp4' in x for x in requests)==count,'detached duplicate Watch cannot fetch again');p.evaluate("window.filmHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>filmHidden});document.dispatchEvent(new Event('visibilitychange'))");p.wait_for_function("document.querySelector('video').paused");p.evaluate("filmHidden=false;document.dispatchEvent(new Event('visibilitychange'))");ok(p.locator('video').evaluate('x=>x.paused'),'synthetic hidden/visible cycle does not resume');click(p,'return')
  held=[];p.route('**/assets/mill-energy-corrected.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);click(p,'retry');p.wait_for_timeout(100);ok(len(held)==2,'two distinct fault-case requests genuinely pending');data=(ROOT/'dist/assets/mill-energy-corrected.mp4').read_bytes();held[1].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p)
  try:held[0].fulfill(status=200,body=data,content_type='video/mp4')
  except Exception:pass
  p.wait_for_timeout(100);ok(p.evaluate('filmCreated.length===3'),'aborted older fetch creates no extra Blob');ok(p.locator('video').evaluate('x=>x.paused'),'retry winner remains paused');p.unroute('**/assets/mill-energy-corrected.mp4')
  p.evaluate("window.originalSoundPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const media=this;return new Promise((resolve,reject)=>{window.releaseSoundPlay=()=>originalSoundPlay.call(media).then(resolve,reject);});};void 0");click(p,'play');p.evaluate("window.dispatchEvent(new Event('pagehide'));releaseSoundPlay()");p.wait_for_timeout(200);ok(p.locator('video').evaluate('x=>x.paused'),'late programmatic play cannot undo pagehide pause');p.evaluate('HTMLMediaElement.prototype.play=originalSoundPlay;void 0');click(p,'return');ok(p.evaluate('filmCreated.length===filmRevoked.length&&new Set(filmRevoked).size===filmRevoked.length'),'each created source revoked exactly once across retry/return')
  # Delayed Play after disposal is distinct from delayed Play after pause.
  click(p,'watch');movie_ready(p);p.wait_for_function("!document.querySelector('video').paused");click(p,'play');p.wait_for_function("document.querySelector('video').paused")
  p.evaluate("window.originalSoundPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const media=this;return new Promise((resolve,reject)=>{window.releaseSoundPlay=()=>originalSoundPlay.call(media).then(resolve,reject);});};window.departingMovie=document.querySelector('video');void 0");click(p,'play');click(p,'return');p.evaluate('releaseSoundPlay();HTMLMediaElement.prototype.play=originalSoundPlay;void 0');p.wait_for_timeout(200);ok(not p.locator('video').count() and p.evaluate('departingMovie.paused'),'late Play cannot restart disposed detached video')
  held=[];p.route('**/assets/mill-energy-corrected.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);ok(len(held)==1,'visibility fault holds a real pending fetch');p.evaluate("filmHidden=true;document.dispatchEvent(new Event('visibilitychange'));filmHidden=false;document.dispatchEvent(new Event('visibilitychange'))");held[0].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'download finishing after hidden/visible cannot autoplay');p.unroute('**/assets/mill-energy-corrected.mp4');p.evaluate('window.oldMoviePlay=document.querySelector("[data-mill-film-action=play]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p,'explorer-2');p.evaluate('oldMoviePlay.click()');ok(not p.locator('video').count(),'old movie controls cannot open playback for replacement explorer');ok(p.evaluate('filmCreated.length===filmRevoked.length'),'explorer replacement disposes active source')
 finally:c.close()
def transfer_and_entry(b,base):
 script="""import {freshState} from './dist/core.mjs';import {startWorkshop,releaseWorkshop,stepWorkshop,finishWorkshop} from './dist/workshop-core.mjs';import {startCircuit,setCircuitPage,setCircuitLink,keepCircuit} from './dist/lantern-circuit-core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};startWorkshop(s);releaseWorkshop(s);stepWorkshop(s);stepWorkshop(s);finishWorkshop(s);startCircuit(s,'one-lead');setCircuitLink(s,'nt',true);keepCircuit(s);setCircuitPage(s,'connect');s.syntheticOther={payload:'x'.repeat(550000)};console.log(JSON.stringify(s));"""
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True));c,p,_=setup(b,base,seed,820)
 try:
  click(p,'pour');roundtrip(p);p.evaluate('window.preImportWatch=document.querySelector("[data-energy-action=watch]");location.hash="#notes"');p.locator('#download').wait_for()
  with p.expect_download() as info:p.locator('#download').click()
  file=OUT/'synthetic-mill-notes.json';info.value.save_as(str(file));report=json.loads(file.read_text());ok(file.stat().st_size>550000 and all(report[k]==seed[k] for k in ['workshop','lanternCircuits','syntheticOther']),'actual Notes download retains healthy Workshop/Circuit/large unknown sibling');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId!=='explorer-1'");owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.evaluate('location.hash="#mill/energy"');ready(p,owner);p.evaluate('preImportWatch.click()');ok(not p.locator('video').count() and counts(p)==[8,0,0,8],'real import invalidates old Watch and partial visit');imported=json.loads(p.evaluate("id=>localStorage.getItem('number-garden-v1:'+id)",owner));ok(all(imported[k]==seed[k] for k in ['workshop','lanternCircuits','syntheticOther']),'healthy imported roots and unknown sibling retained')
  sibling=p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')");click(p,'watch');movie_ready(p);p.evaluate('window.preResetReturn=document.querySelector("[data-mill-film-return]");location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click()
  if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').click()
  p.evaluate('location.hash="#mill/energy"');ready(p,owner);p.evaluate('preResetReturn.click()');ok(not p.locator('video').count() and counts(p)==[8,0,0,8],'actual reset invalidates old film Return');ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')")==sibling,'active reset preserves sibling raw bytes')
 finally:c.close()
def input_methods(b,base,seed):
 c,p,_=setup(b,base,seed,320)
 try:
  saved=pose(p);watch=p.locator('[data-energy-action=watch]');watch.focus();p.keyboard.press('Enter');movie_ready(p);ok(p.locator('video').evaluate('v=>v.paused'),'Enter on Watch opens a reduced-motion still')
  ok(p.locator('track').evaluate('e=>e.track.mode')=='hidden','native caption track starts hidden; readable alternatives remain')
  video=p.locator('video');video.focus();ok(video.evaluate('v=>document.activeElement===v'),'native video receives keyboard focus');video.evaluate('v=>v.currentTime=5');p.wait_for_function("Math.abs(document.querySelector('video').currentTime-5)<.1");p.keyboard.press('ArrowRight');p.wait_for_function("document.querySelector('video').currentTime>5.1");ok(True,'ArrowRight actually seeks the native video')
  p.keyboard.press('Space');p.wait_for_function("!document.querySelector('video').paused");p.keyboard.press('Space');p.wait_for_function("document.querySelector('video').paused");ok(True,'native video Space toggles actual playback')
  p.locator('[data-mill-film-return]').focus();p.keyboard.press('Space');ok(pose(p)==saved,'Space on Return restores exact mill')
  click(p,'watch');movie_ready(p);click(p,'play');p.wait_for_function("!document.querySelector('video').paused");click(p,'play');p.wait_for_function("document.querySelector('video').paused");ok(True,'actual touch taps Play and Pause')
  video=p.locator('video');video.evaluate('v=>v.currentTime=31.8');click(p,'play');p.wait_for_function("document.querySelector('video').ended");ok(p.locator('[data-mill-film-caption]').inner_text().endswith('Sunlight drives evaporation. Rain feeds high streams.'),'actual end retains final caption')
  click(p,'replay');p.wait_for_function("document.querySelector('video').currentTime<1&&!document.querySelector('video').paused");ok(True,'actual touch Replay rewinds and plays');click(p,'retry');movie_ready(p);ok(p.locator('video').evaluate('v=>v.paused'),'actual touch Retry reloads without autoplay');click(p,'return');ok(pose(p)==saved,'actual touch Return restores exact mill')
  ok(p.evaluate('filmCreated.length===filmRevoked.length&&new Set(filmRevoked).size===filmRevoked.length'),'input-method journeys revoke each movie source once')
 finally:c.close()
def missing_motion(b,base,seed):
 c,p,_=setup(b,base,seed,820)
 try:
  p.evaluate('window.matchMedia=undefined');click(p,'watch');movie_ready(p);ok(p.locator('video').evaluate('v=>v.paused'),'missing matchMedia opens still');click(p,'return')
 finally:c.close()
def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.science={version:99,visits:'retained'};s.workshop={version:99,opaque:'retained'};s.fairTests={version:99,opaque:'retained'};s.bellStudio={version:99,future:'kept'};s.rhythm={version:99,future:'kept'};s.lanternCircuits={version:99,future:'kept'};s.syntheticOther={payload:'z'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('MILL_FILM_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
  try:
   for width in [320,820,1024]:
    journey(b,base,seed,width);print('film width',width,'passed',flush=True)
   input_methods(b,base,seed);missing_motion(b,base,seed);faults(b,base,seed);asynchronous(b,base,seed);transfer_and_entry(b,base);ok(not errors,'no page errors '+str(errors));r={'status':'passed','checks':checks,'base':base,'limits':'nativeChrome and labelled faults; no physicaliPad/Safari, screen-reader speech, human continuous viewing, physical experiment or learning outcomes'};(OUT/'receipt.json').write_text(json.dumps(r,indent=2));print(json.dumps(r))
  finally:b.close();server.shutdown()
if __name__=='__main__':main()
