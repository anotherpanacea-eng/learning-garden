"""Wholes and Pieces431: actual-app synthetic notebooks and local speech requests.
Independent arithmetic and rendered geometry; artifacts remain in system temp.
Chromium does not qualify hardware, Safari, audibility, or learning.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, importlib.util, json, math, os, re
import tempfile, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(tempfile.mkdtemp(prefix='lg431-browser-', dir='/private/tmp'))
os.environ['MISSING_RIBBON_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('missing_browser', ROOT/'test/missing-ribbon-browser.py')
missing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(missing)
host = missing.host
host.FIXTURE['seed']['wholeBundles'] = {'version':987, 'unknown':{'preserve':['opaque future material',4]}}
VIEW = 'section[data-wb-root]'
CASES = {'seven-quarters':(7,4,0), 'eleven-quarters':(11,4,0),
 'three-and-two-fifths':(17,5,3), 'two-and-one-eighth':(17,8,2),
 'five-fifths':(5,5,0), 'two-thirds':(2,3,0), 'zero-quarters':(0,4,0),
 'two-wholes-thirds':(6,3,2)}
checks, pages = 0, []


def ok(value,message):
    global checks
    checks += 1
    assert value,message


def setup(browser,base,width=820):
    c,p=host.setup(browser,base,width)
    pages.append(p)
    p.evaluate('''()=>{speechSynthesis.speak=u=>{joinSpeech.words.push(u.text);u.onstart?.();};}''')
    return c,p


def mode(p,name='bundles'):
    p.locator('[data-join-mode="'+name+'"]').click()
    ok(p.locator('[data-join-mode="'+name+'"]').get_attribute('aria-pressed')=='true','native mode selected '+name)
    if name=='bundles':p.locator(VIEW).wait_for()


def action(p,name,key=None):
    q=p.locator(VIEW+' [data-wb-action="'+name+'"]')
    if key:q.focus();p.keyboard.press(key)
    else:q.click()


def choose(p,ident):
    p.locator(VIEW+' [data-wb-case]').focus()
    p.locator(VIEW+' [data-wb-case]').select_option(ident)
    focus(p,'[data-wb-case]')


def focus(p,selector):
    ok(p.locator(VIEW+' '+selector).evaluate('e=>e===document.activeElement'),'native focus '+selector)


def current(p):
    return p.locator(VIEW+' [data-wb-model]').first.evaluate('e=>Object.fromEntries(["packed","loose","numerator","denominator"].map(k=>[k,Number(e.dataset[k])]))')


def work(p):return p.locator(VIEW).evaluate('e=>({case:e.querySelector("[data-wb-case]")?.value,model:e.querySelector("[data-wb-model]")?.outerHTML,view:e.querySelector("[data-wb-view]")?.dataset.wbView,frame:e.querySelector("[data-wb-frame]")?.dataset.wbFrame})')


def unchanged(p,before,label):
    ok(host.snapshot(p)==before,label+' preserves actual notebook memory/local/session storage')


def geometry(p,n,d,packed,claim=False):
    svg=p.locator(VIEW+(' svg[data-wb-claim]' if claim else ' svg[data-wb-diagram]:not([data-wb-claim])'))
    ok(svg.count()==1,'one independently inspected '+('claim' if claim else 'current')+' diagram')
    rows=svg.locator('[data-wb-row]').evaluate_all('''xs=>xs.map(e=>{const b=x=>{const q=x.getBBox(),r=x.getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height,px:r.x,py:r.y,pw:r.width};};return {index:Number(e.dataset.wbRow),whole:b(e.querySelector('rect[data-wb-whole]')),pieces:[...e.querySelectorAll('rect[data-wb-piece]')].map(x=>({...b(x),id:Number(x.dataset.wbPiece),role:x.dataset.role})),brackets:[...e.querySelectorAll('[data-wb-bundle]')].map(x=>({...b(x),row:Number(x.dataset.wbBundle)})),flags:[...e.querySelectorAll('[data-wb-flag]')].map(x=>({path:x.getAttribute('d'),role:x.dataset.wbFlag}))};})''')
    expected_rows=max(1,math.ceil(n/d));ids=[];widths=[]
    ok(len(rows)==expected_rows,'one whole outline per occupied row, or one empty zero row')
    last=max(0,math.ceil(n/d)-1)
    for j,row in enumerate(rows):
        b=row['whole'];widths.append(b['pw'])
        ok(row['index']==j and abs(b['x']-48)<.01 and abs(b['w']-504)<.01,'independent one-whole SVG scale and row index')
        expected=list(range(j*d,min(n,(j+1)*d)))
        ok([x['id'] for x in row['pieces']]==expected,'actual unit identities in row order')
        for piece in row['pieces']:
            i=piece['id'];ids.append(i)
            ok(abs(piece['x']-(48+(i%d)*504/d))<.02 and abs(piece['w']-504/d)<.02,'piece keeps exact independently computed unit position/width')
            ok(abs(piece['pw']-b['pw']/d)<.3 and abs(piece['px']-(b['px']+(i%d)*b['pw']/d))<.3,'actual rendered unit has no artificial gaps')
            ok(piece['role']==('bundled' if i<packed*d else 'loose'),'unit identity has expected grouping role')
        ok(len(row['brackets'])==(1 if j<packed else 0),'only completed packed rows receive enclosing bundle bracket')
        for bracket in row['brackets']:
            ok(bracket['row']==j and bracket['x']<=49 and bracket['x']+bracket['w']>=551 and bracket['w']<=510,'bracket spans this complete one-whole row')
    flags=svg.locator('[data-wb-flag]').evaluate_all('xs=>xs.map(e=>({path:e.getAttribute("d"),role:e.dataset.wbFlag}))')
    ok(len(flags)==1,'one end flag including integer/zero')
    for flag in flags:
        coords=re.match(r'M\s*([\d.]+)\s+([\d.]+)',flag['path'])
        x,y=map(float,coords.groups())
        ok(abs(x-(48+504*(n-last*d)/d))<.02 and flag['role']==('different' if claim else 'current'),'actual endpoint path at independently computed fixed total')
        b=rows[last]['whole']
        ok(b['y']<=y<=b['y']+b['h'],'end flag starts on last occupied row, never an invented empty integer row')
    ok(ids==list(range(n)),'exactly N colored pieces; no empty outlines counted as stock')
    ok(widths and min(widths)>0 and max(widths)-min(widths)<.3,'rendered whole widths equal across rows')
    return widths


def hear(p):
    q=p.locator(VIEW+' [data-speak]');ok(q.count()==1,'one current visible read action')
    count=p.evaluate('joinSpeech.words.length');q.click()
    words=p.evaluate('joinSpeech.words.at(-1)')
    ok(p.evaluate('joinSpeech.words.length')==count+1,'actual speech binder requests exactly one utterance')
    ok(words and not re.search(r'\d+\s*/\s*\d+',words),'final utterance expands fractions')
    ok(not re.search(r'\b\d+\s+\d+\s+(thirds|quarters|fifths|eighths)\b',words),'mixed numeral never becomes adjacent spoken numbers')
    ok('Reading voice' not in words and 'Reading speed' not in words,'voice settings excluded from final utterance')
    return words


def layout(p,label):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no page overflow '+label)
    bad=p.locator(VIEW+' button,'+VIEW+' select,'+VIEW+' summary,[data-join-mode]').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&!e.closest('.speech-controls,drawn-howto')&&(e.getBoundingClientRect().width<43.5||e.getBoundingClientRect().height<43.5||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>e.outerHTML.slice(0,180))''')
    ok(not bad,'44px native controls and16px labels '+str(bad))
    endpoints=p.locator(VIEW+' [data-wb-flag]').evaluate_all('xs=>xs.map(e=>{const r=e.getBoundingClientRect(),s=e.ownerSVGElement.getBoundingClientRect();return r.left>=s.left-1&&r.right<=s.right+1&&r.left>=0&&r.right<=innerWidth;})')
    ok(endpoints and all(endpoints),'endpoints not clipped '+label)
    p.screenshot(path=str(OUT/(label+'.png')),full_page=True)


def voice_panel(p,label):
    hear(p);controls=p.locator('.speech-controls')
    ok(controls.is_visible(),'native speech controls visible')
    for phase in ['playing','stopped','expanded']:
        if phase=='stopped':p.locator('[data-stop-speech]').click()
        if phase=='expanded':
            controls.locator('.voice-settings>summary').click()
            ok(controls.locator('.voice-settings').evaluate('e=>e.open'),'voice settings actually open')
            hear(p)
        pairs=controls.evaluate('''root=>[...root.querySelectorAll('button,summary,label,select,[data-speech-status]')].filter(e=>e.checkVisibility()).map(e=>{let q=e,b;while(q){b=getComputedStyle(q).backgroundColor;if(b!=='rgba(0, 0, 0, 0)'&&b!=='transparent')break;q=q.parentElement;}return {fg:getComputedStyle(e).color,bg:b};})''')
        def lum(css):
            c=[float(x)/255 for x in re.findall(r'[\d.]+',css)[:3]]
            return sum((x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4)*w for x,w in zip(c,[.2126,.7152,.0722]))
        ok(pairs and all((max(lum(x['fg']),lum(x['bg']))+.05)/(min(lum(x['fg']),lum(x['bg']))+.05)>=4.5 for x in pairs),'voice text contrast '+phase)
        layout(p,label+'-'+phase)
    controls.locator('.voice-settings>summary').click()


def state_check(p,n,d,packed):
    ok(current(p)=={'packed':packed,'loose':n-packed*d,'numerator':n,'denominator':d},'actual model agrees with independently tracked material')
    geometry(p,n,d,packed)
    ok(p.locator('[data-wb-action=bundle]').is_enabled()==(n-packed*d>=d),'bundle boundary')
    ok(p.locator('[data-wb-action=open]').is_enabled()==(packed>0),'open boundary')
    text=p.locator(VIEW).inner_text();loose=n-packed*d
    if n==0:ok('Zero stays zero' in text,'zero refusal explains unchanged zero')
    elif loose==0:ok('No loose pieces' in text and 'Open one' in text,'exact-whole boundary explains opening')
    elif loose<d:ok(f'A whole needs {d} pieces' in text and ('There is 1 loose piece' if loose==1 else f'There are {loose} loose pieces') in text,'proper remainder refusal explains exact loose count')
    else:ok(('another whole' if packed else 'a whole') in text,'enough pieces explanation agrees with existing bundles')
    if packed==0:ok('There is no whole bundle to open' in text,'open refusal remains visible')


def names(p,n,d,packed):
    before=work(p);action(p,'names');p.locator('[data-wb-view=names]').wait_for()
    text=p.locator(VIEW).inner_text();q,r=divmod(n,d)
    ok(f'{packed} × {d} + {n-packed*d} = {n}' in text,'actual decomposition is distinct from canonical name')
    ok(f'numerator {n}' in text and f'denominator {d}' in text and f'{n}/{d}' in text,'numerator and denominator have exact supplied counts')
    if n==0:ok(f'0/{d} = 0' in text and 'There is no ribbon' in text,'zero name')
    elif q==0:ok('less than one whole' in text and 'needs no whole-number part' in text,'proper fraction needs no mixed part')
    elif r==0:ok(f'{n}/{d} = {q} whole' in text,'integer amount uses whole name')
    else:ok(f'{q} {r}/{d}' in text and f'{q} whole' in text and f'{r}/{d}' in text,'written canonical mixed numeral and exact parts visible')
    words=hear(p)
    ok('plus' in words and 'times' in words,'final decomposition utterance retains addition meaning')
    if q and r:
        expected={ (1,3,4):'one whole and three quarters',(2,3,4):'two wholes and three quarters',(3,2,5):'three wholes and two fifths',(2,1,8):'two wholes and one eighth'}[(q,r,d)]
        ok(expected in words.lower(),'final utterance conveys mixed-name whole/part units')
    action(p,'back');focus(p,'[data-wb-action=names]');ok(work(p)==before,'names/back preserves exact case/material')


def journey(browser,base):
    c,p=setup(browser,base)
    try:
        before_notes=host.export(p,base,'before-bundles');ok(before_notes['wholeBundles']==host.FIXTURE['seed']['wholeBundles'],'Notes contains explicit unknown wholeBundles root')
        host.go(p,base);before=host.snapshot(p)
        host.choose(p,'half-and-third');host.act(p,'split','left',3)
        old_join=p.locator(host.selector('split','left',2)).element_handle();join_work=host.state(p)
        mode(p,'missing');missing.choose(p,'half-and-third');missing.act(p,'split-known',3)
        old_missing=p.locator(missing.selector('split-total')).element_handle();missing_work=missing.state(p)
        for name in ['join','missing']:
            mode(p,name);text=p.locator('[data-join-root]').inner_text()
            ok('Both tables' not in text,'parent visit copy remains neutral in '+name)
        mode(p);focus(p,'#wb-heading')
        ok(p.locator('[data-wb-case] option').evaluate_all('xs=>xs.map(e=>e.value)')==list(CASES),'eight finite case choices')
        text=p.locator('[data-join-root]').inner_text();ok(text.count('this work is not saved in Notes')==1,'child owns one visit footer')
        for ident,(n,d,start) in CASES.items():
            choose(p,ident);state_check(p,n,d,start)
            if ident=='three-and-two-fifths':
                words=hear(p);ok('three wholes and two fifths' in words.lower() and '3 2/5' in p.locator(VIEW).inner_text(),'mixed-start visual and final spoken meaning')
            packed=start
            while packed:
                action(p,'open','Space' if packed==start else None);packed-=1;state_check(p,n,d,packed)
                focus(p,'[data-wb-action=open]' if packed else '[data-wb-action=bundle]' if n>=d else '#wb-heading')
            while packed<n//d:
                action(p,'bundle','Enter' if packed==0 else None);packed+=1;state_check(p,n,d,packed)
                focus(p,'[data-wb-action=bundle]' if n-packed*d>=d else '[data-wb-action=open]')
            names(p,n,d,packed)
            while packed:action(p,'open');packed-=1
            state_check(p,n,d,0)
            unchanged(p,before,'all arithmetic '+ident)
        choose(p,'eleven-quarters');action(p,'bundle');state_check(p,11,4,1);names(p,11,4,1)
        ok('incorrect' not in p.locator(VIEW).inner_text().lower(),'valid noncanonical one whole plus seven quarters is not rejected')
        saved=work(p);action(p,'example')
        for frame,packed in enumerate([0,1,2,1,0,2]):
            p.locator('[data-wb-view=example]').wait_for();widths=geometry(p,7,3,packed);words=hear(p)
            if frame==2:ok('two wholes and one third' in words.lower() and '2 1/3' in p.locator(VIEW).inner_text(),'example mixed visual and final speech')
            if frame==4:ok('plus' in words.lower() and 'two times three' in words.lower(),'example equation speech preserves plus and whole count')
            if frame==5:
                widths+=geometry(p,3,3,0,True)
                ok(max(widths)-min(widths)<.3,'claim and reference actual rendered whole widths equal')
                ok('different' in words.lower() and 'one whole' in words.lower() and 'seven thirds' in words.lower(),'false claim final words explain different units/amount')
            if frame<5:
                action(p,'next');ok(p.evaluate('document.activeElement.matches("[data-wb-action=previous],[data-wb-action=next]")&&!document.activeElement.disabled'),'enabled example navigation focus')
        ok(p.locator('[data-wb-action=next]').is_disabled(),'six frames end without automatic advance')
        action(p,'previous');action(p,'back');focus(p,'[data-wb-action=example]');ok(work(p)==saved,'manual example leaves live case and material exact')
        voice_panel(p,'journey-820');unchanged(p,before,'all optional narration')
        mode(p,'join');ok(host.state(p)==join_work,'Join material preserved across all three modes');host.dispatch(old_join);ok(host.state(p)==join_work,'old Join control refused after return')
        mode(p,'missing');ok(missing.state(p)==missing_work,'Missing material preserved across all three modes');host.dispatch(old_missing);ok(missing.state(p)==missing_work,'old Missing control refused after return')
        mode(p);state_check(p,11,4,1)
        after_notes=host.export(p,base,'after-bundles');ok(after_notes==before_notes,'actual Notes export exact including opaque wholeBundles root');unchanged(p,before,'Notes round trip')
    finally:c.close()


def stale(p,handles,label):
    before=work(p);book=host.snapshot(p);voice=p.evaluate('joinSpeech.words.slice()')
    for handle in handles:host.dispatch(handle)
    ok(work(p)==before and host.snapshot(p)==book and p.evaluate('joinSpeech.words')==voice,'retained callbacks refuse '+label)


def lifecycle(browser,base):
    c,p=setup(browser,base)
    try:
        for target in [VIEW,'[data-wb-action=bundle]']:
            for kind in ['hidden','inert','aria','style','class','reparent','reinsert']:
                host.go(p,base);mode(p)
                handles=[p.locator('[data-wb-action=bundle]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()]
                ok(handles[0].is_enabled(),'hostile probe begins with enabled action')
                p.locator(target).evaluate('''(e,k)=>{window.__held=e;window.__parent=e.parentElement;window.__next=e.nextSibling;if(k==='hidden')e.hidden=true;if(k==='inert')e.inert=true;if(k==='aria')e.setAttribute('aria-hidden','true');if(k==='style')e.style.display='none';if(k==='class')e.classList.add('wb-hostile');if(k==='reparent')document.body.append(e);if(k==='reinsert'){e.remove();window.__detached=!e.isConnected;__parent.insertBefore(e,__next);}}''',kind)
                condition=p.locator(target).evaluate('''(e,k)=>({hidden:e.hidden&&!e.checkVisibility(),inert:e.inert&&e.hasAttribute('inert'),aria:e.getAttribute('aria-hidden')==='true',style:getComputedStyle(e).display==='none',class:e.classList.contains('wb-hostile'),reparent:e.parentElement===document.body&&e.parentElement!==__parent,reinsert:window.__detached&&e.isConnected&&e.parentElement===__parent})[k]''',kind)
                ok(condition,'actual hostile precondition '+target+' '+kind)
                stale(p,handles,target+' '+kind)
                p.evaluate('''()=>{const e=__held;e.hidden=false;e.inert=false;e.removeAttribute('aria-hidden');e.style.removeProperty('display');e.classList.remove('wb-hostile');if(e.parentElement!==__parent)__parent.insertBefore(e,__next);}''')
                stale(p,handles,'restored '+target+' '+kind)
        for boundary in ['case','work','view','frame','mode']:
            host.go(p,base);mode(p)
            if boundary=='frame':action(p,'example');handles=[p.locator('[data-wb-action=next]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()];action(p,'next')
            else:
                handles=[p.locator('[data-wb-action=bundle]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()]
                if boundary=='case':choose(p,'eleven-quarters')
                elif boundary=='work':action(p,'bundle')
                elif boundary=='view':action(p,'names')
                else:mode(p,'join');mode(p)
            stale(p,handles,boundary)
        for operation in ['route','picker','owner','import','reset','reload']:
            host.go(p,base);mode(p);choose(p,'three-and-two-fifths');action(p,'open')
            handles=[p.locator('[data-wb-action=open]').element_handle(),p.locator(VIEW+' [data-speak]').element_handle()]
            if operation=='route':
                saved=host.snapshot(p);voice=p.evaluate('joinSpeech.words.slice()')
                p.evaluate('''()=>{const xs=[document.querySelector('[data-wb-action=open]'),document.querySelector('[data-wb-root] [data-speak]')];location.hash='#notes';xs.forEach(e=>e.click());}''')
                p.locator('#download').wait_for();ok(host.snapshot(p)==saved and p.evaluate('joinSpeech.words')==voice,'same-tick route departure refuses work and Hear')
            elif operation in ['picker','owner']:
                p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-'+('1' if operation=='picker' else '2')+'"]').click()
            elif operation=='reload':p.reload(wait_until='networkidle')
            elif operation=='import':
                host.go(p,base,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-wholes.json','mimeType':'application/json','buffer':json.dumps(host.FIXTURE['seed']).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
            else:
                host.go(p,base,'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function('location.hash==="#home"');film=p.locator('dialog.welcome-film[open]');film.wait_for();film.locator('[data-film-skip]').click()
            host.go(p,base);mode(p);state_check(p,7,4,0)
            if operation!='reload':stale(p,handles,'actual '+operation+' transition')
            choose(p,'three-and-two-fifths');state_check(p,17,5,3)
    finally:c.close()


def responsive(browser,base):
    for width in [320,1024]:
        c,p=setup(browser,base,width)
        try:
            before=host.snapshot(p);mode(p);choose(p,'three-and-two-fifths');geometry(p,17,5,3);layout(p,'four-rows-'+str(width))
            choose(p,'two-and-one-eighth');geometry(p,17,8,2);voice_panel(p,'eighths-'+str(width));unchanged(p,before,'bounded responsive sample')
        finally:c.close()


def main():
    server=None;base=os.environ.get('WHOLE_BUNDLES_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
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
            parts=set(os.environ.get('WHOLE_BUNDLES_TEST_PARTS','journey,lifecycle,responsive').split(','))
            for name,fn in [('journey',journey),('lifecycle',lifecycle),('responsive',responsive)]:
                if name in parts:print('Wholes and Pieces: '+name,flush=True);fn(browser,base)
            ok(not host.errors,'no page/console/network faults '+str(host.errors))
            receipt={'status':'passed','checks':checks,'parts':sorted(parts),'artifacts':str(OUT),'limits':'Synthetic Chromium; local speech requests, no hardware/Safari/audibility/learning qualification.'}
            (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
        except Exception:
            for i,p in enumerate(pages):
                try:p.screenshot(path=str(OUT/f'failure-{i}.png'),full_page=True)
                except Exception:pass
            (OUT/'failure.json').write_text(json.dumps({'checks':checks,'errors':host.errors,'trace':traceback.format_exc()},indent=2));print('Artifacts: '+str(OUT),flush=True);raise
        finally:
            browser.close()
            if server:server.shutdown()


if __name__=='__main__':main()
