"""Push & Drift390: fictional model programs through the actual app.
One full tablet journey; focused responsive, recovery and context-fault probes.
The ordinary journey uses the real app exposure callback and Notes preflight.
The labelled UI harness isolates rejection/lifecycle conditions only.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('PUSH_DRIFT_ARTIFACTS') or tempfile.mkdtemp(prefix='push-drift-'));OUT.mkdir(parents=True,exist_ok=True)
_spec=importlib.util.spec_from_file_location('push_drift_notes_helpers',ROOT/'test/writing-table-browser.py');h=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(h);h.OUT=OUT

def fixture(extra=''):
 code="import{readFileSync}from'node:fs';import{freshState,recommendations}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{startMotion,setMotionField}from'./dist/motion-evidence-core.mjs';import{motionLessons}from'./dist/motion-evidence-content.mjs';import{startPostOffice}from'./dist/post-office-core.mjs';import{deliveries}from'./dist/post-office-content.mjs';import{startAdaptiveRival,generateRivalTask}from'./dist/post-rival.mjs';let s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticSibling={literal:'invented',payload:'z'.repeat(512000)};"+extra+";console.log(JSON.stringify(s));"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-05T12:00:00Z'},{'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-11-05T12:00:00Z'}]}
 if len(json.dumps(seed))>4*1024*1024:registry['explorers']=registry['explorers'][:1]
 c.add_init_script('(d=>{if(!localStorage.getItem("push-drift-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const x of d.registry.explorers)localStorage.setItem("number-garden-v1:"+x.id,JSON.stringify(x.id==="explorer-1"?d.seed:d.other));localStorage.setItem("push-drift-fixture","1");}})('+json.dumps({'registry':registry,'seed':seed,'other':fixture('delete s.syntheticSibling')})+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:h.errors.append(str(e)));p.on('console',lambda m:h.errors.append(m.text) if m.type=='error' else None);p.on('response',lambda r:h.errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None)
 p.goto(base+'#learn/science',wait_until='networkidle');ready(p);return c,p

def ready(p):
 active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');choice='[data-select-explorer="'+active+'"]'
 p.locator('[data-motion-push-drift],'+choice).first.wait_for()
 if p.locator(choice).count():p.locator(choice).click()
 p.locator('[data-motion-push-drift]').wait_for()
def sel(name,value=None):return '[data-pd-'+name+('="'+str(value)+'"' if value is not None else '')+']'
def click(p,name,value=None):
 if name in ['working','shelf']:
  d=p.locator('.pd-tools')
  if d.get_attribute('open') is None:d.locator(':scope>summary').click()
 p.locator(sel(name,value)+':visible').first.click()
def enter(p):p.locator('[data-motion-push-drift]').click();p.locator(sel('root')).wait_for()
def choose(p,id):
 d=p.locator('[data-pd-fold="drafts"]')
 if d.get_attribute('open') is None:d.locator(':scope>summary').click()
 p.locator(sel('case')).select_option(id)
def rows(p):return h.book(p).get('cartPrograms',[])
def force(p,card,choice):
 click(p,'card',card);h.ok(p.locator(sel('card',card)).evaluate('e=>e===document.activeElement'),'card choice preserves control focus')
 click(p,'force',choice);h.ok(p.locator(sel('force',choice)).evaluate('e=>e===document.activeElement'),'force choice preserves control focus')
def velocities(p):return p.locator('[data-pd-velocity]').all_text_contents()
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('[data-pd-root] button,[data-pd-root] a,[data-pd-root] select,[data-pd-root] summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'44px controls and16px type: '+str(bad))
 if p.viewport_size['width']<=560:
  tiny=p.locator('[data-pd-root] svg text').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)*Math.abs(x.getScreenCTM().a)<15.9).map(x=>x.textContent)')
  h.ok(not tiny,'phone SVG labels remain readable at rendered scale: '+str(tiny))

def journey(browser,base):
 print('Push & Drift: actual loads, programs, clock, exposure and immutable copies',flush=True)
 seed=fixture('s.broad.drafts.waiting={question:{fact:[2,3]},attempts:[],raw:"held"};const v=startPostOffice(s,deliveries[0].id);startAdaptiveRival(s);v.rival.task=generateRivalTask("multiply",2,3,0);')
 c,p=setup(browser,base,seed)
 try:
  before=copy.deepcopy(h.book(p));enter(p);bounds(p);h.ok(h.book(p)==before,'entry allocates no notebook root');h.ok(not p.locator('drawn-howto').count(),'parent how-to suppressed inside the distinct bench');h.ok(not p.locator(sel('reopen')).is_visible(),'recovery starts hidden')
  h.ok('starting setup' in p.locator('.pd-starting').inner_text(),'untouched defaults visibly identified');h.ok(not p.locator('.pd-calculations').count() and not p.locator('.pd-graph').count(),'Plan contains no future prediction')
  p.locator('[data-pd-mass-cart="0"][data-pd-mass-choice="1"]').click();p.locator('[data-pd-mass-cart="1"][data-pd-mass-choice="2"]').click()
  for i in range(3):force(p,i,2)
  h.ok(h.book(p)==before,'load and card edits leave notebook unchanged before computed view');click(p,'run');h.ok('Before the pushes' in p.locator('#pd-task').inner_text(),'Run starts at zero');h.ok('cartPrograms' not in h.book(p),'viewing does not Keep a program')
  click(p,'step',1);h.ok(velocities(p)==['+2 m/s','+1 m/s'],'same4N gives changes2 and1 for masses2 and4');h.ok('After second 1' in p.locator('#pd-task').inner_text() and p.locator('#pd-task').evaluate('e=>e===document.activeElement'),'manual step focuses time and velocity heading');h.ok(p.locator('.pd-graph polyline').first.get_attribute('points').count(' ')==1,'Run graph contains only the reached prefix')
  click(p,'step',1);click(p,'step',1);h.ok(velocities(p)==['+6 m/s','+3 m/s'],'three chosen pushes accumulate exactly');spoken=p.locator(sel('read')).first.get_attribute('data-speak');h.ok('positive 6 meters per second' in spoken and '4 newtons right' in spoken and 'total mass 2 kilograms' in spoken,'narration states signs, units, force and total load')
  after=h.book(p);h.ok(after['broad']['drafts']['waiting']['knownFact'] and after['broad']['drafts']['waiting']['attempts']==[],'actual app callback marks matching broad prior exposure without an answer');h.ok(after['postOffice']['visits'][0]['rival']['priorFactShown'] and after['postOffice']['visits'][0]['rival']['attempts']==[],'actual pending Bramble gains prior exposure without attempts');h.ok(after['baseline']['observations']==before['baseline']['observations'],'model does not award independent observations')
  click(p,'page','history');h.ok(p.locator('.pd-graph tbody').count()==0 and p.locator('.pd-table-wrap tbody tr').count()==4,'complete history includes all four time boundaries');h.ok('−12 to +12' in p.locator('.pd-graph').inner_text(),'source fixed scale survives changed loads and forces');click(p,'page','plan');click(p,'swap');h.ok('clock is back at zero' in p.locator('#pd-status').inner_text(),'swap restarts clock');h.ok([p.locator('[data-pd-mass-cart="'+str(i)+'"][aria-pressed="true"]').inner_text() for i in range(2)]==['4 kg','2 kg'],'swap changes only the two loads');h.ok([x for x in p.locator('.pd-force-cards button').all_text_contents()]==['Second 1: 4 N right','Second 2: 4 N right','Second 3: 4 N right'],'swap preserves force program')
  click(p,'keep');first=copy.deepcopy(rows(p)[0]);h.ok(first['work']['masses']==[4,2] and first['work']['runShown'] and first['work']['historyShown'] and not first['work']['teachingShown'],'Keep freezes choices and opened flags, not current-configuration claims')
  click(p,'teaching');h.ok(rows(p)[0]==first and p.locator(sel('keep')).count()==1,'first teaching on kept program opens explicit labelled copy without mutating it')
  for i in range(6):
   h.ok(f'{i+1} of 6' in p.locator('#pd-task').inner_text(),'manual teaching page')
   h.ok('−4 to +4' in p.locator('.pd-example').inner_text(),'teaching uses fixed separate source scale')
   if i==1:h.ok(velocities(p)==['+4 m/s','+2 m/s'],'worked example owns masses1/2 independently of current4/2')
   if i==3:h.ok(velocities(p)==['0 m/s','+2 m/s'] and 'Force direction and velocity direction need not match' in p.locator(sel('root')).inner_text(),'opposing force example distinguishes rest from reversal')
   if i<5:click(p,'teach-step',1)
  click(p,'close-help');h.ok('Plan the pushes' in p.locator('#pd-task').inner_text(),'help returns to the preceding page');click(p,'keep');h.ok(rows(p)[0]==first and rows(p)[-1]['work']['teachingShown'],'new version alone records teaching view')
  click(p,'copy');choose(p,'return');force(p,0,2);force(p,2,0);click(p,'page','history');h.ok('final velocities match. Earlier steps differ.' in p.locator('.pd-history-note').inner_text(),'equal final velocities distinguished from equal histories');h.ok('+5' in p.locator('.pd-table-wrap').inner_text() and '+3' in p.locator('.pd-table-wrap').inner_text(),'return source begins at its own nonzero velocity');click(p,'keep')
  click(p,'copy');choose(p,'against');force(p,0,2);click(p,'run');click(p,'step',1);h.ok(velocities(p)==['0 m/s','−1 m/s'],'rightward force can leave heavier cart moving left');click(p,'page','plan');force(p,1,0);force(p,1,1);click(p,'run');h.ok('Before the pushes' in p.locator('#pd-task').inner_text(),'changing card resets local clock');click(p,'step',1);click(p,'step',1);h.ok(velocities(p)==['0 m/s','−1 m/s'],'zero next force preserves velocity, including leftward motion')
  p.screenshot(path=str(OUT/'tablet.png'),full_page=True);click(p,'back');h.ok(h.book(p)['syntheticSibling']==before['syntheticSibling'],'Back preserves unknown sibling');report=h.export_notes(p,'cart-programs');h.ok(report['cartPrograms']==rows(p),'actual Notes includes all frozen programs');return report
 finally:c.close()

def transfer(browser,base,report):
 print('Push & Drift: actual import, historical sources, raw siblings and reload',flush=True)
 changed=copy.deepcopy(report);old=changed['cartPrograms'][0];old['source']['id']='earlier-model';old['source']['title']='Earlier <literal> & carts';old['source']['massChoices']=[3,6];old['source']['initialMasses']=[3,6];old['work']['masses']=[3,6];old['source']['teaching'][0]['words']='Earlier teaching words stay literal.';old['source']['teaching'][0]['example']={'future':99};old['work']['extra']={'raw':True};dup=copy.deepcopy(old);dup['id']='cart-program-777';changed['cartPrograms']=[{'id':'cart-program-900','future':True},*changed['cartPrograms'],dup,copy.deepcopy(dup),None,None,None]
 c,p=setup(browser,base,fixture())
 try:
  original=copy.deepcopy(h.book(p));p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-carts.json','mimeType':'application/json','buffer':json.dumps(changed).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#learn/science"');p.locator('[data-motion-push-drift]').wait_for();enter(p);click(p,'shelf');h.ok('cannot be opened' in p.locator(sel('root')).inner_text(),'unreadable siblings retain a navigable shelf');click(p,'shelf-step',1);h.ok('Earlier program 9' in p.locator(sel('root')).inner_text(),'raw shelf paginates past eight');click(p,'shelf-step',-1);click(p,'card-open',old['id']);h.ok(p.locator('.pd-job-title').text_content()=='Earlier <literal> & carts','saved title remains source-owned literal text');click(p,'copy');click(p,'run');click(p,'step',1);h.ok(velocities(p)==['+4/3 m/s','+2/3 m/s'],'historical nonpreset masses give exact reduced fractions');click(p,'teaching');h.ok('Earlier teaching words stay literal.' in p.locator(sel('root')).inner_text() and 'picture cannot be drawn' in p.locator(sel('root')).inner_text(),'unknown example retains literal words with local picture fallback');click(p,'close-help');click(p,'keep');h.ok(rows(p)[-1]['id']=='cart-program-901' and rows(p)[:-1]==changed['cartPrograms'],'allocation respects future suffix and preserves raw siblings exactly')
  expected=copy.deepcopy(rows(p));p.reload(wait_until='networkidle');ready(p);h.ok(rows(p)==expected,'reload retains immutable source and extra fields');again=h.export_notes(p,'cart-redownload');h.ok(again['cartPrograms']==expected,'actual redownload is exact');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-1"]').click();p.wait_for_function('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId==="explorer-1"');h.ok(h.book(p)==original,'imported explorer leaves original notebook exact')
 finally:c.close()

def parent_words(browser,base):
 print('Push & Drift: real parent drafts and rejected input',flush=True)
 extra='const lesson=motionLessons.find(x=>x.writing);startMotion(s,lesson.id,{canExport:()=>true});setMotionField(s,"explanation","An earlier explanation.",{canExport:()=>true});'
 seed=fixture(extra);c,p=setup(browser,base,seed)
 try:
  inp=p.locator('[data-motion-field="explanation"]');inp.fill('A waiting explanation.');before=copy.deepcopy(h.book(p));enter(p);click(p,'back');h.ok(h.book(p)['motionEvidence']==before['motionEvidence'] and p.locator('[data-motion-field="explanation"]').input_value()=='A waiting explanation.','entry/Back preserves actual source, checks and typed explanation')
 finally:c.close()
 # Real shared-cap failure in setMotionField; the real input must survive entry.
 capped=fixture(extra+'''s.padding='';const app=readFileSync('./dist/app.mjs','utf8'),decl=app.match(/^function notesReport\\(notebook\\)\\{.*\\}$/m)[0];const report=Function('recommendations','explorerStore',decl+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});s.padding='x'.repeat(5*1024*1024-new TextEncoder().encode(JSON.stringify(report(s),null,2)).length-256);''')
 c,p=setup(browser,base,capped)
 try:
  before=copy.deepcopy(h.book(p));inp=p.locator('[data-motion-field="explanation"]');old=inp.element_handle();inp.fill('Waiting rejected words. '+('x'*1000));p.locator('[data-motion-push-drift]').click();h.ok(not p.locator(sel('root')).count() and inp.input_value()=='Waiting rejected words. '+('x'*1000) and old.evaluate('e=>e===document.querySelector("[data-motion-field=explanation]")'),'rejected parent input blocks child entry without replacing textarea');h.ok(h.book(p)==before,'rejected entry mutates no record')
 finally:c.close()

def responsive_and_saveoff(browser,base):
 print('Push & Drift: focused touch/keyboard samples, reset and saving off',flush=True)
 for width,height in [(320,600),(1024,768)]:
  c,p=setup(browser,base,fixture(),width,height)
  try:
   enter(p);bounds(p);force(p,0,0);click(p,'run');p.locator(sel('step',1)).focus();p.keyboard.press('Enter');h.ok(velocities(p)==['−4 m/s','−2 m/s'] and p.locator('#pd-task').evaluate('e=>e===document.activeElement'),'keyboard step keeps signed model and heading focus');h.ok(p.evaluate('(()=>{const h=document.querySelector("#pd-task").getBoundingClientRect(),t=document.querySelector(".pd-tabs").getBoundingClientRect();return h.top>=t.bottom-1})()'),'focused step heading stays below sticky tabs');bounds(p);p.screenshot(path=str(OUT/f'sample-{width}.png'),full_page=True);click(p,'keep');old=p.locator(sel('copy')).element_handle();p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click();p.locator('[data-film-skip]').click();p.evaluate('location.hash="#learn/science"');p.locator('[data-motion-push-drift]').wait_for();enter(p);old.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok('cartPrograms' not in h.book(p),'actual reset and old controls cannot resurrect programs')
  finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#learn/science"');p.locator('[data-motion-push-drift]').wait_for();before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');enter(p);force(p,0,2);click(p,'keep');h.ok('saving was off' in p.locator('#pd-status').inner_text(),'notice reports actual saving-off result');h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'saving-off leaves storage exact');report=h.export_notes(p,'cart-saveoff');h.ok(report['cartPrograms'][0]['work']['forces']==[4,0,0],'actual Notes recovers session-only construction')
 finally:c.close()

def actual_arithmetic_cap(browser,base):
 print('Push & Drift: real Notes capacity refuses arithmetic before disclosure',flush=True)
 extra='s.broad.drafts.waiting={question:{fact:[2,2]},attempts:[]};'
 cap="s.padding='';const app=readFileSync('./dist/app.mjs','utf8'),decl=app.match(/^function notesReport\\(notebook\\)\\{.*\\}$/m)[0];const report=Function('recommendations','explorerStore',decl+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});s.padding='x'.repeat(5*1024*1024-new TextEncoder().encode(JSON.stringify(report(s),null,2)).length-20);"
 c,p=setup(browser,base,fixture(extra+cap))
 try:
  before=copy.deepcopy(h.book(p));enter(p);force(p,0,2);click(p,'run');click(p,'step',1);h.ok('Before the pushes' in p.locator('#pd-task').inner_text() and velocities(p)==['0 m/s','0 m/s'],'actual shared capacity prevents new prediction DOM');h.ok('could not be opened safely' in p.locator('#pd-status').inner_text() and h.book(p)==before,'actual refusal keeps entire notebook and prior local clock');h.ok('positive 4 meters per second' not in p.locator(sel('read')).first.get_attribute('data-speak'),'refused arithmetic is absent from narration');click(p,'page','plan');force(p,0,0);h.ok(not p.locator(sel('retry')).count(),'edit clears the real refused pending view');click(p,'keep');h.ok(h.book(p)==before and 'could not be kept safely' in p.locator('#pd-status').inner_text(),'actual Keep limit also preserves inputs and prior records')
 finally:c.close()

def isolated(browser,base):
 print('Push & Drift: labelled actual-UI refusal, fresh context and stale controls harness',flush=True)
 c,p=setup(browser,base,fixture())
 def install():
  p.evaluate("""async()=>{const U=await import('./push-drift-ui.mjs');history.replaceState(null,'','#learn/science');window.pdHarness={book:{cartPrograms:[],broad:{waiting:false},other:{exact:true}},owner:'invented-owner',active:true,allow:true,saves:0};const h=pdHarness;h.original=h.book;h.ctx={notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,canExport:()=>h.allow,exposeFacts:(pairs,target)=>{if(target.broad.waiting){target.broad.waiting=false;target.broad.prior=pairs}},save:()=>{h.saves++;return{enabled:true,ok:true}},render:()=>h.render()};h.render=()=>{U.preparePushDisplay(h.book,h.owner,h.ctx);document.querySelector('main').innerHTML=U.pushDriftPage(h.book,h.owner);U.bindPushDrift(h.book,h.ctx)};U.openPushDrift(h.book,h.owner,location.hash);h.render();}""")
 def dispatch(e):e.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
 try:
  install();force(p,0,2);click(p,'run');p.evaluate('pdHarness.book.broad.waiting=true;pdHarness.allow=false');before=p.evaluate('JSON.stringify(pdHarness.book)');click(p,'step',1);h.ok('Before the pushes' in p.locator('#pd-task').inner_text() and p.evaluate('JSON.stringify(pdHarness.book)')==before,'failed qualification keeps prior clock and notebook before DOM disclosure');h.ok(velocities(p)==['0 m/s','0 m/s'] and 'positive 4 meters' not in p.locator(sel('read')).first.get_attribute('data-speak'),'refused future values absent from DOM and narration');p.evaluate('pdHarness.allow=true');click(p,'retry');h.ok(velocities(p)==['+4 m/s','+2 m/s'],'retry reuses waiting requested view')
  p.evaluate('pdHarness.book.broad.waiting=true;pdHarness.allow=false;pdHarness.render()');h.ok('Plan the pushes' in p.locator('#pd-task').inner_text() and not p.locator('.pd-graph').count(),'prepared external redraw falls back to safe Plan before HTML');force(p,0,0);h.ok(not p.locator(sel('retry')).count(),'editing clears pending view instead of later overwriting new inputs');p.evaluate('pdHarness.allow=true');click(p,'run');click(p,'step',1);h.ok(velocities(p)==['−4 m/s','−2 m/s'],'retry cancellation retains new input')
  for fault in ['owner','book','inactive','identity','bytes','ancestor','hidden','outer-hidden','route']:
   install();old=p.locator(sel('keep')).element_handle()
   if fault=='owner':p.evaluate('pdHarness.owner="other-owner"')
   elif fault=='book':p.evaluate('pdHarness.book=structuredClone(pdHarness.book)')
   elif fault=='inactive':p.evaluate('pdHarness.active=false')
   elif fault=='identity':p.evaluate('pdHarness.book.cartPrograms=[]')
   elif fault=='bytes':p.evaluate('pdHarness.book.cartPrograms.push({opaque:true})')
   elif fault=='ancestor':old.evaluate('e=>{const p=e.parentNode,b=document.createElement("div");p.parentNode.append(b);b.append(p)}')
   elif fault=='hidden':old.evaluate('e=>e.hidden=true')
   elif fault=='outer-hidden':p.locator('main').evaluate('e=>e.hidden=true')
   elif fault=='route':p.evaluate('history.replaceState(null,"","#learn/science/other")')
   before=p.evaluate('JSON.stringify([pdHarness.original,pdHarness.book])');dispatch(old);h.ok(p.evaluate('JSON.stringify([pdHarness.original,pdHarness.book])')==before and p.evaluate('pdHarness.saves')==0,'stale '+fault+' cannot Keep');p.locator('main').evaluate('e=>e.hidden=false')
  install();force(p,0,2);p.locator(sel('keep')).focus();p.evaluate('pdHarness.book.cartPrograms.push({opaque:"newer"})');p.keyboard.press('Tab');h.ok(p.locator(sel('reopen')).evaluate('e=>e===document.activeElement'),'first stale Tab focuses recovery');p.keyboard.press('Tab');h.ok(not p.locator(sel('reopen')).evaluate('e=>e===document.activeElement'),'later Tab can leave recovery');click(p,'reopen');click(p,'keep');h.ok(p.evaluate('pdHarness.book.cartPrograms[0].opaque')=='newer' and p.evaluate('pdHarness.book.cartPrograms[1].work.forces[0]')==4,'recovery preserves new raw sibling and waiting input')
  install();force(p,0,2);p.evaluate('pdHarness.owner="second-owner"');p.evaluate("async()=>{const u=await import('./push-drift-ui.mjs');u.openPushDrift(pdHarness.book,pdHarness.owner,location.hash);pdHarness.render()}");force(p,0,0);p.evaluate('pdHarness.owner="invented-owner";pdHarness.render()');h.ok('4 N right' in p.locator(sel('card',0)).inner_text(),'same notebook identity still isolates different owners')
 finally:c.close()

def main():
 class Quiet(http.server.SimpleHTTPRequestHandler):
  protocol_version='HTTP/1.1'
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    report=journey(b,base);transfer(b,base,report);parent_words(b,base);responsive_and_saveoff(b,base);actual_arithmetic_cap(b,base);isolated(b,base);h.ok(not h.errors,'no console/page/HTTP errors: '+str(h.errors));print(json.dumps({'status':'passed','checks':h.checks,'base':base}),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
