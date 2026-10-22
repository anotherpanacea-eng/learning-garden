// Synthetic browser journeys for the two source-owned Egyptian object stories.
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=file=>import(pathToFileURL(path.join(root,'dist',file)).href);
 const {freshState}=await load('core.mjs');
 const {initializeExplorerState,prepareProgressImport}=await load('progress-transfer.mjs');
 const {parisStories}=await load('paris-library.mjs');
 const {storyNodes}=await load('story-content.mjs');
 const {startVisit}=await load('garden-core.mjs');
 const {egyptWritingPhotos}=await load('egypt-writing-photos.mjs');
 const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright').then(m=>m.default||m);
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.EGYPT_TEST_URL||'http://127.0.0.1:8000/';
 const artifacts=process.env.EGYPT_TEST_ARTIFACTS;if(artifacts)await fs.mkdir(artifacts,{recursive:true});
 const stories=parisStories.filter(s=>s.packId==='egypt-writing-book');
 let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++};
 const errors=[],contexts=[];
 const seed=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
 async function makePage(width,height){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,acceptDownloads:true});contexts.push(context);
  await context.addInitScript(data=>{if(!localStorage.getItem('egypt-browser-seeded')){localStorage.setItem('number-garden-v1',JSON.stringify(data));localStorage.setItem('egypt-browser-seeded','yes');}},seed());
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(`${r.url()}: ${r.failure()?.errorText}`));
  await page.goto(new URL('#paris',origin).href);return page;
 }
 const stored=page=>page.evaluate(()=>{const explorers=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem(`number-garden-v1:${explorers.activeId}`));});
 const click=(page,sel)=>page.locator(sel).first().click();
 async function noOverflow(page,label){ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${label}: no horizontal overflow`)}
 try{
  eq(stories.length,2,'two Egypt stories installed');
  for(const [width,height] of [[320,720],[820,1180]])for(const story of stories)for(const length of [1,2,3]){
   const page=await makePage(width,height),photo=egyptWritingPhotos[story.id],card=page.locator(`.egypt-pack:has([data-paris-pack-story="${story.id}"])`);
   const img=card.locator('[data-egypt-photo]');
   ok(await img.evaluate(x=>x.complete&&x.naturalWidth>0),`${story.id}/${width}: local photo loads`);
   eq(await img.getAttribute('alt'),photo.alt,'photo has authored alternative');
   ok((await card.locator('figcaption').innerText()).includes('Public domain, CC0'),'photo has visible rights credit');
   eq(await card.locator('figcaption a').getAttribute('href'),photo.href,'caption links exact museum object');
   ok(await card.locator('figcaption a').evaluate(x=>x.getBoundingClientRect().height>=44),'museum link is a touch target');
   await page.selectOption(`#paris-pack-length-${story.id}`,String(length));await click(page,`[data-paris-pack-story="${story.id}"]`);
   eq(new URL(page.url()).hash,'#storm/play','story opens');
   const first=storyNodes[story.variants[length][0]],second=storyNodes[story.variants[length][1]];
   let state=await stored(page),visit=state.garden.visits.at(-1),source=structuredClone(visit.parisSource);
   eq(visit.paris.storyId,story.id,'visit captures chosen story');eq(visit.paris.variant,length,'visit captures manual length');
   eq(await page.locator('#reading-line-0').innerText(),first.readingText[0],'first visible sentence matches chosen length');
   ok((await page.locator('.reading-passage').innerText()).includes('The Met'),'reading passage credits primary record');
   await click(page,'[data-story-reading-tool="sentence-next"]');
   eq((await stored(page)).garden.visits.at(-1).drafts[first.id].readingTools.focus,0,'sentence support persists');
   await click(page,'[data-story-audio]');
   ok((await stored(page)).garden.visits.at(-1).drafts[first.id].readingTools.audioRequested,'listening request records support separately');
   await click(page,'#story-help');
   ok(await page.locator('#help-return').isVisible(),'smaller original example opens');
   await page.reload();ok(await page.locator('#help-return').isVisible(),'waiting helper survives reload');
   eq((await stored(page)).garden.visits.at(-1).parisSource,source,'waiting visit keeps frozen source');
   await click(page,'#help-return');
   await click(page,`[data-story-choice="${first.answer}"]`);
   await click(page,'#story-answer-form button[type="submit"]');
   ok((await page.locator('#story-feedback').innerText()).includes('That fits'),'first answer checks against frozen choice');
   await click(page,'[data-story-method="worked"]');await click(page,'#story-next');
   eq(await page.locator('#reading-line-0').innerText(),second.readingText[0],'second question retains shared passage');
   await click(page,`[data-story-choice="${second.answer}"]`);await click(page,'#story-answer-form button[type="submit"]');
   ok((await page.locator('#story-feedback').innerText()).includes('That fits'),'second answer checks against frozen choice');
   await click(page,'[data-story-method="worked"]');await click(page,'#story-next');
   await click(page,'#story-project-next');if(await page.locator('[data-film-skip]').count())await click(page,'[data-film-skip]');
   state=await stored(page);eq(state.garden.visits.at(-1).parisSource,source,'completed visit keeps frozen source');
   ok(state.garden.visits.at(-1).finished,'both questions lead to ending');
   await noOverflow(page,`${story.id}/${length}/${width}`);
   if(artifacts&&length===2)await page.goto(new URL('#paris',origin).href).then(()=>page.screenshot({path:path.join(artifacts,`${story.id}-${width}.png`),fullPage:true}));
   if(story===stories[0]&&length===1){
    await page.goto(new URL('#notes',origin).href);
    const [download]=await Promise.all([page.waitForEvent('download'),click(page,'#download')]);
    const raw=await fs.readFile(await download.path(),'utf8'),parsed=prepareProgressImport(raw);
    ok(parsed.ok,'full actual notes download reimports');eq(parsed.state.garden.visits.at(-1).parisSource,source,'download keeps frozen object source');
    await page.locator('#progress-file').setInputFiles({name:'notes.json',mimeType:'application/json',buffer:Buffer.from(raw)});
    await page.locator('#progress-import-confirm').waitFor();await click(page,'#progress-import-confirm');
    ok((await page.locator('#progress-import-status').innerText()).includes('Notebook brought'),'actual file import completes');
    eq((await stored(page)).garden.visits.at(-1).parisSource,source,'imported visit retains frozen source');
   }
   await page.close();
  }
  // A failed optional image remains an honest text-first invitation.
  const context=await browser.newContext({viewport:{width:320,height:720}});contexts.push(context);
  await context.route('**/egypt-writing-board-28-9-5.jpg',r=>r.fulfill({status:404,body:''}));
  const page=await context.newPage();await page.goto(new URL('#paris',origin).href);
  await page.locator('[data-photo-fallback]').first().waitFor({state:'visible'});
  ok((await page.locator('[data-photo-fallback]').first().innerText()).includes('photograph is unavailable'),'failed image has text fallback');
  ok(await page.locator('[data-paris-pack-story="egypt-reusable-board"]').isEnabled(),'image failure does not block story');
  // Catalog edits cannot reinterpret an already-started visit.
  const frozenSeed=seed(),frozenVisit=startVisit(frozenSeed,'paris',{destination:'bookstall',storyId:stories[0].id,variant:1});
  const frozenNode=structuredClone(storyNodes[frozenVisit.node]);
  const sourceModule=await fs.readFile(path.join(root,'dist','story-content.mjs'),'utf8');
  const changed=await browser.newContext({viewport:{width:390,height:844}});contexts.push(changed);
  await changed.addInitScript(data=>{localStorage.setItem('number-garden-v1',JSON.stringify(data));},frozenSeed);
  await changed.route('**/story-content.mjs',r=>r.fulfill({status:200,contentType:'text/javascript',body:sourceModule+`\nObject.assign(storyNodes[${JSON.stringify(frozenNode.id)}],{title:'Changed catalog title',prompt:'Changed catalog prompt?',choices:['Changed A','Changed B','Changed C'],answer:0});\n`}));
  const frozenPage=await changed.newPage();await frozenPage.goto(new URL('#storm/play',origin).href);
  eq(await frozenPage.locator('.story-sheet h2').innerText(),frozenNode.title,'saved visit renders its own title after catalog edit');
  eq(await frozenPage.locator('.story-question').innerText(),frozenNode.prompt,'saved visit renders its own question after catalog edit');
  eq(await frozenPage.locator('[data-story-choice]').allTextContents(),frozenNode.choices,'saved visit renders its own choices after catalog edit');
  await click(frozenPage,`[data-story-choice="${frozenNode.answer}"]`);await click(frozenPage,'#story-answer-form button[type="submit"]');
  ok((await frozenPage.locator('#story-feedback').innerText()).includes('That fits'),'saved visit checks its own answer after catalog edit');
  eq((await stored(frozenPage)).garden.visits.at(-1).parisSource,frozenVisit.parisSource,'catalog edit leaves captured source unchanged');
  const off=await makePage(390,844);await off.goto(new URL('#notes',origin).href);await off.locator('#remember').uncheck();
  await off.goto(new URL('#paris',origin).href);await off.selectOption(`#paris-pack-length-${stories[1].id}`,'3');
  await click(off,`[data-paris-pack-story="${stories[1].id}"]`);
  eq(await off.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:'))),[],'save-off visit writes no explorer notebook');
  await off.goto(new URL('#notes',origin).href);
  const [offFile]=await Promise.all([off.waitForEvent('download'),click(off,'#download')]);
  const offReport=prepareProgressImport(await fs.readFile(await offFile.path(),'utf8'));
  ok(offReport.ok,'save-off visit remains in importable notes');
  eq(offReport.state.garden.visits.at(-1).paris.storyId,stories[1].id,'save-off export retains correct object story');
  eq(errors,[],'no app errors or unexpected failed requests');
  console.log(`Egypt Writing Book browser: ${checks} assertions passed.`);
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
