"""Bounded Chromium checks; uses synthetic progress/voices and only a local server.

Requires an existing Python Playwright installation and sandbox-capable Chromium.
Run: python3 test/mobile-quality-browser.py [--evidence /tmp/garden-results.json]
Viewport/touch emulation does not establish real iPhone/iPad or audible voice quality.
"""
import argparse
import functools
import json
import tempfile
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--chromium', default='/usr/lib/chromium/chromium')
parser.add_argument('--evidence', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(root / 'dist')))
threading.Thread(target=server.serve_forever, daemon=True).start()
origin = f'http://127.0.0.1:{server.server_port}/'
results = {'checks': [], 'layouts': [], 'limitations': ['Cloud Chromium emulation; no real iPhone/iPad, screen reader or audible voice quality verification.']}

def check(value, message):
    assert value, message
    results['checks'].append(message)

mock_speech = """
window.testVoices=[];window.testUtterances=[];window.testCancellations=0;
const synth=new EventTarget();
synth.getVoices=()=>window.testVoices;
synth.cancel=()=>window.testCancellations++;
synth.speak=u=>window.testUtterances.push(u);
Object.defineProperty(window,'speechSynthesis',{value:synth});
window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
"""
voice_list = [
    {'name': 'Synthetic basic', 'voiceURI': 'basic-en', 'lang': 'en-US', 'localService': True, 'default': True},
    {'name': 'Synthetic enhanced', 'voiceURI': 'enhanced-en', 'lang': 'en-GB', 'localService': True},
    {'name': 'Synthetic français', 'voiceURI': 'local-fr', 'lang': 'fr-FR', 'localService': True},
    {'name': 'Synthetic remote premium', 'voiceURI': 'remote-en', 'lang': 'en-US', 'localService': False},
]

try:
    with sync_playwright() as p, tempfile.TemporaryDirectory(prefix='garden-mobile-') as profile:
        browser = p.chromium.launch(executable_path=args.chromium, headless=True, chromium_sandbox=True,
            ignore_default_args=True, args=['--headless', '--remote-debugging-pipe', '--no-startup-window', '--no-first-run', f'--user-data-dir={profile}'], timeout=15000)
        try:
            results['browser'] = browser.version
            context = browser.new_context(viewport={'width': 320, 'height': 740}, is_mobile=True, has_touch=True, accept_downloads=True)
            context.add_init_script(mock_speech)
            page = context.new_page()
            page.set_default_timeout(10000)
            external, errors = [], []
            page.on('request', lambda r: external.append(r.url) if not r.url.startswith((origin, 'data:', 'blob:')) else None)
            page.on('pageerror', lambda e: errors.append(str(e)))

            def route(name):
                page.evaluate('(r)=>{location.hash=r}', name)
                page.wait_for_timeout(80)
                page.locator('#main h1').wait_for()

            def return_to_explorer():
                page.locator('#main h1').wait_for()
                if page.locator('[data-select-explorer]').count():
                    page.locator('[data-select-explorer]').first.click()

            def voices(items):
                page.evaluate('(v)=>{testVoices=v;speechSynthesis.dispatchEvent(new Event("voiceschanged"));}', items)

            def utterance_count():
                return page.evaluate('testUtterances.length')

            page.goto(origin)
            page.locator('[data-film-skip]').wait_for()
            check(page.locator('dialog[open]').count() == 1, 'first-run film opens')
            page.locator('[data-film-skip]').focus()
            page.keyboard.press('Enter')
            check(page.locator('dialog[open]').count() == 0, 'keyboard skips first-run film')
            page.locator('a[href="#main"]').focus()
            page.keyboard.press('Enter')
            check(page.evaluate('document.activeElement.id') == 'main', 'keyboard skip link focuses main')

            for width, height in [(320, 740), (375, 667), (390, 844), (768, 1024), (844, 390)]:
                page.set_viewport_size({'width': width, 'height': height})
                for name in ['home', 'numbers', 'living', 'loft', 'words', 'notes', 'companions', 'post', 'science']:
                    route(name)
                    scroll = page.evaluate('document.documentElement.scrollWidth')
                    check(scroll <= width, f'{name} fits {width}x{height}')
                    results['layouts'].append({'route': name, 'width': width, 'height': height, 'scroll_width': scroll})

            page.set_viewport_size({'width': 320, 'height': 740})
            route('home')
            page.locator('[data-speak]').first.tap()
            check(utterance_count() == 0, 'empty asynchronous voice list queues no speech')
            voices(voice_list)
            check(utterance_count() == 0, 'voiceschanged never starts audio automatically')
            page.locator('.voice-settings > summary').click()
            check('remote-en' not in page.locator('[data-reading-voice] option').evaluate_all('(o)=>o.map(x=>x.value)'), 'remote voice excluded from picker')
            page.locator('[data-reading-voice]').select_option('basic-en')
            page.locator('[data-reading-speed]').select_option('0.8')
            page.locator('[data-preview-voice]').focus()
            page.keyboard.press('Enter')
            check(page.evaluate('testUtterances.at(-1).voice.voiceURI') == 'basic-en', 'keyboard preview uses explicit voice instead of enhanced heuristic')
            check(page.evaluate('testUtterances.at(-1).rate') == 0.8, 'preview uses selected speed')
            check(page.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).garden.speech.voice") == 'basic-en', 'voice choice is saved for explorer')

            # The requested local voice and the browser's audible output cannot be equated here.
            page.reload()
            return_to_explorer()
            page.locator('[data-speak]').first.click()
            page.locator('.voice-settings > summary').click()
            check(page.locator('[data-reading-voice]').input_value() == 'basic-en', 'reload preserves unavailable selected key while enumeration is empty')
            check(page.locator('[data-preview-voice]').is_disabled(), 'unavailable choice disables preview')
            check('unavailable' in page.locator('[data-voice-availability]').text_content(), 'unavailable saved voice has an explanation')
            voices(list(reversed(voice_list)))
            check(page.locator('[data-reading-voice]').input_value() == 'basic-en', 'late reordered enumeration restores exact selection')
            check('Voice list updated' in page.locator('[data-speech-status]').inner_text(), 'late availability clears stale unavailable status')
            check(utterance_count() == 0, 'late saved voice does not start speaking')
            page.locator('[data-preview-voice]').click()
            check(page.evaluate('testUtterances.at(-1).voice.voiceURI') == 'basic-en', 'restored voice is assigned to actual utterance')
            before = utterance_count()
            voices([v for v in voice_list if v['voiceURI'] != 'basic-en'])
            page.locator('[data-speak]').first.click()
            check(utterance_count() == before, 'deleted saved voice cannot silently play a replacement')
            check(page.locator('[data-reading-voice]').input_value() == 'basic-en', 'deleted choice stays visibly selected')
            page.locator('[data-reading-voice]').select_option('')
            check('Synthetic enhanced' in page.locator('[data-voice-availability]').inner_text(), 'explicit Automatic choice names local fallback')
            page.locator('[data-preview-voice]').click()
            check(page.evaluate('testUtterances.at(-1).voice.voiceURI') == 'enhanced-en', 'explicit fallback uses advertised local voice')

            page.evaluate('window.savedLateEnd=testUtterances.at(-1).onend')
            cancellations = page.evaluate('testCancellations')
            page.evaluate('window.dispatchEvent(new Event("pagehide"))')
            check(page.evaluate('testCancellations') > cancellations, 'pagehide cancels narration')
            check(page.locator('.speech-playing').count() == 0, 'pagehide clears active narration UI')
            page.locator('[data-preview-voice]').click()
            page.evaluate('savedLateEnd()')
            check('Requested local voice:' in page.locator('[data-speech-status]').inner_text(), 'stale end callback cannot overwrite new utterance status')
            cancellations = page.evaluate('testCancellations')
            page.evaluate("()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));}")
            check(page.evaluate('testCancellations') > cancellations, 'hidden-page lifecycle cancels narration')
            before = utterance_count()
            page.evaluate("()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));}")
            check(utterance_count() == before, 'returning to page requires deliberate Hear or preview')

            page.locator('[data-reading-voice]').select_option('enhanced-en')
            route('storm')
            page.locator('[data-start-path="french"]').click()
            page.locator('[data-french-destination]').first.click()
            page.locator('[data-speak-lang="fr"]').first.click()
            check(page.evaluate('testUtterances.at(-1).voice.voiceURI') == 'local-fr', 'French passage uses a matching local voice')
            check('other language' in page.locator('[data-speech-status]').inner_text(), 'cross-language automatic fallback is explained visibly')
            route('home')
            page.locator('[data-speak]').first.click()
            check(page.evaluate('testUtterances.at(-1).voice.voiceURI') == 'enhanced-en', 'English preference survives French automatic playback')
            page.locator('[data-stop-speech]').click()
            page.locator('.voice-settings > summary').click()
            page.get_by_text('Grown-ups: find and preview device voices', exact=True).click()
            voices([{**voice_list[1], 'name': 'Synthetic enhanced ' + 'long-name ' * 18}])
            check(page.evaluate('document.documentElement.scrollWidth') == 320, 'expanded voice guidance and long names fit 320px')
            for selector in ['[data-reading-voice]', '[data-reading-speed]', '[data-preview-voice]', '[data-refresh-voices]']:
                box = page.locator(selector).bounding_box()
                check(box['width'] >= 24 and box['height'] >= 44, f'{selector} has a usable measured touch target')

            # Continue the independent existing pause/export/import/reset path with synthetic data.
            route('storm')
            page.locator('[data-start-path="creature"]').click()
            page.locator('[data-new-visit="creature"]').click()
            page.locator('[data-story-choice="1"]').click()
            page.locator('#story-hint').click()
            saved = page.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).garden")
            page.get_by_role('link', name='Pause in the garden', exact=True).tap()
            page.reload()
            return_to_explorer()
            route('storm')
            page.locator('[data-resume-visit]').first.click()
            check(page.locator('[data-story-choice="1"]').get_attribute('aria-pressed') == 'true' and page.locator('.hint').is_visible(), 'pause/reload/resume preserves choice and hint')
            route('notes')
            with page.expect_download() as dl:
                page.locator('#download').tap()
            exported = json.loads(Path(dl.value.path()).read_text())
            check(exported['garden'] == saved, 'notes download preserves synthetic garden state')
            page.locator('#progress-file').set_input_files({'name': 'synthetic-notes.json', 'mimeType': 'application/json', 'buffer': json.dumps(exported).encode()})
            page.locator('#progress-import-confirm').click()
            registry = page.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers'))")
            check(len(registry['explorers']) == 2, 'local import adds separate explorer')
            check(page.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).garden") == saved, 'import leaves original explorer unchanged')
            page.locator('#reset').click()
            page.locator('#cancel-reset').click()
            check(page.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-2')).garden.visits.length") > 0, 'cancel reset keeps progress')
            page.locator('#reset').click()
            page.locator('#confirm-reset').click()
            if page.locator('[data-film-skip]').count():
                page.locator('[data-film-skip]').click()
            check(page.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-2')).garden.visits.length") == 0, 'confirmed reset clears active explorer')
            check(page.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).garden.visits.length") > 0, 'reset leaves other explorer intact')

            route('storm')
            page.locator('[data-start-path="shelter"]').click()
            page.locator('#story-skip').click()
            page.locator('#story-answer').wait_for()
            page.evaluate("()=>{Storage.prototype.setItem=function(){throw new DOMException('Synthetic quota','QuotaExceededError')}}")
            page.locator('#story-answer').fill('17')
            check(page.locator('[data-save-warning]').is_visible(), 'typing save failure shows warning immediately')
            check(page.locator('#story-answer').input_value() == '17' and page.evaluate('document.activeElement.id') == 'story-answer', 'save warning preserves input and focus')
            route('notes')
            check('could not be saved reliably' in page.locator('[data-saving-status]').inner_text(), 'Notes reports actual save failure instead of preference alone')
            page.evaluate("document.dispatchEvent(new CustomEvent('garden-speech-preference',{detail:{voice:'basic-en',rate:1}}))")
            check(page.locator('[data-save-warning]').count() == 1, 'preference save failure updates one warning without duplicate notices')
            with page.expect_download() as dl:
                page.locator('#download').click()
            recovery = json.loads(Path(dl.value.path()).read_text())
            check(any(d.get('input') == '17' for d in recovery['garden']['visits'][-1]['drafts'].values()), 'failed-save draft remains exportable from memory')
            page.reload()
            return_to_explorer()
            route('notes')
            page.locator('#remember').uncheck()
            check(page.evaluate("Object.keys(localStorage).filter(k=>k==='learning-garden-explorers'||k.startsWith('number-garden-v1')||/^number-garden-(kept|backup)-/.test(k)).length") == 0, 'saving off removes all managed copies')
            context.set_offline(True)
            for name in ['numbers', 'words', 'loft', 'notes']:
                route(name)
            check(True, 'loaded routes work offline')
            try:
                page.reload(timeout=5000)
                results['offline_reload'] = 'loaded from browser cache; no offline installation guarantee'
            except Exception as e:
                results['offline_reload'] = str(e).splitlines()[0]
            check(not external, 'bounded interactions made no nonlocal requests')
            check(not errors, 'no application JavaScript errors')
        finally:
            browser.close()
finally:
    server.shutdown()
    server.server_close()
    if args.evidence:
        args.evidence.write_text(json.dumps(results, indent=2) + '\n')
print(f'{len(results["checks"])} mobile browser checks passed ({results["browser"]}).')
print('Offline reload:', results.get('offline_reload', 'not reached'))
