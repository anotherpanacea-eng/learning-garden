"""Spec335 synthetic real-app journeys; physical Apple/audio/learning remain unqualified."""
import sys
sys.dont_write_bytecode=True
import copy,re,functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('PIPS_COPY_ARTIFACTS',tempfile.mkdtemp(prefix='pips-copy-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,label):
 global checks
 assert value,label
 checks+=1
def eq(a,b,label):ok(a==b,label)
def fixture(code=''):
 script="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import * as P from './dist/pips-copy-core.mjs';import * as E from './dist/endings-shelf-core.mjs';import * as S from './dist/stained-map-core.mjs';import {canExportPips} from './test/pips-copy-checks.mjs';let s=initializeExplorerState(freshState());const o={canExport:canExportPips};"+code+';console.log(JSON.stringify(s));'
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
def book(p):return p.evaluate('window.pcBook()')
def tap(p,action,extra=''):p.locator('[data-pc-action="'+action+'"]'+extra).first.tap()
def table(p,name):tap(p,'table','[data-pc-table='+name+']')
def layout(p,label):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),label+' no overflow')
 small=p.locator('.pc-room button:visible,.pc-room a:visible,.pc-room select:visible,.pc-room summary:visible').evaluate_all("els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width<43.9||r.height<43.9}).map(e=>e.outerHTML.slice(0,100))")
 eq(small,[],label+' 44px controls '+str(small))
def setup(browser,base,seed,width=820,height=1000):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-31T12:00:00.000Z'}]}
 c.add_init_script('(d=>{if(!localStorage.getItem("pc-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(d.seed));localStorage.setItem("pc-fixture","1");}window.pcSpoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,"speechSynthesis",{value:{getVoices:()=>[{name:"Fixture English",voiceURI:"fixture",lang:"en-US",localService:true}],addEventListener(){},removeEventListener(){},cancel(){},speak(u){window.pcSpoken.push(u.text);u.onstart?.();}}});const write=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.pcStorageFail&&k.startsWith("number-garden"))throw Error("Synthetic storage refusal");return write.call(this,k,v);};})('+json.dumps({'registry':registry,'seed':seed})+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body
  body=body.replace('let graph=null,','window.pcBook=()=>structuredClone(state);window.pcReplace=s=>{state=s;render();};window.pcReplaceStory=s=>{state.story=s;render();};let graph=null,',1)
  start=body.index('bindPipsCopy(state,{');end=body.index('});const notice=',start);chunk=body[start:end]
  route.fulfill(response=response,body=body[:start]+chunk.replace('canExport:candidate=>','canExport:candidate=>!window.pcRefuse&&')+body[end:])
 c.route('**/app.mjs',app);p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+'#library/copy',wait_until='networkidle');p.locator('[data-pips-copy-root]').wait_for();return c,p
KEY={'high':'high','advice':'advice','effect':'effect','led':'led'}
JOBS={'d1':'kneads','d2':'advice','d3':'effect','d4':'led','d5':'which'}
def run(browser,base):
 for width,height in [(320,600),(820,1000),(1024,768)]:
  seed=fixture();c,p=setup(browser,base,seed,width,height)
  try:
   eq(book(p),seed,'preview preserves notebook');layout(p,'arrival');table(p,'postcard');layout(p,'postcard')
   if width==820:
    p.locator('#pc-task').evaluate('e=>e.scrollIntoView({block:"start"})');ok(p.locator('.pc-current .pc-sentence,.pc-current .pc-clue,.pc-current .pc-tray').evaluate_all('els=>els.length===3&&els.every(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;})'),'sentence clue and tiles visible together on tablet')
   eq(p.locator('.pc-sentence strong').inner_text(),'high','original word is visible without a decision');eq(book(p)['pipsCopy']['postcard']['work']['placements']['high'],None,'untouched original is not a decision')
   tap(p,'place','[data-pc-choice=hi]');eq(p.locator('.pc-sentence strong').inner_text(),'hi','literal different word');ok(p.locator('[data-pc-choice=hi]').evaluate('e=>e===document.activeElement'),'tile focus');tap(p,'check');ok('Hi is a greeting' in p.locator('.pc-feedback').inner_text(),'sentence-specific feedback');tap(p,'keep');first=copy.deepcopy(book(p)['pipsCopy']['postcard']['firstKept'])
   p.locator('[data-pc-speak=postcard]').tap();spoken=' '.join(p.evaluate('window.pcSpoken'));ok('Each marked word will be read as blank.' in spoken and spoken.count('blank')==5,'introduction plus four whole-word blanks');ok(not re.search(r'\b(?:hi|high|advise|advice|affect|effect|lead|led)\b',spoken),'postcard narration excludes trial, originals and fitting choices')
   p.evaluate('window.pcSpoken=[]');p.locator('[data-pc-speak=prompt]').tap();closed=' '.join(p.evaluate('window.pcSpoken'));ok("Pip's postcard says" not in closed and 'Homophones sound the same' not in closed,'closed story and teaching excluded');p.locator('[data-pc-panel=story] summary').tap();p.evaluate('window.pcSpoken=[]');p.locator('[data-pc-speak=prompt]').tap();story=' '.join(p.evaluate('window.pcSpoken'));ok("Pip's postcard says: Dear Léon" in story and 'some advise' in story,'story narration frames original draft');p.locator('[data-pc-panel=story] summary').tap()
   tap(p,'put-back');ok(p.locator('[data-pc-picker]').evaluate('e=>e===document.activeElement'),'clear focuses picker')
   for slot,word in KEY.items():p.locator('[data-pc-picker]').select_option(slot);tap(p,'place','[data-pc-choice='+word+']')
   tap(p,'check');eq(book(p)['pipsCopy']['postcard']['checks'][-1]['outcome'],'fit','all sentence decisions fit');tap(p,'keep');eq(book(p)['pipsCopy']['postcard']['firstKept'],first,'first keep immutable')
   p.locator('[data-pc-picker]').select_option('effect');tap(p,'place','[data-pc-choice=efect]');tap(p,'check');check=book(p)['pipsCopy']['postcard']['checks'][-1];eq(check['outcome'],'different','complete different version');eq(check['feedback'],['Some choices do not fit this postcard yet. Read the word notes for help.',"The rain: Here the word for the result is effect, with two f's."],'different spelling feedback exact');tap(p,'keep');eq(book(p)['pipsCopy']['postcard']['latestKept']['check']['outcome'],'different','keep complete different version');eq(book(p)['pipsCopy']['postcard']['firstKept'],first,'different keep preserves first')
   held=copy.deepcopy(book(p));p.evaluate('document.querySelector("[data-pc-panel=keep-first] [data-pc-action=restore]").click()');eq(book(p),held,'closed keep control inert')
   for slot,word in KEY.items():
    # Visible word buttons provide a keyboard path without depending on the host's native select popup.
    p.locator('[data-pc-action=select][data-pc-gap='+slot+']').focus();p.keyboard.press('Enter');eq(p.locator('[data-pc-picker]').input_value(),slot,'keyboard selects '+slot);p.locator('[data-pc-action=place][data-pc-choice='+word+']').focus();p.keyboard.press('Enter');eq(book(p)['pipsCopy']['postcard']['work']['placements'][slot],word,'keyboard revises '+slot)
   tap(p,'check');tap(p,'keep');p.screenshot(path=str(OUT/f'postcard-{width}.png'),full_page=True)
   p.locator('[data-pc-panel=original] summary').tap();ok('some advise' in p.locator('[data-pc-panel=original]').inner_text(),'original stays inspectable')
   p.locator('[data-pc-panel=keep-first] summary').tap();ok('hi' in p.locator('[data-pc-panel=keep-first] .pc-message').inner_text(),'kept literal trial');tap(p,'restore','[data-pc-edition=first]');eq(book(p)['pipsCopy']['postcard']['work'],first['work'],'reopen first copy');p.locator('[data-pc-panel=keep-latest] summary').tap();tap(p,'restore','[data-pc-edition=latest]')
   p.locator('[data-pc-panel=teach-card14] summary').tap();eq(p.locator('[data-pc-panel=teach-card14] li').count(),1,'postcard example reveals first step beside work');tap(p,'step','[data-pc-card=card14]');eq(p.locator('[data-pc-panel=teach-card14] li').count(),2,'worked step advances');p.keyboard.press('Enter');ok(p.locator('[data-pc-panel=teach-card14] .pc-worked').evaluate('e=>e===document.activeElement'),'global endpoint focus');p.locator('[data-pc-panel=teach-card14] summary').tap()
   table(p,'practice')
   for job,choice in JOBS.items():
    tap(p,'job','[data-pc-job='+job+']');layout(p,job)
    if job=='d1':ok('Choose the one with k and ea.' in p.locator('.pc-room').inner_text(),'D1 guided cue before response')
    if job=='d5':p.evaluate('window.pcSpoken=[]');p.locator('[data-pc-speak=prompt]').tap();ok('Witch' not in ' '.join(p.evaluate('window.pcSpoken')),'prompt speech excludes choices');ok('_' not in ' '.join(p.evaluate('window.pcSpoken')),'prompt blank has no residual underscore')
    tap(p,'hint');tap(p,'example');eq(p.locator('.pc-worked li').count(),1,'actual example starts at first step');tap(p,'step');tap(p,'step');ok(p.locator('.pc-worked').evaluate('e=>e===document.activeElement'),'worked endpoint focus');tap(p,'step-back');tap(p,'step-back');tap(p,'step-back');ok(p.locator('.pc-worked').evaluate('e=>e===document.activeElement'),'worked zero-step focus')
    tap(p,'answer','[data-pc-choice='+choice+']');ok(p.locator('[data-pc-action=answer][data-pc-choice='+choice+']').evaluate('e=>e===document.activeElement'),'answer focus');tap(p,'check');eq(book(p)['pipsCopy']['items'][job]['checks'][-1]['outcome'],'fit',job+' fits');tap(p,'keep');tap(p,'put-back');ok(p.locator('[data-pc-action=answer]').first.evaluate('e=>e===document.activeElement'),'answer clear focus')
   p.screenshot(path=str(OUT/f'job-{width}.png'),full_page=True);held=copy.deepcopy(book(p)['pipsCopy']['items']['d5']);tap(p,'skip');eq(book(p)['pipsCopy']['currentId'],'d1','skip wraps');eq(book(p)['pipsCopy']['items']['d5'],held,'skip preserves current job')
   table(p,'postcard');eq(book(p)['pipsCopy']['postcard']['work']['placements'],KEY,'postcard survives table return')
   held=copy.deepcopy(book(p)['pipsCopy']);p.goto(base+'#notes');p.locator('#download').wait_for();eq(p.locator('[data-pips-copy-notes]').count(),1,'Notes has summary')
   with p.expect_download() as download:p.locator('#download').tap()
   file=OUT/f'notes-{width}.json';download.value.save_as(file);eq(json.loads(file.read_text())['pipsCopy'],held,'real notes download');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],held,'actual import');p.reload(wait_until='networkidle');p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],held,'reload preserves work')
  finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o)"))
 try:
  tap(p,'place','[data-pc-choice=high]');first=copy.deepcopy(book(p)['pipsCopy']);p.goto(base+'#notes')
  with p.expect_download() as download:p.locator('#download').tap()
  file=OUT/'second-owner.json';download.value.save_as(file);p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();tap(p,'place','[data-pc-choice=hi]');second=copy.deepcopy(book(p)['pipsCopy']);p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],first,'separate explorer work')
  p.goto(base+'#notes');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();ok('pipsCopy' not in book(p),'reset clears only active explorer');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],second,'second explorer survives reset')
 finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o);s.pipsCopy.source.postcard.slots=s.pipsCopy.source.postcard.slots.slice(0,2).reverse()"+";s.pipsCopy.source.postcard.segments=[{slotId:'advice'},{text:' / '},{slotId:'high'}];s.pipsCopy.source.postcard.slots[0].context={before:'Synthetic retained ',after:'.'}"))
 try:
  eq(p.locator('[data-pc-picker] option').all_text_contents(),["Dot's guidance",'The river'],'older source order retained');ok('Synthetic retained' in p.locator('.pc-sentence').inner_text(),'older source context used');tap(p,'place','[data-pc-choice=advice]');ok('advice' in p.locator('.pc-message').first.inner_text(),'older source playable')
 finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsJob(s,'d1',o);s.pipsCopy.items.d1.checks=[{}]"))
 try:ok('earlier work at this table' in ' '.join(p.locator('.pc-notice').all_text_contents()),'unreadable job checks explained')
 finally:c.close()
 for code in ["s.pipsCopy={v:99,raw:'Synthetic future'}","s.endingsShelf={v:99,raw:'Synthetic future'}"]:
  c,p=setup(browser,base,fixture(code))
  try:
   held=book(p)
   if 'pipsCopy' in held:ok('format this version cannot read' in p.locator('.pc-notice').inner_text(),'unsupported Pip notice');p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();p.locator('[data-es-table=letter]').tap();eq(book(p)['pipsCopy'],held['pipsCopy'],'sibling leaves unsupported Pip untouched')
   else:table(p,'postcard');eq(book(p)['endingsShelf'],held['endingsShelf'],'Pip leaves unsupported sibling untouched')
  finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  p.goto(base+'#library/spellings');p.locator('[data-stained-map-root]').wait_for();p.locator('[data-sm-table=map]').tap();p.locator('[data-sm-choice=gh]').tap();old=copy.deepcopy(book(p)['spellings']);p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();table(p,'postcard');tap(p,'place','[data-pc-choice=high]');eq(book(p)['spellings'],old,'Stained-first native entry intact')
 finally:c.close()
 for width in [320,820]:
  c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o);delete s.pipsCopy.source.postcard.slots[0].context;s.pipsCopy.source.postcard.slots[1].context=[]"),width,1000)
  try:ok('no separate sentence view' in p.locator('.pc-current').inner_text(),'old missing context explained');tap(p,'place','[data-pc-choice=high]');eq(book(p)['pipsCopy']['postcard']['work']['placements']['high'],'high','old context fallback playable');p.locator('[data-pc-picker]').select_option('advice');ok('no separate sentence view' in p.locator('.pc-current').inner_text(),'unreadable context explained');layout(p,'old context')
  finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o)"))
 try:
  before=book(p);p.evaluate('window.pcRefuse=true');tap(p,'place','[data-pc-choice=high]');eq(book(p),before,'preflight atomic');ok('unchanged' in p.locator('#pc-status').inner_text(),'refusal visible');p.evaluate('window.pcRefuse=false')
  p.evaluate('const e=document.querySelector("[data-pc-choice=high]");e.style.display="none";e.click()');eq(book(p),before,'hidden writer inert');p.evaluate('document.querySelector("[data-pc-choice=high]").style.display=""')
  p.evaluate('window.pcStale=document.querySelector("[data-pc-choice=high]");window.pcStaleSpeech=document.querySelector("[data-pc-speak=postcard]")');tap(p,'place','[data-pc-choice=hi]');held=book(p);p.evaluate('window.pcSpoken=[];window.pcStale.click();window.pcStaleSpeech.click()');eq(book(p),held,'stale writer inert');eq(p.evaluate('window.pcSpoken'),[],'stale speech inert')
  p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";document.body.append(d);d.showModal();window.pcSpoken=[];document.querySelector("[data-pc-choice=high]").click();document.querySelector("[data-pc-speak=postcard]").click()');eq(book(p),held,'film blocks writer');eq(p.evaluate('window.pcSpoken'),[],'film blocks speech');p.evaluate('document.querySelector("dialog.welcome-film").remove()')
  p.locator('[data-pc-choice=high]').focus();p.keyboard.press('Enter');eq(book(p)['pipsCopy']['postcard']['work']['placements']['high'],'high','keyboard placement')
  p.evaluate('window.pcStorageFail=true');tap(p,'place','[data-pc-choice=hi]');ok('could not be saved reliably' in p.locator('[data-pc-saving]').inner_text(),'host failure beside work');ok(p.locator('[data-pc-choice=hi]').evaluate('e=>e===document.activeElement'),'save warning preserves focus')
 finally:c.close()
 c,p=setup(browser,base,fixture("P.openPipsTable(s,'postcard',o);s.pipsCopy.source.postcard.slots.push({...s.pipsCopy.source.postcard.slots[0],clue:17});s.pipsCopy.postcard.work.placements.high={future:'opaque'}"))
 try:
  eq(p.locator('[data-pc-picker] option').count(),3,'ambiguous word omitted');ok('earlier word unavailable' in p.locator('.pc-message').first.inner_text(),'unavailable segment preserved');tap(p,'place','[data-pc-choice=advice]');tap(p,'keep');eq(book(p)['pipsCopy']['postcard']['work']['placements']['high'],{'future':'opaque'},'opaque placement survives');p.screenshot(path=str(OUT/'partial-postcard.png'),full_page=True)
 finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  table(p,'postcard');tap(p,'place','[data-pc-choice=high]');kept=copy.deepcopy(book(p)['pipsCopy']);p.goto(base+'#library/endings');p.locator('[data-endings-shelf-root]').wait_for();p.locator('[data-es-table=letter]').tap();p.locator('[data-es-choice=cious]').tap();endings=copy.deepcopy(book(p)['endingsShelf']);eq(book(p)['pipsCopy'],kept,'Pip-first leaves Pip root');p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();tap(p,'place','[data-pc-choice=hi]');eq(book(p)['endingsShelf'],endings,'sibling root stays intact');p.goto(base+'#notes');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();tap(p,'place','[data-pc-choice=high]');ok('only while this page stays open' in p.locator('[data-pc-saving]').inner_text(),'save-off warning');held=copy.deepcopy(book(p)['pipsCopy']);p.goto(base+'#notes')
  with p.expect_download() as download:p.locator('#download').tap()
  file=OUT/'save-off.json';download.value.save_as(file);eq(json.loads(file.read_text())['pipsCopy'],held,'save-off real download')
 finally:c.close()
 eq(errors,[],'no page errors')
def page_seed(code=''):
 script="import {pipsPageThreeSeed,canExportPips} from './test/pips-copy-checks.mjs';import * as P from './dist/pips-copy-core.mjs';let s=pipsPageThreeSeed();const o={canExport:canExportPips,deck:'page-three'};"+code+';console.log(JSON.stringify(s));'
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
def page_open(p):tap(p,'page-table');p.locator('.pc-page-copy').wait_for()
def run_page_copy(browser,base):
 # One full tablet journey, opening the page deck before ever opening the legacy postcard.
 seed=page_seed();c,p=setup(browser,base,seed)
 try:
  before=book(p);ok(p.locator('[data-pc-action=page-table]').count()==1,'revealed page offers one third navigation button');page_open(p);eq(book(p)['story'],before['story'],'opening never writes story');ok('postcard' not in book(p)['pipsCopy'],'page first leaves legacy postcard absent');ok(p.locator('[data-pc-action=table][aria-pressed=true]').count()==0,'old buttons not pressed in page deck');layout(p,'page opening')
  p.evaluate('document.fonts.ready')
  ok(p.locator('.pc-page-compare,.pc-page-copy>.pc-clue,.pc-page-copy>.pc-tray,.pc-page-copy>.pc-commit').evaluate_all('els=>els.length===4&&els.every(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;})'),'tablet comparison, clue, choices and primary actions fit together')
  ok(p.get_by_role('region',name='The page to copy',exact=True).count()==1,'source region has its own accessible name');ok(p.get_by_role('region',name="This word in the page's sentence",exact=True).count()==1,'supplied local frame named accurately');ok('Your whole version keeps your choices.' in p.locator('.pc-page-compare').inner_text(),'local frame disclaimer visible')
  p.evaluate('window.pcSpoken=[]');p.locator('[data-pc-speak=prompt]').tap();spoken=' '.join(p.evaluate('pcSpoken'));ok('Those need keeping too.' not in spoken,'closed full source never enters prompt narration');p.locator('[data-pc-speak=source]').tap();ok("There are three Ways" in ' '.join(p.evaluate('pcSpoken')),'explicit current source sentence read')
  p.locator('[data-pc-speak=postcard]').tap();spoken=p.evaluate('pcSpoken.at(-1)');ok('[smudged]' in spoken and 'H.' in spoken,'copy narration passes literal smudge and signature');eq(spoken.count('blank'),9,'eight marked blanks plus read introduction')
  tap(p,'keep');first=copy.deepcopy(book(p)['pipsCopy']['pageThree']['postcard']['firstKept'])
  keys={'there':'there','ways':'ways','road':'road','high':'high','need':'need','which':'which','where':'where','too':'too'}
  for key,word in keys.items():
   p.locator('[data-pc-picker]').select_option(key);ok(p.locator('.pc-source-sentence').inner_text()==next(g['referenceText'] for g in book(p)['pipsCopy']['pageThree']['source']['postcard']['slots'] if g['id']==key),key+' frozen reference retained');tap(p,'place','[data-pc-choice="'+word+'"]')
  tap(p,'check');eq(book(p)['pipsCopy']['pageThree']['postcard']['checks'][-1]['outcome'],'fit','all eight fit');tap(p,'keep');eq(book(p)['pipsCopy']['pageThree']['postcard']['firstKept'],first,'first page keep retained')
  p.locator('[data-pc-panel=page-version] > summary').tap();eq(p.locator('[data-pc-panel=page-version] .pc-message').inner_text(),book(p)['pipsCopy']['pageThree']['source']['reference']['paragraphs'][0],'whole fitting version equals entire frozen canonical page');ok(p.locator('.pc-library-edge[aria-hidden=true]').count()>0,'library paper edge is decorative');p.locator('[data-pc-panel=page-version] > summary').tap()
  p.locator('[data-pc-picker]').select_option('high');ok(p.locator('[data-pc-action=carry]').count()==0,'no child high carry UI');p.locator('[data-pc-action=place]').first.evaluate('(e)=>{e.dataset.pcAction="carry";e.click();}');eq(p.evaluate('location.hash'),'#library/copy','forged child carry inert');tap(p,'place','[data-pc-choice=hi]');tap(p,'check');eq(book(p)['pipsCopy']['pageThree']['postcard']['checks'][-1]['outcome'],'different','child different revision retained');tap(p,'keep')
  p.locator('[data-pc-panel=keep-latest] > summary').tap();tap(p,'restore','[data-pc-edition=latest]');p.locator('[data-pc-panel=keep-first] > summary').tap();tap(p,'restore','[data-pc-edition=first]');eq(book(p)['pipsCopy']['pageThree']['postcard']['work'],first['work'],'first version restored')
  p.locator('[data-pc-picker]').select_option('need');p.locator('[data-pc-panel=teach-copy-source-357] > summary').tap();tap(p,'step','[data-pc-card=copy-source-357]');steps=p.locator('[data-pc-worked-card=copy-source-357] li').count();table(p,'practice');tap(p,'job','[data-pc-job=d1]');tap(p,'answer','[data-pc-choice=kneads]');tap(p,'keep');legacy=copy.deepcopy(book(p)['pipsCopy']);page_open(p);eq(p.locator('[data-pc-picker]').input_value(),'need','child selected word survives practice return');eq(p.locator('[data-pc-worked-card=copy-source-357] li').count(),steps,'child example steps and fold survive return');held=copy.deepcopy(book(p)['pipsCopy']);held.pop('pageThree');eq(held,{k:v for k,v in legacy.items() if k!='pageThree'},'child turn preserves legacy job and pointers')
  p.screenshot(path=str(OUT/'third-page-tablet.png'),full_page=True)
  # Actual Notes round trip remains separate and retains the entire parent/child.
  saved=copy.deepcopy(book(p)['pipsCopy']);p.goto(base+'#notes')
  with p.expect_download() as d:p.locator('#download').tap()
  raw=Path(d.value.path()).read_text();eq(json.loads(raw)['pipsCopy'],saved,'actual download preserves both decks');p.locator('#progress-file').set_input_files({'name':'synthetic-page-copy.json','mimeType':'application/json','buffer':raw.encode()});p.locator('#progress-import-confirm').tap();p.wait_for_function('JSON.parse(localStorage.getItem("learning-garden-explorers")).explorers.length===2');p.goto(base+'#library/copy',wait_until='networkidle')
  if p.locator('[data-select-explorer]').count():p.locator('[data-select-explorer]').last.tap()
  p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],saved,'import keeps both decks exact');ok(not p.locator('.pc-page-copy').count(),'import resets transient deck to postcard');page_open(p);old=p.locator('[data-pc-action=place]').first.element_handle();table(p,'postcard');before=book(p);old.evaluate('(e)=>e.click()');eq(book(p),before,'detached page action cannot write after deck switch')
  p.goto(base+'#notes');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');ok('pipsCopy' not in book(p),"reset clears only this explorer's two decks");film=p.locator('dialog.welcome-film[open] [data-film-skip]');film.wait_for();film.tap();p.locator('dialog.welcome-film').wait_for(state='detached');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-1"]').tap();p.wait_for_timeout(100);p.goto(base+'#library/copy',wait_until='networkidle');p.locator('[data-pips-copy-root]').wait_for();eq(book(p)['pipsCopy'],saved,'other owner retains both decks after reset')
 finally:c.close()
 # Reload and lost gate must show the ordinary missing-postcard arrival without allocation or a damage warning.
 child_only=page_seed("P.openPipsTable(s,'postcard',o);P.keepPipsPostcard(s,o)")
 c,p=setup(browser,base,child_only)
 try:
  eq(book(p),child_only,'reload preserves child-only parent');ok(p.locator('.pc-arrival').count()==1,'missing legacy postcard is ordinary arrival');ok(p.locator('.pc-notice').count()==0,'no false damaged-work notice');page_open(p);saved=copy.deepcopy(book(p)['pipsCopy']);story=copy.deepcopy(book(p)['story']);story['acts']['III']['ended']=False;p.evaluate('x=>window.pcReplaceStory(x)',story);eq(book(p)['pipsCopy'],saved,'lost gate retains entire parent');ok(not p.locator('[data-pc-action=page-table]').count(),'lost gate hides invitation');ok(p.locator('.pc-arrival').count()==1,'lost gate falls back without allocating postcard');ok('Hollis' not in p.locator('[data-pips-copy-root]').inner_text(),'fallback does not expose page material');p.goto(base+'#notes');ok('Earlier page-copy work is retained' in p.locator('[data-pips-copy-notes]').text_content(),'gate-lost summary is generic')
 finally:c.close()
 for width,height in [(320,600),(1024,768)]:
  sample=copy.deepcopy(child_only)
  if width==320:
   del sample['pipsCopy']['pageThree']['source']['postcard']['slots'][2]['referenceText'];sample['pipsCopy']['pageThree']['postcard']['work']['placements']['road']={'opaque':'keep'}
  c,p=setup(browser,base,sample,width,height)
  try:
   page_open(p);p.locator('[data-pc-picker]').select_option('high');tap(p,'place','[data-pc-choice=high]');tap(p,'keep');layout(p,str(width)+' page revised/kept')
   if width==320:eq(p.locator('[data-pc-picker] option').count(),7,'bad reference sentence removes only its own slot');eq(book(p)['pipsCopy']['pageThree']['postcard']['work']['placements']['road'],{'opaque':'keep'},'partial slot raw work survives')
  finally:c.close()
 # Historical reference title and sentence come from the retained source, not today's story.
 historical=copy.deepcopy(child_only);source=historical['pipsCopy']['pageThree']['source'];source['reference']['title']='An earlier heading';source['postcard']['slots'][0]['referenceText']='Their paths are open.';source['postcard']['slots'][0]['context']={'before':'','after':' paths are open.'};source['postcard']['slots'][0]['key']='their'
 c,p=setup(browser,base,historical)
 try:
  page_open(p);eq(p.locator('.pc-source-sentence').inner_text(),'Their paths are open.','frozen reference sentence retained');p.locator('[data-pc-panel=page-reference] > summary').tap();ok('An earlier heading' in p.locator('[data-pc-panel=page-reference]').inner_text(),'frozen title retained');tap(p,'place','[data-pc-choice=their]');tap(p,'check');eq(book(p)['pipsCopy']['pageThree']['postcard']['checks'][-1]['outcome'],'incomplete','own historical key used without current-page regrade')
 finally:c.close()
 # Hidden invitation and forged page-open control do not publish the third page or create saved work.
 c,p=setup(browser,base,fixture())
 try:
  ok(not p.locator('[data-pc-action=page-table]').count(),'new child sees no future page invitation');before=book(p);p.locator('[data-pc-action=table]').first.evaluate('(e)=>{e.dataset.pcAction="page-table";e.click();}');eq(book(p),before,'forged early page action inert')
 finally:c.close()
 # Refused deck navigation keeps the child selected and cannot allocate the legacy postcard.
 c,p=setup(browser,base,child_only)
 try:
  page_open(p);p.evaluate('window.pcRefuse=true');before=book(p);table(p,'postcard');eq(book(p),before,'refused table change leaves all work');ok(p.locator('.pc-page-copy').count()==1,'refused table change keeps selected child');p.evaluate('window.pcRefuse=false');p.goto(base+'#notes');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();p.goto(base+'#library/copy');p.locator('[data-pips-copy-root]').wait_for();page_open(p);tap(p,'place','[data-pc-choice=there]');ok('only while this page stays open' in p.locator('[data-pc-saving]').inner_text(),'page copy save-off disclosure');held=book(p)['pipsCopy'];p.goto(base+'#notes')
  with p.expect_download() as d:p.locator('#download').tap()
  eq(json.loads(Path(d.value.path()).read_text())['pipsCopy'],held,'save-off child stays in actual Notes download')
 finally:c.close()
 eq(errors,[],'page deck has no page errors')

if __name__=='__main__':
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128
 class Handler(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=Server(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as pw:
   chrome=os.environ.get('CHROME_PATH');mac='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
   if not chrome and Path(mac).exists():chrome=mac
   browser=pw.chromium.launch(headless=True,**({'executable_path':chrome} if chrome else {}))
   try:
    if not os.environ.get('PIPS_PAGE_ONLY'):run(browser,f'http://127.0.0.1:{server.server_port}/')
    run_page_copy(browser,f'http://127.0.0.1:{server.server_port}/')
   finally:browser.close()
 finally:server.shutdown()
 print(f'Pip’s Copy browser checks: {checks} passed. Synthetic artifacts: {OUT}')
