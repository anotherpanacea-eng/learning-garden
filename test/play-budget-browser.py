"""Play budget check for a one-screen toy prototype (fleet card LG-79).

    python3 test/play-budget-browser.py                    # self-check on the two fixtures
    python3 test/play-budget-browser.py path/to/walk.json  # check one page

The six budget lines:
  1. Something moves under a finger within 5 s of opening.
  2. At most 12 words on screen before the first touch.
  3. No select elements on the screen.
  4. Every action makes a sound.
  5. A wrong move shows a consequence within 1 s.
  6. A round ends within 2 min.

The checker cannot guess how to play a page, so each page gets a walk: a small
JSON file naming the first thing to drag, one wrong move and one whole round.

    {"page": "test/fixtures/play-budget/toy.html",
     "first": {"drag": "#berry-1", "to": "#plate"},
     "wrong": {"steps": [{"tap": "#bell"}], "shows": "#guest.puzzled"},
     "round": {"steps": [{"drag": "#berry-2", "to": "#plate"}, {"tap": "#bell"}],
               "ends": "#thanks"}}

"page" is a path from the repository root (a "#route" may follow it). A step is
{"tap": selector} or {"drag": selector, "to": selector}, with CSS selectors.
"first" must be a drag. Steps run in the order first, wrong, round, with touch
input in headless Chrome at 1024 by 768.

A line the walk gives no steps for is reported NOT CHECKED. The run passes only
when all six lines pass.

Uses Python Playwright with CHROME_PATH, installed Chrome on macOS, or
Playwright's Chromium, like the other browser suites.
"""
import sys
sys.dont_write_bytecode = True
import functools
import http.server
import json
import math
import os
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / 'test/fixtures/play-budget'
MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

LINES = ['Something moves under a finger within 5 s',
         'At most 12 words before first touch',
         'No select elements on the screen',
         'Every action makes a sound',
         'A wrong move shows a consequence within 1 s',
         'A round ends within 2 min']

LIMITS = """What this run cannot tell you:
  - First touch: the script drags the first thing as soon as it is on screen,
    and again until it follows the finger or 5 s have passed. A pass means the
    page can be moved inside 5 s, not that a child finds what to touch.
  - Words: it counts visible text after the page has sat untouched for 5 s.
    Words in a picture, a canvas, a form field or CSS-generated content are
    missed.
  - Selects: it fails on a select element that is showing on the untouched
    page or after any step of the walk. A hidden select is reported but does
    not fail; one that only a step outside the walk would reveal is missed.
    Other dropdown-like controls are not detected.
  - Sound: it sees the page ask the browser to start a sound (Web Audio, an
    audio or video element, or speech) no later than 1 s after the finger
    lifts. The 1 s is this script's choice; the budget line names no time. It
    cannot hear whether the sound is audible or any good, or whether an iPad
    would stay silent because the sound was set up before the first touch. A
    page that starts sounds on a timer of its own can pass without answering
    the touch.
  - Wrong move: it times the element the walk names. Whether that is a real
    consequence a child can read is for a person to judge.
  - Round: the walk is played at machine speed. A pass means a round can end
    inside 2 min, including the page's own waits. A child's time is not measured."""

# Runs before the page's own scripts. Notes, on the page's clock, each request
# to start a sound, the first touch and the latest moment a finger lifted.
SPY = """
window.__play = {sounds: [], first: null, lift: 0};
(() => {
  const spy = (proto, method) => {
    if (!proto || !Object.hasOwn(proto, method)) return;
    const original = proto[method];
    proto[method] = function (...args) { window.__play.sounds.push(performance.now()); return original.apply(this, args); };
  };
  for (const name of ['AudioScheduledSourceNode', 'AudioBufferSourceNode', 'OscillatorNode', 'ConstantSourceNode'])
    spy(window[name] && window[name].prototype, 'start');
  spy(window.HTMLMediaElement && HTMLMediaElement.prototype, 'play');
  spy(window.SpeechSynthesis && SpeechSynthesis.prototype, 'speak');
  addEventListener('touchstart', () => { window.__play.first ??= performance.now(); }, true);
  for (const type of ['touchend', 'touchcancel'])
    addEventListener(type, () => { window.__play.lift = performance.now(); }, true);
})();
"""

SHOWING = "element => element.checkVisibility({checkOpacity: true, checkVisibilityCSS: true})"

COUNT_WORDS = """() => {
  const showing = %s;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let words = 0;
  for (let node; (node = walker.nextNode());) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script,style,noscript,template') || !showing(parent)) continue;
    words += (node.textContent.match(/[\\p{L}\\p{N}]+(?:['’-][\\p{L}\\p{N}]+)*/gu) || []).length;
  }
  return words;
}""" % SHOWING

COUNT_SELECTS = """() => {
  const showing = %s;
  const all = [...document.querySelectorAll('select')];
  return [all.filter(showing).length, all.length];
}""" % SHOWING

IS_SHOWING = """selector => {
  const showing = %s;
  const element = document.querySelector(selector);
  return !!element && showing(element);
}""" % SHOWING

# Resolves with the ms from `since` to the moment the selector showed, or null
# once `limit` ms have passed.
WHEN_SHOWN = """([selector, since, limit]) => new Promise(resolve => {
  const showing = %s;
  const look = () => {
    const element = document.querySelector(selector), now = performance.now();
    if (element && showing(element)) resolve(now - since);
    else if (now > since + limit) resolve(null);
    else setTimeout(look, 10);
  };
  look();
})""" % SHOWING

# Resolves true when a sound started after sound number `from` and no later
# than 1 s after the finger lifted.
HEARD = """from => new Promise(resolve => {
  const look = () => {
    const until = window.__play.lift + 1000;
    if (window.__play.sounds.slice(from).some(at => at <= until)) resolve(true);
    else if (performance.now() > until) resolve(false);
    else setTimeout(look, 10);
  };
  look();
})"""


class WalkStop(Exception):
    """A step could not be done, so the lines that depend on it stay unchecked."""


def centre(page, selector, timeout=5000):
    target = page.locator(selector).first
    try:
        target.wait_for(state='visible', timeout=max(1, timeout))
    except PlaywrightTimeout:
        raise WalkStop(f'{selector} was not on screen after {timeout / 1000:.1f} s')
    box = target.bounding_box()
    return box['x'] + box['width'] / 2, box['y'] + box['height'] / 2


def do_step(page, cdp, step, during=None):
    """Perform one tap or drag with touch input."""
    x, y = centre(page, step.get('tap') or step['drag'])
    if 'tap' in step:
        page.touchscreen.tap(x, y)
        return
    end_x, end_y = centre(page, step['to'])
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
    for i in range(1, 9):
        point = {'x': x + (end_x - x) * i / 8, 'y': y + (end_y - y) * i / 8}
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [point]})
        page.wait_for_timeout(16)
    if during:
        during((x, y), (end_x, end_y))
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})


def name_of(step):
    return f"tap {step['tap']}" if 'tap' in step else f"drag {step['drag']}"


def check(walk_path, base, browser):
    """Play one walk. Returns six (status, detail) pairs in the order of LINES."""
    walk = json.loads(Path(walk_path).read_text())
    first = walk.get('first')
    if first and not ('drag' in first and 'to' in first):
        sys.exit(f'{walk_path}: "first" must be {{"drag": selector, "to": selector}}')
    results = [('NOT CHECKED', 'the walk has no steps for this line')] * 6
    context = browser.new_context(viewport={'width': 1024, 'height': 768}, has_touch=True)
    context.add_init_script(SPY)
    silent, actions = [], []
    selects = {'showing': 0, 'all': 0}

    def look_for_selects(page):
        showing, found = page.evaluate(COUNT_SELECTS)
        selects['showing'] = max(selects['showing'], showing)
        selects['all'] = max(selects['all'], found)

    def act(step):
        """Do a step. Returns how many sounds had started before it."""
        before = page.evaluate('window.__play.sounds.length')
        do_step(page, cdp, step)
        actions.append(step)
        look_for_selects(page)
        return before

    def listen(step, before):
        """Note the step as silent unless a sound answered it."""
        if not page.evaluate(HEARD, before):
            silent.append(name_of(step))

    def first_drag():
        """Drag the first thing until it follows the finger or 5 s have passed since opening."""
        before = page.evaluate('window.__play.sounds.length')
        mover = page.locator(first['drag']).first
        seen = {}

        def measure(start, end):
            box = mover.bounding_box()
            left = math.dist((box['x'] + box['width'] / 2, box['y'] + box['height'] / 2), end)
            seen['drag'] = math.dist(start, end)
            seen['followed'] = seen['drag'] - left
            seen['at'] = page.evaluate('performance.now()') / 1000

        while True:
            do_step(page, cdp, first, measure)
            if seen['drag'] < 50:
                raise WalkStop(f"{first['drag']} is already at {first['to']}, so the drag is too short to judge")
            if seen['followed'] >= seen['drag'] / 2 or seen['at'] > 5:
                break
            page.wait_for_timeout(250)
        actions.append(first)
        look_for_selects(page)
        detail = f"it followed the finger {max(0, seen['followed']):.0f} of {seen['drag']:.0f} px, {seen['at']:.1f} s after opening"
        results[0] = ('PASS' if seen['followed'] >= seen['drag'] / 2 and seen['at'] <= 5 else 'FAIL', detail)
        listen(first, before)

    def play():
        first_drag()
        wrong = walk.get('wrong')
        if wrong:
            if page.evaluate(IS_SHOWING, wrong['shows']):
                results[4] = ('FAIL', f"{wrong['shows']} was already on screen before the wrong move")
            else:
                for step in wrong['steps'][:-1]:
                    listen(step, act(step))
                last = wrong['steps'][-1]
                before = act(last)
                took = page.evaluate(WHEN_SHOWN, [wrong['shows'], page.evaluate('window.__play.lift'), 1000])
                results[4] = ('FAIL', f"{wrong['shows']} did not show within 1 s of the wrong move") if took is None else \
                             ('PASS', f"{wrong['shows']} showed {max(0, took) / 1000:.2f} s after the wrong move")
                listen(last, before)
        round_ = walk.get('round')
        if round_:
            if page.evaluate(IS_SHOWING, round_['ends']):
                results[5] = ('FAIL', f"{round_['ends']} was already on screen before the round was played")
            else:
                for step in round_['steps']:
                    listen(step, act(step))
                took = page.evaluate(WHEN_SHOWN, [round_['ends'], page.evaluate('window.__play.first'), 120000])
                results[5] = ('FAIL', f"{round_['ends']} did not show within 2 min of the first touch") if took is None else \
                             ('PASS', f"{round_['ends']} showed {took / 1000:.1f} s after the first touch, "
                                      f'{len(actions)} actions at machine speed')

    try:
        # What the screen holds when nobody touches it for 5 s.
        idle = context.new_page()
        response = idle.goto(base + walk['page'])
        if not response.ok:
            sys.exit(f"{walk_path}: {walk['page']} did not load (HTTP {response.status})")
        idle.wait_for_timeout(5000)
        words = idle.evaluate(COUNT_WORDS)
        results[1] = ('PASS' if words <= 12 else 'FAIL', f'{words} words on screen')
        look_for_selects(idle)
        idle.close()

        stopped = None
        if first:
            page = context.new_page()
            cdp = context.new_cdp_session(page)
            page.goto(base + walk['page'])
            try:
                centre(page, first['drag'], int(5000 - page.evaluate('performance.now()')))
            except WalkStop:
                results[0] = ('FAIL', f"{first['drag']} was not on screen within 5 s of opening")
                stopped = 'nothing was there to touch'
            else:
                try:
                    play()
                except WalkStop as stop:
                    stopped = str(stop)
        if silent:
            results[3] = ('FAIL', 'no sound after: ' + ', '.join(silent))
        elif actions and not stopped:
            results[3] = ('PASS', f'a sound started after each of {len(actions)} actions')
        if stopped:
            results = [('NOT CHECKED', f'the walk stopped first: {stopped}') if status == 'NOT CHECKED' else (status, detail)
                       for status, detail in results]
        results[2] = ('FAIL' if selects['showing'] else 'PASS',
                      f"{selects['showing']} showing, {selects['all'] - selects['showing']} hidden in the page")
    finally:
        context.close()
    return results


def report(walk_path, results):
    print(f'\nPlay budget: {walk_path}')
    for number, (line, (status, detail)) in enumerate(zip(LINES, results), 1):
        print(f'  {status:<11} {number}. {line}: {detail}')


def main():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/'
    options = {'headless': True}
    chrome = os.environ.get('CHROME_PATH') or (MAC_CHROME if Path(MAC_CHROME).exists() else None)
    if chrome:
        options['executable_path'] = chrome
    with sync_playwright() as pw:
        browser = pw.chromium.launch(**options)
        try:
            if len(sys.argv) > 1:
                results = check(sys.argv[1], base, browser)
                report(sys.argv[1], results)
                passed = all(status == 'PASS' for status, _ in results)
                print('\n' + LIMITS)
                print('\nPlay budget met.' if passed else '\nPlay budget not met.')
            else:
                # Self-check: the toy fixture meets every line; the workbook fixture
                # fails lines 1 to 5 and gives no round, so line 6 stays unchecked.
                toy = check(FIXTURES / 'toy.walk.json', base, browser)
                report('test/fixtures/play-budget/toy.walk.json', toy)
                workbook = check(FIXTURES / 'workbook.walk.json', base, browser)
                report('test/fixtures/play-budget/workbook.walk.json', workbook)
                passed = [status for status, _ in toy] == ['PASS'] * 6 and \
                    [status for status, _ in workbook] == ['FAIL'] * 5 + ['NOT CHECKED']
                print('\n' + LIMITS)
                print('\nSelf-check passed: the toy meets the budget and the workbook is caught on lines 1 to 5.'
                      if passed else '\nSelf-check FAILED: the fixtures did not get the expected results.')
        finally:
            browser.close()
            server.shutdown()
    sys.exit(0 if passed else 1)


if __name__ == '__main__':
    main()
