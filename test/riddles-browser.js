// Synthetic browser journeys; no family records, physical-device, or learning-effect claims.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES}=await load('progress-transfer.mjs'),{riddles}=await load('riddles-content.mjs');
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.RIDDLES_TEST_URL||'http://127.0.0.1:8000/',artifacts=process.env.RIDDLES_ARTIFACTS,contexts=[],errors=[];let count=0;
 const ok=(v,m)=>{assert.ok(v,m);count++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;};
 if(artifacts)await fs.mkdir(artifacts,{recursive:true});
 const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
 async function setup(seed=fresh(),width=390,height=844,route='#riddles'){
  const c=await browser.newContext({viewport:{width,height},hasTouch:true,acceptDownloads:true});contexts.push(c);
  await c.addInitScript(seed=>{if(!localStorage.getItem('synthetic-riddles-seed')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('synthetic-riddles-seed','1');}Math.random=()=>0.42;},seed);
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(new URL(route,origin).href);await p.locator('[data-riddle-root]').waitFor();return p;
 }
 const state=p=>p.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return r?JSON.parse(localStorage.getItem(`number-garden-v1:${r.activeId}`)):null;});
 const tap=(p,s)=>p.locator(s).first().tap();
 const visit=(p,route)=>p.goto(new URL(route,origin).href);
 const shot=async(p,name)=>{if(artifacts)await p.screenshot({path:path.join(artifacts,name),fullPage:true});};
 const geometry=async(p,label)=>{ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' no horizontal overflow');ok(await p.locator('[data-riddle-root] button:visible,[data-riddle-root] a:visible,[data-riddle-root] summary:visible').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),label+' visible targets >=44px');};
 async function downloaded(p){await visit(p,'#notes');const [d]=await Promise.all([p.waitForEvent('download'),tap(p,'#download')]);const raw=await fs.readFile(await d.path(),'utf8');ok(prepareProgressImport(raw).ok,'actual downloaded notebook is importable');return raw;}
 try{
  for(const [width,height] of [[390,844],[820,1180]]){
   const p=await setup(fresh(),width,height);eq(Object.hasOwn(await state(p),'riddles'),false,'view allocates no riddle root');
   await geometry(p,`${width} invitation`);await shot(p,`riddles-${width}-empty.png`);
   await tap(p,'[data-riddle-size="sprout"]');eq(await p.evaluate(()=>document.activeElement.dataset.riddleSize),'sprout','size action restores focus');
   await p.locator('[data-riddle-next]').focus();await p.keyboard.press('Enter');eq(await p.evaluate(()=>document.activeElement.id),'riddle-prompt','pull focuses prompt');
   const first=(await state(p)).riddles.current,card=riddles.find(r=>r.id===first.id);eq(card.band,'sprout','chosen band supplies card');
   eq(first.source.prompt,card.prompt,'new card freezes its prompt');eq(first.source.choices,card.choices,'new card freezes its choices');
   await geometry(p,`${width} card`);await shot(p,`riddles-${width}-card.png`);
   const wrong=first.order.find(x=>x!==first.source.answer);await tap(p,`[data-riddle-choice="${wrong}"]`);
   eq(await p.evaluate(()=>document.activeElement.id),'riddle-nudge','miss focuses own nudge');ok(await p.locator(`[data-riddle-choice="${wrong}"]`).isDisabled(),'tried choice disabled');
   await tap(p,'[data-riddle-clue]');ok(await p.locator('.riddle-clue').isVisible(),'clue opens');
   await p.reload();eq((await state(p)).riddles.current.order,first.order,'reload keeps saved order');
   await tap(p,`[data-riddle-choice="${first.source.answer}"]`);eq(await p.evaluate(()=>document.activeElement.id),'riddle-result-title','fit focuses result');
   eq((await state(p)).riddles.log.length,0,'completed current is counted before log transition');
   await geometry(p,`${width} result`);await shot(p,`riddles-${width}-solved.png`);
   await tap(p,'[data-riddle-next]');eq((await state(p)).riddles.log[0].source,first.source,'Next logs exactly the earlier own source');
   await visit(p,'#notes');await p.getByText('Riddles in the Hedge: cards and picks').click();
   ok((await p.locator('main').innerText()).includes('Found after Dot’s clue: 1'),'notes count completed round after log move');
   const raw=await downloaded(p);eq(prepareProgressImport(raw).state.riddles,(await state(p)).riddles,'actual export retains frozen riddle');
   await p.locator('#progress-file').setInputFiles({name:'synthetic-riddles-notes.json',mimeType:'application/json',buffer:Buffer.from(raw)});
   await p.locator('#progress-import-confirm').waitFor();await tap(p,'#progress-import-confirm');
   eq((await state(p)).riddles,prepareProgressImport(raw).state.riddles,'actual file import keeps source and rounds');
   await visit(p,'#riddles');await p.locator('[data-riddle-root]').waitFor();await geometry(p,`${width} imported card`);await p.close();
  }

  // An earlier codes-only current is unavailable, and a canceled or used confirmation cannot replace it.
  const old=fresh();old.riddles={version:1,size:'any',met:[{future:'met'}],current:{id:'rain',order:['rain','sand','leaf'],picks:[],clue:false,outcome:null},log:[{id:'rain',tries:1,clue:false,outcome:'solved'},{future:'log'}]};
  const recovery=await setup(old);ok((await recovery.locator('[data-riddle-root]').innerText()).includes('earlier riddle card is unavailable'),'legacy current does not borrow current catalog');
  await recovery.locator('[data-riddle-recover] summary').click();await tap(recovery,'[data-riddle-cancel-recover]');eq((await state(recovery)).riddles,old.riddles,'cancel leaves raw current intact');
  await recovery.locator('[data-riddle-recover] summary').click();
  await recovery.evaluate(()=>window.__oldConfirm=document.querySelector('[data-riddle-confirm-recover]'));
  await tap(recovery,'[data-riddle-confirm-recover]');
  const retained=(await state(recovery)).riddles;eq(retained.retainedRawCurrent[0],old.riddles.current,'confirmed replacement retains whole earlier current');
  eq(retained.log,old.riddles.log,'mixed legacy/raw log remains in order');eq(retained.met[0],old.riddles.met[0],'raw met stays');
  await recovery.evaluate(()=>window.__oldConfirm.click());eq((await state(recovery)).riddles,retained,'used and detached confirmation cannot replace again');
  await visit(recovery,'#notes');const recoveredRaw=await downloaded(recovery);eq(prepareProgressImport(recoveredRaw).state.riddles,retained,'actual download preserves raw siblings');await recovery.close();

  // Detached controls cannot mutate after a new card, route change, or explorer switch.
  const stale=await setup();await tap(stale,'[data-riddle-next]');await stale.evaluate(()=>window.__oldPick=document.querySelector('[data-riddle-choice]'));
  await tap(stale,'[data-riddle-put-back]');const afterNext=(await state(stale)).riddles;
  await stale.evaluate(()=>window.__oldPick.click());eq((await state(stale)).riddles,afterNext,'detached old choice cannot affect new current');
  await stale.evaluate(()=>window.__routePick=document.querySelector('[data-riddle-choice]'));
  await visit(stale,'#home');await stale.evaluate(()=>window.__routePick.click());eq((await state(stale)).riddles,afterNext,'control from departed route is inert');
  await visit(stale,'#riddles');await stale.evaluate(()=>window.__explorerPick=document.querySelector('[data-riddle-choice]'));
  await tap(stale,'#explorer-switch');await stale.evaluate(()=>window.__explorerPick.click());eq((await state(stale)).riddles,afterNext,'explorer picker invalidates prior control');await stale.close();

  // Import a near-cap real report, then refuse a pick without losing the root or raw padding.
  const near=fresh(),first=riddles[0],source={id:first.id,prompt:first.prompt,answer:first.answer,choices:first.choices,clue:first.clue,why:first.why,place:{href:'#science',label:'Visit the Water Lab'}};
  near.riddles={version:1,size:'any',met:[first.id],current:{id:first.id,source,order:first.choices.map(x=>x.code),picks:[],clue:false,outcome:null},log:[]};
  near.syntheticPadding='x'.repeat(5_000_000);
  const fakeReport=s=>JSON.stringify({title:'After the Storm: observations',exportedAt:new Date().toISOString(),note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Try another garden activity.'},...s},null,2);
  while(!prepareProgressImport(fakeReport(near)).ok)near.syntheticPadding=near.syntheticPadding.slice(0,-1024);
  near.syntheticPadding+='x'.repeat(Math.max(0,MAX_IMPORT_BYTES-new TextEncoder().encode(fakeReport(near)).length-300));
  const nearPage=await setup();await visit(nearPage,'#notes');await nearPage.locator('#remember').uncheck();
  await nearPage.locator('#progress-file').setInputFiles({name:'synthetic-near-limit.json',mimeType:'application/json',buffer:Buffer.from(fakeReport(near))});
  await nearPage.locator('#progress-import-confirm').waitFor();await tap(nearPage,'#progress-import-confirm');
  ok((await nearPage.locator('#progress-import-status').innerText()).includes('separate explorer'),'save-off near-limit import succeeds in memory');
  await nearPage.evaluate(()=>location.hash='#riddles');await nearPage.locator('[data-riddle-root]').waitFor();
  ok(await nearPage.locator('[data-riddle-choice]').count()>0,'near-limit import remains live in save-off memory');
  await nearPage.evaluate(()=>location.hash='#notes');const [beforeDownload]=await Promise.all([nearPage.waitForEvent('download'),tap(nearPage,'#download')]);
  const beforeRaw=await fs.readFile(await beforeDownload.path(),'utf8'),beforeNear=prepareProgressImport(beforeRaw).state;
  ok(!!beforeNear,'the actual pre-action report is importable');
  await nearPage.evaluate(()=>location.hash='#riddles');await tap(nearPage,'[data-riddle-put-back]');
  ok((await nearPage.locator('#riddle-status').innerText()).includes('Download notes'),'refusal gives actionable export path');
  eq(await nearPage.evaluate(()=>document.activeElement.id),'riddle-status','refusal focuses notice');
  await nearPage.evaluate(()=>location.hash='#notes');const [afterDownload]=await Promise.all([nearPage.waitForEvent('download'),tap(nearPage,'#download')]);
  const afterRaw=await fs.readFile(await afterDownload.path(),'utf8');eq(prepareProgressImport(afterRaw).state.riddles,beforeNear.riddles,'refused work and raw siblings remain exportable');await nearPage.close();
  eq(errors,[],'no browser page errors');console.log(`Riddles in the Hedge browser: ${count} assertions passed.`);
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
