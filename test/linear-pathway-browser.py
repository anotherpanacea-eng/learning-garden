"""Synthetic signed-linear miniunit Chrome journeys against the real host app."""
import copy,json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('LINEAR_TEST_URL','http://127.0.0.1:4196/')
OUT=Path(os.environ.get('LINEAR_ARTIFACTS','/tmp/linear-pathway-browser'));OUT.mkdir(parents=True,exist_ok=True)
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
  route.fulfill(response=response,body=body.replace('let graph=null,','window.__linearRead=()=>structuredClone(state);let graph=null,',1))
 c.route('**/app.mjs',app)
 p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));return c,p
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 try:
  for width in [320,820]:
   c,p=setup(browser,width);go(p,'#learn/math/plans');ok('linearPathway' not in book(p),'pure targeted preview');ok('Start or continue' in p.locator('main').inner_text(),'explicit requested start');bounds(p)
   p.locator('[data-linear-start="plans"]').last.click();ok(work(p)['source']['id']=='plans','requested start selects fee lesson');
   for key,sets in answers.items():
    p.locator('[data-linear-start="'+key+'"]').first.click();ok(work(p)['source']['id']==key,'switch remains playable on specific route '+key);p.wait_for_function("document.activeElement?.id==='linear-turn'");ok(p.locator('#linear-turn').evaluate('x=>document.activeElement===x'),'lesson switch focuses after hashchange render')
    turn(p,0);bounds(p);ok(p.locator('svg[role="img"]').count()>=1,'reference graph');ok(p.locator('table tbody tr').count()==7,'seven exact rows');p.locator('[data-linear-x]').select_option('4');ok(work(p)['x']==4,'model input persisted')
    p.locator('[data-linear-delta="1"]').focus();p.keyboard.press('Enter');ok(work(p)['x']==5,'keyboard stepper');ok(p.locator('[data-linear-delta="1"]').evaluate('x=>document.activeElement===x'),'stepper focus restored')
    if key=='zero':ok('−' not in p.locator('.linear-value').inner_text() or '-4' in p.locator('.linear-value').inner_text(),'negative output available')
    if key=='halves':
     ok('7/2' in p.locator('.linear-value').inner_text(),'fractional output exact');ok(p.locator('.linear-numberline svg text').all_text_contents()[:9]==['0','1/2','1','3/2','2','5/2','3','7/2','4'],'half ticks normalize whole values')
    for n,raw in enumerate(sets,1):
     item=['guided','own','return'][n-1];turn(p,n);ok(p.locator('#linear-turn').evaluate('x=>document.activeElement===x'),'deliberate turn focus');bounds(p)
     if n==3:ok('retain' in p.locator('.linear-context').inner_text(),'new-context/reference distinction')
     first=next(iter(raw));fill(p,item,first,'999');p.locator('[data-linear-check="'+item+'"]').click()
     # Other required fields may still be blank: syntax instructions do not create attempts.
     if key=='zero' and n==2:
      feedback=p.locator('#linear-feedback-own').inner_text();ok(work(p)['source']['items'][1]['hint'] not in feedback,'wrong feedback does not reveal unrequested hint');ok(work(p)['source']['items'][1]['explanation'] not in feedback,'wrong feedback does not reveal answer')
     for k,v in raw.items():fill(p,item,k,v)
     el=p.locator('[data-linear-item="'+item+'"][data-linear-field="'+first+'"]').element_handle();ok(el.evaluate('x=>x.isConnected'),'typing keeps input DOM')
     if key=='equal' and n==2:
      p.locator('[data-linear-help="own"][data-help-kind="hint"]').click();ok(p.locator('#linear-help-own-hint').evaluate('x=>document.activeElement===x'),'hint focus beside current item');p.locator('[data-linear-help="own"][data-help-kind="example"]').click();ok(p.locator('#linear-help-own-example').evaluate('x=>document.activeElement===x'),'worked example focus beside current item');ok(len(work(p)['help']['own'])==2,'per-item support tracked')
     p.locator('[data-linear-check="'+item+'"]').click();ok(work(p)['checks'][-1]['outcome']=='match','finite item fits '+key+'/'+item);ok(p.locator('#linear-feedback-'+item).evaluate('x=>document.activeElement===x'),'check focuses local feedback');ok('These values fit' in p.locator('#linear-status').inner_text(),'check message retained')
     if key=='zero' and n==2:
      before=copy.deepcopy(work(p)['checks']);fill(p,item,first,'1e2');p.locator('[data-linear-check="'+item+'"]').click();ok(work(p)['checks']==before,'malformed no outcome');ok(p.locator('#linear-input-status-'+item).evaluate('x=>document.activeElement===x'),'invalid input focuses local instruction');ok('Use a signed number' in p.locator('#linear-input-status-'+item).inner_text(),'input instruction stays beside item');fill(p,item,first,raw[first]);p.locator('[data-linear-skip="own"]').click();ok(work(p)['skips'][-1]['itemId']=='own','skip retained and editable');ok(p.locator('#linear-item-own').evaluate('x=>document.activeElement===x'),'skip keeps focus on current item')
    note=('\n' if key=='zero' else '')+'Synthetic explanation <script> & exact punctuation.';p.locator('[data-linear-note]').fill(note);p.locator('[data-linear-keep]').click();ok(work(p)['firstKept']['note']==note,'first keep exact writing');ok(p.locator('[data-linear-note]').input_value()==note,'rerender preserves leading newline')
    if key=='carry':p.locator('[data-linear-recommendation]').select_option('fractions');ok(work(p)['recommendation']=='fractions','ungraded recommendation')
    p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/f'{key}-{width}.png'),full_page=True)
   saved=copy.deepcopy(book(p)['linearPathway']);identity=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.reload();p.locator('#explorer-header').wait_for()
   if p.locator('[data-select-explorer]').count():p.locator('[data-select-explorer="'+identity+'"]').click()
   p.locator('[data-linear-root]').wait_for();ok(book(p)['linearPathway']==saved,'reload exact work')
   p.goto(BASE+'#notes');p.locator('#download').wait_for();ok('Signed rates and linear equations' in p.locator('main').inner_text(),'notes visible')
   with p.expect_download() as d:p.locator('#download').click()
   exported=json.loads(Path(d.value.path()).read_text());ok('linearPathway' in json.dumps(exported),'actual download retains unit')
   p.locator('#progress-file').set_input_files({'name':'synthetic-linear.json','mimeType':'application/json','buffer':json.dumps(exported).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual notes import');go(p,'#learn/math/zero');p.locator('[data-linear-start="zero"]').first.click();ok(p.locator('[data-linear-note]').input_value()=='\nSynthetic explanation <script> & exact punctuation.','imported leading newline preserved in textarea')
   c.close()
  for bad in [{'b':'3'},'x']:
   seed=copy.deepcopy(fixture);seed['linearPathway']=copy.deepcopy(exported['linearPathway']);seed['linearPathway']['currentId']='equal';seed['linearPathway']['lessons']['equal']['source']['model']['comparison']=bad;held=copy.deepcopy(seed['linearPathway']['lessons']['equal']);c,p=setup(browser,820,seed);go(p,'#learn/math/equal');ok('cannot be edited here' in p.locator('main').inner_text(),'malformed comparison shown as retained child');p.locator('[data-linear-start="views"]').click();ok(work(p)['source']['id']=='views','sibling remains playable after malformed comparison');ok(book(p)['linearPathway']['lessons']['equal']==held,'malformed comparison remains exact');c.close()
  seed=copy.deepcopy(fixture);seed['linearPathway']=copy.deepcopy(exported['linearPathway']);seed['linearPathway']['currentId']='carry';seed['linearPathway']['lessons']['carry']['recommendation']='retired-step';c,p=setup(browser,820,seed);go(p,'#learn/math/carry');ok(p.locator('[data-linear-recommendation]').input_value()=='retired-step','unknown saved recommendation stays selected');ok('Saved choice: retired-step' in p.locator('[data-linear-recommendation]').inner_text(),'unknown choice visibly explained');p.locator('[data-linear-recommendation]').select_option('fractions');ok(work(p)['recommendation']=='fractions','current choice can replace saved unknown choice');c.close()
  ok(not errors,'no page errors '+str(errors));print(f'Linear browser: {checks} checks passed; screenshots {OUT}')
 finally:browser.close()
