"""Synthetic actual-app character-case402 Chromium qualification.

One complete English/Chapter Map/Notes journey and bounded responsive, recovery,
stale-control and reference-independence probes. No learner or family data.
Chromium emulation does not qualify physical Apple devices, audible speech,
independent interpretation or learning.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CHAPTER_CHARACTER_ARTIFACTS','/private/tmp/lg402-native'));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('character_existing_helpers',ROOT/'test/chapter-connections-browser.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
h=m.h;t=m.t
for module in [h,t,m]:module.OUT=OUT
sel=m.sel;click=m.click;enter=m.enter;setup=m.setup;maps=m.maps;hear=m.hear;open_map=m.open_map
DISCLAIMER='These choices do not show independent interpretation. Examples may have been seen on another map or in discussion.'
def study_source():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{chapterSource}from'./dist/chapter-connections-content.mjs';import{newChapterWork}from'./dist/chapter-connections-core.mjs';const source=chapterSource();console.log(JSON.stringify({source,work:newChapterWork(source)}));"],cwd=ROOT,text=True))
def character(p):click(p,'turn','characters');p.locator(sel('character-surface')).wait_for()
def row(p,claim,quote):return p.locator(sel('character-row-claim',claim)+sel('character-row-quote',quote))
def marks_open(p):
 for summary in p.locator(sel('character-surface')+' details>summary').all():
  if 'Your passage marks' in summary.inner_text() and summary.locator('..').get_attribute('open') is None:summary.click()
def mark(p,claim,role):click(p,'character-claim',claim);click(p,'character-role',role)
def active_quote(p):return p.locator(sel('quote-panel')).first.get_attribute('data-cm-quote-panel')
def characters(record):return record['work']['characters']
def viewport_material(p,claim,block):
 # This screenshot proves the actual task and passage, rather than only a menu.
 visible=p.evaluate('''([claim,block])=>{const nodes=[...document.querySelectorAll('[data-cm-character-surface] *')];return [claim,block].map(text=>nodes.some(n=>n.textContent.includes(text)&&n.matches('.cm-character-claim,[data-cm-block]')&&n.checkVisibility()&&n.getBoundingClientRect().bottom>0&&n.getBoundingClientRect().top<innerHeight));}''',[claim,block])
 h.ok(all(visible),'actual viewport contains the selected evidence claim and passage')
def snapshot(p):return {'workspace':p.locator(sel('character-surface')).inner_text(),'status':p.locator('#cm-status').inner_text(),'hear':hear(p)}
def journey(browser,base,seed,packet):
 print('Character402: actual English, immutable map and Notes journey',flush=True)
 s=packet['source'];study=s['characterStudy'];case=study['cases'][0];claims=case['claimIds'];c,p=setup(browser,base,seed)
 try:
  p.evaluate(t.SPEECH_FIXTURE);before=copy.deepcopy(h.book(p));external=[];p.on('request',lambda r:external.append(r.url) if 'gutenberg.org' in r.url else None)
  # Leave actual visible original writing waiting when entering the companion.
  p.locator('[data-ev-field="paragraph"]').fill('A synthetic paragraph waiting while we inspect a character.');before=copy.deepcopy(h.book(p));enter(p);m.connect(p,'c1','c5','change');character(p)
  h.ok('chapterMaps' not in h.book(p),'viewing the optional case never writes a notebook root')
  h.ok(p.locator(sel('character-role','supports')).is_disabled(),'passages open before selecting any claim; marking needs a claim')
  first=study['cards'][0];h.ok(active_quote(p)==first['id'],'first source-owned card opens without a reading record')
  mark(p,claims[0],'supports');click(p,'character-quote-nav',1);mark(p,claims[0],'complicates');mark(p,claims[1],'context');marks_open(p)
  h.ok(row(p,claims[0],first['id']).count()==1 and row(p,claims[1],case['cardIds'][1]).count()==1,'marks name stable claim/card pairs across different claims')
  row(p,claims[0],first['id']).click();h.ok(active_quote(p)==first['id'],'stored pair focus restores its own passage atomically')
  click(p,'character-clear');click(p,'character-role','context');marks_open(p)
  # Visit all finite authored cards once to inspect quotePanel reuse and full links.
  for case_item in study['cases']:
   click(p,'character-case',case_item['id'])
   for index,qid in enumerate(case_item['cardIds']):
    q=next(q for q in study['cards'] if q['id']==qid);panel=p.locator(sel('quote-panel',qid));h.ok(panel.locator(sel('block')).all_text_contents()==q['blocks'],'full source-owned blocks remain visible for '+qid)
    joins=panel.locator('[data-cm-join]').evaluate_all('xs=>xs.map(x=>({kind:x.dataset.cmJoin,text:x.textContent}))');h.ok([x['kind'] for x in joins]==q['joins'] and all(x['text'].strip() for x in joins if x['kind']=='omission'),'paragraph boundaries and labelled omissions for '+qid)
    chapter=next(ch for ch in s['chapters'] if ch['id']==q['chapterId']);link=panel.locator(sel('full'));h.ok(link.get_attribute('href')==f'https://www.gutenberg.org/cache/epub/{s["book"]["ebookNumber"]}/pg{s["book"]["ebookNumber"]}-images.html#{chapter["fragment"]}' and link.get_attribute('target')=='_blank' and set(link.get_attribute('rel').split())>={'noopener','noreferrer'},'own complete-chapter outside link for '+qid)
    if index+1<len(case_item['cardIds']):click(p,'character-quote-nav',1)
  h.ok(not external,'reading source-owned cards makes no publisher request')
  click(p,'character-case',case['id']);click(p,'character-claim',claims[0]);payload=hear(p)
  h.ok(first['blocks'][0] in payload and study['claims'][-1]['text'] not in payload and study['references'][0]['placements'][0]['comment'] not in payload and study['demo']['chapters'][0]['text'] not in payload,'Hear excludes other claims, unopened references and miniature')
  click(p,'character-reference');payload=hear(p);h.ok(DISCLAIMER in payload and 'on this map' in payload,'elected help speech includes complete independent-interpretation disclaimer')
  reference_text=p.locator(sel('character-surface')).inner_text();click(p,'character-reference-nav',1);click(p,'character-help-back');click(p,'character-reference');h.ok(p.locator(sel('character-surface')).inner_text()!=reference_text,'reference cursor survives closing and reopening')
  click(p,'character-help-back');click(p,'character-teach');payload=hear(p);h.ok(study['demo']['chapters'][0]['text'] in payload and study['demo']['chapters'][1]['text'] not in payload and study['demo']['steps'][1]['text'] not in payload,'demo speaks only elected part and opened current step')
  click(p,'character-demo-part',1);click(p,'character-demo-step',1);click(p,'character-help-back');click(p,'keep');frozen=copy.deepcopy(maps(p)[0]);cw=characters(frozen)
  h.ok(cw['referenceShown'] and cw['teachingSeen']==2 and frozen['work']['connections']==[{'left':'c1','right':'c5','kind':'change'}],'Keep freezes character help/marks with the ordinary connection')
  marks_open(p);target=cw['placements'][0];row(p,target['claimId'],target['quoteId']).click();h.ok(maps(p)[0]==frozen,'kept row focus does not change saved bytes');click(p,'copy');click(p,'character-role','supports');click(p,'character-quote-nav',1);waiting=active_quote(p)
  click(p,'back');p.locator('[data-ev-root]').wait_for();h.ok(p.locator('[data-ev-field="paragraph"]').input_value()=='A synthetic paragraph waiting while we inspect a character.' and h.book(p)['evidenceVoice']==before['evidenceVoice'],'controlled Back retains actual original English writing and annotation')
  enter(p);open_map(p,frozen['id']);character(p);click(p,'character-quote-nav',1);click(p,'copy');h.ok(active_quote(p)==waiting,'return to waiting copy retains its own edits and passage');click(p,'keep');h.ok(maps(p)[0]==frozen and len(maps(p))==2,'copy creates a new immutable map')
  click(p,'back');p.reload(wait_until='networkidle');m.activate_after_reload(p);enter(p);open_map(p,frozen['id']);character(p);h.ok(maps(p)[0]==frozen,'shelf and reload retain exact source and help')
  after=copy.deepcopy(h.book(p));after.pop('chapterMaps');h.ok(after==before,'character work preserves every unrelated notebook root')
  p.screenshot(path=str(OUT/'tablet.png'),full_page=True);report=h.export_notes(p,'character-kept');h.ok(report['chapterMaps']==maps(p),'actual Notes download contains exact character source and choices');return report
 finally:c.close()
def mark_pagination(browser,base,seed):
 print('Character402: five-mark pagination and spoken saved status',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(t.SPEECH_FIXTURE);enter(p);character(p);click(p,'character-case','mole');click(p,'character-claim','mole-care')
  for i in range(5):
   click(p,'character-role','context')
   if i<4:click(p,'character-quote-nav',1)
  marks_open(p);click(p,'character-marks-page',1)
  disclosure=p.locator(sel('character-marks'))
  h.ok(disclosure.get_attribute('open') is not None and 'Marks 5–5 of 5' in disclosure.inner_text(),'paging five marks preserves the open list and shows the final row')
  h.ok('These count marks, not reading or success.' in disclosure.inner_text(),'counts describe marks without implying reading or success')
  row(p,'mole-care','mole-space').click();h.ok(p.locator(sel('character-marks')).get_attribute('open') is not None,'focusing a mark preserves disclosure state')
  click(p,'keep');h.ok(p.locator(sel('character-marks')).get_attribute('open') is not None,'Keep preserves the open marks list')
  spoken=hear(p);h.ok('These are the marks kept on this map.' in spoken and 'Kept map. Your original choices stay unchanged.' in spoken,'Hear includes both visible kept-map notices')
  click(p,'copy');h.ok(p.locator(sel('character-marks')).get_attribute('open') is not None,'Copy preserves the open marks list')
 finally:c.close()
def import_report(p,report):
 p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'synthetic-character-notes.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-preview').wait_for();p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-chapter-map]').wait_for();enter(p)
def transfer(browser,base,seed,report):
 print('Character402: actual Notes import, absent packet and opaque malformed work',flush=True)
 altered=copy.deepcopy(report);old=copy.deepcopy(report['chapterMaps'][0]);old['id']='chapter-map-50';old['source'].pop('characterStudy');old['work'].pop('characters');bad=copy.deepcopy(report['chapterMaps'][0]);bad['id']='chapter-map-51';bad['work']['characters']['placements'] = [copy.deepcopy(bad['work']['characters']['placements'][0]),None,copy.deepcopy(bad['work']['characters']['placements'][0])];bad['work']['characters']['futureRaw']={'exact':['untouched']};altered['chapterMaps'] += [old,bad]
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(t.SPEECH_FIXTURE);import_report(p,altered);open_map(p,old['id']);character(p);h.ok('This earlier map has no character case here.' in p.locator(sel('character-surface')).inner_text(),'historical absent packet is not filled from today’s catalogue');click(p,'turn','map');h.ok(p.locator(sel('chapter-panel')).count()==1,'ordinary historical book map remains open')
  open_map(p,bad['id']);character(p);h.ok('This character case cannot be changed here.' in hear(p),'Hear includes the visible unavailable-case notice');marks_open(p);h.ok(row(p,bad['work']['characters']['placements'][0]['claimId'],bad['work']['characters']['placements'][0]['quoteId']).count()==2,'malformed work displays duplicate individually readable rows separately');h.ok(not p.locator(sel('copy')).is_disabled(),'base-readable malformed character record can be copied raw');click(p,'copy');click(p,'keep');h.ok(maps(p)[-1]['work']['characters']==bad['work']['characters'],'raw copy and re-Keep preserve malformed character bytes')
  exported=h.export_notes(p,'character-imported');h.ok(exported['chapterMaps'][:-1]==altered['chapterMaps'],'actual Notes redownload retains all imported originals exactly')
  # Confirmed actual reset invalidates a captured character action.
  p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-chapter-map]').wait_for();enter(p);character(p);old_control=p.locator(sel('character-case')).first.element_handle();p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function('location.hash==="#home"');p.locator('[data-film-skip]').click();p.locator('dialog.welcome-film').wait_for(state='detached');p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-chapter-map]').wait_for();enter(p);before=copy.deepcopy(h.book(p));old_control.evaluate('e=>e.click()');h.ok(h.book(p)==before and 'chapterMaps' not in h.book(p),'confirmed reset prevents captured character controls resurrecting notes')
 finally:c.close()
def samples(browser,base,seed,packet):
 study=packet['source']['characterStudy'];case=study['cases'][0];claim=next(x['text'] for x in study['claims'] if x['id']==case['claimIds'][0]);block=study['cards'][0]['blocks'][0]
 for width in [320,1024]:
  c,p=setup(browser,base,seed,width)
  try:
   p.evaluate(t.SPEECH_FIXTURE);enter(p);character(p);p.locator(sel('character-claim',case['claimIds'][0])).focus();p.keyboard.press('Enter');p.locator(sel('character-role','context')).tap();m.bounds(p)
   # A viewport screenshot at the task, plus a full-page layout record.
   p.locator('#cm-character-task').evaluate('e=>e.scrollIntoView({block:"start"})');viewport_material(p,claim,block);p.screenshot(path=str(OUT/f'viewport-{width}.png'));p.screenshot(path=str(OUT/f'layout-{width}.png'),full_page=True)
   p.locator(sel('character-quote-nav',1)).focus();p.keyboard.press('Enter');h.ok(active_quote(p)==case['cardIds'][1],'native keyboard passage paging works at '+str(width));click(p,'character-reference');m.bounds(p);h.ok(DISCLAIMER in hear(p),'help disclaimer survives responsive elected reference')
  finally:c.close()
def metamorphic(browser,base,seed,packet):
 print('Character402: reference-packet independence in actual child workspace',flush=True)
 results=[];reference_payloads=[]
 for variant in [0,1]:
  seeded=copy.deepcopy(seed);s=copy.deepcopy(packet['source']);study=s['characterStudy']
  if variant:
   study['references'].reverse()
   for ref in study['references']:
    ref['placements']=list(reversed(ref['placements']))[:1]
    for note in ref['placements']:note['role']={'supports':'complicates','complicates':'context','context':'supports'}[note['role']];note['comment']='A different synthetic reader discusses these words.'
  seeded['chapterMaps']=[{'id':'chapter-map-70','source':s,'work':copy.deepcopy(packet['work'])}];c,p=setup(browser,base,seeded)
  try:
   p.evaluate(t.SPEECH_FIXTURE);enter(p);open_map(p,'chapter-map-70');character(p);click(p,'copy');case=study['cases'][0];mark(p,case['claimIds'][0],'supports');click(p,'character-quote-nav',1);mark(p,case['claimIds'][1],'context');marks_open(p);states=[snapshot(p)];click(p,'character-reference');reference_payloads.append(hear(p));click(p,'character-help-back');states.append(snapshot(p));click(p,'keep');results.append({'states':states,'work':maps(p)[-1]['work']})
  finally:c.close()
 h.ok(reference_payloads[0]!=reference_payloads[1],'fixture variations actually change elected reader notes')
 h.ok(results[0]==results[1],'flipped/reordered/reduced reader notes never grade or alter identical child actions, marks, status, Hear or kept work')
def faults(browser,base,seed):
 print('Character402: actual refused Keep, saving-off, owner and retired controls',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(t.SPEECH_FIXTURE)
  def start():m.install(p,seed);enter(p);character(p);click(p,'character-claim','mole-care')
  start();click(p,'character-role','supports');p.evaluate('ttHarness.allow=false');before=p.evaluate('JSON.stringify(ttHarness.book)');click(p,'keep');h.ok(p.evaluate('JSON.stringify(ttHarness.book)')==before and 'still on this page' in p.locator('#cm-status').inner_text(),'actual Keep refusal preserves the original notebook and waiting character choice');p.evaluate('ttHarness.allow=true');click(p,'keep');h.ok(p.evaluate('ttHarness.book.chapterMaps[0].work.characters.placements[0].role')=='supports','refused character mark remains available to Keep')
  start();control=p.locator(sel('character-role','context'));control.evaluate('e=>{const parent=e.parentNode;e.remove();parent.append(e);e.click()}');click(p,'keep');h.ok(p.evaluate('ttHarness.book.chapterMaps[0].work.characters.placements.length')==0,'removed/reinserted native role control cannot annotate')
  start();control=p.locator(sel('character-role','supports')).element_handle();p.evaluate('ttHarness.owner="another-synthetic-owner"');before=p.evaluate('JSON.stringify([ttHarness.book,ttHarness.saves,ttHarness.renders,ttSpoken,ttStops])');control.evaluate('e=>e.click()');h.ok(p.evaluate('JSON.stringify([ttHarness.book,ttHarness.saves,ttHarness.renders,ttSpoken,ttStops])')==before,'old-owner character control cannot edit or speak')
  start();root=p.locator(sel('root')).element_handle();control=p.locator(sel('character-role','context')).element_handle();anchor=p.locator(sel('quote-panel')+' '+sel('full')).element_handle();click(p,'back');root.evaluate('e=>document.querySelector("main").append(e)');before=p.evaluate('JSON.stringify([ttHarness.book,ttHarness.saves,ttHarness.renders,ttSpoken,ttStops])');control.evaluate('e=>e.click()');cancelled=anchor.evaluate('e=>!e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok(cancelled and p.evaluate('JSON.stringify([ttHarness.book,ttHarness.saves,ttHarness.renders,ttSpoken,ttStops])')==before,'retired character controls and default external navigation remain inert after Back')
 finally:c.close()
 c,p=setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-chapter-map]').wait_for();enter(p);character(p);mark(p,'mole-care','context');before=p.evaluate('JSON.stringify(localStorage)');click(p,'keep');h.ok(p.evaluate('JSON.stringify(localStorage)')==before and 'Saving is off' in p.locator('#cm-status').inner_text(),'saving-off Keep accurately reports open-page storage');out=h.export_notes(p,'character-saving-off');h.ok(characters(out['chapterMaps'][-1])['placements'][0]['role']=='context','actual Notes rescues character work while saving is off')
 finally:c.close()
def main():
 seed=t.fixture();packet=study_source()
 class Quiet(http.server.SimpleHTTPRequestHandler):
  protocol_version='HTTP/1.1'
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    report=journey(browser,base,seed,packet);mark_pagination(browser,base,seed);transfer(browser,base,seed,report);samples(browser,base,seed,packet);metamorphic(browser,base,seed,packet);faults(browser,base,seed);h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
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
