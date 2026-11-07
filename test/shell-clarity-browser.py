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
connection_program="""
import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {ensureCafe,nextGuest,adjustBite,checkPlate,submitCafeNumber,skipCafeStage,serveCafe} from './dist/cafe-core.mjs';
import {startPostOffice} from './dist/post-office-core.mjs';import {deliveries} from './dist/post-office-content.mjs';
import {setRivalInput,submitRival,continueRival} from './dist/post-rival.mjs';import {startConnection,connectionAvailability} from './dist/learning-connections.mjs';
const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;ensureCafe(s);startPostOffice(s,deliveries[0].id);nextGuest(s);
s.cafe.current.params.guests=3;s.cafe.current.params.bites=4;s.cafe.current.params.wanted=['warm','crunchy'];for(let i=0;i<4;i++)adjustBite(s,'moon-crunch',1);
if(!checkPlate(s)||!submitCafeNumber(s,12))throw Error('Invalid fictional cafe fixture');skipCafeStage(s);s.cafe.stock['moon-crunch']=180;if(!serveCafe(s)||!startConnection(s,'bramble','cafe'))throw Error('No real connection fixture');
const r=s.postOffice.visits.find(v=>v.id===s.postOffice.current).rival;setRivalInput(s,String(r.task.answer));submitRival(s);if(!continueRival(s))throw Error('No retained source');
const unreadable=structuredClone(s);unreadable.livingExploration={version:999};
const order=structuredClone(s);nextGuest(order);const search=structuredClone(s);if(!startConnection(search,'living','bramble'))throw Error('No waiting search');
const puzzle=structuredClone(s);if(!startConnection(puzzle,'bramble','cafe'))throw Error('No waiting puzzle');
const delivery=structuredClone(s);delivery.postOffice.current=null;
console.log(JSON.stringify({unreadable,order,search,puzzle,delivery}));
"""
CONNECTIONS=json.loads(subprocess.check_output(['node','--input-type=module','-e',connection_program],cwd=os.environ.get('SHELL_FIXTURE_ROOT',ROOT),text=True))
PREFIX='number-garden-v1:'
COPY1='number-garden-kept-explorer-1-2026-11-04T12-30-00-000Z'
BACKUP1='number-garden-backup-explorer-1-2026-11-04T12-30-00-000Z'
COPY2='number-garden-kept-explorer-2-2026-11-04T12-30-00-000Z'
checks=0;errors=[];request_failures=[];console_errors=[];last_page=None

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
def setup(browser,base,route,selector,width=1280,seed=None):
 global last_page
 c=browser.new_context(viewport={'width':width,'height':600 if width==320 else 900},reduced_motion='reduce',color_scheme='dark' if width==320 else 'light')
 profiles=[dict(id='explorer-'+str(i),avatar=a,color='gold',symbol='leaf',createdAt='2026-11-04T12:00:00.000Z') for i,a in [(1,'sky'),(2,'fern'),(3,'sky')]]
 books={}
 for i in range(1,4):
  s=copy.deepcopy(seed or SEED);s['sessions']=i;s['garden']['avatar']=profiles[i-1]['avatar'];books[PREFIX+'explorer-'+str(i)]=json.dumps(s)
 data={'learning-garden-explorers':json.dumps(dict(version=1,activeId='explorer-1',explorers=profiles)),**books,COPY1:'fictional original one',BACKUP1:'fictional backup one',COPY2:'fictional original two','number-garden-v1':'fictional shared original','unrelated':'leave-me'}
 c.add_init_script('(s=>{if(localStorage.getItem("shell-fixture"))return;for(const [k,v] of Object.entries(s))localStorage.setItem(k,v);localStorage.setItem("shell-fixture","1");})('+json.dumps(data)+')')
 p=c.new_page();last_page=p;p.set_default_timeout(12000);p.on('pageerror',lambda e:errors.append(str(e)))
 p.on('requestfailed',lambda r:request_failures.append(dict(url=r.url,error=r.failure)));p.on('console',lambda m:console_errors.append(m.text) if m.type=='error' else None)
 go(p,base,route,selector);return c,p

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
 visible_guide=p.locator('#companion-link span').text_content();ok(ax(p,'#companion-link')['name']['value']==visible_guide+'; change guide','guide link keeps a useful label-compatible name at width '+str(width))
 details=p.locator('.explorer-notes details');details.locator('summary').click();rows=p.locator('.kept-copy')
 labels=rows.locator('span').all_text_contents();ok(any('Sky, gold leaf, notebook 1' in x for x in labels) and any('Fern, gold leaf, notebook 2' in x for x in labels),'device-wide copies distinguish owners')
 ok(any('2026-11-04 12:30:00.000 UTC' in x for x in labels),'copy creation time is readable')
 row=rows.filter(has_text='Kept original progress · Fern')
 p.evaluate('(k)=>{const raw=localStorage.getItem(k);localStorage.removeItem(k);localStorage.setItem(k,raw)}',COPY1)
 with p.expect_download() as download:row.locator('[data-download-copy]').click()
 output=OUT/f'kept-{width}.json';download.value.save_as(output);ok(output.read_text()=='fictional original two','download retrieves the selected exact original bytes')
 row.locator('[data-remove-copy]').click();dialog=p.locator('dialog[open]');ok('Fern, gold leaf, notebook 2' in dialog.inner_text(),'remove dialog repeats the selected copy identity')
 dialog.locator('[data-confirm-cancel]').click();ok(raw(p,COPY2)=='fictional original two','cancel preserves selected copy')
 p.locator('#reset').click();dialog=p.locator('dialog[open]');ok('backups and kept original copies' in dialog.inner_text() and 'Download the kept copy' in dialog.inner_text(),'reset names recovery loss and the right export control')
 ok(dialog.locator('h2').evaluate('(h)=>h===document.activeElement&&h.getBoundingClientRect().top>=0&&h.getBoundingClientRect().bottom<=innerHeight'),'reset begins with its warning heading focused and in view')
 ok(ax(p,'dialog[open]')['name']['value']=='Start with a fresh page?','reset dialog has its own computed name')
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
 ok(dialog.locator('h2').evaluate('(h)=>h===document.activeElement'),'saving-off starts at its warning heading')
 ok(ax(p,'dialog[open]')['name']['value']=='Turn saving off for every explorer?','saving-off dialog names its whole-device scope')
 ok(p.locator('#remember').is_checked() and raw(p,COPY1)=='fictional original one','saving stays on with all originals until confirmation')
 ok('cannot restore removed recovery copies' in dialog.inner_text(),'saving-off warns about irreversible copy loss')
 p.keyboard.press('Escape');p.locator('dialog[open]').wait_for(state='detached');ok(p.locator('#remember').is_checked() and raw(p,COPY2)=='fictional original two','Escape cancels saving-off without losing another explorer copy')
 p.locator('#remember').click();p.locator('[data-confirm-do]').click();p.locator('#remember').wait_for()
 ok(not p.locator('#remember').is_checked() and raw(p,COPY1) is None and raw(p,COPY2) is None,'confirmed saving-off removes warned stored copies')
 p.locator('#remember').check();ok(book(p)['plantings']['openDraft']['rectangles']==[[3,8],[2,12]],'turning saving back on keeps the in-memory working notebook')
 ok(raw(p,COPY1) is None and raw(p,COPY2) is None,'turning saving back on does not pretend to recover removed originals');c.close()

def identities(browser,base):
 c,p=setup(browser,base,'#wonder/estimate-seeds','[data-open-replace]');p.locator('[data-open-replace]').evaluate('(b)=>window.detachedReplacement=b')
 chip=ax(p,'#explorer-switch')['name']['value'];ok(chip.index('Sky')<chip.index('change explorer'),'chip speaks current identity before the change action')
 ok(p.locator('#explorer-switch .sr-only').evaluate('(e)=>getComputedStyle(e).position==="absolute"&&e.getBoundingClientRect().width<=1'),'chip action suffix is visually hidden by the loaded stylesheet')
 go(p,base,'#companions','[data-avatar="fern"]');before=book(p);ok(p.locator('[data-avatar="fern"]').is_disabled(),'character that would duplicate another explorer is unavailable')
 p.locator('[data-avatar="fern"]').evaluate('(b)=>{b.disabled=false;b.click()}');ok(book(p)==before,'handler rejects a duplicate even if disabled DOM is bypassed')
 p.locator('#explorer-switch').click();one=ax(p,'[data-select-explorer="explorer-1"]')['name']['value'];two=ax(p,'[data-select-explorer="explorer-2"]')['name']['value'];three=ax(p,'[data-select-explorer="explorer-3"]')['name']['value']
 ok('Sky' in one and 'Fern' in two and 'notebook 1' in one and 'notebook 3' in three and one!=three,'both avatar differences and preexisting identical profiles have distinct computed names')
 p.locator('[data-select-explorer="explorer-2"]').click();p.locator('#explorer-header').wait_for();a=book(p);b=book(p,'explorer-2');p.evaluate('window.detachedReplacement.click()');ok(book(p)==a and book(p,'explorer-2')==b,'detached replacement cannot alter either explorer')
 go(p,base,'#companions','[data-avatar="reed"]');p.locator('[data-avatar="reed"]').click();registry=json.loads(raw(p,'learning-garden-explorers'))
 ok(book(p,'explorer-2')['garden']['avatar']=='reed' and next(x for x in registry['explorers'] if x['id']=='explorer-2')['avatar']=='reed','an available character updates its own notebook picture')
 ok(book(p)==a,'changing another explorer picture preserves the first notebook')
 go(p,base,'#notes','#explorer-switch');p.locator('#explorer-switch').click();ok('Keep exploring as before' in p.locator('#explorer-cancel').inner_text(),'picker cancel describes returning to the current activity')
 p.locator('#explorer-cancel').click();p.locator('.explorer-notes').wait_for();ok(p.url.endswith('#notes'),'picker cancel returns to notes as described')
 c.close()

def remove_copy(browser,base):
 c,p=setup(browser,base,'#notes','.explorer-notes');p.locator('.explorer-notes details summary').click()
 p.evaluate('(k)=>{const raw=localStorage.getItem(k);localStorage.removeItem(k);localStorage.setItem(k,raw)}',COPY1)
 p.locator('.kept-copy').filter(has_text='Kept original progress · Fern').locator('[data-remove-copy]').click()
 p.evaluate('(k)=>{window.realRemove=Storage.prototype.removeItem;Storage.prototype.removeItem=function(key){if(key===k)throw Error("Synthetic removal denial");return window.realRemove.call(this,key)}}',COPY2)
 p.locator('[data-confirm-do]').click();result=p.locator('[data-copy-result]');result.wait_for();ok('could not be removed' in result.inner_text() and raw(p,COPY2)=='fictional original two','refused removal announces failure and preserves the original')
 ok(p.locator('.explorer-notes details').evaluate('(d)=>d.open&&d.querySelector("summary")===document.activeElement'),'copy result reopens the list and restores keyboard focus')
 p.evaluate('()=>{Storage.prototype.removeItem=window.realRemove}');p.locator('.kept-copy').filter(has_text='Kept original progress · Fern').locator('[data-remove-copy]').click();p.locator('[data-confirm-do]').click();result=p.locator('[data-copy-result]');result.wait_for()
 ok('was removed' in result.inner_text() and 'Fern, gold leaf, notebook 2' in result.inner_text(),'success identifies which original was removed')
 ok(raw(p,COPY2) is None and raw(p,COPY1)=='fictional original one','removal stays bound to the selected key after storage enumeration order changes')
 c.close()

def practice_and_film(browser,base):
 c,p=setup(browser,base,'#practice','#begin-practice');p.locator('#begin-practice').click();p.locator('#answer').wait_for();p.locator('#answer').fill('0');p.locator('#answer-form button').click()
 old=book(p)['practice'];ok('drops its unrecorded answer and tries' in p.locator('.activity').inner_text(),'practice describes what leaving loses')
 p.get_by_role('link',name='Leave this question',exact=True).click();p.locator('[data-home-entry]').wait_for();ok(book(p)['practice']==old,'leaving practice does not invent a recorded response')
 p.locator('.home-options summary').click();p.locator('[data-film-replay="welcome"]').click();film=p.locator('dialog.welcome-film[open]')
 ok(all(word in film.inner_text() for word in ['snail','sparrow','thunder','letter','First Morning']),'film note describes the visual story and counts')
 film.locator('[data-film-skip]').click();c.close()

def blocked_connections(browser,base):
 c,p=setup(browser,base,'#living','.learning-connections',seed=CONNECTIONS['unreadable'])
 link=p.locator('.learning-connections').get_by_role('link',name='Open Grown-up notes',exact=True).first
 ok(link.get_attribute('href')=='#notes','unreadable connection directs to recovery notes');link.click();p.locator('.explorer-notes').wait_for();ok(p.url.endswith('#notes'),'unreadable connection actually opens notes');c.close()
 for kind,route,selector,title in [('order','#cafe','[data-connection-return="cafe"]','#cafe-plate-editor-title'),('puzzle','#post','[data-connection-return="bramble"]','#post-rival-title')]:
  c,p=setup(browser,base,route,'#cafe-more-activities > summary' if kind=='order' else selector,seed=CONNECTIONS[kind])
  if kind=='order':p.locator('#cafe-more-activities > summary').click()
  p.locator(selector).first.click()
  ok(p.locator(title).evaluate('(h)=>h===document.activeElement'),'blocked '+kind+' control focuses the actual waiting work')
  ok(p.locator(title).evaluate('(h)=>h.getBoundingClientRect().top>=0&&h.getBoundingClientRect().top<innerHeight'),'waiting '+kind+' is brought into view');c.close()
 c,p=setup(browser,base,'#living','.learning-connections',seed=CONNECTIONS['search']);p.get_by_role('link',name='Go to our waiting search',exact=True).first.click();p.locator('#adapt-turn-title').wait_for();ok(p.url.endswith('#living/visit'),'blocked search opens its actual waiting visit');c.close()
 c,p=setup(browser,base,'#post/choose','[data-connection-return="bramble"]',seed=CONNECTIONS['puzzle']);before=book(p)['postOffice'];p.locator('[data-connection-return="bramble"]').first.click();p.locator('#post-rival-title').wait_for()
 ok(p.url.endswith('#post'),'waiting puzzle opens from delivery choices as well as the current work page')
 old=next(v for v in before['visits'] if v['id']==before['current'])['rival'];after=book(p)['postOffice'];new=next(v for v in after['visits'] if v['id']==after['current'])['rival']
 ok(new['task']==old['task'] and new['attempts']==old['attempts'],'opening the waiting puzzle preserves its frozen task and responses');c.close()
 c,p=setup(browser,base,'#post','[data-connection-return="delivery"]',seed=CONNECTIONS['delivery']);p.locator('[data-connection-return="delivery"]').first.click();p.locator('[data-post-start]').first.wait_for();ok(p.url.endswith('#post/choose'),'missing delivery directs to actual delivery choices');c.close()

def bench_guide(browser,base):
 c,p=setup(browser,base,'#companions','[data-guide="rowan"]',320);p.locator('[data-guide="rowan"]').click();ok(ax(p,'#companion-link')['name']['value']=='With Rowan; change guide','guide name updates with the actual selected guide')
 go(p,base,'#science/lens','#companion-link');ok(ax(p,'#companion-link')['name']['value']=='With Rowan; change guide','bench header uses the selected guide and keeps a name on phones');c.close()

def single_recovery_notice(browser,base):
 global last_page
 c=browser.new_context(viewport={'width':820,'height':900},reduced_motion='reduce')
 registry=dict(version=1,activeId='explorer-1',explorers=[dict(id='explorer-1',avatar='sky',color='gold',symbol='leaf',createdAt='2026-11-04T12:00:00.000Z')])
 c.add_init_script('(r=>{if(localStorage.getItem("single-recovery-fixture"))return;localStorage.setItem("learning-garden-explorers",JSON.stringify(r));localStorage.setItem("number-garden-v1:explorer-1","fictional unreadable original");localStorage.setItem("single-recovery-fixture","1");window.notebookWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==="number-garden-v1:explorer-1")notebookWrites++;return set.call(this,k,v)}})('+json.dumps(registry)+')')
 p=c.new_page();last_page=p;p.set_default_timeout(12000);p.on('pageerror',lambda e:errors.append(str(e)));go(p,base,'#arrive','#companion-link');p.locator('header .notes-link').click();p.locator('.explorer-notes').wait_for()
 ok(raw(p,PREFIX+'explorer-1')=='fictional unreadable original' and p.evaluate('notebookWrites')==0,'single unreadable notebook opens without an implicit save or chooser')
 p.locator('.explorer-notes details summary').click();copykey=p.locator('[data-remove-copy]').get_attribute('data-remove-copy');ok(raw(p,copykey)=='fictional unreadable original','single recovery notice has an actual preserved original')
 p.locator('[data-remove-copy]').click();p.locator('[data-confirm-do]').click();p.locator('[data-copy-result]').wait_for()
 ok(raw(p,copykey) is None,'removing the original removes that exact recovery copy')
 ok(p.locator('[data-save-warning]:visible').count()==0,'removing the recovery notice does not reveal a false cannot-save warning')
 ok(p.locator('[data-saving-status]').inner_text()=='Progress is saved on this device.','notes reports working saving after original removal')
 ok(raw(p,PREFIX+'explorer-1')=='fictional unreadable original' and p.evaluate('notebookWrites')==0,'correct status does not require a hidden save that overwrites the original notebook')
 c.close()

class Quiet(http.server.SimpleHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*_args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
def main():
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH'),args=['--disable-quic'])
   try:
    single_recovery_notice(b,base);invitation(b,base);copies_and_reset(b,base);saving(b,base);identities(b,base);remove_copy(b,base);practice_and_film(b,base);blocked_connections(b,base);copies_and_reset(b,base,320);bench_guide(b,base)
    ok(not errors and not request_failures and not console_errors,'no browser/request errors '+str(errors+request_failures+console_errors));receipt=dict(passed=True,checks=checks,browser=b.version,fixtureRoot=str(os.environ.get('SHELL_FIXTURE_ROOT',ROOT)),scope='Real controls, fictional notebooks; warning-before-replacement, pause/reload, finish outcomes, recovery bytes, canceled/confirmed resets and saving-off, distinct explorers and stale handles')
    (OUT/'RESULT.json').write_text(json.dumps(receipt,indent=2),encoding='utf8');print(json.dumps(receipt))
   except Exception:
    (OUT/'failure.json').write_text(json.dumps(dict(errors=errors,requestFailures=request_failures,consoleErrors=console_errors,url=last_page.url if last_page else None),indent=2),encoding='utf8')
    if last_page and not last_page.is_closed():last_page.screenshot(path=str(OUT/'failure.png'))
    raise
   finally:b.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
