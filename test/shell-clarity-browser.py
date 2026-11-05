"""Fictional real-app journeys for destructive shell controls and waiting models.

CHROME_PATH selects Chromium. SHELL_FIXTURE_ROOT may point at an unchanged-base
dist archive for compatibility checks. SHELL_ARTIFACTS selects local receipts.
"""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SHELL_ARTIFACTS',tempfile.mkdtemp(prefix='shell-clarity-')));OUT.mkdir(parents=True,exist_ok=True)
program="""
import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startOpenTask} from './dist/plantings.mjs';
const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;
startOpenTask(s,'many-rectangles');s.plantings.openDraft.model={type:'array',rows:2,cols:12,item:'cup'};s.plantings.openDraft.rectangles=[[3,8],[2,12]];
console.log(JSON.stringify(s));
"""
SEED=json.loads(subprocess.check_output(['node','--input-type=module','-e',program],cwd=os.environ.get('SHELL_FIXTURE_ROOT',ROOT),text=True))
PREFIX='number-garden-v1:'
COPY1='number-garden-kept-explorer-1-2026-11-04T12-30-00-000Z'
BACKUP1='number-garden-backup-explorer-1-2026-11-04T12-30-00-000Z'
COPY2='number-garden-kept-explorer-2-2026-11-04T12-30-00-000Z'
checks=0;errors=[]

def ok(value,message):
 global checks
 assert value,message
 checks+=1

def book(p,id='explorer-1'):return p.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',PREFIX+id)
def raw(p,key):return p.evaluate('(k)=>localStorage.getItem(k)',key)
def ax(p,selector):
 session=p.context.new_cdp_session(p);node=session.send('DOM.getDocument')['root']['nodeId'];node=session.send('DOM.querySelector',{'nodeId':node,'selector':selector})['nodeId']
 result=session.send('Accessibility.getPartialAXTree',{'nodeId':node,'fetchRelatives':False})['nodes'][0];session.detach();return result
def fits(p):ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no page overflow '+p.url)
def ready(p,route,selector):
 p.locator('#explorer-header').wait_for(timeout=30000)
 choose=p.locator('[data-select-explorer="explorer-1"]')
 if choose.count():choose.click();p.evaluate('(r)=>location.hash=r',route)
 p.locator(selector).first.wait_for()
def go(p,base,route,selector):
 p.goto(base+route,wait_until='domcontentloaded');ready(p,route,selector)
def setup(browser,base,route,selector,width=1280):
 c=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce')
 profiles=[dict(id='explorer-'+str(i),avatar=a,color='gold',symbol='leaf',createdAt='2026-11-04T12:00:00.000Z') for i,a in [(1,'sky'),(2,'fern'),(3,'sky')]]
 books={}
 for i in range(1,4):
  s=copy.deepcopy(SEED);s['sessions']=i;s['garden']['avatar']=profiles[i-1]['avatar'];books[PREFIX+'explorer-'+str(i)]=json.dumps(s)
 data={'learning-garden-explorers':json.dumps(dict(version=1,activeId='explorer-1',explorers=profiles)),**books,COPY1:'fictional original one',BACKUP1:'fictional backup one',COPY2:'fictional original two','number-garden-v1':'fictional shared original','unrelated':'leave-me'}
 c.add_init_script('(s=>{if(localStorage.getItem("shell-fixture"))return;for(const [k,v] of Object.entries(s))localStorage.setItem(k,v);localStorage.setItem("shell-fixture","1");})('+json.dumps(data)+')')
 p=c.new_page();p.set_default_timeout(12000);p.on('pageerror',lambda e:errors.append(str(e)));go(p,base,route,selector);return c,p

def invitation(browser,base):
 c,p=setup(browser,base,'#wonder/many-rectangles','.open-number-task')
 before=copy.deepcopy(book(p)['plantings']);p.locator('.open-number-task a[href="#home"]').click();p.locator('[data-home-entry]').wait_for()
 ok(book(p)['plantings']==before,'Take a break preserves waiting model and rectangles')
 p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for();ok(book(p)['plantings']==before,'waiting model survives reload')
 go(p,base,'#wonder/estimate-seeds','[data-open-replace]');ok(book(p)['plantings']==before,'opening another invitation does not replace work before consent')
 ok('clears that invitation' in ax(p,'[data-open-replace]').get('description',{}).get('value',''),'replacement has a computed loss warning')
 p.locator('.open-number-replacement a[href="#wonder/many-rectangles"]').click();p.locator('.open-number-task').wait_for();ok(book(p)['plantings']['openDraft']['rectangles']==[[3,8],[2,12]],'return restores actual kept rectangles')
 go(p,base,'#wonder/estimate-seeds','[data-open-replace]');p.locator('[data-open-replace]').click();p.locator('#open-estimate').wait_for();now=book(p)['plantings']
 ok(now['openDraft']['taskId']=='estimate-seeds' and now['openDraft']['event']!=before['openDraft']['event'],'explicit replacement starts only the requested invitation')
 ok(now['openRecords']==before['openRecords'] and now['pending']==before['pending'] and now['plots']==before['plots'],'replacement preserves visit notes, packets and beds')
 p.locator('#open-estimate').fill('22');pending=copy.deepcopy(book(p)['plantings']['openDraft']);p.reload(wait_until='domcontentloaded');ready(p,'#wonder/estimate-seeds','#open-estimate');ok(book(p)['plantings']['openDraft']==pending,'new estimate and invitation reload exactly')
 ok('clear this model' in ax(p,'[data-open-finish="later"]').get('description',{}).get('value',''),'finish has an explicit computed consequence')
 p.locator('[data-open-finish="later"]').click();p.locator('.regrowth-panel').wait_for();after=book(p)['plantings']
 ok(after['openDraft'] is None and after['openRecords'][-1]['response']=='later','Finish for now retains its historical outcome code')
 ok(after['openRecords'][:-1]==before['openRecords'] and len(after['pending'])==len(before['pending'])+1,'finish records one visit and one participation packet')
 c.close()

def copies_and_reset(browser,base,width=1280):
 c,p=setup(browser,base,'#notes','.explorer-notes',width)
 details=p.locator('.explorer-notes details');details.locator('summary').click();rows=p.locator('.kept-copy')
 labels=rows.locator('span').all_text_contents();ok(any('Sky, gold leaf, notebook 1' in x for x in labels) and any('Fern, gold leaf, notebook 2' in x for x in labels),'device-wide copies distinguish owners')
 ok(any('2026-11-04 12:30:00.000 UTC' in x for x in labels),'copy creation time is readable')
 row=rows.filter(has_text='Kept original progress · Fern')
 with p.expect_download() as download:row.locator('[data-download-copy]').click()
 output=OUT/f'kept-{width}.json';download.value.save_as(output);ok(output.read_text()=='fictional original two','download retrieves the selected exact original bytes')
 row.locator('[data-remove-copy]').click();dialog=p.locator('dialog[open]');ok('Fern, gold leaf, notebook 2' in dialog.inner_text(),'remove dialog repeats the selected copy identity')
 dialog.locator('[data-confirm-cancel]').click();ok(raw(p,COPY2)=='fictional original two','cancel preserves selected copy')
 p.locator('#reset').click();dialog=p.locator('dialog[open]');ok('backups and kept original copies' in dialog.inner_text() and 'Download the kept copy' in dialog.inner_text(),'reset names recovery loss and the right export control')
 p.screenshot(path=str(OUT/f'reset-{width}.png'));dialog.locator('#cancel-reset').click();ok(raw(p,COPY1)=='fictional original one' and raw(p,BACKUP1)=='fictional backup one','reset cancel preserves originals and backups')
 fits(p)
 if width==1280:
  other=raw(p,PREFIX+'explorer-2');p.locator('#reset').click();p.locator('#confirm-reset').click();p.locator('[data-home-entry]').wait_for()
  ok(raw(p,COPY1) is None and raw(p,BACKUP1) is None,'confirmed reset removes exactly the warned explorer copies')
  ok(raw(p,COPY2)=='fictional original two' and raw(p,PREFIX+'explorer-2')==other and raw(p,'number-garden-v1')=='fictional shared original','other explorer and earlier shared originals survive reset')
  ok(book(p)['garden']['avatar']=='sky','reset preserves explorer picture as disclosed')
  p.locator('dialog.welcome-film[open] [data-film-skip]').click()
  go(p,base,'#notes','#clear-all-explorers');p.locator('#clear-all-explorers').click();dialog=p.locator('dialog[open]')
  ok(dialog.locator('[data-confirm-do]').inner_text()=='Clear every explorer' and 'Switch to each explorer' in dialog.inner_text(),'whole-device clear names its scope and per-explorer exports')
  dialog.locator('[data-confirm-cancel]').click();ok(raw(p,COPY2)=='fictional original two','cancel whole-device clear preserves remaining originals')
  p.locator('#clear-all-explorers').click();p.locator('[data-confirm-do]').click();p.locator('[data-home-entry]').wait_for()
  ok(raw(p,COPY2) is None and raw(p,'number-garden-v1') is None and raw(p,'unrelated')=='leave-me','confirmed whole-device clear removes warned saves and preserves unrelated storage')
 c.close()

def saving(browser,base):
 c,p=setup(browser,base,'#notes','#remember');p.locator('#remember').click();dialog=p.locator('dialog[open]')
 ok(p.locator('#remember').is_checked() and raw(p,COPY1)=='fictional original one','saving stays on with all originals until confirmation')
 ok('cannot restore removed recovery copies' in dialog.inner_text(),'saving-off warns about irreversible copy loss')
 p.keyboard.press('Escape');p.locator('dialog[open]').wait_for(state='detached');ok(p.locator('#remember').is_checked() and raw(p,COPY2)=='fictional original two','Escape cancels saving-off without losing another explorer copy')
 p.locator('#remember').click();p.locator('[data-confirm-do]').click();p.locator('#remember').wait_for()
 ok(not p.locator('#remember').is_checked() and raw(p,COPY1) is None and raw(p,COPY2) is None,'confirmed saving-off removes warned stored copies')
 p.locator('#remember').check();ok(book(p)['plantings']['openDraft']['rectangles']==[[3,8],[2,12]],'turning saving back on keeps the in-memory working notebook')
 ok(raw(p,COPY1) is None and raw(p,COPY2) is None,'turning saving back on does not pretend to recover removed originals');c.close()

def identities(browser,base):
 c,p=setup(browser,base,'#wonder/estimate-seeds','[data-open-replace]');p.locator('[data-open-replace]').evaluate('(b)=>window.detachedReplacement=b')
 go(p,base,'#companions','[data-avatar="fern"]');before=book(p);ok(p.locator('[data-avatar="fern"]').is_disabled(),'character that would duplicate another explorer is unavailable')
 p.locator('[data-avatar="fern"]').evaluate('(b)=>{b.disabled=false;b.click()}');ok(book(p)==before,'handler rejects a duplicate even if disabled DOM is bypassed')
 p.locator('#explorer-switch').click();one=ax(p,'[data-select-explorer="explorer-1"]')['name']['value'];two=ax(p,'[data-select-explorer="explorer-2"]')['name']['value'];three=ax(p,'[data-select-explorer="explorer-3"]')['name']['value']
 ok('Sky' in one and 'Fern' in two and 'notebook 1' in one and 'notebook 3' in three and one!=three,'both avatar differences and preexisting identical profiles have distinct computed names')
 p.locator('[data-select-explorer="explorer-2"]').click();p.locator('#explorer-header').wait_for();a=book(p);b=book(p,'explorer-2');p.evaluate('window.detachedReplacement.click()');ok(book(p)==a and book(p,'explorer-2')==b,'detached replacement cannot alter either explorer')
 go(p,base,'#notes','#explorer-switch');p.locator('#explorer-switch').click();ok('Keep exploring as before' in p.locator('#explorer-cancel').inner_text(),'picker cancel describes returning to the current activity')
 p.locator('#explorer-cancel').click();p.locator('.explorer-notes').wait_for();ok(p.url.endswith('#notes'),'picker cancel returns to notes as described')
 c.close()

def practice_and_film(browser,base):
 c,p=setup(browser,base,'#practice','#begin-practice');p.locator('#begin-practice').click();p.locator('#answer').wait_for();p.locator('#answer').fill('0');p.locator('#answer-form button').click()
 old=book(p)['practice'];ok('drops its unrecorded answer and tries' in p.locator('.activity').inner_text(),'practice describes what leaving loses')
 p.get_by_role('link',name='Leave this question',exact=True).click();p.locator('[data-home-entry]').wait_for();ok(book(p)['practice']==old,'leaving practice does not invent a recorded response')
 p.locator('.home-options summary').click();p.locator('[data-film-replay="welcome"]').click();film=p.locator('dialog.welcome-film[open]')
 ok(all(word in film.inner_text() for word in ['snail','sparrow','thunder','letter','First Morning']),'film note describes the visual story and counts')
 film.locator('[data-film-skip]').click();c.close()

class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*_args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
def main():
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH'),args=['--disable-quic'])
   try:
    invitation(b,base);copies_and_reset(b,base);saving(b,base);identities(b,base);practice_and_film(b,base);copies_and_reset(b,base,320)
    ok(not errors,'no browser errors '+str(errors));receipt=dict(passed=True,checks=checks,browser=b.version,fixtureRoot=str(os.environ.get('SHELL_FIXTURE_ROOT',ROOT)),scope='Real controls, fictional notebooks; warning-before-replacement, pause/reload, finish outcomes, recovery bytes, canceled/confirmed resets and saving-off, distinct explorers and stale handles')
    (OUT/'RESULT.json').write_text(json.dumps(receipt,indent=2),encoding='utf8');print(json.dumps(receipt))
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
