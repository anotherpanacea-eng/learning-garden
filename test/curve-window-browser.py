"""Curve Window391 actual app journeys with invented records only.
One tablet journey; focused responsive, capacity and isolated lifecycle probes.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CURVE_ARTIFACTS') or tempfile.mkdtemp(prefix='curve-window-'));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('curve_notes_helpers',ROOT/'test/writing-table-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h);h.OUT=OUT
def fixture(extra=''):
 code="import{readFileSync}from'node:fs';import{freshState,recommendations}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{startEquality,pageEquality,editEquality}from'./dist/equality-desk-core.mjs';import{makeCurveSource}from'./dist/curve-window-content.mjs';import{newCurveWork}from'./dist/curve-window-core.mjs';import{startPostOffice}from'./dist/post-office-core.mjs';import{deliveries}from'./dist/post-office-content.mjs';import{startAdaptiveRival,generateRivalTask}from'./dist/post-rival.mjs';let s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticSibling={raw:'invented',payload:'z'.repeat(512000)};"+extra+";console.log(JSON.stringify(s));"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 explorers=[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-05T12:00:00Z'}]
 if len(json.dumps(seed))<4*1024*1024:explorers.append({'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-11-05T12:00:00Z'})
 registry={'version':1,'activeId':'explorer-1','explorers':explorers}
 c.add_init_script('(d=>{if(!localStorage.getItem("curve-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const x of d.registry.explorers)localStorage.setItem("number-garden-v1:"+x.id,JSON.stringify(x.id==="explorer-1"?d.seed:d.other));localStorage.setItem("curve-fixture","1");}})('+json.dumps({'registry':registry,'seed':seed,'other':fixture('delete s.syntheticSibling')})+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:h.errors.append(str(e)));p.on('console',lambda m:h.errors.append(m.text) if m.type=='error' else None);p.on('response',lambda r:h.errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None)
 p.goto(base+'#learn/math/equality',wait_until='networkidle');ready(p);return c,p
def ready(p):
 active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');choice='[data-select-explorer="'+active+'"]'
 p.locator('[data-equality-curve],'+choice).first.wait_for()
 if p.locator(choice).count():p.locator(choice).click()
 p.locator('[data-equality-curve]').wait_for()
def sel(name,value=None):return '[data-cw-'+name+('="'+str(value)+'"' if value is not None else '')+']'
def click(p,name,value=None):
 if name in ['working','shelf']:
  d=p.locator('.cw-tools')
  if d.get_attribute('open') is None:d.locator(':scope>summary').click()
 p.locator(sel(name,value)+':visible').first.click()
def enter(p):p.locator('[data-equality-curve]').tap();p.locator(sel('root')).wait_for()
def choose(p,id):
 d=p.locator('[data-cw-fold="drafts"]')
 if d.get_attribute('open') is None:d.locator(':scope>summary').click()
 p.locator(sel('case')).select_option(id)
def rows(p):return h.book(p).get('curveSheets',[])
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('[data-cw-root] button,[data-cw-root] a,[data-cw-root] select,[data-cw-root] summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'44px targets and16px control text: '+str(bad))
 tiny=p.locator('[data-cw-root] svg text').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)*Math.abs(x.getScreenCTM().a)<15.9).map(x=>x.textContent)')
 h.ok(not tiny,'effective SVG labels remain readable: '+str(tiny))
def mark(p,x,y):
 p.locator(sel('point-x')).select_option(str(x));p.locator(sel('point-y')).select_option(str(y));click(p,'add-point');h.ok(p.locator(sel('add-point')).evaluate('e=>e===document.activeElement'),'point edit preserves control focus')
def add_band(p,lo,hi):
 p.locator(sel('band-lo')).select_option(str(lo));p.locator(sel('band-hi')).select_option(str(hi));click(p,'add-band')
def journey(browser,base):
 print('Curve Window: actual proposals, optional reference, arithmetic and copies',flush=True)
 seed=fixture('s.broad.drafts.waiting={question:{fact:[3,3]},attempts:[],raw:"held"};const v=startPostOffice(s,deliveries[0].id);startAdaptiveRival(s);v.rival.task=generateRivalTask("multiply",3,3,0);')
 c,p=setup(browser,base,seed)
 try:
  before=copy.deepcopy(h.book(p));enter(p);bounds(p);h.ok(h.book(p)==before,'entry makes no notebook record');h.ok(not p.locator('.cw-model-curve,.cw-calculation,.cw-zero-reference').count(),'candidate-only Plot has no hidden model result')
  mark(p,-2,4);mark(p,2,4);p.locator(sel('fold-cursor')).select_option('0');click(p,'set-fold');h.ok('at 0' in p.locator('.cw-proposals').inner_text(),'proposed fold is editable independently')
  click(p,'page','zeroes');h.ok(not p.locator('.cw-model-curve,.cw-calculation').count(),'Zeroes can be constructed before seeing reference')
  p.locator(sel('idea')).select_option('two');add_band(p,-8,-4);add_band(p,4,8);h.ok(h.book(p)==before,'candidate points/fold/idea/bands stay local before Keep')
  click(p,'toggle-model');h.ok(p.locator('.cw-model-curve').count()==1 and not p.locator('.cw-zero-reference').count(),'explicit curve reveal does not reveal root explanation')
  b=h.book(p);h.ok(b['broad']['drafts']['waiting']['knownFact'] and b['broad']['drafts']['waiting']['attempts']==[],'actual callback marks matching Broad exposure without attempt');h.ok(b['postOffice']['visits'][0]['rival']['priorFactShown'] and b['postOffice']['visits'][0]['rival']['attempts']==[],'actual waiting Bramble exposure is preserved separately');h.ok(b['baseline']['observations']==before['baseline']['observations'],'no independent observations invented')
  click(p,'explain');h.ok('touches zero' in p.locator('.cw-zero-reference').inner_text(),'touching is distinguished from crossing even against learner two idea')
  click(p,'explain');h.ok(not p.locator('.cw-zero-reference').count() and p.locator('.cw-model-curve').count()==1,'hide explanation leaves model open');click(p,'toggle-model');h.ok(not p.locator('.cw-model-curve,.cw-calculation').count(),'hide model removes computed markup')
  click(p,'keep');first=copy.deepcopy(rows(p)[0]);h.ok(first['work']['points']==[{'x':-2,'y':4},{'x':2,'y':4}] and first['work']['zeroIdea']=='two' and first['work']['crossingsShown'],'Keep retains unexpected proposal and view requests')
  click(p,'copy');click(p,'page','plot');mark(p,0,2);click(p,'back');enter(p);click(p,'shelf');click(p,'card',first['id']);click(p,'copy');h.ok(p.locator('.cw-proposals li').count()==2,'literal copy never silently resumes changed proposal')
  click(p,'teaching')
  for i in range(6):
   h.ok(f'{i+1} of 6' in p.locator('#cw-task').inner_text(),'manual teaching own page')
   if i==1:h.ok('y = (x − 1)² − 4' in p.locator('.cw-example').inner_text(),'teaching example is independent of current rule')
   if i==5:h.ok('−7/16' in p.locator('.cw-example').inner_text() and '1/4' in p.locator('.cw-example').inner_text(),'fractional zero bounds are exact endpoint calculations')
   if i<5:click(p,'teach-step',1)
  click(p,'close-help');click(p,'keep');h.ok(rows(p)[0]==first and rows(p)[-1]['work']['teachingShown'],'only new version adds teaching request')
  click(p,'copy');choose(p,'between');click(p,'page','compare');p.locator(sel('probe')).select_option('7');h.ok('−9/4' not in p.locator('.cw-calculation').first.inner_text(),'probe changes do not borrow another saved example');h.ok('89/16' in p.locator('.cw-calculation').first.inner_text(),'quarter input7/4 under(x+1)^2−2 gives89/16')
  click(p,'page','zeroes');click(p,'explain');h.ok('−5/2' in p.locator('.cw-zero-reference').inner_text() and '−9/4' in p.locator('.cw-zero-reference').inner_text(),'shifted root intervals retain signs and quarter scale')
  choose(p,'above');click(p,'page','zeroes');h.ok(not p.locator('.cw-model-curve').count(),'new case starts candidate-only');click(p,'explain');h.ok('no real input' in p.locator('.cw-zero-reference').inner_text(),'no-zero reason uses known square rule')
  p.screenshot(path=str(OUT/'tablet.png'),full_page=True);click(p,'back');h.ok(h.book(p)['syntheticSibling']==before['syntheticSibling'],'parent return preserves unknown sibling');report=h.export_notes(p,'curve-pictures');h.ok(report['curveSheets']==rows(p),'actual Notes carries frozen pictures');return report
 finally:c.close()
def transfer(browser,base,report):
 print('Curve Window: actual historical-source import, sparse roots and reload',flush=True)
 changed=copy.deepcopy(report);old=changed['curveSheets'][0];old['source'].update({'id':'earlier-window','title':'Earlier <literal> & window','h':0,'k':-9,'plotXs':[-4,0,4]});old['source']['axes']['yMin']=-12;old['source']['teaching'][0]['words']='Earlier teaching stays literal.';old['source']['teaching'][0]['example']={'future':7};old['work'].update({'points':[],'fold4':None,'bands':[],'referenceShown':True,'crossingsShown':False,'teachingShown':False,'extra':{'held':True}})
 changed['curveSheets']=[{'id':'curve-sheet-900','future':True},old,{'id':'curve-sheet-777','future':True},{'id':'curve-sheet-777','future':True},None,None,None,None,None]
 c,p=setup(browser,base,fixture())
 try:
  original=copy.deepcopy(h.book(p));p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-curves.json','mimeType':'application/json','buffer':json.dumps(changed).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-curve]').wait_for();enter(p);click(p,'shelf');click(p,'shelf-step',1);h.ok('Earlier picture 9' in p.locator(sel('root')).inner_text(),'raw shelf paginates past eight');click(p,'shelf-step',-1);click(p,'card',old['id']);h.ok(p.locator('.cw-title').text_content()=='Earlier <literal> & window','own literal title is escaped and retained');click(p,'copy');click(p,'teaching');h.ok('Earlier teaching stays literal.' in p.locator(sel('root')).inner_text() and 'picture cannot be drawn' in p.locator(sel('root')).inner_text(),'unknown example has a local picture fallback');click(p,'close-help');click(p,'page','compare');p.locator(sel('probe')).select_option('7');h.ok('−95/16' in p.locator('.cw-calculation').first.inner_text(),'historical source calculates its own rational result');click(p,'page','zeroes');click(p,'explain');h.ok('−3' in p.locator('.cw-zero-reference').inner_text() and '3 × 3' in p.locator('.cw-zero-reference').inner_text(),'sparse table exact roots have their own displayed square calculations');click(p,'keep');h.ok(rows(p)[-1]['id']=='curve-sheet-901' and rows(p)[:-1]==changed['curveSheets'],'canonical future suffix and raw siblings preserved');expected=copy.deepcopy(rows(p));p.reload(wait_until='networkidle');ready(p);h.ok(rows(p)==expected,'reload retains exact frozen source and work');again=h.export_notes(p,'curve-redownload');h.ok(again['curveSheets']==expected,'actual redownload is exact')
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-1"]').click();p.wait_for_function('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId==="explorer-1"');h.ok(h.book(p)==original,'imported explorer does not change original notebook')
 finally:c.close()
def parent_and_cap(browser,base):
 print('Curve Window: actual parent typing and real capacity refusal',flush=True)
 extra='const o={canExport:()=>true};startEquality(s,"twins",o);pageEquality(s,3,o);editEquality(s,"note","Earlier synthetic words.",o);'
 c,p=setup(browser,base,fixture(extra))
 try:
  p.locator('[data-equality-field="note"]').fill('Waiting synthetic explanation.');before=copy.deepcopy(h.book(p));enter(p);click(p,'back');h.ok(h.book(p)['equalityDesk']==before['equalityDesk'] and p.locator('[data-equality-field="note"]').input_value()=='Waiting synthetic explanation.','actual parent words and source survive child entry and Back')
 finally:c.close()
 cap="s.padding='';const app=readFileSync('./dist/app.mjs','utf8'),decl=app.match(/^function notesReport\\(notebook\\)\\{.*\\}$/m)[0],report=Function('recommendations','explorerStore',decl+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});s.padding='x'.repeat(5*1024*1024-new TextEncoder().encode(JSON.stringify(report(s),null,2)).length-20);"
 c,p=setup(browser,base,fixture(extra+cap))
 try:
  old=p.locator('[data-equality-field="note"]').element_handle();before=copy.deepcopy(h.book(p));p.locator('[data-equality-field="note"]').fill('Rejected words. '+('x'*1000));p.locator('[data-equality-curve]').click();h.ok(not p.locator(sel('root')).count() and old.evaluate('e=>e===document.querySelector("[data-equality-field=note]")') and p.locator('[data-equality-field="note"]').input_value().startswith('Rejected words.'),'rejected parent typing blocks entry without DOM loss');h.ok(h.book(p)==before,'entry refusal mutates no notebook data')
 finally:c.close()
 c,p=setup(browser,base,fixture('s.broad.drafts.waiting={question:{fact:[3,3]},attempts:[]};'+cap))
 try:
  before=copy.deepcopy(h.book(p));enter(p);mark(p,0,1);click(p,'page','compare');h.ok('Plot your picture' in p.locator('#cw-task').inner_text() and not p.locator('.cw-model-curve,.cw-calculation').count(),'actual Notes capacity refuses computed DOM');h.ok(h.book(p)==before and 'could not be opened safely' in p.locator('#cw-status').inner_text(),'real cap leaves prior book exact');h.ok(not p.locator('[data-speak]').count(),'refused model narration is absent');mark(p,1,2);h.ok(not p.locator(sel('retry')).count(),'construction edit clears refused retry');click(p,'keep');h.ok(h.book(p)==before and 'could not be kept safely' in p.locator('#cw-status').inner_text(),'actual Keep cap preserves new inputs and old book')
 finally:c.close()
def responsive(browser,base):
 print('Curve Window: narrow/wide touch, keyboard focus, reset and saving off',flush=True)
 for width,height in [(320,600),(1024,768)]:
  c,p=setup(browser,base,fixture(),width,height)
  try:
   enter(p);bounds(p);mark(p,-1,1);click(p,'page','compare');p.locator(sel('probe')).select_option('5');h.ok(p.locator(sel('probe')).evaluate('e=>e===document.activeElement'),'probe change retains control focus');bounds(p)
   p.locator(sel('page','compare')).focus();p.evaluate('scrollTo(0,scrollY+document.querySelector("#cw-task").getBoundingClientRect().top+300)');p.keyboard.press('Enter');h.ok(p.locator('#cw-task').evaluate('e=>e===document.activeElement&&e.getBoundingClientRect().top>=0'),'offscreen keyboard page activation brings heading into view');h.ok(p.evaluate('(()=>{const h=document.querySelector("#cw-task").getBoundingClientRect(),t=document.querySelector(".cw-tabs").getBoundingClientRect();return h.top>=Math.max(0,t.bottom)-1})()'),'heading is not covered by tabs')
   p.screenshot(path=str(OUT/f'sample-{width}.png'),full_page=True);click(p,'keep');old=p.locator(sel('copy')).element_handle();p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click();p.locator('[data-film-skip]').click();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-curve]').wait_for();enter(p);old.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok('curveSheets' not in h.book(p),'reset and stale controls cannot resurrect pictures')
  finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-curve]').wait_for();before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');enter(p);mark(p,0,1);click(p,'keep');h.ok('saving was off' in p.locator('#cw-status').inner_text(),'actual save-off notice');h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'save-off leaves storage exact');report=h.export_notes(p,'curve-session');h.ok(report['curveSheets'][0]['work']['points']==[{'x':0,'y':1}],'actual Notes recovers session-only construction')
 finally:c.close()
def isolated(browser,base):
 print('Curve Window: separately labelled actual-UI context/retry/stale harness',flush=True)
 c,p=setup(browser,base,fixture())
 def install():
  p.evaluate("""async()=>{const u=await import('./curve-window-ui.mjs');history.replaceState(null,'','#learn/math/equality');window.cwHarness={book:{curveSheets:[],broad:{waiting:false}},owner:'invented-owner',active:true,allow:true,saves:0};const h=cwHarness;h.original=h.book;h.ctx={notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,canExport:()=>h.allow,exposeFacts:(ps,t)=>{if(t.broad.waiting){t.broad.waiting=false;t.broad.pairs=ps}},save:()=>{h.saves++;return{enabled:true,ok:true}},render:()=>h.render()};h.render=()=>{u.prepareCurveDisplay(h.book,h.owner,h.ctx);document.querySelector('main').innerHTML=u.curvePage(h.book,h.owner);u.bindCurveWindow(h.book,h.ctx)};u.openCurveWindow(h.book,h.owner);h.render()}""")
 def dispatch(e):e.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
 try:
  install();p.evaluate('cwHarness.book.broad.waiting=true;cwHarness.allow=false');before=p.evaluate('JSON.stringify(cwHarness.book)');click(p,'page','compare');h.ok(not p.locator('.cw-model-curve,.cw-calculation').count() and p.evaluate('JSON.stringify(cwHarness.book)')==before,'failed helper preserves work before disclosure');p.evaluate('cwHarness.allow=true');click(p,'retry');h.ok(p.locator('.cw-model-curve').count()==1,'retry opens requested reference')
  p.evaluate('cwHarness.book.broad.waiting=true;cwHarness.allow=false;cwHarness.render()');h.ok('Plot your picture' in p.locator('#cw-task').inner_text() and not p.locator('.cw-model-curve').count(),'fresh external pending context falls back before HTML');mark(p,0,1);h.ok(not p.locator(sel('retry')).count(),'new mark cancels older requested reference');p.evaluate('cwHarness.allow=true');click(p,'page','zeroes');click(p,'toggle-model');p.evaluate('cwHarness.book.broad.waiting=true;cwHarness.allow=false');add_band(p,-4,4);h.ok('Mark zero intervals' in p.locator('#cw-task').inner_text() and not p.locator('.cw-model-curve').count(),'failed zero-page requalification keeps new interval and candidate controls');p.evaluate('cwHarness.allow=true');click(p,'keep');h.ok(p.evaluate('cwHarness.book.curveSheets[0].work.bands[0].lo4')==-4,'new interval survives safe fallback and Keep')
  for fault in ['owner','book','inactive','identity','bytes','ancestor','hidden','outer-hidden','route']:
   install();old=p.locator(sel('keep')).element_handle()
   if fault=='owner':p.evaluate('cwHarness.owner="other-owner"')
   elif fault=='book':p.evaluate('cwHarness.book=structuredClone(cwHarness.book)')
   elif fault=='inactive':p.evaluate('cwHarness.active=false')
   elif fault=='identity':p.evaluate('cwHarness.book.curveSheets=[]')
   elif fault=='bytes':p.evaluate('cwHarness.book.curveSheets.push({opaque:true})')
   elif fault=='ancestor':old.evaluate('e=>{const p=e.parentNode,d=document.createElement("div");p.parentNode.append(d);d.append(p)}')
   elif fault=='hidden':old.evaluate('e=>e.hidden=true')
   elif fault=='outer-hidden':p.locator('main').evaluate('e=>e.hidden=true')
   elif fault=='route':p.evaluate('history.replaceState(null,"","#learn/math/other")')
   before=p.evaluate('JSON.stringify([cwHarness.original,cwHarness.book])');dispatch(old);h.ok(p.evaluate('JSON.stringify([cwHarness.original,cwHarness.book])')==before and p.evaluate('cwHarness.saves')==0,'stale '+fault+' cannot Keep');p.locator('main').evaluate('e=>e.hidden=false')
  install();mark(p,0,1);p.locator(sel('keep')).focus();p.evaluate('cwHarness.book.curveSheets.push({opaque:"newer"})');p.keyboard.press('Tab');h.ok(p.locator(sel('reopen')).evaluate('e=>e===document.activeElement'),'first stale Tab focuses recovery');p.keyboard.press('Tab');h.ok(not p.locator(sel('reopen')).evaluate('e=>e===document.activeElement'),'later Tab leaves recovery');click(p,'reopen');click(p,'keep');h.ok(p.evaluate('cwHarness.book.curveSheets[0].opaque')=='newer' and p.evaluate('cwHarness.book.curveSheets[1].work.points[0].y')==1,'recovery preserves new raw sibling and proposed point')
 finally:c.close()
def main():
 class Quiet(http.server.SimpleHTTPRequestHandler):
  protocol_version='HTTP/1.1'
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    report=journey(b,base);transfer(b,base,report);parent_and_cap(b,base);responsive(b,base);isolated(b,base);h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));print(json.dumps({'status':'passed','checks':h.checks}),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
