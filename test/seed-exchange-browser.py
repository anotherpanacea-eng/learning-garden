"""Synthetic native seed-exchange journeys. No real learner records.
SEED_EXCHANGE_TEST_URL selects a deployed origin. Physical iPad/Safari,
audible speech, screen-reader speech and learning effects are unqualified.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SEED_EXCHANGE_ARTIFACTS',tempfile.mkdtemp(prefix='seed-exchange-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def book(p):
 return p.evaluate('()=>{const r=JSON.parse(localStorage.getItem("learning-garden-explorers"));return JSON.parse(localStorage.getItem("number-garden-v1:"+r.activeId));}')
def work(p):
 r=book(p)['seedExchange'];return r['visits'][r['currentId']]
def drawer(p,name,opened=True):
 d=p.locator('[data-seed-panel="'+name+'"]')
 if (d.get_attribute('open') is not None)!=opened:d.locator('summary').tap()
def action(p,name):p.locator('[data-seed-action="'+name+'"]:visible').first.tap()
def setup(browser,base,seed,width,height):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 data={'seed':seed,'registry':{'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-30T12:00:00.000Z'}]}}
 c.add_init_script('(d=>{if(!localStorage.getItem("seed-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(d.seed));localStorage.setItem("seed-fixture","1");}window.seedWrites=0;const old=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith("number-garden")||k==="learning-garden-explorers")window.seedWrites++;return old.call(this,k,v);};})('+json.dumps(data)+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+'#desk/exchange',wait_until='networkidle');p.locator('[data-seed-root]').wait_for();return c,p
def create(p,family,size):
 drawer(p,'choose');p.locator('[data-seed-family]').select_option(family);p.locator('[data-seed-size]').select_option(str(size));action(p,'start');return work(p)
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 for el in p.locator('.seed-page button:visible,.seed-page select:visible,.seed-page a:visible,.seed-page summary:visible').all():
  r=el.bounding_box();ok(r and r['height']>=43.9,'44px target '+el.inner_text()[:40])
def journey(browser,base,seed,width,height):
 c,p=setup(browser,base,seed,width,height)
 try:
  ok(p.locator('[data-seed-action="start"]:visible').count()==1,'preview has one visible start')
  for family,size in [('apples',2),('reed',3),('nursery',5)]:
   w=create(p,family,size);source=w['source'];ok(source['family']==family and source['size']==size,'manual family/size honored');layout(p)
   if width>=820:
    for selector in ['.seed-request','.seed-table figure','[data-seed-action="more"]']:
     box=p.locator(selector).bounding_box();ok(box['y']>=0 and box['y']+box['height']<=height,'initial tablet work visible: '+selector)
   p.screenshot(path=str(OUT/f'{family}-{width}-start.png'))
   action(p,'check');ok(work(p)['checks'][0]['outcome']=='different' and work(p)['checks'][0]['supported'],'empty first check supported and retained')
   for _ in range(size):action(p,'more')
   action(p,'check');ok(work(p)['ready'] and work(p)['checks'][-1]['outcome']=='match','fitting construction checked')
   drawer(p,'note');note='\nKeep <these> exact words & punctuation.\nThe courier can ask me.'
   p.locator('[data-seed-note]').fill(note);ok(work(p)['ownNote']==note,'original words accepted exactly');action(p,'keep');ok(work(p)['firstKept']['ownNote']==note,'first note kept exactly')
   drawer(p,'note');ok(p.locator('[data-seed-note]').input_value()==note,'textarea preserves leading newline through render')
   before=book(p);identity=p.locator('[data-seed-note]').evaluate('(n)=>{window.seedInput=n;return true}');writes=p.evaluate('seedWrites')
   drawer(p,'grownup');drawer(p,'grownup',False);ok(p.locator('[data-seed-note]').evaluate('n=>n===window.seedInput') and p.evaluate('seedWrites')==writes and book(p)==before,'native details preserve actual input and zero writes')
   drawer(p,'help');action(p,'hint');ok(work(p)['help']['hint'],'hint exposure recorded');action(p,'example');ok('separate worked example' in p.locator('#seed-task').inner_text(),'separate example opens');ok(work(p)['source']==source,'example never replaces current source');action(p,'close-example');ok(work(p)['ownNote']==note,'return keeps original words')
   action(p,'less');action(p,'more');ok(not work(p)['ready'],'edit-away/back clears fitting stamp');action(p,'keep');ok(work(p)['latestKept']['status']=='working' and work(p)['firstKept']['ownNote']==note,'revision keeps first and no resurrected fit')
   p.reload(wait_until='networkidle');p.locator('[data-seed-root]').wait_for();ok(work(p)['source']==source and not work(p)['ready'],'reload preserves frozen source and readiness invalidation');layout(p)
  before=book(p);source_id=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
  p.evaluate('window.seedStale=[...document.querySelectorAll("[data-seed-root] button")];location.hash="#notes";')
  p.locator('#download').wait_for()
  with p.expect_download() as exported:p.locator('#download').tap()
  path=OUT/f'{width}-notes.json';exported.value.save_as(str(path));report=json.loads(path.read_text());ok(report['seedExchange']==before['seedExchange'],'actual Notes download includes exact cards/first/latest/source/writing')
  invalid={'name':'synthetic-invalid.json','mimeType':'application/json','buffer':json.dumps({'not':'a notebook'}).encode()}
  p.locator('#progress-file').set_input_files(invalid);p.locator('#progress-import-status').filter(has_text='not supported').wait_for();ok(book(p)==before,'invalid import leaves current cards exact')
  data={'name':'synthetic-seed-exchange.json','mimeType':'application/json','buffer':json.dumps(report).encode()}
  p.locator('#progress-file').set_input_files(data);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-cancel').tap();ok(book(p)==before,'canceling valid import preserves source explorer')
  p.locator('#progress-file').set_input_files(data);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
  new_id=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');ok(new_id!=source_id,'actual import creates a separate explorer')
  old=p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',source_id);ok(old==before,'original explorer unchanged after import')
  p.evaluate('location.hash="#desk/exchange"');p.locator('[data-seed-root]').wait_for();ok(book(p)['seedExchange']==before['seedExchange'],'imported cards reopen with exact source/revisions')
  held=book(p);p.evaluate('window.seedStale.forEach(e=>e.click())');ok(book(p)==held,'detached original explorer controls cannot mutate imported work')
  ok(not errors,'no page errors '+str(errors));print('families at',width,'passed',flush=True)
 finally:c.close()
if __name__=='__main__':
 js="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={held:'exact'};console.log(JSON.stringify(s));"
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('SEED_EXCHANGE_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');args={'headless':True,'args':['--disable-quic']}
   if Path(chrome).exists():args['executable_path']=chrome
   browser=pw.chromium.launch(**args)
   try:
    for width,height in [(320,600),(820,1000),(1024,768)]:journey(browser,base,seed,width,height)
    result={'checks':checks,'status':'passed','base':base,'scope':'Model/notes and real transfer journeys; refusal, broader lifecycle and hosted acceptance still pending.'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
   finally:browser.close()
 finally:server.shutdown()
