"""Synthetic Keeper's Desk journeys in installed Chrome; no learner files/services."""
import copy, json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('DESK_TEST_URL','http://127.0.0.1:4192/')
OUT=Path(os.environ.get('DESK_ARTIFACTS','/tmp/keepers-desk-browser'));OUT.mkdir(parents=True,exist_ok=True)
initial=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
checks=0

def ok(value,message):
 global checks
 assert value,message
 checks+=1

def notebook(p):
 return p.evaluate("()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+r.activeId));}")
def active(p):return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
def go(p,h):
 p.goto(BASE+h)
 p.locator('[data-desk-root]' if h=='#desk' else 'main').wait_for()
def part(p,id):p.locator('.desk-tabs [data-desk-step="'+id+'"]').click()
def task(p,id):p.locator('.desk-task-nav [data-desk-task="'+id+'"]').click()
def answer(p,value):p.locator('[data-desk-answer]').fill(value);p.locator('[data-desk-keep]').click()
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
 bad=p.locator('.desk-page button,.desk-page summary,.desk-page a,.desk-page select,.desk-page input[type=text],.desk-page input[type=number],.desk-page .desk-choice').evaluate_all("xs=>xs.filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<44}).map(x=>x.textContent||x.outerHTML)")
 ok(not bad,'44px touch target heights: '+str(bad))
 ok(p.locator('.desk-page').evaluate("x=>parseFloat(getComputedStyle(x).fontSize)>=16"),'base text at least16px')
def reload(p):
 identity=active(p);p.reload();p.locator('main').wait_for()
 if p.locator('[data-select-explorer]').count():p.locator('[data-select-explorer="'+identity+'"]').click()
 p.locator('[data-desk-root]').wait_for()
def report(p):
 go(p,'#notes')
 with p.expect_download() as d:p.locator('#download').click()
 return json.loads(Path(d.value.path()).read_text())
def bring(p,value):
 go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-desk.json','mimeType':'application/json','buffer':json.dumps(value).encode()})
 p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'real JSON import adapter')
def setup(browser,width,seed=None):
 c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True)
 s=seed if seed is not None else initial
 c.add_init_script("if(!localStorage.getItem('desk-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(s))+");localStorage.setItem('desk-fixture','1');}")
 p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));return c,p

def supported_page(p):
 part(p,'recommendation');p.locator('[data-desk-plan]').select_option('causeway');p.locator('[data-desk-use-plan]').click()
 for f in ['reason','objection','uncertainty']:
  choices=p.locator('[data-desk-starter="'+f+'"] option').evaluate_all("xs=>xs.filter(x=>x.value!==''&&!x.textContent.includes('…')).map(x=>x.value)")
  ok(bool(choices),'complete supplied sentence for '+f)
  p.locator('[data-desk-starter="'+f+'"]').select_option(choices[-1]);p.locator('[data-desk-use-starter="'+f+'"]').click()
 p.locator('[data-desk-keep-recommendation]').click()

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 errors=[]
 try:
  for width in [320,820]:
   c,p=setup(browser,width)
   go(p,'#desk');ok('desk' not in notebook(p),'first render allocates no casebook');bounds(p)
   p.screenshot(path=str(OUT/f'arrival-{width}.png'),full_page=True)
   go(p,'#notes');ok('desk' not in notebook(p),'notes does not allocate desk');go(p,'#desk')
   p.locator('[data-desk-start="take"]').tap();ok(notebook(p)['desk']['arrived'],'explicit arrival is kept')
   ok(p.locator('.desk-tabs [data-desk-step]:disabled').count()==0,'all case parts open');bounds(p)
   part(p,'cost');s=notebook(p)['desk']['steps']['cost'];ok(s['shownLearn']==1 and '1a' in s['shownGuided'],'visible first learning and guide recorded')
   p.locator('[data-desk-answer]').fill('1440');draft=copy.deepcopy(notebook(p)['desk']);task(p,'1b');task(p,'1a');ok(p.locator('[data-desk-answer]').input_value()=='1440','draft survives task paging')
   p.locator('[data-desk-keep]').tap();first=notebook(p)['desk']['steps']['cost']['first']['1a'];ok(first['outcome']=='different','setup omission has model mismatch')
   ok('setup' in p.locator('.desk-record').first.inner_text().lower(),'authored setup misconception feedback');ok(p.locator('#desk-status').inner_text()==first['feedback'],'check feedback announced in live status')
   p.locator('[data-desk-fold]').tap();s=notebook(p)['desk']['steps']['cost'];ok(s['shownLearn']==1 and s['shownGuided']==['1a'],'fold preserves initial exposure')
   answer(p,'2,640 coins');r=notebook(p)['desk']['steps']['cost']['attempts']['1a'][-1];ok(r['outcome']=='match' and r['priorAttempts']==1 and r['familiar'],'retry context independent of value match')
   ok(r['support']['learn']==[0] and '1a' in r['support']['guided'],'folded response retains prior visible support')
   p.locator('[data-desk-show]').tap();ok(any(x['code']=='show-how' for x in notebook(p)['desk']['steps']['cost']['support']),'reopened teaching recorded')
   task(p,'1b');help_source=next(x for x in notebook(p)['desk']['source']['tasks'] if x['id']=='1b');p.locator('[data-desk-stuck]').tap();ok(p.locator('#desk-status').inner_text()==help_source['hint'],'hint announced in live status');p.locator('[data-desk-stuck]').tap();ok(p.locator('#desk-status').inner_text()==help_source['example'],'similar example announced in live status');p.locator('[data-desk-stuck]').tap();s=notebook(p)['desk']['steps']['cost'];ok(s['help']['1b']==3 and s['attempts']['1b'][-1]['outcome']=='skipped','hint/example/skip kept separately')
   task(p,'1d');ok(p.locator('[data-desk-trials] input').input_value()=='','trial has no answer default');before_invalid=copy.deepcopy(notebook(p)['desk']);p.locator('[data-desk-keep]').click();ok(notebook(p)['desk']==before_invalid,'empty check adds no first attempt or support');ok('whole number' in p.locator('#desk-status').inner_text().lower(),'invalid format announced');ok('beyond 20 metres' not in p.locator('.desk-page').inner_text(),'invalid check does not reveal crossover contrast');p.locator('[data-desk-trials] input').fill('20');p.locator('[data-desk-trials] button').tap();row=notebook(p)['desk']['steps']['cost']['trials'][-1];ok(row=={'length':20,'bridge':2400,'causeway':2400},'equal-cost trial table')
   answer(p,'L = 20 m');ok(notebook(p)['desk']['steps']['cost']['attempts']['1d'][-1]['outcome']=='match','length answer accepted')
   task(p,'1e-bridge');answer(p,'60L + 1200');ok(notebook(p)['desk']['steps']['cost']['attempts']['1e-bridge'][-1]['outcome']=='match','equivalent affine rule accepted')
   before_invalid=copy.deepcopy(notebook(p)['desk']['steps']['cost']['attempts']['1e-bridge']);answer(p,'L*L-L*L+60L+1200');ok(notebook(p)['desk']['steps']['cost']['attempts']['1e-bridge']==before_invalid,'nonlinear rejection creates no kept attempt');ok('linear rule' in p.locator('#desk-status').inner_text(),'nonlinear format feedback announced')
   bounds(p);p.screenshot(path=str(OUT/f'rule-{width}.png'),full_page=True)
   part(p,'crossings');answer(p,'3:1');ok(notebook(p)['desk']['steps']['crossings']['attempts']['2a'][-1]['outcome']=='different','ratio order distinct')
   task(p,'2b');answer(p,'1/3');ok('whole' in p.locator('.desk-record').last.inner_text().lower() or 'everyone' in p.locator('.desk-record').last.inner_text().lower(),'part/whole misconception explained')
   answer(p,'25%');ok(notebook(p)['desk']['steps']['crossings']['attempts']['2b'][-1]['outcome']=='match','exact percentage share')
   task(p,'2c-ratio');visible=p.locator('.desk-page').inner_text();ok('1:19' not in visible and '1/20' not in visible and '1 : 19' not in visible,'Tuesday prompt has no unrecorded solution contrast');task(p,'2c-share');visible=p.locator('.desk-page').inner_text();ok('1:19' not in visible and '1/20' not in visible,'Tuesday share prompt has no supplied answer');
   task(p,'2d');order=p.locator('[data-desk-choice]').evaluate_all('xs=>xs.map(x=>x.dataset.deskChoice)');p.locator('[data-desk-choice="discard"]').check();p.locator('[data-desk-keep]').click();ok(notebook(p)['desk']['steps']['crossings']['attempts']['2d'][-1]['outcome']=='interpretation','evidence response ungraded')
   part(p,'records');p.locator('[data-desk-source-kind]').select_option('warning');p.locator('[data-desk-source-card="hob-experience"]').select_option('cannot');p.locator('[data-desk-source-card="hob-days"]').select_option('can');p.locator('[data-desk-keep]').tap();ok(notebook(p)['desk']['steps']['records']['attempts']['3a-hob'][-1]['outcome']=='interpretation','source arrangement never scored')
   task(p,'3b');other=p.locator('[data-desk-choice]').evaluate_all('xs=>xs.map(x=>x.dataset.deskChoice)');ok(order.index('keep-both')!=other.index('different'),'fitting choice positions vary')
   p.locator('[data-desk-choice="different"]').check();p.locator('[data-desk-keep]').click();bounds(p);p.screenshot(path=str(OUT/f'records-{width}.png'),full_page=True)
   part(p,'recommendation');p.locator('[data-desk-rec="reason"]').fill('A synthetic working reason.');reload(p);ok(p.locator('[data-desk-rec="reason"]').input_value()=='A synthetic working reason.','recommendation draft survives reload')
   supported_page(p);kept=copy.deepcopy(notebook(p)['desk']['recommendation']['kept']);ok(kept['planId']=='causeway' and bool(kept['objection']),'supported recommendation kept')
   original_code=notebook(p)['desk']['recommendation']['objectionCode'];before_select=copy.deepcopy(notebook(p)['desk']);p.locator('[data-desk-plan]').select_option('bridge');ok(notebook(p)['desk']==before_select,'select alone does not replace draft');p.locator('[data-desk-use-plan]').click();r=notebook(p)['desk']['recommendation'];ok(r['objectionCode']==original_code and r['draft']['objection']==kept['objection'],'plan change preserves answer/question pairing')
   ok(p.locator('[data-desk-new-objection]').count()==1,'explicit new objection action offered');p.locator('[data-desk-new-objection]').tap();r=notebook(p)['desk']['recommendation'];ok(r['objectionCode']=='bridge' and r['draft']['objection']=='','new objection explicitly clears only draft answer');ok(r['kept']==kept,'kept recommendation unchanged by new question')
   p.locator('[data-desk-starter="objection"]').select_option('0');p.locator('[data-desk-use-starter="objection"]').click();p.locator('[data-desk-rec="reason"]').fill('<img src=x onerror="window.deskInjected=1"> A synthetic reason.');p.locator('[data-desk-keep-recommendation]').click();ok(p.locator('.desk-recommendation img').count()==0 and not p.evaluate('Boolean(window.deskInjected)'),'recommendation HTML escaped')
   ok(notebook(p)['desk']['recommendation']['first']==kept,'first recommendation retained after revision');bounds(p);p.screenshot(path=str(OUT/f'recommendation-{width}.png'),full_page=True)
   stale=p.locator('[data-desk-keep-recommendation]').element_handle();part(p,'cost');before=copy.deepcopy(notebook(p)['desk']);stale.evaluate('(x)=>x.click()');ok(notebook(p)['desk']==before,'detached old page callback inert')
   p.evaluate("()=>{window.oldDesk=document.querySelector('[data-desk-keep]');location.hash='#notes';oldDesk.click();}");p.locator('#download').wait_for();ok(notebook(p)['desk']==before,'changed-hash callback inert before route render')
   original=active(p);saved=report(p);expected=copy.deepcopy(saved['desk']);ok(expected==notebook(p)['desk'],'actual notes export contains whole casebook')
   bring(p,saved);go(p,'#desk');ok(notebook(p)['desk']==expected,'export/import exact desk preservation')
   p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+original+'"]').click();go(p,'#desk');ok(notebook(p)['desk']==expected,'explorer switch preserves original case')
   revised=copy.deepcopy(saved);revised['desk']['source']['model']['bridge']['setup']=1300;bring(p,revised);go(p,'#desk');ok(notebook(p)['desk']['steps']['cost']['attempts']['1a'][-1]['outcome']=='match','changed source does not regrade kept outcome');part(p,'cost');answer(p,'2640');ok(notebook(p)['desk']['steps']['cost']['attempts']['1a'][-1]['outcome']=='different','new check uses saved source model, not current catalog')
   broken=copy.deepcopy(saved);broken['desk']['steps']['cost']={'future':'raw synthetic work'};broken['desk']['location']={'stepId':'crossings','taskId':'2d'};bring(p,broken);go(p,'#desk');ok(p.locator('[data-desk-choice]').count()==3,'malformed cost leaves reading task usable');ok(notebook(p)['desk']['steps']['cost']==broken['desk']['steps']['cost'],'malformed sibling remains raw')
   p.locator('[data-desk-choice="keep-both"]').check();p.locator('[data-desk-keep]').click();ok(notebook(p)['desk']['steps']['crossings']['attempts']['2d'][-1]['outcome']=='interpretation','readable sibling can still keep work')
   c.close()
   # Separate untouched case proves the no-typing supported route does not complete earlier steps.
   c,p=setup(browser,width);go(p,'#desk');p.locator('[data-desk-start="look"]').tap();ok('casebook is open' in p.locator('#desk-status').inner_text().lower(),'look-around response');supported_page(p)
   d=notebook(p)['desk'];ok(all(not d['steps'][k]['attempts'] for k in ['cost','crossings','records']),'supported closure leaves prior steps open')
   ok(all(d['steps'][k]['shownLearn']==0 for k in ['cost','crossings','records']),'no invented earlier exposure')
   p.locator('.desk-recommendation').first.locator('summary',has_text='Read it to Wren').click();ok('read this out tomorrow' in p.locator('.desk-recommendation').first.inner_text().lower(),'neutral identical Wren closure');ok('Case work now' in p.locator('.desk-recommendation').first.inner_text(),'Read to Wren expands case work');ok('Supplied wording was used' in p.locator('.desk-recommendation').first.inner_text(),'kept page labels supplied wording')
   part(p,'cost');p.locator('[data-desk-answer]').focus();p.keyboard.type('2640');p.locator('[data-desk-keep]').focus();p.keyboard.press('Enter');ok(notebook(p)['desk']['steps']['cost']['attempts']['1a'][-1]['outcome']=='match','keyboard answer/check path');c.close()
   # Regression: editing a selected plan and clearing/retyping an answer never changes its shown question.
   c,p=setup(browser,width);go(p,'#desk');p.locator('[data-desk-start="take"]').click();part(p,'recommendation');before_select=copy.deepcopy(notebook(p)['desk']);plan_select=p.locator('[data-desk-plan]');plan_select.focus();p.keyboard.press('ArrowDown');p.keyboard.press('Escape');ok(notebook(p)['desk']==before_select,'native plan-select ArrowDown does not mutate words');ok(plan_select.evaluate('(x)=>document.activeElement===x'),'native plan-select retains focus');plan_select.select_option('bridge');p.locator('[data-desk-use-plan]').click();p.locator('[data-desk-rec="plan"]').fill('Build the timber footbridge with room for hand-carts.');ok(notebook(p)['desk']['recommendation']['planId']=='bridge','editing selected plan preserves its identity');shown=p.locator('[data-desk-rec="objection"]').get_attribute('data-desk-objection-code');p.locator('[data-desk-rec="objection"]').fill('The farms will still need the ford.');p.locator('[data-desk-rec="objection"]').fill('');p.locator('[data-desk-rec="objection"]').fill('I accept that trade-off and would keep another route.');r=notebook(p)['desk']['recommendation'];ok(r['objectionCode']==shown=='bridge','clear/retype remains bound to visible objection');p.locator('[data-desk-rec="reason"]').fill('The courier travels on foot.');p.locator('[data-desk-rec="uncertainty"]').fill('We should ask about other journeys.');before_select=copy.deepcopy(notebook(p)['desk']);reason_select=p.locator('[data-desk-starter="reason"]');reason_select.focus();p.keyboard.press('ArrowDown');p.keyboard.press('Escape');ok(notebook(p)['desk']==before_select,'native starter ArrowDown does not replace words');ok(reason_select.evaluate('(x)=>document.activeElement===x'),'native starter retains focus');p.locator('[data-desk-keep-recommendation]').click();r=notebook(p)['desk']['recommendation'];ok(r['kept']['objectionQuestion']==notebook(p)['desk']['source']['recommendation']['objections'][shown],'kept objection question exactly equals displayed question');ok(r['kept']['objection']==r['draft']['objection'],'kept answer is the displayed answer');c.close()
   c,p=setup(browser,width);go(p,'#home');ok(p.locator('.desk-entry a[href="#desk"]').count()==1,'Home desk invitation');go(p,'#explore');ok(p.locator('a[href="#desk"]').count()>0,'All places desk link');go(p,'#begin');p.locator('[data-start-choice="small"]').click();p.locator('[data-start-page="3"]').click();p.locator('[data-start-go="#desk"]').tap();p.locator('[data-desk-root]').wait_for();ok('desk' not in notebook(p),'Begin navigation creates no case record');ok(notebook(p)['garden'].get('cafeStart')=='follow','Begin applies Café choice before desk navigation');c.close()
  ok(not errors,'no browser errors: '+str(errors));print(f'Keeper Desk Chrome: {checks} assertions passed at320/820.')
 finally:browser.close()
