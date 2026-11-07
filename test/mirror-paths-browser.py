"""Turn the Light427: actual-app Chromium, synthetic notebooks and local speech.
One complete native journey, independent SVG physics and bounded responsive and
ownership probes. Exact halfway ties use fractional synthetic click coordinates;
ordinary board taps use Chromium touchscreen events. No hardware, audible speech, Safari or learning qualification.
"""
import sys
sys.dont_write_bytecode = True
import importlib.util
import json
import math
import os
from pathlib import Path
import tempfile
import traceback

OUT = Path(tempfile.mkdtemp(prefix='lg427-browser-', dir='/private/tmp'))
os.environ['JOIN_PIECES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('mirror_actual_app_fixture', Path(__file__).with_name('join-pieces-browser.py'))
host = importlib.util.module_from_spec(spec)
spec.loader.exec_module(host)
host.ROUTE = '#loft/mirrors'
host.VIEW = '[data-mirror-root]'
host.FIXTURE['seed']['mirrorPaths'] = {'version':999, 'raw':['synthetic future mirror work',17]}
original_go = host.go
def go(p, base, route=host.ROUTE):return original_go(p, base, route)
host.go = go
ok, setup, snapshot, export = host.ok, host.setup, host.snapshot, host.export
VIEW = host.VIEW
# Independent source fixtures: normal heading, incidence, source-side sign.
CASES = {'curtain':(-90,30,-1), 'wide':(-90,60,-1), 'opposite':(-90,45,1),
         'side':(0,30,-1), 'slanted':(-45,60,1), 'return':(45,0,0)}
H = (300,220)


def selector(action):return '[data-mirror-action="'+action+'"]'

def focus_ok(p):
    ok(p.evaluate('document.activeElement!==document.body&&document.activeElement.isConnected&&!document.activeElement.disabled&&document.activeElement.getClientRects().length>0'), 'focus remains on an enabled visible native control or heading')

def act(p, action, key=None):
    q=p.locator(selector(action)).first
    if key:q.focus();p.keyboard.press(key)
    else:q.click()
    focus_ok(p)

def choose(p, ident):
    q=p.locator('[data-mirror-start="'+ident+'"]')
    if not q.first.is_visible():
        q.first.locator('xpath=ancestor::details[1]').locator('summary').click()
    q.first.click()
    p.locator('[data-mirror-view="case"]').wait_for()

def scope(p, example=False):return p.locator('[data-mirror-view="'+('example' if example else 'case')+'"]')
def board(p, example=False):return scope(p,example).locator('svg[data-mirror-board]')

def state(p, example=False):
    b=board(p,example)
    angle=b.get_attribute('data-mirror-angle')
    return {'angle':None if angle in [None,'','null'] else int(angle), 'turn':int(b.get_attribute('data-mirror-turn') or 0), 'reference':b.locator('[data-mirror-line="reference"]').count()>0}

def direction(deg):return (math.cos(math.radians(deg)),math.sin(math.radians(deg)))
def point(v,r=150):return [H[i]+r*v[i] for i in range(2)]
def dot(a,b):return sum(x*y for x,y in zip(a,b))
def near(a,b):return len(a)==len(b) and all(abs(x-y)<.035 for x,y in zip(a,b))

def geometry(p, ident, angle=None, turn=0, reference=False, example=False, frame=None):
    phi,theta,side=CASES[ident]
    phi+=turn*90
    n=direction(phi);t=(-n[1],n[0])
    lamp=tuple(math.cos(math.radians(theta))*n[i]+side*math.sin(math.radians(theta))*t[i] for i in range(2))
    incoming=tuple(-x for x in lamp)
    reflected=tuple(incoming[i]-2*dot(incoming,n)*n[i] for i in range(2))
    b=board(p,example)
    data=b.evaluate('''e=>({lines:Object.fromEntries([...e.querySelectorAll("line[data-mirror-line]")].map(x=>[x.dataset.mirrorLine,["x1","y1","x2","y2"].map(k=>Number(x.getAttribute(k)))])),arrows:Object.fromEntries([...e.querySelectorAll("polygon[data-mirror-arrow]")].map(x=>[x.dataset.mirrorArrow,[...x.points].map(p=>[p.x,p.y])])),markers:Object.fromEntries(['lamp','hit','target'].map(k=>{const x=e.querySelector('[data-mirror-'+k+']');return [k,!x?null:x.tagName==='circle'?[x.cx.baseVal.value,x.cy.baseVal.value]:[...x.points].reduce((a,p)=>[a[0]+p.x/x.points.length,a[1]+p.y/x.points.length],[0,0])]})),matrix:(()=>{let m=e.getScreenCTM();return [m.a,m.b,m.c,m.d]})()})''')
    lines=data['lines'];arrows=data['arrows']
    ok(near(data['markers']['hit'],H) and near(data['markers']['lamp'],point(lamp)), 'actual hit and lamp markers match source geometry')
    if theta and not example:
        ok(near(data['markers']['target'],point(reflected,135)), 'intentional guide point supplies the reflected direction clue')
    elif not theta:ok(data['markers']['target'] is None, 'head-on uses one combined lamp and return marker')
    ok(near(lines['mirror'],point(t,-160)+point(t,160)) or near(lines['mirror'],point(t,160)+point(t,-160)), 'finite mirror endpoints independently projected')
    ok(near(lines['incoming'],point(lamp)+list(H)), 'incoming segment reaches H from independent lamp')
    normal=not example or frame>=1
    ok(('normal' in lines)==normal,'normal revealed only in its teaching phase')
    if normal:
        ok(near(lines['normal'],list(H)+point(n,185)), 'front normal extends beyond light paths')
        mv=[lines['mirror'][i+2]-lines['mirror'][i] for i in range(2)]
        nv=[lines['normal'][i+2]-lines['normal'][i] for i in range(2)]
        ok(abs(dot(mv,nv))<.05,'actual mirror and normal perpendicular')
    expected={'incoming':(lamp,incoming,105)}
    if angle is not None:
        proposal=direction(phi+angle)
        ok(near(lines.get('proposal',[]),list(H)+point(proposal)), 'proposal endpoints preserve chosen signed angle '+str({'expected':angle,'actual':state(p,example),'line':lines.get('proposal')}))
        ok(dot(proposal,n)>0,'proposal stays on front side')
        expected['proposal']=(proposal,proposal,145)
    else:ok('proposal' not in lines,'no concealed proposal line')
    if reference:
        ok(near(lines.get('reference',[]),list(H)+point(reflected)), 'reference independently derived by vector reflection')
        ok(dot(reflected,n)>0 and abs(dot(reflected,n)-math.cos(math.radians(theta)))<1e-8,'reference front side and equal normal angle')
        expected['reference']=(reflected,reflected,125)
    else:ok('reference' not in lines,'closed Build has no reference path')
    for name,(position,travel,radius) in expected.items():
        a=arrows.get(name,[])
        ok(len(a)==3 and near(a[0],point(position,radius)),name+' arrow tip is first polygon point at specified distance')
        wing=[(a[1][i]+a[2][i])/2 for i in range(2)]
        ok(dot([a[0][i]-wing[i] for i in range(2)],travel)>0,name+' arrow travels in correct direction')
    m=data['matrix']
    ok(abs(math.hypot(m[0],m[1])-math.hypot(m[2],m[3]))<.001,'responsive SVG uses uniform x/y scale')
    ok(b.get_attribute('aria-label').startswith('Mirror path board'),'accessible board name identifies model')
    return state(p,example)

def tap(p, ident, angle, turn=0, radius=135, fractional=False):
    b=board(p);b.scroll_into_view_if_needed()
    v=direction(CASES[ident][0]+turn*90+angle)
    xy=b.evaluate('(e,p)=>{const q=new DOMPoint(...p).matrixTransform(e.getScreenCTM());return [q.x,q.y]}',point(v,radius))
    # MouseEvent client coordinates are integer WebIDL fields in Chromium.
    # Preserve exact doubles only for the finite tie oracle; ordinary taps stay native.
    if fractional:b.evaluate("(e,xy)=>{const event=new MouseEvent('click',{bubbles:true});Object.defineProperties(event,{clientX:{value:xy[0]},clientY:{value:xy[1]}});e.dispatchEvent(event)}",xy)
    else:p.touchscreen.tap(*xy)

def speech(p):
    p.evaluate('joinSpeech.words=[]')
    p.locator(VIEW+' [data-speak]').click()
    words=p.evaluate('joinSpeech.words')
    ok(len(words)==1,'first native Hear requests exactly one current local utterance')
    visible=p.locator(VIEW).inner_text()
    ok('A bounded ray-construction model' not in words[0] or 'A bounded ray-construction model' in visible, 'closed adult text excluded from narration')
    if scope(p).count():
        current=state(p)
        if current['angle'] is None:ok('No proposed path yet.' in words[0], 'Hear narrates current empty proposal')
        else:ok('Proposed outgoing angle: '+str(abs(current['angle']))+'°' in words[0], 'Hear narrates current actual proposal angle')
    return words[0]

def closed(p):
    q=scope(p)
    ok(q.locator('[data-mirror-reference],[data-mirror-feedback],[data-mirror-line="reference"]').count()==0,'closed Build contains no reference explanation or feedback')
    ok('Reference path:' not in speech(p) and 'matches the reference' not in q.inner_text(),'closed narration excludes reference; supplied incidence and target remain legitimate clues')

def layout(p,label):
    p.screenshot(path=str(OUT/(label+'.png')),full_page=True)
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow '+label)
    bad=p.locator(VIEW+' button,'+VIEW+' a,'+VIEW+' summary').evaluate_all('xs=>xs.filter(e=>!e.closest(".speech-controls,drawn-howto")&&e.checkVisibility()&&(e.getBoundingClientRect().width<43.5||e.getBoundingClientRect().height<43.5||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>e.outerHTML.slice(0,100))')
    ok(not bad,'44px native targets and16px text '+str(bad))

def journey(browser,base):
    c,p=setup(browser,base)
    try:
        # Existing navigation owns openedRooms. Baseline after legitimate entry.
        before_export=export(p,base,'notes-before');go(p,base);before=snapshot(p)
        layout(p,'chooser-820')
        for ident in CASES:
            choose(p,ident);geometry(p,ident);closed(p)
            act(p,'add',key='Enter');geometry(p,ident,0)
            ok(p.locator(selector('flip')).is_disabled(),'zero flip disabled')
            act(p,'cw',key='Space');geometry(p,ident,15)
            act(p,'flip');geometry(p,ident,-15)
            act(p,'clear',key='Enter');geometry(p,ident)
            act(p,'undo');geometry(p,ident,-15)
            act(p,'clear',key='Space');act(p,'undo');geometry(p,ident,-15)
            act(p,'clear');act(p,'add',key='Space');act(p,'undo');geometry(p,ident)
            act(p,'compare');geometry(p,ident,reference=True)
            no_proposal=state(p);act(p,'compare');ok(state(p)==no_proposal,'Compare is idempotent')
            act(p,'hide');closed(p)
            # Full geometry orientations for representative horizontal, slanted and head-on cards.
            if ident in ['curtain','slanted','return']:
                angle=-CASES[ident][1]*CASES[ident][2]
                tap(p,ident,angle);geometry(p,ident,angle)
                act(p,'compare');saved=state(p)
                act(p,'guide');ok(state(p)==saved,'angle-guide toggle retains proposal and open reference')
                for turn in [1,2,3,0]:
                    act(p,'rotate');geometry(p,ident,angle,turn,True)
                act(p,'hide');geometry(p,ident,angle)
                if ident=='curtain':
                    # Same-size angle on source side remains its own wrong proposal.
                    tap(p,ident,-30);act(p,'compare');geometry(p,ident,-30,reference=True)
                    ok('incoming side' in scope(p).inner_text(),'same-size wrong-side explanation')
                    act(p,'hide')
            # Native screen/model mapping, clockwise ties and rejected aims.
            if ident=='curtain':
                for aim,expected in [(7.5,15),(-7.5,0),(74,75),(-74,-75),(22,15)]:
                    tap(p,ident,aim,fractional=abs(aim)==7.5);geometry(p,ident,expected)
                for aim,radius in [(180,135),(0,59),(0,206),(82.6,135),(-82.6,135)]:
                    old=state(p);tap(p,ident,aim,radius=radius);ok(state(p)==old,'invalid front/radial aim ignored')
                tap(p,ident,75);ok(p.locator(selector('cw')).is_disabled(),'upper bound refuses clockwise step')
                tap(p,ident,-75);ok(p.locator(selector('ccw')).is_disabled(),'lower bound refuses counterclockwise step')
                tap(p,ident,30);layout(p,'build-820')
        choose(p,'curtain');geometry(p,'curtain',30)
        live=state(p);act(p,'example')
        for frame in range(5):
            if frame:act(p,'next')
            geometry(p,'curtain',60 if frame==3 else None,1 if frame==4 else 0,frame>=2,True,frame)
            text=speech(p)
            ok('matches the reference' not in text,'example does not narrate live work')
            if frame<3:ok('Different proposal' not in scope(p,True).inner_text(),'false60 proposal absent from earlier frames')
            if frame==3:ok('60' in scope(p,True).inner_text(),'separate false surface/normal proposal explained')
            layout(p,'example-'+str(frame+1)+'-820')
        act(p,'previous');act(p,'back');ok(state(p)==live,'example preserves all live material')
        act(p,'example');geometry(p,'curtain',example=True,frame=0);act(p,'back')
        # Native disclosures and global voice retain independent ownership.
        for detail in p.locator(VIEW+' details').all():
            if not detail.is_visible():continue
            initial=detail.evaluate('e=>e.open');summary=detail.locator('summary')
            summary.click();summary.click();ok(detail.evaluate('e=>e.open')==initial,'native disclosure opens and closes independently')
        act(p,'cw');geometry(p,'curtain',45)
        ok(snapshot(p)==before,'actual notebook and both complete storages unchanged by play, including unknown mirrorPaths')
        ok(export(p,base,'notes-after')==before_export,'real Notes download unchanged except exportedAt')
    finally:
        if sys.exc_info()[0]:p.screenshot(path=str(OUT/'journey-failure.png'),full_page=True)
        c.close()


def dispatch(handle, svg=False):
    if svg:
        handle.evaluate('e=>{const q=new DOMPoint(360,116).matrixTransform(e.getScreenCTM());e.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true,clientX:q.x,clientY:q.y,pointerType:"touch",pointerId:1}));e.dispatchEvent(new MouseEvent("click",{bubbles:true,clientX:q.x,clientY:q.y}))}')
    else:host.dispatch(handle)

def captured(p):return [p.locator(selector('cw')).element_handle(),board(p).element_handle(),p.locator(VIEW+' [data-speak]').element_handle()]
def probe(p, handles, label):
    before=state(p);saved=snapshot(p);voice=p.evaluate('JSON.stringify(joinSpeech)')
    for i,h in enumerate(handles):dispatch(h,i==1)
    ok(state(p)==before and snapshot(p)==saved and p.evaluate('JSON.stringify(joinSpeech)')==voice,'stale HTML/SVG/Hear inert after '+label+' '+str({'before':before,'after':state(p),'storageSame':snapshot(p)==saved,'voiceBefore':voice,'voiceAfter':p.evaluate('JSON.stringify(joinSpeech)')}))

def lifecycle(browser,base):
    for change in ['hidden','inert','style','root','controls-hidden','controls-inert','controls-style']:
        c,p=setup(browser,base)
        try:
            choose(p,'curtain');act(p,'add');speech(p);handles=captured(p)
            js={'hidden':"e.setAttribute('hidden','');e.style.display='none';if(getComputedStyle(e).display!=='none')throw new Error('hidden probe did not hide element');e.removeAttribute('hidden');e.style.removeProperty('display')",'inert':"e.setAttribute('inert','');if(!e.hasAttribute('inert'))throw new Error('inert probe not applied');e.removeAttribute('inert')",'style':'e.style.display="none";e.style.removeProperty("display")','root':'const parent=e.parentNode,next=e.nextSibling;e.remove();parent.insertBefore(e,next)'}[change.removeprefix('controls-')]
            if change.startswith('controls-'):
                for handle in handles:handle.evaluate('e=>{'+js+'}')
            else:p.locator(VIEW).evaluate('e=>{'+js+'}')
            probe(p,handles,change+' restored root')
            cancel=p.evaluate('joinSpeech.cancel');p.locator('[data-stop-speech]').first.click()
            ok(p.evaluate('joinSpeech.cancel')>cancel,'global Stop independent of retired activity')
            go(p,base,'#notes');go(p,base);choose(p,'curtain');act(p,'add');act(p,'cw');geometry(p,'curtain',15)
        finally:c.close()
    c,p=setup(browser,base)
    try:
        for change in ['case','material','view','route','chooser','owner','import','reset','reload']:
            go(p,base,'#notes');go(p,base);choose(p,'curtain');act(p,'add');handles=captured(p)
            if change=='case':choose(p,'wide');act(p,'add')
            elif change=='material':act(p,'ccw')
            elif change=='view':act(p,'example');act(p,'back')
            elif change=='route':
                voice=p.evaluate('joinSpeech.words.slice()');book=snapshot(p)['book']
                p.evaluate("()=>{window.mirrorOld=[document.querySelector('[data-mirror-action=cw]'),document.querySelector('svg[data-mirror-board]'),document.querySelector('[data-mirror-root] [data-speak]')];location.hash='#notes';mirrorOld.forEach(e=>e.dispatchEvent(new MouseEvent('click',{bubbles:true}))) }")
                p.locator('#download').wait_for()
                ok(p.evaluate('joinSpeech.words')==voice and snapshot(p)['book']==book,'same-tick route departure refuses stale native callbacks and speech')
                go(p,base);choose(p,'curtain');act(p,'add')
            elif change in ['chooser','owner']:
                p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+('explorer-2' if change=='owner' else 'explorer-1')+'"]').click()
                go(p,base);choose(p,'curtain');act(p,'add')
            elif change in ['import','reset']:
                inactive=p.evaluate("()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return Object.entries(localStorage).filter(([k])=>k.startsWith('number-garden-v1:')&&k!=='number-garden-v1:'+id)}")
                go(p,base,'#notes')
                if change=='import':
                    p.locator('#progress-file').set_input_files({'name':'synthetic-mirror.json','mimeType':'application/json','buffer':json.dumps(host.FIXTURE['seed']).encode()})
                    p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
                else:
                    p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function("location.hash==='#home'")
                    film=p.locator('dialog.welcome-film[open]');film.wait_for();film.locator('[data-film-skip]').click()
                ok(p.evaluate('xs=>xs.every(([k,v])=>localStorage.getItem(k)===v)',inactive),'confirmed '+change+' preserves inactive explorer exactly')
                go(p,base);choose(p,'curtain');act(p,'add')
            else:
                p.reload(wait_until='networkidle')
                picker=p.locator('[data-select-explorer="explorer-1"]')
                if picker.count():picker.click()
                p.locator('[data-mirror-view="chooser"]').wait_for();choose(p,'curtain');geometry(p,'curtain');act(p,'add')
            if change!='reload':probe(p,handles,change)
            # Effective native current action proves the probe did not poison the visit.
            current=state(p);act(p,'cw');ok(state(p)['angle']==current['angle']+15,'genuine current action after '+change)
    finally:
        if sys.exc_info()[0]:p.screenshot(path=str(OUT/'lifecycle-failure.png'),full_page=True)
        c.close()


def responsive_and_unseen(browser,base):
    for width in [320,1024]:
        c,p=setup(browser,base,width)
        try:
            choose(p,'slanted');tap(p,'slanted',-60);geometry(p,'slanted',-60)
            act(p,'rotate');tap(p,'slanted',-45,1);act(p,'compare');geometry(p,'slanted',-45,1,True)
            layout(p,'build-'+str(width));act(p,'example')
            for _ in range(4):act(p,'next')
            geometry(p,'curtain',turn=1,reference=True,example=True,frame=4);layout(p,'example-'+str(width))
        finally:c.close()
    c,p=setup(browser,base,unseen=True)
    try:
        expected=json.loads(json.dumps(host.FIXTURE['unseen']));actual=snapshot(p)['book']
        actual.get('garden',{}).pop('avatar',None);expected.get('garden',{}).pop('avatar',None)
        if not actual.get('garden') and 'garden' not in expected:actual.pop('garden',None)
        ok(actual==expected,'unseen direct entry creates no unrelated game state')
        before=snapshot(p);choose(p,'return');act(p,'add');act(p,'compare');geometry(p,'return',0,reference=True)
        ok(snapshot(p)==before,'unseen play adds no notebook or storage records')
    finally:c.close()


def main():
    server=host.Server(('127.0.0.1',0),host.functools.partial(host.Quiet,directory=str(host.ROOT/'dist')))
    host.threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}/'
    print('Artifacts: '+str(OUT),flush=True)
    try:
        with host.sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
            try:
                journey(browser,base);lifecycle(browser,base);responsive_and_unseen(browser,base)
                ok(not host.errors,'no page/network/console errors '+str(host.errors))
                receipt={'status':'passed','scope':__doc__,'artifacts':str(OUT)}
                (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
            except Exception:
                (OUT/'failure.txt').write_text(traceback.format_exc()+'\n'+json.dumps(host.errors,indent=2));raise
            finally:browser.close()
    finally:server.shutdown();server.server_close()

if __name__=='__main__':main()
