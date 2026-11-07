"""Leaf accounts386: actual app construction and real Notes transfer.

One tablet journey plus narrow phone/wide geometry samples. A separate actual-UI
harness exercises otherwise unreachable context/preflight faults. Synthetic data
only; no physical iPad, audible-output or learning qualification.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('LEAF_ACCOUNTS_ARTIFACTS') or tempfile.mkdtemp(prefix='leaf-accounts-'));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('leaf_notes_helpers',ROOT/'test/writing-table-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h);h.OUT=OUT
ROUTE='#living/bodies'
def fixture():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{cellSource}from'./dist/cell-studio-content.mjs';import{newCellWork,keepCellModel}from'./dist/cell-studio-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={payload:'z'.repeat(512000),exact:{v:75}};const c=cellSource('leaf');keepCellModel(s,c,newCellWork(c),{canExport:()=>true});console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
def sel(k,v=None):return '[data-la-'+k+('="'+str(v)+'"' if v is not None else '')+']'
def click(p,k,v=None):p.locator(sel(k,v)+':visible').first.click()
def setup(browser,base,seed,width=820):
 c,p=h.setup(browser,base,seed,width=width);p.evaluate('location.hash="#living/bodies"');p.locator('[data-cs-leaf]').wait_for();return c,p
def enter(p):p.locator('[data-cs-leaf]').click();p.locator(sel('root')).wait_for()
def sheets(p):return h.book(p).get('leafAccounts',[])
def amount(p,id,n=1,d=1):
 for _ in range(n):click(p,'amount',id+':'+str(d))
def turn(p,id):click(p,'turn',id)
def count(p):turn(p,'read');click(p,'count')
def totals(p,used,made,diff):
 actual=[[int(p.locator(sel('total',side+':'+a)).inner_text().replace('−','-').replace('+','')) for a in 'CHO'] for side in ['used','made','difference']]
 h.ok(actual==[used,made,diff],'independent atom arithmetic '+str(actual))
def choose(p,id):
 d=p.locator('[data-la-chooser]')
 if d.get_attribute('open') is None:d.locator(':scope>summary').click()
 click(p,'case',id)
def open_sheet(p,id):
 click(p,'shelf')
 for _ in range(5):
  if p.locator(sel('card',id)).count():click(p,'card',id);return
  prev=p.locator(sel('page','-1'))
  if not prev.count() or prev.is_disabled():break
  prev.click()
 raise AssertionError('Missing saved sheet '+id)
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('[data-la-root] button,[data-la-root] select,[data-la-root] summary,[data-la-root] a').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'visible controls have44px targets and16px text: '+str(bad))
 small=p.locator('[data-la-root] p,[data-la-root] label,[data-la-atom]').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)')
 h.ok(not small,'visible instructions and atom letters remain16px: '+str(small))
 names=p.locator('[data-la-amount]').evaluate_all('xs=>xs.filter(x=>!(x.getAttribute("aria-label")||x.textContent).toLowerCase().includes(x.textContent.trim().toLowerCase())).map(x=>x.textContent)')
 h.ok(not names,'unit control accessible names retain visible wording')
def journey(browser,base,seed):
 print('Leaf accounts: ordinary app tablet journey',flush=True)
 c,p=setup(browser,base,seed)
 try:
  before=copy.deepcopy(h.book(p));enter(p)
  h.ok('leafAccounts' not in h.book(p) and not p.locator('[data-cs-host]').count(),'entry is session-only and does not masquerade as the legacy parent')
  bounds(p);click(p,'keep');first=copy.deepcopy(sheets(p)[0]);turn(p,'read')
  h.ok(first['work']['counts']==[] and not first['work']['countShown'] and not p.locator(sel('totals')).count(),'untouched construction stays empty with no hidden atom comparison')
  h.ok(p.locator(sel('count')).is_disabled() and p.locator(sel('reference')).is_disabled(),'read-only sheet cannot add support')
  click(p,'hear');h.ok(sheets(p)[0]==first,'read-only Hear leaves the exact original unchanged; no audibility claim')
  click(p,'copy');count(p);totals(p,[0,0,0],[0,0,0],[0,0,0]);h.ok('empty summary' in p.locator(sel('count-message')).inner_text(),'all-zero bookkeeping is explicitly an empty summary')
  turn(p,'make')
  for id in ['co2-in','water-in','glucose-out','oxygen-out']:amount(p,id)
  turn(p,'read');h.ok(not p.locator(sel('totals')).count(),'molecule edits clear the previously shown comparison');click(p,'count');totals(p,[1,2,3],[6,12,8],[5,10,5])
  turn(p,'make')
  for field in ['fromId','toId']:p.locator(sel('energy',field)).select_option('light')
  h.ok(p.locator(sel('selected-caption','toId')).inner_text()=='Light energy','Make renders the full selected energy caption')
  turn(p,'read');totals(p,[1,2,3],[6,12,8],[5,10,5]);click(p,'keep');unexpected=copy.deepcopy(sheets(p)[-1])
  h.ok(unexpected['work']['energy']=={'fromId':'light','toId':'light'},'unexpected energy captions stay literal and ungraded')
  click(p,'copy');turn(p,'make');amount(p,'co2-in',5);amount(p,'water-in',4);amount(p,'oxygen-out',5);count(p);totals(p,[6,10,17],[6,12,18],[0,2,1]);click(p,'keep');partial=copy.deepcopy(sheets(p)[-1])
  click(p,'copy');turn(p,'make');amount(p,'water-in');count(p);totals(p,[6,12,18],[6,12,18],[0,0,0]);h.ok('bookkeeping check' in p.locator(sel('count-message')).inner_text(),'matched atoms do not establish a biological process')
  click(p,'reference');d=p.locator('[data-la-fold="help"]');d.locator(':scope>summary').click();click(p,'example');h.ok(p.locator(sel('molecule','teaching')).count()==2,'manual teaching draws two separate water molecule groups');click(p,'keep');balanced=copy.deepcopy(sheets(p)[-1])
  h.ok(balanced['work']['energy']==unexpected['work']['energy'] and balanced['work']['referenceShown'],'reference remains separate from literal learner energy choices')
  click(p,'copy');turn(p,'make')
  for id,n in [('co2-in',6),('water-in',6),('glucose-out',1),('oxygen-out',6)]:amount(p,id,n)
  plus=p.locator(sel('amount','water-in:1'));h.ok(plus.is_disabled() and p.locator(sel('amount','oxygen-out:-1')).evaluate('e=>e===document.activeElement'),'upper coefficient boundary disables Plus and focuses the enabled opposite control')
  h.ok(p.locator(sel('coefficient','water-in')).inner_text()=='12' and p.locator(sel('formula','water')).first.inner_text()=='H2O' and p.locator(sel('molecule','water-in')).count()==3,'twelve whole water molecules retain H2O and bounded composition pictures')
  count(p);totals(p,[12,24,36],[12,24,36],[0,0,0]);click(p,'keep');kept=copy.deepcopy(sheets(p));h.ok(kept[:3]==[first,unexpected,partial],'later copies never overwrite earlier unfinished summaries')
  choose(p,'leaf-light');h.ok(all(x.inner_text()=='0' for x in p.locator(sel('coefficient')).all()),'a consumed Keep slot starts a genuinely fresh same-case construction')
  click(p,'back');p.locator('[data-cs-host]').wait_for();ret=p.locator('[data-la-return]');link=ret.locator('a').last;link.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok(p.evaluate('location.hash')==ROUTE,'closed return link cannot navigate programmatically');ret.locator(':scope>summary').click();h.ok(h.book(p)['cellModels']==before['cellModels'],'legacy return preserves the parent illustration')
  p.locator('[data-cs-enter]').click();p.locator('[data-cs-root]').wait_for();parent=p.locator('[data-cs-root]').inner_text();enter(p);choose(p,'leaf-respiration')
  for id,n in [('glucose-in',1),('oxygen-in',6),('co2-out',6),('water-out',6)]:amount(p,id,n)
  p.locator(sel('energy','fromId')).select_option('sugar');p.locator(sel('energy','toId')).select_option('activity-heat');count(p);totals(p,[6,12,18],[6,12,18],[0,0,0]);click(p,'keep');h.ok('cytoplasm' in sheets(p)[-1]['source']['location'] and 'mitochondria' in sheets(p)[-1]['source']['location'],'respiration keeps its distinct source-owned location without electing a reference')
  choose(p,'root-respiration');count(p);click(p,'reference');h.ok(all(x.inner_text()=='0' for x in p.locator(sel('coefficient')).all()),'reference does not fill the selected root construction');click(p,'keep');click(p,'back');p.locator('[data-cs-root]').wait_for()
  h.ok('Cell Studio' in parent and h.book(p)['cellModels']==before['cellModels'],'studio entry returns to its selected parent illustration without editing it')
  enter(p);p.screenshot(path=str(OUT/'tablet.png'),full_page=True)
  after=copy.deepcopy(h.book(p));all_saved=after.pop('leafAccounts');h.ok(after==before,'child construction and Keep preserve every unrelated root including large Notes and parent facts')
  report=h.export_notes(p,'leaf-accounts-kept');h.ok(report['leafAccounts']==all_saved,'actual Notes download preserves every frozen source/work pair');return report
 finally:c.close()

def history(report):
 r=copy.deepcopy(report);old=copy.deepcopy(r['leafAccounts'][0]);old.update(id='leaf-account-80',futureOuter={'keep':True});s=old['source'];s.update(id='old-source',title='Earlier <matter> & exact source',species=[{'id':'old:pair','label':'Earlier hydrogen/oxygen pair','atoms':{'C':0,'H':1,'O':1,'extra':'kept'}},{'id':'old:carbon','label':'Earlier carbon pair','atoms':{'C':2,'H':0,'O':0}}],slots=[{'id':'old:carbon-out','speciesId':'old:carbon','side':'out','referenceCount':0},{'id':'old:pair-in','speciesId':'old:pair','side':'in','referenceCount':2},{'id':'old:pair-out','speciesId':'old:pair','side':'out','referenceCount':2}],energyOptions=[{'id':'old:start','label':'Earlier start','description':'A retained caption.'},{'id':'old:finish','label':'Earlier finish','description':'Another retained caption.'}],energyReference={'fromId':'old:finish','toId':'old:start','note':'An earlier reference.'},teachingDemo={'speciesId':'old:pair','count':3},teaching=['Earlier groups use their own composition.'],futureSource={'keep':True})
 old['work']={'v':1,'counts':[{'slotId':'old:pair-out','count':1,'extra':'kept'},{'slotId':'old:pair-in','count':2}],'energy':{'fromId':'old:start','toId':None,'extra':'kept'},'countShown':True,'referenceShown':True,'exampleSeen':1,'futureWork':True}
 r['leafAccounts']=[{'id':'leaf-account-900','v':99,'raw':['kept']},old]+r['leafAccounts'];return r

def transfer(browser,base,seed,report):
 print('Leaf accounts: actual historical Notes transfer',flush=True)
 c,p=setup(browser,base,seed)
 try:
  altered=history(report);original=h.book(p);identity=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'synthetic-leaf.json','mimeType':'application/json','buffer':json.dumps(altered).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
  h.ok(p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')!=identity,'real import creates another explorer')
  p.evaluate('location.hash="#living/bodies"');p.locator('[data-cs-leaf]').wait_for();enter(p);h.ok(sheets(p)==altered['leafAccounts'],'own-source history and an unreadable reserved sibling import unchanged');open_sheet(p,'leaf-account-80');turn(p,'read');totals(p,[0,2,2],[0,1,1],[0,-1,-1])
  h.ok('Earlier <matter> & exact source' in p.locator(sel('root')).inner_text() and not p.locator('[data-la-root] matter').count(),'historical labels render as escaped literal text');h.ok(p.locator(sel('formula','old:pair')).first.inner_text()=='HO','historical composition generates its own formula')
  d=p.locator('[data-la-fold="help"]');d.locator(':scope>summary').click();h.ok(p.locator(sel('molecule','teaching')).count()==3 and p.locator('[data-la-molecule="teaching"] [data-la-atom="H"]').count()==3,'historical teaching resolves its own three H/O groups')
  old=copy.deepcopy(sheets(p)[1]);click(p,'copy');turn(p,'make');amount(p,'old:pair-out');p.locator(sel('energy','toId')).select_option('old:finish');count(p);totals(p,[0,2,2],[0,2,2],[0,0,0]);click(p,'keep');new=sheets(p)[-1]
  h.ok(new['id']=='leaf-account-901' and new['source']==old['source'] and sheets(p)[1]==old,'allocation respects unreadable IDs while copies preserve original source and sheet')
  h.ok(new['work']['counts'][0]['extra']=='kept' and new['work']['energy']['extra']=='kept' and new['work']['futureWork'],'copy edits retain unknown work and count fields')
  out=h.export_notes(p,'leaf-historical');h.ok(out['leafAccounts'][:-1]==altered['leafAccounts'] and out['syntheticOther']==original['syntheticOther'],'redownload preserves the original imported bytes and large unrelated Notes')
  h.ok(p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',identity)==original,'import and historical editing leave the first explorer exact')
 finally:c.close()

def samples(browser,base,seed):
 for width in [320,1024]:
  c,p=setup(browser,base,seed,width)
  try:
   enter(p);amount(p,'water-in');bounds(p);h.ok(p.locator('[data-la-atom="H"]').count()>0,'composition picture uses actual labelled atom groups');p.locator(sel('energy','toId')).select_option('activity-heat');caption=p.locator(sel('selected-caption','toId'));h.ok(caption.is_visible() and 'surroundings' in caption.inner_text(),'long selected energy caption is available outside the native select');p.screenshot(path=str(OUT/('phone.png' if width==320 else 'wide.png')),full_page=True)
  finally:c.close()

def storage(browser,base,seed):
 for fault in ['saving-off','quota-device-api']:
  c,p=setup(browser,base,seed)
  try:
   if fault=='saving-off':p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#living/bodies"');p.locator('[data-cs-leaf]').wait_for()
   enter(p);amount(p,'water-in');before=p.evaluate('JSON.stringify(localStorage)')
   if fault=='quota-device-api':p.evaluate('()=>{Storage.prototype.setItem=function(){throw new DOMException("Synthetic quota refusal","QuotaExceededError")};}')
   click(p,'keep');h.ok(p.evaluate('JSON.stringify(localStorage)')==before,fault+' Keep does not pretend to persist a failed or disabled save')
   out=h.export_notes(p,'leaf-'+fault);h.ok(out['leafAccounts'][-1]['work']['counts']==[{'slotId':'water-in','count':1}],fault+' actual Notes download recovers the kept in-memory construction')
  finally:c.close()

def isolated(browser,base,seed):
 print('Leaf accounts: explicitly isolated actual-UI context faults',flush=True)
 c,p=setup(browser,base,seed)
 try:
  js='''async seed=>{const parent=await import('./cell-studio-ui.mjs'),media=await import('./play-media.mjs');parent.resetCellStudio();history.replaceState(null,'','#living/bodies');const main=document.querySelector('main');main.hidden=false;main.removeAttribute('aria-hidden');const v={book:structuredClone(seed),owner:'synthetic-owner',active:true,allow:true,saves:0,renders:0};v.book.leafAccounts=[];v.original=v.book;v.render=()=>{v.renders++;main.innerHTML=parent.cellStudioPage(v.book,v.owner);parent.bindCellStudio(v.book,{notebook:()=>v.book,explorerId:()=>v.owner,isActive:()=>v.active,canExport:()=>v.allow,save:()=>{v.saves++;return{enabled:true,ok:true}},render:v.render,focus:s=>document.querySelector(s)?.focus()});media.bindSpeech()};window.laHarness=v;v.render()}'''
  def install():p.evaluate(js,seed);p.locator('[data-cs-leaf]').click();p.locator(sel('root')).wait_for();p.evaluate('laHarness.saves=0')
  def dispatch(e):e.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
  install();amount(p,'water-in');p.evaluate('laHarness.allow=false');before=p.evaluate('JSON.stringify(laHarness.book)');click(p,'keep');h.ok(p.evaluate('JSON.stringify(laHarness.book)')==before and p.evaluate('laHarness.saves')==0 and p.locator(sel('coefficient','water-in')).inner_text()=='1','preflight refusal preserves working words/counts and every notebook byte');p.evaluate('laHarness.allow=true');click(p,'keep');h.ok(p.evaluate('laHarness.book.leafAccounts.length')==1,'same refused construction remains keepable afterward')
  for fault in ['owner','book','inactive','root-identity','root-bytes','control-ancestor','root-ancestor','outer-hidden','outer-aria-hidden','route']:
   install();button=p.locator(sel('keep')).element_handle()
   scripts={'owner':'laHarness.owner="other-owner"','book':'laHarness.book=structuredClone(laHarness.book)','inactive':'laHarness.active=false','root-identity':'laHarness.book.leafAccounts=[]','root-bytes':'laHarness.book.leafAccounts.push({raw:"outside"})','outer-hidden':'document.querySelector("main").hidden=true','outer-aria-hidden':'document.querySelector("main").setAttribute("aria-hidden","true")','route':'history.replaceState(null,"","#living/bodies/stale")'}
   if fault=='control-ancestor':button.evaluate('e=>{const parent=e.parentNode,box=document.createElement("section");parent.parentNode.append(box);box.append(parent)}')
   elif fault=='root-ancestor':p.locator(sel('root')).evaluate('e=>{const box=document.createElement("section");e.parentNode.append(box);box.append(e)}')
   else:p.evaluate(scripts[fault])
   before=p.evaluate('JSON.stringify([laHarness.original,laHarness.book])');dispatch(button);h.ok(p.evaluate('JSON.stringify([laHarness.original,laHarness.book])')==before and p.evaluate('laHarness.saves')==0,'stale '+fault+' action stays inert')
  install();click(p,'keep');p.evaluate('laHarness.saves=0');button=p.locator(sel('copy')).element_handle();p.evaluate('laHarness.book.leafAccounts[0].source.title="Externally changed title"');before=p.evaluate('JSON.stringify(laHarness.book)');dispatch(button);h.ok(p.evaluate('JSON.stringify(laHarness.book)')==before and p.evaluate('laHarness.saves')==0,'in-place retained source change invalidates the captured copy action')
  install();root=p.locator(sel('root')).element_handle();button=p.locator(sel('keep')).element_handle();click(p,'back');root.evaluate('e=>document.querySelector("main").append(e)');before=p.evaluate('JSON.stringify(laHarness.book)');dispatch(button);h.ok(p.evaluate('JSON.stringify(laHarness.book)')==before and p.evaluate('laHarness.saves')==0,'reattached child controls remain inert after parent return')
 finally:c.close()

# This device API fixture captures requested speech text. It does not establish sound.
SPEECH_FIXTURE="""()=>{window.laSpoken=[];window.laStops=0;Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{name:'Synthetic local English',voiceURI:'synthetic-en',lang:'en-US',localService:true,default:true}],cancel:()=>window.laStops++,speak:u=>window.laSpoken.push(u.text),addEventListener(){},removeEventListener(){}}});Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text;}}});}"""
def hear(p,selector='[data-la-hear]'):
 before=p.evaluate('laSpoken.length');p.locator(selector).click();payload=p.locator(selector).get_attribute('data-speak');h.ok(p.evaluate('laSpoken.length')>before,'Hear reaches the labelled synthetic device speech API');return payload

def review_journey(browser,base,seed):
 print('Leaf accounts: review regressions for waiting drafts and visible narration',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(SPEECH_FIXTURE);enter(p);click(p,'keep');first=copy.deepcopy(sheets(p)[0]);choose(p,'leaf-light');amount(p,'water-in',3);open_sheet(p,first['id']);click(p,'copy');click(p,'keep');click(p,'draft')
  h.ok(p.locator(sel('coefficient','water-in')).inner_text()=='3','Your summary preserves a waiting leaf-light draft after a different copy is kept')
  count(p);click(p,'reference');d=p.locator('[data-la-fold="help"]');d.locator(':scope>summary').click();click(p,'example');d=p.locator('[data-la-fold="help"]');d.locator(':scope>summary').click();source=sheets(p)[0]['source'];turn(p,'make');payload=hear(p)
  h.ok(source['energyReference']['note'] not in payload and 'six fewer hydrogen atoms on the made side.' not in payload and source['teaching'][0] not in payload and source['about'] not in payload,'Make narration omits hidden Read reference/totals and closed help/About')
  turn(p,'read');payload=hear(p);h.ok(source['energyReference']['note'] in payload and 'fewer' in payload and p.evaluate('(s)=>laSpoken.at(-1).includes(s)',source['energyReference']['note']),'Read narration includes elected reference and shown atom differences')
  d=p.locator('[data-la-fold="help"]');d.locator(':scope>summary').click();payload=hear(p);h.ok(source['teaching'][0] in payload,'open Help narration includes the elected teaching frame');d.locator(':scope>summary').click();payload=hear(p);h.ok(source['teaching'][0] not in payload,'closing Help removes its frame from narration')
  d=p.locator('[data-la-fold="about"]');d.locator(':scope>summary').click();payload=hear(p);h.ok(source['about'] in payload,'open About narration includes the own-source caveat');d.locator(':scope>summary').click();payload=hear(p);h.ok(source['about'] not in payload,'closed About stays out of narration')
  click(p,'keep');record=copy.deepcopy(sheets(p)[-1]);payload=hear(p);h.ok(source['returnQuestion'] in payload and source['energyReference']['note'] in payload and sheets(p)[-1]==record,'kept narration retains elected support and return question without changing the record')
  click(p,'back');p.locator('[data-cs-enter]').click();p.locator('[data-cs-root]').wait_for();ret=p.locator('[data-la-return]')
  if ret.get_attribute('open') is not None:ret.locator(':scope>summary').click()
  payload=hear(p,'[data-cs-hear]');h.ok(source['returnQuestion'] not in payload,'parent Hear omits the closed return section');ret.locator(':scope>summary').click();payload=hear(p,'[data-cs-hear]');h.ok(source['returnQuestion'] in payload,'parent Hear includes the opened kept return section');ret.locator('a').click();p.wait_for_function('location.hash==="#living/plants"');h.ok(True,'the visible open Seedlings link navigates to its real destination')
 finally:c.close()

def review_faults(browser,base,seed):
 print('Leaf accounts: review regressions for non-Keep stale controls',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(SPEECH_FIXTURE)
  js="""async seed=>{const parent=await import('./cell-studio-ui.mjs'),media=await import('./play-media.mjs');parent.resetCellStudio();history.replaceState(null,'','#living/bodies');const main=document.querySelector('main');main.hidden=false;main.removeAttribute('aria-hidden');const v={book:structuredClone(seed),owner:'synthetic-owner',active:true,allow:true,saves:0,renders:0};v.book.leafAccounts=[];v.original=v.book;v.render=()=>{v.renders++;main.innerHTML=parent.cellStudioPage(v.book,v.owner);parent.bindCellStudio(v.book,{notebook:()=>v.book,explorerId:()=>v.owner,isActive:()=>v.active,canExport:()=>v.allow,save:()=>{v.saves++;return{enabled:true,ok:true}},render:v.render,focus:s=>document.querySelector(s)?.focus()});media.bindSpeech()};window.laHarness=v;v.render()}"""
  def install(child=True):
   p.evaluate(js,seed)
   if child:enter(p)
  def baseline():return p.evaluate('JSON.stringify([laHarness.original,laHarness.book,laHarness.saves,laHarness.renders,laSpoken,laStops])')
  def dispatch(e,event='click'):e.evaluate('(e,t)=>e.dispatchEvent(t==="click"?new MouseEvent(t,{bubbles:true,cancelable:true}):new Event(t,{bubbles:true,cancelable:true}))',event)
  # Speech is checked against every concrete external context fault; other action
  # families sample distinct guard seams rather than duplicating the entire matrix.
  for fault in ['owner','book','inactive','root-identity','root-bytes','control-ancestor','root-ancestor','outer-hidden','outer-aria-hidden','route','disabled']:
   install();e=p.locator(sel('hear')).element_handle();original=e.get_attribute('data-speak')
   scripts={'owner':'laHarness.owner="other-owner"','book':'laHarness.book=structuredClone(laHarness.book)','inactive':'laHarness.active=false','root-identity':'laHarness.book.leafAccounts=[]','root-bytes':'laHarness.book.leafAccounts.push({raw:"outside"})','outer-hidden':'document.querySelector("main").hidden=true','outer-aria-hidden':'document.querySelector("main").setAttribute("aria-hidden","true")','route':'history.replaceState(null,"","#living/bodies/stale")','disabled':'document.querySelector("[data-la-hear]").disabled=true'}
   if fault=='control-ancestor':e.evaluate('e=>{const x=document.createElement("section");e.parentNode.append(x);x.append(e)}')
   elif fault=='root-ancestor':p.locator(sel('root')).evaluate('e=>{const x=document.createElement("section");e.parentNode.append(x);x.append(e)}')
   else:p.evaluate(scripts[fault])
   before=baseline();dispatch(e);h.ok(baseline()==before and e.get_attribute('data-speak')==original,'stale '+fault+' Hear changes neither speech payload nor requested device speech')
  for action in ['energy','fold','amount','turn','case','card']:
   install()
   if action=='energy':e=p.locator(sel('energy','toId')).element_handle();e.evaluate('e=>e.value="light"');event='change'
   elif action=='fold':e=p.locator('[data-la-fold="about"]').element_handle();e.evaluate('e=>{laHarness.owner="another-owner";e.open=true;}');event='toggle'
   elif action=='amount':e=p.locator(sel('amount','water-in:1')).element_handle();event='click'
   elif action=='turn':e=p.locator(sel('turn','read')).element_handle();event='click'
   elif action=='case':p.locator('[data-la-chooser]>summary').click();e=p.locator(sel('case','root-respiration')).element_handle();event='click'
   else:click(p,'keep');click(p,'shelf');e=p.locator('[data-la-card]').first.element_handle();event='click'
   p.evaluate('laHarness.owner="another-owner"');before=baseline();dispatch(e,event);h.ok(baseline()==before,'stale owner '+action+' cannot edit, navigate, disclose or request speech')
   p.evaluate('laHarness.owner="synthetic-owner";laHarness.render()')
   if action=='energy':h.ok(p.locator(sel('energy','toId')).input_value()=='','stale energy change never entered the waiting work')
   if action=='fold':h.ok(p.locator('[data-la-fold="about"]').get_attribute('open') is None,'stale toggle never entered the waiting fold state')
  install();old=p.locator(sel('root')).element_handle();button=p.locator(sel('amount','water-in:1')).element_handle();choose(p,'root-respiration');old.evaluate('e=>document.querySelector("main").append(e)');p.wait_for_timeout(30);before=baseline();dispatch(button);h.ok(baseline()==before,'an actual case change invalidates reattached controls from the earlier case')
  install(False);button=p.locator('[data-cs-leaf]').element_handle();p.evaluate('laHarness.owner="another-owner"');before=baseline();dispatch(button);h.ok(baseline()==before and not p.locator(sel('root')).count(),'stale parent entry cannot open a child')
  install();click(p,'keep');click(p,'back');ret=p.locator('[data-la-return]').element_handle();ret.evaluate('e=>{laHarness.owner="another-owner";e.open=true;}');before=baseline();dispatch(ret,'toggle');h.ok(baseline()==before,'stale parent return toggle cannot update its session state');p.evaluate('laHarness.owner="synthetic-owner";laHarness.render()');h.ok(p.locator('[data-la-return]').get_attribute('open') is None,'parent return disclosure remains closed after a rejected external toggle')
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
    report=journey(browser,base,seed);transfer(browser,base,seed,report);samples(browser,base,seed);storage(browser,base,seed);isolated(browser,base,seed);review_journey(browser,base,seed);review_faults(browser,base,seed);h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:browser.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
