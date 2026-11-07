"""Leaf Exchange414 in the actual app, using invented notebooks only.

One complete tablet visit, focused phone geometry, and bounded lifecycle/copy
probes. The imported observer only reads the actual notebook. All deliberate
external notebook changes are separate stimuli followed by a fresh baseline.
"""
import sys
sys.dont_write_bytecode = True
import copy, functools, http.server, importlib.util, json, os, subprocess
import re, tempfile, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('LEAF_EXCHANGE_ARTIFACTS') or tempfile.mkdtemp(prefix='lg414-native-'))
OUT.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location('exchange_pollen_helpers', ROOT/'test/pollen-path-browser.py')
pollen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pollen)
k, h = pollen.k, pollen.h
h.OUT = OUT
R = '[data-leaf-exchange-root]'
ENTRY = 'Compare a leaf’s gas accounts'
contexts, pages = [], []
CONTENT = json.loads(subprocess.check_output(['node','--input-type=module','-e',
    "import{leafExchangeCopy as copy,leafExchangeTrails as trails,leafExchangeTeaching as teaching}from'./dist/leaf-exchange-content.mjs';console.log(JSON.stringify({copy,trails,teaching}));"], cwd=ROOT,text=True))



def setup(browser, base, seed, label, width=820):
    class RecordedBrowser:
        def new_context(self, **options):
            ctx = browser.new_context(**options)
            ctx.add_init_script(pollen.SPEECH)
            return ctx
    ctx, p = k.native.setup(RecordedBrowser(), base, seed, width=width, observe=True)
    contexts.append(ctx)
    pages.append((p, label))
    pollen.layers(p)
    return p


def fixture(mode='negative'):
    # These are valid own-source records, deliberately absent from today's
    # catalogue. A repeated label cannot identify a marker kind or permission.
    code = '''
import {diffusionSource} from './dist/diffusion-tray-content.mjs';
import {newDiffusionWork,validDiffusionWork,diffusionCounts} from './dist/diffusion-tray-core.mjs';
const mode=MODE;
const source=diffusionSource('left',19);
source.id='invented-earlier-custom-rule';source.title='Earlier <paper> & tray';
source.notice='Invented full source notice: PRIVATE-SOURCE-SENTINEL.';
source.ruleNotice='Invented saved rule permits the circle kind only; this is not the current catalogue.';
source.kinds.forEach(k=>k.label='Repeated <marker> & label');
if(mode==='closed')source.kinds.forEach(k=>k.canCross=false);
source.particles=source.particles.slice(0,4);
// Include two blocked diamonds; source counts are intentionally unlike left.
source.particles=[{id:'a',kindId:'circle',side:'left'},{id:'b',kindId:'circle',side:'right'},
{id:'c',kindId:'diamond',side:'left'},{id:'d',kindId:'diamond',side:'right'}];
const work=newDiffusionWork(source);
if(!['zero','closed'].includes(mode)){
 work.steps=4;
 const count=work.crossings[0];
 if(mode==='negative'){count.leftToRight=0;count.rightToLeft=1;work.current[1].side='left';work.previous[1].side='left';}
 if(mode==='positive'){count.leftToRight=1;count.rightToLeft=0;work.current[0].side='right';work.previous[0].side='right';}
 if(mode==='equal'){count.leftToRight=1;count.rightToLeft=1;}
}
if(!validDiffusionWork(source,work))throw Error('Invalid independent synthetic fixture');
console.log(JSON.stringify({raw:{id:'diffusion-run-9',source,work},counts:diffusionCounts(source,work)}));
'''.replace('MODE', json.dumps(mode))
    frozen = json.loads(subprocess.check_output(['node','--input-type=module','-e',code], cwd=ROOT, text=True))
    data = pollen.fixture()
    data['diffusionRuns'] = [frozen['raw'], {'id':'diffusion-run-10','source':{'v':99},'work':{'v':99}}]
    return data


def sel(action, value=None):
    return '[data-leaf-exchange-action="'+action+'"]'+('' if value is None else '[data-leaf-exchange-value="'+str(value)+'"]')


def act(p, action, value=None, before=None):
    control = p.locator(('select' if action in ['photo','resp','trail','lesson','kind'] else '')+sel(action, None if action in ['photo','resp','trail','lesson','kind'] else value))
    if action in ['photo','resp','trail','lesson','kind']:
        control.select_option(str(value))
    else:
        control.tap()
    if before is not None:
        k.unchanged(p, before, action+' '+str(value))


def enter(p, before=None):
    p.get_by_role('button', name=ENTRY, exact=True).tap()
    p.locator(R).wait_for()
    h.ok(not p.locator('[data-ll-root]').count(), 'child replaces full parent')
    if before is not None:
        k.unchanged(p, before, 'entry')


def text(p):
    return p.locator(R).inner_text()


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    controls = p.locator(R+' button,'+R+' select,'+R+' a,'+R+' summary,main:has('+R+') .speech-controls summary,main:has('+R+') .speech-controls select')
    bad = controls.evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().width<43.9||e.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>e.textContent)''')
    h.ok(not bad, 'native44px targets and16px text: '+str(bad))
    h.ok(p.locator(R+' svg').evaluate_all('''xs=>xs.every(e=>{const b=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();return b.width>0&&b.height>0&&b.left>=p.left-1&&b.right<=p.right+1&&e.getAttribute('aria-hidden')==='true'&&!e.querySelector('text,animate,animateTransform')})'''), 'decorative contained diagrams with ordinary HTML labels')
    voice = p.locator('.speech-controls:visible')
    if voice.count():
        v = voice.evaluate('''e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return {position:s.position,transform:s.transform,left:b.left,right:b.right,overlap:[...document.querySelectorAll('[data-leaf-exchange-root] svg')].some(n=>{const a=n.getBoundingClientRect();return Math.min(a.right,b.right)>Math.max(a.left,b.left)&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)})}}''')
        h.ok(v['position']=='static' and v['transform']=='none' and v['left']>=0 and v['right']<=p.viewport_size['width']+1 and not v['overlap'], 'actual voice panel in flow and clear of diagrams')


def hear(p, before, includes=(), excludes=()):
    n = p.evaluate('pollenSpoken.length')
    p.locator('[data-leaf-exchange-hear]').tap()
    spoken = p.evaluate('pollenSpoken')
    h.ok(len(spoken)==n+1, 'one real shared speech request')
    result = spoken[-1]
    c=CONTENT['copy']
    expected=[c['title'],c['story']]
    if p.locator('select'+sel('photo')).count():
        trail=CONTENT['trails'][int(p.locator('select'+sel('trail')).input_value())]
        expected += [c['buildInstruction'],trail['title'],trail['prompt'],c['modelNote'],c['limitNote'],c['chipKey']]
        expected += p.locator('[data-leaf-exchange-row]').all_text_contents()
        expected += p.locator('.leaf-exchange-results p').all_text_contents()
        expected += [p.locator('[data-leaf-exchange-link-caption]').inner_text(),c['pairNote']]
    else:
        lesson=int(p.locator('select'+sel('lesson')).input_value());card=CONTENT['teaching'][lesson]
        expected += [card['title'],card['text'],card['caption'],c['workedLabel']]
        if lesson==3:
            if p.locator('[data-leaf-exchange-copy]').count():
                copied_box=p.locator('[data-leaf-exchange-copy]')
                expected += [c['copyHeading']]+copied_box.locator(':scope>p').all_text_contents()
            else:expected += [c['noCopy']]
    expected += [c['visitNote']]
    raw_expected=' '.join(expected)
    h.ok(p.locator('[data-leaf-exchange-hear]').get_attribute('data-speak')==raw_expected,'full exact current narration before shared arithmetic pronunciation')
    spoken_expected=re.sub(' +',' ',raw_expected.replace('×',' times ').replace('−',' minus ').replace('=',' equals ')).strip()
    h.ok(result==spoken_expected,'shared utterance contains exactly current narration with spoken arithmetic')
    for phrase in includes:
        h.ok(result.count(phrase)==1, 'Hear reads current phrase once: '+phrase)
    h.ok(not any(s in result for s in excludes), 'Hear excludes other cards, full source, controls and SVG')
    k.unchanged(p, before, 'Hear')
    bounds(p)
    return result


def geometry(p, photo, resp, gas, paired, svg=None, number_line=True):
    svg = svg or p.locator(R+' svg[viewBox="0 0 640 330"]').first
    g = svg.evaluate('''e=>({rects:[...e.querySelectorAll('rect')].filter(n=>+n.getAttribute('width')===64&&+n.getAttribute('height')===58).map(n=>({x:+n.getAttribute('x'),y:+n.getAttribute('y')})),dots:[...e.querySelectorAll('circle')].map(n=>({x:+n.getAttribute('cx'),y:+n.getAttribute('cy'),r:+n.getAttribute('r')})),lines:[...e.querySelectorAll('line')].map(n=>({x1:+n.getAttribute('x1'),x2:+n.getAttribute('x2'),y1:+n.getAttribute('y1'),y2:+n.getAttribute('y2'),dash:getComputedStyle(n).strokeDasharray,width:parseFloat(getComputedStyle(n).strokeWidth)}))})''')
    expected_rects = [{'x':70+100*i-32,'y':y-29} for count,y in [(photo,75),(resp,200)] for i in range(count)]
    expected_dots = [{'x':70+100*i+dx,'y':y+dy,'r':6} for count,y in [(photo,75),(resp,200)] for i in range(count) for dy in [-10,10] for dx in [-16,0,16]]
    h.ok(g['rects']==expected_rects, 'exact visible bundle positions and counts')
    h.ok(sorted(g['dots'],key=lambda n:(n['y'],n['x']))==sorted(expected_dots,key=lambda n:(n['y'],n['x'])), 'each bundle contains six correctly positioned dots')
    links = [n for n in g['lines'] if n['y1']==104 and n['y2']==171]
    h.ok(len(links)==(min(photo,resp) if paired else 0) and all(n['x1']==n['x2']==70+100*i and n['dash']!='none' for i,n in enumerate(links)), 'dotted nondirectional links retain both rows')
    if number_line:
        net = 6*(photo-resp)*(1 if gas=='oxygen' else -1)
        pins = [n for n in g['lines'] if n['y1']==276 and n['y2']==294]
        h.ok(len(pins)==1 and pins[0]['x1']==pins[0]['x2']==320+7*net, 'actual net pin exact independent signed mapping '+str(net))
        ticks = [n for n in g['lines'] if n['y1']<=285<=n['y2'] and n not in pins and n['x1']==n['x2']]
        h.ok(all(any(n['x1']==320+7*v for n in ticks) for v in range(-36,37,6)), 'number line ticks every six')
        h.ok(not ticks or pins[0]['width']>max(n['width'] for n in ticks), 'pin visibly thicker than ticks')


def build_expected(p, photo, resp, gas, paired):
    made, used = (6*photo,6*resp) if gas=='oxygen' else (6*resp,6*photo)
    net = made-used
    body = text(p)
    name='oxygen' if gas=='oxygen' else 'carbon dioxide'
    captions=[]
    for label,n,role in [('Photosynthesis',photo,'made' if gas=='oxygen' else 'used'),('Respiration',resp,'used' if gas=='oxygen' else 'made')]:
        captions.append(f'No {label.lower()} groups in this comparison. 0 {name} molecules {role}.' if n==0 else f'{label}: {n} '+('group' if n==1 else 'groups')+f' × 6 = {6*n} {name} molecules {role}.')
    h.ok(p.locator('[data-leaf-exchange-row]').all_text_contents()==captions,'HTML independently names gas, process, zero/group count and made/used role')
    selected=('Oxygen' if gas=='oxygen' else 'Carbon dioxide')+' net: '+(('+'+str(net)) if net>0 else str(net).replace('-','−'))+' molecules.'
    h.ok(p.locator('[data-leaf-exchange-net]').inner_text()==selected,'readable exact selected signed net')
    h.ok(str(made) in body and str(used) in body and ('+'+str(net) if net>0 else str(net).replace('-', '−')) in body, 'current HTML has independently calculated totals and signed difference')
    geometry(p, photo, resp, gas, paired)


def journey(browser, base, seed):
    p = setup(browser,base,seed,'tablet')
    notes = pollen.normalized_report(h.export_notes(p,'notes-before'))
    pollen.layers(p)
    k.click(p,'[data-ll-turn="1"]')
    for value in ['h-person','h-cell','h-organ']:
        k.click(p,'[data-ll-add="'+value+'"]')
    k.click(p,'[data-ll-strip-card="h-cell"]')
    p.locator('[data-ll-direction]').select_option('whole-to-part')
    for name in ['order','chooser']:
        p.locator('[data-ll-fold="'+name+'"]').evaluate('e=>e.open=true')
    p.wait_for_timeout(30)
    frame,before = k.parent_frame(p),k.snapshot(p)
    enter(p,before)
    h.ok(p.locator('#leaf-exchange-title').evaluate('e=>e===document.activeElement'), 'entry focuses title')
    h.ok(p.locator('select'+sel('photo')).input_value()=='2' and p.locator('select'+sel('resp')).input_value()=='1', 'initial2/1')
    # Boundary/contrast samples supplement all49 pure-source arithmetic cases.
    for photo,resp in [(0,0),(6,6),(6,0),(0,6),(3,1),(1,3)]:
        act(p,'photo',photo,before);act(p,'resp',resp,before)
        for key,n in [('photo',photo),('resp',resp)]:
            h.ok(p.locator('button'+sel(key)+'[data-leaf-exchange-direction=minus]').is_disabled()==(n==0) and p.locator('button'+sel(key)+'[data-leaf-exchange-direction=plus]').is_disabled()==(n==6),'native counter bounds')
        for gas in ['oxygen','carbon-dioxide']:
            act(p,'gas',gas,before)
            for paired in [False,True]:
                if (p.locator(sel('pair')).get_attribute('aria-pressed')=='true')!=paired:
                    act(p,'pair',before=before)
                build_expected(p,photo,resp,gas,paired)
        if photo==6 and resp==0:
            p.screenshot(path=str(OUT/'tablet-endpoint.png'),full_page=True)
    # Native increment/decrement at endpoints must leave focus on an enabled
    # opposite-direction control after the rendering replaces the old button.
    for key in ['photo','resp']:
        act(p,key,1,before)
        p.locator('button'+sel(key)+'[data-leaf-exchange-direction=minus]').tap()
        h.ok(p.locator('button'+sel(key)+'[data-leaf-exchange-direction=plus]').evaluate('e=>e===document.activeElement'),'zero boundary focus falls back to plus')
        act(p,key,5,before)
        p.locator('button'+sel(key)+'[data-leaf-exchange-direction=plus]').tap()
        h.ok(p.locator('button'+sel(key)+'[data-leaf-exchange-direction=minus]').evaluate('e=>e===document.activeElement'),'six boundary focus falls back to minus')
    act(p,'photo',1,before);act(p,'resp',3,before)
    for i in range(6):
        act(p,'trail',i,before)
        h.ok(p.locator('select'+sel('photo')).input_value()=='1' and p.locator('select'+sel('resp')).input_value()=='3', 'trail leaves both process counts literal')
    key = p.locator(R+' svg[viewBox="0 0 80 74"]')
    h.ok(key.count()==1 and key.locator('circle').count()==6, 'separate enlarged six-dot bundle key')
    h.ok(key.evaluate('e=>e.getBoundingClientRect().width>=79.9&&e.getBoundingClientRect().height>=73.9'), 'bundle key80x74 actual size')
    hear(p,before,includes=['Leaf Exchange','Links compare equal numbers in opposite entries. Both rows stay. No molecules disappear because we draw a link.'],excludes=['PRIVATE-SOURCE-SENTINEL','Your kept tray copy','Voice & speed'])
    p.screenshot(path=str(OUT/'tablet-populated.png'),full_page=True)
    act(p,'page','learn',before)
    titles = ['Two processes, two accounts.','Made minus used.','Zero does not mean empty.','An idea travels.']
    for i,title in enumerate(titles):
        act(p,'lesson',i,before)
        h.ok(title in p.locator(R+' article').inner_text() and all(t not in p.locator(R+' article').inner_text() for t in titles if t!=title), 'only current teaching card visible')
        if i==0:
            geometry(p,1,1,'oxygen',False,p.locator(R+' svg[viewBox="0 0 640 245"]'),False)
        elif i==1:
            geometry(p,3,1,'oxygen',True)
        elif i==2:
            svgs=p.locator(R+' svg[viewBox="0 0 640 245"]')
            geometry(p,0,0,'oxygen',False,svgs.nth(0),False)
            geometry(p,2,2,'oxygen',False,svgs.nth(1),False)
        else:
            copied(p,'negative',before)
            bars=p.locator(R+' svg[viewBox="0 0 360 120"] rect').evaluate_all('xs=>xs.map(n=>[+n.getAttribute("x"),+n.getAttribute("y"),+n.getAttribute("width"),+n.getAttribute("height")])')
            h.ok(bars==[[45+26*j,y,22,22] for n,y in [(8,25),(5,75)] for j in range(n)], 'worked8/5 cells keep fixed unit dimensions')
        hear(p,before,includes=[title,'Worked account · not your settings'],excludes=[t for t in titles if t!=title]+['PRIVATE-SOURCE-SENTINEL','Voice & speed'])
        p.screenshot(path=str(OUT/('tablet-card-'+str(i+1)+'.png')),full_page=True)
    h.ok(p.get_by_role('button',name='Next',exact=True).is_disabled(), 'last card boundary')
    act(p,'lesson',0,before)
    h.ok(p.get_by_role('button',name='Previous',exact=True).is_disabled(), 'first card boundary')
    act(p,'back',before=before)
    h.ok(k.parent_frame(p)==frame, 'exact draft return including current strip/folds/order/camera/turn')
    h.ok(p.get_by_role('button',name=ENTRY,exact=True).evaluate('e=>e===document.activeElement'), 'Back focuses its entry')
    # Other independent child work survives exchange and parent screen visits.
    k.open_kitchen(p,before);k.place(p,'water','gas',before);k.action(p,k.C['back'],before)
    p.get_by_role('button',name=pollen.ENTRY,exact=True).tap()
    p.locator(pollen.R).wait_for();pollen.act(p,'contact','a-anthers',before);pollen.act(p,'back',before=before)
    for target in [None,'[data-ll-shelf]','[data-ll-card="layer-guide-10"]']:
        if target:k.click(p,target)
        frame=k.parent_frame(p);enter(p,before);act(p,'page','build',before)
        h.ok(p.locator('select'+sel('photo')).input_value()=='1' and p.locator('select'+sel('resp')).input_value()=='3', 'local settings retained across parent frames')
        act(p,'back',before=before);h.ok(k.parent_frame(p)==frame,'draft/shelf/kept/unavailable parent frame exact')
    k.open_kitchen(p,before);h.ok(k.placements(p)['water']=='gas','Kitchen work retained');k.action(p,k.C['back'],before)
    p.get_by_role('button',name=pollen.ENTRY,exact=True).tap();p.locator(pollen.R).wait_for();pollen.marks(p,'A','none','none');pollen.act(p,'back',before=before)
    h.ok(pollen.normalized_report(h.export_notes(p,'notes-after'))==notes,'actual Notes exports bracket whole visit exactly except timestamp')


def copied(p,mode,before):
    body=text(p)
    for s in ['Your kept tray copy','It is not leaf data.','Run 1 · Earlier <paper> & tray','Repeated <marker> & label']:
        h.ok(s in body,'literal own-source copy: '+s)
    h.ok('PRIVATE-SOURCE-SENTINEL' not in hear(p,before,includes=['Your kept tray copy','It is not leaf data.','Repeated <marker> & label'],excludes=['PRIVATE-SOURCE-SENTINEL']), 'closed full source excluded')
    counts={'negative':(0,1),'positive':(1,0),'equal':(1,1),'zero':(0,0),'closed':(0,0)}[mode]
    left,right=counts
    h.ok(('Left to right: '+str(left)+' '+('crossing.' if left==1 else 'crossings.')) in body and ('Right to left: '+str(right)+' '+('crossing.' if right==1 else 'crossings.')) in body, 'independently specified own-source crossing counts')
    expected = 'Net: 1 marker '+('left to right.' if left>right else 'right to left.') if left!=right else ('Net: 0 markers; opposite crossing totals balance.' if left else 'Net: 0 markers. No crossings were counted for this marker kind.')
    h.ok(expected in body,'negative/positive/equal/empty narration distinction')
    h.ok(('Starting snapshot: no model step has been advanced.' if mode in ['zero','closed'] else 'Cumulative crossings by step 4.') in body,'saved step read literally')
    options=p.locator('select'+sel('kind')+' option').all_text_contents()
    h.ok(options==['Kind 1 · Repeated <marker> & label','Kind 2 · Repeated <marker> & label'],'repeated labels distinguished by ordinal')
    act(p,'kind',1,before)
    h.ok('This saved model did not allow this kind to cross.' in text(p) and 'Net: 0 markers. No crossings were counted for this marker kind.' in text(p),'blocked diamond permission and zero totals')
    act(p,'kind',0,before)


def copy_probes(browser,base):
    for mode in ['positive','equal','zero','closed']:
        p=setup(browser,base,fixture(mode),'copy-'+mode)
        before=k.snapshot(p);enter(p,before);act(p,'page','learn',before);act(p,'lesson',3,before);copied(p,mode,before)
    p=setup(browser,base,fixture(),'frozen-copy')
    before=k.snapshot(p);enter(p,before);act(p,'page','learn',before);act(p,'lesson',3,before)
    # Deliberately replace the actual saved source/count record AFTER capture;
    # ordinary child controls must preserve this new unsaved baseline exactly.
    old=text(p)
    p.evaluate('''()=>{const b=window.__curveObservedState();b.diffusionRuns[0]={id:'diffusion-run-9',source:{v:99,title:'Invented changed title'},work:{v:99}};}''')
    changed=k.snapshot(p)
    h.ok(changed['memory']!=before['memory'] and changed['persisted']==before['persisted'],'explicit unsaved replacement separated from preservation baseline')
    act(p,'back',before=changed);enter(p,changed)
    h.ok(text(p)==old,'entry copy retains primitive fields after raw record replacement')
    for mode in ['missing','unreadable']:
        data=fixture()
        if mode=='missing':data.pop('diffusionRuns')
        else:data['diffusionRuns']=[{'id':'diffusion-run-1','source':{'v':99},'work':{'v':99}}]
        p=setup(browser,base,data,'null-'+mode);enter(p);act(p,'page','learn');act(p,'lesson',3)
        no='No readable kept Diffusion Tray model was available when you opened this activity. The worked example is open anyway.'
        before=k.snapshot(p)
        hear(p,before,includes=[no],excludes=['Your kept tray copy','It is not leaf data.','Use these two counts to explain the net.'])
        # Deliberately add readable source after a final null capture.
        raw=fixture()['diffusionRuns'][0]
        p.evaluate('(raw)=>{window.__curveObservedState().diffusionRuns=[raw]}',raw)
        changed=k.snapshot(p);act(p,'back',before=changed);enter(p,changed)
        h.ok(no in text(p) and 'Your kept tray copy' not in text(p),'null captured once even after notebook gains a readable record')


def guards(browser,base,seed):
    for mode in ['removed-reinserted','reparented','hidden-unhidden','control-hidden-unhidden','root-removed-reinserted']:
        p=setup(browser,base,seed,'guard-'+mode);before=k.snapshot(p);enter(p,before)
        control=k.retain(p,sel('gas','carbon-dioxide'));voice=k.retain(p,'[data-leaf-exchange-hear]')
        voice.evaluate('e=>e.dataset.speak="Invented stale sentinel"');n=p.evaluate('pollenSpoken.length')
        if mode=='removed-reinserted':
            for node in [control,voice]:node.evaluate('e=>{const p=e.parentNode;e.remove();p.append(e)}')
        elif mode=='reparented':
            for node in [control,voice]:node.evaluate('e=>document.querySelector("main").append(e)')
        elif mode=='hidden-unhidden':p.locator(R).evaluate('e=>{e.hidden=true;e.hidden=false}')
        elif mode=='control-hidden-unhidden':
            for node in [control,voice]:node.evaluate('e=>{e.style.display="none";e.style.display=""}')
        else:p.locator(R).evaluate('e=>{const p=e.parentNode;e.remove();p.append(e)}')
        p.wait_for_timeout(30);k.dispatch(control);k.dispatch(voice)
        h.ok(p.evaluate('pollenSpoken.length')==n and voice.get_attribute('data-speak')=='Invented stale sentinel',mode+' blocks before narration and shared speech')
        h.ok(p.locator(sel('gas','oxygen')).get_attribute('aria-pressed')=='true',mode+' cannot change gas')
        k.unchanged(p,before,mode)


def lifecycle(browser,base,seed):
    p=setup(browser,base,seed,'lifecycle');enter(p);act(p,'photo',6)
    old=k.retain(p,'[data-leaf-exchange-hear]')
    k.click(p,'#explorer-switch');k.click(p,'[data-select-explorer="explorer-2"]');p.locator('[data-ll-root]').wait_for()
    baseline=k.snapshot(p);n=p.evaluate('pollenSpoken.length');k.dispatch(old)
    h.ok(p.evaluate('pollenSpoken.length')==n,'old owner Hear blocked');k.unchanged(p,baseline,'owner switch')
    enter(p,baseline);h.ok(p.locator('select'+sel('photo')).input_value()=='2','new owner fresh defaults')
    old=k.retain(p,sel('gas','carbon-dioxide'))
    report=h.export_notes(p,'lifecycle-import')
    p.locator('#progress-file').set_input_files({'name':'invented-exchange.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
    k.click(p,'#progress-import-confirm');p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
    pollen.layers(p);baseline=k.snapshot(p);k.dispatch(old);k.unchanged(p,baseline,'old book after actual import');enter(p,baseline)
    h.ok(p.locator('select'+sel('photo')).input_value()=='2','import fresh model')
    act(p,'photo',6);old=k.retain(p,sel('gas','carbon-dioxide'))
    p.evaluate('location.hash="#notes"');k.click(p,'#reset');k.click(p,'#confirm-reset')
    p.locator('[data-film-skip]').wait_for();k.click(p,'[data-film-skip]');pollen.layers(p)
    baseline=k.snapshot(p);k.dispatch(old);k.unchanged(p,baseline,'old control after reset');enter(p,baseline)
    h.ok(p.locator('select'+sel('photo')).input_value()=='2','reset fresh defaults')
    act(p,'photo',6);act(p,'page','learn');p.get_by_text('Where this idea goes',exact=True).click()
    h.ok('Leaving Living Layers clears this model and guides you have not kept.' in text(p),'exit loss warning visible before links')
    p.locator(R+' a[href="#science/ice"]').tap();p.locator(R).wait_for(state='detached');pollen.layers(p);enter(p)
    h.ok(p.locator('select'+sel('photo')).input_value()=='2','warned route exit fresh defaults')
    act(p,'photo',6);p.reload(wait_until='networkidle')
    if p.locator('[data-select-explorer]').count():p.locator('[data-select-explorer]').first.click()
    p.locator('[data-ll-root]').wait_for();enter(p)
    h.ok(p.locator('select'+sel('photo')).input_value()=='2','reload discards visit')


def changed_parent(browser,base,seed):
    p=setup(browser,base,seed,'changed-parent');k.click(p,'[data-ll-shelf]');k.click(p,'[data-ll-card="layer-guide-10"]')
    before=k.snapshot(p);enter(p,before);act(p,'photo',5,before)
    old_back=k.retain(p,sel('back'));old_hear=k.retain(p,'[data-leaf-exchange-hear]')
    # Explicit, unsaved external parent replacement is separate from all child
    # preservation assertions. No test-only writer exists in the app host.
    p.evaluate('''()=>{const r=window.__curveObservedState().layerGuides[9];r.source={v:99,title:'Invented replaced parent'};r.work={v:99};}''')
    changed=k.snapshot(p);h.ok(changed['memory']!=before['memory'] and changed['persisted']==before['persisted'],'external replacement distinguishable')
    n=p.evaluate('pollenSpoken.length');k.dispatch(old_hear)
    h.ok(p.evaluate('pollenSpoken.length')==n,'raw parent invalidation checked before shared speech')
    p.locator('[data-ll-root]').wait_for();k.unchanged(p,changed,'current parent recovery');enter(p,changed)
    h.ok(p.locator('select'+sel('photo')).input_value()=='5','parent invalidation retains independent child work')
    k.dispatch(old_back);h.ok(p.locator(R).count()==1,'stale Back cannot close later entry')
    act(p,'back',before=changed);h.ok('unavailable' in p.locator('#ll-title').inner_text(),'current unavailable frame restored')


def conditions(browser,base,seed):
    for mode in ['saving-off','refused-notes','storage-failure']:
        data=copy.deepcopy(seed)
        if mode=='refused-notes':
            data['syntheticSibling']['payload']='z'*(5*1024*1024-len(json.dumps(data,indent=2).encode())-512)
        p=setup(browser,base,data,mode)
        if mode=='saving-off':
            p.evaluate('location.hash="#notes"');k.click(p,'#remember');k.click(p,'dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]');pollen.layers(p)
        elif mode=='refused-notes':
            before=k.snapshot(p);k.click(p,'[data-ll-keep]');k.unchanged(p,before,'actual oversized Notes refusal')
            h.ok('has not been kept' in p.locator('#ll-status').inner_text(),'capacity refusal exercised')
        else:
            p.evaluate('''()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Invented fault','QuotaExceededError');return set.call(this,k,v)}}''')
        before=k.snapshot(p);enter(p,before);act(p,'photo',0,before);act(p,'pair',before=before);act(p,'page','learn',before);act(p,'lesson',3,before);hear(p,before,includes=['An idea travels.']);act(p,'back',before=before)
    p=setup(browser,base,seed,'midnight');before=k.snapshot(p);enter(p,before)
    p.clock.set_fixed_time(p.evaluate('Date.now()+26*60*60*1000'));act(p,'page','learn')
    after=k.snapshot(p)
    h.ok(after['memory']==before['memory'] and after['persisted']==before['persisted'],'midnight leaves both notebooks exact')
    changed={key for key in before['storage'].keys()|after['storage'].keys() if before['storage'].get(key)!=after['storage'].get(key)}
    h.ok(changed=={'learning-garden-rooms-v1:explorer-1'},'only existing midnight room bookkeeping changes: '+str(changed))


def phone(browser,base,seed):
    p=setup(browser,base,seed,'phone',320);before=k.snapshot(p);enter(p,before)
    act(p,'photo',6,before);act(p,'resp',6,before);act(p,'pair',before=before);build_expected(p,6,6,'oxygen',True)
    hear(p,before,includes=['Oxygen net: 0 molecules.']);bounds(p)
    p.screenshot(path=str(OUT/'phone-populated.png'),full_page=True)
    act(p,'resp',0,before);build_expected(p,6,0,'oxygen',True);bounds(p)
    p.screenshot(path=str(OUT/'phone-endpoint.png'),full_page=True)
    act(p,'page','learn',before)
    for i in range(4):
        act(p,'lesson',i,before);bounds(p);p.screenshot(path=str(OUT/('phone-card-'+str(i+1)+'.png')),full_page=True)


def main():
    server=None;base=os.environ.get('LEAF_EXCHANGE_TEST_URL')
    try:
        if not base:
            class Quiet(http.server.SimpleHTTPRequestHandler):
                def log_message(self,*args):pass
            class Server(http.server.ThreadingHTTPServer):
                daemon_threads=True
                request_queue_size=128
            server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
            threading.Thread(target=server.serve_forever,daemon=True).start()
            base='http://127.0.0.1:'+str(server.server_port)+'/'
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
            try:
                seed=fixture();journey(browser,base,seed);copy_probes(browser,base);guards(browser,base,seed)
                changed_parent(browser,base,seed);lifecycle(browser,base,seed);conditions(browser,base,seed);phone(browser,base,seed)
                h.ok(not h.errors,'no page/console/HTTP errors: '+str(h.errors))
                receipt={'status':'passed','checks':h.checks,'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'tree':subprocess.check_output(['git','rev-parse','HEAD^{tree}'],cwd=ROOT,text=True).strip(),'workingStatus':subprocess.check_output(['git','status','--porcelain'],cwd=ROOT,text=True),'errors':h.errors,'scope':'Actual app and pure actual notebook getter, persisted notebook and all same-day storage equality; actual Notes before/after. Synthetic own-source375 runs; separately labelled unsaved replacements. One tablet visit and focused320px geometry; speech request recorder, not audible speech. Full49-pair mathematics belongs to source suite.'}
                (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print('Leaf Exchange browser:',h.checks,'checks passed; artifacts',OUT)
            except Exception:
                (OUT/'failure.txt').write_text(traceback.format_exc())
                for p,label in pages:
                    if not p.is_closed():
                        try:p.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True);(OUT/(label+'-failure.html')).write_text(p.content())
                        except Exception:pass
                raise
            finally:
                for ctx in contexts:ctx.close()
                browser.close()
    finally:
        if server:server.shutdown();server.server_close()


if __name__=='__main__':main()
