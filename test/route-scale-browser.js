// Synthetic notebooks only. Exercise actual host callbacks and native Chrome controls.
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
 const {freshState,recommendations}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES}=await load('progress-transfer.mjs');
 const {initialScale,changeScale,scaleDisplayPairs,scaleReadouts,scaleNarration}=await load('route-scale.mjs'),{spoken}=await load('play-media.mjs');
 const {startPostOffice}=await load('post-office-core.mjs'),{deliveries}=await load('post-office-content.mjs'),{startAdaptiveRival,generateRivalTask}=await load('post-rival.mjs');
 const {generatedBroad}=await load('broad-variants.mjs'),{itemById}=await load('broad-core.mjs'),{startVisit}=await load('garden-core.mjs');
 const fresh=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
 const pending=()=>{const s=fresh(),q=generatedBroad(itemById('operations-anchor'),'scale-11');s.broad.drafts['activity:'+q.id]={attempts:[],question:q,input:'Synthetic waiting reply'};s.baseline.draft={questionId:'groups',attempts:[],input:'Synthetic waiting reply'};const v=startVisit(s,'message');v.drafts['message-markers']={attempts:[],input:'Synthetic story reply'};s.future={raw:{message:'Synthetic future data'}};s.cartographer={version:99,raw:'Synthetic old map'};return s;};
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw,browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.SCALE_TEST_URL||'http://127.0.0.1:4211/',art=process.env.SCALE_ARTIFACTS,contexts=[],errors=[];let n=0;
 const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
 if(art)await fs.mkdir(art,{recursive:true});
 async function setup(width,seed=pending(),instrument=true,startHash='#workshop/scale'){
  const c=await browser.newContext({viewport:{width,height:width===320?800:1080},hasTouch:true,acceptDownloads:true});contexts.push(c);
  await c.addInitScript(s=>{localStorage.setItem('number-garden-v1',JSON.stringify(s));window.__spoken=[];window.__cancels=0;window.__saves=0;window.__exposures=0;window.SpeechSynthesisUtterance=class{constructor(t){this.text=t;}};Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{name:'Synthetic English',voiceURI:'synthetic',lang:'en-US',localService:true,default:true}],cancel(){__cancels++;},addEventListener(){},removeEventListener(){},speak(u){__spoken.push(u.text);}}});},seed);
  if(instrument)await c.route('**/app.mjs',async r=>{const response=await r.fetch();let body=await response.text();body=body.replace('let graph=null;',`window.__read=()=>state;window.__redraw=()=>render();window.__replace=s=>{state=s;render();};window.__report=()=>notesReport(state);let graph=null;`).replace('function save(){','function save(){window.__saves++;').replace('function exposeStoryFacts(node,except,target=state,qualifyPendingBramble=false){','function exposeStoryFacts(node,except,target=state,qualifyPendingBramble=false){window.__exposures++;');await r.fulfill({response,body});});
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(origin+startHash);await p.locator(startHash==='#workshop/scale'?'.scale-page':startHash==='#workshop'?'.workshop-page':'.cart-page').waitFor().catch(async e=>{console.error(errors,await p.locator('body').innerText());throw e;});return p;
 }
 const go=async(p,hash)=>{await p.evaluate(h=>location.hash=h,hash);await p.waitForFunction(h=>location.hash===h,hash);await p.waitForTimeout(35);};
 const target=(a,k)=>`[data-scale-action="${a}"]${k?`[data-scale-value="${k}"]`:''}`;
 const text=s=>s.replaceAll('\u00a0',' ');
 async function show(p,v){
  eq(await p.locator('[data-scale-key]').evaluateAll(xs=>xs.map(x=>Number(x.dataset.scaleKey))),v.compare?[v.key,v.key===2?4:2]:[v.key],'correct shown map order');
  for(const k of v.compare?[v.key,v.key===2?4:2]:[v.key])eq((await p.locator(`[data-scale-key="${k}"] .scale-readouts p`).allTextContents()).map(text),scaleReadouts(k),'exact readouts');
  eq(await p.locator('.scale-sheet h2').allTextContents(),(v.compare?[v.key,v.key===2?4:2]:[v.key]).map(k=>`1 edge represents ${k}\u00a0m`),'actual figure heading keeps numeral/unit together');
  eq(await p.locator('.scale-key-controls button').evaluateAll(xs=>xs.map(x=>x.firstChild.textContent)),[2,4].map(k=>`${k}\u00a0m per edge`),'actual key buttons keep numeral/unit together');
  eq(await p.locator(target('undo')).isDisabled(),!v.undo);eq(await p.locator('[data-scale-action="key"][aria-pressed="true"]').getAttribute('data-scale-value'),String(v.key));
  ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');
  ok(await p.locator('.scale-page button,.scale-page a').evaluateAll(xs=>xs.every(x=>x.getBoundingClientRect().height>=44)),'native targets44px');
  ok(await p.locator('.scale-page p,.scale-page button,.scale-page a,.scale-page figcaption').evaluateAll(xs=>xs.every(x=>parseFloat(getComputedStyle(x).fontSize)>=16)),'body text16px');
 }
 async function edit(p,v,a,k){const next=changeScale(v,a,k),old=await p.evaluate(()=>JSON.stringify(__read()));await p.locator(target(a,k)).tap();if(next){await show(p,next);eq(await p.locator(a==='undo'?'#scale-title':target(a,k)).evaluate(x=>x===document.activeElement),true,'action focus retained');return next;}eq(await p.evaluate(()=>JSON.stringify(__read())),old,'no-op does not write');return v;}
 try{
 for(const width of [320,820]){
  const p=await setup(width);let v=initialScale();await show(p,v);
  ok(await p.evaluate(()=>__read().broad.drafts['activity:operations-anchor'].knownFact===true),'pending reversed Broad fact qualifies on default2');
  eq(await p.evaluate(()=>__read().garden.visits[0].drafts['message-markers'].knownFact),undefined,'nonmatching waiting Garden initially unchanged');
  const source=await p.locator('.scale-source').innerText();await p.evaluate(()=>window.__status=document.querySelector('#scale-status'));
  await p.evaluate(()=>window.__old=[...document.querySelectorAll('[data-scale-action],[data-scale-root] [data-speak]')]);
  v=await edit(p,v,'key',4);eq(await p.locator('#scale-status').evaluate(x=>x===__status),true,'polite status node survives action');ok(await p.evaluate(()=>__read().baseline.draft.exposed&&__read().garden.visits[0].drafts['message-markers'].knownFact),'4m qualifies matching baseline and waiting Garden');
  const before=await p.evaluate(()=>JSON.stringify(__read()));await p.evaluate(()=>__old.forEach(x=>x.click()));eq(await p.evaluate(()=>JSON.stringify(__read())),before,'detached controls inert');eq(await p.evaluate(()=>__spoken.length),0,'detached Hear inert');
  v=await edit(p,v,'compare');if(art){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(art,`compare-4-${width}.png`),fullPage:true});}
  v=await edit(p,v,'key',2);if(art){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(art,`compare-2-${width}.png`),fullPage:true});}
  const diagrams=await p.locator('.scale-sheet svg').evaluateAll(xs=>xs.map(x=>({width:x.getBoundingClientRect().width,route:x.querySelector('polyline').getAttribute('points')})));eq(diagrams[0].width,diagrams[1].width,'comparison uses equal pitch');
  const extents=await p.locator('.scale-sheet svg').evaluateAll(xs=>xs.map(svg=>{const p=[...svg.querySelector('polyline').points].map(p=>new DOMPoint(p.x,p.y).matrixTransform(svg.getScreenCTM()));return {w:Math.max(...p.map(p=>p.x))-Math.min(...p.map(p=>p.x)),h:Math.max(...p.map(p=>p.y))-Math.min(...p.map(p=>p.y))};}));ok(Math.abs(extents[0].w-2*extents[1].w)<.01&&Math.abs(extents[0].h-2*extents[1].h)<.01,'actual rendered route halves width and height');
  await p.locator(target('key',2)).focus();await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');
  const focus=await p.locator(target('key',2)).evaluate(x=>({visible:x.matches(':focus-visible'),color:getComputedStyle(x).outlineColor,offset:getComputedStyle(x).outlineOffset}));eq(focus,{visible:true,color:'rgb(154, 95, 20)',offset:'3px'},'selected control has distinct external keyboard focus');if(art){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(art,`focused-selected-${width}.png`),fullPage:true});}
  v=await edit(p,v,'key',2);await p.locator('.scale-page [data-speak]').click();eq(await p.evaluate(()=>__spoken.at(-1)),spoken(scaleNarration(v)),'Hear rebuilds current complete narration');
  await p.locator(target('key',2)).focus();const calls=await p.evaluate(()=>[__saves,__exposures]);await p.evaluate(()=>__redraw());await show(p,v);eq(await p.locator(target('key',2)).evaluate(x=>x===document.activeElement),true,'ordinary redraw preserves current key focus');eq(await p.evaluate(()=>[__saves,__exposures]),calls,'ordinary rerender preserves view undo and exposure counts');eq(await p.locator('.scale-source').innerText(),source,'source fixed');
  v=await edit(p,v,'undo');v=await edit(p,v,'compare');if(art){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(art,`single-4-${width}.png`),fullPage:true});}v=await edit(p,v,'key',2);if(art){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:path.join(art,`single-2-${width}.png`),fullPage:true});}
  // The exact displayed DOM must survive action and Hear failures, including a refused Undo.
  await p.evaluate(max=>{__read().raw='ü'.repeat(max);window.__keptFigure=document.querySelector('.scale-sheet');window.__keptBook=JSON.stringify(__read());window.__keptUndo=document.querySelector('[data-scale-action="undo"]').disabled;},MAX_IMPORT_BYTES);
  await p.locator(target('undo')).click();eq(await p.locator('.scale-sheet').evaluate(x=>x===__keptFigure),true,'refused Undo keeps actual picture node');eq(await p.evaluate(()=>JSON.stringify(__read())===__keptBook),true,'refused Undo preserves notebook');eq(await p.locator(target('undo')).isDisabled(),false,'refused Undo retains snapshot');
  const spokenCount=await p.evaluate(()=>__spoken.length);await p.locator('.scale-page [data-speak]').click();eq(await p.evaluate(()=>__spoken.length),spokenCount,'refused Hear speaks nothing');eq(await p.locator('.scale-sheet').evaluate(x=>x===__keptFigure),true,'Hear refusal preserves actual picture node');
  const count=await p.evaluate(()=>__exposures);await p.evaluate(()=>__redraw());ok(await p.locator('[data-scale-root]').count(),'ordinary rerender with full notebook keeps qualified picture');eq(await p.evaluate(()=>__exposures),count,'ordinary redraw does not retry entry preflight');await p.evaluate(()=>delete __read().raw);v=await edit(p,v,'undo');
  const previous=await p.evaluate(()=>JSON.stringify(__read()));await p.evaluate(()=>__replace(structuredClone(__read())));v=initialScale();await show(p,v);eq(await p.evaluate(()=>JSON.stringify(__read())),previous,'same-hash replacement starts fresh view without duplicate exposure');
  await p.evaluate(()=>window.__routeHear=document.querySelector('.scale-page [data-speak]'));await go(p,'#workshop/scale/other');ok(await p.locator('.workshop-page').count(),'nonexact route ordinary fallback');const len=await p.evaluate(()=>__spoken.length);await p.evaluate(()=>__routeHear.click());eq(await p.evaluate(()=>__spoken.length),len,'route-stale Hear inert');await go(p,'#workshop/scale');v=initialScale();await show(p,v);
  // Real notes download and import, then real explorer selection and reset.
  await go(p,'#notes');const [d]=await Promise.all([p.waitForEvent('download'),p.locator('#download').click()]);const raw=await fs.readFile(await d.path(),'utf8'),parsed=JSON.parse(raw);ok(prepareProgressImport(raw).ok,'actual pretty download imports');eq(parsed.future,{raw:{message:'Synthetic future data'}});eq(parsed.cartographer,{version:99,raw:'Synthetic old map'});ok(!Object.hasOwn(parsed,'routeScale'),'no saved scale root');
  await p.locator('#progress-file').setInputFiles({name:'synthetic-scale.json',mimeType:'application/json',buffer:Buffer.from(raw)});await p.locator('#progress-import-confirm').click();await p.getByText('Notebook brought into a separate explorer',{exact:false}).first().waitFor();await go(p,'#workshop/scale');await show(p,initialScale());
  await go(p,'#notes');await p.locator('#notes-switch-explorer').click();await p.locator('[data-select-explorer="explorer-1"]').click();await go(p,'#workshop/scale');await show(p,initialScale());await go(p,'#notes');await p.locator('#reset').click();await p.locator('#confirm-reset').click();if(await p.locator('[data-film-skip]').count())await p.locator('[data-film-skip]').click();await go(p,'#workshop/scale');await show(p,initialScale());
 }
 // The Workshop pill opens the existing scale scene and keeps a waiting delivery.
 for(const width of [320,820]){
  const s=pending();startPostOffice(s,deliveries[0].id);const p=await setup(width,s,true,'#workshop');
  const link=p.getByRole('link',{name:'Same route, different scale',exact:true});eq(await link.count(),1,'one direct Workshop scale invitation');
  const box=await link.boundingBox();ok(box&&box.width>=44&&box.height>=44,'Workshop scale link has a touch-sized target');
  ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Workshop pill bar wraps without overflow');
  const held=await p.evaluate(()=>({postOffice:__read().postOffice,cartographer:__read().cartographer,future:__read().future}));
  await link.tap();await p.locator('[data-scale-root]').waitFor();await show(p,initialScale());
  eq(await p.evaluate(()=>location.hash),'#workshop/scale','Workshop link reaches the existing scale route');
  eq(await p.evaluate(()=>({postOffice:__read().postOffice,cartographer:__read().cartographer,future:__read().future})),held,'scale navigation preserves the waiting delivery and retained map data');
 }
 // The invitation itself supplies no numerical pair and needs no readable old map.
 for(const old of [false,true]){const s=fresh();if(old)s.cartographer={version:99,raw:'Synthetic earlier map'};const p=await setup(320,s,true,'#workshop/maps');
  eq(await p.evaluate(()=>__exposures),0,'companion invitation alone exposes no pair');eq(await p.evaluate(()=>__saves),0,'companion invitation alone saves nothing');eq(await p.locator('.scale-entry a').innerText(),'Same route, different scale');
  await p.locator('.scale-entry a').click();await p.locator('[data-scale-root]').waitFor();await p.locator(target('key',4)).click();await p.goBack();await p.locator('.cart-page').waitFor();await p.goForward();await p.locator('[data-scale-root]').waitFor();await show(p,initialScale());eq(await p.evaluate(()=>__read().cartographer),s.cartographer,'back/reentry preserves missing or raw old map');
 }
 // Actual pretty-wrapper boundary with pending-flag-only growth, all seven facts already seen.
 {const p=await setup(320);await p.locator(target('compare')).click();await p.locator(target('compare')).click();
  const pendingBook=fresh(),pv=startPostOffice(pendingBook,deliveries[0].id);startAdaptiveRival(pendingBook);pv.rival.task=generateRivalTask('multiply',2,4,0);
  await p.evaluate(({postOffice,max})=>{__read().postOffice=postOffice;__read().padding='';const size=new TextEncoder().encode(JSON.stringify(__report(),null,2)).length;__read().padding='x'.repeat(max-size-1);window.__boundaryFigure=document.querySelector('.scale-sheet');window.__boundaryBook=JSON.stringify(__read());}, {postOffice:pendingBook.postOffice,max:MAX_IMPORT_BYTES});
  ok(await p.evaluate(async()=>{const m=await import('./progress-transfer.mjs');return m.prepareProgressImport(JSON.stringify(__report(),null,2)).ok;}),'actual app pretty report fits before flag-only addition');
  await p.locator(target('compare')).click();eq(await p.locator('.scale-sheet').evaluate(x=>x===__boundaryFigure),true,'flag-only refusal preserves actual picture node');eq(await p.evaluate(()=>JSON.stringify(__read())===__boundaryBook),true,'flag-only refusal preserves exact notebook');eq(await p.locator('[data-scale-key]').count(),1,'refused comparison stays closed');
  await p.evaluate(()=>{__read().padding=__read().padding.slice(0,-100);});await p.locator(target('compare')).click();eq(await p.locator('[data-scale-key]').count(),2,'same comparison succeeds with real room');ok(await p.evaluate(()=>__read().postOffice.visits.find(v=>v.id===__read().postOffice.current).rival.priorFactShown===true),'actual pending Bramble flag committed with picture');
 }
 // Real entry refusal and exact raw custody, before any global render normalizer.
 let refusalCase=0;for(const mutate of [s=>{s.broad.observations.push({future:'Synthetic raw'});},s=>{s.garden.visits.push({id:'future',version:77,raw:'Synthetic old story'});},s=>{s.raw='x'.repeat(MAX_IMPORT_BYTES);}]){
  const s=fresh();mutate(s);const p=await setup(320,refusalCase===2?fresh():s);if(refusalCase===2)await p.evaluate(s=>{__saves=0;__replace(s);},s);refusalCase++;ok(await p.locator('[data-scale-blocked]').count(),'unsafe entry refuses case'+refusalCase);eq(await p.locator('.scale-page svg,.scale-page [data-speak],.scale-source').count(),0,'source-free refusal');eq(await p.evaluate(()=>__read()),s,'entry refusal preserves raw notebook exactly');eq(await p.evaluate(()=>__saves),0,'entry refusal does not save');
 }
 // A refused direct entry with a null Broad root must still permit the real Back link.
 {const s=fresh();s.broad=null;const p=await setup(320,s);ok(await p.locator('[data-scale-blocked]').count(),'null Broad entry refuses without normalization');eq(await p.evaluate(()=>__read().broad),null,'null Broad remains exact');await p.getByRole('link',{name:'Back to Cartographer’s Table',exact:true}).click();await p.locator('.cart-page').waitFor();ok(await p.locator('.cart-page h1').isVisible(),'Back exits the refused scale entry without a crash');}
 // Uninstrumented app smoke and save-off session behavior.
 const real=await setup(820,fresh(),false);await real.locator(target('key',4)).click();eq((await real.locator('.scale-readouts p').allTextContents()).map(text),scaleReadouts(4),'uninstrumented actual app');
 const off=await setup(320);await go(off,'#notes');await off.locator('#remember').uncheck();await go(off,'#workshop/scale');await off.locator(target('key',4)).click();ok(await off.locator('[data-scale-key="4"]').count(),'save-off view usable');eq(await off.evaluate(()=>localStorage.getItem('number-garden-save')),'off','save-off stays off');
 const sw=await setup(320),kept=await sw.evaluate(()=>JSON.stringify(__read())),saves=await sw.evaluate(()=>__saves);await sw.locator('#explorer-switch').click();await sw.locator('#explorer-cancel').waitFor();eq(await sw.evaluate(()=>JSON.stringify(__read())),kept,'explorer chooser on this route leaves the notebook unnormalized');await sw.locator('#explorer-cancel').click();await sw.locator('.scale-page').waitFor();eq(await sw.evaluate(()=>[JSON.stringify(__read()),__saves]),[kept,saves],'cancelled switch returns to the scene unchanged');
 for(const [hash,page] of [['#cafe/units','.units-page'],['#loft/shadows','.shadow-page'],['#workshop/scale','.scale-page']]){const d=await sw.context().newPage();d.on('pageerror',e=>errors.push(e.message));await d.goto(origin+hash);await d.locator(page).waitFor();ok(await d.locator('#companion-link').evaluate(x=>x.innerHTML.trim()!==''),hash+' direct load shows the header guide link');await d.close();}
 eq(errors,[],'no browser errors');console.log(`${n} scale111 Chrome checks passed at320/820.`);
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
