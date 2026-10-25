"""Real app adapter journeys with synthetic English drafts only; 320/820 touch widths."""
import json,os,subprocess,threading,http.server,functools
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('ENGLISH_ARTIFACTS','/tmp/evidence-voice-browser'));OUT.mkdir(parents=True,exist_ok=True)
initial=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState,prepareProgressImport} from './dist/progress-transfer.mjs';import {rememberPathway} from './dist/pathway-entry-core.mjs';import {startLinear,setLinearNote} from './dist/linear-pathway-core.mjs';const s=initializeExplorerState(freshState());const o={canExport:x=>prepareProgressImport(JSON.stringify(x,null,2)).ok};rememberPathway(s,'math','plans',o);startLinear(s,'zero',o);setLinearNote(s,'Synthetic pending math note',o);s.garden.welcomeFilmSeen=true;console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
class PreviewServer(http.server.ThreadingHTTPServer):
 request_queue_size=128
server=None
BASE=os.environ.get('ENGLISH_TEST_URL')
if not BASE:
 server=PreviewServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}/'
checks=0
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def notebook(p):return p.evaluate("()=>{const e=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+e.activeId));}")
def go(p,h='#learn/english'):
 p.goto(BASE+h)
 try:p.locator('[data-ev-root]' if h.startswith('#learn/english') else 'main').wait_for(timeout=15000)
 except Exception:
  print('Page body:',p.locator('body').inner_text()[:3000],flush=True);raise
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('[data-ev-root] button,[data-ev-root] select,[data-ev-root] a,[data-ev-root] summary').evaluate_all("xs=>xs.filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<43.9}).map(x=>x.textContent)")
 ok(not bad,'44px controls '+str(bad))
def work(p):return notebook(p)['evidenceVoice']['units'][notebook(p)['evidenceVoice']['current']]
def open_lesson(p,id):p.locator(f'.ev-lessons [data-ev-open="{id}"]').click();p.locator('#ev-heading').wait_for()
def bring(p,report):
 go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-english.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual import adapter');go(p)
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
  errors=[]
  try:
   for width in [320,820]:
    c=b.new_context(viewport={'width':width,'height':1050},has_touch=True,accept_downloads=True,reduced_motion='reduce')
    c.add_init_script("if(!localStorage.getItem('english-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(initial))+");localStorage.setItem('english-fixture','1');}")
    c.add_init_script("window.__englishSpoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{name:'Synthetic local English',lang:'en-US',localService:true,default:true,voiceURI:'synthetic-english'}]},speak(u){window.__englishSpoken.push({text:u.text,lang:u.lang});queueMicrotask(()=>u.onstart?.());},addEventListener(){},removeEventListener(){}}});")
    p=c.new_page();p.on('pageerror',lambda e:(errors.append(str(e)),print('Page error:',str(e),flush=True)));p.on('console',lambda m:print('Console:',m.text,flush=True) if m.type=='error' else None);go(p,'#learn/english/write')
    ok('evidenceVoice' not in notebook(p),'deep preview does not allocate');ok(p.locator('.ev-preview').is_visible(),'requested writing preview visible');bounds(p)
    p.locator('.ev-preview [data-ev-open="write"]').click();ok(work(p)['lesson']=='write','writing directly available');ok('firstDraft' not in work(p),'no invented earlier draft')
    p.locator('[data-ev-field="paragraph"]').fill('  A first claim with <tags>.\nThe note predates the posters.  ');p.locator('[data-ev-keep="draft"]').click();first=work(p)['firstDraft'];ok(first['drafts']['paragraph'].startswith('  '),'leading spaces kept');ok(p.locator('.ev-versions b').count()==0,'own writing escaped')
    open_lesson(p,'before');ok(p.url.endswith('#learn/english/before'),'explicit navigation updates deep request');ok(work(p)['firstDraft']==first,'changing lessons preserves draft')
    p.locator('.ev-reading [data-speak]').first.click();ok('audio' in work(p)['support']['before'],'audio request recorded');ok(p.evaluate('window.__englishSpoken.at(-1).lang')=='en-US','local English narration requested');p.locator('[data-ev-support="learn"]').focus();p.keyboard.press('Enter');ok('learn' in work(p)['support']['before'],'keyboard support saved');p.locator('[data-ev-answer="key:choice-1"]').click();p.locator('[data-ev-support="hint"]').click();p.locator('[data-ev-answer="key:choice-2"]').click();ok(work(p)['firstResponses']['key']['outcome']=='different','first structured outcome retained');ok('hint' in work(p)['responses'][-1]['helpBefore'],'support before later response distinct')
    p.locator('[data-ev-note-anchor]').select_option('c1-p3');p.locator('[data-ev-note-kind]').select_option('inference');p.locator('[data-ev-note-text]').fill('Her motive theory is an inference, not an observed thought.');p.locator('[data-ev-note-keep]').click();note=work(p)['annotations'][0];ok(note['anchor']=='c1-p3' and note['passage'].startswith('Until that moment'),'exact passage anchor and text');ok(note['kind']=='inference','learner annotation label preserved')
    p.locator('[data-ev-field="interpretation"]').fill('The key looks suspicious, but its purpose is unknown.');p.locator('[data-ev-whole] > summary').click();ok(len(work(p)['exposed'])==4,'whole text exposure saved');ok(p.locator('[data-ev-whole] .ev-passage').count()==12,'whole text always complete');bounds(p)
    open_lesson(p,'accounts');p.locator('[data-ev-support="guided"]').click();p.locator('[data-ev-field="comparison"]').fill('They share her question; Ivo adds his own account of the key.');p.locator('[data-ev-answer="voices:choice-1"]').click();ok(work(p)['responses'][-1]['outcome']=='fits','two accounts check');
    open_lesson(p,'later');ok(p.locator('.ev-revisit').is_visible(),'earlier passage revisited beside dated later text');ok('c3-p1' in p.locator('.ev-revisit').inner_text(),'actual dated entry anchor');p.locator('[data-ev-answer="ledger:choice-3"]').click();p.locator('[data-ev-answer="limit:choice-1"]').click();p.locator('[data-ev-field="reconsideration"]').fill('The ledger weakens the damage theory but not every question.');
    open_lesson(p,'write');p.locator('[data-ev-field="paragraph"]').fill('The clock should be described with a clear warning, since the fault was recorded earlier.');p.locator('[data-ev-answer="reason:choice-2"]').click();p.locator('[data-ev-keep="draft"]').click();ok(work(p)['firstDraft']==first,'first kept draft exact after rewrite')
    open_lesson(p,'revise');ok('A first claim with <tags>.' in p.locator('.ev-earlier').inner_text(),'own earlier draft returned for revision');p.locator('[data-ev-support="example"]').click();p.locator('[data-ev-field="objection"]').fill('A repair record does not say who read it.');p.locator('[data-ev-field="revision"]').fill('The fault was recorded before the posters, but who knew is uncertain.');p.locator('[data-ev-keep="revision"]').click();rev=work(p)['firstRevision'];p.locator('[data-ev-field="revision"]').fill('The town can acknowledge an earlier warning while leaving who read it open.');p.locator('[data-ev-keep="revision"]').click();ok(work(p)['firstRevision']==rev,'first revision exact');ok(work(p)['kept']['drafts']['revision'].startswith('The town'),'latest reader piece exact');p.locator('[data-ev-skip]').click();ok('revise' in work(p)['skipped'],'skip remains distinct from outcomes');bounds(p)
    p.screenshot(path=str(OUT/f'english-revision-{width}.png'),full_page=False)
    ok(notebook(p)['learningRoutes']==initial['learningRoutes'],'English leaves remembered math choice intact');ok(notebook(p)['linearPathway']==initial['linearPathway'],'English leaves waiting signed-math work intact');saved=notebook(p)['evidenceVoice'];p.reload();p.locator('[data-ev-root]').wait_for();ok(notebook(p)['evidenceVoice']==saved,'reload exact branch')
    p.evaluate("window.staleEnglish=document.querySelector('[data-ev-skip]')");go(p,'#notes');p.evaluate('window.staleEnglish.click()');ok(notebook(p)['evidenceVoice']==saved,'departed stale control no write')
    with p.expect_download() as d:p.locator('#download').click()
    report=json.loads(Path(d.value.path()).read_text());ok(report['evidenceVoice']==saved,'actual download exact branch');owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");bring(p,report);ok(notebook(p)['evidenceVoice']==saved,'actual import exact branch')
    p.locator('#explorer-switch').click();p.locator(f'[data-select-explorer="{owner}"]').click();go(p);ok(notebook(p)['evidenceVoice']==saved,'explorer switch restores own record')
    malformed=json.loads(json.dumps(report));malformed['evidenceVoice']['units']['broken']={'future':['retain',7]};malformed['evidenceVoice']['current']='broken';bring(p,malformed);ok('retained' in p.locator('[data-ev-root]').inner_text().lower(),'malformed child notice');open_lesson(p,'before');ok(notebook(p)['evidenceVoice']['units']['broken']=={'future':['retain',7]},'start new copy preserves malformed child')
    exact=json.loads(json.dumps(report));exact['evidenceVoice']['units'][exact['evidenceVoice']['current']]['drafts']['revision']='  Exact\r\nrevision  ';exact['evidenceVoice']['units'][exact['evidenceVoice']['current']]['annotationDraft']={'anchor':'c1-p3','kind':'question','text':'  Exact\r\nnote  '};bring(p,exact);p.locator('[data-ev-support="hint"]').click();p.locator('[data-ev-note-kind]').select_option('literal');ok(work(p)['drafts']['revision']=='  Exact\r\nrevision  ','untouched imported prose CRLF preserved');ok(work(p)['annotationDraft']['text']=='  Exact\r\nnote  ','changing note kind preserves exact imported note');p.locator('[data-ev-note-keep]').click();ok(work(p)['annotations'][-1]['text']=='  Exact\r\nnote  ','keep exact imported note without textarea normalization')
    future=json.loads(json.dumps(report));future['evidenceVoice']['version']=9;bring(p,future);ok(p.locator('[data-ev-open]').count()==0,'future root no edit controls');ok(notebook(p)['evidenceVoice']==future['evidenceVoice'],'future root unchanged');bounds(p);c.close()
   ok(not errors,'no browser errors '+str(errors));print(f'Evidence & voice Chrome: {checks} assertions at 320/820.')
  finally:b.close()
finally:
 if server:server.shutdown()
