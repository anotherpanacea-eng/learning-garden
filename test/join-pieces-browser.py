"""Join the Pieces425: actual-app Chromium with synthetic notebooks.
One native journey and representative responsive/lifecycle samples. Speech is
stubbed locally; this does not qualify audibility, hardware, Safari or learning.
"""
import sys
sys.dont_write_bytecode = True
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from fractions import Fraction
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('JOIN_PIECES_ARTIFACTS') or tempfile.mkdtemp(prefix='lg425-browser-', dir='/private/tmp'))
OUT.mkdir(parents=True, exist_ok=True)
VIEW = '[data-join-root]'
ROUTE = '#workshop/join-pieces'
errors = []
# Independent constructions; source fractions themselves come from Common Cuts.
CUTS = {'half-and-third': ([3], [2]), 'equal-banners': ([2], []),
        'quarter-third': ([3], [2, 2]), 'sixth-quarter': ([2], [3]),
        'quarter-and-third': ([3], [2, 2])}

def ok(value, message):
    assert value, message

def node(code):
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], cwd=ROOT, text=True))

FIXTURE = node("import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';import{commonCases}from'./dist/common-cuts-core.mjs';const seed=initializeExplorerState(freshState());seed.garden.welcomeFilmSeen=true;seed.syntheticSibling={version:999,raw:['invented',73],nested:{future:true}};seed.joinPieces={version:99,opaque:'synthetic unknown saved material'};console.log(JSON.stringify({seed,unseen:freshState(),cases:commonCases}));")

def selector(action, side=None, factor=None):
    return '[data-join-action="'+action+'"]' + (f'[data-join-side="{side}"]' if side else '') + (f'[data-join-factor="{factor}"]' if factor else '')

def act(p, action, side=None, factor=None, key=None):
    q = p.locator(selector(action, side, factor)).first
    if key:
        q.focus()
        p.keyboard.press(key)
    else:
        q.click()
    ok(p.evaluate('document.activeElement!==document.body&&document.activeElement.isConnected&&!document.activeElement.disabled&&document.activeElement.getClientRects().length>0'), 'usable native focus after '+action)

def choose(p, case):
    button = p.locator(f'[data-join-start="{case}"]')
    if button.count():
        if not button.first.is_visible():
            button.first.locator('xpath=ancestor::details[1]').locator('summary').click()
        button.first.click()
    p.locator('[data-join-view="case"]').wait_for()

def go(p, base, route=ROUTE):
    p.goto(base+route, wait_until='networkidle')
    picker = p.locator('[data-select-explorer="explorer-1"]')
    if picker.count():
        picker.click()
    p.locator(VIEW if route == ROUTE else '#download' if route == '#notes' else '#explorer-header').wait_for()

def snapshot(p):
    return p.evaluate('({book:__joinBook(),local:Object.entries(localStorage).sort(),session:Object.entries(sessionStorage).sort()})')

def export(p, base, label):
    go(p, base, '#notes')
    with p.expect_download() as d:
        p.locator('#download').click()
    path = OUT/(label+'.json')
    d.value.save_as(str(path))
    data = json.loads(path.read_text())
    data.pop('exportedAt', None)
    return data

def setup(browser, base, width=820, unseen=False):
    c = browser.new_context(viewport={'width':width,'height':768 if width==1024 else 1180 if width==820 else 850}, has_touch=True, reduced_motion='reduce', accept_downloads=True)
    profiles = [{'id':'explorer-'+str(i),'avatar':a,'color':color,'symbol':s,'createdAt':'2026-11-07T12:00:00Z'} for i,a,color,s in [(1,'sky','blue','leaf'),(2,'fern','gold','acorn')]]
    fixture = {'registry':{'version':1,'activeId':'explorer-1','explorers':profiles}, 'seed': FIXTURE['unseen' if unseen else 'seed']}
    c.add_init_script("""(d=>{if(!localStorage.getItem('join-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem('number-garden-v1:'+e.id,JSON.stringify(d.seed));localStorage.setItem('join-fixture','1');}window.joinSpeech={words:[],cancel:0};window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};speechSynthesis.getVoices=()=>[{name:'Synthetic English',lang:'en-US',localService:true,voiceURI:'synthetic'}];speechSynthesis.speak=u=>joinSpeech.words.push(u.text);speechSynthesis.cancel=()=>joinSpeech.cancel++;})("""+json.dumps(fixture)+')')
    def app(route):
        r = route.fetch()
        body = r.text()
        ok(body.count('let graph=null,') == 1, 'unique actual app notebook getter seam')
        route.fulfill(response=r, body=body.replace('let graph=null,', 'window.__joinBook=()=>structuredClone(state);let graph=null,', 1))
    c.route('**/app.mjs', app)
    p = c.new_page()
    p.set_default_timeout(15000)
    p.on('pageerror', lambda e: errors.append(str(e)))
    p.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    p.on('requestfailed', lambda r: errors.append(f'{r.method} {r.url}: {r.failure}'))
    p.on('response', lambda r: errors.append(f'HTTP {r.status}: {r.url}') if r.status >= 400 else None)
    go(p, base)
    ok(p.locator('dialog.welcome-film[open]').count()==0, 'direct table has no automatic film')
    return c, p

def state(p, example=False):
    scope = p.locator('[data-join-view="'+('example' if example else 'case')+'"]')
    sources = {}
    for side in ['left','right']:
        q = scope.locator(f'[data-join-source="{side}"]')
        sources[side] = {key:int(q.get_attribute('data-'+key)) for key in ['remaining','moved','denominator']}
    q = scope.locator('[data-join-output]')
    return {'sources':sources,'count':int(q.get_attribute('data-count')),'denominator':q.get_attribute('data-denominator')}

def geometry(p, original, example=False):
    scope = p.locator('[data-join-view="'+('example' if example else 'case')+'"]')
    s = state(p, example)
    references = scope.locator('.join-original svg').evaluate_all('xs=>xs.map(e=>{const box=s=>{const b=e.querySelector(s).getBoundingClientRect();return {x:b.x,y:b.y,w:b.width}};return {side:e.dataset.commonRow,whole:box("[data-common-whole]"),shade:box("[data-common-shade]")}})')
    ok(len(references)==2, 'two original reference ribbons')
    whole = references[0]['whole']
    for ref in references:
        f = original[ref['side']]
        ok(abs(ref['shade']['w']/ref['whole']['w']-f['numerator']/f['denominator'])<.0001, 'fixed original shaded endpoint')
        ok(abs(ref['whole']['w']-whole['w'])<.2 , 'original wholes share scale')
    for side in ['left','right']:
        a = s['sources'][side]
        f = original[side]
        ok(Fraction(a['remaining']+a['moved'],a['denominator'])==Fraction(f['numerator'],f['denominator']), 'source conservation '+side)
        tray = scope.locator(f'svg[data-join-tray="{side}"]')
        g = tray.evaluate('e=>{const box=x=>{const b=x.getBoundingClientRect();return {x:b.x,w:b.width}};return {whole:box(e.querySelector("[data-join-whole]")),filled:[...e.querySelectorAll("[data-join-piece]:not([data-moved])")].map(box),moved:[...e.querySelectorAll("[data-moved]")].map(box)}}')
        ok(abs(g['whole']['w']-whole['w'])<.2 and abs(g['whole']['x']-next(r['whole']['x'] for r in references if r['side']==side))<.2, 'tray uses reference whole scale/edge')
        ok(len(g['filled'])==a['remaining'] and len(g['moved'])==a['moved'], 'available and outlined slots match source counts')
        for i, b in enumerate(g['filled']):
            ok(abs(b['w']-whole['w']/a['denominator'])<.3 and abs(b['x']-g['whole']['x']-i*whole['w']/a['denominator'])<.3, 'remaining pieces are exact prefix, highest slots empty first')
    ok(sum(a['moved'] for a in s['sources'].values())==s['count'], 'output count equals all source moves')
    strips = scope.locator('[data-join-output] svg[data-join-strip]').evaluate_all('xs=>xs.map(e=>{const b=e.querySelector("[data-join-whole]").getBoundingClientRect();return {x:b.x,w:b.width,pieces:[...e.querySelectorAll("[data-join-piece]")].map(p=>{const r=p.getBoundingClientRect();return {x:r.x,w:r.width,source:p.dataset.source}})}})')
    d = int(s['denominator']) if s['denominator'] else None
    ok(len(strips)==(2 if d and s['count']>d else 1 if d else 0), 'second whole appears only beyond one')
    ok(sum(len(g['pieces']) for g in strips)==s['count'], 'actual output geometry counts transferred pieces')
    for g in strips:
        ok(abs(g['w']-whole['w'])<.2 and abs(g['x']-whole['x'])<.2, 'output whole retains reference scale/edge')
        for i, b in enumerate(g['pieces']):
            ok(abs(b['w']-whole['w']/d)<.3 and abs(b['x']-g['x']-i*whole['w']/d)<.3 and b['source'] in ['A','B'], 'equal output unit with source identity')
    return s

def layout(p, label):
    p.screenshot(path=str(OUT/(label+'.png')), full_page=True)
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow '+label)
    bad = p.locator(VIEW+' button,'+VIEW+' a,'+VIEW+' summary').evaluate_all('xs=>xs.filter(e=>!e.closest(".speech-controls,drawn-howto")&&e.checkVisibility()&&(e.getBoundingClientRect().width<43.5||e.getBoundingClientRect().height<43.5||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>e.outerHTML.slice(0,100))')
    ok(not bad, '44px native targets and16px text '+str(bad))

def speech(p):
    p.evaluate('joinSpeech.words=[]')
    p.locator(VIEW+' [data-speak]').click()
    words = p.evaluate('joinSpeech.words')
    ok(len(words)==1, 'first native Hear requests exactly one local utterance')
    return words[0]

def journey(browser, base):
    print('425: five-case native actual-app journey', flush=True)
    c,p = setup(browser, base)
    try:
        before_export = export(p, base, 'notes-before')
        go(p, base)
        before = snapshot(p)
        for case in FIXTURE['cases']:
            choose(p, case['id'])
            geometry(p, case)
            ok(p.locator(selector('move','left')).is_disabled() and p.locator(selector('move','right')).is_disabled(), 'unmatched moves disabled')
            ok('Different-sized pieces' in p.locator(VIEW).inner_text(), 'specific unequal-unit reason')
            act(p,'reference')
            ref = p.locator('[data-join-reference]').inner_text()
            ok('first make equal-sized pieces' in ref and '=' not in ref, 'unmatched reference supplies no total or recut')
            for side, factors in zip(['left','right'], CUTS[case['id']]):
                for factor in factors:
                    act(p,'split',side,factor, key='Enter' if side=='left' else 'Space')
            s = geometry(p, case)
            d = s['sources']['left']['denominator']
            ok(d==s['sources']['right']['denominator'], 'native cuts construct shared unit')
            full = sum(Fraction(case[side]['numerator'],case[side]['denominator']) for side in ['left','right'])
            total = int(full*d)
            act(p,'move','left')
            partial = geometry(p,case)
            ok(partial['count']==1 and 'Both lengths are joined.' not in p.locator(VIEW).inner_text(), 'one move means partial work')
            ok(p.locator(selector('split','left',2)).is_disabled() and p.locator(selector('uncut','left')).is_disabled(), 'cuts locked during transfers')
            ok('Return the joined pieces before changing the cuts.' in p.locator(VIEW).inner_text(), 'visible cutting lock reason')
            act(p,'reference')
            ok(f'= {total}/{d}' in p.locator('[data-join-reference]').inner_text() and state(p)['count']==1, 'full supplied reference stays separate from partial output')
            if case['id']=='half-and-third':
                words=speech(p)
                ok('Reference — the whole sum.' in words and '5 sixths' in words and 'Joined so far: 1 sixth' in words, 'Hear includes opened reference and distinct actual partial output')
            act(p,'undo')
            ok(geometry(p,case)['sources']['left']['moved']==0, 'Undo refills exact highest slot')
            ok(p.locator('[data-join-reference]').count()==0, 'material change closes reference')
            # Interleave sources. Count/geometry oracle is independent of the core model.
            remaining = {side:state(p)['sources'][side]['remaining'] for side in ['left','right']}
            order = []
            while any(remaining.values()):
                for side in ['right','left']:
                    if remaining[side]:
                        act(p,'move',side)
                        remaining[side]-=1
                        order.append('A' if side=='left' else 'B')
                        g = state(p)
                        if len(order) in [d,d+1,total]:geometry(p,case)
                        ok(g['count']==len(order), 'native move adds exactly one piece')
                        got = p.locator('[data-join-view="case"] [data-join-output] svg[data-join-strip] [data-join-piece]').evaluate_all('xs=>xs.map(e=>e.dataset.source)')
                        ok(got==order, 'joined pieces keep actual interleaving order')
                        if len(order)==d:
                            ok(p.locator('[data-join-output] svg[data-join-strip]').count()==1 and '0 more pieces' in p.locator(VIEW).inner_text(), 'exactly one whole keeps second strip absent and names zero more')
            ok('Both lengths are joined.' in p.locator(VIEW).inner_text() and f'= {total}/{d}' in p.locator(VIEW).inner_text(), 'completed supplied addition visible without reference')
            ok(all(p.locator(selector('move',side)).is_disabled() for side in ['left','right']), 'empty source controls disabled')
            if case['id']=='quarter-third':
                layout(p,'joined-820')
            while order:
                last = order.pop()
                prior = state(p)
                act(p,'undo')
                after = state(p)
                side = 'left' if last=='A' else 'right'
                ok(after['sources'][side]['remaining']==prior['sources'][side]['remaining']+1, 'Undo returns last contributing source')
            act(p,'move','left');act(p,'move','right');act(p,'return')
            ok(state(p)['count']==0 and state(p)['sources']['left']['denominator']==d, 'Return restores trays and preserves cuts')
            if case['id']=='equal-banners':
                act(p,'split','left',2);act(p,'split','right',2)
                ok(state(p)['sources']['left']['denominator']==12, 'related case also accepts twelfths')
                act(p,'move','right');geometry(p,case);act(p,'return')
        choose(p,'equal-banners')
        ok(state(p)['sources']['left']['denominator']==12, 'case selection preserves each job within visit')
        act(p,'move','left');live = state(p)
        act(p,'example')
        example = {'left':{'numerator':1,'denominator':2},'right':{'numerator':1,'denominator':4}}
        for frame, count in enumerate([0,0,2,3,3]):
            if frame:act(p,'next')
            ex = geometry(p,example,True)
            ok(ex['count']==count, 'manual example actual moved count '+str(frame+1))
            words = speech(p)
            ok('8 twelfths' not in words and '16 twelfths' not in words, 'example speech excludes live material')
            if frame<4:ok('Adding the tops' not in words and '2 sixths' not in words, 'earlier frame speech excludes later false claim')
            if frame==4:
                ok('Different claim: 2/6' in p.locator('[data-join-view="example"]').inner_text(), 'fifth frame contrast explicitly separate')
                claim=p.locator('.join-claim')
                ok(claim.locator('[data-source]').count()==0 and not claim.locator('svg text').evaluate_all("xs=>xs.some(e=>/^[AB]$/.test(e.textContent.trim()))"), 'false claim has neutral units without source A/B identity')
                false=p.locator('.join-claim svg').evaluate('e=>{const whole=e.querySelector("[data-join-whole]").getBoundingClientRect();const pieces=[...e.querySelectorAll("[data-join-piece]")].map(x=>x.getBoundingClientRect().width);return {whole:whole.width,pieces,cuts:e.querySelectorAll(".join-cut").length}}')
                true_whole=p.locator('[data-join-output] [data-join-whole]').evaluate('e=>e.getBoundingClientRect().width')
                ok(false['cuts']==5 and len(false['pieces'])==2 and abs(false['whole']-true_whole)<.2 and abs(sum(false['pieces'])/true_whole-1/3)<.0001, 'false sixths use same scale and are shorter than original half')
                layout(p,'example-820')
        act(p,'previous');act(p,'back')
        ok(state(p)==live, 'example leaves live cuts/moves intact')
        act(p,'example');ok(state(p,True)['count']==0, 'reopening example resets only its frame');act(p,'back')
        words = speech(p)
        ok('1 twelfth' in words and 'Adding the tops' not in words and 'Why does the piece size' not in words, 'first live Hear speaks current unit and excludes closed teaching/disclosures')
        details = p.locator('[data-join-panel]').all()
        for detail in details:
            summary = detail.locator('summary')
            initial=detail.evaluate('e=>e.open')
            summary.click();summary.click()
            ok(detail.evaluate('e=>e.open')==initial, 'native disclosure can close and reopen')
        talk=p.locator('[data-join-panel="talk"]')
        talk.locator('summary').click()
        ok('Why does the piece size' in speech(p), 'opened native disclosure enters current narration')
        talk.locator('summary').click()
        # Use a fresh current enabled action after real disclosure changes.
        act(p,'return');act(p,'move','right')
        ok(state(p)['count']==1, 'native disclosure close/reopen does not retire material controls')
        ok(snapshot(p)==before, 'actual notebook memory and complete local/session storage unchanged by all play')
        ok(export(p,base,'notes-after')==before_export, 'real Notes downloads unchanged except exportedAt')
        go(p,base);p.locator('[data-join-view="chooser"]').wait_for()
        choose(p,'half-and-third');act(p,'split','left',3);p.reload(wait_until='networkidle');go(p,base)
        p.locator('[data-join-view="chooser"]').wait_for()
        choose(p,'half-and-third');ok(state(p)['sources']['left']['denominator']==2, 'reload starts fresh transient material')
    finally:c.close()


def dispatch(handle):
    handle.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')

def lifecycle(browser,base):
    print('425: enabled stale controls and real owner transitions', flush=True)
    for mutation in ['hidden','inert','style','root']:
        c,p=setup(browser,base)
        try:
            choose(p,'half-and-third')
            speech(p)
            old=p.locator(selector('split','left',3)).element_handle()
            read=p.locator(VIEW+' [data-speak]').element_handle()
            ok(old.is_enabled(), 'retirement probe uses effective enabled cut')
            changes={'hidden':'e.hidden=true;e.hidden=false','inert':'e.inert=true;e.inert=false','style':'e.style.display="none";e.style.removeProperty("display")','root':'e=document.querySelector("[data-join-root]");const parent=e.parentNode,next=e.nextSibling;e.remove();parent.insertBefore(e,next)'}
            old.evaluate('e=>{'+changes[mutation]+'}')
            if mutation!='root':read.evaluate('e=>{'+changes[mutation]+'}')
            before=state(p);saved=snapshot(p);voice=p.evaluate('JSON.stringify(joinSpeech)')
            dispatch(old);dispatch(read)
            ok(state(p)==before and snapshot(p)==saved and p.evaluate('JSON.stringify(joinSpeech)')==voice, 'restored '+mutation+' cut/Hear stays retired')
            stop=p.locator('[data-stop-speech]').first
            stop.click()
            ok(p.evaluate('joinSpeech.cancel')>json.loads(voice)['cancel'], 'global voice Stop retains independent ownership')
            go(p,base,'#notes');go(p,base);choose(p,'half-and-third');act(p,'split','left',3)
            ok(state(p)['sources']['left']['denominator']==6, 'subsequent legitimate fresh binding still works')
        finally:c.close()
    c,p=setup(browser,base)
    try:
        choose(p,'half-and-third')
        old=p.locator(selector('split','left',3)).element_handle();read=p.locator(VIEW+' [data-speak]').element_handle()
        choose(p,'quarter-and-third')
        before=state(p);voice=p.evaluate('JSON.stringify(joinSpeech)');dispatch(old);dispatch(read)
        ok(state(p)==before and p.evaluate('JSON.stringify(joinSpeech)')==voice, 'old enabled case callbacks inert')
        choose(p,'half-and-third');act(p,'split','left',2)
        ok(state(p)['sources']['left']['denominator']==4, 'old case callback did not secretly cut cached material')
        stale=p.locator(selector('split','left',3)).element_handle();act(p,'split','right',2)
        before=state(p);dispatch(stale);ok(state(p)==before, 'old material snapshot enabled cut cannot act')
        old=p.locator(selector('uncut','left')).element_handle();read=p.locator(VIEW+' [data-speak]').element_handle()
        before=snapshot(p);words=p.evaluate('joinSpeech.words.slice()')
        p.evaluate("()=>{window.joinOld=[document.querySelector('[data-join-action=uncut][data-join-side=left]'),document.querySelector('[data-join-root] [data-speak]')];location.hash='#notes';joinOld.forEach(e=>e.click())}")
        p.locator('#download').wait_for()
        ok(snapshot(p)==before and p.evaluate('joinSpeech.words')==words, 'same-tick route departure refuses old cut and Hear')
        go(p,base);p.locator('[data-join-view="chooser"]').wait_for()
        p.evaluate("()=>{location.hash='#numbers';location.hash='#workshop/join-pieces'}")
        p.locator('[data-join-view="chooser"]').wait_for()
        for operation in ['chooser','owner','import','reset']:
            choose(p,'half-and-third');act(p,'split','left',3)
            old=p.locator(selector('uncut','left')).element_handle();read=p.locator(VIEW+' [data-speak]').element_handle()
            if operation in ['chooser','owner']:
                p.locator('#explorer-switch').click()
                if operation=='chooser':
                    p.locator('[data-select-explorer="explorer-1"]').click()
                else:p.locator('[data-select-explorer="explorer-2"]').click()
            elif operation=='import':
                other=p.evaluate("()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return Object.entries(localStorage).filter(([k])=>k.startsWith('number-garden-v1:')&&k!=='number-garden-v1:'+id)}")
                go(p,base,'#notes')
                p.locator('#progress-file').set_input_files({'name':'synthetic-join.json','mimeType':'application/json','buffer':json.dumps(FIXTURE['seed']).encode()})
                p.locator('#progress-import-confirm').click()
                p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
            else:
                other=p.evaluate("()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return Object.entries(localStorage).filter(([k])=>k.startsWith('number-garden-v1:')&&k!=='number-garden-v1:'+id)}")
                go(p,base,'#notes');p.locator('#reset').click();p.locator('#confirm-reset').click()
                p.wait_for_function("location.hash==='#home'")
                film=p.locator('dialog.welcome-film[open]')
                film.wait_for();film.locator('[data-film-skip]').click()
            if operation in ['import','reset']:
                ok(p.evaluate('entries=>entries.every(([k,v])=>localStorage.getItem(k)===v)',other), 'confirmed '+operation+' preserves other explorer notebook exactly')
            go(p,base);p.locator('[data-join-view="chooser"]').wait_for();choose(p,'half-and-third')
            ok(state(p)['sources']['left']['denominator']==2, 'actual '+operation+' resets visit')
            # Make Undo effective in the new visit, then deliver the old enabled Undo.
            act(p,'split','left',3)
            before=state(p);saved=snapshot(p);voice=p.evaluate('JSON.stringify(joinSpeech)')
            dispatch(old);dispatch(read)
            ok(state(p)==before and snapshot(p)==saved and p.evaluate('JSON.stringify(joinSpeech)')==voice, 'obsolete '+operation+' controls cannot affect new visit')
            act(p,'uncut','left');ok(state(p)['sources']['left']['denominator']==2, 'current Undo remains effective after '+operation)
            go(p,base,'#notes');go(p,base)
    finally:c.close()


def responsive_and_unseen(browser,base):
    for width in [320,1024]:
        c,p=setup(browser,base,width)
        try:
            choose(p,'quarter-third')
            for side,steps in zip(['left','right'],CUTS['quarter-third']):
                for factor in steps:act(p,'split',side,factor)
            for _ in range(9):act(p,'move','left')
            for _ in range(4):act(p,'move','right')
            geometry(p,next(c for c in FIXTURE['cases'] if c['id']=='quarter-third'))
            layout(p,'joined-'+str(width))
        finally:c.close()
    c,p=setup(browser,base,unseen=True)
    try:
        expected=json.loads(json.dumps(FIXTURE['unseen']))
        # Explorer selection owns only the existing avatar normalization.
        actual=snapshot(p)['book'];actual.get('garden',{}).pop('avatar',None);expected.get('garden',{}).pop('avatar',None)
        if not actual.get('garden') and 'garden' not in expected:actual.pop('garden',None)
        ok(actual==expected, 'unseen direct entry initializes no unrelated owner')
        before=snapshot(p);choose(p,'half-and-third');act(p,'split','left',3)
        ok(snapshot(p)==before, 'unseen native play adds no notebook or storage records')
    finally:c.close()

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

class Server(http.server.ThreadingHTTPServer):
    request_queue_size=128
    daemon_threads=True


def main():
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}/'
    print('Artifacts: '+str(OUT),flush=True)
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
            try:
                journey(browser,base);lifecycle(browser,base);responsive_and_unseen(browser,base)
                ok(not errors,'no browser/request/console errors '+str(errors))
                receipt={'status':'passed','scope':__doc__,'artifacts':str(OUT)}
                (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2))
                print(json.dumps(receipt),flush=True)
            except Exception:
                for p in browser.contexts:
                    for page in p.pages:
                        try:page.screenshot(path=str(OUT/'failure.png'),full_page=True)
                        except Exception:pass
                (OUT/'failure.txt').write_text(traceback.format_exc()+'\n'+json.dumps(errors,indent=2))
                raise
            finally:browser.close()
    finally:server.shutdown();server.server_close()

if __name__=='__main__':main()
