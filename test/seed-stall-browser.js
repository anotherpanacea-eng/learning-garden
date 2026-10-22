// Synthetic local Chrome journeys only. No learner exports or remote content.
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const load=f=>import(pathToFileURL(path.resolve(__dirname,'../dist',f)).href);
 const {freshState,recommendations}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES}=await load('progress-transfer.mjs'),{seedSource}=await load('seed-stall-core.mjs');
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const base=process.env.SEED_TEST_URL||'http://127.0.0.1:4187/',errors=[];let checks=0;
 const yes=(x,m)=>{assert.ok(x,m);checks++;},same=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
 const tap=(page,selector)=>page.locator(selector).first().tap();
 const saved=page=>page.evaluate(()=>{const r=JSON.parse(localStorage.getItem('learning-garden-explorers'));return JSON.parse(localStorage.getItem(`number-garden-v1:${r.activeId}`));});
 const notesDownload=async page=>{await page.goto(new URL('#notes',base).href);const [download]=await Promise.all([page.waitForEvent('download'),tap(page,'#download')]);return fs.readFile(await download.path(),'utf8');};
 const importFile=async(page,report)=>{await page.goto(new URL('#notes',base).href);await page.locator('#progress-file').setInputFiles({name:'synthetic-seed-stall.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report,null,2))});await page.locator('#progress-import-confirm').waitFor();await tap(page,'#progress-import-confirm');await page.goto(new URL('#numbers/seeds',base).href);};
 const report=s=>({title:'Synthetic Seed Stall notes',exportedAt:'2026-01-01T00:00:00.000Z',note:'Synthetic test only',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
 async function geometry(page){yes(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal page overflow');const short=await page.locator('.seed-sheet button:not(:disabled),.seed-sheet a,.seed-sheet summary').evaluateAll(xs=>xs.filter(x=>{const h=x.getBoundingClientRect().height;return h>0&&h<44}).map(x=>({tag:x.tagName,text:x.textContent.trim().slice(0,50),height:x.getBoundingClientRect().height})));yes(short.length===0,`all visible controls at least 44px: ${JSON.stringify(short)}`);}
 async function axis(page){const g=await page.evaluate(()=>{const track=document.querySelector('.seed-track'),r=track.getBoundingClientRect(),start=r.left+parseFloat(getComputedStyle(track).borderLeftWidth),end=r.right,ticks=[...document.querySelectorAll('.seed-ticks span')].map(x=>{const t=x.getBoundingClientRect();return (t.left+t.right)/2;}),bars=[...document.querySelectorAll('[data-seed-bar]')].map(x=>({value:Number(x.dataset.value),rect:x.getBoundingClientRect().toJSON()}));return {start,end,ticks,bars};});for(let i=0;i<=6;i++)yes(Math.abs(g.ticks[i]-(g.start+(g.end-g.start)*i/6))<1,`tick ${i} aligns with the count scale`);for(const b of g.bars){yes(Math.abs(b.rect.x-g.start)<1,'bar shares the zero baseline');yes(Math.abs(b.rect.right-g.ticks[b.value])<1,`bar end aligns with tick ${b.value}`);}}
 try{
  for(const width of (process.env.SEED_NEAR_ONLY?[]:[320,820])){
   const initial=initializeExplorerState(freshState());initial.garden.welcomeFilmSeen=true;const other=JSON.stringify(initial.tenthsTable);
   const context=await browser.newContext({viewport:{width,height:1000},hasTouch:true,acceptDownloads:true});
   await context.addInitScript(initial=>{if(!localStorage.getItem('synthetic-seed-seeded')){localStorage.setItem('number-garden-v1',JSON.stringify(initial));localStorage.setItem('synthetic-seed-seeded','yes');}},initial);
   const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(new URL('#numbers/seeds',base).href);await page.locator('[data-seed-root]').waitFor();
   yes(!Object.hasOwn(await saved(page),'seedStall'),'chooser does not allocate root');
   for(let sun=3;sun>=0;sun--){same(await page.locator('[data-seed-counter]').count(),6);same(await page.locator('[data-seed-counter][data-mark="sun"]').count(),sun);if(sun>0)await tap(page,'[data-seed-adjust="-1"]');}
   for(let sun=0;sun<=6;sun++){same(await page.locator('[data-seed-counter][data-mark="sun"]').count(),sun);if(sun<6)await tap(page,'[data-seed-adjust="1"]');}
   await page.locator('[data-seed-adjust="-1"]').focus();await page.keyboard.press('Enter');same(await page.locator('[data-seed-counter][data-mark="sun"]').count(),5,'keyboard changes the pictured bag');await tap(page,'[data-seed-adjust="1"]');
   yes(!Object.hasOwn(await saved(page),'seedStall'),'all seven chooser bags remain ephemeral');
   await tap(page,'[data-seed-adjust="-1"]');await tap(page,'[data-seed-adjust="-1"]');same(await page.locator('[data-seed-counter][data-mark="sun"]').count(),4);
   await geometry(page);await tap(page,'[data-seed-start]');same(await page.evaluate(()=>document.activeElement.id),'seed-run-heading');
   await axis(page);
   let work=(await saved(page)).seedStall;const frozen=structuredClone(work.investigations[0].source);same(frozen.slots.filter(x=>x==='sun').length,4);same(work.investigations[0].runs[0].draws,[]);
   await tap(page,'[data-seed-predict="sun"]');same((await saved(page)).seedStall.investigations[0].runs[0].prediction,'sun');await tap(page,'[data-seed-draw]');
   work=(await saved(page)).seedStall;const firstMark=work.investigations[0].runs[0].draws[0];yes(['sun','moon'].includes(firstMark));same(await page.locator(`[data-seed-drawn="${firstMark}"]`).count(),1);same(await page.locator('[data-seed-counter]').count(),6);
   await axis(page);
   await page.reload();same((await saved(page)).seedStall.investigations[0].source,frozen,'source preserved across reload');same(await page.locator('[data-seed-predict]').count(),0,'prediction controls close after the first draw');yes((await page.locator('.seed-recorded-prediction').innerText()).includes('More sun marks'),'recorded prediction remains visible');
   for(let i=1;i<6;i++)await tap(page,'[data-seed-draw]');same(await page.evaluate(()=>document.activeElement.id),'seed-finish','sixth draw leaves focus on visible summary');
   work=(await saved(page)).seedStall;same(work.investigations[0].runs[0].draws.length,6);same(await page.locator('[data-seed-draw]').count(),0,'no seventh draw');
   const sum=await page.locator('[data-seed-bar]').evaluateAll(xs=>xs.map(x=>Number(x.dataset.value)).reduce((a,b)=>a+b,0));same(sum,6,'bar counts sum to six');
   for(let run=2;run<=3;run++){await tap(page,'[data-seed-repeat]');same(await page.evaluate(()=>document.activeElement.id),'seed-run-heading');for(let i=0;i<6;i++)await tap(page,'[data-seed-draw]');}
   same((await saved(page)).seedStall.investigations[0].runs.map(r=>r.draws.length),[6,6,6]);same(await page.locator('[data-seed-repeat]').count(),0);await geometry(page);
   if(process.env.SEED_ARTIFACTS){await fs.mkdir(process.env.SEED_ARTIFACTS,{recursive:true});await page.screenshot({path:path.join(process.env.SEED_ARTIFACTS,`seed-three-runs-${width}.png`),fullPage:true});}
   await tap(page,'[data-seed-change]');same(await page.evaluate(()=>document.activeElement.id),'seed-title');await tap(page,'[data-seed-adjust="-1"]');await tap(page,'[data-seed-adjust="-1"]');await tap(page,'[data-seed-adjust="-1"]');await tap(page,'[data-seed-adjust="-1"]');same(await page.locator('[data-seed-counter][data-mark="sun"]').count(),0);
   await tap(page,'[data-seed-start]');for(let i=0;i<6;i++)await tap(page,'[data-seed-draw]');same((await saved(page)).seedStall.investigations[1].runs[0].draws,Array(6).fill('moon'),'all-one bag is deterministic');yes((await page.locator('#seed-finish').innerText()).includes('can show only moon'),'certainty confined to all-one source');
   await axis(page);
   same(JSON.stringify((await saved(page)).tenthsTable),other,'another saved game unchanged');
   const raw=await notesDownload(page);yes(prepareProgressImport(raw).ok,'actual notes report reimports');yes(raw.includes('"seedStall"')&&raw.includes('uniform-return-six-v1'),'download has frozen virtual model');
   const older=JSON.parse(raw);older.seedStall.investigations[0].source.rule='Earlier safe wording: return each seed.';older.seedStall.investigations[0].source.explanation='Earlier source explanation.';older.seedStall.investigations.push({id:99,source:{invalid:true},note:'raw sibling'});
   await importFile(page,older);await page.locator('.seed-history summary').click();yes((await page.locator('.seed-history').innerText()).includes('1 earlier entry'),'malformed sibling remains visible as unavailable');
   await tap(page,'[data-seed-resume="1"]');yes((await page.locator('.seed-rule').innerText()).includes('Earlier safe wording'),'actual imported source wording rendered');
   const imported=(await saved(page)).seedStall;same(imported.investigations.at(-1).note,'raw sibling');await geometry(page);
   await page.goto(new URL('#numbers',base).href);await page.goto(new URL('#numbers/seeds',base).href);same((await saved(page)).seedStall,imported,'route round trip preserves the saved experiment');
   await page.goto(new URL('#notes',base).href);await tap(page,'#reset');await tap(page,'#confirm-reset');if(await page.locator('[data-film-skip]').count())await tap(page,'[data-film-skip]');yes(!Object.hasOwn(await saved(page),'seedStall'),'reset clears only active explorer Seed Stall');
   await page.goto(new URL('#notes',base).href);await tap(page,'#notes-switch-explorer');await tap(page,'[data-select-explorer="explorer-1"]');yes((await saved(page)).seedStall.investigations.length===2,'original explorer retains its Seed Stall investigations');
   await page.goto(new URL('#notes',base).href);await page.locator('#remember').uncheck();await page.goto(new URL('#numbers/seeds',base).href);await tap(page,'[data-seed-change]');await tap(page,'[data-seed-start]');await tap(page,'[data-seed-draw]');same(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('number-garden-v1:'))),[],'save-off draw writes no explorer notebook');yes(prepareProgressImport(await notesDownload(page)).state.seedStall.investigations.length===3,'save-off draw remains in importable notes');
   await context.close();
  }
  // Detached controls from prior experiments cannot change the current source, run, chooser, or focus.
  if(!process.env.SEED_NEAR_ONLY){
   const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;
   const c=await browser.newContext({viewport:{width:390,height:900},hasTouch:true});await c.addInitScript(initial=>{if(!localStorage.getItem('seed-browser-initial')){localStorage.setItem('number-garden-v1',JSON.stringify(initial));localStorage.setItem('seed-browser-initial','1');}},s);
   const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));await p.goto(new URL('#numbers/seeds',base).href);
   const oldAdjust=await p.locator('[data-seed-adjust="1"]').elementHandle(),oldStart=await p.locator('[data-seed-start]').elementHandle();await tap(p,'[data-seed-start]');
   const oldPredict=await p.locator('[data-seed-predict="sun"]').elementHandle();for(let i=0;i<6;i++)await tap(p,'[data-seed-draw]');
   const oldRepeat=await p.locator('[data-seed-repeat]').elementHandle(),oldChange=await p.locator('[data-seed-change]').elementHandle();await tap(p,'[data-seed-change]');const oldCancel=await p.locator('[data-seed-cancel]').elementHandle();await tap(p,'[data-seed-start]');
   const oldDraw=await p.locator('[data-seed-draw]').elementHandle(),oldResume=await p.locator('[data-seed-resume="1"]').elementHandle();await tap(p,'[data-seed-change]');await tap(p,'[data-seed-start]');
   const before=JSON.stringify((await saved(p)).seedStall);for(const stale of [oldAdjust,oldStart,oldPredict,oldRepeat,oldChange,oldCancel,oldDraw,oldResume])await stale.evaluate(b=>b.click());same(JSON.stringify((await saved(p)).seedStall),before,'detached old controls cannot mutate a newer experiment');same(await p.locator('[data-seed-root] #seed-run-heading').count(),1,'detached chooser actions cannot change the visible stage');await c.close();
  }
  // Actual file import with ten readable histories; one confirmed Start replaces one, preserving raw siblings.
  if(!process.env.SEED_NEAR_ONLY){
   const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.seedStall={version:1,current:10,nextId:11,investigations:[]};
   for(let id=1;id<=10;id++)s.seedStall.investigations.push({id,source:seedSource(id%7),runs:[{prediction:null,draws:[]}]});
   s.seedStall.investigations.splice(3,0,{id:30,bad:true,note:'first raw'});s.seedStall.investigations.splice(7,0,{id:31,bad:true,note:'second raw'});
   const c=await browser.newContext({viewport:{width:390,height:900},hasTouch:true,acceptDownloads:true});await c.addInitScript(initial=>{if(!localStorage.getItem('seed-browser-initial')){localStorage.setItem('number-garden-v1',JSON.stringify(initial));localStorage.setItem('seed-browser-initial','1');}},s);const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
   await p.goto(base);await importFile(p,report(s));same((await saved(p)).seedStall.investigations.length,12);
   await tap(p,'[data-seed-change]');await tap(p,'[data-seed-start]');yes((await p.locator('.seed-confirm').innerText()).includes('experiment 1'),'oldest readable entry named');
   const before=JSON.stringify((await saved(p)).seedStall),oldConfirm=await p.locator('[data-seed-confirm]').elementHandle();await tap(p,'[data-seed-cancel]');await oldConfirm.evaluate(b=>b.click());same(JSON.stringify((await saved(p)).seedStall),before,'cancel and detached confirmation preserve history');
   await tap(p,'[data-seed-change]');await tap(p,'[data-seed-start]');const [dl]=await Promise.all([p.waitForEvent('download'),tap(p,'[data-seed-download]')]);yes(prepareProgressImport(await fs.readFile(await dl.path(),'utf8')).ok,'cap offers actual reimportable download');
   await tap(p,'[data-seed-confirm]');const after=(await saved(p)).seedStall;same(after.investigations.length,12,'ten readable stays ten, two raw stay raw');yes(!after.investigations.some(x=>x.id===1));same(after.investigations.filter(x=>x.note).map(x=>x.note),['first raw','second raw']);same(after.investigations.at(-1).id,32,'occupied raw IDs reserve IDs');await geometry(p);await c.close();
  }
  // Unknown imported root and near-limit report refusal use the real host download/import surface.
  if(!process.env.SEED_NEAR_ONLY){
   const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.seedStall={version:77,earlier:'raw kept'};
   const c=await browser.newContext({viewport:{width:390,height:900},hasTouch:true,acceptDownloads:true});await c.addInitScript(initial=>{if(!localStorage.getItem('seed-browser-initial')){localStorage.setItem('number-garden-v1',JSON.stringify(initial));localStorage.setItem('seed-browser-initial','1');}},s);const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));await p.goto(base);await importFile(p,report(s));
   yes((await p.locator('[data-seed-root]').innerText()).includes('cannot be opened safely'));const oldRecover=await p.locator('[data-seed-recover]').elementHandle();await tap(p,'[data-seed-recover]');const recovered=(await saved(p)).seedStall;await oldRecover.evaluate(b=>b.click());same((await saved(p)).seedStall,recovered,'detached recovery cannot disturb new work');same(recovered.recovered,{version:77,earlier:'raw kept'});const recoveryReport=await notesDownload(p);yes(prepareProgressImport(recoveryReport).ok,'unknown root recovery exports');await c.close();
  }
  {
   const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.seedStall={version:1,current:1,nextId:2,investigations:[{id:1,source:seedSource(3),runs:[{prediction:null,draws:[]}]}]};
   const c=await browser.newContext({viewport:{width:390,height:900},hasTouch:true,acceptDownloads:true});await c.addInitScript(initial=>{if(!localStorage.getItem('seed-browser-initial')){localStorage.setItem('number-garden-v1',JSON.stringify(initial));localStorage.setItem('seed-browser-initial','1');}},s);const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
   await p.goto(base);await importFile(p,report(s));const baseline=await notesDownload(p),near=JSON.parse(baseline);
   near.seedStall.investigations.push({id:99,rawPadding:''});
   const room=MAX_IMPORT_BYTES-Buffer.byteLength(JSON.stringify(near,null,2));yes(room>100,'baseline has capacity');
   near.seedStall.investigations.at(-1).rawPadding='€'.repeat(Math.floor((room-2)/3));
   yes(prepareProgressImport(JSON.stringify(near,null,2)).ok,'near-limit synthetic raw sibling imports');
   await importFile(p,near);const fitsBefore=await notesDownload(p);yes(Buffer.byteLength(fitsBefore)<=MAX_IMPORT_BYTES&&prepareProgressImport(fitsBefore).ok,'actual near-limit report is importable before draw');
   await p.goto(new URL('#numbers/seeds',base).href);const before=JSON.stringify((await saved(p)).seedStall);await tap(p,'[data-seed-draw]');same(JSON.stringify((await saved(p)).seedStall),before,'actual draw refused atomically after full-report preflight');yes((await p.locator('#seed-status').innerText()).includes('cannot fit safely'),'truthful visible refusal');yes(await p.locator('[data-seed-draw]').evaluate(x=>x===document.activeElement),'capacity refusal preserves draw-button focus');await c.close();
  }
  same(errors,[],'no page errors');console.log(`${checks} Seed Stall Chrome assertions passed at 320/820/390px.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
