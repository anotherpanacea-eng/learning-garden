// Own-source mathematics and independently kept sheets. Only Keep writes a notebook.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
const integer=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
const half=(x,min,max)=>Number.isFinite(x)&&Number.isInteger(2*x)&&x>=min&&x<=max;
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&[...x].length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const safeId=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const relations={lt:{word:'is less than',symbol:'<'},le:{word:'is less than or equal to',symbol:'≤'},gt:{word:'is greater than',symbol:'>'},ge:{word:'is greater than or equal to',symbol:'≥'}};
export const relationWords=rel=>own(relations,rel)?relations[rel].word:null;
export const relationSymbol=rel=>own(relations,rel)?relations[rel].symbol:null;
export function validInequalitySource(s){
 try{return fields(s,['v','model','id','title','story','notice','a','b','c','relation','teaching'])&&s.v===1&&s.model==='linear-inequality-v1'&&safeId(s.id)&&text(s.title,160)&&text(s.story,1500)&&text(s.notice,1500)&&integer(s.a,-4,4)&&s.a!==0&&integer(s.b,-24,24)&&integer(s.c,-24,24)&&own(relations,s.relation)&&(2*(s.c-s.b))%s.a===0&&half((s.c-s.b)/s.a,-4,4)&&Array.isArray(s.teaching)&&s.teaching.length>=1&&s.teaching.length<=6&&Array.from({length:s.teaching.length},(_,i)=>own(s.teaching,i)&&text(s.teaching[i],1500)).every(Boolean);}catch{return false;}
}
export function validInequalityWork(s,w){
 try{return validInequalitySource(s)&&fields(w,['v','probe','boundary','direction','inclusive','referenceShown'])&&w.v===1&&half(w.probe,-6,6)&&half(w.boundary,-4,4)&&['lower','higher'].includes(w.direction)&&typeof w.inclusive==='boolean'&&typeof w.referenceShown==='boolean';}catch{return false;}
}
export function newInequalityWork(s){return validInequalitySource(s)?{v:1,probe:0,boundary:0,direction:'lower',inclusive:false,referenceShown:false}:null;}
export function changeInequalityWork(s,w,action,value){
 if(!validInequalityWork(s,w))return null;
 try{const next=structuredClone(w);
 switch(action){
 case 'probe':next.probe=value;break;
 case 'boundary':next.boundary=value;break;
 case 'direction':next.direction=value;break;
 case 'inclusive':next.inclusive=value;break;
 case 'reference':next.referenceShown=true;break;
 default:return null;
 }
 return validInequalityWork(s,next)?next:null;
 }catch{return null;}
}
const display=x=>String(Object.is(x,-0)?0:x);
export function expressionText(s){
 if(!validInequalitySource(s))return null;
 const variable=s.a===1?'x':s.a===-1?'-x':`${s.a}x`;
 return s.b===0?variable:`${variable} ${s.b<0?'-':'+'} ${Math.abs(s.b)}`;
}
export function solution(s){
 if(!validInequalitySource(s))return null;
 const lower=s.relation==='lt'||s.relation==='le';
 return {boundary:(s.c-s.b)/s.a||0,direction:(s.a>0?lower:!lower)?'lower':'higher',inclusive:s.relation==='le'||s.relation==='ge'};
}
function includes(ray,value){return value===ray.boundary?ray.inclusive:ray.direction==='lower'?value<ray.boundary:value>ray.boundary;}
export function probeResult(s,w){
 if(!validInequalityWork(s,w))return null;
 const value=w.probe,left=s.a*value+s.b,right=s.c;
 const fits=s.relation==='lt'?left<right:s.relation==='le'?left<=right:s.relation==='gt'?left>right:left>=right;
 return {value,left:left||0,right,fits,inRay:includes(w,value)};
}
export function reasoning(s){
 if(!validInequalitySource(s))return null;
 const solved=solution(s),reversed={lt:'gt',le:'ge',gt:'lt',ge:'le'},finalRelation=s.a<0?reversed[s.relation]:s.relation;
 return [
  {equation:`${expressionText(s)} ${relationSymbol(s.relation)} ${display(s.c)}`,text:'Start with the original rule. A solution makes this comparison true.'},
  {equation:`${s.a===1?'x':s.a===-1?'-x':`${s.a}x`} ${relationSymbol(s.relation)} ${display(s.c-s.b)}`,text:`Subtract ${display(s.b)} from BOTH sides. Adding or subtracting the same number preserves the order and the solutions.`},
  {equation:`x ${relationSymbol(finalRelation)} ${display(solved.boundary)}`,text:s.a<0?`Divide BOTH sides by ${display(s.a)} and reverse the comparison. Why? ${display(s.a)} is less than ${display(-s.a)}, but after dividing both numbers by ${display(s.a)}, 1 is greater than -1. Negative division reverses order. These reversible steps give every real solution.`:`Divide BOTH sides by ${display(s.a)}. This number is positive, so keep the comparison direction. These reversible steps give every real solution.`}
 ];
}
export function rayGeometry(ray){
 if(!fields(ray,['boundary','direction','inclusive'])||!half(ray.boundary,-4,4)||!['lower','higher'].includes(ray.direction)||typeof ray.inclusive!=='boolean')return null;
 const boundaryX=60+(ray.boundary+6)*580/12;
 return {boundaryX,startX:ray.direction==='lower'?60:boundaryX,endX:ray.direction==='lower'?boundaryX:640,direction:ray.direction,inclusive:ray.inclusive};
}
const sheetNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^inequality-sheet-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(17)):null;
export function inequalitySheetsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'inequalitySheets'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.inequalitySheets))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.inequalitySheets){const n=sheetNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.inequalitySheets,(raw,index)=>{const n=sheetNumber(raw);return {raw,index,id:n===null?null:raw.id,readable:n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validInequalityWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export function keepInequalitySheet(book,source,work,options={}){
 try{
 if(!validInequalityWork(source,work)||typeof options?.canExport!=='function')return false;
 const view=inequalitySheetsView(book);if(!view.canKeep)return false;
 const max=view.items.reduce((n,item)=>Math.max(n,sheetNumber(item.raw)??0),0),id=`inequality-sheet-${max+1}`,candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.inequalitySheets;
 records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.inequalitySheets=records;
 if(!recoveryFitsProgressLimits(candidate))return false;
 const proposal=structuredClone(records);
 if(options.canExport(candidate)!==true)return false;
 book.inequalitySheets=proposal;return id;
 }catch{return false;}
}
