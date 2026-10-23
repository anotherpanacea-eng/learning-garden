// Optional installed-browser check with a synthetic local notebook.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const dir=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(dir,'dist',f)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState}=await load('progress-transfer.mjs');
 const {nextGuest}=await load('cafe-core.mjs'),{startCoinRound}=await load('coin-counter-core.mjs'),{startChange}=await load('market-change-core.mjs'),{startWorkshop}=await load('workshop-core.mjs');
 const {gatheringCases}=await load('gathering-budget-core.mjs');
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const base=process.env.GATHERING_TEST_URL||'http://127.0.0.1:4198/',errors=[];let n=0;
 const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
 const seed=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;nextGuest(s);startCoinRound(s,'ribbon');startChange(s,'ribbon-exact');startWorkshop(s,'height','smooth');return s;};
 const stored=p=>p.evaluate(()=>{const x=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem('number-garden-v1:'+x.activeId));});
 const tap=(p,s)=>p.locator(s).first().tap();
 async function setup(width){const c=await browser.newContext({viewport:{width,height:850},hasTouch:true,acceptDownloads:true}),p=await c.newPage(),initial=seed();
  await p.addInitScript(s=>{if(!localStorage.getItem('budget-seeded')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('budget-seeded','1');}window.__spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{name:'Synthetic local English',lang:'en-US',localService:true,voiceURI:'qa-local',default:true}],cancel(){},resume(){},speak(u){window.__spoken.push(u.text);queueMicrotask(()=>u.onstart?.());queueMicrotask(()=>u.onend?.());},addEventListener(){},removeEventListener(){}}});},initial);
  p.on('pageerror',e=>errors.push(e.message));await p.goto(new URL('#workshop/budget',base).href);await p.locator('.gather-budget-page').waitFor();return {c,p,initial};}
 async function controls(p){ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');eq(await p.locator('.gather-budget-page button:not(:disabled),.gather-budget-page a,.gather-budget-page summary,.gather-budget-page input').evaluateAll(xs=>xs.filter(x=>x.getClientRects().length&&x.getBoundingClientRect().height<44).map(x=>x.outerHTML.slice(0,80))),[],'visible controls meet 44px');eq(await p.evaluate(()=>getComputedStyle(document.querySelector('.skip-link')).top),'-100px','skip link remains hidden');}
 async function setBasket(p,c,counts){for(let i=0;i<counts.length;i++)for(let j=0;j<counts[i];j++)await tap(p,`[data-gather-change="${c.items[i].id},1"]`);}
 async function setExact(p,c,counts){for(let i=0;i<counts.length;i++){
  const id=c.items[i].id,add=`[data-gather-change="${id},1"]`,remove=`[data-gather-change="${id},-1"]`;
  const current=Number((await p.locator(add).locator('xpath=..').innerText()).match(/In our basket: (\d+)/)?.[1]);
  ok(Number.isInteger(current),`read ${id} count`);
  for(let j=current;j<counts[i];j++)await tap(p,add);
  for(let j=current;j>counts[i];j--)await tap(p,remove);
 }}
 try{for(const width of [320,820]){
  const {c,p,initial}=await setup(width),original=await stored(p);
  eq(await p.locator('[data-gather-start]').count(),2,'two open requests');ok(!await p.locator('.gather-chips').count(),'no basket before Start');
  eq(await stored(p),original,'opening transient chooser does not write saved state');
  for(const cse of gatheringCases){
   if(await p.locator('.gather-chooser').count())await p.locator('.gather-chooser').evaluate(x=>x.open=true);
   await tap(p,`[data-gather-start="${cse.id}"]`);ok((await p.locator('.gather-request').innerText()).includes(cse.request),'exact request visible');
   eq(await p.evaluate(()=>document.activeElement.id),'gather-turn-title','Start focuses basket turn');
   const oneStock=cse.items[3].id;
   await p.locator(`[data-gather-change="${oneStock},1"]`).press('Enter');
   eq(await p.locator(`[data-gather-change="${oneStock},1"]`).isDisabled(),true,'stock bound disables Add');
   eq(await p.evaluate(()=>document.activeElement.getAttribute('data-gather-change')),`${oneStock},-1`,'focus moves to enabled Remove');
   await p.locator(`[data-gather-change="${oneStock},-1"]`).press('Enter');
   eq(await p.locator(`[data-gather-change="${oneStock},-1"]`).isDisabled(),true,'zero bound disables Remove');
   eq(await p.evaluate(()=>document.activeElement.getAttribute('data-gather-change')),`${oneStock},1`,'focus returns to enabled Add');
   const old=await p.locator(`[data-gather-change="${cse.items[0].id},1"]`).elementHandle();
   const target=cse.id==='welcome-table'?[1,1,1,0]:[0,2,0,1],cost=cse.id==='welcome-table'?14:17;
   await setBasket(p,cse,target);ok((await p.locator('.gather-summary').first().innerText()).includes(`${cost}¢ of ${cse.limit}¢`),'pictured basket cost');
   eq(await p.locator('.gather-chip').count(),target.reduce((a,b)=>a+b,0),'pictured packets count');
   await tap(p,'[data-gather-page="review"]');eq(await p.evaluate(()=>document.activeElement.id),'gather-turn-title','Review focuses heading');
   await p.locator('#gather-idea').fill('1');await p.locator('#gather-idea').press('End');await p.locator('#gather-idea').type(String(cost).slice(1));
   eq(await p.locator('#gather-idea').inputValue(),String(cost),'idea typed without lost caret');
   await tap(p,'[data-gather-check]');ok((await p.locator('#gather-feedback').innerText()).includes('one working plan'),'request and limit both fit');
   ok((await p.locator('#gather-feedback').innerText()).includes('idea matches'),'cost idea separate and correct');
   await p.locator('#gather-idea').fill('99');eq(await p.locator('#gather-feedback').count(),0,'typing clears prior check');
   await tap(p,'[data-gather-check]');ok((await p.locator('#gather-feedback').innerText()).includes('idea can be revised'),'wrong idea does not invalidate basket');
   await tap(p,'[data-gather-mode="unsure"]');eq(await p.locator('#gather-feedback').count(),0,'Not sure clears prior check');
   await tap(p,'[data-gather-check]');ok((await p.locator('#gather-feedback').innerText()).includes('No cost idea'),'no idea still checks basket');
   const staleHear=await p.locator('.gather-request [data-speak]').elementHandle();await tap(p,'[data-gather-page="basket"]');
   ok((await p.locator('.gather-request').innerText()).includes(cse.request),'request remains on basket turn');
   const oldCount=await p.locator('.gather-chip').count();await old.evaluate(x=>x.click());eq(await p.locator('.gather-chip').count(),oldCount,'detached Add cannot change current basket');
   const beforeSpeech=await p.evaluate(()=>window.__spoken.length);await staleHear.evaluate(x=>x.click());eq(await p.evaluate(()=>window.__spoken.length),beforeSpeech,'detached Hear cannot start voice');
   await controls(p);
   if(process.env.GATHERING_ARTIFACTS){fs.mkdirSync(process.env.GATHERING_ARTIFACTS,{recursive:true});await p.locator('.gather-budget-page').screenshot({path:path.join(process.env.GATHERING_ARTIFACTS,`${cse.id}-basket-${width}.png`)});}
   await tap(p,'[data-gather-page="review"]');if(process.env.GATHERING_ARTIFACTS)await p.locator('.gather-budget-page').screenshot({path:path.join(process.env.GATHERING_ARTIFACTS,`${cse.id}-review-${width}.png`)});
   await controls(p);
   const classes=cse.id==='welcome-table'?[[[0,0,0,0],true,false],[[0,2,0,1],false,true],[[3,2,0,0],false,false]]:[[[0,0,0,0],true,false],[[4,0,0,1],false,true],[[4,2,0,0],false,false]];
   for(const [counts,budgetFit,requestFit] of classes){
    await tap(p,'[data-gather-page="basket"]');await setExact(p,cse,counts);await tap(p,'[data-gather-page="review"]');await tap(p,'[data-gather-check]');
    const text=await p.locator('#gather-feedback').innerText();ok(text.includes(budgetFit?'within the':'above the'),'budget status matches basket');
    ok(text.includes(requestFit?'This part of the request is met.':'This part still needs'),'need status matches basket');
   }
   await tap(p,'[data-gather-page="basket"]');await setExact(p,cse,target);
  }
  await p.locator('.gather-chooser').evaluate(x=>x.open=true);await tap(p,'[data-gather-start="welcome-table"]');ok((await p.locator('.gather-summary').innerText()).includes('14¢'),'switching request retains visit basket');
  await tap(p,'.gather-request .hear-button');ok((await p.evaluate(()=>window.__spoken)).some(x=>x.includes('pretend welcome table')),'local request narration uses current source');
  await tap(p,'[data-gather-page="review"]');await p.locator('#gather-idea').fill('ba');await tap(p,'[data-gather-check]');ok((await p.locator('#gather-status').innerText()).includes('two digits'),'invalid raw input remains editable');eq(await p.locator('#gather-idea').inputValue(),'ba');
  await tap(p,'[data-gather-mode="blank"]');await tap(p,'[data-gather-check]');ok(await p.locator('#gather-feedback').count()===1,'explicit blank checks basket');
  await p.goto(new URL('#notes',base).href);await p.locator('#download').waitFor();eq(await stored(p),original,'both cases left all saved roots untouched');
  const [download]=await Promise.all([p.waitForEvent('download'),tap(p,'#download')]);const report=JSON.parse(fs.readFileSync(await download.path(),'utf8'));ok(!Object.hasOwn(report,'gatheringBudget'),'transient table absent from notes');
  for(const key of ['cafe','coinCounter','marketChange','workshop'])eq(report[key],original[key],`download preserves waiting ${key} work`);
  await p.goto(new URL('#workshop/budget',base).href);await p.locator('[data-gather-start]').first().waitFor();ok(!await p.locator('.gather-summary').count(),'route exit resets basket');
  await tap(p,'[data-gather-start="welcome-table"]');await tap(p,'[data-gather-change="plain-card,1"]');await p.reload();await p.locator('[data-gather-start]').first().waitFor();ok(!await p.locator('.gather-summary').count(),'reload resets basket');
  await tap(p,'[data-gather-start="welcome-table"]');await tap(p,'[data-gather-change="plain-card,1"]');await tap(p,'#explorer-switch');await p.locator('#explorer-cancel').waitFor();await tap(p,'#explorer-cancel');await p.locator('[data-gather-start]').first().waitFor();ok(!await p.locator('.gather-summary').count(),'opening explorer chooser clears the visit');
  await p.goto(new URL('#notes',base).href);await p.locator('#progress-file').setInputFiles({name:'synthetic-gathering-notes.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report,null,2))});await p.locator('#progress-import-confirm').waitFor();await tap(p,'#progress-import-confirm');ok((await p.locator('#progress-import-status').innerText()).includes('Notebook brought'),'separate explorer import succeeds');
  const imported=await stored(p);for(const key of ['cafe','coinCounter','marketChange','workshop'])eq(imported[key],original[key],`import preserves waiting ${key} work`);
  await p.goto(new URL('#workshop/budget',base).href);await p.locator('[data-gather-start]').first().waitFor();ok(!await p.locator('.gather-summary').count(),'imported explorer starts fresh');
  await c.close();
 }
 eq(errors,[],'no page errors');console.log(`Gathering Budget browser: ${n} assertions passed.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
