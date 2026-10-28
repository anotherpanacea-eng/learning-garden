"""Synthetic Which Hat? journeys through the real app, speech and notebook transfer."""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import threading

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('HATS_ARTIFACTS', '/tmp/which-hat-browser'))
OUT.mkdir(parents=True, exist_ok=True)
checks = 0
errors = []


def ok(value, message):
    global checks
    assert value, message
    checks += 1


def node(source):
    return json.loads(subprocess.check_output(
        ['node', '--input-type=module', '-e', source], cwd=ROOT, text=True))


fixtures = node("""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {startPostOffice,setPostPackingInput} from './dist/post-office-core.mjs';
import {deliveries} from './dist/post-office-content.mjs';
import {startHats,keepHat,answerHat,editHat} from './dist/which-hat-core.mjs';
import {hatSource} from './dist/which-hat-content.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
startPostOffice(base,deliveries[0].id);setPostPackingInput(base,'17');
const options={canExport:()=>true};
const malformed=structuredClone(base);startHats(malformed,options);keepHat(malformed,options);
const m=malformed.descriptions.visits[malformed.descriptions.current];
m.claims.unshift({synthetic:'unreadable original claim'});
m.answers.a1={first:{synthetic:'unreadable original answer'}};
editHat(malformed,'question','a2',options);answerHat(malformed,'a',options);
const old=structuredClone(base),source=structuredClone(hatSource);
source.id='retired-two-hats';source.title='Earlier two-hat rack';
source.hats=source.hats.slice(0,2).map((h,i)=>({...h,id:`earlier-peg-${i+1}`,label:`Earlier peg ${i+1}`}));
source.tiles=source.tiles.filter(t=>t.id==='old').map(t=>({...t,id:'earlier-old',text:'earlier old'}));
source.questions=source.questions.slice(0,1).map(q=>({...q,id:'earlier-question',prompt:'Earlier question wording',key:'a'}));
startHats(old,{...options,source});editHat(old,'tile','earlier-old',options);keepHat(old,options);
const w=old.descriptions.visits[old.descriptions.current];delete w.support;
w.claims[0].phrase='Earlier phrase kept exactly';w.claims[0].feedback='Earlier feedback kept exactly';
delete w.claims[0].helpBefore;
console.log(JSON.stringify({base,malformed,old}));
""")
fixture = fixtures['base']


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class PreviewServer(http.server.ThreadingHTTPServer):
    request_queue_size = 128


def book(p):
    return p.evaluate('()=>window.__hatsRead()')


def root(p):
    return book(p)['descriptions']


def work(p):
    r = root(p)
    return r['visits'][r['current']]


def click(p, selector):
    control=p.locator(selector)
    if any(k in selector for k in ['data-hat-earlier','data-hat-later','data-hat-remove-word']) and not control.is_visible():
        p.locator('.hats-movement > summary').click()
    control.click()


def turn(p, name):
    click(p, f'.hats-pages [data-hat-page="{name}"]')


def go(p, base):
    p.goto(base + '#post/descriptions')
    p.locator('[data-hats-root]').wait_for()


def start(p):
    controls = p.locator('[data-hat-start]')
    if controls.first.is_visible():
        controls.first.click()
    else:
        p.locator('summary').filter(has_text='Another visit or make space').click()
        controls.first.click()


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no page overflow')
    small = p.locator('.hats-page button,.hats-page a,.hats-page summary').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&"
        "(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44))"
        ".map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not small, '44px visible targets: ' + str(small))


def setup(browser, width, seed=None):
    context = browser.new_context(viewport={'width': width, 'height': 1000},
                                  has_touch=True, accept_downloads=True,
                                  reduced_motion='reduce')
    context.add_init_script('('+r"""seed=>{
      if(!localStorage.getItem('hats-synthetic-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('hats-synthetic-fixture','1');
      }
      window.__hatsRefuse=false;window.__hatsSpoken=[];
      window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
      Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},
        getVoices(){return [{name:'Synthetic English',lang:'en-US',localService:true,default:true,voiceURI:'synthetic'}]},
        speak(u){const s=window.__hatsRead(),r=s.descriptions,w=r?.visits[r.current];
          window.__hatsSpoken.push({text:u.text,support:structuredClone(w?.support??null)});
          queueMicrotask(()=>u.onstart?.());},addEventListener(){},removeEventListener(){}}});
    }"""+')('+json.dumps(seed if seed is not None else fixture)+')')

    def app(route):
        response = route.fetch()
        body = response.text()
        assert 'let graph=null,' in body, 'host read seam changed'
        body = body.replace('let graph=null,',
                            'window.__hatsRead=()=>structuredClone(state);let graph=null,', 1)
        needle = 'bindHats(state,{save,render,focus:focusElement,canExport:priceOptions().canExport,'
        assert needle in body, 'host preflight seam changed'
        body = body.replace(needle,
            'bindHats(state,{save,render,focus:focusElement,canExport:c=>!window.__hatsRefuse&&priceOptions().canExport(c),', 1)
        route.fulfill(response=response, body=body)

    context.route('**/app.mjs', app)
    page = context.new_page()
    page.set_default_timeout(10000)
    page.on('pageerror', lambda error: errors.append(str(error)))
    return context, page


def result(p, outcome, count):
    ok(p.locator(f'[data-hat-outcome="{outcome}"]').count() == 1, 'actual rack outcome '+outcome)
    ok(p.locator('.hats-count strong').inner_text() == str(count), 'actual rack match count '+str(count))
    ok(p.locator('.hat-matches').count() == count, 'matching rack highlights agree with live count')
    ok(p.locator('.hats-return').count() == int(outcome == 'target'), 'return caption only for requested unique hat')


def journey(browser, width, base):
    c, p = setup(browser, width)
    try:
        go(p, base)
        before = book(p)
        ok('descriptions' not in before, 'preview creates no hat record')
        ok(p.locator('.welcome-film').count() == 0, 'direct hat route has no film')
        ok(p.evaluate('window.__hatsSpoken.length') == 0, 'no automatic speech')
        bounds(p)
        p.reload();p.locator('[data-hats-root]').wait_for()
        ok(book(p) == before, 'reloaded preview retains exact notebook')
        start(p)
        first_id = root(p)['current']
        ok(work(p)['page'] == 'build' and work(p)['tiles'] == [], 'explicit start creates empty phrase visit')
        ok(p.locator('#hat-heading').evaluate('x=>document.activeElement===x'), 'start focuses local heading')
        result(p, 'several', 6)
        ok(p.locator('[data-hat-phrase]').inner_text() == 'the hat', 'supplied frame is visible')
        ok(p.locator('.hat-facts').count() == 6 and p.locator('.hat-art').count() == 6, 'all hats have both printed facts and pictures')
        facts=p.locator('.hat-facts').all_text_contents()
        ok(facts == ['small, old, blue; no ribbon','small, new, blue; gold ribbon','big, old, blue; gold ribbon','big, new, red; no ribbon','small, old, red; blue ribbon','big, new, blue; blue ribbon'], 'printed peg facts match authored six-hat table')
        p.locator('[data-hat-tile="blue"]').focus();p.keyboard.press('Enter')
        ok(p.locator('[data-hat-tile="blue"]').evaluate('x=>document.activeElement===x'), 'keyboard tile operation restores focus')
        result(p, 'several', 4)
        click(p, '[data-hat-tile="small"]');result(p, 'several', 2)
        click(p, '[data-hat-tile="old"]');result(p, 'target', 1)
        phrase=work(p)['tiles'][:]
        click(p, '[data-hat-target="peg-2"]');result(p, 'other', 1)
        ok(work(p)['tiles'] == phrase, 'changing target retains phrase exactly')
        click(p, '[data-hat-target="peg-1"]')
        click(p, '[data-hat-help="readback"]')
        ok('Most speakers' in p.locator('[data-hat-readback]').inner_text(), 'unusual adjective order explained without changing meaning')
        ok({'forId':'peg-1','kind':'readback'} in work(p)['support']['concept'], 'read-back records concept support')
        click(p, '[data-hat-earlier="small"]')
        ok(p.locator('.hats-movement').evaluate('x=>x.open'), 'word movement panel remains open after first move')
        p.locator('[data-hat-earlier="old"]').click()
        ok(p.locator('.hats-movement').evaluate('x=>x.open'), 'second move needs no reopening')
        ok(p.locator('[data-hat-phrase]').inner_text() == 'the small old blue hat', 'earlier controls retain editable order')
        result(p, 'target', 1)
        ok(p.locator('[data-hat-earlier="old"]').evaluate('x=>document.activeElement===x'), 'reordering focuses the moved word control')
        p.locator('[data-hat-later="small"]').click()
        ok(p.locator('[data-hat-later="small"]').evaluate('x=>document.activeElement===x'), 'later control retains word focus')
        ok(work(p)['tiles'] == ['old','small','blue'], 'later control moves selected modifier')
        click(p, '[data-hat-earlier="small"]')
        click(p, '[data-hat-tile="gold-ribbon"]');result(p, 'none', 0)
        ok(p.locator('[data-hat-phrase]').inner_text().endswith('hat with a gold ribbon'), 'ribbon phrase stays after head noun')
        click(p, '[data-hat-keep]')
        contradiction=copy.deepcopy(work(p)['claims'][0])
        click(p, '[data-hat-remove-word="gold-ribbon"]');result(p, 'target', 1)
        click(p, '[data-hat-tile="lovely"]');result(p, 'target', 1)
        ok(p.locator('[data-hat-phrase]').inner_text() == 'the small old blue lovely hat', 'opinion keeps chosen order while ruling no hat out')
        click(p, '[data-hat-help="hint"]');click(p, '[data-hat-help="example"]');click(p, '[data-hat-help="together"]')
        ok(all({'forId':'peg-1','kind':k} in work(p)['support']['concept'] for k in ['hint','example','together']), 'all optional build supports observed by affected target')
        click(p, '[data-speak]')
        spoken=p.evaluate('window.__hatsSpoken')
        ok(len(spoken) == 1 and {'forId':'peg-1','kind':'audio'} in spoken[0]['support']['reading'], 'reading support committed before local playback')
        ok(spoken[0]['support']['concept'] == work(p)['support']['concept'], 'reading and concept channels stay separate')
        click(p, '[data-hat-keep]')
        kept=copy.deepcopy(work(p)['claims'])
        ok(kept[0] == contradiction and kept[1]['helpBefore']['reading'], 'later help and audio preserve earlier claim snapshot')
        turn(p, 'kept');bounds(p)
        ok(p.locator('.hats-kept-claim').count() == 2, 'kept turn displays both contradictory and successful discoveries')
        p.locator('.hats-kept-claim details summary').first.click()
        ok('Peg 1' in p.locator('.hats-kept-claim').first.inner_text(), 'kept discovery exposes original source')
        p.screenshot(path=str(OUT/f'kept-{width}.png'), full_page=True)
        turn(p, 'questions')
        ok(p.locator('[data-hat-question]').count() == 5, 'all five question families freely available')
        ok(p.locator('[data-hat-target]').count() == 6, 'rack stays available on question turn')
        click(p, '[data-hat-answer="a"]')
        first=copy.deepcopy(work(p)['answers']['a1']['first'])
        ok(first['outcome'] == 'again' and first['choice'] == 'a', 'first wrong response retained')
        ok(p.locator('#hat-question-heading').evaluate('x=>document.activeElement===x'), 'answer focuses question heading')
        click(p, '[data-hat-help="hint"]');click(p, '[data-hat-help="example"]');click(p, '[data-hat-help="together"]')
        ok('1. Look at the six pegs' in p.locator('[data-hat-help-shown="together"]').inner_text(), 'first question has its own guided steps')
        click(p, '[data-hat-answer="b"]');click(p, '[data-hat-skip]')
        slot=work(p)['answers']['a1']
        ok(slot['first'] == first and slot['latest']['outcome'] == 'fits', 'retry preserves first and records latest separately')
        ok(slot['skipped']['outcome'] == 'skipped', 'later skip is separate observation')
        ok(slot['first']['helpBefore']['concept'] != slot['latest']['helpBefore']['concept'], 'support-before frozen separately for first and retry')
        ok('First response' in p.locator('.hats-answer-history').inner_text() and 'Latest response' in p.locator('.hats-answer-history').inner_text(), 'first and latest results visible together')
        for q,key in [('a2','c'),('a3','c'),('a4','a'),('a5','c')]:
            click(p, f'[data-hat-question="{q}"]')
            click(p, f'[data-hat-answer="{key}"]')
            ok(work(p)['answers'][q]['first']['outcome'] == 'fits', 'authored question key '+q)
        ok(list(work(p)['answers']) == ['a1','a2','a3','a4','a5'], 'all five separate supplied-answer records retained')
        bounds(p);p.screenshot(path=str(OUT/f'questions-{width}.png'), full_page=True)
        state_before=book(p);p.reload();p.locator('[data-hats-root]').wait_for()
        ok(book(p) == state_before, 'refresh retains choices, claims and first/latest/support exactly')
        p.evaluate('window.__hatsRefuse=true');snapshot=book(p)
        for selector in ['[data-hat-answer="b"]','[data-hat-skip]','[data-hat-help="hint"]','[data-hat-question="a2"]']:
            click(p, selector);ok(book(p) == snapshot, 'preflight refusal retains whole notebook: '+selector)
        count=p.evaluate('window.__hatsSpoken.length');click(p, '[data-speak]')
        ok(p.evaluate('window.__hatsSpoken.length') == count and book(p) == snapshot, 'refused reading support never reaches playback or changes work')
        ok('exportable' in p.locator('#hat-status').inner_text(), 'refusal explains notebook preservation')
        p.evaluate('window.__hatsRefuse=false');turn(p, 'build')
        p.evaluate('window.__hatsRefuse=true');snapshot=book(p)
        for selector in ['[data-hat-tile="red"]','[data-hat-keep]','[data-hat-help="readback"]','[data-hat-clear]','[data-hat-target="peg-3"]']:
            click(p, selector);ok(book(p) == snapshot, 'refused builder change retains visible choices: '+selector)
        p.evaluate('window.__hatsRefuse=false')
        stale=p.locator('[data-hat-keep]').element_handle()
        turn(p, 'questions');snapshot=book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == snapshot, 'detached control cannot keep another discovery')
        stale=p.locator('[data-hat-answer="a"]').element_handle()
        p.goto(base+'#pathways/english');p.locator('[data-pathway-root]').wait_for()
        snapshot=book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == snapshot, 'route-stale answer is inert')
        ok(p.locator('a[href="#post/descriptions"]').count() >= 1, 'English pathway links to descriptions')
        p.goto(base+'#post/choose');p.locator('a[href="#post/descriptions"]').wait_for()
        ok('Which Hat?' in p.locator('main').inner_text(), 'Post Office hub offers hat workshop')
        go(p, base)
        saved=copy.deepcopy(root(p))
        initial=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        p.goto(base+'#notes');p.locator('#download').wait_for()
        ok(p.locator('#hat-heading').count() == 0, 'notes omit activity-only heading ids')
        with p.expect_download() as downloaded:
            click(p, '#download')
        exported=json.loads(Path(downloaded.value.path()).read_text())
        ok(exported['descriptions'] == saved, 'real notes download contains exact hat source and evidence')
        ok('Which Hat?' in p.locator('main').inner_text(), 'notes register hat destination')
        p.locator('#progress-file').set_input_files({'name':'synthetic-hats.json','mimeType':'application/json','buffer':json.dumps(exported).encode()})
        p.locator('#progress-import-confirm').wait_for()
        ok('Which Hat?' in p.locator('.import-preview').inner_text(), 'real import preview registers hat destination')
        click(p, '#progress-import-confirm')
        ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'actual import completes')
        imported=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        ok(imported != initial, 'import creates a separate explorer')
        go(p, base)
        if p.locator('[data-select-explorer]').count():
            click(p, f'[data-select-explorer="{imported}"]')
        p.locator('[data-hats-root]').wait_for()
        ok(root(p) == saved, 'import restores exact descriptions root')
        turn(p, 'build');stale=p.locator('[data-hat-keep]').element_handle()
        click(p, '[data-hat-target="peg-2"]');click(p, '[data-hat-help="hint"]')
        changed=copy.deepcopy(root(p))
        click(p, '#explorer-switch');click(p, f'[data-select-explorer="{initial}"]')
        p.locator('[data-hats-root]').wait_for()
        ok(p.url.endswith('#post/descriptions'), 'explorer selection preserves direct hat route')
        snapshot=book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == snapshot and root(p) == saved, 'old-explorer control cannot change selected explorer')
        click(p, '#explorer-switch');click(p, f'[data-select-explorer="{imported}"]')
        p.locator('[data-hats-root]').wait_for()
        ok(root(p) == changed, 'imported explorer retains independent target and support')
        p.reload();p.locator(f'[data-select-explorer="{imported}"]').wait_for()
        click(p, f'[data-select-explorer="{imported}"]');p.locator('[data-hats-root]').wait_for()
        ok(root(p) == changed, 'reload and explorer picker retain exact hat work')
        start(p)
        disposable=root(p)['current'];serial=root(p)['nextSerial']
        p.locator('summary').filter(has_text='Another visit or make space').click()
        snapshot=book(p);p.once('dialog', lambda d:d.dismiss());click(p, f'[data-hat-delete="{disposable}"]')
        ok(book(p) == snapshot, 'canceled removal changes nothing')
        p.once('dialog', lambda d:d.accept());click(p, f'[data-hat-delete="{disposable}"]')
        ok(disposable not in root(p)['visits'] and root(p)['nextSerial'] == serial, 'confirmed removal keeps allocation counter monotonic')
        ok(root(p)['visits'] == changed['visits'], 'confirmed removal preserves every other visit exactly')
        p.locator('summary').filter(has_text='Your hat visits').click()
        click(p, f'[data-hat-resume="{first_id}"]')
        ok(work(p)['source'] == saved['visits'][first_id]['source'], 'resume restores original source')
        bounds(p)
    finally:
        c.close()


def retained_preview(browser, base):
    seed=copy.deepcopy(fixture)
    seed['garden']={'avatar':'sky','guide':'synthetic-future-guide','visits':[{'id':'synthetic-future','drafts':{'retained':'exact pending words'}}],'current':'synthetic-future','seen':['synthetic-future-node'],'observations':[{'future':'retained original'}]}
    seed['baseline']['draft']={'questionId':'groups','attempts':[],'input':'synthetic pending check-in'}
    c,p=setup(browser,320,seed)
    try:
        go(p,base);ok(book(p) == seed, 'hat preview retains every foreign root without normalization')
        start(p);click(p,'[data-hat-tile="small"]');click(p,'[data-hat-keep]')
        got=book(p);got.pop('descriptions')
        ok(got == seed, 'hat mutations preserve future garden, baseline and parcel roots exactly')
        ok(book(p)['postOffice']['visits'][0]['packing']['input'] == '17', 'waiting parcel input remains exact')
        held=book(p);owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{owner}"]');p.locator('[data-hats-root]').wait_for()
        ok(book(p) == held and p.locator('.welcome-film').count() == 0, 'existing explorer selection causes no film or foreign initialization')
        click(p,'#explorer-switch');click(p,'#explorer-new');click(p,'#explorer-create');p.locator('[data-hats-root]').wait_for()
        ok(p.locator('.welcome-film').count() == 0, 'new explorer creation on hat route causes no film')
        ok('welcomeFilmSeen' not in book(p).get('garden',{}), 'fresh explorer has no unrelated film flag')
        old=p.evaluate("id=>JSON.parse(localStorage.getItem('number-garden-v1:'+id))",owner)
        ok(old == held, 'fresh explorer creation retains original hat and foreign work exactly')
    finally:
        c.close()


def retained_history(browser, base):
    c,p=setup(browser,320,fixtures['malformed'])
    try:
        go(p,base);raw=copy.deepcopy(work(p)['answers']['a1'])
        turn(p,'kept');ok(p.locator('.hats-kept-claim').count() == 1, 'malformed claim does not hide healthy sibling')
        turn(p,'questions');click(p,'[data-hat-question="a1"]');before=book(p)
        click(p,'[data-hat-answer="b"]')
        ok(book(p) == before and work(p)['answers']['a1'] == raw, 'malformed answer retained exactly and cannot be silently extended')
        click(p,'[data-hat-question="a3"]');click(p,'[data-hat-answer="c"]')
        ok(work(p)['answers']['a3']['first']['outcome'] == 'fits', 'healthy other question stays answerable')
        saved=copy.deepcopy(root(p));p.goto(base+'#notes');p.locator('#download').wait_for()
        ok(p.locator('#hat-heading').count() == 0, 'notes omit activity-only heading ids')
        with p.expect_download() as download:
            click(p,'#download')
        exported=json.loads(Path(download.value.path()).read_text())
        ok(exported['descriptions'] == saved, 'actual download retains malformed raw records exactly')
        p.locator('#progress-file').set_input_files({'name':'synthetic-retained-hats.json','mimeType':'application/json','buffer':json.dumps(exported).encode()})
        p.locator('#progress-import-confirm').wait_for();click(p,'#progress-import-confirm')
        go(p,base)
        if p.locator('[data-select-explorer]').count():
            active=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
            click(p,f'[data-select-explorer="{active}"]')
        p.locator('[data-hats-root]').wait_for()
        ok(root(p) == saved, 'actual import roundtrip keeps malformed raw records and healthy sibling')
        start(p);turn(p,'questions');click(p,'[data-hat-answer="b"]')
        ok(work(p)['answers']['a1']['first']['outcome'] == 'fits', 'healthy new visit can answer formerly malformed question')
        ok(root(p)['visits'][saved['current']] == saved['visits'][saved['current']], 'new visit leaves earlier malformed history exact')
    finally:
        c.close()
    c,p=setup(browser,820,fixtures['old'])
    try:
        go(p,base);before=book(p)
        ok(p.locator('[data-hat-target]').count() == 2, 'retired self-consistent smaller rack opens')
        ok(p.locator('[data-hat-tile]').count() == 1 and p.locator('[data-hat-phrase]').inner_text() == 'the earlier old hat', 'working retired source wording and ids retained')
        ok(work(p)['source'] == fixtures['old']['descriptions']['visits']['hats-0']['source'], 'current catalog never refreshes old source')
        turn(p,'kept')
        ok('Earlier phrase kept exactly' in p.locator('.hats-kept-claim').inner_text() and 'Earlier feedback kept exactly' in p.locator('.hats-kept-claim').inner_text(), 'kept result uses original phrase and feedback')
        ok('not observed' in p.locator('.hats-kept-claim').inner_text(), 'missing earlier support remains unobserved')
        turn(p,'questions')
        ok(p.locator('[data-hat-question]').count() == 1 and p.locator('#hat-question-heading').inner_text() == 'Earlier question wording', 'retired question count and wording open')
        click(p,'[data-hat-answer="a"]')
        ok(work(p)['answers']['earlier-question']['first']['outcome'] == 'fits', 'retired source answer key used')
        ok('helpBefore' not in work(p)['answers']['earlier-question']['first'], 'answer before observed support stays unobserved')
        click(p,'[data-hat-help="hint"]')
        ok(work(p)['support']['observed'] is False, 'new support does not claim earlier observation')
        bounds(p);p.screenshot(path=str(OUT/'retired-source-820.png'),full_page=True)
    finally:
        c.close()


if __name__ == '__main__':
    server=None
    base=os.environ.get('HATS_TEST_URL')
    if not base:
        server=PreviewServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
            try:
                for width in [320,820]:
                    journey(browser,width,base)
                retained_preview(browser,base)
                retained_history(browser,base)
                ok(not errors,'no browser page errors: '+str(errors))
                print(f'Which Hat? Chrome: {checks} assertions passed; screenshots {OUT}')
            finally:
                browser.close()
    finally:
        if server:
            server.shutdown();server.server_close()
