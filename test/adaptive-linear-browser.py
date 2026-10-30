"""Synthetic signed-linear miniunit Chrome journeys against the real host app."""
import copy,json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('LINEAR_TEST_URL','http://127.0.0.1:4196/')
OUT=Path(os.environ.get('LINEAR_ARTIFACTS','/tmp/adaptive-linear-browser'));OUT.mkdir(parents=True,exist_ok=True)
fixture=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
answers={'zero':[{'height':'-2'},{'height':'-4'},{'floor':'-2'}],'halves':[{'height':'2','rate':'1/2'},{'height':'7/2'},{'height':'1/2'}],'views':[{'m':'2','b':'-3'},{'height':'5','b':'-3'},{'m':'3/2','b':'-1/2'}],'equal':[{'right':'8','x':'4'},{'coefficient':'3/2','right':'6','x':'4'},{'x':'3'}],'plans':[{'start':'4','rate':'1'},{'x':'4','fee':'9'},{'x':'6'}],'carry':[{'m':'3/2','b':'-3'},{'right':'6','x':'4'},{'x':'4'}]}
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def book(p):return p.evaluate('()=>window.__linearRead()')
def work(p):
 r=book(p)['linearPathway'];return r['lessons'][r['currentId']]
def go(p,h):p.goto(BASE+h);p.locator('[data-linear-root]').wait_for()
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no page overflow')
 bad=p.locator('.linear-page button,.linear-page input,.linear-page select,.linear-page textarea,.linear-page a').evaluate_all('xs=>xs.filter(x=>x.getClientRects().length&&x.getBoundingClientRect().height<44).map(x=>x.textContent)')
 ok(not bad,'44px controls '+str(bad))
def turn(p,n):p.locator('[data-linear-page="'+str(n)+'"]').first.click()
def fill(p,item,k,v):p.locator('[data-linear-item="'+item+'"][data-linear-field="'+k+'"]').fill(v)
def setup(browser,width,seed=None,failed=False):
 c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True)
 init="""({seed,failed})=>{if(!localStorage.getItem('linear-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('linear-fixture','1');}if(failed)Storage.prototype.setItem=function(){throw Error('Synthetic storage failure');};}"""
 c.add_init_script('('+init+')('+json.dumps({'seed':seed or copy.deepcopy(fixture),'failed':failed})+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body
  body=body.replace('let graph=null,','window.__linearRead=()=>structuredClone(state);let graph=null,',1).replace('bindLinear(state,options)','bindLinear(state,{...options,canExport:c=>!window.__linearRefuse&&options.canExport(c)})');route.fulfill(response=response,body=body)
 c.route('**/app.mjs',app)
 p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));return c,p
def create(p,kind):
 p.locator('[data-linear-challenge]').select_option(kind);p.locator('[data-linear-create]').focus();p.keyboard.press('Enter');p.wait_for_function("document.activeElement?.id==='linear-turn'");return book(p)['linearPathway']['currentId']
def solve(p,wrong=False,help=False):
 turn(p,2);i=next(x for x in work(p)['source']['items'] if x['id']=='own')
 if help:
  p.locator('[data-linear-help="own"][data-help-kind="hint"]').click();ok(p.locator('#linear-help-own-hint').evaluate('x=>document.activeElement===x'),'local hint focus')
 for f in i['fields']:fill(p,'own',f['id'],'999' if wrong else f['answer'])
 p.locator('[data-linear-check="own"]').click();ok(p.locator('#linear-feedback-own').evaluate('x=>document.activeElement===x'),'local check focus')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 try:
  for width in [320,820]:
   c,p=setup(browser,width);go(p,'#learn/math');bounds(p);ok('linearPathway' not in book(p),'selection is pure');keys=[]
   for _ in range(3):
    keys.append(create(p,'unknown'));solve(p);bounds(p)
   ok(p.locator('[data-linear-challenge]').input_value()=='contrast','three distinct first matches suggest contrast')
   original=keys[0];old=copy.deepcopy(book(p)['linearPathway']['lessons'][original]);key=create(p,'contrast');solve(p,help=True);other=create(p,'contrast');solve(p,wrong=True)
   ok(p.locator('[data-linear-challenge]').input_value()=='revisit','two distinct supported/differing responses suggest revisit')
   p.locator('[data-linear-help="own"][data-help-kind="example"]').click();ok(p.locator('#linear-help-own-example').evaluate('x=>document.activeElement===x'),'local different example focus');p.locator('[data-linear-skip="own"]').click();ok(p.locator('#linear-item-own').evaluate('x=>document.activeElement===x'),'local skip focus')
   turn(p,3);p.locator('[data-linear-note]').fill('First synthetic explanation <exact>.');p.locator('[data-linear-keep]').click();p.locator('[data-linear-note]').fill('Latest synthetic explanation.');p.locator('[data-linear-keep]').click();ok(work(p)['firstKept']['note']=='First synthetic explanation <exact>.','first writing kept');ok(work(p)['kept']['note']=='Latest synthetic explanation.','latest writing kept')
   saved=copy.deepcopy(book(p)['linearPathway']);go(p,'#learn/math/'+original);ok(book(p)['linearPathway']==saved,'generated targeted preview save-neutral');ok(not p.locator('[data-linear-x]').count(),'preview hides previous model');p.locator('[data-linear-start="'+original+'"]').last.click();ok(work(p)['source']==old['source'],'generated source resumed frozen')
   identity=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");saved=copy.deepcopy(book(p)['linearPathway']);p.reload();p.locator('#explorer-header').wait_for()
   if p.locator('[data-select-explorer]').count():p.locator('[data-select-explorer="'+identity+'"]').click()
   p.locator('[data-linear-root]').wait_for();ok(book(p)['linearPathway']==saved,'generated reload exact');bounds(p)
   go(p,'#learn/math/'+other);p.locator('[data-linear-start="'+other+'"]').last.click();turn(p,3);ok(p.locator('[data-linear-note]').input_value()=='Latest synthetic explanation.','writing survives returns');p.screenshot(path=str(OUT/f'adaptive-math-{width}.png'),full_page=True)
   p.goto(BASE+'#notes');p.locator('#download').wait_for()
   with p.expect_download() as d:p.locator('#download').click()
   exported=json.loads(Path(d.value.path()).read_text());expected=copy.deepcopy(book(p)['linearPathway']);p.locator('#progress-file').set_input_files({'name':'synthetic-adaptive-math.json','mimeType':'application/json','buffer':json.dumps(exported).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual adaptive report import');go(p,'#learn/math');ok(book(p)['linearPathway']==expected,'actual import preserves every frozen generated source/writing')
   before=copy.deepcopy(book(p)['linearPathway']);p.locator('[data-linear-remove-choice]').select_option(other);p.once('dialog',lambda d:d.dismiss());p.locator('[data-linear-remove]').click();ok(book(p)['linearPathway']==before,'canceled selected removal preserves all')
   p.once('dialog',lambda d:(ok('first/latest kept writing' in d.message,'accurate deletion warning'),d.accept()));p.locator('[data-linear-remove]').click();ok(other not in book(p)['linearPathway']['lessons'],'only confirmed selected visit removed');ok(book(p)['linearPathway']['lessons'][original]==before['lessons'][original],'unselected work intact');ok('fixed' not in book(p)['linearPathway']['lessons'],'no implicit fixed source creation')
   held=copy.deepcopy(book(p)['linearPathway']);owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.locator('#explorer-switch').click();p.locator('#explorer-new').click();p.locator('#explorer-create').click()
   if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').click()
   go(p,'#learn/math');ok('linearPathway' not in book(p),'second explorer inherits no math evidence');ok(p.locator('[data-linear-challenge]').input_value()=='revisit','second explorer gets own evidence suggestion');create(p,'contrast');solve(p,wrong=True);p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+owner+'"]').click();go(p,'#learn/math');ok(book(p)['linearPathway']==held,'first explorer exact after second explorer activity');c.close()
  # A waiting synthetic Bramble question is qualified only when its actual whole-rate model is displayed.
  pending=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState,prepareProgressImport} from './dist/progress-transfer.mjs';import {createLinearInvestigation,startLinear} from './dist/linear-pathway-core.mjs';import {startPostOffice} from './dist/post-office-core.mjs';import {deliveries} from './dist/post-office-content.mjs';import {startAdaptiveRival,generateRivalTask} from './dist/post-rival.mjs';const s=initializeExplorerState(freshState()),o={canExport:c=>prepareProgressImport(JSON.stringify(c,null,2)).ok};s.garden.welcomeFilmSeen=true;s.linearPathway={version:1,currentId:'',lessons:{},exploration:{version:1,nextSerial:6}};createLinearInvestigation(s,'contrast',o);startLinear(s,'zero',o);const v=startPostOffice(s,deliveries[0].id);startAdaptiveRival(s);v.rival.task=generateRivalTask('multiply',1,4,0);console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
  c,p=setup(browser,820,pending);go(p,'#learn/math/investigation-6');r=lambda:next(v for v in book(p)['postOffice']['visits'] if v['id']==book(p)['postOffice']['current'])['rival'];held=copy.deepcopy(r());ok(not r().get('priorFactShown'),'generated deep preview leaves hidden pending fact fresh');ok('1x4' not in book(p).get('exposures',[]),'hidden preview adds no positive facts');p.locator('[data-linear-start="investigation-6"]').last.click();ok(r().get('priorFactShown') is True,'actual host display qualifies pending exact fact');expected=copy.deepcopy(held);expected['priorFactShown']=True;ok(r()==expected,'waiting question/input unchanged except explicit familiarity');ok('1x4' in book(p)['exposures'],'whole generated model recorded by actual host hook');c.close()
  damaged=copy.deepcopy(pending);damaged['linearPathway']['currentId']='investigation-6';damaged['linearPathway']['exploration']={'version':99,'raw':'synthetic held metadata'};c,p=setup(browser,320,damaged);go(p,'#learn/math');ok(not p.locator('[data-linear-create]').count(),'malformed optional selector closes only creation');turn(p,3);p.locator('[data-linear-note]').fill('Readable old work remains editable.');ok(work(p)['note']=='Readable old work remains editable.','malformed selection metadata leaves writing open');ok(book(p)['linearPathway']['exploration']==damaged['linearPathway']['exploration'],'raw malformed selection metadata retained');c.close()
  capped=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState,prepareProgressImport} from './dist/progress-transfer.mjs';import {createLinearInvestigation,linearView,setLinearField,setLinearPage,checkLinear} from './dist/linear-pathway-core.mjs';const s=initializeExplorerState(freshState()),o={canExport:c=>prepareProgressImport(JSON.stringify(c,null,2)).ok};s.garden.welcomeFilmSeen=true;s.linearPathway={version:1,currentId:'',lessons:{},exploration:{version:1,nextSerial:6}};createLinearInvestigation(s,'unknown',o);setLinearPage(s,2,o);for(const f of linearView(s).work.source.items[1].fields)setLinearField(s,'own',f.id,f.answer,o);for(let i=0;i<24;i++)checkLinear(s,'own',o);console.log(JSON.stringify(s));"],cwd=ROOT,text=True));c,p=setup(browser,820,capped);go(p,'#learn/math');before=copy.deepcopy(work(p));p.locator('[data-linear-check="own"]').click();ok(work(p)==before,'record cap visibly refuses without losing existing work');ok('already retains 24 checks' in p.locator('#linear-status').inner_text(),'record cap gives specific explanation');ok('another investigation' in p.locator('#linear-status').inner_text(),'record cap offers next case');create(p,'revisit');ok(work(p)['checks']==[],'new investigation remains open at old visit cap');c.close()
  c,p=setup(browser,320);go(p,'#learn/math');create(p,'unknown');turn(p,2);field=work(p)['source']['items'][1]['fields'][0]['id'];target=p.locator('[data-linear-item="own"][data-linear-field="'+field+'"]');target.fill('2');before=copy.deepcopy(book(p));p.evaluate('window.__linearRefuse=true');target.fill('999');ok(target.input_value()=='999' and book(p)==before,'refused typed input remains visible without saved mutation');ok(target.evaluate('x=>document.activeElement===x'),'refused typing retains field focus');p.locator('[data-linear-create]').click();ok(target.input_value()=='999' and book(p)==before,'new case guard preserves unsaved words');p.locator('[data-linear-page="3"]').first.click();ok(target.input_value()=='999','page guard preserves unsaved words');p.locator('#explorer-switch').click();ok(p.locator('[data-linear-root]').count()==1 and target.input_value()=='999','outer explorer guard preserves unsaved words');p.locator('[data-linear-root] a[href="#notes"]').first.click();ok(p.locator('[data-linear-root]').count()==1,'notes navigation waits for explicit unsaved choice');p.once('dialog',lambda d:d.dismiss());p.locator('[data-linear-discard]').click();ok(target.input_value()=='999','cancel restoring keeps visible unsaved words');p.once('dialog',lambda d:d.accept());p.locator('[data-linear-discard]').click();ok(p.locator('[data-linear-item="own"][data-linear-field="'+field+'"]').input_value()=='2','explicit restore returns last saved field');ok(book(p)==before,'explicit unsaved restore leaves notebook unchanged');p.evaluate('window.__linearRefuse=false');create(p,'contrast');ok(work(p)['source']['generation']['challenge']=='contrast','new cases remain reachable after explicit unsaved restore');c.close()
  c,p=setup(browser,820);go(p,'#learn/math');a=create(p,'unknown');b=create(p,'unknown')
  for _ in range(3):create(p,'unknown');solve(p)
  ok(p.locator('[data-linear-challenge]').input_value()=='contrast','newer checked cases initially suggest comparison');p.locator('[data-linear-start="'+a+'"]').first.click();solve(p,wrong=True);ok(work(p)['firstChecks']['own']['order']==4,'resumed older visit receives actual current first-check order');p.locator('[data-linear-start="'+b+'"]').first.click();solve(p,help=True);ok(p.locator('[data-linear-challenge]').input_value()=='revisit','recent first responses in older visits affect invitation');ok(work(p)['firstChecks']['own']['order']==5,'order follows actual response not creation');c.close()
  ok(not errors,'no page errors '+str(errors));print(f'Adaptive math browser: {checks} checks passed; screenshots {OUT}')
 finally:browser.close()
