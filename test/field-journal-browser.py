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
    # Spec 358's New for you shelf and marks depend on the day, not the look; compare without them.
    return p.evaluate("(()=>{const m=document.querySelector('#main').cloneNode(true);m.querySelectorAll('.nfy-shelf,.nfy-mark').forEach(x=>x.remove());return m.innerHTML;})()")


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


HELP = ".cafe-game .hear-button,.cafe-game [data-cafe-action=\"help\"],.cafe-game .cafe-help button,.cafe-game .cafe-help summary,.cafe-game .cafe-stage-skip button"


def help_controls(p):
    return p.evaluate("""sel=>[...document.querySelectorAll(sel)].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);
      return {text:e.textContent.trim(),w:Math.round(r.width),h:Math.round(r.height),color:c.color,bg:c.backgroundColor,box:[r.left,r.top,r.right,r.bottom]};})""", HELP)


def overlaps(items):
    for i, a in enumerate(items):
        for b in items[i + 1:]:
            x = min(a['box'][2], b['box'][2]) - max(a['box'][0], b['box'][0])
            y = min(a['box'][3], b['box'][3]) - max(a['box'][1], b['box'][1])
            if x > 1 and y > 1:
                return [a['text'], b['text']]
    return None


def active(p):
    return h.active(p)


def switch_to(p, base, identity, route='#cafe', selector='[data-cafe-view]'):
    p.evaluate("""id=>{const k='learning-garden-explorers',s=JSON.parse(localStorage.getItem(k));s.activeId=id;localStorage.setItem(k,JSON.stringify(s));}""", identity)
    p.reload(wait_until='domcontentloaded')
    go(p, base, '#home', '#main')
    go(p, base, route, selector)
    ok(active(p) == identity, 'switched explorer')


def serve(base_dir):
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    class Server(http.server.ThreadingHTTPServer):
        request_queue_size = 128
        daemon_threads = True
    server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(base_dir)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server, f'http://127.0.0.1:{server.server_port}/'


def main():
    seeds = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', r"""
      import {waitingNotebook} from './test/story-arrivals-checks.mjs';
      import {ensureCafe,nextGuest,skipGuest,orderFor,adjustBite,checkPlate,skipCafeStage,currentRecipe} from './dist/cafe-core.mjs';
      import {ingredients} from './dist/cafe-content.mjs';
      const base=waitingNotebook();base.garden.welcomeFilmSeen=true;
      const mystery=structuredClone(base);mystery.garden.style='mystery';
      const plain=structuredClone(base);plain.garden.style='storybook';
      const total=structuredClone(base);ensureCafe(total);total.cafe.seed=192;total.cafe.range='small';nextGuest(total);
      while(orderFor(total.cafe).guest.id==='ember')skipGuest(total);
      const o=orderFor(total.cafe),food=ingredients.find(i=>!i.orchard&&o.wanted.every(w=>i.properties.includes(w)));
      for(let i=0;i<o.bites;i++)adjustBite(total,food.id,1);checkPlate(total);
      const ready=structuredClone(total);skipCafeStage(ready);skipCafeStage(ready);for(const x of currentRecipe(ready.cafe))ready.cafe.stock[x.ingredient.id]=x.required;
      console.log(JSON.stringify({base,mystery,plain,total,ready,guest:o.guest.id,product:o.total}));"""], cwd=ROOT, text=True))
    copy = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', r"""
      import {fieldJournalCafe} from './dist/style-frames.mjs';import {guests,cafeSuppers} from './dist/cafe-content.mjs';
      console.log(JSON.stringify({fj:fieldJournalCafe,guests,supper:cafeSuppers[0]}));"""], cwd=ROOT, text=True))
    guest = next(g for g in copy['guests'] if g['id'] == seeds['guest'])
    servers = []
    base = os.environ.get('FIELD_JOURNAL_TEST_URL')
    if not base:
        server, base = serve(ROOT / 'dist')
        servers.append(server)
    base = base.rstrip('/') + '/'
    # The base revision's own build, for spec 322 §8 browser item 1.
    main_base = os.environ.get('FIELD_JOURNAL_MAIN_URL')
    if not main_base:
        rev = os.environ.get('FIELD_JOURNAL_MAIN_REV') or 'origin/main'
        tmp = Path(tempfile.mkdtemp(prefix='field-journal-main-'))
        archive = subprocess.run(['git', 'archive', rev, 'dist'], cwd=ROOT, check=True, capture_output=True).stdout
        subprocess.run(['tar', '-x', '-C', str(tmp)], input=archive, check=True)
        server, main_base = serve(tmp / 'dist')
        servers.append(server)
    main_base = main_base.rstrip('/') + '/'
    with sync_playwright() as pw:
        args = {'headless': True, 'args': ['--disable-quic']}
        if os.environ.get('CHROME_PATH'):
            args['executable_path'] = os.environ['CHROME_PATH']
        browser = pw.chromium.launch(**args)
        try:
            for width in [320, 820]:
                # 1. Without a look, the café and Home render the same #main HTML as the base revision.
                renders = {}
                for name, url, seed in [('main', main_base, 'total'), ('branch', base, 'total'), ('mystery', base, 'mystery')]:
                    _, p = h.setup(browser, width, seeds[seed], f'default-{name}-{width}')
                    # Compare the same speech environment: this Mac loads voices asynchronously.
                    # Other journeys retain their normal device-voice behavior.
                    p.context.add_init_script('window.speechSynthesis.getVoices=()=>[];')
                    go(p, url, '#cafe', '[data-cafe-view]')
                    ok(root_style(p) is None, f'{name}: no root look')
                    cafe = main_html(p)
                    go(p, url, '#home', '#main')
                    renders[name] = (cafe, main_html(p))
                ok(renders['main'][0] == renders['branch'][0], 'café #main HTML matches the base revision')
                ok(renders['main'][1] == renders['branch'][1], 'Home #main HTML matches the base revision')
                ok(renders['mystery'] == renders['branch'] or renders['mystery'][0] != '', 'an unknown look renders')

                _, p = h.setup(browser, width, seeds['total'], f'journey-{width}')
                go(p, base, '#cafe', '[data-cafe-view]')
                ok(guest['greeting'][:25] in p.locator('#main').text_content(), 'Storybook arrival line')
                speak = p.locator('.cafe-supper [data-speak]').first.get_attribute('data-speak')
                ok(speak.startswith(copy['supper']['invitation'] + ' '), 'Storybook Hear text')

                # 3. A typed answer at the arithmetic stage, recorded before the switch.
                p.locator('#cafe-answer').fill(str(seeds['product'] + 1))
                p.locator('[data-cafe-number-form] button[type="submit"]').first.click()
                p.wait_for_function("document.querySelector('#cafe-answer')!==null")
                before = h.book(p)['cafe']
                story_help = help_controls(p)
                ok(before['current']['stage'] == 'total' and before['current']['total']['attempts'][-1] == seeds['product'] + 1, 'the typed answer is recorded')

                go(p, base, '#notes', '#style-form')
                ok(not p.locator('dialog[open]').count(), 'no film covers Notes')
                ok(p.locator('#style-form input[value="storybook"]').is_checked(), 'Storybook starts selected')
                ok(p.locator('.style-preview-card').count() == 2, 'the preview shows the order both ways')
                ok(copy['fj']['puff']['greeting'][:30] in p.locator('.style-preview-card[data-style-preview="field-journal"]').inner_text(), 'the preview shows Puff in Field Journal')
                small = p.evaluate("[...document.querySelectorAll('.style-panel input,.style-panel button')].map(e=>e.closest('label')||e).filter(e=>e.getBoundingClientRect().height<44).length")
                ok(small == 0, '44 px targets in the panel')
                ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow in Notes')
                cols = p.evaluate("getComputedStyle(document.querySelector('.style-preview-pair')).gridTemplateColumns.split(' ').length")
                ok(cols == (1 if width == 320 else 2), 'preview stacks at 320 and sits side by side at 820')

                def previews():
                    return p.evaluate("""[...document.querySelectorAll('.style-preview-card')].map(c=>{const t=c.querySelector('.cafe-ticket'),g=c.querySelector('.cafe-guest'),s=c.querySelector('.cafe-counter-scene');
                      return [c.dataset.stylePreview,getComputedStyle(t).backgroundColor,getComputedStyle(t).backgroundImage,getComputedStyle(g).color,getComputedStyle(s).backgroundImage];})""")
                story_previews = previews()
                ok(story_previews[0][1:] != story_previews[1][1:], 'the two previews differ')

                # 2. Choose Field Journal (keyboard at 320, pointer at 820).
                status = choose(p, base, 'field-journal', keyboard=width == 320)
                ok(status == 'Look changed for this explorer.', 'saved status announced')
                ok(p.locator('#style-status').get_attribute('role') == 'status', 'status region')
                ok(root_style(p) == 'field-journal', 'root look set')
                ok(h.book(p)['garden']['style'] == 'field-journal', 'look saved')
                ok(previews() == story_previews, 'each preview keeps its own look under either page look')
                ok(choose(p, base, 'field-journal') == 'This explorer already uses this look.', 'same look is a no-op')

                go(p, base, '#cafe', '[data-cafe-view]')
                ok(root_style(p) == 'field-journal', 'café keeps the look')
                text = p.locator('#main').text_content()
                ok(copy['fj'][guest['id']]['greeting'] in text, 'variant arrival line')
                ok('Café ledger' in text and 'Our café goal' not in text, 'variant eyebrow')
                ok(copy['fj']['supper']['invitation'] in text, 'variant invitation')
                speak = p.locator('.cafe-supper [data-speak]').first.get_attribute('data-speak')
                ok(speak.startswith(copy['fj']['supper']['invitation'] + ' ') and speak.endswith('Help and second tries are always welcome.'), 'Hear reads the variant invitation with the unchanged suffix')
                after = h.book(p)['cafe']
                ok(after == before, 'switching look leaves the café record, stage, plate and attempts unchanged')
                ok(p.locator('#cafe-answer').count() == 1, 'still at the arithmetic stage')
                paper = p.evaluate("[getComputedStyle(document.querySelector('.cafe-ticket')||document.querySelector('.cafe-supper')).backgroundColor]")
                ok(paper[0] in ('rgb(255, 253, 246)',), 'Field Journal paper reaches the café cards: ' + str(paper))

                # 9. Help controls: same set, order, size and colors in both looks, and not overlapped.
                fj_help = help_controls(p)
                ok([x['text'] for x in fj_help] == [x['text'] for x in story_help], 'same help controls in the same order: ' + str([x['text'] for x in fj_help]) + ' vs ' + str([x['text'] for x in story_help]))
                ok([(x['w'], x['h'], x['color'], x['bg']) for x in fj_help] == [(x['w'], x['h'], x['color'], x['bg']) for x in story_help], 'same help sizes and colors')
                ok(all(x['h'] >= 44 for x in fj_help), 'help controls stay 44 px')
                ok(overlaps(fj_help) is None, 'help controls do not overlap: ' + str(overlaps(fj_help)))
                ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow in the café')
                # 9, continued: before any attempt the help trigger shows; compare it, then the support it opens, in both looks.
                looks = {}
                for look in ['storybook', 'field-journal']:
                    ctx, q = h.setup(browser, width, dict(seeds['total'], garden=dict(seeds['total']['garden'], style=look)), f'help-{look}-{width}')
                    go(q, base, '#cafe', '[data-cafe-view]')
                    closed = help_controls(q)
                    h.click(q, '[data-cafe-action="help"]')
                    q.wait_for_function("!document.querySelector('[data-cafe-action=\"help\"]')")
                    opened = help_controls(q)
                    texts = [x['text'] for x in opened]
                    ok(all(t in texts for t in ['Count the next plate', 'Count again', 'Show the equal-groups explanation']), f'the support opened in {look}: ' + str(texts))
                    looks[look] = (closed, opened)
                    ctx.close()
                shape = lambda xs: [(x['text'], x['w'], x['h'], x['color'], x['bg']) for x in xs]
                ok('Count the plates together' in [x['text'] for x in looks['field-journal'][0]], 'the help trigger is compared')
                ok(shape(looks['field-journal'][0]) == shape(looks['storybook'][0]), 'help trigger and its neighbours match in both looks')
                ok(shape(looks['field-journal'][1]) == shape(looks['storybook'][1]), 'opened support matches in both looks: ' + str([x['text'] for x in looks['field-journal'][1]]))
                for look, (closed, opened) in looks.items():
                    ok(all(x['h'] >= 44 for x in closed + opened), f'help controls stay 44 px in {look}')
                    ok(overlaps(closed) is None and overlaps(opened) is None, f'help controls do not overlap in {look}')

                # 4. Serve a real order in Field Journal: the variant thanks and the still stamp.
                ready_ctx, q = h.setup(browser, width, dict(seeds['ready'], garden=dict(seeds['ready']['garden'], style='field-journal')), f'serve-{width}')
                go(q, base, '#cafe', '[data-cafe-view]')
                h.click(q, '[data-cafe-action="serve"]')
                q.locator('.cafe-response').wait_for()
                ok(h.book(q)['cafe']['current']['stage'] == 'served' and not h.book(q)['cafe']['current'].get('recovered'), 'served through the real control')
                ok(copy['fj'][guest['id']]['thanks'] in q.locator('.cafe-response').inner_text(), 'variant thank-you line')
                stamp = q.locator('.cafe-response .cafe-stamp')
                ok(stamp.count() == 1 and stamp.get_attribute('aria-hidden') == 'true' and stamp.inner_text().strip().lower() == 'served', 'stamp hidden from assistive technology')
                ok(q.evaluate("getComputedStyle(document.querySelector('.cafe-stamp')).animationName") == 'none', 'no stamp motion with reduced motion')
                ready_ctx.close()

                # 6. Export, then import as a separate explorer; an unknown look shows Storybook and exports unchanged.
                first = h.active(p)
                exported = h.download(p, base, f'field-journal-{width}')
                ok(exported['garden']['style'] == 'field-journal', 'export carries the look')
                def bring(data, name):
                    go(p, base, '#notes', '#progress-file')
                    p.locator('#progress-file').set_input_files({'name': name, 'mimeType': 'application/json', 'buffer': json.dumps(data).encode()})
                    p.locator('#progress-import-confirm').wait_for()
                    h.click(p, '#progress-import-confirm')
                    p.locator('#progress-import-status').wait_for()
                    ok('separate explorer' in p.locator('#progress-import-status').inner_text(), 'import is a separate explorer')
                # Reset first, as §8 item 6 asks: the cleared explorer shows Storybook.
                go(p, base, '#notes', '#reset')
                h.click(p, '#reset')
                p.locator('dialog[open] #confirm-reset').click()
                # A cleared explorer sees the welcome film again; skip it with its own control.
                p.locator('[data-film-skip]').first.wait_for()
                p.locator('[data-film-skip]').first.click()
                p.wait_for_function("!document.querySelector('dialog[open]')")
                go(p, base, '#cafe', '[data-cafe-view]')
                ok(root_style(p) is None and (h.book(p).get('garden') or {}).get('style') is None, 'reset clears the look')
                bring(exported, 'synthetic-fj.json')
                ok(h.active(p) != first, 'the imported explorer is active')
                go(p, base, '#cafe', '[data-cafe-view]')
                ok(root_style(p) == 'field-journal', 'the look returns with the import')
                # The cleared explorer no longer holds the look, so the switching checks follow the imported one.
                first = h.active(p)
                mystery = dict(exported)
                mystery['garden'] = dict(exported['garden'], style='mystery')
                bring(mystery, 'synthetic-mystery.json')
                other = h.active(p)
                go(p, base, '#cafe', '[data-cafe-view]')
                ok(root_style(p) is None, 'an unknown look shows Storybook')
                again = h.download(p, base, f'mystery-{width}')
                ok(again['garden']['style'] == 'mystery', 'an unknown look exports unchanged')

                # 5. Reload and switch explorers: the attribute follows the active explorer.
                switch_to(p, base, first)
                ok(root_style(p) == 'field-journal', 'back to the first explorer: Field Journal')
                p.reload(wait_until='domcontentloaded')
                go(p, base, '#home', '#main')
                go(p, base, '#cafe', '[data-cafe-view]')
                ok(root_style(p) == 'field-journal', 'reload keeps the look')
                switch_to(p, base, other)
                ok(root_style(p) is None and 'Our café goal' in p.locator('#main').text_content(), 'the other explorer shows Storybook')
                switch_to(p, base, first)
                ok(root_style(p) == 'field-journal', 'and back again')

                # 8. Before and after a run of switches, the record differs only in garden.style.
                before = h.raw_report(h.download(p, base, f'before-{width}'))
                for look in ['storybook', 'field-journal', 'storybook', 'field-journal']:
                    choose(p, base, look)
                after = h.raw_report(h.download(p, base, f'switches-{width}'))
                ok(after == before, 'nothing changes across a run of switches that ends where it began')
                choose(p, base, 'storybook')
                last = h.raw_report(h.download(p, base, f'storybook-{width}'))
                ok(last['garden'].pop('style') == 'storybook' and before['garden'].pop('style') == 'field-journal' and last == before, 'only garden.style differs')
                ok(root_style(p) is None, 'Storybook clears the root look')

                # 9. A notebook that exports at exactly the 5 MB import limit stays importable: the look is refused, natively.
                if width == 820:
                    limit = 5 * 1024 * 1024
                    big = json.loads(json.dumps(seeds['total']))
                    big['garden'] = dict(big.get('garden') or {}, future='')
                    probe_ctx, r = h.setup(browser, width, big, 'limit-probe')
                    h.download(r, base, 'limit-probe')
                    size = (OUT / 'limit-probe.json').stat().st_size
                    explorers = r.evaluate("localStorage.getItem('learning-garden-explorers')")
                    identity = h.active(r)
                    probe_ctx.close()
                    big['garden']['future'] = 'x' * (limit - size)
                    # Seed the explorer's own key directly: a second 5 MB legacy copy would not fit in browser storage.
                    limit_ctx = browser.new_context(viewport={'width': width, 'height': 1000}, has_touch=True, reduced_motion='reduce', accept_downloads=True)
                    limit_ctx.add_init_script('((e,i,s)=>{if(!localStorage.getItem("limit-fixture")){localStorage.setItem("learning-garden-explorers",e);localStorage.setItem("number-garden-v1:"+i,s);localStorage.setItem("limit-fixture","1");}})(' + json.dumps(explorers) + ',' + json.dumps(identity) + ',' + json.dumps(json.dumps(big)) + ')')
                    r = limit_ctx.new_page()
                    h.pages.append((r, 'limit-exact'))
                    r.on('pageerror', lambda e: h.errors.append({'case': 'limit-exact', 'error': str(e)}))
                    stored = h.raw_report(h.download(r, base, 'limit-exact'))
                    ok((OUT / 'limit-exact.json').stat().st_size == limit, 'the notebook exports at exactly the limit')
                    status = choose(r, base, 'field-journal')
                    ok(status.startswith('This look can’t be saved because the notes would be too large to import.'), 'refusal announced: ' + status)
                    ok(root_style(r) is None and 'style' not in (h.book(r).get('garden') or {}), 'the refused look writes nothing')
                    again = h.download(r, base, 'limit-after')
                    ok((OUT / 'limit-after.json').stat().st_size == limit and h.raw_report(again) == stored, 'the notes still export at the limit, unchanged')
                    limit_ctx.close()
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
            for server in servers:
                server.shutdown()
    print(f'{h.checks} Field Journal browser checks passed. Artifacts: {OUT}')


if __name__ == '__main__':
    main()
