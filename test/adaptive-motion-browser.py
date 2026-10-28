"""Synthetic actual-host journeys. Local only; no learner data or service calls."""
import json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('SUBJECT_TEST_URL','http://127.0.0.1:4198/')
OUT=Path(os.environ.get('SUBJECT_ARTIFACTS','/tmp/adaptive-motion-browser'));OUT.mkdir(parents=True,exist_ok=True)
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
  r=route.fetch();body=r.text();assert 'let graph=null,' in body
  body=body.replace('let graph=null,','window.__pathRead=()=>structuredClone(state);let graph=null,',1)
  marker='bindMotion(state,options);';assert marker in body
  body=body.replace(marker,marker+"document.querySelector('[data-motion-root]')?.setAttribute('data-test-motion-route',location.hash);",1)
  body=body.replace('function notesReport(notebook){return {',"function notesReport(notebook){if(window.__pathRefuse)throw Error('Synthetic preflight refusal');return {",1)
  route.fulfill(response=r,body=body)
 c.route('**/app.mjs',app);p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));return c,p
def ready(p):
 p.wait_for_function("document.querySelector('[data-motion-root]')?.getAttribute('data-test-motion-route')===location.hash")
def go(p):
 p.goto(BASE+'#learn/science');p.locator('[data-motion-root]').wait_for();ready(p)
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
   c,p=setup(browser,width);go(p);ok('motionEvidence' not in book(p),'read-only entry does not allocate');bounds(p)
   start(p,'arrows');fixed=book(p)['motionEvidence']['lessons']['arrows'];
   p.goto(BASE+'#learn/science/arrows');p.locator('[data-motion-root]').wait_for();ready(p)
   p.locator('[data-motion-challenge]').select_option('design');p.locator('[data-motion-create]').click();
   p.wait_for_function("window.__pathRead().motionEvidence.currentId.includes('-design-')")
   ok(work(p)['source']['adaptive']['kind']=='design','explicit open override creates chosen concept')
   ok(p.locator('[data-motion-field="explanation"]').count()==1,'deep entry shows created source instead of trapping earlier fixed lesson');bounds(p)
   held_id=book(p)['motionEvidence']['currentId'];src=work(p)['source'];
   first=src['items'][0];key=first['id'];p.locator('[data-motion-help="'+key+':hint"]').click();ok(p.evaluate('document.activeElement.id')=='motion-item-'+key,'support focus stays local')
   right=next(x for x in first['choices'] if x['outcome']=='match');p.locator('[data-motion-field="'+key+'"][value="'+right['id']+'"]').check();p.locator('[data-motion-check="'+key+'"]').click();ok(p.evaluate('document.activeElement.id')=='motion-item-'+key,'check focus stays local');ok(key+':hint' in work(p)['checks'][-1]['helpSeenBefore'],'support before check retained')
   p.locator('[data-motion-skip="'+key+'"]').click();ok(p.evaluate('document.activeElement.id')=='motion-item-'+key,'skip focus stays local')
   fill(p,'explanation','\nOriginal synthetic message and reasoning.');p.locator('[data-motion-keep]').first.click();p.locator('[data-motion-new]').click();
   second=src['items'][1];answer=next(x for x in second['choices'] if x['outcome']=='match');p.locator('[data-motion-field="'+second['id']+'"][value="'+answer['id']+'"]').check();p.locator('[data-motion-check="'+second['id']+'"]').click()
   fill(p,'revision','\nRevised synthetic message after the new information.');p.locator('[data-motion-keep]').last.click();held=work(p)
   ok(held['firstKept']['drafts']['explanation']=='\nOriginal synthetic message and reasoning.','first original retained before reveal')
   p.locator('[data-motion-create]').click();ok(book(p)['motionEvidence']['currentId']!=held_id,'new return allocates separate visit');ok(work(p)['source']['adaptive']['caseId']!=src['adaptive']['caseId'],'new case changes meaningful model/map/source');start(p,held_id);ok(work(p)==held,'history resumes exact frozen source/support/drafts/kept writing')
   p.reload();p.locator('[data-motion-root]').wait_for();ready(p);ok(work(p)==held,'reload does not regenerate source');bounds(p)
   exported=download(p);ok(exported['motionEvidence']==book(p)['motionEvidence'],'actual notes export includes generated visits')
   p.locator('#progress-file').set_input_files({'name':'synthetic-adaptive.json','mimeType':'application/json','buffer':json.dumps(exported).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual generated notebook import succeeds')
   p.goto(BASE+'#learn/science/'+held_id);p.locator('[data-motion-root]').wait_for();ready(p);ok(work(p)==held,'actual import preserves frozen generated work and exact writing')
   p.evaluate('window.__pathRefuse=true');before=book(p);fill(p,'explanation','Unsaved synthetic words');ok(book(p)==before,'actual host refusal atomic');p.locator('[data-motion-create]').click();ok(p.locator('[data-motion-field="explanation"]').input_value()=='Unsaved synthetic words','refused creation keeps unsaved draft visible');p.evaluate('window.__pathRefuse=false');fill(p,'explanation','\nOriginal synthetic message and reasoning.');
   # Explicit selected deletion requires a separate confirmation; cancellation is pure.
   p.locator('.motion-removal summary').click();p.locator('[data-motion-remove-select]').select_option(held_id);before=book(p);p.locator('[data-motion-remove]').click();ok(p.evaluate('document.activeElement.hasAttribute(\"data-motion-remove-confirm\")'),'confirmation focus is local');ok(book(p)==before,'removal prompt is save-neutral');ok(held_id in p.locator('[data-motion-remove-description]').inner_text(),'confirmation names exact visit');ok('first/latest kept snapshots' in p.locator('[data-motion-remove-description]').inner_text(),'confirmation warns about kept writing');p.locator('[data-motion-remove-cancel]').click();ok(book(p)==before,'cancel preserves notebook');p.locator('[data-motion-remove]').click();p.locator('[data-motion-remove-confirm]').click();ok(held_id not in book(p)['motionEvidence']['lessons'],'only confirmed selected generated visit removed');ok(book(p)['motionEvidence']['lessons']['arrows']==fixed,'fixed lesson protected');ok(not book(p)['motionEvidence']['currentId'],'removed current returns to selection');bounds(p)
   # New explorer and detached stale generated controls cannot cross owners.
   ready(p);p.locator('[data-motion-challenge]').select_option('design');p.locator('[data-motion-create]').click();p.wait_for_function("(()=>{const r=window.__pathRead().motionEvidence;return r.currentId&&r.lessons[r.currentId]?.source.adaptive?.kind==='design';})()");ready(p);held_root=book(p)['motionEvidence'];stale=p.locator('[data-motion-field="explanation"]').element_handle();original_id=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
   p.locator('#explorer-switch').click();p.locator('#explorer-new').click();p.locator('[data-explorer-avatar]').nth(1).click();p.locator('#explorer-create').click();dismiss_film(p);p.goto(BASE+'#learn/science');p.locator('[data-motion-root]').wait_for();ready(p);ok('motionEvidence' not in book(p),'second explorer does not inherit visits');stale.evaluate("e=>{e.value='stale synthetic';e.dispatchEvent(new Event('input',{bubbles:true}));}")
   ok('motionEvidence' not in book(p),'detached generated control cannot write second explorer');p.locator('[data-motion-create]').click();ok(work(p)['source']['adaptive']['serial']==1,'second explorer has independent counters');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+original_id+'"]').click();p.goto(BASE+'#learn/science');p.locator('[data-motion-root]').wait_for();ready(p);ok(book(p)['motionEvidence']==held_root,'first explorer retains exact history');p.screenshot(path=str(OUT/f'final-{width}.png'),full_page=True)
   for family in ['forces', 'evidence']:
    p.locator('[data-motion-challenge]').select_option(family);p.locator('[data-motion-create]').focus();p.keyboard.press('Enter');p.wait_for_function("window.__pathRead().motionEvidence.lessons[window.__pathRead().motionEvidence.currentId].source.adaptive.kind==="+json.dumps(family));ok(work(p)['source']['adaptive']['kind']==family,'keyboard creation opens chosen family');bounds(p)
    q=work(p)['source']['items'][0];right=next(x for x in q['choices'] if x['outcome']=='match');p.locator('[data-motion-field="'+q['id']+'"][value="'+right['id']+'"]').check();p.locator('[data-motion-check="'+q['id']+'"]').focus();p.keyboard.press('Enter');ok(work(p)['checks'][-1]['outcome']=='match','keyboard check saves supplied response')
   c.close()
  ok(not errors,'no page errors '+str(errors));print(f'{checks} adaptive motion browser checks passed')
 finally:browser.close()
