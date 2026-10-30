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
def setup(browser,base,seed,width,height,second=False,fault=False):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 data={'second':second,'seed':seed,'registry':{'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-30T12:00:00.000Z'}]}}
 if second:data['registry']['explorers'].append({**data['registry']['explorers'][0],'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn'})
 c.add_init_script('(d=>{if(!localStorage.getItem("seed-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(d.seed));if(d.second)localStorage.setItem("number-garden-v1:explorer-2",JSON.stringify(d.seed));localStorage.setItem("seed-fixture","1");}window.seedWrites=0;const old=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith("number-garden")||k==="learning-garden-explorers")window.seedWrites++;return old.call(this,k,v);};})('+json.dumps(data)+')')
 if fault:
  def app(route):
   response=route.fetch();body=response.text();begin=body.index('bindSeedExchange(state,{');end=body.index('});bindSpeech();',begin);section=body[begin:end];assert 'canExport:candidate=>' in section
   body=body[:begin]+section.replace('canExport:candidate=>','canExport:candidate=>!window.seedRefuse&&')+body[end:];route.fulfill(response=response,body=body)
  c.route('**/app.mjs',app)
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.on('console',lambda m:errors.append('console: '+m.text) if m.type=='error' else None);p.on('response',lambda r:errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None);p.goto(base+'#desk/exchange',wait_until='networkidle')
 p.locator('[data-seed-root], [data-select-explorer="explorer-1"]').first.wait_for()
 if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').tap()
 p.locator('[data-seed-root]').wait_for();return c,p
def create(p,family,size,read=True):
 drawer(p,'choose');p.locator('[data-seed-family]').select_option(family);p.locator('[data-seed-size]').select_option(str(size));action(p,'start');return work(p) if read else None
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
   if family=='nursery':
    boxes=p.locator('.seed-part').evaluate_all('xs=>xs.map(x=>x.getBoundingClientRect().width)');ok(len(boxes)==8 and max(boxes)-min(boxes)<0.1,'all nursery parts have equal physical width across both towns')
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
def refusal(browser,base,seed):
 c,p=setup(browser,base,seed,820,1000,fault=True)
 try:
  create(p,'apples',3);drawer(p,'note');accepted='Accepted earlier words.';p.locator('[data-seed-note]').fill(accepted);before=book(p);writes=p.evaluate('seedWrites')
  p.locator('[data-seed-note]').evaluate('n=>window.seedInput=n');p.evaluate('window.seedRefuse=true');words='\nVisible <refused> words & a second line.\nKeep these exactly.';p.locator('[data-seed-note]').fill(words)
  def held():
   ok(p.locator('[data-seed-note]').input_value()==words and p.locator('[data-seed-note]').evaluate('n=>n===window.seedInput'),'refusal keeps exact actual textarea')
   ok(book(p)==before and p.evaluate('seedWrites')==writes,'refusal and blocked departure write nothing')
  held()
  for a in ['more','check','keep']:action(p,a);held()
  drawer(p,'help');action(p,'hint');held();drawer(p,'grownup');drawer(p,'grownup',False);held()
  drawer(p,'choose');prior=p.locator('[data-seed-family]').input_value();p.locator('[data-seed-family]').select_option('reed');ok(p.locator('[data-seed-family]').input_value()==prior,'blocked chooser restores selection');held()
  p.locator('#explorer-switch').tap();ok(p.locator('#explorer-cancel').count()==0,'refused text blocks explorer picker');held()
  p.evaluate('location.hash="#notes"');p.wait_for_function('location.hash==="#desk/exchange"');held()
  with p.expect_download() as draft:p.get_by_role('button',name='Download visible draft',exact=True).tap()
  path=OUT/'refused-draft.txt';draft.value.save_as(str(path));ok(path.read_text()==words,'actual temporary draft download is exact');held()
  with p.expect_event('dialog') as unloading:p.close(run_before_unload=True)
  ok(unloading.value.type=='beforeunload','actual browser close asks before discarding refused text');unloading.value.dismiss();held()
  p.evaluate('window.seedRefuse=false');retry='Retried words accepted in this tab.';p.locator('[data-seed-note]').fill(retry);ok(work(p)['ownNote']==retry,'accepted retry updates actual notebook')
  p.evaluate('window.seedRefuse=true');p.locator('[data-seed-note]').fill('Second refused draft.');p.once('dialog',lambda d:d.accept());p.get_by_role('button',name='Restore earlier words',exact=True).tap();ok(p.locator('[data-seed-note]').input_value()==retry and work(p)['ownNote']==retry,'explicit restore retains last accepted exact words')
  p.evaluate('window.seedRefuse=false;location.hash="#notes"');p.locator('#download').wait_for();ok(True,'resolved draft releases navigation guard')
  print('refused-draft journey passed',flush=True)
 finally:c.close()

def export_notes(p,label):
 p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
 with p.expect_download() as exported:p.locator('#download').tap()
 path=OUT/(label+'.json');exported.value.save_as(str(path));return json.loads(path.read_text())
def lifecycle(browser,base,seed):
 c,p=setup(browser,base,seed,820,1000,second=True)
 try:
  create(p,'apples',3);p.locator('[data-seed-action="more"]').focus();p.keyboard.press('Enter');p.keyboard.press('Space');ok(work(p)['draft']['groups']==2,'native Enter/Space build groups')
  p.evaluate('window.seedOld=[...document.querySelectorAll("[data-seed-root] button")]');held=book(p);action(p,'more');changed=book(p);p.evaluate('seedOld.forEach(e=>e.click())');ok(book(p)==changed,'detached pre-render actions are inert')
  drawer(p,'help');action(p,'hint');drawer(p,'help',False);hear=p.locator('[data-seed-root] [data-speak]');hear.tap();spoken=hear.get_attribute('data-speak');ok(work(p)['source']['prompt'] in spoken and work(p)['source']['hint'] not in spoken,'Hear includes current prompt and excludes closed hint')
  p.evaluate('window.seedOld=[...document.querySelectorAll("[data-seed-root] button")];window.seedHear=document.querySelector("[data-seed-root] [data-speak]");location.hash="#notes";window.seedDeparted=seedHear.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));');p.locator('#download').wait_for();ok(p.evaluate('seedDeparted') is False,'same-tick departed Hear is canceled');before=book(p);p.evaluate('seedOld.forEach(e=>e.click())');ok(book(p)==before,'same-tick departed actions cannot change notebook')
  p.evaluate('location.hash="#desk/exchange"');p.locator('[data-seed-root]').wait_for();ok(work(p)['draft']['groups']==3,'route return keeps the actual saved card')
  p.evaluate('window.seedOld=[...document.querySelectorAll("[data-seed-root] button")]');p.locator('#explorer-switch').tap();p.locator('#explorer-cancel').wait_for();before=book(p);p.evaluate('seedOld.forEach(e=>e.click())');ok(book(p)==before,'picker disables old table controls');p.locator('#explorer-cancel').tap();p.locator('[data-seed-root]').wait_for();p.evaluate('seedOld.forEach(e=>e.click())');ok(book(p)==before,'cancel picker restores saved work without stale edits')
  first=book(p);p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();p.locator('[data-seed-root]').wait_for();ok('seedExchange' not in book(p),'second explorer gets separate initial table');p.evaluate('seedOld.forEach(e=>e.click())');ok('seedExchange' not in book(p),'first explorer cannot create work for second')
  create(p,'nursery',2);action(p,'more');ok(work(p)['draft']['partValue']==1,'second explorer can build their own share');old=p.evaluate('JSON.parse(localStorage.getItem("number-garden-v1:explorer-1"))');ok(old==first,'second explorer leaves first notebook exact')
  p.evaluate('window.seedOld=[...document.querySelectorAll("[data-seed-root] button")];location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"')
  film=p.locator('dialog.welcome-film[open]')
  if film.count():film.locator('[data-film-skip]').tap()
  p.evaluate('location.hash="#desk/exchange"');p.locator('[data-seed-root]').wait_for();ok('seedExchange' not in book(p),'explicit reset clears only active explorer cards');p.evaluate('seedOld.forEach(e=>e.click())');ok('seedExchange' not in book(p),'stale reset-era controls cannot resurrect cards');ok(p.evaluate('JSON.parse(localStorage.getItem("number-garden-v1:explorer-1"))')==first,'reset leaves other explorer exact')
  print('lifecycle journey passed',flush=True)
 finally:c.close()
def persistence(browser,base,seed):
 for mode in ['off','failure']:
  c,p=setup(browser,base,seed,820,1000)
  try:
   if mode=='off':
    p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#desk/exchange"');p.locator('[data-seed-root]').wait_for();create(p,'apples',2,read=False)
   else:
    create(p,'apples',2);p.evaluate('()=>{const old=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith("number-garden")||k==="learning-garden-explorers")throw new DOMException("Synthetic storage failure","QuotaExceededError");return old.call(this,k,v);};}')
   before=p.evaluate('()=>[localStorage.getItem("learning-garden-explorers"),localStorage.getItem("number-garden-v1:explorer-1")]');drawer(p,'note');words='Session words after '+mode;p.locator('[data-seed-note]').fill(words);status=p.locator('#seed-status').inner_text();ok(('saving is off' if mode=='off' else 'browser saving failed') in status,'actual persistence result stated for '+mode);ok(p.evaluate('()=>[localStorage.getItem("learning-garden-explorers"),localStorage.getItem("number-garden-v1:explorer-1")]')==before,'device storage unchanged for '+mode)
   report=export_notes(p,'storage-'+mode);r=report['seedExchange'];ok(r['visits'][r['currentId']]['ownNote']==words,'actual Notes retains in-memory words for '+mode)
  finally:c.close()
 print('persistence journeys passed',flush=True)

def fixture(code):
 js="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import * as exchange from './dist/seed-exchange-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={held:'exact'};"+code+";console.log(JSON.stringify(s));"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
def edges(browser,base):
 unknown=fixture("s.seedExchange={version:99,raw:{kept:'<exact>'}}")
 c,p=setup(browser,base,unknown,320,600)
 try:
  held=book(p)['seedExchange'];ok(p.locator('[data-seed-action]').count()==0,'unknown root offers no mutation controls');report=export_notes(p,'unknown-root');ok(report['seedExchange']==held,'actual export preserves unknown root')
 finally:c.close()
 malformed=fixture("exchange.startSeedExchange(s,{size:2});const w=s.seedExchange.visits['exchange-1'];w.firstKept={format:99,raw:'<future>'};s.seedExchange.visits.future={version:99,raw:['kept']}")
 c,p=setup(browser,base,malformed,320,600)
 try:
  held=book(p)['seedExchange'];action(p,'keep');ok(book(p)['seedExchange']==held and 'cannot be read' in p.locator('#seed-status').inner_text(),'unreadable kept version cannot be overwritten');action(p,'more');ok(work(p)['draft']['groups']==1,'working model stays editable beside unknown snapshot');report=export_notes(p,'unknown-snapshot');ok(report['seedExchange']['visits']['exchange-1']['firstKept']==held['visits']['exchange-1']['firstKept'] and report['seedExchange']['visits']['future']==held['visits']['future'],'actual export keeps raw versions/siblings exact')
 finally:c.close()
 for kind,code in [('capacity',"for(let i=0;i<12;i++)exchange.startSeedExchange(s)"),('collision',"exchange.startSeedExchange(s);s.seedExchange.nextSerial=1"),('check-cap',"exchange.startSeedExchange(s);for(let i=0;i<24;i++)exchange.checkSeedExchange(s)")]:
  c,p=setup(browser,base,fixture(code),820,1000)
  try:
   held=book(p)['seedExchange']
   if kind=='check-cap':action(p,'check');ok(book(p)['seedExchange']==held,'native check cap retains all history')
   else:
    drawer(p,'choose');ok(p.locator('[data-seed-action="start"]:visible').is_disabled(),'native '+kind+' blocks new card without resetting');action(p,'more');ok(work(p)['draft']['groups']==1,'native '+kind+' leaves model editable')
    if kind=='capacity':
     p.locator('[data-seed-remove]').select_option('exchange-1');p.once('dialog',lambda d:d.accept());action(p,'remove');action(p,'start');ok(book(p)['seedExchange']['currentId']=='exchange-13' and 'exchange-1' not in book(p)['seedExchange']['visits'],'explicit removal frees slot without reusing id')
  finally:c.close()
 old=fixture("exchange.startSeedExchange(s,{size:6});const z=s.seedExchange.visits['exchange-1'].source;Object.assign(z,{basketRate:4,reedRate:7,stock:26,prompt:'Earlier card: 26 baskets, four baskets for seven bundles.',rule:'Four baskets for seven bundles',hint:'Earlier help: group four baskets.'});z.feedback.match='Earlier result: send 24 baskets; receive 42 bundles; leave two baskets.';z.futureMetadata={exact:true};Object.assign(z.example,{basketRate:4,reedRate:7,stock:4*z.example.size,steps:['An earlier four-for-seven example.']})")
 c,p=setup(browser,base,old,820,1000)
 try:
  source=work(p)['source'];ok(p.locator('.seed-trade svg').count()==11,'historical four-for-seven picture retains eleven objects');ok('Earlier card' in p.locator('.seed-request').inner_text(),'historical prose retained');drawer(p,'help');action(p,'hint');ok('Earlier help' in p.locator('#seed-hint').inner_text(),'historical help retained');action(p,'example');ok(p.locator('.seed-trade svg').count()==11,'historical separate example uses its own rates');action(p,'close-example')
  for _ in range(6):action(p,'more')
  action(p,'check');action(p,'keep');ok('42 bundles' in p.locator('.seed-totals').inner_text() and work(p)['ready'],'historical rule checks and counts agree');ok(work(p)['source']==source,'native operations never rewrite old source');p.reload(wait_until='networkidle');p.locator('[data-seed-root]').wait_for();ok(work(p)['source']==source and work(p)['firstKept']['source']==source,'old source and first version survive reload')
 finally:c.close()
 nursery=fixture("exchange.startSeedExchange(s,{family:'nursery',size:10});const z=s.seedExchange.visits['exchange-1'].source;Object.assign(z,{parts:[2,1],total:30,prompt:'Earlier nursery card: thirty seedlings in two-to-one parts.',rule:'Two parts and one part: three parts altogether',hint:'Count all three parts.'});Object.assign(z.example,{parts:[2,1],total:3*z.example.size,steps:['Earlier three-part example.']})")
 c,p=setup(browser,base,nursery,320,600)
 try:
  ok(p.locator('.seed-part').count()==3,'historical nursery keeps three source-defined boxes');widths=p.locator('.seed-part').evaluate_all('xs=>xs.map(x=>x.getBoundingClientRect().width)');ok(max(widths)-min(widths)<0.1,'historical parts stay equal width across towns')
  for _ in range(10):action(p,'more')
  action(p,'check');ok(work(p)['ready'] and '20 seedlings' in p.locator('.seed-totals').inner_text(),'historical two-to-one nursery remains solvable');layout(p)
 finally:c.close()
 unreachable=fixture("exchange.startSeedExchange(s,{size:12});Object.assign(s.seedExchange.visits['exchange-1'].source,{basketRate:1,stock:13})")
 c,p=setup(browser,base,unreachable,820,1000)
 try:
  held=book(p)['seedExchange']['visits']['exchange-1'];ok(p.locator('[data-seed-action="more"]').count()==0,'unreachable old model is unavailable rather than misdrawn');action(p,'start');ok(book(p)['seedExchange']['visits']['exchange-1']==held and book(p)['seedExchange']['currentId']=='exchange-2','new card can open without changing unreachable old source')
 finally:c.close()
 print('historical and bounded-record journeys passed',flush=True)

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
    refusal(browser,base,seed)
    lifecycle(browser,base,seed)
    persistence(browser,base,seed)
    edges(browser,base)
    ok(not errors,'no page, console or HTTP errors '+str(errors))
    result={'checks':checks,'status':'passed','base':base,'scope':'Model/notes and real transfer journeys; refused drafts, route/explorer lifecycle and persistence included; historical and bounded-record edge cases included; reset included; hosted acceptance pending.'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
   finally:browser.close()
 finally:server.shutdown()
