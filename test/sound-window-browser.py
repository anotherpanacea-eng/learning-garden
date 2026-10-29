"""Synthetic303 journeys with real native Chrome controls/decoding.
Optional SOUND_WINDOW_TEST_URL targets deployed bytes after verification.
Fault cases are separate from the normal movie journey. No app-module interception.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('SOUND_WINDOW_ARTIFACTS',tempfile.mkdtemp(prefix='sound-window-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def click(p,a):p.locator(f'[data-sound-action="{a}"]').click()
def ready(p,owner='explorer-1'):
 p.wait_for_selector('[data-sound-root],[data-select-explorer]')
 if p.locator(f'[data-select-explorer="{owner}"]').count():p.locator(f'[data-select-explorer="{owner}"]').click()
 p.locator('[data-sound-root]').wait_for();p.wait_for_function("getComputedStyle(document.querySelector('[data-sound-action]')).minHeight==='44px'")
def setup(b,base,seed,width,reduce=True):
 c=b.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce' if reduce else 'no-preference')
 c.add_init_script('''(seed=>{if(!localStorage.getItem('sound-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-29T12:00:00.000Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'acorn',createdAt:'2026-10-29T12:00:00.000Z'}]}));for(const id of ['explorer-1','explorer-2'])localStorage.setItem('number-garden-v1:'+id,JSON.stringify(seed));localStorage.setItem('sound-fixture','1');}window.soundWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1'))window.soundWrites++;return set.call(this,k,v);};window.soundCreated=[];window.soundRevoked=[];const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=x=>{const u=create(x);soundCreated.push(u);return u;};URL.revokeObjectURL=u=>{soundRevoked.push(u);revoke(u);};})('''+json.dumps(seed)+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));requests=[];p.on('request',lambda r:requests.append(r.url));p.goto(base+'#studio/sound-window',wait_until='networkidle');ready(p);return c,p,requests

def pose(p):return p.evaluate("[...document.querySelectorAll('[data-sound-action][aria-pressed=true]')].map(x=>x.dataset.soundAction)")
def movie_ready(p):p.wait_for_function("document.querySelector('video')?.readyState>=2&&document.querySelector('video').duration>35.9");ok(p.locator('video').evaluate('v=>v.currentSrc.startsWith("blob:")&&v.muted'),'native movie decodes from local Blob, muted')
def layout(p):
 # Each redraw inserts its component stylesheet; wait for actual styles before geometry.
 p.wait_for_function("[...document.querySelectorAll('[data-sound-root] button')].every(b=>getComputedStyle(b).minHeight==='44px')")
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no sideways scroll')
 for box in p.locator('[data-sound-root] button').all():
  r=box.bounding_box();ok(r is not None and r['height']>=43.9 and r['width']>=43.9,'every current control has a 44px touch area')
 for svg in p.locator('[data-sound-drawing]').all():
  ok(svg.evaluate('s=>s.querySelector("title").textContent.includes("computer signal")&&s.querySelector("desc").textContent.includes("not air")'),'accessible graph has explanatory title and description')
def journey(b,base,seed,width):
 c,p,requests=setup(b,base,seed,width)
 try:
  before=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");beforeWrites=p.evaluate("soundWrites");ok(not any('.mp4' in x for x in requests),'no entry movie fetch');ok(not p.locator('video').count(),'no entry video');layout(p)
  click(p,'hold');click(p,'marker');click(p,'later');reference=p.locator('[data-sound-drawing=held] [data-sound-wave]').get_attribute('d')
  for pitch in ['low','high']:
   for size in [1,2]:
    click(p,pitch);click(p,'size'+str(size));svg=p.locator('[data-sound-drawing=current]');title=svg.locator('title').text_content();ok(str(220 if pitch=='low' else 440) in title and f'amplitude {size}' in title,'separate controls select four exact configurations')
    values=svg.locator('[data-sound-wave]').evaluate('p=>Array.from({length:257},(_,i)=>p.getPointAtLength(i/256*p.getTotalLength()).y)');ok(min(values)>23 and max(values)<217,'both amplitude peaks have fixed drawing headroom');ok(p.locator('[data-sound-drawing=held] [data-sound-wave]').get_attribute('d')==reference,'held path stays frozen')
    ok(p.locator('[data-sound-marker-value=current] .sw-spoken').text_content().startswith('Current setting'),'current sample qualified');ok(p.locator('[data-sound-marker-value=held] .sw-spoken').text_content().startswith('Held setting'),'held sample qualified');layout(p)
  ok('Both' in p.locator('[data-sound-comparison]').inner_text(),'both changes described');click(p,'size1');ok('frequency changed' in p.locator('[data-sound-comparison]').inner_text(),'only frequency changed');click(p,'low');ok('Same' in p.locator('[data-sound-comparison]').inner_text(),'same settings described');click(p,'size2');ok('Signal size changed' in p.locator('[data-sound-comparison]').inner_text(),'only size changed');click(p,'hold');ok('Same' in p.locator('[data-sound-comparison]').inner_text(),'explicit replace updates held snapshot')
  click(p,'earlier');ok(p.locator('[data-sound-action=earlier]').is_disabled(),'marker clamps at first');ok(p.evaluate('document.activeElement.dataset.soundAction')=='later','focus moves from disabled first endpoint');
  for _ in range(32):click(p,'later')
  ok(p.locator('[data-sound-action=later]').is_disabled(),'marker clamps at last');ok(p.evaluate('document.activeElement.dataset.soundAction')=='earlier','focus moves from disabled last endpoint');p.locator('[data-sound-action=earlier]').focus();p.keyboard.press('Enter');ok('31 of 32' in p.locator('[data-sound-marker-value=current]').inner_text(),'keyboard marker movement')
  model=pose(p);marker=p.locator('[data-sound-marker-value=current]').inner_text();click(p,'watch');movie_ready(p);ok(p.locator('video').evaluate('v=>v.paused'),'reduced-motion explicit Watch leaves still');ok(p.locator('[data-sound-transcript] li').count()==13,'complete corrected transcript');layout(p);click(p,'play');p.wait_for_function("document.querySelector('video').currentTime>.1&&!document.querySelector('video').paused");click(p,'play');ok(p.locator('video').evaluate('v=>v.paused'),'large pause control works')
  for time,words in [(8.5,'Push the end'),(19.5,'shorter free end'),(30.5,'Air makes')]:
   p.locator('video').evaluate('(v,t)=>{v.currentTime=t}',time);p.wait_for_function('(s)=>document.querySelector("[data-sound-caption]").textContent.includes(s)',arg=words);ok(True,'real native seek updates corrected external caption')
  p.locator('[data-sound-transcript] summary').click();click(p,'play');p.wait_for_function("!document.querySelector('video').paused");p.evaluate("document.dispatchEvent(new Event('garden-speak-request'))");p.wait_for_function("document.querySelector('video').paused");ok(True,'narration request pauses film');p.screenshot(path=str(OUT/f'sound-movie-{width}.png'),full_page=True);p.keyboard.press('Escape');ok(pose(p)==model and p.locator('[data-sound-marker-value=current]').inner_text()==marker,'Return preserves both settings and marker');ok(p.evaluate('document.activeElement.dataset.soundAction')=='watch','Escape restores Watch focus');ok(p.evaluate('soundCreated.length===soundRevoked.length'),'Return revokes Blob');p.screenshot(path=str(OUT/f'sound-window-{width}.png'),full_page=True)
  ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==before and p.evaluate('soundWrites')==beforeWrites,'all room actions preserve unknown owners and large sibling without notebook writes '+str(p.evaluate('soundWrites'))+' equal='+str(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==before));click(p,'clear');ok(not p.locator('[data-sound-figure=held]').count(),'clear held works');p.evaluate('window.oldSound=document.querySelector("[data-sound-action=high]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p,'explorer-2');p.evaluate('oldSound.click()');ok(pose(p)==['low','size1'],'old controls cannot edit replacement explorer');p.reload(wait_until='networkidle');ready(p,'explorer-2');ok(pose(p)==['low','size1'],'reload starts local default');ok(json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')"))==seed,'reload retains unsupported owners')
 finally:c.close()
def audio(b,base,seed):
 c,p,_=setup(b,base,seed,820)
 try:
  p.evaluate("window.soundContexts=[];const Native=window.AudioContext;window.AudioContext=class extends Native{constructor(){super();soundContexts.push(this);}};void 0")
  click(p,'high');click(p,'size2');ok(p.evaluate('soundContexts.length')==0,'changing controls allocates no context');click(p,'current');p.wait_for_function("document.querySelector('[data-sound-status]').textContent.includes('scheduled')");ok(p.evaluate('soundContexts.length===1&&soundContexts[0].state==="running"'),'explicit tone schedules real native context');click(p,'stop');p.wait_for_function('soundContexts[0].state==="suspended"');ok(True,'manual Stop suspends native context');click(p,'current');p.wait_for_function("document.querySelector('[data-sound-status]').textContent.includes('ended')");p.wait_for_function('soundContexts[0].state==="suspended"');ok(True,'natural tone finish suspends real context');click(p,'current');p.wait_for_function('soundContexts[0].state==="running"');p.evaluate("window.dispatchEvent(new Event('pagehide'))");p.wait_for_function('soundContexts[0].state==="suspended"');ok(True,'pagehide stops native tone')
  click(p,'hold');click(p,'held');p.wait_for_function('soundContexts[0].state==="running"');click(p,'watch');movie_ready(p);p.wait_for_function('soundContexts[0].state==="suspended"');ok(True,'movie entry stops held tone')
 finally:c.close()
 c,p,_=setup(b,base,seed,820)
 try:
  p.evaluate('window.AudioContext=undefined;window.webkitAudioContext=undefined;void 0');click(p,'current');p.wait_for_function("document.querySelector('[data-sound-status]').textContent.includes('unavailable')");click(p,'high');ok('high' in pose(p),'audio-unavailable keeps picture controls playable')
 finally:c.close()
def faults(b,base,seed):
 c,p,_=setup(b,base,seed,820)
 try:
  p.route('**/assets/sound-wave-corrected.mp4',lambda r:r.fulfill(status=503,body='Synthetic failure'));click(p,'watch');p.wait_for_function("document.querySelector('[data-sound-load-status]').textContent.includes('could not play')");ok(p.locator('[data-sound-transcript] li').count()==13,'failed fetch retains transcript and Return');p.unroute('**/assets/sound-wave-corrected.mp4');click(p,'retry');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'explicit retry does not autoplay');click(p,'return');ok(p.evaluate('soundCreated.length===soundRevoked.length'),'retry source revoked exactly once');
  pending=[];p.route('**/assets/sound-wave-corrected.mp4',lambda route:pending.append(route));click(p,'watch');p.wait_for_timeout(150);ok(bool(pending),'fault-case download genuinely pending');p.evaluate("location.hash='#notes'");p.wait_for_timeout(150)
  for r in pending:
   try:r.continue_()
   except Exception:pass
  p.wait_for_timeout(200);ok(not p.locator('video').count(),'departure prevents late movie attachment');p.unroute('**/assets/sound-wave-corrected.mp4')
 finally:c.close()
def asynchronous(b,base,seed):
 c,p,requests=setup(b,base,seed,820,False)
 try:
  p.evaluate('window.oldWatch=document.querySelector("[data-sound-action=watch]")');click(p,'watch');movie_ready(p);p.wait_for_function("document.querySelector('video').currentTime>.2&&!document.querySelector('video').paused");ok(True,'explicit non-reduced Watch starts real muted playback');count=sum('.mp4' in x for x in requests);p.evaluate('oldWatch.click()');ok(sum('.mp4' in x for x in requests)==count,'detached duplicate Watch cannot fetch again');p.evaluate("window.soundHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>soundHidden});document.dispatchEvent(new Event('visibilitychange'))");p.wait_for_function("document.querySelector('video').paused");p.evaluate("soundHidden=false;document.dispatchEvent(new Event('visibilitychange'))");ok(p.locator('video').evaluate('x=>x.paused'),'synthetic hidden/visible cycle does not resume');click(p,'return')
  held=[];p.route('**/assets/sound-wave-corrected.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);click(p,'retry');p.wait_for_timeout(100);ok(len(held)==2,'two distinct fault-case requests genuinely pending');data=(ROOT/'dist/assets/sound-wave-corrected.mp4').read_bytes();held[1].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p)
  try:held[0].fulfill(status=200,body=data,content_type='video/mp4')
  except Exception:pass
  p.wait_for_timeout(100);ok(p.evaluate('soundCreated.length===2'),'aborted older fetch creates no extra Blob');ok(p.locator('video').evaluate('x=>x.paused'),'retry winner remains paused');p.unroute('**/assets/sound-wave-corrected.mp4')
  p.evaluate("window.originalSoundPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const media=this;return new Promise((resolve,reject)=>{window.releaseSoundPlay=()=>originalSoundPlay.call(media).then(resolve,reject);});};void 0");click(p,'play');p.evaluate("window.dispatchEvent(new Event('pagehide'));releaseSoundPlay()");p.wait_for_timeout(200);ok(p.locator('video').evaluate('x=>x.paused'),'late programmatic play cannot undo pagehide pause');p.evaluate('HTMLMediaElement.prototype.play=originalSoundPlay;void 0');click(p,'return');ok(p.evaluate('soundCreated.length===soundRevoked.length&&new Set(soundRevoked).size===soundRevoked.length'),'each created source revoked exactly once across retry/return')
  held=[];p.route('**/assets/sound-wave-corrected.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);ok(len(held)==1,'visibility fault holds a real pending fetch');p.evaluate("soundHidden=true;document.dispatchEvent(new Event('visibilitychange'));soundHidden=false;document.dispatchEvent(new Event('visibilitychange'))");held[0].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'download finishing after hidden/visible cannot autoplay');p.unroute('**/assets/sound-wave-corrected.mp4');p.evaluate('window.oldMoviePlay=document.querySelector("[data-sound-action=play]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p,'explorer-2');p.evaluate('oldMoviePlay.click()');ok(not p.locator('video').count(),'old movie controls cannot open playback for replacement explorer');ok(p.evaluate('soundCreated.length===soundRevoked.length'),'explorer replacement disposes active source')
 finally:c.close()
def transfer_and_entry(b,base):
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {chooseBellCard,appendBellSlot,saveBellBefore,keepBellCall,setBellPage} from './dist/bell-studio-core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};chooseBellCard(s,'own-call');appendBellSlot(s,'low');appendBellSlot(s,'high');saveBellBefore(s);keepBellCall(s);setBellPage(s,'compare');s.syntheticOther={payload:'x'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 c,p,_=setup(b,base,seed,820)
 try:
  before=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"))['bellStudio'];ok(before['currentCard'] is not None,'healthy Bell fixture has saved work');p.evaluate("location.hash='#studio/bells'");p.locator('[data-bs-root]').wait_for();p.locator('a[href="#studio/sound-window"]').click();ready(p);click(p,'high');click(p,'hold');click(p,'watch');movie_ready(p);click(p,'return');p.locator('.sw-room header a').click();p.locator('[data-bs-root]').wait_for();after=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"))['bellStudio'];ok(after==before,'healthy Bell current/before/kept/page/source unchanged through real entry and return');ok(p.locator('[data-bs-page=compare]').get_attribute('aria-pressed')=='true','Bell compare page restored');p.locator('a[href="#studio/sound-window"]').click();ready(p)
  p.evaluate('window.beforeSoundImport=document.querySelector("[data-sound-action=high]");location.hash="#notes"');p.locator('#download').wait_for()
  with p.expect_download() as info:p.locator('#download').click()
  file=OUT/'synthetic-sound-notes.json';info.value.save_as(str(file));report=json.loads(file.read_text());ok(report['bellStudio']==before and report['syntheticOther']==seed['syntheticOther'],'actual Notes download retains Bell and large sibling');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId!=='explorer-1'");owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.evaluate("location.hash='#studio/sound-window'");ready(p,owner);p.evaluate('beforeSoundImport.click()');ok(pose(p)==['low','size1'],'real import invalidates previous controls');imported=json.loads(p.evaluate("id=>localStorage.getItem('number-garden-v1:'+id)",owner));ok(imported['bellStudio']==before and imported['syntheticOther']==seed['syntheticOther'],'real imported Bell preserves all saved work')
 finally:c.close()
def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.bellStudio={version:99,future:'retained'};s.rhythm={version:99,future:'retained'};s.science={version:99,visits:'retained'};s.syntheticOther={payload:'z'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('SOUND_WINDOW_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
  try:
   for width in [320,820,1024]:journey(b,base,seed,width)
   audio(b,base,seed);faults(b,base,seed);asynchronous(b,base,seed);transfer_and_entry(b,base);ok(not errors,'no page errors '+str(errors));r={'status':'passed','checks':checks,'base':base,'limits':'nativeChrome with real decode/output scheduling and labelled faults; not physicaliPad/Safari, audible quality, screen-reader speech or learning effects'};(OUT/'receipt.json').write_text(json.dumps(r,indent=2));print(json.dumps(r))
  finally:b.close();server.shutdown()
if __name__=='__main__':main()
