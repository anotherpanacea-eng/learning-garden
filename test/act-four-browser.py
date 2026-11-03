"""Spec352/366 actual-app journey, save lifecycle and responsive samples. Synthetic explorers only."""
import sys
sys.dont_write_bytecode = True
import functools, http.server, json, os, subprocess, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
checks=0;errors=[]
def ok(v,label):
 global checks
 assert v,label
 checks+=1
def eq(a,b,label):ok(a==b,label)
def fixture(mode='ready'):
 code="import {actFourSeed,actFourHosts} from './test/act-four-checks.mjs';import {startActFour,offerActFour,actFourCandidates} from './dist/act-four-core.mjs';import {canExport} from './test/act-two-checks.mjs';let s=actFourHosts();"
 if mode not in ['ready','no-garden','locked']:code+='startActFour(s,{canExport});'
 if mode=='offered':code+="offerActFour(s,'account',actFourCandidates(s,'account')[0].key,{canExport});"
 if mode=='repair':code+="s.story.seenScenes=s.story.seenScenes.filter(x=>x!=='harvest-page-revealed');"
 if mode=='isolated':code+="s.story.acts.I='future';s.story.acts.II=null;s.story.acts.III=[];s.story.seenScenes=['harvest-page-revealed'];"
 if mode=='bad-preference':code+="s.story.frameAmount={future:true};s.story.pageAmount='future';"
 if mode=='bad-receipt':code+="s.story.acts.IV.contributions.account={future:true};"
 if mode=='no-work':code+='delete s.ledgerGauge;'
 if mode=='locked':code+="s.story.seenScenes=s.story.seenScenes.filter(x=>x!=='ways-page-revealed');"
 if mode!='no-garden':code+="s.garden={guide:'ari',welcomeFilmSeen:true};"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code+'console.log(JSON.stringify(s));'],cwd=ROOT,text=True))
def book(p):return p.evaluate("()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId||'explorer-1';return JSON.parse(localStorage.getItem('number-garden-v1:'+id)||'{}');}")
def ready(p):
 p.locator('[data-act-four-root],[data-select-explorer="explorer-1"]').first.wait_for()
 if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').tap()
 p.locator('[data-act-four-root]').first.wait_for()
def go(p,base,route):
 p.goto(base+route,wait_until='networkidle');ready(p)
def setup(browser,base,mode='ready',width=820,height=1000,fault=False):
 seed=fixture(mode);c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True,reduced_motion='reduce')
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-03T12:00:00Z'}]}
 c.add_init_script('''(d=>{if(!localStorage.getItem('a4-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));localStorage.setItem('a4-fixture','1');}window.a4Spoken=[];window.a4Cancelled=0;window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{name:'Fixture English',voiceURI:'fixture-en',lang:'en-US',localService:true}],addEventListener(){},removeEventListener(){},cancel(){window.a4Cancelled++;},speak(u){window.a4Spoken.push(u.text);u.onstart?.();}}});})('''+json.dumps({'registry':registry,'seed':seed})+')')
 if fault:
  def intercept(route):
   response=route.fetch();body=response.text();needle='canExport:candidate=>prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok'
   assert body.count(needle)>=2
   body=body.replace(needle,'canExport:candidate=>!window.actFourRefuse&&prepareProgressImport(JSON.stringify(notesReport(candidate),null,2)).ok').replace('function render(){','function render(){window.actFourNotebook=state;')
   route.fulfill(response=response,body=body)
  c.route('**/app.mjs',intercept)
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));go(p,base,'#almanac/two-stories');return c,p,seed

def layout(p,label):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),label+' no overflow')
 tiny=p.locator('[data-act-four-root] button:visible,[data-act-four-root] a:visible,[data-act-four-root] select:visible,[data-act-four-root] summary:visible').evaluate_all('els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width<43.9||r.height<43.9}).map(e=>e.outerHTML.slice(0,100))')
 eq(tiny,[],label+' 44px targets')
 ok(p.locator('[data-act-four-root]').first.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)>=16'),label+' readable base type')

def run(base,browser):
 # The Keeper's Pages use a different binding path from the third-page continuation.
 c,p,seed=setup(browser,base);p.goto(base+'#almanac/the-ways',wait_until='networkidle');p.locator('.a4-invitation a[href="#home"]').tap();p.wait_for_function('location.hash==="#home"');p.reload(wait_until='networkidle');p.goto(base+'#almanac/keepers',wait_until='networkidle');p.locator('[data-a4-start]').tap();p.locator('[data-a4-page-leaf]').wait_for();ok(book(p)['story']['acts']['IV']['started'],'pause, reload, continue from Keeper Pages');ok('harvest-page-revealed' in book(p)['story']['seenScenes'],'Keeper Pages continuation reveals Page4');c.close()
 # One complete tablet journey; two smaller responsive samples below.
 c,p,seed=setup(browser,base);eq(book(p),seed,'entry does not initialize or start');layout(p,'tablet arrival')
 p.goto(base+'#almanac/the-ways',wait_until='networkidle');p.locator('[data-a4-start]').wait_for();eq(book(p),seed,'third page invitation is read-only')
 p.locator('[data-a4-start]').tap();p.locator('[data-a4-page-leaf]').wait_for();ok(book(p)['story']['acts']['IV']['started'],'explicit invitation starts');ok('harvest-page-revealed' in book(p)['story']['seenScenes'],'start reveals fourth page atomically');layout(p,'page4')
 for amount,words in [('longer','120 centimeters'),('original','[smudged]'),('short','best apples')]:
  p.locator('[data-a4-page-amount="'+amount+'"]').tap();ok(words in p.locator('[data-a4-page-leaf]').inner_text(),amount+' page reading')
 p.locator('a[href="#almanac/two-stories"]').tap();p.locator('.a4-guess').wait_for();ok('Ari writes on a card' in p.locator('.a4-guess').inner_text(),'current guide pins guess')
 for amount in ['longer','short']:
  p.locator('[data-a4-frame-amount="'+amount+'"]').tap();ok('Mostly the rain' in p.locator('.a4-guess').inner_text(),'guess in '+amount)
 p.locator('[data-speak]').tap();ok(p.evaluate('a4Spoken.length')>0,'story narration started');cancelled=p.evaluate('a4Cancelled')
 p.locator('a[href="#almanac/two-stories/account"]').tap();p.locator('[data-a4-offer]').wait_for();layout(p,'chapter');ok(p.evaluate('a4Cancelled')>cancelled,'narration stops on navigation')
 ok('Still my guess' not in p.locator('[data-act-four-root]').inner_text(),'follow-up absent before offer')
 p.locator('[data-speak]').tap();spoken=p.evaluate('a4Spoken.join(" ")');ok('not yet a proof' not in spoken,'closed Keeper note not narrated')
 p.locator('.a4-note > summary').tap();p.locator('[data-speak]').tap();ok('not yet a proof' in p.evaluate('a4Spoken.join(" ")'),'open note may be narrated')
 before=book(p);p.locator('[data-a4-offer]').tap();p.locator('.a4-kept').wait_for();eq(book(p)['ledgerGauge'],before['ledgerGauge'],'offer leaves source notes unchanged');eq(book(p)['story']['acts']['IV']['contributions']['account']['ref']['edition'],'latest','one keep offered as latest');ok('Still my guess' in p.locator('.a4-guess').inner_text(),'guide follows offered receipt')
 eq(p.evaluate('document.activeElement.id'),'act-four-offer','offer focuses kept work');p.reload();ready(p);ok('Still my guess' in p.locator('.a4-guess').inner_text(),'guide line survives reload')
 # After reload, all four reached pages remain readable and IV's receipt stays intact.
 iv=book(p)['story']['acts']['IV'];p.goto(base+'#almanac/keepers',wait_until='networkidle')
 if not p.locator('.keeper-page-words').count():p.locator('[data-keeper-reveal]').tap()
 p.locator('.keeper-page-words').wait_for();ok(len(p.locator('.keeper-page-words').inner_text())>0,'Page1 readable after IV reload')
 p.goto(base+'#almanac/flood-ledger',wait_until='networkidle')
 if not p.locator('.act-two-ledger').count():p.locator('[data-act-two-reveal-page]').tap()
 p.locator('.act-two-ledger').wait_for();eq(p.locator('.act-two-ledger tbody tr').count(),7,'Page2 keeps all entries after IV reload')
 p.goto(base+'#almanac/the-ways',wait_until='networkidle');p.locator('[data-a3-page-leaf]').wait_for();ok(len(p.locator('[data-a3-page-leaf]').inner_text())>0,'Page3 readable after IV reload')
 go(p,base,'#almanac/fine-harvest');ok(len(p.locator('[data-a4-page-leaf]').inner_text())>0,'Page4 readable after IV reload');eq(book(p)['story']['acts']['IV'],iv,'earlier rereading preserves IV');go(p,base,'#almanac/two-stories/account')
 p.locator('a[href="#learn/science/ledger"]').tap();p.locator('.a4-return').wait_for();prior=book(p)['story']['acts']['IV'];p.locator('.a4-return a').tap();ready(p);eq(book(p)['story']['acts']['IV'],prior,'real host return never offers implicitly')
 # A real Notes download/import is separate from the original explorer; both survive reload/switch.
 original=book(p)['story'];p.goto(base+'#notes');p.locator('[data-act-four-notes]').wait_for(state='attached')
 with p.expect_download() as d:p.locator('#download').tap()
 raw=Path(d.value.path()).read_text();eq(json.loads(raw)['story'],original,'real Notes exports exact IV receipt')
 p.locator('#progress-file').set_input_files({'name':'synthetic-act-four.json','mimeType':'application/json','buffer':raw.encode()});p.locator('#progress-import-confirm').tap();go(p,base,'#almanac/two-stories/account');eq(book(p)['story'],original,'separate imported explorer retains story');imported=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
 p.reload();p.locator('[data-select-explorer="'+imported+'"]').tap();p.locator('[data-act-four-root]').wait_for();eq(book(p)['story'],original,'imported IV survives reload')
 p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-1"]').tap();p.locator('[data-act-four-root]').wait_for();eq(book(p)['story'],original,'original explorer remains intact')
 p.screenshot(path='/private/tmp/lg352-tablet-chapter.png',full_page=True)
 # Import an explorer that has not started IV alongside the completed one, then reset only that imported copy.
 partial=json.loads(raw);partial['story']=fixture('ready')['story'];p.goto(base+'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-fresh-act-four.json','mimeType':'application/json','buffer':json.dumps(partial).encode()});p.locator('#progress-import-confirm').tap();go(p,base,'#almanac/two-stories');eq(book(p)['story'],partial['story'],'fresh imported story remains separate');ok(p.locator('[data-a4-start]').count()==1,'fresh import has not started IV')
 p.goto(base+'#notes');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');ok('IV' not in book(p).get('story',{}).get('acts',{}),'reset clears this explorer only')
 film=p.locator('dialog.welcome-film[open] [data-film-skip]')
 film.wait_for();film.tap();p.locator('dialog.welcome-film').wait_for(state='detached')
 p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-1"]').tap();p.locator('#explorer-switch').wait_for();go(p,base,'#almanac/two-stories/account');eq(book(p)['story'],original,'other explorer survives the reset');c.close()
 print('Tablet story/host/Notes journey passed',flush=True)
 for width,height in [(320,600),(1024,768)]:
  c,p,seed=setup(browser,base,'offered',width,height);layout(p,str(width)+' hub');go(p,base,'#almanac/fine-harvest');layout(p,str(width)+' page');go(p,base,'#almanac/two-stories/account');layout(p,str(width)+' chapter');c.close()
 # State-only eligibility, fallback, malformed retained work and stale callbacks.
 print('Responsive samples passed',flush=True)
 for mode in ['isolated','bad-preference','bad-receipt','no-work','locked','no-garden']:
  c,p,seed=setup(browser,base,mode);before=book(p)
  if mode=='isolated':
   p.locator('[data-a4-frame-amount="longer"]').tap();go(p,base,'#almanac/fine-harvest');p.locator('[data-a4-page-amount="original"]').tap();ok('[smudged]' in p.locator('[data-a4-page-leaf]').inner_text(),'isolated reached IV readings work')
  elif mode=='bad-preference':ok(p.locator('[data-a4-frame-amount="longer"]').is_disabled(),'bad frame preserved');go(p,base,'#almanac/fine-harvest');ok(p.locator('[data-a4-page-amount="longer"]').is_disabled(),'bad page preserved');eq(book(p),before,'bad preferences unchanged')
  elif mode in ['bad-receipt','no-work']:go(p,base,'#almanac/two-stories/account');ok(not p.locator('[data-a4-offer]').count(),mode+' has no offer');eq(book(p),before,mode+' remains raw')
  elif mode=='locked':ok(not p.locator('[data-a4-start]').count(),'Page3 unread cannot start');eq(book(p),before,'locked entry unchanged')
  else:ok(not p.locator('dialog.welcome-film[open]').count(),'direct route does not autoplay film');p.locator('[data-a4-start]').tap();p.locator('a[href="#almanac/two-stories"]').tap();ok('Mira writes on a card' in p.locator('.a4-guess').inner_text(),'fallback guide uses established default')
  c.close()
 for mode,control in [('ready','[data-a4-start]'),('repair','[data-a4-reveal]'),('open','[data-a4-offer]')]:
  c,p,seed=setup(browser,base,mode,fault=True)
  if mode=='open':go(p,base,'#almanac/two-stories/account')
  before=book(p);p.evaluate('window.actFourRefuse=true');p.locator(control).tap();eq(book(p),before,mode+' preflight refusal atomic');ok("couldn't be kept" in p.locator('#act-four-status').inner_text(),'refusal visible');eq(p.evaluate('document.activeElement.id'),'act-four-status','refusal focused');c.close()
 c,p,seed=setup(browser,base,'open',fault=True);go(p,base,'#almanac/two-stories/account');before=book(p);p.evaluate('window.actFourNotebook.story=structuredClone(window.actFourNotebook.story)');p.locator('[data-a4-offer]').tap();eq(book(p),before,'connected stale-record action inert');c.close()
 c,p,seed=setup(browser,base,'open');go(p,base,'#almanac/two-stories/account');old=p.locator('[data-a4-offer]').element_handle();p.locator('#explorer-switch').tap();p.locator('#explorer-new').tap();p.locator('#explorer-create').tap();p.locator('[data-act-four-root]').wait_for();other=book(p);old.evaluate('(e)=>e.click()');eq(book(p),other,'old explorer control inert');c.close()
 # A real welcome-film dialog blocks even synthetic clicks on an attached story button.
 c,p,seed=setup(browser,base,'ready');c.route('**/storm-intro.html*',lambda r:r.fulfill(content_type='text/html',body='<!doctype html><title>Synthetic film frame</title>'));p.goto(base+'#home')
 for parent in p.locator('details:has([data-film-replay="welcome"])').all():
  if parent.get_attribute('open') is None:parent.locator(':scope > summary').tap()
 p.locator('[data-film-replay="welcome"]').first.tap();p.locator('dialog.welcome-film[open]').wait_for();p.evaluate('location.hash="#almanac/two-stories"');p.locator('[data-act-four-root]').wait_for(state='attached');before=book(p);p.locator('[data-a4-start]').evaluate('(e)=>e.click()');eq(book(p),before,'film-blocked story action inert');p.locator('[data-film-skip]').tap();ready(p);ok(p.locator('[data-a4-start]').is_visible(),'story returns after film');c.close()
 # Save-off start remains in the session/download, with the warning after navigation.
 c,p,seed=setup(browser,base);p.goto(base+'#notes');p.locator('#remember').uncheck();stored=p.evaluate('({...localStorage})');go(p,base,'#almanac/two-stories');p.locator('[data-a4-start]').tap();p.locator('[data-a4-page-leaf]').wait_for();ok('Progress lasts only while this page stays open.' in p.locator('#act-four-status').inner_text(),'saving-off notice survives start navigation');eq(p.evaluate('document.activeElement.id'),'act-four-status','save-off warning focused');p.goto(base+'#notes')
 with p.expect_download() as d:p.locator('#download').tap()
 ok(json.loads(Path(d.value.path()).read_text())['story']['acts']['IV']['started'],'session IV downloadable');eq(p.evaluate('({...localStorage})'),stored,'save-off does not recreate disk state');c.close()
 eq(errors,[],'no page errors')

if __name__=='__main__':
 server=None;base=os.environ.get('ACT_FOUR_TEST_URL')
 if not base:
  class Server(http.server.ThreadingHTTPServer):request_queue_size=128
  class Handler(http.server.SimpleHTTPRequestHandler):
   protocol_version='HTTP/1.1'
   def log_message(self,*args):pass
  server=Server(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(channel='chrome')
   try:run(base,browser)
   finally:browser.close()
 finally:
  if server:server.shutdown()
 print(f'Act IV app: {checks} checks passed.')
