"""Which Ones424 actual-app Chromium, synthetic notebooks and nonaudible speech.
One full journey plus focused responsive/lifecycle probes. No Safari, physical
hardware, audible voice, VoiceOver or learning qualification is implied.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,json,os,subprocess,tempfile,threading,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('SENTENCE_GROUPS_ARTIFACTS') or tempfile.mkdtemp(prefix='sentence-groups-',dir='/private/tmp'))
OUT.mkdir(parents=True,exist_ok=True)
errors=[]
def ok(value,message): assert value,message
def node(code):return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))
def fixture():return node("import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticSibling={version:999,raw:['invented',73],nested:{future:true}};console.log(JSON.stringify(s));")
SRC=node("import{groupScenes,groupCopy,groupTeaching}from'./dist/sentence-groups-content.mjs';console.log(JSON.stringify({scenes:groupScenes,copy:groupCopy,teaching:groupTeaching}));")
# Independent literal message/set/property oracle, not a production assembler.
ROWS=[
 ('couriers-mixed','Courier',['blue bag','gold bag','blue bag'],'ac','conflicts',('The couriers will get route cards.','The couriers who have blue bags will get route cards.','The couriers, who have blue bags, will get route cards.')),
 ('couriers-all','Courier',['blue bag']*3,'abc','fits',('The couriers will get route cards.','The couriers who have blue bags will get route cards.','The couriers, who have blue bags, will get route cards.')),
 ('parcels-mixed','Parcel',['plain label','star label','star label'],'bc','conflicts',('The parcels will go on the cart.','The parcels which have star labels will go on the cart.','The parcels, which have star labels, will go on the cart.')),
 ('parcels-all','Parcel',['star label']*3,'abc','fits',('The parcels will go on the cart.','The parcels which have star labels will go on the cart.','The parcels, which have star labels, will go on the cart.')),
 ('books-mixed','Book',['red cover','red cover','green cover'],'ab','conflicts',('The books will go on the display table.','The books which have red covers will go on the display table.','The books, which have red covers, will go on the display table.')),
 ('books-all','Book',['red cover']*3,'abc','fits',('The books will go on the display table.','The books which have red covers will go on the display table.','The books, which have red covers, will go on the display table.'))]
def sel(action,value=None):return '[data-groups-action="'+action+'"]'+('' if value is None else '[data-groups-value="'+str(value)+'"]')
def act(p,a,v=None):
 p.locator(sel(a,v)).click();ok(p.evaluate('document.activeElement.isConnected&&!document.activeElement.disabled&&document.activeElement.getClientRects().length>0'),'live usable focus after '+a)
def mode(p,m='groups'):p.locator('[data-bridges-mode-choice="'+m+'"]').click()
def sentence(p):return p.locator('#groups-sentence').inner_text()
def marks(p):return p.locator('[data-groups-member]').evaluate_all('xs=>xs.filter(x=>x.checked).map(x=>x.dataset.groupsMember).sort().join("")')
def choose(p,id):p.locator('[data-groups-scene]').select_option(id)
def go(p,base,route='#loft/bridges'):
 p.goto(base+route,wait_until='networkidle')
 if route=='#loft/bridges':p.locator('.bridges-page').wait_for()
def enter(p,base):go(p,base);mode(p)
def snapshot(p):return p.evaluate('({book:__groupsBook(),local:Object.entries(localStorage).sort(),session:Object.entries(sessionStorage).sort()})')
def speech(p):
 p.evaluate('groupsSpeech.words=[]');p.locator('[data-groups-read]').click();return p.evaluate('groupsSpeech.words.join(" ")')
def dispatch(e):e.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
def export(p,base,label):
 go(p,base,'#notes')
 with p.expect_download() as d:p.locator('#download').click()
 target=OUT/(label+'.json');d.value.save_as(str(target));data=json.loads(target.read_text());data.pop('exportedAt',None);return data

def setup(browser,base,width=1024):
 c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,reduced_motion='reduce',accept_downloads=True)
 registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-'+str(i),'avatar':a,'color':color,'symbol':s,'createdAt':'2026-11-07T12:00:00Z'}for i,a,color,s in [(1,'sky','blue','leaf'),(2,'fern','gold','acorn')]]}
 c.add_init_script("""d=>{if(!localStorage.getItem('groups-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem('number-garden-v1:'+e.id,JSON.stringify(d.seed));localStorage.setItem('groups-fixture','1');}window.groupsSpeech={words:[],cancel:0};window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};const s=speechSynthesis;s.getVoices=()=>[{name:'Synthetic English',lang:'en-US',localService:true,voiceURI:'synthetic'}];s.speak=u=>groupsSpeech.words.push(u.text);s.cancel=()=>groupsSpeech.cancel++;}""".replace('d=>','(d=>',1)+')('+json.dumps({'registry':registry,'seed':fixture()})+')')
 def app(route):
  r=route.fetch();body=r.text();ok(body.count('let graph=null,')==1,'actual memory hook marker unique');route.fulfill(response=r,body=body.replace('let graph=null,','window.__groupsBook=()=>structuredClone(state);let graph=null,',1))
 c.route('**/app.mjs',app);p=c.new_page();p.set_default_timeout(15000)
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 p.goto(base+'#loft/bridges',wait_until='networkidle')
 picker=p.locator('[data-select-explorer="explorer-1"]')
 if picker.count():
  picker.click();p.goto(base+"#loft/bridges",wait_until="networkidle")
 p.locator('.bridges-page').wait_for();return c,p

def hidden(p):
 html=p.locator('[data-groups-root]').inner_html();words=speech(p)
 ok('data-groups-reference' not in html and 'data-groups-verdict' not in html and 'data-groups-explanation' not in html,'Build HTML has no hidden model/feedback')
 ok('Message includes' not in words and 'Your marks match this message.' not in words and 'Compare your marks' not in words,'Build Hear keeps model/feedback hidden')
 for s in SRC['scenes']:ok(all(f['explanation'] not in html and f['explanation'] not in words for f in s['forms'].values()),'Build source/ARIA/dataset/narration excludes interpretations')
def layout(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal scroll')
 bad=p.locator('.bridges-page button,.bridges-page a,.bridges-page select,.bridges-page summary,.groups-member').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&(x.getBoundingClientRect().width<43.9||x.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.outerHTML.slice(0,130))')
 ok(not bad,'44px targets and16px native text '+str(bad))
 if p.locator(sel('check')).count():ok(p.locator(sel('check')).evaluate('e=>Boolean(document.querySelector(".groups-roster").compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING)'),'check action follows the selection cards')
 ok(p.locator('.groups-comma-word').evaluate_all('xs=>xs.every(e=>{const r=document.createRange();r.selectNodeContents(e);return Array.from(r.getClientRects()).every(x=>Math.abs(x.top-r.getClientRects()[0].top)<1)&&!/\\s,/.test(e.textContent)})'),'comma remains on preceding word without whitespace or orphan wrap')
 ok(p.locator('drawn-howto').count()==0,'no unrelated Joining guide in groups')

def journey(browser,base):
 print('Groups: six-scene full actual-app journey',flush=True);c,p=setup(browser,base)
 try:
  guide_before=snapshot(p)
  p.locator('drawn-howto .dh-open').click();p.locator('drawn-howto .dh-panel').wait_for();p.locator('[data-dh="close"]').click()
  p.locator('drawn-howto .dh-open').click();ok(p.locator('drawn-howto .dh-panel').is_visible(),'Joining guide reopens after Close');p.locator('[data-dh="close"]').click()
  p.keyboard.press('Enter');ok(p.locator('drawn-howto .dh-panel').is_visible(),'Joining guide reopens with keyboard after Close');p.locator('[data-dh="close"]').click()
  ok(snapshot(p)==guide_before,'Joining guide opening/closing leaves actual notebook and storage unchanged')
  baseline=export(p,base,'before');go(p,base);before=snapshot(p)
  p.locator('[data-bridges-action="word"][data-bridges-value="because"]').click();p.locator('[data-bridges-action="swap"]').click();joined=p.locator('.bridges-output').inner_text()
  mode(p,'details');p.locator('[data-details-action="attach"][data-details-value="parcel"]').click();detail=p.locator('[data-details-sentence]').inner_text()
  tab=p.locator('[data-bridges-mode-choice="details"]');tab.focus();p.keyboard.press('ArrowRight');ok(p.locator('[data-groups-root]').count()==1,'Right arrow reaches third tab')
  for key,want in [('ArrowRight','joins'),('ArrowLeft','groups'),('Home','joins'),('End','groups')]:
   p.keyboard.press(key);ok(p.locator('.bridges-page').get_attribute('data-bridges-mode')==want,'three-tab '+key);ok(p.locator('[role=tab][aria-selected=true]').evaluate('e=>e===document.activeElement&&e.tabIndex===0'),'roving native tab focus')
  for row,src in zip(ROWS,SRC['scenes']):
   id,label,features,expected,extra,messages=row;choose(p,id)
   for f in range(3):
    if f==1:act(p,'attach')
    if f==2:act(p,'commas')
    ok(sentence(p)==messages[f],id+' exact form '+str(f));hidden(p)
    for member,feature in zip('abc',features):
     q=p.locator('[data-groups-figure="'+member+'"]');ok(feature in q.inner_text() and label+' '+member.upper() in q.inner_text(),'visible independent source feature')
    wanted=expected if f==1 else 'abc'
    for member in 'abc':
     if (member in wanted)!=(member in marks(p)):p.locator('[data-groups-member="'+member+'"]').click()
    original=marks(p);act(p,'check');ok(p.locator('[data-groups-marked]').inner_text()==p.locator('[data-groups-reference]').inner_text(),'independent expected group matches model');ok(p.locator('[data-groups-verdict]').inner_text()=='Your marks match this message.','check set equality')
    status='omitted' if f==0 else 'fits' if f==1 else extra;explanation=p.locator('[data-groups-explanation]').inner_text()
    ok(('says nothing about' in explanation) if status=='omitted' else ('does not fit' in explanation) if status=='conflicts' else ('does not fit' not in explanation and 'says nothing about' not in explanation),'expected source-property status '+status)
    ok(p.locator('[data-groups-reference]').inner_text()==(' and '.join([label+' '+x.upper() for x in wanted]) if len(wanted)==2 else label+' A, '+label+' B, and '+label+' C'),'independent reference names')
    ok(explanation in speech(p),'Meaning speaks current interpretation');act(p,'page','message');ok(marks(p)==original,'check never replaces marks');hidden(p)
   # Change marks after wording snapshot: Undo must preserve the latest response.
   p.locator('[data-groups-member="b"]').click();kept=marks(p);act(p,'remove');ok(sentence(p)==messages[0] and marks(p)==kept,'remove keeps responses');act(p,'undo');ok(sentence(p)==messages[2] and marks(p)==kept,'Undo restores wording only');act(p,'remove');act(p,'attach');ok(sentence(p)==messages[1] and marks(p)==kept,'restore detail omits commas and keeps marks')
   act(p,'page','meaning');ok(p.locator('[data-groups-verdict]').count()==0,'unchecked reveal has no verdict');act(p,'page','message');ok(marks(p)==kept,'reveal never fills response')
  choose(p,'couriers-mixed');ok(sentence(p)==ROWS[0][5][1],'scene cache restores earlier wording');waiting=sentence(p);kept=marks(p)
  act(p,'teaching-open')
  for i,card in enumerate(SRC['teaching']):
   if i:act(p,'teaching-step',1)
   words=speech(p);ok(p.locator('#groups-teaching-title').inner_text()==card['title'] and card['title'] in words,'current teaching title');ok(all(b['text'] in words for b in card['blocks']),'current teaching separate complete blocks');ok('Message includes' not in words and 'Your marks:' not in words,'teaching omits waiting response/model')
   if i==3:
    ok('Grammar names:' in p.locator('[data-groups-root]').inner_text(),'formal grammar names visible');layout(p);p.screenshot(path=str(OUT/'teaching-1024.png'),full_page=True)
  ok(p.locator(sel('teaching-step',1)).is_disabled(),'bounded last teaching card');act(p,'teaching-close');ok(sentence(p)==waiting and marks(p)==kept,'teaching returns exact waiting work')
  for panel in ['facts','talk','grownup']:
   q=p.locator('[data-groups-panel="'+panel+'"]');q.locator('summary').click();q.locator('summary').click();q.locator('summary').click()
  words=speech(p);ok(SRC['copy']['talk'] in words and SRC['copy']['grownup'] in words,'elected native drawers spoken');choose(p,'books-all');ok(p.locator('[data-groups-panel=facts]').evaluate('e=>e.open'),'native fold preference survives current scene operation')
  mode(p,'joins');ok(p.locator('.bridges-output').inner_text()==joined,'joins work preserved');mode(p,'details');ok(p.locator('[data-details-sentence]').inner_text()==detail,'Which One work preserved');mode(p)
  ok(snapshot(p)==before,'actual memory and full local/session storage unchanged by visit');ok(snapshot(p)['book']['syntheticSibling']==fixture()['syntheticSibling'],'opaque sibling exact');layout(p);p.screenshot(path=str(OUT/'desktop-1024.png'),full_page=True)
  ok(export(p,base,'after')==baseline,'real downloaded Notes unchanged except exportedAt')
  enter(p,base);ok(sentence(p)==ROWS[0][5][0] and marks(p)=='','route exit clears work');act(p,'attach');p.reload(wait_until='networkidle');pick=p.locator('[data-select-explorer=explorer-1]');pick.click() if pick.count() else None;go(p,base);mode(p);ok(sentence(p)==ROWS[0][5][0],'reload clears work')
 finally:c.close()

def contexts(browser,base):
 print('Groups: responsive and enabled stale callbacks',flush=True)
 for width in [320,820]:
  c,p=setup(browser,base,width)
  try:
   mode(p);choose(p,'books-all');act(p,'attach');act(p,'commas');layout(p);p.screenshot(path=str(OUT/f'commas-{width}.png'),full_page=True);act(p,'check');layout(p);p.screenshot(path=str(OUT/f'meaning-{width}.png'),full_page=True)
  finally:c.close()
 # Every hostile probe starts with an enabled Add operation which would visibly
 # change plain to identifying; before/after speech includes cancel as well as speak.
 for mutation in ['detach','reparent','hidden','inert','aria','style','class','root']:
  print('Retirement: '+mutation,flush=True)
  c,p=setup(browser,base)
  try:
   mode(p);ok(bool(speech(p)),'current Hear speaks before retirement');old=p.locator(sel('attach')).element_handle();read=p.locator('[data-groups-read]').element_handle();ok(old.is_enabled(),'probe uses enabled effective control')
   js={
    'detach':'const parent=e.parentNode,next=e.nextSibling;e.remove();parent.insertBefore(e,next)',
    'reparent':'const parent=e.parentNode;document.querySelector("[data-groups-root]").append(e);parent.append(e)',
    'hidden':'e.hidden=true;e.hidden=false',
    'inert':'e.inert=true;e.inert=false',
    'aria':'e.setAttribute("aria-hidden","true");e.removeAttribute("aria-hidden")',
    'style':'e.style.display="none";e.style.removeProperty("display")',
    'class':'e.classList.add("synthetic-hidden");e.classList.remove("synthetic-hidden")',
    'root':'const r=document.querySelector(".bridges-page"),parent=r.parentNode,next=r.nextSibling;r.remove();parent.insertBefore(r,next)'}[mutation]
   old.evaluate('e=>{'+js+'}')
   # Independently retire Hear in the same way, except root removal already does it.
   if mutation!='root':read.evaluate('e=>{'+js+'}')
   before=snapshot(p);voice=p.evaluate('JSON.stringify(groupsSpeech)');dispatch(old);dispatch(read)
   ok(sentence(p)==ROWS[0][5][0] and snapshot(p)==before and p.evaluate('JSON.stringify(groupsSpeech)')==voice,'retired '+mutation+' effective Add/Hear cannot change work or speech')
   p.locator('[data-stop-speech]').first.click();ok(p.evaluate('groupsSpeech.cancel')>json.loads(voice)['cancel'],'global Stop remains usable after '+mutation)
  finally:c.close()
 c,p=setup(browser,base)
 try:
  mode(p);ok(bool(speech(p)),'current Hear speaks before retirement');old=p.locator(sel('attach')).element_handle();read=p.locator('[data-groups-read]').element_handle();p.locator('[data-groups-member=a]').click()
  # Outer root is deliberately retained by partial redraw; old enabled Add would
  # still be effective if its obsolete listener were incorrectly accepted.
  old.evaluate('e=>document.querySelector(".groups-edits").append(e)');read.evaluate('e=>document.querySelector(".groups-help-actions").append(e)');voice=p.evaluate('JSON.stringify(groupsSpeech)');dispatch(old);dispatch(read);ok(sentence(p)==ROWS[0][5][0] and marks(p)=='a' and p.evaluate('JSON.stringify(groupsSpeech)')==voice,'obsolete partial render cannot change or speak')
  old.evaluate('e=>e.remove()');read.evaluate('e=>e.remove()');act(p,'attach');ok(sentence(p)==ROWS[0][5][1],'current effective operation succeeds after stale probe')
  stale=p.locator(sel('remove')).element_handle();stale_read=p.locator('[data-groups-read]').element_handle();mode(p,'joins');mode(p);stale.evaluate('e=>document.querySelector(".groups-edits").append(e)');voice=p.evaluate('JSON.stringify(groupsSpeech)');dispatch(stale);dispatch(stale_read);ok(sentence(p)==ROWS[0][5][1] and p.evaluate('JSON.stringify(groupsSpeech)')==voice,'restored same mode cannot revive prior mount')
 finally:c.close()


def recovery(browser,base):
 print('Groups: actual explorer/import/reset/save-off lifetimes',flush=True)
 for operation in ['owner','import','reset','saveoff','route']:
  c,p=setup(browser,base)
  try:
   mode(p);act(p,'attach');old=p.locator(sel('remove')).element_handle();read=p.locator('[data-groups-read]').element_handle()
   if operation=='owner':
    p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();go(p,base);mode(p)
   elif operation=='import':
    go(p,base,'#notes');p.locator('#progress-file').set_input_files({'name':'invented-groups.json','mimeType':'application/json','buffer':json.dumps(fixture()).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for();enter(p,base)
   elif operation=='reset':
    go(p,base,'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click()
    if p.locator('[data-film-skip]').count():p.locator('[data-film-skip]').click()
    enter(p,base)
   elif operation=='saveoff':
    go(p,base,'#notes');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click();enter(p,base)
   else:go(p,base,'#loft');enter(p,base)
   ok(sentence(p)==ROWS[0][5][0] and marks(p)=='','actual '+operation+' clears temporary work')
   # Make current wording removable, so a stale Remove would cause an effect.
   act(p,'attach');old.evaluate('e=>document.querySelector(".groups-edits").append(e)');voice=p.evaluate('JSON.stringify(groupsSpeech)');before=snapshot(p);dispatch(old);dispatch(read)
   ok(sentence(p)==ROWS[0][5][1] and snapshot(p)==before and p.evaluate('JSON.stringify(groupsSpeech)')==voice,'stale '+operation+' Remove/Hear cannot affect new room/owner')
   old.evaluate('e=>e.remove()')
   if operation=='saveoff':
    before=snapshot(p);act(p,'commas');p.locator('[data-groups-member=b]').click();ok(snapshot(p)==before,'saving-off trial changes no notebook or either storage')
  finally:c.close()

class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True

def main():
 server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
 print('Artifacts: '+str(OUT),flush=True)
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
   try:
    journey(browser,base);contexts(browser,base);recovery(browser,base);ok(not errors,'no browser errors '+str(errors));receipt={'status':'passed','scope':__doc__,'artifacts':str(OUT)};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
   except Exception:(OUT/'failure.txt').write_text(traceback.format_exc());raise
   finally:browser.close()
 finally:server.shutdown();server.server_close()
if __name__=='__main__':main()
