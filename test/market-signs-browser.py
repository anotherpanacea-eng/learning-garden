"""Spec325 native app: synthetic touch/keyboard, frozen sources and Notes transfer.
Only fault contexts intercept the existing canExport seam. No real learner files.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('MARKET_SIGNS_ARTIFACTS',tempfile.mkdtemp(prefix='market-signs-')));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('writing_helpers',ROOT/'test/writing-table-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h);h.OUT=OUT
IDS=['B1','B2','B3','B4','B5','B6','E1','E2','E3','E4']
CHOICES={'B1':'a','B2':'c','B3':'b','B4':'c','B6':'a','E1':'a','E3':'c','E4':'b'}
MATCH={'re':'again','pre':'before','un':'not','dis':'not','mis':'wrongly','anti':'against','auto':'self','super':'more'}
def fixture(name='fresh'):
 code="import {signsSeed,fullSignsNotebook,fullEndingSignsNotebook} from './test/market-signs-checks.mjs';import * as c from './dist/market-signs-core.mjs';const o={canExport:()=>true};let s=signsSeed();"
 if name=='ending-full':code+='s=fullEndingSignsNotebook();'
 if name.startswith('ending-bad-'):
  code+="c.openMarketEndingJob(s,'C1',o);c.openMarketBench(s,'endings',o);"
  damage={'hint':"s.signs.endings.source.hints[0].text=99;",'draft':"s.signs.endings.draft.rootId='missing';",'kept':"s.signs.endings.kept=[{rootId:'missing',endingId:'ly',toolId:'just-add'}];",'section':"s.signs.endings={v:99,opaque:['keep']};",'join':"s.signs.endings.source.joins[0].word='freshley';"}
  code+=damage[name.removeprefix('ending-bad-')]
 if name=='full':code+='s=fullSignsNotebook();'
 if name=='seven':code+="c.openMarketBench(s,'prefix',o);c.setMarketPrefix(s,{prefixId:'re'},o);for(const part of s.signs.source.prefix.parts.slice(0,7)){c.setMarketPrefix(s,{partId:part.id},o);c.keepMarketSign(s,o);}"
 if name=='earlier-only':code+="c.openMarketJob(s,'B1',o);s.signs.source.jobs=[];"
 if name=='words-unknown':code+="s.words={v:99,opaque:['earlier word work']};"
 if name=='unknown':code+="s.signs={v:99,opaque:['keep']};"
 if name=='historical':code+="c.openMarketJob(s,'B1',o);const r=c.marketSignsView(s).record;r.source.prompt='An earlier supplied question.';r.source.key='c';r.source.different.earlierUnused='Kept unused line.';"
 if name=='broken':code+="c.openMarketBench(s,'prefix',o);s.signs.source.prefix.parts[0].text=99;s.signs.records['future-job']={source:{v:99},work:{opaque:['kept']}};"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code+'console.log(JSON.stringify(s));'],cwd=ROOT,text=True))
def ready(p):
 p.locator('[data-market-signs-root],[data-select-explorer="explorer-1"]').first.wait_for()
 if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').tap()
 p.locator('[data-market-signs-root]').wait_for()
def setup(browser,base,seed,w=820,hgt=1000,fault=False):
 ctx=browser.new_context(viewport={'width':w,'height':hgt},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-31T12:00:00.000Z'},{'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-10-31T12:00:00.000Z'}]}
 ctx.add_init_script('(d=>{if(!localStorage.getItem("market-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem("number-garden-v1:"+e.id,JSON.stringify(d.seed));localStorage.setItem("market-fixture","1");}window.marketWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.marketFailStorage)throw Error("synthetic storage failure");if(k.startsWith("number-garden")||k==="learning-garden-explorers")window.marketWrites++;return set.call(this,k,v);};})('+json.dumps({'registry':registry,'seed':seed})+')')
 if fault:
  def intercept(route):
   response=route.fetch();body=response.text();start=body.index('bindMarketSigns(state,{');end=body.index('});}return;',start);chunk=body[start:end];assert 'canExport:candidate=>' in chunk
   route.fulfill(response=response,body=body[:start]+'window.marketState=state;'+chunk.replace('canExport:candidate=>','canExport:candidate=>!window.marketRefuse&&')+body[end:])
  ctx.route('**/app.mjs',intercept)
 p=ctx.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:h.errors.append(str(e)));p.on('console',lambda m:h.errors.append(m.text) if m.type=='error' else None);p.on('response',lambda r:h.errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None);p.goto(base+'#words/signs',wait_until='networkidle');ready(p);return ctx,p
def action(p,name):p.locator('[data-ms-action="'+name+'"]:visible').first.tap()
def bench(p,name):
 p.locator('[data-ms-bench="'+name+'"]').tap()
 task=p.locator('#ms-crate-word-title' if name=='crates' and p.locator('#ms-crate-word-title').count() else '#ms-task').bounding_box();bar=p.locator('.ms-ways').bounding_box();h.ok(task['y']>=bar['y']+bar['height']-1,'new turn heading visible below sticky bench tabs')
def drawer(p,name,opened=True):
 d=p.locator('[data-ms-panel="'+name+'"]')
 if (d.get_attribute('open') is not None)!=opened:d.locator('summary').tap()
def choose(p,id):
 bench(p,'practice')
 if p.locator('[data-ms-panel=jobs]').count():drawer(p,'jobs')
 p.locator('[data-ms-job="'+id+'"]').tap();p.locator('#ms-task').wait_for()
def state(p):return h.book(p)['signs']
def record(p):return state(p)['records'][state(p)['currentId']]
def layout(p):
 h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 for e in p.locator('.ms-room button:visible,.ms-room select:visible,.ms-room summary:visible,.ms-room a:visible').all():
  box=e.bounding_box();h.ok(box and box['height']>=43.9,'44px target '+e.inner_text()[:35])
  h.ok(e.evaluate('el=>parseFloat(getComputedStyle(el).fontSize)>=16'),'readable control type at least 16px')
def play(browser,base,seed,w,hgt):
 c,p=setup(browser,base,seed,w,hgt)
 try:
  h.ok('signs' not in h.book(p),'direct arrival creates no save');other=copy.deepcopy(h.book(p)['syntheticOther']);h.ok(p.locator('[data-speak]').count()==0,'no speech buttons in adult-read room');bench(p,'prefix');p.locator('[data-ms-prefix]').select_option('mis');p.locator('[data-ms-part]').select_option('spell');h.ok(p.locator('.ms-painted').inner_text()=='misspell','hyphen not joined into word');h.ok(p.locator('.ms-painted mark').count()==2 and 'Both s letters stay.' in p.locator('.ms-prefix-bench').inner_text(),'two letters marked on supplied join');action(p,'keep-sign');first=copy.deepcopy(state(p)['prefix']['kept']);action(p,'keep-sign');h.ok('already in your shelf' in p.locator('#ms-status').inner_text(),'duplicate keep message is accurate');p.locator('[data-ms-prefix]').select_option('re');p.locator('[data-ms-part]').select_option('view');h.ok(p.locator('.ms-painted').inner_text()=='review' and p.locator('.ms-discovery').count()==1,'real unlisted pair remains discovery');h.ok(p.locator('.ms-painted mark').count()==0,'no spelling verdict on discovery');h.ok('only selected words' in p.locator('.ms-discovery').inner_text(),'model limit visible beside discovery');action(p,'keep-sign');prefix=copy.deepcopy(state(p)['prefix']);layout(p);p.screenshot(path=str(OUT/f'sign-{w}.png'),full_page=True)
  action(p,'clear-sign');h.ok(state(p)['prefix']['kept'][:1]==first and state(p)['prefix']['prefixId'] is None,'clear preserves kept discoveries');drawer(p,'kept');p.locator('[data-ms-kept="1"]').tap();h.ok(state(p)['prefix']==prefix,'reopen kept pair restores waiting sign')
  bench(p,'dictionary');h.ok(p.locator('[data-ms-action=check-page]').is_disabled(),'no free default fit');p.locator('[data-ms-target]').select_option('friend');p.locator('[data-ms-book=bench][data-ms-page=page-2]').tap();action(p,'check-page');h.ok(state(p)['dictionary']['last']['outcome']=='different' and p.locator('[data-ms-target]').input_value()=='friend','wrong page preserves target');p.locator('[data-ms-book=bench][data-ms-page=page-1]').tap();action(p,'check-page');h.ok(state(p)['dictionary']['last']['outcome']=='fit','fitting page accepted');h.ok(p.evaluate('document.activeElement.id')=='ms-bench-entry-friend','found entry receives focus');h.ok(p.locator('#ms-bench-entry-friend').get_attribute('class').endswith('ms-found'),'found word visibly marked');h.ok(state(p)['prefix']==prefix,'book preserves waiting sign');p.locator('[data-ms-target]').select_option('honey')
  for page in ['page-1','page-2','page-3','page-4','page-5']:p.locator('[data-ms-book=bench][data-ms-page='+page+']').tap()
  heldBook=copy.deepcopy(state(p)['dictionary']);layout(p);p.screenshot(path=str(OUT/f'book-{w}.png'),full_page=True);p.reload(wait_until='networkidle');ready(p);h.ok(state(p)['dictionary']==heldBook and state(p)['prefix']==prefix,'reload keeps separate book and sign drafts')
  choose(p,'B5')
  for part,dest in MATCH.items():p.locator('[data-ms-match='+part+']').tap();p.locator('[data-ms-destination='+dest+']').tap()
  action(p,'check-job');h.ok(record(p)['checks'][-1]['outcome']=='fit','un and dis share not without false rejection');action(p,'keep-version');firstKeep=copy.deepcopy(record(p)['firstKept']);p.locator('[data-ms-match=un]').tap();p.locator('[data-ms-destination=wrongly]').tap();action(p,'check-job');h.ok(record(p)['checks'][-1]['outcome']=='different','specific changed placement differs');action(p,'keep-version');h.ok(record(p)['firstKept']==firstKeep,'earlier first version preserved');action(p,'put-back');action(p,'check-job');h.ok(record(p)['checks'][-1]['outcome']=='incomplete','incomplete distinct from different');layout(p)
  choose(p,'E2');target=['fig','flour','fresh','fudge']
  for pos,word in enumerate(target):
   while record(p)['work']['order'].index(word)>pos:p.locator('[data-ms-move='+word+'][data-ms-direction="-1"]').tap()
  action(p,'check-job');h.ok(record(p)['checks'][-1]['outcome']=='fit','ABC ordering with native move controls');p.locator('[data-ms-move=fig][data-ms-direction="1"]').focus();p.keyboard.press('Enter');h.ok(record(p)['work']['order'][1]=='fig','keyboard moves same word');h.ok(p.evaluate('document.activeElement.dataset.msMove')=='fig','moved card retains focus');action(p,'keep-version')
  for id,key in CHOICES.items():
   choose(p,id);p.locator('[data-ms-choice='+key+']').focus();p.keyboard.press('Enter');action(p,'check-job');h.ok(record(p)['checks'][-1]['outcome']=='fit','own supplied answer '+id);action(p,'keep-version')
   if id=='E1':
    writes=p.evaluate('marketWrites');p.locator('[data-ms-book=practice][data-ms-page=page-5]').tap();h.ok(p.evaluate('marketWrites')==writes,'practice book browsing writes no learner evidence');h.ok(state(p)['dictionary']==heldBook,'practice browsing leaves separate book draft exact')
  choose(p,'B1');drawer(p,'help');action(p,'hint');h.ok(record(p)['help']['hint'] and p.locator('#ms-hint').is_visible(),'hint recorded before displayed');drawer(p,'help',False);before=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites');drawer(p,'teaching');p.locator('[data-ms-action=step-next][data-ms-card="0"]').tap();h.ok(p.locator('.ms-steps li').count()==1,'one manual worked step');p.locator('[data-ms-action=step-next][data-ms-card="0"]').tap();p.locator('[data-ms-action=step-next][data-ms-card="0"]').tap();h.ok(p.locator('.ms-steps li').count()==3 and p.evaluate('document.activeElement.dataset.msAction')=='step-prev','last teaching step keeps usable focus');h.ok(h.book(p)==before and p.evaluate('marketWrites')==writes,'teaching is presentation-only');drawer(p,'teaching',False);layout(p);h.ok(len(state(p)['records'])==10,'all ten jobs reachable');p.screenshot(path=str(OUT/f'job-{w}.png'),full_page=True)
  choose(p,'E4');action(p,'next-job');h.ok(state(p)['currentId']=='B1','Next wraps retained collection');h.ok(h.book(p)['syntheticOther']==other,'other game data exact')
  p.evaluate('window.oldMarket=document.querySelector("[data-ms-action=check-job]");location.hash="#notes"');p.locator('#download').wait_for();held=copy.deepcopy(h.book(p));p.evaluate('oldMarket.click()');h.ok(h.book(p)==held,'departed control cannot write');report=h.export_notes(p,'market-'+str(w));h.ok(report['signs']==held['signs'],'actual Notes download exact');p.locator('#progress-file').set_input_files({'name':'synthetic-market.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#words/signs"');ready(p);h.ok(state(p)==report['signs'],'actual Notes import retains frozen source, work and keeps');p.evaluate('oldMarket.click()');h.ok(state(p)==report['signs'],'pre-import callback stays inert')
 finally:c.close()
def edges(browser,base):
 for name in ['historical','full','broken','unknown']:
  seed=fixture(name);c,p=setup(browser,base,seed)
  try:
   if name=='historical':p.locator('[data-ms-choice=c]').tap();action(p,'check-job');h.ok(record(p)['checks'][-1]['outcome']=='fit' and record(p)['source']['prompt']=='An earlier supplied question.','historical own rule and words used');held=copy.deepcopy(state(p));r=h.export_notes(p,'historical-market');h.ok(r['signs']==held,'historical unused feedback downloads exact')
   elif name=='full':h.ok(len(state(p)['prefix']['kept'])==152,'all152 kept pairs present');held=copy.deepcopy(state(p));r=h.export_notes(p,'full-market');h.ok(r['signs']==held,'maximum authored history downloads exact');p.locator('#progress-file').set_input_files({'name':'synthetic-full-market.json','mimeType':'application/json','buffer':json.dumps(r).encode()});p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#words/signs"');ready(p);h.ok(state(p)==held,'maximum authored history imports exact')
   elif name=='broken':raw=copy.deepcopy(state(p));h.ok('earlier sign bench' in p.locator('[data-market-signs-root]').inner_text(),'bad prefix section paused');bench(p,'dictionary');p.locator('[data-ms-target]').select_option('honey');h.ok(state(p)['source']['prefix']==raw['source']['prefix'] and state(p)['records']==raw['records'],'bad section and unknown sibling preserved while book open')
   else:raw=copy.deepcopy(state(p));h.ok('Other places are open.' in p.locator('[data-market-signs-root]').inner_text(),'whole-root recovery points to other places');h.ok(p.locator('[data-ms-action]').count()==0,'unknown root read-only');r=h.export_notes(p,'unknown-market');h.ok(r['signs']==raw,'unknown root downloads exact')
  finally:c.close()
 c,p=setup(browser,base,fixture('seven'))
 try:
  before=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites');drawer(p,'kept');action(p,'kept-next');h.ok(p.evaluate('document.activeElement.dataset.msAction')=='kept-prev','last gallery page leaves usable previous focus');action(p,'kept-prev');h.ok(p.evaluate('document.activeElement.dataset.msAction')=='kept-next','first gallery page leaves usable next focus');h.ok(h.book(p)==before and p.evaluate('marketWrites')==writes,'gallery paging makes no learner record')
 finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  choose(p,'E3');h.ok(p.locator('[data-ms-book=practice][aria-pressed=true]').count()==0 and 'Choose a dictionary page.' in p.locator('.ms-book-paper').inner_text(),'new practice book starts without selecting the answer page');writes=p.evaluate('marketWrites');p.locator('[data-ms-book=practice][data-ms-page=page-1]').tap();h.ok(p.locator('#ms-practice-entry-friend').is_visible() and p.evaluate('marketWrites')==writes,'explicit practice page browsing reveals entries without recording evidence')
 finally:c.close()
 c,p=setup(browser,base,fixture('earlier-only'))
 try:
  before=copy.deepcopy(state(p)['records']['B1']);drawer(p,'help');action(p,'skip');h.ok(state(p)['currentId'] is None and state(p)['records']['B1']==before,'Skip with no next job opens chooser and preserves earlier work');h.ok(p.locator('[data-ms-job=B1]').is_visible(),'earlier job remains selectable')
 finally:c.close()
 c,p=setup(browser,base,fixture('words-unknown'))
 try:
  earlier=copy.deepcopy(h.book(p)['words']);p.evaluate('location.hash="#words"');p.locator('a[href="#words/signs"]').wait_for();p.locator('a[href="#words/signs"]').tap();ready(p);bench(p,'prefix');h.ok(h.book(p)['words']==earlier,'paused Word Garden links here without rewriting old work')
 finally:c.close()
 c,p=setup(browser,base,fixture(),fault=True)
 try:
  bench(p,'prefix');before=copy.deepcopy(h.book(p));p.evaluate('window.marketRefuse=true');p.locator('[data-ms-prefix]').select_option('mis');h.ok(h.book(p)==before and p.locator('[data-ms-prefix]').input_value()=='','refused native selection restores view and state');h.ok('could not be kept' in p.locator('#ms-status').inner_text(),'refusal is focused/explained');r=h.export_notes(p,'refused-market');h.ok(r['signs']==before['signs'],'in-memory Notes confirms refusal exact')
 finally:c.close()
 c,p=setup(browser,base,fixture(),fault=True)
 try:
  bench(p,'prefix');before=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites');p.evaluate('window.marketState.signs.source=structuredClone(window.marketState.signs.source)');p.locator('[data-ms-prefix]').select_option('mis');h.ok(h.book(p)==before and p.evaluate('marketWrites')==writes,'connected control is inert after source replacement');h.ok(p.evaluate('window.marketState.signs.prefix.prefixId') is None,'stale select cannot change replacement source work')
 finally:c.close()
 for fail in [False,True]:
  c,p=setup(browser,base,fixture())
  try:
   bench(p,'prefix')
   if fail:p.evaluate('window.marketFailStorage=true')
   else:p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#words/signs"');ready(p)
   p.locator('[data-ms-prefix]').select_option('mis');p.locator('[data-ms-part]').select_option('spell');h.ok(p.locator('.ms-painted').inner_text()=='misspell','in-memory sign usable with saving off/failure');h.ok('session' in p.locator('#ms-status').inner_text(),'saving status truthful');r=h.export_notes(p,'memory-market-'+str(fail));h.ok(r['signs']['prefix']['prefixId']=='mis' and r['signs']['prefix']['partId']=='spell','real RAM export retains unsaved sign')
  finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  bench(p,'prefix');p.locator('[data-ms-prefix]').select_option('mis');p.evaluate('window.switchMarket=document.querySelector("[data-ms-part]")');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();ready(p);held=copy.deepcopy(h.book(p));p.evaluate('switchMarket.value="spell";switchMarket.dispatchEvent(new Event("change"))');h.ok(h.book(p)==held and 'signs' not in held,'other explorer and stale native select isolated');p.evaluate('location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');p.evaluate('location.hash="#words/signs"');ready(p);p.evaluate('switchMarket.dispatchEvent(new Event("change"))');h.ok('signs' not in h.book(p),'reset-era callback cannot resurrect work')
 finally:c.close()
def ending_record(p):
 e=state(p)['endings'];return e['records'][e['currentId']]
def ending_pair(p,root,ending,tool):
 p.locator('[data-ms-root]').select_option(root);p.locator('[data-ms-ending]').select_option(ending)
 p.locator('[data-ms-tool="'+tool+'"]').tap()
def import_notes(p,report):
 p.locator('#progress-file').set_input_files({'name':'synthetic-ending-signs.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
 p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
 p.evaluate('location.hash="#words/signs"');ready(p)
def endings_play(browser,base,w,hgt):
 c,p=setup(browser,base,fixture(),w,hgt)
 try:
  bench(p,'practice');h.ok('endings' not in state(p),'practice preview does not allocate ending material')
  choose(p,'B1');p.locator('[data-ms-choice=a]').tap();earlier=copy.deepcopy(record(p));choose(p,'C1');h.ok(state(p)['practiceGroup']=='endings' and state(p)['records']['B1']==earlier,'named ending task preserves earlier group')
  bench(p,'endings');h.ok(p.locator('[data-ms-action=keep-ending]').is_disabled(),'no guessed default tool or letters')
  for selector,key,value,typed in [('[data-ms-root]','rootId','fresh','f'),('[data-ms-ending]','endingId','ly','-')]:
   p.locator(selector).focus();p.keyboard.type(typed);h.ok(state(p)['endings']['draft'][key]==value,'native keyboard select saves '+key);h.ok(p.locator(selector).evaluate('el=>document.activeElement===el'),'keyboard select retains focus '+key)
  p.locator('[data-ms-tool=just-add]').focus();p.keyboard.press('Enter');h.ok(p.locator('[data-ms-tool=just-add]').get_attribute('aria-pressed')=='true' and p.locator('[data-ms-tool=just-add]').evaluate('el=>document.activeElement===el'),'keyboard tool activation saves selection and returns focus');h.ok(p.locator('.ms-bakery .ms-painted').inner_text()=='freshly','keyboard selects and tool produce visible board');action(p,'clear-ending')
  cases=[('fresh','ly','just-add','freshly',True),('happy','ly','just-add','happyly',True),('fresh','ly','drop-e',None,False),('fresh','ous','just-add','freshous',True),('gentle','ly','le-to-ly','gently',True),('dramatic','ly','ic-to-ically','dramatically',True)]
  for root,end,tool,made,keep in cases:
   ending_pair(p,root,end,tool)
   h.ok(p.locator('[data-ms-action=keep-ending]').is_enabled()==keep,'literal tool availability '+root+tool)
   h.ok(p.locator('.ms-bakery .ms-painted').inner_text()==(made or '?'),'visible literal board '+str(made))
   if keep:action(p,'keep-ending')
  h.ok(p.locator('.ms-root-letters').first.inner_text()=='dramatic' and p.locator('.ms-ending-letters').first.inner_text()=='ally','harder tool keeps root and displays all added letters')
  p.screenshot(path=str(OUT/f'ending-board-{w}.png'),full_page=True);kept=copy.deepcopy(state(p)['endings']['kept']);action(p,'keep-ending');h.ok(len(state(p)['endings']['kept'])==len(kept) and 'already' in p.locator('#ms-status').inner_text(),'duplicate triple explained without duplicate evidence')
  action(p,'clear-ending');h.ok(state(p)['endings']['kept']==kept and state(p)['endings']['draft']=={'rootId':None,'endingId':None,'toolId':None},'clear preserves all discoveries')
  drawer(p,'ending-kept');p.locator('[data-ms-action=reopen-ending][data-ms-kept="1"]').tap();h.ok(p.locator('.ms-bakery .ms-painted').inner_text()=='happyly','reopening mismatch retains actual tool rather than correcting it')
  for panel in ['ending-no-root','ending-odd']:
   drawer(p,panel);h.ok(p.locator('[data-ms-panel='+panel+'] dt').count()>0,'read-only exception shelf '+panel)
  held=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites');drawer(p,'ending-story');action(p,'longer');drawer(p,'teaching');p.locator('[data-ms-action=step-next][data-ms-card="0"]').tap();h.ok(h.book(p)==held and p.evaluate('marketWrites')==writes,'story and worked steps produce no evidence')
  layout(p);h.ok(p.locator('[data-speak]').count()==0,'ending practice has no uncommissioned sound');p.screenshot(path=str(OUT/f'endings-{w}.png'),full_page=True)
  p.locator('[data-ms-bench=choose]').tap();h.ok(p.locator('.ms-arrival').is_visible(),'Back opens arrival without erasing ending draft');bench(p,'endings');p.reload(wait_until='networkidle');ready(p);h.ok(state(p)['view']=='endings' and p.locator('.ms-bakery .ms-painted').inner_text()=='happyly','reload preserves bench and literal mismatch')
  bench(p,'practice');h.ok(state(p)['endings']['currentId']=='C1' and p.locator('.ms-guided li').count()==3,'practice resumes C1 with guided steps');h.ok(state(p)['records']['B1']==earlier,'prefix record unchanged through bench and reload')
  for id,key in {'C1':'a','C2':'b','C3':'c','C4':'b','C5':'a','C7':'b'}.items():
   choose(p,id);p.locator('[data-ms-choice='+key+']').focus();p.keyboard.press('Enter');action(p,'check-job');h.ok(ending_record(p)['checks'][-1]['outcome']=='fit','ending supplied answer '+id);action(p,'keep-version')
  choose(p,'B5');p.locator('[data-ms-match=un]').tap();choose(p,'C6');h.ok('prefix' not in p.locator('#ms-match-instruction').inner_text().lower() and p.locator('[data-ms-destination=sure]').is_disabled(),'group change clears selected part and uses ending-specific instruction')
  for part,dest in {'trea':'sure','mea':'sure','pic':'ture','na':'ture','young':'ou','gym':'y'}.items():
   p.locator('[data-ms-match='+part+']').tap();p.locator('[data-ms-destination='+dest+']').tap()
  action(p,'check-job');h.ok(ending_record(p)['checks'][-1]['outcome']=='fit','reusable spelling-family destinations fit complete map');action(p,'keep-version');first=copy.deepcopy(ending_record(p)['firstKept']);p.locator('[data-ms-match=trea]').tap();p.locator('[data-ms-destination=y]').tap();action(p,'check-job');action(p,'keep-version');h.ok(ending_record(p)['checks'][-1]['outcome']=='different' and ending_record(p)['firstKept']==first,'revision keeps original fitting version separately')
  drawer(p,'help');action(p,'hint');h.ok(ending_record(p)['help']['hint'] and p.locator('#ms-hint').is_visible(),'ending hint records support before display');layout(p);p.screenshot(path=str(OUT/f'ending-job-{w}.png'),full_page=True)
  choose(p,'C7');action(p,'next-job');h.ok(state(p)['practiceGroup']=='prefix' and state(p)['currentId']=='B1','combined order wraps to original group');choose(p,'C6');pending=copy.deepcopy(state(p));p.evaluate('window.departedEnding=document.querySelector("[data-ms-action=check-job]")');report=h.export_notes(p,'endings-'+str(w));h.ok(report['signs']==pending,'actual Notes carries both practice groups and waiting bench');p.evaluate('departedEnding.click()');h.ok(h.book(p)['signs']==pending,'departed ending button inert');import_notes(p,report);h.ok(state(p)==pending,'actual import preserves both groups and source histories');p.evaluate('departedEnding.click()');h.ok(state(p)==pending,'pre-import ending button remains inert')
 finally:c.close()
def endings_edges(browser,base):
 c,p=setup(browser,base,fixture('ending-full'))
 try:
  held=copy.deepcopy(state(p));h.ok(len(held['endings']['kept'])==121 and len(held['endings']['records'])==7,'maximum combined authored fixture installed');report=h.export_notes(p,'maximum-ending-signs');h.ok(report['signs']==held,'actual pretty Notes download holds full combined history');import_notes(p,report);h.ok(state(p)==held,'maximum combined history imports without trimming')
 finally:c.close()
 for kind in ['hint','draft','kept','section','join']:
  c,p=setup(browser,base,fixture('ending-bad-'+kind))
  try:
   raw=copy.deepcopy(state(p)['endings'])
   if kind!='join':h.ok(p.locator('[data-ms-root]').count()==0,'malformed bench unavailable '+kind)
   else:
    ending_pair(p,'fresh','ly','just-add');h.ok(p.locator('[data-ms-action=keep-ending]').is_disabled() and 'does not match its own tool' in p.locator('#ms-ending-feedback').inner_text(),'retained join disagreement pauses pair instead of displaying two words');raw=copy.deepcopy(state(p)['endings'])
   if kind!='section':choose(p,'C1');p.locator('[data-ms-choice=a]').tap();action(p,'check-job');h.ok(ending_record(p)['checks'][-1]['outcome']=='fit','readable C1 works beside malformed bench '+kind)
   else:choose(p,'B1');p.locator('[data-ms-choice=a]').tap();action(p,'check-job');h.ok(record(p)['checks'][-1]['outcome']=='fit','original group open beside unsupported section')
   if kind!='section':h.ok(state(p)['endings']['source']==raw['source'] and state(p)['endings']['draft']==raw['draft'] and state(p)['endings']['kept']==raw['kept'],'raw malformed material preserved '+kind)
   else:h.ok(state(p)['endings']==raw,'opaque ending section exact after sibling edit')
  finally:c.close()
 for fail in [False,True]:
  c,p=setup(browser,base,fixture())
  try:
   bench(p,'endings')
   if fail:p.evaluate('window.marketFailStorage=true')
   else:p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#words/signs"');ready(p)
   ending_pair(p,'happy','ly','y-to-i');action(p,'keep-ending');h.ok('session' in p.locator('#ms-status').inner_text(),'ending save-off/failure status truthful');report=h.export_notes(p,'ending-memory-'+str(fail));h.ok(report['signs']['endings']['draft']['rootId']=='happy' and len(report['signs']['endings']['kept'])==1,'RAM Notes includes unsaved ending draft and keep')
  finally:c.close()
 c,p=setup(browser,base,fixture(),fault=True)
 try:
  bench(p,'endings');before=copy.deepcopy(h.book(p));p.evaluate('window.marketRefuse=true');p.locator('[data-ms-root]').select_option('happy');h.ok(h.book(p)==before and p.locator('[data-ms-root]').input_value()=='','refused ending edit restores native selection and leaves state exact')
 finally:c.close()
 for alteration in ['source','hidden','film']:
  c,p=setup(browser,base,fixture(),fault=True)
  try:
   bench(p,'endings');before=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites')
   if alteration=='source':p.evaluate('window.marketState.signs.endings.source=structuredClone(window.marketState.signs.endings.source)')
   if alteration=='hidden':p.evaluate('document.querySelector("[data-market-signs-root]").style.display="none"')
   if alteration=='film':p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";d.open=true;document.body.append(d)')
   p.evaluate('const s=document.querySelector("[data-ms-root]");s.value="happy";s.dispatchEvent(new Event("change"))');h.ok(h.book(p)==before and p.evaluate('marketWrites')==writes,'ending callback inert after '+alteration)
  finally:c.close()
 c,p=setup(browser,base,fixture())
 try:
  bench(p,'endings');ending_pair(p,'fresh','ly','just-add');p.evaluate('window.oldEnding=document.querySelector("[data-ms-action=keep-ending]")');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();ready(p);before=copy.deepcopy(h.book(p));p.evaluate('oldEnding.click()');h.ok(h.book(p)==before and 'signs' not in before,'old ending callback cannot write to another explorer');p.evaluate('location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');p.evaluate('location.hash="#words/signs"');ready(p);p.evaluate('oldEnding.click()');h.ok('signs' not in h.book(p),'reset cannot resurrect ending work')
 finally:c.close()
def pattern_fixture(name='base'):
 code="import {signsSeed,fullPatternSignsNotebook} from './test/market-signs-checks.mjs';import * as c from './dist/market-signs-core.mjs';const o={canExport:()=>true};let s=signsSeed();"
 if name=='full':code+='s=fullPatternSignsNotebook();'
 else:
  code+="c.openMarketBench(s,'patterns',o);c.setMarketPattern(s,{caseId:'warm'},o);"
  damage={
   'bad-row':"s.signs.patterns.kept=[{caseId:'missing',familyId:'ball',lettersId:'a',opaque:['keep']}];",
   'bad-kept':"s.signs.patterns.kept={opaque:['keep']};",
   'bad-draft':"s.signs.patterns.drafts.warm={familyId:'missing',lettersId:'ar',opaque:['keep']};",
   'bad-case':"s.signs.patterns.source.cases.find(x=>x.id==='warm').targetLine='OTHER';",
   'bad-copy':"s.signs.patterns.source.story.dictionaryNote=99;s.signs.patterns.source.jobs.find(x=>x.id==='A2').pictureAlt=99;",
   'bad-family':"s.signs.patterns.source.families[0].words=12;",
   'bad-reading':"s.signs.patterns.source.cards[0].text=12;s.signs.patterns.source.meanings[0].sentence=12;s.signs.patterns.source.glossary[0].text=12;",
   'own-copy':"s.signs.patterns.source.story.dictionaryNote='An earlier dictionary note.';s.signs.patterns.source.cases.find(x=>x.id==='warm').pictureId='earlier-picture';s.signs.patterns.source.cases.find(x=>x.id==='warm').pictureAlt='An earlier warm sign picture.';",
   'seven':"for(const l of ['a','o','ar','or','ey','tion']){c.setMarketPattern(s,{familyId:'after-w'},o);c.setMarketPattern(s,{lettersId:l},o);c.keepMarketPatternSign(s,o);}c.setMarketPattern(s,{familyId:'ball'},o);c.keepMarketPatternSign(s,o);"
  }
  code+=damage.get(name,'')
  if name.startswith('collision-'):
   id=name.removeprefix('collision-');code+="const job=s.signs.patterns.source.jobs.find(x=>x.id==='A1');job.id="+json.dumps(id)+";c.openMarketPatternJob(s,"+json.dumps(id)+",o);"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code+'console.log(JSON.stringify(s));'],cwd=ROOT,text=True))
def pattern_state(p):return state(p)['patterns']
def pattern_record(p):
 s=pattern_state(p);return s['records'][s['currentId']]
def pattern_heading(p):
 title=p.locator('#ms-pattern-case-title');box=title.bounding_box();bar=p.locator('.ms-ways').bounding_box();h.ok(box and bar and box['y']>=bar['y']+bar['height']-1 and box['y']+box['height']<=p.viewport_size['height'],'selected case heading visible below measured sticky nav');h.ok(p.evaluate('document.activeElement.id')=='ms-pattern-case-title','selected case heading receives focus')
def pattern_case(p,id):
 drawer(p,'pattern-chooser');p.locator('[data-ms-case="'+id+'"]').tap();pattern_heading(p)
def pattern_button(p,kind,id,keyboard=False):
 e=p.locator('[data-ms-'+kind+'="'+id+'"]')
 if keyboard:e.focus();p.keyboard.press('Enter')
 else:e.tap()
def pattern_pair(p,id,family,letters):
 pattern_case(p,id);pattern_button(p,'family',family);pattern_button(p,'letters',letters)
def viewport_shot(p,name,w):
 p.screenshot(path=str(OUT/f'{name}-{w}-viewport.png'))
def patterns_play(browser,base,w,hgt):
 c,p=setup(browser,base,fixture(),w,hgt)
 try:
  h.ok('signs' not in h.book(p),'Pattern visit allocates nothing');choose(p,'E4');action(p,'next-job');h.ok(state(p)['currentId']=='B1' and 'patterns' not in state(p),'old Next does not allocate Pattern section')
  choose(p,'A1');h.ok(state(p)['practiceGroup']=='patterns' and pattern_state(p)['currentId']=='A1','named A1 first opening selects pattern practice');h.ok([x.inner_text() for x in p.locator('.ms-guided li').all()]==['Honey is in the Monday family: o.','It ends like key: -ey.'],'both A1 supported steps shown first');choose(p,'C1');choose(p,'B1');choose(p,'A1');pointers=(state(p)['currentId'],state(p)['endings']['currentId'],pattern_state(p)['currentId']);h.ok(pointers==('B1','C1','A1'),'three independent practice pointers')
  bench(p,'patterns');h.ok(pattern_state(p)['currentCaseId'] is None and pattern_state(p)['drafts']=={},'bench has no default case or draft');drawer(p,'pattern-chooser');layout(p);viewport_shot(p,'pattern-chooser',w);h.ok(p.locator('[data-ms-case] figure').count()==0,'chooser buttons contain valid phrasing content');h.ok(p.get_by_role('button',name='Steam rises from freshly baked bread. Warm bread',exact=True).count()==1,'picture caption names chooser once without duplicated SVG alternative')
  pattern_case(p,'warm');h.ok(p.get_by_role('img',name='gap',exact=True).is_visible(),'uniform gap has a semantic accessible name');h.ok(p.locator('[data-ms-action=pattern-keep]').is_disabled() and p.locator('[data-ms-family][aria-pressed=true]').count()==0 and p.locator('[data-ms-letters][aria-pressed=true]').count()==0,'case has no default family or letters');pattern_button(p,'letters','ar',True);h.ok(p.locator('.ms-pattern-board .ms-painted').inner_text()=='WARM BREAD' and 'a fitting clue' not in p.locator('#ms-pattern-feedback').inner_text(),'letters alone paint literal board without premature fit lines');h.ok(p.evaluate('document.activeElement.dataset.msLetters')=='ar','native letter Enter retains focus');pattern_button(p,'family','after-w',True);h.ok(p.evaluate('document.activeElement.dataset.msFamily')=='after-w','native family Enter retains focus');h.ok(p.locator('.ms-family-words li').all_text_contents()==['watch','want','swan','war','warm','swarm','word','work','world','worm'],'after-w examples remain flat and ordered')
  action(p,'pattern-keep');pattern_button(p,'letters','or');h.ok(p.locator('.ms-pattern-board .ms-painted').inner_text()=='WORM BREAD' and 'wriggly animal' in p.locator('#ms-pattern-feedback').inner_text(),'warm/worm retains own finite comparison');pattern_button(p,'letters','ey');feedback=p.locator('#ms-pattern-feedback').inner_text();h.ok(p.locator('.ms-pattern-board .ms-painted').inner_text()=='WEYM BREAD' and 'It could tell another story.' in feedback and 'not a word' not in feedback.lower(),'unexpected literal fill has neutral discovery note');action(p,'pattern-keep');kept=copy.deepcopy(pattern_state(p)['kept']);action(p,'pattern-keep');h.ok(pattern_state(p)['kept']==kept and 'already' in p.locator('#ms-status').inner_text(),'unexpected triple kept once');layout(p);viewport_shot(p,'pattern-warm',w);p.screenshot(path=str(OUT/f'pattern-warm-{w}-full.png'),full_page=True)
  action(p,'pattern-next');pattern_heading(p);h.ok(pattern_state(p)['currentCaseId']=='work','Another advances retained cases');pattern_button(p,'family','after-w');pattern_button(p,'letters','or');drafts=copy.deepcopy(pattern_state(p)['drafts']);bench(p,'prefix');bench(p,'patterns');p.reload(wait_until='networkidle');ready(p);h.ok(pattern_state(p)['drafts']==drafts and pattern_state(p)['currentCaseId']=='work','bench switch and reload preserve per-case pending selections');pattern_case(p,'warm');h.ok(p.locator('.ms-pattern-board .ms-painted').inner_text()=='WEYM BREAD','chooser resumes own pending sign');action(p,'pattern-clear');h.ok(pattern_state(p)['kept']==kept and pattern_state(p)['drafts']['warm']=={'familyId':None,'lettersId':None},'clear only current draft');drawer(p,'pattern-kept');p.locator('[data-ms-action=pattern-reopen][data-ms-kept="1"]').tap();pattern_heading(p);h.ok(p.locator('.ms-pattern-board .ms-painted').inner_text()=='WEYM BREAD','shelf reopens literal discovery')
  for id in ['honey','money']:
   for family in ['monday','key']:
    pattern_pair(p,id,family,'o');h.ok('a fitting clue' in p.locator('#ms-pattern-feedback').inner_text(),id+' accepts '+family)
  before=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites');drawer(p,'pattern-meanings');sentences=['Pay here.','I hear the bell.','Two pies.','Me too.','Go to the stall.','A bee in the hive.','Be careful.','A blue sign.','The wind blew.']
  for i,sentence in enumerate(sentences):
   h.ok(sentence in p.locator('#ms-meaning-card').inner_text() and p.locator('#ms-meaning-card figcaption').inner_text(),'meaning sentence and own text alternative '+str(i))
   if i<8:action(p,'meaning-next')
  h.ok(p.locator('[data-ms-action=meaning-next]').is_disabled() and p.locator('[data-ms-action=meaning-prev]').is_enabled(),'meaning last boundary remains usable');layout(p);p.screenshot(path=str(OUT/f'pattern-meaning-{w}-viewport.png'));action(p,'meaning-prev');drawer(p,'pattern-story');action(p,'longer');drawer(p,'teaching');p.locator('[data-ms-action=step-next][data-ms-card="0"]').tap();h.ok(h.book(p)==before and p.evaluate('marketWrites')==writes,'meaning/story/manual teaching presentation writes nothing');drawer(p,'teaching',False);bench(p,'practice');h.ok(pattern_state(p)['currentId']=='A1' and (state(p)['currentId'],state(p)['endings']['currentId'],pattern_state(p)['currentId'])==pointers,'practice resumes active pattern pointer without touching others')
  for id,key in {'A1':'b','A2':'a','A3':'c','A4':'b'}.items():
   choose(p,id);p.locator('[data-ms-choice='+key+']').focus();p.keyboard.press('Enter');action(p,'check-job');h.ok(pattern_record(p)['checks'][-1]['outcome']=='fit','pattern supplied answer '+id);action(p,'keep-version')
  for old,part in [('B5','un'),('C6','trea')]:
   choose(p,old);p.locator('[data-ms-match='+part+']').tap();choose(p,'A5');h.ok(p.locator('[data-ms-destination=a]').is_disabled() and 'gapped sign' in p.locator('#ms-match-instruction').inner_text(),'group change clears matching selection from '+old)
  for part,dest in {'small':'a','monday':'o','money':'o','watch':'a','warm':'ar','work':'or'}.items():p.locator('[data-ms-match='+part+']').tap();p.locator('[data-ms-destination='+dest+']').tap()
  action(p,'check-job');h.ok(pattern_record(p)['checks'][-1]['outcome']=='fit','all six reusable A5 destinations accepted');action(p,'keep-version');first=copy.deepcopy(pattern_record(p)['firstKept']);p.locator('[data-ms-match=warm]').tap();p.locator('[data-ms-destination=o]').tap();action(p,'check-job');action(p,'keep-version');h.ok(pattern_record(p)['checks'][-1]['outcome']=='different' and pattern_record(p)['firstKept']==first,'A5 revisions retain first kept work');drawer(p,'help');action(p,'hint');action(p,'example');h.ok(all(pattern_record(p)['help'][k] for k in ['hint','example']),'pattern supports captured');layout(p);viewport_shot(p,'pattern-job',w);action(p,'next-job');h.ok(state(p)['practiceGroup']=='prefix' and state(p)['currentId']=='B1','A5 wraps combined retained collection to B1')
  bench(p,'patterns');pattern_case(p,'warm');p.evaluate('window.departedPattern=document.querySelector("[data-ms-action=pattern-keep]")');held=copy.deepcopy(state(p));report=h.export_notes(p,'patterns-'+str(w));h.ok(report['signs']==held,'actual Notes exact for three groups and all pending cases');p.evaluate('departedPattern.click()');h.ok(state(p)==held,'departed pattern callback inert');import_notes(p,report);p.evaluate('departedPattern.click()');h.ok(state(p)==held,'pre-import pattern callback inert')
 finally:c.close()
def patterns_edges(browser,base):
 c,p=setup(browser,base,pattern_fixture('full'))
 try:
  held=copy.deepcopy(state(p));h.ok(len(held['patterns']['kept'])==330 and len(held['patterns']['records'])==5 and all(len(r['checks'])==12 and r['count']==16 and all(r['help'][k] for k in ['hint','example']) and 'firstKept' in r and 'latestKept' in r for r in held['patterns']['records'].values()),'max fixture has330triples +5jobs16attempts with12retainedchecks and both supports/versions');report=h.export_notes(p,'maximum-pattern-signs');h.ok(report['signs']==held,'actual pretty Notes maximal raw download exact');import_notes(p,report);h.ok(state(p)==held,'actual maximal Notes import retains prefix/endings/pattern histories')
 finally:c.close()
 for kind in ['bad-row','bad-kept','bad-draft','bad-case','bad-copy','bad-family','bad-reading','own-copy']:
  c,p=setup(browser,base,pattern_fixture(kind))
  try:
   raw=copy.deepcopy(pattern_state(p));
   if kind=='bad-row':
    pattern_button(p,'family','after-w');pattern_button(p,'letters','ar');action(p,'pattern-keep');drawer(p,'pattern-kept');h.ok('cannot be opened here' in p.locator('[data-ms-panel=pattern-kept]').inner_text() and pattern_state(p)['kept'][0]==raw['kept'][0] and len(pattern_state(p)['kept'])==2,'raw bad kept row survives beside editable and keepable case')
   elif kind=='bad-kept':
    pattern_button(p,'family','after-w');pattern_button(p,'letters','ar');h.ok(p.locator('[data-ms-action=pattern-keep]').is_disabled() and p.locator('.ms-pattern-board .ms-painted').inner_text()=='WARM BREAD','bad kept container disables Keep, allows painting');action(p,'pattern-clear');h.ok(pattern_state(p)['kept']==raw['kept'],'bad kept container preserved through Clear')
   elif kind in ['bad-draft','bad-case']:
    h.ok(p.locator('[data-ms-action=pattern-keep]:enabled').count()==0,'paused own case cannot Keep '+kind);pattern_pair(p,'honey','key','o');action(p,'pattern-keep');h.ok(pattern_state(p)['drafts'].get('warm')==raw['drafts'].get('warm') and pattern_state(p)['source']==raw['source'],'paused case/draft preserved beside editable honey '+kind)
   elif kind=='bad-family':
    drawer(p,'pattern-meanings');h.ok('Pay here.' in p.locator('#ms-meaning-card').inner_text(),'meaning shelf open beside paused family bench');action(p,'meaning-next');h.ok('I hear the bell.' in p.locator('#ms-meaning-card').inner_text(),'meaning cards remain usable without bench edits');h.ok(pattern_state(p)['source']==raw['source'],'paused families remain exact')
   elif kind=='bad-reading':
    h.ok('This earlier reading card stays in Notes' in p.locator('[data-market-signs-root]').inner_text(),'paused reading cards have visible notice');drawer(p,'pattern-glossary');h.ok('What a word or sentence tells us.' in p.locator('[data-ms-panel=pattern-glossary]').inner_text(),'readable glossary siblings displayed');drawer(p,'pattern-meanings');h.ok('I hear the bell.' in p.locator('#ms-meaning-card').inner_text(),'readable meaning sibling displayed');h.ok(pattern_state(p)['source']==raw['source'],'bad reading rows not repaired')
   elif kind=='bad-copy':
    pattern_pair(p,'honey','key','o');action(p,'pattern-keep');bench(p,'practice');h.ok(p.locator('[data-ms-action=open-pattern-job][data-ms-job=A1]').count()==1,'readable A1 visible beside broken job');h.ok('A2' not in [x.get_attribute('data-ms-job') for x in p.locator('[data-ms-action=open-pattern-job]').all()],'broken owned job omitted rather than repaired');h.ok(pattern_state(p)['source']==raw['source'],'bad story and job copy preserved')
   else:
    h.ok(p.locator('.ms-pattern-case .ms-pattern-picture figcaption').inner_text()=='An earlier warm sign picture.' and p.locator('.ms-pattern-case .ms-pattern-picture svg').count()==0,'unknown picture uses own visible alt without catalogue repair');drawer(p,'pattern-story');h.ok('An earlier dictionary note.' in p.locator('[data-ms-panel=pattern-story]').inner_text(),'story shows own retained dictionary note')
   choose(p,'A1');p.locator('[data-ms-choice=b]').tap();action(p,'check-job');h.ok(pattern_record(p)['checks'][-1]['outcome']=='fit','A1 remains open beside '+kind);report=h.export_notes(p,'pattern-'+kind);h.ok(report['signs']['patterns']==pattern_state(p),'Notes preserves raw hostile pattern material '+kind)
  finally:c.close()
 for id in ['E1','E3','E4']:
  c,p=setup(browser,base,pattern_fixture('collision-'+id))
  try:h.ok(p.locator('[data-ms-book=practice]').count()==0 and p.locator('.ms-book-paper').count()==0 and p.locator('.ms-guided li').count()==2,'pattern '+id+' cannot activate prefix dictionary')
  finally:c.close()
 c,p=setup(browser,base,pattern_fixture('seven'))
 try:
  before=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites');drawer(p,'pattern-kept');action(p,'kept-next');h.ok(p.evaluate('document.activeElement.dataset.msAction')=='kept-prev','pattern shelf last boundary focus');action(p,'kept-prev');h.ok(p.evaluate('document.activeElement.dataset.msAction')=='kept-next','pattern shelf first boundary focus');h.ok(h.book(p)==before and p.evaluate('marketWrites')==writes,'pattern shelf paging presentation only')
 finally:c.close()
 for fail in [False,True]:
  c,p=setup(browser,base,fixture())
  try:
   bench(p,'patterns');pattern_case(p,'warm')
   if fail:p.evaluate('window.marketFailStorage=true')
   else:p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#words/signs"');ready(p)
   pattern_button(p,'family','after-w');pattern_button(p,'letters','ey');action(p,'pattern-keep');h.ok('session' in p.locator('#ms-status').inner_text(),'pattern save-off/failure truthful status');report=h.export_notes(p,'pattern-memory-'+str(fail));h.ok(report['signs']['patterns']['drafts']['warm']=={'familyId':'after-w','lettersId':'ey'} and len(report['signs']['patterns']['kept'])==1,'actual RAM export holds unsaved pattern discovery')
  finally:c.close()
 c,p=setup(browser,base,fixture(),fault=True)
 try:
  before=copy.deepcopy(h.book(p));p.evaluate('window.marketRefuse=true');p.locator('[data-ms-bench=patterns]').tap();report=h.export_notes(p,'pattern-refused-allocation');h.ok(report['signs']==before.get('signs') if 'signs' in before else 'signs' not in report,'preflight refusal leaves first allocation absent in RAM')
 finally:c.close()
 c,p=setup(browser,base,pattern_fixture(),fault=True)
 try:
  before=copy.deepcopy(h.book(p));p.evaluate('window.marketRefuse=true');pattern_button(p,'family','after-w');h.ok(h.book(p)==before and p.locator('[data-ms-family][aria-pressed=true]').count()==0,'refused native family restores state and view');report=h.export_notes(p,'pattern-refused-selection');h.ok(report['signs']==before['signs'],'RAM Notes confirms refused pattern selection exact')
 finally:c.close()
 for alteration in ['source','case','hidden','film']:
  c,p=setup(browser,base,pattern_fixture(),fault=True)
  try:
   before=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites')
   if alteration=='source':p.evaluate('window.marketState.signs.patterns.source=structuredClone(window.marketState.signs.patterns.source)')
   if alteration=='case':p.evaluate('window.marketState.signs.patterns.currentCaseId="honey"')
   if alteration=='hidden':p.evaluate('document.querySelector("[data-market-signs-root]").style.display="none"')
   if alteration=='film':p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";d.open=true;document.body.append(d)')
   p.evaluate('document.querySelector("[data-ms-family=after-w]").click()');h.ok(h.book(p)==before and p.evaluate('marketWrites')==writes,'connected native pattern button inert after '+alteration)
  finally:c.close()
 c,p=setup(browser,base,pattern_fixture())
 try:
  p.evaluate('window.oldPattern=document.querySelector("[data-ms-family=after-w]")');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();ready(p);before=copy.deepcopy(h.book(p));p.evaluate('oldPattern.click()');h.ok(h.book(p)==before and 'patterns' in state(p) and pattern_state(p)['drafts']['warm']['familyId'] is None,'stale native pattern button cannot write another explorer');p.evaluate('location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');p.evaluate('location.hash="#words/signs"');ready(p);p.evaluate('oldPattern.click()');h.ok('signs' not in h.book(p),'reset-era native pattern button cannot resurrect work')
 finally:c.close()

def crate_fixture(name='base'):
 code="import {signsSeed,fullCrateSignsNotebook} from './test/market-signs-checks.mjs';import * as c from './dist/market-signs-core.mjs';const o={canExport:()=>true};let s=signsSeed();"
 if name=='full':code+='s=fullCrateSignsNotebook();'
 else:
  code+="c.openMarketBench(s,'crates',o);const q=s.signs.crates;"
  damage={
   'complete':"for(const w of q.source.words)q.shelf.placements[w.id]=w.clues[0].trayId;",
   'missing-pointer':"delete q.currentWordId;",'dangling-pointer':"q.currentWordId='earlier-word';",
   'bad-marks-row':"q.shelf.marks.eight={earlier:['marks']};",'bad-marks':"q.shelf.marks=['earlier marks'];",
   'bad-checks':"q.shelf.checks={earlier:['checks']};",'bad-first':"q.shelf.firstKept={earlier:['keep']};",'bad-latest':"q.shelf.latestKept={earlier:['keep']};",
   'opaque-placement':"q.shelf.placements.eight={earlier:['tray']};",
   'bad-help':"q.shelf.help={earlier:['help']};",'bad-helper':"q.source.helpers[0].note=99;",
   'bad-word':"q.source.words[0].sentence=99;",'bad-source':"q.source.trays={earlier:['trays']};",
   'bad-section':"s.signs.crates={v:99,earlier:['crate pages']};",
   'job-first':"delete q.shelf;q.currentWordId=null;c.openMarketCrateJob(s,'D1',o);"
  }
  if name in ['notes-bad-help','notes-bad-placements']:
   code+="c.setMarketCrate(s,{markIndex:1},o);c.setMarketCrate(s,{trayId:'eigh'},o);c.checkMarketCrate(s,o);c.keepMarketCrate(s,o);"
   code+="s.signs.crates.shelf.help={earlier:['help']};" if name=='notes-bad-help' else "s.signs.crates.shelf.placements=['earlier placements'];"
  code+=damage.get(name,'')
  if name.startswith('collision-'):
   ident=name.removeprefix('collision-');code+="const j=q.source.jobs.find(x=>x.id==='D1');j.id="+json.dumps(ident)+";c.openMarketCrateJob(s,"+json.dumps(ident)+",o);"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code+'console.log(JSON.stringify(s));'],cwd=ROOT,text=True))
def crate_state(p):return state(p)['crates']
def crate_record(p):
 q=crate_state(p);return q['records'][q['currentId']]
def crate_heading(p):
 title=p.locator('#ms-crate-word-title');box=title.bounding_box();bar=p.locator('.ms-ways').bounding_box();h.ok(box and bar and box['y']>=bar['y']+bar['height']-1 and box['y']+box['height']<=p.viewport_size['height'],'crate current word visible below measured sticky nav');h.ok(p.evaluate('document.activeElement.id')=='ms-crate-word-title','crate word receives focus after explicit turn')
def crate_word(p,word):p.locator('[data-ms-word]').select_option(word);crate_heading(p)
def crate_place(p,tray,keyboard=False):
 e=p.locator('[data-ms-action=crate-tray][data-ms-tray="'+tray+'"]')
 if keyboard:e.focus();p.keyboard.press('Enter')
 else:e.tap()
def crate_mark(p,index,keyboard=False):
 e=p.locator('[data-ms-action=crate-mark][data-ms-index="'+str(index)+'"]')
 if keyboard:e.focus();p.keyboard.press('Enter')
 else:e.tap()
def crates_play(browser,base,w,hgt):
 c,p=setup(browser,base,fixture(),w,hgt)
 try:
  h.ok('signs' not in h.book(p),'crate arrival allocates no source');choose(p,'D1');h.ok('shelf' not in crate_state(p),'D job allocates collection without shelf');h.ok(p.locator('.ms-guided li').all_text_contents()==['Weight shares letters with eight.','Those letters are eigh.'],'D1 printed guidance precedes choice')
  choose(p,'B1');choose(p,'C1');choose(p,'A1');choose(p,'D1');pointers=(state(p)['currentId'],state(p)['endings']['currentId'],state(p)['patterns']['currentId'],crate_state(p)['currentId']);h.ok(pointers==('B1','C1','A1','D1'),'four independent practice pointers')
  bench(p,'crates');h.ok(crate_state(p)['currentWordId']=='eight' and crate_state(p)['shelf']['placements']=={} and crate_state(p)['shelf']['marks']=={},'explicit bench opens absent shelf at first readable word without default work');crate_heading(p);layout(p);viewport_shot(p,'crate-initial',w)
  h.ok(p.locator('[data-ms-word] option[value=""]').is_disabled(),'selected word picker disables its placeholder');before_empty=copy.deepcopy(h.book(p));empty_status=p.locator('#ms-status').inner_text();p.evaluate('const picker=document.querySelector("[data-ms-word]");picker.value="";picker.dispatchEvent(new Event("change",{bubbles:true}))');h.ok(h.book(p)==before_empty and p.locator('#ms-status').inner_text()==empty_status,'empty native picker change leaves work and status exact')
  turn=p.locator('[data-ms-action=crate-tray][data-ms-tray=eigh]').bounding_box();nav=p.locator('.ms-ways').bounding_box();h.ok(turn and turn['y']>=nav['y']+nav['height']-1 and turn['y']+turn['height']<=hgt,'initial crate marking and placing fit measured viewport')
  crate_mark(p,0,True);h.ok(crate_state(p)['shelf']['marks']['eight']==[0] and p.locator('[data-ms-index="0"]').get_attribute('aria-pressed')=='true','native keyboard mark toggles saved letter');crate_mark(p,0);h.ok(crate_state(p)['shelf']['marks']['eight']==[],'touch toggles same marker off');crate_mark(p,1);crate_place(p,'eigh',True);h.ok(crate_state(p)['currentWordId']=='eight' and p.locator('#ms-crate-feedback').count()==0,'placing does not advance or check');h.ok(p.evaluate('document.activeElement.dataset.msTray')=='eigh','native keyboard tray retains focus')
  action(p,'crate-word-next');crate_heading(p);h.ok(crate_state(p)['currentWordId']=='eighth','Next explicit retained-word turn');action(p,'crate-word-prev');crate_heading(p);h.ok(crate_state(p)['currentWordId']=='eight' and crate_state(p)['shelf']['marks']['eight']==[1],'Previous retains markers and placement');p.reload(wait_until='networkidle');ready(p);h.ok(crate_state(p)['currentWordId']=='eight' and crate_state(p)['shelf']['marks']['eight']==[1],'reload resumes selected word and markers')
  action(p,'crate-check');h.ok(crate_state(p)['shelf']['checks'][-1]['status']=='incomplete','arrangement check explicitly incomplete');action(p,'crate-keep');first=copy.deepcopy(crate_state(p)['shelf']['firstKept']);h.ok(first['check']['status']=='incomplete','incomplete arrangement can be kept')
  crate_word(p,'appear');crate_place(p,'ear');action(p,'crate-check');h.ok(next(r for r in crate_state(p)['shelf']['checks'][-1]['rows'] if r['id']=='appear')['outcome']=='listed','appear ear is a listed clue');crate_place(p,'double');action(p,'crate-check');h.ok(next(r for r in crate_state(p)['shelf']['checks'][-1]['rows'] if r['id']=='appear')['outcome']=='listed','appear double is also a listed clue')
  crate_word(p,'address')
  for index in [1,2,5,6]:crate_mark(p,index)
  readout=p.locator('[data-market-signs-root]').inner_text();h.ok(all(x in readout for x in ['d (2)','d (3)','s (6)','s (7)']),'address repeated letters have position readout');h.ok(p.get_by_role('button',name='Letter d, position 2',exact=True).get_attribute('aria-pressed')=='true','repeated letter button has distinct accessible position');crate_place(p,'eigh');action(p,'crate-check');h.ok(next(r for r in crate_state(p)['shelf']['checks'][-1]['rows'] if r['id']=='address')['outcome']=='discuss','unlisted placement invites discussion');h.ok(p.evaluate('document.activeElement.id')=='ms-crate-feedback','Check focuses arrangement feedback');wordbox=p.locator('#ms-crate-word-title').bounding_box();navbox=p.locator('.ms-ways').bounding_box();h.ok(wordbox['y']>=navbox['y']+navbox['height']-1 and wordbox['y']+wordbox['height']<=hgt,'Check keeps printed word visible below sticky nav');viewport_shot(p,'crate-feedback',w);action(p,'crate-keep');h.ok(crate_state(p)['shelf']['firstKept']==first,'later arrangement preserves first keep');crate_word(p,'address');layout(p);viewport_shot(p,'crate-marked-word',w);p.screenshot(path=str(OUT/f'crate-marked-{w}-full.png'),full_page=True)
  drawer(p,'crate-cards');help_button=p.locator('[data-ms-action=crate-help]').first;helpid=help_button.get_attribute('data-ms-help');help_button.tap();h.ok(helpid in crate_state(p)['shelf']['help'] and p.locator('#ms-crate-help-'+helpid).is_visible(),'reading support recorded before helper/card disclosure');before_reading=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites');p.locator('[data-ms-action=crate-step-next][data-ms-help='+helpid+']').tap();drawer(p,'crate-story');action(p,'longer');drawer(p,'crate-paper');h.ok(h.book(p)==before_reading and p.evaluate('marketWrites')==writes,'later teaching steps and story/paper reading are presentation only');drawer(p,'crate-helpers')
  for helper,word,marked in [('helper-separate','separate','rat'),('helper-business','business','bus'),('helper-island','island','land'),('helper-believe','believe','lie')]:
   p.locator('[data-ms-action=crate-help][data-ms-help='+helper+']').tap();body=p.locator('#ms-crate-help-'+helper);h.ok(body.locator('.ms-crate-helper-word').inner_text()==word and body.locator('mark').all_text_contents()==[marked] and 'not explanations of where words came from' in body.inner_text(),'helper shows visible letter trick and limit '+helper);h.ok(helper in crate_state(p)['shelf']['help'],'own helper support id recorded '+helper)
  marks=copy.deepcopy(crate_state(p)['shelf']['marks']);helpids=copy.deepcopy(crate_state(p)['shelf']['help']);drawer(p,'crate-first');p.locator('[data-ms-action=crate-restore][data-ms-edition=first]').tap();h.ok(crate_state(p)['shelf']['marks']==marks and crate_state(p)['shelf']['help']==helpids and crate_state(p)['currentWordId']=='address','Use these placements leaves raw marks help and pointer exact');restored=copy.deepcopy(crate_state(p)['shelf']['placements']);h.ok(all(restored.get(word['id'])==first['placements'].get(word['id']) for word in crate_state(p)['source']['words']),'Use these placements copies readable placements')
  action(p,'crate-clear-marks');h.ok(crate_state(p)['shelf']['marks']['address']==[] and crate_state(p)['shelf']['placements']==restored,'clear marks leaves trays exact');bench(p,'prefix');bench(p,'crates');h.ok(crate_state(p)['currentWordId']=='address','bench visit retains word pointer');bench(p,'practice');h.ok(crate_state(p)['currentId']=='D1' and (state(p)['currentId'],state(p)['endings']['currentId'],state(p)['patterns']['currentId'],crate_state(p)['currentId'])==pointers,'practice resumes crate group without changing four pointers')
  for ident,key in {'D1':'c','D2':'c','D3':'a','D4':'b'}.items():
   choose(p,ident);p.locator('[data-ms-choice='+key+']').focus();p.keyboard.press('Enter');action(p,'check-job');h.ok(crate_record(p)['checks'][-1]['outcome']=='fit','crate own supplied answer '+ident);action(p,'keep-version');drawer(p,'help');action(p,'hint');action(p,'example');h.ok(all(crate_record(p)['help'][k] for k in ['hint','example']),'D supports captured '+ident)
  action(p,'next-job');h.ok(state(p)['practiceGroup']=='prefix' and state(p)['currentId']=='B1','last D wraps combined retained sources to prefix');bench(p,'crates');p.evaluate('window.departedCrate=document.querySelector("[data-ms-action=crate-mark]")');held=copy.deepcopy(state(p));report=h.export_notes(p,'crate-'+str(w));h.ok(report['signs']==held,'actual Notes download retains all four Market Signs groups');p.evaluate('departedCrate.click()');h.ok(state(p)==held,'departed crate control inert');import_notes(p,report);p.evaluate('departedCrate.click()');h.ok(state(p)==held,'pre-import crate callback inert')
 finally:c.close()
def crates_edges(browser,base):
 for kind in ['notes-bad-help','notes-bad-placements']:
  seed=crate_fixture(kind);c,p=setup(browser,base,seed)
  try:
   before=copy.deepcopy(h.book(p));p.evaluate('location.hash="#notes"');p.locator('#download').wait_for();notes=p.locator('details.panel').filter(has=p.get_by_text('Market Signs: supplied words and kept work',exact=True)).first;notes.locator(':scope > summary').tap();readout=notes.locator('.ms-crate-readout').first;h.ok('Marked letters: i (2).' in readout.inner_text(),'Notes shows readable current markers beside '+kind)
   if kind=='notes-bad-help':h.ok('eigh' in readout.locator('dd').first.inner_text(),'Notes shows readable current placement beside malformed help')
   else:h.ok('This earlier crate choice stays in Notes.' in readout.locator('dd').first.inner_text(),'Notes identifies unavailable current placement beside readable markers')
   summary=seed['signs']['crates']['shelf']['checks'][0]['summary'];h.ok(notes.locator(':scope > p').filter(has_text=summary).count()>0 and notes.locator(':scope > p').filter(has_text='Eight has eigh.').count()>0,'Notes displays readable literal check outside raw JSON beside '+kind)
   for edition in ['first','latest']:
    kept=notes.locator('[data-ms-panel=crate-'+edition+']');kept.locator(':scope > summary').tap();h.ok(kept.is_visible() and 'Marked letters: i (2).' in kept.locator('.ms-crate-readout').inner_text() and kept.locator('p').filter(has_text='Eight has eigh.').count()>0,'Notes displays readable '+edition+' markers and checked placement beside '+kind)
   h.ok(h.book(p)==before,'Notes inspection preserves malformed crate fields '+kind)
  finally:c.close()
 c,p=setup(browser,base,crate_fixture('full'))
 try:
  held=copy.deepcopy(state(p));q=held['crates'];h.ok(len(q['shelf']['placements'])==19 and len(q['shelf']['checks'])==16 and len(q['records'])==4,'max crate fixture has nineteen placements sixteen arrangement checks four jobs');h.ok(all(r['count']==16 and len(r['checks'])==12 and 'firstKept' in r and 'latestKept' in r and all(r['help'][k] for k in ['hint','example']) for r in q['records'].values()),'max crate fixture sixteen attempts twelve retained checks both versions and supports');report=h.export_notes(p,'maximum-crate-signs');h.ok(report['signs']==held,'actual pretty Notes full crate download exact');import_notes(p,report);p.reload(wait_until='networkidle');ready(p);h.ok(state(p)==held,'actual maximum Notes import and reload exact')
 finally:c.close()
 c,p=setup(browser,base,crate_fixture('complete'))
 try:
  action(p,'crate-check');h.ok(crate_state(p)['shelf']['checks'][-1]['status']=='listed','complete authored placements listed');crate_place(p,'ear');action(p,'crate-check');h.ok(crate_state(p)['shelf']['checks'][-1]['status']=='discussion','complete arrangement can invite discussion');action(p,'crate-keep');h.ok(crate_state(p)['shelf']['firstKept']['check']['status']=='discussion','discussion arrangement can be kept')
 finally:c.close()
 for kind in ['missing-pointer','dangling-pointer','bad-marks-row','bad-marks','bad-checks','bad-first','bad-latest','opaque-placement','bad-help','bad-helper','bad-word','bad-source','bad-section']:
  c,p=setup(browser,base,crate_fixture(kind))
  try:
   raw=copy.deepcopy(crate_state(p));h.ok(raw==crate_fixture(kind)['signs']['crates'],'passive crate rendering preserves raw source '+kind)
   if kind in ['missing-pointer','dangling-pointer']:
    h.ok(p.locator('[data-ms-action=crate-mark]').count()==0,'unresolved own word pointer offers picker '+kind);crate_word(p,'address');h.ok(crate_state(p)['currentWordId']=='address','explicit picker repairs only pointer '+kind)
   elif kind in ['bad-marks-row','bad-marks']:
    h.ok(p.locator('[data-ms-action=crate-mark]:enabled').count()==0,'unreadable current marks disable marking '+kind);crate_place(p,'eigh');h.ok(crate_state(p)['shelf']['marks']==raw['shelf']['marks'],'unreadable marks stay raw beside editable tray '+kind)
   elif kind=='opaque-placement':
    h.ok(p.locator('[data-ms-action=crate-tray]:enabled').count()==0,'opaque current placement has no tray writer');crate_mark(p,0);action(p,'crate-word-next');crate_heading(p);h.ok(crate_state(p)['shelf']['placements']['eight']==raw['shelf']['placements']['eight'],'opaque placement survives marking and paging')
   elif kind=='bad-checks':
    h.ok(p.locator('[data-ms-action=crate-check]').is_disabled(),'bad checks disables Check');crate_place(p,'eigh');action(p,'crate-keep');h.ok(crate_state(p)['shelf']['firstKept']['check'] is None and crate_state(p)['shelf']['checks']==raw['shelf']['checks'],'bad checks permits unchecked Keep without repairing checks')
   elif kind=='bad-first':
    crate_place(p,'eigh');action(p,'crate-check');action(p,'crate-keep');h.ok(crate_state(p)['shelf']['firstKept']==raw['shelf']['firstKept'] and 'latestKept' in crate_state(p)['shelf'],'bad first preserved beside valid new latest')
   elif kind=='bad-latest':
    h.ok(p.locator('[data-ms-action=crate-keep]').is_disabled(),'bad latest disables Keep');crate_place(p,'eigh');action(p,'crate-check');h.ok(crate_state(p)['shelf']['latestKept']==raw['shelf']['latestKept'],'bad latest preserved beside arranging and checking')
   elif kind=='bad-help':
    before=copy.deepcopy(h.book(p));drawer(p,'crate-cards');h.ok(p.locator('[data-ms-action=crate-help]').first.is_disabled() and p.locator('[id^=ms-crate-help-]').count()==0 and h.book(p)==before,'bad help cannot disclose unrecorded content or mutate')
   elif kind=='bad-source':
    h.ok(p.locator('[data-ms-action=crate-mark]').count()==0,'unavailable tray source cannot open marking bench')
   choose(p,'B1');p.locator('[data-ms-choice=a]').tap();action(p,'check-job');h.ok(record(p)['checks'][-1]['outcome']=='fit','prefix job remains open beside isolated '+kind);report=h.export_notes(p,'crate-'+kind);h.ok(report['signs']['crates']==crate_state(p),'Notes retains raw isolated crate material '+kind)
  finally:c.close()
 for fail in [False,True]:
  c,p=setup(browser,base,crate_fixture())
  try:
   if fail:p.evaluate('window.marketFailStorage=true')
   else:p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#words/signs"');ready(p)
   crate_mark(p,0);crate_place(p,'eigh');action(p,'crate-keep');h.ok('session' in p.locator('#ms-status').inner_text(),'crate saving off/failure status truthful');report=h.export_notes(p,'crate-memory-'+str(fail));h.ok(report['signs']['crates']['shelf']['marks']['eight']==[0] and report['signs']['crates']['shelf']['placements']['eight']=='eigh','actual RAM Notes retains unsaved crate work')
  finally:c.close()
 c,p=setup(browser,base,fixture(),fault=True)
 try:
  before=copy.deepcopy(h.book(p));p.evaluate('window.marketRefuse=true');p.locator('[data-ms-bench=crates]').tap();report=h.export_notes(p,'crate-refused-allocation');h.ok(report.get('signs')==before.get('signs'),'atomic refused crate allocation stays absent from RAM Notes')
 finally:c.close()
 c,p=setup(browser,base,crate_fixture(),fault=True)
 try:
  before=copy.deepcopy(h.book(p));p.evaluate('window.marketRefuse=true');crate_mark(p,0);h.ok(h.book(p)==before and p.locator('[data-ms-index="0"]').get_attribute('aria-pressed')=='false','refused marker restores native view');drawer(p,'crate-cards');p.locator('[data-ms-action=crate-help]').first.tap();h.ok(h.book(p)==before and p.locator('[id^=ms-crate-help-]').count()==0,'refused support opening leaves shelf exact without disclosure');report=h.export_notes(p,'crate-refused-work');h.ok(report['signs']==before['signs'],'RAM Notes verifies refusal exact')
 finally:c.close()
 for alteration in ['source','word','hidden','inert','film']:
  c,p=setup(browser,base,crate_fixture(),fault=True)
  try:
   before=copy.deepcopy(h.book(p));writes=p.evaluate('marketWrites')
   if alteration=='source':p.evaluate('window.marketState.signs.crates.source=structuredClone(window.marketState.signs.crates.source)')
   if alteration=='word':p.evaluate('window.marketState.signs.crates.currentWordId="appear"')
   if alteration=='hidden':p.evaluate('document.querySelector("[data-market-signs-root]").style.display="none"')
   if alteration=='inert':p.evaluate('document.querySelector("[data-market-signs-root]").inert=true')
   if alteration=='film':p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";d.open=true;document.body.append(d)')
   p.evaluate('document.querySelector("[data-ms-action=crate-mark]").click()');h.ok(h.book(p)==before and p.evaluate('marketWrites')==writes,'connected crate marker inert after '+alteration)
  finally:c.close()
 for ident in ['E1','E3','E4']:
  c,p=setup(browser,base,crate_fixture('collision-'+ident))
  try:h.ok(p.locator('[data-ms-book=practice]').count()==0 and p.locator('.ms-book-paper').count()==0,'crate historical '+ident+' never activates prefix dictionary')
  finally:c.close()
 c,p=setup(browser,base,crate_fixture())
 try:
  p.evaluate('window.oldCrate=document.querySelector("[data-ms-action=crate-mark]")');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();ready(p);held=copy.deepcopy(h.book(p));p.evaluate('oldCrate.click()');h.ok(h.book(p)==held and crate_state(p)['shelf']['marks']=={},'stale crate marker cannot write another explorer');p.evaluate('location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');p.evaluate('location.hash="#words/signs"');ready(p);p.evaluate('oldCrate.click()');h.ok('signs' not in h.book(p),'reset-era crate marker cannot resurrect work')
 finally:c.close()

class Quiet(http.server.SimpleHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
def main():
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('MARKET_SIGNS_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   kwargs={'headless':True,'args':['--disable-quic']};chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
   if Path(chrome).exists():kwargs['executable_path']=chrome
   b=pw.chromium.launch(**kwargs)
   try:
    seed=fixture()
    for w,hgt in [(320,600),(820,1000),(1024,768)]:play(b,base,seed,w,hgt);print('Market Signs viewport',w,'passed',flush=True)
    edges(b,base)
    for w,hgt in [(320,600),(820,1000),(1024,768)]:endings_play(b,base,w,hgt);print('Ending Signs viewport',w,'passed',flush=True)
    endings_edges(b,base)
    for w,hgt in [(320,600),(820,1000),(1024,768)]:patterns_play(b,base,w,hgt);print('Pattern Stall viewport',w,'passed',flush=True)
    patterns_edges(b,base)
    for w,hgt in [(320,600),(820,1000),(1024,768)]:crates_play(b,base,w,hgt);print('Word-List Crate viewport',w,'passed',flush=True)
    crates_edges(b,base);h.ok(not h.errors,'no browser errors '+str(h.errors));result={'status':'passed','checks':h.checks};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(result)
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
