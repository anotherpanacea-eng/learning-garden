"""Synthetic Borrowed Sorter journeys through the real app and notebook transfer."""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('SORTER_ARTIFACTS', '/tmp/borrowed-sorter-browser'))
OUT.mkdir(parents=True, exist_ok=True)
ROUTE = '#learn/computing/sorting'
checks = 0
errors = []


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def node(source):
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', source], cwd=ROOT, text=True))


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class PreviewServer(http.server.ThreadingHTTPServer):
    request_queue_size = 128


def book(p):
    return p.evaluate('()=>window.__sorterRead()')


def root(p):
    return book(p)['borrowedSorter']


def work(p):
    r = root(p)
    return r['visits'][r['current']]


def active(p):
    return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")


def click(p, selector):
    controls = p.locator(selector)
    controls.evaluate_all("xs=>xs.forEach(x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true})")
    p.locator(selector + ':visible').first.click()


def settle(p):
    p.locator('#explorer-header').wait_for()
    chosen = active(p)
    if p.locator(f'[data-select-explorer="{chosen}"]').count():
        click(p, f'[data-select-explorer="{chosen}"]')
    p.locator('[data-sorter-root]').wait_for()
    p.wait_for_function('window.__sorterRenderRoute===location.hash')


def go(p, base):
    p.goto(base + ROUTE)
    settle(p)


def setup(browser, width, seed):
    context = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True,
                                  accept_downloads=True, reduced_motion='reduce')
    context.add_init_script('('+r"""seed=>{
      if(!localStorage.getItem('sorter-synthetic-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('sorter-synthetic-fixture','1');
      }
      window.__sorterRefuse=false;
    }"""+')('+json.dumps(seed)+')')

    def app(route):
        response = route.fetch()
        body = response.text()
        assert 'let graph=null;' in body, 'app read seam changed'
        body = body.replace('let graph=null;', 'window.__sorterRead=()=>structuredClone(state);let graph=null;', 1)
        needle = 'function priceOptions(){return {canExport:candidate=>'
        assert needle in body, 'app preflight seam changed'
        body = body.replace(needle, 'function priceOptions(){return {canExport:candidate=>!window.__sorterRefuse&&', 1)
        assert 'function render(){' in body, 'actual app render seam changed'
        body = body.replace('function render(){', 'function render(){window.__sorterRenderRoute=location.hash;', 1)
        route.fulfill(response=response, body=body)

    context.route('**/app.mjs', app)
    page = context.new_page()
    page.set_default_timeout(12000)
    page.on('pageerror', lambda e: errors.append(str(e)))
    return context, page


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no page horizontal overflow')
    small = p.locator('[data-sorter-root] button,[data-sorter-root] a,[data-sorter-root] summary,[data-sorter-root] select,[data-sorter-root] textarea,[data-sorter-root] input:not([type=checkbox])').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44)).map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not small, '44px visible controls: '+str(small))


def turn(p, n):
    click(p, f'[data-sorter-page="{n}"]')
    ok(work(p)['page'] == n, 'selected page persists')


def task_control(p, task):
    q = p.locator(f'[data-sorter-answer="{task["id"]}"]')
    q.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
    return q


def answer(p, task, raw):
    control = task_control(p, task)
    if task['kind'] == 'choice':
        control.select_option(raw)
    else:
        control.fill(raw)


def check_task(p, task, raw):
    answer(p, task, raw)
    click(p, f'[data-sorter-check="{task["id"]}"]')
    ok(p.locator(f'[data-sorter-result="{task["id"]}"]').evaluate('x=>document.activeElement===x'), 'checked feedback receives focus')
    return work(p)['checks'][-1]


def run_model(p, preset):
    click(p, f'[data-sorter-run="{preset}"]')
    r = work(p)['runs'][-1]
    ok(p.locator('[data-sorter-run-result]').first.evaluate('x=>document.activeElement===x'), 'new model run focuses visible result')
    return r


def own_plan(p, part, text):
    click(p, f'[data-sorter-plan-mode="{part}"][data-mode="own"]')
    p.locator(f'[data-sorter-plan-text="{part}"]').fill(text)


def fixtures():
    return node("""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startPostOffice,setPostPackingInput} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
import {startSorter,sorterView,runSorter,traceSorter,keepSorter} from './dist/borrowed-sorter-core.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={version:97,raw:['future sibling retained']};
startPostOffice(base,deliveries[0].id);setPostPackingInput(base,'17');
const saved=structuredClone(base);startSorter(saved);const w=sorterView(saved).work;
w.source.id='earlier-small-corpus';w.source.title='Earlier fictional parcel case';
w.source.tasks=w.source.tasks.slice(0,2);w.source.parts=w.source.parts.slice(0,1);w.source.discussions=[];
w.source.tables.test=w.source.tables.test.slice(0,4);w.parcelId=w.source.tables.test[0].id;
const malformed=structuredClone(saved),m=sorterView(malformed).work;m.runs.push({futureRun:true});m.traces.push({futureTrace:true});m.checks.push({futureCheck:true});m.kept={futureKeep:true};
const future=structuredClone(base);future.borrowedSorter={version:99,raw:['unmodified future source']};
const earlierKept=structuredClone(base);startSorter(earlierKept);runSorter(earlierKept,'original');keepSorter(earlierKept);const ew=sorterView(earlierKept).work;ew.page=4;for(const kept of [ew.firstKept,ew.kept])for(const r of kept.runs)delete r.helpBefore;
const invalid=structuredClone(saved);invalid.borrowedSorter.visits[invalid.borrowedSorter.current].source.mode='future-model';
console.log(JSON.stringify({base,saved,malformed,future,invalid,earlierKept}));
""")


def journey(browser, width, base, seeds):
    c,p = setup(browser,width,seeds['base'])
    try:
        go(p,base);preview=book(p)
        ok('borrowedSorter' not in preview, 'preview creates no activity root')
        ok(p.locator('.welcome-film').count()==0, 'direct borrowed sorter opens no unrelated film')
        p.reload();settle(p);ok(book(p)==preview, 'preview reload preserves foreign notebook exactly')
        click(p,'[data-sorter-start]');ok(work(p)['page']==0, 'explicit start opens the first teaching page')
        ok(p.locator('#sorter-heading').evaluate('x=>document.activeElement===x'), 'start focuses the local heading')
        source=copy.deepcopy(work(p)['source']);first_visit=root(p)['current'];bounds(p)
        p.screenshot(path=str(OUT/f'follow-card-{width}.png'),full_page=True)
        ok('lookup' in p.locator('main').inner_text().lower(), 'simulation boundary uses precise lookup vocabulary')
        p.locator('[data-sorter-parcel]').select_option(source['tables']['test'][-1]['id'])
        click(p,'[data-sorter-trace]');trace=work(p)['traces'][-1]
        ok(trace['trace']['destination']=='town' and not trace['trace']['fallback'], 'original large Hill parcel matches Town examples when road ignored')
        ok('trace' in trace['helpBefore'], 'trace records supplied support before revealing it')
        held_trace_book=book(p)
        ok(p.locator('[data-sorter-trace-depth="1"]').count()==1,'manual trace starts at the selected-feature step')
        click(p,'[data-sorter-next-trace]')
        ok(p.locator('[data-sorter-trace-depth="2"]').count()==1 and book(p)==held_trace_book,'next trace line is untimed visual support without extra notebook writes')
        click(p,'[data-sorter-full-trace]')
        ok(p.locator('[data-sorter-trace-depth="4"]').count()==1 and book(p)==held_trace_book,'all trace steps can be revealed without replaying or changing the model')
        t=next(t for t in source['tasks'] if t['page']==0 and t['kind']=='choice')
        wrong=next(q['id'] for q in t['choices'] if q['id']!=t['key'])
        checked=check_task(p,t,wrong);ok(checked['outcome']=='different','wrong routing prediction receives a useful mismatch')
        first_check=copy.deepcopy(work(p)['firstChecks'][t['id']]);checked=check_task(p,t,t['key'])
        ok(checked['outcome']=='match' and work(p)['firstChecks'][t['id']]==first_check,'revised answer retains original source/response')
        click(p,f'[data-sorter-help="{t["id"]}:hint"]')
        ok(f'{t["id"]}:hint' in work(p)['help'],'hint request is kept separately from trace support')
        turn(p,1);bounds(p);r=run_model(p,'original')
        ok(r['result']['correct']==30 and r['result']['total']==40,'original score is30/40')
        ok(r['result']['groups']['town']['correct']==30 and r['result']['groups']['town']['total']==30,'Town denominator is30')
        ok(r['result']['groups']['hill']['correct']==0 and r['result']['groups']['hill']['total']==10,'Hill denominator is10, every Hill parcel misrouted')
        numeric=next(t for t in source['tasks'] if t['page']==1 and t['kind']=='integer')
        prior=len(work(p)['checks']);click(p,f'[data-sorter-check="{numeric["id"]}"]')
        ok(len(work(p)['checks'])==prior,'missing numeric answer is not a checked attempt')
        answer(p,numeric,'1e2');click(p,f'[data-sorter-check="{numeric["id"]}"]')
        ok(len(work(p)['checks'])==prior,'unsupported integer syntax creates no attempt')
        checked=check_task(p,numeric,numeric['key']);ok(checked['outcome']=='match','named original-card numeric answer is accepted')
        turn(p,2);bounds(p)
        d=source['discussions'][0];prior=len(work(p)['checks']);click(p,f'[data-sorter-discussion="{d["id"]}:{d["options"][0]["id"]}"]')
        ok(len(work(p)['checks'])==prior and f'{d["id"]}:{d["options"][0]["id"]}' in work(p)['help'],'discussion reply is support, never an assessment')
        turn(p,3);bounds(p);more=run_model(p,'more-examples')
        ok(more['result']['correct']==30 and more['result']['groups']['hill']['correct']==0,'ten extra examples do not fix ignored road feature')
        road=run_model(p,'road-only');ok(road['result']['correct']==40,'road-only matches supplied40parcels')
        ok('baseline'==work(p)['dataset'] and work(p)['features']==['road'],'named profile restores exactly baseline road-only')
        all_features=run_model(p,'all-features');ok(all_features['result']['correct']==34 and all_features['result']['groups']['hill']['correct']==4,'all features loses the unseen large Hill match')
        ok(all_features['result']['rows'][-1]['trace']['fallback'],'all-feature large Hill trace explicitly shows fallback');bounds(p)
        p.screenshot(path=str(OUT/f'compare-models-{width}.png'),full_page=True)
        current=copy.deepcopy(work(p)['runs']);p.locator('[data-sorter-dataset]').select_option('augmented')
        ok(work(p)['runs']==current,'changing examples preserves old run results')
        for feature in ['size','wrap','road']:p.locator(f'[data-sorter-feature="{feature}"]').set_checked(feature=='road')
        fixed=next(t for t in source['tasks'] if t['page']==3 and t['kind']=='integer' and t['key']=='34')
        checked=check_task(p,fixed,'34')
        ok(checked['outcome']=='match' and checked['profile']['dataset']=='baseline' and len(checked['profile']['features'])==3,'fixed question remains about all-features baseline despite augmented road lab')
        turn(p,4);bounds(p);part=source['parts'][0];pid=part['id'];own='\nMy synthetic plan <tag> & exact words.'
        own_plan(p,pid,own);click(p,f'[data-sorter-plan-mode="{pid}"][data-mode="supplied"]')
        p.locator(f'[data-sorter-plan-choice="{pid}"]').select_option(part['options'][0]['id'])
        ok(work(p)['plan'][pid]['own']==own,'supplied choice preserves independent original words')
        click(p,'[data-sorter-keep]');first_keep=copy.deepcopy(work(p)['firstKept'])
        ok(first_keep['supportedParts'][0]['text']==part['options'][0]['text'],'kept supplied letter freezes exact chosen text')
        ok(all('run' in r.get('helpBefore',[]) for r in first_keep['runs']),'kept model results preserve actual earlier supplied support')
        ok(any(x['text']=='' for x in first_keep['renderedParts']),'unfinished letter may be kept honestly')
        click(p,f'[data-sorter-plan-mode="{pid}"][data-mode="own"]')
        ok(p.locator(f'[data-sorter-plan-text="{pid}"]').input_value()==own,'mode switch retains leading newline writing')
        click(p,f'[data-sorter-plan-mode="{pid}"][data-mode="supplied"]')
        p.once('dialog',lambda dialog:dialog.dismiss());click(p,f'[data-sorter-adapt="{pid}"]')
        ok(work(p)['plan'][pid]['own']==own,'cancel starter-copy preserves old writing')
        p.once('dialog',lambda dialog:dialog.accept());click(p,f'[data-sorter-adapt="{pid}"]')
        ok(work(p)['plan'][pid]['mode']=='own' and work(p)['plan'][pid]['own']==part['options'][0]['text'],'confirmed starter copies selected source words into editable own draft')
        ok(f'{pid}:starter' in work(p)['help'],'starter-copy support is recorded')
        p.locator(f'[data-sorter-plan-text="{pid}"]').fill('Revised synthetic recommendation.')
        click(p,'[data-sorter-keep]');ok(work(p)['firstKept']==first_keep and work(p)['kept']!=first_keep,'first advice remains frozen after new advice')
        p.screenshot(path=str(OUT/f'kept-advice-{width}.png'),full_page=True)
        # Refused writing stays visibly present through buttons, keyboard, explorer and hash/Back.
        saved_words=work(p)['plan'][pid]['own'];held=book(p);p.evaluate('window.__sorterRefuse=true')
        p.locator(f'[data-sorter-plan-text="{pid}"]').fill('Visible unsaved synthetic words.')
        ok(book(p)==held and p.locator(f'[data-sorter-plan-text="{pid}"]').input_value()=='Visible unsaved synthetic words.','preflight-refused writing remains visible without notebook mutation')
        for selector in ['[data-sorter-keep]','[data-sorter-page="1"]','#explorer-switch']:
            click(p,selector);ok(book(p)==held,'unsaved draft blocks '+selector)
        p.locator('[data-sorter-page="1"]').first.focus();p.keyboard.press('Enter');ok(work(p)['page']==4,'keyboard navigation cannot discard unsaved draft')
        p.evaluate("location.hash='#home'");p.wait_for_function("location.hash==='#learn/computing/sorting'")
        ok(book(p)==held,'hash guard preserves complete notebook')
        p.evaluate("history.replaceState(null,'','#home');history.pushState(null,'','#learn/computing/sorting')")
        p.go_back();p.wait_for_function("location.hash==='#learn/computing/sorting'")
        ok(p.locator(f'[data-sorter-plan-text="{pid}"]').input_value()=='Visible unsaved synthetic words.','browser Back retains visible refused words')
        p.once('dialog',lambda dialog:dialog.dismiss());click(p,'[data-sorter-restore]')
        ok(p.locator(f'[data-sorter-plan-text="{pid}"]').input_value()=='Visible unsaved synthetic words.','cancel restore preserves unsaved draft')
        p.once('dialog',lambda dialog:dialog.accept());click(p,'[data-sorter-restore]')
        ok(book(p)==held and p.locator(f'[data-sorter-plan-text="{pid}"]').input_value()==saved_words,'confirmed restore discards only unsaved UI words')
        p.evaluate('window.__sorterRefuse=false');snapshot=copy.deepcopy(root(p));identity=active(p)
        p.reload();settle(p);ok(root(p)==snapshot,'reload preserves frozen records/drafts')
        # Real report download/import rather than direct storage copying.
        p.goto(base+'#notes');p.locator('#download').wait_for();ok('Borrowed' in p.locator('main').inner_text(),'notes render the new destination')
        with p.expect_download() as download:click(p,'#download')
        exported=json.loads(Path(download.value.path()).read_text());ok(exported['borrowedSorter']==snapshot,'real report owns exact source/check/letter root')
        p.locator('#progress-file').set_input_files({'name':'synthetic-borrowed-sorter.json','mimeType':'application/json','buffer':json.dumps(exported).encode()})
        p.locator('#progress-import-confirm').wait_for();ok('Borrowed' in p.locator('.import-preview').inner_text(),'import preview identifies new case')
        click(p,'#progress-import-confirm');imported=active(p);ok(imported!=identity,'import creates a separate explorer')
        go(p,base);ok(root(p)==snapshot,'import preserves original sources and outcomes exactly')
        own_plan(p,pid,'Imported explorer advice.');imported_book=copy.deepcopy(root(p));stale=p.locator('[data-sorter-keep]').element_handle()
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{identity}"]');p.locator('[data-sorter-root]').wait_for();held=book(p)
        stale.evaluate('x=>x.click()');ok(book(p)==held and root(p)==snapshot,'stale detached control cannot write into another explorer')
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{imported}"]');p.locator('[data-sorter-root]').wait_for();ok(root(p)==imported_book,'other explorer writing remains independent')
        ok(book(p)['syntheticOther']==seeds['base']['syntheticOther'],'unknown future sibling remains byte-equivalent')
        ok(book(p)['postOffice']['visits'][0]['packing']['input']=='17','waiting Post Office packing input remains exact')
        # Earlier visit remains available after a new investigation.
        retained=copy.deepcopy(work(p));click(p,'[data-sorter-start]');ok(root(p)['current']!=first_visit,'explicit new visit never overwrites old')
        ok(root(p)['visits'][first_visit]==retained,'old complete work stays exact after new visit')
        second_visit=root(p)['current'];serial=root(p)['next']
        click(p,f'[data-sorter-resume="{first_visit}"]')
        ok(work(p)==retained and work(p)['page']==4,'resuming old visit restores original page, source and writing')
        remove=p.locator('[data-sorter-remove-choice]')
        remove.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
        remove.select_option(second_visit);held=book(p)
        p.once('dialog',lambda dialog:dialog.dismiss());click(p,'[data-sorter-remove]')
        ok(book(p)==held,'cancel removal preserves all notebook bytes')
        p.once('dialog',lambda dialog:dialog.accept());click(p,'[data-sorter-remove]')
        ok(second_visit not in root(p)['visits'] and root(p)['next']==serial,'confirmed selected removal keeps monotone allocator and all other visits')
    finally:
        c.close()


def edge_cases(browser,base,seeds):
    c,p=setup(browser,320,seeds['saved'])
    try:
        go(p,base);before=book(p);ok(len(work(p)['source']['tables']['test'])==4,'fewer historical source rows remain readable')
        turn(p,3);r=run_model(p,'');ok(r['result']['groups']['hill']['percent'] is None,'missing destination group has no fabricated percentage')
        ok('No parcels' in p.locator('[data-sorter-run-result]').first.inner_text(),'zero denominator has explicit text')
        ok(work(p)['source']['id']=='earlier-small-corpus','render never upgrades frozen source')
        p.screenshot(path=str(OUT/'historical-small-corpus-320.png'),full_page=True)
    finally:c.close()
    c,p=setup(browser,820,seeds['malformed'])
    try:
        go(p,base);held=copy.deepcopy(root(p));ok(work(p)['checks'][-1]=={'futureCheck':True},'unreadable latest check remains exact')
        turn(p,4);ok('unreadable' in p.locator('main').inner_text().lower() or 'cannot' in p.locator('main').inner_text().lower(),'unreadable optional latest advice is labelled')
        own_plan(p,work(p)['source']['parts'][0]['id'],'Healthy sibling advice.');click(p,'[data-sorter-keep]')
        ok(work(p)['runs'][0]=={'futureRun':True} and work(p)['traces'][0]=={'futureTrace':True},'healthy edits preserve raw malformed child histories')
    finally:c.close()
    c,p=setup(browser,820,seeds['earlierKept'])
    try:
        go(p,base);held=book(p)
        kept=p.locator('[data-sorter-kept]').first
        kept.locator('details').first.evaluate('x=>x.open=true')
        text=' '.join(kept.locator('.sorter-result .sorter-small').all_inner_texts()).lower()
        ok(any(word in text for word in ['not recorded','unobserved','not retained','not captured']),'earlier kept run without support metadata says unobserved rather than none requested')
        ok('none requested' not in text,'missing run support never masquerades as no requested support')
        ok(book(p)==held,'honest missing-support caption is read-only')
    finally:c.close()
    for name in ['future','invalid']:
        c,p=setup(browser,320,seeds[name])
        try:
            go(p,base);held=book(p);ok(book(p)['borrowedSorter']==seeds[name]['borrowedSorter'],'unreadable/future activity remains exact on open')
            ok(p.locator('[data-sorter-page]').count()==0,'future source exposes no editing pages')
            p.reload();settle(p);ok(book(p)==held,'future reload is pure')
        finally:c.close()


if __name__=='__main__':
    server=None;base=os.environ.get('SORTER_TEST_URL')
    if not base:
        server=PreviewServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    try:
        seeds=fixtures()
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
            try:
                for width in [320,820]:journey(browser,width,base,seeds)
                edge_cases(browser,base,seeds);ok(not errors,'no browser page errors: '+str(errors))
                print(f'Borrowed Sorter Chrome: {checks} assertions passed; screenshots {OUT}')
            finally:browser.close()
    finally:
        if server:server.shutdown();server.server_close()
