"""Spec331 synthetic real-app journeys; physical Apple/audio/learning remain unqualified."""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('ENDINGS_SHELF_ARTIFACTS',tempfile.mkdtemp(prefix='endings-shelf-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,label):
 global checks
 assert value,label
 checks+=1
def eq(a,b,label):ok(a==b,label)
def fixture(code=''):
 script="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import * as E from './dist/endings-shelf-core.mjs';import * as S from './dist/stained-map-core.mjs';import {canExportEndings} from './test/endings-shelf-checks.mjs';let s=initializeExplorerState(freshState());const o={canExport:canExportEndings};"+code+';console.log(JSON.stringify(s));'
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
def book(p):return p.evaluate('window.esBook()')
def tap(p,action,extra=''):p.locator('[data-es-action="'+action+'"]'+extra).first.tap()
def table(p,name):tap(p,'table','[data-es-table='+name+']')
def layout(p,label):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),label+' no overflow')
 small=p.locator('.es-room button:visible,.es-room a:visible,.es-room select:visible,.es-room summary:visible').evaluate_all("els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width<43.9||r.height<43.9}).map(e=>e.outerHTML.slice(0,100))")
 eq(small,[],label+' 44px controls '+str(small))
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-31T12:00:00.000Z'}]}
 c.add_init_script('(d=>{if(!localStorage.getItem("es-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(d.seed));localStorage.setItem("es-fixture","1");}window.esSpoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,"speechSynthesis",{value:{getVoices:()=>[{name:"Fixture English",voiceURI:"fixture",lang:"en-US",localService:true}],addEventListener(){},removeEventListener(){},cancel(){},speak(u){window.esSpoken.push(u.text);u.onstart?.();}}});const write=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.esStorageFail&&k.startsWith("number-garden"))throw Error("Synthetic storage refusal");return write.call(this,k,v);};})('+json.dumps({'registry':registry,'seed':seed})+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body
  body=body.replace('let graph=null,','window.esBook=()=>structuredClone(state);window.esReplace=s=>{state=s;render();};let graph=null,',1)
  start=body.index('bindEndingsShelf(state,{');end=body.index('});const notice=',start);chunk=body[start:end]
  route.fulfill(response=response,body=body[:start]+chunk.replace('canExport:candidate=>','canExport:candidate=>!window.esRefuse&&')+body[end:])
 c.route('**/app.mjs',app);p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+'#library/endings',wait_until='networkidle');p.locator('[data-endings-shelf-root]').wait_for();return c,p
KEY={'precious':'cious','official':'cial','essential':'tial','significant':'ant','possible':'ible','cautious':'tious','comfortable':'able'}
JOBS={'b1':'spacious','b2':'cautious','b3':'partial','b4':'magnificent','b5':'dependable','b6':'terribly'}
def run(browser,base):
 for width,height in [(320,700),(820,1000),(1024,768)]:
  seed=fixture();c,p=setup(browser,base,seed,width,height)
  try:
   eq(book(p),seed,'arrival preserves all roots');eq(p.locator('dialog.welcome-film[open]').count(),0,'arrival film optional');layout(p,'arrival')
   table(p,'letter');layout(p,'letter');eq(p.locator('.es-word').inner_text(),'pre[ending]','initial word blank')
   tap(p,'place','[data-es-choice=tious]');eq(p.locator('.es-word').inner_text(),'pretious','literal wrong ending');ok(p.locator('[data-es-choice=tious]').evaluate('e=>e===document.activeElement'),'tile focus stays');tap(p,'check');ok('pre[ending]: Precious is one to learn by heart.' in p.locator('.es-feedback').inner_text(),'source-addressed feedback');tap(p,'keep');first=copy.deepcopy(book(p)['endingsShelf']['letter']['firstKept'])
   p.locator('[data-es-speak=letter]').tap();spoken=' '.join(p.evaluate('window.esSpoken'));ok('blank for each word' in spoken and 'We have a blank map' in spoken,'declared whole-word blank narration');ok('pretious' not in spoken and 'precious' not in spoken and '[ending]' not in spoken,'letter speech excludes response and prefix')
   tap(p,'put-back');ok(p.locator('[data-es-picker]').evaluate('e=>e===document.activeElement'),'clear returns focus to picker')
   for word,ending in KEY.items():p.locator('[data-es-picker]').select_option(word);tap(p,'place','[data-es-choice='+ending+']')
   tap(p,'check');eq(book(p)['endingsShelf']['letter']['checks'][-1]['outcome'],'fit','all letter gaps fit');tap(p,'keep');eq(book(p)['endingsShelf']['letter']['firstKept'],first,'first keep unchanged');p.screenshot(path=str(OUT/f'letter-{width}.png'),full_page=True)
   p.locator('[data-es-panel=keep-first] summary').tap();tap(p,'inspect','[data-es-edition=first]');ok('pretious' in p.locator('[data-es-panel=keep-first]').inner_text(),'inspect literal earlier trial');tap(p,'restore','[data-es-edition=first]');eq(book(p)['endingsShelf']['letter']['work'],first['work'],'reopen earlier work');p.locator('[data-es-panel=keep-latest] summary').tap();tap(p,'restore','[data-es-edition=latest]')
   table(p,'pairs');held=book(p)
   for front,back in [('observant','observance'),('innocent','innocence'),('reasonable','reasonably'),('visible','visibly')]:
    p.locator('[data-es-pair-picker]').select_option(front);tap(p,'turn');eq(p.locator('.es-pair-card>span').first.inner_text(),back,'pair flips');layout(p,'pair');eq(book(p),held,'pair turn creates no assessment or persistence')
   p.locator('[data-es-panel=visible-fact] summary').tap();p.evaluate('window.esSpoken=[]');p.locator('[data-es-speak=prompt]').tap();spoken=' '.join(p.evaluate('window.esSpoken'));ok('Spanish' not in spoken and 'French' not in spoken,'foreign fact excluded from narration');p.screenshot(path=str(OUT/f'pairs-{width}.png'),full_page=True)
   table(p,'letter');eq(book(p)['endingsShelf']['letter']['work']['placements'],KEY,'waiting letter preserved');table(p,'pairs');eq(p.locator('.es-pair-card>span').first.inner_text(),'visibly','pair side survives table return')
   table(p,'letter');p.locator('[data-es-panel=teach-card-5] summary').tap();tap(p,'step','[data-es-card=card-5]');p.keyboard.press('Enter');eq(p.locator('[data-es-panel=teach-card-5] li').count(),2,'repeated Enter advances teaching instead of closing it');p.keyboard.press('Enter');ok(p.locator('[data-es-panel=teach-card-5] .es-teaching').evaluate('e=>e===document.activeElement'),'global last-step focus');tap(p,'step-back','[data-es-card=card-5]');p.keyboard.press('Enter');p.keyboard.press('Enter');eq(p.locator('[data-es-panel=teach-card-5] li').count(),0,'global example at step zero');ok(p.locator('[data-es-panel=teach-card-5] .es-teaching').evaluate('e=>e===document.activeElement'),'global step-zero focus');table(p,'practice')
   for job,choice in JOBS.items():
    tap(p,'job','[data-es-job='+job+']');layout(p,job);eq(p.locator('[data-es-panel^=teach-]').count(),0,'job teaching is available through requested example only')
    if job=='b4':ok('The c in this word sounds soft, as in city.' in p.locator('.es-room').inner_text(),'B4 premise visible')
    if job=='b1':ok('The root is space.' in p.locator('.es-room').inner_text(),'guided steps before answer')
    tap(p,'hint');tap(p,'example');eq(p.locator('.es-worked li').count(),1,'new job example starts at its own first worked step')
    if job=='b2':ok('Ambition is in the word family.' in p.locator('.es-worked').inner_text(),'B2 gets tious worked branch');eq(p.locator('.es-worked h3').inner_text(),'The -tious family clue','B2 example title visible')
    if job=='b6':eq(p.locator('.es-worked h3').inner_text(),'From -able/-ible to -ably/-ibly','B6 amended title visible')
    tap(p,'step');tap(p,'step');ok(p.locator('.es-worked').evaluate('e=>e===document.activeElement'),'last step focus');tap(p,'step-back');tap(p,'step-back');tap(p,'step-back');ok(p.locator('.es-worked').evaluate('e=>e===document.activeElement'),'step zero focus')
    tap(p,'answer','[data-es-choice='+choice+']');ok(p.locator('[data-es-action=answer][data-es-choice='+choice+']').evaluate('e=>e===document.activeElement'),'answer focus');tap(p,'check');eq(book(p)['endingsShelf']['items'][job]['checks'][-1]['outcome'],'fit',job+' fit');tap(p,'keep');tap(p,'put-back');ok(p.locator('[data-es-action=answer]').first.evaluate('e=>e===document.activeElement'),'choice clear exact focus')
   p.screenshot(path=str(OUT/f'job-{width}.png'),full_page=True);tap(p,'skip');eq(book(p)['endingsShelf']['currentId'],'b1','skip wraps')
   tap(p,'job','[data-es-job=b4]');p.evaluate('window.esSpoken=[]');p.locator('[data-es-speak=prompt]').tap();spoken=' '.join(p.evaluate('window.esSpoken'));ok('magnificant' not in spoken and 'magnificent' not in spoken and 'magnifisent' not in spoken,'response choices excluded from prompt narration')
   held=copy.deepcopy(book(p)['endingsShelf']);p.goto(base+'#notes');p.locator('#download').wait_for();ok(p.locator('[data-endings-shelf-notes]').count()==1,'Notes summary')
   with p.expect_download() as d:p.locator('#download').tap()
   file=OUT/f'notes-{width}.json';d.value.save_as(file);eq(json.loads(file.read_text())['endingsShelf'],held,'actual download retains all work');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();eq(book(p)['endingsShelf'],held,'actual import');p.reload(wait_until='networkidle');p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-endings-shelf-root]').wait_for();eq(book(p)['endingsShelf'],held,'reload and chooser preserve work')
  finally:c.close()
 # Owner isolation, one-owner reset, and an older retained collection.
 c,p=setup(browser,base,fixture("E.openEndingsTable(s,'letter',o)"))
 try:
  tap(p,'place','[data-es-choice=cious]');first=copy.deepcopy(book(p)['endingsShelf']);p.goto(base+'#notes')
  with p.expect_download() as d:p.locator('#download').tap()
  file=OUT/'second-owner.json';d.value.save_as(file);p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();tap(p,'place','[data-es-choice=tious]');second=copy.deepcopy(book(p)['endingsShelf']);p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-endings-shelf-root]').wait_for();eq(book(p)['endingsShelf'],first,'separate explorer edit leaves first unchanged')
  p.goto(base+'#notes');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();ok('endingsShelf' not in book(p),'reset returns only this owner to preview');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();p.locator('[data-endings-shelf-root]').wait_for();eq(book(p)['endingsShelf'],second,'reset preserves second explorer')
 finally:c.close()
 c,p=setup(browser,base,fixture("E.openEndingsTable(s,'letter',o);s.endingsShelf.source.letter.gaps=s.endingsShelf.source.letter.gaps.slice(0,2).reverse();s.endingsShelf.source.letter.segments=[{text:'Synthetic retained letter '},{gapId:'official'},{text:' / '},{gapId:'precious'}];s.endingsShelf.source.copy.empty='[old gap]';s.endingsShelf.source.copy.instruction='Synthetic retained instruction.'"))
 try:
  ok('Synthetic retained instruction.' in p.locator('.es-room').inner_text(),'source-owned older instruction');eq(p.locator('[data-es-picker] option').all_text_contents(),['offi[old gap]','pre[old gap]'],'retained source order and marker');tap(p,'place','[data-es-choice=cial]');ok('official' in p.locator('.es-letter').inner_text(),'old letter remains playable');p.locator('[data-es-panel=teach-card-5] summary').tap();tap(p,'step','[data-es-card=card-5]');ok('The root is grace.' in p.locator('[data-es-panel=teach-card-5]').inner_text(),'optional worked teaching opens one step')
 finally:c.close()
 # Omitted source rows and unreadable check histories are always explained.
 c,p=setup(browser,base,fixture("E.openEndingsTable(s,'practice',o);s.endingsShelf.source.jobs[2].prompt=17;s.endingsShelf.source.pairs[1].spoken=null;s.endingsShelf.source.cards[0].text=17"))
 try:
  eq(p.locator('[data-es-job]').count(),5,'unreadable offered job omitted');ok(p.locator('.es-notice').count()>0,'omitted jobs notice');table(p,'pairs');eq(p.locator('[data-es-pair-picker] option').count(),3,'unreadable pair omitted');ok(p.locator('.es-notice').count()>0,'omitted pairs/cards notice');table(p,'letter');eq(p.locator('[data-es-panel^=teach-]').count(),5,'unreadable global card omitted');ok(p.locator('.es-notice').count()>0,'omitted teaching card notice')
 finally:c.close()
 c,p=setup(browser,base,fixture("E.openEndingsJob(s,'b1',o);s.endingsShelf.items.b1.checks=[{}]"))
 try:
  notices=' '.join(p.locator('.es-notice').all_text_contents());ok('earlier table' in notices and 'earlier letter' not in notices,'job check warning names the table, not letter')
 finally:c.close()
 c,p=setup(browser,base,fixture("E.openEndingsTable(s,'practice',o);s.endingsShelf.items='Synthetic unreadable container'"))
 try:ok(p.locator('.es-notice').count()>0,'unreadable job container explained');ok(p.locator('[data-es-job]:enabled').count()==0,'unreadable job container stays read-only')
 finally:c.close()
 c,p=setup(browser,base,fixture('s=freshState()'))
 try:
  before=book(p);table(p,'letter');after=book(p);eq(set(after)-set(before),{'endingsShelf'},'minimal first entry adds only activity root');eq({k:v for k,v in after.items() if k!='endingsShelf'},before,'activity preserves host-initialized avatar and base notebook');tap(p,'place','[data-es-choice=cious]');eq(book(p)['endingsShelf']['letter']['work']['placements']['precious'],'cious','minimal notebook uses actual host preflight')
 finally:c.close()
 # Source recovery, hidden/stale/film guards and real export-refusal seam.
 c,p=setup(browser,base,fixture("E.openEndingsTable(s,'letter',o)"))
 try:
  before=book(p);p.evaluate('window.esRefuse=true');tap(p,'place','[data-es-choice=cious]');eq(book(p),before,'preflight refusal atomic');ok('unchanged' in p.locator('#es-status').inner_text(),'visible refusal');p.evaluate('window.esRefuse=false');held=book(p)
  p.evaluate('const e=document.querySelector("[data-es-choice=cious]");e.style.display="none";e.click()');eq(book(p),held,'CSS-hidden writer inert');p.evaluate('document.querySelector("[data-es-choice=cious]").style.display=""')
  p.evaluate('window.esStale=document.querySelector("[data-es-choice=cious]")');tap(p,'place','[data-es-choice=tious]');held=book(p);p.evaluate('window.esStale.click()');eq(book(p),held,'detached callback inert')
  p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";document.body.append(d);d.showModal();document.querySelector("[data-es-choice=cious]").click()');eq(book(p),held,'open film blocks writer');p.evaluate('document.querySelector("dialog.welcome-film").remove()')
  p.locator('[data-es-choice=cious]').focus();p.keyboard.press('Enter');eq(book(p)['endingsShelf']['letter']['work']['placements']['precious'],'cious','keyboard tile');ok(p.locator('[data-es-choice=cious]').evaluate('e=>e===document.activeElement'),'keyboard focus preserved')
  p.evaluate('window.esStorageFail=true');tap(p,'place','[data-es-choice=tious]');ok('could not be saved reliably' in p.locator('[data-es-saving]').inner_text(),'host warning near work');ok(p.locator('[data-es-choice=tious]').evaluate('e=>e===document.activeElement'),'warning does not steal tile focus');eq(book(p)['endingsShelf']['letter']['work']['placements']['precious'],'tious','write failure retains memory')
 finally:c.close()
 c,p=setup(browser,base,fixture("E.openEndingsTable(s,'letter',o);s.endingsShelf.source.letter.gaps.push({...s.endingsShelf.source.letter.gaps[0],note:17});s.endingsShelf.letter.work.placements.precious={future:'Synthetic opaque placement'}"))
 try:
  eq(p.locator('[data-es-picker] option').count(),6,'ambiguous gap omitted from choices');ok('[word unavailable]' in p.locator('.es-letter').inner_text(),'unavailable segment placeholder');ok('cannot be read here' in p.locator('.es-notice').inner_text(),'partial source notice');tap(p,'place','[data-es-choice=cial]');eq(book(p)['endingsShelf']['letter']['work']['placements']['precious'],{'future':'Synthetic opaque placement'},'edit preserves opaque placement');tap(p,'keep');p.screenshot(path=str(OUT/'partial-letter.png'),full_page=True)
 finally:c.close()
 for code in ["s.endingsShelf={v:99,raw:'Synthetic future'}","s.spellings={v:99,raw:'Synthetic future'}"]:
  c,p=setup(browser,base,fixture(code))
  try:
   held=book(p)
   if 'endingsShelf' in held:ok('format this version cannot read' in p.locator('.es-notice').inner_text(),'unsupported endings notice');p.goto(base+'#library/spellings');p.locator('[data-stained-map-root]').wait_for();p.locator('[data-sm-table=map]').tap();eq(book(p)['endingsShelf'],held['endingsShelf'],'Stained Map leaves unsupported Endings untouched')
   else:table(p,'letter');eq(book(p)['spellings'],held['spellings'],'Endings leaves unsupported Stained Map untouched')
  finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  p.goto(base+'#library/spellings');p.locator('[data-stained-map-root]').wait_for();p.locator('[data-sm-table=map]').tap();p.locator('[data-sm-choice=gh]').tap();stained=copy.deepcopy(book(p)['spellings']);p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();table(p,'letter');tap(p,'place','[data-es-choice=cious]');eq(book(p)['spellings'],stained,'Stained-first native entry preserves its root')
 finally:c.close()
 # Both first-entry orders keep independent activity roots.
 c,p=setup(browser,base,fixture())
 try:
  table(p,'letter');tap(p,'place','[data-es-choice=cious]');kept=copy.deepcopy(book(p)['endingsShelf']);p.goto(base+'#library/spellings');p.locator('[data-stained-map-root]').wait_for();p.locator('[data-sm-table=map]').tap();p.locator('[data-sm-choice=gh]').tap();stained=copy.deepcopy(book(p)['spellings']);eq(book(p)['endingsShelf'],kept,'Endings-first keeps its root');p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();tap(p,'place','[data-es-choice=tious]');eq(book(p)['spellings'],stained,'Endings edits leave Stained Map intact')
  p.goto(base+'#notes');p.locator('#remember').uncheck();p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();tap(p,'place','[data-es-choice=cious]');ok('only while this page stays open' in p.locator('[data-es-saving]').inner_text(),'save-off warning');ok(p.locator('[data-es-choice=cious]').evaluate('e=>e===document.activeElement'),'save-off focus stays');ok(p.evaluate('!Object.keys(localStorage).some(k=>k.startsWith("number-garden-v1"))'),'no persistent save recreated');held=copy.deepcopy(book(p)['endingsShelf']);p.goto(base+'#notes')
  with p.expect_download() as d:p.locator('#download').tap()
  file=OUT/'save-off.json';d.value.save_as(file);eq(json.loads(file.read_text())['endingsShelf'],held,'save-off actual download')
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
 print(f'Endings Shelf browser checks: {checks} passed. Synthetic artifacts: {OUT}')
