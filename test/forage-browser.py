"""Real-app regression for response/help separation and orchard retention.

Fictional notebooks only. CHROME_PATH selects Chromium; FORAGE_ARTIFACTS selects
receipts/screenshots. No application modules are replaced.
"""
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('FORAGE_ARTIFACTS',tempfile.mkdtemp(prefix='forage-browser-')))
OUT.mkdir(parents=True,exist_ok=True)
os.environ['CAFE_TOUCH_ARTIFACTS']=str(OUT)
spec=importlib.util.spec_from_file_location('cafe_helpers',ROOT/'test/cafe-touch-browser.py')
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
program="""
import {cafeTouchFixtures} from './test/cafe-touch-checks.mjs';
import {availableIngredients} from './dist/cafe-core.mjs';
import * as F from './dist/forage-core.mjs';
const base=cafeTouchFixtures().base,food=availableIngredients(base.cafe)[0].id,other=availableIngredients(base.cafe)[1].id;
function harvest(s){F.startForage(s,food);const t=F.currentForage(s);const plot=F.huntPlots(t).find(p=>p.row===t.hunt.row&&p.column===t.hunt.column);F.chooseForage(s,plot.id);return t;}
const fresh=structuredClone(base);harvest(fresh);
const historical=structuredClone(fresh);F.currentForage(historical).supported=true;F.submitHarvest(historical,F.currentForage(historical).total+1);
const fullJar=structuredClone(base);fullJar.cafe.stock[food]=144;const t=harvest(fullJar);F.submitHarvest(fullJar,t.total);F.packHarvest(fullJar);
const capacity=structuredClone(base);for(let i=0;i<24;i++)F.startForage(capacity,food);
console.log(JSON.stringify({fresh,historical,fullJar,capacity,food,other}));
"""
fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',program],cwd=ROOT,text=True))
checks=0
def ok(v,message):
 global checks
 assert v,message
 checks+=1
def book(page):return h.h.book(page)
def trip(page):
 s=book(page)['cafe']['foraging'];return next(t for t in s['trips'] if t['id']==s['currentId'])
def go(page,base,route,selector):
 page.goto(base+route,wait_until='domcontentloaded');page.locator('#explorer-header').wait_for(timeout=30000)
 choose=page.locator('[data-select-explorer="explorer-1"]')
 if choose.count():choose.click();page.evaluate('(r)=>location.hash=r',route)
 page.locator(selector).first.wait_for()
def fits(page):ok(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no page overflow')
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*_args):pass
class Server(http.server.ThreadingHTTPServer):
 request_queue_size=128
 daemon_threads=True
def main():
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH'),args=['--disable-quic'])
   for width,theme in [(1280,'light'),(320,'dark')]:
    page=h.setup(browser,copy.deepcopy(fixtures['fresh']),width,f'wrong-answer-{width}');page.emulate_media(color_scheme=theme)
    go(page,base,'#orchard/gather','#harvest-answer');before=trip(page);wrong=before['total']+1
    page.locator('#harvest-answer').fill(str(wrong));page.locator('[data-forage-form] button').click()
    after=trip(page);ok(after['attempts']==[wrong],'wrong response is retained');ok(not after['supported'],'wrong response alone is not help');ok(page.locator('.harvest-readout').count()==0,'wrong response does not open counted-basket readout')
    page.reload(wait_until='domcontentloaded');page.locator('#harvest-answer').wait_for();ok(trip(page)['attempts']==[wrong] and not trip(page)['supported'],'response/help distinction survives reload')
    page.locator('[data-forage-action="count"]').click();ok(trip(page)['supported'] and trip(page)['steps']==1,'explicit counting records help and one actual basket')
    page.reload(wait_until='domcontentloaded');page.locator('.harvest-readout').wait_for();ok(trip(page)['supported'] and trip(page)['steps']==1,'explicit counting persists');fits(page);page.screenshot(path=str(OUT/f'count-{width}.png'),full_page=True);page.context.close()

    page=h.setup(browser,copy.deepcopy(fixtures['fullJar']),width,f'full-jar-{width}');page.emulate_media(color_scheme=theme)
    go(page,base,'#orchard/gather','.forage-prompt');ok(book(page)['cafe']['stock'][fixtures['food']]>144,'fixture is above new-trip threshold');ok(page.locator('[data-forage-start]').count()==0,'full jar offers no refused new-trip action');ok('Start a new trip' not in page.locator('.forage-sheet').inner_text(),'full-jar instructions match available controls');fits(page);page.screenshot(path=str(OUT/f'full-jar-{width}.png'),full_page=True);page.context.close()

    page=h.setup(browser,copy.deepcopy(fixtures['capacity']),width,f'capacity-{width}');page.emulate_media(color_scheme=theme)
    go(page,base,'#orchard/gather/'+fixtures['other'],'[data-forage-start]');note=page.locator('[data-forage-start]').get_attribute('aria-describedby');ok(bool(note) and page.locator('#'+note).is_visible(),'capacity loss is visible before starting');ok(bool(h.ax(page,'[data-forage-start]').get('description',{}).get('value')),'capacity loss has computed accessible description')
    before=book(page);page.locator('[data-forage-start]').focus();page.keyboard.press('Enter');page.locator('.hunt-map').wait_for();after=book(page)
    ok(after['cafe']['foraging']['trips'][:-1]==before['cafe']['foraging']['trips'][1:],'only warned oldest trip is removed');ok(after['cafe']['stock']==before['cafe']['stock'],'starting preserves all existing jar stock');fits(page);page.context.close()

   for action in ['reveal','pack-help']:
    page=h.setup(browser,copy.deepcopy(fixtures['fresh']),1280,action);go(page,base,'#orchard/gather','#harvest-answer');before=book(page);page.locator(f'[data-forage-action="{action}"]').click();after=book(page)
    ok(trip(page)['supported'],'explicit '+action+' records help')
    if action=='reveal':ok(trip(page)['revealed'] and after['cafe']['stock']==before['cafe']['stock'],'showing the total does not add food')
    else:ok(trip(page)['collected'] and after['cafe']['stock'][fixtures['food']]==before['cafe']['stock'][fixtures['food']]+trip(page)['total'],'packing with help adds the actual harvest once')
    page.context.close()
   page=h.setup(browser,copy.deepcopy(fixtures['historical']),1280,'historical');go(page,base,'#orchard/gather','#harvest-answer');old=trip(page)
   ok(old['supported'] and old['steps']==0 and old['attempts']==fixtures['historical']['cafe']['foraging']['trips'][0]['attempts'],'earlier supported flag is not rewritten')
   page.reload(wait_until='domcontentloaded');page.locator('#harvest-answer').wait_for();ok(trip(page)==old,'earlier saved trip survives reload exactly');page.context.close()
   ok(not h.h.errors and not h.h.console_errors,'no browser errors')
   receipt=dict(passed=True,checks=checks,browser=browser.version,widths=[1280,320],scope='Actual app; wrong response versus three explicit help paths, historical flags, full jar controls, capacity loss and stock/reload preservation',limits='Chromium emulation and fictional fixtures; no physical-device, speech or learning qualification')
   (OUT/'RESULT.json').write_text(json.dumps(receipt,indent=2),encoding='utf8');print(json.dumps(receipt));browser.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
