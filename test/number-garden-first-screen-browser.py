"""Number Garden adventures: the question is on the first screen at phone, tablet and desktop sizes (2026-10-18 UX finding, rechecked 2026-10-31)."""
import os,threading,http.server,functools
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=None
BASE=os.environ.get('NUMBER_GARDEN_TEST_URL')
if not BASE:
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}/'
IDS=[f'{a}-{s}' for a in ['number','operations','fractions','patterns','geometry','measurement','reasoning'] for s in ['support','explore','stretch-activity']]
# Spec 19 asks for the question to begin on a 375px phone's first screen; wider screens show it whole.
SIZES=[(375,667,'top'),(390,844,'top'),(820,1180,'bottom'),(1024,768,'bottom'),(1440,900,'bottom')]
checks=0
def ok(v,m):
 global checks
 assert v,m
 checks+=1
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
  try:
   for w,h,edge in SIZES:
    p=b.new_page(viewport={'width':w,'height':h})
    p.goto(BASE+'#numbers')
    skip=p.get_by_text('Skip to the garden')
    try:skip.first.click(timeout=3000)
    except Exception:pass
    for id in IDS:
     p.goto(BASE+'#adventure/'+id);p.locator('.broad-activity .question').wait_for()
     r=p.evaluate("()=>{const q=document.querySelector('.broad-activity .question').getBoundingClientRect();return {top:q.top,bottom:q.bottom,open:document.querySelector('#broad-example')?.open??false,over:document.documentElement.scrollWidth>innerWidth+1}}")
     ok(not r['open'],f'{id} {w}x{h}: Pip’s example starts closed')
     ok(r['top']>=0 and r['bottom']>r['top'],f'{id} {w}x{h}: question is laid out below the page top')
     ok(r[edge]<=h,f'{id} {w}x{h}: question {edge} {r[edge]:.0f} is on the first screen')
     ok(not r['over'],f'{id} {w}x{h}: no horizontal overflow')
    # Opening the example is still one tap, and the choice survives a redraw.
    p.goto(BASE+'#adventure/number-support');p.locator('#broad-example summary').click()
    ok(p.evaluate("()=>document.querySelector('#broad-example').open"),f'{w}x{h}: example opens')
    p.locator('#broad-example button',has_text='+').nth(1).click()
    ok(p.evaluate("()=>document.querySelector('#broad-example').open"),f'{w}x{h}: example stays open after a change')
    p.close()
  finally:b.close()
finally:
 if server:server.shutdown()
print(f'Number Garden first screen: {checks} browser checks passed.')
