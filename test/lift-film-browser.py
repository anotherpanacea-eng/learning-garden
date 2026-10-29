"""Synthetic307 journeys with real native Chrome controls/decoding.
Optional LIFT_FILM_TEST_URL targets deployed bytes after verification.
Fault cases are separate from the normal movie journey. No app-module interception.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('LIFT_FILM_ARTIFACTS',tempfile.mkdtemp(prefix='lift-film-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def click(p,a,value=None,machine='lift'):
 sel='[data-lift-film-return]' if a=='return' else f'[data-lift-film-action="{a}"]' if a in ['play','replay','retry'] else f'[data-{machine}-action="{a}"]'+(f'[data-{machine}-value="{value}"]' if value is not None else '')
 p.locator(sel).click()
def ready(p,owner='explorer-1'):
 p.wait_for_selector('[data-lift-root],[data-select-explorer]')
 if p.locator(f'[data-select-explorer="{owner}"]').count():p.locator(f'[data-select-explorer="{owner}"]').click()
 p.locator('[data-lift-root]').wait_for();p.wait_for_function("[...document.querySelectorAll('[data-lift-root] button')].every(b=>getComputedStyle(b).minHeight==='44px')")
 # Initial preservation snapshots include rendered line breaks; wait for the actual yard styles/fonts.
 p.wait_for_function("[...document.styleSheets].some(s=>s.href?.endsWith('/lift-yard.css')&&s.cssRules.length>0)");p.evaluate('async()=>{await document.fonts.ready;return true}')
def setup(b,base,seed,width,reduce=True):
 c=b.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce' if reduce else 'no-preference')
 c.add_init_script('''(seed=>{if(!localStorage.getItem('lift-film-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-29T12:00:00.000Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'acorn',createdAt:'2026-10-29T12:00:00.000Z'}]}));for(const id of ['explorer-1','explorer-2'])localStorage.setItem('number-garden-v1:'+id,JSON.stringify(seed));localStorage.setItem('lift-film-fixture','1');}window.filmWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1'))window.filmWrites++;return set.call(this,k,v);};window.filmCreated=[];window.filmRevoked=[];const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=x=>{const u=create(x);filmCreated.push(u);return u;};URL.revokeObjectURL=u=>{filmRevoked.push(u);revoke(u);};})('''+json.dumps(seed)+')')
 c.add_init_script("window.filmAudioContexts=[];const Native=window.AudioContext;if(Native)window.AudioContext=class extends Native{constructor(){super();filmAudioContexts.push(this);}};void 0")
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));requests=[];p.on('request',lambda r:requests.append(r.url));p.goto(base+'#workshop/lift',wait_until='networkidle');ready(p);return c,p,requests


def pose(p):return p.locator('[data-lift-root]').evaluate("r=>({text:r.innerText,pictures:[...r.querySelectorAll('svg')].map(e=>e.outerHTML),pressed:[...r.querySelectorAll('[aria-pressed]')].map(e=>[e.dataset.liftAction||e.dataset.leverAction,e.dataset.liftValue||e.dataset.leverValue,e.getAttribute('aria-pressed')]),details:[...r.querySelectorAll('[data-lift-details],[data-lever-details]')].map(e=>[e.dataset.liftDetails||e.dataset.leverDetails,e.open]),buttons:[...r.querySelectorAll('button')].map(e=>[e.textContent,e.disabled])})")
def movie_ready(p):p.wait_for_function("document.querySelector('video')?.readyState>=2&&document.querySelector('video').duration>37.9");ok(p.locator('video').evaluate('v=>v.currentSrc.startsWith("blob:")&&v.muted'),'actual complete movie decodes from muted Blob')
def layout(p):
 p.wait_for_function("[...document.querySelectorAll('[data-lift-root] button')].every(b=>getComputedStyle(b).minHeight==='44px')")
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no sideways overflow')
 for b in p.locator('[data-lift-root] button').all():
  r=b.bounding_box();ok(r is not None and r['height']>=43.9 and r['width']>=43.9,'all current buttons44px')
def roundtrip(p,escape=False):
 saved=pose(p);click(p,'watch');movie_ready(p);layout(p)
 ok(not p.locator('[data-lift-action],[data-lever-action],.ly-held,.ly-facts,.ly-complete').count(),'film is a separate turn; no hidden manual controls')
 ok(p.locator('video').evaluate('v=>v.paused'),'reduced motion keeps an actual still');ok(p.locator('[data-lift-film-transcript] li').count()==6,'full readable transcript')
 ok(p.evaluate('document.activeElement.hasAttribute("data-lift-film-return")'),'Watch focuses Return')
 if escape:p.keyboard.press('Escape')
 else:click(p,'return')
 ok(pose(p)==saved,'Return restores exact mode/page/plan/notice/facts/drawing/details/held reference');ok(p.evaluate('document.activeElement.dataset.liftAction')=='watch','Return restores Watch focus')
def journey(b,base,seed,width):
 c,p,requests=setup(b,base,seed,width)
 try:
  raw=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");writes=p.evaluate('filmWrites');ok(not any('/assets/ramp-lever-corrected.' in r for r in requests) and not p.locator('video').count(),'no film/poster request on entry');layout(p)
  p.evaluate('window.oldMode=document.querySelector("[data-lift-action=mode][data-lift-value=lever]");window.oldWatch=document.querySelector("[data-lift-action=watch]")')
  saved=pose(p);click(p,'watch');movie_ready(p);p.evaluate('oldMode.click();oldWatch.click()');ok(p.locator('[data-lift-film-movie]').count()==1 and sum('.mp4' in x for x in requests)==1,'detached mode and Watch cannot mutate or refetch');layout(p)
  for t,words in [(3.5,'fallen beam'),(7.3,'Log in the middle'),(14,'half the push'),(24,'distance pushed down'),(31.9,'no friction'),(37.4,'more push')]:
   p.locator('video').evaluate('(v,t)=>v.currentTime=t',t);p.wait_for_function('(text)=>document.querySelector("[data-lift-film-caption]").textContent.includes(text)',arg=words);ok(True,'actual38s seek has exact full cue')
  click(p,'play');p.wait_for_function("!document.querySelector('video').paused");p.locator('[data-lift-film-transcript] summary').click();p.wait_for_function("document.querySelector('video').paused");ok(True,'opening transcript pauses real film');p.locator('[data-lift-film-transcript] summary').click()
  click(p,'replay');p.wait_for_function("document.querySelector('video').currentTime<1&&!document.querySelector('video').paused");click(p,'play');p.wait_for_function("document.querySelector('video').paused");ok(True,'large Replay and Pause control native movie')
  click(p,'play');p.evaluate("document.dispatchEvent(new Event('garden-speak-request'))");p.wait_for_function("document.querySelector('video').paused");ok(True,'narration pauses film');ok(p.evaluate("(()=>{const a=document.querySelector('.skip-link');return a!==document.activeElement&&a.getBoundingClientRect().bottom<=0;})()"),'skip link stays outside actual viewport; full-page paint may differ');ok(p.locator('[data-lift-film-return]').bounding_box()['y']<1000,'Return is visible above the film on tablet/phone');p.screenshot(path=str(OUT/f'lifting-film-{width}.png'),full_page=True);p.keyboard.press('Escape');ok(pose(p)==saved,'native playback/seek leave exact initial delivery intact '+str({k:[saved[k],pose(p)[k]] for k in saved if saved[k]!=pose(p)[k]}))
  # Keep a completed lever reference and a second lever trip behind an invalid draft.
  click(p,'mode','lever');click(p,'pivot',3,'lever');click(p,'start',machine='lever')
  for _ in range(3):click(p,'push',machine='lever')
  click(p,'hold',machine='lever');click(p,'jobs',machine='lever');click(p,'job',1,'lever');click(p,'pivot',3,'lever');click(p,'start',machine='lever');click(p,'push',machine='lever');click(p,'plan',machine='lever');click(p,'pivot',1,'lever');click(p,'start',machine='lever');ok('This setting needs 12 N' in p.locator('#lever-notice').inner_text(),'actual invalid lever draft retains waiting trip');click(p,'view','numbers','lever')
  for key in ['lever-model','lever-why','lever-path']:p.locator(f'[data-lever-details="{key}"] summary').click()
  roundtrip(p,True);lever=pose(p)
  click(p,'mode','ramp');click(p,'start');click(p,'pull');click(p,'plan');click(p,'board',6);click(p,'start');ok('boards up to' in p.locator('#lift-notice').inner_text(),'actual invalid ramp draft with waiting trip')
  for key in ['model','why']:p.locator(f'[data-lift-details="{key}"] summary').click()
  roundtrip(p);ramp=pose(p);click(p,'mode','lever');ok(pose(p)==lever,'other machine kept independent partial state');click(p,'jobs',machine='lever');roundtrip(p);p.locator('[data-lever-action=return]').click();click(p,'mode','ramp');ok(pose(p)==ramp,'ramp still exact after lever job list and movie');click(p,'jobs');roundtrip(p);p.locator('[data-lift-action=return]').click()
  # Change held reference in the other direction, then preserve it during a lever movie.
  click(p,'keep');click(p,'pull');click(p,'hold');click(p,'mode','lever');roundtrip(p,True);ok('Held completed ramp trip' in p.locator('.ly-held').inner_text(),'Ramp reference survives Lever movie')
  # Complete both shifts; movie entry stays available at wins and after a new shift.
  for machine in ['ramp','lever']:
   click(p,'mode',machine);prefix=machine if machine=='lever' else 'lift'
   for slot in range(6):
    click(p,'jobs',machine=prefix);click(p,'job',slot,prefix)
    if p.locator(f'[data-{prefix}-action=plan]').count():click(p,'plan',machine=prefix)
    if machine=='ramp':
     import re
     tag=p.locator('.ly-tag').inner_text();w,cap=map(int,re.search(r'Load weight: (\d+) N · Winch can pull up to (\d+) N',tag).groups());boards=list(map(int,re.search(r'Boards available: ([0-9, ]+) m',tag).group(1).split(',')));value=next(v for v in boards if w/v<=cap);click(p,'board',value)
    else:
     import re
     w,cap,space=map(int,re.search(r'Load weight: (\d+) N · Push unit can provide up to (\d+) N · Space from the pivot for the push side: (\d+) m',p.locator('.ly-tag').inner_text()).groups());value=next(v for v in [1,2,3] if 12*v/(v+1)<=space and w/v<=cap);click(p,'pivot',value,'lever')
    click(p,'start',machine=prefix)
    while p.locator(f'[data-{prefix}-action={"pull" if machine=="ramp" else "push"}]').is_enabled():click(p,'pull' if machine=='ramp' else 'push',machine=prefix)
   ok(p.locator('.ly-complete').count()==1,'six jobs complete their own shift');roundtrip(p);click(p,'shift',machine=prefix);roundtrip(p)
  ok(p.evaluate('filmCreated.length===filmRevoked.length&&new Set(filmRevoked).size===filmRevoked.length'),'every movie source revoked exactly once');ok(p.evaluate('filmAudioContexts.length')==0,'silent film allocates no audio context');ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==raw and p.evaluate('filmWrites')==writes,'all film/manual actions preserve every saved owner/sibling')
  p.evaluate('window.staleWatch=document.querySelector("[data-lift-action=watch]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer=explorer-2]').click();ready(p,'explorer-2');p.evaluate('staleWatch.click()');ok(not p.locator('video,.ly-lever').count(),'replacement explorer rejects old Watch and starts Ramp');p.reload(wait_until='networkidle');ready(p,'explorer-2');ok(json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')"))==seed and not p.locator('video').count(),'reload starts fresh visit without save mutation')
 finally:c.close()
def faults(b,base,seed):
 c,p,_=setup(b,base,seed,820)
 try:
  p.route('**/assets/ramp-lever-corrected.mp4',lambda r:r.fulfill(status=503,body='Synthetic failure'));click(p,'watch');p.wait_for_function("document.querySelector('[data-lift-film-load-status]').textContent.includes('could not play')");ok(p.locator('[data-lift-film-transcript] li').count()==6,'failed fetch retains transcript and Return');p.unroute('**/assets/ramp-lever-corrected.mp4');click(p,'retry');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'explicit retry does not autoplay');click(p,'return');ok(p.evaluate('filmCreated.length===filmRevoked.length'),'retry source revoked exactly once');
  p.route('**/assets/ramp-lever-corrected.mp4',lambda r:r.fulfill(status=200,body='Synthetic invalid video',content_type='video/mp4'));click(p,'watch');p.wait_for_function("document.querySelector('[data-lift-film-load-status]').textContent.includes('could not play')");ok(p.locator('[data-lift-film-transcript] li').count()==6 and p.locator('[data-lift-film-return]').is_enabled(),'real native decoder failure retains complete transcript and Return');click(p,'return');p.unroute('**/assets/ramp-lever-corrected.mp4')
  p.route('**/assets/ramp-lever-corrected.vtt',lambda r:r.fulfill(status=503,body='Synthetic missing captions'));click(p,'watch');movie_ready(p);p.wait_for_function("document.querySelector('track').readyState===3");p.locator('video').evaluate('v=>{v.currentTime=14}');p.wait_for_function("document.querySelector('[data-lift-film-caption]').textContent.includes('half the push')");ok(p.locator('[data-lift-film-transcript] li').count()==6,'real failed caption track still has current caption and full reading alternative');click(p,'return');p.unroute('**/assets/ramp-lever-corrected.vtt')
  pending=[];p.route('**/assets/ramp-lever-corrected.mp4',lambda route:pending.append(route));click(p,'watch');p.wait_for_timeout(150);ok(bool(pending),'fault-case download genuinely pending');p.evaluate("location.hash='#notes'");p.wait_for_timeout(150)
  for r in pending:
   try:r.continue_()
   except Exception:pass
  p.wait_for_timeout(200);ok(not p.locator('video').count(),'departure prevents late movie attachment');p.unroute('**/assets/ramp-lever-corrected.mp4')
 finally:c.close()
def asynchronous(b,base,seed):
 c,p,requests=setup(b,base,seed,820,False)
 try:
  p.evaluate('window.oldWatch=document.querySelector("[data-lift-action=watch]")');click(p,'watch');movie_ready(p);p.wait_for_function("document.querySelector('video').currentTime>.2&&!document.querySelector('video').paused");ok(True,'explicit non-reduced Watch starts real muted playback');count=sum('.mp4' in x for x in requests);p.evaluate('oldWatch.click()');ok(sum('.mp4' in x for x in requests)==count,'detached duplicate Watch cannot fetch again');p.evaluate("window.filmHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>filmHidden});document.dispatchEvent(new Event('visibilitychange'))");p.wait_for_function("document.querySelector('video').paused");p.evaluate("filmHidden=false;document.dispatchEvent(new Event('visibilitychange'))");ok(p.locator('video').evaluate('x=>x.paused'),'synthetic hidden/visible cycle does not resume');click(p,'return')
  held=[];p.route('**/assets/ramp-lever-corrected.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);click(p,'retry');p.wait_for_timeout(100);ok(len(held)==2,'two distinct fault-case requests genuinely pending');data=(ROOT/'dist/assets/ramp-lever-corrected.mp4').read_bytes();held[1].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p)
  try:held[0].fulfill(status=200,body=data,content_type='video/mp4')
  except Exception:pass
  p.wait_for_timeout(100);ok(p.evaluate('filmCreated.length===2'),'aborted older fetch creates no extra Blob');ok(p.locator('video').evaluate('x=>x.paused'),'retry winner remains paused');p.unroute('**/assets/ramp-lever-corrected.mp4')
  p.evaluate("window.originalSoundPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const media=this;return new Promise((resolve,reject)=>{window.releaseSoundPlay=()=>originalSoundPlay.call(media).then(resolve,reject);});};void 0");click(p,'play');p.evaluate("window.dispatchEvent(new Event('pagehide'));releaseSoundPlay()");p.wait_for_timeout(200);ok(p.locator('video').evaluate('x=>x.paused'),'late programmatic play cannot undo pagehide pause');p.evaluate('HTMLMediaElement.prototype.play=originalSoundPlay;void 0');click(p,'return');ok(p.evaluate('filmCreated.length===filmRevoked.length&&new Set(filmRevoked).size===filmRevoked.length'),'each created source revoked exactly once across retry/return')
  held=[];p.route('**/assets/ramp-lever-corrected.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);ok(len(held)==1,'visibility fault holds a real pending fetch');p.evaluate("filmHidden=true;document.dispatchEvent(new Event('visibilitychange'));filmHidden=false;document.dispatchEvent(new Event('visibilitychange'))");held[0].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'download finishing after hidden/visible cannot autoplay');p.unroute('**/assets/ramp-lever-corrected.mp4');p.evaluate('window.oldMoviePlay=document.querySelector("[data-lift-film-action=play]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p,'explorer-2');p.evaluate('oldMoviePlay.click()');ok(not p.locator('video').count(),'old movie controls cannot open playback for replacement explorer');ok(p.evaluate('filmCreated.length===filmRevoked.length'),'explorer replacement disposes active source')
 finally:c.close()
def transfer_and_entry(b,base):
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {startWorkshop,releaseWorkshop,stepWorkshop,finishWorkshop} from './dist/workshop-core.mjs';import {startFair,revealFair,setFairPage,keepFair} from './dist/fair-test-core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};startWorkshop(s);releaseWorkshop(s);stepWorkshop(s);stepWorkshop(s);finishWorkshop(s);startFair(s);revealFair(s,'A');revealFair(s,'B');keepFair(s);setFairPage(s,'tell');s.syntheticOther={payload:'x'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 c,p,_=setup(b,base,seed,820)
 try:
  click(p,'start');click(p,'pull');saved=pose(p);roundtrip(p);ok(pose(p)==saved,'healthy historical owners coexist with movie');p.evaluate('window.preImportWatch=document.querySelector("[data-lift-action=watch]");location.hash="#notes"');p.locator('#download').wait_for()
  with p.expect_download() as info:p.locator('#download').click()
  file=OUT/'synthetic-lift-notes.json';info.value.save_as(str(file));report=json.loads(file.read_text());ok(report['workshop']==seed['workshop'] and report['fairTests']==seed['fairTests'] and report['syntheticOther']==seed['syntheticOther'],'real download preserves healthy history and large sibling');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId!=='explorer-1'");owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.evaluate('location.hash="#workshop/lift"');ready(p,owner);p.evaluate('preImportWatch.click()');ok(not p.locator('video').count() and p.locator('[data-lift-distance]').inner_text()=='0 of 2 m','real import invalidates old Watch and partial visit');imported=json.loads(p.evaluate("id=>localStorage.getItem('number-garden-v1:'+id)",owner));ok(imported['workshop']==seed['workshop'] and imported['fairTests']==seed['fairTests'] and imported['syntheticOther']==seed['syntheticOther'],'healthy imported owners and unknown sibling retained')
  click(p,'watch');movie_ready(p);p.evaluate('window.preResetReturn=document.querySelector("[data-lift-film-return]");location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click()
  if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').click()
  p.evaluate('location.hash="#workshop/lift"');ready(p,owner);p.evaluate('preResetReturn.click()');ok(not p.locator('video').count() and p.locator('[data-lift-distance]').inner_text()=='0 of 2 m','actual reset invalidates old film Return')
 finally:c.close()
def missing_motion(b,base,seed):
 c,p,_=setup(b,base,seed,820)
 try:
  p.evaluate('window.matchMedia=undefined');click(p,'watch');movie_ready(p);ok(p.locator('video').evaluate('v=>v.paused'),'missing matchMedia opens still');click(p,'return')
 finally:c.close()
def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.science={version:99,visits:'retained'};s.workshop={version:99,opaque:'retained'};s.fairTests={version:99,opaque:'retained'};s.bellStudio={version:99,future:'kept'};s.rhythm={version:99,future:'kept'};s.syntheticOther={payload:'z'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('LIFT_FILM_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
  try:
   for width in [320,820,1024]:
    journey(b,base,seed,width);print('film width',width,'passed',flush=True)
   missing_motion(b,base,seed);faults(b,base,seed);asynchronous(b,base,seed);transfer_and_entry(b,base);ok(not errors,'no page errors '+str(errors));r={'status':'passed','checks':checks,'base':base,'limits':'nativeChrome and labelled faults; no physicaliPad/Safari, screen-reader speech, human continuous viewing, physical experiment or learning outcomes'};(OUT/'receipt.json').write_text(json.dumps(r,indent=2));print(json.dumps(r))
  finally:b.close();server.shutdown()
if __name__=='__main__':main()
