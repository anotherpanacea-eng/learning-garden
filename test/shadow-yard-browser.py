"""Shadow Yard405: one native tablet journey, responsive samples and live Notes probes.
Invented notebooks only. The labelled fault context captures live objects and the
DOM insertion sink; qualification and Notes import predicates remain production.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SHADOW_YARD_ARTIFACTS','/private/tmp/lg405-native'));OUT.mkdir(parents=True,exist_ok=True)
checks=0

def ok(value,message):
 global checks
 assert value,message
 checks+=1

def action(p,name):p.locator('[data-sy-action="'+name+'"]').first.click()
def enter(p):p.locator('[data-shadow-yard-entry]').click();p.locator('[data-shadow-yard-root]').wait_for()
def height(p):
 text=p.locator('[data-sy-height]').inner_text()
 import re
 m=re.search(r'(\d+(?:\.\d+)?)',text)
 return float(m[1]) if m else None

def set_height(p,value):
 if height(p) is None:action(p,'choose')
 now=height(p)
 for _ in range(round(abs(value-now)*2)):action(p,'more' if value>now else 'less')
 ok(height(p)==value,'native proposal controls choose '+str(value)+' meters')
def select(p,case):p.locator('[data-sy-case]').select_option(case)
def text(p):return p.locator('[data-shadow-yard-root]').inner_text()
def speech(p):return p.locator('[data-shadow-yard-root] [data-speak]').get_attribute('data-speak')
def book(p):return p.evaluate('()=>{const id=JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId;return JSON.parse(localStorage.getItem("number-garden-v1:"+id));}')
def unrelated(s):return {k:v for k,v in s.items() if k not in ['broad','garden','baseline','postOffice','exposures']}
def parent(p):return p.locator('[data-cframe-root]').evaluate('r=>({view:r.dataset.cframeView,choice:r.querySelector("select").value,refs:[...r.querySelectorAll(".cframe-refs")].map(x=>x.textContent),captions:[...r.querySelectorAll("figcaption")].map(x=>x.textContent)})')
def ready_parent(p):
 p.locator('[data-shadow-yard-entry],[data-select-explorer]').first.wait_for()
 if p.locator('[data-shadow-yard-entry]').count():return
 active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
 choice=p.locator('[data-select-explorer="'+active+'"]')
 if choice.count():choice.click()
 p.locator('[data-shadow-yard-entry]').wait_for()
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'page has no horizontal overflow')
 bad=p.locator('[data-shadow-yard-root] button,[data-shadow-yard-root] a,[data-shadow-yard-root] select').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 ok(not bad,'visible touch controls use44px targets and16px type: '+str(bad))
 sizes=p.locator('[data-sy-diagram] svg').evaluate_all('xs=>xs.map(x=>{const b=x.getBoundingClientRect();return [b.width,b.height]})')
 if sizes:ok(len(sizes)==2 and abs(sizes[0][0]-sizes[1][0])<.1 and abs(sizes[0][1]-sizes[1][1])<.1 and max(x[0] for x in sizes)<=260.1,'paired SVGs retain the same bounded on-screen scale')

def retired(p,node):
 before=p.locator('[data-shadow-yard-root]').inner_html()
 effects=p.evaluate('JSON.stringify([shadowSpoken.length,shadowStops,location.hash,{...localStorage}])')
 node.evaluate('e=>{document.querySelector("main").append(e);e.click();e.remove()}')
 ok(p.locator('[data-shadow-yard-root]').inner_html()==before and p.evaluate('JSON.stringify([shadowSpoken.length,shadowStops,location.hash,{...localStorage}])')==effects,'retired control cannot edit, save, navigate or speak')

def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from './dist/core.mjs';import{initializeExplorerState}from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={body:'z'.repeat(524288),opaque:'invented'};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
   contexts=[];errors=[]
   def setup(width=820,height=1100,harness=False):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True);contexts.append(c)
    registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-06T12:00:00.000Z'},{'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-11-06T12:00:00.000Z'}]}
    c.add_init_script('(d=>{if(!localStorage.getItem("shadow-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem("number-garden-v1:"+e.id,JSON.stringify(d.seed));localStorage.setItem("shadow-fixture","1");}})('+json.dumps({'registry':registry,'seed':seed})+')')
    # Local speech sink observation measures requested payloads, never audible quality.
    c.add_init_script('''window.shadowSpoken=[];window.shadowStops=0;window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};Object.defineProperty(speechSynthesis,'getVoices',{value:()=>[{name:'Synthetic local test voice',lang:'en-US',localService:true,default:true,voiceURI:'synthetic-local'}]});Object.defineProperty(speechSynthesis,'speak',{value:u=>{shadowSpoken.push(u.text)}});Object.defineProperty(speechSynthesis,'cancel',{value:()=>{shadowStops++}});''')
    if harness:
     def capture(route):
      response=route.fetch();s=response.text();needle='export function bindShadowYard(book,ctx){';assert needle in s
      # Detached geometry probe restores the live visit after each actual renderer call.
      renderer=';window.shadowRender=w=>{const held=visit;visit={book:{},owner:\'geometry\',active:true,work:w,ready:w,pending:null,request:null};try{return shadowYardPage(visit.book,visit.owner)}finally{visit=held}};'
      route.fulfill(response=response,body=s.replace(needle,needle+'window.shadowHarness={book,ctx};',1)+renderer)
     c.route('**/shadow-yard-ui.mjs',capture)
     def trace(route):
      response=route.fetch();s=response.text();a=s.index("  if(hash==='#workshop/copy-frame'){");b=s.index("  if(hash==='#post/lost-and-found'){",a);part=s[a:b]
      needle='canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok';assert needle in part
      wrapper='canExport:candidate=>{window.shadowReportCalls=(window.shadowReportCalls||0)+1;const result=prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok;window.shadowReportResult=result;return result;}'
      modified=s[:a]+part.replace(needle,wrapper)+s[b:]
      exposure='function exposeStoryFacts(node,except,target=state,qualifyPendingBramble=false,normalize=true){';assert exposure in modified
      route.fulfill(response=response,body=modified.replace(exposure,exposure+'window.shadowExposureCalls=(window.shadowExposureCalls||[]);window.shadowExposureCalls.push({pairs:node.facts,normalize});',1))
     c.route('**/app.mjs',trace)
    p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)))
    p.goto(base+'#workshop/copy-frame',wait_until='networkidle');p.locator('#explorer-header').wait_for();ready_parent(p);return c,p
   c,p=setup()
   for name in ['width-more','height-more','tiles','example','next','next']:p.locator('[data-cframe-action="'+name+'"]').click()
   saved_parent=parent(p);before=book(p);enter(p);layout(p)
   ok(not p.locator('[data-cframe-root]').count(),'parent calculations are absent while child is active')
   ok(height(p) is None and not p.locator('[data-sy-result]').count(),'new proposal begins empty without inferred height or result')
   action(p,'compare');ok('Choose' in text(p) and height(p) is None,'incomplete Compare asks for proposal')
   p.locator('[data-sy-action=choose]').focus();p.keyboard.press('Enter');ok(height(p)==1,'keyboard selects first one-meter proposal')
   set_height(p,3);action(p,'compare');ok('ratios agree' in text(p) and 'square meters' in text(p),'matching flagpost explains ratios and products')
   action(p,'more');ok(height(p)==3.5 and not p.locator('[data-sy-result]').count(),'edit clears elected comparison')
   action(p,'compare');ok('ratios differ' in text(p),'nonmatching hypothesis invites another height')
   # All six finite conditions, including noninteger and smaller target heights.
   for case,value in [('courtyard',6),('bridge',7.5),('garden',2)]:
    select(p,case);set_height(p,value);action(p,'compare');ok('ratios agree' in text(p),'same-moment '+case+' fits expected height')
   select(p,'moments');set_height(p,6);action(p,'compare');ok('has not been established' in text(p) and 'Cross-products' not in text(p),'different moments decline an unwarranted height inference')
   select(p,'overhead');set_height(p,8);action(p,'compare');ok('undefined' in text(p) and 'Any positive' in text(p),'zero shadows allow any positive height without division')
   ok(p.locator('[data-sy-right-angle]').count()==0,'zero-shadow drawing has no right-angle marker');p.screenshot(path=str(OUT/'shadow-yard-820-zero.png'),full_page=True)
   select(p,'bridge');ok(height(p)==7.5 and 'ratios agree' in text(p),'case return retains proposal and Compare')
   original=p.locator('[data-shadow-yard-root]').inner_html();action(p,'teaching')
   ok('Two right angles' in text(p) and '3 × 6 = 18' not in p.locator('[data-shadow-yard-root]').inner_html(),'teaching shows elected page only')
   for _ in range(3):action(p,'next')
   ok('zero shadow' in text(p) and 'Two right angles' not in speech(p),'teaching narration follows current page')
   action(p,'build');ok(height(p)==7.5 and 'ratios agree' in text(p),'teaching preserves own comparison')
   action(p,'example');ok('3 × 6 = 18' not in p.locator('[data-shadow-yard-root]').inner_html(),'example starts without future multiplication disclosure')
   for _ in range(3):action(p,'next')
   ok('4.5' in text(p) and 'square meters' in text(p),'separate example reaches its own fractional result')
   narration=speech(p);ok('4.5' in narration and 'bridge marker' not in narration.lower() and 'independent mastery' not in narration,'Hear includes current example without hidden case context or grown-up note')
   p.locator('[data-shadow-yard-root] [data-speak]').click();ok(p.evaluate('shadowSpoken.length>0'),'explicit Hear reaches local speech sink')
   old_hear=p.locator('[data-sy-action=hear]').element_handle();stops=p.evaluate('shadowStops');action(p,'build');retired(p,old_hear);ok(p.evaluate('shadowStops')>stops and height(p)==7.5,'return stops speech and preserves own height')
   action(p,'clear');ok(height(p) is None and not p.locator('[data-sy-result]').count(),'clear restores empty proposal')
   # Boundary focus and hidden/disabled/detached/reinserted actual controls.
   set_height(p,.5);ok(p.locator('[data-sy-action=less]').is_disabled(),'minimum proposal disables Less')
   stale=p.locator('[data-sy-action=more]').element_handle();action(p,'more');retired(p,stale)
   node=p.locator('[data-sy-action=more]');node.evaluate('e=>{e.hidden=true;e.click();e.hidden=false}');ok(height(p)==1,'hidden control cannot edit')
   node.evaluate('e=>{e.disabled=true;e.dispatchEvent(new MouseEvent("click",{bubbles:true}));e.disabled=false}');ok(height(p)==1,'disabled control cannot edit')
   node.evaluate('e=>{const parent=e.parentNode;e.remove();parent.append(e);e.click()}');ok(height(p)==1,'removed/reinserted control remains retired')
   action(p,'return');ok(parent(p)==saved_parent,'Back restores exact parent panel and worked frame')
   p.locator('[data-square-pens-entry]').click();p.locator('[data-square-pens-root]').wait_for();p.locator('[data-sp-action=return]').click();enter(p);ok(height(p)==1,'sibling roundtrip retains Shadow Yard draft')
   p.screenshot(path=str(OUT/'shadow-yard-820.png'),full_page=True)
   action(p,'return');ok(unrelated(book(p))==unrelated(before),'non-helper notebook roots remain exact')
   p.goto(base+'#notes');p.locator('#download').wait_for()
   with p.expect_download() as d:p.locator('#download').click()
   path=OUT/'notes.json';d.value.save_as(path);report=json.loads(path.read_text());ok(report['syntheticOther']==seed['syntheticOther'] and 'shadowYard' not in report,'actual Notes preserve unknown material without saved proposal owner')
   p.locator('#progress-file').set_input_files(path);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
   p.goto(base+'#workshop/copy-frame');ready_parent(p);enter(p);ok(height(p) is None,'import clears local proposal')
   set_height(p,2);p.goto(base+'#workshop');p.goto(base+'#workshop/copy-frame');ready_parent(p);enter(p);ok(height(p) is None,'leaving route clears local proposal')
   set_height(p,2);old_owner=p.locator('[data-sy-action=more]').element_handle();p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready_parent(p);enter(p);ok(height(p) is None,'explorer switch clears local proposal');retired(p,old_owner)
   set_height(p,2);p.goto(base+'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function('location.hash==="#home"');p.goto(base+'#workshop/copy-frame');ready_parent(p);enter(p);ok(height(p) is None,'actual reset clears local proposal')
   for width,h in [(320,1000),(1024,768)]:
    cc,q=setup(width,h);enter(q);q.screenshot(path=str(OUT/f'shadow-yard-{width}-entry.png'));ok(q.locator('[data-sy-action=choose]').evaluate('e=>e.getBoundingClientRect().bottom<=innerHeight') if width>=820 else q.locator('[data-sy-action=choose]').bounding_box()['y']<q.locator('[data-sy-diagram]').first.bounding_box()['y'],'entry controls are visible on wide screens and precede phone diagrams');select(q,'bridge');set_height(q,7.5);action(q,'compare');layout(q);q.screenshot(path=str(OUT/f'shadow-yard-{width}.png'),full_page=True)
    action(q,'example');action(q,'next');action(q,'next');layout(q)
   # Saving disabled: use actual UI and actual save result.
   cc,q=setup();q.goto(base+'#notes');q.locator('#remember').click();q.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();q.goto(base+'#workshop/copy-frame');ready_parent(q);enter(q);set_height(q,3);action(q,'compare');ok('not saved on this device' in text(q),'actual disabled saving produces session-only notice')
   # Live-object probes retain real recordGivenMath and real Notes byte boundary.
   cc,q=setup(harness=True);enter(q)
   geometry=q.evaluate(r'''()=>{const cases=[['flagpost',1,2,6],['courtyard',2,3,9],['bridge',3,2,5],['garden',4,6,3],['moments',2,3,9],['overhead',1,0,0]],bad=[];let count=0;for(const[id,A,B,C]of cases)for(let half=0;half<=48;half++){const h=half?half/2:null,w={caseId:id,drafts:{[id]:{heightHalf:half||null,compare:false}},view:'build',step:0},box=document.createElement('div');box.innerHTML=shadowRender(w);const scale=Math.min(190/Math.max(A,h||A),200/Math.max(B,C,1));for(const[k,H,S]of[['given',A,B],['proposed',h,C]]){const svg=box.querySelector('[data-sy-diagram='+k+'] svg'),post=svg.querySelector('[data-sy-leg=height]'),shadow=svg.querySelector('[data-sy-leg=shadow]'),guide=svg.querySelector('[data-sy-hypotenuse]'),corner=svg.querySelector('[data-sy-right-angle]');const near=(a,b)=>Math.abs(Number(a)-b)<1e-8;let valid=near(shadow.getAttribute('x1'),25)&&near(shadow.getAttribute('y1'),210)&&near(shadow.getAttribute('x2'),25+S*scale)&&near(shadow.getAttribute('y2'),210);valid=valid&&(H===null?!post:post&&near(post.getAttribute('x1'),25)&&near(post.getAttribute('x2'),25)&&near(post.getAttribute('y1'),210)&&near(post.getAttribute('y2'),210-H*scale));valid=valid&&(Boolean(guide)===(H!==null&&S>0))&&(Boolean(corner)===(H!==null&&S>0));if(guide){const nums=guide.getAttribute('d').match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi).map(Number);valid=valid&&nums.length===4&&near(nums[0],25)&&near(nums[1],210-H*scale)&&near(nums[2],25+S*scale)&&near(nums[3],210);}if(!valid)bad.push(id+':'+half+':'+k);}count++;}return{count,bad}}''')
   ok(geometry['count']==294 and not geometry['bad'],'actual renderer: all six cases × empty+48 heights have literal common-scale geometry, no hidden inferred post, and correct degeneracy: '+str(geometry['bad']))
   set_height(q,3)
   q.evaluate('''()=>{const s=shadowHarness.book;s.broad.drafts.shadowWaiting={question:{fact:[1,6]},attempts:[]};window.shadowPremature=false;const main=document.querySelector('main'),d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(main,'innerHTML',{configurable:true,get(){return d.get.call(this)},set(value){if(value.includes('data-sy-result')&&!s.broad.drafts.shadowWaiting.knownFact)shadowPremature=true;d.set.call(this,value)}});window.shadowExposureCalls=[];}''')
   action(q,'compare')
   ok(q.evaluate('shadowHarness.book.broad.drafts.shadowWaiting.knownFact===true&&shadowHarness.book.broad.drafts.shadowWaiting.attempts.length===0&&!shadowPremature&&shadowExposureCalls.some(x=>x.normalize===false&&x.pairs.some(p=>p[0]===1&&p[1]===6))'),'actual app qualifies waiting fact before result DOM, without attempt')
   # An already shown comparison must qualify newly pending facts on rerender.
   q.evaluate('''()=>{shadowHarness.book.broad.drafts.shadowWaiting={question:{fact:[1,6]},attempts:[]};shadowPremature=false;shadowHarness.ctx.render();}''')
   ok(q.evaluate('shadowHarness.book.broad.drafts.shadowWaiting.knownFact===true&&!shadowPremature'),'new pending fact is qualified before repeated comparison render')
   action(q,'clear');select(q,'courtyard');set_height(q,6)
   q.evaluate('''()=>{const s=shadowHarness.book;s.broad.drafts.refusedShadow={question:{fact:[2,9]},attempts:[]};s.syntheticByteBoundary='';const candidate=structuredClone(s);shadowHarness.ctx.exposeFacts([[2,9],[6,3]],candidate);const bytes=new TextEncoder().encode(JSON.stringify(candidate,null,2)).length;s.syntheticByteBoundary='x'.repeat(5*1024*1024-bytes-100);window.shadowReportCalls=0;}''')
   raw=q.evaluate('JSON.stringify(shadowHarness.book)');old=q.locator('[data-sy-action=more]').element_handle();action(q,'compare')
   ok(q.locator('[data-sy-action=retry]').count()==1 and not q.locator('[data-sy-result],[data-sy-diagram],[data-speak]').count(),'real Notes refusal withholds numerical result, SVG and Hear payload')
   ok(q.evaluate('JSON.stringify(shadowHarness.book)')==raw and q.evaluate('shadowReportCalls>0&&shadowReportResult===false'),'real Notes byte boundary refuses without notebook changes')
   old.evaluate('e=>e.click()');action(q,'retry');ok(q.locator('[data-sy-action=retry]').count()==1,'obsolete edit is inert and unchanged retry stays refused')
   q.evaluate('delete shadowHarness.book.syntheticByteBoundary');action(q,'retry');ok(height(q)==6 and 'ratios agree' in text(q),'successful retry commits exact requested proposal and comparison')
   ok(q.evaluate('shadowHarness.book.broad.drafts.refusedShadow.knownFact===true&&shadowHarness.book.broad.drafts.refusedShadow.attempts.length===0'),'retry creates given-help qualification without attempt')
   # Back and reentry preserve a refused request without disclosing its arithmetic.
   action(q,'example')
   q.evaluate('''()=>{const s=shadowHarness.book;s.broad.drafts.refusedExample={question:{fact:[3,6]},attempts:[]};s.syntheticByteBoundary='';const candidate=structuredClone(s);shadowHarness.ctx.exposeFacts([[3,6]],candidate);const bytes=new TextEncoder().encode(JSON.stringify(candidate,null,2)).length;s.syntheticByteBoundary='x'.repeat(5*1024*1024-bytes-100);}''')
   action(q,'step-2');ok(q.locator('[data-sy-pending]').count()==1,'worked example uses the real Notes gate')
   anchor=q.locator('[data-sy-notes]').element_handle();action(q,'return');enter(q)
   ok(q.locator('[data-sy-pending]').count()==1 and '3 × 6 = 18' not in q.locator('[data-shadow-yard-root]').inner_html(),'Back and reentry retain the refused request without disclosing it')
   nav=anchor.evaluate('''e=>{document.querySelector('main').append(e);const event=new MouseEvent('click',{bubbles:true,cancelable:true});e.dispatchEvent(event);e.remove();return{prevented:event.defaultPrevented,hash:location.hash}}''')
   ok(nav=={'prevented':True,'hash':'#workshop/copy-frame'},'retired real Notes anchor cancels default navigation after new binding')
   q.evaluate('delete shadowHarness.book.syntheticByteBoundary');action(q,'retry');ok('3 × 6 = 18' in text(q),'retry after Back uses the same elected example step');action(q,'build')
   # Real storage failure: write throws, feature must report the returned failure.
   action(q,'clear');select(q,'garden');set_height(q,2)
   q.evaluate('''()=>{shadowHarness.book.broad.drafts.saveFailure={question:{fact:[4,3]},attempts:[]};window.shadowOriginalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Synthetic quota','QuotaExceededError')}}''')
   action(q,'compare');ok('not saved on this device' in text(q),'actual storage failure produces session-only help notice')
   q.evaluate('()=>{Storage.prototype.setItem=window.shadowOriginalSet;}')
   ok(not errors,'no JavaScript errors: '+str(errors))
   for c in contexts:c.close()
   browser.close()
 finally:server.shutdown()
 print(f'Shadow Yard native: {checks} checks passed; artifacts {OUT}')

if __name__=='__main__':main()
