"""Synthetic Prop Box touch, keyboard, retained-source and real Notes transfer journeys."""
import sys
sys.dont_write_bytecode=True
import copy, functools, http.server, json, os, subprocess, tempfile, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('WORD_ROOM_ARTIFACTS',tempfile.mkdtemp(prefix='word-room-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def fixture(code=''):
 script="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import {chooseWordRoomWord} from './dist/word-room-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;const o={canExport:()=>true};"+code+";console.log(JSON.stringify(s));"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
def book(p):return p.evaluate('window.__wrRead()')
def room(p):return book(p)['wordRoom']
def tap(p,action):p.locator('[data-wr-action="'+action+'"]').first.tap()
def card(p,name):p.locator('[data-wr-word="'+name+'"]').first.tap()
def label(p,value):
 for i,c in enumerate(value):
  p.locator('[data-wr-place="'+str(i)+'"]').tap();p.locator('[data-wr-action=letter][data-wr-value="'+c+'"]').tap()
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 for e in p.locator('.wr-room button:visible,.wr-room a:visible,.wr-room summary:visible').all():
  r=e.bounding_box();ok(r and r['height']>=43.9 and r['width']>=43.9,'44px targets '+e.inner_text()[:35])
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True,reduced_motion='reduce')
 c.add_init_script("""(s=>{if(!localStorage.getItem('wr-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('wr-fixture','1');}window.wrSpeech=0;window.wrMedia=0;window.wrWrites=0;window.speechSynthesis.speak=()=>{window.wrSpeech++};HTMLMediaElement.prototype.play=function(){window.wrMedia++;return Promise.resolve()};const write=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith('number-garden')||k==='learning-garden-explorers'){if(window.__wrStorageFail)throw Error('Synthetic storage refusal');window.wrWrites++;}return write.call(this,k,v);};})("""+json.dumps(seed)+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body
  body=body.replace('let graph=null,','window.__wrRead=()=>structuredClone(state);window.__wrReplace=x=>{state=x;};window.__wrReport=()=>notesReport(state);window.__wrFits=x=>prepareProgressImport(JSON.stringify(x,null,2)).ok;window.__wrPad=n=>{state.syntheticPadding="x".repeat(n);};let graph=null,',1)
  start=body.index('bindWordRoom(state,{');end=body.index('});}return;',start);section=body[start:end];assert 'canExport:candidate=>' in section
  body=body[:start]+section.replace('canExport:candidate=>','canExport:candidate=>!window.__wrRefuse&&')+body[end:]
  route.fulfill(response=response,body=body)
 c.route('**/app.mjs',app);p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(base+'#words/props',wait_until='networkidle');p.locator('[data-word-room-root]').wait_for();return c,p

def play(browser,base,width,height):
 c,p=setup(browser,base,fixture(),width,height)
 try:
  layout(p);ok('wordRoom' not in book(p),'chooser preview writes no source');ok(p.locator('[data-wr-word]').count()==12,'all twelve pictured cards open')
  card(p,'mat');ok(room(p)['page']=='meet','card begins with meaning');tap(p,'build');layout(p)
  if width>=320:
   r=p.locator('[data-wr-action=try]').bounding_box();ok(r['y']+r['height']<=height,'instruction, target and Try label visible in initial viewport')
  p.screenshot(path=str(OUT/f'build-{width}.png'),full_page=True)
  tap(p,'try');ok('first place is empty' in p.locator('#wr-status').inner_text(),'empty place instruction');ok(p.locator('#wr-place-0').evaluate('e=>e===document.activeElement'),'empty place focused')
  label(p,'sat');tap(p,'try');ok('You made sat' in p.locator('.wr-result').inner_text(),'known alternative treated as discovery');before=copy.deepcopy(room(p)['drafts']['mat']);tap(p,'keep');ok(room(p)['gallery']==['sat'],'other label kept');ok(room(p)['selectedId']=='mat' and room(p)['drafts']['mat']==before,'waiting target and draft retained')
  label(p,'fff');tap(p,'try');ok("don't have an open picture" in p.locator('.wr-result').inner_text(),'neutral unknown combination');ok(p.locator('[data-wr-action=keep]').count()==0,'unknown has no invented picture or keep')
  label(p,'mat');tap(p,'try');p.evaluate('window.__wrStale=document.querySelector("[data-wr-action=keep]")');tap(p,'dismiss');label(p,'cat');held=copy.deepcopy(book(p));p.evaluate('window.__wrStale.click()');ok(book(p)==held,'detached Keep inert')
  label(p,'mat');tap(p,'try');tap(p,'keep');ok(room(p)['gallery']==['sat','mat'],'target kept once');tap(p,'try');tap(p,'keep');ok(room(p)['gallery']==['sat','mat'],'duplicate keep idempotent')
  draft=copy.deepcopy(room(p)['drafts']['mat']);tap(p,'example');ok('fin' in p.locator('#wr-task').inner_text(),'worked example differs from target')
  for i in range(3):tap(p,'example-next');layout(p)
  ok(p.locator('.wr-word-piece').all_text_contents()==list('fin'),'fourth example frame complete');tap(p,'local-back');ok(room(p)['drafts']['mat']==draft,'example preserves draft')
  tap(p,'point');tap(p,'point-next');tap(p,'point-next');tap(p,'point-next');ok(room(p)['drafts']['mat']['point']==3,'whole word point saved');tap(p,'local-back')
  p.locator('.wr-comparisons summary').tap();p.locator('[data-wr-action=compare][data-wr-value=sat]').tap();ok('mat and sat' in p.locator('#wr-task').inner_text(),'chosen sibling comparison');tap(p,'local-back')
  tap(p,'choose');card(p,'fin');tap(p,'build');label(p,'pin');tap(p,'choose');card(p,'mat');tap(p,'build');ok(room(p)['drafts']['mat']['slots']==list('mat'),'per-card draft restored');tap(p,'read');ok(p.locator('.wr-scene-picture').count()==1,'reading has retained scene illustration');ok('Where is the bat?' in p.locator('.wr-discuss').inner_text(),'scene discussion');layout(p)
  p.screenshot(path=str(OUT/f'read-{width}.png'),full_page=True)
  old=copy.deepcopy(room(p));p.goto(base+'#notes');p.locator('#download').wait_for();ok('Word Workshop: Prop Box' in p.locator('main').inner_text(),'ordinary Notes includes prop summary')
  with p.expect_download() as d:p.locator('#download').tap()
  file=OUT/f'notes-{width}.json';d.value.save_as(file);download=json.loads(file.read_text());ok(download['wordRoom']==old,'actual Notes download retains complete source/drafts/gallery')
  p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();held=copy.deepcopy(book(p));p.locator('#progress-import-cancel').tap();ok(book(p)==held,'cancelled actual import preserves notebook');p.locator('#progress-file').set_input_files({'name':'synthetic-invalid.json','mimeType':'application/json','buffer':b'{invalid'});p.wait_for_function('document.querySelector("#progress-import-status").textContent.includes("not readable JSON")');ok(book(p)==held,'invalid actual import preserves notebook');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.wait_for_timeout(100);p.goto(base+'#words/props');p.locator('[data-word-room-root]').wait_for();ok(room(p)==old,'actual Notes import restores retained material')
  p.reload(wait_until='networkidle');p.locator('[data-select-explorer=explorer-2]').tap();p.locator('[data-word-room-root]').wait_for();ok(room(p)==old,'reload preserves work');
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-word-room-root]').wait_for();tap(p,'back');tap(p,'build');label(p,'cat');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();p.locator('[data-word-room-root]').wait_for();ok(room(p)==old,'separate explorer edit leaves imported work unchanged');
  p.goto(base+'#notes');p.locator('#remember').uncheck();p.goto(base+'#words/props');p.locator('[data-word-room-root]').wait_for();tap(p,'back');tap(p,'build');writes=p.evaluate('wrWrites');label(p,'cat');ok(p.evaluate('wrWrites')==writes,'saving-off recreates no saved notebook');
  ok(p.evaluate('wrSpeech===0&&wrMedia===0'),'no TTS or media requested')
 finally:c.close()

def edges(browser,base):
 # Total Notes reader and retained recovery work for every JSON root shape.
 for raw in [None,False,17,'future',[],{'version':99,'raw':['kept']}]:
  seed=fixture();seed['wordRoom']=raw;c,p=setup(browser,base,seed)
  try:
   held=copy.deepcopy(book(p));tap(p,'recover');ok(book(p)==held,'dialog opening writes nothing');tap(p,'cancel');ok(book(p)==held,'cancel leaves exact raw root');tap(p,'recover');p.keyboard.press('Escape');ok(book(p)==held,'Escape leaves exact raw root');tap(p,'recover');p.evaluate('const b=document.querySelector("[data-wr-action=confirm]");b.click();b.click()');ok(room(p)['recovered']==raw,'explicit recovery retains exact old raw value');p.goto(base+'#notes');p.locator('#download').wait_for();ok('Word Workshop: Prop Box' in p.locator('main').inner_text(),'Notes handles recovered raw JSON')
  finally:c.close()
 seed=fixture("chooseWordRoomWord(s,'mat',o);s.wordRoom.source.words.mat.meaning='A retained earlier mat.';s.wordRoom.source.words.fin.guidance=null;s.wordRoom.source.texts.box.tokens[0].end=99999;s.wordRoom.gallery=['mat','bad',{old:true}]")
 c,p=setup(browser,base,seed)
 try:
  ok('A retained earlier mat.' in p.locator('.wr-room').inner_text(),'retained wording shown');held=copy.deepcopy(room(p)['source']);tap(p,'choose');card(p,'sat');tap(p,'build');label(p,'sat');tap(p,'try');tap(p,'keep');ok(room(p)['source']==held,'bad siblings never rewritten');ok(room(p)['gallery'][-1]=='sat','bad gallery entries do not block useful work');ok(not p.locator('.wr-ready').count(),'bad required card pauses completion only')
  tap(p,'choose');ok(p.locator('[data-wr-word=fin]').count()==0,'unreadable word has no active choice');p.locator('[data-wr-action=text][data-wr-value=props]').tap();ok(p.locator('.wr-passage').count()==1,'readable scene remains open');tap(p,'back');tap(p,'build')
  before=copy.deepcopy(book(p));p.evaluate('window.__wrRefuse=true');p.locator('[data-wr-action=letter]').first.tap();ok(book(p)==before and "couldn't keep" in p.locator('#wr-status').inner_text(),'actual adapter refuses failed export preflight without mutation');p.evaluate('window.__wrRefuse=false;window.__wrStorageFail=true');label(p,'cap');ok(room(p)['drafts']['sat']['slots']==list('cap'),'storage failure keeps in-memory work');ok('browser saving failed' in p.locator('#wr-status').inner_text(),'storage failure explicitly described')
 finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  p.evaluate('window.__wrPad(0);const n=new TextEncoder().encode(JSON.stringify(window.__wrReport(),null,2)).length;window.__wrPad(5*1024*1024-n-2)');ok(p.evaluate('window.__wrFits(window.__wrReport())'),'near-limit actual Notes report still importable');held=copy.deepcopy(book(p));card(p,'mat');ok(book(p)==held and "couldn't keep" in p.locator('#wr-status').inner_text(),'actual Notes metadata preflight refuses new source at real byte boundary')
 finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  card(p,'mat');tap(p,'build');p.locator('[data-wr-action=letter][data-wr-value=m]').focus();p.keyboard.press('Enter');ok(room(p)['drafts']['mat']['slots'][0]=='m','keyboard operates letter tile');p.locator('[data-wr-place="1"]').focus();p.keyboard.press('Space');ok(room(p)['drafts']['mat']['place']==1,'keyboard operates slot')
  p.evaluate('window.__wrOld=document.querySelector("[data-wr-action=letter]")');p.goto(base+'#words');p.get_by_role('link',name='Visit the Prop Box',exact=True).wait_for();held=copy.deepcopy(book(p));p.evaluate('window.__wrOld.click()');ok(book(p)==held,'old route control inert');p.get_by_role('link',name='Visit the Prop Box',exact=True).tap();p.locator('[data-word-room-root]').wait_for();ok(room(p)['drafts']['mat']['slots'][0]=='m','navigation retains draft')
  p.evaluate('window.__wrOld=document.querySelector("[data-wr-action=letter]")');p.locator('#explorer-switch').tap();held=copy.deepcopy(book(p));p.evaluate('window.__wrOld.click()');ok(book(p)==held,'explorer picker disables old controls')
 finally:c.close()
 seed=fixture();seed['wordRoom']={'version':99,'raw':['retained']};c,p=setup(browser,base,seed)
 try:
  tap(p,'recover');p.evaluate('window.__wrLate=document.querySelector("[data-wr-action=confirm]")');p.goto(base+'#notes');p.locator('#download').wait_for();held=copy.deepcopy(book(p));p.evaluate('window.__wrLate.click()');ok(book(p)==held,'late recovery confirmation after navigation inert');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.goto(base+'#words/props');p.locator('[data-word-room-root]').wait_for();ok('wordRoom' not in book(p),'explicit explorer reset starts a preview without overwriting another explorer')
 finally:c.close()

 seed=fixture("chooseWordRoomWord(s,'mat',o)");c,p=setup(browser,base,seed)
 try:
  p.locator('.wr-grownups summary').tap();tap(p,'recover');held=copy.deepcopy(book(p));p.evaluate('window.__wrRefuse=true');tap(p,'confirm');ok(book(p)==held and p.locator('.wr-dialog').count()==0,'normal grown-up recovery refusal preserves box and exits modal');ok(p.locator('#wr-status').evaluate('e=>e===document.activeElement'),'normal recovery refusal focuses connected status');ok(p.locator('.wr-grownups[open] a[href="#notes"]').is_visible(),'normal recovery refusal leaves Notes link available')
 finally:c.close()
 # Review regressions: modal failure must be visible/focusable, even at the
 # actual report-byte boundary; paused drafts stay intact with an open shelf.
 seed=fixture();seed['wordRoom']={'version':99,'raw':['retained']};c,p=setup(browser,base,seed)
 try:
  p.evaluate('window.__wrPad(0);const n=new TextEncoder().encode(JSON.stringify(window.__wrReport(),null,2)).length;window.__wrPad(5*1024*1024-n-2)');ok(p.evaluate('window.__wrFits(window.__wrReport())'),'pre-recovery actual export fits');held=copy.deepcopy(book(p));tap(p,'recover');tap(p,'confirm');ok(book(p)==held,'recovery refused at actual report boundary without mutation');ok(p.locator('.wr-dialog').count()==0,'refusal dismisses modal rather than hiding status behind it');ok(p.locator('#wr-status').is_visible() and p.locator('#wr-status').evaluate('e=>e===document.activeElement'),'modal failure explanation visible and focused');ok("couldn't keep" in p.locator('#wr-status').inner_text(),'modal failure tells what happened');ok(p.locator('.wr-room a[href="#notes"]').is_visible(),'Notes offered after refused recovery')
 finally:c.close()
 for missing in [False,True]:
  seed=fixture("chooseWordRoomWord(s,'mat',o)")
  if missing:del seed['wordRoom']['drafts']['mat']
  else:seed['wordRoom']['drafts']['mat']={'future':'draft'}
  c,p=setup(browser,base,seed)
  try:
   ok(p.locator('.wr-chooser').is_visible(),'missing or unreadable draft has an open chooser');ok(p.locator('[data-wr-action=build]').count()==0,'no ineffective Make step without readable draft');ok(p.locator('#wr-task').count()==1,'one current task heading')
   if missing:tap(p,'start');ok(room(p)['drafts']['mat']['slots']==[None,None,None],'explicit missing draft start works')
   else:card(p,'sat');ok(room(p)['drafts']['mat']=={'future':'draft'},'other card selection retains unreadable draft exactly')
  finally:c.close()
 seed=fixture("chooseWordRoomWord(s,'mat',o);s.wordRoom.page='read';s.wordRoom.textId='missing-scene'");c,p=setup(browser,base,seed)
 try:
  ok(p.locator('.wr-chooser').is_visible(),'bad selected scene offers the shelf');tap(p,'read');ok(room(p)['textId']=='props' and p.locator('.wr-passage').is_visible(),'Read opens readable linked scene from a retained broken read pointer')
 finally:c.close()
 seed=fixture("chooseWordRoomWord(s,'mat',o);s.wordRoom.gallery=Object.keys(s.wordRoom.source.words)");c,p=setup(browser,base,seed)
 try:
  ok(p.locator('.wr-ready').is_visible(),'complete retained collection shows milestone');tap(p,'scenes');ok(p.locator('.wr-scene-choices button').first.evaluate('e=>e===document.activeElement'),'finished box Read focuses retained scene choices');tap(p,'revisit');ok(p.locator('.wr-shelf button').first.evaluate('e=>e===document.activeElement'),'finished box Revisit focuses the retained picture shelf')
  for key in ['props','box','puppet']:
   p.locator('[data-wr-action=text][data-wr-value="'+key+'"]').tap();ok(p.locator('.wr-scene-picture').count()==1,'shared '+key+' scene drawn');p.screenshot(path=str(OUT/('scene-'+key+'.png')),full_page=True);tap(p,'choose')
 finally:c.close()

 for failure in [True,False]:
  seed=fixture("chooseWordRoomWord(s,'mat',o);s.wordRoom.source.words.mat.textId=null");c,p=setup(browser,base,seed)
  try:
   if failure:p.evaluate('window.__wrStorageFail=true')
   else:p.goto(base+'#notes');p.locator('#remember').uncheck();p.goto(base+'#words/props');p.locator('[data-word-room-root]').wait_for()
   tap(p,'read');status=p.locator('#wr-status').inner_text();ok('earlier scene cannot open' in status,'unavailable linked scene explains return to chooser');ok(('browser saving failed' if failure else 'browser saving is off') in status,'unavailable scene notice retains persistence warning')
  finally:c.close()
 seed=fixture("chooseWordRoomWord(s,'mat',o);s.wordRoom.gallery=Object.keys(s.wordRoom.source.words);s.wordRoom.page='build'")
 for width,height in [(320,900),(820,1000),(1024,768)]:
  c,p=setup(browser,base,seed,width,height)
  try:
   r=p.locator('[data-wr-action=try]').bounding_box();ok(r['y']>=0 and r['y']+r['height']<=height,'finished-box celebration does not displace label action');tap(p,'read');r=p.locator('[data-wr-action=back]').bounding_box();ok(r['y']>=0 and r['y']+r['height']<=height,'finished-box reading return remains in the viewport');layout(p);p.screenshot(path=str(OUT/('complete-read-'+str(width)+'.png')),full_page=True)
  finally:c.close()
 seed=fixture("chooseWordRoomWord(s,'mat',o);s.wordRoom.gallery=Object.keys(s.wordRoom.source.words).filter(x=>x!=='mat');s.wordRoom.page='build'");c,p=setup(browser,base,seed)
 try:
  label(p,'mat');tap(p,'try');tap(p,'keep');ok(p.locator('.wr-ready').evaluate('e=>e===document.activeElement'),'last kept label focuses the reachable celebration');ok(p.locator('.wr-ready [data-wr-action=scenes]').is_visible(),'celebration reading action remains available')
 finally:c.close()

class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
def main():
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('WORD_ROOM_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   options={'headless':True,'args':['--disable-quic']};chrome=os.environ.get('CHROME_PATH');mac='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
   if chrome or Path(mac).exists():options['executable_path']=chrome or mac
   b=pw.chromium.launch(**options)
   try:
    for w,h in [(320,900),(820,1000),(1024,768)]:play(b,base,w,h)
    edges(b,base);ok(not errors,'no page errors '+str(errors));receipt={'status':'passed','checks':checks,'base':base};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
   finally:b.close()
 finally:server.shutdown()
if __name__=='__main__':main()
