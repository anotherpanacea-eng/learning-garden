"""Two Threads387: actual-app reading order, English lifecycle and Notes recovery.

One full tablet journey and narrow phone/wide samples use ordinary app modules.
Explicitly isolated actual-UI harnesses cover refused parent edits and external
context faults. Synthetic notebooks/device speech only; no physical Apple,
audible-output, independent-reading or learning qualification.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('TWO_THREADS_ARTIFACTS') or tempfile.mkdtemp(prefix='two-threads-'));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('thread_notes_helpers',ROOT/'test/writing-table-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h);h.OUT=OUT
ROUTE='#learn/english'
def fixture():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{startEvidenceVoice,setEvidenceText,setEvidenceAnnotationDraft}from'./dist/evidence-voice-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={payload:'z'.repeat(512000),exact:{v:75}};const o={canExport:()=>true};startEvidenceVoice(s,'clock-river',{...o,lesson:'write'});setEvidenceText(s,'paragraph','A retained synthetic paragraph for another reader.',o);setEvidenceAnnotationDraft(s,{anchor:'c1-p3',kind:'question',text:'A retained synthetic question.',futureAnnotation:{keep:true}},o);console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
def sel(k,v=None):return '[data-tt-'+k+('="'+str(v)+'"' if v is not None else '')+']'
def click(p,k,v=None):p.locator(sel(k,v)+':visible').first.click()
def setup(browser,base,seed,width=820,route='#learn/english/write'):
 c,p=h.setup(browser,base,seed,width=width);p.evaluate('(s)=>location.hash=s',route);p.locator('[data-ev-threads]').wait_for();return c,p
def enter(p):p.locator('[data-ev-threads]').click();p.locator(sel('root')).wait_for()
def sheets(p):return h.book(p).get('threadReadings',[])
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('[data-tt-root] button,[data-tt-root] select,[data-tt-root] summary,[data-tt-root] a').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'visible controls have44px targets and16px text: '+str(bad))
 bad=p.locator('[data-tt-root] p,[data-tt-root] li,[data-tt-root] th,[data-tt-root] td').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)')
 h.ok(not bad,'scene text and map labels remain16px: '+str(bad))
SPEECH_FIXTURE="""()=>{window.ttSpoken=[];window.ttStops=0;Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{name:'Synthetic local English',voiceURI:'synthetic-en',lang:'en-US',localService:true,default:true}],cancel:()=>window.ttStops++,speak:u=>window.ttSpoken.push(u.text),addEventListener(){},removeEventListener(){}}});Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text;}}});}"""
def hear(p,selector='[data-tt-hear]'):
 before=p.evaluate('ttSpoken.length');p.locator(selector).click();payload=p.locator(selector).get_attribute('data-speak');h.ok(p.evaluate('ttSpoken.length')>before,'Hear requests the labelled synthetic device speech API');return payload
def order(p):return p.locator('[data-tt-order] [data-tt-scene]').evaluate_all('xs=>xs.map(x=>x.dataset.ttScene)')
def scene(p,id):
 if not p.locator(sel('scene',id)+':visible').count():p.locator('[data-tt-contents]>summary').click()
 p.locator(sel('scene',id)+':visible').first.click()
def move(p,d,n=1):
 for _ in range(n):click(p,'move',d)
def fold(p,id,opened=True):
 d=p.locator(sel('fold',id))
 if (d.get_attribute('open') is not None)!=opened:d.locator(':scope>summary').click()
def maps(p,scope,expected):
 for id,(positions,returns) in expected.items():
  root=p.locator(sel('map',scope)+' '+sel('thread',id));actual=root.locator(sel('positions',id)).inner_text();import re
  h.ok([int(n) for n in re.findall(r'\d+',actual)]==positions,scope+' '+id+' supplied membership positions')
  actual=root.locator('[data-tt-return]').evaluate_all('xs=>xs.map(x=>[+x.dataset.ttFrom,+x.dataset.ttTo,+x.dataset.ttGap])');h.ok(actual==returns,scope+' '+id+' exact intervening-scene returns')
def open_sheet(p,id):
 click(p,'shelf')
 for _ in range(5):
  if p.locator(sel('card',id)).count():click(p,'card',id);return
  prev=p.locator(sel('page',-1))
  if not prev.count() or prev.is_disabled():break
  prev.click()
 raise AssertionError('Missing kept reading '+id)
GROUPED=['a1','a2','a3','b1','b2','b3','together']
AUTHOR=['a1','b1','a2','b2','a3','b3','together']

def journey(browser,base,seed):
 print('Two Threads: ordinary app complete tablet journey',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(SPEECH_FIXTURE);before=copy.deepcopy(h.book(p));enter(p)
  h.ok('threadReadings' not in h.book(p) and order(p)==GROUPED,'entry creates no saved root and shows the supplied arrangement');bounds(p);initial_speech=hear(p)
  fold(p,'map');maps(p,'current',{'leena':([1,2,3,7],[[3,7,3]]),'rowan':([4,5,6,7],[])})
  scene(p,'b1');move(p,-1,2);h.ok(p.locator('[data-tt-scene-panel]').get_attribute('data-tt-selected')=='b1','moving a scene preserves selected text by ID');scene(p,'b2');move(p,-1);h.ok(order(p)==AUTHOR,'actual moves construct the alternating writer order without rewriting any scene')
  click(p,'reference');maps(p,'author',{'leena':([1,3,5,7],[[1,3,1],[3,5,1],[5,7,1]]),'rowan':([2,4,6,7],[[2,4,1],[4,6,1]])});maps(p,'current',{'leena':([1,3,5,7],[[1,3,1],[3,5,1],[5,7,1]]),'rowan':([2,4,6,7],[[2,4,1],[4,6,1]])})
  scene(p,'together');button=p.locator(sel('move',-1));button.focus();p.keyboard.press('Enter');move(p,-1,5);h.ok(order(p)[0]=='together' and button.is_disabled() and p.locator(sel('move',1)).evaluate('e=>e===document.activeElement'),'moving the shared ending first is allowed and boundary focus goes to the enabled direction')
  fold(p,'map');maps(p,'current',{'leena':([1,2,4,6],[[2,4,1],[4,6,1]]),'rowan':([1,3,5,7],[[1,3,1],[3,5,1],[5,7,1]])})
  fold(p,'teaching');click(p,'teach');click(p,'teach');click(p,'frame',1);maps(p,'demo',{'jo':([1,2,5],[[2,5,2]]),'ari':([3,4,5],[])});click(p,'frame',2);maps(p,'demo',{'jo':([1,3,5],[[1,3,1],[3,5,1]]),'ari':([2,4,5],[[2,4,1]])})
  click(p,'keep');first=copy.deepcopy(sheets(p)[0]);h.ok(first['work']['order']==['together']+AUTHOR[:-1] and first['work']['referenceShown'] and first['work']['teachingSeen']==2,'Keep freezes the chosen nonchronological reading order and elected support')
  click(p,'turn','read');click(p,'start');source=first['source'];h.ok(source['writerNote'] not in initial_speech and source['teaching'][0]['text'] not in initial_speech,'unopened writer commentary and teaching never leak through initial Hear')
  for i,id in enumerate(first['work']['order']):
   h.ok(p.locator('[data-tt-scene-panel]').get_attribute('data-tt-selected')==id and p.locator('[data-tt-scene-panel] [data-tt-paragraph]').all_text_contents()==next(s['paragraphs'] for s in source['scenes'] if s['id']==id),'paged reader exposes the complete own-source scene '+id)
   if i<6:click(p,'next')
  h.ok(p.locator(sel('next')).is_disabled(),'the full reader has a real final boundary')
  scene(p,'a1');fold(p,'teaching',False);payload=hear(p)
  h.ok(source['scenes'][0]['paragraphs'][0] in payload and next(s for s in source['scenes'] if s['id']=='b1')['paragraphs'][0] not in payload and source['teaching'][0]['text'] not in payload,'Hear reads the selected full scene without hidden other scenes or closed teaching')
  fold(p,'teaching');payload=hear(p);h.ok(source['teaching'][1]['text'] in payload,'open teaching narration uses the elected own-source frame')
  h.ok(sheets(p)[0]==first,'reading, paging and narration never mutate a kept reading')
  click(p,'draft');scene(p,'b1');move(p,-1);waiting=order(p);open_sheet(p,first['id']);click(p,'copy');click(p,'turn','arrange');scene(p,'together');move(p,1);click(p,'keep');second=copy.deepcopy(sheets(p)[-1]);click(p,'draft');h.ok(order(p)==waiting,'a waiting original draft survives Keep of another copied order')
  open_sheet(p,first['id']);h.ok(p.locator(sel('copy')).inner_text()=='Work on a copy','consumed copy gets an honest fresh-copy label');h.ok(sheets(p)[0]==first and second['work']['order']!=first['work']['order'],'copy revision does not overwrite the earlier reading order')
  click(p,'back');p.locator('[data-ev-root]').wait_for();h.ok(p.evaluate('location.hash')=='#learn/english/write' and h.book(p)['evidenceVoice']==before['evidenceVoice'],'controlled Back restores the exact English route and writing')
  ret=p.locator('details[data-tt-return]');spoken=p.evaluate('ttSpoken.length');ret.locator('[data-tt-return-hear]').evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok(p.evaluate('ttSpoken.length')==spoken,'closed parent return cannot request hidden narration');ret.locator(':scope>summary').click();payload=hear(p,'[data-tt-return-hear]');h.ok(source['returnQuestion'] in payload and h.book(p)['evidenceVoice']==before['evidenceVoice'] and sheets(p)[0]==first,'separate return Hear reads its open source and never records parent audio support or child support')
  enter(p);click(p,'draft');h.ok(order(p)==waiting,'controlled Back keeps the actual waiting order')
  p.evaluate('location.hash="#learn/english/before"');p.locator('[data-ev-root]').wait_for();h.ok(not p.locator(sel('root')).count(),'an unplanned English lesson URL closes active child mode');enter(p);click(p,'draft');h.ok(order(p)==waiting,'unplanned English navigation retains the waiting order until English is left')
  click(p,'back');p.locator('[data-ev-root]').wait_for();p.evaluate('location.hash="#home"');p.wait_for_function('!document.querySelector("[data-ev-root],[data-tt-root]")');p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-threads]').wait_for();enter(p);h.ok(order(p)==GROUPED,'leaving English clears unkept constructions instead of resurrecting them')
  p.screenshot(path=str(OUT/'tablet.png'),full_page=True);after=copy.deepcopy(h.book(p));saved=after.pop('threadReadings');h.ok(after==before,'reading orders preserve the parent, facts and every large unrelated notebook root');report=h.export_notes(p,'two-threads-kept');h.ok(report['threadReadings']==saved,'actual Notes export preserves exact sources and orders');return report
 finally:c.close()

def historical(report):
 r=copy.deepcopy(report);old=copy.deepcopy(r['threadReadings'][0]);old.update(id='thread-reading-80',futureOuter={'keep':True});s=old['source'];s.update(id='earlier-source',title='Earlier <threads> & full text',threads=[{'id':'north','label':'Earlier northern thread','symbol':'dots'},{'id':'south','label':'Earlier southern thread','symbol':'stripe'}],scenes=[{'id':'q','title':'Earlier first','threadIds':['north'],'paragraphs':['Earlier first paragraph.','Earlier second paragraph.']},{'id':'r','title':'Earlier second','threadIds':['south'],'paragraphs':['Earlier other thread.']},{'id':'s','title':'Earlier shared','threadIds':['north','south'],'paragraphs':['Earlier shared ending.']}],startOrder=['q','r','s'],authorOrder=['q','s','r'],writerNote='Earlier unique writer commentary.',demo={'title':'Earlier distinct demo','threads':[{'id':'u','label':'Earlier demo U','symbol':'stripe'},{'id':'v','label':'Earlier demo V','symbol':'dots'}],'scenes':[{'id':'u1','title':'Earlier U','threadIds':['u'],'paragraphs':['An earlier U scene.']},{'id':'v1','title':'Earlier V','threadIds':['v'],'paragraphs':['An earlier V scene.']},{'id':'uv','title':'Earlier meeting','threadIds':['u','v'],'paragraphs':['An earlier shared demo scene.']}]},teaching=[{'text':'Earlier teaching one.','order':['u1','v1','uv']},{'text':'Earlier teaching two.','order':['uv','v1','u1']}],futureSource={'keep':True})
 old['work']={'v':1,'order':['s','r','q'],'referenceShown':True,'teachingSeen':2,'futureWork':{'keep':True}};r['threadReadings']=[{'id':'thread-reading-900','v':99,'raw':['kept']},old]+r['threadReadings'];return r

def transfer(browser,base,seed,report):
 print('Two Threads: actual historical Notes transfer',flush=True)
 c,p=setup(browser,base,seed)
 try:
  altered=historical(report);original=h.book(p);identity=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'synthetic-threads.json','mimeType':'application/json','buffer':json.dumps(altered).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();h.ok(p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')!=identity,'actual Notes import creates another explorer')
  p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-threads]').wait_for();enter(p);h.ok(sheets(p)==altered['threadReadings'],'own-source historical paragraphs, IDs, demo and unreadable sibling import unchanged');open_sheet(p,'thread-reading-80');click(p,'turn','read');scene(p,'q');h.ok(p.locator('[data-tt-scene-panel] [data-tt-paragraph]').all_text_contents()==['Earlier first paragraph.','Earlier second paragraph.'],'historical reader uses all own paragraphs instead of current catalog text');h.ok('Earlier <threads> & full text' in p.locator(sel('root')).inner_text() and not p.locator('[data-tt-root] threads').count(),'historical titles are escaped literal text')
  fold(p,'map');maps(p,'current',{'north':([1,3],[[1,3,1]]),'south':([1,2],[])});fold(p,'teaching');click(p,'frame',2);scene_id=p.locator('[data-tt-demo-panel]').get_attribute('data-tt-demo-selected');p.locator(sel('demo-scene','u1')).click();h.ok('An earlier U scene.' in p.locator('[data-tt-demo-panel]').inner_text() and scene_id in ['u1','v1','uv'],'historical teaching frame and selected full demo text resolve their own IDs');maps(p,'demo',{'u':([1,3],[[1,3,1]]),'v':([1,2],[])})
  old=copy.deepcopy(sheets(p)[1]);click(p,'copy');click(p,'turn','arrange');scene(p,'q');move(p,-1);click(p,'keep');new=sheets(p)[-1];h.ok(new['id']=='thread-reading-901' and new['source']==old['source'] and new['work']['order']==['s','q','r'] and new['work']['futureWork']=={'keep':True},'historical copy uses its own permutation, retains extras and respects unreadable reserved IDs');h.ok(sheets(p)[1]==old,'historical source and original order remain immutable')
  out=h.export_notes(p,'two-threads-historical');h.ok(out['threadReadings'][:-1]==altered['threadReadings'] and out['syntheticOther']==original['syntheticOther'],'actual redownload preserves original history and large unrelated Notes');h.ok(p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',identity)==original,'historical import and work leave the first explorer exact')
 finally:c.close()

def samples(browser,base,seed):
 for width in [320,1024]:
  c,p=setup(browser,base,seed,width)
  try:
   enter(p);scene(p,'b1');move(p,-1);bounds(p);click(p,'turn','read');bounds(p);p.screenshot(path=str(OUT/('phone.png' if width==320 else 'wide.png')),full_page=True)
  finally:c.close()

def storage(browser,base,seed):
 for fault in ['saving-off','quota-device-api']:
  c,p=setup(browser,base,seed)
  try:
   if fault=='saving-off':p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-threads]').wait_for()
   enter(p);scene(p,'b1');move(p,-1);before=p.evaluate('JSON.stringify(localStorage)')
   if fault=='quota-device-api':p.evaluate('()=>{Storage.prototype.setItem=function(){throw new DOMException("Synthetic quota refusal","QuotaExceededError")};}')
   click(p,'keep');h.ok(p.evaluate('JSON.stringify(localStorage)')==before,fault+' Keep does not pretend to persist failed/disabled device storage');out=h.export_notes(p,'two-threads-'+fault);h.ok(out['threadReadings'][-1]['work']['order']==['a1','a2','b1','a3','b2','b3','together'],fault+' actual Notes download recovers the kept open-page order')
  finally:c.close()

# Explicit actual-UI harness: only the preflight/context can be refused externally.
HARNESS="""async config=>{const parent=await import('./evidence-voice-ui.mjs'),media=await import('./play-media.mjs'),transfer=await import('./progress-transfer.mjs'),core=await import('./core.mjs');parent.resetEvidenceVoiceModes();history.replaceState(null,'','#learn/english/write');const main=document.querySelector('main');main.hidden=false;main.removeAttribute('aria-hidden');const v={book:structuredClone(config.seed),owner:'synthetic-owner',active:true,allow:true,saves:0,renders:0};if(config.collision){const w=v.book.evidenceVoice.units[v.book.evidenceVoice.current];w.source.lessons.find(l=>l.id===w.lesson).fields.push('annotation');w.drafts.annotation='A separate saved historical writing field.';}if(config.unavailable)v.book.evidenceVoice={version:99,raw:['kept']};v.original=v.book;const report=c=>({title:'After the Storm: observations',exportedAt:'2026-11-05T12:00:00.000Z',note:'Informal synthetic reading sample.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:core.recommendations(c),...c});v.render=()=>{v.renders++;const requested=location.hash.slice(1).split('/')[2];main.innerHTML=parent.evidenceVoicePage(v.book,requested,v.owner);parent.bindEvidenceVoice(v.book,{notebook:()=>v.book,explorerId:()=>v.owner,isActive:()=>v.active,canExport:c=>v.allow&&transfer.prepareProgressImport(JSON.stringify(report(c))).ok,save:()=>{v.saves++;return{enabled:true,ok:true}},render:v.render,focus:s=>document.querySelector(s)?.focus(),entryLesson:requested});media.bindSpeech()};window.ttHarness=v;v.render()}"""
def install(p,seed,**flags):p.evaluate(HARNESS,{'seed':seed,**flags});p.locator('[data-ev-threads]').wait_for()
def parent_work(p):return p.evaluate('ttHarness.book.evidenceVoice.units[ttHarness.book.evidenceVoice.current]')
def dirty_parent(browser,base,seed):
 print('Two Threads: isolated real-parent failed visible-writing regressions',flush=True)
 c,p=setup(browser,base,seed)
 try:
  install(p,seed);p.evaluate('ttHarness.allow=false');before=p.evaluate('JSON.stringify(ttHarness.book)');field=p.locator('[data-ev-field="paragraph"]');field.fill('These visible words could not be saved.');p.locator('[data-ev-threads]').click();h.ok(not p.locator(sel('root')).count() and field.input_value()=='These visible words could not be saved.' and p.evaluate('JSON.stringify(ttHarness.book)')==before,'a refused visible writing edit blocks entry without text or notebook loss')
  p.evaluate('ttHarness.allow=true');field.fill('These visible words now save.');enter(p);h.ok(parent_work(p)['drafts']['paragraph']=='These visible words now save.','successful writing retry permits the independent mode')
  install(p,seed);p.evaluate('ttHarness.allow=false');p.locator('[data-ev-note-anchor]').select_option('c1-p1');p.locator('[data-ev-note-kind]').select_option('literal');p.locator('[data-ev-note-text]').fill('All three visible fields must travel together.');p.locator('[data-ev-threads]').click();h.ok(not p.locator(sel('root')).count() and p.locator('[data-ev-note-anchor]').input_value()=='c1-p1' and p.locator('[data-ev-note-kind]').input_value()=='literal' and p.locator('[data-ev-note-text]').input_value()=='All three visible fields must travel together.','refused passage, kind and annotation text remain visible and block entry')
  p.evaluate('ttHarness.allow=true');p.locator('[data-ev-note-kind]').select_option('question');w=parent_work(p)['annotationDraft'];h.ok(w['anchor']=='c1-p1' and w['kind']=='question' and w['text']=='All three visible fields must travel together.' and w['futureAnnotation']=={'keep':True},'retrying a different annotation field saves every visible value and unknown saved fields');enter(p)
  install(p,seed);p.locator('[data-ev-note-text]').fill('x'*2001);p.locator('[data-ev-note-kind]').select_option('literal');p.locator('[data-ev-threads]').click();h.ok(not p.locator(sel('root')).count() and len(p.locator('[data-ev-note-text]').input_value())==2001,'a select retry cannot clear an independently invalid visible annotation text')
  install(p,seed,collision=True);p.evaluate('ttHarness.allow=false');p.locator('[data-ev-note-text]').fill('An independently refused note stays dirty.');p.evaluate('ttHarness.allow=true');p.locator('[data-ev-field="annotation"]').fill('This historical writing field saves independently.');p.locator('[data-ev-threads]').click();h.ok(not p.locator(sel('root')).count() and p.locator('[data-ev-note-text]').input_value()=='An independently refused note stays dirty.' and parent_work(p)['drafts']['annotation']=='This historical writing field saves independently.','historical writing-field annotation cannot clear the separate annotation dirty marker');p.locator('[data-ev-note-kind]').select_option('literal');enter(p);h.ok(parent_work(p)['annotationDraft']['text']=='An independently refused note stays dirty.','saving the complete annotation legitimately clears only its own dirty marker')
  install(p,seed,unavailable=True);before=p.evaluate('JSON.stringify(ttHarness.book)');enter(p);h.ok(p.evaluate('JSON.stringify(ttHarness.book)')==before,'an unavailable parent format still permits session-only reading-order entry')
 finally:c.close()

def stale(browser,base,seed):
 print('Two Threads: isolated refusal and representative stale-control faults',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(SPEECH_FIXTURE)
  def start():install(p,seed);enter(p)
  def baseline():return p.evaluate('JSON.stringify([ttHarness.original,ttHarness.book,ttHarness.saves,ttHarness.renders,ttSpoken,ttStops])')
  def dispatch(e,event='click'):e.evaluate('(e,t)=>e.dispatchEvent(t==="click"?new MouseEvent(t,{bubbles:true,cancelable:true}):new Event(t,{bubbles:true,cancelable:true}))',event)
  start();scene(p,'b1');move(p,-1);waiting=order(p);p.evaluate('ttHarness.allow=false');before=p.evaluate('JSON.stringify(ttHarness.book)');click(p,'keep');h.ok(p.evaluate('JSON.stringify(ttHarness.book)')==before and order(p)==waiting and p.locator('#tt-status').inner_text(),'refused real Notes preflight preserves order, words and notebook');p.evaluate('ttHarness.allow=true');click(p,'keep');h.ok(p.evaluate('ttHarness.book.threadReadings[0].work.order')==waiting,'same refused order remains keepable')
  for fault in ['owner','book','inactive','root-identity','root-bytes','control-ancestor','root-ancestor','outer-hidden','outer-aria-hidden','route','disabled']:
   start();e=p.locator(sel('hear')).element_handle();payload=e.get_attribute('data-speak');scripts={'owner':'ttHarness.owner="other-owner"','book':'ttHarness.book=structuredClone(ttHarness.book)','inactive':'ttHarness.active=false','root-identity':'ttHarness.book.threadReadings=[]','root-bytes':'ttHarness.book.threadReadings={raw:"outside"}','outer-hidden':'document.querySelector("main").hidden=true','outer-aria-hidden':'document.querySelector("main").setAttribute("aria-hidden","true")','route':'history.replaceState(null,"","#learn/english/stale")','disabled':'document.querySelector("[data-tt-hear]").disabled=true'}
   if fault=='control-ancestor':e.evaluate('e=>{const x=document.createElement("section");e.parentNode.append(x);x.append(e)}')
   elif fault=='root-ancestor':p.locator(sel('root')).evaluate('e=>{const x=document.createElement("section");e.parentNode.append(x);x.append(e)}')
   else:p.evaluate(scripts[fault])
   before=baseline();dispatch(e);h.ok(baseline()==before and e.get_attribute('data-speak')==payload,'stale '+fault+' Hear leaves device request, payload and notebook untouched')
  for action in ['move','turn','scene','fold','card','keep']:
   start()
   if action=='move':scene(p,'b1');e=p.locator(sel('move',-1)).element_handle();event='click'
   elif action=='turn':e=p.locator(sel('turn','read')).element_handle();event='click'
   elif action=='scene':e=p.locator(sel('scene','b1')).first.element_handle();event='click'
   elif action=='fold':e=p.locator(sel('fold','definitions')).element_handle();e.evaluate('e=>e.open=true');event='toggle'
   elif action=='card':click(p,'keep');click(p,'shelf');e=p.locator('[data-tt-card]').first.element_handle();event='click'
   else:e=p.locator(sel('keep')).element_handle();event='click'
   p.evaluate('ttHarness.owner="other-owner"');before=baseline();dispatch(e,event);h.ok(baseline()==before,'stale '+action+' cannot edit, navigate, disclose or keep')
  start();click(p,'keep');copybutton=p.locator(sel('copy')).element_handle();p.evaluate('ttHarness.book.threadReadings[0].source.title="External source edit"');before=baseline();dispatch(copybutton);h.ok(baseline()==before,'in-place retained source edits invalidate captured Copy')
  start();root=p.locator(sel('root')).element_handle();old=p.locator(sel('keep')).element_handle();click(p,'back');root.evaluate('e=>document.querySelector("main").append(e)');before=baseline();dispatch(old);h.ok(baseline()==before,'detached child controls stay inert after a controlled Back')
  install(p,seed);button=p.locator('[data-ev-threads]').element_handle();p.evaluate('ttHarness.owner="other-owner"');before=baseline();dispatch(button);h.ok(baseline()==before and not p.locator(sel('root')).count(),'stale parent entry stays inert')
 finally:c.close()

def main():
 seed=fixture()
 class Quiet(http.server.SimpleHTTPRequestHandler):
  protocol_version='HTTP/1.1'
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    report=journey(browser,base,seed);transfer(browser,base,seed,report);samples(browser,base,seed);storage(browser,base,seed);dirty_parent(browser,base,seed);stale(browser,base,seed);h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc())
    for ci,context in enumerate(browser.contexts):
     for pi,page in enumerate(context.pages):
      try:page.screenshot(path=str(OUT/f'failure-{ci}-{pi}.png'),full_page=True)
      except Exception:pass
    raise
   finally:browser.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
