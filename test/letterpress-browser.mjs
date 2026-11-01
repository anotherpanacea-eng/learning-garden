// Original351: one full tablet journey, representative narrow/wide work, and real host lifecycle probes.
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
const types={html:'text/html',mjs:'text/javascript',js:'text/javascript',css:'text/css',svg:'image/svg+xml',json:'application/json'},root=new URL('../dist/',import.meta.url);
const server=createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=name==='/'?'/index.html':name;if(file.includes('..'))throw Error();const bytes=await readFile(new URL('.'+file,root));res.writeHead(200,{'Content-Type':types[file.split('.').at(-1)]||'application/octet-stream'});res.end(bytes);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const out=process.env.LETTERPRESS_ARTIFACTS||tmpdir()+'/letterpress-'+Date.now();mkdirSync(out,{recursive:true});
let n=0;const errors=[],eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const tap=(p,a,value)=>p.locator('[data-lp-action="'+a+'"]'+(value===undefined?'':'[data-lp-value="'+value+'"]')).tap();
const read=p=>p.evaluate(()=>window.__lpRead());
const disk=p=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])));
function fixture(){const s=initializeExplorerState(freshState());chooseWordRoomWord(s,'mat',{canExport:()=>true});for(const pack of['show','market','garden','delivery']){enterSoundMessages(s,{canExport:()=>true},pack);leaveSoundMessages(s,{canExport:()=>true});}return s;}
async function setup(seed=fixture(),width=820,height=1000){
 const c=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce',acceptDownloads:true});
 await c.addInitScript(s=>{if(!localStorage.getItem('lp-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('lp-fixture','1');}window.__lpSpeak=0;window.__lpGates=0;speechSynthesis.speak=()=>window.__lpSpeak++;},seed);
 await c.route('**/app.mjs',async route=>{const response=await route.fetch();let body=await response.text();assert.ok(body.includes('let graph=null,'));body=body.replace('let graph=null,','window.__lpRead=()=>structuredClone(state);let graph=null,');body=body.replace('bindLetterpress(state,{','bindLetterpress(state,{canExport:()=>{window.__lpGates++;return false;},');await route.fulfill({response,body});});
 const p=await c.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));const requests=[];p.on('request',req=>requests.push(req.url()));await p.goto(base+'#words/letterpress',{waitUntil:'networkidle'});await ready(p);return {c,p,requests};
}
async function ready(p){await p.locator('[data-lp-root],[data-select-explorer]').first().waitFor();if(await p.locator('[data-select-explorer]').count()){const id=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);await p.locator('[data-select-explorer="'+id+'"]').tap();}await p.locator('[data-lp-root]').waitFor();}
async function chooseLetter(p,id){await tap(p,'chooser');await tap(p,'letter',id);}
async function layout(p){
 ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no sideways overflow');
 for(const el of await p.locator('[data-lp-root] button:visible,[data-lp-root] summary:visible,[data-lp-root] a:visible').all()){const r=await el.boundingBox();ok(r.width>=43.9&&r.height>=43.9,'44px target '+(await el.innerText()).slice(0,30));}
 const small=await p.locator('[data-lp-root]').evaluate(root=>[...root.querySelectorAll('*')].filter(el=>el.namespaceURI!=='http://www.w3.org/2000/svg'&&el.getClientRects().length&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(el).fontSize)<16).map(el=>({tag:el.tagName,size:getComputedStyle(el).fontSize})));eq(small,[],'non-SVG text at least16px');
}
try{
 for(const[width,height]of[[820,1000],[320,600],[1024,768]]){
  const {c,p,requests}=await setup(fixture(),width,height);
  try{
   const before=await read(p),saved=await disk(p),requestCount=requests.length;
   eq(await p.locator('dialog.welcome-film[open]').count(),0,'standalone game excludes automatic welcome film');eq(await p.locator('#lp-task').innerText(),'A and a.');await layout(p);
   if(width===820){ok(await p.locator('.lp-work-mat').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'tablet model and primary action share the viewport');await p.screenshot({path:out+'/model-820.png',fullPage:true});}
   await tap(p,'try');await tap(p,'choose','b');ok((await p.locator('#lp-comparison').innerText()).includes('pairs capital A with lowercase a'),'nonmatching choice compares the target pair');eq(await p.locator('[data-lp-action=choose]').count(),3,'choice remains revisable');
   await tap(p,'choose','a');await tap(p,'flip');await tap(p,'choose','a');ok((await p.locator('#lp-comparison').innerText()).includes('lowercase a with capital A'),'reverse direction uses actual capital choice');
   await tap(p,'model');await tap(p,'try');ok((await p.locator('#lp-comparison').innerText()).includes('lowercase a with capital A'),'model preserves direction and choice');await layout(p);
   await chooseLetter(p,'i');const iNames=await p.locator('.lp-pair').ariaSnapshot();ok(iNames.includes('capital I')&&iNames.includes('lowercase i'),'actual I/i accessibility names expose form and case');await tap(p,'try');ok((await p.locator('#lp-task').innerText()).includes('capital I'),'I pair available');await chooseLetter(p,'l');eq(await p.locator('#lp-task').innerText(),'L and l.');const lNames=await p.locator('.lp-pair').ariaSnapshot();ok(lNames.includes('capital L')&&lNames.includes('lowercase l'),'actual L/l accessibility names expose form and case');eq(await p.locator('.lp-pair .lp-glyph').evaluateAll(xs=>xs.map(el=>getComputedStyle(el).fontFamily.includes('Georgia'))),[true,true],'letter forms use reviewed installed font');
   await chooseLetter(p,'a');ok((await p.locator('#lp-comparison').innerText()).includes('lowercase a with capital A'),'return resumes pair work');
   if(width===820){await tap(p,'look');await tap(p,'contrast','bd');eq(await p.locator('.lp-contrast-pairs .lp-stamp').count(),4,'B/b and D/d stay separate pairs');await layout(p);await p.screenshot({path:out+'/contrast-bd.png',fullPage:true});await tap(p,'contrast','Cc');eq(await p.locator('.lp-contrast-pairs .lp-stamp').count(),2);await tap(p,'contrast','Aa');eq(await p.locator('.lp-size .lp-glyph').evaluateAll(xs=>xs.map(x=>parseFloat(getComputedStyle(x).fontSize))),[48,96],'size does not change lowercase identity');await tap(p,'back');ok((await p.locator('#lp-comparison').innerText()).includes('lowercase a with capital A'));}
   await tap(p,'print');eq(await p.locator('.lp-label-pairs').evaluate(e=>e.open),true,'cat reference starts open');
   await p.locator('#lp-place-1').focus();await p.keyboard.press('Enter');eq(await p.evaluate(()=>document.activeElement.id),'lp-place-1','keyboard toggle keeps place focus');ok((await p.locator('#lp-status').innerText()).includes('capital A'),'strip change announced after redraw');
   await tap(p,'pin');eq(await p.locator('.lp-wall').evaluate(e=>e.open),true,'placing opens wall before focus');eq(await p.evaluate(()=>document.activeElement.id),'lp-wall-result');
   await tap(p,'all','capital');eq(await p.locator('.lp-wall-slots [data-lp-value=cat] .lp-glyph').innerText(),'cAt','editing does not overwrite pinned pattern');await tap(p,'poster');ok((await p.locator('.lp-poster-comparison').innerText()).includes('Dot used capitals'));await tap(p,'posterBack');eq(await p.evaluate(()=>document.activeElement.id),'lp-strip-description');
   await layout(p);await p.screenshot({path:out+'/printing-'+width+'.png',fullPage:true});
   if(width===820){
    await tap(p,'label','pin');eq(await p.locator('.lp-label-pairs').evaluate(e=>e.open),true,'pin first reference open');await tap(p,'place',1);await tap(p,'pin');ok((await p.locator('.lp-wall-slots [data-lp-value=pin]').ariaSnapshot()).includes('capital I'),'wall describes that label pinned pattern');
    for(const id of['mop','bat']){await tap(p,'label',id);eq(await p.locator('.lp-label-pairs').evaluate(e=>e.open),false,'new use starts without pair reference');await tap(p,'pairs');await tap(p,'all','capital');await tap(p,'pin');}
    eq(await p.locator('[data-lp-action=wallSelect]').count(),4,'four occupied slots only');await tap(p,'wallSelect','cat');eq(await p.locator('#lp-place-0').innerText(),'C','wall return keeps current editing strip');eq(await p.locator('.lp-wall-slots [data-lp-value=cat] .lp-glyph').innerText(),'cAt','wall older pattern still exact');
    await tap(p,'back');ok((await p.locator('#lp-comparison').innerText()).includes('lowercase a with capital A'));await tap(p,'print');eq(await p.locator('#lp-place-0').innerText(),'C');await layout(p);
   }
   await p.evaluate(()=>window.__lpLate=document.querySelector('[data-lp-action=place][data-lp-value="0"]'));await tap(p,'place',0);const current=await p.locator('#lp-strip-description').innerText();await p.evaluate(()=>window.__lpLate.click());eq(await p.locator('#lp-strip-description').innerText(),current,'detached control cannot mutate same visit');
   eq(await read(p),before,'full notebook and four old packets unchanged');eq(await disk(p),saved,'pure play writes no persisted bytes');eq(await p.evaluate(()=>[window.__lpSpeak,window.__lpGates]),[0,0],'no playback or capacity gate consulted');eq(requests.length,requestCount,'no activity network requests');
   await p.goto(base+'#words');ok(await p.locator('.lp-entry a').isVisible(),'hub discovery');await p.goto(base+'#words/letterpress');await ready(p);await tap(p,'print');eq(await p.locator('.lp-wall-slots [data-lp-action=wallSelect]').count(),0,'leaving route ends visit');
  }finally{await c.close();}
 }
 // Real owner/reload and Notes flows. Notes leaves this route, so no impossible same-route import claim.
 for(const event of['owner','reload','notes']){
  const {c,p}=await setup();try{
   await tap(p,'print');await tap(p,'place',1);await tap(p,'pin');await p.evaluate(()=>window.__lpOwnerLate=document.querySelector('[data-lp-action=place][data-lp-value="0"]'));
   if(event==='owner'){await p.locator('#explorer-switch').tap();await p.locator('#explorer-new').tap();await p.locator('#explorer-create').tap();}
   else if(event==='reload')await p.reload();
   else{
    const before=await read(p);await p.goto(base+'#notes');const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#download').tap()]);const bytes=await readFile(await download.path()),data=JSON.parse(bytes.toString());eq(data.wordRoom,before.wordRoom,'Notes carries old packets exactly');eq(Object.hasOwn(data,'letterpress'),false,'no new progress root');
    await p.locator('#progress-file').setInputFiles({name:'synthetic-letters.json',mimeType:'application/json',buffer:bytes});await p.locator('#progress-import-confirm').tap();await p.locator('#reset').tap();await p.locator('#confirm-reset').tap();await p.goto(base+'#words/letterpress');
   }
   await ready(p);await tap(p,'print');eq(await p.locator('[data-lp-action=wallSelect]').count(),0,event+' has fresh visit');
   if(event!=='reload'){await p.evaluate(()=>window.__lpOwnerLate.click());eq(await p.locator('#lp-place-0').innerText(),'c',event+' old control inert');}
  }finally{await c.close();}
 }
 {const seed=fixture();seed.words={v:999,future:'keep'};seed.wordRoom={v:999,future:['keep']};const{c,p}=await setup(seed);try{const before=await read(p);await tap(p,'try');await tap(p,'choose','a');eq(await read(p),before,'unsupported sibling roots stay exact');await p.goto(base+'#words');ok(await p.locator('.lp-entry a').isVisible(),'entry beside unsupported Word Garden');}finally{await c.close();}}
 {const{c,p}=await setup();try{await p.goto(base+'#notes');await p.locator('#remember').uncheck();await p.goto(base+'#words/letterpress');const saved=await disk(p);await tap(p,'print');await tap(p,'place',0);await tap(p,'pin');eq(await disk(p),saved,'saving off leaves play open without writes');}finally{await c.close();}}
 eq(errors,[],'no browser errors');console.log('Letterpress native: '+n+' assertions passed. Artifacts: '+out);
}finally{await browser.close();await new Promise(r=>server.close(r));}
