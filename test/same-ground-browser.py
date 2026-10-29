"""Native Chrome construction probes for293; full release lifecycle coverage follows.
Synthetic notebooks only. Not physical iPad/Safari or audibility evidence.
"""
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
OUT=Path(os.environ.get('GROUND_ARTIFACTS',tempfile.mkdtemp(prefix='ground-browser-')))
OUT.mkdir(parents=True,exist_ok=True)
checks=0
def check(value,message):
    global checks
    assert value,message
    checks+=1
def click(p,action):p.locator(f'[data-ground-action="{action}"]').tap()
def snapshot(p):return p.evaluate('()=>localStorage.getItem("number-garden-v1:explorer-1")')
def run(browser,base,width,height,seed):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce')
    fixture={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-28T12:00:00.000Z'}]}
    c.add_init_script('(data=>{if(!localStorage.getItem("ground-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(data.registry));localStorage.setItem("number-garden-v1:explorer-1",JSON.stringify(data.seed));localStorage.setItem("ground-fixture","1");}})('+json.dumps({'registry':fixture,'seed':seed})+')')
    p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    p.on('requestfailed',lambda r:errors.append(str((r.url,r.failure))) if 'ERR_ABORTED' not in (r.failure or '') else None)
    p.goto(base+'#workshop/same-ground',wait_until='domcontentloaded')
    try:p.locator('#explorer-header').wait_for(timeout=10000)
    except Exception:
        p.screenshot(path=str(OUT/f'failure-{width}.png'),full_page=True)
        print(json.dumps({'pageErrors':errors,'body':p.locator('body').inner_text()[:2000]}),flush=True)
        raise
    choice=p.locator('[data-select-explorer="explorer-1"]')
    if choice.count():choice.tap()
    p.locator('[data-ground-root]').wait_for()
    before=snapshot(p)
    check('All 4 tiles' in p.locator('.ground-counts').inner_text(),'starts with full stock in tray')
    check(p.locator('[data-ground-diagram="plot"] [data-ground-unit]').count()==0,'no ghost tiles')
    click(p,'lay');check(p.locator('.ground-tray').inner_text().startswith('0 tiles'),'tray moves actual stock')
    check(p.locator('[data-ground-action="lift"]').evaluate('(e)=>e===document.activeElement'),'final Lay moves focus to enabled Lift')
    click(p,'keep');click(p,'return');p.locator('[data-ground-width]').select_option('2');click(p,'lay');click(p,'lay')
    check('Both cover 4 square units' in p.locator('.ground-comparison').inner_text(),'same area comparison')
    check('fewer length units' in p.locator('.ground-comparison').inner_text(),'different boundary comparison')
    a=p.locator('[data-ground-diagram="plot"] [data-ground-unit]').first.bounding_box();b=p.locator('[data-ground-diagram="picture"] [data-ground-unit]').first.bounding_box()
    check(abs(a['width']-a['height'])<.2,'current tiles are square');check(abs(a['width']-b['width'])<.2,'picture and current use same unit scale')
    for _ in range(8):click(p,'walk')
    check('Back at the start' in p.locator('.ground-controls').inner_text(),'closed walk')
    check(p.locator('.ground-edge.walked').count()==8,'eight outside unit segments, not four border tiles')
    check(p.locator('[data-ground-action="restart"]').evaluate('(e)=>e===document.activeElement'),'last Walk focus fallback')
    click(p,'lift');check(p.locator('.ground-edge.walked').count()==0,'edit clears old walk')
    check('At least one arrangement' in p.locator('.ground-comparison').inner_text(),'partial build qualifier')
    click(p,'return');p.locator('[data-ground-shortcut] summary').tap();check('no outside boundary' in p.locator('[data-ground-shortcut]').inner_text(),'empty shortcut has no phantom fence')
    p.locator('[data-ground-case]').select_option('twenty-four');check(p.locator('.ground-budget').count()==0,'empty final has no within-budget claim')
    p.locator('[data-ground-width]').select_option('6')
    for _ in range(4):click(p,'lay')
    check('All 24 tiles' in p.locator('.ground-budget').inner_text(),'all stock used');check('20 length units of fence is within' in p.locator('.ground-budget').inner_text(),'inclusive fence budget')
    click(p,'keep');click(p,'return');p.locator('[data-ground-width]').select_option('3')
    for _ in range(8):click(p,'lay')
    check('22 length units of fence is over' in p.locator('.ground-budget').inner_text(),'larger fence remains factual')
    p.locator('[data-ground-case]').select_option('four');check('A picture' in p.locator('.ground-picture').inner_text(),'case picture retained during visit')
    check(p.locator('[data-ground-shortcut]').get_attribute('open') is not None,'support disclosure retained')
    check(snapshot(p)==before,'construction and support do not save a notebook')
    check(p.evaluate('()=>document.documentElement.scrollWidth<=innerWidth'),'no document overflow')
    for box in p.locator('[data-ground-root] button,[data-ground-root] select,[data-ground-root] summary').all():
        if box.is_visible():check(box.bounding_box()['height']>=43.9,'native target at least44px')
    p.screenshot(path=str(OUT/f'board-{width}.png'),full_page=True)
    p.reload();p.locator('#explorer-header').wait_for();choice=p.locator('[data-select-explorer="explorer-1"]');
    if choice.count():choice.tap()
    p.locator('[data-ground-root]').wait_for();check(p.locator('[data-ground-unit]').count()==0,'reload clears transient work');check(snapshot(p)==before,'reload retains unrelated notebook')
    check(not errors,'no page errors');c.close()

def main():
    js="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.sameGround={unknown:77,retained:'Synthetic unknown field'};s.sentinel={note:'Synthetic retained work'};console.log(JSON.stringify(s));"
    seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):
        request_queue_size=128
        daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
        try:
            for w,h in [(820,1180),(1024,768),(320,800)]:run(browser,base,w,h,seed)
            result={'status':'passed','checks':checks,'scope':'construction, case retention, native focus, equal-scale geometry, empty/partial/budget, reload and notebook isolation; broader release lifecycle and speech checks pending'}
            (OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
        finally:browser.close();server.shutdown()
if __name__=='__main__':main()
