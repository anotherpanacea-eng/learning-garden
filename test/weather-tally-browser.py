"""Synthetic281 native-control journeys; real storage and Notes transfers.

No app-module interception/tracing. A separate civil-date fault context controls
only Date's current reading; the ordinary journey uses the actual device date.
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
OUT = Path(os.environ.get('WEATHER_ARTIFACTS', tempfile.mkdtemp(prefix='weather-tally-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['RHYTHM_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('native_notebook_helpers', ROOT / 'test/rhythm-browser.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
PRACTICE = ['sun','sun','clouds','rain','rain','clouds','sun','wind','sun','clouds','rain','sun','sun','clouds','clouds','rain','sun','snow','clouds','sun','rain','rain','clouds','sun','wind','sun','clouds','rain','sun','clouds']
LABELS = {'sun': 'Sunny', 'clouds': 'Cloudy', 'rain': 'Rainy', 'wind': 'Windy', 'snow': 'Snowy'}


def setup(browser, width, seed, label, clock=None):
    options = {'viewport': {'width': width, 'height': 1000}, 'has_touch': True,
               'reduced_motion': 'reduce', 'accept_downloads': True}
    if clock:
        options['timezone_id'] = 'UTC'
    c = browser.new_context(**options)
    h.contexts.append(c)
    c.add_init_script('('+r'''seed=>{
      if(!localStorage.getItem('weather-fixture')){
        const p={id:'explorer-1',avatar:'sky',color:'gold',symbol:'leaf',createdAt:'2026-10-28T12:00:00.000Z'};
        localStorage.setItem('learning-garden-explorers',JSON.stringify({version:1,activeId:p.id,explorers:[p]}));
        localStorage.setItem('number-garden-v1:'+p.id,JSON.stringify(seed));
        localStorage.setItem('weather-fixture','1');
      }
      window.__wtHearBubbles=[];
      document.addEventListener('click',e=>{
        if(e.target.closest?.('[data-wt-hear]')){
          const id=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;
          const state=JSON.parse(localStorage.getItem('number-garden-v1:'+id));
          window.__wtHearBubbles.push({narration:state.dataDesk?.some(x=>x?.support?.narration),text:e.target.closest('[data-wt-hear]').dataset.speak});
        }
      });
    }'''+')('+json.dumps(seed)+')')
    if clock:
        c.add_init_script('window.__wtNow='+json.dumps(clock)+';'+r'''
          const RealDate=Date;
          window.Date=class extends RealDate{
            constructor(...args){super(...(args.length?args:[window.__wtNow]));}
            static now(){return new RealDate(window.__wtNow).getTime();}
          };
        ''')
    p = c.new_page()
    h.pages.append((p, label))
    p.set_default_timeout(12000)
    p.set_default_navigation_timeout(30000)
    p.on('pageerror', lambda e: h.errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda x: h.console_errors.append({'case': label, 'text': x.text, 'location': x.location}) if x.type == 'error' else None)
    def failed(r):
        entry = {'case': label, 'url': r.url, 'failure': r.failure, 'navigationRequest': r.is_navigation_request()}
        (h.navigation_aborts if 'ERR_ABORTED' in (r.failure or '') else h.request_failures).append(entry)
    p.on('requestfailed', failed)
    p.on('response', lambda r: h.http_failures.append({'case': label, 'url': r.url, 'status': r.status}) if r.status >= 400 else None)
    return c, p


def go(p, base, route):
    h.go(p, base, route, '[data-wt-root]')


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'weather/tally has no horizontal overflow')
    bad = p.locator('[data-wt-root] button,[data-wt-root] a,[data-wt-root] summary,[data-wt-root] select').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent.trim(),width:x.offsetWidth,height:x.offsetHeight,font:getComputedStyle(x).fontSize}))")
    h.ok(not bad, 'native44px targets/16px text: ' + json.dumps(bad))


def snap(p, label):
    p.screenshot(path=str(OUT / (label + '.png')), full_page=True)


def sheet(p, identity):
    return next(x for x in h.book(p)['dataDesk'] if isinstance(x, dict) and x.get('id') == identity)


def pick_weather(p, code):
    if p.locator('[data-wt-change-weather]:visible').count():
        h.click(p, '[data-wt-change-weather]')
    h.click(p, f'[data-wt-weather="{code}"]')


def new_sheet(p, source):
    if p.locator('[data-wt-choose]:visible').count():
        h.click(p, '[data-wt-choose]')
    before = h.book(p)
    h.click(p, f'[data-wt-source="{source}"]')
    h.ok(h.book(p) == before, 'source preview never writes')
    h.click(p, '[data-wt-start]')
    identity = h.book(p)['dataDesk'][-1]['id']
    p.locator('[data-wt-card]').wait_for()
    return identity


def reopen(p, identity):
    if p.locator('[data-wt-choose]:visible').count():
        h.click(p, '[data-wt-choose]')
    h.click(p, f'[data-wt-sheet="{identity}"]')
    p.locator('[data-wt-card]').wait_for()


def kept_controls_absent(p):
    h.ok(not p.locator('[data-wt-place],[data-wt-undo],[data-wt-compare],[data-wt-keep],[data-wt-teach],[data-wt-hear],[data-wt-together]').count(), 'kept sheet exposes no mutation, comparison or new support controls')


def reload(p):
    identity = h.active(p)
    p.reload(wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():
        h.click(p, f'[data-select-explorer="{identity}"]')
    p.locator('[data-wt-root]').wait_for()


def download(p, base, label):
    h.go(p, base, '#notes', '#download')
    with p.expect_download() as result:
        h.click(p, '#download')
    path = OUT / (label + '.json')
    result.value.save_as(path)
    return json.loads(path.read_text())


def main():
    fixtures = json.loads(subprocess.check_output(['node','--input-type=module','-e',
        "import {weatherFixtures} from './test/weather-tally-checks.mjs';console.log(JSON.stringify(weatherFixtures()));"], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('WEATHER_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *args):
                pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size = 128
            daemon_threads = True
        server = Server(('127.0.0.1',0), functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    base = base.rstrip('/')+'/'
    with sync_playwright() as pw:
        options = {'headless':True,'args':['--disable-quic']}
        if os.environ.get('CHROME_PATH'):
            options['executable_path']=os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**options)
        try:
            for width in [320,820]:
                _, p = setup(browser,width,fixtures['base'],f'ordinary-{width}')
                go(p,base,'#almanac/weather')
                before = h.book(p)
                h.ok('dataDesk' not in before, 'opening weather creates no tally root')
                h.ok(not p.locator('dialog.welcome-film[open]').count(), 'direct weather entry has no automatic film')
                pick_weather(p,'wind')
                h.ok(h.book(p)==before,'weather selection alone is not a report')
                h.click(p,'[data-wt-save-weather]')
                today_notes=[x for x in h.book(p)['weather'] if isinstance(x,dict) and x.get('date')==fixtures['date'] and x.get('weather') in LABELS]
                h.ok(today_notes[-1]['weather']=='wind','actual explicit Save records one chosen condition')
                h.ok('you reported Windy' in p.locator('#wt-status').inner_text(),'Save announces a reported choice, not verified weather')
                after_save=h.book(p)
                h.click(p,'[data-wt-change-weather]');h.click(p,'[data-wt-weather="snow"]');h.click(p,'[data-wt-cancel-weather]')
                h.ok(h.book(p)==after_save,'cancelled same-day choice leaves earlier report exact')
                pick_weather(p,'sun');h.click(p,'[data-wt-save-weather]')
                h.ok(h.book(p)['weather'][:6]==fixtures['base']['weather'][:6] if fixtures['earlier']!=fixtures['date'] else h.book(p)['weather'][0]==fixtures['base']['weather'][0], 'same-day Save retains earlier duplicate/raw/temp entries')
                bounds(p);snap(p,f'weather-today-{width}')
                go(p,base,'#almanac/tallies')
                h.ok(p.locator(f'[data-wt-source="{fixtures["month"]}"]').count()==1,'one or two real reports make an own-month source without a five-day gate')
                own=new_sheet(p,fixtures['month']);own_source=copy.deepcopy(sheet(p,own)['source'])
                h.ok(own_source['kind']=='reported' and 1<=len(own_source['days'])<=2,'own source freezes readable reported days only')
                h.ok('Reported choices' in p.locator('.wt-origin').inner_text(),'own source origin stays visible')
                own_narration=p.locator('[data-wt-hear]').get_attribute('data-speak')
                h.ok(own_source['title'].startswith('Your notes for ') and fixtures['month'] not in own_source['title'],'new reported source title uses a named month')
                h.ok(all(day['date'] not in own_narration for day in own_source['days']),'reported dates are narrated with a named month and day rather than ISO strings')
                h.click(p,'[data-wt-keep]');kept_controls_absent(p)
                practice_id=new_sheet(p,'practice')
                h.ok(sheet(p,practice_id)['source']['kind']=='practice' and len(sheet(p,practice_id)['source']['days'])==30,'separate invented source has thirty ordinal cards')
                h.ok('Made up for practice' in p.locator('.wt-origin').inner_text(),'practice origin stays visibly distinct from reports')
                h.ok(not sheet(p,practice_id)['support']['narration'],'no narration request on source entry')
                h.click(p,'[data-wt-teach]')
                h.ok(sheet(p,practice_id)['support']['teaching'] and p.locator('[data-wt-teaching]').count()==1,'teaching support commits before the example opens')
                h.ok(p.locator('[data-wt-teaching] path').count()==4,'four upright teaching marks')
                h.click(p,'[data-wt-teach-step="1"]')
                h.ok(p.locator('[data-wt-teaching] path').count()==5,'fifth teaching mark crosses the four')
                h.ok(not sheet(p,practice_id)['support']['narration'],'teaching Next does not request narration')
                h.click(p,'[data-wt-teach-close]')
                # First two cards are Sunny: repeated Enter stays on the same row.
                h.click(p,'[data-wt-place="sun"]');p.keyboard.press('Enter')
                h.ok(sheet(p,practice_id)['placements']==['sun','sun'],'touch then keyboard Enter adds one mark per card')
                h.ok(p.locator('[data-wt-row="0"]').evaluate('x=>document.activeElement===x'),'row focus survives a mark')
                description=p.locator('[data-wt-row="0"]').evaluate(r"x=>(x.getAttribute('aria-describedby')||'').split(/\s+/).map(id=>({id,text:document.getElementById(id)?.textContent.trim()}))")
                h.ok(any(x['id']=='wt-heading' and 'Day 3: Cloudy' in x['text'] for x in description),'refocused row describes the actual next card')
                h.ok(any(x['id']=='wt-progress' and x['text']=='2 of 30 cards counted' for x in description),'refocused row describes current progress')
                h.click(p,'[data-wt-compare]');first_check=copy.deepcopy(sheet(p,practice_id)['checks'][0])
                h.ok(not first_check['complete'] and not first_check['matches'],'unfinished comparison stays an aggregate practice record')
                h.click(p,'[data-wt-stage="count"]');h.click(p,'[data-wt-place="clouds"]')
                h.click(p,'[data-wt-stage="keep"]')
                h.ok(not p.locator('.wt-comparison:visible').count(),'edited rows do not present an earlier check as current feedback')
                h.ok(sheet(p,practice_id)['checks'][0]==first_check,'editing preserves the earlier frozen comparison')
                h.click(p,'[data-wt-stage="count"]')
                for i,code in enumerate(PRACTICE[3:],start=3):
                    h.ok(f'Day {i+1}: {LABELS[code]}' in p.locator('[data-wt-card]').inner_text(),'each actual next source card stays visible')
                    h.click(p,f'[data-wt-place="{code}"]')
                counts={row['code']:sheet(p,practice_id)['placements'].count(row['code']) for row in sheet(p,practice_id)['source']['categories']}
                h.ok(counts=={'sun':11,'clouds':9,'rain':7,'wind':2,'snow':1},'all thirty native placements yield independently counted totals')
                h.ok(p.locator('.wt-tally-row').first.locator('.wt-count').inner_text()=='11','numeric total repeats the tally picture')
                sun_groups=p.locator('.wt-tally-row').first.locator('.wt-tally-art')
                h.ok(sun_groups.count()==3,'eleven Sunny marks form two groups of five and one')
                shape=sun_groups.first.locator('path').evaluate_all('xs=>xs.map(x=>({width:x.getBBox().width,height:x.getBBox().height}))')
                h.ok(len(shape)==5 and all(x['width']==0 and x['height']>0 for x in shape[:4]) and shape[4]['width']>0 and shape[4]['height']>0,'grouped fifth is diagonal across four upright marks')
                h.click(p,'[data-wt-hear]')
                h.ok(sheet(p,practice_id)['support']['narration'],'actual Hear click records a narration request')
                h.ok(p.evaluate('window.__wtHearBubbles.length')==1 and p.evaluate('window.__wtHearBubbles[0].narration'),'support commits before normal narration event propagation')
                h.click(p,'[data-wt-together]');h.click(p,'[data-wt-compare]')
                full_check=sheet(p,practice_id)['checks'][-1]
                h.ok(full_check['complete'] and full_check['matches'],'complete row totals compare to the frozen source')
                h.ok(full_check['supportBefore']=={'teaching':True,'narration':True,'together':True,'feedback':True},'support snapshot precedes the new feedback')
                h.ok('Matching totals do not show that every card went into the same row' in p.locator('.wt-comparison:visible').inner_text(),'aggregate limit is explicit beside feedback')
                h.click(p,'[data-wt-keep]');full_kept=copy.deepcopy(sheet(p,practice_id));kept_controls_absent(p)
                bounds(p);snap(p,f'practice-kept-{width}')
                h.click(p,'[data-wt-revise]');partial_id=h.book(p)['dataDesk'][-1]['id']
                h.ok(partial_id!=practice_id and sheet(p,partial_id)['revisedFrom']==practice_id,'revision makes a distinct sheet')
                h.click(p,'[data-wt-undo]');h.click(p,'[data-wt-undo]')
                h.ok(len(sheet(p,partial_id)['placements'])==28,'Back restores two source cards without deleting history')
                h.click(p,'[data-wt-keep]');partial_kept=copy.deepcopy(sheet(p,partial_id));kept_controls_absent(p)
                h.click(p,'[data-wt-revise]');draft_id=h.book(p)['dataDesk'][-1]['id']
                h.ok(len(sheet(p,draft_id)['placements'])==28 and sheet(p,draft_id)['kept'] is None,'unfinished kept sheet can become a new mutable draft')
                h.ok(sheet(p,practice_id)==full_kept and sheet(p,partial_id)==partial_kept,'both earlier kept sheets remain exact')
                go(p,base,'#almanac/weather');pick_weather(p,'rain');h.click(p,'[data-wt-save-weather]')
                h.ok(sheet(p,own)['source']==own_source,'later real report edits leave the earlier own-source tally frozen')
                go(p,base,'#almanac/tallies');reopen(p,draft_id)
                before_reload=h.book(p);reload(p);reopen(p,draft_id)
                h.ok(h.book(p)==before_reload and len(sheet(p,draft_id)['placements'])==28,'explicit saved-sheet reopening after reload preserves partial work')
                identity=h.active(p);h.click(p,'#explorer-switch');h.click(p,'#explorer-new');h.click(p,'#explorer-create')
                p.locator('[data-wt-root="tallies"]').wait_for()
                h.ok(p.url.endswith('#almanac/tallies') and 'dataDesk' not in h.book(p) and 'weather' not in h.book(p),'new explorer stays on exact route without fabricated reports/sheets')
                h.ok(not p.locator('dialog.welcome-film[open]').count(),'new tally explorer has no automatic film')
                h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{identity}"]')
                p.locator('[data-wt-root="tallies"]').wait_for();reopen(p,draft_id)
                h.ok(h.book(p)==before_reload,'original explorer returns with all waiting work exact')
                exported=download(p,base,f'weather-tallies-export-{width}')
                h.ok(h.raw_report(exported)==before_reload and len(exported['syntheticOther']['payload'])==512000,'real Notes export keeps all mixed weather/kept/partial sheets and large unrelated work')
                _,q=setup(browser,width,fixtures['partial'],f'transfer-{width}')
                go(q,base,'#almanac/tallies');original_id=h.active(q);original=h.book(q)
                h.go(q,base,'#notes','#progress-file')
                q.locator('#progress-file').set_input_files({'name':'synthetic-weather-tallies.json','mimeType':'application/json','buffer':json.dumps(exported).encode()})
                q.locator('#progress-import-confirm').wait_for()
                h.ok('weather' in q.locator('.import-preview').inner_text().lower() and 'tall' in q.locator('.import-preview').inner_text().lower(),'import preview identifies both new destinations')
                h.click(q,'#progress-import-confirm');go(q,base,'#almanac/tallies')
                h.ok(h.active(q)!=original_id,'actual import creates a separate explorer')
                reload(q);reopen(q,draft_id)
                h.ok(h.book(q)['weather']==exported['weather'] and h.book(q)['dataDesk']==exported['dataDesk'],'real import/reload retains raw duplicates and all frozen/current sheets')
                again=download(q,base,f'weather-tallies-redownload-{width}')
                h.ok(again['weather']==exported['weather'] and again['dataDesk']==exported['dataDesk'] and again['syntheticOther']==exported['syntheticOther'],'redownload proves exact roots and512000-byte sibling')
                go(q,base,'#almanac/tallies');h.click(q,'#explorer-switch');h.click(q,f'[data-select-explorer="{original_id}"]')
                p_root=q.locator('[data-wt-root="tallies"]');p_root.wait_for()
                h.ok(h.book(q)==original,'separate import never overwrites its original explorer')
                snap(q,f'transfer-original-{width}')

                _,old=setup(browser,width,fixtures['historical'],f'historical-{width}')
                go(old,base,'#almanac/tallies');reopen(old,fixtures['historicalId'])
                h.ok(old.locator('[data-wt-place]').count()==2,'historical supported sheet shows its own two category rows')
                h.click(old,'[data-wt-row="0"]');h.click(old,'[data-wt-row="1"]');h.click(old,'[data-wt-row="0"]')
                h.ok(sheet(old,fixtures['historicalId'])['placements']==['bright"row',"wet'row",'bright"row'],'historical quoted category codes retain literal meanings')
                h.ok(old.locator('[data-wt-row="0"]').evaluate('x=>document.activeElement===x'),'historical row focus uses a safe numeric address')
                h.click(old,'[data-wt-compare]');h.ok(sheet(old,fixtures['historicalId'])['checks'][-1]['matches'],'historical own-source categories compare without current-catalog substitution')
                bounds(old);snap(old,f'historical-rows-{width}')

                unsupported=copy.deepcopy(fixtures['base']);unsupported['weather']={'version':99,'retained':'Synthetic unsupported weather'}
                _,u=setup(browser,width,unsupported,f'unsupported-weather-{width}')
                go(u,base,'#almanac/weather')
                h.ok('Earlier weather notes are kept' in u.locator('[data-wt-root]').inner_text() and not u.locator('.wt-calendar,.wt-calendar-day').count(),'unsupported weather keeps its notice without a fabricated empty calendar')
                h.ok(h.book(u)['weather']==unsupported['weather'],'unsupported weather view retains the original root')
                malformed=copy.deepcopy(fixtures['historical']);next(x for x in malformed['dataDesk'] if x.get('id')==fixtures['historicalId'])['checks']=None
                _,bad=setup(browser,width,malformed,f'malformed-checks-{width}')
                go(bad,base,'#almanac/tallies');reopen(bad,fixtures['historicalId']);bad_before=h.book(bad);h.click(bad,'[data-wt-compare]')
                h.ok(h.book(bad)==bad_before and 'earlier' in bad.locator('#wt-status').inner_text().lower() and 'could not be kept safely' not in bad.locator('#wt-status').inner_text(),'malformed check refusal names retained earlier records and leaves them exact')

                # Deterministic date changes affect only this separate UTC context.
                _,d=setup(browser,width,fixtures['base'],f'clock-{width}',clock='2026-10-28T12:00:00.000Z')
                go(d,base,'#almanac/weather');pick_weather(d,'rain');clock_before=h.book(d)
                d.evaluate("window.__wtNow='2026-10-29T12:00:00.000Z'");h.click(d,'[data-wt-save-weather]')
                h.ok(h.book(d)==clock_before and 'device date changed' in d.locator('#wt-status').inner_text(),'forward date flip refuses the rendered date without writing')
                h.click(d,'[data-wt-refresh-date]')
                h.ok('2026-10-29' in d.locator('.wt-device-date').inner_text() and d.locator('[data-wt-save-weather]').is_disabled(),'Refresh obtains the new date and clears unsaved choice')
                pick_weather(d,'snow');h.click(d,'[data-wt-save-weather]');pick_weather(d,'sun');clock_before=h.book(d)
                d.evaluate("window.__wtNow='2026-10-28T12:00:00.000Z'");h.click(d,'[data-wt-save-weather]')
                h.ok(h.book(d)==clock_before and 'device date changed' in d.locator('#wt-status').inner_text(),'backward date flip also refuses without rewriting earlier notes')
                h.click(d,'[data-wt-refresh-date]');pick_weather(d,'wind');h.click(d,'[data-wt-save-weather]')
                h.ok(any(x.get('date')=='2026-10-29' and x.get('weather')=='snow' for x in h.book(d)['weather'] if isinstance(x,dict)),'explicit clock refresh does not erase the later reported day')
                snap(d,f'date-flips-{width}')

                # Raw candidate fits, but actual pretty-report preflight refuses support.
                refusal_context,r=setup(browser,width,fixtures['refusal'],f'support-refusal-{width}')
                refusal_context.add_init_script(r'''
                  window.__wtSpeakCalls=[];
                  const nativeSpeak=window.speechSynthesis.speak.bind(window.speechSynthesis);
                  window.speechSynthesis.speak=utterance=>{window.__wtSpeakCalls.push(utterance.text);return nativeSpeak(utterance);};
                ''')
                go(r,base,'#almanac/tallies');reopen(r,fixtures['refusalId']);safe=h.book(r)
                h.click(r,'[data-wt-teach]')
                h.ok(h.book(r)==safe and not r.locator('[data-wt-teaching]').count(),'refused first teaching preflight discloses no worked example')
                h.ok(r.locator('button[data-wt-hear][data-speak-lang]').count()==1 and 'data-speak-lang=' in r.locator('[data-wt-hear]').get_attribute('data-speak'),'adversarial title leaves the guard marker on the actual Hear button')
                h.click(r,'[data-wt-hear]')
                h.ok(r.evaluate('window.__wtSpeakCalls.length')==0,'refused narration never calls native speechSynthesis.speak')
                h.ok(h.book(r)==safe and r.evaluate('window.__wtHearBubbles.length')==0,'refused first narration preflight stops propagation before speech/disclosure')
                h.ok('could not be kept safely' in r.locator('#wt-status').inner_text(),'support refusal gives a concrete recovery notice')
            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors));h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors));h.ok(not h.request_failures,'no failed requests: '+json.dumps(h.request_failures));h.ok(not h.http_failures,'no HTTP failures: '+json.dumps(h.http_failures))
            receipt={'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'consoleErrors':h.console_errors,'requestFailures':h.request_failures,'httpFailures':h.http_failures,'navigationAborts':h.navigation_aborts,'scope':'ordinary local-date reports, thirty native practice placements, real persistent two-explorer transfer; separate Date/preflight fault contexts; refusal-only native speech call-through spy; no app interception/tracing'}
            (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(f'Weather tallies browser: {h.checks} assertions passed at320/820; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc());(OUT/'browser-faults.json').write_text(json.dumps({'pageErrors':h.errors,'consoleErrors':h.console_errors,'requestFailures':h.request_failures,'httpFailures':h.http_failures,'navigationAborts':h.navigation_aborts},indent=2))
            for p,label in h.pages:
                if not p.is_closed():
                    try:snap(p,label+'-failure');(OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception:pass
            raise
        finally:
            for c in h.contexts:
                try:c.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()


if __name__=='__main__':main()
