"""Synthetic Summary Press native app journey; Chromium emulation only.
Only refusal contexts intercept canExport. No real learner data or audio claim.
"""
import sys
sys.dont_write_bytecode = True
import importlib.util
from pathlib import Path
import functools, http.server, json, os, threading
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = Path('/private/tmp/lg401-native')
OUT.mkdir(parents=True, exist_ok=True)
os.environ['WRITING_TABLE_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('writing_table_browser', ROOT / 'test/writing-table-browser.py')
table = importlib.util.module_from_spec(spec)
spec.loader.exec_module(table)
book, work, action, ready, ok = table.book, table.work, table.action, table.ready, table.ok
def drawer(p,name,opened=True):
 d=p.locator('[data-writing-panel="'+name+'"]')
 if (d.get_attribute('open') is not None)!=opened:d.locator(':scope > summary').tap()
# Reviewed content401 expectations, independent of the live checker's key/accepted packet.
PLACEMENTS = {
 'summary-knock': {'review':'opinion','delay':'keep','purpose':'extra','worry':'extra','motive':'unknown','signal':'keep','rain':'extra','outcome':'keep','refusal':'unknown'},
 'summary-belief': {'folder':'extra','worry':'keep','fact':'unknown','praise':'opinion','frame':'keep','boards':'extra','unseen':'unknown','meeting':'keep'},
 'summary-lantern': {'bench':'extra','guess':'keep','lost':'unknown','storage':'extra','check':'keep','no-outcome':'unknown','ready':'keep','favorite':'opinion'},
}
def turn(p, name): p.locator('[data-writing-summary-turn="'+name+'"]:visible').tap()
def nav(p, name): p.locator('[data-writing-summary-nav="'+name+'"]:visible').tap()
def choose(p, name):
 drawer(p, 'shelf');p.locator('[data-writing-bench=summary]').tap();p.locator('[data-writing-open="'+name+'"]').tap()
def raw(p):
 return p.evaluate('()=>{const r=JSON.parse(localStorage.getItem("learning-garden-explorers"));return localStorage.getItem("number-garden-v1:"+r.activeId)}')
def untouched(p, seed):
 actual=book(p)
 ok(actual['syntheticOther']==seed['syntheticOther'], 'unrelated synthetic root preserved')
 ok(actual['writingDesk']['records']['bakery']==seed['writingDesk']['records']['bakery'], 'ordinary saved draft exact')
def active(p):
 return p.locator('[data-writing-summary-part]:visible').get_attribute('data-writing-summary-part')
def sentence(p, id):
 turn(p, 'choose')
 # Navigate the real visit controls, never mutate view internals.
 for _ in range(12):
  if active(p)==id:return
  next=p.locator('[data-writing-summary-nav=sentence-next]:visible')
  if next.is_disabled():
   while not p.locator('[data-writing-summary-nav=sentence-prev]:visible').is_disabled():nav(p,'sentence-prev')
  else:nav(p,'sentence-next')
 raise AssertionError('sentence not reachable '+id)
def place(p, id, heading):
 sentence(p,id);p.locator('[data-writing-destination="'+heading+'"]:visible').tap()
def fill(p, id):
 for part,heading in PLACEMENTS[id].items():place(p,part,heading)
def inspect(p, part, scope='current'):
 locator=p.locator('[data-writing-reference="'+part+'"][data-writing-reference-scope="'+scope+'"]:visible').first
 locator.tap();p.locator('.wt-source-inspector').wait_for()
 ok(p.locator('.wt-source-inspector [data-writing-line]').count() in [4,7], 'reference opens entire own story')
 ok('story part' in p.locator('.wt-source-inspector').inner_text(), 'source inspector labels story parts')
 action(p,'close-source')
def hear(p):
 p.locator('.wt-work [data-speak]:visible').tap()
 return p.locator('.wt-work [data-speak]:visible').get_attribute('data-speak')
def journey(browser, base, seed):
 ctx,p=table.setup(browser,base,seed)
 try:
  ok(p.locator('.wt-heading [data-writing-action=summary]').inner_text()=='Summary Press','visible named header entry')
  action(p,'summary');ok(work(p)['source']['id']=='summary-knock','header opens first brief explicitly')
  source=work(p)['source'];lines=source['research']['cards'][0]['lines'];saved=raw(p)
  ok(p.locator('[data-writing-summary-story]').count()==1,'one elected whole scene')
  for i,line in enumerate(lines):
   ok(line['text'] in p.locator('[data-writing-summary-story]').inner_text(),'story page preserves whole scene '+line['id'])
   if i<len(lines)-1:nav(p,'story-next')
  whole=p.get_by_text('Whole story',exact=True);whole.tap();p.locator('[data-writing-panel=summary-whole] section').first.wait_for()
  for line in lines:ok(p.get_by_text(line['text'],exact=True).count()>=1,'whole story includes '+line['id'])
  whole.tap();turn(p,'choose');turn(p,'summary');turn(p,'story')
  ok(raw(p)==saved,'story/whole disclosure/turn navigation leaves exact saved bytes')
  # Hear elects the current scene, not later paragraphs or the unopened example.
  nav(p,'story-prev');spoken=hear(p)
  ok(lines[-2]['text'] in spoken and lines[0]['text'] not in spoken and 'Mina carried a blue chair' not in spoken,'Hear contains only elected story scene')
  turn(p,'choose');ok(active(p)=='review','first sentence is active')
  ok(p.locator('[data-writing-summary-part]:visible').count()==1,'chooser has one active sentence')
  table.layout(p)
  boxes=p.locator('.wt-summary-layout > *').evaluate_all('xs=>xs.map(x=>({x:x.getBoundingClientRect().x,y:x.getBoundingClientRect().y}))')
  ok(len(boxes)==2 and boxes[0]['x']<boxes[1]['x'] and abs(boxes[0]['y']-boxes[1]['y'])<2,'tablet chooser and paper sit side by side')
  action(p,'check');ok(work(p)['checks'][-1]['outcome']=='incomplete','waiting sentences check incomplete')
  action(p,'keep');first=work(p)['firstKept'];ok(all(v is None for v in first['work']['placements'].values()),'unfinished version kept')
  sentence(p,'delay');p.locator('[data-writing-destination=extra]:visible').focus();p.keyboard.press('Enter')
  ok(p.evaluate('document.activeElement.matches("[data-writing-destination=extra]")'),'keyboard placement retains live destination focus')
  action(p,'check');drawer(p,'help');action(p,'example')
  ok(work(p)['help']['example'],'example election records support before disclosure')
  spoken=hear(p);ok('Mina carried a blue chair' in spoken and 'Blue describes the chair' not in spoken and 'Mina is wonderful' not in spoken,'Hear excludes later example and comparison frames')
  ok(p.locator('#writing-example').count()==1,'guarded example appears')
  for _ in range(3):nav(p,'example-next')
  for _ in range(3):nav(p,'comparison-next')
  drawer(p,'help',False)
  fill(p,'summary-knock');action(p,'check');ok(work(p)['checks'][-1]['outcome']=='fit','independent short-account placements fit')
  place(p,'purpose','keep');action(p,'check');ok(work(p)['checks'][-1]['outcome']=='fit','optional purpose also accepted in summary')
  action(p,'keep');ok(work(p)['firstKept']==first,'first kept immutable after completed revision')
  latest=work(p)['latestKept'];turn(p,'summary')
  expected=' '.join(x['text'] for x in source['parts'] if x['id'] in ['delay','purpose','signal','outcome'])
  ok(expected in p.locator('.wt-work').inner_text(),'summary paragraph uses prepared source order')
  inspect(p,'delay');p.locator('[data-writing-summary-sentence=purpose]:visible').first.tap()
  ok(active(p)=='purpose','preview sentence selects its chooser card');action(p,'put-back')
  ok(work(p)['work']['placements'].get('purpose') is None,'put back clears only active placement')
  drawer(p,'versions')
  # First snapshot waiting refs and latest retained refs must resolve their own work.
  for scope,part in [('first','delay'),('latest','purpose')]:
   section=p.locator('[data-writing-version="'+scope+'"]')
   for d in section.locator('details').all():
    if d.get_attribute('open') is None:d.locator('summary').first.tap()
   inspect(p,part,scope)
  ok(work(p)['latestKept']==latest,'preview navigation leaves latest kept exact')
  drawer(p,'versions',False)
  choose(p,'summary-belief');fill(p,'summary-belief');action(p,'check')
  ok(work(p)['checks'][-1]['outcome']=='fit' and work(p)['work']['placements']['worry']=='keep','same worry is central for second reader')
  ok(source['parts'][3]['text']==next(x['text'] for x in work(p)['source']['parts'] if x['id']=='worry'),'shared worry sentence unchanged between briefs')
  action(p,'keep');choose(p,'summary-lantern');fill(p,'summary-lantern');action(p,'check')
  ok(work(p)['checks'][-1]['outcome']=='fit','transfer preserves guess, resolution and outcome');place(p,'storage','keep');action(p,'check')
  ok(work(p)['checks'][-1]['outcome']=='fit','optional transfer context accepted');action(p,'keep')
  choose(p,'summary-knock');ok(work(p)['firstKept']==first and work(p)['latestKept']==latest,'reopen retains first/latest across briefs')
  untouched(p,seed);saved=book(p)['writingDesk'];p.reload(wait_until='networkidle');ready(p)
  ok(book(p)['writingDesk']==saved,'reload preserves all three frozen drafts')
  report=table.export_notes(p,'summary-820');ok(report['writingDesk']==saved,'actual Notes download retains drafts and versions')
  old_id=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId');before=book(p)
  p.locator('#progress-file').set_input_files({'name':'synthetic-summary.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
  p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
  ok(p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',old_id)==before,'import leaves original explorer exact')
  p.evaluate('location.hash="#desk/writing"');ready(p);ok(book(p)['writingDesk']==saved,'actual Notes import reopens complete Summary Press')
  table.layout(p);p.screenshot(path=str(OUT/'summary-820.png'),full_page=True)
 finally:ctx.close()
def responsive(browser,base,seed,width,height):
 ctx,p=table.setup(browser,base,seed,width,height)
 try:
  action(p,'summary')
  if width==1024:p.screenshot(path=str(OUT/'summary-1024-story-viewport.png'),full_page=False)
  nav(p,'story-next');turn(p,'choose');place(p,'delay','keep')
  if width==1024:p.screenshot(path=str(OUT/'summary-1024-choose-viewport.png'),full_page=False)
  turn(p,'summary')
  ok('Leena waited with a photograph' in p.locator('.wt-work').inner_text(),'responsive selected summary remains visible')
  p.locator('[data-writing-summary-sentence=delay]:visible').first.tap();ok(active(p)=='delay','responsive preview returns to sentence')
  table.layout(p);p.screenshot(path=str(OUT/('summary-'+str(width)+'.png')),full_page=True)
 finally:ctx.close()
def refusal(browser,base,seed):
 ctx,p=table.setup(browser,base,seed,fault=True)
 try:
  action(p,'summary');turn(p,'choose');sentence(p,'delay');before=book(p);p.evaluate('window.writingRefuse=true')
  p.locator('[data-writing-destination=keep]:visible').tap();ok(book(p)==before,'refused placement preserves exact notebook')
  for name in ['check','keep','next']:action(p,name);ok(book(p)==before,'refused '+name+' preserves notebook')
  drawer(p,'help');action(p,'example');ok(book(p)==before and p.locator('#writing-example').count()==0,'refused example neither recorded nor exposed')
  hear(p);ok(book(p)==before and not work(p)['help']['narration'],'refused Hear adds no support')
  p.evaluate('window.writingRefuse=false');p.locator('[data-writing-destination=keep]:visible').tap()
  ok(work(p)['work']['placements']['delay']=='keep','same controls retry after refusal')
 finally:ctx.close()
def retention(browser,base,seed):
 historical=json.loads(json.dumps(seed))
 extra=table.fixture("c.openWritingTask(s,'summary-knock');s.writingDesk.records['summary-knock'].source.summary.v=77;s.writingDesk.records['summary-knock'].source.parts[0].text='An earlier retained sentence.'")
 historical['writingDesk']=extra['writingDesk'];historical['writingDesk']['records']['bakery']=seed['writingDesk']['records']['bakery']
 ctx,p=table.setup(browser,base,historical)
 try:
  before=book(p);ok('no usable summary guide' in p.locator('.wt-work').inner_text(),'future guide has explicit ordinary fallback')
  ok('An earlier retained sentence.' in p.locator('.wt-work').inner_text(),'historical wording never refreshed from catalogue')
  ok(p.locator('[data-writing-action=check]').is_disabled(),'future summary has no canonical-key check fallback')
  p.locator('[data-writing-strip=review]').tap();p.locator('[data-writing-destination=opinion]').tap();action(p,'keep')
  ok(work(p)['source']==before['writingDesk']['records']['summary-knock']['source'],'arrange and Keep preserve future source packet')
  report=table.export_notes(p,'future-summary');ok(report['writingDesk']==book(p)['writingDesk'],'actual Notes preserves future guide')
 finally:ctx.close()
def lifecycle(browser,base,seed):
 ctx,p=table.setup(browser,base,seed)
 try:
  action(p,'summary');turn(p,'choose');before=book(p)
  p.evaluate('window.oldSummary=document.querySelector("[data-writing-destination=opinion]");const parent=oldSummary.parentElement;oldSummary.remove();parent.append(oldSummary);oldSummary.click()')
  ok(book(p)==before,'removed and reinserted bound action is retired')
  p.reload(wait_until='networkidle');ready(p);turn(p,'summary')
  # Elect waiting group so the reference anchor is genuinely actionable before retirement.
  for d in p.locator('.wt-work details').all():
   if d.get_attribute('open') is None:d.locator('summary').first.tap()
  p.evaluate('window.oldReference=document.querySelector("[data-writing-reference=review][data-writing-reference-scope=current]");const parent=oldReference.parentElement;oldReference.remove();parent.append(oldReference);oldReference.click()')
  ok(p.locator('.wt-source-inspector').count()==0,'removed and reinserted reference cannot elect source')
  p.evaluate('window.oldAnchor=document.querySelector(".wt-heading a");const parent=oldAnchor.parentElement;oldAnchor.remove();parent.append(oldAnchor);oldAnchor.click()')
  ok(p.evaluate('location.hash')=='#desk/writing','removed and reinserted default anchor is retired')
  p.evaluate('window.otherOwnerOld=[...document.querySelectorAll("[data-writing-root] button")]')
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();ready(p);before=book(p)
  p.evaluate('otherOwnerOld.forEach(e=>e.click())');ok(book(p)==before,'earlier owner controls cannot alter another explorer')
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();ready(p)
  p.evaluate('window.ownerOld=[...document.querySelectorAll("[data-writing-root] button")];location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap()
  p.wait_for_function('location.hash==="#home"');p.locator('[data-film-skip]').tap();p.locator('dialog.welcome-film').wait_for(state='detached')
  p.evaluate('location.hash="#desk/writing"');ready(p);p.evaluate('ownerOld.forEach(e=>e.click())')
  ok('writingDesk' not in book(p),'reset-era controls cannot resurrect summary records')
 finally:ctx.close()
def saving_off(browser,base,seed):
 ctx,p=table.setup(browser,base,seed)
 try:
  p.evaluate('location.hash="#notes"');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click()
  p.evaluate('location.hash="#desk/writing"');ready(p);action(p,'summary');place(p,'delay','keep');action(p,'keep')
  ok('in this session. Download Notes before leaving.' in p.locator('#writing-status').inner_text(),'saving-off status remains accurate')
  report=table.export_notes(p,'summary-saving-off');r=report['writingDesk']['records']['summary-knock']
  ok(r['work']['placements']['delay']=='keep' and all(v is None for k,v in r['work']['placements'].items() if k!='delay') and r['firstKept']['work']==r['work'],'saving-off actual export retains in-memory draft')
 finally:ctx.close()
def main():
 seed=table.fixture("c.openWritingTask(s,'bakery');c.setWritingMaterial(s,{strip:'bread',heading:'sale'});c.keepWritingTask(s)")
 seed['syntheticOther']={'v':77,'exact':'unrelated-synthetic-state'}
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 with sync_playwright() as pw:
  chrome=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
  browser=pw.chromium.launch(headless=True,executable_path=chrome if Path(chrome).exists() else None,args=['--disable-quic'])
  try:
   journey(browser,base,seed)
   for width,height in [(320,600),(1024,768)]:responsive(browser,base,seed,width,height)
   refusal(browser,base,seed);retention(browser,base,seed);lifecycle(browser,base,seed);saving_off(browser,base,seed)
   ok(not table.errors,'no page, console or HTTP errors: '+str(table.errors))
   result={'status':'passed','checks':table.checks,'scope':'one full 820 native journey; focused 320/1024, real Notes transfer, future guide, lifecycle, saving off, canExport-only refusal seam; Chromium emulation'}
   (OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
  finally:browser.close();server.shutdown()
if __name__=='__main__':main()
