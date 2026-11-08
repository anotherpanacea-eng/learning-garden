"""Group Pieces430: actual-app synthetic notebooks, local text speech stub.

Independent arithmetic and SVG geometry checks; Chromium is not iPad/Safari,
audibility, or evidence of learning. Artifacts stay in the system temp folder.
"""
import sys
sys.dont_write_bytecode = True
import copy, functools, http.server, importlib.util, json, math, os, re
import subprocess, tempfile, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('GROUP_PIECES_ARTIFACTS', tempfile.mkdtemp(prefix='lg430-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location('common_browser', ROOT/'test/common-cuts-browser.py')
common = importlib.util.module_from_spec(spec)
spec.loader.exec_module(common)
common.OUT = OUT
VIEW = '[data-gp-root]'
CASES = {'six-eighths': (6,8), 'eighteen-twentyfourths': (18,24),
         'fourteen-twentyfirsts': (14,21), 'five-twelfths': (5,12),
         'zero-twelfths': (0,12), 'whole-twelfths': (12,12)}
checks, pages, contexts, errors = 0, [], [], []


def ok(value, message):
    global checks
    checks += 1
    assert value, message


def setup(browser, base, seed, width=820, height=1180):
    p = common.setup(browser,width,height,seed,'group-'+str(width),copy.deepcopy(seed))
    contexts.append(p.context);pages.append(p)
    p.context.add_init_script('''window.gpSpeech={words:[],cancel:0};
window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
Object.defineProperty(window,'speechSynthesis',{value:{
getVoices:()=>[{name:'Synthetic local English',lang:'en-US',localService:true,voiceURI:'synthetic-local'}],
addEventListener(){},removeEventListener(){},cancel(){gpSpeech.cancel++;},
speak(u){gpSpeech.words.push(u.text);u.onstart?.();}}});''')
    def observe(route):
        response=route.fetch();body=response.text();marker='let graph=null,'
        assert body.count(marker)==1, 'actual app memory observer marker'
        route.fulfill(response=response,body=body.replace(marker,'window.__gpNotebook=()=>structuredClone(state);'+marker,1))
    p.context.route('**/app.mjs',observe)
    common.go(p,base)
    return p


def snapshot(p):
    return p.evaluate('''()=>({memory:__gpNotebook(),local:Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])),session:Object.fromEntries(Object.keys(sessionStorage).sort().map(k=>[k,sessionStorage.getItem(k)]))})''')


def unchanged(p,before,why):
    ok(snapshot(p)==before,why+' preserves actual memory and both complete storage maps')


def mode(p,value):
    p.locator('[data-common-mode="'+value+'"]').click()
    if value=='groups':p.locator(VIEW).wait_for()


def action(p,name):p.locator(VIEW+' [data-gp-action="'+name+'"]').click()
def choose(p,ident):p.locator(VIEW+' [data-gp-case]').select_option(ident)
def preview(p,g):p.locator(VIEW+' [data-gp-factor]').select_option(str(g))
def current(p):
    e=p.locator(VIEW+' [data-gp-model]').first
    return tuple(int(e.get_attribute('data-'+key)) for key in ['numerator','denominator'])
def focus(p,selector):ok(p.locator(selector).evaluate('e=>e===document.activeElement'),'native focus '+selector)
def work(p):return p.locator(VIEW).evaluate('e=>({html:e.innerHTML,case:e.querySelector("[data-gp-case]")?.value,preview:e.querySelector("[data-gp-factor]")?.value})')


def geometry(p,original,now,g=None,changed=False):
    diagrams=p.locator(VIEW+' svg[data-gp-diagram]')
    ok(diagrams.count()==2,'separate original and current ribbon diagrams')
    info={}
    for key,fraction in [('original',original),('current',now)]:
        svg=diagrams.nth(0 if key=='original' else 1)
        row=svg.evaluate("""e=>{const box=s=>{const q=e.querySelector(s);if(!q)return null;const b=q.getBBox();return {x:b.x,y:b.y,w:b.width,h:b.height};};return {whole:box('[data-gp-whole]'),shade:box('[data-gp-shade]'),flag:e.querySelector('[data-gp-flag]').getAttribute('d'),flagRole:e.querySelector('[data-gp-flag]').dataset.gpFlag,brackets:[...e.querySelectorAll('[data-gp-bracket]')].map(b=>({role:b.dataset.gpBracket,path:b.getAttribute('d')})),wholeR:box('[data-gp-remainder=whole]'),coloredR:box('[data-gp-remainder=colored]')};}""")
        ok(abs(row['whole']['x']-48)<.001 and abs(row['whole']['w']-504)<.001,'fixed 0-to-1 whole has independent x48 width504 geometry')
        n,d=fraction;b=row['shade']
        ok(b is not None and abs(b['x']-48)<.01 and abs(b['w']-504*n/d)<.01,key+' actual shade fraction')
        ok(row['flagRole']==('different' if changed and key=='current' else key),'endpoint marker identifies '+key+' or distinct changed amount')
        coordinate=float(re.match(r'M([\d.]+)',row['flag'])[1])
        ok(abs(coordinate-(48+504*n/d))<.01,key+' actual flag path at independently calculated colored end')
        if key=='current':info=row
    for role,total in [('whole',now[1]),('colored',now[0])]:
        brackets=[b for b in info['brackets'] if b['role']==role]
        ok(len(brackets)==(total//g if g else 0),role+' actual complete-group bracket count')
        for i,bracket in enumerate(brackets):
            actual=[float(x) for x in re.findall(r'-?\d+(?:\.\d+)?',bracket['path'])]
            expected=[49+504*i*g/now[1],79 if role=='whole' else 20,7 if role=='whole' else -7,47+504*(i+1)*g/now[1],-7 if role=='whole' else 7]
            ok(len(actual)==len(expected) and all(abs(a-b)<.01 for a,b in zip(actual,expected)),role+' bracket independently spans exactly g adjacent pieces in its correct band')
        b=info[role+'R'];remainder=total%g if g else 0
        if remainder:
            ok(b is not None and abs(b['x']-(48+504*(total-remainder)/now[1]))<.01 and abs(b['w']-504*remainder/now[1])<.01,role+' remainder covers only actual leftover current pieces')
        else:ok(b is None or abs(b['w'])<.01,role+' has no leftover hatch')
    return info


def layout(p,label):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow '+label)
    bad=p.locator(VIEW+' button,'+VIEW+' select,'+VIEW+' summary,'+VIEW+' a').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&!e.closest('.speech-controls,drawn-howto')&&(e.getBoundingClientRect().width<43.5||e.getBoundingClientRect().height<43.5||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({html:e.outerHTML.slice(0,180),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,font:getComputedStyle(e).fontSize}))''')
    ok(not bad,'native44px controls and16px labels '+str(bad))
    p.screenshot(path=str(OUT/(label+'.png')),full_page=True)


def hear(p):
    read=p.locator(VIEW+' [data-speak]');ok(read.count()==1,'one current visible read-aloud action')
    count=p.evaluate('gpSpeech.words.length');read.click();script=read.get_attribute('data-speak')
    ok(p.evaluate('gpSpeech.words.length')==count+1,'visible narration reaches actual speech binder once')
    words=p.evaluate('gpSpeech.words.at(-1)')
    ok(words and not re.search(r'\d(?:equals|divided|over)\d',words),'final speech contains separated mathematical words')
    ok(not re.search(r'\b1 (?:groups|pieces)\b',words),'final speech number agreement')
    n,d=current(p)
    names={2:('half','halves'),3:('third','thirds'),4:('quarter','quarters'),6:('sixth','sixths'),8:('eighth','eighths'),12:('twelfth','twelfths')}
    fraction=f'{n} '+(names[d][0 if n==1 else 1] if d in names else f'over {d}')
    ok(fraction in words,'final device request narrates independently expected current fraction '+fraction)
    if p.locator('[data-gp-view=work]').count():
        ok('Picture ' not in script and 'simplest whole-number name' not in script,'closed teaching pages stay out of current speech')
    return script,words


def voice_panel(p,label):
    controls=p.locator('.speech-controls');ok(controls.is_visible(),'native speech controls visible')
    for phase in ['playing','stopped','expanded']:
        if phase=='stopped':p.locator('[data-stop-speech]').click()
        if phase=='expanded':
            controls.locator('.voice-settings>summary').click()
            ok(controls.locator('.voice-settings').evaluate('e=>e.open'),'voice settings genuinely expanded')
            _,words=hear(p)
            ok('Reading voice' not in words and 'Reading speed' not in words,'final utterance excludes expanded voice controls')
        pairs=controls.evaluate('''root=>[...root.querySelectorAll('button,summary,label,select,[data-speech-status]')].filter(e=>e.checkVisibility()).map(e=>{let q=e,b;while(q){b=getComputedStyle(q).backgroundColor;if(b!=='rgba(0, 0, 0, 0)'&&b!=='transparent')break;q=q.parentElement;}return {fg:getComputedStyle(e).color,bg:b};})''')
        def lum(css):
            c=[float(x)/255 for x in re.findall(r'[\d.]+',css)[:3]]
            return sum((x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4)*w for x,w in zip(c,[.2126,.7152,.0722]))
        ok(pairs and all((max(lum(x['fg']),lum(x['bg']))+.05)/(min(lum(x['fg']),lum(x['bg']))+.05)>=4.5 for x in pairs),'voice text contrast in '+phase)
        layout(p,label+'-'+phase)
    controls.locator('.voice-settings>summary').click()


def apply(p,g,expected):
    preview(p,g);ok(p.locator('[data-gp-action=apply]').is_enabled(),'fitting common factor enabled')
    action(p,'apply');ok(current(p)==expected,'grouping divides both exact counts')
    focus(p,'[data-gp-action=undo]' if expected[1]==1 else '[data-gp-factor]')


def journey(browser,base,seed):
    p=setup(browser,base,seed)
    baseline_notes=common.download(p,base,'before-groups')
    ok(baseline_notes.get('groupPieces')==seed['groupPieces'],'starting actual Notes export contains opaque unknown groupPieces root')
    common.go(p,base);before=snapshot(p)
    # Real parent work must survive the new mode, including stale parent controls.
    common.choose(p,'half-and-third');common.split(p,'left',3)
    old=p.locator('[data-common-split="left"][data-factor="2"]').element_handle()
    mode(p,'groups');focus(p,'#gp-heading');unchanged(p,before,'normal mode entry')
    for ident,(n,d) in CASES.items():
        choose(p,ident);ok(current(p)==(n,d),'case starts with immutable original '+ident)
        geometry(p,(n,d),(n,d))
        ok('No grouping to undo yet.' in p.locator(VIEW).inner_text() and p.locator('[data-gp-action=undo]').is_disabled(),'original ribbon explains empty history')
        if ident=='six-eighths':
            for g in [3,4,5,7]:
                preview(p,g);geometry(p,(n,d),(n,d),g)
                ok(p.locator('[data-gp-action=apply]').is_disabled(),'nonfit remains an optional preview')
                message=p.locator('[data-gp-preview]').inner_text()
                role='The whole has pieces left over.' if g==3 else 'The colored part has pieces left over.' if g==4 else 'The whole and its colored part have pieces left over.'
                ok(role in message,'preview identifies exact leftover role for6/8 group'+str(g))
            preview(p,2);geometry(p,(n,d),(n,d),2)
            # Native keyboard, with current focus style visible before activation.
            p.keyboard.press('Tab');p.locator('[data-gp-action=apply]').focus()
            ok(p.locator('[data-gp-action=apply]').evaluate('e=>getComputedStyle(e).outlineStyle!=="none"||getComputedStyle(e).boxShadow!=="none"'),'visible keyboard focus')
            p.keyboard.press('Enter');ok(current(p)==(3,4),'Enter applies fitting group')
        elif ident=='eighteen-twentyfourths':
            for path in [[2,3],[3,2],[6]]:
                now=(n,d)
                for g in path:
                    now=(now[0]//g,now[1]//g);apply(p,g,now);geometry(p,(n,d),now)
                    if now==(9,12):
                        action(p,'names');text=p.locator(VIEW).inner_text();ok('Group size 3 fits both counts' in text and 'common factor of 9 and 12' in text and 'simplest' not in text,'9/12 suggests actual common factor3 and does not claim simplest')
                        action(p,'back');focus(p,'[data-gp-action=names]')
                for _ in path:action(p,'undo')
                ok(current(p)==(n,d),'repeated Undo returns to exact original')
        elif ident=='fourteen-twentyfirsts':
            preview(p,7);p.locator('[data-gp-action=apply]').focus();p.keyboard.press('Space')
            ok(current(p)==(2,3),'Space applies factor7');geometry(p,(n,d),(2,3))
        elif ident in ['zero-twelfths','whole-twelfths']:
            if n==0:
                preview(p,5);geometry(p,(n,d),(n,d),5)
                text=p.locator('[data-gp-preview]').inner_text()
                ok('Colored part: 0 complete groups, 0 current colored pieces left' in text and 'The whole has pieces left over.' in text and p.locator('[data-gp-action=apply]').is_disabled(),'zero complete colored groups fit; whole remainder alone prevents grouping by5')
                preview(p,12);geometry(p,(n,d),(n,d),12)
                ok('There are no colored pieces, so none are left over.' in p.locator('[data-gp-preview]').inner_text(),'zero colored groups permit complete whole grouping by12')
            apply(p,12,(n//12,1));geometry(p,(n,d),(n//12,1))
            ok('This whole is already one piece.' in p.locator('[data-gp-preview]').inner_text() and p.locator('[data-gp-action=apply]').is_disabled(),'one-piece state explains why no further grouping is possible')
            ok(not p.locator('[data-gp-factor] option').evaluate_all('xs=>xs.filter(e=>Number(e.value)>=2).length'),'one whole piece offers no group sizes')
        action(p,'names');p.locator('[data-gp-view=compare]').wait_for()
        text=p.locator(VIEW).inner_text();now=current(p)
        ok(f'{n}/{d}' in text and f'{now[0]}/{now[1]}' in text,'names preserve original and current arithmetic')
        if math.gcd(*now)==1 and now[1]>1:ok('simplest' in text.lower(),'coprime name explains simplest whole-number name')
        if now[1]==1:ok(('0/1' if n==0 else '1/1') in text,'zero and one whole names explicit')
        hear(p);action(p,'back');focus(p,'[data-gp-action=names]');unchanged(p,before,'case/names work '+ident)
    choose(p,'six-eighths');preview(p,3);saved=work(p);action(p,'example')
    for frame in range(6):
        p.locator('[data-gp-view=example]').wait_for();now=(2,3) if frame==2 else (3,6) if frame==5 else (6,9)
        geometry(p,(6,9),now,3 if frame==1 else 2 if frame==3 else 9 if frame==4 else None,changed=frame==5)
        script,words=hear(p)
        if frame==4:ok('Colored part: 0 complete groups, 6 current colored pieces left' in words,'frame5 narrates zero complete colored groups alongside six leftover colored pieces')
        if frame==5:ok('half' in words.lower() and 'third' in words.lower() and 'Different amount: 3/6' in script and 'Now: 3/6' not in script,'subtraction contrast explicitly labels its distinct amount')
        if frame<5:action(p,'next');focus(p,'[data-gp-action=previous]' if frame==4 else '[data-gp-action=next]')
    ok(p.locator('[data-gp-action=next]').is_disabled(),'example ends without automatic advance')
    action(p,'previous');action(p,'back');focus(p,'[data-gp-action=example]');ok(work(p)==saved,'six manual examples leave live material and preview exact')
    hear(p);voice_panel(p,'journey-820');unchanged(p,before,'all optional narration')
    mode(p,'cuts');ok(common.d(p,'left')==6,'Compare cuts work survives mode switch')
    old.evaluate('e=>e.click()');ok(common.d(p,'left')==6,'retained old parent control refused even after switching back')
    mode(p,'groups');ok(current(p)==(3,4),'group work survives mode switch');ok(p.locator('[data-gp-factor]').input_value()=='3','preview survives mode switch')
    after_notes=common.download(p,base,'after-groups')
    ok({k:v for k,v in baseline_notes.items() if k!='exportedAt'}=={k:v for k,v in after_notes.items() if k!='exportedAt'},'actual Notes before/after exact including unknown groupPieces root')
    unchanged(p,before,'Notes round trip');p.context.close()


def stale(p,mutate,label):
    before=work(p);book=snapshot(p);speech=p.evaluate('gpSpeech.words.slice()')
    mutate()
    ok(work(p)==before and snapshot(p)==book and p.evaluate('gpSpeech.words')==speech,'retained action refuses '+label)


def lifecycle(browser,base,seed):
    p=setup(browser,base,seed);mode(p,'groups')
    # Hidden/reparented/reinserted roots and controls are permanently stale.
    for target in [VIEW,'[data-gp-action=apply]']:
        for kind in ['hidden','inert','aria','style','class','reparent','reinsert']:
            p.reload();common.go(p,base);mode(p,'groups');preview(p,2)
            h=p.locator('[data-gp-action=apply]').element_handle()
            p.locator(target).evaluate('''(e,k)=>{window.__gpHeld=e;window.__gpParent=e.parentElement;window.__gpNext=e.nextSibling;if(k==='hidden')e.hidden=true;if(k==='inert')e.inert=true;if(k==='aria')e.setAttribute('aria-hidden','true');if(k==='style')e.style.display='none';if(k==='class')e.classList.add('hidden');if(k==='reparent')document.body.append(e);if(k==='reinsert'){e.remove();window.__gpDetached=!e.isConnected;__gpParent.insertBefore(e,__gpNext);}}''',kind)
            condition=p.locator(target).evaluate('''(e,k)=>({hidden:e.hasAttribute('hidden')&&e.hidden&&!e.checkVisibility(),inert:e.inert&&e.hasAttribute('inert'),aria:e.getAttribute('aria-hidden')==='true',style:getComputedStyle(e).display==='none',class:e.classList.contains('hidden'),reparent:e.parentElement===document.body&&e.parentElement!==__gpParent,reinsert:window.__gpDetached&&e.isConnected&&e.parentElement===__gpParent})[k]''',kind)
            ok(condition,'mutation precondition '+target+' '+kind)
            # Capture after the hostile mutation, before event dispatch.
            before=snapshot(p);h.evaluate('e=>e.click()');unchanged(p,before,'guard '+target+' '+('class attribute change' if kind=='class' else kind))
            if p.locator(VIEW+' [data-gp-model]').count():ok(current(p)==(6,8),'blocked control cannot group hidden/reparented material')
            p.evaluate('''()=>{const e=__gpHeld;e.hidden=false;e.inert=false;e.removeAttribute('aria-hidden');e.style.removeProperty('display');e.classList.remove('hidden');if(e.parentElement!==__gpParent)__gpParent.insertBefore(e,__gpNext);}''')
            old=current(p);h.evaluate('e=>e.click()');ok(current(p)==old,'restored lookalike does not revive invalidated callback')
    for boundary in ['preview','case','work','view','frame','mode']:
        p.reload();common.go(p,base);mode(p,'groups');preview(p,2)
        if boundary=='frame':action(p,'example');h=p.locator('[data-gp-action=next]').element_handle();action(p,'next')
        else:
            h=p.locator('[data-gp-action=apply]').element_handle()
            if boundary=='preview':preview(p,3)
            elif boundary=='case':choose(p,'fourteen-twentyfirsts')
            elif boundary=='work':action(p,'apply')
            elif boundary=='view':action(p,'names')
            elif boundary=='mode':mode(p,'cuts');mode(p,'groups')
        stale(p,lambda:h.evaluate('e=>e.click()'),boundary)
    common.go(p,base);mode(p,'groups');apply(p,2,(3,4));h=p.locator('[data-gp-action=undo]').element_handle()
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for();before=snapshot(p);h.evaluate('e=>e.click()');unchanged(p,before,'route departure')
    report=common.download(p,base,'lifecycle');common.bring(p,base,report)
    common.go(p,base);mode(p,'groups');ok(current(p)==(6,8),'import starts a fresh temporary ribbon')
    apply(p,2,(3,4));p.reload();common.go(p,base);mode(p,'groups');ok(current(p)==(6,8),'reload resets temporary material')
    apply(p,2,(3,4));p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();common.go(p,base);mode(p,'groups');ok(current(p)==(6,8),'different explorer never inherits ribbon')
    apply(p,2,(3,4));p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();common.go(p,base);mode(p,'groups');ok(current(p)==(6,8),'opening picker clears visit even choosing same explorer')
    p.locator('a[href="#notes"]').first.click();p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function('location.hash==="#home"')
    film=p.locator('dialog.welcome-film[open]');film.wait_for();film.locator('[data-film-skip]').click();common.go(p,base);mode(p,'groups');ok(current(p)==(6,8),'reset creates fresh ribbon');p.context.close()


def responsive(browser,base,seed):
    for w,h in [(320,800),(1024,768)]:
        p=setup(browser,base,seed,w,h);before=snapshot(p);mode(p,'groups');choose(p,'eighteen-twentyfourths');preview(p,5)
        geometry(p,(18,24),(18,24),5);layout(p,'remainder-'+str(w));hear(p);voice_panel(p,'voice-'+str(w));unchanged(p,before,'bounded responsive exploration');p.context.close()


def main():
    js="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.sentinel={note:'Invented sibling work'};s.groupPieces={version:987,unknown:{preserve:['opaque',4]}};console.log(JSON.stringify(s));"
    seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True))
    server=None;base=os.environ.get('GROUP_PIECES_TEST_URL')
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
            parts=set(os.environ.get('GROUP_PIECES_TEST_PARTS','journey,lifecycle,responsive').split(','))
            for name,fn in [('journey',journey),('lifecycle',lifecycle),('responsive',responsive)]:
                if name in parts:print('Group Pieces: '+name,flush=True);fn(browser,base,seed)
            ok(not common.errors and not common.faults,'no actual page/console/network faults: '+str(common.errors+common.faults))
            receipt={'status':'passed','checks':checks,'parts':sorted(parts),'base':base,'artifacts':str(OUT),'limits':'Synthetic Chromium, local text speech stub; no physical iPad/Safari/audibility/learning qualification.'}
            (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt))
        except Exception:
            for i,p in enumerate(pages):
                try:p.screenshot(path=str(OUT/f'failure-{i}.png'),full_page=True)
                except Exception:pass
            (OUT/'failure.json').write_text(json.dumps({'checks':checks,'errors':common.errors,'faults':common.faults,'trace':traceback.format_exc()},indent=2));raise
        finally:
            browser.close()
            if server:server.shutdown()


if __name__=='__main__':main()
