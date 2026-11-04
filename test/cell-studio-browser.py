"""Native374 Cell Studio journey, frozen sheets and actual Notes transfer.

Invented notebooks only. One820px touch/keyboard journey and320/1024 layout
samples; separately labelled preflight, quota and saving-off faults. Uses the
real app and speech bindings. No physical-device, Safari or audible claim.
"""
import sys
sys.dont_write_bytecode = True

import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('CELL_STUDIO_ARTIFACTS', tempfile.mkdtemp(prefix='cell-studio-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('cell_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h
ROUTE = '#living/bodies'
PARTS = ['wall', 'membrane', 'cytoplasm', 'nucleus', 'vacuole', 'mitochondria', 'ribosomes', 'chloroplasts']


def enter(p, base):
    h.go(p, base, ROUTE, '[data-cs-enter]')
    h.click(p, '[data-cs-enter]')
    p.locator('[data-cs-root]').wait_for()


def choose(p, identity):
    control = p.locator(f'[data-cs-case="{identity}"]')
    control.evaluate('e=>{for(let a=e.parentElement;a;a=a.parentElement)if(a.tagName==="DETAILS")a.open=true}')
    control.click()


def turn(p, number):
    h.click(p, f'[data-cs-turn="{number}"]')


def selected(p):
    return p.locator('[data-cs-part][aria-pressed="true"]').evaluate_all('xs=>xs.map(x=>x.dataset.csPart)')


def focus_is(p, selector):
    return p.locator(selector).evaluate('e=>e===document.activeElement')


def detach(p, selector):
    element = p.locator(selector).first.element_handle()
    element.evaluate('e=>e.remove()')
    return element


def dispatch(element, event='click'):
    element.evaluate('(e,type)=>e.dispatchEvent(new Event(type,{bubbles:true,cancelable:true}))', event)


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator('[data-cs-root] button,[data-cs-root] a,[data-cs-root] summary').evaluate_all('''xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent.trim(),width:x.getBoundingClientRect().width,height:x.getBoundingClientRect().height,font:getComputedStyle(x).fontSize}))''')
    h.ok(not bad, '44px controls and16px text: '+str(bad))


def compare_parts(p, case_id, chosen):
    expected = {
        'leaf': set(PARTS),
        'root': set(PARTS)-{'chloroplasts'},
        'cheek': {'membrane','cytoplasm','nucleus','mitochondria','ribosomes'},
    }[case_id]
    rows = p.locator('[data-cs-comparison] tbody tr')
    h.ok(rows.count()==8, case_id+' comparison retains all eight source-owned rows')
    for index, part in enumerate(PARTS):
        cells = rows.nth(index).locator('td').all_text_contents()
        h.ok(cells==['In my drawing' if part in chosen else 'Not in my drawing',
                     'In this source example' if part in expected else 'Not in this source example'],
             case_id+' independently distinguishes child/reference presence for '+part)
    child = p.locator('.cs-workspace [data-cs-model] [data-cs-symbol]').evaluate_all('xs=>xs.map(x=>x.dataset.csSymbol)')
    reference = p.locator('.cs-workspace [data-cs-source] [data-cs-symbol]').evaluate_all('xs=>xs.map(x=>x.dataset.csSymbol)')
    h.ok(set(child)==set(chosen) and set(reference)==expected,
         case_id+' drawn symbols match the separate child and biological source sets')


def sheets(p):
    return h.book(p)['cellModels']


def import_report(p, base, report):
    h.go(p, base, '#notes', '#progress-file')
    p.locator('#progress-file').set_input_files({'name':'invented-cell-sheets.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for()
    h.ok('Cell' in p.locator('.import-preview').inner_text(), 'actual Notes preview names cell sheets')
    h.click(p, '#progress-import-confirm')


def main():
    fixtures = json.loads(subprocess.check_output(['node','--input-type=module','-e',r'''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startBody} from './dist/body-clues-core.mjs';
import {cellSource,newCellWork} from './dist/cell-studio-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={payload:'Invented sibling retained exactly'};
for(let i=0;i<12;i++)startBody(base,'snail');
const source=cellSource('leaf');source.id='earlier-selected';source.title='Earlier <cell> & source';
source.parts=source.parts.slice(0,3).reverse();source.parts[0].id='old"part]';
source.parts[0].label='Earlier cytoplasm';source.parts[0].role='Earlier role retained exactly.';
source.teaching=['Earlier hidden teaching'];source.note='Earlier selected example note.';
source.futureSource={retained:true};
const work=newCellWork(source);work.selectedIds=[source.parts[0].id];work.futureWork={retained:[1,2]};
const historical={id:'cell-model-80',source,work,futureOuter:{originalOnly:true}};
console.log(JSON.stringify({base,historical,maxImportBytes:MAX_IMPORT_BYTES}));
'''], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('CELL_STUDIO_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            protocol_version = 'HTTP/1.1'
            def log_message(self, *args):
                pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size = 128
            daemon_threads = True
        server = Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    base = base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'), args=['--disable-quic'])
        try:
            _, p = native.setup(browser, fixtures['base'], 'tablet')
            h.go(p, base, ROUTE, '[data-cs-enter]')
            h.ok(p.locator('[data-cs-host]').count()==1 and p.locator('.body-page').count()==1, 'original Body Clues is the entry mode')
            # Remove the actual old target before replacement: the old start
            # handler otherwise prunes the oldest of the12 synthetic visits.
            stale_start = detach(p, '[data-body-start]')
            stale_help = detach(p, '#body-help')
            before = h.book(p)
            h.click(p, '[data-cs-enter]')
            dispatch(stale_start);dispatch(stale_help,'toggle')
            h.ok(h.book(p)==before, 'detached old start/help cannot prune history or record support after mode change')
            h.ok(not p.locator('.body-page,[data-body-start],#body-help').count(), 'studio has no old-key bind targets or help')
            h.ok(selected(p)==[] and 'cellModels' not in h.book(p), 'initial leaf drawing is empty and entry does not initialize saved sheets')
            h.ok(p.locator('[data-cs-model]').count()==1 and not p.locator('[data-cs-source]').count(), 'Build leads with the child drawing without an unrequested comparison')
            h.ok(p.locator('[data-cs-case="root"]').evaluate('e=>{const d=e.closest("details");return !!d&&!d.open}'), 'case chooser is a closed native fold')
            bounds(p)
            h.ok(p.locator('[data-cs-model] .cs-guide').count()==1 and 'guide' in p.locator('[data-cs-model]').inner_text().lower(), 'empty illustration has an explicitly nonbiological layout guide')
            p.locator('[data-cs-part="membrane"]').tap()
            h.ok(p.locator('[data-cs-model] [data-cs-symbol="membrane"]').count()==1 and not p.locator('[data-cs-model] [data-cs-symbol="wall"],[data-cs-model] .cs-guide').count(), 'membrane without wall has no extra outer boundary or guide')
            p.locator('[data-cs-part="nucleus"]').focus();p.keyboard.press('Enter')
            h.ok(set(selected(p))=={'membrane','nucleus'} and focus_is(p,'[data-cs-part="nucleus"]'), 'touch and keyboard add parts and preserve focus')
            h.click(p,'[data-cs-part="membrane"]')
            h.ok(selected(p)==['nucleus'], 'same obvious control removes a selected part')
            for _ in range(3):
                h.click(p,'[data-cs-example]')
            h.ok(selected(p)==['nucleus'], 'manual teaching never autofills the child model')
            h.ok(p.locator('[data-cs-example]').is_disabled() and p.evaluate('!!document.activeElement&&document.activeElement.isConnected&&!document.activeElement.disabled'), 'final teaching frame has a live enabled focus fallback')
            turn(p,1)
            h.ok(focus_is(p,'#cs-title') and p.locator('[data-cs-model]').count()==1 and p.locator('.cs-workspace [data-cs-source]').count()==1, 'manual Compare focuses title and separates child/source diagrams')
            compare_parts(p,'leaf',{'nucleus'})
            h.click(p,'[data-cs-hear]')
            speech = p.locator('[data-cs-hear]').get_attribute('data-speak')
            h.ok('Nucleus' in speech and 'microscope' in speech.lower() and 'Work on a copy' not in speech and 'Kept sheets' not in speech, 'native Hear includes visible biology without navigation/control chatter')
            h.ok(p.locator('.speech-controls').is_visible(), 'normal app speech binding responds')
            turn(p,0)
            h.click(p,'[data-cs-role="mitochondria"]')
            h.ok(selected(p)==['nucleus'], 'reading a role does not change the drawing')
            h.ok(h.book(p)==before, 'all local composition/help/comparison leaves the original notebook exact')
            p.screenshot(path=str(OUT/'tablet-build.png'),full_page=True)
            old_keep = p.locator('[data-cs-keep]').element_handle()
            h.click(p,'[data-cs-keep]');dispatch(old_keep)
            first = copy.deepcopy(sheets(p)[0])
            h.ok(len(sheets(p))==1 and first['work']['selectedIds']==['nucleus'] and first['work']['exampleSeen']==3 and first['work']['comparisonShown'], 'Keep stores selected state and separate disclosures once')
            h.ok({k:v for k,v in h.book(p).items() if k!='cellModels'}==before, 'Keep changes only cellModels')
            h.ok(not p.locator('[data-cs-part],[data-cs-keep],[data-cs-example]').count(), 'kept sheet is immutable')
            h.click(p,'[data-cs-copy]')
            turn(p,0);h.click(p,'[data-cs-part="wall"]')
            choose(p,'root')
            h.ok(selected(p)==[], 'another case starts in its independent empty slot')
            for _ in range(3):h.click(p,'[data-cs-example]')
            turn(p,1)
            compare_parts(p,'root',set())
            h.ok(selected(p)==[], 'root teaching/comparison leaves its drawing empty')
            choose(p,'cheek');turn(p,0)
            h.click(p,'[data-cs-part="chloroplasts"]')
            for _ in range(3):h.click(p,'[data-cs-example]')
            turn(p,1)
            compare_parts(p,'cheek',{'chloroplasts'})
            h.ok(p.locator('[data-cs-source]').count()==2 and not p.locator('[data-cs-source] .cs-guide,[data-cs-source] [data-cs-symbol="wall"]').count(), 'cheek source references in Compare and teaching show no outer guide or wall')
            h.ok(selected(p)==['chloroplasts'], 'cheek permits an arbitrary drawing without correctness gate')
            h.click(p,'[data-cs-keep]')
            h.ok(sheets(p)[1]['work']['selectedIds']==['chloroplasts'], 'arbitrary animal drawing remains keepable')
            h.click(p,'[data-cs-shelf]');h.click(p,'[data-cs-card="cell-model-1"]')
            h.ok('Return to your copy' in p.locator('[data-cs-root]').inner_text(), 'kept sheet names the existing copy slot')
            h.click(p,'[data-cs-copy]');turn(p,0)
            h.ok(set(selected(p))=={'nucleus','wall'} and sheets(p)[0]==first, 'copy slot resumes without overwriting its frozen original')
            choose(p,'leaf')
            h.ok(selected(p)==['nucleus'], 'original case draft remains separate from kept-sheet copy')
            choose(p,'root');turn(p,0)
            h.ok(selected(p)==[], 'empty root slot remains valid after other cases')
            h.click(p,'[data-cs-keep]')
            h.ok(sheets(p)[2]['work']['selectedIds']==[], 'empty drawing can be kept')
            h.click(p,'[data-cs-copy]')
            stale_studio = detach(p,'[data-cs-part="wall"]')
            stale_hear = detach(p,'[data-cs-hear]')
            stale_hear.evaluate('e=>e.dataset.speak="Detached speech sentinel"')
            h.click(p,'[data-cs-legacy]')
            prior = h.book(p)
            dispatch(stale_studio);dispatch(stale_hear)
            h.ok(h.book(p)==prior and stale_hear.get_attribute('data-speak')=='Detached speech sentinel', 'detached studio controls/speech are inert after mode change')
            h.ok(h.book(p)['bodyClues']==before['bodyClues'], 'legacy roundtrip preserves all12 old visits')
            stale_route = detach(p,'[data-body-start]')
            h.go(p,base,'#living','main')
            prior=h.book(p);dispatch(stale_route)
            h.ok(h.book(p)==prior, 'detached old start is inert after route exit')
            enter(p,base)
            h.ok(selected(p)==[], 'route exit clears local drafts')
            exported = native.download(p,base,'tablet-export')
            h.ok(exported['cellModels'][0]==first and exported['syntheticOther']==before['syntheticOther'], 'actual Notes download retains frozen sheet and unknown sibling')

            # Real import into a second explorer. Raw pages include unsupported
            # records and duplicates; old content is shorter and reordered.
            mixed=copy.deepcopy(exported)
            duplicate=copy.deepcopy(first);duplicate['id']='cell-model-5'
            cards=[copy.deepcopy(first),{'id':'cell-model-70','v':99},duplicate,copy.deepcopy(duplicate),copy.deepcopy(fixtures['historical'])]
            for number in range(81,92):
                card=copy.deepcopy(first);card['id']='cell-model-'+str(number);cards.append(card)
            cards.append({'id':'cell-model-900','v':99,'raw':'Invented unavailable sheet'})
            mixed['cellModels']=cards
            _, q=native.setup(browser,fixtures['base'],'transfer')
            h.go(q,base,ROUTE,'[data-cs-enter]')
            original_id,original_book=h.active(q),h.book(q)
            import_report(q,base,mixed)
            h.ok(h.active(q)!=original_id, 'real import creates a separate explorer')
            enter(q,base);h.click(q,'[data-cs-shelf]')
            h.ok('9–16 of 17' in q.locator('[data-cs-root]').inner_text(), 'shelf starts on the page containing the last readable raw record')
            h.click(q,'[data-cs-page="1"]')
            h.ok('17–17 of 17' in q.locator('[data-cs-root]').inner_text() and not q.locator('[data-cs-card]').count(), 'unavailable final record has its own numbered raw page')
            h.click(q,'[data-cs-page="-1"]');h.click(q,'[data-cs-page="-1"]')
            h.ok('1–8 of 17' in q.locator('[data-cs-root]').inner_text() and not q.locator('[data-cs-card="cell-model-5"]').count(), 'duplicates unavailable; raw indices are not compressed')
            h.click(q,'[data-cs-hear]')
            spoken=q.locator('[data-cs-hear]').get_attribute('data-speak')
            h.ok(all(t.strip() in spoken for t in q.locator('[data-cs-card]').all_text_contents()), 'shelf Hear includes current-page frozen sheet labels')
            h.click(q,'[data-cs-card="cell-model-80"]')
            historical=fixtures['historical']
            text=q.locator('[data-cs-root]').inner_text()
            h.ok(historical['source']['title'] in text and 'Earlier hidden teaching' not in text, 'historical title is literal and unopened teaching stays hidden')
            turn(q,1)
            h.ok(not q.locator('[data-cs-comparison],[data-cs-source]').count(), 'read-only sheet cannot reveal its unopened comparison')
            h.click(q,'[data-cs-copy]');turn(q,0)
            h.ok(q.locator('[data-cs-part]').count()==3 and selected(q)==['old"part]'], 'historical copy uses its own shorter/reordered parts and punctuation id')
            child_symbols=q.locator('[data-cs-model] [data-cs-symbol]').evaluate_all('xs=>xs.map(x=>x.dataset.csSymbol)')
            h.ok(child_symbols==['cytoplasm'], 'historical selected punctuation id draws its frozen symbol rather than resolving a current catalogue id')
            turn(q,1)
            reference_symbols=q.locator('.cs-workspace [data-cs-source] [data-cs-symbol]').evaluate_all('xs=>xs.map(x=>x.dataset.csSymbol)')
            h.ok(set(reference_symbols)=={'wall','membrane','cytoplasm'} and q.locator('[data-cs-comparison] tbody tr').count()==3, 'historical reference and comparison use their shorter frozen symbol set')
            turn(q,0)
            # Use the known role of the tray, independent of label decoration.
            old_part=q.locator('[data-cs-part]').first
            old_part.focus();q.keyboard.press('Enter')
            h.ok(selected(q)==[] and old_part.evaluate('e=>e===document.activeElement'), 'historical punctuation id toggles safely and keeps focus')
            h.click(q,'[data-cs-keep]')
            copied=sheets(q)[-1]
            h.ok(copied['id']=='cell-model-901' and copied['source']==historical['source'] and copied['work']['futureWork']==historical['work']['futureWork'] and 'futureOuter' not in copied, 'copy reserves unavailable ids, retains frozen source/work unknowns and omits outer metadata')
            h.ok(sheets(q)[:-1]==cards, 'new copy leaves every imported raw record exact')
            downloaded=native.download(q,base,'imported-redownload')
            h.ok(downloaded['cellModels'][:-1]==cards and downloaded['syntheticOther']==mixed['syntheticOther'], 'real import/redownload preserves malformed, duplicate and unknown data')
            enter(q,base)
            stale_explorer=detach(q,'[data-cs-part="wall"]')
            h.click(q,'[data-cs-legacy]')
            stale_old_explorer=detach(q,'[data-body-start]')
            h.click(q,'#explorer-switch');h.click(q,f'[data-select-explorer="{original_id}"]')
            q.locator('#explorer-header').wait_for()
            dispatch(stale_explorer);dispatch(stale_old_explorer)
            h.ok(h.book(q)==original_book, 'explorer switch rejects both studio and old-key detached targets')

            for name,root in [('unsupported',{'v':99,'raw':'Earlier invented format'}),('exhausted',[{'id':'cell-model-999999','v':99}])]:
                seed=copy.deepcopy(fixtures['base']);seed['cellModels']=root
                _, bad=native.setup(browser,seed,name)
                enter(bad,base);h.click(bad,'[data-cs-part="wall"]')
                old=h.book(bad)
                if bad.locator('[data-cs-keep]').is_enabled():h.click(bad,'[data-cs-keep]')
                h.ok(h.book(bad)==old and selected(bad)==['wall'], name+' saved root stays exact while local exploration remains open')
                h.click(bad,'[data-cs-shelf]');h.click(bad,'[data-cs-legacy]')
                h.ok(bad.locator('.body-page').count()==1, name+' retains navigation to old key')
                h.go(bad,base,'#living/plants','[data-cs-return]')
                invitation=bad.locator('[data-cs-return]').locator('xpath=ancestor::section[1]')
                h.ok('keep an unfinished' not in invitation.inner_text().lower() and 'you can keep' not in invitation.inner_text().lower(), name+' Plant fallback does not promise a save it cannot accept')
                h.ok(h.book(bad)['cellModels']==root, name+' Plant fallback retains the unsupported owner exactly')

            # Plant invitation reads only: both normal and unsupported notebook.
            for broken in [False,True]:
                seed=copy.deepcopy(fixtures['base']);seed['cellModels']=[historical]
                if broken:seed['plantStudy']={'version':99,'raw':'Earlier invented plant format'}
                _, plant=native.setup(browser,seed,'plant-unavailable' if broken else 'plant-supported')
                h.go(plant,base,'#living/plants','[data-cs-return]')
                old=h.book(plant)
                invitation=plant.locator('[data-cs-return]').locator('xpath=ancestor::section[1]')
                if invitation.locator('summary').count():invitation.locator('summary').click()
                text=invitation.inner_text()
                h.ok('Sheet 1' in text and historical['source']['title'] in text and historical['source']['note'] in text and historical['source']['notice'] in text, 'plant invitation uses frozen sheet label/note/notice in '+str(broken))
                h.ok('chloroplast' in text.lower() and 'whole' in text.lower() and invitation.locator('a[href="'+ROUTE+'"]').count()==1, 'plant invitation names evidence limit and explicit studio return')
                h.ok(h.book(plant)==old, 'plant disclosure does not write either saved owner')

            for width in [320,1024]:
                _, sample=native.setup(browser,fixtures['base'],f'width-{width}',width=width)
                enter(sample,base);bounds(sample)
                h.click(sample,'[data-cs-part="vacuole"]');turn(sample,1);bounds(sample)
                h.ok(sample.locator('[data-cs-model]').is_visible() and sample.locator('[data-cs-source]').is_visible(), 'responsive comparison keeps both models reachable')
                sample.screenshot(path=str(OUT/f'width-{width}.png'),full_page=True)

            near_full=copy.deepcopy(exported);near_full['syntheticOther']['payload']=''
            raw=p.evaluate('''({report,cap})=>{const size=new TextEncoder().encode(JSON.stringify(report,null,2)).length;report.syntheticOther.payload='x'.repeat(cap-size-128);return report;}''',{'report':near_full,'cap':fixtures['maxImportBytes']})
            seed={k:v for k,v in raw.items() if k not in ['title','exportedAt','note','explorer','recommendation']}
            _, refusal=native.setup(browser,seed,'notes-preflight-refusal')
            enter(refusal,base);h.click(refusal,'[data-cs-part="wall"]')
            old=h.book(refusal);h.click(refusal,'[data-cs-keep]')
            h.ok(h.book(refusal)==old and selected(refusal)==['wall'] and focus_is(refusal,'#cs-status'), 'real Notes preflight refuses atomically and focuses retained-draft status')
            h.ok('not been kept' in refusal.locator('#cs-status').inner_text(), 'refusal never claims a kept sheet')
            for fault in ['quota','saving-off']:
                _, fault_page=native.setup(browser,fixtures['base'],fault+'-fault')
                if fault=='saving-off':
                    h.go(fault_page,base,'#notes','#remember');fault_page.locator('#remember').uncheck()
                    fault_page.evaluate('location.hash="#living/bodies"');fault_page.locator('[data-cs-enter]').wait_for();h.click(fault_page,'[data-cs-enter]')
                else:enter(fault_page,base)
                if fault=='quota':fault_page.evaluate('''()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Invented quota fault','QuotaExceededError');return native.call(this,k,v);};}''')
                h.click(fault_page,'[data-cs-keep]')
                text=fault_page.locator('#cs-status').inner_text()
                h.ok('open page' in text and 'Download' in text, fault+' truthfully identifies memory-only Keep')
                recovered=native.download(fault_page,base,fault+'-memory-export')
                h.ok(len(recovered['cellModels'])==1, fault+' actual Notes download recovers in-memory sheet')

            # Isolated real-UI module harness for a record becoming unreadable
            # while its card is open. Ordinary app controls cannot manufacture
            # this transition. No app module or network response is intercepted.
            _, harness=native.setup(browser,fixtures['base'],'unavailable-card-module-harness')
            h.go(harness,base,ROUTE,'[data-cs-enter]')
            harness.evaluate("""async seed=>{
              const ui=await import('./cell-studio-ui.mjs');
              const book=structuredClone(seed),owner='invented-unavailable-harness';
              const mount=document.querySelector('main');
              window.cellHarness={book,render:null};
              const render=()=>{mount.innerHTML=ui.cellStudioPage(book,owner);ui.bindCellStudio(book,{explorerId:()=>owner,notebook:()=>book,isActive:()=>true,save:()=>({enabled:true,ok:true}),canExport:()=>true,render,focus:s=>document.querySelector(s)?.focus()});};
              window.cellHarness.render=render;render();
            }""",dict(fixtures['base'],cellModels=[first]))
            h.click(harness,'[data-cs-enter]');h.click(harness,'[data-cs-shelf]')
            h.click(harness,'[data-cs-card="cell-model-1"]')
            harness.evaluate("()=>{window.cellHarness.book.cellModels[0].work={v:99};window.cellHarness.render();}")
            h.ok(not harness.locator('[data-cs-copy]').count() and 'unavailable' in harness.locator('#cs-title').inner_text().lower(), 'isolated actual UI renders unavailable card without editable-copy action')
            h.click(harness,'[data-cs-hear]')
            h.ok('unavailable' in (harness.locator('[data-cs-hear]').get_attribute('data-speak') or '').lower(), 'unavailable card Hear can describe its visible explanation')
            h.click(harness,'[data-cs-shelf]')
            h.ok(not harness.locator('[data-cs-card]').count(), 'unavailable card can navigate back to its raw shelf')
            h.click(harness,'[data-cs-draft]')
            h.ok(harness.locator('[data-cs-part]').count()==8, 'unavailable card retains navigation to a fresh local illustration')
            h.click(harness,'[data-cs-legacy]')
            h.ok(harness.locator('.body-page').count()==1, 'unavailable-card recovery navigation includes the original key')

            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary HTTP requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'scope':'Native820 touch/keyboard;320/1024 layout samples; actual Notes/explorer transfer, old key guards and speech; separate Notes preflight/quota/saving-off probes.'},indent=2))
            print(f'Cell Studio browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for page,label in h.pages:
                if not page.is_closed():
                    try:
                        page.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True)
                        (OUT/(label+'-failure.html')).write_text(page.content())
                    except Exception:pass
            raise
        finally:
            for context in h.contexts:
                try:context.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()


if __name__=='__main__':
    main()
