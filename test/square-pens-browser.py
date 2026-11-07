"""Square Pens396/397/400 actual-app journey plus labelled live-object fault probes.
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

def set_grid_points(p,A,B):
 for point,pair in [('A',A),('B',B)]:
  action(p,'gp-'+point)
  for axis,value in zip('xy',pair):
   # Read literal position rather than using the distance model as an oracle.
   now=int(p.locator('[data-sp-grid-controls] output').nth('xy'.index(axis)).inner_text().split()[0])
   for _ in range(abs(value-now)):action(p,'g'+axis+('-more' if value>now else '-less'))

def grid_literal(p,A,B):
 text=p.locator('[data-sp-grid-controls]').inner_text()
 ok(f'A: ({A[0]}, {A[1]})' in text and f'B: ({B[0]}, {B[1]})' in text,'both literal coordinate positions remain visible')

def retired_anchor(p,anchor):
 result=anchor.evaluate("e=>{document.querySelector('main').append(e);const click=new MouseEvent('click',{bubbles:true,cancelable:true});e.dispatchEvent(click);return{prevented:click.defaultPrevented,hash:location.hash}}")
 ok(result=={'prevented':True,'hash':'#workshop/copy-frame'},'retired actual anchor cancels default navigation after Return and a later bind')
 anchor.evaluate('e=>e.remove()')

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
      modified=s[:a]+part.replace(needle,wrapper)+s[b:]
      exposure='function exposeStoryFacts(node,except,target=state,qualifyPendingBramble=false,normalize=true){'
      assert exposure in modified
      route.fulfill(response=response,body=modified.replace(exposure,exposure+'window.squareExposureCalls=(window.squareExposureCalls||[]);window.squareExposureCalls.push({pairs:node.facts,normalize});',1))
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
   action(p,'page-why');ok(not p.locator('.sp-dimensions').count() and 'a=2 units' in p.locator('.sp-waiting').inner_text() and 'b=3 units' in p.locator('.sp-waiting').inner_text(),'reference pages retain readonly own material')
   ok('5 × 5 = 25' not in p.locator('.sp-page').inner_text(),'unselected teaching answers are not hidden in the DOM')
   for step in range(6):action(p,'why-'+str(step))
   ok('5 × 5 = 25' in p.locator('.sp-page').inner_text(),'selected final reference explains area versus length')
   action(p,'page-corner');ok('6 × 6 = 36' in p.locator('.sp-page').inner_text() and 'between the 3 and 4' in p.locator('.sp-page').inner_text(),'non-right contrast names the actual obtuse corner')
   action(p,'build');ok(dimensions(p)==[2,3] and p.locator('[data-sp-length]').count()==1,'reference return restores exact own input/disclosure')
   p.screenshot(path=str(OUT/'square-pens-820.png'),full_page=True)
   for pair in [[5,12],[6,8],[1,1],[2,3],[4,3],[3,4]]:
    action(p,'another');ok(dimensions(p)==pair,'invitations cycle independently of custom edits')
   #397: inverse unknown, separate retained material and explicit disclosure.
   set_dimensions(p,2,3)
   action(p,'move');action(p,'side-c')
   action(p,'page-missing');layout(p)
   ok('Your Build pieces are kept.' in p.locator('.sp-waiting').inner_text() and not p.locator('.sp-dimensions:not(.sp-missing-dimensions)').count(),'missing page does not leak Build dimensions')
   ok(p.locator('[data-sp-missing-step="0"]').count()==1 and not p.locator('[data-sp-missing-answer]').count(),'comparison starts before remaining area and length disclosures')
   action(p,'missing-next');ok('25 − 9 = 16' in p.locator('[data-sp-missing-step]').inner_text() and not p.locator('[data-sp-missing-answer]').count(),'remaining area is revealed before its side length')
   action(p,'missing-next');ok('4 × 4 = 16' in p.locator('[data-sp-missing-answer]').inner_text(),'positive length follows remaining area')
   for pair in [[13,5],[10,8],[5,4],[4,2],[2,1],[5,3]]:
    action(p,'missing-another')
    actual=[int(x.split()[0]) for x in p.locator('.sp-missing-dimensions output').all_text_contents()]
    ok(actual==pair and p.locator('[data-sp-missing-step="0"]').count()==1,'inverse invitations cycle and reset only elected step')
   action(p,'missing-turn');action(p,'missing-step-2');action(p,'page-why');action(p,'page-missing')
   ok(p.locator('[data-sp-missing-step="2"]').count()==1,'reference visit retains missing triangle and disclosure')
   action(p,'build');ok(dimensions(p)==[2,3] and p.locator('[data-sp-piece]').count()==4 and 'side c' in p.locator('[aria-pressed=true]').inner_text(),'inverse work preserves Build input, moved material and marked side')
   action(p,'page-missing');p.locator('[data-sp-action=ma-more]').focus();p.keyboard.press('Enter')
   ok(p.locator('.sp-missing-dimensions output').nth(1).inner_text()=='4 units','keyboard edits inverse known side')
   action(p,'build')
   #400: one full grid journey, then bounded varied material and responsive samples.
   build_snapshot=p.locator('[data-square-pens-root]').inner_html()
   action(p,'page-missing');missing_snapshot=p.locator('[data-sp-missing-step]').inner_text();action(p,'page-grid');layout(p)
   ok(p.locator('#sp-task').evaluate('e=>e.getBoundingClientRect().top>=-1&&e.getBoundingClientRect().top<100') and p.locator('[data-sp-grid-figure]').bounding_box()['y']<250,'grid entry brings its task and map into view instead of leaving the map below the menus')
   p.screenshot(path=str(OUT/'square-pens-grid-entry-viewport.png'))
   grid_literal(p,[1,1],[4,5])
   p.locator('[data-sp-action=gp-A]').evaluate("e=>{e.dataset.spAction='a-more';e.click();e.dataset.spAction='gp-A'}")
   grid_literal(p,[1,1],[4,5])
   ok(p.locator('[data-sp-grid-interval]').count()==7,'default edge route has seven unit segments, not endpoint dots')
   ok(not p.locator('[data-sp-grid-areas],[data-sp-grid-length],[data-sp-grid-distance],[data-sp-square-side]').count(),'count step contains no square or distance disclosures')
   ok(p.locator('[data-sp-grid]').evaluate("r=>{const n=r.cloneNode(true);n.querySelectorAll('details').forEach(x=>x.remove());return !/[×√]|square units/.test(n.textContent+' '+[...n.querySelectorAll('[aria-label]')].map(x=>x.getAttribute('aria-label')).join(' '))}"),'count text and aria withhold numerical products, square areas and roots')
   action(p,'grid-trace-next');ok(p.locator('[data-sp-grid-highlighted=true]').count()==1,'one manual interval is highlighted');ok('1 of 7' in p.locator('[data-sp-grid-trace-count]').inner_text(),'manual trace advances one interval')
   action(p,'grid-trace-back');ok('0 of 7' in p.locator('[data-sp-grid-trace-count]').inner_text(),'manual trace can move back')
   action(p,'grid-trace-all');ok('7 of 7' in p.locator('[data-sp-grid-trace-count]').inner_text(),'whole trace highlights the complete edge route')
   p.screenshot(path=str(OUT/'square-pens-820-grid.png'),full_page=True)
   action(p,'grid-step-1')
   ok(p.locator('[data-sp-grid-highlighted=true]').count()==7,'highlighted prefix persists on later steps')
   ok(p.locator('[data-sp-square-side]').evaluate_all('xs=>xs.map(x=>[x.dataset.spSquareSide,x.dataset.spSquareArea])')==[['3','9'],['4','16']],'pictured known squares expose exactly the elected leg areas')
   ok('3 × 3 = 9' in p.locator('[data-sp-grid-areas]').inner_text() and '4 × 4 = 16' in p.locator('[data-sp-grid-areas]').inner_text(),'coordinate differences become the two known square areas')
   ok(not p.locator('[data-sp-grid-length],[data-sp-grid-distance],[data-sp-grid-trace-count]').count(),'squares step withholds root and trace counter')
   action(p,'grid-step-2');ok('5 units' in p.locator('[data-sp-grid-distance]').inner_text(),'distance uses length units rather than25 square units')
   old_route=p.locator('[data-sp-grid-interval]').evaluate_all('xs=>xs.map(x=>[x.getAttribute("x1"),x.getAttribute("y1"),x.getAttribute("x2"),x.getAttribute("y2")])')
   action(p,'grid-other')
   ok(old_route!=p.locator('[data-sp-grid-interval]').evaluate_all('xs=>xs.map(x=>[x.getAttribute("x1"),x.getAttribute("y1"),x.getAttribute("x2"),x.getAttribute("y2")])') and '5 units' in p.locator('[data-sp-grid-distance]').inner_text(),'other elbow changes route while retaining elected distance')
   for A,B,L,d,kind in [([10,9],[4,1],14,'10','triangle'),([2,8],[7,8],5,'5','axis'),([6,6],[6,6],0,'0','same'),([3,3],[5,6],5,'√13','triangle'),([0,0],[12,12],24,'√288','triangle'),([1,1],[4,5],7,'5','triangle')]:
    action(p,'grid-another');grid_literal(p,A,B)
    ok(p.locator('[data-sp-grid-kind]').get_attribute('data-sp-grid-kind')==kind and p.locator('[data-sp-grid-interval]').count()==L,'invitation has independently expected geometry and interval count')
    ok(not p.locator('[data-sp-grid-areas],[data-sp-grid-length],[data-sp-grid-distance]').count(),'new invitation resets disclosure')
    action(p,'grid-step-2');ok(d+' units' in p.locator('[data-sp-grid-length]').inner_text(),'invitation straight distance is exact')
    if kind!='triangle':ok(not p.locator('[data-sp-square-side],[data-sp-grid-right-corner]').count(),'degenerate material has no square pictures or right corner')
   set_grid_points(p,[1,1],[9,10]);grid_literal(p,[1,1],[9,10])
   action(p,'gx-more');grid_literal(p,[1,1],[10,10]);action(p,'gx-less')
   action(p,'gp-A');p.locator('[data-sp-action=gx-more]').focus();p.keyboard.press('Enter');grid_literal(p,[2,1],[9,10])
   p.locator('[data-sp-action=gx-less]').tap();grid_literal(p,[1,1],[9,10])
   action(p,'page-why');action(p,'why-5');action(p,'page-grid');grid_literal(p,[1,1],[9,10])
   action(p,'page-missing');ok(p.locator('[data-sp-missing-step]').inner_text()==missing_snapshot,'grid preserves missing-square material and elected stage')
   action(p,'build');ok(p.locator('[data-square-pens-root]').inner_html()==build_snapshot,'grid preserves exact Build material and disclosures')
   p.locator('[data-sp-action=a-more]').evaluate("e=>{e.dataset.spAction='gx-more';e.click();e.dataset.spAction='a-more'}")
   ok(p.locator('[data-square-pens-root]').inner_html()==build_snapshot,'synthetic grid coordinate action refuses on Build')
   # Keep a real footer anchor across Back and another binding; buttons cannot prove default-link safety.
   old_anchor=p.locator('footer a[href="#learn/math/equality"]').element_handle()
   action(p,'return');ok(parent(p)==saved_parent,'return preserves Copy Frame panel, geometry and worked frame')
   ok(p.evaluate('document.activeElement.hasAttribute("data-square-pens-entry")'),'parent entry receives Return focus')
   enter(p);retired_anchor(p,old_anchor);action(p,'return')
   ok(unrelated(book(p))==unrelated(before),'all non-helper notebook roots remain exact')
   p.goto(base+'#notes');p.locator('#download').wait_for()
   with p.expect_download()as d:p.locator('#download').click()
   path=OUT/'notes.json';d.value.save_as(path);report=json.loads(path.read_text());ok(report['syntheticOther']==seed['syntheticOther'],'real Notes preserve large unknown sibling')
   ok('squarePens' not in report,'visit-local paper board adds no saved owner')
   p.locator('#progress-file').set_input_files(path);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
   p.goto(base+'#workshop/copy-frame');p.locator('[data-square-pens-entry]').wait_for();enter(p);ok(dimensions(p)==[3,4],'import starts fresh local material without changing imported notes')
   old=p.locator('[data-sp-action=a-more]').element_handle();action(p,'a-more');old.evaluate('e=>e.click()');ok(dimensions(p)==[4,4],'detached old control cannot change a newer material');p.reload(wait_until='networkidle');ready_parent(p);enter(p);ok(dimensions(p)==[3,4],'reload resets only local paper material')
   p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.locator('[data-square-pens-entry]').wait_for();enter(p);ok(dimensions(p)==[3,4],'second explorer receives separate local material')
   reset_anchor=p.locator('footer a[href="#learn/math/equality"]').element_handle()
   p.goto(base+'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function('location.hash==="#home"')
   p.goto(base+'#workshop/copy-frame');p.locator('[data-square-pens-entry]').wait_for();enter(p);ok(dimensions(p)==[3,4],'actual reset clears paper material');retired_anchor(p,reset_anchor)
   # Focused phone/landscape samples, not whole-journey repetition.
   for width,height in [(320,1000),(1024,768)]:
    cc,q=setup(width,height);enter(q);set_dimensions(q,12,1)
    for _ in range(4):
     action(q,'turn')
     boxes=q.locator('.sp-side-label').evaluate_all('xs=>xs.map(x=>{const b=x.getBBox();return{x:b.x,y:b.y,r:b.x+b.width,b:b.y+b.height}})')
     ok(all(not (min(x['r'],y['r'])>max(x['x'],y['x']) and min(x['b'],y['b'])>max(x['y'],y['y'])) for i,x in enumerate(boxes) for y in boxes[i+1:]),'thin-triangle labels stay separated after turns')
    layout(q);q.screenshot(path=str(OUT/f'square-pens-{width}.png'),full_page=True)
    if width==320:
     for page in ['why','corner','missing']:
      action(q,'page-'+page);layout(q);q.screenshot(path=str(OUT/f'square-pens-{width}-{page}.png'),full_page=True)
     action(q,'page-build')
    action(q,'page-grid');action(q,'grid-trace-next')
    ok(q.locator('[data-sp-grid-figure] svg').evaluate('e=>{const r=e.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1}') and q.locator('[data-sp-action=grid-trace-next]').evaluate('e=>{const r=e.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1}'),'tracing keeps the map and its control visible together at this viewport')
    q.screenshot(path=str(OUT/f'square-pens-{width}-trace-viewport.png'))
    set_grid_points(q,[0,0],[12,12]);action(q,'grid-step-2');layout(q)
    grid_literal(q,[0,0],[12,12])
    text_sizes=q.locator('[data-sp-grid-figure] svg text').evaluate_all('xs=>xs.map(x=>parseFloat(getComputedStyle(x).fontSize)*x.getScreenCTM().a)')
    ok(all(n>=15.9 for n in text_sizes),'grid SVG labels render at least16px')
    q.screenshot(path=str(OUT/f'square-pens-{width}-grid.png'),full_page=True)
    action(q,'page-build')
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
   q.evaluate('delete squareHarness.book.syntheticByteBoundary');action(q,'retry')
   ok(dimensions(q)==[8,8] and q.locator('[data-sp-piece]').count()==4,'making room retries exact requested material')
   ok(q.evaluate('squareHarness.book.broad.drafts.refusedSquare.knownFact===true&&squareHarness.book.broad.drafts.refusedSquare.attempts.length===0'),'successful retry records only given help')
   action(q,'page-build');set_dimensions(q,2,3);action(q,'move');action(q,'side-c')
   old_build_control=q.locator('[data-sp-action=a-more]').element_handle()
   action(q,'page-missing');action(q,'missing-another')
   q.evaluate('''()=>{const s=squareHarness.book;s.broad.drafts.missingWaiting={question:{fact:[12,12]},attempts:[]};window.squarePremature=false;const main=document.querySelector('main'),d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(main,'innerHTML',{configurable:true,get(){return d.get.call(this)},set(value){if(value.includes('data-sp-missing-answer')&&!s.broad.drafts.missingWaiting.knownFact)squarePremature=true;d.set.call(this,value)}});}''')
   action(q,'missing-step-2')
   ok(q.evaluate('squareHarness.book.broad.drafts.missingWaiting.knownFact===true&&squareHarness.book.broad.drafts.missingWaiting.attempts.length===0&&!squarePremature'),'inverse12×12 help precedes rendered side answer without attempts')
   action(q,'missing-step-0')
   q.evaluate('''async()=>{const s=squareHarness.book;s.broad.drafts.refusedMissing={question:{fact:[12,12]},attempts:[]};s.syntheticByteBoundary='';const candidate=structuredClone(s);squareHarness.ctx.exposeFacts([[12,12]],candidate);const bytes=new TextEncoder().encode(JSON.stringify(candidate,null,2)).length;s.syntheticByteBoundary='x'.repeat(5*1024*1024-bytes-100);window.squareReportCalls=0;}''')
   raw=q.evaluate('JSON.stringify(squareHarness.book)');action(q,'missing-step-2')
   ok(q.locator('.sp-refusal').count()==1 and not q.locator('[data-sp-missing-step],[data-sp-missing-answer],.sp-dimensions:not(.sp-missing-dimensions)').count(),'missing refusal hides computed section and Build controls')
   ok(q.evaluate('JSON.stringify(squareHarness.book)')==raw and q.evaluate('squareReportCalls>0&&squareReportResult===false'),'missing refusal uses real Notes boundary and preserves book')
   ok([x.split()[0] for x in q.locator('.sp-missing-dimensions output').all_text_contents()]==['13','5'],'refusal keeps requested inverse inputs')
   old_build_control.evaluate('e=>e.click()')
   action(q,'ma-more');ok(q.locator('.sp-missing-dimensions output').nth(1).inner_text()=='6 units','refused inverse edit supersedes pending request')
   q.evaluate('delete squareHarness.book.syntheticByteBoundary')
   if q.locator('[data-sp-action=retry]').count():action(q,'retry')
   ok(q.locator('[data-sp-missing-step="0"]').count()==1,'retry keeps newer inverse inputs and reset step')
   action(q,'build');ok(dimensions(q)==[2,3] and not q.locator('[data-sp-empty-label]').count() and 'side c' in q.locator('[aria-pressed=true]').inner_text(),'refused inverse edits leave Build material and mark intact')
   #400 live qualification: 12×12 first appears as the root bracket for h8/v9.
   action(q,'page-grid');set_grid_points(q,[1,1],[9,10]);action(q,'grid-step-1')
   ok('8 × 8 = 64' in q.locator('[data-sp-grid-areas]').inner_text() and '9 × 9 = 81' in q.locator('[data-sp-grid-areas]').inner_text() and not q.locator('[data-sp-grid-length]').count(),'8/9 areas precede the root bracket')
   q.evaluate('''()=>{const s=squareHarness.book;s.broad.drafts.gridWaiting={question:{fact:[12,12]},attempts:[]};window.squarePremature=false;window.squareExposureCalls=[];const main=document.querySelector('main'),d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(main,'innerHTML',{configurable:true,get(){return d.get.call(this)},set(value){if(value.includes('data-sp-grid-length')&&!s.broad.drafts.gridWaiting.knownFact)squarePremature=true;d.set.call(this,value)}});}''')
   action(q,'grid-step-2')
   ok(q.evaluate('squareHarness.book.broad.drafts.gridWaiting.knownFact===true&&squareHarness.book.broad.drafts.gridWaiting.attempts.length===0&&!squarePremature&&squareExposureCalls.some(x=>x.normalize===false&&x.pairs.some(p=>p[0]===12&&p[1]===12))'),'actual normalize=false helper qualifies newly pending12×12 before root diagram insertion')
   ok('12 × 12 = 144' in q.locator('[data-sp-grid-length]').inner_text() and '√145 units' in q.locator('[data-sp-grid-distance]').inner_text(),'actual root bracket is12/13 for√145')
   q.evaluate('''()=>{squareHarness.book.broad.drafts.gridWaiting={question:{fact:[12,12]},attempts:[]};squarePremature=false;squareHarness.ctx.render();}''')
   ok(q.evaluate('squareHarness.book.broad.drafts.gridWaiting.knownFact===true&&!squarePremature'),'new matching pending task requalifies even after this stage was shown')
   action(q,'grid-step-0')
   q.evaluate('''()=>{const s=squareHarness.book;s.broad.drafts.refusedGrid={question:{fact:[12,12]},attempts:[]};s.syntheticByteBoundary='';const candidate=structuredClone(s);squareHarness.ctx.exposeFacts([[8,8],[9,9],[12,12]],candidate);const bytes=new TextEncoder().encode(JSON.stringify(candidate,null,2)).length;s.syntheticByteBoundary='x'.repeat(5*1024*1024-bytes-100);window.squareReportCalls=0;}''')
   raw=q.evaluate('JSON.stringify(squareHarness.book)');action(q,'grid-step-2')
   ok(q.locator('.sp-refusal').count()==1 and not q.locator('[data-sp-grid-figure],[data-sp-grid-areas],[data-sp-grid-length],[data-sp-grid-distance],[data-sp-grid-trace-count],.sp-dimensions').count(),'real grid refusal withholds map, counts, products, roots and Build inputs')
   grid_literal(q,[1,1],[9,10])
   ok(q.locator('.sp-status').inner_text()=='' and q.evaluate('JSON.stringify(squareHarness.book)')==raw and q.evaluate('squareReportCalls>0&&squareReportResult===false'),'real Notes refusal preserves every book root and discloses no computed status')
   old_retry=q.locator('[data-sp-action=retry]').element_handle()
   action(q,'gp-A');action(q,'gx-more');action(q,'grid-step-1');grid_literal(q,[2,1],[9,10])
   old_retry.evaluate('e=>e.click()');grid_literal(q,[2,1],[9,10])
   q.evaluate('delete squareHarness.book.syntheticByteBoundary')
   if q.locator('[data-sp-action=retry]').count():action(q,'retry')
   grid_literal(q,[2,1],[9,10]);ok(q.locator('[data-sp-grid-areas]').count()==1 and not q.locator('[data-sp-grid-length]').count(),'new point/coordinate/stage choices supersede obsolete Retry')
   action(q,'build');ok(dimensions(q)==[2,3] and 'side c' in q.locator('[aria-pressed=true]').inner_text(),'grid refusal preserves other Build plan')
   ok(not errors,'no JavaScript errors: '+str(errors))
   for c in contexts:c.close()
   browser.close()
 finally:server.shutdown()
 print(f'Square Pens native: {checks} checks passed; artifacts {OUT}')

if __name__=='__main__':main()
