"""Synthetic River journeys through the actual app; run only after production freeze."""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('RIVER_ARTIFACTS','/tmp/river-room-browser'))
OUT.mkdir(parents=True,exist_ok=True)
ROUTE='#learn/history/river-room'
checks=0
errors=[]
def ok(value,message):
    global checks
    assert value,message
    checks+=1
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
class PreviewServer(http.server.ThreadingHTTPServer):
    request_queue_size=128

def fixtures():
    source=r"""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startRiver,pageRiver,keepRiverModel,keepRiverNote} from './dist/river-room-core.mjs';
import {startPostOffice,setPostPackingInput} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
import {startAdaptiveRival} from './dist/post-rival.mjs';
import {generateRivalTask} from './dist/post-rival-generator.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={version:99,raw:['future exact sibling']};startPostOffice(base,deliveries[0].id);setPostPackingInput(base,'17');
const pending=structuredClone(base);startAdaptiveRival(pending);pending.postOffice.visits.find(v=>v.id===pending.postOffice.current).rival.task=generateRivalTask('multiply',3,4,0);
const old=structuredClone(base);startRiver(old);const w=old.riverRoom.visits[old.riverRoom.current],s=w.source;s.id='earlier-river-source';s.title='An earlier bounded river book';s.timeline=s.timeline.slice(0,2);w.order=s.timeline.map(x=>x.id);s.measures=s.measures.slice(0,2);s.analogy.measures=s.analogy.measures.filter(id=>s.measures.some(m=>m.id===id));s.tasks=s.tasks.slice(0,1);s.parts=s.parts.slice(0,1);s.geometry.area={n:1800,d:1};s.geometry.minWidth=225;s.geometry.maxWidth=675;s.geometry.step=225;s.geometry.initialWidth=225;s.geometry.tile={rows:2,columns:3};w.modelWidth=225;
const malformed=structuredClone(old);keepRiverNote(malformed);const mw=malformed.riverRoom.visits[malformed.riverRoom.current];mw.models.push({synthetic:'unreadable latest model'});mw.checks.push({taskId:mw.source.tasks[0].id,synthetic:'unreadable latest check'});mw.kept={synthetic:'unreadable latest note'};malformed.riverRoom.visits['[raw visit]']={synthetic:'retained raw visit'};
const malformedAnswer=structuredClone(old);const ma=malformedAnswer.riverRoom.visits[malformedAnswer.riverRoom.current];ma.page=2;ma.source.tasks[0].facts=[[9,10]];ma.source.tasks[0].context+=' Synthetic displayed9 ×10 =90.';ma.answers[ma.source.tasks[0].id]={fields:{[ma.source.tasks[0].fields[0].id]:'x'.repeat(41)},unit:'m'};
const future=structuredClone(base);future.riverRoom={version:99,raw:['future exact source']};
const restored=structuredClone(pending);startRiver(restored);restored.riverRoom.visits[restored.riverRoom.current].page=2;
const helper=structuredClone(restored);const hw=helper.riverRoom.visits[helper.riverRoom.current];hw.page=2;hw.source.id='earlier-helper-source';hw.source.geometry.tile={rows:2,columns:2};const hid=Object.keys(hw.source.help).find(k=>k.includes('example'))||Object.keys(hw.source.help)[0];hw.source.help[hid]={title:'Earlier helper',text:'Earlier: 3 × 4 = 12.',facts:[[3,4]]};
const scale20=structuredClone(base);startRiver(scale20);const sw=scale20.riverRoom.visits[scale20.riverRoom.current],ss=sw.source;ss.id='earlier-twenty-scale';ss.scale={metersPerCentimeter:20};sw.page=3;for(const t of ss.tasks.filter(t=>t.id.startsWith('scale-'))){t.context=t.id==='scale-drawing'?'Documented setback350m; invented scale1cm represents20m.':'Invented scale1cm represents20m; practice length17.5cm.';t.fields[0].answer=t.id==='scale-drawing'?{n:35,d:2}:{n:350,d:1};t.backcheck='17.5 ×20 =350';t.match='This fits the earlier20m per centimeter scale:17.5cm represents350m.';t.different='Use the earlier20m per centimeter scale and the requested unit.';t.errors=[];ss.help[t.hintId].text='Use this source’s20m per centimeter.';ss.help[t.exampleId].text='Different example:40m is2cm at20m per centimeter.';}ss.display['page-3'].text='Earlier invented scale:1cm represents20m, ratio1:2000.';
const legacyScale=structuredClone(scale20);delete legacyScale.riverRoom.visits[legacyScale.riverRoom.current].source.scale;
function summaryCase(tile,dimensions=false){const n=structuredClone(pending);startRiver(n);const w=n.riverRoom.visits[n.riverRoom.current];if(dimensions){w.source.geometry.area={n:10,d:1};w.source.geometry.minWidth=2;w.source.geometry.maxWidth=2;w.source.geometry.step=1;w.source.geometry.initialWidth=2;w.source.geometry.tile={rows:2,columns:2};w.modelWidth=2;}pageRiver(n,2);keepRiverModel(n);n.riverRoom.visits[n.riverRoom.current].models[0].model.tile=tile;pageRiver(n,4);keepRiverNote(n);return n;}
const summaryOnly=summaryCase({rows:3,columns:4});const oldTileOnly=summaryCase({rows:2,columns:5});oldTileOnly.postOffice.visits.find(v=>v.id===oldTileOnly.postOffice.current).rival.task=generateRivalTask('multiply',2,5,0);const visibleSummary=summaryCase({rows:2,columns:2},true);visibleSummary.postOffice.visits.find(v=>v.id===visibleSummary.postOffice.current).rival.task=generateRivalTask('multiply',2,5,0);
console.log(JSON.stringify({base,pending,old,malformed,malformedAnswer,future,restored,helper,hid,scale20,legacyScale,summaryOnly,oldTileOnly,visibleSummary}));
"""
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',source],cwd=ROOT,text=True))

def book(p):return p.evaluate('()=>window.__riverRead()')
def root(p):return book(p)['riverRoom']
def work(p):
    r=root(p)
    return r['visits'][r['current']]
def active(p):return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
def click(p,selector):
    matches=p.locator(selector)
    if not p.locator(selector+':visible').count():
        matches.evaluate_all("xs=>xs.forEach(x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true})")
    p.locator(selector+':visible').first.click()
def turn(p,n):click(p,f'[data-river-page="{n}"]')
def settle(p):
    p.locator('#explorer-header').wait_for()
    chosen=active(p)
    picker=p.locator(f'[data-select-explorer="{chosen}"]')
    if picker.count():click(p,f'[data-select-explorer="{chosen}"]')
    # Actual dynamically rendered case marker, never static main alone.
    p.locator('#river-status').wait_for(state='attached')
def go(p,base):
    p.goto(base+ROUTE)
    settle(p)
def setup(browser,width,seed,refuse=False):
    c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True,reduced_motion='reduce')
    c.add_init_script('('+r"""arg=>{
      if(!localStorage.getItem('river-synthetic-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(arg.seed));
        localStorage.setItem('river-synthetic-fixture','1');
      }
      window.__riverRefuse=arg.refuse;window.__riverSpoken=[];window.__riverCancels=0;
      const synth={getVoices:()=>[{voiceURI:'synthetic-local',name:'Synthetic local English',lang:'en-US',localService:true,default:true}],
        cancel:()=>window.__riverCancels++,addEventListener:()=>{},removeEventListener:()=>{},
        speak:u=>{window.__riverSpoken.push({text:u.text,book:window.__riverRead?.()});u.onstart?.();}};
      Object.defineProperty(window,'speechSynthesis',{configurable:true,value:synth});
      Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class {constructor(text){this.text=text;}}});
    }"""+')('+json.dumps({'seed':seed,'refuse':refuse})+')')
    def app(route):
        response=route.fetch()
        body=response.text()
        assert 'let graph=null;' in body,'actual app state seam changed'
        body=body.replace('let graph=null;','window.__riverRead=()=>structuredClone(state);let graph=null;',1)
        needle='function priceOptions(){return {canExport:candidate=>'
        assert needle in body,'actual shared preflight seam changed'
        body=body.replace(needle,'function priceOptions(){return {canExport:candidate=>!window.__riverRefuse&&',1)
        route.fulfill(response=response,body=body)
    c.route('**/app.mjs',app)
    p=c.new_page();p.set_default_timeout(12000)
    p.on('pageerror',lambda e:errors.append(str(e)))
    return c,p

def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no page overflow')
    small=p.locator('[data-river-root] button,[data-river-root] a,[data-river-root] summary,[data-river-root] input,[data-river-root] select,[data-river-root] textarea').evaluate_all(
      "xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44)).map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not small,'44px native targets: '+str(small))
def numeric(p,task,values=None):
    for i,f in enumerate(task['fields']):
        q=f['answer'];raw=str(q['n']) if q['d']==1 else f'{q["n"]}/{q["d"]}'
        p.locator(f'[data-river-field="{f["id"]}"][data-task="{task["id"]}"]').fill(values[i] if values else raw)
    p.locator(f'[data-river-unit][data-task="{task["id"]}"]').select_option(task['fields'][0]['unit'])
    click(p,f'[data-river-check="{task["id"]}"]')
    ok(work(p)['checks'][-1]['outcome']=='match','task source context fits '+task['id'])
def own(p,pid,text):
    click(p,f'[data-river-plan-mode="own"][data-part="{pid}"]')
    p.locator(f'[data-river-plan-own="{pid}"]').fill(text)

def journey(browser,width,base,seeds):
    c,p=setup(browser,width,seeds['base'])
    try:
        print(f'River journey {width}: preview/history',flush=True)
        go(p,base);before=book(p)
        ok('riverRoom' not in before,'preview creates no visit')
        ok(not p.locator('.welcome-film').count(),'direct case route has no unrelated film')
        p.reload();settle(p);ok(book(p)==before,'preview reload is pure')
        click(p,'[data-river-start]');source=copy.deepcopy(work(p)['source']);first_visit=root(p)['current']
        ok(work(p)['page']==0,'explicit opening creates the history page')
        for passage in source['passages']['history']:
            click(p,f'[data-river-amount="{passage["id"]}"][data-section="history"]')
            ok(work(p)['amounts']['history']==passage['id'],'each passage amount persists')
            ok(passage['text'] in p.locator('main').inner_text(),'selected source-owned passage is shown')
            bounds(p)
        for card in source['sources']:
            code='source-'+card['id']
            if card['id']=='design':
                panel=p.locator('[data-river-panel="adult-design"]');panel.evaluate("x=>{x.open=true;for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
                ok(card['supports'] in panel.inner_text(),'design comparison stays in its adult source note')
            else:
                click(p,f'[data-river-help="{code}"]')
                ok(code in work(p)['help'],'source request recorded before reveal')
            ok(card['maker'] in p.locator('main').inner_text(),'source maker visible')
        for glossary in source['glossary']:
            code='glossary-'+glossary['id'];click(p,f'[data-river-help="{code}"]')
            ok(code in work(p)['help'] and glossary['text'] in p.locator('main').inner_text(),'glossary owned request and explanation')
        ordered=sorted(source['timeline'],key=lambda e:e['year'])
        for i,event in enumerate(ordered):
            while work(p)['order'].index(event['id'])>i:
                click(p,f'[data-river-order="{event["id"]}"][data-direction="-1"]')
        click(p,f'[data-river-check="{source["historyTask"]["id"]}"]')
        ok(work(p)['checks'][-1]['outcome']=='match','native chronology ordering checked against its source timeline')
        before_speech=p.evaluate('window.__riverSpoken.length')
        click(p,'[data-river-root] [data-speak]')
        spoken=p.evaluate('window.__riverSpoken')
        ok(len(spoken)==before_speech+1,'local narration invoked')
        sr=spoken[-1]['book']['riverRoom'];sw=sr['visits'][sr['current']]
        ok(any(code.startswith('audio-') for code in sw['help']),'audio support already persisted at playback')
        old_preview=p.locator('[data-preview-voice]').element_handle();old_voice=p.locator('[data-reading-voice]').element_handle();old_speed=p.locator('[data-reading-speed]').element_handle()
        stale_audio=p.locator('[data-river-root] [data-speak]').first.element_handle();cancels=p.evaluate('window.__riverCancels');turn(p,1)
        ok(p.evaluate('window.__riverCancels')>cancels,'navigation cancels local speech')
        held_book=book(p);held_store=p.evaluate("localStorage.getItem('learning-garden-explorers')");held_spoken=p.evaluate('window.__riverSpoken.length')
        old_preview.evaluate('x=>x.click()');old_voice.evaluate("x=>{x.value='synthetic-local';x.dispatchEvent(new Event('change',{bubbles:true}))}");old_speed.evaluate("x=>{x.value='0.8';x.dispatchEvent(new Event('change',{bubbles:true}))}")
        ok(book(p)==held_book and p.evaluate('window.__riverSpoken.length')==held_spoken and p.evaluate("localStorage.getItem('learning-garden-explorers')")==held_store,'detached generic preview/voice/speed controls cannot speak or change explorer preferences after rerender')
        held_audio=book(p);spoken_count=p.evaluate('window.__riverSpoken.length');stale_audio.evaluate('x=>x.click()');ok(book(p)==held_audio and p.evaluate('window.__riverSpoken.length')==spoken_count,'detached narration cannot play or record support')
        for measure in source['measures']:
            p.locator(f'[data-river-sort="{measure["id"]}"]').select_option(measure['fit'])
        click(p,f'[data-river-check="{source["sortTask"]["id"]}"]')
        ok(work(p)['checks'][-1]['outcome']=='match','all six measure classifications')
        for mid in source['analogy']['measures']:
            for plan in source['analogy']['plans']:
                code=f'analogy-{mid}-{plan["id"]}';click(p,f'[data-river-help="{code}"]')
                ok(code in work(p)['help'],'all nine analogies remain ungraded support')
        print(f'River journey {width}: geometry',flush=True)
        turn(p,2);bounds(p)
        scaffold=p.locator('[data-river-question="rectangle-extended"] .river-context');ok('\nFirst:' in scaffold.inner_text() and scaffold.evaluate('x=>getComputedStyle(x).whiteSpace')=='pre-line','two-step scaffold preserves line breaks in the actual layout')
        ok(source['labels']['geometry'].casefold() in p.locator('main').inner_text().casefold(),'invented geometry label visible')
        slider=p.locator('[data-river-width]');slider.scroll_into_view_if_needed();handle=slider.element_handle();box=slider.bounding_box();start_width=work(p)['modelWidth']
        # Real pointer sequence must retain the exact input node through multiple moves.
        p.mouse.move(box['x']+box['width']*.4,box['y']+box['height']/2);p.mouse.down()
        for ratio in [.5,.65,.8]:p.mouse.move(box['x']+box['width']*ratio,box['y']+box['height']/2,steps=5)
        p.mouse.up()
        ok(handle.evaluate('x=>x.isConnected&&x===document.querySelector("[data-river-width]")'),'range node and pointer survived dragging')
        ok(work(p)['modelWidth']!=start_width,'real pointer drag changed saved width')
        slider.focus();old_width=work(p)['modelWidth'];p.keyboard.press('ArrowLeft');ok(work(p)['modelWidth']==old_width-source['geometry']['step'],'range keyboard control')
        old_width=work(p)['modelWidth'];click(p,'[data-river-width-step="-1"]');ok(work(p)['modelWidth']==old_width-source['geometry']['step'],'tap alternative')
        click(p,'[data-river-keep-model]');first_model=copy.deepcopy(work(p)['models'][0])
        for task in [t for t in source['tasks'] if t['page']==2]:numeric(p,task)
        click(p,'[data-river-width-step="1"]');click(p,'[data-river-keep-model]')
        ok(work(p)['models'][0]==first_model,'changed model leaves first rectangle frozen')
        for task in [t for t in source['tasks'] if t['page']==2]:numeric(p,task)
        print(f'River journey {width}: Lent and perspectives',flush=True)
        turn(p,3);bounds(p)
        for passage in source['passages']['lent']:
            click(p,f'[data-river-amount="{passage["id"]}"][data-section="lent"]')
            ok(passage['text'] in p.locator('main').inner_text(),'each Lent amount reachable')
        for task in [t for t in source['tasks'] if t['page']==3]:numeric(p,task)
        perspective=0
        for discussion in source['discussions']:
            turn(p,discussion['page'])
            for option in discussion['options']:
                code=f'discussion-{discussion["id"]}-{option["id"]}';prior=len(work(p)['checks'])
                click(p,f'[data-river-help="{code}"]')
                ok(option['reply'] in p.locator('main').inner_text(),'every ungraded reply rendered exactly')
                ok(len(work(p)['checks'])==prior,'discussion creates no correctness attempt')
            if len(discussion['options'])==3 and all(any(word in (o['id']+' '+o['label']).lower() for word in ['gain','give','both']) for o in discussion['options']):perspective+=len(discussion['options'])
        ok(perspective==15,'all15 perspective replies visited')
        print(f'River journey {width}: note/refusal/transfer',flush=True)
        turn(p,4);bounds(p);part=source['parts'][0];pid=part['id'];text='\nSynthetic original <tag> & punctuation.'
        own(p,pid,text);click(p,f'[data-river-plan-mode="supplied"][data-part="{pid}"]')
        p.locator(f'[data-river-plan-choice="{pid}"]').select_option(part['options'][0]['id'])
        ok(work(p)['plan'][pid]['own']==text,'supplied choice preserves own draft')
        click(p,'[data-river-keep-note]');first_keep=copy.deepcopy(work(p)['firstKept'])
        own(p,pid,text);ok(p.locator(f'[data-river-plan-own="{pid}"]').input_value()==text,'leading newline and escaped text survive mode switches')
        ok('starterUsed' not in work(p)['plan'][pid],'older uncaptured starter provenance remains absent')
        held_starter=book(p);p.evaluate('window.__riverRefuse=true');p.once('dialog',lambda d:d.accept());click(p,f'[data-river-starter="{pid}"]');ok(book(p)==held_starter and 'starterUsed' not in work(p)['plan'][pid],'refused explicit copy sets no marker or draft text');p.evaluate('window.__riverRefuse=false')
        p.once('dialog',lambda d:d.dismiss());click(p,f'[data-river-starter="{pid}"]');ok(work(p)['plan'][pid]['own']==text,'cancel starter keeps own text')
        p.once('dialog',lambda d:d.accept());click(p,f'[data-river-starter="{pid}"]');ok(work(p)['plan'][pid]['own']==part['options'][0]['text'] and work(p)['plan'][pid].get('starterUsed') is True,'confirmed starter explicitly copies source words and captures provenance');ok(p.locator('[data-river-starter-used]').count()>0,'earlier supplied starter remains visibly distinguished')
        own(p,pid,'Revised original synthetic note.');click(p,'[data-river-keep-note]')
        ok(work(p)['firstKept']==first_keep and work(p)['kept']!=first_keep,'first/latest notes independent');ok(work(p)['kept']['plan'][pid].get('starterUsed') is True,'editing and keeping own prose retains earlier supplied starter provenance')
        p.screenshot(path=str(OUT/f'river-note-{width}.png'),full_page=True)
        # Refused text must survive native actions, keyboard, hash and Back.
        saved_words=work(p)['plan'][pid]['own'];p.evaluate('window.__riverRefuse=true');held=book(p)
        p.locator(f'[data-river-plan-own="{pid}"]').fill('Visible unsaved synthetic words.')
        ok(book(p)==held,'refused input changes no saved bytes')
        for selector in ['[data-river-keep-note]','[data-river-page="2"]','#explorer-switch']:
            click(p,selector);ok(book(p)==held,'refused text blocks '+selector)
        p.locator('[data-river-page="2"]').first.focus();p.keyboard.press('Enter');ok(work(p)['page']==4,'keyboard cannot discard unsaved words')
        p.evaluate("location.hash='#home'");p.wait_for_function("location.hash==='#learn/history/river-room'")
        p.evaluate("history.replaceState(null,'','#home');history.pushState(null,'','#learn/history/river-room')");p.go_back();p.wait_for_function("location.hash==='#learn/history/river-room'")
        ok(book(p)==held and p.locator(f'[data-river-plan-own="{pid}"]').input_value()=='Visible unsaved synthetic words.','hash/Back protects refused words')
        p.once('dialog',lambda d:d.dismiss());click(p,'[data-river-restore]');ok(p.locator(f'[data-river-plan-own="{pid}"]').input_value()=='Visible unsaved synthetic words.','cancel restore preserves visible draft')
        p.once('dialog',lambda d:d.accept());click(p,'[data-river-restore]');ok(p.locator(f'[data-river-plan-own="{pid}"]').input_value()==saved_words,'confirmed restore saved words')
        p.evaluate('window.__riverRefuse=false');ok(book(p).get('story')==before.get('story'),'case never writes town act/plan state');saved=copy.deepcopy(root(p));identity=active(p);p.reload();settle(p);ok(root(p)==saved,'reload exact complete case root')
        # Real notes transfer creates an independent explorer and retains source/raw snapshots.
        p.goto(base+'#notes');p.locator('#download').wait_for()
        with p.expect_download() as downloaded:click(p,'#download')
        exported=json.loads(Path(downloaded.value.path()).read_text());ok(exported['riverRoom']==saved,'actual notes download exact river root')
        p.locator('#progress-file').set_input_files({'name':'synthetic-river.json','mimeType':'application/json','buffer':json.dumps(exported).encode()});p.locator('#progress-import-confirm').wait_for()
        ok('River' in p.locator('.import-preview').inner_text(),'actual import preview names case')
        click(p,'#progress-import-confirm');imported=active(p);ok(imported!=identity,'import creates separate explorer');go(p,base);ok(root(p)==saved,'actual import preserves frozen work')
        own(p,pid,'Imported explorer independent words.');stale=p.locator('[data-river-keep-note]').element_handle();turn(p,0);click(p,'[data-river-root] [data-speak]');switch_preview=p.locator('[data-preview-voice]').element_handle();switch_voice=p.locator('[data-reading-voice]').element_handle();switch_speed=p.locator('[data-reading-speed]').element_handle();imported_root=copy.deepcopy(root(p))
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{identity}"]');p.locator('[data-river-root]').wait_for();held=book(p);stale.evaluate('x=>x.click()')
        ok(book(p)==held and root(p)==saved,'stale detached control cannot mutate another explorer')
        held_store=p.evaluate("localStorage.getItem('learning-garden-explorers')");held_spoken=p.evaluate('window.__riverSpoken.length');switch_preview.evaluate('x=>x.click()');switch_voice.evaluate("x=>{x.value='synthetic-local';x.dispatchEvent(new Event('change',{bubbles:true}))}");switch_speed.evaluate("x=>{x.value='1.15';x.dispatchEvent(new Event('change',{bubbles:true}))}")
        ok(book(p)==held and p.evaluate('window.__riverSpoken.length')==held_spoken and p.evaluate("localStorage.getItem('learning-garden-explorers')")==held_store,'generic speech controls from another explorer cannot play or overwrite current preferences')
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{imported}"]');p.locator('[data-river-root]').wait_for();ok(root(p)==imported_root,'explorers preserve independent words')
        ok(book(p)['syntheticOther']==seeds['base']['syntheticOther'],'unknown sibling remains exact');ok(book(p)['postOffice']['visits'][0]['packing']['input']=='17','pending parcel writing preserved')
        # Exercise actual invitations, including the bounded Desk casebook disclosure.
        p.goto(base+'#desk');p.locator('.river-casebook > summary').wait_for();click(p,'.river-casebook > summary');click(p,'.river-casebook a[href="'+ROUTE+'"]');p.locator('[data-river-root]').wait_for();ok(root(p)==imported_root,'Desk invitation opens exact case without creating work')
        for route in ['#pathways/science','#pathways/english','#learn/science/records']:
            p.goto(base+route);p.locator('a[href="'+ROUTE+'"]').first.wait_for();click(p,'a[href="'+ROUTE+'"]');p.locator('[data-river-root]').wait_for();ok(root(p)==imported_root,'actual invitation '+route)
    except Exception:
        print('Browser page errors: '+str(errors),flush=True)
        print('Speech status: '+str(p.locator('[data-speech-status]').all_inner_texts()),flush=True)
        p.screenshot(path=str(OUT/f'failure-{width}.png'),full_page=True)
        raise
    finally:c.close()

def edge_cases(browser,base,seeds):
    for name in ['old','malformed','future']:
        c,p=setup(browser,320,seeds[name])
        try:
            go(p,base);held=copy.deepcopy(root(p))
            if name=='future':
                ok(not p.locator('[data-river-start]').count(),'unsupported root read-only');ok(root(p)==held,'unsupported root exact');p.goto(base+'#pathways/science');p.locator('[data-pathway-root]').wait_for();ok(root(p)==held,'other destinations open')
            else:
                turn(p,2)
                if name=='malformed':ok('Latest rectangle record' in p.locator('main').inner_text(),'unreadable latest rectangle is explicitly labelled before a new model')
                ok(work(p)['source']['id']=='earlier-river-source','unknown own source remains');ok(len(work(p)['source']['timeline'])==2,'fewer old timeline cards unchanged');numeric(p,work(p)['source']['tasks'][0]);click(p,'[data-river-keep-model]');ok(work(p)['models'][-1]['area']=={'n':1800,'d':1},'old model owns1800 area independent of fixed2000 task');turn(p,4);ok(p.locator('[data-river-plan-own]').count()==1,'fewer old note parts remain one')
                if name=='malformed':
                    ok(work(p)['kept']=={'synthetic':'unreadable latest note'},'unreadable latest never falls back');ok(p.locator('[data-river-unreadable]').filter(has_text='Latest note cannot be read here.').count()==1,'unreadable latest labelled');click(p,'[data-river-keep-note]');ok(work(p)['checks'][0]=={'taskId':work(p)['source']['tasks'][0]['id'],'synthetic':'unreadable latest check'},'healthy keeping preserves bad check raw');ok('[raw visit]' in root(p)['visits'],'unreadable sibling visit retained')
                    removal=p.locator('[data-river-remove-choice]');removal.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}");removal.select_option('[raw visit]');held_work=copy.deepcopy(work(p));serial=root(p)['next'];p.once('dialog',lambda d:d.accept());click(p,'[data-river-remove]');ok('[raw visit]' not in root(p)['visits'] and work(p)==held_work and root(p)['next']==serial,'confirmed unreadable raw-key removal preserves healthy work and serial')
        finally:c.close()
    c,p=setup(browser,820,seeds['malformedAnswer'])
    try:
        go(p,base);held=copy.deepcopy(work(p)['answers'])
        ok(not p.locator('[data-river-field]').count(),'malformed overlong numeric draft is retained read-only')
        ok(p.locator('.river-numeric [data-river-unreadable]').count()==1,'malformed draft has a visible retained notice')
        ok('9x10' not in book(p).get('exposures',[]) and 'Synthetic displayed9' not in p.locator('main').inner_text(),'hidden malformed task context neither renders nor qualifies')
        turn(p,4);own(p,work(p)['source']['parts'][0]['id'],'Healthy synthetic writing around malformed numeric draft.');click(p,'[data-river-keep-note]');ok(work(p)['answers']==held,'healthy note preserves malformed answer exactly')
    finally:c.close()
    for name in ['summaryOnly','oldTileOnly','visibleSummary']:
        c,p=setup(browser,820,seeds[name])
        try:
            go(p,base)
            for panel in p.locator('.river-kept details').all():panel.evaluate('x=>x.open=true')
            r=next(v for v in book(p)['postOffice']['visits'] if v['id']==book(p)['postOffice']['current'])['rival']
            if name=='visibleSummary':ok(r.get('priorFactShown') is True and 'Width: 2 m' in p.locator('main').inner_text(),'actual own2-by5 dimension summary qualifies fresh2x5')
            else:ok(not r.get('priorFactShown'),'summary cannot qualify hidden old tile metadata '+name)
        finally:c.close()
    for name in ['scale20','legacyScale']:
        c,p=setup(browser,820,seeds[name])
        try:
            go(p,base);source=copy.deepcopy(work(p)['source']);held_source=copy.deepcopy(source)
            if name=='scale20':
                text=p.locator('.river-scale').inner_text();ok('20' in text and '1:2000' in text and '50 meters' not in text and '1:5000' not in text,'older paper scale derives20m/cm and1:2000 from its own source')
            else:ok(not p.locator('.river-paired-bars').count(),'legacy absent scale does not invent a current50m paper graphic')
            for task in [t for t in source['tasks'] if t['page']==3]:numeric(p,task)
            ok(work(p)['source']==held_source,'older scale source remains byte-equivalent after checks')
            if name=='legacyScale':ok('scale' not in work(p)['source'],'absent old scale remains absent')
        finally:c.close()
    # Actual host qualification: first no math in preview, refusal before tile/audio, restored math preflight.
    c,p=setup(browser,820,seeds['pending'])
    try:
        go(p,base)
        def rival():return next(v for v in book(p)['postOffice']['visits'] if v['id']==book(p)['postOffice']['current'])['rival']
        ok(not rival().get('priorFactShown'),'preview leaves actual waiting3x4 fresh');click(p,'[data-river-start]');held=book(p);p.evaluate('window.__riverRefuse=true');turn(p,2)
        ok(book(p)==held and work(p)['page']==0 and not rival().get('priorFactShown'),'refused page exposes/qualifies no tile')
        previous=p.evaluate('window.__riverSpoken.length');click(p,'[data-river-root] [data-speak]');ok(p.evaluate('window.__riverSpoken.length')==previous,'refused narration plays no prose')
        p.evaluate('window.__riverRefuse=false');turn(p,2);ok(rival().get('priorFactShown') and '3x4' in book(p).get('exposures',[]),'real host qualifies pending3x4 before rendered tile')
    finally:c.close()
    c,p=setup(browser,820,seeds['restored'],refuse=True)
    try:
        go(p,base);ok(root(p)==seeds['restored']['riverRoom'],'restored blocked display leaves work exact');ok(not p.locator('[data-river-width]').count(),'refused restored mathematics not revealed');ok('3x4' not in book(p).get('exposures',[]),'refused prepare display no helper leak')
    finally:c.close()
    c,p=setup(browser,820,seeds['helper'])
    try:
        go(p,base);hid=seeds['hid'];held=book(p);p.evaluate('window.__riverRefuse=true');click(p,f'[data-river-help="{hid}"]');ok(book(p)==held,'refused own helper leaves bytes');p.evaluate('window.__riverRefuse=false');click(p,f'[data-river-help="{hid}"]');ok('3x4' in book(p).get('exposures',[]),'retained helper qualifies own3x4 rather than current2x2 tile');ok('Earlier: 3 × 4 = 12.' in p.locator('main').inner_text(),'retained helper text visible')
    finally:c.close()

if __name__=='__main__':
    server=None;base=os.environ.get('RIVER_TEST_URL')
    if not base:
        server=PreviewServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    try:
        seeds=fixtures()
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
            try:
                for width in [320,820]:journey(browser,width,base,seeds)
                edge_cases(browser,base,seeds);ok(not errors,'no browser errors '+str(errors));print(f'River Chrome: {checks} assertions passed; screenshots {OUT}')
            finally:browser.close()
    finally:
        if server:server.shutdown();server.server_close()
