// Synthetic real-browser regressions. Serve dist locally; no learner exports or remote content.
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const fs=require('node:fs/promises');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=file=>import(pathToFileURL(path.join(root,'dist',file)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport}=await load('progress-transfer.mjs');
 const {startVisit,storyDraft,noteStorySeen,openStoryHelp}=await load('garden-core.mjs');
 const {storyNodes}=await load('story-content.mjs'),{helpers}=await load('help-content.mjs');
 const {parisStories}=await load('paris-library.mjs'),{ORDER_PERMUTATIONS}=await load('paris-pack-core.mjs');
 const pack=parisStories.find(s=>s.id===(process.env.PARIS_SOURCE_STORY_ID||'puppet-post'));
 const variant=Number(process.env.PARIS_SOURCE_VARIANT||1);
 assert.ok(pack?.packId&&[1,2,3].includes(variant),'select an installed pack and passage length');
 const options={destination:pack.destination,storyId:pack.id,variant};
 const base=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
 const seed=base(),visit=startVisit(seed,'paris',options);assert.ok(visit.parisSource,'requires implemented captured source');
 const d=storyDraft(seed);noteStorySeen(seed);const first=structuredClone(storyNodes[visit.node]),second=structuredClone(storyNodes[visit.route[1]]),helper=structuredClone(helpers[first.id]);
 d.choice=first.answer;d.reading='independent';openStoryHelp(seed);d.helper.choice=helper.answer;d.helper.attempts=[helper.answer];
 const oldSource=structuredClone(visit.parisSource);
 const replacement={...first,title:'Replacement page from a later edition',readingText:['Replacement passage from a later edition.'],prompt:'Replacement question from a later edition?',choices:first.choices.map((_,i)=>`Replacement choice ${i+1}`),answer:(first.answer+1)%first.choices.length,hint:'Replacement hint.',explanation:'Replacement explanation.'};
 const items=second.orderItems.map((_,i)=>`Replacement event ${i+1}`);
 const replacementSecond={...second,readingText:replacement.readingText,orderItems:items,displayOrder:[2,1,0],choices:ORDER_PERMUTATIONS.map(p=>p.map(i=>items[i]).join(' → '))};
 const replacementHelper={...helper,id:'synthetic-new-example',title:'Replacement helper',choices:['Replacement helper A','Replacement helper B'],answer:0,model:{type:'text',segments:['Replacement single sentence.'],focus:0,clue:'Replacement clue.'}};
 const storyModule=await fs.readFile(path.join(root,'dist','story-content.mjs'),'utf8');
 const helpModule=await fs.readFile(path.join(root,'dist','help-content.mjs'),'utf8');
 const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.default||playwright;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(x,y,m)=>{assert.deepEqual(x,y,m);checks++;};
 const errors=[];const contexts=[];
 const origin=process.env.PARIS_SOURCE_TEST_URL||'http://127.0.0.1:8000/';
 const artifacts=process.env.PARIS_SOURCE_ARTIFACTS;if(artifacts)await fs.mkdir(artifacts,{recursive:true});
 async function pageFor(data,width,height){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,acceptDownloads:true});contexts.push(context);
  await context.addInitScript(data=>{if(!localStorage.getItem('synthetic-paris-seeded')){localStorage.setItem('number-garden-v1',JSON.stringify(data));localStorage.setItem('synthetic-paris-seeded','yes');}},data);
  await context.route('**/story-content.mjs',route=>route.fulfill({status:200,contentType:'text/javascript',body:storyModule+`\nObject.assign(storyNodes[${JSON.stringify(first.id)}],${JSON.stringify(replacement)});\nObject.assign(storyNodes[${JSON.stringify(second.id)}],${JSON.stringify(replacementSecond)});\n`}));
  await context.route('**/help-content.mjs',route=>route.fulfill({status:200,contentType:'text/javascript',body:helpModule+`\nhelpers[${JSON.stringify(first.id)}]=${JSON.stringify(replacementHelper)};\n`}));
  const page=await context.newPage();page.on('pageerror',error=>{errors.push(error.message);console.error('Browser page error:',error.message);});page.on('requestfailed',request=>errors.push(`request ${request.url()}: ${request.failure()?.errorText}`));
  await page.goto(new URL('#storm/play',origin).href);await page.waitForFunction(()=>document.querySelector('main')?.textContent.trim().length>0);return page;
 }
 const saved=page=>page.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem(`number-garden-v1:${r.activeId}`));});
 const click=(page,selector)=>page.locator(selector).first().click();
 async function noOverflow(page){ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');}
 async function report(page){await page.goto(new URL('#notes',origin).href);const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#download').tap()]);const raw=await fs.readFile(await download.path(),'utf8');const result=prepareProgressImport(raw);ok(result.ok,'actual downloaded notebook reimports through production loader');return {raw,state:result.state};}
 try{
  for(const [width,height] of [[390,844],[820,1180]]){
   const page=await pageFor(structuredClone(seed),width,height);
   ok((await page.locator('main').innerText()).includes(helper.title),'paused helper keeps original title after catalogue replacement');
   ok(!(await page.locator('main').innerText()).includes(replacementHelper.title),'paused helper does not borrow new title');
   await page.reload();eq((await saved(page)).garden.visits[0].drafts[first.id].helper.attempts,[helper.answer],'helper attempts survive reload and changed helper choice count');
   await page.locator('#help-return').waitFor();ok(true,'paused helper return remains available after module startup');
   await click(page,'#help-return');eq(await page.locator(`[data-story-choice="${first.answer}"]`).innerText(),first.choices[first.answer],'selected choice retains original wording');
   if(pack.id==='flood-almanac'){
    const passage=await page.locator('.reading-passage').innerText();
    ok(passage.includes('Archives de Paris chronology')&&passage.includes('Musée Carnavalet photograph'),'visible almanac credits both sources');
    ok(passage.includes('real Paris')&&passage.includes('imagined'),'visible almanac distinguishes history from fiction');
    eq(await page.locator('#reading-line-0').innerText(),first.readingText[0],'first visible sentence follows the chosen passage length');
   }
   eq(await page.locator(`[data-story-choice="${first.answer}"]`).getAttribute('aria-pressed'),'true','selected answer stays selected');
   ok(await page.locator('[data-story-choice]').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),'choice targets at least 44px tall');
   if(artifacts)await page.screenshot({path:path.join(artifacts,`saved-page-${width}.png`)});
   await click(page,'#story-answer-form button[type="submit"]');ok((await page.locator('#story-feedback').innerText()).includes('That fits'),'submission uses frozen fitting index');
   await click(page,'[data-story-method="worked"]');await click(page,'#story-next');
   ok((await page.locator('main').innerText()).includes(second.readingText[0]),'second question keeps original shared passage');
   eq(await page.locator('[data-order-add]').evaluateAll(xs=>xs.map(x=>Number(x.dataset.orderAdd))),second.displayOrder,'ordering bank uses frozen permutation');
   await click(page,'[data-order-add="0"]');await page.reload();ok((await page.locator('.order-slots').innerText()).includes(second.orderItems[0]),'partial order restores original card text');
   await click(page,'[data-order-add="1"]');await click(page,'[data-order-add="2"]');await click(page,'#order-submit');
   eq(await page.locator('.order-submitted li').allTextContents(),second.orderItems,'submitted arrangement keeps original items');
   await click(page,'[data-story-method="worked"]');await click(page,'#story-next');await click(page,'#story-project-next');await click(page,'[data-film-skip]');
   const completed=await saved(page);eq(completed.garden.visits[0].parisSource,oldSource,'complete visit keeps exact captured source');
   eq(completed.garden.observations[0].choices,first.choices,'recorded choices retain historical wording');
   await noOverflow(page);
   const exported=await report(page);eq(exported.state.garden.visits[0].parisSource,oldSource,'download/import retains complete source');
   await page.goto(new URL('#paris',origin).href);await page.selectOption(`#paris-pack-length-${pack.id}`,String(variant));await click(page,`[data-paris-pack-story="${pack.id}"]`);
   if(await page.locator('[data-new-visit="paris"]').count())await click(page,'[data-new-visit="paris"]');
   await page.getByText(replacement.title,{exact:true}).waitFor();ok(true,'fresh visit uses new authored page');
   const current=await saved(page);ok(current.garden.visits.length===2,'fresh visit retains earlier completed visit');
   await noOverflow(page);await page.close();
  }
  const legacy=structuredClone(seed);delete legacy.garden.visits[0].parisSource;
  legacy.garden.visits[0].drafts[first.id].readingTools={audioRequested:false,sentenceUsed:true,focus:first.readingText.length-1,supportUncertain:false};
  const rawLegacy=structuredClone(legacy.garden.visits[0]);
  const page=await pageFor(legacy,390,844);
  ok(await page.locator('[data-paris-recovery]').count(),'legacy visit gets isolated recovery page');
  eq((await saved(page)).garden.visits[0],rawLegacy,'legacy raw visit unchanged on real app load');
  ok(await page.locator('[data-paris-fresh-start]').evaluate(x=>x.getBoundingClientRect().height>=44),'recovery target at least 44px tall');
  if(artifacts)await page.screenshot({path:path.join(artifacts,'legacy-recovery-phone.png')});
  await page.reload();eq((await saved(page)).garden.visits[0],rawLegacy,'legacy raw visit unchanged on second load');
  await page.goto(new URL('#notes',origin).href);
  await page.locator('main details').evaluateAll(xs=>xs.forEach(x=>x.open=true));
  const notes=await page.locator('main').innerText();ok(/position/i.test(notes),'notes describe retained positions');ok(!notes.includes(replacementHelper.title),'legacy helper does not borrow current title');
  const exported=await report(page);eq(exported.state.garden.visits[0],rawLegacy,'legacy raw visit survives actual download/import');
  await page.goto(new URL('#storm/play',origin).href);await page.locator('[data-paris-fresh-start]').focus();await page.keyboard.press('Enter');
  await page.getByText(replacement.title,{exact:true}).waitFor();ok(true,'keyboard fresh start opens current-content visit');
  const after=await saved(page);eq(after.garden.visits[0],rawLegacy,'fresh-start display does not rewrite old familiarity/support');ok(after.garden.visits.length===2,'fresh start creates separate visit');
  await noOverflow(page);await page.close();
  for(const bad of [null,{version:999,raw:'Retained unknown source'}, {...oldSource,nodes:{}}]){
   const state=structuredClone(seed);state.garden.visits[0].parisSource=bad;const before=structuredClone(state.garden.visits[0]);
   const p=await pageFor(state,820,1180);ok(await p.locator('[data-paris-recovery]').count(),'invalid source opens recovery');
   eq((await saved(p)).garden.visits[0],before,'invalid source retained without replacing source from catalogue');await noOverflow(p);await p.close();
  }
  eq(errors,[],'no page errors throughout captured, legacy and recovery flows');
  console.log(`Paris saved-source browser regressions: ${checks} assertions passed.`);
 }finally{for(const context of contexts)await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
