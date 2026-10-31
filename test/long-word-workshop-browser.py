"""Actual-app synthetic journeys; Chromium emulation, not device/audio qualification."""
import json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('LONG_WORD_TEST_URL', 'http://127.0.0.1:4230/')
OUT = Path(os.environ.get('LONG_WORD_ARTIFACTS', '/tmp/long-word-workshop-browser'))
OUT.mkdir(parents=True, exist_ok=True)
NODE = """import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';import {openLongWordSection} from './dist/long-word-workshop-core.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;if(process.argv[1]==='saved')openLongWordSection(s,'words',{canExport:()=>true});console.log(JSON.stringify(s));"""
def seed(saved=False):
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', NODE, 'saved' if saved else 'fresh'], cwd=ROOT, text=True))

# Literal finite-text expectations: success is independent of the shipped keys.
GROUPS = [('catchment', ['catch','ment']), ('embankment',['embank','ment']),
          ('embankment',['em','bank','ment']), ('permeable',['perme','able']),
          ('precipitation',['precipit','ation']), ('photosynthesis',['photo','synthesis']),
          ('photosynthesis',['photo','syn','thesis']), ('algorithm',['algorithm'])]
GLOSSARY = {
    'g1': (['which','witch','wich'], 'a', 'c', [
        'Look at “the path which floods.” Which links path to its description.',
        'Now look at the land in this sentence.']),
    'g2': (['permeible','permeable','permiable'], 'b', 'c', [
        'Find perme in permeation.', 'Find able on the word card.',
        'Put the letter groups together and check permeable.']),
    'g3': (['affect','efect','effect'], 'c', 'a', [
        '“The wall affects the flow.” Affects is the doing word there.',
        '“The wall has an effect.” Effect names the result.', 'Now read this sentence.'])}
JOBS = {
    'F1': (['permeable','permeible','permiable'], 'a',
        'A family word can remind us of letters. Check the ending against the word card too.',
        'A family can help', ['Define and definition share defin.',
        'A family may show a useful letter group.', 'Still check the whole word and its ending.']),
    'F2': (['fotosynthesis','photosynthesis','photosinthesis'], 'b',
        "A word's history can offer spelling clues. The checked spelling is still our reference.",
        'Look at a spelling clue', ['Photograph begins with photo.', 'Point to its ph.',
        "A clue helps us look closely; it does not settle every word's spelling."]),
    'F3': (['photosynthesis','catchment','algorithm'], 'c',
        "Photosynthesis: Greek-derived parts. Catchment: catch with -ment. Algorithm: from al-Khwarizmi's name; its later spelling was reshaped to resemble a Greek word.",
        'Read what a history note actually says', ['One note may name a word\'s parts.',
        'Another may describe a later spelling change.', 'Use the note\'s evidence; length alone cannot tell the history.'])}

n = 0
errors = []
def ok(value, message):
    global n
    assert value, message
    n += 1
def eq(a, b, message): ok(a == b, message + ': ' + repr(a)[:350])
def state(p): return p.evaluate('window.__lwwRead()')
def root(p): return state(p).get('longWordWorkshop')
def action(p, name, extra=''): return p.locator('[data-lww-action="'+name+'"]'+extra).first
def tap(p, name, extra=''): action(p, name, extra).tap()
def word(p):
    r = root(p)
    return r['words'][r['activeWord']]
def choose(p, key): p.locator('[data-lww-word-picker]').select_option(key)
def line(p, key): p.locator('[data-lww-line-picker]').select_option(key)
def dismiss_film(p):
    button = p.locator('dialog.welcome-film[open] [data-film-skip]')
    if button.count(): button.first.click()
def arrive(p):
    p.locator('[data-long-word-root],[data-select-explorer]').first.wait_for()
    if not p.locator('[data-long-word-root]').count():
        owner = p.evaluate('JSON.parse(localStorage.getItem("learning-garden-explorers")).activeId') or 'explorer-1'
        p.locator('[data-select-explorer="'+owner+'"]').click()
    p.locator('[data-long-word-root]').wait_for()
def geometry(p):
    spoken = p.locator('.lww-room [data-speak]').evaluate_all('xs=>xs.map(e=>e.dataset.lwwRead)')
    ok(all(x in ['instruction','sentence','prompt','story'] for x in spoken), 'speech controls exclude pieces, choices, clues, examples, feedback and keeps')
    ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'no page horizontal overflow')
    bad = p.locator('.lww-room :is(button,select,summary,a):visible').evaluate_all('xs=>xs.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent)')
    ok(not bad, '44px targets: '+str(bad))
    bad = p.locator('.lww-room :is(button,select,summary,p,li,a):visible').evaluate_all('xs=>xs.filter(e=>parseFloat(getComputedStyle(e).fontSize)<16).map(e=>e.textContent)')
    ok(not bad, 'functional text at least 16px: '+str(bad))
def start(browser, width, height=1000, first=None):
    c = browser.new_context(viewport={'width':width,'height':height}, has_touch=True, accept_downloads=True, reduced_motion='reduce')
    registry = {'version':1,'activeId':'explorer-1','explorers':[{'id':key,'avatar':'sky','color':'blue','symbol':'leaf','createdAt':'2026-10-31T14:00:00.000Z'} for key in ['explorer-1','explorer-2']]}
    fixture = {'registry':registry, 'books':{'explorer-1':first if first is not None else seed(), 'explorer-2':seed()}}
    c.add_init_script('(d=>{if(!localStorage.getItem("lww-fixture")){localStorage.setItem("learning-garden-explorers",JSON.stringify(d.registry));for(const [id,s]of Object.entries(d.books))localStorage.setItem("number-garden-v1:"+id,JSON.stringify(s));localStorage.setItem("lww-fixture","yes");}window.__lwwSpoken=[];window.__lwwNoVoice=false;window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};speechSynthesis.getVoices=()=>window.__lwwNoVoice?[]:[{name:"Synthetic local English",voiceURI:"synthetic-local-en",lang:"en-US",localService:true,default:true}];speechSynthesis.cancel=()=>{};speechSynthesis.speak=u=>{window.__lwwSpoken.push(u.text);setTimeout(()=>u.onend?.(),0);};})('+json.dumps(fixture)+')')
    def app(route):
        response = route.fetch()
        body = response.text()
        marker = 'let graph=null,'
        assert body.count(marker) == 1
        body = body.replace(marker, 'window.__lwwRead=()=>structuredClone(state);'+marker, 1)
        i = body.index('bindLongWord(state,{')
        body = body[:i]+body[i:].replace('canExport:candidate=>', 'canExport:candidate=>!window.__lwwRefuse&&', 1)
        route.fulfill(response=response, body=body)
    c.route('**/app.mjs', app)
    p = c.new_page()
    p.on('pageerror', lambda error: errors.append(str(error)))
    p.goto(BASE+'#library/long-words')
    arrive(p)
    return c, p

def download(p):
    p.goto(BASE+'#notes')
    p.locator('#download').wait_for()
    dismiss_film(p)
    with p.expect_download() as d: p.locator('#download').click()
    return Path(d.value.path()).read_text()
def example(p, action_name, key, expected, help_value, expected_title=None):
    spoken_before = p.evaluate('window.__lwwSpoken')
    # The guard observes help already recorded when the example first enters the DOM.
    p.evaluate('''() => {window.__lwwDisclosure=[];window.__lwwObserver?.disconnect();window.__lwwObserver=new MutationObserver(()=>{const e=document.querySelector('[data-lww-example]');if(e)window.__lwwDisclosure.push(window.__lwwRead().longWordWorkshop);});window.__lwwObserver.observe(document.querySelector('main'),{childList:true,subtree:true});}''')
    tap(p, action_name)
    eq(p.locator('[data-lww-example] li').all_text_contents(), expected[:1], 'one example step initially')
    if expected_title is not None:
        eq(p.locator('[data-lww-example] h3').inner_text(), expected_title, 'finite example title displayed')
    seen = p.evaluate('window.__lwwDisclosure')
    ok(bool(seen), 'example disclosure observed')
    ok(help_value(seen[0]), 'help recorded before first disclosure')
    for count in range(2, len(expected)+1):
        tap(p, 'step', '[data-lww-key="'+key+'"]')
        eq(p.locator('[data-lww-example] li').all_text_contents(), expected[:count], 'each finite example step')
    ok(action(p, 'step').is_disabled(), 'last example step bounded')
    eq(p.evaluate('document.activeElement.dataset.lwwExample'), key, 'example retains focus after last step')
    tap(p, action_name)
    eq(p.locator('[data-lww-example]').count(), 0, 'example can close')
    p.evaluate('window.__lwwObserver.disconnect()')
    eq(p.evaluate('window.__lwwSpoken'), spoken_before, 'teaching/example controls never narrate excluded material')
def speech(p, kind, expected):
    before = p.evaluate('window.__lwwSpoken.length')
    p.locator('[data-lww-read="'+kind+'"]').tap()
    p.wait_for_function('(before)=>window.__lwwSpoken.length>before', arg=before)
    eq(p.evaluate('window.__lwwSpoken.length'), before+1, 'one new speech request per Hear action')
    eq(p.evaluate('window.__lwwSpoken.at(-1)'), ' '.join(expected.split()), 'only allowed '+kind+' narrated')

def main():
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True, executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
        try:
            for width, height in [(320,600),(820,1000),(1024,768)]:
                c, p = start(b, width, height)
                ok(root(p) is None, 'passive arrival allocates no workshop')
                eq(p.locator('.lww-arrival li').all_text_contents(), [
                    'Look at catchment on its card. Find catch and ment.',
                    'Put catch before ment. Check the whole word against the card.',
                    'The pieces help us check letters. We still need the meaning note.'], 'complete arrival teaching')
                p.locator('[data-lww-read=story]').dispatch_event('click')
                eq(p.evaluate('window.__lwwSpoken'), [], 'closed story is not narrated')
                p.locator('[data-lww-panel=story]>summary').tap()
                speech(p, 'story', "The librarian is making a glossary for the water and garden tables. Some long words have useful little pieces. Some need a family clue, and one brings a story about a name. Can we make the words clear enough for our next reader?")
                ok(root(p) is None, 'story does not allocate workshop')
                p.locator('[data-lww-panel=story]>summary').tap()
                p.goto(BASE+'#notes');p.locator('#download').wait_for();ok(root(p) is None, 'Notes does not allocate workshop')
                p.goto(BASE+'#words');p.locator('a[href="#library/long-words"]').click();arrive(p)
                action(p,'words').focus();p.keyboard.press('Enter');p.locator('[data-lww-word-picker]').wait_for()
                tap(p,'arrival')
                eq(p.locator('.lww-arrival li').all_text_contents(), [
                    'Look at catchment on its card. Find catch and ment.',
                    'Put catch before ment. Check the whole word against the card.',
                    'The pieces help us check letters. We still need the meaning note.'], 'Back to workshop repeats complete arrival teaching')
                tap(p,'words')
                eq(p.locator('[data-lww-word-picker] option').all_text_contents(), ['catchment','embankment','permeable','precipitation','photosynthesis','algorithm'], 'six literal checked cards')
                geometry(p)
                tap(p,'keep-word');ok(p.locator('.lww-stamp').is_visible(),'keep shows acknowledgment')
                p.locator('header a[href="#science"]').first.click();p.locator('[data-long-word-root]').wait_for(state='detached');p.goto(BASE+'#library/long-words');arrive(p)
                eq(p.locator('.lww-stamp').count(),0,'header navigation away and back clears acknowledgment')
                tap(p,'keep-word');first=word(p)['firstKept'];eq(first['check'],None,'unchecked empty keep')
                tap(p,'check-word');eq(word(p)['check']['status'],'empty','empty comparison')
                tap(p,'append','[data-lww-piece=ment]');tap(p,'append','[data-lww-piece=catch]')
                tap(p,'check-word');eq(word(p)['check']['status'],'different','different construction accepted')
                tap(p,'select-piece','[data-lww-piece=catch]')
                selected=p.locator('[data-lww-selected-piece]').inner_text()
                ok('Selected piece' in selected and 'catch' in selected,'visible selected-piece label names the selected piece')
                tap(p,'left')
                eq(word(p)['order'],['catch','ment'],'move left');eq(p.locator('#lww-feedback').count(),0,'edit hides stale check')
                tap(p,'right');eq(word(p)['order'],['ment','catch'],'move right');tap(p,'remove');eq(word(p)['order'],['ment'],'put back piece')
                tap(p,'append','[data-lww-piece=catch]');tap(p,'left');eq(word(p)['order'],['catch','ment'],'piece can be put back and reused')
                tap(p,'keep-word');eq(word(p)['latestKept']['check'],None,'edited draft kept as Not compared')
                for key, pieces in GROUPS:
                    choose(p,key)
                    if word(p)['order']:tap(p,'clear-word')
                    for piece in pieces:
                        tap(p,'append','[data-lww-piece='+piece+']')
                        ok(action(p,'append','[data-lww-piece='+piece+']').is_disabled(),'piece used once')
                    tap(p,'check-word');eq(word(p)['check']['status'],'matches','accepted literal construction '+str(pieces))
                    eq(word(p)['check']['text'],key,'concatenated spelling');eq(word(p)['check']['target'],key,'retained printed target')
                    tap(p,'keep-word');eq(word(p)['latestKept']['check']['status'],'matches','matching keep')
                    eq(p.locator('.lww-stamp').evaluate('e=>getComputedStyle(e).animationName'),'none','reduced-motion stamp static')
                    if key=='algorithm':expected=['Look at the name in its history note.','Keep algorithm as one piece.','Not every long word needs the same kind of clue.']
                    else:
                        one_way={'embankment':['embank','ment'],'photosynthesis':['photo','synthesis']}.get(key,pieces)
                        expected=['Look at the printed word and its clue.','Try '+' + '.join(one_way)+'.','Compare every letter with '+key+'. Another grouping may help too.']
                    example(p,'word-help','word-'+key,expected,lambda r,k=key:'example' in r['words'][k]['help'])
                    eq(word(p)['order'],pieces,'help never fills or changes rail')
                    geometry(p)
                choose(p,'catchment');eq(word(p)['firstKept'],first,'first keep preserved')
                p.locator('[data-lww-panel=word-catchment-first]>summary').tap();tap(p,'restore-word','[data-lww-edition=first]')
                eq(word(p)['order'],[],'Use these pieces restores first draft');ok('example' in word(p)['help'],'restore retains current help')
                tap(p,'next-word');eq(root(p)['activeWord'],'embankment','next word');tap(p,'previous-word');eq(root(p)['activeWord'],'catchment','previous word')
                speech(p,'sentence',"We are drawing the river's catchment on our map.")
                speech(p,'instruction','Build with the pieces. Compare with the printed word. You can change your version or keep it to discuss.')
                p.screenshot(path=str(OUT/f'words-{width}.png'),full_page=True)
                tap(p,'glossary');tap(p,'keep-glossary');gfirst=root(p)['glossary']['firstKept']
                tap(p,'check-glossary');eq(root(p)['glossary']['check']['status'],'incomplete','incomplete glossary')
                for key, (choices, fit, original, steps) in GLOSSARY.items():
                    line(p,key)
                    eq(p.locator('.lww-choices button').all_text_contents(), choices, 'literal equal glossary choices')
                    styles=p.locator('.lww-choices button').evaluate_all('xs=>xs.map(e=>[getComputedStyle(e).backgroundColor,getComputedStyle(e).fontWeight,e.className])')
                    ok(all(x==styles[0] for x in styles),'no correct/original styling cue')
                    for choice_id, literal in zip('abc',choices):
                        tap(p,'glossary-choice','[data-lww-choice='+choice_id+']');tap(p,'check-glossary')
                        row=next(x for x in root(p)['glossary']['check']['rows'] if x['id']==key)
                        eq(row['chosen'],literal,'checked literal chosen word');eq(row['status'],'matches' if choice_id==fit else 'different','each glossary choice outcome')
                        if choice_id==original:
                            original_line=next(x['before'] for x in root(p)['source']['glossary'] if x['id']==key)
                            eq(p.locator('.lww-paper>h3+p').inner_text(),original_line,'original choice leaves sentence printed')
                    example(p,'line-help','line-'+key,steps,lambda r,k=key:k+'-example' in r['glossary']['help'])
                    tap(p,'glossary-choice','[data-lww-choice='+fit+']');geometry(p)
                tap(p,'check-glossary');eq(root(p)['glossary']['check']['status'],'matching','all three glossary revisions match')
                tap(p,'keep-glossary');latest=root(p)['glossary']['latestKept']
                line(p,'g1');tap(p,'glossary-choice','[data-lww-choice=b]');eq(p.locator('#lww-feedback').count(),0,'glossary edit hides stale comparison')
                tap(p,'check-glossary');eq(root(p)['glossary']['check']['status'],'discussion','complete differing glossary')
                p.locator('[data-lww-panel=glossary-work-latest]>summary').tap();tap(p,'restore-glossary','[data-lww-edition=latest]')
                eq(root(p)['glossary']['picks'],latest['picks'],'restore glossary latest');eq(root(p)['glossary']['firstKept'],gfirst,'first glossary preserved')
                held=root(p)['glossary'];tap(p,'jobs');tap(p,'glossary');eq(root(p)['glossary'],held,'F4 uses same glossary')
                eq(p.locator('[data-lww-read]').evaluate_all('xs=>xs.filter(e=>!e.closest("details:not([open])")).map(e=>e.dataset.lwwRead)'),['instruction'],'glossary speech excludes alternatives and readbacks')
                p.screenshot(path=str(OUT/f'glossary-{width}.png'),full_page=True)
                for key,(choices,fit,lead,title,steps) in JOBS.items():
                    tap(p,'jobs');tap(p,'job','[data-lww-job='+key+']')
                    eq(p.locator('.lww-choices button').all_text_contents(),choices,'literal job choices')
                    eq(p.locator('.lww-paper>p').first.inner_text(),lead,'complete finite teaching lead')
                    eq(p.locator('.lww-paper>ol>li').all_text_contents(),['Find perme in permeation.','This word uses -able.','Check both parts in your chosen spelling.'] if key=='F1' else [],'guided steps only F1')
                    tap(p,'keep-job');jfirst=root(p)['jobs'][key]['firstKept'];tap(p,'check-job');eq(root(p)['jobs'][key]['checks'][-1]['outcome'],'incomplete','unchosen job comparison')
                    for choice_id in 'abc':
                        tap(p,'answer','[data-lww-choice='+choice_id+']');tap(p,'check-job')
                        eq(root(p)['jobs'][key]['checks'][-1]['outcome'],'fit' if choice_id==fit else 'different','each supplied job choice')
                    tap(p,'hint');ok(root(p)['jobs'][key]['help']['hint'],'hint retained')
                    eq(root(p)['jobs'][key]['source']['teach'][0]['title'],title,'finite example title')
                    example(p,'job-help','job-'+key+'-'+key+'-example',steps,lambda r,k=key:r['jobs'][k]['help']['example'],title)
                    tap(p,'answer','[data-lww-choice='+fit+']');tap(p,'check-job');tap(p,'keep-job')
                    eq(root(p)['jobs'][key]['latestKept']['check']['outcome'],'fit','job fitting keep');eq(root(p)['jobs'][key]['firstKept'],jfirst,'job first preserved')
                    speech(p,'prompt',root(p)['jobs'][key]['source']['prompt']);geometry(p)
                    tap(p,'clear-job');eq(root(p)['jobs'][key]['work']['choice'],None,'Put back clears only choice');eq(p.locator('#lww-feedback').count(),0,'job edit hides stale check')
                    held=root(p)['jobs'][key];tap(p,'skip');eq(root(p)['jobs'][key],held,'Skip preserves entire job immediately before skip')
                p.screenshot(path=str(OUT/f'jobs-{width}.png'),full_page=True)
                held=root(p);p.reload();arrive(p);eq(root(p),held,'reload exact activity and source')
                raw=download(p);eq(json.loads(raw)['longWordWorkshop'],held,'actual Notes download exact root');eq(p.locator('[data-long-word-notes]').count(),1,'Notes summary integrated')
                p.locator('#reset').click();p.locator('#confirm-reset').click();ok(root(p) is None,'reset clears workshop')
                p.goto(BASE+'#notes');p.locator('#progress-file').wait_for(state='attached');dismiss_film(p)
                p.locator('#progress-file').set_input_files({'name':'synthetic-long-words.json','mimeType':'application/json','buffer':raw.encode()})
                dismiss_film(p);p.locator('#progress-import-confirm').click();p.goto(BASE+'#library/long-words');arrive(p);eq(root(p),held,'actual import restores exact workshop');geometry(p);c.close()

            boundaries(b)
        finally: b.close()
    ok(not errors,'no page errors: '+str(errors))
    print(f'Long-Word Workshop actual-app browser: {n} assertions passed at 320/820/1024, with reduced motion, actual Notes transfer and explorer boundaries.')


def boundaries(b):
    # No voice is also deterministic: qualify the host fallback and requested
    # text routing only, never audible playback or installed system voices.
    c,p=start(b,390);p.evaluate('window.__lwwNoVoice=true')
    p.locator('[data-lww-panel=story]>summary').tap()
    p.locator('[data-lww-read=story]').tap()
    eq(p.locator('[data-speech-status]').inner_text(),
       'No local English voices are available yet. Refresh after voices load, or read together.',
       'Hear offers the host read-together fallback without a local voice')
    eq(p.evaluate('window.__lwwSpoken'),[],'no speech request without a local voice')
    ok(root(p) is None,'unavailable narration does not allocate workshop work')
    tap(p,'words');tap(p,'append','[data-lww-piece=catch]')
    eq(word(p)['order'],['catch'],'workshop remains playable without a local voice');c.close()
    c,p=start(b,820);tap(p,'words');tap(p,'append','[data-lww-piece=catch]');owner1=root(p)
    old=p.evaluate_handle('document.querySelector("[data-lww-action=append][data-lww-piece=ment]")')
    p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-2]').tap();arrive(p)
    ok(root(p) is None,'second explorer separate workshop');tap(p,'words');tap(p,'append','[data-lww-piece=ment]');owner2=root(p)
    old.evaluate('e=>e.click()');eq(root(p),owner2,'detached owner control blocked')
    p.locator('#explorer-switch').tap();p.locator('[data-select-explorer=explorer-1]').tap();arrive(p);eq(root(p),owner1,'original owner restored')
    for name in ['word-help','append']:
        before=root(p);p.evaluate('window.__lwwRefuse=true');tap(p,name,'[data-lww-piece=ment]' if name=='append' else '')
        eq(root(p),before,'refused preflight leaves entire root unchanged');eq(p.locator('[data-lww-example]').count(),0,'refused help not disclosed')
        ok('stays as it was' in p.locator('#lww-status').inner_text(),'local preflight refusal');p.evaluate('window.__lwwRefuse=false')
    before=root(p)
    p.evaluate('const d=document.createElement("dialog");d.className="welcome-film";d.open=true;document.body.append(d)')
    action(p,'append','[data-lww-piece=ment]').dispatch_event('click');eq(root(p),before,'film blocks underlying controls');p.evaluate('document.querySelector("dialog.welcome-film").remove()')
    hidden=action(p,'append','[data-lww-piece=ment]');hidden.evaluate('e=>e.style.visibility="hidden"');hidden.dispatch_event('click');eq(root(p),before,'hidden control blocked');hidden.evaluate('e=>e.style.visibility="visible"')
    old=p.evaluate_handle('document.querySelector("[data-lww-action=append][data-lww-piece=ment]")');p.goto(BASE+'#words');p.goto(BASE+'#library/long-words');arrive(p);old.evaluate('e=>e.click()');eq(root(p),before,'old route control blocked')
    # A real second tab writes newer work; this stale tab may continue in memory,
    # but it must not overwrite the saved notebook.
    q=c.new_page();q.on('pageerror',lambda error:errors.append(str(error)));q.goto(BASE+'#library/long-words');arrive(q);tap(q,'append','[data-lww-piece=ment]')
    p.wait_for_function('document.querySelector("[data-save-warning]")?.textContent.includes("another tab")')
    saved=q.evaluate('localStorage.getItem("number-garden-v1:explorer-1")');tap(p,'append','[data-lww-piece=ment]')
    eq(p.evaluate('localStorage.getItem("number-garden-v1:explorer-1")'),saved,'stale tab never overwrites newer save')
    ok('another tab' in p.locator('[data-lww-saving]').inner_text(),'stale-tab warning stays local');held=root(p);eq(json.loads(download(p))['longWordWorkshop'],held,'stale memory work downloadable');c.close()

    c,p=start(b,390);p.goto(BASE+'#notes');p.locator('#remember').uncheck();p.goto(BASE+'#library/long-words');tap(p,'words');tap(p,'append','[data-lww-piece=catch]')
    ok('page stays open' in p.locator('[data-lww-saving]').inner_text(),'save-off local message');held=root(p);eq(json.loads(download(p))['longWordWorkshop'],held,'save-off actual download');c.close()
    c,p=start(b,390);tap(p,'words');p.evaluate('() => {Storage.prototype.setItem=function(){throw new Error("Synthetic storage failure")};}');tap(p,'append','[data-lww-piece=catch]')
    eq(word(p)['order'],['catch'],'failed storage retains memory work');ok(bool(p.locator('[data-lww-saving]').inner_text()),'storage failure local message');held=root(p);eq(json.loads(download(p))['longWordWorkshop'],held,'storage failure actual download');c.close()

    earlier=seed(True);r=earlier['longWordWorkshop'];r['words']['catchment']['order']={'future':['raw']};r['opaqueSibling']={'future':['retained']}
    c,p=start(b,820,first=earlier);ok('cannot be played' in p.locator('main').inner_text(),'opaque word explains unavailable work');tap(p,'glossary');tap(p,'words')
    ok(p.locator('[data-lww-word-picker]').is_visible(),'opaque active draft still offers word picker after changing sections');choose(p,'permeable');tap(p,'append','[data-lww-piece=perme]')
    eq(root(p)['words']['catchment'],r['words']['catchment'],'opaque sibling unchanged');eq(root(p)['opaqueSibling'],r['opaqueSibling'],'unknown root fields retained');geometry(p)
    held=root(p);eq(json.loads(download(p))['longWordWorkshop'],held,'opaque data actual export exact');c.close()
    kept_boundaries(b)
    earlier=seed(True);r=earlier['longWordWorkshop'];r['view']='glossary';r['glossary']={'picks':{'g1':{'future':'raw'}},'help':[],'activeLine':'g1'}
    c,p=start(b,820,first=earlier);ok(action(p,'glossary-choice').is_disabled(),'opaque glossary choice read-only');line(p,'g2');tap(p,'glossary-choice','[data-lww-choice=b]');tap(p,'check-glossary')
    eq(root(p)['glossary']['check']['coverage'],'partial','readable glossary comparison explicitly partial');eq(root(p)['glossary']['picks']['g1'],{'future':'raw'},'opaque glossary selection retained');geometry(p);c.close()
    future=seed();future['longWordWorkshop']={'v':99,'future':['raw']};c,p=start(b,390,first=future)
    ok('format we cannot open' in p.locator('main').inner_text(),'future root notice');eq(root(p),future['longWordWorkshop'],'future root unchanged');eq(json.loads(download(p))['longWordWorkshop'],future['longWordWorkshop'],'future root exported exact')
    p.goto(BASE+'#words');ok(p.locator('a[href="#library/long-words"]').count()>0,'other Word Garden destinations remain available');c.close()


def kept_boundaries(b):
    c,p=start(b,820);tap(p,'words');choose(p,'embankment')
    for piece in ['em','bank','ment']:tap(p,'append','[data-lww-piece='+piece+']')
    tap(p,'check-word');tap(p,'keep-word');tap(p,'clear-word')
    for piece in ['embank','ment']:tap(p,'append','[data-lww-piece='+piece+']')
    tap(p,'check-word');tap(p,'keep-word')
    for edition,expected in [('first','em + bank + ment'),('latest','embank + ment')]:
        panel=p.locator('[data-lww-panel=word-embankment-'+edition+']')
        panel.locator('summary').tap()
        eq(panel.locator('[data-lww-kept-pieces]').inner_text(),expected,'kept grouping remains visibly distinct '+edition)
        eq(panel.locator('[data-lww-check-pieces]').inner_text(),expected,'kept check preserves visible piece boundaries '+edition)
    held=root(p);raw=download(p)
    notes=p.locator('[data-long-word-notes]')
    notes.evaluate('e=>{e.open=true;e.querySelectorAll("details").forEach(d=>d.open=true)}')
    for selector in ['[data-lww-kept-pieces]:visible','[data-lww-check-pieces]:visible']:
        visible=notes.locator(selector).all_text_contents()
        ok('em + bank + ment' in visible and 'embank + ment' in visible,'Notes visibly distinguishes both retained groupings '+selector)
    eq(json.loads(raw)['longWordWorkshop'],held,'boundary readouts do not change retained records');c.close()

    earlier=seed(True);r=earlier['longWordWorkshop']
    r['words']['catchment']['firstKept']={'order':['retired-piece'],'helpBefore':[],'check':None}
    c,p=start(b,820,first=earlier)
    panel=p.locator('[data-lww-panel=word-catchment-first]');panel.locator('summary').tap()
    ok(panel.locator('.lww-notice').is_visible(),'missing-piece historical keep shows recovery notice')
    eq(panel.locator('[data-lww-action=restore-word]:enabled').count(),0,'missing-piece historical keep has no enabled restore')
    eq(root(p)['words']['catchment']['firstKept'],r['words']['catchment']['firstKept'],'unplayable historical keep retained exactly');c.close()

    earlier=seed(True);r=earlier['longWordWorkshop'];r['view']='jobs'
    r['jobs']['F4']={'future':['opaque-F4']};r['jobs']['retired']={'future':['opaque-retired']}
    c,p=start(b,820,first=earlier)
    eq(p.locator('[data-lww-action=job]').evaluate_all('xs=>xs.map(e=>e.dataset.lwwJob)'),['F1','F2','F3'],'opaque F4 and retired job records are not playable buttons')
    tap(p,'glossary');held=root(p)['glossary'];tap(p,'jobs');tap(p,'glossary')
    eq(root(p)['glossary'],held,'F4 glossary entry still opens the same glossary record')
    eq(root(p)['jobs'],r['jobs'],'opaque F4 and retired job records preserved after glossary navigation')
    held=root(p);eq(json.loads(download(p))['longWordWorkshop'],held,'opaque jobs preserved in actual Notes download');c.close()

if __name__ == '__main__': main()
