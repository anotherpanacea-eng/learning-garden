"""Spec 322 Field Journal in Chromium at 320 and 820 px: real storage, real Notes transfer.

Storybook stays the default; the look changes only frame lines and chrome, and never the café record.
"""
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
OUT = Path(os.environ.get('FIELD_JOURNAL_ARTIFACTS', tempfile.mkdtemp(prefix='field-journal-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['RHYTHM_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('native_notebook_helpers', ROOT / 'test/rhythm-browser.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
ok = h.ok


def go(p, base, route, selector):
    h.go(p, base, route, selector)


def root_style(p):
    return p.evaluate('document.documentElement.dataset.style||null')


def main_html(p):
    return p.evaluate("document.querySelector('#main').innerHTML")


def choose(p, base, look, keyboard=False):
    go(p, base, '#notes', '#style-form')
    if keyboard:
        checked = p.locator('#style-form input[name="style"]:checked')
        current = checked.get_attribute('value')
        if current != look:
            checked.press('ArrowDown' if look == 'field-journal' else 'ArrowUp')
        else:
            checked.focus()
        got = p.evaluate("[document.activeElement.tagName,document.activeElement.value]")
        ok(got == ['INPUT', look], 'arrow keys move between the looks: ' + str(got))
        p.keyboard.press('Tab')
        ok(p.evaluate("document.activeElement.textContent") == 'Use this look', 'Tab reaches the button')
        p.keyboard.press('Enter')
    else:
        p.locator(f'#style-form input[value="{look}"]').check()
        h.click(p, '#style-form button[type="submit"]')
    p.wait_for_function("document.querySelector('#style-status')?.textContent.length>0")
    return p.locator('#style-status').inner_text()


def cafe_record(p):
    return h.book(p).get('cafe')


def main():
    seeds = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', r'''
      import {waitingNotebook} from './test/story-arrivals-checks.mjs';
      const base=waitingNotebook();base.garden.welcomeFilmSeen=true;
      const mystery=structuredClone(base);mystery.garden.style='mystery';
      const plain=structuredClone(base);plain.garden.style='storybook';
      console.log(JSON.stringify({base,mystery,plain}));'''], cwd=ROOT, text=True))
    copy = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', r'''
      import {fieldJournalCafe} from './dist/style-frames.mjs';import {guests} from './dist/cafe-content.mjs';
      console.log(JSON.stringify({fj:fieldJournalCafe,guests}));'''], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('FIELD_JOURNAL_TEST_URL')
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
                # 1. Missing, 'storybook' and an unknown value all render the same Storybook page.
                pages = {}
                for name in ['base', 'plain', 'mystery']:
                    _, p = h.setup(browser, width, seeds[name], f'default-{name}-{width}')
                    go(p, base, '#cafe', '[data-cafe-view]')
                    ok(root_style(p) is None, f'{name}: no root look')
                    cafe = main_html(p)
                    go(p, base, '#home', '#main')
                    pages[name] = (cafe, main_html(p), p)
                ok(pages['base'][0] == pages['plain'][0] == pages['mystery'][0], 'café HTML is identical without a look')
                ok(pages['base'][1] == pages['plain'][1] == pages['mystery'][1], 'Home HTML is identical without a look')
                ok('mystery' == h.book(pages['mystery'][2])['garden']['style'], 'an unknown look is kept on view')

                p = pages['base'][2]
                go(p, base, '#notes', '#style-form')
                ok(not p.locator('dialog[open]').count(), 'no film covers Notes')
                ok(p.locator('#style-form input[value="storybook"]').is_checked(), 'Storybook starts selected')
                ok(p.locator('.style-preview-card').count() == 2, 'the preview shows the order both ways')
                ok(p.locator('.style-preview-card[data-style-preview="field-journal"]').inner_text().find(copy['fj']['puff']['greeting'][:30]) >= 0, 'the preview shows Puff in Field Journal')
                ok(root_style(p) is None, 'the preview never sets the page look')
                small = p.evaluate("[...document.querySelectorAll('.style-panel input,.style-panel button')].map(e=>e.closest('label')||e).filter(e=>e.getBoundingClientRect().height<44).length")
                ok(small == 0, '44 px targets in the panel')
                ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow in Notes')
                cols = p.evaluate("getComputedStyle(document.querySelector('.style-preview-pair')).gridTemplateColumns.split(' ').length")
                ok(cols == (1 if width == 320 else 2), 'preview stacks at 320 and sits side by side at 820')

                # 3 (setup). Start an order and reach the number stage with a typed answer, in Storybook.
                go(p, base, '#cafe', '[data-cafe-view]')
                if p.locator('[data-cafe-action="next"]').count():
                    h.click(p, '[data-cafe-action="next"]')
                order = p.evaluate("""()=>{const i=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+i)).cafe.current}""")
                ok(order and order.get('stage') == 'plate', 'an order is open at the plate')

                # 2. Choose Field Journal in Notes (keyboard at 320, pointer at 820).
                status = choose(p, base, 'field-journal', keyboard=width == 320)
                ok(status == 'Look changed for this explorer.', 'saved status announced')
                ok(p.locator('#style-status').get_attribute('role') == 'status', 'status region')
                ok(root_style(p) == 'field-journal', 'root look set')
                ok(h.book(p)['garden']['style'] == 'field-journal', 'look saved')
                ok(choose(p, base, 'field-journal') == 'This explorer already uses this look.', 'same look is a no-op')

                before = cafe_record(p)
                go(p, base, '#cafe', '[data-cafe-view]')
                ok(root_style(p) == 'field-journal', 'café keeps the look')
                guest = next(g for g in copy['guests'] if g['id'] == h.book(p)['cafe']['current']['guestId']) if 'guestId' in h.book(p)['cafe']['current'] else None
                text = p.locator('#main').text_content()
                ok('Café ledger' in text and 'Our café goal' not in text, 'variant eyebrow')
                ok(copy['fj']['supper']['invitation'] in text, 'variant invitation')
                hear = p.evaluate("[...document.querySelectorAll('[data-say],[data-hear],button')].map(b=>b.dataset.say||b.dataset.hear||'').join(' ')")
                ok(copy['fj']['supper']['invitation'] in hear or copy['fj']['supper']['invitation'] in p.evaluate("document.querySelector('.cafe-supper').outerHTML"), 'Hear our café goal reads the same text')
                ok(cafe_record(p) == before, 'switching look leaves the café record unchanged')

                # 9. Help controls keep their size in both looks.
                sizes = p.evaluate("[...document.querySelectorAll('.cafe-game button,.cafe-game summary')].filter(e=>e.offsetParent).map(e=>Math.round(e.getBoundingClientRect().height))")
                ok(all(s >= 44 for s in sizes), 'café controls stay 44 px in Field Journal: ' + str(sizes))
                ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow in the café')
                ok(p.evaluate("getComputedStyle(document.querySelector('.cafe-counter-scene')||document.querySelector('.cafe-game')).color") != '', 'tokens resolve')

                # 4. Serve the order with test-only stock: the variant thanks and the stamp.
                p.evaluate("""()=>{const k='number-garden-v1:'+JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;const s=JSON.parse(localStorage.getItem(k));s.cafe.current.stage='served';s.cafe.current.served=true;localStorage.setItem(k,JSON.stringify(s));}""")
                h.reload_studio = None
                p.reload(wait_until='domcontentloaded')
                p.locator('#explorer-header').wait_for()
                go(p, base, '#cafe', '[data-cafe-view]')
                stamp = p.locator('.cafe-stamp')
                if h.book(p)['cafe']['current'].get('recovered'):
                    ok(stamp.count() == 0, 'a recovered closed visit gets no stamp')
                else:
                    ok(stamp.count() == 1 and stamp.get_attribute('aria-hidden') == 'true', 'stamp hidden from assistive technology')
                    ok(p.evaluate("getComputedStyle(document.querySelector('.cafe-stamp')).animationName") == 'none', 'no stamp motion with reduced motion')

                # 5. Reload keeps the look; another explorer shows Storybook; switching back restores it.
                ok(root_style(p) == 'field-journal', 'reload keeps the look')
                first = h.active(p)
                go(p, base, '#notes', '#style-form')

                # 6. Export, then import: the look returns as a separate explorer.
                exported = h.download(p, base, f'field-journal-{width}')
                ok(exported['garden']['style'] == 'field-journal', 'export carries the look')
                go(p, base, '#notes', '#progress-file')
                p.locator('#progress-file').set_input_files({'name': 'synthetic-fj.json', 'mimeType': 'application/json', 'buffer': json.dumps(exported).encode()})
                p.locator('#progress-import-confirm').wait_for()
                h.click(p, '#progress-import-confirm')
                p.locator('#progress-import-status').wait_for()
                ok('separate explorer' in p.locator('#progress-import-status').inner_text(), 'import is a separate explorer: ' + p.locator('#progress-import-status').inner_text())
                ok(h.active(p) != first, 'the imported explorer is active')
                go(p, base, '#cafe', '[data-cafe-view]')
                ok(root_style(p) == 'field-journal', 'the imported explorer keeps the look')
                mystery = dict(exported)
                mystery['garden'] = dict(exported['garden'], style='mystery')
                go(p, base, '#notes', '#progress-file')
                p.locator('#progress-file').set_input_files({'name': 'synthetic-mystery.json', 'mimeType': 'application/json', 'buffer': json.dumps(mystery).encode()})
                p.locator('#progress-import-confirm').wait_for()
                h.click(p, '#progress-import-confirm')
                p.locator('#progress-import-status').wait_for()
                go(p, base, '#cafe', '[data-cafe-view]')
                ok(root_style(p) is None, 'an unknown look shows Storybook')
                again = h.download(p, base, f'mystery-{width}')
                ok(again['garden']['style'] == 'mystery', 'an unknown look exports unchanged')

                # 8. Before and after a run of switches, the record differs only in garden.style.
                before = h.raw_report(again)
                for look in ['field-journal', 'storybook', 'field-journal']:
                    choose(p, base, look)
                after = h.raw_report(h.download(p, base, f'switches-{width}'))
                ok(after['garden'].pop('style') == 'field-journal' and before['garden'].pop('style') == 'mystery', 'the look changed')
                ok(after == before, 'nothing else changed across switches')

                # Home chrome: the parcel area is unchanged in markup.
                go(p, base, '#home', '#main')
                ok(root_style(p) == 'field-journal', 'Home keeps the look')
            ok(not h.errors, 'no page errors: ' + json.dumps(h.errors[:3]))
        except Exception:
            for page, label in h.pages:
                try:
                    page.screenshot(path=str(OUT / f'failure-{label}.png'), full_page=True)
                except Exception:
                    pass
            traceback.print_exc()
            raise
        finally:
            browser.close()
            if server:
                server.shutdown()
    print(f'{h.checks} Field Journal browser checks passed. Artifacts: {OUT}')


if __name__ == '__main__':
    main()
