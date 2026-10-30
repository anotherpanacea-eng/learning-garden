"""Synthetic Linear active-work/disclosure/focus preservation in the real app."""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading,copy
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path(os.environ.get('LINEAR_FOCUS_ARTIFACTS',tempfile.mkdtemp(prefix='linear-focus-')));OUT.mkdir(parents=True,exist_ok=True)
checks=0;errors=[]
def ok(v,m):
 global checks
 assert v,m
 checks+=1
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True

def fixture():
 js="""import {readFileSync} from 'node:fs';import {initializeExplorerState,prepareProgressImport} from './dist/progress-transfer.mjs';import {createLinearInvestigation,startLinear,setLinearPage,setLinearField,setLinearX,setLinearNote,keepLinear} from './dist/linear-pathway-core.mjs';const s=initializeExplorerState(JSON.parse(readFileSync('./test/fixtures/linear-before-signed.json','utf8'))),o={canExport:c=>prepareProgressImport(JSON.stringify(c)).ok};s.garden.welcomeFilmSeen=true;for(let i=0;i<12;i++)createLinearInvestigation(s,['revisit','unknown','contrast'][i%3],o);startLinear(s,'views',o);setLinearPage(s,2,o);setLinearX(s,4,o);setLinearField(s,'own','height','5',o);setLinearField(s,'own','b','-3',o);setLinearNote(s,'First fixture explanation',o);keepLinear(s,o);setLinearNote(s,'Latest fixture explanation',o);keepLinear(s,o);console.log(JSON.stringify(s));"""
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
def book(p):return p.evaluate('window.__focusRead()')
def raw(p):return p.evaluate('Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith("number-garden")||k==="learning-garden-explorers"))')
def view(p):
 r=book(p)['linearPathway'];return r['lessons'][r['currentId']]
def ready(p):p.locator('[data-linear-root]').wait_for()
def choices(p,opened=True):
 d=p.locator('[data-linear-choices]')
 if (d.get_attribute('open') is not None)!=opened:d.locator('summary').tap()
def heading_visible(p,selector):
 r=p.locator(selector).bounding_box();return r and r['y']>=0 and r['y']+r['height']<=p.viewport_size['height']
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 for e in p.locator('.linear-page button:visible,.linear-page a:visible,.linear-page select:visible,.linear-page input:visible,.linear-page summary:visible').all():
  r=e.bounding_box();ok(r and r['height']>=43.9,'44px target '+e.text_content()[:35])
def setup(browser,base,seed,width,height,route='#learn/math'):
 c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,accept_downloads=True,reduced_motion='reduce');c.add_init_script("""(s=>{if(!localStorage.getItem('linear-focus-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('linear-focus-fixture','1');}window.focusWrites=0;const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith('number-garden')||k==='learning-garden-explorers')focusWrites++;return set.call(this,k,v);};})("""+json.dumps(seed)+')')
 def app(route):
  response=route.fetch();body=response.text();assert 'let graph=null,' in body and 'bindLinear(state,options)' in body;body=body.replace('let graph=null,','window.__focusRead=()=>structuredClone(state);let graph=null,',1).replace('bindLinear(state,options)','bindLinear(state,{...options,canExport:c=>!window.__focusRefuse&&options.canExport(c)})');route.fulfill(response=response,body=body)
 c.route('**/app.mjs',app);p=c.new_page();p.set_default_timeout(15000);p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base+route,wait_until='networkidle');ready(p);return c,p

def active(browser,base,seed,width,height):
 c,p=setup(browser,base,seed,width,height)
 try:
  ok(p.locator('[data-linear-choices]').get_attribute('open') is None,'active chooser initially closed');accessible=p.locator('[data-linear-choices] summary').aria_snapshot();ok('Choose another lesson or investigation' in accessible and '＋' not in accessible and '−' not in accessible,'native summary accessible text excludes decorative marker');ok(len(book(p)['linearPathway']['lessons'])>=12,'substantial saved catalog fixture')
  if width>=820:ok(heading_visible(p,'#linear-turn') and heading_visible(p,'#linear-reference'),'active page and reference initially visible on iPad-sized viewport')
  layout(p);p.screenshot(path=str(OUT/f'active-{width}.png'),full_page=True)
  if width==820:
   before=(book(p),raw(p),p.evaluate('focusWrites'));p.locator('html').evaluate("e=>e.style.fontSize='150%'");layout(p);p.locator('[data-linear-see-model]').tap();ok(heading_visible(p,'#linear-reference'),'larger text model heading visible after jump');p.locator('[data-linear-back-to-page]').tap();ok(heading_visible(p,'#linear-turn'),'larger text page heading visible after return');ok((book(p),raw(p),p.evaluate('focusWrites'))==before,'larger-text focus jumps do not write');p.locator('html').evaluate("e=>e.style.fontSize=''");p.evaluate('scrollTo(0,0)')
  field=p.locator('[data-linear-item=own][data-linear-field=height]');element=field.element_handle();before=(book(p),raw(p),p.evaluate('focusWrites'))
  choices(p);choices(p,False);ok((book(p),raw(p),p.evaluate('focusWrites'))==before,'native disclosure toggles do not write or change notebook');ok(element.evaluate('e=>e.isConnected') and field.input_value()=='5','toggling keeps actual task input DOM/value')
  summary=p.locator('[data-linear-choices] summary');summary.focus();p.keyboard.press('Enter');ok(p.locator('[data-linear-choices]').get_attribute('open') is not None,'keyboard opens native disclosure')
  p.locator('[data-linear-challenge]').select_option('unknown');p.locator('[data-linear-remove-choice]').select_option('investigation-48');p.locator('[data-linear-delta="1"]').tap();ok(p.locator('[data-linear-choices]').get_attribute('open') is not None,'stepper redraw keeps chooser open');ok(p.locator('[data-linear-challenge]').input_value()=='unknown' and p.locator('[data-linear-remove-choice]').input_value()=='investigation-48','same-visit redraw retains explicit transient selections')
  ok(p.locator('[data-linear-delta="1"]').evaluate('e=>e===document.activeElement'),'stepper retains native focus');p.locator('[data-linear-page="1"]').first.tap();ok(p.locator('[data-linear-choices]').get_attribute('open') is not None,'page redraw preserves disclosure');p.locator('[data-linear-page="2"]').first.tap();p.locator('[data-linear-help=own][data-help-kind=hint]').tap();ok(p.locator('[data-linear-choices]').get_attribute('open') is not None and p.locator('[data-linear-challenge]').input_value()=='unknown','help redraw preserves explicit choice');p.locator('[data-linear-check=own]').tap();ok(p.locator('[data-linear-choices]').get_attribute('open') is not None,'check redraw preserves disclosure')
  choices(p,False);before=(book(p),raw(p),p.url,p.evaluate('focusWrites'));p.locator('[data-linear-create]').evaluate('e=>e.click()');p.locator('[data-linear-start=halves]').evaluate('e=>e.click()');p.locator('[data-linear-remove]').evaluate('e=>e.click()');p.locator('[data-linear-choices] a[href="#notes"]').evaluate('e=>e.click()');p.locator('[data-linear-choices] a[href="#desk/linear"]').evaluate('e=>e.click()');ok((book(p),raw(p),p.url,p.evaluate('focusWrites'))==before,'closed chooser buttons and anchors are inert')
  # Refused text lives in DOM only. Toggle/jump may help without discarding it.
  p.evaluate('window.__focusRefuse=true');field=p.locator('[data-linear-item=own][data-linear-field=height]');field.fill('777');ok(field.input_value()=='777' and view(p)['drafts']['own']['height']=='5','refused value stays visible without replacing saved draft');element=field.element_handle();before=(book(p),raw(p),p.evaluate('focusWrites'))
  choices(p);p.locator('[data-linear-see-model]').tap();ok(p.locator('#linear-reference').evaluate('e=>e===document.activeElement') and heading_visible(p,'#linear-reference'),'model jump uses visible actual heading');p.locator('[data-linear-back-to-page]').tap();ok(p.locator('#linear-turn').evaluate('e=>e===document.activeElement') and heading_visible(p,'#linear-turn'),'return jump focuses current page');choices(p,False)
  ok((book(p),raw(p),p.evaluate('focusWrites'))==before and element.evaluate('e=>e.isConnected') and field.input_value()=='777','refused words survive toggles/jumps with no mutation')
  p.evaluate('window.__focusRefuse=false');field.fill('5');p.locator('[data-linear-page="3"]').first.tap();choices(p);p.locator('[data-linear-note]').fill('A new synthetic explanation');p.locator('[data-linear-keep]').tap();ok(p.locator('[data-linear-choices]').get_attribute('open') is not None,'keep preserves disclosure');ok(view(p)['firstKept']['note']=='First fixture explanation' and view(p)['kept']['note']=='A new synthetic explanation','first/latest writing remains separate')
  # Preserve selected-only removal and make focus visible.
  p.locator('[data-linear-remove-choice]').select_option('investigation-48');held=copy.deepcopy(book(p)['linearPathway']);p.once('dialog',lambda d:d.dismiss());p.locator('[data-linear-remove]').tap();ok(book(p)['linearPathway']==held,'cancel removal preserves notebook');p.once('dialog',lambda d:d.accept());p.locator('[data-linear-remove]').tap();ok(p.locator('[data-linear-choices]').get_attribute('open') is not None and p.locator('#linear-exploration').evaluate('e=>e===document.activeElement'),'confirmed removal keeps visible chooser focus');ok('investigation-48' not in book(p)['linearPathway']['lessons'] and book(p)['linearPathway']['lessons']['views']==held['lessons']['views'],'only selected visit removed')
  # Native create uses the explicit selection retained through earlier model/page actions.
  p.locator('[data-linear-challenge]').select_option('unknown');p.locator('[data-linear-delta="-1"]').tap();p.locator('[data-linear-create]').tap();p.wait_for_function("location.hash.includes('investigation-60')");ready(p);ok(view(p)['source']['generation']['challenge']=='unknown','create uses retained explicit challenge');ok(p.locator('[data-linear-choices]').get_attribute('open') is None,'new visit resets chooser closed')
  held=copy.deepcopy(book(p)['linearPathway']);choices(p);p.evaluate("window.oldLinearButton=document.querySelector('[data-linear-start=halves]');window.oldLinearLink=document.querySelector('[data-linear-choices] a[href=\"#notes\"]')")
  p.evaluate("location.hash='#notes'");p.locator('#download').wait_for()
  with p.expect_download() as dl:p.locator('#download').tap()
  file=OUT/f'notes-{width}.json';dl.value.save_as(str(file));exported=json.loads(file.read_text());ok(exported['linearPathway']==held,'actual export preserves all remaining visits');p.locator('#progress-file').set_input_files(str(file));p.locator('#progress-import-confirm').wait_for();p.locator('#progress-import-confirm').tap();p.wait_for_function("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId==='explorer-2'");p.evaluate("location.hash='#learn/math'");ready(p);ok(p.locator('[data-linear-choices]').get_attribute('open') is None,'import replacement resets chooser');before=(book(p),p.url);p.evaluate('oldLinearButton.click();oldLinearLink.click()');ok((book(p),p.url)==before,'detached controls/anchors cannot alter replacement work');choices(p);p.reload(wait_until='networkidle');p.locator('[data-select-explorer=explorer-2]').tap();ready(p);ok(p.locator('[data-linear-choices]').get_attribute('open') is None and book(p)['linearPathway']==held,'reload resets chooser with notebook exact')
  p.evaluate("location.hash='#notes'");p.locator('#remember').uncheck();p.evaluate("location.hash='#learn/math'");ready(p);before=p.evaluate('focusWrites');choices(p);choices(p,False);p.locator('[data-linear-see-model]').tap();p.locator('[data-linear-back-to-page]').tap();ok(p.evaluate('focusWrites')==before and not p.evaluate("Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"),'saving-off toggles/jumps recreate no saves');layout(p);print('focus active',width,'passed',flush=True)
 finally:c.close()

def preview_removal(browser,base,seed):
 c,p=setup(browser,base,seed,820,1000,'#learn/math/investigation-48')
 try:
  ok(not p.locator('[data-linear-x]').count() and p.locator('[data-linear-choices]').get_attribute('open') is None,'different source preview hides active model and chooser');before=book(p)['linearPathway']['currentId'];choices(p);p.locator('[data-linear-remove-choice]').select_option('investigation-48');p.once('dialog',lambda d:d.accept());p.locator('[data-linear-remove]').tap();ok(p.locator('[data-linear-choices]').get_attribute('open') is not None,'removing preview keeps chooser open');ok(p.locator('#linear-exploration').evaluate('e=>e===document.activeElement'),'removal feedback has visible focus');ok(book(p)['linearPathway']['currentId']==before,'removing preview leaves active source intact')
 finally:c.close()
 # Active generated A removed while previewing B: B survives as a preview.
 other=copy.deepcopy(seed);other['linearPathway']['currentId']='investigation-49';c,p=setup(browser,base,other,820,1000,'#learn/math/investigation-48')
 try:
  choices(p);p.locator('[data-linear-remove-choice]').select_option('investigation-49');p.once('dialog',lambda d:d.accept());p.locator('[data-linear-remove]').tap();ok(book(p)['linearPathway']['currentId']=='','active source removed explicitly');ok('Start or continue this lesson' in p.locator('.linear-turn').text_content(),'different requested preview survives');ok(p.locator('[data-linear-choices]').get_attribute('open') is not None and p.locator('#linear-exploration').evaluate('e=>e===document.activeElement'),'post-removal override prevents hidden focus in surviving preview');p.locator('.linear-turn [data-linear-start=investigation-48]').tap();p.locator('[data-linear-x]').wait_for();ok(p.locator('[data-linear-choices]').get_attribute('open') is None,'explicit preview start resets chooser')
 finally:c.close()

def main():
 seed=fixture();server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('LINEAR_FOCUS_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
   try:
    for w,h in [(320,600),(820,1000),(1024,768)]:active(b,base,seed,w,h)
    preview_removal(b,base,seed);ok(not errors,'no page errors '+str(errors));result={'checks':checks,'status':'passed','base':base,'limits':'Synthetic Chrome touch/keyboard/transfer; not physical iPad/Safari, VoiceOver or learning effects.'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
   finally:b.close()
 finally:server.shutdown()
if __name__=='__main__':main()
