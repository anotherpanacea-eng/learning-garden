"""Square Pens396 actual-app journey plus labelled live-object fault probes.
All notebooks invented. The ordinary journey uses unchanged production modules.
Only the separate arithmetic probe captures objects/observes the DOM insertion
sink; it never replaces a qualification predicate or forces a false result.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading,copy
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SQUARE_PENS_ARTIFACTS',tempfile.mkdtemp(prefix='square-pens-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0

def ok(v,message):
 global checks
 assert v,message
 checks+=1

def action(p,name):p.locator('[data-sp-action="'+name+'"]').first.click()
def dimensions(p):return [int(x.split()[0]) for x in p.locator('.sp-dimensions output').all_text_contents()]
def set_dimensions(p,a,b):
 for key,value,index in [('a',a,0),('b',b,1)]:
  now=dimensions(p)[index]
  for _ in range(abs(value-now)):action(p,key+('-more' if value>now else '-less'))
 ok(dimensions(p)==[a,b],'native controls choose requested material')
def book(p):return p.evaluate('()=>{const id=JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId;return JSON.parse(localStorage.getItem("number-garden-v1:"+id));}')
def unrelated(s):return {k:v for k,v in s.items() if k not in ['broad','garden','baseline','postOffice','exposures']}
def parent(p):return p.locator('[data-cframe-root]').evaluate('r=>({view:r.dataset.cframeView,choice:r.querySelector("select").value,refs:[...r.querySelectorAll(".cframe-refs")].map(x=>x.textContent),captions:[...r.querySelectorAll("figcaption")].map(x=>x.textContent)})')
def ready_parent(p):
 p.locator('[data-square-pens-entry],[data-select-explorer]').first.wait_for()
 active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
 choice=p.locator('[data-select-explorer="'+active+'"]')
 if choice.count():choice.click()
 p.locator('[data-square-pens-entry]').wait_for()

def enter(p):p.locator('[data-square-pens-entry]').click();p.locator('[data-square-pens-root]').wait_for()
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('[data-square-pens-root] button,[data-square-pens-root] a').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 ok(not bad,'touch target44px/text16px: '+str(bad))

def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from './dist/core.mjs';import{initializeExplorerState}from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={body:'z'.repeat(524288),opaque:'invented'};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright()as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
   contexts=[];errors=[]
   def setup(width=820,height=1100,harness=False):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True);contexts.append(c)
    registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-06T12:00:00.000Z'},{'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-11-06T12:00:00.000Z'}]}
    c.add_init_script('(d=>{if(!localStorage.getItem("square-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem("number-garden-v1:"+e.id,JSON.stringify(d.seed));localStorage.setItem("square-fixture","1");}})('+json.dumps({'registry':registry,'seed':seed})+')')
    if harness:
     def capture(route):
      response=route.fetch();s=response.text();needle='export function bindSquarePens(book,ctx){';assert needle in s
      route.fulfill(response=response,body=s.replace(needle,needle+'window.squareHarness={book,ctx};',1))
     c.route('**/square-pens-ui.mjs',capture)
     def trace(route):
      response=route.fetch();s=response.text();a=s.index("  if(hash==='#workshop/copy-frame'){");b=s.index("  if(hash==='#post/lost-and-found'){",a);part=s[a:b]
      needle='canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok';assert needle in part
      wrapper='canExport:candidate=>{window.squareReportCalls=(window.squareReportCalls||0)+1;const result=prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok;window.squareReportResult=result;return result;}'
      route.fulfill(response=response,body=s[:a]+part.replace(needle,wrapper)+s[b:])
     c.route('**/app.mjs',trace)
    p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)))
    p.goto(base+'#workshop/copy-frame',wait_until='networkidle');p.locator('#explorer-header').wait_for()
    if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').click()
    p.locator('[data-cframe-root]').wait_for();return c,p
   c,p=setup()
   p.locator('[data-cframe-action=width-more]').click();p.locator('[data-cframe-action=height-more]').click();p.locator('[data-cframe-action=tiles]').click();p.locator('[data-cframe-action=example]').click();p.locator('[data-cframe-action=next]').click();p.locator('[data-cframe-action=next]').click()
   saved_parent=parent(p);before=book(p);enter(p);layout(p)
   ok(not p.locator('[data-cframe-root]').count(),'active child has no parent computations behind it')
   ok(dimensions(p)==[3,4],'first own material starts with3/4')
   action(p,'side-a');ok('touches the square corner' in p.locator('.sp-page').inner_text(),'leg choice supports rather than gates')
   action(p,'side-c');ok('hypotenuse' in p.locator('.sp-page').inner_text(),'opposite side is identified without blocking play')
   set_dimensions(p,2,3)
   for move in range(1,4):
    if move==1:p.locator('[data-sp-action=move]').focus()
    p.keyboard.press('Enter')
    ok(p.locator('[data-sp-piece]').count()==4,'every own layout retains four pieces')
    if move<3:ok(p.locator('[data-sp-empty-label]').count()==0,'intermediate gaps have no square-area labels')
   labels=p.locator('[data-sp-empty-label]').all_text_contents();ok(sorted(labels)==['a²','b²'],'completed own plan names both empty squares: '+str(labels)+'; focus='+str(p.evaluate('document.activeElement.dataset.spAction')))
   ok(p.evaluate('!document.activeElement.disabled'),'keyboard focus lands on live action at move boundary')
   action(p,'turn')
   drawn=p.locator('[data-sp-piece="T1"]').evaluate('n=>[...n.points].map(p=>[(p.x-30)/60,(p.y-30)/60])')
   ok(all(abs(x-y)<.001 for pair,expected in zip(drawn,[[5,2],[5,5],[3,5]]) for x,y in zip(pair,expected)),'actual drawn piece coordinates rotate with the model')
   action(p,'length');ok('√13 units' in p.locator('[data-sp-length]').inner_text(),'nonwhole side is exact root with length units')
   action(p,'compare');ok(p.locator('.sp-compare [data-sp-piece]').count()==8,'finished endpoints show same four pieces twice')
   action(p,'compare-close');action(p,'move-back');ok(not p.locator('[data-sp-empty-label]').count(),'elected length does not label intermediate gaps as squares')
   action(p,'page-why');ok(not p.locator('.sp-dimensions').count() and 'a=2, b=3' in p.locator('.sp-waiting').inner_text(),'reference pages retain readonly own material')
   ok('5 × 5 = 25' not in p.locator('.sp-page').inner_text(),'unselected teaching answers are not hidden in the DOM')
   for step in range(6):action(p,'why-'+str(step))
   ok('5 × 5 = 25' in p.locator('.sp-page').inner_text(),'selected final reference explains area versus length')
   action(p,'page-corner');ok('6 × 6 = 36' in p.locator('.sp-page').inner_text() and 'between the 3 and 4' in p.locator('.sp-page').inner_text(),'non-right contrast names the actual obtuse corner')
   action(p,'build');ok(dimensions(p)==[2,3] and p.locator('[data-sp-length]').count()==1,'reference return restores exact own input/disclosure')
   p.screenshot(path=str(OUT/'square-pens-820.png'),full_page=True)
   for pair in [[5,12],[6,8],[1,1],[2,3],[4,3],[3,4]]:
    action(p,'another');ok(dimensions(p)==pair,'invitations cycle independently of custom edits')
   action(p,'return');ok(parent(p)==saved_parent,'return preserves Copy Frame panel, geometry and worked frame')
   ok(p.evaluate('document.activeElement.hasAttribute("data-square-pens-entry")'),'parent entry receives Return focus')
   ok(unrelated(book(p))==unrelated(before),'all non-helper notebook roots remain exact')
   p.goto(base+'#notes');p.locator('#download').wait_for()
   with p.expect_download()as d:p.locator('#download').click()
   path=OUT/'notes.json';d.value.save_as(path);report=json.loads(path.read_text());ok(report['syntheticOther']==seed['syntheticOther'],'real Notes preserve large unknown sibling')
   ok('squarePens' not in report,'visit-local paper board adds no saved owner')
   p.locator('#progress-file').set_input_files(path);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
   p.goto(base+'#workshop/copy-frame');p.locator('[data-square-pens-entry]').wait_for();enter(p);ok(dimensions(p)==[3,4],'import starts fresh local material without changing imported notes')
   old=p.locator('[data-sp-action=a-more]').element_handle();action(p,'a-more');old.evaluate('e=>e.click()');ok(dimensions(p)==[4,4],'detached old control cannot change a newer material');p.reload(wait_until='networkidle');ready_parent(p);enter(p);ok(dimensions(p)==[3,4],'reload resets only local paper material')
   p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.locator('[data-square-pens-entry]').wait_for();enter(p);ok(dimensions(p)==[3,4],'second explorer receives separate local material')
   p.goto(base+'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function('location.hash==="#home"')
   p.goto(base+'#workshop/copy-frame');p.locator('[data-square-pens-entry]').wait_for();enter(p);ok(dimensions(p)==[3,4],'actual reset clears paper material')
   # Focused phone/landscape samples, not whole-journey repetition.
   for width,height in [(320,1000),(1024,768)]:
    cc,q=setup(width,height);enter(q);set_dimensions(q,12,1)
    for _ in range(4):
     action(q,'turn')
     boxes=q.locator('.sp-side-label').evaluate_all('xs=>xs.map(x=>{const b=x.getBBox();return{x:b.x,y:b.y,r:b.x+b.width,b:b.y+b.height}})')
     ok(all(not (min(x['r'],y['r'])>max(x['x'],y['x']) and min(x['b'],y['b'])>max(x['y'],y['y'])) for i,x in enumerate(boxes) for y in boxes[i+1:]),'thin-triangle labels stay separated after turns')
    layout(q);q.screenshot(path=str(OUT/f'square-pens-{width}.png'),full_page=True)
    node=q.locator('[data-sp-action=a-less]');node.evaluate('e=>{const p=e.parentNode;e.remove();p.append(e);e.click()}');ok(dimensions(q)==[12,1],'removed/reinserted control is inert')
   # Saving-off remains usable and reports arithmetic help as session-only.
   cc,q=setup();q.goto(base+'#notes');q.locator('#remember').click();q.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();q.goto(base+'#workshop/copy-frame');q.locator('[data-square-pens-entry]').wait_for();enter(q)
   ok('not saved on this device' in q.locator('.sp-notice').inner_text(),'actual save outcome drives session-only notice')
   # Actual live objects and real preflight, with only capture/sink observation added.
   cc,q=setup(harness=True);enter(q);set_dimensions(q,3,4)
   for _ in range(3):action(q,'move')
   q.evaluate('''()=>{const s=squareHarness.book;s.broad.drafts.squareWaiting={question:{fact:[3,3]},attempts:[]};window.squarePremature=false;const main=document.querySelector('main'),d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(main,'innerHTML',{configurable:true,get(){return d.get.call(this)},set(value){if(value.includes('data-sp-result')&&!s.broad.drafts.squareWaiting.knownFact)squarePremature=true;d.set.call(this,value)}});squareHarness.ctx.render();}''')
   ok(q.evaluate('squareHarness.book.broad.drafts.squareWaiting.knownFact===true&&!squarePremature&&squareHarness.book.broad.drafts.squareWaiting.attempts.length===0'),'actual helper qualifies newly waiting fact before native HTML insertion')
   set_dimensions(q,4,6)
   q.evaluate('''async()=>{const s=squareHarness.book;const {checkin}=await import('./content.mjs');const item=checkin.find(q=>q.fact?.[0]===4&&q.fact[1]===6);s.baseline.draft={questionId:item.id,raw:'held'};const {startPostOffice}=await import('./post-office-core.mjs'),{deliveries}=await import('./post-office-content.mjs'),{startAdaptiveRival,generateRivalTask}=await import('./post-rival.mjs');const v=startPostOffice(s,deliveries[0].id);startAdaptiveRival(s);v.rival.task=generateRivalTask('multiply',4,6,0);squareHarness.ctx.render();}''')
   ok(q.evaluate('squareHarness.book.baseline.draft.exposed===true&&squareHarness.book.baseline.observations.length===0&&squareHarness.book.postOffice.visits.at(-1).rival.priorFactShown===true'),'actual baseline and Bramble given flags change without attempts')
   pair=q.evaluate('''async()=>{const {storyNodes}=await import('./story-content.mjs');const n=Object.values(storyNodes).find(n=>n.facts?.length&&n.facts[0].every(v=>Number.isInteger(v)&&v>=1&&v<=12));window.squareGardenNode=n;return n.facts[0]}''');set_dimensions(q,*pair)
   q.evaluate('''()=>{const s=squareHarness.book,n=squareGardenNode;s.garden.visits.push({id:'invented-square-return',entrance:n.entrance,drafts:{[n.id]:{attempts:[],raw:'held'}}});squareHarness.ctx.render();}''')
   ok(q.evaluate('squareHarness.book.garden.visits.at(-1).drafts[squareGardenNode.id].knownFact===true&&squareHarness.book.garden.visits.at(-1).drafts[squareGardenNode.id].attempts.length===0'),'newly waiting Garden material is qualified on rerender')
   # Raw recovery fits, but real pretty Notes exceeds the5MiB limit after helper changes.
   q.evaluate('''async()=>{const s=squareHarness.book;s.broad.drafts.refusedSquare={question:{fact:[8,8]},attempts:[]};s.syntheticByteBoundary='';const candidate=structuredClone(s);squareHarness.ctx.exposeFacts([[8,8]],candidate);const bytes=new TextEncoder().encode(JSON.stringify(candidate,null,2)).length;s.syntheticByteBoundary='x'.repeat(5*1024*1024-bytes-100);window.squareReportCalls=0;}''')
   raw=q.evaluate('JSON.stringify(squareHarness.book)');set_dimensions(q,8,8)
   ok(q.locator('.sp-refusal').count()==1 and not q.locator('[data-sp-piece],[data-sp-result]').count(),'real preflight refusal withholds calculated HTML/SVG')
   ok(q.evaluate('JSON.stringify(squareHarness.book)')==raw,'refused view changes no notebook root')
   ok(q.evaluate('squareReportCalls>0&&squareReportResult===false'),'actual pretty Notes gate is invoked and refuses, not a forcedfalse hook')
   ok(dimensions(q)==[8,8],'requested input survives refusal')
   action(q,'retry');ok(q.locator('.sp-refusal').count()==1,'retry while full stays safely refused')
   q.evaluate('delete squareHarness.book.syntheticByteBoundary');action(q,'retry');ok(dimensions(q)==[8,8] and q.locator('[data-sp-piece]').count()==4,'making room retries exact requested material')
   ok(q.evaluate('squareHarness.book.broad.drafts.refusedSquare.knownFact===true&&squareHarness.book.broad.drafts.refusedSquare.attempts.length===0'),'successful retry records only given help')
   ok(not errors,'no JavaScript errors: '+str(errors))
   for c in contexts:c.close()
   browser.close()
 finally:server.shutdown()
 print(f'Square Pens native: {checks} checks passed; artifacts {OUT}')

if __name__=='__main__':main()
