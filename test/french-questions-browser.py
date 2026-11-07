"""French Parcel Questions382: actual-app conversation and Notes journeys.

One tablet journey and phone sample use ordinary application modules. An
explicitly isolated actual-UI harness covers external context/refusal faults.
A separate labelled device-API fixture supplies synthetic local/remote voices
to verify strict French selection and late availability; it proves no audibility.
Invented notebooks only; not physical iPad/Safari, VoiceOver or learning proof.
"""
import sys
sys.dont_write_bytecode=True
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('FRENCH_QUESTIONS_ARTIFACTS') or tempfile.mkdtemp(prefix='french-questions-'))
OUT.mkdir(parents=True,exist_ok=True)
_spec=importlib.util.spec_from_file_location('french_question_notebook_helpers',ROOT/'test/writing-table-browser.py')
h=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(h);h.OUT=OUT
ROUTE='#learn/french'
ORIGINAL='Je vais lire le message.'


def fixture():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{startFrenchRooms,setFrenchRoomsField}from'./dist/french-rooms-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={payload:'z'.repeat(512000),exact:{v:74}};const o={canExport:()=>true};startFrenchRooms(s,'return',o);setFrenchRoomsField(s,'explanation','Je vais lire un message.',o);console.log(JSON.stringify(s));"],cwd=ROOT,text=True))


def sel(name,value=None):return '[data-fq-'+name+('="'+str(value)+'"' if value is not None else '')+']'
def click(p,name,value=None):p.locator(sel(name,value)+':visible').first.click()
def items(p):return h.book(p).get('frenchQuestionSheets',{}).get('items',[])
def setup(browser,base,seed,width=820):
 c,p=h.setup(browser,base,seed,width=width)
 p.on('requestfailed',lambda r:h.errors.append('Request failed: '+r.url+' '+str(r.failure)) if 'ERR_ABORTED' not in (r.failure or '') else None)
 p.evaluate('location.hash="#learn/french"');p.locator('[data-rooms-root]').wait_for();return c,p
def enter(p):
 p.locator('[data-rooms-questions]').click();p.locator(sel('root')).wait_for()
def ask(p,id):click(p,'ask',id)
def selected(p,id):return p.locator(sel('parcel',id)).get_attribute('aria-pressed')=='true'
def text(p):return p.locator(sel('root')).inner_text()
def stop_voice(p):
 if p.locator('[data-stop-speech]').count():p.locator('[data-stop-speech]').first.click()
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('[data-fq-root] button,[data-fq-root] a,[data-fq-root] summary,[data-fq-root] select').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'visible question controls have44px targets and16px text: '+str(bad))
 tiny=p.locator('[data-fq-root] p,[data-fq-root] li,[data-fq-root] label').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)')
 h.ok(not tiny,'notes, conversation and labels use readable body text: '+str(tiny))


def journey(browser,base,seed):
 print('French questions: actual parent/conversation/kept journey',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.locator('[data-rooms-field="explanation"]').fill(ORIGINAL);p.locator('[data-rooms-keep]').first.click()
  before=copy.deepcopy(h.book(p));enter(p)
  h.ok(p.evaluate('!!document.activeElement.closest("[data-fq-root]")&&/^H[12]$/.test(document.activeElement.tagName)'),'child entry focuses a visible child heading')
  h.ok('frenchQuestionSheets' not in h.book(p),'opening the tool creates no saved conversation root')
  bounds(p);click(p,'keep');blank=copy.deepcopy(items(p)[0])
  h.ok(blank['work']['asked']==[] and blank['work']['selected'] is None and not blank['work']['compared'],'blank unchecked conversation can be kept without a forced question or answer')
  click(p,'shelf');click(p,'card',blank['id'])
  h.ok(p.locator(sel('ask','colour')).is_disabled() and p.locator(sel('parcel','a')).is_disabled(),'blank kept original is read-only')
  click(p,'copy');click(p,'meaning')
  h.ok('The parcel is blue.' not in text(p) and 'The parcel is in the kitchen.' not in text(p),'English meanings do not disclose unasked colour or room replies')
  ask(p,'destination')
  h.ok('Le colis va au café.' in p.locator(sel('conversation')).inner_text(),'a redundant destination question returns its truthful source-owned reply')
  h.ok(p.locator(sel('ask','destination')).evaluate('e=>e===document.activeElement'),'asking preserves focus on that question')
  ask(p,'colour');ask(p,'colour')
  h.ok(p.locator(sel('conversation')).inner_text().count('Le colis est bleu.')==2,'repeated questions retain both identical truthful replies in conversation order')
  h.ok('The parcel is in the kitchen.' not in text(p),'English help still does not leak an unasked room answer after other questions')
  ask(p,'room');click(p,'parcel','d')
  h.ok(selected(p,'d') and p.locator(sel('parcel','d')).evaluate('e=>e===document.activeElement'),'unexpected parcel stays visibly selected with useful control focus')
  click(p,'compare')
  h.ok('different color or room' in p.locator(sel('comparison')).inner_text(),'explicit comparison describes the unexpected selection without replacing it')
  click(p,'keep');unexpected=copy.deepcopy(items(p)[-1])
  h.ok(unexpected['work']['asked']==['destination','colour','colour','room'] and unexpected['work']['selected']=='d','Keep preserves the complete inquiry order and unexpected parcel')
  h.ok(unexpected['work']['meaningShown'] and unexpected['work']['compared'],'requested English and explicit reference remain separate support flags')
  h.ok(items(p)[0]==blank,'later inquiry never overwrites the blank original')
  click(p,'shelf');click(p,'card',unexpected['id'])
  h.ok(p.locator(sel('ask','room')).is_disabled() and p.locator(sel('meaning')).is_disabled() and p.locator(sel('compare')).is_disabled(),'kept conversation cannot add questions or support')
  click(p,'copy');click(p,'parcel','a');click(p,'keep')
  h.ok(items(p)[-1]['work']['selected']=='a' and items(p)[1]==unexpected,'a changed copy appends without modifying the earlier unexpected conversation')
  click(p,'working');click(p,'parcel','b');waiting=p.locator(sel('draft')).input_value()
  click(p,'fresh');fresh=p.locator(sel('draft')).input_value()
  h.ok(fresh!=waiting,'fresh conversation has a distinct session draft')
  p.locator(sel('draft')).select_option(waiting)
  h.ok(selected(p,'b') and p.locator(sel('conversation')).inner_text().count('Le colis est bleu.')==2,'all earlier draft words and selection remain reachable')
  p.locator(sel('case')).select_option('jardin');ask(p,'colour')
  h.ok('Le colis est rouge.' in p.locator(sel('conversation')).inner_text(),'another destination uses its own changing colour reply')
  p.locator(sel('draft')).select_option(waiting)
  h.ok(p.locator(sel('case')).input_value()=='cafe','reopening an earlier cafe draft synchronizes its visit selector')
  p.locator(sel('case')).select_option('jardin');click(p,'shelf');click(p,'card',unexpected['id']);click(p,'copy')
  h.ok(p.locator(sel('case')).input_value()=='cafe' and selected(p,'b'),'returning to an existing kept-copy draft synchronizes the visit without replacing its waiting selection')
  click(p,'fresh');h.ok(p.locator('#fq-title').inner_text()=='Le café','fresh conversation follows the visible cafe visit after reopening its copy')
  p.locator(sel('draft')).select_option(waiting)
  click(p,'back');p.locator('[data-rooms-root]').wait_for()
  h.ok(p.locator('[data-rooms-field="explanation"]').input_value()==ORIGINAL and h.book(p)['frenchRooms']==before['frenchRooms'],'return restores the exact committed parent original and kept source')
  h.ok(p.evaluate('document.activeElement.id==="rooms-heading"'),'return to the parent restores its heading focus')
  enter(p);h.ok(p.locator(sel('draft')).input_value()==waiting and selected(p,'b'),'reopening within the session resumes the waiting conversation')
  p.screenshot(path=str(OUT/'tablet.png'),full_page=True)
  rest=copy.deepcopy(h.book(p));rest.pop('frenchQuestionSheets')
  h.ok(rest==before,'asking, comparing and keeping change no other notebook roots or large Notes')
  saved=copy.deepcopy(h.book(p)['frenchQuestionSheets']);report=h.export_notes(p,'french-question-conversations')
  h.ok(report['frenchQuestionSheets']==saved and report['frenchRooms']==before['frenchRooms'],'actual Notes export contains exact kept conversations and parent writing')
  return report
 finally:c.close()


def historical_report(report):
 result=copy.deepcopy(report);root=result['frenchQuestionSheets'];old=copy.deepcopy(root['items'][0]);old.update(id=80,futureOuter={'retain':'raw'})
 source=old['source'];source.update(id='earlier-source',title='Earlier <parcel> & "source"',titleMeaning='Earlier synthetic visit',futureSource={'retain':True})
 mapping={q['id']:'old-'+q['id'] for q in source['questions']}
 for q in source['questions']:q['id']=mapping[q['id']]
 source['questions']=[source['questions'][1],source['questions'][2],source['questions'][0]]
 target=copy.deepcopy(source['parcels'][0]);target['id']='old-left'
 twin=copy.deepcopy(target);twin['id']='old-copy'
 other=copy.deepcopy(source['parcels'][-1]);other['id']='old-other'
 source['parcels']=[target,other,twin];source['targetId']='old-copy'
 old['work']={'v':1,'asked':['old-destination','old-colour'],'selected':'old-left','meaningShown':False,'compared':False,'speechRequests':0,'futureWork':{'retain':True}}
 root.update(next=91,items=[{'v':99,'id':90,'raw':['unreadable but retained']},old]+root['items'],futureRoot={'retain':True})
 return result


def transfer(browser,base,seed,report):
 print('French questions: actual historical Notes import',flush=True)
 c,p=setup(browser,base,seed)
 try:
  altered=historical_report(report);identity=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');original=h.book(p)
  p.evaluate('location.hash="#notes"');p.locator('#progress-file').wait_for();p.locator('#progress-file').set_input_files({'name':'synthetic-french-questions.json','mimeType':'application/json','buffer':json.dumps(altered).encode()})
  p.locator('#progress-import-confirm').wait_for();h.ok('French parcel conversations' in p.locator('.import-preview').inner_text(),'import preview identifies the saved conversation owner')
  p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
  h.ok(p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')!=identity,'actual import creates a separate explorer')
  p.evaluate('location.hash="#learn/french"');p.locator('[data-rooms-root]').wait_for();enter(p)
  h.ok(h.book(p)['frenchQuestionSheets']==altered['frenchQuestionSheets'],'changed source ids/order/counts/target and unreadable sibling import unchanged')
  click(p,'shelf');click(p,'card',80)
  h.ok('Earlier <parcel> & "source"' in text(p) and not p.locator('[data-fq-root] parcel').count(),'historical title is literal escaped text')
  h.ok(p.locator('[data-fq-ask]').evaluate_all('xs=>xs.map(x=>x.dataset.fqAsk)')==['old-room','old-destination','old-colour'],'historical question ids and order resolve from its own source')
  h.ok(p.locator('[data-fq-parcel]').count()==3 and selected(p,'old-left'),'historical source counts and selection are not replaced by the catalogue')
  click(p,'copy');click(p,'compare')
  h.ok('matches both details' in p.locator(sel('comparison')).inner_text(),'different parcel ids with identical own-source colour/room dimensions still match both details')
  ask(p,'old-room');click(p,'keep');last=copy.deepcopy(items(p)[-1])
  h.ok(last['id']==91 and last['source']==altered['frenchQuestionSheets']['items'][1]['source'],'append uses retained next id and preserves complete historical source')
  h.ok(last['work']['futureWork']=={'retain':True} and last['work']['asked']==['old-destination','old-colour','old-room'],'copied work preserves additive fields and appends own-source questions')
  expected=copy.deepcopy(h.book(p));again=h.export_notes(p,'french-questions-historical')
  h.ok(again['frenchQuestionSheets']==expected['frenchQuestionSheets'] and again['frenchQuestionSheets']['items'][:-1]==altered['frenchQuestionSheets']['items'] and again['frenchQuestionSheets']['futureRoot']==altered['frenchQuestionSheets']['futureRoot'],'real Notes roundtrip retains all old, unreadable and blank conversations plus root extras exactly')
  h.ok(again['frenchRooms']==altered['frenchRooms'] and again['syntheticOther']==altered['syntheticOther'],'parent original and large unrelated Notes survive historical editing')
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+identity+'"]').click();h.ok(h.book(p)==original,'import/copy leaves the first explorer unchanged')
 finally:c.close()


def phone(browser,base,seed):
 print('French questions: phone layout and keyboard sample',flush=True)
 c,p=setup(browser,base,seed,width=320)
 try:
  enter(p);bounds(p)
  p.locator(sel('ask','colour')).focus();p.keyboard.press('Enter')
  h.ok(p.locator(sel('ask','colour')).evaluate('e=>e===document.activeElement'),'keyboard asking retains the actual question control')
  h.ok(p.locator(sel('ask','colour')).evaluate('e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}'),'after the first reply grows the transcript the focused phone question stays within the viewport')
  click(p,'parcel','c');h.ok(selected(p,'c'),'native phone tap selects a parcel without a mouse or drag')
  p.screenshot(path=str(OUT/'phone.png'),full_page=True)
  p.evaluate('location.hash="#learn/french/return"');p.locator('[data-rooms-root]').wait_for()
  h.ok(not p.locator('[data-rooms-questions]').count(),'direct old lesson routes remain parent lessons without a new child-mode entry')
 finally:c.close()


def saving_off(browser,base,seed):
 print('French questions: actual saving-off download',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#learn/french"');p.locator('[data-rooms-root]').wait_for()
  before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');enter(p);ask(p,'colour');click(p,'keep')
  h.ok('download notes' in p.locator('#fq-status').inner_text().lower(),'Keep offers the honest conditional saving-off recovery message')
  h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'saving-off inquiry/Keep writes no device progress')
  report=h.export_notes(p,'french-questions-saving-off');h.ok(report['frenchQuestionSheets']['items'][0]['work']['asked']==['colour'],'actual Notes download recovers in-memory inquiry')
 finally:c.close()


VOICE_FIXTURE='''(()=>{window.fqVoiceList=[{voiceURI:'fixture-en',name:'Fixture English',lang:'en-US',localService:true,default:true},{voiceURI:'fixture-fr-remote',name:'Fixture remote French',lang:'fr-FR',localService:false,default:false}];window.fqPlayed=[];const listeners=new Set();const speech={getVoices:()=>window.fqVoiceList,cancel(){},speak(u){window.fqPlayed.push({text:u.text,lang:u.lang,voice:u.voice?.voiceURI});queueMicrotask(()=>{u.onstart?.();u.onend?.()})},addEventListener(t,f){if(t==='voiceschanged')listeners.add(f)},removeEventListener(t,f){listeners.delete(f)}};Object.defineProperty(window,'speechSynthesis',{configurable:true,value:speech});window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};})()'''


def voices(browser,base,seed):
 print('French questions: labelled device-API missing/late French voice fixture',flush=True)
 c,p=setup(browser,base,seed)
 try:
  c.add_init_script(VOICE_FIXTURE);p.reload(wait_until='networkidle')
  p.locator('[data-rooms-root],[data-select-explorer="explorer-1"]').first.wait_for()
  if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').click()
  p.locator('[data-rooms-root]').wait_for();enter(p)
  click(p,'hear','note')
  h.ok(p.evaluate('fqPlayed.length')==0 and 'A local French voice is unavailable.' in p.locator('#fq-status').inner_text(),'English local and remote French voices never substitute for missing local French')
  click(p,'keep');h.ok(items(p)[0]['work']['speechRequests']==0,'blocked speech does not increment a request counter')
  click(p,'working')
  p.evaluate('fqVoiceList.push({voiceURI:"fixture-fr",name:"Fixture French local",lang:"fr-FR",localService:true,default:false})')
  click(p,'hear','note')
  h.ok(p.evaluate('fqPlayed')==[{'text':'Apporte le colis au café.','lang':'fr-FR','voice':'fixture-fr'}],'the next real click discovers late local French and passes the exact French payload to the shared speech host')
  stop_voice(p);click(p,'keep');h.ok(items(p)[-1]['work']['speechRequests']==1,'accepted speech requests remain request counts rather than heard-language evidence')
  click(p,'shelf');click(p,'card',items(p)[-1]['id']);before=copy.deepcopy(h.book(p));click(p,'hear','note');stop_voice(p)
  h.ok(p.evaluate('fqPlayed.length')==2 and h.book(p)==before,'read-only speech can play without changing retained support or counters')
 finally:c.close()


def isolated(browser,base,seed):
 print('French questions: labelled actual-UI failed-parent/context harness',flush=True)
 c,p=setup(browser,base,seed)
 try:
  setup_js='''async config=>{const parent=await import('./french-rooms-ui.mjs'),child=await import('./french-questions-ui.mjs'),media=await import('./play-media.mjs'),core=await import('./core.mjs'),transfer=await import('./progress-transfer.mjs');const main=document.querySelector('main');main.replaceChildren();const h={book:structuredClone(config.seed),owner:'synthetic-owner',active:true,allow:true,saves:0};h.book.frenchQuestionSheets={v:1,next:1,items:[]};h.original=h.book;const report=c=>({title:'After the Storm: observations',exportedAt:'2026-11-05T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:core.recommendations(c),...c});h.render=()=>{main.innerHTML=parent.frenchRoomsPage(h.book,undefined,h.owner);parent.bindFrenchRooms(h.book,{notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,save:()=>{h.saves++;return{enabled:true,ok:true}},render:h.render,focus:s=>document.querySelector(s)?.focus(),canExport:c=>h.allow&&transfer.prepareProgressImport(JSON.stringify(report(c),null,2)).ok});media.bindSpeech()};if(config.child)child.openFrenchQuestions(h.book,h.owner);window.fqHarness=h;h.render()}'''
  def install(child=True):p.evaluate(setup_js,{'seed':seed,'child':child});p.locator(sel('root') if child else '[data-rooms-root]').wait_for()
  def dispatch(el):el.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
  install(False);p.evaluate('fqHarness.allow=false');before=p.evaluate('JSON.stringify(fqHarness.book)')
  p.locator('[data-rooms-field="explanation"]').fill('Synthetic words whose write was refused.');p.locator('[data-rooms-questions]').click()
  h.ok(not p.locator(sel('root')).count() and p.locator('[data-rooms-field="explanation"]').input_value()=='Synthetic words whose write was refused.','failed parent writing blocks child entry and keeps the uncommitted words visible')
  h.ok(p.evaluate('JSON.stringify(fqHarness.book)')==before and p.evaluate('fqHarness.saves')==0,'failed parent entry leaves earlier notebook exact')
  install();ask(p,'colour');p.evaluate('fqHarness.allow=false');before=p.evaluate('JSON.stringify(fqHarness.book)');click(p,'keep')
  h.ok(p.evaluate('JSON.stringify(fqHarness.book)')==before and p.evaluate('fqHarness.saves')==0,'rejected child Keep leaves all notebook roots exact')
  h.ok('Le colis est bleu.' in p.locator(sel('conversation')).inner_text() and 'could not be kept' in p.locator('#fq-status').inner_text(),'Keep refusal retains working questions/replies and recovery guidance')
  p.evaluate('fqHarness.allow=true');click(p,'keep');h.ok(p.evaluate('fqHarness.book.frenchQuestionSheets.items[0].work.asked')==['colour'],'the same waiting inquiry can be explicitly kept after refusal clears')
  for field in ['source','work']:
   install();click(p,'keep');click(p,'shelf');click(p,'card',1);p.evaluate('fqHarness.saves=0');button=p.locator(sel('copy')).element_handle()
   if field=='source':p.evaluate('fqHarness.book.frenchQuestionSheets.items[0].source.note.fr="Externally changed stored source."')
   else:p.evaluate('fqHarness.book.frenchQuestionSheets.items[0].work.selected="d"')
   before=p.evaluate('JSON.stringify(fqHarness.book)');dispatch(button)
   h.ok(p.evaluate('JSON.stringify(fqHarness.book)')==before and p.evaluate('fqHarness.saves')==0 and p.locator(sel('ask','colour')).is_disabled(),'in-place retained '+field+' mutation cannot activate a stale read-only copy control')
  for fault in ['owner','book','inactive','root-identity','root-bytes','control-ancestor','root-ancestor','hidden','route']:
   install();button=p.locator(sel('keep')).element_handle()
   if fault=='owner':p.evaluate('fqHarness.owner="another-owner"')
   elif fault=='book':p.evaluate('fqHarness.book=structuredClone(fqHarness.book)')
   elif fault=='inactive':p.evaluate('fqHarness.active=false')
   elif fault=='root-identity':p.evaluate('fqHarness.book.frenchQuestionSheets=structuredClone(fqHarness.book.frenchQuestionSheets)')
   elif fault=='root-bytes':p.evaluate('fqHarness.book.frenchQuestionSheets.future={raw:"external"}')
   elif fault=='control-ancestor':button.evaluate('e=>{const group=e.parentNode,box=document.createElement("section");group.parentNode.append(box);box.append(group)}')
   elif fault=='root-ancestor':p.locator(sel('root')).evaluate('e=>{const box=document.createElement("section");e.parentNode.append(box);box.append(e)}')
   elif fault=='hidden':button.evaluate('e=>e.hidden=true')
   elif fault=='route':p.evaluate('history.replaceState(null,"","#learn/french/return")')
   before=p.evaluate('JSON.stringify([fqHarness.original,fqHarness.book])');dispatch(button)
   h.ok(p.evaluate('JSON.stringify([fqHarness.original,fqHarness.book])')==before and p.evaluate('fqHarness.saves')==0,'stale '+fault+' Keep is inert in original/current notebooks')
   if fault=='route':p.evaluate('history.replaceState(null,"","#learn/french")')
  install();root=p.locator(sel('root')).element_handle();button=p.locator(sel('keep')).element_handle();click(p,'back');root.evaluate('e=>document.querySelector("main").append(e)');before=p.evaluate('JSON.stringify(fqHarness.book)');dispatch(button)
  h.ok(p.evaluate('JSON.stringify(fqHarness.book)')==before and p.evaluate('fqHarness.saves')==0,'reattached controls cannot write after returning to parent mode')
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
    report=journey(browser,base,seed);transfer(browser,base,seed,report);phone(browser,base,seed);saving_off(browser,base,seed);voices(browser,base,seed);isolated(browser,base,seed)
    h.ok(not h.errors,'no page/console/HTTP/request errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'base':base,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc())
    for ci,context in enumerate(browser.contexts):
     for pi,page in enumerate(context.pages):
      try:page.screenshot(path=str(OUT/f'failure-{ci}-{pi}.png'),full_page=True);(OUT/f'failure-{ci}-{pi}.html').write_text(page.content())
      except Exception:pass
    raise
   finally:browser.close()
 finally:server.shutdown();server.server_close()


if __name__=='__main__':main()
