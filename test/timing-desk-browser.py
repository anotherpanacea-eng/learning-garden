"""Synthetic spec 247 journeys in the actual persistent app. Run after production freeze."""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import threading
import tempfile
import time
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('TIMING_ARTIFACTS', str(Path(tempfile.gettempdir())/'learning-garden-timing-browser')))
OUT.mkdir(parents=True, exist_ok=True)
ROUTE = '#learn/math/timing-desk'
checks = 0
errors = []
latency = []
# Independently copied from the reviewed finite companion; no implementation answers as an oracle.
KEYS = {
 'day-water': {'water': ['15:00','same']}, 'day-message': {'message':['12:00','same']}, 'day-gap': {'lead':'3'},
 'night-arrivals': {'water':['02:30','next'],'message':['00:30','next']}, 'night-gap': {'lead':'2'},
 'rate-three': {'duration':'6'}, 'rate-four-half': {'duration':'4'}, 'rate-two': {'duration':'9'},
 'fast-day': {'water':['13:00','same'],'message':['12:00','same'],'lead':'1'},
 'fast-night': {'water':['00:30','next'],'message':['00:30','next'],'lead':'0'},
 'ordered-times': {'first':'4','second':'5','third':'6','fourth':'6','fifth':'7'},
 'median': {'median':'6'}, 'range': {'range':'3'}, 'minimum': {'minimum':'4'}, 'below-six': {'count':'2'},
}
CHOICES = {'which-origin':'after-rise','what-copy':'selected-undated'}
def ok(value, message):
    global checks
    assert value, message
    checks += 1
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
class PreviewServer(http.server.ThreadingHTTPServer):
    request_queue_size = 128

def fixtures():
    code = r"""
import * as T from './dist/timing-desk-core.mjs';
import {base,fresh,fill,makeOrdinaryFixture} from './test/timing-desk-checks.mjs';
const work=s=>T.timingView(s).work;
const seeds={base:base(),ordinary:makeOrdinaryFixture()};
const voice=fresh(),w=work(voice),p=w.source.pages[0],t=w.source.tasks[0];w.source.connections[0].text='CLOSED_CONNECTION_SENTINEL';
p.learn[0].text='VISIBLE_LEARNING_SENTINEL: two times three is six.';p.learn[0].facts=[[2,3]];
p.learn[1].text='HIDDEN_LEARNING_SENTINEL';t.context='VISIBLE_CONTEXT_SENTINEL: two times three is six.';t.facts=[[2,3]];
w.source.help['audio-'+p.id].text='AUDIO_METADATA_SENTINEL';w.source.help['audio-'+p.id].facts=[[7,8]];
w.source.help[t.hintId].text='UNREQUESTED_HINT_SENTINEL';w.source.help[t.exampleId].text='REQUESTED_EXAMPLE_SENTINEL: five times four is twenty.';w.source.help[t.exampleId].facts=[[5,4]];
const other=w.source.tasks.find(x=>x.pageId!==p.id).exampleId;w.source.help[other].text='ARCHIVED_HELPER_SENTINEL';w.source.help[other].facts=[[7,8]];w.help.push(other);seeds.voice=voice;
const inactive=fresh(),recordId=work(inactive).source.pages.find(p=>p.role==='record').id;T.pageTiming(inactive,recordId);T.learnTiming(inactive,recordId,'guided');let iw=work(inactive),rp=iw.source.pages.find(p=>p.id===recordId),it=iw.source.tasks.find(t=>t.pageId===rp.id);it.context='INACTIVE_QUESTION_SENTINEL 7 × 8 = 56.';it.facts=[[7,8]];rp.guided[0].text='INACTIVE_GUIDE_SENTINEL 7 × 8 = 56.';rp.guided[0].facts=[[7,8]];T.helpTiming(inactive,it.hintId);iw=work(inactive);iw.source.help[it.hintId].text='INACTIVE_HELPER_SENTINEL 7 × 8 = 56.';iw.source.help[it.hintId].facts=[[7,8]];T.recordModeTiming(inactive,'claims');seeds.inactive=inactive;
const old=fresh(),ow=work(old),os=ow.source;os.id='earlier-safe-source';os.title='Earlier synthetic timing source';os.tasks=os.tasks.filter(t=>t.id==='day-water');os.tasks[0].id='earlier-water';os.tasks[0].fields[0].id='earlier-clock';os.tasks[0].errors=[];os.parts=os.parts.slice(0,1);os.claims=os.claims.slice(0,1);os.records.entries=[];os.records.summary={ordered:[],median:null,range:null,min:null,belowThreshold:{hours:{n:6,d:1},count:0}};for(const p of os.pages){p.guided=[];delete p.guidedFor;}ow.tasks={[os.tasks[0].pageId]:'earlier-water'};ow.learn={};ow.shown=[];ow.help=[];ow.partId=os.parts[0].id;ow.claimId=os.claims[0].id;seeds.old=old;
const damaged=structuredClone(old);work(damaged).answers['earlier-water']={future:'exact unreadable draft'};work(damaged).kept={future:'exact unreadable latest keep'};damaged.timingDesk.visits['[raw visit]']={future:'exact unreadable visit'};seeds.damaged=damaged;
const ownModel=fresh(),mw=work(ownModel),m=mw.source.rateModel,previousModel=m.id;m.id='earlier-rate-model';m.title='Earlier two-kilometer model';m.rate={n:2,d:1};m.route={n:8,d:1};m.stages=[0,1,2,3,4].map(h=>({id:'earlier-stage-'+h,hours:{n:h,d:1},distance:{n:2*h,d:1},text:`Earlier stage: ${h} × 2 = ${2*h}.`,facts:h?[[2,h]]:[]}));for(const t of mw.source.tasks)t.contextRefs=t.contextRefs.map(id=>id===previousModel?m.id:id);mw.modelStage='earlier-stage-0';mw.pageId=mw.source.pages.find(p=>p.role==='rates').id;seeds.ownModel=ownModel;
const metadataHistory=fresh(),metadataPage=work(metadataHistory).source.pages[0];for(const prefix of ['audio-','together-']){const hid=prefix+metadataPage.id;work(metadataHistory).source.help[hid].text='HISTORY_METADATA_SENTINEL 7 × 8 = 56.';work(metadataHistory).source.help[hid].facts=[[7,8]];T.helpTiming(metadataHistory,hid);}fill(metadataHistory,work(metadataHistory).source.tasks[0]);for(const c of [work(metadataHistory).checks[0],work(metadataHistory).firstChecks['day-water']]){c.source.shown['unused-line']={id:'unused-line',text:'UNUSED_SHOWN_SENTINEL 7 × 8 = 56.',facts:[[7,8]]};c.source.help['unused-helper']={title:'Unused helper',text:'UNUSED_HELP_SENTINEL 9 × 10 = 90.',facts:[[9,10]]};}seeds.metadataHistory=metadataHistory;
const titleless=fresh();for(const t of work(titleless).source.tasks)delete t.title;for(const id of ['rate-three','rate-four-half','rate-two'])fill(titleless,work(titleless).source.tasks.find(t=>t.id===id));seeds.titleless=titleless;
const malformedClaim=fresh();T.pageTiming(malformedClaim,work(malformedClaim).source.pages.find(p=>p.role==='record').id);T.recordModeTiming(malformedClaim,'claims');work(malformedClaim).claims[work(malformedClaim).claimId]={future:'exact unreadable claim selection'};seeds.malformedClaim=malformedClaim;
const malformedFirstKeep=fresh();work(malformedFirstKeep).firstKept={future:'exact unreadable first keep'};T.pageTiming(malformedFirstKeep,work(malformedFirstKeep).source.pages.find(p=>p.role==='note').id);seeds.malformedFirstKeep=malformedFirstKeep;
const noteLabels=fresh();T.pageTiming(noteLabels,work(noteLabels).source.pages.find(p=>p.role==='note').id);T.suppliedTiming(noteLabels,'calculation','day-result');T.starterTiming(noteLabels,'calculation',false);T.writingTiming(noteLabels,'calculation','COMPACT_NOTE_BODY_SENTINEL');T.suppliedTiming(noteLabels,'uncertainty','minimum-limit');T.keepTiming(noteLabels);work(noteLabels).firstKept.renderedParts.find(p=>p.id==='next-record').unreadable=true;for(const p of work(noteLabels).source.parts)p.title='CHANGED_CURRENT_'+p.id;seeds.noteLabels=noteLabels;
const malformedFirst=fresh();work(malformedFirst).firstChecks['day-water']={future:'exact unreadable first'};seeds.malformedFirst=malformedFirst;
const malformedHelp=fresh();work(malformedHelp).helpOpen={future:'exact unreadable helpOpen'};seeds.malformedHelp=malformedHelp;
const visitsCap=base();for(let i=0;i<8;i++)T.startTiming(visitsCap);seeds.visitsCap=visitsCap;
const claimsCap=fresh();T.pageTiming(claimsCap,work(claimsCap).source.pages.find(p=>p.role==='record').id);T.recordModeTiming(claimsCap,'claims');for(let i=0;i<24;i++)T.assignTiming(claimsCap,work(claimsCap).source.claims[0].id,['support','against','open'][i%3]);seeds.claimsCap=claimsCap;
const checksCap=fresh();fill(checksCap,work(checksCap).source.tasks.find(t=>t.id==='day-gap'));work(checksCap).checks=Array.from({length:40},()=>structuredClone(work(checksCap).checks[0]));seeds.checksCap=checksCap;
const history=fresh();fill(history,work(history).source.tasks.find(t=>t.id==='rate-three'));let hw=work(history);hw.checks.push({taskId:'rate-three',future:'exact unreadable latest'});hw.source.tasks=hw.source.tasks.filter(t=>t.id!=='rate-three');hw.tasks[hw.source.pages.find(p=>p.role==='rates').id]='rate-two';const hpage=hw.source.pages.find(p=>p.role==='rates');delete hpage.guidedFor;hpage.guided=[];hw.pageId=hw.source.pages.find(p=>p.role==='journeys').id;hw.review={kind:'closed'};seeds.history=history;
const future=base();future.timingDesk={version:999,raw:['exact future synthetic root']};seeds.future=future;
console.log(JSON.stringify(seeds));
"""
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))

def book(p): return p.evaluate('()=>window.__timingRead()')
def root(p): return book(p)['timingDesk']
def work(p):
    r=root(p)
    return r['visits'][r['current']]
def active(p): return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
def click(p, selector):
    matches=p.locator(selector)
    if not p.locator(selector+':visible').count():
        matches.evaluate_all("xs=>xs.forEach(x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true})")
    p.locator(selector+':visible').first.click()
def turn(p, page): click(p,f'[data-timing-page="{page}"]')
def role(p,name): return next(x for x in work(p)['source']['pages'] if x['role']==name)
def settle(p):
    p.locator('#explorer-header').wait_for()
    chosen=active(p)
    if p.locator(f'[data-select-explorer="{chosen}"]').count():click(p,f'[data-select-explorer="{chosen}"]')
    p.locator('#timing-status').wait_for(state='attached')
def go(p, base):
    p.goto(base+ROUTE)
    settle(p)
def setup(browser, width, seed, refuse=False, save_off=False):
    c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True,reduced_motion='reduce')
    c.add_init_script('('+r"""arg=>{
      if(!localStorage.getItem('timing-synthetic-fixture')){
        const profile={id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-27T12:00:00.000Z'};
        localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:profile.id,explorers:[profile]}));
        localStorage.setItem('number-garden-v1:'+profile.id,JSON.stringify(arg.seed));
        if(arg.saveOff)localStorage.setItem('number-garden-save','off');
        localStorage.setItem('timing-synthetic-fixture','1');
      }
      window.__timingRefuse=arg.refuse;window.__timingDiskFail=false;window.__timingSpoken=[];window.__timingCancels=0;
      const setItem=Storage.prototype.setItem;
      Storage.prototype.setItem=function(k,v){if(window.__timingDiskFail&&/^number-garden-v1:explorer-/.test(k))throw new DOMException('Synthetic disk failure','QuotaExceededError');return setItem.call(this,k,v);};
      const synth={getVoices:()=>[{voiceURI:'synthetic-local',name:'Synthetic local English',lang:'en-US',localService:true,default:true}],cancel:()=>window.__timingCancels++,addEventListener:()=>{},removeEventListener:()=>{},speak:u=>{window.__timingSpoken.push({text:u.text,book:window.__timingRead?.()});u.onstart?.();}};
      Object.defineProperty(window,'speechSynthesis',{configurable:true,value:synth});
      Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text;}}});
    }"""+')('+json.dumps({'seed':seed,'refuse':refuse,'saveOff':save_off})+')')
    def app(route):
        response=route.fetch();body=response.text()
        assert 'let graph=null,' in body,'actual app read seam changed'
        body=body.replace('let graph=null,','window.__timingRead=()=>structuredClone(state);let graph=null,',1)
        needle='function priceOptions(){return {canExport:candidate=>'
        assert needle in body,'actual shared preflight seam changed'
        body=body.replace(needle,'function priceOptions(){return {canExport:candidate=>!window.__timingRefuse&&',1)
        # Timing owns its strict no-normalizer exposure callback; intercept its actual preflight too.
        needle='function timingOptions(){return {canExport:candidate=>'
        if needle in body:body=body.replace(needle,'function timingOptions(){return {canExport:candidate=>!window.__timingRefuse&&',1)
        route.fulfill(response=response,body=body)
    c.route('**/app.mjs',app)
    p=c.new_page();p.set_default_timeout(12000);p.on('pageerror',lambda e:errors.append(str(e)))
    return c,p

def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    small=p.locator('[data-timing-root] button,[data-timing-root] a,[data-timing-root] summary,[data-timing-root] input,[data-timing-root] select,[data-timing-root] textarea').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length).map(x=>x.matches('input[type=checkbox]')?x.closest('label')||x:x).filter(x=>x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44).map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not small,'44px visible native targets: '+str(small))
    controls=p.locator('[data-timing-root] button:visible:not(:disabled)')
    if controls.count()>1:
        controls.nth(0).focus();p.keyboard.press('Tab')
        ok(p.evaluate("()=>{const e=document.activeElement,s=getComputedStyle(e);return e.closest('[data-timing-root]')&&((s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0)||s.boxShadow!=='none');}"),'keyboard focus visibly styled')
def choose_task(p,t):
    turn(p,t['pageId'])
    if role(p,'record')['id']==t['pageId']:click(p,'[data-timing-record-mode="numbers"]')
    p.locator('[data-timing-task]').select_option(t['id'])
    ok(p.locator('.timing-task').count()==1 and t['prompt'] in p.locator('.timing-task').inner_text(),'one current source task '+t['id'])
    ok(t['context'] in p.locator('.timing-task').inner_text(),'source context stays visible '+t['id']);labels=p.locator('[data-timing-task] option').evaluate_all("xs=>xs.filter(x=>x.value).map(x=>x.textContent.trim())");ok(len(labels)==len(set(labels)),'distinct source task labels '+t['id']);ok(p.locator('[data-timing-task] option:checked').inner_text()==t['title'],'frozen task title labels chooser '+t['id']);ok(all(x.get_attribute('inputmode') in [None,'text'] for x in p.locator('.timing-task input').all()),'text keyboard permits colon fraction slash and minus '+t['id'])
    if t['id'] in ['day-water','night-arrivals','fast-day','fast-night']:
        ticks=p.locator('.timing-journeys svg text').all_text_contents();numeric=[x.strip() for x in ticks if x.strip().replace('.','',1).isdigit()];ok(numeric==(['0','2','4','6'] if t['id'] in ['day-water','night-arrivals'] else ['0','2','4']),'canonical elapsed-hour ticks '+t['id'])
    pg=next(x for x in work(p)['source']['pages'] if x['id']==t['pageId']);g=pg.get('guidedFor');eligible=bool(pg['guided']) and g and g['kind']=='task' and g['id']==t['id']
    ok(p.locator('[data-timing-learn="guided"]').count()==int(bool(eligible)),'eligible guide only '+t['id'])
def fill_task(p,t,values=None):
    choose_task(p,t)
    if t['kind']=='numeric':
        for f in t['fields']:
            value=(values or KEYS[t['id']])[f['id']]
            if f['type']=='clock':
                p.locator(f'[data-timing-clock="{f["id"]}"][data-task="{t["id"]}"]').fill(value[0]);p.locator(f'[data-timing-day="{f["id"]}"][data-task="{t["id"]}"]').select_option(value[1])
            else:p.locator(f'[data-timing-field="{f["id"]}"][data-task="{t["id"]}"]').fill(value)
    else:p.locator(f'[data-timing-answer="{t["id"]}"]').select_option((values or CHOICES[t['id']]))
    click(p,f'[data-timing-check="{t["id"]}"]')
    expected='match' if values is None else None
    if expected:ok(work(p)['checks'][-1]['outcome']==expected,'actual independent key matches '+t['id'])
def own(p,pid,text):
    click(p,f'[data-timing-mode="own"][data-part="{pid}"]');p.locator(f'[data-timing-own="{pid}"]').fill(text)
def hear(p):
    click(p,'[data-timing-root] [data-speak]');return p.evaluate('window.__timingSpoken.at(-1)')
def speech_controls(p):
    return {s:p.locator(s).element_handle() for s in ['[data-preview-voice]','[data-reading-voice]','[data-reading-speed]'] if p.locator(s).count()}
def trigger_stale_speech(controls):
    for selector,handle in controls.items():
        if selector=='[data-preview-voice]':handle.evaluate('x=>x.click()')
        elif selector=='[data-reading-voice]':handle.evaluate("x=>{x.value='synthetic-local';x.dispatchEvent(new Event('change',{bubbles:true}))}")
        else:handle.evaluate("x=>{x.value='0.8';x.dispatchEvent(new Event('change',{bubbles:true}))}")
def failshot(p,name):
    print('Assertions before failure: '+str(checks),flush=True);print('Browser page errors: '+str(errors),flush=True);print('Current URL: '+p.url,flush=True)
    try:
        p.screenshot(path=str(OUT/(name+'.png')),full_page=True);(OUT/(name+'.html')).write_text(p.content());(OUT/(name+'-speech.json')).write_text(json.dumps(p.evaluate('window.__timingSpoken||[]'),indent=2));(OUT/(name+'-notebook.json')).write_text(json.dumps(book(p),indent=2))
    except Exception as error:print('Failure artifact error: '+str(error),flush=True)
def redownload(p,base,expected,name):
    p.goto(base+'#notes');p.locator('#download').wait_for();click(p,'.timing-notes > summary');click(p,'.timing-notes > section > details > summary');notes=p.locator('.timing-notes').inner_text();ok(all(x in notes for x in ['First checked response','Latest checked response','First kept note','Latest kept note','Teaching shown before this response','Help requested before this response']),'Notes compact first/latest support labels');ok('Timing sheet 1' in notes and 'Timing sheet 2' in notes,'Notes distinct sheet labels')
    with p.expect_download() as downloaded:click(p,'#download')
    raw=Path(downloaded.value.path()).read_text();(OUT/(name+'.json')).write_text(raw);ok(json.loads(raw)['timingDesk']==expected,'actual redownload exact '+name);go(p,base)
def source_tables(p,source):
    for card in source['sources']:
        click(p,f'[data-timing-source="{card["id"]}"]')
        ok(card['text'] in p.locator('main').inner_text() and card['limit'] in p.locator('main').inner_text(),'source owns opened body '+card['id'])
        ok('source-'+card['id'] in work(p)['help'],'source support recorded '+card['id'])
    ok(all(str(n) in p.locator('main').inner_text() for n in [7,6,5,4]),'copied durations available');table=p.locator('.timing-source').filter(has=p.locator('[data-timing-source="journeys"]')).locator('tbody tr');rows=table.evaluate_all("xs=>xs.map(x=>[...x.querySelectorAll('th,td')].map(y=>y.textContent.trim()))");ok([r[2:] for r in rows]==[['6 hours','3 hours'],['6 hours','4 hours'],['4 hours','3 hours'],['4 hours','4 hours']],'all four scenario durations canonicalized instead of unreduced blank fractions')

def journey(browser,width,base,seeds):
    c,p=setup(browser,width,seeds['base'])
    try:
        print(f'Timing {width}: preview, all pages, teaching, model, sources',flush=True)
        go(p,base);before=book(p);ok('timingDesk' not in before,'preview no work mutation');ok('later' in p.locator('main').inner_text(),'preview notice before entry');p.reload();settle(p);ok(book(p)==before,'preview reload pure');click(p,'[data-timing-start]');source=copy.deepcopy(work(p)['source']);visit=root(p)['current'];ok(work(p)['recordMode']=='numbers','numbers starts active');ok(not p.locator('[data-timing-history-version],[data-timing-history-part],[data-timing-open-note]').count(),'fresh sheet has no empty kept-note selectors');ok('Story model: Willow Brook is made up.' in p.locator('main').inner_text(),'persistent fiction label')
        for pg in source['pages']:
            turn(p,pg['id']);ok(work(p)['learn'][pg['id']]['count']>=1,'first teaching line '+pg['id'])
            if pg.get('guidedFor',{}).get('kind')=='task':
                if pg['role']=='record':click(p,'[data-timing-record-mode="numbers"]')
                p.locator('[data-timing-task]').select_option(pg['guidedFor']['id'])
            elif pg.get('guidedFor',{}).get('kind')=='part':p.locator('[data-timing-part]').select_option(pg['guidedFor']['id'])
            for line in pg['learn'][1:]:click(p,'[data-timing-learn="next"]');ok(line['text'] in p.locator('.timing-teaching').inner_text(),'authored learn '+line['id'])
            if pg['guided']:
                click(p,'[data-timing-learn="guided"]');ok(all(x['id'] in work(p)['shown'] for x in pg['guided']),'eligible guided support '+pg['id']);ok(all(x['text'] in p.locator('.timing-teaching').inner_text() for x in pg['guided']),'guided full text rendered')
            held=copy.deepcopy(work(p)['shown']);click(p,'[data-timing-learn="question"]');ok(work(p)['learn'][pg['id']]['folded'],'back to question folds');ok(p.locator('#timing-question').evaluate('x=>x===document.activeElement'),'Back to my question focuses the actual question');ok(work(p)['shown']==held,'fold retains support');ok(not p.locator('.timing-model').count(),'fold hides model');click(p,'[data-timing-fold="false"]');click(p,f'[data-timing-help="together-{pg["id"]}"]');ok('Reading together is noted for this part.' in p.locator('#timing-status').inner_text(),'authored together receipt');event=hear(p);ok(pg['title'] in event['text'],'actual current title spoken');sw=event['book']['timingDesk'];ok('audio-'+pg['id'] in sw['visits'][sw['current']]['help'],'audio support before speech');ok(source['help']['audio-'+pg['id']]['text'] not in event['text'],'support metadata not narration');bounds(p)
        for screen in ['journeys','rates']:
            turn(p,role(p,screen)['id']);p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/f'{screen}-top-{width}.png'),full_page=False);p.locator('.timing-task').scroll_into_view_if_needed();p.screenshot(path=str(OUT/f'{screen}-task-{width}.png'),full_page=False)
        turn(p,role(p,'rates')['id'])
        for i in range(7):
            ok(work(p)['modelStage']==f'rate-stage-{i}','saved stage '+str(i));ok(source['rateModel']['stages'][i]['text'] in p.locator('.timing-model').inner_text(),'exact stage caption');ok(p.locator('.timing-model tbody tr').count()==i+1,'all and only displayed aligned points')
            if i<6:click(p,'[data-timing-model="next"]')
        ok(p.locator('[data-timing-model="next"]').is_disabled(),'end next disabled');ok("Route's end" in p.locator('.timing-model').inner_text(),'authored route end label');p.locator('.timing-model').scroll_into_view_if_needed();p.screenshot(path=str(OUT/f'rates-model-{width}.png'),full_page=False);click(p,'[data-timing-model="reset"]');ok(work(p)['modelStage']=='rate-stage-0','explicit line reset');source_tables(p,source)
        print(f'Timing {width}: every numeric/choice/helper/card/tray/writing option',flush=True)
        for t in source['tasks']:
            fill_task(p,t)
            for hid in [t['hintId'],t['exampleId']]:click(p,f'[data-timing-help="{hid}"]');ok(source['help'][hid]['text'] in p.locator('.timing-task').inner_text(),'actual helper '+hid);bounds(p)
            count=len(work(p)['checks']);click(p,f'[data-timing-skip="{t["id"]}"]');ok(len(work(p)['checks'])==count and t['skipId'] in work(p)['help'],'skip draft/support no attempt '+t['id'])
            bounds(p)
        ok(len(work(p)['checks'])==17,'17 checked responses actual UI')
        t=next(t for t in source['tasks'] if t['id']=='rate-three');fill_task(p,t,{'duration':'54'});ok(work(p)['checks'][-1]['outcome']=='different','actual retry retained');ok(len(work(p)['checks'])==18,'all17 plus retry')
        night=next(t for t in source['tasks'] if t['id']=='night-arrivals');choose_task(p,night);count=len(work(p)['checks']);p.locator('[data-timing-clock="water"]').fill('02:15');click(p,'[data-timing-check="night-arrivals"]');ok(len(work(p)['checks'])==count and 'HH:MM' in p.locator('[data-timing-error="water"]').inner_text(),'clock invalid no attempt actual syntax');p.locator('[data-timing-clock="water"]').fill('02:30');p.locator('[data-timing-day="water"]').select_option('same');click(p,'[data-timing-check="night-arrivals"]');ok(work(p)['checks'][-1]['outcome']=='different','valid wrong day is different actual UI');said=hear(p)['text'];ok('Same day' in said and 'Next day' in said and ', same' not in said and ', next' not in said,'clock days spoken as human labels')
        turn(p,role(p,'record')['id']);click(p,'[data-timing-record-mode="claims"]');ok('What would you tell the miller about using the middle value and the shortest value?' in p.locator('main').inner_text(),'authored bridge prompt');count=len(work(p)['checks'])
        for card in source['claims']:
            p.locator('[data-timing-claim]').select_option(card['id']);ok(p.locator('.timing-claim').count()==1 and not p.locator('.timing-task').count(),'one selected claim no inactive question')
            for tray in source['trays']:
                click(p,f'[data-timing-tray="{tray["id"]}"][data-card="{card["id"]}"]');last=work(p)['claimHistory'][-1];ok(last['reply']==card['replies'][tray['id']] and 'outcome' not in last,'all9 original ungraded replies');ok(last['reply'] in p.locator('.timing-claim').inner_text(),'actual reply visible')
            for hid in [card['hintId'],card['exampleId']]:click(p,f'[data-timing-help="{hid}"]')
            click(p,f'[data-timing-leave-claim="{card["id"]}"]');ok(card['skipId'] in work(p)['help'],'leave claim marked no grading')
        ok(len(work(p)['claimHistory'])==9 and len(work(p)['checks'])==count,'9 interpretations stay ungraded');click(p,'[data-timing-record-mode="numbers"]');ok(p.locator('.timing-task').count()==1 and not p.locator('.timing-claim').count(),'mode restores selected numbers alone')
        turn(p,role(p,'note')['id']);click(p,'[data-timing-keep]');ok(all(not x['text'] for x in work(p)['kept']['renderedParts']),'unfinished blank keep allowed');first=copy.deepcopy(work(p)['firstKept'])
        for part in source['parts']:
            p.locator('[data-timing-part]').select_option(part['id']);ok(p.locator('.timing-writing').count()==1,'one writing part');own(p,part['id'],'\nSynthetic original words for '+part['id']+'.')
            for option in part['options']:
                p.locator(f'[data-timing-writing-choice="{part["id"]}"]').select_option(option['id']);ok(option['text'] in p.locator('.timing-writing').inner_text() and option['reply'] in p.locator('.timing-writing').inner_text(),'all9 full supplied alternatives/replies');ok(work(p)['writing'][part['id']]['mode']=='supplied','supplied selection chooses supplied mode');bounds(p)
            for hid in [part['helpId'],part['exampleId']]:click(p,f'[data-timing-help="{hid}"]')
            click(p,f'[data-timing-leave-part="{part["id"]}"]');ok(part['skipId'] in work(p)['help'],'leave part supports and preserves drafts')
        click(p,'[data-timing-keep]');ok(all(x['mode']=='supplied' for x in work(p)['kept']['renderedParts']),'supplied-only rendered version allowed');ok(work(p)['firstKept']==first,'first blank kept note unchanged')
        pid=source['parts'][0]['id'];p.locator('[data-timing-part]').select_option(pid);p.once('dialog',lambda d:d.dismiss());click(p,f'[data-timing-starter="{pid}"]');ok(work(p)['writing'][pid]['own'].startswith('\n'),'cancel replacement keeps original');p.once('dialog',lambda d:d.accept());click(p,f'[data-timing-starter="{pid}"]');ok(work(p)['writing'][pid]['starterUsed'] is True,'starter provenance atomic');own(p,pid,'Synthetic adapted starter.');click(p,'[data-timing-keep]');ok(work(p)['kept']['closing']==source['closing'],'identical miller close');ok(set(work(p)['help'])==set(source['help']),'every finite help/source/audio/together/card/part requested actual UI')
        # Deliberate one-at-a-time history. No response expansion from opening a kept part.
        p.locator('[data-timing-history-task]').select_option('rate-three');click(p,'[data-timing-history="first"]');ok(p.locator('.timing-review-body').count()==1,'one opened original response');ok('18 ÷ 3' in p.locator('.timing-review-body').inner_text(),'first original response shown');ok(all(x in p.locator('.timing-review-body').inner_text() for x in ['First checked response','Matches the worked answer','Teaching shown before this response','Help requested before this response','Earlier support in this visit']),'first outcome and separate support labels');click(p,'[data-timing-history="latest"]');ok('54' in p.locator('.timing-review-body').inner_text(),'latest actual retry original');ok('Latest checked response' in p.locator('.timing-review-body').inner_text() and 'Different from the worked answer' in p.locator('.timing-review-body').inner_text(),'latest version and original outcome labels');click(p,'[data-timing-close-review]');click(p,'[data-timing-open-note]');p.locator('[data-timing-history-version]').select_option('first');p.locator('[data-timing-history-part]').select_option(pid);ok('Left open' in p.locator('.timing-review-body').inner_text() and '54' not in p.locator('.timing-review-body').inner_text(),'first note part only no compact response expansion');p.locator('[data-timing-history-version]').select_option('latest');ok('Synthetic adapted starter.' in p.locator('.timing-review-body').inner_text(),'latest part original words');click(p,'[data-timing-close-review]')
        # Detached controls and narration cannot affect a later screen.
        stale=p.locator('[data-timing-root] [data-speak]').element_handle();old_settings=speech_controls(p);old_keep=p.locator('[data-timing-keep]').element_handle();cancels=p.evaluate('window.__timingCancels');turn(p,role(p,'journeys')['id']);ok(p.evaluate('window.__timingCancels')>cancels,'navigation cancels speech');held=book(p);spoken=p.evaluate('window.__timingSpoken.length');stale.evaluate('x=>x.click()');old_keep.evaluate('x=>x.click()');trigger_stale_speech(old_settings);ok(book(p)==held and p.evaluate('window.__timingSpoken.length')==spoken,'detached buttons/audio inert')
        # Refused words remain through mouse, keyboard, hash, Back and restore.
        turn(p,role(p,'note')['id']);p.locator('[data-timing-part]').select_option(pid);field=p.locator(f'[data-timing-own="{pid}"]');saved=field.input_value();held=book(p);p.evaluate('window.__timingRefuse=true');field.fill('Visible unsaved synthetic words.');ok(book(p)==held,'preflight refusal whole notebook atomic');ok(field.get_attribute('aria-invalid')=='true','refused words marked unsaved');click(p,'[data-timing-keep]');turn(p,role(p,'journeys')['id']);click(p,'#explorer-switch');p.locator('[data-timing-keep]').focus();p.keyboard.press('Enter');p.keyboard.press('Space');ok(book(p)==held and work(p)['pageId']==role(p,'note')['id'],'dirty navigation keyboard explorer blocked');p.evaluate("location.hash='#home'");p.wait_for_function("location.hash==='#learn/math/timing-desk'");p.evaluate("history.replaceState(null,'','#home');history.pushState(null,'','#learn/math/timing-desk')");p.go_back();p.wait_for_function("location.hash==='#learn/math/timing-desk'");ok(field.input_value()=='Visible unsaved synthetic words.' and book(p)==held,'dirty hash Back keeps exact copyable words');spoken=p.evaluate('window.__timingSpoken.length');click(p,'[data-timing-root] [data-speak]');ok(p.evaluate('window.__timingSpoken.length')==spoken,'preflight refused audio never plays');p.once('dialog',lambda d:d.dismiss());click(p,'[data-timing-restore]');ok(field.input_value()=='Visible unsaved synthetic words.','cancel restore exact');p.once('dialog',lambda d:d.accept());click(p,'[data-timing-restore]');ok(field.input_value()==saved and book(p)==held,'confirmed restore visible controls only');p.evaluate('window.__timingRefuse=false')
        # A partial second sheet stays beside the complete actual first sheet.
        completed=copy.deepcopy(root(p)['visits'][visit]);click(p,'[data-timing-start]');firsttask=work(p)['source']['tasks'][0];p.locator(f'[data-timing-clock="{firsttask["fields"][0]["id"]}"]').fill(' 15:00 ');p.locator(f'[data-timing-day="{firsttask["fields"][0]["id"]}"]').select_option('same');turn(p,role(p,'note')['id']);own(p,pid,'Partial second actual sheet.');ok(root(p)['visits'][visit]==completed,'complete first exact beside partial second');click(p,'.timing-visits > summary');click(p,'.timing-grownups > summary');names=p.locator('[data-timing-resume]').all_text_contents();ok([x.split(' · ')[0] for x in names]==['Timing sheet 1','Timing sheet 2'],'unique saved sheet labels '+str(names));ok('Timing sheet 2' in p.locator('[data-timing-resume][aria-pressed="true"]').inner_text() and 'Current sheet' in p.locator('[data-timing-resume][aria-pressed="true"]').inner_text(),'current sheet marked');ok(all(x in p.locator('[data-timing-remove-choice]').inner_text() for x in ['Timing sheet 1','Timing sheet 2']),'destructive remove selector distinct labels');ok(book(p).get('story')==before.get('story'),'story state unchanged')
        original=copy.deepcopy(root(p));identity=active(p);p.reload();settle(p);ok(root(p)==original,'persistent original reload exact');redownload(p,base,original,f'original-complete-{width}')
        # Actual second full ordinary fixture import while retaining the original explorer.
        p.goto(base+'#notes');p.locator('#progress-file').wait_for();raw=subprocess.check_output(['node','--input-type=module','-e',"import {report,makeOrdinaryFixture} from './test/timing-desk-checks.mjs';console.log(JSON.stringify(report(makeOrdinaryFixture()),null,2));"],cwd=ROOT,text=True);fixture=json.loads(raw);ok(fixture['timingDesk']==seeds['ordinary']['timingDesk'],'second fixture deterministic and unshrunk');ok(len(fixture['syntheticUnrelated']['text'])==500*1024,'500KiB unrelated payload intact');p.locator('#progress-file').set_input_files({'name':'synthetic-full-timing.json','mimeType':'application/json','buffer':raw.encode()});p.locator('#progress-import-confirm').wait_for();ok('message' in p.locator('.import-preview').inner_text().lower(),'actual import preview names timing');click(p,'#progress-import-confirm');imported=active(p);ok(imported!=identity,'second full fixture imports as independent explorer');go(p,base);imported_root=copy.deepcopy(root(p));ok(imported_root==fixture['timingDesk'],'full second root exact on actual import');p.reload();settle(p);ok(root(p)==imported_root,'full second reload exact beside original')
        old_audio=p.locator('[data-timing-root] [data-speak]').element_handle();old_settings=speech_controls(p);old_button=p.locator('[data-timing-page]').first.element_handle();click(p,'#explorer-switch');click(p,f'[data-select-explorer="{identity}"]');p.locator('[data-timing-root]').wait_for();held=book(p);store=p.evaluate("localStorage.getItem('learning-garden-explorers')");spoken=p.evaluate('window.__timingSpoken.length');old_audio.evaluate('x=>x.click()');old_button.evaluate('x=>x.click()');trigger_stale_speech(old_settings);ok(book(p)==held and root(p)==original and p.evaluate('window.__timingSpoken.length')==spoken and p.evaluate("localStorage.getItem('learning-garden-explorers')")==store,'other explorer controls/audio inert');p.reload();settle(p);ok(root(p)==original,'original persistent exact after second full import');redownload(p,base,original,f'original-redownload-{width}');click(p,'#explorer-switch');click(p,f'[data-select-explorer="{imported}"]');p.locator('[data-timing-root]').wait_for();ok(root(p)==imported_root,'full second switch exact');p.reload();settle(p);ok(root(p)==imported_root,'full second persistent reload exact');redownload(p,base,imported_root,f'imported-redownload-{width}');ok(book(p)['syntheticUnrelated']==fixture['syntheticUnrelated'],'whole500KiB sibling exact')
        for route in ['#desk','#pathways/math','#pathways/science','#learn/science/ledger']:
            p.goto(base+route)
            if route=='#learn/science/ledger':
                if p.locator('[data-ledger-start]').first.is_visible():click(p,'[data-ledger-start]')
                ledger_book=book(p)['ledgerGauge'];ledger_work=ledger_book['visits'][ledger_book['current']];note_id=next(x['id'] for x in ledger_work['source']['pages'] if x['role']=='note');click(p,f'[data-ledger-page="{note_id}"]')
            p.locator('a[href="'+ROUTE+'"]').first.wait_for(state='attached')
            expected_text={'#desk':'The miller has a timing question. If a message and the rising water both travel down the valley, how much time lies between them?','#pathways/math':'Compare two journeys, try a rate, and read five copied times.','#pathways/science':'Compare two journeys, try a rate, and read five copied times.','#learn/science/ledger':'A height record asks how high. A timing sheet asks how long. Compare the message and the water in another fictional case.'}[route]
            expected_button='Look at the timing desk' if route=='#desk' else 'Open the timing preview' if route=='#learn/science/ledger' else 'The message and the water'
            link=p.locator('a[href="'+ROUTE+'"]').first;link.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}");ok(expected_text in p.locator('main').inner_text() and link.inner_text()==expected_button,'exact authored invitation context '+route);click(p,'a[href="'+ROUTE+'"]');p.locator('[data-timing-root]').wait_for();ok(root(p)==imported_root,'affected invitation '+route)
        for route in ['#notes','#learn/history/river-room','#post/clock-walk']:
            p.goto(base+route);p.locator('main h1').wait_for();ok(root(p)==imported_root,'affected route stays open '+route)
        go(p,base);bounds(p);p.screenshot(path=str(OUT/f'timing-{width}.png'),full_page=True)
    except Exception:failshot(p,f'failure-journey-{width}');raise
    finally:c.close()

def speech_and_failures(browser,base,seeds):
    c,p=setup(browser,820,seeds['voice'])
    try:
        go(p,base);w=work(p);t=w['source']['tasks'][0];event=hear(p);said=event['text'];ok('VISIBLE_LEARNING_SENTINEL' in said and 'VISIBLE_CONTEXT_SENTINEL' in said,'actual rendered authored text spoken');ok(all(x not in said for x in ['AUDIO_METADATA_SENTINEL','HIDDEN_LEARNING_SENTINEL','UNREQUESTED_HINT_SENTINEL','ARCHIVED_HELPER_SENTINEL']),'metadata hidden unrequested archived text silent');click(p,'[data-timing-fold="true"]');said=hear(p)['text'];ok('VISIBLE_LEARNING_SENTINEL' not in said and 'VISIBLE_CONTEXT_SENTINEL' in said,'fold narration actual context only');click(p,f'[data-timing-help="{t["exampleId"]}"]');ok('REQUESTED_EXAMPLE_SENTINEL' in hear(p)['text'],'active requested helper actually spoken')
        p.locator('[data-timing-clock="water"]').fill('15:00');p.locator('[data-timing-day="water"]').select_option('');missing_day=hear(p)['text'];ok('Model water arrival: 15:00, Day not chosen' in missing_day and 'Model water arrival: 15:00, Same day' not in missing_day,'missing day narration never supplies a same-day answer')
        turn(p,role(p,'note')['id']);pid=work(p)['partId'];ok('CLOSED_CONNECTION_SENTINEL' not in hear(p)['text'],'closed connection prose never narrated');field=p.locator(f'[data-timing-own="{pid}"]');handle=field.element_handle();a='Synthetic fresh words A.';b='Synthetic replacement words B.\n  Spacing stays readable.';field.fill(a);ok(handle.evaluate('x=>x.isConnected'),'autosave same textarea node');ok(a in hear(p)['text'],'fresh A actual text read');field.fill(b);ok(handle.evaluate('x=>x.isConnected'),'replacement same textarea node');event=hear(p);normalized=' '.join(event['text'].split());ok(' '.join(b.split()) in normalized and a not in normalized,'actual replacement B spoken with normalization and A excluded');held=book(p);p.evaluate('window.__timingRefuse=true');field.fill('Synthetic refused C.');count=p.evaluate('window.__timingSpoken.length');click(p,'[data-timing-root] [data-speak]');ok(p.evaluate('window.__timingSpoken.length')==count and book(p)==held,'failed support/preflight blocks speech');p.once('dialog',lambda d:d.accept());click(p,'[data-timing-restore]');p.evaluate('window.__timingRefuse=false');ok(' '.join(b.split()) in ' '.join(hear(p)['text'].split()),'restored B spoken')
        # Real persistent-write failure has a different contract from preflight refusal.
        store=p.evaluate("localStorage.getItem('number-garden-v1:'+JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId)");p.evaluate('window.__timingDiskFail=true');field.fill('Copyable synthetic disk-failure draft.');ok(field.input_value()=='Copyable synthetic disk-failure draft.','disk-failure visible words copyable');ok(work(p)['writing'][pid]['own']=='Copyable synthetic disk-failure draft.','shared void save retains in-memory work');ok(p.locator('[data-save-warning]').is_visible(),'existing storage warning shown');ok(p.evaluate("localStorage.getItem('number-garden-v1:'+JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId)")==store,'failed persistent write retains old stored notebook bytes');ok('Copyable synthetic disk-failure draft.' in hear(p)['text'],'shared write failure does not pretend support mutation refused');p.evaluate('window.__timingDiskFail=false')
    except Exception:failshot(p,'failure-speech-storage');raise
    finally:c.close()
    c,p=setup(browser,320,seeds['base'],save_off=True)
    try:
        go(p,base);click(p,'[data-timing-start]');turn(p,role(p,'note')['id']);pid=work(p)['partId'];own(p,pid,'Synthetic ordinary save-off words.');ok('Synthetic ordinary save-off words.' in hear(p)['text'],'ordinary save-off use works');ok(p.evaluate("localStorage.getItem('number-garden-save')")=='off','save-off explicit setting stays off')
    except Exception:failshot(p,'failure-save-off');raise
    finally:c.close()
    c,p=setup(browser,820,seeds['inactive'])
    try:
        go(p,base);text=p.locator('main').inner_text();ok(not p.locator('.timing-task').count(),'claims mode no numeric question');ok(all(x not in text for x in ['INACTIVE_QUESTION_SENTINEL','INACTIVE_GUIDE_SENTINEL','INACTIVE_HELPER_SENTINEL']),'inactive remembered task guide helper invisible');said=hear(p)['text'];ok(all(x not in said for x in ['INACTIVE_QUESTION_SENTINEL','INACTIVE_GUIDE_SENTINEL','INACTIVE_HELPER_SENTINEL']),'inactive branch silent');ok('7x8' not in book(p).get('exposures',[]),'inactive branch no exposure')
    except Exception:failshot(p,'failure-inactive');raise
    finally:c.close()
    c,p=setup(browser,320,seeds['ownModel'])
    try:
        go(p,base);ok('Earlier two-kilometer model' in p.locator('.timing-model').inner_text(),'older model own title rendered');ok(work(p)['modelStage']=='earlier-stage-0','older source-owned stage resumes');click(p,'[data-timing-model="next"]');ok(work(p)['modelStage']=='earlier-stage-1','older source-owned stage advances');rows=p.locator('.timing-model tbody tr').evaluate_all("xs=>xs.map(x=>[...x.querySelectorAll('td')].map(y=>y.textContent.trim()))");ok(len(rows)==2 and rows[-1][0].startswith('1') and rows[-1][1].startswith('2'),'actual earlier2km/h aligned table uses own numbers');ok('Earlier stage: 1 × 2 = 2.' in p.locator('.timing-model').inner_text(),'actual earlier model caption preserved');bounds(p)
    except Exception:failshot(p,'failure-own-model');raise
    finally:c.close()
    c,p=setup(browser,820,seeds['metadataHistory'])
    try:
        go(p,base);p.locator('[data-timing-history-task]').select_option('day-water');click(p,'[data-timing-history="first"]');review=p.locator('.timing-review-body').inner_text();ok(all(x not in review for x in ['HISTORY_METADATA_SENTINEL','UNUSED_SHOWN_SENTINEL','UNUSED_HELP_SENTINEL']),'opened original response excludes metadata bodies and unused map definitions');ok('Read-aloud support recorded for this part.' in review and 'Reading together is noted for this part.' in review,'audio and together marker labels retained separately from hidden bodies');ok('7x8' not in book(p).get('exposures',[]),'hidden audio/together original metadata never qualifies facts');ok('HISTORY_METADATA_SENTINEL' in json.dumps(work(p)['checks'][0]['source']['help']),'original metadata raw retained for export')
    except Exception:failshot(p,'failure-history-metadata');raise
    finally:c.close()
    c,p=setup(browser,820,seeds['history'])
    try:
        go(p,base);held=copy.deepcopy(root(p));ok('18 ÷ 3' not in p.locator('main').inner_text(),'closed old response body hidden');ok(p.locator('[data-timing-history-task] option[value="rate-three"]').count()==1,'history list includes original ID absent current task catalog');p.locator('[data-timing-history-task]').select_option('rate-three');click(p,'[data-timing-history="first"]');ok('18 ÷ 3 = 6 hours.' in p.locator('.timing-review-body').inner_text(),'opened first reads original frozen reply');click(p,'[data-timing-history="latest"]');text=p.locator('.timing-review-body').inner_text();ok(p.locator('.timing-review-body [data-timing-unreadable]').count()==1 and '18 ÷ 3 = 6 hours.' not in text,'unreadable latest never replaced with original first');ok(root(p)['visits'][root(p)['current']]['checks'][-1]=={'taskId':'rate-three','future':'exact unreadable latest'},'raw latest exact retained');click(p,'[data-timing-close-review]');ok('18 ÷ 3' not in p.locator('main').inner_text(),'closing hides original mathematics')
    except Exception:failshot(p,'failure-original-history');raise
    finally:c.close()
    c,p=setup(browser,820,seeds['titleless'])
    try:
        go(p,base);labels=p.locator('[data-timing-task] option').evaluate_all("xs=>xs.filter(x=>x.value).map(x=>x.textContent.trim())");ok(len(labels)==len(set(labels)),'older title-less rates have unique prompt-position fallback');history_labels=p.locator('[data-timing-history-task] option').all_inner_texts();ok(len(history_labels)==3 and len(set(history_labels))==3,'older title-less original history labels unique');ok(all('title' not in t for t in work(p)['source']['tasks']),'fallback labels do not rewrite old source')
    except Exception:failshot(p,'failure-titleless-labels');raise
    finally:c.close()
    c,p=setup(browser,820,seeds['malformedClaim'])
    try:
        go(p,base);card=work(p)['claimId'];ok(p.locator('.timing-claim [data-timing-unreadable]').count()==1,'malformed own claim selection honestly retained');ok(all(x.is_disabled() for x in p.locator('[data-timing-tray]').all()),'only malformed selected card trays disabled');other=next(x['id'] for x in work(p)['source']['claims'] if x['id']!=card);p.locator('[data-timing-claim]').select_option(other);ok(all(not x.is_disabled() for x in p.locator('[data-timing-tray]').all()),'healthy sibling claim stays open');ok(work(p)['claims'][card]=={'future':'exact unreadable claim selection'},'malformed original claim raw preserved')
    except Exception:failshot(p,'failure-malformed-claim');raise
    finally:c.close()
    c,p=setup(browser,820,seeds['noteLabels'])
    try:
        go(p,base);p.goto(base+'#notes');click(p,'.timing-notes > summary');p.locator('.timing-notes details').evaluate_all("xs=>xs.forEach(x=>{if(!x.querySelector('summary')?.textContent.includes('Exact saved'))x.open=true})");labels=p.locator('.timing-notes').inner_text();ok(all(x in labels for x in ['What the calculations show','What stays uncertain','What to record next','My writing draft','Supplied words','Supplied words used as a starting draft','Left open','Retained, unreadable part']),'Notes per-part frozen mode starter left-open unreadable labels');ok('COMPACT_NOTE_BODY_SENTINEL' not in labels and 'CHANGED_CURRENT_' not in labels,'Notes compact labels exclude own bodies and current catalog relabeling');go(p,base);p.locator('[data-timing-history-version]').select_option('first');p.locator('[data-timing-history-part]').select_option('next-record');click(p,'[data-timing-open-note]');text=p.locator('.timing-review-body').inner_text();ok('Retained, unreadable part' in text and 'My writing draft' not in text,'unreadable kept part never claims readable own-writing caption')
    except Exception:failshot(p,'failure-note-labels');raise
    finally:c.close()
    for name in ['malformedFirst','malformedFirstKeep','malformedHelp','visitsCap','claimsCap','checksCap']:
        c,p=setup(browser,820,seeds[name])
        try:
            go(p,base);held=copy.deepcopy(root(p))
            if name=='malformedFirst':
                fill_task(p,work(p)['source']['tasks'][0]);ok(work(p)['firstChecks']['day-water']=={'future':'exact unreadable first'} and len(work(p)['checks'])==1,'healthy latest appends while raw malformed first retained');p.locator('[data-timing-history-task]').select_option('day-water');click(p,'[data-timing-history="latest"]');ok('No recorded help request before this response' in p.locator('.timing-review-body').inner_text(),'no prior help label does not claim independence')
            elif name=='malformedFirstKeep':
                click(p,'[data-timing-keep]');ok(work(p)['firstKept']=={'future':'exact unreadable first keep'} and 'renderedParts' in work(p)['kept'],'healthy latest keep succeeds beside exact unreadable first keep');ok('notes limit' not in p.locator('#timing-status').inner_text().lower(),'malformed first keep gives no false quota refusal')
            elif name=='malformedHelp':
                pg=work(p)['pageId'];click(p,f'[data-timing-help="together-{pg}"]');ok('Reading together is noted for this part.' in p.locator('#timing-status').inner_text(),'together metadata works beside malformed helpOpen');event=hear(p);ok(event and 'audio-'+pg in work(p)['help'],'audio metadata works beside malformed helpOpen');ok(work(p)['helpOpen']=={'future':'exact unreadable helpOpen'},'malformed help view raw retained')
            elif name=='visitsCap':
                click(p,'[data-timing-start]');ok('This explorer already has eight timing sheets.' in p.locator('#timing-status').inner_text(),'authored visit cap reason');ok(root(p)==held,'visit cap preserves exact sheets')
            elif name=='claimsCap':
                card=work(p)['claimId'];click(p,f'[data-timing-tray="support"][data-card="{card}"]');ok('This sheet has reached its claim-history limit.' in p.locator('#timing-status').inner_text(),'authored claim cap reason');ok(root(p)==held,'claim cap preserves selections/history')
            else:
                click(p,'[data-timing-check="day-gap"]');ok('This sheet has reached its checked-response limit.' in p.locator('#timing-status').inner_text(),'authored check cap reason');ok(root(p)==held,'check cap preserves records')
        except Exception:failshot(p,'failure-'+name);raise
        finally:c.close()
    for name in ['old','damaged','future']:
        c,p=setup(browser,320,seeds[name])
        try:
            go(p,base);held=copy.deepcopy(root(p))
            if name=='future':ok(root(p)==held and not p.locator('[data-timing-start]').count(),'future root retained read only');p.goto(base+'#pathways/math');ok(root(p)==held,'unrelated route open future root exact')
            else:
                ok('Earlier synthetic timing source' in p.locator('main').inner_text(),'source owned old title');ok(len(work(p)['source']['records']['entries'])==0,'old empty record accepted');ok(work(p)['source']==held['visits'][held['current']]['source'],'old unknown source exact');bounds(p)
                if name=='damaged':
                    ok(p.locator('.timing-task input').first.is_disabled(),'only unreadable draft disabled');ok(work(p)['answers']['earlier-water']=={'future':'exact unreadable draft'},'unreadable draft exact raw retained');turn(p,role(p,'note')['id']);before=book(p);click(p,'[data-timing-keep]');message=p.locator('#timing-status').inner_text().lower();ok(('retained' in message or 'unreadable' in message or 'cannot be read' in message) and 'notes limit' not in message,'unreadable keep gives actual retained-data reason');ok(book(p)==before,'unreadable keep retained exactly')
        except Exception:failshot(p,'failure-'+name);raise
        finally:c.close()

def typing_probe(browser,base,seeds):
    c,p=setup(browser,820,seeds['ordinary'])
    try:
        go(p,base);turn(p,role(p,'note')['id']);pid=work(p)['partId'];click(p,f'[data-timing-mode="own"][data-part="{pid}"]');field=p.locator(f'[data-timing-own="{pid}"]');field.focus();field.evaluate('x=>x.setSelectionRange(x.value.length,x.value.length)');text=' rate 3/2 -1 02:30';started=time.perf_counter();field.press_sequentially(text,delay=0);elapsed=(time.perf_counter()-started)*1000;measurement={'fixturePrettyBytes':len(subprocess.check_output(['node','--input-type=module','-e',"import {pretty,makeOrdinaryFixture} from './test/timing-desk-checks.mjs';process.stdout.write(pretty(makeOrdinaryFixture()));"],cwd=ROOT)), 'characters':len(text),'totalMs':round(elapsed,1),'meanMsPerCharacter':round(elapsed/len(text),1)};latency.append(measurement);print('Full-fixture typing probe: '+json.dumps(measurement),flush=True);visible=field.input_value();ok(visible.endswith(text) and work(p)['writing'][pid]['own']==visible,'full fixture typing retained and copyable');stored=json.loads(p.evaluate("localStorage.getItem('number-garden-v1:'+JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId)"));stored_root=stored['timingDesk'];ok(stored_root['visits'][stored_root['current']]['writing'][pid]['own']==visible,'actual persistent stored typing equals complete visible draft')
    except Exception:failshot(p,'failure-typing-probe');raise
    finally:c.close()

if __name__=='__main__':
    server=None;base=os.environ.get('TIMING_TEST_URL')
    if not base:
        server=PreviewServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    try:
        seeds=fixtures()
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
            try:
                for width in [320,820]:journey(browser,width,base,seeds)
                speech_and_failures(browser,base,seeds);typing_probe(browser,base,seeds);ok(not errors,'no actual page errors '+str(errors));(OUT/'receipt.json').write_text(json.dumps({'checks':checks,'widths':[320,820],'errors':errors,'typingLatency':latency},indent=2));print(f'Timing Chrome: {checks} assertions passed; synthetic artifacts {OUT}',flush=True)
            finally:browser.close()
    finally:
        if server:server.shutdown()
