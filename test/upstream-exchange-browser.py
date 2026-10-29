"""Spec291 synthetic real-app touch journeys; supports canonical hosted replay.
No learner data. Native Chrome geometry/request proof is not physical iPad or audibility.
"""
import copy
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import traceback
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('UPSTREAM_ARTIFACTS', tempfile.mkdtemp(prefix='upstream-browser-')))
OUT.mkdir(parents=True, exist_ok=True)
checks, contexts, pages, errors, faults = 0, [], [], [], []
VIEW = '[data-upstream-view]'

def ok(value, message):
    global checks
    assert value, message
    checks += 1

def active(p):
    return p.evaluate("()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")

def book(p):
    return p.evaluate("()=>{const i=JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+i));}")

def owner(p):
    return book(p)['story']['upstreamExchange']

def setup(browser, width, height, seed, label, second_seed=None):
    c = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True,
                            reduced_motion='reduce', accept_downloads=True)
    contexts.append(c)
    profiles=[{'id':'explorer-1','avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-28T12:00:00.000Z'}]
    seeds={'explorer-1':seed}
    if second_seed is not None:
        profiles.append({'id':'explorer-2','avatar':'fern','color':'gold','symbol':'acorn','createdAt':'2026-10-28T12:00:00.000Z'})
        seeds['explorer-2']=second_seed
    fixture={'registry':{'version':1,'activeId':'explorer-1','explorers':profiles},'seeds':seeds}
    c.add_init_script('(fixture=>{if(!localStorage.getItem("upstream-fixture")){for(const [id,seed] of Object.entries(fixture.seeds))localStorage.setItem("number-garden-v1:"+id,JSON.stringify(seed));localStorage.setItem("learning-garden-explorers",JSON.stringify(fixture.registry));localStorage.setItem("upstream-fixture","1");}})('+json.dumps(fixture)+')')
    c.add_init_script('window.upstreamSpeechRequests=[];if(window.speechSynthesis){const native=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=u=>{window.upstreamSpeechRequests.push(u.text);return native(u);};}')
    p = c.new_page()
    pages.append((p, label))
    p.set_default_timeout(12000)
    p.on('pageerror', lambda e: errors.append({'case': label, 'error': str(e)}))
    p.on('console', lambda m: faults.append({'case': label, 'type': 'console', 'text': m.text}) if m.type == 'error' else None)
    p.on('response', lambda r: faults.append({'case': label, 'type': 'http', 'status': r.status, 'url': r.url}) if r.status >= 400 else None)
    p.on('requestfailed', lambda r: faults.append({'case': label, 'type': 'request', 'error': r.failure, 'url': r.url}) if 'ERR_ABORTED' not in (r.failure or '') else None)
    return p

def go(p, base, route='#almanac/upstream-reply', selector=VIEW):
    p.goto(base + route, wait_until='domcontentloaded')
    p.locator('#explorer-header').wait_for()
    identity = active(p)
    choice = p.locator(f'[data-select-explorer="{identity}"]')
    if choice.count():
        choice.click()
    p.locator(selector).wait_for()

def click(p, selector):
    p.locator(selector).first.click()

def snap(p, name):
    p.screenshot(path=str(OUT / (name + '.png')), full_page=True)

def no_film(p):
    ok(p.locator('dialog.welcome-film[open]').count()==0, 'no automatic welcome on exchange')

def bounds(p):
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
    for b in p.locator(VIEW+' button').all():
        if b.is_visible():
            r=b.bounding_box()
            ok(r['width']>=43.5 and r['height']>=43.5,'native touch target '+b.inner_text())
    for x in p.locator(VIEW+' p,'+VIEW+' button,'+VIEW+' summary').all():
        if x.is_visible():ok(float(x.evaluate('e=>getComputedStyle(e).fontSize').replace('px',''))>=16,'readable HTML text')

def question(p,q):
    click(p,'[data-upstream-question="'+q+'"]')

def download(p,base,name):
    click(p,VIEW+' a[href="#notes"]')
    p.locator('#download').wait_for()
    with p.expect_download() as d:click(p,'#download')
    path=OUT/(name+'.json');d.value.save_as(path)
    return json.loads(path.read_text())

def bring(p,base,report):
    p.goto(base+'#notes',wait_until='domcontentloaded');p.locator('#progress-file').wait_for()
    p.locator('#progress-file').set_input_files({'name':'synthetic-upstream.json','mimeType':'application/json','buffer':json.dumps(report).encode()})
    p.locator('#progress-import-confirm').wait_for();click(p,'#progress-import-confirm')
    ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual notebook import')

def journey(browser,base,f,w,h):
    fresh=copy.deepcopy(f['missing']);fresh['garden']['welcomeFilmSeen']=True
    p=setup(browser,w,h,fresh,'journey-'+str(w));go(p,base,'#arrive','[data-arrival-root]');no_film(p)
    click(p,'[data-arrival-choice="letter"]');click(p,'[data-arrival-join]')
    p.locator('a[href="#almanac/upstream-letter"]').first.click();p.locator('[data-act-two-open-letter]').wait_for()
    ok('upstreamExchange' not in book(p)['story'],'availability alone creates no exchange')
    click(p,'[data-act-two-open-letter]');p.locator('a[href="#almanac/upstream-reply"]').click();p.locator(VIEW).wait_for();no_film(p)
    ok('upstreamExchange' not in book(p)['story'],'preview creates no exchange')
    click(p,'[data-upstream-start]');saved_story=copy.deepcopy(book(p)['story'])
    source=owner(p)['source'];ok(len(source['questions'])==4,'four useful supplied questions')
    for q in source['questions']:
        question(p,q['id']);ok(q['question'] in p.locator(VIEW).inner_text(),'exact question preview')
        click(p,'[data-upstream-post]');post=next(x for x in owner(p)['posts'] if x['questionId']==q['id'])
        ok(post['posted']['questionId']==q['id'] and not post.get('replyOpened',False),'post and opening separate')
        ok(q['question'] in p.locator(VIEW).inner_text(),'exact question stays on envelope')
        click(p,'[data-upstream-open]');ok(next(x for x in owner(p)['posts'] if x['questionId']==q['id'])['replyOpened'] is True,'explicit reply opening recorded')
        text=p.locator(VIEW).inner_text();ok('about 240' in text and 'ordinary level' in text,'qualified local estimate visible')
        bounds(p);p.screenshot(path=str(OUT/('reply-'+str(w)+'-'+q['id']+'.png')),full_page=True)
        for fmt in ['longer','short']:
            click(p,'[data-upstream-format="'+fmt+'"]');ok('about 240' in p.locator(VIEW).inner_text(),'both reply amounts retain estimate')
        before=copy.deepcopy(owner(p))
        for mark in ['reference','marks','estimate']:click(p,'[data-upstream-highlight="'+mark+'"]')
        ok(owner(p)==before,'drawing highlights do not change notebook')
        click(p,'[data-upstream-back]')
    ok(book(p)['story']['acts']==saved_story['acts'] and book(p)['story']['seenScenes']==saved_story['seenScenes'],'no later-act ending or historical credit')
    question(p,'height');click(p,'[data-upstream-open]');kept=copy.deepcopy(owner(p));p.reload();p.locator(VIEW).wait_for();ok(owner(p)==kept,'reload preserves exact frozen exchange');no_film(p)
    click(p,'[data-upstream-back]');question(p,'height');click(p,'[data-upstream-open]')
    report=download(p,base,'journey-'+str(w));ok(report['story']['upstreamExchange']==kept,'actual notes download retains exact owner')
    bring(p,base,report);go(p,base);ok(owner(p)==kept,'actual whole-notebook import retains exact owner');no_film(p)

def retained(browser,base,f):
    p=setup(browser,820,1180,f['unopened'],'unopened');go(p,base);before=book(p)
    ok(p.locator('[data-upstream-start]').count()==0 or p.locator('[data-upstream-start]').is_disabled(),'sealed letter does not start exchange');no_film(p);ok(book(p)==before,'pure preview leaves notebook unchanged')
    for key in ['mismatch','badSupport','badDraft','badPosts','future']:
        p=setup(browser,820,1180,f[key],key);go(p,base);before=copy.deepcopy(owner(p));bounds(p)
        report=download(p,base,key);ok(report['story']['upstreamExchange']==before,'damaged raw owner remains downloadable '+key)
    p=setup(browser,820,1180,f['opened'],'keyboard');go(p,base);p.locator('[data-upstream-start]').focus();p.keyboard.press('Enter');p.locator('[data-upstream-question="marks"]').focus();p.keyboard.press('Space');p.locator('[data-upstream-post]').focus();p.keyboard.press('Enter');ok(len(owner(p)['posts'])==1,'native keyboard post')
    before=book(p);r=p.evaluate("()=>{const xs=[...document.querySelectorAll('[data-upstream-open],[data-upstream-back],[data-speak]')];location.hash='#notes';const connected=xs[0].isConnected;const n=upstreamSpeechRequests.length;xs.forEach(x=>x.click());return {connected,speech:upstreamSpeechRequests.length-n};}")
    ok(r['connected'] and r['speech']==0 and book(p)==before,'same-block stale controls inert')


def main():
    f=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {upstreamFixtures} from './test/upstream-exchange-checks.mjs';console.log(JSON.stringify(upstreamFixtures()));"],cwd=ROOT,text=True))
    server=None;base=os.environ.get('UPSTREAM_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self,*args):pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            for w,h in [(820,1180),(1024,768),(320,800)]:journey(browser,base,f,w,h)
            retained(browser,base,f)
            ok(not errors,'no page errors');ok(not faults,'no request/console faults')
            result={'status':'passed','checks':checks,'base':base,'pageErrors':errors,'faults':faults,'limits':'Synthetic notebooks/native Chrome only; no physical iPad, Safari, audibility or efficacy claims.'}
            (OUT/'receipt.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
        except Exception:
            for p,label in pages:
                try:p.screenshot(path=str(OUT/('failure-'+label+'.png')),full_page=True)
                except Exception:pass
            (OUT/'failure.json').write_text(json.dumps({'checks':checks,'errors':errors,'faults':faults,'trace':traceback.format_exc()},indent=2));raise
        finally:
            browser.close()
            if server:server.shutdown()

if __name__=='__main__':main()
