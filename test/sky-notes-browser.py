"""Spec 323 sky notes in Chromium at 320 and 820 px: real storage, real Notes transfer.

The ordinary journey uses the actual device date. A separate clock context controls only
Date's current reading, for month navigation and the date-flip refusal.
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
OUT = Path(os.environ.get('SKY_ARTIFACTS', tempfile.mkdtemp(prefix='sky-notes-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['RHYTHM_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('native_notebook_helpers', ROOT / 'test/rhythm-browser.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
LABELS = {'thin-growing': 'Thin and growing', 'half-growing': 'Half and growing', 'fat-growing': 'Nearly full and growing',
          'full': 'Full', 'fat-shrinking': 'Nearly full and shrinking', 'half-shrinking': 'Half and shrinking',
          'thin-shrinking': 'Thin and shrinking', 'not-seen': 'I couldn’t see the moon'}


def setup(browser, width, seed, label, clock=None):
    c, p = h.setup(browser, width, seed, label)
    if clock:
        c.add_init_script('window.__skyNow=' + json.dumps(clock) + ';' + r'''
          const RealDate=Date;
          window.Date=class extends RealDate{
            constructor(...args){super(...(args.length?args:[window.__skyNow]));}
            static now(){return new RealDate(window.__skyNow).getTime();}
          };
        ''')
    return c, p


def go(p, base, route='#almanac/sky', selector='[data-sky-root]'):
    h.go(p, base, route, selector)


def reload(p):
    identity = h.active(p)
    p.reload(wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():
        p.locator(f'[data-select-explorer="{identity}"]').click()
    p.locator('[data-sky-root]').wait_for()


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator('[data-sky-root] button,[data-sky-root] a').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44||parseFloat(getComputedStyle(x).fontSize)<16))"
        ".map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    h.ok(not bad, '44 px controls and 16 px text: ' + str(bad))


def sky(p):
    return h.book(p).get('sky')


def today(p):
    return p.evaluate("()=>{const d=new Date();return `${String(d.getFullYear()).padStart(4,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}")


def status(p):
    return p.locator('#sky-status').inner_text()


def focused(p, selector):
    return p.locator(selector).first.evaluate('x=>document.activeElement===x')


def picture(p, code):
    return p.locator(f'[data-sky-shape="{code}"] path').get_attribute('d')


def hear_text(p):
    p.locator('[data-sky-hear] [data-speak]').click()
    return p.locator('[data-sky-hear] [data-speak]').get_attribute('data-speak')


def bring(p, base, s):
    go(p, base, '#notes', '#progress-file')
    p.locator('#progress-file').set_input_files({'name': 'synthetic-sky-notebook.json', 'mimeType': 'application/json',
                                               'buffer': json.dumps(s).encode()})
    p.locator('#progress-import-confirm').wait_for()
    h.ok('Sky notes' in p.locator('.import-preview').inner_text(), 'import preview names Sky notes')
    h.click(p, '#progress-import-confirm')
    p.locator('#progress-import-status').wait_for()
    h.ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual confirm/import completed')


def main():
    seeds = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', r'''
      import {waitingNotebook} from './test/story-arrivals-checks.mjs';
      const base=waitingNotebook();base.syntheticOther.payload='x'.repeat(512*1024);
      const months=structuredClone(base);months.sky=[{date:'2026-08-09',shape:'full'},{date:'2026-09-02',shape:'thin-growing'},{date:'2026-09-02',shape:'half-growing',kept:'Synthetic last readable'},{date:'2026-09-03',shape:'eclipse'},null,{date:'2026-12-03',shape:'full',note:'Synthetic future import'}];
      const odd=structuredClone(base);odd.sky={kept:'Synthetic earlier object'};
      console.log(JSON.stringify({base,months,odd}));'''], cwd=ROOT, text=True))
    server = None
    base = os.environ.get('SKY_TEST_URL')
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
                # First visit, select, Save, change today, reload.
                _, p = setup(browser, width, seeds['base'], f'journey-{width}')
                go(p, base)
                start = h.book(p)
                h.ok('sky' not in start and 'hemisphere' not in start, 'opening the page writes nothing')
                h.ok(p.locator('[data-sky-shape]').count() == 8, 'eight choices')
                h.ok([p.locator('[data-sky-shape]').nth(i).inner_text().strip() for i in range(8)] == list(LABELS.values()), 'choices in cycle order with their labels')
                h.ok(p.locator('.sky-safety').inner_text() == 'Never look straight at the sun.', 'safety line always shown')
                h.ok(p.locator('.sky-panel').count() == 3, 'three panels')
                h.ok('No sky notes yet.' in p.locator('.sky-strip').inner_text(), 'empty strip never nags')
                bounds(p)
                h.click(p, '[data-sky-save]')
                h.ok(status(p) == 'Choose a shape first.' and 'sky' not in h.book(p), 'Save with no choice writes nothing')
                h.click(p, '[data-sky-shape="thin-growing"]')
                h.ok(p.locator('[data-sky-shape="thin-growing"]').get_attribute('aria-pressed') == 'true', 'choice is pressed')
                h.ok('sky' not in h.book(p), 'choosing alone writes nothing')
                h.click(p, '[data-sky-save]')
                day = today(p)
                h.ok(sky(p) == [{'date': day, 'shape': 'thin-growing'}], 'Save writes today’s note')
                h.ok(status(p) == 'Saved. Dot drew today’s moon in the strip.' and focused(p, '#sky-status'), 'saved status takes focus')
                d = int(day[8:])
                h.ok(p.locator(f'.sky-day[aria-label="{d}: Thin and growing"]').count() == 1, 'strip shows today’s note')
                h.click(p, '[data-sky-shape="full"]')
                h.click(p, '[data-sky-save]')
                h.ok(sky(p) == [{'date': day, 'shape': 'full'}], 'changing today replaces the shape only')
                reload(p)
                h.ok('You noted full today.' in p.locator('.sky-today').inner_text(), 'reload shows today’s saved note')
                h.ok(p.locator('[data-sky-shape="full"]').get_attribute('aria-pressed') == 'true', 'saved note is pressed after reload')
                h.click(p, '[data-sky-save]')
                h.ok(status(p) == 'That is already today’s note.' and sky(p) == [{'date': day, 'shape': 'full'}], 'same note is a no-op')
                # Keyboard and touch.
                p.locator('[data-sky-shape="half-growing"]').focus()
                p.keyboard.press('Enter')
                h.ok(p.locator('[data-sky-shape="half-growing"]').get_attribute('aria-pressed') == 'true', 'keyboard choice')
                p.locator('[data-sky-shape="not-seen"]').tap()
                h.ok(p.locator('[data-sky-shape="not-seen"]').get_attribute('aria-pressed') == 'true', 'touch choice')
                p.locator('[data-sky-save]').focus()
                p.keyboard.press('Enter')
                h.ok(sky(p) == [{'date': day, 'shape': 'not-seen'}], 'keyboard Save; not-seen is a full note')
                # Hear reads the page as it is now, including the latest status.
                spoken = hear_text(p)
                for part in ['Dot keeps a note of the moon.', 'Never look straight at the sun.', 'Today on this device:', 'I couldn’t see the moon',
                             'Saved. Dot drew today’s moon in the strip.', 'Not sure if it’s growing or shrinking?', 'It’s the same moon.',
                             'about 29 and a half days', 'Near the equator, pick either one']:
                    h.ok(part in spoken, 'Hear reads: ' + part)
                h.ok('sky' in h.book(p) and h.book(p)['sky'] == [{'date': day, 'shape': 'not-seen'}] and 'support' not in json.dumps(h.book(p)['sky']), 'Hear saves no record')
                # Hemisphere switch flips pictures and leaves notes byte-identical.
                north = picture(p, 'thin-growing')
                notes_before = json.dumps(sky(p))
                h.click(p, '[data-sky-hemisphere="north"]')
                h.ok('hemisphere' not in h.book(p), 'choosing the current setting writes nothing')
                h.click(p, '[data-sky-hemisphere="south"]')
                h.ok(h.book(p)['hemisphere'] == 'south' and json.dumps(sky(p)) == notes_before, 'setting saved, notes byte-identical')
                h.ok(status(p) == 'Moon pictures changed. Your notes stay the same.', 'setting status')
                h.ok(picture(p, 'thin-growing') != north and picture(p, 'thin-growing') == p.evaluate("()=>import('./sky-notes-core.mjs').then(k=>k.moonPath('thin-shrinking','north'))"), 'southern thin and growing looks like northern thin and shrinking')
                h.ok(p.locator('[data-sky-shape="full"] path').get_attribute('d') == p.evaluate("()=>import('./sky-notes-core.mjs').then(k=>k.moonPath('full','north'))"), 'full is the same in both settings')
                bounds(p)
                h.snap(p, f'sky-{width}')
                # Links: Weather notes to Sky notes and back; the almanac page links Sky notes.
                h.ok(p.locator('.sky-links a[href="#almanac/weather"]').count() == 1 and p.locator('.sky-links a[href="#almanac"]').inner_text() == 'Keeper’s Pages', 'Sky notes links')
                go(p, base, '#almanac/weather', '[data-wt-root]')
                h.ok(p.locator('[data-wt-root] a[href="#almanac/sky"]').count() == 1, 'Weather notes links Sky notes')
                go(p, base, '#almanac', '.sky-entry')
                h.ok(p.locator('.sky-entry a[href="#almanac/sky"]').count() == 1, 'the almanac page links Sky notes')
                go(p, base, '#notes', '.sky-notes')
                notes = p.locator('.sky-notes').inner_text()
                h.ok(f'{day}: I couldn’t see the moon' in notes and 'waning crescent' in notes and 'south of the equator' in notes, 'Grown-up notes section')
                h.ok(p.locator('[data-sky-root]').count() == 0, 'suffixless route only')

            # Month navigation, future imports and the date flip, with a fixed clock.
            for width in [320, 820]:
                _, m = setup(browser, width, seeds['months'], f'months-{width}', clock='2026-10-15T12:00:00')
                go(m, base)
                h.ok(m.locator('#sky-month-title').inner_text() == 'October 2026', 'opens on the device month')
                h.ok(m.locator('[data-sky-month="later"]').is_disabled() and m.locator('[data-sky-month="this"]').is_disabled(), 'no future month')
                h.click(m, '[data-sky-month="earlier"]')
                h.ok(m.locator('#sky-month-title').inner_text() == 'September 2026', 'earlier month')
                h.ok(m.locator('.sky-day[aria-label="2: Half and growing"]').count() == 1, 'last readable entry per date')
                h.ok(m.locator('.sky-day[aria-label="3: no note"]').count() == 1, 'unreadable entry shows as no note')
                h.click(m, '[data-sky-month="earlier"]')
                h.ok(m.locator('#sky-month-title').inner_text() == 'August 2026' and m.locator('[data-sky-month="earlier"]').is_disabled(), 'earliest month')
                h.click(m, '[data-sky-month="later"]')
                h.click(m, '[data-sky-month="later"]')
                h.ok(m.locator('#sky-month-title').inner_text() == 'October 2026' and m.locator('[data-sky-month="later"]').is_disabled(), 'December import is never a navigable month')
                h.click(m, '[data-sky-month="earlier"]')
                h.click(m, '[data-sky-month="this"]')
                h.ok(m.locator('#sky-month-title').inner_text() == 'October 2026', 'This month returns')
                bounds(m)
                saved = h.book(m)
                h.click(m, '[data-sky-shape="fat-shrinking"]')
                m.evaluate("window.__skyNow='2026-10-16T12:00:00'")
                h.click(m, '[data-sky-save]')
                h.ok(h.book(m) == saved and status(m) == 'The date on this device changed. Refresh to see today. Nothing was saved.', 'forward date flip refuses with no write')
                h.ok(m.locator('[data-sky-save]').is_disabled(), 'Save waits for Refresh')
                h.click(m, '[data-sky-refresh]')
                h.ok('October 16' in m.locator('.sky-date').inner_text() and m.locator('[data-sky-shape][aria-pressed="true"]').count() == 0, 'Refresh shows today and clears the choice')
                m.evaluate("window.__skyNow='2026-10-15T12:00:00'")
                h.click(m, '[data-sky-shape="fat-shrinking"]')
                h.click(m, '[data-sky-save]')
                h.ok(h.book(m) == saved, 'backward date flip also refuses')
                h.click(m, '[data-sky-refresh]')
                h.click(m, '[data-sky-shape="fat-shrinking"]')
                h.click(m, '[data-sky-save]')
                after = h.book(m)['sky']
                h.ok(after[:-1] == saved['sky'] and after[-1] == {'date': '2026-10-15', 'shape': 'fat-shrinking'}, 'append keeps every raw entry, including the future import')
                h.snap(m, f'months-{width}')

            # A non-array sky root blocks only sky writes.
            _, o = setup(browser, 820, seeds['odd'], 'unsupported')
            go(o, base)
            h.ok(o.locator('[data-sky-shape]').count() == 0 and 'can’t be saved for this explorer' in o.locator('.sky-today').inner_text(), 'unsupported root: no choices')
            h.ok(o.locator('.sky-panel').count() == 3 and o.locator('.sky-links a').count() == 2, 'panels and links stay open')
            h.click(o, '[data-sky-hemisphere="south"]')
            h.ok(h.book(o)['hemisphere'] == 'south' and h.book(o)['sky'] == {'kept': 'Synthetic earlier object'}, 'setting still saves; earlier root kept')

            # Export, then import into a second explorer's browser, with raw duplicates and 500 KiB of other work.
            _, a = setup(browser, 820, seeds['months'], 'export')
            go(a, base)
            h.click(a, '[data-sky-hemisphere="south"]')
            exported = h.download(a, base, 'sky-export')
            h.ok(exported['sky'] == seeds['months']['sky'] and exported['hemisphere'] == 'south', 'download keeps raw sky entries and the setting')
            _, b = setup(browser, 820, seeds['base'], 'import')
            go(b, base)
            bring(b, base, exported)
            got = h.book(b)
            h.ok(got['sky'] == exported['sky'] and got['hemisphere'] == 'south' and len(got['syntheticOther']['payload']) == 512 * 1024, 'import keeps sky, setting and unrelated work')
            go(b, base)
            h.ok(b.locator('[data-sky-shape="thin-growing"] path').get_attribute('d') == b.evaluate("()=>import('./sky-notes-core.mjs').then(k=>k.moonPath('thin-growing','south'))"), 'imported setting shows southern pictures')
            # Weather and tallies pages keep their own roots.
            go(b, base, '#almanac/tallies', '[data-wt-root]')
            h.ok(b.locator('[data-sky-root]').count() == 0, 'tallies page separate')

            h.ok(not h.errors, 'no page errors: ' + json.dumps(h.errors))
            h.ok(not h.console_errors, 'no console errors: ' + json.dumps(h.console_errors))
            h.ok(not h.request_failures, 'no failed requests: ' + json.dumps(h.request_failures))
            (OUT / 'receipt.json').write_text(json.dumps({'status': 'passed', 'checks': h.checks, 'base': base}, indent=2))
            print(f'Sky notes browser: {h.checks} assertions passed at 320/820; artifacts {OUT}')
        except Exception:
            (OUT / 'failure.txt').write_text(traceback.format_exc())
            for p, label in h.pages:
                if not p.is_closed():
                    try:
                        h.snap(p, label + '-failure')
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
            if server:
                server.shutdown()


if __name__ == '__main__':
    main()
