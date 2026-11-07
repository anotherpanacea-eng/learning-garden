"""Find the Other Length426: one native journey with synthetic notebooks.
Representative responsive and ownership probes supplement the full journey.
Local speech requests are observed; no hardware, audibility or learning claim.
"""
import sys
sys.dont_write_bytecode = True
import importlib.util
import json
import os
import re
from pathlib import Path
import tempfile
import traceback
from fractions import Fraction

OUT = Path(os.environ.get('MISSING_RIBBON_ARTIFACTS') or tempfile.mkdtemp(prefix='lg426-browser-', dir='/private/tmp'))
os.environ['JOIN_PIECES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('join_browser_fixture', Path(__file__).with_name('join-pieces-browser.py'))
host = importlib.util.module_from_spec(spec)
spec.loader.exec_module(host)
host.FIXTURE['seed']['missingRibbon'] = {'version':999, 'opaque':['synthetic future work',17]}
ok, setup, go, snapshot, export = host.ok, host.setup, host.go, host.snapshot, host.export
VIEW = '[data-missing-root]'
CUTS = {'half-and-third':[3], 'equal-banners':[2], 'quarter-third':[3], 'sixth-quarter':[2], 'quarter-and-third':[3]}

def mode(p, name='missing', key=None):
    q = p.locator('[data-join-mode="'+name+'"]')
    if key:
        q.focus(); p.keyboard.press(key)
    else:q.click()
    ok(q.get_attribute('aria-pressed')=='true', 'native mode pressed state')

def selector(action, factor=None):
    return '[data-missing-action="'+action+'"]'+(f'[data-missing-factor="{factor}"]' if factor else '')

def act(p, action, factor=None, key=None):
    q = p.locator(selector(action,factor)).first
    if key:
        q.focus();p.keyboard.press(key)
    else:q.click()
    ok(p.evaluate('document.activeElement!==document.body&&document.activeElement.isConnected&&!document.activeElement.disabled&&document.activeElement.getClientRects().length>0'), 'usable native focus after '+action)

def choose(p, ident):
    q = p.locator('[data-missing-start="'+ident+'"]')
    if q.count():
        if not q.first.is_visible():q.first.locator('xpath=ancestor::details[1]').locator('summary').click()
        q.first.click()
    p.locator('[data-missing-view="case"]').wait_for()

def state(p, example=False):
    scope=p.locator('[data-missing-view="'+('example' if example else 'case')+'"]')
    return {role:{'count':int(scope.locator('[data-missing-role="'+role+'"]').get_attribute('data-missing-count')), 'denominator':int(scope.locator('[data-missing-role="'+role+'"]').get_attribute('data-missing-denominator'))} for role in ['total','known','remaining','aside']}

def geometry(p, case, example=False):
    s=state(p,example)
    total=Fraction(3,4) if example else sum(Fraction(case[k]['numerator'],case[k]['denominator']) for k in ['left','right'])
    known=Fraction(1,2) if example else Fraction(case['left']['numerator'],case['left']['denominator'])
    ok(Fraction(s['total']['count'],s['total']['denominator'])==total, 'fixed total endpoint and recut count')
    ok(Fraction(s['known']['count'],s['known']['denominator'])==known, 'known length unchanged by cuts')
    ok(s['remaining']['count']+s['aside']['count']==s['total']['count'], 'actual material conservation')
    scope=p.locator('[data-missing-view="'+('example' if example else 'case')+'"]')
    widths=[]
    for role in ['total','remaining','aside']:
        q=scope.locator('[data-missing-role="'+role+'"]')
        strips=q.locator('svg').evaluate_all('xs=>xs.filter(e=>e.querySelector("[data-join-whole]")).map(e=>{const b=e.querySelector("[data-join-whole]").getBoundingClientRect();return {x:b.x,w:b.width,pieces:[...e.querySelectorAll("[data-join-piece]:not([data-moved])")].map(x=>{const r=x.getBoundingClientRect();return {x:r.x,w:r.width,source:x.dataset.source}})}})')
        n,d=s[role]['count'],s[role]['denominator']
        ok(len(strips)==(2 if n>d else 1), role+' strips cross and land on one whole exactly')
        ok(sum(len(g['pieces']) for g in strips)==n, role+' actual fills equal material count')
        for g in strips:
            widths.append(g['w'])
            for i,b in enumerate(g['pieces']):
                ok(abs(b['w']-g['w']/d)<.35 and abs(b['x']-g['x']-i*g['w']/d)<.35, role+' equal units form prefix')
                ok(b.get('source') is None, 'allocation has no historical source identity')
    originals=scope.locator('[data-missing-role="known"] [data-common-whole]').evaluate_all('xs=>xs.map(x=>x.getBoundingClientRect().width)')
    ok(originals and max(widths+originals)-min(widths+originals)<.3, 'every given/work/reference whole shares one scale')
    shade=scope.locator('[data-missing-role="known"] [data-common-shade]').first
    ok(abs(shade.evaluate('e=>e.getBoundingClientRect().width')/originals[0]-float(known))<.0001, 'fixed known reference shaded endpoint')
    return s

def layout(p,label):
    p.screenshot(path=str(OUT/(label+'.png')),full_page=True)
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow '+label)
    bad=p.locator(VIEW+' button,'+VIEW+' summary,[data-join-mode]').evaluate_all('xs=>xs.filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().width<43.5||e.getBoundingClientRect().height<43.5||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>e.outerHTML.slice(0,100))')
    ok(not bad,'native 44px targets and16px text '+str(bad))

def speech(p):
    p.evaluate('joinSpeech.words=[]')
    p.locator(VIEW+' [data-speak]').click()
    words=p.evaluate('joinSpeech.words')
    ok(len(words)==1,'first Hear requests one local utterance')
    ok(not re.search(r'\d+\s*/\s*\d+',words[0]),'spoken fractions use unit words rather than slash notation')
    return words[0]

def closed_answer(p,case):
    scope=p.locator('[data-missing-view="case"]')
    html=scope.evaluate('e=>e.outerHTML')
    text=scope.inner_text()
    ok('The other length is' not in html and 'Check:' not in html and ' − ' not in html, 'closed incomplete view has no hidden solved expression')
    ok('Length B' not in html and 'length B' not in html and 'data-result' not in html, 'no original B label or concealed result field')
    ok('Check:' not in speech(p),'closed incomplete narration has no model answer')

def journey(browser,base):
    print('426: five-card native journey',flush=True)
    c,p=setup(browser,base)
    try:
        before_export=export(p,base,'notes-before');go(p,base)
        before=snapshot(p)
        ok(p.locator('[data-join-mode="join"]').get_attribute('aria-pressed')=='true','Join remains default')
        mode(p,key='Enter');p.locator('[data-missing-view="chooser"]').wait_for();layout(p,'chooser-820')
        go(p,base,'#notes');go(p,base);host.choose(p,'equal-banners');host.act(p,'split','left',2)
        joined=host.state(p)
        oldjoin=p.locator(host.selector('uncut','left')).element_handle();oldhear=p.locator('[data-join-root] [data-speak]').element_handle()
        mode(p,key='Space')
        first=state(p);voice=p.evaluate('JSON.stringify(joinSpeech)');host.dispatch(oldjoin);host.dispatch(oldhear)
        ok(state(p)==first and p.evaluate('JSON.stringify(joinSpeech)')==voice,'old enabled Join action/Hear cannot act in Missing mode')
        ok(state(p)['known']['denominator']==3 and state(p)['aside']['count']==0,'first Missing entry takes selected card with fresh cuts/separation')
        mode(p,'join');ok(host.state(p)==joined,'Join work preserved independently');mode(p)
        for case in host.FIXTURE['cases']:
            choose(p,case['id']);s=geometry(p,case);closed_answer(p,case)
            ok(p.locator(selector('take')).is_disabled(),'unmatched separation disabled')
            if case['id']=='half-and-third':
                act(p,'split-known',2);ok(state(p)['known']['denominator']==4,'reversible eighth-unit detour begins with quarters')
                act(p,'split-known',2);ok(state(p)['known']['denominator']==8,'eighth detour remains open')
                act(p,'uncut-known');act(p,'uncut-known')
            if case['id']=='equal-banners':
                act(p,'split-known',3);ok(state(p)['known']['denominator']==9,'ninth detour remains open');act(p,'uncut-known')
            act(p,'reference');ok('Check:' not in p.locator(VIEW).inner_text(),'unmatched reference cannot supply difference')
            for f in CUTS[case['id']]:act(p,'split-known',f,key='Enter')
            s=geometry(p,case);d=s['total']['denominator'];target=s['known']['count'];total=s['total']['count']
            ok(s['known']['denominator']==d,'known and total matched natively')
            act(p,'take',key='Space');partial=geometry(p,case)
            ok(partial['aside']['count']==1,'one action sets aside one unit');closed_answer(p,case)
            ok(p.locator(selector('split-known',2)).is_disabled() and p.locator(selector('uncut-known')).is_disabled(),'cuts locked with allocation')
            act(p,'reference');ok(f'= {total-target}/{d}' in p.locator(VIEW).inner_text() and state(p)==partial,'reference supplies full difference without completing partial work')
            act(p,'undo');ok(geometry(p,case)['remaining']['count']==total,'Undo refills exact last emptied slot')
            closed_answer(p,case)
            for n in range(1,target+1):
                act(p,'take');s=state(p)
                ok(s['aside']['count']==n,'separation advances exactly one unit')
                if s['remaining']['count'] in [d+1,d,total-target]:geometry(p,case)
            ok(p.locator(selector('take')).is_disabled() and f'= {total-target}/{d}' in p.locator(VIEW).inner_text(),'complete at A with supplied subtraction and addition check')
            act(p,'undo');closed_answer(p,case);act(p,'return')
            ok(state(p)['aside']['count']==0 and state(p)['known']['denominator']==d,'Return restores total while keeping cuts')
            if d==6:
                act(p,'split-total');act(p,'split-known',2)
                ok(geometry(p,case)['total']['denominator']==12,'optional twelfths total/known match')
                for _ in range(state(p)['known']['count']):act(p,'take')
                geometry(p,case);ok('The set-aside length matches A.' in p.locator(VIEW).inner_text(),'twelfths branch completes at renamed A')
                act(p,'undo');act(p,'return');act(p,'uncut-total');act(p,'uncut-known')
            if case['id']=='quarter-third':layout(p,'material-820')
        choose(p,'equal-banners');act(p,'take');live=state(p)
        choose(p,'half-and-third');choose(p,'equal-banners');ok(state(p)==live,'per-card material survives another card')
        oldmode=p.locator('[data-join-mode=join]').element_handle();act(p,'take');live=state(p)
        host.dispatch(oldmode);ok(p.locator('[data-join-mode=missing]').get_attribute('aria-pressed')=='true' and state(p)==live,'mode control captured before material change is inert')
        mode(p,'join');ok(host.state(p)==joined,'Missing completion never changes joining work');mode(p)
        ok(state(p)==live,'mode swap retains missing card work')
        act(p,'example')
        for frame,count in enumerate([0,0,1,2,2]):
            if frame:act(p,'next')
            ex=geometry(p,None,True);ok(ex['aside']['count']==count,'manual example frame '+str(frame+1))
            words=speech(p)
            ok('eighths' not in words and 'twelfths' not in words,'example Hear excludes inactive live work')
            if frame<4:ok('Subtracting the tops' not in words,'earlier frame excludes later false claim')
            if frame==4:
                claim=p.locator('[data-missing-role="claim"]')
                ok('2/2' in claim.inner_text() and claim.locator('[data-source]').count()==0,'neutral false claim has no A provenance')
                g=claim.locator('svg').evaluate('e=>({whole:e.querySelector("[data-join-whole]").getBoundingClientRect().width,pieces:[...e.querySelectorAll("[data-join-piece]")].map(x=>x.getBoundingClientRect().width)})')
                ok(len(g['pieces'])==2 and abs(sum(g['pieces'])/g['whole']-1)<.0001,'false two halves occupy a whole, exceeding original three quarters')
                layout(p,'example-820')
        act(p,'previous');act(p,'back');ok(state(p)==live,'example never alters live work')
        act(p,'example');ok(state(p,True)['aside']['count']==0,'reopening starts example afresh');act(p,'back')
        words=speech(p);ok('How could you check' not in words and 'Subtracting the tops' not in words,'closed help/later frames excluded from current Hear')
        for detail in p.locator(VIEW+' [data-join-panel]').all():
            summary=detail.locator('summary');initial=detail.evaluate('e=>e.open');summary.click();summary.click()
            ok(detail.evaluate('e=>e.open')==initial,'native disclosure reopens without retiring controls')
        act(p,'return');act(p,'take');ok(state(p)['aside']['count']==1,'genuine action after disclosure transitions')
        ok(snapshot(p)==before,'actual notebook and both storages unchanged, including unknown future roots')
        ok(export(p,base,'notes-after')==before_export,'actual Notes downloads unchanged except exportedAt')
    finally:
        if sys.exc_info()[0]:p.screenshot(path=str(OUT/'failure.png'),full_page=True)
        c.close()

def lifecycle(browser,base):
    print('426: stale controls and real ownership transitions',flush=True)
    for mutation in ['hidden','inert','style','root','mode','case','material','route']:
        c,p=setup(browser,base)
        try:
            mode(p);choose(p,'half-and-third');speech(p)
            old=p.locator(selector('split-known',3)).element_handle();read=p.locator(VIEW+' [data-speak]').element_handle()
            ok(old.is_enabled(),'stale probe begins with enabled control')
            changes={'hidden':'e.hidden=true;e.hidden=false','inert':'e.inert=true;e.inert=false','style':'e.style.display="none";e.style.removeProperty("display")','root':'const parent=e.parentNode,next=e.nextSibling;e.remove();parent.insertBefore(e,next)'}
            if mutation in changes:
                if mutation=='root':p.locator(VIEW).evaluate('e=>{'+changes[mutation]+'}')
                else:
                    old.evaluate('e=>{'+changes[mutation]+'}');read.evaluate('e=>{'+changes[mutation]+'}')
            elif mutation=='mode':mode(p,'join');mode(p)
            elif mutation=='case':choose(p,'quarter-third')
            elif mutation=='material':act(p,'split-total')
            else:
                route_saved=snapshot(p);route_words=p.evaluate('joinSpeech.words.slice()')
                p.evaluate("()=>{window.missingOld=[document.querySelector('[data-missing-action=split-known][data-missing-factor=\"3\"]'),document.querySelector('[data-missing-root] [data-speak]')];location.hash='#notes';missingOld.forEach(e=>e.click())}")
                p.locator('#download').wait_for()
                ok(snapshot(p)==route_saved and p.evaluate('joinSpeech.words')==route_words,'same-tick route departure refuses old action and Hear')
                go(p,base);mode(p);choose(p,'half-and-third')
            before=state(p);saved=snapshot(p);voice=p.evaluate('JSON.stringify(joinSpeech)')
            host.dispatch(old);host.dispatch(read)
            ok(state(p)==before and snapshot(p)==saved and p.evaluate('JSON.stringify(joinSpeech)')==voice,'obsolete '+mutation+' cut/Hear cannot act')
            stop=p.locator('[data-stop-speech]').first
            # The independently owned global callback survives material retirement;
            # mode redraws may hide its panel until another genuine Hear request.
            if stop.is_visible():stop.click()
            else:host.dispatch(stop.element_handle())
            ok(p.evaluate('joinSpeech.cancel')>json.loads(voice)['cancel'],'global Stop remains independently owned')
            go(p,base,'#notes');go(p,base);mode(p);choose(p,'half-and-third');act(p,'split-known',3)
            ok(state(p)['known']['denominator']==6,'subsequent genuine action after '+mutation)
            if mutation=='mode':
                speech(p);stopped=p.evaluate('joinSpeech.cancel');p.locator('[data-stop-speech]').first.click()
                ok(p.evaluate('joinSpeech.cancel')>stopped,'fresh native Hear and visible Stop after mode retirement')
        finally:
            if sys.exc_info()[0]:p.screenshot(path=str(OUT/'failure.png'),full_page=True)
            c.close()
    for operation in ['chooser','owner','import','reset','reload']:
        c,p=setup(browser,base)
        try:
            host.choose(p,'half-and-third');host.act(p,'split','left',3);mode(p);act(p,'split-known',3)
            old=p.locator(selector('uncut-known')).element_handle();read=p.locator(VIEW+' [data-speak]').element_handle()
            inactive=p.evaluate("()=>Object.entries(localStorage).filter(([k])=>k==='number-garden-v1:explorer-2')")
            if operation in ['chooser','owner']:
                p.locator('#explorer-switch').click();p.locator('[data-select-explorer="explorer-'+('1' if operation=='chooser' else '2')+'"]').click()
            elif operation=='reload':p.reload(wait_until='networkidle')
            elif operation=='import':
                go(p,base,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-missing.json','mimeType':'application/json','buffer':json.dumps(host.FIXTURE['seed']).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
            else:
                go(p,base,'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click();p.wait_for_function("location.hash==='#home'");p.locator('dialog.welcome-film[open] [data-film-skip]').click()
            if operation in ['import','reset']:
                ok(p.evaluate('xs=>xs.every(([k,v])=>localStorage.getItem(k)===v)',inactive),'inactive explorer retained through '+operation)
            go(p,base);p.locator('[data-join-view="chooser"]').wait_for();mode(p);p.locator('[data-missing-view="chooser"]').wait_for();choose(p,'half-and-third')
            ok(state(p)['known']['denominator']==2,'both modes cleared through '+operation)
            act(p,'split-known',3);before=state(p);voice=p.evaluate('JSON.stringify(joinSpeech)')
            if operation!='reload':
                host.dispatch(old);host.dispatch(read);ok(state(p)==before and p.evaluate('JSON.stringify(joinSpeech)')==voice,'old '+operation+' handles inert')
            act(p,'uncut-known');ok(state(p)['known']['denominator']==2,'genuine current action after '+operation)
        finally:
            if sys.exc_info()[0]:p.screenshot(path=str(OUT/'failure.png'),full_page=True)
            c.close()

def responsive_and_unseen(browser,base):
    for width in [320,1024]:
        c,p=setup(browser,base,width)
        try:
            mode(p);choose(p,'quarter-third');act(p,'split-known',3)
            for _ in range(5):act(p,'take')
            geometry(p,next(x for x in host.FIXTURE['cases'] if x['id']=='quarter-third'));layout(p,'material-'+str(width))
            act(p,'example')
            for _ in range(4):act(p,'next')
            layout(p,'example-'+str(width))
        finally:
            if sys.exc_info()[0]:p.screenshot(path=str(OUT/'failure.png'),full_page=True)
            c.close()
    c,p=setup(browser,base,unseen=True)
    try:
        expected=json.loads(json.dumps(host.FIXTURE['unseen']));actual=snapshot(p)['book']
        actual.get('garden',{}).pop('avatar',None);expected.get('garden',{}).pop('avatar',None)
        if not actual.get('garden') and 'garden' not in expected:actual.pop('garden',None)
        ok(actual==expected,'direct unseen entry initializes no unrelated game')
        before=snapshot(p);mode(p);choose(p,'half-and-third');act(p,'split-known',3);act(p,'take')
        ok(snapshot(p)==before,'direct unseen Missing play initializes no saved records')
    finally:
        if sys.exc_info()[0]:p.screenshot(path=str(OUT/'failure.png'),full_page=True)
        c.close()

def main():
    server=host.Server(('127.0.0.1',0),host.functools.partial(host.Quiet,directory=str(host.ROOT/'dist')))
    host.threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}/'
    print('Artifacts: '+str(OUT),flush=True)
    try:
        with host.sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
            try:
                journey(browser,base);lifecycle(browser,base);responsive_and_unseen(browser,base)
                ok(not host.errors,'no browser/request/console errors '+str(host.errors))
                receipt={'status':'passed','scope':__doc__,'artifacts':str(OUT)}
                (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(json.dumps(receipt),flush=True)
            except Exception:
                for context in browser.contexts:
                    for page in context.pages:
                        try:page.screenshot(path=str(OUT/'failure.png'),full_page=True)
                        except Exception:pass
                failure=traceback.format_exc()+'\n'+json.dumps(host.errors,indent=2)
                (OUT/'failure.txt').write_text(failure);print(failure,flush=True);raise
            finally:browser.close()
    finally:server.shutdown();server.server_close()

if __name__=='__main__':main()
