// Shared import limits used before a recovery adds a retained-raw wrapper.
export const MAX_IMPORT_BYTES=5*1024*1024;
export function boundedProgressValue(source){
 let nodes=0;
 function bounded(value,depth=0){
  if(++nodes>200000||depth>60)return false;
  if(typeof value==='number')return Number.isFinite(value);
  if(value===null||typeof value!=='object')return true;
  return Object.entries(value).every(([key,v])=>!['__proto__','constructor','prototype','toString','valueOf'].includes(key)&&bounded(v,depth+1));
 }
 return bounded(source);
}
export function recoveryFitsProgressLimits(candidate){
 try{return boundedProgressValue(candidate)&&new TextEncoder().encode(JSON.stringify(candidate,null,2)).length<=MAX_IMPORT_BYTES;}catch{return false;}
}
