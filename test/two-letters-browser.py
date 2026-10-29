"""Synthetic284 native Chrome journeys; no app interception or ordinary speech stub.

TWO_LETTERS_TEST_URL targets a served candidate; TWO_LETTERS_ARTIFACTS holds
private screenshots and real downloads. Physical Safari, voice audibility and
learning gain are outside this test's claims.
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
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('TWO_LETTERS_ARTIFACTS',tempfile.mkdtemp(prefix='two-letters-')))
OUT.mkdir(parents=True,exist_ok=True)
os.environ['RHYTHM_ARTIFACTS']=str(OUT)
spec=importlib.util.spec_from_file_location('native_notebook_helpers',ROOT/'test/rhythm-browser.py')
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
ROUTE='#post/register'
# Independent author oracle, deliberately not selected by runtime fitting keys.
CHOICES=[('n1','council-greeting','Dear Members of the Council,'),('n2','formal-thanks','We are most grateful.'),('n3','find-out','find out'),('n4','write-soon','Write soon!'),('c1','council-greeting','Dear Members of the Council,'),('c2','request','request'),('c3','discover','discover'),('c4','enter','enter'),('a1','require','require'),('a2','discover','discover'),('a3','friendly-thanks','Thanks a million!'),('a4','sincerely','Sincerely,'),('a5','arrived-safely','The reed seeds have arrived safely. Thank you.')]
def sel(action):return f'[data-tl-action="{action}"]'
def click(p,action):
    target=p.locator(sel(action)).first
    if target.count() and not target.is_visible() and p.locator('[data-tl-tools-toggle]').count():
        h.click(p,'[data-tl-tools-toggle]')
    h.click(p,sel(action))
def setup(browser,width,seed,label,height=1000):
    c=browser.new_context(viewport={'width':width,'height':height},has_touch=True,reduced_motion='reduce',accept_downloads=True)
    h.contexts.append(c)
    c.add_init_script('(seed=>{if(!localStorage.getItem("two-letters-fixture")){const p={id:"explorer-1",avatar:"sky",color:"gold",symbol:"leaf",createdAt:"2026-10-28T12:00:00.000Z"};localStorage.setItem("learning-garden-explorers",JSON.stringify({version:1,activeId:p.id,explorers:[p]}));localStorage.setItem("number-garden-v1:"+p.id,JSON.stringify(seed));localStorage.setItem("two-letters-fixture","1");}})('+json.dumps(seed)+')')
    p=c.new_page();h.pages.append((p,label));p.set_default_timeout(12000)
    p.on('pageerror',lambda e:h.errors.append({'case':label,'error':str(e)}))
    p.on('console',lambda x:h.console_errors.append({'case':label,'text':x.text}) if x.type=='error' else None)
    def failed(r):
        e={'case':label,'url':r.url,'failure':r.failure}
        (h.navigation_aborts if 'ERR_ABORTED' in (r.failure or '') else h.request_failures).append(e)
    p.on('requestfailed',failed);p.on('response',lambda r:h.http_failures.append({'case':label,'url':r.url,'status':r.status}) if r.status>=400 else None)
    return c,p

def go(p,base):h.go(p,base,ROUTE,'[data-tl-root]')
def packet(p,identity):return next(x for x in h.book(p)['twoLetters'] if isinstance(x,dict) and x.get('id')==identity)
def start(p):
    if p.locator(sel('choose')).count():click(p,'choose')
    click(p,'start');return h.book(p)['twoLetters'][-1]['id']
def reopen(p,identity):
    if p.locator(sel('choose')).count():click(p,'choose')
    # Earlier raw rows paginate in groups of six, including retained rows.
    target=f'{sel("open")}[data-tl-id="{identity}"]'
    while not p.locator(target).count() and not p.locator(sel('pages-previous')).is_disabled():click(p,'pages-previous')
    while not p.locator(target).count() and not p.locator(sel('pages-next')).is_disabled():click(p,'pages-next')
    h.click(p,target)
def choose(p,choice,submit=True):
    p.locator(f'.tl-option:has([data-tl-choice][value="{choice}"])').click()
    h.ok(p.locator(f'[data-tl-choice][value="{choice}"]').is_checked(),'visible word tile selects its associated native radio')
    if submit:click(p,'use')
def reveal_letter(p):
    disclosure=p.locator('.tl-letter-disclosure')
    if disclosure.get_attribute('open') is None:disclosure.locator('summary').click()
def gap_styles(p):
    rows=p.locator('.tl-letter-disclosure .tl-gap').evaluate_all("xs=>xs.map(x=>{const s=getComputedStyle(x);return {answered:x.dataset.tlAnswered,current:x.getAttribute('aria-current')==='step',font:s.fontStyle,border:s.borderBottomStyle,borderWidth:parseFloat(s.borderBottomWidth),outline:s.outlineStyle,outlineWidth:parseFloat(s.outlineWidth),color:s.color,background:s.backgroundColor,classes:x.className,outcome:x.getAttribute('data-tl-outcome')}})")
    h.ok(any(r['answered']=='true' for r in rows) and any(r['answered']=='false' for r in rows),'source peek exercises both answered and unanswered slots');h.ok(sum(r['current'] for r in rows)==1,'exact current gap marked in source peek')
    h.ok(all(r['borderWidth']>0 and r['border']!='none' for r in rows),'every source slot has a noncolor border distinction')
    h.ok(all(r['font']=='italic' and r['border']=='dashed' for r in rows if r['answered']=='false'),'unanswered slots use italic dashed noncolor styling')
    h.ok(all(r['outlineWidth']>0 and r['outline']!='none' for r in rows if r['current']),'current source gap has a visible noncolor outline')
    h.ok(all(r['outcome'] is None and not any(code in r['classes'].split() for code in ['fits','other','alternative']) for r in rows),'source slot classes encode completion/current state without outcome grading')
    return rows

def focused(p,selector):h.ok(p.locator(selector).evaluate('x=>document.activeElement===x'),'focus on '+selector)
def bounds(p):
    h.ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal page overflow')
    bad=p.locator('[data-tl-root] button,[data-tl-root] a,[data-tl-root] summary,.tl-option').evaluate_all('xs=>xs.filter(x=>x.getClientRects().length&&(x.getBoundingClientRect().height<44||x.getBoundingClientRect().width<44)).map(x=>x.textContent.trim())')
    h.ok(not bad,'native44px touch targets '+str(bad))
def snap(p,label):p.screenshot(path=str(OUT/(label+'.png')),full_page=True)
def reload(p):
    identity=h.active(p);p.reload(wait_until='domcontentloaded');p.locator('#explorer-header').wait_for()
    if p.locator(f'[data-select-explorer="{identity}"]').count():h.click(p,f'[data-select-explorer="{identity}"]')
    p.locator('[data-tl-root]').wait_for()
def readonly(p):
    h.ok(not p.locator(','.join(sel(a) for a in ['use','keep','help','cards','compare','hear','together'])).count(),'kept exposes no answer or helper mutation controls')
    h.ok(not p.locator('[data-tl-choice]').count(),'kept has no radios')
def memory_download(p,label):
    p.evaluate('location.hash="#notes"');p.locator('#download').wait_for()
    h.ok('Two Letters' in p.locator('main').inner_text(),'Notes renders owner')
    with p.expect_download() as result:h.click(p,'#download')
    path=OUT/(label+'.json');result.value.save_as(path);return json.loads(path.read_text())
def download(p,base,label):
    h.go(p,base,'#notes','#download');return memory_download(p,label)
def without_owner(book):return {k:v for k,v in book.items() if k!='twoLetters'}

def ordinary(browser,width,base,f):
    _,p=setup(browser,width,f['base'],f'ordinary-{width}');go(p,base)
    before=h.book(p);h.ok('twoLetters' not in before,'entry initializes no owner');h.ok(not p.locator('dialog.welcome-film[open]').count(),'exact route bypasses automatic film')
    identity=start(p);focused(p,'#tl-question');h.ok(p.locator(sel('use')).is_disabled(),'new page has no automatic radio selection');h.ok(p.locator('input[type="radio"]').count()==2,'native radio group')
    h.ok(p.locator('fieldset legend').inner_text()=='Which words suit this reader and this job?','named native group');h.ok(not p.locator(sel('explore')).count(),'Explore only after commitment')
    # Keyboard changes a real native radio, pending state remains local.
    p.locator('[data-tl-choice]').first.focus();p.keyboard.press('Space');p.keyboard.press('ArrowRight');h.ok(p.locator('[data-tl-choice]:checked').input_value()=='nuria-greeting','native keyboard radio navigation')
    choose(p,'council-greeting',False);pending=h.book(p);h.ok('Dear Members of the Council,' in p.locator('[data-tl-preview]').inner_text(),'tile preview shows staged chosen wording before seal');h.ok(packet(p,identity)['answers']==[],'preview does not commit');snap(p,f'preview-{width}');click(p,'next');choose(p,'formal-thanks',False);click(p,'previous');h.ok(p.locator('[data-tl-choice]:checked').input_value()=='council-greeting','pending choices retained per question');h.ok(h.book(p)==pending,'navigation and pending never persist');h.click(p,sel('letter')+'[data-tl-letter-id="council"]');h.ok('Choice 5 of 13' in p.locator('#tl-question').inner_text(),'council envelope jumps to its first question');h.ok(not p.locator('[data-tl-choice]:checked').count(),'envelope jump never applies another question pending selection');h.ok(h.book(p)==pending,'envelope navigation read-only');h.click(p,sel('letter')+'[data-tl-letter-id="nuria"]');h.ok(p.locator('[data-tl-choice]:checked').input_value()=='council-greeting','returning envelope restores only its own pending choice')
    # First Help marks exposure before displaying source-owned hint; helper close restores trigger.
    click(p,'help');focused(p,'#tl-helper-heading');h.ok(packet(p,identity)['support']['help'],'first Help persisted before exposure');h.ok('Who reads this letter?' in p.locator('.tl-helper').inner_text(),'current source hint');snap(p,f'helper-{width}')
    h.ok(p.locator(sel('step-previous')).is_disabled(),'hint first edge');click(p,'step-next');h.ok('Hi Puff!' in p.locator('.tl-helper').inner_text(),'source easier greeting');click(p,'step-next');h.ok(p.locator(sel('step-next')).is_disabled(),'hint final edge');click(p,'close');focused(p,sel('help'))
    h.ok(p.locator('[data-tl-choice]:checked').input_value()=='council-greeting','helper retained unsent selection')
    click(p,'cards');h.ok('Formal and informal' in p.locator('#tl-helper-heading').inner_text(),'card1');click(p,'step-next');h.ok('One word for two' in p.locator('#tl-helper-heading').inner_text(),'card2');click(p,'step-next');h.ok('Keep the meaning' in p.locator('#tl-helper-heading').inner_text(),'card3');h.ok(p.locator(sel('step-next')).is_disabled(),'last card edge');click(p,'close')
    # Keep detached real controls; dispatching stale events must remain inert after rerender.
    p.evaluate('window.__tlStaleUse=document.querySelector("[data-tl-action=use]");window.__tlStaleRadio=document.querySelector("[data-tl-choice]")')
    for i,(qid,choice,text) in enumerate(CHOICES):
        h.ok(f'Choice {i+1} of 13' in p.locator('#tl-question').inner_text(),'authored question order '+qid)
        if i==1:
            before_stale=h.book(p);p.evaluate('window.__tlStaleUse.click()');h.ok(h.book(p)==before_stale,'late previous-question submit cannot answer the next question')
        h.ok(p.locator('.tl-reader').first.inner_text().startswith('Reader:'),'reader remains visible')
        h.ok(p.locator('.tl-line').count()==1,'complete supplied line visible')
        disclosure=p.locator('.tl-letter-disclosure');h.ok(disclosure.count()==1,'persistent source disclosure')
        if disclosure.get_attribute('open') is None:disclosure.locator('summary').click()
        h.ok(p.locator('.tl-letter-text').is_visible(),'full relevant letter accessible')
        if qid=='a1':
            h.ok(p.locator('.tl-guided li').count()==3,'a1 three guided steps before choosing');h.ok('do not change your letter choices' in p.locator('.tl-set-a').inner_text(),'Set A scope explicit');gap_answers=copy.deepcopy(packet(p,identity)['answers'])
        choose(p,choice);focused(p,'#tl-question');record=packet(p,identity)['answers'][-1];h.ok(record['questionId']==qid and record['choiceId']==choice and record['afterFeedback'] is False,'first committed answer literal '+qid)
        h.ok('Your words: '+text in p.locator('[data-tl-feedback]').inner_text(),'actual selected text displayed '+qid)
        h.ok(f'Choice {i+1} of 13' in p.locator('#tl-question').inner_text(),'submission does not auto-advance')
        if qid in ['a4','a5']:
            line=p.locator('[data-tl-preview] .tl-selected-line')
            geometry=line.evaluate('x=>{const r=document.createRange();r.selectNodeContents(x.parentElement.firstChild);return {display:getComputedStyle(x).display,top:x.getBoundingClientRect().top,precedingBottom:r.getBoundingClientRect().bottom,text:x.textContent}}')
            h.ok(geometry['display']=='block' and geometry['top']>=geometry['precedingBottom']-1,'recognition selection starts its own rendered line '+qid)
            h.ok(geometry['text']==text,'recognition selected line contains actual supplied choice '+qid)
        if i==0:
            h.ok('Check this reader' in p.locator('[data-tl-feedback]').inner_text(),'wrong reader has category plus source feedback');snap(p,f'committed-reply-{width}');reveal_letter(p);h.ok('Dear Members of the Council,' in p.locator('.tl-letter-text').inner_text(),'actual wrong selection rendered in letter');wrong_gap=gap_styles(p)[0];h.ok(wrong_gap['answered']=='true','actual other-classified words marked answered');snap(p,f'wrong-answer-source-slots-{width}')
            stable=h.book(p);p.evaluate('window.__tlStaleUse.click();window.__tlStaleRadio.checked=true;window.__tlStaleRadio.dispatchEvent(new Event("change",{bubbles:true}))');h.ok(h.book(p)==stable,'detached earlier controls cannot mutate answers')
            click(p,'compare');h.ok(packet(p,identity)['support']['comparison'],'comparison marked');h.ok(p.locator('.tl-comparison-letter').count()==2,'both original and chosen letters supplied');h.ok('not identical' in p.locator('.tl-helper').inner_text(),'shared facts and differences explicit');h.ok('Dear Members of the Council,' in p.locator('.tl-comparison-letter').first.inner_text(),'comparison uses actual committed wording');bounds(p);click(p,'close');focused(p,sel('compare'))
            choose(p,'nuria-greeting');h.ok(packet(p,identity)['answers'][0]['afterFeedback'] is True,'changed response records feedback revisit');reveal_letter(p);fitting_gap=gap_styles(p)[0];h.ok({k:wrong_gap[k] for k in ['color','background','border','borderWidth','outline','outlineWidth']}=={k:fitting_gap[k] for k in ['color','background','border','borderWidth','outline','outlineWidth']},'source slot styling does not color-grade other versus fitting selected words')
        bounds(p)
        if i<12:click(p,'next');focused(p,'#tl-question')
    h.ok(packet(p,identity)['answers'][:8][1:]==gap_answers[1:],'five Set A questions leave gap answers unchanged')
    h.ok(p.locator(sel('next')).is_disabled(),'last question edge');click(p,'hear');h.ok(packet(p,identity)['support']['narration'],'ordinary native Hear records request only')
    choose(p,'arrived-safely');p.evaluate('window.__tlBeforeNoop=document.querySelector("[data-tl-root]")');choose(p,'arrived-safely');h.ok(p.evaluate('window.__tlBeforeNoop===document.querySelector("[data-tl-root]")'),'identical answer no-op does not rerender');click(p,'together');h.ok(packet(p,identity)['support']['together'],'working together report');h.ok(p.locator(sel('together')).get_attribute('aria-pressed') is None,'together is action not toggle');stable=h.book(p);p.evaluate('window.__tlBeforeNoop=document.querySelector("[data-tl-root]")');click(p,'together');h.ok(h.book(p)==stable,'repeated together no state change');h.ok(p.evaluate('window.__tlBeforeNoop===document.querySelector("[data-tl-root]")'),'true support no-op does not rerender')
    click(p,'keep');readonly(p);focused(p,'#tl-status');old=copy.deepcopy(packet(p,identity));h.ok(p.locator('.tl-summary').count()==6,'kept first six summaries');click(p,'review-next');h.ok(p.locator('.tl-summary').count()==6,'kept second six summaries');click(p,'review-next');h.ok(p.locator('.tl-summary').count()==1 and p.locator(sel('review-next')).is_disabled(),'kept last one summary');snap(p,f'kept-{width}')
    click(p,'revise');revision=h.book(p)['twoLetters'][-1]['id'];focused(p,'#tl-question');choose(p,'council-greeting');h.ok(packet(p,revision)['answers'][0]['afterFeedback'] is True,'revision answer revisit');h.ok(packet(p,identity)==old,'revision leaves old kept packet literal');click(p,'keep');readonly(p)
    # Cross-packet pending isolation; equal question IDs do not carry pending values.
    blank=start(p);choose(p,'nuria-greeting',False);click(p,'choose');other=start(p);h.ok(not p.locator('[data-tl-choice]:checked').count(),'new packet has no older pending choice');reopen(p,blank);h.ok(p.locator('[data-tl-choice]:checked').input_value()=='nuria-greeting','old packet retains own pending within visit');choose(p,'nuria-greeting');click(p,'next');choose(p,'formal-thanks',False)
    waiting=h.book(p);reload(p);h.ok(p.locator('[data-tl-root="chooser"]').count()==1,'reload chooser without auto-resume');reopen(p,blank);h.ok(not p.locator('[data-tl-choice]:checked').count(),'reload discards uncommitted choice');h.ok(h.book(p)==waiting,'reload/open do not write');h.ok(without_owner(waiting)==without_owner(before),'Two Letters all actions preserve every sibling')
    original=h.active(p);h.click(p,'#explorer-switch');h.click(p,'#explorer-new');h.click(p,'#explorer-create');p.locator('[data-tl-root]').wait_for();h.ok(p.url.endswith(ROUTE) and 'twoLetters' not in h.book(p),'new explorer preserves exact route without owner');h.click(p,'#explorer-switch');h.click(p,f'[data-select-explorer="{original}"]');p.locator('[data-tl-root]').wait_for();h.ok(h.book(p)==waiting,'switch restores exact notebook')
    exported=download(p,base,f'letters-export-{width}');h.ok(h.raw_report(exported)==waiting and len(exported['syntheticOther']['payload'])>=512000,'actual complete Notes download retains500KiB sibling')
    _,q=setup(browser,width,f['partial'],f'transfer-{width}');go(q,base);original_id=h.active(q);original_book=h.book(q);h.go(q,base,'#notes','#progress-file');q.locator('#progress-file').set_input_files({'name':'synthetic-letters.json','mimeType':'application/json','buffer':json.dumps(exported).encode()});q.locator('#progress-import-confirm').wait_for();h.ok('Two Letters' in q.locator('.import-preview').inner_text(),'actual import preview owner recognition');h.click(q,'#progress-import-confirm');go(q,base);h.ok(h.active(q)!=original_id,'import separate explorer');reload(q);reopen(q,blank);again=download(q,base,f'letters-redownload-{width}');h.ok(again['twoLetters']==exported['twoLetters'] and again['syntheticOther']==exported['syntheticOther'],'persistent import/reload/redownload multiple packets/kept and large sibling');go(q,base);h.click(q,'#explorer-switch');h.click(q,f'[data-select-explorer="{original_id}"]');p_selector='[data-tl-root]';q.locator(p_selector).wait_for();h.ok(h.book(q)==original_book,'import preserves original explorer')
    # Actual adjacent entries preserve their own existing notebook state.
    h.go(p,base,'#post/letters','a[href="#post/register"]');adjacent=h.book(p);h.ok(p.locator('a[href="#post/register"]').count()==1,'letter game one Two Letters invitation');h.click(p,'a[href="#post/register"]');p.locator('[data-tl-root]').wait_for();h.ok(h.book(p)==adjacent,'adjacent invitation has no Two Letters auto-start')
    h.go(p,base,'#post','a[href="#post/register"]');h.ok(p.locator('a[href="#post/register"]').count()==1,'Post Office desk invitation');h.click(p,'a[href="#post/register"]');p.locator('[data-tl-root]').wait_for()
    return p

def landscape(browser,base,f):
    _,p=setup(browser,1024,f['base'],'landscape-1024',height=768);go(p,base);identity=start(p)
    choose(p,'nuria-greeting',False);h.ok(packet(p,identity)['answers']==[],'landscape native tile preview uncommitted');h.ok('Hi Nuria!' in p.locator('[data-tl-preview]').inner_text(),'landscape native selected preview')
    p.evaluate('window.scrollTo(0,0)');bounds(p);snap(p,'landscape-preview-1024x768');(OUT/'landscape-geometry.json').write_text(json.dumps(p.locator(sel('use')).evaluate('x=>({viewport:{width:innerWidth,height:innerHeight},seal:{top:x.getBoundingClientRect().top,bottom:x.getBoundingClientRect().bottom},stageHeight:document.querySelector(".tl-stage").getBoundingClientRect().height})'),indent=2));print('Landscape preview screenshot captured: '+str(OUT/'landscape-preview-1024x768.png'),flush=True)
    click(p,'use');h.ok(packet(p,identity)['answers'][0]['choiceId']=='nuria-greeting','landscape explicit seal commits supplied words');h.ok('Your words: Hi Nuria!' in p.locator('[data-tl-feedback]').inner_text(),'landscape actual reader reply');p.evaluate('window.scrollTo(0,0)');snap(p,'landscape-reply-1024x768')
    reveal_letter(p);h.ok('Hi Nuria!' in p.locator('.tl-letter-text').inner_text(),'landscape native source peek retains selected wording');gap_styles(p);h.ok(p.locator(sel('use')).evaluate('x=>{const panel=x.closest(".tl-choice-panel");return !!panel&&panel.contains(document.querySelector(".tl-word-tiles"))&&x.getBoundingClientRect().top>=panel.querySelector(".tl-word-tiles").getBoundingClientRect().bottom}'),'landscape seal stays in choice panel below visible tiles while source peek is open');snap(p,'landscape-source-peek-1024x768');safe=h.book(p);click(p,'cards');h.ok(packet(p,identity)['support']['help'],'landscape native tool records support');click(p,'close');h.ok(packet(p,identity)['answers']==safe['twoLetters'][-1]['answers'],'landscape helper preserves answers');bounds(p)

def retained_and_faults(browser,width,base,f):
    _,old=setup(browser,width,f['historical'],f'historical-{width}');go(old,base);reopen(old,f['historicalId']);h.ok('Earlier <reader> & "friend"' in old.locator('.tl-brief').first.inner_text(),'historical labels escaped and literal');h.ok('Choice 1 of 1' in old.locator('#tl-question').inner_text(),'historical own smaller count');h.ok(old.locator('[data-tl-choice]').count()==2,'historical own choices');h.ok('Your words: ask for' in old.locator('[data-tl-feedback]').inner_text() and 'Check this reader' in old.locator('[data-tl-feedback]').inner_text(),'historical recorded outcome not regraded from source');h.ok(not old.locator('[data-tl-root] reader').count(),'historical text not interpreted as markup');click(old,'cards');h.ok('Earlier card' in old.locator('#tl-helper-heading').inner_text(),'historical own card');click(old,'close');bounds(old);snap(old,f'historical-{width}')
    _,bad=setup(browser,width,f['malformedHelper'],f'bad-helper-{width}');go(bad,base);reopen(bad,f['historicalId']);h.ok(not bad.locator(','.join(sel(a) for a in ['compare','cards','help'])).count(),'damaged optional helpers hidden independently');choose(bad,'need');h.ok(packet(bad,f['historicalId'])['answers'][0]['choiceId']=='need','damaged helpers leave answers open');click(bad,'keep');readonly(bad);click(bad,'revise');h.ok(bad.locator(sel('use')).count()==1,'damaged helpers leave revision open')
    _,damaged=setup(browser,width,f['damaged'],f'kept-authority-{width}');go(damaged,base);reopen(damaged,f['id']);readonly(damaged);h.ok('Your words: Dear Members of the Council,' in damaged.locator('[data-tl-root]').inner_text(),'kept readable despite damaged sibling draft');click(damaged,'revise');h.ok(packet(damaged,h.book(damaged)['twoLetters'][-1]['id'])['answers']==next(x for x in f['damaged']['twoLetters'] if isinstance(x,dict) and x.get('id')==f['id'])['kept']['answers'],'revision copies authoritative kept answers')
    unsupported=copy.deepcopy(f['base']);unsupported['twoLetters']={'version':99,'raw':'Synthetic future owner'};_,u=setup(browser,width,unsupported,f'unsupported-{width}');go(u,base);h.ok(u.locator(sel('start')).is_disabled(),'unsupported root blocks only creator');raw=download(u,base,f'unsupported-{width}');h.ok(raw['twoLetters']==unsupported['twoLetters'],'raw owner retained through actual Notes')
    cap=copy.deepcopy(f['partial']);cap['twoLetters'] += [None]*(24-len(cap['twoLetters']));_,c=setup(browser,width,cap,f'cap-{width}');go(c,base);h.ok(c.locator(sel('start')).is_disabled() and '24 pages' in c.locator('[data-tl-root]').inner_text(),'24 raw cap explicitly explained');h.ok(c.locator('.tl-page-list').locator(':scope > *').count()==6,'history six raw rows including unreadable');h.ok(c.locator(sel('pages-previous')).is_disabled(),'first history page edge');click(c,'pages-next');h.ok(c.locator('.tl-page-list').locator(':scope > *').count()==6,'second six raw rows');click(c,'pages-next');click(c,'pages-next');h.ok(c.locator(sel('pages-next')).is_disabled(),'last history page edge');reopen(c,f['revisedId']);h.ok(c.locator(sel('use')).count()==1,'healthy page open at cap')
    refusal_context,r=setup(browser,width,f['refusal'],f'preflight-refusal-{width}')
    # Fault-only call-through observer. Native voice remains native; no audible claim.
    refusal_context.add_init_script('window.__tlFaultSpeech=[];const speak=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{window.__tlFaultSpeech.push(u.text);return speak(u)};')
    go(r,base);reopen(r,f['refusalId']);safe=h.book(r);h.ok(not packet(r,f['refusalId'])['support']['help'] and not packet(r,f['refusalId'])['support']['narration'],'first Help/Hear unexposed before refusal')
    click(r,'help');h.ok(h.book(r)==safe and not r.locator('.tl-helper').count(),'first Help preflight refusal exposes no hint');h.ok('could not fit safely' in r.locator('#tl-status').inner_text(),'actual report safety status');focused(r,'#tl-status')
    click(r,'cards');h.ok(h.book(r)==safe and not r.locator('.tl-helper').count(),'first cards refusal exposes no teaching card');click(r,'compare');h.ok(h.book(r)==safe and not r.locator('.tl-comparison-letter').count(),'comparison refusal exposes no comparison')
    speech_before=r.locator('.speech-controls').evaluate('x=>({hidden:x.hidden,status:x.querySelector("[data-speech-status]").textContent})');h.ok(speech_before['hidden'],'speech controls initially hidden');click(r,'hear');speech_after=r.locator('.speech-controls').evaluate('x=>({hidden:x.hidden,status:x.querySelector("[data-speech-status]").textContent})')
    h.ok(speech_after==speech_before and not packet(r,f['refusalId'])['support']['narration'],'first Hear refusal stops propagation before speech controls/status/support');h.ok(h.book(r)==safe and r.evaluate('window.__tlFaultSpeech.length')==0,'refused first Hear never calls native speech')
    # Separate real Storage write fault; ordinary journeys keep real native persistence.
    _,quota=setup(browser,width,f['base'],f'device-write-fault-{width}');go(quota,base);disk_before=h.book(quota)
    quota.evaluate('()=>{window.__tlNativeSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).startsWith("number-garden-v1:"))throw new DOMException("Synthetic device quota fault","QuotaExceededError");return window.__tlNativeSetItem.call(this,k,v)}}')
    click(quota,'start');choose(quota,'nuria-greeting');click(quota,'keep');readonly(quota);h.ok(h.book(quota)==disk_before,'native write failure leaves persisted notebook exact');h.ok('in this session' in quota.locator('#tl-status').inner_text() and 'Page kept.' not in quota.locator('#tl-status').inner_text(),'write fault reports session only without saved success');h.ok(quota.locator('[data-save-warning]').is_visible(),'app device warning remains');snap(quota,f'device-write-fault-{width}');downloaded=memory_download(quota,f'device-write-fault-{width}');h.ok(downloaded['twoLetters'][-1]['kept']['answers'][0]['choiceId']=='nuria-greeting','actual Notes download retains kept memory after storage failure')
    _,temporary=setup(browser,width,f['base'],f'temporary-{width}');go(temporary,base);temporary.evaluate('location.hash="#notes"');temporary.locator('#remember').wait_for();temporary.locator('#remember').uncheck();h.ok('lasts only while this page stays open' in temporary.locator('[data-saving-status]').inner_text(),'actual Remember off')
    temporary.evaluate('location.hash="#post/register"');temporary.locator('[data-tl-root]').wait_for();click(temporary,'start');choose(temporary,'council-greeting');click(temporary,'keep');readonly(temporary);h.ok('Saving is off' in temporary.locator('#tl-status').inner_text() and 'could not be saved' not in temporary.locator('#tl-status').inner_text(),'temporary session not falsely called storage failure');snap(temporary,f'temporary-{width}');downloaded=memory_download(temporary,f'temporary-{width}');h.ok(downloaded['twoLetters'][-1]['kept']['answers'][0]['choiceId']=='council-greeting','actual download keeps temporary unfinished page')
    # Cold initial picker retains the requested exact route and does not start film.
    _,cold=setup(browser,width,f['base'],f'cold-picker-{width}');cold.goto(base+ROUTE,wait_until='domcontentloaded');cold.locator('#explorer-header').wait_for();cold_identity=h.active(cold)
    if cold.locator(f'[data-select-explorer="{cold_identity}"]').count():h.click(cold,f'[data-select-explorer="{cold_identity}"]')
    cold.locator('[data-tl-root]').wait_for();h.ok(cold.url.endswith(ROUTE) and 'twoLetters' not in h.book(cold),'cold picker preserves exact route and no owner');h.ok(not cold.locator('dialog.welcome-film[open]').count(),'cold picker route bypasses automatic film')

def main():
    f=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {lettersFixtures} from './test/two-letters-checks.mjs';console.log(JSON.stringify(lettersFixtures()));"],cwd=ROOT,text=True))
    server=None;base=os.environ.get('TWO_LETTERS_TEST_URL')
    if not base:
        class Quiet(http.server.SimpleHTTPRequestHandler):
            def log_message(self,*args):pass
        class Server(http.server.ThreadingHTTPServer):
            request_queue_size=128
            daemon_threads=True
        server=Server(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
        threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    base=base.rstrip('/')+'/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),args=['--disable-quic'])
        try:
            landscape(browser,base,f)
            for width in [320,820]:ordinary(browser,width,base,f);retained_and_faults(browser,width,base,f)
            h.ok(not h.errors,'no page errors '+json.dumps(h.errors));h.ok(not h.console_errors,'no console errors '+json.dumps(h.console_errors));h.ok(not h.request_failures,'no failed requests '+json.dumps(h.request_failures));h.ok(not h.http_failures,'no HTTP failures '+json.dumps(h.http_failures))
            receipt={'status':'passed','checks':h.checks,'base':base,'pageErrors':h.errors,'consoleErrors':h.console_errors,'requestFailures':h.request_failures,'httpFailures':h.http_failures,'scope':'320/820 full journeys plus bounded1024x768 landscape, native controls, actual persistent multi-packet two-explorer Notes transfer, authoritative kept, historical source, separate first Help/Hear report refusal and native Storage fault; no app interception/tracing or ordinary speech substitutions','limits':['Physical Safari untested','Voice audibility untested','Learning gain untested']}
            (OUT/'receipt.json').write_text(json.dumps(receipt,indent=2));print(f'Two Letters browser: {h.checks} assertions passed; artifacts {OUT}')
        except Exception:
            (OUT/'failure.txt').write_text(traceback.format_exc());(OUT/'browser-faults.json').write_text(json.dumps({'checks':h.checks,'pageErrors':h.errors,'consoleErrors':h.console_errors,'requestFailures':h.request_failures,'httpFailures':h.http_failures,'navigationAborts':h.navigation_aborts},indent=2))
            for p,label in h.pages:
                if not p.is_closed():
                    try:snap(p,label+'-failure');(OUT/(label+'-failure.html')).write_text(p.content())
                    except Exception:pass
            raise
        finally:
            for c in h.contexts:
                try:c.close()
                except Exception:pass
            browser.close()
            if server:server.shutdown()
if __name__=='__main__':main()
