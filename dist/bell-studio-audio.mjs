import {BELL_MODEL} from './bell-studio-content.mjs';
import {bellPlaybackPlan} from './bell-studio-core.mjs';

const unavailable='Sound is unavailable here. You can still build and compare the picture call.';
// Creating a player allocates no browser audio object. Only an explicit Play
// calls play(); the app owns activation, speech exclusion and page lifecycle.
export function createBellPlayer(options={}){
 const Audio=options.AudioContext??globalThis.AudioContext??globalThis.webkitAudioContext;
 const later=options.setTimeout??globalThis.setTimeout,clear=options.clearTimeout??globalThis.clearTimeout;
 let context=null,suspending=Promise.resolve(),active=null,generation=0;
 const call=(fn,value)=>{try{fn?.(value);}catch{}};
 function suspend(){if(!context||context.state==='closed')return;try{suspending=Promise.resolve(context.suspend?.()).catch(()=>{});}catch{suspending=Promise.resolve();}}
 function clean(run){
  for(const id of run.timers)try{clear(id);}catch{}run.timers.clear();
  const now=context?.currentTime??0;
  for(const {osc,gain} of run.nodes){try{gain.gain.cancelScheduledValues(now);gain.gain.setValueAtTime(0,now);}catch{}try{osc.onended=null;osc.stop(now);}catch{}try{osc.disconnect();}catch{}try{gain.disconnect();}catch{}}
  run.nodes.length=0;
 }
 function status(run,value,message){call(run.callbacks.onStatus,{status:value,message});}
 function finish(run,value,reason=''){
  if(active!==run)return;
  active=null;clean(run);suspend();
  const message=value==='completed'?(run.plan.hasSound?'The scheduled call finished. Playback does not tell us what someone heard.':'The picture call finished; its slots were rests.'):value==='unavailable'?unavailable:'Sound stopped.';
  status(run,value,message);call(run.callbacks.onEnd,{status:value,reason,mode:run.plan.hasSound?'audio-request':'visual'});
 }
 function stop(reason='stopped'){
  generation++;
  if(active)finish(active,'stopped',reason);else suspend();
 }
 function timer(run,fn,ms){const id=later(()=>{run.timers.delete(id);if(active===run&&generation===run.token)fn();},ms);run.timers.add(id);}
 async function play(sequence,callbacks={}){
  const token=generation+1;
  stop('new-play');
  if(generation!==token)return {status:'cancelled'};
  const plan=bellPlaybackPlan(sequence);
  if(!plan){call(callbacks.onStatus,{status:'invalid',message:'This call has an unsupported tone or too many slots. Your saved draft stays unchanged.'});return {status:'invalid'};}
  if(!plan.slots.length){call(callbacks.onStatus,{status:'empty',message:'Add a tone or rest to explore a picture call.'});return {status:'empty',duration:0};}
  const run={token,plan,callbacks,nodes:[],timers:new Set()};active=run;
  status(run,'requested',plan.hasSound?'Starting this short sound request.':'This call contains rests only. Follow the picture slots.');
  if(active!==run)return {status:'cancelled'};
  let offset=0;
  if(plan.hasSound){
   // WebKit otherwise treats Web Audio as ambient sound tied to Silent Mode.
   try{if(globalThis.navigator?.audioSession)globalThis.navigator.audioSession.type='playback';}catch{}
   try{
    if(typeof Audio!=='function')throw new Error('audio-unavailable');
    if(!context||context.state==='closed')context=new Audio();
    await suspending;
    if(active!==run||generation!==run.token)return {status:'cancelled'};
    if(context.state!=='running')await context.resume();
    if(active!==run||generation!==run.token)return {status:'cancelled'};
    if(context.state!=='running')throw new Error('audio-suspended');
    const base=context.currentTime+.025;offset=25;
    for(const slot of plan.slots){
     if(slot.frequency===null)continue;
     const osc=context.createOscillator(),node={osc,gain:null};run.nodes.push(node);
     const gain=context.createGain();node.gain=gain;
     const start=base+slot.start,end=start+BELL_MODEL.toneSeconds;
     osc.type=BELL_MODEL.waveform;osc.frequency.setValueAtTime(slot.frequency,start);
     gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(BELL_MODEL.peakGain,start+BELL_MODEL.attackSeconds);
     gain.gain.setValueAtTime(BELL_MODEL.peakGain,end-BELL_MODEL.releaseSeconds);gain.gain.linearRampToValueAtTime(0,end);
     osc.connect(gain);gain.connect(context.destination);
     osc.onended=()=>{try{osc.disconnect();}catch{}try{gain.disconnect();}catch{}};
     osc.start(start);osc.stop(end);
    }
   }catch{
    if(active!==run||generation!==run.token)return {status:'cancelled'};
    finish(run,'unavailable');return {status:'unavailable',duration:plan.duration};
   }
  }
  if(active!==run||generation!==run.token)return {status:'cancelled'};
  status(run,plan.hasSound?'started':'visual',plan.hasSound?'The short call is scheduled. Stop whenever you want.':'Picture slots only: these rests have no sound.');
  if(active!==run||generation!==run.token)return {status:'cancelled'};
  try{
   for(const slot of plan.slots)timer(run,()=>call(callbacks.onStep,slot.index),offset+slot.start*1000);
   timer(run,()=>finish(run,'completed'),offset+plan.duration*1000);
  }catch{finish(run,'unavailable');return {status:'unavailable',duration:plan.duration};}
  return {status:plan.hasSound?'started':'visual',duration:plan.duration};
 }
 return {play,stop};
}
