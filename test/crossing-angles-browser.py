"""Crossing Angles415/416/417 in the actual application, with invented notebooks only.

One complete tablet visit and focused phone/label/lifetime probes. The sole app
instrumentation exposes a read-only getter at its real initialization marker.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, importlib.util, json, os, re, tempfile, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('CROSSING_ANGLES_ARTIFACTS') or tempfile.mkdtemp(prefix='lg417-native-'))
OUT.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location('crossing_actual_helpers', ROOT/'test/shared-turn-browser.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
h.OUT = OUT
h.ROUTE = ROUTE = '#workshop/copy-frame'
R = '[data-crossing-angles-root]'
P = '[data-cframe-root]'
E = '[data-crossing-angles-entry]'


def ready(p):
    active = p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
    choice = '[data-select-explorer="'+active+'"]'
    p.locator(E+','+choice).first.wait_for()
    if p.locator(choice).count():
        p.locator(choice).click()
        p.evaluate('location.hash='+json.dumps(ROUTE))
    p.locator(E).wait_for()
h.ready = ready


def setup(browser, base, width=820):
    return h.setup(browser, base, width)


def sel(action, value=None):
    return '[data-crossing-angles-action="'+action+'"]'+('' if value is None else '[data-crossing-angles-value="'+str(value)+'"]')


def act(p, action, value=None, before=None):
    spoken=p.evaluate('__sharedSpoken.length')
    selects = ['angle','prompt','card','two-spacing','two-lean','two-prompt','tri-a','tri-b','tri-size','tri-prompt']
    target = p.locator(('select' if action in selects else '')+sel(action, None if action in selects or action=='rotation' else value))
    if action in selects:
        target.select_option(str(value))
    else:
        target.first.click()
    h.ok(p.evaluate('__sharedSpoken.length')==spoken,'local action has no automatic speech')
    if before is not None:
        h.unchanged(p, before, action+' '+str(value))


def parent(p, action):
    p.locator('[data-cframe-action="'+action+'"]').click()


def enter(p, before=None):
    h.ok(p.locator(E).count()==1 and not p.locator(E).evaluate('e=>!!e.closest("details")'), 'one visible entry outside disclosures')
    p.locator(E).click()
    p.locator(R).wait_for()
    h.focus(p, '#crossing-angles-title', 'entry focuses title')
    h.ok(p.locator(P).count()==0, 'child replaces exact parent root')
    if before is not None:
        h.unchanged(p, before, 'entry')


def frame(p):
    return p.locator(P).evaluate('''e=>({case:e.querySelector('[data-cframe-case]').value,view:e.dataset.cframeView,figures:[...e.querySelectorAll('figure')].map(x=>x.outerHTML),refs:[...e.querySelectorAll('.cframe-refs,.cframe-comparison')].map(x=>x.outerHTML),buttons:[...e.querySelectorAll('[data-cframe-action]')].map(b=>[b.dataset.cframeAction,b.disabled,b.textContent]),folds:[...e.querySelectorAll('details')].map(d=>d.open)})''')


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator(R).evaluate('''root=>{const bad=[];for(const e of root.querySelectorAll('button,select,summary,a')){if(!e.checkVisibility())continue;const b=e.getBoundingClientRect();if(b.width<43.9||b.height<43.9||parseFloat(getComputedStyle(e).fontSize)<15.9)bad.push(e.outerHTML)}for(const e of root.querySelectorAll('p,label,figcaption,[data-crossing-angles-label]'))if(e.checkVisibility()&&parseFloat(getComputedStyle(e).fontSize)<15.9)bad.push('small '+e.outerHTML);for(const e of root.querySelectorAll('svg'))if(e.querySelector('text,animate,animateTransform'))bad.push('scaled SVG text or animation');return bad}''')
    h.ok(not bad, '44px controls and16px HTML labels/text: '+str(bad))
    for stage in p.locator('[data-crossing-angles-stage]').all():
        issues = stage.evaluate('''stage=>{const s=stage.getBoundingClientRect(),labels=[...stage.querySelectorAll('[data-crossing-angles-label]')].filter(e=>e.checkVisibility()),bad=[];for(let i=0;i<labels.length;i++){const a=labels[i].getBoundingClientRect();if(a.left<s.left-.6||a.right>s.right+.6||a.top<s.top-.6||a.bottom>s.bottom+.6)bad.push('outside '+labels[i].textContent);for(let j=0;j<i;j++){const b=labels[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5)bad.push('overlap '+labels[i].textContent+'/'+labels[j].textContent)}for(const c of document.querySelectorAll('[data-crossing-angles-root] button,[data-crossing-angles-root] select')){const b=c.getBoundingClientRect();if(c.checkVisibility()&&Math.min(a.right,b.right)>Math.max(a.left,b.left)&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top))bad.push('label/control overlap')}}return bad}''')
        h.ok(not issues, 'actual HTML label boxes inside stage and nonoverlapping: '+str(issues))
    voice = p.locator(R+' .speech-controls:visible')
    if voice.count():
        h.ok(voice.evaluate('''e=>{const b=e.getBoundingClientRect();return getComputedStyle(e).position!=='fixed'&&b.left>=-1&&b.right<=innerWidth+1&&[...document.querySelectorAll('[data-crossing-angles-stage]')].every(s=>{const a=s.getBoundingClientRect();return !(b.left<a.right&&b.right>a.left&&b.top<a.bottom&&b.bottom>a.top)})}'''), 'shared voice controls in flow and clear of diagrams')


def hear(p, before, includes=(), excludes=()):
    button = p.locator(R+' [data-speak]').first
    raw = button.get_attribute('data-speak')
    n = p.evaluate('__sharedSpoken.length')
    button.click()
    spoken = p.evaluate('__sharedSpoken.slice('+str(n)+')')
    h.ok(len(spoken)==1, 'one real shared Hear request')
    text = spoken[0]
    expected=raw.replace('×',' times ').replace('−',' minus ').replace('=',' equals ')
    h.ok(text==re.sub(' +',' ',expected).strip(),'shared Hear reads exactly its current declared narration')
    h.ok(all(s in text for s in includes) and not any(s in text for s in excludes), 'Hear current visible explanation only: '+text)
    h.ok('Exploration here is not assessed' not in text, 'Hear excludes grown-up note')
    h.unchanged(p, before, 'Hear')
    bounds(p)
    return text


def capture(p, name):
    p.screenshot(path=str(OUT/(name+'.png')), full_page=True)


def shape(p):
    svg = p.locator(R+' svg[viewBox="0 0 640 560"]').first
    h.ok(svg.count()==1 and svg.get_attribute('role')=='img', 'current crossing is an accessible geometric diagram')
    h.ok(not svg.locator('text').count(), 'all visible labels are ordinary HTML')
    h.ok(p.locator('[data-crossing-angles-label]').count()>=9, 'four ray/four sector/common-vertex HTML labels')


def back(p, before=None):
    act(p, 'back', before=before)
    p.locator(E).wait_for()
    h.focus(p, E, 'Back restores entry focus')



def resize_crossings(p, before):
    # Keep the same bound controls while the actual diagram changes size.
    # Fresh contexts at each width cannot detect a disconnected resize observer.
    for angle in [15,165]:
        act(p,'angle',angle,before)
        original=p.locator(sel('rotation')).element_handle()
        orientation=int(original.get_attribute('data-crossing-angles-value'))
        for width in [320,820]:
            p.set_viewport_size({'width':width,'height':1000})
            p.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
            bounds(p)
            h.unchanged(p,before,'actual viewport resize '+str(angle)+'/'+str(width))
            h.ok(original.evaluate('e=>e.isConnected&&e===document.querySelector("[data-crossing-angles-action=rotation]")'),'resize keeps original child control bound')
        original.click()
        h.ok(p.locator(sel('rotation')).get_attribute('data-crossing-angles-value')==str((orientation+30)%360),'original control remains live after resizing down and back')
        h.unchanged(p,before,'original control after viewport resize')


def journey(browser, base):
    print('Crossing Angles: actual tablet journey and copied waiting panel', flush=True)
    p = setup(browser, base)
    notes_before = h.notes(p, 'notes-before')
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    cases = p.locator('[data-cframe-case] option').evaluate_all('xs=>xs.map(x=>x.value)')
    p.locator('[data-cframe-case]').select_option('half-panel')
    parent(p, 'width-more');parent(p, 'height-less');parent(p, 'turn');parent(p, 'tiles');parent(p, 'compare')
    p.locator(P+' details summary').click()
    live = frame(p)
    parent(p, 'example');parent(p, 'next');parent(p, 'next')
    waiting = frame(p)
    before = h.snapshot(p)
    old = [p.locator('[data-cframe-action="next"]').element_handle(),p.locator(P+' [data-speak]').element_handle(),p.locator(E).element_handle()]
    enter(p, before)
    for control in old:h.dispatch(control)
    h.ok(p.locator(R).count()==1, 'old parent controls cannot revive behind child')
    h.unchanged(p, before, 'old parent actions')
    shape(p);bounds(p);hear(p, before, includes=['Crossing Angles'])
    resize_crossings(p,before)
    for angle in [15,60,90,135,165]:
        act(p,'angle',angle,before)
        body=p.locator(R).inner_text()
        for name,measure in [('AOB',angle),('BOC',180-angle),('COD',angle),('DOA',180-angle)]:
            h.ok(p.locator('[data-crossing-angles-label="'+name+'"] strong').inner_text()==str(measure)+'°', 'visible independent sector '+name)
    act(p,'pair','adjacent',before);act(p,'pair','opposite',before)
    for prompt in range(6):act(p,'prompt',prompt,before)
    act(p,'rotation',before=before);act(p,'page','learn',before)
    for card,title in enumerate(['Which angle?','Why opposite angles match','Equal does not always make180°','Crossed ribbons on my panel']):
        act(p,'card',card,before)
        h.ok(title.replace('make180','make 180') in p.locator(R).inner_text().replace('make180','make 180'), 'teaching card '+str(card))
        if card==1:
            for step in [1,2,1,0]:
                act(p,'step',step,before)
                hear(p,before,includes=[['A, O and C','B, O and D','same BOC angle'][step]])
        hear(p,before,includes=[title] if card!=2 else ['opposite angles'])
        bounds(p);capture(p,'tablet-card-'+str(card))
    copied=p.locator('[data-crossing-angles-panel]').all_text_contents()
    h.ok(len(copied)==2, 'two actual captured panel frames')
    back(p,before);h.ok(frame(p)==waiting,'Back restores exact example frame, case, waiting materials and fold')
    parent(p,'close');h.ok(frame(p)==live,'closing example restores actual dimensions, turn, tiles, reading and fold')
    parent(p,'width-more');changed=frame(p)
    enter(p,before)
    h.ok(p.locator('select'+sel('card')).input_value()=='3','child teaching choice survives Back/re-entry')
    h.ok(p.locator('[data-crossing-angles-panel]').all_text_contents()!=copied,'explicit re-entry captures changed waiting side')
    act(p,'page','build',before);h.ok(p.locator('select'+sel('angle')).input_value()=='165','child mathematics retained during visit')
    back(p,before);h.ok(frame(p)==changed,'changed parent retained')
    h.unchanged(p,before,'child returns')
    report=h.notes(p,'notes-after')
    h.ok({k:v for k,v in report.items() if k!='exportedAt'}=={k:v for k,v in notes_before.items() if k!='exportedAt'},'actual Notes export unchanged')
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    p.locator(P+' details summary').click()
    sibling_parent=frame(p)
    # These existing siblings have their own given-math writers. Their visits
    # are separate stimuli, outside the Crossing Angles no-write baseline.
    for entry,root,action,edit in [('[data-square-pens-entry]','[data-square-pens-root]','[data-sp-action="return"]','[data-sp-action="turn"]'),('[data-shadow-yard-entry]','[data-shadow-yard-root]','[data-sy-action="return"]','[data-sy-action="teaching"]')]:
        p.locator(entry).click();p.locator(root).wait_for();p.locator(edit).click();retained=p.locator(root).inner_text()
        p.locator(action).click();h.ok(frame(p)==sibling_parent,'sibling Back retains parent state/fold')
        isolated=h.snapshot(p);enter(p,isolated);act(p,'rotation',before=isolated);back(p,isolated)
        p.locator(entry).click();p.locator(root).wait_for();h.ok(p.locator(root).inner_text()==retained,'Crossing Angles retains existing sibling work');p.locator(action).click()
    p.context.close()
    return report


def retire(control, mode):
    scripts={'detached':'const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n)', 'hidden':'e.hidden=true;e.hidden=false', 'ancestor':'const p=e.parentElement;p.style.visibility="hidden";p.style.visibility=""', 'reparented':'const d=document.createElement("div");e.parentNode.append(d);d.append(e)'}
    control.evaluate('e=>{'+scripts[mode]+'}')


def guards(browser, base):
    print('Crossing Angles: stale original parent and child actions/Hear',flush=True)
    for child in [False,True]:
        for mode in ['detached','hidden','ancestor','reparented']:
            p=setup(browser,base)
            if child:enter(p)
            action=p.locator(sel('rotation') if child else '[data-cframe-action="width-more"]').element_handle()
            speaker=p.locator((R if child else P)+' [data-speak]').element_handle()
            entry=None if child else p.locator(E).element_handle()
            for control in [action,speaker]+([entry] if entry else []):retire(control,mode)
            before=h.snapshot(p);html=p.locator(R if child else P).inner_html();n=p.evaluate('__sharedSpoken.length')
            for control in [action,speaker]+([entry] if entry else []):h.dispatch(control)
            h.ok(p.locator(R if child else P).inner_html()==html,'retired '+('child' if child else 'parent')+' '+mode+' action cannot edit/render/navigate')
            h.ok(p.evaluate('__sharedSpoken.length')==n,'retired '+mode+' Hear inert')
            h.unchanged(p,before,'retired '+mode)
            p.context.close()


def reset_state(p):
    before=h.snapshot(p)
    enter(p,before);h.ok(p.locator('select'+sel('angle')).input_value()=='60','fresh visit starts default local work')
    act(p,'page','parallel',before)
    h.ok(p.locator(sel('two-mode','strips')).get_attribute('aria-pressed')=='true' and p.locator(sel('two-pair','corresponding')).get_attribute('aria-pressed')=='true','fresh visit resets two-crossing mode and pair')
    h.ok([p.locator('select'+sel(action)).input_value() for action in ['two-spacing','two-lean','two-prompt']]==['middle','0','0'],'fresh visit resets two-crossing selections')
    h.ok(p.locator('[data-crossing-angles-tracing=previous]').is_disabled(),'fresh visit resets tracing to first position')
    act(p,'page','triangle',before)
    h.ok([p.locator('select'+sel(a)).input_value() for a in ['tri-a','tri-b','tri-size','tri-prompt']]==['60','60','large','0'],'fresh visit resets triangle free settings')
    h.ok(p.locator(sel('tri-mode','free')).get_attribute('aria-pressed')=='true' and p.locator(sel('tri-view','gather')).get_attribute('aria-pressed')=='true','fresh visit resets triangle mode/view')
    h.ok(p.locator('[data-crossing-angles-tri-step=previous]').is_disabled(),'fresh visit resets triangle steps')
    act(p,'tri-view','reason',before);h.ok(p.locator('[data-crossing-angles-tri-step=previous]').is_disabled(),'fresh visit also resets independent triangle proof step');act(p,'tri-view','gather',before)
    act(p,'page','build',before)


def lifetime_setting(p):
    before=h.snapshot(p)
    act(p,'angle',135,before);act(p,'page','parallel',before)
    act(p,'two-lean',10,before);act(p,'two-spacing','far',before);act(p,'two-prompt',5,before)
    act(p,'two-pair','co-interior',before);act(p,'two-move',1,before);act(p,'two-mode','panel',before)
    act(p,'page','triangle',before);act(p,'tri-a',90,before);act(p,'tri-b',45,before)
    act(p,'tri-size','small',before);act(p,'tri-prompt',5,before);tri_step(p,'gather',2,before)
    tri_step(p,'reason',2,before);act(p,'tri-view','outside',before);act(p,'tri-mode','panel',before)
    act(p,'page','build',before)


def lifetime(browser, base, report):
    print('Crossing Angles: exact route, chooser, owner, import and reset lifetime',flush=True)
    p=setup(browser,base);enter(p);lifetime_setting(p)
    old=p.locator(sel('rotation')).element_handle();speaker=p.locator(R+' [data-speak]').element_handle();html=p.locator(R).inner_html();n=p.evaluate('__sharedSpoken.length')
    p.evaluate('history.replaceState(null,"","#workshop/copy-frame/")');h.dispatch(old);h.dispatch(speaker)
    h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==n,'exact route rejected before hashchange')
    p.evaluate('location.hash="#workshop"');p.locator(R).wait_for(state='detached');p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);reset_state(p)
    lifetime_setting(p);p.locator('#explorer-switch').click();p.locator('#explorer-cancel').click();ready(p);reset_state(p)
    lifetime_setting(p);old=p.locator(sel('rotation')).element_handle();speaker=p.locator(R+' [data-speak]').element_handle()
    p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    before=h.snapshot(p);n=p.evaluate('__sharedSpoken.length');h.dispatch(old);h.dispatch(speaker);h.unchanged(p,before,'retired owner');h.ok(p.evaluate('__sharedSpoken.length')==n,'retired owner Hear');reset_state(p)
    lifetime_setting(p);p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-crossing-notebook.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);reset_state(p)
    lifetime_setting(p);p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click()
    film=p.locator('dialog.welcome-film[open]')
    if film.count():film.locator('[data-film-skip]').click()
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);reset_state(p)
    lifetime_setting(p);p.reload(wait_until='networkidle');ready(p);reset_state(p)
    p.context.close()


def phone(browser, base):
    print('Crossing Angles: phone controls, narrow crossings and extreme panels',flush=True)
    p=setup(browser,base,320);before=h.snapshot(p);enter(p,before)
    for angle in [15,165]:
        act(p,'angle',angle,before)
        for rotation in range(12):
            bounds(p);act(p,'rotation',before=before)
        capture(p,'phone-angle-'+str(angle))
    act(p,'angle',30,before)
    less=p.locator('[data-crossing-angles-step="less"]');less.focus();p.keyboard.press('Enter')
    h.focus(p,'[data-crossing-angles-step="more"]','endpoint keyboard focus falls back to enabled increment')
    act(p,'page','learn',before);act(p,'card',1,before)
    p.locator(sel('step',1)).focus();p.keyboard.press('Enter');h.unchanged(p,before,'keyboard explanation step');bounds(p)
    back(p,before)
    for width,height in [(1,12),(12,1),(1,1)]:
        for side,target in [('width',width),('height',height)]:
            # Native endpoint buttons make exact temporary shapes without a host injection.
            while not p.locator('[data-cframe-action="'+side+'-less"]').is_disabled():parent(p,side+'-less')
            for _ in range(target-1):parent(p,side+'-more')
        enter(p,before);act(p,'page','learn',before);act(p,'card',3,before)
        h.ok(p.locator('[data-crossing-angles-inset]').count()==2,'each fitted panel has its own enlarged crossing')
        bounds(p);capture(p,'phone-panel-'+str(width)+'-'+str(height));hear(p,before)
        back(p,before)
    p.context.close()


def voice(browser, base):
    p=setup(browser,base);enter(p);before=h.snapshot(p);hear(p,before)
    p.locator('.voice-settings summary').first.click();p.locator('[data-reading-speed]').select_option('0.8')
    after=h.snapshot(p)
    h.ok(after['memory']['garden']['speech']!=before['memory']['garden'].get('speech'),'new shared voice preferences function')
    for snapshot in [before,after]:
        snapshot['memory']['garden'].pop('speech',None)
        for key,value in list(snapshot['local'].items()):
            if key.startswith('number-garden-v1:'):
                value=json.loads(value);value.get('garden',{}).pop('speech',None);snapshot['local'][key]=json.dumps(value,sort_keys=True)
    h.ok(after==before,'only elected shared speech preference writes')
    bounds(p);p.context.close()


def svg_access(p):
    for svg in p.locator(R+' svg[aria-labelledby]').all():
        for attr,tag in [('aria-labelledby','title'),('aria-describedby','desc')]:
            ids=(svg.get_attribute(attr) or '').split()
            h.ok(len(ids)==1,'one SVG '+tag+' reference')
            h.ok(p.locator('[id="'+ids[0]+'"]').count()==1 and svg.locator(tag+'[id="'+ids[0]+'"]').count()==1,'unique owned SVG '+tag)
        description=svg.locator('desc').text_content()
        h.ok(bool(description.strip()),'current SVG has an accessible description')


def two_measures(p, angle, lean):
    text=p.locator(R+' .ca-two-table').inner_text()
    for name,value in zip('abcdefgh',[angle,180-angle,angle,180-angle,angle-lean,180-angle+lean,angle-lean,180-angle+lean]):
        h.ok(re.search(r'\b'+name+r'\s*:\s*'+str(value)+r'°',text) is not None,'independent two-crossing measure '+name+'='+str(value))
    svg_access(p)


def two_resize(p,before):
    # Resize without rendering: an original bound button must remain connected.
    original=p.locator(sel('two-move',1)).element_handle()
    rotation=p.locator(sel('rotation')).element_handle()
    for width in [320,820]:
        p.set_viewport_size({'width':width,'height':1000})
        p.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
        bounds(p)
        h.ok(original.evaluate('e=>e.isConnected'),'resize retains original new-page tracing control')
        h.ok(rotation.evaluate('e=>e.isConnected'),'resize retains original shared turn control')
        h.unchanged(p,before,'two-crossing actual resize')
    original.click()
    h.ok('Tracing move 1 of 4' in p.locator(R).inner_text().replace('of4','of 4'),'original tracing control remains bound after resize')
    h.unchanged(p,before,'original new-page control after resize')
    act(p,'two-move',0,before)


def panel_only(p):
    for action in ['angle','two-spacing','two-lean']:
        h.ok(p.locator(sel(action)).count()==0,'inactive '+action+' controls omitted from panel DOM')
    text=p.locator(R).inner_text()
    h.ok('These are the dimensions copied from my waiting Copy Frame panel.' in text,'actual captured panel caption')
    h.ok('Inside means between the two width-side lines' in text,'panel explains inside beyond rectangle corners')
    h.ok(not p.locator('[data-crossing-angles-label] strong').count(),'panel selected tags carry no numeric angle measurements')
    svg_access(p)


def two_journey(browser,base):
    print('Two Crossings: one complete tablet extension, retained source and current narration',flush=True)
    p=setup(browser,base)
    exported=h.notes(p,'two-notes-before')
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    # Give original and copied rectangles deliberately different dimensions.
    parent(p,'width-more');parent(p,'height-less')
    source=frame(p)
    dims=p.locator('[data-cframe-copy]').evaluate('e=>[Number(e.getAttribute("width"))/22,Number(e.getAttribute("height"))/22]')
    before=h.snapshot(p);enter(p,before);act(p,'page','parallel',before)
    h.ok(p.locator(sel('page','parallel')).get_attribute('aria-pressed')=='true','new native tab selected')
    hear(p,before,includes=['Two Crossings'])
    for angle in [60,90]:
        act(p,'angle',angle,before)
        for lean in [0,10,-10]:
            act(p,'two-lean',lean,before);two_measures(p,angle,lean)
            for pair,name in [('corresponding','corresponding'),('alternate','alternate interior'),('co-interior','co-interior')]:
                act(p,'two-pair',pair,before)
                for move in range(1,5):act(p,'two-move',move,before)
                h.focus(p,'[data-crossing-angles-tracing=previous]','last tracing position falls back to previous control')
                hear(p,before,includes=[('a + h' if pair=='co-interior' and lean else name),'line up' if lean==0 else 'does not line up'])
                for move in [3,2,1,0]:act(p,'two-move',move,before)
                h.focus(p,'[data-crossing-angles-tracing=next]','first tracing position falls back to next control')
    for spacing in ['near','middle','far']:act(p,'two-spacing',spacing,before)
    for prompt in range(6):act(p,'two-prompt',prompt,before)
    act(p,'angle',60,before);act(p,'two-lean',10,before)
    act(p,'rotation',before=before)
    turn=p.locator(sel('rotation')).get_attribute('data-crossing-angles-value')
    two_resize(p,before)
    capture(p,'two-tablet-free')
    act(p,'two-mode','panel',before)
    h.focus(p,sel('two-mode','panel'),'mode switch focuses selected native button')
    panel_only(p)
    h.ok(p.locator(R+' .ca-dimensions').inner_text()==str(dims[0])+' × '+str(dims[1]),'panel captures actual copy dimensions rather than original')
    for prompt in range(6):
        act(p,'two-prompt',prompt,before)
        hear(p,before,excludes=['60°','50°','10°','lean clockwise','lean counterclockwise'])
    for pair in ['corresponding','alternate','co-interior']:
        act(p,'two-pair',pair,before)
        for move in [1,2,3,4]:act(p,'two-move',move,before)
        hear(p,before,includes=['parallel','directions line up'],excludes=['50°','60°','10°'])
        for move in [3,2,1,0]:act(p,'two-move',move,before)
    two_resize(p,before);capture(p,'two-tablet-panel')
    act(p,'two-mode','strips',before)
    h.ok(p.locator('select'+sel('angle')).input_value()=='60' and p.locator('select'+sel('two-lean')).input_value()=='10' and p.locator('select'+sel('two-spacing')).input_value()=='far','panel roundtrip preserves all free settings')
    act(p,'page','build',before)
    h.ok(p.locator('select'+sel('angle')).input_value()=='60' and p.locator(sel('rotation')).get_attribute('data-crossing-angles-value')==turn,'Explore retains shared first angle and turn')
    act(p,'page','learn',before)
    titles=['Same position, same turn','Inside, opposite sides','Inside, same side','What a lean changes']
    for card,title in enumerate(titles,4):
        act(p,'card',card,before)
        h.ok(title in p.locator(R).inner_text(),'new worked card '+str(card))
        h.ok('Worked example, not my settings.' in p.locator(R).inner_text(),'worked settings explicitly distinguished')
        if card==4:
            for step,phrase in [(0,'A straight line'),(1,'Slide a tracing'),(2,'Both directions match'),(1,'Slide a tracing'),(0,'A straight line')]:
                if p.locator(sel('step',step)).count() and not p.locator(sel('step',step)).is_disabled():act(p,'step',step,before)
                hear(p,before,includes=[phrase])
        else:hear(p,before,includes=[title])
        bounds(p);svg_access(p);capture(p,'two-tablet-card-'+str(card))
    act(p,'page','parallel',before);act(p,'two-mode','panel',before)
    captured=p.locator(R).inner_text()
    back(p,before);h.ok(frame(p)==source,'new page Back preserves exact waiting parent')
    parent(p,'width-more');changed=frame(p)
    enter(p,before)
    panel_only(p)
    h.ok(p.locator(R).inner_text()!=captured,'explicit re-entry recaptures changed source dimensions')
    back(p,before);h.ok(frame(p)==changed,'recaptured parent remains unchanged')
    h.unchanged(p,before,'all two-crossing actions and returns')
    after=h.notes(p,'two-notes-after')
    h.ok({k:v for k,v in after.items() if k!='exportedAt'}=={k:v for k,v in exported.items() if k!='exportedAt'},'actual Notes export unchanged across every new mathematical action')
    p.context.close()


def two_focused(browser,base):
    print('Two Crossings: bounded phone/tablet extremes and thin copied rectangles',flush=True)
    p=setup(browser,base);before=h.snapshot(p);enter(p,before);act(p,'page','parallel',before)
    for width,angle,lean,spacing,pair,turns in [(320,15,10,'near','corresponding',0),(320,165,-10,'far','alternate',6),(820,90,0,'near','co-interior',3)]:
        p.set_viewport_size({'width':width,'height':1000})
        act(p,'angle',angle,before);act(p,'two-lean',lean,before);act(p,'two-spacing',spacing,before);act(p,'two-pair',pair,before)
        for _ in range(turns):act(p,'rotation',before=before)
        two_measures(p,angle,lean);bounds(p);capture(p,'two-extreme-'+str(width)+'-'+str(angle))
    back(p,before)
    for width,height in [(1,12),(12,1),(1,1)]:
        for side,target in [('width',width),('height',height)]:
            while not p.locator('[data-cframe-action="'+side+'-less"]').is_disabled():parent(p,side+'-less')
            for _ in range(target-1):parent(p,side+'-more')
        enter(p,before);act(p,'two-mode','panel',before);act(p,'two-pair','co-interior',before)
        for screen in [820,320]:
            p.set_viewport_size({'width':screen,'height':1000})
            bounds(p);panel_only(p)
            h.ok(str(width)+' × '+str(height) in p.locator(R).inner_text(),'panel uses actual copy dimensions '+str(width)+'x'+str(height))
            capture(p,'two-panel-'+str(width)+'-'+str(height)+'-'+str(screen))
        hear(p,before,includes=['Inside means between the two width-side lines'])
        back(p,before)
    p.context.close()


def two_guards(browser,base):
    print('Two Crossings: stale new actions and Hear remain inert before render or speech',flush=True)
    for mode in ['detached','hidden','ancestor','reparented']:
        p=setup(browser,base);enter(p);act(p,'page','parallel')
        handles=[p.locator(sel('two-mode','panel')).element_handle(),p.locator('select'+sel('two-lean')).element_handle(),p.locator(sel('two-move',1)).element_handle(),p.locator(R+' [data-speak]').element_handle()]
        for control in handles:retire(control,mode)
        before=h.snapshot(p);html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length')
        for control in handles:h.dispatch(control,'change' if control.evaluate('e=>e.tagName')=='SELECT' else 'click')
        h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==spoken,'retired new '+mode+' controls cannot render or speak')
        h.unchanged(p,before,'retired two-crossing '+mode);p.context.close()


def tri_step(p,view,step,before):
    act(p,'tri-view',view,before)
    action='tri-gather' if view=='gather' else 'tri-proof'
    # Target steps are adjacent native buttons; traverse intentionally.
    for _ in range(4):
        match=re.search(r'(?:Move|Reason)\s+(\d+)\s+of\s*2',p.locator(R).inner_text())
        h.ok(match is not None,'active triangle step counter visible')
        position=int(match.group(1))
        if position==step:break
        direction='next' if position is not None and position<step else 'previous'
        button=p.locator('[data-crossing-angles-tri-step='+direction+']')
        target=int(button.get_attribute('data-crossing-angles-value'))
        act(p,action,target,before)
        if target in [0,2]:h.focus(p,'[data-crossing-angles-tri-step='+('next' if target==0 else 'previous')+']','triangle endpoint focuses enabled opposite control')
    else:raise AssertionError('triangle step control did not reach requested step')
    if step in [0,2]:
        h.ok(p.locator('[data-crossing-angles-tri-step='+('previous' if step==0 else 'next')+']').is_disabled(),'triangle endpoint is disabled')


def tri_shape(p,view,step=0):
    svg_access(p)
    svg=p.locator('[data-crossing-angles-triangle-stage] svg')
    h.ok(svg.count()==1,'one current triangle diagram')
    original=not(view=='gather' and step>0)
    h.ok(svg.locator('[data-triangle-outline]').count()==int(original),'triangle outline only in original arrangements')
    h.ok(svg.locator('[data-triangle-kind=interior]').count()==(3 if original else 0),'all original interior marks only with outline')
    for point in 'ABC':h.ok(p.locator('[data-crossing-angles-triangle-stage] [data-crossing-angles-label="'+point+'"]').count()==int(original),'point labels only with outline')
    h.ok(svg.locator('[data-triangle-kind=detached]').count()==(3 if view=='gather' and step==1 else 0),'only detached arrangement has three detached copies')
    h.ok(svg.locator('[data-triangle-kind=joined]').count()==(3 if view=='gather' and step==2 else 0),'only joined arrangement has three joined copies')
    h.ok(p.locator(R+' .ca-triangle-equations').count()==int(view=='outside' or view=='reason' and step>0 or view=='gather' and step==2),'equations appear only at current teaching steps')
    for name in 'abc':
        h.ok(p.locator('[data-crossing-angles-triangle-stage] [data-crossing-angles-label="'+name+'"]').count()==1,'one current outer angle tag '+name)
    h.ok(svg.locator('[data-triangle-kind=outside]').count()==int(view=='outside'),'adjacent outside sector only in outside view')
    h.ok(svg.locator('[data-triangle-line=parallel-0]').count()==int(view=='reason' and step>0),'parallel only in active reason step')
    text=p.locator(R).inner_text()
    h.ok('A closed shape with three straight sides' in text,'triangle definition visible')
    h.ok('A, B, C name points; a, b, c name their interior angles.' in text,'point and angle naming visible')
    bounds(p)


def tri_resize(p,before):
    original=p.locator('[data-crossing-angles-tri-step=next]').element_handle()
    rotation=p.locator(sel('rotation')).element_handle()
    orientation=int(rotation.get_attribute('data-crossing-angles-value'))
    for width in [320,820]:
        p.set_viewport_size({'width':width,'height':1000})
        p.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
        bounds(p)
        for e in [original,rotation]:h.ok(e.evaluate('e=>e.isConnected'),'live resize retains original triangle/shared controls')
        h.unchanged(p,before,'triangle live resize')
    original.click();h.unchanged(p,before,'original triangle step after resize')
    h.ok('Move 1 of' in p.locator(R).inner_text(),'original triangle step remains bound after resize')
    # Render replaced the old rotation: independently activate a second original
    # shared control across another real resize round trip.
    rotation=p.locator(sel('rotation')).element_handle()
    for width in [320,820]:p.set_viewport_size({'width':width,'height':1000})
    rotation.click();h.unchanged(p,before,'original shared turn after triangle resize')
    h.ok(p.locator(sel('rotation')).get_attribute('data-crossing-angles-value')==str((orientation+30)%360),'original shared turn remains bound after resize')
    tri_step(p,'gather',0,before)


def tri_panel(p,dims):
    for action in ['tri-a','tri-b','tri-size']:
        h.ok(p.locator(sel(action)).count()==0,'panel omits inactive '+action)
    text=p.locator(R).inner_text()
    h.ok(str(dims[0])+' × '+str(dims[1]) in text,'triangle shows actual copied dimensions')
    h.ok(re.search(r'b\s*=\s*90° at B',text) is not None and '90° − a at C' in text,'panel angles remain symbolic at square and thin dimensions')
    h.ok('This half uses the width and height sides' in text,'actual panel half provenance visible')
    return text


def triangle_journey(browser,base):
    print('Triangle Corners: complete tablet visit, current speech, exact copied source and no saved writes',flush=True)
    p=setup(browser,base);exported=h.notes(p,'triangle-notes-before')
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    parent(p,'width-more');parent(p,'height-less');source=frame(p)
    dims=p.locator('[data-cframe-copy]').evaluate('e=>[Number(e.getAttribute("width"))/22,Number(e.getAttribute("height"))/22]')
    before=h.snapshot(p);enter(p,before);act(p,'angle',135,before);act(p,'page','triangle',before)
    h.focus(p,sel('page','triangle'),'triangle tab retains focus')
    tri_resize(p,before)
    for a,b in [(15,150),(150,15),(15,15),(90,45)]:
        act(p,'tri-a',15,before);act(p,'tri-b',b,before);act(p,'tri-a',a,before)
        text=p.locator(R).inner_text()
        h.ok(all(x in text for x in ['a = '+str(a)+'° at A','b = '+str(b)+'° at B','c = '+str(180-a-b)+'° at C']),'independent current chosen triangle summary')
    # A native option is disabled and a forged DOM change cannot bypass reducer.
    select=p.locator('select'+sel('tri-a'))
    h.ok(select.locator('option[value="150"]').is_disabled(),'invalid angle option disabled')
    html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length')
    select.evaluate('e=>{e.value="150";e.dispatchEvent(new Event("change",{bubbles:true}))}')
    h.ok(select.input_value()=='90' and p.locator(R).inner_html()==html,'refused forced select restores native value without rendering')
    h.ok(p.evaluate('__sharedSpoken.length')==spoken,'refused select does not speak');h.unchanged(p,before,'refused triangle pair')
    for size in ['small','large']:act(p,'tri-size',size,before)
    for prompt in range(6):act(p,'tri-prompt',prompt,before);hear(p,before,includes=['Triangle corners'])
    for mode in ['free','panel']:
        act(p,'tri-mode',mode,before);h.focus(p,sel('tri-mode',mode),'triangle mode retains focus')
        if mode=='panel':tri_panel(p,dims)
        for view in ['gather','reason','outside']:
            act(p,'tri-view',view,before);h.focus(p,sel('tri-view',view),'triangle view retains focus')
            for step in ([0,1,2] if view!='outside' else [0]):
                if view!='outside':tri_step(p,view,step,before)
                tri_shape(p,view,step)
                if mode=='free':
                    h.ok(all(p.locator('select'+sel(a)).count()==1 for a in ['tri-a','tri-b','tri-size']),'free shape settings available at every step')
                    if view=='gather' and step==2:
                        act(p,'tri-size','small',before);act(p,'tri-a',45,before)
                        h.ok('Move 2 of' in p.locator(R).inner_text() and 'c = 90° at C' in p.locator(R).inner_text(),'shape changes retain chosen gather step and regenerate current third angle')
                        act(p,'tri-a',90,before);act(p,'tri-size','large',before)
                phrases={'gather':['Look at the three inside corners.','These are copies of this triangle’s corners.','The three corners fill a straight turn:'], 'reason':['Start with any triangle with three straight sides','AC crosses the two parallel lines.','BC crosses the same parallel lines'], 'outside':['Extend the side from B through C.']}
                current=phrases[view][step]
                inactive=[phrase for name,items in phrases.items() for index,phrase in enumerate(items) if name!=view or index!=step]
                text=hear(p,before,includes=['Triangle corners',current],excludes=inactive+['Exploration here is not assessed'])
                if mode=='free':h.ok('a equals 90° at A' in text and 'b equals 45° at B' in text and 'c equals 45° at C' in text,'Hear uses independent current free values')
                else:h.ok('b equals 90° at B' in text and 'c equals 90° minus a at C' in text,'Hear keeps current panel summary symbolic')
                worked=mode=='free' and (view=='outside' or step==2)
                h.ok(('Separate worked example' in text)==worked,'Hear includes separate worked example exactly when visible')
                if mode=='panel':h.ok('chosen model angles' not in text and 'Separate worked example' not in text,'panel Hear excludes inactive free settings/support')
                capture(p,'triangle-tablet-'+mode+'-'+view+'-'+str(step))
            if view!='outside':
                tri_step(p,view,0,before)
        for prompt in range(6):act(p,'tri-prompt',prompt,before);hear(p,before)
    act(p,'tri-mode','free',before)
    h.ok([p.locator('select'+sel(a)).input_value() for a in ['tri-a','tri-b','tri-size','tri-prompt']]==['90','45','large','5'],'panel round trip retains triangle free work')
    tri_step(p,'gather',2,before);tri_step(p,'reason',1,before);act(p,'tri-view','gather',before)
    h.ok('Move 2 of' in p.locator(R).inner_text(),'view switch restores independent gather step')
    act(p,'page','build',before);h.ok(p.locator('select'+sel('angle')).input_value()=='135','triangle never changes old free crossing angle')
    act(p,'page','triangle',before);act(p,'tri-mode','panel',before);captured=tri_panel(p,dims)
    back(p,before);h.ok(frame(p)==source,'triangle Back retains exact parent work')
    parent(p,'width-more');changed=frame(p);dims[0]+=1
    enter(p,before);tri_panel(p,dims)
    h.ok(p.locator(R).inner_text()!=captured and 'Move 2 of' in p.locator(R).inner_text(),'explicit reentry recaptures new source and retains triangle step')
    act(p,'tri-mode','free',before)
    h.ok(p.locator('select'+sel('tri-a')).input_value()=='90','explicit reentry retains free triangle work')
    back(p,before);h.ok(frame(p)==changed,'triangle recaptured parent remains exact');h.unchanged(p,before,'complete triangle visit')
    after=h.notes(p,'triangle-notes-after')
    h.ok({k:v for k,v in after.items() if k!='exportedAt'}=={k:v for k,v in exported.items() if k!='exportedAt'},'actual Notes download unchanged across complete triangle visit')
    p.context.close()


def triangle_focused(browser,base):
    print('Triangle Corners: bounded seven arrangements and skinny/right/panel responsive risks',flush=True)
    p=setup(browser,base);before=h.snapshot(p);enter(p,before);act(p,'page','triangle',before)
    samples=[('gather',0,15,150,'large',0),('gather',1,150,15,'small',2),('gather',2,15,15,'large',5),('reason',0,90,45,'large',3),('reason',1,15,150,'small',1),('reason',2,150,15,'large',4),('outside',0,15,15,'large',2)]
    for view,step,a,b,size,turns in samples:
        act(p,'tri-a',15,before);act(p,'tri-b',b,before);act(p,'tri-a',a,before);act(p,'tri-size',size,before)
        for _ in range(turns):act(p,'rotation',before=before)
        act(p,'tri-view',view,before)
        if view!='outside':tri_step(p,view,step,before)
        for screen in [320,820]:
            p.set_viewport_size({'width':screen,'height':1000});tri_shape(p,view,step);capture(p,'triangle-risk-'+view+'-'+str(step)+'-'+str(screen))
    back(p,before)
    for width,height,view,step in [(1,12,'reason',2),(12,1,'outside',0),(1,1,'gather',2)]:
        for side,target in [('width',width),('height',height)]:
            while not p.locator('[data-cframe-action="'+side+'-less"]').is_disabled():parent(p,side+'-less')
            for _ in range(target-1):parent(p,side+'-more')
        enter(p,before);act(p,'tri-mode','panel',before);act(p,'tri-view',view,before)
        if view!='outside':tri_step(p,view,step,before)
        act(p,'rotation',before=before)
        for screen in [320,820]:
            p.set_viewport_size({'width':screen,'height':1000});tri_panel(p,[width,height]);tri_shape(p,view,step);capture(p,'triangle-panel-'+str(width)+'-'+str(height)+'-'+str(screen))
        hear(p,before);back(p,before)
    p.context.close()


def triangle_guards(browser,base):
    print('Triangle Corners: retired old/new actions and Hear inert before render/write/speech',flush=True)
    for mode in ['detached','hidden','ancestor','reparented']:
        p=setup(browser,base);enter(p);old=p.locator(sel('rotation')).element_handle();old_hear=p.locator(R+' [data-speak]').element_handle()
        act(p,'page','triangle')
        handles=[old,old_hear,p.locator(sel('tri-mode','panel')).element_handle(),p.locator('select'+sel('tri-a')).element_handle(),p.locator('[data-crossing-angles-tri-step=next]').element_handle(),p.locator(R+' [data-speak]').element_handle()]
        for control in handles[2:]:retire(control,mode)
        before=h.snapshot(p);html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length')
        for control in handles:h.dispatch(control,'change' if control.evaluate('e=>e.tagName')=='SELECT' else 'click')
        h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==spoken,'retired triangle '+mode+' old/new controls cannot render or speak')
        h.unchanged(p,before,'retired triangle '+mode);p.context.close()


def main():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base='http://127.0.0.1:'+str(server.server_port)+'/'
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
            try:
                report=journey(browser,base);guards(browser,base);lifetime(browser,base,report);phone(browser,base);voice(browser,base);two_journey(browser,base);two_focused(browser,base);two_guards(browser,base);triangle_journey(browser,base);triangle_focused(browser,base);triangle_guards(browser,base)
                h.ok(not h.errors,'no browser/HTTP errors: '+str(h.errors))
                result={'status':'passed','checks':h.checks,'artifacts':str(OUT)}
                (OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result),flush=True)
            except Exception:
                (OUT/'failure.txt').write_text(traceback.format_exc())
                for i,p in enumerate(h.pages):
                    if not p.is_closed():capture(p,'failure-'+str(i))
                raise
            finally:browser.close()
    finally:server.shutdown();server.server_close()


if __name__=='__main__':main()
