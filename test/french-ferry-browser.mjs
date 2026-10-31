// Spec 327 browser journeys in Chromium: the #bac route, a full morning crossing without a French voice, help records, Notes, links, unknown versions, stale controls and the Ferry Deck staying separate.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {makeCrossingSource} from '../dist/french-ferry-content.mjs';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
const url=process.env.BAC_TEST_URL;if(!url)throw new Error('Serve dist locally and set BAC_TEST_URL.');
const out=process.env.BAC_ARTIFACTS;if(out)mkdirSync(out,{recursive:true});
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const book=p=>p.evaluate(()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId||'explorer-1';return JSON.parse(localStorage.getItem('number-garden-v1:'+id)||'{}');});
const act=(p,a)=>p.locator(`[data-bac-action="${a}"]`).first();
const morning=makeCrossingSource('morning');
async function fresh(width,height){const c=await browser.newContext({viewport:{width,height},acceptDownloads:true});const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;await p.goto(url+'#bac');await p.locator('[data-bac-root]').waitFor();return {c,p};}
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
const small=p=>p.$$eval('.bac-page button,.bac-page summary,.bac-page a',xs=>xs.filter(x=>x.offsetParent).filter(x=>{const r=x.getBoundingClientRect();return r.width<44-0.5||r.height<44-0.5;}).map(x=>x.outerHTML.slice(0,80)));
const step=p=>p.locator('[data-bac-step]').getAttribute('data-bac-step');
try{
 for(const [w,h] of [[320,600],[820,1000],[1024,768]]){
  const {c,p}=await fresh(w,h);
  eq(Object.hasOwn(await book(p),'frenchFerry'),false,`${w}: opening the route writes nothing`);
  ok((await p.locator('#bac-title').innerText()).startsWith('Le bac'),`${w}: page heading`);
  ok(await p.locator('#bac-teach-title').count()===1,`${w}: teaching card shows on a first visit`);
  ok(!(await overflow(p)),`${w}: no horizontal overflow on arrival`);eq(await small(p),[],`${w}: 44 px controls on arrival`);
  await act(p,'open-morning').click();await p.locator('#bac-crossing-title').waitFor();
  ok((await book(p)).frenchFerry?.crossings?.morning,`${w}: opening the morning crossing saves it`);
  ok(await p.locator('.bac-crossing .bac-novoice').count()>=1,`${w}: no-voice notice without a local French voice`);
  ok((await p.locator('.bac-crossing .bac-line').first().innerText()).includes('«'),`${w}: her line is shown in French guillemets when there is no voice`);
  // Steps 1 to 4: a wrong card first on step 1, then the fit, then say aloud or not now.
  const wrong=morning.cards.find(k=>k.id!==morning.steps[0].fit).id;
  await p.locator(`[data-bac-card="${wrong}"]`).click();ok(await p.locator('.bac-feedback').count()===1,`${w}: a wrong card gets feedback`);
  for(let i=0;i<4;i++){
   eq(await step(p),String(i),`${w}: step ${i+1} answer`);
   await p.locator(`[data-bac-card="${morning.steps[i].fit}"]`).click();await p.locator('.bac-fit').waitFor();
   if(i===0&&(w===320))ok(!(await overflow(p)),`${w}: no overflow on the fit view`);
   await act(p,i%2?'not-now':'said').click();
  }
  // Step 5: say first, then pick the clock.
  eq(await step(p),'4',`${w}: step 5`);await act(p,'said').click();
  ok(await p.locator('.bac-clock').count()===3,`${w}: three drawn clock faces`);
  ok(!(await overflow(p)),`${w}: no overflow with the clocks`);eq(await small(p),[],`${w}: 44 px clock answers`);
  await p.locator(`[data-bac-card="${morning.steps[4].fit}"]`).click();
  await p.locator('[data-bac-step="end"]').waitFor();
  const saved=(await book(p)).frenchFerry.crossings.morning;ok(saved.steps.filter(x=>x.said==='said').length===3,`${w}: said aloud recorded on three steps`);
  if(out)await p.screenshot({path:`${out}/bac-${w}.png`,fullPage:true});
  ok(p.errors.length===0,`${w}: no page errors (${p.errors.join('; ')})`);await c.close();
 }
 // English meaning help is recorded before it shows; the crossing reopens after a reload.
 {const {c,p}=await fresh(820,1000);await act(p,'open-afternoon').click();await p.locator('#bac-crossing-title').waitFor();
  await act(p,'meaning').click();await p.locator('.bac-crossing .bac-gloss').first().waitFor();
  ok((await book(p)).frenchFerry.crossings.afternoon.steps[0].meaning===true,'meaning help saved');
  await p.reload();await p.locator('[data-bac-root]').waitFor();ok(await p.locator('#bac-crossing-title').count()===1,'an uncrossed crossing reopens after a reload');
  await act(p,'card-sounds').click();await p.locator('#bac-sounds-title').waitFor();ok(true,'sounds card opens');
  await p.goto(url+'#notes');ok((await p.locator('details:has-text("The ferry crossing (French)")').first().innerText()).length>0,'Notes section');
  await p.goto(url+'#home');ok(await p.locator('a[href="#bac"]').count()>=1,'Home links the crossing');
  await p.goto(url+'#learn/french');await p.locator('[data-rooms-root]').waitFor();ok(await p.locator('a[href="#bac"]').count()===1,'the French learning page links the crossing');
  await p.goto(url+'#bac/extra');await p.waitForTimeout(200);ok(await p.locator('[data-bac-root]').count()===0,'a suffixed hash is not the crossing');
  // The older Ferry Deck keeps its own root and styles.
  await p.goto(url+'#post/ferry');await p.locator('[data-ferry-root]').first().waitFor();ok(await p.locator('[data-bac-root]').count()===0,'Ferry Deck page is separate');await c.close();}
 // Unknown version: read-only page, nothing written.
 {const seed=freshState();seed.frenchFerry={v:9,later:true};const c=await browser.newContext();await c.addInitScript(s=>{if(!localStorage.getItem('learning-garden-explorers'))localStorage.setItem('number-garden-v1',JSON.stringify(s));},seed);const p=await c.newPage();await p.goto(url+'#bac');await p.locator('[data-bac-root]').waitFor();
  ok(await p.locator('[data-bac-action^="open-"]').count()===0,'no crossing controls for an unknown version');eq((await book(p)).frenchFerry,{v:9,later:true},'unknown root kept exactly');await c.close();}
 // A control left over from another explorer cannot write.
 {const {c,p}=await fresh(820,1000);await act(p,'open-morning').click();await p.locator('#bac-crossing-title').waitFor();const stale=await p.evaluateHandle(fit=>document.querySelector(`[data-bac-card="${fit}"]`),morning.steps[0].fit);
  await p.locator('#explorer-switch').click();await p.locator('#explorer-new').click();await p.locator('#explorer-create').click();await p.locator('[data-bac-root]').waitFor();
  await stale.evaluate(b=>b.click());ok(!Object.hasOwn(await book(p),'frenchFerry'),'detached control writes to neither explorer');ok(p.url().endsWith('#bac'),'switch stays on the page');await c.close();}
}finally{await browser.close();}
console.log(`French ferry browser checks: ${n} assertions passed.`);
