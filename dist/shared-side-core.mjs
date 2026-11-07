// Own-source integer factorizations. Reading and constructing never writes sheets.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {recordGivenMath as recordSharedDisplay} from './given-math.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,ks)=>object(x)&&ks.every(k=>own(x,k));
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const text=(x,max=1500)=>typeof x==='string'&&x.trim().length>0&&[...x].length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const wordList=(xs,max)=>dense(xs,1,max,x=>text(x));
const factList=xs=>dense(xs,0,144,p=>dense(p,2,2,n=>integer(n,1,12)));
const model=e=>fields(e,['A','B','k','a','b','x'])&&integer(e.A,1,24)&&integer(e.B,1,24)&&integer(e.k,1,24)&&integer(e.a,0,24)&&integer(e.b,0,24)&&integer(e.x,1,12);
export function validSharedSource(s){
 try{return fields(s,['v','id','title','request','A','B','initialX','notation','teaching','teachingFacts','contrasts','contrastFacts','referenceIntro','example'])&&s.v===1&&text(s.id,80)&&!reserved.has(s.id)&&text(s.title,160)&&['request','notation','referenceIntro'].every(k=>text(s[k]))&&integer(s.A,1,24)&&integer(s.B,1,24)&&integer(s.initialX,1,12)&&wordList(s.teaching,8)&&wordList(s.contrasts,4)&&dense(s.teachingFacts,s.teaching.length,s.teaching.length,factList)&&dense(s.contrastFacts,s.contrasts.length,s.contrasts.length,factList)&&model(s.example);}catch{return false;}
}
export function validSharedWork(s,w){
 try{return validSharedSource(s)&&fields(w,['v','x','k','a','b','teachingShown','referenceShown'])&&w.v===1&&integer(w.x,1,12)&&(w.k===null||integer(w.k,1,24))&&['a','b'].every(k=>w[k]===null||integer(w[k],0,24))&&['teachingShown','referenceShown'].every(k=>typeof w[k]==='boolean');}catch{return false;}
}
export function newSharedWork(s){return validSharedSource(s)?{v:1,x:s.initialX,k:null,a:null,b:null,teachingShown:false,referenceShown:false}:null;}
export function changeSharedWork(s,w,action,value){
 try{
  if(!validSharedWork(s,w))return null;const next=structuredClone(w);
  if(['x','k','a','b'].includes(action))next[action]=value;
  else if(action==='teaching'||action==='reference')next[action+'Shown']=true;
  else return null;
  return validSharedWork(s,next)?next:null;
 }catch{return null;}
}
const gcd=(a,b)=>b===0?a:gcd(b,a%b);
function result(s,w){
 const missing=['k','a','b'].filter(k=>w[k]===null),complete=missing.length===0,g=gcd(s.A,s.B);
 const expanded=complete?[w.k*w.a,w.k*w.b]:null,targetValue=complete?s.A*w.x+s.B:null,width=complete?w.a*w.x+w.b:null,proposedValue=complete?w.k*width:null;
 return {complete,missing,expanded,targetValue,proposedValue,formFit:complete?expanded[0]===s.A&&expanded[1]===s.B:null,valueFit:complete?targetValue===proposedValue:null,gcd:g,reference:{k:g,a:s.A/g,b:s.B/g},width,xWidth:complete?w.a*w.x:null,regionAreas:complete?[w.k*w.a*w.x,w.k*w.b]:null};
}
export function sharedResult(s,w){try{return validSharedWork(s,w)?result(s,w):null;}catch{return null;}}
export function sharedDisplayPairs(s,w,view){
 try{
  if(!validSharedWork(s,w)||!object(view)||!['build','compare','learn'].includes(view.view))return [];const pairs=[],seen=new Set();
  const add=(a,b)=>{if(!integer(a,1,12)||!integer(b,1,12))return;const key=`${a},${b}`;if(!seen.has(key)){seen.add(key);pairs.push([a,b]);}};
  const dimensions=(source,work)=>{add(source.A,work.x);add(work.a,work.x);add(work.k,work.a*work.x);add(work.k,work.b);add(work.k,work.a*work.x+work.b);};
  if(['build','compare'].includes(view.view)&&['k','a','b'].every(k=>w[k]!==null)){
   dimensions(s,w);if(view.view==='compare')add(w.k,w.a);
  }else if(view.view==='learn'){
   const count=integer(view.step,0,s.teaching.length)?view.step:0;
   for(const facts of s.teachingFacts.slice(0,count))for(const p of facts)add(...p);
   if(view.contrasts===true)for(const facts of s.contrastFacts)for(const p of facts)add(...p);
   if(count===s.teaching.length)dimensions(s.example,s.example);
  }
  if(view.reference===true){const g=gcd(s.A,s.B);add(g,s.A/g);add(g,s.B/g);}
  return pairs;
 }catch{return [];}
}
const sheetId=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^shared-side-[1-9][0-9]*$/.test(r.id)?r.id:null;
export function sharedSheetsView(book){
 try{
  if(!object(book))return {status:'unavailable',items:[],canKeep:false};
  if(!own(book,'sharedSides'))return {status:'absent',items:[],canKeep:true};
  if(!Array.isArray(book.sharedSides))return {status:'unavailable',items:[],canKeep:false};
  const counts=new Map();let max=0;
  for(const raw of book.sharedSides){const id=sheetId(raw);if(id===null)continue;counts.set(id,(counts.get(id)||0)+1);const n=Number(id.slice(12));max=Number.isSafeInteger(n)?Math.max(max,n):Infinity;}
  const items=Array.from(book.sharedSides,(raw,index)=>{const id=sheetId(raw),n=id===null?null:Number(id.slice(12));return {id,index,raw,readable:id!==null&&integer(n,1,999999)&&counts.get(id)===1&&fields(raw,['source','work'])&&validSharedWork(raw.source,raw.work)};});
  return {status:'ready',items,canKeep:max<999999};
 }catch{return {status:'unavailable',items:[],canKeep:false};}
}
export function keepSharedSheet(book,source,work,options={}){
 try{
  if(!validSharedWork(source,work)||typeof options?.canExport!=='function')return false;const view=sharedSheetsView(book);if(!view.canKeep)return false;
  const next=view.items.reduce((max,item)=>Math.max(max,sheetId(item.raw)===null?0:Number(item.raw.id.slice(12))),0)+1,id=`shared-side-${next}`;
  const candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.sharedSides;
  records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.sharedSides=records;
  if(!recoveryFitsProgressLimits(candidate))return false;const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;book.sharedSides=proposal;return id;
 }catch{return false;}
}
