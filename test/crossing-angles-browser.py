"""Crossing Angles415/416/417/418/419/420 in the actual application, with invented notebooks only.

One complete tablet visit and focused phone/label/lifetime probes. The sole app
instrumentation exposes a read-only getter at its real initialization marker.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, importlib.util, json, os, re, tempfile, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('CROSSING_ANGLES_ARTIFACTS') or tempfile.mkdtemp(prefix='lg418-native-'))
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
    selects = ['angle','prompt','card','two-spacing','two-lean','two-prompt','tri-a','tri-b','tri-size','tri-prompt','poly-sides','poly-kind','poly-size','poly-prompt','match-case','match-prompt','chase-case','chase-target']
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
    expected=raw.replace('×',' times ').replace('÷',' divided by ').replace('−',' minus ').replace('=',' equals ')
    h.ok(text==re.sub(' +',' ',expected).strip(),'shared Hear reads exactly its current declared narration')
    h.ok(all(s in text for s in includes) and not any(s in text for s in excludes), 'Hear current visible explanation only: '+text)
    h.ok('Exploration here is not assessed' not in text, 'Hear excludes grown-up note')
    h.unchanged(p, before, 'Hear')
    bounds(p)
    return text


def capture(p, name):
    p.screenshot(path=str(OUT/(name+'.png')), full_page=True)
    inset=p.locator('[data-polygon-direction-inset]')
    if inset.count():inset.locator('..').screenshot(path=str(OUT/(name+'-direction.png')))


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
    act(p,'tri-view','polygons',before)
    h.ok([p.locator('select'+sel(a)).input_value() for a in ['poly-sides','poly-kind','poly-size','poly-prompt']]==['5','regular','large','0'],'fresh visit resets polygon settings')
    h.ok('A is corner 1 of 5.' in p.locator(R).inner_text() and '0 of 2 diagonals' in p.locator(R).inner_text(),'fresh visit resets polygon split/corner')
    act(p,'poly-view','walk',before);h.ok('0 of 5 turns' in p.locator(R).inner_text(),'fresh visit resets free walk')
    act(p,'tri-mode','panel',before);act(p,'poly-view','split',before)
    h.ok('A is corner 1 of 4.' in p.locator(R).inner_text() and '0 of 1 diagonal' in p.locator(R).inner_text(),'fresh visit resets independent panel work')
    act(p,'poly-view','walk',before);h.ok('0 of 4 turns' in p.locator(R).inner_text(),'fresh visit resets panel walk')
    act(p,'tri-mode','free',before);act(p,'tri-view','gather',before)
    act(p,'page','matching',before)
    h.ok(p.locator('select'+sel('match-case')).input_value()=='sss' and p.locator('select'+sel('match-prompt')).input_value()=='0','fresh visit resets matching case/prompt')
    h.ok(p.locator(sel('match-mode','parts')).get_attribute('aria-pressed')=='true' and p.locator(sel('match-view','build')).get_attribute('aria-pressed')=='true','fresh visit resets matching mode/view')
    h.ok(p.locator('[data-crossing-angles-match-step=previous]').is_disabled(),'fresh visit resets matching parts step')
    act(p,'match-mode','panel',before);h.ok(p.locator('[data-crossing-angles-match-step=previous]').is_disabled(),'fresh visit resets matching panel step')
    for mode in ['parts','panel']:
        act(p,'match-mode',mode,before);act(p,'match-view','fit',before)
        h.ok(p.locator(sel('match-fit','explore')).get_attribute('aria-pressed')=='true' and 'Copy turn: 120°' in p.locator(R).inner_text() and 'Copy reflection: reflected' in p.locator(R).inner_text(),'fresh visit resets '+mode+' manual pose and fit')
        h.ok(p.locator('[data-crossing-angles-match-slide=previous]').is_disabled(),'fresh visit resets '+mode+' slide')
        act(p,'match-view','letters',before)
        h.ok('Point pair 1 of 3' in p.locator(R).inner_text(),'fresh visit resets '+mode+' correspondence')
    act(p,'match-mode','parts',before);act(p,'match-view','build',before);chase_reset(p,before);act(p,'page','build',before)


def lifetime_setting(p):
    before=h.snapshot(p)
    act(p,'angle',135,before);act(p,'page','parallel',before)
    act(p,'two-lean',10,before);act(p,'two-spacing','far',before);act(p,'two-prompt',5,before)
    act(p,'two-pair','co-interior',before);act(p,'two-move',1,before);act(p,'two-mode','panel',before)
    act(p,'page','triangle',before);act(p,'tri-a',90,before);act(p,'tri-b',45,before)
    act(p,'tri-size','small',before);act(p,'tri-prompt',5,before);tri_step(p,'gather',2,before)
    tri_step(p,'reason',2,before);act(p,'tri-view','outside',before);act(p,'tri-mode','panel',before)
    act(p,'tri-view','polygons',before);act(p,'tri-mode','free',before);act(p,'poly-sides',11,before);act(p,'poly-kind','stretched',before);act(p,'poly-size','small',before);act(p,'poly-prompt',5,before)
    act(p,'tri-mode','free',before);act(p,'poly-corner',1,before);act(p,'poly-corner',2,before);poly_step(p,'split',3,11,before);poly_step(p,'walk',4,11,before)
    act(p,'tri-mode','panel',before);act(p,'poly-corner',1,before);poly_step(p,'split',1,4,before);poly_step(p,'walk',2,4,before)
    act(p,'page','matching',before);act(p,'match-case','ssa',before);act(p,'match-prompt',5,before);match_stage(p,2,before);act(p,'match-variant',before=before);act(p,'match-view','fit',before);act(p,'match-rotation',before=before);act(p,'match-flip',before=before);act(p,'match-move',1,before);act(p,'match-view','letters',before);act(p,'match-pair',before=before);act(p,'match-mode','panel',before);match_stage(p,1,before);act(p,'match-view','fit',before);act(p,'match-rotation',before=before);act(p,'match-flip',before=before);act(p,'match-move',1,before);act(p,'match-view','letters',before);act(p,'match-pair',before=before);act(p,'match-view','fit',before);act(p,'match-fit','given',before)
    chase_dirty(p,before);act(p,'page','build',before)


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
    if view=='outside':
        clear=p.locator('[data-crossing-angles-triangle-stage]').evaluate('''stage=>{
          const line=stage.querySelector('[data-triangle-line=extension]'),m=line.getScreenCTM();
          const a=new DOMPoint(Number(line.getAttribute('x1')),Number(line.getAttribute('y1'))).matrixTransform(m),b=new DOMPoint(Number(line.getAttribute('x2')),Number(line.getAttribute('y2'))).matrixTransform(m);
          return [...stage.querySelectorAll('.ca-point-label')].every(node=>{
          const box=node.getBoundingClientRect();let lo=0,hi=1;
          for(const [key,min,max] of [['x',box.left,box.right],['y',box.top,box.bottom]]){
            const delta=b[key]-a[key];if(Math.abs(delta)<1e-9){if(a[key]<min||a[key]>max)return true;continue;}
            const t1=(min-a[key])/delta,t2=(max-a[key])/delta;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));if(lo>hi)return true;
          }
          return false;
          });
        }''')
        h.ok(clear,'Point labels leave the actual on-screen BC extension visible')
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


def poly_open(p,before):
    act(p,'page','triangle',before);act(p,'tri-view','polygons',before)
    h.focus(p,sel('tri-view','polygons'),'polygon view retains focus before Hear')


def poly_step(p,view,target,n,before):
    act(p,'poly-view',view,before)
    h.focus(p,sel('poly-view',view),'polygon view keeps its own enabled focus')
    action='poly-draw' if view=='split' else 'poly-walk'
    maximum=n-3 if view=='split' else n
    for _ in range(n+1):
        match=re.search(r'(\d+) of\s*'+str(maximum)+r' '+('diagonal' if view=='split' else 'turn'),p.locator(R).inner_text())
        h.ok(match is not None,'current polygon counter visible')
        position=int(match.group(1))
        if position==target:break
        value=position+(1 if target>position else -1)
        act(p,action,value,before)
        if value in [0,maximum]:
            opposite=value+1 if value==0 else value-1
            h.focus(p,sel(action,opposite),'polygon endpoint focuses enabled opposite before Hear')
    else:raise AssertionError('polygon native steps did not reach requested position')
    if maximum==0:
        h.ok(all(e.is_disabled() for e in p.locator(sel(action)).all()),'triangle polygon has two static disabled diagonal controls')
    elif target in [0,maximum]:
        h.ok(p.locator(sel(action,-1 if target==0 else maximum+1)).is_disabled(),'polygon endpoint control disabled')


def poly_walk_geometry(p,n):
    # Reconstruct directions from actual SVG vertices, not echoed angle metadata.
    result=p.locator('[data-crossing-angles-polygon-stage]').evaluate('''(stage,n)=>{
      const svg=stage.querySelector('svg'),text=stage.closest('[data-crossing-angles-root]').innerText;
      const i=Number(text.match(/Current corner (\\d+) of/)[1])-1;
      const vertices=svg.querySelector('[data-polygon-outline]').getAttribute('points').trim().split(/\\s+/).map(x=>x.split(',').map(Number));
      const V=vertices[i],prev=vertices[(i+n-1)%n],next=vertices[(i+1)%n],sub=(a,b)=>a.map((x,j)=>x-b[j]),len=a=>Math.hypot(...a),unit=a=>a.map(x=>x/len(a));
      const u=unit(sub(V,prev)),d=unit(sub(next,V)),p=[-u[1],u[0]],q=[-d[1],d[0]],rho=Math.min(24,.35*Math.min(len(sub(V,prev)),len(sub(next,V))));
      const M=V.map((x,j)=>x+(rho+8)*p[j]),tip=M.map((x,j)=>x+7*d[j]),base=M.map((x,j)=>x+2*d[j]);
      const point=(node,a,b)=>[Number(node.getAttribute(a)),Number(node.getAttribute(b))];
      const line=name=>{const node=svg.querySelector('[data-polygon-line='+name+']');return node?[point(node,'x1','y1'),point(node,'x2','y2')]:null};
      const close=(a,b)=>a.every((x,j)=>Math.abs(x-b[j])<.012),bad=[];
      const leader=line('marker-leader'),heading=line('marker-heading'),arrow=svg.querySelector('[data-polygon-arrow]').getAttribute('d').match(/-?\\d+(?:\\.\\d+)?/g).map(Number);
      const glyph=[heading[0],heading[1],[arrow[0],arrow[1]],[arrow[2],arrow[3]],[arrow[4],arrow[5]]];
      if(!close(leader[0],V)||!close(leader[1],M))bad.push('leader');
      if(!close(heading[0],M.map((x,j)=>x-7*d[j]))||!close(heading[1],tip))bad.push('heading');
      if(!close(glyph[2],base.map((x,j)=>x+4*q[j]))||!close(glyph[3],tip)||!close(glyph[4],base.map((x,j)=>x-4*q[j])))bad.push('arrow');
      const dot=svg.querySelector('[data-polygon-marker-dot]');if(!close(point(dot,'cx','cy'),M)||Number(dot.getAttribute('r'))!==3)bad.push('dot');
      for(const G of glyph){if(sub(G,V).reduce((s,x,j)=>s+x*p[j],0)<rho+.98)bad.push('glyph on turn/continuation side');if(len(sub(G,[320,280]))>200.02)bad.push('glyph outside stage safety radius');}
      const ext=line('extension'),out=line('outgoing'),sector=svg.querySelector('[data-polygon-sector=exterior]');
      const step=Number(text.match(/(\\d+) of\\s*\\d+ turns/)[1]);
      if(step===0){if(ext||out||sector)bad.push('uncounted start has turn');}
      else{
        if(!ext||!close(ext[0],V)||!close(ext[1],V.map((x,j)=>x+30*u[j])))bad.push('incoming continuation');
        if(!out||!close(out[0],V)||!close(out[1],V.map((x,j)=>x+Math.min(30,len(sub(next,V)))*d[j])))bad.push('outgoing ray');
        if(!sector||!sector.getAttribute('d').includes('A'))bad.push('exterior arc');
      }
      const ring=svg.querySelector('[data-polygon-start-ring]'),chosen=Number(text.match(/A is corner (\\d+) of/)[1])-1;
      if(!close(point(ring,'cx','cy'),vertices[chosen])||Number(ring.getAttribute('r'))!==5)bad.push('start ring');
      const inset=stage.closest('[data-crossing-angles-root]').querySelector('[data-polygon-direction-inset]');
      if(!inset)bad.push('missing enlarged direction');
      else{
        const box=inset.getBoundingClientRect(),shaft=inset.querySelector('[data-polygon-direction-heading]'),a=point(shaft,'x1','y1'),b=point(shaft,'x2','y2'),vector=sub(b,a),direction=unit(vector);
        if(Math.abs(box.width-64)>.1||Math.abs(box.height-64)>.1||inset.getAttribute('viewBox')!=='0 0 64 64')bad.push('inset CSS size');
        if(Math.abs(len(vector)-40)>.01||!close(a,[32-20*d[0],32-20*d[1]])||!close(b,[32+20*d[0],32+20*d[1]]))bad.push('enlarged shaft');
        if(Math.abs(direction[0]*d[1]-direction[1]*d[0])>.001||direction[0]*d[0]+direction[1]*d[1]<.999)bad.push('inset not positively parallel to actual next edge');
        const transform=shaft.getScreenCTM(),screenA=new DOMPoint(...a).matrixTransform(transform),screenB=new DOMPoint(...b).matrixTransform(transform);
        if(Math.abs(Math.hypot(screenB.x-screenA.x,screenB.y-screenA.y)-40)>.02)bad.push('shaft below40 CSS px');
        const arrowPoints=inset.querySelector('[data-polygon-direction-arrow]').getAttribute('d').match(/-?\\d+(?:\\.\\d+)?/g).map(Number);
        for(const [index,along,across] of [[0,8,8],[1,20,0],[2,8,-8]])if(!close(arrowPoints.slice(index*2,index*2+2),[32+along*d[0]+across*q[0],32+along*d[1]+across*q[1]]))bad.push('enlarged arrow');
        const wrapper=inset.parentElement;
        if(!wrapper.previousElementSibling?.classList.contains('ca-polygon-counter')||!wrapper.nextElementSibling?.classList.contains('ca-polygon-figure'))bad.push('inset outside counter/figure flow');
        const label=wrapper.querySelector('span');if(label?.textContent!=='Next side direction (enlarged)'||parseFloat(getComputedStyle(label).fontSize)<15.9)bad.push('inset label');
      }
      return bad;
    }''',n)
    h.ok(not result,'actual walker/reference SVG coordinates keep turn visible: '+str(result))


def poly_scene(p,n,view):
    svg_access(p);bounds(p)
    h.ok(p.locator('[data-polygon-direction-inset]').count()==int(view=='walk'),'enlarged direction appears only in Walk')
    h.ok(p.locator(R+' svg[viewBox="0 0 640 560"]').count()==1,'one accessible current polygon stage')
    text=p.locator(R).inner_text()
    h.ok('A polygon is a closed shape' in text and 'Regular means all sides equal and all corners equal.' in text,'polygon definitions visible')
    h.ok(re.search(r'A is corner \d+ of '+str(n)+r'\.',text) is not None,'chosen corner has explicit current index')
    if view=='walk':
        poly_walk_geometry(p,n)
        h.ok(re.search(r'Current corner \d+ of '+str(n),text) is not None,'walker current corner explicit')
        h.ok(p.locator('.ca-point-label').count()==0,'walking reference has no opaque point label')
    h.ok('Separate worked example' not in text and 'a = ' not in text,'old triangle settings/worked example omitted from polygon region')


def poly_native_identity(p,before):
    control=p.locator('select'+sel('poly-sides'));original=control.element_handle()
    value=control.input_value();html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length')
    control.select_option(value)
    h.ok(original.evaluate('e=>e.isConnected&&e===document.querySelector("select[data-crossing-angles-action=poly-sides]")') and p.locator(R).inner_html()==html,'same sides identity does not render/reset local split/walk')
    control.evaluate('e=>{const o=document.createElement("option");o.value="99";e.append(o);e.value="99";e.dispatchEvent(new Event("change",{bubbles:true}));o.remove()}')
    h.ok(control.input_value()==value and p.locator(R).inner_html()==html,'refused polygon select restores its actual value without render')
    h.ok(p.evaluate('__sharedSpoken.length')==spoken,'same/refused polygon native selection has no speech');h.unchanged(p,before,'same/refused polygon sides')


def polygon_journey(browser,base):
    print('Polygon Frames: one complete tablet visit, independent channels and actual Notes exports',flush=True)
    p=setup(browser,base);exported=h.notes(p,'polygon-notes-before')
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    parent(p,'width-more');parent(p,'height-less');source=frame(p)
    dims=p.locator('[data-cframe-copy]').evaluate('e=>[Number(e.getAttribute("width"))/22,Number(e.getAttribute("height"))/22]')
    before=h.snapshot(p);enter(p,before);act(p,'page','triangle',before)
    act(p,'tri-a',90,before);act(p,'tri-b',45,before);act(p,'tri-size','small',before);act(p,'tri-prompt',4,before)
    tri_step(p,'gather',2,before);tri_step(p,'reason',1,before);act(p,'tri-view','polygons',before)
    for n in [3,5,7,11,12]:
        act(p,'poly-sides',n,before);h.focus(p,'select'+sel('poly-sides'),'side selector focus survives reset')
        h.ok('A is corner 1 of '+str(n)+'.' in p.locator(R).inner_text(),'changed side count resets only free chosen corner')
        poly_step(p,'split',0,n,before);poly_scene(p,n,'split');capture(p,'polygon-tablet-n'+str(n)+'-split-start')
        if n==3:
            h.ok('already one triangle' in p.locator(R).inner_text(),'explicit triangle base case');h.focus(p,sel('poly-view','split'),'n3 disabled draw controls do not steal view focus')
        else:
            poly_step(p,'split',1,n,before)
            h.ok('1 completed triangle' in p.locator(R).inner_text(),'first diagonal has one completed triangle')
            poly_step(p,'split',0,n,before);poly_step(p,'split',n-3,n,before)
        h.ok('All corners together: '+str((n-2)*180)+'°' in p.locator(R).inner_text(),'independent polygon total from full fan')
        poly_native_identity(p,before);capture(p,'polygon-tablet-n'+str(n)+'-split-complete')
        act(p,'poly-corner',1,before);h.focus(p,sel('poly-corner',2),'chosen-corner action focuses current enabled control')
        h.ok('A is corner 2 of '+str(n)+'.' in p.locator(R).inner_text(),'alternate chosen corner indexed')
        poly_step(p,'split',n-3,n,before)
        act(p,'poly-view','corner',before);poly_scene(p,n,'corner')
        if n in [7,11]:
            h.ok(str((n-2)*180)+'°÷'+str(n) in p.locator(R).inner_text(),'exact fractional regular corner expression')
            hear(p,before,includes=[str((n-2)*180)+'° divided by '+str(n)],excludes=['128.57','147.27'])
        else:hear(p,before,includes=['Polygon frames','A total is different from one corner.'])
        capture(p,'polygon-tablet-n'+str(n)+'-corner-regular')
        act(p,'poly-kind','stretched',before);poly_scene(p,n,'corner')
        hear(p,before,includes=['finds an average'],excludes=['This regular frame has']);capture(p,'polygon-tablet-n'+str(n)+'-corner-stretched')
        act(p,'poly-size','small',before);act(p,'poly-size','large',before)
        poly_step(p,'walk',0,n,before);poly_scene(p,n,'walk');hear(p,before,includes=['No turns counted yet.']);capture(p,'polygon-tablet-n'+str(n)+'-walk-start')
        poly_step(p,'walk',1,n,before);poly_scene(p,n,'walk');hear(p,before,includes=['outside turn','e3']);capture(p,'polygon-tablet-n'+str(n)+'-walk-partial')
        poly_step(p,'walk',n,n,before);poly_scene(p,n,'walk');hear(p,before,includes=['one full 360° turn','same final direction']);capture(p,'polygon-tablet-n'+str(n)+'-walk-complete')
        poly_step(p,'walk',n-1,n,before);act(p,'poly-kind','regular',before);poly_step(p,'walk',n,n,before)
        if n in [7,11]:h.ok('360°÷'+str(n) in p.locator(R).inner_text(),'fractional turn division only after full lap')
        act(p,'poly-view','split',before)
        h.ok(str(n-3)+' of '+str(n-3)+' diagonal' in p.locator(R).inner_text(),'view and geometry changes retain completed split')
    for prompt in range(6):act(p,'poly-prompt',prompt,before);hear(p,before,includes=['Polygon frames'])
    act(p,'tri-mode','panel',before);h.focus(p,sel('tri-mode','panel'),'polygon mode focus before Hear')
    h.ok(all(p.locator(sel(a)).count()==0 for a in ['poly-sides','poly-kind','poly-size']),'panel omits all free shape settings')
    h.ok('Copied width '+str(dims[0])+' × height '+str(dims[1]) in p.locator(R).inner_text(),'polygon uses actual copied rectangle dimensions')
    poly_step(p,'split',1,4,before);capture(p,'polygon-tablet-panel-split')
    act(p,'poly-corner',1,before);poly_step(p,'split',1,4,before);poly_step(p,'walk',2,4,before)
    act(p,'poly-view','corner',before);poly_scene(p,4,'corner');hear(p,before,includes=['irregular but has equal angles','90°']);capture(p,'polygon-tablet-panel-corner')
    act(p,'tri-mode','free',before)
    h.ok(p.locator('select'+sel('poly-sides')).input_value()=='12' and 'A is corner 2 of 12.' in p.locator(R).inner_text(),'panel actions preserve independent free channel')
    poly_step(p,'walk',12,12,before)
    act(p,'tri-mode','panel',before)
    h.ok('2 of 4 turns' in p.locator(R).inner_text() and 'A is corner 2 of 4.' in p.locator(R).inner_text(),'free roundtrip retains panel chosen corner/walk')
    poly_step(p,'walk',4,4,before);hear(p,before,includes=['Each turn: 90°']);capture(p,'polygon-tablet-panel-walk')
    back(p,before);h.ok(frame(p)==source,'polygon Back preserves exact parent')
    parent(p,'width-more');changed=frame(p);dims[0]+=1;enter(p,before)
    h.ok('Copied width '+str(dims[0])+' × height '+str(dims[1]) in p.locator(R).inner_text() and '4 of 4 turns' in p.locator(R).inner_text(),'source recapture changes actual copy and retains panel work')
    act(p,'tri-mode','free',before);act(p,'tri-view','gather',before)
    h.ok([p.locator('select'+sel(a)).input_value() for a in ['tri-a','tri-b','tri-size','tri-prompt']]==['90','45','small','4'] and 'Move 2 of' in p.locator(R).inner_text(),'polygon visit retains original triangle choices and gather')
    act(p,'tri-view','reason',before);h.ok('Reason 1 of' in p.locator(R).inner_text(),'polygon visit retains independent original proof')
    back(p,before);h.ok(frame(p)==changed,'recaptured source remains exact');h.unchanged(p,before,'complete polygon visit')
    after=h.notes(p,'polygon-notes-after')
    h.ok({k:v for k,v in after.items() if k!='exportedAt'}=={k:v for k,v in exported.items() if k!='exportedAt'},'actual Notes exports unchanged across complete polygon visit')
    p.context.close()


def polygon_focused(browser,base):
    print('Polygon Frames: focused phone/tablet fan, fractions, thin panels and original resized controls',flush=True)
    p=setup(browser,base);before=h.snapshot(p);enter(p,before);poly_open(p,before)
    for step in [0,5]:
        poly_step(p,'walk',step,5,before)
        for width in [320,820]:
            p.set_viewport_size({'width':width,'height':1000});poly_scene(p,5,'walk');capture(p,'polygon-default-direction-'+str(step)+'-'+str(width))
    for n,view,target,kind in [(12,'split',9,'regular'),(3,'split',0,'regular'),(7,'corner',0,'regular'),(11,'walk',11,'regular'),(7,'corner',0,'stretched'),(12,'walk',1,'stretched')]:
        act(p,'poly-sides',n,before);act(p,'poly-kind',kind,before)
        if view=='corner':act(p,'poly-view',view,before)
        else:poly_step(p,view,target,n,before)
        for width in [320,820]:
            p.set_viewport_size({'width':width,'height':1000});poly_scene(p,n,view);capture(p,'polygon-risk-'+str(n)+'-'+kind+'-'+view+'-'+str(width))
    act(p,'poly-sides',12,before);poly_step(p,'split',0,12,before)
    for action,value in [('poly-draw',1),('rotation',None),('poly-corner',1)]:
        original=p.locator(sel(action,value)).element_handle()
        for width in [320,820]:
            p.set_viewport_size({'width':width,'height':1000});p.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');bounds(p)
            h.ok(original.evaluate('e=>e.isConnected'),'live resize retains original polygon control');h.unchanged(p,before,'polygon live resize')
        html=p.locator(R).inner_html();original.click();h.ok(p.locator(R).inner_html()!=html,'original polygon control still acts after820/320/820');h.unchanged(p,before,'original polygon control')
    back(p,before)
    for w,t,rotation in [(1,12,90),(12,1,180),(1,1,270)]:
        for side,target in [('width',w),('height',t)]:
            while not p.locator('[data-cframe-action="'+side+'-less"]').is_disabled():parent(p,side+'-less')
            for _ in range(target-1):parent(p,side+'-more')
        enter(p,before);act(p,'tri-mode','panel',before)
        while int(re.search(r'Picture orientation: (\d+)°',p.locator(R).inner_text()).group(1))!=rotation:act(p,'rotation',before=before)
        for view,step in [('split',1),('corner',0),('walk',0),('walk',1),('walk',4)]:
            if view=='corner':act(p,'poly-view',view,before)
            else:poly_step(p,view,step,4,before)
            for width in [320,820]:
                p.set_viewport_size({'width':width,'height':1000});poly_scene(p,4,view)
                h.ok('Copied width '+str(w)+' × height '+str(t) in p.locator(R).inner_text(),'thin/square actual copied source')
                capture(p,'polygon-panel-'+str(w)+'-'+str(t)+'-'+view+'-'+str(step)+'-'+str(width))
        hear(p,before);back(p,before)
    p.context.close()


def polygon_guards(browser,base):
    print('Polygon Frames: retired new/old controls and Hear inert before effects',flush=True)
    for mode in ['detached','hidden','ancestor','reparented']:
        p=setup(browser,base);enter(p);act(p,'page','triangle')
        old=[p.locator('select'+sel('tri-a')).element_handle(),p.locator(R+' [data-speak]').element_handle()]
        act(p,'tri-view','polygons')
        handles=[p.locator('select'+sel(a)).element_handle() for a in ['poly-sides','poly-kind','poly-size','poly-prompt']]
        for e,value in zip(handles,['7','stretched','small','1']):e.evaluate('(e,value)=>e.value=value',value)
        handles += [p.locator(sel(a,v)).element_handle() for a,v in [('poly-view','walk'),('poly-corner',1),('poly-draw',1),('tri-mode','panel')]]
        handles += [p.locator(R+' [data-speak]').element_handle()]
        for e in handles:retire(e,mode)
        before=h.snapshot(p);html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length')
        for e in old+handles:h.dispatch(e,'change' if e.evaluate('e=>e.tagName')=='SELECT' else 'click')
        h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==spoken,'retired polygon '+mode+' and old triangle controls cannot render or speak');h.unchanged(p,before,'retired polygon '+mode)
        p.context.close()
    # A current walker and Hear must reject a changed exact route before hashchange.
    p=setup(browser,base);enter(p);poly_open(p,None);act(p,'poly-view','walk')
    controls=[p.locator(sel('poly-walk',1)).element_handle(),p.locator(R+' [data-speak]').element_handle()]
    before=h.snapshot(p);html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length')
    p.evaluate('history.replaceState(null,"","#workshop/copy-frame/")')
    for e in controls:h.dispatch(e)
    h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==spoken,'new walk and Hear guard exact route before render/speech');h.unchanged(p,before,'polygon changed route');p.context.close()


def match_stage(p, target, before):
    act(p,'match-view','build',before)
    for _ in range(3):
        previous=p.locator('[data-crossing-angles-match-step=previous]')
        if previous.is_disabled():current=0
        elif p.locator('[data-crossing-angles-match-step=next]').is_disabled():current=2
        else:current=1
        if current==target:break
        value=current+(1 if target>current else -1)
        act(p,'match-step',value,before)
        if value in [0,2]:h.focus(p,'[data-crossing-angles-match-step='+('next' if value==0 else 'previous')+']','stage endpoint focus remains enabled')
    h.ok(p.locator(sel('match-step',-1 if target==0 else 3)).is_disabled() if target in [0,2] else True,'construction bounds disabled')


def match_scene(p):
    bounds(p);svg_access(p)
    h.ok(p.locator('[data-crossing-angles-matching-stage]').count()==1,'one actual matching stage')
    h.ok(p.locator('#crossing-angles-title').inner_text()=='Matching triangles','matching-specific heading')
    h.ok('AOB + BOC' not in p.locator(R).inner_text(),'no old crossing arithmetic on matching page')


def matching_journey(browser,base):
    print('Matching Triangles: complete actual-app visit, source retention and Notes exports',flush=True)
    p=setup(browser,base);exported=h.notes(p,'matching-notes-before')
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);parent(p,'width-more');source=frame(p)
    before=h.snapshot(p);enter(p,before);act(p,'page','learn',before);act(p,'card',3,before)
    act(p,'page','matching',before);h.focus(p,sel('page','matching'),'matching navigation focus before Hear')
    for case in ['sss','sas','asa','aas','rhs','ssa','aaa']:
        act(p,'match-view','build',before);act(p,'match-case',case,before)
        for step in [0,1,2]:
            match_stage(p,step,before);match_scene(p)
            if step==1 and case=='aas':
                h.ok('180' in p.locator(R).inner_text() and '60' in p.locator(R).inner_text(),'AAS derives missing angle before final ray')
            if step==1 and case=='ssa':h.ok(p.locator('[data-matching-meeting]').count()==2,'both SSA closures visible at once')
            capture(p,'matching-'+case+'-build-'+str(step))
        act(p,'match-view','fit',before);act(p,'match-fit','explore',before);match_scene(p)
        act(p,'match-home',before=before)
        act(p,'match-rotation',before=before);act(p,'match-flip',before=before)
        for move in [1,2,3,4]:act(p,'match-move',move,before)
        h.focus(p,'[data-crossing-angles-match-slide=previous]','slide endpoint focuses enabled opposite')
        manual=p.locator('[data-matching-outline=candidate]').get_attribute('points')
        act(p,'match-fit','given',before);h.ok(p.locator(sel('match-rotation')).count()==0,'provided pose hides manual controls')
        match_scene(p);capture(p,'matching-'+case+'-given')
        act(p,'match-fit','explore',before)
        h.ok(p.locator('[data-matching-outline=candidate]').get_attribute('points')==manual,'provided comparison retains manual pose')
        act(p,'match-fit','given',before)
        for variant in range(1,4 if case in ['ssa','aaa'] else 2):
            act(p,'match-variant',before=before);match_scene(p)
            capture(p,'matching-'+case+'-given-variant'+str(variant))
        act(p,'match-view','letters',before)
        for pair in [1,2,0]:act(p,'match-pair',before=before);match_scene(p)
        hear(p,before,includes=['Matching triangles'],excludes=['Original panel','AOB'])
        capture(p,'matching-'+case+'-letters')
    # Stop the previously requested voice through a normal view change before
    # measuring no-render identity; stopping playback legitimately updates its UI.
    act(p,'match-view','build',before)
    # A refused nested select must restore the shown value without rendering.
    control=p.locator('select'+sel('match-case'));value=control.input_value();original=control.element_handle();html=p.locator(R).inner_html()
    control.select_option(value)
    h.ok(original.evaluate('e=>e.isConnected'),'same matching case preserves bound controls')
    control.evaluate('e=>{const o=document.createElement("option");o.value="invalid";e.append(o);e.value="invalid";e.dispatchEvent(new Event("change",{bubbles:true}));o.remove()}')
    h.ok(control.input_value()==value and p.locator(R).inner_html()==html,'invalid nested select restores value without render')
    for prompt in range(6):act(p,'match-prompt',prompt,before)
    act(p,'match-mode','panel',before)
    h.ok(p.locator(sel('match-case')).count()==0 and p.locator(sel('match-variant')).count()==0,'rectangle omits free case and variant')
    for step in [0,1,2]:match_stage(p,step,before);match_scene(p);capture(p,'matching-panel-build-'+str(step))
    act(p,'match-view','fit',before);act(p,'match-fit','given',before);match_scene(p)
    panel=p.locator('[data-matching-outline=reference]').get_attribute('points')
    act(p,'match-view','letters',before);act(p,'match-pair',before=before);hear(p,before,includes=['Matching triangles'])
    back(p,before);h.ok(frame(p)==source,'matching Back preserves actual waiting design')
    parent(p,'height-more');changed=frame(p);enter(p,before)
    act(p,'match-view','fit',before)
    h.ok(p.locator('[data-matching-outline=reference]').get_attribute('points')!=panel,'explicit re-entry recaptures changed copy dimensions')
    act(p,'match-mode','parts',before)
    h.ok(p.locator('select'+sel('match-case')).input_value()=='aaa' and p.locator('select'+sel('match-prompt')).input_value()=='5','panel visit retains free case and shared prompt')
    back(p,before);h.ok(frame(p)==changed,'changed parent retained on final Back');h.unchanged(p,before,'complete matching visit')
    after=h.notes(p,'matching-notes-after')
    h.ok({k:v for k,v in after.items() if k!='exportedAt'}=={k:v for k,v in exported.items() if k!='exportedAt'},'actual Notes exports unchanged across matching visit')
    p.context.close()


def matching_focused(browser,base):
    print('Matching Triangles: phone/tablet lower guides, overlap, thin panels and retained resized controls',flush=True)
    p=setup(browser,base);before=h.snapshot(p);enter(p,before);act(p,'page','matching',before)
    for case,variants in [('sas',2),('asa',2),('aas',2),('ssa',4),('aaa',4)]:
        act(p,'match-view','build',before);act(p,'match-case',case,before)
        for _ in range(variants-1):act(p,'match-variant',before=before)
        for step in [1,2]:
            match_stage(p,step,before)
            for width in [320,820]:
                p.set_viewport_size({'width':width,'height':1000});match_scene(p);capture(p,'matching-risk-'+case+'-'+str(step)+'-'+str(width))
        act(p,'match-view','fit',before);act(p,'match-fit','given',before)
        for width in [320,820]:
            p.set_viewport_size({'width':width,'height':1000});match_scene(p);capture(p,'matching-risk-'+case+'-given-'+str(width))
    act(p,'match-fit','explore',before);original=p.locator(sel('match-rotation')).element_handle()
    for width in [320,820]:
        p.set_viewport_size({'width':width,'height':1000});p.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');bounds(p)
        h.ok(original.evaluate('e=>e.isConnected'),'resize preserves original matching control')
    html=p.locator(R).inner_html();original.click();h.ok(p.locator(R).inner_html()!=html,'original matching control works after resizing');h.unchanged(p,before,'matching live resize')
    back(p,before)
    for w,t in [(1,12),(12,1),(1,1)]:
        for side,target in [('width',w),('height',t)]:
            while not p.locator('[data-cframe-action="'+side+'-less"]').is_disabled():parent(p,side+'-less')
            for _ in range(target-1):parent(p,side+'-more')
        enter(p,before);act(p,'match-mode','panel',before)
        for view in ['build','fit','letters']:
            act(p,'match-view',view,before)
            if view=='build':match_stage(p,2,before)
            elif view=='fit':act(p,'match-fit','given',before)
            for width in [320,820]:
                p.set_viewport_size({'width':width,'height':1000});match_scene(p);capture(p,'matching-panel-'+str(w)+'-'+str(t)+'-'+view+'-'+str(width))
        back(p,before)
    p.context.close()


def matching_guards(browser,base):
    print('Matching Triangles: retired actions and Hear inert before effects',flush=True)
    for mode in ['detached','hidden','ancestor','reparented']:
        p=setup(browser,base);enter(p);old=[p.locator(sel('rotation')).element_handle(),p.locator(R+' [data-speak]').element_handle()]
        act(p,'page','matching')
        handles=[p.locator('select'+sel(a)).element_handle() for a in ['match-case','match-prompt']]
        handles[0].evaluate('e=>e.value="ssa"');handles[1].evaluate('e=>e.value="5"')
        handles += [p.locator(sel(a,v)).element_handle() for a,v in [('match-mode','panel'),('match-view','fit'),('match-variant',None),('match-step',1)]]
        handles += [p.locator(R+' [data-speak]').element_handle()]
        for e in handles:retire(e,mode)
        before=h.snapshot(p);html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length')
        for e in old+handles:h.dispatch(e,'change' if e.evaluate('e=>e.tagName')=='SELECT' else 'click')
        h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==spoken,'retired matching '+mode+' cannot render or speak');h.unchanged(p,before,'retired matching '+mode);p.context.close()
    p=setup(browser,base);enter(p);act(p,'page','matching');act(p,'match-view','fit')
    controls=[p.locator(sel('match-rotation')).element_handle(),p.locator(R+' [data-speak]').element_handle()]
    before=h.snapshot(p);html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length')
    p.evaluate('history.replaceState(null,"","#workshop/copy-frame/")')
    for e in controls:h.dispatch(e)
    h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==spoken,'matching current route guard rejects effects before hashchange');h.unchanged(p,before,'matching changed route');p.context.close()


CHASE_CASES=[([137,137],['line','opposite']),([112,112],['line','opposite']),([63,63],['line','opposite']),([120,60,45],['point','line','parts']),([125,55,60],['point','line','parts']),([95,85,40],['point','line','parts']),([75,105],['triangle','line']),([77,103],['triangle','line']),([67,113],['triangle','line']),([35,35,145],['corresponding','opposite','line']),([52,52,128],['corresponding','opposite','line']),([68,68,112],['corresponding','opposite','line']),([65,25,65],['corner','triangle','corner']),([53,37,53],['corner','triangle','corner']),([32,58,32],['corner','triangle','corner'])]
CH='[data-crossing-angles-chase-region]'
CI='#crossing-angles-chase-answer'


def chase_entry(p,value,before):
    act(p,'chase-clear',before=before)
    for digit in str(value):act(p,'chase-digit',digit,before)
    h.ok(p.locator(CI).input_value()==str(value),'number pad retains exact draft '+str(value))


def chase_target(p,name):
    return p.locator('button[data-crossing-angles-chase-target="'+name+'"]')


def chase_feedback(p):return p.locator('.ca-chase-feedback').inner_text()


def chase_label_clearance(p):
    issues=p.locator('[data-crossing-angles-chase-stage]').evaluate("""plot=>{
      const svg=plot.querySelector('svg'),matrix=svg.getScreenCTM(),bad=[];
      const arcs=[...svg.querySelectorAll('[data-chase-sector]')].map(arc=>({name:arc.dataset.chaseSector,points:Array.from({length:65},(_,i)=>{const q=arc.getPointAtLength(arc.getTotalLength()*i/64);return new DOMPoint(q.x,q.y).matrixTransform(matrix)})}));
      for(const label of plot.querySelectorAll('.ca-point-label')){
        const b=label.getBoundingClientRect(),contains=p=>p.x>=b.left-.3&&p.x<=b.right+.3&&p.y>=b.top-.3&&p.y<=b.bottom+.3;
        const leader=svg.querySelector('[data-ca-leader="'+label.dataset.caLabel+'"]'),vertex=new DOMPoint(Number(leader.getAttribute('x1')),Number(leader.getAttribute('y1'))).matrixTransform(matrix);
        if(contains(vertex))bad.push(label.textContent+' covers own vertex');
        for(const arc of arcs)if(arc.points.some(contains))bad.push(label.textContent+' covers arc '+arc.name);
      }
      return bad;
    }""")
    h.ok(not issues,'measured point-name boxes clear actual vertices and sampled angle arcs: '+str(issues))


def chase_scene(p,family):
    bounds(p);svg_access(p)
    h.ok(p.locator('#crossing-angles-title').inner_text()=='Angle Chase','Chase has its own heading')
    chase_label_clearance(p)
    issue=p.locator('[data-chase-diagram]').evaluate('''(wrap,family)=>{
      const plot=wrap.querySelector('[data-crossing-angles-chase-stage]'),svg=plot.querySelector('svg'),band=wrap.querySelector('.ca-chase-target-band'),overlay=wrap.querySelector('[data-chase-connectors]'),pb=plot.getBoundingClientRect(),bb=band.getBoundingClientRect(),bad=[];
      if(Math.abs(bb.height-76)>.2||bb.top<pb.bottom-.5)bad.push('band not below plot');
      if(getComputedStyle(overlay).pointerEvents!=='none')bad.push('connector intercepts taps');
      const point=(node,a,b)=>[Number(node.getAttribute(a)),Number(node.getAttribute(b))];
      for(const target of band.querySelectorAll('[data-crossing-angles-chase-target]')){
        const name=target.dataset.crossingAnglesChaseTarget,b=target.getBoundingClientRect();
        if(Math.abs(b.width-60)>.2||Math.abs(b.height-68)>.2||b.top<pb.bottom+3.5||b.left<pb.left-.5||b.right>pb.right+.5)bad.push('target box '+name);
        for(const child of target.querySelectorAll('span')){const r=child.getBoundingClientRect();if(r.left<b.left-.5||r.right>b.right+.5||r.top<b.top-.5||r.bottom>b.bottom+.5||child.scrollWidth>child.clientWidth+1)bad.push('target text '+name);}
        const vertex=family==='triangle'?'B':family==='parallel'?'Q':family==='rectangle'?(name==='x'?'A':'C'):'O';
        const label=plot.querySelector('[data-crossing-angles-label="'+vertex+'"]'),leader=svg.querySelector('[data-ca-leader="'+label.dataset.caLabel+'"]'),center=point(leader,'x1','y1');
        const arc=svg.querySelector('[data-chase-sector="'+name+'"]'),middle=arc.getPointAtLength(arc.getTotalLength()/2),dx=middle.x-center[0],dy=middle.y-center[1],len=Math.hypot(dx,dy),raw=[center[0]+40*dx/len,center[1]+40*dy/len];
        const expected=new DOMPoint(...raw).matrixTransform(svg.getScreenCTM()),line=overlay.querySelector('[data-chase-connector="'+name+'"]'),start=new DOMPoint(...point(line,'x1','y1')).matrixTransform(overlay.getScreenCTM()),end=new DOMPoint(...point(line,'x2','y2')).matrixTransform(overlay.getScreenCTM());
        if(Math.hypot(start.x-expected.x,start.y-expected.y)>.7)bad.push('connector not actual sector '+name);
        if(Math.hypot(end.x-b.left-b.width/2,end.y-b.top-b.height/2)>.7)bad.push('connector not actual native target '+name);
      }
      return bad;
    }''',family)
    h.ok(not issue,'actual plot, below-plot band and independently reconstructed sector connectors: '+str(issue))


def chase_example(p,case,before):
    value=p.locator(CI).input_value();reason=p.locator(sel('chase-reason')+'[aria-pressed=true]').get_attribute('data-crossing-angles-value') if p.locator(sel('chase-reason')+'[aria-pressed=true]').count() else None
    act(p,'chase-example',before=before)
    endpoint='previous' if p.locator('[data-chase-example-nav=next]').is_disabled() else 'next'
    h.focus(p,'[data-chase-example-nav='+endpoint+']','opening an unfinished or completed example keeps enabled focus')
    h.ok(p.locator('.ca-chase-example').count()==1 and p.locator(CI).count()==0 and p.locator(sel('chase-check')).count()==0,'example is a separate view without answer controls')
    # Example progress belongs to this sketch; walk back before revealing it.
    while not p.locator('[data-chase-example-nav=previous]').is_disabled():p.locator('[data-chase-example-nav=previous]').click();h.unchanged(p,before,'example previous')
    h.ok('givens only' in p.locator('.ca-chase-counter').inner_text(),'example starts with givens only')
    h.ok(all('°' not in t for t in p.locator('.ca-chase-target-band [data-crossing-angles-chase-target]').all_inner_texts()),'example zero has no target values')
    n=len(CHASE_CASES[case][0]);expected=[[130,130],[118,62,48],[76,104],[40,40,140],[60,30,60]][case//3]
    for step in range(1,n+1):
        act(p,'chase-example-step',step,before)
        if step==n:h.focus(p,'[data-chase-example-nav=previous]','last example step keeps enabled focus')
        shown=p.locator('.ca-chase-target-band [data-crossing-angles-chase-target]').all_inner_texts()
        h.ok(all((str(expected[i])+'°' in shown[i])==(i<step) for i in range(n)),'example reveals only its own completed steps')
    hear(p,before,includes=['A different worked sketch'],excludes=['Your answer:'])
    chase_scene(p,['crossing','hub','triangle','parallel','rectangle'][case//3]);capture(p,'chase-example-'+str(case//3))
    act(p,'chase-return',before=before);h.focus(p,CI,'example return restores answer focus')
    h.ok(p.locator(CI).input_value()==value,'example retains exact practice draft')
    if reason:h.ok(p.locator(sel('chase-reason',reason)).get_attribute('aria-pressed')=='true','example retains chosen practice reason')


def chase_journey(browser,base):
    print('Angle Chase: all authored sketches, separate methods/support and actual Notes exports',flush=True)
    p=setup(browser,base);exported=h.notes(p,'chase-notes-before');p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    parent(p,'width-more');source=frame(p);before=h.snapshot(p);enter(p,before);act(p,'page','chase',before)
    h.focus(p,sel('page','chase'),'Chase navigation keeps focus')
    for case,(values,reasons) in enumerate(CHASE_CASES):
        act(p,'chase-case',case,before)
        for index,(value,reason) in enumerate(zip(values,reasons)):
            act(p,'chase-target',index,before);chase_entry(p,value,before);act(p,'chase-reason',reason,before);act(p,'chase-check',before=before)
            h.ok(str(value)+'°' in chase_feedback(p),'number plus accepted reason checked on own source')
            h.ok(p.locator('#crossing-angles-chase-target').input_value()==str(index),'Check never automatically advances')
            h.ok(str(value)+'°' in chase_target(p,'xyz'[index]).inner_text(),'checked numerical fact written on its own target')
        h.ok(p.locator('.ca-chase-caption').count()==1,'completed paper sketch has truthful local caption')
        if case%3==0:
            act(p,'chase-hint',before=before);h.ok(p.locator('.ca-chase-hint').count()==1,'independent optional hint visible')
            chase_example(p,case,before);chase_scene(p,['crossing','hub','triangle','parallel','rectangle'][case//3]);capture(p,'chase-family-'+str(case//3))
    # Alternate mathematically sufficient reasons are accepted on the live UI.
    for case,index,reason in [(0,1,'line'),(3,2,'line'),(6,1,'exterior'),(9,1,'alternate'),(9,2,'cointerior'),(12,1,'alternate'),(12,2,'alternate')]:
        act(p,'chase-case',case,before);act(p,'chase-target',index,before);act(p,'chase-reason',reason,before);act(p,'chase-check',before=before)
        h.ok(str(CHASE_CASES[case][0][index])+'°' in chase_feedback(p),'accepted alternate relationship '+reason)
    act(p,'chase-case',0,before);act(p,'chase-restart',before=before)
    chase_entry(p,1,before);act(p,'chase-check',before=before);h.ok('Choose a reason' in chase_feedback(p) and '137' not in chase_feedback(p),'wrong number with no reason has nonspoiling feedback')
    chase_entry(p,999,before);act(p,'chase-reason','line',before);act(p,'chase-check',before=before);h.ok('360' in chase_feedback(p) and 'fits' not in chase_feedback(p),'range check precedes reason verdict')
    act(p,'chase-restart',before=before);chase_entry(p,137,before);act(p,'chase-check',before=before)
    h.ok('number fits' in chase_feedback(p) and 'Choose a reason' in chase_feedback(p),'numerical fact and missing reason remain separate')
    act(p,'chase-reason','triangle',before);h.ok('Not checked yet' in chase_feedback(p),'editing reason clears old verdict')
    act(p,'chase-check',before=before);h.ok('number fits' in chase_feedback(p) and 'does not' in chase_feedback(p),'right number does not validate unrelated reason')
    act(p,'chase-reason','line',before);chase_entry(p,136,before);act(p,'chase-check',before=before)
    h.ok('relationship fits' in chase_feedback(p),'valid relationship with wrong number remains distinct')
    act(p,'chase-target',1,before);chase_entry(p,136,before);act(p,'chase-reason','opposite',before);act(p,'chase-check',before=before)
    h.ok('value you used for x' in chase_feedback(p),'consistent calculation from wrong predecessor gets source-value guidance')
    chase_entry(p,137,before);act(p,'chase-reason','line',before);act(p,'chase-check',before=before)
    h.ok('137°' in chase_feedback(p) and '137°' not in chase_target(p,'x').inner_text(),'later target is answerable without trusting or correcting earlier wrong draft')
    act(p,'chase-target',0,before);h.ok(p.locator(CI).input_value()=='136','later answer preserves earlier draft')
    act(p,'chase-hint',before=before);chase_example(p,0,before)
    act(p,'chase-target',1,before);h.ok('worked sketch' in p.locator('.ca-chase-help-note').inner_text().lower(),'worked example support applies across this sketch')
    act(p,'chase-case',3,before);act(p,'chase-restart',before=before);act(p,'chase-target',1,before);chase_entry(p,9,before);act(p,'chase-reason','line',before);act(p,'chase-solution',before=before)
    h.ok(p.locator(CI).input_value()=='9' and '120°' in chase_target(p,'x').inner_text() and 'shown' in chase_target(p,'x').inner_text() and '60°' in chase_target(p,'y').inner_text() and '45°' not in chase_target(p,'z').inner_text(),'shown Hub y truthfully exposes x/y without filling draft or unrelated z')
    act(p,'chase-target',0,before);h.ok(p.locator(CI).input_value()=='' and 'another solution' in p.locator('.ca-chase-help-note').inner_text(),'predecessor exposure is help, not an entered response')
    act(p,'chase-case',12,before);act(p,'chase-restart',before=before);act(p,'chase-reason','insufficient',before);act(p,'chase-check',before=before)
    h.ok('do determine x' in chase_feedback(p) and '65' not in chase_feedback(p),'blank insufficient claim gets a premise explanation')
    act(p,'chase-target',2,before);chase_entry(p,9,before);act(p,'chase-solution',before=before)
    h.ok('shown' in chase_target(p,'y').inner_text() and '25°' in chase_target(p,'y').inner_text() and '65°' in chase_target(p,'z').inner_text() and '65°' not in chase_target(p,'x').inner_text(),'rectangle solution marks only explicitly printed targets, not every inferable one')
    # Scoped physical keyboard on the readonly display; no OS keyboard required.
    act(p,'chase-case',3,before);act(p,'chase-target',2,before);p.locator(CI).focus();p.keyboard.press('Delete');h.unchanged(p,before,'keyboard clear')
    for digit in '045':p.keyboard.press(digit);h.focus(p,CI,'keyboard entry keeps readonly display focus');h.unchanged(p,before,'keyboard digit')
    old=p.locator(CI).element_handle();p.keyboard.press('1');h.ok(p.locator(CI).input_value()=='045' and old.evaluate('e=>e.isConnected'),'fourth digit is identity')
    p.keyboard.press('Backspace');h.ok(p.locator(CI).input_value()=='04','Backspace edits one digit');p.keyboard.press('5');act(p,'chase-reason','line',before);p.locator(CI).focus();p.keyboard.press('Enter')
    h.focus(p,CI,'keyboard Check keeps input focus');h.ok(p.locator(CI).input_value()=='045' and '45°' in chase_feedback(p) and '045°' not in chase_target(p,'z').inner_text(),'leading-zero draft retains text but angles use integer meaning');h.unchanged(p,before,'keyboard Check')
    hear(p,before,includes=['Angle Chase','Your answer: 045'])
    act(p,'chase-rotation',before=before) # stop the requested voice before identity comparison
    control=p.locator('#crossing-angles-chase-case');value=control.input_value();original=control.element_handle();html=p.locator(R).inner_html();control.select_option(value)
    for invalid in ['', '1e0', '1.5','99']:
        control.evaluate('(e,v)=>{const o=document.createElement("option");o.value=v;e.append(o);e.value=v;e.dispatchEvent(new Event("change",{bubbles:true}));o.remove()}',invalid)
        h.ok(control.input_value()==value and original.evaluate('e=>e.isConnected') and p.locator(R).inner_html()==html,'invalid numeric sketch token restored without render '+repr(invalid))
    act(p,'page','matching',before);act(p,'page','chase',before);h.ok(p.locator(CI).input_value()=='045','other activity page preserves Chase board')
    back(p,before);h.ok(frame(p)==source,'Chase Back preserves actual parent design');enter(p,before);h.ok(p.locator(CI).input_value()=='045','Back/re-entry retains all held Chase work');back(p,before)
    after=h.notes(p,'chase-notes-after');h.ok({k:v for k,v in after.items() if k!='exportedAt'}=={k:v for k,v in exported.items() if k!='exportedAt'},'actual Notes exports unchanged across complete Chase visit');p.context.close()


def chase_focused(browser,base):
    print('Angle Chase: actual target actions, phone rotation clearance and measured connector layout',flush=True)
    p=setup(browser,base);before=h.snapshot(p);enter(p,before);act(p,'page','chase',before)
    for case,family in [(0,'crossing'),(3,'hub'),(6,'triangle'),(9,'parallel'),(12,'rectangle')]:
        act(p,'chase-case',case,before)
        y=chase_target(p,'y').element_handle();y.click();h.ok(p.locator('#crossing-angles-chase-target').input_value()=='1','initial native angle button actually acts after layout');h.unchanged(p,before,'initial target button')
        original=chase_target(p,'x').element_handle()
        for width in [320,820]:
            p.set_viewport_size({'width':width,'height':1000});p.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');chase_scene(p,family)
            h.ok(original.evaluate('e=>e.isConnected'),'resize retains original native target')
        original.click();h.ok(p.locator('#crossing-angles-chase-target').input_value()=='0','original native target acts after 820/320/820');h.unchanged(p,before,'resized target button')
        if case==0:
            chase_entry(p,137,before);act(p,'chase-reason','line',before);act(p,'chase-check',before=before)
        elif case in [3,12]:
            act(p,'chase-target',1 if case==3 else 2,before);act(p,'chase-solution',before=before)
        chase_scene(p,family);capture(p,'chase-tablet-'+family)
        p.set_viewport_size({'width':320,'height':1000})
        for rotation in range(0,360,30):
            chase_scene(p,family)
            if rotation in [0,180,330]:capture(p,'chase-phone-'+family+'-'+str(rotation))
            act(p,'chase-rotation',before=before)
        p.set_viewport_size({'width':820,'height':1000})
    for case in range(15):
        act(p,'chase-case',case,before)
        for width in [320,820]:
            p.set_viewport_size({'width':width,'height':1000})
            for _ in range(12):
                chase_scene(p,['crossing','hub','triangle','parallel','rectangle'][case//3]);act(p,'chase-rotation',before=before)
    act(p,'chase-case',3,before);act(p,'chase-example',before=before)
    for step in [1,2,3]:act(p,'chase-example-step',step,before)
    for width in [320,820]:p.set_viewport_size({'width':width,'height':1000});chase_scene(p,'hub');capture(p,'chase-example-hub-'+str(width))
    h.unchanged(p,before,'focused Chase layouts');p.context.close()


def chase_guards(browser,base):
    print('Angle Chase: retired clicks/selects/readonly keyboard and Hear inert before all effects',flush=True)
    for mode in ['detached','hidden','ancestor','reparented']:
        p=setup(browser,base);enter(p);old=[p.locator(sel('rotation')).element_handle(),p.locator(R+' [data-speak]').element_handle()];act(p,'page','chase')
        case=p.locator('#crossing-angles-chase-case').element_handle();target=p.locator('#crossing-angles-chase-target').element_handle();case.evaluate('e=>e.value="1"');target.evaluate('e=>e.value="1"')
        entry=p.locator(CI).element_handle();handles=[case,target,chase_target(p,'y').element_handle(),p.locator(sel('chase-digit','1')).element_handle(),p.locator(sel('chase-reason','line')).element_handle(),p.locator(sel('chase-check')).element_handle(),p.locator(sel('chase-hint')).element_handle(),p.locator(sel('chase-solution')).element_handle(),p.locator(sel('chase-example')).element_handle(),p.locator(R+' [data-speak]').element_handle(),entry]
        for e in handles:retire(e,mode)
        before=h.snapshot(p);html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length')
        for e in old+handles[:-1]:h.dispatch(e,'change' if e.evaluate('e=>e.tagName')=='SELECT' else 'click')
        entry.evaluate('e=>e.dispatchEvent(new KeyboardEvent("keydown",{key:"1",bubbles:true,cancelable:true}))')
        h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==spoken,'retired Chase '+mode+' controls/keyboard/Hear cannot render or speak');h.unchanged(p,before,'retired Chase '+mode);p.context.close()
    p=setup(browser,base);enter(p);act(p,'page','chase');entry=p.locator(CI).element_handle();controls=[chase_target(p,'y').element_handle(),p.locator(sel('chase-digit','1')).element_handle(),p.locator(R+' [data-speak]').element_handle()]
    before=h.snapshot(p);html=p.locator(R).inner_html();spoken=p.evaluate('__sharedSpoken.length');p.evaluate('history.replaceState(null,"","#workshop/copy-frame/")')
    entry.evaluate('e=>e.dispatchEvent(new KeyboardEvent("keydown",{key:"1",bubbles:true,cancelable:true}))')
    for e in controls:h.dispatch(e)
    h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==spoken,'Chase controls and readonly keyboard reject changed exact route before hashchange');h.unchanged(p,before,'Chase exact route');p.context.close()


def chase_dirty(p,before):
    act(p,'page','chase',before);act(p,'chase-case',0,before);chase_entry(p,1,before);act(p,'chase-reason','line',before);act(p,'chase-check',before=before);act(p,'chase-hint',before=before);act(p,'chase-rotation',before=before)
    act(p,'chase-case',3,before);act(p,'chase-target',1,before);act(p,'chase-solution',before=before)
    act(p,'chase-case',12,before);act(p,'chase-target',2,before);act(p,'chase-solution',before=before)
    act(p,'chase-case',14,before);act(p,'chase-target',2,before);chase_entry(p,32,before);act(p,'chase-reason','corner',before);act(p,'chase-check',before=before);act(p,'chase-example',before=before);act(p,'chase-example-step',1,before)


def chase_reset(p,before):
    act(p,'page','chase',before)
    h.ok(p.locator('#crossing-angles-chase-case').input_value()=='0','fresh visit resets selected Chase case and solve view')
    for case in [0,3,12,14]:
        act(p,'chase-case',case,before)
        h.ok(p.locator('#crossing-angles-chase-target').input_value()=='0' and p.locator(CI).input_value()=='' and p.locator(sel('chase-reason')+'[aria-pressed=true]').count()==0,'clearing resets cached Chase answer/target/reason '+str(case))
        h.ok('Not checked yet' in chase_feedback(p) and p.locator('.ca-chase-hint,.ca-chase-solution,.ca-chase-help-note').count()==0,'clearing resets feedback and explicit/derived help '+str(case))
        h.ok(p.locator(sel('chase-rotation')).get_attribute('data-crossing-angles-value')=='30' and all('°' not in s for s in p.locator('.ca-chase-target-band [data-crossing-angles-chase-target]').all_inner_texts()),'clearing resets pose and every provided label '+str(case))
    act(p,'chase-example',before=before);h.ok('givens only' in p.locator('.ca-chase-counter').inner_text(),'clearing resets held example progress');act(p,'chase-return',before=before);act(p,'chase-case',0,before)


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
                report=journey(browser,base);guards(browser,base);lifetime(browser,base,report);phone(browser,base);voice(browser,base);two_journey(browser,base);two_focused(browser,base);two_guards(browser,base);triangle_journey(browser,base);triangle_focused(browser,base);triangle_guards(browser,base);polygon_journey(browser,base);polygon_focused(browser,base);polygon_guards(browser,base);matching_journey(browser,base);matching_focused(browser,base);matching_guards(browser,base);chase_journey(browser,base);chase_focused(browser,base);chase_guards(browser,base)
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
