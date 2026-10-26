"""Synthetic journeys through the actual app. Execute only against frozen production."""
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
OUT = Path(os.environ.get('LEDGER_ARTIFACTS', '/Users/anotherpanacea/Code/Code-Mac/runs/2026-10-26-ledger-gauge/browser'))
OUT.mkdir(parents=True, exist_ok=True)
ROUTE = '#learn/science/ledger'
checks = 0
errors = []
def ok(value, message):
    global checks
    assert value, message
    checks += 1
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
class PreviewServer(http.server.ThreadingHTTPServer):
    request_queue_size = 128

def fixtures():
    code = r"""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import * as L from './dist/ledger-gauge-core.mjs';
import {startPostOffice,setPostPackingInput} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
import {startAdaptiveRival} from './dist/post-rival.mjs';
import {generateRivalTask} from './dist/post-rival-generator.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;base.syntheticOther={version:99,raw:['synthetic exact sibling']};startPostOffice(base,deliveries[0].id);setPostPackingInput(base,'17');
const w=s=>s.ledgerGauge.visits[s.ledgerGauge.current];
function pending(a,b){const s=structuredClone(base);startAdaptiveRival(s);s.postOffice.visits.find(v=>v.id===s.postOffice.current).rival.task=generateRivalTask('multiply',a,b,0);return s;}
const seeds={base,pending:pending(5,10),restored:pending(5,10)};L.startLedger(seeds.restored);
for(const kind of ['folded','missingStage','futureStage','missingLearn','badLearn','otherPage','badModel','archivedHelper','malformedAnswer']){
 const s=pending(kind==='archivedHelper'?7:kind==='malformedAnswer'?2:3,kind==='archivedHelper'?8:kind==='malformedAnswer'?3:10);L.startLedger(s);const v=w(s);v.source.tasks[0].facts=[[2,3]];v.source.tasks[0].context='Synthetic current source: 2 × 3 = 6.';
 if(kind==='folded')v.learn.records.folded=true;
 if(kind==='missingStage')delete v.modelStage;
 if(kind==='futureStage')v.modelStage={future:'exact stage'};
 if(kind==='missingLearn')delete v.learn.records;
 if(kind==='badLearn')v.learn.records={future:'exact learning'};
 if(kind==='badModel')v.source.model={version:99,raw:'earlier model'};
 if(kind==='otherPage'){v.pageId='rain';v.source.tasks.find(t=>t.id===v.tasks.rain).facts=[[2,3]];v.source.tasks.find(t=>t.id===v.tasks.rain).context='Synthetic rain source: 2 × 3 = 6.';}
 if(kind==='archivedHelper'){const hid=v.source.tasks.find(t=>t.id==='period-four').exampleId;v.help.push(hid);v.source.help[hid].text='Synthetic archived 7 × 8 = 56.';v.source.help[hid].facts=[[7,8]];}
 if(kind==='malformedAnswer')v.answers[v.source.tasks[0].id]={future:'exact malformed draft'};
 seeds[kind]=s;
}
const old=structuredClone(base);L.startLedger(old);const o=w(old),s=o.source;s.id='earlier-small-source';s.title='Earlier synthetic ledger';s.tasks=s.tasks.filter(t=>t.id==='period-one');s.tasks[0].id='earlier-maximum';s.tasks[0].fields[0].answer={n:0,d:1};s.tasks[0].fields[1].answer=null;s.tasks[0].context='Earlier empty interval: no maximum is available.';s.records.events=s.records.events.filter(e=>e.year!==4);s.units.cm='earlier height units';s.pages=s.pages.filter(p=>['rain','note'].includes(p.role));for(const p of s.pages){delete p.guidedFor;p.guided=[];}s.parts=s.parts.slice(0,1);s.claims=s.claims.slice(0,1);o.tasks={rain:'earlier-maximum'};o.pageId='rain';o.learn={rain:{count:1,guided:false,folded:false},note:{count:0,guided:false,folded:false}};o.shown=['rain-learn-1'];o.partId=s.parts[0].id;o.claimId=s.claims[0].id;seeds.old=old;
const damaged=structuredClone(old);L.keepLedgerNote(damaged);w(damaged).kept={future:'unreadable latest note'};w(damaged).checks.push({taskId:'earlier-maximum',future:'unreadable latest check'});damaged.ledgerGauge.visits['[raw visit]']={synthetic:'raw exact visit'};seeds.damaged=damaged;
const foldedProvenance=structuredClone(base);L.startLedger(foldedProvenance);const fw=w(foldedProvenance),fp=fw.source.pages.find(p=>p.id==='records');fw.learn.records={count:fp.learn.length,guided:true,folded:true};fw.shown=[];seeds.foldedProvenance=foldedProvenance;
seeds.future=structuredClone(base);seeds.future.ledgerGauge={version:99,raw:['synthetic future exact root']};

const voice=pending(7,8);L.startLedger(voice);const vw=w(voice),vp=vw.source.pages.find(p=>p.id==='records'),vt=vw.source.tasks[0];vp.title='Synthetic audible current title';vp.learn[0].text='VISIBLE_LEARNING_SENTINEL: two times three is six.';vp.learn[0].facts=[[2,3]];vp.learn[1].text='UNREQUESTED_LEARNING_SENTINEL';vt.prompt='Synthetic current numeric question?';vt.context='VISIBLE_CONTEXT_SENTINEL: two times three is six.';vt.facts=[[2,3]];vw.source.help['audio-records'].text='AUDIO_METADATA_SENTINEL';vw.source.help['audio-records'].facts=[[7,8]];vw.source.help[vt.hintId].text='UNREQUESTED_HINT_SENTINEL';vw.source.help[vt.exampleId].text='REQUESTED_EXAMPLE_SENTINEL: a different set of values can be shared equally.';const archive=vw.source.tasks.find(t=>t.id==='period-four').exampleId;vw.source.help[archive].text='ARCHIVED_HELPER_SENTINEL';vw.source.help[archive].facts=[[7,8]];vw.help.push(archive);seeds.voice=voice;
for(const role of ['claims','note']){const n=pending(7,8);L.startLedger(n);let v=w(n),t=v.source.tasks[0];t.context='HIDDEN_TASK_CONTEXT_SENTINEL';t.facts=[[7,8]];for(const field of t.fields)L.answerLedger(n,t.id,field.id,String(field.answer.n));L.checkLedger(n,t.id);v=w(n);t=v.source.tasks[0];t.pageId=role;delete v.tasks.records;v.tasks[role]=t.id;v.pageId=role;v.source.help[t.hintId].text='HIDDEN_TASK_HELPER_SENTINEL';v.source.help[t.hintId].facts=[[7,8]];v.help.push(t.hintId);const page=v.source.pages.find(p=>p.role===role);page.learn[0].text='VISIBLE_ROLE_CONTEXT_SENTINEL: 2 × 3 = 6.';page.learn[0].facts=[[2,3]];v.learn[page.id]={count:1,guided:false,folded:false};v.shown.push(page.learn[0].id);seeds['hiddenTask-'+role]=n;}
const missingInvalid=structuredClone(base);L.startLedger(missingInvalid);delete w(missingInvalid).source.labels.invalid;seeds.missingInvalid=missingInvalid;
const oldTables=structuredClone(old),ot=w(oldTables);ot.source.id='earlier-own-source-tables';ot.source.records.events.find(e=>e.year===15).height=66;ot.source.records.intervals.forEach((i,n)=>i.rainCount=[2,9,4,7][n]);const cp=L.createLedgerSource().pages.find(p=>p.role==='claims');cp.learn=cp.learn.slice(0,1);cp.learn[0].text='Use this earlier copied record.';cp.learn[0].facts=[];ot.source.pages.push(cp);for(const page of ot.source.pages){page.learn.forEach(l=>{l.text='Use this earlier copied record.';l.facts=[];});page.guided=[];delete page.guidedFor;ot.learn[page.id]={count:1,guided:false,folded:false};}ot.shown=[];ot.pageId='claims';ot.source.claims[0].text='Compare the earlier selected records.';for(const key of Object.keys(ot.source.claims[0].replies))ot.source.claims[0].replies[key]='These are the earlier selected observations.';ot.source.parts[0].options.forEach(o=>o.text='This earlier copied ledger has a height of 66 at year 15.');seeds.oldTables=oldTables;
const keptPlan=structuredClone(base);L.startLedger(keptPlan);L.planLedger(keptPlan,'wall');L.keepLedgerNote(keptPlan);const kp=w(keptPlan);kp.pageId='note';kp.planId='sponge';kp.source.plans.find(p=>p.id==='wall').title='CURRENT_CHANGED_PLAN_TITLE_SENTINEL';seeds.keptPlan=keptPlan;
console.log(JSON.stringify(seeds));
"""
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))

def book(p): return p.evaluate('()=>window.__ledgerRead()')
def ledger(p): return book(p)['ledgerGauge']
def work(p):
    r=ledger(p)
    return r['visits'][r['current']]
def active(p): return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
def click(p, selector):
    matches=p.locator(selector)
    if not p.locator(selector+':visible').count():
        matches.evaluate_all("xs=>xs.forEach(x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true})")
    p.locator(selector+':visible').first.click()
def turn(p, page): click(p,f'[data-ledger-page="{page}"]')
def settle(p):
    p.locator('#explorer-header').wait_for()
    chosen=active(p)
    if p.locator(f'[data-select-explorer="{chosen}"]').count(): click(p,f'[data-select-explorer="{chosen}"]')
    p.locator('#ledger-status').wait_for(state='attached')
def go(p, base):
    p.goto(base+ROUTE)
    settle(p)
def setup(browser, width, seed, refuse=False):
    c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True,reduced_motion='reduce')
    c.add_init_script('('+r"""arg=>{
      if(!localStorage.getItem('ledger-synthetic-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(arg.seed));localStorage.setItem('ledger-synthetic-fixture','1');
      }
      window.__ledgerRefuse=arg.refuse;window.__ledgerSpoken=[];window.__ledgerCancels=0;
      const synth={getVoices:()=>[{voiceURI:'synthetic-local',name:'Synthetic local English',lang:'en-US',localService:true,default:true}],cancel:()=>window.__ledgerCancels++,addEventListener:()=>{},removeEventListener:()=>{},speak:u=>{window.__ledgerSpoken.push({text:u.text,book:window.__ledgerRead?.()});u.onstart?.();}};
      Object.defineProperty(window,'speechSynthesis',{configurable:true,value:synth});
      Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text;}}});
    }"""+')('+json.dumps({'seed':seed,'refuse':refuse})+')')
    def app(route):
        response=route.fetch();body=response.text()
        assert 'let graph=null;' in body,'actual app state seam changed'
        body=body.replace('let graph=null;','window.__ledgerRead=()=>structuredClone(state);let graph=null;',1)
        needle='function priceOptions(){return {canExport:candidate=>'
        assert needle in body,'actual shared export preflight seam changed'
        body=body.replace(needle,'function priceOptions(){return {canExport:candidate=>!window.__ledgerRefuse&&',1)
        route.fulfill(response=response,body=body)
    c.route('**/app.mjs',app)
    p=c.new_page();p.set_default_timeout(12000);p.on('pageerror',lambda e:errors.append(str(e)))
    return c,p

def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
    small=p.locator('[data-ledger-root] button,[data-ledger-root] a,[data-ledger-root] summary,[data-ledger-root] input,[data-ledger-root] select,[data-ledger-root] textarea').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length).map(x=>x.matches('input[type=checkbox]')?x.closest('label')||x:x).filter(x=>x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44).map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not small,'44px visible native targets: '+str(small))
def source_tables(p,expected,label):
    drawer=p.locator('.ledger-sources')
    if not drawer.evaluate('x=>x.open'):click(p,'.ledger-sources > summary')
    tables=p.locator('.ledger-source-tables table');ok(tables.count()==2,'own ledger and tally available '+label)
    rows=tables.nth(0).locator('tbody tr').evaluate_all("xs=>xs.map(x=>[...x.querySelectorAll('th,td')].map(c=>c.textContent.trim()))")
    ok(rows==[[str(e['year']),str(e['height'])+' '+expected['units']['cm']] for e in expected['records']['events']],'actual own ledger rows '+label)
    tally=tables.nth(1).locator('tbody tr').evaluate_all("xs=>xs.map(x=>[...x.querySelectorAll('th,td')].map(c=>c.textContent.trim()))")
    ok(tally==[[i['label'],str(i['rainCount'])] for i in expected['records']['intervals']],'actual own copied tally rows '+label)
    ok(drawer.is_visible() and tables.nth(0).is_visible() and tables.nth(1).is_visible(),'record evidence accessible without leaving current page '+label)
def choose_task(p,t):
    turn(p,t['pageId']);p.locator('[data-ledger-task]').select_option(t['id'])
    ok(p.locator('.ledger-task').count()==1 and p.locator('#ledger-question').inner_text()==t['prompt'],'one current source-owned question '+t['id'])
    ok(t['context'] in p.locator('.ledger-task').inner_text(),'current task source context visible '+t['id']);page=next(x for x in work(p)['source']['pages'] if x['id']==t['pageId']);target=page.get('guidedFor');eligible=bool(page['guided']) and (not target or target['kind']=='task' and target['id']==t['id']);ok(p.locator('[data-ledger-learn="guided"]').count()==int(eligible),'Show me how offered only for eligible source target '+t['id']);ok('could not be kept safely' not in p.locator('#ledger-status').inner_text(),'choosing an ineligible guided target gives no false storage warning')
def fill_task(p,t):
    choose_task(p,t)
    if t['kind']=='numeric':
        for f in t['fields']:
            if f['answer'] is None:p.locator(f'[data-ledger-none="{f["id"]}"][data-task="{t["id"]}"]').check()
            else:
                q=f['answer'];raw=str(q['n']) if q['d']==1 else f'{q["n"]}/{q["d"]}'
                p.locator(f'[data-ledger-field="{f["id"]}"][data-task="{t["id"]}"]').fill(raw)
    else:p.locator(f'[data-ledger-answer="{t["id"]}"]').select_option(t['fit'])
    click(p,f'[data-ledger-check="{t["id"]}"]')
    ok(work(p)['checks'][-1]['outcome']=='match','actual check matches '+t['id'])
def own(p,pid,text):
    click(p,f'[data-ledger-mode="own"][data-part="{pid}"]');p.locator(f'[data-ledger-own="{pid}"]').fill(text)
def rival(p):
    b=book(p)
    return next(v for v in b['postOffice']['visits'] if v['id']==b['postOffice']['current'])['rival']
def redownload_root(p,base,expected,name):
    p.goto(base+'#notes');p.locator('#download').wait_for()
    with p.expect_download() as downloaded:click(p,'#download')
    raw=Path(downloaded.value.path()).read_text();(OUT/(name+'.json')).write_text(raw);ok(json.loads(raw)['ledgerGauge']==expected,'actual redownload exact '+name);go(p,base)
def failshot(p,name):
    print('Browser page errors: '+str(errors),flush=True)
    print('Current URL: '+p.url,flush=True)
    p.screenshot(path=str(OUT/(name+'.png')),full_page=True)
    (OUT/(name+'.html')).write_text(p.content());(OUT/(name+'-speech.json')).write_text(json.dumps(p.evaluate('window.__ledgerSpoken||[]'),indent=2))

def journey(browser,width,base,seeds):
    c,p=setup(browser,width,seeds['base'])
    try:
        print(f'Ledger journey {width}: preview, records, teaching',flush=True)
        go(p,base);before=book(p);ok('ledgerGauge' not in before,'preview creates no visit');ok('later' in p.locator('main').inner_text(),'preview notice precedes opening');p.reload();settle(p);ok(book(p)==before,'preview reload pure')
        click(p,'[data-ledger-start]');source=copy.deepcopy(work(p)['source']);visit=ledger(p)['current'];ok(work(p)['pageId']=='records','explicit visit opens records');none_label=p.locator('.ledger-none').first;none_label.click();first_task=source['tasks'][0];ok(first_task['fields'][0]['id'] in work(p)['answers'][first_task['id']]['none'],'full44px checkbox label is clickable');p.locator('.ledger-none').first.click()
        ok(p.locator('[data-ledger-event]').count()==7,'seven time-spaced authored records');coords=p.locator('[data-ledger-event]').evaluate_all("xs=>xs.map(x=>Number(x.getAttribute('x')))");years=[e['year'] for e in source['records']['events']];ratios=[(coords[i+1]-coords[i])/(years[i+1]-years[i]) for i in range(6)];ok(max(ratios)-min(ratios)<0.00001,'plot gaps proportional to year gaps');ok('both changes' in p.locator('.ledger-plot').inner_text(),'year22 labels both changes')
        click(p,'[data-ledger-storm="true"]');ok('160' in p.locator('.ledger-storm').inner_text() and p.locator('[data-ledger-event]').count()==7,'storm separate from seven dated bars');click(p,'[data-ledger-storm="false"]')
        for stage in source['model']['stages']:
            ok(work(p)['modelStage']==stage['id'],'saved source stage '+stage['id']);ok(p.locator('.ledger-stack span').count()==sum(stage['counts']),'countable model total preserved');ok(stage['text'] in p.locator('.ledger-model').inner_text(),'stage caption owns actual model')
            if stage!=source['model']['stages'][-1]:click(p,'[data-ledger-model="next"]')
        click(p,'[data-ledger-model="reset"]');ok(work(p)['modelStage']==source['model']['stages'][0]['id'],'model reset local example')
        for page in source['pages']:
            turn(p,page['id'])
            if page['role'] in ['claims','note']:
                held_history=copy.deepcopy(work(p)['claimHistory']);source_tables(p,source,'before response '+page['role']);ok(work(p)['claimHistory']==held_history,'viewing source tables adds no claim response')
            ok(work(p)['learn'][page['id']]['count']>=1,'first teaching line opens '+page['id'])
            for line in page['learn'][1:]:click(p,'[data-ledger-learn="next"]');ok(line['text'] in p.locator('.ledger-learning').inner_text(),'source teaching line rendered '+line['id'])
            if page['guided']:
                click(p,'[data-ledger-learn="guided"]');ok(all(line['id'] in work(p)['shown'] for line in page['guided']),'guided support recorded '+page['id'])
            held=copy.deepcopy(work(p)['shown']);click(p,'[data-ledger-learn="question"]');ok(work(p)['learn'][page['id']]['folded'],'question folds teaching');ok(work(p)['shown']==held,'fold retains earlier support');ok(not p.locator('.ledger-model').count(),'fold hides model');click(p,'[data-ledger-fold="false"]')
            click(p,f'[data-ledger-help="together-{page["id"]}"]');ok(f'together-{page["id"]}' in work(p)['help'],'thinking support saved')
            click(p,'[data-ledger-root] [data-speak]');spoken=p.evaluate('window.__ledgerSpoken');ok(spoken,'speech stub receives local utterance');said=spoken[-1]['text'];ok(page['title'] in said,'actual current title is spoken');current=work(p);target=next((t for t in source['tasks'] if t['id']==current['tasks'].get(page['id'])),None) if page['role'] in ['records','rain'] else None;ok((target['prompt'] in said and target['context'] in said) if target else (next(c for c in source['claims'] if c['id']==current['claimId'])['text'] in said if page['role']=='claims' else next(x for x in source['parts'] if x['id']==current['partId'])['prompt'] in said),'actual current task/claim/writing prompt spoken');ok(source['help'][f'audio-{page["id"]}']['text'] not in said,'audio provenance body is not the narration');r=spoken[-1]['book']['ledgerGauge'];sw=r['visits'][r['current']];ok(f'audio-{page["id"]}' in sw['help'],'support saved before local playback')
            bounds(p)
        turn(p,'records')
        for card in source['sources']:
            click(p,f'[data-ledger-help="source-{card["id"]}"]');ok(f'source-{card["id"]}' in work(p)['help'],'source drawer request recorded');ok(source['help'][f'source-{card["id"]}']['text'] in p.locator('main').inner_text(),'source drawer exact body')
        print(f'Ledger journey {width}: all questions, claims, note',flush=True)
        for task in source['tasks']:
            fill_task(p,task)
            for hid in [task['hintId'],task['exampleId']]:click(p,f'[data-ledger-help="{hid}"]');ok(hid in work(p)['help'],'task support saved '+hid);ok('could not be kept safely' not in p.locator('#ledger-status').inner_text(),'Hint and Different example usable '+task['id']);
            if task['id']=='mean-before':ok('Add 40 and 60' in p.locator('.ledger-task').inner_text() and '20 and 40 have total 60; 60 ÷ 2 = 30 cm' in p.locator('.ledger-task').inner_text(),'readable helper number words and punctuation independent of source equality')
            count=len(work(p)['checks']);click(p,f'[data-ledger-skip="{task["id"]}"]');ok(task['skipId'] in work(p)['help'] and len(work(p)['checks'])==count,'skip source support without attempt')
        ok(len(work(p)['checks'])==15,'all15questions checked in actual app')
        turn(p,'claims');count=len(work(p)['checks'])
        for card in source['claims']:
            p.locator('[data-ledger-claim]').select_option(card['id']);ok(p.locator('.ledger-claim').count()==1,'one current claim')
            for tray in source['trays']:
                click(p,f'[data-ledger-tray="{tray["id"]}"][data-card="{card["id"]}"]');last=work(p)['claimHistory'][-1];ok(last['reply']==card['replies'][tray['id']] and 'outcome' not in last,'all original ungraded tray replies');ok(last['reply'] in p.locator('.ledger-claim').inner_text(),'actual original reply rendered')
            for hid in [card['hintId'],card['exampleId']]:click(p,f'[data-ledger-help="{hid}"]')
        ok(len(work(p)['claimHistory'])==27 and len(work(p)['checks'])==count,'27claimreplies ungraded');selected_claim=work(p)['claimId'];click(p,'[data-ledger-help="claim-skip"]');ok('claim-skip' in work(p)['help'] and source['help']['claim-skip']['text'] in p.locator('.ledger-claim').inner_text(),'claim leave-open help recorded before text reveal');ok(work(p)['claimId']==selected_claim and len(work(p)['claimHistory'])==27 and len(work(p)['checks'])==count,'claim guidance helper adds no selection or graded attempt')
        turn(p,'note')
        for part in source['parts']:
            p.locator('[data-ledger-part]').select_option(part['id']);ok(p.locator('.ledger-writing').count()==1,'one current writing part');click(p,f'[data-ledger-help="{part["helpId"]}"]')
            options=[o for o in part['options'] if 'planId' not in o]
            if not options:p.locator('[data-ledger-plan]').select_option(source['plans'][0]['id']);options=[o for o in part['options'] if o.get('planId')==source['plans'][0]['id']]
            p.locator(f'[data-ledger-writing-choice="{part["id"]}"]').select_option(options[0]['id']);own(p,part['id'],'\nSynthetic own words for '+part['id']);ok(p.locator(f'[data-ledger-own="{part["id"]}"]').input_value().startswith('\n'),'textarea leading newline retained')
        ok(set(work(p)['help'])==set(source['help']),'all93sourceownedhelpers requested through actual UI');pid=source['parts'][0]['id'];p.locator('[data-ledger-part]').select_option(pid);click(p,'[data-ledger-keep]');first=copy.deepcopy(work(p)['firstKept']);ok(first['renderedParts'][0]['text'].startswith('\n'),'own first note preserves leading newline');click(p,f'[data-ledger-mode="supplied"][data-part="{pid}"]');click(p,'[data-ledger-keep]');ok(work(p)['kept']['renderedParts'][0]['mode']=='supplied' and work(p)['firstKept']==first,'both writing versions and first/latest note')
        p.once('dialog',lambda d:d.dismiss());click(p,f'[data-ledger-starter="{pid}"]');ok(work(p)['writing'][pid]['own'].startswith('\n'),'cancel starter preserves own words');p.once('dialog',lambda d:d.accept());click(p,f'[data-ledger-starter="{pid}"]');ok(work(p)['writing'][pid]['starterUsed'] is True,'confirmed starter records provenance');own(p,pid,'Synthetic adapted starter.');click(p,'[data-ledger-keep]')
        planpart=next(x for x in source['parts'] if any('planId' in o for o in x['options']));p.locator('[data-ledger-part]').select_option(planpart['id']);p.locator('[data-ledger-plan]').select_option(source['plans'][0]['id']);opt=next(o for o in planpart['options'] if o.get('planId')==source['plans'][0]['id']);p.locator(f'[data-ledger-writing-choice="{planpart["id"]}"]').select_option(opt['id']);held_writing=copy.deepcopy(work(p)['writing'])
        for plan in [x['id'] for x in source['plans'][1:]]+['']:
            p.locator('[data-ledger-plan]').select_option(plan);ok(work(p)['writing']==held_writing,'plan switch preserves both writing drafts');ok(p.locator(f'[data-ledger-writing-choice="{planpart["id"]}"]').input_value()==opt['id'],'earlier plan choice stays selected');ok('earlier plan' in p.locator('.ledger-writing').inner_text(),'earlier plan label visible');click(p,'[data-ledger-keep]');ok(work(p)['kept']['closing']==source['closing'],'same Wren close every plan')
        # Stale narration and detached generic preferences cannot play or change local preferences.
        old_audio=p.locator('[data-ledger-root] [data-speak]').element_handle();old_preview=p.locator('[data-preview-voice]').element_handle();old_voice=p.locator('[data-reading-voice]').element_handle();old_speed=p.locator('[data-reading-speed]').element_handle();cancels=p.evaluate('window.__ledgerCancels');turn(p,'records');ok(p.evaluate('window.__ledgerCancels')>cancels,'navigation cancels speech');held=book(p);store=p.evaluate("localStorage.getItem('learning-garden-explorers')");spoken=p.evaluate('window.__ledgerSpoken.length');old_audio.evaluate('x=>x.click()');old_preview.evaluate('x=>x.click()');old_voice.evaluate("x=>{x.value='synthetic-local';x.dispatchEvent(new Event('change',{bubbles:true}))}");old_speed.evaluate("x=>{x.value='0.8';x.dispatchEvent(new Event('change',{bubbles:true}))}");ok(book(p)==held and p.evaluate('window.__ledgerSpoken.length')==spoken and p.evaluate("localStorage.getItem('learning-garden-explorers')")==store,'detached narration/preferences inert')
        # Refused words stay visible through clicks, keyboard, explorer switch, hash and Back.
        turn(p,'note');p.locator('[data-ledger-part]').select_option(pid);saved_words=p.locator(f'[data-ledger-own="{pid}"]').input_value();held=book(p);p.evaluate('window.__ledgerRefuse=true');p.locator(f'[data-ledger-own="{pid}"]').fill('Visible unsaved synthetic words.');ok(book(p)==held,'refused input atomic');ok(p.locator(f'[data-ledger-own="{pid}"]').get_attribute('aria-invalid')=='true','refused field visibly unsaved');click(p,'[data-ledger-keep]');turn(p,'records');click(p,'#explorer-switch');p.locator('[data-ledger-keep]').focus();p.keyboard.press('Enter');p.keyboard.press('Space');ok(book(p)==held and work(p)['pageId']=='note','dirty buttons,keyboard,explorer switch blocked');p.evaluate("location.hash='#home'");p.wait_for_function("location.hash==='#learn/science/ledger'");p.evaluate("history.replaceState(null,'','#home');history.pushState(null,'','#learn/science/ledger')");p.go_back();p.wait_for_function("location.hash==='#learn/science/ledger'");ok(book(p)==held and p.locator(f'[data-ledger-own="{pid}"]').input_value()=='Visible unsaved synthetic words.','dirty hash/Back retains copyable words');p.once('dialog',lambda d:d.dismiss());click(p,'[data-ledger-restore]');ok(p.locator(f'[data-ledger-own="{pid}"]').input_value()=='Visible unsaved synthetic words.','cancel restore retains draft');p.once('dialog',lambda d:d.accept());click(p,'[data-ledger-restore]');ok(p.locator(f'[data-ledger-own="{pid}"]').input_value()==saved_words and book(p)==held,'confirmed restore changes visible fields only');p.evaluate('window.__ledgerRefuse=false')
        ok(book(p).get('story')==before.get('story'),'case never writes story plan or act');saved=copy.deepcopy(ledger(p));identity=active(p);p.screenshot(path=str(OUT/f'case-{width}.png'),full_page=True);p.reload();settle(p);ok(ledger(p)==saved,'actual reload exact frozen root')
        # Real download and actual import creates an independent explorer.
        p.goto(base+'#notes');p.locator('#download').wait_for()
        with p.expect_download() as downloaded:click(p,'#download')
        raw=Path(downloaded.value.path()).read_text();exported=json.loads(raw);(OUT/f'notes-{width}.json').write_text(raw);ok(exported['ledgerGauge']==saved,'real notes download frozen root');p.locator('#progress-file').set_input_files({'name':'synthetic-ledger.json','mimeType':'application/json','buffer':raw.encode()});p.locator('#progress-import-confirm').wait_for();ok('ledger' in p.locator('.import-preview').inner_text().lower(),'actual import preview names destination');click(p,'#progress-import-confirm');imported=active(p);ok(imported!=identity,'import creates independent explorer');go(p,base);ok(ledger(p)==saved,'actual import preserves frozen sources/raw/results')
        turn(p,'note');p.locator('[data-ledger-part]').select_option(pid);own(p,pid,'Imported explorer independent words.');stale=p.locator('[data-ledger-keep]').element_handle();old_audio=p.locator('[data-ledger-root] [data-speak]').element_handle();old_preview=p.locator('[data-preview-voice]').element_handle();old_voice=p.locator('[data-reading-voice]').element_handle();old_speed=p.locator('[data-reading-speed]').element_handle();imported_root=copy.deepcopy(ledger(p));click(p,'#explorer-switch');click(p,f'[data-select-explorer="{identity}"]');p.locator('[data-ledger-root]').wait_for();held=book(p);store=p.evaluate("localStorage.getItem('learning-garden-explorers')");spoken=p.evaluate('window.__ledgerSpoken.length');stale.evaluate('x=>x.click()');old_audio.evaluate('x=>x.click()');old_preview.evaluate('x=>x.click()');old_voice.evaluate("x=>{x.value='synthetic-local';x.dispatchEvent(new Event('change',{bubbles:true}))}");old_speed.evaluate("x=>{x.value='1.15';x.dispatchEvent(new Event('change',{bubbles:true}))}");ok(book(p)==held and ledger(p)==saved and p.evaluate('window.__ledgerSpoken.length')==spoken and p.evaluate("localStorage.getItem('learning-garden-explorers')")==store,'other-explorer detached controls/narration/preferences inert');p.reload();settle(p);ok(ledger(p)==saved,'original explorer exact after reload beside imported explorer');redownload_root(p,base,saved,f'original-redownload-{width}');click(p,'#explorer-switch');click(p,f'[data-select-explorer="{imported}"]');p.locator('[data-ledger-root]').wait_for();ok(ledger(p)==imported_root,'independent explorer writing retained');p.reload();settle(p);ok(ledger(p)==imported_root,'imported explorer exact after reload beside original');redownload_root(p,base,imported_root,f'imported-redownload-{width}');ok(book(p)['syntheticOther']==seeds['base']['syntheticOther'],'foreign raw sibling exact');ok(book(p)['postOffice']['visits'][0]['packing']['input']=='17','pending parcel draft exact')
        for route in ['#desk','#pathways/science','#pathways/math','#learn/science/records','#learn/history/river-room']:
            p.goto(base+route);p.locator('a[href="'+ROUTE+'"]').first.wait_for(state='attached');click(p,'a[href="'+ROUTE+'"]');p.locator('[data-ledger-root]').wait_for();ok(ledger(p)==imported_root,'actual affected invitation '+route)
        bounds(p)
    except Exception:
        failshot(p,f'failure-journey-{width}')
        raise
    finally:c.close()

def review_regressions(browser,base,seeds):
    c,p=setup(browser,820,seeds['voice'])
    try:
        go(p,base);v=work(p);page=next(x for x in v['source']['pages'] if x['id']=='records');task=v['source']['tasks'][0]
        def hear():
            click(p,'[data-ledger-root] [data-speak]');return p.evaluate('window.__ledgerSpoken.at(-1)')
        event=hear();said=event['text'];ok(page['title'] in said and task['prompt'] in said and task['context'] in said,'Hear reads actual current title, prompt and context');ok('VISIBLE_LEARNING_SENTINEL' in said,'visible learning line read aloud');ok(all(x not in said for x in ['AUDIO_METADATA_SENTINEL','UNREQUESTED_LEARNING_SENTINEL','UNREQUESTED_HINT_SENTINEL','ARCHIVED_HELPER_SENTINEL','The current displayed words were made available']),'metadata and unrequested/archived words never replace actual narration');saved=event['book']['ledgerGauge'];ok('audio-records' in saved['visits'][saved['current']]['help'],'audio marker saved before actual page playback');ok('AUDIO_METADATA_SENTINEL' not in p.locator('main').inner_text(),'audio provenance body never rendered');ok(not rival(p).get('priorFactShown') and '2x3' in book(p).get('exposures',[]),'audio metadata7x8 does not qualify while current visible2x3 does')
        click(p,'[data-ledger-fold="true"]');said=hear()['text'];ok('VISIBLE_LEARNING_SENTINEL' not in said and page['learn'][1]['text'] not in said and v['source']['model']['title'] not in said,'folded learning and model are not spoken');ok(task['prompt'] in said and task['context'] in said,'folded card keeps current question narration')
        click(p,f'[data-ledger-help="{task["exampleId"]}"]');said=hear()['text'];ok(v['source']['help'][task['exampleId']]['text'] in said,'requested active example is actually spoken');ok('ARCHIVED_HELPER_SENTINEL' not in said and 'UNREQUESTED_HINT_SENTINEL' not in said,'archived or unrequested helpers remain silent')
        choice=next(t for t in v['source']['tasks'] if t['id']=='count-periods');choose_task(p,choice);said=hear()['text'];ok(choice['prompt'] in said and all(x['text'] in said for x in choice['choices']),'active question choices are read from frozen source');ok(v['source']['help'][task['exampleId']]['text'] not in said,'earlier task helper no longer spoken after selecting another question')
        turn(p,'claims');claim=next(x for x in work(p)['source']['claims'] if x['id']==work(p)['claimId']);ok(claim['text'] in hear()['text'],'actual current claim spoken');turn(p,'note');part=next(x for x in work(p)['source']['parts'] if x['id']==work(p)['partId']);said=hear()['text'];ok(part['title'] in said and part['prompt'] in said,'actual current writing title and prompt spoken')
    except Exception:failshot(p,'failure-review-speech');raise
    finally:c.close()
    for role in ['claims','note']:
        c,p=setup(browser,820,seeds['hiddenTask-'+role])
        try:
            go(p,base);ok(p.locator('.ledger-task').count()==0,'earlier task assigned to '+role+' is not rendered');ok(not rival(p).get('priorFactShown') and '2x3' in book(p).get('exposures',[]),'hidden task/check/helper7x8 excluded beside rendered '+role+' context2x3');ok('VISIBLE_ROLE_CONTEXT_SENTINEL' in p.locator('.ledger-learning').inner_text(),'positive visible role context rendered');click(p,'[data-ledger-root] [data-speak]');said=p.evaluate('window.__ledgerSpoken.at(-1).text');ok('VISIBLE_ROLE_CONTEXT_SENTINEL' in said and 'HIDDEN_TASK_CONTEXT_SENTINEL' not in said and 'HIDDEN_TASK_HELPER_SENTINEL' not in said,'actual '+role+' speech excludes hidden task/check/helper');source_tables(p,work(p)['source'],'earlier task placement '+role)
        except Exception:failshot(p,'failure-hidden-task-'+role);raise
        finally:c.close()
    c,p=setup(browser,320,seeds['oldTables'])
    try:
        go(p,base);expected=copy.deepcopy(work(p)['source']);held=copy.deepcopy(ledger(p));source_tables(p,expected,'older claims before response');ok(len(expected['records']['events'])==6 and expected['records']['events'][0]['height']==66,'older synthetic source differs from current seven-entry record');ok([i['rainCount'] for i in expected['records']['intervals']]==[2,9,4,7],'older copied tally differs from current6/5/6/8');turn(p,'note');source_tables(p,expected,'older note before writing');ok(work(p)['claimHistory']==[] and work(p)['writing']=={} and work(p)['source']==expected,'own older evidence accessible without answering or rewriting source');bounds(p)
    except Exception:failshot(p,'failure-earlier-source-tables');raise
    finally:c.close()
    c,p=setup(browser,820,seeds['missingInvalid'])
    try:
        go(p,base);task=work(p)['source']['tasks'][0];before=book(p);click(p,f'[data-ledger-check="{task["id"]}"]');text=p.locator('#ledger-status').inner_text();ok('Enter a number' in text and 'undefined' not in text and 'could not be kept safely' not in text,'missing old invalid label displays neutral instructions');ok(book(p)==before,'incomplete check with missing label creates no saved attempt');p.locator(f'[data-ledger-field="{task["fields"][0]["id"]}"]').fill('1e3');click(p,f'[data-ledger-check="{task["id"]}"]');ok('Enter a number' in p.locator('#ledger-status').inner_text() and len(work(p)['checks'])==0,'unreadable syntax retains neutral instructions without an attempt')
    except Exception:failshot(p,'failure-missing-invalid');raise
    finally:c.close()
    c,p=setup(browser,820,seeds['keptPlan'])
    try:
        go(p,base);kept=work(p)['kept'];original=next(x for x in kept['source']['plans'] if x['id']==kept['planId']);p.locator('.ledger-kept details[data-ledger-panel^="read-"]').evaluate_all('xs=>xs.forEach(x=>x.open=true)');labels=p.locator('.ledger-kept-plan').all_inner_texts();ok(len(labels)>=4,'first/latest keep and both Read your page views show original plan');ok(all(original['title'] in text and original['text'] in text and 'CURRENT_CHANGED_PLAN_TITLE_SENTINEL' not in text for text in labels),'kept plan uses original selected plan label and description after current source/plan changes');ok(work(p)['planId']=='sponge' and kept['planId']=='wall','current plan and original kept plan remain separate')
    except Exception:failshot(p,'failure-kept-plan');raise
    finally:c.close()

def edges(browser,base,seeds):
    c,p=setup(browser,820,seeds['foldedProvenance'])
    try:
        go(p,base);ok(work(p)['shown']==[],'restored folded teaching has no invented shown provenance');turn(p,'records');ok(work(p)['shown']==[],'revisiting folded page records no hidden lines');click(p,'[data-ledger-fold="false"]');page=next(x for x in work(p)['source']['pages'] if x['id']=='records');ok(set(work(p)['shown'])==set(x['id'] for x in page['learn']+page['guided']),'actual unfold records each displayed line');ok(all(x['text'] in p.locator('.ledger-learning').inner_text() for x in page['learn']+page['guided']),'unfold renders exactly recorded teaching')
    except Exception:failshot(p,'failure-folded-provenance');raise
    finally:c.close()
    for name in ['folded','missingStage','futureStage','missingLearn','badLearn','otherPage','badModel','archivedHelper','malformedAnswer']:
        c,p=setup(browser,820,seeds[name])
        try:
            go(p,base);ok('2x3' in book(p).get('exposures',[]),'positive valid current context rendered '+name);ok('Synthetic' in p.locator('.ledger-task').inner_text(),'actual task context marker '+name)
            if name=='malformedAnswer':ok(rival(p).get('priorFactShown') is True,'malformed draft never hides valid current context');ok(all(x.is_disabled() for x in p.locator('.ledger-task input').all()),'malformed draft inputs read-only only');ok(work(p)['answers']==seeds[name]['ledgerGauge']['visits'][seeds[name]['ledgerGauge']['current']]['answers'],'malformed raw answer retained')
            else:ok(not rival(p).get('priorFactShown'),'hidden/archived model/helper does not qualify pending fact '+name)
            if name=='archivedHelper':ok('5x10' in book(p).get('exposures',[]) and p.locator('.ledger-model').count()==1,'visible model positive control');ok('Synthetic archived' not in p.locator('main').inner_text(),'archived helper body hidden')
            else:ok(p.locator('.ledger-model').count()==(1 if name=='malformedAnswer' else 0),'model drawn exactly when actually readable/unfolded and valid')
        except Exception:failshot(p,'failure-'+name);raise
        finally:c.close()
    for name in ['old','damaged','future']:
        c,p=setup(browser,320,seeds[name])
        try:
            go(p,base);held=copy.deepcopy(ledger(p))
            if name=='future':ok(not p.locator('[data-ledger-start]').count(),'future root read-only');ok(ledger(p)==held,'future root exact');p.goto(base+'#pathways/science');p.locator('a[href="'+ROUTE+'"]').first.wait_for(state='attached');ok(ledger(p)==held,'other destinations open around future root')
            else:
                ok('Earlier empty interval' in p.locator('.ledger-task').inner_text(),'earlier own source prompt/context');fill_task(p,work(p)['source']['tasks'][0]);ok('Not available' in p.locator('.ledger-table-wrap').first.inner_text(),'older empty maximum unavailable');turn(p,'note');ok(p.locator('[data-ledger-part] option').count()==2,'one earlier writing part with chooser placeholder');own(p,work(p)['source']['parts'][0]['id'],'Healthy synthetic old-source note.');click(p,'[data-ledger-keep]');ok(work(p)['source']==held['visits'][held['current']]['source'],'old unknown source never current-catalog rewritten')
                if name=='damaged':
                    ok(work(p)['checks'][0]=={'taskId':'earlier-maximum','future':'unreadable latest check'},'raw malformed check retained');p.locator('[data-ledger-remove-choice]').evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}");p.locator('[data-ledger-remove-choice]').select_option('[raw visit]');before=copy.deepcopy(work(p));serial=ledger(p)['next'];p.once('dialog',lambda d:d.accept());click(p,'[data-ledger-remove]');ok('[raw visit]' not in ledger(p)['visits'] and work(p)==before and ledger(p)['next']==serial,'confirmed raw-key deletion preserves healthy visit and serial')
        except Exception:failshot(p,'failure-'+name);raise
        finally:c.close()
    c,p=setup(browser,820,seeds['pending'])
    try:
        go(p,base);ok(not rival(p).get('priorFactShown'),'preview has no model facts');p.evaluate('window.__ledgerRefuse=true');held=book(p);click(p,'[data-ledger-start]');ok(book(p)==held and not rival(p).get('priorFactShown'),'refused start leaks no model/exposures');p.evaluate('window.__ledgerRefuse=false');click(p,'[data-ledger-start]');ok(rival(p).get('priorFactShown') is True and '5x10' in book(p).get('exposures',[]),'actual app visible5x10 model positive');held=book(p);p.evaluate('window.__ledgerRefuse=true');turn(p,'rain');click(p,'[data-ledger-learn="next"]');click(p,'[data-ledger-model="next"]');spoken=p.evaluate('window.__ledgerSpoken.length');click(p,'[data-ledger-root] [data-speak]');ok(book(p)==held and p.evaluate('window.__ledgerSpoken.length')==spoken,'refused page/teaching/model/audio atomic')
    except Exception:failshot(p,'failure-pending');raise
    finally:c.close()
    c,p=setup(browser,820,seeds['restored'],refuse=True)
    try:go(p,base);ok(ledger(p)==seeds['restored']['ledgerGauge'],'restored refused display keeps exact work');ok(not p.locator('.ledger-model').count() and '5x10' not in book(p).get('exposures',[]),'restored math refused before rendering/exposure')
    except Exception:failshot(p,'failure-restored');raise
    finally:c.close()

def legacy_transfer(browser,base,seeds):
    path=os.environ.get('LEDGER_LEGACY_REPORT')
    if not path:return
    raw=Path(path).read_text();legacy=json.loads(raw);c,p=setup(browser,820,seeds['base'])
    try:
        go(p,base);original=book(p);identity=active(p);p.goto(base+'#notes');p.locator('#progress-file').wait_for();p.locator('#progress-file').set_input_files({'name':'synthetic-earlier-full-support.json','mimeType':'application/json','buffer':raw.encode()});p.locator('#progress-import-confirm').wait_for();click(p,'#progress-import-confirm');imported=active(p);ok(imported!=identity,'actual earlier full-snapshot import adds second explorer without clearing first');go(p,base);ok(ledger(p)==legacy['ledgerGauge'],'earlier full source/check/claim/keep snapshots restore exactly');p.goto(base+'#notes')
        with p.expect_download() as downloaded:click(p,'#download')
        exported=json.loads(Path(downloaded.value.path()).read_text());ok(exported['ledgerGauge']==legacy['ledgerGauge'],'actual legacy redownload keeps exact old snapshot values');click(p,'#explorer-switch');click(p,f'[data-select-explorer="{identity}"]');p.locator('#explorer-header').wait_for();ok(book(p)==original,'legacy import preserves original synthetic explorer completely')
    except Exception:failshot(p,'failure-legacy-transfer');raise
    finally:c.close()

if __name__=='__main__':
    server=None;base=os.environ.get('LEDGER_TEST_URL')
    if not base:
        server=PreviewServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    try:
        seeds=fixtures()
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
            try:
                for width in [320,820]:journey(browser,width,base,seeds)
                edges(browser,base,seeds);review_regressions(browser,base,seeds);legacy_transfer(browser,base,seeds);ok(not errors,'no actual page errors '+str(errors));print(f'Ledger Chrome: {checks} assertions passed; synthetic artifacts {OUT}')
            finally:browser.close()
    finally:
        if server:server.shutdown()
