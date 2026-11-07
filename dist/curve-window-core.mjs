// Known square rules, exact arithmetic and source-owned proposed pictures.
import {fraction,plus,minus,times,formatNumber} from './equality-desk-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {recordGivenMath as recordCurveDisplay} from './given-math.mjs';
export {formatNumber};
const own=(x,k)=>Object.hasOwn(x,k),clone=x=>structuredClone(x);
const object=x=>x!==null&&typeof x==='object'&&[Object.prototype,null].includes(Object.getPrototypeOf(x));
const fields=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
const integer=(x,lo,hi)=>Number.isSafeInteger(x)&&x>=lo&&x<=hi;
const text=(x,max=1500)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const dense=(xs,lo,hi,test)=>Array.isArray(xs)&&xs.length>=lo&&xs.length<=hi&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i],i)).every(Boolean);
const tag=s=>s.v===1&&s.model==='square-window-v1';
const integerY=(s,x)=>(x-s.h)**2+s.k;
const inside4=(s,x)=>integer(x,4*s.axes.xMin,4*s.axes.xMax);
export function validCurveModel(s){
 try{
  if(!fields(s,['v','model','h','k','axes','plotXs'])||!tag(s)||!integer(s.h,-3,3)||!integer(s.k,-9,9))return false;
  const a=s.axes;if(!fields(a,['xMin','xMax','yMin','yMax','xTick','yTick'])||!integer(a.xMin,-8,8)||!integer(a.xMax,-8,8)||a.xMin>=a.xMax||a.xMin>s.h-2||a.xMax<s.h+2||!integer(a.yMin,-16,0)||!integer(a.yMax,1,144)||a.yMin>Math.min(0,s.k)||a.yMax<Math.max(0,integerY(s,a.xMin),integerY(s,a.xMax))||a.xTick!==1||!integer(a.yTick,1,16))return false;
  let r=0;while(r*r<Math.max(0,-s.k))r++;
  if(s.k<0&&(a.xMin>s.h-r||a.xMax<s.h+r))return false;
  return dense(s.plotXs,3,17,(x,i)=>integer(x,a.xMin,a.xMax)&&(i===0||x>s.plotXs[i-1]))&&s.plotXs[0]===a.xMin&&s.plotXs.at(-1)===a.xMax&&s.plotXs.includes(s.h);
 }catch{return false;}
}
export function validCurveSource(s){
 try{return validCurveModel(s)&&fields(s,['id','title','story','question','teaching'])&&text(s.id,80)&&!reserved.has(s.id)&&text(s.title,160)&&text(s.story)&&text(s.question)&&dense(s.teaching,3,8,p=>fields(p,['words'])&&text(p.words));}catch{return false;}
}
export function validCurveExample(e){
 try{return validCurveModel(e)&&fields(e,['probe4','zeroes'])&&inside4(e,e.probe4)&&typeof e.zeroes==='boolean';}catch{return false;}
}
const band=(s,b)=>fields(b,['lo4','hi4'])&&inside4(s,b.lo4)&&inside4(s,b.hi4)&&b.lo4<=b.hi4;
export function validCurveWork(s,w){
 try{return validCurveSource(s)&&fields(w,['v','points','fold4','zeroIdea','bands','referenceShown','crossingsShown','teachingShown'])&&w.v===1&&dense(w.points,0,8,p=>fields(p,['x','y'])&&s.plotXs.includes(p.x)&&integer(p.y,s.axes.yMin,s.axes.yMax))&&(w.fold4===null||inside4(s,w.fold4))&&['unsure','none','one','two'].includes(w.zeroIdea)&&dense(w.bands,0,2,b=>band(s,b))&&['referenceShown','crossingsShown','teachingShown'].every(k=>typeof w[k]==='boolean');}catch{return false;}
}
export function newCurveWork(s){return validCurveSource(s)?{v:1,points:[],fold4:null,zeroIdea:'unsure',bands:[],referenceShown:false,crossingsShown:false,teachingShown:false}:null;}
export function changeCurveWork(s,w,action,value){
 try{
  if(!validCurveWork(s,w))return null;const n=clone(w);
  if(action==='add-point'){if(n.points.length>=8||!fields(value,['x','y']))return null;n.points.push({x:value.x,y:value.y});}
  else if(action==='remove-point'){if(!integer(value,0,n.points.length-1))return null;n.points.splice(value,1);}
  else if(action==='fold')n.fold4=value;
  else if(action==='idea')n.zeroIdea=value;
  else if(action==='add-band'){if(n.bands.length>=2||!band(s,value))return null;n.bands.push({lo4:value.lo4,hi4:value.hi4});}
  else if(action==='replace-band'){if(!fields(value,['index','lo4','hi4'])||!integer(value.index,0,n.bands.length-1)||!band(s,value))return null;Object.assign(n.bands[value.index],{lo4:value.lo4,hi4:value.hi4});}
  else if(action==='remove-band'){if(!integer(value,0,n.bands.length-1))return null;n.bands.splice(value,1);}
  else if(action==='reference')n.referenceShown=true;
  else if(action==='zeroes'){n.referenceShown=true;n.crossingsShown=true;}
  else if(action==='teaching')n.teachingShown=true;
  else return null;
  return validCurveWork(s,n)?n:null;
 }catch{return null;}
}
function calculation(s,x){
 const changed=minus(x,fraction(s.h)),square=times(changed,changed),y=plus(square,fraction(s.k));
 return {x,changed,square,y};
}
export function curveCalculation(s,x4){return validCurveModel(s)&&inside4(s,x4)?calculation(s,fraction(x4,4)):null;}
function rootInfo(s){
 if(s.k>0)return {kind:'none',count:0,bands:[],endpoints:[]};
 if(s.k===0){const x4=4*s.h;return {kind:'touch',count:1,bands:[{lo4:x4,hi4:x4}],endpoints:[{x4,...calculation(s,fraction(s.h))}]};}
 const target=-16*s.k;let a=0;while((a+1)*(a+1)<=target)a++;
 const exact=a*a===target,bands=exact?[{lo4:4*s.h-a,hi4:4*s.h-a},{lo4:4*s.h+a,hi4:4*s.h+a}]:[{lo4:4*s.h-a-1,hi4:4*s.h-a},{lo4:4*s.h+a,hi4:4*s.h+a+1}];
 const inputs=[...new Set(bands.flatMap(b=>[b.lo4,b.hi4]))];
 return {kind:exact?'exact':'intervals',count:2,bands,endpoints:inputs.map(x4=>({x4,...calculation(s,fraction(x4,4))}))};
}
export function curveReference(s,probe4,{zeroes=false}={}){
 if(!validCurveModel(s)||!inside4(s,probe4))return null;
 const L=s.axes.xMin,R=s.axes.xMax,m=fraction(L+R,2),left=calculation(s,fraction(L)).y,right=calculation(s,fraction(R)).y;
 const control=minus(times(fraction(2),calculation(s,m).y),times(fraction(1,2),plus(left,right)));
 return {rows:s.plotXs.map(x=>calculation(s,fraction(x))),probe:calculation(s,fraction(probe4,4)),vertex:{x:s.h,y:s.k},curve:{left:{x:fraction(L),y:left},control:{x:m,y:control},right:{x:fraction(R),y:right}},...(zeroes?{zeroes:rootInfo(s)}:{})};
}
export function curveTeachingReference(s,index){
 if(!validCurveSource(s)||!integer(index,0,s.teaching.length-1))return null;
 const p=s.teaching[index];return own(p,'example')&&validCurveExample(p.example)?curveReference(p.example,p.example.probe4,{zeroes:p.example.zeroes}):null;
}
export function curveDisplayPairs(s,w,view){
 try{
  if(!validCurveWork(s,w)||!fields(view,['page']))return null;let ref;
  if(view.page==='plot')return [];
  if(view.page==='teaching'){
   if(!integer(view.teachingPage,0,s.teaching.length-1))return null;
   ref=curveTeachingReference(s,view.teachingPage);if(!ref)return [];
  }else if(view.page==='compare'||view.page==='zeroes'){
   if(view.page==='zeroes'){
    if(typeof view.zeroModelOpen!=='boolean'||typeof view.zeroExplainOpen!=='boolean'||view.zeroExplainOpen&&!view.zeroModelOpen)return null;
    if(!view.zeroModelOpen)return [];
   }
   if(!inside4(s,view.probe4))return null;ref=curveReference(s,view.probe4,{zeroes:view.page==='zeroes'&&view.zeroExplainOpen});
  }else return null;
  const pairs=new Map(),add=x=>{if(integer(x,1,12))pairs.set(x,[x,x]);};
  for(const c of [...ref.rows,ref.probe,...(ref.zeroes?.endpoints||[])]){add(Math.abs(c.changed.n));if(c.changed.d>1)add(c.changed.d);}
  return [...pairs.values()].sort((a,b)=>a[0]-b[0]);
 }catch{return null;}
}
function sheetNumber(raw){
 if(!object(raw)||!own(raw,'id')||typeof raw.id!=='string'||!/^curve-sheet-[1-9][0-9]*$/.test(raw.id))return null;
 const n=Number(raw.id.slice(12));return Number.isSafeInteger(n)?n:Infinity;
}
export function curveSheetsView(book){
 try{
  if(!object(book))return {status:'unavailable',items:[],canKeep:false};
  if(!own(book,'curveSheets'))return {status:'absent',items:[],canKeep:true};
  if(!Array.isArray(book.curveSheets))return {status:'unavailable',items:[],canKeep:false};
  const counts=new Map();let max=0;
  for(const r of book.curveSheets){const n=sheetNumber(r);if(n!==null){max=Math.max(max,n);counts.set(r.id,(counts.get(r.id)||0)+1);}}
  return {status:'ready',canKeep:max<999999,items:Array.from(book.curveSheets,(raw,index)=>{const n=sheetNumber(raw);return {id:n===null?null:raw.id,raw,index,readable:n!==null&&Number.isSafeInteger(n)&&n<=999999&&counts.get(raw.id)===1&&fields(raw,['source','work'])&&validCurveWork(raw.source,raw.work)};})};
 }catch{return {status:'unavailable',items:[],canKeep:false};}
}
export function keepCurveSheet(book,source,work,options={}){
 try{
  if(!validCurveWork(source,work)||typeof options.canExport!=='function')return false;
  const v=curveSheetsView(book);if(!v.canKeep)return false;
  const n=v.items.reduce((max,r)=>Math.max(max,sheetNumber(r.raw)??0),0)+1,id='curve-sheet-'+n;
  const candidate=clone(book),rows=v.status==='absent'?[]:candidate.curveSheets;
  rows.push({id,source:clone(source),work:clone(work)});candidate.curveSheets=rows;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=clone(rows);if(options.canExport(candidate)!==true)return false;
  book.curveSheets=proposal;return id;
 }catch{return false;}
}
