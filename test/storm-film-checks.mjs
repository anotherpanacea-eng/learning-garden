import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const playback=fs.readFileSync(new URL('../dist/storm-intro.html',import.meta.url),'utf8').split('// ---------- playback ----------')[1].split('// For recording:')[0];
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
function fixture({query='?autoplay=1&embedded=1',reduced=false,unavailable=false,renderFails=false,resumeFails=false}={}){
 let time=0,id=0,renderResolve,renderReject;const frames=new Map(),sources=[],messages=[],drawn=[],events={},contexts=[];
 const score={duration:46};const rendered=new Promise((resolve,reject)=>{renderResolve=resolve;renderReject=reject;});
 const elements=Object.fromEntries(['start','toggle','prog','time','sound'].map(k=>[k,{hidden:k==='sound',disabled:k==='toggle',textContent:k==='toggle'?'Pause':'',style:{},attrs:{},listeners:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,f){this.listeners[k]=f;},click(){this.onclick?.();this.listeners.click?.();}}]));
 class Audio{constructor(){this.currentTime=100;this.destination={};this.resumes=0;this.closed=false;contexts.push(this);}resume(){this.resumes++;return resumeFails?Promise.reject(new Error('Synthetic blocked audio')):Promise.resolve();}close(){this.closed=true;return Promise.resolve();}createBufferSource(){const s={connect(){},disconnect(){this.disconnected=true;},start(when,offset){this.when=when;this.offset=offset;},stop(){this.stopped=true;}};sources.push(s);return s;}}
 class Offline{constructor(ch,len,rate){this.destination={};eq([ch,len,rate],[2,46*48000,48000],'full score rendered once for seeking');}startRendering(){if(renderFails)renderReject(new Error('Synthetic render failure'));return rendered;}}
 const back={},context={document:{getElementById:k=>elements[k],querySelector:()=>back,documentElement:{classList:{add(){}}},body:{}},performance:{now:()=>time},requestAnimationFrame:f=>{frames.set(++id,f);return id;},cancelAnimationFrame:i=>frames.delete(i),draw:t=>drawn.push(t),clamp:x=>Math.max(0,Math.min(1,x)),D:46,window:unavailable?{}:{AudioContext:Audio,OfflineAudioContext:Offline},cv:{addEventListener(){}},addEventListener:(k,f)=>{events[k]=f;},buildAudio(){},URLSearchParams,location:{search:query,origin:'https://synthetic.invalid'},parent:{postMessage:(...args)=>messages.push(args)},matchMedia:()=>({matches:reduced})};
 vm.createContext(context);vm.runInContext(playback,context);
 return {elements,frames,sources,messages,drawn,contexts,events,back,resolve:()=>renderResolve(score),frame(ms){time=ms;const batch=[...frames.values()];frames.clear();batch.forEach(f=>f());},read:code=>vm.runInContext(code,context)};
}
const settle=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};
{
 const f=fixture();eq(f.frames.size,1);eq(f.elements.start.hidden,true);f.frame(10000);eq(f.drawn.at(-1),10);
 f.elements.sound.click();eq(f.read('now()'),10,'turning on sound does not reset picture');eq(f.frames.size,1,'sound adds no animation chain');
 f.frame(12500);f.resolve();await settle();eq(f.sources.length,1);eq(f.sources[0].offset,12.5,'render delay seeks to current picture, not initial click');eq(f.sources[0].when,100);eq(f.elements.sound.textContent,'Turn sound off');
 f.elements.sound.click();eq(f.sources[0].stopped,true);eq(f.read('now()'),12.5,'turning off sound leaves film position');
 f.elements.sound.click();await settle();eq(f.sources[1].offset,12.5,'turn on again seeks same picture');eq(f.frames.size,1);
 f.elements.toggle.click();eq(f.frames.size,0);eq(f.sources[1].stopped,true,'pause stops sound');f.frame(20000);eq(f.read('now()'),12.5,'paused picture holds time');
 f.elements.toggle.click();await settle();eq(f.sources.at(-1).offset,12.5,'resume sound stays with held picture');f.frame(21000);eq(f.drawn.at(-1),13.5);
 f.events.pagehide();eq(f.contexts[0].closed,true);eq(f.sources.at(-1).stopped,true);eq(f.frames.size,0);eq(f.read('now()'),13.5,'pagehide freezes the current picture for a back/forward restore');eq(f.elements.toggle.textContent,'Play');f.frame(30000);f.elements.toggle.click();await settle();eq(f.contexts.length,2,'restored film creates a fresh audio context');eq(f.sources.at(-1).offset,13.5,'restored film resumes at its held picture');
}
{
 const f=fixture();f.frame(8000);f.elements.sound.click();f.elements.toggle.click();f.resolve();await settle();eq(f.sources.length,0,'a late render cannot sound during pause');eq(f.read('now()'),8);
 f.elements.toggle.click();await settle();eq(f.sources[0].offset,8);f.frame(46000);eq(f.read('playing'),false);eq(f.messages.length,1);eq(f.sources[0].stopped,true,'end stops audio');eq(f.frames.size,0);
}
{
 const f=fixture();f.frame(7000);f.elements.sound.click();f.elements.sound.click();f.resolve();await settle();eq(f.sources.length,0,'turning off cancels a pending render');eq(f.read('now()'),7);
}
for(const options of [{unavailable:true},{renderFails:true},{resumeFails:true}]){
 const f=fixture(options);f.frame(6000);f.elements.sound.click();if(!options.unavailable&&!options.renderFails)f.resolve();await settle();eq(f.elements.sound.textContent,'Sound unavailable');f.frame(9000);eq(f.drawn.at(-1),9,'audio failure leaves silent playback moving');eq(f.frames.size,1);
}
{
 const f=fixture({reduced:true});eq(f.frames.size,0);eq(f.elements.start.hidden,false);eq(f.drawn.at(-1),15.2);
 f.elements.sound.click();eq(f.contexts.length,0,'sound preference while paused does not start film or audio');eq(f.frames.size,0);
}
{
 const f=fixture({query:''});eq(f.frames.size,0);eq(f.drawn.at(-1),15.2);f.elements.start.click();eq(f.elements.sound.hidden,false,'manual film also offers sound control');f.resolve();await settle();eq(f.sources[0].offset,0);f.elements.start.click();eq(f.frames.size,1,'restarts keep one frame chain');
}
console.log(`${checks} storm-film playback and synchronized-sound checks passed.`);
