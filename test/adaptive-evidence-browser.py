"""Synthetic original-literature visits through the actual local app at phone/tablet widths."""
import json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('ENGLISH_TEST_URL','http://127.0.0.1:4198/')
OUT=Path(os.environ.get('ENGLISH_ARTIFACTS','/tmp/adaptive-evidence-browser'));OUT.mkdir(parents=True,exist_ok=True)
initial=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {freshState} from './dist/core.mjs';import {initializeExplorerState} from './dist/progress-transfer.mjs';const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
n=0
def ok(v,m):
 global n
 assert v,m
 n+=1
def notebook(p):return p.evaluate("()=>{const e=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+e.activeId));}")
def branch(p):return notebook(p)['evidenceVoice']
def work(p):return branch(p)['units'][branch(p)['current']]
def go(p,h='#learn/english'):
 p.goto(BASE+h);p.locator('[data-ev-root]' if h.startswith('#learn/english') else 'main').wait_for()
def create(p,story,challenge='1',reader='newcomer'):
 p.locator('[data-ev-story]').select_option(story);p.locator('[data-ev-challenge]').select_option(challenge);p.locator('[data-ev-reader]').select_option(reader);p.locator('[data-ev-create]').click();p.locator('#ev-heading').wait_for()
def lesson(p,name):p.locator(f'.ev-lessons [data-ev-open="{name}"]').click()
def bounds(p):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 ok(not p.locator('[data-ev-root] button,[data-ev-root] select,[data-ev-root] a,[data-ev-root] summary').evaluate_all("xs=>xs.filter(x=>{let r=x.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<43.9}).map(x=>x.textContent)"),'44px controls')
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 errors=[]
 try:
  for width in [320,820]:
   c=b.new_context(viewport={'width':width,'height':1050},has_touch=True,accept_downloads=True,reduced_motion='reduce')
   c.add_init_script("if(!localStorage.getItem('adaptive-english-fixture')){localStorage.setItem('number-garden-v1',"+json.dumps(json.dumps(initial))+");localStorage.setItem('adaptive-english-fixture','1');}")
   def app(route):
    response=route.fetch();body=response.text();assert 'bindEvidenceVoice(state,options)' in body
    route.fulfill(response=response,body=body.replace('bindEvidenceVoice(state,options)','bindEvidenceVoice(state,{...options,canExport:c=>!window.__englishRefuse&&options.canExport(c)})'))
   c.route('**/app.mjs',app)
   p=c.new_page();p.on('pageerror',lambda e:(errors.append(str(e)),print('Page error:',str(e),flush=True)));go(p,'#learn/english/revise')
   ok('evidenceVoice' not in notebook(p),'deep writing preview save-neutral');bounds(p)
   p.locator('[data-ev-story]').select_option('last-seat');ok('evidenceVoice' not in notebook(p),'story choice save-neutral')
   create(p,'last-seat','2','skeptic');ok(work(p)['source']['id']=='last-seat','fresh whole story selected');ok(len(work(p)['source']['chapters'])==3,'three complete chapters');ok(work(p)['visit']['challenge']==2,'learner override challenge');ok(work(p)['source']['reader']['id']=='skeptic','reader selected');ok(work(p)['lesson']=='before','new visit begins with explicit first lesson');ok(p.evaluate('document.activeElement.id')=='ev-heading','create local focus')
   p.locator('[data-ev-whole] > summary').click();ok(p.locator('[data-ev-whole] .ev-passage').count()==9,'whole story always open');p.wait_for_function("()=>{const e=JSON.parse(localStorage.getItem('learning-garden-explorers'));const s=JSON.parse(localStorage.getItem('number-garden-v1:'+e.activeId));return s.evidenceVoice.units[s.evidenceVoice.current].exposed.length===3}");ok(len(work(p)['exposed'])==3,'whole text exposure distinct');lesson(p,'write');ok('plausible rival explanation' in p.locator('#ev-heading + p').inner_text(),'actual reader request')
   exact='  My own reading\nA chair and a space can meet different needs.  '
   p.locator('[data-ev-field="paragraph"]').fill(exact);p.locator('[data-ev-keep="draft"]').click();first=work(p)['firstDraft'];lesson(p,'revise');ok(exact in p.locator('.ev-earlier').inner_text(),'exact first draft returned');p.locator('[data-ev-field="objection"]').fill('The plan does not show whether Ada knew.');p.locator('[data-ev-field="revision"]').fill('The arrangement should explain both requests and the missing communication.');p.locator('[data-ev-keep="revision"]').click();old=branch(p);old_key=old['current'];old_work=work(p)
   create(p,'map-drawer','3','committee');ok(work(p)['source']['id']=='map-drawer','changing story gives different literature');ok(work(p)['source']['chapters'][0]['paragraphs'][0]['text']!=old_work['source']['chapters'][0]['paragraphs'][0]['text'],'not a sentence shuffle');ok(branch(p)['units'][old_key]==old_work,'all older writing retained');lesson(p,'write');ok('Recommend' in p.locator('#ev-heading + p').inner_text(),'committee purpose differs');lesson(p,'later');q=work(p)['source']['questions'][2];choice=next(x for x in q['choices'] if x['outcome']=='fits');p.locator(f'[data-ev-answer="{q["id"]}:{choice["id"]}"]').click();ok(work(p)['firstResponses'][q['id']]['outcome']=='fits','structured first response frozen');ok(p.evaluate('document.activeElement.id')=='ev-feedback-'+q['id'],'feedback local focus')
   create(p,'harbour-light','1');ok('water' in work(p)['source']['chapters'][0]['paragraphs'][0]['text'],'third original story');create(p,'last-seat','3','committee');ok(work(p)['visit']['familiarity']=='rereading','repeat text marked rerereading');ok('Rereading a familiar story' in p.locator('.ev-visit').inner_text(),'rereading visible');bounds(p)
   p.locator('.ev-exploration').scroll_into_view_if_needed();p.screenshot(path=str(OUT/f'english-changing-stories-{width}.png'),full_page=False)
   saved=branch(p);go(p,'#learn/english/revise');ok(branch(p)==saved,'requested later lesson preview save-neutral');ok(p.locator('.ev-preview').is_visible(),'requested preview visible');p.locator('.ev-preview [data-ev-open="revise"]').click();p.locator('[data-ev-support="hint"]').focus();p.keyboard.press('Enter');ok(p.evaluate('document.activeElement.dataset.evSupport')=='hint','keyboard support retains local focus');p.locator('[data-ev-skip]').click();ok(p.evaluate('document.activeElement.hasAttribute("data-ev-skip")'),'skip local focus')
   saved=branch(p);p.reload();p.locator('[data-ev-root]').wait_for();ok(branch(p)==saved,'reload exact source and work');p.evaluate("window.staleEnglishCreate=document.querySelector('[data-ev-create]')");go(p,'#notes');p.evaluate('window.staleEnglishCreate.click()');ok(branch(p)==saved,'stale detached creation inert')
   with p.expect_download() as d:p.locator('#download').click()
   report=json.loads(Path(d.value.path()).read_text());ok(report['evidenceVoice']==saved,'actual pretty notes download exact');owner=p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
   p.locator('#progress-file').set_input_files({'name':'synthetic-changing-stories.json','mimeType':'application/json','buffer':json.dumps(report).encode()});p.locator('#progress-import-confirm').click();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual file import');go(p);ok(branch(p)==saved,'actual import preserves all drafts/sources');create(p,'map-drawer','1');imported=branch(p);ok(len(imported['units'])==len(saved['units'])+1,'imported explorer has own visits');p.locator('#explorer-switch').click();p.locator(f'[data-select-explorer="{owner}"]').click();go(p);ok(branch(p)==saved,'separate explorer unchanged by imported copy work')
   p.locator('.ev-removal > summary').click();p.locator('[data-ev-remove-choice]').select_option(old_key);p.locator('[data-ev-remove-review]').click();ok('working writing fields' in p.locator('[data-ev-remove-warning]').inner_text(),'removal warning names writing');p.locator('[data-ev-remove-cancel]').click();ok(branch(p)==saved,'cancel removal unchanged');p.locator('[data-ev-remove-review]').click();p.locator('[data-ev-remove-confirm]').click();ok(old_key not in branch(p)['units'],'only selected generated copy removed');ok(len(branch(p)['units'])==len(saved['units'])-1,'other sources retained');ok(branch(p)['exploration']==saved['exploration'],'serial retained after removal');bounds(p)
   lesson(p,'write');p.locator('[data-ev-field="paragraph"]').fill('Last saved synthetic words.');held=branch(p);p.evaluate('window.__englishRefuse=true');p.locator('[data-ev-field="paragraph"]').fill('Visible unsaved synthetic words.');ok(branch(p)==held,'failed host preflight preserves whole saved branch');ok(p.evaluate('document.activeElement.dataset.evField')=='paragraph','failed typing keeps field focus');p.locator('[data-ev-create]').click();ok(p.locator('[data-ev-field="paragraph"]').input_value()=='Visible unsaved synthetic words.','new-copy action preserves visible failed text');p.locator('#explorer-switch').click();ok(p.locator('[data-ev-root]').is_visible(),'explorer switch guarded while words unsaved');p.locator('[data-ev-root] a[href="#notes"]').first.click();ok(p.locator('[data-ev-root]').is_visible(),'notes link guarded while words unsaved');p.once('dialog',lambda d:d.dismiss());p.locator('[data-ev-restore]').click();ok(p.locator('[data-ev-field="paragraph"]').input_value()=='Visible unsaved synthetic words.','cancel restore retains visible words');p.once('dialog',lambda d:d.accept());p.locator('[data-ev-restore]').click();ok(p.locator('[data-ev-field="paragraph"]').input_value()=='Last saved synthetic words.','confirmed restore reveals exact saved writing');ok(branch(p)==held,'restore does not change notebook');p.evaluate('window.__englishRefuse=false');create(p,'harbour-light');ok(work(p)['source']['id']=='harbour-light','next story reachable after explicit restore')
   create(p,'last-seat');wrong_key=branch(p)['current']
   for j in range(2):
    q=work(p)['source']['questions'][j];lesson(p,q['lesson']);choice=next(x for x in q['choices'] if x['outcome']=='different');p.locator(f'[data-ev-answer="{q["id"]}:{choice["id"]}"]').click();frozen=work(p)['firstResponses'][q['id']];ok(frozen['skippedBefore'] is False,'attempt freezes no prior skip');before_reason=p.locator('.ev-exploration > p').first.inner_text();p.locator('[data-ev-skip]').click();ok(work(p)['firstResponses'][q['id']]==frozen,'later skip retains frozen first response');ok(p.locator('.ev-exploration > p').first.inner_text()==before_reason,'later skip cannot erase prior routing evidence')
   first_wrong=branch(p)['units'][wrong_key]['firstResponses']
   for story in ['map-drawer','last-seat']:
    create(p,story)
    for j in range(2):
     q=work(p)['source']['questions'][j];lesson(p,q['lesson']);choice=next(x for x in q['choices'] if x['outcome']=='fits');p.locator(f'[data-ev-answer="{q["id"]}:{choice["id"]}"]').click()
   ok(p.locator('.ev-exploration > p').first.inner_text().startswith('Two distinct first checks differed'),'repeated copy cannot replace earliest wrong context');ok(branch(p)['units'][wrong_key]['firstResponses']==first_wrong,'repeated copy preserves old wrong evidence')
   last_keys=[key for key,w in branch(p)['units'].items() if w['source']['id']=='last-seat']
   for key in last_keys:
    p.locator('.ev-removal > summary').click();p.locator('[data-ev-remove-choice]').select_option(key);p.locator('[data-ev-remove-review]').click();p.locator('[data-ev-remove-confirm]').click()
   ok(not any(w['source']['id']=='last-seat' for w in branch(p)['units'].values()),'all selected copies of one story removed');ok('last-seat' in branch(p)['exploration']['seenStories'],'only story ID retains familiarity after all copies removed');ok('rereading' in p.locator('[data-ev-story] option[value="last-seat"]').inner_text(),'selector retains rereading label after all copies removed');create(p,'last-seat');ok(work(p)['visit']['familiarity']=='rereading','recreated story never relabeled unseen');p.reload();
   p.locator('[data-ev-root], [data-select-explorer]').first.wait_for()
   if p.locator(f'[data-select-explorer="{owner}"]').count():p.locator(f'[data-select-explorer="{owner}"]').click()
   try:p.locator('[data-ev-root]').wait_for()
   except Exception:
    print('Reload body:',p.locator('body').inner_text()[:3000],flush=True);raise
   ok(work(p)['visit']['familiarity']=='rereading','rereading survives reload after removal');c.close()
  ok(not errors,'no browser page errors '+str(errors));print(f'Adaptive Evidence & voice Chrome: {n} assertions at320/820.')
 finally:b.close()
