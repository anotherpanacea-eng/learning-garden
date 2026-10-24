"""Synthetic notebooks only; real Chrome UI at two touch viewport widths."""
import json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('ROWS_TEST_URL','http://127.0.0.1:4188/')
OUT=Path(os.environ.get('ROWS_ARTIFACTS','/tmp/ribbon-rows-browser'));OUT.mkdir(parents=True,exist_ok=True)
initial=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
checks=0
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def notebook(p):return p.evaluate("()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+r.activeId));}")
def go(p,h='#orchard/games/rows'):
 p.goto(BASE+h);p.locator('[data-rows-root]' if h=='#orchard/games/rows' else '[data-pile-root]' if h=='#orchard/games' else '[data-shutters-root]' if h=='#orchard/games/shutters' else 'main').wait_for()
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('.ribbon-rows-page button,.ribbon-rows-page select,.ribbon-rows-page a,.ribbon-rows-page summary').evaluate_all("xs=>xs.filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<44}).map(x=>x.textContent)")
 ok(not bad,'44px controls: '+str(bad))
def bring(p,report):
 go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-rows.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual import adapter');go(p)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 errors=[]
 try:
  for width in [320,820]:
   c=b.new_context(viewport={'width':width,'height':1100},has_touch=True,accept_downloads=True,reduced_motion='reduce')
   c.add_init_script("if(!localStorage.getItem('rows-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(initial))+");localStorage.setItem('rows-fixture','1');}")
   p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));go(p)
   ok('ribbonRows' not in notebook(p),'view does not allocate root');bounds(p);ok(p.locator('.games-table-nav a').count()==3,'three linked games');ok(p.locator('text=Where could this take us?').count()==0,'no unrelated onward panels')
   p.locator('[data-rows-deal]').click();ok('Dealt' in p.locator('#rows-dealt').inner_text(),'deal explained');ok('ribbonRows' not in notebook(p),'dealing is setup only')
   p.locator('[name=row1]').select_option('5');p.locator('[name=row2]').select_option('3');p.locator('[name=dial]').select_option('plan');p.locator('[data-rows-start] button[type=submit]').click();ok(p.locator('.rows-knot').count()==8,'eight countable knots')
   p.locator('[data-rows-row="0"]').focus();p.keyboard.press('Enter');ok(notebook(p)['ribbonRows']['current']['draft']['row']==0,'keyboard row select')
   p.locator('[data-rows-count="2"]').focus();p.keyboard.press('Enter');ok(notebook(p)['ribbonRows']['current']['draft']=={'row':0,'take':2},'keyboard count');ok(p.locator('[data-rows-row="0"]').get_attribute('aria-pressed')=='true','selected row announced');ok(p.locator('[data-rows-count="2"]').evaluate('(b)=>getComputedStyle(b).outlineColor')=='rgb(163, 63, 40)','distinct keyboard focus');ok('5 − 2 = 3' in p.locator('#rows-draft').inner_text(),'visible revision equation');ok(p.locator('.rows-slot.taking').count()==2,'removed ribbons previewed')
   p.locator('[data-rows-row="1"]').click();ok(notebook(p)['ribbonRows']['current']['draft']['take'] is None,'row switch clears count');p.locator('[data-rows-clear]').click();ok(p.locator('[data-rows-take]').is_disabled(),'clear does not advance');p.locator('[data-rows-row="0"]').click();p.locator('[data-rows-count="2"]').click();bounds(p)
   p.locator('[data-rows-root]').screenshot(path=str(OUT/f'playing-{width}.png'));p.locator('.rows-mat').screenshot(path=str(OUT/f'mat-{width}.png'))
   waiting=notebook(p)['ribbonRows']['current'];p.reload();p.locator('[data-rows-take]').wait_for();ok(notebook(p)['ribbonRows']['current']==waiting,'reload preserves exact draft')
   p.locator('[data-rows-explain]').click();ok(notebook(p)['ribbonRows']['current']['explanationAt']==0,'help timing separate');p.locator('[data-rows-step="1"]').click();ok('3 − 2 = 1' in p.locator('.rows-example-moves').inner_text(),'pictured example subtraction');p.locator('[data-rows-step="2"]').click();p.locator('[data-rows-step="3"]').click();bounds(p);ok(p.locator('.rows-knot').count()==2,'ending picture before and after');p.locator('[data-rows-step="2"]').click();ok('Bramble takes 2' in p.locator('.rows-example-moves').inner_text(),'Back retains example');p.locator('[data-rows-step="3"]').click()
   saved=notebook(p)['ribbonRows'];p.locator('[data-rows-practice]').click();ok(p.locator('.rows-practice-label').is_visible(),'practice explicitly supplied');p.locator('[data-rows-row="0"]').click();p.locator('[data-rows-count="2"]').click();p.locator('[data-rows-take]').click();p.locator('[data-rows-bramble]').click();ok(notebook(p)['ribbonRows']==saved,'practice leaves entire waiting root unchanged');p.locator('[data-rows-back]').click();ok(notebook(p)['ribbonRows']['current']['draft']==waiting['draft'],'return restores draft')
   p.locator('[data-rows-explain]').click()
   for n in [1,2,3]:p.locator(f'[data-rows-step="{n}"]').click()
   p.locator('[data-rows-practice]').click();go(p,'#home');go(p);ok(p.locator('.rows-practice-label').count()==0,'leaving clears only practice');ok(notebook(p)['ribbonRows']['current']['draft']==waiting['draft'],'leaving practice keeps saved choice')
   p.evaluate("window.oldTake=document.querySelector('[data-rows-take]')");p.locator('[data-rows-take]').click();ok(len(notebook(p)['ribbonRows']['current']['moves'])==1,'one committed move');p.evaluate('window.oldTake.click()');ok(len(notebook(p)['ribbonRows']['current']['moves'])==1,'stale take cannot advance another turn');ok(p.locator('[data-rows-bramble]').is_visible(),'Bramble waits for explicit action');p.reload();p.locator('[data-rows-bramble]').wait_for();ok(len(notebook(p)['ribbonRows']['current']['moves'])==1,'reload never invents opponent reply');p.locator('[data-rows-bramble]').click();ok(len(notebook(p)['ribbonRows']['current']['moves'])==2,'one opponent move')
   for _ in range(3):
    p.locator('[data-rows-row="1"]').click();p.locator('[data-rows-count="1"]').click();p.locator('[data-rows-take]').click()
    if p.locator('[data-rows-bramble]').count():p.locator('[data-rows-bramble]').click()
   ok('You win' in p.locator('#rows-turn').inner_text(),'matching plan can win');ok(p.locator('[data-rows-bramble]').count()==0,'no move after ending');bounds(p)
   p.locator('[data-rows-note] textarea').fill('<b>I left matching rows.</b>');p.locator('[data-rows-note] button').click();ok('kept' in p.locator('#rows-status').inner_text(),'round note kept');ok(p.evaluate('document.activeElement.id')=='rows-status','kept focus');p.locator('.rows-history summary').click();ok(p.locator('.rows-record b').count()==0,'note escaped');p.locator('[data-rows-remove="notes:0"]').click();p.locator('[data-rows-cancel]').click();ok(len(notebook(p)['ribbonRows']['notes'])==1,'cancel removal preserves note')
   p.locator('[data-rows-new]').click();p.locator('[name=row1]').select_option('7');p.locator('[name=row2]').select_option('7');p.locator('[name=first]').select_option('bramble');p.locator('[data-rows-start] button[type=submit]').click();ok(len(notebook(p)['ribbonRows']['earlier'])==1,'new game archives finished one unchanged');p.locator('[data-rows-bramble]').click();p.locator('[data-rows-row="1"]').click();bounds(p);ok(p.locator('[data-rows-count]').count()==7,'all seven take choices fit')
   p.locator('.rows-history summary').click();p.locator('[data-rows-resume="0"]').click();ok('You win' in p.locator('#rows-turn').inner_text(),'resume ended game');p.locator('.rows-history summary').click();p.locator('[data-rows-remove="notes:0"]').click();p.locator('[data-rows-confirm]').click();ok(notebook(p)['ribbonRows']['notes']==[],'confirmed selected note removal')
   saved=notebook(p)['ribbonRows'];exposures=notebook(p).get('exposures');go(p,'#loft/bridges');p.locator('.bridges-page').wait_for();ok(p.locator('.learning-invitations').count()==0,'Sentence Bridges excludes shared invitations despite added game routes');ok(notebook(p).get('exposures')==exposures,'Sentence Bridges view does not create shared exposure');go(p,'#orchard/games');p.locator('[data-pile-form] button[type=submit]').click();pile=notebook(p)['games'];go(p,'#orchard/games/shutters');p.locator('[data-shutter-start] button[type=submit]').click();box=notebook(p)['shutters'];go(p);ok(notebook(p)['ribbonRows']==saved,'other games leave rows intact');p.locator('[data-rows-new]').click();p.locator('[data-rows-start] button[type=submit]').click();ok(notebook(p)['games']==pile and notebook(p)['shutters']==box,'rows leave both other games intact')
   go(p,'#notes')
   with p.expect_download() as d:p.locator('#download').click()
   report=json.loads(Path(d.value.path()).read_text());owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");bring(p,report);ok(notebook(p)['ribbonRows']==report['ribbonRows'],'actual download/import exact root');p.locator('#explorer-switch').click();p.locator(f'[data-select-explorer="{owner}"]').click();go(p);ok(notebook(p)['ribbonRows']==report['ribbonRows'],'switch restores original explorer')
   report['ribbonRows']['current']['source']['model']='future-rows';bring(p,report);ok(p.locator('.rows-warning').is_visible(),'unsupported current notice');p.locator('[data-rows-start] button[type=submit]').click();ok(notebook(p)['ribbonRows']['earlier'][-1]['source']['model']=='future-rows','start preserves unsupported current')
   active=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");others=p.evaluate("id=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('number-garden-v1:')&&k!=='number-garden-v1:'+id))",active);go(p,'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click();go(p);ok('ribbonRows' not in notebook(p),'Reset clears active rows');ok(p.evaluate("id=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('number-garden-v1:')&&k!=='number-garden-v1:'+id))",active)==others,'Reset leaves other explorers');p.locator('[data-rows-start] button[type=submit]').click();go(p,'#notes');p.locator('#remember').uncheck();go(p);p.locator('[data-rows-row="0"]').click();ok(p.evaluate("!Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"),'save-off remains memory only');c.close()
  ok(not errors,'no page errors: '+str(errors));print(f'Ribbon Rows Chrome: {checks} assertions passed at320/820.')
 finally:b.close()
