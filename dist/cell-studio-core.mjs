// Visit-local illustrations; explicit Keep alone appends frozen sheets.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {cellCases,cellSource} from './cell-studio-content.mjs';
const own=(x,key)=>Object.hasOwn(x,key);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(key=>own(x,key));
const clone=structuredClone;
export const cellLength=text=>typeof text==='string'?[...text].length:0;
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&cellLength(x)<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const list=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=x=>new Set(x).size===x.length;
const symbols=['wall','membrane','cytoplasm','nucleus','vacuole','mitochondria','ribosomes','chloroplasts'];
export function validCellSource(source){
 try{
  if(!fields(source,['v','model','id','title','outline','context','job','note','notice','microscopeNotice','parts','teaching'])||source.v!==1||source.model!=='cell-studio-v1'||!id(source.id)||!text(source.title,160)||!['plant','animal'].includes(source.outline))return false;
  if(!['context','job','note','notice','microscopeNotice'].every(key=>text(source[key],1500)))return false;
  if(!list(source.parts,1,8)||!source.parts.every(p=>fields(p,['id','label','role','symbol','present'])&&id(p.id)&&text(p.label,160)&&text(p.role,1500)&&symbols.includes(p.symbol)&&typeof p.present==='boolean')||!unique(source.parts.map(p=>p.id))||!unique(source.parts.map(p=>p.symbol)))return false;
  return list(source.teaching,1,6)&&source.teaching.every(t=>text(t,1500));
 }catch{return false;}
}
export function validCellWork(source,work){
 try{return validCellSource(source)&&fields(work,['v','selectedIds','exampleSeen','comparisonShown'])&&work.v===1&&list(work.selectedIds,0,source.parts.length)&&unique(work.selectedIds)&&work.selectedIds.every(id=>source.parts.some(p=>p.id===id))&&Number.isInteger(work.exampleSeen)&&work.exampleSeen>=0&&work.exampleSeen<=source.teaching.length&&typeof work.comparisonShown==='boolean';}catch{return false;}
}
export function newCellWork(source){return validCellSource(source)?{v:1,selectedIds:[],exampleSeen:0,comparisonShown:false}:null;}
export function changeCellWork(source,work,action,value){
 if(!validCellWork(source,work))return null;
 try{
  const next=clone(work);
  switch(action){
   case 'part':if(!source.parts.some(p=>p.id===value))return null;next.selectedIds=next.selectedIds.includes(value)?next.selectedIds.filter(id=>id!==value):[...next.selectedIds,value];break;
   case 'example':next.exampleSeen=Math.min(source.teaching.length,next.exampleSeen+1);break;
   case 'compare':next.comparisonShown=true;break;
   default:return null;
  }
  return validCellWork(source,next)?next:null;
 }catch{return null;}
}
const modelNumber=raw=>object(raw)&&own(raw,'id')&&typeof raw.id==='string'&&/^cell-model-[1-9][0-9]{0,5}$/.test(raw.id)?Number(raw.id.slice(11)):null;
export function cellModelsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'cellModels'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.cellModels))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.cellModels){const n=modelNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.cellModels,(raw,index)=>{
  const n=modelNumber(raw),readable=n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validCellWork(raw.source,raw.work);
  return {raw,index,id:n===null?null:raw.id,readable};
 });
 return {status:'ready',items,canKeep:max<999999};
}
export const lastCellModel=book=>cellModelsView(book).items.findLast(item=>item.readable)??null;
export function keepCellModel(book,source,work,options={}){
 if(!validCellWork(source,work)||typeof options?.canExport!=='function')return false;
 const view=cellModelsView(book);if(!view.canKeep)return false;
 try{
  const max=view.items.reduce((n,item)=>Math.max(n,modelNumber(item.raw)??0),0),newId=`cell-model-${max+1}`;
  const candidate=clone(book),models=view.status==='absent'?[]:candidate.cellModels;
  models.push({id:newId,source:clone(source),work:clone(work)});candidate.cellModels=models;
  if(!recoveryFitsProgressLimits(candidate))return false;
  // The export probe is disposable and cannot rewrite the committed proposal.
  const proposal=clone(models);
  if(options.canExport(candidate)!==true)return false;
  book.cellModels=proposal;return newId;
 }catch{return false;}
}
