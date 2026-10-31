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
 code="import {signsSeed,fullSignsNotebook} from './test/market-signs-checks.mjs';import * as c from './dist/market-signs-core.mjs';const o={canExport:()=>true};let s=signsSeed();"
 if name=='full':code+='s=fullSignsNotebook();'
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
def play(browser,base,seed,w,hgt):
 c,p=setup(browser,base,seed,w,hgt)
 try:
  h.ok('signs' not in h.book(p),'direct arrival creates no save');other=copy.deepcopy(h.book(p)['syntheticOther']);h.ok(p.locator('[data-speak]').count()==0,'no speech buttons in adult-read room');bench(p,'prefix');p.locator('[data-ms-prefix]').select_option('mis');p.locator('[data-ms-part]').select_option('spell');h.ok(p.locator('.ms-painted').inner_text()=='misspell','hyphen not joined into word');h.ok(p.locator('.ms-painted mark').count()==2 and 'Both s letters stay.' in p.locator('.ms-prefix-bench').inner_text(),'two letters marked on supplied join');action(p,'keep-sign');first=copy.deepcopy(state(p)['prefix']['kept']);p.locator('[data-ms-prefix]').select_option('re');p.locator('[data-ms-part]').select_option('view');h.ok(p.locator('.ms-painted').inner_text()=='review' and p.locator('.ms-discovery').count()==1,'real unlisted pair remains discovery');h.ok(p.locator('.ms-painted mark').count()==0,'no spelling verdict on discovery');action(p,'keep-sign');prefix=copy.deepcopy(state(p)['prefix']);layout(p);p.screenshot(path=str(OUT/f'sign-{w}.png'),full_page=True)
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
   else:raw=copy.deepcopy(state(p));h.ok(p.locator('[data-ms-action]').count()==0,'unknown root read-only');r=h.export_notes(p,'unknown-market');h.ok(r['signs']==raw,'unknown root downloads exact')
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
class Quiet(http.server.SimpleHTTPRequestHandler):
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
    edges(b,base);h.ok(not h.errors,'no browser errors '+str(h.errors));result={'status':'passed','checks':h.checks};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(result)
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
