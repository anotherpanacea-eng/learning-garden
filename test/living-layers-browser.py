"""Native376 selected parts, neutral drafts, frozen guides and actual Notes.

Invented notebooks only. One820px touch/keyboard journey plus320/1024 samples;
separate report-limit, quota and saving-off probes. Chromium emulation does not
qualify physical devices, Safari, VoiceOver, audible speech or learning.
"""
import sys
sys.dont_write_bytecode = True
import copy
import functools
import http.server
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('LAYERS_ARTIFACTS', tempfile.mkdtemp(prefix='living-layers-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('layers_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h
ROUTE = '#living/layers'


def enter(p, base):
    h.go(p, base, ROUTE, '[data-ll-root]')


def turn(p, n):
    h.click(p, f'[data-ll-turn="{n}"]')


def choose(p, case):
    control = p.locator(f'[data-ll-case="{case}"]')
    control.evaluate('e=>{for(let a=e.parentElement;a;a=a.parentElement)if(a.tagName==="DETAILS")a.open=true}')
    control.click()


def order(p):
    return p.locator('[data-ll-order]').first.text_content()


def fold(p, name):
    control=p.locator(f'[data-ll-fold="{name}"]')
    control.evaluate('e=>{const d=e.matches("details")?e:e.closest("details");if(d)d.open=true}')


def detach(p, selector):
    e=p.locator(selector).first.element_handle()
    e.evaluate('e=>e.remove()')
    return e


def dispatch(e):
    e.evaluate('e=>e.dispatchEvent(new Event("click",{bubbles:true,cancelable:true}))')


def focus_is(p, selector):
    return p.locator(selector).evaluate('e=>e===document.activeElement')


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal page overflow')
    bad=p.locator('[data-ll-root] button,[data-ll-root] a,[data-ll-root] summary,[data-ll-root] select').evaluate_all('''xs=>xs.filter(e=>e.getClientRects().length&&(e.getBoundingClientRect().width<44||e.getBoundingClientRect().height<44||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,font:getComputedStyle(e).fontSize}))''')
    h.ok(not bad, '44px targets and16px text: '+str(bad))


def guides(p):
    return h.book(p)['layerGuides']


def camera(p):
    return p.locator('[data-ll-camera][aria-pressed="true"]').get_attribute('data-ll-camera')


def main():
    fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',r'''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {layerSource,newLayerWork} from './dist/living-layers-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={payload:'Invented sibling retained exactly'};
const historical=[];
for(const count of [2,6]){
 const source=layerSource('heart');source.id='earlier-'+count;source.title='Earlier <path> & '+count;
 source.nodes=count===2?[source.nodes[4],source.nodes[1]]:[...source.nodes,structuredClone(source.nodes[0])];
 if(count===6)source.nodes[5].id='sixth"node]';
 source.nodes.forEach((n,i)=>{n.label='Earlier node '+i;n.role='Earlier frozen role '+i;});
 source.trayIds=source.nodes.map(n=>n.id).reverse();source.teaching=[{text:'Earlier hidden teaching',art:'yeast'}];
 source.futureSource={kept:true};const work=newLayerWork(source);work.order=[source.nodes[0].id];work.futureWork={kept:[1,2]};
 historical.push({id:'layer-guide-'+(80+count),source,work,futureOuter:{originalOnly:true}});
}
console.log(JSON.stringify({base,historical,maxImportBytes:MAX_IMPORT_BYTES}));
'''],cwd=ROOT,text=True))
    server=None
    base=os.environ.get('LAYERS_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            protocol_version='HTTP/1.1'
            def log_message(self,*args):pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            _,p=native.setup(browser,fixtures['base'],'tablet')
            enter(p,base)
            before=h.book(p)
            p.screenshot(path=str(OUT/'tablet-explore.png'),full_page=True)
            h.ok(camera(p)=='h-person' and p.locator('[data-ll-larger]').is_disabled(), 'fresh heart camera starts at its own last node and stops there')
            p.locator('[data-ll-closer]').tap()
            fold(p,'others')
            h.ok(camera(p)=='h-system' and 'Blood vessels' in p.locator('[data-ll-root]').inner_text(), 'touch moves to the larger-context system and its other component')
            h.click(p,'[data-ll-camera="h-organ"]');fold(p,'others')
            text=p.locator('[data-ll-root]').inner_text()
            h.ok('Connective tissue' in text and 'Each beat starts' in text and 'pumps blood' in text, 'selected organ exposes its own role and distinct other tissues')
            h.click(p,'[data-ll-camera="h-cell"]')
            h.ok(p.locator('[data-ll-closer]').is_disabled(), 'closer camera stops at its own first node')
            h.click(p,'[data-ll-larger]')
            h.ok(camera(p)=='h-tissue' and focus_is(p,'#ll-scene-title'), 'reverse camera movement focuses live heading')
            fold(p,'help')
            for _ in range(6):h.click(p,'[data-ll-example]')
            fold(p,'help')
            h.ok('yeast' in p.locator('[data-ll-root]').inner_text().lower() and p.locator('svg[role="img"]').count()>0, 'manual help reaches illustrated single-cell counterexample')
            p.locator('[data-ll-fold="help"]').evaluate('e=>e.open=false')
            turn(p,1)
            h.ok(not p.locator('[data-ll-reference]').count(), 'source reference is absent until manual comparison')
            p.locator('[data-ll-add="h-person"]').tap()
            p.locator('[data-ll-add="h-cell"]').focus();p.keyboard.press('Enter')
            h.ok('A person' in order(p) and order(p).index('A person')<order(p).index('Cardiac muscle cell'), 'touch and keyboard make deliberately scrambled order')
            h.ok(not any(x in order(p) for x in ['is part of','includes']), 'scrambled child text uses neutral numbered positions')
            h.click(p,'[data-ll-hear]')
            spoken=p.locator('[data-ll-hear]').get_attribute('data-speak') or ''
            h.ok('A person' in spoken and 'Cardiac muscle cell' in spoken and 'is part of' not in spoken and 'includes' not in spoken and p.locator('.speech-controls').is_visible(), 'real Hear narrates scrambled draft without biological connectors')
            prior=order(p);p.locator('[data-ll-direction]').select_option('whole-to-part')
            h.ok(order(p)==prior, 'direction changes intention without rearranging child cards')
            turn(p,2)
            h.ok(not p.locator('[data-ll-reference]').count(), 'Compare turn alone does not disclose source')
            h.click(p,'[data-ll-compare]')
            reference=p.locator('[data-ll-reference]').inner_text()
            h.ok(reference.index('A person')<reference.index('Cardiac muscle cell') and 'includes' in reference, 'explicit whole-to-part comparison follows frozen reference in reverse')
            turn(p,1)
            h.click(p,'[data-ll-add="h-organ"]');h.click(p,'[data-ll-earlier="h-organ"]')
            h.click(p,'[data-ll-strip-card="h-person"]');h.click(p,'[data-ll-remove="h-person"]');h.click(p,'[data-ll-later="h-organ"]')
            h.ok(order(p).index('Cardiac muscle cell')<order(p).index('Heart') and 'A person' not in order(p), 'add, adjacent moves and removal remain available after comparison')
            p.screenshot(path=str(OUT/'tablet-make.png'),full_page=True)
            bounds(p)
            h.ok(h.book(p)==before, 'all local exploration, teaching and comparison leave notebook exact')
            stale_keep=p.locator('[data-ll-keep]').element_handle()
            h.click(p,'[data-ll-keep]');dispatch(stale_keep)
            first=copy.deepcopy(guides(p)[0])
            h.ok(len(guides(p))==1 and first['work']['order']==['h-cell','h-organ'] and first['work']['comparisonShown'] and first['work']['exampleSeen']==6, 'Keep records arbitrary order and separate disclosures once')
            h.ok({k:v for k,v in h.book(p).items() if k!='layerGuides'}==before and not p.locator('[data-ll-add],[data-ll-keep],[data-ll-example]').count(), 'Keep changes only its owner and opens immutable guide')
            h.click(p,'[data-ll-copy]');turn(p,1);h.click(p,'[data-ll-add="h-person"]')
            copy_order=order(p)
            choose(p,'leaf');turn(p,0)
            h.ok(camera(p)=='l-plant', 'new leaf slot has its own last-node camera')
            h.click(p,'[data-ll-camera="l-organ"]');fold(p,'others')
            h.ok('Vascular tissue' in p.locator('[data-ll-root]').inner_text(), 'leaf selected organ explains its other tissues')
            turn(p,1);h.click(p,'[data-ll-add="l-system"]')
            choose(p,'heart');turn(p,1)
            h.ok('A person' not in order(p) and 'Heart' in order(p), 'case draft is separate from kept copy slot')
            h.click(p,'[data-ll-shelf]');h.click(p,'[data-ll-card="layer-guide-1"]');h.click(p,'[data-ll-copy]');turn(p,1)
            h.ok(order(p)==copy_order and guides(p)[0]==first, 'copy resumes its existing local slot and preserves frozen guide')
            p.screenshot(path=str(OUT/'tablet-guide.png'),full_page=True)
            h.click(p,'[data-ll-strip-card="h-person"]')
            stale_action=detach(p,'[data-ll-remove="h-person"]');stale_hear=detach(p,'[data-ll-hear]')
            stale_hear.evaluate('e=>e.dataset.speak="Detached speech sentinel"')
            h.go(p,base,'#living','main');old=h.book(p);dispatch(stale_action);dispatch(stale_hear)
            h.ok(h.book(p)==old and stale_hear.get_attribute('data-speak')=='Detached speech sentinel', 'route exit rejects detached action and speech')
            h.ok(p.locator('a[data-ll-entry][href="'+ROUTE+'"]').count()==1, 'Living Garden More rooms offers the room')
            enter(p,base);turn(p,1)
            h.ok('A person' not in order(p) and 'Cardiac muscle cell' not in order(p), 'route exit clears unkept drafts')
            exported=native.download(p,base,'tablet-export')
            h.ok(exported['layerGuides']==[first] and exported['syntheticOther']==before['syntheticOther'], 'actual Notes download preserves guide and unknown sibling')

            mixed=copy.deepcopy(exported)
            duplicate=copy.deepcopy(first);duplicate['id']='layer-guide-5'
            cards=[copy.deepcopy(first),{'id':'layer-guide-070','v':99},duplicate,copy.deepcopy(duplicate),*fixtures['historical']]
            for n in range(90,100):
                card=copy.deepcopy(first);card['id']='layer-guide-'+str(n);cards.append(card)
            cards.append({'id':'layer-guide-900','v':99,'raw':'Invented unavailable guide'})
            mixed['layerGuides']=cards
            _,q=native.setup(browser,fixtures['base'],'transfer')
            enter(q,base);original_id,original_book=h.active(q),h.book(q)
            h.go(q,base,'#notes','#progress-file')
            q.locator('#progress-file').set_input_files({'name':'invented-guides.json','mimeType':'application/json','buffer':json.dumps(mixed).encode()})
            q.locator('#progress-import-confirm').wait_for()
            h.ok('Living Layers' in q.locator('.import-preview').inner_text(), 'actual Notes import preview uses friendly owner label')
            h.click(q,'#progress-import-confirm');h.ok(h.active(q)!=original_id, 'import creates a second explorer')
            enter(q,base);imported_id=h.active(q);q.reload(wait_until='domcontentloaded');q.locator('#explorer-header').wait_for()
            if q.locator(f'[data-select-explorer="{imported_id}"]').count():h.click(q,f'[data-select-explorer="{imported_id}"]')
            q.locator('[data-ll-root]').wait_for()
            h.click(q,'[data-ll-shelf]')
            h.ok('9–16 of 17' in q.locator('[data-ll-root]').inner_text(), 'shelf defaults to last readable raw record page')
            h.click(q,'[data-ll-page="1"]')
            h.ok('17–17 of 17' in q.locator('[data-ll-root]').inner_text() and not q.locator('[data-ll-card]').count(), 'unavailable final raw item retains its own page')
            h.click(q,'[data-ll-page="-1"]');h.click(q,'[data-ll-page="-1"]')
            h.ok('1–8 of 17' in q.locator('[data-ll-root]').inner_text() and not q.locator('[data-ll-card="layer-guide-5"]').count(), 'duplicate ids unavailable without compressing raw pages')
            h.click(q,'[data-ll-hear]')
            spoken=q.locator('[data-ll-hear]').get_attribute('data-speak') or ''
            h.ok(all(t.strip() in spoken for t in q.locator('[data-ll-card]').all_text_contents()), 'shelf speech contains visible current-page guide labels')
            for historical in fixtures['historical']:
                h.click(q,f'[data-ll-card="{historical["id"]}"]');turn(q,0)
                source=historical['source'];text=q.locator('[data-ll-root]').inner_text()
                h.ok(source['title'] in text and camera(q)==source['nodes'][-1]['id'] and 'Earlier hidden teaching' not in text, 'historical guide starts at last own node with frozen escaped title and hidden help')
                turn(q,2)
                h.ok(not q.locator('[data-ll-reference]').count(), 'read-only guide cannot disclose unopened reference')
                h.click(q,'[data-ll-copy]');turn(q,0)
                h.ok(q.locator('[data-ll-camera]').count()==len(source['nodes']), 'historical camera uses own2/6-node structure')
                art=q.locator('[data-ll-scene] svg').get_attribute('data-ll-art')
                h.ok(art==source['nodes'][-1]['art'], 'historical initial image follows frozen art rather than current id')
                turn(q,2);h.click(q,'[data-ll-compare]')
                reference=q.locator('[data-ll-reference]').inner_text()
                h.ok(all(reference.index(a['label'])<reference.index(b['label']) for a,b in zip(source['nodes'],source['nodes'][1:])), 'historical reference follows frozen reordered nodes without level sorting')
                h.click(q,'[data-ll-shelf]')
            h.click(q,'[data-ll-card="layer-guide-86"]');h.click(q,'[data-ll-copy]');turn(q,1)
            h.click(q,'[data-ll-keep]');copied=guides(q)[-1]
            h.ok(copied['id']=='layer-guide-901' and copied['source']==fixtures['historical'][1]['source'] and copied['work']['futureWork']=={'kept':[1,2]} and 'futureOuter' not in copied, 'copy reserves unreadable ids, retaining source/work unknowns but not outer metadata')
            downloaded=native.download(q,base,'imported-redownload')
            h.ok(downloaded['layerGuides'][:-1]==cards and downloaded['syntheticOther']==mixed['syntheticOther'], 'actual redownload preserves malformed duplicates, history and siblings')
            enter(q,base);stale=detach(q,'[data-ll-keep]')
            h.click(q,'#explorer-switch');h.click(q,f'[data-select-explorer="{original_id}"]');q.locator('[data-ll-root]').wait_for();dispatch(stale)
            h.ok(h.book(q)==original_book, 'explorer switch rejects captured old-owner controls and leaves original notebook exact')

            # Fresh unseen-welcome deep link must not be stolen by either film path.
            unseen=copy.deepcopy(fixtures['base']);unseen['garden']['welcomeFilmSeen']=False
            _,fresh=native.setup(browser,unseen,'fresh-deep-link');enter(fresh,base)
            h.ok(fresh.locator('[data-ll-root]').is_visible() and not fresh.locator('[data-film-root],.welcome-film').count() and h.book(fresh)['garden']['welcomeFilmSeen'] is False, 'fresh deep-link stays in room without playing or marking welcome')
            h.go(fresh,base,'#living/bodies','[data-cs-enter]')
            old=h.book(fresh);anchor=detach(fresh,'a[data-ll-entry]');dispatch(anchor)
            h.ok(fresh.evaluate('location.hash')=='#living/bodies' and h.book(fresh)==old, 'detached legacy Cell invitation cannot navigate or write')
            h.click(fresh,'[data-cs-enter]');h.click(fresh,'[data-cs-part="wall"]')
            stale_link=fresh.locator('a[data-ll-entry]').element_handle()
            h.click(fresh,'a[data-ll-entry]');fresh.locator('[data-ll-root]').wait_for();dispatch(stale_link)
            h.ok('cellModels' not in h.book(fresh), 'studio invitation enters without saving its unkept illustration')

            for broken in [False,True]:
                seed=copy.deepcopy(fixtures['base']);seed['layerGuides']=[fixtures['historical'][0]]
                if broken:seed['plantStudy']={'v':99,'raw':'Invented unavailable plant format'}
                _,plant=native.setup(browser,seed,'plant-unavailable' if broken else 'plant-supported')
                h.go(plant,base,'#living/plants','main');plant.locator('[data-ll-return]').wait_for(state='attached');old=h.book(plant)
                invitation=plant.locator('[data-ll-return]').locator('xpath=ancestor::details[1]')
                invitation.locator('summary').click();text=invitation.inner_text()
                source=fixtures['historical'][0]['source']
                h.ok('Guide 1' in text and source['title'] in text and source['notice'] in text and source['plantReturnNote'] in text, 'Plant return names frozen guide, notice and measurement limit in '+str(broken))
                h.ok('Earlier node 0' in text and 'Earlier hidden teaching' not in text and 'is part of' not in text and 'includes' not in text, 'Plant unopened-reference return quotes neutral draft and frozen roles without revealing teaching')
                h.ok(h.book(plant)==old and invitation.locator('a[href="'+ROUTE+'"]').count()==1, 'Plant return is read-only and offers explicit Kept guides link')

            for name,owner in [('unsupported',{'v':99,'raw':'Invented earlier format'}),('exhausted',[{'id':'layer-guide-999999','v':99}])]:
                seed=copy.deepcopy(fixtures['base']);seed['layerGuides']=owner
                _,bad=native.setup(browser,seed,name);enter(bad,base);turn(bad,1);h.click(bad,'[data-ll-add="h-cell"]');old=h.book(bad)
                if bad.locator('[data-ll-keep]').is_enabled():h.click(bad,'[data-ll-keep]')
                h.ok(h.book(bad)==old and 'Cardiac muscle cell' in order(bad), name+' owner cannot be overwritten and local guide remains usable')
                h.click(bad,'[data-ll-shelf]');h.click(bad,'[data-ll-draft]')
                h.ok(bad.locator('[data-ll-turn]').count()==3, name+' shelf retains fresh-draft navigation')

            for width in [320,1024]:
                _,sample=native.setup(browser,fixtures['base'],f'width-{width}',width=width)
                enter(sample,base);bounds(sample);turn(sample,1)
                for node in ['h-person','h-cell','h-system']:h.click(sample,f'[data-ll-add="{node}"]')
                bounds(sample)
                if width==320:
                    h.click(sample,'[data-ll-strip-card="h-person"]');h.click(sample,'[data-ll-strip-next]');h.click(sample,'[data-ll-strip-prev]')
                turn(sample,2);h.click(sample,'[data-ll-compare]');bounds(sample)
                sample.screenshot(path=str(OUT/f'width-{width}.png'),full_page=True)

            near_full=copy.deepcopy(exported);near_full['syntheticOther']['payload']=''
            report=p.evaluate('''({report,cap})=>{const size=new TextEncoder().encode(JSON.stringify(report,null,2)).length;report.syntheticOther.payload='x'.repeat(cap-size-128);return report;}''',{'report':near_full,'cap':fixtures['maxImportBytes']})
            seed={k:v for k,v in report.items() if k not in ['title','exportedAt','note','explorer','recommendation']}
            _,refusal=native.setup(browser,seed,'report-limit-refusal');enter(refusal,base);turn(refusal,1);h.click(refusal,'[data-ll-add="h-cell"]');old=h.book(refusal)
            h.click(refusal,'[data-ll-keep]')
            h.ok(h.book(refusal)==old and 'Cardiac muscle cell' in order(refusal) and focus_is(refusal,'#ll-status'), 'real Notes report-limit refusal preserves notebook/draft and focuses status')
            for fault in ['quota','saving-off']:
                _,page=native.setup(browser,fixtures['base'],fault)
                if fault=='saving-off':
                    h.go(page,base,'#notes','#remember');page.locator('#remember').click();page.locator('dialog[aria-label="Turn saving off for every explorer?"] [data-confirm-do]').click()
                    page.evaluate('location.hash="#living/layers"');page.locator('[data-ll-root]').wait_for()
                else:enter(page,base)
                if fault=='quota':page.evaluate('''()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Invented quota fault','QuotaExceededError');return native.call(this,k,v)}}''')
                h.click(page,'[data-ll-keep]');status=page.locator('#ll-status').inner_text()
                h.ok('Download' in status and ('open page' in status or 'session' in status), fault+' truthfully reports memory-only Keep and recovery')
                recovered=native.download(page,base,fault+'-memory-export')
                h.ok(len(recovered['layerGuides'])==1, fault+' actual Notes download recovers in-memory guide')

            # Isolated actual UI harness: ordinary controls cannot make an open
            # frozen record turn unreadable, so trigger only that external change.
            _,harness=native.setup(browser,fixtures['base'],'unavailable-card-harness');enter(harness,base)
            harness.evaluate('''async seed=>{const ui=await import('./living-layers-ui.mjs');const book=structuredClone(seed),owner='invented-harness';const mount=document.querySelector('main');const render=()=>{mount.innerHTML=ui.livingLayersPage(book,owner);ui.bindLivingLayers(book,{explorerId:()=>owner,notebook:()=>book,isActive:()=>true,save:()=>({enabled:true,ok:true}),canExport:()=>true,render,focus:s=>document.querySelector(s)?.focus()});};window.layersHarness={book,render};render();}''',dict(fixtures['base'],layerGuides=[first]))
            h.click(harness,'[data-ll-shelf]');h.click(harness,'[data-ll-card="layer-guide-1"]')
            harness.evaluate('()=>{window.layersHarness.book.layerGuides[0].work={v:99};window.layersHarness.render()}')
            h.ok(not harness.locator('[data-ll-copy]').count() and 'unavailable' in harness.locator('#ll-title').inner_text().lower(), 'open record becoming unreadable removes editing action')
            h.click(harness,'[data-ll-hear]');h.click(harness,'[data-ll-shelf]');h.click(harness,'[data-ll-draft]')
            h.ok(harness.locator('[data-ll-turn]').count()==3, 'unavailable view retains Hear, shelf and fresh-guide navigation')
            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no failed ordinary requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'scope':'One820 native touch/keyboard journey;320/1024 samples; frozen source-owned cameras, neutral drafts, actual Notes/two explorers; separate report refusal/quota/saving-off and isolated unreadable-card UI harness.'},indent=2))
            print(f'Living Layers browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc())
            for page,label in h.pages:
                if not page.is_closed():
                    try:
                        page.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True)
                        (OUT/(label+'-failure.html')).write_text(page.content())
                    except Exception:pass
            raise
        finally:
            for context in h.contexts:
                try:context.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()


if __name__=='__main__':main()
