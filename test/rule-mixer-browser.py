"""Rule Mixer actual-app synthetic journeys; controlled refusal context is labelled.
Chromium emulation does not qualify physical iPad/Safari/audio/VoiceOver or learning.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('MIXER_ARTIFACTS') or tempfile.mkdtemp(prefix='rule-mixer-'));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('curve_helpers',ROOT/'test/curve-window-browser.py');cg=importlib.util.module_from_spec(spec);spec.loader.exec_module(cg);h=cg.h;h.OUT=OUT
S=lambda name,value=None:'[data-rm-'+name+('="'+str(value)+'"' if value is not None else '')+']'
def tap(p,name,value=None):
 if name=='blank':
  d=p.locator('[data-rm-fold="drafts"]')
  if d.get_attribute('open') is None:d.locator('summary').tap()
 p.locator(S(name,value)+':visible').first.tap()
def enter(p):p.locator('[data-equality-mixer]').tap();p.locator(S('root')).wait_for()
def choose(p,id):
 d=p.locator('[data-rm-fold="drafts"]')
 if d.get_attribute('open') is None:d.locator('summary').tap()
 p.locator(S('case')).select_option(id)
def rows(p):return h.book(p).get('ruleMixerSheets',[])
def pair(p,xn,xd,yn,yd):
 for k,v in [('xn',xn),('xd',xd),('yn',yn),('yd',yd)]:p.locator(S('cursor',k)).select_option(str(v))
 tap(p,'use-pair')
def geometry(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no page overflow')
 bad=p.locator('[data-rm-root] button,[data-rm-root] select,[data-rm-root] summary,[data-rm-root] a').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)');h.ok(not bad,'44px targets and 16px controls: '+str(bad))
def journey(browser,base):
 print('Rule Mixer actual-app construction, reference, literal versions and pending context',flush=True)
 seed=cg.fixture('const v=startPostOffice(s,deliveries[0].id);startAdaptiveRival(s);v.rival.task=generateRivalTask("multiply",3,3,0);')
 c,p=cg.setup(browser,base,seed,observe=True)
 try:
  before=copy.deepcopy(h.book(p));enter(p);geometry(p);h.ok(h.book(p)==before and not p.locator('.rm-mixture,.rm-check,.rm-reference').count(),'entry is local and computed layers absent')
  tap(p,'preview');h.ok('x minus y equals 1' in p.locator('[data-rm-read]').get_attribute('data-speak'),'narration distinguishes subtraction from a negative sign');h.ok('2x = 8' in p.locator('.rm-mixture').inner_text(),'adding opposed y coefficients gives2x8')
  p.locator(S('factor',0)).select_option('0');h.ok('Row A contributes no information' in p.locator('.rm-mixture').inner_text() and p.locator('.rm-mixture .rm-equation').inner_text()!='0 = 0','exactly one zero factor leaves a nondegenerate scaled original');p.locator(S('factor',1)).select_option('0');h.ok('does not tell us' in p.locator('.rm-mixture').inner_text(),'two zero factors do not classify originals')
  choose(p,'repeated');p.locator(S('factor',0)).select_option('2');p.locator(S('op')).select_option('subtract');tap(p,'preview');h.ok('whole line of shared pairs' in p.locator('.rm-mixture').inner_text(),'nonzero tautology proves proportional originals')
  choose(p,'thirds');tap(p,'page','pair');pair(p,8,6,4,3);h.ok(p.locator(S('cursor','xn')).input_value()=='4' and p.locator(S('cursor','xd')).input_value()=='3','Use pair reduces selected fractions');tap(p,'check');h.ok('Fits both originals' in p.locator('.rm-check').inner_text(),'exact4/3 pair fits both originals');pair(p,0,1,0,1);h.ok('Fits B only' in p.locator('.rm-check').inner_text(),'unexpected pair is retained with truthful supported feedback')
  tap(p,'page','explain');p.locator(S('note')).fill('My invented explanation keeps the originals.');tap(p,'reference');h.ok('4/3' in p.locator('.rm-reference').inner_text(),'worked route gives exact fractional pair');h.ok('0, 0' not in p.locator('.rm-reference').inner_text(),'reference does not borrow learner pair');tap(p,'keep');first=copy.deepcopy(rows(p)[0]);h.ok(first['work']['pair']=={'x':{'n':0,'d':1},'y':{'n':0,'d':1}} and first['work']['note'].startswith('My invented'),'Keep preserves unexpected pair and own writing');h.ok(not p.locator('.rm-reference').count(),'kept sheet starts with computed layers closed')
  tap(p,'page','explain');tap(p,'reference');h.ok(rows(p)[0]==first and p.locator('.rm-reference').count()==1,'recorded reference replays without changing kept work');tap(p,'help');p.locator(S('confirm-copy')).wait_for();h.ok(rows(p)[0]==first,'new support offers an explicit copy');tap(p,'confirm-copy');h.ok('1 of 6' in p.locator('#rm-task').inner_text(),'confirmed help opens on a fresh literal copy')
  for i in range(6):
   h.ok(f'{i+1} of 6' in p.locator('#rm-task').inner_text(),'teaching page uses its own source')
   if i==2:h.ok('does not tell us' in p.locator('.rm-example').inner_text(),'teaching zero factors retain loss distinction')
   if i==4:h.ok('whole line' in p.locator('.rm-example').inner_text(),'teaching nonzero proportionality is distinct')
   if i<5:tap(p,'teach',1)
  tap(p,'close-help');tap(p,'keep');h.ok(rows(p)[0]==first and rows(p)[-1]['work']['teachingShown'],'only new version records new teaching request')
  tap(p,'copy');choose(p,'scale');p.locator(S('factor',1)).select_option('3');tap(p,'preview');h.ok(p.evaluate('window.__curveObservedState().postOffice.visits[0].rival.priorFactShown')==True,'actual callback qualifies waiting3x3 without an answer')
  p.evaluate('location.hash="#post"');p.locator(S('root')).wait_for(state='detached');p.evaluate("""async()=>{const m=await import('./post-rival.mjs'),s=window.__curveObservedState(),v=s.postOffice.visits.find(v=>v.id===s.postOffice.current);v.rival.task=m.generateRivalTask('multiply',3,3,1);delete v.rival.priorFactShown;}""");h.ok(p.evaluate('Object.hasOwn(window.__curveObservedState().postOffice.visits[0].rival,"priorFactShown")')==False,'new waiting task begins unqualified');p.evaluate('location.hash="#learn/math/equality"');p.locator('.rm-mixture').wait_for();h.ok(p.evaluate('window.__curveObservedState().postOffice.visits[0].rival.priorFactShown')==True,'actual return freshly qualifies new pending context');h.ok(h.book(p)['postOffice']['visits'][0]['rival']['attempts']==[],'qualification leaves attempts empty')
  p.screenshot(path=str(OUT/'tablet.png'),full_page=True);tap(p,'page','explain');note=p.locator(S('note'));note.fill('q'*1501);h.ok(note.input_value()=='q'*1501 and note.get_attribute('aria-invalid')=='true','overlong visible writing remains recoverable');p.locator('#explorer-switch').click();h.ok(p.locator(S('note')).input_value()=='q'*1501,'header explorer switch cannot discard rejected words');p.go_back();p.wait_for_function('location.hash==="#learn/math/equality"');h.ok(p.locator(S('note')).input_value()=='q'*1501,'actual browser Back cannot replace rejected writing');p.evaluate('location.hash="#home"');p.wait_for_function('location.hash==="#learn/math/equality"');h.ok(p.locator(S('note')).input_value()=='q'*1501,'hash navigation restores route without replacement')
  with p.expect_download() as d:tap(p,'download')
  h.ok(json.loads(Path(d.value.path()).read_text())['ruleMixerSheets']==rows(p),'in-place actual Notes downloads without rejected words or navigation');h.ok(p.locator(S('note')).input_value()=='q'*1501,'download preserves rejected DOM')
  p.locator(S('note')).fill('Shortened invented words.');h.ok(p.locator(S('note')).get_attribute('aria-invalid') is None and p.locator('.rm-pending').is_hidden() and 'Shorten the marked field' not in p.locator('#rm-status').inner_text(),'shortening rejected text clears both field and warning without redraw');p.locator(S('note')).fill('z'*1501);p.once('dialog',lambda d:d.accept());tap(p,'restore');h.ok(p.locator(S('note')).input_value()=='Shortened invented words.','explicit Restore returns last accepted draft note');p.locator(S('note')).fill('An invented shorter explanation.');tap(p,'keep');report=h.export_notes(p,'rule-mixer-keeps');h.ok(report['ruleMixerSheets']==rows(p),'actual Notes includes exact frozen source/work');p.evaluate('location.hash="#learn/math/equality"');p.locator(S('root')).wait_for();tap(p,'back');h.ok(h.book(p)['syntheticSibling']==before['syntheticSibling'],'parent return preserves unknown sibling');return report
 finally:c.close()
def transfer(browser,base,report):
 print('Rule Mixer actual historical source, unknown example, raw siblings and reload',flush=True)
 report=copy.deepcopy(report);old=report['ruleMixerSheets'][0];old['source'].update({'id':'past-rules','title':'Earlier <literal> & rows'});old['source']['rows']=[{'label':'Earlier A','a':0,'b':2,'c':3},{'label':'Earlier B','a':3,'b':0,'c':2}];old['source']['teaching'][0]['example']={'future':True};old['work']['previewShown']=False;old['work']['checkShown']=True;old['work']['pair']=None
 report['ruleMixerSheets']=[{'id':'rule-mix-900','future':True},old,None,{'id':'rule-mix-777','future':True},{'id':'rule-mix-777','future':True}]
 c,p=cg.setup(browser,base,cg.fixture())
 try:
  p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-rule-mixer.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-mixer]').wait_for();enter(p);tap(p,'shelf');tap(p,'card',old['id']);h.ok(p.locator('.rm-title').text_content()=='Earlier <literal> & rows','historical source is literal and escaped');tap(p,'page','pair');tap(p,'check');h.ok('Choose a pair first' in p.locator('#rm-status').inner_text() and not p.locator(S('confirm-copy')).count(),'historical checkShown with null pair remains readable without help copy');tap(p,'copy');tap(p,'help');h.ok('picture cannot be drawn' in p.locator('main').inner_text(),'unknown teaching example is local fallback');tap(p,'close-help');tap(p,'page','explain');tap(p,'reference');h.ok('2/3' in p.locator('.rm-reference').inner_text() and '3/2' in p.locator('.rm-reference').inner_text(),'axis-only imported source resolves itself');tap(p,'keep');h.ok(rows(p)[-1]['id']=='rule-mix-901' and rows(p)[:-1]==report['ruleMixerSheets'],'future suffix allocation and duplicate raw siblings preserved');expected=copy.deepcopy(rows(p));p.reload(wait_until='networkidle');cg.ready(p);h.ok(rows(p)==expected,'reload keeps exact own source/work')
 finally:c.close()
def refusal(browser,base):
 print('Rule Mixer separately labelled actual-app export-refusal seam',flush=True)
 c,p=cg.setup(browser,base,cg.fixture())
 try:
  def intercept(route):
   r=route.fetch();s=r.text();needle='const options={save,render,focus:focusElement,canExport:priceOptions().canExport';assert needle in s;route.fulfill(response=r,body=s.replace(needle,'const options={save,render,focus:focusElement,canExport:candidate=>!window.rmReject&&priceOptions().canExport(candidate)',1))
  c.route('**/app.mjs',intercept);p.reload(wait_until='networkidle');cg.ready(p);enter(p);before=copy.deepcopy(h.book(p));p.evaluate('window.rmReject=true');tap(p,'preview');h.ok(not p.locator('.rm-mixture').count() and h.book(p)==before,'refused reference has no DOM or notebook result');h.ok('could not be shown safely' in p.locator('#rm-status').inner_text(),'refusal is explicit');p.evaluate('window.rmReject=false');p.locator('[data-rm-inline-retry]').tap();p.locator('.rm-mixture').wait_for();h.ok('2x = 8' in p.locator('.rm-mixture').inner_text(),'explicit Retry recovers requested calculation');choose(p,'scale');tap(p,'preview');p.evaluate('window.rmReject=true');before=copy.deepcopy(h.book(p));speech_before=p.locator('[data-rm-read]').get_attribute('data-speak');p.locator(S('factor',1)).select_option('3');h.ok(p.locator(S('factor',1)).input_value()=='1' and '3) × (3' not in p.locator('.rm-mixture').inner_text() and h.book(p)==before,'refused factor restores earlier control, DOM and notebook');h.ok(p.locator('[data-rm-read]').get_attribute('data-speak')==speech_before,'refused factor leaves the entire narration unchanged');p.evaluate('window.rmReject=false');p.locator('[data-rm-inline-retry]').tap();h.ok(p.locator(S('factor',1)).input_value()=='3','factor retry adopts retained intended input');h.ok('3 times 3' in p.locator('[data-rm-read]').get_attribute('data-speak'),'positive control: retried product is present in narration')
 finally:c.close()
def preservation(browser,base):
 print('Rule Mixer actual parent, capacity, explorer, stale, reset and save-off paths',flush=True)
 extra='const o={canExport:()=>true};startEquality(s,"twins",o);pageEquality(s,3,o);editEquality(s,"note","Earlier invented explanation.",o);'
 cap="s.padding='';const app=readFileSync('./dist/app.mjs','utf8'),decl=app.match(/^function notesReport\\(notebook\\)\\{.*\\}$/m)[0],report=Function('recommendations','explorerStore',decl+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});s.padding='x'.repeat(5*1024*1024-new TextEncoder().encode(JSON.stringify(report(s),null,2)).length-20);"
 c,p=cg.setup(browser,base,cg.fixture(extra+cap))
 try:
  before=copy.deepcopy(h.book(p));old=p.locator('[data-equality-field="note"]').element_handle();p.locator('[data-equality-field="note"]').fill('Rejected invented text '+('x'*1000));p.locator('[data-equality-mixer]').click();h.ok(not p.locator(S('root')).count() and old.evaluate('e=>e===document.querySelector("[data-equality-field=note]")'),'actual rejected parent note blocks child entry without DOM loss');h.ok(h.book(p)==before,'blocked child entry preserves actual notebook')
 finally:c.close()
 c,p=cg.setup(browser,base,cg.fixture(cap))
 try:
  before=copy.deepcopy(h.book(p));enter(p);tap(p,'preview');h.ok(not p.locator('.rm-mixture').count() and h.book(p)==before,'actual pretty Notes capacity refuses computed UI and leaves book exact');tap(p,'keep');h.ok('could not be kept safely' in p.locator('#rm-status').inner_text() and h.book(p)==before,'actual Keep capacity refuses without mutation')
 finally:c.close()
 c,p=cg.setup(browser,base,cg.fixture(),observe=True)
 try:
  enter(p);p.locator(S('factor',0)).select_option('2');h.ok(p.locator(S('factor',0)).evaluate('e=>e===document.activeElement'),'factor redraw retains initiating select focus');old=p.locator(S('back')).element_handle();p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.locator('[data-equality-mixer]').wait_for();enter(p);p.locator(S('factor',0)).select_option('-1');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-1"]').click();p.locator(S('root')).wait_for();h.ok(p.locator(S('factor',0)).input_value()=='2','real explorer return retains owner draft');old.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok(p.locator(S('root')).count()==1,'old owner bound root cannot navigate after return')
  old=p.locator(S('keep')).element_handle();p.evaluate('window.__curveObservedState().ruleMixerSheets=[{id:"rule-mix-70",future:true}]');old.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok(p.locator(S('reopen')).is_visible() and p.evaluate('window.__curveObservedState().ruleMixerSheets.length')==1,'raw root change refuses stale Keep and offers view-only Reopen');tap(p,'reopen');h.ok('Earlier sheet 1' in p.locator(S('root')).inner_text(),'Reopen retains unfamiliar raw row on shelf');old.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok(p.evaluate('window.__curveObservedState().ruleMixerSheets.length')==1,'detached stale Keep remains inert')
  tap(p,'back');h.ok(p.locator('[data-equality-mixer]').evaluate('e=>e===document.activeElement'),'Back focuses the Rule Mixer entry');enter(p);h.ok('Kept sheets' in p.locator('#rm-task').inner_text(),'leaving and returning preserves shelf rather than creating a draft');tap(p,'blank');p.locator(S('factor',0)).select_option('3');old=p.locator(S('keep')).element_handle();tap(p,'keep');p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click();p.locator('[data-film-skip]').click();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-mixer]').wait_for();enter(p);old.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok('ruleMixerSheets' not in h.book(p),'actual reset and old Keep cannot resurrect prior sheets');h.ok(p.locator('[data-rm-draft] option').count()==1 and p.locator(S('factor',0)).input_value()=='1' and p.locator(S('factor',1)).input_value()=='1','reset starts one default draft instead of resuming pre-reset factors')
 finally:c.close()
 c,p=cg.setup(browser,base,cg.fixture())
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-mixer]').wait_for();before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');enter(p);tap(p,'keep');h.ok('saving is off' in p.locator('#rm-status').inner_text(),'actual save-off result is truthful');h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'save-off leaves persisted bytes unchanged');report=h.export_notes(p,'rule-mixer-session');h.ok(len(report['ruleMixerSheets'])==1,'actual Notes recovers session-only sheet')
 finally:c.close()
def responsive(browser,base):
 for width in [320,1024]:
  c,p=cg.setup(browser,base,cg.fixture(),width=width,height=900)
  try:
   enter(p);tap(p,'preview');geometry(p);h.ok(p.locator('.rm-scroll').evaluate('n=>getComputedStyle(n).overflowX==="auto"&&n.getAttribute("role")==="region"&&n.getAttribute("tabindex")==="0"'),'equation instrument has its own scroll region');tap(p,'page','pair');geometry(p);p.screenshot(path=str(OUT/f'sample-{width}.png'),full_page=True)
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
    report=journey(b,base);transfer(b,base,report);refusal(b,base);preservation(b,base);responsive(b,base);h.ok(not h.errors,'no console/page/HTTP errors: '+str(h.errors));print(json.dumps({'status':'passed','checks':h.checks}),flush=True)
   except Exception:(OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
