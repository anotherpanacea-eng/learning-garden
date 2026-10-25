"""Synthetic real-app source comparison, tablet/phone, file transfer and isolation."""
import functools,http.server,json,os,subprocess,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('ACCOUNTS_ARTIFACTS','/tmp/storm-accounts-browser'));OUT.mkdir(parents=True,exist_ok=True)
fixture=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import {startEvidenceVoice,setEvidenceText,keepEvidence} from './dist/evidence-voice-core.mjs';const s=initializeExplorerState(freshState()),o={canExport:()=>true,lesson:'write'};s.garden.welcomeFilmSeen=true;startEvidenceVoice(s,'clock-river',o);setEvidenceText(s,'paragraph','Earlier synthetic story draft',o);keepEvidence(s,'draft',o);console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128
server=None;BASE=os.environ.get('ACCOUNTS_TEST_URL')
if not BASE:
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}/'
n=0
def ok(value,message):
 global n
 assert value,message
 n+=1
def notebook(p):return p.evaluate("()=>{const e=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+e.activeId));}")
def branch(p):return notebook(p)['evidenceVoice']
def work(p):return branch(p)['units'][branch(p)['current']]
def go(p,route='#learn/english/storm-records'):
 p.goto(BASE+route);p.locator('[data-ev-root]' if route.startswith('#learn/english') else 'main').wait_for()
def lesson(p,key):p.locator(f'.ev-lessons [data-ev-open="{key}"]').click();p.locator('#ev-heading').wait_for()
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 ok(not p.locator('[data-ev-root] button,[data-ev-root] select,[data-ev-root] a,[data-ev-root] summary').evaluate_all("xs=>xs.filter(x=>{let r=x.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<43.9}).map(x=>x.textContent)"),'44px visible controls')
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
  try:
   for width in [320,820]:
    c=b.new_context(viewport={'width':width,'height':1080},has_touch=True,accept_downloads=True,reduced_motion='reduce')
    c.add_init_script("if(!localStorage.getItem('storm-pair-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(fixture))+");localStorage.setItem('storm-pair-fixture','1');}window.__spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{name:'Synthetic English',lang:'en-US',localService:true,default:true,voiceURI:'synthetic'}]},speak(u){const e=JSON.parse(localStorage.getItem('learning-garden-explorers')),s=JSON.parse(localStorage.getItem('number-garden-v1:'+e.activeId)),w=s.evidenceVoice.units[s.evidenceVoice.current];window.__spoken.push({text:u.text,supported:w.support[w.lesson]?.includes('audio')});queueMicrotask(()=>u.onstart?.());},addEventListener(){},removeEventListener(){}}});")
    def app(route):
     response=route.fetch();body=response.text();assert 'bindEvidenceVoice(state,options)' in body
     route.fulfill(response=response,body=body.replace('bindEvidenceVoice(state,options)','bindEvidenceVoice(state,{...options,canExport:c=>!window.__refuseAccounts&&options.canExport(c)})'))
    c.route('**/app.mjs',app)
    p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)));go(p)
    before=branch(p);old=before['units']['clock-river'];ok(before['current']=='clock-river','preview retains current long story');ok(p.locator('[data-ev-source-preview]').count()==1,'explicit source preview')
    for hook in ['[data-ev-whole]','[data-ev-audio]','[data-ev-anchor]','[data-ev-answer]','[data-ev-support]']:
     ok(p.locator(hook).count()==0,'preview has no mutating content hook '+hook)
    p.locator('[data-ev-more]').click();ok(branch(p)==before,'preview story-panel navigation neutral');bounds(p)
    p.locator('.ev-preview [data-ev-open]').focus();p.keyboard.press('Enter');ok(branch(p)['current']=='storm-accounts','keyboard explicit source opening');ok(work(p)['source']['kind']=='account-pair','short pair source');ok(branch(p)['units']['clock-river']==old,'older draft exact after opening');ok(p.evaluate('document.activeElement.id')=='ev-heading','opening local focus')
    ok(p.locator('.ev-reading .ev-chapter').count()==2,'both source documents visible');ok(p.locator('.ev-reading').inner_text().find('Dot was not at the mill')>=0,'source context visible');ok(p.locator('.ev-page').inner_text().find('complete original story in 2 chapters')<0,'no full-story claim');bounds(p)
    p.locator('.ev-reading').scroll_into_view_if_needed();p.screenshot(path=str(OUT/f'storm-records-{width}.png'),full_page=False)
    p.locator('.ev-reading [data-speak]').first.click();ok(len(p.evaluate('window.__spoken'))>0,'device-local speech invoked');ok(all(x['supported'] for x in p.evaluate('window.__spoken')),'support saved before speech invocation')
    spoken=len(p.evaluate('window.__spoken'));held=branch(p);p.evaluate('window.__refuseAccounts=true');p.locator('.ev-reading [data-speak]').first.click();ok(branch(p)==held,'refused audio retains state');ok(len(p.evaluate('window.__spoken'))==spoken,'refused support prevents playback');p.evaluate('window.__refuseAccounts=false')
    for turn in ['before','compare','later']:
     lesson(p,turn);ok(p.locator('.ev-reading .ev-chapter').count()==2,'both sources on '+turn)
     if turn=='later':ok(p.locator('.ev-revisit').count()==0,'no clock suspicion panel')
     for q in work(p)['source']['questions']:
      if q['lesson']!=turn:continue
      choice=next(x for x in q['choices'] if x['outcome']=='fits');p.locator(f'[data-ev-answer="{q["id"]}:{choice["id"]}"]').click()
      attempt=work(p)['firstResponses'][q['id']];ok(attempt['outcome']=='fits','fitting source check '+q['id']);ok('order' not in attempt,'no global story ordinal '+q['id']);ok(p.evaluate('document.activeElement.id')=='ev-feedback-'+q['id'],'feedback local '+q['id'])
    ok(len(work(p)['firstResponses'])==7,'all seven bounded checks kept');p.locator('[data-ev-whole] > summary').click();ok(p.locator('[data-ev-whole] .ev-chapter').count()==2,'whole source always available');ok('All saved source documents' in p.locator('[data-ev-whole] > summary').inner_text(),'source-specific whole label')
    lesson(p,'write');exact='  My own explanation\nTwo records help with different questions.  ';p.locator('[data-ev-field="paragraph"]').fill(exact);p.locator('[data-ev-keep="draft"]').click();first=work(p)['firstDraft'];p.locator('[data-ev-field="paragraph"]').fill('A later draft');p.locator('[data-ev-keep="draft"]').click();ok(work(p)['firstDraft']==first,'first kept draft immutable')
    lesson(p,'revise');ok(exact in p.locator('.ev-earlier').inner_text(),'first own draft returned');p.locator('[data-ev-field="objection"]').fill('A witness has a limited view.');p.locator('[data-ev-field="revision"]').fill('The sources leave the current bridge condition open.');p.locator('[data-ev-keep="revision"]').click();revision=work(p)['firstRevision'];p.locator('[data-ev-field="revision"]').fill('A later revised message');p.locator('[data-ev-keep="revision"]').click();ok(work(p)['firstRevision']==revision,'first kept revision immutable')
    held=branch(p);p.evaluate('window.__refuseAccounts=true');p.locator('[data-ev-field="revision"]').fill('Visible unsaved synthetic message');ok(branch(p)==held,'refused writing preserves saved whole root');p.locator('[data-ev-create]').click();ok(p.locator('[data-ev-field="revision"]').input_value()=='Visible unsaved synthetic message','new story cannot discard refused visible words');p.locator('#explorer-switch').click();ok(p.locator('[data-ev-root]').is_visible(),'explorer switch guarded');p.once('dialog',lambda d:d.dismiss());p.locator('[data-ev-restore]').click();ok(p.locator('[data-ev-field="revision"]').input_value()=='Visible unsaved synthetic message','cancel restore keeps unsaved words');p.once('dialog',lambda d:d.accept());p.locator('[data-ev-restore]').click();ok(p.locator('[data-ev-field="revision"]').input_value()=='A later revised message','confirmed restore exact saved words');p.evaluate('window.__refuseAccounts=false')
    kept=branch(p);p.evaluate('window.staleSourceAction=document.querySelector("[data-ev-open]")');go(p,'#notes');p.evaluate('window.staleSourceAction.click()');ok(branch(p)==kept,'detached source control inert')
    with p.expect_download() as d:p.locator('#download').click()
    report=json.loads(Path(d.value.path()).read_text());ok(report['evidenceVoice']==kept,'actual download retains full frozen source and versions');owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
    p.locator('#progress-file').set_input_files({'name':'synthetic-source-records.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual import accepted');go(p);ok(branch(p)==kept,'actual import exact source root');imported_owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");ok(imported_owner!=owner,'import creates separate explorer')
    p.reload();p.locator('[data-ev-root], [data-select-explorer]').first.wait_for()
    if p.locator(f'[data-select-explorer="{imported_owner}"]').count():p.locator(f'[data-select-explorer="{imported_owner}"]').click()
    p.locator('[data-ev-root]').wait_for();ok(branch(p)==kept,'reload picker then resume exact source')
    p.locator('[data-ev-story]').select_option('last-seat');p.locator('[data-ev-create]').click();ok(work(p)['source']['id']=='last-seat','whole story remains open');ok(branch(p)['units']['storm-accounts']==kept['units']['storm-accounts'],'long story preserves source message');p.locator('#explorer-switch').click();p.locator(f'[data-select-explorer="{owner}"]').click();go(p);ok(branch(p)==kept,'original explorer unaffected by imported copy work')
    p.locator('.ev-copies > summary').click();p.locator('[data-ev-unit-open="clock-river"]').click();ok(work(p)==old,'earlier story resumes exact');prior=branch(p);go(p);ok(branch(p)==prior,'return-to-source preview from story is still neutral');p.locator('.ev-preview [data-ev-open]').click();ok(work(p)==kept['units']['storm-accounts'],'source resumes its exact selected turn');bounds(p)
    ok(not errors,'no page errors '+str(errors));c.close()
   print(f'Storm accounts Chrome: {n} assertions at320/820, synthetic speech and notes transfer.')
  finally:b.close()
finally:
 if server:server.shutdown();server.server_close()
