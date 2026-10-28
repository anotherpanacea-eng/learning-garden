"""Synthetic285 real Chrome journeys. No application-module interception.

CAFE_TOUCH_TEST_URL selects local/hosted app; CAFE_TOUCH_ARTIFACTS selects private
screenshots/downloads. No physical Safari, speech audibility or learning claim.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CAFE_TOUCH_ARTIFACTS',tempfile.mkdtemp(prefix='cafe-touch-')));OUT.mkdir(parents=True,exist_ok=True)
os.environ['RHYTHM_ARTIFACTS']=str(OUT)
spec=importlib.util.spec_from_file_location('native_helpers',ROOT/'test/rhythm-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
JAR='[data-cafe-bite][data-cafe-delta="1"]'
def action(a):return f'[data-cafe-action="{a}"]'
def click(p,a):h.click(p,action(a))
def current(p):return h.book(p)['cafe']['current']
def setup(browser,seed,width,label,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True);h.contexts.append(c)
 c.add_init_script('(s=>{if(!localStorage.getItem("cafe-touch-fixture")){const e={id:"explorer-1",avatar:"sky",color:"gold",symbol:"leaf",createdAt:"2026-10-28T12:00:00.000Z"};localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:e.id,explorers:[e]}));localStorage.setItem("number-garden-v1:"+e.id,JSON.stringify(s));localStorage.setItem("cafe-touch-fixture","1");}})('+json.dumps(seed)+')')
 p=c.new_page();h.pages.append((p,label));p.set_default_timeout(12000)
 p.on('pageerror',lambda e:h.errors.append({'case':label,'error':str(e)}));p.on('console',lambda e:h.console_errors.append({'case':label,'text':e.text}) if e.type=='error' else None)
 def failed(r):
  row={'case':label,'url':r.url,'failure':r.failure};(h.navigation_aborts if 'ERR_ABORTED' in (r.failure or '') else h.request_failures).append(row)
 p.on('requestfailed',failed);p.on('response',lambda r:h.http_failures.append({'case':label,'url':r.url,'status':r.status}) if r.status>=400 else None)
 return p

def go(p,base):
 p.goto(base+'#cafe',wait_until='domcontentloaded');p.locator('#explorer-header').wait_for();i=h.active(p)
 if p.locator(f'[data-select-explorer="{i}"]').count():h.click(p,f'[data-select-explorer="{i}"]');p.evaluate('location.hash="#cafe"')
 p.locator('[data-cafe-touch]').wait_for()
def reload(p):
 i=h.active(p);p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for()
 if p.locator(f'[data-select-explorer="{i}"]').count():h.click(p,f'[data-select-explorer="{i}"]');p.evaluate('location.hash="#cafe"')
 p.locator('[data-cafe-touch]').wait_for()
def snap(p,name):p.screenshot(path=str(OUT/(name+'.png')),full_page=True)
def jar(p,id):return p.locator(f'{JAR}[data-cafe-bite="{id}"]')
def page(p,delta):h.click(p,f'[data-cafe-page="{delta}"]')
def first_page(p):
 while not p.locator('[data-cafe-page="-1"]').first.is_disabled():page(p,-1)
def last_page(p):
 while not p.locator('[data-cafe-page="1"]').first.is_disabled():page(p,1)
def remove(p,id):h.click(p,f'[data-cafe-plate-remove="{id}"]')
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('[data-cafe-touch] button,[data-cafe-touch] summary,[data-cafe-touch] a').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<44||x.getBoundingClientRect().height<44)).map(x=>x.textContent.trim())')
 h.ok(not bad,'visible native touch targets >=44px '+str(bad))
 small=p.locator('[data-cafe-touch] *').evaluate_all("xs=>xs.filter(x=>!x.closest('svg')&&x.checkVisibility()&&(x.matches('input,button,select,textarea,summary')||[...x.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>({text:x.textContent.trim().slice(0,100),font:getComputedStyle(x).fontSize}))")
 h.ok(not small,'visible reading text and controls >=16px '+str(small))
def ax(p,selector):
 c=p.context.new_cdp_session(p);root=c.send('DOM.getDocument')['root']['nodeId'];node=c.send('DOM.querySelector',{'nodeId':root,'selector':selector})['nodeId'];rows=c.send('Accessibility.getPartialAXTree',{'nodeId':node,'fetchRelatives':False})['nodes'];c.detach();return rows[0]
def traverse(p,expected,size):
 seen=[];first_page(p)
 while True:
  ids=p.locator(JAR).evaluate_all('xs=>xs.map(x=>x.dataset.cafeBite)');h.ok(0<len(ids)<=size,'bounded shelf size');seen+=ids
  if p.locator('[data-cafe-page="1"]').is_disabled():break
  before=current(p);page(p,1);h.ok(current(p)==before,'paging preserves all mathematical work')
 h.ok(len(seen)==expected and len(set(seen))==expected,'every actually available ingredient exactly once')
 return seen

def ordinary(browser,base,f,width,height=1000):
 p=setup(browser,f['base'],width,f'ordinary-{width}',height);go(p,base)
 h.ok(p.locator('#cafe-touch-tools').get_attribute('open') is None and p.locator('#cafe-more-activities').get_attribute('open') is None,'first tools closed')
 h.ok(p.locator(JAR).count()==(4 if width<=620 else 6),'responsive first shelf')
 p.evaluate('scrollTo(0,0)');g=p.locator(JAR).first.bounding_box()
 if width>=820:h.ok(g['y']>=0 and g['y']+g['height']<=height,'first whole Add control inside initial viewport')
 bounds(p);snap(p,f'first-{width}x{height}');(OUT/f'first-{width}x{height}-geometry.json').write_text(json.dumps({'firstAdd':g,'viewport':{'width':width,'height':height}},indent=2))
 a=ax(p,JAR);details=(a.get('name',{}).get('value','')+' '+a.get('description',{}).get('value','')).lower()
 for word in ['moon crunch','warm','crunchy','sweet',str(h.book(p)['cafe']['stock']['moon-crunch'])+' in the jar','0 on your plate']:h.ok(word in details,'computed accessible jar details '+word)
 seen=traverse(p,8,4 if width<=620 else 6);h.ok('star-berry' not in seen,'undiscovered foods absent')
 # Last-page zero-stock ingredient is a genuine native planning button.
 jar(p,'dew-drop').click();h.ok(current(p)['recipe']['dew-drop']==1 and h.book(p)['cafe']['stock']['dew-drop']==0,'planning never grants zero stock');h.ok(not current(p)['plateAttempts'],'add never checks');remove(p,'dew-drop')
 first_page(p);jar(p,'moon-crunch').click();jar(p,'moon-crunch').click();h.ok(all(p.locator(JAR).nth(i).is_disabled() for i in range(p.locator(JAR).count())),'full plate disables all adds');h.ok(not p.locator('[data-cafe-page="1"]').is_disabled(),'full plate leaves paging enabled')
 p.evaluate('window.__oldJar=document.querySelector("[data-cafe-bite]");window.__oldCheck=document.querySelector("[data-cafe-action=check]")')
 remove(p,'moon-crunch');h.ok(current(p)['recipe']['moon-crunch']==1,'repeated slot removes one ingredient unit')
 stable=h.book(p);p.evaluate('window.__oldJar.click();window.__oldCheck.click()');h.ok(h.book(p)==stable,'detached jar/check are inert')
 click(p,'check');h.ok(current(p)['stage']=='plate' and len(current(p)['plateAttempts'])==1,'explicit failed count check retains plate');h.ok(p.locator('[data-cafe-plate-remove]').count()==1 and p.locator(JAR).count()>0,'repair retains live editor')
 bounds(p);recipe=copy.deepcopy(current(p)['recipe']);p.locator('[data-cafe-repair="1"]').click();h.ok(current(p)['recipe']==recipe,'correct repair answer does not repair plate');h.ok(len(current(p)['repair']['attempts'])==1,'repair response recorded separately')
 jar(p,'moon-crunch').click();h.ok(len(current(p)['plateAttempts'])==1,'editing after repair does not check');click(p,'check');h.ok(current(p)['stage']=='total','valid explicit check enters total')
 p.locator('#cafe-answer').fill('9');p.locator('[data-cafe-number-form]').evaluate('x=>{window.__oldForm=x;window.__oldInput=x.querySelector("input")}');p.locator('[data-cafe-number-form] button[type="submit"]').click()
 bounds(p);old=copy.deepcopy(current(p));h.ok(old['total']['attempts']==[9] and old['total']['supported'],'wrong total retains attempt and opens support')
 click(p,'revise-plate');h.ok(current(p)['params']==old['params'] and current(p)['total']==old['total'],'revision preserves frozen order and arithmetic work')
 safe=h.book(p);p.evaluate('window.__oldInput.value="4";window.__oldInput.dispatchEvent(new Event("input",{bubbles:true}));window.__oldForm.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}))');h.ok(h.book(p)==safe,'detached number input/submit are inert')
 remove(p,'moon-crunch');jar(p,'moon-crunch').click();click(p,'check');h.ok(current(p)['total']==old['total'],'explicit revised check preserves prior total work');reload(p);h.ok(current(p)['total']==old['total'],'reload preserves total input/attempt/support');click(p,'revise-plate')
 # Closed tools and paging preserve every pre-existing root on a literal Notes transfer.
 before=h.book(p);h.go(p,base,'#notes','#download')
 with p.expect_download() as d:h.click(p,'#download')
 path=OUT/f'notes-{width}.json';d.value.save_as(path);exported=json.loads(path.read_text());h.ok(h.raw_report(exported)==before,'actual full Notes download preserves notebook')
 go(p,base);p.evaluate('window.__oldOwnerJar=document.querySelector("[data-cafe-bite]")');owner=h.active(p);h.click(p,'#explorer-switch');h.click(p,'#explorer-new');h.click(p,'#explorer-create');p.locator('main').wait_for();
 if p.locator('dialog.welcome-film[open]').count():h.click(p,'[data-film-skip]')
 p.evaluate('location.hash="#cafe"');p.locator('[data-cafe-touch]').wait_for();click(p,'next');jar(p,'moon-crunch').click();safe=h.book(p);p.evaluate('window.__oldOwnerJar.click()');h.ok(h.book(p)==safe,'old owner jar inert after explorer switch');h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{owner}"]');p.evaluate('location.hash="#cafe"');p.locator('[data-cafe-touch]').wait_for();h.ok(h.book(p)==before,'switch back resumes exact owner work')
 h.go(p,base,'#notes','#progress-file');p.locator('#progress-file').set_input_files({'name':'synthetic-cafe.json','mimeType':'application/json','buffer':json.dumps(exported).encode()});h.click(p,'#progress-import-confirm');go(p,base);h.ok(h.active(p)!=owner,'real transfer creates separate explorer');reload(p);h.ok(h.book(p)==before,'import/reload preserves all roots and café work')
 return p

def additional(browser,base,f):
 for width in [320,820]:
  p=setup(browser,f['discovered'],width,f'discovered-{width}');go(p,base);traverse(p,11,4 if width<=620 else 6);jar(p,'wobble-fruit').click();h.ok(current(p)['recipe']['wobble-fruit']==1,'last discovered jar adds');remove(p,'wobble-fruit');p.set_viewport_size({'width':820 if width==320 else 320,'height':1000});p.wait_for_function("()=>{const n=document.querySelectorAll('[data-cafe-bite]').length;return n>0&&n<=(innerWidth<=620?4:6)}");h.ok(p.locator(JAR).count()<=(4 if width==820 else 6),'resize retains valid shelf');bounds(p)
 p=setup(browser,f['overfull'],820,'overfull');go(p,base);h.ok(p.locator('[data-cafe-plate-remove]').count()==4,'all accepted overfull bites visible');h.ok('Outside the requested spaces' in p.locator('[data-cafe-touch]').inner_text(),'overflow labelled');before=current(p);h.ok(before['recipe']==f['overfull']['cafe']['current']['recipe'] and not before['plateAttempts'],'render never trims/checks overfull');click(p,'check');h.ok(current(p)['repair']['direction']=='remove' and current(p)['repair']['needed']==2 and len(current(p)['plateAttempts'])==1,'overfull explicit check creates remove-two repair');remove(p,'dew-drop');h.ok(not current(p)['repair']['open'] and len(current(p)['plateAttempts'])==1,'overflow edit closes repair without new check');remove(p,'dew-drop');h.ok(current(p)['recipe']['moon-crunch']==2 and current(p)['recipe']['dew-drop']==0,'visible overflow removes exact ingredient');click(p,'check');h.ok(current(p)['stage']=='total','overflow repaired through native editor');snap(p,'overfull-repaired')
 p=setup(browser,f['expanded'],320,'expanded');go(p,base);h.ok('12 guests' in p.locator('[data-cafe-touch]').inner_text(),'expanded frozen guest count retained');bounds(p);snap(p,'expanded-320')
 p=setup(browser,f['completed'],820,'completed');go(p,base)
 for _ in range(2):
  h.ok(p.get_by_role('button',name='Keep serving',exact=True).is_visible() and p.get_by_role('button',name='Plan another gathering',exact=True).is_visible(),'complete supper actions visible outside closed tools');reload(p)
 snap(p,'completed-reload')

def shortage_and_service(browser,base,f):
 seed=copy.deepcopy(f['base']);seed['cafe']['served']=5
 p=setup(browser,seed,820,'shortage-sixth');go(p,base)
 jar(p,'moon-crunch').click();jar(p,'moon-crunch').click();click(p,'check')
 p.locator('#cafe-answer').fill('4');p.locator('[data-cafe-number-form] button[type="submit"]').click()
 h.ok(current(p)['stage']=='stock' and not p.locator('[data-cafe-plate-remove]').count() and not p.locator(action('revise-plate')).count(),'stock has no revision controls')
 plan=copy.deepcopy(current(p)['cupboardPlan']);h.ok(plan['missing']==1,'known one-bite shortage')
 p.locator('#cafe-answer').fill('9');p.locator('[data-cafe-number-form] button[type="submit"]').click();bounds(p);click(p,'skip-stage')
 before=copy.deepcopy(current(p));h.ok(h.book(p)['cafe']['stock']['moon-crunch']==3 and not p.locator(action('serve')).count(),'skip never fills the cupboard')
 h.click(p,'.cafe-gather-list a[href="#orchard/gather/moon-crunch"]');h.click(p,'[data-forage-start="moon-crunch"]');h.click(p,'[data-forage-action="map-help"]');h.click(p,'.hunt-plot.clue-intersection');h.click(p,'[data-forage-action="pack-help"]');h.click(p,'a.primary[href="#cafe"]');p.locator('[data-cafe-touch]').wait_for()
 h.ok(current(p)['cupboardPlan']==plan and current(p)['shortfall']==before['shortfall'],'real gathering preserves original shortfall work/plan');h.ok(h.book(p)['cafe']['stock']['moon-crunch']>=4,'native harvest fills actual stock')
 p.evaluate('window.__oldServe=document.querySelector("[data-cafe-action=serve]")');click(p,'serve');served=h.book(p)
 h.ok(served['cafe']['served']==6 and current(p)['stage']=='served','native sixth service completes supper');p.evaluate('window.__oldServe.click()');h.ok(h.book(p)==served,'retained Serve cannot spend twice')
 h.ok(p.get_by_role('button',name='Keep serving',exact=True).is_visible() and p.get_by_role('button',name='Plan another gathering',exact=True).is_visible(),'actual sixth table exposes ending actions');reload(p);h.ok(p.get_by_role('button',name='Plan another gathering',exact=True).is_visible(),'actual sixth ending survives reload');snap(p,'sixth-service')
 p.evaluate('window.__oldNext=document.querySelector("[data-cafe-action=next]")');click(p,'next');waiting=h.book(p);p.evaluate('window.__oldNext.click()');h.ok(h.book(p)==waiting,'retained Next cannot advance twice')
 # A live counter captured before route exit must also be inert.
 p.evaluate('window.__routeJar=document.querySelector("[data-cafe-bite]");location.hash="#home"');p.locator('[data-cafe-touch]').wait_for(state='detached');safe=h.book(p);p.evaluate('window.__routeJar.click()');h.ok(h.book(p)==safe,'route-exited native jar is inert')

def notes(p):
 if p.locator('dialog.welcome-film[open]').count():h.click(p,'[data-film-skip]')
 p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
def download(p,label):
 notes(p)
 with p.expect_download() as d:h.click(p,'#download')
 path=OUT/(label+'.json');d.value.save_as(path);return json.loads(path.read_text())
def import_notes(p,report):
 notes(p);p.locator('#progress-file').set_input_files({'name':'synthetic-cafe.json','mimeType':'application/json','buffer':json.dumps(report).encode()});h.click(p,'#progress-import-confirm');p.locator('#progress-import-confirm').wait_for(state='detached')
def cafe(p):
 if p.locator('dialog.welcome-film[open]').count():h.click(p,'[data-film-skip]')
 p.evaluate('location.hash="#cafe"');p.locator('[data-cafe-touch]').wait_for()
def new_explorer(p):
 h.click(p,'#explorer-switch');h.click(p,'#explorer-new');h.click(p,'#explorer-create');cafe(p)
def switch(p,owner):
 h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{owner}"]');cafe(p)
def retain_counter(p):
 p.evaluate("window.__retained=[...document.querySelectorAll('[data-cafe-action],[data-cafe-bite],[data-cafe-plate-remove],[data-cafe-range],[data-cafe-page],#cafe-answer,[data-cafe-number-form]')]")
def dispatch_counter(p):
 p.evaluate("()=>{for(const x of window.__retained){if(x.tagName==='FORM')x.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));else if(x.tagName==='INPUT'){x.value='7';x.dispatchEvent(new Event('input',{bubbles:true}));}else x.click();}}")
def boundaries_and_transfers(browser,base,f):
 for key in ['legacy','expanded']:
  p=setup(browser,f[key],820,'transfer-'+key);go(p,base);before=h.book(p);h.ok('params' in before['cafe']['current'],'legacy params normalized through actual app')
  retain_counter(p);report=download(p,'transfer-'+key);h.ok(h.raw_report(report)==before,'actual '+key+' Notes preserves normalized full notebook');owner=h.active(p);import_notes(p,report);safe=h.book(p);dispatch_counter(p);h.ok(h.book(p)==safe,'all captured café controls inert after '+key+' import');cafe(p);reload(p)
  again=download(p,'redownload-'+key);h.ok(h.raw_report(again)==before,'actual '+key+' import/reload/redownload preserves all roots');h.ok(h.active(p)!=owner,'transfer gets separate explorer')
 p=setup(browser,f['total'],820,'saveoff-reset');go(p,base);original=h.active(p);new_explorer(p);click(p,'next');jar(p,'moon-crunch').click();other=h.active(p);other_report=download(p,'other-before-reset');cafe(p);switch(p,original);retain_counter(p);notes(p);p.locator('#remember').uncheck();h.ok('lasts only while this page stays open' in p.locator('[data-saving-status]').inner_text(),'actual persistence switch off')
 cafe(p);click(p,'revise-plate');remove(p,'moon-crunch');report=download(p,'saveoff');h.ok(report['cafe']['current']['recipe']['moon-crunch']==1,'save-off actual download retains session work');h.ok(p.evaluate("()=>Object.keys(localStorage).every(k=>!k.startsWith('number-garden-v1:'))"),'save-off clears persisted explorer records')
 cafe(p);retain_counter(p);notes(p);h.click(p,'#reset');h.click(p,'#confirm-reset');p.locator('#confirm-reset').wait_for(state='detached');safe=download(p,'reset');dispatch_counter(p);h.ok(h.raw_report(download(p,'reset-after-stale'))==h.raw_report(safe),'captured controls inert after real reset');h.ok(safe['cafe']['current'] is None and 'syntheticOther' not in safe,'reset clears only active notebook work')
 # Resume saving through the real checkbox; save-off is not an artificial Storage fault.
 p.locator('#remember').check();h.ok(p.locator('#remember').is_checked(),'saving can be restored');cafe(p);switch(p,other);h.ok(h.raw_report(download(p,'other-after-reset'))==h.raw_report(other_report),'reset/save-off preserve other explorer session work')

def zero_and_rotation(browser,base,f):
 seed=copy.deepcopy(f['base']);seed['cafe']['stock']['moon-crunch']=20
 p=setup(browser,seed,390,'zero-rotation');go(p,base);jar(p,'moon-crunch').click();jar(p,'moon-crunch').click();click(p,'check');p.locator('#cafe-answer').fill('4');before=current(p)
 p.evaluate('window.__rotationRoot=document.querySelector("[data-cafe-touch]")');p.set_viewport_size({'width':844,'height':390});p.wait_for_function('document.querySelector("[data-cafe-touch]")!==window.__rotationRoot');p.wait_for_function('document.activeElement?.id==="cafe-answer"')
 h.ok(p.locator('#cafe-touch-tools').get_attribute('open') is None,'rotation keeps tools closed');h.ok(current(p)==before and p.locator('#cafe-answer').input_value()=='4','rotation preserves total input/work/focus');bounds(p)
 p.locator('[data-cafe-number-form] button[type="submit"]').click();h.ok(current(p)['cupboardPlan']['missing']==0,'zero-shortfall original plan');click(p,'help');bounds(p);p.locator('#cafe-answer').fill('0');p.locator('[data-cafe-number-form] button[type="submit"]').click();h.ok(p.locator(action('serve')).is_visible(),'zero shortfall accepts actual zero');stock=h.book(p)['cafe']['stock']['moon-crunch'];click(p,'serve');h.ok(h.book(p)['cafe']['stock']['moon-crunch']==stock-4,'zero-shortfall service spends only actual recipe')

def supper_and_routes(browser,base,f):
 p=setup(browser,f['completed'],820,'supper-continuation');go(p,base);cafe(p);owner=h.active(p);before=h.book(p);new_explorer(p);switch(p,owner);h.ok(h.book(p)==before,'complete supper survives native explorer switch');h.ok(p.locator(action('new-game-plus')).is_visible() and p.locator(action('continue-cafe')).is_visible(),'complete actions remain visible after switch')
 # Completed with a waiting order: neither continuation may replace that order or spend stock.
 jar(p,'moon-crunch').click();waiting=current(p);stock=h.book(p)['cafe']['stock'];baseline=h.book(p)['cafe']['supper'];p.evaluate('window.__oldKeep=document.querySelector("[data-cafe-action=continue-cafe]")');click(p,'continue-cafe');safe=h.book(p);p.evaluate('window.__oldKeep.click()');h.ok(h.book(p)==safe and current(p)==waiting and safe['cafe']['stock']==stock and safe['cafe']['supper']==baseline,'Keep serving/duplicate preserves waiting work stock baseline')
 p.evaluate('window.__oldPlus=document.querySelector("[data-cafe-action=new-game-plus]")');click(p,'new-game-plus');after=h.book(p);p.evaluate('window.__oldPlus.click()');h.ok(h.book(p)==after and current(p)==waiting and after['cafe']['stock']==stock,'Plan another gathering/duplicate preserves waiting order stock');h.ok(after['cafe']['supper']=={'round':2,'startedAtServed':6},'new gathering advances baseline exactly once')
 h.click(p,'#cafe-touch-tools>summary');h.click(p,'#cafe-range-choices>summary');h.click(p,'[data-cafe-range="all"]');h.ok(current(p)==waiting and h.book(p)['cafe']['range']=='all','range change affects future orders only');click(p,'skip-guest');h.ok(current(p)['orderIndex']!=waiting['orderIndex'] and 1<=current(p)['params']['guests']<=12,'next actual guest uses selected full range')
 # Tools/story and moved activities remain reachable through visible native controls.
 if p.locator('#cafe-touch-tools').get_attribute('open') is None:h.click(p,'#cafe-touch-tools>summary')
 h.click(p,'drawn-howto[data-how="cafe-order"] .dh-open');p.locator('drawn-howto[data-how="cafe-order"] .dh-panel').wait_for();bounds(p);h.click(p,'drawn-howto[data-how="cafe-order"] [data-dh="close"]');h.ok(p.locator('drawn-howto[data-how="cafe-order"] .dh-open').evaluate('x=>document.activeElement===x'),'guide close returns focus to visible tools trigger');bounds(p);h.click(p,'[data-start-path="cafe"]');p.wait_for_function('location.hash!=="#cafe"');p.locator('[data-cafe-touch]').wait_for(state='detached');h.ok(not p.locator('[data-cafe-touch]').count(),'introductory café story reachable');cafe(p)
 h.ok(p.locator('#explorer-switch').is_visible() and p.locator('[data-cafe-touch] a[href="#notes"]').is_visible(),'picker and Notes visibly reachable');h.click(p,'#cafe-more-activities>summary');bounds(p)
 links=p.locator('#cafe-more-activities a[href^="#cafe/"]').evaluate_all('xs=>[...new Set(xs.filter(x=>x.checkVisibility()).map(x=>x.getAttribute("href")))]');h.ok(len(links)>=4,'moved café benches offered')
 for route in links:
  h.click(p,f'#cafe-more-activities a[href="{route}"]');p.wait_for_function('(r)=>location.hash===r',arg=route);p.locator('[data-cafe-touch]').wait_for(state='detached');h.ok(not p.locator('[data-cafe-touch]').count(),'adjacent bench keeps own frame '+route);cafe(p)
  if p.locator('#cafe-more-activities').get_attribute('open') is None:h.click(p,'#cafe-more-activities>summary')
 h.click(p,'[data-cafe-touch] a[href="#home"]');p.wait_for_function('location.hash==="#home"');p.locator('[data-cafe-touch]').wait_for(state='detached');h.ok(not p.locator('[data-cafe-touch]').count(),'visible exit reaches home')

def offer_exposure(browser,base,f):
 p=setup(browser,f['offer'],820,'offer-exposure');go(p,base)
 def unseen():
  s=h.book(p);h.ok('4x3' not in s.get('exposures',[]),'hidden offer is not seen');h.ok(not s['baseline']['draft']['exposed'],'hidden offer does not qualify pending check-in')
 unseen();page(p,1);unseen();reload(p);unseen()
 p.evaluate('window.__oldDrawer=document.querySelector("#cafe-more-activities");window.__oldConnection=document.querySelector("[data-connection-start]")')
 h.go(p,base,'#notes','#download');before=h.book(p);p.evaluate('window.__oldDrawer.open=true;window.__oldDrawer.dispatchEvent(new Event("toggle"));window.__oldConnection?.click()');h.ok(h.book(p)==before,'stale toggle/start after route exit do nothing');unseen()
 go(p,base);h.click(p,'#cafe-more-activities>summary');p.wait_for_function('()=>JSON.parse(localStorage.getItem("number-garden-v1:explorer-1")).baseline.draft.exposed')
 seen=h.book(p);h.ok('4x3' in seen['exposures'],'actual opening marks displayed offer');h.ok(seen['baseline']['draft']['exposed'],'actual opening qualifies pending check-in');h.click(p,'#cafe-more-activities>summary');h.click(p,'#cafe-more-activities>summary');h.ok(h.book(p)==seen,'reopening idempotent no attempts')
 jar(p,'moon-crunch').click();h.ok(p.locator('#cafe-more-activities').get_attribute('open') is not None,'actual opened drawer survives same-order redraw');h.ok(not current(p)['plateAttempts'],'drawer/jar never checks plate')

 # Capture unexposed offer callbacks, then leave owner via the real picker/import.
 for boundary in ['switch','import']:
  q=setup(browser,f['offer'],820,'offer-stale-'+boundary);go(q,base);q.evaluate('window.__oldDrawer=document.querySelector("#cafe-more-activities");window.__oldConnection=document.querySelector("[data-connection-start]")');owner=h.active(q)
  if boundary=='switch':new_explorer(q)
  else:import_notes(q,download(q,'offer-import'))
  safe=h.book(q);q.evaluate('window.__oldDrawer.open=true;window.__oldDrawer.dispatchEvent(new Event("toggle"));window.__oldConnection?.click()');h.ok(h.book(q)==safe,'stale offer toggle/start inert after '+boundary)
  if boundary=='switch':
   switch(q,owner);h.ok(not h.book(q)['baseline']['draft']['exposed'] and '4x3' not in h.book(q)['exposures'],'stale switch callback leaves old owner pending unexposed')
  else:h.ok(not h.book(q)['baseline']['draft']['exposed'],'stale import callback leaves imported pending unexposed')

def main():
 f=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {cafeTouchFixtures,cafeOfferFixture} from './test/cafe-touch-checks.mjs';console.log(JSON.stringify({...cafeTouchFixtures(),offer:await cafeOfferFixture()}));"],cwd=ROOT,text=True));server=None;base=os.environ.get('CAFE_TOUCH_TEST_URL')
 if not base:
  class Quiet(http.server.SimpleHTTPRequestHandler):
   def log_message(self,*args):pass
  class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
  server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 base=base.rstrip('/')+'/'
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
  try:
   for w,height in [(320,1000),(820,1000),(1024,768)]:ordinary(browser,base,f,w,height)
   additional(browser,base,f);shortage_and_service(browser,base,f);offer_exposure(browser,base,f);boundaries_and_transfers(browser,base,f);zero_and_rotation(browser,base,f);supper_and_routes(browser,base,f);h.ok(not h.errors,'no page errors '+str(h.errors));h.ok(not h.console_errors,'no console errors '+str(h.console_errors));h.ok(not h.request_failures,'no failed requests '+str(h.request_failures));h.ok(not h.http_failures,'no HTTP failures '+str(h.http_failures))
   (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'scope':'native Chrome320/820/1024, real notebook downloads/import, two explorers, computed accessibility, paging, overflow, explicit repairs, total revision and stale controls','limits':['Physical Safari untested','Speech audibility untested','Learning gain untested']},indent=2));print(f'Café touch browser: {h.checks} assertions passed; artifacts {OUT}')
  except Exception:
   (OUT/'failure.txt').write_text(traceback.format_exc())
   for p,label in h.pages:
    if not p.is_closed():
     try:snap(p,label+'-failure');(OUT/(label+'-failure.html')).write_text(p.content())
     except Exception:pass
   raise
  finally:
   browser.close()
   if server:server.shutdown()
if __name__=='__main__':main()
