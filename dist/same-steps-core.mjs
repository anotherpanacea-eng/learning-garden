// Own-source interval comparisons. Reading or constructing never writes a notebook.
import {fraction,same} from './equality-desk-content.mjs';
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
const point=p=>fields(p,['x','y'])&&integer(p.x,-100,100)&&integer(p.y,-100,100);
function axes(a){
 if(!fields(a,['xMin','xMax','xStep','yMin','yMax','yStep']))return false;
 return ['x','y'].every(axis=>{
  const min=a[axis+'Min'],max=a[axis+'Max'],step=a[axis+'Step'],count=(max-min)/step;
  return integer(min,-100,100)&&integer(max,-100,100)&&min<max&&integer(step,1,20)&&integer(count,1,24);
 });
}
export function validStepSource(s){
 try{return fields(s,['v','id','title','story','rule','rows','axes','teaching','explanation','example'])&&s.v===1&&id(s.id)&&text(s.title,160)&&text(s.story)&&text(s.rule)&&text(s.explanation)&&words(s.teaching)&&axes(s.axes)&&dense(s.rows,2,10,p=>point(p)&&p.x>=s.axes.xMin&&p.x<=s.axes.xMax&&p.y>=s.axes.yMin&&p.y<=s.axes.yMax)&&new Set(s.rows.map(p=>p.x)).size===s.rows.length&&fields(s.example,['start','end','words'])&&point(s.example.start)&&point(s.example.end)&&s.example.start.x!==s.example.end.x&&words(s.example.words);}catch{return false;}
}
const vector=v=>fields(v,['x','y'])&&integer(v.x,-200,200)&&integer(v.y,-200,200);
const index=(s,i)=>integer(i,0,s.rows.length-2);
export function validStepWork(s,w){
 try{return validStepSource(s)&&fields(w,['v','selected','steps','idea','referenceShown','exampleShown'])&&w.v===1&&dense(w.selected,2,2,i=>index(s,i))&&object(w.steps)&&Object.entries(w.steps).every(([key,value])=>/^(?:0|[1-9][0-9]*)$/.test(key)&&index(s,Number(key))&&vector(value))&&[null,'same','different','not-sure'].includes(w.idea)&&typeof w.referenceShown==='boolean'&&typeof w.exampleShown==='boolean';}catch{return false;}
}
export function newStepWork(s){return validStepSource(s)?{v:1,selected:[0,Math.min(1,s.rows.length-2)],steps:{},idea:null,referenceShown:false,exampleShown:false}:null;}
export function changeStepWork(s,w,action,value){
 try{
  if(!validStepWork(s,w))return null;
  const next=structuredClone(w);
  if(action==='select'){
   if(!fields(value,['slot','index'])||!integer(value.slot,0,1)||!index(s,value.index))return null;
   next.selected[value.slot]=value.index;
  }else if(action==='adjust'){
   if(!fields(value,['interval','axis','delta'])||!index(s,value.interval)||!['x','y'].includes(value.axis)||![-1,1].includes(value.delta))return null;
   const key=String(value.interval);if(!own(next.steps,key))next.steps[key]={x:0,y:0};
   next.steps[key][value.axis]+=value.delta;
  }else if(action==='idea')next.idea=value;
  else if(action==='reference')next.referenceShown=true;
  else if(action==='example')next.exampleShown=true;
  else return null;
  return validStepWork(s,next)?next:null;
 }catch{return null;}
}
export function stepResult(s,w,i){
 if(!validStepWork(s,w)||!index(s,i))return null;
 const start={x:s.rows[i].x,y:s.rows[i].y},end={x:s.rows[i+1].x,y:s.rows[i+1].y},actual={x:end.x-start.x,y:end.y-start.y};
 actual.rate=fraction(actual.y,actual.x);
 const raw=own(w.steps,String(i))?w.steps[i]:null,built=raw?{x:raw.x,y:raw.y,rate:raw.x===0?null:fraction(raw.y,raw.x)}:null;
 const fitKind=built===null?'absent':built.x===actual.x&&built.y===actual.y?'fit':built.rate!==null&&same(built.rate,actual.rate)?'same-rate':'different';
 const candidateEnd=built===null?null:{x:start.x+built.x,y:start.y+built.y},a=s.axes;
 const outside=candidateEnd!==null&&(candidateEnd.x<a.xMin||candidateEnd.x>a.xMax||candidateEnd.y<a.yMin||candidateEnd.y>a.yMax);
 return {index:i,start,end,actual,built,fitKind,candidateEnd,outside};
}
export function pairResult(s,w){
 if(!validStepWork(s,w))return null;
 const rates=w.selected.map(i=>stepResult(s,w,i).actual.rate);
 return {rates,sameRate:same(rates[0],rates[1]),sameInterval:w.selected[0]===w.selected[1]};
}
export function exampleBounds(s){
 if(!validStepSource(s))return null;
 const {start,end}=s.example;
 return {xMin:Math.min(0,start.x,end.x)-1,xMax:Math.max(0,start.x,end.x)+1,yMin:Math.min(0,start.y,end.y)-1,yMax:Math.max(0,start.y,end.y)+1};
}
const sheetNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^rate-step-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(10)):null;
export function stepSheetsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'rateStepSheets'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.rateStepSheets))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.rateStepSheets){const number=sheetNumber(raw);if(number!==null){max=Math.max(max,number);counts.set(number,(counts.get(number)||0)+1);}}
 const items=Array.from(book.rateStepSheets,(raw,index)=>{const number=sheetNumber(raw);return {id:number===null?null:raw.id,index,raw,readable:number!==null&&counts.get(number)===1&&fields(raw,['source','work'])&&validStepWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export function keepStepSheet(book,source,work,options={}){
 try{
  if(!validStepWork(source,work)||typeof options?.canExport!=='function')return false;
  const view=stepSheetsView(book);if(!view.canKeep)return false;
  const number=view.items.reduce((max,item)=>Math.max(max,sheetNumber(item.raw)??0),0)+1,id=`rate-step-${number}`;
  const candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.rateStepSheets;
  records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.rateStepSheets=records;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;
  book.rateStepSheets=proposal;return id;
 }catch{return false;}
}
