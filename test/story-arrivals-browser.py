"""Synthetic249 journeys. Reuse the exercised248 native browser helpers, no new harness."""
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

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('ARRIVAL_ARTIFACTS', tempfile.mkdtemp(prefix='story-arrivals-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ACT_TWO_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('act_two_browser_helpers', ROOT / 'test' / 'act-two-browser.py')
h = importlib.util.module_from_spec(spec)
sys.dont_write_bytecode = True
spec.loader.exec_module(h)
ok, book, story, active, click = h.ok, h.book, h.story, h.active, h.click

FIXTURES = r"""
import {arrivalFixtures} from './test/story-arrivals-checks.mjs';
import {chooseStoryArrival} from './dist/story-arrivals-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const f=arrivalFixtures();f.refusal=structuredClone(f.base);f.refusal.syntheticPadding='';
const c=structuredClone(f.refusal);if(!chooseStoryArrival(c,'letter'))throw Error('Bad refusal fixture');
f.refusal.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(c,null,2)).length-32);
console.log(JSON.stringify(f));
"""


def go(p, base, route):
    h.go(p, base, route)
    if route == '#arrive':
        p.locator('[data-arrival-root]').wait_for()


def protected(s):
    c = copy.deepcopy(s)
    for key in ['story', 'title', 'exportedAt', 'note', 'explorer', 'recommendation']:
        c.pop(key, None)
    return c


def select(p, choice):
    click(p, f'[data-arrival-choice="{choice}"]')
    p.locator('[data-arrival-preview]').wait_for()


def joined_status(p):
    status = p.locator('#arrival-status')
    ok('Your arrival is kept for this explorer' in status.inner_text(), 'Join announces the kept notice')
    ok(status.evaluate('x=>document.activeElement===x'), 'Join focuses its kept status for announcement')


def join(p, choice):
    select(p, choice)
    before = book(p)
    click(p, '[data-arrival-join]')
    joined_status(p)
    ok(story(p)['arrival'] == choice and story(p)['arrivalChosen'] is True, 'explicit selected Join')
    ok(protected(book(p)) == protected(before), 'Join preserves ALL non-story roots exactly')
    earlier_story = before.get('story', {'version': 1, 'opening': 'returning', 'acts': {}, 'seenScenes': []})
    ok(story(p) == dict(earlier_story, arrival=choice, arrivalChosen=True), 'Join writes only arrival code and marker')
    ok(p.locator('[data-arrival-choice],[data-arrival-join]').count() == 0, 'committed recap has no alternative choices/Join')


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator('[data-arrival-root] button,[data-arrival-root] a').evaluate_all("""xs=>xs.filter(x=>
      x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||
      parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({text:x.textContent,w:x.offsetWidth,h:x.offsetHeight,font:getComputedStyle(x).fontSize}))""")
    ok(not bad, '44px targets and16px native text: ' + str(bad))


def snapshot(p, label):
    p.screenshot(path=str(OUT / (label + '.png')), full_page=True)
    (OUT / (label + '-state.json')).write_text(json.dumps(book(p), indent=2))


def inspect_reads(p, base, choice):
    chosen = story(p)
    if choice == 'storm':
        go(p, base, '#home')
        p.locator('dialog.welcome-film[open]').wait_for()
        h.dismiss(p)
        ok(story(p) == chosen, 'storm film adds no arrival/story work')
        ok(p.locator('[data-keeper-keep]').count() > 0, 'storm retains ordinary parcel path')
        return
    go(p, base, '#home')
    ok(p.locator('dialog.welcome-film[open]').count() == 0, 'later arrival suppresses automatic historical welcome')
    ok(book(p)['garden'].get('welcomeFilmSeen') is False, 'suppression writes no fake film seen flag')
    ok(p.locator('[data-keeper-keep]').count() == 0, 'inherited parcel never presented as new wet discovery')
    ok(p.get_by_role('link', name='Read your arrival recap again', exact=True).count() == 1, 'Home has one clear arrival recap link')
    if choice == 'letter':
        # Direct sealed invitation is allowed without compulsory Page1/Page2 reads.
        go(p, base, '#almanac/upstream-letter')
        ok('vadoalto-letter-one-read' not in story(p)['seenScenes'], 'letter arrival is access, not read credit')
        click(p, '[data-act-two-open-letter]')
        ok(story(p)['seenScenes'] == ['vadoalto-letter-one-read'], 'actual letter read only')
        go(p, base, '#almanac/flood-ledger')
        ok(p.locator('[data-arrival-context]').count() > 0, 'unopened earlier ledger has explicit inherited context')
        click(p, '[data-act-two-reveal-page]')
        ok('inherited-ledger-read' in story(p)['seenScenes'], 'actual inherited ledger read code')
        ok('flood-ledger-revealed' not in story(p)['seenScenes'], 'no fabricated discovery at arrival')
        click(p, '[data-act-two-add-storm]')
        ok(p.locator('tbody tr').count() == 7, 'earlier ledger retains seven rows and undated annotation')
    go(p, base, '#almanac/keepers')
    click(p, '[data-keeper-reveal]')
    ok('inherited-map-read' in story(p)['seenScenes'], 'actual inherited map read')
    ok('old-map-revealed' not in story(p)['seenScenes'] and 'parcel-found' not in story(p)['seenScenes'], 'read does not reenact discovery')
    ok(story(p)['acts'] == {}, 'reading backstory invents no act completion')
    ok(p.locator('[data-arrival-context]').count() > 0, 'visible earlier page labelled Before you came')
    go(p, base, '#almanac/town')
    click(p, '[data-act-two-start]')
    ok(story(p)['acts']['II']['started'] and story(p)['acts']['II']['contributions'] == {}, 'own gathering starts explicitly with zero fabricated offers')
    if choice == 'letter':
        for chapter in ['market', 'garden', 'birthday']:
            go(p, base, '#almanac/town/' + chapter)
            click(p, f'a[href="{h.ROUTES[chapter]}"]')
            h.work_in_host(p, chapter)
            h.return_from_host(p, chapter)
            h.offer(p, chapter)
        go(p, base, '#almanac/town');click(p, '[data-act-two-celebrate]')
        p.wait_for_url('**/#almanac/celebration')
        p.locator('a[href="#almanac/flood-ledger"]').first.wait_for()
        ok(story(p)['acts']['II']['ended'] and len(story(p)['acts']['II']['contributions']) == 3, 'letter arrival can later earn own gathering through actual hosts')
        ok(story(p)['arrival'] == 'letter' and story(p)['arrivalChosen'] is True, 'real later work preserves inherited context')
        ok(p.locator('[data-act-two-root] [data-arrival-context]').count() == 0, 'own earned celebration is not labelled Before you came')
        season_lines = {'spring': 'Blossom keeps landing in the lemonade. Nobody minds.',
                        'summer': 'The party goes on so late that the stars come out over the green.',
                        'autumn': 'The lanterns are strung through the apple trees by the orchard gate.',
                        'winter': 'Lanterns, snow, a fire in the middle of the green, and everyone in two scarves.'}
        season = story(p)['acts']['II']['season']
        ok(season in season_lines and season_lines[season] in p.locator('[data-act-two-root]').inner_text(), 'own celebration shows the actual saved season line')
        snapshot(p, f'own-celebration-{p.viewport_size["width"]}')
        go(p, base, '#almanac/flood-ledger')
        ok(p.locator('[data-act-two-root] [data-arrival-context]').count() > 0, 'ledger remains inherited history after an own earned gathering')
        discovery = "The second page peels away on its own, the way a leaf comes off a puddle. It's a table of numbers."
        ok(discovery not in p.locator('[data-act-two-root]').inner_text(), 'own gathering never reattributes the already inherited ledger discovery')
        ok('inherited-ledger-read' in story(p)['seenScenes'] and 'flood-ledger-revealed' not in story(p)['seenScenes'], 'actual inherited ledger read ID stays authoritative after own gathering')
        snapshot(p, f'inherited-ledger-after-own-gathering-{p.viewport_size["width"]}')


def main():
    fixtures = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', FIXTURES], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('ARRIVAL_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *args):
                pass
        class Preview(http.server.ThreadingHTTPServer):
            request_queue_size = 128
        server = Preview(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    with sync_playwright() as pw:
        launch = {'headless': True}
        if os.environ.get('CHROME_PATH'):
            launch['executable_path'] = os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**launch)
        try:
            for width in [320, 820]:
                # Fresh unseen-film chooser: preview only, selected-only narration, unchanged prefs/work.
                for choice in ['storm', 'mended', 'letter']:
                    _, p = h.setup(browser, width, fixtures['base'], f'choice-{choice}-{width}')
                    go(p, base, '#arrive')
                    initial = book(p)
                    ok(initial == fixtures['base'], 'independent chooser does not normalize unrelated roots')
                    ok(not p.locator('dialog.welcome-film[open]').count(), 'exact chooser never auto-plays welcome')
                    ok(p.locator('[data-arrival-join]').is_disabled(), 'Join initially disabled')
                    ok(p.locator('[data-arrival-preview]').count() == 0, 'no unchosen recap')
                    select(p, choice)
                    click(p, '[data-arrival-amount="short"]')
                    text = p.locator('[data-arrival-preview]').inner_text()
                    click(p, '[data-arrival-root] [data-speak]')
                    utterance = p.evaluate('window.__actTwoSpeech.at(-1)')
                    ok(utterance and utterance['lang'].startswith('en') and text.strip() in utterance['text'], 'only selected visible recap spoken in English')
                    if choice != 'letter':
                        ok('Vadoalto' not in utterance['text'], 'unchosen letter recap/body never spoken')
                    ok(book(p) == initial, 'preview, amount and speech leave EVERY saved field exact')
                    bounds(p)
                    snapshot(p, f'preview-{choice}-{width}')
                    click(p, '[data-arrival-join]')
                    joined_status(p)
                    ok(protected(book(p)) == protected(initial), 'Join preserves different prefs, subjects, Cafe and English/French frozen visits')
                    ok(story(p) == dict(initial['story'], arrival=choice, arrivalChosen=True), 'only explicit arrival fields committed')
                    ok(story(p)['acts'] == {} and story(p)['seenScenes'] == [], 'Join fabricates no activity, acts, reads, films')
                    committed = story(p)
                    go(p, base, '#notes')
                    panel = p.locator('[data-arrival-notes]');panel.wait_for(state='attached')
                    panel.locator('summary').click();note_text = panel.inner_text()
                    ok('Chosen story beginning' in note_text, 'Notes name explicit choice')
                    ok('Parcel kept by this explorer: not recorded' in note_text and 'Old map actually read: not recorded' in note_text, 'Notes never convert inherited availability into actual work/reads')
                    if choice != 'storm':ok('Act I: Before you came' in note_text, 'Notes identify earlier ActI context')
                    if choice == 'letter':ok('Act II: Before you came' in note_text and 'Upstream letter actually opened: not recorded' in note_text, 'Notes separate inheritedII/letter access from actual opening')
                    ok(story(p) == committed, 'Notes context rendering leaves story exact')
                    go(p, base, '#arrive')
                    h.reload(p, '[data-arrival-root]')
                    ok(story(p) == committed, 'committed recap reload retains exact story')
                    ok(p.locator('[data-arrival-choice],[data-arrival-join]').count() == 0, 'replay is same choice only')
                    bounds(p)
                    snapshot(p, f'joined-{choice}-{width}')
                    inspect_reads(p, base, choice)

                # Uncommitted leave and reload do not consume the choice or apply independent drafts.
                _, p = h.setup(browser, width, fixtures['base'], f'leave-{width}')
                go(p, base, '#arrive');raw = story(p);select(p, 'letter')
                h.reload(p, '[data-arrival-root]')
                ok(story(p) == raw and p.locator('[data-arrival-preview]').count() == 0, 'reload discards uncommitted preview only')
                select(p, 'mended');click(p, '[data-arrival-leave]')
                p.locator('dialog.welcome-film[open]').wait_for();h.dismiss(p)
                ok(story(p) == raw, 'leave adds no arrival choice')
                go(p, base, '#arrive');ok(p.locator('[data-arrival-preview]').count() == 0, 'return has no stale selection')
                go(p, base, '#begin');ok(p.locator('[data-start-choice="keep"]').get_attribute('aria-pressed') == 'true', 'independent3-field preference draft unchanged')
                go(p, base, '#pathways');ok(book(p)['learningRoutes'] == fixtures['base']['learningRoutes'], 'subject entry goals unchanged')

                # Real legacy supper and retained/malformed children at actual UI routes.
                _, unsupported = h.setup(browser, width, fixtures['unsupported'], f'unsupported-notes-{width}')
                go(unsupported, base, '#arrive');go(unsupported, base, '#notes')
                panel = unsupported.locator('[data-arrival-notes]');panel.wait_for(state='attached');panel.locator('summary').click()
                note_text = panel.inner_text()
                ok('Your earlier story is safe' in note_text and 'This version cannot continue that saved story.' in note_text, 'unsupported Notes explain the whole-story format problem')
                ok('Earlier arrival choice retained, unreadable' not in note_text, 'unsupported root is not mislabelled as one arrival decision')
                ok(story(unsupported) == fixtures['unsupported']['story'], 'whole unsupported root stays exact in Notes')
                snapshot(unsupported, f'unsupported-notes-{width}')
                _, p = h.setup(browser, width, fixtures['legacy'], f'legacy-six-{width}')
                go(p, base, '#arrive');join(p, 'mended')
                cafe = copy.deepcopy(book(p)['cafe']);go(p, base, '#almanac/keepers')
                click(p, '[data-keeper-reveal]')
                ok(book(p)['cafe'] == cafe and cafe['served'] == 6, 'real legacy six services retained')
                ok(story(p)['acts'] == {} and story(p)['seenScenes'] == ['inherited-map-read'], 'legacy inherited map does not capture ActI')
                for fixture in ['retained', 'malformed']:
                    _, p = h.setup(browser, width, fixtures[fixture], f'retained-{fixture}-{width}')
                    go(p, base, '#arrive');raw = story(p)
                    ok(p.locator('[data-arrival-choice],[data-arrival-preview],[data-arrival-join]').count() == 0, 'existing/unreadable decision has no unchosen future recap')
                    go(p, base, '#almanac/town')
                    if p.locator('dialog.welcome-film[open]').count():h.dismiss(p)
                    p.locator('[data-act-two-chapter]').first.wait_for()
                    ok(p.locator('[data-act-two-chapter]').count() == 4, 'retained startedII remains available withoutI provenance')
                    ok(story(p) == raw, 'retained/malformed arrival child not repaired')
                _, p = h.setup(browser, width, fixtures['inheritedBad'], f'inherited-bad-{width}')
                go(p, base, '#almanac/upstream-letter');raw_acts = copy.deepcopy(story(p)['acts'])
                click(p, '[data-act-two-open-letter]')
                go(p, base, '#almanac/flood-ledger');click(p, '[data-act-two-reveal-page]')
                ok(story(p)['acts'] == raw_acts, 'malformed act children do not poison independently inherited pages/letter')

                # Persistent original arrival + separate completed story, real confirm/import/reload/switch.
                _, p = h.setup(browser, width, fixtures['transfer'], f'transfer-{width}')
                go(p, base, '#arrive');join(p, 'letter')
                go(p, base, '#almanac/upstream-letter');click(p, '[data-act-two-open-letter]')
                original = active(p)
                first = h.download(p, base, f'arrival-original-{width}')
                h.bring(p, base, fixtures['completed']);second = active(p)
                ok(second != original, 'import creates separate explorer and retains original')
                ok(p.locator('#remember').is_checked(), 'ordinary transfer keeps persistence on')
                h.reload(p, '#download')
                second_download = h.download(p, base, f'completed-second-{width}')
                ok(second_download['story'] == fixtures['completed']['story'], 'completed second story exact after reload')
                ok(h.host_roots(second_download) == h.host_roots(fixtures['completed']), 'completed second waiting hosts exact')
                h.select_explorer(p, original)
                first_again = h.download(p, base, f'arrival-original-again-{width}')
                ok(first_again['story'] == first['story'] and protected(first_again) == protected(first), 'original arrival, prefs, subjects and waiting work exact after transfer')
                ok(len(first_again['syntheticOther']['payload']) >= 500 * 1024, 'unrelated500KiB survives ordinary persistence path')
                h.select_explorer(p, second)
                second_again = h.download(p, base, f'completed-second-again-{width}')
                ok(second_again['story'] == second_download['story'] and h.host_roots(second_again) == h.host_roots(second_download), 'both explorers redownload exact retained work')
                h.select_explorer(p, original);go(p, base, '#arrive');click(p, '[data-arrival-watch]')
                p.locator('dialog.welcome-film[open]').wait_for()
                # Actual UI ownership handlers, deliberately while the old film is open.
                p.locator('#explorer-switch').evaluate('x=>x.click()')
                p.locator(f'[data-select-explorer="{second}"]').evaluate('x=>x.click()')
                next_owner_story = story(p)
                if p.locator('dialog.welcome-film[open]').count():h.dismiss(p)
                ok(active(p) == second and story(p) == next_owner_story, 'old film close cannot update another explorer owner')

                # Explicit historical replay remains available; all closes give no story credit.
                for method in ['skip', 'escape', 'finish']:
                    _, p = h.setup(browser, width, fixtures['later'], f'film-{method}-{width}')
                    go(p, base, '#arrive');raw = story(p)
                    p.evaluate("window.__oldHear=document.querySelector('[data-arrival-root] [data-speak]')")
                    click(p, '[data-arrival-watch]');p.locator('dialog.welcome-film[open]').wait_for()
                    count = p.evaluate('window.__actTwoSpeech.length')
                    p.evaluate('window.__oldHear.click()')
                    ok(p.evaluate('window.__actTwoSpeech.length') == count and story(p) == raw, 'open modal blocks stale arrival audio/actions')
                    h.dismiss(p, method);ok(story(p) == raw, 'historical film finish/Skip/Escape gives no work credit')
                _, p = h.setup(browser, width, fixtures['base'], f'stale-{width}')
                go(p, base, '#arrive');select(p, 'letter')
                p.evaluate("window.__oldJoin=document.querySelector('[data-arrival-join]');window.__oldHear=document.querySelector('[data-arrival-root] [data-speak]')")
                h.bring(p, base, fixtures['completed']);raw = book(p)
                count = p.evaluate('window.__actTwoSpeech.length');p.evaluate('window.__oldJoin.click();window.__oldHear.click()')
                ok(book(p) == raw and p.evaluate('window.__actTwoSpeech.length') == count, 'old owner/root nodes cannot join or narrate after actual import')
                go(p, base, '#notes');click(p, '#reset');click(p, '#confirm-reset')
                p.locator('dialog.welcome-film[open]').wait_for();h.dismiss(p)
                raw = story(p);p.evaluate('window.__oldJoin.click();window.__oldHear.click()');ok(story(p) == raw, 'actual reset invalidates detached old choice')
                go(p, base, '#arrive');ok(p.locator('[data-arrival-choice]').count() == 3, 'reset gets structural default, not consumed storm choice')
                _, p = h.setup(browser, width, fixtures['later'], f'film-departure-{width}')
                go(p, base, '#arrive');click(p, '[data-arrival-watch]')
                p.evaluate("location.hash='#notes'");p.locator('#download').wait_for();raw = story(p)
                h.dismiss(p);ok(p.url.endswith('#notes') and story(p) == raw, 'film closure does not navigate/change unrelated current page')

                # Saving-off and real failed storage are separate from successful persistent transfer.
                for mode in ['off', 'failed']:
                    _, p = h.setup(browser, width, fixtures['base'], f'saving-{mode}-{width}')
                    go(p, base, '#arrive')
                    if mode == 'off':
                        go(p, base, '#notes');p.locator('#remember').uncheck()
                    go(p, base, '#arrive')
                    if mode == 'failed':p.evaluate('window.__actTwoDiskFail=true')
                    join(p, 'letter');saved = story(p)
                    exported = h.download(p, base, f'saving-{mode}-{width}')
                    ok(exported['story'] == saved, 'arrival remains copyable in-memory '+mode)
                    if mode == 'failed':ok('could not' in p.locator('[data-saving-status]').inner_text().lower(), 'actual persistence warning')

                # Actual normalized browser raw candidate fits; only actual pretty report refuses.
                _, p = h.setup(browser, width, fixtures['refusal'], f'byte-refusal-{width}')
                go(p, base, '#arrive');select(p, 'letter');raw = book(p)
                proof = p.evaluate(r"""async()=>{const before=__actTwoRead(),c=structuredClone(before);
                  const {chooseStoryArrival}=await import('./story-arrivals-core.mjs');
                  const {MAX_IMPORT_BYTES,recoveryFitsProgressLimits}=await import('./progress-limits.mjs');
                  const {prepareProgressImport}=await import('./progress-transfer.mjs');
                  const chosen=chooseStoryArrival(c,'letter'),rawBytes=new TextEncoder().encode(JSON.stringify(c,null,2)).length;
                  const report=JSON.stringify(__actTwoReport(c),null,2);
                  return {chosen,rawFits:recoveryFitsProgressLimits(c),rawBytes,rawMargin:MAX_IMPORT_BYTES-rawBytes,
                    reportBytes:new TextEncoder().encode(report).length,reportAccepted:prepareProgressImport(report).ok,
                    originalUnchanged:JSON.stringify(__actTwoRead())===JSON.stringify(before)};}""")
                (OUT / f'raw-report-proof-{width}.json').write_text(json.dumps(proof, indent=2))
                ok(proof['chosen'] and proof['rawFits'] and proof['rawMargin'] >= 0, 'actual raw post-Join fits')
                ok(not proof['reportAccepted'] and proof['reportBytes'] > 5*1024*1024, 'actual pretty report alone refuses')
                ok(proof['originalUnchanged'], 'independent proof never mutates real notebook')
                click(p, '[data-arrival-join]');ok(book(p) == raw, 'actual UI preflight refusal is atomic')
                ok(p.locator('#arrival-status').inner_text().strip() and p.locator('#arrival-status').evaluate('x=>document.activeElement===x'), 'real refusal explained/focused')
                snapshot(p, f'byte-refusal-{width}')
            ok(not h.errors, 'no page errors: '+json.dumps(h.errors))
            (OUT / 'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'pageErrors':h.errors},indent=2))
            print(f'Story arrivals browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT / 'failure.txt').write_text(traceback.format_exc())
            for p, label in h.pages:
                if not p.is_closed():
                    try:
                        p.screenshot(path=str(OUT / (label+'-failure.png')),full_page=True)
                        (OUT / (label+'-failure.html')).write_text(p.content())
                    except Exception:pass
            (OUT / 'page-errors.json').write_text(json.dumps(h.errors,indent=2))
            raise
        finally:
            for c, label in h.contexts:
                try:c.tracing.stop(path=str(OUT / (label+'-trace.zip')));c.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()


if __name__ == '__main__':main()
