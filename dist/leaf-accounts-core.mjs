// Structural and arithmetic checks only: source validation cannot establish biological truth.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,ks)=>object(x)&&ks.every(k=>own(x,k));
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const unique=xs=>new Set(xs).size===xs.length;
const atoms=a=>fields(a,['C','H','O'])&&['C','H','O'].every(k=>integer(a[k],0,24))&&integer(a.C+a.H+a.O,1,48);
const species=p=>fields(p,['id','label','atoms'])&&id(p.id)&&text(p.label,160)&&atoms(p.atoms);
export function validLeafSource(s){
 try{
  if(!fields(s,['v','model','id','title','context','process','location','notice','about','task','returnQuestion','species','slots','energyOptions','energyReference','teachingDemo','teaching'])||s.v!==1||s.model!=='leaf-accounts-v1'||!id(s.id)||!text(s.title,160)||!text(s.process,160))return false;
  if(!['context','location','notice','about','task','returnQuestion'].every(k=>text(s[k],1500)))return false;
  if(!dense(s.species,1,8,species)||!unique(s.species.map(p=>p.id)))return false;
  if(!dense(s.slots,2,8,p=>fields(p,['id','speciesId','side','referenceCount'])&&id(p.id)&&s.species.some(species=>species.id===p.speciesId)&&['in','out'].includes(p.side)&&integer(p.referenceCount,0,12))||!unique(s.slots.map(p=>p.id))||!s.slots.some(p=>p.side==='in')||!s.slots.some(p=>p.side==='out'))return false;
  if(!dense(s.energyOptions,1,8,o=>fields(o,['id','label','description'])&&id(o.id)&&text(o.label,160)&&text(o.description,1500))||!unique(s.energyOptions.map(o=>o.id)))return false;
  if(!fields(s.energyReference,['fromId','toId','note'])||!['fromId','toId'].every(k=>s.energyOptions.some(o=>o.id===s.energyReference[k]))||!text(s.energyReference.note,1500))return false;
  return fields(s.teachingDemo,['speciesId','count'])&&s.species.some(p=>p.id===s.teachingDemo.speciesId)&&integer(s.teachingDemo.count,1,3)&&dense(s.teaching,1,8,t=>text(t,1500));
 }catch{return false;}
}
export function validLeafWork(s,w){
 try{return validLeafSource(s)&&fields(w,['v','counts','energy','countShown','referenceShown','exampleSeen'])&&w.v===1&&dense(w.counts,0,s.slots.length,c=>fields(c,['slotId','count'])&&s.slots.some(p=>p.id===c.slotId)&&integer(c.count,0,12))&&unique(w.counts.map(c=>c.slotId))&&fields(w.energy,['fromId','toId'])&&['fromId','toId'].every(k=>w.energy[k]===null||s.energyOptions.some(o=>o.id===w.energy[k]))&&typeof w.countShown==='boolean'&&typeof w.referenceShown==='boolean'&&integer(w.exampleSeen,0,s.teaching.length);}catch{return false;}
}
export function newLeafWork(s){return validLeafSource(s)?{v:1,counts:[],energy:{fromId:null,toId:null},countShown:false,referenceShown:false,exampleSeen:0}:null;}
export function countFor(w,slotId){return Array.isArray(w?.counts)?w.counts.find(c=>c?.slotId===slotId)?.count??0:0;}
export function changeLeafWork(s,w,action,value){
 try{
  if(!validLeafWork(s,w))return null;
  const next=structuredClone(w);
  if(action==='amount'){
   if(!fields(value,['slotId','count'])||!s.slots.some(p=>p.id===value.slotId)||!integer(value.count,0,12))return null;
   const entry=next.counts.find(c=>c.slotId===value.slotId);if(entry)entry.count=value.count;else next.counts.push({slotId:value.slotId,count:value.count});
   next.countShown=false;
  }else if(action==='energy'){
   if(!fields(value,['field','id'])||!['fromId','toId'].includes(value.field)||value.id!==null&&!s.energyOptions.some(o=>o.id===value.id))return null;
   next.energy[value.field]=value.id;
  }else if(action==='count')next.countShown=true;
  else if(action==='reference')next.referenceShown=true;
  else if(action==='example')next.exampleSeen=Math.min(s.teaching.length,next.exampleSeen+1);
  else return null;
  return validLeafWork(s,next)?next:null;
 }catch{return null;}
}
export function leafFormula(p){
 if(!species(p))return null;
 return ['C','H','O'].filter(k=>p.atoms[k]>0).map(k=>k+(p.atoms[k]===1?'':String(p.atoms[k]))).join('');
}
export function leafAtomAccount(s,w){
 if(!validLeafWork(s,w))return null;
 const used={C:0,H:0,O:0},made={C:0,H:0,O:0};let empty=true;
 for(const slot of s.slots){const count=countFor(w,slot.id),composition=s.species.find(p=>p.id===slot.speciesId).atoms,total=slot.side==='in'?used:made;if(count>0)empty=false;for(const atom of ['C','H','O'])total[atom]+=count*composition[atom];}
 const difference={C:made.C-used.C,H:made.H-used.H,O:made.O-used.O};
 return {used,made,difference,empty,matches:Object.values(difference).every(n=>n===0)};
}
export function leafReferenceWork(s){
 const w=newLeafWork(s);if(!w)return null;
 w.counts=s.slots.map(p=>({slotId:p.id,count:p.referenceCount}));w.energy.fromId=s.energyReference.fromId;w.energy.toId=s.energyReference.toId;w.countShown=true;w.referenceShown=true;return w;
}
const sheetNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^leaf-account-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(13)):null;
export function leafAccountsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'leafAccounts'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.leafAccounts))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.leafAccounts){const n=sheetNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.leafAccounts,(raw,index)=>{const n=sheetNumber(raw);return {id:n===null?null:raw.id,index,raw,readable:n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validLeafWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export const lastLeafAccount=book=>leafAccountsView(book).items.findLast(item=>item.readable)??null;
export function keepLeafAccount(book,source,work,options={}){
 try{
  if(!validLeafWork(source,work)||typeof options?.canExport!=='function')return false;
  const view=leafAccountsView(book);if(!view.canKeep)return false;
  const n=view.items.reduce((max,item)=>Math.max(max,sheetNumber(item.raw)??0),0)+1,id=`leaf-account-${n}`,candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.leafAccounts;
  records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.leafAccounts=records;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;
  book.leafAccounts=proposal;return id;
 }catch{return false;}
}
