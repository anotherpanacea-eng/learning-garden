"""Synthetic parcel-label touch/keyboard, frozen writing and real notebook-transfer journeys."""
import sys
sys.dont_write_bytecode = True
import copy, functools, http.server, json, os, subprocess, tempfile, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('PARCEL_LABELS_ARTIFACTS',tempfile.mkdtemp(prefix='parcel-labels-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def js_fixture(code=''):
 script="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import {startParcel,setParcelPiece,checkParcel,keepParcel,setParcelMessage} from './dist/parcel-labels-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;"+code+";console.log(JSON.stringify(s));"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
def book(p):return p.evaluate('window.__parcelRead()')
def work(p):
 r=book(p)['parcelLabels'];return r['visits'][r['currentId']]
def ready(p):p.locator('[data-parcel-root]').wait_for()
def drawer(p,name='more',opened=True):
 d=p.locator('[data-parcel-disclosure="'+name+'"]')
 if (d.get_attribute('open') is not None)!=opened:d.locator('summary').tap()
def create(p,family='mixed',quantity='mix'):
 drawer(p);p.locator('[data-parcel-family]').select_option(family);p.locator('[data-parcel-quantity]').select_option(quantity);p.locator('[data-parcel-start]').tap();return work(p)
def piece(p,ending,stem=None):
 if stem is not None:p.locator('[data-parcel-stem="'+stem+'"]').tap()
 p.locator('[data-parcel-ending="'+ending+'"]').tap()
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 for el in p.locator('.parcel-page button:visible,.parcel-page select:visible,.parcel-page a:visible,.parcel-page summary:visible').all():
  r=el.bounding_box();ok(r and r['height']>=43.9,'44px target '+el.inner_text()[:40])
def visible(p,selector):
 r=p.locator(selector).bounding_box();return r and r['y']>=0 and r['y']+r['height']<=p.viewport_size['height']
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True,reduced_motion='reduce')
 c.add_init_script("""(s=>{if(!localStorage.getItem('parcel-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('parcel-fixture','1');}window.parcelWrites=0;const write=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith('number-garden')||k==='learning-garden-explorers'){if(window.__parcelStorageFail)throw Error('Synthetic write refusal');window.parcelWrites++;}return write.call(this,k,v);};})("""+json.dumps(seed)+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body
  body=body.replace('let graph=null,','window.__parcelRead=()=>structuredClone(state);window.__parcelReplace=x=>{state=x;};let graph=null,',1)
  begin=body.index('bindParcelLabels(state,{');end=body.index('});bindSpeech();',begin)
  section=body[begin:end];assert 'canExport:candidate=>' in section
  body=body[:begin]+section.replace('canExport:candidate=>','canExport:candidate=>!window.__parcelRefuse&&')+body[end:]
  route.fulfill(response=response,body=body)
 c.route('**/app.mjs',app);p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(base+'#words/endings',wait_until='networkidle');ready(p);return c,p

def play(browser,base,seed,width,height):
 c,p=setup(browser,base,seed,width,height)
 try:
  layout(p);ok(p.locator('[data-parcel-disclosure="more"]').get_attribute('open') is None,'current work first, chooser closed')
  if width>=820:
   ok(visible(p,'[data-parcel-check]'),'check in initial tablet viewport with twelve saved parcels')
   ok(visible(p,'.parcel-label-tag'),'literal label in initial tablet viewport')
  ok(p.locator('[data-parcel-object]').count()==work(p)['source']['count'],'picture contains exactly the requested objects')
  before=(copy.deepcopy(book(p)),p.evaluate('parcelWrites'));p.evaluate('window.__messageElement=document.querySelector("[data-parcel-message]")')
  drawer(p,'writing');drawer(p,'writing',False);ok(p.locator('[data-parcel-message]').evaluate('e=>e===window.__messageElement'),'native disclosure retains actual message DOM');ok((book(p),p.evaluate('parcelWrites'))==before,'native toggles save nothing')
  drawer(p);selected_before=(copy.deepcopy(book(p)),p.evaluate('parcelWrites'));p.locator('[data-parcel-family]').select_option('keep-y');p.locator('[data-parcel-quantity]').select_option('one');p.locator('[data-parcel-remove-choice]').select_option('parcel-4');ok((book(p),p.evaluate('parcelWrites'))==selected_before,'pattern/quantity/removal selectors are read-only until an explicit action')
  piece(p,'s','keep');ok(p.locator('[data-parcel-family]').input_value()=='keep-y','family selection survives piece redraw');ok(p.locator('[data-parcel-quantity]').input_value()=='one','quantity selection survives redraw');ok(p.locator('[data-parcel-one-note]').is_visible(),'one explanation survives redraw');ok(p.locator('[data-parcel-remove-choice]').input_value()=='parcel-4','removal selection survives redraw')
  drawer(p,opened=False);p.evaluate('window.__hiddenStart=document.querySelector("[data-parcel-start]");window.__hiddenLink=document.querySelector("[data-parcel-disclosure=more] a")');held=copy.deepcopy(book(p));p.evaluate('window.__hiddenStart.click();window.__hiddenLink.click()');ok(book(p)==held and p.evaluate('location.hash')=='#words/endings','closed chooser actions and links inert')
  p.locator('[data-parcel-check]').tap();ok(work(p)['checks'][-1]['outcome']=='different','literal wrong construction checked without losing parcel')
  p.locator('[data-parcel-help]').tap();piece(p,'ies','trim');p.locator('[data-parcel-check]').tap();ok(work(p)['checks'][-1]['outcome']=='match' and work(p)['checks'][-1]['helpSeenBefore'],'correction retains optional help');ok(p.locator('.parcel-stamp').count()==1,'fresh match stamps current label')
  piece(p,'s');piece(p,'ies');ok(p.locator('.parcel-stamp').count()==0,'edit away and back does not reuse readiness');p.locator('[data-parcel-check]').tap()
  drawer(p,'writing');p.locator('[data-parcel-message]').fill('First <synthetic> message & label.');p.locator('[data-parcel-keep]').tap();first=copy.deepcopy(work(p)['firstKept']);drawer(p,'writing');p.locator('[data-parcel-message]').fill('Latest synthetic message.');p.locator('[data-parcel-keep]').tap();ok(work(p)['firstKept']==first,'first kept writing exact');ok(work(p)['latestKept']['ownMessage']=='Latest synthetic message.','latest kept writing separate');ok(p.locator('[data-parcel-root] script').count()==0,'typed markup remains literal text')
  p.locator('html').evaluate("e=>e.style.fontSize='150%'");layout(p);p.locator('html').evaluate("e=>e.style.fontSize=''")
  drawer(p);summary=p.locator('[data-parcel-disclosure="more"] summary');summary.focus();p.keyboard.press('Enter');ok(p.locator('[data-parcel-disclosure="more"]').get_attribute('open') is None,'native keyboard closes chooser');p.keyboard.press('Space');ok(p.locator('[data-parcel-disclosure="more"]').get_attribute('open') is not None,'native keyboard opens chooser')
  held=copy.deepcopy(book(p));p.locator('[data-parcel-remove-choice]').select_option('parcel-4');p.once('dialog',lambda d:d.dismiss());p.locator('[data-parcel-remove]').tap();ok(book(p)==held,'cancel removal writes nothing');p.once('dialog',lambda d:d.accept());p.locator('[data-parcel-remove]').tap();expected=copy.deepcopy(held);del expected['parcelLabels']['visits']['parcel-4'];ok(book(p)==expected,'only explicitly selected parcel removed');ok(p.locator('[data-parcel-disclosure="more"]').get_attribute('open') is not None,'removal keeps chooser open')
  held=copy.deepcopy(book(p)['parcelLabels']);p.evaluate("location.hash='#notes'");p.locator('#download').wait_for()
  with p.expect_download() as dl:p.locator('#download').tap()
  file=OUT/f'notes-{width}.json';dl.value.save_as(str(file));exported=json.loads(file.read_text());ok(exported['parcelLabels']==held,'real downloaded notebook retains exact parcels');p.get_by_text('Parcel labels: supplied spelling practice',exact=True).tap();ok('First <synthetic> message & label.' in p.locator('main').inner_text(),'Notes renders literal first kept writing')
  p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId==='explorer-2'");p.evaluate("location.hash='#words/endings'");ready(p);ok(book(p)['parcelLabels']==held,'real import retains all frozen sources and writing');p.reload(wait_until='networkidle');p.locator('[data-select-explorer=explorer-2]').tap();ready(p);ok(book(p)['parcelLabels']==held,'reload preserves imported notebook');ok(p.locator('[data-parcel-disclosure="more"]').get_attribute('open') is None,'reload resets only local disclosure state')
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();ready(p);drawer(p,'writing');p.locator('[data-parcel-message]').fill('Only the first synthetic explorer changes.');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();ready(p);ok(book(p)['parcelLabels']==held,'separate explorer edit does not affect imported notebook')
  p.evaluate("location.hash='#notes'");p.locator('#remember').uncheck();p.evaluate("location.hash='#words/endings'");ready(p);writes=p.evaluate('parcelWrites');piece(p,'es');ok(p.evaluate('parcelWrites')==writes,'saving-off piece changes recreate no browser saves');ok('browser saving is off' in p.locator('#parcel-status').inner_text(),'saving-off feedback is truthful');ok(not p.evaluate("Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"),'saving-off leaves no progress copies')
  p.screenshot(path=str(OUT/f'active-{width}.png'),full_page=True)
  print('parcel active',width,'passed',flush=True)
 finally:c.close()

def edges(browser,base):
 sparse={'version':1,'baseline':{'index':0,'observations':[],'complete':False},'practice':[],'puzzles':[],'sessions':0,'garden':{'welcomeFilmSeen':True},'science':{'version':99,'raw':'held'}}
 c,p=setup(browser,base,sparse)
 try:
  ok('parcelLabels' not in book(p),'fresh preview creates no extension');ok(book(p).get('science')==sparse['science'],'fresh direct entry preserves unsupported unrelated root');ok('words' not in book(p) and 'cafe' not in book(p),'early route avoids generic unrelated initializers')
  w=create(p,'keep-y','more');ok(w['source']['base']=='tray','explicit pattern opens actual matching task');ok(p.locator('[data-parcel-ending][aria-pressed=true]').count()==0,'no answer preselected')
  piece(p,'s');p.locator('[data-parcel-check]').tap();drawer(p,'writing');p.locator('[data-parcel-message]').fill('Saved words.');p.evaluate('window.__parcelRefuse=true');p.locator('[data-parcel-message]').fill('Refused <exact> visible words.');held=copy.deepcopy(book(p));ok(p.locator('[data-parcel-message]').input_value()=='Refused <exact> visible words.' and held['parcelLabels']['visits'][held['parcelLabels']['currentId']]['ownMessage']=='Saved words.','refused words stay in actual field, not overwritten in notebook')
  p.locator('[data-parcel-keep]').tap();ok(book(p)==held,'Keep cannot silently use stale saved message');drawer(p,opened=True);p.locator('[data-parcel-start]').tap();ok(book(p)==held,'new parcel blocked while words refused');drawer(p,opened=False);drawer(p,'writing',False);drawer(p,'writing');ok(p.locator('[data-parcel-message]').input_value()=='Refused <exact> visible words.','closing either disclosure does not erase refused text');p.locator('#explorer-switch').tap();ok(book(p)==held and p.locator('[data-parcel-root]').count()==1,'explorer departure cannot discard refused words')
  p.evaluate("location.hash='#notes'");p.wait_for_function("location.hash==='#words/endings'");ok(p.locator('[data-parcel-message]').input_value()=='Refused <exact> visible words.','direct-hash guard preserves refused words')
  p.evaluate("history.replaceState(null,'','#home');history.pushState(null,'','#words/endings');history.back()");p.wait_for_function("location.hash==='#words/endings'");ok(p.locator('[data-parcel-message]').input_value()=='Refused <exact> visible words.','browser Back guard preserves refused words')
  p.once('dialog',lambda d:d.dismiss());p.locator('[data-parcel-restore]').tap();ok(p.locator('[data-parcel-message]').input_value()=='Refused <exact> visible words.','cancel restore keeps visible words');p.once('dialog',lambda d:d.accept());p.locator('[data-parcel-restore]').tap();drawer(p,'writing');ok(p.locator('[data-parcel-message]').input_value()=='Saved words.' and book(p)==held,'explicit restore uses saved words without another save')
  p.evaluate('window.__parcelRefuse=false');p.locator('[data-parcel-message]').fill('Retried words saved.');ok(work(p)['ownMessage']=='Retried words saved.','typing can retry successfully after refusal');p.evaluate('window.__stalePiece=document.querySelector("[data-parcel-ending=s]")');create(p,'ies','more');held=copy.deepcopy(book(p));p.evaluate('window.__stalePiece.click()');ok(book(p)==held,'detached piece callback inert')
  p.evaluate('window.__stalePiece=document.querySelector("[data-parcel-ending=s]");window.__parcelReplace({...window.__parcelRead(),replacementMarker:true})');held=copy.deepcopy(book(p));p.evaluate('window.__stalePiece.click()');ok(book(p)==held,'connected old controls cannot mutate a replaced notebook')
 finally:c.close()
 c,p=setup(browser,base,js_fixture())
 try:
  p.get_by_role('link',name='Back to Word Garden',exact=True).tap();p.locator('[data-word-base=pack]').tap();p.locator('[data-word-part=ful]').tap();p.locator('[data-word-try]').tap();ok('A word to wonder about' in p.locator('.word-result').inner_text(),'old invented combinations remain discoveries');old_words=copy.deepcopy(book(p)['words']);p.get_by_role('link',name='Make parcel labels: one and more than one',exact=True).tap();ready(p);create(p);ok(book(p)['words']==old_words,'new conventional-label practice does not change Word Garden discoveries')
 finally:c.close()
 historical=js_fixture("startParcel(s);const w=s.parcelLabels.visits['parcel-1'];Object.assign(w.source,{base:'bag',plural:'bags',expected:'bags',count:2,art:'old-bag',family:'historical',explanation:'Keep bag and add s: bag + s = bags.'});w.source.messages.match='Keep bag and add s: bag + s = bags.';w.source.futureMetadata={held:true}")
 c,p=setup(browser,base,historical)
 try:
  source=copy.deepcopy(work(p)['source']);ok('bag' in p.locator('#parcel-task').inner_text(),'frozen noun outside current library remains playable');piece(p,'s');p.locator('[data-parcel-check]').tap();ok(work(p)['checks'][-1]['outcome']=='match' and work(p)['source']==source,'check uses historical frozen source unchanged');drawer(p);held=copy.deepcopy(book(p));p.locator('[data-parcel-start]').tap();ok(len(book(p)['parcelLabels']['visits'])==2 and work(p)['source']!=source,'explicit new parcel adds work without rewriting old source');drawer(p);p.locator('[data-parcel-remove-choice]').select_option(book(p)['parcelLabels']['currentId']);p.once('dialog',lambda d:d.accept());p.locator('[data-parcel-remove]').tap();ok(book(p)['parcelLabels']['currentId']=='' and book(p)['parcelLabels']['visits']['parcel-1']['source']==source,'removing current does not auto-open or replace the old visit');ok(p.locator('[data-parcel-disclosure="more"]').get_attribute('open') is not None,'empty-state chooser stays open after removal')
 finally:c.close()
 seed=js_fixture("startParcel(s,{family:'ies',quantity:'more'});setParcelPiece(s,'stem','trim');setParcelPiece(s,'ending','ies');checkParcel(s);keepParcel(s);s.parcelLabels.visits['future']={format:99,raw:['retained']};s.parcelLabels.visits['parcel-1'].firstKept={format:99,raw:'exact'}")
 c,p=setup(browser,base,seed,320,600)
 try:
  held=copy.deepcopy(book(p)['parcelLabels']);p.locator('[data-parcel-keep]').tap();ok(book(p)['parcelLabels']==held,'unreadable kept version not overwritten');piece(p,'es');ok(work(p)['draft']['ending']=='es','unknown kept snapshot leaves working pieces open');ok(book(p)['parcelLabels']['visits']['future']==seed['parcelLabels']['visits']['future'],'unreadable sibling exact')
  drawer(p,'writing');p.evaluate('window.__parcelStorageFail=true');p.locator('[data-parcel-message]').fill('In-memory message after synthetic storage refusal.');ok('In-memory message' in work(p)['ownMessage'],'browser storage failure retains exportable in-memory work');ok('browser saving failed' in p.locator('#parcel-status').inner_text(),'persistence refusal is not claimed as durable saving')
 finally:c.close()

class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
def main():
 seed=js_fixture("for(let i=0;i<12;i++)startParcel(s,{family:'ies',quantity:'more'})")
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('PARCEL_LABELS_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
   try:
    for w,h in [(320,600),(820,1000),(1024,768)]:play(b,base,seed,w,h)
    edges(b,base);ok(not errors,'no page errors '+str(errors));receipt={'checks':checks,'status':'passed','base':base,'limits':'Synthetic Chrome touch/keyboard/transfer; not physical iPad/Safari, VoiceOver, actual text zoom or educational effectiveness.'};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
   finally:b.close()
 finally:server.shutdown()
if __name__=='__main__':main()
