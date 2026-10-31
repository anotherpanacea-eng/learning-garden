"""Synthetic297 native Chrome checks: rendered geometry and app ownership.

HINGE_TEST_URL may select the canonical deployment. Tests use the actual app,
ordinary controls and real downloads; no app-module interception. Physical
iPad/Safari, audible output, screen-reader speech and learning effects are not
established here.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,math,os,re,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('HINGE_ARTIFACTS',tempfile.mkdtemp(prefix='hinge-')));OUT.mkdir(parents=True,exist_ok=True)
os.environ['RHYTHM_ARTIFACTS']=str(OUT)
spec=importlib.util.spec_from_file_location('native_helpers',ROOT/'test/rhythm-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
ROUTE='#workshop/hinge'
ORACLES=[('same-turn',[60,2,2,0],[60,1,3,0]),('tips-trick',[110,1,1,0],[45,3,3,0]),('tilted-square',[90,2,3,0],[110,3,1,60]),('near-right',[85,2,2,0],[95,2,2,0]),('straight',[180,2,2,15],[150,3,3,15]),('long-way',[270,2,2,0],[90,2,2,0]),('full-turn',[360,2,2,0],[0,1,3,0])]
COINCIDENT='Gold and blue point along the same ray. The marked sweep tells us whether this is no turn or one full turn.'
FRAMES=[([60,1,1,0],[60,1,1,0]),([60,1,1,0],[60,3,3,0]),([110,1,1,0],[45,3,3,0]),([60,2,2,0],[60,2,2,120]),([0,2,3,0],[360,2,3,0])]
def sel(a):return f'[data-hinge-action="{a}"]'
def click(p,a):h.click(p,sel(a))
def tool(p,name):h.click(p,sel('tool')+f'[data-hinge-tool="{name}"]')
def choose(p,identity):p.locator('[data-hinge-case]').select_option(identity)
def figure(p,identity='working'):return p.locator(f'[data-hinge-figure="{identity}"]')
def pose(p,identity='working'):
    s=figure(p,identity).locator('svg');return [int(s.get_attribute('data-hinge-'+k)) for k in ['opening','gold','blue','tilt']]
def near(a,b,message):h.ok(abs(a-b)<.00002,f'{message}: {a} vs {b}')
def line(p,side,identity='working',layer='main',tail=False):
    target=figure(p,identity).locator(f'[data-hinge-{layer}] [data-hinge-ray="{side}"] [data-hinge-'+('tail' if tail else 'solid')+']')
    return [float(target.get_attribute(k)) for k in ['x1','y1','x2','y2']]
def pointlist(s):return [[float(v) for v in x.split(',')] for x in s.split()]
def distance(a,b):return math.hypot(a[0]-b[0],a[1]-b[1])
def geometry(p,expected,identity='working',layer='main'):
    opening,gold,blue,tilt=expected;f=figure(p,identity);s=f.locator('svg')
    if layer=='main':h.ok(pose(p,identity)==expected,'measured material agrees with independent fixture '+identity)
    rays={}
    for side,length in [('gold',gold),('blue',blue)]:
        x,y,ex,ey=line(p,side,identity,layer);near(x,130,'common pin x');near(y,130,'common pin y');near(distance([x,y],[ex,ey]),length*32,'visible radius, not angle size');rays[side]=[ex,ey]
        a,b,tx,ty=line(p,side,identity,layer,True);near(a,ex,'continuation starts at solid endpoint');near(b,ey,'continuation start y');near(distance([ex,ey],[tx,ty]),8,'complete continuation bounded to8px')
        triangle=pointlist(f.locator(f'[data-hinge-{layer}] [data-hinge-ray="{side}"] polygon').get_attribute('points'));near(distance(triangle[0],[tx,ty]),0,'arrowhead ends at bounded continuation');near(distance(triangle[1],triangle[2]),6,'arrowhead width');
        h.ok(all(26-.00001<=v<=234+.00001 for pt in triangle for v in pt),'all arrowheads remain inside viewport')
    gold_angle=math.degrees(math.atan2(130-rays['gold'][1],rays['gold'][0]-130))%360
    blue_angle=math.degrees(math.atan2(130-rays['blue'][1],rays['blue'][0]-130))%360
    diff=(blue_angle-gold_angle)%360;target=opening%360;h.ok(min(abs(diff-target),abs(diff-target-360),abs(diff-target+360))<.00001,'actual endpoint directions match selected sweep modulofullturn')
    path=f.locator(f'[data-hinge-{layer}] [data-hinge-sweep]')
    if opening==0:h.ok(path.count()==0,'zero has no misleading full path')
    else:
        d=path.get_attribute('d');flags=re.findall(r'A20 20 0 ([01]) ([01])',d)
        h.ok(flags==([('0','0'),('0','0')] if opening==360 else [('1' if opening>180 else '0','0')]),'actual SVG counterclockwise and full/reflex arc flags')
        h.ok(path.get_attribute('data-hinge-sweep')==('full' if opening==360 else 'partial'),'full is not normalized tozero')
    marks=f.locator(f'[data-hinge-{layer}] [data-hinge-right-mark]');h.ok(marks.count()==(1 if opening==90 else 0),'right mark only for selected90, notreflex270')
    if layer=='main':
        h.ok(str(opening)+'°' in f.locator('.hinge-measure').inner_text(),'textual measure matches actual drawing')
        h.ok('No turn' in f.locator('.hinge-sweep-label').inner_text() if opening==0 else 'One full turn' in f.locator('.hinge-sweep-label').inner_text() if opening==360 else True,'coincident ray sweep label explicit')
    if layer=='main' and opening in [0,360]:
        h.ok(COINCIDENT in f.locator('figcaption').inner_text() and COINCIDENT in s.locator('title').text_content(),'plain same-ray explanation in caption and SVG accessible title')
    return rays
def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
    bad=p.locator('[data-hinge-root] button,[data-hinge-root] a,[data-hinge-root] select,[data-hinge-root] summary').evaluate_all('xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().width<44||x.getBoundingClientRect().height<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent,w:x.offsetWidth,h:x.offsetHeight}))')
    h.ok(not bad,'44px/16px controls '+str(bad))
    sizes=p.locator('[data-hinge-figure] svg').evaluate_all('xs=>xs.map(x=>x.getBoundingClientRect().width)');h.ok(len(sizes)==2 and abs(sizes[0]-sizes[1])<.01,'both diagrams share actual rendered scale')
def setup(browser,base,seed,width,label,height=1000):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True);h.contexts.append(c)
    c.add_init_script('(seed=>{if(!localStorage.getItem("hinge-fixture")){const p={id:"explorer-1",avatar:"sky",color:"gold",symbol:"leaf",createdAt:"2026-10-29T12:00:00.000Z"};localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:p.id,explorers:[p]}));localStorage.setItem("number-garden-v1:"+p.id,JSON.stringify(seed));localStorage.setItem("hinge-fixture","1");}})('+json.dumps(seed)+')')
    p=c.new_page();h.pages.append((p,label));p.set_default_timeout(12000);p.on('pageerror',lambda e:h.errors.append({'case':label,'error':str(e)}));p.on('console',lambda e:h.console_errors.append({'case':label,'error':e.text}) if e.type=='error' else None)
    h.go(p,base,ROUTE,'[data-hinge-root]');return c,p
def opening(p,target):
    tool(p,'turn')
    while pose(p)[0]!=target:
        delta=target-pose(p)[0];click(p,('quarter-more' if delta>=90 else 'more') if delta>0 else ('quarter-back' if delta<=-90 else 'back'))
def download(p,label):
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
    with p.expect_download() as event:h.click(p,'#download')
    path=OUT/(label+'.json');event.value.save_as(path);return path,json.loads(path.read_text())
def journey(browser,base,seed,width,height):
    c,p=setup(browser,base,seed,width,f'journey-{width}',height);before=h.book(p);h.ok(before==seed,'direct entry leaves every notebook root unchanged')
    for identity,ref,start in ORACLES:
        choose(p,identity);geometry(p,ref,'reference');geometry(p,start);bounds(p);click(p,'card');h.ok(figure(p).locator('[data-hinge-card]').count()==1,'quarter card offered before type comparison');click(p,'compare');geometry(p,[ref[0],ref[1],ref[2],start[3]],layer='overlay');h.ok(p.locator('#hinge-comparison').evaluate('x=>document.activeElement===x'),'Compare focuses interpretation heading');h.ok(p.locator('#hinge-comparison').evaluate('x=>x.tagName')=='H3','comparison focus is semantic heading');text=p.locator('.hinge-comparison').inner_text();h.ok(('Same selected turn' if start[0]==ref[0] else 'My selected turn is '+('smaller' if start[0]<ref[0] else 'larger')) in text,'comparison states actual selected-degree relation');
        h.ok(h.book(p)==before,'geometry/help/compare writes no notebook data')
        if identity=='tips-trick':
            for tail in [False,True]:
                def gap(which):return distance(line(p,'gold',which,tail=tail)[2:],line(p,'blue',which,tail=tail)[2:])
                h.ok(gap('working')>gap('reference'),'actual solid and arrowhead tip-gap contrast');
            p.screenshot(path=str(OUT/f'tip-gap-{width}.png'),full_page=True);p.screenshot(path=str(OUT/f'tip-gap-viewport-{width}.png'))
        if identity=='full-turn':
            p.locator('[data-hinge-root] [data-speak]').click();h.ok(p.locator('[data-hinge-root] [data-speak]').get_attribute('data-speak').count(COINCIDENT)==2,'Hear includes same-ray explanation for both zero and full figures');
            styles=figure(p).locator('[data-hinge-main] [data-hinge-solid]').evaluate_all('xs=>xs.map(x=>({width:parseFloat(getComputedStyle(x).strokeWidth),dash:getComputedStyle(x).strokeDasharray}))');h.ok(styles[0]['width']>styles[1]['width'] and styles[1]['dash']!='none','coincident arms remain distinct by width and line style');p.screenshot(path=str(OUT/f'zero-full-{width}.png'),full_page=True)
    # Every type boundary uses actual buttons, not injected module state.
    for target in [5,85,90,95,175,180,185,270,355,360,0]:
        opening(p,target);geometry(p,[target,1,3,0]);
        if target in [0,360]:
            p.locator('[data-hinge-root] [data-speak]').click();h.ok(COINCIDENT in p.locator('[data-hinge-root] [data-speak]').get_attribute('data-speak'),'edited zero/full Hear has same-ray explanation');
        click(p,'compare');classification='Zero turn' if target==0 else 'Acute' if target<90 else 'Right angle' if target==90 else 'Obtuse' if target<180 else 'Straight angle' if target==180 else 'Reflex' if target<360 else 'Full turn';h.ok(f'My hinge: {target}°. {classification}' in p.locator('.hinge-comparison').inner_text(),'interpreted type matches independently classified degree');h.ok(p.locator(sel('more')).is_disabled()==(target==360),'upper endpoint native state');h.ok(p.locator(sel('back')).is_disabled()==(target==0),'lower endpoint native state');h.ok(p.locator(sel('quarter-more')).is_disabled()==(target>270),'quarter overshoot is unavailable');h.ok(p.locator(sel('quarter-back')).is_disabled()==(target<90),'quarter back underflow unavailable')
    choose(p,'same-turn');opening(p,75);tool(p,'arms');click(p,'gold-more');click(p,'gold-more');click(p,'blue-less');click(p,'blue-less');h.ok(pose(p)==[75,3,1,0],'independent lengths preserve turn');tool(p,'picture');
    for _ in range(3):click(p,'turn')
    h.ok(pose(p)==[75,3,1,45],'whole picture preserves selected turn');
    if p.locator(sel('card')).get_attribute('aria-pressed')!='true':click(p,'card')
    click(p,'compare');expected=pose(p);choose(p,'near-right');choose(p,'same-turn');h.ok(pose(p)==expected,'case switch retains exact material');h.ok(figure(p).locator('[data-hinge-card]').count()==1 and p.locator('#hinge-comparison').count()==1,'case retains card and interpretation');
    click(p,'example');
    for i,(ref,work) in enumerate(FRAMES):
        geometry(p,ref,'example-reference');geometry(p,work,'example-working');h.ok('Worked example, not your hinge' in p.locator('.hinge-example-label').inner_text(),'example ownership each frame');p.locator('[data-hinge-root] [data-speak]').click();words=p.locator('[data-hinge-root] [data-speak]').get_attribute('data-speak');h.ok('Worked example, not your hinge' in words and 'Example reference' in words and 'Example working hinge' in words,'narration ownership matches figures');
        if i==2:
            for tail in [False,True]:h.ok(distance(line(p,'gold','example-working',tail=tail)[2:],line(p,'blue','example-working',tail=tail)[2:])>distance(line(p,'gold','example-reference',tail=tail)[2:],line(p,'blue','example-reference',tail=tail)[2:]),'worked part3 solid and arrowhead tip contrast')
        if i==4:h.ok(words.count(COINCIDENT)==2,'worked part5 Hear explains same-ray zero and full')
        if i<4:click(p,'next')
    click(p,'close');h.ok(pose(p)==expected,'example leaves working material intact');h.ok(p.locator(sel('example')).evaluate('x=>document.activeElement===x'),'example returns focus to trigger');h.ok(h.book(p)==before,'all finite cases and examples preserve notebook');bounds(p)
    tool(p,'picture');click(p,'reset');h.ok(pose(p)==[60,1,3,0],'explicit reset own authored material');h.ok(figure(p).locator('[data-hinge-card]').count()==0 and p.locator('#hinge-comparison').count()==0,'reset clears helper views');
    tool(p,'turn');p.locator(sel('more')).focus();p.keyboard.press('Enter');h.ok(pose(p)[0]==65,'native keyboard Enter');p.keyboard.press('Space');h.ok(pose(p)[0]==70,'native keyboard Space');p.evaluate('window.__oldHingeMore=document.querySelector("[data-hinge-action=more]")');click(p,'more');p.evaluate('window.__oldHingeMore.click()');h.ok(pose(p)[0]==75,'departed material control inert');
    p.locator('[data-hinge-root] [data-speak]').click();words=p.locator('[data-hinge-root] [data-speak]').get_attribute('data-speak');h.ok('My hinge Selected turn 75°' in words,'narration current visible material');h.ok('not a tool for measuring real objects' not in words,'closed model details excluded from narration');p.locator('.hinge-about:not(.hinge-grownups) summary').click();h.ok('Ask what would change' not in p.locator('.hinge-about:not(.hinge-grownups)').inner_text(),'grown-up prompt kept out of the model explanation');h.ok('Ask what would change' in p.locator('.hinge-grownups').text_content(),'grown-up prompt kept under For grown-ups');p.locator('[data-hinge-root] [data-speak]').click();h.ok('not a tool for measuring real objects' in p.locator('[data-hinge-root] [data-speak]').get_attribute('data-speak'),'opened model explanation is readable');
    p.evaluate('()=>{window.__oldHingeHear=document.querySelector("[data-hinge-root] [data-speak]");window.__oldHingeHear.dataset.speak="";location.hash="#notes";window.__oldHingeHear.click()}');p.locator('#download').wait_for();h.ok(p.evaluate('window.__oldHingeHear.dataset.speak')=='','synchronously departed Hear cannot compose old request');p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-hinge-root]').wait_for();h.ok(pose(p)==[60,1,3,0],'route return is a new visit');
    path,report=download(p,f'notes-{width}');h.ok(report['hingeBench']==seed['hingeBench'],'unknown future hingeBench value is untouched raw material');h.ok(report['syntheticOther']==seed['syntheticOther'],'large sibling unchanged');old_id=h.active(p);old_owner=h.book(p)['hingeBench'];p.locator('#progress-file').set_input_files(str(path));p.locator('#progress-import-confirm').wait_for();h.click(p,'#progress-import-confirm');p.wait_for_function('old=>JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId!==old',arg=old_id);new_id=h.active(p);p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-hinge-root]').wait_for();p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for();
    if p.locator(f'[data-select-explorer="{new_id}"]').count():h.click(p,f'[data-select-explorer="{new_id}"]')
    p.locator('[data-hinge-root]').wait_for();h.ok(pose(p)==[60,1,3,0],'reload/import does not pretend visit settings were saved');_,again=download(p,f'redownload-{width}');h.ok(again['hingeBench']==report['hingeBench'] and again['syntheticOther']==report['syntheticOther'],'actual import/reload/redownload preserves unknown owner and large sibling');h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{old_id}"]');h.ok(h.book(p)['hingeBench']==old_owner,'original explorer intact');
    film=p.locator('dialog.welcome-film[open]')
    if film.count():film.locator('[data-film-skip]').click()
    # Reset only the imported explorer; old material cannot survive replacement.
    p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-hinge-root]').wait_for();h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{new_id}"]');p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-hinge-root]').wait_for();click(p,'more');p.evaluate('window.__beforeReset=document.querySelector("[data-hinge-action=more]")');p.evaluate('location.hash="#notes"');p.locator('#reset').wait_for();h.click(p,'#reset');h.click(p,'#confirm-reset');p.wait_for_function('location.hash==="#home"');film=p.locator('dialog.welcome-film[open]')
    if film.count():film.locator('[data-film-skip]').click()
    p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-hinge-root]').wait_for();p.evaluate('window.__beforeReset.click()');h.ok(pose(p)==[60,1,3,0],'Notes reset replaces notebook and invalidates old material');click(p,'more');h.ok(pose(p)[0]==65,'new visit after Notes reset remains playable');h.ok(p.evaluate('id=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',old_id)['hingeBench']==old_owner,'Notes reset preserves other explorer');c.close()
def interfaces(browser,base,seed):
    c,p=setup(browser,base,seed,820,'interfaces');tool(p,'turn');p.locator(sel('more')).scroll_into_view_if_needed();rect=p.locator(sel('more')).bounding_box();x,y=rect['x']+rect['width']/2,rect['y']+rect['height']/2
    for i in range(5):p.touchscreen.tap(x,y);h.ok(pose(p)[0]==65+i*5,'fixed-coordinate repeated native taps')
    choose(p,'near-right');tool(p,'turn');click(p,'back');h.ok(pose(p)[0]==90,'near-right exact step');choose(p,'same-turn');h.ok(pose(p)[0]==85,'visit retains previous independent case');h.click(p,'#explorer-switch');p.locator('#explorer-cancel').wait_for();h.click(p,'#explorer-cancel');p.locator('[data-hinge-root]').wait_for();h.ok(pose(p)==[60,1,3,0],'picker/cancel clears visit as declared')
    p.locator('[data-hinge-root] [data-speak]').click();h.ok(p.locator('.speech-controls').evaluate('x=>getComputedStyle(x).position')!='fixed','voice controls remain in flow, leaving exits reachable');h.click(p,'#privacy-button');p.locator('#about-dialog[open]').wait_for();h.click(p,'#about-dialog form button');h.ok(pose(p)==[60,1,3,0],'privacy does not discard visit');
    # Empty live status must be represented, not display:none.
    session=c.new_cdp_session(p);obj=session.send('Runtime.evaluate',{'expression':'document.querySelector(".hinge-status")'})['result']['objectId'];ax=session.send('Accessibility.getPartialAXTree',{'objectId':obj,'fetchRelatives':False})['nodes'][0];h.ok(not ax['ignored'] and ax['role']['value']=='status','empty Chrome AX status present');c.close()
    c,p=setup(browser,base,seed,820,'saving-off');p.evaluate('location.hash="#notes"');p.locator('#remember').wait_for();p.locator('#remember').uncheck();p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-hinge-root]').wait_for();click(p,'more');h.ok(pose(p)[0]==65,'saving off keeps full model playable');_,report=download(p,'saving-off-notes');h.ok(report['hingeBench']==seed['hingeBench'],'saving off does not write supported hinge history');c.close()
    c,p=setup(browser,base,seed,820,'storage-fault');before=h.book(p);p.evaluate('()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith("number-garden-v1:"))throw new DOMException("Synthetic quota fault","QuotaExceededError");return native.call(this,k,v)}}');click(p,'more');click(p,'compare');click(p,'example');click(p,'close');h.ok(pose(p)[0]==65,'device save failure cannot disable visit-only material');h.ok(h.book(p)==before,'no attempted notebook write for material actions');c.close()
def uninitialized(browser,base):
    seed={'version':1,'hingeBench':{'version':88,'raw':'Synthetic unreadable future settings'},'syntheticOther':{'keep':[None,False,17]}}
    c,p=setup(browser,base,seed,820,'uninitialized');before=h.book(p);h.ok(before==seed,'direct uninitialized entry does not fabricate learning roots');click(p,'more');click(p,'card');click(p,'compare');click(p,'example');click(p,'next');click(p,'close');h.ok(h.book(p)==before,'uninitialized visit writes neither notebook nor future hinge owner');c.close()
def main():
    js="import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky'};s.hingeBench={version:77,opaque:['Synthetic future material',{kept:true}]};s.syntheticOther={payload:'x'.repeat(512*1024)};console.log(JSON.stringify(s));";seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('HINGE_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
        try:
            for width,height in [(320,900),(820,1180),(1024,768)]:journey(browser,base,seed,width,height)
            interfaces(browser,base,seed);uninitialized(browser,base);h.ok(not h.errors,'no page errors '+str(h.errors));h.ok(not h.console_errors,'no console errors '+str(h.console_errors));result={'status':'passed','checks':h.checks,'limits':'Native Chrome; not physical iPad/Safari, audible speech, screen-reader speech or learning effects'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
        except Exception:
            for p,label in h.pages:
                try:p.screenshot(path=str(OUT/f'failure-{label}.png'),full_page=True)
                except Exception:pass
            raise
        finally:browser.close();server.shutdown()
if __name__=='__main__':main()
