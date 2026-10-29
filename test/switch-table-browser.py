"""Synthetic302 journeys with real native Chrome controls/decoding.
Optional SWITCH_TABLE_TEST_URL targets deployed bytes after verification.
Fault cases are separate from the normal movie journey. No app-module interception.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('SWITCH_TABLE_ARTIFACTS',tempfile.mkdtemp(prefix='switch-table-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def click(p,a):p.locator(f'[data-switch-action="{a}"]').click()
def ready(p,owner='explorer-1'):
 p.wait_for_selector('[data-switch-root],[data-select-explorer]')
 if p.locator(f'[data-select-explorer="{owner}"]').count():p.locator(f'[data-select-explorer="{owner}"]').click()
 p.locator('[data-switch-root]').wait_for();p.wait_for_function("getComputedStyle(document.querySelector('[data-switch-action]')).minHeight==='44px'")
def setup(b,base,seed,width,reduce=True):
 c=b.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce' if reduce else 'no-preference')
 c.add_init_script('''(seed=>{if(!localStorage.getItem('switch-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:'explorer-1',explorers:[{id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-29T12:00:00.000Z'},{id:'explorer-2',avatar:'fern',color:'blue',symbol:'acorn',createdAt:'2026-10-29T12:00:00.000Z'}]}));for(const id of ['explorer-1','explorer-2'])localStorage.setItem('number-garden-v1:'+id,JSON.stringify(seed));localStorage.setItem('switch-fixture','1');}window.switchWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1'))window.switchWrites++;return set.call(this,k,v);};window.switchCreated=[];window.switchRevoked=[];const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=x=>{const u=create(x);switchCreated.push(u);return u;};URL.revokeObjectURL=u=>{switchRevoked.push(u);revoke(u);};})('''+json.dumps(seed)+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));requests=[];p.on('request',lambda r:requests.append(r.url));p.goto(base+'#workshop/switch-table',wait_until='networkidle');ready(p);return c,p,requests
def pose(p):return [p.locator('[data-switch-layout]').input_value(),p.locator('[data-switch-action=a]').get_attribute('aria-pressed'),p.locator('[data-switch-action=b]').get_attribute('aria-pressed') if p.locator('[data-switch-action=b]').count() else None,p.locator('[data-switch-action=symbols]').get_attribute('aria-pressed'),p.locator('[data-switch-action=trace]').get_attribute('aria-pressed')]
def configure(p,layout,a,b,view):
 p.locator('[data-switch-layout]').select_option(layout)
 for id,value in [('a',a),('b',b)]:
  x=p.locator(f'[data-switch-action={id}]')
  if x.count() and (x.get_attribute('aria-pressed')=='true')!=value:click(p,id)
 click(p,view)
def inspect(p,layout,a,b,trace):
 expected=a and (layout!='two' or b)
 data=p.locator('[data-switch-drawing]').evaluate('''svg=>({title:svg.querySelector('title').textContent,edges:[...svg.querySelectorAll('[data-switch-edge]')].map(e=>({id:e.dataset.switchEdge,from:e.dataset.from,to:e.dataset.to,kind:e.dataset.kind,active:e.dataset.connected==='true',trace:e.classList.contains('st-complete'),wire:e.tagName==='path'?e.getAttribute('d'):null})),contacts:[...svg.querySelectorAll('[data-switch-contact]')].map(g=>{const first=g.querySelector('[data-contact-end=first]'),last=g.querySelector('[data-contact-end=second]'),blade=g.querySelector('[data-switch-blade]');return {id:g.dataset.switchContact,from:[+first.getAttribute('cx'),+first.getAttribute('cy')],to:[+last.getAttribute('cx'),+last.getAttribute('cy')],tip:[blade.getPointAtLength(blade.getTotalLength()).x,blade.getPointAtLength(blade.getTotalLength()).y],gap:!!g.querySelector('[data-switch-gap]')};}),glow:!!svg.querySelector('[data-switch-glow]')})''')
 edges=data['edges'];seen={'P'};changed=True
 while changed:
  changed=False
  for e in edges:
   if e['kind']=='cell' or not e['active']:continue
   for x,y in [(e['from'],e['to']),(e['to'],e['from'])]:
    if x in seen and y not in seen:seen.add(y);changed=True
 ok(('N' in seen)==expected,'rendered edge graph has expected continuity');ok(data['glow']==expected,'actual glow exactly follows complete path');ok(p.locator('[data-switch-result]').inner_text()==('Model bulb on: complete path' if expected else 'Model bulb off: open path'),'visible result exact');ok(len(data['contacts'])==(2 if layout=='two' else 1),'actual number of contact pairs')
 for g in data['contacts']:
  closed=a if g['id']=='A' else b;dist=((g['to'][0]-g['tip'][0])**2+(g['to'][1]-g['tip'][1])**2)**.5
  ok((dist<.01) if closed else (dist>20),'actual blade meets second contact only when closed');ok(g['gap']==(trace and not closed),'every actual open gap highlighted only when requested')
  want=([420,175],[420,125]) if g['id']=='B' or layout=='lamp' else ([110,260],[160,260]) if layout=='cell' else ([60,125],[60,175]);ok(g['from']==want[0] and g['to']==want[1],'actual switch contacts at chosen position')
 ok(all(e['trace']==(trace and expected) for e in edges),'whole cycle highlighted together; no partial current path');ok(('on.' in data['title'])==expected,'SVG alternative names lamp state')
 if p.locator('[data-switch-connections]').is_visible():ok(p.locator('[data-switch-connections] tbody tr').count()==len(edges),'equivalent table uses same component edges')
def movie_ready(p):p.wait_for_function("document.querySelector('video')?.readyState>=2");p.wait_for_function("!document.querySelector('[data-switch-action=play]').disabled")
def journey(b,base,seed,width):
 c,p,requests=setup(b,base,seed,width)
 try:
  raw=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')");writes=p.evaluate('switchWrites');ok(json.loads(raw)['lanternCircuits']==seed['lanternCircuits'] and json.loads(raw)['science']==seed['science'],'unsupported saved owners retained');ok(not any('.mp4' in x or '.vtt' in x for x in requests),'no movie fetch on entry');ok(not p.locator('video').count(),'no hidden movie player on model page');ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no horizontal overflow')
  if width==820:
   box=p.locator('[data-switch-action=a]').bounding_box();ok(box['y']+box['height']<=1000,'primary switch visible beside picture on tablet')
  ok(all(h>=44 for h in p.locator('[data-switch-action]').evaluate_all('xs=>xs.map(x=>x.getBoundingClientRect().height)')),'all model touch targets44px');p.locator('[data-switch-details=connections] summary').click()
  for layout in ['lamp','cell','left','two']:
   for a,bv in [(False,False),(False,True),(True,False),(True,True)]:
    for view in ['sketch','symbols']:
     configure(p,layout,a,bv,view)
     for tr in [False,True]:
      if (p.locator('[data-switch-action=trace]').get_attribute('aria-pressed')=='true')!=tr:click(p,'trace')
      inspect(p,layout,a,bv,tr)
  configure(p,'two',True,False,'symbols');before=pose(p);p.screenshot(path=str(OUT/f'model-{width}.png'),full_page=True);click(p,'watch');movie_ready(p);v=p.locator('video');ok(v.evaluate("x=>x.paused&&x.muted&&x.src.startsWith('blob:')&&x.videoWidth===1280&&Math.abs(x.duration-19.6)<.05"),'real decoded local Blob, reduced-motion no autoplay, silent19.6s');ok(p.locator('[data-switch-transcript] li').count()==4,'full four-caption transcript available');ok(not p.locator('[data-switch-action=sound]').count(),'silent film has no sound control');click(p,'play');p.wait_for_function("document.querySelector('video').currentTime>.2");click(p,'play');ok(v.evaluate('x=>x.paused'),'real play/pause controls');v.evaluate('x=>x.currentTime=7');p.wait_for_function("Math.abs(document.querySelector('video').currentTime-7)<.2&&!document.querySelector('video').seeking&&document.querySelector('[data-switch-caption]').textContent.includes('Closed:')");ok('Closed:' in p.locator('[data-switch-caption]').inner_text(),'stable external caption after real seek');click(p,'play');p.evaluate("document.dispatchEvent(new Event('garden-speak-request'))");p.wait_for_function("document.querySelector('video').paused");ok(True,'common narration path pauses native film');click(p,'replay');p.wait_for_function("document.querySelector('video').currentTime<1&&!document.querySelector('video').paused");p.locator('[data-switch-transcript] summary').click();p.wait_for_function("document.querySelector('video').paused");ok(True,'transcript opening pauses film');p.screenshot(path=str(OUT/f'film-{width}.png'),full_page=True);p.keyboard.press('Escape');ok(pose(p)==before,'Escape restores exact model settings');ok(p.locator('[data-switch-action=watch]').evaluate('x=>x===document.activeElement'),'Return focus to invitation');ok(p.evaluate('switchCreated.length===switchRevoked.length'),'source revoked after Return');ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==raw and p.evaluate('switchWrites')==writes,'model and movie do not write notebook or large siblings')
  p.locator('[data-switch-action=a]').focus();p.keyboard.press('Enter');ok(p.locator('[data-switch-action=a]').get_attribute('aria-pressed')=='false','keyboard same switch operation');p.evaluate('window.oldSwitch=document.querySelector("[data-switch-action=a]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p,'explorer-2');p.evaluate('oldSwitch.click()');ok(pose(p)[0]=='lamp' and pose(p)[1]=='false','detached old controls cannot affect replacement explorer');p.reload(wait_until='networkidle');ready(p,'explorer-2');ok(pose(p)[0]=='lamp' and json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-2')"))['science']==seed['science'],'directreload stays local and preserves malformed owner')
 finally:c.close()
def faults(b,base,seed):
 c,p,_=setup(b,base,seed,820)
 try:
  p.route('**/assets/switch-excerpt.mp4',lambda r:r.fulfill(status=503,body='Synthetic failure'));click(p,'watch');p.wait_for_function("document.querySelector('[data-switch-load-status]').textContent.includes('could not play')");ok(p.locator('[data-switch-transcript] li').count()==4,'failed fetch retains transcript and Return');p.unroute('**/assets/switch-excerpt.mp4');click(p,'retry');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'explicit retry does not autoplay');click(p,'return');ok(p.evaluate('switchCreated.length===switchRevoked.length'),'retry source revoked exactly once');
  pending=[];p.route('**/assets/switch-excerpt.mp4',lambda route:pending.append(route));click(p,'watch');p.wait_for_timeout(150);ok(bool(pending),'fault-case download genuinely pending');p.evaluate("location.hash='#workshop/switch-table-away'");p.wait_for_timeout(150)
  for r in pending:
   try:r.continue_()
   except Exception:pass
  p.wait_for_timeout(200);ok(not p.locator('video').count(),'departure prevents late movie attachment');p.unroute('**/assets/switch-excerpt.mp4')
 finally:c.close()
def asynchronous(b,base,seed):
 c,p,requests=setup(b,base,seed,820,False)
 try:
  p.evaluate('window.oldWatch=document.querySelector("[data-switch-action=watch]")');click(p,'watch');movie_ready(p);p.wait_for_function("document.querySelector('video').currentTime>.2&&!document.querySelector('video').paused");ok(True,'explicit non-reduced Watch starts real muted playback');count=sum('.mp4' in x for x in requests);p.evaluate('oldWatch.click()');ok(sum('.mp4' in x for x in requests)==count,'detached duplicate Watch cannot fetch again');p.evaluate("window.switchHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>switchHidden});document.dispatchEvent(new Event('visibilitychange'))");p.wait_for_function("document.querySelector('video').paused");p.evaluate("switchHidden=false;document.dispatchEvent(new Event('visibilitychange'))");ok(p.locator('video').evaluate('x=>x.paused'),'synthetic hidden/visible cycle does not resume');click(p,'return')
  held=[];p.route('**/assets/switch-excerpt.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);click(p,'retry');p.wait_for_timeout(100);ok(len(held)==2,'two distinct fault-case requests genuinely pending');data=(ROOT/'dist/assets/switch-excerpt.mp4').read_bytes();held[1].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p)
  try:held[0].fulfill(status=200,body=data,content_type='video/mp4')
  except Exception:pass
  p.wait_for_timeout(100);ok(p.evaluate('switchCreated.length===2'),'aborted older fetch creates no extra Blob');ok(p.locator('video').evaluate('x=>x.paused'),'retry winner remains paused');p.unroute('**/assets/switch-excerpt.mp4')
  p.evaluate("window.originalSwitchPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const media=this;return new Promise((resolve,reject)=>{window.releaseSwitchPlay=()=>originalSwitchPlay.call(media).then(resolve,reject);});};void 0");click(p,'play');p.evaluate("window.dispatchEvent(new Event('pagehide'));releaseSwitchPlay()");p.wait_for_timeout(200);ok(p.locator('video').evaluate('x=>x.paused'),'late programmatic play cannot undo pagehide pause');p.evaluate('HTMLMediaElement.prototype.play=originalSwitchPlay;void 0');click(p,'return');ok(p.evaluate('switchCreated.length===switchRevoked.length&&new Set(switchRevoked).size===switchRevoked.length'),'each created source revoked exactly once across retry/return')
  held=[];p.route('**/assets/switch-excerpt.mp4',lambda r:held.append(r));click(p,'watch');p.wait_for_timeout(100);ok(len(held)==1,'visibility fault holds a real pending fetch');p.evaluate("switchHidden=true;document.dispatchEvent(new Event('visibilitychange'));switchHidden=false;document.dispatchEvent(new Event('visibilitychange'))");held[0].fulfill(status=200,body=data,content_type='video/mp4');movie_ready(p);ok(p.locator('video').evaluate('x=>x.paused'),'download finishing after hidden/visible cannot autoplay');p.unroute('**/assets/switch-excerpt.mp4');p.evaluate('window.oldMoviePlay=document.querySelector("[data-switch-action=play]")');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p,'explorer-2');p.evaluate('oldMoviePlay.click()');ok(not p.locator('video').count(),'old movie controls cannot open playback for replacement explorer');ok(p.evaluate('switchCreated.length===switchRevoked.length'),'explorer replacement disposes active source')
 finally:c.close()
def transfer_and_entry(b,base):
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {startCircuit,setCircuitPage,setCircuitLink,keepCircuit} from './dist/lantern-circuit-core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};startCircuit(s,'open-table');setCircuitPage(s,'connect');setCircuitLink(s,'ps',true);setCircuitLink(s,'nt',true);keepCircuit(s);s.lanternCircuits.cases['open-table'].source.title='An earlier synthetic lantern';s.syntheticOther={payload:'x'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 c,p,_=setup(b,base,seed,820)
 try:
  before=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"))['lanternCircuits'];p.evaluate("location.hash='#workshop/lantern'");p.locator('[data-lc-root]').wait_for();p.locator('a[href="#workshop/switch-table"]').click();ready(p);configure(p,'two',True,True,'symbols');click(p,'watch');movie_ready(p);click(p,'return');p.locator('.st-room header a').click();p.locator('[data-lc-root]').wait_for();after=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')"))['lanternCircuits'];ok(after==before,'healthy historical source/current/kept arrangement unchanged through real entry and return');ok(p.locator('[data-lc-page=connect]').get_attribute('aria-current')=='page','original Connect page restored')
  p.locator('a[href="#workshop/switch-table"]').click();ready(p);p.evaluate('window.beforeSwitchImport=document.querySelector("[data-switch-action=a]");location.hash="#notes"');p.locator('#download').wait_for()
  with p.expect_download() as info:p.locator('#download').click()
  file=OUT/'synthetic-switch-notes.json';info.value.save_as(str(file));report=json.loads(file.read_text());ok(report['lanternCircuits']==before and report['syntheticOther']==seed['syntheticOther'],'actual Notes download retains historical Lantern and large unrelated data');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId!=='explorer-1'");owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.evaluate("location.hash='#workshop/switch-table'");ready(p,owner);p.evaluate('beforeSwitchImport.click()');ok(pose(p)[0]=='lamp' and pose(p)[1]=='false','actual notebook import invalidates old model and starts local visit');imported=json.loads(p.evaluate("id=>localStorage.getItem('number-garden-v1:'+id)",owner));ok(imported['lanternCircuits']==before and imported['syntheticOther']==seed['syntheticOther'],'imported explorer retains historical own-source Lantern and large sibling')
 finally:c.close()
def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.lanternCircuits={version:99,future:'retained'};s.science={version:99,visits:'retained'};s.syntheticOther={payload:'z'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('SWITCH_TABLE_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
  try:
   for width in [320,820,1024]:journey(b,base,seed,width)
   faults(b,base,seed);asynchronous(b,base,seed);transfer_and_entry(b,base);ok(not errors,'no page errors '+str(errors));r={'status':'passed','checks':checks,'base':base,'limits':'nativeChrome and labelled network faults; not physicaliPad/Safari, screen-reader speech or learning effects'};(OUT/'receipt.json').write_text(json.dumps(r,indent=2));print(json.dumps(r))
  finally:b.close();server.shutdown()
if __name__=='__main__':main()
