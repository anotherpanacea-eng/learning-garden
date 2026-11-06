"""Shared Side394 actual-app construction, retained sources and recovery.

Invented records only. Chromium touch/keyboard samples do not qualify physical
hardware or learning. The isolated stale-control probe is explicitly labelled.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SHARED_SIDE_ARTIFACTS') or tempfile.mkdtemp(prefix='shared-side-'));OUT.mkdir(parents=True,exist_ok=True)
_spec=importlib.util.spec_from_file_location('shared_side_helpers',ROOT/'test/four-parts-browser.py');fp=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(fp);h=fp.h;h.OUT=OUT

def setup(browser,base,seed,width=820,height=1000):
 c,p=h.setup(browser,base,seed,width,height);p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-shared-side]').wait_for();return c,p
def tap(p,name,value=None):p.locator('[data-sf-'+name+('="'+str(value)+'"' if value is not None else '')+']').tap()
def enter(p):p.locator('[data-equality-shared-side]').tap();p.locator('[data-sf-root]').wait_for()
def field(p,key,value):
 n=p.locator('[data-sf-value="'+key+'"]');text=n.inner_text()
 if text=='Not chosen':tap(p,'choose',key);text='1'
 step=1 if value>int(text) else -1
 for _ in range(abs(value-int(text))):p.locator('[data-sf-adjust="'+key+'"][data-sf-delta="'+str(step)+'"]').tap()
def fill(p,k,a,b):
 tap(p,'view','build')
 for key,value in [('k',k),('a',a),('b',b)]:field(p,key,value)
def layout(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no document overflow')
 bad=p.locator('[data-sf-root] button,[data-sf-root] select,[data-sf-root] a').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'native targets44px/text16px: '+str(bad))
 h.ok(p.locator('[data-sf-root] button').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()).every(x=>x.scrollWidth<=x.clientWidth+1)'), 'button labels do not overflow their touch targets')
def journey(browser,base,seed):
 print('Shared Side actual construction, coefficient contrast and immutable sheets',flush=True)
 c,p=setup(browser,base,seed)
 try:
  before=copy.deepcopy(h.book(p));enter(p);h.ok(h.book(p)==before,'entry neither allocates sheet nor saves parent work');layout(p)
  h.ok(p.locator('[data-sf-proposal]').inner_text()=='□(□x + □)','initial missing coefficients are not zeros')
  fill(p,3,2,3);tap(p,'view','compare');h.ok('Both coefficients match.' in p.locator('.sf-comparison').inner_text(),'3(2x+3) expands to6x+9');h.ok(not p.locator('.sf-reference').count(),'comparison does not silently reveal greatest-factor reference')
  tap(p,'keep');first=copy.deepcopy(h.book(p)['sharedSides'][0]);h.ok(first['work']['k']==3 and not first['work']['referenceShown'],'kept original proposal has honest support flags')
  tap(p,'view','shelf');tap(p,'sheet',first['id']);tap(p,'view','learn');tap(p,'step');tap(p,'step');tap(p,'step');tap(p,'contrasts');tap(p,'reference');h.ok(h.book(p)['sharedSides'][0]==first,'help on a kept sheet preserves its original source/work')
  tap(p,'copy');tap(p,'view','build');field(p,'b',4);tap(p,'keep');last=h.book(p)['sharedSides'][-1];h.ok(last['source']==first['source'] and last['work']['b']==4 and last['work']['teachingShown'] and last['work']['referenceShown'],'copy keeps own source and elected support in a new sheet')
  h.ok(h.book(p)['sharedSides'][0]==first,'new copy cannot overwrite original')
  p.locator('[data-sf-case]').select_option('small');fill(p,3,1,2);tap(p,'x-one');tap(p,'view','compare');text=p.locator('.sf-comparison').inner_text();h.ok('These coefficient pairs differ.' in text and 'The numerical areas match' in text,'single-value coincidence is not an identity')
  tap(p,'view','build');p.locator('[data-sf-x]').select_option('2');tap(p,'view','compare');h.ok('The numerical areas differ' in p.locator('.sf-comparison').inner_text(),'same expressions separate at a new x')
  for job,k,a,b in [('notices',2,6,4),('covers',3,3,4),('coprime',1,7,4),('posters',5,2,3)]:
   p.locator('[data-sf-case]').select_option(job);fill(p,k,a,b);tap(p,'view','compare');h.ok('Both coefficients match.' in p.locator('.sf-comparison').inner_text(),'valid identity for '+job);tap(p,'reference')
   if job=='notices':h.ok('a greater positive integer common factor also exists' in p.locator('.sf-reference').inner_text(),'smaller valid common factor is accepted')
   if job=='coprime':h.ok('Only 1 is' in p.locator('.sf-reference').inner_text(),'coprime reference is explicit')
  h.ok(h.book(p)['equalityDesk']==before['equalityDesk'] and h.book(p)['syntheticOther']==before['syntheticOther'],'parent and unknown sibling remain exact')
  tap(p,'view','build');layout(p);p.screenshot(path=str(OUT/'shared-side-tablet.png'),full_page=True)
  report=h.export_notes(p,'shared-side-notes');h.ok(report['sharedSides']==h.book(p)['sharedSides'],'actual Notes contains exact source-owned sheets');return report
 finally:c.close()
def transfer(browser,base,seed,report):
 print('Shared Side actual Notes import and changed-source copy',flush=True)
 c,p=setup(browser,base,seed)
 try:
  altered=copy.deepcopy(report);old=altered['sharedSides'][0];old['source']['id']='earlier-source';old['source']['title']='Earlier <panel> & exact words';old['source']['A']=5;old['source']['B']=10;old['source']['futureSource']={'held':True};old['work']['futureWork']={'held':True}
  altered['sharedSides'] += [{'id':'shared-side-900','future':True},{'id':'shared-side-901','future':True},{'id':'shared-side-901','other':True}]
  p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-shared-sides.json','mimeType':'application/json','buffer':json.dumps(altered).encode()});p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
  p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-shared-side]').wait_for();enter(p);tap(p,'view','shelf');h.ok('This earlier sheet is retained' in p.locator('[data-sf-root]').inner_text(),'unreadable and duplicate siblings do not block readable sheets')
  tap(p,'sheet',old['id']);h.ok(p.locator('.sf-summary h2').inner_text()==old['source']['title'],'retained title is escaped literal own text');tap(p,'copy');field(p,'a',1);tap(p,'keep');new=h.book(p)['sharedSides'][-1]
  h.ok(new['id']=='shared-side-902' and new['source']==old['source'] and new['work']['futureWork']==old['work']['futureWork'],'new copy reserves unreadable ids and preserves unknown source/work fields')
  h.ok(h.book(p)['sharedSides'][:-1]==altered['sharedSides'],'imported outcomes/unknown siblings remain exact')
 finally:c.close()
def responsive(browser,base,seed):
 print('Shared Side phone geometry and native keyboard controls',flush=True)
 c,p=setup(browser,base,seed,320,820)
 try:
  enter(p);p.locator('[data-sf-case]').select_option('coprime');fill(p,1,7,4);layout(p);h.ok(p.locator('[data-sf-thin]').is_visible(),'1by32 thin model has outside warning');p.locator('[data-sf-x]').select_option('12');h.ok(p.locator('[data-sf-thin]').is_visible(),'1by88 thin model remains honest');field(p,'a',24);field(p,'b',24);h.ok('312 cm' in p.locator('.sf-picture figcaption').inner_text(),'extreme thin rectangle retains true dimensions');h.ok(p.locator('[data-sf-rectangle] rect[fill="none"]').evaluate('n=>{const r=n.getBoundingClientRect();return Math.abs(r.width/r.height-312)<.01;}'),'rendered model preserves equal axis scales and actual312to1 ratio');layout(p)
  n=p.locator('[data-sf-adjust="k"][data-sf-delta="1"]');n.focus();p.keyboard.press('Enter');p.keyboard.press('Enter');h.ok(p.locator('[data-sf-value="k"]').inner_text()=='3','repeated keyboard steps retain focus and direction')
  old=n.element_handle();field(p,'b',23);before=copy.deepcopy(h.book(p));old.evaluate('n=>n.dispatchEvent(new MouseEvent("click",{bubbles:true}))');h.ok(h.book(p)==before and p.locator('[data-sf-value="k"]').inner_text()=='3','detached old control cannot change work')
  hidden=p.locator('[data-sf-adjust="k"][data-sf-delta="1"]');hidden.evaluate('n=>{n.style.display="none";n.dispatchEvent(new MouseEvent("click",{bubbles:true}));}');h.ok(p.locator('[data-sf-value="k"]').inner_text()=='3','hidden control cannot edit');p.screenshot(path=str(OUT/'shared-side-phone.png'),full_page=True)
 finally:c.close()
def landscape(browser,base,seed):
 c,p=setup(browser,base,seed,1024,768)
 try:
  h.ok(p.locator('.equality-explorations button').count()==7,'parent chooser retains seven distinct optional entries');h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'parent chooser fits landscape width');enter(p);layout(p)
 finally:c.close()

def parent_dirty(browser,base,seed):
 print('Shared Side protects parent writing after a browser-delivered overlong input event',flush=True)
 c,p=setup(browser,base,seed)
 try:
  n=p.locator('[data-equality-field="note"]');n.fill('Accepted invented words.');n.evaluate("n=>{n.value='x'.repeat(1201);n.dispatchEvent(new Event('input',{bubbles:true}));}");h.ok(n.get_attribute('aria-invalid')=='true','overlong input event is actually rejected by the parent');before=copy.deepcopy(h.book(p));p.locator('[data-equality-shared-side]').tap();h.ok(not p.locator('[data-sf-root]').count() and n.input_value()=='x'*1201 and h.book(p)==before,'entry refuses without redrawing rejected prose or saving parent')
 finally:c.close()
def refusal(browser,base,seed):
 print('Shared Side real whole-book boundary and Notes rescue',flush=True)
 bounded=copy.deepcopy(seed)
 def nodes(x):return 1+sum(nodes(v) for v in (x.values() if isinstance(x,dict) else x if isinstance(x,list) else []))
 bounded['syntheticNodeBoundary']=[];bounded['syntheticNodeBoundary']=[None]*(200000-nodes(bounded)-1)
 c,p=setup(browser,base,bounded)
 try:
  before=copy.deepcopy(h.book(p));enter(p);tap(p,'choose','k');tap(p,'keep');h.ok(h.book(p)==before and 'could not be kept' in p.locator('#sf-status').inner_text(),'real cap refuses incomplete Keep atomically');h.ok(p.locator('[data-sf-value="k"]').inner_text()=='1','refused proposal remains available');tap(p,'download')
 finally:c.close()
def saving_off(browser,base,seed):
 print('Shared Side actual session-only save and file recovery',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').tap();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').tap();p.evaluate('location.hash="#learn/math/equality"');p.locator('[data-equality-shared-side]').wait_for()
  before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');enter(p);tap(p,'choose','k');tap(p,'keep');h.ok('Saving is off' in p.locator('#sf-status').inner_text(),'session-only Keep never promises durable persistence')
  h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'session-only edits do not recreate stored notebooks');report=h.export_notes(p,'shared-side-session');h.ok(report['sharedSides'][0]['work']['k']==1,'real Notes download recovers session-only sheet')
 finally:c.close()

def exposure(browser,base,seed):
 print('Shared Side isolated live-object capture: real helper, real Notes cap and pre-DOM exposure',flush=True)
 c,p=setup(browser,base,seed)
 try:
  def capture(route):
   response=route.fetch();body=response.text();needle='export function bindSharedSide(book,ctx){';assert needle in body
   # Only capture the actual objects; no predicate, helper or gate is replaced.
   route.fulfill(response=response,body=body.replace(needle,needle+'window.sfHarness={book,ctx};',1))
  c.route('**/shared-side-ui.mjs',capture);p.reload(wait_until='networkidle')
  if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').tap()
  p.locator('[data-equality-shared-side]').wait_for();enter(p);fill(p,3,2,3)
  p.evaluate("""()=>{const s=sfHarness.book;s.broad.drafts.newWaiting={question:{fact:[3,3]},attempts:[]};window.sfPremature=false;new MutationObserver(()=>{if(document.querySelector('[data-sf-computed]')&&!s.broad.drafts.newWaiting.knownFact)sfPremature=true;}).observe(document.querySelector('main'),{childList:true,subtree:true});sfHarness.ctx.render();}""")
  h.ok(p.evaluate('sfHarness.book.broad.drafts.newWaiting.knownFact===true && sfHarness.book.broad.drafts.newWaiting.attempts.length===0 && !sfPremature'),'return render qualifies newly waiting fact before computed DOM without attempts')
  fill(p,4,0,6)
  p.evaluate("""async()=>{const s=sfHarness.book;const {checkin}=await import('./content.mjs');const q=checkin.find(q=>q.fact?.[0]===4&&q.fact[1]===6);if(!q)throw Error('Missing authored baseline fixture');s.baseline.draft={questionId:q.id,raw:'held'};const {startPostOffice}=await import('./post-office-core.mjs'),{deliveries}=await import('./post-office-content.mjs'),{startAdaptiveRival,generateRivalTask}=await import('./post-rival.mjs');const v=startPostOffice(s,deliveries[0].id);startAdaptiveRival(s);v.rival.task=generateRivalTask('multiply',4,6,0);sfHarness.ctx.render();}""")
  h.ok(p.evaluate('sfHarness.book.baseline.draft.exposed===true && sfHarness.book.baseline.observations.length===0 && sfHarness.book.postOffice.visits.at(-1).rival.priorFactShown===true'),'actual app callback qualifies waiting baseline and Bramble without attempts')
  pair=p.evaluate("""async()=>{const {storyNodes}=await import('./story-content.mjs');const n=Object.values(storyNodes).find(n=>n.facts?.length&&n.facts[0].every(v=>Number.isInteger(v)&&v>=1&&v<=12));window.sfGardenNode=n;return n.facts[0];}""");fill(p,pair[0],0,pair[1])
  p.evaluate("""()=>{const s=sfHarness.book,n=sfGardenNode;s.garden.visits.push({id:'invented-garden-return',entrance:n.entrance,drafts:{[n.id]:{attempts:[],raw:'held'}}});sfHarness.ctx.render();}""")
  h.ok(p.evaluate('sfHarness.book.garden.visits.at(-1).drafts[sfGardenNode.id].knownFact===true && sfHarness.book.garden.visits.at(-1).drafts[sfGardenNode.id].attempts.length===0'),'fresh render qualifies waiting Garden arithmetic without inventing attempts')
  fill(p,3,2,3)
  p.evaluate("""()=>{const s=sfHarness.book;s.broad.drafts.refusedWaiting={question:{fact:[3,3]},attempts:[]};const nodes=x=>1+(x&&typeof x==='object'?Object.values(x).reduce((a,v)=>a+nodes(v),0):0);s.syntheticNodeBoundary=[];s.syntheticNodeBoundary=Array(200000-nodes(s)-1).fill(null);}""")
  before=p.evaluate('JSON.stringify(sfHarness.book)');tap(p,'view','compare');h.ok(p.locator('[data-sf-blocked]').is_visible() and not p.locator('[data-sf-computed]').count() and not p.locator('[data-sf-rectangle]').count(),'actual Notes limit suppresses unqualified computed HTML/SVG')
  h.ok(p.evaluate('JSON.stringify(sfHarness.book)')==before and p.locator('[data-sf-proposal]').inner_text()=='3(2x + 3)','refused display preserves notebook and requested proposal')
  tap(p,'retry');h.ok(p.evaluate('JSON.stringify(sfHarness.book)')==before,'retry while still full stays atomic')
  p.evaluate('delete sfHarness.book.syntheticNodeBoundary');tap(p,'retry');h.ok(p.locator('.sf-comparison').count()==1 and p.evaluate('sfHarness.book.broad.drafts.refusedWaiting.knownFact===true'),'retry after making room adopts same requested comparison')
 finally:c.close()

def main():
 seed=fp.fixture()
 class Quiet(http.server.SimpleHTTPRequestHandler):
  protocol_version='HTTP/1.1'
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    report=journey(browser,base,seed);transfer(browser,base,seed,report);responsive(browser,base,seed);landscape(browser,base,seed);parent_dirty(browser,base,seed);refusal(browser,base,seed);exposure(browser,base,seed);saving_off(browser,base,seed);h.ok(not h.errors,'no browser errors: '+str(h.errors))
   finally:browser.close()
 finally:server.shutdown()
 print(json.dumps({'status':'passed','checks':h.checks}),flush=True)
if __name__=='__main__':main()
