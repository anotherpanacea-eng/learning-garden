// Synthetic visit-only journeys. Chromium touch emulation is not physical-iPad qualification.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
import {chooseWordRoomWord} from '../dist/word-room-core.mjs';
import {enterSoundMessages,leaveSoundMessages} from '../dist/word-room-sounds-core.mjs';
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=pw.chromium?pw:pw.default;
const root=new URL('../dist/',import.meta.url),types={mjs:'text/javascript',js:'text/javascript',css:'text/css',html:'text/html',svg:'image/svg+xml',json:'application/json'};
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(path.includes('..'))throw Error();const data=await readFile(new URL('.'+(path==='/'?'/index.html':path),root));res.writeHead(200,{'Content-Type':types[(path==='/'?'/index.html':path).split('.').at(-1)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const out=process.env.WORD_TRAIL_ARTIFACTS||tmpdir()+'/word-trails-'+Date.now();mkdirSync(out,{recursive:true});
let assertions=0;const errors=[],eq=(a,b,m)=>{assert.deepEqual(a,b,m);assertions++;},ok=(v,m)=>{assert.ok(v,m);assertions++;};
const fixture=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
const tap=(p,a,value)=>p.locator('[data-wrt-action="'+a+'"]'+(value===undefined?'':'[data-wrt-value="'+value+'"]')).tap();
const read=p=>p.evaluate(()=>window.__trailRead());
const disk=p=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])));
async function setup(seed=fixture(),width=820,height=1000){
 const c=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce',acceptDownloads:true});
 await c.addInitScript(s=>{localStorage.setItem('number-garden-v1',JSON.stringify(s));window.__trailSpeak=0;speechSynthesis.speak=()=>window.__trailSpeak++;},seed);
 await c.route('**/app.mjs',async route=>{const response=await route.fetch();let body=await response.text();assert.ok(body.includes('let graph=null,'));body=body.replace('let graph=null,','window.__trailRead=()=>structuredClone(state);let graph=null,');const start=body.indexOf('bindWordRoom(state,{'),end=body.indexOf('});}return;',start);assert.ok(start>=0&&end>start);body=body.slice(0,start)+body.slice(start,end).replace('canExport:candidate=>','canExport:candidate=>!window.__trailRefuse&&')+body.slice(end);await route.fulfill({response,body});});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(12000);await p.goto(base+'#words/props');await p.locator('[data-word-room-root]').waitFor();return{c,p};
}
async function layout(p){
 const undersized=await p.locator('[data-wrt-root]').evaluate(root=>[...root.querySelectorAll('*')].filter(el=>el.namespaceURI!=='http://www.w3.org/2000/svg'&&el.getClientRects().length&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(el).fontSize)<16).map(el=>({tag:el.tagName,class:el.className,size:getComputedStyle(el).fontSize,text:el.textContent.slice(0,80)})));eq(undersized,[],'visible non-SVG text is at least 16px');
 ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no sideways scrolling');for(const el of await p.locator('[data-wrt-root] button:visible,[data-wrt-root] summary:visible').all()){const r=await el.boundingBox();ok(r.width>=43.9&&r.height>=43.9,'44px target: '+await el.innerText());}}
async function counters(p,n){await tap(p,'try');for(let i=0;i<n;i++)await tap(p,'counter',1);eq(await p.locator('#wrt-count').innerText(),'You placed '+n+(n===1?' counter.':' counters.'));}
try{
 for(const[width,height]of[[820,1000],[320,600],[1024,768]]){
  const{c,p}=await setup(fixture(),width,height);
  try{
   const before=await read(p),saved=await disk(p);await p.evaluate(()=>window.__trailRefuse=true);await tap(p,'enter');await layout(p);
   const words=width===820?['fox','fog','kit','quit','mix','quiz']:['quit','mix'];
   for(const id of words){
    await tap(p,'word',id);eq(await p.locator('#wr-task').innerText(),id);
    if(['mix','quiz'].includes(id)){eq(await p.locator('.wrt-map').count(),0,'new use starts without reference');await tap(p,'counter',1);await tap(p,'model');}
    const dots={fox:4,fog:3,kit:3,quit:4,mix:4,quiz:4}[id];eq(await p.locator('.wrt-sound').count(),dots,'separate reference phonemes');
    if(width===820){for(let i=0;i<4;i++)await tap(p,'step',1);eq(await p.locator('.wrt-sound.wrt-selected').count(),dots,'whole model marks every sound');eq(await p.locator('[data-wrt-action=step][data-wrt-value="1"]').isDisabled(),true);}
    await layout(p);
    if(width===820){await p.screenshot({path:out+'/model-'+id+'.png',fullPage:true});if(id==='quit'){await tap(p,'compare');eq(await p.locator('.wrt-map').count(),2);await p.screenshot({path:out+'/compare-qu.png',fullPage:true});await tap(p,'back');}}
   }
   await tap(p,'word','fox');await counters(p,6);eq(await p.locator('[data-wrt-action=counter][data-wrt-value="1"]').isDisabled(),true);eq(await p.evaluate(()=>document.activeElement.id),'wrt-count','limit retains accessible focus');
   await tap(p,'compare');eq(await p.locator('.wrt-map').count(),2);await tap(p,'back');eq(await p.locator('.wrt-counter').count(),6);
   for(let i=0;i<6;i++)await tap(p,'counter',-1);eq(await p.evaluate(()=>document.activeElement.id),'wrt-count');
   await tap(p,'counter',1);eq(await p.locator('#wr-status').innerText(),'You placed 1 counter.','counter announcement filled after redraw');
   await p.evaluate(()=>window.__trailRedrawLate=document.querySelector('[data-wrt-action=counter][data-wrt-value="1"]'));await tap(p,'counter',1);await p.evaluate(()=>window.__trailRedrawLate.click());eq(await p.locator('.wrt-counter').count(),2,'detached control cannot mutate the same visit');await tap(p,'counter',-1);await tap(p,'leave');await tap(p,'enter');eq(await p.locator('.wrt-counter').count(),1,'same visit resumes');
   eq(await read(p),before,'pure journey preserves full notebook');eq(await disk(p),saved,'pure journey performs no storage write');eq(await p.evaluate(()=>window.__trailSpeak),0,'no speech playback');
   await p.screenshot({path:out+'/counters-'+width+'.png',fullPage:true});
   await p.evaluate(()=>window.__trailLate=document.querySelector('[data-wrt-action=counter][data-wrt-value="1"]'));
   await p.goto(base+'#words');await p.locator('[data-wrt-root]').waitFor({state:'detached'});await p.goto(base+'#words/props');await tap(p,'enter');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'route exit ends visit');await p.evaluate(()=>window.__trailLate.click());eq(await p.locator('.wrt-counter').count(),0,'detached control inert');
  }finally{await c.close();}
 }
 // All four historical packets remain exactly intact while the overlay is open.
 for(const pack of['show','market','garden','delivery']){
  const seed=fixture();for(const prior of['show','market','garden','delivery']){enterSoundMessages(seed,{canExport:()=>true},prior);leaveSoundMessages(seed,{canExport:()=>true});}enterSoundMessages(seed,{canExport:()=>true},pack);
  const{c,p}=await setup(seed);try{
   const before=await read(p),saved=await disk(p);await p.evaluate(()=>window.__trailRefuse=true);await tap(p,'enter');await counters(p,2);await tap(p,'leave');eq(await p.locator('[data-wrs-packet]').getAttribute('data-wrs-packet'),pack);eq(await read(p),before);eq(await disk(p),saved);
   await p.evaluate(()=>window.__trailRefuse=false);await p.locator('[data-wrs-action=leave]').tap();await tap(p,'enter');eq(await p.locator('.wrt-counter').count(),2,'successful packet write preserves visit');await tap(p,'leave');await p.locator('[data-wrs-action=enter][data-wrs-pack="'+pack+'"]').tap();await tap(p,'enter');eq(await p.locator('.wrt-counter').count(),2,'packet entry preserves visit');
   await p.goto(base+'#words');await p.goto(base+'#words/props');await tap(p,'enter');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'packet route cleanup also ends visit');
  }finally{await c.close();}
 }
 for(const mode of['example','contrast','point']){
  const seed=fixture();chooseWordRoomWord(seed,'mat',{canExport:()=>true});const{c,p}=await setup(seed);try{
   if(mode==='contrast'){await p.locator('.wr-comparisons summary').tap();await p.locator('[data-wr-action=compare]').first().tap();}else await p.locator('[data-wr-action="'+mode+'"]').tap();
   if(mode==='example')await p.locator('[data-wr-action=example-next]').tap();
   const text=await p.locator('#wr-task').innerText(),material=await p.locator('.wr-work,.wr-contrast').innerText(),before=await read(p);await p.evaluate(()=>window.__trailRefuse=true);await tap(p,'enter');await counters(p,1);await tap(p,'leave');eq(await p.locator('#wr-task').innerText(),text,'exact '+mode+' return');eq(await p.locator('.wr-work,.wr-contrast').innerText(),material,'exact '+mode+' material and frame');eq(await read(p),before);
  }finally{await c.close();}
 }
 const unsupported=fixture();unsupported.wordRoom={version:999,privateFuture:'keep verbatim'};const{c,p}=await setup(unsupported);try{const before=await read(p);await tap(p,'enter');await counters(p,1);await tap(p,'leave');eq(await read(p),before);ok(await p.locator('[data-wr-action=recover]').isVisible(),'unsupported old work remains recoverable');}finally{await c.close();}

 // Recovery clears counters after a successful commit, never after a refused one.
 {const seed=fixture();seed.wordRoom={version:999,future:'keep'};const{c,p}=await setup(seed);try{
  await tap(p,'enter');await counters(p,2);await tap(p,'leave');await p.locator('[data-wr-action=recover]').tap();await p.evaluate(()=>window.__trailRefuse=true);await p.locator('[data-wr-action=confirm]').tap();await tap(p,'enter');eq(await p.locator('.wrt-counter').count(),2,'refused recovery keeps visit');await tap(p,'leave');
  await p.evaluate(()=>window.__trailRefuse=false);await p.locator('[data-wr-action=recover]').tap();await p.locator('[data-wr-action=confirm]').tap();await tap(p,'enter');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'successful recovery ends visit');
 }finally{await c.close();}}
 async function ready(p){await p.locator('[data-word-room-root],[data-select-explorer]').first().waitFor();if(await p.locator('[data-select-explorer]').count()){const id=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);await p.locator('[data-select-explorer="'+id+'"]').tap();}await p.locator('[data-word-room-root]').waitFor();}
 for(const event of['owner','import','reset','reload']){
  const{c,p}=await setup();try{
   await tap(p,'enter');await counters(p,2);await p.evaluate(()=>window.__trailEventLate=document.querySelector('[data-wrt-action=counter][data-wrt-value="1"]'));
   if(event==='owner'){await p.locator('#explorer-switch').tap();await p.locator('#explorer-new').tap();await p.locator('#explorer-create').tap();}
   else if(event==='reload')await p.reload();
   else{
    await p.goto(base+'#notes');
    if(event==='reset'){await p.locator('#reset').tap();await p.locator('#confirm-reset').tap();}
    else{const[download]=await Promise.all([p.waitForEvent('download'),p.locator('#download').tap()]);const bytes=await readFile(await download.path());await p.locator('#progress-file').setInputFiles({name:'synthetic-trail.json',mimeType:'application/json',buffer:bytes});await p.locator('#progress-import-confirm').tap();}
    await p.goto(base+'#words/props');
   }
   await ready(p);await tap(p,'enter');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,event+' starts a fresh visit');
   if(event!=='reload'){await p.evaluate(()=>window.__trailEventLate.click());eq(await p.locator('.wrt-counter').count(),0,event+' invalidates previous controls');}
  }finally{await c.close();}
 }
 {const{c,p}=await setup();try{await p.goto(base+'#notes');await p.locator('#remember').uncheck();await p.goto(base+'#words/props');const saved=await disk(p);await tap(p,'enter');await counters(p,2);eq(await disk(p),saved,'saving off does not block counters or write storage');}finally{await c.close();}}
 eq(errors,[],'no browser errors');console.log('Sound trails native: '+assertions+' assertions passed. Artifacts: '+out);
}finally{await browser.close();await new Promise(r=>server.close(r));}
