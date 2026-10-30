"""Synthetic two-page save/recovery checks; no real learner records or hosted writes."""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
checks=0
errors=[]
def ok(value,label):
 global checks
 assert value,label
 checks+=1
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):
 request_queue_size=128
 daemon_threads=True

def disk(p):return p.evaluate("Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('number-garden')||k==='learning-garden-explorers'))")
def guide(p,i):
 if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').tap()
 p.locator('[data-guide]').nth(i).tap()
 return p.locator('[data-guide]').nth(i).get_attribute('data-guide')
def notes(p,base):
 p.evaluate("location.hash='#notes'")
 p.locator('#download').wait_for()
def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.syntheticOther={payload:'retain unknown data'};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    for width in [320,820]:
     c=b.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True)
     a=c.new_page();a.on('pageerror',lambda e:errors.append(str(e)));a.goto(base+'#notes',wait_until='networkidle')
     a.evaluate("s=>{localStorage.clear();localStorage.setItem('number-garden-v1',JSON.stringify(s));}",seed)
     a.reload(wait_until='networkidle');a.goto(base+'#companions',wait_until='networkidle');a.locator('[data-guide]').first.wait_for()
     second=c.new_page();second.on('pageerror',lambda e:errors.append(str(e)));second.goto(base+'#companions',wait_until='networkidle');second.locator('[data-guide]').first.wait_for()
     winner=guide(a,1);saved=disk(a)
     second.locator('[data-save-warning]').wait_for()
     ok('Saving is paused here' in second.locator('[data-save-warning]').text_content(),'real storage event warns second tab')
     local=guide(second,2)
     ok(local!=winner,'synthetic choices differ')
     ok(disk(second)==saved,'stale actual control leaves winning saved notebook byte-identical')
     ok(second.locator('[data-save-warning] a[href="#notes"]').count()==1,'warning offers direct recovery link')
     second.locator('[data-save-warning] a').tap();second.locator('#download').wait_for()
     for selector in ['#remember','#reset','#clear-all-explorers']:
      ok(second.locator(selector).is_disabled(),'stale destructive control disabled '+selector)
     ok('Saving is paused here' in second.locator('[data-saving-status]').text_content(),'notes does not claim successful saving')
     with second.expect_download() as dl:second.locator('#download').tap()
     export=json.loads(Path(dl.value.path()).read_text())
     ok(export['garden']['guide']==local,'actual download keeps stale tab local work')
     ok(export['syntheticOther']==seed['syntheticOther'],'unknown notebook data survives export')
     ok(disk(second)==saved,'download changes no saved bytes')
     a.close();second.reload(wait_until='networkidle')
     ok(second.locator('#remember').is_enabled(),'reload resumes normal saving')
     ok(not second.locator('[data-save-warning]').count(),'reload clears sticky conflict')
     second.evaluate("location.hash='#companions'");second.locator('[data-guide]').first.wait_for()
     ok(second.locator(f'[data-guide="{winner}"]').get_attribute('aria-pressed')=='true','reload reads winning saved guide')
     guide(second,2);ok(json.loads(disk(second)['number-garden-v1:explorer-1'])['garden']['guide']==local,'after reload actual controls save again')
     # A second explorer works in another real page without pausing the first.
     notes(second,base);second.locator('#notes-add-explorer').tap();second.locator('#explorer-create').tap();second.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId==='explorer-2'");second.wait_for_url('**/#home')
     second.evaluate("location.hash='#companions'");second.locator('[data-guide]').first.wait_for()
     third=c.new_page();third.on('pageerror',lambda e:errors.append(str(e)));third.goto(base+'#companions',wait_until='networkidle');third.locator('[data-select-explorer="explorer-1"]').tap();third.evaluate("location.hash='#companions'");third.locator('[data-guide]').first.wait_for()
     other_local=json.loads(disk(third)['number-garden-v1:explorer-2'])['garden']['guide']
     guide(second,1);guide(third,0)
     ok(not second.locator('[data-save-warning]').count() and not third.locator('[data-save-warning]').count(),'separate explorers keep saving in real pages')
     # Refresh all notebooks before an intentional operation that deletes every explorer.
     second.reload(wait_until='networkidle');second.locator('[data-select-explorer="explorer-2"]').tap();second.wait_for_url('**/#home')
     # Save-off in one page must prevent the other from recreating removed data.
     notes(second,base);ok(second.locator('#remember').is_enabled(),'second explorer remains writable: '+str(second.locator('[data-save-warning]').all_text_contents())+' registry '+str(second.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers'))")));second.locator('#remember').uncheck();third.locator('[data-save-warning]').wait_for();off=disk(second);guide(third,1)
     ok(disk(third)==off and off.get('number-garden-save')=='off','real save-off cannot be undone by stale game controls')
     ok(not any(k.startswith('number-garden-v1:') for k in off),'off removes saved notebooks')
     # This conflicted page had both notebooks open: each remains downloadable.
     notes(third,base);third.locator('#notes-switch-explorer').tap();third.locator('[data-select-explorer="explorer-2"]').tap();third.wait_for_url('**/#home');notes(third,base)
     with third.expect_download() as recovered:third.locator('#download').tap()
     other=json.loads(Path(recovered.value.path()).read_text())
     ok(other['garden']['guide']==other_local,'conflicted tab can export its other locally open notebook')
     ok(disk(third)==off,'recovery-only switching and download never recreate removed saves')
     c.close();print('two-page touch recovery width',width,'passed',flush=True)
    ok(not errors,'no page errors '+str(errors));print(json.dumps({'checks':checks,'status':'passed','limits':'Synthetic Chrome pages and touch emulation; not simultaneous atomic transactions, physical iPad/Safari or cross-device sync.'}))
   finally:b.close()
 finally:server.shutdown()
if __name__=='__main__':main()
