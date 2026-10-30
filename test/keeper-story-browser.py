"""Synthetic Chrome journeys for the parcel and first Keeper's Page; no learner files."""
import copy, json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('KEEPER_TEST_URL','http://127.0.0.1:4193/')
OUT=Path(os.environ.get('KEEPER_ARTIFACTS','/tmp/keeper-story-browser'));OUT.mkdir(parents=True,exist_ok=True)
fixtures=json.loads(subprocess.check_output(['node','--input-type=module','-e',r"""
import {freshState} from './dist/core.mjs';
import {initializeExplorerState} from './dist/progress-transfer.mjs';
import {freshStory} from './dist/keeper-story-core.mjs';
import {ensureCafe,nextGuest,orderFor,adjustBite,checkPlate,skipCafeStage,serveCafe,currentRecipe} from './dist/cafe-core.mjs';
import {ingredients} from './dist/cafe-content.mjs';
const base=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
function prepare(s){nextGuest(s);const o=orderFor(s.cafe),f=ingredients.find(i=>!i.orchard&&o.wanted.every(p=>i.properties.includes(p)));for(let n=0;n<o.bites;n++)adjustBite(s,f.id,1);if(!checkPlate(s)||!skipCafeStage(s)||!skipCafeStage(s))throw Error('Bad synthetic preparation');for(const x of currentRecipe(s.cafe))s.cafe.stock[x.ingredient.id]=x.required;}
const five=base();five.cafe.seed=192;five.cafe.range='small';for(let n=0;n<5;n++){prepare(five);if(!serveCafe(five))throw Error('Bad synthetic service');}
const sixth=structuredClone(five);prepare(sixth);sixth.story=freshStory();
const legacy6=base();legacy6.cafe.served=6;delete legacy6.cafe.supper;
const plus6=base();plus6.cafe.served=6;plus6.cafe.supper={round:2,startedAtServed:6};
const freshMarker=base();freshMarker.story=freshStory();
console.log(JSON.stringify({base:base(),five,sixth,legacy6,plus6,freshMarker}));
"""],cwd=ROOT,text=True))
checks=0;errors=[];contexts=[]
def ok(value,message):
 global checks
 assert value,message
 checks+=1

def book(p):return p.evaluate('()=>window.__keeperRead()')
def active(p):return p.evaluate("JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId")
def learning(s):return {k:copy.deepcopy(s.get(k)) for k in ['baseline','practice','puzzles','sessions','broad','garden','facts']}
def setup(browser,width,seed='base',failed=False):
 c=browser.new_context(viewport={'width':width,'height':1000},has_touch=True,accept_downloads=True);contexts.append(c)
 payload=None if seed is None else (fixtures[seed] if isinstance(seed,str) else seed)
 init="""({seed,failed})=>{if(seed&&!localStorage.getItem('keeper-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('keeper-fixture','1');}window.__keeperSpeech=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{name:'Synthetic English',voiceURI:'synthetic-en',lang:'en-US',localService:true,default:true},{name:'Synthetic French',voiceURI:'synthetic-fr',lang:'fr-FR',localService:true}],cancel(){},addEventListener(){},removeEventListener(){},speak(u){__keeperSpeech.push({text:u.text,lang:u.lang,voice:u.voice?.lang});}}});if(failed)Storage.prototype.setItem=function(){throw Error('Synthetic storage failure');};}"""
 c.add_init_script('('+init+')('+json.dumps({'seed':payload,'failed':failed})+')')
 def app(route):
  response=route.fetch();body=response.text().replace('let graph=null,','window.__keeperRead=()=>structuredClone(state);let graph=null,');route.fulfill(response=response,body=body)
 c.route('**/app.mjs',app)
 p=c.new_page();p.on('pageerror',lambda e:errors.append(str(e)));return c,p

def go(p,hash):
 p.goto(BASE+hash)
 selector={'#home':'[data-keeper-root]','#almanac':'.keeper-pages','#almanac/keepers':'.keeper-pages','#cafe':'[data-cafe-view]','#notes':'#download','#explore':'#explore-title','#companions':'[data-guide="mira"]'}.get(hash,'main')
 p.locator(selector).first.wait_for(state='attached')
def dismiss(p,how='skip'):
 p.locator('dialog.welcome-film[open]').wait_for()
 if how=='skip':p.locator('[data-film-skip]').click()
 elif how=='escape':p.keyboard.press('Escape')
 else:p.locator('dialog.welcome-film iframe').element_handle().content_frame().evaluate("parent.postMessage('garden-film-finished',location.origin)")
 p.locator('dialog.welcome-film').wait_for(state='detached')
def bounds(p,selector='[data-keeper-root]'):
 ok(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'no horizontal overflow')
 bad=p.locator(selector+' button,'+selector+' a,'+selector+' summary').evaluate_all("xs=>xs.filter(x=>x.getClientRects().length&&x.getBoundingClientRect().height<44).map(x=>({text:x.textContent,h:x.getBoundingClientRect().height}))")
 ok(not bad,'44px controls: '+str(bad))
def keep(p):p.locator('[data-keeper-keep]').click()
def reveal(p):p.locator('[data-keeper-reveal]').click();p.locator('[data-keeper-reading]').wait_for()
def reload(p,selector='.keeper-pages'):
 identity=active(p);p.reload();p.locator('#explorer-header').wait_for()
 if p.locator('[data-select-explorer]').count():p.locator('[data-select-explorer="'+identity+'"]').click()
 p.locator(selector).wait_for()
def download(p):
 go(p,'#notes')
 with p.expect_download() as d:p.locator('#download').click()
 return json.loads(Path(d.value.path()).read_text())
def bring(p,value):
 go(p,'#notes');p.locator('#progress-file').set_input_files({'name':'synthetic-story.json','mimeType':'application/json','buffer':json.dumps(value).encode()});p.locator('#progress-import-confirm').click();p.locator('#progress-import-status').wait_for();ok('Notebook brought' in p.locator('#progress-import-status').inner_text(),'actual JSON import')

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))
 try:
  for width in [320,820]:
   # Real fresh ExplorerStore state; the film blocks the parcel, not the other way around.
   c,p=setup(browser,width,None);go(p,'#home');p.locator('dialog[open]').wait_for();ok(not p.locator('[data-keeper-intro]').is_visible(),'fresh parcel hidden behind storm film');s=book(p);ok(s['story']['opening']=='fresh' and s['story']['seenScenes']==[],'new structural context has no completed scene');dismiss(p);p.locator('[data-keeper-intro]').wait_for();ok('Everything drips' in p.locator('[data-keeper-intro]').inner_text(),'fresh opening');bounds(p);p.screenshot(path=str(OUT/f'parcel-fresh-{width}.png'),full_page=True)
   ok(p.locator('.keeper-paper-edge').count()==0,'no windowsill before keeping');p.locator('.home-options summary').click();p.locator('[data-film-replay="welcome"]').click();dismiss(p);ok(p.locator('[data-film-replay="welcome"]').evaluate('x=>document.activeElement===x'),'manual welcome replay returns focus to its button');ok(book(p)['story']['seenScenes']==[],'manual replay writes no scene');keep(p);reminder=p.locator('[data-keeper-reminder]');ok(reminder.is_visible(),'Home Keep shows reminder directly');ok('Pip tucks the wrapper' in reminder.inner_text() and 'drying on the bakery windowsill' in reminder.inner_text(),'After and short reminder are visible');ok(reminder.evaluate('x=>document.activeElement===x'),'Home Keep focuses the reminder');ok(reminder.locator('details.keeper-replay').count()==1 and reminder.locator('details details').count()==0,'one actual parcel replay, no nested hidden reminder');p.screenshot(path=str(OUT/f'parcel-kept-{width}.png'),full_page=True);reminder.locator('summary').click();ok(reminder.locator('details').evaluate('x=>x.open'),'actual parcel replay opens');ok('Everything drips' in reminder.locator('details').inner_text(),'replay actually reveals scene text');ok(book(p)['story']['seenScenes']==['parcel-found'],'parcel reread adds no scene');before=copy.deepcopy(book(p));go(p,'#almanac');ok(book(p)['story']==before['story'],'opening almanac is read-only');p.locator('.keeper-paper-edge').wait_for();ok('storm'==book(p)['story']['arrival'],'fresh arrival retained');ok(p.locator('[data-keeper-reading]').count()==0,'unearned page not shown');bounds(p);c.close()
   # Existing five-table notebook gets catch-up copy, edge after Keep, and no credit from replaying film.
   c,p=setup(browser,width,'five');go(p,'#almanac');ok('Pip has been keeping something' in p.locator('[data-keeper-intro]').inner_text(),'returning catch-up');ok('story' not in book(p),'old notebook stays untouched on view');keep(p);ok(book(p)['story']['opening']=='returning' and 'arrival' not in book(p)['story'],'returning creation invents no arrival');ok(p.locator('.keeper-paper-edge').is_visible(),'five tables show stuck edge');ok('Sponge' in p.locator('.keeper-paper-edge').inner_text(),'edge word');before=copy.deepcopy(book(p)['story']);go(p,'#home');p.locator('.home-options summary').click();p.locator('[data-film-replay="welcome"]').click();dismiss(p);ok(book(p)['story']==before,'manual storm replay adds no contribution');go(p,'#almanac');ok(p.locator('[data-keeper-reveal]').count()==0,'five tables still no page');c.close()
   # A genuine sixth service: both number questions were skipped, but all six table services are real.
   c,p=setup(browser,width,'sixth');go(p,'#cafe');before=book(p);ok(before['cafe']['served']==5 and before['cafe']['current']['total']['skipped'] and before['cafe']['current']['shortfall']['skipped'],'supported sixth order ready');p.locator('[data-cafe-action="serve"]').click();p.locator('dialog[open]').wait_for();after=book(p);ok(after['cafe']['served']==6,'sixth service increments once');ok(after['story']['acts']['I']['ended'] and after['story']['acts']['I']['receipt']['served']==6,'serve observer retains ending');ok(not p.locator('[data-keeper-invite]').is_visible(),'cafe film comes before page invitation');dismiss(p);p.locator('[data-keeper-invite]').wait_for();p.locator('[data-film-replay="cafe"]').click();dismiss(p);ok(p.locator('[data-film-replay="cafe"]').evaluate('x=>document.activeElement===x'),'manual cafe replay returns focus to its button');ok('parcel' in p.locator('[data-keeper-invite]').inner_text(),'unfound parcel invitation');go(p,'#almanac');keep(p);ok(book(p)['cafe']['served']==6,'Keep uses no further table credit');reveal(p);ok(book(p)['story']['seenScenes']==['parcel-found','old-map-revealed'],'two scenes kept');ok(p.locator('[data-keeper-reading]').inner_text().startswith('An old map'),'short default');ok('Hollis' not in p.locator('.keeper-pages').inner_text(),'no author-name spoiler');bounds(p)
   # Reading choices, map and glossary are not learning records or global language preferences.
   stable=learning(book(p));p.locator('[data-keeper-amount="longer"]').click();ok('wide green patch' in p.locator('[data-keeper-reading]').inner_text(),'longer page');p.locator('[data-keeper-amount="original"]').click();ok('[smudged word]' in p.locator('[data-keeper-reading]').inner_text(),'original smudged marker');p.locator('.keeper-map-page > [data-speak]').click();utterance=p.evaluate('__keeperSpeech.at(-1)');ok('a smudged word' in utterance['text'] and '[' not in utterance['text'],'speech says smudged word');ok(utterance['voice']=='en-US','English local voice');overlayLabel=p.locator('[data-keeper-overlay]').inner_text();p.locator('[data-keeper-overlay]').click();ok(p.locator('[data-keeper-overlay]').inner_text()==overlayLabel and p.locator('[data-keeper-overlay]').get_attribute('aria-pressed')=='true','overlay keeps fixed label with pressed state');ok(p.locator('.keeper-glossary').get_attribute('role')=='group' and p.locator('[aria-label="Page reading amount"]').get_attribute('role')=='group','glossary and reading choices are labelled groups');ok(p.locator('[data-keeper-overlay-label]').is_visible(),'orchard overlay prose label');ok(p.locator('[data-keeper-orchard-art]').is_visible() and p.locator('[data-keeper-orchard-art]').evaluate("x=>getComputedStyle(x).display!=='none'"),'orchard outline actually displays without replacing old map');p.locator('.keeper-glossary summary').first.click();ok('wet ground' in p.locator('.keeper-glossary').inner_text(),'marsh glossary');ok(learning(book(p))==stable,'story reading/overlay/glossary changes no learning or global reading data');p.screenshot(path=str(OUT/f'old-map-{width}.png'),full_page=True)
   first=copy.deepcopy(book(p)['story']['acts']['I']);go(p,'#cafe');p.locator('[data-cafe-action="new-game-plus"]').click();ok(book(p)['cafe']['supper']['round']==2,'new game plus preserved');ok(book(p)['story']['acts']['I']==first,'new gathering preserves receipt');go(p,'#home');ok('Read the old map again' in p.locator('[data-keeper-invite]').inner_text(),'revisit invitation after reading');go(p,'#almanac');ok(book(p)['story']['pageAmount']=='original','reading amount survives navigation');reload(p);go(p,'#almanac');ok('[smudged word]' in p.locator('[data-keeper-reading]').inner_text(),'page amount/reached ending survive reload');raw=download(p);story=copy.deepcopy(raw['story']);bring(p,raw);go(p,'#almanac');ok(book(p)['story']==story,'actual export/import preserves story');original=active(p);p.locator('#explorer-switch').click();p.locator('#explorer-new').click();p.locator('#explorer-create').click();dismiss(p);ok(book(p)['story']['seenScenes']==[],'new explorer has separate scenes');p.locator('#explorer-switch').click();p.locator('[data-select-explorer="'+original+'"]').click();go(p,'#almanac');ok(book(p)['story']==story,'switch back restores exact story');c.close()
   # Legacy/NewGamePlus and malformed saved sibling recovery.
   for fixture in ['legacy6','plus6']:
    c,p=setup(browser,width,fixture);go(p,'#almanac');ok('story' not in book(p),'legacy eligibility does not write on view');keep(p);reveal(p);ok(book(p)['story']['acts']['I']['receipt']['served']==6,'legacy/N+ receipt uses existing cumulative service');c.close()
   for rawact in [None,{'ended':'future','raw':'Synthetic <retained> act'}]:
    seed=copy.deepcopy(fixtures['legacy6']);seed['story']={'version':1,'opening':'returning','acts':{'I':rawact,'future':{'kept':'Synthetic other act'}},'seenScenes':['future-scene']};c,p=setup(browser,width,seed);go(p,'#almanac');keep(p);reveal(p);ok(book(p)['story']['acts']['I']==rawact,'unreadable act retained while parcel/page continue');ok('future-scene' in book(p)['story']['seenScenes'],'unknown scenes retained');c.close()
   seed=copy.deepcopy(fixtures['base']);seed['story']={'version':99,'raw':'Synthetic <future> & story'};c,p=setup(browser,width,seed);go(p,'#almanac');ok('earlier story is safe' in p.locator('.keeper-pages').inner_text(),'unsupported story has recovery UI');ok(book(p)['story']==seed['story'],'unsupported root remains exact');go(p,'#explore');ok(p.locator('a[href="#almanac"]').count()>0,'all places stays open');go(p,'#notes');ok('Synthetic <future> & story' in p.locator('pre').filter(has_text='Synthetic <future>').text_content(),'unknown story raw text is HTML escaped');c.close()
  # Each close mode delivers the fresh parcel without recording a scene.
  for how in ['finish','escape']:
   c,p=setup(browser,320,None);go(p,'#home');dismiss(p,how);ok(p.locator('[data-keeper-intro]').is_visible(),how+' reveals parcel');ok(book(p)['story']['seenScenes']==[],how+' is not scene acknowledgment');c.close()
  # Finish messages must come from the actual film iframe, and close cannot force a route back.
  c,p=setup(browser,320,None);go(p,'#home');p.locator('dialog[open]').wait_for();p.evaluate("postMessage('garden-film-finished',location.origin)");p.wait_for_timeout(30);ok(p.locator('dialog[open]').count()==1,'spoofed parent finish cannot close film');p.evaluate("location.hash='#notes'");p.locator('#download').wait_for();dismiss(p,'finish');ok(p.evaluate('location.hash')=='#notes','film completion does not force navigation');ok(book(p)['story']['seenScenes']==[],'film completion on another route writes no story scene');c.close()
  # The current supported guide is used on each reread; it is not a separate story completion.
  seed=copy.deepcopy(fixtures['base']);seed['garden']['guide']='ari';c,p=setup(browser,320,seed);go(p,'#home');ok('Ari turns the parcel over' in p.locator('[data-keeper-intro]').inner_text(),'selected nonbinary guide appears');go(p,'#companions');p.locator('[data-guide="rowan"]').focus();p.keyboard.press('Space');go(p,'#home');ok('Rowan turns the parcel over' in p.locator('[data-keeper-intro]').inner_text(),'guide change updates story safely');ok('story' not in book(p),'guide preference is not story completion');c.close()
  # English story speech remains English even with French reading preferences.
  seed=copy.deepcopy(fixtures['plus6']);seed['garden']['start']={'reading':3,'french':1};c,p=setup(browser,320,seed);go(p,'#almanac');keep(p);reveal(p);p.locator('.keeper-map-page > [data-speak]').click();ok(p.evaluate('__keeperSpeech.at(-1).voice')=='en-US','French amount does not change story speech language');ok(book(p)['garden']['start']==seed['garden']['start'],'global language choices retained');before=copy.deepcopy(book(p)['story']);p.evaluate("()=>{window.__staleKeeper=document.querySelector('[data-keeper-amount=longer]');location.hash='#notes';__staleKeeper.click();}");p.locator('#download').wait_for();ok(book(p)['story']==before,'changed route makes retained control inert');c.close()
  # Saving-off and failed disk writes keep the story usable in memory with honest warning.
  for failed in [False,True]:
   c,p=setup(browser,320,'plus6',failed);go(p,'#notes')
   if not failed:p.locator('#remember').uncheck()
   go(p,'#almanac');keep(p);reveal(p);ok('old-map-revealed' in book(p)['story']['seenScenes'],'memory story works with saving disabled or failed');ok(('Progress could not be saved' in p.locator('body').inner_text()) if failed else p.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:')).length===0"),'disk failure warning or explicit saving-off removes persisted notebooks');c.close()
  ok(not errors,'no browser runtime errors: '+str(errors));print(f'Keeper story Chrome: {checks} assertions passed at320/820.')
 finally:
  for c in contexts:
   try:c.close()
   except Exception:pass
  browser.close()
