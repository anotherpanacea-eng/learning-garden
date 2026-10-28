"""Independent synthetic spec248 journeys against the actual app and source hosts.

ACT_TWO_TEST_URL may point to an existing preview; otherwise serve dist on a free
local port. ACT_TWO_ARTIFACTS preserves traces, screenshots, downloads and failures.
CHROME_PATH is optional; absent it, Playwright's managed Chromium is used.
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
OUT = Path(os.environ.get('ACT_TWO_ARTIFACTS', tempfile.mkdtemp(prefix='act-two-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
CHAPTERS = ['market', 'garden', 'birthday', 'show']
HOSTS = ['coinCounter', 'townRecord', 'wholeBatches', 'loft']
ROUTES = {'market': '#workshop/coins', 'garden': '#learn/science/records',
          'birthday': '#cafe/batches', 'show': '#loft'}
checks = 0
contexts = []
pages = []
errors = []
fixture_source = r"""
import {makeFixtures,canExport} from './test/act-two-checks.mjs';
import {startActTwo} from './dist/act-two-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const f=makeFixtures();
f.refusal=structuredClone(f.ready);f.refusal.syntheticUnrelated={payload:''};
const proposed=structuredClone(f.refusal);if(!startActTwo(proposed))throw Error('Bad start fixture');
const size=new TextEncoder().encode(JSON.stringify(proposed,null,2)).length;
f.refusal.syntheticUnrelated.payload='x'.repeat(MAX_IMPORT_BYTES-size-32);
const probe=structuredClone(f.refusal);if(!startActTwo(probe)||canExport(probe))throw Error('Synthetic pretty-report boundary did not isolate raw-fit/report-refusal');
console.log(JSON.stringify(f));
"""


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def book(p):
    return p.evaluate('()=>window.__actTwoRead()')


def story(p):
    return copy.deepcopy(book(p).get('story'))


def only_learning(s):
    # Includes global language/starting preferences, proficiency and saved facts.
    return {k: copy.deepcopy(s.get(k)) for k in
            ['baseline', 'practice', 'puzzles', 'sessions', 'broad', 'facts', 'garden']}


def host_roots(s):
    return {k: copy.deepcopy(s.get(k)) for k in HOSTS}


def active(p):
    return p.evaluate("()=>{const saved=JSON.parse(localStorage.getItem('learning-garden-explorers'));return saved?saved.activeId:window.__actTwoExplorer();}")


def click(p, selector):
    # Opening actual native details is necessary before visible checks/clicks.
    loc = p.locator(selector)
    loc.first.wait_for(state='attached')
    ok(loc.count() > 0, 'control exists: ' + selector)
    if not p.locator(selector + ':visible').count():
        loc.evaluate_all("xs=>xs.forEach(x=>{for(let e=x.parentElement;e;e=e.parentElement)"
                         "if(e.tagName==='DETAILS')e.open=true})")
    p.locator(selector + ':visible').first.click()


def setup(browser, width, seed, label):
    c = browser.new_context(viewport={'width': width, 'height': 1000},
                            has_touch=True, reduced_motion='reduce', accept_downloads=True)
    contexts.append((c, label))
    c.tracing.start(screenshots=True, snapshots=True, sources=True)
    c.add_init_script('(' + r"""seed=>{
      if(!localStorage.getItem('act-two-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('act-two-fixture','1');
      }
      window.__actTwoSpeech=[];window.__actTwoCancels=0;window.__actTwoDiskFail=false;
      const set=Storage.prototype.setItem;
      Storage.prototype.setItem=function(k,v){
        if(window.__actTwoDiskFail&&String(k).startsWith('number-garden-v1'))
          throw Error('Synthetic persistent-write failure');
        return set.call(this,k,v);
      };
      window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
      Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
        getVoices:()=>[{name:'Synthetic English',voiceURI:'synthetic-en',lang:'en-US',localService:true,default:true}],
        cancel(){window.__actTwoCancels++;},addEventListener(){},removeEventListener(){},
        speak(u){window.__actTwoSpeech.push({text:u.text,lang:u.lang});}
      }});
    }""" + ')(' + json.dumps(seed) + ')')

    def app(route):
        response = route.fetch()
        body = response.text()
        needle = 'let graph=null,'
        assert needle in body, 'read-only notebook observation seam changed'
        body = body.replace(needle, 'window.__actTwoRead=()=>structuredClone(state);window.__actTwoExplorer=()=>explorerStore.active.id;window.__actTwoReport=candidate=>notesReport(candidate);' + needle, 1)
        route.fulfill(response=response, body=body)

    c.route('**/app.mjs', app)
    p = c.new_page()
    pages.append((p, label))
    p.set_default_timeout(12000)
    p.on('pageerror', lambda error: errors.append({'context': label, 'error': str(error)}))
    return c, p


def go(p, base, route):
    p.goto(base + route, wait_until='domcontentloaded', timeout=30000)
    p.locator('#explorer-header').wait_for()
    chosen = active(p)
    picker = p.locator(f'[data-select-explorer="{chosen}"]')
    if picker.count():
        picker.click()
    p.locator('main').wait_for()
    if route.startswith('#almanac/') and route not in ['#almanac/keepers']:
        p.locator('[data-act-two-root]').wait_for(state='attached')
    elif route == '#notes':
        p.locator('#download').wait_for()


def reload(p, selector='[data-act-two-root]'):
    chosen = active(p)
    destination = p.url
    p.reload(wait_until='domcontentloaded', timeout=30000)
    p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{chosen}"]').count():
        click(p, f'[data-select-explorer="{chosen}"]')
    if p.url != destination:
        p.goto(destination, wait_until='domcontentloaded', timeout=30000)
    p.locator(selector).wait_for()


def dismiss(p, method='skip'):
    p.locator('dialog.welcome-film[open]').wait_for()
    if method == 'skip':
        click(p, '[data-film-skip]')
    elif method == 'escape':
        p.keyboard.press('Escape')
    else:
        frame = p.locator('dialog.welcome-film iframe').element_handle().content_frame()
        frame.evaluate("parent.postMessage('garden-film-finished',location.origin)")
    p.locator('dialog.welcome-film').wait_for(state='detached')


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator('[data-act-two-root] button,[data-act-two-root] a,'
                    '[data-act-two-root] select,[data-act-two-root] summary').evaluate_all(r"""xs=>xs.filter(x=>
      x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||
      parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight,font:getComputedStyle(x).fontSize}))""")
    ok(not bad, 'native targets and text: ' + str(bad))


def snapshot(p, label):
    p.screenshot(path=str(OUT / (label + '.png')), full_page=True)
    (OUT / (label + '-state.json')).write_text(json.dumps(book(p), indent=2))


def download(p, base, label):
    go(p, base, '#notes')
    with p.expect_download() as result:
        click(p, '#download')
    destination = OUT / (label + '.json')
    result.value.save_as(destination)
    return json.loads(destination.read_text())


def verify_notes(p, base, receipts):
    go(p, base, '#notes')
    panel = p.locator('[data-act-two-notes]')
    panel.wait_for(state='attached')
    if not panel.evaluate('x=>x.open'):
        panel.locator('summary').first.click()
    text = panel.inner_text()
    for chapter, receipt in receipts.items():
        ref = receipt['ref']
        if chapter == 'market':
            expected = ['Coin Counter', f"Coin idea {ref['roundId']}", ref['request']]
        elif chapter == 'garden':
            expected = ['Town Record', f"Record plan {ref['visitId']}", ref['edition'] + ' kept', ref['sourceId']]
        elif chapter == 'birthday':
            expected = ['Whole-batch gathering trays', f"Tray idea {ref['caseId']}",
                        'kept plan' if ref['edition'] == 'kept' else 'offered tray', ref['sourceId']]
        else:
            expected = ['Story Loft', f"Show {ref['showId']}", 'shared ' + ref['edition']]
        ok(all(x in text for x in expected), 'Notes identify frozen activity/address/edition: ' + chapter)
    ok(panel.locator('[data-synthetic-injection],script,iframe,pre').count() == 0, 'Notes escape reference text and do not expand activity bodies')


def bring(p, base, value):
    go(p, base, '#notes')
    p.locator('#progress-file').set_input_files({'name': 'synthetic-partial-II.json',
                                               'mimeType': 'application/json',
                                               'buffer': json.dumps(value).encode()})
    p.locator('#progress-import-confirm').wait_for()
    click(p, '#progress-import-confirm')
    p.locator('#progress-import-status').wait_for()
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'real confirm/import')


def select_explorer(p, identity):
    click(p, '#explorer-switch')
    click(p, f'[data-select-explorer="{identity}"]')
    ok(active(p) == identity, 'selected actual explorer')


def offer(p, chapter):
    selector = p.locator(f'[data-act-two-candidate="{chapter}"]')
    ok(selector.count() == 1, 'one identified candidate selector')
    options = selector.locator('option').evaluate_all('xs=>xs.map(x=>({value:x.value,label:x.textContent}))')
    choices = [x for x in options if x['value']]
    ok(choices, 'source-owned retained work selectable: ' + chapter)
    selector.select_option(choices[0]['value'])
    before = host_roots(book(p))
    click(p, f'[data-act-two-offer="{chapter}"]')
    ok(host_roots(book(p)) == before, 'explicit offer leaves all host roots exact')
    ok(chapter in story(p)['acts']['II']['contributions'], 'explicit chapter receipt')


def return_from_host(p, chapter):
    before = host_roots(book(p))
    target = f'a[href="#almanac/town/{chapter}"]'
    click(p, target)
    p.locator('[data-act-two-root]').wait_for()
    ok(host_roots(book(p)) == before, 'host return link does not change waiting work')
    ok(chapter not in story(p)['acts']['II']['contributions'], 'host never auto-credits a chapter')


def work_in_host(p, chapter):
    if chapter == 'market':
        # The pure visit requires explicitly starting a real zero/unmatched round.
        p.locator('[data-coin-page]').first.wait_for()
        p.locator('#coin-request').select_option('ribbon')
        click(p, '[data-coin-choose]')
        r = book(p)['coinCounter']['rounds'][-1]
        ok(not r['checks'], 'unchecked coin plan')
    elif chapter == 'garden':
        p.locator('[data-record-root]').wait_for()
        click(p, '[data-record-start]')
        click(p, '[data-record-page="3"]')
        click(p, '[data-record-keep]')
        r = book(p)['townRecord']
        w = r['visits'][r['current']]
        ok(w['kept']['runs'] == [] and w['kept']['renderedParts'], 'actual blank/unfinished record Keep')
    elif chapter == 'birthday':
        p.locator('[data-wb-root]').wait_for()
        click(p, '[data-wb-case="rehearsal-table"]')
        click(p, '[data-wb-page="keep"]')
        click(p, '[data-wb-ready]')
        click(p, '[data-wb-keep]')
        click(p, '[data-wb-offer]')
        w = book(p)['wholeBatches']['cases']['rehearsal-table']
        ok(w['kept']['support']['together'] and w['offered']['support']['together'], 'actual supported kept/offered tray')
    else:
        click(p, '[data-loft-start="welcome"]')
        ok(book(p)['loft']['draft']['changes'] == 0, 'supplied show has zero edits')
        # An unshared draft cannot count when briefly returning.
        return_from_host(p, chapter)
        ok(not p.locator('[data-act-two-candidate="show"] option[value]:not([value=""])').count(), 'unshared show unavailable')
        click(p, f'a[href="{ROUTES[chapter]}"]')
        click(p, '[data-loft-perform]')
        click(p, '[data-loft-step="1"]')
        click(p, '[data-loft-step="1"]')
        click(p, '[data-loft-audience]')
        ok(book(p)['loft']['draft']['shared'] and book(p)['loft']['draft']['changes'] == 0, 'actual zero-edit explicit share')


def finish_story(p, base, width):
    before = only_learning(book(p))
    go(p, base, '#almanac/town')
    ok(p.locator('[data-act-two-celebrate]').is_enabled(), 'three contributions enable explicit celebration')
    click(p, '[data-act-two-celebrate]')
    p.locator('[data-act-two-root]').wait_for()
    ok(story(p)['acts']['II']['ended'], 'explicit celebration reached')
    ok(p.locator('[data-act-two-heading]').evaluate('x=>document.activeElement===x'), 'new ending heading focused')
    ok(not p.locator('[data-act-two-open-letter]').count(), 'letter stays future before Page2')
    bounds(p)
    snapshot(p, f'celebration-{width}')
    saved = story(p)
    go(p, base, '#explore')
    go(p, base, '#almanac/celebration')
    reload(p)
    ok(story(p) == saved, 'replay/render/reload write no story')
    click(p, '[data-act-two-reveal-page]')
    ok('flood-ledger-revealed' in story(p)['seenScenes'], 'Page2 explicitly revealed')
    ok(p.locator('[data-act-two-heading]').evaluate('x=>document.activeElement===x'), 'new page heading focused')
    click(p, '[data-act-two-page-amount="original"]')
    rows = p.locator('[data-act-two-root] tbody tr').evaluate_all(
        "xs=>xs.map(x=>Array.from(x.querySelectorAll('th,td')).map(c=>c.textContent.trim()))")
    ok(len(rows) == 7 and [x[0] for x in rows] == ['4', '15', '27', '31', '34', '36', '38'], 'seven original ledger rows')
    click(p, '[data-act-two-add-storm]')
    ok('storm-mark-added' in story(p)['seenScenes'], 'annotation is an explicit scene code')
    rows_after = p.locator('[data-act-two-root] tbody tr').count()
    ok(rows_after == 7, 'annotation does not mutate old table or invent storm year')
    # Closed glossary text is excluded from main speech; opening it is read-only.
    glossary = p.locator('[data-act-two-root] details')
    if glossary.count():
        glossary.first.locator('summary').click()
    before_speech = story(p)
    click(p, '[data-act-two-root] [data-speak]:visible')
    spoken = p.evaluate('window.__actTwoSpeech.at(-1)')
    ok(spoken and spoken['lang'].startswith('en'), 'visible English local narration')
    ok('160' in spoken['text'] or 'one hundred' in spoken['text'].lower(), 'visible annotation narrated')
    ok('Hello, Willowbank' not in spoken['text'], 'future letter never narrated')
    ok(story(p) == before_speech, 'speech is not story/learning credit')
    bounds(p)
    snapshot(p, f'ledger-{width}')
    click(p, 'a[href="#almanac/upstream-letter"]')
    p.locator('[data-act-two-open-letter]').wait_for()
    click(p, '[data-act-two-open-letter]')
    ok('vadoalto-letter-one-read' in story(p)['seenScenes'], 'English letter opened explicitly')
    ok(p.locator('[data-act-two-heading]').evaluate('x=>document.activeElement===x'), 'new letter heading focused')
    click(p, '[data-act-two-letter-amount="longer"]')
    ok(story(p)['letterAmount'] == 'longer', 'independent letter amount')
    ok(not p.locator('[data-act-two-root] [lang="es"],[data-act-two-root] [lang="fr"]').count(), 'no ungated foreign-language text')
    click(p, '[data-act-two-root] [data-speak]:visible')
    ok('Vadoalto' in p.evaluate('window.__actTwoSpeech.at(-1).text'), 'selected letter spoken')
    ok(story(p)['frameAmount'] == 'longer' and story(p)['pageAmount'] == 'original', 'frame/page preferences preserved')
    bounds(p)
    snapshot(p, f'letter-{width}')
    go(p, base, '#almanac/keepers')
    ok(p.locator('[data-keeper-amount="original"]').get_attribute('aria-pressed') == 'true', 'Page1 Original retained')
    ok(only_learning(book(p)) == before, 'ending/readers leave learning, facts and global reading preferences exact')


def main():
    fixtures = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', fixture_source], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('ACT_TWO_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *args):
                pass
        class PreviewServer(http.server.ThreadingHTTPServer):
            request_queue_size = 128
        server = PreviewServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    with sync_playwright() as pw:
        launch = {'headless': True}
        if os.environ.get('CHROME_PATH'):
            launch['executable_path'] = os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**launch)
        try:
            for width in [320, 820]:
                c, p = setup(browser, width, fixtures['near'], f'main-{width}')
                go(p, base, '#cafe')
                ok(book(p)['cafe']['served'] == 5, 'five actual supported services seeded')
                click(p, '[data-cafe-action="serve"]')
                dismiss(p)
                ok(book(p)['cafe']['served'] == 6, 'actual sixth supported service')
                go(p, base, '#almanac/keepers')
                click(p, '[data-keeper-keep]')
                click(p, '[data-keeper-reveal]')
                click(p, '[data-keeper-amount="original"]')
                go(p, base, '#almanac/town')
                before = story(p)
                ok('II' not in before['acts'], 'opening hub does not start II')
                click(p, '[data-act-two-frame-amount="longer"]')
                ok('II' not in story(p)['acts'], 'frame preference is not starting')
                p.locator('[data-act-two-start]').focus();p.keyboard.press('Enter')
                ok(story(p)['acts']['II']['started'], 'keyboard start uses the same explicit action')
                bounds(p)
                # All four pathways across the two widths; three real visits/explicit offers each.
                chosen = ['market', 'garden', 'birthday'] if width == 320 else ['market', 'garden', 'show']
                for chapter in chosen:
                    go(p, base, '#almanac/town/' + chapter)
                    click(p, f'a[href="{ROUTES[chapter]}"]')
                    work_in_host(p, chapter)
                    return_from_host(p, chapter)
                    offer(p, chapter)
                    bounds(p)
                finish_story(p, base, width)
                # Character preferences change through their actual owners; story rereads are pure.
                character_seed = copy.deepcopy(fixtures['future'])
                character_seed['story']['seenScenes'].append('flood-ledger-revealed')
                _, char = setup(browser, width, character_seed, f'characters-{width}')
                go(char, base, '#companions');click(char, '[data-guide="mira"]')
                go(char, base, '#post');click(char, '[data-post-courier="sorcerer"]')
                raw_story = story(char)
                go(char, base, '#almanac/flood-ledger')
                ok('Mira' in char.locator('[data-act-two-root]').inner_text(), 'current guide interpolated')
                go(char, base, '#almanac/upstream-letter')
                ok('flying sorcerer' in char.locator('[data-act-two-root]').inner_text().lower(), 'current courier title interpolated at invitation')
                ok(story(char) == raw_story, 'guide/courier reread does not rewrite story')
                # Real ordinary transfer: original remains on disk, import second explorer.
                original = active(p)
                first = download(p, base, f'completed-original-{width}')
                first_story, first_hosts = copy.deepcopy(first['story']), host_roots(first)
                verify_notes(p, base, first_story['acts']['II']['contributions'])
                partial = copy.deepcopy(fixtures['partial'])
                bring(p, base, partial)
                second = active(p)
                ok(second != original, 'import adds a second explorer alongside original')
                ok(p.locator('#remember').is_checked(), 'ordinary transfer keeps persistence enabled')
                reload(p, '#download')
                second_download = download(p, base, f'partial-second-{width}')
                ok(second_download['story'] == partial['story'], 'second exact partial story after reload')
                ok(host_roots(second_download) == host_roots(partial), 'second waiting host work exact')
                ok(len(second_download['syntheticUnrelated']['payload']) >= 500 * 1024, 'large unrelated sibling survives')
                select_explorer(p, original)
                first_again = download(p, base, f'completed-original-again-{width}')
                ok(first_again['story'] == first_story and host_roots(first_again) == first_hosts, 'original story and waiting hosts exact after import/reload/switch')
                select_explorer(p, second)
                second_again = download(p, base, f'partial-second-again-{width}')
                ok(second_again['story'] == partial['story'] and host_roots(second_again) == host_roots(partial), 'both notebooks remain independently downloadable')

                # Legacy retained work is never auto-offered; all three-of-four variants use real selectors.
                for omitted in CHAPTERS:
                    _, q = setup(browser, width, fixtures['work'], f'legacy-{width}-{omitted}')
                    go(q, base, '#almanac/town')
                    click(q, '[data-act-two-start]')
                    ok(story(q)['acts']['II']['contributions'] == {}, 'retained hosts do not auto-credit')
                    for chapter in [x for x in CHAPTERS if x != omitted]:
                        go(q, base, '#almanac/town/' + chapter)
                        offer(q, chapter)
                    go(q, base, '#almanac/town')
                    ok(q.locator('[data-act-two-celebrate]').is_enabled(), 'three-of-four browser truth case ' + omitted)
                    click(q, '[data-act-two-celebrate]')
                    ok(story(q)['acts']['II']['ended'], 'explicit alternate ending')

                # Direct future routes, no work, malformed preferences and standalone reached outcomes.
                for fixture in ['unreadParcel', 'unrevealedPage']:
                    _, locked = setup(browser, width, fixtures[fixture], f'before-page1-{width}-{fixture}')
                    original_story = copy.deepcopy(fixtures[fixture]['story'])
                    for destination in ['#almanac/town', '#almanac/town/garden']:
                        go(locked, base, destination)
                        panel = locked.locator('[data-act-two-root]')
                        ok(panel.locator('[data-act-two-read],[data-act-two-frame-amount],[data-speak],[data-act-two-start]').count() == 0, 'before Page1 no opening, frame preference, Hear or Start')
                        ok(panel.locator('a[href="#almanac/keepers"]').count() > 0, 'actual Keeper prerequisite link remains usable')
                        ok('could not be kept safely' not in panel.inner_text(), 'eligibility guidance never describes false storage failure')
                        ok(story(locked) == original_story, 'unread parcel/unrevealed Page1 navigation writes nothing')
                    reload(locked)
                    ok(story(locked) == original_story, 'before Page1 reload remains pure')
                    snapshot(locked, f'before-page1-{width}-{fixture}')
                _, frozen_notes = setup(browser, width, fixtures['notesIdentity'], f'notes-identities-{width}')
                verify_notes(frozen_notes, base, fixtures['notesIdentity']['story']['acts']['II']['contributions'])
                ok(story(frozen_notes) == fixtures['notesIdentity']['story'], 'Notes rendering never rewrites frozen imported receipts')
                snapshot(frozen_notes, f'notes-identities-{width}')
                _, q = setup(browser, width, fixtures['ready'], f'future-routes-{width}')
                for route in ['#almanac/celebration', '#almanac/flood-ledger', '#almanac/upstream-letter']:
                    raw = story(q) if q.url != 'about:blank' else copy.deepcopy(fixtures['ready']['story'])
                    go(q, base, route)
                    ok(story(q) == raw, 'direct unreached route read-only')
                    ok(not q.locator('[data-act-two-read]').count(), 'future prose not revealed')
                go(q, base, '#almanac/town');click(q, '[data-act-two-start]')
                for chapter in CHAPTERS:
                    go(q, base, '#almanac/town/' + chapter)
                    ok(not q.locator(f'[data-act-two-offer="{chapter}"]:enabled').count(), 'missing work honestly cannot offer')
                for preference in ['frameAmount', 'letterAmount']:
                    seed = copy.deepcopy(fixtures['future']);seed['story'][preference] = {'raw': 'Synthetic future preference'}
                    seed['story']['seenScenes'] += ['flood-ledger-revealed', 'vadoalto-letter-one-read']
                    _, q = setup(browser, width, seed, f'preference-{width}-{preference}')
                    go(q, base, '#almanac/upstream-letter' if preference == 'letterAmount' else '#almanac/celebration')
                    raw = story(q)
                    marker = 'letter' if preference == 'letterAmount' else 'frame'
                    ok(q.locator(f'[data-act-two-{marker}-amount]:enabled').count() == 0, 'unreadable preference controls disabled')
                    ok(story(q) == raw, 'raw preference/unknown season retained')

                # Both film families block stale detached story actions/audio without credit.
                for method in ['skip', 'escape', 'finish']:
                    seed = copy.deepcopy(fixtures['ready']);seed['garden']['welcomeFilmSeen'] = False
                    _, q = setup(browser, width, seed, f'welcome-{width}-{method}')
                    go(q, base, '#almanac/town')
                    q.locator('dialog.welcome-film[open]').wait_for()
                    raw = story(q)
                    ok(not q.locator('[data-act-two-root]').is_visible(), 'unseen welcome blocks direct almanac family')
                    dismiss(q, method)
                    q.locator('[data-act-two-root]').wait_for()
                    ok(story(q) == raw, 'welcome close never gives story credit')
                    click(q, '[data-act-two-start]')
                    q.evaluate("window.__staleAction=document.querySelector('[data-act-two-root] [data-act-two-frame-amount]');window.__staleSpeak=document.querySelector('[data-act-two-root] [data-speak]')")
                    go(q, base, '#home')
                    raw = story(q);speech_count = q.evaluate('window.__actTwoSpeech.length')
                    click(q, '[data-film-replay="welcome"]')
                    q.evaluate('window.__staleAction?.click();window.__staleSpeak?.click()')
                    ok(story(q) == raw and q.evaluate('window.__actTwoSpeech.length') == speech_count, 'detached stale story nodes cannot mutate or speak')
                    dismiss(q, method)
                    go(q, base, '#cafe')
                    raw = story(q)
                    click(q, '[data-film-replay="cafe"]')
                    dismiss(q, method)
                    ok(story(q) == raw, 'Cafe replay close/skip/escape no additional credit')

                # Different explorer/reset/route invalidates a captured live-owner action.
                _, q = setup(browser, width, fixtures['work'], f'stale-owner-{width}')
                go(q, base, '#almanac/town');click(q, '[data-act-two-start]')
                go(q, base, '#almanac/town/market')
                q.evaluate("window.__oldOffer=document.querySelector('[data-act-two-offer]');window.__oldSpeech=document.querySelector('[data-speak]')")
                bring(q, base, fixtures['partial'])
                raw = story(q);q.evaluate('window.__oldOffer.click();window.__oldSpeech?.click()')
                ok(story(q) == raw, 'old explorer callback cannot change new owner')
                go(q, base, '#notes');click(q, '#reset')
                q.locator('dialog[open]').wait_for()
                # Existing confirmation buttons are scoped to the actual dialog.
                dialog = q.locator('dialog[open]')
                confirm = dialog.locator('#confirm-reset')
                ok(confirm.count(), 'actual reset confirmation available')
                confirm.last.click()
                raw = story(q);q.evaluate('window.__oldOffer.click();window.__oldSpeech?.click()')
                ok(story(q) == raw, 'reset invalidates stale owner')

                # Saving off is deliberately separate from ordinary disk/transfer proof.
                _, q = setup(browser, width, fixtures['ready'], f'save-off-{width}')
                go(q, base, '#notes');q.locator('#remember').uncheck()
                go(q, base, '#almanac/town');click(q, '[data-act-two-start]')
                ok(story(q)['acts']['II']['started'], 'save-off session can start')
                exported = download(q, base, f'save-off-{width}')
                ok(exported['story'] == story(q), 'save-off remains copyable in memory')
                _, q = setup(browser, width, fixtures['ready'], f'disk-failure-{width}')
                go(q, base, '#almanac/town');q.evaluate('window.__actTwoDiskFail=true')
                click(q, '[data-act-two-start]')
                ok(story(q)['acts']['II']['started'], 'actual disk failure retains committed in-memory work')
                go(q, base, '#notes')
                ok('could not' in q.locator('[data-saving-status]').inner_text().lower() or 'not saved' in q.locator('[data-saving-status]').inner_text().lower(), 'actual persistence failure warning')
                exported = download(q, base, f'disk-failure-{width}')
                ok(exported['story'] == story(q), 'disk failure work downloadable')

                # Actual pretty-report byte refusal; no fake canExport callback in the browser.
                _, q = setup(browser, width, fixtures['refusal'], f'preflight-refusal-{width}')
                go(q, base, '#almanac/town');raw = book(q)
                diagnostic = q.evaluate(r"""async()=>{
                  const before=window.__actTwoRead(),candidate=structuredClone(before);
                  const {startActTwo}=await import('./act-two-core.mjs');
                  const {recoveryFitsProgressLimits,MAX_IMPORT_BYTES}=await import('./progress-limits.mjs');
                  const {prepareProgressImport}=await import('./progress-transfer.mjs');
                  const rawStarted=startActTwo(candidate);
                  const rawBytes=new TextEncoder().encode(JSON.stringify(candidate,null,2)).length;
                  const report=JSON.stringify(window.__actTwoReport(candidate),null,2);
                  return {rawStarted,rawFits:recoveryFitsProgressLimits(candidate),rawBytes,
                    rawMargin:MAX_IMPORT_BYTES-rawBytes,reportBytes:new TextEncoder().encode(report).length,
                    reportAccepted:prepareProgressImport(report).ok,
                    originalUnchanged:JSON.stringify(window.__actTwoRead())===JSON.stringify(before)};
                }""")
                (OUT / f'preflight-proof-{width}.json').write_text(json.dumps(diagnostic, indent=2))
                ok(diagnostic['rawStarted'] and diagnostic['rawFits'] and diagnostic['rawMargin'] >= 0, 'ACTUAL browser normalized notebook fits raw post-Start limits')
                ok(not diagnostic['reportAccepted'] and diagnostic['reportBytes'] > 5 * 1024 * 1024, 'ACTUAL pretty notesReport envelope alone causes refusal')
                ok(diagnostic['originalUnchanged'] and book(q) == raw, 'independent probe never mutates real notebook')
                click(q, '[data-act-two-start]')
                ok(book(q) == raw, 'actual report-byte refusal leaves all roots exact')
                ok(q.locator('#act-two-status').inner_text().strip(), 'preflight refusal explained')
                snapshot(q, f'preflight-refusal-{width}')
            ok(not errors, 'no page errors: ' + json.dumps(errors))
            (OUT / 'receipt.json').write_text(json.dumps({'checks': checks, 'pageErrors': errors, 'status': 'passed'}, indent=2))
            print(f'Act II browser: {checks} assertions passed; artifacts {OUT}')
        except Exception:
            failure = traceback.format_exc()
            # Keep every failure, including harness failures, before any repair/rerun.
            (OUT / 'failure.txt').write_text(failure)
            (OUT / 'page-errors.json').write_text(json.dumps(errors, indent=2))
            for p, label in pages:
                if not p.is_closed():
                    try:
                        p.screenshot(path=str(OUT / (label + '-failure.png')), full_page=True)
                        (OUT / (label + '-failure.html')).write_text(p.content())
                    except Exception:
                        pass
            raise
        finally:
            for c, label in contexts:
                try:
                    c.tracing.stop(path=str(OUT / (label + '-trace.zip')))
                    c.close()
                except Exception:
                    pass
            browser.close()
            if server:
                server.shutdown()


if __name__ == '__main__':
    main()
