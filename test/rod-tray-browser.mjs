// Spec 344 browser journeys in Chromium: tray controls by tap and keyboard, limits, the stepper, Check and its
// transitions, the help ladder and number line, teach cards, viewport fit, reduced motion, Notes transfer,
// save-off, two explorers, stale controls and a forced preflight refusal.
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.chromium?playwright:playwright.default;
const url=process.env.ROD_TEST_URL;if(!url)throw new Error('Serve dist locally and set ROD_TEST_URL.');
const out=process.env.ROD_ARTIFACTS;if(out)mkdirSync(out,{recursive:true});
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const registry=ids=>({version:1,activeId:ids[0],explorers:ids.map(id=>({id,avatar:'sky',color:'blue',symbol:'leaf',createdAt:'2026-11-01T12:00:00.000Z'}))});
const book=(p,id)=>p.evaluate(id=>{const a=id||JSON.parse(localStorage.getItem('learning-garden-explorers')||'{}').activeId;return JSON.parse(localStorage.getItem('number-garden-v1:'+a)||'{}');},id);
const act=(p,a)=>p.locator(`[data-rt-act="${a}"]`);
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
const small=p=>p.$$eval('.rt-page button,.rt-page summary,.rt-page a',xs=>xs.filter(x=>x.offsetParent).filter(x=>{const r=x.getBoundingClientRect();return r.width<43.5||r.height<43.5;}).map(x=>x.outerHTML.slice(0,80)));
const bottom=(p,sel)=>p.locator(sel).first().evaluate(e=>e.getBoundingClientRect().bottom);
async function open(width,height,{seeds={'explorer-1':initializeExplorerState(freshState())},reducedMotion='no-preference'}={}){
 const c=await browser.newContext({viewport:{width,height},acceptDownloads:true,reducedMotion});
 await c.addInitScript(d=>{if(!localStorage.getItem('rt-fixture')){localStorage.setItem('learning-garden-explorers',JSON.stringify(d.registry));for(const [id,s] of Object.entries(d.seeds))localStorage.setItem('number-garden-v1:'+id,JSON.stringify(s));localStorage.setItem('rt-fixture','1');}},{registry:registry(Object.keys(seeds)),seeds});
 await c.route('**/app.mjs',async route=>{const r=await route.fetch();let body=await r.text();const start=body.indexOf('bindRodTray(state,{');assert.ok(start>0);body=body.slice(0,start)+body.slice(start).replace('canExport:candidate=>','canExport:candidate=>!window.rtRefuse&&');await route.fulfill({response:r,body});});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;await p.goto(url+'#desk/rods');await p.locator('[data-rod-tray-view],[data-select-explorer]').first().waitFor();
 if(await p.locator('[data-rod-tray-view]').count()===0)await p.locator(`[data-select-explorer="${Object.keys(seeds)[0]}"]`).click();await p.locator('[data-rod-tray-view]').waitFor();return {c,p};
}
const trayText=p=>p.locator('#rt-tray-text').innerText();
// What a sighted child reads: the text without its screen-reader wording.
const seen=l=>l.evaluate(e=>{const x=e.cloneNode(true);x.querySelectorAll('.sr-only').forEach(s=>s.remove());return x.textContent.trim();});
try{
 for(const [w,h] of [[320,800],[820,1180],[1024,768]]){
  const {c,p}=await open(w,h);
  ok(!Object.hasOwn(await book(p),'rodTray'),`${w}: opening writes nothing`);eq(await trayText(p),'The tray is empty.',`${w}: empty tray`);
  ok((await p.locator('.rt-reason').innerText()).startsWith('The baker sells bread'),`${w}: Willowbank reason`);ok((await p.locator('.rt-model').innerText()).startsWith('A made-up model.'),`${w}: model line`);
  {const t=await p.locator('.rt-legend').ariaSnapshot();ok(t.includes('the minus sign')&&t.includes('the plus sign')&&!t.includes('(−)'),`${w}: legend names its signs`);}ok((await p.locator('.rt-sentence').ariaSnapshot()).includes('4 plus negative 7')&&!(await p.locator('.rt-sentence').ariaSnapshot()).includes('−'),`${w}: accessibility tree reads the sentence with negative`);
  ok(!(await overflow(p)),`${w}: no horizontal overflow`);eq(await small(p),[],`${w}: 44 px controls`);
  if(w>=820)for(const sel of ['.rt-sentence','.rt-tray','.rt-controls','.rt-stepper','[data-rt-check]'])ok(await bottom(p,sel)<=h,`${w}: ${sel} fits the first viewport`);
  // Guided case 1 by tap: 4 red, 7 black, pair off, count.
  ok(await p.locator('.rt-guided li').count()===3,`${w}: guided steps before answering`);
  for(let i=0;i<4;i++)await act(p,'addRed').click();eq(await p.evaluate(()=>document.activeElement?.dataset.rtAct),'addRed',`${w}: focus stays on the pressed control`);
  ok(await act(p,'takeBlack').isDisabled(),`${w}: no black to take`);ok((await p.locator('.rt-limit').innerText()).includes('There are no black rods to take away. Add a zero pair first.'),`${w}: limit line`);
  for(let i=0;i<7;i++)await act(p,'addBlack').click();eq(await trayText(p),'4 red rods, 7 black rods.',`${w}: text equivalent`);
  await act(p,'pairOff').click();eq(await trayText(p),'0 red rods, 3 black rods.',`${w}: four pairs leave`);ok((await p.locator('.rt-paired').innerText()).includes('Each red and black pair makes zero'),`${w}: pairing caption`);if(w>=820)for(const sel of ['.rt-controls','[data-rt-check]'])ok(await bottom(p,sel)<=h,`${w}: ${sel} still fits after pairing`);
  await act(p,'pairOff').click();ok((await p.locator('.rt-paired').innerText()).includes('There are no pairs.'),`${w}: nothing pairs`);
  // Keyboard: the stepper to −3, then Check.
  await act(p,'answerDown').focus();for(let i=0;i<3;i++)await p.keyboard.press('Enter');ok((await p.locator('#rt-value').ariaSnapshot()).includes('negative 3')&&!(await p.locator('#rt-value').ariaSnapshot()).includes('−'),`${w}: accessibility tree reads the stepper as negative`);eq(await seen(p.locator('#rt-value')),'−3',`${w}: true minus sign`);
  await p.locator('[data-rt-check]').click();await p.locator('#rt-feedback').waitFor();ok((await seen(p.locator('#rt-feedback .rt-said'))).startsWith('4 + (−7) = −3.'),`${w}: explanation on a match`);ok((await p.locator('#rt-feedback .rt-said .sr-only').allTextContents()).join('|')==='negative 7|negative 3',`${w}: explanation read with negative`);ok((await p.locator('#rt-feedback').innerText()).includes('Tell a grown-up why'),`${w}: spoken invitation`);
  eq(await p.evaluate(()=>document.activeElement?.id),'rt-feedback',`${w}: focus moves to the feedback`);
  let saved=(await book(p)).rodTray;eq([saved.checks[0].count,saved.checks[0].first.matches,saved.checks[0].first.helpBefore.guided],[1,true,true],`${w}: first check saved`);
  await p.locator('[data-rt-check]').click();eq((await book(p)).rodTray.checks[0].count,1,`${w}: repeat press is a no-op`);
  // The help ladder in order, then a changed answer gets a targeted line.
  await p.locator('[data-rt-help="hint"]').click();await p.locator('#rt-hint-focus').waitFor();ok((await p.locator('#rt-hint-focus').innerText()).includes('How many steps reach zero?'),`${w}: hint`);eq((await book(p)).rodTray.support[0].hint,true,`${w}: hint saved before display`);
  await p.locator('[data-rt-help="helper"]').click();await p.locator('#rt-helper-focus').waitFor();ok((await p.locator('#rt-helper-focus').innerText()).includes('Example tray. Your own tray is waiting.'),`${w}: helper caption`);
  await p.locator('[data-rt-step="1"]').click();await p.locator('[data-rt-step="1"]').click();ok((await seen(p.locator('#rt-helper-focus'))).includes('One black rod is left: −1.'),`${w}: helper last step`);ok(await p.locator('[data-rt-step="1"]').isDisabled(),`${w}: Next stops at the end`);{const t=await p.locator('#rt-helper-focus').ariaSnapshot();ok(t.includes('negative 1')&&!/−\d/.test(t),`${w}: helper step read with negative`);}
  await p.locator('[data-rt-back]').click();eq(await trayText(p),'0 red rods, 3 black rods.',`${w}: own tray untouched`);
  await p.locator('[data-rt-help="line"]').click();await p.locator('#rt-line-focus').waitFor();ok((await p.locator('.rt-arrow-caption').innerText())==='Adding negative 7 moves 7 to the left. It goes straight through zero.',`${w}: arrow caption`);
  saved=(await book(p)).rodTray;eq(saved.support[0],{caseId:'cross-down',hint:true,helper:true,line:true},`${w}: help flags saved`);
  for(let i=0;i<14;i++)await act(p,'answerUp').click();await p.locator('[data-rt-check]').click();ok((await p.locator('#rt-feedback .rt-said').innerText())==='You added the sizes. Adding a negative moves down, not up.',`${w}: targeted line for 11`);
  saved=(await book(p)).rodTray.checks[0];eq([saved.count,saved.first.answer,saved.latest.answer,saved.latest.matches,saved.latest.helpBefore.line],[2,-3,11,false,true],`${w}: first kept, latest replaced`);
  // Take-black: zero pairs make the take-away possible.
  await p.locator('[data-rt-case="take-black"]').click();ok((await p.locator('.rt-contrast').innerText()).includes('Same numbers, one sign changed.'),`${w}: contrast caption`);eq(await trayText(p),'The tray is empty.',`${w}: each case has its own tray`);
  await act(p,'addRed').click();ok(await act(p,'takeBlack').isDisabled(),`${w}: no automatic pairs`);for(let i=0;i<3;i++)await act(p,'addPair').click();for(let i=0;i<3;i++)await act(p,'takeBlack').click();eq(await trayText(p),'4 red rods, 0 black rods.',`${w}: 1 − (−3) on the tray`);
  // Teach card: saved before its steps show.
  await p.locator('[data-rt-teach="T3"] > summary').click();await p.locator('#rt-teach-T3').waitFor();eq((await book(p)).rodTray.teaching.T3,true,`${w}: teach exposure saved first`);eq(await p.locator('#rt-teach-T3 li').count(),1,`${w}: one step at a time`);{const t=await p.locator('#rt-teach-T3').ariaSnapshot();ok(t.includes('take away')&&t.includes('negative 2')&&!/−\d/.test(t),`${w}: teach step read with take away and negative`);}
  await p.locator('[data-rt-teach="T3"] > summary').click();eq(await p.locator('[data-rt-teach="T3"]').evaluate(d=>d.open),false,`${w}: closing a teach card closes it`);eq(await p.locator('#rt-teach-T3').count(),0,`${w}: closed card shows no steps`);
  await p.locator('[data-rt-teach="T1"] > summary').click();await p.locator('#rt-teach-T1').waitFor();await p.locator('[data-rt-teach="T2"] > summary').focus();await p.keyboard.press('Enter');await p.locator('#rt-teach-T2').waitFor();
  await p.locator('[data-rt-teach="T2"] > summary').focus();await p.keyboard.press('Enter');eq(await p.locator('[data-rt-teach="T2"]').evaluate(d=>d.open),false,`${w}: keyboard closes a teach card`);
  ok(await p.locator('[data-rt-teach="T2"] > summary').evaluate(e=>e===document.activeElement),`${w}: focus stays on the closed card`);ok(await p.locator('[data-rt-teach="T1"]').evaluate(d=>d.open)&&await p.locator('#rt-teach-T1').count()===1,`${w}: another open card stays open`);
  ok(!(await overflow(p)),`${w}: no overflow after play`);eq(await small(p),[],`${w}: 44 px after play`);
  if(out)await p.screenshot({path:`${out}/rod-tray-${w}.png`,fullPage:true});
  await p.addStyleTag({content:'html{font-size:150%}'});ok(!(await overflow(p)),`${w}: 150% root font has no overflow`);
  // Reload restores drafts from saved work and writes nothing.
  saved=(await book(p)).rodTray;await p.reload();await p.locator('[data-rod-tray-view]').waitFor();eq((await book(p)).rodTray,saved,`${w}: reload writes nothing`);eq(await trayText(p),'0 red rods, 3 black rods.',`${w}: draft restored`);
  eq(p.errors,[],`${w}: no page errors`);await c.close();
 }
 // Full tray limit and reduced motion.
 {const {c,p}=await open(820,1180,{reducedMotion:'reduce'});await p.locator('[data-rt-case="two-below"]').click();for(let i=0;i<12;i++)await act(p,'addRed').click();ok(await act(p,'addRed').isDisabled()&&await act(p,'addPair').isDisabled(),'full: add red and zero pair disabled');ok((await p.locator('.rt-limit').first().innerText()).includes('The tray holds 12 of each kind.'),'full line');
  await act(p,'addBlack').click();await act(p,'pairOff').click();ok(await p.locator('.rt-still').isVisible()&&!(await p.locator('.rt-zeros').isVisible()),'reduced motion: caption, no fading zeros');eq(await p.locator('.rt-still').innerText(),'1 zero pair left the tray.','reduced-motion caption');
  await act(p,'startAgain').click();eq(await trayText(p),'The tray is empty.','Start again');eq(p.errors,[]);await c.close();}
 // A forced preflight refusal shows the refusal and nothing new.
 {const {c,p}=await open(820,1180);await act(p,'addRed').click();const before=await book(p);await p.evaluate(()=>{window.rtRefuse=true;});await act(p,'addRed').click();ok((await p.locator('#rt-status').innerText()).includes('That didn’t save'),'refusal shown');eq(await book(p),before,'refusal writes nothing');eq(await trayText(p),'1 red rod, 0 black rods.','tray unchanged');
  await p.locator('[data-rt-help="hint"]').click();eq(await p.locator('#rt-hint-focus').count(),0,'refused help is not shown');await p.evaluate(()=>{window.rtRefuse=false;});await c.close();}
 // Notes download, reset, import; two explorers; a stale control; save-off.
 {const {c,p}=await open(820,1180,{seeds:{'explorer-1':initializeExplorerState(freshState()),'explorer-2':initializeExplorerState(freshState())}});await act(p,'addBlack').click();await act(p,'answerDown').click();await p.locator('[data-rt-check]').click();const held=(await book(p)).rodTray;
  ok(!Object.hasOwn(await book(p,'explorer-2'),'rodTray'),'other explorer untouched');
  await p.goto(url+'#notes');const notes=p.locator('[data-rod-tray-notes]');await notes.locator('summary').click();const t=await notes.innerText();ok(t.includes('First check')&&t.includes('guided steps shown by design')&&t.includes('Attempts in between are not kept.'),'Notes block');
  const dl=p.waitForEvent('download');await p.locator('#download').click();const text=readFileSync(await (await dl).path(),'utf8');eq(JSON.parse(text).rodTray,held,'download carries the root');
  await p.locator('#reset').click();await p.locator('#confirm-reset').click();await p.goto(url+'#notes');await p.locator('#progress-file').waitFor({state:'attached'});ok(!Object.hasOwn(await book(p),'rodTray'),'reset clears this explorer');
  await p.locator('#progress-file').setInputFiles({name:'rods.json',mimeType:'application/json',buffer:Buffer.from(text)});const skip=p.locator('dialog.welcome-film[open] [data-film-skip]');if(await skip.count())await skip.click();ok((await p.locator('body').innerText()).includes('The Rod Tray'),'import names the destination');await p.locator('#progress-import-confirm').click();
  const id=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);eq((await book(p,id)).rodTray,held,'import restores the root');
  await p.goto(url+'#desk/rods');await p.locator('[data-rod-tray-view],[data-select-explorer]').first().waitFor();if(await p.locator('[data-select-explorer]').count())await p.locator(`[data-select-explorer="${id}"]`).click();await p.locator('[data-rod-tray-view]').waitFor();
  const reDl=p.waitForEvent('download');await p.goto(url+'#notes');await p.locator('#download').click();eq(JSON.parse(readFileSync(await (await reDl).path(),'utf8')).rodTray,held,'re-download matches');
  await p.goto(url+'#desk/rods');await p.locator('[data-rod-tray-view]').waitFor();const stale=await p.evaluateHandle(()=>document.querySelector('[data-rt-act="addRed"]'));await p.goto(url+'#desk');await p.goto(url+'#desk/rods');await p.locator('[data-rod-tray-view]').waitFor();
  const beforeStale=await book(p);await stale.evaluate(b=>b.click());eq(await book(p),beforeStale,'detached control writes nothing');
  await p.locator('#explorer-switch').click();await p.locator('[data-select-explorer="explorer-2"]').click();await p.locator('[data-rod-tray-view]').waitFor();eq(await trayText(p),'The tray is empty.','second explorer has its own tray');eq(p.errors,[]);await c.close();}
 {const {c,p}=await open(320,800);await p.goto(url+'#notes');await p.locator('#remember').uncheck();const storage=await p.evaluate(()=>({...localStorage}));await p.goto(url+'#desk/rods');await p.locator('[data-rod-tray-view]').waitFor();await act(p,'addRed').click();eq(await trayText(p),'1 red rod, 0 black rods.','saving off: play works');eq(await p.evaluate(()=>({...localStorage})),storage,'saving off: nothing stored');await c.close();}
 // Discovery beside Between the Marks in the Number Garden and the Keeper's Desk list; an unknown root stays exact.
 {const {c,p}=await open(1024,768);await p.goto(url+'#numbers');ok(await p.locator('.rt-entry a[href="#desk/rods"]').count()===1,'Number Garden discovery');await p.goto(url+'#desk');ok(await p.locator('.rt-entry a[href="#desk/rods"]').count()===1,'Desk discovery');await c.close();}
 {const s=initializeExplorerState(freshState());s.rodTray={kind:'rod-tray',version:9,later:true};const {c,p}=await open(820,1180,{seeds:{'explorer-1':s}});ok((await p.locator('.rt-notice').innerText()).includes('different version'),'unknown version notice');eq(await p.locator('[data-rt-act]').count(),0,'no controls');eq((await book(p)).rodTray,{kind:'rod-tray',version:9,later:true},'unknown root exact');await c.close();}
}finally{await browser.close();}
console.log(`Rod Tray Chrome: ${n} assertions passed at 320/820/1024, with reduced motion.`);
