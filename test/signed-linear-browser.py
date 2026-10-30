"""Signed/zero generated Linear investigations; isolated synthetic records only."""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,re,subprocess,tempfile,threading,copy
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('SIGNED_LINEAR_ARTIFACTS',tempfile.mkdtemp(prefix='signed-linear-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True

def book(p,id='explorer-1'):return p.evaluate('(id)=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',id)
def work(p):
 r=book(p)['linearPathway'];return r['lessons'][r['currentId']]
def go(p,route):p.evaluate('(r)=>location.hash=r',route);p.locator('[data-linear-root]').wait_for()
def create(p,kind):
 before=book(p)['linearPathway']['currentId'];p.locator('[data-linear-challenge]').select_option(kind);p.locator('[data-linear-create]').focus();p.keyboard.press('Enter');p.wait_for_function('(id)=>{const k=JSON.parse(localStorage.getItem("number-garden-v1:explorer-1")).linearPathway.currentId;return k!==id&&location.hash==="#learn/math/"+k&&document.activeElement?.id==="linear-turn"}',arg=before);p.locator('#linear-turn').wait_for();return work(p)
def page(p,n):p.locator(f'[data-linear-page="{n}"]').first.tap()
def field(p,key,value):p.locator(f'[data-linear-item=own][data-linear-field="{key}"]').fill(value)
def check(p):p.locator('[data-linear-check=own]').tap();p.locator('#linear-feedback-own').wait_for();ok(work(p)['checks'][-1]['outcome']=='match','independent expected signed answer fits');ok(work(p)['checks'][-1]['supported'] is True,'still supported practice')
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth'),'no horizontal overflow')
 for e in p.locator('.linear-page button:visible,.linear-page select:visible,.linear-page input:visible,.linear-page a:visible').all():
  r=e.bounding_box();ok(r and r['height']>=43.9,'44px control '+e.text_content()[:25])
def line(p,index=0):
 paths=p.locator('.linear-graph path[stroke-width="3"]');d=paths.nth(index).get_attribute('d');m=re.fullmatch(r'M([\d.\-]+) ([\d.\-]+)L([\d.\-]+) ([\d.\-]+)',d);ok(bool(m),'actual graph line coordinates');return [float(x) for x in m.groups()]
def setup(browser,base,width,height,serial=48):
 fixture=json.loads((ROOT/'test/fixtures/linear-before-signed.json').read_text());fixture['garden']={'avatar':'sky','welcomeFilmSeen':True};fixture['linearPathway']['exploration']['nextSerial']=serial
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True,reduced_motion='reduce');c.add_init_script("""(s=>{if(!localStorage.getItem('signed-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('signed-fixture','1');}})("""+json.dumps(fixture)+')');p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+'#learn/math',wait_until='networkidle');p.locator('[data-linear-root]').wait_for();return c,p,fixture

def single(browser,base,width,height):
 c,p,fixture=setup(browser,base,width,height)
 try:
  for _ in range(3):create(p,'revisit')
  w=work(p);ok(w['source']['generation']['serial']==50 and w['source']['model']['m']=='0','real controls reach new zero-rate case');ok('every permitted whole-turn input from 0 to 6' in p.locator('.linear-turn').text_content(),'finite zero-rate teaching')
  coords=line(p);ok(coords[1]==coords[3],'horizontal zero-rate graph');y=p.locator('.linear-graph circle[r="7"]').get_attribute('cy');x=float(p.locator('.linear-graph circle[r="7"]').get_attribute('cx'));p.locator('[data-linear-delta="1"]').tap();ok(float(p.locator('.linear-graph circle[r="7"]').get_attribute('cx'))>x,'zero-rate input still moves horizontally');ok(p.locator('.linear-graph circle[r="7"]').get_attribute('cy')==y,'zero output remains fixed as input moves');values=p.locator('.linear-table tbody td').all_text_contents();ok(len(values)==7 and all(x=='4' for x in values),'zero table all four tokens')
  layout(p);p.screenshot(path=str(OUT/f'zero-{width}.png'),full_page=True);page(p,2);field(p,'height','4');check(p)
  w=create(p,'unknown');ok(w['source']['model']['m']=='-1/2' and w['source']['model']['b']=='1','signed inverse can target zero without zero rate');page(p,2);field(p,'product','-1');field(p,'x','2');check(p)
  w=create(p,'revisit');ok(w['source']['model']['m']=='-1/2','new negative-rate revisit');coords=line(p);ok(coords[3]>coords[1],'negative graph falls as values decrease');y=float(p.locator('.linear-graph circle[r="7"]').get_attribute('cy'));p.locator('[data-linear-delta="1"]').tap();ok(float(p.locator('.linear-graph circle[r="7"]').get_attribute('cy'))>y,'negative marker moves down');ok('-1/2' in p.locator('.linear-value').text_content(),'signed exact output visible')
  page(p,2);p.locator('[data-linear-help=own][data-help-kind=example]').tap();ok('(−5/2)x = −15' in p.locator('#linear-help-own-example').text_content(),'negative worked inversion visible');field(p,'height','-1');check(p);ok('example' in work(p)['checks'][-1]['helpBefore'],'optional example recorded separately')
  layout(p);p.screenshot(path=str(OUT/f'falling-{width}.png'),full_page=True);page(p,3);p.locator('[data-linear-note]').fill('First synthetic signed explanation');p.locator('[data-linear-keep]').tap();p.locator('[data-linear-note]').fill('Latest synthetic signed explanation');p.locator('[data-linear-keep]').tap();held=copy.deepcopy(book(p)['linearPathway']);key=held['currentId'];ok(held['lessons'][key]['firstKept']['note'].startswith('First'),'first kept explanation retained');ok(held['lessons'][key]['kept']['note'].startswith('Latest'),'latest kept explanation retained')
  for old,source in fixture['linearPathway']['lessons'].items():ok(book(p)['linearPathway']['lessons'][old]==source,'pre-change saved visit exact '+old)
  p.reload(wait_until='networkidle');p.locator('[data-linear-root]').wait_for();ok(book(p)['linearPathway']==held,'reload keeps new and old frozen visits')
  p.evaluate("window.oldLinearCreate=document.querySelector('[data-linear-create]')")
  p.evaluate("location.hash='#notes'");p.locator('#download').wait_for()
  with p.expect_download() as dl:p.locator('#download').tap()
  file=OUT/f'notes-{width}.json';dl.value.save_as(str(file));exported=json.loads(file.read_text());ok(exported['linearPathway']==held,'actual Notes download exact');ok(exported['syntheticFuture']==fixture['syntheticFuture'],'additive sibling retained')
  p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId==='explorer-2'");p.evaluate("location.hash='#learn/math'");p.locator('[data-linear-root]').wait_for();ok(book(p,'explorer-2')['linearPathway']==held,'actual import preserves old/new sources and writing');before=book(p,'explorer-2');p.evaluate('oldLinearCreate.click()');ok(book(p,'explorer-2')==before,'detached previous-owner create is inert')
  p.evaluate("location.hash='#notes'");p.locator('#notes-add-explorer').tap();p.locator('#explorer-create').tap();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId==='explorer-3'");p.evaluate("location.hash='#learn/math'");p.locator('[data-linear-root]').wait_for();ok('linearPathway' not in book(p,'explorer-3'),'new explorer inherits no signed work');
  if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').tap()
  p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();p.evaluate("location.hash='#learn/math'");p.locator('[data-linear-root]').wait_for();ok(book(p)['linearPathway']==held,'return to original explorer preserves waiting work')
  p.evaluate("location.hash='#notes'");p.locator('#remember').uncheck();p.evaluate("location.hash='#learn/math'");p.locator('[data-linear-root]').wait_for();p.locator('[data-linear-challenge]').select_option('contrast');p.locator('[data-linear-create]').tap();ok(not p.evaluate("Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"),'saving-off signed generation does not recreate notebooks');print('signed single',width,'passed',flush=True)
 finally:c.close()

def comparison(browser,base,width,height):
 c,p,_=setup(browser,base,width,height,serial=50)
 try:
  w=create(p,'contrast');ok(w['source']['model']['m']=='0' and w['source']['model']['comparison']['m']=='-1/2','real falling-vs-steady comparison');a=line(p);b=line(p,1);ok(a[1]==a[3] and b[3]>b[1],'graph has steady and falling lines')
  p.locator('[data-linear-x]').select_option('2');ok(p.locator('.linear-current td').all_text_contents()==['4','4'],'actual table intersection');page(p,2);field(p,'x','2');field(p,'height','4');check(p);page(p,3)
  expected={'a-before':'4','b-before':'9/2','a-after':'4','b-after':'7/2'}
  for key,value in expected.items():p.locator(f'[data-linear-item=return][data-linear-field="{key}"]').fill(value)
  p.locator('[data-linear-check=return]').tap();ok(work(p)['checks'][-1]['outcome']=='match','both sides of meeting independently checked');layout(p);p.screenshot(path=str(OUT/f'comparison-{width}.png'),full_page=True);print('signed comparison',width,'passed',flush=True)
 finally:c.close()

def main():
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('SIGNED_LINEAR_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
   try:
    for width,height in [(320,600),(820,1000),(1024,768)]:single(b,base,width,height);comparison(b,base,width,height)
    ok(not errors,'no page errors '+str(errors));result={'checks':checks,'status':'passed','base':base,'limits':'Synthetic Chrome touch/keyboard/transfer, not physical iPad/Safari, VoiceOver or learning effects.'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
   finally:b.close()
 finally:server.shutdown()
if __name__=='__main__':main()
