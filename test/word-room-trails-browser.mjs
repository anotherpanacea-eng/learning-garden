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
async function vowelJourney(p,width){
 await tap(p,'word','kit');await counters(p,2);
 await tap(p,'set','vowels');eq(await p.locator('#wr-task').innerText(),'cap','new set starts on cap');
 for(const id of width===820?['cap','cape','kit','kite','pin','pine']:['pine']){
  await tap(p,'word',id);
  if(['pin','pine'].includes(id)){eq(await p.locator('.wrt-map').count(),0,'new use starts in Try');await tap(p,'counter',1);await tap(p,'model');}
  eq(await p.locator('.wrt-print').count(),id.length);eq(await p.locator('.wrt-sound').count(),3);
  await tap(p,'step',1);await tap(p,'step',1);
  eq(await p.locator('.wrt-print.wrt-selected').evaluateAll(xs=>xs.map(x=>x.parentElement.getAttribute('aria-label'))),id.length===4?['Letter '+id[1],'Letter e']:['Letter '+id[1]],'only the vowel letters highlight');
  eq(await p.locator('.wrt-sound.wrt-selected').count(),1,'the vowel is one phoneme');
  if(width===820&&id==='cape'){
   const cdp=await p.context().newCDPSession(p),{nodes}=await cdp.send('Accessibility.getFullAXTree');
   const map=nodes.find(n=>n.role?.value==='group'&&n.name?.value==='cape: Our sound model');
   ok(map?.description?.value.includes('Letters a and e go with Sound 2.')&&map.description.value.includes('Letter p goes with Sound 3.'),'actual accessibility tree keeps split vowel and consonant separate');await cdp.detach();
   await p.screenshot({path:out+'/cape-vowel-frame.png',fullPage:true});
  }
  await layout(p);
  if(id.length===4){await tap(p,'step',1);await tap(p,'step',1);eq(await p.locator('.wrt-sound.wrt-selected').count(),3);if(width===820)await p.screenshot({path:out+'/final-e-'+id+'.png',fullPage:true});await tap(p,'compare');eq(await p.locator('.wrt-map').count(),2);await layout(p);await tap(p,'back');}
 }
 await p.locator('[data-wrt-note] summary').tap();await p.locator('[data-wrt-note]').evaluate(e=>new Promise(r=>setTimeout(r,0)));
 ok((await p.locator('[data-wrt-note]').innerText()).includes('A cap and a cape. A kit and a kite. A pin by a pine.'));
 await tap(p,'word','kit');await counters(p,1);eq(await p.locator('[data-wrt-note]').evaluate(e=>e.open),true,'note stays available through word changes');
 await tap(p,'set','sounds');eq(await p.locator('.wrt-counter').count(),2,'original kit work retained');
 await tap(p,'set','vowels');eq(await p.locator('.wrt-counter').count(),1,'vowel kit is independent');await tap(p,'compare');await tap(p,'set','sounds');await tap(p,'set','vowels');eq(await p.locator('#wr-task').innerText(),'kit and kite','set restores Compare view');await tap(p,'back');
 await tap(p,'leave');await tap(p,'enter');eq(await p.locator('.wrt-counter').count(),1,'re-entry resumes last set');
 await p.screenshot({path:out+'/final-e-return-'+width+'.png',fullPage:true});
}

async function sentenceJourney(p,width){
 await tap(p,'set','sentences');eq(await p.locator('#wr-task').innerText(),'have','new sentence set starts with have');eq(await p.locator('[data-wrt-note]').evaluate(e=>e.open),false,'new show note waits for its own request');
 const records={have:['have','We have a cape.'],cave:['cave','The puppet waits by a cave.'],give:['give','Please give the puppet a cape.'],five:['five','There are five stars.'],'live-here':['live here','The puppets live here by the river.'],'live-show':['live show','We are watching a live show.']};
 for(const id of width===820?Object.keys(records):['live-here','live-show']){
  await tap(p,'word',id);eq(await p.locator('#wr-task').innerText(),records[id][0]);eq(await p.locator('.wrt-task > .wrt-context').innerText(),records[id][1]);
  if(id.startsWith('live-')){if(width===820)ok(await p.locator('.wrt-task').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'tablet opening live Try fits with its context and controls');eq(await p.locator('.wrt-map').count(),0,'live starts in Try');await tap(p,'counter',1);await tap(p,'model');}
  eq(await p.locator('.wrt-print').count(),4);eq(await p.locator('.wrt-sound').count(),3);
  await tap(p,'step',1);await tap(p,'step',1);
  const vowel=['have','cave'].includes(id)?'a':'i',split=['cave','five','live-show'].includes(id);
  eq(await p.locator('.wrt-print.wrt-selected').evaluateAll(xs=>xs.map(x=>x.parentElement.getAttribute('aria-label'))),split?['Letter '+vowel,'Letter e']:['Letter '+vowel]);
  eq(await p.locator('.wrt-sound.wrt-selected').count(),1);eq(await p.locator('.wrt-task > .wrt-context').innerText(),records[id][1],'context survives model steps');
  await layout(p);
  if(width===820){
   ok(await p.locator('.wrt-task').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'tablet current word, context, work mat and primary actions fit together');
   for(let frame=2;frame<4;frame++)await tap(p,'step',1);
   eq(await p.locator('.wrt-sound.wrt-selected').count(),3);ok(await p.locator('.wrt-task').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'tablet final explanation and all primary controls fit together');
   await p.screenshot({path:out+'/sentences-'+id+'.png',fullPage:true});
  }
  if(['cave','five','live-show'].includes(id)){
   await tap(p,'compare');eq(await p.locator('.wrt-map').count(),2);eq(await p.locator('.wrt-pair .wrt-context').count(),2);await layout(p);
   if(id==='live-show'){
    eq(await p.locator('.wrt-pair h3').allTextContents(),['live here','live show']);
    const cdp=await p.context().newCDPSession(p),{nodes}=await cdp.send('Accessibility.getFullAXTree');
    for(const[name,description]of[['live here','Letters v and e go with Sound 3.'],['live show','Letters i and e go with Sound 2.']]){
     const map=nodes.find(n=>n.role?.value==='group'&&n.name?.value===name+': Our sound model');ok(map?.description?.value.includes(description),'distinct actual AX model: '+name);
    }
    await cdp.detach();await p.screenshot({path:out+'/live-compare-'+width+'.png',fullPage:true});
    await tap(p,'set','vowels');await tap(p,'set','sentences');eq(await p.locator('#wr-task').innerText(),'two meanings of live','third set retains Compare');
   }
   await tap(p,'back');eq(await p.locator('.wrt-task > .wrt-context').innerText(),records[id][1]);
  }
 }
 await tap(p,'word','live-here');await tap(p,'try');await tap(p,'counter',1);eq(await p.locator('.wrt-counter').count(),2);
 await tap(p,'word','live-show');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),1,'identical printed live has independent work');
 ok(!/live-here|live-show/.test(await p.locator('[data-wrt-root]').innerText()),'internal ids absent from visible text');
 await p.locator('[data-wrt-note] summary').tap();eq(await p.locator('[data-wrt-note]').evaluate(e=>e.open),true,'own show note opened by its control');eq(await p.locator('[data-wrt-note] > p').allTextContents(),['We have five stars. Please give them to the puppets.','They live by the cave. Tonight is a live show.','Read both notes together. The sentence helps us choose what live means. Your partner can supply any word.']);
 await tap(p,'set','sounds');eq(await p.locator('.wrt-counter').count(),2,'original kit retains its work across all three sets');
 await tap(p,'set','vowels');eq(await p.locator('.wrt-counter').count(),1,'vowel kit retains its own work');
 await tap(p,'set','sentences');eq(await p.locator('.wrt-counter').count(),1,'sentence visit restored');
 await tap(p,'leave');await tap(p,'enter');eq(await p.locator('#wr-task').innerText(),'live show');eq(await p.locator('.wrt-counter').count(),1,'re-entry resumes third set');
}


async function longOJourney(p,width){
 await tap(p,'set','vowels');await p.locator('[data-wrt-note] summary').tap();eq(await p.locator('[data-wrt-note]').evaluate(e=>e.open),true,'earlier note really open before set change');
 await tap(p,'set','long-o');eq(await p.locator('#wr-task').innerText(),'not');eq(await p.locator('[data-wrt-note]').evaluate(e=>e.open),false,'o-note does not inherit another note');
 for(const id of width===820?['not','note','hop','hope','rod','rode']:['rod','rode']){
  await tap(p,'word',id);eq(await p.locator('#wr-task').innerText(),id);ok((await p.locator('.wrt-task > .wrt-context').innerText()).length>0);
  if(['rod','rode'].includes(id)){
   eq(await p.locator('.wrt-map').count(),0,'new use opens in Try');
   if(width===820)ok(await p.locator('.wrt-task').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'o-set opening Try fits tablet');
   for(let i=0;i<(id==='rod'?2:1);i++)await tap(p,'counter',1);await tap(p,'model');
  }
  eq(await p.locator('.wrt-print').count(),id.length);eq(await p.locator('.wrt-sound').count(),3);
  for(let i=0;i<2;i++)await tap(p,'step',1);
  eq(await p.locator('.wrt-print.wrt-selected').evaluateAll(xs=>xs.map(x=>x.parentElement.getAttribute('aria-label'))),id.length===4?['Letter o','Letter e']:['Letter o']);eq(await p.locator('.wrt-sound.wrt-selected').count(),1);
  if(width===820){for(let i=0;i<2;i++)await tap(p,'step',1);ok(await p.locator('.wrt-task').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'o-set final frame, context and primary controls fit tablet');await p.screenshot({path:out+'/long-o-'+id+'.png',fullPage:true});}
  await layout(p);
  if(id==='hop')eq(await p.locator('.wrt-prop > .wr-picture').count(),1,'existing hop picture reused through original seam');
  if(id.length===4){
   await tap(p,'compare');eq(await p.locator('.wrt-map').count(),2);eq(await p.locator('.wrt-pair .wrt-context').count(),2);await layout(p);
   if(id==='rode'){
    const cdp=await p.context().newCDPSession(p),{nodes}=await cdp.send('Accessibility.getFullAXTree');
    const model=nodes.find(n=>n.role?.value==='group'&&n.name?.value==='rode: Our sound model');ok(model?.description?.value.includes('Letters o and e go with Sound 2.')&&model.description.value.includes('Letter d goes with Sound 3.'),'o/e and d remain distinct in actual AX tree');await cdp.detach();
    await p.screenshot({path:out+'/long-o-compare-'+width+'.png',fullPage:true});
   }
   await tap(p,'back');
  }
 }
 await tap(p,'word','rod');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),2);await tap(p,'word','rode');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),1,'rod and rode retain independent own work');
 await tap(p,'compare');
 for(const[set,label,count]of[['sounds','kit',2],['vowels','kit',1],['sentences','live show',1]]){await tap(p,'set',set);eq(await p.locator('#wr-task').innerText(),label);eq(await p.locator('.wrt-counter').count(),count,'earlier set keeps its waiting work');}
 await tap(p,'set','long-o');eq(await p.locator('#wr-task').innerText(),'rod and rode','fourth set restores Compare');await tap(p,'back');eq(await p.locator('.wrt-counter').count(),1);
 await p.locator('[data-wrt-note] summary').tap();eq(await p.locator('[data-wrt-note]').evaluate(e=>e.open),true);ok((await p.locator('[data-wrt-note]').innerText()).includes('Do not hop by the rod. A note says we rode home. We hope to rest.'));
 await tap(p,'leave');await tap(p,'enter');eq(await p.locator('#wr-task').innerText(),'rode');eq(await p.locator('.wrt-counter').count(),1,'re-entry resumes fourth set');
}

async function longUJourney(p,width){
 if(!await p.locator('[data-wrt-note]').evaluate(e=>e.open))await p.locator('[data-wrt-note] summary').tap();
 eq(await p.locator('[data-wrt-note]').evaluate(e=>e.open),true,'earlier o-note is open before set change');
 await tap(p,'set','long-u');eq(await p.locator('#wr-task').innerText(),'tub');eq(await p.locator('[data-wrt-note]').evaluate(e=>e.open),false,'u-note does not inherit o-note');
 for(const id of width===820?['tub','tube','cub','cube','cut','cute']:['cute','cube']){
  await tap(p,'word',id);eq(await p.locator('#wr-task').innerText(),id);
  if(['cut','cute'].includes(id)){
   eq(await p.locator('.wrt-map').count(),0,'cut/cute start with own counters');
   if(width===820)ok(await p.locator('.wrt-task').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'u-set opening counter task fits tablet');
   await tap(p,'counter',1);
  }
  if(['cut','cute'].includes(id))await tap(p,'model');
  eq(await p.locator('.wrt-model figcaption').innerText(),'Our spelling pattern');
  eq(await p.locator('.wrt-sound').count(),0,'no supplied sound dots');eq(await p.getByRole('img',{name:/^Sound [0-9]/}).count(),0,'no numbered sound targets');
  await tap(p,'step',1);await tap(p,'step',1);
  eq(await p.locator('.wrt-print.wrt-selected').evaluateAll(xs=>xs.map(x=>x.parentElement.getAttribute('aria-label'))),id.length===4?['Letter u','Letter e']:['Letter u']);
  if(width===820){await tap(p,'step',1);await tap(p,'step',1);ok(await p.locator('.wrt-task').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'long final spelling frame fits tablet');await p.screenshot({path:out+'/long-u-'+id+'.png',fullPage:true});}
  await layout(p);
  if(id.length===4){
   await tap(p,'compare');eq(await p.locator('.wrt-map').count(),2);eq(await p.locator('.wrt-pair .wrt-context').count(),2);
   if(id==='cube'){
    const cdp=await p.context().newCDPSession(p),{nodes}=await cdp.send('Accessibility.getFullAXTree');
    const pattern=nodes.find(n=>n.role?.value==='group'&&n.name?.value==='cube: Our spelling pattern');ok(pattern?.description?.value==='Letters u and e go together in this spelling pattern.','actual AX group describes spelling, not a count');await cdp.detach();
    await p.screenshot({path:out+'/long-u-compare-'+width+'.png',fullPage:true});
   }
   await tap(p,'back');
  }
 }
 await tap(p,'word','cute');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),1,'cute counters survive spelling and Compare');await tap(p,'compare');
 for(const[set,label,count]of[['sounds','kit',2],['vowels','kit',1],['sentences','live show',1],['long-o','rode',1]]){await tap(p,'set',set);eq(await p.locator('#wr-task').innerText(),label);eq(await p.locator('.wrt-counter').count(),count,'earlier set waiting work retained');}
 await tap(p,'set','long-u');eq(await p.locator('#wr-task').innerText(),'cut and cute','fifth set restores Compare');await tap(p,'back');eq(await p.locator('.wrt-counter').count(),1);
 await p.locator('[data-wrt-note] summary').tap();ok((await p.locator('[data-wrt-note]').innerText()).includes('Props for the show'));await tap(p,'model');eq(await p.locator('[data-wrt-note]').evaluate(e=>e.open),true,'same-set turn preserves requested note');await tap(p,'try');
 await tap(p,'leave');await tap(p,'enter');eq(await p.locator('#wr-task').innerText(),'cute');eq(await p.locator('.wrt-counter').count(),1,'re-entry resumes fifth set');
}

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
   await vowelJourney(p,width);await sentenceJourney(p,width);await longOJourney(p,width);await longUJourney(p,width);
   eq(await read(p),before,'pure journey preserves full notebook');eq(await disk(p),saved,'pure journey performs no storage write');eq(await p.evaluate(()=>window.__trailSpeak),0,'no speech playback');
   await p.screenshot({path:out+'/counters-'+width+'.png',fullPage:true});
   await p.evaluate(()=>window.__trailLate=document.querySelector('[data-wrt-action=counter][data-wrt-value="1"]'));
   await p.goto(base+'#words');await p.locator('[data-wrt-root]').waitFor({state:'detached'});await p.goto(base+'#words/props');await tap(p,'enter');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'route exit ends visit');await p.evaluate(()=>window.__trailLate.click());eq(await p.locator('.wrt-counter').count(),0,'detached control inert');await tap(p,'set','vowels');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'route exit clears vowel work too');await tap(p,'set','sentences');await tap(p,'word','live-here');eq(await p.locator('.wrt-counter').count(),0,'route exit clears sentence work too');await tap(p,'set','long-o');await tap(p,'word','rod');eq(await p.locator('.wrt-counter').count(),0,'route exit clears o work too');await tap(p,'set','long-u');await tap(p,'word','cute');eq(await p.locator('.wrt-counter').count(),0,'route exit clears u work too');
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
 const unsupported=fixture();unsupported.wordRoom={version:999,privateFuture:'keep verbatim'};const{c,p}=await setup(unsupported);try{const before=await read(p);await tap(p,'enter');await counters(p,1);await tap(p,'set','vowels');await counters(p,2);await tap(p,'set','sentences');await counters(p,4);await tap(p,'set','long-o');await counters(p,5);await tap(p,'set','long-u');await counters(p,1);await tap(p,'leave');eq(await read(p),before);ok(await p.locator('[data-wr-action=recover]').isVisible(),'unsupported old work remains recoverable');}finally{await c.close();}

 // Recovery clears counters after a successful commit, never after a refused one.
 {const seed=fixture();seed.wordRoom={version:999,future:'keep'};const{c,p}=await setup(seed);try{
  await tap(p,'enter');await counters(p,2);await tap(p,'set','vowels');await counters(p,3);await tap(p,'set','sentences');await counters(p,4);await tap(p,'set','long-o');await counters(p,5);await tap(p,'set','long-u');await counters(p,1);await tap(p,'leave');await p.locator('[data-wr-action=recover]').tap();await p.evaluate(()=>window.__trailRefuse=true);await p.locator('[data-wr-action=confirm]').tap();await tap(p,'enter');eq(await p.locator('.wrt-counter').count(),1,'refused recovery keeps u visit');await tap(p,'set','long-o');eq(await p.locator('.wrt-counter').count(),5,'refused recovery keeps o visit');await tap(p,'set','sentences');eq(await p.locator('.wrt-counter').count(),4,'refused recovery keeps sentence visit');await tap(p,'set','vowels');eq(await p.locator('.wrt-counter').count(),3,'refused recovery keeps vowel visit');await tap(p,'set','sounds');eq(await p.locator('.wrt-counter').count(),2,'refused recovery keeps original visit');await tap(p,'leave');
  await p.evaluate(()=>window.__trailRefuse=false);await p.locator('[data-wr-action=recover]').tap();await p.locator('[data-wr-action=confirm]').tap();await tap(p,'enter');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'successful recovery ends original visit');eq(await p.locator('[data-wrt-action=set][data-wrt-value=sounds]').getAttribute('aria-pressed'),'true','successful recovery resets set');await tap(p,'set','vowels');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'successful recovery clears vowel visit');await tap(p,'set','sentences');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'successful recovery clears sentence visit');await tap(p,'set','long-o');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'successful recovery clears o visit');await tap(p,'set','long-u');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,'successful recovery clears u visit');
 }finally{await c.close();}}
 async function ready(p){await p.locator('[data-word-room-root],[data-select-explorer]').first().waitFor();if(await p.locator('[data-select-explorer]').count()){const id=await p.evaluate(()=>JSON.parse(localStorage.getItem('learning-garden-explorers')).activeId);await p.locator('[data-select-explorer="'+id+'"]').tap();}await p.locator('[data-word-room-root]').waitFor();}
 for(const event of['owner','import','reset','reload']){
  const{c,p}=await setup();try{
   await tap(p,'enter');await counters(p,2);await tap(p,'set','vowels');await counters(p,3);await tap(p,'set','sentences');await counters(p,4);await tap(p,'set','long-o');await counters(p,5);await tap(p,'set','long-u');await counters(p,1);await p.evaluate(()=>window.__trailEventLate=document.querySelector('[data-wrt-action=counter][data-wrt-value="1"]'));
   if(event==='owner'){await p.locator('#explorer-switch').tap();await p.locator('#explorer-new').tap();await p.locator('#explorer-create').tap();}
   else if(event==='reload')await p.reload();
   else{
    await p.goto(base+'#notes');
    if(event==='reset'){await p.locator('#reset').tap();await p.locator('#confirm-reset').tap();}
    else{const[download]=await Promise.all([p.waitForEvent('download'),p.locator('#download').tap()]);const bytes=await readFile(await download.path());await p.locator('#progress-file').setInputFiles({name:'synthetic-trail.json',mimeType:'application/json',buffer:bytes});await p.locator('#progress-import-confirm').tap();}
    await p.goto(base+'#words/props');
   }
   await ready(p);await tap(p,'enter');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,event+' starts a fresh visit');
   await tap(p,'set','vowels');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,event+' clears vowel work too');await tap(p,'set','sentences');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,event+' clears sentence work too');await tap(p,'set','long-o');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,event+' clears o work too');await tap(p,'set','long-u');await tap(p,'try');eq(await p.locator('.wrt-counter').count(),0,event+' clears u work too');
   if(event!=='reload'){await p.evaluate(()=>window.__trailEventLate.click());eq(await p.locator('.wrt-counter').count(),0,event+' invalidates previous controls');}
  }finally{await c.close();}
 }
 {const{c,p}=await setup();try{await p.goto(base+'#notes');await p.locator('#remember').uncheck();await p.goto(base+'#words/props');const saved=await disk(p);await tap(p,'enter');await counters(p,2);await tap(p,'set','vowels');await counters(p,3);await tap(p,'set','sentences');await counters(p,4);await tap(p,'set','long-o');await counters(p,5);await tap(p,'set','long-u');await counters(p,1);eq(await disk(p),saved,'saving off does not block counters or write storage');}finally{await c.close();}}
 eq(errors,[],'no browser errors');console.log('Sound trails native: '+assertions+' assertions passed. Artifacts: '+out);
}finally{await browser.close();await new Promise(r=>server.close(r));}
