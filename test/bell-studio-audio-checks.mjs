import assert from 'node:assert/strict';
import {createBellPlayer} from '../dist/bell-studio-audio.mjs';
let count=0;const ok=(v,m)=>{assert.ok(v,m);count++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;};
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
function environment(config={}){
 const e={config,contexts:[],nodes:[],gains:[],timers:new Map(),now:0,next:0,resumes:[],statuses:[]};
 e.later=(fn,ms)=>{if(config.timerFail)throw Error('fictional timer failure');const id=++e.next;e.timers.set(id,{fn,time:e.now+ms});return id;};
 e.clear=id=>e.timers.delete(id);
 e.advance=ms=>{const end=e.now+ms;for(let k=0;k<100;k++){const next=[...e.timers.entries()].sort((a,b)=>a[1].time-b[1].time).find(([,v])=>v.time<=end);if(!next)break;e.now=next[1].time;e.timers.delete(next[0]);next[1].fn();}e.now=end;};
 const param=()=>({calls:[],setValueAtTime(value,time){if(config.paramFail)throw Error('fictional parameter failure');this.calls.push(['set',value,time]);},linearRampToValueAtTime(value,time){this.calls.push(['ramp',value,time]);},cancelScheduledValues(time){this.calls.push(['cancel',time]);}});
 class Context{
  constructor(){if(config.constructorFail)throw Error('fictional unavailable browser');this.state='suspended';this.destination={};this.resumeCount=0;this.suspendCount=0;e.contexts.push(this);}
  get currentTime(){return 10+e.now/1000;}
  resume(){this.resumeCount++;if(config.resume==='reject')return Promise.reject(Error('fictional resume rejection'));if(config.resume==='suspended')return Promise.resolve();if(config.resume==='defer')return new Promise((resolve,reject)=>e.resumes.push({resolve:()=>{this.state='running';resolve();},reject}));this.state='running';return Promise.resolve();}
  suspend(){this.suspendCount++;if(config.suspendThrows)throw Error('fictional suspend failure');if(config.suspendReject)return Promise.reject(Error('fictional suspend rejection'));this.state='suspended';return Promise.resolve();}
  createOscillator(){if(config.oscFailAt===e.nodes.length+1)throw Error('fictional oscillator failure');const o={type:null,frequency:param(),starts:[],stops:[],disconnected:0,onended:null,connect(target){if(config.connectFail)throw Error('fictional connection failure');this.target=target;},start(time){if(config.startFail)throw Error('fictional start failure');this.starts.push(time);},stop(time){this.stops.push(time);if(config.cleanupThrows&&this.stops.length>1)throw Error('fictional already ended');},disconnect(){this.disconnected++;if(config.cleanupThrows)throw Error('fictional disconnect failure');}};e.nodes.push(o);return o;}
  createGain(){if(config.gainFail)throw Error('fictional gain failure');const g={gain:param(),disconnected:0,connect(target){this.target=target;},disconnect(){this.disconnected++;if(config.cleanupThrows)throw Error('fictional disconnect failure');}};e.gains.push(g);return g;}
 }
 e.Context=Context;e.player=createBellPlayer({AudioContext:Context,setTimeout:e.later,clearTimeout:e.clear});return e;
}
{
 const e=environment(),events=[],steps=[];eq(e.contexts.length,0,'factory creates no audio context');e.player.stop('initial-render');eq(e.contexts.length,0,'lifecycle stop before play does not initialize audio');
 const receipt=await e.player.play(['low','rest','middle','high'],{onStatus:v=>events.push(v),onStep:i=>steps.push(i)});eq(receipt,{status:'started',duration:2});eq(e.contexts.length,1);eq(e.nodes.length,3,'rest schedules no oscillator');eq(e.nodes.map(n=>n.type),['sine','sine','sine']);eq(e.nodes.map(n=>n.frequency.calls[0][1]),[220,330,440]);
 for(const [i,n] of e.nodes.entries()){ok(Math.abs(n.stops[0]-n.starts[0]-.35)<1e-9,'tone has finite .35 second stop');const calls=e.gains[i].gain.calls;eq(calls.map(c=>c[0]),['set','ramp','set','ramp']);eq(calls.map(c=>c[1]),[0,.025,.025,0],'fixed identical digital gain envelope');ok(Math.abs(calls[1][2]-n.starts[0]-.015)<1e-9);ok(Math.abs(n.stops[0]-calls[2][2]-.035)<1e-9);}
 e.advance(2026);eq(steps,[0,1,2,3]);eq(events.at(-1).status,'completed');ok(events.at(-1).message.includes('does not tell us what someone heard'));eq(e.timers.size,0);ok(e.nodes.every(n=>n.disconnected>0));ok(e.contexts[0].suspendCount>0,'finished player releases running audio');
}
{
 const e=environment(),seq=Array(8).fill('high');await e.player.play(seq);eq(e.nodes.length,8);ok(e.nodes.every((n,i)=>i===0||n.starts[0]>=e.nodes[i-1].stops[0]),'notes do not overlap');ok(e.nodes.at(-1).stops[0]-e.nodes[0].starts[0]<=4,'bounded total sounding interval');seq[0]='low';eq(e.nodes[0].frequency.calls[0][1],440,'scheduled snapshot isolated from edited input');e.player.stop('edit');eq(e.timers.size,0);for(const n of e.nodes){ok(n.stops.at(-1)<n.starts[0]||n.starts[0]===e.nodes[0].starts[0],'future nodes stopped before their scheduled start');ok(n.disconnected>0);}eq(e.contexts.length,1);
}
{
 const e=environment(),ends=[],statuses=[];await e.player.play(['low','high'],{onEnd:x=>ends.push(x),onStatus:x=>statuses.push(x)});e.advance(30);e.player.stop('navigation');const stopped=ends.length;e.advance(5000);eq(ends.length,stopped,'cancelled timers never finish again');eq(ends[0].status,'stopped');eq(ends[0].reason,'navigation');eq(statuses.at(-1).status,'stopped');eq(e.timers.size,0);ok(e.gains.every(g=>g.gain.calls.some(c=>c[0]==='set'&&c[1]===0&&c[2]===10.03)),'stop drops gain immediately');
}
{
 const e=environment({resume:'defer'}),events=[];const p=e.player.play(['low','high'],{onStatus:x=>events.push(x)});await flush();eq(e.resumes.length,1);e.player.stop('explorer-switch');e.resumes[0].resolve();eq((await p).status,'cancelled');eq(e.nodes.length,0,'late resume after stop creates no oscillator');eq(e.timers.size,0);eq(events.at(-1).status,'stopped');
}
{
 const e=environment({resume:'defer'}),first=e.player.play(['low']);await flush();const second=e.player.play(['high']);await flush();eq(e.resumes.length,2);e.resumes[1].resolve();eq((await second).status,'started');e.resumes[0].resolve();eq((await first).status,'cancelled');eq(e.nodes.length,1,'overtaken resume cannot layer notes');eq(e.nodes[0].frequency.calls[0][1],440);e.player.stop('stop');
}
{
 const e=environment({resume:'defer'}),first=e.player.play(['low']);await flush();const second=e.player.play(['middle']);await flush();e.resumes[0].reject(Error('fictional old request fails'));eq((await first).status,'cancelled','stale failure cannot cancel current request');e.resumes[1].resolve();eq((await second).status,'started');eq(e.nodes.length,1);e.player.stop();
}
for(const config of [{constructorFail:true},{resume:'reject'},{resume:'suspended'},{oscFailAt:2},{gainFail:true},{paramFail:true},{connectFail:true},{startFail:true},{timerFail:true}]){
 const e=environment(config),events=[],ends=[];const result=await e.player.play(['low','middle','high'],{onStatus:x=>events.push(x),onEnd:x=>ends.push(x)});eq(result.status,'unavailable','failure gives visual fallback');eq(events.at(-1).status,'unavailable');ok(events.at(-1).message.includes('picture call'));eq(ends.length,1);eq(e.timers.size,0);ok(e.nodes.every(n=>n.disconnected>0),'partially created resources disconnected');
 Object.keys(config).forEach(k=>delete config[k]);const again=await e.player.play(['high']);eq(again.status,'started','a fresh explicit Play may recover');e.player.stop('recovery-complete');
}
{
 const events=[];const p=createBellPlayer({AudioContext:undefined});eq((await p.play(['low'],{onStatus:x=>events.push(x)})).status,'unavailable','missing browser API has visual fallback');eq(events.at(-1).status,'unavailable');p.stop();
}
{
 const e=environment(),steps=[],ends=[];eq((await e.player.play(['rest','rest','rest'],{onStep:i=>steps.push(i),onEnd:x=>ends.push(x)})).status,'visual');eq(e.contexts.length,0,'all rests never allocate audio context');eq(e.nodes.length,0);e.advance(1501);eq(steps,[0,1,2]);eq(ends[0],{status:'completed',reason:'',mode:'visual'});eq((await e.player.play([])).status,'empty');eq((await e.player.play(['remote-url'])).status,'invalid');eq((await e.player.play(Array(9).fill('high'))).status,'invalid');eq(e.contexts.length,0);
}
{
 const e=environment({cleanupThrows:true,suspendReject:true});for(let i=0;i<30;i++){eq((await e.player.play(['low','high'])).status,'started');}e.player.stop('rapid-taps');eq(e.contexts.length,1,'repeated requests reuse one context');eq(e.timers.size,0);ok(e.nodes.every(n=>n.stops.length>=2),'even future nodes receive cancellation');ok(e.nodes.every(n=>n.disconnected>0));
}
{
 const e=environment(),events=[];const p=e.player.play(['low'],{onStatus:x=>{events.push(x.status);if(x.status==='requested')e.player.stop('status-callback');}});eq((await p).status,'cancelled');eq(e.contexts.length,0,'a callback stop wins before initialization');eq(e.timers.size,0);
}
{
 const e=environment();await e.player.play(['low'],{onEnd:()=>{throw Error('fictional UI callback');},onStep:()=>{throw Error('fictional step callback');}});e.advance(526);eq(e.timers.size,0,'UI callback failure cannot leak playback');ok(e.nodes[0].disconnected>0);
}
for(const boundary of ['route-change','page-change','card-change','edit','explorer-chooser','explorer-switch','import','reset','film','speech','pagehide','hidden']){
 const e=environment();await e.player.play(['low','middle','high']);e.player.stop(boundary);eq(e.timers.size,0,`${boundary} cancels timers`);ok(e.nodes.every(n=>n.stops.at(-1)<n.starts[0]),`${boundary} cancels future tones`);eq(e.contexts[0].state,'suspended');
}
console.log(`bell studio audio: ${count} checks passed`);
