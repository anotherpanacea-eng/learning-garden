"""Same Steps385: actual-app construction, exact references and Notes recovery.

One full tablet journey and a narrow phone sample use ordinary app modules.
An explicitly isolated actual-UI harness covers external context/refusal faults
and the parent refusal entrance. Synthetic notebooks only. These checks do not
qualify physical iPad/Safari, VoiceOver, audible output or learning.
"""
import sys
sys.dont_write_bytecode=True
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SAME_STEPS_ARTIFACTS') or tempfile.mkdtemp(prefix='same-steps-'))
OUT.mkdir(parents=True,exist_ok=True)
_spec=importlib.util.spec_from_file_location('same_steps_notebook_helpers',ROOT/'test/writing-table-browser.py')
h=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(h);h.OUT=OUT
ROUTE='#learn/math/equality'


def fixture():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{startEquality,pageEquality,editEquality}from'./dist/equality-desk-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={payload:'z'.repeat(512000),exact:{v:75}};const o={canExport:()=>true};startEquality(s,'twins',o);pageEquality(s,3,o);editEquality(s,'note','An invented waiting Equality explanation.',o);console.log(JSON.stringify(s));"],cwd=ROOT,text=True))


def sel(name,value=None):return '[data-ss-'+name+('="'+str(value)+'"' if value is not None else '')+']'
def click(p,name,value=None):p.locator(sel(name,value)+':visible').first.click()
def sheets(p):return h.book(p).get('rateStepSheets',[])
def setup(browser,base,seed,width=820):
 c,p=h.setup(browser,base,seed,width=width)
 p.on('requestfailed',lambda r:h.errors.append('Request failed: '+r.url+' '+str(r.failure)) if 'ERR_ABORTED' not in (r.failure or '') else None)
 p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-same-steps]').wait_for();return c,p
def enter(p):p.locator('[data-equality-same-steps]').click();p.locator(sel('root')).wait_for()
def adjust(p,slot,axis,delta,n=1):
 for _ in range(n):click(p,'adjust',str(slot)+':'+axis+':'+str(delta))
def select_interval(p,slot,index):p.locator(sel('interval',slot)).select_option(str(index))
def number(p,axis,slot):return p.locator(sel(axis,slot)).inner_text().strip().replace('−','-')
def text(p):return p.locator(sel('root')).inner_text()
def chooser(p):
 d=p.locator('[data-ss-chooser]')
 if d.count() and d.get_attribute('open') is None:d.locator(':scope>summary').click()
def case(p,id):chooser(p);p.locator(sel('case')).select_option(id)
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('[data-ss-root] button,[data-ss-root] a,[data-ss-root] summary,[data-ss-root] select').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'visible construction controls have44px targets and16px text: '+str(bad))
 small=p.locator('[data-ss-root] p,[data-ss-root] li,[data-ss-root] th,[data-ss-root] td,[data-ss-root] label').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)')
 h.ok(not small,'table, construction and reference use readable body text: '+str(small))
 glyphs=p.locator('[data-ss-plot] text').evaluate_all('xs=>xs.filter(e=>e.getClientRects().length&&e.getBoundingClientRect().width>0).map(e=>{const m=e.getScreenCTM();return{text:e.textContent,size:parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.a,m.b)}})')
 h.ok(glyphs and min(x['size'] for x in glyphs)>=15.9,'SVG labels remain16px after actual viewBox scaling: '+str(glyphs))


def journey(browser,base,seed):
 print('Same Steps: actual parent/construction/copy journey',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.locator('[data-equality-field="note"]').fill('A waiting synthetic Equality note survives the step tool.')
  before=copy.deepcopy(h.book(p));enter(p)
  h.ok('rateStepSheets' not in h.book(p),'entry and graph rendering do not allocate a saved root')
  h.ok(p.locator(sel('instruction')).is_visible() and bool(p.locator(sel('instruction')).inner_text().strip()),'entry presents a visible actionable instruction before the teaching disclosure is opened')
  bounds(p)
  h.ok('No step built here yet.' in text(p),'missing construction is distinct from a built zero vector')
  adjust(p,0,'x',1);adjust(p,0,'y',1);p.locator(sel('idea')).select_option('different');click(p,'keep')
  first=copy.deepcopy(sheets(p)[0])
  h.ok(first['work']['steps']['0']=={'x':1,'y':1} and first['work']['idea']=='different' and not first['work']['referenceShown'],'Keep preserves a wrong constructed step and literal unchecked idea')
  click(p,'shelf');click(p,'card',first['id'])
  h.ok(p.locator(sel('adjust','0:x:1')).is_disabled() and p.locator(sel('idea')).is_disabled(),'kept construction and idea are read-only')
  click(p,'copy');adjust(p,0,'y',1,2);adjust(p,1,'x',1);adjust(p,1,'y',1,3);p.locator(sel('idea')).select_option('same');click(p,'compare')
  h.ok('Your step reaches the next row.' in text(p) and 'The rates in these two selected intervals are the same.' in text(p),'explicit reference explains fitting steps and the selected actual rates')
  click(p,'keep');corrected=copy.deepcopy(sheets(p)[-1])
  h.ok(corrected['work']['steps']=={'0':{'x':1,'y':3},'1':{'x':1,'y':3}} and corrected['work']['referenceShown'],'corrected copy retains both exact vectors and elected reference')
  h.ok(sheets(p)[0]==first,'correcting and keeping a copy never overwrites the earlier unexpected step')
  click(p,'working');select_interval(p,1,0);adjust(p,1,'y',-1)
  h.ok(number(p,'y',0)=='2' and number(p,'y',1)=='2' and 'A and B name the same interval.' in text(p),'repeated selection exposes the same underlying vector in both builders')
  select_interval(p,1,1)
  h.ok(number(p,'y',1)=='3' and number(p,'y',0)=='2','switching intervals restores the independently retained earlier vector')
  case(p,'fall');click(p,'hear')
  payload=p.locator(sel('hear')).get_attribute('data-speak') or ''
  h.ok('6 minus 2 times x' in payload,'captured narration preserves the falling rule’s binary minus and x coefficient without claiming audible output')
  if p.locator('[data-stop-speech]').count():p.locator('[data-stop-speech]').first.click()
  case(p,'skip');select_interval(p,0,1);select_interval(p,1,0);adjust(p,0,'x',1);adjust(p,0,'y',1,2);click(p,'compare')
  h.ok('same rate but does not reach the next row' in p.locator(sel('comparison',0)).inner_text(),'same rate does not certify a wrong-length step reaches the next row')
  h.ok([number(p,'actual-x',0),number(p,'actual-y',0),number(p,'actual-rate',0)]==['2','4','2'] and [number(p,'actual-x',1),number(p,'actual-y',1),number(p,'actual-rate',1)]==['1','2','2'],'visible skipped-row actual differences are2,4 versus1,2 while both exact rates are2')
  h.ok('The rates in these two selected intervals are the same.' in text(p),'the skipped row has the same per-one-input rate despite different raw changes')
  adjust(p,0,'x',-1);adjust(p,0,'y',-1,2)
  zero=p.locator(sel('comparison',0)).inner_text()
  h.ok(number(p,'candidate-rate',0)=='Not defined' and 'same rate but does not reach the next row' not in zero and 'A per 1-across rate needs a nonzero across change.' in p.locator(sel('vector',0)).evaluate('e=>e.parentElement.innerText'),'built zero-over-zero construction is undefined, never misclassified by a zero cross-product')
  adjust(p,0,'x',-1);adjust(p,0,'y',-1,2)
  h.ok('same rate but does not reach the next row' in p.locator(sel('comparison',0)).inner_text(),'reversed equal-rate construction is distinguished from reaching the forward row')
  click(p,'example');p.locator(sel('idea')).select_option('not-sure');click(p,'keep')
  skipped=copy.deepcopy(sheets(p)[-1])
  h.ok(skipped['source']['id']=='same-steps-skip' and skipped['work']['selected']==[1,0] and skipped['work']['steps']['1']=={'x':-1,'y':-2},'kept skip construction retains direction, selected intervals and its own frozen table')
  h.ok(skipped['work']['exampleShown'] and skipped['work']['referenceShown'] and skipped['work']['idea']=='not-sure','example/reference remain separate flags from the literal current idea')
  click(p,'working');waiting=p.locator(sel('draft')).input_value();case(p,'square');adjust(p,0,'x',1)
  p.locator(sel('draft')).select_option(waiting)
  h.ok(p.locator(sel('case')).input_value()=='skip' and number(p,'x',0)=='-1','resuming a known working draft synchronizes the picker and retains its construction')
  click(p,'fresh');fresh=p.locator(sel('draft')).input_value()
  h.ok(fresh!=waiting and 'No step built here yet.' in text(p),'Fresh creates another draft without deleting the older one')
  p.locator(sel('draft')).select_option(waiting);click(p,'back');p.locator('[data-equality-root]').wait_for()
  h.ok(p.locator('[data-equality-field="note"]').input_value()=='A waiting synthetic Equality note survives the step tool.' and h.book(p)['equalityDesk']==before['equalityDesk'],'Back restores the exact waiting parent note and record')
  enter(p);h.ok(p.locator(sel('draft')).input_value()==waiting,'same-session reopening resumes the actual last construction')
  p.screenshot(path=str(OUT/'tablet.png'),full_page=True)
  rest=copy.deepcopy(h.book(p));rest.pop('rateStepSheets');h.ok(rest==before,'child work and Keep leave parent/facts/large Notes and all unrelated roots exact')
  complete=copy.deepcopy(sheets(p));report=h.export_notes(p,'same-steps-kept');h.ok(report['rateStepSheets']==complete,'actual Notes download retains exact constructed steps and sources')
  return report
 finally:c.close()


def historical_report(report):
 result=copy.deepcopy(report);old=copy.deepcopy(result['rateStepSheets'][0]);old.update(id='rate-step-80',futureOuter={'retained':True})
 old['source'].update(id='earlier-source',title='Earlier <steps> & exact rows',rule='An earlier printed number model.',rows=[{'x':3,'y':7},{'x':1,'y':3},{'x':0,'y':1}],axes={'xMin':-1,'xMax':5,'xStep':1,'yMin':-4,'yMax':8,'yStep':2},explanation='Compare these earlier exact row differences.',futureSource={'retained':True})
 old['work']={'v':1,'selected':[0,1],'steps':{'0':{'x':-2,'y':-4},'1':{'x':199,'y':-199,'futureVector':{'retained':True}}},'idea':'different','referenceShown':True,'exampleShown':False,'futureWork':{'retained':True}}
 result['rateStepSheets']=[{'id':'rate-step-900','v':99,'raw':['retained']},old]+result['rateStepSheets'];return result


def transfer(browser,base,seed,report):
 print('Same Steps: actual historical Notes import and bounded controls',flush=True)
 c,p=setup(browser,base,seed)
 try:
  altered=historical_report(report);identity=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');original=h.book(p)
  p.evaluate('location.hash="#notes"');p.locator('#progress-file').wait_for();p.locator('#progress-file').set_input_files({'name':'synthetic-same-steps.json','mimeType':'application/json','buffer':json.dumps(altered).encode()})
  p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
  h.ok(p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')!=identity,'real import creates another explorer')
  p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-same-steps]').wait_for();enter(p)
  h.ok(sheets(p)==altered['rateStepSheets'],'historical row counts/order/axes, source extras and unreadable sibling import unchanged')
  click(p,'shelf');click(p,'card','rate-step-80')
  h.ok('Earlier <steps> & exact rows' in text(p) and not p.locator('[data-ss-root] steps').count(),'historical source title is literal escaped text')
  h.ok(p.locator(sel('point')).count()==3 and 'Your step reaches the next row.' in text(p),'historical descending table and exact negative step are read from their own source')
  h.ok('200' in text(p) and 'outside this graph window' in text(p),'out-of-window candidate coordinates are printed without clamping to its axes')
  click(p,'copy');plus=p.locator(sel('adjust','1:x:1'));plus.focus();p.keyboard.press('Enter')
  h.ok(number(p,'x',1)=='200' and plus.is_disabled(),'a valid historical199 construction reaches the declared200 component limit')
  h.ok(p.locator(sel('adjust','1:x:-1')).evaluate('e=>e===document.activeElement&&!e.disabled'),'at the disabled limit focus moves to the same component’s enabled opposite control')
  minus=p.locator(sel('adjust','1:y:-1'));minus.focus();p.keyboard.press('Enter')
  h.ok(number(p,'y',1)=='-200' and minus.is_disabled() and p.locator(sel('adjust','1:y:1')).evaluate('e=>e===document.activeElement&&!e.disabled'),'the negative200 limit also disables the exhausted control and restores its enabled opposite')
  h.ok('201' in text(p) and '-197' in text(p).replace('−','-') and 'outside this graph window' in text(p),'the bounded vector still keeps its exact outside-window endpoint201,-197')
  points=p.locator('[data-ss-plot] [data-ss-point]').evaluate_all('xs=>xs.map(e=>[+e.getAttribute("cx"),+e.getAttribute("cy")])')
  endpoint=p.locator(sel('leg','1:x')).evaluate('e=>{const p=e.getPointAtLength(e.getTotalLength());return[p.x,p.y]}')
  xunit=(points[0][0]-points[1][0])/2;expected=points[1][0]+200*xunit
  clip=p.locator(sel('leg','1:x')).evaluate('e=>{const url=e.getAttribute("clip-path")||e.closest("[clip-path]")?.getAttribute("clip-path"),id=url?.match(/#([^)]*)/)?.[1],r=id&&document.getElementById(id)?.querySelector("rect");return r?["x","y","width","height"].map(k=>+r.getAttribute(k)):null}')
  h.ok(abs(endpoint[0]-expected)<.04 and abs(endpoint[1]-points[1][1])<.04 and clip==[64,28,464,332],'outside construction retains its real SVG endpoint while an effective plot-window clip bounds the rendered horizontal leg')
  click(p,'keep');last=copy.deepcopy(sheets(p)[-1]);old=altered['rateStepSheets'][1]
  h.ok(last['id']=='rate-step-901' and last['source']==old['source'] and last['work']['steps']['1']['x']==200 and last['work']['steps']['1']['y']==-200,'append allocation reserves unreadable ids and preserves the own historical source and both bounded components')
  h.ok(last['work']['futureWork']==old['work']['futureWork'] and last['work']['steps']['1']['futureVector']==old['work']['steps']['1']['futureVector'],'copy/adjust/Keep preserve additive work and vector fields')
  expected=copy.deepcopy(h.book(p));again=h.export_notes(p,'same-steps-historical')
  h.ok(again['rateStepSheets']==expected['rateStepSheets'] and again['rateStepSheets'][:-1]==altered['rateStepSheets'],'actual Notes roundtrip retains all original/historical/unreadable rows')
  h.ok(again['syntheticOther']==altered['syntheticOther'] and again['equalityDesk']==altered['equalityDesk'],'large unrelated Notes and parent Equality record survive transfer/editing')
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+identity+'"]').click();h.ok(h.book(p)==original,'import and copy leave the original explorer unchanged')
 finally:c.close()


def phone(browser,base,seed):
 print('Same Steps: focused phone geometry and keyboard sample',flush=True)
 c,p=setup(browser,base,seed,width=320)
 try:
  enter(p);bounds(p)
  p.locator(sel('adjust','0:y:1')).focus();p.keyboard.press('Enter')
  h.ok(number(p,'y',0)=='1' and p.locator(sel('adjust','0:y:1')).evaluate('e=>e===document.activeElement'),'keyboard unit construction retains its actual enabled control')
  h.ok(p.locator(sel('adjust','0:y:1')).evaluate('e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}'),'focused construction remains within the phone viewport')
  p.screenshot(path=str(OUT/'phone.png'),full_page=True)
 finally:c.close()


def saving_off(browser,base,seed):
 print('Same Steps: actual saving-off recovery',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-same-steps]').wait_for()
  before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');enter(p);adjust(p,0,'x',1);click(p,'keep')
  h.ok('download notes' in p.locator('#ss-status').inner_text().lower(),'Keep provides the conditional Notes recovery reminder')
  h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'saving-off construction writes no device progress')
  report=h.export_notes(p,'same-steps-saving-off');h.ok(report['rateStepSheets'][0]['work']['steps']['0']=={'x':1,'y':0},'actual Notes download recovers session-only construction')
 finally:c.close()


def isolated(browser,base,seed):
 print('Same Steps: labelled actual-UI context/refusal harness',flush=True)
 c,p=setup(browser,base,seed)
 try:
  setup_js='''async config=>{const parent=await import('./equality-desk-ui.mjs'),child=await import('./same-steps-ui.mjs'),media=await import('./play-media.mjs'),core=await import('./core.mjs'),transfer=await import('./progress-transfer.mjs');const main=document.querySelector('main');main.replaceChildren();const h={book:structuredClone(config.seed),owner:'synthetic-owner',active:true,allow:true,saves:0};h.book.rateStepSheets=[];h.original=h.book;const report=c=>({title:'After the Storm: observations',exportedAt:'2026-11-05T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:core.recommendations(c),...c});h.render=()=>{main.innerHTML=config.refusal&&!child.sameStepsActive(h.book,h.owner)?parent.equalityRefusal(h.book,h.owner):parent.equalityPage(h.book,h.owner);parent.bindEquality(h.book,{notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,save:()=>{h.saves++;return{enabled:true,ok:true}},render:h.render,focus:s=>document.querySelector(s)?.focus(),canExport:c=>h.allow&&transfer.prepareProgressImport(JSON.stringify(report(c),null,2)).ok});media.bindSpeech()};if(!config.refusal)child.openSameSteps(h.book,h.owner);window.ssHarness=h;h.render()}'''
  def install(refusal=False):p.evaluate(setup_js,{'seed':seed,'refusal':refusal});p.locator('[data-equality-root]' if refusal else sel('root')).wait_for()
  def dispatch(el):el.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
  install(True);before=p.evaluate('JSON.stringify(ssHarness.book)');p.locator('[data-equality-same-steps]').click()
  h.ok(p.locator(sel('root')).is_visible() and p.evaluate('JSON.stringify(ssHarness.book)')==before,'an unrelated parent-refusal view still opens the session-only tool without changing parent data')
  install();adjust(p,0,'x',1);p.evaluate('ssHarness.allow=false');before=p.evaluate('JSON.stringify(ssHarness.book)');click(p,'keep')
  h.ok(p.evaluate('JSON.stringify(ssHarness.book)')==before and p.evaluate('ssHarness.saves')==0,'refused real Notes preflight leaves all notebook roots exact')
  h.ok(number(p,'x',0)=='1' and 'could not be kept' in p.locator('#ss-status').inner_text(),'refusal preserves the working vector and recovery direction')
  p.evaluate('ssHarness.allow=true');click(p,'keep');h.ok(p.evaluate('ssHarness.book.rateStepSheets[0].work.steps["0"].x')==1,'the same working construction remains keepable after a refused preflight')
  for fault in ['owner','book','inactive','root-identity','root-bytes','control-ancestor','root-ancestor','hidden','outer-hidden','outer-aria-hidden','route']:
   install();button=p.locator(sel('keep')).element_handle()
   if fault=='owner':p.evaluate('ssHarness.owner="another-owner"')
   elif fault=='book':p.evaluate('ssHarness.book=structuredClone(ssHarness.book)')
   elif fault=='inactive':p.evaluate('ssHarness.active=false')
   elif fault=='root-identity':p.evaluate('ssHarness.book.rateStepSheets=[]')
   elif fault=='root-bytes':p.evaluate('ssHarness.book.rateStepSheets.push({raw:"external"})')
   elif fault=='control-ancestor':button.evaluate('e=>{const parent=e.parentNode,box=document.createElement("section");parent.parentNode.append(box);box.append(parent)}')
   elif fault=='root-ancestor':p.locator(sel('root')).evaluate('e=>{const box=document.createElement("section");e.parentNode.append(box);box.append(e)}')
   elif fault=='hidden':button.evaluate('e=>e.hidden=true')
   elif fault=='outer-hidden':p.locator('main').evaluate('e=>e.hidden=true')
   elif fault=='outer-aria-hidden':p.locator('main').evaluate('e=>e.setAttribute("aria-hidden","true")')
   elif fault=='route':p.evaluate('history.replaceState(null,"","#learn/math/equality/stale")')
   before=p.evaluate('JSON.stringify([ssHarness.original,ssHarness.book])');dispatch(button)
   h.ok(p.evaluate('JSON.stringify([ssHarness.original,ssHarness.book])')==before and p.evaluate('ssHarness.saves')==0,'stale '+fault+' Keep is inert in both notebooks')
   if fault=='outer-hidden':p.locator('main').evaluate('e=>e.hidden=false')
   elif fault=='outer-aria-hidden':p.locator('main').evaluate('e=>e.removeAttribute("aria-hidden")')
   if fault=='route':p.evaluate('history.replaceState(null,"","#learn/math/equality")')
  install();root=p.locator(sel('root')).element_handle();button=p.locator(sel('keep')).element_handle();click(p,'back');root.evaluate('e=>document.querySelector("main").append(e)');before=p.evaluate('JSON.stringify(ssHarness.book)');dispatch(button)
  h.ok(p.evaluate('JSON.stringify(ssHarness.book)')==before and p.evaluate('ssHarness.saves')==0,'reattached child controls remain inert after Back returns to the parent')
 finally:c.close()


def main():
 seed=fixture()
 class Quiet(http.server.SimpleHTTPRequestHandler):
  protocol_version='HTTP/1.1'
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    report=journey(browser,base,seed);transfer(browser,base,seed,report);phone(browser,base,seed);saving_off(browser,base,seed);isolated(browser,base,seed)
    h.ok(not h.errors,'no page/console/HTTP/request errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'base':base,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc())
    for ci,context in enumerate(browser.contexts):
     for pi,page in enumerate(context.pages):
      try:page.screenshot(path=str(OUT/f'failure-{ci}-{pi}.png'),full_page=True);(OUT/f'failure-{ci}-{pi}.html').write_text(page.content())
      except Exception:pass
    raise
   finally:browser.close()
 finally:server.shutdown();server.server_close()


if __name__=='__main__':main()
