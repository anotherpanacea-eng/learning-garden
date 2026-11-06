"""Actual app historical-reading journeys, invented notebook work only.
Speech payload boundaries are checked; audible quality/device reading are unqualified.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('FREEDOM_ARTIFACTS') or tempfile.mkdtemp(prefix='freedom-documents-'));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('reading_helpers',ROOT/'test/curve-window-browser.py');cg=importlib.util.module_from_spec(spec);spec.loader.exec_module(cg);h=cg.h;h.OUT=OUT
FIXED='freedom-documents';ROUTE='#learn/english/freedom-documents'
def seed(extra=''):
 return cg.fixture("const ev=await import('./dist/evidence-voice-core.mjs');const o={canExport:()=>true};ev.startEvidenceVoice(s,'clock-river',o);ev.setEvidenceText(s,'interpretation','Earlier invented interpretation.',o);"+extra)
def go(p,route=ROUTE):p.evaluate('location.hash='+json.dumps(route));p.locator('[data-ev-root]' if route.startswith('#learn/english') else 'main').wait_for()
def work(p):
 b=h.book(p);return b['evidenceVoice']['units'][b['evidenceVoice']['current']]
def lesson(p,id):p.locator('.ev-lessons [data-ev-open="'+id+'"]').tap();p.locator('#ev-heading').wait_for()
def open_packet(p):p.locator('.ev-preview [data-ev-open]').tap();p.locator('.ev-reading').wait_for()
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no page overflow')
 bad=p.locator('[data-ev-root] button,[data-ev-root] select,[data-ev-root] a,[data-ev-root] summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)');h.ok(not bad,'44px controls and 16px text: '+str(bad))
def journey(browser,base):
 print('Freedom Documents actual preview, sources, questions, exact annotations and writing',flush=True)
 c,p=cg.setup(browser,base,seed())
 try:
  before=copy.deepcopy(h.book(p));go(p);h.ok(h.book(p)['evidenceVoice']==before['evidenceVoice'],'preview leaves another current story exact');h.ok(not p.locator('.ev-whole,[data-ev-audio],.ev-annotation').count(),'preview has no controls that can mark another unit read/heard');h.ok('selected excerpts, not complete documents' in p.locator('.ev-page header').inner_text(),'historical header has honest source kind');open_packet(p);w=work(p);h.ok(w['source']['kind']=='historical-pair' and w['reading']=='unobserved','explicit Open starts historical unit without reading inference');support_before=copy.deepcopy(work(p)['support']);p.locator('.ev-whole [data-speak]').first.evaluate('e=>e.click()');h.ok(work(p)['support']==support_before,'hidden whole-source Hear cannot record audio support');h.ok(h.book(p)['evidenceVoice']['units']['clock-river']==before['evidenceVoice']['units']['clock-river'],'opening historical unit preserves prior story');bounds(p)
  for id in ['before','compare','later','write','revise']:
   lesson(p,id);h.ok(work(p)['lesson']==id,'every lesson is directly open')
   if id in ['before','compare','later']:
    for q in work(p)['source']['questions']:
     if q['lesson']==id:
      fit=next(c['id'] for c in q['choices'] if c['outcome']=='fits');p.locator('[data-ev-answer="'+q['id']+':'+fit+'"]').tap()
  h.ok(len(work(p)['responses'])==6 and all(x['practice'] for x in work(p)['responses']),'six supplied checks remain practice, not prose grades');h.ok(not p.locator('.ev-revisit').count(),'historical reading has no narrated-suspicion fallback')
  lesson(p,'compare');chapter=work(p)['source']['chapters'][1];spoken=p.locator('.ev-reading .ev-chapter [data-speak]').get_attribute('data-speak');at=-1
  for paragraph in chapter['paragraphs']:
   label_at=spoken.find(paragraph['label'],at+1);text_at=spoken.find(paragraph['text'],label_at);h.ok(label_at>at and text_at>label_at,'Hear preserves ordered source-owned label and exact body');at=text_at
  h.ok('https://' not in spoken,'citation URLs are not spoken');h.ok(p.locator('.ev-reading .ev-primary').count()==3,'only primary fragments have primary styling');p.locator('[data-ev-support="learn"]').tap();h.ok('Apprehend:' in p.locator('.ev-support').inner_text() or 'apprehend:' in p.locator('.ev-support').inner_text(),'older language has glossary help')
  p.locator('[data-ev-note-anchor]').select_option('p-rights');p.locator('[data-ev-note-kind]').select_option('literal');p.locator('[data-ev-note-text]').fill('An invented annotation on the rights claim.');p.locator('[data-ev-note-keep]').tap();h.ok(work(p)['annotations'][-1]['passage']==next(x['text'] for x in chapter['paragraphs'] if x['id']=='p-rights'),'annotation retains exact primary words, not our label/context')
  lesson(p,'write');p.locator('[data-ev-field="claim"]').fill('The two documents use rights language for different purposes.');p.locator('[data-ev-field="detail"]').fill('Two short quotations would go here in this invented browser draft.');p.locator('[data-ev-field="paragraph"]').fill('First invented explanation. A request is not a record of its result.');p.locator('[data-ev-keep="draft"]').tap();first=copy.deepcopy(work(p)['firstDraft']);lesson(p,'revise');p.locator('[data-ev-field="objection"]').fill('What happened afterward, if anything?');p.locator('[data-ev-field="revision"]').fill('Second invented explanation keeps the request and outcome separate.');p.locator('[data-ev-field="change"]').fill('I named the evidence limit.');p.locator('[data-ev-keep="revision"]').tap();h.ok(work(p)['firstDraft']==first and work(p)['firstRevision']['drafts']['revision'].startswith('Second invented'),'original and reader-directed revision are distinct');h.ok(h.book(p)['syntheticSibling']==before['syntheticSibling'],'unknown sibling unchanged');p.screenshot(path=str(OUT/'tablet.png'),full_page=True)
  report=h.export_notes(p,'freedom-kept');h.ok(report['evidenceVoice']==h.book(p)['evidenceVoice'],'actual Notes download retains sources and first/latest work');go(p);saved=copy.deepcopy(h.book(p)['evidenceVoice']);p.reload(wait_until='networkidle');p.locator('[data-ev-root],[data-select-explorer="explorer-1"]').first.wait_for();
  if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').tap()
  p.locator('[data-ev-root]').wait_for();h.ok(h.book(p)['evidenceVoice']==saved,'actual reload retains frozen sources and writing');return report
 finally:c.close()
def recovery(browser,base):
 print('Freedom Documents actual rejected writing, browser history and preview entry',flush=True)
 c,p=cg.setup(browser,base,seed())
 try:
  go(p,'#learn/english/write');p.locator('.ev-preview [data-ev-open]').tap();field=p.locator('[data-ev-field="paragraph"]');field.fill('Earlier accepted invented paragraph.');before=copy.deepcopy(h.book(p));old=field.element_handle();field.fill('x'*8001);h.ok(field.input_value()=='x'*8001 and field.get_attribute('aria-invalid')=='true','rejected text remains visible');p.locator('.ev-page header a[href="'+ROUTE+'"]').tap();h.ok(old.evaluate('e=>e===document.querySelector("[data-ev-field=paragraph]")') and 'freedom-documents' not in h.book(p)['evidenceVoice']['units'],'dirty entry refuses without replacing original story DOM');p.go_back();p.wait_for_function('location.hash==="#learn/english/write"');h.ok(field.input_value()=='x'*8001,'browser Back restores captured route with rejected writing');p.evaluate('location.hash="#home"');p.wait_for_function('location.hash==="#learn/english/write"');h.ok(h.book(p)==before,'hash refusal keeps entire saved notebook exact');p.locator('#explorer-switch').focus();p.keyboard.press('Enter');h.ok(field.input_value()=='x'*8001,'keyboard header activation cannot discard rejected writing');h.ok(p.evaluate('!dispatchEvent(new Event("beforeunload",{cancelable:true}))'),'pending refresh dispatch requests browser warning');field.fill('Recovered invented paragraph.');p.locator('.ev-page header a[href="'+ROUTE+'"]').tap();p.locator('.ev-preview').wait_for();h.ok(h.book(p)['evidenceVoice']['units']['clock-river']['drafts']['paragraph']=='Recovered invented paragraph.','accepted correction allows preview without losing story work');go(p,'#home');p.go_back();p.locator('.ev-preview').wait_for();open_packet(p);lesson(p,'write');field=p.locator('[data-ev-field="paragraph"]');field.fill('y'*8001);p.go_forward();p.wait_for_function('location.hash==="#learn/english/write"');h.ok(field.input_value()=='y'*8001,'browser Forward toward a different Home entry preserves rejected historical writing')
 finally:c.close()
def historical_and_unreadable(browser,base,report):
 print('Freedom Documents actual import, old source, unreadable fixed key and other work',flush=True)
 changed=copy.deepcopy(report);w=changed['evidenceVoice']['units'][FIXED];w['source']['title']='Earlier <literal> documents';w['source']['chapters'][0]['paragraphs'][1]['text']='Earlier invented stored primary wording.';w['source']['chapters'][0]['paragraphs'][1]['label']='';w['source']['questions'][0]['choices'][0]['label']='Earlier saved choice wording.';w['drafts']['revision']='Earlier saved revision.'
 c,p=cg.setup(browser,base,seed())
 try:
  go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'invented-historical.json','mimeType':'application/json','buffer':json.dumps(changed).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();go(p);h.ok('Earlier <literal> documents' in p.locator('.ev-page header').inner_text(),'import reads literal saved source, not current catalogue');lesson(p,'before');h.ok('Earlier invented stored primary wording.' in p.locator('.ev-reading').inner_text(),'past exact paragraph retained');spoken=p.locator('.ev-reading [data-speak]').get_attribute('data-speak');h.ok('Passage d-claim' in p.locator('.ev-reading').inner_text() and 'Passage d-claim' in spoken,'old empty label uses same neutral visible and spoken fallback');h.ok(work(p)['source']==w['source'],'viewing old source does not rewrite it');h.ok(work(p)['responses']==w['responses'],'old saved attempts not regraded against changed source choices')
  bad=copy.deepcopy(changed);bad['evidenceVoice']['units'][FIXED]={'future':['retained',7]};go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'invented-future.json','mimeType':'application/json','buffer':json.dumps(bad).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();go(p);h.ok('Earlier historical work is retained' in p.locator('main').inner_text(),'unreadable fixed key has honest notice');h.ok(not p.locator('[data-ev-open],.ev-reading,.ev-whole').count(),'unreadable route offers no failing Open or catalogue excerpts');h.ok(h.book(p)['evidenceVoice']['units'][FIXED]==bad['evidenceVoice']['units'][FIXED],'raw future fixed unit stays exact');p.locator('[data-ev-unit-open="clock-river"]').tap();h.ok(work(p)['source']['id']=='clock-river','other saved reading is reachable')
 finally:c.close()
def boundaries(browser,base):
 cap="s.padding='';const app=readFileSync('./dist/app.mjs','utf8'),decl=app.match(/^function notesReport\\(notebook\\)\\{.*\\}$/m)[0],report=Function('recommendations','explorerStore',decl+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});s.padding='x'.repeat(5*1024*1024-new TextEncoder().encode(JSON.stringify(report(s),null,2)).length-20);"
 c,p=cg.setup(browser,base,cg.fixture(cap))
 try:
  go(p);before=copy.deepcopy(h.book(p));p.locator('.ev-preview [data-ev-open]').tap();h.ok(h.book(p)==before and 'could not' in p.locator('#ev-status').inner_text(),'actual pretty Notes capacity refuses source allocation without mutation')
 finally:c.close()
 c,p=cg.setup(browser,base,seed())
 try:
  go(p);open_packet(p);old=p.locator('.ev-lessons [data-ev-open="write"]').element_handle();p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();go(p);before=copy.deepcopy(h.book(p));old.evaluate('e=>e.click()');h.ok(h.book(p)==before,'old explorer lesson button cannot write new explorer');open_packet(p);lesson(p,'write');old=p.locator('[data-ev-keep="draft"]').element_handle();go(p,'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click();p.locator('[data-film-skip]').click();go(p);old.evaluate('e=>e.click()');h.ok('evidenceVoice' not in h.book(p),'reset plus old Keep cannot recreate earlier English work')
 finally:c.close()
 c,p=cg.setup(browser,base,cg.fixture())
 try:
  go(p,'#notes');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();go(p);before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');open_packet(p);lesson(p,'write');p.locator('[data-ev-field="paragraph"]').fill('Session-only invented explanation.');p.locator('[data-ev-keep="draft"]').tap();h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'save-off leaves persisted data unchanged');report=h.export_notes(p,'freedom-session');h.ok(report['evidenceVoice']['units'][FIXED]['firstDraft']['drafts']['paragraph'].startswith('Session-only'),'actual Notes recovers session-only writing')
 finally:c.close()
 for width in [320,820]:
  c,p=cg.setup(browser,base,cg.fixture(),width=width,height=900)
  try:go(p);bounds(p);open_packet(p);bounds(p);lesson(p,'compare');bounds(p);p.screenshot(path=str(OUT/f'width-{width}.png'),full_page=True)
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
    report=journey(b,base);recovery(b,base);historical_and_unreadable(b,base,report);boundaries(b,base);h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors));print(json.dumps({'status':'passed','checks':h.checks}),flush=True)
   except Exception:(OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
