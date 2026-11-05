"""Native372: one touch/keyboard journey, real Notes transfer, responsive samples.

Invented generic fixtures only. Ordinary flow uses native app and speech code;
quota, stale-control and capacity probes are separately labelled below.
"""
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('WATTS_ARTIFACTS', tempfile.mkdtemp(prefix='watts-desk-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
os.environ['RHYTHM_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('watts_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h


def setup(browser, seed, label, width=820):
    context, page = native.setup(browser, seed, label, width)
    # The second synthetic notebook is an ordinary selectable explorer.
    context.add_init_script('''(()=>{const k='learning-garden-explorers',r=JSON.parse(localStorage.getItem(k));if(r&&!r.explorers.some(x=>x.id==='explorer-2')){r.explorers.push({id:'explorer-2',avatar:'fern',color:'blue',symbol:'acorn',createdAt:'2026-11-03T12:00:00.000Z'});localStorage.setItem(k,JSON.stringify(r));localStorage.setItem('number-garden-v1:explorer-2',localStorage.getItem('number-garden-v1:explorer-1'));}})()''')
    return context, page


def act(p, action):
    h.click(p, f'[data-watts-action="{action}"]')


def open_desk(p, base):
    h.go(p, base, '#mill/energy', '[data-energy-root]')
    p.get_by_role('button', name='Watts Desk', exact=True).tap()
    p.locator('[data-watts-root]').wait_for()


def text(p):
    return p.locator('[data-watts-root]').inner_text()


def seconds(p):
    return [int(x) for x in p.locator('[data-watts-seconds]').all_text_contents()]


def add(p, machine, times=1, keyboard=False):
    for _ in range(times):
        target=p.locator(f'[data-watts-machine="{machine}"][data-watts-delta="5"]')
        if keyboard:
            target.focus()
            p.keyboard.press('Enter')
        else:
            target.tap()


def sheet(p, identity='power-sheet-1'):
    return next(x for x in h.book(p)['powerNotes'] if isinstance(x,dict) and x.get('id')==identity)


def bounds(p):
    p.evaluate('async()=>{await document.fonts.ready}')
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    bad=p.locator('[data-watts-root] button,[data-watts-root] a,[data-watts-root] summary,[data-watts-root] select').evaluate_all('''xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<43.9||x.getBoundingClientRect().width<43.9||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight,font:getComputedStyle(x).fontSize}))''')
    h.ok(not bad,'44px controls and16px text: '+str(bad))


def open_saved(p, identity):
    act(p,'shelf')
    h.click(p,f'[data-watts-action="open"][data-watts-id="{identity}"]')


def main():
    seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {waitingNotebook} from './test/story-arrivals-checks.mjs';const s=waitingNotebook();s.garden.welcomeFilmSeen=true;s.syntheticOther={raw:'Synthetic retained sibling',payload:'x'.repeat(550000)};console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
    class Quiet(http.server.SimpleHTTPRequestHandler):
        protocol_version='HTTP/1.1'
        def log_message(self,*args): pass
    class Server(http.server.ThreadingHTTPServer):
        request_queue_size=128
        daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=os.environ.get('WATTS_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            _,p=setup(browser,seed,'tablet')
            h.go(p,base,'#mill/energy','[data-energy-root]')
            before=copy.deepcopy(h.book(p))
            h.ok('powerNotes' not in before,'Mill entry does not eagerly initialize saved sheets')
            p.locator('[data-energy-action="pour"]').tap()
            old_counts=p.locator('[data-energy-count]').all_text_contents()
            p.get_by_role('button',name='Watts Desk',exact=True).tap()
            p.locator('[data-watts-root]').wait_for()
            h.ok(seconds(p)==[0,0,0],'fresh desk starts at zero model seconds')
            h.ok(p.evaluate('!window.speechSynthesis?.speaking && [...document.querySelectorAll("audio,video")].every(x=>x.paused)'), 'cold desk has no audible playback request')
            h.ok(not p.locator('video,dialog.welcome-film[open]').count() and not p.locator('[data-film-root]').count(),'no automatic movie on desk')
            h.ok(not p.locator('[data-howto-open]').count(),'old drawn help is absent from Watts surface')
            bounds(p)
            p.evaluate('scrollTo(0,0)')
            controls=p.locator('[data-watts-machine][data-watts-delta]').evaluate_all('xs=>xs.map(x=>({machine:x.dataset.wattsMachine,delta:x.dataset.wattsDelta,bottom:x.getBoundingClientRect().bottom}))')
            h.ok(len(controls)==6 and all(x['bottom']<=1000 for x in controls), 'all three machine time controls fit initial820px tablet viewport: '+str(controls))
            act(p,'worked')
            h.ok(p.evaluate('document.activeElement.dataset.wattsAction')=='worked','Show how keeps keyboard focus on its live control')
            h.ok('zero' in text(p).lower(),'zero duration explains unavailable division')
            act(p,'example')
            h.ok(p.evaluate('document.activeElement.dataset.wattsAction')=='example','example step keeps keyboard focus on its live control')
            h.ok('100' in text(p),'manual example opens its first supplied step')
            # The example advances only when explicitly requested.
            for _ in range(2):
                act(p,'example')
            h.ok('200' in text(p),'manual example reaches equal-energy comparison')
            h.ok(p.evaluate('document.activeElement.dataset.wattsAction')=='worked','completed disabled example falls back to an enabled control in the same row')
            p.locator('[data-watts-fold=words] summary').tap()
            h.ok(p.locator('[data-watts-fold=words]').evaluate('x=>x.open'),'word help is manually open')
            add(p,'reed',12)
            add(p,'oak',2,keyboard=True)
            h.ok(seconds(p)==[60,0,10],'touch and keyboard set differing model durations')
            h.ok(p.locator('[data-watts-fold=words]').evaluate('x=>x.open'),'word help remains open across model taps')
            h.ok(p.locator('[data-watts-card="reed"]').inner_text().find('1200')>=0 and '600' in p.locator('[data-watts-card="oak"]').inner_text(),'larger rate can transfer less total energy')
            h.ok(p.locator('[data-watts-machine="reed"][data-watts-delta="5"]').is_disabled(),'sixty-second boundary is disabled')
            strips=p.locator('.watts-strip').evaluate_all('xs=>xs.map(x=>({j:+x.dataset.joules,max:+x.dataset.axisMax}))')
            geometry=p.locator('.watts-strip').evaluate_all('xs=>xs.map(x=>{const f=x.querySelector(".watts-fill");return f.getBoundingClientRect().width/x.clientWidth})')
            h.ok(all(abs(a-b)<.005 for a,b in zip(geometry,[1/3,0,1/6])), 'actual bar widths express shared joule scale')
            h.click(p,'[data-watts-hear]')
            spoken=p.locator('[data-watts-hear]').get_attribute('data-speak')
            h.ok('watts' in spoken and 'joules' in spoken and 'seconds' in spoken and 'ignore losses' in spoken, 'native Hear requests current units and frozen model boundary')
            h.ok(spoken.count('These are invented constant-power winches')==1 and 'Remove 5 seconds' not in spoken and 'Add 5 seconds' not in spoken and '◖))' not in spoken,'Hear excludes controls and duplicates without changing visible help')
            h.ok(len(strips)==3 and [x['j'] for x in strips]==[1200,0,600] and all(x['max']==3600 for x in strips),'all energy bars share the fixed3600J scale')
            h.click(p,'[data-watts-mode="job"]')
            h.ok(p.evaluate('document.activeElement.id')=='watts-question', 'mode change focuses current question')
            h.ok(seconds(p)==[0,0,0] and '1200' in text(p),'independent same-job draft starts at1200J')
            add(p,'oak')
            act(p,'finished')
            h.ok(p.evaluate('document.activeElement.dataset.wattsAction')=='worked','finished supplied panel falls back within its control row')
            h.ok(seconds(p)==[0,0,5] and all(str(x) in text(p) for x in [60,30,20]),'finished supplied comparison preserves the partial draft')
            h.click(p,'[data-watts-target="600"]')
            h.ok(seconds(p)==[0,0,0],'target change zeros only the same-job draft')
            for machine,n in [('reed',6),('willow',3),('oak',2)]:add(p,machine,n)
            h.ok(seconds(p)==[30,15,10] and all(p.locator(f'[data-watts-machine="{m}"][data-watts-delta="5"]').is_disabled() for m in ['reed','willow','oak']),'600J target stops at each machine’s finishing time')
            h.click(p,'[data-watts-mode="durations"]')
            h.ok(seconds(p)==[60,0,10],'mode roundtrip preserves independent duration draft')
            p.keyboard.press('Escape')
            h.ok(seconds(p)==[60,0,10],'Escape preserves the draft')
            act(p,'back')
            h.ok(p.locator('[data-energy-count]').all_text_contents()==old_counts,'Back retains original Energy Book batch')
            p.get_by_role('button',name='Watts Desk',exact=True).tap()
            h.ok(seconds(p)==[60,0,10],'Mill roundtrip retains visit-local Watts draft')
            p.screenshot(path=str(OUT/'tablet-desk.png'),full_page=True)
            stale=p.locator('[data-watts-action="keep"]').element_handle()
            act(p,'keep')
            stale.evaluate('e=>e.click()')
            first=copy.deepcopy(sheet(p))
            h.ok(len(h.book(p)['powerNotes'])==1,'detached duplicate Keep appends exactly once')
            h.ok(first['work']['workedShown'] and first['work']['exampleSeen']==3,'saved flags retain actual disclosures')
            after=copy.deepcopy(h.book(p));after.pop('powerNotes')
            h.ok(after==before,'Keep writes no attempts, familiarity, support or unrelated roots')
            h.ok(not p.locator('[data-watts-delta],[data-watts-action="keep"]').count(),'kept sheet is read only')
            open_saved(p,'power-sheet-1')
            h.click(p,'[data-watts-action="again"][data-watts-id="power-sheet-1"]')
            add(p,'oak')
            h.ok(sheet(p)==first,'Try again leaves original source and work immutable')
            exported=native.download(p,base,'tablet-notes')
            h.ok(exported['powerNotes']==[first] and exported['syntheticOther']==seed['syntheticOther'],'actual Notes download preserves frozen sheet and large unrelated root')

            # Actual import, historical source and unreadable siblings.
            historical=copy.deepcopy(first)
            historical['id']='power-sheet-70'
            historical['source'].update({'title':'Earlier <model> & notes','origin':'Synthetic earlier model.','machines':[{'id':'plain-a','label':'Earlier A','watts':30},{'id':'plain-b','label':'Earlier B','watts':30}],'targets':[600,1200],'opaque':{'raw':'Synthetic source extension'}})
            historical['work'].update({'mode':'durations','durations':[{'machineId':'plain-a','seconds':10},{'machineId':'plain-b','seconds':20}],'jobDurations':[{'machineId':'plain-a','seconds':0},{'machineId':'plain-b','seconds':0}],'workedShown':False,'exampleSeen':0,'finishedShown':False})
            future={'id':'power-sheet-90','source':{'v':99},'raw':'Synthetic unavailable sibling'}
            mixed=copy.deepcopy(exported);mixed['powerNotes']=[first,future,historical]
            _,q=setup(browser,seed,'transfer')
            open_desk(q,base)
            old_owner=h.active(q)
            old_control=q.locator('[data-watts-action="keep"]').element_handle()
            h.go(q,base,'#notes','#progress-file')
            q.locator('#progress-file').set_input_files({'name':'synthetic-power-notes.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
            q.locator('#progress-import-confirm').wait_for()
            h.ok('Watts' in q.locator('.import-preview').inner_text(),'Notes preview names Watts sheets')
            h.click(q,'#progress-import-confirm')
            open_desk(q,base)
            old_control.evaluate('e=>e.click()')
            h.ok(h.active(q)!=old_owner and h.book(q)['powerNotes']==mixed['powerNotes'],'replacement notebook rejects stale old-owner Keep')
            open_saved(q,'power-sheet-70')
            h.ok('Earlier <model> & notes' in text(q) and seconds(q)==[10,20],'frozen historical source is escaped and uses its own machines')
            h.ok(not q.locator('[data-watts-action="worked"],[data-watts-action="example"],[data-watts-action="finished"]').count(),'saved undisclosed numerical help cannot be newly opened')
            h.click(q,'[data-watts-action="again"][data-watts-id="power-sheet-70"]')
            act(q,'worked');act(q,'keep')
            h.ok(sheet(q,'power-sheet-91')['source']==historical['source'] and sheet(q,'power-sheet-70')==historical,'Try again clones frozen source and reserves unreadable sibling ID')
            redownload=native.download(q,base,'imported-redownload')
            h.ok(redownload['powerNotes'][:3]==mixed['powerNotes'],'Notes roundtrip preserves readable and unavailable siblings verbatim')
            open_desk(q,base)
            route_stale=q.locator('[data-watts-action="keep"]').element_handle()
            q.evaluate('location.hash="#workshop/lift"')
            q.locator('a[href="#mill/energy"]').wait_for()
            route_stale.evaluate('e=>e.click()')
            invitation=q.locator('.watts-lift-invitation a[href="#mill/energy"]')
            h.ok(invitation.count()==1 and 'Sheet 4' in q.locator('.watts-lift-invitation').inner_text() and 'Earlier <model> & notes' in q.locator('.watts-lift-invitation').inner_text(),'later Lift invitation names latest readable raw-indexed frozen sheet')
            h.ok('Kept sheets' in q.locator('main').inner_text(),'Lift gives explicit Mill to Watts to shelf return path')
            invitation.tap();q.locator('[data-energy-root]').wait_for()
            h.ok(not q.locator('[data-watts-root]').count(),'Lift return opens ordinary Mill first')
            q.get_by_role('button',name='Watts Desk',exact=True).tap();open_saved(q,'power-sheet-91')
            h.ok(len(h.book(q)['powerNotes'])==4,'route-exited stale Keep cannot append')
            h.click(q,'#explorer-switch');h.click(q,'[data-select-explorer="explorer-2"]')
            q.locator('[data-energy-root]').wait_for()
            h.ok('powerNotes' not in h.book(q),'second explorer has independent notebook')

            for width in [320,1024]:
                _,sample=setup(browser,seed,'sample-'+str(width),width)
                open_desk(sample,base);add(sample,'willow');bounds(sample)
                h.ok(seconds(sample)==[0,5,0],'responsive sample retains real time controls')
                if width==320:sample.screenshot(path=str(OUT/'phone-sample.png'),full_page=True)

            # Separately labelled capacity/malformed-root refusal probes.
            for label,root in [('full-cap',[dict(copy.deepcopy(first),id=f'power-sheet-{i}') for i in range(1,13)]),('malformed-root',{'raw':'Synthetic unavailable root'})]:
                full_seed=copy.deepcopy(seed);full_seed['powerNotes']=root
                _,full=setup(browser,full_seed,label);open_desk(full,base);add(full,'reed')
                unchanged=copy.deepcopy(h.book(full));act(full,'keep')
                h.ok(h.book(full)==unchanged and seconds(full)==[5,0,0],'refused '+label+' Keep preserves all roots and current draft')
                h.ok('not been kept' in text(full) and 'notes' in text(full).lower(),'refusal explains recovery and visit-local draft')

            # Explicit storage fault, excluded from ordinary journey.
            _,quota=setup(browser,seed,'quota-fault');open_desk(quota,base)
            disk_before=copy.deepcopy(h.book(quota))
            quota.evaluate('''()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Synthetic quota','QuotaExceededError');return set.call(this,k,v)}}''')
            act(quota,'keep')
            h.ok(h.book(quota)==disk_before,'quota fault leaves persisted notebook unchanged')
            h.ok('open page' in text(quota) and quota.locator('[data-save-warning]').is_visible(),'quota explains retained in-memory sheet')
            h.ok(len(native.download(quota,base,'quota-memory')['powerNotes'])==1,'actual Notes download recovers memory-only sheet')
            # Saving-off uses the actual Notes preference, separately from quota.
            _,temporary=setup(browser,seed,'saving-off');open_desk(temporary,base)
            h.go(temporary,base,'#notes','#remember');temporary.locator('#remember').click();temporary.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click()
            temporary.evaluate('location.hash="#mill/energy"');temporary.locator('[data-energy-root]').wait_for()
            temporary.get_by_role('button',name='Watts Desk',exact=True).tap();act(temporary,'keep')
            h.ok('saving is off' in text(temporary), 'saving-off status explains open-page retention')
            h.ok(len(native.download(temporary,base,'saving-off-memory')['powerNotes'])==1, 'saving-off sheet survives route change for Notes recovery')
            h.ok(not h.errors,'no native page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'ordinary module requests succeed')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'scope':'One820px touch/keyboard journey,320/1024 samples, native Chrome, real Notes transfer. Separate stale-control, capacity and quota faults.'},indent=2))
            print(f'Watts Desk browser: {h.checks} checks passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for page,label in h.pages:
                if not page.is_closed():
                    try:
                        page.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True)
                        (OUT/(label+'-failure.html')).write_text(page.content())
                    except Exception: pass
            raise
        finally:
            for context in h.contexts:
                try:context.close()
                except Exception:pass
            browser.close();server.shutdown()


if __name__=='__main__':main()
