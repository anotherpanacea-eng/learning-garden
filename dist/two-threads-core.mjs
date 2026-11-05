// Structural maps describe supplied memberships, never suspense or comprehension.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,ks)=>object(x)&&ks.every(k=>own(x,k));
const text=(x,max=1500)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!reserved.has(x);
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const unique=xs=>new Set(xs).size===xs.length;
const permutation=(xs,scenes)=>dense(xs,scenes.length,scenes.length,x=>id(x)&&scenes.some(s=>s.id===x))&&unique(xs);
function narrative(s,max=12){
 if(!fields(s,['title','threads','scenes'])||!text(s.title,160)||!dense(s.threads,2,2,t=>fields(t,['id','label','symbol'])&&id(t.id)&&text(t.label,160)&&['stripe','dots'].includes(t.symbol))||!unique(s.threads.map(t=>t.id))||!unique(s.threads.map(t=>t.symbol)))return false;
 return dense(s.scenes,3,max,c=>fields(c,['id','title','threadIds','paragraphs'])&&id(c.id)&&text(c.title,160)&&dense(c.threadIds,1,2,t=>s.threads.some(x=>x.id===t))&&unique(c.threadIds)&&dense(c.paragraphs,1,4,p=>text(p)))&&unique(s.scenes.map(c=>c.id))&&s.threads.every(t=>s.scenes.some(c=>c.threadIds.length===1&&c.threadIds[0]===t.id));
}
export function validThreadSource(s){
 try{return fields(s,['v','model','id','title','context','task','notice','returnQuestion','definitions','threads','scenes','startOrder','authorOrder','writerNote','demo','teaching'])&&s.v===1&&s.model==='two-threads-v1'&&id(s.id)&&['context','task','notice','returnQuestion','writerNote'].every(k=>text(s[k]))&&narrative(s)&&dense(s.definitions,1,12,d=>fields(d,['term','meaning'])&&text(d.term,160)&&text(d.meaning))&&permutation(s.startOrder,s.scenes)&&permutation(s.authorOrder,s.scenes)&&narrative(s.demo,6)&&dense(s.teaching,1,6,t=>fields(t,['text','order'])&&text(t.text)&&permutation(t.order,s.demo.scenes));}catch{return false;}
}
export function validThreadWork(s,w){try{return validThreadSource(s)&&fields(w,['v','order','referenceShown','teachingSeen'])&&w.v===1&&permutation(w.order,s.scenes)&&typeof w.referenceShown==='boolean'&&Number.isSafeInteger(w.teachingSeen)&&w.teachingSeen>=0&&w.teachingSeen<=s.teaching.length;}catch{return false;}}
export function newThreadWork(s){return validThreadSource(s)?{v:1,order:[...s.startOrder],referenceShown:false,teachingSeen:0}:null;}
export function changeThreadWork(s,w,action,value){
 try{
  if(!validThreadWork(s,w))return null;
  const next=structuredClone(w);
  if(action==='move'){
   if(!fields(value,['sceneId','delta'])||![-1,1].includes(value.delta))return null;
   const at=next.order.indexOf(value.sceneId),to=at+value.delta;
   if(at<0||to<0||to>=next.order.length)return null;
   [next.order[at],next.order[to]]=[next.order[to],next.order[at]];
  }else if(action==='reference')next.referenceShown=true;
  else if(action==='teaching')next.teachingSeen=Math.min(s.teaching.length,next.teachingSeen+1);
  else return null;
  return next;
 }catch{return null;}
}
export function threadMap(s,order){
 try{
  if(!narrative(s)||!permutation(order,s.scenes))return null;
  const scenes=order.map(id=>s.scenes.find(c=>c.id===id));
  return s.threads.map(t=>{
   const positions=scenes.flatMap((c,i)=>c.threadIds.includes(t.id)?[i+1]:[]),returns=[];
   for(let i=1;i<positions.length;i++){
    const from=positions[i-1],to=positions[i];if(to-from<=1)continue;
    returns.push({from,to,gap:to-from-1,fromId:scenes[from-1].id,toId:scenes[to-1].id,fromTitle:scenes[from-1].title,toTitle:scenes[to-1].title});
   }
   return {id:t.id,label:t.label,symbol:t.symbol,positions,returns};
  });
 }catch{return null;}
}
const sheetNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^thread-reading-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(15)):null;
export function threadSheetsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'threadReadings'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.threadReadings))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.threadReadings){const n=sheetNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.threadReadings,(raw,index)=>{const n=sheetNumber(raw);return {id:n===null?null:raw.id,index,raw,readable:n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validThreadWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export function lastThreadReading(book){return threadSheetsView(book).items.filter(r=>r.readable).at(-1)??null;}
export function keepThreadReading(book,source,work,options={}){
 try{
  if(!validThreadWork(source,work)||typeof options?.canExport!=='function')return false;
  const view=threadSheetsView(book);if(!view.canKeep)return false;
  const n=view.items.reduce((max,r)=>Math.max(max,sheetNumber(r.raw)??0),0)+1,id=`thread-reading-${n}`;
  const candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.threadReadings;
  records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.threadReadings=records;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;
  book.threadReadings=proposal;return id;
 }catch{return false;}
}
