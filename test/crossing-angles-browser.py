"""Crossing Angles415 in the actual application, with invented notebooks only.

One complete tablet visit and focused phone/label/lifetime probes. The sole app
instrumentation exposes a read-only getter at its real initialization marker.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, importlib.util, json, os, re, tempfile, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('CROSSING_ANGLES_ARTIFACTS') or tempfile.mkdtemp(prefix='lg415-native-'))
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
    target = p.locator(('select' if action in ['angle','prompt','card'] else '')+sel(action, None if action in ['angle','prompt','card','rotation'] else value))
    if action in ['angle','prompt','card']:
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
    enter(p);h.ok(p.locator('select'+sel('angle')).input_value()=='60','fresh visit starts default local work')


def lifetime(browser, base, report):
    print('Crossing Angles: exact route, chooser, owner, import and reset lifetime',flush=True)
    p=setup(browser,base);enter(p);act(p,'angle',135)
    old=p.locator(sel('rotation')).element_handle();speaker=p.locator(R+' [data-speak]').element_handle();html=p.locator(R).inner_html();n=p.evaluate('__sharedSpoken.length')
    p.evaluate('history.replaceState(null,"","#workshop/copy-frame/")');h.dispatch(old);h.dispatch(speaker)
    h.ok(p.locator(R).inner_html()==html and p.evaluate('__sharedSpoken.length')==n,'exact route rejected before hashchange')
    p.evaluate('location.hash="#workshop"');p.locator(R).wait_for(state='detached');p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);reset_state(p)
    act(p,'angle',135);p.locator('#explorer-switch').click();p.locator('#explorer-cancel').click();ready(p);reset_state(p)
    act(p,'angle',135);old=p.locator(sel('rotation')).element_handle();speaker=p.locator(R+' [data-speak]').element_handle()
    p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.evaluate('location.hash='+json.dumps(ROUTE));ready(p)
    before=h.snapshot(p);n=p.evaluate('__sharedSpoken.length');h.dispatch(old);h.dispatch(speaker);h.unchanged(p,before,'retired owner');h.ok(p.evaluate('__sharedSpoken.length')==n,'retired owner Hear');reset_state(p)
    act(p,'angle',135);p.evaluate('location.hash="#notes"');p.locator('#progress-file').set_input_files({'name':'invented-crossing-notebook.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);reset_state(p)
    act(p,'angle',135);p.evaluate('location.hash="#notes"');p.locator('#reset').click();p.locator('#confirm-reset').click()
    film=p.locator('dialog.welcome-film[open]')
    if film.count():film.locator('[data-film-skip]').click()
    p.evaluate('location.hash='+json.dumps(ROUTE));ready(p);reset_state(p)
    act(p,'angle',135);p.reload(wait_until='networkidle');ready(p);reset_state(p)
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
                report=journey(browser,base);guards(browser,base);lifetime(browser,base,report);phone(browser,base);voice(browser,base)
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
