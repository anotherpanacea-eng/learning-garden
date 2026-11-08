"""Synthetic432 native Chrome journey and bounded lifecycle/geometry probes.

Only invented notebooks; no app-module interception. Speech observation wraps the
native speak call and preserves it. No audible, Safari, physical-device or
learning qualification. Artifacts remain outside the checkout by default.
"""
import sys
sys.dont_write_bytecode = True
import functools
import http.server
import importlib.util
import json
import math
import os
from pathlib import Path
import subprocess
import tempfile
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('DEPTH_WINDOW_ARTIFACTS', tempfile.mkdtemp(prefix='depth-window-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('depth_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h
ROUTE = '#science/ice'
DEFAULT = {'level':5, 'a':4, 'b':2, 'width':'narrow'}
EXAMPLES = [(4,3,1,'narrow'),(4,1,1,'narrow'),(4,1,1,'wide'),(6,1,1,'wide'),(6,6,1,'wide'),(5,6,1,'wide')]


def action(p, name):
    h.click(p, f'[data-dw-action="{name}"]')


def choose(p, **fields):
    for key, value in fields.items():
        if p.locator(f'[data-dw-field="{key}"]').input_value()==str(value):continue
        p.locator(f'[data-dw-field="{key}"]').select_option(str(value))
        h.ok(p.locator(f'[data-dw-field="{key}"]').evaluate('e=>e===document.activeElement'), 'changed native selector retains focus: '+key)


def work(p):
    return p.locator('[data-dw-field]').evaluate_all('xs=>Object.fromEntries(xs.map(e=>[e.dataset.dwField,e.dataset.dwField==="width"?e.value:Number(e.value)]))')


def enter(p):
    h.click(p, '[data-dt-depth-enter]')
    p.locator('[data-dw-root]').wait_for()


def setup(browser, base, seed, label, width=820):
    c,p = native.setup(browser, seed, label, width)
    c.add_init_script('''window.depthUtterances=[];if(window.speechSynthesis){const nativeSpeak=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{window.depthUtterances.push(u.text);return nativeSpeak(u);};}''')
    p.set_default_timeout(20000)
    try:h.go(p,base,ROUTE,'[data-dt-depth-enter]')
    except Exception:
        p.screenshot(path=str(OUT/'readiness-failure.png'),full_page=True)
        (OUT/'readiness-failure.html').write_text(p.content())
        print(json.dumps({'artifacts':str(OUT),'errors':h.errors,'console':h.console_errors,'http':h.http_failures[-10:],'requests':h.request_failures[-10:]}),flush=True)
        raise
    return c,p


def storage(p):
    return p.evaluate('({local:Object.fromEntries(Object.entries(localStorage)),session:Object.fromEntries(Object.entries(sessionStorage))})')


def near(actual, expected, label):
    h.ok(abs(actual-expected)<.02, f'{label}: {actual} versus {expected}')


def attrs(p, selector, names):
    return p.locator(selector).evaluate('(e,ns)=>ns.map(n=>Number(e.getAttribute(n)))', names)


def geometry(p, values, previous=None):
    level,a,b,width = [values[k] for k in ['level','a','b','width']]
    left,right = (180,420) if width=='narrow' else (100,500)
    h.ok(p.locator('[data-dw-tank]').get_attribute('viewBox')=='0 0 600 460', 'specified tank coordinate system')
    if level:
        actual=attrs(p,'[data-dw-water]',['x','y','width','height'])
        h.ok(actual==[left,400-50*level,right-left,50*level], 'actual water rectangle meets fixed bottom at stated level')
        h.ok(attrs(p,'[data-dw-surface]',['x1','x2','y1','y2'])==[left,right,400-50*level,400-50*level], 'actual surface spans current tank')
    else:
        h.ok(p.locator('[data-dw-water],[data-dw-surface]').count()==0, 'empty tank draws no false bottom waterline or water rectangle')
    for i,(key,z) in enumerate([('a',a),('b',b)]):
        transform=p.locator(f'[data-dw-probe="{key}"]').evaluate('e=>{const t=e.transform.baseVal.consolidate().matrix;return [t.e,t.f]}')
        near(transform[0],left+(right-left)*(i+1)/3, 'gauge horizontal location '+key)
        near(transform[1],400-50*z,'gauge absolute height '+key)
        status='dry' if z>level else 'surface' if z==level else 'water'
        reading=p.locator(f'[data-dw-reading="{key}"]')
        h.ok(reading.get_attribute('data-status')==status, 'actual reading status '+key)
        text=reading.inner_text()
        h.ok(f'{z} meter' in text, 'height retained in reading '+key)
        if status=='dry':
            h.ok('No water reading' in text and 'kilopascal' not in text, 'dry has no fabricated numerical water reading')
            h.ok(not p.locator(f'[data-dw-depth="{key}"],[data-dw-zero="{key}"]').count(), 'dry has no depth bracket')
        elif status=='surface':
            h.ok('0 kilopascals' in text and 'Air pressure is still present' in text, 'surface is true reference zero with atmosphere')
            h.ok(attrs(p,f'[data-dw-zero="{key}"]',['cx','cy','r'])==[left-24 if key=='a' else right+24,400-50*z,4], 'zero depth is radius4 point')
        else:
            pressure=f'{9.8*(level-z):.1f}'.rstrip('0').rstrip('.')
            h.ok(f'{pressure} kilopascals' in text and f'{level-z} meter' in text, 'independent depth and decimal pressure '+key)
            line=attrs(p,f'[data-dw-depth="{key}"]',['x1','x2','y1','y2'])
            h.ok(line==[left-24 if key=='a' else right+24]*2+[400-50*level,400-50*z], 'bracket endpoints are actual surface and gauge')
    for tick in range(8):
        line=attrs(p,f'[data-dw-tick="{tick}"]',['y1','y2'])
        h.ok(line==[400-50*tick]*2,'height ruler tick '+str(tick))
    h.ok(p.locator('[data-dw-previous]').count()==(1 if previous is not None else 0), 'previous waterline appears only on its authored frame')
    if previous is not None:
        h.ok(attrs(p,'[data-dw-previous]',['x1','x2','y1','y2'])==[left,right,400-50*previous,400-50*previous], 'earlier waterline independent geometry')


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no sideways overflow')
    bad=p.locator('[data-dw-root] button,[data-dw-root] select,[data-dw-root] summary,[data-dw-root] a').evaluate_all('''xs=>xs.filter(e=>!e.closest('[hidden]')&&e.getClientRects().length&&(e.getBoundingClientRect().width<44||e.getBoundingClientRect().height<44||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent.trim(),w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))''')
    h.ok(not bad,'44px controls and16px material text '+str(bad))
    h.ok(p.locator('[data-dw-root] [hidden]').evaluate_all('xs=>xs.every(e=>getComputedStyle(e).display==="none")'),'native hidden really conceals child controls')


def face(p, gauge, side, available=True):
    p.locator('[data-dw-gauge]').select_option(gauge)
    h.click(p,f'[data-dw-face-choice="{side}"]')
    h.ok(p.locator(f'[data-dw-face-choice="{side}"]').get_attribute('aria-pressed')=='true','selected face visible to accessibility')
    horizontal=side in ['top','bottom']
    h.ok(attrs(p,'[data-dw-segment]',['x1','y1','x2','y2'])==([120,105,180,105] if horizontal else [150,75,150,135]),'actual test face segment')
    backing={'top':[120,105,60,20],'bottom':[120,85,60,20],'left':[150,75,20,60],'right':[130,75,20,60]}[side]
    h.ok(attrs(p,'[data-dw-backing]',['x','y','width','height'])==backing,'actual solid backing away from water')
    if not available:
        h.ok(p.locator('[data-dw-force],[data-dw-arrowhead]').count()==0,'surface/dry shows no water-force arrow')
        h.ok('Choose a location below the waterline to view water acting on a test face.' in p.locator('[data-dw-root] p').all_text_contents(),'surface/dry supplies exact no-arrow explanation')
        return
    start={'top':[150,45],'bottom':[150,165],'left':[90,105],'right':[210,105]}[side]
    shaft=attrs(p,'[data-dw-force]',['x1','y1','x2','y2'])
    h.ok(shaft[:2]==start,'force starts on exposed water side')
    points=p.locator('[data-dw-arrowhead]').evaluate('e=>[...e.points].map(p=>[p.x,p.y])')
    h.ok([150,105] in points,'actual inward arrowhead reaches face')
    dx,dy=150-start[0],105-start[1]
    tip=next(i for i,x in enumerate(points) if x==[150,105])
    others=[x for i,x in enumerate(points) if i!=tip]
    h.ok(all((150-x)*dx+(105-y)*dy>0 for x,y in others),'both arrowhead corners lie behind inward tip')
    center=[backing[0]+backing[2]/2,backing[1]+backing[3]/2]
    h.ok((start[0]-150)*(center[0]-150)+(start[1]-105)*(center[1]-105)<0,'arrow and backing are on opposite sides')


def compare(p, phrase):
    action(p,'compare')
    h.ok(p.locator('[data-dw-setup="pinned"]').count()==1 and p.locator('[data-dw-setup="current"]').count()==1,'comparison has separate labeled HTML tables')
    h.ok(phrase in p.locator('[data-dw-root]').inner_text(),'comparison availability-aware copy: '+phrase)
    action(p,'back')


def hear(p):
    p.locator('[data-dw-root] [data-speak]').click()
    h.ok(p.locator('.speech-controls').is_visible(),'shared actual speech panel opens')
    return p.locator('[data-dw-root] [data-speak]').get_attribute('data-speak') or ''


def journey(browser,base,seed):
    c,p=setup(browser,base,seed,'tablet')
    try:
        h.click(p,'[data-phase-action="in"]');h.click(p,'[data-phase-action="in"]')
        phase=p.locator('.phase-stage').inner_text()
        baseline=storage(p);notebook=h.book(p)
        enter(p);h.ok(work(p)==DEFAULT,'default H5 A4 B2 narrow')
        h.ok(p.locator('#dw-heading').evaluate('e=>e===document.activeElement'),'entry heading focus')
        geometry(p,DEFAULT);bounds(p)
        action(p,'pin')
        oldpin=p.locator('[data-dw-action="pin"]').element_handle()
        choose(p,a=2);v={**DEFAULT,'a':2};geometry(p,v)
        h.ok(p.locator('[data-dw-reading="a"]').inner_text().replace('A:','B:')==p.locator('[data-dw-reading="b"]').inner_text(),'same-depth different horizontal positions have identical readings')
        choose(p,a=4,width='wide');compare(p,'Width changed while both depths stayed the same.')
        oldpin.evaluate('e=>e.click()');compare(p,'Width changed while both depths stayed the same.')
        action(p,'pin');choose(p,level=4);compare(p,'The waterline moved while the gauges kept their heights.')
        geometry(p,{'level':4,'a':4,'b':2,'width':'wide'})
        choose(p,a=6);geometry(p,{'level':4,'a':6,'b':2,'width':'wide'});action(p,'pin')
        choose(p,level=0);geometry(p,{'level':0,'a':6,'b':2,'width':'wide'});compare(p,'This tank now has no water.')
        action(p,'pin');choose(p,level=1);compare(p,'The waterline is below both locations.')
        choose(p,level=3);compare(p,'This setup now has water; the gauge heights stayed fixed.')
        choose(p,level=1);action(p,'pin');choose(p,width='narrow');compare(p,'Width changed. Both locations still have no water reading.')
        choose(p,level=4);action(p,'pin');choose(p,width='wide');compare(p,'Gauge B keeps the same depth and reading; Gauge A still has no water reading.')
        choose(p,level=5,a=4,b=2)
        action(p,'faces')
        face_copy=['Pressure is perpendicular force per unit area. Kilopascals are units of pressure.', 'At one point in still water, the pressure reading does not depend on how a tiny test face is turned. The force on that face is perpendicular to it. Pressure is a number, not a direction.', 'In the same tank of still water, a lower point in the water is deeper below the surface. Its extra pressure is greater.']
        paragraphs=p.locator('[data-dw-root] p').all_text_contents()
        h.ok(all(sentence in [' '.join(t.split()) for t in paragraphs] for sentence in face_copy),'face definition, local direction and lower-point contrast match authored complete sentences')
        narrated=hear(p)
        h.ok(narrated.count('Direction only; arrow length is not a force measurement.')==1,'face narration includes direction-only qualification exactly once')
        for gauge in ['a','b']:
            for side in ['top','bottom','left','right']:
                face(p,gauge,side)
                h.ok(('9.8' if gauge=='a' else '29.4') in p.locator(f'[data-dw-reading="{gauge}"]').inner_text(),'rotating face preserves pressure')
        action(p,'back');choose(p,a=5,b=6);action(p,'faces');face(p,'a','left',False);face(p,'b','right',False);action(p,'back')
        preserved=work(p)
        for caller in ['work','comparison','faces']:
            if caller!='work':action(p,'compare' if caller=='comparison' else 'faces')
            action(p,'example')
            frames=EXAMPLES if caller=='work' else EXAMPLES[:1]
            for i,row in enumerate(frames):
                geometry(p,dict(zip(['level','a','b','width'],row)),4 if i==3 else None)
                h.ok(p.locator('[data-dw-action="previous"]').is_disabled()==(i==0),'example previous boundary')
                h.ok(p.locator('[data-dw-action="next"]').is_disabled()==(i==5),'example next boundary')
                if caller=='work' and i<5:action(p,'next')
            if caller=='work':h.ok(p.locator('[data-dw-action="previous"]').evaluate('e=>e===document.activeElement'),'endpoint focus returns to enabled neighbor')
            action(p,'back')
            h.ok(p.locator(f'[data-dw-view="{caller}"]').count()==1,'example restores actual caller '+caller)
            h.ok(p.locator('[data-dw-action="example"]').evaluate('e=>e===document.activeElement'),'example Back restores actual launcher focus')
            if caller=='faces':h.ok(p.locator('[data-dw-gauge]').input_value()=='b' and p.locator('[data-dw-face-choice="right"]').get_attribute('aria-pressed')=='true','selected gauge and face survive example')
            if caller!='work':action(p,'back')
            h.ok(work(p)==preserved,'example never edits own tank')
        action(p,'pin');p.locator('[data-dw-action="faces"]').focus();p.keyboard.press('Enter');h.ok(p.locator('[data-dw-view="faces"]').count()==1,'native Enter launches faces');action(p,'back')
        text=hear(p);h.ok('kilopascals' in text and 'No water reading' in text and 'Reading speed' not in text,'current narration uses units/status and excludes voice settings')
        p.locator('.voice-settings summary').first.click();text=hear(p)
        h.ok('Natural pace' not in text and 'Refresh voice list' not in text and 'Reading voice' not in text and 'Narrow' not in text and 'Wide' in text,'open voice settings and unselected options excluded from narration')
        observed=p.evaluate('depthUtterances')
        h.ok(bool(observed),'native synthesis received a final utterance')
        h.ok('kilopascals' in observed[-1] and 'Reading speed' not in observed[-1],'actual final utterance uses supplied units and visible facts')
        h.click(p,'[data-stop-speech]');bounds(p)
        h.ok(storage(p)==baseline and h.book(p)==notebook,'Depth edits/pin/views/examples/speech leave notebook memory/local/session unchanged')
        h.click(p,'[data-dt-depth-back]');h.ok(p.locator('.phase-stage').inner_text()==phase,'Back restores exact phase index')
        h.ok(p.locator('[data-dt-depth-enter]').evaluate('e=>e===document.activeElement'),'Back restores parent launcher focus')
        enter(p);h.ok(work(p)==preserved,'work/pin survive phase return within route');action(p,'compare');h.ok('These settings are the same.' in p.locator('[data-dw-root]').inner_text(),'pin survives parent return');action(p,'back')
        p.screenshot(path=str(OUT/'tablet-work.png'),full_page=True)
    finally:c.close()


def parent_preservation(browser,base,seed):
    c,p=setup(browser,base,seed,'parents')
    try:
        h.click(p,'[data-phase-action="in"]');h.click(p,'[data-phase-action="in"]')
        phase=p.locator('.phase-stage').inner_text()
        h.click(p,'[data-phase-action="watch"]')
        video=p.locator('video').element_handle()
        if video:
            video.evaluate('e=>{e.muted=true;e.play().catch(()=>{});}');h.ok(video.evaluate('e=>!e.paused'),'phase movie actually playing before departure')
        enter(p)
        if video:h.ok(video.evaluate('e=>e.paused'),'Depth entry stops active phase movie')
        h.click(p,'[data-dt-depth-back]');h.ok(not p.locator('video').count() and p.locator('.phase-stage').inner_text()==phase,'phase movie closes while phase index survives')
        oldroot=p.locator('[data-dt-host]').element_handle();oldcontrol=p.locator('[data-phase-action="in"]').element_handle()
        enter(p);h.click(p,'[data-dt-depth-back]')
        p.evaluate('(old)=>document.querySelector("[data-dt-host]").replaceWith(old)',oldroot)
        h.ok(oldroot.evaluate('e=>e.isConnected'),'old parent root restored and connected after mode cycle')
        oldcontrol.evaluate('e=>e.click()')
        h.ok(p.locator('.phase-stage').inner_text()==phase,'binding generation refuses resurrected old phase callback')
        # Reload starts a clean parent binding for actual Tray draft/card preservation.
        p.reload(wait_until='domcontentloaded');h.go(p,base,ROUTE,'[data-dt-enter]');h.click(p,'[data-dt-enter]')
        h.click(p,'[data-dt-step]');h.click(p,'[data-dt-step]');h.click(p,'[data-dt-follow]')
        marker=p.locator('[data-dt-marker]').input_value();drawing=p.locator('[data-dt-model]').inner_html();caption=p.locator('[data-dt-model]').locator('..').inner_text()
        before=storage(p);enter(p);choose(p,level=3);h.click(p,'[data-dt-depth-back]')
        h.ok(p.locator('[data-dt-marker]').input_value()==marker and p.locator('[data-dt-model]').inner_html()==drawing and p.locator('[data-dt-model]').locator('..').inner_text()==caption,'Tray draft step, marker and actual particle drawing survive Depth')
        h.ok(storage(p)==before,'Tray→Depth→Back makes no persistence writes')
        oldroot=p.locator('[data-dt-root]').element_handle();oldstep=p.locator('[data-dt-step]').element_handle()
        enter(p);h.click(p,'[data-dt-depth-back]');p.evaluate('(old)=>document.querySelector("[data-dt-root]").replaceWith(old)',oldroot)
        h.ok(oldroot.evaluate('e=>e.isConnected'),'old Tray root restored after mode cycle')
        oldstep.evaluate('e=>e.click()');h.ok(p.locator('[data-dt-model]').inner_html()==drawing,'binding generation refuses resurrected old Tray step')
        p.reload(wait_until='domcontentloaded');h.go(p,base,ROUTE,'[data-dt-enter]');h.click(p,'[data-dt-enter]');h.click(p,'[data-dt-step]');h.click(p,'[data-dt-keep]')
        kept=h.book(p);card=p.locator('[data-dt-root]').inner_text();before=storage(p)
        enter(p);h.click(p,'[data-dt-depth-back]')
        h.ok(p.locator('[data-dt-root]').inner_text()==card and h.book(p)==kept and storage(p)==before,'actual kept card and notebook survive Depth; Keep remains parent-owned')
    finally:c.close()


def capture(p, selector):
    return p.locator(selector).first.element_handle()


def emit(handle, event='click'):
    handle.evaluate('(e,t)=>e.dispatchEvent(new Event(t,{bubbles:true,cancelable:true}))',event)


def hostile(browser,base,seed):
    # A fresh document for every mutation prevents a retired ancestor from masking
    # the target under test. Handles survive reparenting; descendant locators do not.
    targets=[('[data-dw-root]','[data-dw-field="level"]','change'),
             ('[data-dw-field="level"]',None,'change'),
             ('[data-dw-action="pin"]',None,'click'),
             ('[data-dw-action="faces"]',None,'click'),
             ('[data-dw-action="next"]',None,'click'),
             ('[data-dw-gauge]',None,'change'),
             ('[data-dw-face-choice="bottom"]',None,'click'),
             ('[data-dt-depth-host]','[data-dw-field="level"]','change'),
             ('[data-dt-depth-back]',None,'click')]
    mutations=['hidden','inert','aria-hidden','style','class','reparent','reinsert']
    c,p=setup(browser,base,seed,'hostile')
    for selector,child,event in targets:
        for mutation in mutations:
            try:
                p.reload(wait_until='domcontentloaded');p.locator('[data-dt-depth-enter]').wait_for()
                print('  '+selector+' '+mutation,flush=True)
                enter(p)
                if 'next' in selector:action(p,'example')
                if 'gauge' in selector or 'face-choice' in selector:action(p,'faces')
                target=capture(p,selector);control=capture(p,child) if child else target
                before=p.locator('[data-dw-root]').inner_html();saved=storage(p)
                # Permanent retirement is required even after visibility/ancestry restoration.
                if mutation in ['hidden','inert','aria-hidden','style','class']:
                    name={'aria-hidden':'aria-hidden'}.get(mutation,mutation)
                    value={'hidden':'','inert':'','aria-hidden':'true','style':'display:none','class':'depth-hostile-change'}[mutation]
                    target.evaluate('(e,x)=>e.setAttribute(x[0],x[1])',[name,value])
                    h.ok(target.evaluate('(e,x)=>e.hasAttribute(x)',name),'hostile attribute precondition '+mutation)
                    target.evaluate('(e,n)=>e.removeAttribute(n)',name)
                elif mutation=='reparent':
                    target.evaluate('e=>{window.depthOriginalParent=e.parentNode;window.depthSibling=e.nextSibling;const bin=document.createElement("div");bin.id="depth-hostile-bin";document.body.append(bin);bin.append(e);}')
                    h.ok(target.evaluate('e=>e.parentElement.id==="depth-hostile-bin"'),'actual reparent precondition')
                    target.evaluate('e=>{depthOriginalParent.insertBefore(e,depthSibling);document.querySelector("#depth-hostile-bin").remove();}')
                else:
                    target.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;e.remove();p.insertBefore(e,n);}')
                    h.ok(target.evaluate('e=>e.isConnected'),'removed node was actually reinserted')
                if event=='change':control.evaluate('e=>{e.value=e.matches("[data-dw-gauge]")?"b":"6";}')
                emit(control,event)
                h.ok(p.locator('[data-dw-root]').inner_html()==before and storage(p)==saved,'retired callback refuses '+selector+' '+mutation)
            finally:pass
    c.close()
    # Parent entry guard must reject mutations before the child has ever mounted.
    for mutation in mutations:
        c,p=setup(browser,base,seed,'entry-'+mutation)
        try:
            entry=capture(p,'[data-dt-depth-enter]');saved=storage(p)
            if mutation in ['reinsert','reparent']:
                entry.evaluate('e=>{const p=e.parentNode,n=e.nextSibling;document.body.append(e);p.insertBefore(e,n);}')
                h.ok(entry.evaluate('e=>e.isConnected'),'entry moved and restored')
            else:
                entry.evaluate('(e,n)=>{e.setAttribute(n,n==="aria-hidden"?"true":n==="style"?"display:none":"retired");}',mutation)
                h.ok(entry.evaluate('(e,n)=>e.hasAttribute(n)',mutation),'entry attribute actually changed')
                entry.evaluate('(e,n)=>e.removeAttribute(n)',mutation)
            emit(entry)
            h.ok(not p.locator('[data-dw-root]').count() and storage(p)==saved,'retired host entry refuses '+mutation)
        finally:c.close()


def transfers(browser,base,seed):
    c,p=setup(browser,base,seed,'transfers')
    try:
        before=h.book(p);enter(p);choose(p,level=3);action(p,'pin')
        old=capture(p,'[data-dw-field="level"]')
        p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
        emit(old,'change');h.ok(h.book(p)==before,'departed route callback cannot write notebook')
        with p.expect_download() as result:h.click(p,'#download')
        path=OUT/'invented-depth-notes.json';result.value.save_as(path);report=json.loads(path.read_text())
        h.ok(h.raw_report(report)==before,'actual Notes exports exact synthetic notebook including opaque depthWindow')
        owner=h.active(p)
        p.locator('#progress-file').set_input_files(str(path));p.locator('#progress-import-confirm').wait_for();h.click(p,'#progress-import-confirm')
        p.wait_for_function('old=>JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId!==old',arg=owner)
        imported=h.active(p);p.evaluate('location.hash="#science/ice"');p.locator('[data-dt-depth-enter]').wait_for();enter(p);emit(old,'change')
        h.ok(work(p)==DEFAULT and h.book(p)['depthWindow']==seed['depthWindow'],'actual import changes owner, invalidates callbacks and retains opaque owner')
        choose(p,level=2);p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for()
        if p.locator(f'[data-select-explorer="{imported}"]').count():h.click(p,f'[data-select-explorer="{imported}"]')
        p.locator('[data-dt-depth-enter]').wait_for();enter(p);h.ok(work(p)==DEFAULT,'reload starts fresh unsaved tank')
        choose(p,level=1);h.click(p,'#explorer-switch');h.click(p,'#explorer-cancel');p.locator('[data-dt-depth-enter]').wait_for();enter(p);h.ok(work(p)==DEFAULT,'real picker cancel resets visit')
        h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{owner}"]');p.locator('[data-dt-depth-enter]').wait_for();enter(p);h.ok(work(p)==DEFAULT and h.book(p)==before,'real owner switch isolates visit and preserves source notebook')
        stale=capture(p,'[data-dw-field="level"]');p.evaluate('location.hash="#notes"');p.locator('#reset').wait_for();h.click(p,'#reset');h.click(p,'#confirm-reset');p.wait_for_function('location.hash==="#home"')
        film=p.locator('dialog.welcome-film[open]')
        if film.count():film.locator('[data-film-skip]').click()
        p.evaluate('location.hash="#science/ice"');p.locator('[data-dt-depth-enter]').wait_for();enter(p);emit(stale,'change');h.ok(work(p)==DEFAULT,'actual Notes reset invalidates retained old controls')
    finally:c.close()



def stale_callbacks(browser,base,seed):
    c,p=setup(browser,base,seed,'live-dispatch-positive')
    try:
        enter(p);control=capture(p,'[data-dw-field="a"]')
        control.evaluate('e=>e.value="1"');emit(control,'change')
        h.ok(work(p)=={**DEFAULT,'a':1},'same emit change works on fresh live selector')
        emit(capture(p,'[data-dw-action="faces"]'))
        h.ok(p.locator('[data-dw-view="faces"]').count()==1,'same emit click works on fresh live launcher')
    finally:c.close()
    cases=['work','pin','view','frame','gauge','face','root']
    for case in cases:
        c,p=setup(browser,base,seed,'stale-'+case)
        try:
            enter(p);action(p,'pin')
            if case in ['gauge','face']:action(p,'faces')
            if case=='frame':action(p,'example')
            selector={'work':'[data-dw-field="a"]','pin':'[data-dw-action="pin"]','view':'[data-dw-action="faces"]','frame':'[data-dw-action="next"]','gauge':'[data-dw-gauge]','face':'[data-dw-face-choice="bottom"]','root':'[data-dw-field="level"]'}[case]
            old=capture(p,selector);root=capture(p,'[data-dw-root]')
            if case=='frame':action(p,'next');action(p,'next')
            elif case=='gauge':
                p.locator('[data-dw-gauge]').select_option('b');p.locator('[data-dw-gauge]').select_option('a')
            elif case=='face':h.click(p,'[data-dw-face-choice="left"]')
            elif case=='view':action(p,'example');action(p,'back')
            else:choose(p,b=3)
            if case=='pin':
                action(p,'pin');action(p,'compare')
                pinned=p.locator('[data-dw-setup="pinned"]').inner_text()
                h.ok('height 3 meters' in pinned,'second pin visibly holds W2 before old W1 pin callback')
                action(p,'back')
            before=p.locator('[data-dw-root]').inner_html();saved=storage(p)
            if case=='root':
                p.evaluate('(old)=>document.querySelector("[data-dw-root]").replaceWith(old)',root)
                h.ok(root.evaluate('e=>e.isConnected'),'old child root truly restored after work revision')
                before=p.locator('[data-dw-root]').inner_html()
            old.evaluate('e=>{if(e.tagName==="SELECT")e.value=e.matches("[data-dw-gauge]")?"b":"6";}')
            emit(old,'change' if old.evaluate('e=>e.tagName==="SELECT"') else 'click')
            h.ok(p.locator('[data-dw-root]').inner_html()==before and storage(p)==saved,'departed '+case+' callback refuses after actual revision')
            if case=='pin':
                action(p,'compare');h.ok(p.locator('[data-dw-setup="pinned"]').inner_text()==pinned,'retired W1 pin cannot replace current W2 pin')
        finally:c.close()

def samples(browser,base,seed):
    for width in [320,820,1024]:
        c,p=setup(browser,base,seed,str(width),width)
        try:
            enter(p)
            for values in [{'level':0,'a':6,'b':6,'width':'narrow'},{'level':1,'a':5,'b':4,'width':'wide'},{'level':5,'a':2,'b':2,'width':'narrow'},{'level':5,'a':2,'b':2,'width':'wide'}]:
                choose(p,**values);geometry(p,values);bounds(p)
            choose(p,level=6,a=6,b=6)
            overlaps=p.locator('[data-dw-tank]').evaluate('''svg=>{const label=[...svg.querySelectorAll('text')].find(e=>e.textContent.startsWith('Waterline:')).getBoundingClientRect();return [...svg.querySelectorAll('[data-dw-probe] text')].some(e=>{const b=e.getBoundingClientRect();return b.left<label.right&&b.right>label.left&&b.top<label.bottom&&b.bottom>label.top;});}''')
            h.ok(not overlaps,'surface probe letters do not overlap the waterline label')
            p.screenshot(path=str(OUT/f'both-surface-{width}.png'),full_page=True)
            hear(p);bounds(p);p.locator('.voice-settings summary').first.click();bounds(p);h.click(p,'[data-stop-speech]');bounds(p)
            p.screenshot(path=str(OUT/f'sample-{width}.png'),full_page=True)
        finally:c.close()


def main():
    seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.depthWindow={version:99,opaque:['Invented future water owner',null,{preserve:true}]};s.syntheticOther={payload:'synthetic sibling '.repeat(2000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):
        request_queue_size=128
        daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=os.environ.get('DEPTH_WINDOW_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
    with sync_playwright() as pw:
        b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            suites={'journey':journey,'parents':parent_preservation,'transfers':transfers,'hostile':hostile,'stale':stale_callbacks,'samples':samples}
            for name,run in suites.items():
                if os.environ.get('DEPTH_WINDOW_CASE',name)==name:
                    print('Running '+name,flush=True);run(b,base,seed)
            h.ok(not h.errors,'no page errors '+str(h.errors));h.ok(not h.console_errors,'no console errors '+str(h.console_errors))
            receipt={'status':'passed','checks':h.checks,'base':base,'suite':os.environ.get('DEPTH_WINDOW_CASE','all'),'limits':'Native Chrome only; no physical iPad/Safari, audible speech, screen-reader speech or learning qualification'}
            (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
        except Exception:
            for p,label in h.pages:
                if not p.is_closed():
                    try:p.screenshot(path=str(OUT/'failure.png'),full_page=True)
                    except Exception:pass
            raise
        finally:b.close();server.shutdown()
if __name__=='__main__':main()
