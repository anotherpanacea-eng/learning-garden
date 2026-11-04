"""Native373 Question Bench journey and actual Notes transfer.

Generic invented fixtures only. One 820px touch/keyboard journey plus 320/1024
samples; explicitly separate Notes-capacity, device quota and saving-off probes.
Uses the installed Chrome and normal application/speech bindings. This does not
qualify audible speech, Safari, physical devices, accessibility tools or learning.
"""
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('QUESTION_BENCH_ARTIFACTS', tempfile.mkdtemp(prefix='question-bench-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('native_estimate_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h
ROUTE = '#workshop/fair'


def enter(p, base):
    h.go(p, base, ROUTE, '[data-qb-enter]')
    h.click(p, '[data-qb-enter]')
    p.locator('[data-qb-root]').wait_for()


def turn(p, number):
    h.click(p, f'[data-qb-turn="{number}"]')


def start(p, source='seedlings'):
    h.click(p, f'[data-qb-case="{source}"]')
    p.locator('#qb-question').wait_for()


def wording(p, mode):
    h.click(p, f'[data-qb-wording="{mode}"]')


def focus_is(p, selector):
    return p.locator(selector).evaluate('e=>e===document.activeElement')


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator('[data-qb-root] button,[data-qb-root] a,[data-qb-root] summary,[data-qb-root] textarea').evaluate_all('''xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent.trim(),rect:[x.getBoundingClientRect().width,x.getBoundingClientRect().height],font:getComputedStyle(x).fontSize}))''')
    h.ok(not bad, 'actual controls meet44px and16px: '+str(bad))


def detach(p, selector):
    target = p.locator(selector).first.element_handle()
    target.evaluate('e=>e.remove()')
    return target


def stale_events(handles):
    for element, event in handles:
        element.evaluate('''(e,event)=>{if(e.tagName==='TEXTAREA')e.value='Detached invented text';if(e.tagName==='SELECT')e.selectedIndex=(e.selectedIndex+1)%e.options.length;if(e.tagName==='DETAILS')e.open=true;e.dispatchEvent(new Event(event,{bubbles:true,cancelable:true}));}''', event)


def download(p, base, label):
    return native.download(p, base, label)


def import_report(p, base, report):
    h.go(p, base, '#notes', '#progress-file')
    p.locator('#progress-file').set_input_files({'name':'invented-question-cards.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for()
    h.ok('Question' in p.locator('.import-preview').inner_text(), 'actual import preview names question cards')
    h.click(p, '#progress-import-confirm')


def kept(p):
    return h.book(p)['questionCards']


def main():
    fixture_code = r"""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startFair,setFairPage,setFairNote,revealFair} from './dist/fair-test-core.mjs';
import {startApprentice} from './dist/fair-test-apprentice-core.mjs';
import {questionSource,newQuestionWork} from './dist/question-bench-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={payload:'Invented sibling survives transfer'};
startFair(base);revealFair(base,'A');setFairPage(base,'tell');setFairNote(base,'  Original fictional ramp note.\n  ');
const apprentice=structuredClone(base);startApprentice(apprentice,'height');
const broken=structuredClone(apprentice);broken.fairTests.apprentice={version:99,raw:'Earlier invented child data'};
const unavailable=structuredClone(base);unavailable.fairTests={version:99,raw:'Earlier invented ramp format'};
const source=questionSource('seedlings');source.id='earlier-invented';source.title='Earlier <question> & context';source.focus=source.focus.slice(0,1);source.focus[0].id='old"focus]';source.contexts.push({id:'old"context]',label:'Earlier third context'});source.questions=source.contexts.map(context=>({focusId:source.focus[0].id,contextId:context.id,text:'Earlier exact question: '+context.label+'?'}));source.ways=source.ways.slice(0,1);source.ways[0].id='old"way]';source.teaching=['Earlier exact example'];source.glossary=source.glossary.slice(0,1);source.futureSource={retained:true};
const work=newQuestionWork(source);work.focusId=source.focus[0].id;work.contextId=source.contexts[2].id;work.wording='own';work.customQuestion='  Earlier invented wording 🌱\n  ';work.futureWork={retained:[1,2]};
const historical={id:'question-card-80',source,work,futureOuter:{originalOnly:true}};
console.log(JSON.stringify({base,apprentice,broken,unavailable,historical,maxImportBytes:MAX_IMPORT_BYTES}));
"""
    fixtures = json.loads(subprocess.check_output(['node','--input-type=module','-e',fixture_code],cwd=ROOT,text=True))
    server = None
    base = os.environ.get('QUESTION_BENCH_TEST_URL')
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
        browser = pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            _, p = native.setup(browser,fixtures['base'],'tablet')
            h.go(p,base,ROUTE,'[data-qb-enter]')
            h.ok(p.locator('.fair-page').count()==1 and not p.locator('[data-qb-root]').count(), 'Fair Test remains the initial native mode')
            # Existing Hear must have the actual bindSpeech interaction, current
            # payload and feedback. Do not substitute speechSynthesis or claim audio.
            h.click(p,'#fair-help>summary')
            hear = p.locator('#fair-help [data-speak]')
            payload = hear.get_attribute('data-speak')
            h.ok('Change one factor' in payload and 'stopping distance' in payload, 'legacy Fair Hear retains its current help payload')
            hear.click()
            h.ok(p.locator('.speech-controls').is_visible() and bool(p.locator('[data-speech-status]').inner_text()), 'actual app bindSpeech responds to legacy Hear')
            # Each target is separately removed before the adapter replaces the
            # legacy surface. A capture guard on the parent alone cannot pass.
            detached = [(detach(p,'#fair-note'),'input'),(detach(p,'[data-fair-support]'),'click'),(detach(p,'#fair-help'),'toggle')]
            h.click(p,'[data-fair-page="plan"]')
            detached += [(detach(p,'#fair-mission'),'change'),(detach(p,'[data-fair-start]'),'click')]
            stale_hear = detach(p,'.fair-page [data-speak]')
            before = h.book(p)
            h.click(p,'[data-qb-enter]')
            stale_events(detached+[(stale_hear,'click')])
            h.ok(h.book(p)==before, 'separately detached legacy click/change/input/toggle and speech targets cannot write')
            h.ok(not p.locator('.fair-page,[id^="fair-"],[data-apprentice-page]').count(), 'new mode has its own surface and hides legacy how-to')
            h.click(p,'[data-qb-hear]')
            board_spoken=p.locator('[data-qb-hear]').get_attribute('data-speak')
            h.ok(all(t in board_spoken for t in p.locator('.qb-slip strong').all_text_contents()),'Hear includes the current wonder titles inside choice buttons')
            start(p)
            bounds(p)
            for tray in ['focus','context']:
                primary=p.locator(f'[data-qb-{tray}]').first.bounding_box()
                h.ok(primary and primary['y']+primary['height']<=1000, 'tablet composition exposes primary '+tray+' chips in the first screen')
            p.screenshot(path=str(OUT/'tablet-initial-compose.png'),full_page=True)
            # Four independent authored combinations on the same card.
            expected = {
                ('stem','setups'):['stem','day 6','enough light','too little light'],
                ('stem','time'):['stem','day 0','day 6','enough light'],
                ('leaf','setups'):['leaf spread','day 6','enough light','too little light'],
                ('leaf','time'):['leaf spread','day 0','day 6','enough light']}
            for (focus, context), meaning in expected.items():
                p.locator(f'[data-qb-focus="{focus}"]').tap()
                p.locator(f'[data-qb-context="{context}"]').focus()
                p.keyboard.press('Enter')
                h.ok(focus_is(p,f'[data-qb-context="{context}"]'), 'keyboard chip selection retains focus on live context control')
                h.ok(all(part in p.locator('#qb-question').inner_text() for part in meaning), 'piece composition keeps the chosen feature and context '+focus+'/'+context)
            pieces = p.locator('#qb-question').inner_text()
            wording(p,'own')
            h.ok(p.locator('#qb-own').input_value()=='' and p.locator('#qb-own').get_attribute('maxlength') is None, 'own field starts empty without maxlength')
            blank='  \n\t  '
            p.locator('#qb-own').fill(blank)
            h.ok(p.locator('#qb-own').input_value()==blank and p.locator('#qb-question').inner_text()=='Your question can wait here.', 'whitespace-only own wording stays exact while paper gives its unfinished fallback')
            wording(p,'pieces');wording(p,'own')
            h.ok(p.locator('#qb-own').input_value()==blank, 'whitespace-only pending input survives wording switches')
            custom = '\n  Invented leaf question 🌱\nWhich record?  '
            p.locator('#qb-own').fill(custom)
            wording(p,'pieces')
            h.ok(p.locator('#qb-question').inner_text()==pieces, 'switching to pieces retains both chosen pieces')
            wording(p,'own')
            h.ok(p.locator('#qb-own').input_value()==custom, 'own wording retains exact whitespace and emoji')
            p.locator('#qb-own').focus();p.keyboard.press('End');p.keyboard.type('x')
            custom+='x'
            h.ok(p.locator('#qb-own').input_value()==custom,'a keystroke after mode changes preserves the leading newline')
            over = '🌱'*601
            p.locator('#qb-own').fill(over)
            h.ok('601 / 600' in p.locator('[data-qb-root]').inner_text(), 'counter uses Unicode code points')
            turn(p,1)
            turn(p,2)
            h.click(p,'[data-qb-keep]')
            h.ok('questionCards' not in h.book(p) and focus_is(p,'#qb-status'), 'overlength Keep refuses without a saved owner and focuses status')
            h.click(p,'[data-qb-board]')
            start(p,'frogs')
            h.click(p,'[data-qb-focus="food"]')
            h.click(p,'[data-qb-context="frog"]')
            h.click(p,'[data-qb-shelf]')
            h.click(p,'[data-qb-board]')
            start(p)
            turn(p,0)
            wording(p,'pieces'); wording(p,'own')
            h.ok(p.locator('#qb-own').input_value()==over, 'overlength raw input survives turns, board, shelf and wording switches')
            p.locator('#qb-own').fill(custom)
            turn(p,1)
            for way in ['research','watch','compare','ask']:
                h.click(p,f'[data-qb-way="{way}"]')
                text = p.locator('[data-qb-root]').inner_text()
                h.ok('What it could help with' in text and 'What it would not establish' in text, 'method offers an affordance and limit '+way)
                h.ok('Notes for the story example' in text and 'not an analysis' in text, 'own question gets story-method framing '+way)
            h.ok(p.locator('[data-qb-way][aria-pressed="true"]').count()==4, 'methods are a multiple selection')
            h.ok('Shorten it to 600' not in p.locator('#qb-status').inner_text(), 'shortening clears the obsolete overlength refusal')
            example = '[data-qb-example]'
            h.click(p,example)
            h.ok(focus_is(p,example), 'manual example retains focus on its live control')
            h.click(p,example)
            h.ok(focus_is(p,example), 'second example part retains focus')
            h.click(p,example)
            h.ok(p.locator(example).is_disabled() and focus_is(p,'[data-qb-example-next]'), 'final example has a nearby enabled focus fallback')
            h.click(p,'[data-qb-glossary]>summary')
            h.ok(p.locator('[data-qb-glossary]').evaluate('e=>e.open'), 'glossary opens manually')
            turn(p,2)
            h.ok(p.locator('[data-qb-glossary]').evaluate('e=>e.open'), 'reference disclosure survives turn changes')
            h.click(p,'[data-qb-reflection]')
            h.ok(focus_is(p,'[data-qb-reflection]'), 'reflection retains control focus')
            h.ok(h.book(p)==before, 'question composition, methods and help write no Fair/support/assessment roots')
            p.screenshot(path=str(OUT/'tablet-compose.png'),full_page=True)
            stale_keep = p.locator('[data-qb-keep]').element_handle()
            h.click(p,'[data-qb-keep]')
            stale_keep.evaluate('e=>e.click()')
            first = copy.deepcopy(kept(p)[0])
            h.ok(len(kept(p))==1 and first['work']['customQuestion']==custom, 'Keep stores exact wording once; detached Keep cannot append')
            h.ok(first['work']['wayIds']==['research','watch','compare','ask'], 'method order records explicit selection order')
            h.ok({k:v for k,v in h.book(p).items() if k!='questionCards'}==before, 'successful Keep changes only questionCards')
            h.ok(not p.locator('[data-qb-keep]').count() and (not p.locator('#qb-own').count() or p.locator('#qb-own').get_attribute('readonly') is not None), 'kept view is immutable')
            h.click(p,'[data-qb-copy]')
            turn(p,0)
            p.locator('#qb-own').fill('Ongoing invented copy')
            h.click(p,'[data-qb-board]')
            start(p,'frogs')
            h.ok('adult common frogs' in p.locator('#qb-question').inner_text(), 'other source draft survives independently')
            h.click(p,'[data-qb-shelf]')
            h.click(p,'[data-qb-card="question-card-1"]')
            h.ok('Return to your copy' in p.locator('[data-qb-root]').inner_text(), 'kept card names its ongoing copy')
            h.click(p,'[data-qb-copy]')
            turn(p,0)
            h.ok(p.locator('#qb-own').input_value()=='Ongoing invented copy' and kept(p)[0]==first, 'copy slot resumes without changing frozen original')
            live_hear=p.locator('[data-qb-hear]')
            live_hear.click()
            live_payload=live_hear.get_attribute('data-speak')
            h.ok('Ongoing invented copy' in live_payload and 'not a result' in live_payload and 'Next example part' not in live_payload, 'native Hear payload describes visible question and fiction boundary without control chatter')
            stale_bench_hear=live_hear.element_handle()
            stale_bench_hear.evaluate('e=>e.dataset.speak="Detached speech sentinel"')
            h.click(p,'[data-qb-legacy]')
            stale_bench_hear.evaluate('e=>e.click()')
            h.ok(stale_bench_hear.get_attribute('data-speak')=='Detached speech sentinel', 'detached Question Bench Hear cannot request or regenerate stale content')
            h.ok(h.book(p)['fairTests']==before['fairTests'], 'Back restores original Fair investigation exactly')
            exported = download(p,base,'tablet-export')
            h.ok(exported['questionCards']==[first] and exported['syntheticOther']==before['syntheticOther'], 'actual Notes download contains the full card and unrelated sibling')
            h.ok('not an analysis' in exported['questionCards'][0]['source']['methodNotice'], 'frozen method framing travels in Notes')

            # Transfer a differently shaped frozen source and raw unavailable
            # siblings through the real preview/confirm into a second explorer.
            mixed = copy.deepcopy(exported)
            history = copy.deepcopy(fixtures['historical'])
            duplicate = copy.deepcopy(first); duplicate['id']='question-card-5'
            cards = [copy.deepcopy(first), {'id':'question-card-70','v':99}, duplicate, copy.deepcopy(duplicate), history]
            for identity in range(81,92):
                card=copy.deepcopy(first);card['id']='question-card-'+str(identity);cards.append(card)
            cards.append({'id':'question-card-900','v':99,'raw':'Invented unavailable sibling'})
            mixed['questionCards']=cards
            _, q = native.setup(browser,fixtures['base'],'transfer')
            h.go(q,base,ROUTE,'[data-qb-enter]')
            original_id, original_book = h.active(q), h.book(q)
            import_report(q,base,mixed)
            h.ok(h.active(q)!=original_id, 'import creates a distinct explorer')
            enter(q,base)
            h.click(q,'[data-qb-shelf]')
            h.ok('9–16 of 17' in q.locator('[data-qb-root]').inner_text(), 'shelf starts on latest readable raw page without a12-card cap')
            h.ok(q.locator('.qb-shelf>li').count()==8, 'shelf page contains eight raw entry nodes')
            h.click(q,'[data-qb-page="1"]')
            h.ok('17–17 of 17' in q.locator('[data-qb-root]').inner_text() and q.locator('.qb-shelf>li').count()==1, 'final unreadable sibling keeps its own raw page and numbering')
            h.click(q,'[data-qb-page="-1"]')
            h.click(q,'[data-qb-page="-1"]')
            h.ok('1–8 of 17' in q.locator('[data-qb-root]').inner_text() and q.locator('[data-qb-card="question-card-5"]').count()==0, 'eight raw entries preserve numbering and duplicate ids are unavailable')
            h.click(q,'[data-qb-hear]')
            shelf_spoken=q.locator('[data-qb-hear]').get_attribute('data-speak')
            h.ok(all(t in shelf_spoken for t in q.locator('[data-qb-card]').all_text_contents()),'Hear includes only the current shelf page card labels')
            h.click(q,'[data-qb-card="question-card-80"]')
            h.ok(q.locator('#qb-question').text_content()==history['work']['customQuestion'], 'historical custom wording remains exact')
            h.ok('Earlier <question> & context' in q.locator('[data-qb-root]').inner_text(), 'historical title is escaped literal text')
            h.ok('Earlier exact example' not in q.locator('[data-qb-root]').inner_text(), 'kept view does not reveal unopened historical teaching')
            h.click(q,'[data-qb-copy]')
            turn(q,0);wording(q,'pieces')
            h.ok(q.locator('[data-qb-focus]:not([data-qb-focus=""])').count()==1 and q.locator('[data-qb-context]:not([data-qb-context=""])').count()==3, 'copy uses frozen source counts rather than current catalogue')
            historical_context=q.get_by_role('button',name='Earlier third context',exact=True)
            historical_context.click()
            h.ok(historical_context.evaluate('e=>e===document.activeElement'), 'quote/bracket historical context id focuses safely')
            turn(q,1)
            historical_way=q.get_by_role('button',name='Watch and record',exact=True)
            historical_way.click()
            h.ok(historical_way.evaluate('e=>e===document.activeElement'), 'quote/bracket historical method id focuses safely')
            turn(q,2);h.click(q,'[data-qb-keep]')
            copied=kept(q)[-1]
            h.ok(copied['id']=='question-card-901' and copied['source']==history['source'] and copied['work']['futureWork']==history['work']['futureWork'] and 'futureOuter' not in copied, 'copy reserves unreadable ids, retains source/work unknowns and omits outer metadata')
            h.ok(copied['work']['wayIds']==['old"way]'], 'historical punctuation method id survives native selection and Keep')
            h.ok(kept(q)[:-1]==cards, 'copy Keep leaves all imported raw history exact')
            transferred=download(q,base,'imported-redownload')
            h.ok(transferred['questionCards'][:-1]==cards, 'actual import/reload/redownload retains raw unsupported and duplicate siblings')
            enter(q,base)
            stale = detach(q,'[data-qb-case="seedlings"]')
            h.click(q,'#explorer-switch')
            h.click(q,f'[data-select-explorer="{original_id}"]')
            q.locator('[data-qb-enter]').wait_for()
            stale.evaluate('e=>e.click()')
            h.ok(h.book(q)==original_book, 'explorer switch resets visit and rejects old explorer controls')

            malformed_seed=copy.deepcopy(fixtures['base']);malformed_seed['questionCards']={'v':99,'raw':'Earlier invented question format'}
            _, malformed=native.setup(browser,malformed_seed,'malformed-question-root')
            enter(malformed,base);h.click(malformed,'[data-qb-shelf]')
            h.ok('cannot accept another card' in malformed.locator('[data-qb-root]').inner_text() and 'You can keep an unfinished thought too.' not in malformed.locator('[data-qb-root]').inner_text(),'malformed root shelf does not also promise that a card can be kept')
            h.ok(h.book(malformed)['questionCards']==malformed_seed['questionCards'],'malformed question owner remains exact')

            # Named card later return is read-only, including unavailable notebook.
            for broken in [False,True]:
                seed=copy.deepcopy(fixtures['base']);seed['questionCards']=[history]
                if broken:seed['fieldNotebook']={'version':99,'raw':'Earlier invented format'}
                _, field=native.setup(browser,seed,'field-unavailable' if broken else 'field-supported')
                h.go(field,base,'#living/notebook','[data-qb-return]')
                prior=h.book(field)
                h.click(field,'[data-qb-return] summary')
                text=field.locator('[data-qb-return]').inner_text()
                h.ok('Card 1' in text and history['source']['title'] in text and 'Fair Test, then Question Bench → Kept cards' in text, 'Field Notebook names frozen card and return path')
                if broken:h.ok('earlier Field Notebook cannot be opened' in text, 'unavailable notebook invitation makes no current-question claim')
                else:h.ok('current question' in text and 'pretend seedling rows' in text, 'normal return asks whether the current rows answer this card')
                h.ok(history['work']['customQuestion'] in field.locator('[data-qb-return]').text_content() and h.book(field)==prior, 'manual return disclosure reads frozen wording without notebook writes')
                if not broken:
                    h.click(field,'[data-fn-page="chart"]')
                    h.ok('Make the numbers visible' in field.locator('#fn-title').inner_text() and field.locator('[data-fn-check="chart"]').is_visible(), 'existing Field Notebook chart page and check control still open')
                    h.click(field,'[data-fn-page="data"]')
                    h.ok('Which observations answer' in field.locator('#fn-title').inner_text() and h.book(field)['questionCards']==[history], 'existing Field Notebook returns to data without changing the question card')

            # Adapter entry is usable in every existing legacy state and returns
            # to that same state; no repair/reset is implied by exploring a draft.
            for name in ['apprentice','broken','unavailable']:
                _, legacy=native.setup(browser,fixtures[name],'legacy-'+name)
                h.go(legacy,base,ROUTE,'[data-qb-enter]')
                old=h.book(legacy)
                toggle=detach(legacy,'#apprentice-help') if name=='apprentice' else None
                h.click(legacy,'[data-qb-enter]')
                if toggle:
                    stale_events([(toggle,'toggle')])
                    h.ok(h.book(legacy)==old, 'separately detached Apprentice help toggle cannot mark legacy support')
                start(legacy,'ramps');h.click(legacy,'[data-qb-legacy]')
                h.ok(h.book(legacy)==old, 'legacy '+name+' roundtrip preserves its entire notebook')
                h.ok(legacy.locator('.apprentice-page').count()==1 if name in ['apprentice','broken'] else 'cannot' in legacy.locator('main').inner_text(), 'legacy '+name+' surface returns intact')

            for width in [320,1024]:
                _, sample=native.setup(browser,fixtures['base'],f'width-{width}',width=width)
                enter(sample,base);start(sample,'ramps');bounds(sample)
                h.click(sample,'[data-qb-focus="time"]');h.click(sample,'[data-qb-context="height"]')
                turn(sample,1);bounds(sample)
                h.ok('not measured seconds' in sample.locator('[data-qb-root]').inner_text() or sample.locator('[data-qb-way="compare"]').count()==1, 'responsive sample keeps method controls reachable')
                turn(sample,0)
                sample.screenshot(path=str(OUT/f'width-{width}.png'),full_page=True)

            # Separate real report preflight boundary: the existing raw notebook
            # fits, but another frozen source/work would exceed the Notes cap.
            near_full=copy.deepcopy(exported);near_full['syntheticOther']['payload']=''
            raw=q.evaluate('''({report,cap})=>{const size=new TextEncoder().encode(JSON.stringify(report,null,2)).length;report.syntheticOther.payload='x'.repeat(cap-size-128);return report;}''',{'report':near_full,'cap':fixtures['maxImportBytes']})
            seed={k:v for k,v in raw.items() if k not in ['title','exportedAt','note','explorer','recommendation']}
            _, refusal=native.setup(browser,seed,'notes-preflight-refusal')
            enter(refusal,base);start(refusal);turn(refusal,2)
            old=h.book(refusal);h.click(refusal,'[data-qb-keep]')
            h.ok(h.book(refusal)==old and focus_is(refusal,'#qb-status') and 'not been kept' in refusal.locator('#qb-status').inner_text(), 'actual Notes preflight refuses while retaining earlier roots and focused draft status')
            h.ok('Your earlier cards stay unchanged in the Notes download' in refusal.locator('#qb-status').inner_text(), 'Notes-capacity refusal gives the dedicated recovery wording')
            for fault in ['quota','saving-off']:
                _, fault_page=native.setup(browser,fixtures['base'],fault+'-fault')
                if fault=='saving-off':
                    h.go(fault_page,base,'#notes','#remember');fault_page.locator('#remember').uncheck()
                if fault=='saving-off':
                    fault_page.evaluate('location.hash="#workshop/fair"');fault_page.locator('[data-qb-enter]').wait_for();h.click(fault_page,'[data-qb-enter]')
                else:enter(fault_page,base)
                start(fault_page);turn(fault_page,2)
                if fault=='quota':fault_page.evaluate('''()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Invented quota fault','QuotaExceededError');return native.call(this,k,v);};}''')
                h.click(fault_page,'[data-qb-keep]')
                h.ok('open page' in fault_page.locator('#qb-status').inner_text() and 'Download' in fault_page.locator('#qb-status').inner_text(), fault+' truthfully labels memory-only Keep')
                recovered=download(fault_page,base,fault+'-memory-export')
                h.ok(len(recovered['questionCards'])==1, fault+' actual download recovers in-memory card')

            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary HTTP requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'scope':'Native820 touch/keyboard;320/1024 geometry samples; actual Notes/explorer transfer and legacy Hear; separately labelled Notes preflight/quota/saving-off probes. No audible qualification.'},indent=2))
            print(f'Question Bench browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for page,label in h.pages:
                if not page.is_closed():
                    try:
                        page.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True)
                        (OUT/(label+'-failure.html')).write_text(page.content())
                    except Exception:
                        pass
            raise
        finally:
            for context in h.contexts:
                try:context.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()


if __name__=='__main__':
    main()
