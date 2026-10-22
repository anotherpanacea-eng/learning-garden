// Synthetic browser walks; no physical-device or learning-effectiveness claims.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport}=await load('progress-transfer.mjs'),{startWillowWalk}=await load('willow-path-core.mjs');
 const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.WILLOW_TEST_URL||'http://127.0.0.1:8000/',artifacts=process.env.WILLOW_ARTIFACTS,contexts=[],errors=[];let count=0;
 const ok=(v,m)=>{assert.ok(v,m);count++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;};
 if(artifacts)await fs.mkdir(artifacts,{recursive:true});
 async function setup(seed=fresh(),width=320,height=740,voices=true){
  const c=await browser.newContext({viewport:{width,height},hasTouch:true,acceptDownloads:true});contexts.push(c);
  await c.addInitScript(({seed,voices})=>{
   if(!localStorage.getItem('synthetic-willow-seed')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('synthetic-willow-seed','1');}
   window.__utterances=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>voices?[{name:'Synthetic local English',voiceURI:'synthetic-en',lang:'en-US',localService:true,default:true}]:[],cancel(){},addEventListener(){},removeEventListener(){},speak(u){window.__utterances.push(u);}}});
  },{seed,voices});
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(new URL('#numbers/path',origin).href);await p.locator('[data-willow-root]').waitFor();return p;
 }
 const go=async(p,route)=>{await p.goto(new URL(route,origin).href);await p.locator('main').waitFor();};
 const state=p=>p.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return r?JSON.parse(localStorage.getItem(`number-garden-v1:${r.activeId}`)):null;});
 const tap=(p,s)=>p.locator(s).first().tap();
 const walk=async p=>(await state(p)).willowPath.walk;
 const focus=p=>p.evaluate(()=>document.activeElement?.outerHTML);
 async function spin(p,n){await p.evaluate(n=>{Math.random=()=>n===1?0.1:0.9;},n);await tap(p,'[data-willow-spin]');eq((await walk(p)).spin.value,n,'spinner result stored');ok((await focus(p)).includes('data-willow-step'),'Spin moves keyboard focus to Step');}
 async function download(p){await go(p,'#notes');const [d]=await Promise.all([p.waitForEvent('download'),tap(p,'#download')]);const raw=await fs.readFile(await d.path(),'utf8');ok(prepareProgressImport(raw).ok,'actual notebook download parses');return raw;}
 const other=s=>Object.fromEntries(Object.entries(s).filter(([k])=>!['willowPath','garden','updatedAt'].includes(k)));
 try{
  for(const [width,height,mode] of [[320,740,'solo'],[820,1180,'two']]){
   const p=await setup(fresh(),width,height);eq((await state(p)).willowPath,undefined,'route view allocates no walk');ok(await p.locator('[data-willow-root] button:visible, [data-willow-root] summary:visible, [data-willow-root] label:visible, .willow-heading a:visible').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),'intro and mode choices have44px touch height');
   await p.locator('[data-willow-root] details summary').click();eq((await state(p)).willowPath,undefined,'help alone allocates no walk');
   await go(p,'#numbers');await tap(p,'a[href="#numbers/path"]');await p.locator('[data-willow-start]').waitFor();
   await p.locator(`input[name="willow-mode"][value="${mode}"]`).check();await p.locator('[data-willow-start]').focus();await p.keyboard.press('Enter');
   eq((await walk(p)).mode,mode,'chosen mode saved');const before=other(await state(p));
   const rects=await p.locator('[data-willow-stone]').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,font:parseFloat(getComputedStyle(x.querySelector('.willow-numeral')).fontSize)};}));
   eq(rects.length,10,'ten numbered stones');ok(rects.every(r=>r.y===rects[0].y),'one horizontal row');ok(rects.every(r=>Math.abs(r.w-rects[0].w)<1),'equal stone widths');ok(rects.every(r=>r.font>=16),'numerals remain at least 16px');
   ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no phone/tablet sideways overflow');ok(await p.locator('[data-willow-root] button:visible, [data-willow-root] summary:visible, [data-willow-root] label:visible, [data-willow-root] a:visible, .willow-heading a:visible').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),'touch buttons at least44px');
   const bridge=await p.locator('.willow-bridge').boundingBox(),stone=await p.locator('[data-willow-stone="10"]').boundingBox();ok(bridge.y>=stone.y+stone.height,'bridge label below numbered track');
   eq(await p.evaluate(()=>window.__utterances.length),0,'no automatic narration');
   let turns=0;
   while(!(await walk(p)).done){
    await spin(p,2);const original=await walk(p),token=original.turn;
    while((await walk(p)).spin){
     const w=await walk(p),expected=w.positions[w.turn]+1;eq(await p.locator('[data-willow-step]').innerText(),`Step to ${expected}`,'Step names actual destination');
     await tap(p,'[data-willow-step]');const after=await walk(p);eq(after.positions[token],expected,'each tap moves exactly one stone');
     if(after.spin)ok((await focus(p)).includes('data-willow-step'),'remaining step retains keyboard target');else if(!after.done)ok((await focus(p)).includes('data-willow-spin'),'turn completion focuses Spin');
     const events=after.source.events.filter(e=>Object.values(after.positions).includes(e.square));eq(await p.locator('[data-willow-event]').count(),events.length,'only occupied optional stories appear');
     if(events.length){const frozen=(await state(p)).willowPath;await p.locator(`[data-willow-event="${events[0].square}"] summary`).click();eq((await state(p)).willowPath,frozen,'opening event changes no saved walk');}
    }
    if(++turns>12)throw Error('walk failed to end');
   }
   eq((await walk(p)).positions,{leaf:10,lantern:10},'both tokens reach bridge');ok((await focus(p)).includes('willow-ending'),'ending receives focus');eq(await p.locator('[data-willow-spin]').count(),0,'finished walk has no spin');ok(!(await p.locator('[data-willow-live]').innerText()).includes('keeps walking'),'final arrival does not instruct an arrived token to continue');eq(await p.locator('#willow-ending:visible').count(),1,'one visible ending target');
   eq(other(await state(p)),before,'walk leaves learning and stock roots untouched');
   if(artifacts)await p.screenshot({path:path.join(artifacts,`ending-${width}.png`),fullPage:true});
   const ended=(await state(p)).willowPath;await tap(p,'[data-willow-new]');await tap(p,'[data-willow-cancel]');eq((await state(p)).willowPath,ended,'cancel preserves completed walk');
   await p.reload();await p.locator('#willow-ending').waitFor();eq((await state(p)).willowPath,ended,'reload keeps full saved source and ending');await p.close();
  }
  // One remaining stone discards an extra spinner step, preserving the other token.
  const seeded=fresh();startWillowWalk(seeded);Object.assign(seeded.willowPath.walk,{positions:{leaf:9,lantern:3},turn:'leaf'});
  const p=await setup(seeded);await p.locator('[data-willow-event="3"] summary').click();await tap(p,'[data-willow-event="3"] [data-speak]');eq(await p.evaluate(()=>window.__utterances.at(-1).text),seeded.willowPath.walk.source.events[0].body,'story Hear speaks exact frozen event');await spin(p,2);eq(await p.locator('[data-willow-live]').innerText(),'Leaf spun 2.','spin announces actual result once');await tap(p,'[data-willow-step]');eq((await walk(p)).positions,{leaf:10,lantern:3},'9+2 lands at10 with one tap');eq((await walk(p)).spin,null,'extra step discarded');eq((await walk(p)).turn,'lantern','unfinished token takes turn');eq(await p.locator('[data-willow-live]').innerText(),"Leaf 10. Leaf is at Willow Bridge. Lantern keeps walking. Lantern's turn.",'first arrival combines arrival and next turn');
  await spin(p,2);await tap(p,'[data-willow-step]');const mid=(await state(p)).willowPath;await p.reload();await p.locator('[data-willow-step]').waitFor();eq((await state(p)).willowPath,mid,'reload preserves remaining step');eq(await p.locator('[data-willow-step]').innerText(),'Step to 5','resume names actual remaining destination');
  await tap(p,'[data-willow-voice]');await p.reload();await p.locator('[data-willow-step]').waitFor();eq(await p.locator('[data-willow-voice]').getAttribute('aria-pressed'),'false','reload turns step voice off');await tap(p,'[data-willow-voice]');await tap(p,'[data-willow-step]');eq(await p.evaluate(()=>window.__utterances.at(-1).text),"Lantern 5. Lantern's turn.",'enabled local voice receives actual destination and next turn');eq(await p.locator('[data-willow-live]').innerText(),'','no duplicate live announcement when local voice accepts speech');
  await go(p,'#numbers');await go(p,'#numbers/path');eq(await p.locator('[data-willow-voice]').getAttribute('aria-pressed'),'false','leaving resets optional step voice');
  const saved=(await state(p)).willowPath,raw=await download(p);eq(prepareProgressImport(raw).state.willowPath,saved,'actual export preserves full walk');
  await p.locator('#progress-file').setInputFiles({name:'synthetic-willow.json',mimeType:'application/json',buffer:Buffer.from(raw)});await p.locator('#progress-import-confirm').waitFor();await tap(p,'#progress-import-confirm');await p.getByText('Notebook brought into a separate explorer.',{exact:false}).first().waitFor();eq((await state(p)).willowPath,saved,'actual import retains full source');
  await tap(p,'#reset');await tap(p,'#confirm-reset');if(await p.locator('[data-film-skip]').count())await tap(p,'[data-film-skip]');eq((await state(p)).willowPath,undefined,'reset removes active walk');
  await go(p,'#notes');await tap(p,'#notes-switch-explorer');await tap(p,'[data-select-explorer="explorer-1"]');eq((await state(p)).willowPath,saved,'original explorer remains intact');
  await go(p,'#notes');await p.locator('#remember').uncheck();await go(p,'#numbers/path');await spinMemory(p);eq(await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:'))),[],'save-off writes no explorer notebook');ok(prepareProgressImport(await download(p)).state.willowPath.walk.spin,'save-off movement remains in memory export');await p.close();
  async function spinMemory(p){await p.evaluate(()=>{Math.random=()=>0.1;});await tap(p,'[data-willow-spin]');}
  const old=fresh();startWillowWalk(old);old.willowPath.extra={preserve:true};old.willowPath.walk.source.id='retired-garden';old.willowPath.walk.source.text.title='The earlier path';old.willowPath.walk.source.text.tokenLeaf='Fern {square}';old.willowPath.walk.source.events=[{square:2,title:'Old window',body:'This supplied story belongs to this earlier walk.'}];old.willowPath.walk.positions={leaf:2,lantern:2};old.willowPath.walk.source.extra='retain';
  const history=await setup(old);eq(await history.locator('h1').innerText(),'The earlier path','old source title displayed');eq(await history.locator('[data-willow-event="2"]').count(),1,'saved event position independent of current catalog');
  const tokens=await history.locator('[data-willow-stone="2"] .willow-token').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));eq(tokens.length,2,'both shapes present on same stone');ok(tokens[1].y>=tokens[0].y+tokens[0].h,'tokens stack without overlap');
  await spin(history,1);ok((await history.locator('.willow-spin-result').innerText()).includes('Fern {square} spun 1.'),'token braces not recursively substituted');await history.reload();await history.locator('[data-willow-step]').waitFor();eq((await state(history)).willowPath.extra,{preserve:true},'root extra data remains');await history.close();
  for(const payload of [{version:9,retainedRaw:{earlier:'nested'},literal:'<img src=x onerror=alert(1)>'},'future raw root',(()=>{const s=fresh();startWillowWalk(s);s.willowPath.walk.source.squares=20;return s.willowPath;})()]){
   const seed=fresh();seed.willowPath=payload;const recovery=await setup(seed);eq(await recovery.locator('[data-willow-root] img').count(),0,'raw payload never injected as HTML');eq((await state(recovery)).willowPath,payload,'unsupported root retained on entry');ok(await recovery.locator('[data-willow-root] button:visible, [data-willow-root] a:visible').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),'recovery controls have44px touch height');
   await tap(recovery,'[data-willow-new]');ok(await recovery.locator('[data-willow-root] label:visible').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),'recovery mode choices have44px touch height');await tap(recovery,'[data-willow-cancel]');eq((await state(recovery)).willowPath,payload,'cancel leaves raw root exact');await tap(recovery,'[data-willow-new]');await tap(recovery,'[data-willow-confirm]');eq((await state(recovery)).willowPath.retainedRaw,payload,'explicit separate walk nests entire prior payload');
   eq(prepareProgressImport(await download(recovery)).state.willowPath.retainedRaw,payload,'actual export retains nested raw payload');await recovery.close();
  }
  const silent=await setup(fresh(),320,740,false);await tap(silent,'[data-willow-start]');await tap(silent,'[data-willow-voice]');await spin(silent,1);await tap(silent,'[data-willow-step]');eq(await silent.evaluate(()=>window.__utterances.length),0,'unavailable local voice does not block movement');ok((await silent.locator('[data-willow-live]').innerText()).includes('Leaf 1'),'screen-reader fallback announces move');await silent.close();
  eq(errors,[],'no browser page errors');console.log(`Willow Path browser: ${count} assertions passed.`);
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
