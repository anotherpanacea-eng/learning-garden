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
two_units=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {startEvidenceVoice,setEvidenceText,keepEvidence} from './dist/evidence-voice-core.mjs';console.log(JSON.stringify([1,2].map(n=>{const s=freshState(),o={canExport:()=>true,lesson:'write'};startEvidenceVoice(s,'clock-river',o);setEvidenceText(s,'paragraph',`Synthetic explorer ${n}\\r\\nexact own draft`,o);keepEvidence(s,'draft',o);return s;})));"],cwd=ROOT,text=True))
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
   # Two saved explorers force the real reload picker. Selecting or creating must
   # preserve a requested subject destination instead of falling through to Home.
   profiles=[{'id':f'explorer-{n}','avatar':'sky','color':'gold' if n==1 else 'rose','symbol':'leaf' if n==1 else 'acorn','createdAt':'2026-10-25T00:00:00Z'} for n in [1,2]]
   states={}
   for n,unit in enumerate(two_units,1):
    item=copy.deepcopy(unit);item['garden']=copy.deepcopy(future);item['garden']['visits'][0]['drafts']['retained']=f'Explorer {n}: exact pending words\r\nsecond line';item['linearPathway']={'version':7,'future':['raw sibling',n]};states[f'explorer-{n}']=item
   registry={'version':1,'activeId':'explorer-1','explorers':profiles}
   for route in ['#pathways/math','#learn/english/write']:
    c=b.new_context(viewport={'width':820,'height':1000})
    seeded={'learning-garden-explorers':json.dumps(registry),**{f'number-garden-v1:{k}':json.dumps(v) for k,v in states.items()}}
    c.add_init_script("if(!localStorage.getItem('two-subject-fixture')){for(const [k,v] of Object.entries("+json.dumps(seeded)+"))localStorage.setItem(k,v);localStorage.setItem('two-subject-fixture','1');}")
    p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(BASE+route);p.locator('[data-select-explorer="explorer-2"]').wait_for()
    ok(p.locator('.welcome-film').count()==0,'multi-explorer reload picker has no film')
    p.reload();p.locator('[data-select-explorer="explorer-2"]').wait_for();ok(p.url.endswith(route),'reload keeps requested route while choosing')
    p.locator('[data-select-explorer="explorer-2"]').click();p.locator('[data-pathway-root]' if route.startswith('#pathways') else '[data-ev-root]').wait_for()
    ok(p.url.endswith(route),'select returns to exact requested subject route')
    ok(p.locator('.welcome-film').count()==0,'select subject destination does not play welcome film')
    chosen=notebook(p);ok(chosen['garden']==states['explorer-2']['garden'],'select retains chosen legacy visit/drafts/seen/guide')
    ok(chosen['linearPathway']==states['explorer-2']['linearPathway'],'select retains chosen raw sibling')
    ok(chosen['evidenceVoice']==states['explorer-2']['evidenceVoice'],'select restores chosen own unit exactly')
    ok(p.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1'))")==states['explorer-1'],'select leaves other explorer work intact')
    if route.startswith('#learn'):
     ok(p.locator('[data-ev-field="paragraph"]').input_value()=='Synthetic explorer 2\nexact own draft','chosen unit appears for the selected explorer')
    p.reload();p.locator('[data-select-explorer="explorer-2"]').wait_for();p.locator('#explorer-new').click();p.locator('#explorer-create').click();p.locator('[data-pathway-root]' if route.startswith('#pathways') else '[data-ev-root]').wait_for()
    ok(p.url.endswith(route),'create returns to exact requested subject route')
    ok(p.locator('.welcome-film').count()==0,'created explorer enters subject without welcome film')
    ok(set(notebook(p)['garden'])=={'avatar'},'creation does not initialize unrelated destinations')
    for key in ['explorer-1','explorer-2']:ok(p.evaluate("id=>JSON.parse(localStorage.getItem('number-garden-v1:'+id))",key)==states[key],'creation preserves existing '+key)
    ok(not errors,'multi-explorer page errors: '+str(errors));c.close()
   # Showing a positive-rate math table qualifies its exact visible facts while
   # retaining unrelated unknown legacy data. This must bypass legacy normalizers.
   retained_broad={'observations':[{'future':'retain observation'}],'activityObservations':[{'future':'retain activity'}],'trails':{'future':['raw trail']},'closedDrafts':[{'future':'raw closed draft'}],'journey':{'future':'raw journey'},'seenItems':['retained-item'],'seenVariants':[{'future':'raw variant'}],'seenFacts':['retained-fact'],'drafts':{'activity:matching':{'question':{'id':'matching','fact':[2,3]},'attempts':'future attempts','text':'exact matching draft\r\nline'},'activity:unrelated':{'question':{'id':'unrelated','fact':[7,8]},'attempts':'future attempts','text':'exact unrelated draft'}}}
   directed={f'{a}x{b}' for n in range(1,7) for a,b in [(2,n),(n,2)]}
   canonical={f'{min(2,n)}x{max(2,n)}' for n in range(1,7)}
   for retained in [False,True]:
    s=copy.deepcopy(raw);s['baseline']['draft']={'questionId':'groups','attempts':[],'input':'pending original check-in'}
    if retained:s['garden']=copy.deepcopy(future);s['broad']=copy.deepcopy(retained_broad)
    c=b.new_context(viewport={'width':820,'height':1000});c.add_init_script("if(!localStorage.getItem('math-exposure-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(s))+");localStorage.setItem('math-exposure-fixture','1');}")
    p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(BASE+'#learn/math/views');p.locator('.linear-turn [data-linear-start="views"]').click();p.locator('.linear-reference').wait_for()
    got=notebook(p);ok(set(got['exposures'])==directed,'visible rate2 qualifies only2x1..6 and reciprocal facts');ok(got['baseline']==s['baseline'],'unrelated original check-in remains exact')
    broad=got['broad']
    if retained:
     ok(got['garden']==future,'positive math display preserves future garden visit/drafts/guide/seen/observations')
     expected=copy.deepcopy(retained_broad);expected['drafts']['activity:matching']['knownFact']=True
     for key in ['seenItems','seenVariants','seenFacts']:
      ok(broad[key][:len(expected[key])]==expected[key],'retained raw '+key+' prefix is unchanged')
      expected[key]=broad[key]
     ok(broad==expected,'positive exposure changes no other broad records; matching draft only gains knownFact')
     ok(set(broad['seenFacts'][1:])==canonical,'broad facts match only visible rate2 facts')
    else:
     ok(set(got['garden'])=={'avatar'},'minimal positive math does not initialize garden')
     ok(set(broad)=={'seenItems','seenVariants','seenFacts','drafts'},'minimal positive math allocates exposure fields only')
     ok(set(broad['seenFacts'])==canonical,'minimal broad facts match visible rate2 facts')
    for page in [1,2,3]:
     p.locator(f'.linear-pages [data-linear-page="{page}"]').click();ok(set(notebook(p)['exposures'])==directed,'repeated page display adds no unrelated or fractional fact')
    before=notebook(p);p.reload();p.locator('.linear-reference').wait_for();ok(notebook(p)==before,'math reload preserves exact work and already-qualified facts');ok(p.locator('.welcome-film').count()==0,'math reload has no welcome film');ok(not errors,'positive math page errors: '+str(errors));c.close()
   unreadable=copy.deepcopy(raw);unreadable['garden']=copy.deepcopy(future);unreadable['broad']={'seenFacts':'retained unreadable fact list','drafts':{'future':['raw draft']}}
   c=b.new_context(viewport={'width':820,'height':1000});c.add_init_script("if(!localStorage.getItem('math-refusal-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(unreadable))+");localStorage.setItem('math-refusal-fixture','1');}")
   p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(BASE+'#learn/math/views');p.locator('.linear-turn [data-linear-start="views"]').click();p.get_by_text('We couldn’t open this page and keep your work safe. Your earlier work is still here.').wait_for();got=notebook(p)
   ok(got['garden']==future and got['broad']==unreadable['broad'],'unreadable fact list refuses without normalizing legacy roots');ok('exposures' not in got,'refused source display adds no exposures');ok(p.locator('.linear-reference').count()==0,'refusal hides unqualified table and graph');p.reload();p.get_by_text('We couldn’t open this page and keep your work safe. Your earlier work is still here.').wait_for();ok(notebook(p)==got,'refusal reload keeps full saved state exact');ok(not errors,'refusal page errors: '+str(errors));c.close()
   print(f'Subject integration Chrome: {checks} assertions passed for direct entry, multi-explorer routes, safe positive math exposure and retained legacy work.')
  finally:b.close()
finally:
 if server:server.shutdown()
