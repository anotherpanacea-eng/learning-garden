"""Common Cuts292: native touch/material and transient-lifecycle checks.
Synthetic notebooks only. COMMON_TEST_URL replays the verified hosted build.
Chrome geometry/speech requests are not physical iPad or audibility proof.
"""
import copy
import re
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('COMMON_ARTIFACTS', tempfile.mkdtemp(prefix='common-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
checks, contexts, pages, errors, faults = 0, [], [], [], []
VIEW = '[data-common-root]'

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def active(p):
    return p.evaluate("()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")

def book(p):
    return p.evaluate("()=>{const i=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+i));}")

def setup(browser, width, height, seed, label, second_seed=None):
    c = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True,
                            reduced_motion='reduce', accept_downloads=True)
    contexts.append(c)
    profiles=[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-28T12:00:00.000Z'}]
    seeds={'explorer-1':seed}
    if second_seed is not None:
        profiles.append({'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-10-28T12:00:00.000Z'})
        seeds['explorer-2']=second_seed
    fixture={'registry':{'version':1,'activeId':'explorer-1','explorers':profiles},'seeds':seeds}
    c.add_init_script('(fixture=>{if(!localStorage.getItem("common-fixture")){for(const [id,seed] of Object.entries(fixture.seeds))localStorage.setItem("number-garden-v1:"+id,JSON.stringify(seed));localStorage.setItem("learning-garden-explorers",JSON.stringify(fixture.registry));localStorage.setItem("common-fixture","1");}})('+json.dumps(fixture)+')')
    c.add_init_script('window.commonSpeechRequests=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{window.commonSpeechRequests.push(u.text);return native(u);};}')
    p = c.new_page()
    pages.append((p, label))
    p.set_default_timeout(12000)
    p.on('pageerror', lambda e: errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda m: faults.append({'case': label, 'type': 'console', 'text': m.text}) if m.type == 'error' else None)
    p.on('response', lambda r: faults.append({'case': label, 'type': 'http', 'status': r.status, 'url': r.url}) if r.status >= 400 else None)
    p.on('requestfailed', lambda r: faults.append({'case': label, 'type': 'request', 'error': r.failure, 'url': r.url}) if 'ERR_ABORTED' not in (r.failure or '') else None)
    return p

def go(p, base, route='#workshop/common-cuts', selector=VIEW):
    p.goto(base + route, wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    identity = active(p)
    choice = p.locator(f'[data-select-explorer="{identity}"]')
    if choice.count():
        choice.click()
    p.locator(selector).wait_for()

def click(p, selector):
    p.locator(selector).first.tap()

def snap(p, name):
    p.screenshot(path=str(OUT / (name + '.png')), full_page=True)

def choose(p,id):
    b=p.locator('[data-common-start="'+id+'"]')
    ok(b.count()==1,'actual pair chooser exists '+id)
    if not b.is_visible():b.locator('xpath=ancestor::details[1]').locator('summary').tap()
    b.tap();p.locator('[data-common-view="case"]').wait_for()

def d(p,side):
    return int(p.locator('[data-common-view="case"] [data-common-model="'+side+'"]').get_attribute('data-denominator'))

def split(p,side,factor):
    click(p,'[data-common-split="'+side+'"][data-factor="'+str(factor)+'"]')

def undo(p,side):click(p,'[data-common-undo="'+side+'"]')

def material(p,c,example=False):
    scope=p.locator('[data-common-view="'+('example' if example else 'case')+'"]')
    rows={}
    for side in ['left','right']:
        svg=scope.locator('svg[data-common-row="'+side+'"]')
        r=svg.evaluate('e=>{const box=s=>{const b=e.querySelector(s).getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height}};return {whole:box("[data-common-whole]"),shade:box("[data-common-shade]"),flag:box("[data-common-flag]"),cuts:[...e.querySelectorAll("[data-common-cut]")].map(c=>({x:c.getBoundingClientRect().x,kind:c.dataset.commonCut})),d:Number(e.dataset.denominator)}}')
        f=c[side];n0,d0=f['numerator'],f['denominator'];whole,shade=r['whole'],r['shade']
        ok(abs(shade['w']/whole['w']-n0/d0)<.0001,'actual shaded amount preserved '+side)
        ok(abs(shade['x']-whole['x'])<.1 and abs(r['flag']['x']-shade['x']-shade['w'])<.5,'actual flag stays at shaded end '+side)
        ok(len(r['cuts'])==r['d']-1,'actual equal-piece boundary count '+side)
        for i,cut in enumerate(r['cuts'],1):ok(abs(cut['x']-whole['x']-whole['w']*i/r['d'])<.5,'actual equal cut position '+side)
        rows[side]=r
    ok(abs(rows['left']['whole']['x']-rows['right']['whole']['x'])<.1 and abs(rows['left']['whole']['w']-rows['right']['whole']['w'])<.1,'same-size wholes aligned in actual pixels')
    return rows

def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    for el in p.locator(VIEW+' button,'+VIEW+' a,'+VIEW+' summary').all():
        if el.is_visible():
            r=el.bounding_box();ok(r['width']>=43.5 and r['height']>=43.5,'native44px target '+el.inner_text())
    if p.viewport_size['width']>=700:
        rs=p.locator('[data-common-view=case] .common-row').evaluate_all('xs=>xs.map(e=>{const b=e.getBoundingClientRect();return {top:b.top,bottom:b.bottom}})')
        ok(len(rs)==2 and max(r['bottom'] for r in rs)-min(r['top'] for r in rs)<=p.viewport_size['height']-40,'both complete ribbons and controls fit together')
    for el in p.locator('[data-common-readout]').all():
        if el.is_visible():ok(float(el.evaluate('e=>getComputedStyle(e).fontSize').replace('px',''))>=16,'HTML readout remains16px')

def no_film(p):ok(p.locator('dialog.welcome-film[open]').count()==0,'no automatic film at transient table')

def stash(p):
    n=p.evaluate("()=>{window.commonOld=[...document.querySelectorAll('[data-common-split],[data-common-undo],[data-common-compare],[data-common-example-next],[data-speak]')];return commonOld.length}")
    ok(n>=2,'actual old controls exist')

def old_click(p):
    before=book(p);n=p.evaluate('commonSpeechRequests.length')
    ok(p.evaluate('commonOld.every(e=>!e.isConnected)'),'old controls detached')
    p.evaluate('commonOld.forEach(e=>e.click())')
    ok(book(p)==before and p.evaluate('commonSpeechRequests.length')==n,'old handlers cannot mutate notebook or speak')

def download(p,base,name):
    p.locator('a[href="#notes"]').first.tap();p.locator('#download').wait_for()
    with p.expect_download() as x:click(p,'#download')
    path=OUT/(name+'.json');x.value.save_as(path);return json.loads(path.read_text())

def bring(p,base,report):
    p.locator('#progress-file').set_input_files({'name':'synthetic-common.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for();click(p,'#progress-import-confirm')
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual confirmed import')


def journey(browser,base,f,w,h):
    p=setup(browser,w,h,f['base'],'journey-'+str(w));go(p,base);no_film(p);baseline=book(p)
    paths={'half-and-third':([3],[2]),'equal-banners':([2],[]),'quarter-third':([3],[2,2]),'sixth-quarter':([2],[3]),'quarter-and-third':([3],[2,2])}
    for c in f['cases']:
        choose(p,c['id']);material(p,c);click(p,'[data-common-compare]')
        ok('different sizes' in p.locator('[data-common-comparison]').inner_text(),'unmatched units get specific count-only caveat')
        for side,steps in zip(['left','right'],paths[c['id']]):
            for factor in steps:
                before=d(p,side);split(p,side,factor);ok(d(p,side)==before*factor,'native split changes both piece counts');material(p,c)
        ok(d(p,'left')==d(p,'right'),'constructed common units')
        click(p,'[data-common-compare]');text=p.locator('[data-common-comparison]').inner_text()
        a,b=c['left'],c['right'];rel=a['numerator']*b['denominator']-b['numerator']*a['denominator'];symbol='>' if rel>0 else '<' if rel<0 else '='
        ok(symbol in text and 'same-sized whole' in text,'supplied common-unit relation correct')
        bounds(p);p.screenshot(path=str(OUT/('pair-'+str(w)+'-'+c['id']+'.png')),full_page=True)
        if c['id'] in ['half-and-third','equal-banners']:
            split(p,'left',2);split(p,'right',2);ok(d(p,'left')==12 and d(p,'right')==12,'finer twelfths route accepted');material(p,c);click(p,'[data-common-compare]');ok(symbol in p.locator('[data-common-comparison]').inner_text(),'finer units preserve relation')
        ok(book(p)==baseline,'cuts/compare/case UI write no notebook data')
    choose(p,'half-and-third');ok(d(p,'left')==12 and d(p,'right')==12,'case switching preserves visit material')
    before=(d(p,'left'),d(p,'right'));click(p,'[data-common-example-open]');p.locator('[data-common-view="example"]').wait_for()
    ex={'left':{'numerator':1,'denominator':2},'right':{'numerator':1,'denominator':4}}
    for frame in range(3):
        geom=material(p,ex,True);ok(geom['left']['d']==(4 if frame==1 else 2),'example picture really changes partition')
        if frame<2:click(p,'[data-common-example-next]')
    click(p,'[data-common-example-previous]');click(p,'[data-common-example-close]');ok((d(p,'left'),d(p,'right'))==before,'example leaves live job intact');ok(book(p)==baseline,'help/example not recorded as performance')
    p.reload();p.locator('[data-common-view="chooser"]').wait_for();ok(book(p)==baseline,'reload leaves notebook and unknown future data intact');no_film(p)


def lifecycle(browser,base,f):
    p=setup(browser,820,1180,f['base'],'lifecycle',f['base']);go(p,base);p.goto(base+'#workshop/recut',wait_until='domcontentloaded');p.locator('.recut-page').wait_for();entry=p.locator('[data-common-link]');ok(entry.count()==1,'actual Recut entry exists');r=entry.bounding_box();ok(r['width']>=44 and r['height']>=44,'Recut entry touch target');entry.tap();p.locator(VIEW).wait_for();choose(p,'half-and-third');stash(p);choose(p,'quarter-and-third');old_click(p);ok(d(p,'left')==4,'stale case control does not change visible new material');split(p,'left',2);ok(d(p,'left')==8,'subsequent native cut uses untouched material');choose(p,'half-and-third');ok(d(p,'left')==2,'old case material also stayed unchanged')
    split(p,'left',2);stash(p);split(p,'left',2);old_click(p);ok(d(p,'left')==8,'stale earlier-phase action cannot recut');undo(p,'left');ok(d(p,'left')==4,'legitimate Undo proves current transient history')
    # Real Undo reaches the original and allows a different construction branch.
    undo(p,'left');split(p,'left',3);split(p,'right',3);ok(d(p,'left')==6 and d(p,'right')==9,'valid sixth/ninth detour is available');undo(p,'right');split(p,'right',2);ok(d(p,'right')==6,'Undo changes course without changing amount')
    before=book(p);p.evaluate("()=>{window.commonRouteOld=[...document.querySelectorAll('[data-common-split],[data-speak]')];location.hash='#notes';commonRouteOld.forEach(e=>e.click())}");p.locator('#download').wait_for();ok(book(p)==before,'same-tick departed controls inert');go(p,base);p.locator('[data-common-view="chooser"]').wait_for()
    choose(p,'half-and-third');split(p,'left',3);stash(p);report=download(p,base,'transfer');ok(report['sentinel']==f['base']['sentinel'] and report['commonCuts']==f['base']['commonCuts'],'actual export retains unrelated unknown data without table records');bring(p,base,report);go(p,base);p.locator('[data-common-view="chooser"]').wait_for();old_click(p);choose(p,'half-and-third');split(p,'left',2);ok(d(p,'left')==4,'import invalidates old model and callbacks')
    p.evaluate("()=>{location.hash='#numbers';location.hash='#workshop/common-cuts'}");p.wait_for_timeout(150);p.locator('[data-common-view="chooser"]').wait_for();ok(True,'same-tick departure/re-entry clears via oldURL')
    choose(p,'half-and-third');split(p,'left',3);stash(p);p.locator('#explorer-switch').tap();p.locator('[data-select-explorer="explorer-2"]').tap();p.locator('[data-common-view="chooser"]').wait_for();old_click(p);no_film(p);choose(p,'half-and-third');split(p,'left',2);ok(d(p,'left')==4,'new explorer starts fresh material')
    p.locator('a[href="#notes"]').first.tap();p.locator('#reset').wait_for();click(p,'#reset');click(p,'#confirm-reset');p.wait_for_function("location.hash==='#home'")
    film=p.locator('dialog.welcome-film[open]');film.wait_for(state='visible');film.locator('[data-film-skip]').tap();film.wait_for(state='detached');go(p,base);p.locator('[data-common-view="chooser"]').wait_for();no_film(p)


def speech_and_input(browser,base,f):
    p=setup(browser,820,1180,f['base'],'speech');go(p,base);choose(p,'quarter-third');before=book(p)
    p.locator('[data-common-split="left"][data-factor="3"]').focus();p.keyboard.press('Enter');p.locator('[data-common-split="right"][data-factor="2"]').focus();p.keyboard.press('Space');split(p,'right',2);click(p,'[data-common-compare]');ok(d(p,'left')==12 and d(p,'right')==12,'native keyboard and taps construct common units')
    hear=p.locator(VIEW+' [data-speak]');ok(hear.count()==1,'one current native Hear')
    voices=p.evaluate('speechSynthesis.getVoices().filter(v=>v.localService&&/^en(?:[-_]|$)/i.test(v.lang)).length');hear.tap()
    script=hear.get_attribute('data-speak');ok('9/12' in script and '8/12' in script and 'half and quarter' not in script and '3/4Now' not in script and '2/3Now' not in script,'first Hear current readouts/comparison excludes closed example')
    if voices:p.wait_for_function('commonSpeechRequests.length===1')
    else:ok(p.evaluate('commonSpeechRequests.length')==0,'no unavailable/remote speech substitute')
    ok(book(p)==before,'Hear creates no support/assessment record')
    ok('Each old piece became' not in script,'closed cut explanation excluded from actual requested script')
    styles=p.locator('[data-common-view="case"] svg[data-common-row="left"] [data-common-cut]').evaluate_all('xs=>xs.map(e=>({kind:e.dataset.commonCut,dash:getComputedStyle(e).strokeDasharray}))')
    ok(sum(x['kind']=='new' for x in styles)==8 and all((x['dash']!='none')==(x['kind']=='new') for x in styles),'actual latest split has eight dashed new boundaries and solid survivors')
    p.locator('[data-common-cut-help] summary').tap();hear.tap();ok('Each old piece became' in hear.get_attribute('data-speak'),'open explanation included in actual requested script')
    undo(p,'left');ok(p.locator('[data-common-cut-help]').evaluate('e=>e.open'),'opened explanation survives a cut change')
    material(p,next(c for c in f['cases'] if c['id']=='quarter-third'))
    styles=p.locator('[data-common-view="case"] svg[data-common-row="left"] [data-common-cut]').evaluate_all('xs=>xs.map(e=>({kind:e.dataset.commonCut,dash:getComputedStyle(e).strokeDasharray}))')
    ok(len(styles)==3 and all(x['kind']=='old' and x['dash']=='none' for x in styles),'actual Undo removes only inserted cuts and leaves solid larger-piece boundaries')
    p.evaluate("window.dispatchEvent(new Event('hashchange'))");p.locator('[data-common-view="case"]').wait_for();ok(d(p,'left')==4 and d(p,'right')==12,'synthetic navigation notification is harmless')
    ok(book(p)==before,'explanation and synthetic navigation create no notebook record')

    # A genuinely unseen/uninitialized direct entry must not initialize unrelated games.
    p=setup(browser,820,1180,f['uninitialized'],'unseen');go(p,base);no_film(p);now=book(p);expected=copy.deepcopy(f['uninitialized']);now.get('garden',{}).pop('avatar',None);expected.get('garden',{}).pop('avatar',None)
    if now.get('garden')=={} and 'garden' not in expected:now.pop('garden')
    ok(now==expected,'direct entry initializes no unrelated owner');choose(p,'half-and-third');split(p,'left',3);ok('workshop' not in book(p),'explicit model interaction still creates no unrelated owner')


def main():
    js="import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import {commonCases} from './dist/common-cuts-core.mjs';const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;base.sentinel={note:'Synthetic retained work'};base.commonCuts={version:77,raw:'Synthetic unknown saved data'};console.log(JSON.stringify({base,uninitialized:freshState(),cases:commonCases}));"
    f=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=ROOT,text=True));server=None;base=os.environ.get('COMMON_TEST_URL')
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
            parts=set(os.environ.get('COMMON_TEST_PARTS','journey,lifecycle,speech').split(','))
            if 'journey' in parts:
                for w,h in [(820,1180),(1024,768),(320,800)]:journey(browser,base,f,w,h)
            if 'lifecycle' in parts:lifecycle(browser,base,f)
            if 'speech' in parts:speech_and_input(browser,base,f)
            ok(not errors,'no pageerrors');ok(not faults,'no request/console faults');result={'status':'passed','parts':sorted(parts),'checks':checks,'base':base,'pageErrors':errors,'faults':faults,'limits':'Synthetic native Chrome only; no physical iPad/Safari/audibility/efficacy claims.'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
        except Exception:
            for p,label in pages:
                try:p.screenshot(path=str(OUT/('failure-'+label+'.png')),full_page=True)
                except Exception:pass
            (OUT/'failure.json').write_text(json.dumps({'checks':checks,'errors':errors,'faults':faults,'trace':traceback.format_exc()},indent=2));raise
        finally:
            browser.close()
            if server:server.shutdown()

if __name__=='__main__':main()
