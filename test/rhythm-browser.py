"""Synthetic280 journeys using real controls and persistent notebook transfers.

No app-module interception or tracing. RHYTHM_TEST_URL optionally targets a
preview/canonical site; otherwise serve dist locally. RHYTHM_ARTIFACTS retains
screenshots, actual downloads and a receipt. Audio-unavailable is a separate
explicit fault case, not the main playthrough's sound implementation.
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
OUT = Path(os.environ.get('RHYTHM_ARTIFACTS', tempfile.mkdtemp(prefix='rhythm-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
checks, contexts, pages, errors = 0, [], [], []
console_errors, request_failures, http_failures, navigation_aborts = [], [], [], []


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def active(p):
    return p.evaluate("()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")


def book(p):
    return p.evaluate("()=>{const i=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+i));}")


def current(p):
    s = book(p)['rhythm']
    return s['visits'][s['current']]


def unrelated(s):
    s = copy.deepcopy(s)
    s.pop('rhythm', None)
    return s


def raw_report(s):
    return {k: v for k, v in s.items() if k not in ['title', 'exportedAt', 'note', 'explorer', 'recommendation']}


def setup(browser, width, seed, label, no_audio=False):
    c = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True,
                            reduced_motion='reduce', accept_downloads=True)
    contexts.append(c)
    c.add_init_script('(seed=>{if(!localStorage.getItem("rhythm-fixture")){' +
                      'localStorage.setItem("number-garden-v1",JSON.stringify(seed));' +
                      'localStorage.setItem("rhythm-fixture","1");}})(' + json.dumps(seed) + ')')
    if no_audio:
        c.add_init_script('Object.defineProperty(window,"AudioContext",{configurable:true,value:undefined});'
                          'Object.defineProperty(window,"webkitAudioContext",{configurable:true,value:undefined});')
    p = c.new_page()
    pages.append((p, label))
    p.set_default_timeout(12000)
    p.set_default_navigation_timeout(30000)
    p.on('pageerror', lambda e: errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda message: console_errors.append({'case': label, 'text': message.text, 'location': message.location}) if message.type == 'error' else None)

    def request_failed(request):
        entry = {'case': label, 'url': request.url, 'failure': request.failure,
                 'navigationRequest': request.is_navigation_request()}
        if 'ERR_ABORTED' in (request.failure or ''):
            navigation_aborts.append(entry)
        else:
            request_failures.append(entry)

    p.on('requestfailed', request_failed)
    p.on('response', lambda response: http_failures.append({'case': label, 'url': response.url, 'status': response.status}) if response.status >= 400 else None)
    return c, p


def go(p, base, route, selector='[data-rhythm-root]'):
    p.goto(base + route, wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    identity = active(p)
    if p.locator(f'[data-select-explorer="{identity}"]').count():
        p.locator(f'[data-select-explorer="{identity}"]').click()
    p.locator(selector).wait_for()


def reload_studio(p):
    identity = active(p)
    p.reload(wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():
        p.locator(f'[data-select-explorer="{identity}"]').click()
    p.locator('[data-rhythm-root]').wait_for()


def click(p, selector):
    loc = p.locator(selector).first
    loc.wait_for(state='visible')
    loc.click()


def snap(p, label):
    p.screenshot(path=str(OUT / (label + '.png')), full_page=True)
    (OUT / (label + '-notebook.json')).write_text(json.dumps(book(p), indent=2))


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator('[data-rhythm-root] button,[data-rhythm-root] a,[data-rhythm-root] summary').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||"
        "x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16))"
        ".map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight,font:getComputedStyle(x).fontSize}))")
    ok(not bad, '44px controls and16px text: ' + str(bad))


def choose(p, source):
    click(p, f'[data-rhythm-source="{source}"]')
    p.locator('[data-rhythm-add="q"]').wait_for()
    ok(current(p)['source']['id'] == source, 'explicit chosen source')


def add(p, *sequence):
    for code in sequence:
        click(p, f'[data-rhythm-add="{code}"]')


def clear(p):
    click(p, '[data-rhythm-clear]')
    ok(p.locator('[data-rhythm-confirm]').inner_text() == 'Yes, clear this bar', 'clear confirmation names the action')
    click(p, '[data-rhythm-confirm]')


def keep(p):
    if not p.locator('[data-rhythm-keep]:visible').count():
        click(p, '[data-rhythm-tab="keep"]')
    click(p, '[data-rhythm-keep]')


def download(p, base, label):
    go(p, base, '#notes', '#download')
    with p.expect_download() as result:
        click(p, '#download')
    path = OUT / (label + '.json')
    result.value.save_as(path)
    return json.loads(path.read_text())


def bring(p, base, s):
    go(p, base, '#notes', '#progress-file')
    p.locator('#progress-file').set_input_files({'name': 'synthetic-rhythm-notebook.json',
                                               'mimeType': 'application/json',
                                               'buffer': json.dumps(s).encode()})
    p.locator('#progress-import-confirm').wait_for()
    ok('Rhythm Studio' in p.locator('.import-preview').inner_text(), 'import preview names Rhythm Studio')
    click(p, '#progress-import-confirm')
    p.locator('#progress-import-status').wait_for()
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual confirm/import completed')


def main():
    global checks
    fixtures = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
                            "import {rhythmFixtures} from './test/rhythm-checks.mjs';console.log(JSON.stringify(rhythmFixtures()));"], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('RHYTHM_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *args):
                pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size = 128
            daemon_threads = True
        server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = f'http://127.0.0.1:{server.server_port}/'
    base = base.rstrip('/') + '/'
    with sync_playwright() as pw:
        args = {'headless': True, 'args': ['--disable-quic']}
        if os.environ.get('CHROME_PATH'):
            args['executable_path'] = os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**args)
        try:
            for width in [320, 820]:
                _, p = setup(browser, width, fixtures['base'], f'compose-{width}')
                go(p, base, '#studio/rhythm')
                before = book(p)
                ok('rhythm' not in before, 'direct entry does not initialize optional root')
                ok(not p.locator('dialog.welcome-film[open]').count(), 'direct entry has no automatic storm film')
                ok(p.locator('[data-rhythm-source]').count() == 4, 'all four choices open')
                ok(not p.locator('[data-rhythm-target]').count(), 'no answer picture before source or explicit Show')
                bounds(p)
                choose(p, 'own-bar')
                ok(unrelated(book(p)) == unrelated(before), 'source choice changes only rhythm')
                ok(current(p)['sequence'] == [], 'empty new version')
                ok(not p.locator('[data-rhythm-move],[data-rhythm-remove],[data-rhythm-replace]').count(), 'editing controls wait for an explicit block selection')
                ok(p.locator('[data-rhythm-clear]').is_visible(), 'Clear remains a visible bar action')
                click(p, '[data-rhythm-play="current"]')
                ok(not current(p)['support']['responseRequested'], 'empty Play is not a sound request')
                p.locator('[data-rhythm-play-status="current"]').filter(has_text='nothing to play').wait_for()
                click(p, '[data-rhythm-teach]')
                ok(current(p)['support']['teachingShown'], 'teaching exposure saved before worked picture')
                ok('One whole note' in p.locator('[data-rhythm-root]').inner_text(), 'whole-note explanation appears')
                click(p, '[data-rhythm-teach-step="1"]')
                ok('Two half notes' in p.locator('[data-rhythm-root]').inner_text(), 'manual step compares two halves')
                ok(not current(p)['support']['responseRequested'] and not current(p)['support']['referenceRequested'], 'teaching Next does not request sound')
                click(p, '[data-rhythm-play="teaching"]')
                click(p, '[data-rhythm-stop]')
                click(p, '[data-rhythm-teach-close]')
                ok(current(p)['sequence'] == [], 'worked lengths never replace child draft')
                add(p, 'h', 'q')
                ok(current(p)['sequence'] == ['h', 'q'], 'partial bar composed by touch')
                ok(not p.locator('[data-rhythm-move],[data-rhythm-remove],[data-rhythm-replace]').count(), 'appending does not implicitly select a block or expand edit controls')
                labels = [' '.join(x.split()) for x in p.locator('[data-rhythm-slot]').all_text_contents()]
                ok(labels == ['2 beats1/2 bar', '1 beat1/4 bar'] or labels == ['2 beats 1/2 bar', '1 beat 1/4 bar'], 'compact blocks preserve visible beat counts and bar fractions: ' + str(labels))
                ok(p.locator('[data-rhythm-slot]').evaluate_all("xs=>xs.map(x=>x.getAttribute('aria-label'))") == ['Half note, 2 beats, one half of this bar', 'Quarter note, 1 beat, one quarter of this bar'], 'compact blocks retain full spoken note and fraction names')
                before_refusal = copy.deepcopy(book(p))
                click(p, '[data-rhythm-add="h"]')
                ok(book(p) == before_refusal, 'overfull append refuses without changing notebook')
                ok(p.locator('#rhythm-status').inner_text().strip(), 'fit refusal explained')
                click(p, '[data-rhythm-slot="1"]')
                click(p, '[data-rhythm-replace="rq"]')
                ok(current(p)['sequence'] == ['h', 'rq'], 'selected note can become an explicit rest')
                click(p, '[data-rhythm-move="-1"]')
                ok(current(p)['sequence'] == ['rq', 'h'], 'touch move preserves durations')
                click(p, '[data-rhythm-remove]')
                ok(current(p)['sequence'] == ['h'], 'remove selected rest')
                click(p, '[data-rhythm-add="q"]')
                click(p, '[data-rhythm-add="q"]')
                ok(current(p)['sequence'] == ['h', 'q', 'q'], 'three blocks fill four beats')
                snap(p, f'compose-before-keep-{width}')
                bounds(p)
                click(p, '[data-rhythm-play="current"]')
                ok(current(p)['support']['responseRequested'], 'sounding Play records only a request')
                click(p, '[data-rhythm-stop]')
                click(p, '[data-rhythm-check]')
                ok(current(p)['checks'][-1]['outcome'] is None, 'own bar checks facts, not musical quality')
                keep(p)
                ok(p.locator('#rhythm-status').inner_text().startswith('Kept.'), 'Keep announces its result')
                own_support = p.locator('.rhythm-kept').inner_text()
                ok('Reference sound' not in own_support and 'Target picture' not in own_support, 'own-bar kept support does not describe a nonexistent reference target')
                ok('My bar sound requested in this version' in own_support, 'own-bar kept support shows its actual response sound request')
                kept = copy.deepcopy(current(p)['kept'])
                ok(kept['sequence'] == ['h', 'q', 'q'], 'full composition kept')
                first_version = book(p)['rhythm']['current']
                snap(p, f'own-kept-{width}')
                bounds(p)
                click(p, '[data-rhythm-tab="build"]')
                clear(p)
                add(p, 'rq', 'rq')
                click(p, '[data-rhythm-play="current"]')
                click(p, '[data-rhythm-stop]')
                ok(current(p)['kept'] == kept, 'editing/play does not overwrite kept rhythm')
                keep(p)
                click(p, '[data-rhythm-confirm]')
                ok(current(p)['kept']['sequence'] == ['rq', 'rq'], 'kept replacement requires explicit confirmation')
                click(p, '[data-rhythm-choose]')
                choose(p, 'echo-1')
                ok(p.locator('[data-rhythm-play="reference"]').evaluate("x=>!!(x.compareDocumentPosition(document.querySelector('[data-rhythm-play=\"current\"]'))&Node.DOCUMENT_POSITION_FOLLOWING)"), 'reference Play precedes the child bar controls')
                ok(p.locator('[data-rhythm-show]').evaluate("x=>!!(x.compareDocumentPosition(document.querySelector('[data-rhythm-add=\"q\"]'))&Node.DOCUMENT_POSITION_FOLLOWING)"), 'Show example precedes the editor palette')
                ok(not p.locator('[data-rhythm-target]').count(), 'echo target initially hidden')
                invitation = p.locator('[data-rhythm-root]').inner_text()
                ok('Two quarter notes, then one half note.' not in invitation, 'hidden target order absent from visible prose')
                narrated = p.locator('[data-rhythm-root] [data-speak]').evaluate_all("xs=>xs.map(x=>x.getAttribute('data-speak')||'').join(' ')")
                ok('Two quarter notes, then one half note.' not in narrated, 'hidden target order absent from narration buttons')
                pulse = p.locator('[data-rhythm-beat]').all_text_contents()
                click(p, '[data-rhythm-play="reference"]')
                ok(current(p)['support']['referenceRequested'], 'reference request recorded before comparison')
                ok(not current(p)['support']['exampleShown'], 'requesting audio does not reveal picture')
                ok(not p.locator('[data-rhythm-target]').count(), 'reference playback keeps target blocks hidden')
                ok(p.locator('[data-rhythm-beat]').all_text_contents() == pulse and len(pulse) == 4, 'hidden reference exposes four equal beat labels only')
                click(p, '[data-rhythm-stop]')
                add(p, 'q', 'q', 'h')
                click(p, '[data-rhythm-check]')
                first = copy.deepcopy(current(p)['checks'][0])
                ok(first['outcome'] == 'match' and first['supportBefore']['exampleShown'] is False, 'first match keeps actual pre-picture support')
                ok('by ear' not in p.locator('#rhythm-feedback').inner_text().lower(), 'match does not claim proven hearing')
                click(p, '[data-rhythm-show]')
                p.locator('[data-rhythm-target]').wait_for()
                ok('Two quarter notes, then one half note.' in p.locator('[data-rhythm-target]').inner_text(), 'deliberate Show supplies the positive frozen echo description')
                ok(current(p)['support']['exampleShown'], 'explicit Show recorded')
                click(p, '[data-rhythm-hide]')
                ok(not p.locator('[data-rhythm-target]').count(), 'example can be hidden again')
                ok(current(p)['support']['exampleShown'], 'hide never erases exposure')
                click(p, '[data-rhythm-check]')
                ok(current(p)['checks'][-1]['supportBefore']['exampleShown'] and current(p)['checks'][-1]['familiar'], 'second check retains shown/familiar distinction')
                ok(current(p)['checks'][0] == first, 'later support preserves first recorded response')
                keep(p)
                ok('before this version was kept' in p.locator('.rhythm-kept').inner_text() and 'before this check' not in p.locator('.rhythm-kept').inner_text(), 'kept echo labels describe the kept snapshot, not a check')
                click(p, '.rhythm-records summary')
                ok('before this check in this version' in p.locator('.rhythm-records').inner_text(), 'recorded echo comparisons retain check-qualified support labels')
                snap(p, f'echo-kept-{width}')
                bounds(p)
                for source, sequence, description in [('echo-2', ['h', 'q', 'q'], 'One half note, then two quarter notes.'), ('echo-5', ['q', 'rq', 'q', 'q'], 'One quarter note, one quarter rest, then two quarter notes.')]:
                    click(p, '[data-rhythm-choose]')
                    choose(p, source)
                    click(p, '[data-rhythm-show]')
                    ok(description in p.locator('[data-rhythm-target]').inner_text(), source + ' positive frozen example description')
                    add(p, *sequence)
                    click(p, '[data-rhythm-check]')
                    ok(current(p)['checks'][-1]['outcome'] == 'match', source + ' exact finite echo')
                    keep(p)
                click(p, '[data-rhythm-version]')
                ok(current(p)['sequence'] == [] and not current(p)['support']['exampleShown'], 'another version retains a separate blank response')
                add(p, 'q')
                partial_version = book(p)['rhythm']['current']
                # Native keyboard activates the same palette action as touch.
                p.locator('[data-rhythm-add="rq"]').focus()
                p.keyboard.press('Enter')
                ok(current(p)['sequence'] == ['q', 'rq'], 'keyboard and touch use the same composer')
                before_switch = book(p)
                identity = active(p)
                click(p, '#explorer-switch')
                click(p, '#explorer-new')
                click(p, '#explorer-create')
                p.locator('[data-rhythm-root]').wait_for()
                second = active(p)
                ok(second != identity and p.url.endswith('#studio/rhythm'), 'fresh explorer remains at Rhythm Studio')
                ok('rhythm' not in book(p), 'switching creates no source or fabricated rhythm history')
                ok(not p.locator('dialog.welcome-film[open]').count(), 'fresh studio explorer has no automatic welcome')
                click(p, '#explorer-switch')
                click(p, f'[data-select-explorer="{identity}"]')
                p.locator('[data-rhythm-root]').wait_for()
                ok(active(p) == identity and book(p) == before_switch, 'return preserves exact original notebook')
                reload_studio(p)
                ok(book(p)['rhythm']['current'] == partial_version and current(p)['sequence'] == ['q', 'rq'], 'partial version survives real reload')
                ok(book(p)['rhythm']['visits'][first_version]['kept']['sequence'] == ['rq', 'rq'], 'earlier kept version survives real reload')
                before_export = book(p)
                exported = download(p, base, f'complete-with-partial-{width}')
                ok(raw_report(exported) == before_export, 'actual Notes download contains exact complete/partial notebook')
                ok(len(exported['syntheticOther']['payload']) == 512000, 'download retains large unrelated work')
                _, q = setup(browser, width, fixtures['partial'], f'transfer-{width}')
                go(q, base, '#studio/rhythm')
                original_id = active(q)
                original = book(q)
                bring(q, base, exported)
                imported_id = active(q)
                ok(imported_id != original_id, 'import creates a distinct explorer')
                go(q, base, '#studio/rhythm')
                ok(book(q)['rhythm'] == before_export['rhythm'], 'real import retains every rhythm version/source/support/check')
                reload_studio(q)
                ok(book(q)['rhythm'] == before_export['rhythm'], 'imported complete and partial versions survive reload')
                redownload = download(q, base, f'imported-redownload-{width}')
                ok(redownload['rhythm'] == exported['rhythm'] and redownload['syntheticOther'] == exported['syntheticOther'], 'real redownload preserves rhythms and512000-byte sibling')
                go(q, base, '#studio/rhythm')
                click(q, '#explorer-switch')
                click(q, f'[data-select-explorer="{original_id}"]')
                go(q, base, '#studio/rhythm')
                ok(book(q) == original, 'switching after import preserves original explorer exactly')
                snap(q, f'transfer-original-{width}')
                # Separate unavailable browser API: visible route still works and request is honest.
                _, u = setup(browser, width, fixtures['base'], f'unavailable-{width}', no_audio=True)
                go(u, base, '#studio/rhythm')
                choose(u, 'echo-1')
                click(u, '[data-rhythm-play="reference"]')
                u.locator('[data-rhythm-play-status="reference"]').filter(has_text='unavailable').wait_for()
                ok(current(u)['support']['referenceRequested'] and not current(u)['support']['exampleShown'], 'unavailable API records request, never hearing or shown answer')
                click(u, '[data-rhythm-stop]')
                click(u, '[data-rhythm-show]')
                add(u, 'q', 'q', 'h')
                click(u, '[data-rhythm-check]')
                ok(current(u)['checks'][-1]['outcome'] == 'match', 'picture path remains playable with sound unavailable')
                snap(u, f'unavailable-picture-{width}')
                bounds(u)
            ok(not errors, 'no page errors: ' + json.dumps(errors))
            ok(not console_errors, 'no console errors: ' + json.dumps(console_errors))
            ok(not request_failures, 'no failed non-aborted requests: ' + json.dumps(request_failures))
            ok(not http_failures, 'no HTTP failures: ' + json.dumps(http_failures))
            receipt = {'status': 'passed', 'checks': checks, 'base': base, 'pageErrors': errors,
                       'consoleErrors': console_errors, 'requestFailures': request_failures,
                       'httpFailures': http_failures, 'navigationAborts': navigation_aborts,
                       'scope': 'actual persistent controls, two-explorer transfer, separate unavailable-API cases',
                       'transport': 'Chrome, QUIC disabled, no app interception/tracing'}
            (OUT / 'receipt.json').write_text(json.dumps(receipt, indent=2))
            print(f'Rhythm browser: {checks} assertions passed at320/820; artifacts {OUT}')
        except Exception:
            (OUT / 'failure.txt').write_text(traceback.format_exc())
            (OUT / 'page-errors.json').write_text(json.dumps(errors, indent=2))
            (OUT / 'browser-faults.json').write_text(json.dumps({'consoleErrors': console_errors, 'requestFailures': request_failures, 'httpFailures': http_failures, 'navigationAborts': navigation_aborts}, indent=2))
            for p, label in pages:
                if not p.is_closed():
                    try:
                        p.screenshot(path=str(OUT / (label + '-failure.png')), full_page=True)
                        (OUT / (label + '-failure.html')).write_text(p.content())
                    except Exception:
                        pass
            raise
        finally:
            for c in contexts:
                c.close()
            browser.close()
            if server:
                server.shutdown()


if __name__ == '__main__':
    main()
