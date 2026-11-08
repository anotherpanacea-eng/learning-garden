"""Spec 600 native Chrome journey for the guide errand strip.

Only invented notebooks; no app-module interception. Checks placement outside <main>,
survival across an activity re-render, route changes, act gating, links, no writes,
focus, target size and no overflow at 320 and 820. No Safari, physical-device,
screen-reader or learning qualification.
"""
import sys
sys.dont_write_bytecode = True
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('GUIDE_ERRANDS_ARTIFACTS', tempfile.mkdtemp(prefix='guide-errands-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('ge_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h


def node(js):
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', js], cwd=ROOT, text=True))


def seeds():
    # Fresh, Act II and Act IV notebooks built through each act's own start action (the same fixtures the pure checks use).
    return node("""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {canExport,pageOne} from './test/act-two-checks.mjs';
import {actFourHosts} from './test/act-four-checks.mjs';
import {startActTwo} from './dist/act-two-core.mjs';
import {startActFour} from './dist/act-four-core.mjs';
const o={canExport};
const fresh=initializeExplorerState(freshState());
const two=pageOne();startActTwo(two,o);
const four=actFourHosts();startActFour(four,o);
for(const s of [fresh,two,four]){s.garden={...(s.garden||{}),guide:'rowan',welcomeFilmSeen:true};}
console.log(JSON.stringify({fresh,two,four}));
""")


def content():
    return node("""
import {ERRAND_HUBS,ERRAND_ROOMS} from './dist/guide-errands-content.mjs';
console.log(JSON.stringify({rooms:ERRAND_ROOMS,hubs:ERRAND_HUBS}));
""")


def open_page(browser, base, notebook, width, label):
    _, p = native.setup(browser, notebook, label, width)
    return p


def seed_script(seed):
    return ('(seed=>{if(!localStorage.getItem("estimate-fixture")){' +
        'const p={id:"explorer-1",avatar:"sky",color:"gold",symbol:"leaf",createdAt:"2026-11-03T12:00:00.000Z"};' +
        'localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:p.id,explorers:[p]}));' +
        'localStorage.setItem("number-garden-v1:"+p.id,JSON.stringify(seed));' +
        'localStorage.setItem("estimate-fixture","1");}})(' + json.dumps(seed) + ')')


def settle(p):
    # Films are not under test here; close any automatic film dialog so it cannot cover the strip.
    p.wait_for_timeout(150)
    p.evaluate("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")


def strip(p):
    return p.locator('#guide-errands')


def journey(browser, base, books, data):
    room = '#cafe/groups' if '#cafe/groups' in data['rooms'] else next(iter(data['rooms']))
    for width in (320, 820):
        p = open_page(browser, base, books['fresh'], width, f'journey-{width}')
        p.goto(base + 'index.html' + room); p.wait_for_selector('main#main *')
        p.wait_for_function("document.querySelector('#guide-errands') && !document.querySelector('#guide-errands').hidden")
        h.ok(p.evaluate("document.querySelector('#guide-errands').nextElementSibling===document.querySelector('main#main')"), 'strip sits just before main')
        h.ok(p.evaluate("!document.querySelector('main#main').contains(document.querySelector('#guide-errands'))"), 'strip is outside main')
        summary = strip(p).locator('summary')
        h.ok('Rowan' in summary.inner_text(), 'summary names the chosen guide')
        h.ok(not p.evaluate("document.querySelector('#guide-errands details').open"), 'errands start closed')
        before = p.evaluate("localStorage.length ? JSON.stringify(Object.fromEntries(Object.entries(localStorage))) : ''")
        summary.click()
        cards = strip(p).locator('.ge-card')
        hear = strip(p).locator('[data-speak]')
        h.ok(hear.count() == 1 and 'Rowan' in (hear.get_attribute('data-speak') or ''), 'one Hear button reads the errands with the guide named')
        expected = [i for i in data['rooms'][room]['onward'] if i['minAct'] == 1]
        h.ok(cards.count() == len(expected), f'{room} shows {len(expected)} errands at Act I')
        for k, item in enumerate(expected):
            link = cards.nth(k).locator('a.ge-go')
            h.ok(link.get_attribute('href') == item['to'], f'card {k} links {item["to"]}')
            box = link.bounding_box(); h.ok(box and box['height'] >= 44, f'card {k} link is a 44px target')
        h.ok(p.evaluate("document.documentElement.scrollWidth<=window.innerWidth+1"), f'no horizontal overflow at {width}')
        # An activity re-render replaces main's content; the strip must survive untouched.
        p.evaluate("const m=document.querySelector('main#main');m.innerHTML=m.innerHTML")
        h.ok(strip(p).locator('.ge-card').count() == len(expected), 'strip survives a main re-render')
        after = p.evaluate("localStorage.length ? JSON.stringify(Object.fromEntries(Object.entries(localStorage))) : ''")
        h.ok(before == after, 'opening errands writes nothing')
        # Follow an errand; the strip refreshes for the new room.
        target = expected[0]['to']
        cards.nth(0).locator('a.ge-go').click()
        p.wait_for_function(f"location.hash==={json.dumps(target)}")
        p.wait_for_timeout(50)
        if target in data['rooms']:
            h.ok(not strip(p).is_hidden(), 'strip shows on the next authored room')
        else:
            h.ok(strip(p).is_hidden(), 'strip hides on a room without errands')
        # Home and Notes show nothing.
        for route in ('#home', '#notes'):
            p.evaluate(f"location.hash={json.dumps(route)}"); p.wait_for_timeout(80)
            h.ok(strip(p).is_hidden(), f'no strip on {route}')
        # Keyboard: the summary is reachable and opens with Enter.
        p.evaluate(f"location.hash={json.dumps(room)}"); p.wait_for_timeout(80)
        strip(p).locator('summary').focus(); p.keyboard.press('Enter')
        h.ok(p.evaluate("document.querySelector('#guide-errands details').open"), 'Enter opens the errands')
        p.close()


def speech_handoff(browser, base, books, data):
    # Hear in the strip, then a page with its own Hear button: that button must still speak.
    room = '#cafe/groups' if '#cafe/groups' in data['rooms'] else next(iter(data['rooms']))
    p = open_page(browser, base, books['fresh'], 820, 'speech')
    p.add_init_script("window.__spoken=0;try{const s=window.speechSynthesis;const o=s.speak.bind(s);s.speak=u=>{window.__spoken++;try{o(u);}catch{}};}catch{}")
    p.goto(base + 'index.html' + room); p.wait_for_selector('#guide-errands summary'); settle(p)
    strip(p).locator('summary').click(); strip(p).locator('[data-speak]').click(); p.wait_for_timeout(80)
    first = p.evaluate('window.__spoken')
    h.ok(first >= 1, 'the strip Hear button speaks')
    p.evaluate("location.hash='#loft'"); p.wait_for_selector('main#main [data-speak]'); p.wait_for_timeout(120); settle(p)
    h.ok(p.locator('main#main .speech-controls').count() <= 1 and p.locator('#guide-errands .speech-controls').count() == 0, 'voice controls are back in main, not lost with the strip')
    p.locator('main#main [data-speak]').first.click(); p.wait_for_timeout(80)
    h.ok(p.evaluate('window.__spoken') > first, 'the next page Hear button still speaks')
    p.close()


def chooser(browser, base, books, data):
    room = next(iter(data['rooms']))
    p = open_page(browser, base, books['fresh'], 820, 'chooser')
    p.goto(base + 'index.html' + room); p.wait_for_selector('#guide-errands summary'); settle(p)
    h.ok(not strip(p).is_hidden(), 'strip shows for the active explorer')
    p.locator('#explorer-switch').click(); p.wait_for_selector('[data-select-explorer]')
    p.wait_for_timeout(50)
    h.ok(strip(p).is_hidden(), 'the explorer chooser hides the strip without a hash change')
    p.locator('[data-select-explorer="explorer-1"]').click(); p.wait_for_timeout(150); settle(p)
    now = p.evaluate('location.hash')
    authored = now in data['rooms'] or now in data['hubs']
    h.ok(strip(p).is_hidden() != authored, f'after choosing an explorer the strip matches the route it lands on ({now})')
    # A same-route switch: return to the room, open the chooser again and pick the explorer while the hash stays put.
    p.evaluate(f"location.hash={json.dumps(room)}"); p.wait_for_timeout(120); settle(p)
    p.locator('#explorer-switch').click(); p.wait_for_selector('[data-select-explorer]')
    p.locator('[data-select-explorer="explorer-1"]').click(); p.wait_for_timeout(150); settle(p)
    now = p.evaluate('location.hash')
    h.ok(strip(p).is_hidden() != (now in data['rooms'] or now in data['hubs']), f'a second explorer choice also leaves the strip matching {now}')
    p.close()


def acts(browser, base, books, data):
    hub = '#cafe' if '#cafe' in data['hubs'] else next(iter(data['hubs']))
    for name, act in (('fresh', 1), ('two', 2), ('four', 4)):
        p = open_page(browser, base, books[name], 820, f'acts-{name}')
        p.goto(base + 'index.html' + hub); p.wait_for_selector('main#main *'); settle(p)
        strip(p).locator('summary').click()
        expected = [i for i in data['hubs'][hub] if i['minAct'] <= act][:3]
        hrefs = [strip(p).locator('.ge-card a.ge-go').nth(k).get_attribute('href') for k in range(strip(p).locator('.ge-card').count())]
        h.ok(hrefs == [i['to'] for i in expected], f'{hub} at Act {act} shows the errands that fit')
        p.close()


def reduced_motion(browser, base, books, data):
    room = next(iter(data['rooms']))
    names = 'Array.from(document.querySelectorAll("#guide-errands .ge-face, #guide-errands .ge-card")).map(e=>getComputedStyle(e).animationName)'
    for motion, want_still in (('reduce', True), ('no-preference', False)):
        ctx = browser.new_context(viewport={'width': 820, 'height': 900}, reduced_motion=motion)
        ctx.add_init_script(seed_script(books['fresh']))
        p = ctx.new_page()
        p.goto(base + 'index.html' + room); p.wait_for_selector('#guide-errands summary')
        p.locator('#guide-errands summary').click(); p.wait_for_timeout(50)
        got = p.evaluate(names)
        if want_still:
            h.ok(got and all(n == 'none' for n in got), 'reduced motion shows the strip still')
        else:
            h.ok(got and all(n != 'none' for n in got), 'the strip arrives with its pin-up animation')
        ctx.close()


def main():
    books = seeds(); data = content()

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args): pass

    class Server(http.server.ThreadingHTTPServer):
        request_queue_size = 128
        daemon_threads = True

    server = Server(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT/'dist')))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = os.environ.get('GUIDE_ERRANDS_TEST_URL', f'http://127.0.0.1:{server.server_port}/').rstrip('/') + '/'
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True, executable_path=os.environ.get('CHROME_PATH', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'), args=['--disable-quic'])
        try:
            suites = {'journey': journey, 'speech': speech_handoff, 'chooser': chooser, 'acts': acts, 'reduced': reduced_motion}
            for name, run in suites.items():
                if os.environ.get('GUIDE_ERRANDS_CASE', name) == name:
                    print('Running ' + name, flush=True); run(b, base, books, data)
            h.ok(not h.errors, 'no page errors ' + str(h.errors)); h.ok(not h.console_errors, 'no console errors ' + str(h.console_errors))
            receipt = {'status': 'passed', 'checks': h.checks, 'base': base, 'limits': 'Native Chrome only; no physical iPad/Safari, audible speech, screen-reader or learning qualification.'}
            (OUT/'receipt.json').write_text(json.dumps(receipt, indent=2)); print(json.dumps(receipt))
        except Exception:
            for p, label in h.pages:
                if not p.is_closed():
                    try: p.screenshot(path=str(OUT/f'failure-{label}.png'), full_page=True)
                    except Exception: pass
            raise
        finally:
            b.close(); server.shutdown()


if __name__ == '__main__':
    main()
