"""Which One404 actual-app Chromium journey with invented records only.

One tablet journey and one focused phone sample. No physical iPad, Safari,
audible speech, VoiceOver or learning qualification is implied.
"""
import sys
sys.dont_write_bytecode = True
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('SENTENCE_DETAILS_ARTIFACTS', '/private/tmp/lg404-native'))
OUT.mkdir(parents=True, exist_ok=True)
_spec = importlib.util.spec_from_file_location('details_existing_helpers', ROOT/'test/writing-table-browser.py')
h = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(h); h.OUT = OUT
ROUTE = '#loft/bridges'
# Independent literal expectations, rather than a production sentence assembler.
SENTENCES = [
 ('The parcel rests beside the crate.', 'The parcel that has a star label rests beside the crate.', 'The parcel rests beside the crate that has a star label.'),
 ('The courier waits beside the gardener.', 'The courier who is wearing a striped scarf waits beside the gardener.', 'The courier waits beside the gardener who is wearing a striped scarf.'),
 ('The kitten sits beside the bunny.', 'The kitten that is carrying a spoon sits beside the bunny.', 'The kitten sits beside the bunny that is carrying a spoon.'),
 ('The basket sits beside the stool.', 'The basket that has a circle tag sits beside the stool.', 'The basket sits beside the stool that has a circle tag.'),
 ('The lantern rests beside the boat.', 'The lantern that has a painted moon rests beside the boat.', 'The lantern rests beside the boat that has a painted moon.'),
 ('The book lies beside the map.', 'The book which shows a bridge lies beside the map.', 'The book lies beside the map which shows a bridge.')]
SPEECH = '''(()=>{window.detailsSpoken=[];window.detailsCancels=0;window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){window.detailsCancels++},getVoices(){return[{name:'Synthetic local English',lang:'en-US',voiceURI:'synthetic-local',localService:true,default:true}]},speak(u){window.detailsSpoken.push(u.text)},addEventListener(){},removeEventListener(){}}});})()'''

def node(code):
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))

def fixture():
 return node("import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{startShow,setSceneDialogue}from'./dist/loft-core.mjs';import{chooseMessageCase,setMessageText}from'./dist/message-core.mjs';import{noteInstructionEntry,editInstructionPlan,copyInstructionPlan}from'./dist/instruction-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;startShow(s,'welcome');setSceneDialogue(s,'Synthetic waiting dialogue.');chooseMessageCase(s,'post','basket');setMessageText(s,'post','original','Synthetic waiting message.');noteInstructionEntry(s,'post');editInstructionPlan(s,'post','add','fold');copyInstructionPlan(s,'post');s.syntheticOther={v:73,exact:'Invented unrelated data'};console.log(JSON.stringify(s));")

def sources():
 return node("import{detailCopy,detailTeaching,detailModel,detailScenes,detailScene}from'./dist/sentence-details-content.mjs';console.log(JSON.stringify({copy:detailCopy,teach:detailTeaching,model:detailModel,cases:detailScenes.map(s=>detailScene(s.id))}));")

def go(p,base,hash=ROUTE):
 p.goto(base+hash,wait_until='networkidle')
 if hash==ROUTE:p.locator('.bridges-page').wait_for()

def setup(browser,base,seed,width=1024):
 c,p=h.setup(browser,base,seed,width,1000 if width==1024 else 800)
 p.evaluate(SPEECH);go(p,base)
 return c,p

def mode(p,name):
 p.locator('[data-bridges-mode-choice="'+name+'"]').click()
 h.ok(p.locator('.bridges-page').get_attribute('data-bridges-mode')==name,'mode changes inside canonical route')

def control(p,action,value=None):
 sel='[data-details-action="'+action+'"]'
 if value is not None:sel+='[data-details-value="'+value+'"]'
 return p.locator(sel)

def act(p,action,value=None,keyboard=False):
 b=control(p,action,value)
 if keyboard:b.focus();p.keyboard.press('Enter')
 else:b.click()

def sentence(p):return p.locator('p[data-details-sentence]').text_content()
def storage(p):return p.evaluate('Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))')
def panel(p,name,opened=True):
 d=p.locator('[data-details-panel="'+name+'"]')
 if (d.get_attribute('open') is not None)!=opened:d.locator(':scope > summary').click()
 h.ok(d.evaluate('(e,opened)=>e.open===opened',opened),'native '+name+' toggle reaches elected state')

def hear(p):
 p.evaluate('window.detailsSpoken=[]')
 p.locator('.bridges-page [data-speak]').click()
 words=p.evaluate('detailsSpoken.join(" ")')
 h.ok(bool(words),'Hear reaches synthetic device API')
 p.locator('[data-stop-speech]').click()
 return words

def report(p,label):
 result=h.export_notes(p,label);result.pop('exportedAt',None);return result

def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('.bridges-page button,.bridges-page a,.bridges-page summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().height<43.9||x.getBoundingClientRect().width<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'native targets have44px bounds and16px text: '+str(bad))
 h.ok(p.locator('p[data-details-sentence]').evaluate('e=>["block","flow-root"].includes(getComputedStyle(e).display)'),'sentence is a normal-flow paragraph')
 h.ok(p.locator('p[data-details-sentence] [data-details-noun]').evaluate_all('xs=>xs.every(x=>getComputedStyle(x).display!=="flex"&&getComputedStyle(x).display!=="inline-flex")'),'noun words remain inline, rather than flex chips')

def shown(p,src,index,anchor=None):
 case=src['cases'][index];text=p.locator('.bridges-page').inner_text()
 h.ok(sentence(p)==SENTENCES[index][0 if anchor is None else anchor+1],'exact authored sentence '+case['id'])
 h.ok(case['context'] in text and case['purpose'] in text,'full fixed context and reader request stay visible')
 for e in case['entities']:
  figure=p.locator('figure[data-details-entity="'+e['id']+'"]')
  h.ok(e['feature']['text'] in figure.inner_text(),'visible factual caption '+e['id'])
  h.ok(figure.locator('svg[aria-hidden="true"]').count()==1,'schematic is decorative beside caption')
 h.ok(control(p,'attach').evaluate_all('xs=>xs.map(x=>x.dataset.detailsValue)')==[e['id'] for e in case['entities']],'stable two native operations in source order')
 if anchor is not None:
  e=case['entities'][anchor];trial=case['trials'][e['id']]
  h.ok(all(trial[k] in text for k in ['meaning','sceneNote','purposeNote']),'all authored interpretation notes visible')
  h.ok(control(p,'attach',e['id']).get_attribute('aria-pressed')=='true','chosen noun operation pressed')
  h.ok(p.locator('[data-details-clause]').count()>=1,'explicit current clause link rendered')
 else:h.ok(src['copy']['noDetail'] in text and src['copy']['separateMeaning'] in text,'base has accurate unattached description')

def focus_heading(p,fragment):
 h.ok(p.evaluate('(fragment)=>{const e=document.activeElement;return /^H[1-6]$/.test(e.tagName)&&e.textContent.includes(fragment)&&!e.disabled}',fragment),'deliberate heading focus: '+fragment)

def unchanged(p,before,book):
 h.ok(storage(p)==before,'whole localStorage map unchanged after entry, including room visits')
 h.ok(h.book(p)==book,'complete actual notebook and pending sibling drafts unchanged')
 h.ok(p.evaluate('writingWrites===detailsWrites'),'no repeated writes of unchanged app storage')
 h.ok(p.evaluate('location.hash')==ROUTE,'in-visit operation keeps canonical hash')

def journey(browser,base,seed,src):
 print('Which One: actual1024 journey',flush=True)
 c,p=setup(browser,base,seed)
 try:
  baseline=report(p,'before');go(p,base);before=storage(p);book=h.book(p);p.evaluate('window.detailsWrites=writingWrites')
  p.evaluate('window.detailsRoot=document.querySelector(".bridges-page");window.detailsStatus=document.querySelector("#bridges-status")')
  h.ok(p.locator('[role="tablist"]').get_attribute('aria-label')==src['copy']['modes'],'named native tablist')
  for name in ['joins','details']:
   tab=p.locator('[data-bridges-mode-choice="'+name+'"]');h.ok(tab.get_attribute('role')=='tab','native tab role')
   tabpanel=p.locator('#'+tab.get_attribute('aria-controls'));h.ok(tabpanel.get_attribute('role')=='tabpanel' and bool(tabpanel.get_attribute('aria-labelledby')),'tab controls labelled panel')
  p.locator('[data-bridges-action="word"][data-bridges-value="because"]').click();p.locator('[data-bridges-action="swap"]').click()
  joined=p.locator('.bridges-output').inner_text();p.locator('.bridges-teaching summary').click();p.locator('.bridges-talk summary').click()
  p.locator('[data-bridges-mode-choice="joins"]').focus();p.keyboard.press('ArrowRight')
  h.ok(p.locator('.bridges-page').get_attribute('data-bridges-mode')=='details','Right arrow activates Which One')
  h.ok(p.locator('[data-bridges-mode-choice="details"]').evaluate('e=>e===document.activeElement&&e.tabIndex===0&&e.getAttribute("aria-selected")==="true"'),'selected tab has focus and roving tabindex')
  h.ok(p.locator('.bridges-page drawn-howto').count()==0,'joins drawn how-to absent in details')
  shown(p,src,0);h.ok(control(p,'scene-prev').is_disabled(),'first scene boundary disabled')
  for i,case in enumerate(src['cases']):
   if i:act(p,'scene-next');focus_heading(p,case['title'])
   shown(p,src,i)
   for j,e in enumerate(case['entities']):
    act(p,'attach',e['id'],keyboard=j==0);shown(p,src,i,j)
    h.ok(control(p,'attach',e['id']).evaluate('e=>e===document.activeElement&&!e.disabled'),'Describe operation retains usable focus')
    p.evaluate('window.detailsSentence=document.querySelector("p[data-details-sentence]");window.detailsAnnouncement=document.querySelector("#bridges-status").textContent')
    act(p,'attach',e['id']);h.ok(p.evaluate('detailsSentence===document.querySelector("p[data-details-sentence]")&&detailsAnnouncement===document.querySelector("#bridges-status").textContent'),'same attachment is a DOM/status no-op')
   act(p,'remove');shown(p,src,i);focus_heading(p,src['copy']['sentence'])
   act(p,'undo',keyboard=True);shown(p,src,i,1);focus_heading(p,src['copy']['sentence']);h.ok(control(p,'undo').is_disabled(),'one Undo clears current scene snapshot')
   act(p,'attach',case['entities'][0]['id']);act(p,'undo');shown(p,src,i,1)
   # Leave an actual Undo snapshot for per-case restoration.
   act(p,'attach',case['entities'][0]['id']);unchanged(p,before,book)
   p.screenshot(path=str(OUT/('scene-'+case['id']+'-1024.png')),full_page=True)
  h.ok(control(p,'scene-next').is_disabled(),'last scene boundary disabled')
  p.evaluate('window.detailsEnd=document.querySelector("p[data-details-sentence]")');control(p,'scene-next').evaluate('e=>e.click()');h.ok(p.evaluate('detailsEnd===document.querySelector("p[data-details-sentence]")'),'disabled final paging cannot wrap/redraw')
  for i in range(4,-1,-1):
   act(p,'scene-prev');shown(p,src,i,0);h.ok(not control(p,'undo').is_disabled(),'return restores scene-local Undo');act(p,'undo');shown(p,src,i,1)
  words=hear(p);h.ok(all(t not in words for t in src['teach']) and all(m['text'] not in words for m in src['model']) and src['copy']['grownup'] not in words,'closed teaching/model/grown-up excluded from Hear')
  for kind,key in [('teaching','teach'),('model','model')]:
   panel(p,kind)
   for i in range(4):
    if i:act(p,kind+'-next');focus_heading(p,src['copy'][kind+'Count'])
    h.ok(control(p,kind+'-prev').is_disabled()==(i==0) and control(p,kind+'-next').is_disabled()==(i==3),'help paging has bounded ends')
    words=hear(p);current=src[key][i] if kind=='teaching' else src[key][i]['text']
    h.ok(current in words,'Hear includes only elected current '+kind+' part')
    for j,other in enumerate(src[key]):
     text=other if kind=='teaching' else other['text']
     if j!=i:h.ok(text not in words,'Hear excludes noncurrent whole '+kind+' part')
   panel(p,kind,False)
  panel(p,'teaching');panel(p,'model');panel(p,'grownup');words=hear(p)
  h.ok(words.index(src['teach'][3])<words.index(src['model'][3]['text']) and src['copy']['grownup'] not in words,'both elected parts speak in order without grown-up prose')
  cancels=p.evaluate('detailsCancels');act(p,'teaching-prev');h.ok(p.evaluate('detailsCancels')>cancels,'changing teaching stops previous speech')
  bounds(p);p.screenshot(path=str(OUT/'tablet-panels-1024.png'),full_page=True)
  # A retired listener that really would change crate to parcel, with owner/root/mode
  # restored. Reinsertion into the original parent isolates mount retirement.
  first=src['cases'][0]['entities'][0]['id']
  p.evaluate('''id=>{window.retiredAttach=document.querySelector('[data-details-action="attach"][data-details-value="'+id+'"]');window.retiredParent=retiredAttach.parentElement;window.retiredHear=document.querySelector('.bridges-page [data-speak]');}''',first)
  mode(p,'joins');h.ok(p.locator('.bridges-output').inner_text()==joined,'tabs preserve old joined wording and order')
  h.ok(p.locator('.bridges-teaching').evaluate('e=>e.open') and p.locator('.bridges-talk').evaluate('e=>e.open'),'joins disclosures restored')
  h.ok(p.locator('.bridges-page drawn-howto').count()==1,'old drawn how-to returns in joins')
  p.locator('[data-bridges-action="undo"]').click();h.ok(p.locator('.bridges-output').inner_text()=='The helpers moved supper indoors because rain was falling.','old joins Undo preserved across modes')
  mode(p,'details');shown(p,src,0,1)
  h.ok(p.locator('[data-details-panel="teaching"]').evaluate('e=>e.open') and p.locator('[data-details-panel="model"]').evaluate('e=>e.open'),'details disclosures preserved across tabs')
  h.ok(src['teach'][2] in p.locator('[data-details-panel="teaching"]').inner_text() and src['model'][3]['text'] in p.locator('[data-details-panel="model"]').inner_text(),'details pages preserved across tabs')
  p.evaluate('window.detailsSpoken=[];document.querySelector(".bridges-page").append(retiredParent);retiredAttach.click();retiredHear.click()')
  h.ok(sentence(p)==SENTENCES[0][2] and not p.evaluate('detailsSpoken.length'),'reinserted retired different-noun control and detached Hear inert with same owner/root/mode')
  # Remove the injected retired node before native selector checks.
  p.evaluate('retiredParent.remove()');unchanged(p,before,book)
  h.ok(p.evaluate('detailsRoot===document.querySelector(".bridges-page")&&detailsStatus===document.querySelector("#bridges-status")'),'in-visit controls keep parent root and status, with no app redraw')
  h.ok(report(p,'after')==baseline,'actual whole downloaded Notes unchanged by full visit')
  go(p,base);h.ok(p.locator('.bridges-page').get_attribute('data-bridges-mode')=='joins','route exit resets selected mode');mode(p,'details');shown(p,src,0);h.ok(control(p,'undo').is_disabled(),'route exit clears all temporary Undo')
  act(p,'attach',first);p.evaluate('window.ownerOld=document.querySelector("[data-details-action=attach]");window.ownerHear=document.querySelector(".bridges-page [data-speak]")')
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();go(p,base);mode(p,'details');shown(p,src,0)
  p.evaluate('window.detailsSpoken=[];document.querySelector("[data-details-action=attach]").parentElement.append(ownerOld);ownerOld.click();ownerHear.click()');h.ok(sentence(p)==SENTENCES[0][0] and not p.evaluate('detailsSpoken.length'),'prior-owner callbacks cannot alter new explorer or speak')
  go(p,base,'#notes');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();go(p,base);mode(p,'details');off=storage(p);act(p,'attach',first);h.ok(sentence(p)==SENTENCES[0][1] and storage(p)==off,'saving-off bounded actual operation remains usable without writing')
  go(p,base,'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click()
  if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').click()
  go(p,base);mode(p,'details');shown(p,src,0);h.ok(control(p,'undo').is_disabled(),'explicit reset clears both modes and Undo')
 finally:c.close()

def phone(browser,base,seed,src):
 print('Which One: focused320 sample',flush=True)
 c,p=setup(browser,base,seed,320)
 try:
  mode(p,'details');act(p,'attach','parcel',True);shown(p,src,0,0);bounds(p)
  h.ok(p.locator('[data-details-noun="parcel"]').inner_text()=='The parcel','real words retain noun spacing')
  p.screenshot(path=str(OUT/'phone-320.png'),full_page=True)
  p.locator('[data-bridges-mode-choice="details"]').focus();p.keyboard.press('Home');h.ok(p.locator('.bridges-page').get_attribute('data-bridges-mode')=='joins','Home activates first tab');p.keyboard.press('End');h.ok(p.locator('.bridges-page').get_attribute('data-bridges-mode')=='details','End activates last tab');p.keyboard.press('ArrowLeft');h.ok(p.locator('.bridges-page').get_attribute('data-bridges-mode')=='joins','Left activates first tab')
 finally:c.close()

class Quiet(http.server.SimpleHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):
 request_queue_size=128
 daemon_threads=True

def main():
 seed=fixture();src=sources();server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('SENTENCE_DETAILS_TEST_URL',f'http://127.0.0.1:{server.server_port}/')
 try:
  with sync_playwright() as pw:
   chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');browser=pw.chromium.launch(headless=True,executable_path=chrome if Path(chrome).exists() else None,args=['--disable-quic'])
   try:
    journey(browser,base,seed,src);phone(browser,base,seed,src);h.ok(not h.errors,'no browser/console/HTTP errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:browser.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
