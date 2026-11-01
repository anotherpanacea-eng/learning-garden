// Spec 319, 329 and 349 browser journeys in Chromium: tap and keyboard tiles, Load it outcomes, set A support, Notes transfer, saving-off, explorers, stale controls.
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
  if(w===820){await p.locator('.mf-bench:not(.mf-join):not(.mf-crate-bench)').evaluate(e=>e.scrollIntoView({block:'start'}));const bench=await p.locator('.mf-bench:not(.mf-join):not(.mf-crate-bench)').boundingBox(),loads=await p.locator('[data-mf-load]').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return [r.top,r.bottom];}));ok(bench.height<=h&&bench.y>=-1&&bench.y+bench.height<=h+1,'tablet viewport holds the whole bench once scrolled to');ok(loads.length===4&&loads.every(([t,b])=>t>=-1&&b<=h+1),'every Load it is on that same tablet screen');await p.evaluate(()=>scrollTo(0,0));}
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
  await p.locator('[data-mf-set="A"] > summary').click();await p.locator('#mf-item-A1').waitFor();eq((await book(p)).exchangeManifest.items.A1,{supported:true,guided:true},`${w}: A1 pending before display`);
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
  await p.locator('[data-mf-set="A"] > summary').click();await p.locator('[data-mf-choice="A2:b"]').click();ok(await p.locator('#mf-feedback-A2').count()===1,'saving off: item answer works');
  await p.goto(url+'#notes');ok((await p.locator('[data-saving-status]').innerText()).includes('Progress lasts only while this page stays open. Download notes before leaving.'),'saving off: normal host notice');
  const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#download').click()]);const data=JSON.parse((await import('node:fs')).readFileSync(await dl.path(),'utf8'));
  eq(data.exchangeManifest.lists.m4.load,'fits','saving off: line retained in session');eq(data.exchangeManifest.items.A2.answer,'b','saving off: answer retained in session');
  eq(await p.evaluate(()=>({...localStorage})),storage,'saving off: interactions write nothing to storage');ok(!Object.keys(storage).some(k=>k.startsWith('number-garden-v1')),'saving off: no persisted notebooks');await c.close();}
 // A detached, moved-outside-root, or closed-disclosure control cannot act in a live visit.
 for(const mode of ['detached','outside','closed']){const {c,p}=await fresh(820,1000);await p.locator('[data-mf-set="A"] > summary').click();
  const before=(await book(p)).exchangeManifest;
  await p.evaluate(mode=>{const b=document.querySelector('[data-mf-choice="A2:b"]');if(mode==='detached')b.remove();else if(mode==='outside')document.body.append(b);else b.closest('details').open=false;b.click();},mode);
  eq((await book(p)).exchangeManifest,before,mode+' control cannot submit');await c.close();}
 // A summary may open its own closed disclosure, but not act after removal,
 // relocation outside the visit, or concealment inside a closed ancestor.
 for(const selector of ['[data-mf-worked] > summary','[data-mf-set="A"] > summary'])for(const mode of ['detached','outside','closed']){
  const {c,p}=await fresh(820,1000),before=await book(p);
  await p.evaluate(({selector,mode})=>{const sum=document.querySelector(selector);if(mode==='detached')sum.remove();else if(mode==='outside')document.body.append(sum);else{const wrapper=document.createElement('details');sum.parentElement.before(wrapper);wrapper.append(sum.parentElement);}sum.click();},{selector,mode});
  eq(await book(p),before,`${selector}: ${mode} summary cannot save support`);
  ok(!await p.locator('[data-mf-worked] ol,[data-mf-item]').count(),`${selector}: ${mode} summary reveals no support`);
  eq(p.errors,[],`${selector}: ${mode} summary causes no page error`);await c.close();
 }
 // Notes download, reset-free import as a new explorer, reload.
 {const {c,p}=await fresh(820,1000);await place(p,'m1','s1','colon');await place(p,'m1','s2','comma');await place(p,'m1','s3','comma');await p.locator('[data-mf-load="m1"]').click();const before=(await book(p)).exchangeManifest;
  await p.goto(url+'#notes');ok((await p.locator('details:has-text("Market list marks")').innerText()).length>0,'Notes section');
  const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#download').click()]);const file=await dl.path(),text=(await import('node:fs')).readFileSync(file,'utf8');eq(JSON.parse(text).exchangeManifest,before,'actual Notes download keeps the root');
  await p.locator('#progress-file').setInputFiles({name:'manifest.json',mimeType:'application/json',buffer:Buffer.from(text)});await p.locator('#progress-import-confirm').click();
  await p.goto(url+'#post/manifest');await p.locator('[data-mf-root]').waitFor();const imported=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);await p.reload();await p.locator(`[data-select-explorer="${imported}"]`).click();await p.locator('[data-mf-root]').waitFor();ok(p.url().endsWith('#post/manifest'),'reload and choosing the explorer stay on the page');eq((await book(p)).exchangeManifest,before,'imported explorer reopens with the root');ok(await p.locator('#mf-result-m1').count()===1,'imported result shows');await c.close();}
 // Unknown version: read-only page, nothing written.
 {const seed=freshState();seed.exchangeManifest={v:9,later:true};const c=await browser.newContext();await c.addInitScript(s=>{if(!localStorage.getItem('learning-garden-explorers'))localStorage.setItem('number-garden-v1',JSON.stringify(s));},seed);const p=await c.newPage();await p.goto(url+'#post/manifest');await p.locator('[data-mf-root="closed"]').waitFor();
  ok((await p.locator('.mf-page').innerText()).includes('different version'),'unknown version notice');ok(await p.locator('[data-mf-load],[data-mf-set="A"]').count()===0,'no controls');eq((await book(p)).exchangeManifest,{v:9,later:true},'unknown root exact');await c.close();}
 // Stale controls cannot write after switching explorer; saving-off is in-memory play.
 {const {c,p}=await fresh(820,1000);await place(p,'m4','s1','empty');const stale=await p.evaluateHandle(()=>document.querySelector('[data-mf-load="m4"]'));
  await p.locator('#explorer-switch').click();await p.locator('#explorer-new').click();await p.locator('#explorer-create').click();await p.locator('[data-mf-root]').waitFor();
  await stale.evaluate(b=>b.click());ok(!Object.hasOwn(await book(p),'exchangeManifest'),'detached control writes to neither explorer');eq(p.url().endsWith('#post/manifest'),true,'switch stays on the page');await c.close();}
 // Spec 329: Joining Dot's Notes and set C at every width.
 const note=(p,id,t)=>p.locator(`[data-mf-slot="${id}:s1"]`).click().then(()=>p.locator(`[data-mf-tray="notes"][data-mf-tile="${t}"]`).click());
 for(const [w,h] of [[320,600],[820,1000],[1024,768]]){
  const {c,p}=await fresh(w,h);
  ok(await p.locator('.mf-join h2').innerText()==='Joining Dot’s Notes',`${w}: bench title`);
  for(const n of ['n1','n2','n3','n4','n5'])ok(await p.locator(`[data-mf-read="${n}"]`).isDisabled(),`${w}: Read it waits for a tile on ${n}`);
  if(w===820){await p.locator('.mf-join').evaluate(e=>e.scrollIntoView({block:'start'}));const box=await p.locator('.mf-join .mf-lines').boundingBox(),reads=await p.locator('[data-mf-read]').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().bottom));ok(box.y>=0&&Math.max(...reads)<=1000,'820: the five notes and every Read it fit in one screen once scrolled to');}
  for(const sel of await p.$$('.mf-join .mf-nowrap'))ok(await sel.evaluate(x=>x.getClientRects().length===1),`${w}: a gap never splits from its word`);
  // Tap gap then tile, and tile then gap.
  await note(p,'n4','period');ok((await p.locator('[data-mf-note="n4"] .mf-sentence').innerText()).includes(' We take the bridge road.'),`${w}: period capital in the editable note`);await p.locator('[data-mf-tray="notes"][data-mf-tile="comma"]').click();await p.locator('[data-mf-slot="n1:s1"]').click();
  ok((await p.locator('[data-mf-slot="n1:s1"]').getAttribute('aria-label'))==='Gap, comma ( , )',`${w}: gap names its tile`);
  await p.locator('[data-mf-read="n1"]').click();await p.locator('#mf-result-n1').waitFor();
  eq(await p.locator('#mf-result-n1 .mf-joined').innerText(),'The river path is fast, the bridge road is dry.',`${w}: punctuated note`);
  ok((await p.locator('#mf-result-n1 .mf-said').innerText()).startsWith('A comma alone can’t'),`${w}: comma line`);eq(await p.evaluate(()=>document.activeElement?.id),'mf-result-n1',`${w}: focus moves to the result`);
  await p.locator('[data-mf-read="n4"]').click();await p.locator('#mf-result-n4').waitFor();ok((await p.locator('#mf-result-n4 .mf-said').innerText()).includes('can’t stand alone'),`${w}: because part alone`);
  eq(await p.locator('#mf-result-n4 .mf-joined').innerText(),'Because the river path floods. We take the bridge road.',`${w}: period capital`);
  // Keyboard: focus the gap, Enter, then a tile; changing the tile clears the line until Read it.
  await p.locator('[data-mf-slot="n2:s1"]').focus();await p.keyboard.press('Enter');await p.locator('[data-mf-tray="notes"][data-mf-tile="colon"]').focus();await p.keyboard.press('Enter');await p.locator('[data-mf-read="n2"]').focus();await p.keyboard.press('Enter');
  ok((await p.locator('#mf-result-n2 .mf-said').innerText())==='Here’s why, or here’s what.',`${w}: keyboard placement and the colon line`);
  await note(p,'n2','dash');ok(await p.locator('#mf-result-n2').count()===0,`${w}: change clears the line`);
  let saved=(await book(p)).exchangeManifest.joins;eq([saved.n1.outcome,saved.n4.outcome,saved.n2.mark],['other','other','colon'],`${w}: joins saved`);
  // Set C: opening the disclosure saves C1's guided support before its steps show.
  await p.locator('[data-mf-set="C"] > summary').click();await p.locator('#mf-item-C1').waitFor();eq((await book(p)).exchangeManifest.items.C1,{supported:true,guided:true},`${w}: C1 pending before its steps`);
  ok(await p.locator('[data-mf-item="C1"] .mf-steps li').count()===3,`${w}: C1 steps`);
  await p.locator('[data-mf-choice="C1:a"]').click();await p.locator('#mf-feedback-C1').waitFor();ok((await p.locator('#mf-feedback-C1').innerText()).includes('A comma alone can’t join two whole sentences.'),`${w}: C1 feedback`);
  await p.locator('[data-mf-slot="C5:s1"]').click();await p.locator('[data-mf-tray="C5"][data-mf-tile="period"]').click();ok(await p.locator('[data-mf-check="C5"]').isEnabled(),`${w}: C5 Check once filled`);await p.locator('[data-mf-check="C5"]').click();await p.locator('#mf-feedback-C5').waitFor();
  ok((await p.locator('#mf-feedback-C5').innerText()).includes('The bridge road is slow. It is always dry.'),`${w}: C5 capital It`);eq((await book(p)).exchangeManifest.items.C5.outcome,'fits',`${w}: C5 saved`);
  ok(!(await overflow(p)),`${w}: no horizontal overflow with both benches and sets open`);eq(await small(p),[],`${w}: 44 px controls with both sets open`);
  if(out)await p.screenshot({path:`${out}/manifest-joins-${w}.png`,fullPage:true});
  ok(p.errors.length===0,`${w}: no page errors (${p.errors.join('; ')})`);await c.close();
 }
 // Every Read it line, once, with a screenshot of each.
 {const {c,p}=await fresh(820,1000);const lines={};
  for(const [n,t] of [['n4','comma'],['n4','nothing'],['n4','dash'],['n1','comma'],['n1','nothing'],['n1','colon'],['n2','period'],['n2','semicolon'],['n2','colon'],['n2','dash']]){await note(p,n,t);await p.locator(`[data-mf-read="${n}"]`).click();await p.locator(`#mf-result-${n}`).waitFor();lines[`${n}:${t}`]=await p.locator(`#mf-result-${n} .mf-said`).innerText();if(out)await p.locator(`#mf-result-${n}`).screenshot({path:`${out}/manifest-read-${n}-${t}.png`});}
  eq(new Set(Object.values(lines)).size,10,'ten distinct Read it lines shown');
  // Notes list the saved joins under their subheading; reload keeps the chosen marks.
  await p.reload();await p.locator('[data-mf-root]').waitFor();eq(await p.locator('[data-mf-slot="n2:s1"]').getAttribute('aria-label'),'Gap, dash ( – )','reload keeps the saved mark');
  await p.goto(url+'#notes');ok((await p.locator('details:has-text("Market list marks")').innerText()).length>0,'Notes section');ok(await p.locator('details:has-text("Market list marks") h4:has-text("Joining Dot’s notes")').count()===1,'Notes subheading for joins');await c.close();}
 // A stale note control cannot write after switching explorer.
 {const {c,p}=await fresh(820,1000);await note(p,'n3','dash');const stale=await p.evaluateHandle(()=>document.querySelector('[data-mf-read="n3"]'));
  const before=await p.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries(localStorage))));
  await p.locator('#explorer-switch').click();await p.locator('#explorer-new').click();await p.locator('#explorer-create').click();await p.locator('[data-mf-root]').waitFor();
  const mid=await p.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries(localStorage))));await stale.evaluate(b=>b.click());const after=await p.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries(localStorage))));
  eq(after,mid,'detached Read it writes to no explorer');ok(!before.includes('"joins"'),'nothing was saved before the switch');await c.close();}
 // Spec 349: the Book Crate, card 10 and set D. The full journey runs at 820; 320 and 1024 are representative.
 const pick=(p,id,t)=>p.locator(`[data-mf-title="${id}:${t}"]`).click();
 const handOn=p=>p.locator('[data-mf-hand]').getAttribute('aria-pressed').then(x=>x==='true');
 for(const [w,h] of [[320,600],[820,1000],[1024,768]]){
  const {c,p}=await fresh(w,h),full=w===820;
  ok(await p.locator('.mf-crate-bench h2').innerText()==='The Book Crate',`${w}: bench title`);eq(await p.locator('[data-mf-crate]').count(),8,`${w}: eight titles`);eq(await handOn(p),false,`${w}: Hand mode off on a new visit`);
  // Pair cards: one column at 320, two from 820.
  const xs=await p.locator('.mf-pair').evaluateAll(xs=>xs.map(x=>Math.round(x.getBoundingClientRect().left)));eq(new Set(xs).size,w<820?1:2,`${w}: pair card columns`);
  // Tap: italics on t1.
  await pick(p,'t1','italics');await p.locator('#mf-crate-t1').waitFor();eq(await p.evaluate(()=>document.activeElement?.id),'mf-crate-t1',`${w}: focus moves to the result`);
  ok((await p.locator('#mf-crate-t1 .mf-said').innerText())==='A whole work leans over in italics.',`${w}: whole italics line`);eq(await p.locator('#mf-crate-t1 em').evaluate(x=>getComputedStyle(x).fontStyle),'italic',`${w}: italics drawn`);
  eq((await book(p)).exchangeManifest.crate.t1.supported,false,`${w}: first choice unsupported`);
  // Hand mode: labels change, the committed row does not.
  await p.locator('[data-mf-hand]').click();eq(await handOn(p),true,`${w}: Hand mode on`);eq(await p.evaluate(()=>document.activeElement?.dataset.mfHand),'',`${w}: focus stays on the toggle`);
  eq(await p.locator('[data-mf-title="t3:italics"]').innerText(),'underline',`${w}: italics tile reads underline`);ok(await p.locator('#mf-crate-t1 em').count()===1&&await p.locator('#mf-crate-t1 .mf-underline').count()===0,`${w}: toggling never redraws a committed row`);
  // Keyboard: underline on t3.
  await p.locator('[data-mf-title="t3:italics"]').focus();await p.keyboard.press('Enter');await p.locator('#mf-crate-t3').waitFor();
  ok((await p.locator('#mf-crate-t3 .mf-said').innerText())==='By hand, a whole work is underlined.',`${w}: keyboard choice and the underline line`);
  const u=await p.locator('#mf-crate-t3 .mf-underline').evaluate(x=>{const st=getComputedStyle(x);return {line:st.textDecorationLine,cursor:st.cursor,color:st.color,parent:getComputedStyle(x.parentElement).color,link:!!x.closest('a')};});
  ok(u.line.includes('underline')&&u.cursor!=='pointer'&&u.color===u.parent&&!u.link,`${w}: underline is not a link style ${JSON.stringify(u)}`);
  eq(await p.locator('#mf-crate-t3 .sr-only').innerText(),'A Child’s Garden of Verses, underlined',`${w}: underlined accessible name`);
  let saved=(await book(p)).exchangeManifest.crate.t3;eq([saved.mark,saved.hand,saved.text,saved.outcome],['italics',true,'_A Child’s Garden of Verses_','fits'],`${w}: underline saved as italics by hand`);
  // Quotes on t2 keeps Hand mode; the three marks are visibly distinct.
  await pick(p,'t2','quotes');ok((await p.locator('#mf-crate-t2 .mf-marked').innerText())==='“The River Bank”',`${w}: quotes drawn`);eq(await handOn(p),true,`${w}: Hand mode kept across a tile choice`);
  if(full){
   for(const [id,t] of [['t4','italics'],['t5','plain'],['t6','quotes'],['t7','quotes'],['t8','italics']])await pick(p,id,t);
   const lines=await p.locator('[data-mf-crate] .mf-said').allInnerTexts();eq(lines.length,8,'820: every title chosen');ok(lines.includes('This is a whole newspaper. Most school writing uses italics.')&&lines.includes('A part, or a short work, goes in quotation marks.')&&lines.includes('This one lives inside a bigger work. Try quotation marks.')&&lines.includes('Plain letters hide that it’s a title. Pick a mark.'),'820: the order table lines');
   await p.locator('[data-mf-hand]').click();await pick(p,'t7','italics');ok((await p.locator('#mf-crate-t7 .mf-said').innerText())==='A whole work leans over in italics.','820: Hand mode off draws italics again');await p.locator('[data-mf-hand]').click();
   eq((await book(p)).exchangeManifest.crate.t7.supported,true,'820: a later choice carries the line already seen');
   if(out)await p.locator('.mf-crate-bench').screenshot({path:`${out}/manifest-crate-${w}.png`});
   // Card 10: one step at a time, sets cardsSeen first.
   await p.locator('[data-mf-worked="card10"] > summary').click();await p.locator('#mf-steps-card10').waitFor();eq((await book(p)).exchangeManifest.cardsSeen,true,'820: card 10 sets cardsSeen before display');ok(await p.locator('#mf-steps-card10 em').count()===1,'820: card 10 step draws italics');
  }
  // Set D: D1 pending before its steps; answers and help keep Hand mode.
  await p.locator('[data-mf-set="D"] > summary').click();await p.locator('#mf-item-D1').waitFor();eq((await book(p)).exchangeManifest.items.D1,{supported:true,guided:true},`${w}: D1 pending before its steps`);
  ok(await p.locator('[data-mf-item="D1"] .mf-steps li').count()===3,`${w}: D1 guided steps`);
  await p.locator('[data-mf-choice="D1:b"]').click();await p.locator('#mf-feedback-D1').waitFor();ok((await p.locator('#mf-feedback-D1').innerText()).includes('Most school writing saves those for parts, like poems.'),`${w}: D1 feedback`);eq(await handOn(p),true,`${w}: Hand mode kept across an answer`);
  await p.locator('[data-mf-stuck="D2"]').click();ok((await p.locator('#mf-ladder-D2').innerText()).includes('Is a poem a whole book, or a part?'),`${w}: D2 ladder step 1`);eq(await handOn(p),true,`${w}: Hand mode kept across a help redraw`);
  ok(await p.locator('[data-mf-choice="D3:b"] em').count()===1,`${w}: D3 choices draw their italics`);
  if(full){
   await p.locator('[data-mf-stuck="D2"]').click();ok((await p.locator('#mf-ladder-D2').innerText()).includes('is it a whole book, or a part inside one?'),'820: title ladder step 2');await p.locator('[data-mf-stuck="D2"]').click();await p.locator('[data-mf-skip="D2"]').click();eq(await p.evaluate(()=>document.activeElement?.id),'mf-item-D3','820: skip moves to D3');
   await p.locator('[data-mf-choice="D2:c"]').click();await p.locator('[data-mf-choice="D3:b"]').click();await p.locator('#mf-feedback-D3').waitFor();ok(await p.locator('#mf-feedback-D3 .mf-chosen em').count()===1,'820: D3 saved choice keeps its italics');
   await p.locator('[data-mf-choice="D4:b"]').click();await p.locator('#mf-feedback-D4').waitFor();ok((await p.locator('#mf-feedback-D4').innerText()).includes('Slanted handwriting is hard to spot.'),'820: D4 feedback');
   eq(Object.keys((await book(p)).exchangeManifest.items).filter(k=>k[0]==='D').sort(),['D1','D2','D3','D4'],'820: D1 to D4 saved');
   if(out)await p.locator('[data-mf-set="D"]').screenshot({path:`${out}/manifest-set-d-${w}.png`});
  }
  ok(!(await overflow(p)),`${w}: no horizontal overflow with the crate and Set D open`);eq(await small(p),[],`${w}: 44 px controls with the crate`);
  await p.addStyleTag({content:'html{font-size:150%}'});ok(!(await overflow(p)),`${w}: 150% root font has no overflow`);
  if(out)await p.screenshot({path:`${out}/manifest-crate-page-${w}.png`,fullPage:true});
  // A new visit: Hand mode is off again and committed rows show their saved text.
  saved=(await book(p)).exchangeManifest;await p.reload();await p.locator('[data-mf-root]').waitFor();eq(await handOn(p),false,`${w}: Hand mode off after reload`);ok(await p.locator('#mf-crate-t3 .mf-underline').count()===1,`${w}: saved underline shown after reload`);eq((await book(p)).exchangeManifest,saved,`${w}: reload writes nothing`);
  if(full){
   // Real Notes download, import as a new explorer and reload.
   await p.goto(url+'#notes');const sec=p.locator('details:has-text("Market list marks")');await sec.locator('summary').click();ok(await sec.locator('h4:has-text("The book crate")').count()===1,'820: Notes subheading for the crate');ok((await sec.innerText()).includes('By hand: yes'),'820: Notes hand flag');
   const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#download').click()]);const text=(await import('node:fs')).readFileSync(await dl.path(),'utf8');eq(JSON.parse(text).exchangeManifest,saved,'820: Notes download keeps crate and D items');
   await p.locator('#progress-file').setInputFiles({name:'manifest.json',mimeType:'application/json',buffer:Buffer.from(text)});await p.locator('#progress-import-confirm').click();
   await p.goto(url+'#post/manifest');await p.locator('[data-mf-root]').waitFor();const imported=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);await p.reload();await p.locator(`[data-select-explorer="${imported}"]`).click();await p.locator('[data-mf-root]').waitFor();
   eq((await book(p)).exchangeManifest,saved,'820: imported explorer reopens with the crate');ok(await p.locator('#mf-crate-t3 .mf-underline').count()===1,'820: imported underline shows');
  }
  ok(p.errors.length===0,`${w}: no page errors (${p.errors.join('; ')})`);await c.close();
 }
 // Saving off keeps crate choices in-session; a stale crate tile writes to no explorer.
 {const {c,p}=await fresh(320,600);await p.goto(url+'#notes');await p.locator('#remember').uncheck();const storage=await p.evaluate(()=>({...localStorage}));
  await p.goto(url+'#post/manifest');await p.locator('[data-mf-root]').waitFor();await pick(p,'t8','quotes');ok(await p.locator('#mf-crate-t8').count()===1,'saving off: crate choice works');
  await p.goto(url+'#notes');const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#download').click()]);const data=JSON.parse((await import('node:fs')).readFileSync(await dl.path(),'utf8'));eq(data.exchangeManifest.crate.t8.outcome,'fits','saving off: crate retained in session');eq(await p.evaluate(()=>({...localStorage})),storage,'saving off: crate writes nothing to storage');await c.close();}
 {const {c,p}=await fresh(820,1000);const stale=await p.evaluateHandle(()=>document.querySelector('[data-mf-title="t1:italics"]'));const hand=await p.evaluateHandle(()=>document.querySelector('[data-mf-hand]'));
  await p.locator('#explorer-switch').click();await p.locator('#explorer-new').click();await p.locator('#explorer-create').click();await p.locator('[data-mf-root]').waitFor();
  const mid=await p.evaluate(()=>JSON.stringify({...localStorage}));await stale.evaluate(b=>b.click());await hand.evaluate(b=>b.click());eq(await p.evaluate(()=>JSON.stringify({...localStorage})),mid,'stale crate tile writes to no explorer');eq(await handOn(p),false,'stale toggle changes nothing; a new explorer starts with Hand mode off');await c.close();}
 // A malformed crate beside readable work: crate rows read-only, the rest usable, the raw crate kept.
 {const seed=freshState();seed.exchangeManifest={v:1,cardsSeen:false,lists:{},items:{},crate:['opaque']};const c=await browser.newContext({viewport:{width:820,height:1000}});await c.addInitScript(s=>{if(!localStorage.getItem('learning-garden-explorers'))localStorage.setItem('number-garden-v1',JSON.stringify(s));},seed);const p=await c.newPage();await p.goto(url+'#post/manifest');await p.locator('[data-mf-root="open"]').waitFor();
  ok(await p.locator('[data-mf-title]').count()===0&&await p.locator('[data-mf-hand]').count()===0,'malformed crate: rows read-only');await place(p,'m4','s1','empty');await p.locator('[data-mf-load="m4"]').click();await p.locator('#mf-result-m4').waitFor();
  const b=(await book(p)).exchangeManifest;eq(b.crate,['opaque'],'malformed crate kept exactly after a list write');eq(b.lists.m4.load,'fits','lists stay usable');await c.close();}
}finally{await browser.close();}
console.log(`Exchange Manifest browser checks: ${n} assertions passed.`);
