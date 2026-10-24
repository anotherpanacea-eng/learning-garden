// Drawn how-tos in Chrome: play once, step, pause, reduced motion, layout and no saved changes. Synthetic notebooks only.
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{const root=path.resolve(__dirname,'..'),load=f=>import(pathToFileURL(path.join(root,'dist',f)).href);
 const {freshState}=await load('core.mjs'),{initializeExplorerState}=await load('progress-transfer.mjs'),{lifeCases}=await load('life-stages-content.mjs'),{startLife}=await load('life-stages-core.mjs'),{drawnHowto}=await load('drawn-howtos-content.mjs');
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw,browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const origin=process.env.HOWTO_TEST_URL||'http://127.0.0.1:4213/',art=process.env.HOWTO_ARTIFACTS,contexts=[],errors=[];let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};if(art)await fs.mkdir(art,{recursive:true});
 const seed=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;startLife(s,lifeCases[0].id);return s;};
 const pages=[['life-ring','#living/stages',async p=>{await p.locator('#life-help').evaluate(d=>d.open=true);}],['shutters-play','#orchard/games/shutters',async()=>{}],['rows-play','#orchard/games/rows',async()=>{}]];
 async function setup(width,hash,reducedMotion='no-preference'){const c=await browser.newContext({viewport:{width,height:900},reducedMotion,hasTouch:width<500});contexts.push(c);await c.addInitScript(s=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('number-garden-v1',JSON.stringify(s));sessionStorage.setItem('seeded','1');}},seed());const p=await c.newPage();p.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});await p.goto(origin+hash);await p.locator('drawn-howto .dh-open').first().waitFor({state:'attached'});return p;}
 const notebook=p=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));
 const view=p=>p.evaluate(()=>{const e=document.querySelector('drawn-howto'),q=s=>e.querySelector(s);return {caption:q('.dh-caption').textContent,count:q('.dh-count').textContent,toggle:q('[data-dh="toggle"]').textContent,toggleOff:q('[data-dh="toggle"]').disabled,nextOff:q('[data-dh="next"]').disabled,backOff:q('[data-dh="back"]').disabled,list:!q('.dh-all').hidden,shown:[...e.querySelectorAll('[data-dh-step]')].filter(g=>g.getAttribute('visibility')==='visible').length,running:document.getAnimations().filter(a=>a.playState==='running').length};});
 const focused=(p,s)=>p.evaluate(s=>document.activeElement===document.querySelector('drawn-howto '+s),s);
 async function layout(p,label){ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${label}: no horizontal overflow`);
  ok(await p.locator('drawn-howto button:visible').evaluateAll(xs=>xs.every(x=>{const r=x.getBoundingClientRect();return r.height>=44&&r.width>=44;})),`${label}: 44 px targets`);
  ok(await p.locator('.dh-caption,.dh-all li').evaluateAll(xs=>xs.every(x=>parseFloat(getComputedStyle(x).fontSize)>=16)),`${label}: captions at least 16 px`);}
 try{for(const [id,hash,prepare] of pages){const h=drawnHowto(id),last=h.steps.length;
  for(const width of [320,820]){const label=`${id} at ${width}`,p=await setup(width,hash);await prepare(p);const before=await notebook(p);
   eq(await p.locator('drawn-howto .dh-open').innerText(),h.button,`${label}: button names the how-to`);eq(await p.locator('.dh-panel').count(),0,`${label}: nothing opens by itself`);
   await p.locator('.dh-open').click();let v=await view(p);eq([v.caption,v.count,v.toggle,v.backOff,v.shown],[h.steps[0].caption,`Step 1 of ${last}`,'Pause',true,1],`${label}: opening plays step one`);ok(v.running>0,`${label}: step one is drawing`);ok(await focused(p,'[data-dh="toggle"]'),`${label}: focus lands on Pause`);
   eq(await p.locator('.dh-picture').getAttribute('role'),'img',`${label}: picture role`);eq(await p.locator('.dh-picture').getAttribute('aria-label'),h.alt,`${label}: whole-picture description`);eq(await p.locator('.dh-caption').getAttribute('aria-live'),'polite',`${label}: captions announced`);
   if(width===320){// Pause holds the picture; Play resumes it.
    await p.locator('[data-dh="toggle"]').click();const paused=await view(p);eq([paused.toggle,paused.running],['Play',0],`${label}: Pause stops drawing`);await p.waitForTimeout(2500);eq((await view(p)).caption,paused.caption,`${label}: a paused drawing stays put`);await p.locator('[data-dh="toggle"]').click();eq((await view(p)).toggle,'Pause',`${label}: Play resumes`);}
   const started=Date.now();await p.waitForFunction(n=>document.querySelector('drawn-howto .dh-count').textContent===`Step ${n} of ${n}`&&!document.querySelector('drawn-howto .dh-all').hidden,last,{timeout:20000});
   if(width===820)ok(Date.now()-started<=16000,`${label}: plays through in about 15 seconds`);
   v=await view(p);eq([v.caption,v.toggleOff,v.nextOff,v.list,v.shown,v.running],[h.steps.at(-1).caption,true,true,true,last,0],`${label}: finished picture stays with every caption`);
   eq(await p.locator('.dh-all li').allTextContents(),h.steps.map(s=>s.caption),`${label}: numbered captions in order`);await layout(p,label);if(art)await p.locator('.dh-panel').screenshot({path:path.join(art,`${id}-${width}-end.png`)});
   await p.locator('[data-dh="back"]').click();v=await view(p);eq([v.caption,v.shown,v.list,v.running,v.toggle],[h.steps[last-2].caption,last-1,false,0,'Play'],`${label}: Back shows the earlier step whole`);
   await p.locator('[data-dh="next"]').click();v=await view(p);eq([v.caption,v.shown,v.toggle],[h.steps[last-1].caption,last,'Play'],`${label}: Next draws the following step without playing on`);ok(v.running>0,`${label}: Next draws the step`);
   await p.waitForFunction(()=>!document.querySelector('drawn-howto .dh-all').hidden);ok(await p.evaluate(()=>[...document.querySelectorAll('drawn-howto button:disabled')].every(b=>b!==document.activeElement)),`${label}: focus never rests on a disabled button`);
   await p.locator('[data-dh="again"]').click();v=await view(p);eq([v.caption,v.shown,v.toggle],[h.steps[0].caption,1,'Pause'],`${label}: Watch again plays from step one`);
   await p.locator('[data-dh="close"]').click();eq(await p.locator('.dh-panel').count(),0,`${label}: Close removes the panel`);ok(await focused(p,'.dh-open'),`${label}: focus returns to the button`);eq(await p.evaluate(()=>document.getAnimations().length),0,`${label}: no drawing left running`);
   eq(await notebook(p),before,`${label}: watching saves nothing`);
   await p.locator('.dh-open').click();await p.evaluate(()=>location.hash='#home');await p.waitForTimeout(2600);eq(await p.locator('drawn-howto').count(),0,`${label}: leaving mid-play removes the drawing`);await p.close();}
  // Reduced motion: nothing plays; each step appears whole.
  const p=await setup(820,hash,'reduce');await prepare(p);await p.locator('.dh-open').click();let v=await view(p);eq([v.caption,v.toggle,v.running,v.shown],[h.steps[0].caption,'Play',0,1],`${id} reduced: opens on a complete first step`);ok(await focused(p,'[data-dh="next"]'),`${id} reduced: focus on Next`);
  await p.locator('[data-dh="next"]').click();v=await view(p);eq([v.caption,v.running,v.shown],[h.steps[1].caption,0,2],`${id} reduced: Next shows the step whole`);await p.close();}
  eq(errors,[],'no Chrome errors');console.log(`Drawn how-tos Chrome: ${n} assertions passed at 320/820 and with reduced motion.`);
 }finally{for(const c of contexts)await c.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
