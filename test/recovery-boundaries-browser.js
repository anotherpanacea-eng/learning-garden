// Synthetic unsupported optional roots; verifies the real app report download.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs/promises'),{pathToFileURL}=require('node:url');
(async()=>{
 const load=f=>import(pathToFileURL(path.resolve(__dirname,'../dist',f)).href),{freshState}=await load('core.mjs'),{initializeExplorerState,prepareProgressImport}=await load('progress-transfer.mjs');
 const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.default||pw,browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});let count=0;
 const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(x,m)=>{assert.ok(x,m);count++;},base=process.env.RECOVERY_BOUNDARY_TEST_URL||'http://127.0.0.1:8000/';
 const saved=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('number-garden-v1:explorer-1')));
 for(const key of ['willowPath','fieldKit'])for(const refuse of [true,false]){
  const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;let raw={version:99,earlier:'kept'};if(refuse){raw='kept';for(let i=0;i<59;i++)raw=[raw];}s[key]=raw;
  const c=await browser.newContext({viewport:{width:refuse?390:820,height:1000},hasTouch:true,acceptDownloads:true}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));
  await p.addInitScript(s=>{if(!localStorage.getItem('recovery-boundary-seeded')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('recovery-boundary-seeded','yes');}},s);
  await p.goto(new URL(key==='willowPath'?'#numbers/path':'#field',base).href);await p.locator(key==='willowPath'?'[data-willow-root]':'[data-field-root]').waitFor();const before=await saved(p);
  if(key==='willowPath'){await p.locator('[data-willow-new]').click();await p.locator('[data-willow-confirm]').click();}else await p.locator('[data-field-recover]').click();
  const after=await saved(p);
  if(refuse){eq(after,before,'refused recovery leaves the actual persisted notebook unchanged');const notice=p.locator(key==='willowPath'?'[data-willow-notice]':'[data-field-status]');ok((await notice.innerText()).includes('Grown-up notes'));ok((await notice.innerText()).includes('separate explorer'));ok(await notice.evaluate(x=>x===document.activeElement));}
  else{eq(key==='willowPath'?after[key].retainedRaw:after[key].recovered,raw);ok(prepareProgressImport(JSON.stringify(after)).ok);}
  ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await p.goto(new URL('#notes',base).href);await p.locator('#download').waitFor();const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#download').click()]),text=await fs.readFile(await download.path(),'utf8'),report=JSON.parse(text);ok(prepareProgressImport(text).ok,'actual downloaded report remains importable');eq(report[key],(await saved(p))[key]);eq(errors,[]);await c.close();
 }
 await browser.close();console.log(`${count} recovery refusal, notice, focus and actual report-download assertions passed.`);
})().catch(e=>{console.error(e);process.exit(1);});
