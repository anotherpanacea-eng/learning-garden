"""Leaf Kitchen408 native app: local explanations beside a waiting guide.

Invented notebooks only. The temporary app observer is read-only and exposes
the actual in-memory notebook, because persisted-only equality cannot detect
an accidental unsaved mutation. One tablet journey and a narrow phone sample.
"""
import sys
sys.dont_write_bytecode = True
import copy, functools, http.server, importlib.util, json, os, subprocess
import threading, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('LEAF_KITCHEN_ARTIFACTS', '/private/tmp/lg408-native'))
OUT.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location('kitchen_native', ROOT/'test/curve-window-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h
h.OUT = OUT
PACKET = json.loads((ROOT/'docs/content/408-leaf-kitchen-text.md').read_text().split('```json\n', 1)[1].split('```', 1)[0])
C = PACKET['copy']
PAGES = {'build': C['build'], 'compare': C['compare'], 'learn': C['learn'], 'questions': C['questions']}
EXPECTED_ROLES = {'carbon-dioxide': 'materials', 'water': 'materials', 'light': 'energy',
                  'minerals': 'nutrients', 'glucose': 'food', 'oxygen': 'gas'}
FITTING = [1, 2, 3, 2]
contexts, pages = [], []


def fixture():
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', '''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {layerSource} from './dist/living-layers-content.mjs';
import {newLayerWork} from './dist/living-layers-core.mjs';
const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;
s.syntheticSibling={raw:'Invented sibling, retained exactly'};
s.layerGuides=Array.from({length:10},(_,i)=>({id:'layer-guide-'+(i+1),source:layerSource('leaf'),work:newLayerWork(layerSource('leaf'))}));
console.log(JSON.stringify(s));
'''], cwd=ROOT, text=True))


def setup(browser, base, seed, label, width=820):
    # Reuse the existing actual-app setup and its read-only state getter.
    ctx, p = native.setup(browser, base, seed, width=width, observe=True)
    contexts.append(ctx)
    pages.append((p, label))
    p.evaluate('location.hash="#living/layers"')
    p.locator('[data-ll-root]').wait_for()
    return ctx, p


def snapshot(p):
    return p.evaluate('''()=>({memory:JSON.parse(JSON.stringify(window.__curveObservedState())),
      persisted:(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return r?JSON.parse(localStorage.getItem('number-garden-v1:'+r.activeId)):null;})(),
      storage:Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))})''')


def unchanged(p, before, why):
    now = snapshot(p)
    h.ok(now['memory'] == before['memory'], why+' leaves actual in-memory notebook exact')
    h.ok(now['persisted'] == before['persisted'], why+' leaves persisted notebook exact')
    h.ok(now['storage'] == before['storage'], why+' leaves all same-day storage exact')


def click(p, selector, before=None):
    p.locator(selector).first.click()
    if before is not None:
        unchanged(p, before, selector)


def button(p, label):
    return p.get_by_role('button', name=label, exact=True)


def action(p, label, before=None):
    button(p, label).click()
    if before is not None:
        unchanged(p, before, label)


def open_kitchen(p, before=None):
    button(p, C['entry']).click()
    p.locator('[data-lk-root]').wait_for()
    h.ok(not p.locator('[data-ll-root]').count(), 'child replaces the entire parent view')
    h.ok(p.locator('#lk-title').evaluate('e=>e===document.activeElement'), 'Open focuses child title')
    if before is not None:
        unchanged(p, before, 'Open')


def page(p, name, before=None):
    action(p, PAGES[name], before)


def card(p, identity):
    return p.locator('[data-lk-action="select"][data-lk-value="'+identity+'"]')


def place(p, identity, role, before=None, keyboard=False):
    control = card(p, identity)
    if keyboard:
        control.focus()
        p.keyboard.press('Enter')
    else:
        control.tap()
    if before is not None:
        unchanged(p, before, 'Select '+identity)
    h.ok(card(p, identity).evaluate('e=>e===document.activeElement'), 'selection focuses its current card')
    click(p, '[data-lk-action="place"][data-lk-value="'+role+'"]', before)
    h.ok(p.locator('[data-lk-action="place"][data-lk-value="'+role+'"]').evaluate('e=>e===document.activeElement'), 'placement focuses its acting role')


def dispatch(handle):
    handle.evaluate('e=>e.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}))')


def retain(p, selector, detach=False):
    handle = p.locator(selector).first.element_handle()
    if detach:
        handle.evaluate('e=>e.remove()')
    return handle


def placements(p):
    return p.locator('[data-lk-action="select"]').evaluate_all('xs=>Object.fromEntries(xs.map(e=>[e.dataset.lkValue,e.closest("[data-lk-role]")?.dataset.lkRole||null]))')


def parent_frame(p):
    return p.locator('[data-ll-root]').evaluate('''e=>({html:e.innerHTML,
      folds:[...e.querySelectorAll('details')].map(d=>[d.dataset.llFold,d.open]),
      selected:e.querySelector('[data-ll-current]')?.dataset.llCurrent||null,
      turn:e.querySelector('[data-ll-turn][aria-current="step"]')?.dataset.llTurn||null})''')


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal page overflow')
    bad = p.locator('[data-lk-root] button,[data-lk-root] a,[data-lk-root] summary').evaluate_all('''xs=>xs.filter(e=>e.checkVisibility()&&(e.getBoundingClientRect().width<43.9||e.getBoundingClientRect().height<43.9||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent.trim(),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,font:getComputedStyle(e).fontSize}))''')
    h.ok(not bad, '44px targets and16px controls: '+str(bad))
    h.ok(p.locator('[data-lk-root] svg').evaluate_all('xs=>xs.every(e=>e.getBoundingClientRect().height<=300.1)'), 'pictures remain at most300px tall')


def hear(p, before, includes=(), excludes=()):
    action(p, C['hear'], before)
    spoken = button(p, C['hear']).get_attribute('data-speak') or ''
    h.ok(C['parentLeaveWarning'] in spoken and C['visitNote'] in spoken, 'current Hear includes visit and parent loss warnings')
    h.ok(all(t in spoken for t in includes) and not any(t in spoken for t in excludes), 'Hear follows current activity page')
    h.ok(p.locator('.speech-controls').is_visible(), 'real speech controls appear')


def hidden_reference(p, before):
    forbidden = [C[k] for k in ['reference', 'wordEquation', 'wordEquationNote', 'materialArrow', 'energyArrow', 'foodArrow', 'gasArrow', 'mineralsArrow', 'diagramCaption']]
    html = p.locator('[data-lk-root]').inner_html()
    h.ok(not any(t in html for t in forbidden), 'unrequested reference strings absent from markup and labels')
    hear(p, before, excludes=forbidden)


def journey(browser, base, seed):
    _, p = setup(browser, base, seed, 'tablet')
    click(p, '[data-ll-turn="1"]')
    for n in ['h-person', 'h-cell', 'h-organ']:
        click(p, '[data-ll-add="'+n+'"]')
    click(p, '[data-ll-strip-card="h-cell"]')
    p.locator('[data-ll-direction]').select_option('whole-to-part')
    p.locator('[data-ll-fold="order"]').evaluate('e=>e.open=true')
    p.locator('[data-ll-fold="chooser"]').evaluate('e=>e.open=true')
    # Let native toggle events settle before capturing the return frame.
    p.wait_for_timeout(50)
    frame, before = parent_frame(p), snapshot(p)
    old_parent = retain(p, '[data-ll-root]')
    old_add = retain(p, '[data-ll-add="h-tissue"]')
    open_kitchen(p, before)
    bounds(p)
    h.ok(p.locator('[data-lk-action="place"]:disabled').count() == 5 and button(p, C['remove']).is_disabled(), 'empty board disables placement and removal')
    hidden_reference(p, before)
    # A detached parent reinserted hidden must not change the waiting guide.
    old_parent.evaluate('e=>{e.hidden=true;document.querySelector("main").append(e)}')
    dispatch(old_add)
    old_parent.evaluate('e=>e.remove()')
    unchanged(p, before, 'hidden reattached parent controls')
    place(p, 'glucose', 'materials', before)
    place(p, 'light', 'food', before, keyboard=True)
    place(p, 'water', 'materials', before)
    h.ok(placements(p) == {'carbon-dioxide':None, 'water':'materials', 'light':'food', 'minerals':None, 'glucose':'materials', 'oxygen':None}, 'arbitrary material and energy misconceptions remain literal and uncorrected')
    h.ok(not p.locator('[data-lk-path]').count(), 'Arrange has no anatomical science paths')
    h.ok(p.locator('[data-lk-root] svg').evaluate_all('xs=>xs.every(e=>!e.querySelector("[data-lk-card],[data-lk-path],text"))'), 'Arrange SVG does not attach cards or scientific labels to origin paths')
    p.screenshot(path=str(OUT/'tablet-build.png'), full_page=True)
    page(p, 'compare', before)
    hidden_reference(p, before)
    action(p, C['showReference'], before)
    h.ok(button(p, C['showReference']).is_disabled(), 'shown reference control disabled')
    reference = p.locator('[data-lk-reference]')
    h.ok(C['wordEquation'] in reference.inner_text(), 'explicit reference gives overall word equation')
    for identity, role in EXPECTED_ROLES.items():
        label = next(x['label'] for x in PACKET['cards'] if x['id'] == identity)
        h.ok(label in reference.locator('[data-lk-role="'+role+'"]').inner_text(), identity+' has its independent expected reference role')
    hear(p, before, includes=[C['wordEquation']])
    p.screenshot(path=str(OUT/'tablet-reference.png'), full_page=True)
    action(p, C['edit'], before)
    place(p, 'glucose', 'food', before)
    action(p, C['remove'], before)
    h.ok(button(p, C['remove']).is_disabled(), 'removed selected card cannot be removed twice')
    place(p, 'oxygen', 'nutrients', before)
    h.ok(placements(p)['glucose'] is None and placements(p)['oxygen'] == 'nutrients', 'literal revision and return-to-tray preserve unexpected oxygen role')
    page(p, 'compare', before)
    h.ok(p.locator('[data-lk-reference]').count() == 1, 'reference remains requested after literal edits')
    page(p, 'learn', before)
    for i, teaching in enumerate(PACKET['teaching']):
        text = p.locator('[data-lk-root]').inner_text()
        h.ok(teaching['title'] in text and teaching['text'] in text and teaching['caption'] in text, 'one current teaching picture '+str(i+1))
        h.ok(sum(t['title'] in text for t in PACKET['teaching']) == 1, 'other teaching pictures absent')
        if i == 4:
            h.ok(not p.locator('[data-lk-path="light"],[data-lk-path="oxygen"]').count(), 'night omits daytime energy and oxygen paths')
            h.ok(C['energyArrow'] not in text and C['gasArrow'] not in text and C['diagramCaption'] not in text, 'night has only its own caption and no daytime path labels')
        else:
            h.ok(p.locator('[data-lk-path]').count() > 0, 'teaching picture has qualitative source paths')
        hear(p, before, includes=[teaching['title'], teaching['caption']], excludes=[t['title'] for t in PACKET['teaching'] if t != teaching])
        if i == 0:
            h.ok(button(p, C['previousStep']).is_disabled(), 'first picture boundary disabled')
        if i < 4:
            action(p, C['nextStep'], before)
    h.ok(button(p, C['nextStep']).is_disabled(), 'last picture boundary disabled')
    bounds(p)
    p.screenshot(path=str(OUT/'tablet-learn.png'), full_page=True)
    page(p, 'questions', before)
    for i, invitation in enumerate(PACKET['invitations']):
        h.ok(invitation['prompt'] in p.locator('[data-lk-root]').inner_text(), 'current question '+str(i+1))
        stale = retain(p, '[data-lk-action="answer"][data-lk-value="choice-1"]')
        wrong = 2 if FITTING[i] == 1 else 1
        click(p, '[data-lk-action="answer"][data-lk-value="choice-'+str(wrong)+'"]', before)
        h.ok(C['different'] in p.locator('#lk-feedback').inner_text(), 'plausible contrast gets supported feedback')
        other_wrong = next(n for n in [1, 2, 3] if n not in [wrong, FITTING[i]])
        click(p, '[data-lk-action="answer"][data-lk-value="choice-'+str(other_wrong)+'"]', before)
        h.ok(invitation['choices'][other_wrong-1]['feedback'] in p.locator('#lk-feedback').inner_text(), 'different enabled answer replaces feedback, including measurement caution')
        action(p, C['tryAgain'], before)
        h.ok(not p.locator('#lk-feedback').count(), 'try again clears current feedback')
        click(p, '[data-lk-action="answer"][data-lk-value="choice-'+str(FITTING[i])+'"]', before)
        h.ok(C['fits'] in p.locator('#lk-feedback').inner_text(), 'independently known fitting answer position '+str(FITTING[i]))
        hear(p, before, includes=[invitation['prompt'], invitation['choices'][FITTING[i]-1]['feedback']])
        action(p, C['nextQuestion'], before)
        dispatch(stale)
        h.ok(not p.locator('#lk-feedback').count(), 'old reused choice id cannot answer next question')
        unchanged(p, before, 'stale question button')
    action(p, C['back'], before)
    h.ok(parent_frame(p) == frame, 'Back restores exact unsaved unexpected parent frame including folds, direction, turn and current card')
    h.ok(button(p, C['entry']).evaluate('e=>e===document.activeElement'), 'Back focuses parent entry')
    # Parent display/edit changes do not erase this independent model visit.
    click(p, '[data-ll-turn="0"]')
    click(p, '[data-ll-camera="h-organ"]')
    click(p, '[data-ll-turn="1"]')
    click(p, '[data-ll-add="h-tissue"]')
    fresh_frame = parent_frame(p)
    open_kitchen(p, before)
    page(p, 'build', before)
    h.ok(card(p, 'oxygen').get_attribute('aria-pressed') == 'true', 'Back/reopen after parent edits preserves child selection')
    page(p, 'compare', before)
    h.ok(p.locator('[data-lk-reference]').count() == 1, 'Back/reopen preserves child reference')
    action(p, C['back'], before)
    h.ok(parent_frame(p) == fresh_frame, 'new Open captures new parent return frame')
    click(p, '[data-ll-shelf]')
    shelf_frame = parent_frame(p)
    open_kitchen(p, before)
    action(p, C['back'], before)
    h.ok(parent_frame(p) == shelf_frame, 'shelf page survives child visit')
    click(p, '[data-ll-card="layer-guide-10"]')
    kept_frame = parent_frame(p)
    open_kitchen(p, before)
    action(p, C['back'], before)
    h.ok(parent_frame(p) == kept_frame, 'kept-guide frame survives child visit')
    open_kitchen(p, before)
    page(p, 'build', before)
    action(p, C['newArrangement'], before)
    h.ok(p.locator('[data-lk-action="place"]:disabled').count() == 5, 'new arrangement resets selection')
    page(p, 'compare', before)
    hidden_reference(p, before)
    return p


def local_conditions(browser, base, seed):
    for mode in ['opaque', 'huge-notes', 'saving-off', 'storage-failure']:
        data = copy.deepcopy(seed)
        if mode == 'opaque':
            data['layerGuides'] = {'v': 99, 'raw': 'Invented opaque collection'}
        if mode == 'huge-notes':
            data['syntheticSibling']['payload'] = ''
            data['syntheticSibling']['payload'] = 'z'*(5*1024*1024-len(json.dumps(data, indent=2).encode())-512)
        _, p = setup(browser, base, data, mode)
        if mode == 'huge-notes':
            old = snapshot(p)
            click(p, '[data-ll-keep]')
            unchanged(p, old, 'real oversized Notes Keep refusal')
            h.ok('has not been kept' in p.locator('#ll-status').inner_text(), 'real Notes capacity refusal leaves local exploration open')
        if mode == 'saving-off':
            p.evaluate('location.hash="#notes"')
            click(p, '#remember')
            click(p, 'dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]')
            p.evaluate('location.hash="#living/layers"')
            p.locator('[data-ll-root]').wait_for()
        if mode == 'storage-failure':
            p.evaluate('''()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Invented storage fault','QuotaExceededError');return original.call(this,k,v)}}''')
        before = snapshot(p)
        open_kitchen(p, before)
        place(p, 'minerals', 'energy', before)
        page(p, 'compare', before)
        action(p, C['showReference'], before)
        page(p, 'learn', before)
        action(p, C['nextStep'], before)
        page(p, 'questions', before)
        click(p, '[data-lk-action="answer"][data-lk-value="choice-1"]', before)
        hear(p, before, includes=[PACKET['invitations'][0]['prompt']])
        action(p, C['back'], before)
        if mode == 'opaque':
            click(p, '[data-ll-shelf]')
            open_kitchen(p, before)
            action(p, C['back'], before)
        unchanged(p, before, mode+' whole exploration')


def exits(browser, base, seed):
    for destination in ['#living/plants', '#living/bodies']:
        _, p = setup(browser, base, seed, 'exit-'+destination.rsplit('/', 1)[-1])
        click(p, '[data-ll-turn="1"]')
        click(p, '[data-ll-add="h-person"]')
        before = snapshot(p)
        open_kitchen(p, before)
        for name in PAGES:
            if name != 'build':
                page(p, name, before)
            leave = p.get_by_text(C['leaveTitle'], exact=True).locator('xpath=ancestor::details[1]')
            leave.locator(':scope>summary').click()
            unchanged(p, before, 'open warned exits on '+name)
            h.ok(C['leaveWarning'] in leave.inner_text(), 'warning names loss of unkept parent and child before either exit')
            h.ok(leave.locator('a[href="'+destination+'"]').is_visible(), 'explicit destination belongs to warning disclosure')
            hear(p, before, excludes=[C['leaveWarning'], C['grownup']])
        stale = retain(p, '[data-lk-action="answer"][data-lk-value="choice-1"]')
        # Equality deliberately ends at this explicit room-navigation click.
        p.locator('[data-lk-root] a[href="'+destination+'"]').click()
        p.wait_for_function('(target)=>location.hash===target', arg=destination)
        p.locator('[data-lk-root]').wait_for(state='detached')
        after = snapshot(p)
        dispatch(stale)
        unchanged(p, after, 'departed child controls')
        p.evaluate('location.hash="#living/layers"')
        p.locator('[data-ll-root]').wait_for()
        click(p, '[data-ll-turn="1"]')
        h.ok('No cards placed' in p.locator('[data-ll-order]').text_content(), 'warned exit clears unsaved parent guide')
        open_kitchen(p)
        h.ok(p.locator('[data-lk-action="place"]:disabled').count() == 5, 'room exit starts fresh local model')


def lifecycle(browser, base, seed):
    _, p = setup(browser, base, seed, 'lifecycle')
    before = snapshot(p)
    # Parent controls removed and reinserted cannot start a child.
    old_entry = retain(p, '[data-lk-entry]', detach=True)
    old_entry.evaluate('e=>document.querySelector("[data-ll-root] header").append(e)')
    p.wait_for_timeout(20)
    dispatch(old_entry)
    h.ok(not p.locator('[data-lk-root]').count(), 'detached and reattached parent entry retires')
    unchanged(p, before, 'reattached parent entry')
    p.reload(wait_until='networkidle')
    p.locator('[data-select-explorer="explorer-1"],[data-ll-root]').first.wait_for()
    if p.locator('[data-select-explorer="explorer-1"]').count():
        click(p, '[data-select-explorer="explorer-1"]')
    p.locator('[data-ll-root]').wait_for()
    before = snapshot(p)
    open_kitchen(p, before)
    place(p, 'light', 'gas', before)
    stale = retain(p, '[data-lk-action="select"][data-lk-value="water"]')
    p.locator('[data-lk-root]').evaluate('e=>e.hidden=true')
    dispatch(stale)
    p.locator('[data-lk-root]').evaluate('e=>e.hidden=false')
    h.ok(card(p, 'water').get_attribute('aria-pressed') != 'true', 'hidden child controls cannot mutate current work')
    unchanged(p, before, 'hidden child action')
    stale_hear = retain(p, '[data-lk-hear]')
    stale_hear.evaluate('e=>e.dataset.speak="Invented stale speech sentinel"')
    root = retain(p, '[data-lk-root]', detach=True)
    root.evaluate('e=>document.querySelector("main").append(e)')
    p.wait_for_timeout(20)
    dispatch(stale)
    dispatch(stale_hear)
    h.ok(stale_hear.get_attribute('data-speak') == 'Invented stale speech sentinel', 'retired Hear cannot recompute or start current narration')
    h.ok(card(p, 'water').get_attribute('aria-pressed') != 'true', 'child root detachment permanently retires old controls')
    unchanged(p, before, 'reattached child root')
    p.evaluate('location.hash="#living"')
    p.locator('[data-lk-root]').wait_for(state='detached')
    dispatch(stale)
    p.evaluate('location.hash="#living/layers"')
    p.locator('[data-ll-root]').wait_for()
    open_kitchen(p)
    h.ok(p.locator('[data-lk-action="place"]:disabled').count() == 5, 'route away and return resets model')
    stale = retain(p, '[data-lk-action="select"][data-lk-value="water"]')
    click(p, '#explorer-switch')
    click(p, '[data-select-explorer="explorer-2"]')
    p.locator('[data-ll-root]').wait_for()
    second = snapshot(p)
    dispatch(stale)
    unchanged(p, second, 'old-owner control')
    open_kitchen(p, second)
    h.ok(p.locator('[data-lk-action="place"]:disabled').count() == 5, 'new owner starts own empty model')
    # Actual Notes import creates a new owner/book and retires captured child.
    stale = retain(p, '[data-lk-action="select"][data-lk-value="water"]')
    report = h.export_notes(p, 'lifecycle-notes')
    p.locator('#progress-file').set_input_files({'name':'invented-kitchen.json', 'mimeType':'application/json', 'buffer':json.dumps(report).encode()})
    click(p, '#progress-import-confirm')
    p.locator('#progress-import-status').filter(has_text='Notebook brought').wait_for()
    p.evaluate('location.hash="#living/layers"')
    p.locator('[data-ll-root]').wait_for()
    imported = snapshot(p)
    dispatch(stale)
    unchanged(p, imported, 'old-book imported control')
    open_kitchen(p, imported)
    h.ok(p.locator('[data-lk-action="place"]:disabled').count() == 5, 'import resets local model')
    stale = retain(p, '[data-lk-action="select"][data-lk-value="water"]')
    p.evaluate('location.hash="#notes"')
    click(p, '#reset')
    click(p, '#confirm-reset')
    p.wait_for_function('location.hash==="#home"')
    p.locator('[data-film-skip]').wait_for()
    click(p, '[data-film-skip]')
    p.locator('dialog.welcome-film').wait_for(state='detached')
    p.evaluate('location.hash="#living/layers"')
    p.locator('[data-ll-root]').wait_for()
    reset = snapshot(p)
    dispatch(stale)
    unchanged(p, reset, 'reset-era child control')
    open_kitchen(p, reset)
    h.ok(p.locator('[data-lk-action="place"]:disabled').count() == 5, 'reset starts empty local model')


def changed_parent(browser, base, seed):
    _, p = setup(browser, base, seed, 'external-parent-change')
    click(p, '[data-ll-shelf]')
    click(p, '[data-ll-card="layer-guide-10"]')
    old_parent = retain(p, '[data-ll-root]')
    old_copy = retain(p, '[data-ll-copy]')
    before = snapshot(p)
    open_kitchen(p, before)
    place(p, 'water', 'gas', before)
    stale_back = retain(p, '[data-lk-action="back"]')
    # ONE deliberate synthetic external stimulus: change the actual in-memory
    # saved guide while its explanatory child is active. The observer function
    # remains a pure getter. Ordinary journeys never mutate through this seam.
    p.evaluate('''()=>{const raw=window.__curveObservedState().layerGuides[9];raw.source={...raw.source,title:'Invented externally replaced source'};raw.work={v:99,raw:'Invented externally unavailable work'};}''')
    changed = snapshot(p)
    h.ok(changed['memory'] != before['memory'] and changed['persisted'] == before['persisted'], 'external stimulus is explicitly unsaved and distinguishable from persistence')
    dispatch(stale_back)
    p.locator('[data-ll-root]').wait_for()
    h.ok(not p.locator('[data-lk-root]').count() and 'unavailable' in p.locator('#ll-title').inner_text(), 'changed raw source/work retires child instead of resuming obsolete frame')
    old_parent.evaluate('e=>{e.hidden=true;document.querySelector("main").append(e)}')
    dispatch(old_copy)
    old_parent.evaluate('e=>e.remove()')
    unchanged(p, changed, 'retired child and parent after explicit external stimulus')
    open_kitchen(p, changed)
    h.ok(placements(p)['water'] == 'gas', 'explicit reopen keeps independent model work after parent invalidation')
    dispatch(stale_back)
    h.ok(p.locator('[data-lk-root]').count() == 1, 'retired Back cannot close a later explicit child')
    unchanged(p, changed, 'stale Back after reopen')
    action(p, C['back'], changed)
    h.ok('unavailable' in p.locator('#ll-title').inner_text(), 'unavailable guide frame has working entry and Back')


def midnight(browser, base, seed):
    _, p = setup(browser, base, seed, 'midnight')
    before = snapshot(p)
    open_kitchen(p, before)
    # Advance the browser clock beyond its current local day, then trigger the
    # existing app render through an ordinary child page action.
    p.clock.set_fixed_time(p.evaluate('Date.now()+26*60*60*1000'))
    page(p, 'learn')
    after = snapshot(p)
    h.ok(after['memory'] == before['memory'] and after['persisted'] == before['persisted'], 'midnight render never changes either notebook')
    changed = {k for k in before['storage'].keys() | after['storage'].keys() if before['storage'].get(k) != after['storage'].get(k)}
    h.ok(changed <= {'learning-garden-rooms-v1:explorer-1'}, 'midnight storage exception is only existing room bookkeeping: '+str(changed))
    h.ok(changed == {'learning-garden-rooms-v1:explorer-1'}, 'midnight probe exercises actual room bookkeeping')


def phone(browser, base, seed):
    _, p = setup(browser, base, seed, 'phone', width=320)
    before = snapshot(p)
    open_kitchen(p, before)
    place(p, 'light', 'energy', before)
    bounds(p)
    page(p, 'compare', before)
    action(p, C['showReference'], before)
    bounds(p)
    page(p, 'learn', before)
    bounds(p)
    p.screenshot(path=str(OUT/'phone.png'), full_page=True)


def main():
    server = None
    base = os.environ.get('LEAF_KITCHEN_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *args):
                pass
        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        base = 'http://127.0.0.1:'+str(server.server_port)+'/'
    base = base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=os.environ.get('CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'), args=['--disable-quic'])
        try:
            seed = fixture()
            journey(browser, base, seed)
            local_conditions(browser, base, seed)
            exits(browser, base, seed)
            lifecycle(browser, base, seed)
            changed_parent(browser, base, seed)
            midnight(browser, base, seed)
            phone(browser, base, seed)
            h.ok(not h.errors, 'no browser errors: '+str(h.errors))
            receipt = {'status':'passed', 'checks':h.checks, 'base':base, 'errors':h.errors,
                       'scope':'Actual app; pure getter observes in-memory notebook plus persisted notebook and complete storage equality. Ordinary journeys read-only; one separately labeled synthetic external source/work replacement probes invalidation. One tablet journey and320px sample.'}
            (OUT/'receipt.json').write_text(json.dumps(receipt, indent=2))
            print('Leaf Kitchen browser:', h.checks, 'assertions passed; artifacts', OUT)
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
            if server:
                server.shutdown()


if __name__ == '__main__':
    main()
