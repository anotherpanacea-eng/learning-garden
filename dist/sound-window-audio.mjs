// Nominal computer-tone scheduling, never an observation of hearing.
export const SOUND_TONE_MODEL=Object.freeze({frequencies:Object.freeze([220,440]),gains:Object.freeze([.0125,.025]),duration:.6,attack:.015,release:.035,lead:.025});
const valid=p=>p!==null&&typeof p==='object'&&!Array.isArray(p)&&SOUND_TONE_MODEL.frequencies.includes(p.frequency)&&SOUND_TONE_MODEL.gains.includes(p.gain);
export function createSoundWindowPlayer(options={}){
 const Audio=options.AudioContext??globalThis.AudioContext??globalThis.webkitAudioContext,later=options.setTimeout??globalThis.setTimeout,clear=options.clearTimeout??globalThis.clearTimeout;
 let context=null,active=null,generation=0,suspending=Promise.resolve();
 const call=(fn,value)=>{try{fn?.(value);}catch{}};
 const owns=run=>active===run&&generation===run.token;
 function idle(){if(!context||context.state==='closed'||active)return Promise.resolve();try{suspending=Promise.resolve(context.suspend()).catch(()=>{});}catch{suspending=Promise.resolve();}return suspending;}
 function clean(run){
  for(const timer of run.timers)try{clear(timer);}catch{}run.timers.clear();const now=context?.currentTime??0;
  for(const node of run.nodes){try{node.gain?.gain.cancelScheduledValues(now);node.gain?.gain.setValueAtTime(0,now);}catch{}try{node.osc.onended=null;node.osc.stop(now);}catch{}try{node.osc.disconnect();}catch{}try{node.gain?.disconnect();}catch{}}
  run.nodes.length=0;
 }
 function notify(run,status,reason=''){const messages={requested:'Short tone requested.',scheduled:'The short tone is scheduled.',stopped:'Sound stopped.',ended:'The scheduled tone ended.',unavailable:'Sound is unavailable here. You can still compare all the pictures.'};call(run.callbacks.onStatus,{status,message:messages[status],reason});}
 function finish(run,status,reason=''){if(!owns(run))return;active=null;clean(run);void idle();notify(run,status,reason);call(run.callbacks.onEnd,{status,reason});}
 function stop(reason='stopped'){generation++;const old=active;active=null;if(old){clean(old);notify(old,'stopped',reason);call(old.callbacks.onEnd,{status:'stopped',reason});}return idle();}
 async function cancelled(){if(!active)await idle();return {status:'cancelled'};}
 async function play(plan,callbacks={}){
  if(!valid(plan)){call(callbacks.onStatus,{status:'invalid',message:'This tone setting is unsupported. The pictures stay available.'});return {status:'invalid'};}
  const token=generation+1;stop('new-play');if(generation!==token)return cancelled();
  const run={token,plan:{frequency:plan.frequency,gain:plan.gain},callbacks,nodes:[],timers:new Set()};active=run;notify(run,'requested');if(!owns(run))return cancelled();
  try{
   try{if(globalThis.navigator?.audioSession)globalThis.navigator.audioSession.type='playback';}catch{}
   if(typeof Audio!=='function')throw Error('unavailable');if(!context||context.state==='closed')context=new Audio();
   await suspending;if(!owns(run))return cancelled();
   if(context.state!=='running')await context.resume();
   // A delayed old resume may restart an otherwise idle context after Stop.
   // Suspend that idle context, but never a newer request that now owns it.
   if(!owns(run))return cancelled();if(context.state!=='running')throw Error('suspended');
   const start=context.currentTime+SOUND_TONE_MODEL.lead,end=start+SOUND_TONE_MODEL.duration,osc=context.createOscillator(),node={osc,gain:null};run.nodes.push(node);const gain=context.createGain();node.gain=gain;
   osc.type='sine';osc.frequency.setValueAtTime(run.plan.frequency,start);gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(run.plan.gain,start+SOUND_TONE_MODEL.attack);gain.gain.setValueAtTime(run.plan.gain,end-SOUND_TONE_MODEL.release);gain.gain.linearRampToValueAtTime(0,end);osc.connect(gain);gain.connect(context.destination);osc.start(start);osc.stop(end);
   const id=later(()=>{run.timers.delete(id);if(owns(run))finish(run,'ended');},(SOUND_TONE_MODEL.lead+SOUND_TONE_MODEL.duration)*1000);run.timers.add(id);notify(run,'scheduled');
   if(!owns(run))return cancelled();return {status:'scheduled',duration:SOUND_TONE_MODEL.duration};
  }catch{if(!owns(run))return cancelled();finish(run,'unavailable');return {status:'unavailable'};}
 }
 return {play,stop};
}
