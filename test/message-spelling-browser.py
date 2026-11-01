"""One synthetic message journey plus responsive samples; Chromium, not device qualification."""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,json,os,subprocess,threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 protocol_version='HTTP/1.1'
class Server(http.server.ThreadingHTTPServer):request_queue_size=128
server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=os.environ.get('MESSAGE_SPELLING_TEST_URL',f'http://127.0.0.1:{server.server_port}/')
OUT=Path(os.environ.get('MESSAGE_SPELLING_ARTIFACTS','/tmp/message-spelling-browser'))
OUT.mkdir(parents=True,exist_ok=True)
NODE="""import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import {openWordListShelf} from './dist/word-list-shelf-core.mjs';import {openPipsTable,placePipsWord} from './dist/pips-copy-core.mjs';let s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;const o={canExport:()=>true};openWordListShelf(s,o);openPipsTable(s,'postcard',o);placePipsWord(s,'high','hie',o);console.log(JSON.stringify(s));"""
SEED=json.loads(subprocess.check_output(['node','--input-type=module','-e',NODE],cwd=ROOT,text=True))
checks=0;errors=[]
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def eq(a,b,message):ok(a==b,message)
def state(p):return p.evaluate('window.__msgRead()')
def work(p,case='basket'):return state(p)['messages']['cases'][case]['post']
def own(p,action):return p.locator('[data-own-action="'+action+'"]')
def ready(p):
 p.locator('[data-own-workspace],[data-select-explorer]').first.wait_for()
 if not p.locator('[data-own-workspace]').count():
  owner=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId') or 'explorer-1'
  p.locator('[data-select-explorer="'+owner+'"]').click()
 p.locator('[data-own-workspace]').wait_for()
def dismiss(p):
 skip=p.locator('dialog.welcome-film[open] [data-film-skip]')
 if skip.count():skip.first.click()
def start(browser,width=820,height=1180,seed=None):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':id,'avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-01T03:00:00.000Z'} for id in ['explorer-1','explorer-2']]}
 c.add_init_script('(d=>{if(!localStorage.getItem("msg-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const[id,s]of Object.entries(d.books))localStorage.setItem("number-garden-v1:"+id,JSON.stringify(s));localStorage.setItem("msg-fixture","yes");}})('+json.dumps({'registry':registry,'books':{'explorer-1':seed or SEED,'explorer-2':SEED}})+')')
 def app(route):
  response=route.fetch();body=response.text();marker='function notesReport(notebook){'
  assert body.count(marker)==1
  body=body.replace(marker,'window.__msgRead=()=>structuredClone(state);'+marker,1)
  at=body.index('bindMessages(state,egRoot,')
  body=body[:at]+body[at:].replace('canExport:candidate=>','canExport:candidate=>!window.__msgRefuse&&',1)
  route.fulfill(response=response,body=body)
 c.add_init_script('window.__msgSpoken=[];speechSynthesis.speak=u=>{window.__msgSpoken.push(u.text);setTimeout(()=>u.onend?.(),0);};')
 c.route('**/app.mjs',app)
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(BASE+'#post/messages/own');ready(p)
 return c,p
def geometry(p,first_view=False):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('[data-own-workspace] :is(button,summary,a,select):visible').evaluate_all('xs=>xs.filter(e=>e.getBoundingClientRect().height<43.9).map(e=>e.textContent)')
 eq(bad,[],'all activity controls have44px touch height: '+str(bad))
 if first_view:
  p.evaluate('scrollTo(0,0)')
  for loc in [p.locator('#msg-original'),p.get_by_role('button',name='Keep this version',exact=True),p.get_by_role('button',name='Ask the reader',exact=True)]:
   box=loc.bounding_box();ok(box['y']>=0 and box['y']+box['height']<=p.viewport_size['height'],'editor and primary actions fit initial tablet viewport')
def download(p):
 p.goto(BASE+'#notes');p.locator('#download').wait_for();dismiss(p)
 with p.expect_download() as d:p.locator('#download').click()
 return Path(d.value.path()).read_text()

with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 try:
  # The complete journey runs once. Other sizes get short layout samples below.
  c,p=start(b)
  p.locator('[data-own-case="basket"]').tap();before=copy.deepcopy(work(p))
  own(p,'oral').tap();p.get_by_role('button',name="I'm ready to tell it",exact=True).tap();p.get_by_role('button',name='Back to my message',exact=True).tap()
  eq(work(p)['original'],before['original'],'oral/paper words are not saved');ok('spelling' not in work(p),'oral turns add no bridge record')
  p.locator('[data-own-teach]>summary').tap();ok('spelling' not in work(p),'pre-record teaching stays unrecorded');own(p,'typed').tap();p.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');ok(not work(p)['spelling']['help']['teaching'],'redrawing an already-open pre-record panel does not fabricate exposure');p.locator('[data-own-teach]>summary').tap();first='\n  Bring the basket.\n<img src=x onerror="fictional()"> 🐇  '
  p.locator('#msg-original').fill(first);own(p,'keep').tap();eq(work(p)['spelling']['first']['text'],first,'explicit first Keep retains exact text')
  p.locator('[data-own-teach]>summary').tap();own(p,'step-next').tap();ok(work(p)['spelling']['help']['teaching'],'opened teaching is recorded');ok(not work(p)['spelling']['first']['helpBefore']['teaching'],'later teaching does not rewrite first exposure')
  p.locator('[data-own-teach]>summary').tap();p.get_by_role('button',name='Ask the reader',exact=True).tap();ok(not p.locator('[data-own-teach]').evaluate('e=>e.open'),'closed teaching stays closed across turns');p.get_by_role('button',name='Hear my words',exact=True).tap();ok(work(p)['spelling']['help']['audio'],'read-aloud outside the old audio wrapper is recorded');ok(p.evaluate('window.__msgSpoken.length>0'),'speech requested through intercepted browser speech, no audible qualification');ok('Which basket should I bring' in p.locator('[data-own-workspace]').inner_text(),'authored reader question is explicit');ok(p.locator('[data-own-workspace] img[src=x]').count()==0,'original markup stays escaped')
  p.get_by_role('button',name='Back to my message',exact=True).tap();revision='Bring the basket of blankets to the café.'
  p.locator('#msg-original').fill(revision);own(p,'keep').tap();snap=copy.deepcopy(work(p)['spelling']);eq(snap['first']['text'],first,'revision never replaces first');eq(snap['latest']['text'],revision,'elected revision becomes latest')
  p.get_by_text('My kept versions',exact=True).click();own(p,'restore-first').tap();eq(p.locator('#msg-original').input_value(),first,'restore reopens original wording for revision');eq(work(p)['spelling'],snap,'restore leaves elected history and help unchanged')
  p.locator('#msg-original').fill(revision);geometry(p,True);ok(not p.locator('[data-msg-discard]').is_visible(),'discard is hidden when there is no unsaved typing')
  # Actual shared handler refusal preserves DOM typing and every notebook field.
  held=copy.deepcopy(state(p));p.evaluate('window.__msgRefuse=true');p.locator('#msg-original').fill('UNSAVED fictional words')
  eq(state(p),held,'preflight refusal installs nothing');eq(p.locator('#msg-original').get_attribute('aria-invalid'),'true','refused typing is visibly unsaved')
  p.get_by_role('button',name='Ask the reader',exact=True).tap();eq(p.locator('#msg-original').input_value(),'UNSAVED fictional words','turn control cannot drop refused typing')
  p.evaluate("location.hash='#notes'");p.wait_for_function("location.hash==='#post/messages/own'");eq(p.locator('#msg-original').input_value(),'UNSAVED fictional words','hash navigation preserves dirty field')
  p.locator('[data-msg-discard]').tap();eq(p.locator('#msg-original').input_value(),revision,'explicit discard restores only earlier saved draft');p.evaluate('window.__msgRefuse=false')
  p.locator('#msg-original').fill('A draft not yet kept.');held=copy.deepcopy(state(p));hidden=own(p,'keep');hidden.evaluate('e=>e.style.visibility="hidden"');hidden.dispatch_event('click');eq(state(p),held,'hidden Keep cannot record an unkept draft');hidden.evaluate('e=>e.style.visibility="visible"')
  p.evaluate('const d=document.createElement("dialog");d.dataset.msgFixture="yes";d.open=true;document.body.append(d)');own(p,'keep').dispatch_event('click');eq(state(p),held,'modal blocks underlying Keep');p.evaluate('document.querySelector("dialog[data-msg-fixture]").remove()');p.locator('#msg-original').fill(revision)
  old=p.locator('[data-own-action=keep]').element_handle()
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();ready(p);ok(not state(p).get('messages',{}).get('cases',{}).get('basket'),'another explorer has no inherited message')
  other=copy.deepcopy(state(p));old.evaluate('e=>e.click()');eq(state(p),other,'detached old-owner Keep cannot write')
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();ready(p);eq(work(p)['spelling'],snap,'original owner returns to literal kept history')
  # One shelf reference enters a different waiting message, without source edits.
  p.goto(BASE+'#library/word-list');p.locator('[data-wls-picker]').select_option('necessary');source=copy.deepcopy(state(p)['wordListShelf'])
  p.locator('[data-wls-action=carry][data-wls-tray=double]').tap();ready(p);ok('Necessary has one c' in p.locator('[data-own-workspace]').inner_text(),'full reference is visible before committing')
  p.locator('[data-own-case="seed-packet"]').tap();ready(p);eq(state(p)['wordListShelf'],source,'carry leaves source answers/checks exact');eq(work(p,'seed-packet')['spelling']['reference']['word'],'necessary','authored reference is frozen at destination');ok('spelling' not in state(p)['messages']['cases']['basket'].get('loft',{}),'no incidental Loft bridge')
  # Pip shows the supplied key, while the learner's deliberately different choice stays.
  p.goto(BASE+'#library/copy');p.locator('[data-pc-picker]').select_option('high');source=copy.deepcopy(state(p)['pipsCopy']);p.get_by_text("Show Pip's example",exact=True).click();p.locator('[data-pc-action=carry]').tap();ready(p)
  ok('The river is high.' in p.locator('[data-own-workspace]').inner_text(),'Pip carries authored text, not selected hie or high (leave it)');p.locator('[data-own-case="flags"]').tap();eq(state(p)['pipsCopy'],source,'Pip source is unchanged');eq(work(p,'flags')['spelling']['reference']['word'],'high','Pip destination has authored model only')
  # A waiting destination is opened intact, not replaced by another incoming clue.
  flags=copy.deepcopy(work(p,'flags'));p.goto(BASE+'#library/word-list');p.locator('[data-wls-picker]').select_option('necessary');p.locator('[data-wls-action=carry][data-wls-tray=double]').tap();p.locator('[data-own-case="flags"]').tap();eq(work(p,'flags'),flags,'opening waiting message never overwrites its reference')
  # Changing cases through the ordinary chooser cannot carry open teaching into the next record.
  p.locator('[data-own-teach]>summary').tap();p.wait_for_function("window.__msgRead().messages.cases.flags.post.spelling.help.teaching");ok(work(p,'flags')['spelling']['help']['teaching'],'flags teaching opened deliberately')
  p.goto(BASE+'#post/messages/choose');p.locator('[data-msg-case="seed-packet"]').tap();p.get_by_role('link',name='My own message',exact=True).click();ready(p);p.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');ok(not p.locator('[data-own-teach]').evaluate('e=>e.open'),'different case resets the open-panel state');ok(not work(p,'seed-packet')['spelling']['help']['teaching'],'different case gets no fabricated teaching exposure')
  p.goto(BASE+'#post/messages/choose');p.locator('[data-msg-case="flags"]').tap();p.get_by_role('link',name='My own message',exact=True).click();ready(p)
  # Pending carries are memory only and disappear on a reload.
  p.goto(BASE+'#library/word-list');p.locator('[data-wls-picker]').select_option('necessary');p.locator('[data-wls-action=carry][data-wls-tray=double]').tap();p.reload();ready(p);ok('pending clue is no longer here' in p.locator('[data-own-workspace]').inner_text(),'reload clears only uncommitted reference')
  raw=download(p);report=json.loads(raw);eq(report['messages'],state(p)['messages'],'actual Notes download retains all original versions/source')
  p.locator('#progress-file').set_input_files({'name':'synthetic-messages.json','mimeType':'application/json','buffer':raw.encode()});p.locator('#progress-import-confirm').click();p.goto(BASE+'#post/messages/own');ready(p);eq(state(p)['messages'],report['messages'],'actual import/reload preserves elected records')
  p.reload();ready(p);eq(state(p)['messages'],report['messages'],'literal source survives reload')
  # Existing ordinary carry strips only the new optional field.
  p.goto(BASE+'#post/messages');p.locator('[data-msg-action=revise]').tap();p.locator('.msg-own-words>summary').tap();held=copy.deepcopy(state(p));p.evaluate('window.__msgRefuse=true');p.locator('#msg-original').fill('UNSAVED ordinary message');eq(state(p),held,'ordinary Post Office composer uses the same atomic gate');p.locator('[data-msg-discard]').tap();ok(p.locator('#msg-original').is_visible(),'discard keeps the ordinary editor open, including a blank saved draft');p.evaluate('window.__msgRefuse=false');p.locator('[data-msg-action=carry]').tap();p.wait_for_url('**/#loft/messages*');p.get_by_role('heading',name='The reader’s little stage',exact=True).wait_for();ok('My own message' not in p.locator('main').inner_text(),'new mode is absent from Loft');ok('spelling' not in state(p)['messages']['cases']['flags']['loft'],'ordinary carry does not clone reference/history')
  p.goto(BASE+'#notes');active=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.locator('#remember').uncheck();raw=download(p);ok(json.loads(raw)['messages']['cases']['basket']['post']['spelling']['first']['text']==first,'save-off Notes can retain in-memory original prose');ok(p.evaluate("id=>!localStorage.getItem('number-garden-v1:'+id)",active),'save-off removes persistent notebook')
  c.close()
  # A real competing tab keeps its saved notebook when this tab continues locally.
  c,p=start(b);p.locator('[data-own-case="basket"]').tap();own(p,'typed').tap();p.locator('#msg-original').fill('Initial shared draft.')
  second=c.new_page();second.on('pageerror',lambda e:errors.append(str(e)));second.goto(BASE+'#post/messages/own');ready(second);own(second,'typed').tap();second.locator('#msg-original').fill('The other tab saved this.')
  p.locator('[data-save-warning]').wait_for();p.locator('#msg-original').fill('This tab keeps a local draft.')
  eq(p.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).messages.cases.basket.post.original"),'The other tab saved this.','stale tab never overwrites the competing saved message');eq(work(p)['original'],'This tab keeps a local draft.','conflicted tab preserves its own work in memory');ok('Saving is paused here' in p.locator('[data-save-warning]').inner_text(),'conflict saving status remains explicit');c.close()
  for width,height in [(1024,768),(320,800)]:
   c,p=start(b,width,height);p.locator('[data-own-case="basket"]').tap();own(p,'typed').tap();geometry(p,width>320);p.screenshot(path=str(OUT/f'message-{width}.png'));c.close()
  ok(not errors,'no application JavaScript errors: '+str(errors))
  print(f'Message spelling browser: {checks} meaningful checks passed. Artifacts: {OUT}')
 finally:b.close();server.shutdown()
