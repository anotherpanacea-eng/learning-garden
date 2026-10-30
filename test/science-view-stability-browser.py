"""Synthetic real Chrome turns: persistent styles, visible focus and preserved science visits."""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SCIENCE_STABILITY_ARTIFACTS',tempfile.mkdtemp(prefix='science-stability-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
styles=['lift-yard','lift-lever','water-phase','sound-window','switch-table']
def ok(v,m):
 global checks
 assert v,m
 checks+=1
def ready(p,root):
 p.locator(root).wait_for();p.wait_for_function("names=>names.every(n=>[...document.styleSheets].some(s=>s.href?.endsWith('/'+n+'.css')&&s.cssRules.length))",arg=styles);p.evaluate('async()=>{await document.fonts.ready}')
def stable(p):
 ok(p.evaluate("heldStyles.every(x=>x.node.isConnected&&x.node.sheet===x.sheet&&[...document.styleSheets].includes(x.sheet))"),'original stylesheets remain loaded across turns')
 ok(p.locator('main link[rel=stylesheet]').count()==0,'no turn owns a removable stylesheet')
def visible_focus(p,selector):
 ok(p.locator(selector).evaluate('e=>e===document.activeElement'),'focus on '+selector)
 ok(p.locator(selector).evaluate('e=>{const r=e.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1&&r.left>=-1&&r.right<=innerWidth+1}'),'focused control is fully in actual viewport '+selector)
def layout(p,root):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no sideways overflow')
 for b in p.locator(root+' button:visible').all():
  r=b.bounding_box();ok(r is not None and r['width']>=43.9 and r['height']>=43.9,'44px actual button target')
def pose(p,root):return p.locator(root).evaluate("r=>({words:r.textContent,svg:[...r.querySelectorAll('svg')].map(x=>x.outerHTML),details:[...r.querySelectorAll('details')].map(x=>[x.getAttribute('data-lift-details')||x.getAttribute('data-lever-details')||x.getAttribute('data-phase-details')||x.getAttribute('data-sound-details')||x.getAttribute('data-switch-details'),x.open]),controls:[...r.querySelectorAll('button,select')].map(x=>[x.textContent,x.value,x.disabled,x.getAttribute('aria-pressed')])})")
def action(p,prefix,a,value=None):
 sel=f'[data-{prefix}-action="{a}"]'+(f'[data-{prefix}-value="{value}"]' if value is not None else '')
 p.locator(sel).tap();return sel

def journey(b,base,seed,width,height):
 c=b.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce')
 # One synthetic notebook, initialized once in a fresh browser context.
 c.add_init_script("""(s=>{if(!localStorage.getItem('synthetic-stability')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('synthetic-stability','1');}})("""+json.dumps(seed)+')')
 p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)))
 try:
  p.goto(base+'#workshop/lift',wait_until='networkidle');ready(p,'[data-lift-root]')
  p.evaluate("window.heldStyles=['lift-yard','lift-lever','water-phase','sound-window','switch-table'].map(n=>{const node=document.querySelector('head link[href=\"./'+n+'.css\"]');return {node,sheet:node.sheet}})")
  original=p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")
  cases=[('#workshop/lift','lift','[data-lift-root]'),('#science/ice','phase','[data-water-phase-root]'),('#studio/sound-window','sound','[data-sound-root]'),('#workshop/switch-table','switch','[data-switch-root]')]
  for route,prefix,root in cases:
   p.goto(base+route,wait_until='networkidle');ready(p,root);stable(p);layout(p,root)
   if prefix=='lift':
    action(p,'lift','board',2);action(p,'lift','start');action(p,'lift','pull');action(p,'lift','plan')
   elif prefix=='phase':action(p,prefix,'in');action(p,prefix,'in');action(p,prefix,'follow')
   elif prefix=='sound':action(p,prefix,'hold');action(p,prefix,'high');action(p,prefix,'size2');action(p,prefix,'later')
   else:action(p,prefix,'hold');action(p,prefix,'a');action(p,prefix,'trace')
   stable(p)
   # Keep one help panel open and verify all material survives each film return.
   details=p.locator(root+' details').first
   if not details.evaluate('e=>e.open'):details.locator('summary').tap()
   before=pose(p,root)
   for escape in [True,False]:
    watch=f'[data-{prefix}-action="watch"]';p.locator(watch).tap();p.locator(root+' video').wait_for();stable(p)
    back='[data-lift-film-return]' if prefix=='lift' else f'[data-{prefix}-action="return"]'
    visible_focus(p,back);layout(p,root)
    if escape:
     # Reproduces the previous bug: Escape after scrolling deep into the film.
     for detail in p.locator(root+' details').all():
      if not detail.evaluate('e=>e.open'):detail.locator('summary').tap()
     p.evaluate('scrollTo(0,document.documentElement.scrollHeight)');p.keyboard.press('Escape')
    else:p.locator(back).tap()
    ready(p,root);stable(p);visible_focus(p,watch);ok(pose(p,root)==before,'film return preserves model, held reference, text and open help '+prefix);layout(p,root)
   if prefix=='lift':
    action(p,'lift','mode','lever');ready(p,root);stable(p);visible_focus(p,'[data-lift-action=mode][data-lift-value=lever]');layout(p,root)
    snapshot=pose(p,root);p.locator('[data-lift-action=watch]').tap();p.locator('[data-lift-film-return]').wait_for();p.evaluate('scrollTo(0,document.documentElement.scrollHeight)');p.keyboard.press('Escape');ready(p,root);stable(p);visible_focus(p,'[data-lift-action=watch]');ok(pose(p,root)==snapshot,'lever material survives film return');layout(p,root)
   ok(p.evaluate("localStorage.getItem('number-garden-v1:explorer-1')")==original,'visit and film operations never replace notebook')
  p.goto(base+'#home',wait_until='networkidle');ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'Home remains within viewport with science styles loaded');stable(p)
  print('science stability',width,height,'passed',flush=True)
 finally:c.close()

def main():
 seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.syntheticOther={preserved:'unknown additive field'};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*a):pass
 class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    for width,height in [(320,600),(820,1000),(1024,768)]:journey(b,base,seed,width,height)
    ok(not errors,'no page errors '+str(errors));receipt={'checks':checks,'status':'passed','limits':'Synthetic Chrome touch/keyboard, not physical iPad/Safari, audible output or VoiceOver.'};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
   finally:b.close()
 finally:server.shutdown()
if __name__=='__main__':main()
