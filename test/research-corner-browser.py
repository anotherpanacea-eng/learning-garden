"""Native370 supplied-source journeys, synthetic owners and real Notes transfer.
No application or speech substitution; only the explicit refusal seam is faulted.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('RESEARCH_CORNER_ARTIFACTS',tempfile.mkdtemp(prefix='research-corner-')));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('writing_legacy',ROOT/'test/writing-table-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h);h.OUT=OUT

def choose(p,id):
 h.drawer(p,'shelf');p.locator('[data-writing-bench=research]').tap();p.locator('[data-writing-open="'+id+'"]').tap()
def reference(p,note,scope='current'):
 return p.locator('[data-writing-reference="'+note+'"][data-writing-reference-scope="'+scope+'"]').first

def inspect(p,note,line,number,scope='current'):
 if scope!='current':h.drawer(p,'versions')
 before=copy.deepcopy(h.book(p));writes=p.evaluate('writingWrites');button=reference(p,note,scope);button.focus();button.click();box=p.locator('.wt-source-inspector');box.wait_for();h.ok(p.evaluate('document.activeElement.id==="writing-source-title"'),'inspector heading receives focus')
 marked=box.locator('[data-writing-line="'+line+'"]');h.ok('wt-referenced' in marked.get_attribute('class') and 'Referenced line' in marked.inner_text(),'source-local locator highlighted with visible text');h.ok(marked.evaluate('e=>[...e.parentElement.children].indexOf(e)+1')==number and ('line '+str(number)) in button.inner_text(),'frozen card original line number shown');h.ok(box.locator('[data-writing-line]').count()>=2,'full surrounding card retained');h.ok(h.book(p)==before and p.evaluate('writingWrites')==writes,'inspection has no notebook writes')
 h.action(p,'close-source');h.ok(button.evaluate('e=>document.activeElement===e'),'close restores originating reference');h.ok(h.book(p)==before and p.evaluate('writingWrites')==writes,'close has no notebook writes')

def journey(browser,base,seed):
 c,p=h.setup(browser,base,seed)
 try:
  h.ok('writingDesk' not in h.book(p),'arrival does not initialise research');h.action(p,'research');h.ok(h.work(p)['source']['id']=='research-organise','direct entry opens organiser');h.layout(p)
  reference(p,'season').click();p.locator('[data-writing-strip=tail]').tap();p.locator('[data-writing-destination=spawn]').tap();h.ok(p.locator('.wt-source-inspector').is_visible(),'source remains open while arranging');h.action(p,'close-source');h.ok(reference(p,'season').evaluate('e=>e===document.activeElement'),'Close restores note identity after reference order changes');h.action(p,'put-back')
  h.drawer(p,'sources');p.locator('[data-writing-card=guide]').click();h.drawer(p,'sources',False);h.action(p,'close-source');h.ok(p.evaluate('document.activeElement.id==="writing-task-title"'),'Close uses visible heading when originating panel was collapsed')
  p.locator('[data-writing-strip=legs]').tap();h.drawer(p,'help');h.drawer(p,'teaching');before=copy.deepcopy(h.book(p));p.evaluate('window.selectedStrip=document.querySelector("[data-writing-strip=legs]")');inspect(p,'legs','g3',3);h.ok(p.evaluate('document.querySelector("[data-writing-strip=legs]").getAttribute("aria-pressed")==="true"'),'inspection retains selected strip/control');h.ok(p.locator('[data-writing-panel=help]').get_attribute('open') is not None and p.locator('[data-writing-panel=teaching]').get_attribute('open') is not None,'inspection retains open panels')
  p.locator('[data-writing-destination=spawn]').tap();h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='incomplete','unfinished kept arrangement is supported');h.action(p,'keep');first=copy.deepcopy(h.work(p)['firstKept']);inspect(p,'legs','g3',3,'first')
  for note,heading in [('season','spawn'),('pond-date','spawn'),('tail','change')]:p.locator('[data-writing-strip='+note+']').tap();p.locator('[data-writing-destination='+heading+']').tap()
  h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different','complete unexpected grouping checked literally');p.locator('[data-writing-strip-notes] summary').click();h.ok('Tadpoles—back legs, then front legs.' in p.locator('#writing-feedback').inner_text(),'mismatch identifies the provided note');h.action(p,'keep');latest=copy.deepcopy(h.work(p)['latestKept']);h.ok(h.work(p)['firstKept']==first,'first version remains exact after different Keep');inspect(p,'legs','g3',3,'latest')
  p.locator('[data-writing-strip=legs]').tap();p.locator('[data-writing-destination=change]').tap();h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','independent four-note arrangement');h.ok(h.work(p)['firstKept']==first and h.work(p)['latestKept']==latest,'new current arrangement leaves both saved versions literal');h.ok(reference(p,'legs','first').evaluate('e=>e.closest(".wt-note").parentElement.querySelector("h4").textContent')=='When spawn appears' and reference(p,'legs','latest').evaluate('e=>e.closest(".wt-note").parentElement.querySelector("h4").textContent')=='When spawn appears' and reference(p,'legs').evaluate('e=>e.closest(".wt-note").parentElement.querySelector("h4").textContent')=='How tadpoles change','first/latest/current headings preserve literal placements');inspect(p,'pond-date','p1',1)
  reference(p,'legs').click();p.locator('.wt-work [data-speak]').first.click();spoken=p.locator('.wt-work [data-speak]').first.get_attribute('data-speak');h.ok('The back legs grow before the front legs.' in spoken,'requested speech includes open source');h.action(p,'close-source');p.locator('.wt-work [data-speak]').first.click();spoken=p.locator('.wt-work [data-speak]').first.get_attribute('data-speak');h.ok('The back legs grow before the front legs.' not in spoken,'hidden inspector excluded from current speech');p.screenshot(path=str(OUT/'organise-820.png'),full_page=True)
  held=copy.deepcopy(h.work(p));p.evaluate('window.oldRef=document.querySelector("[data-writing-reference=legs]")');choose(p,'research-question');h.ok(not p.locator('.wt-source-inspector').count(),'task change clears source inspector');p.evaluate('oldRef.click()');h.ok(not p.locator('.wt-source-inspector').count(),'detached source control cannot open another task')
  for answer in ['count','croak']:
   p.locator('[data-writing-choice='+answer+']').tap();h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different','uncited question lacks answer in packet');h.ok(reference(p,answer).count()==0 and 'not available here' not in p.locator('.wt-work').inner_text(),'deliberately uncited question has no invented link or warning')
  p.locator('[data-writing-choice=spawn-date]').tap();h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','independent answerable question');h.action(p,'research-return');h.ok(h.work(p)==held,'later return restores exact source-linked kept record')
  choose(p,'research-sources');h.action(p,'check');h.ok('No source cards are selected yet.' in p.locator('#writing-feedback').inner_text(),'empty card feedback names sources');p.locator('[data-writing-tap=pip]').tap();h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different' and 'think' in p.locator('#writing-feedback').inner_text(),'opinion irrelevant to lifecycle report');p.locator('[data-writing-tap=pip]').tap()
  for card in ['pond','guide']:p.locator('[data-writing-tap='+card+']').tap()
  h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','independent relevant card pair');h.action(p,'keep');h.ok('Selected source cards' in p.locator('.wt-work > .wt-page-preview').inner_text(),'selected cards have their own preview')
  for task,wrong,key in [('research-note','front-first','back-first'),('research-scope','nothing','local'),('research-opinion','measured','stated-view')]:
   choose(p,task);card=p.locator('.wt-source .wt-research-card');h.ok(card.count()==1 and card.locator('[data-writing-line]').count()>=2,'choice retains full source context');h.ok(any(word in card.inner_text() for word in ['Biological information','Fictional observations','An untested claim']),'choice retains source status');h.ok(card.locator('.wt-referenced').count()>=1,'shared comparison line highlighted without selecting answer');p.locator('[data-writing-choice='+wrong+']').tap();h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different','meaning-specific wrong choice '+task)
   if task=='research-note':h.ok('Mark copied words as a quotation' in p.locator('#writing-feedback').inner_text(),'wrong short note includes quotation caveat');inspect(p,'front-first','g3',3)
   p.locator('[data-writing-choice='+key+']').tap();h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','independent fitting choice '+task)
  h.ok(h.book(p)['syntheticOther']==seed['syntheticOther'],'research leaves unrelated evidence exact');h.ok(all(x['supported'] and x['guided'] for r in h.book(p)['writingDesk']['records'].values() for x in r['checks']),'all checks remain supplied supported practice');before=copy.deepcopy(h.book(p));p.evaluate('window.routeRef=document.querySelector("[data-writing-reference]");window.routeHear=document.querySelector(".wt-work [data-speak]");location.hash="#notes";window.departedResearchHear=routeHear.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));routeRef.click()');p.locator('#download').wait_for();h.ok(p.evaluate('departedResearchHear') is False and h.book(p)==before,'departed research controls cannot narrate or mutate notebook')
 finally:c.close()

def responsive(browser,base,seed):
 c,p=h.setup(browser,base,seed,320,600)
 try:
  h.action(p,'research');h.layout(p);inspect(p,'season','g1',1);reference(p,'tail').click();h.layout(p);h.ok(p.locator('.wt-source-inspector').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)>=16'),'source inspector text at least16px');p.screenshot(path=str(OUT/'source-320.png'),full_page=True);h.action(p,'close-source');choose(p,'research-sources');h.layout(p);p.locator('[data-writing-tap=guide]').tap();h.ok(h.work(p)['work']['taps']==['guide'],'small-screen card selection works');p.screenshot(path=str(OUT/'cards-320.png'),full_page=True)
 finally:c.close()

def transfer(browser,base):
 seed=h.fixture("c.openWritingTask(s,'research-organise');const r=s.writingDesk.records['research-organise'];r.source.title='Earlier pond page';r.source.research.cards.find(x=>x.id==='guide').title='Earlier field guide';const g=r.source.research.cards.find(x=>x.id==='guide');g.lines.reverse();g.lines.push({id:'old-context',text:'Earlier surrounding context <not markup>.'});r.source.research.links.season=[{cardId:'guide',lineIds:['g1']}];r.source.research.links.tail=[{cardId:'missing',lineIds:['missing']}];r.work.placements={legs:'spawn'};c.checkWritingTask(s);c.keepWritingTask(s);r.work.placements={legs:'change',season:'spawn'};c.checkWritingTask(s);c.keepWritingTask(s);s.writingDesk.records.future={v:77,payload:'x'.repeat(500*1024)};s.syntheticOther={v:77,exact:'unrelated retained owner data'}")
 c,p=h.setup(browser,base,seed)
 try:
  held=copy.deepcopy(h.book(p)['writingDesk']);h.ok('Earlier pond page' in p.locator('#writing-task-title').inner_text(),'historical title used');reference(p,'season').click();box=p.locator('.wt-source-inspector');h.ok('Earlier field guide' in box.inner_text() and 'Earlier surrounding context <not markup>.' in box.inner_text(),'historical title/context escaped and retained');h.ok(box.locator('[data-writing-line=g1]').evaluate('e=>[...e.parentElement.children].indexOf(e)+1')==4,'historical line number follows frozen order');h.action(p,'close-source');h.ok(reference(p,'tail').count()==0 and 'not available here' in p.locator('.wt-work').inner_text(),'bad optional reference isolated');inspect(p,'legs','g3',2,'first');inspect(p,'legs','g3',2,'latest');p.evaluate('window.ownerOldRef=document.querySelector("[data-writing-reference=season]")')
  report=h.export_notes(p,'historical-owner1');h.ok(report['writingDesk']==held,'download preserves historical sources/bad refs/500KB sibling');old=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');original=copy.deepcopy(h.book(p));p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();p.evaluate('location.hash="#notes"');p.locator('#download').wait_for();second=copy.deepcopy(h.book(p));original=p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',old);p.evaluate('ownerOldRef.click()');h.ok(h.book(p)==second,'old-owner reference cannot mutate second owner');p.locator('#progress-file').set_input_files({'name':'historical-synthetic.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();h.ok(p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',old)==original,'import leaves source owner exact');h.ok(p.evaluate('JSON.parse(localStorage.getItem("number-garden-v1:explorer-2"))')==second,'import leaves second existing owner exact');p.evaluate('location.hash="#desk/writing"');h.ready(p);p.reload(wait_until='networkidle');h.ready(p);h.ok(h.book(p)['writingDesk']==held,'import/reload reopens exact historical notebook');inspect(p,'season','g1',4);again=h.export_notes(p,'historical-imported-redownload');h.ok(again['writingDesk']==held,'real redownload preserves historical sources and unknown sibling')
 finally:c.close()

def safety(browser,base,seed):
 c,p=h.setup(browser,base,seed,fault=True)
 try:
  h.action(p,'research');before=copy.deepcopy(h.book(p));p.evaluate('window.writingRefuse=true');inspect(p,'legs','g3',3);p.locator('[data-writing-strip=legs]').tap();p.locator('[data-writing-destination=spawn]').tap()
  for action in ['check','keep','next']:h.action(p,action);h.ok(h.book(p)==before,'preflight refusal preserves research '+action)
  h.ok('could not be kept' in p.locator('#writing-status').inner_text(),'refusal offers recovery');h.ok(h.export_notes(p,'refused')['writingDesk']==before['writingDesk'],'refused source remains downloadable')
 finally:c.close()
 for mode in ['off','quota']:
  c,p=h.setup(browser,base,seed)
  try:
   h.action(p,'research')
   if mode=='off':p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#desk/writing"');h.ready(p)
   else:p.evaluate('window.writingFailStorage=true')
   p.locator('[data-writing-strip=legs]').tap();p.locator('[data-writing-destination=change]').tap();h.action(p,'keep');h.ok('session' in p.locator('#writing-status').inner_text(),'saving status truthful '+mode);report=h.export_notes(p,'memory-'+mode);h.ok(report['writingDesk']['records']['research-organise']['work']['placements']['legs']=='change','in-memory research downloadable '+mode)
  finally:c.close()
 c,p=h.setup(browser,base,h.fixture("s.writingDesk={v:77,exact:'retained unsupported root'}"))
 try:h.ok(not p.locator('[data-writing-action=research]').count(),'unsupported root hides direct research entry');h.ok(h.export_notes(p,'unsupported')['writingDesk']=={'v':77,'exact':'retained unsupported root'},'unsupported root preserved in Notes')
 finally:c.close()

def main():
 seed=h.fixture("s.syntheticOther={v:77,exact:'other evidence'}")
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('RESEARCH_CORNER_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');b=pw.chromium.launch(headless=True,executable_path=chrome if Path(chrome).exists() else None,args=['--disable-quic'])
   try:
    journey(b,base,seed);responsive(b,base,seed);transfer(b,base);safety(b,base,seed);h.ok(not h.errors,'no browser errors '+str(h.errors));receipt={'status':'passed','checks':h.checks,'base':base};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt));print('Artifacts:',OUT)
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
