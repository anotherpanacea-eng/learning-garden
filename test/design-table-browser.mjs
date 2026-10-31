// Spec 334 browser journeys in Chromium: both stations by tap and keyboard, every check kind, the ladder to Skip, reload, Notes transfer, reset, explorers, stale controls and a forced preflight refusal.
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
const url=process.env.DESIGN_TABLE_TEST_URL;if(!url)throw new Error('Serve dist locally and set DESIGN_TABLE_TEST_URL.');
const out=process.env.DESIGN_TABLE_ARTIFACTS;if(out)mkdirSync(out,{recursive:true});
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const registry=ids=>({version:1,activeId:ids[0],explorers:ids.map(id=>({id,avatar:'sky',color:'blue',symbol:'leaf',createdAt:'2026-10-31T12:00:00.000Z'}))});
const book=(p,id)=>p.evaluate(id=>{const a=id||JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+a)||'{}');},id);
const dt=p=>book(p).then(b=>b.designTable);
const A=(p,a,extra='')=>p.locator(`[data-dt-action="${a}"]${extra}`).first();
const focused=(p,sel)=>p.locator(sel).first().evaluate(e=>e===document.activeElement);
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
const small=p=>p.$$eval('.dt-room button,.dt-room summary,.dt-room a,.dt-room input',xs=>xs.filter(x=>x.offsetParent).filter(x=>{const r=x.getBoundingClientRect();return r.width<43.5||r.height<43.5;}).map(x=>x.outerHTML.slice(0,80)));
const T4=[['keeps-dry','satchel-strength'],['holds-6','satchel-weakness'],['holds-10','basket-strength'],['lets-rain','basket-weakness']];
async function open(width,height,seeds={'explorer-1':initializeExplorerState(freshState())}){
 const c=await browser.newContext({viewport:{width,height},acceptDownloads:true,reducedMotion:'reduce'});
 await c.addInitScript(d=>{if(!localStorage.getItem('dt-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const [id,s] of Object.entries(d.seeds))localStorage.setItem('number-garden-v1:'+id,JSON.stringify(s));localStorage.setItem('dt-fixture','1');}},{registry:registry(Object.keys(seeds)),seeds});
 await c.route('**/app.mjs',async route=>{const r=await route.fetch();let body=await r.text();const start=body.indexOf('bindDesignTable(state,{');assert.ok(start>0);body=body.slice(0,start)+body.slice(start).replace('canExport:candidate=>','canExport:candidate=>!window.dtRefuse&&');await route.fulfill({response:r,body});});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;await p.goto(url+'#workshop/design');await p.locator('[data-design-table-root],[data-select-explorer]').first().waitFor();
 if(await p.locator('[data-design-table-root]').count()===0)await p.locator(`[data-select-explorer="${Object.keys(seeds)[0]}"]`).click();await p.locator('[data-design-table-root]').waitFor();return {c,p};
}
const station=async(p,st)=>{if(await A(p,'station',`[data-dt-station="${st}"][aria-pressed="true"]`).count()===0)await A(p,'station',`[data-dt-station="${st}"]`).click();};
const place=async(p,item,opt,slot)=>{await A(p,'pick',`[data-dt-item="${item}"][data-dt-opt="${opt}"]`).click();await A(p,'place',`[data-dt-item="${item}"][data-dt-slot="${slot}"]`).click();};
const model=p=>p.locator('.dt-station > .dt-label').first().innerText();
try{
 for(const [w,h] of [[320,600],[820,1000],[1024,768]]){
  const {c,p}=await open(w,h);
  ok((await p.locator('.dt-arrival').innerText()).includes('A long table covered in brown paper.'),`${w}: first visit`);ok(!(await p.locator('.dt-arrival').innerText()).includes('{guide}'),`${w}: guide named`);
  eq(await p.locator('.dt-entry').allInnerTexts().then(x=>x.map(s=>s.replace(/\s+/g,' ').trim())),['Two bags, one test 0 of 8 tried','Write the brief 0 of 4 tried'],`${w}: station entries`);
  // Station 2: teach card one step per keypress, never gating play.
  await A(p,'station','[data-dt-station="bags"]').focus();await p.keyboard.press('Enter');ok(await focused(p,'#dt-station'),`${w}: station focus`);eq(await model(p),'A made-up model',`${w}: station 2 label`);
  ok(await p.locator('.dt-teach').isVisible(),`${w}: teach card`);await A(p,'show-me').focus();await p.keyboard.press('Enter');await p.keyboard.press('Enter');eq(await p.locator('.dt-steps li').count(),2,`${w}: two worked steps`);
  ok(await A(p,'choose','[data-dt-item="bags-guided"]').isVisible(),`${w}: play is open before Start`);ok(!Object.hasOwn(await book(p),'designTable'),`${w}: teaching makes no write`);
  await A(p,'start').click();eq((await dt(p)).taught,{bags:true,brief:false},`${w}: Start records taught`);ok(await A(p,'reopen').isVisible(),`${w}: What is this station for?`);
  // The rain test: one try per tap, each announced, then totals.
  await A(p,'rain').focus();for(let i=1;i<=3;i++){await p.keyboard.press('Enter');eq(await p.locator('.dt-rain tbody tr').count(),i,`${w}: try ${i}`);ok((await p.locator('.dt-announce').innerText()).startsWith(`Try ${i}.`),`${w}: try ${i} announced`);}
  eq(await p.locator('#dt-rain-done').innerText(),'All three tries are done.',`${w}: done line`);await A(p,'totals').click();ok((await p.locator('.dt-total').innerText()).includes('1 of 30'),`${w}: totals`);ok((await p.locator('#dt-carry').innerText()).includes('basket holds 10'),`${w}: carry`);
  const before=await dt(p);ok(JSON.stringify(before.items)==='{}',`${w}: reveals make no write`);
  ok(await p.locator('.dt-rain table caption').count(),`${w}: a real table with caption`);
  // Guided, tags wrong then right, frame mismatch then right, improve, side door.
  await A(p,'choose','[data-dt-item="bags-guided"][data-dt-choice="basket"]').click();eq(await p.locator('#dt-line-bags-guided').innerText(),'Look at the totals. Which bag has fewer damp letters?',`${w}: guided wrong`);ok(await focused(p,'#dt-line-bags-guided'),`${w}: line focus`);
  await A(p,'choose','[data-dt-item="bags-guided"][data-dt-choice="satchel"]').click();eq(await p.locator('#dt-line-bags-guided').innerText(),'Yes. Fewer damp letters means drier.',`${w}: guided right`);
  await A(p,'pick','[data-dt-item="bags-tags"][data-dt-opt="best"]').click();ok((await A(p,'pick','[data-dt-item="bags-tags"][data-dt-opt="best"]').innerText()).includes('picked up'),`${w}: picked-up marker`);
  await A(p,'place','[data-dt-item="bags-tags"][data-dt-slot="satchel-strength"]').click();ok(await focused(p,'[data-dt-action="unplace"][data-dt-opt="best"]'),`${w}: placement keeps focus on the tile`);
  eq(await A(p,'unplace','[data-dt-opt="best"]').getAttribute('aria-label'),'best at everything, in Satchel: strength',`${w}: placed name`);
  await A(p,'check','[data-dt-item="bags-tags"]').click();eq(await p.locator('#dt-line-bags-tags').innerText(),'Check the carry test. Does one bag win both?',`${w}: single winner`);
  await A(p,'unplace','[data-dt-opt="best"]').click();for(const [t,s] of T4)await place(p,'bags-tags',t,s);await A(p,'check','[data-dt-item="bags-tags"]').click();eq(await p.locator('#dt-line-bags-tags').innerText(),'Yes. Each bag is better at something.',`${w}: tags right`);
  await A(p,'chip','[data-dt-opt="dry"]').click();await A(p,'chip','[data-dt-opt="parcels"]').click();await A(p,'check','[data-dt-item="bags-frame"]').click();eq(await p.locator('#dt-line-bags-frame').innerText(),'Does that number show it? Look at the table.',`${w}: frame mismatch`);
  await A(p,'chip','[data-dt-opt="damp"]').click();await A(p,'check','[data-dt-item="bags-frame"]').click();eq(await p.locator('#dt-line-bags-frame').innerText(),'Better for dry letters because the data showed 1 damp, not 9.',`${w}: frame read back`);
  await A(p,'choose','[data-dt-item="bags-improve"][data-dt-choice="line"]').click();await A(p,'choose','[data-dt-item="bags-unfair"][data-dt-choice="yes"]').click();eq(await p.locator('#dt-line-bags-unfair').innerText(),'Look again. Did both bags get the same water?',`${w}: side door`);
  // A5: disabled while empty, the whole-number line writes nothing, a tagged wrong, then right with steps.
  ok(await p.locator('[data-dt-action="check-number"]').isDisabled(),`${w}: Check disabled while empty`);await p.fill('#dt-entry-a5','8.5');const b5=await dt(p);await p.locator('#dt-entry-a5').press('Enter');
  eq(await p.locator('#dt-line-a5').innerText(),'Type a whole number from 0 to 99.',`${w}: whole-number line`);eq(await dt(p),b5,`${w}: an invalid entry writes nothing`);
  await p.fill('#dt-entry-a5','9');await A(p,'check-number').click();eq(await p.locator('#dt-line-a5').innerText(),"That's the basket's total. Take away the satchel's.",`${w}: tagged wrong`);eq(await p.locator('[data-dt-item-root="a5"] .dt-why').count(),0,`${w}: no explanation before right`);
  await p.fill('#dt-entry-a5','8');await A(p,'check-number').click();ok((await p.locator('[data-dt-item-root="a5"] .dt-why').innerText()).includes('9 − 1 = 8'),`${w}: steps after right`);eq((await dt(p)).items.a5.latest.entry,8,`${w}: the whole number kept`);
  // The ladder on A6: rungs write support first; Skip writes nothing.
  await A(p,'choose','[data-dt-item="a6"][data-dt-choice="worse"]').click();await A(p,'rung','[data-dt-item="a6"]').click();ok(await focused(p,'#dt-hint-a6'),`${w}: hint`);eq((await dt(p)).items.a6.support,'hint',`${w}: support written`);
  await A(p,'rung','[data-dt-item="a6"]').click();eq((await dt(p)).items.a6.support,'example',`${w}: example`);const keep=await dt(p);await A(p,'skip','[data-dt-item="a6"]').click();eq(await dt(p),keep,`${w}: Skip writes nothing`);eq((await dt(p)).items.a6.tries,1,`${w}: kept tries`);
  eq(await A(p,'rung','[data-dt-item="bags-guided"]').count(),0,`${w}: guided items have no ladder`);
  ok(!(await overflow(p)),`${w}: no overflow on station 2`);eq(await small(p),[],`${w}: 44 px on station 2`);
  if(out)await p.screenshot({path:`${out}/bags-${w}.png`,fullPage:true});
  // Station 3: brief with a vague tile, a swap, the solution, then right.
  await station(p,'brief');eq(await model(p),'A made-up model',`${w}: station 3 label`);await A(p,'start').click();
  await A(p,'flip','[data-dt-opt="nice"]').click();ok(await A(p,'pick','[data-dt-opt="nice"]').isDisabled(),`${w}: Nice stays unplaceable`);ok((await p.locator('.dt-nice').innerText()).includes('Nice for whom?'),`${w}: Nice line`);ok(!Object.hasOwn((await dt(p)).briefs,'ways-crate'),`${w}: pre-check flip is view state`);
  await place(p,'brief','need','need');await place(p,'brief','courier','who');await place(p,'brief','strong','musts');await A(p,'check-brief').click();
  eq(await p.locator('#dt-line-brief').innerText(),'"Really strong" → "Carries 6 jars through the bump test"',`${w}: vague line`);ok(await A(p,'pick','[data-dt-opt="strong"]').isVisible(),`${w}: the vague tile returns`);ok((await A(p,'pick','[data-dt-opt="strong"]').innerText()).includes('Carries 6 jars'),`${w}: on its flipped side`);
  eq((await dt(p)).briefs['ways-crate'].first.placed.map(e=>e.item.id),['need','courier','strong'],`${w}: the board as submitted`);
  await place(p,'brief','strong','limits');await A(p,'check-brief').click();eq(await p.locator('#dt-line-brief').innerText(),'Does this say what the crate does, or what limits you?',`${w}: swap`);
  await A(p,'unplace','[data-dt-opt="strong"]').click();await place(p,'brief','oak','musts');await A(p,'check-brief').click();eq(await p.locator('#dt-line-brief').innerText(),'Maybe. First, what must any answer do?',`${w}: solution tile`);
  await A(p,'unplace','[data-dt-opt="oak"]').click();await A(p,'flip','[data-dt-opt="heavy"]').click();for(const [t,s] of [['strong','musts'],['keeps-dry','musts'],['heavy','musts'],['shed','limits'],['coins','limits'],['days','limits']])await place(p,'brief',t,s);
  if(w===820){await p.locator('.dt-board').evaluate(e=>e.scrollIntoView({block:'start'}));const top=(await p.locator('.dt-board').boundingBox()).y,bottom=await p.locator('.dt-brief > .dt-tray').evaluate(e=>e.getBoundingClientRect().bottom);ok(bottom-top<=h,'820: slots and tray visible together');}
  await A(p,'check-brief').click();ok(await focused(p,'#dt-brief-card'),`${w}: brief card focus`);ok((await p.locator('#dt-brief-card').innerText()).includes('keeps 12 letters dry in the rain test · carries 6 jars through the bump test · weighs 5 kg or less, empty'),`${w}: brief card`);
  ok((await p.locator('.dt-brief .dt-mary').innerText()).includes('Mary Anderson'),`${w}: Mary Anderson after the brief`);
  await A(p,'choose','[data-dt-item="brief-guided"][data-dt-choice="limit"]').click();await A(p,'choose','[data-dt-item="a8"][data-dt-choice="jars"]').click();ok((await p.locator('[data-dt-item-root="a8"] .dt-why').innerText()).includes('A checkable must'),`${w}: A8 explanation`);
  await place(p,'a7','jars','musts');await A(p,'check','[data-dt-item="a7"]').click();eq(await p.locator('#dt-line-a7').innerText(),'Sort every card first. Which one is left?',`${w}: A7 unsorted`);
  for(const [t,s] of [['coins','limits'],['dry','musts'],['shed','limits']])await place(p,'a7',t,s);await A(p,'check','[data-dt-item="a7"]').click();eq(await p.locator('#dt-line-a7').innerText(),'Yes. Two musts and two limits.',`${w}: A7 right`);
  ok(!(await overflow(p)),`${w}: no overflow on station 3`);eq(await small(p),[],`${w}: 44 px on station 3`);
  if(out)await p.screenshot({path:`${out}/brief-${w}.png`,fullPage:true});
  // Reload keeps kept work.
  await p.reload();await p.locator('[data-design-table-root]').waitFor();ok((await p.locator('.dt-arrival').innerText()).includes('New sketches on the paper.'),`${w}: later visit`);
  eq(await p.locator('.dt-entry').allInnerTexts().then(x=>x.map(s=>s.replace(/\s+/g,' ').trim())),['Two bags, one test 7 of 8 tried','Write the brief 4 of 4 tried'],`${w}: progress after reload`);
  await station(p,'brief');ok((await p.locator('#dt-brief-card').innerText()).includes('the courier, walking.'),`${w}: brief after reload`);await station(p,'bags');ok(await p.locator('[data-dt-action="choose"][data-dt-item="bags-guided"][data-dt-choice="satchel"][aria-pressed="true"]').count(),`${w}: kept choice`);
  ok(await p.locator('[data-dt-action="unplace"][data-dt-item="bags-tags"][data-dt-opt="keeps-dry"]').count(),`${w}: kept tags`);eq(p.errors,[],`${w}: no page errors`);await c.close();
 }
 // Forced preflight refusal: answer, rung and Start.
 {const {c,p}=await open(820,1000);await station(p,'bags');await p.evaluate(()=>{window.dtRefuse=true;});const before=await book(p);
  await A(p,'start').click();eq(await book(p),before,'refused Start writes nothing');ok((await p.locator('#dt-status').innerText()).startsWith("There isn't room"),'capacity line');
  await A(p,'choose','[data-dt-item="a4"][data-dt-choice="satchel"]').click();eq(await book(p),before,'refused answer writes nothing');
  await A(p,'rung','[data-dt-item="a4"]').click();eq(await book(p),before,'refused rung writes nothing');eq(await p.locator('#dt-hint-a4').count(),0,'the rung stays closed');
  await p.evaluate(()=>{window.dtRefuse=false;});await A(p,'choose','[data-dt-item="a4"][data-dt-choice="satchel"]').click();eq((await dt(p)).items.a4.tries,1,'allowed once room returns');eq(p.errors,[],'no errors');await c.close();}
 // Read-only drift and an unknown version.
 {const s=initializeExplorerState(freshState());const {c:c0,p:p0}=await open(820,1000);await station(p0,'bags');await A(p0,'choose','[data-dt-item="a4"][data-dt-choice="baker"]').click();const seed=await book(p0);await c0.close();
  seed.designTable.items.a4.rev='r0';seed.designTable.items.a4.prompt='An older question?';
  const {c,p}=await open(820,1000,{'explorer-1':seed});await station(p,'bags');const before=await book(p);ok((await p.locator('[data-dt-item-root="a4"]').innerText()).includes('An older question?'),'kept prompt');eq(await A(p,'choose','[data-dt-item="a4"]').count(),0,'read-only');eq(await book(p),before,'kept exact');await c.close();}
 {const s=initializeExplorerState(freshState());s.designTable={v:9,later:[1]};const {c,p}=await open(820,1000,{'explorer-1':s});ok((await p.locator('aside.dt-notice').innerText()).includes('uses a format this version cannot read'),'unknown version line');eq(await p.locator('aside.dt-notice a[href="#notes"]').count(),1,'Notes link');eq(await A(p,'station').count(),0,'no stations');eq((await book(p)).designTable,{v:9,later:[1]},'raw');await c.close();}
 // Notes download and import, reset, two explorers, stale controls, the Workshop link.
 {const {c,p}=await open(820,1000,{'explorer-1':initializeExplorerState(freshState()),'explorer-2':initializeExplorerState(freshState())});await station(p,'bags');await A(p,'choose','[data-dt-item="a4"][data-dt-choice="satchel"]').click();const held=(await book(p)).designTable;
  ok(!Object.hasOwn(await book(p,'explorer-2'),'designTable'),'other explorer untouched');
  await p.goto(url+'#notes');ok((await p.locator('[data-design-table-notes]').textContent()).includes('Design Table: Two bags, 1 of 8 tried'),'Notes line');
  const dl=p.waitForEvent('download');await p.locator('#download').click();const text=readFileSync(await (await dl).path(),'utf8');eq(JSON.parse(text).designTable,held,'download carries the root');
  await p.locator('#reset').click();await p.locator('#confirm-reset').click();await p.goto(url+'#notes');await p.locator('#progress-file').waitFor({state:'attached'});ok(!Object.hasOwn(await book(p),'designTable'),'reset clears this explorer');
  await p.locator('#progress-file').setInputFiles({name:'design.json',mimeType:'application/json',buffer:Buffer.from(text)});const skip=p.locator('dialog.welcome-film[open] [data-film-skip]');if(await skip.count())await skip.click();await p.locator('#progress-import-confirm').click();
  const id=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);eq((await book(p,id)).designTable,held,'import restores the root');await c.close();
  const {c:c2,p:p2}=await open(820,1000);await station(p2,'bags');const stale=await p2.evaluateHandle(()=>document.querySelector('[data-dt-action="choose"][data-dt-item="a4"]'));await p2.goto(url+'#workshop');await p2.goto(url+'#workshop/design');await p2.locator('[data-design-table-root]').waitFor();
  const beforeStale=await book(p2);await stale.evaluate(b=>b.click());eq(await book(p2),beforeStale,'detached control writes nothing');
  await p2.goto(url+'#workshop');eq(await p2.locator('a[href="#workshop/design"]').first().innerText(),'The Design Table','Workshop link');await c2.close();}
}finally{await browser.close();}
console.log(`Design Table Chrome: ${n} assertions passed at 320/820/1024, with reduced motion.`);
