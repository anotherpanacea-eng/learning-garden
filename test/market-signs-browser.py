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
 task=p.locator('#ms-task').bounding_box();bar=p.locator('.ms-ways').bounding_box();h.ok(task['y']>=bar['y']+bar['height']-1,'new turn heading visible below sticky bench tabs')
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
    endings_edges(b,base);h.ok(not h.errors,'no browser errors '+str(h.errors));result={'status':'passed','checks':h.checks};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(result)
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
