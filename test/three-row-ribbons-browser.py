"""Synthetic three-row journeys and old two-row save compatibility in actual Chrome."""
import json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];BASE=os.environ.get('ROWS_TEST_URL','http://127.0.0.1:4188/');OUT=Path(os.environ.get('ROWS_ARTIFACTS','/tmp/three-row-ribbons'));OUT.mkdir(parents=True,exist_ok=True)
old=json.loads((ROOT/'test/fixtures/ribbon-rows-two-v1.json').read_text())
initial=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;console.log(JSON.stringify(s));"],cwd=ROOT,text=True));initial['ribbonRows']={'version':1,'current':old,'earlier':[],'notes':[],'lesson':None}
n=0
def ok(value,why):
 global n
 assert value,why
 n+=1
def saved(p):return p.evaluate("()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+r.activeId));}")
def root(p):return saved(p)['ribbonRows']
def go(p,h='#orchard/games/rows'):
 p.goto(BASE+h);p.locator('[data-rows-root]' if h=='#orchard/games/rows' else 'main').wait_for()
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator('.ribbon-rows-page button,.ribbon-rows-page select,.ribbon-rows-page a,.ribbon-rows-page summary').evaluate_all("xs=>xs.filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<44}).map(x=>x.textContent)");ok(not bad,'44px controls: '+str(bad))
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'));errors=[]
 try:
  for width in [320,820]:
   c=b.new_context(viewport={'width':width,'height':1100},has_touch=True,accept_downloads=True,reduced_motion='reduce');c.add_init_script("if(!localStorage.getItem('three-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(initial))+");localStorage.setItem('three-fixture','1');}");p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));go(p)
   ok(root(p)['current']==old,'old two-row save unchanged on view');ok(p.locator('[data-rows-bundles]').count()==0,'two rows do not gain bundle help');p.locator('[data-rows-new]').click();ok(p.locator('[name=rowCount]').input_value()=='2','legacy setup defaults to two')
   p.locator('[name=rowCount]').select_option('3');ok(p.locator('[name=row3]').is_visible(),'third row setting');ok(p.locator('[data-rows-preview] .rows-row').count()==3,'preview follows count');p.locator('[data-rows-deal]').click();ok(root(p)['current']==old,'dealing leaves waiting game intact');ok(all(1<=int(p.locator(f'[name=row{i}]').input_value())<=7 for i in [1,2,3]),'three dealt counts')
   for row,value in [(1,'1'),(2,'2'),(3,'4')]:p.locator(f'[name=row{row}]').select_option(value)
   p.locator('[name=dial]').select_option('plan');p.locator('[data-rows-start] button[type=submit]').click();ok(root(p)['earlier'][0]==old,'starting archives exact legacy game');ok(root(p)['current']['source']['model']=='ribbon-rows-three-v1','new model explicit');ok(p.locator('[data-rows-row]').count()==3,'three playable rows');ok(p.locator('.rows-bundles').count()==0,'no automatic strategy picture');bounds(p)
   p.locator('[data-rows-row="2"]').focus();p.keyboard.press('Enter');p.locator('[data-rows-count="1"]').focus();p.keyboard.press('Enter');ok(root(p)['current']['draft']=={'row':2,'take':1},'Row3 keyboard draft');p.reload();p.locator('[data-rows-take]').wait_for();ok(root(p)['current']['draft']=={'row':2,'take':1},'third-row draft resumes')
   p.locator('[data-rows-bundles]').click();ok(root(p)['current']['bundlesAt']==0,'first supplied bundle timing');ok('no partner' in p.locator('.rows-pair-status').inner_text(),'initial odd bundles explained');ok(p.locator('[data-bundle-size="4"]').inner_text().startswith('1 bundle'),'one4-bundle');before=root(p);p.locator('[data-rows-bundles]').click();ok(root(p)==before,'hiding never writes');p.locator('[data-rows-bundles]').click();ok(root(p)['current']['bundlesAt']==0,'reveal retains first timing');bounds(p);p.locator('.rows-bundle-view').screenshot(path=str(OUT/f'bundles-{width}.png'))
   p.locator('[data-rows-take]').click();ok(p.locator('.rows-bundles').count()==0,'a committed move resets picture visibility');ok(root(p)['current']['moves']==[{'who':'child','row':2,'take':1}],'one third-row take');p.locator('[data-rows-bundles]').click();ok('All bundle sizes pair' in p.locator('.rows-pair-status').inner_text(),'1,2,3 is paired');p.locator('[data-rows-bramble]').click();ok(root(p)['current']['moves'][-1]=={'who':'bramble','row':0,'take':1},'manual losing-position fallback stored')
   waiting=root(p)['current'];p.locator('[data-rows-explain]').click();ok('Thought 1 of 6' in p.locator('.rows-lesson-nav').inner_text(),'six pictured thoughts');ok(p.locator('.rows-bundles').count()==1,'first picture supplied');bounds(p)
   for step in range(1,6):
    p.locator(f'[data-rows-step="{step}"]').click();bounds(p)
    if step==2:ok(p.locator('.rows-bundles').count()==3,'middle broken-pattern chart pictured');ok('Middle' in p.locator('.rows-bundles caption').nth(1).inner_text(),'middle chart labelled')
    if step==4:ok('even total is not enough' in p.locator('#rows-thought').inner_text(),'even-total contrast');p.locator('.rows-bundle-view').last.screenshot(path=str(OUT/f'paired-{width}.png'))
   p.locator('[data-rows-step="4"]').click();p.locator('[data-rows-step="5"]').click();ok('3, 3, 2' in p.locator('#rows-thought').inner_text(),'matching-row contrast');p.locator('[data-rows-practice]').click();ok(p.locator('.rows-practice-label').is_visible(),'separate supplied practice');ok(p.locator('[data-rows-row]').count()==3,'matching-model practice has three rows');before=root(p);p.locator('[data-rows-bundles]').click();ok(root(p)==before,'practice bundles never alter saved game');p.locator('[data-rows-row="2"]').click();p.locator('[data-rows-count="1"]').click();p.locator('[data-rows-take]').click();p.locator('[data-rows-bramble]').click();ok(root(p)==before,'practice moves never alter waiting root');p.locator('[data-rows-back]').click();ok(root(p)['current']['moves']==waiting['moves'],'return restores actual moves')
   for _ in range(3):
    p.locator('[data-rows-row="2"]').click();p.locator('[data-rows-count="1"]').click();p.locator('[data-rows-take]').click()
    if p.locator('[data-rows-bramble]').count():p.locator('[data-rows-bramble]').click()
   ok('You win' in p.locator('#rows-turn').inner_text(),'bundle strategy plays through to ending');p.locator('[data-rows-note] textarea').fill('Synthetic bundle idea');p.locator('[data-rows-note] button').click();p.locator('[data-rows-new]').click();ok(p.locator('[name=rowCount]').input_value()=='3','setup remembers current model');p.locator('[name=rowCount]').select_option('2');ok(not p.locator('[name=row3]').is_visible(),'third input hidden in two-row mode');p.locator('[data-rows-start] button[type=submit]').click();ok(len(root(p)['current']['start'])==2,'hidden third value ignored');ok(root(p)['current']['support']==[],'three-row explanation does not become two-row familiarity')
   p.locator('.rows-history summary').click();p.locator('[data-rows-resume="0"]').click();ok(root(p)['current']==old,'legacy draft resumed byte for byte');p.locator('.rows-history summary').click();p.locator('[data-rows-resume="1"]').click();ok(len(root(p)['current']['start'])==3,'three-row history resumes after two-row switch')
   go(p,'#notes')
   with p.expect_download() as d:p.locator('#download').click()
   report=json.loads(Path(d.value.path()).read_text());owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId");p.locator('#progress-file').set_input_files({'name':'synthetic-three.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual transfer');go(p);ok(root(p)==report['ribbonRows'],'two/three histories and help timing transfer exactly');p.locator('#explorer-switch').click();p.locator(f'[data-select-explorer="{owner}"]').click();go(p);ok(root(p)==report['ribbonRows'],'original explorer intact')
   go(p,'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click();go(p);ok('ribbonRows' not in saved(p),'reset clears active explorer variation');p.locator('[name=rowCount]').select_option('3');p.locator('[data-rows-start] button[type=submit]').click();go(p,'#notes');p.locator('#remember').uncheck();go(p);p.locator('[data-rows-bundles]').click();ok(p.locator('.rows-bundles').count()==1,'save-off help works in memory');ok(p.evaluate("!Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"),'save-off does not recreate stored notebooks');c.close()
  ok(not errors,'no page errors: '+str(errors));print(f'Three-row Ribbon Rows Chrome: {n} assertions passed at320/820.')
 finally:b.close()
