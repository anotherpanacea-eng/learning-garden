"""Actual-app synthetic journeys; Chromium emulation, not device/audio qualification."""
import json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('WORD_LIST_TEST_URL','http://127.0.0.1:4199/')
OUT=Path(os.environ.get('WORD_LIST_ARTIFACTS','/tmp/word-list-shelf-browser'))
OUT.mkdir(parents=True,exist_ok=True)
NODE="""import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import {openWordListShelf} from './dist/word-list-shelf-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;if(process.argv[1]==='saved')openWordListShelf(s,{canExport:()=>true});console.log(JSON.stringify(s));"""
def seed(saved=False):
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',NODE,'saved' if saved else 'fresh'],cwd=ROOT,text=True))

n=0;errors=[]
def ok(value,message):
 global n
 assert value,message
 n+=1
def eq(a,b,message):ok(a==b,message)
def state(p):return p.evaluate('window.__wlsRead()')
def root(p):return state(p).get('wordListShelf')
def action(p,name,extra=''):return p.locator('[data-wls-action="'+name+'"]'+extra).first
def tap(p,name,extra=''):action(p,name,extra).tap()
def dismiss_film(p):
 b=p.locator('dialog.welcome-film[open] [data-film-skip]')
 if b.count():b.first.click()
def arrive(p):
 p.locator('[data-word-list-shelf-root],[data-select-explorer]').first.wait_for()
 if not p.locator('[data-word-list-shelf-root]').count():
  owner=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId') or 'explorer-1'
  p.locator('[data-select-explorer="'+owner+'"]').click()
 p.locator('[data-word-list-shelf-root]').wait_for()
def geometry(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no page overflow')
 bad=p.locator('.wls-room :is(button,select,summary,a):visible').evaluate_all('xs=>xs.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent)')
 ok(not bad,'44px targets: '+str(bad))
def start(browser,width,height=1000,first=None):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True,reduced_motion='reduce')
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':id,'avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-31T14:00:00.000Z'} for id in ['explorer-1','explorer-2']]}
 c.add_init_script('(d=>{if(!localStorage.getItem("wls-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const [id,s]of Object.entries(d.books))localStorage.setItem("number-garden-v1:"+id,JSON.stringify(s));localStorage.setItem("wls-fixture","yes");}window.__wlsSpoken=[];speechSynthesis.speak=u=>{window.__wlsSpoken.push(u.text);setTimeout(()=>u.onend?.(),0);};})('+json.dumps({'registry':registry,'books':{'explorer-1':first or seed(),'explorer-2':seed()}})+')')
 def app(route):
  response=route.fetch();body=response.text();marker='let graph=null,'
  assert body.count(marker)==1
  body=body.replace(marker,'window.__wlsRead=()=>structuredClone(state);'+marker,1)
  i=body.index('bindWordListShelf(state,{')
  body=body[:i]+body[i:].replace('canExport:candidate=>','canExport:candidate=>!window.__wlsRefuse&&',1)
  route.fulfill(response=response,body=body)
 c.route('**/app.mjs',app)
 p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(BASE+'#library/word-list');arrive(p)
 return c,p
def choose(p,key):p.locator('[data-wls-picker]').select_option(key)
def download(p):
 p.goto(BASE+'#notes');p.locator('#download').wait_for();dismiss_film(p)
 with p.expect_download() as d:p.locator('#download').click()
 return Path(d.value.path()).read_text()

with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 try:
  for width,height in [(320,600),(820,1000),(1024,768)]:
   c,p=start(b,width,height)
   ok(root(p) is None,'arrival allocates no activity root');geometry(p)
   # Hidden story controls must not invoke the application's speech handler.
   p.locator('[data-wls-read=story]').dispatch_event('click')
   eq(p.evaluate('window.__wlsSpoken'),[],'closed story is not narrated')
   action(p,'shelf').focus();p.keyboard.press('Enter');p.locator('[data-wls-picker]').wait_for()
   eq(len(root(p)['source']['words']),20,'all twenty cards available');geometry(p)
   eq(p.locator('[data-wls-panel=overview]').get_attribute('open') is not None,width>=700,'responsive overview starts open only on larger viewports')
   tap(p,'keep-shelf');first=json.loads(json.dumps(root(p)['shelf']['firstKept']))
   eq(first['check'],None,'unchecked incomplete shelf may be kept')
   tap(p,'check-shelf');eq(root(p)['shelf']['checks'][-1]['status'],'incomplete','incomplete check')
   for word in root(p)['source']['words']:
    choose(p,word['id']);tap(p,'place','[data-wls-tray="'+word['clues'][0]['trayId']+'"]')
    eq(root(p)['shelf']['placements'][word['id']],word['clues'][0]['trayId'],'tap places '+word['id'])
   for word,alternatives in {'sufficient':['double','ending','ie'],'foreign':['quiet','ie'],'muscle':['quiet','family']}.items():
    choose(p,word)
    for tray in alternatives:
     tap(p,'place','[data-wls-tray="'+tray+'"]');tap(p,'check-shelf')
     eq(root(p)['shelf']['checks'][-1]['status'],'listed','every accepted alternative fits')
   tap(p,'keep-shelf');latest=json.loads(json.dumps(root(p)['shelf']['latestKept']))
   eq(root(p)['shelf']['firstKept'],first,'first shelf preserved');ok(p.locator('.wls-stamp').is_visible(),'local keep stamp')
   eq(p.locator('.wls-stamp').evaluate('e=>getComputedStyle(e).animationName'),'none','reduced motion has static stamp')
   choose(p,'yacht');tap(p,'place','[data-wls-tray=double]')
   eq(p.locator('#wls-feedback').count(),0,'editing hides earlier current verdict')
   tap(p,'check-shelf');eq(root(p)['shelf']['checks'][-1]['status'],'discussion','unexpected clue invites discussion')
   ok('Your placement can stay' in p.locator('.wls-word-feedback').inner_text(),'other idea is not called an error')
   p.locator('[data-wls-panel=shelf-latest]>summary').tap();tap(p,'restore-shelf','[data-wls-edition=latest]')
   eq(root(p)['shelf']['placements'],latest['placements'],'restore keeps all cards')
   tap(p,'shelf-example');eq(p.locator('[data-wls-example=shelf] li').count(),1,'example starts at first step')
   tap(p,'step','[data-wls-example-key=shelf]');tap(p,'step','[data-wls-example-key=shelf]')
   eq(p.locator('[data-wls-example=shelf] li').count(),3,'all worked steps shown')
   eq(p.evaluate('document.activeElement.dataset.wlsExample'),'shelf','last step keeps focus with example')
   tap(p,'contrast');ok(p.locator('#wls-contrast').is_visible(),'contrast beside task')
   ok('contrast' in root(p)['shelf']['help'] and 'example' in root(p)['shelf']['help'],'requested support retained')
   p.locator('[data-wls-read=sentence]').tap();p.wait_for_function('window.__wlsSpoken.length>0')
   eq(p.evaluate('window.__wlsSpoken.at(-1)'),'The yacht is moored beside the ferry.','only retained context narrated')
   if width>=700:
    p.locator('.wls-pocket [data-wls-word=accommodate]').tap();eq(p.locator('[data-wls-picker]').input_value(),'accommodate','live pocket returns to its card')
   geometry(p);p.screenshot(path=str(OUT/f'shelf-{width}.png'),full_page=True)
   for key in ['e1','e2','e3']:
    tap(p,'jobs');tap(p,'job','[data-wls-job='+key+']');j=root(p)['jobs'][key]['source']
    eq(p.locator('.wls-job .wls-paper>ol>li').count(),3 if key=='e1' else 0,'only first job has automatic guidance')
    wrong=next(x['id'] for x in j['choices'] if x['id']!=j['key'])
    tap(p,'answer','[data-wls-choice='+wrong+']');tap(p,'check-job')
    eq(root(p)['jobs'][key]['checks'][-1]['outcome'],'different','finite job feedback')
    if key=='e1':ok("two m's" in p.locator('#wls-feedback').inner_text(),'missing-m diagnosis')
    tap(p,'hint');tap(p,'job-example');eq(p.locator('[data-wls-example] li').count(),1,'requested example starts at first step')
    cardkey='job-'+key+'-'+j['teach'][0]['id']
    tap(p,'step','[data-wls-example-key="'+cardkey+'"]');tap(p,'step','[data-wls-example-key="'+cardkey+'"]')
    eq(p.locator('[data-wls-example] li').count(),3,'complete designated example')
    tap(p,'answer','[data-wls-choice='+j['key']+']');tap(p,'check-job');tap(p,'keep-job')
    eq(root(p)['jobs'][key]['latestKept']['check']['outcome'],'fit','fitting supplied choice kept')
    p.locator('[data-wls-read=question]').tap();p.wait_for_timeout(10)
    spoken=p.evaluate('window.__wlsSpoken.at(-1)');eq(spoken,' '.join(j['prompt'].replace('___',' blank ').split()),'only current question narrated')
    held=json.loads(json.dumps(root(p)['jobs'][key]));tap(p,'skip');eq(root(p)['jobs'][key],held,'Skip preserves the job')
   p.screenshot(path=str(OUT/f'jobs-{width}.png'),full_page=True)
   held=root(p);p.reload();arrive(p);eq(root(p),held,'reload preserves work and source')
   raw=download(p);eq(json.loads(raw)['wordListShelf'],held,'actual Notes download has literal activity root')
   ok(p.locator('[data-word-list-shelf-notes]').count()==1,'Notes summary integrated')
   p.locator('#reset').click();p.locator('#confirm-reset').click();ok(root(p) is None,'reset clears current activity')
   p.goto(BASE+'#notes');p.locator('#progress-file').wait_for(state='attached');dismiss_film(p)
   p.locator('#progress-file').set_input_files({'name':'synthetic-word-list.json','mimeType':'application/json','buffer':raw.encode()})
   dismiss_film(p);p.locator('#progress-import-confirm').click();p.goto(BASE+'#library/word-list');arrive(p)
   eq(root(p),held,'actual file import restores work exactly');geometry(p);c.close()

  # Actual owner switching and detached/hidden/film controls.
  c,p=start(b,820);tap(p,'shelf');tap(p,'place','[data-wls-tray=double]');owner1=root(p)
  old=p.evaluate_handle('document.querySelector("[data-wls-action=place]")')
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();p.locator('[data-word-list-shelf-root]').wait_for()
  ok(root(p) is None,'another explorer has a separate shelf');tap(p,'shelf');tap(p,'place','[data-wls-tray=quiet]');owner2=root(p)
  old.evaluate('e=>e.click()');eq(root(p),owner2,'detached owner control does nothing')
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();p.locator('[data-word-list-shelf-root]').wait_for();eq(root(p),owner1,'original owner restored on same route')
  before=root(p);p.evaluate('window.__wlsRefuse=true');tap(p,'place','[data-wls-tray=quiet]');eq(root(p),before,'refused real preflight leaves entire activity unchanged');ok('unchanged' in p.locator('#wls-status').inner_text(),'refusal stays at activity')
  p.evaluate('window.__wlsRefuse=false');p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";d.open=true;document.body.append(d)');action(p,'place','[data-wls-tray=quiet]').dispatch_event('click');eq(root(p),before,'film blocks underlying controls');p.evaluate('document.querySelector("dialog.welcome-film").remove()')
  hidden=action(p,'place','[data-wls-tray=quiet]');hidden.evaluate('e=>e.style.visibility="hidden"');hidden.dispatch_event('click');eq(root(p),before,'hidden control blocked');hidden.evaluate('e=>e.style.visibility="visible"')
  old=p.evaluate_handle('document.querySelector("[data-wls-tray=quiet]")');p.goto(BASE+'#words');p.goto(BASE+'#library/word-list');p.locator('[data-word-list-shelf-root]').wait_for();old.evaluate('e=>e.click()');eq(root(p),before,'old route control blocked');c.close()

  # Save-off and a storage failure still allow memory work and an actual copy.
  c,p=start(b,390);p.goto(BASE+'#notes');p.locator('#remember').uncheck();p.goto(BASE+'#library/word-list');tap(p,'shelf');tap(p,'place','[data-wls-tray=double]');ok(bool(p.locator('[data-wls-saving]').inner_text()),'save-off message remains local');eq(json.loads(download(p))['wordListShelf'],root(p),'save-off actual download retains memory work');c.close()
  c,p=start(b,390);tap(p,'shelf');p.evaluate('() => {Storage.prototype.setItem=function(){throw new Error("Synthetic storage failure")};}');tap(p,'place','[data-wls-tray=double]');eq(root(p)['shelf']['placements']['accommodate'],'double','storage failure retains memory work');ok(bool(p.locator('[data-wls-saving]').inner_text()),'storage failure message remains local');c.close()

  oldseed=seed(True);r=oldseed['wordListShelf'];r['source']['words'].append({'id':'foreign','text':3,'clues':[]});r['shelf']['placements']['foreign']={'raw':'kept'};r['shelf']['placements']['sufficient']='retired-tray'
  c,p=start(b,820,first=oldseed);tap(p,'shelf');choose(p,'sufficient');ok(action(p,'place','[data-wls-tray=double]').is_disabled(),'opaque placement remains read-only');tap(p,'check-shelf');eq(root(p)['shelf']['checks'][-1]['coverage'],'partial','partial check explicitly labelled');tap(p,'keep-shelf');eq(root(p)['shelf']['placements']['foreign'],{'raw':'kept'},'omitted duplicate placement retained');raw=download(p);eq(json.loads(raw)['wordListShelf'],root(p),'partial actual download exact');c.close()
  future=seed();future['wordListShelf']={'v':99,'future':['raw']};c,p=start(b,390,first=future);ok('cannot be edited' in p.locator('main').inner_text(),'future format stays readable as notice');eq(root(p),future['wordListShelf'],'future root unchanged');p.goto(BASE+'#words');ok(p.locator('a[href="#library/word-list"]').count()>0,'Word Garden entry works beside unsupported shelf');c.close()
 finally:b.close()
ok(not errors,'no page errors: '+str(errors))
print(f'Word List Shelf actual-app browser: {n} assertions passed at320/820/1024, with reduced motion, actual Notes transfer and explorer boundaries.')
