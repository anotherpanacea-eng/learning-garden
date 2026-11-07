// Exact own-source row operations. Only Keep writes this activity's notebook root.
import {fraction,plus,minus,times,divide,same} from './equality-desk-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {recordGivenMath as recordMixerDisplay} from './given-math.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const text=(x,max,blank=false)=>typeof x==='string'&&(blank||x.trim().length>0)&&[...x].length<=max;
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const validRow=r=>fields(r,['label','a','b','c'])&&text(r.label,160)&&integer(r.a,-6,6)&&integer(r.b,-6,6)&&integer(r.c,-24,24)&&(r.a!==0||r.b!==0);
const validRows=rs=>dense(rs,2,2,validRow);
const factors=(xs,max)=>dense(xs,2,2,x=>integer(x,-max,max));
const operation=op=>op==='add'||op==='subtract';
const rational=q=>fields(q,['n','d'])&&integer(q.n,-24,24)&&integer(q.d,1,12)&&same(q,fraction(q.n,q.d))&&fraction(q.n,q.d).n===q.n&&fraction(q.n,q.d).d===q.d;
const validPair=p=>fields(p,['x','y'])&&rational(p.x)&&rational(p.y);
export function validMixerSource(s){
 try{return fields(s,['v','model','id','title','story','question','rows','teaching'])&&s.v===1&&s.model==='two-rows-v1'&&text(s.id,80)&&!reserved.has(s.id)&&text(s.title,160)&&text(s.story,1500)&&text(s.question,1500)&&validRows(s.rows)&&dense(s.teaching,3,8,p=>fields(p,['words'])&&text(p.words,1500));}catch{return false;}
}
export function validMixerWork(s,w){
 try{return validMixerSource(s)&&fields(w,['v','factors','op','pair','previewShown','checkShown','referenceShown','teachingShown','note'])&&w.v===1&&factors(w.factors,3)&&operation(w.op)&&(w.pair===null||validPair(w.pair))&&['previewShown','checkShown','referenceShown','teachingShown'].every(k=>typeof w[k]==='boolean')&&text(w.note,1500,true);}catch{return false;}
}
export function newMixerWork(s){return validMixerSource(s)?{v:1,factors:[1,1],op:'add',pair:null,previewShown:false,checkShown:false,referenceShown:false,teachingShown:false,note:''}:null;}
export function changeMixerWork(s,w,action,value){
 try{
  if(!validMixerWork(s,w))return null;const next=structuredClone(w);
  if(action==='factors')next.factors=structuredClone(value);
  else if(action==='factor'){if(!fields(value,['index','value'])||!integer(value.index,0,1))return null;next.factors[value.index]=value.value;}
  else if(action==='op'||action==='note')next[action]=value;
  else if(action==='pair'){
   if(value===null)next.pair=null;
   else{if(!fields(value,['x','y'])||!['x','y'].every(k=>fields(value[k],['n','d'])&&integer(value[k].n,-24,24)&&integer(value[k].d,1,12)))return null;next.pair={...structuredClone(value),x:{...structuredClone(value.x),...fraction(value.x.n,value.x.d)},y:{...structuredClone(value.y),...fraction(value.y.n,value.y.d)}};}
  }else if(['preview','check','reference','teaching'].includes(action)){if(action==='check'&&next.pair===null)return null;next[action+'Shown']=true;}
  else return null;
  return validMixerWork(s,next)?next:null;
 }catch{return null;}
}
const product=(left,right)=>({left,right,value:left*right,pair:left!==0&&right!==0&&Math.abs(left)<=12&&Math.abs(right)<=12?[Math.abs(left),Math.abs(right)]:null});
const cross=(a,b,c,d)=>{const left=product(a,b),right=product(c,d);return {left,right,value:left.value-right.value};};
function mixing(rs,fs,op){
 const scaled=rs.map((r,i)=>{const products=['a','b','c'].map(k=>product(fs[i],r[k]));return {label:r.label,a:products[0].value,b:products[1].value,c:products[2].value,products};});
 const columns=['a','b','c'].map(key=>({key,left:scaled[0][key],right:scaled[1][key],op,value:scaled[0][key]+(op==='add'?1:-1)*scaled[1][key]}));
 const row=Object.fromEntries(columns.map(c=>[c.key,c.value])),zeroColumns=row.a===0?(row.b===0?'both':'x'):(row.b===0?'y':'neither');
 const kind=zeroColumns==='both'?(row.c===0?'tautology':'contradiction'):(zeroColumns==='neither'?'two':'one');
 return {factors:[...fs],op,scaled,columns,row,zeroColumns,kind,lost:fs.flatMap((n,i)=>n===0?[i]:[]),tautology:kind==='tautology'?(fs.every(n=>n===0)?'uninformative':'line'):null,products:scaled.flatMap(r=>r.products)};
}
export function mixRows(s,fs,op){try{return validMixerSource(s)&&factors(fs,6)&&operation(op)?mixing(s.rows,fs,op):null;}catch{return null;}}
const pairProduct=(coefficient,coordinate)=>{const numerator=product(coefficient,coordinate.n);return {coefficient,coordinate:structuredClone(coordinate),numerator,result:times(fraction(coefficient),coordinate)};};
function checking(rs,p){
 const rows=rs.map(r=>{const ax=pairProduct(r.a,p.x),by=pairProduct(r.b,p.y),sum=plus(ax.result,by.result);return {label:r.label,ax,by,sum,constant:r.c,fits:same(sum,fraction(r.c))};});
 return {pair:structuredClone(p),rows,kind:rows[0].fits?(rows[1].fits?'both':'first'):(rows[1].fits?'second':'neither'),products:rows.flatMap(r=>[r.ax.numerator,r.by.numerator])};
}
export function checkMixerPair(s,p){try{return validMixerSource(s)&&validPair(p)?checking(s.rows,p):null;}catch{return null;}}
function reference(rs){
 const [a,b]=rs,determinant=cross(a.a,b.b,b.a,a.b),crossA=cross(a.a,b.c,b.a,a.c),crossB=cross(a.b,b.c,b.b,a.c);
 const D=determinant.value,kind=D!==0?'one':crossA.value===0&&crossB.value===0?'line':'none';
 let mix=null,solves=[],substitution=null,pair=null,check=null;
 if(a.b!==0&&b.b!==0){const sign=D===0?1:Math.sign(D);mix=mixing(rs,[b.b*sign,-a.b*sign],'add');}
 else if(a.a!==0&&b.a!==0){const sign=D===0?1:-Math.sign(D);mix=mixing(rs,[b.a*sign,-a.a*sign],'add');}
 if(kind==='one'){
  if(mix){
   const variable=mix.row.a===0?'y':'x',coefficient=variable==='x'?mix.row.a:mix.row.b,value=divide(fraction(mix.row.c),fraction(coefficient));
   solves.push({variable,coefficient,constant:mix.row.c,value});
   const otherVariable=variable==='x'?'y':'x',key=otherVariable==='x'?'a':'b',knownKey=variable==='x'?'a':'b',rowIndex=rs.findIndex(r=>r[key]!==0),r=rs[rowIndex];
   const p=pairProduct(r[knownKey],value),remainder=minus(fraction(r.c),p.result),other=divide(remainder,fraction(r[key]));
   substitution={rowIndex,knownVariable:variable,otherVariable,knownValue:value,product:p,constant:r.c,remainder,coefficient:r[key],value:other};
   pair=variable==='x'?{x:value,y:other}:{x:other,y:value};
  }else{
   for(const r of rs){const variable=r.a!==0?'x':'y',coefficient=variable==='x'?r.a:r.b;solves.push({variable,coefficient,constant:r.c,value:divide(fraction(r.c),fraction(coefficient))});}
   pair=Object.fromEntries(solves.map(s=>[s.variable,s.value]));
  }
  check=checking(rs,pair);
 }
 const products=[determinant,...(kind==='one'?[]:[crossA,crossB])].flatMap(c=>[c.left,c.right]);
 if(mix)products.push(...mix.products);if(substitution)products.push(substitution.product.numerator);if(check)products.push(...check.products);
 return {kind,determinant,crossA,crossB,mix,solves,substitution,pair,check,products};
}
export function mixerReference(s){try{return validMixerSource(s)?reference(s.rows):null;}catch{return null;}}
export function validMixerExample(e){
 try{return fields(e,['v','model','rows','factors','op','pair','preview','check','reference'])&&e.v===1&&e.model==='two-rows-v1'&&validRows(e.rows)&&factors(e.factors,6)&&operation(e.op)&&(e.pair===null||validPair(e.pair))&&['preview','check','reference'].every(k=>typeof e[k]==='boolean')&&(!e.check||e.pair!==null);}catch{return false;}
}
export function mixerDisplay(s,w,view){
 try{
  if(!validMixerWork(s,w)||!object(view))return null;const display={};
  if(view.page==='mix'&&view.previewOpen===true)display.mix=mixing(s.rows,w.factors,w.op);
  else if(view.page==='pair'&&view.checkOpen===true&&w.pair!==null)display.check=checking(s.rows,w.pair);
  else if(view.page==='explain'&&view.referenceOpen===true)display.reference=reference(s.rows);
  else if(view.page==='teaching'){
   if(!integer(view.teachingPage,0,s.teaching.length-1))return null;const p=s.teaching[view.teachingPage],e=p.example;
   display.teaching={words:p.words,example:null,unavailable:!validMixerExample(e)};
   if(!display.teaching.unavailable){const shown={rows:structuredClone(e.rows)};if(e.preview)shown.mix=mixing(e.rows,e.factors,e.op);if(e.check)shown.check=checking(e.rows,e.pair);if(e.reference)shown.reference=reference(e.rows);display.teaching.example=shown;}
  }
  return display;
 }catch{return null;}
}
export function mixerDisplayPairs(s,w,view){
 const display=mixerDisplay(s,w,view);if(!display)return [];
 const layers=display.teaching?.example??display,seen=new Set(),pairs=[];
 for(const key of ['mix','check','reference'])for(const p of layers[key]?.products??[]){if(p.pair){const code=p.pair.join(',');if(!seen.has(code)){seen.add(code);pairs.push([...p.pair]);}}}
 return pairs;
}
const sheetId=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^rule-mix-[1-9][0-9]*$/.test(r.id)?r.id:null;
export function mixerSheetsView(book){
 try{
  if(!object(book))return {status:'unavailable',items:[],canKeep:false};
  if(!own(book,'ruleMixerSheets'))return {status:'absent',items:[],canKeep:true};
  if(!Array.isArray(book.ruleMixerSheets))return {status:'unavailable',items:[],canKeep:false};
  const counts=new Map();let max=0;
  for(const raw of book.ruleMixerSheets){const id=sheetId(raw);if(id===null)continue;counts.set(id,(counts.get(id)||0)+1);const n=Number(id.slice(9));max=Number.isSafeInteger(n)?Math.max(max,n):Infinity;}
  const items=Array.from(book.ruleMixerSheets,(raw,index)=>{const id=sheetId(raw),n=id===null?null:Number(id.slice(9));return {id,index,raw,readable:id!==null&&integer(n,1,999999)&&counts.get(id)===1&&fields(raw,['source','work'])&&validMixerWork(raw.source,raw.work)};});
  return {status:'ready',items,canKeep:max<999999};
 }catch{return {status:'unavailable',items:[],canKeep:false};}
}
export function keepMixerSheet(book,source,work,options={}){
 try{
  if(!validMixerWork(source,work)||typeof options?.canExport!=='function')return false;const view=mixerSheetsView(book);if(!view.canKeep)return false;
  const next=view.items.reduce((max,item)=>Math.max(max,sheetId(item.raw)===null?0:Number(item.raw.id.slice(9))),0)+1,id=`rule-mix-${next}`;
  const candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.ruleMixerSheets;
  records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.ruleMixerSheets=records;
  if(!recoveryFitsProgressLimits(candidate))return false;const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;book.ruleMixerSheets=proposal;return id;
 }catch{return false;}
}
