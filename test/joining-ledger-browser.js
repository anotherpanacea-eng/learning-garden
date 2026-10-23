// Synthetic optional written-addition journey, including the actual app and notes file.
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
 const {freshState,recommendations}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES}=await load('progress-transfer.mjs');
 const {startJoiningOrder}=await load('joining-orders-core.mjs');
 const {generatedBroad}=await load('broad-variants.mjs'),{itemById}=await load('broad-core.mjs');
 const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
 const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-22T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
 const bytes=s=>Buffer.byteLength(JSON.stringify(report(s),null,2));
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.LEDGER_TEST_URL||'http://127.0.0.1:8000/',artifacts=process.env.LEDGER_ARTIFACTS,contexts=[],errors=[];let count=0;
 const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(v,m)=>{assert.ok(v,m);count++;};
 if(artifacts)await fs.mkdir(artifacts,{recursive:true});
 async function setup(seed=fresh(),width=320,height=800){
  const c=await browser.newContext({viewport:{width,height},hasTouch:true,acceptDownloads:true});contexts.push(c);
  await c.addInitScript(seed=>{
   if(!localStorage.getItem('synthetic-ledger-seed')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('synthetic-ledger-seed','1');}
   window.__utterances=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{name:'Synthetic local English',voiceURI:'synthetic-en',lang:'en-US',localService:true,default:true}],cancel(){},addEventListener(){},removeEventListener(){},speak(u){window.__utterances.push(u);}}});
  },seed);
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(new URL('#numbers/join/ledger',origin).href);try{await p.locator('[data-ledger-root]').waitFor({timeout:10000});}catch(e){console.error('SETUP',errors,await p.locator('main').innerText());throw e;}return p;
 }
 const state=p=>p.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return r?JSON.parse(localStorage.getItem('number-garden-v1:'+r.activeId)):null;});
 const go=async(p,hash)=>{await p.goto(new URL(hash,origin).href);await p.locator('main').waitFor();};
 const tap=(p,s)=>p.locator(s).first().tap(),act=(p,a)=>tap(p,'[data-ledger-action="'+a+'"]');
 async function picture(p,total){eq(await p.locator('[data-ledger-pane] .ledger-mark').count(),total,'exactly one countable picture shows every counter');eq(await p.locator('[data-ledger-pane] .ledger-pip').count(),24,'Pip keeps all 24 constituent marks');eq(await p.locator('[data-ledger-pane] .ledger-dot').count(),total-24,'Dot keeps every original constituent mark');ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');ok(await p.locator('[data-ledger-root] button:visible:not([disabled])').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),'enabled buttons have 44px targets');}
 async function snapshot(p,name){if(artifacts){await p.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});await p.screenshot({path:path.join(artifacts,name+'.png'),fullPage:true});}}
 async function download(p){await go(p,'#notes');const [d]=await Promise.all([p.waitForEvent('download'),tap(p,'#download')]);const raw=await fs.readFile(await d.path(),'utf8');ok(prepareProgressImport(raw).ok,'actual downloaded pretty report imports');return raw;}
 async function importFile(p,seed){
  await go(p,'#notes');await p.locator('#remember').uncheck();
  const raw=JSON.stringify(report(seed),null,2);ok(prepareProgressImport(raw).ok,'synthetic near-cap source file imports');
  await p.locator('#progress-file').setInputFiles({name:'synthetic-ledger-boundary.json',mimeType:'application/json',buffer:Buffer.from(raw)});
  await p.locator('#progress-import-confirm').waitFor();await tap(p,'#progress-import-confirm');
  await p.getByText('Notebook brought into a separate explorer',{exact:false}).first().waitFor();
 }
 try{
  for(const [width,height] of [[320,800],[820,1080]])for(const [id,total,dot] of [['steady-orders',37,13],['full-frame-orders',41,17]]){
   const p=await setup(fresh(),width,height);
   eq((await state(p)).joiningOrders,undefined,'numeric chooser allocates no Join root');ok(!(await p.locator('[data-ledger-root]').innerText()).includes('Pip: 24 counters'),'chooser has no source decomposition');
   await tap(p,'[data-ledger-start="'+id+'"]');await p.locator('#ledger-picture-title').waitFor();
   eq((await state(p)).joiningOrders.shownBundleExamples,['bundle:0:2:4','bundle:0:1:'+(dot-10)],'new Start records only shown operands');
   const saved=(await state(p)).joiningOrders.cases[id];
   await picture(p,total);
   await tap(p,'[data-ledger-turn="write"]');
   eq(await p.locator('.ledger-result .ledger-empty').count(),2,'Write is open immediately with both cells blank');
   ok(await p.locator('[data-ledger-action="place-ones"]').isDisabled(),'separate picture cannot place a result digit');
   await tap(p,'[data-ledger-turn="picture"]');
   await p.evaluate(()=>{window.__oldLedgerControl=document.querySelector('[data-ledger-action="join"]');});
   await act(p,'join');await picture(p,total);eq((await state(p)).joiningOrders.cases[id],saved,'transient grouping does not change old Join work');
   await p.evaluate(()=>window.__oldLedgerControl.click());
   eq(await p.locator('[data-ledger-action="separate"]').count(),1,'detached old control cannot change the current picture');
   await tap(p,'[data-ledger-turn="write"]');await picture(p,total);await snapshot(p,id+'-'+width+'-joined');
   if(id==='full-frame-orders')ok(await p.locator('[data-ledger-action="place-ones"]').isDisabled(),'11 is never a ones digit');
   await tap(p,'[data-ledger-turn="picture"]');
   if(id==='full-frame-orders'){
    await act(p,'wrap');await picture(p,total);
    ok(await p.locator('[data-ledger-action="separate"]').isDisabled(),'wrapped ten must unwrap before Separate');
    await act(p,'unwrap');await act(p,'wrap');
   }
   await tap(p,'[data-ledger-turn="write"]');await p.locator('#ledger-write-title').waitFor();await picture(p,total);
   eq(await p.locator('[data-ledger-turn="write"]').getAttribute('aria-current'),'page','Write remains the open turn');
   await snapshot(p,id+'-'+width+'-grouped');
   await act(p,'place-ones');await picture(p,total);eq(await p.locator('[data-ledger-turn="write"]').getAttribute('aria-current'),'page','digit action retains Write');
   await snapshot(p,id+'-'+width+'-ones');
   await act(p,'place-tens');await picture(p,total);
   const columns=await p.locator('.ledger-table tbody tr').evaluateAll(rows=>rows.map(r=>Array.from(r.querySelectorAll('td')).map(c=>Math.round(c.getBoundingClientRect().x))));
   eq(columns[0],columns[1],'operand digits share the same two columns');eq(columns[1],columns[2],'result digits remain in those two columns');
   ok((await p.locator('.ledger-table').innerText()).includes(''+(total===37?'3':'4')),'aligned result is visible');
   ok((await state(p)).joiningOrders.shownBundleExamples.includes(total===37?'bundle:0:3:7':'bundle:0:4:1'),'final shown grouping recorded');
   eq((await state(p)).joiningOrders.cases[id],saved,'ledger never changes saved model, checks or Keep');
   if(artifacts){await p.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});await p.screenshot({path:path.join(artifacts,id+'-'+width+'.png'),fullPage:true});}
   await p.locator('[data-ledger-action="lift-tens"]').focus();await p.keyboard.press('Enter');
   eq(await p.locator('.ledger-result').innerText().then(x=>x.includes('□')),true,'keyboard lift is reversible');
   await act(p,'place-tens');
   await p.locator('details > summary').first().click();ok(await p.locator('details > p').first().innerText(),'original request reachable');
   await tap(p,'[data-ledger-root] [data-speak]');ok(await p.evaluate(()=>window.__utterances.length>0),'Hear requests only local browser speech');
   await tap(p,'[data-ledger-turn="picture"]');eq((await state(p)).joiningOrders.cases[id],saved,'turn switch never advances old Join model');
   await tap(p,'[data-ledger-turn="write"]');ok((await p.locator('.ledger-table').innerText()).includes(total===37?'3':'4'),'writing stays in the same transient state');
   await go(p,'#numbers/join');await p.locator('[data-join-total]').waitFor();
   eq((await state(p)).joiningOrders.cases[id],saved,'return to Join retains exact prior model/raw/history/Keep/support');
   await tap(p,'a[href="#numbers/join/ledger"]');await p.locator('#ledger-picture-title').waitFor();
   eq(await p.locator('[data-ledger-action="join"]').count(),1,'route revisit starts a fresh separate picture');
   const raw=await download(p);eq(prepareProgressImport(raw).state.joiningOrders,(await state(p)).joiningOrders,'actual download retains exact shown signatures');
   await p.locator('#progress-file').setInputFiles({name:'synthetic-ledger.json',mimeType:'application/json',buffer:Buffer.from(raw)});
   await p.locator('#progress-import-confirm').waitFor();await tap(p,'#progress-import-confirm');
   await p.getByText('Notebook brought into a separate explorer',{exact:false}).first().waitFor();
   await go(p,'#numbers/join/ledger');await p.locator('#ledger-picture-title').waitFor();
   eq(await p.locator('[data-ledger-action="join"]').count(),1,'imported result exposure survives, transient grouping restarts');
   await p.close();
  }
  const waiting=fresh(),q=generatedBroad(itemById('number-foundation'),'probe:35');
  waiting.broad.drafts['checkin:number-foundation']={question:q,attempts:[2],input:'2',familiar:false};
  const wait=await setup(waiting);await go(wait,'#checkin/number');
  await wait.locator('.activity').waitFor();
  await go(wait,'#numbers/join/ledger');
  await tap(wait,'[data-ledger-start="steady-orders"]');await go(wait,'#checkin/number');
  const savedDraft=(await state(wait)).broad.drafts['checkin:number-foundation'];eq(savedDraft.familiar,true,'matching paused generated draft becomes familiar after return');eq(savedDraft.attempts,[2],'saved response is unchanged');eq(savedDraft.input,'2');await wait.close();
  for(const raw of [{version:99,original:'kept'},null]){
   const s=fresh();s.joiningOrders=raw;const p=await setup(s);eq((await state(p)).joiningOrders,raw,'malformed root remains raw');ok((await p.locator('[data-ledger-root]').innerText()).includes('unfamiliar format'),'recovery follows old Join path');await p.close();
  }
  {
   const s=fresh();s.syntheticPadding='';const before=bytes(s);
   s.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-before-300);
   const p=await setup();await importFile(p,s);await go(p,'#numbers/join/ledger');
   ok(await p.locator('[data-ledger-start="steady-orders"]').isVisible(),'near-cap direct entry stays numeric-only');
   await tap(p,'[data-ledger-start="steady-orders"]');
   ok(await p.locator('[data-ledger-start="steady-orders"]').isVisible(),'refused Start keeps chooser visible');
   ok((await p.locator('#ledger-notice').innerText()).includes('Download notes'),'Start refusal gives actionable notice');
   eq(await p.evaluate(()=>document.activeElement?.id),'ledger-notice','Start refusal focuses notice');
   const raw=await download(p),restored=prepareProgressImport(raw).state;
   eq(restored.joiningOrders,undefined,'refused original still downloads without a Join root');
   eq(restored.syntheticPadding,s.syntheticPadding,'refused Start keeps unknown sibling exactly');
   await p.close();
  }
  {
   const s=fresh();startJoiningOrder(s,'full-frame-orders');s.joiningOrders.shownBundleExamples=['bundle:0:2:4','bundle:0:1:7'];s.syntheticPadding='';
   const before=bytes(s);s.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-before-5);
   const p=await setup();await importFile(p,s);await go(p,'#numbers/join/ledger');await p.locator('#ledger-picture-title').waitFor();
   await act(p,'join');await act(p,'wrap');await tap(p,'[data-ledger-turn="write"]');await act(p,'place-ones');
   await tap(p,'[data-ledger-action="place-tens"]');
   ok((await p.locator('.ledger-result').innerText()).includes('□'),'refused final result leaves tens cell blank');
   eq(await p.locator('[data-ledger-turn="write"]').getAttribute('aria-current'),'page','refusal retains Write turn');
   eq(await p.evaluate(()=>document.activeElement?.id),'ledger-notice','final-result refusal focuses notice');
   const restored=prepareProgressImport(await download(p)).state;
   eq(restored.joiningOrders.shownBundleExamples,s.joiningOrders.shownBundleExamples,'refused final result records no new signature');
   eq(restored.syntheticPadding,s.syntheticPadding,'capacity failure keeps unrelated raw sibling');
   await p.close();
  }
  {
   const s=fresh();startJoiningOrder(s,'steady-orders');s.syntheticPadding='';
   const before=bytes(s);s.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-before-5);
   const oldRoot=structuredClone(s.joiningOrders),p=await setup();await importFile(p,s);await go(p,'#numbers/join/ledger');
   await p.locator('#ledger-notice').waitFor();
   ok((await p.locator('#ledger-notice').innerText()).includes('Download notes'),'source display refusal is actionable');
   eq(await p.evaluate(()=>document.activeElement?.id),'ledger-notice','source display refusal focuses notice');
   eq(await p.locator('.ledger-mark').count(),0,'new complete operands stay hidden on refusal');
   eq(prepareProgressImport(await download(p)).state.joiningOrders,oldRoot,'refused source display preserves old root');
   await p.close();
  }
  {
   const p=await setup();await go(p,'#notes');await p.locator('#remember').uncheck();await go(p,'#numbers/join/ledger');
   await tap(p,'[data-ledger-start="full-frame-orders"]');await act(p,'join');await act(p,'wrap');await tap(p,'[data-ledger-turn="write"]');await act(p,'place-ones');await act(p,'place-tens');
   const restored=prepareProgressImport(await download(p)).state;
   ok(restored.joiningOrders.shownBundleExamples.includes('bundle:0:4:1'),'save-off retains successful exposure in actual in-memory notes');
   eq(await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:'))),[],'save-off ledger writes no persistent explorer notebook');await p.close();
  }
  {
   const s=fresh();startJoiningOrder(s,'full-frame-orders');const p=await setup(s);
   const requested=()=>p.evaluate(()=>window.__utterances.length);
   await p.evaluate(()=>{window.__oldLedgerHear=document.querySelector('[data-ledger-root] [data-speak]');});
   await tap(p,'[data-ledger-root] [data-speak]');eq(await requested(),1,'current separate Hear requests its visible caption');
   await act(p,'join');await p.evaluate(()=>window.__oldLedgerHear.click());
   eq(await requested(),1,'detached earlier-stage Hear cannot request an obsolete caption');
   await tap(p,'[data-ledger-root] [data-speak]');eq(await requested(),2,'current joined Hear still requests speech');
   await p.evaluate(()=>{window.__routeLedgerHear=document.querySelector('[data-ledger-root] [data-speak]');});
   await go(p,'#notes');await p.evaluate(()=>window.__routeLedgerHear.click());
   eq(await requested(),2,'Hear retained after route departure cannot request speech');
   const other=fresh();startJoiningOrder(other,'steady-orders');await importFile(p,other);await go(p,'#numbers/join/ledger');
   await p.evaluate(()=>window.__routeLedgerHear.click());eq(await requested(),2,'old explorer Hear remains inactive after import switches explorer');
   await tap(p,'[data-ledger-root] [data-speak]');eq(await requested(),3,'current imported explorer Hear works');
   await p.evaluate(()=>{window.__explorerLedgerHear=document.querySelector('[data-ledger-root] [data-speak]');});
   await go(p,'#notes');await tap(p,'#notes-switch-explorer');await tap(p,'[data-select-explorer="explorer-1"]');await go(p,'#numbers/join/ledger');
   await p.evaluate(()=>window.__explorerLedgerHear.click());eq(await requested(),3,'Hear from the prior selected explorer cannot request speech');
   await tap(p,'[data-ledger-root] [data-speak]');eq(await requested(),4,'current selected explorer Hear still works');await p.close();
  }
  eq(errors,[],'no browser page errors');
  console.log('Joining ledger browser: '+count+' assertions passed.');
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
