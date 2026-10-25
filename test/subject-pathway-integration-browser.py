"""Regression for subject entry preserving legacy work and explicit host voice preferences.
Synthetic notebooks only; intentionally omit welcomeFilmSeen and ordinary initialization.
"""
import copy,functools,http.server,json,os,subprocess,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
raw=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';console.log(JSON.stringify(freshState()));"],cwd=ROOT,text=True))
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
class PreviewServer(http.server.ThreadingHTTPServer):
 request_queue_size=128
server=None
BASE=os.environ.get('SUBJECT_INTEGRATION_TEST_URL')
if not BASE:
 server=PreviewServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}/'
checks=0
def ok(v,message):
 global checks
 assert v,message
 checks+=1
def notebook(p):return p.evaluate("()=>{const e=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+e.activeId));}")
future={'avatar':'sky','guide':'synthetic-future-guide','visits':[{'id':'synthetic-future','entrance':'future-place','drafts':{'retained':'exact pending words'}}],'seen':['synthetic-future-node'],'observations':[{'future':'unreadable original remains'}],'current':'synthetic-future'}
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
  try:
   for oldgarden in [None,future]:
    for route in ['#pathways/math','#learn/english/before']:
     s=copy.deepcopy(raw)
     if oldgarden is not None:s['garden']=copy.deepcopy(oldgarden)
     c=b.new_context(viewport={'width':820,'height':1000})
     c.add_init_script("if(!localStorage.getItem('subject-probe-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(s))+");localStorage.setItem('subject-probe-fixture','1');}window.__subjectSpoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{name:'Synthetic English',lang:'en-US',localService:true,default:true,voiceURI:'synthetic'}]},speak(u){window.__subjectSpoken.push(u.text);queueMicrotask(()=>u.onstart?.());},addEventListener(){},removeEventListener(){}}});")
     p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(BASE+route)
     p.locator('[data-pathway-root]' if route.startswith('#pathways') else '[data-ev-root]').wait_for()
     ok(p.locator('.welcome-film').count()==0,'direct subject entry does not open a story film')
     if route.startswith('#pathways'):p.locator('[data-pathway-remember="plans"]').click()
     else:p.locator('.ev-preview [data-ev-open="before"]').click()
     garden=notebook(p)['garden']
     if oldgarden is None:ok(set(garden)=={'avatar'},'subject action does not initialize unrelated destinations')
     else:ok(garden==oldgarden,'subject action preserves retained future visit, draft, guide, observations and seen ids')
     if route.startswith('#pathways'):
      p.goto(BASE+'#learn/english/before');p.locator('.ev-preview [data-ev-open="before"]').click()
     p.locator('.ev-reading [data-speak]').first.click();p.locator('.voice-settings > summary').click();p.locator('[data-reading-speed]').select_option('0.8')
     got=notebook(p)['garden'];ok(got['speech']['rate']==.8,'explicit host voice preference saved through actual report preflight');got.pop('speech')
     ok(got==garden,'explicit preference changes only garden.speech')
     ok(not errors,'no page errors: '+str(errors));c.close()
   print(f'Subject integration Chrome: {checks} assertions passed for minimal and retained future notebooks at both subject roots.')
  finally:b.close()
finally:
 if server:server.shutdown()
