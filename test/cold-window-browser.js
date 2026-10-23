// Synthetic Chrome journey for the transient Cold Window teaching picture.
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

(async()=>{
 const root=path.resolve(__dirname,'..'),load=name=>import(pathToFileURL(path.join(root,'dist',name)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState}=await load('progress-transfer.mjs'),{startScience}=await load('science-core.mjs');
 const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.COLD_WINDOW_TEST_URL||'http://127.0.0.1:4173/',errors=[];let assertions=0;
 const eq=(a,b,message)=>{assert.deepEqual(a,b,message);assertions++;};
 const ok=(a,message)=>{assert.ok(a,message);assertions++;};
 const saved=page=>page.evaluate(()=>{const profile=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem(`number-garden-v1:${profile.activeId}`));});
 try{
  for(const width of [320,820]){
   const seed=initializeExplorerState(freshState());seed.garden.welcomeFilmSeen=true;startScience(seed,'evaporate');const original=structuredClone(seed.science);
   const context=await browser.newContext({viewport:{width,height:900},hasTouch:true,acceptDownloads:true});
   await context.addInitScript(seed=>{if(!localStorage.getItem('synthetic-cold-window')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('synthetic-cold-window','1');}},seed);
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(new URL('#science',origin).href);await page.locator('.cold-window-entry a').waitFor();
   ok((await page.locator('.science-visits').innerText()).includes('Where did the puddle water go?'),'paused evaporation visit remains available');
   await page.locator('.cold-window-entry a').click();await page.locator('[data-cold-window-root]').waitFor();
   eq(await page.locator('#window-frame-title').innerText(),'Before cooling','fresh page starts before cooling');
   const states=[['cool','The cooled pane'],['warm','Warm again in our model'],['cool','The cooled pane'],['before','Before cooling']];
   for(const [action,heading] of states){
    await page.locator(`[data-cw-action="${action}"]`).focus();await page.keyboard.press('Enter');
    eq(await page.locator('#window-frame-title').innerText(),heading,'keyboard changes the current picture');
    eq(await page.evaluate(()=>document.activeElement?.id),'window-frame-title','new frame heading takes focus');
    ok((await page.locator('[data-cw-image]').getAttribute('alt')).includes('pane'),'current art has a useful text alternative');
    await page.waitForFunction(()=>{const img=document.querySelector('[data-cw-image]');return img?.complete&&img.naturalWidth>0;});
    ok(await page.locator('[data-cw-image]').evaluate(img=>img.complete&&img.naturalWidth>0),'current original art loads');
    if(action==='warm'||action==='before')await page.screenshot({path:`/private/tmp/lg-cold-window-runtime-${width}-${action}.png`,fullPage:true});
   }
   const stale=await page.locator('[data-cw-action="cool"]').elementHandle();
   await page.locator('[data-cw-action="cool"]').tap();
   await page.evaluate(button=>button.click(),stale);
   eq(await page.locator('#window-frame-title').innerText(),'The cooled pane','detached prior control cannot change the live frame');
   await page.screenshot({path:`/private/tmp/lg-cold-window-runtime-${width}-cool.png`,fullPage:true});
   const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,small:[...document.querySelectorAll('[data-cold-window-root] button,[data-cold-window-root] a,[data-cold-window-root] summary')].filter(el=>el.getClientRects().length&&el.getBoundingClientRect().height<44).map(el=>el.textContent.trim())}));
   eq(geometry.overflow,false,'no horizontal page overflow');eq(geometry.small,[],'all visible Cold Window controls meet 44px height');
   eq((await saved(page)).science,original,'pane actions do not change healthy science data');
   await page.locator('.cold-window .back').click();await page.locator('.evidence-entry a').waitFor();
   await page.evaluate(button=>button.click(),stale);
   ok(await page.locator('.cold-window-entry a').isVisible(),'old route control cannot change Water Lab hub');
   await page.locator('.evidence-entry a').click();await page.locator('[data-evidence-root]').waitFor();
   ok(await page.locator('[data-evidence-root]').isVisible(),'Water Evidence Shelf remains reachable');
   await page.evaluate(()=>{location.hash='#science/window';});await page.locator('[data-cold-window-root]').waitFor();
   eq(await page.locator('#window-frame-title').innerText(),'Before cooling','returning to route resets transient frame');
   await page.reload();await page.locator('[data-cold-window-root]').waitFor();
   eq(await page.locator('#window-frame-title').innerText(),'Before cooling','reload resets transient frame');
   await page.evaluate(()=>{location.hash='#notes';});await page.locator('#download').waitFor();
   const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#download').click()]);
   const report=JSON.parse(await fs.readFile(await download.path(),'utf8'));
   eq(report.science,original,'actual notes download retains paused visit unchanged');
   ok(!Object.keys(report).some(k=>/coldWindow|condensationBench/i.test(k)),'actual notes have no new bench root');
   await page.locator('#progress-file').setInputFiles(await download.path());
   await page.locator('#progress-import-confirm').waitFor();await page.locator('#progress-import-confirm').click();
   ok((await page.locator('#progress-import-status').innerText()).includes('separate explorer'),'actual notes import creates a separate explorer');
   await page.evaluate(()=>{location.hash='#science/window';});await page.locator('[data-cold-window-root]').waitFor();
   eq(await page.locator('#window-frame-title').innerText(),'Before cooling','imported explorer gets a fresh transient frame');
   eq((await saved(page)).science,original,'imported explorer retains prior science visit');
   await context.close();
  }
  eq(errors,[],'no browser page errors');
  console.log(`Cold Window Chrome: ${assertions} assertions passed at 320 and 820 CSS pixels.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
