// Synthetic local browser journeys only. No learner exports or remote content.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href),{freshState}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport}=await load('progress-transfer.mjs');
 const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const base=process.env.COLLECTION_TEST_URL||'http://127.0.0.1:8000/',errors=[];let checks=0;
 const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(x,y,m)=>{assert.deepEqual(x,y,m);checks++;},tap=(p,s)=>p.locator(s).first().tap();
 const state=p=>p.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem(`number-garden-v1:${r.activeId}`));});
 async function bounds(p){ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');ok(await p.locator('.collection-sheet button:not(:disabled),.collection-sheet input,.collection-sheet summary,.collection-sheet a').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height===0||x.getBoundingClientRect().height>=44)),'visible controls and links at least44px');}
 try{
  for(const width of [320,820]){
   const seed=initializeExplorerState(freshState());seed.garden.welcomeFilmSeen=true;const oldField=structuredClone(seed.fieldNotebook);
   const context=await browser.newContext({viewport:{width,height:1000},hasTouch:true,acceptDownloads:true});
   await context.addInitScript(seed=>{if(!localStorage.getItem('synthetic-count-seeded')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('synthetic-count-seeded','1');}},seed);
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(new URL('#living/collection',base).href);
   ok(!Object.hasOwn(await state(page),'countCollection'),'opening allocates nothing');await tap(page,'[data-collection-start]');
   for(const [id,n] of [['round',3],['square',2],['triangle',1]])for(let i=0;i<n;i++)await tap(page,`[data-collection-count="${id}"][data-delta="1"]`);
   eq(await page.locator('.collection-token').count(),6,'every source token is actually drawn');
   for(let i=0;i<9;i++)await tap(page,'[data-collection-count="round"][data-delta="1"]');
   eq(await page.evaluate(()=>document.activeElement?.dataset.delta),'-1','limit restores focus to enabled reverse control');for(let i=0;i<9;i++)await tap(page,'[data-collection-count="round"][data-delta="-1"]');await bounds(page);
   await tap(page,'[data-collection-page="table"]');ok((await page.locator('#collection-title').innerText()).includes('table'),'dedicated table turn');
   for(const [id,n] of [['round',3],['square',2],['triangle',1]])await page.locator(`[data-collection-table="${id}"]`).fill(String(n));
   await page.reload();eq((await state(page)).countCollection.table,{round:'3',square:'2',triangle:'1'},'table entries survive reload');await bounds(page);
   await tap(page,'[data-collection-page="chart"]');for(let i=0;i<3;i++)await tap(page,'[data-collection-bar-edit="round"][data-delta="1"]');await tap(page,'[data-collection-bar-edit="square"][data-delta="1"]');
   const firstWidth=await page.locator('[data-collection-bar="round"]').getAttribute('width');await tap(page,'[data-collection-scale="2"]');eq(await page.locator('[data-collection-bar="round"]').getAttribute('width'),firstWidth,'odd bar unchanged by twos labels');
   ok(await page.locator('[data-collection-bar="round"]').evaluate(x=>x.getBBox().width===60),'three-unit bar ends midway between2and4');
   await tap(page,'[data-collection-check="representation"]');ok((await page.locator('#collection-feedback').innerText()).includes('do not all agree'),'source disagreement is explicit');await bounds(page);
   await tap(page,'[data-collection-page="read"]');await tap(page,'[data-collection-choice="first"]');await page.locator('#collection-difference').fill('2');await tap(page,'[data-collection-check="reading"]');
   const text=await page.locator('#collection-feedback').innerText();ok(text.includes('Your comparison fits your chart')&&text.includes('Your difference fits')&&text.includes('do not all agree'),'accurate reading separated from source faithfulness');await tap(page,'[data-collection-keep]');const kept=structuredClone((await state(page)).countCollection.kept);await bounds(page);
   if(process.env.COLLECTION_ARTIFACTS){await fs.mkdir(process.env.COLLECTION_ARTIFACTS,{recursive:true});await page.screenshot({path:path.join(process.env.COLLECTION_ARTIFACTS,`collection-read-${width}.png`),fullPage:true});}
   await tap(page,'[data-collection-page="chart"]');await tap(page,'[data-collection-page="table"]');await page.locator('[data-collection-table="round"]').fill('bad');ok((await page.locator('#collection-entry-round').innerText()).includes('whole number'),'invalid input gets a specific notice on its own turn');await page.reload();eq((await state(page)).countCollection.table.round,'bad','raw invalid draft remains editable after reload');eq((await state(page)).countCollection.kept,kept,'later draft edits preserve kept snapshot');
   await tap(page,'[data-collection-page="chart"]');await tap(page,'[data-collection-check="representation"]');ok((await page.locator('#collection-feedback').innerText()).includes('not a whole count'),'invalid table is not zero');
   await page.locator('.collection-help summary').click();await tap(page,'[data-collection-together]');ok((await state(page)).countCollection.support.includes('help')&&(await state(page)).countCollection.support.includes('together'),'optional help and together tracked');
   await page.goto(new URL('#notes',base).href);const [download]=await Promise.all([page.waitForEvent('download'),tap(page,'#download')]);const raw=await fs.readFile(await download.path(),'utf8'),prepared=prepareProgressImport(raw);ok(prepared.ok,'actual downloaded report reimports');eq(prepared.state.countCollection.kept,kept,'download preserves kept snapshot');eq((await state(page)).fieldNotebook,oldField,'collection does not rewrite seedling notebook');
   await page.locator('#progress-file').setInputFiles({name:'synthetic-collection.json',mimeType:'application/json',buffer:Buffer.from(raw)});await page.locator('#progress-import-confirm').waitFor();await tap(page,'#progress-import-confirm');await page.goto(new URL('#living/collection',base).href);eq((await state(page)).countCollection.kept,kept,'actual file import preserves own-source work');
   await tap(page,'[data-collection-keep]');await page.locator('[data-collection-confirm]').waitFor();await tap(page,'[data-collection-confirm]');ok((await state(page)).countCollection.kept.snapshot.table.round==='bad','explicit replacement captures current raw draft');
   await bounds(page);await context.close();
  }
  eq(errors,[],'no page errors');console.log(`${checks} Count Collection Chrome assertions passed at320/820px.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
