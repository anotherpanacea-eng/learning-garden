"""Optional map fault isolation through the real app; intercept only its JSON request."""
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
import time
import traceback
from playwright.sync_api import sync_playwright

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('MAP_STARTUP_ARTIFACTS', tempfile.mkdtemp(prefix='map-startup-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['RHYTHM_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('rhythm_native_helpers', ROOT / 'test/rhythm-browser.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
MAP_BYTES = (ROOT / 'dist/marble-map.json').read_bytes()
MAP = json.loads(MAP_BYTES)


def screenshot(p, label):
    p.screenshot(path=str(OUT / (label + '.png')), full_page=True)


def map_metadata(p):
    p.locator('.map-focus').wait_for()
    details = p.locator('details').filter(has=p.locator('summary').filter(has_text='About this map'))
    details.locator('summary').click()
    h.ok(f"{len(MAP['topics'])} concepts from Marble’s {MAP['totalTopics']}-concept" in details.inner_text(), 'actual topic and full-map counts shown')
    h.ok(p.locator(f'a[href="https://github.com/withmarbleapp/os-taxonomy/tree/{MAP["commit"]}"]').count() == 1, 'actual pinned source link retained')
    h.ok(p.locator('a[href="./marble-map.json"][download]').count() == 1, 'actual data download remains available')


def main():
    seed = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
                       "import {rhythmFixtures} from './test/rhythm-checks.mjs';console.log(JSON.stringify(rhythmFixtures().base));"], cwd=ROOT, text=True))

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    class Server(http.server.ThreadingHTTPServer):
        request_queue_size = 128
        daemon_threads = True

    server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/'
    cases = []
    with sync_playwright() as pw:
        options = {'headless': True, 'args': ['--disable-quic']}
        if os.environ.get('CHROME_PATH'):
            options['executable_path'] = os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**options)
        try:
            for width in [320, 820]:
                n = h.checks
                c, p = h.setup(browser, width, seed, f'held-{width}')
                pending = []
                c.route('**/marble-map.json', lambda route: pending.append(route))
                started = time.monotonic()
                h.go(p, base, '#studio/rhythm')
                h.ok(len(pending) == 1, 'map JSON is genuinely held while playable screen appears')
                h.ok(p.locator('[data-rhythm-source]').count() == 4, 'all Rhythm choices available before map response')
                h.ok(not p.locator('dialog.welcome-film[open]').count(), 'explicit game entry is not interrupted by a film')
                ready_seconds = round(time.monotonic() - started, 3)
                h.choose(p, 'own-bar')
                h.add(p, 'h', 'q')
                before = h.book(p)
                h.ok(h.current(p)['sequence'] == ['h', 'q'], 'real partial composition works while map download is pending')
                p.evaluate("window.__mapStartupRoot=document.querySelector('[data-rhythm-root]')")
                with p.expect_response(lambda response: response.url.endswith('/marble-map.json')) as response:
                    pending.pop().fulfill(status=200, content_type='application/json', body=MAP_BYTES)
                h.ok(response.value.body() == MAP_BYTES, 'held request actually receives the real map bytes')
                p.evaluate('async()=>{for(let i=0;i<8;i++)await Promise.resolve();}')
                h.ok(p.evaluate("window.__mapStartupRoot===document.querySelector('[data-rhythm-root]')"), 'map success does not replace the active activity DOM')
                h.ok(h.book(p) == before, 'map success leaves the entire notebook and partial bar exact')
                screenshot(p, f'partial-after-map-{width}')
                h.go(p, base, '#map', '.map-focus')
                map_metadata(p)
                h.ok(h.book(p) == before, 'opening map changes no saved activity or learning evidence')
                screenshot(p, f'map-open-{width}')
                cases.append({'width': width, 'case': 'held map then success', 'checks': h.checks - n,
                              'gameReadyWhileMapHeldSeconds': ready_seconds})
                c.close()

                n = h.checks
                c, p = h.setup(browser, width, seed, f'failed-map-{width}')
                requests = []

                def fail_then_recover(route):
                    requests.append(route.request.url)
                    if len(requests) == 1:
                        route.fulfill(status=404, content_type='text/plain', body='Synthetic intentional missing optional map')
                    else:
                        route.fulfill(status=200, content_type='application/json', body=MAP_BYTES)

                c.route('**/marble-map.json', fail_then_recover)
                h.go(p, base, '#studio/rhythm')
                h.choose(p, 'own-bar')
                h.add(p, 'q')
                partial = h.book(p)
                h.go(p, base, '#map', '[data-map-load-status]')
                p.locator('[data-map-load-status]').filter(has_text='unavailable').wait_for()
                h.ok(p.locator('[data-map-refresh]').is_enabled(), 'failed map gives an enabled explicit Retry')
                h.ok('Try loading the map again' in p.locator('[data-map-refresh]').inner_text(), 'Retry says what will load')
                h.ok(len(requests) == 1, 'entering fallback does not automatically retry')
                h.go(p, base, '#studio/rhythm')
                h.ok(h.current(p)['sequence'] == ['q'], 'existing game remains available with its partial work after map failure')
                h.go(p, base, '#map', '[data-map-load-status]')
                p.evaluate("window.__mapStartupNotice=document.querySelector('[data-map-load-status]')")
                h.click(p, '[data-map-refresh]')
                p.locator('[data-map-refresh]').filter(has_text='Show the map').wait_for()
                h.ok(len(requests) == 2, 'one explicit Retry makes exactly one new map request')
                h.ok(p.evaluate("window.__mapStartupNotice===document.querySelector('[data-map-load-status]')"), 'ready status updates in place without automatic Map reveal')
                h.ok(not p.locator('.map-focus').count(), 'successful retry waits for explicit Show')
                h.ok(h.book(p) == partial, 'failure/retry/status never changes the saved partial bar or unrelated roots')
                h.click(p, '[data-map-refresh]')
                map_metadata(p)
                h.ok(h.book(p) == partial, 'explicit Show also leaves saved work exact')
                screenshot(p, f'map-retry-open-{width}')
                cases.append({'width': width, 'case': 'intentional404 then explicit retry/show', 'checks': h.checks - n})
                c.close()

            expected_http = [x for x in h.http_failures if x['case'].startswith('failed-map-') and x['url'].endswith('/marble-map.json') and x['status'] == 404]
            unexpected_http = [x for x in h.http_failures if x not in expected_http]
            expected_console = [x for x in h.console_errors if x['case'].startswith('failed-map-') and x.get('location', {}).get('url', '').endswith('/marble-map.json') and '404' in x['text']]
            unexpected_console = [x for x in h.console_errors if x not in expected_console]
            h.ok(len(expected_http) == 2, 'both intentional404 faults were actually observed')
            h.ok(not unexpected_http, 'no unexpected HTTP failures: ' + json.dumps(unexpected_http))
            h.ok(not unexpected_console, 'no unexpected console errors: ' + json.dumps(unexpected_console))
            h.ok(not h.request_failures, 'no unexpected request failures: ' + json.dumps(h.request_failures))
            h.ok(not h.errors, 'no page errors: ' + json.dumps(h.errors))
            receipt = {'status': 'passed', 'checks': h.checks, 'cases': cases, 'pageErrors': h.errors,
                       'expectedIntentionalHttpFailures': expected_http, 'expectedIntentionalConsoleErrors': expected_console,
                       'unexpectedHttpFailures': unexpected_http, 'unexpectedConsoleErrors': unexpected_console,
                       'requestFailures': h.request_failures, 'navigationAborts': h.navigation_aborts,
                       'scope': 'only marble-map.json held/faulted; real app and native controls, no app interception or audio stubs'}
            (OUT / 'receipt.json').write_text(json.dumps(receipt, indent=2))
            print(f'Optional map browser: {h.checks} assertions passed at320/820; artifacts {OUT}')
        except Exception:
            (OUT / 'failure.txt').write_text(traceback.format_exc())
            (OUT / 'browser-faults.json').write_text(json.dumps({'pageErrors': h.errors, 'consoleErrors': h.console_errors,
                        'requestFailures': h.request_failures, 'httpFailures': h.http_failures, 'navigationAborts': h.navigation_aborts}, indent=2))
            for p, label in h.pages:
                if not p.is_closed():
                    try:
                        screenshot(p, label + '-failure')
                        (OUT / (label + '-failure.html')).write_text(p.content())
                    except Exception:
                        pass
            raise
        finally:
            for c in h.contexts:
                try:
                    c.close()
                except Exception:
                    pass
            browser.close()
            server.shutdown()


if __name__ == '__main__':
    main()
