"""Photo Studies378 native Chromium journey, using invented notebooks only.

One820 touch/keyboard journey and320/1024 responsive samples. Ordinary journeys
use real modules and Notes transport. The isolated lifecycle harness explicitly
covers external mutations unavailable through the normal UI. Chromium emulation
is not physical iPad/Safari, VoiceOver, audible speech or learning qualification.
"""
import sys
sys.dont_write_bytecode = True
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('PHOTO_STUDY_ARTIFACTS', tempfile.mkdtemp(prefix='photo-study-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
_spec = importlib.util.spec_from_file_location('photo_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(native)
h = native.h
ROUTE = '#science/lens'
PREFIX = 'data-study-'


def selector(name, value=None):
    name = {'add-label':'add','label-text':'text','label-kind':'kind'}.get(name,name)
    if name=='root': return '[data-photo-study-root]'
    if name=='status': return '#study-status'
    if name=='example-paper': return '.study-example svg'
    return '['+PREFIX+name+('="'+str(value)+'"' if value is not None else '')+']'


def click(p, name, value=None): h.click(p, selector(name, value))
def enter(p, base): h.go(p, base, ROUTE, '[data-lens-root]')
def book(p): return h.book(p)
def records(p): return book(p).get('photoStudies', [])
def focus_is(p, s): return p.locator(s).evaluate('e=>e===document.activeElement')
def dispatch(e, kind='click'): e.evaluate('(e,k)=>e.dispatchEvent(new Event(k,{bubbles:true,cancelable:true}))', kind)


def start(p, base=None):
    if base: enter(p, base)
    h.click(p, '[data-lens-turn="2"]')
    if p.locator('[data-lens-photo]').count(): h.click(p, '[data-lens-photo]')
    h.click(p, '[data-lens-study-new]')
    p.locator(selector('paper')).wait_for()


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator('[data-photo-study-root] button,[data-photo-study-root] a,[data-photo-study-root] summary,[data-photo-study-root] select').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().width<44||e.getBoundingClientRect().height<44||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))''')
    h.ok(not bad, 'visible controls have44px targets and16px text: '+str(bad))


def point(p, x, y):
    return p.locator(selector('paper')).evaluate('(e,p)=>{const q=new DOMPoint(...p).matrixTransform(e.getScreenCTM());return {x:q.x,y:q.y}}', [x,y])


def pointer(p, kind, x, y, identity=31):
    paper=p.locator(selector('paper'))
    if kind=='pointerdown':paper.scroll_into_view_if_needed()
    q=point(p,x,y)
    if identity!=31:
        paper.dispatch_event(kind,dict(clientX=q['x'],clientY=q['y'],pointerId=identity,pointerType='touch',isPrimary=False,button=0))
        return
    if not hasattr(p,'study_cdp'):p.study_cdp=p.context.new_cdp_session(p)
    event={'pointerdown':'touchStart','pointermove':'touchMove','pointerup':'touchEnd','pointercancel':'touchCancel'}[kind]
    p.study_cdp.send('Input.dispatchTouchEvent',{'type':event,'touchPoints':[] if event in ['touchEnd','touchCancel'] else [{'x':q['x'],'y':q['y'],'id':1}]})


def line(p, points, end='pointerup', identity=31):
    pointer(p,'pointerdown',*points[0],identity)
    for q in points[1:]:pointer(p,'pointermove',*q,identity)
    pointer(p,end,*points[-1],identity)


def keep(p):
    click(p,'keep')
    return copy.deepcopy(records(p)[-1])


def fixture():
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',r'''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={payload:'Invented sibling stays exact'};
console.log(JSON.stringify({base,maxImportBytes:MAX_IMPORT_BYTES}));
'''],cwd=ROOT,text=True))


def whole_photo(p, image='[data-lens-photo-image]', hear=None):
    alt=p.locator(image).first.get_attribute('alt') or ''
    h.ok('whole photograph' in alt.lower() or 'whole image' in alt.lower(),'photo alt identifies the whole image rather than recognizing the crop')
    if hear:
        h.click(p,hear);spoken=p.locator(hear).get_attribute('data-speak') or ''
        h.ok(alt in spoken,'Hear retains the whole-photo description')
        h.click(p,'[data-stop-speech]')


def text_regressions(browser,base,f):
    _,p=native.setup(browser,f['base'],'caption-newlines');start(p,base)
    for value in ['\nSynthetic leading line','\n']:
        prior=p.locator(selector('caption')).input_value()
        p.locator(selector('caption')).fill(value);click(p,'tool','label')
        h.ok(p.locator(selector('caption')).input_value()==value,'redraw preserves leading newline caption '+repr(value))
        click(p,'undo');h.ok(p.locator(selector('caption')).input_value()==prior,'one Undo reaches actual prior caption after redraw')
        click(p,'redo');saved=keep(p)
        h.ok(saved['work']['caption']==value,'Redo and Keep preserve exact newline caption '+repr(value))
        click(p,'copy')


def phone_order(p, editable=True):
    image=p.locator('[data-lens-photo-figure] .lens-photo-window').first.bounding_box()
    paper=p.locator(selector('paper') if editable else '.study-workspace .study-paper').first.bounding_box()
    credit=p.locator('[data-lens-photo-figure] figcaption').first.bounding_box()
    h.ok(image['y']+image['height']<=paper['y']+1 and paper['y']<credit['y'],'phone puts drawing immediately after photograph before long credit text')


def journey(browser,base,f):
    print('Photo Studies: native tablet journey',flush=True)
    _,p=native.setup(browser,f['base'],'tablet');enter(p,base)
    h.click(p,'[data-lens-studies]')
    h.ok('Open a photograph' in p.locator(selector('root')).inner_text(), 'shelf before photograph gives honest starting instructions')
    click(p,'back');before=book(p)
    h.click(p,'[data-lens-turn="2"]');h.click(p,'[data-lens-photo]');h.click(p,'[data-lens-photo-zoom="4"]');h.click(p,'[data-lens-photo-pan="right"]');start(p)
    h.ok('photoStudies' not in book(p),'opening a draft does not initialize saved collection')
    bounds(p)
    img=p.locator('[data-lens-photo-image]');img.evaluate('e=>e.decode()')
    h.ok(img.evaluate('e=>[e.naturalWidth,e.naturalHeight]')==[3264,1840],'reference is actual bundled onion JPEG')
    whole_photo(p,hear=selector('hear'))
    p.locator(selector('paper')).evaluate('e=>{e.style.width="360px";e.style.height="200px";e.style.maxWidth="100%"}')
    # Actual inverse SVG CTM, including letterboxing, must place independent points.
    p.locator(selector('paper')).scroll_into_view_if_needed()
    a=point(p,100,100);b=point(p,200,150)
    p.mouse.move(a['x'],a['y']);p.mouse.down();p.mouse.move(b['x'],b['y']);p.mouse.up()
    line(p,[(250,250)])
    pointer(p,'pointerdown',300,300);pointer(p,'pointermove',330,300)
    pointer(p,'pointermove',1100,300);pointer(p,'pointermove',400,300);pointer(p,'pointerup',400,300)
    line(p,[(450,450),(470,470)],'pointercancel')
    # Foreign pointer completion and keyboard cannot steal a pointer-owned line.
    pointer(p,'pointerdown',500,500);pointer(p,'pointermove',520,500)
    pointer(p,'pointerup',600,600,99)
    paper=p.locator(selector('paper'));paper.focus();p.keyboard.press('ArrowRight');p.keyboard.press('Enter')
    click(p,'finish');pointer(p,'pointerup',520,500)
    paper=p.locator(selector('paper'));paper.focus();p.keyboard.press('Enter');p.keyboard.press('ArrowRight');p.keyboard.press('Enter')
    pointer(p,'pointerdown',800,600);pointer(p,'pointerup',800,600)
    click(p,'finish')
    # Cancel pending line and undo/redo then clear retain the writing independently.
    paper=p.locator(selector('paper'));paper.focus();p.keyboard.press('Enter');p.keyboard.press('Escape')
    p.locator(selector('caption')).fill('Synthetic visible borders  ')
    click(p,'add-label')
    h.ok(focus_is(p,selector('label-text')), 'Add label immediately focuses editable text')
    p.locator(selector('label-text')).fill('A border <shown> & uncertain  ')
    p.locator(selector('label-kind')).select_option('question')
    click(p,'tool','label');paper=p.locator(selector('paper'));paper.focus()
    p.keyboard.press('ArrowDown');p.keyboard.press('Shift+ArrowRight');p.keyboard.press('Enter')
    p.locator('[data-study-help] summary').click();click(p,'example');click(p,'example');click(p,'example')
    h.ok(p.locator(selector('example-paper')).count()==1,'manual help reveals separate invented example')
    click(p,'undo');click(p,'redo')
    p.screenshot(path=str(OUT/'tablet-working.png'),full_page=True)
    stale=p.locator(selector('keep')).element_handle();first=keep(p);dispatch(stale)
    w=first['work'];strokes=w['strokes']
    whole_photo(p,hear=selector('hear'))
    h.ok(len(records(p))==1,'detached repeated Keep cannot save twice')
    h.ok([s['points'] for s in strokes[:5]]==['100,100 200,150','250,250','300,300 330,300','450,450 470,470','500,500 520,500'],'CTM, dot, outside termination, cancellation and pointer arbitration preserve exact accepted points: '+repr(strokes))
    h.ok(len(strokes)==6 and strokes[-1]['points']=='520,500 530,500','keyboard line owns its points and ignores competing touch')
    h.ok(w['caption']=='Synthetic visible borders  ' and w['labels'][0]['text']=='A border <shown> & uncertain  ' and w['labels'][0]['kind']=='question','all accepted text and categories keep immediately with trailing spaces')
    h.ok(w['labels'][0]['at']=={'x':531,'y':510},'keyboard label placement uses10-unit arrow and1-unit Shift arrow')
    h.ok(first['source']['photoView']=={'zoom':4,'x':.5625,'y':.5},'study snapshots chosen Lens crop')
    h.ok(p.locator('.study-workspace .study-paper circle[r="2.5"]').count()==1,'a one-point stroke renders as a dot without invented duplicate vertex')
    h.ok(w['exampleSeen']==3 and len(w['labels'])==1,'help disclosure survives Undo/Redo and example never enters learner labels')
    h.ok({k:v for k,v in book(p).items() if k!='photoStudies'}==before,'Keep writes only study owner')
    h.ok(not p.locator(selector('caption')+','+selector('keep')).count(),'kept record is frozen')
    click(p,'copy');click(p,'clear');click(p,'undo');click(p,'redo')
    h.ok(p.locator(selector('caption')).input_value()==w['caption'],'Clear and history retain caption')
    click(p,'undo');second=keep(p)
    h.ok(first==records(p)[0] and second['work']==first['work'],'copy/history keep exact original drawing without mutating first')
    # Composition is settled before Keep; overlong provisional text blocks it.
    click(p,'copy');caption=p.locator(selector('caption'))
    caption.dispatch_event('compositionstart')
    caption.evaluate('e=>{e.value="😀".repeat(601);e.dispatchEvent(new InputEvent("input",{bubbles:true,isComposing:true}))}')
    click(p,'keep');h.ok(len(records(p))==2 and p.locator(selector('caption')).count()==1,'over-limit composing value refuses Keep without leaving draft')
    caption=p.locator(selector('caption'));caption.evaluate('e=>{e.value="😀".repeat(600);e.dispatchEvent(new CompositionEvent("compositionend",{bubbles:true}))}')
    third=keep(p);h.ok(third['work']['caption']=='😀'*600,'600 Unicode codepoints accepted after composition')
    exported=native.download(p,base,'tablet-export')
    h.ok(exported['photoStudies']==records(p) and exported['syntheticOther']==before['syntheticOther'],'real Notes export includes exact study records and unknown sibling')
    print('Photo Studies: transfer, lifecycle and boundaries',flush=True)
    text_regressions(browser,base,f)
    lifecycle(browser,base,f)
    external_lifecycle(browser,base,f,first)
    transfer(browser,base,f,exported,first)
    boundaries(browser,base,f,first,exported)
    cells(browser,base,f,first)
    for width in [320,1024]:
        _,q=native.setup(browser,f['base'],'width-'+str(width),width=width);start(q,base);bounds(q)
        image=q.locator('[data-lens-photo-image]').bounding_box();paper=q.locator(selector('paper')).bounding_box()
        h.ok((image['y']+image['height']<=paper['y']+1) if width==320 else abs(image['y']-paper['y'])<200,'reference stacks at320 and sits beside paper at1024')
        if width==320:
            phone_order(q);keep(q);phone_order(q,False)
        q.screenshot(path=str(OUT/f'width-{width}.png'),full_page=True)


def lifecycle(browser,base,f):
    _,p=native.setup(browser,f['base'],'draft-lifecycle');start(p,base)
    p.locator(selector('caption')).fill('First synthetic draft')
    click(p,'back');h.click(p,'[data-lens-keep]');lens=copy.deepcopy(book(p)['lensViews']);start(p)
    p.locator(selector('caption')).fill('Second synthetic draft')
    click(p,'shelf');h.ok(p.locator(selector('draft')).count()==2,'each Make new study owns a distinct continuing draft')
    click(p,'hear');spoken=p.locator(selector('hear')).get_attribute('data-speak') or ''
    h.ok('First synthetic draft' not in spoken and 'Second synthetic draft' not in spoken,'shelf Hear excludes hidden active draft writing')
    click(p,'draft','draft-1');h.ok(p.locator(selector('caption')).input_value()=='First synthetic draft','shelf resumes exact first draft')
    # Connected controls moved outside their captured root cannot edit work.
    text=p.locator(selector('caption')).element_handle()
    paper=p.locator(selector('paper')).element_handle()
    action=p.locator(selector('add-label')).element_handle()
    speech=p.locator(selector('hear')).element_handle()
    for e in [text,paper,action,speech]:e.evaluate('e=>{e.studyOriginalParent=e.parentNode;document.body.append(e)}')
    text.evaluate('e=>{e.value="Reparented forbidden text";e.dispatchEvent(new InputEvent("input",{bubbles:true}))}')
    dispatch(action)
    speech.evaluate('e=>{e.dataset.speak="Captured sentinel";e.click()}')
    h.ok(speech.get_attribute('data-speak')=='Captured sentinel','reparented Hear never acquires narration')
    paper.evaluate('e=>{for(const t of ["pointerdown","pointerup"])e.dispatchEvent(new PointerEvent(t,{bubbles:true,pointerId:44,isPrimary:true,button:0,clientX:10,clientY:10}))}')
    text.evaluate('e=>e.value="First synthetic draft"')
    for e in [text,paper,action,speech]:e.evaluate('e=>e.studyOriginalParent.append(e)')
    first=keep(p)
    h.ok(book(p)['lensViews']==lens,'starting from kept Lens photograph never edits frozen Lens record')
    h.ok(first['work']['caption']=='First synthetic draft' and not first['work']['labels'] and not first['work']['strokes'],'reparented input, action and pointer cannot change accepted work')
    click(p,'shelf');h.ok(p.locator(selector('draft')).count()==1,'Keep consumes only its active visit draft')
    click(p,'draft','draft-2');oldtext=p.locator(selector('caption')).element_handle();oldpaper=p.locator(selector('paper')).element_handle();oldkeep=p.locator(selector('keep')).element_handle()
    h.go(p,base,'#science','main')
    oldtext.evaluate('e=>{e.value="Stale forbidden text";e.dispatchEvent(new InputEvent("input",{bubbles:true}))}')
    dispatch(oldkeep)
    oldpaper.evaluate('e=>e.dispatchEvent(new KeyboardEvent("keydown",{bubbles:true,key:"Enter"}))')
    h.ok(records(p)==[first],'route-exited input, pointer and Keep cannot resurrect visit')
    enter(p,base);h.click(p,'[data-lens-studies]')
    h.ok(not p.locator(selector('draft')).count(),'leaving exact route discards every unkept draft')


def external_lifecycle(browser,base,f,first):
    # Explicit isolated actual-UI harness: owner/book/raw replacement cannot be
    # triggered while retaining old DOM through ordinary user navigation.
    _,p=native.setup(browser,f['base'],'external-lifecycle-harness');enter(p,base)
    setup = r'''async seed=>{
      const ui=await import('./photo-study-ui.mjs'),{lensSource}=await import('./lens-bench-core.mjs');
      ui.resetPhotoStudies();document.querySelectorAll('[data-photo-study-root]').forEach(e=>e.remove());const book=structuredClone(seed),mount=document.querySelector('main');
      const h={book,currentBook:book,owner:'synthetic-owner',active:true,mode:true};
      const render=()=>{mount.innerHTML=ui.photoStudiesPage(book,'synthetic-owner');ui.bindPhotoStudies(book,{explorerId:()=>h.owner,notebook:()=>h.currentBook,isActive:()=>h.active,isStudyActive:()=>h.mode,onBack:()=>{},save:()=>({enabled:true,ok:true}),canExport:()=>true,render,focus:s=>document.querySelector(s)?.focus()})};
      h.render=render;h.ui=ui;window.studyHarness=h;ui.startPhotoStudy(book,'synthetic-owner',lensSource('crossed').photo,{zoom:1,x:.5,y:.5});render();
    }'''
    for fault,mutation in [
        ('owner','h.owner="another-owner"'),('book','h.currentBook=structuredClone(h.book)'),
        ('mode','h.mode=false'),('active','h.active=false'),
        ('root','document.body.append(document.querySelector("[data-photo-study-root]"))'),
        ('reset','h.ui.resetPhotoStudies()')]:
        p.evaluate(setup,f['base']);old=p.evaluate('JSON.stringify(studyHarness.book)');handle=p.locator(selector('keep')).element_handle()
        p.evaluate('(code)=>{const h=window.studyHarness;eval(code)}',mutation);dispatch(handle)
        h.ok(p.evaluate('JSON.stringify(studyHarness.book)')==old,fault+' invalidation prevents stale Keep from writing harness notebook')
    p.evaluate(setup,f['base']);p.locator(selector('caption')).fill('Accepted before moving')
    p.locator(selector('caption')).evaluate('e=>{document.querySelector("[data-photo-study-root]").append(e);e.value="Rejected after moving";e.dispatchEvent(new InputEvent("input",{bubbles:true}))}')
    click(p,'keep')
    h.ok(p.evaluate('studyHarness.book.photoStudies[0].work.caption')=='Accepted before moving','wrong-parent stale text cannot change work or block a live Keep')
    seed=copy.deepcopy(f['base']);seed['photoStudies']=[first];p.evaluate(setup,seed);click(p,'shelf');click(p,'card',first['id'])
    stale=p.locator(selector('copy')).element_handle()
    p.evaluate('()=>{studyHarness.book.photoStudies[0].work=structuredClone(studyHarness.book.photoStudies[0].work)}');dispatch(stale)
    h.ok(not p.locator(selector('keep')).count(),'replaced raw work invalidates old frozen Copy handler')


def transfer(browser,base,f,exported,first):
    historical=copy.deepcopy(first);historical['id']='photo-study-80';s=historical['source'];w=historical['work']
    s.update(id='earlier-paper',title='Earlier <paper> & borders',paper={'width':800,'height':600,'futurePaper':True},teaching=['Earlier single teaching frame'],futureSource={'kept':True})
    s['example']['paper']={'width':1200,'height':900};s['example']['strokes']=[{'id':'s1','points':'1100,800'}];s['example']['labels']=[]
    w.update(strokes=[{'id':'s1','points':'0,0 800,600'}],labels=[{'id':r'old"label\pointer','kind':'notice','text':'One\r\nTwo\rThree\nFour','at':None}],caption='\r\nEarlier caption\rwith mixed\nline endings',exampleSeen=1,futureWork={'kept':True})
    historical['futureOuter']={'originalOnly':True}
    unknown={'id':'photo-study-900','v':99,'raw':'Invented unknown record'}
    mixed=copy.deepcopy(exported);mixed['photoStudies']=[first,historical,unknown]
    _,p=native.setup(browser,f['base'],'notes-transfer');enter(p,base);original=book(p);identity=h.active(p)
    h.go(p,base,'#notes','#progress-file');p.locator('#progress-file').set_input_files({'name':'synthetic-photo-studies.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
    p.locator('#progress-import-confirm').wait_for();h.ok('Photo studies' in p.locator('.import-preview').inner_text(),'real Notes preview names owner')
    h.click(p,'#progress-import-confirm');enter(p,base);h.ok(h.active(p)!=identity,'real import creates separate explorer')
    h.click(p,'[data-lens-studies]');click(p,'card','photo-study-80')
    h.ok('Earlier <paper> & borders' in p.locator(selector('root')).inner_text(),'historical title renders escaped own text')
    h.ok(p.locator('.study-paper').first.get_attribute('viewBox')=='0 0 800 600','historical drawing uses own paper dimensions')
    click(p,'copy');click(p,'select');p.locator(selector('label-kind')).select_option('notice')
    h.ok(focus_is(p,selector('label-kind')) and p.locator(selector('label-kind')).get_attribute('data-study-kind')==w['labels'][0]['id'],'historical quote/backslash label id keeps selection and kind-control focus safely')
    p.locator('[data-study-help] summary').click()
    h.ok(p.locator(selector('example-paper')).get_attribute('viewBox')=='0 0 1200 900','short historical help exposes own separate example dimensions')
    latest=keep(p)
    h.ok(latest['id']=='photo-study-901' and latest['source']==s and latest['work']==w and 'futureOuter' not in latest,'copy preserves nested unknowns, reserves unknown raw id, excludes outer extras')
    click(p,'copy');p.locator(selector('caption')).fill('Deliberate\nnew caption');p.locator(selector('label-text')).fill('Deliberate edited label');edited=keep(p)
    h.ok(edited['work']['caption']=='Deliberate\nnew caption' and edited['work']['labels'][0]['text']=='Deliberate edited label' and records(p)[-2]==latest,'deliberate edits replace historical form text while original CRLF record remains exact')
    redownload=native.download(p,base,'historical-redownload')
    h.ok(redownload['photoStudies'][:-2]==mixed['photoStudies'],'real import/redownload preserves historical and unreadable records raw')
    enter(p,base);h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{identity}"]');p.locator('[data-lens-root]').wait_for()
    h.ok(book(p)==original,'study transfer never changes original explorer')


def boundaries(browser,base,f,first,exported):
    for label,value in [('unsupported',{'v':99}),('exhausted',[{'id':'photo-study-999999','v':99}])]:
        seed=copy.deepcopy(f['base']);seed['photoStudies']=value
        _,p=native.setup(browser,seed,label);start(p,base);old=book(p)
        if p.locator(selector('keep')).is_enabled():click(p,'keep')
        h.ok(book(p)==old and p.locator(selector('paper')).count()==1,label+' Keep preserves raw owner and continuing draft')
    # Size a synthetic sibling around the real report envelope; real Keep performs
    # actual app-injected Notes preflight rather than an intercepted callback.
    seed=copy.deepcopy(f['base']);probe=copy.deepcopy(exported)
    blank=copy.deepcopy(first);blank['id']='photo-study-2';blank['work']={'v':1,'strokes':[],'labels':[],'caption':'','exampleSeen':0}
    seed['photoStudies']=[copy.deepcopy(first)];probe['photoStudies']=[first,blank]
    probe['syntheticOther']['payload']=''
    sizing=browser.new_page();sizing.goto(base,wait_until='domcontentloaded')
    overhead=sizing.evaluate('x=>new TextEncoder().encode(JSON.stringify(x,null,2)).length',probe);sizing.close()
    seed['syntheticOther']['payload']='x'*(f['maxImportBytes']-overhead+128)
    _,p=native.setup(browser,seed,'capacity-refusal');start(p,base);old=book(p);click(p,'keep')
    h.ok(book(p)==old and p.locator(selector('caption')).count()==1,'real shared capacity refuses Keep and retains draft')
    h.ok('download' in p.locator(selector('status')).inner_text().lower(),'capacity refusal offers Notes recovery')
    for fault in ['saving-off','quota']:
        _,p=native.setup(browser,f['base'],fault)
        if fault=='saving-off':
            h.go(p,base,'#notes','#remember');p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click()
            p.evaluate('location.hash="#science/lens"');p.locator('[data-lens-root]').wait_for();start(p)
        else:start(p,base)
        if fault=='quota':p.evaluate("()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Invented fault','QuotaExceededError');return native.call(this,k,v)}}")
        click(p,'keep');status=p.locator(selector('status')).inner_text().lower()
        h.ok('session' in status or 'off' in status or 'open page' in status,fault+' distinguishes memory from disk')
        recovered=native.download(p,base,fault+'-recovery');h.ok(len(recovered['photoStudies'])==1,fault+' real Notes recovers kept memory')


def cells(browser,base,f,first):
    seed=copy.deepcopy(f['base']);seed['photoStudies']=[first]
    _,p=native.setup(browser,seed,'cell-return');h.go(p,base,'#living/bodies','[data-cs-enter]')
    for full in [False,True]:
        if full:h.click(p,'[data-cs-enter]');p.locator('[data-cs-root]').wait_for()
        before=book(p);fold=p.locator('[data-photo-study-cell-return]')
        if fold.get_attribute('open') is None:fold.locator('summary').click()
        h.ok(first['source']['title'] in fold.inner_text() and first['work']['caption'].strip() in fold.inner_text(),'Cell return displays frozen study in mode '+str(full))
        whole_photo(p,image='[data-photo-study-cell-return] [data-lens-photo-image]',hear='[data-cs-hear]' if full else None)
        h.ok(book(p)==before and 'cellModels' not in before,'Cell return fold does not write either root')
        link=fold.locator('a[href="'+ROUTE+'"]').element_handle();link.evaluate('e=>document.body.append(e)');dispatch(link)
        h.ok(p.evaluate('location.hash')=='#living/bodies' and book(p)==before,'reparented Cell return anchor rejected')


def main():
    f=fixture();server=None;base=os.environ.get('PHOTO_STUDY_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            protocol_version='HTTP/1.1'
            def log_message(self,*args):pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            journey(browser,base,f)
            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors));h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'scope':__doc__},indent=2))
            print(f'Photo Studies browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for p,label in h.pages:
                if not p.is_closed():
                    try:p.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True);(OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception:pass
            raise
        finally:
            for c in h.contexts:
                try:c.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()


if __name__=='__main__':main()
