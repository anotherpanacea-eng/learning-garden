"""Play budget check for a one-screen toy prototype (fleet card LG-79).

    python3 test/play-budget-browser.py                    # self-check on the fixtures
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

"page" is a path from the repository root (a "?query" or "#route" may follow
it). A step is {"tap": selector} or {"drag": selector, "to": selector}, with
CSS selectors. "first" must be a drag. The page is left untouched for 3 s while
its words are counted. Then the steps run once each, in the order first, wrong,
round, with touch input in headless Chrome at 1024 by 768.

A line the walk gives no steps for is reported NOT CHECKED. The run passes only
when all six lines pass. A pass means these automated checks passed; the output
ends with what they cannot tell.

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
  - First touch: the script leaves the page alone for 3 s, then drags the
    first thing once. A pass means the thing followed the finger for at least
    half the drag, no later than 5 s after opening. It does not mean a child
    finds what to touch.
  - Words: it counts the most visible words at any look from opening to the
    first touch, looking ten times a second and once more at the touch. Words
    in a picture, a canvas, a form field or CSS-generated content are missed.
  - On screen: for words, selects and the elements the walk names, on screen
    means rendered, not transparent, more than 1 px each way and at least
    partly inside the window. Something cut off only by a clipping or
    scrolling parent still counts as on screen.
  - Selects: it fails on a select element that is showing just before the
    first touch or after any step of the walk. A hidden select is reported
    but does not fail; one that only a step outside the walk would reveal is
    missed. Other dropdown-like controls are not detected.
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
# to start a sound, the first touch and the latest moment a finger lifted, and
# keeps the most words seen on screen before the first touch.
SPY = r"""
window.__play = {sounds: [], first: null, lift: 0, words: 0};
(() => {
  const play = window.__play;
  const spy = (proto, method) => {
    if (!proto || !Object.hasOwn(proto, method)) return;
    const original = proto[method];
    proto[method] = function (...args) { play.sounds.push(performance.now()); return original.apply(this, args); };
  };
  for (const name of ['AudioScheduledSourceNode', 'AudioBufferSourceNode', 'OscillatorNode', 'ConstantSourceNode'])
    spy(window[name] && window[name].prototype, 'start');
  spy(window.HTMLMediaElement && HTMLMediaElement.prototype, 'play');
  spy(window.SpeechSynthesis && SpeechSynthesis.prototype, 'speak');
  // On screen: rendered, not transparent, more than a 1 px screen-reader box, and inside the window.
  const showing = element => {
    if (!element.checkVisibility({checkOpacity: true, checkVisibilityCSS: true})) return false;
    const box = element.getBoundingClientRect();
    return box.width > 1 && box.height > 1 && box.right > 0 && box.bottom > 0 && box.left < innerWidth && box.top < innerHeight;
  };
  // How many elements matching the selector are showing.
  play.showing = selector => [...document.querySelectorAll(selector)].filter(showing).length;
  // Counts the words on screen now. Returns the most seen at any look so far.
  play.look = () => {
    const walker = document.body && document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let words = 0;
    for (let node; walker && (node = walker.nextNode());) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script,style,noscript,template') || !showing(parent)) continue;
      words += (node.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length;
    }
    return play.words = Math.max(play.words, words);
  };
  const looking = setInterval(play.look, 100);
  addEventListener('touchstart', () => {
    if (play.first !== null) return;
    play.look();
    clearInterval(looking);
    play.first = performance.now();
  }, true);
  for (const type of ['touchend', 'touchcancel'])
    addEventListener(type, () => { play.lift = performance.now(); }, true);
})();
"""

COUNT_SELECTS = "[window.__play.showing('select'), document.querySelectorAll('select').length]"

# Resolves with the ms from `since` to the moment the selector was seen showing,
# however late that is, or with null once `limit` ms have passed without it.
WHEN_SHOWN = """([selector, since, limit]) => new Promise(resolve => {
  const look = () => {
    const now = performance.now();
    if (window.__play.showing(selector)) resolve(now - since);
    else if (now > since + limit) resolve(null);
    else setTimeout(look, 10);
  };
  look();
})"""

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


def check(walk, base, browser):
    """Play one walk. Returns six (status, detail) pairs in the order of LINES."""
    first = walk.get('first')
    if first and not ('drag' in first and 'to' in first):
        sys.exit(f'{walk["page"]}: "first" must be {{"drag": selector, "to": selector}}')
    results = [('NOT CHECKED', 'the walk has no steps for this line')] * 6
    context = browser.new_context(viewport={'width': 1024, 'height': 768}, has_touch=True)
    context.add_init_script(SPY)
    silent, actions, selects, stopped = [], [], [0, 0], None

    def look_for_selects():
        selects[:] = map(max, selects, page.evaluate(COUNT_SELECTS))

    def act(step, during=None):
        """Do a step. Returns how many sounds had started before it."""
        before = page.evaluate('window.__play.sounds.length')
        do_step(page, cdp, step, during)
        actions.append(step)
        look_for_selects()
        return before

    def listen(step, before):
        """Note the step as silent unless a sound answered it."""
        if not page.evaluate(HEARD, before):
            silent.append(name_of(step))

    def timed(selector, since, limit, what):
        """Pass when the selector showed no later than `limit` seconds after `since`."""
        took = page.evaluate(WHEN_SHOWN, [selector, since, limit * 1000])
        if took is None:
            return 'FAIL', f'{selector} did not show within {limit} s of {what}'
        return 'PASS' if took <= limit * 1000 else 'FAIL', f'{selector} showed {max(0, took) / 1000:.2f} s after {what}'

    def play():
        mover, seen = page.locator(first['drag']).first, {}

        def measure(start, end):
            box = mover.bounding_box()
            seen['drag'] = math.dist(start, end)
            seen['followed'] = seen['drag'] - math.dist((box['x'] + box['width'] / 2, box['y'] + box['height'] / 2), end)
            seen['at'] = page.evaluate('performance.now()') / 1000

        before = act(first, measure)
        # Half the finger's travel, and more than 3 px so that jitter is not movement.
        moved = seen['followed'] >= max(seen['drag'] / 2, 3)
        results[0] = ('PASS' if moved and seen['at'] <= 5 else 'FAIL',
                      f"it followed the finger {max(0, seen['followed']):.0f} of {seen['drag']:.0f} px, "
                      f"seen {seen['at']:.1f} s after opening")
        listen(first, before)
        wrong = walk.get('wrong')
        if wrong:
            if page.evaluate('window.__play.showing', wrong['shows']):
                results[4] = ('FAIL', f"{wrong['shows']} was already on screen before the wrong move")
            else:
                for step in wrong['steps'][:-1]:
                    listen(step, act(step))
                last = wrong['steps'][-1]
                before = act(last)
                results[4] = timed(wrong['shows'], page.evaluate('window.__play.lift'), 1, 'the wrong move')
                listen(last, before)
        round_ = walk.get('round')
        if round_:
            if page.evaluate('window.__play.showing', round_['ends']):
                results[5] = ('FAIL', f"{round_['ends']} was already on screen before the round was played")
            else:
                for step in round_['steps']:
                    if page.evaluate('performance.now() - window.__play.first') > 120000:
                        break
                    listen(step, act(step))
                status, detail = timed(round_['ends'], page.evaluate('window.__play.first'), 120, 'the first touch')
                results[5] = (status, f'{detail}, {len(actions)} actions at machine speed')

    try:
        page = context.new_page()
        cdp = context.new_cdp_session(page)
        response = page.goto(base + walk['page'])
        if not response.ok:
            sys.exit(f"{walk['page']} did not load (HTTP {response.status})")
        page.wait_for_timeout(max(0, 3000 - page.evaluate('performance.now()')))
        look_for_selects()
        if first:
            try:
                play()
            except WalkStop as stop:
                stopped = str(stop)
                if not actions:
                    results[0] = ('FAIL', f'nothing could be dragged: {stopped}')
        words = page.evaluate('window.__play.first === null ? window.__play.look() : window.__play.words')
        results[1] = ('PASS' if words <= 12 else 'FAIL', f'up to {words} words on screen before the first touch')
        if silent:
            results[3] = ('FAIL', 'no sound after: ' + ', '.join(silent))
        elif actions and not stopped:
            results[3] = ('PASS', f'a sound started after each of {len(actions)} actions')
        if stopped:
            results = [('NOT CHECKED', f'the walk stopped first: {stopped}') if status == 'NOT CHECKED' else (status, detail)
                       for status, detail in results]
        results[2] = ('FAIL' if selects[0] else 'PASS', f'{selects[0]} showing, {selects[1] - selects[0]} hidden in the page')
    finally:
        context.close()
    return results


def report(name, results):
    print(f'\nPlay budget: {name}')
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
                results = check(json.loads(Path(sys.argv[1]).read_text()), base, browser)
                report(sys.argv[1], results)
                passed = all(status == 'PASS' for status, _ in results)
                print('\n' + LIMITS)
                print('\nAutomated checks passed.' if passed else '\nAutomated checks did not all pass.')
            else:
                # Self-check. Each case names the result expected on lines 1 to 6:
                # P for PASS, F for FAIL, N for NOT CHECKED. The toy takes one fault
                # at a time from its query string.
                toy = json.loads((FIXTURES / 'toy.walk.json').read_text())
                cases = [
                    ('toy', toy, 'PPPPPP'),
                    ('workbook', json.loads((FIXTURES / 'workbook.walk.json').read_text()), 'FFFFFN'),
                    ('toy, 40 px drag only', {'page': toy['page'], 'first': {'drag': '#berry-1', 'to': '#berry-1 i'}}, 'PPPPNN'),
                    ('toy?intro (a sentence that leaves after 2 s)', {**toy, 'page': toy['page'] + '?intro'}, 'PFPPPP'),
                    ('toy?wait (a sentence arrives while the first berry is still loading)',
                     {**toy, 'page': toy['page'] + '?wait'}, 'PFPPPP'),
                    ('toy?hush (only the first touch sounds)', {**toy, 'page': toy['page'] + '?hush'}, 'PPPFPP'),
                    ('toy?late (the wrong ring is answered after 1.2 s)', {**toy, 'page': toy['page'] + '?late'}, 'PPPPFP'),
                ]
                passed = True
                for name, walk, expected in cases:
                    results = check(walk, base, browser)
                    report(f'{name}, expecting {expected}', results)
                    passed = passed and ''.join(status[0] for status, _ in results) == expected
                print('\n' + LIMITS)
                print('\nSelf-check passed: every fixture case got the expected results.'
                      if passed else '\nSelf-check FAILED: the fixtures did not get the expected results.')
        finally:
            browser.close()
            server.shutdown()
    sys.exit(0 if passed else 1)


if __name__ == '__main__':
    main()
