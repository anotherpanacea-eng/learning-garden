"""Synthetic300 native-media/support journeys; default local host ignores Range.
RHYTHM_SONG_URL selects a hosted release. No audible or physical-device claim.
"""
import copy,functools,http.server,importlib.util,json,os,subprocess,sys,tempfile,threading
sys.dont_write_bytecode=True
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('RHYTHM_SONG_ARTIFACTS',tempfile.mkdtemp(prefix='rhythm-song-')));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('rhythm_helpers',ROOT/'test/rhythm-browser.py');H=importlib.util.module_from_spec(spec);spec.loader.exec_module(H);H.OUT=OUT
source="""import {rhythmFixtures} from './test/rhythm-checks.mjs';import * as r from './dist/rhythm-core.mjs';import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from './dist/progress-limits.mjs';const f=rhythmFixtures();for(const name of ['partial','finished']){const w=r.rhythmView(f[name]).current;for(const a of w.checks)delete a.songBefore;if(w.kept)delete w.kept.songBefore;}f.changed=structuredClone(f.partial);r.offerRhythmSong(f.changed);f.changed.rhythm.song.source.examples=[{id:'earlier',pattern:['w']}];f.capacity=structuredClone(f.partial);f.capacity.syntheticOther.payload='';const before=new TextEncoder().encode(JSON.stringify(f.capacity,null,2)).length,p=structuredClone(f.capacity);r.offerRhythmSong(p);const delta=new TextEncoder().encode(JSON.stringify(p,null,2)).length-before;f.capacity.syntheticOther.payload='界'.repeat(Math.floor((MAX_IMPORT_BYTES-before-Math.max(3,Math.floor(delta/2)))/3));if(!recoveryFitsProgressLimits(f.capacity)||r.offerRhythmSong(structuredClone(f.capacity)))throw Error('Synthetic real byte boundary failed');console.log(JSON.stringify(f));"""
F=json.loads(subprocess.check_output(['node','--input-type=module','-e',source],cwd=ROOT,text=True))
checks=0
def ok(v,m):
 global checks
 assert v,m
 checks+=1
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128
server=None;base=os.environ.get('RHYTHM_SONG_URL')
if not base:
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'

def setup(browser,width,seed,label,normal=False):
 c,p=H.setup(browser,width,seed,label);p.emulate_media(reduced_motion='no-preference' if normal else 'reduce');requests=[]
 p.on('request',lambda r:requests.append(r.url) if '/assets/fill-the-bar' in r.url else None)
 c.add_init_script('window.__songRevokes=[];const revoke=URL.revokeObjectURL.bind(URL);URL.revokeObjectURL=url=>{window.__songRevokes.push(url);revoke(url);};')
 H.go(p,base,'#studio/rhythm');return c,p,requests

def open_song(p):H.click(p,'[data-rhythm-song-open]');p.locator('[data-rhythm-song]').wait_for()
def ready(p):p.wait_for_function('()=>{const v=document.querySelector("[data-rhythm-song] video");return v&&v.readyState>=2&&v.seekable.length>0}')
def playing(p):p.wait_for_function('()=>{const v=document.querySelector("[data-rhythm-song] video");return v&&!v.paused&&v.currentTime>.1}')
def media(p):return p.locator('[data-rhythm-song] video')
def paused(p):return media(p).evaluate('(v)=>v.paused')
def time(p):return media(p).evaluate('(v)=>v.currentTime')

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
 try:
  for width in [320,820,1024]:
   c,p,requests=setup(browser,width,F['partial'],f'journey-{width}');ok(p.locator('video').count()==0 and requests==[],'no song picture/file on room entry')
   H.click(p,'[data-rhythm-slot="0"]');before=H.book(p);visits=copy.deepcopy(before['rhythm']['visits']);open_song(p);ready(p)
   book=H.book(p);ok(book['rhythm']['song']['offered'] and not book['rhythm']['song']['soundRequested'],'Open records available teaching only');ok(book['rhythm']['visits']==visits,'Open preserves draft/checks/keep/drawer flags');ok(H.unrelated(book)==H.unrelated(before),'Open changes no other activity')
   ok(paused(p) and media(p).evaluate('(v)=>v.muted'),'reduced-motion Open stays a silent still');ok(p.locator('[data-song-retry]').is_hidden(),'healthy source hides retry control');ok(media(p).get_attribute('src').startswith('blob:'),'actual native Blob source');ok(media(p).evaluate('(v)=>v.videoWidth===1280&&v.videoHeight===720'),'real decoded picture')
   ok(not media(p).get_attribute('controls'),'no native audio bypass');ok(p.locator('[data-song-replay]').evaluate('(el)=>{const range=document.createRange();range.selectNodeContents(el);return range.getClientRects().length===1}'),'Replay label stays on one readable line');ok(p.locator('.song-pattern').count()==6,'complete static patterns independent of play');ok(p.locator('.song-words p').count()==58,'full as-recorded lyrics available')
   H.click(p,'[data-song-play]');playing(p);p.wait_for_function('()=>document.querySelector("[data-song-lyric]").textContent.includes("One, two")')
   seek=p.locator('[data-song-seek]');seek.scroll_into_view_if_needed();box=seek.bounding_box();p.touchscreen.tap(box['x']+box['width']*.25,box['y']+box['height']/2);p.wait_for_timeout(100);ok(paused(p) and 20<time(p)<45,'touch slider pauses and seeks actual picture')
   seek.focus();seek.press('Home');ok(time(p)<.3,'keyboard slider Home seeks');seek.press('ArrowRight');ok(.05<=time(p)<.3,'keyboard slider advances one step')
   media(p).evaluate('(v)=>v.currentTime=36.5');p.wait_for_function('()=>document.querySelector("[data-song-lyric]").textContent.includes("Dot taps")')
   H.click(p,'[data-song-play]');playing(p);t=time(p);H.click(p,'[data-song-sound]');ok(not media(p).evaluate('(v)=>v.muted') and not paused(p),'Sound on joins active native media');ok(t<=time(p)<t+3,'Sound on never rewinds');ok(H.book(p)['rhythm']['song']['soundRequested'],'request persisted separately');ok(H.book(p)['rhythm']['visits']==visits,'request changes no old work')
   sounded=H.book(p);H.click(p,'[data-song-sound]');ok(media(p).evaluate('(v)=>v.muted') and H.book(p)==sounded,'mute preserves request note')
   H.click(p,'[data-song-play]');held=time(p);H.click(p,'[data-song-sound]');ok(paused(p) and abs(time(p)-held)<.1,'unmute while paused never starts/restarts picture');ok('will join' in p.locator('[data-song-sound-status]').inner_text(),'paused sound request explained')
   H.click(p,'[data-song-replay]');playing(p);ok(time(p)<2,'explicit Replay rewinds')
   p.evaluate('document.dispatchEvent(new CustomEvent("garden-speak-request",{detail:{text:"Synthetic narration request",language:"en"}}))');ok(paused(p),'common narration request pauses song')
   H.click(p,'[data-song-play]');playing(p);p.evaluate('Object.defineProperty(document,"hidden",{configurable:true,value:true});document.dispatchEvent(new Event("visibilitychange"));Object.defineProperty(document,"hidden",{configurable:true,value:false});document.dispatchEvent(new Event("visibilitychange"))');ok(paused(p),'hidden return never resumes')
   p.evaluate('window.__oldSong=document.querySelector("[data-rhythm-song] video");window.__oldSongURL=window.__oldSong.src');media(p).focus();media(p).press('Escape');p.locator('[data-rhythm-song]').wait_for(state='detached');ok(H.current(p)['sequence']==['h'] and p.locator('[data-rhythm-slot="0"]').get_attribute('aria-pressed')=='true','Return preserves draft and selection');ok(p.locator('[data-rhythm-song-open]').evaluate('(e)=>e===document.activeElement'),'Escape restores invitation focus');ok(p.evaluate('window.__oldSong.paused&&window.__songRevokes.filter(x=>x===window.__oldSongURL).length===1'),'Return pauses and revokes exactly once')
   H.click(p,'[data-rhythm-check]');ok(H.current(p)['checks'][-1]['songBefore']['soundRequested'],'new check snapshots requested teaching');ok(H.current(p)['kept']==visits[before['rhythm']['current']]['kept'],'old kept snapshot unchanged')
   H.bounds(p);p.screenshot(path=str(OUT/f'composer-return-{width}.png'),full_page=True);open_song(p);ready(p);ok(media(p).evaluate('(v)=>v.muted'),'new opening resets mute despite earlier request');p.screenshot(path=str(OUT/f'song-{width}.png'),full_page=True)
   if width==820:
    H.click(p,'[data-song-return]');before_export=H.book(p);exported=H.download(p,base,'song-with-old-and-new-records');ok(exported['rhythm']==before_export['rhythm'] and len(exported['syntheticOther']['payload'])==512000,'real download preserves song/history and512KiB sibling');_,q,_=setup(browser,820,F['partial'],'transfer');original_id=H.active(q);original=H.book(q);H.bring(q,base,exported);ok(H.active(q)!=original_id,'real import adds second explorer');H.go(q,base,'#studio/rhythm');ok(H.book(q)['rhythm']==before_export['rhythm'],'real import preserves media and frozen snapshots');H.reload_studio(q);ok(H.book(q)['rhythm']==before_export['rhythm'],'real reload preserves support');H.click(q,'#explorer-switch');H.click(q,f'[data-select-explorer="{original_id}"]');ok(H.book(q)==original,'original explorer retained beside imported one')
   c.close()
  c,p,_=setup(browser,820,F['partial'],'ordinary-motion',normal=True);open_song(p);ready(p);playing(p);ok(media(p).evaluate('(v)=>v.muted'),'ordinary Open only starts silent picture');c.close()
  c,p,requests=setup(browser,820,F['changed'],'source-mismatch');before=H.book(p);H.click(p,'[data-rhythm-song-open]');ok(not p.locator('[data-rhythm-song]').count() and requests==[],'same-ID different source refuses before all assets');ok(H.book(p)==before,'mismatch retains full old note and healthy work');c.close()
  # A real existing explorer near the UTF8 byte limit. CJK keeps UTF16 localStorage
  # below quota, and avoids migration backups; no saving-off/shrinking workaround.
  c=browser.new_context(viewport={'width':820,'height':1000});H.contexts.append(c);registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-29T12:00:00.000Z'}]}
  c.add_init_script('(seed=>{if(!localStorage.getItem("song-capacity-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(seed.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(seed.book));localStorage.setItem("song-capacity-fixture","1");}})('+json.dumps({'registry':registry,'book':F['capacity']},ensure_ascii=False)+')');p=c.new_page();p.set_default_timeout(15000);requests=[];p.on('request',lambda r:requests.append(r.url) if '/assets/fill-the-bar' in r.url else None);H.go(p,base,'#studio/rhythm');before=H.book(p);H.click(p,'[data-rhythm-song-open]');ok(H.book(p)==before and not p.locator('[data-rhythm-song]').count() and requests==[],'real byte refusal preserves work and reveals/fetches no teaching');ok('could not' in p.locator('#rhythm-status').inner_text(),'byte refusal explained');c.close()
  c,p,_=setup(browser,820,F['partial'],'download-retry');attempts=[]
  def fail_once(route):
   attempts.append(1)
   if len(attempts)==1:route.fulfill(status=503,body='Synthetic unavailable')
   else:route.fulfill(status=200,content_type='application/octet-stream',body=(ROOT/'dist/assets/fill-the-bar.mp4').read_bytes())
  c.route('**/assets/fill-the-bar.mp4',fail_once);open_song(p);p.locator('[data-song-retry]').wait_for(state='visible');ok('could not play' in p.locator('[data-song-status]').inner_text(),'fetch failure preserves clear fallback');ok(p.locator('.song-words p').count()==58,'failed media retains full words');H.click(p,'[data-song-retry]');ready(p);ok(len(attempts)==2 and paused(p),'retry succeeds without automatic sound/picture');c.close()
  c,p,_=setup(browser,820,F['partial'],'missing-captions');c.route('**/assets/fill-the-bar.vtt',lambda route:route.fulfill(status=404,body='Synthetic missing captions'));open_song(p);ready(p);p.wait_for_function('()=>document.querySelector("[data-song-lyric]").textContent.includes("unavailable")');ok(p.locator('.song-words p').count()==58,'failed caption track retains readable words');c.close()
  c,p,_=setup(browser,820,F['partial'],'play-rejection');open_song(p);ready(p);p.evaluate('()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new Error("Synthetic denied"))};}');H.click(p,'[data-song-play]');p.wait_for_function('()=>document.querySelector("[data-song-status]").textContent.includes("could not play")');ok(not H.book(p)['rhythm']['song']['soundRequested'],'play failure does not counterfeit hearing request');c.close()
  c,p,_=setup(browser,820,F['partial'],'late-download',normal=True);held=[];c.route('**/assets/fill-the-bar.mp4',lambda route:held.append(route));open_song(p);p.wait_for_timeout(100);ok(p.locator('[data-song-play]').is_disabled(),'loading controls explicit');p.evaluate('Object.defineProperty(document,"hidden",{configurable:true,value:true});document.dispatchEvent(new Event("visibilitychange"))');held[0].fulfill(status=200,content_type='video/mp4',body=(ROOT/'dist/assets/fill-the-bar.mp4').read_bytes());ready(p);p.evaluate('Object.defineProperty(document,"hidden",{configurable:true,value:false});document.dispatchEvent(new Event("visibilitychange"))');ok(paused(p),'late download cannot resume after hidden return');c.close()
  c,p,_=setup(browser,820,F['partial'],'loading-departure');held=[];c.route('**/assets/fill-the-bar.mp4',lambda route:held.append(route));open_song(p);p.wait_for_timeout(100)
  with p.expect_event('requestfailed',predicate=lambda r:'fill-the-bar.mp4' in r.url) as failed:H.click(p,'[data-song-return]')
  ok('fill-the-bar.mp4' in failed.value.url,'Return aborts pending download')
  try:held[0].abort()
  except Exception:pass
  c.close()
  ok(not H.errors,'no unexpected JavaScript exceptions')
 finally:
  for c in H.contexts:
   try:c.close()
   except Exception:pass
  browser.close()
if server:server.shutdown()
print(json.dumps({'checks':checks,'helperChecks':H.checks,'base':base,'artifacts':str(OUT),'physicalSafari':False,'heardAudio':False}))
