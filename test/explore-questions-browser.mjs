import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
const url=process.env.EXPLORE_TEST_URL;
if(!url)throw new Error('Serve dist locally and set EXPLORE_TEST_URL.');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'garden-explore-'));
const capture=async(page,name)=>{if(process.env.EXPLORE_ARTIFACTS){fs.mkdirSync(process.env.EXPLORE_ARTIFACTS,{recursive:true});await page.screenshot({path:path.join(process.env.EXPLORE_ARTIFACTS,name),fullPage:true});}};
const cases={water:['#science/evidence','#science/rain','#science'],sharing:['#cafe/sharing','#cafe/fractions','#workshop/recut'],words:['#post/instructions','#loft/printer','#archive/labels'],neighbors:['#living/bodies','#living/movement','#living/food']};
const seed=initializeExplorerState(freshState());seed.garden.welcomeFilmSeen=true;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
let assertions=0;const ok=(actual,expected,msg)=>{assert.deepEqual(actual,expected,msg);assertions++};const truth=(x,msg)=>{assert.ok(x,msg);assertions++};
try{for(const width of [320,820]){
 const context=await browser.newContext({viewport:{width,height:800},acceptDownloads:true});await context.addInitScript(s=>localStorage.setItem('number-garden-v1',JSON.stringify(s)),seed);const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'#explore');await page.locator('#explore-title').waitFor();ok(await page.locator('#explore-title').innerText(),'Follow a curiosity.','index title');ok(await page.locator('.explore-questions>a').count(),4,'four questions');ok(await page.locator('.explore-all-places').evaluate(x=>x.open),false,'directory closed');ok(await page.locator('.explore-all-places .explore-places article').count(),12,'all original places');ok(await page.locator('.explore-all-places a[href="#map"]').count(),1,'map link retained');ok(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'index no overflow');const height=await page.locator('body').evaluate(x=>x.scrollHeight);truth(height<1500,`compact phone/tablet index ${height}`);
 await capture(page,`index-${width}.png`);
 await page.locator('.explore-all-places>summary').click();ok(await page.locator('.explore-all-places').evaluate(x=>x.open),true,'directory opens');ok(await page.locator('.explore-places a.primary').count(),12,'12 old place links');await capture(page,`allplaces-${width}.png`);truth(await page.locator('.explore-places details').count()>0,'old topic disclosures');const topics=await page.locator('.explore-places details').count();ok(topics,6,'six scoped topic disclosures');console.log('directory',width,'height',height,'topic disclosures',topics);
 for(const [id,hrefs] of Object.entries(cases)){
  await page.goto(url+'#explore/'+id);await page.locator('.explore-destinations>a').first().waitFor();ok(await page.locator('.explore-destinations>a').count(),3,id+' three links');ok(await page.locator('.explore-destinations>a').evaluateAll(xs=>xs.map(x=>x.getAttribute('href'))),hrefs,id+' routes');ok(await page.evaluate(()=>document.activeElement?.id),'explore-title',id+' focus');ok(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,id+' overflow');if(id==='water')await capture(page,`water-${width}.png`);
  await page.locator('.explore-heading a.back').click();await page.locator('#explore-title').filter({hasText:'Follow a curiosity.'}).waitFor();ok(await page.locator('#explore-title').innerText(),'Follow a curiosity.',id+' back');ok(await page.evaluate(()=>document.activeElement?.id),'explore-title',id+' return focus');
 }
 await page.goto(url+'#explore');await page.locator('a[href="#explore/words"]').first().click();await page.locator('#explore-title').filter({hasText:'How can words help a neighbor?'}).waitFor();await page.goBack();await page.locator('#explore-title').filter({hasText:'Follow a curiosity.'}).waitFor();ok(await page.evaluate(()=>document.activeElement?.id),'explore-title','browser Back focus');await page.goto(url+'#explore/not-a-question');ok(await page.locator('#explore-title').innerText(),'Follow a curiosity.','unknown fallback');truth(await page.locator('.explore-unknown').isVisible(),'unknown status');
 await page.goto(url+'#explore/');await page.locator('.explore-unknown').waitFor();ok(await page.locator('.explore-questions>a').count(),4,'empty slug keeps four open choices');
 // Each child-facing activity link lands on a merged route, with its own view.
 for(const [id,hrefs] of Object.entries(cases))for(const href of hrefs){await page.goto(url+'#explore/'+id);await page.locator(`.explore-destinations>a[href="${href}"]`).click();ok(new URL(page.url()).hash,href,href+' navigates');truth(await page.locator('main h1').count()>0,href+' has heading');}
 ok(errors,[],'no page errors');
 if(width===320){
  // Paused saved Water Lab visit is unchanged by Explore and resumes.
  await page.goto(url+'#science');await page.locator('[data-science-mission="melt"]').click();await page.waitForURL('**/#science/play');const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('number-garden-v1')).science);truth(!!before,'saved science exists');await page.goto(url+'#explore/words');await page.locator('#explore-title').waitFor();const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('number-garden-v1')).science);ok(after,before,'paused science exact data');await page.goto(url+'#science/play');truth(await page.locator('[data-science-view]').isVisible(),'paused science resumes');
  // Temporary teaching pictures reset; no promise of persistence.
  await page.goto(url+'#living/movement');await page.locator('[data-movement-card="snail"] [data-movement-next]').click();ok(await page.locator('[data-movement-card="snail"] [data-movement-count]').innerText(),'Picture 2 of 3','movement advanced');await page.goto(url+'#explore/neighbors');await page.goto(url+'#living/movement');ok(await page.locator('[data-movement-card="snail"] [data-movement-count]').innerText(),'Picture 1 of 3','movement resets');
  await page.goto(url+'#workshop/recut');await page.locator('[data-recut-start]').first().click();await page.locator('[data-recut-move="split"]').click();await page.goto(url+'#explore/sharing');await page.goto(url+'#workshop/recut');truth(await page.locator('#recut-chooser-title').isVisible(),'recut resets');
  // Real notes download and import stays usable after taking a question route.
  await page.goto(url+'#notes');const dlPromise=page.waitForEvent('download');await page.locator('#download').click();const dl=await dlPromise;const file=path.join(temporary,'synthetic-notes.json');await dl.saveAs(file);await page.locator('#progress-file').setInputFiles(file);await page.locator('#progress-import-confirm').waitFor();await page.locator('#progress-import-confirm').click();await page.locator('#progress-import-status').waitFor();await page.goto(url+'#explore/water');ok(await page.locator('#explore-title').innerText(),'Where might the stormwater go?','imported explorer doorway');await page.goto(url+'#science/play');truth(await page.locator('[data-science-view]').isVisible(),'imported paused science resumes');ok(errors,[],'no errors after journeys');
 }
 await context.close();
}
console.log('Explore actual Chrome assertions',assertions);
}finally{await browser.close();fs.rmSync(temporary,{recursive:true,force:true});}
