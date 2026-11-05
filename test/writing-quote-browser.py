"""Point and Quote384: actual-app paragraph/source play and Notes transfer.

One tablet journey and a phone sample, invented records only. Ordinary journeys
do not intercept application modules. A labelled actual-UI harness checks the
new shared-binder context, ancestry, byte and visibility guards. This is not a
qualification of physical Safari/iPad, VoiceOver, audible output or learning.
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
OUT=Path(os.environ.get('WRITING_QUOTE_ARTIFACTS') or tempfile.mkdtemp(prefix='writing-quote-'))
OUT.mkdir(parents=True,exist_ok=True)
_spec=importlib.util.spec_from_file_location('quote_existing_helpers',ROOT/'test/writing-table-browser.py')
h=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(h);h.OUT=OUT
ROUTE='#desk/writing'


def fixture():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={v:73,payload:'z'.repeat(512000),exact:'Invented unrelated data'};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))


def setup(browser,base,seed,width=820):
 c,p=h.setup(browser,base,seed,width=width)
 p.on('requestfailed',lambda r:h.errors.append('Request failed: '+r.url+' '+str(r.failure)) if 'ERR_ABORTED' not in (r.failure or '') else None)
 return c,p


def action(p,name):p.locator('[data-writing-action="'+name+'"]:visible').first.click()
def drawer(p,name,opened=True):
 d=p.locator('[data-writing-panel="'+name+'"]')
 if (d.get_attribute('open') is not None)!=opened:d.locator(':scope>summary').click()
def choose(p,id):
 drawer(p,'shelf');p.locator('[data-writing-bench="point-quote"]').click();p.locator('[data-writing-open="'+id+'"]').click()
def move(p,id,direction):p.locator('[data-writing-move="'+id+'"][data-writing-direction="'+str(direction)+'"]').click()
def paper(p,scope='current'):return p.locator('[data-writing-quote-paragraph="'+scope+'"]')
def order(p,scope='current'):return paper(p,scope).locator('[data-writing-quote-part]').evaluate_all('xs=>xs.map(x=>x.dataset.writingQuotePart)')
def refs(p,id='quote',scope='current'):return p.locator('[data-writing-reference="'+id+'"][data-writing-reference-scope="'+scope+'"]')
def stop_voice(p):
 if p.locator('[data-stop-speech]').count():p.locator('[data-stop-speech]').first.click()
def hear(p):
 control=p.locator('.wt-work [data-speak]').first;control.click();words=control.get_attribute('data-speak') or '';stop_voice(p);return words


def inspect(p,id='quote',scope='current',index=0,line='g2',text=None):
 refs(p,id,scope).nth(index).click()
 line_node=p.locator('.wt-source-inspector [data-writing-line="'+line+'"]')
 h.ok(line_node.is_visible() and 'wt-referenced' in (line_node.get_attribute('class') or ''),'the visible inspector highlights the own-source '+line+' line for '+scope)
 if text:h.ok(text in line_node.inner_text(),'the inspector exposes the actual cited words, not only a hidden source object')
 action(p,'close-source')
 h.ok(refs(p,id,scope).nth(index).evaluate('e=>e===document.activeElement&&e.checkVisibility()'),'closing the inspector restores the visible source-link control')


def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('[data-writing-root] button,[data-writing-root] a,[data-writing-root] summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'visible writing controls have44px targets and16px text: '+str(bad))
 tiny=p.locator('[data-writing-quote-layout] p,[data-writing-quote-layout] li,[data-writing-quote-layout] small').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)')
 h.ok(not tiny,'paragraph and sentence controls have readable body text: '+str(tiny))


def journey(browser,base,seed):
 print('Point and Quote: actual tablet paragraph/source journey',flush=True)
 c,p=setup(browser,base,seed)
 try:
  before=h.book(p);h.ok('writingDesk' not in before,'arrival does not create writing work')
  action(p,'quote');record=h.work(p)
  h.ok(record['source']['id']=='quote-build' and record['work']['order']==['explain','point','quote'],'direct entry opens the requested supplied paragraph in its literal unexpected order')
  h.ok('Stories to write about' in p.locator('.wt-fiction').inner_text(),'external story excerpts are not labelled Willowbank history')
  h.ok(paper(p).count()==1 and paper(p).evaluate('e=>e.tagName==="P"'),'assembled sentences form one real paragraph')
  h.ok(order(p)==['explain','point','quote'],'paragraph spans retain the actual initial sentence order')
  h.ok(not p.locator('[data-writing-quote-role]').count(),'initial controls do not give away roles through badges')
  bounds(p)
  held=copy.deepcopy(h.work(p));action(p,'quote-source')
  h.ok(p.locator('.wt-source-inspector').is_visible() and 'thirsty goat' in p.locator('.wt-source-inspector').inner_text(),'Read the story words opens the supplied extract visibly')
  action(p,'close-source');h.ok(h.work(p)==held,'opening and closing story prose does not mutate a response')
  inspect(p,text='The goat jumps without a second thought.')
  action(p,'keep');first=copy.deepcopy(h.work(p)['firstKept'])
  h.ok(first['work']['order']==['explain','point','quote'] and first['check'] is None,'unchecked unexpected paragraph is kept as chosen')
  drawer(p,'help');action(p,'hint')
  h.ok(h.work(p)['help']['hint'] and p.locator('[data-writing-quote-role]').count()==3,'Hint records support before showing the three supplied role badges')
  move(p,'quote',-1)
  h.ok(order(p)==['explain','quote','point'],'moving a quoted sentence changes only its literal paragraph position')
  inspect(p,text='The goat jumps without a second thought.')
  action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different','unexpected order is checked only against this stated reader pattern')
  move(p,'point',-1);move(p,'point',-1)
  h.ok(p.evaluate('document.activeElement.matches("[data-writing-move=point]:not(:disabled)")'),'moving a sentence to the first position restores an enabled control for that sentence')
  move(p,'quote',-1)
  action(p,'check');action(p,'keep');saved=copy.deepcopy(h.work(p))
  h.ok(order(p)==['point','quote','explain'] and saved['checks'][-1]['outcome']=='fit','the supplied requested paragraph pattern is reachable')
  h.ok(saved['firstKept']==first and saved['latestKept']['work']['order']==['point','quote','explain'],'later order changes preserve the first kept version')
  drawer(p,'versions')
  h.ok(order(p,'first')==['explain','point','quote'] and order(p,'latest')==['point','quote','explain'],'first/latest visible paragraphs use their own kept orders')
  inspect(p,scope='first',text='The goat jumps without a second thought.')
  inspect(p,scope='latest',text='The goat jumps without a second thought.')
  drawer(p,'versions',False)
  words=hear(p)
  h.ok(paper(p).inner_text() in words,'Hear includes the actual assembled current paragraph')
  h.ok('Nell counted' not in words and 'The walls are smooth and wet.' not in words,'closed separate example and unopened full source stay out of Hear')
  action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','a legitimate narration write leaves the next ordinary action live')
  drawer(p,'shelf');p.locator('[data-writing-bench="paragraphs"]').click();p.locator('[data-writing-open="market-day"]').click()
  h.ok(p.locator('[data-writing-action="quote-return"]').is_visible(),'another task offers an elected return to a readable kept paragraph')
  retained=copy.deepcopy(h.book(p)['writingDesk']['records'])
  action(p,'quote-return');h.ok(h.work(p)['source']['id']=='quote-build' and h.work(p)['firstKept']==first,'return reopens the actual own-source record without replacing its first version')
  versions=p.locator('[data-writing-panel="versions"]')
  h.ok(versions.get_attribute('open') is not None and versions.locator(':scope>summary').evaluate('e=>e===document.activeElement&&e.checkVisibility()'),'kept-paragraph return visibly opens the kept versions and focuses their summary')
  h.ok(h.book(p)['writingDesk']['records']==retained,'elected kept-paragraph return changes no current work, first/latest snapshot or other record')
  choose(p,'quote-two');p.locator('[data-writing-choice="one-jump"]').click()
  h.ok('his pride began to whisper' in p.locator('[data-writing-quote-preview="current"]').inner_text(),'wrong paired quotation stays literal before Check')
  h.ok(refs(p,'one-jump').count()==2,'both source links remain available for a partial/wrong pair')
  inspect(p,'one-jump',index=0,line='g2',text='The goat jumps')
  inspect(p,'one-jump',index=1,line='m1',text='his pride began to whisper')
  action(p,'keep');wrong=copy.deepcopy(h.work(p)['firstKept'])
  action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different' and h.work(p)['firstKept']==wrong,'partial relevance is supported feedback without overwriting the wrong pair')
  h.ok('his pride began to whisper' in hear(p),'the literal selected choice is not muted by an old first-block narration exclusion')
  choose(p,'quote-build');p.screenshot(path=str(OUT/'tablet.png'),full_page=True)
  rest=copy.deepcopy(h.book(p));rest.pop('writingDesk')
  h.ok(rest==before,'quote work leaves every unrelated root, facts and large synthetic Notes exact')
  complete=copy.deepcopy(h.book(p)['writingDesk']);report=h.export_notes(p,'quote-native-kept')
  h.ok(report['writingDesk']==complete,'actual Notes download keeps sources, choices, checks and first/latest paragraphs exactly')
  return report
 finally:c.close()


def historical_report(report):
 result=copy.deepcopy(report);root=result['writingDesk'];r=root['records']['quote-build'];s=r['source']
 mapping={p['id']:'old-'+p['id'] for p in s['parts']}
 s.update(id='earlier-build',family='earlier-literary',title='Earlier <paragraph> & words',reader='An earlier fictional reader checking exact story words.')
 for part in s['parts']:
  part['id']=mapping[part['id']]
  if part['id']=='old-quote':part['role']='constructor'
 s['key']=[mapping[id] for id in reversed(s['key'])]
 def remap(w):w['order']=[mapping[id] for id in w['order']]
 remap(r['work'])
 for check in r['checks']:remap(check['work'])
 for key in ['firstKept','latestKept']:
  remap(r[key]['work'])
  if r[key]['check']:remap(r[key]['check']['work'])
 card=s['research']['cards'][0];card.update(id='earlier-card',title='Earlier <source> & exact words')
 line_map={line['id']:'old-'+line['id'] for line in card['lines']}
 for line in card['lines']:line['id']=line_map[line['id']]
 card['lines']=[card['lines'][1],card['lines'][2],card['lines'][0]]
 s['research']['links']={mapping[id]:[{'cardId':'earlier-card','lineIds':[line_map[line] for line in link['lineIds']]} for link in links] for id,links in s['research']['links'].items()}
 r['future']={'keep':'original record extras'}
 unavailable=copy.deepcopy(r);unavailable['source']['id']='unavailable-source';unavailable['source']['title']='Earlier optional source format';unavailable['source']['research']['cards'][0]['lines']=[]
 root['records']['earlier-unavailable']=unavailable
 two=root['records']['quote-two'];two['source']['id']='earlier-pair';two['source']['title']='An earlier printed pair'
 two['source']['preview']={choice['id']:'An earlier printed response: '+choice['text'] for choice in two['source']['choices']}
 root['records']['unreadable-sibling']={'v':98,'raw':['retained exactly']};root['currentId']='quote-two'
 return result


def transfer(browser,base,seed,report):
 print('Point and Quote: actual historical Notes transfer',flush=True)
 c,p=setup(browser,base,seed)
 try:
  altered=historical_report(report);identity=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');original=h.book(p)
  p.evaluate('location.hash="#notes"');p.locator('#progress-file').wait_for()
  p.locator('#progress-file').set_input_files({'name':'synthetic-quote.json','mimeType':'application/json','buffer':json.dumps(altered).encode()})
  p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
  h.ok(p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')!=identity,'real import creates a second distinct explorer')
  p.evaluate('location.hash="#desk/writing"');h.ready(p)
  h.ok(h.book(p)['writingDesk']==altered['writingDesk'],'historical sources/keys/outcomes/unknown sibling survive actual import unchanged')
  h.ok('An earlier printed response:' in p.locator('[data-writing-quote-preview="current"]').inner_text(),'historical own preview text is not replaced by the underlying choice label')
  choose(p,'quote-build');old=copy.deepcopy(h.work(p))
  h.ok('Earlier <paragraph> & words' in p.locator('#writing-task-title').inner_text(),'historical title renders literally without HTML injection')
  h.ok(not p.locator('[data-writing-root] paragraph').count(),'historical title makes no injected element')
  h.ok(p.locator('[data-writing-quote-role]').count()==2,'malformed constructor role hides only that optional badge')
  h.ok(order(p)==old['work']['order'],'historical part ids and order remain literal')
  inspect(p,'old-quote',line='old-g2',text='The goat jumps without a second thought.')
  h.ok('line 1' in refs(p,'old-quote').first.inner_text(),'source locator numbering follows historical source line order')
  move(p,old['work']['order'][0],1);action(p,'keep')
  h.ok(h.work(p)['firstKept']==old['firstKept'] and h.work(p)['checks']==old['checks'],'editing historical material does not regrade stored outcomes or replace its first keep')
  choose(p,'quote-two');h.ok(p.locator('[data-writing-action="quote-return"]').is_visible(),'malformed optional role does not hide a valid retained quotation return')
  action(p,'quote-return');h.ok(h.work(p)['source']['id']=='earlier-build','return uses the keyed retained record rather than today’s catalogue source')
  drawer(p,'shelf');p.locator('[data-writing-open="earlier-unavailable"]').click()
  h.ok(paper(p).count()==1 and 'The story says' in paper(p).inner_text(),'unreadable optional source card does not lock or erase the ordinary paragraph')
  raw=copy.deepcopy(h.work(p)['source']['research']);move(p,h.work(p)['work']['order'][0],1)
  h.ok(h.work(p)['source']['research']==raw,'editing beside an unavailable source never repairs its raw metadata')
  expected=copy.deepcopy(h.book(p));again=h.export_notes(p,'quote-historical-redownload')
  h.ok(again['writingDesk']==expected['writingDesk'] and again['syntheticOther']==expected['syntheticOther'],'actual redownload preserves malformed optional data, raw sibling, own sources and large Notes')
  p.get_by_text('Writing Table: supplied drafts and kept versions',exact=True).click()
  section=p.locator('details.panel > section').filter(has=p.locator('h3',has_text='Earlier <paragraph> & words')).first
  h.ok(section.locator('[data-writing-quote-paragraph="current"]').is_visible(),'ordinary Notes visibly renders the retained paragraph, not just a hidden JSON surrogate')
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+identity+'"]').click()
  h.ok(h.book(p)==original,'historical import/edit leaves the first explorer unchanged')
 finally:c.close()


def phone(browser,base,seed):
 print('Point and Quote: focused phone layout/keyboard sample',flush=True)
 c,p=setup(browser,base,seed,width=320)
 try:
  action(p,'quote');bounds(p)
  layout=p.locator('[data-writing-quote-layout]')
  boxes=layout.evaluate('e=>{const a=e.querySelector("[data-writing-quote-preview=current]").getBoundingClientRect(),b=e.querySelector(".wt-order").getBoundingClientRect();return{paper:{x:a.x,y:a.y,w:a.width,h:a.height},tools:{x:b.x,y:b.y},w:e.getBoundingClientRect().width}}')
  h.ok(boxes['paper']['w']>=boxes['w']*.85 and boxes['paper']['y']<boxes['tools']['y'],'phone paper has readable full width and precedes sentence tools')
  p.locator('[data-writing-move="quote"][data-writing-direction="-1"]').focus();p.keyboard.press('Enter')
  h.ok(order(p)==['explain','quote','point'],'keyboard move changes the same literal sentence')
  h.ok(p.evaluate('document.activeElement.matches("[data-writing-move=quote]:not(:disabled)")'),'keyboard sentence movement restores a usable moving control')
  p.screenshot(path=str(OUT/'phone.png'),full_page=True)
 finally:c.close()


def saving_off(browser,base,seed):
 print('Point and Quote: actual saving-off recovery',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#desk/writing"');h.ready(p)
  before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');action(p,'quote');move(p,'quote',-1);action(p,'keep')
  h.ok('session' in p.locator('#writing-status').inner_text().lower(),'saving-off status truthfully identifies session-only work')
  h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'saving-off actions do not write device progress')
  report=h.export_notes(p,'quote-saving-off')
  h.ok(report['writingDesk']['records']['quote-build']['firstKept']['work']['order']==['explain','quote','point'],'actual Notes download recovers the saving-off kept paragraph')
 finally:c.close()


def nested_panel(browser,base,seed):
 print('Point and Quote: shared nested kept-panel continuity',flush=True)
 c,p=setup(browser,base,seed)
 try:
  action(p,'revision')
  p.locator('[data-writing-strip="flour"]').click();p.locator('[data-writing-destination="aside"]').click();action(p,'keep')
  original=copy.deepcopy(h.work(p)['firstKept']);drawer(p,'versions')
  inner=p.locator('[data-writing-notice="first"] [data-writing-notice-aside]')
  inner.locator(':scope>summary').click()
  h.ok(inner.get_attribute('open') is not None,'a nested first-kept set-aside disclosure is deliberately opened')
  drawer(p,'versions',False);count=len(h.work(p)['checks']);action(p,'check');drawer(p,'versions')
  inner=p.locator('[data-writing-notice="first"] [data-writing-notice-aside]')
  h.ok(inner.get_attribute('open') is not None and inner.locator('[data-writing-notice-part="flour"]').is_visible(),'closing the outer versions and redrawing retains the nested elected-open set-aside panel and its visible line')
  h.ok(h.work(p)['firstKept']==original and len(h.work(p)['checks'])==count+1,'the intentional Check appends only its ordinary check while nested kept content remains exact')
 finally:c.close()


def isolated(browser,base,seed):
 print('Point and Quote: labelled actual-UI guard/refusal harness',flush=True)
 c,p=setup(browser,base,seed)
 try:
  setup_js='''async config=>{
   const ui=await import('./writing-table-ui.mjs'),writing=await import('./writing-table-core.mjs'),core=await import('./core.mjs'),media=await import('./play-media.mjs'),transfer=await import('./progress-transfer.mjs');
   const main=document.querySelector('main');main.replaceChildren();const h={book:structuredClone(config.seed),owner:config.blank?'':'synthetic-owner',active:true,allow:true,saves:0};
   const report=c=>({title:'After the Storm: observations',exportedAt:'2026-11-05T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:core.recommendations(c),...c});
   const gate=c=>transfer.prepareProgressImport(JSON.stringify(report(c),null,2)).ok;writing.openWritingTask(h.book,'quote-build',{canExport:gate});h.original=h.book;
   h.render=()=>{main.innerHTML=ui.writingPage(h.book,h.owner);const ctx={notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,save:()=>{h.saves++;return{enabled:true,ok:true}},render:h.render,stopSpeech:media.stopSpeech,stopSound:()=>{},canExport:c=>h.allow&&gate(c)};if(config.missing)delete ctx[config.missing];ui.bindWriting(h.book,ctx);media.bindSpeech()};window.quoteHarness=h;h.render();
  }'''
  def install(**kwargs):p.evaluate(setup_js,{'seed':seed,**kwargs});p.locator('[data-writing-quote-layout]').wait_for()
  def dispatch(el):el.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
  install();p.evaluate('quoteHarness.allow=false');before=p.evaluate('JSON.stringify(quoteHarness.book)');move(p,'quote',-1)
  h.ok(p.evaluate('JSON.stringify(quoteHarness.book)')==before and p.evaluate('quoteHarness.saves')==0,'actual Notes preflight refusal leaves the entire notebook exact')
  h.ok('could not' in p.locator('#writing-status').inner_text().lower() and order(p)==['explain','point','quote'],'refused move retains the visible paragraph and recovery direction')
  p.evaluate('quoteHarness.allow=true');move(p,'quote',-1)
  drawer(p,'help');action(p,'hint');hear(p);inspect(p,text='The goat jumps')
  action(p,'keep');h.ok(p.evaluate('quoteHarness.book.writingDesk.records["quote-build"].firstKept.work.order')==['explain','quote','point'],'legitimate move/help/narration/source close keeps the next Keep live')
  for fault in ['owner','book','inactive','source-bytes','work-bytes','root-bytes','control-ancestor','root-ancestor','hidden','aria-hidden','display-none','closed','route']:
   install();button=p.locator('[data-writing-action="hint"]' if fault=='closed' else '[data-writing-action="keep"]').element_handle()
   if fault=='owner':p.evaluate('quoteHarness.owner="other-owner"')
   elif fault=='book':p.evaluate('quoteHarness.book=structuredClone(quoteHarness.book)')
   elif fault=='inactive':p.evaluate('quoteHarness.active=false')
   elif fault=='source-bytes':p.evaluate('quoteHarness.book.writingDesk.records["quote-build"].source.parts[0].text="An external source replacement."')
   elif fault=='work-bytes':p.evaluate('quoteHarness.book.writingDesk.records["quote-build"].work.order.reverse()')
   elif fault=='root-bytes':p.evaluate('quoteHarness.book.writingDesk.external={raw:"unchanged"}')
   elif fault=='control-ancestor':button.evaluate('e=>{const actions=e.parentNode,box=document.createElement("div");actions.parentNode.append(box);box.append(actions)}')
   elif fault=='root-ancestor':p.locator('[data-writing-root]').evaluate('e=>{const box=document.createElement("div");e.parentNode.append(box);box.append(e)}')
   elif fault=='hidden':button.evaluate('e=>e.hidden=true')
   elif fault=='aria-hidden':button.evaluate('e=>e.parentNode.setAttribute("aria-hidden","true")')
   elif fault=='display-none':button.evaluate('e=>e.parentNode.style.display="none"')
   elif fault=='route':p.evaluate('history.replaceState(null,"","#desk/writing/stale")')
   before=p.evaluate('JSON.stringify([quoteHarness.original,quoteHarness.book])');dispatch(button)
   h.ok(p.evaluate('JSON.stringify([quoteHarness.original,quoteHarness.book])')==before and p.evaluate('quoteHarness.saves')==0,'stale/hidden '+fault+' action is inert in original and current notebooks')
   if fault=='route':p.evaluate('history.replaceState(null,"","#desk/writing")')
  for missing in ['notebook','canExport','explorerId','isActive']:
   install(missing=missing);before=p.evaluate('JSON.stringify(quoteHarness.book)');dispatch(p.locator('[data-writing-action="keep"]').element_handle())
   h.ok(p.evaluate('JSON.stringify(quoteHarness.book)')==before and p.evaluate('quoteHarness.saves')==0,'missing real host '+missing+' callback cannot write')
  install(blank=True);before=p.evaluate('JSON.stringify(quoteHarness.book)');dispatch(p.locator('[data-writing-action="keep"]').element_handle())
  h.ok(p.evaluate('JSON.stringify(quoteHarness.book)')==before and p.evaluate('quoteHarness.saves')==0,'blank owner cannot write through a synthetically bound controller')
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
    report=journey(browser,base,seed);transfer(browser,base,seed,report);phone(browser,base,seed);nested_panel(browser,base,seed);saving_off(browser,base,seed);isolated(browser,base,seed)
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
