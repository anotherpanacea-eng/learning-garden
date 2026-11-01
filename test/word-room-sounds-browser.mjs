// Synthetic342 native journeys. Touch/keyboard checks are not physical iPad or learning qualification.
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
import {enterSoundMessages,chooseSoundCase,actSoundCase} from '../dist/word-room-sounds-core.mjs';
const imported=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),{chromium}=imported.chromium?imported:imported.default;
const base=process.env.WORD_SOUND_TEST_URL;if(!base)throw Error('Serve dist and set WORD_SOUND_TEST_URL.');
const out=process.env.WORD_SOUND_ARTIFACTS||`${tmpdir()}/word-sounds-${Date.now()}`;mkdirSync(out,{recursive:true});
const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
let n=0;const errors=[];const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,v,m)=>{assert.deepEqual(a,v,m);n++;};
const fixture=()=>{const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;return s;};
const read=p=>p.evaluate(()=>window.__soundsRead());
const child=async p=>(await read(p)).wordRoom.soundMessages;
const record=async p=>{const c=await child(p);return c.records[c.selectedId];};
const control=(p,a)=>p.locator(`[data-wrs-action="${a}"]`).first();
const tap=(p,a)=>control(p,a).tap();
async function setup(width=820,height=1000,seed=fixture()){
 const c=await b.newContext({viewport:{width,height},hasTouch:true,acceptDownloads:true,reducedMotion:'reduce'});
 await c.addInitScript(s=>{
  if(!localStorage.getItem('sounds-fixture')){localStorage.setItem('number-garden-v1',JSON.stringify(s));localStorage.setItem('sounds-fixture','1');}
  window.__soundsSpeech=0;window.speechSynthesis.speak=()=>{window.__soundsSpeech++;};
  const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__soundsStorageFail&&(k.startsWith('number-garden')||k==='learning-garden-explorers'))throw Error('Synthetic storage refusal');return set.call(this,k,v);};
 },seed);
 await c.route('**/app.mjs',async route=>{
  const response=await route.fetch({maxRetries:3});let body=await response.text();assert.ok(body.includes('let graph=null,'));
  body=body.replace('let graph=null,','window.__soundsRead=()=>structuredClone(state);window.__soundsReport=()=>notesReport(state);let graph=null,');
  const start=body.indexOf('bindWordRoom(state,{'),end=body.indexOf('});}return;',start);assert.ok(start>=0&&end>start);
  body=body.slice(0,start)+body.slice(start,end).replace('canExport:candidate=>','canExport:candidate=>!window.__soundsRefuse&&')+body.slice(end);
  await route.fulfill({response,body});
 });
 const p=await c.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'#words/props');await p.locator('[data-word-room-root]').waitFor();return{c,p};
}
async function layout(p){
 ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');
 for(const e of await p.locator('.wr-room button:visible,.wr-room a:visible,.wr-room summary:visible').all()){
  const r=await e.boundingBox();ok(r&&r.width>=43.9&&r.height>=43.9,`44px target: ${(await e.innerText()).slice(0,30)}`);
 }
}
async function hidden(p,target){
 const exposed=await p.locator('[data-word-room-root]').evaluate(el=>el.textContent+' '+[...el.querySelectorAll('*')].flatMap(x=>['aria-label','alt','title'].map(a=>x.getAttribute(a)||'')).join(' '));
 ok(!new RegExp(`\\b${target}\\b`,'i').test(exposed),'target absent from full DOM text and accessible names before disclosure: '+target);
 eq(await p.locator('.wrs-whole-word').count(),0,'no hidden CSS answer');
}
async function choose(p,id,mode){await p.locator(`[data-wrs-case="${id}"][data-wrs-mode="${mode}"]`).tap();}
async function letters(p,word){for(let i=0;i<word.length;i++){await p.locator(`#wrs-place-${i}`).tap();await p.locator(`[data-wrs-action=letter][data-wrs-value="${word[i]}"]`).tap();}}
try{
 for(const [width,height]of[[320,600],[820,1000],[1024,768]]){
  const{c,p}=await setup(width,height);
  try{
   eq(Object.hasOwn(await read(p),'wordRoom'),false,'old chooser still allocates nothing');
   await tap(p,'enter');await layout(p);eq(Object.keys((await child(p)).records),[],'opening new chooser allocates no cases');
   eq(await p.locator('[data-wrs-case]').count(),8,'all four cases in both modes');
   // A message is available before any case and is attributed at source level.
   await tap(p,'message');eq(Object.keys((await child(p)).records),[],'message never allocates cases');ok((await child(p)).sharedHelp.message);
   eq(await p.locator('[data-wrs-token=target]').allTextContents(),['cat','sat','mat','cap','cot','map','tin']);
   eq(await p.locator('[data-wrs-token=adult-supplied]').allTextContents(),['A','on','a','A','is','on','a','A','is','in','a']);
   await tap(p,'caseBack');
   for(const[id,target]of[['start','sat'],['middle','cot'],['end','cap'],['show','map']]){
    await choose(p,id,'listen');await hidden(p,target);await layout(p);
    await tap(p,'partner');eq(await p.locator('[data-wrs-word]').innerText(),target);ok((await record(p)).help.partnerCard);
    await tap(p,'hidePartner');await hidden(p,target);await layout(p);
    const draftBefore=await record(p);await p.screenshot({path:`${out}/listen-${id}-${width}.png`,fullPage:true});
    await tap(p,'base');eq((await record(p)).slots,draftBefore.source.left.letters,'supplied starting word');ok((await record(p)).help.base);
    await tap(p,'clear');await tap(p,'keep');eq((await record(p)).firstKept.slots,[null,null,null]);
    await letters(p,target);eq((await record(p)).slots,[...target]);
    await p.evaluate(()=>window.__soundsLate=document.querySelector('[data-wrs-action=keep]'));
    await tap(p,'compare');eq((await record(p)).comparison.result,'match');ok((await record(p)).help.word);
    const held=await read(p);await p.evaluate(()=>window.__soundsLate.click());eq(await read(p),held,'detached Keep inert');
    await tap(p,'back');await tap(p,'keep');eq((await record(p)).firstKept.slots,[null,null,null]);eq((await record(p)).latestKept.slots,[...target]);
    await p.locator('.wrs-keeps summary').tap();await tap(p,'restoreFirst');eq((await record(p)).slots,[null,null,null]);ok((await record(p)).help.word,'restore retains word disclosure');
    await p.locator('.wrs-keeps summary').tap();await tap(p,'restoreLatest');eq((await record(p)).slots,[...target]);
    await tap(p,'contrast');await layout(p);await tap(p,'next');eq((await record(p)).frame,1);
    await p.reload();await p.locator('[data-wr-sounds-active]').waitFor();eq((await record(p)).page,'contrast');eq((await record(p)).frame,1,'contrast reload resumes actual frame');
    await tap(p,'back');await tap(p,'example');await tap(p,'next');await p.reload();await p.locator('[data-wr-sounds-active]').waitFor();eq((await record(p)).page,'example');eq((await record(p)).frame,1);
    await tap(p,'back');await tap(p,'choose');await choose(p,id,'read');eq(await p.locator('[data-wrs-word]').innerText(),target);
    eq(await p.locator('.wrs-stage figure').count(),0,'print precedes picture');await tap(p,'picture');await layout(p);
    await p.screenshot({path:`${out}/picture-${id}-${width}.png`,fullPage:true});
    await tap(p,'build');ok((await record(p)).help.word&& (await record(p)).help.picture,'read-to-build keeps disclosures');
    await tap(p,'choose');
   }
   eq(await p.evaluate(()=>window.__soundsSpeech),0,'workbench triggers no speech');
   await p.locator('[data-wrs-case=middle][data-wrs-mode=listen]').focus();await p.keyboard.press('Enter');
   eq((await child(p)).selectedId,'middle','keyboard chooses a case');
   await tap(p,'leave');ok(await p.locator('[data-wr-word=mat]').isVisible(),'old labels remain open');
   const oldSource=(await read(p)).wordRoom.source;await tap(p,'enter');eq((await read(p)).wordRoom.source,oldSource,'entry preserves old label collection');
   const before=await read(p);await p.goto(base+'#notes');await p.locator('#download').waitFor();
   await p.locator('summary').filter({hasText:'Word Workshop: Prop Box'}).tap();await p.locator('summary').filter({hasText:'Sound-changing prop labels'}).tap();
   ok((await p.locator('main').innerText()).includes('Sound-changing prop labels'),'Notes summary integrated');
   const download=await Promise.all([p.waitForEvent('download'),p.locator('#download').tap()]).then(x=>x[0]);const file=`${out}/notes-${width}.json`;await download.saveAs(file);
   const payload=JSON.parse(readFileSync(file,'utf8'));eq(payload.wordRoom,before.wordRoom,'actual Notes download preserves both sets of work');
   await p.locator('#progress-file').setInputFiles(file);await p.locator('#progress-import-confirm').waitFor();await p.locator('#progress-import-confirm').tap();
   await p.goto(base+'#words/props');await p.locator('[data-wr-sounds-active]').waitFor();eq((await read(p)).wordRoom,before.wordRoom,'real import preserves frozen cases and label work');
   const importedBook=await read(p);
   await p.locator('#explorer-switch').tap();await p.locator('[data-select-explorer=explorer-1]').tap();await p.locator('[data-word-room-root]').waitFor();
   if(!await p.locator('[data-wr-sounds-active]').count())await tap(p,'enter');await tap(p,'choose');await choose(p,'middle','read');await tap(p,'build');await tap(p,'clear');
   await p.locator('#explorer-switch').tap();await p.locator('[data-select-explorer=explorer-2]').tap();await p.locator('[data-wr-sounds-active]').waitFor();eq(await read(p),importedBook,'editing another explorer preserves imported notebook');
  }finally{await c.close();}
 }
 // Refused disclosures, saved source isolation, storage status and late route/reset controls.
 const seed=fixture();enterSoundMessages(seed,{canExport:()=>true});chooseSoundCase(seed,'middle','listen',{canExport:()=>true});
 actSoundCase(seed,'partner',null,{canExport:()=>true});actSoundCase(seed,'hidePartner',null,{canExport:()=>true});
 seed.wordRoom.soundMessages.records.end={opaque:['retain']};delete seed.wordRoom.soundMessages.source.cases.middle;
 let{c,p}=await setup(820,1000,seed);
 try{
  await hidden(p,'cot');const before=await read(p);await p.evaluate(()=>window.__soundsRefuse=true);await tap(p,'word');eq(await read(p),before,'refused reveal writes nothing');await hidden(p,'cot');
  ok((await p.locator('#wr-status').innerText()).includes('not enough room'));ok(await p.locator('#wr-status').evaluate(e=>e===document.activeElement));
  await p.evaluate(()=>window.__soundsRefuse=false);await letters(p,'fff');await tap(p,'compare');eq((await record(p)).comparison.result,'different');await tap(p,'back');await tap(p,'keep');eq((await record(p)).firstKept.slots,[...'fff'],'unexpected combination kept without error gate');
  eq((await child(p)).records.end,{opaque:['retain']});await tap(p,'choose');ok(await p.locator('[data-wrs-case=middle]').count()===2,'omitted own-source case remains on Earlier labels');
  await choose(p,'middle','listen');await p.evaluate(()=>window.__soundsStorageFail=true);await tap(p,'clear');ok((await p.locator('#wr-status').innerText()).includes('saving failed'),'failure keeps in-memory play honest');
  await p.evaluate(()=>window.__soundsStorageFail=false);await p.evaluate(()=>window.__soundsRouteLate=document.querySelector('[data-wrs-action=keep]'));
  await p.goto(base+'#notes');await p.locator('#download').waitFor();const held=await read(p);await p.evaluate(()=>window.__soundsRouteLate.click());eq(await read(p),held,'departed controls inert');
  await p.locator('#remember').uncheck();await p.goto(base+'#words/props');await p.locator('[data-wr-sounds-active]').waitFor();await tap(p,'keep');ok((await p.locator('#wr-status').innerText()).includes('saving is off'),'save-off material can still be kept');
  await p.goto(base+'#notes');await p.locator('#reset').tap();await p.locator('#confirm-reset').tap();await p.goto(base+'#words/props');await p.locator('[data-word-room-root]').waitFor();eq(Object.hasOwn(await read(p),'wordRoom'),false,'reset restores a pure preview');
 }finally{await c.close();}
 // A script-held entry control behind the parent's recovery modal must be inert.
 const modalSeed=fixture();enterSoundMessages(modalSeed,{canExport:()=>true});modalSeed.wordRoom.soundMessages.active=false;
 ({c,p}=await setup(820,1000,modalSeed));try{
  await p.locator('.wr-grownups summary').tap();await p.locator('[data-wr-action=recover]').tap();const held=await read(p);
  await p.evaluate(()=>document.querySelector('[data-wrs-action=enter]').click());eq(await read(p),held,'entry behind parent modal is inert');
  await p.locator('[data-wr-action=cancel]').tap();await tap(p,'enter');ok(await p.locator('[data-wr-sounds-active]').isVisible(),'entry works after modal cancel');
 }finally{await c.close();}
 const unknown=fixture();enterSoundMessages(unknown,{canExport:()=>true});unknown.wordRoom.soundMessages.v=9;const raw=structuredClone(unknown.wordRoom.soundMessages);
 ({c,p}=await setup(820,1000,unknown));try{ok(await p.locator('[data-wr-word=mat]').isVisible(),'unknown child does not hide old labels');await tap(p,'enter');eq((await read(p)).wordRoom.soundMessages,raw,'unknown child not replaced');}finally{await c.close();}
 eq(errors,[],'no page errors');console.log(`Sound-changing Prop Box browser: ${n} assertions passed. Artifacts: ${out}`);
}finally{await b.close();}
