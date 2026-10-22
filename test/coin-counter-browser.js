// Optional browser regressions. Serve dist locally; see the implementation receipt.
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=file=>import(pathToFileURL(path.join(root,'dist',file)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState}=await load('progress-transfer.mjs'),{startCoinRound}=await load('coin-counter-core.mjs');
 const playwright=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=playwright.default||playwright;
 const seed=initializeExplorerState(freshState());seed.garden.welcomeFilmSeen=true;
 const first=startCoinRound(seed,'ribbon'),second=startCoinRound(seed,'seed-tag');second.a={penny:5,nickel:0,dime:0,quarter:1};
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});let checks=0;
 const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;};
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  await page.addInitScript(seed=>localStorage.setItem('number-garden-v1',JSON.stringify(seed)),seed);
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')));
  const current=async()=>{const r=(await saved()).coinCounter;return r.rounds.find(x=>x.id===r.current);};
  const click=selector=>page.locator(selector).first().click();
  await page.goto(new URL('#workshop/coins',process.env.COIN_TEST_URL||'http://127.0.0.1:8000/').href);
  await click('#coin-exchanges>summary');await click('[data-coin-exchange="penny-nickel"]');
  const status=await page.locator('#coin-status').textContent();
  ok(/had 6 coins.*now has 2 coins.*30 cents/s.test(status),'exchange distinguishes whole-mat counts from the traded coins');
  eq((await current()).a,{penny:0,nickel:1,dime:0,quarter:1},'the untouched quarter remains');
  await click('#coin-help>summary');await page.waitForTimeout(40);
  ok((await current()).support.includes('help'),'requested help belongs to this round');
  await click('[data-coin-next]');await page.waitForTimeout(40);
  eq(await page.locator('#coin-help').evaluate(e=>e.open),false,'new round does not inherit an open help panel');
  ok(!(await current()).support.includes('help'),'new round does not inherit a support record');
  await click('#coin-help>summary');await page.waitForTimeout(40);await click('.coin-history>summary');await click(`[data-coin-resume="${first.id}"]`);await page.waitForTimeout(40);
  ok(!(await current()).support.includes('help'),'resuming an earlier unhelped round does not add help');
  await click('[data-coin-adjust="penny"][data-delta="1"]');
  eq(await page.evaluate(()=>document.activeElement.dataset.delta),'1','addition keeps its own control focused');
  await click('[data-coin-adjust="penny"][data-delta="-1"]');
  eq(await page.evaluate(()=>document.activeElement.dataset.delta),'1','removing the final coin focuses matching Add');
  console.log(`Coin Counter browser regressions: ${checks} assertions passed.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
