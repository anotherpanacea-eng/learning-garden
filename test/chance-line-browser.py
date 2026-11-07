"""Chance Line409 actual-app journeys with invented notebooks only.

The temporary response observer exposes actual memory read-only. Speech is a
local text stub; this suite does not qualify device audio or measure learning.
"""
import sys
sys.dont_write_bytecode = True
import functools, http.server, json, os, subprocess, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('CHANCE_LINE_ARTIFACTS', '/private/tmp/lg409-native'))
OUT.mkdir(parents=True, exist_ok=True)
checks, errors, contexts, pages = 0, [], [], []


def ok(value, message):
    global checks
    checks += 1
    assert value, message


def fixture(cap=False):
    code = '''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startSeed, drawSeed, chooseSeedPrediction} from './dist/seed-stall-core.mjs';
const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;
s.syntheticSibling={raw:'Invented sibling retained exactly'};
for(let i=0;i<COUNT;i++)startSeed(s,(i+3)%7);
chooseSeedPrediction(s,'moon');drawSeed(s,0);drawSeed(s,4);
console.log(JSON.stringify(s));'''.replace('COUNT', '8' if cap else '1')
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))


def setup(browser, base, seed=None, width=820):
    ctx = browser.new_context(viewport={'width':width,'height':1000 if width>320 else 700}, has_touch=True, reduced_motion='reduce', accept_downloads=True)
    contexts.append(ctx)
    registry = {'version':1,'activeId':'explorer-1','explorers':[
        {'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-11-05T12:00:00Z'},
        {'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-11-05T12:00:00Z'}]}
    data = {'registry':registry,'seed':seed if seed is not None else fixture()}
    ctx.add_init_script('''(d=>{if(!localStorage.getItem('chance-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem('number-garden-v1:'+e.id,JSON.stringify(d.seed));localStorage.setItem('chance-fixture','1');}
window.__chanceSpoken=[];Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{name:'Invented local voice',lang:'en-US',localService:true,default:true,voiceURI:'invented-local'}],cancel(){},speak(u){window.__chanceSpoken.push(u.text);},addEventListener(){},removeEventListener(){}}});window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
})('''+json.dumps(data)+')')
    def observer(route):
        response=route.fetch();body=response.text();marker='let graph=null,'
        assert body.count(marker)==1, 'actual app observation marker'
        route.fulfill(response=response,body=body.replace(marker,'window.__chanceObservedState=()=>state;'+marker,1))
    ctx.route('**/app.mjs',observer)
    p=ctx.new_page();pages.append(p);p.set_default_timeout(12000)
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    p.on('response',lambda r:errors.append('HTTP '+str(r.status)+' '+r.url) if r.status>=400 else None)
    p.goto(base+'#numbers/seeds',wait_until='networkidle')
    ready(p)
    return p


def ready(p):
    active=p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId')
    choice='[data-select-explorer="'+active+'"]'
    p.locator('[data-cl-entry],'+choice).first.wait_for()
    if p.locator(choice).count():
        p.locator(choice).click()
        p.evaluate('location.hash="#numbers/seeds"')
    p.locator('[data-cl-entry]').wait_for()


def snapshot(p):
    return p.evaluate('''()=>({memory:JSON.parse(JSON.stringify(window.__chanceObservedState())),storage:Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))})''')


def unchanged(p, before, why):
    after=snapshot(p)
    ok(after['memory']==before['memory'],why+' preserves actual in-memory notebook')
    ok(after['storage']==before['storage'],why+' preserves full storage values')


def selector(action, value=None):
    return '[data-cl-action="'+action+'"]'+('' if value is None else '[data-cl-value="'+str(value)+'"]')


def click(p, action, value=None, before=None):
    p.locator(selector(action,value)).first.click()
    if before is not None:unchanged(p,before,action)


def enter(p, before=None):
    p.locator('[data-cl-entry]').click();p.locator('[data-cl-root]').wait_for()
    ok(p.locator('#cl-title').evaluate('e=>e===document.activeElement'),'entry focuses child heading')
    ok(not p.locator('[data-seed-root],a[href="#numbers/seeds/pairs"]').count(),'child replaces parent and sibling entry')
    ok(not p.locator('main drawn-howto').count(),'child omits parent six-draw Show me how')
    if before is not None:unchanged(p,before,'entry')


def dispatch(handle, event='click'):
    handle.evaluate('(e,t)=>e.dispatchEvent(new Event(t,{bubbles:true,cancelable:true}))',event)


def frame(p):
    return p.locator('[data-seed-root]').evaluate('''e=>({html:e.innerHTML,folds:[...e.querySelectorAll('details')].map(d=>[d.dataset.seedFold,d.open])})''')


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    bad=p.locator('[data-cl-root] button,[data-cl-root] select,[data-cl-root] summary,[data-cl-root] a').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&!e.disabled&&!e.closest('.speech-controls')&&(e.getBoundingClientRect().width<43.9||e.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({label:e.textContent,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))''')
    ok(not bad,'44px targets and16px controls: '+str(bad))
    tiny=p.locator('.cl-anchors span,.cl-pin-label,.cl-bag-picture figcaption').evaluate_all('xs=>xs.filter(e=>e.checkVisibility()&&parseFloat(getComputedStyle(e).fontSize)<15.9).map(e=>e.textContent)')
    ok(not tiny,'effective diagram labels16px: '+str(tiny))


def hear(p, before=None, includes=(), excludes=()):
    p.locator('[data-cl-root] [data-speak]').click()
    actual=p.evaluate('__chanceSpoken.at(-1)||""')
    spoken=p.locator('[data-cl-root] [data-speak]').get_attribute('data-speak') or ''
    ok(bool(actual),'Hear reaches real speech binding with local text stub')
    ok(all(t in spoken for t in includes) and not any(t in spoken for t in excludes),'narration contains current visible content only: '+spoken)
    if before is not None:unchanged(p,before,'Hear')
    return spoken


def notes(p, label):
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
    with p.expect_download() as result:p.locator('#download').click()
    path=OUT/(label+'.json');result.value.save_as(str(path))
    return json.loads(path.read_text())


def choose(p, bag, before=None):
    p.locator('#cl-bag-select').select_option(str(bag))
    ok(p.locator('#cl-bag-select').evaluate('e=>e===document.activeElement'),'bag choice keeps focus')
    if before is not None:unchanged(p,before,'bag choice')


def pin(p, value, before=None):
    p.locator('#cl-point-select').select_option(str(value))
    ok(p.locator('#cl-point-select').evaluate('e=>e===document.activeElement'),'pin placement keeps focus')
    if before is not None:unchanged(p,before,'own pin')


def capture(p, name):
    target=p.locator('#cl-point-select')
    if target.count():target.focus()
    else:p.locator('#cl-page-title').focus()
    p.screenshot(path=str(OUT/name),full_page=True)


def separate_pins(p):
    rows=p.locator('[data-cl-pin-row]').evaluate_all('''xs=>xs.map(e=>({kind:e.dataset.clPinRow,y:e.querySelector('.cl-pin').getBoundingClientRect().y,label:e.querySelector('p').getBoundingClientRect().toJSON(),pin:e.querySelector('.cl-pin').getBoundingClientRect().toJSON()}))''')
    ok(len(rows)==2 and abs(rows[0]['y']-rows[1]['y'])>=10,'coincident references retain separate pin rows')
    ok(all(r['pin']['left']>=-1 and r['pin']['right']<=p.viewport_size['width']+1 for r in rows),'endpoint pins remain inside viewport')
    ok(rows[0]['label']['bottom']<=rows[1]['label']['top']+1,'separate pin text does not overlap')


def journey(browser, base):
    print('Chance Line: complete tablet journey, parent preservation and Notes',flush=True)
    p=setup(browser,base)
    p.locator('main drawn-howto').wait_for(state='attached')
    ok(p.locator('main drawn-howto').count()==1,'ordinary Seed Stall retains its own Show me how')
    for fold in ['history','talk']:
        p.locator('[data-seed-fold="'+fold+'"]').evaluate('e=>e.open=true')
    p.wait_for_timeout(30)
    parent,before=frame(p),snapshot(p)
    old_parent=p.locator('[data-seed-root]').element_handle()
    old_draw=p.locator('[data-seed-draw]').element_handle()
    enter(p,before);bounds(p)
    ok(p.locator('#cl-bag-select').input_value()=='1' and p.locator('#cl-point-select').input_value()=='','initial quarter bag has no default pin')
    ok(p.locator('#cl-point-select option').count()==14 and p.locator('#cl-point-select option').first.is_disabled(),'one disabled placeholder and13 real points')
    ok(not p.locator('[data-cl-pin-row="reference"]').count(),'initial reference absent')
    hear(p,before,includes=['1 Sun','3 Moon','not been placed'],excludes=['Reference:','1/4','unlikely'])
    old_parent.evaluate('e=>{e.hidden=true;document.querySelector("main").append(e)}')
    dispatch(old_draw);old_parent.evaluate('e=>e.remove()')
    unchanged(p,before,'hidden reattached parent draw')
    pin(p,11,before);click(p,'reference',before=before)
    ok('11/12' in p.locator('[data-cl-pin-row="own"]').inner_text(),'unexpected own pin retained literally')
    ok('1/4' in p.locator('[data-cl-pin-row="reference"]').inner_text(),'reference independently shows quarter')
    hear(p,before,includes=['11/12','1/4','unlikely'])
    p.locator('[data-stop-speech]').click();click(p,'reference');click(p,'reference')
    capture(p,'tablet-reference.png')
    choose(p,2,before);pin(p,6,before);click(p,'reference',before=before);separate_pins(p)
    choose(p,0,before);pin(p,0,before);click(p,'reference',before=before);separate_pins(p)
    ok('0/4 = 0' in p.locator('[data-cl-pin-row="reference"]').inner_text(),'zero fraction uses endpoint0')
    choose(p,4,before);pin(p,12,before);click(p,'reference',before=before);separate_pins(p)
    ok('4/4 = 1' in p.locator('[data-cl-pin-row="reference"]').inner_text(),'whole fraction uses endpoint1')
    choose(p,1,before)
    ok(p.locator('#cl-point-select').input_value()=='11' and p.locator('[data-cl-pin-row="reference"]').count()==1,'bag retains own pin and requested reference')
    click(p,'reference',before=before)
    hear(p,before,includes=['11/12'],excludes=['Reference:','1/4','unlikely'])
    click(p,'clear',before=before)
    ok(p.locator('#cl-point-select').input_value()=='' and p.locator('[data-cl-no-pin]').count()==1,'explicit Clear removes only current pin')
    choose(p,2,before);ok(p.locator('#cl-point-select').input_value()=='6','Clear retains other bag pin')
    capture(p,'tablet-build.png')
    click(p,'page','learn',before)
    ok(p.locator('#cl-page-title').evaluate('e=>e===document.activeElement'),'page change focuses current heading')
    titles=['Count the whole','Compare shares','Same chance, different bags','More likely is not promised']
    for i,title in enumerate(titles):
        if i:click(p,'lesson',i,before)
        ok(p.locator('#cl-lesson').inner_text()==title,'current teaching picture '+str(i+1))
        hear(p,before,includes=[title],excludes=[t for t in titles if t!=title])
        if i==0:ok(p.get_by_role('button',name='Previous picture',exact=True).is_disabled(),'first picture bounded')
        if i==1:
            text=p.locator('[data-cl-root]').inner_text()
            ok('3/4' in text and '6/12 = 1/2' in text,'unlike totals compare shares')
        if i==2:separate_pins(p)
    ok(p.get_by_role('button',name='Next picture',exact=True).is_disabled(),'last picture bounded')
    click(p,'lesson',2,before);click(p,'lesson',3,before)
    bounds(p);capture(p,'tablet-lesson.png')
    click(p,'page','questions',before)
    reasons=['One Sun is one of all four equal-chance positions.','Three of four is three quarters, greater than half.','All four positions are available again, including three Suns.','Both remain possible.']
    for i,key in enumerate([0,1,2,1]):
        if i:click(p,'question',i,before)
        stale=p.locator(selector('answer',0)).element_handle()
        labels=p.locator('[data-cl-action="answer"]').all_inner_texts()
        click(p,'answer',(key+1)%3,before)
        click(p,'explanation',before=before)
        click(p,'answer',key,before)
        ok(reasons[i] in p.locator('[data-cl-feedback]').inner_text(),'independent expected feedback '+str(i+1))
        ok(p.locator('[data-cl-explanation]').count()==1,'revision preserves open explanation')
        ok(labels==p.locator('[data-cl-action="answer"]').all_inner_texts(),'choice order remains fixed')
        hear(p,before,includes=[reasons[i]])
        dispatch(stale)
        ok(p.locator(selector('answer',key)).get_attribute('aria-pressed')=='true','stale reused answer cannot revise current answer')
        unchanged(p,before,'stale child answer')
    click(p,'back',before=before)
    ok(frame(p)==parent,'Back restores exact active run, notice and history/talk folds')
    ok(p.locator('[data-cl-entry]').evaluate('e=>e===document.activeElement'),'Back focuses entry')
    enter(p,before)
    ok(p.locator(selector('answer',1)).get_attribute('aria-pressed')=='true','same visit reentry retains question work')
    click(p,'back',before=before)
    p.locator('[data-seed-change]').click();p.locator('[data-seed-adjust="1"]').click()
    parent=frame(p);enter(p,before);click(p,'back',before=before)
    ok(frame(p)==parent,'Back restores chooser and chosen count')
    report=notes(p,'preserved-seed-notes')
    ok(report['seedStall']==before['memory']['seedStall'],'actual Notes download preserves frozen Seed Stall record')
    return report


def pending(browser,base):
    print('Chance Line: pending replacement survives Back without saving',flush=True)
    p=setup(browser,base,fixture(True))
    p.locator('[data-seed-change]').click();p.locator('[data-seed-adjust="-1"]').click();p.locator('[data-seed-start]').click()
    ok(p.locator('[data-seed-confirm]').count()==1,'eight experiments produce real replacement confirmation')
    p.locator('[data-seed-fold="history"]').evaluate('e=>e.open=true');p.wait_for_timeout(30)
    parent,before=frame(p),snapshot(p)
    enter(p,before);pin(p,9,before);hear(p,before);click(p,'back',before=before)
    ok(frame(p)==parent and p.locator('[data-seed-confirm]').count()==1,'Back restores pending confirmation and chooser exactly')


def lifecycle(browser,base):
    print('Chance Line: stale, hidden, detached, source, owner and route boundaries',flush=True)
    p=setup(browser,base)
    before=snapshot(p)
    entry=p.locator('[data-cl-entry]').element_handle()
    entry.evaluate('e=>{const parent=e.parentNode,next=e.nextSibling;e.remove();parent.insertBefore(e,next)}')
    p.wait_for_timeout(20);dispatch(entry)
    ok(not p.locator('[data-cl-root]').count(),'detached/reattached entry retires listener');unchanged(p,before,'retired entry')
    p.reload(wait_until='networkidle');ready(p);enter(p)
    before=snapshot(p)
    for mode in ['hidden','detached','ancestor']:
        root=p.locator('[data-cl-root]');control=p.locator(selector('reference')).element_handle();hear_control=p.locator('[data-cl-hear]').element_handle()
        if mode=='hidden':root.evaluate('e=>e.hidden=true')
        elif mode=='detached':root.evaluate('e=>{const parent=e.parentNode,next=e.nextSibling;e.remove();parent.insertBefore(e,next)}')
        else:root.evaluate('e=>{const d=document.createElement("div");e.parentNode.append(d);d.append(e)}')
        n=p.evaluate('__chanceSpoken.length');dispatch(control);dispatch(hear_control)
        ok(p.evaluate('__chanceSpoken.length')==n,'stale '+mode+' Hear does not speak')
        ok(not p.locator('[data-cl-pin-row="reference"]').count(),'stale '+mode+' reference cannot act')
        unchanged(p,before,mode+' child controls')
        if mode=='hidden':
            root.evaluate('e=>e.hidden=false');dispatch(control);dispatch(hear_control)
            ok(p.evaluate('__chanceSpoken.length')==n and not p.locator('[data-cl-pin-row="reference"]').count(),'unhiding cannot revive retired listeners')
        p.reload(wait_until='networkidle');ready(p);enter(p);before=snapshot(p)
    # Explicitly synthetic external source replacement exercises the real
    # captured-parent invalidation boundary; it is not an app learner action.
    pin(p,8);p.evaluate('window.__chanceObservedState().seedStall=structuredClone(window.__chanceObservedState().seedStall)')
    before=snapshot(p);click(p,'reference')
    p.locator('[data-cl-entry]').wait_for()
    ok(not p.locator('[data-cl-root]').count(),'external source replacement exits child without replay')
    unchanged(p,before,'synthetic raw source invalidation');enter(p,before)
    ok(p.locator('#cl-point-select').input_value()=='8' and not p.locator('[data-cl-pin-row="reference"]').count(),'same notebook keeps local pin after source replacement')
    p.evaluate("window.__chanceObservedState().seedStall.investigations[0].source.rule='Synthetic externally replaced rule.'")
    changed=snapshot(p);click(p,'back');p.locator('[data-cl-entry]').wait_for()
    unchanged(p,changed,'synthetic same-identity raw value invalidation')
    ok('Synthetic externally replaced rule.' in p.locator('[data-seed-root]').inner_text(),'current parent source renders instead of obsolete return frame')
    enter(p);ok(p.locator('#cl-point-select').input_value()=='8','value invalidation keeps same visit work')
    old=p.locator('[data-cl-hear]').element_handle();old_back=p.locator(selector('back')).element_handle()
    p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-2"]').click();p.evaluate('location.hash="#numbers/seeds"');p.locator('[data-cl-entry]').wait_for()
    after=snapshot(p);n=p.evaluate('__chanceSpoken.length');dispatch(old);dispatch(old_back)
    unchanged(p,after,'departed owner controls');ok(p.evaluate('__chanceSpoken.length')==n,'departed owner Hear inert')
    enter(p);ok(p.locator('#cl-point-select').input_value()=='','new explorer starts fresh child')
    click(p,'back');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-1"]').click();p.evaluate('location.hash="#numbers/seeds"');p.locator('[data-cl-entry]').wait_for();enter(p)
    ok(p.locator('#cl-point-select').input_value()=='','leaving explorer cleared its child visit')
    pin(p,7);click(p,'back');p.locator('a[href="#numbers/seeds/pairs"]').click();p.locator('[data-pairs-root]').wait_for()
    p.evaluate('location.hash="#numbers/seeds"');p.locator('[data-cl-entry]').wait_for();enter(p)
    ok(p.locator('#cl-point-select').input_value()=='','exact route leave through Seed Pairs clears child work')
    old=p.locator('[data-cl-hear]').element_handle();n=p.evaluate('__chanceSpoken.length')
    p.evaluate('history.replaceState(null,"","#numbers/seeds/pairs")');dispatch(old)
    ok(p.evaluate('__chanceSpoken.length')==n,'same-tick route mismatch cannot narrate')


def parent_states_and_import(browser,base,report):
    print('Chance Line: missing/recovery, legacy alias and actual notebook import',flush=True)
    for kind in ['missing','recovery']:
        seed=fixture()
        if kind=='missing':del seed['seedStall']
        else:seed['seedStall']={'version':99,'raw':'Invented opaque earlier record'}
        p=setup(browser,base,seed);before=snapshot(p);parent=frame(p)
        enter(p,before);pin(p,4,before);click(p,'page','questions',before);click(p,'explanation',before=before);hear(p,before);click(p,'back',before=before)
        ok(frame(p)==parent,kind+' parent returns exactly')
    p=setup(browser,base)
    p.evaluate('location.hash="#numbers/seeds/"');p.locator('[data-seed-root]').wait_for()
    ok(not p.locator('[data-cl-entry]').count(),'legacy alias omits Chance Line entry')
    p.locator('[data-seed-change]').click();p.locator('[data-seed-adjust="1"]').click()
    ok('4 sun, 2 moon' in p.locator('.seed-adjust').inner_text(),'legacy alias parent controls remain active')
    p.evaluate('location.hash="#numbers/seeds"');p.locator('[data-cl-entry]').wait_for();enter(p);pin(p,10)
    old=p.locator('[data-cl-hear]').element_handle()
    p.evaluate('location.hash="#notes"');p.locator('#progress-file').wait_for()
    p.locator('#progress-file').set_input_files({'name':'invented-chance-notebook.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
    p.locator('#progress-import-confirm').click()
    p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
    p.evaluate('location.hash="#numbers/seeds"');p.locator('[data-cl-entry]').wait_for()
    before=snapshot(p);n=p.evaluate('__chanceSpoken.length');dispatch(old)
    unchanged(p,before,'prior imported-notebook listener');ok(p.evaluate('__chanceSpoken.length')==n,'prior import Hear cannot speak')
    enter(p,before);ok(p.locator('#cl-point-select').input_value()=='','actual imported notebook starts fresh visit')
    ok(before['memory']['seedStall']==report['seedStall'],'import preserves actual saved seed record')


def keyboard_bags(browser,base):
    print('Chance Line: stable bag navigation and clear focus',flush=True)
    p=setup(browser,base);enter(p);before=snapshot(p)
    for start,direction,expected in [(1,'next',2),(2,'previous',1),(6,'next',7),(1,'previous',0)]:
        p.locator('#cl-bag-select').focus();choose(p,start,before)
        p.locator('[data-cl-action="bag"][data-cl-turn="'+direction+'"]').focus();p.keyboard.press('Enter')
        ok(p.locator('#cl-bag-select').input_value()==str(expected),'keyboard bag changes to expected index')
        target='#cl-bag-select' if expected in [0,7] else '[data-cl-action="bag"][data-cl-turn="'+direction+'"]'
        ok(p.locator(target).evaluate('e=>e===document.activeElement'),'bag navigation retains useful keyboard focus')
        unchanged(p,before,'keyboard bag turn')
    pin(p,3,before);click(p,'clear',before=before)
    ok(p.locator('#cl-point-select').evaluate('e=>e===document.activeElement'),'Clear returns focus to point selector')
    # Explicitly synthetic source mutation: the failed child action recovers
    # the current parent and moves focus to its entry without replaying.
    p.evaluate('window.__chanceObservedState().seedStall.current=null')
    before=snapshot(p);click(p,'reference');p.locator('[data-cl-entry]').wait_for();unchanged(p,before,'changed source recovery')
    ok(p.locator('[data-cl-entry]').evaluate('e=>e===document.activeElement'),'changed source recovery focuses entry')


def responsive(browser,base):
    print('Chance Line: focused320px layout and keyboard samples',flush=True)
    p=setup(browser,base,width=320);enter(p);bounds(p)
    choose(p,0);pin(p,0);click(p,'reference');separate_pins(p)
    bounds(p);capture(p,'phone-zero.png')
    choose(p,4);pin(p,12);click(p,'reference');separate_pins(p);bounds(p)
    capture(p,'phone-one.png')
    p.locator(selector('page','learn')).first.focus();p.keyboard.press('Enter')
    ok(p.locator('#cl-page-title').evaluate('e=>e===document.activeElement'),'keyboard page action focuses heading')
    click(p,'lesson',1);click(p,'lesson',2);separate_pins(p);bounds(p)
    capture(p,'phone-lesson.png')
    click(p,'page','questions');click(p,'question',1);click(p,'question',2);click(p,'question',3);click(p,'answer',1);click(p,'explanation');bounds(p)
    capture(p,'phone-question.png')


def main():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        protocol_version='HTTP/1.1'
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):
        request_queue_size=128
        daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start();base='http://127.0.0.1:'+str(server.server_port)+'/'
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
            try:
                report=journey(browser,base);pending(browser,base);lifecycle(browser,base);parent_states_and_import(browser,base,report);responsive(browser,base);keyboard_bags(browser,base)
                ok(not errors,'no page, console or HTTP errors: '+str(errors))
                print(json.dumps({'status':'passed','checks':checks,'artifacts':str(OUT)}),flush=True)
            except Exception:
                (OUT/'failure.txt').write_text(traceback.format_exc())
                for i,p in enumerate(pages):
                    if not p.is_closed():p.screenshot(path=str(OUT/('failure-'+str(i)+'.png')),full_page=True)
                raise
            finally:browser.close()
    finally:server.shutdown();server.server_close()


if __name__=='__main__':main()
