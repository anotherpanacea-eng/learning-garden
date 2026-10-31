"""Spec341 actual-app synthetic touch/keyboard and Notes recovery journeys.
Chromium emulation; no audio, real learner files or learning-effect claim.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('BEAT_BENCH_ARTIFACTS',tempfile.mkdtemp(prefix='beat-bench-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
FER=[('fer-referring','referring','fer','b'),('fer-reference','reference','ref','a'),('fer-preferred','preferred','fer','a'),('fer-preference','preference','pref','b'),('fer-conferred','conferred','fer','b'),('fer-referee','referee','ee','a')]
MEANINGS=[('meaning-recover','recover','a','returned-book'),('meaning-re-cover','re-cover','b','chair-cloth'),('meaning-resign','resign','b','leaving-job'),('meaning-re-sign','re-sign','a','signature'),('meaning-coop','coop','a','hen-house'),('meaning-co-op','co-op','b','shared-shop')]
WALL=[('though','though'),('dough','though'),('through','through'),('thought','thought'),('bought','thought'),('tough','tough'),('rough','tough'),('cough','cough'),('bough','bough')]
JOBS=[('C1','b'),('C2','a'),('C3','c'),('C4','b')]
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def eq(a,b,message):ok(a==b,message+': '+repr(a)[:250])
def fixture(name='fresh'):
 code="import {signsSeed} from './test/market-signs-checks.mjs';import {fullBeatBenchNotebook} from './test/beat-bench-checks.mjs';import * as c from './dist/beat-bench-core.mjs';const o={canExport:()=>true};let s=signsSeed();"
 if name=='full':code+='s=fullBeatBenchNotebook();'
 if name in ['case','unknown-picture','bad-help','bad-checks','bad-first','bad-pointer','older-source','collision']:
  code+="c.openBeatCase(s,'fer-referring',o);c.answerBeatCase(s,'fer-referring','b',null,o);c.checkBeatCase(s,'fer-referring',o);c.keepBeatCase(s,'fer-referring',o);"
  damage={'unknown-picture':"s.beatBench.records['fer-referring'].source.pictureId='future-picture';s.beatBench.records['fer-referring'].source.pictureAlt='Earlier exact picture description.';",'bad-help':"s.beatBench.records['fer-referring'].help={opaque:['retained']};",'bad-checks':"s.beatBench.records['fer-referring'].checks.push({opaque:['retained']});",'bad-first':"s.beatBench.records['fer-referring'].firstKept={opaque:['retained']};",'bad-pointer':"s.beatBench.currentFerId='missing';",'older-source':"s.beatBench.source.fer=[];s.beatBench.records['fer-referring'].source.explanation='Earlier exact explanation.';",'collision':"const r=s.beatBench.records['fer-referring'];r.source.id='hasOwnProperty';s.beatBench.records={hasOwnProperty:r};s.beatBench.currentFerId='hasOwnProperty';s.beatBench.source.fer=[];"}
  code+=damage.get(name,'')
 if name=='future':code+="s.beatBench={v:99,raw:['retained']};"
 if name=='wall-opaque':code+="c.openBeatBench(s,'wall',o);s.beatBench.wall.placements.dough={opaque:['retained']};"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code+'console.log(JSON.stringify(s));'],cwd=ROOT,text=True))
def state(p):return p.evaluate('window.__beatRead()')
def root(p):return state(p).get('beatBench')
def rec(p):
 r=root(p);key={'fer':'currentFerId','meanings':'currentMeaningId','practice':'currentJobId'}[r['view']];return r['records'][r[key]]
def action(p,name,extra=''):return p.locator('[data-bb-action="'+name+'"]'+extra).first
def tap(p,name,extra=''):
 target=action(p,name,extra)
 if target.count() and not target.is_visible():
  edit=p.locator('[data-bb-action=edit-case]:visible,[data-bb-action=edit-wall]:visible')
  if edit.count():
   before=copy.deepcopy(root(p));edit.first.tap();eq(root(p),before,'explicit return to editing preserves all work')
 target.tap()
def bench(p,name):tap(p,'bench','[data-bb-view='+name+']')
def choose(p,key):
 picker=p.locator('[data-bb-case-picker]');picker.evaluate('e=>{const d=e.closest("details");if(d)d.open=true;}');picker.select_option(key)
def drawer(p,name,opened=True):
 d=p.locator('[data-bb-panel="'+name+'"]')
 if d.count() and (d.get_attribute('open') is not None)!=opened:d.locator(':scope > summary').tap()
def ready(p):
 p.locator('[data-beat-bench-root],[data-select-explorer]').first.wait_for()
 if not p.locator('[data-beat-bench-root]').count():p.locator('[data-select-explorer]').first.tap()
 p.locator('[data-beat-bench-root]').wait_for()
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':key,'avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-31T12:00:00.000Z'}for key in ['explorer-1','explorer-2']]}
 c.add_init_script('(d=>{if(!localStorage.getItem("beat-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem("number-garden-v1:"+e.id,JSON.stringify(d.seed));localStorage.setItem("beat-fixture","1");}window.beatWrites=0;window.beatSpoken=[];const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.beatFailStorage)throw Error("Synthetic storage failure");if(k.startsWith("number-garden")||k==="learning-garden-explorers")window.beatWrites++;return set.call(this,k,v);};speechSynthesis.speak=u=>window.beatSpoken.push(u.text);})('+json.dumps({'registry':registry,'seed':seed})+')')
 def app(route):
  response=route.fetch();body=response.text();marker='let graph=null,';assert body.count(marker)==1;body=body.replace(marker,'window.__beatRead=()=>structuredClone(state);window.__beatMutate=f=>f(state);'+marker,1)
  start=body.index('bindBeatBench(state,{');end=body.index('});',start);chunk=body[start:end];assert 'canExport:candidate=>'in chunk
  body=body[:start]+chunk.replace('canExport:candidate=>','canExport:candidate=>!window.beatRefuse&&')+body[end:];route.fulfill(response=response,body=body)
 c.route('**/app.mjs',app)
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+'#library/beat',wait_until='networkidle');ready(p);return c,p
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 for e in p.locator('[data-beat-bench-root] :is(button,select,summary,a):visible').all():
  box=e.bounding_box();ok(box and box['height']>=43.9,'44px target '+e.inner_text()[:30]);ok(e.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)>=16'),'16px functional controls')
 ok(p.locator('[data-beat-bench-root] [data-speak]').count()==0,'no speech controls in this text-only room')
def compare_geometry(p):
 boxes=p.evaluate('''()=>{const task=document.querySelector('#bb-task').getBoundingClientRect(),feedback=document.querySelector('#bb-feedback').getBoundingClientRect(),tabs=document.querySelector('.bb-tabs')?.getBoundingClientRect();return {task:{top:task.top,bottom:task.bottom},feedback:{top:feedback.top,bottom:feedback.bottom},bar:tabs?tabs.bottom:0,height:innerHeight};}''')
 ok(boxes['task']['top']>=boxes['bar']-1,'prompt below sticky navigation after compare');ok(0<=boxes['feedback']['top']<boxes['height'],'feedback visible after compare')
 word=p.locator('[data-bb-whole-word]')
 if word.count():
  box=word.bounding_box();ok(box['y']>=boxes['bar']-1 and box['y']+box['height']<=boxes['height'],'whole printed word remains visible during feedback')
def download(p,label):
 p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
 film=p.locator('dialog.welcome-film[open] [data-film-skip]')
 if film.count():film.first.tap()
 with p.expect_download()as d:p.locator('#download').tap()
 path=OUT/(label+'.json');d.value.save_as(str(path));return json.loads(path.read_text())
def import_report(p,report,base):
 p.locator('#progress-file').set_input_files({'name':'synthetic-beat.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#library/beat"');ready(p)
def play(browser,base,width,height):
 c,p=setup(browser,base,fixture(),width,height)
 try:
  initial=state(p);ok(root(p)is None,'passive arrival allocates no Beat Bench');ok('Rules usually work. A dictionary has the last word.'in p.locator('main').inner_text(),'dictionary qualification present');p.evaluate('location.hash="#notes"');p.locator('#download').wait_for();ok(root(p)is None,'Notes allocates nothing');p.evaluate('location.hash="#words"');p.locator('a[href="#library/beat"]').tap();ready(p)
  bench(p,'fer');ok(not root(p)['records'],'bench opens without default answer');tap(p,'next-case');eq(root(p)['currentFerId'],'fer-referring','explicit Next selects first case');tap(p,'previous-case');eq(root(p)['currentFerId'],'fer-referee','Previous wraps');
  for key,word,highlight,fit in FER:
   choose(p,key);ok('Your chosen letters:'not in p.locator('main').inner_text(),'unchosen form has no literal readout');
   printed=p.locator('[data-bb-stress]')
   if not printed.count():printed=p.locator('.bb-word').first
   eq(printed.inner_text(),word,'whole lowercase printed word');eq(printed.locator('strong').inner_text(),highlight,'exact written stress range')
   tap(p,'keep-case');first=copy.deepcopy(rec(p)['firstKept']);tap(p,'check-case');eq(rec(p)['checks'][-1]['outcome'],'incomplete','unfinished case distinct')
   for choice in ['a','b']:
    tap(p,'answer','[data-bb-choice='+choice+']');tap(p,'check-case');eq(rec(p)['checks'][-1]['outcome'],'fit'if choice==fit else'different','literal spelling choice result');compare_geometry(p)
    if width==320 and key=='fer-referring' and choice=='b':p.screenshot(path=str(OUT/'compare-320-viewport.png'))
   tap(p,'answer','[data-bb-choice='+fit+']');tap(p,'check-case');tap(p,'keep-case');eq(rec(p)['firstKept'],first,'first case keep exact');layout(p)
  choose(p,'fer-referee');tap(p,'hint');tap(p,'example');ok(rec(p)['help']['hint'] and rec(p)['help']['example'],'requested supports recorded before shown');ok(p.locator('#bb-hint').is_visible() and p.locator('#bb-example').is_visible(),'requested supports shown')
  drawer(p,'case-fer-referee-first');tap(p,'restore-case','[data-bb-edition=first]');eq(rec(p)['work']['choice'],None,'native first edition restores unfinished choice');ok(rec(p)['help']['hint'] and rec(p)['help']['example'],'native restore cannot erase requested help');drawer(p,'case-fer-referee-latest');tap(p,'restore-case','[data-bb-edition=latest]');eq(rec(p)['work']['choice'],'a','native latest edition restores literal choice')
  p.screenshot(path=str(OUT/f'beats-{width}.png'),full_page=True);fer=copy.deepcopy(root(p)['records']);bench(p,'meanings')
  for key,word,fit,picture in MEANINGS:
   choose(p,key);ok(word in p.locator('#bb-task').inner_text(),'printed meaning form');ok(p.locator('.bb-picture svg').count()==1,'original finite meaning picture '+picture)
   lengths=p.locator('[data-bb-action=answer]').all_text_contents();eq(len(lengths[0]),len(lengths[1]),'equal length alternatives')
   for choice in ['a','b']:tap(p,'answer','[data-bb-choice='+choice+']');tap(p,'check-case');eq(rec(p)['checks'][-1]['outcome'],'fit'if choice==fit else'different','each finite contextual meaning')
   tap(p,'answer','[data-bb-choice='+fit+']');tap(p,'keep-case');layout(p)
   if width==820 and key=='meaning-re-cover':p.screenshot(path=str(OUT/'meaning-820-viewport.png'))
  eq({k:root(p)['records'][k]for k in fer},fer,'meaning turns preserve all spelling drafts');p.screenshot(path=str(OUT/f'meanings-{width}.png'),full_page=True)
  bench(p,'letters');before=copy.deepcopy(root(p));writes=p.evaluate('beatWrites')
  for key in ['receive','ceiling','deceive','receipt','seize','protein','science','field']:p.locator('[data-bb-letter-picker]').select_option(key);tap(p,'turn-letter');tap(p,'next-letter');tap(p,'previous-letter')
  eq(root(p),before,'read-only letter flipping/paging records nothing');eq(p.evaluate('beatWrites'),writes,'letter paging no writes');layout(p)
  bench(p,'wall');eq(root(p)['wall']['currentWordId'],'though','first explicit wall selects its first word');tap(p,'keep-wall');first=copy.deepcopy(root(p)['wall']['firstKept']);tap(p,'check-wall');eq(root(p)['wall']['checks'][-1]['status'],'incomplete','unfinished wall keepable')
  p.locator('[data-bb-word-picker]').select_option('dough');tap(p,'place','[data-bb-tray=cough]');tap(p,'keep-wall');eq(root(p)['wall']['placements']['dough'],'cough','unexpected wall grouping keepable')
  for word,tray in WALL:p.locator('[data-bb-word-picker]').select_option(word);tap(p,'place','[data-bb-tray='+tray+']')
  tap(p,'check-wall');eq(root(p)['wall']['checks'][-1]['status'],'listed','all nine finite printed anchors');tap(p,'keep-wall');eq(root(p)['wall']['firstKept'],first,'first wall keep retained');layout(p);p.screenshot(path=str(OUT/f'wall-{width}.png'),full_page=True)
  tap(p,'wall-hint');p.locator('[data-bb-word-picker]').select_option('dough');wall_help=copy.deepcopy(root(p)['wall']['help']);drawer(p,'wall-first');tap(p,'restore-wall','[data-bb-edition=first]');eq(root(p)['wall']['placements'],first['placements'],'native wall first restores placements only');eq(root(p)['wall']['currentWordId'],'dough','wall restore retains chosen word');eq(root(p)['wall']['help'],wall_help,'wall restore retains help');drawer(p,'wall-latest');tap(p,'restore-wall','[data-bb-edition=latest]');eq(root(p)['wall']['placements'],dict(WALL),'native wall latest restores all nine printed groups')
  bench(p,'practice')
  for key,fit in JOBS:
   choose(p,key);tap(p,'keep-case');tap(p,'check-case');eq(rec(p)['checks'][-1]['outcome'],'incomplete','job starts unfinished')
   for choice in ['a','b','c']:tap(p,'answer','[data-bb-choice='+choice+']');tap(p,'check-case');eq(rec(p)['checks'][-1]['outcome'],'fit'if choice==fit else'different','every finite job option')
   tap(p,'answer','[data-bb-choice='+fit+']');tap(p,'keep-case');layout(p)
  choose(p,'C5')
  for part,fit in [('science','not-true'),('seize','true'),('rhyme','not-true')]:p.locator('[data-bb-part-picker]').select_option(part);tap(p,'answer','[data-bb-choice='+fit+']')
  tap(p,'check-case');eq(rec(p)['checks'][-1]['outcome'],'fit','three independent True/Not true placements');tap(p,'keep-case');layout(p)
  # Native placeholder and keyboard use; no Playwright option is_disabled wrapper.
  eq(p.locator('[data-bb-case-picker] option[value=""]').evaluate('e=>e.disabled&&e.matches(":disabled")'),True,'selected case placeholder natively disabled');held=copy.deepcopy(root(p));p.locator('[data-bb-case-picker]').evaluate('e=>{e.value="";e.dispatchEvent(new Event("change",{bubbles:true}));}');eq(root(p),held,'synthetic empty case no-op');
  if action(p,'edit-case').count():tap(p,'edit-case')
  action(p,'clear-case').focus();p.keyboard.press('Enter');tap(p,'check-case');eq(rec(p)['checks'][-1]['outcome'],'incomplete','keyboard clears active statement only');edited=copy.deepcopy(root(p)['records']['C5']);tap(p,'skip');eq(root(p)['records']['C5'],edited,'Skip leaves edited work and history');choose(p,'C5')
  for k,v in initial.items():eq(state(p)[k],v,'unrelated root exact '+k)
  eq(len(root(p)['records']),17,'all seventeen cases retained');held=copy.deepcopy(root(p));p.reload(wait_until='networkidle');ready(p);eq(root(p),held,'reload exact root/source/history');report=download(p,'all-'+str(width));eq(report['beatBench'],held,'actual Notes download exact');ok(p.locator('[data-beat-bench-notes]').count()==1,'human Notes integrated');import_report(p,report,base);eq(root(p),held,'actual Notes import exact');p.reload(wait_until='networkidle');ready(p);eq(root(p),held,'import reload exact');eq(p.evaluate('beatSpoken'),[],'room makes no speech requests')
 finally:c.close()

def edges(browser,base):
 # Maximum commissioned history traverses actual native download/import/reload.
 maximum=fixture('full');c,p=setup(browser,base,maximum)
 try:
  eq(root(p),maximum['beatBench'],'maximum notebook opens without normalization');report=download(p,'maximum');eq(report['beatBench'],maximum['beatBench'],'maximum actual Notes exact');import_report(p,report,base);p.reload(wait_until='networkidle');ready(p);eq(root(p),maximum['beatBench'],'maximum native import/reload exact');
  for key in maximum:
   if key!='beatBench':eq(state(p)[key],maximum[key],'maximum older namespace exact '+key)
 finally:c.close()
 for mode in ['off','failure','refusal']:
  c,p=setup(browser,base,fixture())
  try:
   if mode=='off':p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#library/beat"');ready(p)
   if mode=='failure':p.evaluate('beatFailStorage=true')
   if mode=='refusal':
    before=state(p);p.evaluate('beatRefuse=true');bench(p,'fer');eq(state(p),before,'refused first allocation leaves entire notebook exact');p.evaluate('beatRefuse=false')
   bench(p,'fer');choose(p,'fer-referring')
   if mode=='refusal':
    before=state(p);p.evaluate('beatRefuse=true');tap(p,'answer','[data-bb-choice=b]');eq(state(p),before,'refused answer exact');drawer(p,'help');tap(p,'example');eq(state(p),before,'refused example exact');ok(not rec(p)['help']['example'],'refused help undisclosed flag');p.evaluate('beatRefuse=false')
   tap(p,'answer','[data-bb-choice=b]');tap(p,'keep-case');held=copy.deepcopy(root(p));report=download(p,'storage-'+mode);eq(report['beatBench'],held,'actual RAM Notes '+mode);eq(report['beatBench']['records']['fer-referring']['work']['choice'],'b','RAM literal choice '+mode)
  finally:c.close()
 # Guards apply to connected controls as well as detached, hidden details and
 # route/owner changes. Mutating controls are deliberately dispatched directly.
 for alteration in ['hidden','inert','disabled','css','film','source','pointer','departed']:
  c,p=setup(browser,base,fixture('case'))
  try:
   control=action(p,'answer','[data-bb-choice=a]');p.evaluate('window.beatOld=document.querySelector("[data-bb-action=answer][data-bb-choice=a]")')
   if alteration=='hidden':control.evaluate('e=>e.hidden=true')
   elif alteration=='inert':control.evaluate('e=>e.closest("section").inert=true')
   elif alteration=='disabled':control.evaluate('e=>e.disabled=true')
   elif alteration=='css':control.evaluate('e=>e.style.visibility="hidden"')
   elif alteration=='film':p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";d.open=true;document.body.append(d)')
   elif alteration=='source':p.evaluate('__beatMutate(s=>s.beatBench.records["fer-referring"].source.prompt="Earlier changed source.")')
   elif alteration=='pointer':choose(p,'fer-reference')
   elif alteration=='departed':p.evaluate('location.hash="#words"');p.locator('a[href="#library/beat"]').wait_for()
   before=state(p);p.evaluate('beatOld.click()');eq(state(p),before,'old/blocked answer no-op '+alteration)
  finally:c.close()
 c,p=setup(browser,base,fixture('case'))
 try:
  before=state(p);action(p,'step').dispatch_event('click');eq(state(p),before,'closed teaching control cannot change work');tap(p,'hint');ok(rec(p)['help']['hint'],'visible requested hint recorded');before=state(p);tap(p,'hint');eq(state(p),before,'already requested help makes no write')
  p.evaluate('window.beatOwnerOld=document.querySelector("[data-bb-action=answer][data-bb-choice=a]")');original=copy.deepcopy(root(p));p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();ready(p);ok(root(p)is not None,'second explorer fixture has separate root');before=state(p);p.evaluate('beatOwnerOld.click()');eq(state(p),before,'other owner stale control no-op');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();ready(p);eq(root(p),original,'original owner exact')
  p.evaluate('window.beatResetOld=document.querySelector("[data-bb-action=answer]");location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');p.evaluate('location.hash="#library/beat"');ready(p);p.evaluate('beatResetOld.click()');ok(root(p)is None,'reset era callback cannot resurrect root')
 finally:c.close()
 for name in ['future','unknown-picture','bad-help','bad-checks','bad-first','bad-pointer','older-source','collision','wall-opaque']:
  initial=fixture(name);c,p=setup(browser,base,initial)
  try:
   ok('undefined'not in p.locator('main').inner_text(),'no undefined copy '+name)
   if name=='future':ok(p.locator('[data-bb-action]').count()==0,'future root read-only')
   elif name=='unknown-picture':ok('Earlier exact picture description.'in p.locator('main').inner_text(),'unknown picture literal alternative')
   elif name=='bad-help':ok(p.locator('[data-bb-action=answer]:enabled').count()==0,'malformed help pauses only current case');choose(p,'fer-reference');tap(p,'answer','[data-bb-choice=a]');eq(root(p)['records']['fer-referring'],initial['beatBench']['records']['fer-referring'],'malformed sibling exact')
   elif name=='bad-checks':tap(p,'answer','[data-bb-choice=a]');tap(p,'keep-case');eq(root(p)['records']['fer-referring']['checks'],initial['beatBench']['records']['fer-referring']['checks'],'bad check row raw alongside current work')
   elif name=='bad-first':tap(p,'answer','[data-bb-choice=a]');tap(p,'keep-case');eq(root(p)['records']['fer-referring']['firstKept'],initial['beatBench']['records']['fer-referring']['firstKept'],'bad first preserved latest allowed')
   elif name=='bad-pointer':eq(root(p)['currentFerId'],'missing','missing pointer untouched');ok(p.locator('[data-bb-action=answer]').count()==0,'missing pointer chooser');choose(p,'fer-reference')
   elif name=='older-source':tap(p,'answer','[data-bb-choice=b]');tap(p,'check-case');ok('Earlier exact explanation.'in p.locator('#bb-feedback').inner_text(),'record-owned earlier source used')
   elif name=='collision':drawer(p,'teaching-hasOwnProperty');drawer(p,'teach-hasOwnProperty-card11');buttons=p.locator('[data-bb-action=step]');ok(buttons.count()>0,'own-property source id retains teaching controls');buttons.first.tap();eq(root(p)['currentFerId'],'hasOwnProperty','own-property view lookup safe')
   elif name=='wall-opaque':p.locator('[data-bb-word-picker]').select_option('though');tap(p,'place','[data-bb-tray=though]');eq(root(p)['wall']['placements']['dough'],{'opaque':['retained']},'opaque wall placement isolated')
   held=copy.deepcopy(root(p));report=download(p,'retained-'+name);eq(report['beatBench'],held,'actual raw recovery export '+name);notes=p.locator('[data-beat-bench-notes]');ok(notes.count()==1,'human Notes exists beside malformed sibling '+name)
  finally:c.close()
 # A stale tab must not overwrite the newer persisted notebook.
 c,p=setup(browser,base,fixture('case'))
 try:
  q=c.new_page();q.goto(base+'#library/beat');ready(q);choose(q,'fer-reference');tap(q,'answer','[data-bb-choice=a]');saved=q.evaluate('localStorage.getItem("number-garden-v1:explorer-1")');tap(p,'answer','[data-bb-choice=a]');eq(p.evaluate('localStorage.getItem("number-garden-v1:explorer-1")'),saved,'older tab does not overwrite newer notebook');held=root(p);eq(download(p,'stale-tab')['beatBench'],held,'stale RAM work downloadable')
 finally:c.close()
class Quiet(http.server.SimpleHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
def main():
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('BEAT_BENCH_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright()as pw:
   kwargs={'headless':True,'args':['--disable-quic']};chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
   if Path(chrome).exists():kwargs['executable_path']=chrome
   b=pw.chromium.launch(**kwargs)
   try:
    for w,h in [(320,600),(820,1000),(1024,768)]:play(b,base,w,h);print('Beat Bench viewport',w,'passed',flush=True)
    edges(b,base);ok(not errors,'no browser errors '+str(errors));receipt={'status':'passed','checks':checks};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(receipt)
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
