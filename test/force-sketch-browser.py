"""Force Sketch423 through the actual app, fictional notebooks only.
One tablet journey and focused phone/desktop, lifecycle and recovery probes.
Chromium emulation does not qualify physical Safari, audible speech or learning.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, json, os, subprocess, tempfile, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('FORCE_SKETCH_ARTIFACTS') or tempfile.mkdtemp(prefix='force-sketch-'))
OUT.mkdir(parents=True, exist_ok=True)
checks = 0
errors = []

def ok(value, message):
 global checks
 assert value, message
 checks += 1

def fixture(extra=''):
 code = "import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';let s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticSibling={literal:'invented only',future:{version:99,rows:[1,2,3]}};" + extra + ";console.log(JSON.stringify(s));"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code], cwd=ROOT, text=True))

def setup(browser, base, width=820, height=1000, extra=''):
 c = browser.new_context(viewport={'width':width,'height':height}, has_touch=True, reduced_motion='reduce', accept_downloads=True)
 registry = {'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-07T12:00:00Z'},{'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-11-07T12:00:00Z'}]}
 c.add_init_script("""(d=>{if(!localStorage.getItem('force-sketch-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem('number-garden-v1:'+e.id,JSON.stringify(d.seed));localStorage.setItem('force-sketch-fixture','1');}window.fsSpeech={speak:0,cancel:0};window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};const s=window.speechSynthesis;if(s){s.getVoices=()=>[{name:'Synthetic English',lang:'en-US',localService:true,voiceURI:'synthetic'}];s.speak=()=>fsSpeech.speak++;s.cancel=()=>fsSpeech.cancel++;}})(""" + json.dumps({'registry':registry,'seed':fixture(extra)}) + ')')
 def app(route):
  r = route.fetch(); body = r.text()
  assert 'let graph=null,' in body
  route.fulfill(response=r, body=body.replace('let graph=null,','window.__forceBook=()=>structuredClone(state);let graph=null,',1))
 c.route('**/app.mjs', app)
 p = c.new_page(); p.set_default_timeout(15000)
 p.on('pageerror', lambda e:errors.append(str(e)))
 p.on('console', lambda m:errors.append(m.text) if m.type=='error' else None)
 p.on('response', lambda r:errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None)
 p.goto(base+'#learn/science', wait_until='networkidle'); ready(p)
 start=p.locator('[data-motion-start="design"]')
 if start.count():
  start.click();p.locator('[data-motion-field="explanation"]').fill('A fictional waiting explanation.')
  ok(book(p)['motionEvidence']['lessons']['design']['drafts']['explanation']=='A fictional waiting explanation.','real parent UI created the retained draft')
 return c,p

def ready(p):
 p.locator('[data-fs-entry],[data-fs-root],[data-select-explorer="explorer-1"],[data-select-explorer="explorer-2"]').first.wait_for()
 for owner in ['explorer-1','explorer-2']:
  q=p.locator('[data-select-explorer="'+owner+'"]')
  if q.count() and q.is_visible():q.click();break
 p.locator('[data-fs-entry],[data-fs-root]').first.wait_for()

def sel(name, value=None):
 return '[data-fs-'+name+('="'+str(value)+'"' if value is not None else '')+']'

def click(p,name,value=None):
 q=p.locator(sel(name,value))
 (q.first if name=='page' else q).click()
def choose(p,name,value):p.locator(sel(name)).select_option(str(value))
def rowcount(p):return p.locator(sel('row')).count()
def book(p):return p.evaluate('window.__forceBook()')
def stores(p):return p.evaluate('JSON.stringify({local:Object.entries(localStorage).sort(),session:Object.entries(sessionStorage).sort()})')
def snapshot(p):return {'book':book(p),'stores':stores(p)}
def enter(p):
 if not p.locator(sel('root')).count():click(p,'entry')
 p.locator(sel('root')).wait_for()
def draw(p,force,direction,amount):
 choose(p,'tool-force',force);choose(p,'tool-direction',direction);choose(p,'tool-amount',amount);click(p,'add')
def export(p,label):
 p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
 with p.expect_download() as d:p.locator('#download').click()
 target=OUT/(label+'.json');d.value.save_as(str(target));return json.loads(target.read_text())
def back_science(p):p.evaluate('location.hash="#learn/science"');ready(p)
def dispatch(handle):handle.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no viewport overflow')
 bad=p.locator('[data-fs-root] button,[data-fs-root] select,[data-fs-root] a,[data-fs-root] summary').evaluate_all("xs=>xs.filter(e=>e.getClientRects().length&&!e.closest('.speech-controls')&&(e.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({t:e.textContent,h:e.getBoundingClientRect().height,font:getComputedStyle(e).fontSize}))")
 ok(not bad,'native44px targets and16px text: '+str(bad))

def journey(browser,base):
 print('Force Sketch: actual model construction, comparison, transfer and Notes preservation',flush=True)
 c,p=setup(browser,base)
 try:
  original=book(p);field=p.locator('[data-motion-field="explanation"]')
  # Synthetic overlength DOM input exercises the real parent's refusal path.
  field.evaluate("e=>{e.value='x'.repeat(1201);e.dispatchEvent(new Event('input',{bubbles:true}));}");click(p,'entry')
  ok(not p.locator(sel('root')).count() and len(field.input_value())==1201 and book(p)==original,'entry refusal keeps unsaved parent words and saved notebook exact')
  field.fill('A fictional waiting explanation.');initial_notes=export(p,'before-force');back_science(p);before=snapshot(p)
  parent=p.locator('[data-motion-root]').element_handle();old_push=p.locator('[data-motion-push-drift]').element_handle()
  enter(p);ok(rowcount(p)==0,'opening starts with no proposed arrows');layout(p)
  p.locator('[data-fs-clues]>summary').click();ok(p.locator('[data-fs-clues]').get_attribute('open') is not None,'clues stay one tap away')
  choose(p,'tool-direction','down');ok(p.locator('[data-fs-clues]').get_attribute('open') is not None,'clue drawer stays open after edits')
  p.locator('[data-fs-clues]>summary').click()
  p.evaluate('(e)=>document.querySelector("main").append(e)',parent)
  speech=p.evaluate('JSON.stringify(fsSpeech)');dispatch(old_push)
  ok(p.locator(sel('root')).count()==1 and p.evaluate('JSON.stringify(fsSpeech)')==speech,'retained parent Push entry is inert and silent while Force active')
  parent.evaluate('e=>e.remove()')
  draw(p,'table-partner','up',2);click(p,'page','compare');click(p,'compare')
  ok('table' in p.locator(sel('root')).inner_text().lower(),'comparison explains wrong receiver');click(p,'page','build')
  click(p,'edit',0);choose(p,'tool-force','weight');choose(p,'tool-direction','down');choose(p,'tool-amount',6)
  ok(p.locator(sel('add')).is_disabled(),'Add cannot silently replace during edit')
  click(p,'cancel-edit');ok('table' in p.locator(sel('row',0)).inner_text().lower(),'cancel leaves original arrow')
  click(p,'edit',0);choose(p,'tool-force','weight');choose(p,'tool-direction','down');choose(p,'tool-amount',6);click(p,'replace')
  draw(p,'support','up',6);ok(rowcount(p)==2,'replacement plus independent second force');click(p,'select',0);click(p,'remove',0);ok(rowcount(p)==1,'remove preserves other arrow');draw(p,'weight','down',6)
  click(p,'page','compare');click(p,'compare');click(p,'reference');layout(p)
  click(p,'pair-toggle');click(p,'pair-show');ok('not complete' in p.locator(sel('root')).inner_text(),'pair view honestly partial')
  choose(p,'pair-force','weight');click(p,'pair-show');ok('Earth' in p.locator(sel('root')).inner_text(),'gravity partner names different receiver')
  click(p,'page','motion');p.locator(sel('prediction','right')).check();click(p,'check');click(p,'motion')
  ok(p.locator(sel('prediction','right')).is_checked(),'wrong prediction survives model reveal')
  choose(p,'scene','glider');ok(rowcount(p)==0,'new scene starts separate work');draw(p,'released-push','right',4)
  click(p,'page','compare');click(p,'compare');ok('let go' in p.locator(sel('root')).inner_text().lower(),'released push has no current interaction')
  click(p,'page','motion');p.locator(sel('prediction','same')).check();click(p,'check');ok('same' in p.locator(sel('root')).inner_text().lower(),'balanced moving glider stays moving')
  choose(p,'scene','tray');draw(p,'weight','down',6);draw(p,'support','up',6);draw(p,'rope','right',4);draw(p,'friction','left',2)
  click(p,'page','compare');click(p,'compare');click(p,'reference');layout(p);p.screenshot(path=str(OUT/'tray-820.png'),full_page=True)
  click(p,'page','motion');p.locator(sel('prediction','right')).check();click(p,'check');ok(p.locator(sel('prediction','right')).is_checked(),'tray direction response stays selected')
  click(p,'teaching');click(p,'teach-step',1);click(p,'teach-step',1);ok('4 N' in p.locator(sel('root')).inner_text(),'separate4N worked example');click(p,'teach-close');ok(p.locator(sel('prediction','right')).is_checked(),'teaching returns exact page and response')
  choose(p,'scene','magnets');draw(p,'a-weight','down',6);draw(p,'a-support','up',6);draw(p,'b-on-a','left',4)
  click(p,'page','motion');p.locator(sel('prediction','left')).check();click(p,'check')
  choose(p,'body','b');ok(rowcount(p)==0,'second receiver starts independent diagram');draw(p,'b-weight','down',6);draw(p,'b-support','up',6);draw(p,'a-on-b','right',4)
  choose(p,'body','a');ok(rowcount(p)==3,'switching receiver retains its original arrows');choose(p,'scene','parcel');ok(rowcount(p)==2,'earlier scene draft remains')
  p.once('dialog',lambda d:d.dismiss());click(p,'reset');ok(rowcount(p)==2,'reset Cancel preserves arrows')
  p.once('dialog',lambda d:d.accept());click(p,'reset');ok(rowcount(p)==0,'confirmed reset clears only selected body')
  choose(p,'scene','tray');ok(rowcount(p)==4,'reset never clears another scene')
  click(p,'read');ok(p.evaluate('fsSpeech.speak')>0,'current Hear reaches existing app speech')
  old=p.locator(sel('read')).element_handle();click(p,'page','motion');voice=p.evaluate('JSON.stringify(fsSpeech)');dispatch(old);ok(p.evaluate('JSON.stringify(fsSpeech)')==voice,'rerendered stale Hear neither starts nor stops speech')
  ok(snapshot(p)==before,'Force leaves actual memory notebook and both storages exact')
  click(p,'back');ok(book(p)==original,'parent waiting source/draft retained');enter(p);choose(p,'scene','tray');ok(rowcount(p)==4,'same loaded notebook reopens temporary work')
  final_notes=export(p,'after-force');ok({k:v for k,v in final_notes.items() if k!='exportedAt'}=={k:v for k,v in initial_notes.items() if k!='exportedAt'},'real downloaded Notes unchanged apart from export timestamp')
  back_science(p);enter(p);choose(p,'scene','tray');ok(rowcount(p)==4,'route return retains current session work')
  p.reload(wait_until='networkidle');ready(p);enter(p);choose(p,'scene','tray');ok(rowcount(p)==0,'reload starts temporary sketches fresh')
 finally:c.close()

def responsive_and_stale(browser,base):
 print('Force Sketch: native geometry and stale-control retirement',flush=True)
 for width,height in [(320,700),(1024,768)]:
  c,p=setup(browser,base,width,height)
  try:
   enter(p);choose(p,'scene','magnets')
   for f in ['a-weight','a-support','b-on-a','b-weight','b-support','a-on-b']:draw(p,f,'up',6)
   layout(p);ok(rowcount(p)==6,'six parallel proposals retained')
   paths=p.locator('[data-fs-arrow]>path:first-child').evaluate_all('xs=>xs.map(e=>e.getAttribute("d"))')
   ok(paths==[f'M{x} 170L{x} 50' for x in [255,281,307,333,359,385]],'six independent up-arrow tracks attach to the symbol and remain in bounds')
   ok(p.locator('[data-fs-root] svg text').count()==0,'all diagram labels remain native text rather than scaled SVG lettering')
   p.screenshot(path=str(OUT/f'six-arrows-{width}.png'),full_page=True)
   handle=p.locator(sel('remove',0)).element_handle()
   handle.evaluate('e=>{window.fsRemoved={p:e.parentNode,n:e.nextSibling};e.remove();fsRemoved.p.insertBefore(e,fsRemoved.n)}');dispatch(handle);ok(rowcount(p)==6,'detached/reinserted arrow control stays retired')
   current=p.locator(sel('edit',1)).element_handle();current.evaluate('e=>{e.hidden=true;e.hidden=false}');dispatch(current);ok(p.locator(sel('replace')).count()==0 or not p.locator(sel('replace')).is_visible(),'hide/unhide control stays retired')
   click(p,'page','compare');click(p,'compare');click(p,'reference');click(p,'pair-toggle');click(p,'pair-show');layout(p);p.screenshot(path=str(OUT/f'pair-{width}.png'),full_page=True)
   click(p,'page','build');choose(p,'body','b');ok(rowcount(p)==0,'phone receiver switches open');p.locator(sel('add')).focus();p.keyboard.press('Enter');ok(rowcount(p)==1,'keyboard construction works')
   old=p.locator(sel('add')).element_handle();p.evaluate('location.hash="#learn/science/balanced"');p.wait_for_timeout(100);dispatch(old);ok(book(p)['motionEvidence']['currentId']=='design','different science route cannot edit parent waiting lesson')
  finally:c.close()

def recovery(browser,base):
 print('Force Sketch: saving off, opaque parent, explorer isolation and import/reset',flush=True)
 c,p=setup(browser,base,extra="s.motionEvidence={version:987,future:{raw:'preserve'}}")
 try:
  oldbook=book(p);enter(p);draw(p,'weight','down',6);click(p,'back');ok(book(p)==oldbook,'unknown parent format stays exact and Force remains open')
 finally:c.close()
 c,p=setup(browser,base)
 try:
  enter(p);draw(p,'weight','down',6);old=p.locator(sel('add')).element_handle()
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p);enter(p);ok(rowcount(p)==0,'second explorer has independent temporary sketch');dispatch(old);ok(rowcount(p)==0,'old owner control cannot affect new owner')
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();back_science(p);before=snapshot(p);enter(p);draw(p,'support','up',6);ok(snapshot(p)==before,'saving-off work changes no actual notebook or storage')
  held=p.locator(sel('add')).element_handle();p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click()
  if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').click()
  back_science(p);enter(p);ok(rowcount(p)==0,'actual reset replaces temporary notebook identity');dispatch(held);ok(rowcount(p)==0,'pre-reset control cannot resurrect sketch')
 finally:c.close()
 c,p=setup(browser,base)
 try:
  enter(p);draw(p,'weight','down',6);held=p.locator(sel('add')).element_handle();incoming=fixture("s.syntheticSibling.literal='different invented notebook'")
  p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-force-notebook.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();back_science(p);enter(p);ok(rowcount(p)==0,'actual import has distinct temporary work');before=snapshot(p);dispatch(held);ok(snapshot(p)==before and rowcount(p)==0,'pre-import control leaves imported notebook and sketch unchanged')
 finally:c.close()

def main():
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
   try:journey(browser,base);responsive_and_stale(browser,base);recovery(browser,base)
   finally:browser.close()
  ok(not errors,'no page, console or HTTP errors: '+str(errors));print(f'{checks} Force Sketch browser assertions passed. Artifacts: {OUT}',flush=True)
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
