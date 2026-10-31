"""Spec330 synthetic Chromium journeys, including actual Notes download/import.
No physical iPad, audible-voice or learning qualification is implied.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('STAINED_MAP_ARTIFACTS',tempfile.mkdtemp(prefix='stained-map-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,label):
 global checks
 assert value,label
 checks+=1
def eq(a,b,label):ok(a==b,label)
def fixture(code=''):
 script="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import {pageOne} from './test/act-two-checks.mjs';import * as S from './dist/stained-map-core.mjs';import {canExportStained} from './test/stained-map-checks.mjs';let s=initializeExplorerState(freshState());const o={canExport:canExportStained};"+code+';console.log(JSON.stringify(s));'
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
def book(p):return p.evaluate('window.smBook()')
def tap(p,action,extra=''):p.locator('[data-sm-action="'+action+'"]'+extra).first.tap()
def table(p,kind):tap(p,'table','[data-sm-table="'+kind+'"]')
def layout(p,label):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),label+' no overflow')
 small=p.locator('.sm-room button:visible,.sm-room a:visible,.sm-room select:visible,.sm-room summary:visible').evaluate_all("els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width<43.9||r.height<43.9}).map(e=>e.outerHTML.slice(0,100))")
 eq(small,[],label+' 44px controls '+str(small))
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-31T12:00:00.000Z'}]}
 c.add_init_script('(d=>{if(!localStorage.getItem("sm-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(d.seed));localStorage.setItem("sm-fixture","1");}window.smSpoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,"speechSynthesis",{value:{getVoices:()=>[{name:"Fixture English",voiceURI:"fixture",lang:"en-US",localService:true}],addEventListener(){},removeEventListener(){},cancel(){},speak(u){window.smSpoken.push(u.text);u.onstart?.();}}});const write=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.smStorageFail&&k.startsWith("number-garden"))throw Error("Synthetic storage refusal");return write.call(this,k,v);};})('+json.dumps({'registry':registry,'seed':seed})+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body
  body=body.replace('let graph=null,','window.smBook=()=>structuredClone(state);window.smReplace=s=>{state=s;render();};let graph=null,',1)
  start=body.index('bindStainedMap(state,{');end=body.index('});const notice=',start);chunk=body[start:end]
  body=body[:start]+chunk.replace('canExport:candidate=>','canExport:candidate=>!window.smRefuse&&')+body[end:]
  route.fulfill(response=response,body=body)
 c.route('**/app.mjs',app);p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+'#library/spellings',wait_until='networkidle');p.locator('[data-stained-map-root]').wait_for();return c,p
def run(browser,base):
 for width,height in [(320,700),(820,1000),(1024,768)]:
  seed=fixture();c,p=setup(browser,base,seed,width,height)
  try:
   eq(book(p),seed,'entry preserves all roots');eq(p.locator('dialog.welcome-film[open]').count(),0,'direct route has optional arrival');layout(p,'arrival')
   table(p,'map');layout(p,'map');eq(p.locator('.sm-name').inner_text(),'Hi▢▢ Ford','first label stained')
   tap(p,'place','[data-sm-choice=k]');ok(p.locator('[data-sm-choice=k]').evaluate('e=>e===document.activeElement'),'tile keeps keyboard focus');eq(p.locator('.sm-name').inner_text(),'Hik Ford','literal wrong tile');tap(p,'check');ok('Hi▢▢ Ford:' in p.locator('.sm-feedback').inner_text(),'whole-map original-label feedback')
   tap(p,'place','[data-sm-choice=gh]');eq(p.locator('.sm-name').inner_text(),'High Ford','two-letter tile');tap(p,'keep');first=copy.deepcopy(book(p)['spellings']['benches']['map']['firstKept'])
   p.locator('[data-sm-picker]').select_option('knoll');eq(p.locator('.sm-name').inner_text(),'▢noll Wood','next label retains untouched stain');ok('Once written cnoll.' in p.locator('.sm-written-note').inner_text(),'written source visible')
   tap(p,'place','[data-sm-choice=gh]');eq(p.locator('.sm-name').inner_text(),'Ghnoll Wood','only first letter capitalized');tap(p,'place','[data-sm-choice=k]')
   for label,tile in [('writing','w'),('gnat','g'),('lamb','b'),('thistle','t'),('island','s'),('sponge','none')]:
    p.locator('[data-sm-picker]').select_option(label);tap(p,'place','[data-sm-choice='+tile+']')
   tap(p,'check');eq(book(p)['spellings']['benches']['map']['checks'][-1]['outcome'],'fit','whole map fit');tap(p,'keep');eq(book(p)['spellings']['benches']['map']['firstKept'],first,'immutable first keep')
   p.screenshot(path=str(OUT/f'map-{width}.png'),full_page=True)
   p.locator('[data-sm-panel=keep-first] summary').tap();tap(p,'inspect','[data-sm-edition=first]');ok('Not chosen yet' in p.locator('[data-sm-panel=keep-first]').inner_text(),'inspect incomplete version');tap(p,'restore','[data-sm-edition=first]');eq(book(p)['spellings']['benches']['map']['work'],first['work'],'reopen copy')
   table(p,'histories');layout(p,'histories');p.locator('[data-sm-picker]').select_option('island');tap(p,'place','[data-sm-choice=added]');ok('island — Added by writers' in p.locator('.sm-placements').inner_text(),'every history placement remains visible');tap(p,'keep');table(p,'families');layout(p,'families');p.locator('[data-sm-panel=family-sign] summary').tap();ok('sign → signal' in p.locator('.sm-written-note').inner_text(),'family teaching stays beside work');p.locator('[data-speak]').tap();family_spoken=' '.join(p.evaluate('window.smSpoken'));ok('→' not in family_spoken and 'signal' not in family_spoken,'family response note excluded from narration');tap(p,'place','[data-sm-choice=signal]');tap(p,'check');tap(p,'keep')
   table(p,'practice')
   for job,key in [('a1','gh'),('a2',{'knife':'once','write':'once','island':'added','debt':'added'}),('a3','island'),('a4','signal'),('a5',{'statement-1':'false','statement-2':'true','statement-3':'true'})]:
    tap(p,'job','[data-sm-job='+job+']');layout(p,job);tap(p,'hint');tap(p,'example');ok(p.locator('.sm-worked li').count()>=1,job+' example includes worked steps');
    if job=='a3':ok('writers added the s later' in p.locator('.sm-job-notes').inner_text(),'A3 written notes visible')
    if isinstance(key,dict):
     for part,choice in key.items():
      tap(p,'select-job','[data-sm-part='+part+']');ok(p.locator('[data-sm-action=select-job][data-sm-part='+part+']').evaluate('e=>e===document.activeElement'),'part focus retained');tap(p,'answer','[data-sm-choice='+choice+']');ok(p.locator('[data-sm-action=answer][data-sm-choice='+choice+']').evaluate('e=>e===document.activeElement'),'answer focus retained')
    else:tap(p,'answer','[data-sm-choice='+key+']')
    tap(p,'check');eq(book(p)['spellings']['items'][job]['checks'][-1]['outcome'],'fit',job+' fit');tap(p,'keep')
   p.screenshot(path=str(OUT/f'job-{width}.png'),full_page=True)
   tap(p,'skip');eq(book(p)['spellings']['currentId'],'a1','skip wraps without losing work')
   # Explicit visible prose narration excludes offered responses.
   tap(p,'job','[data-sm-job=a4]');p.locator('[data-speak]').tap();spoken=' '.join(p.evaluate('window.smSpoken'));ok('singer' not in spoken and 'signing' not in spoken,'no answer choices narrated')
   p.locator('[data-sm-panel=story] summary').tap();tap(p,'longer');p.locator('[data-speak]').tap();spoken=' '.join(p.evaluate('window.smSpoken'));ok('two stained letters' in spoken and 'one stained letter' in spoken and '▢' not in spoken,'spoken stains use ordinary phrases')
   kept=copy.deepcopy(book(p)['spellings']);p.goto(base+'#notes');p.locator('#download').wait_for();ok(p.locator('[data-stained-map-notes]').count()==1,'Notes summary')
   with p.expect_download() as download:p.locator('#download').tap()
   file=OUT/f'notes-{width}.json';download.value.save_as(file);eq(json.loads(file.read_text())['spellings'],kept,'actual Notes retains all work')
   p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.goto(base+'#library/spellings');p.locator('[data-stained-map-root]').wait_for();eq(book(p)['spellings'],kept,'actual import retains all work');p.reload(wait_until='networkidle');p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-stained-map-root]').wait_for();eq(book(p)['spellings'],kept,'reload')
  finally:c.close()
 # Source-owned older words/order, keyboard operation and hidden controls.
 c,p=setup(browser,base,fixture("S.openStainedTable(s,'map',o);s.spellings.source.labels=s.spellings.source.labels.slice(0,2).reverse();s.spellings.source.labels[0].before='Synthetic ';s.spellings.source.labels[0].note='A retained written note.';s.spellings.benches.map.work={placements:{knoll:null,high:null}}"))
 try:
  eq(p.locator('[data-sm-picker] option').all_text_contents(),['Synthetic ▢noll Wood','Hi▢▢ Ford'],'retained source order and wording');ok('retained written note' in p.locator('.sm-written-note').inner_text(),'retained note')
  p.locator('[data-sm-choice=k]').focus();p.keyboard.press('Enter');ok(p.locator('[data-sm-choice=k]').evaluate('e=>e===document.activeElement'),'keyboard focus remains at tile');eq(book(p)['spellings']['benches']['map']['work']['placements']['knoll'],'k','keyboard tile')
  tap(p,'check');last=copy.deepcopy(book(p)['spellings']['benches']['map']['checks']);p.locator('[data-sm-picker]').select_option('high');eq(book(p)['spellings']['benches']['map']['checks'],last,'selection-only navigation preserves check');ok('earlier version' not in p.locator('.sm-feedback').inner_text(),'selection does not mark earlier check')
  table(p,'practice');tap(p,'job','[data-sm-job=a1]');held=book(p);p.evaluate('document.querySelector("[data-sm-action=step]").click()');eq(book(p),held,'closed teaching button inert')
 finally:c.close()
 # Two owners, one reset, save-off in-memory work and actual download.
 c,p=setup(browser,base,fixture("S.openStainedTable(s,'map',o)"))
 try:
  tap(p,'place','[data-sm-choice=gh]');first=copy.deepcopy(book(p)['spellings']);p.goto(base+'#notes')
  with p.expect_download() as d:p.locator('#download').tap()
  file=OUT/'second-owner.json';d.value.save_as(file);p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.goto(base+'#library/spellings');p.locator('[data-stained-map-root]').wait_for()
  tap(p,'place','[data-sm-choice=k]');second=copy.deepcopy(book(p)['spellings']);p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-stained-map-root]').wait_for();eq(book(p)['spellings'],first,'first owner unchanged by second')
  p.goto(base+'#notes');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.goto(base+'#library/spellings');p.locator('[data-stained-map-root]').wait_for();ok('spellings' not in book(p),'one owner reset returns pure preview')
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();p.locator('[data-stained-map-root]').wait_for();eq(book(p)['spellings'],second,'reset leaves second owner intact')
  p.goto(base+'#notes');p.locator('#remember').uncheck();p.goto(base+'#library/spellings');p.locator('[data-stained-map-root]').wait_for();tap(p,'place','[data-sm-choice=gh]');ok('only while this page stays open' in p.locator('[data-sm-saving]').inner_text(),'save-off notice near work');ok(p.evaluate('!Object.keys(localStorage).some(k=>k.startsWith("number-garden-v1"))'),'save-off recreates no saved notebook')
  held=copy.deepcopy(book(p)['spellings']);p.goto(base+'#notes')
  with p.expect_download() as d:p.locator('#download').tap()
  file=OUT/'save-off.json';d.value.save_as(file);eq(json.loads(file.read_text())['spellings'],held,'save-off actual download retains working copy')
 finally:c.close()
 # Capacity, stale controls and film guards apply to every writer via the common binder.
 c,p=setup(browser,base,fixture("S.openStainedTable(s,'map',o)"))
 try:
  before=book(p);p.evaluate('window.smRefuse=true');tap(p,'place','[data-sm-choice=gh]');eq(book(p),before,'actual preflight refusal atomic');ok('unchanged' in p.locator('#sm-status').inner_text(),'refusal visible');p.evaluate('window.smRefuse=false');held=book(p);p.evaluate('const b=document.querySelector("[data-sm-choice=gh]");b.style.display="none";b.click()');eq(book(p),held,'CSS-hidden control inert');p.evaluate('document.querySelector("[data-sm-choice=gh]").style.display=""')
  p.evaluate('window.smStale=document.querySelector("[data-sm-choice=gh]")');tap(p,'place','[data-sm-choice=k]');held=book(p);p.evaluate('window.smStale.click()');eq(book(p),held,'detached callback inert')
  p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";document.body.append(d);d.showModal();document.querySelector("[data-sm-choice=gh]").click()');eq(book(p),held,'open film blocks writer');p.evaluate('document.querySelector("dialog.welcome-film").remove()')
  p.locator('[data-sm-panel=teach-card-1] summary').tap();tap(p,'step');ok('Say knoll.' in p.locator('[data-sm-panel=teach-card-1]').inner_text(),'first worked step');tap(p,'step');ok('Once written cnoll.' in p.locator('[data-sm-panel=teach-card-1]').inner_text(),'second worked step')
  p.evaluate('window.smStorageFail=true');tap(p,'place','[data-sm-choice=gh]');ok('could not be saved reliably' in p.locator('[data-sm-saving]').inner_text(),'persistent write warning near game');eq(book(p)['spellings']['benches']['map']['work']['placements']['high'],'gh','failed storage retains in-memory work')
 finally:c.close()
 for code,notice in [("s.spellings={v:99,raw:'Synthetic future'}",'format this version cannot read'),("S.openStainedTable(s,'map',o);s.spellings.benches.map.work={future:true}",'cannot be read here')]:
  c,p=setup(browser,base,fixture(code))
  try:
   held=book(p);ok(notice in p.locator('.sm-room').inner_text(),'unreadable notice');eq(book(p),held,'read-only malformed work');
   if held['spellings']['v']==1:table(p,'histories');ok(p.locator('[data-sm-picker]').count()==1,'readable sibling stays open')
  finally:c.close()
 c,p=setup(browser,base,fixture("S.openStainedJob(s,'a1',o);s.spellings.items.a2={source:null};s.spellings.source.labels.push({...s.spellings.source.labels[0],note:17})"))
 try:
  tap(p,'skip');eq(book(p)['spellings']['currentId'],'a3','skip goes to next readable job');table(p,'map');ok('not available here' in p.locator('.sm-notice').inner_text(),'partial source omission flagged')
 finally:c.close()
 c,p=setup(browser,base,fixture('s=pageOne()'))
 try:
  before=book(p);ok('annotated' not in p.locator('.sm-arrival').inner_text(),'no invented narrative');ok('librarian wrote these place-name labels' in p.locator('.sm-arrival').inner_text(),'tracing caption after real Page1');eq(book(p),before,'story read never changes page');table(p,'map');ok('librarian wrote these place-name labels' in p.locator('.sm-room').inner_text(),'tracing caption stays on map table')
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
 print(f'Stained Map browser checks: {checks} passed. Synthetic artifacts: {OUT}')
