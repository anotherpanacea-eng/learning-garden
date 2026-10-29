"""Synthetic298 native Chrome journeys; no app-module interception.

FERRY_TEST_URL optionally selects the canonical site. This checks real controls,
rendered geometry and notebook transfers, not physical iPad/Safari, audible output,
screen-reader speech or learning effects.
"""
import sys
sys.dont_write_bytecode=True
import functools,http.server,importlib.util,json,math,os,re,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('FERRY_ARTIFACTS',tempfile.mkdtemp(prefix='ferry-')));OUT.mkdir(parents=True,exist_ok=True)
os.environ['RHYTHM_ARTIFACTS']=str(OUT)
spec=importlib.util.spec_from_file_location('native_helpers',ROOT/'test/rhythm-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
ROUTE='#post/ferry';KEYS=['bank','ferry','courier','other'];VIEWS=['bank','ferry','other']
CASES=[('riding',2,0,1,2),('with-ferry',2,1,-1,2),('against-ferry',2,-1,1,8),('side-by-side',2,0,2,2),('opposite-boats',1,0,-2,2),('hold-bank',-1,1,0,2)]
EXAMPLES=[(0,'bank',[0,-4,-2,6]),(1,'bank',[0,-2,0,7]),(1,'ferry',[2,0,2,9]),(2,'ferry',[0,0,2,8])]
def sel(a):return f'[data-ferry-action="{a}"]'
def click(p,a):h.click(p,sel(a))
def view(p,frame):h.click(p,sel('view')+f'[data-ferry-frame="{frame}"]')
def choose(p,case):p.locator('[data-ferry-case]').select_option(case)
def time(p):return int(p.locator('.ferry-clock h3 strong').inner_text().split()[0])
def pose(p):return [p.locator('[data-ferry-case]').input_value(),time(p),p.locator('[data-ferry-frame][aria-pressed=true]').get_attribute('data-ferry-frame')]
def step_to(p,t):
    while time(p)!=t:click(p,'forward' if time(p)<t else 'back')
def writes(p):return p.evaluate('ferryWrites')
# Screen CTMs include subpixel CSS rounding; .08 drawing units is far below a12-unit meter.
def near(a,b,message):h.ok(abs(a-b)<.08,f'{message}: {a} versus {b}')
def setup(browser,base,seed,width,label,height=1000):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True);h.contexts.append(c)
    c.add_init_script('''seed=>{if(!localStorage.getItem('ferry-fixture')){const p={id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-29T12:00:00.000Z'};localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:p.id,explorers:[p]}));localStorage.setItem('number-garden-v1:'+p.id,JSON.stringify(seed));localStorage.setItem('ferry-fixture','1');}window.ferryWrites=0;window.ferryFailWrites=false;const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1')){window.ferryWrites++;if(window.ferryFailWrites)throw new DOMException('Synthetic quota fault','QuotaExceededError');}return native.call(this,k,v);};}'''.replace('seed=>','('+ 'seed=>',1)+' )('+json.dumps(seed)+')')
    p=c.new_page();h.pages.append((p,label));p.set_default_timeout(15000);p.on('pageerror',lambda e:h.errors.append({'case':label,'error':str(e)}));p.on('console',lambda e:h.console_errors.append({'case':label,'error':e.text}) if e.type=='error' else None);h.go(p,base,ROUTE,'[data-ferry-root]');return c,p
def geometry(p,case,t,frame,example=False):
    row=next(x for x in CASES if x[0]==case);_,f,w,o,d=row;x=[0,-4+f*t,-4+d+(f+w)*t,6+o*t];v=[0,f,f+w,o];j=KEYS.index(frame);q=[n-x[j] for n in x];u=[n-v[j] for n in v]
    actual=p.locator('[data-ferry-material]').evaluate('''root=>{const svg=root.querySelector('[data-ferry-scene]'),vel=root.querySelector('[data-ferry-velocity]'),r=svg.getBoundingClientRect(),vr=vel.getBoundingClientRect();function project(el,x,y,s=svg){const b=s.getBoundingClientRect(),p=new DOMPoint(x,y).matrixTransform(el.getScreenCTM());return [(p.x-b.left)*600/b.width,(p.y-b.top)*Number(s.viewBox.baseVal.height)/b.height];}const origins=Object.fromEntries([...svg.querySelectorAll('[data-ferry-object]')].map(g=>{const e=g.querySelector('[data-ferry-origin]'),b=e.getBBox();return[g.dataset.ferryObject,project(e,b.x+b.width/2,b.y+b.height/2)]}));const deck=svg.querySelector('[data-ferry-deck]');const hull=svg.querySelector('[data-ferry-other-hull]');const head=vel.querySelector('[data-ferry-velocity-head]'),shaft=vel.querySelector('[data-ferry-velocity-shaft]');return {origins,deck:[project(deck,+deck.getAttribute('x1'),+deck.getAttribute('y1')),project(deck,+deck.getAttribute('x2'),+deck.getAttribute('y2'))],hull:[...hull.points].map(p=>project(hull,p.x,p.y)),head:head?[...head.points].map(p=>project(head,p.x,p.y,vel)):[],shaft:shaft?[project(shaft,+shaft.getAttribute('x1'),+shaft.getAttribute('y1'),vel),project(shaft,+shaft.getAttribute('x2'),+shaft.getAttribute('y2'),vel)]:[],zero:!!vel.querySelector('[data-ferry-zero]'),width:r.width,velocityWidth:vr.width,positionLabelFonts:[...root.querySelectorAll('.ferry-scale span')].map(x=>parseFloat(getComputedStyle(x).fontSize)),bounds:[...svg.querySelectorAll('[data-ferry-object],.ferry-platform,.ferry-other-hull')].map(e=>{const b=e.getBBox();return [project(e,b.x,b.y),project(e,b.x+b.width,b.y+b.height)]}),title:svg.querySelector('title').textContent,caption:root.querySelector('figcaption').innerText};}''')
    for i,k in enumerate(KEYS):near(actual['origins'][k][0],300+12*q[i],'actual transformed '+k+' origin')
    near(actual['origins']['courier'][0]-actual['origins']['ferry'][0],12*(d+w*t),'courier actual local deck coordinate')
    near(actual['deck'][0][0],300+12*(q[1]-1),'actual deck start');near(actual['deck'][1][0],300+12*(q[1]+9),'actual deck end');near(min(z[0] for z in actual['hull']),300+12*(q[3]-1),'other hull left');near(max(z[0] for z in actual['hull']),300+12*(q[3]+1),'other hull right')
    h.ok(all(0<=xy[0]<=600 and 0<=xy[1]<=230 for corners in actual['bounds'] for xy in corners),'all actual object bounding boxes inside scene')
    near(actual['width'],actual['velocityWidth'],'same rendered width for separately labelled scales');h.ok(all(x>=16 for x in actual['positionLabelFonts']),'HTML scale labels remain16px after diagram scaling')
    if u[2]==0:h.ok(actual['zero'] and not actual['head'] and not actual['shaft'],'zero courier velocity draws a point, no directional shaft')
    else:
        h.ok(not actual['zero'],'nonzero relative velocity not collapsed tozero');near(actual['shaft'][0][0],300,'velocity arrow starts at its own zero');end=300+40*u[2];base=end-math.copysign(14,u[2]);near(actual['head'][0][0],end,'arrow tip is correct signed velocity');near(actual['shaft'][1][0],base,'shaft stops at head base');near(actual['head'][1][0],base,'head extends back toward zero');near(abs(actual['head'][1][1]-actual['head'][2][1]),14,'actual head width');h.ok(abs(end-300)*actual['velocityWidth']/600>=14,'phone direction arrow remains readable size');h.ok(14*actual['velocityWidth']/600>=5,'phone arrowhead remains distinguishable')
    h.ok(str(t)+' second' in actual['caption'],'scene caption carries actual shared clock');h.ok('compared with' in actual['title'],'SVG alternative names frame-relative quantities')
    if not example and p.locator('.ferry-readings').count():
        rows=p.locator('.ferry-readings tbody tr').evaluate_all('xs=>xs.map(r=>[...r.querySelectorAll("td")].map(c=>c.textContent.trim()))')
        for i,cells in enumerate(rows):near(float(cells[0].replace('−','-')),q[i],'table position agrees with scene');near(float(cells[1].split()[0].replace('−','-')),u[i],'table velocity uses named observer')
    return actual,q,u
def key_matches(p):
    records=p.locator('[data-ferry-material]').evaluate("""root=>['bank','ferry','courier','other'].map(id=>{function read(container){const x=container.querySelector('[data-ferry-shape="'+id+'"]'),b=x.getBBox(),fill=getComputedStyle(x).fill;return {tag:x.tagName,fill,ratio:b.width/b.height,points:x.points?[...x.points].map(p=>[(p.x-b.x)/b.width,(p.y-b.y)/b.height]):null,dot:!!container.querySelector('.ferry-symbol.courier circle')};}return {id,scene:read(root.querySelector('[data-ferry-object="'+id+'"]')),key:read(root.querySelector('[data-ferry-key-symbol="'+id+'"]'))};})""")
    expected={'bank':('polygon','rgb(156, 105, 13)'),'ferry':('circle','rgb(24, 63, 57)'),'courier':('rect','rgb(255, 255, 255)'),'other':('polygon','rgb(255, 255, 255)')}
    for r in records:
        h.ok(r['scene']==r['key'],'each actual key symbol matches scene geometry and fill '+r['id']);h.ok((r['scene']['tag'],r['scene']['fill'])==expected[r['id']],'symbols remain independently distinct '+r['id'])
    h.ok(records[2]['scene']['dot'],'courier square includes its central dot')
def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    bad=p.locator('[data-ferry-root] button,[data-ferry-root] a,[data-ferry-root] select,[data-ferry-root] summary').evaluate_all('xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().width<44||x.getBoundingClientRect().height<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>x.textContent)');h.ok(not bad,'44px/16px controls '+str(bad))
def download(p,label):
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
    with p.expect_download() as event:h.click(p,'#download')
    path=OUT/(label+'.json');event.value.save_as(path);return path,json.loads(path.read_text())
def journey(browser,base,seed,width,height):
    c,p=setup(browser,base,seed,width,f'journey-{width}',height);before=h.book(p);h.ok(before==seed,'direct entry leaves literal notebook intact');h.ok(writes(p)==0,'entry makes zero notebook persistence attempts');bounds(p);key_matches(p)
    for case,_,_,_,_ in CASES:
        choose(p,case)
        if p.locator(sel('readings')).get_attribute('aria-expanded')!='true':click(p,'readings')
        for t in range(7):
            step_to(p,t)
            for frame in VIEWS:
                view(p,frame);a,q,u=geometry(p,case,t,frame);h.ok(pose(p)==[case,t,frame],'native view switch preserves case and clock');h.ok(p.locator(sel('forward')).is_disabled()==(t==6),'no clock overshoot');h.ok(p.locator(sel('back')).is_disabled()==(t==0),'no clock underflow')
                if t==1 and ((case=='riding' and frame=='ferry') or (case=='against-ferry' and frame=='ferry')):
                    p.screenshot(path=str(OUT/f'{case}-{width}.png'),full_page=True)
        bounds(p)
    choose(p,'with-ferry');step_to(p,2);view(p,'other');click(p,'explain');h.ok(p.locator('#ferry-explanation-title').evaluate('x=>document.activeElement===x'),'explanation focuses heading');h.ok('(+3 m/s)' in p.locator('.ferry-explanation').inner_text() and '(−1 m/s)' in p.locator('.ferry-explanation').inner_text(),'subtraction operands named and negative parenthesized');expected=pose(p)
    choose(p,'hold-bank');choose(p,'with-ferry');h.ok(pose(p)==expected and p.locator('.ferry-explanation').count()==1 and p.locator('.ferry-readings').count()==1,'case switch retains exact visit displays and event');click(p,'example')
    for i,(t,frame,q) in enumerate(EXAMPLES):
        actual,_,velocities=geometry(p,'riding',t,frame,True);[near((actual["origins"][k][0]-300)/12,q[j],'independent exact worked event oracle') for j,k in enumerate(KEYS)];h.ok('Worked example, not your crossing' in p.locator('.ferry-example-label').inner_text(),'example ownership visible');p.locator('[data-ferry-root] [data-speak]').click();words=p.locator('[data-ferry-root] [data-speak]').get_attribute('data-speak');h.ok('Worked example, not your crossing' in words,'example Hear carries ownership');
        if i<3:click(p,'example-next')
    click(p,'example-close');h.ok(pose(p)==expected and p.locator('.ferry-explanation').count()==1 and p.locator('.ferry-readings').count()==1,'example restores unchanged material and displays');h.ok(p.locator(sel('example')).evaluate('x=>document.activeElement===x'),'example returns trigger focus');view(p,'ferry');h.ok(p.locator('.ferry-explanation').count()==0 and p.locator('.ferry-readings').count()==1,'view edit closes explanation while keeping readings');click(p,'reset');h.ok(pose(p)==['with-ferry',0,'bank'],'reset restores own authored crossing');h.ok(p.locator('.ferry-readings').count()==0 and p.locator('.ferry-explanation').count()==0,'reset closes optional readings/explanation')
    p.locator(sel('forward')).focus();p.keyboard.press('Enter');p.keyboard.press('Space');h.ok(time(p)==2,'native keyboard clock actions');p.evaluate('window.oldFerryForward=document.querySelector("[data-ferry-action=forward]")');click(p,'forward');p.evaluate('window.oldFerryForward.click()');h.ok(time(p)==3,'departed clock control inert');p.locator('[data-ferry-root] [data-speak]').click();words=p.locator('[data-ferry-root] [data-speak]').get_attribute('data-speak');h.ok('clock 3 seconds' in words and 'turning or accelerating viewers' not in words,'Hear is current and excludes closed parent copy');click(p,'readings');p.locator('[data-ferry-root] [data-speak]').click();h.ok('Position (m)' in p.locator('[data-ferry-root] [data-speak]').get_attribute('data-speak'),'opened actual table is included in Hear');h.ok(h.book(p)==before and writes(p)==0,'all native material/help/Hear actions make zero notebook writes')
    p.evaluate('()=>{window.oldFerryHear=document.querySelector("[data-ferry-root] [data-speak]");window.oldFerryHear.dataset.speak="";location.hash="#notes";window.oldFerryHear.click()}');p.locator('#download').wait_for();h.ok(p.evaluate('oldFerryHear.dataset.speak')=='','synchronous departed Hear cannot compose stale request');path,report=download(p,f'notes-{width}');h.ok(report['ferryDeck']==seed['ferryDeck'] and report['syntheticOther']==seed['syntheticOther'],'actual Notes download keeps unknown owner and large sibling');old=h.active(p);p.locator('#progress-file').set_input_files(str(path));p.locator('#progress-import-confirm').wait_for();h.click(p,'#progress-import-confirm');p.wait_for_function('old=>JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId!==old',arg=old);new=h.active(p);p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-ferry-root]').wait_for();p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{new}"]').count():h.click(p,f'[data-select-explorer="{new}"]')
    p.locator('[data-ferry-root]').wait_for();h.ok(pose(p)==['riding',0,'bank'],'reload/import starts fresh visit without interpreting future saved owner');_,again=download(p,f'redownload-{width}');h.ok(again['ferryDeck']==report['ferryDeck'] and again['syntheticOther']==report['syntheticOther'],'literal import/reload/redownload retains unknown source');p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-ferry-root]').wait_for();h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{old}"]');p.locator('[data-ferry-root]').wait_for();h.ok(h.book(p)['ferryDeck']==seed['ferryDeck'],'source explorer remains intact');
    h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{new}"]');p.locator('[data-ferry-root]').wait_for();click(p,'forward');p.evaluate('window.beforeFerryReset=document.querySelector("[data-ferry-action=forward]")');p.evaluate('location.hash="#notes"');p.locator('#reset').wait_for();h.click(p,'#reset');h.click(p,'#confirm-reset');p.wait_for_function('location.hash==="#home"');film=p.locator('dialog.welcome-film[open]')
    if film.count():film.locator('[data-film-skip]').click()
    p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-ferry-root]').wait_for();p.evaluate('beforeFerryReset.click()');h.ok(pose(p)==['riding',0,'bank'],'Notes reset invalidates old crossing controls');click(p,'forward');h.ok(time(p)==1,'new visit after Notes reset playable');original=p.evaluate('id=>JSON.parse(localStorage.getItem("number-garden-v1:"+id))',old);h.ok(original['ferryDeck']==seed['ferryDeck'] and original['syntheticOther']==seed['syntheticOther'],'Notes reset preserves other explorer unknown owner and large sibling');c.close()
def interfaces(browser,base,seed):
    c,p=setup(browser,base,seed,820,'interfaces');p.locator(sel('forward')).scroll_into_view_if_needed();r=p.locator(sel('forward')).bounding_box();x,y=r['x']+r['width']/2,r['y']+r['height']/2
    for t in range(1,6):p.touchscreen.tap(x,y);h.ok(time(p)==t,'fixed-coordinate clock taps stay on control')
    h.click(p,'#explorer-switch');h.click(p,'#explorer-cancel');p.locator('[data-ferry-root]').wait_for();h.ok(pose(p)==['riding',0,'bank'],'chooser/cancel resets visit');choose(p,'with-ferry');p.wait_for_function('document.querySelector(".ferry-status").textContent.includes("Walking with the ferry")');h.ok(p.locator('[data-ferry-case]').evaluate('x=>document.activeElement===x'),'case change focuses native selector and announces crossing');choose(p,'riding');p.locator('[data-ferry-root] [data-speak]').click();h.ok(p.locator('.speech-controls').evaluate('x=>getComputedStyle(x).position')!='fixed','voice controls do not cover exits');h.click(p,'#privacy-button');p.locator('#about-dialog[open]').wait_for();h.click(p,'#about-dialog form button');h.ok(pose(p)==['riding',0,'bank'],'privacy keeps visit');session=c.new_cdp_session(p);obj=session.send('Runtime.evaluate',{'expression':'document.querySelector(".ferry-status")'})['result']['objectId'];ax=session.send('Accessibility.getPartialAXTree',{'objectId':obj,'fetchRelatives':False})['nodes'][0];h.ok(not ax['ignored'] and ax['role']['value']=='status','empty Chrome AX live status present');c.close()
    c,p=setup(browser,base,seed,820,'storage-fault');before=h.book(p);p.evaluate('ferryFailWrites=true');click(p,'forward');view(p,'ferry');click(p,'readings');click(p,'explain');click(p,'example');click(p,'example-close');h.ok(pose(p)==['riding',1,'ferry'] and h.book(p)==before and writes(p)==0,'quota fault neither triggers attempted saves nor blocks finite model');c.close()
    c,p=setup(browser,base,seed,820,'saving-off');p.evaluate('location.hash="#notes"');p.locator('#remember').uncheck();p.evaluate('location.hash="'+ROUTE+'"');p.locator('[data-ferry-root]').wait_for();baseline=writes(p);click(p,'forward');view(p,'other');h.ok(pose(p)==['riding',1,'other'] and writes(p)==baseline,'saving-off activity does not attempt notebook persistence');c.close()
    c,p=setup(browser,base,{'version':1,'ferryDeck':{'version':99,'raw':['Synthetic future value',None]},'syntheticOther':{'kept':True}},820,'uninitialized');before=h.book(p);h.ok(writes(p)==0,'uninitialized entry has no notebook-write attempt');click(p,'forward');view(p,'ferry');click(p,'readings');click(p,'explain');click(p,'example');click(p,'example-next');click(p,'example-close');h.ok(h.book(p)==before and writes(p)==0,'uninitialized material/help has no write or owner interpretation');c.close()
def entry_links(browser,base,seed):
    c,p=setup(browser,base,seed,820,'entry-links')
    p.locator('[data-ferry-root] a[href="#post"]').click();p.locator('.post-office-page').wait_for();h.click(p,'.ferry-entry a');p.locator('[data-ferry-root]').wait_for();h.ok(pose(p)==['riding',0,'bank'],'Post Office entry opens fresh Ferry visit')
    p.locator('[data-ferry-root] a[href="#desk"]').click();p.locator('.river-casebook').wait_for();p.locator('.river-casebook>summary').click();h.click(p,'.river-casebook .ferry-entry a');p.locator('[data-ferry-root]').wait_for();h.ok(pose(p)==['riding',0,'bank'],'Desk investigation entry opens finite Ferry model');h.ok(h.book(p)['ferryDeck']==seed['ferryDeck'],'ordinary hub navigation retains unknown future owner');c.close()
def main():
    js="import {freshState} from './dist/core.mjs';const s=freshState();s.garden={avatar:'sky',welcomeFilmSeen:true};s.ferryDeck={version:77,opaque:['Synthetic future owner',{kept:true}]};s.syntheticOther={payload:'x'.repeat(512*1024)};console.log(JSON.stringify(s));";seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('FERRY_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
        try:
            for width,height in [(320,900),(820,1180),(1024,768)]:journey(browser,base,seed,width,height)
            interfaces(browser,base,seed);entry_links(browser,base,seed);h.ok(not h.errors,'no page errors '+str(h.errors));h.ok(not h.console_errors,'no console errors '+str(h.console_errors));r={'status':'passed','checks':h.checks,'limits':'Native Chrome only; not physical iPad/Safari, audible speech, screen-reader speech or learning effects'};(OUT/'receipt.json').write_text(json.dumps(r,indent=2));print(json.dumps(r))
        except Exception:
            for p,label in h.pages:
                try:p.screenshot(path=str(OUT/f'failure-{label}.png'),full_page=True)
                except Exception:pass
            raise
        finally:browser.close();server.shutdown()
if __name__=='__main__':main()
