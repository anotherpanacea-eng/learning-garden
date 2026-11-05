// Frozen scripts describe this rehearsal convention, never a performance grade.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,ks)=>object(x)&&ks.every(k=>own(x,k));
const text=(x,max=1500)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>text(x,80)&&!reserved.has(x);
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const unique=xs=>new Set(xs).size===xs.length;
const member=(s,x)=>s.cast.some(c=>c.id===x);
const kind=x=>x==='speech'||x==='direction';
const event=(s,e)=>e===null||(fields(e,['actor','prop','propName'])&&member(s,e.actor)&&(e.prop===null?e.propName===null:typeof e.prop==='string'&&Array.from(e.prop).length<=80&&text(e.propName,160)));
const delivery=(s,d)=>fields(d,['kind','speaker'])&&kind(d.kind)&&(d.kind==='direction'?d.speaker===null:d.speaker===null||member(s,d.speaker));
const permutation=(xs,s)=>dense(xs,s.cues.length,s.cues.length,x=>s.cues.some(c=>c.id===x))&&unique(xs);
export function validRehearsalSource(s){
 try{
  if(!fields(s,['v','id','title','setting','cast','cues','initialOrder','authorOrder','teaching'])||s.v!==1||!id(s.id)||!text(s.title,160)||!text(s.setting))return false;
  if(!dense(s.cast,2,3,c=>fields(c,['id','name','art'])&&id(c.id)&&text(c.name,160)&&typeof c.art==='string'&&Array.from(c.art).length<=80)||!unique(s.cast.map(c=>c.id)))return false;
  if(!dense(s.cues,4,6,c=>fields(c,['id','text','authorKind','authorSpeaker','reason','event'])&&id(c.id)&&text(c.text)&&text(c.reason)&&kind(c.authorKind)&&(c.authorKind==='direction'?c.authorSpeaker===null:member(s,c.authorSpeaker))&&event(s,c.event))||!unique(s.cues.map(c=>c.id)))return false;
  return permutation(s.initialOrder,s)&&permutation(s.authorOrder,s)&&dense(s.teaching,3,6,p=>fields(p,['words','example'])&&text(p.words)&&(p.example===null||(fields(p.example,['kind','speaker','text','event'])&&delivery(s,p.example)&&text(p.example.text)&&event(s,p.example.event))));
 }catch{return false;}
}
export function validRehearsalWork(s,w){
 try{return validRehearsalSource(s)&&fields(w,['v','order','delivery','teachingShown','rehearsalShown','authorShown'])&&w.v===1&&permutation(w.order,s)&&object(w.delivery)&&Reflect.ownKeys(w.delivery).length===s.cues.length&&s.cues.every(c=>own(w.delivery,c.id)&&delivery(s,w.delivery[c.id]))&&['teachingShown','rehearsalShown','authorShown'].every(k=>typeof w[k]==='boolean');}catch{return false;}
}
export function newRehearsalWork(s){
 if(!validRehearsalSource(s))return null;
 return {v:1,order:[...s.initialOrder],delivery:Object.fromEntries(s.cues.map(c=>[c.id,{kind:'speech',speaker:null}])),teachingShown:false,rehearsalShown:false,authorShown:false};
}
export function changeRehearsalWork(s,w,action,value){
 try{
  if(!validRehearsalWork(s,w))return null;
  const next=structuredClone(w);
  if(action==='kind'||action==='speaker'){
   if(!fields(value,['id',action])||!own(next.delivery,value.id))return null;
   const d=next.delivery[value.id];
   if(action==='kind'){
    if(!kind(value.kind))return null;
    if(d.kind!==value.kind||value.kind==='direction')d.speaker=null;
    d.kind=value.kind;
   }else{
    if(d.kind!=='speech'||!(value.speaker===null||member(s,value.speaker)))return null;
    d.speaker=value.speaker;
   }
  }else if(action==='move'){
   if(!fields(value,['id','delta'])||![-1,1].includes(value.delta))return null;
   const at=next.order.indexOf(value.id),to=at+value.delta;
   if(at<0||to<0||to>=next.order.length)return null;
   [next.order[at],next.order[to]]=[next.order[to],next.order[at]];
  }else if(['teaching','rehearsal','author'].includes(action))next[`${action}Shown`]=true;
  else return null;
  return next;
 }catch{return null;}
}
export function rehearsalFrame(s,w,index){
 if(!validRehearsalWork(s,w)||!Number.isInteger(index)||index<0||index>=w.order.length)return null;
 const c=s.cues.find(c=>c.id===w.order[index]),d=w.delivery[c.id];
 return {id:c.id,index,text:c.text,kind:d.kind,speaker:d.speaker===null?null:s.cast.find(a=>a.id===d.speaker),event:d.kind==='direction'&&c.event!==null?{...c.event,actor:s.cast.find(a=>a.id===c.event.actor)}:null,authorIndex:s.authorOrder.indexOf(c.id),authorKind:c.authorKind,authorSpeaker:c.authorSpeaker===null?null:s.cast.find(a=>a.id===c.authorSpeaker),reason:c.reason};
}
// Parse canonical numeric suffixes even on future or unreadable rows. Huge
// suffixes reserve their place too, so allocation cannot wrap or reuse them.
function scriptNumber(row){
 if(!object(row)||!own(row,'id')||typeof row.id!=='string'||!/^rehearsal-[1-9][0-9]*$/.test(row.id))return null;
 return Number(row.id.slice(10));
}
export function rehearsalScriptsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'rehearsalScripts'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.rehearsalScripts))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.rehearsalScripts){const n=scriptNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(raw.id,(counts.get(raw.id)||0)+1);}}
 const items=Array.from(book.rehearsalScripts,(raw,index)=>{const n=scriptNumber(raw);return {id:n===null?null:raw.id,index,raw,readable:n!==null&&Number.isSafeInteger(n)&&n<=999999&&counts.get(raw.id)===1&&fields(raw,['source','work'])&&validRehearsalWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:Number.isSafeInteger(max)&&max<999999};
}
export function keepRehearsalScript(book,source,work,options={}){
 try{
  if(!validRehearsalWork(source,work)||typeof options?.canExport!=='function')return false;
  const view=rehearsalScriptsView(book);if(!view.canKeep)return false;
  const n=view.items.reduce((max,r)=>Math.max(max,scriptNumber(r.raw)??0),0)+1,id=`rehearsal-${n}`;
  const candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.rehearsalScripts;
  records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.rehearsalScripts=records;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;
  book.rehearsalScripts=proposal;return id;
 }catch{return false;}
}
