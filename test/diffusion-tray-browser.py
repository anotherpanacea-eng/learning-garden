"""Native375 manual snapshots, frozen Notes transfer and legacy lifecycle.

Invented fixtures only; one820px touch/keyboard journey and320/1024 samples.
Separate quota/saving-off/report-capacity probes use actual Notes boundaries.
No network interception, physical-device, audible speech or learning claim.
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
OUT = Path(os.environ.get('DIFFUSION_ARTIFACTS', tempfile.mkdtemp(prefix='diffusion-tray-')))
OUT.mkdir(parents=True, exist_ok=True)
os.environ['ESTIMATES_ARTIFACTS'] = str(OUT)
spec = importlib.util.spec_from_file_location('diffusion_native_helpers', ROOT/'test/courier-estimates-browser.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
h = native.h
ROUTE = '#science/ice'


def enter(p, base):
    h.go(p, base, ROUTE, '[data-dt-enter]')
    h.click(p, '[data-dt-enter]')
    p.locator('[data-dt-root]').wait_for()


def choose(p, case):
    element = p.locator(f'[data-dt-case="{case}"]')
    element.evaluate('e=>{for(let a=e.parentElement;a;a=a.parentElement)if(a.tagName==="DETAILS")a.open=true}')
    element.click()


def turn(p, number):
    h.click(p, f'[data-dt-turn="{number}"]')


def detach(p, selector):
    element = p.locator(selector).first.element_handle()
    element.evaluate('e=>e.remove()')
    return element


def dispatch(element, event='click'):
    element.evaluate('(e,type)=>e.dispatchEvent(new Event(type,{bubbles:true,cancelable:true}))', event)


def focus_is(p, selector):
    return p.locator(selector).evaluate('e=>e===document.activeElement')


def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no horizontal overflow')
    bad=p.locator('[data-dt-root] button,[data-dt-root] select,[data-dt-root] summary,[data-dt-root] a').evaluate_all('''xs=>xs.filter(e=>e.getClientRects().length&&(e.getBoundingClientRect().width<44||e.getBoundingClientRect().height<44||parseFloat(getComputedStyle(e).fontSize)<16)).map(e=>({text:e.textContent,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))''')
    h.ok(not bad, '44px controls and16px text: '+str(bad))


def positions(p):
    return p.locator('[data-dt-model] [data-dt-particle]').evaluate_all('xs=>xs.map(e=>({id:e.dataset.dtParticle,side:e.dataset.dtSide}))')


def geometry(p, count):
    # Screen-space bounding boxes prove actual glyph separation/containment;
    # no copy of the implementation's placement calculator is used.
    boxes=p.locator('[data-dt-model] [data-dt-particle]').evaluate_all('''xs=>xs.map(e=>{const b=e.querySelector('circle,path').getBoundingClientRect();return {id:e.dataset.dtParticle,side:e.dataset.dtSide,x:b.x,y:b.y,w:b.width,h:b.height};})''')
    h.ok(len(boxes)==count and all(b['w']>0 and b['h']>0 for b in boxes), 'every frozen particle has visible geometry')
    h.ok(all(a['x']+a['w']<=b['x']+.5 or b['x']+b['w']<=a['x']+.5 or a['y']+a['h']<=b['y']+.5 or b['y']+b['h']<=a['y']+.5 for i,a in enumerate(boxes) for b in boxes[i+1:]), 'rendered particle glyphs do not overlap')
    spaces=p.locator('[data-dt-model] .dt-space').evaluate_all('xs=>xs.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height};})')
    h.ok(len(spaces)==2 and abs(spaces[0]['w']-spaces[1]['w'])<.01 and abs(spaces[0]['h']-spaces[1]['h'])<.01, 'two model spaces have equal rendered area')
    h.ok(all((lambda a: b['x']>=a['x'] and b['y']>=a['y'] and b['x']+b['w']<=a['x']+a['w'] and b['y']+b['h']<=a['y']+a['h'])(spaces[0 if b['side']=='left' else 1]) for b in boxes), 'every glyph stays within its own stated space')
    svg=p.locator('[data-dt-model]').bounding_box()
    h.ok(all(b['x']>=svg['x'] and b['y']>=svg['y'] and b['x']+b['w']<=svg['x']+svg['width']+1 and b['y']+b['h']<=svg['y']+svg['height']+1 for b in boxes), 'all rendered glyphs stay inside the diagram')


def independent_step(source, work):
    result=copy.deepcopy(work)
    result['previous']=copy.deepcopy(work['current'])
    current={x['id']:x['side'] for x in result['current']}
    counters={x['kindId']:x for x in result['crossings']}
    kinds={x['id']:x for x in source['kinds']}
    rng=work['rng']
    for particle in source['particles']:
        rng ^= (rng << 13) & 0xffffffff
        rng ^= rng >> 17
        rng ^= (rng << 5) & 0xffffffff
        rng &= 0xffffffff
        if kinds[particle['kindId']]['canCross'] and rng < 2**30:
            side=current[particle['id']]
            current[particle['id']]='right' if side=='left' else 'left'
            counters[particle['kindId']]['leftToRight' if side=='left' else 'rightToLeft']+=1
    result['current']=[{'id':x['id'],'side':current[x['id']]} for x in work['current']]
    result['rng']=rng
    result['steps']+=1
    return result


def readouts(p, source, work):
    current={x['id']:x['side'] for x in work['current']}
    previous={x['id']:x['side'] for x in work['previous']}
    compact=p.locator('[data-dt-counts] p')
    detailed=p.locator('[data-dt-crossings] .dt-crossing-kind')
    for i,kind in enumerate(source['kinds']):
        particles=[x for x in source['particles'] if x['kindId']==kind['id']]
        initial=[sum(x['side']==side for x in particles) for side in ['left','right']]
        now=[sum(current[x['id']]==side for x in particles) for side in ['left','right']]
        last=[sum(previous[x['id']]==a and current[x['id']]==b for x in particles) for a,b in [('left','right'),('right','left')]]
        counter=next(x for x in work['crossings'] if x['kindId']==kind['id'])
        cumulative=[counter['leftToRight'],counter['rightToLeft']]
        h.ok(kind['label'] in compact.nth(i).inner_text() and f'Left {now[0]} · Right {now[1]}' in compact.nth(i).inner_text(), 'compact counts match independently counted frozen '+kind['id'])
        if detailed.count():
            values=detailed.nth(i).locator('dd').all_text_contents()
            h.ok(values==[f'{initial[0]} / {initial[1]}',f'{now[0]} / {now[1]}',*map(str,last),*map(str,cumulative)], 'last and cumulative directions match marker identities for '+kind['id'])
            difference=cumulative[0]-cumulative[1]
            net=detailed.nth(i).locator('p').inner_text()
            h.ok((str(abs(difference)) in net and ('left to right' if difference>0 else 'right to left') in net) if difference else 'Net cumulative change: zero.' in net, 'net uses the signed difference for '+kind['id'])


def runs(p):
    return h.book(p)['diffusionRuns']


def import_report(p, base, report):
    h.go(p,base,'#notes','#progress-file')
    p.locator('#progress-file').set_input_files({'name':'invented-diffusion.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for()
    h.ok('Diffusion' in p.locator('.import-preview').inner_text(), 'actual Notes preview names diffusion runs')
    h.click(p,'#progress-import-confirm')


def main():
    fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',r'''
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {diffusionSource,newDiffusionWork,advanceDiffusionWork} from './dist/diffusion-tray-core.mjs';
import {MAX_IMPORT_BYTES} from './dist/progress-limits.mjs';
const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
base.syntheticOther={payload:'Invented sibling retained exactly'};
const source=diffusionSource('left',123456789);source.id='earlier-source';source.title='Earlier <tray> & source';
source.kinds=source.kinds.slice(0,1);source.kinds[0].label='Earlier circles';
source.particles=source.particles.filter(p=>p.kindId===source.kinds[0].id).slice(0,5).reverse();
source.particles.forEach((p,i)=>{p.id='old-'+i;p.side=i<3?'left':'right'});
source.teaching=['Earlier first teaching.','Earlier hidden teaching.'];source.membraneRole='Earlier frozen membrane role.';
source.context='Earlier frozen context.';source.notice='Earlier frozen notice.';source.ruleNotice='Earlier frozen rule.';source.futureSource={retained:true};
let work=newDiffusionWork(source);work=advanceDiffusionWork(source,work);work.exampleSeen=1;
const historical={id:'diffusion-run-80',source,work,futureOuter:{retained:true}};
const crowded=diffusionSource('left',987);crowded.id='crowded64';crowded.particles=Array.from({length:64},(_,i)=>({id:'many-'+i,kindId:crowded.kinds[0].id,side:'left'}));
console.log(JSON.stringify({base,historical,crowded:{id:'diffusion-run-64',source:crowded,work:newDiffusionWork(crowded)},maxImportBytes:MAX_IMPORT_BYTES}));
'''],cwd=ROOT,text=True))
    server=None
    base=os.environ.get('DIFFUSION_TEST_URL')
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
            c,p=native.setup(browser,fixtures['base'],'tablet')
            # A fixed, counted seed producer is confined to this invented context.
            c.add_init_script('window.diffusionSeedCalls=0;crypto.getRandomValues=a=>{a[0]=123456789+(++window.diffusionSeedCalls);return a;}')
            h.go(p,base,ROUTE,'[data-dt-enter]')
            h.click(p,'[data-phase-action="in"]');h.click(p,'[data-phase-action="in"]')
            h.click(p,'[data-phase-action="follow"]')
            h.click(p,'[data-phase-details="table"] summary')
            stale_phase=detach(p,'[data-phase-action="in"]')
            stale_details=detach(p,'[data-phase-details="model"]')
            before=h.book(p)
            h.click(p,'[data-dt-enter]')
            dispatch(stale_phase);dispatch(stale_details,'toggle')
            h.ok(h.book(p)==before and not p.locator('[data-water-phase-root],[data-phase-action]').count(), 'tray replaces legacy targets without notebook writes')
            h.ok('diffusionRuns' not in before, 'entry does not initialize the saved owner')
            start_positions=positions(p)
            h.ok(len(start_positions)==24, 'first setup draws all24 markers')
            geometry(p,24);bounds(p)
            seed_calls=p.evaluate('window.diffusionSeedCalls')
            p.locator('[data-dt-follow]').tap()
            h.ok(focus_is(p,'[data-dt-follow]'), 'touch Follow retains its live control focus')
            p.locator('[data-dt-marker]').select_option(index=3)
            for _ in range(6):h.click(p,'[data-dt-example]')
            turn(p,1)
            h.ok('Subtract opposite-direction' in p.locator('[data-dt-root]').inner_text(), 'Crossings teaches signed subtraction')
            h.click(p,'[data-dt-hear]')
            spoken=p.locator('[data-dt-hear]').get_attribute('data-speak') or ''
            h.ok('Earlier hidden' not in spoken and p.locator('.speech-controls').is_visible(), 'actual speech binding uses current visible material')
            turn(p,0)
            h.ok(p.evaluate('window.diffusionSeedCalls')==seed_calls and positions(p)==start_positions, 'follow/help/turn/render consume no trial seeds or transitions')
            p.locator('[data-dt-step]').focus();p.keyboard.press('Enter')
            h.ok(focus_is(p,'[data-dt-step]'), 'keyboard step returns focus to live Advance')
            h.click(p,'[data-dt-step]')
            old_keep=p.locator('[data-dt-keep]').element_handle()
            h.click(p,'[data-dt-keep]');dispatch(old_keep)
            first=copy.deepcopy(runs(p)[0])
            expected=copy.deepcopy(first['work']);expected['steps']=0;expected['rng']=first['source']['seed'];expected['current']=copy.deepcopy(first['source']['particles']);expected['current']=[{'id':x['id'],'side':x['side']} for x in expected['current']];expected['previous']=copy.deepcopy(expected['current']);expected['crossings']=[{'kindId':k['id'],'leftToRight':0,'rightToLeft':0} for k in first['source']['kinds']]
            for _ in range(2):expected=independent_step(first['source'],expected)
            h.ok(first['work']==expected and first['work']['exampleSeen']==6, 'saved two-step identities/RNG/directional counters match independent transition')
            turn(p,1);readouts(p,first['source'],first['work']);turn(p,0)
            h.ok(len(runs(p))==1 and {k:v for k,v in h.book(p).items() if k!='diffusionRuns'}==before, 'duplicate detached Keep is inert and only diffusionRuns changes')
            h.ok(not p.locator('[data-dt-step],[data-dt-keep],[data-dt-example]').count(), 'kept snapshot exposes no editing or extra teaching')
            frozen_book=h.book(p)
            h.click(p,'[data-dt-follow]')
            h.ok(h.book(p)==frozen_book, 'read-only marker selection does not write')
            p.screenshot(path=str(OUT/'tablet-kept.png'),full_page=True)
            h.click(p,'[data-dt-new-trial]')
            h.click(p,'[data-dt-keep]')
            restarted=copy.deepcopy(runs(p)[1])
            h.ok(restarted['work']['steps']==0 and restarted['work']['exampleSeen']==0 and restarted['source']['seed']!=first['source']['seed'], 'kept setup starts a new-seed zero-step trial rather than resuming')
            h.ok(restarted['work']['current']==restarted['work']['previous']==[{'id':x['id'],'side':x['side']} for x in restarted['source']['particles']], 'new trial restores initial identities')
            h.click(p,'[data-dt-new-trial]');h.click(p,'[data-dt-step]')
            draft_positions=positions(p)
            choose(p,'right');choose(p,'left')
            h.ok(positions(p)==first['work']['current'], 'catalogue first draft retains its original advanced state')
            h.click(p,'[data-dt-drafts]')
            draft_keys=p.locator('[data-dt-draft]').evaluate_all('xs=>xs.map(e=>e.dataset.dtDraft)')
            h.ok(len(draft_keys)>=4, 'new trials append retained named draft slots')
            h.click(p,'[data-dt-draft="'+draft_keys[-2]+'"]')
            h.ok(positions(p)==draft_positions, 'earlier unkept trial retains its manual step')
            for _ in range(6):h.click(p,'[data-dt-new-trial]')
            h.click(p,'[data-dt-drafts]')
            h.ok(p.locator('[data-dt-draft]').count()==8, 'draft shelf pages eight local slots')
            h.click(p,'[data-dt-draft-page="1"]')
            h.ok(p.locator('[data-dt-draft]').count()==2, 'draft page crosses the eight-slot boundary')
            h.click(p,'[data-dt-draft-page="-1"]')
            h.click(p,'[data-dt-draft="'+draft_keys[-2]+'"]')
            stale_step=detach(p,'[data-dt-step]');stale_hear=detach(p,'[data-dt-hear]');stale_hear.evaluate('e=>e.dataset.speak="Detached speech sentinel"')
            h.click(p,'[data-dt-legacy]')
            dispatch(stale_step);dispatch(stale_hear)
            h.ok('Stage 3 of 6' in p.locator('.phase-stage').inner_text() and 'particle 2:' in p.locator('.phase-follow').inner_text() and p.locator('[data-phase-details="table"]').get_attribute('open') is not None, 'legacy stage/follow/details survive mode roundtrip')
            h.ok(stale_hear.get_attribute('data-speak')=='Detached speech sentinel', 'detached tray speech cannot refresh or speak after mode switch')
            h.click(p,'[data-phase-action="watch"]')
            p.locator('video').wait_for();video=p.locator('video').element_handle()
            h.click(p,'[data-dt-enter]')
            h.ok(video.evaluate('e=>e.paused'), 'switching to tray pauses original movie')
            h.click(p,'[data-dt-legacy]')
            h.ok(not p.locator('[data-water-film-movie]').count() and 'Stage 3 of 6' in p.locator('.phase-stage').inner_text(), 'return never autoplays film and preserves stage')
            exported=native.download(p,base,'tablet-export')
            h.ok(exported['diffusionRuns'][0]==first and exported['syntheticOther']==before['syntheticOther'], 'actual Notes export retains frozen run and unrelated sibling')

            mixed=copy.deepcopy(exported)
            duplicate=copy.deepcopy(first);duplicate['id']='diffusion-run-5'
            cards=[first,{'id':'diffusion-run-70','v':99},duplicate,copy.deepcopy(duplicate),fixtures['historical']]
            for number in range(81,92):
                card=copy.deepcopy(first);card['id']='diffusion-run-'+str(number);cards.append(card)
            cards.append({'id':'diffusion-run-900','v':99,'raw':'Invented unavailable run'})
            mixed['diffusionRuns']=cards
            _,q=native.setup(browser,fixtures['base'],'transfer')
            h.go(q,base,ROUTE,'[data-dt-enter]')
            original_id,original_book=h.active(q),h.book(q)
            import_report(q,base,mixed)
            h.ok(h.active(q)!=original_id, 'real Notes import creates a separate explorer')
            enter(q,base);h.click(q,'[data-dt-shelf]')
            h.ok('9–16 of 17' in q.locator('[data-dt-root]').inner_text(), 'raw shelf defaults to last readable page')
            h.click(q,'[data-dt-page="1"]')
            h.ok('17–17 of 17' in q.locator('[data-dt-root]').inner_text() and not q.locator('[data-dt-card]').count(), 'unsupported final raw record owns its page')
            h.click(q,'[data-dt-page="-1"]');h.click(q,'[data-dt-page="-1"]')
            h.ok('1–8 of 17' in q.locator('[data-dt-root]').inner_text() and not q.locator('[data-dt-card="diffusion-run-5"]').count(), 'duplicate records unavailable without compressing raw numbering')
            h.click(q,'[data-dt-card="diffusion-run-80"]')
            old=fixtures['historical'];text=q.locator('[data-dt-root]').inner_text()
            h.ok(old['source']['title'] in text and 'Earlier first teaching.' in text and 'Earlier hidden teaching.' not in text, 'historical escaped source and saved teaching count remain frozen')
            h.ok(positions(q)==old['work']['current'] and q.locator('[data-dt-marker] option').count()==5, 'historical subset/reordered markers use own frozen identities')
            turn(q,1);readouts(q,old['source'],old['work'])
            h.ok('Earlier circles' in q.locator('[data-dt-counts]').inner_text() and 'Diamond markers' not in q.locator('[data-dt-counts]').inner_text(), 'historical count labels derive from own subset kinds')
            h.click(q,'[data-dt-source] summary')
            h.ok(old['source']['ruleNotice'] in q.locator('[data-dt-source]').inner_text(), 'historical limits expose the frozen rule notice')
            redownload=native.download(q,base,'imported-redownload')
            h.ok(redownload['diffusionRuns']==cards, 'real import/reload-free redownload preserves all raw records exactly')
            enter(q,base);stale_explorer=detach(q,'[data-dt-step]')
            h.click(q,'#explorer-switch');h.click(q,f'[data-select-explorer="{original_id}"]');dispatch(stale_explorer)
            h.ok(h.book(q)==original_book, 'explorer switch rejects detached tray control and leaves original notebook exact')
            h.click(q,'[data-dt-enter]')
            route_step=detach(q,'[data-dt-step]')
            h.go(q,base,'#science','main');dispatch(route_step)
            h.ok(h.book(q)==original_book, 'route-exited detached tray step is inert')
            enter(q,base)
            h.ok('Snapshot at step 0.' in q.locator('[data-dt-model]').locator('xpath=..').inner_text(), 'route exit clears unkept local trials')

            # Named frozen return is read-only in both Cell Studio modes, even
            # when that saved collection is unsupported.
            for broken in [False,True]:
                seed=copy.deepcopy(fixtures['base']);seed['diffusionRuns']=[old]
                if broken:seed['cellModels']={'v':99,'raw':'Invented unavailable cells'}
                _,r=native.setup(browser,seed,'cell-return-'+str(broken))
                h.go(r,base,'#living/bodies','[data-dt-cell-return]')
                prior=h.book(r);fold=r.locator('[data-dt-cell-return]')
                fold.locator('summary').first.click()
                text=fold.inner_text()
                h.ok('Run 1' in text and old['source']['title'] in text and old['source']['membraneRole'] in text and old['source']['notice'] in text, 'legacy Cell return names frozen model and role '+str(broken))
                h.ok(fold.locator('[data-dt-return][href="#science/ice"]').count()==1, 'named return explicitly links Ice and warmth')
                h.click(r,'[data-cs-enter]')
                fold=r.locator('[data-dt-cell-return]')
                h.ok(fold.get_attribute('open') is not None, 'return fold open state survives Cell Studio mode change')
                h.click(r,'[data-cs-hear]')
                h.ok(old['source']['membraneRole'] in (r.locator('[data-cs-hear]').get_attribute('data-speak') or ''), 'studio Hear includes open frozen return')
                h.ok(h.book(r)==prior, 'Cell return disclosure never writes either owner')

            for label,root in [('unsupported',{'v':99,'raw':'Invented old diffusion collection'}),('exhausted',[{'id':'diffusion-run-999999','v':99}])]:
                seed=copy.deepcopy(fixtures['base']);seed['diffusionRuns']=root
                _,unavailable=native.setup(browser,seed,'collection-'+label)
                enter(unavailable,base);h.click(unavailable,'[data-dt-step]')
                prior=h.book(unavailable)
                if unavailable.locator('[data-dt-keep]').is_enabled():h.click(unavailable,'[data-dt-keep]')
                h.ok(h.book(unavailable)==prior and len(positions(unavailable))==24, label+' collection leaves local exploration open without a false save')
                h.go(unavailable,base,'#living/bodies','[data-dt-cell-return]')
                fold=unavailable.locator('[data-dt-cell-return]');fold.locator('summary').first.click()
                h.ok(('original format' if label=='unsupported' else 'No new run number') in fold.inner_text(), label+' Cell invitation explains save limits honestly')
                h.ok(h.book(unavailable)['diffusionRuns']==root, label+' return preserves unreadable raw owner')

            for width in [320,1024]:
                seed=copy.deepcopy(fixtures['base']);seed['diffusionRuns']=[fixtures['crowded']]
                _,sample=native.setup(browser,seed,'width-'+str(width),width=width)
                enter(sample,base);h.click(sample,'[data-dt-shelf]');h.click(sample,'[data-dt-card="diffusion-run-64"]')
                geometry(sample,64);bounds(sample);turn(sample,1);bounds(sample)
                sample.screenshot(path=str(OUT/f'width-{width}.png'),full_page=True)

            near_full=copy.deepcopy(exported);near_full['syntheticOther']['payload']=''
            report=p.evaluate('''({report,cap})=>{report.syntheticOther.payload='x'.repeat(cap-new TextEncoder().encode(JSON.stringify(report,null,2)).length-128);return report;}''',{'report':near_full,'cap':fixtures['maxImportBytes']})
            seed={k:v for k,v in report.items() if k not in ['title','exportedAt','note','explorer','recommendation']}
            _,refusal=native.setup(browser,seed,'notes-preflight-refusal')
            enter(refusal,base);h.click(refusal,'[data-dt-step]');prior=h.book(refusal);local=positions(refusal)
            h.click(refusal,'[data-dt-keep]')
            h.ok(h.book(refusal)==prior and positions(refusal)==local and focus_is(refusal,'#dt-status'), 'real Notes report preflight refuses atomically and retains local trial')
            h.ok('not been kept' in refusal.locator('#dt-status').inner_text(), 'preflight refusal does not claim a Keep')
            for fault in ['quota','saving-off']:
                _,r=native.setup(browser,fixtures['base'],fault)
                if fault=='saving-off':
                    h.go(r,base,'#notes','#remember');r.locator('#remember').uncheck()
                    r.evaluate('location.hash="#science/ice"');r.locator('[data-dt-enter]').wait_for();h.click(r,'[data-dt-enter]')
                else:enter(r,base)
                if fault=='quota':r.evaluate('''()=>{const native=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith('number-garden-v1:'))throw new DOMException('Invented quota fault','QuotaExceededError');return native.call(this,k,v);};}''')
                h.click(r,'[data-dt-keep]')
                h.ok('Download' in r.locator('#dt-status').inner_text(), fault+' status offers Notes recovery')
                recovered=native.download(r,base,fault+'-memory-export')
                h.ok(len(recovered['diffusionRuns'])==1, fault+' actual Notes download recovers memory-only Keep')
            # Isolated actual UI: ordinary controls cannot corrupt a frozen
            # record while its card is open. No module/asset is intercepted.
            _,harness=native.setup(browser,fixtures['base'],'unavailable-card-module-harness')
            h.go(harness,base,ROUTE,'[data-dt-enter]')
            harness.evaluate("""async seed=>{
              const ui=await import('./diffusion-tray-ui.mjs');
              const book=structuredClone(seed),owner='invented-unavailable-harness',mount=document.querySelector('main');
              window.diffusionHarness={book,render:null};
              const render=()=>{mount.innerHTML=ui.diffusionTrayPage(book,owner);ui.bindDiffusionTray(book,{explorerId:()=>owner,notebook:()=>book,isActive:()=>true,save:()=>({enabled:true,ok:true}),canExport:()=>true,render,focus:s=>document.querySelector(s)?.focus(),stopSpeech:()=>{},stopSound:()=>{}});};
              window.diffusionHarness.render=render;render();
            }""",dict(fixtures['base'],diffusionRuns=[first]))
            h.click(harness,'[data-dt-enter]');h.click(harness,'[data-dt-shelf]');h.click(harness,'[data-dt-card="diffusion-run-1"]')
            harness.evaluate("()=>{window.diffusionHarness.book.diffusionRuns[0].work={v:99};window.diffusionHarness.render();}")
            h.ok('unavailable' in harness.locator('#dt-title').inner_text().lower() and not harness.locator('[data-dt-new-trial],[data-dt-step],[data-dt-keep]').count(), 'cached card becoming unreadable removes all content actions')
            h.ok(harness.locator('[data-dt-hear]').count()==1, 'unavailable card retains one Hear control')
            h.click(harness,'[data-dt-hear]')
            h.ok('unavailable' in (harness.locator('[data-dt-hear]').get_attribute('data-speak') or '').lower(), 'unavailable Hear describes its visible recovery explanation')
            h.click(harness,'[data-dt-shelf]')
            h.ok(not harness.locator('[data-dt-card]').count(), 'unavailable card can return to raw shelf')
            h.click(harness,'[data-dt-drafts]')
            h.ok(harness.locator('[data-dt-draft]').count()==1, 'unavailable card retains local draft navigation')
            h.click(harness,'[data-dt-legacy]')
            h.ok(harness.locator('[data-water-phase-root]').count()==1, 'unavailable card retains original ice model navigation')

            h.ok(not h.errors,'no page errors: '+json.dumps(h.errors))
            h.ok(not h.console_errors,'no console errors: '+json.dumps(h.console_errors))
            h.ok(not h.request_failures and not h.http_failures,'no ordinary failed requests')
            (OUT/'receipt.json').write_text(json.dumps({'status':'passed','checks':h.checks,'scope':'Native820 journey;320/1024 samples; real Notes transfer/two explorers; frozen historical subsets; raw pagination; separate save faults.','pageErrors':h.errors},indent=2))
            print(f'Diffusion Tray browser: {h.checks} assertions passed; artifacts {OUT}')
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
