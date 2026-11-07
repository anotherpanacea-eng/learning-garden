"""Sentence Spotlight403 actual-app qualification using invented records only.

One tablet journey, one phone sample, actual Notes transfers and explicit
isolated fault probes. Chromium emulation does not qualify physical Apple
hardware, Safari, audible speech, VoiceOver or learning.
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
import threading
import traceback
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('WRITING_VOICE_ARTIFACTS','/private/tmp/lg403-native'))
OUT.mkdir(parents=True,exist_ok=True)
_spec=importlib.util.spec_from_file_location('voice_existing_helpers',ROOT/'test/writing-revision-browser.py')
r=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(r)
h=r.h;h.OUT=OUT
SLOTS=('start','verb','finish')
EXPECTED='The basket was carried by Pip.'
SPEECH='''(()=>{window.voiceSpoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},getVoices(){return[{name:'Synthetic local English',lang:'en-US',voiceURI:'synthetic-local',localService:true,default:true}]},speak(u){window.voiceSpoken.push(u.text)},addEventListener(){},removeEventListener(){}}});})()'''

def setup(browser,base,seed,width=1024,height=1000,fault=False):
 c,p=h.setup(browser,base,seed,width,height,fault)
 p.evaluate(SPEECH)
 return c,p

def choose(p,id,bench='voice'):
 r.drawer(p,'shelf');p.locator('[data-writing-bench="'+bench+'"]').click();p.locator('[data-writing-open="'+id+'"]').click()

def fill(p,slot,phrase):
 p.locator('[data-writing-voice-slot="'+slot+'"]').click();p.locator('[data-writing-voice-phrase="'+phrase+'"]').click()

def preview(p,scope=None):
 if scope:return p.locator('[data-writing-version="'+scope+'"] [data-writing-voice-preview]').inner_text()
 return p.locator('.wt-work [data-writing-voice-preview]').inner_text()

def hear(p):
 p.evaluate('window.voiceSpoken=[]')
 p.locator('.wt-work [data-speak]').first.click()
 words=p.evaluate('window.voiceSpoken.join(" ")');r.stop_voice(p)
 h.ok(bool(words),'Hear reaches the synthetic device API')
 return words

def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('[data-writing-root] button,[data-writing-root] a,[data-writing-root] summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'44px controls with16px text: '+str(bad))
 bad=p.locator('[data-writing-voice-work] p,[data-writing-voice-work] li,[data-writing-voice-work] label').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)')
 h.ok(not bad,'task body text at least16px: '+str(bad))

def geometry(p,stacked=False):
 tools=p.locator('.wt-voice-tools').bounding_box();paper=p.locator('.wt-work [data-writing-voice-preview]').bounding_box()
 h.ok(bool(tools and paper),'bank and preview have visible layout boxes')
 if stacked:h.ok(paper['y']>=tools['y']+tools['height']-1,'phone preview stacks below phrase controls')
 else:h.ok(paper['x']>=tools['x']+tools['width']-1 and abs(paper['y']-tools['y'])<2,'tablet phrase controls and preview share two panes')


def journey(browser,base,seed):
 print('Spotlight: actual tablet journey',flush=True)
 c,p=setup(browser,base,seed)
 try:
  h.ok('writingDesk' not in h.book(p),'arrival creates no writing record')
  r.action(p,'voice');h.ok(h.work(p)['source']['id']=='voice-basket','entry opens first voice task')
  h.ok(p.locator('[data-writing-voice-slot]').evaluate_all('xs=>xs.map(x=>x.dataset.writingVoiceSlot)')==list(SLOTS),'three sentence slots in order')
  h.ok([p.locator('[data-writing-voice-role="'+role+'"] > span').inner_text() for role in ['agent','action','affected']]==['Pip','carrying','the basket'],'scene strip preserves doer/action/affected')
  h.ok('Pip carried the basket.' in p.locator('[data-writing-voice-work]').inner_text(),'starting sentence visible')
  h.ok(preview(p).count('[')==3,'empty preview displays three labelled blanks')
  words=hear(p);h.ok('Niko' not in words and 'Mo painted' not in words and 'voice-bowls' not in words,'Hear excludes unopened lesson/example/other tasks')
  fill(p,'start','pip');r.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='incomplete','partial draft compares as incomplete')
  r.action(p,'keep');first=copy.deepcopy(h.work(p)['firstKept']);first_check=copy.deepcopy(h.work(p)['checks'][0])
  fill(p,'verb','pip');fill(p,'finish','pip');h.ok('Pip Pip Pip.' in preview(p),'unexpected repeated phrase is literal')
  r.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different','complete unexpected wording compares as different')
  r.action(p,'keep')
  r.drawer(p,'versions');h.ok('Pip Pip Pip.' in preview(p,'latest') and '[' in preview(p,'first'),'first/latest previews use actual snapshots');r.drawer(p,'versions',False)
  r.drawer(p,'teaching');h.ok('Teaching card 1 of 6' in p.locator('[data-writing-panel="teaching"]').inner_text(),'lesson shows one elected card')
  words=hear(p);h.ok('Mo painted' in words and 'Niko' not in words and 'mend' not in words,'Hear reads elected lesson card only')
  before=copy.deepcopy(h.book(p));p.locator('[data-writing-voice-nav="teaching-next"]').click();h.ok(h.book(p)==before,'lesson paging changes no saved learning record')
  h.ok('Teaching card 2 of 6' in p.locator('[data-writing-panel="teaching"]').inner_text(),'lesson advances explicitly')
  r.drawer(p,'teaching',False);r.drawer(p,'help');r.action(p,'example')
  h.ok(h.work(p)['help']['example'] is True,'example support recorded when original becomes visible')
  h.ok('Example part 1 of 5' in p.locator('#writing-example').inner_text(),'demo begins with original only')
  demo=copy.deepcopy(h.work(p)['source']['spotlight']['demo'])
  words=hear(p);h.ok(demo['original'] in words and demo['steps'][0] not in words and demo['contrast'] not in words,'Hear excludes unused demo steps and contrast')
  for part in range(2,6):
   p.locator('[data-writing-voice-nav="example-next"]').click();h.ok('Example part '+str(part)+' of 5' in p.locator('#writing-example').inner_text(),'demo advances only on election')
  h.ok(demo['contrast'] in hear(p),'final elected example includes omission contrast')
  p.locator('[data-writing-voice-nav="example-prev"]').click();h.ok(demo['contrast'] not in hear(p),'previous example hides final contrast again')
  for slot,phrase in [('start','basket'),('verb','past'),('finish','by-pip')]:fill(p,slot,phrase)
  h.ok(EXPECTED in preview(p),'current sentence matches independent expected wording')
  r.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','requested prepared passive fits');r.action(p,'keep')
  h.ok(h.work(p)['firstKept']==first and h.work(p)['checks'][0]==first_check,'first keep and first check immutable after edits')
  kept=copy.deepcopy(h.work(p));p.locator('[data-writing-voice-clear]').click();h.ok('[' in preview(p),'clear empties only elected slot');h.ok(h.work(p)['latestKept']==kept['latestKept'],'editing after Keep does not mutate kept version')
  waiting=copy.deepcopy(h.work(p));r.action(p,'next');h.ok(h.work(p)['source']['id']=='voice-bowls','Next stays in voice order');choose(p,'voice-basket');h.ok(h.work(p)==waiting,'waiting draft returns exact')
  choose(p,'voice-truth');r.action(p,'next');h.ok(h.work(p)['source']['id']=='voice-basket','final voice task wraps to first voice task')
  choose(p,'quote-two','point-quote');r.action(p,'next');h.ok(h.work(p)['source']['id']=='bakery','ordinary cycle still wraps to bakery')
  choose(p,'voice-basket');bounds(p);geometry(p);p.screenshot(path=str(OUT/'tablet.png'),full_page=True)
  before=copy.deepcopy(h.book(p));report=h.export_notes(p,'tablet-notes');h.ok(report['writingDesk']==before['writingDesk'] and report['syntheticOther']==before['syntheticOther'],'actual Notes retains voice and unrelated roots')
  old_id=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');r.import_report(p,report)
  h.ok(h.book(p)['writingDesk']==before['writingDesk'],'actual Notes import resumes exact voice records')
  h.ok(p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',old_id)==before,'Notes import preserves original parent explorer')
  return report
 finally:c.close()

def phone(browser,base,seed):
 print('Spotlight: phone sample',flush=True)
 c,p=setup(browser,base,seed,320,800)
 try:
  r.action(p,'voice');p.locator('[data-writing-voice-slot="start"]').focus();p.keyboard.press('Enter');p.locator('[data-writing-voice-phrase="basket"]').focus();p.keyboard.press('Enter')
  h.ok(h.work(p)['work']['placements']['start']=='basket','phone keyboard fills selected slot')
  h.ok(p.evaluate('document.activeElement.matches("[data-writing-voice-slot=start],[data-writing-voice-phrase=basket]")'),'edit retains slot/phrase focus')
  fill(p,'verb','past');fill(p,'finish','by-pip');h.ok(EXPECTED in preview(p),'phone touch constructs sentence');bounds(p);geometry(p,True);hear(p);p.screenshot(path=str(OUT/'phone.png'),full_page=True)
 finally:c.close()

def historical(browser,base,seed,report):
 print('Spotlight: historical own-source and optional display Notes',flush=True)
 altered=copy.deepcopy(report);altered['writingDesk']['currentId']='voice-basket';source=altered['writingDesk']['records']['voice-basket']['source']
 source['spotlight'].update(original='Ren carried the old basket.',agent='Ren',affected='the old basket',context='An earlier fictional visitor asks about a different basket.')
 for phrase in source['choices']:
  if phrase['id']=='basket':phrase['text']='the old basket'
  if phrase['id']=='by-pip':phrase['text']='by Ren'
 c,p=setup(browser,base,seed)
 try:
  r.import_report(p,altered)
  for slot,phrase in [('start','basket'),('verb','past'),('finish','by-pip')]:fill(p,slot,phrase)
  h.ok('The old basket was carried by Ren.' in preview(p),'historical preview uses its own phrases')
  r.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','historical coherent source checks against its own key')
  h.ok('Ren carried the old basket.' in p.locator('[data-writing-voice-work]').inner_text(),'historical original remains its own')
  expected=copy.deepcopy(h.book(p)['writingDesk']);again=h.export_notes(p,'historical-own-source');h.ok(again['writingDesk']==expected,'Notes retains edited coherent historical source')
 finally:c.close()
 for mode in ['absent','malformed']:
  altered=copy.deepcopy(report);root=altered['writingDesk'];root['currentId']='voice-basket';record=root['records']['voice-basket']
  if mode=='absent':record['source'].pop('spotlight')
  else:record['source']['spotlight']={'v':99,'future':{'raw':['keep exact']}}
  c,p=setup(browser,base,seed)
  try:
   r.import_report(p,altered);h.ok('no usable sentence spotlight' in p.locator('.wt-work').inner_text(),'unavailable historical '+mode+' display explained')
   h.ok(p.locator('[data-writing-action="check"]').is_disabled(),'unavailable optional display disables Check')
   source=copy.deepcopy(h.work(p)['source']);r.action(p,'keep');h.ok(h.work(p)['source']==source,'base Keep retains historical raw source')
   saved=copy.deepcopy(h.book(p));again=h.export_notes(p,'historical-'+mode);h.ok(again['writingDesk']==saved['writingDesk'],'Notes preserves unavailable optional metadata and work')
  finally:c.close()

def refusal(browser,base,seed):
 print('Spotlight: actual app refused Keep',flush=True)
 c,p=setup(browser,base,seed,fault=True)
 try:
  r.action(p,'voice');fill(p,'start','basket');before=copy.deepcopy(h.book(p));p.evaluate('window.writingRefuse=true');r.action(p,'keep');h.ok(h.book(p)==before,'refused Keep leaves full notebook exact');h.ok('could not be kept' in p.locator('#writing-status').inner_text(),'refused Keep explains recovery')
  p.evaluate('window.writingRefuse=false');r.action(p,'keep');h.ok(h.work(p)['firstKept']['work']['placements']['start']=='basket','retry keeps actual incomplete work')
 finally:c.close()

def isolated(browser,base,seed):
 print('Spotlight: isolated actual-UI stale-control probes',flush=True)
 c,p=setup(browser,base,seed)
 try:
  install="""async seed=>{
   const ui=await import('./writing-table-ui.mjs'),writing=await import('./writing-table-core.mjs'),core=await import('./core.mjs'),media=await import('./play-media.mjs'),transfer=await import('./progress-transfer.mjs');
   const main=document.querySelector('main');main.replaceChildren();
   const h={book:structuredClone(seed),owner:'synthetic-owner',active:true,saves:0};
   const report=c=>({title:'After the Storm: observations',exportedAt:'2026-11-06T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:core.recommendations(c),...c});
   const gate=c=>transfer.prepareProgressImport(JSON.stringify(report(c))).ok;
   writing.openWritingTask(h.book,'voice-bowls',{canExport:gate});writing.openWritingTask(h.book,'voice-basket',{canExport:gate});h.original=h.book;
   h.render=()=>{main.innerHTML=ui.writingPage(h.book,h.owner);ui.bindWriting(h.book,{notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,save:()=>{h.saves++;return{enabled:true,ok:true}},render:h.render,stopSpeech:media.stopSpeech,stopSound:()=>{},canExport:gate});media.bindSpeech()};
   window.voiceHarness=h;h.render();
  }"""
  def reset():p.evaluate(install,seed);p.locator('[data-writing-voice-work]').wait_for()
  for fault in ['owner','book','inactive','root','writing-root','task','record','parent']:
   reset();p.locator('[data-writing-voice-slot="start"]').click();el=p.locator('[data-writing-voice-phrase="basket"]').element_handle()
   if fault=='owner':p.evaluate('voiceHarness.owner="another-owner"')
   elif fault=='book':p.evaluate('voiceHarness.book=structuredClone(voiceHarness.book)')
   elif fault=='inactive':p.evaluate('voiceHarness.active=false')
   elif fault=='root':p.locator('[data-writing-root]').evaluate('e=>e.replaceWith(e.cloneNode(true))')
   elif fault=='writing-root':p.evaluate('voiceHarness.book.writingDesk=structuredClone(voiceHarness.book.writingDesk)')
   elif fault=='task':p.evaluate('voiceHarness.book.writingDesk.currentId="voice-bowls"')
   elif fault=='record':p.evaluate('voiceHarness.book.writingDesk.records["voice-basket"]=structuredClone(voiceHarness.book.writingDesk.records["voice-basket"])')
   else:el.evaluate('e=>{const box=document.createElement("section");e.closest("[data-writing-root]").append(box);box.append(e)}')
   before=p.evaluate('JSON.stringify([voiceHarness.original,voiceHarness.book])');el.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok(p.evaluate('JSON.stringify([voiceHarness.original,voiceHarness.book])')==before and p.evaluate('voiceHarness.saves')==0,'stale '+fault+' phrase cannot change either notebook')
  for selector in ['[data-writing-voice-slot="start"]','[data-writing-voice-nav="teaching-next"]','.wt-work [data-speak]','[data-writing-action="next"]']:
   reset();r.drawer(p,'teaching');el=p.locator(selector).first.element_handle();el.evaluate('e=>document.body.append(e)');before=p.evaluate('JSON.stringify(voiceHarness.book)');p.evaluate('window.voiceSpoken=[]');el.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok(p.evaluate('JSON.stringify(voiceHarness.book)')==before and p.evaluate('voiceHarness.saves')==0 and not p.evaluate('voiceSpoken.length'),'reparented control cannot edit, navigate or speak: '+selector)
 finally:c.close()


def saving_off(browser,base,seed):
 c,p=setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#desk/writing"');h.ready(p);r.action(p,'voice');fill(p,'start','basket');r.action(p,'keep');h.ok('session' in p.locator('#writing-status').inner_text(),'saving-off identifies session work');report=h.export_notes(p,'saving-off');h.ok(report['writingDesk']['records']['voice-basket']['firstKept']['work']['placements']['start']=='basket','actual Notes recovers session-only Keep')
 finally:c.close()

class Quiet(http.server.SimpleHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True

def main():
 seed=r.fixture();server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');browser=pw.chromium.launch(headless=True,executable_path=chrome if Path(chrome).exists() else None,args=['--disable-quic'])
   try:
    report=journey(browser,base,seed);phone(browser,base,seed);historical(browser,base,seed,report);refusal(browser,base,seed);isolated(browser,base,seed);saving_off(browser,base,seed);h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:browser.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
