"""Synthetic Chrome journeys for the Seed Pile; no external services or learner files."""
import json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('PILE_TEST_URL','http://127.0.0.1:4188/')
OUT=Path(os.environ.get('PILE_ARTIFACTS','/tmp/seed-pile-browser'));OUT.mkdir(parents=True,exist_ok=True)
initial=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
checks=0

def ok(value,message):
 global checks
 assert value,message
 checks+=1

def notebook(p):
 return p.evaluate("()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+r.activeId));}")
def go(p,h):p.goto(BASE+h);p.locator('[data-pile-root]' if h=='#orchard/games' else 'main').wait_for()
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('.pile-page button,.pile-page summary,.pile-page a,.pile-page select,.pile-page input').evaluate_all("xs=>xs.filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<44}).map(x=>x.textContent)")
 ok(not bad,'44px touch targets: '+str(bad))
def import_report(p,value):
 go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-pile.json','mimeType':'application/json','buffer':json.dumps(value).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'real import adapter')

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 errors=[]
 try:
  for width in [320,820]:
   context=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True)
   context.add_init_script("if(!localStorage.getItem('pile-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(initial))+");localStorage.setItem('pile-fixture','1');}")
   p=context.new_page();p.on('pageerror',lambda e:errors.append(str(e)))
   go(p,'#orchard/games');ok('games' not in notebook(p),'route view does not allocate root');bounds(p)
   p.locator('[data-pile-form] button[type=submit]').click();ok('Your turn' in p.locator('#pile-turn').inner_text(),'child starts')
   stale=p.locator('[data-pile-take="1"]').element_handle();stale.click();after=notebook(p)['games'];stale.evaluate('(b)=>b.click()');ok(notebook(p)['games']==after,'detached take is inert')
   p.reload();p.locator('[data-pile-bramble]').wait_for();ok(notebook(p)['games']==after,'reload preserves pending rival turn')
   p.locator('[data-pile-bramble]').click();moves=notebook(p)['games']['current']['moves'];ok(len(moves)==2,'one Bramble move recorded');p.reload();ok(notebook(p)['games']['current']['moves']==moves,'random move not rerolled')
   p.locator('[data-pile-explain]').click();ok('explanation' in notebook(p)['games']['current']['support'],'supplied strategy tagged')
   for i in range(3):p.locator('[data-pile-step="'+str(i+1)+'"]').click()
   before=notebook(p)['games'];p.locator('[data-pile-practice]').click();ok('Practice board' in p.locator('.pile-board-head').inner_text(),'practice labeled')
   p.locator('[data-pile-take="1"]').click();p.locator('[data-pile-bramble]').click();ok(notebook(p)['games']==before,'practice never changes waiting game or evidence')
   p.locator('[data-pile-end-practice]').click();p.locator('[data-pile-back]').click();ok(notebook(p)['games']==before,'return restores waiting game')
   bounds(p);p.screenshot(path=str(OUT/f'playing-{width}.png'),full_page=True)
   p.locator('[data-pile-new]').click();p.locator('[name=start]').fill('5');p.locator('[name=first]').select_option('bramble');p.locator('[name=dial]').select_option('plan');p.locator('[data-pile-form] button[type=submit]').click()
   ok(len(notebook(p)['games']['earlier'])==1,'earlier game retained');p.locator('[data-pile-bramble]').focus();p.keyboard.press('Enter');ok(notebook(p)['games']['current']['moves'][-1]['take']==1,'plan leaves four')
   p.locator('[data-pile-take="1"]').click();p.locator('[data-pile-bramble]').click();ok('Bramble wins' in p.locator('#pile-turn').inner_text(),'correct winner')
   p.locator('[data-pile-note] textarea').fill('<b>I noticed four.</b>');p.locator('[data-pile-note] button').click();ok(p.evaluate('document.activeElement.id')=='pile-status','note success focus');ok('kept' in p.locator('#pile-status').inner_text(),'note success visible')
   p.locator('.pile-history summary').click();ok(p.locator('.pile-record b').count()==0,'note text escaped');bounds(p)
   p.locator('[data-pile-resume="0"]').click();ok(notebook(p)['games']['current']['moves']==before['current']['moves'],'earlier game resumable')
   go(p,'#notes')
   with p.expect_download() as d:p.locator('#download').click()
   report=json.loads(Path(d.value.path()).read_text());expected=report['games'];ok(bool(expected['notes']),'actual download includes note/source')
   original=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
   import_report(p,report);go(p,'#orchard/games');ok(notebook(p)['games']==expected,'actual export/import preserves games exactly')
   p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+original+'"]').click();go(p,'#orchard/games');ok(notebook(p)['games']==expected,'other explorer untouched')
   report['games']['current']['source']['model']='future-seed-pile';import_report(p,report);go(p,'#orchard/games');ok(p.locator('.pile-warning').is_visible(),'unsupported source readable notice');p.locator('[data-pile-form] button[type=submit]').click();ok(notebook(p)['games']['earlier'][-1]['source']['model']=='future-seed-pile','unknown source retained by explicit fresh start')
   # New rule and last-loses finish: first child take3 from5, rival leaves1, child loses.
   p.locator('[data-pile-new]').click();p.locator('[name=variant]').select_option('pile-last-loses');p.locator('[name=start]').fill('5');p.locator('[name=dial]').select_option('attention');p.locator('[data-pile-form] button[type=submit]').click()
   p.locator('[data-pile-take="3"]').click();p.locator('[data-pile-bramble]').click();ok(notebook(p)['games']['current']['moves'][-1]['take']==1,'attention leaves last seed');ok(p.locator('[data-pile-take="2"]').is_disabled(),'cannot take more than remains');p.locator('[data-pile-take="1"]').click();ok('Bramble wins' in p.locator('#pile-turn').inner_text(),'last seed loses')
   p.locator('[data-pile-new]').click();ok(p.locator('[name=variant]').input_value()=='pile-last-loses','play again retains rule');ok(p.locator('[name=start]').input_value()=='5','play again retains pile');ok(p.locator('[name=dial]').input_value()=='attention','play again retains rival strength');p.locator('[data-pile-back]').click()
   p.locator('[data-pile-explain]').click()
   for i in range(3):p.locator('[data-pile-step="'+str(i+1)+'"]').click()
   p.locator('[data-pile-practice]').click();p.locator('.pile-history summary').click();p.locator('[data-pile-resume="0"]').click();ok('Practice board' not in p.locator('.pile-board-head').inner_text(),'resume leaves temporary practice')
   go(p,'#home');ok(p.locator('a[href="#orchard/games"]').count()>0,'home invitation');go(p,'#orchard');ok(p.locator('a[href="#orchard/games"]').count()>0,'orchard invitation')
   prior_first=notebook(p)['games']['current']['first'];go(p,'#notes');p.locator('#remember').uncheck();go(p,'#orchard/games');p.locator('[data-pile-new]').click();ok(p.locator('[name=first]').input_value()==prior_first,'play again retains starting player');p.locator('[name=first]').select_option('child');p.locator('[data-pile-form] button[type=submit]').click();p.locator('[data-pile-take="1"]').click();ok(p.evaluate("()=>!Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"),'save-off keeps game in memory only')
   context.close()
  ok(not errors,'no browser errors: '+str(errors));print(f'Seed Pile Chrome: {checks} assertions passed at320/820.')
 finally:browser.close()
