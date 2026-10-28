import {RHYTHM_MODEL} from './rhythm-content.mjs';
import {rhythmPlaybackPlan} from './rhythm-core.mjs';

const unavailable='Sound is unavailable here. You can still build the bar and follow its four beats.';
// No AudioContext is allocated until an explicit, nonempty sounding Play.
// The app owns explorer/route/speech lifecycle; this player owns one short run.
export function createRhythmPlayer(options={}){
 const Audio=Object.hasOwn(options,'AudioContext')?options.AudioContext:globalThis.AudioContext??globalThis.webkitAudioContext;
 const later=options.setTimeout??globalThis.setTimeout,clear=options.clearTimeout??globalThis.clearTimeout;
 let context=null,suspending=Promise.resolve(),active=null,generation=0;
 const call=(fn,value)=>{try{fn?.(value);}catch{}};
 const current=run=>active===run&&generation===run.token;
 function suspend(){
  if(!context||context.state==='closed')return;
  try{suspending=Promise.resolve(context.suspend?.()).catch(()=>{});}catch{suspending=Promise.resolve();}
 }
 function cleanNodes(run){
  const now=context?.currentTime??0;
  for(const {osc,gain} of run.nodes){
   try{gain.gain.cancelScheduledValues(now);gain.gain.setValueAtTime(0,now);}catch{}
   try{osc.onended=null;osc.stop(now);}catch{}
   try{osc.disconnect();}catch{}try{gain.disconnect();}catch{}
  }
  run.nodes.length=0;
 }
 function clean(run){
  for(const id of run.timers)try{clear(id);}catch{}
  run.timers.clear();cleanNodes(run);
 }
 const status=(run,value,message)=>call(run.callbacks.onStatus,{status:value,message});
 function finish(run,value,reason=''){
  if(active!==run)return;
  active=null;clean(run);suspend();
  const message=value==='completed'?(run.mode==='visual-unavailable'?'The four picture beats have finished. Sound was unavailable.':'The bar has finished.'):'Stopped. Your rhythm is still here.';
  const finishedGeneration=generation;
  status(run,value,message);
  if(generation===finishedGeneration)call(run.callbacks.onEnd,{status:value,reason,mode:run.mode});
 }
 function stop(reason='stopped'){
  generation++;
  if(active)finish(active,'stopped',reason);else suspend();
 }
 function timer(run,fn,ms){
  const id=later(()=>{run.timers.delete(id);if(current(run))fn();},ms);
  run.timers.add(id);
 }
 async function play(sequence,callbacks={}){
  const token=generation+1;stop('new-play');
  if(generation!==token)return {status:'cancelled'};
  const plan=rhythmPlaybackPlan(sequence);
  if(!plan){call(callbacks.onStatus,{status:'invalid',message:'This earlier rhythm cannot be played here. Your saved work is unchanged.'});return {status:'invalid'};}
  if(!plan.events.length){call(callbacks.onStatus,{status:'empty',message:'There is nothing to play yet. Add a note or a rest.'});return {status:'empty',duration:0};}
  const run={token,plan,callbacks,nodes:[],timers:new Set(),mode:plan.hasSound?'audio-request':'visual'};
  active=run;
  status(run,plan.hasSound?'requested':'visual',plan.hasSound?'Starting this short sound request.':'These blocks are all rests. Follow the four quiet beats.');
  if(!current(run))return {status:'cancelled'};
  let offset=0;
  if(plan.hasSound){
   // Best effort WebKit media-session behavior; no device audibility is inferred.
   try{if(globalThis.navigator?.audioSession)globalThis.navigator.audioSession.type='playback';}catch{}
   try{
    if(typeof Audio!=='function')throw new Error('audio-unavailable');
    if(!context||context.state==='closed')context=new Audio();
    await suspending;
    if(!current(run))return {status:'cancelled'};
    if(context.state!=='running')await context.resume();
    if(!current(run)){if(!active)suspend();return {status:'cancelled'};}
    if(context.state!=='running')throw new Error('audio-suspended');
    const base=context.currentTime+.025;offset=25;
    for(const event of plan.events){
     if(event.frequency===null)continue;
     const osc=context.createOscillator(),node={osc,gain:null};run.nodes.push(node);
     const gain=context.createGain();node.gain=gain;
     const start=base+event.start,end=start+event.toneSeconds;
     osc.type=RHYTHM_MODEL.waveform;osc.frequency.setValueAtTime(event.frequency,start);
     gain.gain.setValueAtTime(0,start);
     gain.gain.linearRampToValueAtTime(RHYTHM_MODEL.peakGain,start+RHYTHM_MODEL.attack);
     gain.gain.setValueAtTime(RHYTHM_MODEL.peakGain,end-RHYTHM_MODEL.release);
     gain.gain.linearRampToValueAtTime(0,end);
     osc.connect(gain);gain.connect(context.destination);
     osc.onended=()=>{try{osc.disconnect();}catch{}try{gain.disconnect();}catch{}};
     osc.start(start);osc.stop(end);
    }
   }catch{
    if(!current(run))return {status:'cancelled'};
    cleanNodes(run);suspend();offset=0;run.mode='visual-unavailable';
    status(run,'unavailable',unavailable);
   }
  }
  if(!current(run))return {status:'cancelled'};
  if(run.mode==='audio-request')status(run,'started','The bar is playing. Stop whenever you want.');
  if(!current(run))return {status:'cancelled'};
  try{
   // Equal beats only. No callback exposes hidden example event boundaries.
   for(let beat=0;beat<RHYTHM_MODEL.beats;beat++)timer(run,()=>call(callbacks.onBeat,beat),offset+beat*RHYTHM_MODEL.beatSeconds*1000);
   timer(run,()=>finish(run,'completed'),offset+plan.duration*1000);
  }catch{
   if(current(run)){clean(run);run.mode='visual-unavailable';status(run,'unavailable',unavailable);finish(run,'stopped','timer-unavailable');}
   return {status:'unavailable',duration:plan.duration};
  }
  return {status:run.mode==='audio-request'?'started':run.mode==='visual-unavailable'?'unavailable':'visual',duration:plan.duration};
 }
 return {play,stop};
}
