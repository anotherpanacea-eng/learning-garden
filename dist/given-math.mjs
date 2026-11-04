import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const dense=(x,max=Infinity)=>Array.isArray(x)&&x.length<=max&&Reflect.ownKeys(x).length===x.length+1&&Array.from(x).every((_,i)=>own(x,i));
const clone=x=>structuredClone(x);

// The app supplies its existing normalize=false exposure callback. The report
// gate sees only a disposable candidate; capture changed roots before invoking it.
export function recordGivenMath(state,pairs,options={}){
 const refused={ok:false,changed:false};
 if(!object(state)||!dense(pairs,144)||!pairs.every(p=>dense(p,2)&&p.length===2&&p.every(n=>Number.isInteger(n)&&n>=1&&n<=12)))return refused;
 if(!pairs.length)return {ok:true,changed:false};
 if(typeof options.exposeFacts!=='function'||typeof options.canExport!=='function')return refused;
 try{
  const candidate=clone(state);options.exposeFacts(pairs,candidate);
  const updates=[];
  for(const key of ['broad','garden','exposures','baseline','postOffice']){
   if(own(state,key)&&!own(candidate,key))return refused;
   if(own(candidate,key)&&(!own(state,key)||JSON.stringify(candidate[key])!==JSON.stringify(state[key])))updates.push([key,clone(candidate[key])]);
  }
  if(!updates.length)return {ok:true,changed:false};
  if(!recoveryFitsProgressLimits(candidate)||options.canExport(candidate)!==true)return refused;
  for(const [key,value]of updates)state[key]=value;
  return {ok:true,changed:true};
 }catch{return refused;}
}
