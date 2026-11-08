"""Spring Bench 429 in the actual app, using invented notebooks and local voices.
One complete tablet journey; bounded responsive, ownership and retirement probes.
Synthetic DOM composition events exercise entry guards, not physical IME support.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, importlib.util, json, os, re, tempfile, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location('spring_fixture', ROOT/'test/force-sketch-browser.py')
fs = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(fs)
OUT = Path(os.environ.get('SPRING_BENCH_ARTIFACTS') or tempfile.mkdtemp(prefix='spring-bench-'))
OUT.mkdir(parents=True, exist_ok=True); fs.OUT = OUT
ok, book, snapshot, dispatch = fs.ok, fs.book, fs.snapshot, fs.dispatch
CASES = {'A':(6,[6,8,10,12]), 'B':(8,[8,9,10,11]), 'C':(6,[6,7,9,12]), 'D':(6,[6,8,10,12,15])}

def sel(name,value=None):return '[data-sb-'+name+('="'+str(value)+'"' if value is not None else '')+']'
def action(p,name):p.locator(sel('action',name)).click()
def choose(p,name,value):p.locator(sel(name)).select_option(str(value))
def focus(p,s):ok(p.locator(s).evaluate('e=>e===document.activeElement'),'focus reaches '+s)
def enter(p):
 if not p.locator(sel('root')).count():p.locator(sel('entry')).click()
 p.locator(sel('root')).wait_for()
def ready(p):
 p.locator('[data-sb-entry],[data-sb-root],[data-select-explorer="explorer-1"],[data-select-explorer="explorer-2"]').first.wait_for()
 for owner in ['explorer-1','explorer-2']:
  q=p.locator('[data-select-explorer="'+owner+'"]')
  if q.count() and q.is_visible():q.click();break
 p.locator('[data-sb-entry],[data-sb-root]').first.wait_for()
def back_science(p):p.evaluate('location.hash="#learn/science"');ready(p)
def parent(p):p.locator(sel('parent')).click();p.locator(sel('entry')).wait_for()
def text(p):return p.locator(sel('root')).inner_text()
def setup(browser,base,width=820,height=1000,extra=''):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':key,'avatar':avatar,'color':color,'symbol':symbol,'createdAt':'2026-11-07T12:00:00Z'} for key,avatar,color,symbol in [('explorer-1','sky','blue','leaf'),('explorer-2','fern','gold','acorn')]]}
 seed=fs.fixture("s.springBench={version:987,unknown:{preserve:['opaque',4]}};"+extra)
 c.add_init_script("""(d=>{if(!localStorage.getItem('spring-bench-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem('number-garden-v1:'+e.id,JSON.stringify(d.seed));localStorage.setItem('spring-bench-fixture','1');}window.fsSpeech={speak:0,cancel:0,texts:[]};window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};const s=window.speechSynthesis;if(s){s.getVoices=()=>[{name:'Synthetic English',lang:'en-US',localService:true,voiceURI:'synthetic'}];s.speak=u=>{fsSpeech.speak++;fsSpeech.texts.push(u.text);};s.cancel=()=>fsSpeech.cancel++;}})("""+json.dumps({'registry':registry,'seed':seed})+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body
  route.fulfill(response=response,body=body.replace('let graph=null,','window.__forceBook=()=>structuredClone(state);let graph=null,',1))
 c.route('**/app.mjs',app)
 p=c.new_page();p.set_default_timeout(15000)
 p.on('pageerror',lambda e:fs.errors.append(str(e)))
 p.on('console',lambda m:fs.errors.append(m.text) if m.type=='error' else None)
 p.on('response',lambda r:fs.errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None)
 p.goto(base+'#learn/science',wait_until='networkidle');ready(p)
 start=p.locator('[data-motion-start="design"]')
 if not p.locator('[data-motion-field="explanation"]').count() and start.count():
  start.click();p.locator('[data-motion-field="explanation"]').fill('A fictional waiting explanation.')
  ok(book(p)['motionEvidence']['lessons']['design']['drafts']['explanation']=='A fictional waiting explanation.','actual parent creates synthetic waiting writing')
 return c,p

def hear(p):
 p.locator('[data-sb-root] [data-speak]').click()
 ok(p.evaluate('fsSpeech.speak')>0,'actual local speech invoked')
 return p.evaluate('fsSpeech.texts.at(-1)')

def line(p,kind,expected):
 q=p.locator(sel('bracket',kind))
 ok(q.count()==1 and q.evaluate('e=>[+e.getAttribute("x1"),+e.getAttribute("x2")]')==expected,kind+' bracket uses original unloaded endpoint')

def diagram(p,length,l0,mark=None,reference=False):
 points=p.locator(sel('coil')).get_attribute('points').strip().split()
 ends=[float(points[0].split(',')[0]),float(points[-1].split(',')[0])]
 ok(ends==[44,44+26*length],'actual coil endpoints encode current length')
 ok(float(p.locator(sel('original')).get_attribute('x1'))==44+26*l0,'original marker remains at unloaded end')
 if mark is None:ok(p.locator(sel('bracket','proposal')+','+sel('zero','proposal')).count()==0,'no mark is distinct from zero')
 elif mark==0:ok(p.locator(sel('zero','proposal')).count()==1,'zero mark has point geometry')
 else:line(p,'proposal',[44+26*l0,44+26*(l0+mark)])
 if reference:
  if length==l0:ok(p.locator(sel('zero','reference')).count()==1,'zero reference has point geometry')
  else:line(p,'reference',[44+26*l0,44+26*length])
 else:ok(p.locator(sel('bracket','reference')+','+sel('zero','reference')).count()==0,'reference geometry waits for request')

def position(locator):return [float(n) for n in re.findall(r'-?\d+(?:\.\d+)?',locator.get_attribute('transform'))]

def plot(p,case,axis='extension',released=None,mark=None,current=0):
 l0,values=CASES[case]
 rows=p.locator(sel('table')+' tr[data-force]')
 ok(rows.count()==len(values),'complete supplied loading table')
 for force,length in enumerate(values):
  cells=rows.nth(force).locator('td,th').all_text_contents()
  nums=[float(re.search(r'-?\d+(?:\.\d+)?',v).group()) for v in cells]
  ok(nums==[force,length,length-l0],case+' independent F,L,x table row')
  pt=p.locator(sel('point','loading')+'[data-force="'+str(force)+'"]')
  value=length if axis=='length' else length-l0
  ok(position(pt)==[80+110*force,330-13*value],'independent loading point coordinates')
  ok(pt.locator('circle').count()==1,'loading readings use circles')
 squares=p.locator(sel('point','release'));released_rows=p.locator(sel('released'))
 if released is None:ok(squares.count()==0 and released_rows.count()==0,'no future unloading rows or points')
 else:
  value=released if axis=='length' else released-l0
  ok(squares.count()==1 and position(squares)==[80,330-13*value],'separate current zero-pull release point')
  ok(squares.locator('rect,polygon').count()==1 and released_rows.count()==1,'unloading has square and separate current row')
  nums=[float(re.search(r'-?\d+(?:\.\d+)?',v).group()) for v in released_rows.locator('th,td').all_text_contents() if re.search(r'-?\d+(?:\.\d+)?',v)]
  ok(nums[-3:]==[0,released,released-l0],'released reading retains original reference')
 triangle=p.locator(sel('point','proposal'))
 if mark is None:ok(triangle.count()==0,'no proposal point before mark')
 else:
  value=mark+l0 if axis=='length' else mark
  ok(position(triangle)==[80+110*current,330-13*value] and triangle.locator('polygon,path').count()==1,'distinct proposal triangle uses current force and selected quantity')

def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal viewport overflow')
 bad=p.locator('[data-sb-root] button,[data-sb-root] select,[data-sb-root] a,[data-sb-root] summary').evaluate_all("xs=>xs.filter(e=>e.getClientRects().length&&(e.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent,height:e.getBoundingClientRect().height,font:getComputedStyle(e).fontSize}))")
 ok(not bad,'native targets >=44px and text >=16px: '+str(bad))
 for svg in p.locator('[data-sb-diagram],[data-sb-plot]').all():
  ok(svg.evaluate('e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1}'),'diagram or plot fits viewport')

def rejected(p,handle,label):
 before=p.locator(sel('root')).inner_html();speech=p.evaluate('JSON.stringify(fsSpeech)');saved=snapshot(p)
 dispatch(handle)
 ok(p.locator(sel('root')).inner_html()==before and snapshot(p)==saved and p.evaluate('JSON.stringify(fsSpeech)')==speech,label+' is inert and silent')

def parent_guards(p):
 field=p.locator('[data-motion-field="explanation"]');root=p.locator('[data-motion-root]').element_handle();saved=book(p)
 field.evaluate("e=>{e.value='x'.repeat(1201);e.dispatchEvent(new Event('input',{bubbles:true}));}")
 p.locator(sel('entry')).click()
 ok(not p.locator(sel('root')).count() and len(field.input_value())==1201 and book(p)==saved,'dirty-field refusal preserves notebook and words')
 field.fill('A fictional waiting explanation.')
 for intermediate in [False,True]:
  field.dispatch_event('compositionstart')
  if intermediate:field.fill('An invented intermediate composition.')
  before=book(p);value=field.input_value()
  for entry in ['[data-sb-entry]','[data-fs-entry]','[data-motion-push-drift]']:
   p.locator(entry).click()
   ok(not p.locator('[data-sb-root],[data-fs-root],[data-pd-root]').count() and field.input_value()==value and book(p)==before,'composition blocks each native child entry without losing words')
   ok(p.locator('[data-motion-root]').evaluate('(e,r)=>e===r',root),'refusal retains exact parent root')
  field.dispatch_event('compositionend');field.fill('A fictional waiting explanation.')
  enter(p);parent(p);field=p.locator('[data-motion-field="explanation"]');root=p.locator('[data-motion-root]').element_handle()
 saved=book(p);field.evaluate("e=>{e.value='An unsaved final composition value.';}");p.locator(sel('entry')).click()
 ok(not p.locator(sel('root')).count() and field.input_value()=='An unsaved final composition value.' and book(p)==saved,'DOM text mismatch blocks entry without adopting words')
 field.fill('A fictional waiting explanation.')

def journey(browser,base):
 print('Spring Bench: one actual-app tablet journey and independent model geometry',flush=True)
 c,p=setup(browser,base)
 try:
  p.locator('[data-fs-entry]').click();fs.draw(p,'weight','down',6);p.locator('[data-fs-back]').click()
  p.locator('[data-motion-push-drift]').click();p.locator('[data-pd-force]').last.click()
  prior_force=p.locator('[data-pd-force][aria-pressed="true"]').get_attribute('data-pd-force');p.locator('[data-pd-back]').click()
  parent_guards(p);initial_notes=fs.export(p,'before-spring');back_science(p);before=snapshot(p)
  old_parent=p.locator('[data-motion-root]').element_handle();old_push=p.locator('[data-motion-push-drift]').element_handle()
  enter(p);layout(p);diagram(p,6,6)
  speech=hear(p)
  ok('Reference extension' not in speech and 'Each extra newton' not in speech and '7−5' not in speech,'closed trial narration has no hidden reference or example answers')
  p.evaluate('(e)=>document.querySelector("main").append(e)',old_parent);rejected(p,old_push,'retained parent child launcher');old_parent.evaluate('e=>e.remove()')
  p.locator(sel('action','add')).focus();p.keyboard.press('Enter');focus(p,sel('action','increase'));diagram(p,6,6,0)
  zero=p.locator(sel('action','decrease')).element_handle();rejected(p,zero,'decrease at zero')
  p.locator(sel('action','increase')).focus();p.keyboard.press('Space');diagram(p,6,6,.5)
  action(p,'clear');focus(p,sel('action','undo'));diagram(p,6,6)
  action(p,'undo');diagram(p,6,6,.5)
  action(p,'clear');action(p,'undo');action(p,'decrease');action(p,'undo');diagram(p,6,6,.5)
  action(p,'clear');action(p,'undo');action(p,'clear');action(p,'undo');action(p,'fresh');focus(p,sel('force'))
  action(p,'add');action(p,'undo');focus(p,sel('action','add'));diagram(p,6,6)
  action(p,'add')
  for _ in range(20):action(p,'increase')
  diagram(p,6,6,10);rejected(p,p.locator(sel('action','increase')).element_handle(),'increase at upper bound')
  action(p,'undo');diagram(p,6,6,9.5);action(p,'fresh')
  choose(p,'force',0);action(p,'apply');diagram(p,6,6);ok('Zero-pull reading' in text(p),'selected zero pull is a valid loaded trial')
  action(p,'release');diagram(p,6,6);ok('Zero-pull test finished' in text(p),'zero-pull trial has a separate released phase');action(p,'fresh')
  # Each case uses its maximum offered pull. All loaded readings are independently
  # checked in plots; A/B at 2 N is also inspected as a same-length contrast.
  for case in CASES:
   choose(p,'case',case);l0,values=CASES[case];force=len(values)-1
   if case in ['A','B']:
    choose(p,'force',2);action(p,'apply');diagram(p,10,l0)
    action(p,'compare');diagram(p,10,l0,reference=True);action(p,'hide');diagram(p,10,l0)
    action(p,'fresh')
   choose(p,'force',force);action(p,'add');action(p,'increase');held_apply=p.locator(sel('action','apply')).element_handle();action(p,'apply');focus(p,sel('action','release'));diagram(p,values[-1],l0,.5)
   rejected(p,held_apply,'repeat application')
   disabled=p.locator(sel('force')).element_handle()
   disabled.evaluate('e=>{e.value="0";e.dispatchEvent(new Event("change",{bubbles:true}));}')
   # The activity may leave a disabled DOM select's synthetic value alone; the
   # settled spring and immutable test pull remain the independent evidence.
   diagram(p,values[-1],l0,.5)
   action(p,'plots');plot(p,case,mark=.5,current=force);layout(p)
   if case=='A':
    p.locator('[data-sb-root] details').filter(has=p.locator('summary',has_text='Numbers and units')).locator('summary').click()
    spoken=hear(p)
    ok('newtons per centimeter' in spoken and 'centimeters per newton' in spoken and 'times' in spoken and 'equals' in spoken,'opened unit relationships speak units and mathematical operations meaningfully')
    ok('N/cm' not in spoken and 'cm/N' not in spoken,'unit narration does not leave slash abbreviations')
   p.locator(sel('axis','length')).click();plot(p,case,'length',mark=.5,current=force)
   p.locator(sel('axis','extension')).click();action(p,'trial');focus(p,sel('action','plots'))
   action(p,'release');focus(p,sel('action','fresh'));released=7 if case=='D' else l0;diagram(p,released,l0,.5)
   ok(p.locator(sel('reference')).count()==0,'release hides requested comparison')
   action(p,'compare');diagram(p,released,l0,.5,True)
   if case=='C':ok('permanent' in text(p).lower(),'nonlinear elastic comparison is available')
   if case=='D':ok('1 cm' in text(p) and '7 cm' in text(p),'retained extension compares with original six-centimeter reference')
   action(p,'plots');plot(p,case,released=released,mark=.5)
   if case=='D':p.screenshot(path=str(OUT/'released-d-plots-820.png'),full_page=True)
   action(p,'trial');action(p,'hide')
  # Case work survives changing case and actual parent Back/reopen.
  choose(p,'case','A');diagram(p,6,6,.5);choose(p,'case','D');diagram(p,7,6,.5)
  action(p,'plots');p.locator(sel('axis','length')).click();action(p,'example')
  previous=p.locator(sel('action','previous'));ok(previous.is_disabled(),'first example frame has no previous')
  for index,(length,mark,ref) in enumerate([(5,None,False),(7,None,False),(7,7,False),(7,2,True),(5,None,True)]):
   diagram(p,length,5,mark,ref);spoken=hear(p)
   ok(str(length) in spoken,'current example frame is narrated')
   if index<4:action(p,'next')
  ok(p.locator(sel('action','next')).is_disabled(),'fifth example frame ends manual sequence')
  action(p,'back');focus(p,sel('action','example'));plot(p,'D','length',released=7,mark=.5)
  action(p,'trial');parent(p)
  ok(p.locator('[data-motion-field="explanation"]').input_value()=='A fictional waiting explanation.','actual parent words preserved')
  p.locator('[data-fs-entry]').click();ok(p.locator('[data-fs-row]').count()==1,'existing Force Sketch proposal survives Spring Bench');p.locator('[data-fs-back]').click()
  p.locator('[data-motion-push-drift]').click();ok(p.locator('[data-pd-force][aria-pressed="true"]').get_attribute('data-pd-force')==prior_force,'existing Push and Drift program survives Spring Bench');p.locator('[data-pd-back]').click()
  enter(p);diagram(p,7,6,.5);action(p,'plots');plot(p,'D','length',released=7,mark=.5);action(p,'trial')
  ok(snapshot(p)==before,'all trials leave actual notebook and both storage areas exact')
  notes=fs.export(p,'after-spring')
  ok({k:v for k,v in notes.items() if k!='exportedAt'}=={k:v for k,v in initial_notes.items() if k!='exportedAt'},'actual Notes download unchanged apart from timestamp, including opaque springBench root')
 finally:c.close()

def voice_layout(p,label):
 controls=p.locator('.speech-controls');ok(controls.is_visible(),'shared local voice controls visible '+label)
 controls.locator('.voice-settings>summary').click()
 layout(p)
 contrasts=controls.evaluate("""root=>{
 const rgb=s=>(s.match(/[\\d.]+/g)||[]).map(Number),lum=a=>a.slice(0,3).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4}).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);
 return [...root.querySelectorAll('button,label,select,summary,[role=status],.tiny')].filter(e=>e.getClientRects().length).map(e=>{let q=e,b;while(q){b=rgb(getComputedStyle(q).backgroundColor);if(b.length===3||b[3]>0)break;q=q.parentElement;}const a=lum(rgb(getComputedStyle(e).color)),z=lum(b||[255,255,255]);return {text:e.textContent.slice(0,40),ratio:(Math.max(a,z)+.05)/(Math.min(a,z)+.05)};});
 }""")
 ok(all(x['ratio']>=4.5 for x in contrasts),'voice text contrast >=4.5 '+label+': '+str(contrasts))
 p.screenshot(path=str(OUT/(label+'.png')),full_page=True)
 controls.locator('.voice-settings>summary').click()

def responsive(browser,base):
 print('Spring Bench: bounded phone/desktop released geometry, plots and voice',flush=True)
 for width,height in [(320,700),(1024,768)]:
  c,p=setup(browser,base,width,height)
  try:
   enter(p);choose(p,'case','D');choose(p,'force',4);action(p,'apply');action(p,'release');action(p,'add');action(p,'increase');action(p,'compare')
   diagram(p,7,6,.5,True);layout(p);hear(p);voice_layout(p,'released-d-playing-'+str(width))
   p.locator('[data-stop-speech]').click();voice_layout(p,'released-d-stopped-'+str(width))
   action(p,'plots');plot(p,'D',released=7,mark=.5);layout(p);p.screenshot(path=str(OUT/f'released-d-plots-{width}.png'),full_page=True)
   p.locator(sel('axis','length')).click();plot(p,'D','length',released=7,mark=.5);layout(p)
   action(p,'trial');choose(p,'case','B');action(p,'add')
   for _ in range(20):action(p,'increase')
   diagram(p,8,8,10);layout(p)
  finally:c.close()

def retirement(browser,base):
 print('Spring Bench: retained root/control/material/view/frame/axis ownership',flush=True)
 c,p=setup(browser,base)
 try:
  enter(p)
  for mutation,label in [
   ('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)}','removed and reinserted control'),
   ('e=>{e.hidden=true;e.hidden=false}','hidden and restored control'),
   ('e=>{e.setAttribute("aria-hidden","true");e.removeAttribute("aria-hidden")}','aria-hidden restored control'),
   ('e=>{e.inert=true;e.inert=false}','inert restored control'),
   ('e=>{e.style.display="none";e.style.display=""}','style restored control'),
   ('e=>{e.classList.add("temporary-retired");e.classList.remove("temporary-retired")}','class restored control'),
   ('e=>{const p=e.parentNode,n=e.nextSibling,w=document.createElement("div");p.insertBefore(w,e);w.append(e);p.insertBefore(e,n);w.remove()}','reparented and restored control')]:
   old=p.locator(sel('action','add')).element_handle();old.evaluate(mutation);rejected(p,old,label)
   parent(p);enter(p)
  oldroot=p.locator(sel('root')).element_handle();old=p.locator(sel('action','add')).element_handle()
  oldroot.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)}');rejected(p,old,'removed and reinserted root')
  # A retired root's own Back is intentionally dead: leave via actual routing.
  p.evaluate('location.hash="#notes"');p.locator('#download').wait_for();back_science(p);enter(p)
  held=p.locator(sel('action','add')).element_handle();choose(p,'case','B');rejected(p,held,'old material control');choose(p,'case','A');rejected(p,held,'old case control after lookalike restoration')
  held=p.locator(sel('action','add')).element_handle();action(p,'plots');rejected(p,held,'old trial control on plots')
  held_axis=p.locator(sel('axis','length')).element_handle();p.locator(sel('axis','length')).click();rejected(p,held_axis,'old axis control after axis change')
  frame_launcher=p.locator(sel('action','example')).element_handle();action(p,'example');held_next=p.locator(sel('action','next')).element_handle();action(p,'next');rejected(p,held_next,'old example frame control');rejected(p,frame_launcher,'old plot launcher on example')
  action(p,'previous');rejected(p,held_next,'old frame control after restoring example frame');action(p,'back');action(p,'trial');held=p.locator(sel('action','add')).element_handle();held_root=p.locator(sel('root')).element_handle()
  p.evaluate('location.hash="#learn/science/balanced"');p.locator(sel('entry')).wait_for();p.evaluate('(e)=>document.querySelector("main").append(e)',held_root);dispatch(held);held_root.evaluate('e=>e.remove()')
  enter(p);diagram(p,6,6);ok(book(p)['motionEvidence']['currentId']=='design','route ownership does not rewrite parent waiting lesson')
  action(p,'add');parent(p);back_science(p);enter(p);diagram(p,6,6,0)
 finally:c.close()

def recovery(browser,base):
 print('Spring Bench: historical drafts, opaque roots, real owner/import/reset/reload',flush=True)
 c,p=setup(browser,base,extra="s.motionEvidence={version:987,future:{raw:'preserve'}}")
 try:
  saved=snapshot(p);enter(p);action(p,'add');parent(p);ok(snapshot(p)==saved,'opaque parent and unknown springBench data remain untouched')
 finally:c.close()
 # Create historical CRLF in an otherwise valid real parent save before loading.
 c,p=setup(browser,base,extra="const motion=await import('./dist/motion-evidence-core.mjs');motion.startMotion(s,'design',{canExport:()=>true});s.motionEvidence.lessons.design.drafts.explanation='An invented first line.\\r\\nAn invented second line.\\rThird line.'")
 try:
  saved=book(p);before=fs.export(p,'historical-before');back_science(p)
  ok(p.locator('[data-motion-field="explanation"]').input_value()=='An invented first line.\nAn invented second line.\nThird line.','textarea renders historical line endings normally')
  ok(saved['motionEvidence']['lessons']['design']['drafts']['explanation']=='An invented first line.\r\nAn invented second line.\rThird line.','fixture retains raw historical CRLF and CR')
  enter(p);parent(p);enter(p);ok(book(p)==saved,'historical CRLF draft neither blocks entry nor gets rewritten')
  after=fs.export(p,'historical-after');ok({k:v for k,v in before.items() if k!='exportedAt'}=={k:v for k,v in after.items() if k!='exportedAt'},'historical raw draft survives actual Notes download')
 finally:c.close()
 c,p=setup(browser,base)
 try:
  enter(p);action(p,'add');held=p.locator(sel('action','increase')).element_handle()
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();ready(p);enter(p);diagram(p,6,6);rejected(p,held,'old explorer control')
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-1"]').click();ready(p);enter(p);diagram(p,6,6,0)
  held=p.locator(sel('action','increase')).element_handle();p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();back_science(p);enter(p);saved=snapshot(p);action(p,'increase');ok(snapshot(p)==saved,'saving-off spring work does not write notebook or storage')
  p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click()
  if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').click()
  back_science(p);enter(p);diagram(p,6,6);rejected(p,held,'pre-reset notebook control')
  action(p,'add');p.reload(wait_until='networkidle');ready(p);enter(p);diagram(p,6,6)
 finally:c.close()
 c,p=setup(browser,base)
 try:
  enter(p);action(p,'add');held=p.locator(sel('action','increase')).element_handle();incoming=fs.fixture("s.syntheticSibling.literal='another invented notebook';s.springBench={future:{opaque:[9]}}")
  p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-spring-notebook.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();back_science(p);enter(p);diagram(p,6,6);rejected(p,held,'pre-import notebook control')
 finally:c.close()

def main():
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
   try:
    if os.environ.get('SPRING_BENCH_PROBE'):
     {'journey':journey,'responsive':responsive,'retirement':retirement,'recovery':recovery}[os.environ['SPRING_BENCH_PROBE']](browser,base)
    else:journey(browser,base);responsive(browser,base);retirement(browser,base);recovery(browser,base)
   finally:browser.close()
  ok(not fs.errors,'no page, console or HTTP errors: '+str(fs.errors));print(f'{fs.checks} Spring Bench browser assertions passed. Artifacts: {OUT}',flush=True)
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
