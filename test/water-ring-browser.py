"""Real Chromium ring/movie journey. Invented notebooks only; no production interception.
One tablet journey plus focused narrow/reduced-motion/load-failure/lifecycle cases.
"""
import functools,http.server,threading,subprocess,json,os,tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('WATER_RING_ARTIFACTS',tempfile.mkdtemp(prefix='water-ring-')));OUT.mkdir(parents=True,exist_ok=True)
n=0

def ok(v,msg):
 global n
 assert v,msg
 n+=1

def main():
 fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{weatherFixtures}from './test/weather-tally-checks.mjs';console.log(JSON.stringify(weatherFixtures()));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
   contexts=[]
   def setup(width=820,reduce=True,unsupported=False):
    seed=fixtures['base'].copy();seed['syntheticSibling']={'body':'x'*524288,'value':'keep this invented sibling'}
    if unsupported:seed['weather']={'version':77,'future':[{'invented':True}]}
    c=browser.new_context(viewport={'width':width,'height':1100},has_touch=True,reduced_motion='reduce' if reduce else 'no-preference',accept_downloads=True);contexts.append(c)
    c.add_init_script('(seed=>{if(!localStorage.getItem("ring-fixture")){const explorers=[{id:"explorer-1",avatar:"sky",color:"gold",symbol:"leaf",createdAt:"2026-11-06T12:00:00.000Z"},{id:"explorer-2",avatar:"fern",color:"blue",symbol:"acorn",createdAt:"2026-11-06T12:00:00.000Z"}];localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:"explorer-1",explorers}));for(const x of explorers)localStorage.setItem("number-garden-v1:"+x.id,JSON.stringify(seed));localStorage.setItem("ring-fixture","1");}window.ringWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(...args){ringWrites++;return set.apply(this,args)};window.ringURLs=[];window.ringRevoked=[];const create=URL.createObjectURL,revoke=URL.revokeObjectURL;URL.createObjectURL=b=>{const s=create(b);ringURLs.push(s);return s};URL.revokeObjectURL=s=>{ringRevoked.push(s);return revoke(s)}})('+json.dumps(seed)+')')
    p=c.new_page();p.set_default_timeout(12000);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
    requests=[];p.on('request',lambda r:requests.append(r.url))
    p.goto(base+'#almanac/weather');p.locator('#explorer-header').wait_for()
    if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').click()
    p.locator('[data-water-ring-watch]').wait_for()
    return c,p,errors,requests
   c,p,errors,requests=setup()
   ok(not any('/media/water-ring' in u for u in requests),'weather entry fetches no movie/poster/track')
   if p.locator('[data-wt-change-weather]').count():p.locator('[data-wt-change-weather]').click()
   p.locator('[data-wt-weather=rain]').click()
   month=p.locator('[data-wt-month-details]')
   if month.count():month.locator('summary').click()
   p.locator('drawn-howto .dh-open').click();p.locator('.dh-panel').wait_for()
   p.locator('[data-dh=next]').click();p.locator('[data-dh=next]').click()
   before=p.evaluate('({raw:localStorage.getItem("number-garden-v1:explorer-1"),writes:ringWrites,step:document.querySelector(".dh-count").textContent,month:document.querySelector("[data-wt-month-details]")?.open})')
   p.locator('[data-water-ring-watch]').click();p.locator('[data-water-ring-movie][open]').wait_for();p.wait_for_function('document.querySelector("video").readyState>=2')
   ok(p.locator('video').evaluate('v=>v.paused&&v.muted&&Math.abs(v.duration-37)<.02'),'native silent37s decoding, reduced motion stays paused')
   ok(p.locator('[data-water-ring-transcript] li').count()==14,'complete corrected transcript available')
   p.locator('video').evaluate('v=>v.currentTime=21.5');p.wait_for_function('document.querySelector("[data-water-ring-caption]").textContent==="This cloud is liquid drops, not vapor."')
   p.locator('[data-water-ring-action=play]').click();p.wait_for_function('!document.querySelector("video").paused')
   p.evaluate('document.dispatchEvent(new Event("garden-speech-start"))');p.wait_for_function('document.querySelector("video").paused')
   p.locator('[data-water-ring-action=play]').click();p.wait_for_function('!document.querySelector("video").paused')
   p.locator('[data-water-ring-transcript] summary').click();p.wait_for_function('document.querySelector("video").paused')
   p.screenshot(path=str(OUT/'movie-820.png'),full_page=True)
   p.locator('[data-water-ring-action=retry]').click();p.wait_for_function('document.querySelector("video").readyState>=2')
   ok(p.locator('video').evaluate('v=>v.paused'),'Retry never autoplays')
   p.locator('[data-water-ring-action=return]').click();p.wait_for_selector('[data-water-ring-movie]',state='detached')
   ok(p.locator('[data-wt-weather=rain]').get_attribute('aria-pressed')=='true','unsaved weather choice remains')
   ok(p.locator('.dh-count').inner_text()==before['step'],'open ring step remains')
   ok(p.evaluate('document.querySelector("[data-wt-month-details]")?.open')==before['month'],'calendar disclosure remains')
   ok(p.evaluate('document.activeElement.hasAttribute("data-water-ring-watch")'),'Return restores Watch focus')
   p.locator('[data-water-ring-watch]').click();p.wait_for_function('document.querySelector("video").readyState>=2');p.keyboard.press('Escape');p.wait_for_selector('[data-water-ring-movie]',state='detached')
   ok(p.evaluate('document.activeElement.hasAttribute("data-water-ring-watch")'),'native Escape restores Watch focus')
   ok(p.evaluate('localStorage.getItem("number-garden-v1:explorer-1")')==before['raw'] and p.evaluate('ringWrites')==before['writes'],'complete notebook and zero storage writes through ring/movie actions')
   ok(p.evaluate('ringURLs.length===ringRevoked.length&&new Set(ringRevoked).size===ringRevoked.length'),'Retry/Return/Escape revoke every Blob once')
   # Finish the ring, without replaying the full movie journey at each width.
   for _ in range(3):p.locator('[data-dh=next]').click()
   p.locator('.dh-all').wait_for(state='visible');p.screenshot(path=str(OUT/'ring-820.png'),full_page=True)
   ok(p.locator('.dh-picture').get_attribute('role')=='img','ring has whole-picture accessible description')
   p.locator('[data-dh=again]').click();ok('Step 1' in p.locator('.dh-count').inner_text(),'Watch again resets only drawing')
   p.locator('[data-dh=close]').click();ok(p.evaluate('document.activeElement.classList.contains("dh-open")'),'drawing Close returns focus')
   # Real parent weather save still works after movie teardown.
   p.locator('[data-wt-save-weather]').click();ok(p.locator('.wt-kept-weather').count()==1,'weather save works after both explanations')
   # Notes downloads carry the same weather and large unknown sibling.
   saved=json.loads(p.evaluate('localStorage.getItem("number-garden-v1:explorer-1")'))
   p.goto(base+'#notes');p.locator('#download').wait_for()
   with p.expect_download() as d:p.locator('#download').click()
   target=OUT/'notes.json';d.value.save_as(target);report=json.loads(target.read_text())
   ok(report['weather']==saved['weather'] and report['syntheticSibling']==saved['syntheticSibling'],'real Notes download preserves weather and large sibling')
   ok(not errors,'no tablet runtime errors: '+str(errors))
   # Narrow layout and unsupported weather remain open, no duplicated full journey.
   c2,q,err,_=setup(320,unsupported=True);q.locator('.dh-open').click();q.locator('.dh-panel').wait_for()
   for _ in range(5):q.locator('[data-dh=next]').click()
   q.locator('.dh-all').wait_for(state='visible');q.screenshot(path=str(OUT/'ring-320.png'),full_page=True)
   ok(q.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'narrow drawing has no horizontal overflow')
   q.locator('[data-water-ring-watch]').click();q.wait_for_function('document.querySelector("video").readyState>=2')
   ok(q.locator('[data-water-ring-action]').evaluate_all('xs=>xs.every(x=>{const b=x.getBoundingClientRect();return b.width>=44&&b.height>=44})'),'movie touch controls44px')
   q.screenshot(path=str(OUT/'movie-320.png'),full_page=True)
   q.evaluate('window.oldRingVideo=document.querySelector("video");location.hash="#home"');q.locator('.wt-ring-movie').wait_for(state='detached')
   ok(q.evaluate('oldRingVideo.paused&&!oldRingVideo.hasAttribute("src")&&ringURLs.length===ringRevoked.length'),'route change disposes media completely')
   ok(not err,'no narrow runtime errors')
   # Loading race and network failure are explicit faults, not the main journey.
   c3,r,err,_=setup(820,False)
   pending=[]
   r.route('**/drawn-howtos/water-ring.mjs',lambda route:pending.append(route))
   r.locator('.dh-open').click()
   r.wait_for_selector('.dh-open[aria-busy]')
   r.locator('[data-water-ring-watch]').click();ok(not r.locator('dialog[open]').count(),'busy drawing cannot open hidden movie race')
   ok('drawing is loading' in r.locator('[data-water-ring-status]').inner_text(),'busy-drawing refusal is explained')
   ok(bool(pending),'actual generated-art request is held in flight')
   pending[0].abort();r.wait_for_selector('.dh-open:not([aria-busy])')
   r.route('**/media/water-ring.mp4',lambda route:route.fulfill(status=503,body='unavailable'))
   r.locator('[data-water-ring-watch]').click();r.wait_for_function('document.querySelector("[data-water-ring-load-status]").textContent.includes("did not load")')
   r.locator('[data-water-ring-transcript] summary').click();ok(r.locator('[data-water-ring-transcript] li').count()==14,'failed movie keeps all words and Return')
   r.keyboard.press('Escape');r.wait_for_selector('dialog[open]',state='detached')
   r.unroute('**/media/water-ring.mp4');r.locator('[data-water-ring-watch]').click();r.wait_for_function('document.querySelector("video").readyState>=2&&!document.querySelector("video").paused')
   ok(True,'ordinary Watch autoplays actual decoded video')
   r.evaluate('window.dispatchEvent(new Event("pagehide"))');r.wait_for_function('document.querySelector("video").paused')
   r.evaluate('const p=document.querySelector("[data-water-ring-action=play]"),host=p.parentNode;p.remove();host.append(p);p.click()')
   ok(r.locator('video').evaluate('v=>v.paused'),'removed and reinserted Play control stays inert')
   r.keyboard.press('Escape');r.wait_for_selector('dialog[open]',state='detached')
   r.evaluate('window.oldWatch=document.querySelector("[data-water-ring-watch]")')
   r.locator('#explorer-switch').click();r.locator('[data-select-explorer="explorer-2"]').click();r.locator('[data-water-ring-watch]').wait_for()
   r.evaluate('oldWatch.click()');ok(not r.locator('dialog[open]').count(),'old owner Watch cannot open a new owner movie')
   ok(not err,'no fault/retry/lifecycle runtime errors: '+str(err))
   for context in contexts:context.close()
   browser.close()
 finally:server.shutdown()
 print(f'Water ring native journey: {n} checks passed; artifacts {OUT}')

if __name__=='__main__':main()
