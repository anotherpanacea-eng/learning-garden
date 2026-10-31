"""Synthetic native Writing Table app journeys; no real learner data.
WRITING_TABLE_TEST_URL selects a verified deployed build. Only refusal contexts
intercept the app's canExport seam; ordinary journeys use the unmodified app.
Physical iPad/Safari, audible speech, VoiceOver and learning effects unqualified.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('WRITING_TABLE_ARTIFACTS',tempfile.mkdtemp(prefix='writing-table-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(value,message):
 global checks
 assert value,message
 checks+=1
def book(p):return p.evaluate('()=>{const r=JSON.parse(localStorage.getItem("learning-garden-explorers"));return JSON.parse(localStorage.getItem("number-garden-v1:"+r.activeId));}')
def work(p):
 r=book(p)['writingDesk'];return r['records'][r['currentId']]
def action(p,name):p.locator('[data-writing-action="'+name+'"]:visible').tap()
def drawer(p,name,opened=True):
 d=p.locator('[data-writing-panel="'+name+'"]')
 if (d.get_attribute('open') is not None)!=opened:d.locator('summary').tap()
def choose(p,id):
 drawer(p,'shelf');p.locator('[data-writing-bench="'+('linking' if id.startswith(('join-','b-')) else 'paragraphs')+'"]').tap();p.locator('[data-writing-open="'+id+'"]').tap()
def ready(p):
 p.locator('[data-writing-root],[data-select-explorer="explorer-1"]').first.wait_for()
 if p.locator('[data-select-explorer="explorer-1"]').count():p.locator('[data-select-explorer="explorer-1"]').tap()
 p.locator('[data-writing-root]').wait_for()
def setup(browser,base,seed,width=820,height=1000,fault=False):
 ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-30T12:00:00.000Z'},{'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-10-30T12:00:00.000Z'}]}
 ctx.add_init_script('(d=>{if(!localStorage.getItem("writing-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem("number-garden-v1:"+e.id,JSON.stringify(d.seed));localStorage.setItem("writing-fixture","1");}window.writingWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.writingFailStorage)throw new Error("synthetic storage failure");if(k.startsWith("number-garden")||k==="learning-garden-explorers")window.writingWrites++;return set.call(this,k,v);};})('+json.dumps({'registry':registry,'seed':seed})+')')
 if fault:
  def intercept(route):
   response=route.fetch();body=response.text();start=body.index('bindWriting(state,{');end=body.index('});bindSpeech();',start);section=body[start:end];assert 'canExport:candidate=>' in section
   route.fulfill(response=response,body=body[:start]+section.replace('canExport:candidate=>','canExport:candidate=>!window.writingRefuse&&')+body[end:])
  ctx.route('**/app.mjs',intercept)
 p=ctx.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);p.on('response',lambda r:errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None);p.goto(base+'#desk/writing',wait_until='networkidle');ready(p);return ctx,p
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 for el in p.locator('.wt-room button:visible,.wt-room a:visible,.wt-room summary:visible').all():
  box=el.bounding_box();ok(box and box['height']>=43.9,'44px target '+el.inner_text()[:45])
def export_notes(p,label):
 p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
 with p.expect_download() as d:p.locator('#download').tap()
 path=OUT/(label+'.json');d.value.save_as(str(path));return json.loads(path.read_text())
def journey(browser,base,seed,width,height):
 ctx,p=setup(browser,base,seed,width,height)
 try:
  ok('writingDesk' not in book(p),'arrival never creates work');action(p,'start');ok(p.locator('[data-writing-strip]').count()==9,'actual nine-strip sort');layout(p)
  if width>=820:
   boxes=p.locator('.wt-work > .wt-page-preview h4').evaluate_all('xs=>xs.slice(0,3).map(x=>({x:x.getBoundingClientRect().x,y:x.getBoundingClientRect().y}))');ok(max(x['y'] for x in boxes)-min(x['y'] for x in boxes)<1 and boxes[0]['x']<boxes[1]['x']<boxes[2]['x'],'actual tablet trays sit side by side')
  action(p,'check');ok(work(p)['checks'][0]['outcome']=='incomplete','empty sort distinct from different');action(p,'keep');first=work(p)['firstKept'];first_check=work(p)['checks'][0]
  p.locator('[data-writing-strip=bread]').tap();p.locator('[data-writing-destination=times]').tap();ok(work(p)['work']['placements']['bread']=='times','wrong move is literal');action(p,'check');p.locator('[data-writing-strip-notes] summary').tap();ok('Opening times' in p.locator('#writing-feedback').inner_text() and "What's for sale" in p.locator('#writing-feedback').inner_text(),'specific strip explanation');p.screenshot(path=str(OUT/f'sort-{width}.png'),full_page=True)
  mapping={'blue-door':'finding','opens':'times','bread':'sale','sunday':'times','buns':'sale','square':'finding','crusts':'sale','smell':'finding','closes':'times'}
  for strip,heading in mapping.items():p.locator('[data-writing-strip="'+strip+'"]').tap();p.locator('[data-writing-destination="'+heading+'"]').tap()
  drawer(p,'help');action(p,'hint');action(p,'example');action(p,'together');action(p,'check');ok(work(p)['checks'][-1]['outcome']=='fit','all related sentences grouped');ok(all(work(p)['checks'][-1][k] is True for k in ['supported','guided']),'every fit remains supported/guided');ok(all(work(p)['help'][k] for k in ['hint','example','together']),'actual help context captured');action(p,'keep');ok(work(p)['firstKept']==first and work(p)['checks'][0]==first_check,'first kept/check exact after revision')
  before=book(p);writes=p.evaluate('writingWrites');p.evaluate('window.writingControl=document.querySelector("[data-writing-strip=bread]")');drawer(p,'teaching');drawer(p,'teaching',False);ok(book(p)==before and p.evaluate('writingWrites')==writes and p.evaluate('writingControl===document.querySelector("[data-writing-strip=bread]")'),'native details do not write or replace controls')
  choose(p,'market-day');p.locator('[data-writing-move=dawn][data-writing-direction="-1"]').tap();ok(p.locator('.wt-order li').first.inner_text().startswith('At dawn'),'actual chronological order');ok(p.evaluate('document.activeElement.matches("[data-writing-move=dawn]:not(:disabled)")'),'moved paragraph focus at boundary');action(p,'check');ok(work(p)['checks'][-1]['outcome']=='fit','chronology fits');p.locator('[data-writing-move=dawn][data-writing-direction="1"]').focus();p.keyboard.press('Enter');ok(p.evaluate("document.activeElement.matches('[data-writing-move=dawn][data-writing-direction=\"1\"]')"),'move-later focus keeps direction away from boundary');p.keyboard.press('Enter');ok(p.locator('.wt-order li').last.inner_text().startswith('At dawn'),'second later press advances same paragraph again');p.keyboard.press('Enter');p.keyboard.press('Enter');ok(p.locator('.wt-order li').first.inner_text().startswith('At dawn'),'opposite control remains usable at endpoint');p.screenshot(path=str(OUT/f'order-{width}.png'),full_page=True)
  for id,boundary in [('break-noon','noon'),('break-speaker','baker'),('break-topic','post')]:
   choose(p,id);p.locator('[data-writing-boundary="'+boundary+'"]').tap();ok(p.locator('.wt-work > .wt-page-preview>div').count()==2,'actual selected paragraph break');action(p,'check');ok(work(p)['checks'][-1]['outcome']=='fit','stated paragraph change');action(p,'keep');layout(p)
  for id,key in [('join-time','meanwhile'),('join-place','place'),('join-second','second'),('join-last','last'),('a-strip','times'),('a-break','four'),('a-speaker','speaker'),('b-time','meanwhile'),('b-place','place'),('b-second','second')]:
   choose(p,id);ok(p.locator('#writing-task-title').count()==1,'one task per turn');choice=p.locator('[data-writing-choice="'+key+'"]');choice.focus();p.keyboard.press('Enter');action(p,'check');ok(work(p)['checks'][-1]['outcome']=='fit','native keyboard chosen context');action(p,'keep');layout(p)
   if id.startswith('join-'):ok(work(p)['source']['after'] in p.locator('.wt-work > .wt-page-preview').inner_text(),'full following paragraph in preview')
  ok(len(book(p)['writingDesk']['records'])==15,'all fifteen tasks retained');current=book(p)['writingDesk'];p.reload(wait_until='networkidle');ready(p);ok(book(p)['writingDesk']==current,'reload restores exact source/order/checks/versions')
  p.evaluate('window.writingOld=[...document.querySelectorAll("[data-writing-root] button")];window.writingHear=document.querySelector("[data-writing-root] [data-speak]");location.hash="#notes";window.departedHear=writingHear.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));');p.locator('#download').wait_for();ok(p.evaluate('departedHear') is False,'same-tick departed Hear canceled');before=book(p);p.evaluate('writingOld.forEach(e=>e.click())');ok(book(p)==before,'departed nodes cannot mutate');report=export_notes(p,'all-'+str(width));ok(report['writingDesk']==current,'actual Notes download preserves complete table')
  payload={'name':'synthetic-writing.json','mimeType':'application/json','buffer':json.dumps(report).encode()}
  p.locator('#progress-file').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':b'{"not":"a notebook"}'});p.locator('#progress-import-status').filter(has_text='not supported').wait_for();ok(book(p)==before,'invalid import unchanged')
  p.locator('#progress-file').set_input_files(payload);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-cancel').tap();ok(book(p)==before,'valid import cancel unchanged')
  old_id=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');p.locator('#progress-file').set_input_files(payload);p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();ok(p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')!=old_id,'import creates distinct explorer');ok(p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',old_id)==before,'original explorer unchanged')
  p.evaluate('location.hash="#desk/writing"');ready(p);ok(book(p)['writingDesk']==current,'imported draft exactly reopens');p.evaluate('writingOld.forEach(e=>e.click())');ok(book(p)['writingDesk']==current,'old imported controls inert')
  if width==820:
   p.evaluate('window.writingResetOld=[...document.querySelectorAll("[data-writing-root] button")];location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');p.evaluate('location.hash="#desk/writing"');ready(p);ok('writingDesk' not in book(p),'confirmed reset clears active writing notebook');p.evaluate('writingResetOld.forEach(e=>e.click())');ok('writingDesk' not in book(p),'old reset-era controls cannot resurrect work');ok(p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',old_id)==before,'reset leaves original imported-from explorer exact')
   p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();p.locator('[data-writing-root]').wait_for();ok('writingDesk' not in book(p),'second explorer keeps separate initial table');action(p,'start');p.evaluate('window.writingSecondOld=[...document.querySelectorAll("[data-writing-root] button")]');p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-1"]').tap();p.locator('[data-writing-root]').wait_for();ok(book(p)['writingDesk']==current,'original explorer resumes complete table');p.evaluate('writingSecondOld.forEach(e=>e.click())');ok(book(p)['writingDesk']==current,'second explorer stale nodes cannot mutate original')
  print('Writing Table journeys at',width,'passed',flush=True)
 finally:ctx.close()
def refusal(browser,base,seed):
 ctx,p=setup(browser,base,seed,fault=True)
 try:
  action(p,'start');before=book(p);p.evaluate('window.writingRefuse=true');p.locator('[data-writing-strip=bread]').tap();p.locator('[data-writing-destination=sale]').tap();ok(book(p)==before,'refused real material candidate leaves work exact');ok('could not be kept' in p.locator('#writing-status').inner_text(),'material refusal visible')
  for a in ['check','keep','next']:
   action(p,a);ok(book(p)==before,'refused '+a+' leaves notebook exact')
  drawer(p,'help');action(p,'example');ok(book(p)==before and not work(p)['help']['example'],'refused example not exposed or recorded');p.locator('[data-speak]').tap();ok(book(p)==before and not work(p)['help']['narration'],'refused narration prevented')
  p.evaluate('window.writingRefuse=false');p.locator('[data-writing-destination=sale]').tap();ok(work(p)['work']['placements']['bread']=='sale','same controls usable after retry');ok(export_notes(p,'refusal')['writingDesk']==book(p)['writingDesk'],'actual refused/retried notebook export')
 finally:ctx.close()
def storage(browser,base,seed):
 for mode in ['off','failure']:
  ctx,p=setup(browser,base,seed)
  try:
   if mode=='off':p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#desk/writing"');ready(p)
   else:p.evaluate('window.writingFailStorage=true')
   action(p,'start');p.locator('[data-writing-strip=bread]').tap();p.locator('[data-writing-destination=sale]').tap();action(p,'keep');report=export_notes(p,'storage-'+mode);r=report['writingDesk']['records']['bakery'];ok(r['work']['placements']['bread']=='sale' and r['firstKept']['work']==r['work'],'real Notes preserves in-memory work with storage '+mode)
  finally:ctx.close()
def two_tabs(browser,base,seed):
 ctx,older=setup(browser,base,seed)
 try:
  action(older,'start');newer=ctx.new_page();newer.goto(base+'#desk/writing',wait_until='networkidle');ready(newer);choose(newer,'join-last');newer.locator('[data-writing-choice=last]').tap();latest=book(newer);older.locator('[data-writing-strip=bread]').tap();older.locator('[data-writing-destination=sale]').tap();ok(book(older)==latest,'older tab cannot replace newer persisted notebook');newer.close()
 finally:ctx.close()
def fixture(code):return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import * as c from './dist/writing-table-core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};"+code+";console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
def retained(browser,base):
 cases=[('unknown-current',fixture("s.writingDesk={v:1,currentId:'bakery',records:{bakery:{v:77,original:'exact'}}}")),('unknown-root',fixture("s.writingDesk={v:77,original:'exact'}")),('unknown-kept',fixture("c.openWritingTask(s,'bakery');s.writingDesk.records.bakery.firstKept={v:77,original:'exact'};s.writingDesk.records.future={v:77,original:'sibling'}")),('historical',fixture("c.openWritingTask(s,'b-time');s.writingDesk.records['b-time'].source.choices.reverse();s.writingDesk.records['b-time'].source.parts[0].text='An earlier exact report.'"))]
 for name,seed in cases:
  ctx,p=setup(browser,base,seed)
  try:
   original=book(p)['writingDesk']
   if name=='unknown-current':
    ok(not p.locator('[data-writing-action=start]').count(),'unreadable current draft offers no dead bakery button');action(p,'choose');p.locator('[data-writing-open=market-day]').tap();ok(work(p)['source']['id']=='market-day','other draft opens from recovery');ok(book(p)['writingDesk']['records']['bakery']==original['records']['bakery'],'unreadable bakery stays exact')
   elif name=='unknown-root':ok(not p.locator('[data-writing-action]').count(),'unknown root read-only')
   elif name=='unknown-kept':
    action(p,'keep');ok(book(p)['writingDesk']==original,'unknown kept version never overwritten');p.locator('[data-writing-strip=bread]').tap();p.locator('[data-writing-destination=sale]').tap();ok(work(p)['work']['placements']['bread']=='sale','working material remains open beside unknown snapshot')
   else:ok(p.locator('[data-writing-choice]').first.get_attribute('data-writing-choice')=='first','historical option order kept');ok('An earlier exact report.' in p.locator('.wt-source').inner_text(),'historical text kept');p.locator('[data-writing-choice=meanwhile]').tap();action(p,'check');ok(work(p)['checks'][-1]['outcome']=='fit','historical task checked by own rule')
   current=book(p)['writingDesk'];ok(export_notes(p,name)['writingDesk']==current,'actual Notes keeps retained '+name)
  finally:ctx.close()
def main():
 seed=fixture('');seed['syntheticOther']={'v':77,'exact':'other-game'}
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('WRITING_TABLE_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 with sync_playwright() as pw:
  chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');browser=pw.chromium.launch(headless=True,executable_path=chrome if Path(chrome).exists() else None,args=['--disable-quic'])
  try:
   for width,height in [(320,600),(820,1000),(1024,768)]:journey(browser,base,seed,width,height)
   refusal(browser,base,seed);storage(browser,base,seed);two_tabs(browser,base,seed);retained(browser,base);ok(not errors,'no page/console/HTTP errors '+str(errors));result={'status':'passed','checks':checks,'base':base,'scope':'real app controls, Notes transfer, storage, stale actions, retained history and fault-only preflight interception; no physical Apple or audible qualification'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
  finally:browser.close();server.shutdown()
if __name__=='__main__':main()
