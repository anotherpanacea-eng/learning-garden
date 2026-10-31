"""Spec335 synthetic real-app journeys; physical Apple/audio/learning remain unqualified."""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('PIPS_COPY_ARTIFACTS',tempfile.mkdtemp(prefix='pips-copy-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,label):
 global checks
 assert value,label
 checks+=1
def eq(a,b,label):ok(a==b,label)
def fixture(code=''):
 script="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import * as P from './dist/pips-copy-core.mjs';import * as E from './dist/endings-shelf-core.mjs';import * as S from './dist/stained-map-core.mjs';import {canExportPips} from './test/pips-copy-checks.mjs';let s=initializeExplorerState(freshState());const o={canExport:canExportPips};"+code+';console.log(JSON.stringify(s));'
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
def book(p):return p.evaluate('window.pcBook()')
def tap(p,action,extra=''):p.locator('[data-pc-action="'+action+'"]'+extra).first.tap()
def table(p,name):tap(p,'table','[data-pc-table='+name+']')
def layout(p,label):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),label+' no overflow')
 small=p.locator('.pc-room button:visible,.pc-room a:visible,.pc-room select:visible,.pc-room summary:visible').evaluate_all("els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width<43.9||r.height<43.9}).map(e=>e.outerHTML.slice(0,100))")
 eq(small,[],label+' 44px controls '+str(small))
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-31T12:00:00.000Z'}]}
 c.add_init_script('(d=>{if(!localStorage.getItem("pc-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(d.seed));localStorage.setItem("pc-fixture","1");}window.pcSpoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,"speechSynthesis",{value:{getVoices:()=>[{name:"Fixture English",voiceURI:"fixture",lang:"en-US",localService:true}],addEventListener(){},removeEventListener(){},cancel(){},speak(u){window.pcSpoken.push(u.text);u.onstart?.();}}});const write=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.pcStorageFail&&k.startsWith("number-garden"))throw Error("Synthetic storage refusal");return write.call(this,k,v);};})('+json.dumps({'registry':registry,'seed':seed})+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body
  body=body.replace('let graph=null,','window.pcBook=()=>structuredClone(state);window.pcReplace=s=>{state=s;render();};let graph=null,',1)
  start=body.index('bindPipsCopy(state,{');end=body.index('});const notice=',start);chunk=body[start:end]
  route.fulfill(response=response,body=body[:start]+chunk.replace('canExport:candidate=>','canExport:candidate=>!window.pcRefuse&&')+body[end:])
 c.route('**/app.mjs',app);p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+'#library/copy',wait_until='networkidle');p.locator('[data-pips-copy-root]').wait_for();return c,p
KEY={'high':'high','advice':'advice','effect':'effect','led':'led'}
JOBS={'d1':'kneads','d2':'advice','d3':'effect','d4':'led','d5':'which'}
def run(browser,base):
 for width,height in [(320,600),(820,1000),(1024,768)]:
  seed=fixture();c,p=setup(browser,base,seed,width,height)
  try:
   eq(book(p),seed,'preview preserves notebook');layout(p,'arrival');table(p,'postcard');layout(p,'postcard')
   eq(p.locator('.pc-sentence strong').inner_text(),'high','original word is visible without a decision');eq(book(p)['pipsCopy']['postcard']['work']['placements']['high'],None,'untouched original is not a decision')
   tap(p,'place','[data-pc-choice=hi]');eq(p.locator('.pc-sentence strong').inner_text(),'hi','literal different word');ok(p.locator('[data-pc-choice=hi]').evaluate('e=>e===document.activeElement'),'tile focus');tap(p,'check');ok('Hi is a greeting' in p.locator('.pc-feedback').inner_text(),'sentence-specific feedback');tap(p,'keep');first=copy.deepcopy(book(p)['pipsCopy']['postcard']['firstKept'])
   p.locator('[data-pc-speak=postcard]').tap();spoken=' '.join(p.evaluate('window.pcSpoken'));ok('Each marked word will be read as blank.' in spoken and spoken.count('blank')==5,'introduction plus four whole-word blanks');ok('advise' not in spoken and 'affect' not in spoken and 'high' not in spoken,'narration excludes originals and trials')
   tap(p,'put-back');ok(p.locator('[data-pc-picker]').evaluate('e=>e===document.activeElement'),'clear focuses picker')
   for slot,word in KEY.items():p.locator('[data-pc-picker]').select_option(slot);tap(p,'place','[data-pc-choice='+word+']')
   tap(p,'check');eq(book(p)['pipsCopy']['postcard']['checks'][-1]['outcome'],'fit','all sentence decisions fit');tap(p,'keep');eq(book(p)['pipsCopy']['postcard']['firstKept'],first,'first keep immutable');p.screenshot(path=str(OUT/f'postcard-{width}.png'),full_page=True)
   p.locator('[data-pc-panel=original] summary').tap();ok('some advise' in p.locator('[data-pc-panel=original]').inner_text(),'original stays inspectable')
   p.locator('[data-pc-panel=keep-first] summary').tap();ok('hi' in p.locator('[data-pc-panel=keep-first] .pc-message').inner_text(),'kept literal trial');tap(p,'restore','[data-pc-edition=first]');eq(book(p)['pipsCopy']['postcard']['work'],first['work'],'reopen first copy');p.locator('[data-pc-panel=keep-latest] summary').tap();tap(p,'restore','[data-pc-edition=latest]')
   p.locator('[data-pc-panel=teach-card14] summary').tap();tap(p,'step','[data-pc-card=card14]');p.keyboard.press('Enter');eq(p.locator('[data-pc-panel=teach-card14] li').count(),2,'keyboard advances worked steps');p.keyboard.press('Enter');ok(p.locator('[data-pc-panel=teach-card14] .pc-teaching').evaluate('e=>e===document.activeElement'),'global endpoint focus')
   table(p,'practice')
   for job,choice in JOBS.items():
    tap(p,'job','[data-pc-job='+job+']');layout(p,job)
    if job=='d1':ok('Choose the one with k and ea.' in p.locator('.pc-room').inner_text(),'D1 guided cue before response')
    if job=='d5':p.evaluate('window.pcSpoken=[]');p.locator('[data-pc-speak=prompt]').tap();ok('Witch' not in ' '.join(p.evaluate('window.pcSpoken')),'prompt speech excludes choices')
    tap(p,'hint');tap(p,'example');eq(p.locator('.pc-worked li').count(),1,'actual example starts at first step');tap(p,'step');tap(p,'step');ok(p.locator('.pc-worked').evaluate('e=>e===document.activeElement'),'worked endpoint focus');tap(p,'step-back');tap(p,'step-back');tap(p,'step-back');ok(p.locator('.pc-worked').evaluate('e=>e===document.activeElement'),'worked zero-step focus')
    tap(p,'answer','[data-pc-choice='+choice+']');ok(p.locator('[data-pc-action=answer][data-pc-choice='+choice+']').evaluate('e=>e===document.activeElement'),'answer focus');tap(p,'check');eq(book(p)['pipsCopy']['items'][job]['checks'][-1]['outcome'],'fit',job+' fits');tap(p,'keep');tap(p,'put-back');ok(p.locator('[data-pc-action=answer]').first.evaluate('e=>e===document.activeElement'),'answer clear focus')
   p.screenshot(path=str(OUT/f'job-{width}.png'),full_page=True);held=copy.deepcopy(book(p)['pipsCopy']['items']['d5']);tap(p,'skip');eq(book(p)['pipsCopy']['currentId'],'d1','skip wraps');eq(book(p)['pipsCopy']['items']['d5'],held,'skip preserves current job')
   table(p,'postcard');eq(book(p)['pipsCopy']['postcard']['work']['placements'],KEY,'postcard survives table return')
   held=copy.deepcopy(book(p)['pipsCopy']);p.goto(base+'#notes');p.locator('#download').wait_for();eq(p.locator('[data-pips-copy-notes]').count(),1,'Notes has summary')
   with p.expect_download() as download:p.locator('#download').tap()
   file=OUT/f'notes-{width}.json';download.value.save_as(file);eq(json.loads(file.read_text())['pipsCopy'],held,'real notes download');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],held,'actual import');p.reload(wait_until='networkidle');p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],held,'reload preserves work')
  finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o)"))
 try:
  tap(p,'place','[data-pc-choice=high]');first=copy.deepcopy(book(p)['pipsCopy']);p.goto(base+'#notes')
  with p.expect_download() as download:p.locator('#download').tap()
  file=OUT/'second-owner.json';download.value.save_as(file);p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();tap(p,'place','[data-pc-choice=hi]');second=copy.deepcopy(book(p)['pipsCopy']);p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],first,'separate explorer work')
  p.goto(base+'#notes');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();ok('pipsCopy' not in book(p),'reset clears only active explorer');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],second,'second explorer survives reset')
 finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o);s.pipsCopy.source.postcard.slots=s.pipsCopy.source.postcard.slots.slice(0,2).reverse()"+";s.pipsCopy.source.postcard.segments=[{slotId:'advice'},{text:' / '},{slotId:'high'}];s.pipsCopy.source.postcard.slots[0].context={before:'Synthetic retained ',after:'.'}"))
 try:
  eq(p.locator('[data-pc-picker] option').all_text_contents(),["Dot's guidance",'The river'],'older source order retained');ok('Synthetic retained' in p.locator('.pc-sentence').inner_text(),'older source context used');tap(p,'place','[data-pc-choice=advice]');ok('advice' in p.locator('.pc-message').first.inner_text(),'older source playable')
 finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsJob(s,'d1',o);s.pipsCopy.items.d1.checks=[{}]"))
 try:ok('earlier work at this table' in ' '.join(p.locator('.pc-notice').all_text_contents()),'unreadable job checks explained')
 finally:c.close()
 for code in ["s.pipsCopy={v:99,raw:'Synthetic future'}","s.endingsShelf={v:99,raw:'Synthetic future'}"]:
  c,p=setup(browser,base,fixture(code))
  try:
   held=book(p)
   if 'pipsCopy' in held:ok('format this version cannot read' in p.locator('.pc-notice').inner_text(),'unsupported Pip notice');p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();p.locator('[data-es-table=letter]').tap();eq(book(p)['pipsCopy'],held['pipsCopy'],'sibling leaves unsupported Pip untouched')
   else:table(p,'postcard');eq(book(p)['endingsShelf'],held['endingsShelf'],'Pip leaves unsupported sibling untouched')
  finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  p.goto(base+'#library/spellings');p.locator('[data-stained-map-root]').wait_for();p.locator('[data-sm-table=map]').tap();p.locator('[data-sm-choice=gh]').tap();old=copy.deepcopy(book(p)['spellings']);p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();table(p,'postcard');tap(p,'place','[data-pc-choice=high]');eq(book(p)['spellings'],old,'Stained-first native entry intact')
 finally:c.close()
 for width in [320,820]:
  c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o);delete s.pipsCopy.source.postcard.slots[0].context;s.pipsCopy.source.postcard.slots[1].context=[]"),width,1000)
  try:ok('no separate sentence view' in p.locator('.pc-current').inner_text(),'old missing context explained');tap(p,'place','[data-pc-choice=high]');eq(book(p)['pipsCopy']['postcard']['work']['placements']['high'],'high','old context fallback playable');p.locator('[data-pc-picker]').select_option('advice');ok('no separate sentence view' in p.locator('.pc-current').inner_text(),'unreadable context explained');layout(p,'old context')
  finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o)"))
 try:
  before=book(p);p.evaluate('window.pcRefuse=true');tap(p,'place','[data-pc-choice=high]');eq(book(p),before,'preflight atomic');ok('unchanged' in p.locator('#pc-status').inner_text(),'refusal visible');p.evaluate('window.pcRefuse=false')
  p.evaluate('const e=document.querySelector("[data-pc-choice=high]");e.style.display="none";e.click()');eq(book(p),before,'hidden writer inert');p.evaluate('document.querySelector("[data-pc-choice=high]").style.display=""')
  p.evaluate('window.pcStale=document.querySelector("[data-pc-choice=high]");window.pcStaleSpeech=document.querySelector("[data-pc-speak=postcard]")');tap(p,'place','[data-pc-choice=hi]');held=book(p);p.evaluate('window.pcSpoken=[];window.pcStale.click();window.pcStaleSpeech.click()');eq(book(p),held,'stale writer inert');eq(p.evaluate('window.pcSpoken'),[],'stale speech inert')
  p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";document.body.append(d);d.showModal();window.pcSpoken=[];document.querySelector("[data-pc-choice=high]").click();document.querySelector("[data-pc-speak=postcard]").click()');eq(book(p),held,'film blocks writer');eq(p.evaluate('window.pcSpoken'),[],'film blocks speech');p.evaluate('document.querySelector("dialog.welcome-film").remove()')
  p.locator('[data-pc-choice=high]').focus();p.keyboard.press('Enter');eq(book(p)['pipsCopy']['postcard']['work']['placements']['high'],'high','keyboard placement')
  p.evaluate('window.pcStorageFail=true');tap(p,'place','[data-pc-choice=hi]');ok('could not be saved reliably' in p.locator('[data-pc-saving]').inner_text(),'host failure beside work');ok(p.locator('[data-pc-choice=hi]').evaluate('e=>e===document.activeElement'),'save warning preserves focus')
 finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o);s.pipsCopy.source.postcard.slots.push({...s.pipsCopy.source.postcard.slots[0],clue:17});s.pipsCopy.postcard.work.placements.high={future:'opaque'}"))
 try:
  eq(p.locator('[data-pc-picker] option').count(),3,'ambiguous word omitted');ok('earlier word unavailable' in p.locator('.pc-message').first.inner_text(),'unavailable segment preserved');tap(p,'place','[data-pc-choice=advice]');tap(p,'keep');eq(book(p)['pipsCopy']['postcard']['work']['placements']['high'],{'future':'opaque'},'opaque placement survives');p.screenshot(path=str(OUT/'partial-postcard.png'),full_page=True)
 finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  table(p,'postcard');tap(p,'place','[data-pc-choice=high]');kept=copy.deepcopy(book(p)['pipsCopy']);p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();p.locator('[data-es-table=letter]').tap();p.locator('[data-es-choice=cious]').tap();endings=copy.deepcopy(book(p)['endingsShelf']);eq(book(p)['pipsCopy'],kept,'Pip-first leaves Pip root');p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();tap(p,'place','[data-pc-choice=hi]');eq(book(p)['endingsShelf'],endings,'sibling root stays intact');p.goto(base+'#notes');p.locator('#remember').uncheck();p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();tap(p,'place','[data-pc-choice=high]');ok('only while this page stays open' in p.locator('[data-pc-saving]').inner_text(),'save-off warning');held=copy.deepcopy(book(p)['pipsCopy']);p.goto(base+'#notes')
  with p.expect_download() as download:p.locator('#download').tap()
  file=OUT/'save-off.json';download.value.save_as(file);eq(json.loads(file.read_text())['pipsCopy'],held,'save-off real download')
 finally:c.close()
 eq(errors,[],'no page errors')
if __name__=='__main__':
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128
 class Handler(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=Server(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as pw:
   chrome=os.environ.get('CHROME_PATH');mac='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
   if not chrome and Path(mac).exists():chrome=mac
   browser=pw.chromium.launch(headless=True,**({'executable_path':chrome} if chrome else {}))
   try:run(browser,f'http://127.0.0.1:{server.server_port}/')
   finally:browser.close()
 finally:server.shutdown()
 print(f'Pip’s Copy browser checks: {checks} passed. Synthetic artifacts: {OUT}')
