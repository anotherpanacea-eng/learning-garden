"""Synthetic actual-app Chapter Map399 journeys and recovery.

One complete tablet journey, source-owned historical Notes, focused responsive
samples and explicit actual-UI fault contexts. No remote novel fetch in tests;
source/rights review is separate. Chrome emulation does not qualify physical
Apple devices, audible speech, independent reading or learning.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('CHAPTER_MAP_ARTIFACTS') or tempfile.mkdtemp(prefix='chapter-map-'));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('chapter_map_existing_helpers',ROOT/'test/two-threads-browser.py');t=importlib.util.module_from_spec(spec);spec.loader.exec_module(t)
h=t.h;h.OUT=OUT;t.OUT=OUT

def source():return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{chapterSource}from'./dist/chapter-connections-content.mjs';console.log(JSON.stringify(chapterSource()));"],cwd=ROOT,text=True))
def sel(k,v=None):return '[data-cm-'+k+('="'+str(v)+'"' if v is not None else '')+']'
def click(p,k,v=None):p.locator(sel(k,v)+':visible').first.click()
def enter(p):p.locator('[data-ev-chapter-map]').click();p.locator(sel('root')).wait_for()
def setup(browser,base,seed,width=820):
 c,p=t.setup(browser,base,seed,width=width);p.locator('[data-ev-chapter-map]').wait_for();return c,p

def maps(p):return h.book(p).get('chapterMaps',[])
def pair(p):return p.locator(sel('pair')).inner_text()
def connect(p,left,right,kind):
 click(p,'turn','map');click(p,'chapter',left);click(p,'pin','left');click(p,'chapter',right);click(p,'pin','right');click(p,'turn','compare');click(p,'kind',kind);click(p,'connect')
def open_map(p,id):
 click(p,'shelf')
 for _ in range(20):
  if p.locator(sel('card',id)).count():click(p,'card',id);return
  earlier=p.locator(sel('page',-1))
  if not earlier.count() or earlier.is_disabled():break
  earlier.click()
 raise AssertionError('Missing source-owned map '+id)
def hear(p):return t.hear(p,sel('hear'))
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no page overflow')
 bad=p.locator('[data-cm-root] button,[data-cm-root] summary,[data-cm-root] a').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'visible task controls have44px targets and16px text: '+str(bad))
 bad=p.locator('[data-cm-root] p,[data-cm-root] blockquote,[data-cm-root] label').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&parseFloat(getComputedStyle(x).fontSize)<16).map(x=>x.textContent)')
 h.ok(not bad,'book/source/retelling text stays16px: '+str(bad))
def activate_after_reload(p):
 p.locator('[data-select-explorer],[data-ev-chapter-map]').first.wait_for()
 if not p.locator('[data-ev-chapter-map]').count():
  active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');p.locator('[data-select-explorer="'+active+'"]').click()
 p.locator('[data-ev-chapter-map]').wait_for()

def journey(browser,base,seed,book_source):
 print('Chapter Map: ordinary actual-app tablet journey',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(t.SPEECH_FIXTURE);before=copy.deepcopy(h.book(p));external=[];p.on('request',lambda r:external.append(r.url) if 'gutenberg.org' in r.url else None);enter(p)
  h.ok(p.locator('#cm-heading').evaluate('e=>e===document.activeElement'),'entry focuses the new activity heading')
  h.ok(len(p.locator('[data-cm-map] [data-cm-chapter]').all())==12 and 'chapterMaps' not in h.book(p),'all12 chapter nodes open without a saved root or reading flag');bounds(p)
  first_speech=hear(p);h.ok(book_source['chapters'][0]['summary'] not in first_speech and book_source['examples'][0]['text'] not in first_speech and book_source['demo']['steps'][1]['text'] not in first_speech and book_source['chapters'][0]['noticeQuestion'] not in first_speech and book_source['chapters'][0]['furtherQuestion'] not in first_speech,'closed plot details and unelected interpretations/miniature frames are not narrated')
  for chapter in book_source['chapters']:
   click(p,'chapter',chapter['id']);link=p.locator(sel('chapter-panel')+' '+sel('full'))
   h.ok(link.get_attribute('href')==f'https://www.gutenberg.org/cache/epub/289/pg289-images.html#{chapter["fragment"]}' and link.get_attribute('target')=='_blank' and set((link.get_attribute('rel') or '').split())>={'noopener','noreferrer'},'each chapter has its own complete public outside-game link')
  h.ok(not external,'the game never fetches the external full book on entry or chapter selection')
  click(p,'chapter','c1');p.locator(sel('plot','map')+'>summary').click();h.ok(book_source['chapters'][0]['summary'] in hear(p),'opening retelling elects exactly labelled supplied plot material')
  click(p,'turn','quotes')
  for quote in book_source['quotes']:
   click(p,'quote',quote['id']);q=p.locator(sel('quote-panel'))
   h.ok(q.locator(sel('block')).all_text_contents()==quote['blocks'],'all original quote blocks remain visible in '+quote['id'])
   joins=q.locator('[data-cm-join]').evaluate_all('xs=>xs.map(x=>({kind:x.dataset.cmJoin,text:x.textContent}))')
   h.ok([j['kind'] for j in joins]==quote['joins'],'paragraph boundaries and actual omissions stay distinct in '+quote['id'])
   h.ok(all(j['text'].strip() for j in joins if j['kind']=='omission'),'noncontiguous blocks have visible omission labels')
   if quote['id']=='face-first':h.ok(not any(j['kind']=='omission' for j in joins),'continuous successive paragraphs are not falsely presented as omitted text')
  q=book_source['quotes'][-1];payload=hear(p);h.ok(all(block in payload for block in q['blocks']) and book_source['quotes'][0]['blocks'][0] not in payload,'Hear includes all active quote blocks, no unseen earlier quote');bounds(p)
  connect(p,'c1','c5','change');connect(p,'c2','c6','question');h.ok(p.locator('[data-cm-link]').count()==2,'explicit chapter/kind choices create two ungraded connections')
  connect(p,'c5','c1','change');h.ok(p.locator('[data-cm-link]').count()==2 and 'already' in p.locator('#cm-status').inner_text(),'reversed duplicate focuses the existing stored orientation')
  connect(p,'c1','c10','echo');click(p,'remove');h.ok(p.locator('[data-cm-link]').count()==2,'Remove targets the displayed connection only')
  click(p,'kind','other');h.ok(p.locator(sel('remove')).is_disabled(),'editing kind clears removal focus rather than targeting an older connection')
  click(p,'link',0);click(p,'reference');h.ok(p.locator(sel('help','reference')).count()==1,'reader interpretation is separately elected');payload=hear(p)
  h.ok(book_source['examples'][0]['text'] in payload and book_source['examples'][1]['text'] not in payload,'only the selected reader example is spoken')
  click(p,'reference-page',1);click(p,'help-back');click(p,'teach');payload=hear(p)
  h.ok(all(ch['text'] in payload for ch in book_source['demo']['chapters']) and book_source['demo']['steps'][1]['text'] not in payload,'complete miniature is supplied while commentary advances one elected frame at a time')
  click(p,'demo-step',1);click(p,'help-back');click(p,'keep');first=copy.deepcopy(maps(p)[0]);w=first['work'];h.ok(len(w['connections'])==2 and w['referenceShown'] and w['teachingSeen']==2,'Keep freezes chosen connections and explicit help without recording chapters read')
  frozen=copy.deepcopy(first);click(p,'turn','map');click(p,'chapter','c10');click(p,'turn','compare');click(p,'link',1)
  h.ok(maps(p)[0]==frozen and p.locator(sel('kind','change')).is_disabled(),'kept chapter/link browsing changes no saved selection or choices')
  click(p,'copy');click(p,'keep');adopted=copy.deepcopy(maps(p)[-1]);h.ok(adopted['work']['selected']=='c10' and (adopted['work']['left'],adopted['work']['right'],adopted['work']['kind'])==('c2','c6','question'),'first new copy adopts visited chapter and stored link focus')
  open_map(p,first['id']);click(p,'turn','compare');click(p,'link',0);click(p,'copy');connect(p,'c5','c9','change');waiting=pair(p)
  click(p,'back');p.locator('[data-ev-root]').wait_for();h.ok(p.evaluate('location.hash')=='#learn/english/write' and h.book(p)['evidenceVoice']==before['evidenceVoice'],'controlled Back restores the exact parent lesson, paragraph and annotation')
  enter(p);h.ok(pair(p)==waiting,'controlled reentry retains the waiting copy')
  open_map(p,first['id']);click(p,'turn','compare');click(p,'link',1);click(p,'copy');h.ok(pair(p)==waiting,'return to an already waiting copy never overwrites its edits with new saved-link focus')
  click(p,'keep');h.ok(maps(p)[0]==frozen and len(maps(p)[-1]['work']['connections'])==3,'copy revision adds a new immutable map and preserves its original')
  click(p,'draft');click(p,'turn','map');click(p,'chapter','c12');click(p,'pin','left');click(p,'keep');h.ok(maps(p)[-1]['work']['left']=='c12' and maps(p)[-1]['work']['right'] is None and maps(p)[-1]['work']['kind'] is None,'one-sided unfinished connection material is keepable')
  click(p,'back');p.locator('[data-ev-root]').wait_for();p.reload(wait_until='networkidle');activate_after_reload(p);enter(p);open_map(p,first['id']);h.ok(maps(p)[0]==frozen,'reload preserves frozen source/work/support')
  after=copy.deepcopy(h.book(p));after.pop('chapterMaps');h.ok(after==before,'Chapter Map preserves all other notebook roots and waiting original English work')
  p.screenshot(path=str(OUT/'tablet.png'),full_page=True);report=h.export_notes(p,'chapter-map-kept');h.ok(report['chapterMaps']==maps(p),'actual Notes download contains exact complete small packs and connections');return report
 finally:c.close()

def history_records(report):
 record=copy.deepcopy(report['chapterMaps'][0]);record['id']='chapter-map-50';record['outerFuture']={'exact':['kept']};s=record['source'];s['id']='earlier-book';s['title']='<Earlier & complete>';s['book']['ebookNumber']=42;s['book']['title']='<Earlier & complete>';s['quotes']=[]
 s['chapters']=[dict(copy.deepcopy(ch),id='old'+str(i+1),number=number,title='Repeated title',mapLabel='Earlier '+str(i+1),fragment='part'+str(number),summary='Own earlier retelling '+str(i+1)) for i,(ch,number) in enumerate(zip(s['chapters'][:3],[4,8,15]))]
 s['examples']=[{'title':'Own earlier connection','left':'old1','right':'old3','kind':'other','quoteIds':[],'text':'An earlier reader’s own comparison.'}];s['futureSource']={'exact':True}
 record['work']={'v':1,'selected':'old1','left':'old1','right':'old3','kind':'other','connections':[{'left':'old1','right':'old3','kind':'other','futureRow':{'raw':7}}],'referenceShown':False,'teachingSeen':0,'futureWork':{'exact':True}}
 malformed=copy.deepcopy(record);malformed['id']='chapter-map-51';malformed['work']['connections'] += [None,{'left':'foreign','right':'old2','kind':'change'}];malformed['work']['referenceShown']='future';malformed['work']['left']='foreign'
 bad=copy.deepcopy(record);bad['id']='chapter-map-52';bad['source']['chapters']=[]
 duplicate=copy.deepcopy(record);duplicate['id']='chapter-map-53'
 return [record,malformed,bad,duplicate,copy.deepcopy(duplicate)]

def transfer(browser,base,seed,report):
 print('Chapter Map: real Notes import and source-owned partial history',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(t.SPEECH_FIXTURE);original=copy.deepcopy(h.book(p));old_id=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');altered=copy.deepcopy(report);rows=history_records(report);altered['chapterMaps']+=rows
  p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'synthetic-chapter-history.json','mimeType':'application/json','buffer':json.dumps(altered).encode()})
  p.locator('#progress-import-preview').wait_for();h.ok('The Chapter Map reading maps' in p.locator('.import-preview').inner_text(),'actual import summary uses the friendly Chapter Map label')
  p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();h.ok(p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')!=old_id,'import creates a separate explorer')
  p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-chapter-map]').wait_for();enter(p);open_map(p,'chapter-map-50')
  h.ok(p.locator('[data-cm-map] [data-cm-chapter]').count()==3 and '<Earlier & complete>' in p.locator(sel('root')).inner_text() and not p.locator('[data-cm-root] earlier').count(),'historical own chapter count/title/HTML text are used without catalogue refill')
  names=p.locator('[data-cm-map] [data-cm-chapter]').evaluate_all('xs=>xs.map(x=>x.getAttribute("aria-label")||x.textContent)');h.ok(len(set(names))==3,'repeated historical titles still have distinct chapter numbers/accessibility labels')
  click(p,'chapter','old3');link=p.locator(sel('chapter-panel')+' '+sel('full'));h.ok(link.get_attribute('href')=='https://www.gutenberg.org/cache/epub/42/pg42-images.html#part15','historical full-chapter link derives solely from own numeric edition and fragment')
  click(p,'copy');click(p,'keep');copied=maps(p)[-1];h.ok(copied['outerFuture']==rows[0]['outerFuture'] and copied['source']==rows[0]['source'] and copied['work']['futureWork']==rows[0]['work']['futureWork'],'new kept copy retains unknown outer/source/work fields')
  open_map(p,'chapter-map-51');click(p,'turn','compare');h.ok(p.locator(sel('link',0)).count()==1 and p.locator(sel('copy')).is_disabled(),'malformed work keeps individually readable connections view-only')
  click(p,'link',0);click(p,'turn','map');click(p,'chapter','old2');h.ok(maps(p)[len(report['chapterMaps'])+1]==rows[1],'view-only own chapter/link inspection leaves malformed saved bytes exact')
  click(p,'shelf');h.ok(not p.locator(sel('card','chapter-map-52')).count() and not p.locator(sel('card','chapter-map-53')).count(),'bad source and duplicate IDs cannot open ambiguous records')
  out=h.export_notes(p,'chapter-map-history');h.ok(out['chapterMaps'][:-1]==altered['chapterMaps'] and out['syntheticOther']==original['syntheticOther'],'actual redownload retains bad/duplicate/partial rows and large unrelated Notes')
  h.ok(p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',old_id)==original,'historical import/copy leaves the original explorer unchanged')
  p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-chapter-map]').wait_for();enter(p);open_map(p,'chapter-map-50');old_copy=p.locator(sel('copy')).element_handle()
  p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function('location.hash==="#home"');p.locator('[data-film-skip]').wait_for();p.locator('[data-film-skip]').click();p.locator('dialog.welcome-film').wait_for(state='detached')
  p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-chapter-map]').wait_for();enter(p);before_reset_stale=copy.deepcopy(h.book(p));old_copy.evaluate('e=>e.click()');h.ok('chapterMaps' not in h.book(p) and h.book(p)==before_reset_stale,'confirmed reset clears this notebook and old map controls cannot resurrect it')
 finally:c.close()

def samples(browser,base,seed):
 for width in [320,1024]:
  c,p=setup(browser,base,seed,width)
  try:
   p.evaluate(t.SPEECH_FIXTURE);enter(p);bounds(p);button=p.locator(sel('chapter','c5'));button.focus();p.keyboard.press('Enter');h.ok(p.locator(sel('chapter-panel')).inner_text().find('Dulce Domum')>=0,'keyboard chapter selection remains available')
   click(p,'pin','left');click(p,'chapter','c1');p.locator(sel('pin','right')).tap();click(p,'turn','compare');click(p,'kind','change');click(p,'connect');bounds(p)
   click(p,'turn','quotes');click(p,'quote','changed-toad');bounds(p);payload=hear(p);h.ok('He was indeed an altered Toad!' in payload,'responsive active quote narration includes all selected blocks')
   click(p,'reference');p.locator(sel('reference-page',1)).focus();p.keyboard.press('Enter');bounds(p);p.screenshot(path=str(OUT/f'sample-{width}.png'),full_page=True)
  finally:c.close()

def storage(browser,base,seed):
 for fault in ['saving-off','quota-device-api']:
  c,p=setup(browser,base,seed)
  try:
   if fault=='saving-off':
    p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#learn/english"');p.locator('[data-ev-chapter-map]').wait_for()
   enter(p);click(p,'pin','left');before=p.evaluate('JSON.stringify(localStorage)')
   if fault=='quota-device-api':p.evaluate('()=>{Storage.prototype.setItem=function(){throw new DOMException("Synthetic quota refusal","QuotaExceededError")};}')
   click(p,'keep');h.ok(p.evaluate('JSON.stringify(localStorage)')==before,fault+' does not pretend device persistence succeeded')
   notice=p.locator('#cm-status').inner_text();h.ok('kept in this open page' in notice and ('Saving is off' in notice if fault=='saving-off' else 'did not confirm a save' in notice) and 'download Notes' in notice,fault+' accurately distinguishes open-page recovery from device persistence')
   out=h.export_notes(p,'chapter-map-'+fault);h.ok(out['chapterMaps'][-1]['work']['left']=='c1',fault+' real Notes rescues the kept in-memory map')
  finally:c.close()

# Reuse the actual English UI fault harness; qualify with the real pretty Notes importer.
HARNESS=t.HARNESS.replace('canExport:c=>v.allow&&transfer.prepareProgressImport(JSON.stringify(report(c))).ok','canExport:c=>{v.preflights=(v.preflights||0)+1;return v.allow&&transfer.prepareProgressImport(JSON.stringify(report(c),null,2)).ok}').replace('window.ttHarness=v;','v.report=report;window.ttHarness=v;')
def install(p,seed):p.evaluate(HARNESS,{'seed':seed});p.locator('[data-ev-chapter-map]').wait_for()
def fault_journey(browser,base,seed):
 print('Chapter Map: actual parent refusal, Notes capacity and stale controls',flush=True)
 c,p=setup(browser,base,seed)
 try:
  p.evaluate(t.SPEECH_FIXTURE);install(p,seed);p.evaluate('ttHarness.allow=false');field=p.locator('[data-ev-field="paragraph"]');field.fill('A synthetic paragraph waiting after refusal.');p.locator('[data-ev-chapter-map]').click()
  h.ok(not p.locator(sel('root')).count() and field.input_value()=='A synthetic paragraph waiting after refusal.','refused parent paragraph blocks new mode without losing visible words')
  p.evaluate('ttHarness.allow=true');field.fill('A synthetic paragraph saved after retry.');enter(p);click(p,'back');p.locator('[data-ev-root]').wait_for()
  p.evaluate('ttHarness.allow=false');p.locator('[data-ev-note-text]').fill('A synthetic annotation waiting after refusal.');p.locator('[data-ev-chapter-map]').click();h.ok(not p.locator(sel('root')).count() and p.locator('[data-ev-note-text]').input_value()=='A synthetic annotation waiting after refusal.','refused annotation blocks Chapter Map without clearing its dirty marker')
  p.evaluate('ttHarness.allow=true');p.locator('[data-ev-note-kind]').select_option('literal');enter(p)
  # The candidate notebook fits the core cap while its real Notes wrapper exceeds it.
  click(p,'pin','left')
  proof=p.evaluate('''async()=>{const core=await import('./chapter-connections-core.mjs'),content=await import('./chapter-connections-content.mjs'),limits=await import('./progress-limits.mjs'),transfer=await import('./progress-transfer.mjs');const s=content.chapterSource(),w=core.changeChapterWork(s,core.newChapterWork(s),'pinleft','c1'),v=ttHarness,candidate=structuredClone(v.book);candidate.chapterMaps=[{id:'chapter-map-1',source:s,work:w}];candidate.syntheticCapacity='';const base=new TextEncoder().encode(JSON.stringify(candidate,null,2)).length;v.book.syntheticCapacity='x'.repeat(limits.MAX_IMPORT_BYTES-base-40);candidate.syntheticCapacity=v.book.syntheticCapacity;return {candidateFits:limits.recoveryFitsProgressLimits(candidate),notesFits:transfer.prepareProgressImport(JSON.stringify(v.report(candidate),null,2)).ok}}''')
  h.ok(proof=={'candidateFits':True,'notesFits':False},'actual Notes-wrapper refusal is distinct from the core candidate-size limit')
  before=p.evaluate('JSON.stringify(ttHarness.book)');preflights=p.evaluate('ttHarness.preflights||0');click(p,'keep');h.ok(p.evaluate('JSON.stringify(ttHarness.book)')==before and p.evaluate('ttHarness.preflights')>preflights,'real capacity preflight refuses Keep without any original mutation')
  h.ok('still on this page' in p.locator('#cm-status').inner_text() and 'Opening Notes clears unkept maps' in p.locator('#cm-status').inner_text(),'capacity notice names the unkept map and warns that leaving for Notes clears it');p.evaluate('delete ttHarness.book.syntheticCapacity');click(p,'keep');h.ok(p.evaluate('ttHarness.book.chapterMaps[0].work.left')=='c1','refused material remains keepable after actual capacity is available')
  def start():install(p,seed);enter(p)
  start();before=p.locator(sel('chapter-panel')).inner_text();p.locator(sel('chapter','c5')).evaluate('e=>{const parent=e.parentNode;e.remove();parent.append(e);e.click()}');h.ok(p.locator(sel('chapter-panel')).inner_text()==before,'same-parent removed/reinserted chapter control is inert')
  start();p.locator(sel('pin','left')).evaluate('e=>{const parent=e.parentNode;e.remove();parent.append(e);e.click()}');click(p,'keep');h.ok(p.evaluate('ttHarness.book.chapterMaps[0].work.left') is None,'same-parent removed/reinserted pin cannot edit the map')
  start();old=p.locator(sel('hear')).element_handle();p.evaluate('ttHarness.owner="other-owner"');before=p.evaluate('JSON.stringify([ttHarness.book,ttHarness.saves,ttHarness.renders,ttSpoken,ttStops])');old.evaluate('e=>e.click()');h.ok(p.evaluate('JSON.stringify([ttHarness.book,ttHarness.saves,ttHarness.renders,ttSpoken,ttStops])')==before,'an earlier owner Hear cannot request speech or mutate a notebook')
  start();click(p,'keep');copybutton=p.locator(sel('copy')).element_handle();p.evaluate('ttHarness.book.chapterMaps[0].source.title="Externally changed source"');before=p.evaluate('JSON.stringify([ttHarness.book,ttHarness.renders])');copybutton.evaluate('e=>e.click()');h.ok(p.evaluate('JSON.stringify([ttHarness.book,ttHarness.renders])')==before,'changed saved-source bytes invalidate captured Copy')
  start();root=p.locator(sel('root')).element_handle();old=p.locator(sel('keep')).element_handle();old_hear=p.locator(sel('hear')).element_handle();old_full=p.locator(sel('full')).first.element_handle();click(p,'back');root.evaluate('e=>document.querySelector("main").append(e)');before=p.evaluate('JSON.stringify([ttHarness.book,ttHarness.renders,ttSpoken,ttStops])');old.evaluate('e=>e.click()');old_hear.evaluate('e=>e.click()');cancelled=old_full.evaluate('e=>!e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok(cancelled and p.evaluate('JSON.stringify([ttHarness.book,ttHarness.renders,ttSpoken,ttStops])')==before,'reinserted retired Keep, Hear and complete-chapter anchor remain inert after controlled Back')
 finally:c.close()

def main():
 seed=t.fixture();book_source=source()
 class Quiet(http.server.SimpleHTTPRequestHandler):
  protocol_version='HTTP/1.1'
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    report=journey(browser,base,seed,book_source);transfer(browser,base,seed,report);samples(browser,base,seed);storage(browser,base,seed);fault_journey(browser,base,seed)
    h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'scope':__doc__};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
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
