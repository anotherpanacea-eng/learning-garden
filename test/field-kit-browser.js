// Synthetic local browser journeys; no family records or physical-result claims.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport}=await load('progress-transfer.mjs');
 const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.FIELD_TEST_URL||'http://127.0.0.1:8000/',artifacts=process.env.FIELD_ARTIFACTS,contexts=[],errors=[];let count=0;
 const ok=(v,m)=>{assert.ok(v,m);count++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;};
 if(artifacts)await fs.mkdir(artifacts,{recursive:true});
 async function setup(seed=fresh(),width=390,height=844,route='#field',voices=true){
  const c=await browser.newContext({viewport:{width,height},hasTouch:true,acceptDownloads:true});contexts.push(c);
  await c.addInitScript(({seed,voices})=>{
   if(!localStorage.getItem('synthetic-field-seed')){localStorage.setItem('number-garden-v1',JSON.stringify(seed));localStorage.setItem('synthetic-field-seed','1');}
   window.__utterances=[];window.__cancelCalls=0;window.__printCalls=0;window.print=()=>{window.__printCalls++;};
   window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>voices?[{name:'Synthetic local English',voiceURI:'synthetic-en',lang:'en-US',localService:true,default:true}]:[],cancel(){window.__cancelCalls++;},addEventListener(){},removeEventListener(){},speak(u){window.__utterances.push(u);}}});
  },{seed,voices});
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(new URL(route,origin).href);await p.locator('[data-field-root]').waitFor();return p;
 }
 const go=async(p,route)=>{await p.goto(new URL(route,origin).href);await p.locator('main').waitFor();};
 const state=p=>p.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return r?JSON.parse(localStorage.getItem(`number-garden-v1:${r.activeId}`)):null;});
 const tap=(p,s)=>p.locator(s).first().tap();
 const after=async p=>{await tap(p,'[data-field-page="after"]');await p.locator('[data-field-outcome]').first().waitFor();};
 const outcome=async(p,which)=>{await after(p);await tap(p,`[data-field-outcome="${which}"]`);await p.locator('.field-selected [data-field-reply]').waitFor();return (await state(p)).fieldKit.entries.at(-1);};
 const hostRoots=s=>Object.fromEntries(['cafe','measuringRecipes','plants','rainPaths','livingExploration','letters','broad','practice','exposures'].filter(k=>k in s).map(k=>[k,s[k]]));
 async function download(p){await go(p,'#notes');await p.emulateMedia({media:'print'});ok(await p.getByRole('heading',{name:'Grown-up notes',exact:true}).isVisible(),'non-card notes remain visible when printing');await p.emulateMedia({media:'screen'});const [d]=await Promise.all([p.waitForEvent('download'),tap(p,'#download')]);const raw=await fs.readFile(await d.path(),'utf8');ok(prepareProgressImport(raw).ok,'actual downloaded notebook accepted by import');return raw;}
 const cards=[['jug','#cafe/recipes'],['cress','#living/plants'],['notice','#post/letters'],['weather','#science/rain'],['walk','#living']];
 try{
  const replies=new Set();
  for(const [width,height] of [[390,844],[820,1180]])for(const [id,host] of cards){
   const p=await setup(fresh(),width,height);await tap(p,`a[href="#field/${id}"]`);await p.locator('[data-field-card]').waitFor();
   const before=hostRoots(await state(p));eq((await state(p)).fieldKit,undefined,'card view creates no record');
   ok(await p.locator(`[data-field-root] a[href="${host}"]`).count()>0,'card links to its model game');
   ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'phone/tablet has no horizontal overflow');ok(await p.locator('[data-field-root] button:visible').evaluateAll(bs=>bs.every(b=>b.getBoundingClientRect().height>=44)),'visible card buttons meet touch height');
   await p.locator('[data-field-together]').focus();await p.keyboard.press('Enter');eq(await p.locator('[data-field-together]').getAttribute('aria-pressed'),'true','reading support visibly toggles');
   await tap(p,'[data-field-together]');eq(await p.locator('[data-field-together]').getAttribute('aria-pressed'),'false','accidental support can be undone');eq((await state(p)).fieldKit,undefined,'support alone creates no record');
   await tap(p,'[data-field-print]');eq(await p.evaluate(()=>window.__printCalls),1,'print button calls local browser print');eq((await state(p)).fieldKit,undefined,'print creates no record');
   await p.emulateMedia({media:'print'});
   for(const heading of ['What you need','Try it together','Stay safe','Picture and real world'])ok(await p.getByRole('heading',{name:heading,exact:true}).isVisible(),'print retains '+heading);
   const printed=await p.locator('[data-field-root]').innerText();ok(printed.includes('Draw or write on paper if you like.'),'print has paper drawing space');
   ok(await p.locator('[data-field-print]').isHidden(),'print hides interactive controls');
   if(artifacts&&width===820)await p.screenshot({path:path.join(artifacts,`${id}-print.png`),fullPage:true});await p.emulateMedia({media:'screen'});
   await p.reload();await p.locator('[data-field-card]').waitFor();eq((await state(p)).fieldKit,undefined,'reload remains allocation-free');
   for(const which of ['done','surprised','not-today']){
    const e=await outcome(p,which);eq(e.mission.id,id,'correct card frozen');eq(e.outcome,which,'adult outcome retained');eq(e.support,[],'fresh unassisted report has no inferred support');ok((await p.locator('.field-selected [data-field-reply]').innerText()).includes(e.response),'visible reply is frozen entry text');replies.add(e.response);
    eq(await p.locator('[data-field-outcome]:enabled').count(),0,'completed turn cannot add duplicate');
    eq(hostRoots(await state(p)),before,'offscreen report leaves host learning and stock unchanged');
    await tap(p,'[data-field-retry]');await p.locator('[data-field-page="after"]').waitFor();
   }
   const entries=(await state(p)).fieldKit.entries;eq(entries.length,3,'three explicit outcomes make three records');
   await p.reload();await p.locator('[data-field-card]').waitFor();eq((await state(p)).fieldKit.entries,entries,'reload retains exact frozen replies');
   await go(p,host);await p.locator(`a[href="#field/${id}"]`).first().waitFor();await tap(p,`a[href="#field/${id}"]`);await p.locator('[data-field-card]').waitFor();
   if(artifacts&&width===390)await p.screenshot({path:path.join(artifacts,`${id}-screen.png`),fullPage:true});await p.close();
  }
  eq(replies.size,15,'all fifteen distinct authored responses exercised');
  // Only a real local onstart callback marks narration; a request alone does not.
  const p=await setup(fresh(),390,844,'#field/jug');await tap(p,'[data-field-root] [data-speak]');eq((await state(p)).fieldKit,undefined,'speech request creates no record');
  const e1=await outcome(p,'not-today');eq(e1.support,[],'no onstart means no narration record');await tap(p,'[data-field-retry]');
  await tap(p,'[data-field-root] [data-speak]');await p.evaluate(()=>window.__utterances.at(-1).onstart?.());const cancels=await p.evaluate(()=>window.__cancelCalls);await tap(p,'[data-field-together]');eq(await p.evaluate(()=>window.__cancelCalls),cancels,'reading support toggle leaves playing narration alone');
  const e2=await outcome(p,'done');eq([...e2.support].sort(),['narration','read-together'],'actual start and together support copied independently');
  await tap(p,'[data-field-retry]');const e3=await outcome(p,'surprised');eq(e3.support,[],'replay resets pending support');
  const frozen=(await state(p)).fieldKit,raw=await download(p);eq(prepareProgressImport(raw).state.fieldKit,frozen,'frozen notebook survives actual export and parser');
  await p.locator('#progress-file').setInputFiles({name:'synthetic-field-notes.json',mimeType:'application/json',buffer:Buffer.from(raw)});await p.locator('#progress-import-confirm').waitFor();await tap(p,'#progress-import-confirm');await p.getByText('Notebook brought into a separate explorer.',{exact:false}).first().waitFor();eq((await state(p)).fieldKit,frozen,'actual file import preserves entries');
  await tap(p,'#reset');await tap(p,'#confirm-reset');if(await p.locator('[data-film-skip]').count())await tap(p,'[data-film-skip]');eq((await state(p)).fieldKit,undefined,'reset clears only active explorer field kit');
  await go(p,'#notes');await tap(p,'#notes-switch-explorer');await tap(p,'[data-select-explorer="explorer-1"]');eq((await state(p)).fieldKit,frozen,'other explorer retains original records after reset');
  await go(p,'#notes');await p.locator('#remember').uncheck();await go(p,'#field/weather');await outcomeMemory(p);eq(await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:'))),[],'save-off outcome writes no explorer save');
  const memoryRaw=await download(p);ok(prepareProgressImport(memoryRaw).state.fieldKit.entries.length===4,'save-off record remains available in memory export');await p.close();
  async function outcomeMemory(p){await after(p);await tap(p,'[data-field-outcome="not-today"]');await p.locator('.field-selected [data-field-reply]').waitFor();}
  const silent=await setup(fresh(),390,844,'#field/jug',false);await tap(silent,'[data-field-root] [data-speak]');const se=await outcome(silent,'done');eq(se.support,[],'unavailable voice never counts as narration');eq(await silent.evaluate(()=>window.__utterances.length),0,'no local voice means no speech call');await silent.close();
  const leave=await setup(fresh(),390,844,'#field/jug');await tap(leave,'[data-field-together]');await tap(leave,'[data-field-root] [data-speak]');await leave.evaluate(()=>{window.__lateStart=window.__utterances.at(-1).onstart;});await go(leave,'#home');await go(leave,'#field/jug');await leave.evaluate(()=>window.__lateStart?.());eq(await leave.locator('[data-field-together]').getAttribute('aria-pressed'),'false','leave and return clears pending reading support');
  await after(leave);await leave.evaluate(()=>{const b=document.querySelector('[data-field-outcome="done"]');b.click();b.click();});await leave.locator('.field-selected [data-field-reply]').waitFor();eq((await state(leave)).fieldKit.entries.length,1,'double activation of original control adds one entry');eq((await state(leave)).fieldKit.entries[0].support,[],'stale narration callback cannot mark return visit');
  await tap(leave,'[data-field-retry]');await tap(leave,'[data-field-root] [data-speak]');await tap(leave,'[data-stop-speech]');await leave.locator('.voice-settings > summary').click();await tap(leave,'[data-preview-voice]');await leave.evaluate(()=>window.__utterances.at(-1).onstart?.());const preview=await outcome(leave,'not-today');eq(preview.support,[],'voice preview is not card narration');
  await leave.emulateMedia({media:'print'});ok(await leave.getByRole('heading',{name:'Stay safe',exact:true}).isVisible(),'print from After includes hidden Before instructions');ok(await leave.locator('.field-selected').isHidden(),'print omits outcome history');await leave.emulateMedia({media:'screen'});await leave.close();
  // Retired cards, raw siblings, explicit cap and recovery remain accessible.
  const seed=fresh(),entry=i=>({id:i,mission:{id:'retired-card',version:3,title:`Earlier paper card ${i}`},outcome:'not-today',response:`Frozen supplied reply ${i}.`,support:[]});
  const rawSibling={id:100,mission:{future:true},literal:'<img src=x onerror=alert(1)>'};seed.fieldKit={version:1,entries:[entry(1),rawSibling,...Array.from({length:23},(_,i)=>entry(i+2))]};
  const history=await setup(seed);await history.emulateMedia({media:'print'});ok(await history.getByRole('heading',{name:'The Field Kit',exact:true}).isVisible(),'index still prints');await history.emulateMedia({media:'screen'});await history.locator('details').filter({has:history.locator('[data-field-entry="1"]')}).locator('summary').first().click();ok((await history.locator('[data-field-entry="1"]').innerText()).includes('Frozen supplied reply 1.'),'retired card reply readable from index');
  await go(history,'#field/unknown-card');await history.locator('[data-field-unknown]').waitFor();eq((await state(history)).fieldKit,seed.fieldKit,'unknown route changes no history');
  await go(history,'#field/jug');await after(history);ok((await history.locator('[data-field-root]').innerText()).includes('Earlier paper card 1'),'cap notice names exact removed frozen title');
  await tap(history,'[data-field-outcome="not-today"]');await history.locator('.field-selected [data-field-reply]').waitFor();const kept=(await state(history)).fieldKit;eq(kept.entries.length,25,'24 readable plus raw sibling retained');eq(kept.entries[0],rawSibling,'explicit append removes oldest readable only');eq(kept.entries.at(-1).id,101,'id allocation respects raw sibling');await history.close();
  const future=fresh();future.fieldKit={version:9,raw:'<img src=x onerror=alert(1)>',entries:[{id:8}]};const recovery=await setup(future,390,844,'#field/walk');eq(await recovery.locator('[data-field-root] img').count(),0,'raw future payload escaped');eq(await recovery.locator('[data-field-outcome]:enabled').count(),0,'unsupported root replaces outcome buttons');await tap(recovery,'[data-field-page="after"]');await tap(recovery,'[data-field-recover]');eq((await state(recovery)).fieldKit.recovered,future.fieldKit,'explicit recovery keeps exact earlier root');await outcome(recovery,'not-today');const restored=prepareProgressImport(await download(recovery));eq(restored.state.fieldKit.recovered,future.fieldKit,'raw recovered root survives actual export');await recovery.close();
  eq(errors,[],'no browser page errors');console.log(`Field Kit browser: ${count} assertions passed.`);
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
