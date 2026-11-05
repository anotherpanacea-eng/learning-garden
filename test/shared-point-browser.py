"""One Shared Point383: actual-app point exploration and Notes recovery.

One complete tablet journey and a phone sample, with invented notebooks only.
Ordinary journeys do not intercept application modules. A separately labelled
actual-UI harness checks external context changes and explicit preflight refusal.
Chromium evidence does not qualify physical iPad/Safari, VoiceOver or learning.
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
OUT = Path(os.environ.get('SHARED_POINT_ARTIFACTS', tempfile.mkdtemp(prefix='shared-point-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
_spec = importlib.util.spec_from_file_location('shared_point_notebook_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(native)
h = native.h
ROUTE = '#learn/math/equality'


def sel(name, value=None):
    return '[data-sp-' + name + ('="' + str(value) + '"' if value is not None else '') + ']'


def click(p, name, value=None):
    h.click(p, sel(name, value))


def enter(p, base=None):
    if base:
        h.go(p, base, ROUTE, '[data-equality-shared-point]')
    h.click(p, '[data-equality-shared-point]')
    p.locator(sel('root')).wait_for()


def records(p):
    return h.book(p).get('sharedPointSheets', [])


def point(p, x, y):
    p.locator(sel('x')).select_option(str(x))
    p.locator(sel('y')).select_option(str(y))


def fit(p, expected):
    h.ok(p.locator(sel('fit')).get_attribute('data-sp-fit') == expected,
         'the rendered substitution verdict is '+expected)


def near(actual, expected, label):
    h.ok(len(actual) == len(expected) and all(abs(a-b) < .03 for a, b in zip(actual, expected)), label+': '+str(actual))


def marker(p, kind, x, y):
    node = p.locator(sel('point', kind))
    h.ok(node.count() == 1, 'exactly one distinct '+kind+' marker')
    near(node.evaluate('e=>[+e.getAttribute("cx"),+e.getAttribute("cy")]'),
         [62+(x+4)*508/8, 600-(y+6)*568/12], kind+' marker uses both ordered coordinates')


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal page overflow')
    bad = p.locator('[data-sp-root] button,[data-sp-root] a,[data-sp-root] summary,[data-sp-root] select').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().width<44||e.getBoundingClientRect().height<44||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))''')
    h.ok(not bad, '44px visible controls with16px text: '+str(bad))
    small = p.locator('[data-sp-root] p,[data-sp-root] li,[data-sp-root] th,[data-sp-root] td,[data-sp-root] label,[data-sp-root] caption').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&parseFloat(getComputedStyle(e).fontSize)<16).map(e=>({text:e.textContent,size:getComputedStyle(e).fontSize}))''')
    h.ok(not small, 'body, table and labels remain readable: '+str(small))


def fixture():
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', '''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startEquality,pageEquality,editEquality} from './dist/equality-desk-core.mjs';
const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;
s.syntheticOther={payload:'z'.repeat(512000)};
const o={canExport:()=>true};startEquality(s,'twins',o);pageEquality(s,3,o);
editEquality(s,'note','A synthetic explanation waiting at the Equality Desk.',o);
console.log(JSON.stringify(s));
'''], cwd=ROOT, text=True))


def stop_voice(p):
    if p.locator('[data-stop-speech]').count():
        h.click(p, '[data-stop-speech]')


def journey(browser, base, seed):
    print('Shared Point: actual tablet point/copy/return journey', flush=True)
    _, p = native.setup(browser, seed, 'tablet')
    h.go(p, base, ROUTE, '[data-equality-shared-point]')
    p.locator('[data-equality-field="note"]').fill('A waiting synthetic note survives the graph tool.')
    before = h.book(p)
    enter(p)
    h.ok('sharedPointSheets' not in h.book(p), 'entry and initial graph render leave the optional root absent')
    bounds(p)
    h.ok(p.locator(sel('x')).input_value() == '2' and p.locator(sel('y')).input_value() == '-5', 'fixed starting point does not snap to a solved crossing')
    fit(p, 'neither'); marker(p, 'learner', 2, -5)
    h.click(p, '[data-sp-chooser] summary')
    p.locator(sel('case')).select_option('up-down')
    p.locator(sel('shift')).select_option('0')
    for x, y, expected in [(0, 1, 'first'), (0, 3, 'second'), (0, 0, 'neither'), (1, 2, 'both')]:
        point(p, x, y); fit(p, expected); marker(p, 'learner', x, y)
    point(p, 0, 1)
    h.ok(p.locator('[data-sp-root] tbody tr td:first-of-type').all_text_contents()==['1','3'], 'the two rule outputs at x zero are independently one and three, not the chosen y copied into both rows')
    click(p, 'turn', 'explain')
    p.locator(sel('claim')).select_option('none')
    click(p, 'reference')
    marker(p, 'learner', 0, 1); marker(p, 'reference', 1, 2)
    text = p.locator(sel('root')).inner_text()
    h.ok('1' in text and '2' in text and 'substitut' in text.lower(), 'opened reasoning includes the source crossing and substitution explanation')
    click(p, 'hear')
    speech = p.locator(sel('hear')).get_attribute('data-speak') or ''
    h.ok('minus' in speech.lower() or 'negative' in speech.lower(), 'narration speaks negative signs in words')
    h.ok('x' in speech.lower() and 'y' in speech.lower() and 'equals' in speech.lower(), 'narration includes both coordinates and number rules')
    stop_voice(p)
    click(p, 'keep')
    first = copy.deepcopy(records(p)[0])
    h.ok(first['work'] == {'v':1,'x':0,'y':1,'claim':'none','referenceShown':True}, 'Keep preserves the unexpected point and claim with elected reference support')
    rest = copy.deepcopy(h.book(p)); rest.pop('sharedPointSheets')
    h.ok(rest == before, 'child exploration and Keep leave parent writing, facts and all unrelated roots exact')
    click(p, 'shelf'); click(p, 'card', first['id'])
    click(p, 'turn', 'try')
    h.ok(p.locator(sel('x')).is_disabled() and p.locator(sel('y')).is_disabled(), 'kept point coordinates are read-only')
    click(p, 'turn', 'explain')
    h.ok(p.locator(sel('claim')).is_disabled(), 'kept unexpected claim remains read-only')
    h.click(p, '[data-sp-fold="teaching"] summary')
    h.ok(records(p) == [first], 'read-only turn navigation cannot rewrite a retained record')
    click(p, 'copy')
    click(p, 'turn', 'try'); point(p, 1, 2); fit(p, 'both')
    click(p, 'turn', 'explain'); p.locator(sel('claim')).select_option('one')
    click(p, 'keep')
    h.ok(len(records(p)) == 2 and records(p)[0] == first, 'changing and keeping a copy appends without revising the earlier original')
    click(p, 'shelf'); click(p, 'card', first['id'])
    h.ok(p.locator(sel('claim')).count()==1 and p.locator(sel('claim')).input_value()=='none', 'reopening an unchanged old sheet after another Keep retains its deliberately chosen Explain screen')
    h.ok(p.locator('[data-sp-fold="teaching"]').get_attribute('open') is not None and records(p)[0]==first, 'byte-identical root cloning retains the old sheet teaching disclosure without altering its saved work')
    click(p, 'working'); click(p, 'turn', 'try')
    waiting = p.locator(sel('draft')).input_value()
    point(p, -1, -1)
    click(p, 'new')
    fresh = p.locator(sel('draft')).input_value()
    h.ok(fresh != waiting, 'New visit creates a distinct session draft')
    p.locator(sel('draft')).select_option(waiting)
    h.ok(p.locator(sel('x')).input_value() == '-1' and p.locator(sel('y')).input_value() == '-1', 'Working drafts can return to the exact older unfinished point')
    p.locator(sel('draft')).select_option(fresh)
    h.ok(p.locator(sel('x')).input_value() == '2' and p.locator(sel('y')).input_value() == '-5', 'returning to a fresh draft retains its independent default')
    p.locator(sel('case')).select_option('together')
    click(p, 'hear')
    speech=p.locator(sel('hear')).get_attribute('data-speak') or ''
    h.ok('Both rules draw the same line.' in speech and 'Reference opened' not in speech, 'Hear includes the visible coincident-line explanation without inventing opened reference support')
    stop_voice(p)
    continued=p.locator(sel('draft')).input_value()
    click(p, 'back')
    p.locator('[data-equality-field="note"]').wait_for()
    h.ok(p.locator('[data-equality-field="note"]').input_value() == 'A waiting synthetic note survives the graph tool.', 'Back restores the committed parent note')
    h.ok(h.book(p)['equalityDesk'] == before['equalityDesk'], 'parent Equality visit remains exact after child return')
    enter(p)
    h.ok(p.locator(sel('draft')).input_value() == continued, 'same-session child reopening resumes its working draft')
    p.screenshot(path=str(OUT/'tablet.png'), full_page=True)
    exported = native.download(p, base, 'shared-point-kept-sheets')
    h.ok(exported['sharedPointSheets'] == records(p), 'actual Notes download includes exact retained graph sheets')
    return first, exported


def transfer(browser, base, seed, first, exported):
    print('Shared Point: actual historical Notes import and second explorer', flush=True)
    old = copy.deepcopy(first)
    old.update(id='shared-point-80', futureOuter={'raw':'retain me'})
    old['source'].update(id='old"source', title='Earlier <rule> & "marks"', futureSource={'raw':True},
                         teaching=['A synthetic scale can read 0.3 or 0.125. Other marks are .5 and -.25. These values are not half-step coordinate choices. An undefined ratio 0/0 is not a number.'],
                         lines=[{'id':'old-second','label':'Earlier <B>','m':0,'b':1},
                                {'id':'old-first','label':'Earlier "A"','m':3,'b':0}])
    old['work'].update(x=2,y=-5,claim='none',referenceShown=False,futureWork={'raw':True})
    off = copy.deepcopy(old); off['id']='shared-point-81'; off['source']['title']='A distant crossing'
    off['source']['lines']=[{'id':'a','label':'A','m':4,'b':12},{'id':'b','label':'B','m':3,'b':-12}]
    off['work']['referenceShown']=True
    corner=copy.deepcopy(old); corner['id']='shared-point-82'; corner['source']['title']='A corner-only touch'
    corner['source']['lines']=[{'id':'a','label':'A','m':1,'b':10},{'id':'b','label':'B','m':0,'b':2}]
    corner['work']['referenceShown']=False
    mixed=copy.deepcopy(exported)
    mixed['sharedPointSheets']=[{'id':'shared-point-900','v':99,'raw':'Unavailable synthetic row'},old,off,corner,first]
    _,p=native.setup(browser,seed,'transfer')
    h.go(p,base,'#notes','#progress-file')
    identity=h.active(p); original=h.book(p)
    p.locator('#progress-file').set_input_files({'name':'synthetic-shared-point.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
    p.locator('#progress-import-confirm').wait_for()
    h.ok('Shared Point' in p.locator('.import-preview').inner_text(), 'import preview names the retained graph tool')
    h.click(p,'#progress-import-confirm')
    enter(p,base)
    h.ok(h.active(p)!=identity,'actual Notes import makes a separate explorer')
    click(p,'shelf'); click(p,'card',old['id'])
    text=p.locator(sel('root')).inner_text()
    h.ok(old['source']['title'] in text and 'Earlier <B>' in text, 'historical own labels and reordered rules render literally as escaped text')
    h.ok(not p.locator('[data-sp-root] rule,[data-sp-root] B').count(), 'historical angle-bracket text creates no injected element')
    h.ok(not p.locator(sel('point','reference')).count(),'frozen history does not invent unopened reasoning')
    h.click(p, '[data-sp-fold="teaching"] summary'); click(p,'hear')
    speech=p.locator(sel('hear')).get_attribute('data-speak') or ''
    h.ok('0 point 3' in speech and '0 point 1 2 5' in speech, 'historical prose decimals are narrated with their actual digits rather than rounded to coordinate half steps')
    h.ok('0 point 5' in speech and 'negative 0 point 2 5' in speech, 'historical decimal text can omit its leading zero without losing its point or sign')
    h.ok('0 over 0' in speech and 'Reference opened' not in speech, 'historical prose fractions are spoken lexically without evaluating undefined zero-over-zero or revealing unopened reference')
    stop_voice(p)
    click(p,'copy'); click(p,'turn','explain'); click(p,'reference')
    text=p.locator(sel('root')).inner_text()
    h.ok('1/3' in text, 'historical crossing is computed exactly as one third from its own rules')
    marker(p,'reference',1/3,1)
    click(p,'keep')
    last=records(p)[-1]
    h.ok(last['id']=='shared-point-901','unreadable recognized ids reserve later append allocation')
    h.ok(last['source']==old['source'] and last['work']['futureWork']==old['work']['futureWork'], 'copy and Keep retain imported source/work extras')
    h.ok('futureOuter' not in last,'a new copy does not pretend to be the old outer record')
    click(p,'shelf'); click(p,'card',off['id']); click(p,'turn','explain')
    text=p.locator(sel('root')).inner_text().lower()
    h.ok('outside' in text and '-24' in text and '-84' in text,'off-window source retains its real crossing in text')
    h.ok(not p.locator(sel('point','reference')).count(),'off-window crossing is not clamped to a false visible marker')
    click(p,'hear'); speech=p.locator(sel('hear')).get_attribute('data-speak') or ''
    h.ok('outside this viewing window' in speech and 'negative 24' in speech and 'negative 84' in speech, 'Hear includes the visible off-window explanation and its exact reference coordinates')
    stop_voice(p)
    click(p,'shelf'); click(p,'card',corner['id']); click(p,'turn','try')
    h.ok(p.locator(sel('line','0')).count()==0,'corner-only touch does not invent a positive-length line path')
    h.ok('no visible line segment' in p.locator(sel('root')).inner_text().lower(),'corner-only absence has an honest textual explanation')
    click(p,'hear'); speech=p.locator(sel('hear')).get_attribute('data-speak') or ''
    h.ok('no visible line segment in this window' in speech and 'Reference opened' not in speech and 'outside this viewing window' not in speech, 'Hear explains the visible missing segment while leaving the unopened crossing reference unrevealed')
    stop_voice(p)
    redownload=native.download(p,base,'shared-point-historical-roundtrip')
    h.ok(redownload['sharedPointSheets'][:-1]==mixed['sharedPointSheets'],'actual Notes roundtrip preserves every unavailable/historical/original sibling exactly')
    h.click(p,'#explorer-switch'); h.click(p,'[data-select-explorer="'+identity+'"]')
    h.ok(h.book(p)==original,'import and historical copying leave the original explorer untouched')


def phone(browser,base,seed):
    print('Shared Point: phone tap, keyboard and layout sample',flush=True)
    _,p=native.setup(browser,seed,'phone',width=320)
    enter(p,base); bounds(p)
    h.ok(p.locator('[data-sp-root] footer p').evaluate('e=>e.getBoundingClientRect().width>=e.parentElement.getBoundingClientRect().width*.9'), 'phone footer prose uses the available footer width rather than narrow word-broken global footer cells')
    plot=p.locator(sel('plot'))
    h.ok(plot.bounding_box()['y']<p.locator(sel('x')).bounding_box()['y'],'phone graph precedes the coordinate controls visually')
    p.locator(sel('x')).select_option('3.5')
    p.locator(sel('step','x:1')).focus(); p.keyboard.press('Enter')
    h.ok(p.locator(sel('x')).input_value()=='4' and p.locator(sel('step','x:1')).evaluate('e=>e===document.activeElement&&e.getAttribute("aria-disabled")==="true"&&!e.disabled'),'reaching the x bound retains the actual initiating button with an accessible no-op state')
    unchanged=p.locator(sel('root')).inner_html(); notebook=h.book(p)
    p.keyboard.press('Enter')
    h.ok(p.locator(sel('root')).inner_html()==unchanged and h.book(p)==notebook and p.locator(sel('step','x:1')).evaluate('e=>e===document.activeElement'),'extra Enter at the bound changes neither draft, rendered status nor notebook and retains initiating focus')
    p.locator(sel('step','x:-1')).tap()
    h.ok(p.locator(sel('x')).input_value()=='3.5' and p.locator(sel('step','x:-1')).evaluate('e=>e===document.activeElement'),'a native phone tap moves half a unit and retains usable focus')
    plot.scroll_into_view_if_needed()
    position=plot.evaluate('e=>{const p=new DOMPoint(62+4.5*508/8,600-7.5*568/12).matrixTransform(e.getScreenCTM());return {x:p.x,y:p.y}}')
    p.touchscreen.tap(position['x'],position['y'])
    h.ok(p.locator(sel('x')).input_value()=='0.5' and p.locator(sel('y')).input_value()=='1.5','tapping the plot chooses both coordinates without snapping to a reference')
    fit(p,'first'); marker(p,'learner',.5,1.5)
    p.screenshot(path=str(OUT/'phone.png'),full_page=True)


def saving_off(browser,base,seed):
    print('Shared Point: actual saving-off download recovery',flush=True)
    _,p=native.setup(browser,seed,'saving-off')
    h.go(p,base,'#notes','#remember'); p.locator('#remember').click();p.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click()
    p.evaluate('location.hash="#learn/math/equality"'); p.locator('[data-equality-shared-point]').wait_for(); enter(p)
    old=p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')
    click(p,'keep')
    text=p.locator('#sp-status').inner_text().lower()
    h.ok('saving is off' in text and 'download' in text,'Keep truthfully reports session-only storage when saving is off')
    h.ok(p.evaluate('JSON.stringify(Object.entries(localStorage).sort())')==old,'saving-off Keep does not write device storage')
    recovered=native.download(p,base,'shared-point-saving-off')
    h.ok(len(recovered['sharedPointSheets'])==1,'actual Notes download recovers the in-memory sheet')


def lifecycle(browser,base,seed):
    print('Shared Point: isolated actual-UI external-context/refusal harness',flush=True)
    _,p=native.setup(browser,seed,'external-context-harness'); enter(p,base)
    setup='''async seed=>{
      const parent=await import('./equality-desk-ui.mjs'),ui=await import('./shared-point-ui.mjs');
      const media=await import('./play-media.mjs'),transfer=await import('./progress-transfer.mjs'),core=await import('./core.mjs');
      const mount=document.querySelector('main');mount.replaceChildren();
      const h={book:structuredClone(seed),owner:'synthetic-owner',active:true,allow:true,saves:0};
      h.book.sharedPointSheets=[];h.original=h.book;
      const report=c=>({title:'After the Storm: observations',exportedAt:'2026-11-05T12:00:00.000Z',
        note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:core.recommendations(c),...c});
      h.render=()=>{mount.innerHTML=parent.equalityPage(h.book,h.owner);parent.bindEquality(h.book,{
        notebook:()=>h.book,explorerId:()=>h.owner,isActive:()=>h.active,
        save:()=>{h.saves++;return {enabled:true,ok:true}},render:h.render,
        canExport:c=>h.allow&&transfer.prepareProgressImport(JSON.stringify(report(c),null,2)).ok,
        focus:s=>document.querySelector(s)?.focus()
      });media.bindSpeech()};
      ui.openSharedPoint(h.book,h.owner);window.spHarness=h;h.render();
    }'''
    def install():
        p.evaluate(setup,seed); p.locator(sel('root')).wait_for()
    def dispatch(handle):
        handle.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')
    install(); point(p,0,1); p.evaluate('spHarness.allow=false')
    before=p.evaluate('JSON.stringify(spHarness.book)'); click(p,'keep')
    h.ok(p.evaluate('JSON.stringify(spHarness.book)')==before and p.evaluate('spHarness.saves')==0,'real Notes preflight rejection leaves notebook unchanged')
    h.ok(p.locator(sel('x')).input_value()=='0' and p.locator(sel('y')).input_value()=='1','rejected Keep retains the actual waiting point')
    for fault in ['owner','book','inactive','root-content','control-parent','route']:
        install(); button=p.locator(sel('keep')).element_handle()
        if fault=='owner':p.evaluate('spHarness.owner="other-synthetic-owner"')
        elif fault=='book':p.evaluate('spHarness.book=structuredClone(spHarness.book)')
        elif fault=='inactive':p.evaluate('spHarness.active=false')
        elif fault=='root-content':p.evaluate('spHarness.book.sharedPointSheets.push({raw:"external"})')
        elif fault=='control-parent':button.evaluate('e=>{const box=document.createElement("section");e.closest("[data-sp-root]").append(box);box.append(e)}')
        elif fault=='route':p.evaluate('history.replaceState(null,"","#learn/math/equality/foreign")')
        before=p.evaluate('JSON.stringify([spHarness.original,spHarness.book])'); dispatch(button)
        h.ok(p.evaluate('JSON.stringify([spHarness.original,spHarness.book])')==before and p.evaluate('spHarness.saves')==0,'stale '+fault+' Keep cannot write original or current notebook')
        if fault=='route':p.evaluate('history.replaceState(null,"","#learn/math/equality")')
    install(); oldroot=p.locator(sel('root')).element_handle(); oldkeep=p.locator(sel('keep')).element_handle()
    click(p,'back'); oldroot.evaluate('e=>document.querySelector("main").append(e)')
    before=p.evaluate('JSON.stringify(spHarness.book)'); dispatch(oldkeep)
    h.ok(p.evaluate('JSON.stringify(spHarness.book)')==before and p.evaluate('spHarness.saves')==0,'reattached child controls remain inert after returning to parent mode')
    install(); click(p,'back'); p.evaluate('spHarness.allow=false')
    before=p.evaluate('JSON.stringify(spHarness.book)')
    p.locator('[data-equality-field="note"]').fill('Synthetic words that the refused preflight cannot commit.')
    h.click(p,'[data-equality-shared-point]')
    h.ok(not p.locator(sel('root')).count(), 'new child entry respects the real parent failed-input guard')
    h.ok(p.locator('[data-equality-field="note"]').input_value()=='Synthetic words that the refused preflight cannot commit.' and p.evaluate('JSON.stringify(spHarness.book)')==before, 'refused parent words remain visible without replacing the earlier notebook')


def main():
    seed=fixture(); server=None; base=os.environ.get('SHARED_POINT_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            protocol_version='HTTP/1.1'
            def log_message(self,*args):pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base='http://127.0.0.1:'+str(server.server_port)+'/'
    base=base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            first,exported=journey(browser,base,seed)
            transfer(browser,base,seed,first,exported)
            phone(browser,base,seed)
            saving_off(browser,base,seed)
            lifecycle(browser,base,seed)
            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'scope':__doc__},indent=2))
            print('Shared Point browser: '+str(h.checks)+' assertions passed; artifacts '+str(OUT))
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for p,label in h.pages:
                if not p.is_closed():
                    try:
                        p.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True)
                        (OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception:pass
            raise
        finally:
            for c in h.contexts:
                try:c.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()


if __name__=='__main__':
    main()
