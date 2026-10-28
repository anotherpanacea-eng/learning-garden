"""Synthetic Hundred Cups journeys through the real app and notebook transfer."""
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
OUT = Path(os.environ.get('H2O_ARTIFACTS', '/tmp/water-shares-browser'))
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
import {startWater,editWater,supportWater,keepWater,checkWater,answerWater} from './dist/water-shares-core.mjs';
import {makeWaterSource} from './dist/water-shares-content.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
startPostOffice(base,deliveries[0].id);setPostPackingInput(base,'17');
const o={canExport:()=>true},malformed=structuredClone(base);
startWater(malformed,o);supportWater(malformed,'fill',o);checkWater(malformed,o);keepWater(malformed,o);
const m=malformed.waterShares.visits[malformed.waterShares.current];
m.checks.unshift({synthetic:'unreadable original check'});m.kept.unshift({synthetic:'unreadable original diagram'});
m.answer.first={synthetic:'unreadable original response'};
malformed.waterShares.visits['future-sibling']={synthetic:'retained unreadable visit'};
const resumable=structuredClone(base);startWater(resumable,o);resumable.waterShares.current=null;
const foreign=structuredClone(base),another=structuredClone(base);
startWater(foreign,o);startWater(another,{...o,family:'underground',cups:200});
answerWater(another,another.waterShares.visits['water-0'].source.question.key,o);
foreign.waterShares.visits['water-0'].answer.first=structuredClone(another.waterShares.visits['water-0'].answer.first);
const old=structuredClone(base),source=makeWaterSource();
source.id='retired-ten-cups';source.family='retired-family';source.cups=10;
source.views=[{id:'earlier-whole',label:'Earlier named water set',whole:'10 model cups represent an earlier named water set',totalHalf:20,description:'Earlier whole retained exactly.',rows:[{id:'earlier-part',label:'Earlier part',units:6,detail:'Earlier part retained.'},{id:'earlier-rest',label:'Earlier rest',units:14,detail:'Earlier rest retained.'}]}];
source.question={...source.question,id:'earlier-reader',view:'earlier-whole',prompt:'Earlier reader question retained exactly',key:'a',choices:[{id:'a',text:'Earlier fitting reply',feedback:'Earlier fitting feedback retained exactly'},{id:'b',text:'Earlier other reply',feedback:'Earlier other feedback retained exactly'}]};
source.cards=source.cards.slice(0,1);source.cards[0]={id:'earlier-reservoir',title:'Earlier reservoir',text:'Earlier reservoir text retained exactly',pictureDescription:'Earlier original picture description retained exactly'};delete source.copy.percent;
startWater(old,{...o,source});supportWater(old,'fill',o);checkWater(old,o);keepWater(old,o);
const w=old.waterShares.visits[old.waterShares.current];
w.checks[0].feedback='Earlier check feedback retained exactly';w.kept[0].feedback='Earlier kept feedback retained exactly';
delete w.help;delete w.checks[0].helpBefore;delete w.kept[0].helpBefore;delete w.checks[0].tableAvailable;delete w.kept[0].tableAvailable;
const odd=structuredClone(old),a=odd.waterShares.visits[odd.waterShares.current];
a.source.views[0].whole='10½ model cups represent an earlier named water set';a.source.views[0].totalHalf=21;a.source.views[0].rows[0].units=7;
a.bars['earlier-whole']['earlier-part']=7;a.checks=[];a.kept=[];
console.log(JSON.stringify({base,malformed,foreign,resumable,old,odd}));
""")
fixture = fixtures['base']


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class PreviewServer(http.server.ThreadingHTTPServer):
    request_queue_size = 128


def book(p):
    return p.evaluate('()=>window.__waterRead()')


def root(p):
    return book(p)['waterShares']


def work(p):
    r = root(p)
    return r['visits'][r['current']]


def click(p, selector):
    control = p.locator(selector).first
    if not control.is_visible():
        control.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
    control.click()


def turn(p, name):
    click(p, f'[data-water-page="{name}"]')


def view(p, name):
    click(p, f'[data-water-view="{name}"]')


def go(p, base):
    p.goto(base + '#science/water-shares')
    p.locator('[data-water-root]').wait_for()


def start(p):
    click(p, '[data-water-start]')


def quantity(p, row, cups):
    control = p.locator(f'[data-water-quantity="{row}"]')
    control.fill('' if cups is None else str(cups))


def fill_source(p):
    w = work(p)
    selected = next(v for v in w['source']['views'] if v['id'] == w['view'])
    for row in selected['rows']:
        quantity(p, row['id'], row['units'] / 2)


def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no page overflow')
    small = p.locator('[data-water-root] button,[data-water-root] a,[data-water-root] summary,[data-water-root] input,[data-water-root] select').evaluate_all(
        "xs=>xs.filter(x=>x.getClientRects().length&&"
        "(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44))"
        ".map(x=>({text:x.textContent.trim(),w:x.offsetWidth,h:x.offsetHeight}))")
    ok(not small, '44px visible native targets: ' + str(small))


def setup(browser, width, seed=None):
    context = browser.new_context(viewport={'width': width, 'height': 1000},
                                  has_touch=True, accept_downloads=True,
                                  reduced_motion='reduce')
    context.add_init_script('('+r"""seed=>{
      if(!localStorage.getItem('water-synthetic-fixture')){
        localStorage.setItem('number-garden-v1',JSON.stringify(seed));
        localStorage.setItem('water-synthetic-fixture','1');
      }
      window.__waterRefuse=false;window.__waterSpoken=[];
      window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
      Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},
        getVoices(){return [{name:'Synthetic English',lang:'en-US',localService:true,default:true,voiceURI:'synthetic'}]},
        speak(u){const s=window.__waterRead(),r=s.waterShares,w=r?.visits[r.current];
          window.__waterSpoken.push({text:u.text,help:structuredClone(w?.help??null)});
          queueMicrotask(()=>u.onstart?.());},addEventListener(){},removeEventListener(){}}});
    }"""+')('+json.dumps(seed if seed is not None else fixture)+')')

    def app(route):
        response = route.fetch()
        body = response.text()
        assert 'let graph=null;' in body, 'host read seam changed'
        body = body.replace('let graph=null;',
                            'window.__waterRead=()=>structuredClone(state);let graph=null;', 1)
        needle = 'bindWater(state,{save,render,focus:focusElement,canExport:priceOptions().canExport,'
        assert needle in body, 'host preflight seam changed'
        body = body.replace(needle,
            'bindWater(state,{save,render,focus:focusElement,canExport:c=>!window.__waterRefuse&&priceOptions().canExport(c),', 1)
        route.fulfill(response=response, body=body)

    context.route('**/app.mjs', app)
    page = context.new_page()
    page.set_default_timeout(10000)
    page.on('pageerror', lambda error: errors.append(str(error)))
    return context, page


def bring(p, base, report):
    p.goto(base+'#notes')
    p.locator('#progress-file').set_input_files({'name':'synthetic-water.json',
        'mimeType':'application/json','buffer':json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for()
    ok('Hundred Cups' in p.locator('.import-preview').inner_text(), 'real import preview registers water destination')
    click(p, '#progress-import-confirm')
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(), 'real notebook import succeeds')
    go(p, base)
    if p.locator('[data-select-explorer]').count():
        active=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        click(p, f'[data-select-explorer="{active}"]')
    p.locator('[data-water-root]').wait_for()


def download(p, base):
    p.goto(base+'#notes');p.locator('#download').wait_for()
    with p.expect_download() as downloaded:
        click(p, '#download')
    return json.loads(Path(downloaded.value.path()).read_text())



def graph_matches(p):
    w=work(p);v=next(v for v in w['source']['views'] if v['id']==w['view'])
    graph=p.locator('.water-turn > [data-water-graph]')
    for row in v['rows']:
        units=w['bars'][v['id']].get(row['id'])
        bar=graph.locator(f'[data-water-bar="{row["id"]}"]')
        width=bar.evaluate('x=>parseFloat(x.style.width)')
        ok(bar.get_attribute('data-units') == ('' if units is None else str(units)), 'bar retains exact integer model units for '+row['id'])
        ok(abs(width-(0 if units is None else units/v['totalHalf']*100))<0.0001, 'bar width derives from exact model units for '+row['id'])
        printed=graph.locator(f'[data-water-print="{row["id"]}"]').inner_text()
        expected='not entered' if units is None else (str(units//2)+' cups' if units%2==0 else (str(units//2) if units>1 else '')+'½ cups')
        ok(printed == expected, 'printed graph value agrees with actual draft for '+row['id'])
    ok(v['whole'] in graph.inner_text(), 'working graph names its actual denominator')


def journey(browser, width, base):
    c, p = setup(browser, width)
    try:
        go(p, base)
        before = book(p)
        ok('waterShares' not in before, 'preview creates no water record')
        ok(p.locator('.welcome-film').count() == 0, 'direct water route has no film')
        ok(p.evaluate('window.__waterSpoken.length') == 0, 'no automatic speech')
        bounds(p)
        p.reload();p.locator('[data-water-root]').wait_for()
        ok(book(p) == before, 'reloaded preview retains exact notebook')
        start(p)
        first_id = root(p)['current']
        ok(work(p)['source']['id'] == 'fresh-amount-100', 'default visitor starts with one hundred all-water cups')
        ok(work(p)['page'] == 'meet', 'explicit start opens reservoir teaching')
        ok(p.locator('#water-heading').evaluate('x=>document.activeElement===x'), 'start focuses local heading')
        ok(p.locator('[data-water-panel="source"]').evaluate('x=>x.open'), 'source tables open immediately after Start')
        ok(p.locator('.water-source table').count() == 2, 'both frozen source tables available on meet turn')
        ok('all Earth’s water' in p.locator('.water-table-whole').first.inner_text() and 'only Earth’s freshwater' in p.locator('.water-table-whole').last.inner_text(), 'table labels name distinct nested wholes')
        p.locator('[data-water-panel="source"] > summary').click()
        turn(p,'reader')
        ok(not p.locator('[data-water-panel="source"]').evaluate('x=>x.open'), 'turn change respects deliberate source-panel closure')
        p.locator('[data-water-panel="source"] > summary').click()
        turn(p,'meet')
        for reservoir in ['saline','ice','ground','other']:
            click(p,f'[data-water-help="card-{reservoir}"]')
        ok(p.locator('.water-card-copy').count() == 4, 'all reservoir concepts freely open')
        ok(p.locator('.water-cutaway').count() == 1 and 'Soil moisture' in p.locator('.water-cutaway').text_content() and 'saturated zone' in p.locator('.water-cutaway').text_content(), 'original cutaway separates soil moisture from saturated groundwater')
        click(p,'[data-water-help="half"]')
        ok(p.locator('.water-half-art').count() == 1, 'half cup has an actual divided-cup picture')
        click(p,'[data-water-help="percent"]')
        ok(work(p)['source']['copy']['percent'] in p.locator('[data-water-help-shown="percent"]').inner_text(), 'parts-per-hundred explanation comes from frozen source')
        click(p,'[data-water-help="teach"]')
        ok('Whole, rows, then bars' in p.locator('.water-turn').inner_text(), 'source-owned teaching steps open')
        p.locator('[data-water-panel="picture"]').evaluate('x=>x.open=true')
        ok(p.locator('.water-source .water-cups svg g').count() == 100, 'source picture contains one hundred original cup drawings')
        ok(p.locator('.water-source .water-cups svg g').evaluate_all("xs=>xs.filter(g=>g.children[0].getAttribute('fill')!==g.children[1].getAttribute('fill')).length") == 1, 'half-unit distribution splits exactly one cup')
        bounds(p)
        p.screenshot(path=str(OUT/f'meet-{width}.png'), full_page=True)
        turn(p, 'build')
        ok(work(p)['bars']['all'] == {'saline':None,'fresh':None}, 'new graph quantities are unentered')
        ok(p.locator('[data-water-quantity]').count() == 2, 'all-water graph has two native quantity controls')
        ok(p.locator('[data-water-quantity]').evaluate_all("xs=>xs.every(x=>x.tagName==='INPUT'&&x.type==='number'&&x.step==='0.5'&&!!document.querySelector('label[for=\"'+x.id+'\"]'))"), 'quantities have explicit labels and half-cup steps')
        click(p, '[data-water-check]')
        ok(work(p)['checks'][-1]['outcome'] == 'missing', 'blank bars produce only missing diagnostic')
        quantity(p,'saline',0)
        ok('entered so far' in p.locator('[data-water-sum]').inner_text().lower(), 'incomplete sum labels entered values only')
        quantity(p,'fresh',0)
        click(p, '[data-water-check]')
        ok(work(p)['checks'][-1]['outcome'] == 'total', 'entered zero is a number and produces total diagnostic')
        graph_matches(p)
        quantity(p,'saline',97);quantity(p,'fresh',3)
        click(p, '[data-water-check]')
        ok(work(p)['checks'][-1]['outcome'] == 'rows', 'matching total with wrong shares produces row diagnostic')
        graph_matches(p)
        quantity(p,'saline',97.5);quantity(p,'fresh',2.5)
        ok(work(p)['bars']['all'] == {'saline':195,'fresh':5}, 'native half-cup input stores exact integer units')
        p.locator('[data-water-step-row="fresh"][data-water-step="1"]').focus();p.keyboard.press('Enter')
        ok(work(p)['bars']['all']['fresh'] == 6, 'keyboard step adds one half cup')
        ok(p.locator('[data-water-quantity="fresh"]').evaluate('x=>document.activeElement===x'), 'step focuses its quantity editor')
        click(p,'[data-water-step-row="fresh"][data-water-step="-1"]')
        ok(work(p)['bars']['all']['fresh'] == 5, 'consecutive step controls remain usable')
        click(p, '[data-water-check]')
        ok(work(p)['checks'][-1]['outcome'] == 'match', 'source-matching graph passes')
        graph_matches(p)
        all_bars = copy.deepcopy(work(p)['bars']['all'])
        view(p,'fresh');quantity(p,'ice',69);quantity(p,'ground',30);quantity(p,'other',1)
        graph_matches(p)
        ok('only Earth’s freshwater' in p.locator('[data-water-whole]').inner_text(), 'zoom whole explicitly excludes saline water')
        fresh_bars = copy.deepcopy(work(p)['bars']['fresh'])
        turn(p,'reader');turn(p,'meet');turn(p,'build');view(p,'all')
        ok(work(p)['bars'] == {'all':all_bars,'fresh':fresh_bars}, 'view and page changes preserve both graph drafts')
        bounds(p)
        p.screenshot(path=str(OUT/f'build-{width}.png'), full_page=True)
        click(p,'[data-water-keep]')
        first_keep=copy.deepcopy(work(p)['kept'][0])
        ok(first_keep['fulfilled'] is False, 'matching keep before answer is useful but not fulfilled')
        turn(p,'reader')
        q=work(p)['source']['question'];wrong=next(a['id'] for a in q['choices'] if a['id'] != q['key'])
        click(p,f'[data-water-answer="{wrong}"]')
        first=copy.deepcopy(work(p)['answer']['first'])
        ok(first['outcome'] == 'again', 'first wrong response retained')
        click(p,'[data-water-help="hint"]');click(p,'[data-water-help="example"]');click(p,'[data-water-help="together"]')
        click(p,f'[data-water-answer="{q["key"]}"]')
        click(p,'[data-water-skip]')
        a=work(p)['answer']
        ok(a['first'] == first and a['latest']['outcome'] == 'fits', 'retry preserves first and records latest')
        ok(a['skipped']['outcome'] == 'skipped', 'later skip is a separate observation')
        ok(a['first']['helpBefore'] != a['latest']['helpBefore'], 'help-before freezes separately for each answer')
        ok(work(p)['kept'][0] == first_keep, 'later fitting response does not rewrite earlier keep')
        click(p,'.water-question [data-speak]')
        spoken=p.evaluate('window.__waterSpoken')
        ok(len(spoken) == 1 and any(r['kind']=='audio' for r in spoken[0]['help']['reading']), 'reading support committed before speech playback')
        ok(q['prompt'] in spoken[0]['text'], 'reader clip uses current frozen question')
        turn(p,'build');click(p,'[data-water-keep]')
        fulfilled=copy.deepcopy(work(p)['kept'][-1])
        ok(fulfilled['fulfilled'] is True, 'new matching requested keep records fitting response')
        view(p,'fresh');click(p,'[data-water-keep]')
        ok(work(p)['kept'][-1]['fulfilled'] is False, 'matching other whole does not fulfill requested graph')
        turn(p,'reader');click(p,f'[data-water-answer="{wrong}"]')
        ok(work(p)['kept'][1] == fulfilled, 'later wrong response preserves earlier fulfilled keep')
        turn(p,'kept');bounds(p)
        ok('when kept' in p.locator('.water-kept-result').first.inner_text(), 'kept result identifies its keep-time observation')
        p.screenshot(path=str(OUT/f'kept-{width}.png'), full_page=True)
        saved=book(p);p.reload();p.locator('[data-water-root]').wait_for()
        ok(book(p) == saved, 'refresh retains sources, graphs, checks, keeps and answers exactly')
        turn(p,'reader');p.evaluate('window.__waterRefuse=true');snapshot=book(p)
        for selector in [f'[data-water-answer="{q["key"]}"]','[data-water-skip]','[data-water-help="hint"]','[data-water-page="meet"]']:
            click(p,selector);ok(book(p) == snapshot, 'preflight refusal retains notebook: '+selector)
        count=p.evaluate('window.__waterSpoken.length');click(p,'.water-question [data-speak]')
        ok(p.evaluate('window.__waterSpoken.length') == count and book(p) == snapshot, 'refused audio cannot play or alter work')
        p.evaluate('window.__waterRefuse=false');turn(p,'build');view(p,'all')
        p.evaluate('window.__waterRefuse=true');snapshot=book(p)
        quantity(p,'fresh',4.5)
        ok(book(p) == snapshot and p.locator('[data-water-quantity="fresh"]').input_value() == '4.5', 'refused typed value remains visibly pending')
        ok('exportable' in p.locator('#water-status').inner_text(), 'refusal explains notebook preservation')
        for selector in ['[data-water-keep]','[data-water-check]','[data-water-view="fresh"]','[data-water-page="reader"]','#explorer-switch']:
            click(p,selector)
            ok(book(p) == snapshot and p.locator('[data-water-quantity="fresh"]').input_value() == '4.5', 'pending input survives refused action: '+selector)
        ok('typed quantity' in p.locator('#water-status').inner_text(), 'blocked navigation explains the pending quantity')
        p.locator('[data-water-step-row="fresh"][data-water-step="-20"]').focus();p.keyboard.press('Tab')
        ok(p.locator('[data-water-step-row="fresh"][data-water-step="-2"]').evaluate('x=>document.activeElement===x'), 'Tab moves between controls while refused input remains pending')
        p.keyboard.press('Shift+Tab')
        ok(p.locator('[data-water-step-row="fresh"][data-water-step="-20"]').evaluate('x=>document.activeElement===x'), 'Shift+Tab also remains available with pending input')
        p.evaluate("location.hash='#home'")
        p.wait_for_function("location.hash==='#science/water-shares'")
        ok(book(p) == snapshot and p.locator('[data-water-quantity="fresh"]').input_value() == '4.5', 'direct hash navigation restores water route and retains refused typed input')
        p.evaluate("history.replaceState(null,'','#home');history.pushState(null,'','#science/water-shares')")
        p.go_back()
        p.wait_for_function("location.hash==='#science/water-shares'")
        ok(book(p) == snapshot and p.locator('[data-water-quantity="fresh"]').input_value() == '4.5', 'browser Back restores water route without discarding pending input')
        p.evaluate('window.__waterRefuse=false');quantity(p,'fresh',2.5)
        stale=p.locator('[data-water-keep]').element_handle()
        turn(p,'reader');snapshot=book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == snapshot, 'detached control cannot keep a different graph')
        stale=p.locator('[data-water-answer]').first.element_handle()
        stale_audio=p.locator('.water-question [data-speak]').element_handle()
        speech_count=p.evaluate('window.__waterSpoken.length')
        p.goto(base+'#pathways/science');p.locator('[data-pathway-root]').wait_for()
        snapshot=book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == snapshot, 'route-stale answer is inert')
        stale_audio.evaluate('x=>x.click()')
        ok(book(p) == snapshot and p.evaluate('window.__waterSpoken.length') == speech_count, 'route-stale audio cannot speak or record in another destination')
        ok(p.locator('a[href="#science/water-shares"]').count() >= 1, 'science pathway links to water shares')
        p.goto(base+'#science/water');p.locator('a[href="#science/water-shares"]').wait_for()
        ok('Hundred Cups' in p.locator('main').inner_text(), 'Water Lab hub offers Hundred Cups')
        go(p,base);saved=copy.deepcopy(root(p))
        initial=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        exported=download(p,base)
        ok(exported['waterShares'] == saved, 'actual notes download retains complete water root')
        ok(p.locator('#water-heading').count() == 0, 'notes do not duplicate activity heading ids')
        bring(p,base,exported)
        imported=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        ok(imported != initial and root(p) == saved, 'actual import restores exact root in separate explorer')
        turn(p,'build');stale=p.locator('[data-water-keep]').element_handle()
        quantity(p,'fresh',3);changed=copy.deepcopy(root(p))
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{initial}"]')
        p.locator('[data-water-root]').wait_for();snapshot=book(p);stale.evaluate('x=>x.click()')
        ok(book(p) == snapshot and root(p) == saved, 'old explorer control cannot change selected notebook')
        ok(p.url.endswith('#science/water-shares'), 'explorer selection keeps direct water route')
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{imported}"]');p.locator('[data-water-root]').wait_for()
        ok(root(p) == changed, 'separate explorer retains its own quantity draft')
        bounds(p)
        others=p.evaluate("id=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('number-garden-v1:')&&k!=='number-garden-v1:'+id))",imported)
        p.goto(base+'#notes');click(p,'#reset');click(p,'#confirm-reset');go(p,base)
        ok('waterShares' not in book(p), 'notebook reset clears active water work')
        ok(p.evaluate("id=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('number-garden-v1:')&&k!=='number-garden-v1:'+id))",imported) == others, 'notebook reset preserves other explorers')
        p.goto(base+'#notes');p.locator('#remember').uncheck();go(p,base);start(p);turn(p,'build');quantity(p,'fresh',1)
        ok(work(p)['bars']['all']['fresh'] == 2, 'save-off still supports the in-memory water activity')
        ok(p.evaluate("!Object.keys(localStorage).some(k=>k.startsWith('number-garden-v1:'))"), 'save-off retains no explorer notebook storage')
    finally:
        c.close()


def settings(browser, base):
    families=['fresh-amount','fresh-store','other-share','which-whole','drinking','two-trays','ice-counts','underground']
    for cups in [100,200]:
        c,p=setup(browser,820)
        try:
            go(p,base)
            for family in families:
                for selector,value in [('[data-water-family]',family),('[data-water-cups]',str(cups))]:
                    p.locator(selector).first.evaluate("x=>{for(let e=x.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true}")
                    p.locator(selector).first.select_option(value)
                click(p,'[data-water-chosen-start]')
                ok(p.locator('[data-water-panel="source"]').evaluate('x=>x.open'), 'new selected visitor starts with open source tables')
                w=work(p);source=copy.deepcopy(w['source'])
                ok(source['id'] == f'{family}-{cups}', 'transparent open setting '+source['id'])
                turn(p,'reader');q=source['question']
                ok(p.locator('[data-water-answer]').count() == 3, 'three stable supplied choices for '+source['id'])
                click(p,f'[data-water-answer="{q["key"]}"]')
                ok(work(p)['answer']['first']['outcome'] == 'fits', 'frozen authored answer key for '+source['id'])
                turn(p,'build');view(p,q['view']);fill_source(p)
                graph_matches(p)
                p.locator('[data-water-panel="picture"]').evaluate('x=>x.open=true')
                ok(p.locator('.water-source .water-cups svg').count() == cups//100, 'original cup trays respect selected size '+source['id'])
                click(p,'[data-water-check]');click(p,'[data-water-keep]')
                w=work(p)
                ok(w['checks'][-1]['outcome'] == 'match' and w['kept'][-1]['fulfilled'] is True, 'question-first graph fulfills '+source['id'])
                ok(w['source'] == source, 'working source never regenerated for '+source['id'])
                click(p,'.water-source [data-speak]')
                clip=p.evaluate('window.__waterSpoken.at(-1).text')
                ok(q['prompt'] in clip and all(v['whole'] in clip for v in source['views']), 'source clip uses the currently frozen request and wholes '+source['id'])
                turn(p,'reader');click(p,'.water-question [data-speak]')
                ok(q['prompt'] in p.evaluate('window.__waterSpoken.at(-1).text'), 'reader clip changes with selected visitor '+source['id'])
            earlier=copy.deepcopy(root(p)['visits'])
            for index in range(8,16):
                seen={v['source']['id'] for v in root(p)['visits'].values()}
                start(p)
                ok(len(root(p)['visits']) == index+1 and all(root(p)['visits'][k] == v for k,v in earlier.items()), 'full16-setting pass does not evict earlier work')
                repeated=work(p)['source']['id'] in seen
                ok(p.locator('[data-water-revisit]').count() == int(repeated), 'repeated sources get an honest revisit label')
            saved=book(p);start(p)
            ok(book(p) == saved and len(root(p)['visits']) == 16, 'seventeenth visit refuses without eviction')
            visits=copy.deepcopy(root(p)['visits']);seen_sources={}
            for visit_id,visit in visits.items():
                source=visit['source'];expected=f'{source["cups"]} model cups'
                label=p.locator(f'[data-water-resume="{visit_id}"]').text_content()
                remove_label=p.locator(f'[data-water-delete="{visit_id}"]').text_content()
                ok(expected in label and source['question']['prompt'] in label, 'visit selector distinguishes frozen request and tray size '+visit_id)
                ok(expected in remove_label and source['question']['prompt'] in remove_label, 'removal control names frozen request and tray size '+visit_id)
                repeated=source['id'] in seen_sources
                ok(('revisit of '+seen_sources[source['id']] in label) if repeated else 'revisit of' not in label, 'revisit metadata names only the same frozen source '+visit_id)
                seen_sources.setdefault(source['id'],visit_id)
            p.goto(base+'#notes');p.locator('.water-notes > summary').click()
            note_labels=p.locator('.water-notes > section > h3').all_text_contents()
            ok(len(note_labels)==16, 'notes expose all sixteen saved visitor identities')
            ok(p.locator('.water-notes h1,.water-notes h2').count()==0 and p.locator('.water-notes > section > h4').count()==16, 'notebook headings nest kept sections below their visit headings')
            ok(p.locator('.water-notes .water-saved-graph').evaluate_all("xs=>xs.length>0&&xs.every(x=>x.firstElementChild.tagName==='H6')"), 'saved graph headings remain below kept-diagram notebook headings')
            for label,(visit_id,visit) in zip(note_labels,visits.items()):
                ok(f'{visit["source"]["cups"]} model cups' in label and visit['source']['question']['prompt'] in label, 'notes distinguish source scale and request '+visit_id)
            go(p,base)
            ok(root(p)['visits']==visits, 'notes preserve exact visit metadata and histories')
            disposable=root(p)['current'];serial=root(p)['nextSerial'];dialogs=[]
            snapshot=book(p);p.once('dialog',lambda d:(dialogs.append(d.message),d.dismiss()));click(p,f'[data-water-delete="{disposable}"]')
            ok(book(p) == snapshot, 'canceled visit removal preserves exact notebook')
            source=visits[disposable]['source']
            ok(f'{source["cups"]} model cups' in dialogs[0] and source['question']['prompt'] in dialogs[0], 'removal confirmation names the selected frozen request and scale')
            p.once('dialog',lambda d:d.accept());click(p,f'[data-water-delete="{disposable}"]')
            ok(disposable not in root(p)['visits'] and root(p)['nextSerial'] == serial, 'confirmed readable removal does not reuse allocation counter')
            bounds(p)
        finally:
            c.close()



def reader_sources(browser, base):
    for width in [320,820]:
        c,p=setup(browser,width,fixtures['resumable'])
        try:
            go(p,base)
            ok(p.locator('[data-water-panel="source"]').count()==0, 'unselected visit preview has no borrowed source-panel state')
            click(p,'[data-water-resume="water-0"]')
            ok(p.locator('[data-water-panel="source"]').evaluate('x=>x.open'), 'Resume from preview opens its frozen source tables by default')
            ok(p.locator('.water-source table').first.is_visible(), 'resumed source table is visibly open without test intervention')
        finally:
            c.close()
        for family,cups,reservoir in [('other-share',100,'other'),('underground',200,'ground')]:
            c,p=setup(browser,width)
            try:
                go(p,base)
                p.locator('[data-water-family]').first.evaluate("x=>x.closest('details').open=true")
                p.locator('[data-water-family]').first.select_option(family)
                p.locator('[data-water-cups]').first.select_option(str(cups))
                click(p,'[data-water-chosen-start]');turn(p,'reader')
                frozen=copy.deepcopy(work(p)['source']);q=frozen['question']
                ok(work(p)['help']['concept'] == [] and work(p)['help']['reading'] == [], 'direct Reader starts without invented source-card support')
                panel=p.locator('.water-source [data-water-panel="reservoirs"]')
                if not panel.evaluate('x=>x.open'):
                    panel.locator(':scope > summary').click()
                control=panel.locator(f'[data-water-help="card-{reservoir}"]')
                ok(control.count() == 1 and control.is_visible(), 'reader can reach its reservoir card in persistent frozen source '+family)
                control.click()
                card=next(card for card in frozen['cards'] if card['id']==reservoir)
                ok(card['text'] in p.locator('.water-source').inner_text(), 'reader reveals exact frozen reservoir explanation without visiting Meet '+family)
                support={'forId':q['id'],'kind':'card-'+reservoir}
                ok(support in work(p)['help']['concept'], 'source card request commits to this reader before response '+family)
                click(p,f'[data-water-answer="{q["key"]}"]')
                answer=work(p)['answer']['first']
                ok(answer['outcome']=='fits' and support in answer['helpBefore']['concept'], 'reader answer freezes prior source-card support '+family)
                detail_id='row-fresh-other' if reservoir=='other' else 'row-fresh-ground'
                detail=p.locator(f'.water-source [data-water-panel="{detail_id}"]')
                if not detail.evaluate('x=>x.open'):
                    detail.locator(':scope > summary').click()
                row=next(row for v in frozen['views'] if v['id']=='fresh' for row in v['rows'] if row['id']==reservoir)
                ok(row['detail'] in detail.inner_text(), 'frozen row explanation available beside reader '+family)
                bounds(p)
                p.screenshot(path=str(OUT/f'reader-source-{family}-{width}.png'),full_page=True)
            finally:
                c.close()


def retained_preview(browser, base):
    seed=copy.deepcopy(fixture)
    seed['garden']={'avatar':'sky','guide':'synthetic-future-guide','visits':[{'id':'synthetic-future','drafts':{'retained':'exact pending words'}}],'current':'synthetic-future','seen':['synthetic-future-node'],'observations':[{'future':'retained original'}]}
    seed['baseline']['draft']={'questionId':'groups','attempts':[],'input':'synthetic pending check-in'}
    c,p=setup(browser,320,seed)
    try:
        go(p,base);ok(book(p) == seed, 'water preview preserves every foreign root without normalization')
        start(p);turn(p,'build');quantity(p,'fresh',0);click(p,'[data-water-keep]')
        got=book(p);got.pop('waterShares')
        ok(got == seed, 'water mutations preserve future garden, baseline and parcel roots exactly')
        ok(book(p)['postOffice']['visits'][0]['packing']['input'] == '17', 'waiting parcel input remains exact')
        held=book(p);owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
        click(p,'#explorer-switch');click(p,f'[data-select-explorer="{owner}"]');p.locator('[data-water-root]').wait_for()
        ok(book(p) == held and p.locator('.welcome-film').count() == 0, 'existing explorer selection causes no film or foreign initialization')
        click(p,'#explorer-switch');click(p,'#explorer-new');click(p,'#explorer-create');p.locator('[data-water-root]').wait_for()
        ok(p.locator('.welcome-film').count() == 0, 'new explorer creation on water route causes no film')
        ok('welcomeFilmSeen' not in book(p).get('garden',{}), 'fresh explorer has no unrelated film flag')
        old=p.evaluate("id=>JSON.parse(localStorage.getItem('number-garden-v1:'+id))",owner)
        ok(old == held, 'fresh explorer creation preserves original water and foreign work exactly')
    finally:
        c.close()



def retained_history(browser, base):
    c,p=setup(browser,320,fixtures['malformed'])
    try:
        go(p,base);raw=copy.deepcopy(work(p)['answer'])
        turn(p,'kept')
        ok(p.locator('.water-kept-diagram').count() == 1, 'malformed diagram does not hide healthy sibling')
        counts=p.locator('[data-water-history-count="keeps"]').inner_text()
        ok('1 readable of 2 retained' in counts and '1 unreadable record' in counts and 'count toward this limit' in counts, 'keeps show raw retained count and unreadable capacity use')
        turn(p,'reader');before=book(p)
        click(p,'[data-water-answer="a"]')
        ok(book(p) == before and work(p)['answer'] == raw, 'malformed response retained exactly and cannot silently extend')
        turn(p,'build')
        p.locator('[data-water-panel="checks"] > summary').click()
        counts=p.locator('[data-water-history-count="checks"]').inner_text()
        ok('1 readable of 2 retained' in counts and '1 unreadable record' in counts and 'count toward this limit' in counts, 'checks show raw retained count and unreadable capacity use')
        quantity(p,'fresh',0);click(p,'[data-water-check]');click(p,'[data-water-keep]')
        ok(work(p)['checks'][0] == {'synthetic':'unreadable original check'} and work(p)['kept'][0] == {'synthetic':'unreadable original diagram'}, 'healthy graph edits retain unreadable historical entries')
        saved=copy.deepcopy(root(p));exported=download(p,base)
        ok(exported['waterShares'] == saved, 'actual download retains malformed raw records and sibling visits')
        bring(p,base,exported)
        ok(root(p) == saved, 'actual import roundtrip preserves malformed water histories')
        start(p);turn(p,'reader');q=work(p)['source']['question'];click(p,f'[data-water-answer="{q["key"]}"]')
        ok(work(p)['answer']['first']['outcome'] == 'fits', 'healthy new visitor remains answerable')
        ok(root(p)['visits'][saved['current']] == saved['visits'][saved['current']], 'new visitor leaves earlier malformed visit exact')
    finally:
        c.close()
    c,p=setup(browser,320,fixtures['foreign'])
    try:
        go(p,base);turn(p,'reader');before=copy.deepcopy(work(p)['answer'])
        notice=p.locator('[data-water-retained-response="first"]').inner_text()
        ok('another frozen source' in notice and 'does not answer' in notice, 'foreign-source saved answer is visibly marked as retained and irrelevant to current request')
        ok('Retained first response' in p.locator('.water-saved-answer').inner_text(), 'foreign answer keeps its original request and retained label')
        turn(p,'build');fill_source(p);click(p,'[data-water-keep]')
        ok(work(p)['kept'][-1]['fulfilled'] is False and work(p)['answer']==before, 'foreign fitting reply cannot fulfill or be rewritten by current graph work')
    finally:
        c.close()
    c,p=setup(browser,820,fixtures['old'])
    try:
        go(p,base);before=copy.deepcopy(work(p)['source'])
        turn(p,'build')
        ok(p.locator('[data-water-view]').count() == 1 and p.locator('[data-water-quantity]').count() == 2, 'retired smaller source opens source-owned views and rows')
        graph_matches(p)
        ok('earlier named water set' in p.locator('[data-water-whole]').inner_text(), 'retired whole wording retained')
        ok('Earlier check feedback retained exactly' in p.locator('[data-water-outcome]').inner_text(), 'old check feedback displayed without regrading')
        turn(p,'kept')
        ok('Earlier kept feedback retained exactly' in p.locator('.water-kept-diagram').inner_text(), 'old kept feedback displayed without regrading')
        p.locator('.water-kept-diagram details').evaluate_all('xs=>xs.forEach(x=>x.open=true)')
        ok('not observed' in p.locator('.water-kept-diagram').inner_text().lower(), 'missing old support remains unobserved')
        ok('Source-table availability was not recorded' in p.locator('.water-kept-diagram').inner_text(), 'missing earlier table observation stays unrecorded')
        turn(p,'reader')
        ok(p.locator('[data-water-answer]').count() == 2 and p.locator('#water-question-heading').inner_text() == 'Earlier reader question retained exactly', 'retired question count and wording retained')
        click(p,'[data-water-answer="a"]')
        ok(work(p)['answer']['first']['outcome'] == 'fits' and 'helpBefore' not in work(p)['answer']['first'], 'retired key used without inventing old support observation')
        click(p,'[data-water-help="hint"]')
        ok(work(p)['help']['observed'] is False, 'later help does not invent earlier observation')
        click(p,'[data-water-answer="a"]')
        latest=work(p)['answer']['latest']
        ok(latest['helpBefore']['observed'] is False and {'forId':'earlier-reader','kind':'hint'} in latest['helpBefore']['concept'], 'old-source retry freezes known later help without inventing unknown past')
        p.locator('.water-saved-answer').last.locator('details').evaluate_all('xs=>xs.forEach(x=>x.open=true)')
        ok('Earlier support was unobserved' in p.locator('.water-saved-answer').last.inner_text() and 'concept requests hint' in p.locator('.water-saved-answer').last.inner_text(), 'retired answer shows both unobserved past and known later support')
        ok(p.locator('[data-water-help="percent"]').count() == 0, 'retired source without percent copy receives no current wording fallback')
        ok(work(p)['source'] == before, 'retired source never refreshed from current catalog')
        click(p,'.water-question [data-speak]')
        ok('Earlier reader question retained exactly' in p.evaluate('window.__waterSpoken.at(-1).text'), 'speech uses frozen retired question')
        turn(p,'meet');click(p,'[data-water-help="card-earlier-reservoir"]')
        ok('Earlier original picture description retained exactly' in p.locator('.water-card-copy').inner_text() and p.locator('.water-card-copy svg').count() == 0, 'unknown retired reservoir keeps its own picture description without current category art fallback')
        bounds(p);p.screenshot(path=str(OUT/'retired-source-820.png'),full_page=True)
    finally:
        c.close()
    c,p=setup(browser,820,fixtures['odd'])
    try:
        go(p,base);turn(p,'build');graph_matches(p)
        ok([text for text in p.locator('.water-axis span').all_text_contents() if text] == ['0','10½'], 'retired odd half-unit whole omits unrepresentable quarter-cup midpoint')
        bounds(p)
    finally:
        c.close()


def unknown_root(browser, base):
    seed=copy.deepcopy(fixture);seed['waterShares']={'version':91,'current':'future','future':{'synthetic':'kept exactly'}}
    c,p=setup(browser,320,seed)
    try:
        go(p,base);ok(book(p) == seed, 'unknown water root opens without normalization')
        if p.locator('[data-water-start]').count():
            start(p);ok(book(p) == seed, 'unknown root remains read-only on start')
        exported=download(p,base)
        ok(exported['waterShares'] == seed['waterShares'], 'unknown root remains exactly exportable')
        bring(p,base,exported)
        ok(root(p) == seed['waterShares'], 'real notebook import preserves unknown root')
    finally:
        c.close()


if __name__ == '__main__':
    server=None
    base=os.environ.get('H2O_TEST_URL')
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
                settings(browser,base)
                reader_sources(browser,base)
                retained_preview(browser,base)
                retained_history(browser,base)
                unknown_root(browser,base)
                ok(not errors,'no browser page errors: '+str(errors))
                print(f'Hundred Cups Chrome: {checks} assertions passed; screenshots {OUT}')
            finally:
                browser.close()
    finally:
        if server:
            server.shutdown();server.server_close()
