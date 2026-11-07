// Frozen-source area products. Reading and constructing never writes a notebook.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,ks)=>object(x)&&ks.every(k=>own(x,k));
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const text=(x,max=1500)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>text(x,80)&&!reserved.has(x);
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const words=xs=>dense(xs,1,8,x=>text(x));
const dimensions=f=>fields(f,['a','b','x'])&&integer(f.a,1,6)&&integer(f.b,1,6)&&integer(f.x,1,12);
const parts=['square','right','bottom','corner'];
const term=t=>fields(t,['power','count'])&&integer(t.power,0,2)&&integer(t.count,0,144);
const sameTerm=(a,b)=>a!==null&&a.power===b.power&&a.count===b.count;
const sameCounts=(a,b)=>a.every((n,i)=>n===b[i]);
const valueAt=(counts,x)=>counts[0]*x*x+counts[1]*x+counts[2];
export function validProductFigure(f){
 try{
  return fields(f,['kind'])&&(f.kind==='rectangle'?dimensions(f)&&own(f,'notation')&&['numbers','letters'].includes(f.notation):f.kind==='square-and-strip'&&fields(f,['xs','strip'])&&dense(f.xs,2,2,x=>integer(x,1,12))&&f.xs[0]!==f.xs[1]&&integer(f.strip,1,6));
 }catch{return false;}
}
export function validProductSource(s){
 try{
  return fields(s,['v','id','title','story','a','b','initialX','teaching','explanation','example'])&&s.v===1&&id(s.id)&&text(s.title,160)&&text(s.story)&&text(s.explanation)&&integer(s.a,1,6)&&integer(s.b,1,6)&&integer(s.initialX,1,12)&&dense(s.teaching,1,8,p=>fields(p,['words'])&&text(p.words))&&dimensions(s.example)&&own(s.example,'words')&&words(s.example.words);
 }catch{return false;}
}
export function validProductWork(s,w){
 try{
  return validProductSource(s)&&fields(w,['v','x','pieces','total','referenceShown','exampleShown','teachingShown'])&&w.v===1&&integer(w.x,1,12)&&object(w.pieces)&&parts.every(k=>!own(w.pieces,k)||w.pieces[k]===null||term(w.pieces[k]))&&dense(w.total,3,3,n=>integer(n,0,576))&&['referenceShown','exampleShown','teachingShown'].every(k=>typeof w[k]==='boolean');
 }catch{return false;}
}
export function newProductWork(s){return validProductSource(s)?{v:1,x:s.initialX,pieces:{},total:[0,0,0],referenceShown:false,exampleShown:false,teachingShown:false}:null;}
export function changeProductWork(s,w,action,value){
 try{
  if(!validProductWork(s,w))return null;
  const next=structuredClone(w);
  if(action==='x')next.x=value;
  else if(action==='kind'){
   if(!fields(value,['part','power'])||!parts.includes(value.part)||!integer(value.power,0,2))return null;
   const previous=own(next.pieces,value.part)?next.pieces[value.part]:null;
   next.pieces[value.part]=previous===null?{power:value.power,count:1}:{...previous,power:value.power};
  }else if(action==='count'){
   if(!fields(value,['part','delta'])||!parts.includes(value.part)||![-5,-1,1,5].includes(value.delta)||!own(next.pieces,value.part)||next.pieces[value.part]===null)return null;
   next.pieces[value.part].count+=value.delta;
  }else if(action==='clear'){
   if(!parts.includes(value))return null;
   next.pieces[value]=null;
  }else if(action==='total'){
   if(!fields(value,['index','delta'])||!integer(value.index,0,2)||![-5,-1,1,5].includes(value.delta))return null;
   next.total[value.index]+=value.delta;
  }else if(['reference','example','teaching'].includes(action))next[action+'Shown']=true;
  else return null;
  return validProductWork(s,next)?next:null;
 }catch{return null;}
}
export function productResult(s,w){
 if(!validProductWork(s,w))return null;
 const expected=[{power:2,count:1},{power:1,count:s.a},{power:1,count:s.b},{power:0,count:s.a*s.b}];
 const pieces=parts.map((key,i)=>{
  const proposed=own(w.pieces,key)&&w.pieces[key]!==null?structuredClone(w.pieces[key]):null;
  const actual=expected[i].count*w.x**expected[i].power,proposedValue=proposed===null?null:proposed.count*w.x**proposed.power;
  return {key,expected:expected[i],proposed,actual,proposedValue,formFit:proposed===null?null:sameTerm(proposed,expected[i]),valueFit:proposed===null?null:proposedValue===actual};
 });
 const labelsComplete=pieces.every(p=>p.proposed!==null),labelsTotal=labelsComplete?[0,0,0]:null;
 if(labelsComplete)for(const p of pieces)labelsTotal[2-p.proposed.power]+=p.proposed.count;
 const wholeCoefficients=[1,s.a+s.b,s.a*s.b],trayTotal=valueAt(w.total,w.x),wholeTotal=(w.x+s.a)*(w.x+s.b);
 return {pieces,labelsComplete,labelsTotal,collectionFit:labelsComplete?sameCounts(w.total,labelsTotal):null,trayTotal,wholeTotal,wholeCoefficients,wholeFit:sameCounts(w.total,wholeCoefficients),valueFit:trayTotal===wholeTotal,stripSwap:s.a!==s.b&&sameTerm(pieces[1].proposed,expected[2])&&sameTerm(pieces[2].proposed,expected[1])};
}
// Allocation recognizes future canonical suffixes too; readability has a narrower bound.
const sheetId=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^area-product-[1-9][0-9]*$/.test(r.id)?r.id:null;
function allocation(records){
 let max=0;const counts=new Map();
 for(const raw of records){
  const id=sheetId(raw);if(id===null)continue;
  counts.set(id,(counts.get(id)||0)+1);
  const number=Number(id.slice(13));
  max=!Number.isSafeInteger(number)?Infinity:Math.max(max,number);
 }
 return {max,counts};
}
export function productSheetsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'areaProducts'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.areaProducts))return {status:'unavailable',items:[],canKeep:false};
 const {max,counts}=allocation(book.areaProducts);
 const items=Array.from(book.areaProducts,(raw,index)=>{
  const id=sheetId(raw),number=id===null?null:Number(id.slice(13));
  return {id,index,raw,readable:id!==null&&integer(number,1,999999)&&counts.get(id)===1&&fields(raw,['source','work'])&&validProductWork(raw.source,raw.work)};
 });
 return {status:'ready',items,canKeep:max<999999};
}
export function keepProductSheet(book,source,work,options={}){
 try{
  if(!validProductWork(source,work)||typeof options?.canExport!=='function')return false;
  const view=productSheetsView(book);if(!view.canKeep)return false;
  const number=allocation(view.items.map(i=>i.raw)).max+1,id=`area-product-${number}`;
  const candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.areaProducts;
  records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.areaProducts=records;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;
  book.areaProducts=proposal;return id;
 }catch{return false;}
}
