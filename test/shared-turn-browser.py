"""Shared Turn412 actual-app Chromium journeys with invented notebooks only.

Observe the real app notebook at its initialization marker. Speech captures text
locally; the suite does not qualify physical tablets, audible speech or learning.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, json, math, os, re, subprocess, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('SHARED_TURN_ARTIFACTS', '/private/tmp/lg412-native'))
OUT.mkdir(parents=True, exist_ok=True)
ROUTE = '#workshop/hinge'
JOBS = [(180,30,150),(180,90,90),(180,120,60),(180,150,30),(360,45,315),(360,120,240),(360,225,135),(360,300,60)]
LESSONS = ['One whole, two parts.', 'All the way around.', 'Cover a label.', 'Check the gap.']
checks, errors, pages = 0, [], []


def ok(value, message):
    global checks
    checks += 1
    assert value, message


def fixture():
    js = "import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.hingeBench={version:77,opaque:'Invented future material'};s.syntheticSibling={raw:[null,false,17,'Invented retained sibling']};console.log(JSON.stringify(s));"
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))


def setup(browser, base, width=820):
    ctx=browser.new_context(viewport={'width':width,'height':1000 if width>320 else 800},has_touch=True,reduced_motion='reduce',accept_downloads=True)
    registry={'version':1,'activeId':'explorer-1','explorers':[{'id':'explorer-'+str(i),'avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-07T12:00:00Z'} for i in [1,2]]}
    ctx.add_init_script('''(d=>{if(!localStorage.getItem('shared-turn-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem('number-garden-v1:'+e.id,JSON.stringify(d.seed));localStorage.setItem('shared-turn-fixture','1');}window.__sharedSpoken=[];Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{name:'Invented local voice',lang:'en-US',localService:true,default:true,voiceURI:'invented-local'}],cancel(){},speak(u){window.__sharedSpoken.push(u.text)},addEventListener(){},removeEventListener(){}}});window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};})('''+json.dumps({'registry':registry,'seed':fixture()})+')')
    def observe(route):
        response=route.fetch();body=response.text();marker='let graph=null,'
        assert body.count(marker)==1,'actual app notebook observation marker'
        route.fulfill(response=response,body=body.replace(marker,'window.__sharedObservedState=()=>state;'+marker,1))
    ctx.route('**/app.mjs',observe)
    p=ctx.new_page();pages.append(p);p.set_default_timeout(12000)
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    p.on('response',lambda r:errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None)
    p.goto(base+ROUTE,wait_until='networkidle');ready(p)
    return p


def ready(p):
    active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
    selector='[data-select-explorer="'+active+'"]'
    p.locator('[data-shared-turn-entry],'+selector).first.wait_for()
    if p.locator(selector).count():p.locator(selector).click();p.evaluate('location.hash='+json.dumps(ROUTE))
    p.locator('[data-shared-turn-entry]').wait_for()


def snapshot(p):
    return p.evaluate('''()=>({memory:JSON.parse(JSON.stringify(__sharedObservedState())),local:Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])),session:Object.fromEntries(Object.keys(sessionStorage).sort().map(k=>[k,sessionStorage.getItem(k)]))})''')


def unchanged(p,before,why):ok(snapshot(p)==before,why+' preserves actual memory and all stored values')
def sel(action,value=None):return '[data-shared-turn-action="'+action+'"]'+('' if value is None else '[data-shared-turn-value="'+str(value)+'"]')
def click(p,action,value=None):p.locator(sel(action,value)).first.click()
def parent_click(p,action):p.locator('[data-hinge-action="'+action+'"]').click()
def tool(p,value):p.locator('[data-hinge-tool="'+value+'"]').click()
def focus(p,selector,why):ok(p.locator(selector).evaluate('e=>e===document.activeElement'),why)
def dispatch(handle,event='click'):handle.evaluate('(e,t)=>e.dispatchEvent(new Event(t,{bubbles:true,cancelable:true}))',event)


def enter(p):
    ok(p.locator('[data-shared-turn-entry]').count()==1,'one child entry outside details')
    ok(not p.locator('[data-shared-turn-entry]').evaluate('e=>!!e.closest("details")'),'entry outside parent disclosures')
    p.locator('[data-shared-turn-entry]').click();p.locator('[data-shared-turn-root]').wait_for()
    focus(p,'#shared-turn-title','entry focuses child title')
    ok(not p.locator('[data-hinge-root],main drawn-howto').count(),'child replaces parent without generic tutorial')


def parent_frame(p):
    return p.locator('[data-hinge-root]').evaluate('''e=>({case:e.querySelector('[data-hinge-case]').value,view:e.dataset.hingeView,figures:[...e.querySelectorAll('[data-hinge-figure]')].map(x=>x.outerHTML),tool:e.querySelector('[data-hinge-tool][aria-pressed=true]')?.dataset.hingeTool,card:e.querySelector('[data-hinge-action=card]')?.getAttribute('aria-pressed'),comparison:e.querySelector('.hinge-comparison')?.textContent,example:e.querySelector('.hinge-example-label')?.textContent,folds:[...e.querySelectorAll('details.hinge-about')].map(d=>d.open)})''')


def speech_bounds(p):
    issues=p.locator('[data-shared-turn-root]').evaluate('''root=>{const panel=root.querySelector('.speech-controls.speech-playing'),bad=[];if(!panel)return ['no playing panel'];const r=panel.getBoundingClientRect(),q=root.getBoundingClientRect();if(r.left<Math.max(0,q.left)-1||r.right>Math.min(innerWidth,q.right)+1)bad.push('panel outside viewport or child root');const summary=panel.querySelector('.voice-settings>summary'),s=summary?.getBoundingClientRect();if(!s||s.width<43.9||s.height<43.9)bad.push('Voice & speed target smaller than44px');for(const svg of root.querySelectorAll('svg')){const a=svg.getBoundingClientRect();if(r.left<a.right&&r.right>a.left&&r.top<a.bottom&&r.bottom>a.top)bad.push('panel overlaps diagram')}return bad}''')
    ok(not issues,'playing speech panel stays inside viewport/root, clear of diagram, with44px Voice & speed: '+str(issues))


def hear(p,includes=(),excludes=()):
    n=p.evaluate('__sharedSpoken.length');p.locator('[data-shared-turn-root] [data-speak]').click()
    text=p.evaluate('__sharedSpoken.slice('+str(n)+').join(" ")')
    ok(bool(text),'Hear reaches actual shared speech service');speech_bounds(p)
    ok(all(x in text for x in includes) and not any(x in text for x in excludes),'current narration: '+text)
    return text


def choose(p,kind,value):
    target={'first':'#shared-turn-first','job':'#shared-turn-job','lesson':'#shared-turn-lesson-select'}[kind]
    p.locator(target).focus();p.locator(target).select_option(str(value));focus(p,target,kind+' selector keeps focus')


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal clipping')
    bad=p.locator('[data-shared-turn-root]').evaluate('''root=>{const bad=[];for(const e of root.querySelectorAll('button,select,input,a,summary')){if(!e.checkVisibility()||e.disabled||e.closest('.speech-controls'))continue;const r=e.getBoundingClientRect();if(r.width<43.9||r.height<43.9||parseFloat(getComputedStyle(e).fontSize)<15.9)bad.push(e.outerHTML)}for(const e of root.querySelectorAll('label,figcaption')){if(e.checkVisibility()&&parseFloat(getComputedStyle(e).fontSize)<15.9)bad.push('small text');if(e.matches('label')&&!e.control)bad.push('unassociated label')}for(const s of root.querySelectorAll('svg')){const r=s.getBoundingClientRect(),q=s.parentElement.getBoundingClientRect();if(r.width<=0||r.left<q.left-1||r.right>q.right+1||r.left< -1||r.right>innerWidth+1)bad.push('uncontained SVG')}return bad}''')
    ok(not bad,'44px targets,16px text, associated labels, contained SVG: '+str(bad))
    ids=p.locator('[data-shared-turn-root] [id]').evaluate_all('xs=>xs.map(x=>x.id)')
    ok(len(ids)==len(set(ids)),'no duplicate child IDs')


def point(angle,radius):return [160+radius*math.cos(math.radians(angle)),160-radius*math.sin(math.radians(angle))]
def near(a,b,why):ok(abs(a-b)<.00003,why+': '+str(a)+' vs '+str(b))


def diagram(p,whole,first,tilt=0,gap=False):
    svg=p.locator('[data-shared-turn-root] svg').first
    ok(svg.get_attribute('viewBox')=='0 0 320 320','finite drawing viewBox')
    ok(not svg.locator('text,[id]').count(),'SVG has no scaled text or repeated internal IDs')
    # The ray/arc hooks name roles only, never a covered numerical measure.
    for role,angle,length,width in [('start',tilt,115,10),('end',tilt+whole,100,6),('divider',tilt+first,135,2)]:
        ray=svg.locator('[data-shared-turn-ray="'+role+'"]')
        line=ray.locator('line').first
        for key,expected in zip(['x1','y1','x2','y2'],[160,160,*point(angle,length)]):near(float(line.get_attribute(key)),expected,'actual '+role+' '+key)
        near(float(line.get_attribute('stroke-width')),width,'ray line width')
        tail=ray.locator('line').nth(1)
        for key,expected in zip(['x1','y1','x2','y2'],[*point(angle,length),*point(angle,152)]):near(float(tail.get_attribute(key)),expected,'actual '+role+' continuation '+key)
        triangle=[[float(v) for v in pair.split(',')] for pair in ray.locator('polygon').get_attribute('points').split()]
        for actual,expected in zip(triangle[0],point(angle,155)):near(actual,expected,role+' arrow tip')
        midpoint=[(triangle[1][j]+triangle[2][j])/2 for j in [0,1]]
        for actual,expected in zip(midpoint,point(angle,146)):near(actual,expected,role+' arrow base')
        near(math.dist(triangle[1],triangle[2]),{'start':14,'end':10,'divider':6}[role],role+' arrow base width')
    intervals=[('first',tilt,first,70),('second',tilt+(120 if gap else first),60 if gap else whole-first,100),('whole',tilt,whole,145)]
    if gap:intervals.append(('gap',tilt+60,60,120))
    for role,start,amount,radius in intervals:
        arc=svg.locator('[data-shared-turn-arc="'+role+'"] path')
        if amount==0:
            ok(arc.count()==0 or not re.search(r'\bA',arc.get_attribute('d') or ''),'zero '+role+' has no full sweep');continue
        ok(arc.count()==1,'one '+role+' sweep')
        d=arc.get_attribute('d');numbers=[float(x) for x in re.findall(r'-?\d+(?:\.\d+)?(?:e[-+]?\d+)?',d,re.I)]
        expected_segments=math.ceil(amount/180)
        ok(d.count('A')==expected_segments,'positive segments at most180 for '+role)
        near(numbers[0],point(start,radius)[0],role+' actual arc start x');near(numbers[1],point(start,radius)[1],role+' actual arc start y')
        cursor=2;done=0
        for _ in range(expected_segments):
            rx,ry,rotation,large,sweep,x,y=numbers[cursor:cursor+7];cursor+=7;done+=min(180,amount-done)
            near(rx,radius,role+' radius');near(ry,radius,role+' radius y');ok(large==0 and sweep==0,role+' actual CCW nonreflex segment flags')
            near(x,point(start+done,radius)[0],role+' segment endpoint x');near(y,point(start+done,radius)[1],role+' segment endpoint y')
    if gap:
        ok(svg.locator('[data-shared-turn-arc="gap"] path').evaluate('e=>getComputedStyle(e).strokeDasharray').replace(',', '')=='3px 5px','gap distinct dotted sweep')
        ok('60° + 60° + gap 60° = 180°' in p.locator('[data-shared-turn-root]').inner_text(),'gap counted explicitly')


def capture(p,name):
    p.screenshot(path=str(OUT/(name+'.png')),full_page=True)
    p.screenshot(path=str(OUT/(name+'-viewport.png')))


def closed_reference(p):
    ok(p.locator('[data-shared-turn-reference]').count()==0,'closed reference absent from DOM')
    ok(p.get_by_text('?° · covered label',exact=True).count()==1,'covered B label exact')
    ok('second part covered' in p.locator('[data-shared-turn-root] svg').get_attribute('aria-label'),'accessible diagram describes covered B without its measure')
    ok('The other part is' not in p.locator('[data-shared-turn-root]').text_content(),'no closed reference prose anywhere in child markup')
    # Explicit role-bearing labels/metadata are checked structurally. The given
    # measure, whole, and independently entered own number are allowed to coincide.
    metadata=p.locator('[data-shared-turn-root]').evaluate('''root=>[...root.querySelectorAll('*')].flatMap(e=>[...e.attributes].filter(a=>/^(data-|aria-|title$|id$|class$)/.test(a.name)&&/(?:reference|second|missing|answer)/i.test(a.name+' '+a.value)).map(a=>[a.name,a.value]))''')
    ok(not any(re.search(r'\d',v) for k,v in metadata if k not in ['data-speak','aria-label']),'closed answer roles carry no numerical metadata: '+str(metadata))


def notes(p,label):
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
    with p.expect_download() as event:p.locator('#download').click()
    path=OUT/(label+'.json');event.value.save_as(str(path));return json.loads(path.read_text())


def journey(browser,base):
    print('Shared Turn: full tablet journey, finite drawings and exact parent return',flush=True)
    p=setup(browser,base)
    notes_before=notes(p,'notes-before');p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    p.locator('[data-hinge-case]').select_option('near-right');parent_click(p,'more');tool(p,'arms');parent_click(p,'gold-less');parent_click(p,'blue-more');tool(p,'picture');parent_click(p,'turn');parent_click(p,'card');parent_click(p,'compare')
    p.locator('.hinge-about:not(.hinge-grownups) summary').click();p.locator('.hinge-grownups summary').click()
    parent,before=parent_frame(p),snapshot(p)
    old_parent=p.locator('[data-hinge-action="turn"]').element_handle();old_hear=p.locator('[data-hinge-root] [data-speak]').element_handle();old_entry=p.locator('[data-shared-turn-entry]').element_handle()
    enter(p);unchanged(p,before,'entry');dispatch(old_parent);dispatch(old_hear);dispatch(old_entry)
    ok(p.locator('[data-shared-turn-root]').count()==1,'old parent cannot revive behind child')
    choose(p,'first',75);click(p,'whole',360);click(p,'turn');diagram(p,360,75,90)
    # All38 authored Build settings in actual DOM; rotate representative boundary,
    # reflex and full settings. The independent core suite covers all152 poses.
    tilt=90
    for whole in [360,180]:
        if whole==180:choose(p,'first',60);click(p,'whole',180)
        for first in range(0,whole+1,15):
            choose(p,'first',first);diagram(p,whole,first,tilt)
            ok(str(first)+'° + '+str(whole-first)+'° = '+str(whole)+'°' in p.locator('[data-shared-turn-root]').inner_text(),'Build actual equation')
            if first in [0,whole,270]:bounds(p);capture(p,'tablet-build-'+str(whole)+'-'+str(first))
    click(p,'whole',360);choose(p,'first',225)
    ok(p.locator(sel('whole',180)).is_disabled(),'oversize first cannot silently clamp to half')
    ok('Your first part is larger than 180°.' in p.locator('[data-shared-turn-root]').inner_text(),'whole constraint explained')
    for _ in range(3):click(p,'turn');tilt=(tilt+90)%360;diagram(p,360,225,tilt)
    click(p,'page','cover');focus(p,'#shared-turn-page-title','page focuses heading')
    field=p.locator('#shared-turn-idea')
    ok(field.input_value()=='' and field.get_attribute('type')=='text' and field.get_attribute('inputmode')=='numeric' and field.get_attribute('maxlength')=='32','initial blank bounded native text draft')
    for i,(whole,given,ref) in enumerate(JOBS):
        choose(p,'job',i);closed_reference(p);diagram(p,whole,given,tilt)
        p.locator('#shared-turn-idea').fill('17');hear(p,includes=['17','draft']);click(p,'keep')
        ok('Your idea: 17°.' in p.locator('[data-shared-turn-root]').inner_text(),'unexpected own number kept neutrally')
        hear(p,includes=['17'],excludes=['not kept yet','unkept'])
        click(p,'reading');ok('The other part is '+str(ref)+'°.' in p.locator('[data-shared-turn-root]').inner_text(),'explicit fixed reference '+str(i+1))
        ok(p.locator('#shared-turn-idea').input_value()=='17','reference retains raw draft');diagram(p,whole,given,tilt);bounds(p)
        if i in [4,7]:capture(p,'tablet-job-'+str(i+1))
        click(p,'reading');closed_reference(p)
    choose(p,'job',0);p.locator('#shared-turn-idea').fill('060');click(p,'keep');ok('Your idea: 60°.' in p.locator('[data-shared-turn-root]').inner_text(),'leading zeros parsed as elected60')
    for raw in ['60.0','1e2','-0','','361']:
        p.locator('#shared-turn-idea').fill(raw);click(p,'keep')
        ok(p.locator('#shared-turn-idea').input_value()==raw and 'Your idea: 60°.' in p.locator('[data-shared-turn-root]').inner_text(),'invalid '+repr(raw)+' preserves draft and prior idea')
        ok('Use digits for a whole number from 0 to 360.' in p.locator('#shared-turn-status').inner_text(),'invalid status in place');focus(p,'#shared-turn-idea','invalid Keep focuses draft')
    p.locator('#shared-turn-idea').fill('0');click(p,'keep');ok('Your idea: 0°.' in p.locator('[data-shared-turn-root]').inner_text(),'zero separately kept')
    p.locator('#shared-turn-idea').fill('unkept text');hear(p,includes=['not a whole-number idea yet'])
    click(p,'turn');tilt=(tilt+90)%360;click(p,'reading');choose(p,'job',1);choose(p,'job',0);click(p,'page','build');click(p,'page','cover')
    ok(p.locator('#shared-turn-idea').input_value()=='unkept text' and 'Your idea: 0°.' in p.locator('[data-shared-turn-root]').inner_text(),'raw unkept draft survives all local redraws')
    click(p,'page','learn')
    for i,title in enumerate(LESSONS):
        choose(p,'lesson',i);ok(title in p.locator('#shared-turn-lesson-title').inner_text(),'authored teaching card')
        whole,first=[(180,60),(360,90),(180,135),(180,60)][i];diagram(p,whole,first,tilt,gap=i==3)
        hear(p,includes=['Worked example']);bounds(p);capture(p,'tablet-lesson-'+str(i+1))
    unchanged(p,before,'complete child mathematics')
    click(p,'back');ok(parent_frame(p)==parent,'Back restores exact case, turn, arms, tool, card, comparison and both folds');focus(p,'[data-shared-turn-entry]','Back focuses entry')
    p.wait_for_timeout(80);ok(p.locator('.hinge-status').inner_text()=='','old delayed parent announcement never resumes')
    enter(p);click(p,'page','cover');ok(p.locator('#shared-turn-idea').input_value()=='unkept text','Back/re-entry retains raw draft')
    click(p,'clear-idea');ok(p.locator('#shared-turn-idea').input_value()=='' and 'No idea kept yet.' in p.locator('[data-shared-turn-root]').inner_text(),'clear removes raw draft and own idea')
    click(p,'back');parent_click(p,'example');parent_click(p,'next');parent_click(p,'next');p.locator('.hinge-about:not(.hinge-grownups) summary').click();p.locator('.hinge-grownups summary').click();example=parent_frame(p)
    enter(p);click(p,'turn');click(p,'back');ok(parent_frame(p)==example,'worked-example/frame and open folds restore exactly')
    unchanged(p,before,'parent returns');report=notes(p,'notes-after');comparison=dict(report);comparison.pop('exportedAt',None);notes_before.pop('exportedAt',None);ok(comparison==notes_before,'actual Notes download unchanged by mathematical visit')
    return report


def retire(handle,mode):
    scripts={'hidden':'e.hidden=true;e.hidden=false','detached':'const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)','reparented':'const d=document.createElement("div");e.parentNode.append(d);d.append(e)','outside':'document.body.append(e)','ancestor':'const p=e.parentNode;p.style.visibility="hidden";p.style.visibility=""'}
    handle.evaluate('e=>{'+scripts[mode]+'}')


def lifecycle(browser,base,report):
    print('Shared Turn: retired controls, ownership, chooser, route and notebook lifetime',flush=True)
    for parent in [False,True]:
        for mode in ['hidden','detached','reparented','outside','ancestor']:
            p=setup(browser,base)
            if parent:
                action=p.locator('[data-hinge-action="more"]').element_handle();speaker=p.locator('[data-hinge-root] [data-speak]').element_handle();entry=p.locator('[data-shared-turn-entry]').element_handle()
                old=parent_frame(p)
                for h in [action,speaker,entry]:retire(h,mode)
                n=p.evaluate('__sharedSpoken.length');dispatch(action);dispatch(speaker);dispatch(entry)
                ok(not p.locator('[data-shared-turn-root]').count() and parent_frame(p)['figures']==old['figures'],'retired '+mode+' parent/action/entry inert')
            else:
                enter(p);click(p,'page','cover');p.locator('#shared-turn-idea').fill('17');click(p,'keep')
                action=p.locator(sel('reading')).element_handle();speaker=p.locator('[data-shared-turn-root] [data-speak]').element_handle();field=p.locator('#shared-turn-idea').element_handle();keep=p.locator(sel('keep')).element_handle()
                for h in [action,speaker,field]:retire(h,mode)
                n=p.evaluate('__sharedSpoken.length');field.evaluate('e=>e.value="33"');dispatch(field,'input');dispatch(keep);dispatch(action);dispatch(speaker)
                ok(not p.locator('[data-shared-turn-reference]').count(),'retired '+mode+' child control cannot reveal')
                ok('Your idea: 17°.' in p.locator('[data-shared-turn-root]').inner_text(),'Keep rejects retired associated field '+mode)
            ok(p.evaluate('__sharedSpoken.length')==n,'retired '+mode+' Hear cannot speak')
    p=setup(browser,base);enter(p);click(p,'page','cover');p.locator('#shared-turn-idea').fill('27');click(p,'keep');old=p.locator(sel('reading')).element_handle();speaker=p.locator('[data-shared-turn-root] [data-speak]').element_handle()
    # A mismatched exact route must reject even before hashchange dispatch.
    n=p.evaluate('__sharedSpoken.length');p.evaluate('history.replaceState(null,"","#workshop/hinge/")');dispatch(old);dispatch(speaker)
    ok(p.evaluate('__sharedSpoken.length')==n and not p.locator('[data-shared-turn-reference]').count(),'same-tick exact-route guard')
    p.evaluate('location.hash="#workshop"');p.locator('main').wait_for();p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);enter(p)
    ok(p.locator('#shared-turn-first').input_value()=='60','leaving room clears child work')
    click(p,'page','cover');p.locator('#shared-turn-idea').fill('27');click(p,'keep');p.locator('#explorer-switch').click();p.locator('#explorer-cancel').click();ready(p);enter(p)
    ok(p.locator('#shared-turn-first').input_value()=='60','opening/cancelling chooser clears visit')
    click(p,'page','cover');p.locator('#shared-turn-idea').fill('27');click(p,'keep');old=p.locator(sel('reading')).element_handle();speaker=p.locator('[data-shared-turn-root] [data-speak]').element_handle()
    p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    before=snapshot(p);n=p.evaluate('__sharedSpoken.length');dispatch(old);dispatch(speaker);unchanged(p,before,'retired owner');ok(p.evaluate('__sharedSpoken.length')==n,'old owner Hear inert');enter(p);click(p,'page','cover')
    ok(p.locator('#shared-turn-idea').input_value()=='','owner change starts blank work')
    p.locator('#shared-turn-idea').fill('27');click(p,'keep');old=p.locator(sel('reading')).element_handle()
    p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-shared-turn-notebook.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);dispatch(old);enter(p);click(p,'page','cover');ok(p.locator('#shared-turn-idea').input_value()=='','notebook import clears child visit')
    p.locator('#shared-turn-idea').fill('27');click(p,'keep');old=p.locator('[data-shared-turn-root] [data-speak]').element_handle()
    p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click()
    film=p.locator('dialog.welcome-film[open]')
    if film.count():film.locator('[data-film-skip]').click()
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);n=p.evaluate('__sharedSpoken.length');dispatch(old);ok(p.evaluate('__sharedSpoken.length')==n,'reset retires old Hear');enter(p);click(p,'page','cover');ok(p.locator('#shared-turn-idea').input_value()=='','notebook reset clears work')


def voice_preferences(browser,base):
    print('Shared Turn: separately elected existing voice preference write',flush=True)
    p=setup(browser,base);enter(p);hear(p);before=snapshot(p)
    p.locator('.voice-settings summary').first.click();p.locator('[data-reading-speed]').select_option('0.8')
    after=snapshot(p)
    ok(after['memory']['garden']['speech']!=before['memory']['garden'].get('speech'),'deliberate voice choice reaches existing preference service')
    for s in [before,after]:
        s['memory']['garden'].pop('speech',None)
        for key,value in list(s['local'].items()):
            if key.startswith('number-garden-v1:'):
                value=json.loads(value);value.get('garden',{}).pop('speech',None);s['local'][key]=json.dumps(value,sort_keys=True)
    ok(after==before,'voice preference changes only existing garden.speech save')
    ok(p.locator('.speech-controls').evaluate('e=>getComputedStyle(e).position')!='fixed','shared speech panel stays in normal flow')


def phone_keyboard(browser,base):
    print('Shared Turn: focused phone keyboard, full/reflex/gap geometry',flush=True)
    p=setup(browser,base,width=320);enter(p)
    p.locator(sel('whole',360)).focus();p.keyboard.press('Enter');focus(p,sel('whole',360),'whole choice retains acting button')
    choose(p,'first',270);diagram(p,360,270);bounds(p);capture(p,'phone-reflex')
    choose(p,'first',360);diagram(p,360,360);capture(p,'phone-full')
    p.locator(sel('page','cover')).focus();p.keyboard.press('Enter');focus(p,'#shared-turn-page-title','keyboard page heading focus')
    next_button=p.locator('[data-shared-turn-direction="next"]');next_button.focus();p.keyboard.press('Enter');ok(p.locator('#shared-turn-job').input_value()=='1','keyboard Next changes job');focus(p,'[data-shared-turn-direction="next"]','Next stable directional focus')
    choose(p,'job',6);p.locator('[data-shared-turn-direction="next"]').focus();p.keyboard.press('Enter');focus(p,'#shared-turn-job','last job falls back to selector')
    p.locator('#shared-turn-idea').fill('19');p.locator(sel('keep')).focus();p.keyboard.press('Enter');click(p,'reading');diagram(p,360,300);bounds(p);capture(p,'phone-reference')
    click(p,'page','learn');choose(p,'lesson',3);diagram(p,180,60,gap=True);bounds(p);capture(p,'phone-gap')


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
                if '--speech-layout-only' in sys.argv:
                    for width in [820,320]:
                        p=setup(browser,base,width=width);enter(p);hear(p);bounds(p);capture(p,'speech-layout-'+str(width))
                        p.locator('.voice-settings>summary').click();speech_bounds(p);capture(p,'speech-layout-expanded-'+str(width))
                else:
                    report=journey(browser,base);lifecycle(browser,base,report);voice_preferences(browser,base);phone_keyboard(browser,base)
                ok(not errors,'no page, console or HTTP errors: '+str(errors))
                result={'status':'passed','checks':checks,'artifacts':str(OUT)};(OUT/('speech-layout-receipt.json' if '--speech-layout-only' in sys.argv else 'receipt.json')).write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
            except Exception:
                (OUT/'failure.txt').write_text(traceback.format_exc())
                for i,p in enumerate(pages):
                    if not p.is_closed():p.screenshot(path=str(OUT/('failure-'+str(i)+'.png')),full_page=True)
                raise
            finally:browser.close()
    finally:server.shutdown();server.server_close()


if __name__=='__main__':main()
