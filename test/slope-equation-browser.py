"""Synthetic Courier's Price Chrome journeys; no learner data or service calls.

The app response gains only a closure reader for save-off/storage-failure checks.
Set PRICE_TEST_URL for a local preview or the canonical hosted release.
"""
import copy, json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('PRICE_TEST_URL','http://127.0.0.1:4194/')
OUT=Path(os.environ.get('PRICE_ARTIFACTS','/tmp/slope-equation-browser'));OUT.mkdir(parents=True,exist_ok=True)
fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',"""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startDesk,setDeskLocation,setDeskDraft} from './dist/keepers-desk-core.mjs';
import {startPostOffice} from './dist/post-office-core.mjs';
import {startAdaptiveRival,setBrambleMode} from './dist/post-rival.mjs';
import {generateRivalTask} from './dist/post-rival-generator.mjs';
const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
const waiting=fresh();startDesk(waiting);setDeskLocation(waiting,'cost','1a');setDeskDraft(waiting,'1a','Synthetic waiting value');
const v=startPostOffice(waiting,'purl-blankets');setBrambleMode(waiting,'multiply');startAdaptiveRival(waiting);v.rival.task=generateRivalTask('multiply',2,4,0);v.rival.input='7';
waiting.baseline.draft={questionId:'groups',attempts:[],input:'',hinted:false,revealed:false};
console.log(JSON.stringify({fresh:fresh(),waiting}));
"""],cwd=ROOT,text=True))
checks=0;errors=[];contexts=[]
def ok(value,message):
 global checks
 assert value,message
 checks+=1

def book(p):return p.evaluate('()=>window.__priceRead()')
def active(p):return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
def work(p,id=None):
 b=book(p)['slopeBench'];return b['cases'][id or b['currentId']]
def setup(browser,width,seed=None,failed=False):
 c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True);contexts.append(c)
 s=copy.deepcopy(fixtures['fresh'] if seed is None else fixtures[seed] if isinstance(seed,str) else seed)
 init="""({seed,failed})=>{if(!localStorage.getItem('price-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('price-fixture','1');}if(failed)Storage.prototype.setItem=function(){throw Error('Synthetic storage failure');};}"""
 c.add_init_script('('+init+')('+json.dumps({'seed':s,'failed':failed})+')')
 def app(route):
  response=route.fetch();body=response.text();needle='let graph=null;'
  if needle not in body:raise AssertionError('app closure reader insertion anchor missing')
  route.fulfill(response=response,body=body.replace(needle,'window.__priceRead=()=>structuredClone(state);'+needle,1))
 c.route('**/app.mjs',app)
 p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));return c,p

def go(p,h):
 p.goto(BASE+h)
 selector={'#desk/linear':'[data-price-root]','#desk':'[data-desk-root]','#notes':'#download','#post':'[data-post-view]'}.get(h,'main')
 if h=='#post':p.locator('main').wait_for();p.wait_for_function("typeof window.__priceRead==='function'")
 else:p.locator(selector).first.wait_for()
def card(p,id):p.locator('[data-price-start="'+id+'"]').tap()
def page(p,n):p.locator('[data-price-page="'+str(n)+'"]').first.tap()
def fill(p,k,value):p.locator('[data-price-field="'+k+'"]').fill(value)
def check(p,kind):p.locator('[data-price-check="'+kind+'"]').tap()
def shot(p,name):
 p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/name),full_page=True)
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('.price-page button,.price-page summary,.price-page a,.price-page input,.price-page textarea').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&x.getBoundingClientRect().height<44).map(x=>({text:x.textContent,h:x.getBoundingClientRect().height}))")
 ok(not bad,'44px controls: '+str(bad))
 ok(p.locator('.price-page').evaluate('x=>parseFloat(getComputedStyle(x).fontSize)>=16'),'16px base text')
def reload(p):
 identity=active(p);p.reload();p.locator('#explorer-header').wait_for()
 if p.locator('[data-select-explorer]').count():p.locator('[data-select-explorer="'+identity+'"]').click()
 p.locator('[data-price-root]').wait_for()
def download(p):
 go(p,'#notes')
 with p.expect_download() as d:p.locator('#download').click()
 return json.loads(Path(d.value.path()).read_text())
def bring(p,value):
 go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-price.json','mimeType':'application/json','buffer':json.dumps(value).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual notes import')
def no_scored_change(before,after):
 return all(after.get(k)==before.get(k) for k in ['practice','puzzles','sessions']) and after['baseline']['observations']==before['baseline']['observations']

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 try:
  for width in [320,820]:
   c,p=setup(browser,width,'waiting');go(p,'#desk/linear');initial=book(p);ok('slopeBench' not in initial,'passive entry allocates no bench');shot(p,f'entry-{width}.png');bounds(p)
   ok(p.locator('[data-price-start]').count()==3,'all three cards immediately available');card(p,'bag');w=work(p);ok(w['source']['m']==2 and w['source']['b']==3 and w['x']==0,'card starts at fixed charge, not origin');bounds(p)
   ok('3' in p.locator('#price-x-state').inner_text(),'fixed charge visible at zero distance');ok(p.locator('svg[role="img"]').count()>0,'labeled visual model');ok(p.locator('table').count()>0,'numeric table access')
   minus=p.locator('[data-price-delta="-1"]');minus.focus();p.keyboard.press('Enter');ok(minus.evaluate('x=>document.activeElement===x'),'endpoint stepper keeps keyboard focus');ok(work(p)['x']==0,'endpoint cannot leave domain')
   plus=p.locator('[data-price-delta="1"]');plus.focus();p.keyboard.press('Enter');ok(work(p)['x']==1,'keyboard increases distance');ok(p.locator('[data-price-delta="1"]').evaluate('x=>document.activeElement===x'),'stepper focus restored after render');ok('1' in p.locator('#price-status').inner_text(),'distance update announced')
   p.locator('[data-price-x]').fill('4');p.locator('[data-price-x]').press('Enter');ok(work(p)['x']==4,'distance entry updates model')
   bounds(p);shot(p,f'model-{width}.png')
   page(p,1);ok(p.locator('#price-turn').evaluate('x=>document.activeElement===x'),'page navigation focuses turn heading');fill(p,'m','3');fill(p,'b','2');check(p,'rule');w=work(p);ok(w['checks'][-1]['outcome']=='different','swapped coefficients checked different');ok('swap' in p.locator('#price-status').inner_text().lower(),'swapped roles explained')
   fill(p,'m','2');fill(p,'b','3');check(p,'rule');ok(work(p)['checks'][-1]['outcome']=='match','correct rate and start');ok(p.locator('[data-price-field="m"]').input_value()=='2','rule remains editable after check')
   prior=copy.deepcopy(work(p)['checks']);fill(p,'m','2 coins');check(p,'rule');ok(work(p)['checks']==prior,'malformed rule is not a wrong attempt');ok(p.locator('[data-price-field="m"]').input_value()=='2 coins','raw malformed input remains editable');fill(p,'m','2');fill(p,'b','');check(p,'rule');ok(work(p)['checks']==prior,'blank start does not silently become zero');fill(p,'b','3')
   p.locator('[data-price-help]').tap();help_seen=copy.deepcopy(work(p)['help']);ok(bool(help_seen),'help recorded separately');check(p,'rule');last=work(p)['checks'][-1];ok(any(last.get(k)==help_seen for k in ['help','helpSeenBefore']),'checked response snapshots preceding help');bounds(p);shot(p,f'rule-{width}.png')
   page(p,2);fill(p,'distance','11');check(p,'distance');ok(work(p)['checks'][-1]['outcome']=='different','total-as-distance is checked not invalid');ok('0' in p.locator('#price-status').inner_text() and '6' in p.locator('#price-status').inner_text(),'out-of-range misconception includes domain');fill(p,'distance','8');check(p,'distance');ok('divid' in p.locator('#price-status').inner_text().lower(),'subtract-only misconception specific');fill(p,'distance','4');check(p,'distance');ok(work(p)['checks'][-1]['outcome']=='match','reverse equation distance fits');bounds(p)
   page(p,3);fill(p,'note','A synthetic comparison: the starting charge stays the same.');p.locator('[data-price-keep]').tap();first=copy.deepcopy(work(p)['firstKept']);ok(first is not None,'explicit page kept');fill(p,'note','A synthetic revised comparison.');p.locator('[data-price-keep]').tap();ok(work(p)['firstKept']==first and work(p)['kept']!=first,'first kept version survives revision');bounds(p);shot(p,f'compare-{width}.png')
   bag=copy.deepcopy(work(p));card(p,'journey');page(p,1);fill(p,'m','2');fill(p,'b','0');check(p,'rule');ok(work(p)['checks'][-1]['outcome']=='match','zero intercept is explicitly entered');page(p,2);fill(p,'distance','5');check(p,'distance');ok(work(p)['checks'][-1]['outcome']=='match','journey-only reverse case');card(p,'express');page(p,2);fill(p,'distance','4');check(p,'distance');ok(work(p)['checks'][-1]['outcome']=='different','carried-over card answer checked against current source');fill(p,'distance','3');check(p,'distance');ok(work(p)['checks'][-1]['outcome']=='match','new rate inverse case');page(p,3);ok('1' in p.locator('.price-page').inner_text(),'comparison includes tie at one');bounds(p);shot(p,f'different-price-{width}.png')
   card(p,'bag');ok(work(p)==bag,'switching cards preserves exact separate work');reload(p);ok(work(p)==bag,'reload retains source/drafts/checks/kept page')
   after=book(p);ok(after['desk']==initial['desk'],'waiting Desk case untouched');v=after['postOffice']['visits'][0];old=initial['postOffice']['visits'][0];ok(v['clauses']==old['clauses'] and v['packing']==old['packing'],'waiting parcel composition/packing untouched');ok(v['rival']['input']==old['rival']['input'] and v['rival']['attempts']==old['rival']['attempts'],'pending rival input/attempts untouched');ok(v['rival'].get('priorFactShown') is True,'display qualifies pending Bramble fact');ok(after['baseline']['draft'].get('exposed') is True,'display qualifies pending baseline fact');ok(no_scored_change(initial,after),'lesson adds no scored generic observations')
   go(p,'#desk');ok(p.locator('a[href="#desk/linear"]').count()>0,'Desk entry reaches teaching bench');go(p,'#post');ok(book(p)['postOffice']['current']==initial['postOffice']['current'],'route visit preserves same waiting delivery');go(p,'#desk/linear');ok(work(p)==bag,'return keeps same card/page')
   stale=p.locator('[data-price-keep]').element_handle();page(p,1);before=copy.deepcopy(book(p)['slopeBench']);stale.evaluate('x=>x.click()');ok(book(p)['slopeBench']==before,'detached controls cannot mutate new page')
   p.evaluate("()=>{window.__oldPrice=document.querySelector('[data-price-check]');location.hash='#notes';__oldPrice.click();}");p.locator('#download').wait_for();ok(book(p)['slopeBench']==before,'changed-hash event rejected before render')
   raw=download(p);expected=copy.deepcopy(raw['slopeBench']);ok(expected==book(p)['slopeBench'],'actual notes export contains source and work');original=active(p);bring(p,raw);go(p,'#desk/linear');ok(book(p)['slopeBench']==expected,'actual import preserves bench');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+original+'"]').click();go(p,'#desk/linear');ok(book(p)['slopeBench']==expected,'explorer isolation preserves original')
   # Frozen source stays authoritative and past checks are not regraded.
   revised=copy.deepcopy(raw);revised['slopeBench']['cases']['bag']['source']['m']=1;revised['slopeBench']['cases']['bag']['source']['b']=3;revised['slopeBench']['cases']['bag']['source']['target']=7
   bring(p,revised);go(p,'#desk/linear');card(p,'bag');page(p,1);ok(work(p)['checks']==raw['slopeBench']['cases']['bag']['checks'],'import source change does not reinterpret old outcomes');fill(p,'m','1');fill(p,'b','3');check(p,'rule');ok(work(p)['checks'][-1]['outcome']=='match','new check uses original saved source rather than current catalog')
   # Unsupported sibling and unknown supported id survive actual roundtrip.
   mixed=copy.deepcopy(raw);mixed['slopeBench']['cases']['journey']={'future':'Synthetic <raw> sibling'};mixed['slopeBench']['cases']['saved-note']=copy.deepcopy(mixed['slopeBench']['cases']['bag']);mixed['slopeBench']['cases']['saved-note']['source']['id']='saved-note';mixed['slopeBench']['cases']['saved-note']['source']['title']='Synthetic earlier card';mixed['slopeBench']['currentId']='saved-note';bring(p,mixed);go(p,'#desk/linear');ok(work(p)['source']['id']=='saved-note','unknown supported saved id opens');ok(p.locator('[data-price-start="saved-note"]').count()==1,'unknown saved card selectable');card(p,'express');ok(book(p)['slopeBench']['cases']['journey']==mixed['slopeBench']['cases']['journey'],'unreadable sibling retained');page(p,2);fill(p,'distance','3');check(p,'distance');ok(work(p)['checks'][-1]['outcome']=='match','readable sibling remains usable')
   escaped=copy.deepcopy(raw);escaped['slopeBench']['cases']['bag']['drafts']['note']='<img src=x onerror="window.priceInjected=1"> Synthetic note';escaped['slopeBench']['currentId']='bag';escaped['slopeBench']['cases']['bag']['page']=3;bring(p,escaped);go(p,'#desk/linear');ok(p.locator('.price-page img').count()==0 and not p.evaluate('Boolean(window.priceInjected)'),'saved original prose is escaped');ok(p.locator('[data-price-field="note"]').input_value()==escaped['slopeBench']['cases']['bag']['drafts']['note'],'literal note preserved')
   c.close()
  # Wrapper recovery has no reset/fork and leaves other places accessible.
  seed=copy.deepcopy(fixtures['fresh']);seed['slopeBench']={'version':99,'raw':'Synthetic future <price> notebook'};c,p=setup(browser,320,seed);go(p,'#desk/linear');ok(book(p)['slopeBench']==seed['slopeBench'],'future wrapper kept exact');ok(p.locator('[data-price-start]').count()==0,'future wrapper cannot silently start a fork');go(p,'#desk');ok(p.locator('[data-desk-root]').is_visible(),'unsupported bench leaves Desk open');c.close()
  # Session-only work remains usable with saving off or disk failures.
  for failed in [False,True]:
   c,p=setup(browser,320,failed=failed);go(p,'#notes')
   if not failed:p.locator('#remember').uncheck()
   go(p,'#desk/linear');card(p,'bag');page(p,1);fill(p,'m','2');fill(p,'b','3');check(p,'rule');ok(work(p)['checks'][-1]['outcome']=='match','memory lesson with saving off or failed');ok(('Progress could not be saved' in p.locator('body').inner_text()) if failed else p.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:')).length===0"),'disk failure warning or save-off persistence removal');c.close()
  ok(not errors,'no browser runtime errors: '+str(errors));print(f'Courier Price Chrome: {checks} assertions passed at320/820.')
 finally:
  for c in contexts:
   try:c.close()
   except Exception:pass
  browser.close()
