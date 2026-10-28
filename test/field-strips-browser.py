"""Spec290 real-app journeys. Synthetic notebooks only; no app interception.

FIELD_TEST_URL targets hosted builds. FIELD_ARTIFACTS retains original
screenshots/downloads and receipt. Speech observer forwards native speak calls;
it establishes requests, never audibility or understanding.
"""
import copy
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
OUT = Path(os.environ.get('FIELD_ARTIFACTS', tempfile.mkdtemp(prefix='field-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
checks, contexts, pages, errors, faults = 0, [], [], [], []
VIEW = '[data-field-strips-view]'

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def active(p):
    return p.evaluate("()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")

def book(p):
    return p.evaluate("()=>{const i=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+i));}")

def owner(p):
    return book(p)['fieldStrips']

def entry(p, section, case):
    return next((x for x in owner(p)[section] if x.get('caseId') == case), None)

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
    c.add_init_script('(fixture=>{if(!localStorage.getItem("field-fixture")){for(const [id,seed] of Object.entries(fixture.seeds))localStorage.setItem("number-garden-v1:"+id,JSON.stringify(seed));localStorage.setItem("learning-garden-explorers",JSON.stringify(fixture.registry));localStorage.setItem("field-fixture","1");}})('+json.dumps(fixture)+')')
    c.add_init_script('window.fieldSpeechRequests=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{window.fieldSpeechRequests.push(u.text);return native(u);};}')
    p = c.new_page()
    pages.append((p, label))
    p.set_default_timeout(12000)
    p.on('pageerror', lambda e: errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda m: faults.append({'case': label, 'type': 'console', 'text': m.text}) if m.type == 'error' else None)
    p.on('response', lambda r: faults.append({'case': label, 'type': 'http', 'status': r.status, 'url': r.url}) if r.status >= 400 else None)
    p.on('requestfailed', lambda r: faults.append({'case': label, 'type': 'request', 'error': r.failure, 'url': r.url}) if 'ERR_ABORTED' not in (r.failure or '') else None)
    return p

def go(p, base, route='#studio/field-strips', selector=VIEW):
    p.goto(base + route, wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    identity = active(p)
    choice = p.locator(f'[data-select-explorer="{identity}"]')
    if choice.count():
        choice.click()
    p.locator(selector).wait_for()
    if selector != VIEW and p.locator('dialog.welcome-film[open] [data-film-skip]').count():
        p.locator('dialog.welcome-film[open] [data-film-skip]').click()

def click(p, selector):
    p.locator(selector).first.click()

def snap(p, name):
    p.screenshot(path=str(OUT / (name + '.png')), full_page=True)

def select_case(p, case, tap=False):
    title=next(c['title'] for c in owner(p)['source']['cases'] if c['id']==case)
    loc=p.get_by_role('button',name=title,exact=True,include_hidden=True)
    if not loc.is_visible():
        loc.locator('xpath=ancestor::details[1]').locator('summary').click()
    loc.tap() if tap else loc.click()

def download(p, base, name):
    if p.locator(VIEW).count():
        p.locator(VIEW+' a[href="#notes"]').click()
        p.locator('#download').wait_for()
    else:
        go(p, base, '#notes', '#download')
    with p.expect_download() as d:
        click(p, '#download')
    path = OUT / (name + '.json')
    d.value.save_as(path)
    return json.loads(path.read_text())

def bring(p, base, report):
    go(p, base, '#notes', '#progress-file')
    p.locator('#progress-file').set_input_files({'name': 'synthetic-field-notebook.json', 'mimeType': 'application/json', 'buffer': json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for()
    ok('Field Strips' in p.locator('.import-preview').inner_text(), 'actual import preview identifies optional root')
    click(p, '#progress-import-confirm')
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual confirmed import')

def view(p):
    return p.locator(VIEW)

def plan(p, case):
    return entry(p,'drafts',case) or next(c for c in owner(p)['source']['cases'] if c['id']==case)['initial']

def set_plan(p,case,x,y,tap=False):
    for key,want in [('columnsTaken',x),('rowsTaken',y)]:
        now=plan(p,case)[key]
        for _ in range(abs(want-now)):
            loc=p.locator(f'[data-field-move="{key}"][data-delta="{1 if want>now else -1}"]')
            loc.tap() if tap else loc.click()
    ok((plan(p,case)['columnsTaken'],plan(p,case)['rowsTaken'])==(x,y),'native construction '+case)

def compare(p,tap=False):
    loc=p.locator('[data-field-compare]');loc.tap() if tap else loc.click()

def observation(p,case):return entry(p,'observations',case)
def view(p):return p.locator(VIEW)
def no_film(p,label):ok(p.locator('dialog.welcome-film[open]').count()==0,'no unrelated automatic film '+label)

def open_fold(control):
    if not control.is_visible():
        control.locator('xpath=ancestor::details[1]').locator('summary').click()

def helper(p,key):
    control=p.locator(f'[data-field-helper="{key}"]');open_fold(control);control.click()

def semantic(p):
    fold=p.locator('.field-notes')
    if not fold.evaluate('x=>x.open'):fold.locator('summary').first.click()
    return fold.inner_text()

def bounds(p,first=False):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    bad=p.locator(VIEW+' button,'+VIEW+' a,'+VIEW+' summary').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().width<43.99||x.getBoundingClientRect().height<43.99)).map(x=>({text:x.textContent,w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not bad,'44px native targets '+str(bad))
    board=p.locator('.field-board').first
    ok(board.count()==1,'actual current board')
    sizes=board.locator('p').evaluate_all('xs=>xs.filter(x=>x.getClientRects().length).map(x=>parseFloat(getComputedStyle(x).fontSize))')
    ok(sizes and min(sizes)>=16,'actual current readouts at least16px '+str(sizes))
    svg=board.locator('svg').first
    ok(svg.get_attribute('role')=='img' and svg.locator('title').count()>0 and svg.locator('desc').count()>0,'SVG full accessible title/description')
    labels=svg.locator('text').evaluate_all('xs=>xs.map(x=>({text:x.textContent,size:parseFloat(getComputedStyle(x).fontSize)*Math.abs(x.getScreenCTM().a)}))')
    ok(all(x['size']>=15.99 for x in labels),'rendered SVG text at least16px '+str(labels))
    overlap=board.evaluate('x=>{const a=x.querySelector("svg").getBoundingClientRect();return [...x.querySelectorAll("button")].filter(x=>{const b=x.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top}).map(x=>x.textContent)}')
    ok(not overlap,'field never overlaps controls '+str(overlap))
    if first:
        p.evaluate('scrollTo(0,0)')
        for selector in ['.field-board svg','[data-field-move="columnsTaken"][data-delta="-1"]','[data-field-move="columnsTaken"][data-delta="1"]','[data-field-move="rowsTaken"][data-delta="-1"]','[data-field-move="rowsTaken"][data-delta="1"]','[data-field-compare]']:
            box=p.locator(selector).first.bounding_box()
            ok(box and box['y']>=0 and box['y']+box['height']<=p.viewport_size['height']+1,'first viewport '+selector+' '+str(box))

def art(p,label):
    c=next(c for c in owner(p)['source']['cases'] if c['id']==p.locator('[data-field-case][aria-current="true"]').get_attribute('data-field-case'))
    z=plan(p,c['id']);cells=p.locator('.field-board [data-field-cell]')
    geometry=cells.evaluate_all('xs=>xs.map(x=>({id:x.dataset.fieldCell,first:x.dataset.first,taken:x.dataset.taken,w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))')
    ok(len(geometry)==c['columns']*c['rows'],'actual grid retains every original whole cell')
    ok(sum(x['first']=='true' for x in geometry)==z['columnsTaken']*c['rows'],'first pattern counts full selected columns')
    ok(sum(x['taken']=='true' for x in geometry)==z['columnsTaken']*z['rowsTaken'],'taken hatch counts intersection only')
    ok(max(x['w'] for x in geometry)-min(x['w'] for x in geometry)<.1 and max(x['h'] for x in geometry)-min(x['h'] for x in geometry)<.1,'rendered cells have equal area')
    snap(p,label);p.locator('.field-board').first.screenshot(path=str(OUT/(label+'-board.png')))

def guard(p,transition):
    p.evaluate("window.oldFieldControls=[document.querySelector('[data-field-move]'),document.querySelector('[data-field-compare]'),document.querySelector('[data-field-helper]'),document.querySelector('[data-field-strips-view] [data-speak]')]")
    transition();before=book(p);speech=p.evaluate('fieldSpeechRequests.length')
    p.evaluate('oldFieldControls.forEach(x=>x?.click())')
    ok(book(p)==before and p.evaluate('fieldSpeechRequests.length')==speech,'detached previous edit/Compare/helper/Hear controls inert')

def first_speech(p):
    hear=p.locator(VIEW+' [data-speak]')
    ok(hear.count()==1,'one native Hear control')
    voices=p.evaluate('speechSynthesis.getVoices().filter(v=>v.localService&&/^en(?:[-_]|$)/i.test(v.lang)).length')
    if not voices:
        p.wait_for_timeout(1000)
        voices=p.evaluate('speechSynthesis.getVoices().filter(v=>v.localService&&/^en(?:[-_]|$)/i.test(v.lang)).length')
    hear.click()
    ok(entry(p,'support','half-three-quarters')['narration'] is True,'first Hear records requested support')
    if voices:
        p.wait_for_function('fieldSpeechRequests.length===1')
        text=p.evaluate('fieldSpeechRequests[0]');ok('First amount' in text and 'Taken amount' in text,'first native Hear requests complete current script once')
    else:
        ok(p.evaluate('fieldSpeechRequests.length')==0,'unavailable local voice makes no speech request')
        ok('read together' in view(p).inner_text().lower(),'unavailable voice invites reading together')
    return voices

def journey(browser,base,f,width,height):
    p=setup(browser,width,height,f['base'],'journey-'+str(width),f['base']);go(p,base);no_film(p,'freshload')
    before=book(p);ok('fieldStrips' not in before,'entry does not initialize owner')
    p.locator('[data-field-start]').focus();p.keyboard.press('Enter')
    ok(owner(p)['drafts']==[] and owner(p)['observations']==[],'Open only freezes source')
    ok({k:v for k,v in book(p).items() if k!='fieldStrips'}==before,'Open leaves all sibling roots unchanged')
    bounds(p,width in [820,1024]);art(p,f'entry-{width}')
    first_speech(p)
    for c in owner(p)['source']['cases']:
        case=c['id'];select_case(p,case,tap=True);set_plan(p,case,c['firstTaken'],c['secondTaken'],tap=True);compare(p,tap=True)
        first=copy.deepcopy(observation(p,case)['first'])
        ok([first[k] for k in ['firstResult','secondResult','wholeResult']]==['matches']*3,'actual tap fitting three-result comparison '+case)
        other_x=c['firstTaken']-1 if c['firstTaken'] else 1
        set_plan(p,case,other_x,c['secondTaken'],tap=True);compare(p,tap=True)
        ok(observation(p,case)['latest']['firstResult']=='different','tap revise/check '+case)
        set_plan(p,case,c['firstTaken'],c['secondTaken'],tap=True);compare(p,tap=True)
        ok(observation(p,case)['first']==first,'tap repair preserves first '+case)
        art(p,f'tap-{width}-{case}');bounds(p)
    for case,x,y in [('half-a-field',2,3),('keep-it-all',3,2)]:
        select_case(p,case);set_plan(p,case,x,y);compare(p)
        r=observation(p,case)['latest'];ok([r[k] for k in ['firstResult','secondResult','wholeResult']]==['different','different','matches'],'same product wrong construction native '+case)
        ok('two construction steps' in view(p).inner_text(),'literal final result cautions about construction')
    select_case(p,'half-three-quarters');set_plan(p,'half-three-quarters',2,1)
    checks_before=copy.deepcopy(observation(p,'half-three-quarters'));p.locator('.field-checked-fold summary').click();ok('changed since this comparison' in view(p).inner_text(),'current and retained checked field distinguished')
    draft=copy.deepcopy(owner(p)['drafts'])
    for key in ['equalParts','nested','equivalent','clue']:
        helper(p,key)
        if key!='clue':
            ok('Example field' in view(p).inner_text(),'helper labels actual separate example field')
            click(p,'[data-field-step="1"]');click(p,'[data-field-step="-1"]')
        snap(p,f'helper-{width}-{key}');click(p,'[data-field-close]')
        ok(owner(p)['drafts']==draft,'helper leaves task unchanged '+key)
        ok(p.locator(f'[data-field-helper="{key}"]').evaluate('x=>x===document.activeElement'),'helper restores invoking focus '+key)
    compare(p);count=observation(p,'half-three-quarters')['compareCount'];compare(p);ok(observation(p,'half-three-quarters')['compareCount']==count,'repeat Compare unchanged no-op')
    select_case(p,'half-three-quarters');set_plan(p,'half-three-quarters',3,1);compare(p);set_plan(p,'half-three-quarters',2,1);set_plan(p,'half-three-quarters',3,1)
    ok('Compare when you want to keep this version' not in view(p).inner_text(),'round-trip edit to kept plan never invites no-op Compare')
    first=copy.deepcopy(owner(p));first_id=active(p)
    guard(p,lambda:(click(p,'#explorer-switch'),click(p,'[data-select-explorer="explorer-2"]')));no_film(p,'explorer switch')
    ok('fieldStrips' not in book(p),'separate explorer optional owner absent')
    click(p,'[data-field-start]');select_case(p,'two-thirds-twice');set_plan(p,'two-thirds-twice',2,2);compare(p);second=copy.deepcopy(owner(p))
    click(p,'#explorer-switch');click(p,f'[data-select-explorer="{first_id}"]');no_film(p,'return switch');ok(owner(p)==first,'first explorer isolation')
    guide=p.locator('[data-field-guide-case]').first.locator('xpath=ancestor::details[1]');guide.locator('summary').first.click()
    guide_cases=p.locator('[data-field-guide-case]').evaluate_all('xs=>xs.map(x=>({id:x.dataset.fieldGuideCase,title:x.querySelector("h3").textContent}))')
    ok(guide_cases==[{'id':c['id'],'title':c['title']} for c in first['source']['cases']],'guide attributes supplied context to each frozen title')
    report=download(p,base,'notes-'+str(width));ok(report['fieldStrips']==first and len(report['syntheticOther']['payload'])>=500*1024,'actual UI whole Notes download retains500KiB sibling')
    text=semantic(p);ok('First comparison' in text and 'Latest retry' in text and 'Supplied starting field' in text,'Notes separates supplied/current/first/latest')
    zero=p.locator('[data-field-notes-case="empty-first"]');ok('already fits the request' not in zero.inner_text(),'original zero start(0,0) is not a fitting supplied plan')
    snap(p,'notes-'+str(width));go(p,base);guard(p,lambda:bring(p,base,report));imported_id=active(p);ok(imported_id not in [first_id,'explorer-2'],'actual import creates fresh explorer')
    go(p,base);no_film(p,'import destination');ok(owner(p)==first,'import reload exact owner');again=download(p,base,'redownload-'+str(width));ok(again['fieldStrips']==first and again['syntheticOther']==report['syntheticOther'],'actual redownload exact owner and sibling')
    click(p,'#explorer-switch');click(p,'[data-select-explorer="explorer-2"]');go(p,base);ok(owner(p)==second,'transfer leaves second unchanged')
    go(p,base,'#notes','#reset');click(p,'#reset');click(p,'#confirm-reset');go(p,base);no_film(p,'reset destination');ok('fieldStrips' not in book(p),'confirmed full reset clears selected owner')
    click(p,'#explorer-switch');click(p,f'[data-select-explorer="{first_id}"]');go(p,base);ok(owner(p)==first,'reset preserves other explorer')


def geometry_keyboard(browser,base,f):
    for width,height in [(744,1024),(768,1024),(950,768),(880,900)]:
        p=setup(browser,width,height,f['base'],'geometry-'+str(width));go(p,base);click(p,'[data-field-start]')
        for case,x,y in [('half-three-quarters',0,0),('half-three-quarters',4,2),('keep-it-all',2,3),('empty-first',0,1)]:
            select_case(p,case);set_plan(p,case,x,y);bounds(p);art(p,f'geometry-{width}-{case}-{x}-{y}')
    p=setup(browser,820,1180,f['base'],'keyboard');go(p,base);p.locator('[data-field-start]').focus();p.keyboard.press('Enter')
    for key,count in [('columnsTaken',3),('rowsTaken',1)]:
        for _ in range(count):p.locator(f'[data-field-move="{key}"][data-delta="1"]').focus();p.keyboard.press('Space')
    p.locator('[data-field-compare]').focus();p.keyboard.press('Enter');ok(observation(p,'half-three-quarters')['first']['wholeResult']=='matches','native Enter/Space construction and Compare')
    before=book(p);r=p.evaluate("()=>{const xs=[...document.querySelectorAll('[data-field-move],[data-field-compare],[data-field-helper],[data-field-strips-view] [data-speak]')];location.hash='#notes';const connected=xs[0].isConnected;const speech=fieldSpeechRequests.length;xs.forEach(x=>x.click());return {connected,speech:fieldSpeechRequests.length-speech};}")
    ok(r['connected'] and r['speech']==0 and book(p)==before,'same-block connected stale route controls inert');p.locator('#download').wait_for()
    p=setup(browser,320,800,f['base'],'large-text');go(p,base);click(p,'[data-field-start]');p.add_style_tag(content='html{font-size:24px!important}');ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'enlarged text scrolls without horizontal clipping');snap(p,'large-text')


def retained(browser,base,f):
    p=setup(browser,820,1180,f['uninitialized'],'uninitialized');go(p,base);no_film(p,'truly uninitialized')
    original=copy.deepcopy(f['uninitialized'])
    def without_avatar(s):
        s=copy.deepcopy(s)
        if isinstance(s.get('garden'),dict):
            s['garden'].pop('avatar',None)
            if not s['garden'] and 'garden' not in original:s.pop('garden')
        return s
    ok(without_avatar(book(p))==original,'fresh entry initializes no unrelated activity owners')
    click(p,'[data-field-start]');now=book(p);now.pop('fieldStrips');ok(without_avatar(now)==original,'explicit Open initializes only Field Strips')
    for key in ['unknown','bounds','unreadableDraft','unreadableRecord','unreadableSupport','partialTeaching','unattributed','metadata','contradictory','damaged','unknownHelper']:
        p=setup(browser,820,1180,f[key],key);go(p,base);select_case(p,'half-three-quarters');before=copy.deepcopy(owner(p));text=view(p).inner_text()
        if key in ['unknown','bounds']:
            ok(p.locator('.field-board svg').count()==0,'unknown signature has no current model diagram')
            ok('Compare when you want to keep this version' not in text and 'Choose Working together' not in text,'unsupported models no mutation invitation')
        if key in ['unreadableDraft','unreadableRecord','unreadableSupport','partialTeaching']:
            control=p.locator('[data-field-compare]');ok(control.count()==0 or control.is_disabled(),'unreadable comparison context blocks Compare '+key)
            ok('Compare when you want to keep this version' not in text,'unavailable Compare no keep invitation')
        if key in ['unreadableDraft','unreadableSupport']:
            hear=p.locator(VIEW+' [data-speak]');ok(hear.count()==0 or hear.is_disabled(),'unrecordable/unreadable Hear disabled')
        if key=='unreadableRecord':ok('Earlier comparisons are retained but cannot be read here.' in text and 'No comparison recorded here yet' not in text,'unknown history never absent')
        if key=='partialTeaching':helper(p,'nested');click(p,'[data-field-close]');ok(owner(p)['teaching']['equivalent']=='unknown','readable helper preserves unknown neighbor')
        report=download(p,base,key);notes=semantic(p)
        expected=owner(p);ok(report['fieldStrips']==expected,'retained raw owner actual download '+key)
        if key not in ['partialTeaching']:ok(expected==before,'read-only render/download never alters raw owner '+key)
        if key=='unattributed':ok('Some earlier Field Strips data cannot be read here.' in notes,'Notes discloses unattributed retained section entries')
        if key=='unknownHelper':ok('unknown' in notes.lower(),'missing opened-helper details remain unknown')
        if key in ['unknown','bounds','unreadableDraft']:
            case=p.locator('[data-field-notes-case="half-three-quarters"]');ok(case.count()==1 and 'Current editable field' not in case.inner_text(),'unsupported/unreadable draft never labelled editable in Notes')
        snap(p,key+'-notes')
    for key in ['supplied','smaller']:
        p=setup(browser,820,1180,f[key],key);go(p,base);case='two-thirds-twice' if key=='supplied' else f[key]['fieldStrips']['source']['cases'][0]['id'];select_case(p,case)
        if key=='smaller':
            ok(p.evaluate('window.fieldAttack||0')==0 and p.locator(VIEW+' img,'+VIEW+' script').count()==0,'imported markup is inert literal text')
            ok('<script>window.fieldAttack=2</script>' in view(p).inner_text(),'frozen hostile prompt visibly literal')
            helper(p,'nested');ok('<img src=x' in view(p).inner_text(),'hostile helper remains literal');click(p,'[data-field-close]')
        current=copy.deepcopy(owner(p));report=download(p,base,key+'-notes');semantic(p);loc=p.locator('[data-field-notes-case]').filter(has=p.get_by_text(current['source']['cases'][1 if key=='supplied' else 0]['title'],exact=True))
        ok('This supplied starting field already fits the request' in semantic(p),'retained nonzero supplied fitting plan labelled supplied')
        ok(report['fieldStrips']==current and p.evaluate('window.fieldAttack||0')==0,'hostile quoted IDs/text retained in actual download safely')
        if key=='supplied':
            section=p.locator('[data-field-notes-case="keep-it-all"]');ok('Current editable field' in section.inner_text(),'changed retained source keeps a computed current field')
    for key in ['malformedRoot','malformedTitle','malformedCases']:
        p=setup(browser,820,1180,f[key],key);go(p,base);before=copy.deepcopy(owner(p));report=download(p,base,key);ok(report['fieldStrips']==before,'otherwise import-safe malformed owner remains downloadable '+key);semantic(p);snap(p,key+'-notes')
    p=setup(browser,820,1180,f['refusal'],'actual-report-refusal');go(p,base);before=book(p)
    for selector in ['[data-field-helper="clue"]','[data-field-helper="nested"]',VIEW+' [data-speak]','[data-field-move="columnsTaken"][data-delta="1"]','[data-field-compare]']:
        loc=p.locator(selector);open_fold(loc);loc.click();ok(book(p)==before,'real whole-report refusal '+selector)
    ok(p.evaluate('fieldSpeechRequests.length')==0 and p.locator('[data-field-close]').count()==0,'report refusal precedes speech/helper exposure');snap(p,'actual-report-refusal')


def speech_and_saving(browser,base,f):
    p=setup(browser,820,1180,f['speechTokens'],'speech-tokens');go(p,base);first_speech(p)
    if p.evaluate('fieldSpeechRequests.length'):
        text=p.evaluate('fieldSpeechRequests[0]');(OUT/'speech-tokens.txt').write_text(text)
        ok('Keep 130, v2, 3.5, 1.5 slash 2, 1 slash 2.5, one over one, four over nine and three over eight literal.' in text,'actual final shared speech preserves full numeric and prose tokens')
    # An unavailable-voice runtime is a separate explicit fixture, not a claim about installed voices.
    p=setup(browser,820,1180,f['base'],'no-local-voice');p.context.add_init_script('Object.defineProperty(window.speechSynthesis,"getVoices",{value:()=>[]});');go(p,base);click(p,'[data-field-start]');first_speech(p)
    p=setup(browser,820,1180,f['partial'],'storage-failure');go(p,base);select_case(p,'two-thirds-twice');p.evaluate("()=>{window.originalFieldSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Synthetic storage failure','QuotaExceededError')}}")
    # Storage is intentionally unavailable, so inspect the actual in-memory work through its real download.
    for key,count in [('columnsTaken',2),('rowsTaken',2)]:
        for _ in range(count):click(p,f'[data-field-move="{key}"][data-delta="1"]')
    compare(p);ok('could not save' in view(p).inner_text().lower(),'storage failure disclosed');report=download(p,base,'storage-failure');ok(next(x for x in report['fieldStrips']['observations'] if x['caseId']=='two-thirds-twice')['first']['wholeResult']=='matches','storage-failed memory remains downloadable');p.evaluate('()=>{Storage.prototype.setItem=window.originalFieldSet;}')
    p=setup(browser,820,1180,f['partial'],'save-off');go(p,base,'#notes','#remember');p.locator('#remember').uncheck();p.goto(base+'#studio/field-strips',wait_until='domcontentloaded');view(p).wait_for();choice=p.get_by_role('button',name='A part of two thirds',exact=True,include_hidden=True);open_fold(choice);choice.click()
    for key,count in [('columnsTaken',2),('rowsTaken',2)]:
        for _ in range(count):click(p,f'[data-field-move="{key}"][data-delta="1"]')
    compare(p);ok('Saved progress is off' in view(p).inner_text(),'save-off disclosed');report=download(p,base,'save-off');ok(next(x for x in report['fieldStrips']['observations'] if x['caseId']=='two-thirds-twice')['first']['wholeResult']=='matches','save-off memory remains downloadable')


def main():
    fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {fieldFixtures} from './test/field-strips-checks.mjs';console.log(JSON.stringify(fieldFixtures()));"],cwd=ROOT,text=True))
    server=None;base=os.environ.get('FIELD_TEST_URL')
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
            parts=set(os.environ.get('FIELD_TEST_PARTS','journey,geometry,retained,saving').split(','))
            if 'journey' in parts:
                for width,height in [(820,1180),(1024,768),(320,800)]:journey(browser,base,fixtures,width,height)
            if 'geometry' in parts:geometry_keyboard(browser,base,fixtures)
            if 'retained' in parts:retained(browser,base,fixtures)
            if 'saving' in parts:speech_and_saving(browser,base,fixtures)
            ok(not errors,'no page errors '+json.dumps(errors));ok(not faults,'no browser faults '+json.dumps(faults))
            receipt={'status':'passed','parts':sorted(parts),'checks':checks,'base':base,'viewports':[[820,1180],[1024,768],[320,800],[744,1024],[768,1024],[950,768],[880,900]],'inputCoverage':'Native Chrome taps construct/compare/revise all six; representative Enter/Space. Actual whole Notes download/import/reload/redownload, two explorer/reset, save-off/storage failure,500KiB sibling, whole-report refusals.','speechCoverage':'Speech request observer forwards native synthesis calls. Requests establish requested narration, never audibility or understanding.','pageErrors':errors,'faults':faults,'limits':'Synthetic notebooks only. No physical iPad, Safari, audible-quality or efficacy claim.'}
            (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(f'Field Strips browser: {checks} assertions passed; artifacts {OUT}')
        except Exception:
            # Separate artifact directories preserve first failures and each later run.
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for p,label in pages[-1:]:
                if not p.is_closed():
                    try:snap(p,label+'-failure');(OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception:pass
            raise
        finally:
            for c in contexts:c.close()
            browser.close()
            if server:server.shutdown()
if __name__=='__main__':main()
