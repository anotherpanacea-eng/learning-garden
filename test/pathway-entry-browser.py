"""Synthetic subject-entry journeys against the real app and transfer controls."""
import copy,json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];BASE=os.environ.get('PATHWAY_TEST_URL','http://127.0.0.1:4196/')
OUT=Path(os.environ.get('PATHWAY_ARTIFACTS','/tmp/pathway-entry-browser'));OUT.mkdir(parents=True,exist_ok=True)
fixture=json.loads(subprocess.check_output(['node','--input-type=module','-e',"""import {freshState} from './dist/core.mjs';import {initializeExplorerState,prepareProgressImport} from './dist/progress-transfer.mjs';import {startLinear,setLinearField} from './dist/linear-pathway-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;const o={canExport:c=>prepareProgressImport(JSON.stringify(c)).ok};startLinear(s,'equal',o);setLinearField(s,'own','x','Synthetic waiting value',o);console.log(JSON.stringify(s));"""],cwd=ROOT,text=True))
checks=0;errors=[]
def ok(x,m):
 global checks
 assert x,m
 checks+=1
def book(p):return p.evaluate('()=>window.__pathwayRead()')
def preview(p,sub):return book(p)['learningRoutes']['subjects'][sub]['preview']
def go(p,sub):p.goto(BASE+'#pathways/'+sub);p.locator('[data-pathway-root]').wait_for()
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no page overflow')
 bad=p.locator('.pathway-page button,.pathway-page a,.pathway-page select').evaluate_all('xs=>xs.filter(x=>x.getClientRects().length&&x.getBoundingClientRect().height<44).map(x=>x.textContent)');ok(not bad,'44px controls '+str(bad))
def setup(browser,width,seed=None,refuse=False):
 c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True)
 c.add_init_script('('+"""seed=>{if(!localStorage.getItem('pathway-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('pathway-fixture','1');}}"""+')('+json.dumps(seed or fixture)+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body
  body=body.replace('let graph=null,','window.__pathwayRead=()=>structuredClone(state);let graph=null,',1)
  if refuse:body=body.replace('bindPathways(state,options);','bindPathways(state,{...options,canExport:()=>false});',1)
  route.fulfill(response=response,body=body)
 c.route('**/app.mjs',app);p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));return c,p
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 try:
  for width in [320,820]:
   c,p=setup(b,width);go(p,'math');waiting=copy.deepcopy(book(p)['linearPathway']);ok('learningRoutes' not in book(p),'passive entry no root');bounds(p)
   explore=p.locator('.pathway-goals a[href="#learn/math/plans"]');explore.click();p.locator('[data-linear-root]').wait_for();ok('learningRoutes' not in book(p),'direct exploration writes no preference');ok(book(p)['linearPathway']==waiting,'target preview preserves waiting lesson');ok('Start or continue' in p.locator('main').inner_text(),'specific leaf preview explicit start');go(p,'math')
   for sub,goal,wrong,right in [('math','plans','up-four','down-four'),('english','argument','nothing','disagree'),('science','motion','eight','zero'),('french','rooms','on','under')]:
    go(p,sub);bounds(p);p.locator('[data-pathway-remember="'+goal+'"]').click();ok(book(p)['learningRoutes']['subjects'][sub]['goal']['id']==goal,'subject goal saved '+sub);p.locator('[data-pathway-start]').click();ok(p.locator('#pathway-preview').evaluate('x=>document.activeElement===x'),'preview focus');p.locator('[data-pathway-choice="'+wrong+'"]').click();p.locator('[data-pathway-check]').click();ok(preview(p,sub)['firstCheck']['outcome']=='different','wrong snapshot '+sub);p.locator('[data-pathway-help="hint"]').click()
    if sub=='french':
     ok('The lamp is on the table.' not in p.locator('main').inner_text(),'meaning hidden');p.locator('[data-pathway-help="meaning"]').click();ok('The lamp is on the table.' in p.locator('main').inner_text(),'explicit meaning reveal');p.locator('[data-speak-lang="fr"]').click();ok(preview(p,sub)['help']['audio'],'French audio request recorded');ok(p.locator('[data-speak-lang="en"]').count()==0,'no English fallback button')
    p.locator('[data-pathway-choice="'+right+'"]').click();p.locator('[data-pathway-check]').click();ok(preview(p,sub)['checks'][-1]['outcome']=='match','revised answer '+sub);ok(preview(p,sub)['firstCheck']['raw']==wrong,'first raw retained');ok(book(p)['learningRoutes']['subjects'][sub]['goal']['id']==goal,'outcome does not replace goal');bounds(p)
    stale=p.locator('[data-pathway-check]').element_handle();p.locator('[data-pathway-version]').select_option('first');before=copy.deepcopy(book(p)['learningRoutes']);stale.evaluate('x=>x.click()');ok(book(p)['learningRoutes']==before,'stale check ignored');ok(p.locator('.pathway-history-options li').count()==3,'saved source options shown');p.evaluate('scrollTo(0,0)');p.screenshot(path=str(OUT/f'{sub}-{width}.png'),full_page=True)
   ok(book(p)['linearPathway']==waiting,'all subjects preserve waiting unit');ok(len(book(p)['learningRoutes']['subjects'])==4,'separate goals coexist');go(p,'math')
   for _ in range(4):p.locator('[data-pathway-check]').click()
   ok(preview(p,'math')['checks'].__len__()==4,'latest history cap');ok('replace the oldest' in p.locator('main').inner_text(),'before-check replacement notice')
   saved=copy.deepcopy(book(p)['learningRoutes']);identity=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.reload();p.locator('#explorer-header').wait_for()
   if p.locator('[data-select-explorer]').count():p.locator('[data-select-explorer="'+identity+'"]').click()
   p.locator('[data-pathway-root]').wait_for();ok(book(p)['learningRoutes']==saved,'reload exact goals/sources/checks')
   p.goto(BASE+'#notes');p.locator('#download').wait_for()
   with p.expect_download() as d:p.locator('#download').click()
   exported=json.loads(Path(d.value.path()).read_text());ok(exported['learningRoutes']==saved,'actual export exact entry root');p.locator('#progress-file').set_input_files({'name':'synthetic-pathways.json','mimeType':'application/json','buffer':json.dumps(exported).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual notes import');go(p,'math');ok(book(p)['learningRoutes']==saved,'import exact entry root')
   imported_id=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");ok(imported_id!=identity,'import creates a separate explorer');p.locator('[data-pathway-remember="signed"]').click();go(p,'french');p.locator('[data-pathway-remember="plans"]').click();changed=copy.deepcopy(book(p)['learningRoutes']);ok(changed['subjects']['english']==saved['subjects']['english'] and changed['subjects']['science']==saved['subjects']['science'],'changing two subjects leaves other subjects unchanged')
   p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+identity+'"]').click();go(p,'math');ok(book(p)['learningRoutes']==saved,'original explorer keeps four distinct starting points');ok(book(p)['linearPathway']==waiting,'original explorer keeps waiting math source/draft');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+imported_id+'"]').click();go(p,'french');ok(book(p)['learningRoutes']==changed,'imported explorer keeps its own independent changes');c.close()
  # Real host binder with rejected preflight: audio must not reach its target listener.
  seed=copy.deepcopy(fixture);subprocess_code="""import {startPathwayPreview} from './dist/pathway-entry-core.mjs';const s=JSON.parse(process.argv[1]);startPathwayPreview(s,'french',{canExport:()=>true});console.log(JSON.stringify(s));"""
  seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',subprocess_code,json.dumps(seed)],cwd=ROOT,text=True));c,p=setup(b,820,seed,True);go(p,'french');before=copy.deepcopy(book(p));p.evaluate("window.syntheticSpeechReached=false;document.querySelector('[data-speak]').addEventListener('click',()=>window.syntheticSpeechReached=true)");p.locator('[data-speak]').click();ok(not p.evaluate('window.syntheticSpeechReached'),'audio refused before target listener');ok(book(p)==before,'audio refusal preserves root');ok('could not be kept safely' in p.locator('#pathway-status').inner_text(),'actionable refusal');c.close()
  ok(not errors,'no page errors '+str(errors));print(f'Pathway browser: {checks} checks passed; screenshots {OUT}')
 finally:b.close()
