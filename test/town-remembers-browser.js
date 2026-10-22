// Synthetic local browser journeys. No real learner records or remote requests.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises');
const {pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport}=await load('progress-transfer.mjs');
 const batch=await load('whole-batches-core.mjs'),share=await load('sharing-counter-core.mjs'),recipe=await load('measuring-recipes-core.mjs'),town=await load('town-remembers-core.mjs');
 const {localDay}=await load('town-day.mjs');
 const base=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
 const copy=x=>JSON.parse(JSON.stringify(x));
 function kept(s,kind,value){
  if(kind==='trays'){
   batch.chooseBatchCase(s,'rehearsal-table');batch.resetBatchApparatus(s);
   for(const [ingredient,amount] of [['cloud-water',value*100],['star-water',value*150]]){batch.chooseBatchIngredient(s,ingredient);for(let i=0;i<amount/50;i++)assert.ok(batch.fillBatchJug(s));assert.ok(batch.pourBatchJug(s));}
   assert.ok(batch.keepBatch(s));s.wholeBatches.cases['rehearsal-table'].kept.keptDay='2020-01-01';
  }else if(kind==='shares'){
   share.chooseSharingCase(s,'repair-halves');share.joinSharingLoaf(s);for(let i=1;i<value;i++)assert.ok(share.toggleSharingCut(s,12*i/value));assert.ok(share.toggleSharingPiece(s,0));assert.ok(share.keepSharing(s));s.sharingCounter.cases['repair-halves'].kept.keptDay='2020-01-01';
  }else{
   recipe.chooseRecipe(s,'welcome-broth');recipe.resetRecipeApparatus(s);recipe.chooseRecipeIngredient(s,'cloud-water');for(let i=0;i<value/50;i++)assert.ok(recipe.fillRecipeJug(s));assert.ok(recipe.pourRecipeJug(s));assert.ok(recipe.keepRecipe(s));s.measuringRecipes.cases['welcome-broth'].kept.keptDay='2020-01-01';
  }
 }
 const cases=[['trays-reverse','trays',1,2],['trays-shortcut','trays',2,'needs-star'],['share-compare','shares',2,'Smaller'],['share-buns','shares',3,4],['jug-coarser','jugs',150,150],['jug-more','jugs',150,50]];
 function fixture(form,kind,value){const s=base();if(['trays-shortcut','share-buns','jug-more'].includes(form)){kept(s,kind,kind==='jugs'?50:kind==='shares'?2:1);assert.ok(town.startTown(s));assert.ok(town.asideTown(s));}kept(s,kind,value);assert.equal(town.nextTownCard(s).form,form);return s;}
 const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.default||playwright;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.TOWN_TEST_URL||'http://127.0.0.1:8000/',artifacts=process.env.TOWN_ARTIFACTS;
 if(artifacts)await fs.mkdir(artifacts,{recursive:true});
 let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
 const errors=[],contexts=[];
 async function pageFor(data,width=390,height=844,route='#home'){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,acceptDownloads:true});contexts.push(context);
  await context.addInitScript(s=>{if(!localStorage.getItem('synthetic-town-seed')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('synthetic-town-seed','1');}},data);
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(new URL(route,origin).href);await page.locator('main').waitFor();return page;
 }
 const saved=page=>page.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem(`number-garden-v1:${r.activeId}`));});
 const sourceRoots=s=>Object.fromEntries(['wholeBatches','sharingCounter','measuringRecipes','cafe'].filter(k=>k in s).map(k=>[k,s[k]]));
 const tap=(p,s)=>p.locator(s).first().tap();
 async function fit(page){ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');ok(await page.locator('.town-choice').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),'choice targets at least 44px');}
 async function exported(page){await page.goto(new URL('#notes',origin).href);const [download]=await Promise.all([page.waitForEvent('download'),tap(page,'#download')]);const raw=await fs.readFile(await download.path(),'utf8');const imported=prepareProgressImport(raw);ok(imported.ok,'actual notebook download accepted by production import');return imported.state;}
 try{
  for(const [width,height] of [[390,844],[820,1180]])for(const [form,kind,value,answer] of cases){
   const seed=fixture(form,kind,value),source=copy(sourceRoots(seed)),page=await pageFor(seed,width,height);
   await page.locator('.town-invitation a').waitFor();eq((await saved(page)).townRemembers,seed.townRemembers,'home render allocates no errand');
   await tap(page,'.town-invitation a');await page.locator('[data-town-start]').waitFor();await tap(page,'[data-town-start]');await page.locator('input[name="town-choice"]').first().waitFor();
   ok(await page.getByRole('region',{name:'A neighbor remembers',exact:true}).count()===1,'errand region retains accessible heading');
   let e=(await saved(page)).townRemembers.errands.at(-1);eq(e.form,form,'home invitation opens expected changed form');eq(e.expected,answer,'finite example fits independently calculated answer');
   ok(await page.locator('[data-town-check]').isDisabled(),'no check without selection');ok(await page.locator('[data-town-keep]').isDisabled(),'no keep without selection');
   await fit(page);
   if(form==='jug-coarser'){ok(!(await page.locator('.town-remembered').innerText()).includes('150 mL'),'coarse scale hides remembered amount before check');ok((await page.locator('.town-jug-drawing').getAttribute('aria-label')).includes('halfway'),'scale has accessible midpoint description');}
   const wrong=e.choices.findIndex(c=>c.value!==answer);await page.locator('.town-choice').nth(wrong).tap();await tap(page,'[data-town-check]');
   e=(await saved(page)).townRemembers.errands.at(-1);eq(e.checks.length,1,'check recorded once');eq(e.checks[0].fit,false,'different idea retained without a pass');const frozen=copy(e);
   await page.reload();await page.locator('.town-feedback').waitFor();eq((await saved(page)).townRemembers.errands.at(-1),frozen,'choice and check survive reload unchanged');
   await tap(page,'[data-town-support="example"]');await page.locator('.town-example').waitFor();await tap(page,'[data-town-support="together"]');
   e=(await saved(page)).townRemembers.errands.at(-1);ok(e.support.example&&e.support.together&&!e.support.narration,'support recorded separately without inferred listening');eq(e.checks,frozen.checks,'help leaves checks unchanged');
   if(artifacts&&width===820)await page.screenshot({path:path.join(artifacts,`${form}.png`),fullPage:true});
   const right=e.choices.findIndex(c=>c.value===answer);await page.locator('.town-choice').nth(right).tap();await page.locator('[data-town-keep]').focus();await page.keyboard.press('Enter');await page.locator('.town-finished').waitFor();
   e=(await saved(page)).townRemembers.errands.at(-1);eq(e.status,'kept','keyboard keep closes errand');eq(e.choice,answer,'revised answer kept');eq(e.checks.length,1,'keeping unchecked revision adds no inferred check');eq(sourceRoots(await saved(page)),source,'source games and cafe unchanged');
   await page.reload();await page.locator('.town-finished').waitFor();eq((await saved(page)).townRemembers.errands.at(-1),e,'closed history survives reload');
   if(width===390){const imported=await exported(page);eq(imported.townRemembers,(await saved(page)).townRemembers,'export/import retains exact errand history');}
   await page.close();
  }
  // Actual source-game Keep controls stamp today; the home invitation waits.
  for(const [kind,route,pageButton,keepButton,rootName,caseId] of [
   ['trays','#cafe/batches','[data-wb-page="keep"]','[data-wb-keep]','wholeBatches','rehearsal-table'],
   ['shares','#cafe/sharing','[data-sc-page="keep"]','[data-sc-keep]','sharingCounter','repair-halves'],
   ['jugs','#cafe/recipes','[data-mr-page="keep"]','[data-mr-keep]','measuringRecipes','welcome-broth']]){
   const seed=base();kept(seed,kind,kind==='jugs'?150:kind==='shares'?2:1);const page=await pageFor(seed,390,844,route);
   await tap(page,pageButton);await tap(page,keepButton);eq((await saved(page))[rootName].cases[caseId].kept.keptDay,localDay(),'source Keep stamps local day');
   await page.goto(new URL('#home',origin).href);await page.locator('main').waitFor();eq(await page.locator('.town-invitation').count(),0,'newly kept source waits until later day');await page.close();
  }
  // Unknown open errand is isolated and can be set aside without changing raw fields.
  const recovery=fixture('trays-reverse','trays',1);town.startTown(recovery);recovery.townRemembers.errands[0].form='future-form';const raw=copy(recovery.townRemembers.errands[0]);
  const page=await pageFor(recovery,390,844,'#town/remembers');await page.locator('[data-town-aside]').waitFor();await tap(page,'[data-town-aside]');
  const after=(await saved(page)).townRemembers.errands[0];eq(after,{...raw,status:'aside'},'unknown form can be set aside with all other fields retained');const imported=await exported(page);eq(imported.townRemembers.errands[0],after,'raw record survives notebook export/import');await page.close();
  eq(errors,[],'no browser page errors');console.log(`Town Remembers browser: ${checks} assertions passed.`);
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
