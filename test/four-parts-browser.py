"""Four Parts388: real construction, independent comparisons and Notes recovery.

One ordinary tablet journey and focused phone/landscape samples use the unmodified
app. A labelled actual-UI harness isolates inaccessible context/refusal faults.
All records are invented. This does not qualify physical devices, audible output
or learning. Existing Writing Table notebook/download helpers are reused.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('FOUR_PARTS_ARTIFACTS') or tempfile.mkdtemp(prefix='four-parts-'));OUT.mkdir(parents=True,exist_ok=True)
_spec=importlib.util.spec_from_file_location('four_parts_notebook_helpers',ROOT/'test/writing-table-browser.py')
h=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(h);h.OUT=OUT
ROUTE='#learn/math/equality'

def fixture():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{startEquality,pageEquality,editEquality}from'./dist/equality-desk-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={payload:'z'.repeat(512000),opaque:{v:388}};const o={canExport:()=>true};startEquality(s,'twins',o);pageEquality(s,3,o);editEquality(s,'note','An invented waiting Equality explanation.',o);console.log(JSON.stringify(s));"],cwd=ROOT,text=True))

def sel(name,value=None):return '[data-fp-'+name+('="'+str(value)+'"' if value is not None else '')+']'
def tools(p):
 d=p.locator('.fp-tools')
 if d.get_attribute('open') is None:d.locator(':scope>summary').click()
def click(p,name,value=None):
 if name in ['working','shelf','hear']:tools(p)
 p.locator(sel(name,value)+':visible').first.click()
def setup(browser,base,seed,width=820,height=1000):
 c,p=h.setup(browser,base,seed,width=width,height=height);p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-four-parts]').wait_for();return c,p
def enter(p):p.locator('[data-equality-four-parts]').click();p.locator(sel('root')).wait_for()
def sheets(p):return h.book(p).get('areaProducts',[])
def stage(p,name):click(p,'stage',name)
def label(p,part,power,count):
 stage(p,'build');click(p,'part',part);click(p,'kind',power)
 # This helper is used on a new label (the instrument starts it at one).
 remaining=count-1
 while remaining>=5:click(p,'count',5);remaining-=5
 for _ in range(remaining):click(p,'count',1)
def total(p,index,delta):
 stage(p,'collect');step=5 if delta>0 else -5
 while abs(delta)>=5:click(p,'total-'+str(index),step);delta-=step
 for _ in range(abs(delta)):click(p,'total-'+str(index),1 if delta>0 else -1)
def choose(p,id):
 d=p.locator('[data-fp-fold="drafts"]')
 if d.get_attribute('open') is None:d.locator(':scope>summary').click()
 p.locator(sel('case')).select_option(id)
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('[data-fp-root] button,[data-fp-root] a,[data-fp-root] select,[data-fp-root] summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent,w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))')
 h.ok(not bad,'visible controls retain44px targets and16px text: '+str(bad))
 bad=p.locator('[data-fp-root] p,[data-fp-root] label').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)')
 h.ok(not bad,'body and source labels remain16px: '+str(bad))
 bad=p.locator('[data-fp-count],[data-fp-x]').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&!(x.getAttribute("aria-label")||x.textContent).includes(x.textContent.trim())).map(x=>x.textContent)')
 h.ok(not bad,'visible symbols remain in accessible control names')

def journey(browser,base,seed):
 print('Four Parts: actual parent, independent construction and immutable copies',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.locator('[data-equality-field="note"]').fill('A waiting invented explanation stays exactly here.')
  before=copy.deepcopy(h.book(p));enter(p)
  h.ok(h.book(p)==before and 'areaProducts' not in before,'entry allocates no record or parent changes')
  h.ok(not p.locator(sel('reopen')).is_visible(),'recovery is hidden until saved layouts change')
  h.ok(p.locator('#fp-instruction').is_visible(),'the first turn has an actionable instruction without opening teaching');bounds(p)
  p.locator('[data-fp-pick="right"]').tap();h.ok('Right strip' in p.locator('#fp-task').inner_text(),'tapping the picture selects the same part as its native44px button')
  label(p,'square',1,2);label(p,'right',1,2);label(p,'bottom',1,3);label(p,'corner',0,6)
  total(p,1,7);total(p,2,6);stage(p,'build');click(p,'x2');stage(p,'compare')
  h.ok(p.locator('.fp-point-only').is_visible(),'one-value coincidence is distinguished from expression identity')
  h.ok('different expression' in p.locator('[data-fp-result="square"]').inner_text() and 'same number' in p.locator('[data-fp-result="square"]').inner_text(),'2x and x² agree numerically at2 but differ structurally')
  h.ok('These counts gather your four labels.' in p.locator(sel('root')).inner_text(),'a self-consistent wrong tray is recognized separately')
  h.ok(h.book(p)==before,'all construction/comparison remains session work before Keep')
  click(p,'keep');first=copy.deepcopy(sheets(p)[0]);h.ok(first['work']['total']==[0,7,6] and first['work']['x']==2 and first['work']['referenceShown'],'unexpected construction is kept literally')
  h.ok(not first['work']['teachingShown'] and not first['work']['exampleShown'],'unopened named views remain separate')
  stage(p,'build');h.ok(p.locator(sel('kind',2)).is_disabled() and p.locator(sel('help','teaching')).is_disabled(),'kept labels and unopened help require a free copy')
  click(p,'copy');click(p,'part','square');click(p,'kind',2);click(p,'count',-1);click(p,'x',1)
  total(p,0,1);total(p,1,-2);stage(p,'compare');h.ok('These counts describe the whole plan.' in p.locator(sel('root')).inner_text(),'corrected labels and independent tray describe the whole')
  click(p,'keep');second=copy.deepcopy(sheets(p)[-1]);h.ok(second['work']['pieces']['square']=={'power':2,'count':1} and second['work']['total']==[1,5,6] and second['work']['x']==3,'corrected copy retains its exact construction')
  h.ok(sheets(p)[0]==first,'correcting a copy never overwrites the unexpected first version')
  click(p,'copy');stage(p,'build');click(p,'part','right');click(p,'count',1);click(p,'part','bottom');click(p,'count',-1);stage(p,'compare')
  h.ok('on each other’s strips' in p.locator(sel('root')).inner_text(),'exact swapped-strip feedback appears without rejecting a matching whole')
  h.ok('These counts describe the whole plan.' in p.locator(sel('root')).inner_text(),'swapping locations preserves the independent whole identity')
  total(p,2,1);stage(p,'compare');h.ok('on each other’s strips' not in p.locator(sel('root')).inner_text(),'swap feedback stays suppressed when the tray does not describe the whole');total(p,2,-1);stage(p,'compare')
  click(p,'keep');third=copy.deepcopy(sheets(p)[-1]);click(p,'back')
  h.ok(h.book(p)['equalityDesk']==before['equalityDesk'] and h.book(p)['syntheticOther']==before['syntheticOther'],'return preserves parent words, rules, checks/support and large unknown sibling')
  before_return=copy.deepcopy(h.book(p));p.locator('.fp-parent-return>summary').click();h.ok(h.book(p)==before_return,'return inspector is read-only')
  enter(p);click(p,'copy');click(p,'help','teaching')
  for i in range(6):
   h.ok(str(i+1)+' of 6' in p.locator('#fp-task').inner_text(),'manual teaching page keeps its current position')
   if i<5:click(p,'teach-step',1)
  click(p,'close-help');click(p,'help','example');h.ok('132' in p.locator('.fp-help').inner_text(),'separate numerical example is concrete and available');click(p,'close-help')
  draft=p.locator(sel('draft')).input_value();choose(p,'narrow');h.ok('right +1' in p.locator('.fp-heading').inner_text(),'new job uses its own fixed dimensions')
  label(p,'corner',0,4);click(p,'keep');fourth=copy.deepcopy(sheets(p)[-1]);h.ok(not fourth['work']['referenceShown'] and fourth['work']['total']==[0,0,0],'a partial layout and untouched zero tray are keepable without a reference')
  h.ok(p.locator(sel('stage','compare')).is_disabled(),'a kept version without reference exposure cannot reveal Compare')
  click(p,'working');d=p.locator('[data-fp-fold="drafts"]');
  if d.get_attribute('open') is None:d.locator(':scope>summary').click()
  p.locator(sel('draft')).select_option(draft);h.ok('right +2' in p.locator('.fp-heading').inner_text(),'choosing another job did not erase the earlier copy')
  click(p,'hear');words=p.locator(sel('hear')).get_attribute('data-speak') or '';h.ok('Current x is 3' in words and 'square' in words,'Hear uses explicit current source/work narration')
  if p.locator('[data-stop-speech]').count():p.locator('[data-stop-speech]').first.click()
  click(p,'keep');last=copy.deepcopy(sheets(p)[-1]);h.ok(last['work']['teachingShown'] and last['work']['exampleShown'] and last['work']['referenceShown'],'kept support flags name the actual opened views')
  h.ok(sheets(p)[:3]==[first,second,third],'later copies, teaching and job changes leave earlier versions exact')
  p.screenshot(path=str(OUT/'kept-tablet.png'),full_page=True)
  report=h.export_notes(p,'four-parts-complete');h.ok(report['areaProducts']==sheets(p),'actual Notes carries every complete/partial/unexpected version');return report
 finally:c.close()

def transfer(browser,base,seed,report):
 print('Four Parts: actual import, historical drawing fallback and raw siblings',flush=True)
 altered=copy.deepcopy(report);old=copy.deepcopy(altered['areaProducts'][-1]);old['id']=altered['areaProducts'][0]['id'];old['source'].update(id='earlier-layout',title='Earlier <layout> & literal words',a=5,b=6,explanation='Earlier kept explanation.',futureSource={'literal':'<invented>'});old['source']['teaching'][0]={'words':'Earlier teaching words stay literal.','figure':{'kind':'future-picture','opaque':[1,2]}};old['work']['futureWork']={'keep':True};old['work']['pieces']['square']['futureTerm']={'note':'untouched'}
 altered['areaProducts'][0]=old;duplicate=copy.deepcopy(altered['areaProducts'][1]);duplicate['id']='area-product-777';altered['areaProducts']=[{'id':'area-product-900','source':{'v':99},'work':{'opaque':True}},*altered['areaProducts'],duplicate,copy.deepcopy(duplicate),None]
 c,p=setup(browser,base,seed)
 try:
  original=h.book(p);original_id=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-layouts.json','mimeType':'application/json','buffer':json.dumps(altered).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-four-parts]').wait_for();enter(p);click(p,'shelf')
  h.ok('this format cannot be opened' in p.locator(sel('root')).inner_text(),'unreadable and duplicate siblings stay accessible in Notes without blocking the shelf')
  click(p,'later');h.ok('Earlier layout 9' in p.locator(sel('root')).inner_text(),'pagination retains unreadable original indexes');click(p,'earlier');click(p,'card',old['id'])
  h.ok('Earlier <layout> & literal words' in p.locator('.fp-heading').inner_text(),'historical source title is literal and escaped')
  h.ok(p.locator(sel('case')).input_value()=='','historical source never advertises a live catalog replacement')
  click(p,'help','teaching');h.ok('Earlier teaching words stay literal.' in p.locator('.fp-help').inner_text() and 'cannot be drawn' in p.locator('.fp-help').inner_text(),'unreadable optional figure falls back locally to its frozen words')
  click(p,'close-help');click(p,'copy');stage(p,'build');click(p,'part','square');click(p,'count',1);click(p,'keep');last=sheets(p)[-1]
  h.ok(last['id']=='area-product-901' and last['source']==old['source'],'allocation reserves unreadable ids and copies its whole historical source')
  h.ok(last['work']['futureWork']==old['work']['futureWork'] and last['work']['pieces']['square']['futureTerm']==old['work']['pieces']['square']['futureTerm'],'copy/edit/Keep preserves additive work and term metadata')
  h.ok(sheets(p)[:-1]==altered['areaProducts'],'all old readable/unreadable/duplicate/raw rows stay exact')
  before=copy.deepcopy(h.book(p));identity=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');p.reload();p.locator('[data-equality-four-parts],[data-select-explorer]').first.wait_for()
  if p.locator('[data-select-explorer="'+identity+'"]').count():p.locator('[data-select-explorer="'+identity+'"]').click()
  p.locator('[data-equality-four-parts]').wait_for();h.ok(h.book(p)['areaProducts']==before['areaProducts'],'reload does not regrade or rewrite historical products')
  again=h.export_notes(p,'four-parts-redownload');h.ok(again['areaProducts']==before['areaProducts'] and again['syntheticOther']==altered['syntheticOther'],'actual redownload preserves all roots')
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+original_id+'"]').click();p.wait_for_function('id=>JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId===id',arg=original_id);h.ok(h.book(p)==original,'import/copy leaves the original explorer exact')
 finally:c.close()

def responsive(browser,base,seed):
 print('Four Parts: focused phone/landscape geometry and actual reset',flush=True)
 for width,height in [(320,600),(1024,768)]:
  c,p=setup(browser,base,seed,width,height)
  try:
   enter(p);bounds(p);p.locator(sel('kind',2)).focus();p.keyboard.press('Enter');h.ok('x²' in p.locator('.fp-chosen').inner_text(),'keyboard chooses a real tile kind')
   choose(p,'corner');stage(p,'build')
   for _ in range(6):click(p,'x',1)
   bounds(p);p.screenshot(path=str(OUT/f'large-{width}.png'),full_page=True)
   for _ in range(11):click(p,'x',-1)
   bounds(p);h.ok('1 cm' in p.locator('.fp-size').inner_text(),'smallest permitted picture remains explicit');p.screenshot(path=str(OUT/f'small-{width}.png'),full_page=True)
   click(p,'help','teaching')
   for _ in range(3):click(p,'teach-step',1)
   bounds(p);h.ok(p.locator('.fp-contrast').is_visible(),'the one-value contrast has a visible common-scale drawing');p.screenshot(path=str(OUT/f'contrast-{width}.png'),full_page=True);click(p,'close-help')
   click(p,'keep');old=p.locator(sel('copy')).element_handle();p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click();p.locator('[data-film-skip]').click();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-four-parts]').wait_for();enter(p)
   old.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok('areaProducts' not in h.book(p),'actual reset and stale controls cannot resurrect products')
  finally:c.close()

def saving_off(browser,base,seed):
 print('Four Parts: actual saving-off and Notes recovery',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-four-parts]').wait_for();before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');enter(p);label(p,'square',2,1);click(p,'keep')
  h.ok('download notes' in p.locator('#fp-status').inner_text().lower(),'actual save-off reports conditional file recovery')
  h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'save-off construction does not recreate stored notebooks')
  report=h.export_notes(p,'four-parts-saveoff');h.ok(report['areaProducts'][0]['work']['pieces']['square']=={'power':2,'count':1},'actual download recovers session-only work')
 finally:c.close()

def actual_refusal(browser,base,seed):
 print('Four Parts: real parent-preparation refusal and child bypass',flush=True)
 bounded=copy.deepcopy(seed);bounded['equalityDesk']['visits'][bounded['equalityDesk']['current']]['page']=0
 def nodes(x):return 1+sum(nodes(v) for v in (x.values() if isinstance(x,dict) else x if isinstance(x,list) else []))
 bounded['syntheticNodeBoundary']=[];bounded['syntheticNodeBoundary']=[None]*(200000-nodes(bounded)-1)
 c,p=setup(browser,base,bounded)
 try:
  h.ok('could not be opened safely' in p.locator('[data-equality-root]').inner_text().lower(),'unmodified actual app refuses parent preparation at the real shared limit')
  before=h.book(p);h.ok(before==bounded,'refused preparation leaves the exact full notebook intact');enter(p);label(p,'square',2,1);stage(p,'compare');h.ok(p.locator('.fp-comparison').count()==3,'child comparison remains available despite unrelated parent preparation refusal')
  h.ok(h.book(p)==before,'entry, construction and comparison make no hidden notebook changes');click(p,'keep');h.ok(h.book(p)==before and 'could not be kept safely' in p.locator('#fp-status').inner_text(),'actual Notes boundary refuses Keep atomically without erasing the construction')
 finally:c.close()

def isolated(browser,base,seed):
 print('Four Parts: labelled actual-UI identity, pending-word and stale-root harness',flush=True)
 c,p=setup(browser,base,seed)
 try:
  setup_js='''async config=>{const parent=await import('./equality-desk-ui.mjs'),child=await import('./four-parts-ui.mjs'),media=await import('./play-media.mjs'),core=await import('./core.mjs'),transfer=await import('./progress-transfer.mjs');const main=document.querySelector('main');main.replaceChildren();const h={book:structuredClone(config.seed),owner:'invented-owner',active:true,allow:true,saves:0};h.book.areaProducts=[];h.original=h.book;const report=c=>({title:'After the Storm: observations',exportedAt:'2026-11-05T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:core.recommendations(c),...c});h.render=()=>{main.innerHTML=parent.equalityPage(h.book,h.owner);parent.bindEquality(h.book,{notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,save:()=>{h.saves++;return{enabled:true,ok:true}},render:h.render,focus:s=>document.querySelector(s)?.focus(),canExport:c=>h.allow&&transfer.prepareProgressImport(JSON.stringify(report(c),null,2)).ok});media.bindSpeech()};if(!config.parent)child.openFourParts(h.book,h.owner);window.fpHarness=h;h.render()}'''
  def install(parent=False):p.evaluate(setup_js,{'seed':seed,'parent':parent});p.locator('[data-equality-root]' if parent else sel('root')).wait_for()
  def dispatch(el):el.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
  install(True);p.evaluate('fpHarness.allow=false');field=p.locator('[data-equality-field="note"]');field.fill('  Visible invented words refused by preflight.  ');field.evaluate('e=>window.fpPendingField=e');before=p.evaluate('JSON.stringify(fpHarness.book)');p.locator('[data-equality-four-parts]').click()
  h.ok(p.locator('[data-equality-root]').count()==1 and field.input_value()=='  Visible invented words refused by preflight.  ' and field.evaluate('e=>e===window.fpPendingField'),'rejected parent words and actual input identity survive a blocked child entry')
  h.ok(p.evaluate('JSON.stringify(fpHarness.book)')==before,'blocked parent navigation does not invent or erase saved data');p.evaluate('fpHarness.allow=true');field.fill('A retained parent explanation.');p.locator('[data-equality-four-parts]').click();p.locator(sel('root')).wait_for()
  install();label(p,'square',2,2);p.evaluate('fpHarness.allow=false');before=p.evaluate('JSON.stringify(fpHarness.book)');click(p,'keep');h.ok(p.evaluate('JSON.stringify(fpHarness.book)')==before and p.evaluate('fpHarness.saves')==0,'real Notes callback refusal leaves every root exact');h.ok('2x²' in p.locator('.fp-chosen').inner_text(),'refusal retains unkept construction');p.evaluate('fpHarness.allow=true');click(p,'keep');h.ok(p.evaluate('fpHarness.book.areaProducts[0].work.pieces.square.count')==2,'the same construction can be kept after refusal')
  for fault in ['owner','book','inactive','root-identity','root-bytes','control-ancestor','root-ancestor','hidden','outer-hidden','outer-aria-hidden','route']:
   install();old=p.locator(sel('keep')).element_handle()
   if fault=='owner':p.evaluate('fpHarness.owner="other-owner"')
   elif fault=='book':p.evaluate('fpHarness.book=structuredClone(fpHarness.book)')
   elif fault=='inactive':p.evaluate('fpHarness.active=false')
   elif fault=='root-identity':p.evaluate('fpHarness.book.areaProducts=[]')
   elif fault=='root-bytes':p.evaluate('fpHarness.book.areaProducts.push({opaque:"external"})')
   elif fault=='control-ancestor':old.evaluate('e=>{const p=e.parentNode,box=document.createElement("section");p.parentNode.append(box);box.append(p)}')
   elif fault=='root-ancestor':p.locator(sel('root')).evaluate('e=>{const box=document.createElement("section");e.parentNode.append(box);box.append(e)}')
   elif fault=='hidden':old.evaluate('e=>e.hidden=true')
   elif fault=='outer-hidden':p.locator('main').evaluate('e=>e.hidden=true')
   elif fault=='outer-aria-hidden':p.locator('main').evaluate('e=>e.setAttribute("aria-hidden","true")')
   elif fault=='route':p.evaluate('history.replaceState(null,"","#learn/math/equality/stale")')
   before=p.evaluate('JSON.stringify([fpHarness.original,fpHarness.book])');dispatch(old);h.ok(p.evaluate('JSON.stringify([fpHarness.original,fpHarness.book])')==before and p.evaluate('fpHarness.saves')==0,'stale '+fault+' Keep cannot change either notebook')
   if fault=='outer-hidden':p.locator('main').evaluate('e=>e.hidden=false')
   elif fault=='outer-aria-hidden':p.locator('main').evaluate('e=>e.removeAttribute("aria-hidden")')
   if fault=='route':p.evaluate('history.replaceState(null,"","#learn/math/equality")')
  install();label(p,'square',2,2);p.evaluate('fpHarness.book.areaProducts.push({opaque:"newer"})');click(p,'keep');h.ok(p.locator(sel('reopen')).is_visible(),'stale-root refusal offers an obvious view-only reopen');h.ok(p.locator(sel('reopen')).evaluate('e=>e===document.activeElement'),'stale-root recovery receives keyboard focus');p.keyboard.press('Tab');h.ok(not p.locator(sel('reopen')).evaluate('e=>e===document.activeElement'),'Tab can leave a stale root recovery control');click(p,'reopen');click(p,'keep');h.ok(p.evaluate('fpHarness.book.areaProducts[0].opaque')=='newer' and p.evaluate('fpHarness.book.areaProducts[1].work.pieces.square.count')==2,'reopen keeps both newer raw data and the waiting construction')
  install();click(p,'keep');p.evaluate('fpHarness.book.areaProducts[0].work.x=99');click(p,'back');click(p,'reopen');h.ok('Kept layouts' in p.locator('#fp-task').inner_text(),'an unreadable current card returns to its raw shelf');click(p,'back');h.ok(not p.locator(sel('root')).count(),'the raw shelf still allows returning to the parent')
  install();old_root=p.locator(sel('root')).element_handle();old_keep=p.locator(sel('keep')).element_handle();click(p,'back');old_root.evaluate('e=>document.querySelector("main").append(e)');before=p.evaluate('JSON.stringify(fpHarness.book)');dispatch(old_keep);h.ok(p.evaluate('JSON.stringify(fpHarness.book)')==before and p.evaluate('fpHarness.saves')==0,'reattached controls after Back remain inert even under the original ancestor')
  install();label(p,'square',2,2);p.evaluate('fpHarness.owner="second-invented-owner"');p.evaluate("async()=>{(await import('./four-parts-ui.mjs')).openFourParts(fpHarness.book,fpHarness.owner);fpHarness.render()}");label(p,'square',1,1);p.evaluate('fpHarness.owner="invented-owner"');p.evaluate("async()=>{(await import('./four-parts-ui.mjs')).openFourParts(fpHarness.book,fpHarness.owner);fpHarness.render()}");h.ok('2x²' in p.locator('.fp-chosen').inner_text(),'separate owner sessions preserve their own waiting drafts even on one book identity')
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
    report=journey(browser,base,seed);transfer(browser,base,seed,report);responsive(browser,base,seed);saving_off(browser,base,seed);actual_refusal(browser,base,seed);isolated(browser,base,seed)
    h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'base':base,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc())
    for ci,c in enumerate(browser.contexts):
     for pi,p in enumerate(c.pages):
      try:p.screenshot(path=str(OUT/f'failure-{ci}-{pi}.png'),full_page=True);(OUT/f'failure-{ci}-{pi}.html').write_text(p.content())
      except Exception:pass
    raise
   finally:browser.close()
 finally:server.shutdown();server.server_close()

if __name__=='__main__':main()
