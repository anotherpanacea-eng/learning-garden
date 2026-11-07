"""Spinner Table410 actual-app journeys with invented notebooks only.

The temporary response observer exposes actual memory read-only. Speech is a
local text stub; this suite does not qualify device audio or measure learning.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, json, os, subprocess, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('SPINNER_TABLE_ARTIFACTS', '/private/tmp/lg410-native'))
OUT.mkdir(parents=True, exist_ok=True)
checks, errors, contexts, pages = 0, [], [], []


def ok(value, message):
    global checks
    checks += 1
    assert value, message


def fixture(cap=False):
    code = '''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startSeed, drawSeed, chooseSeedPrediction} from './dist/seed-stall-core.mjs';
const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;
s.syntheticSibling={raw:'Invented sibling retained exactly'};
for(let i=0;i<COUNT;i++)startSeed(s,(i+3)%7);
chooseSeedPrediction(s,'moon');drawSeed(s,0);drawSeed(s,4);
console.log(JSON.stringify(s));'''.replace('COUNT', '8' if cap else '1')
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def setup(browser, base, seed=None, width=820, motion='reduce'):
    ctx = browser.new_context(viewport={'width':width,'height':1000 if width>320 else 700}, has_touch=True, reduced_motion=motion, accept_downloads=True)
    contexts.append(ctx)
    registry = {'version':1,'activeId':'explorer-1','explorers':[
        {'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-05T12:00:00Z'},
        {'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-11-05T12:00:00Z'}]}
    data = {'registry':registry,'seed':seed if seed is not None else fixture()}
    ctx.add_init_script('''(d=>{if(!localStorage.getItem('spinner-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem('number-garden-v1:'+e.id,JSON.stringify(d.seed));localStorage.setItem('spinner-fixture','1');}
window.__spinnerQueue=[];window.__spinnerEntropyReads=0;window.__spinnerEntropyMode='queue';Object.defineProperty(crypto,'getRandomValues',{value(a){window.__spinnerEntropyReads++;if(window.__spinnerEntropyMode==='throw')throw Error('Synthetic entropy unavailable');a[0]=window.__spinnerQueue.length?window.__spinnerQueue.shift():0;return a;}});window.__spinnerAnimations=[];const animate=Element.prototype.animate;Element.prototype.animate=function(k,o){window.__spinnerAnimations.push({keyframes:k,options:o});return animate.call(this,k,o);};window.__spinnerSpoken=[];Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{name:'Invented local voice',lang:'en-US',localService:true,default:true,voiceURI:'invented-local'}],cancel(){},speak(u){window.__spinnerSpoken.push(u.text);},addEventListener(){},removeEventListener(){}}});window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
})('''+json.dumps(data)+')')
    def observer(route):
        response=route.fetch();body=response.text();marker='let graph=null,'
        assert body.count(marker)==1, 'actual app observation marker'
        route.fulfill(response=response,body=body.replace(marker,'window.__spinnerObservedState=()=>state;'+marker,1))
    ctx.route('**/app.mjs',observer)
    p=ctx.new_page();pages.append(p);p.set_default_timeout(12000)
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    p.on('response',lambda r:errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None)
    p.goto(base+'#numbers/seeds',wait_until='networkidle')
    ready(p)
    return p


def ready(p):
    active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
    choice='[data-select-explorer="'+active+'"]'
    p.locator('[data-stw-entry],'+choice).first.wait_for()
    if p.locator(choice).count():
        p.locator(choice).click()
        p.evaluate('location.hash="#numbers/seeds"')
    p.locator('[data-stw-entry]').wait_for()


def snapshot(p):
    return p.evaluate('''()=>({memory:JSON.parse(JSON.stringify(window.__spinnerObservedState())),storage:Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))})''')


def unchanged(p, before, why):
    after=snapshot(p)
    ok(after['memory']==before['memory'],why+' preserves actual in-memory notebook')
    ok(after['storage']==before['storage'],why+' preserves full storage values')


def selector(action, value=None):
    return '[data-stw-action="'+action+'"]'+('' if value is None else '[data-stw-value="'+str(value)+'"]')


def click(p, action, value=None, before=None):
    p.locator(selector(action,value)).first.click()
    if before is not None:unchanged(p,before,action)


def enter(p, before=None):
    p.locator('[data-stw-entry]').click();p.locator('[data-stw-root]').wait_for()
    ok(p.locator('#stw-title').evaluate('e=>e===document.activeElement'),'entry focuses child heading')
    ok(not p.locator('[data-seed-root],a[href="#numbers/seeds/pairs"]').count(),'child replaces parent and sibling entry')
    ok(not p.locator('main drawn-howto').count(),'child omits parent six-draw Show me how')
    if before is not None:unchanged(p,before,'entry')


def dispatch(handle, event='click'):
    handle.evaluate('(e,t)=>e.dispatchEvent(new Event(t,{bubbles:true,cancelable:true}))',event)


def frame(p):
    return p.locator('[data-seed-root]').evaluate('''e=>({html:e.innerHTML,folds:[...e.querySelectorAll('details')].map(d=>[d.dataset.seedFold,d.open])})''')


def bounds(p):
    labels=p.locator('[data-stw-root] label').evaluate_all('xs=>xs.filter(e=>e.checkVisibility()&&!e.control).map(e=>e.textContent)')
    ok(not labels,'visible labels associate with their native controls: '+str(labels))
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    bad=p.locator('[data-stw-root] button,[data-stw-root] select,[data-stw-root] summary,[data-stw-root] a').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&!e.disabled&&!e.closest('.speech-controls')&&(e.getBoundingClientRect().width<43.9||e.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({label:e.textContent,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))''')
    ok(not bad,'44px targets and16px controls: '+str(bad))
    tiny=p.locator('[data-stw-root] svg text,[data-stw-root] figcaption,[data-stw-root] .stw-key').evaluate_all('xs=>xs.filter(e=>e.checkVisibility()&&parseFloat(getComputedStyle(e).fontSize)<15.9).map(e=>e.textContent)')
    ok(not tiny,'effective diagram labels16px: '+str(tiny))
    legends=p.locator('[data-stw-root] figure > ul').evaluate_all(r"""xs=>xs.filter(e=>e.checkVisibility()).map(key=>{
      const rect=e=>e.getBoundingClientRect(), within=(a,b)=>a.left>=b.left-1&&a.right<=b.right+1&&a.top>=b.top-1&&a.bottom<=b.bottom+1;
      const k=rect(key),figure=rect(key.closest('figure')),panel=rect(key.closest('.stw-sheet'));
      const rows=[...key.children].map(row=>{const r=rect(row),icon=row.firstElementChild,text=row.lastElementChild,t=rect(text),i=rect(icon),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=getComputedStyle(text).font;const longest=Math.max(...text.textContent.split(/\s+/).map(w=>ctx.measureText(w).width));
        return {label:text.textContent,contained:within(r,k)&&within(r,figure)&&within(t,r)&&within(i,r),naturalWords:t.width>=longest-1,noIconOverlap:i.right<=t.left+1,noTextOverflow:text.scrollWidth<=text.clientWidth+1};});
      return {visibleBox:k.width>0&&k.height>0,withinPanel:within(k,panel)&&within(k,figure),rows};
    })""")
    ok(all(x['visibleBox'] and x['withinPanel'] and all(r['contained'] and r['naturalWords'] and r['noIconOverlap'] and r['noTextOverflow'] for r in x['rows']) for x in legends),'legend rows retain natural words and contain icon/text within wheel and parent panel: '+str(legends))


def hear(p, before=None, includes=(), excludes=()):
    p.locator('[data-stw-root] [data-speak]').click()
    actual=p.evaluate('__spinnerSpoken.at(-1)||""')
    spoken=p.locator('[data-stw-root] [data-speak]').get_attribute('data-speak') or ''
    ok(bool(actual),'Hear reaches real speech binding with local text stub')
    ok(all(t in spoken for t in includes) and not any(t in spoken for t in excludes),'narration contains current visible content only: '+spoken)
    if before is not None:unchanged(p,before,'Hear')
    return spoken


def notes(p, label):
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
    with p.expect_download() as result:p.locator('#download').click()
    path=OUT/(label+'.json');result.value.save_as(str(path))
    return json.loads(path.read_text())


def focus(p, target, why):
    ok(p.locator(target).evaluate('e=>e===document.activeElement'), why)


def reads(p):return p.evaluate('__spinnerEntropyReads')


def queue(p, values):p.evaluate('v=>{__spinnerEntropyMode="queue";__spinnerQueue=v}',values)


def tally(p):
    text=p.locator('#stw-result').inner_text()
    import re
    match=re.search(r'Screen draw (\d+): (Sun|Cloud|Rain) mark\. Tally: Sun (\d+), Cloud (\d+), Rain (\d+)',text)
    ok(bool(match),'result gives independent draw, mark and integer tally: '+text)
    return (int(match[1]), match[2], [int(match[i]) for i in [3,4,5]])


def spin(p, slot, expected_counts, expected_tally, before=None):
    n=reads(p);queue(p,[slot]);click(p,'spin',before=before)
    mark=['Sun','Cloud','Rain'][0 if slot<expected_counts[0] else 1 if slot<sum(expected_counts[:2]) else 2]
    d,actual,counts=tally(p)
    ok(actual==mark and counts==expected_tally and d==sum(expected_tally),'frozen independent slot/mark/tally agreement')
    ok(reads(p)==n+1,'one accepted synthetic entropy read per real Spin')
    focus(p,'#stw-result','Spin focuses its visible result heading')
    # The SVG reports its real highlighted slice and resting pointer, rather
    # than deriving an expected mark from the implementation model.
    selected=p.locator('.stw-selected')
    ok(selected.count()==1,'exactly one slice highlighted after a draw')
    ok(selected.get_attribute('data-stw-slice')==str(slot),'highlighted slice is sampled zero-based slot')
    ok(selected.get_attribute('data-stw-mark')==str(['Sun','Cloud','Rain'].index(mark)),'selected SVG shape carries the expected frozen mark')
    pointer=p.locator('[data-stw-pointer]')
    angle=(slot+.5)*30
    ok(pointer.get_attribute('data-angle')==str(angle).removesuffix('.0'),'resting pointer is independently computed slice center')
    ok(pointer.evaluate('e=>e.style.transform')=='rotate('+str(angle).removesuffix('.0')+'deg)','actual SVG pointer transform uses sampled center')
    rows=p.locator('[data-stw-tally-mark]').evaluate_all('xs=>xs.map(e=>Number(e.dataset.count))')
    ok(rows==expected_tally,'separate visible tally uses independently counted results')


def capture(p,name):
    stop=p.locator('[data-stop-speech]')
    if stop.count() and stop.first.is_visible():stop.first.click()
    target=p.locator('#stw-result,#stw-page-title').first
    target.focus();p.screenshot(path=str(OUT/name),full_page=True)
    p.screenshot(path=str(OUT/(Path(name).stem+'-viewport.png')),full_page=False)
    p.locator('[data-stw-root]').screenshot(path=str(OUT/(Path(name).stem+'-activity.png')))


def journey(browser,base):
    print('Spinner Table: complete820px tablet journey using synthetic entropy',flush=True)
    p=setup(browser,base)
    for fold in ['history','talk']:p.locator('[data-seed-fold="'+fold+'"]').evaluate('e=>e.open=true')
    parent,before=frame(p),snapshot(p)
    enter(p,before);bounds(p)
    hear(p,before,includes=['12','Sun','Cloud','Rain'],excludes=['Screen draw 1'])
    n=reads(p);click(p,'page','runs',before);ok(not p.locator(selector('spin')).count(),'no Spin before an explicit run')
    ok('Not drawn yet' in p.locator('[data-stw-root]').inner_text(),'empty Runs is explicitly not drawn')
    click(p,'start',before=before);focus(p,'#stw-run-title','Start focuses run heading')
    ok(reads(p)==n,'viewing and starting use no entropy')
    ok(not p.locator('[data-stw-pointer]').count(),'empty run has no outcome pointer')
    expected=[0,0,0]
    old=p.locator(selector('spin')).element_handle()
    for slot in range(12):
        expected[0 if slot<6 else 1 if slot<9 else 2]+=1
        spin(p,slot,[6,3,3],expected,before)
    n=reads(p);dispatch(old);ok(reads(p)==n and tally(p)[0]==12,'old Spin handle consumes no RNG')
    click(p,'summary',before=before)
    ok(p.locator('[data-stw-summary]').count()==1,'Compare runs reveals actual summary rows')
    hear(p,before,includes=['6','3','12'])
    capture(p,'tablet-runs.png')
    click(p,'page','design',before);click(p,'preset',0,before)
    click(p,'page','runs',before)
    ok('earlier wheel' in p.locator('[data-stw-root]').inner_text(),'edited design explicitly distinguishes frozen run')
    ok(p.locator('[data-stw-summary]').count()==1,'summary open state survives page and design changes')
    spin(p,5,[6,3,3],[7,3,3],before)
    click(p,'start',before=before)
    spin(p,5,[4,4,4],[0,1,0],before)
    click(p,'page','design',before);click(p,'preset',2,before);click(p,'start',before=before)
    spin(p,9,[10,1,1],[1,0,0],before)
    ok(p.locator('#stw-start').is_disabled(),'three-run cap disables Start')
    for run,initial,counts in [(0,[7,3,3],[6,3,3]),(1,[0,1,0],[4,4,4]),(2,[1,0,0],[10,1,1])]:
        click(p,'active',run,before);focus(p,'#stw-run-title','older run resumes at its heading')
        for _ in range(20-sum(initial)):
            initial[0]+=1;spin(p,4 if run==0 else 0,counts,initial,before)
        ok(p.locator(selector('spin')).is_disabled(),'each of all three runs stops at20')
        n=reads(p);dispatch(p.locator(selector('spin')).element_handle());ok(reads(p)==n,'capped Spin consumes no RNG')
    capture(p,'tablet-three-runs.png')
    click(p,'reset-request',before=before);focus(p,selector('reset-cancel'),'request focuses Keep')
    clear=p.locator(selector('reset-confirm')).element_handle()
    click(p,'reset-cancel',before=before);dispatch(clear)
    ok(p.locator(selector('active')).count()==3,'old confirmation cannot clear retained runs')
    p.locator(selector('reset-request')).dblclick()
    ok(p.locator(selector('active')).count()==3,'double click at request location cannot clear runs')
    if p.locator(selector('reset-cancel')).count():click(p,'reset-cancel')
    click(p,'reset-request');click(p,'page','design');click(p,'page','runs')
    ok(not p.locator(selector('reset-confirm')).count(),'page change cancels confirmation')
    click(p,'reset-request');click(p,'back',before=before)
    ok(frame(p)==parent,'Back restores parent chooser/folds and saved active experiment')
    enter(p,before);ok(not p.locator(selector('reset-confirm')).count(),'Back cancels confirmation before reentry')
    click(p,'reset-request');click(p,'reset-confirm',before=before)
    focus(p,'#stw-start','explicit clear focuses empty Start')
    ok(not p.locator(selector('active')).count(),'only explicit current Clear clears all local runs')
    click(p,'start');n=reads(p)
    p.evaluate('__spinnerEntropyMode="throw"');click(p,'spin');focus(p,'#stw-status','entropy failure focuses current error')
    ok(reads(p)==n+1 and 'Not drawn yet' in p.locator('[data-stw-root]').inner_text(),'failed entropy makes no invented outcome')
    click(p,'spin');focus(p,'#stw-status','repeated retry refocuses current error');ok(reads(p)==n+2,'retry really requests entropy')
    queue(p,[4294967292]*32);click(p,'spin');ok(reads(p)==n+34,'exactly32 rejected reads exhaust source')
    queue(p,[4294967292]*31+[4294967291]);click(p,'spin')
    ok(reads(p)==n+66 and tally(p)==(1,'Rain',[0,0,1]),'31 rejected then accepted maximum maps to stop12')
    for cancel_action in ['spin','start']:
        click(p,'reset-request');old=p.locator(selector('reset-confirm')).element_handle()
        if cancel_action=='spin':spin(p,0,[10,1,1],[1,0,1])
        else:click(p,'start')
        dispatch(old);ok(not p.locator(selector('reset-confirm')).count(),cancel_action+' cancels reset; stale confirm inert')
    # Fresh real locators count as deliberate rapid activations; old handles do not.
    queue(p,[1,2]);p.locator(selector('spin')).click();p.locator(selector('spin')).click()
    ok(tally(p)[0]==2,'two rapid genuine activations each commit once')
    key=p.locator(selector('spin')).element_handle();n=reads(p)
    key.evaluate('e=>e.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",repeat:true,bubbles:true,cancelable:true}))')
    ok(reads(p)==n,'held repeated key does not consume entropy')
    click(p,'page','learn');focus(p,'#stw-page-title','page focuses current heading')
    titles=['Count equal stops, not names.','Redesign the shares.','A run is not a promise.','Keep the old wheel with its results.']
    for i,title in enumerate(titles):
        if i:click(p,'lesson',i)
        ok(p.locator('#stw-lesson').inner_text().rstrip('.')==title.rstrip('.'),'one current teaching picture')
        hear(p,before,includes=[title.rstrip('.')])
        if i==2:ok('An example, not your run and not a fresh random draw' in p.locator('[data-stw-root]').inner_text(),'authored outcomes explicitly labeled')
    click(p,'learn-panel','questions');focus(p,'#stw-panel-title','question panel focuses panel heading')
    for i,key in enumerate([1,0,2,1]):
        if i:click(p,'question',i);focus(p,'#stw-question','question turn focuses question')
        order=p.locator(selector('answer')).all_inner_texts()
        click(p,'answer',(key+1)%3);click(p,'explanation');click(p,'answer',key)
        ok(p.locator(selector('answer',key)).get_attribute('aria-pressed')=='true','supported answer revisable with fixed fitting position')
        ok(p.locator('[data-stw-explanation]').count()==1,'answer revision retains explanation')
        ok(order==p.locator(selector('answer')).all_inner_texts(),'answer order stays fixed')
        hear(p,before,includes=['1/2' if i in [0,2] else '1/3' if i==1 else '1/4'])
    bounds(p);capture(p,'tablet-question.png');click(p,'back',before=before)
    # Both sibling child works survive returning to the parent within this room.
    p.locator('[data-cl-entry]').click();p.locator('#cl-point-select').select_option('8')
    p.locator('[data-cl-action="back"]').click();enter(p)
    ok(p.locator(selector('answer',1)).get_attribute('aria-pressed')=='true','Spinner work survives Chance Line visit')
    click(p,'back');p.locator('[data-cl-entry]').click();ok(p.locator('#cl-point-select').input_value()=='8','Chance Line work survives Spinner visit')
    p.locator('[data-cl-action="back"]').click()
    report=notes(p,'preserved-spinner-notes')
    ok(report['seedStall']==before['memory']['seedStall'],'actual Notes export retains original saved experiments')
    return report

def lifecycle(browser,base,report):
    print('Spinner Table: actual parent boundaries and stale controls',flush=True)
    p=setup(browser,base)
    before=snapshot(p);entry=p.locator('[data-stw-entry]').element_handle()
    entry.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)}');dispatch(entry)
    ok(not p.locator('[data-stw-root]').count(),'detached/reattached entry is retired');unchanged(p,before,'retired entry')
    for mode in ['hidden','detached','ancestor']:
        p.reload(wait_until='networkidle');ready(p);enter(p);click(p,'start');spin(p,0,[6,3,3],[1,0,0]);click(p,'reset-request')
        controls=[p.locator(selector('spin')).element_handle(),p.locator('[data-stw-hear]').element_handle(),p.locator(selector('reset-confirm')).element_handle()]
        root=p.locator('[data-stw-root]');before=snapshot(p);n=reads(p);spoken=p.evaluate('__spinnerSpoken.length')
        if mode=='hidden':root.evaluate('e=>e.hidden=true')
        elif mode=='detached':root.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)}')
        else:root.evaluate('e=>{const d=document.createElement("div");e.parentNode.append(d);d.append(e)}')
        for c in controls:dispatch(c)
        if mode=='hidden':
            root.evaluate('e=>e.hidden=false')
            for c in controls:dispatch(c)
        ok(reads(p)==n and p.evaluate('__spinnerSpoken.length')==spoken,mode+' retired Spin/Hear/confirm act before neither RNG nor speech')
        unchanged(p,before,mode+' controls')
    p.reload(wait_until='networkidle');ready(p);enter(p);click(p,'start');spin(p,0,[6,3,3],[1,0,0])
    # Explicitly synthetic external mutations exercise captured-parent
    # invalidation. These are not learner actions or supported notebook edits.
    for code in ['s.seedStall=structuredClone(s.seedStall)',"s.seedStall.investigations[0].source.rule='Synthetic external rule.'"]:
        old=p.locator(selector('spin')).element_handle()
        p.evaluate('(code)=>{const s=__spinnerObservedState();eval(code)}',code)
        before=snapshot(p);n=reads(p);dispatch(old);p.locator('[data-stw-entry]').wait_for()
        ok(reads(p)==n,'synthetic parent identity/value invalidation exits before RNG')
        focus(p,'[data-stw-entry]','source recovery focuses correct Spinner entry');unchanged(p,before,'synthetic source invalidation')
        enter(p);ok(tally(p)==(1,'Sun',[1,0,0]),'same notebook source replacement preserves local work without replay')
    old=p.locator('[data-stw-hear]').element_handle()
    p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.evaluate('location.hash="#numbers/seeds"');ready(p)
    n=reads(p);spoken=p.evaluate('__spinnerSpoken.length');before=snapshot(p);dispatch(old)
    ok(reads(p)==n and p.evaluate('__spinnerSpoken.length')==spoken,'departed owner Hear is inert');unchanged(p,before,'owner boundary')
    enter(p);click(p,'page','runs');ok(not p.locator(selector('active')).count(),'new explorer starts fresh work')
    click(p,'start');click(p,'back');p.locator('a[href="#numbers/seeds/pairs"]').click();p.locator('[data-pairs-root]').wait_for()
    p.evaluate('location.hash="#numbers/seeds"');ready(p);enter(p);click(p,'page','runs')
    ok(not p.locator(selector('active')).count(),'exact room departure through Pairs clears visit')
    click(p,'start');old=p.locator(selector('spin')).element_handle();n=reads(p)
    p.evaluate('history.replaceState(null,"","#numbers/seeds/pairs")');dispatch(old)
    ok(reads(p)==n,'same tick route mismatch guards Spin before RNG')
    p.evaluate('location.hash="#notes"');p.locator('#progress-file').wait_for()
    p.locator('#progress-file').set_input_files({'name':'invented-spinner-notebook.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
    p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
    p.evaluate('location.hash="#numbers/seeds"');ready(p);enter(p);click(p,'page','runs')
    ok(not p.locator(selector('active')).count(),'actual Notes import starts a fresh visit')
    for kind in ['missing','recovery','pending']:
        seed=fixture(kind=='pending')
        if kind=='missing':del seed['seedStall']
        elif kind=='recovery':seed['seedStall']={'version':99,'raw':'Invented opaque record'}
        q=setup(browser,base,seed)
        if kind=='pending':
            q.locator('[data-seed-change]').click();q.locator('[data-seed-adjust="-1"]').click();q.locator('[data-seed-start]').click()
            ok(q.locator('[data-seed-confirm]').count()==1,'eight experiments create actual pending replacement')
        before=snapshot(q);parent=frame(q);enter(q,before);click(q,'start',before=before);spin(q,11,[6,3,3],[0,0,1],before);click(q,'back',before=before)
        ok(frame(q)==parent,kind+' parent frame restored exactly')
    q=setup(browser,base);q.evaluate('location.hash="#numbers/seeds/"');q.locator('[data-seed-root]').wait_for()
    ok(not q.locator('[data-stw-entry]').count(),'legacy alias omits Spinner entry')


def responsive_and_motion(browser,base):
    print('Spinner Table: focused320px keyboard/layout and non-reduced motion',flush=True)
    p=setup(browser,base,width=320);enter(p);bounds(p)
    p.locator('#stw-from').focus();p.locator('#stw-from').select_option('0');focus(p,'#stw-from','from selection keeps native focus')
    p.locator('#stw-to').focus();p.locator('#stw-to').select_option('1');focus(p,'#stw-to','recipient selection keeps native focus')
    for _ in range(6):
        p.locator(selector('move')).focus();p.keyboard.press('Enter')
    focus(p,'#stw-from','exhausted donor Move returns focus to donor selector')
    ok(p.locator(selector('move')).is_disabled(),'empty donor disables transfer')
    p.locator('#stw-from').select_option('1');p.locator('#stw-to').select_option('1')
    ok(p.locator(selector('move')).is_disabled(),'same donor/recipient disables transfer')
    click(p,'preset',0);focus(p,selector('preset',0),'preset retains stable control focus');bounds(p);capture(p,'phone-design.png')
    p.locator('#stw-start').focus();p.keyboard.press('Enter');spin(p,11,[4,4,4],[0,0,1]);bounds(p);capture(p,'phone-runs.png')
    ok(p.evaluate('__spinnerAnimations.length')==0,'reduced motion never requests turns')
    click(p,'page','learn');click(p,'lesson',1);click(p,'lesson',2);click(p,'lesson',3)
    focus(p,'#stw-lesson','last picture keeps meaningful heading focus');bounds(p);capture(p,'phone-picture.png')
    click(p,'learn-panel','questions');click(p,'question',1);click(p,'question',2);click(p,'question',3);click(p,'answer',1);click(p,'explanation');bounds(p);capture(p,'phone-question.png')
    q=setup(browser,base,motion='no-preference');enter(q);click(q,'start');spin(q,7,[6,3,3],[0,1,0])
    ok(q.evaluate('__spinnerAnimations.length')==1,'one live Spin starts one cosmetic animation')
    animation=q.evaluate('__spinnerAnimations[0]')
    ok(animation['options']['duration']<=500,'cosmetic turns last at most500ms')
    hear(q);click(q,'page','design');click(q,'page','runs');click(q,'back');enter(q)
    ok(q.evaluate('__spinnerAnimations.length')==1,'Hear/navigation/reentry do not replay animation')
    ok(tally(q)==(1,'Cloud',[0,1,0]),'resting result remains exact after motion and reentry')


def main():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        protocol_version='HTTP/1.1'
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):
        request_queue_size=128
        daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start();base='http://127.0.0.1:'+str(server.server_port)+'/'
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
            try:
                report=journey(browser,base);lifecycle(browser,base,report);responsive_and_motion(browser,base)
                ok(not errors,'no page, console or HTTP errors: '+str(errors))
                print(json.dumps({'status':'passed','checks':checks,'artifacts':str(OUT)}),flush=True)
            except Exception:
                (OUT/'failure.txt').write_text(traceback.format_exc())
                for i,p in enumerate(pages):
                    if not p.is_closed():p.screenshot(path=str(OUT/('failure-'+str(i)+'.png')),full_page=True)
                raise
            finally:browser.close()
    finally:server.shutdown();server.server_close()


if __name__=='__main__':main()
