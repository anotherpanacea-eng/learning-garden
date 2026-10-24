"""Isolated synthetic notebook journeys in Chrome; no learner exports or remote services."""
import itertools,json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('SHUTTERS_TEST_URL','http://127.0.0.1:4188/')
OUT=Path(os.environ.get('SHUTTERS_ARTIFACTS','/tmp/shutters-browser'));OUT.mkdir(parents=True,exist_ok=True)
def source_js(script):return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
initial=source_js("import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;console.log(JSON.stringify(s));")
won=source_js("import {newShutters} from './dist/shutters-core.mjs';const g=newShutters();g.moves=[{kind:'roll',faces:[3,3]},{kind:'close',tiles:[6]},{kind:'roll',faces:[2,3]},{kind:'close',tiles:[5]},{kind:'roll',faces:[1,2]},{kind:'close',tiles:[1,2]},{kind:'roll',faces:[3,4]},{kind:'close',tiles:[3,4]}];console.log(JSON.stringify(g));")
blocked={**won,'moves':[{'kind':'roll','faces':[3,3]},{'kind':'close','tiles':[6]},{'kind':'roll','faces':[2,3]},{'kind':'close','tiles':[5]},{'kind':'roll','faces':[2,2]},{'kind':'close','tiles':[4]},{'kind':'roll','faces':[4]},{'kind':'close','tiles':[1,3]},{'kind':'roll','faces':[6]}]}
checks=0
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def notebook(p):return p.evaluate("()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+r.activeId));}")
def go(p,h):
 p.goto(BASE+h);p.locator('[data-shutters-root]' if h=='#orchard/games/shutters' else '[data-pile-root]' if h=='#orchard/games' else 'main').wait_for()
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('.shutters-page button,.shutters-page select,.shutters-page a,.shutters-page summary').evaluate_all("xs=>xs.filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<44}).map(x=>x.textContent)")
 ok(not bad,'44px controls: '+str(bad))
def bring(p,report):
 go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-shutters.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual import adapter')
 go(p,'#orchard/games/shutters')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 errors=[]
 try:
  for width in [320,820]:
   context=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True)
   context.add_init_script("if(!localStorage.getItem('shutter-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(initial))+");localStorage.setItem('shutter-fixture','1');}")
   p=context.new_page();p.on('pageerror',lambda e:errors.append(str(e)))
   go(p,'#orchard/games/shutters');ok('shutters' not in notebook(p),'view does not allocate root');bounds(p);ok(p.locator('text=Where could this take us?').count()==0,'no unrelated onward panels during game')
   p.locator('[data-shutter-start] button[type=submit]').click();ok('two dice' in p.locator('[data-shutter-roll]').inner_text(),'initial two dice')
   stale=p.locator('[data-shutter-roll]').element_handle();stale.click();before=notebook(p)['shutters'];stale.evaluate('(b)=>b.click()');ok(notebook(p)['shutters']==before,'stale roll inert')
   p.reload();p.locator('[data-shutter-tile]').first.wait_for();ok(notebook(p)['shutters']==before,'reload does not reroll')
   target=sum(before['current']['moves'][-1]['faces']);choice=next(list(xs) for n in range(1,7) for xs in itertools.combinations(range(1,7),n) if sum(xs)==target)
   for n in choice:p.locator(f'[data-shutter-tile="{n}"]').click()
   ok(not p.locator('[data-shutter-close]').is_disabled(),'matching sum can close');ok(p.evaluate('document.activeElement.dataset.shutterTile')==str(choice[-1]),'selection keeps keyboard focus on shutter')
   draft=notebook(p)['shutters'];p.reload();p.locator('[data-shutter-close]').wait_for();ok(notebook(p)['shutters']==draft,'selected draft preserved')
   p.locator('[data-shutter-clear]').click();ok(p.locator('[data-shutter-close]').is_disabled(),'clear makes choice editable')
   p.locator('[data-shutter-tile="1"]').focus();p.keyboard.press('Enter');ok(notebook(p)['shutters']['current']['selected']==[1],'keyboard toggle')
   ok(p.locator('[data-shutter-close]').is_disabled(),'mismatched sum cannot close');p.locator('[data-shutter-clear]').click()
   p.locator('[data-shutter-ways]').click();ok(p.locator('.shutter-help').is_visible(),'optional combinations visible');ok('combinations' in notebook(p)['shutters']['current']['support'],'combinations marked support')
   for n in choice:p.locator(f'[data-shutter-tile="{n}"]').click()
   bounds(p);p.screenshot(path=str(OUT/f'playing-{width}.jpg'),full_page=True)
   waiting=notebook(p)['shutters']['current'];p.locator('[data-shutter-explain]').click()
   for step in range(1,4):p.locator(f'[data-shutter-step="{step}"]').click()
   ok('one die' in p.locator('.shutter-thought').inner_text(),'pictured explanation covers dice switch');p.locator('[data-shutter-back]').click()
   current=notebook(p)['shutters']['current'];ok(current['moves']==waiting['moves'] and current['selected']==waiting['selected'],'explanation preserves waiting round');ok('explanation' in current['support'],'explanation separate support')
   p.locator('[data-shutter-close]').click();ok(p.locator('.shutter-tile.closed').count()==len(choice),'only chosen shutters close');ok(notebook(p)['shutters']['current']['selected']==[],'draft clears after close')
   p.locator('[data-shutter-new]').click();p.locator('[name=size]').select_option('9');p.locator('[data-shutter-start] button[type=submit]').click();ok(p.locator('.shutter-tiles .shutter-tile').count()==9,'full box');ok(len(notebook(p)['shutters']['earlier'])==1,'new round retains old one')
   saved=notebook(p)['shutters'];go(p,'#orchard/games');ok(p.locator('.games-table-nav a[href="#orchard/games/shutters"]').count()==1,'two-game navigation');ok(notebook(p)['shutters']==saved,'Seed Pile leaves Shutters intact')
   p.locator('[data-pile-form] button[type=submit]').click();seed=notebook(p)['games'];go(p,'#orchard/games/shutters');p.locator('[data-shutter-roll]').click();ok(notebook(p)['games']==seed,'Shutters leaves Seed Pile intact')
   p.locator('.shutter-history summary').click();p.locator('[data-shutter-resume="0"]').click();ok(notebook(p)['shutters']['current']==saved['earlier'][0],'actual history resume')
   go(p,'#notes')
   with p.expect_download() as d:p.locator('#download').click()
   report=json.loads(Path(d.value.path()).read_text());expected=report['shutters'];owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
   bring(p,report);ok(notebook(p)['shutters']==expected,'actual download/import preserves source, moves and support')
   p.locator('#explorer-switch').click();p.locator(f'[data-select-explorer="{owner}"]').click();go(p,'#orchard/games/shutters');ok(notebook(p)['shutters']==expected,'other explorer unchanged')
   report['shutters']['current']=won;bring(p,report);ok('Every shutter' in p.locator('#shutter-turn').inner_text(),'win ending');ok(p.locator('[data-shutter-roll]').count()==0,'no roll after ending')
   p.locator('[data-shutter-note] textarea').fill('<b>I tried a new sum.</b>');p.locator('[data-shutter-note] button').click();ok('kept' in p.locator('#shutter-status').inner_text(),'note kept');ok(p.evaluate('document.activeElement.id')=='shutter-status','note confirmation focus')
   p.locator('.shutter-history summary').click();ok(p.locator('.shutter-record b').count()==0,'note text escaped');bounds(p)
   p.locator('[data-shutter-remove="notes:0"]').click();ok(p.locator('[data-shutter-confirm]').is_visible(),'remove requires confirmation');p.locator('[data-shutter-cancel]').click();ok(len(notebook(p)['shutters']['notes'])==1,'cancel preserves note')
   p.locator('[data-shutter-new]').click();ok(p.locator('[name=size]').input_value()=='6','replay retains size');p.locator('[data-shutter-back]').click()
   report['shutters']['current']={**blocked,'moves':blocked['moves'][:-1]};bring(p,report);ok('one die' in p.locator('[data-shutter-roll]').inner_text(),'one die after remaining sum drops below six')
   report['shutters']['current']=blocked;bring(p,report);ok('nowhere to go' in p.locator('#shutter-turn').inner_text(),'ordinary blocked ending');ok(p.locator('[data-shutter-roll]').count()==0,'blocked round cannot reroll');ok('thoughtful' in p.locator('[data-shutters-root]').inner_text(),'blocked ending does not blame the learner')
   report['shutters']['current']={**won,'source':{**won['source'],'model':'future-shutters'}};bring(p,report);ok(p.locator('.shutter-warning').is_visible(),'unknown current retained notice');p.locator('[data-shutter-start] button[type=submit]').click();ok(notebook(p)['shutters']['earlier'][-1]['source']['model']=='future-shutters','fresh game preserves unknown source')
   go(p,'#notes');p.locator('#remember').uncheck();go(p,'#orchard/games/shutters');p.locator('[data-shutter-roll]').click();ok(p.evaluate("()=>!Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"),'save-off game remains memory only')
   context.close()
  ok(not errors,'no page errors: '+str(errors));print(f'Shutters Chrome: {checks} assertions passed at 320/820.')
 finally:browser.close()
