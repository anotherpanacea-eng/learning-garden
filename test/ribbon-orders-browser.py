"""433 actual-app synthetic Chrome journey, geometry and bounded lifetime probes.

One complete tablet journey; focused phone/desktop samples. Notebook observation
is read-only; no product-module replacement. Native speech requests are observed,
not an audible/Safari/device/learning qualification. Artifacts stay in temp.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, importlib.util, json, math, os, re
from pathlib import Path
import subprocess, tempfile, threading, traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('RIBBON_ORDERS_ARTIFACTS') or tempfile.mkdtemp(prefix='lg433-browser-', dir='/private/tmp'))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('orders_native', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h
spec = importlib.util.spec_from_file_location('orders_parent', ROOT/'test/missing-ribbon-browser.py')
missing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(missing)
host = missing.host
SEED = json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticSibling={version:999,opaque:['invented',73]};s.ribbonOrders={version:987,unknown:{preserve:['opaque future material',4]}};console.log(JSON.stringify(s));"], cwd=ROOT, text=True))
VIEW = '[data-ro-root]'
ROUTE = '#workshop/join-pieces'
CASES = {'quarters-gathering':(17,4,7), 'sixths-path':(26,6,11),
 'quarters-without-trade':(23,4,15), 'fifths-crossing':(7,5,4),
 'whole-stock':(8,4,3), 'all-ribbon':(5,4,5), 'no-order':(7,4,0)}
checks, pages = 0, []


def ok(value, message):
    global checks
    checks += 1
    assert value, message


def go(p, base, route=ROUTE):
    h.go(p, base, route, '[data-join-root]' if route==ROUTE else '#download' if route=='#notes' else '#explorer-header')


def setup(browser, base, width=820):
    c,p = native.setup(browser, SEED, 'ribbon-orders-'+str(width), width)
    pages.append(p)
    c.add_init_script('''seed=>{if(!localStorage.getItem('orders-two-explorers')){const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));r.explorers.push({...r.explorers[0],id:'explorer-2',avatar:'fern',symbol:'acorn'});localStorage.setItem('learning-garden-explorers',JSON.stringify(r));localStorage.setItem('number-garden-v1:explorer-2',JSON.stringify(seed));localStorage.setItem('orders-two-explorers','1');}window.orderSpeech={words:[],cancel:0};const speak=speechSynthesis.speak.bind(speechSynthesis),cancel=speechSynthesis.cancel.bind(speechSynthesis);speechSynthesis.speak=u=>{orderSpeech.words.push(u.text);window.orderLastUtterance=u;return speak(u);};speechSynthesis.cancel=()=>{orderSpeech.cancel++;return cancel();};}'''.replace('seed=>{','(seed=>{',1)+')('+json.dumps(SEED)+');')
    def observe(route):
        response=route.fetch();body=response.text()
        ok(body.count('let graph=null,')==1,'unique read-only actual notebook observation seam')
        route.fulfill(response=response,body=body.replace('let graph=null,','window.__ordersBook=()=>structuredClone(state);let graph=null,',1))
    c.route('**/app.mjs',observe)
    go(p,base)
    return c,p


def finish(c,p):
    if sys.exc_info()[0]:
        p.screenshot(path=str(OUT/'failure.png'),full_page=True)
        (OUT/'failure.html').write_text(p.content())
    c.close()


def snapshot(p):
    return p.evaluate('({book:__ordersBook(),local:Object.entries(localStorage).sort(),session:Object.entries(sessionStorage).sort()})')


def download(p, base, label):
    go(p,base,'#notes')
    with p.expect_download() as result:p.locator('#download').click()
    path=OUT/(label+'.json');result.value.save_as(str(path));data=json.loads(path.read_text());data.pop('exportedAt',None)
    return data


def mode(p, name='orders', key=None):
    q=p.locator('[data-join-mode="'+name+'"]')
    if key:q.focus();p.keyboard.press(key)
    else:q.click()
    ok(p.locator('[data-join-mode="'+name+'"]').get_attribute('aria-pressed')=='true','parent mode selected '+name)
    if name=='orders':p.locator(VIEW).wait_for()


def focus(p, selector):
    ok(p.locator(VIEW+' '+selector).evaluate('e=>e===document.activeElement'),'native focus '+selector)


def action(p, name, key=None):
    q=p.locator(VIEW+' [data-ro-action="'+name+'"]');cancel=p.evaluate('orderSpeech.cancel')
    if key:q.focus();p.keyboard.press(key)
    else:q.click()
    ok(p.evaluate('document.activeElement!==document.body&&document.activeElement.isConnected&&!document.activeElement.disabled&&document.activeElement.getClientRects().length>0'),'usable focus after '+name);ok(p.evaluate('orderSpeech.cancel')>cancel,'action stops local speech '+name)


def choose(p, ident):
    q=p.locator(VIEW+' [data-ro-case]');q.focus();q.select_option(ident);focus(p,'[data-ro-case]')


def material(p):
    return p.locator(VIEW).evaluate('''e=>({case:e.querySelector('[data-ro-case]')?.value,view:e.querySelector('[data-ro-view]')?.dataset.roView,frame:e.querySelector('[data-ro-frame]')?.dataset.roFrame,rack:[...e.querySelectorAll('[data-ro-diagram="rack"] [data-ro-piece]')].map(e=>Number(e.dataset.roPiece)),sent:[...e.querySelectorAll('[data-ro-diagram="order"] [data-ro-piece]')].map(e=>Number(e.dataset.roPiece))})''')


def replay(n,d,actions):
    bundles=[list(range(j*d,(j+1)*d)) for j in range(n//d)];loose=list(range(n//d*d,n));sent=[]
    for act in actions:
        if act=='open':loose=bundles.pop()+loose
        elif act=='whole':sent+=bundles.pop()
        else:sent.append(loose.pop(0))
    return bundles,loose,sent


def near(a,b,label):ok(abs(a-b)<.03,label+': '+str(a)+' / '+str(b))


def geometry(p,n,d,actions,claim=False):
    bundles,loose,sent=replay(n,d,actions);widths=[];all_ids=[]
    for owner,expected,packed in [('rack',sum(bundles,[])+loose,len(bundles)),('order',sent,0)]:
        selector=VIEW+(' [data-ro-claim]' if claim else '')+' [data-ro-diagram="'+owner+'"]'
        if claim and owner=='order':continue
        q=p.locator(selector)
        if not claim:q=q.filter(has_not=p.locator('[data-ro-claim]'))
        ok(q.count()==1,'one '+owner+' material diagram')
        g=q.evaluate('''e=>{const box=x=>{const b=x.getBBox(),r=x.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height,pw:r.width,left:r.left,right:r.right};};return {view:e.getAttribute('viewBox'),whole:[...e.querySelectorAll('[data-ro-whole]')].map(box),pieces:[...e.querySelectorAll('[data-ro-piece]')].map(x=>({...box(x),id:Number(x.dataset.roPiece),owner:x.dataset.roOwner})),bundles:e.querySelectorAll('[data-ro-bundle]').length};}''')
        rows=max(1,packed+math.ceil((len(expected)-packed*d)/d))
        ok(g['view']==f'0 0 600 {48*rows+30}','SVG rows use fixed independent whole coordinate system')
        ok(len(g['whole'])==rows,'one whole outline per actual occupied row or empty row')
        ok([x['id'] for x in g['pieces']]==expected,'exact '+owner+' IDs and replay order')
        ok(g['bundles']==packed,'bundle brackets describe packed rows only')
        for j,b in enumerate(g['whole']):
            near(b['x'],48,'whole x');near(b['y'],18+48*j,'whole row y');near(b['w'],504,'fixed whole width');widths.append(b['pw'])
        for i,b in enumerate(g['pieces']):
            near(b['x'],48+(i%d)*504/d,'piece slot x');near(b['y'],18+48*(i//d),'piece slot row');near(b['w'],504/d,'piece unit width');near(b['h'],24,'piece height')
            ok(b['owner']==owner,'material ownership '+owner);all_ids.append(b['id'])
    ok(sorted(all_ids)==list(range(n)),'all N original IDs appear exactly once across rack and order')
    ok(widths and min(widths)>0 and max(widths)-min(widths)<.35,'all rendered reference wholes share physical width')
    return widths


def claim_geometry(p):
    q=p.locator('[data-ro-claim]')
    g=q.evaluate("""e=>{const b=x=>{const r=x.getBBox();return [r.x,r.y,r.width,r.height]};const m=e.querySelector('[data-ro-claim-marker]');return {view:e.getAttribute('viewBox'),whole:[...e.querySelectorAll('[data-ro-whole]')].map(b),pieces:[...e.querySelectorAll('[data-ro-claim-piece]')].map(b),marker:m.getAttribute('d'),dash:getComputedStyle(m).strokeDasharray,width:e.querySelector('[data-ro-whole]').getBoundingClientRect().width};}""")
    ok(g['view']=='0 0 600 174' and g['whole']==[[48,18,504,24],[48,66,504,24],[48,114,504,24]],'claim has three independent whole rows at same scale')
    ok(g['pieces']==[[48+(i%4)*126,18+48*(i//4),126,24] for i in range(10)],'claim actually draws ten quarter units')
    ok(g['marker'].startswith('M300 102') and g['dash']!='none','dashed marker sits at actual final ten-quarter endpoint')
    live=p.locator('[data-ro-diagram] [data-ro-whole]').evaluate_all('xs=>xs.map(e=>e.getBoundingClientRect().width)')
    ok(max(live+[g['width']])-min(live+[g['width']])<.35,'claim and live rack/order wholes have identical physical width')


def state(p,ident,actions):
    n,d,t=CASES[ident];bundles,loose,sent=replay(n,d,actions);s=len(sent);r=n-s
    geometry(p,n,d,actions)
    m=material(p);ok(m['case']==ident and m['rack']==sum(bundles,[])+loose and m['sent']==sent,'selected material independently replayed '+ident)
    for name,enabled in {'open':bool(bundles) and s<t,'whole':bool(bundles) and t-s>=d,'piece':bool(loose) and s<t,'undo':bool(actions)}.items():
        ok(p.locator(VIEW+' [data-ro-action='+name+']').is_enabled()==enabled,'action availability '+name+' '+ident)
    text=p.locator(VIEW).inner_text();pieces=lambda k:f'{k} piece'+('' if k==1 else 's');rack=f'{pieces(r)} '+('stays' if r==1 else 'stay')+' on the rack.'
    ok(f'{pieces(r)} on the rack.' in p.locator(VIEW+' .ro-rack').inner_text(),'rack count uses exact singular/plural material')
    ok(f'{pieces(t-s)} still requested.' in p.locator(VIEW+' .ro-order').inner_text(),'order count uses exact singular/plural request')
    if t==0:
        ok(f'This order needs no ribbon. All {n} pieces stay on the rack.' in text,'zero order readout')
        ok('Sent 0 of' not in text and 'The order is filled.' not in text,'zero order excludes ordinary progress/completion')
    elif s==t:ok(f'The order is filled. {rack}' in text,'exact completed remainder')
    else:ok(f'Sent {s} of the {pieces(t)} requested. {rack}' in text,'unfinished current material readout')

    guidance=p.locator(VIEW+' .ro-guidance').inner_text()
    if t==0:ok(guidance=='Choose another order.','zero order offers only another order')
    elif s==t:ok(guidance=='You can undo a move or choose another order.','completed order offers Undo or another order')
    else:
        if not bundles:
            ok('There is no whole bundle to open.' in guidance and 'There is no whole bundle to send.' in guidance,'no packed bundles explains both unavailable whole operations')
        elif t-s<d:
            reason='The order needs less than one whole now. '+('Send loose pieces.' if loose else 'Open a whole to get loose pieces.')
            ok(guidance.count(reason)==1,'less-than-whole boundary gives one exact available next step')
        if not loose and t-s>=d:ok('Open a whole to get loose pieces, or send a whole.' in guidance,'no-loose boundary offers actual alternatives')
        ok('The final remaining amount' not in text and 'The final remainder' not in text,'unfinished work does not leak the final difference')


def hear(p):
    q=p.locator(VIEW+' [data-speak]');ok(q.count()==1,'one current native Hear action')
    before=p.evaluate('orderSpeech.words.length');q.click();words=p.evaluate('orderSpeech.words.at(-1)')
    ok(p.evaluate('orderSpeech.words.length')==before+1,'one actual native speech request')
    ok(words and not re.search(r'\d+\s*/\s*\d+',words),'final utterance expands fractions')
    ok(not re.search(r'\b\d+\s+\d+\s+(?:quarter|fifth|sixth)s?\b',words),'final mixed fraction has whole/part meaning')
    ok('Reading voice' not in words and 'Reading speed' not in words,'shared voice settings excluded from read material')
    return words


def layout(p,label):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow '+label)
    bad=p.locator(VIEW+' button,'+VIEW+' select,'+VIEW+' summary,[data-join-mode]').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&!e.closest('.speech-controls,drawn-howto')&&(e.getBoundingClientRect().width<43.5||e.getBoundingClientRect().height<43.5||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>e.outerHTML.slice(0,140))''')
    ok(not bad,'44px controls /16px text '+str(bad))
    ok(p.locator(VIEW+' [hidden]').evaluate_all('xs=>xs.every(e=>getComputedStyle(e).display==="none")'),'native hidden conceals child content')
    ok(p.locator(VIEW+' svg').evaluate_all('xs=>xs.every(e=>{const r=e.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1})'),'whole diagram endpoints stay in viewport')
    p.screenshot(path=str(OUT/(label+'.png')),full_page=True)


def voice_panel(p,label):
    hear(p);controls=p.locator('.speech-controls');ok(controls.is_visible(),'actual shared voice panel visible')
    # Drive the native utterance start event if headless audio has no output device.
    p.evaluate('orderLastUtterance.dispatchEvent(new Event("start"))')
    for phase in ['playing','stopped','expanded']:
        if phase=='stopped':p.locator('[data-stop-speech]').click()
        if phase=='expanded':controls.locator('.voice-settings>summary').click();hear(p);p.evaluate('orderLastUtterance.dispatchEvent(new Event("start"))')
        ok(controls.evaluate('e=>e.classList.contains("speech-playing")')==(phase!='stopped'),'shared panel '+phase)
        colors=controls.evaluate('''e=>[...e.querySelectorAll('button,summary,label,select,[data-speech-status]')].filter(x=>x.checkVisibility()).map(x=>{let n=x,b;while(n){b=getComputedStyle(n).backgroundColor;if(b!=='rgba(0, 0, 0, 0)'&&b!=='transparent')break;n=n.parentElement;}return [getComputedStyle(x).color,b]})''')
        def lum(css):
            c=[float(x)/255 for x in re.findall(r'[\d.]+',css)[:3]]
            return sum((x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4)*w for x,w in zip(c,[.2126,.7152,.0722]))
        ok(colors and all((max(lum(a),lum(b))+.05)/(min(lum(a),lum(b))+.05)>=4.5 for a,b in colors),'voice panel text contrast '+phase)
        layout(p,label+'-'+phase)
    controls.locator('.voice-settings>summary').click()


def explanation(p,ident,actions):
    n,d,t=CASES[ident];before=material(p);action(p,'explain');p.locator('[data-ro-view=explanation]').wait_for();text=p.locator(VIEW).inner_text()
    ok(re.search(rf'{n}/{d}\s*[−-]\s*{t}/{d}\s*=\s*{n-t}/{d}',text),'exact original subtraction and final difference')
    ok(f'The final remainder is {n-t} such pieces.' in text,'explicit final difference')
    sent=len(replay(n,d,actions)[2]);remaining=n-sent;piece=lambda k: f'{k} piece'+('' if k==1 else 's');ok(f'Current material: {piece(sent)} sent; {piece(remaining)} on the rack.' in text,'explanation labels exact actual current material separately');q,r=divmod(n-t,d);name='0' if n==t else f'{r}/{d}' if q==0 else f'{q} whole'+('' if q==1 else 's')+(f' and {r}/{d}' if r else '');ok('The final remaining amount is '+name+'.' in text,'exclusive canonical final difference branch')
    words=hear(p).lower();ok('minus' in words and 'equals' in words,'final equation speech retains subtraction')
    action(p,'back');focus(p,'[data-ro-action=explain]');ok(material(p)==before,'explanation Back preserves unfinished actual material')


def journey(browser,base):
    c,p=setup(browser,base)
    try:
        before_notes=download(p,base,'notes-before');ok(before_notes['ribbonOrders']==SEED['ribbonOrders'],'actual Notes contains opaque unknown root')
        go(p,base);baseline=snapshot(p)
        host.choose(p,'half-and-third');host.act(p,'split','left',3);join=host.state(p)
        mode(p,'missing');missing.choose(p,'half-and-third');missing.act(p,'split-known',3);other=missing.state(p)
        mode(p,'bundles');p.locator('[data-wb-action=bundle]').click();bundles=p.locator('[data-wb-model]').first.get_attribute('data-packed')
        mode(p,key='Enter');focus(p,'#ro-heading')
        ok(p.locator('[data-ro-case] option').evaluate_all('xs=>xs.map(e=>e.value)')==list(CASES),'all seven finite choices open')
        ok(p.locator('[data-join-root]').inner_text().count('this work is not saved in Notes')==1,'one child-owned visit footer')
        state(p,'quarters-gathering',[]);p.locator('[data-ro-case]').focus();p.keyboard.press('s');state(p,'sixths-path',[]);focus(p,'[data-ro-case]');choose(p,'quarters-gathering');state(p,'quarters-gathering',[]);explanation(p,'quarters-gathering',[])
        paths={'quarters-gathering':['open','whole','piece','piece','piece'],'sixths-path':['whole','open']+['piece']*5,'quarters-without-trade':['whole']*3+['piece']*3,'fifths-crossing':['piece','piece','open','piece','piece'],'whole-stock':['open']+['piece']*3,'all-ribbon':['whole','piece'],'no-order':[]}
        for ident,path in paths.items():
            choose(p,ident);history=[];state(p,ident,history)
            for i,move in enumerate(path):
                action(p,move,'Space' if i==0 else 'Enter' if i==1 else None);history.append(move);state(p,ident,history)
            if path:
                completed=material(p);action(p,'undo');history.pop();state(p,ident,history);action(p,path[-1]);history.append(path[-1]);ok(material(p)==completed,'Undo after completion restores exact final IDs on replay')
            explanation(p,ident,history)
            ok(snapshot(p)==baseline,'all arithmetic/explanation preserves notebook memory/local/session')
        choose(p,'quarters-gathering');state(p,'quarters-gathering',paths['quarters-gathering'])
        # A distinct all-piece path reaches the same amount after undoing the first path.
        for _ in paths['quarters-gathering']:action(p,'undo')
        alt=['piece','open']+['piece']*4+['open','piece','piece']
        for move in alt:action(p,move)
        state(p,'quarters-gathering',alt)
        choose(p,'sixths-path');state(p,'sixths-path',paths['sixths-path']);choose(p,'quarters-gathering');state(p,'quarters-gathering',alt)
        saved=material(p);action(p,'explain');explain=material(p);action(p,'example');action(p,'next');action(p,'back');focus(p,'[data-ro-action=example]');ok(material(p)==explain,'example returns explanation caller');action(p,'back');focus(p,'[data-ro-action=explain]')
        action(p,'example')
        frames=[[],['open'],['open','piece'],['open','piece','piece'],['open','piece','piece','piece'],['open','piece','piece','piece']]
        for frame,history in enumerate(frames):
            ok(int(p.locator('[data-ro-frame]').get_attribute('data-ro-frame'))==frame,'manual authored frame '+str(frame))
            widths=geometry(p,9,4,history);words=hear(p).lower()
            ok(p.locator('[data-ro-action=previous]').is_disabled()==(frame==0),'Previous boundary')
            if frame==5:
                claim=p.locator('[data-ro-claim]');ok(claim.count()==1 and claim.locator('[data-ro-claim-piece]').count()==10,'separate unequal claim draws ten pieces')
                extra=claim.locator('[data-ro-whole]').evaluate_all('xs=>xs.map(e=>e.getBoundingClientRect().width)');ok(extra and max(widths+extra)-min(widths+extra)<.35,'claim keeps identical rendered whole scale');claim_geometry(p)
                ok('ten quarters' in words and 'six quarters' in words and 'different' in words,'final claim narration explains actual unequal amounts')
            else:action(p,'next');ok(p.evaluate('document.activeElement.matches("[data-ro-action=previous],[data-ro-action=next]")&&!document.activeElement.disabled'),'enabled endpoint neighbor focus')
        ok(p.locator('[data-ro-action=next]').is_disabled(),'six frames end manually')
        action(p,'previous');action(p,'back');focus(p,'[data-ro-action=example]');ok(material(p)==saved,'example preserves case/history')
        words=hear(p).lower();ok('Quarters for the gathering'.lower() in words and all(title.lower() not in words for title in ['Sixths for the path','Quarters without opening','Fifths for the crossing','An order from whole stock','Send all the ribbon','No ribbon requested']),'Hear includes selected case and excludes every unselected case');voice_panel(p,'journey-820')
        mode(p,'join');ok(host.state(p)==join,'Join material preserved across four modes')
        mode(p,'missing');ok(missing.state(p)==other,'Missing material preserved across four modes')
        mode(p,'bundles');ok(p.locator('[data-wb-model]').first.get_attribute('data-packed')==bundles,'Wholes material preserved across four modes')
        mode(p);state(p,'quarters-gathering',alt)
        after_notes=download(p,base,'notes-after');ok(after_notes==before_notes,'actual Notes export exact including opaque ribbonOrders root');ok(snapshot(p)==baseline,'Notes round trip preserves actual notebook/storage')
    finally:finish(c,p)


def emit(handle):handle.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')


def stale(p,handles,label):
    before=material(p);book=snapshot(p);voice=p.evaluate('orderSpeech.words.slice()')
    for handle in handles:emit(handle)
    ok(material(p)==before and snapshot(p)==book and p.evaluate('orderSpeech.words')==voice,'retained callbacks refuse '+label)


def fresh(p,base):
    p.reload(wait_until='networkidle');go(p,base);mode(p)


def lifecycle(browser,base):
    c,p=setup(browser,base)
    try:
        for target,kind in [(VIEW,'hidden'),(VIEW,'inert'),(VIEW,'aria'),(VIEW,'class'),('[data-ro-action=open]','style'),('[data-ro-action=open]','reparent'),('[data-ro-action=open]','reinsert')]:
            fresh(p,base);state(p,'quarters-gathering',[])
            handles=[p.locator('[data-ro-action=open]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()]
            # Live events are a positive control: opening and Hear have observable results.
            emit(handles[0]);state(p,'quarters-gathering',['open']);emit(p.locator(VIEW+' [data-speak]').element_handle());ok(p.evaluate('orderSpeech.words.length')>0,'live emitted action/Hear positive control')
            fresh(p,base);handles=[p.locator('[data-ro-action=open]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()]
            p.locator(target).evaluate('''(e,k)=>{window.__held=e;window.__parent=e.parentElement;window.__next=e.nextSibling;if(k==='hidden')e.hidden=true;if(k==='inert')e.inert=true;if(k==='aria')e.setAttribute('aria-hidden','true');if(k==='style')e.style.display='none';if(k==='class')e.classList.add('ro-hostile');if(k==='reparent')document.body.append(e);if(k==='reinsert'){e.remove();window.__wasDetached=!e.isConnected;__parent.insertBefore(e,__next);}}''',kind)
            ok(p.evaluate('''k=>({hidden:__held.hidden&&!__held.checkVisibility(),inert:__held.inert,aria:__held.getAttribute('aria-hidden')==='true',style:getComputedStyle(__held).display==='none',class:__held.classList.contains('ro-hostile'),reparent:__held.parentElement===document.body,reinsert:window.__wasDetached&&__held.isConnected})[k]''',kind),'actual hostile precondition '+kind)
            if target!=VIEW:handles=handles[:1]
            stale(p,handles,kind)
            p.evaluate('''()=>{__held.hidden=false;__held.inert=false;__held.removeAttribute('aria-hidden');__held.style.removeProperty('display');__held.classList.remove('ro-hostile');if(__held.parentElement!==__parent)__parent.insertBefore(__held,__next);}''')
            stale(p,handles,'restored '+kind)
        for boundary in ['case','history','view','frame','mode','root']:
            fresh(p,base)
            if boundary=='frame':
                action(p,'example');handles=[p.locator('[data-ro-action=next]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()]
                # The old frame-zero Next would return to frame one if accepted.
                action(p,'next');action(p,'next');ok(material(p)['frame']=='2','stale Next probe starts two frames beyond its captured callback')
            else:
                handles=[p.locator('[data-ro-action=open]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()]
                if boundary=='case':choose(p,'sixths-path')
                elif boundary=='history':action(p,'whole')
                elif boundary=='view':action(p,'explain')
                elif boundary=='mode':mode(p,'join');mode(p)
                else:
                    p.locator('[data-join-root]').evaluate('e=>{window.oldParent=e;window.oldNext=e.nextSibling;window.oldHost=e.parentNode;}')
                    parentmode=p.locator('[data-join-mode=join]').element_handle();mode(p,'join');mode(p)
                    p.locator('[data-join-root]').evaluate('e=>{window.liveParent=e;e.replaceWith(oldParent)}')
                    parent_before=p.locator('[data-join-root]').inner_html();emit(parentmode)
                    ok(p.locator('[data-join-root]').inner_html()==parent_before,'retired parent binding refuses old restored root after mode cycle')
                    stale(p,handles,'restored old parent root');p.evaluate('oldParent.replaceWith(liveParent)');continue
            stale(p,handles,boundary)
            if boundary=='case':choose(p,'quarters-gathering');state(p,'quarters-gathering',[])
        for operation in ['route','picker','owner','import','reset','reload']:
            fresh(p,base);choose(p,'sixths-path');action(p,'open');old=[p.locator('[data-ro-action=open]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()]
            if operation=='route':
                before=snapshot(p);voice=p.evaluate('orderSpeech.words.slice()')
                p.evaluate('''()=>{const a=[document.querySelector('[data-ro-action=open]'),document.querySelector('[data-ro-root] [data-speak]')];location.hash='#notes';a.forEach(e=>e.click());}''');p.locator('#download').wait_for()
                ok(snapshot(p)==before and p.evaluate('orderSpeech.words')==voice,'same-tick route rejects old material/Hear')
            elif operation in ['picker','owner']:
                p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-'+('1' if operation=='picker' else '2')+'"]').click()
            elif operation=='reload':p.reload(wait_until='networkidle')
            elif operation=='import':
                go(p,base,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-orders.json','mimeType':'application/json','buffer':json.dumps(SEED).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
            else:
                go(p,base,'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function('location.hash==="#home"');p.locator('dialog.welcome-film[open] [data-film-skip]').click()
            go(p,base);mode(p);state(p,'quarters-gathering',[]);choose(p,'sixths-path');state(p,'sixths-path',[])
            if operation!='reload':stale(p,old,'actual '+operation+' transition')
            # The fresh action visibly opens a whole, whereas every retained action is inert.
            emit(p.locator('[data-ro-action=open]').element_handle());state(p,'sixths-path',['open'])
    finally:finish(c,p)


def responsive(browser,base):
    for width in [320,1024]:
        c,p=setup(browser,base,width)
        try:
            baseline=snapshot(p);mode(p);choose(p,'quarters-without-trade');state(p,'quarters-without-trade',[]);layout(p,'maxrows-'+str(width))
            choose(p,'sixths-path');state(p,'sixths-path',[]);voice_panel(p,'sixths-'+str(width))
            action(p,'example')
            for _ in range(5):action(p,'next')
            geometry(p,9,4,['open','piece','piece','piece']);claim_geometry(p);layout(p,'claim-'+str(width));ok(snapshot(p)==baseline,'bounded responsive samples preserve memory/storage')
        finally:finish(c,p)


def main():
    server=None;base=os.environ.get('RIBBON_ORDERS_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self,*args):pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            parts=set(os.environ.get('RIBBON_ORDERS_TEST_PARTS','journey,lifecycle,responsive').split(','))
            for name,fn in [('journey',journey),('lifecycle',lifecycle),('responsive',responsive)]:
                if name in parts:print('Ribbon Orders: '+name,flush=True);fn(browser,base)
            ok(not h.errors and not h.console_errors and not h.http_failures and not h.request_failures,'no page/console/network faults '+str(h.errors+h.console_errors+h.http_failures+h.request_failures))
            receipt={'status':'passed','parts':sorted(parts),'artifacts':str(OUT),'limits':'Synthetic local Chrome, native speech requests observed; panel start events can be driven locally. No physical device/Safari/audibility/learning qualification.'};(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
        except Exception:
            for i,p in enumerate(pages):
                try:p.screenshot(path=str(OUT/f'failure-{i}.png'),full_page=True);(OUT/f'failure-{i}.html').write_text(p.content())
                except Exception:pass
            (OUT/'failure.json').write_text(json.dumps({'trace':traceback.format_exc(),'errors':h.errors+h.console_errors+h.http_failures+h.request_failures},indent=2));print('Artifacts: '+str(OUT),flush=True);raise
        finally:
            browser.close()
            if server:server.shutdown()


if __name__=='__main__':main()
