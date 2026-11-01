"""Synthetic296 native Chrome journeys; no app-module interception.

MAP_READING_TEST_URL optionally selects the deployed app. Local storage contains
only synthetic notebooks. Browser evidence is not physical iPad/Safari, audible
speech, screen-reader announcements or learning-effect proof.
"""
import sys
sys.dont_write_bytecode=True
import copy,functools,http.server,importlib.util,json,os,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('MAP_READING_ARTIFACTS',tempfile.mkdtemp(prefix='map-reading-')));OUT.mkdir(parents=True,exist_ok=True)
os.environ['RHYTHM_ARTIFACTS']=str(OUT)
spec=importlib.util.spec_from_file_location('native_helpers',ROOT/'test/rhythm-browser.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
ROUTE='#workshop/old-map'
def sel(a):return f'[data-map-action="{a}"]'
def click(p,a):h.click(p,sel(a))
def step(p,i):h.click(p,sel('step')+f'[data-map-index="{i}"]')
def book(p):return h.book(p)
def current(p):return book(p)['mapReading'][-1]
def other(s):return {k:v for k,v in s.items() if k!='mapReading'}
def field(p,key):return p.locator(f'[data-map-field="{key}"]')
def setup(browser,base,seed,width,label,height=1000):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True);h.contexts.append(c)
    c.add_init_script('(seed=>{if(!localStorage.getItem("map-fixture")){const p={id:"explorer-1",avatar:"sky",color:"gold",symbol:"leaf",createdAt:"2026-10-29T12:00:00.000Z"};localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:p.id,explorers:[p]}));localStorage.setItem("number-garden-v1:"+p.id,JSON.stringify(seed));localStorage.setItem("map-fixture","1");}})('+json.dumps(seed)+')')
    p=c.new_page();h.pages.append((p,label));p.set_default_timeout(12000)
    p.on('pageerror',lambda e:h.errors.append({'case':label,'error':str(e)}))
    p.on('console',lambda e:h.console_errors.append({'case':label,'error':e.text}) if e.type=='error' else None)
    h.go(p,base,ROUTE,'[data-map-root]');return c,p
def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
    bad=p.locator('[data-map-root] button,[data-map-root] a,[data-map-root] summary').evaluate_all('xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().width<44||x.getBoundingClientRect().height<44)).map(x=>({text:x.textContent,w:x.offsetWidth,h:x.offsetHeight}))')
    h.ok(not bad,'44px controls: '+str(bad))
    h.ok(p.locator('textarea').evaluate_all('xs=>xs.every(x=>parseFloat(getComputedStyle(x).fontSize)>=16)'),'16px editable text')
def focused(p,selector):h.ok(p.locator(selector).evaluate('x=>document.activeElement===x'),'focus '+selector)
def reload(p):
    identity=h.active(p);p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():h.click(p,f'[data-select-explorer="{identity}"]')
    p.locator('[data-map-root]').wait_for()
def tools(p):
    d=p.locator('.map-tools')
    if d.get_attribute('open') is None:d.locator('summary').click()
def download(p,label):
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
    h.ok('Reading the old map' in p.locator('main').inner_text(),'Notes registers map owner')
    with p.expect_download() as event:h.click(p,'#download')
    path=OUT/(label+'.json');event.value.save_as(path);return path,json.loads(path.read_text())
def journey(browser,base,f,width,height):
    c,p=setup(browser,base,f['base'],width,f'journey-{width}',height)
    before=book(p);h.ok('mapReading' not in before,'entry does not initialize owner');h.ok(before==f['base'],'entry does not initialize legacy destinations')
    click(p,'start');h.ok(current(p)['source']['original']==f['source']['original'],'actual frozen original');h.ok(other(book(p))==other(before),'Start only owns mapReading: '+str({k:[other(before).get(k),other(book(p)).get(k)] for k in set(other(before))|set(other(book(p))) if other(before).get(k)!=other(book(p)).get(k)}));focused(p,'#map-status');bounds(p);p.screenshot(path=str(OUT/f'copy-{width}.png'),full_page=True)
    field(p,'line/valley').fill('The valley, drawn in my second year of keeping.')
    h.ok(current(p)['lines']==[],'typing is unsent')
    step(p,1);field(p,'gap/water-release/proposal').fill('<sunrise & rain>');field(p,'gap/water-release/reason').fill('A possible reading, not recovered ink.')
    h.ok('<sunrise & rain>' in p.locator('[data-map-hypothesis]').inner_text(),'hypothesis literal text preview');h.ok(p.locator('[data-map-hypothesis] script').count()==0,'no HTML interpretation')
    h.ok('[smudged word]' in p.locator('.map-source-strip').inner_text(),'source gap stays unchanged')
    click(p,'save-gap');h.ok(current(p)['gaps'][0]['proposal']=='<sunrise & rain>','no keyed marking');focused(p,'#map-status')
    h.click(p,sel('gap')+'[data-map-index="1"]');h.ok(field(p,'gap/walking-measure/proposal').input_value()=='','blank hypothesis allowed');click(p,'save-gap');h.ok(current(p)['gaps'][1]['proposal']=='','blank proposal explicitly kept')
    step(p,0);h.ok(field(p,'line/valley').input_value()=='The valley, drawn in my second year of keeping.','pending copy survives step changes');click(p,'side');h.ok(p.locator('[data-map-side-copy]').inner_text()==field(p,'line/valley').input_value(),'actual pending side-by-side text');h.ok(current(p)['lines']==[],'support does not submit text');click(p,'save-line');h.ok(current(p)['lines'][0]['supportBefore']['comparison'],'submission snapshots support')
    saved=copy.deepcopy(book(p));click(p,'save-line');h.ok(book(p)==saved,'identical explicit write is no-op')
    p.locator('.map-source summary').click();h.click(p,sel('source')+'[data-map-source="short"]');focused(p,'#map-source-title');h.ok(f['source']['short'] in p.locator('.map-source').inner_text(),'frozen short retelling');step(p,2);h.ok(p.locator('.map-source').get_attribute('open') is not None,'drawer stays open');field(p,'comparison').fill('Pip adds today’s orchard context.');click(p,'save-comparison')
    tools(p);click(p,'example');h.ok('not your map' in p.locator('main').inner_text(),'example ownership persistent')
    for i in range(3):click(p,'example-next');h.ok('not your map' in p.locator('main').inner_text(),'example label each part')
    click(p,'close-example');focused(p,sel('example'));h.ok(current(p)['support']['example'],'example exposure recorded');click(p,'together')
    step(p,3);field(p,'note').fill('The writer’s scale is incomplete. Seek another source.');click(p,'save-note');h.ok(current(p)['note']['supportBefore']['example'],'note records prior help')
    field(p,'note').fill('Unsent revision not in edition');click(p,'preview');h.ok('unsent words' in p.locator('main').inner_text(),'confirmation warns about unsent writing');h.ok('Unsent revision not in edition' not in p.locator('.map-edition').inner_text(),'preview only saved writing')
    click(p,'cancel-confirm');h.ok(field(p,'note').input_value()=='Unsent revision not in edition','confirmation preserves unsent text');click(p,'save-note');click(p,'preview');click(p,'confirm');h.ok(current(p)['kept']['note']['text']=='Unsent revision not in edition','explicit confirmed immutable edition')
    h.ok(p.locator('textarea,[data-speak]').count()==0,'kept view no mutation or narration controls');p.screenshot(path=str(OUT/f'kept-{width}.png'),full_page=True);old=copy.deepcopy(current(p));click(p,'revise');h.ok(current(p)['revisedFrom']==old['id'],'revision identity');h.ok(book(p)['mapReading'][0]==old,'old edition unchanged');h.ok('revisit' in p.locator('#map-status').inner_text(),'revision labelled revisit');bounds(p)
    reload(p);h.ok(p.locator(sel('open')).count()==2,'reload explicit chooser');click(p,'open');h.ok('Kept edition' in p.locator('#map-heading').inner_text(),'kept reload');click(p,'choose');h.click(p,sel('open')+'[data-map-id="map-reading-2"]');h.ok(field(p,'line/valley').input_value()==old['lines'][0]['text'],'revision reopens saved copy')
    field(p,'line/valley').fill('Exit draft');h.click(p,'[data-map-root] a[href="#workshop"]');p.locator('.map-leave').wait_for();h.click(p,'[data-map-leave="stay"]');h.ok(field(p,'line/valley').input_value()=='Exit draft','Stay preserves writing');h.click(p,'[data-map-root] a[href="#workshop"]');h.click(p,'[data-map-leave="keep"]');p.locator('[data-map-root]').wait_for(state='detached');h.ok(book(p)['mapReading'][1]['lines'][0]['text']=='Exit draft','Keep and continue explicitly submits before route exit')
    p.evaluate('location.hash="'+ROUTE+'"');p.locator(sel('open')).first.wait_for();h.click(p,sel('open')+'[data-map-id="map-reading-2"]');field(p,'line/valley').fill('Discarded exit draft');p.evaluate('location.hash="#notes"');p.locator('.map-leave').wait_for();h.ok(p.evaluate('location.hash')==ROUTE,'hash departure restored while asking');h.click(p,'[data-map-leave="leave"]');p.locator('#download').wait_for();h.ok(book(p)['mapReading'][1]['lines'][0]['text']=='Exit draft','Leave does not submit')
    p.evaluate('location.hash="'+ROUTE+'"');p.locator(sel('open')).first.wait_for();h.click(p,sel('open')+'[data-map-id="map-reading-2"]');field(p,'line/valley').fill('Explorer switch draft');h.click(p,'#explorer-switch');p.locator('.map-leave').wait_for();h.click(p,'[data-map-leave="stay"]');h.ok(field(p,'line/valley').input_value()=='Explorer switch draft','explorer switch guarded');click(p,'save-line')
    path,report=download(p,f'notes-{width}');h.ok(report['mapReading']==book(p)['mapReading'],'actual Notes export owner');h.ok(report['syntheticOther']==f['base']['syntheticOther'],'large unrelated sibling unchanged')
    original_explorer=h.active(p);original_owner=copy.deepcopy(book(p)['mapReading']);p.locator('#progress-file').set_input_files(str(path));p.locator('#progress-import-preview').wait_for();h.click(p,'#progress-import-confirm');p.wait_for_function('old=>JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId!==old',arg=original_explorer);h.ok(h.active(p)!=original_explorer,'actual import creates separate explorer')
    # Reload actual imported explorer before redownloading.
    identity=h.active(p);p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for();
    if p.locator(f'[data-select-explorer="{identity}"]').count():h.click(p,f'[data-select-explorer="{identity}"]')
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for();h.ok(h.active(p)==identity,'imported explorer persists')
    with p.expect_download() as event:h.click(p,'#download')
    again=OUT/f'redownload-{width}.json';event.value.save_as(again);r=json.loads(again.read_text());h.ok(r['mapReading']==report['mapReading'],'download/import/reload/redownload exact owner');h.ok(r['syntheticOther']==report['syntheticOther'],'large sibling roundtrip');h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{original_explorer}"]');h.ok(book(p)['mapReading']==original_owner,'original explorer unchanged by import')
    c.close()
def edges(browser,base,f):
    c,p=setup(browser,base,f['locked'],820,'locked');h.ok(p.locator(sel('start')).count()==0,'unrevealed page cannot start');h.ok('mapReading' not in book(p),'locked entry no owner');h.ok(p.locator('a[href="#arrive"]').count()==1,'independent later entry offered')
    h.click(p,'a[href="#arrive"]');p.locator('[data-arrival-root]').wait_for();h.click(p,'[data-arrival-choice="mended"]');h.click(p,'[data-arrival-join]');p.evaluate('location.hash="#almanac/keepers"');p.locator('[data-keeper-reveal]').wait_for();h.click(p,'[data-keeper-reveal]');h.ok(book(p)['story']['acts']=={},'actual later arrival and reading invent no act completion');p.evaluate('location.hash="'+ROUTE+'"');p.locator(sel('start')).wait_for();story=copy.deepcopy(book(p)['story']);click(p,'start');h.ok(book(p)['story']==story,'Start after actual reveal consumes context only');c.close()
    for name in ['historical','damaged','duplicate','future']:
        c,p=setup(browser,base,f[name],820,name)
        if name=='future':h.ok(p.locator(sel('start')).count()==0,'future owner retained')
        else:
            click(p,'open');h.ok(p.locator('[data-map-root]').count()==1,'readable neighbor opens '+name)
            if name=='historical':h.ok(p.locator('.map-source-strip').inner_text().endswith('Earlier source [lost].'),'earlier own source');field(p,'line/earlier/line').fill('Earlier text stays literal.');click(p,'save-line');h.ok(current(p)['lines'][0]['text']=='Earlier text stays literal.','earlier IDs, no current key');step(p,1);field(p,'gap/earlier/gap/proposal').fill('Earlier own proposal');field(p,'gap/earlier/gap/reason').fill('Earlier own reason');click(p,'save-gap');h.ok(current(p)['gaps'][0]['gapId']=='earlier/gap','historical slash IDs preserved');h.ok(current(p)['gaps'][0]['reason']=='Earlier own reason','historical gap reason preserved')
            if name=='damaged':h.ok(p.locator(sel('revise')).count()==1,'readable kept survives damaged draft/story');click(p,'revise');h.ok(p.locator('textarea').count()==1,'damaged kept can revise')
        c.close()
    c,p=setup(browser,base,f['overflow'],820,'overflow');click(p,'open');tools(p);before=book(p);click(p,'example');h.ok('ready to download' in p.locator('#map-status').inner_text(),'help report preflight refusal');h.ok(p.locator(sel('close-example')).count()==0,'refused help not exposed');h.ok(book(p)==before,'refused support no write');p.locator('[data-map-root] [data-speak]').click();h.ok(p.locator('[data-map-root] [data-speak]').get_attribute('data-speak')=='','refused narration blocks connected bubble handler');h.ok(book(p)==before,'refused narration unchanged');c.close()
    c,p=setup(browser,base,f['base'],820,'save-fault');click(p,'start');p.evaluate('()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith("number-garden-v1:"))throw new DOMException("Synthetic quota fault","QuotaExceededError");return native.call(this,k,v)}}');field(p,'line/valley').fill('Session-only words');click(p,'save-line');h.ok('could not be saved' in p.locator('#map-status').inner_text(),'save failure no false success');h.ok(field(p,'line/valley').input_value()=='Session-only words','save failure retains in-memory writing');tools(p);p.locator('[data-map-root] [data-speak]').click();h.ok(bool(p.locator('[data-map-root] [data-speak]').get_attribute('data-speak')),'first Hear still prepares narration when support is kept in memory but device saving fails');c.close()
    c,p=setup(browser,base,f['base'],820,'pagination')
    for i in range(8):
        click(p,'start');tools(p);click(p,'choose')
    h.ok(p.locator(sel('open')).count()==6,'chooser paginates six raw rows');click(p,'pages-next');h.ok(p.locator(sel('open')).count()==2,'second chooser page');h.click(p,sel('open')+'[data-map-id="map-reading-8"]');h.ok(p.locator('textarea').count()==1,'late edition reopens');c.close()

def interfaces(browser,base,f):
    c,p=setup(browser,base,f['base'],820,'interfaces');click(p,'start');tools(p);p.locator('[data-map-root] [data-speak]').click();source=current(p)['source'];spoken=p.locator('[data-map-root] [data-speak]').get_attribute('data-speak');h.ok(source['limitation'] not in spoken,'closed source limitation excluded from narration');h.ok(source['teaching']['copySupport'] not in spoken,'closed copy help excluded from narration');h.ok(source['original'].replace('[smudged word]','a smudged word') not in spoken,'closed full original excluded from narration');p.locator('.map-source summary').click();p.locator('[data-map-root] [data-speak]').click();h.ok(source['original'].replace('[smudged word]','a smudged word') in p.locator('[data-map-root] [data-speak]').get_attribute('data-speak'),'opened source included in narration');p.locator('.map-source summary').click()
    button=p.locator(sel('step')+'[data-map-index="1"]');button.focus();p.keyboard.press('Enter');focused(p,'#map-heading');h.ok('Missing words'==p.locator('#map-heading').inner_text(),'native keyboard step activation')
    field(p,'gap/water-release/proposal').fill('Private hypothesis text');privacy_before=book(p);h.click(p,'#privacy-button');p.locator('#about-dialog[open]').wait_for();h.ok(p.locator('.map-leave').count()==0,'privacy opens without leaving or discarding pending writing');h.click(p,'#about-dialog form button');h.ok(field(p,'gap/water-release/proposal').input_value()=='Private hypothesis text','privacy preserves unsent hypothesis');h.ok(book(p)==privacy_before,'privacy does not write notebook');tools(p);p.locator('[data-map-root] [data-speak]').click();words=p.locator('[data-map-root] [data-speak]').get_attribute('data-speak');h.ok('a smudged word' in words,'existing spoken marker convention');h.ok('Private hypothesis text' not in words,'hypothesis never spoken as source');h.ok(current(p)['support']['narration'],'narration requested record, not audibility')
    # Old connected controls must become inert after an explicit route exit.
    field(p,'gap/water-release/proposal').fill('');p.evaluate('window.__departedMap=document.querySelector("[data-map-action=save-gap]")');p.evaluate('location.hash="#notes"');p.locator('#download').wait_for();before=book(p);p.evaluate('window.__departedMap.click()');h.ok(book(p)==before,'departed control inert')
    p.locator('#remember').uncheck();h.ok('lasts only while this page stays open' in p.locator('[data-saving-status]').inner_text(),'actual saving off control');p.evaluate('location.hash="'+ROUTE+'"');p.locator(sel('open')).first.wait_for();click(p,'open');step(p,3);field(p,'note').fill('Temporary session writing');click(p,'save-note');h.ok('Saving is off' in p.locator('#map-status').inner_text(),'temporary session copy truthful');path,report=download(p,'temporary-notes');h.ok(report['mapReading'][0]['note']['text']=='Temporary session writing','saving-off actual download retains session writing');c.close()

def fixtures():
    script="""import {mapReadyNotebook,mapReport,mapCanExport} from './test/map-reading-checks.mjs';import * as M from './dist/map-reading-core.mjs';import {makeMapReadingSource} from './dist/map-reading-content.mjs';import {freshState} from './dist/core.mjs';import {MAX_IMPORT_BYTES} from './dist/progress-transfer.mjs';const o={canExport:mapCanExport},base=mapReadyNotebook();base.syntheticOther.payload='x'.repeat(512*1024);const historical=mapReadyNotebook(),id=M.startMapReading(historical,o).id,p=historical.mapReading[0];p.source={id:'earlier',version:9,title:'Earlier map',notice:'Earlier fiction',limitation:'Earlier limit',original:'Earlier source [lost].',short:'Earlier short',longer:'Earlier longer',lines:[{id:'earlier/line',text:'Earlier source [lost].'}],gaps:[{id:'earlier/gap',lineId:'earlier/line'}]};const damaged=mapReadyNotebook(),d=M.startMapReading(damaged,o).id;M.keepMapEdition(damaged,d,o);damaged.mapReading[0].lines=false;damaged.mapReading[0].support=false;damaged.story={version:99};const duplicate=structuredClone(damaged);duplicate.mapReading.push({id:'map-reading-50',future:true},{id:'map-reading-50',future:true});const future={...mapReadyNotebook(),mapReading:{version:99}};const overflow=mapReadyNotebook();M.startMapReading(overflow,o);overflow.syntheticOther.payload='';const rb=Buffer.byteLength(JSON.stringify(overflow,null,2)),nb=Buffer.byteLength(JSON.stringify(mapReport(overflow),null,2));overflow.syntheticOther.payload='x'.repeat(MAX_IMPORT_BYTES-rb-Math.floor((nb-rb)/2));console.log(JSON.stringify({base,locked:freshState(),historical,damaged,duplicate,future,overflow,source:makeMapReadingSource()}));"""
    # Match the existing explorer store's minimal avatar metadata. The core
    # separately tests absent garden roots; locked entry below stays uninitialized.
    script=script.replace('mapReadyNotebook()','ready()').replace('const o=',"const ready=()=>({...mapReadyNotebook(),garden:{avatar:'sky'}});const o=")
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))
def main():
    f=fixtures()
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*args):pass
    class Server(http.server.ThreadingHTTPServer):request_queue_size=128;daemon_threads=True
    server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=os.environ.get('MAP_READING_TEST_URL',f'http://127.0.0.1:{server.server_port}/').rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args=['--disable-quic'])
        try:
            for width,height in [(320,900),(820,1180),(1024,768)]:journey(browser,base,f,width,height)
            edges(browser,base,f);interfaces(browser,base,f)
            h.ok(not h.errors,'no page errors '+str(h.errors));h.ok(not h.console_errors,'no console errors '+str(h.console_errors))
            result={'status':'passed','checks':h.checks,'limits':'Native Chrome only; not physical iPad/Safari, audible speech, screen-reader announcements or learning effects'};(OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
        except Exception:
            for p,label in h.pages:
                try:p.screenshot(path=str(OUT/f'failure-{label}.png'),full_page=True)
                except Exception:pass
            raise
        finally:browser.close();server.shutdown()
if __name__=='__main__':main()
