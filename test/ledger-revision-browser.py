"""Synthetic actual-app revision journeys; no real learner writing.
Only refusal contexts intercept the actual canExport seam. Ordinary journeys use
unchanged application modules. This does not qualify physical Apple or audibility.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('REVISION_ARTIFACTS',tempfile.mkdtemp(prefix='ledger-revision-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[];ROUTE='#learn/science/ledger'
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def fixture(code=''):
 script="import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import * as L from './dist/ledger-gauge-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={version:77,exact:'untouched sibling'};L.startLedger(s);L.pageLedger(s,'note');L.partLedger(s,'reason');const w=()=>L.ledgerView(s).work;"+code+";console.log(JSON.stringify(s));"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
def book(p):return p.evaluate('()=>{const r=JSON.parse(localStorage.getItem("learning-garden-explorers"));return JSON.parse(localStorage.getItem("number-garden-v1:"+r.activeId));}')
def work(p):
 r=book(p)['ledgerGauge'];return r['visits'][r['current']]
def revision(p):return work(p)['revision']
def tap(p,selector):p.locator(selector).tap()
def tab(p,name):tap(p,'.ledger-revision-tabs [data-ledger-revision-tab="'+name+'"]')
def ready(p):
 p.locator('#explorer-header').wait_for();chosen=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers"))?.activeId')
 if chosen and p.locator('[data-select-explorer="'+chosen+'"]').count():tap(p,'[data-select-explorer="'+chosen+'"]')
 p.locator('[data-ledger-root]').wait_for()
def setup(browser,base,seed,width=820,height=1000,fault=False):
 ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-30T12:00:00.000Z'},{'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-10-30T12:00:00.000Z'}]}
 ctx.add_init_script('(d=>{if(!localStorage.getItem("revision-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem("number-garden-v1:"+e.id,JSON.stringify(d.seed));localStorage.setItem("revision-fixture","1");}window.revisionWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.revisionFailStorage)throw new Error("synthetic storage failure");if(k.startsWith("number-garden")||k==="learning-garden-explorers")window.revisionWrites++;return set.call(this,k,v);};})('+json.dumps({'registry':registry,'seed':seed})+')')
 if fault:
  def intercept(route):
   response=route.fetch();body=response.text();needle='function priceOptions(){return {canExport:candidate=>';assert body.count(needle)==1
   route.fulfill(response=response,body=body.replace(needle,needle+'!window.revisionRefuse&&',1))
  ctx.route('**/app.mjs',intercept)
 p=ctx.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);p.on('response',lambda r:errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None);p.goto(base+ROUTE,wait_until='networkidle');ready(p);return ctx,p

def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 for el in p.locator('[data-ledger-revision] button:visible,[data-ledger-revision] select:visible').all():
  box=el.bounding_box();ok(box and box['height']>=43.9,'44px target '+el.inner_text()[:40])
def edit(p,text):p.locator('[data-ledger-own="reason"]').fill(text)
def export(p,label):
 p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
 with p.expect_download() as d:tap(p,'#download')
 path=OUT/(label+'.json');d.value.save_as(str(path));return json.loads(path.read_text())
def back(p):p.evaluate('location.hash="'+ROUTE+'"');ready(p)
def hear(p):
 tap(p,'[data-ledger-root] [data-speak]');return p.locator('[data-ledger-root] [data-speak]').get_attribute('data-speak')
def journey(browser,base,seed,width,height):
 ctx,p=setup(browser,base,seed,width,height)
 try:
  ok('revision' not in work(p),'arrival creates no conversation');p.locator('[data-ledger-plan]').select_option('wall');edit(p,'\nFirst synthetic reason.');field=p.locator('[data-ledger-own="reason"]').element_handle();edit(p,'\nFirst synthetic reason.');ok(field.evaluate('e=>e.isConnected'),'typing preserves existing editor node');tap(p,'[data-ledger-keep]');legacy=copy.deepcopy(work(p)['firstKept']);before_roots=book(p)
  tap(p,'[data-ledger-revision-start]');r=revision(p);before=copy.deepcopy(r['before']);ok(before['renderedParts'][1]['text']=='\nFirst synthetic reason.','before captures exact first words');ok(r['opened']==['costs'],'first request committed before reveal');ok(p.evaluate('document.activeElement.id==="ledger-reader-heading"'),'opened question receives focus');ok("Questions to try, not a score" in p.locator('[data-ledger-revision]').inner_text(),'authored question limit visible');ok(p.locator('[data-ledger-reader]').count()==3,'all three readers open');ok(p.locator('[data-ledger-part]').count()==1,'existing writing part chooser available with reader');layout(p)
  for key in ['costs','evidence','next']:
   button=p.locator('[data-ledger-reader="'+key+'"]');button.focus();p.keyboard.press('Enter');r=revision(p);card=next(c for c in r['source']['cards'] if c['id']==key);ok(r['currentId']==key and key in r['opened'],'requested reader saved');ok(card['question'] in p.locator('.ledger-reader-card').inner_text(),'actual selected question');spoken=hear(p);ok(card['question'] in spoken and card['prompt'] in spoken,'Hear includes active question');ok(all(c['question'] not in spoken for c in r['source']['cards'] if c['id']!=key),'hidden reader questions not spoken')
  p.screenshot(path=str(OUT/f'reader-{width}.png'),full_page=True);tab(p,'draft');ok(p.evaluate('document.activeElement.id==="ledger-question"'),'return focuses existing writing part');ok(p.locator('[data-ledger-own="reason"]').input_value()=='\nFirst synthetic reason.','return keeps original editor material');p.locator('[data-ledger-plan]').select_option('sponge');edit(p,'Second synthetic reason.');tap(p,'[data-ledger-revision-keep]');after=copy.deepcopy(revision(p)['after']);ok(p.evaluate('document.activeElement.id==="ledger-revision-heading"'),'keep focuses comparison');p.locator('[data-ledger-revision-part]').select_option('reason');pictures=p.locator('.ledger-revision-picture');ok(pictures.count()==2,'two compact kept pictures');ok('\nFirst synthetic reason.' in pictures.nth(0).inner_text(),'actual before words visible');ok('Second synthetic reason.' in pictures.nth(1).inner_text(),'actual revised words visible');ok(before['source']['plans'][0]['title'] in pictures.nth(0).inner_text(),'before uses its own plan label');ok(after['source']['plans'][1]['title'] in pictures.nth(1).inner_text(),'after uses changed plan');layout(p)
  if width>=820:
   boxes=pictures.evaluate_all('xs=>xs.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y}))');ok(boxes[0]['x']<boxes[1]['x'] and abs(boxes[0]['y']-boxes[1]['y'])<1,'tablet pictures side by side')
  spoken=hear(p);ok('First synthetic reason.' in spoken and 'Second synthetic reason.' in spoken,'Hear reads both exact kept parts');ok(all(c['question'] not in spoken for c in r['source']['cards']),'comparison omits hidden questions');p.screenshot(path=str(OUT/f'compare-{width}.png'),full_page=True)
  held=book(p);writes=p.evaluate('revisionWrites');tab(p,'draft');tab(p,'compare');p.locator('[data-ledger-revision-part]').select_option('objection');ok(book(p)==held and p.evaluate('revisionWrites')==writes,'local tabs and comparison part do not save');p.locator('[data-ledger-revision-part]').select_option('reason');tab(p,'draft');edit(p,'Third synthetic reason.');tab(p,'compare');ok('Second synthetic reason.' in p.locator('.ledger-revision-picture').nth(1).inner_text() and 'Third synthetic reason.' not in p.locator('.ledger-revision-pictures').inner_text(),'saved after is not live draft');tab(p,'draft');tap(p,'[data-ledger-revision-keep]');ok(revision(p)['before']==before,'before immutable through edits/readers/plan/keeps');ok(revision(p)['after']['renderedParts'][1]['text']=='Third synthetic reason.','only latest revision replaced');ok(work(p)['firstKept']==legacy and work(p)['kept']==legacy,'legacy case-note keeps independent');ok(book(p)['syntheticOther']==before_roots['syntheticOther'],'other game exact');saved=copy.deepcopy(book(p)['ledgerGauge']);p.reload(wait_until='networkidle');ready(p);ok(book(p)['ledgerGauge']==saved,'actual reload preserves full conversation');tab(p,'compare');old=p.locator('.ledger-revision-tabs [data-ledger-revision-tab="draft"]').element_handle();old_audio=p.locator('[data-ledger-root] [data-speak]').element_handle();report=export(p,'journey-'+str(width));ok(report['ledgerGauge']==saved,'real Notes exports exact conversation');held=book(p);old.evaluate('e=>e.click()');old_audio.evaluate('e=>e.click()');ok(book(p)==held,'departed controls and Hear cannot mutate');payload={'name':'synthetic-revision.json','mimeType':'application/json','buffer':json.dumps(report).encode()}
  p.locator('#progress-file').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':b'{"not":"notebook"}'});p.locator('#progress-import-status').filter(has_text='not supported').wait_for();ok(book(p)==held,'invalid import unchanged');p.locator('#progress-file').set_input_files(payload);p.locator('#progress-import-confirm').wait_for();tap(p,'#progress-import-cancel');ok(book(p)==held,'cancelled import unchanged');old_id=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');p.locator('#progress-file').set_input_files(payload);p.locator('#progress-import-confirm').wait_for();tap(p,'#progress-import-confirm');p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();back(p);ok(book(p)['ledgerGauge']==saved,'imported explorer exact');tab(p,'draft');edit(p,'Imported explorer words.');imported=copy.deepcopy(book(p)['ledgerGauge']);stale=p.locator('[data-ledger-revision-keep]').element_handle();tap(p,'#explorer-switch');tap(p,'[data-select-explorer="'+old_id+'"]');ready(p);held=book(p);stale.evaluate('e=>e.click()');ok(book(p)==held and book(p)['ledgerGauge']==saved,'other explorer stale controls inert');ok(imported!=saved,'imported explorer editing stays separate')
  if width==820:
   p.evaluate('location.hash="#notes"');tap(p,'#reset');tap(p,'#confirm-reset');p.wait_for_function('location.hash==="#home"');p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-ledger-start]').first.wait_for();ok('ledgerGauge' not in book(p),'confirmed reset clears active ledger');stale.evaluate('e=>e.click()');ok('ledgerGauge' not in book(p),'reset-era controls cannot resurrect conversation')
  print('Revision journey',width,'passed',flush=True)
 except Exception:
  p.screenshot(path=str(OUT/f'failure-{width}.png'),full_page=True);(OUT/f'failure-{width}.json').write_text(json.dumps({'body':p.locator('body').inner_text(),'errors':errors,'book':book(p)},indent=2));raise
 finally:ctx.close()

def refusal(browser,base,seed):
 ctx,p=setup(browser,base,seed,fault=True)
 try:
  held=book(p);p.evaluate('window.revisionRefuse=true');tap(p,'[data-ledger-revision-start]');ok(book(p)==held and not p.locator('[data-ledger-reader]').count(),'refused start reveals no card and changes no state');p.evaluate('window.revisionRefuse=false');tap(p,'[data-ledger-revision-start]');held=book(p);question=p.locator('.ledger-reader-card').inner_text();p.evaluate('window.revisionRefuse=true');tap(p,'[data-ledger-reader=evidence]');ok(book(p)==held and p.locator('.ledger-reader-card').inner_text()==question,'refused reader leaves question/opened unchanged');tap(p,'[data-ledger-revision-keep]');ok(book(p)==held,'refused keep atomic');tab(p,'draft');edit(p,'Visible refused words.');ok(book(p)==held and p.locator('[data-ledger-own="reason"]').get_attribute('aria-invalid')=='true','refused writing stays visible and marked');tab(p,'reader');tap(p,'[data-ledger-revision-keep]');tap(p,'#explorer-switch');p.locator('[data-ledger-revision-tab=compare]').focus();p.keyboard.press('Enter');p.keyboard.press('Space');ok(book(p)==held and p.locator('[data-ledger-own="reason"]').input_value()=='Visible refused words.','dirty new controls, keyboard and explorer switch blocked');p.evaluate('location.hash="#home"');p.wait_for_function('location.hash==="'+ROUTE+'"');ok(p.locator('[data-ledger-own="reason"]').input_value()=='Visible refused words.','dirty hash navigation retains copyable text');p.once('dialog',lambda d:d.dismiss());tap(p,'[data-ledger-restore]');ok(p.locator('[data-ledger-own="reason"]').input_value()=='Visible refused words.','cancel restore exact');p.once('dialog',lambda d:d.accept());tap(p,'[data-ledger-restore]');ok(book(p)==held and p.locator('[data-ledger-own="reason"]').input_value()=='','restore saved words changes UI only');p.evaluate('window.revisionRefuse=false');edit(p,'Retried words.');tap(p,'[data-ledger-revision-keep]');ok(revision(p)['after']['renderedParts'][1]['text']=='Retried words.','retry remains usable')
 finally:ctx.close()

def retained(browser,base):
 cases=[('future',fixture("w().revision={version:99,exact:'retain me'}")),('after',fixture("L.startLedgerRevision(s);w().revision.after={version:99,exact:'retain after'}")),('old',fixture("L.startLedgerRevision(s);const r=w().revision;r.source.cards=[{id:'older',name:'Earlier reader',role:'Earlier role',question:'Earlier exact question?',prompt:'Earlier exact prompt.'}];r.currentId='older';r.opened=['older'];r.before.source.parts.reverse();r.before.source.plans[0].title='Earlier exact plan';r.before.planId='wall'"))]
 for name,seed in cases:
  ctx,p=setup(browser,base,seed)
  try:
   old=copy.deepcopy(revision(p))
   if name=='future':ok(not p.locator('[data-ledger-revision-start]').count(),'unknown conversation cannot be replaced');edit(p,'Healthy ordinary writing.');ok(revision(p)==old,'unknown revision retained while editor works')
   elif name=='after':ok(not p.locator('[data-ledger-revision-keep]').count(),'unreadable after cannot be overwritten');tab(p,'compare');ok('Latest kept revision cannot be read' in p.locator('[data-ledger-revision]').inner_text(),'latest explicitly unreadable');tab(p,'draft');edit(p,'Healthy ordinary writing.');ok(revision(p)==old,'bad after retained exactly')
   else:tab(p,'reader');ok(p.locator('[data-ledger-reader]').count()==1,'historical card count not today catalog');ok('Earlier exact question?' in p.locator('.ledger-reader-card').inner_text(),'historical question not replaced');tab(p,'compare');ok('Earlier exact plan' in p.locator('.ledger-revision-picture').inner_text(),'before uses its old plan label')
   current=copy.deepcopy(book(p)['ledgerGauge']);ok(export(p,'retained-'+name)['ledgerGauge']==current,'retained source actual Notes transfer')
  finally:ctx.close()

def storage(browser,base,seed):
 for mode in ['off','failure']:
  ctx,p=setup(browser,base,seed)
  try:
   if mode=='off':p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();back(p)
   else:p.evaluate('window.revisionFailStorage=true')
   edit(p,'In-memory first.');tap(p,'[data-ledger-revision-start]');tab(p,'draft');edit(p,'In-memory revision.');tap(p,'[data-ledger-revision-keep]');report=export(p,'storage-'+mode);r=report['ledgerGauge']['visits'][report['ledgerGauge']['current']]['revision'];ok(r['before']['renderedParts'][1]['text']=='In-memory first.' and r['after']['renderedParts'][1]['text']=='In-memory revision.','actual Notes preserves in-memory work with storage '+mode)
  finally:ctx.close()

def main():
 seed=fixture('')
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('REVISION_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 with sync_playwright() as pw:
  chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');browser=pw.chromium.launch(headless=True,executable_path=chrome if Path(chrome).exists() else None,args=['--disable-quic'])
  try:
   for width,height in [(320,600),(820,1000),(1024,768)]:journey(browser,base,seed,width,height)
   refusal(browser,base,seed);retained(browser,base);storage(browser,base,seed);ok(not errors,'no page/console/HTTP errors '+str(errors));result={'status':'passed','checks':checks,'base':base,'scope':'actual app, synthetic notes, touch/keyboard, frozen drafts, transfer, storage and fault-only canExport refusal; physical Apple and audible output unqualified'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
  finally:browser.close();server.shutdown()
if __name__=='__main__':main()
