"""Spec289 real-app journeys. Synthetic notebooks only; no app interception.

GAP_TEST_URL targets hosted builds. GAP_ARTIFACTS retains original
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
OUT = Path(os.environ.get('GAP_ARTIFACTS', tempfile.mkdtemp(prefix='gap-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
checks, contexts, pages, errors, faults = 0, [], [], [], []
VIEW = '[data-gap-line-view]'

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def active(p):
    return p.evaluate("()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")

def book(p):
    return p.evaluate("()=>{const i=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+i));}")

def owner(p):
    return book(p)['gapLine']

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
    c.add_init_script('(fixture=>{if(!localStorage.getItem("gap-fixture")){for(const [id,seed] of Object.entries(fixture.seeds))localStorage.setItem("number-garden-v1:"+id,JSON.stringify(seed));localStorage.setItem("learning-garden-explorers",JSON.stringify(fixture.registry));localStorage.setItem("gap-fixture","1");}})('+json.dumps(fixture)+')')
    c.add_init_script('window.gapSpeechRequests=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{window.gapSpeechRequests.push(u.text);return native(u);};}')
    p = c.new_page()
    pages.append((p, label))
    p.set_default_timeout(12000)
    p.on('pageerror', lambda e: errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda m: faults.append({'case': label, 'type': 'console', 'text': m.text}) if m.type == 'error' else None)
    p.on('response', lambda r: faults.append({'case': label, 'type': 'http', 'status': r.status, 'url': r.url}) if r.status >= 400 else None)
    p.on('requestfailed', lambda r: faults.append({'case': label, 'type': 'request', 'error': r.failure, 'url': r.url}) if 'ERR_ABORTED' not in (r.failure or '') else None)
    return p

def go(p, base, route='#desk/gaps', selector=VIEW):
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
    loc = p.locator(f'[data-gap-case="{case}"]')
    if not loc.is_visible():
        rail = p.locator(VIEW + ' details').filter(has=p.locator(f'[data-gap-case="{case}"]'))
        if rail.count() and not rail.get_attribute('open'):
            rail.locator('summary').click()
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
    p.locator('#progress-file').set_input_files({'name': 'synthetic-gap-notebook.json', 'mimeType': 'application/json', 'buffer': json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for()
    ok('Gap Line' in p.locator('.import-preview').inner_text(), 'actual import preview identifies optional root')
    click(p, '#progress-import-confirm')
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual confirmed import')

def view(p):
    return p.locator(VIEW)

def plan(p, case):
    draft=entry(p,'drafts',case)
    return draft or next(c for c in owner(p)['source']['cases'] if c['id']==case)['initial']

def set_plan(p, case, end, split=False, show=False, tap=False):
    source=next(c for c in owner(p)['source']['cases'] if c['id']==case)
    now=plan(p,case)['endHalf']
    for _ in range(abs(end-now)//source['stepHalf']):
        loc=p.locator('[data-gap-move="'+str(1 if end>now else -1)+'"]')
        loc.tap() if tap else loc.click()
    for key,value in [('split',split),('showMove',show)]:
        loc=p.locator('[data-gap-presentation="'+key+'"]')
        if loc.is_checked()!=value:
            loc.tap() if tap else loc.click()
    ok(plan(p,case)['endHalf']==end,'native controls reach actual end '+case)

def observation(p,case):
    return entry(p,'observations',case)

def compare(p):
    click(p,'[data-gap-compare]')

def bounds(p, first=False):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
    bad=p.locator(VIEW+' button,'+VIEW+' a,'+VIEW+' summary').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent,w:x.offsetWidth,h:x.offsetHeight,font:getComputedStyle(x).fontSize}))")
    ok(not bad,'44px actions and16px text '+str(bad))
    overlap=p.locator('.gap-board').evaluate('board=>{const a=board.querySelector("svg").getBoundingClientRect();return [...board.querySelectorAll("button,label")].filter(x=>{const b=x.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top}).map(x=>x.textContent)}')
    ok(not overlap,'material rail never overlaps native controls '+str(overlap))
    fonts=p.locator('.gap-board .gap-axis text').evaluate_all('xs=>xs.filter(x=>!x.closest("[data-gap-marker]")).map(x=>({text:x.textContent,size:parseFloat(getComputedStyle(x).fontSize)*x.getScreenCTM().a}))')
    ok(fonts and all(x['size']>=15.99 for x in fonts),'major axis labels physically16px '+str(fonts))
    markers=p.locator('.gap-board [data-gap-marker]')
    ok(markers.count()==3,'three separately named source/current markers')
    geometry=markers.evaluate_all('xs=>xs.map(x=>{const shape=x.dataset.gapMarker==="A"?x.querySelector("circle"):x.dataset.gapMarker==="B"?x.querySelector("path:last-of-type"):x.querySelector("path");const r=shape.getBoundingClientRect(),a=x.closest("figure").getBoundingClientRect();return {key:x.dataset.gapMarker,x:r.x,y:r.y,w:r.width,h:r.height,left:a.left,right:a.right,top:a.top,bottom:a.bottom}})')
    ok(all(g['x']>=g['left']-.5 and g['x']+g['w']<=g['right']+.5 and g['y']>=g['top']-.5 and g['y']+g['h']<=g['bottom']+.5 for g in geometry),'all markers remain inside their material figure '+str(geometry))
    for i,a in enumerate(geometry):
        for b in geometry[i+1:]:
            ok(not(a['x']<b['x']+b['w'] and a['x']+a['w']>b['x'] and a['y']<b['y']+b['h'] and a['y']+a['h']>b['y']),'marker shapes remain distinct at coincidence')
    if first:
        p.evaluate('scrollTo(0,0)')
        for selector in ['[data-gap-move="-1"]','[data-gap-move="1"]','[data-gap-compare]','[data-gap-presentation="split"]','[data-gap-presentation="showMove"]']:
            r=p.locator(selector).bounding_box()
            ok(r and r['y']>=0 and r['y']+r['height']<=p.viewport_size['height']+1,'first viewport '+selector+' '+str(r))

def art(p,name):
    snap(p,name)
    board=p.locator('.gap-board').first
    ok(board.count()==1,'actual board exists for readable scoped screenshot')
    board.screenshot(path=str(OUT/(name+'-board.png')))

def helper(p,key):
    loc=p.locator(f'[data-gap-helper="{key}"]')
    if not loc.is_visible():
        fold=loc.locator('xpath=ancestor::details[1]');fold.locator('summary').click()
    loc.click()

def guard_controls(p,transition):
    ok(p.locator('[data-gap-compare]').count()>0 and p.locator('[data-gap-move]').count()>0,'capture actual active controls before transition')
    p.evaluate("window.oldGapControls=[document.querySelector('[data-gap-compare]'),document.querySelector('[data-gap-move]'),document.querySelector('[data-gap-helper]'),document.querySelector('[data-gap-line-view] [data-speak]')]")
    transition()
    before=book(p);speech=p.evaluate('gapSpeechRequests.length')
    p.evaluate('oldGapControls.forEach(x=>x?.click())')
    ok(book(p)==before and p.evaluate('gapSpeechRequests.length')==speech,'detached old Compare/edit/help/Hear controls inert')

def same_block_exit(p,base):
    before=owner(p)
    result=p.evaluate("""()=>{const xs=[document.querySelector('[data-gap-compare]'),document.querySelector('[data-gap-move]'),document.querySelector('[data-gap-helper]'),document.querySelector('[data-gap-line-view] [data-speak]')];const speech=gapSpeechRequests.length;location.hash='#notes';const connected=xs[0].isConnected;xs.forEach(x=>x?.click());const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return {connected,owner:JSON.parse(localStorage.getItem('number-garden-v1:'+id)).gapLine,speech:gapSpeechRequests.length-speech};}""")
    ok(result['connected'],'same-block old controls still connected before rerender')
    ok(result['owner']==before and result['speech']==0,'hash guard refuses connected old controls before route render')
    p.locator('#download').wait_for();go(p,base)

def semantic(p):
    fold=p.locator('.gap-notes')
    if not fold.get_attribute('open'):fold.locator('summary').first.click()
    return fold.inner_text()

def basic_journey(browser,base,f,width,height):
    p=setup(browser,width,height,f['base'],'journey-'+str(width),f['base']);go(p,base)
    before=book(p);ok('gapLine' not in before,'read-only entry leaves owner absent')
    p.locator('[data-gap-start]').focus();p.keyboard.press('Enter')
    ok(owner(p)['drafts']==[] and owner(p)['observations']==[],'Open freezes source only')
    ok({k:v for k,v in book(p).items() if k!='gapLine'}==before,'Open changes only optional owner')
    goals={'guided-cross':18,'same-below':-16,'reverse':-8,'positive':16,'coincident':-6,'halves':4}
    widths={}
    for case,end in goals.items():
        select_case(p,case);bounds(p,width>320);set_plan(p,case,end,True,True);compare(p)
        r=observation(p,case)['first'];ok([r['endResult'],r['lengthResult']]==['meets','matches'],'native fitting Compare '+case)
        c=next(c for c in owner(p)['source']['cases'] if c['id']==case)
        pieces=p.locator('.gap-board [data-gap-piece]')
        ok(pieces.count()==abs(end-c['fromHalf'])//c['stepHalf'],'actual equal pieces count intervals '+case)
        if pieces.count():widths[case]=pieces.first.bounding_box()['width']
        art(p,f'journey-{width}-{case}')
    ok(abs(widths['guided-cross']/2-widths['halves'])<1,'half pieces retain same whole-unit reference')
    select_case(p,'guided-cross');set_plan(p,'guided-cross',16,True,True)
    checked=copy.deepcopy(observation(p,'guided-cross'))
    ok('changed since this comparison' in view(p).inner_text(),'current draft distinguished from retained checked ruler')
    go(p,base);select_case(p,'guided-cross');ok(plan(p,'guided-cross')['endHalf']==16 and observation(p,'guided-cross')==checked,'reload keeps checked/draft distinct')
    unchanged=copy.deepcopy(owner(p)['drafts'])
    for key in ['crossing','sameBelow','halves','clue']:
        helper(p,key)
        if key!='clue':
            p.locator('[data-gap-step="1"]').click()
            ok('Example ruler' in view(p).inner_text(),'worked material labelled supplied example')
        snap(p,f'helper-{width}-{key}');click(p,'[data-gap-close]')
        ok(owner(p)['drafts']==unchanged,'helper preserves actual draft '+key)
        ok(p.locator('[data-gap-helper="'+key+'"]').evaluate('x=>document.activeElement===x'),'helper return focus '+key)
    click(p,VIEW+' [data-speak]');click(p,VIEW+' [data-speak]')
    spoken=p.evaluate('gapSpeechRequests.at(-1)')
    ok(p.evaluate('gapSpeechRequests.length')==2,'native Hear invoked twice')
    ok('changed since this comparison' in spoken,'Hear retains checked/draft distinction')
    ok('½' not in spoken and '−' not in spoken,'Hear converts numeric glyphs')
    compare(p);count=observation(p,'guided-cross')['compareCount'];compare(p)
    ok(observation(p,'guided-cross')['compareCount']==count,'identical latest Compare no-op')
    guard_controls(p,lambda:select_case(p,'positive'));select_case(p,'guided-cross');same_block_exit(p,base)
    select_case(p,'guided-cross');first_id=active(p);first=copy.deepcopy(owner(p))
    guard_controls(p,lambda:(click(p,'#explorer-switch'),click(p,'[data-select-explorer="explorer-2"]')))
    ok('gapLine' not in book(p),'second explorer has no optional owner')
    click(p,'[data-gap-start]');select_case(p,'same-below');set_plan(p,'same-below',-16);compare(p);second=copy.deepcopy(owner(p))
    click(p,'#explorer-switch');click(p,'[data-select-explorer="'+first_id+'"]');go(p,base)
    ok(owner(p)==first,'first explorer restored')
    report=download(p,base,'notes-'+str(width));ok(report['gapLine']==first and len(report['syntheticOther']['payload'])>=500*1024,'actual whole Notes download includes owner and500KiB sibling')
    text=semantic(p);ok(p.locator('.gap-notes #gap-checked-focus,.gap-notes [role="status"],.gap-notes [aria-live]').count()==0,'Notes has no repeated main focus/live regions');ok('Guided example supplied' in text and 'supplied zero-length ruler already fits' in text,'Notes derives supplied context with help flags independent')
    snap(p,'notes-'+str(width));p.locator('.gap-notes').screenshot(path=str(OUT/f'notes-{width}-section.png'))
    go(p,base);guard_controls(p,lambda:bring(p,base,report));imported_id=active(p);ok(imported_id not in [first_id,'explorer-2'],'actual import creates separate explorer')
    go(p,base);ok(owner(p)==first,'import and reload keep exact owner')
    again=download(p,base,'redownload-'+str(width));ok(again['gapLine']==first and again['syntheticOther']==report['syntheticOther'],'actual redownload exact owner and sibling')
    click(p,'#explorer-switch');click(p,'[data-select-explorer="explorer-2"]');go(p,base);ok(owner(p)==second,'transfer leaves second explorer unchanged')
    go(p,base,'#notes','#reset');click(p,'#reset');click(p,'#confirm-reset')
    film=p.locator('dialog.welcome-film[open] [data-film-skip]')
    if film.count():film.click()
    go(p,base);ok('gapLine' not in book(p),'confirmed reset removes selected owner')
    click(p,'#explorer-switch');click(p,'[data-select-explorer="'+first_id+'"]');go(p,base);ok(owner(p)==first,'scoped reset preserves other explorer')

def inputs_and_geometry(browser,base,f):
    goals={'guided-cross':18,'same-below':-16,'reverse':-8,'positive':16,'coincident':-6,'halves':4}
    p=setup(browser,768,1024,f['base'],'tap-six');go(p,base);p.locator('[data-gap-start]').tap()
    for case,end in goals.items():
        select_case(p,case,tap=True);set_plan(p,case,end,True,True,tap=True);p.locator('[data-gap-compare]').tap()
        first=copy.deepcopy(observation(p,case)['first']);ok(first['endResult']=='meets' and first['lengthResult']=='matches','actual tap fits '+case)
        p.locator('[data-gap-move="1"]').tap();p.locator('[data-gap-compare]').tap();ok(observation(p,case)['latest']['endResult']=='different','tap checks wrong end '+case)
        p.locator('[data-gap-move="-1"]').tap();p.locator('[data-gap-compare]').tap();ok(observation(p,case)['first']==first and observation(p,case)['latest']['endResult']=='meets','tap repairs preserving first '+case)
        bounds(p);art(p,'tap-'+case)
    p=setup(browser,768,1024,f['base'],'keyboard');go(p,base)
    p.locator('[data-gap-start]').focus();p.keyboard.press('Enter')
    p.locator('.gap-ideas summary').focus();p.keyboard.press('Enter')
    p.locator('[data-gap-case="positive"]').focus();p.keyboard.press('Enter')
    for _ in range(5):p.locator('[data-gap-move="1"]').focus();p.keyboard.press('Enter')
    p.locator('[data-gap-presentation="showMove"]').focus();p.keyboard.press('Space');p.locator('[data-gap-compare]').focus();p.keyboard.press('Enter')
    ok(observation(p,'positive')['first']['endResult']=='meets','representative native keyboard construction')
    ok(p.locator('#gap-checked-focus').evaluate('x=>document.activeElement===x'),'keyboard Compare focuses compact checked heading')
    snap(p,'keyboard')
    # Fresh synthetic source moves Start to -10 so the entire40-half-piece rail is exercised.
    maximum=copy.deepcopy(f['partial']);c=next(c for c in maximum['gapLine']['source']['cases'] if c['id']=='halves');c['fromHalf']=-20;c['initial']['endHalf']=-20
    maximum['gapLine']['drafts']=[x for x in maximum['gapLine']['drafts'] if x['caseId']!='halves']
    for width,height in [(744,1024),(768,1024),(950,768),(320,800)]:
        p=setup(browser,width,height,maximum,'geometry-'+str(width));go(p,base);select_case(p,'halves');set_plan(p,'halves',20,True,True)
        ok(p.locator('.gap-board [data-gap-piece]').count()==40,'maximum40 actual half pieces')
        bounds(p);art(p,'max40-'+str(width))
        select_case(p,'coincident');bounds(p);art(p,'coincident-'+str(width));ok(p.locator('.gap-board [data-gap-piece]').count()==0,'coincident material has no pieces')
        set_plan(p,'coincident',0,True,True);bounds(p);art(p,'zero-end-'+str(width))

def retained(browser,base,f):
    p=setup(browser,820,1180,f['uninitialized'],'uninitialized');go(p,base)
    original=copy.deepcopy(f['uninitialized']);actual=book(p)
    if isinstance(actual.get('garden'),dict):
        actual['garden'].pop('avatar',None)
        if not actual['garden'] and 'garden' not in original:actual.pop('garden')
    ok(actual==original,'uninitialized entry creates no lesson roots beyond existing avatar metadata')
    click(p,'[data-gap-start]');actual=book(p);actual.pop('gapLine')
    if isinstance(actual.get('garden'),dict):
        actual['garden'].pop('avatar',None)
        if not actual['garden'] and 'garden' not in original:actual.pop('garden')
    ok(actual==original,'Open adds only Gap Line on truly uninitialized notebook')
    p=setup(browser,820,1180,f['damaged'],'damaged');go(p,base);select_case(p,'same-below')
    ok(p.locator('[data-gap-compare]').is_disabled(),'attributed bad observation blocks its comparison')
    click(p,'[data-gap-move="1"]');ok(plan(p,'same-below')['endHalf']==-2,'unreadable observation leaves readable draft editable')
    select_case(p,'halves');set_plan(p,'halves',4);compare(p)
    ok(owner(p)['observations'][1]==f['damaged']['gapLine']['observations'][1],'neighbor edit retains unreadable raw comparison')

    for key in ['contradictory','unknown','historical']:
        p=setup(browser,820,1180,f[key],key);go(p,base);select_case(p,'guided-cross');before=copy.deepcopy(owner(p));text=view(p).inner_text()
        if key=='contradictory':
            ok('0 units' in text or '0 unit' in text,'actual zero length displayed for contradictory checked plan')
            ok('Recorded endpoint result' in text and '0 = 13' not in text,'literal status distinguished from computed length')
        else:
            ok(p.locator('.gap-axis').count()==0 and p.locator('[data-gap-piece]').count()==0,'unknown model has no current-model picture')
            ok(p.locator('.gap-readouts,.gap-move').count()==0,'unknown model no computed arithmetic regions')
            ok(p.locator('[data-gap-compare]').count()==0 or p.locator('[data-gap-compare]').is_disabled(),'unknown model read only')
        report=download(p,base,key);ok(report['gapLine']==before,'retained raw owner downloaded '+key);text=semantic(p)
        ok('0 = 13' not in text,'Notes never converts literal status to false equality')
        if key!='contradictory':ok(p.locator('.gap-notes .gap-axis,.gap-notes .gap-readouts,.gap-notes .gap-move').count()==0,'unknown Notes no arithmetic or diagram')
        snap(p,key+'-notes')
    for key in ['unreadableRecord','unreadableSection']:
        p=setup(browser,820,1180,f[key],key);go(p,base);select_case(p,'guided-cross')
        text=view(p).inner_text();ok('An earlier comparison cannot be read here.' in text,'unreadable comparison notice exists')
        ok('No comparison recorded here yet' not in text,'unreadable history never absent board')
        click(p,VIEW+' [data-speak]');spoken=p.evaluate('gapSpeechRequests.at(-1)');ok('An earlier comparison cannot be read here.' in spoken and 'No comparison recorded here yet' not in spoken,'unreadable Hear stays unknown')
        report=download(p,base,key+'-download');ok(report['gapLine']['observations']==f[key]['gapLine']['observations'],'raw unknown record download')
        fold=p.locator('.gap-notes');ok(fold.count()==1,'actual Gap Notes section exists');semantic(p)
        case=fold.locator('[data-gap-notes-case="guided-cross"]')
        ok(case.count()==1,'affected Notes case exists before negative assertion')
        ok('An earlier comparison cannot be read here.' in case.inner_text() and 'No comparison recorded here' not in case.inner_text(),'affected unknown Notes case never absent')
    for key in ['smaller','metadata','supplied']:
        p=setup(browser,820,1180,f[key],key);go(p,base);id='earlier-gap' if key=='smaller' else 'positive';select_case(p,id)
        if key=='supplied':
            ok(p.locator('[data-gap-presentation="split"]').is_checked() and p.locator('[data-gap-presentation="showMove"]').is_checked(),'retained supplied presentations on')
            ok('Supplied ruler end' in view(p).inner_text(),'nonzero initial uses supplied-end caption')
        click(p,'[data-gap-move="-1"]');compare(p);ok(observation(p,id) is not None,'supported retained source remains editable '+key)
        download(p,base,key+'-notes');text=semantic(p)
        if key=='supplied':
            positive=p.locator('.gap-notes [data-gap-notes-case="positive"]');ok(positive.count()==1,'supplied affected Notes case exists');ok('supplied ruler end already meets Finish' in positive.inner_text(),'nonzero supplied initial fitting notice')
            reverse=p.locator('.gap-notes [data-gap-notes-case="reverse"]');coincident=p.locator('.gap-notes [data-gap-notes-case="coincident"]');ok(reverse.count()==1 and coincident.count()==1,'canonical-id altered Notes cases exist');ok('reverses the two places' not in reverse.inner_text() and 'zero-length ruler already fits' not in coincident.inner_text(),'canonical ids do not invent reversal/coincidence')
    for key in ['partialHelper','partialTeaching']:
        p=setup(browser,820,1180,f[key],key);go(p,base);select_case(p,'guided-cross');draft=copy.deepcopy(owner(p)['drafts'])
        if key=='partialTeaching':ok(p.locator('[data-gap-compare]').is_disabled(),'partial teaching blocks Compare')
        helper(p,'crossing');ok('part or all' in view(p).inner_text(),'own helper may supply partial answer');click(p,'[data-gap-close]');ok(owner(p)['drafts']==draft,'partial helper preserves draft')
        if key=='partialHelper':
            compare(p);download(p,base,key+'-notes');text=semantic(p);ok('part or all' in text and 'Opening does not show which steps' in text,'partial historical helper Notes does not infer viewed final answer')
        else:
            helper(p,'halves');click(p,'[data-gap-close]');ok(owner(p)['teaching']['sameBelow']=='Synthetic unknown flag','readable helper leaves unknown neighbor retained')
    p=setup(browser,820,1180,f['unknownHelper'],'unknown-helper');go(p,base);download(p,base,'unknown-helper');semantic(p)
    case=p.locator('.gap-notes [data-gap-notes-case="guided-cross"]');ok(case.count()==1,'affected unknown-helper Notes case exists')
    ok("Whether it used this invitation's own marks is unknown" in case.inner_text(),'missing opened helper detail remains unknown support')
    p=setup(browser,820,1180,f['refusal'],'pretty-refusal');go(p,base);select_case(p,'guided-cross');before=book(p)
    for selector in ['[data-gap-helper="clue"]','[data-gap-helper="crossing"]',VIEW+' [data-speak]','[data-gap-move="-1"]','[data-gap-compare]']:
        if selector=='[data-gap-helper="crossing"]':helper(p,'crossing')
        else:click(p,selector)
        ok(book(p)==before,'actual pretty whole-report refusal '+selector)
    p.locator('[data-gap-presentation="split"]').click();ok(p.locator('[data-gap-presentation="split"]').is_checked() and book(p)==before,'refused native checkbox restored')
    ok(p.evaluate('gapSpeechRequests.length')==0 and p.locator('[data-gap-close]').count()==0,'refusal precedes helper/speech exposure');snap(p,'pretty-refusal')

def review_repair_fixtures(browser,base,f):
    for key in ['unknownDiffering','unreadableDraftContext']:
        p=setup(browser,820,1180,f[key],key);go(p,base);select_case(p,'guided-cross');before=copy.deepcopy(owner(p))
        ok(before==f[key]['gapLine'],'read-only render retains original owner '+key)
        more=view(p).get_by_text('More ideas',exact=True);ok(more.count()==1,'actual More ideas section exists');more.click()
        text=view(p).inner_text()
        ok('Your ruler changed since this comparison' not in text and 'Compare when you want to keep this version' not in text,'read-only or unreadable current ruler gets no editable comparison invitation '+key)
        checked=p.locator('.gap-checked');ok(checked.count()==1,'actual readable checked snapshot exists '+key)
        latest=before['observations'][0]['latest'];feedback=before['source']['feedback']
        ok(feedback['endMeets' if latest['endResult']=='meets' else 'endDifferent'] in checked.inner_text() and feedback['lengthMatches' if latest['lengthResult']=='matches' else 'lengthDifferent'] in checked.inner_text(),'checked literal outcomes remain visible '+key)
        if key=='unknownDiffering':
            ok(before['drafts'][0]['endHalf']==14 and latest['endHalf']==16,'unsupported fixture has genuinely differing raw draft and checked endpoints')
            ok('Choose Working together' not in text,'unsupported More ideas never suggests reporting new help')
            ok(p.locator('.gap-axis,.gap-readouts,.gap-move').count()==0,'unsupported differing states generate no current-model arithmetic or pictures')
        else:
            ok('Some earlier work for this invitation cannot be read here.' in text,'unreadable current draft has its precise retained notice')
            compare_control=p.locator('[data-gap-compare]');ok(compare_control.count()==0 or compare_control.is_disabled(),'unreadable draft offers no active Compare')
            ok(p.locator(VIEW+' [data-speak]').count()==0 or p.locator(VIEW+' [data-speak]').is_disabled(),'unreadable current draft cannot narrate invented state')
        guide=p.locator('.gap-grownup');ok(guide.count()==1,'actual grown-up guide exists');guide.locator('summary').click()
        for case in before['source']['cases']:
            section=guide.locator('[data-gap-guide-case="'+case['id']+'"]');ok(section.count()==1,'guide context attributed by case '+case['id'])
            ok(section.locator('h3').inner_text()==case['title'],'guide context names its frozen source title '+case['id'])
        snap(p,key+'-board')
        report=download(p,base,key+'-notes');semantic(p);case=p.locator('.gap-notes [data-gap-notes-case="guided-cross"]');ok(case.count()==1,'affected retained Notes case exists '+key)
        ok('Current editable ruler' not in case.inner_text(),'retained current state never mislabeled editable '+key)
        if key=='unknownDiffering':ok('"endHalf": 14' in case.inner_text() and '"endHalf": 16' in case.inner_text(),'Notes visibly separates unsupported raw draft and checked endpoints')
        ok(case.locator('.gap-checked').count()==2,'Notes retains readable first and latest snapshots '+key)
        ok(report['gapLine']==before and owner(p)==before,'raw owner and original draft/check data retained exactly '+key)
        case.screenshot(path=str(OUT/(key+'-notes-case.png')))
    p=setup(browser,820,1180,f['unattributed'],'unattributed-notes');go(p,base);before=copy.deepcopy(owner(p));report=download(p,base,'unattributed-notes');text=semantic(p)
    ok('Some retained entries cannot be read or matched to an invitation. Their originals stay in your notes.' in text,'Notes discloses an unmatched retained entry')
    ok(report['gapLine']==before,'unmatched original remains in actual downloaded owner')
    p=setup(browser,820,1180,f['unreadableSupport'],'unreadable-support');go(p,base);select_case(p,'guided-cross');before=copy.deepcopy(owner(p))
    ok(p.locator('.gap-support').count()>0,'actual support section exists for unreadable-support fixture')
    hear=p.locator(VIEW+' [data-speak]');ok(hear.count()==0 or hear.is_disabled(),'Hear unavailable before unreadable support could refuse an apparently active request')
    ok(owner(p)==before,'unreadable support render preserves original data')
    p=setup(browser,820,1180,f['partial'],'stale-checkbox');go(p,base);select_case(p,'guided-cross')
    checkbox=p.locator('[data-gap-presentation="split"]');ok(checkbox.count()==1 and checkbox.is_checked(),'real checked presentation control exists before departure')
    before=book(p)
    state=p.evaluate("""()=>{const box=document.querySelector('[data-gap-presentation="split"]');const initial=box.defaultChecked;location.hash='#notes';const connected=box.isConnected;box.click();return {connected,initial,checked:box.checked,defaultChecked:box.defaultChecked};}""")
    ok(state['connected'] and state['initial'] and state['checked']==state['defaultChecked'],'connected stale checkbox restores its actual original visual state')
    ok(book(p)==before,'stale checkbox event does not mutate the whole notebook')
    p.locator('#download').wait_for()

def unsupported_semantics(browser,base,f):
    p=setup(browser,820,1180,f['unknown'],'unsupported-raw-labels');go(p,base);select_case(p,'guided-cross')
    before=copy.deepcopy(owner(p));text=view(p).inner_text()
    ok('endHalf' in text and '-8' in text,'unsupported checked endpoint explicitly names its raw half-tick field')
    ok('ruler end at -8' not in text,'raw ticks are not mislabeled as signed ruler coordinates')
    report=download(p,base,'unsupported-raw-labels');semantic(p)
    case=p.locator('.gap-notes [data-gap-notes-case="guided-cross"]');ok(case.count()==1,'unsupported affected Notes case exists')
    text=case.inner_text()
    for field in ['fromHalf','toHalf','stepHalf','endHalf']:
        ok(field in text,'unsupported Notes labels raw field '+field)
    ok('Current editable ruler' not in text,'unsupported Notes never claims editable state')
    ok(before['source']['feedback']['endMeets'] in text and before['source']['feedback']['lengthMatches'] in text,'unsupported literal recorded statuses remain readable')
    ok(p.locator('.gap-notes .gap-axis,.gap-notes .gap-readouts,.gap-notes .gap-move').count()==0,'unsupported semantic fidelity adds no arithmetic or diagram')
    ok(report['gapLine']==before,'unsupported raw source/history exact download retained')
    case.screenshot(path=str(OUT/'unsupported-raw-labels-case.png'))

def speech_tokens(browser,base,f):
    p=setup(browser,820,1180,f['speechTokens'],'speech-tokens');go(p,base)
    p.wait_for_function("speechSynthesis.getVoices().some(v=>v.localService&&/^en(?:[-_]|$)/i.test(v.lang))")
    click(p,VIEW+' [data-speak]');p.wait_for_function('gapSpeechRequests.length>0');spoken=p.evaluate('gapSpeechRequests.at(-1)')
    (OUT/'speech-tokens.txt').write_text(spoken)
    ok('Keep v2 and 130 unchanged. Compare four plus nine; start negative one and a half, then positive two.' in spoken,'actual Hear preserves full token bounds and separates arithmetic operators')
    ok(owner(p)['source']==f['speechTokens']['gapLine']['source'],'Hear keeps literal frozen source unchanged')
    spoken_cases={}
    for case in owner(p)['source']['cases']:
        select_case(p,case['id']);click(p,VIEW+' [data-speak]');text=p.evaluate('gapSpeechRequests.at(-1)');spoken_cases[case['id']]=text
        ok('−' not in text and '½' not in text,'all six native Hear texts verbalize signed/half glyphs '+case['id'])
    (OUT/'speech-six-cases.json').write_text(json.dumps(spoken_cases,indent=2))

def saving(browser,base,f):
    p=setup(browser,820,1180,f['partial'],'storage-fault');go(p,base);select_case(p,'positive')
    p.evaluate("()=>{window.originalGapSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Synthetic storage failure','QuotaExceededError')}}")
    for _ in range(5):click(p,'[data-gap-move="1"]')
    compare(p);ok('could not be saved' in p.locator('#gap-status').inner_text(),'storage fault disclosed')
    report=download(p,base,'storage-fault');ok(next(x for x in report['gapLine']['observations'] if x['caseId']=='positive')['first']['endResult']=='meets','storage-failed current memory downloadable')
    p.evaluate('()=>{Storage.prototype.setItem=window.originalGapSet;}')
    p=setup(browser,820,1180,f['partial'],'save-off');go(p,base,'#notes','#remember');p.locator('#remember').uncheck();p.goto(base+'#desk/gaps',wait_until='domcontentloaded');p.locator(VIEW).wait_for();select_case(p,'positive')
    for _ in range(5):click(p,'[data-gap-move="1"]')
    compare(p);ok('Saving is off' in view(p).inner_text(),'save-off disclosed');report=download(p,base,'save-off');ok(next(x for x in report['gapLine']['observations'] if x['caseId']=='positive')['first']['endResult']=='meets','save-off memory downloadable')

def main():
    fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {gapFixtures} from './test/gap-line-checks.mjs';console.log(JSON.stringify(gapFixtures()));"],cwd=ROOT,text=True))
    server=None;base=os.environ.get('GAP_TEST_URL')
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
            for width,height in [(820,1180),(1024,768),(320,800)]:basic_journey(browser,base,fixtures,width,height)
            inputs_and_geometry(browser,base,fixtures);retained(browser,base,fixtures);review_repair_fixtures(browser,base,fixtures);unsupported_semantics(browser,base,fixtures);speech_tokens(browser,base,fixtures);saving(browser,base,fixtures)
            ok(not errors,'no page errors '+json.dumps(errors));ok(not faults,'no browser faults '+json.dumps(faults))
            receipt={'status':'passed','checks':checks,'base':base,'viewports':[[820,1180],[1024,768],[320,800],[744,1024],[768,1024],[950,768]],'inputCoverage':'Actual native Chrome tap events construct/check/repair all six invitations; native keyboard Enter/Space representative positive invitation; clicks elsewhere. Tab order is not exhaustively traversed.','pageErrors':errors,'faults':faults,'scope':'Synthetic profiles only. Actual whole Notes Download/import/reload/redownload and retained500KiB sibling; two explorers/reset, refusal, save-off, storage fault. Native speech request observation only. No Safari or physical-device testing, audible quality, human math approval or learning efficacy claim.'}
            (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(f'Gap Line browser: {checks} assertions passed; artifacts {OUT}')
        except Exception:
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
