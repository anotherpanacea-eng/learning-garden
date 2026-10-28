"""Spec288 real-app journeys. Synthetic notebooks only; no app interception.

RATIO_TEST_URL targets hosted builds. RATIO_ARTIFACTS retains original
screenshots/downloads and receipt. Speech observer forwards native speak calls;
it establishes requests, never audibility or understanding.
"""
import copy
import functools
import http.server
import json
import os
import re
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('RATIO_ARTIFACTS', tempfile.mkdtemp(prefix='ratio-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
checks, contexts, pages, errors, faults = 0, [], [], [], []
VIEW = '[data-ratio-bars-view]'

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def active(p):
    return p.evaluate("()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")

def book(p):
    return p.evaluate("()=>{const i=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+i));}")

def owner(p):
    return book(p)['ratioBars']

def entry(p, section, case):
    return next((x for x in owner(p)[section] if x.get('caseId') == case), None)

def raw_report(s):
    return {k: v for k, v in s.items() if k not in ['title', 'exportedAt', 'note', 'explorer', 'recommendation']}

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
    c.add_init_script('(fixture=>{if(!localStorage.getItem("mixing-fixture")){for(const [id,seed] of Object.entries(fixture.seeds))localStorage.setItem("number-garden-v1:"+id,JSON.stringify(seed));localStorage.setItem("learning-garden-explorers",JSON.stringify(fixture.registry));localStorage.setItem("mixing-fixture","1");}})('+json.dumps(fixture)+')')
    c.add_init_script('window.ratioSpeechRequests=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{window.ratioSpeechRequests.push(u.text);return native(u);};}')
    p = c.new_page()
    pages.append((p, label))
    p.set_default_timeout(12000)
    p.on('pageerror', lambda e: errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda m: faults.append({'case': label, 'type': 'console', 'text': m.text}) if m.type == 'error' else None)
    p.on('response', lambda r: faults.append({'case': label, 'type': 'http', 'status': r.status, 'url': r.url}) if r.status >= 400 else None)
    p.on('requestfailed', lambda r: faults.append({'case': label, 'type': 'request', 'error': r.failure, 'url': r.url}) if 'ERR_ABORTED' not in (r.failure or '') else None)
    return p

def go(p, base, route='#studio/mixing/bars', selector=VIEW):
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

def button(p, text):
    p.locator(VIEW).get_by_role('button', name=text, exact=True).click()

def snap(p, name):
    p.screenshot(path=str(OUT / (name + '.png')), full_page=True)

def select_case(p, case):
    loc = p.locator(f'[data-rb-case="{case}"]')
    if not loc.is_visible():
        rail = p.locator(VIEW + ' details').filter(has=p.locator(f'[data-rb-case="{case}"]'))
        if rail.count() and not rail.get_attribute('open'):
            rail.locator('summary').click()
    loc.click()

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
    p.locator('#progress-file').set_input_files({'name': 'synthetic-ratio-notebook.json', 'mimeType': 'application/json', 'buffer': json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for()
    ok('Equal Blocks' in p.locator('.import-preview').inner_text(), 'actual import preview identifies optional root')
    click(p, '#progress-import-confirm')
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual confirmed import')

def view(p):
    return p.locator(VIEW)

def plan(p, case):
    draft=entry(p,'drafts',case)
    return draft or next(c for c in owner(p)['source']['cases'] if c['id']==case)['initial']

def set_plan(p, case, blocks, unit, reference):
    source=next(c for c in owner(p)['source']['cases'] if c['id']==case)
    for i,target in enumerate(blocks):
        now=plan(p,case)['blocks'][i]
        for _ in range(abs(target-now)):
            click(p,f'[data-rb-adjust="{source["ingredientIds"][i]}"][data-delta="{1 if target>now else -1}"]')
    p.locator('select[data-rb-unit]').select_option('' if unit is None else str(unit))
    if reference is not None:
        p.locator(f'input[data-rb-reference="{reference}"]').check()
    actual=[int(re.search(r': (\d+) blocks?',p.locator(f'[data-rb-row="{ingredient}"] h3').first.inner_text()).group(1)) for ingredient in source['ingredientIds']]
    ok(actual==blocks and p.locator('[data-rb-unit]').input_value()==('' if unit is None else str(unit)) and (reference is None or p.locator(f'[data-rb-reference="{reference}"]').is_checked()),'native controls reach displayed actual plan '+case)

def observation(p,case):
    return entry(p,'observations',case)

def compare(p):
    click(p,'[data-rb-compare]')

def bounds(p, tablet=False):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    bad=p.locator(VIEW+' button,'+VIEW+' a,'+VIEW+' summary,'+VIEW+' select').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent,w:x.offsetWidth,h:x.offsetHeight,font:getComputedStyle(x).fontSize}))")
    ok(not bad,'44px actions /16px text '+str(bad))
    sizes=p.locator('.rb-block').evaluate_all('xs=>xs.map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))')
    ok(sizes and all(abs(x['w']-sizes[0]['w'])<.1 and abs(x['h']-sizes[0]['h'])<.1 for x in sizes),'identical block geometry across ingredients')
    if tablet:
        p.evaluate('window.scrollTo(0,0)')
        for selector in ['[data-rb-compare]','[data-rb-unit]','[data-rb-reference="whole"]']:
            r=p.locator(selector).bounding_box()
            ok(r and r['y']>=0 and r['y']+r['height']<=p.viewport_size['height']+1,'tablet first viewport '+selector+' '+str(r))
        for loc in p.locator('[data-rb-adjust]').all():
            r=loc.bounding_box();ok(r and r['y']>=0 and r['y']+r['height']<=p.viewport_size['height']+1,'all three-part adjustment controls in first viewport '+str(r))

def helper(p,key):
    click(p,f'[data-rb-helper="{key}"]')

def guard_controls(p,transition):
    ok(p.locator('[data-rb-compare]').count()>0 and p.locator('[data-rb-adjust]').count()>0,'capture actual active controls before transition')
    p.evaluate("window.oldRatioControls=[document.querySelector('[data-rb-compare]'),document.querySelector('[data-rb-adjust]'),document.querySelector('[data-rb-helper]'),document.querySelector('[data-ratio-bars-view] [data-speak]')]")
    transition()
    before=book(p);speech=p.evaluate('ratioSpeechRequests.length')
    p.evaluate('oldRatioControls.forEach(x=>x?.click())')
    ok(book(p)==before and p.evaluate('ratioSpeechRequests.length')==speech,'detached old Compare/edit/help/Hear controls inert')

def same_block_exit(p,base):
    before=owner(p)
    result=p.evaluate("""()=>{const xs=[document.querySelector('[data-rb-compare]'),document.querySelector('[data-rb-adjust]'),document.querySelector('[data-rb-helper]'),document.querySelector('[data-ratio-bars-view] [data-speak]')];const speech=ratioSpeechRequests.length;location.hash='#notes';const connected=xs[0].isConnected;xs.forEach(x=>x?.click());const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return {connected,owner:JSON.parse(localStorage.getItem('number-garden-v1:'+id)).ratioBars,speech:ratioSpeechRequests.length-speech};}""")
    ok(result['connected'],'same-block old controls still connected before rerender')
    ok(result['owner']==before and result['speech']==0,'hash guard refuses connected old controls before route render')
    p.locator('#download').wait_for();go(p,base)

def semantic(p):
    fold=p.locator('.rb-notes')
    if not fold.get_attribute('open'):fold.locator('summary').first.click()
    return fold.inner_text()

def regressions(browser,base,f):
    # Real uninitialized notebook: only ExplorerStore's intrinsic avatar metadata
    # may be added; the route must never initialize unrelated lesson owners.
    p=setup(browser,820,1180,f['uninitialized'],'uninitialized',second_seed=f['uninitialized']);go(p,base)
    initial=book(p);raw=copy.deepcopy(initial)
    if isinstance(raw.get('garden'),dict):
        raw['garden'].pop('avatar',None)
        if not raw['garden'] and 'garden' not in f['uninitialized']:raw.pop('garden')
    original=copy.deepcopy(f['uninitialized'])
    if isinstance(original.get('garden'),dict):original['garden'].pop('avatar',None)
    ok(raw==original,'uninitialized route adds no lesson initialization beyond avatar baseline')
    button(p,'Open the blocks');opened=book(p)
    opened_other={k:v for k,v in opened.items() if k!='ratioBars'}
    if isinstance(opened_other.get('garden'),dict):
        opened_other['garden'].pop('avatar',None)
        if not opened_other['garden'] and 'garden' not in original:opened_other.pop('garden')
    ok(opened_other==original,'Open adds only ratioBars and existing avatar metadata baseline to actual uninitialized notebook '+str({k:[original.get(k),opened_other.get(k)] for k in set(original)|set(opened_other) if original.get(k)!=opened_other.get(k)}))
    ok(not p.locator('dialog.welcome-film[open]').count(),'no automatic film on uninitialized route')
    click(p,'#explorer-switch');click(p,'[data-select-explorer="explorer-2"]');p.locator(VIEW).wait_for()
    switched=book(p)
    if isinstance(switched.get('garden'),dict):
        switched['garden'].pop('avatar',None)
        if not switched['garden'] and 'garden' not in original:switched.pop('garden')
    ok(switched==original,'switching to existing uninitialized notebook creates no lesson roots beyond avatar baseline')
    # Wrong marker and accidental number are separate, both with unchanged source.
    p=setup(browser,820,1180,f['partial'],'predicate-separation');go(p,base);source=copy.deepcopy(owner(p)['source'])
    select_case(p,'guided-twenty')
    for unit,amount in [(4,'fits'),(10,'different')]:
        set_plan(p,'guided-twenty',[2,3],unit,'white');compare(p);r=observation(p,'guided-twenty')['latest']
        ok([r['ratio'],r['referenceStatus'],r['amountStatus']]==['same','different',amount],'native Compare separates wrong marker and source-referent number')
        ok(owner(p)['source']==source and '20' in view(p).inner_text(),'wrong marker preserves source fact')
    select_case(p,'three-sixty');set_plan(p,'three-sixty',[12,12,12],20,'whole')
    ok('720' in view(p).inner_text(),'actual max12 unit20 shows total720');bounds(p)
    select_case(p,'three-sixty');set_plan(p,'three-sixty',[1,2,0],20,'whole');compare(p)
    ok(observation(p,'three-sixty')['first']['ratio']=='different','missing third part checked as mismatch')
    select_case(p,'twenty-four');before=copy.deepcopy(owner(p));compare(p)
    ok(owner(p)==before,'all-zero missing-unit missing-brace compare is unrecorded')
    set_plan(p,'twenty-four',[0,1],1,'white');compare(p)
    ok(observation(p,'twenty-four')['first']['ratio']=='different','zero named reference remains meaningful')
    # Literal retained results may contradict their arithmetic; neither is regraded.
    for key in ['contradictory','unknown','historical']:
        p=setup(browser,820,1180,f[key],key);go(p,base);before=copy.deepcopy(owner(p));select_case(p,'guided-twenty')
        text=view(p).inner_text()
        ok('blue' in text.lower(),'retained recorded marker stays blue')
        if key=='contradictory':
            ok('50' in text,'understood retained model displays independently computed whole50')
            ok('50 matches 20' not in text.lower(),'no false equality from retained fits status')
            ok('Recorded' in text or 'recorded' in text,'literal statuses identified as recorded')
        else:
            ok(not p.locator('.rb-block').count(),'unsupported model gets no current-model diagram')
            ok(not re.search(r'All bars together:\s*50|5\s*[×x]\s*5\s*=\s*25',text),'unsupported model gets no computed amounts')
            compare_button=p.locator('[data-rb-compare]')
            ok(not compare_button.count() or compare_button.is_disabled(),'unsupported model read-only')
        report=download(p,base,key+'-notes');ok(report['ratioBars']==before,'retained contradictory/unknown record raw download')
        text=semantic(p)
        ok('blue' in text.lower() and '50 matches 20' not in text.lower(),'semantic Notes preserves literal marker/status distinction')
        if key!='contradictory':ok('All bars together: 50' not in text,'unknown Notes no computed whole')
        snap(p,key+'-semantic-notes')
    for key in ['unreadableRecord','unreadableSection']:
        p=setup(browser,820,1180,f[key],key);go(p,base);select_case(p,'guided-twenty');before=copy.deepcopy(owner(p))
        text=view(p).inner_text()
        ok('No comparison recorded here yet' not in text and 'Current model, not compared' not in text,'unknown retained work never absent main status '+key)
        click(p,VIEW+' [data-speak]')
        spoken=p.evaluate('ratioSpeechRequests.at(-1)')
        ok('No comparison recorded here yet' not in spoken and 'Current model, not compared' not in spoken,'unknown retained work Hear stays unknown')
        folds=view(p).locator('details').filter(has_text='Back at the shade pots')
        if folds.count():
            folds.first.locator('summary').click();ok('Current model, not compared' not in folds.first.inner_text(),'bridge unknown remains unknown')
        report=download(p,base,key+'-notes');ok(report['ratioBars']['observations']==before['observations'],'actual raw unknown retention')
        ok('No comparison recorded here yet' not in semantic(p),'semantic unknown history retained');snap(p,key+'-notes')
    p=setup(browser,820,1180,f['smaller'],'smaller');go(p,base);before=copy.deepcopy(owner(p)['source']);select_case(p,'earlier-whole')
    set_plan(p,'earlier-whole',[4,6],2,'whole');compare(p)
    ok(owner(p)['source']==before and observation(p,'earlier-whole')['latest']['amountStatus']=='fits','supported smaller unknown-case source editable')
    report=download(p,base,'smaller-notes');bring(p,base,report);go(p,base);ok(owner(p)['source']==before,'historical source actual transfer remains frozen')
    for key in ['partial','partialHelper']:
        p=setup(browser,820,1180,f[key],key+'-own-helper');go(p,base);select_case(p,'yellow-twelve');helper(p,'share')
        ok('this invitation' in view(p).inner_text().lower(),'own invitation helper framed before pictures')
        click(p,'[data-rb-close]');set_plan(p,'yellow-twelve',[3,2],4,'yellow');compare(p)
        report=download(p,base,key+'-helper-notes');text=semantic(p)
        ok('part or all' in text.lower() and 'potentially answer-supported' in text.lower(),'Notes partial historical helper avoids full-plan inference')
        ok(next(x for x in report['ratioBars']['observations'] if x['caseId']=='yellow-twelve')['first']['teachingBefore']['share'],'first records helper availability')
    p=setup(browser,820,1180,f['damaged'],'damaged');go(p,base);select_case(p,'yellow-twelve');raw=copy.deepcopy(owner(p)['observations'][1]);set_plan(p,'yellow-twelve',[3,2],4,'yellow');compare(p);ok(owner(p)['observations'][1]==raw,'neighbor edits preserve unreadable raw entry')
    p=setup(browser,820,1180,f['refusal'],'whole-pretty-report-refusal');go(p,base);select_case(p,'guided-twenty');before=book(p);speech=p.evaluate('ratioSpeechRequests.length')
    for selector in ['[data-rb-helper="clue"]',VIEW+' [data-speak]','[data-rb-adjust][data-delta="1"]','[data-rb-compare]']:
        click(p,selector);ok(book(p)==before,'actual pretty-report refuses before edit/help/Hear/Compare '+selector)
    ok(p.evaluate('ratioSpeechRequests.length')==speech and not p.locator('[data-rb-close]').count(),'refusal discloses no helper or speech');snap(p,'pretty-report-refusal')

def main():
    fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {ratioFixtures} from './test/ratio-bars-checks.mjs';console.log(JSON.stringify(ratioFixtures()));"],cwd=ROOT,text=True))
    server=None;base=os.environ.get('RATIO_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self,*args):pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    sizes=[(320,568),(820,1180),(1024,768)]
    goals={'guided-twenty':([2,3],4,'whole'),'twenty-four':([1,2],8,'whole'),'three-sixty':([1,2,3],10,'whole'),'white-eight':([2,3],4,'white'),'yellow-twelve':([3,2],4,'yellow'),'blue-twenty':([1,2,3],10,'blue')}
    with sync_playwright() as pw:
        launch={'headless':True,'args':['--disable-quic']}
        if os.environ.get('CHROME_PATH'):launch['executable_path']=os.environ['CHROME_PATH']
        browser=pw.chromium.launch(**launch)
        try:
            for width,height in sizes:
                p=setup(browser,width,height,fixtures['base'],f'ratio-{width}');go(p,base);before=book(p)
                ok('ratioBars' not in before,'entry freezes no source');ok(not p.locator('dialog.welcome-film[open]').count(),'no automatic entry film')
                p.get_by_role('button',name='Open the blocks',exact=True).focus();p.keyboard.press('Enter')
                ok(owner(p)['drafts']==[] and owner(p)['observations']==[],'keyboard Open freezes source only')
                ok({k:v for k,v in book(p).items() if k!='ratioBars'}==before,'Open changes only optional owner')
                for case,target in goals.items():
                    select_case(p,case);set_plan(p,case,*target);bounds(p,width>320);compare(p)
                    r=observation(p,case)['first'];ok([r['ratio'],r['referenceStatus'],r['amountStatus']]==['same','fits','fits'],'actual fitting Compare '+case)
                    ok(len(r['blocks'])==len(target[0]),'all source ingredients recorded')
                    ok(p.locator('.rb-block').count()>=sum(target[0]),'real block diagrams '+case);snap(p,f'art-{width}-{case}')
                select_case(p,'three-sixty');set_plan(p,'three-sixty',[12,12,12],20,'whole');bounds(p);snap(p,f'maximum-{width}');ok('720' in view(p).inner_text(),'actual full12-block three-bar maximum at viewport '+str(width))
                select_case(p,'guided-twenty');set_plan(p,'guided-twenty',[4,6],2,'whole');compare(p)
                ok(observation(p,'guided-twenty')['latest']['blocks']==[4,6],'native noncanonical alternative accepted')
                set_plan(p,'guided-twenty',[5,6],2,'whole');checked=copy.deepcopy(observation(p,'guided-twenty'))
                ok('Bars changed since this comparison' in view(p).inner_text(),'draft and checked model separate')
                go(p,base);select_case(p,'guided-twenty');ok(plan(p,'guided-twenty')['blocks']==[5,6] and observation(p,'guided-twenty')==checked,'reload retains changed draft and literal checked plan')
                exact=copy.deepcopy(owner(p)['drafts'])
                for key in ['whole','share','three','clue']:
                    helper(p,key)
                    step=p.locator('[data-rb-step="1"]')
                    if step.count():step.click()
                    snap(p,f'helper-{width}-{key}');click(p,'[data-rb-close]')
                    ok(owner(p)['drafts']==exact,'helper returns exact draft '+key)
                    ok(p.locator(f'[data-rb-helper="{key}"]').evaluate('x=>document.activeElement===x'),'helper returns trigger focus '+key)
                requests=p.evaluate('ratioSpeechRequests.length')
                click(p,VIEW+' [data-speak]');click(p,VIEW+' [data-speak]')
                ok(p.evaluate('ratioSpeechRequests.length')==requests+2,'Hear twice makes two native speech requests')
                ok('Bars changed since this comparison' in p.evaluate('ratioSpeechRequests.at(-1)'),'Hear identifies stale check')
                set_plan(p,'guided-twenty',[6,6],2,'whole');compare(p);helper(p,'clue');click(p,'[data-rb-close]')
                count=observation(p,'guided-twenty')['compareCount'];compare(p)
                ok(observation(p,'guided-twenty')['compareCount']==count,'latest tuple identical Compare no-op after helper already recorded')
                # Family mode links preserve both owners and initialize neither.
                before=copy.deepcopy(owner(p));other_before=book(p).get('mixingTable')
                view(p).get_by_role('link',name='Shade pots',exact=True).click();p.locator('[data-mixing-table-view]').wait_for()
                ok(owner(p)==before and book(p).get('mixingTable')==other_before,'family switch leaves ratio work and missing pots owner intact')
                p.locator('[data-mixing-table-view]').get_by_role('link',name='Equal blocks',exact=True).click();p.locator(VIEW).wait_for()
                ok(owner(p)==before,'family return retains exact work')
                # Exercise existing parent pots as actual native work, then return.
                view(p).get_by_role('link',name='Shade pots',exact=True).click();p.locator('[data-mixing-table-view]').wait_for()
                p.locator('[data-mixing-table-view]').get_by_role('button',name='Open the table',exact=True).click()
                click(p,'[data-mt-adjust="a"][data-delta="1"]');click(p,'[data-mt-paint]');parent=copy.deepcopy(book(p)['mixingTable'])
                p.locator('[data-mixing-table-view]').get_by_role('link',name='Equal blocks',exact=True).click();p.locator(VIEW).wait_for()
                ok(owner(p)==before and book(p)['mixingTable']==parent,'family return preserves real parent pots and bars')
                guard_controls(p,lambda:select_case(p,'white-eight'));select_case(p,'guided-twenty')
                helper(p,'bridge');view(p).get_by_role('link',name='Return to equal blocks',exact=True).click()
                ok(p.locator('[data-rb-helper=bridge]').evaluate('x=>document.activeElement===x'),'same-hash bridge return restores deliberate focus')
                ok(not p.locator('[data-rb-close]').count() and owner(p)==before,'same-hash bridge return closes helper preserves work')
                same_block_exit(p,base);select_case(p,'guided-twenty')
                first_id,first_root=active(p),copy.deepcopy(owner(p))
                guard_controls(p,lambda:(click(p,'#explorer-switch'),click(p,'#explorer-new'),click(p,'#explorer-create')))
                second_id=active(p);ok(second_id!=first_id and 'ratioBars' not in book(p),'second fictional explorer independent')
                button(p,'Open the blocks');select_case(p,'yellow-twelve');set_plan(p,'yellow-twelve',[3,2],4,'yellow');compare(p);second_root=copy.deepcopy(owner(p))
                click(p,'#explorer-switch');click(p,f'[data-select-explorer="{first_id}"]');go(p,base);ok(owner(p)==first_root,'first explorer restored')
                exported=download(p,base,f'notes-{width}')
                ok(exported['ratioBars']==first_root and len(exported['syntheticOther']['payload'])>=500*1024,'actual pretty Notes download full owner and500KiB sibling')
                text=semantic(p);ok('guided' in text.lower() and 'Supplied' in text,'semantic Notes identifies supplied guided work');snap(p,f'notes-{width}')
                go(p,base);guard_controls(p,lambda:bring(p,base,exported));ok(active(p) not in [first_id,second_id],'real import creates separate explorer');go(p,base);ok(owner(p)==first_root,'import/reload retains first/latest/draft')
                redownload=download(p,base,f'redownload-{width}');ok(redownload['ratioBars']==first_root and redownload['syntheticOther']==exported['syntheticOther'],'real redownload exact owner and sibling')
                click(p,'#explorer-switch');click(p,f'[data-select-explorer="{second_id}"]');go(p,base);ok(owner(p)==second_root,'second explorer unchanged')
                go(p,base,'#notes','#reset');click(p,'#reset');click(p,'#confirm-reset')
                film=p.locator('dialog.welcome-film[open] [data-film-skip]')
                if film.count():film.click()
                go(p,base);ok('ratioBars' not in book(p),'scoped reset clears selected owner')
                click(p,'#explorer-switch');click(p,f'[data-select-explorer="{first_id}"]');go(p,base);ok(owner(p)==first_root,'reset preserves other explorer')
            regressions(browser,base,fixtures)
            p=setup(browser,820,1180,fixtures['partial'],'storage-failure');go(p,base);select_case(p,'yellow-twelve')
            p.evaluate("()=>{window.originalRatioSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Synthetic storage failure','QuotaExceededError')}}")
            set_plan(p,'yellow-twelve',[3,2],4,'yellow');compare(p)
            ok('could not be saved' in p.locator('#rb-status').inner_text(),'storage failure disclosed')
            report=download(p,base,'storage-failure-notes');ok(next(x for x in report['ratioBars']['observations'] if x['caseId']=='yellow-twelve')['first']['amountStatus']=='fits','storage-failed current memory downloadable')
            p.evaluate('()=>{Storage.prototype.setItem=window.originalRatioSet;}')
            p=setup(browser,820,1180,fixtures['partial'],'save-off');go(p,base,'#notes','#remember');p.locator('#remember').uncheck();p.goto(base+'#studio/mixing/bars',wait_until='domcontentloaded');p.locator(VIEW).wait_for();select_case(p,'yellow-twelve')
            # Saved disk does not reflect memory while saving is off: derive the
            # supplied counts before switching saving off, then use native controls.
            for ingredient,target in [('yellow',3),('blue',2)]:
                for _ in range(target):click(p,f'[data-rb-adjust="{ingredient}"][data-delta="1"]')
            p.locator('[data-rb-unit]').select_option('4');p.locator('[data-rb-reference="yellow"]').check();compare(p)
            ok('Saving is off' in view(p).inner_text(),'save-off disclosed');report=download(p,base,'save-off-notes');ok(next(x for x in report['ratioBars']['observations'] if x['caseId']=='yellow-twelve')['first']['amountStatus']=='fits','save-off memory downloadable')
            ok(not errors,'no page errors '+json.dumps(errors));ok(not faults,'no browser faults '+json.dumps(faults))
            receipt={'status':'passed','checks':checks,'base':base,'viewports':sizes,'pageErrors':errors,'faults':faults,'scope':'actual native Chrome controls and whole Notes download/import/reload/redownload; fictional synthetic profiles; speech requests only; no physical iPad, audibility, human approval or efficacy claim'}
            (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(f'Equal Blocks browser: {checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for p,label in pages:
                if not p.is_closed():
                    try:snap(p,label+'-failure');(OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception:pass
            raise
        finally:
            for c in contexts:c.close()
            browser.close()
            if server:server.shutdown()
if __name__=='__main__':main()
