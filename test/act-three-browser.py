"""Spec326 real-app journeys. All records are synthetic and use source-owner APIs.
Only refusal/stale-record contexts intercept the host's preflight seam.
Chromium emulation does not qualify physical iPad, VoiceOver or audible speech.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('ACT_THREE_ARTIFACTS',tempfile.mkdtemp(prefix='act-three-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,label):
 global checks
 assert value,label
 checks+=1
def equal(actual,expected,label):ok(actual==expected,label)
def fixture(mode='open'):
 code="import {actThreeSeed,actThreeHosts} from './test/act-three-checks.mjs';import {canExport} from './test/act-two-checks.mjs';import * as a from './dist/act-three-core.mjs';let s=actThreeHosts();"
 if mode=='first-letter':code="import {freshState} from './dist/core.mjs';import {chooseStoryArrival} from './dist/story-arrivals-core.mjs';import {canExport} from './test/act-two-checks.mjs';let s=freshState();chooseStoryArrival(s,'letter',{canExport});"
 else:
  if mode not in ['unstarted','no-garden']:code+='a.startActThree(s,{canExport});'
  if mode in ['three','ended','visible','isolated','bad-preference','receipt-only']:
   code+="for(const c of ['seeds','route','letters'])a.offerActThree(s,c,a.actThreeCandidates(s,c)[0].key,{canExport});"
  if mode in ['ended','visible','isolated','bad-preference','receipt-only']:code+='a.sendActThree(s,3,{canExport});'
  if mode in ['visible','isolated','bad-preference','receipt-only']:code+='a.revealWaysPage(s,{canExport});'
  if mode=='isolated':code+="s.story.acts.I='retained';s.story.acts.II=null;"
  if mode=='bad-preference':code+="s.story.frameAmount={retained:true};s.story.pageAmount='later-format';"
  if mode=='receipt-only':code+='delete s.seedExchange;delete s.courierClockWalk;delete s.story.upstreamExchange;'
  if mode=='broken-host':code+="const w=s.seedExchange.visits['exchange-1'];w.source=null;w.draft=null;w.latestKept={retained:true};Object.values(s.courierClockWalk.cases)[0].page='future';"
  if mode=='long-label':code+="Object.values(s.courierClockWalk.cases)[0].kept.snapshot.source.title='W'.repeat(160);"
  if mode=='unreadable':code+="s.story.acts.III={started:'later',contributions:{kept:true},ended:false};"
 if mode!='no-garden':code+="s.garden={guide:'ari',welcomeFilmSeen:true};"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code+'console.log(JSON.stringify(s));'],cwd=ROOT,text=True))
def book(p):return p.evaluate("""()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId||'explorer-1';return JSON.parse(localStorage.getItem('number-garden-v1:'+id)||'{}');}""")
def ready(p):
 p.locator('[data-act-three-root],[data-select-explorer="explorer-1"]').first.wait_for()
 if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').tap()
 p.locator('[data-act-three-root]').wait_for()
def setup(browser,base,mode='open',width=820,height=1000,fault=False):
 seed=fixture(mode);context=browser.new_context(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True,reduced_motion='reduce')
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-31T12:00:00.000Z'}]}
 context.add_init_script('(d=>{if(!localStorage.getItem("act-three-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(d.seed));localStorage.setItem("act-three-fixture","1");}window.a3Spoken=[];window.a3Cancelled=0;window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,"speechSynthesis",{value:{getVoices:()=>[{name:"Fixture English",voiceURI:"fixture-en",lang:"en-US",localService:true}],addEventListener(){},removeEventListener(){},cancel(){window.a3Cancelled++;},speak(u){window.a3Spoken.push({text:u.text,lang:u.lang});u.onstart?.();}}});})('+json.dumps({'registry':registry,'seed':seed})+')')
 if fault:
  def intercept(route):
   response=route.fetch();body=response.text();start=body.index('bindActThree(state,{');end=body.index('});bindSpeech();}return;',start);chunk=body[start:end];assert chunk.count('canExport:candidate=>')==1
   route.fulfill(response=response,body=body[:start]+'window.actThreeNotebook=state;'+chunk.replace('canExport:candidate=>','canExport:candidate=>!window.actThreeRefuse&&')+body[end:])
  context.route('**/app.mjs',intercept)
 p=context.new_page();p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+'#almanac/beyond');ready(p);return context,p,seed
def go(p,hash):
 old=p.query_selector('[data-act-three-root]');changed=p.evaluate('location.hash')!=hash
 p.evaluate('(h)=>location.hash=h',hash)
 if old and changed:p.wait_for_function('(el)=>!el.isConnected',arg=old)
 ready(p)
def layout(p,label):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),label+' no horizontal overflow')
 small=p.locator('.act-three-page button:visible,.act-three-page a:visible,.act-three-page select:visible,.act-three-page summary:visible').evaluate_all("""els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width<43.9||r.height<43.9}).map(e=>e.outerHTML.slice(0,90))""")
 equal(small,[],label+' 44px controls')
def run(base,browser):
 for width,height in [(320,600),(820,1000),(1024,768)]:
  c,p,seed=setup(browser,base,'unstarted',width,height);equal(book(p),seed,'entry does not normalize or start unrelated work');layout(p,str(width)+' arrival')
  p.locator('[data-a3-start]').tap();ok(book(p)['story']['acts']['III']['started'],'explicit start');ok(not p.locator('[data-a3-send]').count(),'no ending button before three offers')
  for chapter in ['seeds','route','letters']:
   p.locator('a[href="#almanac/beyond/'+chapter+'"]').first.tap();p.locator('[data-a3-offer="'+chapter+'"]').wait_for();layout(p,str(width)+' '+chapter)
   if chapter=='seeds':
    selector=p.locator('[data-a3-candidate]');selector.select_option(index=1);chosen=selector.input_value();p.locator('[data-a3-frame-amount="longer"]').tap();equal(p.locator('[data-a3-candidate]').input_value(),chosen,'reading amount keeps waiting selection');ok('latest kept' in p.locator('#act-three-selection').inner_text(),'full selected plan label');p.locator('[data-a3-frame-amount="short"]').tap()
   p.locator('[data-a3-offer="'+chapter+'"]').tap();equal(p.evaluate('document.activeElement.id'),'act-three-offer','offer focus');p.screenshot(path=str(OUT/f'chapter-{chapter}-{width}.png'),full_page=True);p.locator('a[href="#almanac/beyond"]').first.tap();p.locator('.a3-river').wait_for()
  equal(len(book(p)['story']['acts']['III']['contributions']),3,'three explicit distinct contributions');ok(p.locator('[data-a3-send]').count()==1,'ending now offered');p.locator('[data-a3-send]').tap();p.locator('.a3-ending-picture').wait_for();ok(book(p)['story']['acts']['III']['ended'],'explicit ending');ok('ways-page-revealed' not in book(p)['story']['seenScenes'],'ending does not reveal page');ok('Hollis' not in p.locator('[data-act-three-root]').inner_text(),'identity not revealed before page action');layout(p,str(width)+' ending');p.screenshot(path=str(OUT/f'ending-{width}.png'),full_page=True)
  p.locator('[data-a3-reveal]').tap();p.locator('[data-a3-page-leaf]').wait_for();ok('ways-page-revealed' in book(p)['story']['seenScenes'],'reveal saved before page text');p.locator('[data-a3-page-amount="original"]').tap();ok('[smudged]' in p.locator('[data-a3-page-leaf]').inner_text(),'original remains a story text');layout(p,str(width)+' page');p.screenshot(path=str(OUT/f'page-{width}.png'),full_page=True)
  before=book(p)['story'];p.locator('[data-speak]').first.tap();p.wait_for_function('window.a3Spoken.length>0');ok('[smudged]' not in p.evaluate('window.a3Spoken.at(-1).text'),'speech uses smudged-word phrase');cancelled=p.evaluate('window.a3Cancelled');go(p,'#almanac/beyond');ok(p.evaluate('window.a3Cancelled')>cancelled,'speech stops on navigation');equal(book(p)['story'],before,'narration and replay do not change story records')
  before=book(p);p.reload();ready(p);equal(book(p),before,'reload preserves notebook');go(p,'#almanac/beyond/unknown');ok(p.locator('.a3-river').count()==1,'invalid chapter falls back to hub');equal(book(p),before,'invalid route does not write');p.add_style_tag(content='html{font-size:150%}');layout(p,str(width)+' larger text');c.close()
 # Visit real host screens and return without changing their retained work.
 c,p,seed=setup(browser,base)
 for chapter in ['seeds','route','letters']:
  go(p,'#almanac/beyond/'+chapter);before=book(p);host=p.locator('.a3-work a').first.get_attribute('href');p.locator('.a3-work a').first.tap();p.locator('.a3-return a').wait_for();equal(p.evaluate('location.hash'),host,chapter+' opens its actual host');p.locator('.a3-return a').tap();ready(p);equal(p.evaluate('location.hash'),'#almanac/beyond/'+chapter,chapter+' returns to its waiting chapter');equal(book(p)['story'],before['story'],chapter+' visit does not offer work implicitly')
 c.close()
 # Real Notes download, import as a separate explorer, reload and reopen.
 c,p,seed=setup(browser,base,'visible');saved=book(p)['story'];go(p,'#almanac/the-ways');p.goto(base+'#notes');p.locator('[data-act-three-notes]').wait_for(state='attached')
 for parent in p.locator('details:has([data-act-three-notes])').all():
  if parent.get_attribute('open') is None:parent.locator(':scope > summary').tap()
 p.locator('[data-act-three-notes] > summary').tap();ok('story collects work' in p.locator('[data-act-three-notes]').inner_text(),'adult evidence boundary')
 with p.expect_download() as download:p.locator('#download').tap()
 raw=Path(download.value.path()).read_text();equal(json.loads(raw)['story'],saved,'actual notes contain exact story');p.locator('#progress-file').set_input_files({'name':'synthetic-story.json','mimeType':'application/json','buffer':raw.encode()});p.locator('#progress-import-confirm').tap();go(p,'#almanac/the-ways');equal(book(p)['story'],saved,'imported explorer keeps story');current=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');p.reload();p.locator('[data-select-explorer="'+current+'"]').tap();p.locator('[data-act-three-root]').wait_for();equal(book(p)['story'],saved,'import reload returns to correct explorer');c.close()
 for mode in ['isolated','bad-preference','receipt-only']:
  c,p,seed=setup(browser,base,mode);go(p,'#almanac/the-ways');ok(p.locator('[data-a3-page-leaf]').count()==1,mode+' keeps reached page');before=book(p)
  if mode=='bad-preference':ok(p.locator('[data-a3-page-amount="longer"]').is_disabled(),'unreadable preference cannot be overwritten')
  else:p.locator('[data-a3-page-amount="longer"]').tap();ok('Nuria puts her paw' in p.locator('[data-a3-page-leaf]').inner_text(),mode+' page amount works')
  if mode=='bad-preference':equal(book(p),before,'bad preference stays exact')
  c.close()
 c,p,seed=setup(browser,base,'no-garden');ok(not p.locator('dialog.welcome-film[open]').count(),'direct Act III entry excludes automatic film');ok('III' not in book(p)['story']['acts'],'direct entry does not start');c.close()
 c,p,seed=setup(browser,base,'first-letter');ok(not p.locator('[data-a3-start]').count(),'unopened letter does not start Act III');p.locator('a[href="#almanac/upstream-letter"]').tap();p.locator('[data-act-two-open-letter]').tap();p.locator('.a3-invitation a[href="#almanac/beyond"]').tap();p.locator('[data-a3-start]').wait_for();c.close()
 for mode in ['broken-host','long-label']:
  c,p,seed=setup(browser,base,mode);go(p,'#almanac/beyond/'+('seeds' if mode=='broken-host' else 'route'));p.locator('[data-a3-candidate]').wait_for();layout(p,mode);equal(book(p),seed,mode+' retained history stays exact');c.close()
 # Refused writes never expose an ending or page, or replace the notebook.
 for mode,route,control in [('unstarted','#almanac/beyond','[data-a3-start]'),('open','#almanac/beyond/seeds','[data-a3-offer]'),('three','#almanac/beyond','[data-a3-send]'),('ended','#almanac/both-ways','[data-a3-reveal]')]:
  c,p,seed=setup(browser,base,mode,fault=True);go(p,route);before=book(p);p.evaluate('window.actThreeRefuse=true');p.locator(control).tap();equal(book(p),before,mode+' refused write is atomic');ok('couldn\'t be kept' in p.locator('#act-three-status').inner_text(),mode+' refusal visible');equal(p.evaluate('document.activeElement.id'),'act-three-status',mode+' refusal focus');c.close()
 # A connected old control whose story record was replaced is inert.
 c,p,seed=setup(browser,base,'three',fault=True);before=book(p);p.evaluate('window.actThreeNotebook.story=structuredClone(window.actThreeNotebook.story)');p.locator('[data-a3-send]').tap();equal(book(p),before,'stale story callback cannot write');c.close()
 # Saving off keeps the story in memory and in a real notes download.
 c,p,seed=setup(browser,base);p.goto(base+'#notes');p.locator('#remember').uncheck();storage=p.evaluate('({...localStorage})');go(p,'#almanac/beyond/seeds');p.locator('[data-a3-offer="seeds"]').tap();ok('Progress lasts only while this page stays open.' in p.locator('#act-three-status').inner_text(),'saving-off notice next to the activity');p.goto(base+'#notes')
 with p.expect_download() as download:p.locator('#download').tap()
 report=json.loads(Path(download.value.path()).read_text());ok('seeds' in report['story']['acts']['III']['contributions'],'saving-off contribution stays in the session download');equal(p.evaluate('({...localStorage})'),storage,'saving-off story writes no storage');c.close()
 # Switching explorer changes ownership even if an old DOM control is retained.
 c,p,seed=setup(browser,base);go(p,'#almanac/beyond/seeds');before=book(p)['story'];stale=p.locator('[data-a3-offer="seeds"]').element_handle();p.locator('#explorer-switch').tap();p.locator('#explorer-new').tap();p.locator('#explorer-create').tap();ready(p);other=book(p);stale.evaluate('(el)=>el.click()');equal(book(p),other,'old control cannot write to the new explorer');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-1"]').tap();ready(p);equal(book(p)['story'],before,'old control cannot write to its former explorer');ok(p.url.endswith('#almanac/beyond/seeds'),'switch keeps the Act III route');c.close()
 equal(errors,[],'no page errors')

if __name__=='__main__':
 server=None;base=os.environ.get('ACT_THREE_TEST_URL')
 if not base:
  class Server(http.server.ThreadingHTTPServer):request_queue_size=128
  class Handler(http.server.SimpleHTTPRequestHandler):
   def log_message(self,*args):pass
  server=Server(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   chrome=os.environ.get('CHROME_PATH');mac='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
   if not chrome and Path(mac).exists():chrome=mac
   browser=pw.chromium.launch(headless=True,executable_path=chrome)
   try:run(base,browser)
   finally:browser.close()
 finally:
  if server:server.shutdown()
 (OUT/'result.json').write_text(json.dumps({'status':'passed','checks':checks,'errors':errors},indent=2));print(f'Act III native app: {checks} checks passed.')
