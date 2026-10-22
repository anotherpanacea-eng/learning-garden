"""Exercise the real app in isolated Chromium profiles with fictional state.
Requires Node, Python Playwright and Chromium. No production or saved user profile.
Usage: python test/parcel-packing-browser.py [--artifacts /tmp/packing-browser]
"""
import argparse
import functools
import http.server
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import threading
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--artifacts',type=Path)
args=parser.parse_args()
artifacts=args.artifacts or Path(tempfile.mkdtemp(prefix='packing-browser-'))
artifacts.mkdir(parents=True,exist_ok=True)
fixture=json.loads(subprocess.check_output(['node',str(root/'test/parcel-packing-browser-fixture.mjs')],text=True))
class QuietHandler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(root/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
chromium=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')

checks=0

def ok(value,message):
 global checks
 assert value,message
 checks+=1

def saved(page):
 return page.evaluate('JSON.parse(localStorage.getItem("number-garden-v1:explorer-1"))')
def work(page):
 s=saved(page)['parcelPacking'];return s['cases'][s['currentCase']]
def active(page,sel):
 return page.locator(sel).evaluate('(e)=>e===document.activeElement')
def click(page,sel):
 page.locator(sel).first.click()
def tab(page,name):
 click(page,f'.pp-pages [data-pp-page="{name}"]')
def answer(page,kind,text,unit):
 page.locator(f'[data-pp-number="{kind}"]').fill(text)
 page.locator(f'[data-pp-unit="{kind}"]').select_option(unit)
 click(page,f'[data-pp-form="{kind}"] button[type=submit]')
def layout(page):
 ok(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no horizontal overflow')
 ok(page.locator('[data-pp-root] button,[data-pp-root] input,[data-pp-root] select').evaluate_all('(es)=>es.every(e=>e.getBoundingClientRect().height>=44)'), '44px form and button targets')

with sync_playwright() as p:
 b=p.chromium.launch(executable_path=chromium,args=['--no-sandbox'])
 for width,height in [(1440,1000),(768,1024),(390,844)]:
  errors=[];failed=[]
  c=b.new_context(viewport={'width':width,'height':height},has_touch=width<1000,reduced_motion='reduce')
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
  page.goto(base+'/')
  page.evaluate('(s)=>{localStorage.clear();localStorage.setItem("number-garden-v1",JSON.stringify(s));}',fixture)
  page.goto(base+'/#post/packing');page.reload()
  page.locator('[data-pp-case="lantern-seeds"]').wait_for()
  before=saved(page)
  ok('parcelPacking' not in before,'chooser leaves absent root absent')
  ok(page.locator('.learning-connections, .film-dialog').count()==0,'no incoming connection or Bramble film')
  ok(page.locator('[data-pp-case]').count()==4,'all requests open')
  layout(page)
  case=page.locator('[data-pp-case="lantern-seeds"]')
  case.focus();page.keyboard.press('Enter')
  ok(active(page,'#pp-title'),'keyboard case opens with heading focus')
  layout(page)
  ok(page.locator('.pp-bag-button').count()==8,'all numbered spaces shown')
  page.screenshot(path=str(artifacts/f'pack-{width}.png'),full_page=True)
  mat=page.locator('.pp-mat').bounding_box()
  move=page.locator('[data-pp-move="1"]').bounding_box()
  ok(mat['y']+mat['height']<=move['y'] and move['y']-mat['y']<height*0.75,'bag choices and add control fit together without a long scroll')
  # Raw inputs remain the same node; invalid entry can be corrected.
  tab(page,'read')
  raw=page.locator('[data-pp-number="read-full"]');raw.fill('03');raw.evaluate('(e)=>{window.qaInput=e;e.setSelectionRange(1,1)}');page.keyboard.type('-')
  ok(raw.input_value()=='0-3','raw numeric draft preserved')
  ok(raw.evaluate('(e)=>e===window.qaInput&&e.selectionStart===2'),'input node and caret retained')
  click(page,'[data-pp-form="read-full"] button[type=submit]')
  ok(active(page,'#pp-error-read-full'),'invalid check focuses its error')
  ok(len(work(page)['checks'])==0,'invalid input creates no attempt')
  page.reload();raw.wait_for()
  ok(raw.input_value()=='0-3' and raw.get_attribute('aria-invalid')=='true','invalid draft and error survive reload')
  raw.fill('0');ok(raw.get_attribute('aria-invalid')=='false','edit clears input error')
  answer(page,'read-full','0','full bags')
  ok(active(page,'#pp-feedback-read-full'),'reading check focuses feedback')
  ok(work(page)['checks'][-1]['assessment']['matches'],'actual empty model reading correct')
  # Pack to capacity with keyboard; self-disabling controls retain useful focus.
  tab(page,'pack')
  for _ in range(5):
   page.locator('[data-pp-move="1"]').focus();page.keyboard.press('Enter')
  ok(page.locator('[data-pp-move="1"]').is_disabled(),'full bag disables add')
  ok(active(page,'[data-pp-move="-1"]'),'disabled add moves focus to return')
  for i,n in [(1,4),(2,4),(3,4)]:
   bag=page.locator(f'[data-pp-bag="{i}"]')
   if width<1000:bag.tap()
   else:bag.click()
   ok(active(page,f'[data-pp-bag="{i}"]'),'bag selection retains focus')
   for _ in range(n):click(page,'[data-pp-move="1"]')
  ok(work(page)['bags']==[5,4,4,4,0,0,0,0],'noncanonical packing built through UI')
  tab(page,'read');answer(page,'read-full','1','full bags');answer(page,'read-loose','0','loose envelopes')
  ok(all(x['assessment']['matches'] for x in work(page)['checks'][-2:]),'readings use actual model not ideal kit count')
  tab(page,'purpose');answer(page,'kits','3','full bags')
  a=work(page)['checks'][-1]['assessment']
  ok(a['matches'] and not a['planReady'],'right kit prediction does not validate partial packing')
  click(page,'[data-pp-purpose="all"]');answer(page,'all','4','loaded trips')
  ok(work(page)['checks'][-1]['assessment']['ready'],'four noncanonical loaded trips accepted')
  tab(page,'keep');click(page,'[data-pp-keep]');ok(active(page,'#pp-kept'),'keep focuses artifact')
  click(page,'[data-pp-seal]');ok(active(page,'#pp-sealed'),'seal focuses ending')
  ok(page.locator('[data-pp-seal]').is_disabled(),'unchanged seal disabled')
  sealed=work(page)['sealed'];kept=work(page)['kept']
  page.screenshot(path=str(artifacts/f'sealed-{width}.png'),full_page=True)
  tab(page,'pack');click(page,'[data-pp-move="-1"]')
  ok(work(page)['sealed']==sealed and work(page)['kept']==kept,'editing preserves snapshots')
  # All four explicit worked-example steps; help never changes actual packing.
  bags=work(page)['bags'];click(page,'[data-pp-help="example"]')
  ok(active(page,'#pp-help'),'help focus')
  for _ in range(3):click(page,'[data-pp-example="1"]')
  ok(page.locator('[data-pp-example="1"]').is_disabled(),'last example step disables next')
  ok(active(page,'[data-pp-example="-1"]'),'last example step retains local focus')
  ok(work(page)['bags']==bags,'separate example preserves actual model')
  ok(work(page)['support']['workedExample'],'worked example recorded as support')
  click(page,'[data-pp-help=""]')
  click(page,'[data-pp-ready]')
  ok(work(page)['support']['together'],'preparation labelled support')
  ok(work(page)['sealed']==sealed and work(page)['kept']==kept,'preparation preserves artifacts')
  ok(active(page,'#pp-status'),'preparation status focus')
  # Switch back to the full-kit purpose and explicitly seal its separate plan.
  tab(page,'purpose');click(page,'[data-pp-purpose="kits"]');click(page,'[data-pp-ready]')
  tab(page,'keep');ok(page.locator('[data-pp-seal]').is_enabled(),'kit preparation becomes ready separately')
  click(page,'[data-pp-seal]');ok(work(page)['sealed']['input']['bags']==[5,5,5,0,0,0,0,0],'kits leave only spares loose')
  # Exact fit prevents the unconditional extra-trip rule.
  click(page,'[data-pp-page="choose"]');click(page,'[data-pp-case="exact-seeds"]')
  click(page,'[data-pp-counted-fill]');ok('Counted together: moved 5' in page.locator('#pp-status').inner_text(),'counted-fill describes actual move')
  click(page,'[data-pp-return-bag]')
  ok(active(page,'[data-pp-move="1"]'),'emptying selected bag moves focus to add')
  click(page,'[data-pp-counted-fill]');click(page,'[data-pp-clear]')
  ok(active(page,'.pp-controls [data-pp-page="read"]'),'clearing the table retains local focus')
  tab(page,'purpose');click(page,'[data-pp-purpose="all"]');click(page,'[data-pp-ready]');answer(page,'all','5','loaded trips')
  a=work(page)['checks'][-1]['assessment'];ok(a['planReady'] and not a['numberMatches'],'extra exact-fit trip rejected separately from physical plan')
  answer(page,'all',' 04 ','loaded trips');tab(page,'keep');click(page,'[data-pp-seal]')
  ok(work(page)['sealed']['input']['answers']['all']['text']==' 04 ','raw accepted answer frozen verbatim')
  layout(page)
  # Both other sizes can prepare and seal, including all eight spaces.
  for case_id in ['bridge-seeds','meadow-seeds']:
   click(page,'[data-pp-page="choose"]');click(page,f'[data-pp-case="{case_id}"]')
   tab(page,'purpose');click(page,'[data-pp-purpose="all"]');click(page,'[data-pp-ready]');tab(page,'keep');click(page,'[data-pp-seal]')
   ok(work(page)['sealed']['assessment']['ready'],case_id+' ready')
  packing_root=saved(page)['parcelPacking'];page.reload();page.locator('[data-pp-root]').wait_for()
  ok(saved(page)['parcelPacking']==packing_root,'all packing data survives reload exactly')
  after=saved(page)
  for key in before:
   if key not in ['exposures','broad']:ok(after[key]==before[key],'waiting state unchanged: '+key)
  for key in before['broad']:
   if key not in ['seenItems','seenVariants','seenFacts']:ok(after['broad'][key]==before['broad'][key],'broad state unchanged: '+key)
  ok(set(before.get('exposures',[]))<=set(after.get('exposures',[])),'existing exposure retained')
  ok({'3x4','1x5','3x5','4x5','3x6','7x4'}<=set(after['exposures']),'visible example and complete bag groups recorded')
  ok(not after['garden'].get('filmsSeen',{}).get('bramble',False),'Bramble film remains unseen')
  ok(page.locator('.learning-connections,.film-dialog').count()==0,'no film/connection after navigation/reload')
  if width==390:
   page.evaluate('''()=>{const key="number-garden-v1:explorer-1",s=JSON.parse(localStorage.getItem(key));s.parcelPacking.cases["meadow-seeds"].bags[0]=-1;localStorage.setItem(key,JSON.stringify(s));}''')
   page.reload();page.locator('[data-pp-recover]').wait_for()
   ok('Keep readable requests and continue' in page.locator('[data-pp-recover]').inner_text(),'recovery offers to keep readable requests')
   click(page,'[data-pp-recover]')
   ok('Return to your familiar draft' in page.locator('[data-pp-case="lantern-seeds"]').inner_text(),'valid request remains available')
   ok('Try either purpose' in page.locator('[data-pp-case="meadow-seeds"]').inner_text(),'bad request is removed from active cases')
   ok(saved(page)['parcelPacking']['recovered']['cases']['meadow-seeds']['bags'][0]==-1,'whole unreadable original remains in notes')
  ok(not errors,'no page errors: '+str(errors));ok(not failed,'no HTTP errors: '+str(failed))
  print(f'{width}px journeys passed, cumulative {checks} assertions',flush=True)
  c.close()
 b.close()
server.shutdown()
server.server_close()
print(f'PASS: {checks} browser assertions; screenshots: {artifacts}')
