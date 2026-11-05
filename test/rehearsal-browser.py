"""Rehearsal Cues389: actual script/stage, parent words and Notes recovery.
One full tablet journey plus focused responsive/lifecycle samples. A labelled
actual-UI harness isolates context and preflight faults. All records invented.
Chromium emulation does not qualify physical iPad, audible output or learning.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('REHEARSAL_ARTIFACTS') or tempfile.mkdtemp(prefix='rehearsal-'));OUT.mkdir(parents=True,exist_ok=True)
_spec=importlib.util.spec_from_file_location('rehearsal_notes_helpers',ROOT/'test/writing-table-browser.py');h=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(h);h.OUT=OUT

def fixture(extra=''):
 code="import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{startShow,setLoftEditor,setSceneDialogue}from'./dist/loft-core.mjs';import{invitations}from'./dist/loft-content.mjs';let s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticSibling={literal:'invented',payload:'z'.repeat(512000)};"+extra+";console.log(JSON.stringify(s));"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-05T12:00:00Z'},{'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-11-05T12:00:00Z'}]}
 c.add_init_script('(d=>{if(!localStorage.getItem("rehearsal-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const x of d.registry.explorers)localStorage.setItem("number-garden-v1:"+x.id,JSON.stringify(d.seed));localStorage.setItem("rehearsal-fixture","1");}})('+json.dumps({'registry':registry,'seed':seed})+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:h.errors.append(str(e)));p.on('console',lambda m:h.errors.append(m.text) if m.type=='error' else None);p.on('response',lambda r:h.errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None)
 p.goto(base+'#loft',wait_until='networkidle');p.locator('[data-rehearsal-open],[data-select-explorer="explorer-1"]').first.wait_for()
 if p.locator('[data-select-explorer="explorer-1"]').count():
  p.locator('[data-select-explorer="explorer-1"]').click();p.wait_for_url('**/#home');p.evaluate('location.hash="#loft"')
 p.locator('[data-rehearsal-open]').wait_for();return c,p
def sel(name,value=None):return '[data-rc-'+name+('="'+str(value)+'"' if value is not None else '')+']'
def click(p,name,value=None):
 if name in ['working','shelf']:
  d=p.locator('.rc-tools')
  if d.get_attribute('open') is None:d.locator(':scope>summary').click()
 p.locator(sel(name,value)+':visible').first.click()
def enter(p):p.locator('[data-rehearsal-open]').click();p.locator(sel('root')).wait_for()
def choose(p,id):
 d=p.locator('[data-rc-fold="drafts"]')
 if d.get_attribute('open') is None:d.locator(':scope>summary').click()
 p.locator(sel('case')).select_option(id)
def rows(p):return h.book(p).get('rehearsalScripts',[])
def bounds(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('[data-rc-root] button,[data-rc-root] a,[data-rc-root] select,[data-rc-root] summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)')
 h.ok(not bad,'44px controls and16px text: '+str(bad))

def journey(browser,base,seed):
 print('Rehearsal: actual roles, manual stage, views and immutable copies',flush=True)
 c,p=setup(browser,base,seed)
 try:
  before=copy.deepcopy(h.book(p));enter(p);bounds(p);h.ok(h.book(p)==before,'entry changes no parent/notebook root')
  h.ok(not p.locator('drawn-howto').count(),'the old Loft composer how-to is not offered on this distinct bench')
  h.ok(p.locator('.rc-roles').evaluate('e=>e.getBoundingClientRect().bottom<=innerHeight') and p.locator('.rc-speakers').evaluate('e=>e.getBoundingClientRect().bottom<=innerHeight'),'tablet first stage and role/speaker controls need no page scroll')
  h.ok(not p.locator(sel('reopen')).is_visible(),'recovery starts hidden');h.ok('No speaker yet' in p.locator(sel('audience')).inner_text(),'starting speaker is not an inferred choice')
  h.ok(p.locator(sel('read')).first.get_attribute('data-speak')=='Dot points to a chair.','cue reading is available before an assignment')
  click(p,'speaker','pip');click(p,'turn','rehearse');h.ok('Pip' in p.locator(sel('audience')).inner_text() and not p.locator(sel('direction')).count(),'a direction assigned as speech is literally spoken without an action')
  click(p,'turn','arrange');click(p,'kind','direction');h.ok(p.locator('.rc-active strong').inner_text()=='Dot','a direction uses its own authored actor, not a previous speaker')
  click(p,'move',1);click(p,'turn','rehearse');click(p,'step',1);h.ok('Backstage direction' in p.locator('#rc-task').inner_text(),'manual rehearsal follows reordered work');h.ok(p.locator('#rc-task').evaluate('e=>e===document.activeElement'),'stepping announces the new cue heading')
  click(p,'turn','compare');h.ok("Writer's position 4" in p.locator(sel('root')).inner_text(),'comparison follows the same cue to its author position');h.ok('narrator' in p.locator(sel('root')).inner_text(),'speaking a direction is not declared wrong')
  click(p,'keep');first=copy.deepcopy(rows(p)[0]);h.ok(first['work']['delivery']['point']=={'kind':'direction','speaker':None} and first['work']['rehearsalShown'] and first['work']['authorShown'],'kept script owns roles/order and only opened view flags')
  h.ok(not first['work']['teachingShown'],'entry does not imply teaching');click(p,'teaching');h.ok(len(rows(p))==1 and not rows(p)[0]['work']['teachingShown'],'opening teaching offers/uses a copy, never changes kept exposure')
  for i in range(5):
   h.ok(f'{i+1} of 5' in p.locator('#rc-task').inner_text(),'manual teaching page position persists')
   if i==1:h.ok(p.locator(sel('direction')).count()==1,'teaching direction remains backstage')
   if i==3:h.ok(p.locator(sel('audience')).count()==1 and not p.locator('.rc-active .rc-prop').count(),'the same direction as speech performs no event')
   if i<4:click(p,'teach-step',1)
  click(p,'close-help');click(p,'keep');second=copy.deepcopy(rows(p)[-1]);h.ok(second['work']['teachingShown'] and rows(p)[0]==first,'teaching copy preserves first version')
  click(p,'copy');draft=p.locator(sel('draft')).input_value();choose(p,'moon');click(p,'cue','moon');click(p,'kind','direction');h.ok(p.locator('.rc-prop svg').count()==1 and 'a paper moon' in p.locator(sel('direction')).inner_text(),'paper moon uses its own named drawing, not a snack')
  click(p,'keep');h.ok(rows(p)[-1]['work']['rehearsalShown'] is False,'a never-rehearsed partial version is keepable');click(p,'turn','rehearse');h.ok(len(rows(p))==3 and not rows(p)[-1]['work']['rehearsalShown'],'rehearsing a copy leaves the kept flag false')
  click(p,'turn','arrange');choose(p,'silence');click(p,'cue','pause');click(p,'kind','direction');h.ok('interpret this direction together' in p.locator(sel('direction')).inner_text(),'a shared silence has no invented timed/shared action');click(p,'kind','speech');click(p,'speaker','kitten');h.ok('Silence.' in p.locator(sel('audience')).inner_text(),'the same words can be a spoken command')
  d=p.locator('[data-rc-fold="drafts"]');d.locator(':scope>summary').click() if d.get_attribute('open') is None else None;p.locator(sel('draft')).select_option(draft);h.ok('Before the curtain' in p.locator('.rc-job-title').inner_text(),'different jobs retain the earlier working copy')
  p.screenshot(path=str(OUT/'tablet.png'),full_page=True);click(p,'back');h.ok(h.book(p)['syntheticSibling']==before['syntheticSibling'] and h.book(p).get('loft')==before.get('loft'),'Back preserves unrelated roots and original puppet dialogue')
  report=h.export_notes(p,'rehearsal-complete');h.ok(report['rehearsalScripts']==rows(p),'actual Notes carries source-owned versions');return report
 finally:c.close()

def transfer(browser,base,seed,report):
 print('Rehearsal: actual import, source-owned words, raw siblings and redownload',flush=True)
 altered=copy.deepcopy(report);old=copy.deepcopy(altered['rehearsalScripts'][0]);old['source']['title']='Earlier <script> & literal words';old['source']['cast'][0]['art']='earlier-actor';old['source']['cues'][0]['text']='Earlier exact words stay here.';old['source']['cues'][0]['event']={'actor':old['source']['cast'][0]['id'],'prop':'earlier-prop','propName':'the old paper sail'};old['source']['teaching'][0]['words']='Earlier teaching stays literal.';old['work']['extra']={'keep':'exact'}
 old_id=old['source']['cues'][0]['id'];new_id='earlier\u0000cue';old['source']['cues'][0]['id']=new_id
 for field in ['initialOrder','authorOrder']:old['source'][field]=[new_id if x==old_id else x for x in old['source'][field]]
 old['work']['order']=[new_id if x==old_id else x for x in old['work']['order']];old['work']['delivery'][new_id]=old['work']['delivery'].pop(old_id)
 altered['rehearsalScripts'][0]=old;dup=copy.deepcopy(old);dup['id']='rehearsal-777';altered['rehearsalScripts']=[{'id':'rehearsal-900','future':True},*altered['rehearsalScripts'],dup,copy.deepcopy(dup),None,None,None]
 c,p=setup(browser,base,seed)
 try:
  original=copy.deepcopy(h.book(p));p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-scripts.json','mimeType':'application/json','buffer':json.dumps(altered).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#loft"');p.locator('[data-rehearsal-open]').wait_for();enter(p);click(p,'shelf');h.ok('this format cannot be opened' in p.locator(sel('root')).inner_text(),'future/duplicate/unreadable siblings do not close the shelf')
  click(p,'shelf-step',1);h.ok('Earlier script 9' in p.locator(sel('root')).inner_text(),'raw shelf paginates beyond eight without pruning');click(p,'shelf-step',-1)
  click(p,'card',old['id']);h.ok('Earlier <script>' in p.locator('.rc-job-title').inner_text(),'saved title is literal, escaped and source-owned');h.ok(p.locator('.rc-puppet .rc-placeholder').count()==1,'unknown actor art is a labelled placeholder, never a rabbit fallback')
  click(p,'copy');p.locator('[data-rc-cue-index="'+str(old['work']['order'].index(new_id))+'"]').click();click(p,'kind','direction');h.ok('the old paper sail' in p.locator(sel('direction')).inner_text() and p.locator('.rc-prop .rc-placeholder').count()==1,'unknown prop retains its own accessible name and fallback')
  click(p,'keep');h.ok(rows(p)[-1]['id']=='rehearsal-901','future canonical IDs reserve suffixes');h.ok(rows(p)[:-1]==altered['rehearsalScripts'],'raw unreadable and duplicate rows stay exact')
  expected=copy.deepcopy(h.book(p));active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');p.reload();p.locator('[data-rehearsal-open],[data-select-explorer]').first.wait_for()
  if p.locator('[data-select-explorer="'+active+'"]').count():
   p.locator('[data-select-explorer="'+active+'"]').click();p.wait_for_url('**/#home');p.evaluate('location.hash="#loft"')
  p.locator('[data-rehearsal-open]').wait_for();h.ok(h.book(p)['rehearsalScripts']==expected['rehearsalScripts'],'reload never regrades saved words');again=h.export_notes(p,'rehearsal-redownload');h.ok(again['rehearsalScripts']==expected['rehearsalScripts'],'actual redownload remains exact')
  p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-1"]').click();p.wait_for_function('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId==="explorer-1"');h.ok(h.book(p)==original,'imported explorer leaves original notebook untouched')
 finally:c.close()

def parent_words(browser,base):
 print('Rehearsal: real parent newline/CRLF and rejected-input preservation',flush=True)
 for words,rejected in [('\nAn invented puppet line.',False),('\r\nA second invented line.',False),('Already kept.',True)]:
  seed=fixture('startShow(s,invitations[0].id);setLoftEditor(s,"words");setSceneDialogue(s,'+json.dumps(words)+');'+('s.loft.draft.changes=1000000000;' if rejected else ''))
  c,p=setup(browser,base,seed)
  try:
   inp=p.locator('#loft-dialogue');old=inp.element_handle();before=copy.deepcopy(h.book(p))
   if rejected:
    inp.fill('Waiting rejected words.');p.locator('[data-rehearsal-open]').click();h.ok(not p.locator(sel('root')).count() and p.locator('#loft-dialogue').input_value()=='Waiting rejected words.','actual capped edit blocks entry without losing typing');h.ok(old.evaluate('e=>e===document.querySelector("#loft-dialogue")'),'blocked entry keeps input identity');h.ok(h.book(p)==before,'blocked entry changes no record');inp.fill(inp.evaluate('e=>e.defaultValue'))
   enter(p);h.ok(h.book(p)==before,'accepted/newline-equivalent/default words enter without rewriting parent');click(p,'back');h.ok(h.book(p).get('loft')==before.get('loft'),'Back preserves original raw newline/capped parent')
  finally:c.close()

def responsive_and_saveoff(browser,base,seed):
 print('Rehearsal: responsive, keyboard, save-off download and actual reset',flush=True)
 for width,height in [(320,600),(1024,768)]:
  c,p=setup(browser,base,seed,width,height)
  try:
   enter(p);bounds(p);choose(p,'whose');bounds(p);p.screenshot(path=str(OUT/f'cast-{width}.png'),full_page=True);click(p,'speaker','rabbit');click(p,'turn','rehearse');p.locator(sel('step',1)).focus();p.keyboard.press('Enter');h.ok(p.locator('#rc-task').evaluate('e=>e===document.activeElement'),'keyboard stepping focuses cue heading');bounds(p)
   click(p,'keep');old=p.locator(sel('copy')).element_handle();p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click();p.locator('[data-film-skip]').click();p.evaluate('location.hash="#loft"');p.locator('[data-rehearsal-open]').wait_for();enter(p);old.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))');h.ok('rehearsalScripts' not in h.book(p),'actual reset and stale controls cannot resurrect scripts')
  finally:c.close()
 c,p=setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.evaluate('location.hash="#loft"');p.locator('[data-rehearsal-open]').wait_for();before=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())');enter(p);click(p,'speaker','dot');click(p,'keep');h.ok('saving was off' in p.locator('#rc-status').inner_text(),'save-off notice matches actual save result');h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==before,'save-off keeps session work out of storage');report=h.export_notes(p,'rehearsal-saveoff');h.ok(report['rehearsalScripts'][0]['work']['delivery']['point']['speaker']=='dot','actual download recovers session-only script')
 finally:c.close()

def actual_refusal(browser,base,seed):
 print('Rehearsal: actual shared-cap refusal without parent preparation',flush=True)
 bounded=copy.deepcopy(seed)
 def nodes(x):return 1+sum(nodes(v) for v in (x.values() if isinstance(x,dict) else x if isinstance(x,list) else []))
 bounded['syntheticNodeBoundary']=[];bounded['syntheticNodeBoundary']=[None]*(200000-nodes(bounded)-1)
 c,p=setup(browser,base,bounded)
 try:
  before=copy.deepcopy(h.book(p));enter(p);click(p,'speaker','dot');click(p,'turn','rehearse');h.ok(h.book(p)==before,'real near-cap entry/rehearsal allocates no parent or child record');click(p,'keep');h.ok(h.book(p)==before and 'could not be kept safely' in p.locator('#rc-status').inner_text(),'actual whole-Notes limit refuses Keep without losing waiting work');click(p,'turn','arrange');h.ok(p.locator(sel('speaker','dot')).get_attribute('aria-pressed')=='true','near-cap refusal retains chosen speaker')
 finally:c.close()

def isolated(browser,base):
 print('Rehearsal: labelled actual-UI refusal and context-fault harness',flush=True)
 c,p=setup(browser,base,fixture())
 def install():
  p.evaluate("""async()=>{const U=await import('./rehearsal-ui.mjs');history.replaceState(null,'','#loft');window.rcHarness={book:{rehearsalScripts:[],other:{exact:true}},owner:'invented-owner',active:true,allow:false,saves:0};const h=rcHarness;h.original=h.book;h.render=()=>{document.querySelector('main').innerHTML=U.rehearsalPage(h.book,h.owner);U.bindRehearsal(h.book,{notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,canExport:()=>h.allow,save:()=>{h.saves++;return{enabled:true,ok:true}},render:h.render});};U.openRehearsal(h.book,h.owner);h.render();}""")
 def dispatch(e):e.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
 try:
  install();click(p,'speaker','dot');click(p,'keep');h.ok(p.evaluate('rcHarness.book.rehearsalScripts.length')==0 and 'could not be kept' in p.locator('#rc-status').inner_text(),'preflight refusal preserves whole book and working script');p.evaluate('rcHarness.allow=true');click(p,'keep');h.ok(p.evaluate('rcHarness.book.rehearsalScripts[0].work.delivery.point.speaker')=='dot','retry keeps the waiting construction')
  for fault in ['owner','book','inactive','identity','bytes','ancestor','hidden','outer-hidden','route']:
   install();p.evaluate('rcHarness.allow=true');old=p.locator(sel('keep')).element_handle()
   if fault=='owner':p.evaluate('rcHarness.owner="other-owner"')
   elif fault=='book':p.evaluate('rcHarness.book=structuredClone(rcHarness.book)')
   elif fault=='inactive':p.evaluate('rcHarness.active=false')
   elif fault=='identity':p.evaluate('rcHarness.book.rehearsalScripts=[]')
   elif fault=='bytes':p.evaluate('rcHarness.book.rehearsalScripts.push({opaque:true})')
   elif fault=='ancestor':old.evaluate('e=>{const p=e.parentNode,b=document.createElement("div");p.parentNode.append(b);b.append(p)}')
   elif fault=='hidden':old.evaluate('e=>e.hidden=true')
   elif fault=='outer-hidden':p.locator('main').evaluate('e=>e.hidden=true')
   elif fault=='route':p.evaluate('history.replaceState(null,"","#loft/other")')
   before=p.evaluate('JSON.stringify([rcHarness.original,rcHarness.book])');dispatch(old);h.ok(p.evaluate('JSON.stringify([rcHarness.original,rcHarness.book])')==before and p.evaluate('rcHarness.saves')==0,'stale '+fault+' cannot Keep')
   p.locator('main').evaluate('e=>e.hidden=false')
  install();p.locator(sel('kind','speech')).focus();p.evaluate('rcHarness.book.rehearsalScripts.push({opaque:"newer"})');p.keyboard.press('Tab');h.ok(p.locator(sel('reopen')).evaluate('e=>e===document.activeElement'),'first stale Tab focuses recovery');p.keyboard.press('Tab');h.ok(not p.locator(sel('reopen')).evaluate('e=>e===document.activeElement'),'later Tab can leave recovery');click(p,'reopen');p.evaluate('rcHarness.allow=true');click(p,'keep');h.ok(p.evaluate('rcHarness.book.rehearsalScripts[0].opaque')=='newer','recovery retains newer raw sibling')
  p.evaluate('rcHarness.book.rehearsalScripts[1].work.order=[]');click(p,'back');click(p,'reopen');h.ok('Kept scripts' in p.locator('#rc-task').inner_text(),'unreadable active card returns to raw shelf');click(p,'working');h.ok(p.locator(sel('keep')).count()==1,'working draft remains accessible')
  install();old_root=p.locator(sel('root')).element_handle();old_keep=p.locator(sel('keep')).element_handle();click(p,'back');old_root.evaluate('e=>document.querySelector("main").append(e)');p.evaluate('rcHarness.allow=true');dispatch(old_keep);h.ok(p.evaluate('rcHarness.saves')==0,'reattached departed controls remain inert')
  install();click(p,'speaker','dot');p.evaluate('rcHarness.owner="second-owner"');p.evaluate("async()=>{const u=await import('./rehearsal-ui.mjs');u.openRehearsal(rcHarness.book,rcHarness.owner);rcHarness.render()}");click(p,'speaker','pip');p.evaluate('rcHarness.owner="invented-owner"');p.evaluate('rcHarness.render()');h.ok(p.locator(sel('speaker','dot')).get_attribute('aria-pressed')=='true','same notebook identity still isolates owner drafts')
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
   b=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    report=journey(b,base,seed);transfer(b,base,seed,report);parent_words(b,base);responsive_and_saveoff(b,base,seed);actual_refusal(b,base,seed);isolated(b,base);h.ok(not h.errors,'no console/page/HTTP errors: '+str(h.errors));print(json.dumps({'status':'passed','checks':h.checks,'base':base}),flush=True)
   except Exception:
    (OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
