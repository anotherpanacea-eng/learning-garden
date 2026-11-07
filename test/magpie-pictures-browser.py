"""Magpie Pictures411 actual-app Chromium journeys, invented notebooks only.

The response marker observes the actual app notebook. Speech is a local text
stub; screenshots and text observations do not qualify device audio or learning.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, json, os, subprocess, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('MAGPIE_PICTURES_ARTIFACTS', '/private/tmp/lg411-native'))
OUT.mkdir(parents=True, exist_ok=True)
checks, errors, pages = 0, [], []
SCENES = ['Supper', 'New guests', 'Welcome speech', 'Surprise news', 'Easy riddle', 'Outside the window']
CHOICES = [
 ['I am very hungry.', 'I could eat a whole horse.', 'I want to ride a horse.'],
 ['Leave before the party starts.', 'Start a friendly conversation.', 'Break a real piece of ice.'],
 ['Butterflies inside my body.', 'Hoping to see butterflies.', 'Nervous before my speech.'],
 ['Pip let a real cat out.', 'Pip told the surprise early.', 'Pip mended a torn paper bag.'],
 ['That riddle felt easy.', 'That riddle needs icing.', 'That riddle was dessert.'],
 ['Only a little rain is falling.', 'Cats and dogs come down from clouds.', 'Rain is falling very heavily.']]
BIRDS = ['horse-plate', 'ice-bowl', 'butterfly-outline', 'cat-bag', 'riddle-cake', 'rain-animals']
REFERENCES = ['hungry', 'greeting', 'nervous-speech', 'song-news', 'easy-riddle', 'heavy-rain']
MEANINGS = ['Pip means Pip is very hungry, using an exaggerated saying.', 'Dot means helping the guests begin talking comfortably.', 'Ember means feeling nervous about the speech.', 'Bramble means Pip revealed the surprise.', 'Dot means the riddle felt easy.', 'The miller means the rain is very heavy.']
CLUES = ['Pip has worked all afternoon and is waiting for supper.', 'The guests are quiet, and Dot asks a friendly question.', 'Ember is worried about forgetting the words.', 'Pip told Ember about the song before it was time.', 'Dot answered the riddle right away.', 'The scene already tells us about loud rain and big puddles.']
ART = {
 'hungry':'Pip waits beside an empty plate, soup and a bun.',
 'horse-plate':'An imagined smiling horse stands safely on an oversized plate.',
 'horse-ride':'Pip stands beside a wooden hobby horse.',
 'ice-bowl':'A wooden spoon cracks a real piece of ice in a lemonade bowl.',
 'greeting':'Dot waves to two quiet guests at the party table.',
 'leaving':'Dot takes a coat toward the café doorway.',
 'butterfly-outline':'Imagined butterflies sit inside a paper drawing of a dragon.',
 'butterfly-garden':'Ember watches butterflies above flowers.',
 'nervous-speech':'Ember holds a speech card tightly beside a waiting podium.',
 'cat-bag':'A cat steps freely out of an open paper bag.',
 'song-news':'Pip shows Ember a musical banner before the surprise song.',
 'mend-bag':'Pip patches an empty torn paper bag.',
 'easy-riddle':'Dot smiles calmly beside a riddle card.',
 'riddle-cake':'An imagined riddle card rests on a slice of cake.',
 'icing-card':'The magpie draws an icing swirl on a paper card.',
 'light-rain':'A few imagined raindrops fall outside a window.',
 'rain-animals':'Imagined cats and dogs drift safely down under tiny umbrellas.',
 'heavy-rain':'Heavy rain and big puddles are outside; the guests are dry indoors.',
 'cake-slice':'A real slice of cake rests on a café plate.'}
LESSONS = ['Words and feelings', 'A saying can make a picture', 'Context matters', 'Compare without erasing your idea']
SORT_ART = ['cake-slice', 'easy-riddle', 'song-news', 'cat-bag', 'ice-bowl', 'greeting']
SORT_TYPES = ['literal', 'figurative', 'figurative', 'literal', 'literal', 'figurative']


def ok(value, message):
    global checks
    checks += 1
    assert value, message


def fixture(kind='waiting'):
    code = '''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {nextRiddle,pickChoice,askClue,showAnswer} from './dist/riddles-core.mjs';
const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;
s.syntheticSibling={raw:'Invented sibling retained exactly'};
nextRiddle(s,()=>0);const c=s.riddles.current;
c.source.prompt='An invented waiting riddle with its own saved wording.';
c.source.clue='An invented saved clue, independent of the current catalogue.';
c.order.reverse();pickChoice(s,c.order.find(x=>x!==c.source.answer));askClue(s);
if(KIND==='revealed')showAnswer(s);
if(KIND==='unreadable')s.riddles.current={earlier:'Invented opaque card',picks:['kept']};
if(KIND==='unsupported')s.riddles={version:99,raw:'Invented opaque root'};
if(KIND==='absent')delete s.riddles;
console.log(JSON.stringify(s));'''.replace('KIND',json.dumps(kind))
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))


def setup(browser, base, kind='waiting', width=820):
    ctx=browser.new_context(viewport={'width':width,'height':1000 if width>320 else 700},has_touch=True,reduced_motion='reduce',accept_downloads=True)
    registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-'+str(i),'avatar':'sky' if i==1 else 'fern','color':'blue','symbol':'leaf','createdAt':'2026-11-07T12:00:00Z'} for i in [1,2]]}
    data={'registry':registry,'seed':fixture(kind)}
    ctx.add_init_script('''(d=>{if(!localStorage.getItem('magpie-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem('number-garden-v1:'+e.id,JSON.stringify(d.seed));localStorage.setItem('magpie-fixture','1');}
window.__magpieSpoken=[];Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{name:'Invented local voice',lang:'en-US',localService:true,default:true,voiceURI:'invented-local'}],cancel(){},speak(u){window.__magpieSpoken.push(u.text);},addEventListener(){},removeEventListener(){}}});window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
})('''+json.dumps(data)+')')
    def observer(route):
        response=route.fetch();body=response.text();marker='let graph=null,'
        assert body.count(marker)==1,'actual app observation marker'
        route.fulfill(response=response,body=body.replace(marker,'window.__magpieObservedState=()=>state;'+marker,1))
    ctx.route('**/app.mjs',observer)
    p=ctx.new_page();pages.append(p);p.set_default_timeout(12000)
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    p.on('response',lambda r:errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None)
    p.goto(base+'#riddles',wait_until='networkidle');ready(p)
    return p


def ready(p):
    active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
    choice='[data-select-explorer="'+active+'"]'
    p.locator('[data-magpie-entry],'+choice).first.wait_for()
    if p.locator(choice).count():p.locator(choice).click();p.evaluate('location.hash="#riddles"')
    p.locator('[data-magpie-entry]').wait_for()


def snapshot(p):
    return p.evaluate('''()=>({memory:JSON.parse(JSON.stringify(window.__magpieObservedState())),storage:Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))})''')


def unchanged(p,before,why):
    after=snapshot(p)
    ok(after==before,why+' preserves actual notebook and all storage values')


def sel(action,value=None):
    return '[data-magpie-action="'+action+'"]'+('' if value is None else '[data-magpie-value="'+str(value)+'"]')


def click(p,action,value=None,before=None):
    p.locator(sel(action,value)).first.click()
    if before is not None:unchanged(p,before,action)


def focus(p,target,message):ok(p.locator(target).evaluate('e=>e===document.activeElement'),message)


def enter(p,before=None):
    ok(p.locator('[data-magpie-entry]').count()==1,'one entry in parent state')
    p.locator('[data-magpie-entry]').click();p.locator('[data-magpie-root]').wait_for()
    focus(p,'#magpie-title','entry focuses child title')
    ok(not p.locator('[data-riddle-root],main drawn-howto').count(),'child replaces parent and omits its tutorial')
    if before is not None:unchanged(p,before,'entry')


def frame(p):
    return p.locator('[data-riddle-root]').evaluate('''e=>{const c=e.cloneNode(true);c.querySelectorAll('h2:not([id])').forEach(h=>h.removeAttribute('tabindex'));return {html:c.innerHTML,folds:[...e.querySelectorAll('details')].map(d=>d.open)}}''')


def dispatch(handle,event='click'):handle.evaluate('(e,t)=>e.dispatchEvent(new Event(t,{bubbles:true,cancelable:true}))',event)


def hear(p,before=None,includes=(),excludes=()):
    n=p.evaluate('__magpieSpoken.length');p.locator('[data-magpie-root] [data-speak]').click()
    spoken=p.evaluate('__magpieSpoken.slice('+str(n)+').join(" ")')
    ok(bool(spoken),'Hear reaches actual app speech binding')
    ok(all(x in spoken for x in includes) and not any(x in spoken for x in excludes),'narration matches current visible scene: '+spoken)
    if before is not None:unchanged(p,before,'Hear')
    return spoken


def geometry(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page clipping')
    issues=p.locator('[data-magpie-root]').evaluate('''root=>{
const bad=[];for(const e of root.querySelectorAll('button,select,a,summary')){if(!e.checkVisibility()||e.disabled||e.closest('.speech-controls'))continue;const r=e.getBoundingClientRect();if(r.width<43.9||r.height<43.9||parseFloat(getComputedStyle(e).fontSize)<15.9)bad.push(e.textContent);}
for(const e of root.querySelectorAll('figcaption,label'))if(e.checkVisibility()&&parseFloat(getComputedStyle(e).fontSize)<15.9)bad.push('small '+e.textContent);
for(const e of root.querySelectorAll('label'))if(!e.control)bad.push('unassociated '+e.textContent);
for(const svg of root.querySelectorAll('svg')){const r=svg.getBoundingClientRect(),parent=svg.parentElement.getBoundingClientRect();if(r.width<=0||r.height<=0||r.left<parent.left-1||r.right>parent.right+1||r.left< -1||r.right>innerWidth+1)bad.push('uncontained art');}
return bad;}''')
    ok(not issues,'44px controls,16px text and contained vignettes: '+str(issues))
    duplicates=p.evaluate('''()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>id.startsWith('magpie-')&&ids.indexOf(id)!==i)}''')
    ok(not duplicates,'magpie IDs do not collide in loaded app')


def art(p):
    items=p.locator('[data-magpie-root] [data-magpie-art]').evaluate_all('''xs=>xs.map(e=>({id:e.dataset.magpieArt,tag:e.tagName,hidden:e.getAttribute('aria-hidden'),label:e.getAttribute('aria-label'),svg:e.matches('svg')?e.outerHTML:e.querySelector('svg')?.outerHTML,caption:e.querySelector('figcaption')?.textContent,button:!!e.closest('button')}))''')
    ok(bool(items),'current page has original art')
    for item in items:
        ok(item['id'] in ART and bool(item['svg']),'finite original vignette '+str(item['id']))
        ok('<text' not in item['svg'] and ' id=' not in item['svg'],'art contains no hidden words or repeated internal IDs')
        if item['button']:ok(item['hidden']=='true' or 'aria-hidden="true"' in item['svg'],'choice thumbnail is decorative')
        else:ok(ART[item['id']] in (item['label'] or '') or ART[item['id']] in item['svg'],'standalone art has honest description '+item['id'])
    return items


def capture(p,name):
    p.screenshot(path=str(OUT/(name+'.png')),full_page=True)
    p.screenshot(path=str(OUT/(name+'-viewport.png')))


def choose(p,kind,index,before=None):
    target={'scene':'#magpie-scene','lesson':'#magpie-lesson-select','sort':'#magpie-sort-select'}[kind]
    p.locator(target).focus();p.locator(target).select_option(str(index));focus(p,target,kind+' selector keeps useful focus')
    if before is not None:unchanged(p,before,kind+' navigation')


def notes(p,label):
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
    with p.expect_download() as download:p.locator('#download').click()
    path=OUT/(label+'.json');download.value.save_as(str(path));return json.loads(path.read_text())


def journey(browser,base):
    print('Magpie Pictures: full tablet journey and exact saved parent return',flush=True)
    p=setup(browser,base);p.locator('main drawn-howto').wait_for(state='attached')
    parent,before=frame(p),snapshot(p)
    old_parent=p.locator('[data-riddle-root]').element_handle();old_show=p.locator('[data-riddle-show]').element_handle()
    enter(p,before)
    old_parent.evaluate('e=>{e.hidden=true;document.querySelector("main").append(e)}');dispatch(old_show);old_parent.evaluate('e=>e.remove()');unchanged(p,before,'old hidden parent')
    for i,title in enumerate(SCENES):
        choose(p,'scene',i,before)
        ok(p.locator('#magpie-scene-title').inner_text()==title,'current authored scene')
        labels=[p.locator(sel('idea',j)).inner_text().strip() for j in range(3)]
        ok(labels==CHOICES[i],'fixed scene choice order')
        text=p.locator('[data-magpie-root]').inner_text()
        ok(MEANINGS[i] not in text and CLUES[i] not in text,'closed prepared reading absent from markup')
        items=art(p);ok(any(a['id']==BIRDS[i] and not a['button'] for a in items),'actual bird picture identity')
        hear(p,before,includes=[title,ART[BIRDS[i]],*CHOICES[i]],excludes=[MEANINGS[i],CLUES[i]])
        # Choose a deliberately unexpected idea and retain it beside the reading.
        own=([0,1,2,1,0,2][i]+1)%3
        stale=p.locator(sel('idea',(own+1)%3)).element_handle()
        click(p,'idea',own,before);focus(p,sel('idea',own),'idea selection retains keyboard focus')
        click(p,'reference',before=before)
        ok(p.locator(sel('idea',own)).get_attribute('aria-pressed')=='true','reading never erases own idea')
        ok(MEANINGS[i] in p.locator('[data-magpie-root]').inner_text() and CLUES[i] in p.locator('[data-magpie-root]').inner_text(),'prepared meaning and named clue visible')
        items=art(p);ok(any(a['id']==REFERENCES[i] and not a['button'] for a in items),'actual prepared picture identity')
        hear(p,before,includes=[MEANINGS[i],CLUES[i],CHOICES[i][own]])
        dispatch(stale);ok(p.locator(sel('idea',own)).get_attribute('aria-pressed')=='true','old detached idea cannot change current choice');unchanged(p,before,'stale idea')
        verdict=p.locator('[data-magpie-root] [class*="correct"],[data-magpie-root] [class*="wrong"],[data-magpie-root] [class*="fits"],[data-magpie-root] [data-outcome]')
        ok(not verdict.count(),'no fit verdict attached to own idea')
        geometry(p)
        capture(p,'tablet-scene-'+str(i))
    choose(p,'scene',0,before);ok(p.locator(sel('idea',1)).get_attribute('aria-pressed')=='true','scene revisiting keeps own idea')
    click(p,'idea','unsure',before);ok(p.locator(sel('idea','unsure')).get_attribute('aria-pressed')=='true','separate uncertainty remains available')
    click(p,'clear-idea',before=before);ok(p.locator(sel('idea')+'[aria-pressed="true"]').count()==0,'clear own idea')
    click(p,'page','learn',before);focus(p,'#magpie-page-title','page navigation focuses page heading')
    for i,title in enumerate(LESSONS):
        choose(p,'lesson',i,before);ok(title in p.locator('#magpie-lesson').inner_text(),'current teaching card')
        hear(p,before,includes=[title],excludes=[t for t in LESSONS if t!=title]);art(p);geometry(p)
    capture(p,'tablet-teaching')
    click(p,'page','sort',before)
    for i,kind in enumerate(SORT_TYPES):
        choose(p,'sort',i,before)
        ok(p.locator('#magpie-sort-title').inner_text()=='Sorting card '+str(i+1)+' of 6','current sorting card')
        own='figurative' if kind=='literal' else 'literal';click(p,'tray',own,before);click(p,'sort-reference',before=before)
        ok(p.locator(sel('tray',own)).get_attribute('aria-pressed')=='true','prepared classification retains unexpected tray')
        items=art(p);ok(any(a['id']==SORT_ART[i] for a in items),'actual sorting picture')
        hear(p,before,includes=[kind]);geometry(p)
        if i==0:capture(p,'tablet-sort-cake')
    capture(p,'tablet-sort');click(p,'clear-tray',before=before)
    click(p,'back',before=before);ok(frame(p)==parent,'Back restores saved source, order, size, picks and clue exactly');focus(p,'[data-magpie-entry]','Back focuses entry')
    enter(p,before);ok(p.locator('#magpie-sort-select').input_value()=='5','same visit keeps child page and card')
    click(p,'page','party',before);choose(p,'scene',5,before);ok(p.locator(sel('idea',0)).get_attribute('aria-pressed')=='true','same visit retains earlier own work')
    report=notes(p,'preserved-riddle-notes');ok(report['riddles']==before['memory']['riddles'],'Notes preserves exact saved riddle record')
    return report


def parent_states(browser,base):
    print('Magpie Pictures: revealed, absent, unsupported and recovery parents',flush=True)
    for kind in ['revealed','absent','unsupported','unreadable']:
        p=setup(browser,base,kind);p.wait_for_timeout(50)
        if kind=='unreadable':p.locator('[data-riddle-recover]').evaluate('e=>e.open=true');p.wait_for_timeout(30)
        parent,before=frame(p),snapshot(p)
        old=p.locator('[data-riddle-confirm-recover]').element_handle() if kind=='unreadable' else None
        enter(p,before);click(p,'idea',2,before);click(p,'reference',before=before);hear(p,before);click(p,'back',before=before)
        ok(frame(p)==parent,kind+' parent restores exact markup and recovery fold')
        if kind=='unreadable':
            dispatch(old);unchanged(p,before,'old recovery confirmation')
            # A restored open disclosure must be armed synchronously: no toggle
            # event is needed before deliberately confirming the new control.
            p.locator('[data-riddle-confirm-recover]').click()
            ok(p.locator('#riddle-prompt').count()==1,'restored open recovery deliberately confirms')
            ok(snapshot(p)['memory']['riddles']['retainedRawCurrent']==[before['memory']['riddles']['current']],'recovery preserves unreadable card')
    p=setup(browser,base,'unreadable');p.locator('[data-riddle-recover]').evaluate('e=>e.open=true');p.wait_for_timeout(30)
    p.locator('[data-riddle-cancel-recover]').click();before=snapshot(p);parent=frame(p)
    enter(p,before);click(p,'back',before=before);ok(frame(p)==parent,'cancelled recovery restores closed')
    dispatch(p.locator('[data-riddle-confirm-recover]').element_handle());unchanged(p,before,'cancelled recovery cannot confirm')
    p.locator('[data-riddle-recover] summary').click();p.wait_for_timeout(30);p.locator('[data-riddle-confirm-recover]').click()
    ok(p.locator('#riddle-prompt').count()==1,'deliberately reopened recovery works')
    p=setup(browser,base,'unreadable');p.locator('[data-riddle-recover]').evaluate('e=>e.open=true');p.wait_for_timeout(30)
    enter(p);p.evaluate('window.__magpieObservedState().riddles.current.earlier="Synthetic changed opaque card"')
    before=snapshot(p);click(p,'back');p.locator('[data-magpie-entry]').wait_for()
    ok(not p.locator('[data-riddle-recover]').evaluate('e=>e.open'),'source change discards stale recovery-open restoration')
    dispatch(p.locator('[data-riddle-confirm-recover]').element_handle());unchanged(p,before,'changed opaque card cannot replay stale confirmation')


def lifecycle(browser,base,report):
    print('Magpie Pictures: stale controls, source, owner, route and import boundaries',flush=True)
    for mode in ['hidden','detached','ancestor','control']:
        p=setup(browser,base);enter(p);before=snapshot(p)
        root=p.locator('[data-magpie-root]');control=p.locator(sel('reference')).element_handle();speaker=p.locator('[data-magpie-root] [data-speak]').element_handle()
        if mode=='hidden':root.evaluate('e=>e.hidden=true')
        elif mode=='detached':root.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)}')
        elif mode=='ancestor':root.evaluate('e=>{const d=document.createElement("div");e.parentNode.append(d);d.append(e)}')
        else:
            for h in [control,speaker]:h.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)}')
        n=p.evaluate('__magpieSpoken.length');dispatch(control);dispatch(speaker)
        ok(p.evaluate('__magpieSpoken.length')==n and MEANINGS[0] not in root.inner_text(),'retired '+mode+' child/Hear inert');unchanged(p,before,mode)
        if mode=='hidden':
            root.evaluate('e=>e.hidden=false');dispatch(control);dispatch(speaker)
            ok(p.evaluate('__magpieSpoken.length')==n and MEANINGS[0] not in root.inner_text(),'unhide never revives old listeners')
    # Parent action and shared Hear are also retired after structural changes.
    for mode in ['hidden','detached','ancestor']:
        p=setup(browser,base);before=snapshot(p);root=p.locator('[data-riddle-root]');control=p.locator('[data-riddle-show]').element_handle();speaker=p.locator('[data-riddle-root] [data-speak]').first.element_handle()
        if mode=='hidden':root.evaluate('e=>e.hidden=true')
        elif mode=='detached':root.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)}')
        else:root.evaluate('e=>{const d=document.createElement("div");e.parentNode.append(d);d.append(e)}')
        n=p.evaluate('__magpieSpoken.length');dispatch(control);dispatch(speaker);unchanged(p,before,'retired '+mode+' parent');ok(p.evaluate('__magpieSpoken.length')==n,'retired parent Hear inert')
    for mode in ['hidden','detached','ancestor']:
        p=setup(browser,base,'unreadable');fold=p.locator('[data-riddle-recover]')
        fold.evaluate('e=>e.open=true');p.wait_for_timeout(30);before=snapshot(p)
        control=p.locator('[data-riddle-confirm-recover]').element_handle()
        if mode=='hidden':fold.evaluate('e=>e.hidden=true')
        elif mode=='detached':fold.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)}')
        else:fold.evaluate('e=>{const d=document.createElement("div");e.parentNode.append(d);d.append(e)}')
        dispatch(control);unchanged(p,before,'retired '+mode+' recovery confirmation')
    p=setup(browser,base);entry=p.locator('[data-magpie-entry]').element_handle();before=snapshot(p)
    entry.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)}');dispatch(entry)
    ok(not p.locator('[data-magpie-root]').count(),'removed/reinserted entry cannot enter');unchanged(p,before,'old entry')
    p.reload(wait_until='networkidle');ready(p);enter(p);click(p,'idea',2)
    for mutation in ['const s=window.__magpieObservedState();s.riddles=structuredClone(s.riddles)', 'window.__magpieObservedState().riddles.current.source.prompt="A synthetic externally changed prompt."']:
        p.evaluate('()=>{'+mutation+'}');before=snapshot(p);click(p,'reference');p.locator('[data-magpie-entry]').wait_for()
        unchanged(p,before,'synthetic raw identity/value invalidation');focus(p,'[data-magpie-entry]','source invalidation focuses entry');enter(p)
        ok(p.locator(sel('idea',2)).get_attribute('aria-pressed')=='true','same owner keeps child work after source change')
        ok(MEANINGS[0] not in p.locator('[data-magpie-root]').inner_text(),'failed action never replays')
    click(p,'back');ok('A synthetic externally changed prompt.' in p.locator('#riddle-prompt').inner_text(),'Back uses current parent source')
    enter(p);old=p.locator('[data-magpie-root] [data-speak]').element_handle();old_back=p.locator(sel('back')).element_handle()
    p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.evaluate('location.hash="#riddles"');ready(p)
    before=snapshot(p);n=p.evaluate('__magpieSpoken.length');dispatch(old);dispatch(old_back);unchanged(p,before,'old owner controls');ok(p.evaluate('__magpieSpoken.length')==n,'old owner Hear inert')
    enter(p);ok(p.locator(sel('idea',2)).get_attribute('aria-pressed')=='false','new owner has fresh work')
    click(p,'idea',1);p.evaluate('location.hash="#riddles/"');p.locator('[data-riddle-root]').wait_for();ok(not p.locator('[data-magpie-entry]').count(),'parent alias omits child entry')
    before=snapshot(p);n=p.evaluate('__magpieSpoken.length')
    p.locator('[data-riddle-root] [data-speak]').first.click()
    ok(p.evaluate('__magpieSpoken.length')>n,'alias retains actual shared Hear speech')
    p.locator('[data-riddle-show]').click();unchanged(p,before,'alias parent writer remains canonical-only')
    p.locator('[data-riddle-root] .page-heading a.back[href="#home"]').click()
    p.wait_for_url('**/#home');ok(p.evaluate('location.hash')=='#home','alias Back link retains ordinary navigation')
    p.evaluate('location.hash="#riddles"');ready(p);enter(p);ok(p.locator(sel('idea',1)).get_attribute('aria-pressed')=='false','exact-route departure clears visit')
    old=p.locator('[data-magpie-root] [data-speak]').element_handle();n=p.evaluate('__magpieSpoken.length');p.evaluate('history.replaceState(null,"","#riddles/")');dispatch(old);ok(p.evaluate('__magpieSpoken.length')==n,'same-tick exact route mismatch cannot speak')
    p.evaluate('location.hash="#notes"');p.locator('#progress-file').wait_for()
    p.locator('#progress-file').set_input_files({'name':'invented-magpie-notebook.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
    p.evaluate('location.hash="#riddles"');ready(p);before=snapshot(p);dispatch(old);unchanged(p,before,'old imported-notebook controls');enter(p)
    ok(p.locator(sel('idea',1)).get_attribute('aria-pressed')=='false','import starts a fresh visit')
    click(p,'idea',1);old=p.locator('[data-magpie-root] [data-speak]').element_handle()
    p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click()
    p.evaluate('location.hash="#riddles"');ready(p);before=snapshot(p);n=p.evaluate('__magpieSpoken.length');dispatch(old)
    unchanged(p,before,'reset retires old notebook controls');ok(p.evaluate('__magpieSpoken.length')==n,'reset retires old Hear')
    enter(p);ok(p.locator(sel('idea',1)).get_attribute('aria-pressed')=='false','actual explorer reset clears visit')


def phone_keyboard(browser,base):
    print('Magpie Pictures: focused phone geometry and keyboard navigation',flush=True)
    p=setup(browser,base,width=320);enter(p);click(p,'idea',1);click(p,'reference');geometry(p);art(p);capture(p,'phone-scene')
    # The action/value is authored data; direction hooks preserve the acting
    # Previous/Next control until a boundary falls back to its selector.
    next_button=p.get_by_role('button',name='Next',exact=True);next_button.focus();p.keyboard.press('Enter')
    ok(p.locator('#magpie-scene').input_value()=='1','keyboard Next changes scene')
    ok(p.evaluate('document.activeElement?.textContent.trim()==="Next"'),'Next retains meaningful focus')
    choose(p,'scene',4);p.get_by_role('button',name='Next',exact=True).focus();p.keyboard.press('Enter')
    ok(p.locator('#magpie-scene').input_value()=='5','keyboard reaches last scene')
    ok(p.evaluate('document.activeElement.matches("#magpie-scene,#magpie-scene-title")'),'boundary focus falls back to current selector or heading')
    p.locator(sel('page','learn')).focus();p.keyboard.press('Enter');focus(p,'#magpie-page-title','keyboard page action focuses heading');choose(p,'lesson',2);geometry(p);capture(p,'phone-teaching')
    click(p,'page','sort');choose(p,'sort',3);click(p,'tray','figurative');click(p,'sort-reference');geometry(p);capture(p,'phone-sort')


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
                report=journey(browser,base);parent_states(browser,base);lifecycle(browser,base,report);phone_keyboard(browser,base)
                ok(not errors,'no page, console or HTTP errors: '+str(errors));print(json.dumps({'status':'passed','checks':checks,'artifacts':str(OUT)}),flush=True)
            except Exception:
                (OUT/'failure.txt').write_text(traceback.format_exc())
                for i,p in enumerate(pages):
                    if not p.is_closed():p.screenshot(path=str(OUT/('failure-'+str(i)+'.png')),full_page=True)
                raise
            finally:browser.close()
    finally:server.shutdown();server.server_close()


if __name__=='__main__':main()
