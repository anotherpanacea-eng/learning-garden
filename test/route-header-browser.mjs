// Every early-return route shows the explorer chip, the chosen guide's link and its own nav highlight (spec 279 step 1).
import assert from 'node:assert/strict';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
const url=process.env.ROUTE_HEADER_TEST_URL;
if(!url)throw new Error('Serve dist locally and set ROUTE_HEADER_TEST_URL.');
// Route and the nav destination it highlights; null highlights none. Inventory: docs/reviews/route-inventory-2026-10-31.md.
const routes=[['#workshop/design','#workshop'],['#library/word-list',null],['#workshop/mending','#workshop'],['#library/copy',null],['#library/endings',null],['#library/spellings',null],['#almanac/beyond','#storm'],['#almanac/beyond/seeds','#storm'],['#almanac/both-ways','#storm'],['#almanac/the-ways','#storm'],['#desk/writing',null],['#desk/exchange',null],['#words/endings',null],['#words/props',null],['#journeys',null],
 ['#workshop/old-map','#workshop'],['#mill/energy','#workshop'],['#workshop/lift','#workshop'],['#studio/sound-window',null],
 ['#workshop/switch-table','#workshop'],['#science/ice','#science'],['#post/ferry','#post'],['#post/manifest','#post'],['#workshop/hinge','#workshop'],
 ['#workshop/copy-frame','#workshop'],['#workshop/ribbon-measures','#workshop'],['#workshop/same-ground','#workshop'],
 ['#workshop/common-cuts',null],['#almanac/upstream-reply',null],['#studio/field-strips',null],['#desk/gaps',null],
 ['#studio/mixing/bars',null],['#studio/mixing',null],['#living/who-eats',null],['#post/register',null],['#learn/math/paired',null],
 ['#almanac/weather',null],['#almanac/tallies',null],['#studio/rhythm',null],['#science/water-shares','#science'],
 ['#post/descriptions','#post'],['#post/codes','#post'],['#arrive',null],['#begin',null],['#learn/math',null],['#pathways/science',null],
 ['#cafe/units','#cafe'],['#loft/shadows',null],['#workshop/scale','#workshop']];
const seed=initializeExplorerState(freshState());seed.garden.welcomeFilmSeen=true;seed.garden.guide='ari';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
let assertions=0;const ok=(actual,expected,msg)=>{assert.deepEqual(actual,expected,msg);assertions++;};
try{
 const context=await browser.newContext({viewport:{width:390,height:844}});await context.addInitScript(s=>localStorage.setItem('number-garden-v1',JSON.stringify(s)),seed);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // #storm, highlighted by no inventoried route, sets the nav first, so every route below has to replace it.
 for(const [hash,nav] of routes){
  await page.goto(url+'#storm');await page.locator('.header nav a[href="#storm"][aria-current="page"]').waitFor();
  await page.goto(url+hash);await page.waitForFunction(nav=>document.querySelector('.header nav a[href="#storm"]').getAttribute('aria-current')===(nav==='#storm'?'page':'false')&&document.querySelector('#explorer-header')?.childElementCount>0,nav);
  ok(await page.evaluate(()=>location.hash),hash,hash+' stays on its route');
  ok((await page.locator('#explorer-header').innerText()).trim().length>0,true,hash+' explorer chip');
  ok((await page.locator('#companion-link').textContent()).trim(),'With Ari',hash+' guide link names the chosen guide');
  ok(await page.$$eval('.header nav a',(as,nav)=>as.filter(a=>a.getAttribute('aria-current')!==(a.getAttribute('href')===nav?'page':'false')).map(a=>a.getAttribute('href')),nav),[],hash+' nav highlight');
 }
 ok(errors,[],'no page errors');
}finally{await browser.close();}
console.log(`Route header browser checks: ${routes.length} routes, ${assertions} assertions passed.`);
