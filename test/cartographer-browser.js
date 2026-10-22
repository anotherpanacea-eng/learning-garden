// Optional real-browser regressions. Serve dist locally; see the implementation receipt.
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=file=>import(pathToFileURL(path.join(root,'dist',file)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState}=await load('progress-transfer.mjs');
 const {startMap,placeMapMark,selectMapMark,selectMapRoute,appendMapMove,checkMapRoutes,setMapPage}=await load('cartographer-core.mjs');
 const seed=initializeExplorerState(freshState());seed.garden.welcomeFilmSeen=true;
 const r=startMap(seed);placeMapMark(seed,0,0);selectMapMark(seed,'cafe');placeMapMark(seed,3,0);
 for(const side of ['A','B']){selectMapRoute(seed,side);for(const d of ['e','e','e'])appendMapMove(seed,d);}
 checkMapRoutes(seed);setMapPage(seed,'compare');
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});let checks=0;
 const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;};
 try{
  const p=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(String(e)));
  await p.addInitScript(seed=>localStorage.setItem('number-garden-v1',JSON.stringify(seed)),seed);
  const stored=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1'))),current=async()=>{const root=(await stored()).cartographer;return root.rounds.find(r=>r.id===root.current);};
  const click=selector=>p.locator(selector).first().click(),tab=page=>click(`[data-map-page="${page}"]`);
  await p.goto(new URL('#workshop/maps',process.env.MAP_TEST_URL||'http://127.0.0.1:8000/').href);await p.locator('.cart-check').waitFor();const old=structuredClone((await current()).checks[0]);
  await tab('map');await click('[data-map-mark="cafe"]');await click('[data-map-point="5,0"]');await click('[data-map-mark="post"]');await click('[data-map-point="3,0"]');await tab('compare');
  const earlier=await p.locator('.cart-check').first().textContent();ok(earlier.includes('Earlier recorded check'),'edited map does not relabel old outcome as current');ok(earlier.includes('Post Office (0, 0)')&&earlier.includes('Café (3, 0)'),'earlier check identifies its original frozen endpoints');eq((await current()).checks[0],old,'recorded check remains exact after moving both endpoints');
  await click('[data-map-check]');const c=(await current()).checks.at(-1);eq(c.a.points.at(-1),{x:5,y:0},'travelled prefix ends at target');eq(c.a.blocked,3,'later command blocks');eq(c.a.arrived,false,'prefix at target is not completed arrival');ok(!(await p.locator('.cart-check').first().textContent()).includes('Thank you'),'blocked route does not receive success copy');
  await tab('route');await click('[data-map-side="A"]');await click('[data-map-remove="2"]');eq((await current()).a,['e','e'],'blocked command can be removed without restarting');eq(await p.evaluate(()=>document.activeElement.dataset.mapRemove),'1','removal keeps focus on neighboring usable command');
  await click('#cart-help>summary');await p.waitForFunction(()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')).cartographer.rounds.at(-1).support.includes('help'));await click('[data-map-start]');eq((await current()).support,[],'fresh map does not inherit support from native help panel');ok(!await p.locator('#cart-help').evaluate(e=>e.open),'fresh map help closed');
  await click('[data-map-point="0,0"]');await click('[data-map-mark="cafe"]');await click('[data-map-point="1,0"]');await tab('route');ok((await p.locator('.cart-route-result').first().textContent()).includes('No commands yet; still at the start'),'empty route has a clear starting state');await tab('compare');await click('[data-map-check]');const emptyFeedback=await p.locator('.cart-check').first().textContent();ok(!emptyFeedback.includes('shorter travelled prefix'),'unblocked routes do not receive a blocked-shortcut warning');ok(emptyFeedback.includes('which route ended away'),'unblocked nonarrival gets endpoint guidance');eq((emptyFeedback.match(/Recorded arrival:/g)||[]).length,2,'recorded status appears once per route');ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'phone page has no horizontal overflow');eq(errors,[],'no browser errors');
  console.log(`Cartographer browser regressions: ${checks} assertions passed.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
