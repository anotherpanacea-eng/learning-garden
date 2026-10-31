"""Synthetic321 touch/keyboard, frozen-source and actual Notes journeys.
Ordinary journeys use the real app; only refusal uses317's existing fault seam.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('WRITING_COHESION_ARTIFACTS',tempfile.mkdtemp(prefix='writing-cohesion-')));OUT.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('writing_legacy',ROOT/'test/writing-table-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h);h.OUT=OUT
IDS=['holding-parcel','holding-unclear','holding-fix','holding-roof','holding-rain','holding-show','holding-short','holding-mill','holding-either']
KEYS={'holding-unclear':'it','holding-fix':'bun','holding-roof':'contrast','holding-rain':'result','holding-show':'addition','holding-short':'short','holding-mill':'mill','holding-either':'either'}
def choose(p,id):
 h.drawer(p,'shelf');p.locator('[data-writing-bench=holding]').tap();p.locator('[data-writing-open="'+id+'"]').tap();p.locator('#writing-task-title').wait_for()
def selected(p):return p.locator('[data-writing-tap][aria-pressed=true]')
def layout(p):
 h.layout(p)
 for e in p.locator('[data-writing-tap]').all():
  r=e.bounding_box();h.ok(r['width']>=43.9 and r['height']>=43.9,'inline word targets44px')
def get_fixtures():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {cohesionFixtures} from './test/writing-cohesion-checks.mjs';console.log(JSON.stringify(cohesionFixtures()));"],cwd=ROOT,text=True))
def play(browser,base,seed,width,height):
 c,p=h.setup(browser,base,seed,width,height)
 try:
  h.ok('writingDesk' not in h.book(p),'arrival creates no new record');choose(p,'holding-parcel');layout(p);h.ok(p.locator('[data-writing-tap]').count()==10,'only ten authored words tappable');h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='incomplete','empty selection is incomplete')
  p.locator('[data-writing-tap=bundle]').focus();p.keyboard.press('Space');h.ok(p.locator('[data-writing-tap=bundle]').get_attribute('aria-pressed')=='true','keyboard toggles inline word');h.ok('sentence 3, tapped' in p.locator('[data-writing-tap=bundle]').get_attribute('aria-label'),'word, sentence and marker accessible name')
  for word in ['it','package','parcel']:p.locator('[data-writing-tap='+word+']').tap()
  h.ok(h.work(p)['work']['taps']==['bundle','it','package','parcel'],'actual tap order retained');h.ok(p.locator('.wt-tap-marker').count()==4,'visible text markers alongside pressed states');h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','reverse tap order fits');h.action(p,'keep');first=copy.deepcopy(h.work(p)['firstKept'])
  p.locator('[data-writing-tap=bridge]').tap();h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different' and 'The bridge is where Pip found it.' in p.locator('#writing-feedback').inner_text(),'extra-word feedback specific without resetting taps');h.ok(h.work(p)['work']['taps']==['bundle','it','package','parcel','bridge'],'check leaves selection intact');h.action(p,'keep');h.ok(h.work(p)['firstKept']==first,'first kept version exact')
  before=copy.deepcopy(h.book(p));writes=p.evaluate('writingWrites');h.drawer(p,'teaching');h.ok(p.locator('.wt-teaching-steps li').count()==0,'worked steps initially unrevealed')
  for n in range(1,4):h.action(p,'teaching-next');h.ok(p.locator('.wt-teaching-steps li').count()==n,'one manual teaching step per action')
  h.ok(p.evaluate('document.activeElement.dataset.writingAction')=='teaching-prev','last-step focus remains on usable control');h.ok(h.book(p)==before and p.evaluate('writingWrites')==writes,'teaching stepper writes no learner record')
  h.drawer(p,'teaching',False);p.locator('.wt-work [data-speak]').tap();speech=p.locator('.wt-work [data-speak]').get_attribute('data-speak');draft=''.join(x['text'] for x in h.work(p)['source']['parts']);h.ok(draft in speech,'Hear reads the literal paragraph without inserted marker words');p.screenshot(path=str(OUT/f'taps-{width}.png'),full_page=True)
  h.action(p,'clear-taps');h.ok(selected(p).count()==0 and h.work(p)['work']['taps']==[],'Clear empties current selection');h.ok(h.work(p)['firstKept']==first,'Clear preserves earlier kept snapshot')
  for id in IDS[1:]:
   choose(p,id)
   if id=='holding-unclear':p.locator('[data-writing-tap=it]').tap()
   else:
    if id=='holding-fix':
     p.locator('[data-writing-choice=edge]').tap();h.ok(p.locator('.wt-work > .wt-page-preview').inner_text().endswith('Pip set the bun on the plate. Then it slid off the edge of the table.'),'wrong rewrite shown literally');h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different' and h.work(p)['work']['choice']=='edge','wrong preview never auto-corrected')
    if id in ['holding-short','holding-mill']:
     original=h.work(p)['source']['parts'][0]['text']
     for option in p.locator('[data-writing-choice]').all():
      option.tap();h.ok(original in p.locator('.wt-source').inner_text(),'each shortened choice retains long original');h.ok(p.locator('.wt-work > .wt-page-preview h3').inner_text()=='Your page','shortened choice has its own preview label')
    p.locator('[data-writing-choice='+KEYS[id]+']').focus();p.keyboard.press('Enter')
   h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='fit','independent expected answer '+id);h.action(p,'keep');layout(p)
   if id=='holding-fix':
    expected='Pip set the bun on the plate. Then the bun slid off the table.';h.ok(p.locator('.wt-work > .wt-page-preview').inner_text().endswith(expected),'fix replaces second sentence');p.locator('.wt-work [data-speak]').tap();speech=p.locator('.wt-work [data-speak]').get_attribute('data-speak');h.ok(expected in speech and h.work(p)['source']['parts'][0]['text'] in speech,'Hear includes original and literal rewritten draft for comparison');p.screenshot(path=str(OUT/f'fix-{width}.png'),full_page=True)
   if id in ['holding-short','holding-mill']:
    h.ok(h.work(p)['source']['parts'][0]['text'] in p.locator('.wt-source').inner_text(),'long original stays visible after shortening');h.ok(p.locator('.wt-work > .wt-page-preview').count()==1,'separately labelled chosen preview')
   if id=='holding-mill':h.ok(p.locator('.wt-work > .wt-page-preview').inner_text().endswith('“Where are you going?” “To the mill.”'),'shortened reply shown in its dialogue')
  h.ok(len(h.book(p)['writingDesk']['records'])==9,'nine new records retained');h.action(p,'next');h.ok(h.book(p)['writingDesk']['currentId']=='bakery','Next wraps the whole catalogue');h.choose(p,'b-second');h.action(p,'next');h.ok(h.book(p)['writingDesk']['currentId']=='holding-parcel','Next connects the original fifteen to new bench')
  held=copy.deepcopy(h.book(p)['writingDesk']);p.reload(wait_until='networkidle');h.ready(p);h.ok(h.book(p)['writingDesk']==held and selected(p).count()==0,'reload preserves source, checks and current cleared draft');p.evaluate('window.oldTap=document.querySelector("[data-writing-tap=parcel]");location.hash="#notes"');p.locator('#download').wait_for();before=copy.deepcopy(h.book(p));p.evaluate('oldTap.click()');h.ok(h.book(p)==before,'departed tap cannot mutate notebook')
  report=h.export_notes(p,f'cohesion-{width}');h.ok(report['writingDesk']==held,'real Notes retains tap/choice sources, work and snapshots');p.locator('#progress-file').set_input_files({'name':'synthetic-cohesion.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#desk/writing"');h.ready(p);h.ok(h.book(p)['writingDesk']==held,'actual import reopens exact extended notebook');p.evaluate('oldTap.click()');h.ok(h.book(p)['writingDesk']==held,'old tap stays inert after import')
 finally:c.close()
def edges(browser,base,f):
 c,p=h.setup(browser,base,f['historical'])
 try:
  h.ok('earlierUnused' in h.work(p)['source']['feedback']['different'],'historical unused feedback opens');p.locator('[data-writing-choice=later]').tap();h.action(p,'check');h.ok(h.work(p)['checks'][-1]['outcome']=='different','historical record still checkable');held=copy.deepcopy(h.book(p)['writingDesk']);r=h.export_notes(p,'historical-unused');h.ok(r['writingDesk']==held,'historical source and checks download exact');p.locator('#progress-file').set_input_files({'name':'synthetic-old-writing.json','mimeType':'application/json','buffer':json.dumps(r).encode()});p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#desk/writing"');h.ready(p);h.ok(h.book(p)['writingDesk']==held,'historical extra feedback survives actual import')
 finally:c.close()
 opaque=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {cohesionSeed} from './test/writing-cohesion-checks.mjs';import {openWritingTask} from './dist/writing-table-core.mjs';const s=cohesionSeed();openWritingTask(s,'bakery');s.writingDesk.records.bakery.source.preview={earlier:['opaque']};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 c,p=h.setup(browser,base,opaque)
 try:
  h.ok('Waiting strips' in p.locator('.wt-work > .wt-page-preview').inner_text(),'historical non-choice opaque preview retains ordinary page');p.locator('[data-writing-strip=bread]').tap();p.locator('[data-writing-destination=sale]').tap();h.ok(h.work(p)['work']['placements']['bread']=='sale','opaque preview sort stays editable');held=copy.deepcopy(h.book(p)['writingDesk']);r=h.export_notes(p,'historical-opaque-preview');h.ok(r['writingDesk']==held and r['writingDesk']['records']['bakery']['source']['preview']=={'earlier':['opaque']},'opaque preview survives native Notes download')
 finally:c.close()
 c,p=h.setup(browser,base,f['full'])
 try:
  h.ok(len(h.book(p)['writingDesk']['records'])==24,'all24 histories open in native app');held=copy.deepcopy(h.book(p)['writingDesk']);r=h.export_notes(p,'all24-max-history');h.ok(r['writingDesk']==held,'maximum retained24-task notebook downloads exact');p.locator('#progress-file').set_input_files({'name':'synthetic24.json','mimeType':'application/json','buffer':json.dumps(r).encode()});p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();p.evaluate('location.hash="#desk/writing"');h.ready(p);h.ok(h.book(p)['writingDesk']==held,'all24 maximum histories import exact')
 finally:c.close()
 c,p=h.setup(browser,base,f['bad'])
 try:
  raw=copy.deepcopy(h.book(p)['writingDesk']['records']['future-source']);p.locator('[data-writing-tap=it]').tap();h.ok(h.book(p)['writingDesk']['records']['future-source']==raw,'unknown sibling kind stays exact while tap work changes');p.evaluate('window.resetTap=document.querySelector("[data-writing-tap=parcel]");location.hash="#notes"');p.locator('#reset').tap();p.locator('#confirm-reset').tap();p.wait_for_function('location.hash==="#home"');p.evaluate('location.hash="#desk/writing"');h.ready(p);p.evaluate('resetTap.click()');h.ok('writingDesk' not in h.book(p),'reset-era tap cannot resurrect old notebook')
 finally:c.close()
 c,p=h.setup(browser,base,f['fresh'],fault=True)
 try:
  choose(p,'holding-parcel');held=copy.deepcopy(h.book(p)['writingDesk']);p.evaluate('window.writingRefuse=true');p.locator('[data-writing-tap=parcel]').tap();h.ok(selected(p).count()==0 and h.book(p)['writingDesk']==held,'refused tap changes neither view nor persisted work');h.ok('could not be kept' in p.locator('#writing-status').inner_text(),'refusal gives recovery direction');r=h.export_notes(p,'refused-tap');h.ok(r['writingDesk']==held,'actual in-memory export proves refusal retained work')
 finally:c.close()
 for failing in [False,True]:
  c,p=h.setup(browser,base,f['fresh'])
  try:
   choose(p,'holding-parcel')
   if failing:p.evaluate('window.writingFailStorage=true')
   else:p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="#desk/writing"');h.ready(p)
   p.locator('[data-writing-tap=parcel]').tap();h.ok(selected(p).count()==1,'in-memory tap usable with saving off/failure');h.ok('session' in p.locator('#writing-status').inner_text(),'save status is truthful');r=h.export_notes(p,'memory-'+str(failing));h.ok(r['writingDesk']['records']['holding-parcel']['work']['taps']==['parcel'],'real download retains in-memory tap')
  finally:c.close()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
def main():
 f=get_fixtures();server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('WRITING_COHESION_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   kwargs={'headless':True,'args':['--disable-quic']};chrome=os.environ.get('CHROME_PATH');mac='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
   if chrome or Path(mac).exists():kwargs['executable_path']=chrome or mac
   b=pw.chromium.launch(**kwargs)
   try:
    for w,hgt in [(320,600),(820,1000),(1024,768)]:play(b,base,f['fresh'],w,hgt);print('cohesion viewport',w,'passed',flush=True)
    edges(b,base,f);h.ok(not h.errors,'no browser errors '+str(h.errors));r={'status':'passed','checks':h.checks,'base':base};(OUT/'receipt.json').write_text(json.dumps(r,indent=2));print(json.dumps(r))
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
