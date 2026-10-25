"""Synthetic actual-host journeys. Local only; no learner data or service calls."""
import json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('SUBJECT_TEST_URL','http://127.0.0.1:4197/')
OUT=Path(os.environ.get('SUBJECT_ARTIFACTS','/tmp/motion-evidence-browser'));OUT.mkdir(parents=True,exist_ok=True)
seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.baseline.draft={questionId:'groups',attempts:[],input:'',hinted:false,revealed:false};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
checks=0;errors=[]
def ok(v,msg):
 global checks
 assert v,msg
 checks+=1
def book(p):return p.evaluate('window.__pathRead()')
def work(p):
 b=book(p)['motionEvidence'];return b['lessons'][b['currentId']]
def setup(browser,width):
 c=browser.new_context(viewport={'width':width,'height':1000},accept_downloads=True)
 c.add_init_script("localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(seed))+");")
 def app(route):
  r=route.fetch();body=r.text();assert 'let graph=null;' in body
  body=body.replace('let graph=null;','window.__pathRead=()=>structuredClone(state);let graph=null;',1)
  body=body.replace('function notesReport(notebook){return {',"function notesReport(notebook){if(window.__pathRefuse)throw Error('Synthetic preflight refusal');return {",1)
  route.fulfill(response=r,body=body)
 c.route('**/app.mjs',app);p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));return c,p
def go(p):
 p.goto(BASE+'#learn/science');p.locator('[data-motion-root]').wait_for()
def dismiss_film(p):
 if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').click()
def start(p,id):p.locator('[data-motion-start="'+id+'"]').first.click()
def fill(p,k,value):p.locator('[data-motion-field="'+k+'"]').fill(value)
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no viewport overflow')
 bad=p.locator('.motion-page button,.motion-page summary,.motion-page a,.motion-page textarea,.motion-page input[type=range]').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&x.getBoundingClientRect().height<44).map(x=>({text:x.textContent,h:x.getBoundingClientRect().height}))")
 ok(not bad,'44px targets '+str(bad))
def download(p):
 p.goto(BASE+'#notes');p.locator('#download').wait_for()
 with p.expect_download() as d:p.locator('#download').click()
 return json.loads(Path(d.value.path()).read_text())
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 try:
  for width in [320,820]:
   c,p=setup(browser,width);go(p);ok('motionEvidence' not in book(p),'passive base entry does not allocate');bounds(p)
   for id in ['arrows','balanced','acceleration','collisions','design']:
    start(p,id);ok(work(p)['source']['id']==id,'every lesson open');bounds(p)
    for index in range(len(work(p)['source']['items'])):
     q=work(p)['source']['items'][index]
     p.locator('[data-motion-help="'+q['id']+':hint"]').click();ok(p.evaluate('document.activeElement.id')=='motion-item-'+q['id'],'hint keeps focus with its item')
     p.locator('[data-motion-skip="'+q['id']+'"]').click();ok(p.evaluate('document.activeElement.id')=='motion-item-'+q['id'],'skip keeps focus with its item')
     if index==1 and work(p)['source'].get('newMessage'):p.locator('[data-motion-new]').click()
     right=next(x for x in q['choices'] if x['outcome']=='match')
     p.locator('[data-motion-field="'+q['id']+'"][value="'+right['id']+'"]').check()
     p.locator('[data-motion-check="'+q['id']+'"]').click();ok(p.evaluate('document.activeElement.id')=='motion-item-'+q['id'],'check keeps focus with its item')
     ok(work(p)['checks'][-1]['outcome']=='match','structured finite choice')
     ok(q['id']+':hint' in work(p)['checks'][-1]['helpSeenBefore'],'prior support saved')
   fill(p,'explanation','\nThe initial toy brief admits foam B. Real safety is unmeasured.');p.locator('[data-motion-keep]').first.click();fill(p,'revision','\nThe new depth limit excludes B. C fits; peak force is still unknown.');p.locator('[data-motion-keep]').last.click();ok(work(p)['firstKept']['newData']==False,'first context retained before new requirement')
   start(p,'arrows');p.locator('[data-motion-model="left"]').fill('8');ok(work(p)['model']['left']==8,'arrow slider changes playground');ok(p.locator('[data-motion-model="left"]').evaluate('e=>e===document.activeElement'),'slider preserves focused control');ok('left 6 N, right 2 N' in p.locator('[data-motion-item="net"]').inner_text(),'playground does not rewrite frozen question');start(p,'design')
   first=book(p)['baseline']['draft'];ok(first==seed['baseline']['draft'],'old pending baseline preserved')
   p.evaluate('scrollTo(0,0)');p.screenshot(path=str(OUT/f'final-{width}.png'),full_page=True)
   exported=download(p);ok(exported['motionEvidence']==book(p)['motionEvidence'],'actual notes download retains root')
   p.locator('#progress-file').set_input_files({'name':'synthetic-subject.json','mimeType':'application/json','buffer':json.dumps(exported).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual import accepts download')
   p.goto(BASE+'#learn/science');p.locator('[data-motion-root]').wait_for();ok(work(p)['drafts']['explanation']=='\nThe initial toy brief admits foam B. Real safety is unmeasured.','reload/import exact original: '+repr(work(p)['drafts']));ok(work(p)['drafts']['revision']=='\nThe new depth limit excludes B. C fits; peak force is still unknown.','reload/import exact revision: '+repr(work(p)['drafts']))
   ok(p.locator('[data-motion-field="explanation"]').input_value()==work(p)['drafts']['explanation'],'render preserves leading newline in original');ok(p.locator('[data-motion-field="revision"]').input_value()==work(p)['drafts']['revision'],'render preserves leading newline in revision')
   # Root preflight refusal keeps typed words visible and blocks lossy rerenders.
   p.evaluate('window.__pathRefuse=true');before=book(p);fill(p,'explanation','Unsaved synthetic words');ok(book(p)==before,'refusal leaves notebook unchanged');p.locator('[data-motion-start="arrows"]').first.click();ok(p.locator('[data-motion-field="explanation"]').input_value()=='Unsaved synthetic words','refused input remains visible through attempted navigation');p.evaluate('window.__pathRefuse=false');fill(p,'explanation','\nThe initial toy brief admits foam B. Real safety is unmeasured.');
   original_id=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
   held_root=book(p)['motionEvidence'];stale=p.locator('[data-motion-field="explanation"]').element_handle()
   p.locator('#explorer-switch').click();p.locator('#explorer-new').click();p.locator('[data-explorer-avatar]').nth(1).click();p.locator('#explorer-create').click();dismiss_film(p);p.goto(BASE+'#learn/science');p.locator('[data-motion-root]').wait_for()
   ok('motionEvidence' not in book(p),'second explorer has no inherited unit')
   stale.evaluate("e=>{e.value='stale synthetic';e.dispatchEvent(new Event('input',{bubbles:true}));}")
   ok('motionEvidence' not in book(p),'detached first explorer input cannot write second explorer')
   start(p,'arrows');ok(work(p)['source']['id']=='arrows','second explorer independently starts lesson')
   p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+original_id+'"]').click();p.goto(BASE+'#learn/science');p.locator('[data-motion-root]').wait_for();ok(book(p)['motionEvidence']==held_root,'first explorer work unchanged after second explorer activity')
   c.close()
  ok(not errors,'no page errors '+str(errors));print(f'{checks} motion-evidence browser checks passed')
 finally:browser.close()
