"""Pollen Path413 in the actual app, with synthetic notebooks only.

One tablet journey, focused phone samples, and bounded lifecycle probes.
The observer is a pure getter of the actual app notebook. Deliberate external
mutations are labelled separately; no activity is mounted in a stand-in host.
"""
import sys
sys.dont_write_bytecode = True
import copy, functools, http.server, importlib.util, json, os, subprocess
import tempfile, threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('POLLEN_PATH_ARTIFACTS') or tempfile.mkdtemp(prefix='lg413-native-'))
OUT.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location('pollen_kitchen_helpers', ROOT/'test/leaf-kitchen-browser.py')
k = importlib.util.module_from_spec(spec)
spec.loader.exec_module(k)
h = k.h
h.OUT = OUT
contexts, pages = [], []
R = '[data-pollen-path-root]'
ENTRY = 'Follow a pollen path'
LESSONS = ['Three flower places.', 'Carry it to a stigma.', 'A visit is not one touch.', 'What comes later?']
TRAILS = ['Between flowers', 'Travel back', 'An empty visitor', 'One flower', 'Two origins', 'A nectar stop']
SPEECH = '''window.pollenSpoken=[];window.pollenCancelled=0;
window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
getVoices:()=>[{name:'Invented local English',voiceURI:'invented-en',lang:'en-US',localService:true,default:true}],
addEventListener(){},removeEventListener(){},cancel(){window.pollenCancelled++;},
speak(u){window.pollenSpoken.push(u.text);u.onstart?.();}}});'''


def setup(browser, base, seed, label, width=820):
    # Wrap the existing native setup solely to install a local speech recorder
    # before the app binds its real shared speech controls.
    class RecordedBrowser:
        def new_context(self, **options):
            ctx = browser.new_context(**options)
            ctx.add_init_script(SPEECH)
            return ctx
    ctx, p = k.native.setup(RecordedBrowser(), base, seed, width=width, observe=True)
    contexts.append(ctx)
    pages.append((p, label))
    layers(p)
    return p


def layers(p):
    p.evaluate('location.hash="#living/layers"')
    p.locator('[data-ll-root]').wait_for()


def selector(action, value=None):
    return '[data-pollen-path-action="'+action+'"]'+('' if value is None else '[data-pollen-path-value="'+str(value)+'"]')


def act(p, action, value=None, before=None):
    control = p.locator(('select' if action in ['invitation', 'lesson'] else '')+selector(action, None if action in ['invitation', 'lesson'] else value))
    if action in ['invitation', 'lesson']:
        control.select_option(str(value))
    else:
        control.tap()
    if before is not None:
        k.unchanged(p, before, action+' '+str(value))


def enter(p, before=None):
    p.get_by_role('button', name=ENTRY, exact=True).tap()
    p.locator(R).wait_for()
    h.ok(not p.locator('[data-ll-root]').count(), 'Pollen replaces parent view')
    h.ok(p.locator('#pollen-path-title').evaluate('e=>e===document.activeElement'), 'entry focuses child title')
    if before is not None:
        k.unchanged(p, before, 'Pollen entry')


def marks(p, body, a, b):
    for sel, caption in [('[data-pollen-path-body]', 'Pollen origins on the visitor: '+body),
                         ('[data-pollen-path-stigma="A"]', "Origins shown on A's stigma: "+a),
                         ('[data-pollen-path-stigma="B"]', "Origins shown on B's stigma: "+b)]:
        h.ok(p.locator(sel).inner_text().strip() == caption, 'independent expected origin caption '+caption)


def status(p):
    return p.locator('[data-pollen-path-status]').inner_text().strip()


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad = p.locator(R+' button,'+R+' select,'+R+' a,'+R+' summary,main:has('+R+') .speech-controls summary').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().width<43.9||e.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))''')
    h.ok(not bad, '44px targets and16px control text: '+str(bad))
    h.ok(p.locator(R+' svg').evaluate_all('''xs=>xs.every(e=>{const b=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();return b.width>0&&b.height>0&&b.left>=p.left-1&&b.right<=p.right+1})'''), 'original SVGs contained in visible figure bounds')
    h.ok(not p.locator(R+' animate,'+R+' animateTransform').count(), 'figures require no autonomous SVG animation')
    voice = p.locator('.speech-controls:visible')
    if voice.count():
        layout = voice.evaluate('''e=>{const s=getComputedStyle(e),b=e.getBoundingClientRect(),root=document.querySelector('[data-pollen-path-root]');const figs=[...root.querySelectorAll('svg')].map(n=>n.getBoundingClientRect());return {position:s.position,transform:s.transform,width:b.width,left:b.left,right:b.right,overlap:figs.some(f=>Math.min(f.right,b.right)>Math.max(f.left,b.left)&&Math.min(f.bottom,b.bottom)>Math.max(f.top,b.top))}}''')
        h.ok(layout['position'] == 'static' and layout['transform'] == 'none' and layout['width'] > 0 and layout['left'] >= 0 and layout['right'] <= p.viewport_size['width']+1 and not layout['overlap'], 'real voice panel remains in flow and clear of figures: '+str(layout))


def hear(p, before, includes=(), excludes=()):
    n = p.evaluate('pollenSpoken.length')
    p.locator('[data-pollen-path-hear]').tap()
    spoken = p.evaluate('pollenSpoken')
    h.ok(len(spoken) == n+1, 'shared Hear requests exactly one actual utterance')
    text = spoken[-1]
    h.ok(all(s in text for s in includes) and not any(s in text for s in excludes), 'utterance follows only current visible content')
    for part in includes:
        h.ok(text.count(part) == 1, 'current narration phrase occurs once: '+part)
    k.unchanged(p, before, 'shared Hear')
    bounds(p)
    return text


def normalized_report(report):
    return {key:value for key,value in report.items() if key != 'exportedAt'}


def fixture():
    data = k.fixture()
    data['layerGuides'][9]['source']['title'] = 'Earlier invented flower guide'
    data['layerGuides'].append({'id':'layer-guide-11', 'source':{'v':99,'title':'Invented unavailable source'}, 'work':{'v':99,'raw':'Invented unavailable work'}})
    return data


def journey(browser, base, seed):
    p = setup(browser, base, seed, 'tablet')
    original_notes = normalized_report(h.export_notes(p, 'notes-before-room'))
    layers(p)
    k.click(p, '[data-ll-camera="h-organ"]')
    k.click(p, '[data-ll-turn="1"]')
    for value in ['h-person', 'h-cell', 'h-organ']:
        k.click(p, '[data-ll-add="'+value+'"]')
    k.click(p, '[data-ll-strip-card="h-cell"]')
    p.locator('[data-ll-direction]').select_option('whole-to-part')
    for name in ['order', 'chooser']:
        p.locator('[data-ll-fold="'+name+'"]').evaluate('e=>e.open=true')
    p.wait_for_timeout(30)
    frame, before = k.parent_frame(p), k.snapshot(p)
    old_parent, old_add = k.retain(p, '[data-ll-root]'), k.retain(p, '[data-ll-add="h-tissue"]')
    enter(p, before)
    marks(p, 'none', 'none', 'none')
    bounds(p)
    p.screenshot(path=str(OUT/'tablet-empty.png'), full_page=True)
    old_parent.evaluate('e=>{e.hidden=true;document.querySelector("main").append(e)}')
    k.dispatch(old_add)
    old_parent.evaluate('e=>e.remove()')
    k.unchanged(p, before, 'retired parent cannot alter waiting guide')
    act(p, 'contact', 'a-stigma', before)
    h.ok(status(p) == "No pollen came with this visitor. Flower A's stigma still shows no origins.", 'empty visitor at empty stigma is explicit')
    act(p, 'contact', 'a-anthers', before)
    act(p, 'contact', 'b-stigma', before)
    marks(p, 'A', 'none', 'A')
    transfer = "The visitor brings pollen from A to flower B's stigma. Origins on flower B's stigma: A. The visitor keeps its origin marks."
    h.ok(status(p) == transfer, 'first deposit keeps body origin')
    act(p, 'contact', 'b-stigma', before)
    h.ok(status(p) == transfer, 'repeated origin still describes transfer')
    act(p, 'clean', before=before)
    marks(p, 'none', 'none', 'A')
    act(p, 'contact', 'b-stigma', before)
    h.ok(status(p) == "No pollen came with this visitor. Marks already on flower B's stigma keep their place.", 'old stigma marks are distinguished from empty visitor')
    act(p, 'contact', 'b-anthers', before)
    act(p, 'contact', 'a-stigma', before)
    act(p, 'contact', 'a-anthers', before)
    marks(p, 'A and B', 'B', 'A')
    for code in ['a-nectar', 'b-nectar']:
        act(p, 'contact', code, before)
        marks(p, 'A and B', 'B', 'A')
    act(p, 'contact', 'b-stigma', before)
    marks(p, 'A and B', 'B', 'A and B')
    h.ok(p.locator(R+' ol li').all_text_contents() == ['Clean paper visitor', 'B · stigma', 'B · anthers', 'A · stigma', 'A · anthers', 'A · nectar', 'B · nectar', 'B · stigma'], 'history lists exactly last eight actions without erasing retained marks')
    for i, title in enumerate(TRAILS):
        act(p, 'invitation', i, before)
        h.ok(p.locator(selector('invitation')).input_value() == str(i), 'current optional trail '+title)
        marks(p, 'A and B', 'B', 'A and B')
    hear(p, before, includes=[status(p), 'Pollen origins on the visitor: A and B'], excludes=LESSONS)
    p.screenshot(path=str(OUT/'tablet-populated.png'), full_page=True)
    # A valid same-value selection cancels pending confirmation without a reset.
    act(p, 'fresh-request', before=before)
    hear(p, before, includes=["Clear this model's marks and recent actions? Your Living Layers guide will stay."])
    act(p, 'invitation', 5, before)
    h.ok(not p.locator(selector('fresh-confirm')).count(), 'same-value trail cancels pending confirmation')
    marks(p, 'A and B', 'B', 'A and B')
    act(p, 'fresh-request', before=before)
    act(p, 'fresh-cancel', before=before)
    marks(p, 'A and B', 'B', 'A and B')
    act(p, 'page', 'learn', before)
    for i, title in enumerate(LESSONS):
        act(p, 'lesson', i, before)
        text = p.locator(R+' article').inner_text()
        h.ok(title in text and all(other not in text for other in LESSONS if other != title), 'one worked teaching card visible')
        h.ok(p.locator('[data-pollen-path-figure="'+str(i)+'"]').count() == 1, 'current worked figure present')
        hear(p, before, includes=[title, 'Worked picture · not your model'], excludes=['Pollen origins on the visitor:', *[other for other in LESSONS if other != title]])
        bounds(p)
        p.screenshot(path=str(OUT/('tablet-card-'+str(i+1)+'.png')), full_page=True)
    h.ok(p.get_by_role('button', name='Next', exact=True).is_disabled(), 'last teaching boundary disabled')
    act(p, 'lesson', 0, before)
    h.ok(p.get_by_role('button', name='Previous', exact=True).is_disabled(), 'first teaching boundary disabled')
    p.get_by_role('button', name='Next', exact=True).tap()
    p.get_by_role('button', name='Previous', exact=True).tap()
    act(p, 'page', 'garden', before)
    marks(p, 'A and B', 'B', 'A and B')
    act(p, 'fresh-request', before=before)
    act(p, 'back', before=before)
    h.ok(k.parent_frame(p) == frame, 'exact waiting draft order/camera/turn/direction/folds restored')
    h.ok(p.get_by_role('button', name=ENTRY, exact=True).evaluate('e=>e===document.activeElement'), 'Back focuses matching parent entry')
    enter(p, before)
    h.ok(not p.locator(selector('fresh-confirm')).count(), 'Back cancels fresh confirmation')
    marks(p, 'A and B', 'B', 'A and B')
    act(p, 'fresh-request', before=before)
    act(p, 'fresh-confirm', before=before)
    marks(p, 'none', 'none', 'none')
    h.ok(status(p) == 'Choose a flower part to begin.' and 'No model actions yet.' in p.locator(R).inner_text(), 'confirmed fresh clears model and history')
    act(p, 'back', before=before)
    # Both independently local children retain their work in the same room.
    k.open_kitchen(p, before)
    k.place(p, 'water', 'gas', before)
    k.action(p, k.C['back'], before)
    enter(p, before)
    act(p, 'contact', 'a-anthers', before)
    act(p, 'back', before=before)
    k.open_kitchen(p, before)
    h.ok(k.placements(p)['water'] == 'gas', 'Pollen visits preserve Leaf Kitchen model')
    k.action(p, k.C['back'], before)
    k.click(p, '[data-ll-shelf]')
    for control in [None, '[data-ll-card="layer-guide-10"]']:
        if control:
            k.click(p, control)
        frame = k.parent_frame(p)
        enter(p, before)
        marks(p, 'A', 'none', 'none')
        act(p, 'back', before=before)
        h.ok(k.parent_frame(p) == frame, 'shelf/readable own-source/unavailable parent returns exactly')
        if control:
            k.click(p, '[data-ll-shelf]')
    final_notes = normalized_report(h.export_notes(p, 'notes-after-room'))
    h.ok(final_notes == original_notes, 'actual Notes exports bracket whole room visit exactly, except export timestamp')


def guard_probe(browser, base, seed, mode):
    p = setup(browser, base, seed, 'guard-'+mode)
    before = k.snapshot(p)
    enter(p, before)
    action = k.retain(p, selector('contact', 'a-anthers'))
    hear_control = k.retain(p, '[data-pollen-path-hear]')
    hear_control.evaluate('e=>e.dataset.speak="Invented stale speech sentinel"')
    n = p.evaluate('pollenSpoken.length')
    if mode == 'removed-reinserted':
        for node in [action, hear_control]:
            node.evaluate('e=>{const p=e.parentNode;e.remove();p.append(e)}')
    elif mode == 'reparented':
        for node in [action, hear_control]:
            node.evaluate('e=>document.querySelector("main").append(e)')
    elif mode == 'hidden-unhidden':
        p.locator(R).evaluate('e=>{e.hidden=true;e.hidden=false}')
    elif mode == 'control-hidden-unhidden':
        for node in [action, hear_control]:
            node.evaluate('e=>{e.style.display="none";e.style.display=""}')
    elif mode == 'root-removed-reinserted':
        p.locator(R).evaluate('e=>{const p=e.parentNode;e.remove();p.append(e)}')
    p.wait_for_timeout(30)
    k.dispatch(action)
    k.dispatch(hear_control)
    h.ok(p.evaluate('pollenSpoken.length') == n, mode+' guard precedes shared speech')
    h.ok(hear_control.get_attribute('data-speak') == 'Invented stale speech sentinel', mode+' guard precedes narration recomputation')
    marks(p, 'none', 'none', 'none')
    k.unchanged(p, before, mode+' controls')


def changed_parent(browser, base, seed):
    p = setup(browser, base, seed, 'changed-parent')
    k.click(p, '[data-ll-shelf]')
    k.click(p, '[data-ll-card="layer-guide-10"]')
    before = k.snapshot(p)
    enter(p, before)
    act(p, 'contact', 'b-anthers', before)
    act(p, 'fresh-request', before=before)
    old_back = k.retain(p, selector('back'))
    old_hear = k.retain(p, '[data-pollen-path-hear]')
    # Deliberate synthetic external stimulus: replace the actual notebook's
    # raw saved source/work while the explanatory child is open. The observer
    # itself remains a pure getter; ordinary journeys never use this seam.
    p.evaluate('''()=>{const r=window.__curveObservedState().layerGuides[9];r.source={v:99,title:'Invented replaced source'};r.work={v:99,raw:'Invented replaced work'};}''')
    changed = k.snapshot(p)
    h.ok(changed['memory'] != before['memory'] and changed['persisted'] == before['persisted'], 'synthetic external replacement is explicitly unsaved')
    n = p.evaluate('pollenSpoken.length')
    k.dispatch(old_hear)
    h.ok(p.evaluate('pollenSpoken.length') == n, 'raw source/work invalidation blocks speech before shared handler')
    p.locator('[data-ll-root]').wait_for()
    k.unchanged(p, changed, 'invalidated parent recovery')
    enter(p, changed)
    marks(p, 'B', 'none', 'none')
    h.ok(not p.locator(selector('fresh-confirm')).count(), 'invalidated parent cancels pending reset')
    k.dispatch(old_back)
    h.ok(p.locator(R).count() == 1, 'old Back cannot close later explicit entry')
    act(p, 'back', before=changed)
    h.ok('unavailable' in p.locator('#ll-title').inner_text(), 'replacement recovers current unavailable parent')


def lifecycle(browser, base, seed):
    p = setup(browser, base, seed, 'lifecycle')
    enter(p)
    act(p, 'contact', 'a-anthers')
    old = k.retain(p, selector('contact', 'b-anthers'))
    k.click(p, '#explorer-switch')
    k.click(p, '[data-select-explorer="explorer-2"]')
    p.locator('[data-ll-root]').wait_for()
    now = k.snapshot(p)
    k.dispatch(old)
    k.unchanged(p, now, 'old actual-owner action')
    enter(p, now)
    marks(p, 'none', 'none', 'none')
    old = k.retain(p, '[data-pollen-path-hear]')
    report = h.export_notes(p, 'lifecycle-import')
    p.locator('#progress-file').set_input_files({'name':'invented-pollen.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
    k.click(p, '#progress-import-confirm')
    p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
    layers(p)
    now = k.snapshot(p)
    n = p.evaluate('pollenSpoken.length')
    k.dispatch(old)
    h.ok(p.evaluate('pollenSpoken.length') == n, 'old actual-book Hear cannot speak after import')
    k.unchanged(p, now, 'import retired child')
    enter(p, now)
    marks(p, 'none', 'none', 'none')
    act(p, 'contact', 'a-anthers', now)
    old = k.retain(p, selector('contact', 'b-anthers'))
    p.evaluate('location.hash="#notes"')
    k.click(p, '#reset')
    k.click(p, '#confirm-reset')
    p.locator('[data-film-skip]').wait_for()
    k.click(p, '[data-film-skip]')
    layers(p)
    now = k.snapshot(p)
    k.dispatch(old)
    k.unchanged(p, now, 'reset retired action')
    enter(p, now)
    marks(p, 'none', 'none', 'none')
    act(p, 'contact', 'a-anthers', now)
    p.evaluate('location.hash="#living/plants"')
    p.locator(R).wait_for(state='detached')
    layers(p)
    enter(p)
    marks(p, 'none', 'none', 'none')
    act(p, 'contact', 'b-anthers')
    p.reload(wait_until='networkidle')
    choice = p.locator('[data-select-explorer]')
    if choice.count():
        choice.first.click()
    p.locator('[data-ll-root]').wait_for()
    enter(p)
    marks(p, 'none', 'none', 'none')


def phone(browser, base, seed):
    p = setup(browser, base, seed, 'phone', width=320)
    before = k.snapshot(p)
    enter(p, before)
    bounds(p)
    p.screenshot(path=str(OUT/'phone-empty.png'), full_page=True)
    act(p, 'contact', 'b-anthers', before)
    act(p, 'contact', 'a-stigma', before)
    marks(p, 'B', 'B', 'none')
    hear(p, before, includes=[status(p)])
    p.screenshot(path=str(OUT/'phone-populated.png'), full_page=True)
    act(p, 'page', 'learn', before)
    for i in range(4):
        act(p, 'lesson', i, before)
        hear(p, before, includes=[LESSONS[i]])
        bounds(p)
        p.screenshot(path=str(OUT/('phone-card-'+str(i+1)+'.png')), full_page=True)


def main():
    server = None
    base = os.environ.get('POLLEN_PATH_TEST_URL')
    try:
        if not base:
            class Quiet(http.server.SimpleHTTPRequestHandler):
                def log_message(self, *args):
                    pass
            class Server(http.server.ThreadingHTTPServer):
                daemon_threads = True
                request_queue_size = 128
            server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT/'dist')))
            threading.Thread(target=server.serve_forever, daemon=True).start()
            base = 'http://127.0.0.1:'+str(server.server_port)+'/'
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path=os.environ.get('CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'), args=['--disable-quic'])
            try:
                seed = fixture()
                journey(browser, base, seed)
                for mode in ['removed-reinserted', 'reparented', 'hidden-unhidden', 'control-hidden-unhidden', 'root-removed-reinserted']:
                    guard_probe(browser, base, seed, mode)
                changed_parent(browser, base, seed)
                lifecycle(browser, base, seed)
                phone(browser, base, seed)
                h.ok(not h.errors, 'no page/console/HTTP errors: '+str(h.errors))
                receipt = {'status':'passed', 'checks':h.checks, 'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(), 'tree':subprocess.check_output(['git','rev-parse','HEAD^{tree}'],cwd=ROOT,text=True).strip(), 'workingDiff':subprocess.check_output(['git','diff','--stat'],cwd=ROOT,text=True), 'errors':h.errors, 'scope':'Actual app; pure getter observes memory, persisted notebook and all same-day storage; actual Notes bracket whole room visit. Separately labelled synthetic raw source/work replacement. Stub records actual shared utterance requests; no audible/physical-device/learning claim. Existing Leaf Kitchen regression covers midnight bookkeeping.'}
                (OUT/'receipt.json').write_text(json.dumps(receipt, indent=2))
                print('Pollen Path browser:', h.checks, 'checks passed; artifacts', OUT)
            except Exception:
                (OUT/'failure.txt').write_text(traceback.format_exc())
                for p, label in pages:
                    if not p.is_closed():
                        try:
                            p.screenshot(path=str(OUT/(label+'-failure.png')), full_page=True)
                            (OUT/(label+'-failure.html')).write_text(p.content())
                        except Exception:
                            pass
                raise
            finally:
                for ctx in contexts:
                    ctx.close()
                browser.close()
    finally:
        if server:
            server.shutdown()
            server.server_close()


if __name__ == '__main__':
    main()
