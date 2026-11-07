"""Walton407: real app reading, retained writing and recovery, synthetic notebooks only.
One tablet journey and a narrow sample; shared helpers supply app setup/Notes download.
Speech payloads are inspected; audible quality and physical devices are not qualified.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('WALTON_ARTIFACTS') or tempfile.mkdtemp(prefix='walton-letters-'));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('walton_reading_helpers',ROOT/'test/freedom-documents-browser.py');f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f);cg=f.cg;h=f.h;h.OUT=OUT
FIXED='walton-letters';ROUTE='#learn/english/walton-letters'
FIT={'speaker':'choice-1','imagination':'choice-2','friend':'choice-3','master':'choice-2','tension':'choice-1','limits':'choice-3'}
def go(p,route=ROUTE):f.go(p,route)
def work(p):return f.work(p)
def lesson(p,id):f.lesson(p,id)
def open_letters(p):f.open_packet(p)
def import_notes(p,report):
 go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'invented-literary.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
def order_and_notice(p):
 h.ok(p.locator('.ev-question').evaluate_all('xs=>xs.every(x=>x.compareDocumentPosition(document.querySelector(".ev-reading"))&Node.DOCUMENT_POSITION_FOLLOWING)'),'questions precede active source reading')
 h.ok('outdated stereotypes' in p.locator('[data-ev-root]').inner_text(),'source notice is visible before reading')
 h.ok(p.locator('.ev-reading .ev-chapter').first.locator('.ev-passage').first.locator('.ev-anchor').inner_text()=='Our context, written today','modern context precedes original words')
def journey(browser,base):
 print('Walton: actual preview, complete letters, structured practice, annotation and revision',flush=True)
 c,p=cg.setup(browser,base,f.seed())
 try:
  before=copy.deepcopy(h.book(p));go(p);h.ok(h.book(p)==before,'preview leaves entire other notebook exact');h.ok(not p.locator('.ev-whole,[data-ev-audio],.ev-annotation,[data-ev-support]').count(),'preview has no disclosure/audio/annotation/support writer');h.ok('1831' in p.locator('header').inner_text() and 'Mary Shelley' in p.locator('[data-ev-root]').inner_text(),'preview identifies author and edition');open_letters(p);h.ok(h.book(p)['evidenceVoice']['current']==FIXED and work(p)['reading']=='unobserved','explicit Open selects letters without independent-reading inference');h.ok(h.book(p)['evidenceVoice']['units']['clock-river']==before['evidenceVoice']['units']['clock-river'],'earlier story remains exact');f.bounds(p);order_and_notice(p)
  sources=copy.deepcopy(work(p)['source']);h.ok([len([x for x in c['paragraphs'] if x.get('primary')]) for c in sources['chapters']]==[13,11],'both complete original letters are present');h.ok(sources['chapters'][0]['paragraphs'][1]['text']=='To Mrs. Saville, England.' and sources['chapters'][0]['paragraphs'][-2]['text']=='R. Walton.','source includes addressee and sign-off');h.ok(sources['chapters'][1]['paragraphs'][2]['text']=='Archangel, 28th March, 17—.','second letter retains its source date')
  for id,chapter_index in [('before',0),('compare',1)]:
   lesson(p,id);order_and_notice(p);chapter=sources['chapters'][chapter_index];h.ok(p.locator('.ev-reading .ev-primary').count()==(13 if id=='before' else 11),'only original book blocks carry primary styling');spoken=p.locator('.ev-reading .ev-chapter [data-speak]').get_attribute('data-speak');at=0
   for block in chapter['paragraphs']:
    label_at=spoken.find(block['label'],at);body_at=spoken.find(block['text'],label_at+len(block['label']));h.ok(label_at>=at and body_at>label_at,'Hear carries own ordered label and exact block');at=body_at+len(block['text'])
   support=copy.deepcopy(work(p)['support']);p.locator('.ev-whole [data-speak]').first.evaluate('e=>e.click()');h.ok(work(p)['support']==support,'hidden whole-source Hear does not record support');p.locator('.ev-reading [data-speak]').first.tap();h.ok('audio' in work(p)['support'][id],'visible Hear records audio separately')
   for question in (['speaker','imagination'] if id=='before' else ['friend','master']):
    p.locator('[data-ev-answer="'+question+':'+FIT[question]+'"]').tap()
  lesson(p,'later');order_and_notice(p);h.ok(not p.locator('.ev-revisit').count(),'literary comparison has no invented clock-story suspicion');
  for question in ['tension','limits']:p.locator('[data-ev-answer="'+question+':'+FIT[question]+'"]').tap()
  h.ok(len(work(p)['responses'])==6 and all(a['practice'] and a['outcome']=='fits' for a in work(p)['responses']),'six reviewed evidence responses are supported practice, not original-prose grades')
  p.locator('[data-ev-support="learn"]').tap();h.ok('Margaret' in p.locator('.ev-support').inner_text(),'own comparison teaching is available');
  for anchor,kind,note in [('l1-p8','literal','He asks for an encouraging voice.'),('l2-p4','inference','He wants a companion who can challenge plans.')]:
   p.locator('[data-ev-note-anchor]').select_option(anchor);p.locator('[data-ev-note-kind]').select_option(kind);p.locator('[data-ev-note-text]').fill(note);p.locator('[data-ev-note-keep]').tap();kept=work(p)['annotations'][-1];source=next(x for c in sources['chapters'] for x in c['paragraphs'] if x['id']==anchor);h.ok(kept['passage']==source['text'] and kept['kind']==kind,'annotation retains exact original source and chosen kind');d=p.locator('.ev-annotation details');d.locator('summary').click();h.ok(source['label'] in d.inner_text(),'kept annotation identifies book words with source-owned label');d.locator('summary').click()
  lesson(p,'write');p.locator('[data-ev-field="claim"]').fill('Walton presents preparation alongside a need for encouragement.');p.locator('[data-ev-field="detail"]').fill('Letter I: “my hopes fluctuate”; Letter II: “approve or amend my plans”.');p.locator('[data-ev-field="reasoning"]').fill('The phrases allow commitment and uncertainty together.');p.locator('[data-ev-field="paragraph"]').fill('Invented browser draft: these letters show Walton’s self-presentation, not the voyage’s outcome.');p.locator('[data-ev-keep="draft"]').tap();first=copy.deepcopy(work(p)['firstDraft']);lesson(p,'revise');p.locator('[data-ev-field="objection"]').fill('How does confidence coexist with the wish for encouragement?');p.locator('[data-ev-field="revision"]').fill('Invented revision: confident preparation and fluctuating hopes coexist. Margaret’s reply is not supplied.');p.locator('[data-ev-field="change"]').fill('I made the evidence limit explicit.');p.locator('[data-ev-keep="revision"]').tap();h.ok(work(p)['firstDraft']==first and work(p)['firstRevision']['drafts']['revision'].startswith('Invented revision'),'original draft and retained revision stay distinct');h.ok(h.book(p)['syntheticSibling']==before['syntheticSibling'],'unknown sibling stays exact');p.screenshot(path=str(OUT/'tablet.png'),full_page=True)
  saved=copy.deepcopy(h.book(p)['evidenceVoice']);report=h.export_notes(p,'walton-kept');h.ok(report['evidenceVoice']==saved,'actual Notes download retains original source and all work');go(p);p.reload(wait_until='networkidle');p.locator('[data-ev-root],[data-select-explorer="explorer-1"]').first.wait_for()
  if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').tap()
  p.locator('[data-ev-root]').wait_for();h.ok(h.book(p)['evidenceVoice']==saved,'reload preserves sources and first/latest work');return report
 finally:c.close()
def retained(browser,base,report):
 print('Walton: actual Notes import, own old source, neutral labels and unreadable recovery',flush=True)
 old=copy.deepcopy(report);w=old['evidenceVoice']['units'][FIXED];w['source']['kind']='earlier-unknown-reading';w['source']['title']='Earlier <literal> reading';w['source']['notice']='Earlier source notice stays literal.';w['source']['chapters'].reverse();w['source']['chapters'][0]['paragraphs'][1]['label']='';w['source']['chapters'][1]['paragraphs'][1]['label']={'future':True};w['source']['chapters'][1]['paragraphs'][2]['text']='Earlier invented retained source words.';w['source']['questions'][0]['choices'].reverse();w['source']['lessons'][3]['title']='Earlier reader note';old['evidenceVoice']['current']='clock-river'
 c,p=cg.setup(browser,base,f.seed())
 try:
  import_notes(p,old);go(p);h.ok('Saved reading'==p.locator('.ev-page h1').inner_text() and 'Earlier <literal> reading' in p.locator('.ev-page header').inner_text(),'retained unknown-kind preview is neutral and literal');h.ok('Frankenstein' not in p.locator('.ev-page header').inner_text() and '1831' not in p.locator('.ev-page header').inner_text(),'neutral preview borrows no current author/edition');h.ok(not p.locator('.ev-reading,.ev-whole,[data-ev-audio]').count(),'retained preview has no source disclosure');open_letters(p);h.ok(work(p)['source']==w['source'] and work(p)['responses']==w['responses'],'opening own edited source preserves source and historical outcomes');lesson(p,'before');h.ok('Earlier invented retained source words.' in p.locator('.ev-reading').inner_text(),'own historical source text is shown');h.ok('Passage l1-p1' in p.locator('.ev-reading').inner_text() and 'Passage l1-p1' in p.locator('.ev-reading [data-speak]').first.get_attribute('data-speak'),'invalid old label uses neutral visible and spoken fallback');lesson(p,'compare');h.ok('Passage l2-p1' in p.locator('.ev-reading').inner_text(),'empty old label uses own id fallback');lesson(p,'later');h.ok(not p.locator('.ev-revisit').count(),'neutral fixed-source reading has no clock-story fallback');h.ok(p.locator('.ev-whole>summary').inner_text()=='All saved source sections','neutral whole disclosure describes own saved sections');h.ok(work(p)['source']==w['source'],'neutral rendering does not rewrite optional metadata')
  bad=copy.deepcopy(old);bad['evidenceVoice']['units'][FIXED]={'future':['opaque',7]};import_notes(p,bad);go(p);h.ok(p.locator('.ev-page h1').inner_text()=='Saved reading','unreadable fixed source header is neutral');h.ok(not p.locator('[data-ev-open],.ev-reading,.ev-whole,[data-ev-more]').count(),'unreadable fixed source offers no failing Open or catalogue source');h.ok('Frankenstein' not in p.locator('.ev-page header').inner_text() and '1831' not in p.locator('.ev-page header').inner_text(),'unreadable header leaks no catalogue title/edition');h.ok(h.book(p)['evidenceVoice']['units'][FIXED]==bad['evidenceVoice']['units'][FIXED],'opaque source stays exact');p.locator('[data-ev-unit-open="clock-river"]').tap();h.ok(work(p)['source']['id']=='clock-river','other saved reading stays reachable')
 finally:c.close()
def dirty_and_capacity(browser,base):
 print('Walton: oversized raw writing and annotation gates, actual Notes capacity',flush=True)
 c,p=cg.setup(browser,base,f.seed())
 try:
  go(p,'#learn/english/write');p.locator('.ev-preview [data-ev-open]').tap();field=p.locator('[data-ev-field="paragraph"]');field.fill('Accepted invented earlier draft.');before=copy.deepcopy(h.book(p));old=field.element_handle();field.fill('x'*8001);p.locator('.ev-page header a[href="'+ROUTE+'"]').tap();h.ok(field.input_value()=='x'*8001 and old.evaluate('e=>e===document.querySelector("[data-ev-field=paragraph]")') and h.book(p)==before,'new-unit entry preserves oversized visible writing and entire notebook');p.locator('.ev-lessons [data-ev-open="before"]').tap();h.ok(field.input_value()=='x'*8001 and h.book(p)==before,'lesson navigation cannot discard oversized writing');field.fill('Corrected invented words.');p.locator('.ev-page header a[href="'+ROUTE+'"]').tap();p.locator('.ev-preview').wait_for();open_letters(p);p.locator('[data-ev-note-anchor]').select_option('l1-p3');p.locator('[data-ev-note-text]').fill('Accepted annotation.');before=copy.deepcopy(h.book(p));note=p.locator('[data-ev-note-text]');old=note.element_handle();note.fill('n'*2001);p.locator('.ev-lessons [data-ev-open="compare"]').tap();h.ok(note.input_value()=='n'*2001 and old.evaluate('e=>e===document.querySelector("[data-ev-note-text]")') and h.book(p)==before,'oversized annotation remains in its original DOM across refused lesson change');p.evaluate('location.hash="#home"');p.wait_for_function('location.hash==="#learn/english/before"');h.ok(note.input_value()=='n'*2001,'route guard preserves raw oversized annotation');note.fill('Recovered annotation.');lesson(p,'compare');h.ok(work(p)['lesson']=='compare','accepted correction permits navigation')
 finally:c.close()
 cap="s.padding='';const app=readFileSync('./dist/app.mjs','utf8'),decl=app.match(/^function notesReport\\(notebook\\)\\{.*\\}$/m)[0],report=Function('recommendations','explorerStore',decl+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});s.padding='x'.repeat(5*1024*1024-new TextEncoder().encode(JSON.stringify(report(s),null,2)).length-20);"
 c,p=cg.setup(browser,base,cg.fixture(cap))
 try:
  go(p);before=copy.deepcopy(h.book(p));p.locator('.ev-preview [data-ev-open]').tap();h.ok(h.book(p)==before and 'could not' in p.locator('#ev-status').inner_text(),'actual pretty Notes size cap refuses new source without mutation')
 finally:c.close()
def lifecycle_and_storage(browser,base):
 print('Walton: actual owner/route guards, saving off, storage failure and narrow touch sample',flush=True)
 c,p=cg.setup(browser,base,f.seed())
 try:
  go(p);open_letters(p);old=p.locator('.ev-lessons [data-ev-open="write"]').element_handle();p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();go(p);before=copy.deepcopy(h.book(p));old.evaluate('e=>e.click()');h.ok(h.book(p)==before,'previous owner control cannot write new owner');open_letters(p);lesson(p,'write');old=p.locator('[data-ev-keep="draft"]').element_handle();go(p,'#notes');before=copy.deepcopy(h.book(p));old.evaluate('e=>e.click()');h.ok(h.book(p)==before,'departed route Keep cannot mutate notebook')
 finally:c.close()
 for off in [True,False]:
  c,p=cg.setup(browser,base,f.seed())
  try:
   if off:
    go(p,'#notes');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click()
   go(p);open_letters(p);lesson(p,'write');before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')
   if not off:p.evaluate('window.waltonStorageSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException("Synthetic quota failure","QuotaExceededError")}')
   p.locator('[data-ev-field="paragraph"]').fill('Session-only invented literary explanation.');p.locator('[data-ev-keep="draft"]').tap();h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,('saving off' if off else 'storage failure')+' leaves persisted notebook exact');h.ok('lasts only' in p.locator('main').inner_text() if off else 'could not be saved reliably' in p.locator('main').inner_text(),'actual session-saving notice is truthful');report=h.export_notes(p,'walton-session-'+str(off));h.ok(report['evidenceVoice']['units'][FIXED]['firstDraft']['drafts']['paragraph'].startswith('Session-only'),'actual Notes download recovers session writing')
  finally:c.close()
 c,p=cg.setup(browser,base,f.seed(),width=320,height=700)
 try:
  go(p);f.bounds(p);open_letters(p);f.bounds(p);lesson(p,'compare');f.bounds(p);p.locator('[data-ev-answer="friend:choice-3"]').focus();p.keyboard.press('Enter');h.ok(work(p)['responses'][-1]['outcome']=='fits','narrow keyboard supplied response works');p.screenshot(path=str(OUT/'phone-320.png'),full_page=True)
 finally:c.close()
def main():
 class Quiet(http.server.SimpleHTTPRequestHandler):
  protocol_version='HTTP/1.1'
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    report=journey(b,base);retained(b,base,report);dirty_and_capacity(b,base);lifecycle_and_storage(b,base);h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));receipt={'status':'passed','checks':h.checks,'artifacts':str(OUT)};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:(OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
