// Synthetic pictured addition journeys; no learner or physical-device records.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport}=await load('progress-transfer.mjs');
 const {generatedBroad}=await load('broad-variants.mjs'),{itemById}=await load('broad-core.mjs'),{bundleQuestionExposure}=await load('bundle-broad-exposure.mjs');
 const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.JOIN_TEST_URL||'http://127.0.0.1:8000/',artifacts=process.env.JOIN_ARTIFACTS,contexts=[],errors=[];let count=0;
 const ok=(v,m)=>{assert.ok(v,m);count++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;};
 if(artifacts)await fs.mkdir(artifacts,{recursive:true});
 async function setup(seed=fresh(),width=390,height=844,voices=true){
  const c=await browser.newContext({viewport:{width,height},hasTouch:true,acceptDownloads:true});contexts.push(c);
  await c.addInitScript(({seed,voices})=>{
   if(!localStorage.getItem('synthetic-join-seed')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('synthetic-join-seed','1');}
   window.__utterances=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>voices?[{name:'Synthetic local English',voiceURI:'synthetic-en',lang:'en-US',localService:true,default:true}]:[],cancel(){},addEventListener(){},removeEventListener(){},speak(u){window.__utterances.push(u);}}});
  },{seed,voices});
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(new URL('#numbers/join',origin).href);await p.locator('[data-join-root]').waitFor();return p;
 }
 const go=async(p,route)=>{await p.goto(new URL(route,origin).href);await p.locator('main').waitFor();};
 const state=p=>p.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return r?JSON.parse(localStorage.getItem(`number-garden-v1:${r.activeId}`)):null;});
 const tap=(p,s)=>p.locator(s).first().tap(),action=(p,name)=>tap(p,`[data-join-action="${name}"]`);
 const current=async p=>{const r=(await state(p)).joiningOrders;return r.cases[r.currentCase];};
 const others=s=>Object.fromEntries(Object.entries(s).filter(([k])=>!['joiningOrders','garden','updatedAt'].includes(k)));
 async function art(p,dot){eq(await p.locator('[data-join-model] [data-join-counter][data-origin="pip"]').count(),24,'picture retains all24 Pip counters');eq(await p.locator('[data-join-model] [data-join-counter][data-origin="dot"]').count(),dot,'picture retains all Dot counters');ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no sideways overflow');}
 async function fillFrame(p,pip,dot){for(const [who,n] of [['pip',pip],['dot',dot]])for(let i=0;i<n;i++){const sel=`[data-join-action="move-${who}"]`;if(await p.locator(sel).isDisabled())break;await action(p,`move-${who}`);if(await p.locator(sel).isDisabled())eq(await p.evaluate(()=>document.activeElement.id),'join-model','disabled move retains focus at visible model');}}
 async function keep(p){await tap(p,'[data-join-keep]');eq(await p.evaluate(()=>document.activeElement.id),'join-kept-confirmation','Keep focuses visible confirmation');ok(await p.locator('#join-kept-confirmation').isVisible(),'kept confirmation is visible');}
 async function answer(p,value){await p.locator('[data-join-total]').fill(value);await tap(p,'[data-join-check]');}
 async function download(p){await go(p,'#notes');const [d]=await Promise.all([p.waitForEvent('download'),tap(p,'#download')]);const raw=await fs.readFile(await d.path(),'utf8');ok(prepareProgressImport(raw).ok,'actual notebook download parses');return raw;}
 let carrySeed;
 try{
  for(const [width,height] of [[390,844],[820,1180]])for(const [id,dot,total] of [['steady-orders',13,37],['full-frame-orders',17,41]]){
   const p=await setup(fresh(),width,height);eq((await state(p)).joiningOrders,undefined,'route view creates no joining root');
   await go(p,'#numbers');await tap(p,'a[href="#numbers/join"]');await p.locator(`[data-join-start="${id}"]`).waitFor();
   await p.locator(`[data-join-start="${id}"]`).focus();await p.keyboard.press('Enter');await p.locator('[data-join-total]').waitFor();
   const before=others(await state(p));await art(p,dot);eq((await current(p)).model.joined,false,'orders begin separate');
   ok(await p.locator('[data-join-root] button:visible').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),'visible buttons have44px touch height');
   await keep(p);eq((await current(p)).kept.raw,'','blank separate draft can be kept');
   await answer(p,'-2');eq((await current(p)).history.length,0,'invalid syntax creates no wrong-answer check');eq((await current(p)).raw,'-2','invalid raw draft retained');ok(await p.locator('[data-join-total]').getAttribute('aria-describedby'),'syntax error linked to input');
   await answer(p,'1');eq(await p.locator('#join-kept-confirmation').innerText(),'A copy is kept in Saved work. Later changes need another Keep.','kept notice does not claim edited raw total is kept');const wrong=(await current(p)).history[0];eq((await current(p)).history.length,1,'valid wrong number makes one check');
   ok(!(await p.locator('[data-join-root]').innerText()).includes(`24 + ${dot} = 1 `),'wrong draft never becomes false equation');
   await p.locator('[data-join-total]').focus();await p.evaluate(()=>{window.__joinInput=document.querySelector('[data-join-total]');window.__joinInput.setSelectionRange(0,0);});await p.keyboard.type('0');
   eq(await p.evaluate(()=>document.querySelector('[data-join-total]')===window.__joinInput),true,'typing retains input node');eq(await p.locator('[data-join-total]').evaluate(x=>x.selectionStart),1,'typing preserves caret');eq((await current(p)).history[0],wrong,'editing preserves earlier check');
   await answer(p,` 0${total} `);const checked=(await current(p)).history.at(-1);eq((await current(p)).raw,` 0${total} `,'raw leading zero and spaces retained');
   await action(p,'join');eq(await p.locator('#join-kept-confirmation').innerText(),'A copy is kept in Saved work. Later changes need another Keep.','regrouping does not claim the new draft was kept');await art(p,dot);eq((await current(p)).model.joined,true,'Join explicitly combines sources');eq((await current(p)).history.at(-1),checked,'joining leaves prior check immutable');
   await fillFrame(p,4,dot-10);await art(p,dot);let m=(await current(p)).model;
   if(id==='steady-orders'){
    eq(m.framePip+m.frameDot,7,'seven ones remain a partial frame');ok(await p.locator('[data-join-action="wrap"]').isDisabled(),'cannot wrap seven as ten');await action(p,'return-pip');eq((await current(p)).model.framePip,3,'return preserves selected origin');
   }else{
    // Filling eleven ones stops at ten; the unavailable eleventh move is disabled.
    eq(m.framePip+m.frameDot,10,'frame capacity is10');await action(p,'wrap');await art(p,dot);m=(await current(p)).model;eq(m.newTenPip+m.newTenDot,10,'new wrapped ten retains ten marks');eq(m.loosePip+m.looseDot,1,'one loose counter remains');
    const remaining=m.loosePip?'pip':'dot';await action(p,`move-${remaining}`);ok(await p.locator('[data-join-action="unwrap"]').isDisabled(),'occupied frame prevents unwrap');await action(p,`return-${remaining}`);await action(p,'unwrap');await art(p,dot);eq((await current(p)).model.framePip+(await current(p)).model.frameDot,10,'unwrap restores same full frame');await action(p,'wrap');
   }
   await keep(p);const kept=(await current(p)).kept;eq(kept.raw,` 0${total} `,'kept draft freezes exact raw input');
   await action(p,'reset');await art(p,dot);eq((await current(p)).model.joined,false,'reset separates original sources');eq((await current(p)).kept,kept,'working reset preserves kept version');eq((await current(p)).history.at(-1),checked,'working reset preserves historic check');
   const saved=(await state(p)).joiningOrders;await p.reload();await p.locator('[data-join-total]').waitFor();eq((await state(p)).joiningOrders,saved,'reload preserves complete draft and history');
   eq(others(await state(p)),before,'joining activity leaves other learning roots unchanged');
   if(artifacts)await p.screenshot({path:path.join(artifacts,`${id}-${width}.png`),fullPage:true});
   if(id==='full-frame-orders'&&width===390)carrySeed=await state(p);await p.close();
  }
  // Real host display qualifies a waiting exact bundle question, without answering it.
  const exposedSeed=fresh(),exposedQuestion=generatedBroad(itemById('number-foundation'),'probe:35');
  exposedSeed.broad.drafts['checkin:number-foundation']={question:exposedQuestion,attempts:[],familiar:false};
  const exposurePage=await setup(exposedSeed);const waitingBefore=(await state(exposurePage)).broad.drafts['checkin:number-foundation'];
  eq(waitingBefore.familiar,false,'numeric-only chooser does not expose bundle components');
  eq((await state(exposurePage)).joiningOrders,undefined,'chooser still creates no exposure root');
  await tap(exposurePage,'[data-join-start="steady-orders"]');const exposedState=await state(exposurePage),waitingAfter=exposedState.broad.drafts['checkin:number-foundation'];
  eq(exposedState.joiningOrders.shownBundleExamples,['bundle:0:2:4','bundle:0:1:3'],'actual source cards persist exact shown examples');
  eq(waitingAfter.familiar,true,'waiting matching generated question becomes familiar');
  eq(waitingAfter.question,waitingBefore.question,'exposure preserves frozen waiting question');eq(waitingAfter.attempts,[],'exposure fabricates no attempt');
  eq(exposedState.broad.observations,exposedSeed.broad.observations,'exposure fabricates no completed observation');
  eq(bundleQuestionExposure(exposedState,exposedQuestion).familiar,true,'a later exact generated question sees prior display');
  eq(bundleQuestionExposure(exposedState,{params:{type:'bundle',hundreds:0,tens:2,ones:5}}).familiar,false,'nearby unshown quantity remains unexposed');
  await exposurePage.reload();await exposurePage.locator('[data-join-total]').waitFor();eq((await state(exposurePage)).broad.drafts['checkin:number-foundation'].familiar,true,'display history survives reload');await exposurePage.close();
  const joinedSeed=fresh(),joiningCore=await load('joining-orders-core.mjs');joiningCore.startJoiningOrder(joinedSeed,'steady-orders');joiningCore.joinOrders(joinedSeed);
  joinedSeed.broad.drafts['checkin:number-foundation']={question:exposedQuestion,attempts:[],familiar:false};
  const joinedPage=await setup(joinedSeed);eq((await state(joinedPage)).joiningOrders.shownBundleExamples,[],'joined-only imported screen does not claim hidden source cards were displayed');
  eq((await state(joinedPage)).broad.drafts['checkin:number-foundation'].familiar,false,'hidden imported source decomposition does not qualify a waiting question');
  await action(joinedPage,'reset');eq((await state(joinedPage)).broad.drafts['checkin:number-foundation'].familiar,true,'reset exposes actual separate cards and qualifies the waiting question');await joinedPage.close();
  // Both possible mixed-origin wrapped tens, with their exact countable artwork.
  const p=await setup();await tap(p,'[data-join-start="full-frame-orders"]');await action(p,'join');await fillFrame(p,3,7);await action(p,'wrap');await art(p,17);eq([(await current(p)).model.newTenPip,(await current(p)).model.newTenDot],[3,7],'alternative full-ten mixture accepted');
  if(await p.locator('details.join-help:not([open]) > summary').count())await p.locator('details.join-help > summary').click();await tap(p,'[data-join-help]');eq(await p.evaluate(()=>document.activeElement.id),'join-help-content','help focuses revealed paragraph');await tap(p,'[data-join-example]');eq(await p.evaluate(()=>document.activeElement.id),'join-example-content','example focuses revealed paragraph');await tap(p,'[data-join-together]');ok(await p.locator('[data-join-together]').evaluate(x=>x===document.activeElement),'together retains local button focus');const supported=(await current(p)).support;ok(['help','example','together'].every(x=>supported.includes(x)),'help example and together remain separate support facts');
  await tap(p,'[data-join-root] [data-speak]');ok((await current(p)).support.includes('narrationRequested'),'Hear records request only');
  const beforePreview=structuredClone((await current(p)).support);await p.locator('.voice-settings > summary').click();await tap(p,'[data-preview-voice]');eq((await current(p)).support,beforePreview,'voice preview adds no learner support');
  await keep(p);const saved=(await state(p)).joiningOrders,raw=await download(p);eq(prepareProgressImport(raw).state.joiningOrders,saved,'actual export retains entire root');
  await p.locator('#progress-file').setInputFiles({name:'synthetic-joining.json',mimeType:'application/json',buffer:Buffer.from(raw)});await p.locator('#progress-import-confirm').waitFor();await tap(p,'#progress-import-confirm');await p.getByText('Notebook brought into a separate explorer.',{exact:false}).first().waitFor();eq((await state(p)).joiningOrders,saved,'actual file import retains work');
  await tap(p,'#reset');await tap(p,'#confirm-reset');if(await p.locator('[data-film-skip]').count())await tap(p,'[data-film-skip]');eq((await state(p)).joiningOrders,undefined,'reset clears active joining work');await go(p,'#notes');await tap(p,'#notes-switch-explorer');await tap(p,'[data-select-explorer="explorer-1"]');eq((await state(p)).joiningOrders,saved,'original explorer remains intact');
  await go(p,'#notes');await p.locator('#remember').uncheck();await go(p,'#numbers/join');await p.locator('[data-join-total]').fill('not yet');await keep(p);eq(await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:'))),[],'save-off writes no explorer notebook');ok(prepareProgressImport(await download(p)).state.joiningOrders,'save-off work remains in memory export');await p.close();
  const togetherOnly=await setup();await tap(togetherOnly,'[data-join-start="steady-orders"]');await togetherOnly.locator('.join-help > summary').click();await tap(togetherOnly,'[data-join-together]');ok(await togetherOnly.locator('.join-help').evaluate(x=>x.open),'together alone keeps help panel open');ok(await togetherOnly.locator('[data-join-together]').evaluate(x=>x===document.activeElement),'together alone retains focus');eq((await current(togetherOnly)).support,['picturedSource','together'],'together does not fabricate help or example');await action(togetherOnly,'join');await action(togetherOnly,'reset');eq(await togetherOnly.locator('#join-action-notice').innerText(),'The working grouping has been reset to two separate orders.','empty reset makes no invented total/check/kept claim');eq(await togetherOnly.evaluate(()=>document.activeElement.id),'join-action-notice','reset focuses explicit confirmation');await togetherOnly.close();
  const capped=await setup();await tap(capped,'[data-join-start="steady-orders"]');await answer(capped,'36');await keep(capped);const firstKeep=(await current(capped)).kept;for(let i=0;i<7;i++)await answer(capped,'37');ok((await capped.locator('[data-join-root]').innerText()).includes('oldest'),'cap notice visible before ninth check');await answer(capped,'37');eq((await current(capped)).history.length,8,'ninth check keeps bounded history');eq((await current(capped)).kept,firstKeep,'evicted check survives in frozen kept copy');await capped.close();
  for(const payload of [{version:9,cases:{earlier:{raw:'unreadable'}}},['future','root'],null]){
   const seed=fresh();seed.joiningOrders=payload;const recovery=await setup(seed);eq((await state(recovery)).joiningOrders,payload,'raw root preserved on entry');await tap(recovery,'[data-join-recover]');eq((await state(recovery)).joiningOrders.recovered,payload,'explicit recovery retains entire old root');eq(prepareProgressImport(await download(recovery)).state.joiningOrders.recovered,payload,'raw recovered root survives actual download');await recovery.close();
  }
  let boundary={version:99};const boundarySeed=fresh();
  for(;;){const next={version:99,earlier:boundary};if(!prepareProgressImport(JSON.stringify({...boundarySeed,joiningOrders:next})).ok)break;boundary=next;}
  boundarySeed.joiningOrders=boundary;const boundaryPage=await setup(boundarySeed);await tap(boundaryPage,'[data-join-recover]');
  eq((await state(boundaryPage)).joiningOrders,boundary,'actual recovery refusal retains accepted depth-boundary root');
  ok((await boundaryPage.locator('[data-join-recovery-notice]').innerText()).includes('original is unchanged'),'recovery refusal gives a readable next step');
  eq(prepareProgressImport(await download(boundaryPage)).state.joiningOrders,boundary,'refused original still round-trips through actual notes download');await boundaryPage.close();
  const old=structuredClone(carrySeed);old.joiningOrders.cases['full-frame-orders'].source.title='Earlier supplied order';old.joiningOrders.cases['full-frame-orders'].source.request='These earlier words belong to this saved pair.';const history=await setup(old);ok((await history.locator('[data-join-root]').innerText()).includes('These earlier words belong to this saved pair.'),'saved wording rendered independently of current catalog');await history.close();
  const silent=await setup(fresh(),390,844,false);await tap(silent,'[data-join-start="steady-orders"]');if(await silent.locator('details.join-help:not([open]) > summary').count())await silent.locator('details.join-help > summary').click();await tap(silent,'[data-join-root] [data-speak]');eq(await silent.evaluate(()=>window.__utterances.length),0,'no local voice means no speech');ok((await current(silent)).support.includes('narrationRequested'),'failed Hear stays accurately labeled as request');await answer(silent,'37');eq((await current(silent)).history.length,1,'unavailable voice never blocks pictured practice');await silent.close();
  eq(errors,[],'no browser page errors');console.log(`Joining Orders browser: ${count} assertions passed.`);
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
