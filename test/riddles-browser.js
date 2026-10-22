// Synthetic browser play at phone width; no physical-device or learning-effect claims.
// Serve dist/ first, e.g. `python3 -m http.server 8000 -d dist`, then run with Node.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState}=await load('progress-transfer.mjs'),{riddles}=await load('riddles-content.mjs');
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.RIDDLES_TEST_URL||'http://127.0.0.1:8000/',artifacts=process.env.RIDDLES_ARTIFACTS,errors=[];
 if(artifacts)await fs.mkdir(artifacts,{recursive:true});
 const seed=initializeExplorerState(freshState());seed.garden.welcomeFilmSeen=true;
 const c=await browser.newContext({viewport:{width:320,height:740},hasTouch:true});
 await c.addInitScript(seed=>{if(!localStorage.getItem('synthetic-riddles-seed')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('synthetic-riddles-seed','1');}Math.random=()=>0.42;},seed);
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
 const state=()=>p.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return r?JSON.parse(localStorage.getItem(`number-garden-v1:${r.activeId}`)):null;});
 const noOverflow=async m=>assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),m);
 const shot=async name=>{if(artifacts)await p.screenshot({path:path.join(artifacts,name),fullPage:true});};
 try{
  await p.goto(new URL('#home',origin).href);await p.locator('.riddle-home-invite a').click();await p.locator('.riddles').waitFor();
  assert.equal(Object.hasOwn(await state()||{},'riddles'),false,'visiting creates no riddle work');await noOverflow('empty page fits 320 px');await shot('riddles-empty.png');
  await p.locator('[data-riddle-size="sprout"]').click();assert.equal(await p.evaluate(()=>document.activeElement.dataset.riddleSize),'sprout');
  await p.locator('[data-riddle-next]').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'riddle-prompt','focus moves to the riddle');
  const saved=(await state()).riddles,card=riddles.find(r=>r.id===saved.current.id);assert.equal(card.band,'sprout');
  for(const b of await p.locator('[data-riddle-choice]').all()){const box=await b.boundingBox();assert.ok(box.height>=44,'choice targets are at least 44 px');}
  await noOverflow('card fits 320 px');await shot('riddles-card.png');
  const wrong=saved.current.order.find(x=>x!==card.answer);await p.locator(`[data-riddle-choice="${wrong}"]`).click();
  assert.equal(await p.evaluate(()=>document.activeElement.id),'riddle-nudge');assert.ok(await p.locator(`[data-riddle-choice="${wrong}"]`).isDisabled());
  await p.locator('[data-riddle-clue]').click();await p.locator('.riddle-clue').waitFor();await shot('riddles-nudge-clue.png');
  await p.reload();await p.locator('.riddle-clue').waitFor();assert.deepEqual((await state()).riddles.current.order,saved.current.order,'reload keeps choice order');
  await p.locator(`[data-riddle-choice="${card.answer}"]`).click();assert.equal(await p.evaluate(()=>document.activeElement.id),'riddle-result-title');
  assert.deepEqual((await state()).riddles.log,[{id:card.id,tries:2,clue:true,outcome:'solved'}]);await noOverflow('result fits 320 px');await shot('riddles-solved.png');
  await p.goto(new URL('#notes',origin).href);await p.getByText('Riddles in the Hedge: cards and picks').click();assert.match(await p.locator('main').innerText(),/Found after Dot’s clue: 1/);
  assert.deepEqual(errors,[],'no page errors');console.log('Riddles in the Hedge browser checks passed.');
 }finally{await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
