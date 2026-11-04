// Frozen records validate their own bookkeeping; they are not RNG checkpoints.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {diffusionCases,diffusionSource} from './diffusion-tray-content.mjs';
const own=(x,key)=>Object.hasOwn(x,key);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(key=>own(x,key));
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&[...x].length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const list=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=x=>new Set(x).size===x.length;
const integer=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
const uint=x=>integer(x,1,4294967295);
const side=x=>x==='left'||x==='right';
const clone=structuredClone;
export function validDiffusionSource(source){
 try{
  if(!fields(source,['v','model','id','title','context','notice','ruleNotice','membraneRole','teaching','kinds','particles','seed','equalVolumes'])||source.v!==1||source.model!=='diffusion-two-space-v1'||!id(source.id)||!text(source.title,160)||!uint(source.seed)||source.equalVolumes!==true)return false;
  if(!['context','notice','ruleNotice','membraneRole'].every(key=>text(source[key],1500))||!list(source.teaching,1,8)||!source.teaching.every(t=>text(t,1500)))return false;
  if(!list(source.kinds,1,2)||!source.kinds.every(k=>fields(k,['id','label','symbol','canCross'])&&id(k.id)&&text(k.label,160)&&['circle','diamond'].includes(k.symbol)&&typeof k.canCross==='boolean')||!unique(source.kinds.map(k=>k.id))||!unique(source.kinds.map(k=>k.symbol)))return false;
  return list(source.particles,2,64)&&source.particles.every(p=>fields(p,['id','kindId','side'])&&id(p.id)&&source.kinds.some(k=>k.id===p.kindId)&&side(p.side))&&unique(source.particles.map(p=>p.id));
 }catch{return false;}
}
const positions=(source,items)=>list(items,source.particles.length,source.particles.length)&&items.every(p=>fields(p,['id','side'])&&source.particles.some(s=>s.id===p.id)&&side(p.side))&&unique(items.map(p=>p.id));
function changes(particles,from,to){
 let leftToRight=0,rightToLeft=0;
 for(const p of particles){if(from.get(p.id)==='left'&&to.get(p.id)==='right')leftToRight++;if(from.get(p.id)==='right'&&to.get(p.id)==='left')rightToLeft++;}
 return {leftToRight,rightToLeft};
}
function feasible(particles,initial,snapshot,n,leftToRight,rightToLeft){
 if(leftToRight<0||rightToLeft<0||leftToRight+rightToLeft>n*particles.length)return false;
 const moved=changes(particles,initial,snapshot),different=moved.leftToRight+moved.rightToLeft;
 if(leftToRight<moved.leftToRight||rightToLeft<moved.rightToLeft)return false;
 if(leftToRight-rightToLeft!==moved.leftToRight-moved.rightToLeft)return false;
 if(n===0)return different===0&&leftToRight===0&&rightToLeft===0;
 const same=particles.length-different;
 return leftToRight+rightToLeft<=same*(n-n%2)+different*(n-(n%2?0:1));
}
export function validDiffusionWork(source,work){
 try{
  if(!validDiffusionSource(source)||!fields(work,['v','steps','rng','current','previous','crossings','exampleSeen'])||work.v!==1||!integer(work.steps,0,1000000)||!uint(work.rng)||!integer(work.exampleSeen,0,source.teaching.length)||!positions(source,work.current)||!positions(source,work.previous))return false;
  if(!list(work.crossings,source.kinds.length,source.kinds.length)||!unique(work.crossings.map(c=>c.kindId))||!work.crossings.every(c=>fields(c,['kindId','leftToRight','rightToLeft'])&&source.kinds.some(k=>k.id===c.kindId)&&integer(c.leftToRight,0,work.steps*source.particles.length)&&integer(c.rightToLeft,0,work.steps*source.particles.length)))return false;
  const initial=new Map(source.particles.map(p=>[p.id,p.side])),current=new Map(work.current.map(p=>[p.id,p.side])),previous=new Map(work.previous.map(p=>[p.id,p.side]));
  for(const kind of source.kinds){
   const particles=source.particles.filter(p=>p.kindId===kind.id),c=work.crossings.find(c=>c.kindId===kind.id),last=changes(particles,previous,current);
   if(!feasible(particles,initial,current,work.steps,c.leftToRight,c.rightToLeft))return false;
   if(work.steps===0){if(particles.some(p=>previous.get(p.id)!==p.side))return false;}
   else if(!feasible(particles,initial,previous,work.steps-1,c.leftToRight-last.leftToRight,c.rightToLeft-last.rightToLeft))return false;
   if(!kind.canCross&&(c.leftToRight!==0||c.rightToLeft!==0||particles.some(p=>current.get(p.id)!==p.side||previous.get(p.id)!==p.side)))return false;
  }
  return true;
 }catch{return false;}
}
export function newDiffusionWork(source){
 if(!validDiffusionSource(source))return null;
 const current=source.particles.map(({id,side})=>({id,side}));
 return {v:1,steps:0,rng:source.seed,current,previous:clone(current),crossings:source.kinds.map(k=>({kindId:k.id,leftToRight:0,rightToLeft:0})),exampleSeen:0};
}
export function advanceDiffusionWork(source,work){
 if(!validDiffusionWork(source,work)||work.steps===1000000)return null;
 try{
  const next=clone(work),current=new Map(next.current.map(p=>[p.id,p]));next.previous=clone(next.current);
  for(const marker of source.particles){
   let x=next.rng;x^=x<<13;x^=x>>>17;x^=x<<5;next.rng=x>>>0;
   if(source.kinds.find(k=>k.id===marker.kindId).canCross&&next.rng<1073741824){
    const p=current.get(marker.id),c=next.crossings.find(c=>c.kindId===marker.kindId);
    if(p.side==='left'){p.side='right';c.leftToRight++;}else{p.side='left';c.rightToLeft++;}
   }
  }
  next.steps++;
  return validDiffusionWork(source,next)?next:null;
 }catch{return null;}
}
export function revealDiffusionExample(source,work){
 if(!validDiffusionWork(source,work))return null;
 try{const next=clone(work);next.exampleSeen=Math.min(source.teaching.length,next.exampleSeen+1);return next;}catch{return null;}
}
export function diffusionCounts(source,work){
 if(!validDiffusionWork(source,work))return null;
 const previous=new Map(work.previous.map(p=>[p.id,p.side])),current=new Map(work.current.map(p=>[p.id,p.side]));
 return source.kinds.map(kind=>{
  const particles=source.particles.filter(p=>p.kindId===kind.id),initialLeft=particles.filter(p=>p.side==='left').length,left=particles.filter(p=>current.get(p.id)==='left').length,c=work.crossings.find(c=>c.kindId===kind.id),last=changes(particles,previous,current);
  return {kindId:kind.id,label:kind.label,initialLeft,initialRight:particles.length-initialLeft,left,right:particles.length-left,lastLeftToRight:last.leftToRight,lastRightToLeft:last.rightToLeft,leftToRight:c.leftToRight,rightToLeft:c.rightToLeft,net:c.leftToRight-c.rightToLeft};
 });
}
const runNumber=raw=>object(raw)&&own(raw,'id')&&typeof raw.id==='string'&&/^diffusion-run-[1-9][0-9]{0,5}$/.test(raw.id)?Number(raw.id.slice(14)):null;
export function diffusionRunsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'diffusionRuns'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.diffusionRuns))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.diffusionRuns){const n=runNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.diffusionRuns,(raw,index)=>{const n=runNumber(raw);return {raw,index,id:n===null?null:raw.id,readable:n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validDiffusionWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export const lastDiffusionRun=book=>diffusionRunsView(book).items.findLast(item=>item.readable)??null;
export function keepDiffusionRun(book,source,work,options={}){
 if(!validDiffusionWork(source,work)||typeof options?.canExport!=='function')return false;
 const view=diffusionRunsView(book);if(!view.canKeep)return false;
 try{
  const max=view.items.reduce((n,item)=>Math.max(n,runNumber(item.raw)??0),0),newId=`diffusion-run-${max+1}`;
  const candidate=clone(book),runs=view.status==='absent'?[]:candidate.diffusionRuns;
  runs.push({id:newId,source:clone(source),work:clone(work)});candidate.diffusionRuns=runs;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=clone(runs);
  if(options.canExport(candidate)!==true)return false;
  book.diffusionRuns=proposal;return newId;
 }catch{return false;}
}
