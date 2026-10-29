import assert from 'node:assert/strict';
import {createSoundWindowPlayer,SOUND_TONE_MODEL} from '../dist/sound-window-audio.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
function fixture(delayed=false){
 const contexts=[],timers=new Map();let next=0;
 class Param{constructor(){this.calls=[];}setValueAtTime(...x){this.calls.push(['set',...x]);}linearRampToValueAtTime(...x){this.calls.push(['ramp',...x]);}cancelScheduledValues(...x){this.calls.push(['cancel',...x]);}}
 class Audio{
  constructor(){this.state='suspended';this.currentTime=0;this.destination={};this.nodes=[];this.resumes=[];this.suspends=0;contexts.push(this);}
  resume(){if(!delayed){this.state='running';return Promise.resolve();}return new Promise(resolve=>this.resumes.push(()=>{this.state='running';resolve();}));}
  suspend(){this.suspends++;this.state='suspended';return Promise.resolve();}
  createOscillator(){const n={frequency:new Param(),starts:[],stops:[],disconnected:false,connect(){},disconnect(){this.disconnected=true;},start(t){this.starts.push(t);},stop(t){this.stops.push(t);}};this.nodes.push(n);return n;}
  createGain(){const n={gain:new Param(),disconnected:false,connect(){},disconnect(){this.disconnected=true;}};this.nodes.push(n);return n;}
 }
 const player=createSoundWindowPlayer({AudioContext:Audio,setTimeout:(fn,ms)=>{const id=++next;timers.set(id,{fn,ms});return id;},clearTimeout:id=>timers.delete(id)});
 const finish=()=>{for(const [id,{fn}]of [...timers.entries()]){timers.delete(id);fn();}};return {player,contexts,timers,finish};
}
for(const frequency of [220,440])for(const gain of [.0125,.025]){
 const f=fixture(),statuses=[];ok(f.contexts.length===0,'player creation is silent and lazy');const result=await f.player.play({frequency,gain},{onStatus:s=>statuses.push(s.status)}),ctx=f.contexts[0];ok(result.status==='scheduled','scheduled is nominal status');ok(ctx.nodes.length===2&&ctx.nodes[0].type==='sine','one oscillator and gain, not recordings');assert.deepEqual(ctx.nodes[0].frequency.calls,[['set',frequency,.025]]);checks++;
 const envelope=ctx.nodes[1].gain.calls;ok(envelope[0][1]===0&&envelope[1][1]===gain&&envelope.at(-1)[1]===0,'zero-to-capped-peak-tozero envelope');ok(envelope[1][2]===.025+.015,'attack exact nominal time');ok(Math.abs(envelope[2][2]-(.625-.035))<1e-12,'release hold exact');ok([...f.timers.values()][0].ms===625,'one bounded scheduled duration');f.finish();await flush();ok(ctx.state==='suspended'&&ctx.nodes.every(n=>n.disconnected)&&f.timers.size===0,'end cleans nodes/timer and suspends');ok(statuses.at(-1)==='ended','ended never claims heard');
}
{
 const f=fixture();for(const plan of [null,{},[],{frequency:0,gain:.025},{frequency:440,gain:1},{frequency:NaN,gain:.0125}])ok((await f.player.play(plan)).status==='invalid','unsupported plan refused');ok(f.contexts.length===0,'invalid plan creates no context');
}
{
 const f=fixture(true),statuses=[],plan={frequency:220,gain:.0125},pending=f.player.play(plan,{onStatus:s=>statuses.push(s.status)});await flush();const ctx=f.contexts[0];ok(ctx.resumes.length===1,'resume genuinely pending');plan.frequency=440;plan.gain=.025;await f.player.stop('route');ctx.resumes[0]();const result=await pending;ok(result.status==='cancelled'&&ctx.nodes.length===0&&f.timers.size===0,'stale resume schedules no nodes or timers');ok(ctx.state==='suspended','delayed stale resume eventually returns idle context to suspended');ok(statuses.at(-1)==='stopped'&&!statuses.includes('scheduled'),'no stale success status');
}
{
 const f=fixture(true),first=f.player.play({frequency:220,gain:.0125});await flush();const ctx=f.contexts[0];const second=f.player.play({frequency:440,gain:.025});await flush();ok(ctx.resumes.length===2,'new request owns a separate pending resume');ctx.resumes[1]();ok((await second).status==='scheduled','new request schedules');const count=ctx.suspends;ctx.resumes[0]();ok((await first).status==='cancelled','old request cancelled');ok(ctx.state==='running'&&ctx.suspends===count,'old completion cannot suspend newer active tone');ok(ctx.nodes[0].frequency.calls[0][1]===440,'new frequency retained');await f.player.stop();ok(ctx.state==='suspended'&&f.timers.size===0,'explicit Stop cleans newer tone');
}
{
 const f=fixture(true),plan={frequency:220,gain:.0125},pending=f.player.play(plan);await flush();const ctx=f.contexts[0];plan.frequency=440;plan.gain=.025;ctx.resumes[0]();await pending;ok(ctx.nodes[0].frequency.calls[0][1]===220&&ctx.nodes[1].gain.calls[1][1]===.0125,'async plan captured before caller edits');await f.player.stop();
}
{
 const statuses=[],player=createSoundWindowPlayer({AudioContext:class{constructor(){throw Error('Synthetic unavailable');}}});ok((await player.play({frequency:220,gain:.0125},{onStatus:s=>statuses.push(s)})).status==='unavailable','unavailable platform handled');ok(statuses.at(-1).message.includes('pictures'),'failure retains silent model route');
}
{
 const f=fixture();const p=f.player.play({frequency:220,gain:.0125},{onStatus:s=>{if(s.status==='requested')void f.player.stop('reentrant stop');}});ok((await p).status==='cancelled'&&f.contexts.length===0,'stopped requested callback cannot allocate audio');
}
ok(SOUND_TONE_MODEL.duration===.6&&SOUND_TONE_MODEL.gains.at(-1)===.025,'nominal duration/peak limits');console.log(`${checks} Sound Window audio lifecycle assertions passed using injected contexts; no acoustic proof`);
