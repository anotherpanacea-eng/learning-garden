"""Spec 108: native, synthetic, self-hosted Chrome atlas acceptance.

Only the catalog JSON is intercepted for network/data faults. Activity routes are
opened from the generated declarations in separate synthetic browser contexts.
Artifacts default to the system temporary directory; no household notebook is read.
"""
import sys
sys.dont_write_bytecode = True
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('GROWNUP_ATLAS_ARTIFACTS') or tempfile.mkdtemp(prefix='grownup-atlas-'))
OUT.mkdir(parents=True, exist_ok=True)
checks = 0
faults = []
pages = []
route_receipt = []
CATALOG = None
BASE = None


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def node_json(source):
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', source], cwd=ROOT, text=True))


def fixture():
    return node_json("import{freshState}from'./dist/core.mjs';import{initializeExplorerState}from'./dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={futureVersion:73,verbatim:'Synthetic unknown sibling stays exact',nested:[null,false,{'odd/key':'retained'}]};console.log(JSON.stringify(s));")


def setup(browser, seed, label, width=820, route='#atlas', intercept=None, chooser=False):
    c = browser.new_context(viewport={'width': width, 'height': 1050}, has_touch=True,
                            reduced_motion='reduce', accept_downloads=True)
    registry = {'version': 1, 'activeId': 'explorer-1', 'explorers': [
        {'id': 'explorer-1', 'avatar': seed['garden'].get('avatar', 'sky'), 'color': 'blue', 'symbol': 'leaf', 'createdAt': '2026-10-30T12:00:00.000Z'},
        {'id': 'explorer-2', 'avatar': seed['garden'].get('avatar', 'fern'), 'color': 'gold', 'symbol': 'acorn', 'createdAt': '2026-10-30T12:00:00.000Z'}]}
    c.add_init_script('(d=>{if(!localStorage.getItem("ga-synthetic-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const e of d.registry.explorers)localStorage.setItem("number-garden-v1:"+e.id,JSON.stringify(d.seed));localStorage.setItem("ga-synthetic-fixture","1");}})(' + json.dumps({'registry': registry, 'seed': seed}) + ')')
    requested = []
    c.on('request', lambda r: requested.append(r.url))
    if intercept:
        c.route('**/grownup-atlas.json', intercept)
    p = c.new_page()
    p.set_default_timeout(15000)
    p.on('pageerror', lambda e: faults.append({'case': label, 'kind': 'page', 'text': str(e)}))
    p.on('console', lambda m: faults.append({'case': label, 'kind': 'console', 'text': m.text, 'url': m.location.get('url', '')}) if m.type == 'error' else None)
    p.on('response', lambda r: faults.append({'case': label, 'kind': 'http', 'status': r.status, 'url': r.url}) if r.status >= 400 else None)
    p.on('requestfailed', lambda r: faults.append({'case': label, 'kind': 'request', 'text': r.failure, 'url': r.url}) if r.failure != 'net::ERR_ABORTED' else None)
    pages.append((p, label))
    p.goto(BASE + route, wait_until='domcontentloaded')
    p.locator('[data-select-explorer="explorer-1"],#explorer-header').first.wait_for()
    pick = p.locator('[data-select-explorer="explorer-1"]')
    if pick.count() and not chooser:
        pick.click()
    return c, p, requested


def close(c, p):
    if sys.exc_info()[0]:
        label = next((label for page, label in pages if page == p), 'failure')
        try:
            p.screenshot(path=str(OUT / (label + '-failure.png')), full_page=True)
            (OUT / (label + '-failure.html')).write_text(p.content())
        except Exception:
            pass
    c.close()


def hop(p, route, view=None):
    p.evaluate('(r)=>{location.hash=r}', route)
    if view:
        wait_view(p, view)


def wait_view(p, view):
    p.locator('[data-ga-root][data-ga-view="' + view + '"]').wait_for()


def action(p, name):
    p.locator('[data-ga-action="' + name + '"]').click()


def storage(p):
    return p.evaluate('()=>({local:{...localStorage},session:{...sessionStorage}})')


def book(p):
    return p.evaluate('()=>{const r=JSON.parse(localStorage.getItem("learning-garden-explorers"));return JSON.parse(localStorage.getItem("number-garden-v1:"+r.activeId));}')


def download(p, label):
    hop(p, '#notes')
    p.locator('#download').wait_for()
    with p.expect_download() as d:
        p.locator('#download').click()
    target = OUT / (label + '.json')
    d.value.save_as(str(target))
    out = json.loads(target.read_text())
    out.pop('exportedAt', None)
    return out


def rows(p):
    return p.locator('[data-ga-rows] [data-ga-topic]').evaluate_all('xs=>xs.map(x=>x.dataset.gaTopic)')


def expected(p, predicate, message):
    ids = {t['id'] for t in CATALOG['topics'] if predicate(t)}
    actual = rows(p)
    ok(bool(actual) and len(actual) <= 20 and all(x in ids for x in actual), message)
    # The live result count must report the independently selected total.
    count = p.locator('[data-ga-root] [aria-live]').all_text_contents()
    ok(any(str(len(ids)) in text.replace(',', '') and str(len(CATALOG['topics'])) in text.replace(',', '') for text in count), message + ': live matching/source totals')


def filters(p):
    return p.evaluate('()=>({q:document.querySelector("[data-ga-search]").value,subject:document.querySelector("[data-ga-subject]").value,domain:document.querySelector("[data-ga-domain]").value,linked:document.querySelector("[data-ga-linked]").checked,rows:[...document.querySelectorAll("[data-ga-rows] [data-ga-topic]")].map(x=>x.dataset.gaTopic)})')


def unfiltered(p):
    f = filters(p)
    ok(f['q'] == '' and not f['linked'] and f['subject'] in ('', 'all') and f['domain'] in ('', 'all') and len(f['rows']) == 20, 'new visit has empty query, All/All, unchecked links and first 20 rows')


def bounds(p, label):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), label + ': no horizontal overflow')
    bad = p.locator('[data-ga-root] a,[data-ga-root] button,[data-ga-root] select,[data-ga-root] input:not([type=checkbox]),[data-ga-root] label.ga-check,[data-ga-root] summary').evaluate_all('xs=>xs.filter(x=>x.checkVisibility()&&((x.getBoundingClientRect().height<43.9)||parseFloat(getComputedStyle(x).fontSize)<16)).map(x=>({tag:x.tagName,text:x.textContent.slice(0,90),height:x.getBoundingClientRect().height,size:getComputedStyle(x).fontSize}))')
    ok(not bad, label + ': visible controls/checkbox label have 44px targets and 16px text: ' + str(bad))
    readable_footer = p.locator('.ga-license').evaluate('f=>[...f.querySelectorAll("p")].every(p=>parseFloat(getComputedStyle(p).fontSize)>=16&&p.getBoundingClientRect().width>=f.clientWidth*.9)')
    ok(readable_footer, label + ': attribution paragraphs use readable 16px full-width lines')
    p.screenshot(path=str(OUT / (label + '.png')), full_page=True)


def topic(p, id):
    hop(p, '#atlas/' + id, 'topic')
    t = next(t for t in CATALOG['topics'] if t['id'] == id)
    ok(p.locator('#ga-heading').inner_text() == t['name'], 'exact pinned topic title ' + id)
    p.wait_for_function('document.activeElement?.id==="ga-heading"')
    return t


def neighbor_check(p, id):
    topic(p, id)
    # Open optional native folds so every direct link can be inspected and used.
    p.locator('[data-ga-root] details').evaluate_all('xs=>xs.forEach(x=>x.open=true)')
    expected_edges = [e for e in CATALOG['edges'] if e['topicId'] == id or e['prerequisiteId'] == id]
    actual = p.locator('[data-ga-neighbor]').evaluate_all('xs=>xs.map(x=>({id:x.dataset.gaNeighbor,href:x.getAttribute("href"),text:x.closest("li").textContent,section:x.closest("ul").previousElementSibling?.textContent||""}))')
    ok(len(actual) == len(expected_edges), 'every direct neighbor appears exactly once without transitive expansion')
    for e in expected_edges:
        target = e['prerequisiteId'] if e['topicId'] == id else e['topicId']
        direction = 'Builds on' if e['topicId'] == id else 'Used by'
        label = 'Source foundation link' if e['strength'] == 'hard' else 'Source helpful link'
        ok(any(a['id'] == target and a['href'] == '#atlas/' + target and label in a['text'] and direction in a['section'] for a in actual), direction + ': original directed ' + e['strength'] + ' edge')
    return actual


def journey(browser, seed):
    c, p, req = setup(browser, seed, 'tablet-journey', route='#notes')
    try:
        before = download(p, 'before-browse')
        disk = storage(p)
        ok(before['syntheticOther'] == seed['syntheticOther'], 'real Notes download includes synthetic unknown root')
        p.get_by_role('link', name='Browse the learning atlas', exact=True).click()
        wait_view(p, 'index')
        ok(sum(x.endswith('/grownup-atlas.json') for x in req) == 1, 'entry link loads the full catalog once')
        unfiltered(p)
        bounds(p, 'index-820')
        first = rows(p)
        ok(p.locator('[data-ga-action="previous"]').is_disabled(), 'first page has a real previous boundary')
        action(p, 'next')
        ok(rows(p) != first and len(rows(p)) == 20, 'next page contains a distinct bounded page')
        ok(p.locator('#ga-results-heading').evaluate('e=>e===document.activeElement'), 'pagination focuses results heading')
        for _ in range((len(CATALOG['topics']) - 1) // 20 - 1):
            action(p, 'next')
        ok(len(rows(p)) == len(CATALOG['topics']) % 20 and p.locator('[data-ga-action="next"]').is_disabled(), 'final page count and disabled next boundary')
        action(p, 'clear')
        ok(p.locator('[data-ga-search]').evaluate('e=>e===document.activeElement'), 'Clear focuses native search')
        search = p.locator('[data-ga-search]')
        action(p, 'next')
        search.fill('a')
        ok('Page 1 of' in p.locator('[data-ga-page]').inner_text(), 'editing search resets a later result page to page 1')
        search.fill('')
        search.focus()
        ok(search.get_attribute('maxlength') == '80', 'search has native 80-character limit')
        history = p.evaluate('history.length')
        p.evaluate('window.gaSearch=document.querySelector("[data-ga-search]")')
        search.press_sequentially('water')
        ok(p.evaluate('gaSearch===document.querySelector("[data-ga-search]")&&document.activeElement===gaSearch&&gaSearch.selectionStart===5&&gaSearch.selectionEnd===5'), 'typing preserves the exact native input node, focus and caret')
        expected(p, lambda t: 'water' in t['name'].lower() or 'water' in t['id'].lower(), 'case-insensitive name search')
        search.fill(' ' + CATALOG['topics'][0]['id'].upper() + ' ')
        expected(p, lambda t: t['id'] == CATALOG['topics'][0]['id'], 'trimmed case-insensitive ID query')
        search.fill('synthetic-no-source-topic-zzz')
        ok(not rows(p) and 'No topics match these filters.' in p.locator('[data-ga-root]').inner_text(), 'no-match state gives honest empty results')
        ok(p.evaluate('history.length') == history, 'filter edits add no browser history entries')
        action(p, 'clear')
        subjects = sorted({t['subject'] for t in CATALOG['topics']})
        domain_options = p.locator('[data-ga-domain] option').all_text_contents()
        domains = {t['subject'] + ' / ' + t['domain'] for t in CATALOG['topics']}
        ok(set(domain_options[1:]) == domains and len(domains) == 54, 'All subjects offers all 54 unique labeled domain pairs')
        for s in subjects:
            p.locator('[data-ga-subject]').focus()
            p.locator('[data-ga-subject]').select_option(label=s)
            ok(p.locator('[data-ga-subject]').evaluate('e=>e===document.activeElement'), 'native subject selection keeps focus')
            expected(p, lambda t, s=s: t['subject'] == s, 'subject ' + s)
        selected = p.locator('[data-ga-domain] option').nth(1)
        p.locator('[data-ga-domain]').focus()
        p.evaluate('window.gaDomain=document.querySelector("[data-ga-domain]")')
        p.locator('[data-ga-domain]').select_option(selected.get_attribute('value'))
        ok(p.evaluate('gaDomain===document.querySelector("[data-ga-domain]")&&document.activeElement===gaDomain'), 'dependent domain select retains its native node and focus')
        domain = p.locator('[data-ga-domain] option:checked').inner_text()
        expected(p, lambda t: t['subject'] == subjects[-1] and t['domain'] == domain, 'dependent domain combines with subject')
        p.locator('[data-ga-subject]').select_option(label=subjects[0])
        ok(p.locator('[data-ga-domain]').input_value() in ('', 'all'), 'changing subject resets domain to All')
        action(p, 'clear')
        linked = {r['topicId'] for r in CATALOG['references']}
        p.evaluate('window.gaLinked=document.querySelector("[data-ga-linked]")')
        p.locator('[data-ga-linked]').check()
        ok(p.evaluate('gaLinked===document.querySelector("[data-ga-linked]")&&document.activeElement===gaLinked'), 'link checkbox retains its native node and focus')
        expected(p, lambda t: t['id'] in linked, 'declared-link filter')
        p.locator('[data-ga-search]').fill('a')
        expected(p, lambda t: t['id'] in linked and ('a' in t['name'].lower() or 'a' in t['id'].lower()), 'search and linked combine with AND')
        snapshot = filters(p)
        origin = rows(p)[0]
        p.locator('[data-ga-topic="' + origin + '"]').click()
        wait_view(p, 'topic')
        p.wait_for_function('document.activeElement?.id==="ga-heading"')
        neighbor = p.locator('[data-ga-neighbor]').first
        if neighbor.count():
            neighbor.click()
            wait_view(p, 'topic')
            p.go_back()
            p.wait_for_function('(id)=>location.hash==="#atlas/"+id', arg=origin)
        action(p, 'back-results')
        wait_view(p, 'index')
        ok(filters(p) == snapshot, 'Back to results restores the same combined filter/page snapshot through neighbor browsing')
        ok(p.locator('[data-ga-topic="' + origin + '"]').evaluate('e=>e===document.activeElement'), 'Back to results focuses the originating row')
        # Reference kinds and scope are independently selected from generated data.
        labels = {'authored-task': 'Authored task', 'scoped-practice': 'Scoped practice', 'explanation': 'Supplied explanation'}
        for kind, label in labels.items():
            r = next(r for r in CATALOG['references'] if r['kind'] == kind)
            topic(p, r['topicId'])
            text = p.locator('[data-ga-root]').inner_text()
            ok(label in text and r['scope'] in text and r['gameName'] in text, kind + ' displays plain kind, exact scope and declared game name')
            ok(p.locator('[data-ga-activity][href="' + r['route'] + '"]').count() > 0, kind + ' offers the actual local destination')
        unlinked = next(t for t in CATALOG['topics'] if t['id'] not in linked)
        topic(p, unlinked['id'])
        ok('No activity link is declared for this topic.' in p.locator('[data-ga-root]').inner_text() and not p.locator('[data-ga-activity]').count(), 'unreferenced source topic has honest scope copy and no fabricated activity')
        by_id = {t['id']: t for t in CATALOG['topics']}
        rich = max(by_id, key=lambda id: sum(id in (e['topicId'], e['prerequisiteId']) for e in CATALOG['edges']))
        neighbors = neighbor_check(p, rich)
        ok(len(neighbors) > 10, 'long source-neighbor list actually exercised')
        bounds(p, 'topic-820')
        # Both strengths and both directions are checked against exact edge data.
        for strength in ('hard', 'soft'):
            e = next(e for e in CATALOG['edges'] if e['strength'] == strength)
            neighbor_check(p, e['topicId'])
            neighbor_check(p, e['prerequisiteId'])
        hop(p, '#atlas/mt_synthetic_absent', 'unknown')
        ok('That source topic is not in this pinned catalog' in p.locator('[data-ga-root]').inner_text(), 'absent ID stays unknown rather than substituting a topic')
        ok(storage(p) == disk, 'search, paging, detail, edge and unknown routes preserve exact local/session storage')
        after = download(p, 'after-browse')
        ok(after == before, 'actual normalized Notes export and every notebook root remain exact after browsing')
        ok(book(p)['syntheticOther'] == seed['syntheticOther'], 'unknown sibling survives every atlas browse')
        hop(p, '#atlas', 'index')
        unfiltered(p)
        ok(sum(x.endswith('/grownup-atlas.json') for x in req) == 1, 'leaving clears filters while successful curriculum cache remains valid')
    finally:
        close(c, p)


def normal_routes(browser, seed):
    c, p, req = setup(browser, seed, 'normal-routes', route='#home')
    try:
        for route, marker in [('#home', 'main h1'), ('#notes', '#download'), ('#map', '.map-focus'), ('#studio/rhythm', '[data-rhythm-root]'), ('#explore', '.explore-doorway')]:
            hop(p, route)
            p.locator(marker).first.wait_for()
        ok(not any(x.endswith('/grownup-atlas.json') for x in req), 'Home, Notes, original map, child activity and Explore never request full JSON')
        hop(p, '#map')
        p.locator('.map-focus').wait_for()
        m = json.loads((ROOT / 'dist/marble-map.json').read_text())
        ok(len(m['topics']) == 87 and len(m['dependencies']) == 92, 'original child map keeps its 87 topics/92 edges')
        p.get_by_role('link', name=re.compile('Browse all source topics and declared activity links')).click()
        wait_view(p, 'index')
    finally:
        close(c, p)


def fresh_entry(browser, seed):
    unseen = copy.deepcopy(seed)
    unseen['garden']['welcomeFilmSeen'] = False
    for route in ['#atlas', '#atlas/' + CATALOG['topics'][0]['id']]:
        c, p, _ = setup(browser, unseen, 'unseen-welcome', route=route, chooser=True)
        try:
            p.locator('[data-select-explorer="explorer-1"]').wait_for()
            ok(p.evaluate('location.hash') == route, 'initial chooser preserves requested atlas path')
            before = storage(p)
            p.locator('[data-select-explorer="explorer-1"]').click()
            wait_view(p, 'index' if route == '#atlas' else 'topic')
            p.wait_for_timeout(150)
            ok(not p.locator('dialog.welcome-film[open]').count(), 'first atlas entry never starts the child welcome film')
            ok(book(p) == unseen, 'first atlas entry preserves every initialized notebook root, including unseen welcome')
            after = storage(p)
            changed = {space: [k for k in set(before[space]) | set(after[space]) if before[space].get(k) != after[space].get(k)] for space in before}
            ok(after == before, 'atlas picker entry leaves local/session notebook storage exact: ' + str(changed))
            if route != '#atlas':
                ok(p.evaluate('location.hash') == route and p.locator('#ga-heading').inner_text() == CATALOG['topics'][0]['name'], 'picker opens the requested deep topic without losing its ID')
                p.locator('#explorer-switch').click()
                p.locator('[data-select-explorer="explorer-2"]').click()
                wait_view(p, 'topic')
                ok(p.evaluate('location.hash') == route, 'switch explorer preserves the requested deep atlas topic')
                p.locator('#explorer-switch').click()
                p.locator('#explorer-new').click()
                p.locator('[data-explorer-color=lavender]').click()
                p.locator('#explorer-create').click()
                wait_view(p, 'topic')
                ok(p.evaluate('location.hash') == route and not p.locator('dialog.welcome-film[open]').count(), 'creating an explorer preserves the deep topic and stays out of the child welcome film')
        finally:
            close(c, p)


def responsive_and_deep(browser, seed):
    longest = max(CATALOG['topics'], key=lambda t: len(t['name']))
    c, p, _ = setup(browser, seed, 'phone-deep', width=320, route='#atlas/' + longest['id'])
    try:
        wait_view(p, 'topic')
        ok(p.locator('#ga-heading').inner_text() == longest['name'], 'fresh direct deep link opens exact long source name')
        bounds(p, 'topic-320')
        action(p, 'back-results')
        wait_view(p, 'index')
        unfiltered(p)
        bounds(p, 'index-320')
    finally:
        close(c, p)


def network_faults(browser, seed):
    for label, mutate in [
        ('version', lambda d: d.update(version=999)),
        ('counts', lambda d: d['topics'].pop()),
        ('duplicate-topic', lambda d: d['topics'].__setitem__(0, d['topics'][1])),
        ('edge-endpoint', lambda d: d['edges'][0].update(prerequisiteId='mt_absent')),
        ('edge-strength', lambda d: d['edges'][0].update(strength='invented')),
        ('reference-topic', lambda d: d['references'][0].update(topicId='mt_absent')),
        ('reference-kind', lambda d: d['references'][0].update(kind='mastered')),
        ('foreign-url', lambda d: d['references'][0].update(route='https://example.invalid/#home')),
        ('malformed-json', None), ('http-error', None)]:
        corrupted = copy.deepcopy(CATALOG)
        if mutate:
            mutate(corrupted)
        requests = []
        def respond(route):
            requests.append(route.request.url)
            if len(requests) == 1:
                route.fulfill(status=503 if label == 'http-error' else 200, content_type='application/json', body='{' if label == 'malformed-json' else json.dumps(corrupted))
            else:
                route.fulfill(status=200, content_type='application/json', body=json.dumps(CATALOG))
        c, p, _ = setup(browser, seed, 'fault-' + label, intercept=respond)
        try:
            wait_view(p, 'error')
            ok('The full atlas could not load.' in p.locator('[data-ga-root]').inner_text() and not rows(p), label + ': honest full-atlas error without small-map substitution')
            before = storage(p)
            action(p, 'retry')
            wait_view(p, 'index')
            ok(len(requests) == 2 and storage(p) == before, label + ': explicit retry succeeds and preserves all saved state')
        finally:
            close(c, p)
    for path in ['#atlas/not-a-source-id', '#atlas/mt_a/extra', '#atlas/mt_a%2Fb', '#atlas/mt_a%252Fb', '#atlas/%ZZ']:
        c, p, req = setup(browser, seed, 'invalid-path', route=path)
        try:
            wait_view(p, 'unknown')
            ok(not any(x.endswith('/grownup-atlas.json') for x in req), 'invalid atlas path resolves without fetching: ' + path)
        finally:
            close(c, p)


def loading_races(browser, seed):
    for kind in ['slow-success', 'leave', 'chooser', 'new-explorer', 'same-explorer', 'import', 'reset']:
        pending = []
        c, p, req = setup(browser, seed, 'loading-' + kind, intercept=lambda route: pending.append(route))
        try:
            wait_view(p, 'loading')
            ok(len(pending) == 1, kind + ': real catalog response is held')
            ok(p.locator('[data-ga-root] a[href="#map"]').count() and p.locator('[data-ga-root] a[href="#notes"]').count(), kind + ': slow loading has usable exits')
            before = storage(p)
            if kind == 'slow-success':
                pending.pop(0).fulfill(status=200, content_type='application/json', body=json.dumps(CATALOG))
                wait_view(p, 'index')
                ok(storage(p) == before, 'slow catalog success creates no learner or storage field')
                continue
            if kind == 'leave':
                hop(p, '#notes')
                p.locator('#download').wait_for()
            elif kind in ('chooser', 'new-explorer', 'same-explorer'):
                p.locator('#explorer-switch').click()
                p.locator('[data-select-explorer="explorer-1"]').wait_for()
                if kind != 'chooser':
                    p.locator('[data-select-explorer="explorer-' + ('2' if kind == 'new-explorer' else '1') + '"]').click()
            else:
                hop(p, '#notes')
                p.locator('#download').wait_for()
                if kind == 'import':
                    p.locator('#progress-file').set_input_files({'name': 'synthetic-atlas-notes.json', 'mimeType': 'application/json', 'buffer': json.dumps(seed).encode()})
                    p.locator('#progress-import-confirm').click()
                    p.locator('#progress-import-status').filter(has_text='separate explorer').wait_for()
                else:
                    p.locator('#reset').click()
                    p.locator('#confirm-reset').click()
                    p.wait_for_function('location.hash==="#home"')
            # The callback must not replace whichever page/chooser now owns the screen.
            p.wait_for_timeout(60)
            fingerprint = p.locator('main').inner_html()
            pending.pop(0).fulfill(status=200, content_type='application/json', body=json.dumps(CATALOG))
            p.wait_for_timeout(120)
            ok(p.locator('main').inner_html() == fingerprint, kind + ': stale response cannot repaint the new owner/page')
            while pending:
                pending.pop(0).fulfill(status=200, content_type='application/json', body=json.dumps(CATALOG))
            if kind in ('new-explorer', 'same-explorer'):
                wait_view(p, 'index')
                unfiltered(p)
        finally:
            close(c, p)


def lifecycle(browser, seed):
    c, p, req = setup(browser, seed, 'lifecycle')
    try:
        wait_view(p, 'index')
        for boundary in ['same-explorer', 'new-explorer', 'import', 'saving-off', 'reset']:
            hop(p, '#atlas', 'index')
            p.locator('[data-ga-search]').fill('water')
            if boundary in ('same-explorer', 'new-explorer'):
                p.locator('#explorer-switch').click()
                p.locator('[data-select-explorer="explorer-' + ('2' if boundary == 'new-explorer' else '1') + '"]').click()
            else:
                hop(p, '#notes')
                p.locator('#download').wait_for()
                if boundary == 'import':
                    p.locator('#progress-file').set_input_files({'name': 'synthetic-atlas-import.json', 'mimeType': 'application/json', 'buffer': json.dumps(seed).encode()})
                    p.locator('#progress-import-confirm').click()
                    p.locator('#progress-import-status').filter(has_text='separate explorer').wait_for()
                elif boundary == 'saving-off':
                    p.locator('#remember').click()
                    p.get_by_role('button', name='Turn saving off', exact=True).click()
                else:
                    p.locator('#reset').click()
                    p.locator('#confirm-reset').click()
                    p.wait_for_function('location.hash==="#home"')
                    film = p.locator('dialog.welcome-film[open] [data-film-skip]')
                    if film.count():
                        film.click()
            hop(p, '#atlas', 'index')
            unfiltered(p)
            ok(sum(x.endswith('/grownup-atlas.json') for x in req) == 1, boundary + ': boundary clears filters without discarding public curriculum cache')
        before = download(p, 'saving-off-before')
        disk = storage(p)
        hop(p, '#atlas', 'index')
        p.locator('[data-ga-search]').fill('water')
        p.locator('[data-ga-topic]').first.click()
        wait_view(p, 'topic')
        after = download(p, 'saving-off-after')
        ok(before == after and storage(p) == disk, 'saving-off browsing preserves exact memory notebook/export and local/session storage')
    finally:
        close(c, p)


def activity_routes(browser, seed):
    declarations = node_json("import{areas}from'./dist/broad-content.mjs';import{learningPlaces}from'./dist/learning-invitations.mjs';import fs from'node:fs';console.log(JSON.stringify({areas,games:JSON.parse(fs.readFileSync('curriculum/atlas.json')).games,places:learningPlaces}));")
    # These are entry-shape assertions, not an alternate route list: all routes
    # to visit come exclusively from the generated JSON. Shared hubs have their
    # established controls; authored questions use their declaration title.
    names = {g['id']: g['name'] for g in declarations['games']}
    # Source UI modules provide distinctive activity roots. Only class/data
    # selectors actually present in the built route are accepted; an arbitrary
    # nonempty main or Home fallback cannot establish reachability.
    routes = sorted({r['route'] for r in CATALOG['references']})
    for index, route in enumerate(routes):
        c, p, req = setup(browser, seed, 'activity-' + str(index), route='#home')
        try:
            p.locator('[data-home-entry]').wait_for()
            hop(p, route)
            p.wait_for_function('!document.querySelector("main [data-home-entry]")')
            ok(p.evaluate('location.hash') == route, 'declared route retains exact hash ' + route)
            headings = p.locator('main h1,main h2').all_text_contents()
            if route.startswith('#checkin/'):
                area = next(a for a in declarations['areas'] if route == '#checkin/' + a['id'])
                ok(p.locator('.broad-activity #answer-form').count() == 1 and any(q['title'] in headings for q in area['checkin']), route + ': actual authored check-in entry')
            elif route.startswith('#adventure/'):
                q = next(q for a in declarations['areas'] for q in a['activities'] if route == '#adventure/' + q['id'])
                ok(p.locator('.broad-activity #answer-form').count() == 1 and q['title'] in headings, route + ': actual declared adventure question')
            else:
                refs = [r for r in CATALOG['references'] if r['route'] == route]
                sources = {r['source'] for r in refs}
                candidates = set()
                for path in sources:
                    ui = ROOT / path.replace('-content.mjs', '-ui.mjs').replace('-core.mjs', '-ui.mjs')
                    if not ui.is_file():
                        continue
                    text = ui.read_text()
                    # A module's bind root is a stronger entry marker than an
                    # incidental navigation link or matching game-name word.
                    candidates.update(re.findall(r'(?:querySelector|\$)\([\'\"](\.[a-z][a-z0-9-]*|\[data-[a-z0-9-]+(?:-root)?\])[\'\"]\)', text))
                matched = [s for s in sorted(candidates) if p.locator('main ' + s).count()]
                # Historical declaration names need not equal current headings.
                # The bind-root test covers such games; hubs have stable entry
                # controls and an independently checked adult-safe title.
                declared_words = set(re.findall(r'[a-z]{4,}', ' '.join(names[r['game']] for r in refs).lower())) - {'garden', 'table', 'learning', 'with', 'from', 'same', 'ways'}
                heading_words = set(re.findall(r'[a-z]{4,}', ' '.join(headings).lower()))
                ok(bool(matched) or bool(declared_words & heading_words), route + ': current activity bind root or declaration-specific heading; got ' + str(headings[:4]))
                ok(p.locator('main button,main input,main select,main a').count() > 0 and 'A place to begin' not in headings, route + ': actual usable entry with no Home fallback')
            ok(not any(x.endswith('/grownup-atlas.json') for x in req), route + ': declared child entry does not load adult catalog')
            route_receipt.append({'route': route, 'headings': headings[:6], 'status': 'opened current build'})
            if len(route_receipt) % 10 == 0:
                print(f'Atlas route audit: {len(route_receipt)}/{len(routes)} opened', flush=True)
        finally:
            close(c, p)
    ok(any(r.startswith('#checkin/') for r in routes) and any(r.startswith('#adventure/') for r in routes), 'route audit includes check-in and adventure declarations')


def main():
    global CATALOG, BASE
    CATALOG = json.loads((ROOT / 'dist/grownup-atlas.json').read_text())
    seed = fixture()
    class Quiet(http.server.SimpleHTTPRequestHandler):
        # Keep assets on reusable connections: isolated contexts otherwise
        # consume a new local socket per stylesheet/module on macOS.
        protocol_version = 'HTTP/1.1'

        def log_message(self, *args):
            pass
    class Server(http.server.ThreadingHTTPServer):
        request_queue_size = 128
        daemon_threads = True
    server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist')))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    BASE = f'http://127.0.0.1:{server.server_port}/'
    try:
        with sync_playwright() as pw:
            launch = {'headless': True, 'args': ['--disable-quic']}
            chrome = os.environ.get('CHROME_PATH')
            if chrome:
                launch['executable_path'] = chrome
            browser = pw.chromium.launch(**launch)
            try:
                for name, run in [('normal routes', normal_routes), ('complete tablet journey', journey), ('fresh unseen-welcome and picker entry', fresh_entry), ('phone/deep samples', responsive_and_deep), ('network and schema faults', network_faults), ('loading races', loading_races), ('explorer/import/save/reset lifecycle', lifecycle), ('all declared current-build routes', activity_routes)]:
                    print('Atlas browser: ' + name, flush=True)
                    run(browser, seed)
                unexpected = [f for f in faults if not (f['case'] == 'fault-http-error' and f.get('url', '').endswith('/grownup-atlas.json') and (f.get('status') == 503 or '503' in f.get('text', '')))]
                ok(not unexpected, 'no unexpected browser/network faults: ' + json.dumps(unexpected))
                (OUT / 'receipt.json').write_text(json.dumps({'status': 'passed', 'checks': checks, 'catalogBytes': (ROOT / 'dist/grownup-atlas.json').stat().st_size, 'distinctActivityRoutes': route_receipt, 'expectedFaults': faults, 'scope': 'Synthetic native Chromium; no physical iPad/Safari, audible speech, VoiceOver or learning-effect qualification.'}, indent=2))
                print(f'Grown-up atlas browser: {checks} checks passed; {len(route_receipt)} distinct declared routes; artifacts {OUT}', flush=True)
            except Exception:
                (OUT / 'failure.txt').write_text(traceback.format_exc())
                (OUT / 'faults.json').write_text(json.dumps(faults, indent=2))
                for p, label in pages:
                    if not p.is_closed():
                        try:
                            p.screenshot(path=str(OUT / (label + '-failure.png')), full_page=True)
                            (OUT / (label + '-failure.html')).write_text(p.content())
                        except Exception:
                            pass
                print('Atlas failure artifacts: ' + str(OUT), flush=True)
                raise
            finally:
                browser.close()
    finally:
        server.shutdown()


if __name__ == '__main__':
    main()
