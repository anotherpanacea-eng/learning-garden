"""Synthetic Town Record journeys through the real app and notebook transfer."""
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
OUT = Path(os.environ.get('RECORD_ARTIFACTS', '/tmp/town-record-browser'))
OUT.mkdir(parents=True, exist_ok=True)
ROUTE = '#learn/science/records'
checks = 0
errors = []


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def node(source):
    return json.loads(subprocess.check_output(
        ['node', '--input-type=module', '-e', source], cwd=ROOT, text=True))


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class PreviewServer(http.server.ThreadingHTTPServer):
    request_queue_size = 128


def book(p):
    return p.evaluate('()=>window.__recordRead()')


def root(p):
    return book(p)['townRecord']


def work(p):
    r = root(p)
    return r['visits'][r['current']]


def run(p):
    w = work(p)
    return next(r for r in w['runs'] if r.get('id') == w['currentRun'])


def click(p, selector):
    controls = p.locator(selector)
    visible = p.locator(selector+':visible')
    if not visible.count():
        controls.evaluate_all("xs=>xs.forEach(x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true})")
        visible = p.locator(selector+':visible')
    visible.first.click()


def active(p):
    return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")


def settle(p):
    p.locator('#explorer-header').wait_for()
    chosen = active(p)
    picker = p.locator(f'[data-select-explorer="{chosen}"]')
    if picker.count():
        click(p, f'[data-select-explorer="{chosen}"]')
    p.locator('[data-record-root]').wait_for()


def go(p, base):
    p.goto(base + ROUTE)
    settle(p)


def setup(browser, width, seed):
    context = browser.new_context(viewport={'width': width, 'height': 1000},
                                  has_touch=True, accept_downloads=True,
                                  reduced_motion='reduce')
    context.add_init_script('('+r"""seed=>{
      if(!localStorage.getItem('record-synthetic-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('record-synthetic-fixture','1');
      }
      window.__recordRefuse=false;
    }"""+')('+json.dumps(seed)+')')

    def app(route):
        response = route.fetch()
        body = response.text()
        assert 'let graph=null,' in body, 'host read seam changed'
        body = body.replace('let graph=null,',
                            'window.__recordRead=()=>structuredClone(state);let graph=null,', 1)
        needle = 'function priceOptions(){return {canExport:candidate=>'
        assert needle in body, 'host preflight seam changed'
        body = body.replace(needle,
            'function priceOptions(){return {canExport:candidate=>!window.__recordRefuse&&', 1)
        route.fulfill(response=response, body=body)

    context.route('**/app.mjs', app)
    page = context.new_page()
    page.set_default_timeout(12000)
    page.on('pageerror', lambda error: errors.append(str(error)))
    return context, page


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no page overflow')
    small = p.locator('.record-page button,.record-page a,.record-page summary,.record-page input,.record-page select,.record-page textarea').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&"
        "(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44))"
        ".map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not small, '44px visible native targets: ' + str(small))


def assert_counts(r):
    # Independent finite-subset oracle from the frozen source, not stored aggregates.
    cells = {c['id']: c for c in r['source']['cells']}
    values = [cells[k]['value'] for k in r['selection']]
    numbers = [v for v in values if v is not None]
    ok(r['plannedCount'] == len(values), 'planned count matches the saved selected slots')
    ok(r['recordedCount'] == len(numbers) and r['missingCount'] == len(values)-len(numbers), 'numeric and missing counts remain distinct')
    ok(r['maximum'] == (max(numbers) if numbers else None), 'maximum uses numeric readings only and null for no readings')
    ok([(v['cellId'],v['value']) for v in r['readings']] == [(k,cells[k]['value']) for k in r['selection']], 'collected readings preserve exact own-source selection and values')


# Additional scenario functions are filled once the independent UI/API contract settles.

def fixtures():
    return node("""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startPostOffice,setPostPackingInput} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
import {startAdaptiveRival} from './dist/post-rival.mjs';
import {generateRivalTask} from './dist/post-rival-generator.mjs';
import {recordFamilies} from './dist/town-record-content.mjs';
import {startRecord} from './dist/town-record-core.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={version:97,raw:['future sibling retained']};
startPostOffice(base,deliveries[0].id);setPostPackingInput(base,'17');
const pending=structuredClone(base);startAdaptiveRival(pending);
const rival=pending.postOffice.visits.find(v=>v.id===pending.postOffice.current).rival;
rival.task=generateRivalTask('multiply',7,4,0);rival.input='29';
const o={canExport:()=>true};
const saved=structuredClone(base);startRecord(saved,recordFamilies[0].id,o);
const w=saved.townRecord.visits[saved.townRecord.current],s=w.source;
s.id='earlier-smaller-week';s.title='An earlier two-day record';s.family='earlier-family';
s.days=s.days.slice(0,2);s.times=s.times.slice(0,2);
const dayIds=new Set(s.days.map(d=>d.id)),timeIds=new Set(s.times.map(t=>t.id));
s.cells=s.cells.filter(c=>dayIds.has(c.dayId)&&timeIds.has(c.timeId));
const cellIds=new Set(s.cells.map(c=>c.id));
s.presets=s.presets.map(p=>({...p,label:'Earlier '+p.label,selection:p.selection.filter(id=>cellIds.has(id))}));
s.gridFacts=[[s.days.length,s.times.length]];
s.columns=['date','time','measurement'].map(role=>s.columns.find(c=>c.role===role)).filter(Boolean);
s.parts=s.parts.slice(0,2);s.questions.forEach(q=>q.choices.reverse());
w.planning=[];w.columns=[];w.plan={};
const malformed=structuredClone(saved),m=malformed.townRecord.visits[malformed.townRecord.current];
m.runs.push({id:'unreadable-run',synthetic:'earlier raw run'});m.currentRun='unreadable-run';
m.checks.push({synthetic:'unreadable latest check'});m.kept={synthetic:'unreadable latest keep'};
malformed.townRecord.visits['[earlier raw key]']={synthetic:'unreadable earlier visit'};
const future=structuredClone(base);future.townRecord={version:99,current:'future',visits:{future:{raw:'exact future words'}}};
const missing=structuredClone(base);startRecord(missing,recordFamilies.find(f=>/unread|missing/i.test(f.id+' '+f.title))?.id||recordFamilies.at(-1).id,o);
const mw=missing.townRecord.visits[missing.townRecord.current];mw.page=1;mw.planning=mw.source.cells.filter(c=>c.value===null).map(c=>c.id);
const zero=structuredClone(base);startRecord(zero,recordFamilies.find(f=>/zero/i.test(f.id+' '+f.title))?.id||recordFamilies[2].id,o);
const zw=zero.townRecord.visits[zero.townRecord.current];zw.page=1;zw.planning=zw.source.cells.filter(c=>c.value===0).map(c=>c.id);
const ownSupport=structuredClone(pending);const ownRival=ownSupport.postOffice.visits.find(v=>v.id===ownSupport.postOffice.current).rival;ownRival.task=generateRivalTask('multiply',5,6,0);
startRecord(ownSupport,recordFamilies[0].id,o);const ow=ownSupport.townRecord.visits[ownSupport.townRecord.current],hid=ow.source.sortTask.exampleId;ow.source.id='earlier-helper-source';ow.source.help[hid]={title:'A different earlier example',text:'An earlier example: 5 × 6 = 30.'};ow.source.helpFacts[hid]=[[5,6]];
const inheritedNames=structuredClone(base);startRecord(inheritedNames,recordFamilies[0].id,o);const inherited=inheritedNames.townRecord.visits[inheritedNames.townRecord.current].source;inherited.questions[0].id='hasOwnProperty';inherited.sortTask.id='isPrototypeOf';inherited.parts[0].id='toLocaleString';inherited.questions[1].page=3;inherited.questions[1].id='later-plan-question';const reservedNames=structuredClone(inheritedNames);reservedNames.townRecord.visits[reservedNames.townRecord.current].source.questions[0].id='toString';
const damaged=structuredClone(base);damaged.townRecord={version:1,current:'[raw-0]',next:17,visits:Object.fromEntries(Array.from({length:16},(_,i)=>['[raw-'+i+']',{synthetic:'unreadable week '+i}]))};
console.log(JSON.stringify({base,pending,saved,malformed,future,missing,zero,ownSupport,inheritedNames,reservedNames,damaged,families:recordFamilies}));
""")


def turn(p, n):
    click(p, f'[data-record-page="{n}"]')


def start(p, family):
    control=p.locator('[data-record-family]')
    if not control.is_visible():
        control.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
    control.select_option(family)
    click(p,'[data-record-start]')


def preset(p, id):
    click(p,f'[data-record-preset="{id}"]')


def collect(p):
    click(p,'[data-record-collect]')
    assert_counts(run(p))
    ok(p.locator('#record-run-result').evaluate('x=>document.activeElement===x'), 'collection focuses the visible run result')


def run_field(p, name, value):
    control=p.locator(f'[data-record-run-field="{name}"]')
    if isinstance(value,bool):
        control.set_checked(value)
    else:
        control.fill(str(value))


def correct_run(p):
    r=run(p)
    for name,key in [('planned','plannedCount'),('recorded','recordedCount'),('missing','missingCount')]:
        run_field(p,name,r[key])
    if r['maximum'] is None:
        run_field(p,'noNumeric',True)
    else:
        run_field(p,'noNumeric',False)
        run_field(p,'highest',r['maximum'])
    click(p,'[data-record-check-run]')
    ok(run(p)['checks'][-1]['outcome']=='match','numeric answers fit only the collected run')
    ok(p.locator('#record-run-check').evaluate('x=>document.activeElement===x'), 'run check focuses visible feedback')


def question(p,qid,choice):
    click(p,f'[data-record-answer="{qid}"][data-choice="{choice}"]')
    click(p,f'[data-record-check="{qid}"]')
    ok(p.locator(f'#record-result-{qid}').evaluate('x=>document.activeElement===x'),'choice result receives focus')


def choose_day(p,cell):
    control=p.locator('[data-record-day]')
    if control.count() and control.is_visible():
        control.select_option(cell['dayId'])


def toggle_slot(p,cell):
    choose_day(p,cell)
    click(p,f'[data-record-slot="{cell["id"]}"]')
    ok(p.evaluate("id=>document.activeElement?.dataset.recordSlot===id&&document.activeElement.getClientRects().length>0",cell['id']),'toggling a slot keeps focus on its visible responsive planner control')


def plan_own(p,part,value):
    click(p,f'[data-record-plan-mode="{part}"][data-mode="own"]')
    p.locator(f'[data-record-plan-text="{part}"]').fill(value)


def journey(browser,width,base,seeds):
    c,p=setup(browser,width,seeds['base'])
    try:
        go(p,base);before=book(p)
        ok('townRecord' not in before,'numeric-free preview creates no record book')
        ok(p.locator('.welcome-film').count()==0,'direct record route opens no unrelated film')
        p.reload();settle(p);ok(book(p)==before,'preview reload retains foreign notebook exactly')
        start(p,seeds['families'][0]['id']);first_visit=root(p)['current']
        ok(work(p)['page']==0 and work(p)['source']['unit']=='cm','explicit start opens the fictional fixed-datum record')
        ok(p.locator('#record-heading').evaluate('x=>document.activeElement===x'),'start focuses a local task heading')
        ok('fixed' in p.locator('main').inner_text().lower(),'measurement reference stays explicit')
        bounds(p)
        source=copy.deepcopy(work(p)['source'])
        # Every offered card owns its classification key and replies.
        before_checks=copy.deepcopy(work(p)['checks']);click(p,f'[data-record-check="{source["sortTask"]["id"]}"]')
        ok(work(p)['checks']==before_checks,'incomplete card group creates no checked attempt')
        for card in source['cards']:
            click(p,f'[data-record-card="{card["id"]}"][data-choice="{card["fit"]}"]')
        click(p,f'[data-record-check="{source["sortTask"]["id"]}"]')
        ok(work(p)['checks'][-1]['outcome']=='match','all record cards use their frozen source-owned classification keys')
        q=next(q for q in source['questions'] if q['page']==0)
        wrong=next(o['id'] for o in q['choices'] if o['id']!=q['fit'])
        question(p,q['id'],wrong);first_choice=copy.deepcopy(work(p)['firstChecks'][q['id']])
        question(p,q['id'],q['fit'])
        ok(work(p)['checks'][-1]['outcome']=='match' and work(p)['firstChecks'][q['id']]==first_choice,'revised choice keeps original first source/outcome')
        secondq=next(q for q in source['questions'] if q['page']==0 and q['id']!=source['questions'][0]['id'])
        panel=p.locator(f'[data-record-panel="question-{secondq["id"]}"]');panel.evaluate('x=>x.open=true')
        p.locator(f'[data-record-panel="question-{q["id"]}"]').evaluate('x=>x.open=false')
        click(p,f'[data-record-panel="question-{secondq["id"]}"] [data-record-help="{secondq["hintId"]}"]')
        ok(p.evaluate("id=>document.activeElement.closest('[data-record-panel=\"question-'+id+'\"]')!==null",secondq['id']),'shared hint focuses the actual requesting question rather than a collapsed copy')
        rewrite='\nSynthetic method <tag> & exact punctuation.'
        p.locator('[data-record-rewrite]').fill(rewrite)
        turn(p,1);bounds(p)
        ok(work(p)['rewrite']==rewrite,'method writing persists across pages')
        ok(not work(p)['runs'],'planning a schedule is not collecting observations')
        first_preset=source['presets'][0]
        preset(p,first_preset['id']);collect(p);first_run=run(p)['id']
        ok(run(p)['maximum']==20,'unrotated weekly supplied schedule has observed maximum20')
        ok('70 cm' not in p.locator('#record-run-result').inner_text(),'uncollected70cm reading stays out of the sampled result text')
        ok(p.locator('#record-run-result [data-record-point]').count()==run(p)['plannedCount'],'sample chart renders only selected slot marks')
        ok(p.locator('#record-run-result polyline').count()==0,'sample chart draws no fabricated continuous curve')
        qpeak=next(q for q in source['questions'] if q['id']=='peak')
        question(p,qpeak['id'],qpeak['fit']);early_general=copy.deepcopy(work(p)['firstChecks'][qpeak['id']])
        shown=' '.join(p.locator(f'#record-result-{qpeak["id"]} .record-check-context').all_inner_texts())
        ok(not run(p)['checks'] and 'Highest collected reading:' not in shown and 'numeric readings and' not in shown,'general claim context does not print unanswered numeric aggregates')
        planned=copy.deepcopy(work(p)['planning']);oldrun=copy.deepcopy(run(p))
        cell=next(c for c in source['cells'] if c['id'] not in planned)
        toggle_slot(p,cell)
        ok(run(p)==oldrun and work(p)['planning']!=planned,'editing planned slots leaves the collected run unchanged')
        day=work(p).get('dayId');turn(p,0);turn(p,1)
        ok(work(p).get('dayId')==day,'narrow-layout planning day persists across pages')
        # Blank/unsupported syntax does not become an answer attempt.
        checks_before=copy.deepcopy(run(p)['checks']);click(p,'[data-record-check-run]')
        ok(run(p)['checks']==checks_before,'incomplete numeric fields add no checked attempt')
        for name in ['planned','recorded','missing','highest']:run_field(p,name,'1e2')
        click(p,'[data-record-check-run]');ok(run(p)['checks']==checks_before,'unsupported number syntax adds no checked attempt')
        correct_run(p);first_numeric=copy.deepcopy(run(p)['firstCheck'])
        run_field(p,'highest','0');click(p,'[data-record-check-run]')
        ok(run(p)['checks'][-1]['outcome']=='different' and run(p)['firstCheck']==first_numeric,'wrong revision retains the original numeric check')
        click(p,'[data-record-full="true"]')
        ok(run(p)['fullSheet'] and run(p)['fullSheetSeen'],'full-sheet support is committed before display')
        ok('highest reading on the sheet' in p.locator('#record-run-result').inner_text().lower(),'comparison maximum is labelled the highest sheet reading rather than true peak')
        qpeak=next(q for q in source['questions'] if q['id']=='peak')
        question(p,qpeak['id'],qpeak['fit'])
        context=copy.deepcopy(work(p)['checks'][-1]['runContext'])
        ok(context['fullSheetSeen'] and context['readings']==run(p)['readings'],'general source claim keeps the collection and full-sheet support visible before checking')
        ok('Your collection when you checked' in p.locator(f'#record-result-{qpeak["id"]}').inner_text(),'general claim renders its saved collection context')
        click(p,'[data-record-full="false"]')
        ok(not run(p)['fullSheet'] and run(p)['fullSheetSeen'],'folding comparison preserves prior support')
        all_preset=max(source['presets'],key=lambda x:len(x['selection']))
        preset(p,all_preset['id']);collect(p);second_run=run(p)['id']
        ok(run(p)['plannedCount']==28 and run(p)['maximum']==70,'all supplied readings show maximum70 without inventing continuous heights')
        ok(run(p)['plannedCount']>source['budget'],'observer budget is a comparison, not a collection lock')
        ok(work(p)['firstChecks'][qpeak['id']]==early_general,'a later collection cannot replace earlier claim context')
        preset(p,all_preset['id']);collect(p)
        ok('repeated collection' in p.locator('#record-run-result').inner_text().lower(),'collecting the same supplied selection again is labelled as a repeated collection')
        click(p,f'[data-record-run="{first_run}"]')
        ok(run(p)['drafts']['highest']=='0' and run(p)['firstCheck']==first_numeric,'resuming an earlier run restores its own draft and checks')
        click(p,f'[data-record-run="{second_run}"]')
        qzero=next(q for q in source['questions'] if q['id']=='zero')
        p.locator(f'[data-record-answer="{qzero["id"]}"]').first.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
        ok('Different example' in p.locator('main').inner_text(),'zero/missing illustrative rows are labelled separately from week observations')
        held_cells=copy.deepcopy(run(p)['readings']);question(p,qzero['id'],qzero['fit'])
        ok(run(p)['readings']==held_cells,'worked-example question does not inject zero/missing values into collected readings')
        # Design a source-owned semantic sheet, then keep a reversible supported/own protocol.
        turn(p,2);bounds(p)
        roles={col['role']:col for col in source['columns'] if col['role'] in ['date','time','measurement']}
        for col in roles.values():click(p,f'[data-record-column="{col["id"]}"]')
        click(p,f'[data-record-check="{source["sheetTask"]["id"]}"]')
        ok(work(p)['checks'][-1]['outcome']=='match','sheet check uses date/time/measurement semantics')
        missed=next(q for q in source['questions'] if q['id']=='missed');panel=p.locator(f'[data-record-panel="question-{missed["id"]}"]');panel.evaluate('x=>x.open=true')
        click(p,f'[data-record-panel="question-{missed["id"]}"] [data-record-help="{missed["hintId"]}"]')
        ok(p.evaluate("id=>document.activeElement.closest('[data-record-panel=\"question-'+id+'\"]')!==null",missed['id']),'a shared sheet hint remains in the missed-reading question')
        turn(p,3);bounds(p)
        part=source['parts'][0];pid=part['id'];own='\nMy original synthetic instructions <tag> & punctuation.'
        plan_own(p,pid,own)
        click(p,f'[data-record-plan-mode="{pid}"][data-mode="supplied"]')
        p.locator(f'[data-record-plan-choice="{pid}"]').select_option(part['options'][0]['id'])
        ok(p.locator(f'[data-record-plan-choice="{pid}"]').evaluate('x=>document.activeElement===x'),'supplied sentence selection keeps keyboard focus on its own select')
        ok(work(p)['plan'][pid]['own']==own,'supplied choice preserves separate original writing')
        click(p,'[data-record-keep]');first_keep=copy.deepcopy(work(p)['firstKept'])
        ok(first_keep['supportedParts'],'kept supplied text is recorded as support')
        click(p,f'[data-record-plan-mode="{pid}"][data-mode="own"]')
        ok(p.locator(f'[data-record-plan-text="{pid}"]').input_value()==own,'mode switch preserves leading-newline own writing')
        p.locator(f'[data-record-plan-text="{pid}"]').fill('Revised original synthetic instructions.')
        click(p,'[data-record-keep]')
        ok(work(p)['firstKept']==first_keep and work(p)['kept']!=first_keep,'first kept book page is immutable after revision')
        ok(work(p)['rewrite']==rewrite,'earlier method writing remains intact after later work')
        p.screenshot(path=str(OUT/f'kept-plan-{width}.png'),full_page=True)
        held_book=copy.deepcopy(root(p));click(p,'a[href="#living/notebook"]');p.locator('main h1').filter(has_text='Field Notebook').wait_for()
        ok(book(p)['townRecord']==held_book,'the Field Notebook invitation opens the real destination and preserves the complete record book')
        go(p,base)
        retained_first=copy.deepcopy(work(p));start(p,seeds['families'][1]['id']);second_visit=root(p)['current'];turn(p,1)
        fresh_source=work(p)['source'];preset(p,max(fresh_source['presets'],key=lambda x:len(x['selection']))['id']);collect(p)
        ok(work(p)['source']['family']!=source['family'] and run(p)['maximum']==35,'a new family changes the supplied week and sampling problem')
        ok(root(p)['visits'][first_visit]==retained_first,'new weeks retain earlier collected schedules and instructions exactly')
        click(p,f'[data-record-resume="{first_visit}"]')
        ok(work(p)==retained_first and work(p)['page']==3,'resuming a prior visit restores its page and original source')
        # Refused writing survives buttons, explorer switching and browser navigation.
        saved_own=work(p)['plan'][pid]['own'];p.evaluate('window.__recordRefuse=true');held=book(p)
        p.locator(f'[data-record-plan-text="{pid}"]').fill('Visible unsaved synthetic words.')
        ok(book(p)==held and p.locator(f'[data-record-plan-text="{pid}"]').input_value()=='Visible unsaved synthetic words.','refused writing remains visible without modifying notebook')
        for selector in ['[data-record-keep]','[data-record-page="1"]','#explorer-switch']:
            click(p,selector);ok(book(p)==held,'pending input blocks action '+selector)
        p.locator('[data-record-page="1"]').first.focus();p.keyboard.press('Enter')
        ok(work(p)['page']==3 and book(p)==held,'keyboard cannot discard refused writing')
        p.evaluate("location.hash='#home'");p.wait_for_function("location.hash==='#learn/science/records'")
        ok(book(p)==held,'direct hash restores the record route while writing is pending')
        p.evaluate("history.replaceState(null,'','#home');history.pushState(null,'','#learn/science/records')")
        p.go_back();p.wait_for_function("location.hash==='#learn/science/records'")
        ok(book(p)==held and p.locator(f'[data-record-plan-text="{pid}"]').input_value()=='Visible unsaved synthetic words.','Back retains the visible refused words')
        p.once('dialog',lambda d:d.dismiss());click(p,'[data-record-restore]')
        ok(p.locator(f'[data-record-plan-text="{pid}"]').input_value()=='Visible unsaved synthetic words.','cancel restore preserves pending words')
        p.once('dialog',lambda d:d.accept());click(p,'[data-record-restore]')
        ok(book(p)==held and p.locator(f'[data-record-plan-text="{pid}"]').input_value()==saved_own,'confirmed restore explicitly recovers last saved writing')
        p.evaluate('window.__recordRefuse=false')
        saved=copy.deepcopy(root(p));identity=active(p);p.reload();settle(p)
        ok(root(p)==saved,'reload retains complete sources, runs, drafts and kept instructions')
        # Exercise the actual public export/import controls rather than a simulated copy.
        p.goto(base+'#notes');p.locator('#download').wait_for()
        ok('Town Record' in p.locator('main').inner_text(),'grown-up report names the new destination')
        with p.expect_download() as downloaded:click(p,'#download')
        exported=json.loads(Path(downloaded.value.path()).read_text())
        ok(exported['townRecord']==saved,'real notebook download owns the exact source/run/plan root')
        p.locator('#progress-file').set_input_files({'name':'synthetic-town-record.json','mimeType':'application/json','buffer':json.dumps(exported).encode()})
        p.locator('#progress-import-confirm').wait_for()
        ok('Town Record' in p.locator('.import-preview').inner_text(),'real import preview names the activity')
        click(p,'#progress-import-confirm');imported=active(p)
        ok(imported!=identity,'import creates a separate explorer')
        go(p,base);ok(root(p)==saved,'imported notebook preserves original work exactly')
        part=work(p)['source']['parts'][0];pid=part['id'];plan_own(p,pid,'Imported explorer words.')
        imported_root=copy.deepcopy(root(p));stale=p.locator('[data-record-keep]').element_handle()
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{identity}"]');p.locator('[data-record-root]').wait_for()
        held=book(p);stale.evaluate('x=>x.click()')
        ok(book(p)==held and root(p)==saved,'stale detached explorer control cannot mutate the current explorer')
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{imported}"]');p.locator('[data-record-root]').wait_for()
        ok(root(p)==imported_root,'second explorer retains independent writing')
        ok(book(p)['syntheticOther']==seeds['base']['syntheticOther'],'future unrelated root remains exact')
        ok(book(p)['postOffice']['visits'][0]['packing']['input']=='17','waiting parcel draft remains exact')
        remove=p.locator('[data-record-remove-choice]');remove.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}");remove.select_option(second_visit)
        held=book(p);serial=root(p)['next'];p.once('dialog',lambda d:d.dismiss());click(p,'[data-record-remove]')
        ok(book(p)==held,'cancel removal preserves all visits')
        p.once('dialog',lambda d:d.accept());click(p,'[data-record-remove]')
        ok(second_visit not in root(p)['visits'] and root(p)['next']==serial,'confirmed selected removal preserves monotone allocator and other work')
    finally:
        c.close()


def edge_cases(browser,base,seeds):
    # A selected run with only missing appointments has no numeric maximum.
    c,p=setup(browser,320,seeds['missing'])
    try:
        go(p,base);collect(p)
        r=run(p);ok(r['recordedCount']==0 and r['missingCount']>0 and r['maximum'] is None,'all-missing selected run has null maximum, not zero')
        for name,key in [('planned','plannedCount'),('recorded','recordedCount'),('missing','missingCount')]:run_field(p,name,r[key])
        run_field(p,'highest','0');click(p,'[data-record-check-run]')
        ok(run(p)['checks'][-1]['outcome']=='different','zero is not accepted as the maximum of no numeric readings')
        correct_run(p)
        click(p,'[data-record-full="true"]')
        ok(run(p)['maximum'] is None,'revealing other supplied readings does not rewrite the selected-run maximum')
        ok('Not read' in p.locator('#record-run-result').inner_text(),'missing readings have a readable nonnumeric representation')
        p.screenshot(path=str(OUT/'all-missing-320.png'),full_page=True)
    finally:c.close()
    c,p=setup(browser,820,seeds['zero'])
    try:
        go(p,base);collect(p);r=run(p)
        ok(r['recordedCount']>0 and r['maximum']==0 and r['missingCount']==0,'zero-valued observations are numeric readings')
        for name,key in [('planned','plannedCount'),('recorded','recordedCount'),('missing','missingCount')]:run_field(p,name,r[key])
        run_field(p,'noNumeric',True);click(p,'[data-record-check-run]')
        ok(run(p)['checks'][-1]['outcome']=='different','No numeric reading is not accepted when actual zeros were collected')
        correct_run(p);bounds(p)
        p.screenshot(path=str(OUT/'actual-zero-820.png'),full_page=True)
    finally:c.close()
    # Saved source IDs, dimensions, options and wording remain owned by that source.
    c,p=setup(browser,820,seeds['saved'])
    try:
        go(p,base)
        ok(work(p)['source']['id']=='earlier-smaller-week','unknown saved source ID remains playable')
        ok(len(work(p)['source']['days'])==2 and len(work(p)['source']['times'])==2,'older smaller day/time arrays stay unchanged')
        turn(p,1);source=work(p)['source'];preset(p,max(source['presets'],key=lambda x:len(x['selection']))['id']);collect(p)
        ok(run(p)['plannedCount']==4,'collection uses four old cells rather than todays28')
        source=run(p)['source']; cells=sorted(source['cells'],key=lambda c:(next(i for i,d in enumerate(source['days']) if d['id']==c['dayId']),next(t['minute'] for t in source['times'] if t['id']==c['timeId'])))
        xs=[float(p.locator(f'[data-record-point="{c["id"]}"]').get_attribute('cx')) for c in cells]
        minutes=[next(i for i,d in enumerate(source['days']) if d['id']==c['dayId'])*1440+next(t['minute'] for t in source['times'] if t['id']==c['timeId']) for c in cells]
        ok(abs((xs[1]-xs[0])/(xs[-1]-xs[0])-(minutes[1]-minutes[0])/(minutes[-1]-minutes[0]))<1e-8,'old smaller source preserves six-hour versus eighteen-hour horizontal intervals')
        correct_run(p)
        turn(p,2)
        for col in work(p)['source']['columns']:click(p,f'[data-record-column="{col["id"]}"]')
        click(p,f'[data-record-check="{work(p)["source"]["sheetTask"]["id"]}"]')
        ok(work(p)['checks'][-1]['outcome']=='match','older three-column semantic sheet works without today catalog count')
        turn(p,3)
        ok(p.locator('[data-record-plan-text]').count()==2,'older source renders only its two own plan parts')
        click(p,'[data-record-keep]')
        ok(len(work(p)['kept']['renderedParts'])==2,'kept instructions preserve older source part count')
    finally:c.close()
    c,p=setup(browser,820,seeds['malformed'])
    try:
        go(p,base);held=copy.deepcopy(root(p));turn(p,1)
        ok(work(p)['runs'][0]=={'id':'unreadable-run','synthetic':'earlier raw run'},'unreadable run is retained without repair')
        source=work(p)['source'];preset(p,max(source['presets'],key=lambda x:len(x['selection']))['id']);collect(p)
        ok(work(p)['runs'][0]==held['visits'][held['current']]['runs'][0] and len(work(p)['runs'])==2,'new collection leaves unreadable sibling raw and available for export')
        turn(p,3)
        ok(work(p)['kept']=={'synthetic':'unreadable latest keep'},'unreadable latest keep never falls back to another version')
        ok('[earlier raw key]' in root(p)['visits'],'malformed optional visit key does not close healthy work')
        p.goto(base+'#notes');p.locator('#download').wait_for()
        with p.expect_download() as downloaded:click(p,'#download')
        exported=json.loads(Path(downloaded.value.path()).read_text())
        ok(exported['townRecord']['visits'][held['current']]['checks'][-1]=={'synthetic':'unreadable latest check'},'actual export retains malformed latest raw check')
        go(p,base);before_remove=copy.deepcopy(root(p)['visits'][root(p)['current']])
        remove=p.locator('[data-record-remove-choice]');remove.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}");remove.select_option('[earlier raw key]')
        p.once('dialog',lambda d:d.accept());click(p,'[data-record-remove]')
        ok('[earlier raw key]' not in root(p)['visits'] and root(p)['visits'][root(p)['current']]==before_remove,'confirmed raw-key removal makes room without resetting healthy work')
    finally:c.close()
    c,p=setup(browser,820,seeds['damaged'])
    try:
        go(p,base);held=copy.deepcopy(root(p));start(p,seeds['families'][0]['id'])
        ok(root(p)==held,'a full unreadable book refuses a new visit without dropping raw records')
        remove=p.locator('[data-record-remove-choice]');remove.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}");remove.select_option('[raw-0]')
        p.once('dialog',lambda d:d.accept());click(p,'[data-record-remove]')
        ok(len(root(p)['visits'])==15 and '[raw-0]' not in root(p)['visits'],'an unreadable current book still offers confirmed raw-record removal')
        start(p,seeds['families'][0]['id'])
        ok(len(root(p)['visits'])==16 and work(p)['source']['family']==seeds['families'][0]['id'],'making room opens a healthy week while keeping other raw records')
    finally:c.close()
    c,p=setup(browser,820,seeds['inheritedNames'])
    try:
        go(p,base);source=work(p)['source'];q=source['questions'][0]
        question(p,q['id'],q['fit'])
        ok(work(p)['answers']['hasOwnProperty']['choiceId']==q['fit'] and work(p)['checks'][-1]['outcome']=='match','a valid earlier task name creates its own answer rather than reading an inherited method')
        for card in source['cards']:click(p,f'[data-record-card="{card["id"]}"][data-choice="{card["fit"]}"]')
        click(p,'[data-record-check="isPrototypeOf"]')
        ok(work(p)['checks'][-1]['outcome']=='match','an earlier card-task name is stored in its own map slot')
        turn(p,3);late=next(q for q in source['questions'] if q['page']==3);question(p,late['id'],late['fit'])
        ok(work(p)['checks'][-1]['taskId']=='later-plan-question' and work(p)['checks'][-1]['outcome']=='match','a supported earlier question on the writing page remains reachable and source-owned')
        part=source['parts'][0]
        ok(p.locator('[data-record-plan-mode="toLocaleString"][data-mode="own"]').get_attribute('aria-pressed')=='true','an absent earlier plan entry begins in own-writing mode')
        plan_own(p,part['id'],'Synthetic own words for an earlier part name.')
        click(p,'[data-record-keep]')
        ok(work(p)['plan']['toLocaleString']['own']=='Synthetic own words for an earlier part name.','earlier part names preserve raw writing normally')
        ok(not p.evaluate("Object.hasOwn(Object.prototype.toLocaleString,'own') || Object.hasOwn(Object.prototype.isPrototypeOf,'assignments')"),'valid source identifiers never write on inherited JavaScript functions')
    finally:c.close()
    c,p=setup(browser,820,seeds['reservedNames'])
    try:
        go(p,base);held=copy.deepcopy(root(p));earlier=root(p)['current']
        ok(not p.locator('[data-record-answer]').count() and not p.locator('[data-record-plan-text]').count(),'shared-export reserved source identifiers are retained read-only rather than offered unexportable edits')
        ok(root(p)==held,'unsupported reserved identifiers remain raw and unchanged')
        start(p,seeds['families'][1]['id'])
        ok(root(p)['visits'][earlier]==held['visits'][earlier] and root(p)['current']!=earlier,'a healthy new week stays open around an unsupported optional source')
    finally:c.close()
    c,p=setup(browser,320,seeds['future'])
    try:
        go(p,base);held=book(p)
        ok(not p.locator('[data-record-start]').count(),'future root offers no edit controls')
        ok(book(p)==held,'future root is byte-identical after display')
        p.goto(base+'#pathways/science');p.locator('[data-pathway-root]').wait_for()
        ok(book(p)['townRecord']==seeds['future']['townRecord'],'other destinations stay open around a future record root')
    finally:c.close()
    # The model grid must qualify a matching waiting fact before displaying the grid.
    c,p=setup(browser,820,seeds['pending'])
    try:
        go(p,base)
        def rival():return next(v for v in book(p)['postOffice']['visits'] if v['id']==book(p)['postOffice']['current'])['rival']
        before=copy.deepcopy(rival());ok(not before.get('priorFactShown'),'numeric-free record preview leaves pending7x4 fresh')
        start(p,seeds['families'][0]['id']);held=book(p)
        ok(not rival().get('priorFactShown'),'method cards do not pretend the sampling grid was seen')
        p.evaluate('window.__recordRefuse=true');turn(p,1)
        ok(book(p)==held and work(p)['page']==0 and not rival().get('priorFactShown'),'refused page change exposes no grid and qualifies no pending fact')
        p.evaluate('window.__recordRefuse=false');turn(p,1)
        expected=copy.deepcopy(before);expected['priorFactShown']=True
        ok(rival()==expected,'actual displayed7x4 grid qualifies only the matching pending task flag')
        ok('7x4' in book(p).get('exposures',[]),'actual host records the displayed grid product')
        preset(p,work(p)['source']['presets'][0]['id']);held=book(p);p.evaluate('window.__recordRefuse=true');click(p,'[data-record-collect]')
        ok(book(p)==held and not work(p)['runs'],'refused collection records no run or hidden readings')
        p.evaluate('window.__recordRefuse=false');collect(p);held=book(p);p.evaluate('window.__recordRefuse=true');click(p,'[data-record-full="true"]')
        ok(book(p)==held and not run(p)['fullSheetSeen'],'refused comparison reveals no full sheet or support record')
    finally:c.close()
    # Retained helper prose qualifies its OWN facts, not todays shared example.
    c,p=setup(browser,820,seeds['ownSupport'])
    try:
        go(p,base);source=work(p)['source'];hid=source['sortTask']['exampleId']
        held=book(p);p.evaluate('window.__recordRefuse=true');click(p,f'[data-record-help="{hid}"]')
        ok(book(p)==held and '5x6' not in book(p).get('exposures',[]),'refused older helper qualifies nothing')
        p.evaluate('window.__recordRefuse=false');click(p,f'[data-record-help="{hid}"]')
        r=next(v for v in book(p)['postOffice']['visits'] if v['id']==book(p)['postOffice']['current'])['rival']
        ok(r.get('priorFactShown') is True and '5x6' in book(p).get('exposures',[]),'saved helper qualifies its own exact pending product')
        ok('5 × 6 = 30' in p.locator('main').inner_text(),'actual retained helper text remains visible')
    finally:c.close()


if __name__=='__main__':
    server=None
    base=os.environ.get('RECORD_TEST_URL')
    if not base:
        server=PreviewServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    try:
        seeds=fixtures()
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get(
                'CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
            try:
                for width in [320,820]:journey(browser,width,base,seeds)
                edge_cases(browser,base,seeds)
                ok(not errors,'no browser page errors: '+str(errors))
                print(f'Town Record Chrome: {checks} assertions passed; screenshots {OUT}')
            finally:browser.close()
    finally:
        if server:server.shutdown();server.server_close()
