"""Synthetic actual-app Archive navigation, help and historical-feedback regression."""
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def main():
    seed = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', """
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {setArchivePage,checkArchiveReply} from './dist/travelers-archive-core.mjs';
const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;
setArchivePage(s,'reply');checkArchiveReply(s);
s.travelersArchive.checks.at(-1).feedback.originalText='Earlier saved wording.';
console.log(JSON.stringify(s));
"""], cwd=ROOT, text=True))
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [
        {'id': 'explorer-1', 'avatar': 'sky', 'color': 'blue', 'symbol': 'leaf',
         'createdAt': '2026-10-30T12:00:00.000Z'}]}

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    server = http.server.ThreadingHTTPServer(
        ('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    errors = []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None)
            try:
                context = browser.new_context(viewport={'width': 820, 'height': 1000})
                context.add_init_script('''(d=>{if(!localStorage.getItem('archive-fixture')){
localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));
localStorage.setItem('number-garden-v1:explorer-1',JSON.stringify(d.seed));
localStorage.setItem('archive-fixture','1');}})(''' + json.dumps({'registry': registry, 'seed': seed}) + ')')
                page = context.new_page()
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.goto(f'http://127.0.0.1:{server.server_port}/#archive')
                picker = page.locator('[data-select-explorer="explorer-1"]')
                page.locator('.ta-workspace,[data-select-explorer="explorer-1"]').first.wait_for()
                if picker.count():
                    picker.click()
                page.locator('.ta-workspace').wait_for()

                def archive():
                    return page.evaluate("JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).travelersArchive")

                old_checks = archive()['checks']
                assert 'Earlier saved wording.' in page.locator('#ta-reply-feedback').inner_text()
                for destination in ['parcel', 'place-dates', 'sources', 'reply']:
                    button = page.locator(f'.ta-pages [data-ta-page="{destination}"]')
                    button.focus()
                    button.press('Enter')
                    current = page.locator('.ta-pages [aria-current="page"]')
                    assert current.count() == 1 and current.get_attribute('data-ta-page') == destination
                    assert page.locator('.ta-pages [aria-pressed]').count() == 0
                    assert page.locator('#ta-title').evaluate('e=>e===document.activeElement')
                    page.locator('[data-ta-support="help"]').click()
                    assert page.locator('#ta-help').is_visible()
                    assert page.locator('#ta-help').evaluate('e=>e===document.activeElement')
                page.locator('[data-ta-support="together"]').click()
                assert page.locator('[data-ta-support="together"]').get_attribute('aria-pressed') == 'true'
                assert archive()['support']['reply']['together'] is True
                assert archive()['reading'] == 'unobserved'
                assert archive()['checks'] == old_checks
                page.locator('#ta-reply-text').fill('A fictional reply about the dates.')
                page.locator('[data-ta-keep]').click()
                assert archive()['kept']['reply']['text'] == 'A fictional reply about the dates.'
                page.reload()
                page.locator('#ta-reply-text').wait_for()
                assert page.locator('#ta-reply-text').input_value() == 'A fictional reply about the dates.'
                assert archive()['checks'] == old_checks
                assert 'Earlier saved wording.' in page.locator('#ta-reply-feedback').inner_text()
                page.locator('[data-ta-reply-check]').click()
                assert archive()['checks'][:-1] == old_checks
                assert 'You can read them with someone.' in page.locator('#ta-reply-feedback').inner_text()
                assert not errors, errors
                print('Archive browser: keyboard navigation, help, support, saved words and historical feedback passed')
            finally:
                browser.close()
    finally:
        server.shutdown()


if __name__ == '__main__':
    main()
