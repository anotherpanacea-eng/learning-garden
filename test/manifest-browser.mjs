// Spec 319 browser journeys in Chromium: tap and keyboard tiles, Load it outcomes, set A support, Notes transfer, saving-off, explorers, stale controls.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
const url=process.env.MANIFEST_TEST_URL;if(!url)throw new Error('Serve dist locally and set MANIFEST_TEST_URL.');
const out=process.env.MANIFEST_ARTIFACTS;if(out)mkdirSync(out,{recursive:true});
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const book=p=>p.evaluate(()=>{const id=JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId||'explorer-1';return JSON.parse(localStorage.getItem('number-garden-v1:'+id)||'{}');});
const tile=(p,t,g='lines')=>p.locator(`[data-mf-tray="${g}"][data-mf-tile="${t}"]`);
async function place(p,line,slot,t){await p.locator(`[data-mf-slot="${line}:${slot}"]`).click();await tile(p,t,line==='A3'?'A3':'lines').click();}
async function fresh(width,height){const c=await browser.newContext({viewport:{width,height},acceptDownloads:true});const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;await p.goto(url+'#post/manifest');await p.locator('[data-mf-root]').waitFor();return {c,p};}
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
const small=p=>p.$$eval('.mf-page button,.mf-page summary,.mf-page a',xs=>xs.filter(x=>x.offsetParent).filter(x=>{const r=x.getBoundingClientRect();return r.width<44-0.5||r.height<44-0.5;}).map(x=>x.outerHTML.slice(0,80)));
try{
 for(const [w,h] of [[320,600],[820,1000],[1024,768]]){
  const {c,p}=await fresh(w,h);
  eq(await book(p).then(b=>Object.hasOwn(b,'exchangeManifest')),false,`${w}: opening writes nothing`);
  ok((await p.locator('.mf-every').innerText()).startsWith('Marks tell a reader'),`${w}: every-screen line`);ok(await p.locator('.mf-intro').count()===1,`${w}: first visit shown`);
  ok(!(await overflow(p)),`${w}: no horizontal overflow`);eq(await small(p),[],`${w}: 44 px controls`);
  if(w===820){await p.locator('.mf-bench').evaluate(e=>e.scrollIntoView({block:'start'}));const bench=await p.locator('.mf-bench').boundingBox(),loads=await p.locator('[data-mf-load]').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return [r.top,r.bottom];}));ok(bench.height<=h&&bench.y>=-1&&bench.y+bench.height<=h+1,'tablet viewport holds the whole bench once scrolled to');ok(loads.length===4&&loads.every(([t,b])=>t>=-1&&b<=h+1),'every Load it is on that same tablet screen');await p.evaluate(()=>scrollTo(0,0));}
  // Each slot stays beside the word before it.
  for(const sel of await p.$$('.mf-nowrap'))ok(await sel.evaluate(x=>{const r=x.getClientRects();return r.length===1;}),`${w}: a slot never splits from its word`);
  // Tap: slot then tile, and tile then slot.
  await place(p,'m2','s1','colon');await tile(p,'comma').click();await p.locator('[data-mf-slot="m2:s2"]').click();await place(p,'m2','s3','comma');
  ok(await p.locator('[data-mf-load="m2"]').isEnabled(),`${w}: Load it once every slot holds a tile`);
  await p.locator('[data-mf-load="m2"]').click();await p.locator('#mf-result-m2').waitFor();
  ok((await p.locator('#mf-result-m2 figcaption').innerText())==='Pip loads 6 crates: flour · two sacks · eggs · one dozen · butter · one block.',`${w}: one dozen joke`);
  ok((await p.locator('#mf-result-m2 .mf-said').innerText()).startsWith('Pip can’t tell'),`${w}: loads merged line`);eq(await p.evaluate(()=>document.activeElement?.id),'mf-result-m2',`${w}: focus moves to the result`);
  if(out)await p.screenshot({path:`${out}/manifest-loads-merged-${w}.png`,fullPage:true});
  let saved=(await book(p)).exchangeManifest;eq(saved.lists.m2.crates.length,6);eq(saved.lists.m2.supported,false,`${w}: first attempt unsupported`);
  // Changing a tile clears the shown line until the next Load it.
  await place(p,'m2','s2','semicolon');ok(await p.locator('#mf-result-m2').count()===0,`${w}: change clears the result`);await place(p,'m2','s3','semicolon');await p.locator('[data-mf-load="m2"]').click();
  ok((await p.locator('#mf-result-m2 .mf-said').innerText()).startsWith('Pip loads one crate'),`${w}: fits`);ok(await p.locator('#mf-result-m2 .mf-fits').count()===1,`${w}: What fits after Load it`);
  eq((await book(p)).exchangeManifest.lists.m2.supported,true,`${w}: later attempt carries seen feedback`);
  // Keyboard: focus a slot, Enter, then a tile.
  await p.locator('[data-mf-slot="m4:s1"]').focus();await p.keyboard.press('Enter');await tile(p,'colon').focus();await p.keyboard.press('Enter');await p.locator('[data-mf-load="m4"]').focus();await p.keyboard.press('Enter');
  ok((await p.locator('#mf-result-m4 .mf-said').innerText()).includes('The colon cut the sentence in half.'),`${w}: keyboard placement and colon cut`);ok((await p.locator('#mf-result-m4 figcaption').innerText())==='Pip loads no crates.',`${w}: no crates`);
  await place(p,'m4','s1','semicolon');await p.locator('[data-mf-load="m4"]').click();ok((await p.locator('#mf-result-m4 .mf-said').innerText()).startsWith('A semicolon joins'),`${w}: semicolon lead`);
  for(const [s1,code] of [['empty','lead-merged']]){await place(p,'m1','s1',s1);await place(p,'m1','s2','comma');await place(p,'m1','s3','empty');await p.locator('[data-mf-load="m1"]').click();eq((await book(p)).exchangeManifest.lists.m1.load,code);if(out)await p.screenshot({path:`${out}/manifest-${code}-${w}.png`,fullPage:true});}
  // Worked example: cardsSeen is saved before the steps show.
  await p.locator('[data-mf-worked="card3"] > summary').click();await p.locator('#mf-steps-card3').waitFor();eq((await book(p)).exchangeManifest.cardsSeen,true,`${w}: cardsSeen before display`);
  eq(await p.locator('#mf-steps-card3 li').count(),1,`${w}: one step at a time`);await p.locator('[data-mf-next="card3"]').click();eq(await p.locator('#mf-steps-card3 li').count(),2);
  // Set A: A1 pending before its steps render.
  await p.locator('[data-mf-set] > summary').click();await p.locator('#mf-item-A1').waitFor();eq((await book(p)).exchangeManifest.items.A1,{supported:true,guided:true},`${w}: A1 pending before display`);
  ok(await p.locator('[data-mf-item="A1"] .mf-steps li').count()===3,`${w}: A1 guided steps first`);
  await p.locator('[data-mf-choice="A1:c"]').click();await p.locator('#mf-feedback-A1').waitFor();ok((await p.locator('#mf-feedback-A1').innerText()).includes('runs together'),`${w}: per-choice feedback`);
  await p.locator('[data-mf-stuck="A2"]').click();ok((await p.locator('#mf-ladder-A2').innerText()).includes('Cover each list'),`${w}: ladder step 1`);eq((await book(p)).exchangeManifest.items.A2,{supported:true,guided:false},`${w}: ladder saved before display`);
  await p.locator('[data-mf-stuck="A2"]').click();await p.locator('[data-mf-stuck="A2"]').click();await p.locator('[data-mf-skip="A2"]').click();eq(await p.evaluate(()=>document.activeElement?.id),'mf-item-A3',`${w}: skip moves to the next item`);ok(!Object.hasOwn((await book(p)).exchangeManifest.items.A2,'answer'),`${w}: skip records no answer`);
  for(const [s,t] of [['s1','colon'],['s2','comma'],['s3','comma']])await place(p,'A3',s,t);await p.locator('[data-mf-check="A3"]').click();const fb=await p.locator('#mf-feedback-A3').innerText();ok(fb.includes('six baskets')&&fb.includes('two boxes'),`${w}: both A3 comma lines`);
  await p.locator('[data-mf-retry="A3"]').click();ok(await p.locator('#mf-feedback-A3').count()===1&&await p.locator('[data-mf-check="A3"]').count()===1,`${w}: Try again keeps the earlier attempt on show`);
  await p.locator('[data-mf-choice="A4:c"]').click();eq((await book(p)).exchangeManifest.items.A4.outcome,'fits');
  ok(!(await overflow(p)),`${w}: no overflow after play`);eq(await small(p),[],`${w}: 44 px after play`);
  // Reload restores saved results from the saved strings.
  saved=(await book(p)).exchangeManifest;await p.reload();await p.locator('[data-mf-root]').waitFor();ok(await p.locator('.mf-intro').count()===0&&await p.locator('[data-mf-intro]').count()===1,`${w}: returning visit offers the story again`);
  ok((await p.locator('#mf-result-m2 .mf-said').innerText()).startsWith('Pip loads one crate'),`${w}: saved result after reload`);eq((await book(p)).exchangeManifest,saved,`${w}: reload writes nothing`);
  // 150% root font stand-in.
  await p.addStyleTag({content:'html{font-size:150%}'});ok(!(await overflow(p)),`${w}: 150% root font has no overflow`);
  ok(p.errors.length===0,`${w}: no page errors ${p.errors}`);await c.close();
 }
 // Saving off uses the host's normal switch and keeps both kinds of work in-session.
 {const {c,p}=await fresh(320,600);await p.goto(url+'#notes');await p.locator('#remember').uncheck();
  const storage=await p.evaluate(()=>({...localStorage}));
  await p.goto(url+'#post/manifest');await p.locator('[data-mf-root]').waitFor();await place(p,'m4','s1','empty');await p.locator('[data-mf-load="m4"]').click();
  ok(await p.locator('#mf-result-m4').count()===1,'saving off: Load it works');
  await p.locator('[data-mf-set] > summary').click();await p.locator('[data-mf-choice="A2:b"]').click();ok(await p.locator('#mf-feedback-A2').count()===1,'saving off: item answer works');
  await p.goto(url+'#notes');ok((await p.locator('[data-saving-status]').innerText()).includes('Progress lasts only while this page stays open. Download notes before leaving.'),'saving off: normal host notice');
  const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#download').click()]);const data=JSON.parse((await import('node:fs')).readFileSync(await dl.path(),'utf8'));
  eq(data.exchangeManifest.lists.m4.load,'fits','saving off: line retained in session');eq(data.exchangeManifest.items.A2.answer,'b','saving off: answer retained in session');
  eq(await p.evaluate(()=>({...localStorage})),storage,'saving off: interactions write nothing to storage');ok(!Object.keys(storage).some(k=>k.startsWith('number-garden-v1')),'saving off: no persisted notebooks');await c.close();}
 // A detached, moved-outside-root, or closed-disclosure control cannot act in a live visit.
 for(const mode of ['detached','outside','closed']){const {c,p}=await fresh(820,1000);await p.locator('[data-mf-set] > summary').click();
  const before=(await book(p)).exchangeManifest;
  await p.evaluate(mode=>{const b=document.querySelector('[data-mf-choice="A2:b"]');if(mode==='detached')b.remove();else if(mode==='outside')document.body.append(b);else b.closest('details').open=false;b.click();},mode);
  eq((await book(p)).exchangeManifest,before,mode+' control cannot submit');await c.close();}
 // Notes download, reset-free import as a new explorer, reload.
 {const {c,p}=await fresh(820,1000);await place(p,'m1','s1','colon');await place(p,'m1','s2','comma');await place(p,'m1','s3','comma');await p.locator('[data-mf-load="m1"]').click();const before=(await book(p)).exchangeManifest;
  await p.goto(url+'#notes');ok((await p.locator('details:has-text("Market list marks")').innerText()).length>0,'Notes section');
  const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#download').click()]);const file=await dl.path(),text=(await import('node:fs')).readFileSync(file,'utf8');eq(JSON.parse(text).exchangeManifest,before,'actual Notes download keeps the root');
  await p.locator('#progress-file').setInputFiles({name:'manifest.json',mimeType:'application/json',buffer:Buffer.from(text)});await p.locator('#progress-import-confirm').click();
  await p.goto(url+'#post/manifest');await p.locator('[data-mf-root]').waitFor();const imported=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);await p.reload();await p.locator(`[data-select-explorer="${imported}"]`).click();await p.locator('[data-mf-root]').waitFor();ok(p.url().endsWith('#post/manifest'),'reload and choosing the explorer stay on the page');eq((await book(p)).exchangeManifest,before,'imported explorer reopens with the root');ok(await p.locator('#mf-result-m1').count()===1,'imported result shows');await c.close();}
 // Unknown version: read-only page, nothing written.
 {const seed=freshState();seed.exchangeManifest={v:9,later:true};const c=await browser.newContext();await c.addInitScript(s=>{if(!localStorage.getItem('learning-garden-explorers'))localStorage.setItem('number-garden-v1',JSON.stringify(s));},seed);const p=await c.newPage();await p.goto(url+'#post/manifest');await p.locator('[data-mf-root="closed"]').waitFor();
  ok((await p.locator('.mf-page').innerText()).includes('different version'),'unknown version notice');ok(await p.locator('[data-mf-load],[data-mf-set]').count()===0,'no controls');eq((await book(p)).exchangeManifest,{v:9,later:true},'unknown root exact');await c.close();}
 // Stale controls cannot write after switching explorer; saving-off is in-memory play.
 {const {c,p}=await fresh(820,1000);await place(p,'m4','s1','empty');const stale=await p.evaluateHandle(()=>document.querySelector('[data-mf-load="m4"]'));
  await p.locator('#explorer-switch').click();await p.locator('#explorer-new').click();await p.locator('#explorer-create').click();await p.locator('[data-mf-root]').waitFor();
  await stale.evaluate(b=>b.click());ok(!Object.hasOwn(await book(p),'exchangeManifest'),'detached control writes to neither explorer');eq(p.url().endsWith('#post/manifest'),true,'switch stays on the page');await c.close();}
}finally{await browser.close();}
console.log(`Exchange Manifest browser checks: ${n} assertions passed.`);
