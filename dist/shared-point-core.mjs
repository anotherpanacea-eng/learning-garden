// Own-source two-rule mathematics. Only Keep writes to a notebook.
import {fraction,plus,minus,times,divide,same,formatNumber} from './equality-desk-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&[...x].length<=max;
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const half=(x,min,max)=>Number.isFinite(x)&&Number.isInteger(2*x)&&x>=min&&x<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const coefficients=line=>fields(line,['m','b'])&&integer(line.m,-4,4)&&integer(line.b,-12,12);
const validLine=line=>coefficients(line)&&fields(line,['id','label'])&&id(line.id)&&text(line.label,1500);
export function validSharedPointSource(s){
 try{return fields(s,['v','model','id','title','story','teaching','example','lines'])&&s.v===1&&s.model==='two-lines-v1'&&id(s.id)&&text(s.title,160)&&text(s.story,1500)&&text(s.example,1500)&&dense(s.teaching,1,8,t=>text(t,1500))&&dense(s.lines,2,2,validLine)&&s.lines[0].id!==s.lines[1].id;}catch{return false;}
}
export function validSharedPointWork(s,w){
 try{return validSharedPointSource(s)&&fields(w,['v','x','y','claim','referenceShown'])&&w.v===1&&half(w.x,-4,4)&&half(w.y,-6,6)&&[null,'one','none','line'].includes(w.claim)&&typeof w.referenceShown==='boolean';}catch{return false;}
}
export function newSharedPointWork(s){return validSharedPointSource(s)?{v:1,x:2,y:-5,claim:null,referenceShown:false}:null;}
export function changeSharedPointWork(s,w,action,value){
 try{
  if(!validSharedPointWork(s,w))return null;
  const next=structuredClone(w);
  if(action==='x'||action==='y'||action==='claim')next[action]=value;
  else if(action==='reference')next.referenceShown=true;
  else return null;
  return validSharedPointWork(s,next)?next:null;
 }catch{return null;}
}
const output=(line,x)=>plus(times(fraction(line.m),x),fraction(line.b));
export function pointResult(s,w){
 if(!validSharedPointWork(s,w))return null;
 const x=fraction(2*w.x,2),y=fraction(2*w.y,2),outputs=s.lines.map(line=>output(line,x)),fits=outputs.map(value=>same(value,y));
 return {x:w.x,y:w.y,outputs,fits,kind:fits[0]?(fits[1]?'both':'first'):(fits[1]?'second':'neither')};
}
export function sharedSet(s){
 if(!validSharedPointSource(s))return null;
 const [a,b]=s.lines,m=minus(fraction(a.m),fraction(b.m)),start=minus(fraction(b.b),fraction(a.b));
 if(m.n===0)return {kind:start.n===0?'line':'none'};
 const x=divide(start,m);return {kind:'one',x,y:output(a,x)};
}
const term=m=>m===0?'0x':m===1?'x':m===-1?'-x':`${m}x`;
export function sharedLineExpression(line){
 if(!coefficients(line))return null;
 if(line.m===0)return String(line.b||0);
 return term(line.m)+(line.b===0?'':line.b>0?` + ${line.b}`:` - ${Math.abs(line.b)}`);
}
export const sharedLineEquation=line=>coefficients(line)?`y = ${sharedLineExpression(line)}`:null;
export function sharedReasoning(s){
 if(!validSharedPointSource(s))return null;
 const [a,b]=s.lines,set=sharedSet(s),difference=a.m-b.m,start=b.b-a.b;
 const rows=[
  {equation:`${sharedLineExpression(a)} = ${sharedLineExpression(b)}`,text:`Equate the two outputs from ${a.label} and ${b.label}. A shared point must have the same y in both rules.`},
  {equation:`${term(difference)} = ${start}`,text:`Subtract (${b.m})x and (${a.b}) from both sides. These reversible changes preserve the shared points.`}
 ];
 if(set.kind==='one'){
  rows.push({equation:`x = ${formatNumber(set.x)}`,text:`Divide both sides by ${difference}, the nonzero difference in slopes. This gives the only possible x.`},
   {equation:`y = ${a.m} × (${formatNumber(set.x)}) + (${a.b}) = ${formatNumber(set.y)}`,text:`Substitute x into ${a.label} to find y.`},
   {equation:`${a.label}: ${formatNumber(set.y)} = ${a.m} × (${formatNumber(set.x)}) + (${a.b}); ${b.label}: ${formatNumber(set.y)} = ${b.m} × (${formatNumber(set.x)}) + (${b.b})`,text:`Both original rules fit the same ordered pair (${formatNumber(set.x)}, ${formatNumber(set.y)}). The reversible steps give the single shared pair.`});
 }else if(set.kind==='none')rows.push({equation:`0 = ${start}`,text:'Zero cannot equal that nonzero number. No point can fit both lines. They are distinct parallel lines; not seeing a crossing in this window alone would not prove it.'});
 else rows.push({equation:`0 = 0; ${sharedLineEquation(a)}`,text:'Both rules describe the same line. Infinitely many pairs on that line fit both; points off the line do not. This is not every point in the plane.'});
 return rows;
}
export function clipSharedLine(line){
 if(!coefficients(line))return null;
 const {m,b}=line;
 if(m===0)return b>=-6&&b<=6?{from:[-4,b||0],to:[4,b||0]}:null;
 const ends=[(-6-b)/m,(6-b)/m],left=Math.max(-4,Math.min(...ends)),right=Math.min(4,Math.max(...ends));
 if(left>=right)return null;
 const clean=n=>Object.is(n,-0)?0:n;
 return {from:[clean(left),clean(m*left+b)],to:[clean(right),clean(m*right+b)]};
}
const sheetNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^shared-point-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(13)):null;
export function sharedPointSheetsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'sharedPointSheets'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.sharedPointSheets))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.sharedPointSheets){const n=sheetNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.sharedPointSheets,(raw,index)=>{const n=sheetNumber(raw);return {id:n===null?null:raw.id,index,raw,readable:n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validSharedPointWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export function keepSharedPointSheet(book,source,work,options={}){
 try{
  if(!validSharedPointWork(source,work)||typeof options?.canExport!=='function')return false;
  const view=sharedPointSheetsView(book);if(!view.canKeep)return false;
  const next=view.items.reduce((n,item)=>Math.max(n,sheetNumber(item.raw)??0),0)+1,id=`shared-point-${next}`;
  const candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.sharedPointSheets;
  records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.sharedPointSheets=records;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;
  book.sharedPointSheets=proposal;return id;
 }catch{return false;}
}
