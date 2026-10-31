// Spec 333 browser journeys in Chromium: teaching, sorting, marks in grid and list mode, Can we tell yet?, round 2, every check outcome, the reveal, reload, Notes transfer, reset, explorers, stale controls, extensions and a forced preflight refusal.
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
import * as C from '../dist/lost-found-core.mjs';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
const url=process.env.LOST_FOUND_TEST_URL;if(!url)throw new Error('Serve dist locally and set LOST_FOUND_TEST_URL.');
const out=process.env.LOST_FOUND_ARTIFACTS;if(out)mkdirSync(out,{recursive:true});
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const registry=ids=>({version:1,activeId:ids[0],explorers:ids.map(id=>({id,avatar:'sky',color:'blue',symbol:'leaf',createdAt:'2026-10-31T12:00:00.000Z'}))});
const book=(p,id)=>p.evaluate(id=>{const a=id||JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+a)||'{}');},id);
const act=(p,a,extra='')=>p.locator(`[data-lf-action="${a}"]${extra}`).first();
const focused=(p,sel)=>p.locator(sel).first().evaluate(e=>e===document.activeElement);
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
const small=p=>p.$$eval('.lf-board button,.lf-board summary,.lf-board a,.lf-board select',xs=>xs.filter(x=>x.offsetParent).filter(x=>{const r=x.getBoundingClientRect();return r.width<43.5||r.height<43.5;}).map(x=>x.outerHTML.slice(0,80)));
const SORT={'miller-roof':'saw','miller-wind':'think','dot-bridge':'saw','pip-orchard':'saw','pip-ladder':'think'};
async function open(width,height,seeds={'explorer-1':initializeExplorerState(freshState())}){
 const c=await browser.newContext({viewport:{width,height},acceptDownloads:true,reducedMotion:'reduce'});
 await c.addInitScript(d=>{if(!localStorage.getItem('lf-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const [id,s] of Object.entries(d.seeds))localStorage.setItem('number-garden-v1:'+id,JSON.stringify(s));localStorage.setItem('lf-fixture','1');}},{registry:registry(Object.keys(seeds)),seeds});
 await c.route('**/app.mjs',async route=>{const r=await route.fetch();let body=await r.text();const start=body.indexOf('bindLostFound(state,{');assert.ok(start>0);body=body.slice(0,start)+body.slice(start).replace('canExport:candidate=>','canExport:candidate=>!window.lfRefuse&&');await route.fulfill({response:r,body});});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;await p.goto(url+'#post/lost-and-found');await p.locator('[data-lost-found-root],[data-select-explorer]').first().waitFor();
 if(await p.locator('[data-lost-found-root]').count()===0)await p.locator(`[data-select-explorer="${Object.keys(seeds)[0]}"]`).click();await p.locator('[data-lost-found-root]').waitFor();return {c,p};
}
const answer=async(p,a)=>{for(const [row,[t,q]] of Object.entries(a)){await p.selectOption(`[data-lf-answer="${row}"][data-lf-slot="0"]`,t??'');await p.selectOption(`[data-lf-answer="${row}"][data-lf-slot="1"]`,q??'');}};
const lc=p=>book(p).then(b=>b.mysteries?.cases?.ladder);
try{
 for(const [w,h,tell] of [[320,600,'yes'],[820,1000,'not-yet'],[1024,768,'yes']]){
  const {c,p}=await open(w,h);
  ok((await p.locator('.lf-arrival').innerText()).includes('Dot has pinned a big cork board'),`${w}: first visit`);ok(!(await overflow(p)),`${w}: no overflow on arrival`);eq(await small(p),[],`${w}: 44 px on arrival`);
  await act(p,'open').click();eq((await act(p,'open').innerText()).includes('Not started'),true,`${w}: Not started`);
  // Teaching, one step per keypress.
  for(let i=0;i<3;i++){await act(p,'step').focus();await p.keyboard.press('Enter');}eq(await p.locator('.lf-steps li').count(),4,`${w}: four steps`);ok(!Object.hasOwn(await book(p),'mysteries'),`${w}: teaching makes no write`);
  await act(p,'start').click();ok((await lc(p)).round===1,`${w}: Start sorting writes the case`);ok((await act(p,'open').innerText()).includes('Started'),`${w}: Started`);
  ok((await p.locator('.lf-worked').innerText()).startsWith('The miller was on the mill roof. So let'),`${w}: worked first clue`);
  // Sort by keyboard and tap; Why? follows each choice before its clue card.
  let first=true;for(const [sid,choice] of Object.entries(SORT)){const b=act(p,'sort',`[data-lf-sentence="${sid}"][data-lf-choice="${choice}"]`);if(first){await b.focus();await p.keyboard.press('Enter');first=false;}else await b.click();ok(await p.locator(`#lf-why-${sid}`).isVisible(),`${w}: Why? shows for ${sid}`);ok((await lc(p)).why.includes(sid),`${w}: support recorded for ${sid}`);}
  eq((await lc(p)).sort,SORT,`${w}: sorts kept as chosen`);eq(await p.locator('.lf-clue').allInnerTexts(),['The miller was on the mill roof.','Whoever had the rope was at the footbridge.','Pip was in the orchard.'],`${w}: round-1 clue cards`);
  ok(!(await overflow(p)),`${w}: no overflow after sorting`);eq(await small(p),[],`${w}: 44 px after sorting`);
  if(w===820){await p.locator('.lf-clues').evaluate(e=>e.scrollIntoView({block:'start'}));const top=(await p.locator('.lf-clues').boundingBox()).y,bottom=await p.locator('.lf-grid').first().evaluate(e=>e.getBoundingClientRect().bottom);ok(bottom-top<=h,'820: clue cards and the grid visible together');}
  // Marks keep focus; list mode; Clear asks inline.
  await act(p,'mark','[data-lf-cell="p:miller:mill-roof"]').focus();await p.keyboard.press('Enter');await p.keyboard.press('Enter');ok(await focused(p,'[data-lf-cell="p:miller:mill-roof"]'),`${w}: mark keeps focus`);eq((await lc(p)).marks,{'p:miller:mill-roof':'yes'},`${w}: no then yes`);
  await act(p,'mark','[data-lf-cell="t:pip:ladder"]').click();await act(p,'list').click();ok(await p.locator('[data-lf-list="t:pip:ladder"][value="no"]').isChecked(),`${w}: list shows the mark`);await p.locator('[data-lf-list="p:pip:mill-roof"][value="no"]').check();eq((await lc(p)).marks['p:pip:mill-roof'],'no',`${w}: list mode marks`);
  await act(p,'clear','[data-lf-grid="t"]').click();await act(p,'clear-no').click();eq((await lc(p)).marks['t:pip:ladder'],'no',`${w}: Keep them keeps every mark`);
  await act(p,'clear','[data-lf-grid="t"]').click();await act(p,'clear-yes').click();eq((await lc(p)).marks,{'p:miller:mill-roof':'yes','p:pip:mill-roof':'no'},`${w}: Yes clears only that grid`);await act(p,'list').click();
  if(out)await p.screenshot({path:`${out}/grid-${w}.png`,fullPage:true});
  // Can we tell yet? Then round 2.
  await act(p,'tell',`[data-lf-choice="${tell}"]`).click();const tl=await p.locator('.lf-tell').innerText();ok(tell==='yes'?tl.includes("Here's another way that fits every clue so far: "):tl.includes('These clues still allow more than one way.'),`${w}: Can we tell yet? ${tell}`);
  await act(p,'next-clue').click();eq((await lc(p)).round,2,`${w}: round 2`);await act(p,'skip').click();ok((await p.locator('[data-lf-round="2"]').innerText()).includes('These are sorted for you.'),`${w}: Sort them for me`);eq((await lc(p)).skipped,[2],`${w}: round recorded as skipped`);
  // Missing, duplicate, broken, fit.
  await act(p,'check').click();eq(await p.locator('#lf-line').innerText(),'Every row needs an answer first.',`${w}: missing`);ok(await focused(p,'#lf-line'),`${w}: check focuses the line`);eq(await p.locator('.lf-announce').innerText(),'Every row needs an answer first.',`${w}: announced`);
  await answer(p,{pip:['rope','orchard'],bramble:['rope','footbridge'],miller:['bucket','mill-roof']});await act(p,'check').click();eq(await p.locator('#lf-line').innerText(),'Use each thing and each place once. One of yours is used twice.',`${w}: duplicate`);
  await answer(p,{pip:['ladder','orchard'],bramble:['rope','footbridge'],miller:['bucket','mill-roof']});await act(p,'check').click();eq(await p.locator('#lf-line').innerText(),'That doesn\'t fit this clue: "Whoever had the ladder was on the mill roof". Have another look.',`${w}: broken clue`);
  eq((await lc(p)).firstCheck.result,'missing',`${w}: first check kept once`);
  // Reload mid-mystery keeps sort, marks, round and answer.
  await p.reload();await p.locator('[data-lost-found-root]').waitFor();ok((await p.locator('.lf-arrival').innerText()).includes('Dot has pinned up the notes.'),`${w}: later visit`);await act(p,'open').click();
  eq(await p.locator('[data-lf-answer="pip"][data-lf-slot="0"]').inputValue(),'ladder',`${w}: answer after reload`);ok(await p.locator('[data-lf-round="2"]').count(),`${w}: round after reload`);
  await answer(p,{pip:['bucket','orchard'],miller:['ladder','mill-roof']});await act(p,'check').click();eq(await p.locator('#lf-line').innerText(),'That fits every clue.',`${w}: fits`);
  await act(p,'reveal').click();ok(await focused(p,'#lf-reveal'),`${w}: reveal focus`);ok((await p.locator('.lf-reveal').innerText()).includes('How else do you get on a roof?'),`${w}: reveal`);
  await act(p,'look-back','[data-lf-choice="yes"]').click();ok((await p.locator('.lf-reveal').innerText()).includes('Who had the ladder?'),`${w}: Looking back yes`);await act(p,'look-back','[data-lf-choice="no"]').click();ok((await p.locator('.lf-reveal').innerText()).includes("Pip's idea was worth checking"),`${w}: Looking back no`);
  ok((await act(p,'open').innerText()).includes('Solved'),`${w}: Solved`);ok(!(await overflow(p)),`${w}: no overflow at the end`);eq(await small(p),[],`${w}: 44 px at the end`);
  if(out)await p.screenshot({path:`${out}/reveal-${w}.png`,fullPage:true});eq(p.errors,[],`${w}: no page errors`);await c.close();
 }
 // Forced preflight refusal.
 {const {c,p}=await open(820,1000);await act(p,'open').click();for(let i=0;i<3;i++)await act(p,'step').click();await act(p,'start').click();const before=await book(p);await p.evaluate(()=>{window.lfRefuse=true;});
  await act(p,'sort','[data-lf-sentence="miller-roof"][data-lf-choice="saw"]').click();eq(await book(p),before,'refused sort writes nothing');eq(await p.locator('#lf-why-miller-roof').count(),0,'refused sort shows no Why?');ok((await p.locator('#lf-status').innerText()).startsWith("There isn't room"),'capacity line');
  await act(p,'mark','[data-lf-cell="t:pip:ladder"]').click();eq(await book(p),before,'refused mark writes nothing');await p.evaluate(()=>{window.lfRefuse=false;});await act(p,'sort','[data-lf-sentence="miller-roof"][data-lf-choice="saw"]').click();eq((await lc(p)).sort,{'miller-roof':'saw'},'allowed once room returns');eq(p.errors,[],'no errors');await c.close();}
 // Extensions, unreadable and unknown versions.
 {const s=initializeExplorerState(freshState()),o={canExport:()=>true};C.startLadder(s,o);for(const [k,v] of Object.entries(SORT))C.sortSentence(s,k,v,o);C.checkLadder(s,o);s.mysteries.cases.ladder.setAside=['ladder-roof'];s.mysteries.cases.ladder.source.title='An older title';
  const {c,p}=await open(820,1000,{'explorer-1':s});const before=await book(p);ok((await act(p,'open').innerText()).includes('An older title'),'frozen source title');await act(p,'open').click();ok((await p.locator('.lf-mystery').innerText()).includes("This mystery can't be shown here."),'setAside case read-only');eq(await act(p,'check').count(),0,'no check on a read-only case');eq(await book(p),before,'kept exact');eq(p.errors,[],'no errors');await c.close();}
 {const s=initializeExplorerState(freshState());s.mysteries={v:9,later:[1]};const {c,p}=await open(820,1000,{'explorer-1':s});ok((await p.locator('aside.lf-notice').innerText()).includes('uses a format this version cannot read'),'unknown version line');eq(await p.locator('aside.lf-notice a[href="#notes"]').count(),1,'Notes link');eq(await act(p,'open').count(),0,'no board for an unknown version');eq((await book(p)).mysteries,{v:9,later:[1]},'raw');await c.close();}
 // Unsupported frozen clues stay readable as raw work without a fabricated proof or render error.
 for(const damage of ['contradiction','decided-first','ambiguous-final']){
  const s=initializeExplorerState(freshState()),o={canExport:()=>true};C.startLadder(s,o);C.sortForMe(s,o);C.checkLadder(s,o);const r=s.mysteries.cases.ladder;
  if(damage==='contradiction')r.source.clues[1].pred={kind:'place',row:'miller',place:'orchard'};
  if(damage==='decided-first')r.source.clues[3].round=1;
  if(damage==='ambiguous-final')r.source.clues[3].pred={kind:'place',row:'miller',place:'mill-roof'};
  r.skipped=[1];r.tellYet='yes';const {c,p}=await open(820,1000,{'explorer-1':s});const before=await book(p);
  await act(p,'open').click();ok((await p.locator('.lf-mystery').innerText()).includes("This mystery can't be shown here."),damage+': source-local recovery notice');
  eq(await act(p,'check').count(),0,damage+': no unsupported check');eq(await act(p,'tell').count(),0,damage+': no invented alternative proof');eq(await book(p),before,damage+': raw case unchanged');
  await p.goto(url+'#notes');const dl=p.waitForEvent('download');await p.locator('#download').click();const text=readFileSync(await(await dl).path(),'utf8');eq(JSON.parse(text).mysteries,s.mysteries,damage+': actual Notes retains source and history');eq(p.errors,[],damage+': no page error');await c.close();
 }
 // Notes download and import, reset, two explorers, stale controls.
 {const {c,p}=await open(820,1000,{'explorer-1':initializeExplorerState(freshState()),'explorer-2':initializeExplorerState(freshState())});await act(p,'open').click();for(let i=0;i<3;i++)await act(p,'step').click();await act(p,'start').click();await act(p,'sort','[data-lf-sentence="miller-roof"][data-lf-choice="saw"]').click();await act(p,'mark','[data-lf-cell="t:pip:ladder"]').click();const held=(await book(p)).mysteries;
  ok(!Object.hasOwn(await book(p,'explorer-2'),'mysteries'),'other explorer untouched');
  await p.goto(url+'#notes');ok((await p.locator('[data-lost-found-notes]').textContent()).includes('Who borrowed what? started.'),'Notes line');
  const dl=p.waitForEvent('download');await p.locator('#download').click();const text=readFileSync(await (await dl).path(),'utf8');eq(JSON.parse(text).mysteries,held,'download carries the root');
  await p.locator('#reset').click();await p.locator('#confirm-reset').click();await p.goto(url+'#notes');await p.locator('#progress-file').waitFor({state:'attached'});ok(!Object.hasOwn(await book(p),'mysteries'),'reset clears this explorer');
  await p.locator('#progress-file').setInputFiles({name:'lost.json',mimeType:'application/json',buffer:Buffer.from(text)});const skip=p.locator('dialog.welcome-film[open] [data-film-skip]');if(await skip.count())await skip.click();await p.locator('#progress-import-confirm').click();
  const id=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);eq((await book(p,id)).mysteries,held,'import restores the root');await c.close();
  const {c:c2,p:p2}=await open(820,1000);await act(p2,'open').click();for(let i=0;i<3;i++)await act(p2,'step').click();await act(p2,'start').click();const stale=await p2.evaluateHandle(()=>document.querySelector('[data-lf-action="sort"]'));await p2.goto(url+'#post');await p2.goto(url+'#post/lost-and-found');await p2.locator('[data-lost-found-root]').waitFor();
  const beforeStale=await book(p2);await stale.evaluate(b=>b.click());eq(await book(p2),beforeStale,'detached control writes nothing');await c2.close();}
 // The post office hub links here.
 {const {c,p}=await open(820,1000);await p.goto(url+'#post');ok(await p.locator('a[href="#post/lost-and-found"]').count()>=1,'hub link');eq(await p.locator('a[href="#post/lost-and-found"]').first().innerText(),'The Lost and Found Board','hub link text');await c.close();}
}finally{await browser.close();}
console.log(`Lost and Found Chrome: ${n} assertions passed at 320/820/1024, with reduced motion.`);
