// Spec 324 browser journeys in Chromium: the #mercado route, La carga placements, Marisol's lines, the question, support records, Notes, links, unknown versions and stale controls.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
const url=process.env.RIVER_TEST_URL;if(!url)throw new Error('Serve dist locally and set RIVER_TEST_URL.');
const out=process.env.RIVER_ARTIFACTS;if(out)mkdirSync(out,{recursive:true});
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const book=p=>p.evaluate(()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId||'explorer-1';return JSON.parse(localStorage.getItem('number-garden-v1:'+id)||'{}');});
const act=(p,a)=>p.locator(`[data-river-action="${a}"]`).first();
async function put(p,item,place){await p.locator(`[data-river-item="${item}"]`).click();await p.locator(`[data-river-place="${place}"]`).click();}
async function fresh(width,height){const c=await browser.newContext({viewport:{width,height},acceptDownloads:true});const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;await p.goto(url+'#mercado');await p.locator('[data-river-root]').waitFor();return {c,p};}
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
const small=p=>p.$$eval('.river-page button,.river-page summary,.river-page a',xs=>xs.filter(x=>x.offsetParent).filter(x=>{const r=x.getBoundingClientRect();return r.width<44-0.5||r.height<44-0.5;}).map(x=>x.outerHTML.slice(0,80)));
try{
 for(const [w,h] of [[320,600],[820,1000],[1024,768]]){
  const {c,p}=await fresh(w,h);
  eq(Object.hasOwn(await book(p),'spanish'),false,`${w}: opening the route writes nothing`);
  ok((await p.locator('#river-title').innerText())==='The River Market (Spanish)',`${w}: page heading`);
  ok(!(await overflow(p)),`${w}: no horizontal overflow before the errand`);eq(await small(p),[],`${w}: 44 px controls before the errand`);
  await act(p,'open').click();await p.locator('.river-note').waitFor();
  const saved=(await book(p)).spanish;ok(saved?.errands?.carga?.tryId===1,`${w}: opening La carga takes try 1`);
  ok(!(await overflow(p)),`${w}: no horizontal overflow in the errand`);eq(await small(p),[],`${w}: 44 px controls in the errand`);
  if(w===820){await p.locator('.river-task').evaluate(e=>e.scrollIntoView({block:'start'}));const vis=await p.evaluate(()=>['.river-note','.river-landing','.river-places'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}));eq(vis.slice(1),[true,true],'820: landing and buildings visible together');}
  // Wrong place first, then the right ones; Done brings Marisol's lines and the question.
  await put(p,'miel-1','panaderia');ok(await p.locator('[data-river-place="panaderia"] ~ .river-placed [data-river-item="miel-1"]').count()===1,`${w}: tap item then building places it`);
  for(const id of ['miel-2','miel-3'])await put(p,id,'cafe');for(const id of ['harina-1','harina-2'])await put(p,id,'panaderia');
  await act(p,'done').click();await p.locator('.river-line').first().waitFor();
  ok((await p.locator('.river-replies').innerText()).includes('La miel está en la panadería.'),`${w}: Marisol names the misplaced honey`);
  ok((await p.locator('#river-status').innerText()).length>0,`${w}: the line is announced in the status region`);
  await p.locator('[data-river-choice="dos"]').click();ok((await p.locator('.river-nudge').innerText()).includes('Look for the number'),`${w}: wrong count nudges`);
  if(out)await p.screenshot({path:`${out}/river-market-${w}.png`,fullPage:true});
  ok(p.errors.length===0,`${w}: no page errors (${p.errors.join('; ')})`);await c.close();
 }
 // English help is recorded before it shows; reload keeps the errand and its label.
 {const {c,p}=await fresh(820,1000);await act(p,'open').click();await p.locator('.river-note').waitFor();
  await act(p,'meaning').click();await p.locator('.river-gloss').first().waitFor();ok((await book(p)).spanish.errands.carga.support.meaning===true,'meaning support saved');
  await p.reload();await p.locator('[data-river-root]').waitFor();ok((await p.locator('.river-arrival').innerText()).includes('still at the landing'),'later arrival line after reload');ok(await p.locator('.river-helped').count()===1,'English help label shown');
  await act(p,'cuaderno').click();await p.locator('#river-cuaderno-title').waitFor();ok((await p.locator('.river-cuaderno').innerText()).includes('la panadería'),'Mi cuaderno lists the errand words');
  await p.goto(url+'#notes');ok((await p.locator('details:has-text("The River Market (Spanish)")').first().innerText()).length>0,'Notes section');
  await p.goto(url+'#home');ok(await p.locator('a[href="#mercado"]').count()>=1,'Home links the market');await c.close();}
 // Unknown version: read-only page, nothing written.
 {const seed=freshState();seed.spanish={v:9,later:true};const c=await browser.newContext();await c.addInitScript(s=>{if(!localStorage.getItem('learning-garden-explorers'))localStorage.setItem('number-garden-v1',JSON.stringify(s));},seed);const p=await c.newPage();await p.goto(url+'#mercado');await p.locator('[data-river-root]').waitFor();
  ok(await p.locator('[data-river-action="open"]').count()===0,'no errand controls for an unknown version');ok(await p.locator('[data-river-root] a[href="#notes"]').count()===1,'Notes link offered');eq((await book(p)).spanish,{v:9,later:true},'unknown root kept exactly');await c.close();}
 // A control left over from another explorer cannot write.
 {const {c,p}=await fresh(820,1000);await act(p,'open').click();await p.locator('.river-note').waitFor();const stale=await p.evaluateHandle(()=>document.querySelector('[data-river-action="meaning"]'));
  await p.locator('#explorer-switch').click();await p.locator('#explorer-new').click();await p.locator('#explorer-create').click();await p.locator('[data-river-root]').waitFor();
  const snapshot=()=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));const before=await snapshot();
  await stale.evaluate(b=>b.click());eq(await snapshot(),before,'a detached writing control changes neither explorer');ok(!Object.hasOwn(await book(p),'spanish'),'the new explorer has no market save');ok(p.url().endsWith('#mercado'),'switch stays on the page');await c.close();}
}finally{await browser.close();}
console.log(`River Market browser checks: ${n} assertions passed.`);
