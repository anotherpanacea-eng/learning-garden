// Frozen, constant-mass, one-second model. These are predictions, not observations.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {recordGivenMath as recordCartDisplay} from './given-math.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const text=(x,max=1500)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>text(x,80)&&!reserved.has(x);
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const masses=xs=>dense(xs,2,2,x=>integer(x,1,8));
const forces=xs=>dense(xs,1,6,x=>integer(x,-8,8));
const model=x=>x.v===1&&x.model==='one-second-net-force-v1';
export function validCartSource(s){
 try{return fields(s,['v','model','id','title','story','question','labels','massChoices','forceChoices','steps','v0','initialMasses','initialForces','teaching'])&&model(s)&&id(s.id)&&text(s.title,160)&&text(s.story)&&text(s.question)&&dense(s.labels,2,2,x=>text(x,160))&&dense(s.massChoices,1,8,x=>integer(x,1,8))&&new Set(s.massChoices).size===s.massChoices.length&&dense(s.forceChoices,1,17,x=>integer(x,-8,8))&&new Set(s.forceChoices).size===s.forceChoices.length&&s.forceChoices.includes(0)&&integer(s.steps,1,6)&&integer(s.v0,-4,4)&&masses(s.initialMasses)&&s.initialMasses.every(x=>s.massChoices.includes(x))&&forces(s.initialForces)&&s.initialForces.length===s.steps&&s.initialForces.every(x=>s.forceChoices.includes(x))&&dense(s.teaching,3,8,p=>fields(p,['words'])&&text(p.words));}catch{return false;}
}
export function validCartExample(e){
 try{return fields(e,['v','model','masses','v0','forces','frame','history'])&&model(e)&&masses(e.masses)&&integer(e.v0,-4,4)&&forces(e.forces)&&integer(e.frame,0,e.forces.length)&&typeof e.history==='boolean';}catch{return false;}
}
export function validCartWork(s,w){
 try{return validCartSource(s)&&fields(w,['v','masses','forces','teachingShown','runShown','historyShown'])&&w.v===1&&masses(w.masses)&&w.masses.every(x=>s.massChoices.includes(x))&&forces(w.forces)&&w.forces.length===s.steps&&w.forces.every(x=>s.forceChoices.includes(x))&&['teachingShown','runShown','historyShown'].every(k=>typeof w[k]==='boolean');}catch{return false;}
}
export function newCartWork(s){return validCartSource(s)?{v:1,masses:[...s.initialMasses],forces:[...s.initialForces],teachingShown:false,runShown:false,historyShown:false}:null;}
export function changeCartWork(s,w,action,value){
 try{
  if(!validCartWork(s,w))return null;
  const next=structuredClone(w);
  if(action==='mass'||action==='force'){
   const key=action==='mass'?'masses':'forces';
   if(!fields(value,['index','value'])||!integer(value.index,0,next[key].length-1))return null;
   next[key][value.index]=value.value;
  }else if(action==='swap')next.masses.reverse();
  else if(['teaching','run','history'].includes(action))next[action+'Shown']=true;
  else return null;
  return validCartWork(s,next)?next:null;
 }catch{return null;}
}
function rational(n,d){let a=Math.abs(n),b=d;while(b){const r=a%b;a=b;b=r;}return {n:n===0?0:n/a,d:d/a};}
const equal=(a,b)=>a.n*b.d===b.n*a.d;
function trajectory(ms,v0,fs,velocityBound){
 let total=0;
 const frames=Array.from({length:fs.length+1},(_,second)=>{
  const force=second===0?null:fs[second-1],beforeTotal=total;if(second)total+=force;
  return {second,force,carts:ms.map(mass=>({mass,before:second?rational(v0*mass+beforeTotal,mass):null,acceleration:second?rational(force,mass):null,change:second?rational(force,mass):null,velocity:rational(v0*mass+total,mass)}))};
 });
 return {frames,velocityBound,sameHistory:frames.every(f=>equal(f.carts[0].velocity,f.carts[1].velocity)),sameFinal:equal(frames.at(-1).carts[0].velocity,frames.at(-1).carts[1].velocity)};
}
export function cartTrace(s,w){
 if(!validCartWork(s,w))return null;
 const bound=Math.max(1,Math.ceil(Math.abs(s.v0)+s.steps*Math.max(...s.forceChoices.map(Math.abs))/Math.min(...s.massChoices)));
 return trajectory(w.masses,s.v0,w.forces,bound);
}
export function cartExampleTrace(s,pageIndex){
 if(!validCartSource(s)||!integer(pageIndex,0,s.teaching.length-1))return null;
 const e=s.teaching[pageIndex].example;if(!own(s.teaching[pageIndex],'example')||!validCartExample(e))return null;
 let bound=1;
 for(const page of s.teaching){
  if(!own(page,'example')||!validCartExample(page.example))continue;
  const x=page.example;
  for(const frame of trajectory(x.masses,x.v0,x.forces,1).frames)for(const cart of frame.carts)bound=Math.max(bound,Math.ceil(Math.abs(cart.velocity.n)/cart.velocity.d));
 }
 return {...trajectory(e.masses,e.v0,e.forces,bound),initialFrame:e.frame,showHistory:e.history};
}
// The caller names the proposed visible page. Teaching uses only its own frozen settings.
export function cartDisplayPairs(s,w,view){
 try{
  if(!validCartWork(s,w)||!fields(view,['page']))return null;
  let trace,end;
  if(view.page==='plan')return [];
  if(view.page==='teaching'){
   if(!integer(view.teachingPage,0,s.teaching.length-1))return null;
   trace=cartExampleTrace(s,view.teachingPage);if(!trace)return [];
   end=trace.showHistory?trace.frames.length-1:trace.initialFrame;
  }else if(view.page==='run'||view.page==='history'){
   trace=cartTrace(s,w);
   if(view.page==='run'&&!integer(view.clock,0,s.steps))return null;
   end=view.page==='history'?s.steps:view.clock;
  }else return null;
  const pairs=new Map(),add=(a,b)=>{if(!integer(a,1,12)||!integer(b,1,12))return;const p=[Math.min(a,b),Math.max(a,b)];pairs.set(p.join(','),p);};
  let span=0,last=null;
  for(let i=1;i<=end;i++){
   const f=trace.frames[i];span=f.force!==0&&f.force===last?span+1:1;last=f.force;
   for(const c of f.carts){
    const amount=Math.abs(c.acceleration.n)/c.acceleration.d;
    add(c.mass,amount);add(amount,1);
    if(f.force!==0)for(let k=1;k<=span;k++)add(amount,k);
   }
  }
  return [...pairs.values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 }catch{return null;}
}
// Canonical but too-large suffixes reserve the namespace and stop allocation.
function programNumber(row){
 if(!object(row)||!own(row,'id')||typeof row.id!=='string'||!/^cart-program-[1-9][0-9]*$/.test(row.id))return null;
 const n=Number(row.id.slice(13));return Number.isSafeInteger(n)?n:Infinity;
}
export function cartProgramsView(book){
 try{
  if(!object(book))return {status:'unavailable',items:[],canKeep:false};
  if(!own(book,'cartPrograms'))return {status:'absent',items:[],canKeep:true};
  if(!Array.isArray(book.cartPrograms))return {status:'unavailable',items:[],canKeep:false};
  const counts=new Map();let max=0;
  for(const raw of book.cartPrograms){const n=programNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(raw.id,(counts.get(raw.id)||0)+1);}}
  const items=Array.from(book.cartPrograms,(raw,index)=>{const n=programNumber(raw);return {id:n===null?null:raw.id,index,raw,readable:n!==null&&Number.isSafeInteger(n)&&n<=999999&&counts.get(raw.id)===1&&fields(raw,['source','work'])&&validCartWork(raw.source,raw.work)};});
  return {status:'ready',items,canKeep:max<999999};
 }catch{return {status:'unavailable',items:[],canKeep:false};}
}
export function keepCartProgram(book,source,work,options={}){
 try{
  if(!validCartWork(source,work)||typeof options?.canExport!=='function')return false;
  const view=cartProgramsView(book);if(!view.canKeep)return false;
  const number=view.items.reduce((max,item)=>Math.max(max,programNumber(item.raw)??0),0)+1,id=`cart-program-${number}`;
  const candidate=structuredClone(book),rows=view.status==='absent'?[]:candidate.cartPrograms;
  rows.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.cartPrograms=rows;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(rows);
  if(options.canExport(candidate)!==true)return false;
  book.cartPrograms=proposal;return id;
 }catch{return false;}
}
