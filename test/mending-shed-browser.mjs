// Spec 332 browser journeys in Chromium: tap and keyboard sorting, the Shape Bench, the stuck ladder, reload, Notes transfer, reset, explorers, stale controls and a forced preflight refusal.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
import * as M from '../dist/mending-shed-core.mjs';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
const url=process.env.MENDING_TEST_URL;if(!url)throw new Error('Serve dist locally and set MENDING_TEST_URL.');
const out=process.env.MENDING_ARTIFACTS;if(out)mkdirSync(out,{recursive:true});
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const registry=ids=>({version:1,activeId:ids[0],explorers:ids.map(id=>({id,avatar:'sky',color:'blue',symbol:'leaf',createdAt:'2026-10-31T12:00:00.000Z'}))});
const book=(p,id)=>p.evaluate(id=>{const a=id||JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+a)||'{}');},id);
const act=(p,a,extra='')=>p.locator(`[data-ms-action="${a}"]${extra}`).first();
const focused=(p,sel)=>p.locator(sel).first().evaluate(e=>e===document.activeElement);
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
const small=p=>p.$$eval('.ms-shed button,.ms-shed summary,.ms-shed a',xs=>xs.filter(x=>x.offsetParent).filter(x=>{const r=x.getBoundingClientRect();return r.width<43.5||r.height<43.5;}).map(x=>x.outerHTML.slice(0,80)));
async function open(width,height,seeds={'explorer-1':initializeExplorerState(freshState())}){
 const c=await browser.newContext({viewport:{width,height},acceptDownloads:true,reducedMotion:'reduce'});
 await c.addInitScript(d=>{if(!localStorage.getItem('ms-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const [id,s] of Object.entries(d.seeds))localStorage.setItem('number-garden-v1:'+id,JSON.stringify(s));localStorage.setItem('ms-fixture','1');}},{registry:registry(Object.keys(seeds)),seeds});
 await c.route('**/app.mjs',async route=>{const r=await route.fetch();let body=await r.text();const start=body.indexOf('bindMendingShed(state,{');assert.ok(start>0);body=body.slice(0,start)+body.slice(start).replace('canExport:candidate=>','canExport:candidate=>!window.msRefuse&&');await route.fulfill({response:r,body});});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;await p.goto(url+'#workshop/mending');await p.locator('[data-mending-shed-root],[data-select-explorer]').first().waitFor();if(await p.locator('[data-mending-shed-root]').count()===0)await p.locator(`[data-select-explorer="${Object.keys(seeds)[0]}"]`).click();await p.locator('[data-mending-shed-root]').waitFor();return {c,p};
}
async function place(p,chip,row){await act(p,'chip',`[data-ms-chip="${chip}"]`).click();await act(p,'place',`[data-ms-row="${row}"]`).click();}
try{
 for(const [w,h] of [[320,600],[820,1000],[1024,768]]){
  const {c,p}=await open(w,h);
  ok(!Object.hasOwn(await book(p),'mendingShed'),`${w}: rendering writes nothing`);
  ok((await p.locator('.ms-simplified').innerText()).startsWith('These are simplified pictures.'),`${w}: always-shown line`);
  ok((await p.locator('.ms-arrival').innerText()).includes("Hob's barn smells of hay"),`${w}: first visit`);
  ok(!(await overflow(p)),`${w}: no horizontal overflow on arrival`);eq(await small(p),[],`${w}: 44 px controls on arrival`);
  // Teach card: Show me one step per tap, no write until Start.
  await act(p,'bench','[data-ms-bench="pile"]').click();await act(p,'show-me').click();await act(p,'show-me').click();eq(await p.locator('.ms-teach li').count(),2,`${w}: worked example one step per tap`);
  ok(!Object.hasOwn(await book(p),'mendingShed'),`${w}: teach card makes no write`);await act(p,'start').click();eq((await book(p)).mendingShed.taught,{pile:true,shapes:false},`${w}: Start records taught`);
  // Guided bucket by keyboard: Enter on the chip, then on the row.
  ok((await p.locator('.ms-guided').innerText()).includes('What is it?'),`${w}: guided steps on the metal bucket`);
  await act(p,'chip','[data-ms-chip="bucket"]').focus();await p.keyboard.press('Enter');ok((await act(p,'chip','[data-ms-chip="bucket"]').innerText()).includes('picked up'),`${w}: picked-up marker`);
  await act(p,'place','[data-ms-row="object"]').focus();await p.keyboard.press('Enter');ok(await focused(p,'[data-ms-action="lift"][data-ms-chip="bucket"]'),`${w}: placement returns focus to the placed chip`);
  eq(await act(p,'lift','[data-ms-chip="bucket"]').getAttribute('aria-label'),'bucket, in What is it?',`${w}: placed chip name`);
  ok(!Object.hasOwn(await book(p),'mendingShed')||!Object.hasOwn((await book(p)).mendingShed.pile??{},'metal-bucket'),`${w}: placing makes no write`);
  await place(p,'metal','materials');ok(!(await overflow(p)),`${w}: no overflow on the pile`);eq(await small(p),[],`${w}: 44 px controls on the pile`);
  if(w===820){await p.locator('.ms-current').evaluate(e=>e.scrollIntoView({block:'start'}));const box=await p.locator('.ms-current').boundingBox();ok(box.height<=h,'820: picture, rows and tray visible together');}
  await act(p,'check').click();eq(await p.locator('#ms-line').innerText(),"That's it: bucket, made of metal.",`${w}: right check`);ok(await focused(p,'#ms-line'),`${w}: check moves focus to the line`);eq(await p.locator('.ms-announce').innerText(),"That's it: bucket, made of metal.",`${w}: line announced`);
  // Wrong row, then a multi-material card.
  await act(p,'card','[data-ms-card="lantern"]').click();await place(p,'metal','object');await act(p,'check').click();eq(await p.locator('#ms-line').innerText(),"That's what it's made of. What is the thing called?",`${w}: material in the object row`);
  await act(p,'lift','[data-ms-chip="metal"]').click();await place(p,'lantern','object');await place(p,'metal','materials');await place(p,'glass','materials');ok((await p.locator('.ms-current').innerText()).includes('Choose them all.'),`${w}: multi-material note`);
  await act(p,'check').click();eq(await p.locator('#ms-line').innerText(),'Look again. Is there a part made of something else?',`${w}: missing material`);
  await place(p,'cotton','materials');await act(p,'check').click();eq(await p.locator('#ms-line').innerText(),"That's it: lantern, made of metal, glass and cotton.",`${w}: lantern right`);
  ok((await p.locator('.ms-board').innerText()).includes('lantern: lantern · metal, glass and cotton'),`${w}: board shows sortedCheck`);
  // Ladder on a sorted card, then Skip: support written first, Skip changes nothing.
  await act(p,'card','[data-ms-card="metal-bucket"]').click();await act(p,'rung','[data-ms-rung="1"]').click();ok(await focused(p,'#ms-rung-1'),`${w}: rung 1 focus`);ok((await book(p)).mendingShed.pile['metal-bucket'].supported,`${w}: rung writes support`);
  await act(p,'rung','[data-ms-rung="2"]').click();ok((await p.locator('#ms-rung-2').innerText()).includes('A metal spoon.'),`${w}: rung 2 example`);
  const beforeSkip=await book(p);await act(p,'skip').click();eq(await book(p),beforeSkip,`${w}: Skip leaves the record exactly as it was`);eq((await book(p)).mendingShed.pile['metal-bucket'].sortedCheck.line.id,'right',`${w}: sorted kept after Skip`);
  if(out)await p.screenshot({path:`${out}/pile-${w}.png`,fullPage:true});
  // Shape Bench: match, surprise, snap, willow note.
  await act(p,'bench','[data-ms-bench="shapes"]').click();await act(p,'start').click();
  const run=async(sample,action,predict)=>{await act(p,'sample',`[data-ms-id="${sample}"]`).click();await act(p,'action',`[data-ms-id="${action}"]`).click();ok(await act(p,'try').isDisabled(),`${w}: predict first`);await act(p,'predict',`[data-ms-id="${predict}"]`).click();await act(p,'try').click();ok(!Object.hasOwn((await book(p)).mendingShed.shapes??{},sample)||!Object.hasOwn((await book(p)).mendingShed.shapes[sample].actions,action),`${w}: Try it makes no write`);await act(p,'let-go').click();return p.locator('#ms-result').innerText();};
  eq(await run('rubber','stretch','springs'),"It springs back when you let go. Still rubber.\n\nYou predicted that. Now you've seen it.",`${w}: match`);
  ok(await focused(p,'#ms-result'),`${w}: Let go focuses the result`);ok((await p.locator('.ms-announce').innerText()).includes('Still rubber.'),`${w}: Let go announced`);
  eq(await run('clay','squash','springs'),'It keeps the new shape. Still clay.\n\nSurprise! Different materials answer differently.',`${w}: surprise`);
  eq((await run('slate','bend','keeps')).split('\n')[0],'Still slate. Now in two pieces.',`${w}: snap`);
  await act(p,'sample','[data-ms-id="willow-rod"]').click();ok((await p.locator('.ms-bench').innerText()).includes('Dry willow cracks.'),`${w}: willow note`);
  ok(!(await overflow(p)),`${w}: no overflow on the shape bench`);eq(await small(p),[],`${w}: 44 px controls on the shape bench`);
  ok(await p.locator('.ms-grid-wrap').evaluate(e=>getComputedStyle(e).overflowX==='auto'),`${w}: grid scrolls in its own box`);
  if(out)await p.screenshot({path:`${out}/shapes-${w}.png`,fullPage:true});
  // Reload: later-visit line, grid and board from the save.
  await p.reload();await p.locator('[data-mending-shed-root]').waitFor();ok((await p.locator('.ms-arrival').innerText()).includes('The heap is smaller.'),`${w}: later visit`);
  ok((await p.locator('.ms-entries').innerText()).includes('2 of 12 things sorted'),`${w}: pile progress`);ok((await p.locator('.ms-entries').innerText()).includes('3 of 24 shape tests tried'),`${w}: shape progress`);
  await act(p,'bench','[data-ms-bench="shapes"]').click();ok((await p.locator('.ms-grid').innerText()).includes('Springs back'),`${w}: grid after reload`);
  eq(p.errors,[],`${w}: no page errors`);await c.close();
 }
 // Forced preflight refusal: a check and a rung write nothing and show the capacity line; the rung stays closed.
 {const {c,p}=await open(820,1000);await act(p,'bench','[data-ms-bench="pile"]').click();await act(p,'start').click();const before=await book(p);await p.evaluate(()=>{window.msRefuse=true;});
  await place(p,'bucket','object');await place(p,'metal','materials');await act(p,'check').click();eq(await book(p),before,'refused check writes nothing');ok((await p.locator('#ms-status').innerText()).startsWith("There isn't room to save this change yet."),'capacity line');
  await act(p,'rung','[data-ms-rung="1"]').click();eq(await p.locator('#ms-rung-1').count(),0,'refused rung stays closed');eq(await book(p),before,'refused rung writes nothing');
  await p.evaluate(()=>{window.msRefuse=false;});await act(p,'check').click();eq((await book(p)).mendingShed.pile['metal-bucket'].checks,1,'the same work checks once allowed');await c.close();}
 // Drift and unreadable records render from kept labels; an unknown version is read-only with a Notes link.
 {const s=initializeExplorerState(freshState()),o={canExport:()=>true};M.checkMendingCard(s,'lantern',{object:'lantern',materials:['metal','glass','cotton']},o);const l=s.mendingShed.pile.lantern;l.tray=l.tray.filter(x=>x.id!=='cotton').map(x=>({...x,label:'old '+x.label}));for(const k of ['first','latest','sortedCheck']){l[k].materials=l[k].materials.filter(x=>x.id!=='cotton').map(x=>({...x,label:'old '+x.label}));l[k].object.label='old lantern';}l.card='old lantern';
  M.checkMendingCard(s,'spoon',{object:'spoon',materials:['wood']},o);s.mendingShed.pile.spoon.checks=0;s.mendingShed.later={kept:true};
  const {c,p}=await open(820,1000,{'explorer-1':s});const before=await book(p);await act(p,'bench','[data-ms-bench="pile"]').click();await act(p,'card','[data-ms-card="lantern"]').click();
  ok((await p.locator('.ms-current').innerText()).includes('old metal and old glass'),'drifted card renders kept labels');eq(await act(p,'check').count(),0,'drifted card is read-only');
  await act(p,'card','[data-ms-card="spoon"]').click();ok((await p.locator('.ms-current').innerText()).includes("This one can't be shown here."),'unreadable card line');
  await act(p,'card','[data-ms-card="basket"]').click();await place(p,'basket','object');await place(p,'willow','materials');await act(p,'check').click();const after=await book(p);eq(after.mendingShed.pile.spoon,before.mendingShed.pile.spoon,'unreadable kept raw');eq(after.mendingShed.later,{kept:true},'unknown sibling kept');eq(after.mendingShed.pile.lantern,before.mendingShed.pile.lantern,'drifted card kept');eq(p.errors,[],'drift renders without errors');await c.close();}
 {const s=initializeExplorerState(freshState());s.mendingShed={v:7,later:[1]};const {c,p}=await open(820,1000,{'explorer-1':s});ok((await p.locator('aside.ms-notice').innerText()).includes('uses a format this version cannot read'),'unknown version line');eq(await p.locator('aside.ms-notice a[href="#notes"]').count(),1,'Notes link');
  ok(await act(p,'bench','[data-ms-bench="pile"]').isDisabled(),'unknown version benches read-only');eq(await act(p,'check').count(),0,'unknown version has no Check');eq(p.errors,[],'unknown version renders without errors');eq((await book(p)).mendingShed,{v:7,later:[1]},'unknown version raw');await c.close();}
 // Notes download and import, reset, two explorers and a stale control.
 {const {c,p}=await open(820,1000,{'explorer-1':initializeExplorerState(freshState()),'explorer-2':initializeExplorerState(freshState())});await act(p,'bench','[data-ms-bench="pile"]').click();await act(p,'start').click();await place(p,'bucket','object');await place(p,'metal','materials');await act(p,'check').click();const held=(await book(p)).mendingShed;
  ok(!Object.hasOwn(await book(p,'explorer-2'),'mendingShed'),'other explorer untouched');
  await p.goto(url+'#notes');ok((await p.locator('[data-mending-shed-notes]').textContent()).includes('Mending Shed: 1 of 12 things sorted'),'Notes line');
  const dl=p.waitForEvent('download');await p.locator('#download').click();const file=await (await dl).path();const text=(await import('node:fs')).readFileSync(file,'utf8');eq(JSON.parse(text).mendingShed,held,'download carries the root');
  await p.locator('#reset').click();await p.locator('#confirm-reset').click();await p.goto(url+'#notes');await p.locator('#progress-file').waitFor({state:'attached'});ok(!Object.hasOwn(await book(p),'mendingShed'),'reset clears this explorer');
  await p.locator('#progress-file').setInputFiles({name:'mending.json',mimeType:'application/json',buffer:Buffer.from(text)});const skip=p.locator('dialog.welcome-film[open] [data-film-skip]');if(await skip.count())await skip.click();await p.locator('#progress-import-confirm').click();
  await p.goto(url+'#workshop/mending');const id=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);eq((await book(p,id)).mendingShed,held,'import restores the root');
  await p.goto(url+'#workshop/mending');await p.locator('[data-mending-shed-root]').waitFor().catch(()=>{});
  const {c:c2,p:p2}=await open(820,1000);await act(p2,'bench','[data-ms-bench="pile"]').click();await act(p2,'start').click();await place(p2,'bucket','object');const stale=await p2.evaluateHandle(()=>document.querySelector('[data-ms-action="check"]'));await p2.goto(url+'#workshop');await p2.goto(url+'#workshop/mending');await p2.locator('[data-mending-shed-root]').waitFor();
  const beforeStale=await book(p2);await stale.evaluate(b=>b.click());eq(await book(p2),beforeStale,'detached control writes nothing');await c2.close();await c.close();}
}finally{await browser.close();}
console.log(`Mending Shed Chrome: ${n} assertions passed at 320/820/1024, with reduced motion.`);
