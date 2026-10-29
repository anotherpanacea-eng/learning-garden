"""Synthetic native MP4 journeys. Local by default; TOWN_FILM_URL selects hosted.
No physical iPad, screen-reader or learning-effect claims.
"""
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('TOWN_FILM_ARTIFACTS',tempfile.mkdtemp(prefix='town-film-')));OUT.mkdir(parents=True,exist_ok=True)
fixture="""import {makeFixtures} from './test/act-two-checks.mjs';import {chooseStoryArrival} from './dist/story-arrivals-core.mjs';const f=makeFixtures();f.inherited=structuredClone(f.ready);f.inherited.story={version:1,opening:'returning',acts:{},seenScenes:[]};if(!chooseStoryArrival(f.inherited,'letter'))throw Error('arrival');console.log(JSON.stringify(f));"""
F=json.loads(subprocess.check_output(['node','--input-type=module','-e',fixture],cwd=ROOT,text=True));checks=0

def ok(value,message):
 global checks
 assert value,message
 checks+=1

class Quiet(http.server.SimpleHTTPRequestHandler):
 # Match the deployed static host: full200responses, no byte-range support.
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128
server=None;base=os.environ.get('TOWN_FILM_URL')
if not base:
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'

def setup(browser,width,seed,route='#almanac/celebration'):
 c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce')
 c.add_init_script('('+"""seed=>{if(!localStorage.getItem('town-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('town-fixture','1');}window.__writes=0;window.__revokes=[];const revoke=URL.revokeObjectURL.bind(URL);URL.revokeObjectURL=url=>{window.__revokes.push(url);revoke(url);};const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){window.__writes++;return set.call(this,k,v);};}"""+')('+json.dumps(seed)+')')
 p=c.new_page();p.set_default_timeout(15000);p.goto(base+route,wait_until='domcontentloaded');p.locator('#explorer-header').wait_for()
 picker=p.locator('[data-select-explorer]');
 if picker.count():picker.first.click()
 p.locator('[data-act-two-root]').wait_for(state='visible');return c,p

def watch(p):p.locator('[data-town-watch]').click()
def time(p):return p.locator('video').evaluate('(v)=>v.currentTime')
def paused(p):return p.locator('video').evaluate('(v)=>v.paused')
def disk(p):return p.evaluate('()=>JSON.stringify({...localStorage})')

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
 try:
  for width in [320,820,1024]:
   c,p=setup(browser,width,F['work'],'#almanac/town')
   p.locator('[data-act-two-start]').click()
   for chapter in ['market','garden','show']:
    p.locator(f'[data-act-two-chapter="{chapter}"]').click();p.locator(f'[data-act-two-offer="{chapter}"]').click()
   p.locator('[data-act-two-celebrate]').click();p.locator('[data-town-watch]').wait_for()
   ok(not p.locator('video').get_attribute('src'),'no source before explicit tap')
   ok(paused(p),'reduced motion never autoplays')
   p.locator('[data-town-transcript] summary').click();ok(p.locator('[data-town-transcript] li').count()==8,'complete readable transcript before movie');p.locator('[data-town-transcript] summary').click()
   before=disk(p);writes=p.evaluate('window.__writes');watch(p)
   p.wait_for_function("()=>{const v=document.querySelector('video');return v.readyState>=2&&!v.paused&&v.currentTime>.5}")
   p.wait_for_function("()=>document.querySelector('[data-town-caption]').textContent.includes('Evening')")
   ok(p.locator('video').evaluate('(v)=>v.videoWidth===1280&&v.videoHeight===720'),'real decoded dimensions');ok(p.locator('video').get_attribute('src').startswith('blob:'),'local seekable source');ok(p.locator('video').evaluate('(v)=>v.seekable.length>0'),'native seekable range')
   p.locator('[data-town-play]').click();held=time(p);p.wait_for_timeout(200);ok(paused(p) and abs(time(p)-held)<.1,'pause holds picture')
   p.locator('video').evaluate('(v)=>v.currentTime=20')
   try:p.wait_for_function("()=>document.querySelector('[data-town-caption]').textContent.includes('Story Loft')")
   except Exception:
    print(p.locator('video').evaluate('(v)=>({time:v.currentTime,duration:v.duration,ready:v.readyState,caption:document.querySelector("[data-town-caption]").textContent,cues:Array.from(v.textTracks[0]?.cues||[]).map(c=>[c.startTime,c.endTime,c.text])})'));raise
   p.locator('[data-town-hide]').click();ok(paused(p),'hide pauses');ok(p.locator('[data-town-watch]').evaluate('(e)=>e===document.activeElement'),'hide returns focus');watch(p);p.wait_for_function('()=>!document.querySelector("video").paused');ok(time(p)>=20,'reopen preserves position')
   p.locator('[data-town-replay]').click();ok(time(p)<2,'replay rewinds unfinished film')
   p.locator('video').evaluate('(v)=>{v.pause();v.currentTime=51.9;v.dispatchEvent(new Event("ended"));}')
   # A real ended state (rather than a synthetic flag) holds the final readable cue.
   p.locator('[data-town-play]').click();p.wait_for_function('()=>document.querySelector("video").ended');ok('more than one way' in p.locator('[data-town-caption]').inner_text(),'final caption held')
   p.locator('[data-town-play]').click();p.wait_for_function('()=>!document.querySelector("video").paused');ok(time(p)<2,'standard Play restarts a finished film')
   p.locator('[data-town-play]').press('Escape');ok(p.locator('[data-town-picture]').is_hidden() and paused(p),'Escape hides and pauses');ok(p.locator('[data-town-watch]').evaluate('(e)=>e===document.activeElement'),'Escape returns focus')
   ok(disk(p)==before and p.evaluate('window.__writes')==writes,'all movie actions make zero notebook writes')
   ok(p.locator('[data-act-two-reveal-page]').count()==1,'film did not reveal Page2')
   ok(p.evaluate('()=>document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal scroll')
   p.screenshot(path=str(OUT/f'town-{width}.png'),full_page=True)
   watch(p);p.wait_for_function('()=>!document.querySelector("video").paused');p.evaluate('window.__oldVideo=document.querySelector("video");window.__oldWatch=document.querySelector("[data-town-watch]");window.__oldURL=window.__oldVideo.src')
   p.locator('a[href="#home"]').first.click();p.locator('[data-town-film]').wait_for(state='detached');ok(p.evaluate('window.__oldVideo.paused'),'route departure pauses');ok(p.evaluate('window.__revokes.filter(x=>x===window.__oldURL).length===1'),'departure revokes source once');p.evaluate('window.__oldWatch.click()');ok(p.evaluate('window.__oldVideo.paused'),'detached watch inert');c.close()
  for name in ['future','inherited','ready']:
   c,p=setup(browser,820,F[name]);ok(bool(p.locator('[data-town-watch]').count())==(name!='ready'),'literal old/inherited vs unreached availability: '+name)
   if name=='inherited':ok(p.locator('[data-arrival-context]').count()>0,'earlier-story label preserved')
   c.close()
  c,p=setup(browser,820,F['future']);before=disk(p)
  # Controlled play rejection, then native media error: text and continuation remain.
  p.evaluate('()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new Error("synthetic denied"))};}')
  watch(p);p.wait_for_function("()=>document.querySelector('[data-town-status]').textContent.includes('could not play')");ok(p.locator('[data-town-transcript] summary').is_visible(),'rejection retains transcript')
  p.locator('video').evaluate('(v)=>v.dispatchEvent(new Event("error"))');ok('could not play' in p.locator('[data-town-status]').inner_text(),'media failure message')
  p.locator('track').evaluate('(t)=>t.dispatchEvent(new Event("error"))');ok('transcript' in p.locator('[data-town-caption]').inner_text(),'caption error gives text fallback')
  ok(disk(p)==before,'failure changes no records');c.close()
  for asset in ['town-film-take2.mp4','town-film-take2.vtt']:
   c,p=setup(browser,820,F['future']);c.route('**/'+asset,lambda r:r.fulfill(status=404,body='synthetic missing media'))
   watch(p)
   selector='[data-town-status]' if asset.endswith('.mp4') else '[data-town-caption]'
   p.wait_for_function('(selector)=>document.querySelector(selector).textContent.includes("transcript")',arg=selector)
   p.locator('video').evaluate('(v)=>v.dispatchEvent(new Event("timeupdate"))')
   ok('transcript' in p.locator(selector).inner_text(),'actual missing asset keeps fallback: '+asset);c.close()
  c,p=setup(browser,820,F['future']);watch(p);p.wait_for_function('()=>!document.querySelector("video").paused');p.evaluate('window.__oldVideo=document.querySelector("video")');p.locator('#explorer-switch').click();ok(p.evaluate('window.__oldVideo.paused'),'explorer chooser pauses old movie');c.close()
  c,p=setup(browser,820,F['future']);held=[];c.route('**/town-film-take2.mp4',lambda r:held.append(r));watch(p);p.wait_for_timeout(150);ok(len(held)==1 and p.locator('[data-town-play]').is_disabled(),'loading is explicit with disabled play');p.locator('[data-town-hide]').click();held[0].fulfill(status=200,content_type='video/mp4',body=(ROOT/'dist/assets/town-film-take2.mp4').read_bytes());p.wait_for_function('()=>document.querySelector("video").src.startsWith("blob:")');ok(paused(p),'download finishing after Hide cannot autoplay');watch(p);p.wait_for_function('()=>!document.querySelector("video").paused');ok(len(held)==1,'reopen reuses one download');c.close()
  c,p=setup(browser,820,F['future']);held=[];c.route('**/town-film-take2.mp4',lambda r:held.append(r));watch(p);p.wait_for_timeout(150)
  with p.expect_event('requestfailed',predicate=lambda r:'town-film-take2.mp4' in r.url) as cancelled:p.locator('a[href="#home"]').first.click()
  ok('town-film-take2.mp4' in cancelled.value.url,'departure aborts pending movie fetch')
  try:held[0].abort()
  except Exception:pass  # The browser may already have discarded the aborted interception.
  c.close()
  c,p=setup(browser,820,F['future']);attempts=[]
  def fail_once(route):
   attempts.append(1)
   if len(attempts)==1:route.fulfill(status=503,body='synthetic unavailable')
   else:route.fulfill(status=200,content_type='video/mp4',body=(ROOT/'dist/assets/town-film-take2.mp4').read_bytes())
  c.route('**/town-film-take2.mp4',fail_once);watch(p);p.wait_for_function('()=>document.querySelector("[data-town-status]").textContent.includes("could not play")');watch(p);p.wait_for_function('()=>!document.querySelector("video").paused');ok(len(attempts)==2,'failed download can retry via Watch');c.close()
  c,p=setup(browser,820,F['future']);held=[]
  def held_once(route):
   held.append(route)
   if len(held)>1:route.fulfill(status=200,content_type='application/octet-stream',body=(ROOT/'dist/assets/town-film-take2.mp4').read_bytes())
  c.route('**/town-film-take2.mp4',held_once);watch(p);p.wait_for_timeout(150);p.locator('[data-act-two-root]').evaluate('(r)=>r.hidden=true');held[0].fulfill(status=200,content_type='video/mp4',body=(ROOT/'dist/assets/town-film-take2.mp4').read_bytes());p.wait_for_function('()=>!document.querySelector("[data-town-status]").textContent.includes("Loading")');p.locator('[data-act-two-root]').evaluate('(r)=>r.hidden=false');watch(p);p.wait_for_function('()=>!document.querySelector("video").paused');ok(len(held)==2,'temporarily inactive owner can retry without wedged load');c.close()
  # Native loading cancellation is not a failure; delayed real playback cannot undo pause.
  c,p=setup(browser,820,F['future']);p.evaluate('()=>{HTMLMediaElement.prototype.play=function(){return new Promise((r,j)=>window.__cancelPlay=j)};}');watch(p);p.wait_for_function('()=>typeof window.__cancelPlay==="function"');p.locator('video').evaluate('(v)=>v.dispatchEvent(new Event("pause"))');p.evaluate('window.__cancelPlay(new DOMException("cancelled", "AbortError"))');p.wait_for_timeout(100);ok(p.locator('[data-town-status]').inner_text()=='','native loading pause is not a failure');ok(p.locator('[data-town-play]').inner_text()=='Play','native pause leaves Play label');c.close()
  c,p=setup(browser,820,F['future']);p.evaluate('()=>{const native=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__finishPlay=null;return new Promise((resolve,reject)=>native.call(this).then(()=>window.__finishPlay=resolve,reject));};}')
  watch(p);p.wait_for_function('()=>typeof window.__finishPlay==="function"&&!document.querySelector("video").paused');p.locator('[data-town-hide]').click();p.evaluate('window.__finishPlay()');p.wait_for_timeout(100);ok(paused(p) and p.locator('[data-town-play]').inner_text()=='Play','delayed real play cannot undo Hide')
  watch(p);p.wait_for_function('()=>typeof window.__finishPlay==="function"&&!document.querySelector("video").paused');p.evaluate('Object.defineProperty(document,"hidden",{configurable:true,value:true});document.dispatchEvent(new Event("visibilitychange"));Object.defineProperty(document,"hidden",{configurable:true,value:false});window.__finishPlay()');p.wait_for_timeout(100);ok(paused(p) and p.locator('[data-town-play]').inner_text()=='Play','hidden return does not resume');c.close()
 finally:browser.close()
if server:server.shutdown()
print(json.dumps({'checks':checks,'base':base,'artifacts':str(OUT),'physicalSafari':False}))
