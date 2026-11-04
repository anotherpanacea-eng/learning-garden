import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {mapSheetSource} from './map-sheet-content.mjs';
export {recordGivenMath} from './given-math.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&[Object.prototype,null].includes(Object.getPrototypeOf(x));
const dense=(x,max=Infinity)=>Array.isArray(x)&&x.length<=max&&Reflect.ownKeys(x).length===x.length+1&&Array.from(x).every((_,i)=>own(x,i));
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
const reserved=new Set(['__proto__','constructor','prototype','toString','valueOf']);
const code=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!reserved.has(x);
const positive=(x,max)=>Number.isSafeInteger(x)&&x>0&&x<=max;
const location=x=>text(x,160);
const pair=p=>dense(p,2)&&p.length===2&&p.every(n=>positive(n,12));
const itemId=x=>typeof x==='string'&&/^map-sheet-[1-9]\d{0,5}$/.test(x)&&Number(x.slice(10))<=999999;
const clone=structuredClone;
export function validMapSource(s){
 return object(s)&&s.v===1&&code(s.id)&&location(s.title)&&text(s.origin,1000)&&text(s.notice,1000)&&text(s.purpose,1000)
  &&positive(s.sheetWidthCm,100)&&object(s.route)&&location(s.route.from)&&location(s.route.to)&&positive(s.route.lengthM,20000)
  &&dense(s.keys,12)&&s.keys.length>0&&new Set(s.keys).size===s.keys.length&&s.keys.every(k=>positive(k,100))
  &&dense(s.features,8)&&s.features.length>0&&new Set(s.features.map(f=>f?.id)).size===s.features.length
  &&s.features.every(f=>object(f)&&code(f.id)&&location(f.label)&&positive(f.widthM,20000))
  &&positive(s.detailWidthCm,100)&&positive(s.insetKey,100)&&object(s.readback)&&location(s.readback.from)&&location(s.readback.to)&&positive(s.readback.groundM,20000);
}
export function mapWorked(source){
 if(!validMapSource(source))return null;
 const w=source.worked;
 return object(w)&&dense(w.steps,8)&&w.steps.length>0&&w.steps.every(s=>text(s,1000))&&dense(w.factsByStep,8)&&w.factsByStep.length===w.steps.length
  &&w.factsByStep.every(ps=>dense(ps,24)&&ps.every(pair)&&new Set(ps.map(p=>[...p].sort((a,b)=>a-b).join('x'))).size===ps.length)?w:null;
}
export function mapOtherWidth(source){return validMapSource(source)&&positive(source.otherWidthCm,100)&&source.otherWidthCm!==source.sheetWidthCm?source.otherWidthCm:null;}
export function validMapWork(w){return object(w)&&validMapSource(w.source)&&w.source.keys.includes(w.key)&&['inset','readbackShown','narration'].every(k=>own(w,k)&&typeof w[k]==='boolean')&&Number.isInteger(w.workedSeen)&&w.workedSeen>=0&&w.workedSeen<=8;}
export function resizeMapWork(work){
 if(!validMapWork(work))return null;const width=mapOtherWidth(work.source);if(width===null)return null;
 const result=clone(work),s=result.source,old=s.sheetWidthCm;s.sheetWidthCm=width;s.otherWidthCm=old;s.resizedFromWidthCm=old;
 s.title=`Same route · ${width} centimeter sheet`;s.purpose=`Fit the ${s.route.from}-to-${s.route.to} path on ${width} centimeters of usable paper.`;
 return result;
}
const gcd=(a,b)=>{while(b){[a,b]=[b,a%b];}return a;};
export function divideMap(n,d){if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d===0)throw new RangeError('Map ratios require safe integers and a nonzero denominator.');const g=gcd(Math.abs(n),Math.abs(d));return {n:n/g*(d<0?-1:1),d:Math.abs(d)/g};}
export const mapNumber=r=>r.n/r.d;
export function formatMapRatio(r){
 const {n,d}=divideMap(r.n,r.d);let rest=d;while(rest%2===0)rest/=2;while(rest%5===0)rest/=5;
 if(rest!==1)return `${n}/${d}`;
 const sign=n<0?'-':'',a=Math.abs(n);let value=String(Math.floor(a/d)),rem=a%d;
 if(rem){value+='.';while(rem){rem*=10;value+=Math.floor(rem/d);rem%=d;}}
 return sign+value;
}
export function sheetGeometry(work){
 if(!validMapWork(work))return null;
 const s=work.source,viewportCm=Math.max(30,s.sheetWidthCm,mapOtherWidth(s)||0),routeCm=divideMap(s.route.lengthM,work.key),fits=s.route.lengthM<=s.sheetWidthCm*work.key;
 return {viewportCm,paperEnd:40+420*s.sheetWidthCm/viewportCm,routeEnd:40+420*Math.min(mapNumber(routeCm),s.sheetWidthCm)/viewportCm,routeCm,fits,spareCm:divideMap(s.sheetWidthCm*work.key-s.route.lengthM,work.key)};
}
export function mapDisplayPairs(work,view={}){
 if(!validMapWork(work))return [];const s=work.source,pairs=new Map(),add=(a,b)=>{if(pair([a,b])){const p=[a,b].sort((a,b)=>a-b);pairs.set(p.join('x'),p);}};
 for(const k of view.mutable?s.keys:[work.key])add(1,k);
 if(view.page===0){add(s.route.lengthM/work.key,work.key);const w=mapWorked(s);if(w&&view.workedOpen){const indices=view.mutable?(view.workedOpen&&Number.isInteger(view.step)&&view.step>=0&&view.step<w.steps.length?[view.step]:[]):Array.from({length:Math.min(work.workedSeen,w.steps.length)},(_,i)=>i);for(const i of indices)for(const p of w.factsByStep[i])add(...p);}}
 if(view.page===1){for(const f of s.features)add(f.widthM/work.key,work.key);if(work.inset){add(1,s.insetKey);for(const f of s.features)add(f.widthM/s.insetKey,s.insetKey);add(work.key/s.insetKey,s.insetKey);add(s.insetKey/work.key,work.key);}}
 if(view.page===2&&work.readbackShown)add(s.readback.groundM/work.key,work.key);
 return [...pairs.values()];
}
function owner(state){if(!object(state))return {status:'unsupported',raw:null};if(!own(state,'mapSheets'))return {status:'absent',raw:[]};return {status:Array.isArray(state.mapSheets)?'ready':'unsupported',raw:state.mapSheets};}
function nextId(raw){if(!dense(raw)||raw.length>=24)return null;let n=1;for(const item of raw)if(object(item)&&own(item,'id')&&itemId(item.id))n=Math.max(n,Number(item.id.slice(10))+1);return n<=999999?`map-sheet-${n}`:null;}
export function mapSheetsView(state){
 const o=owner(state),raw=Array.isArray(o.raw)?o.raw:[],counts=new Map();for(const x of raw)if(object(x)&&own(x,'id')&&itemId(x.id))counts.set(x.id,(counts.get(x.id)||0)+1);
 const items=Array.from(raw,(item,index)=>{const id=object(item)&&own(item,'id')&&itemId(item.id)?item.id:null,ambiguous=!!id&&counts.get(id)>1;return {raw:item,id,index,ambiguous,readable:!ambiguous&&object(item)&&item.kind==='map-sheet'&&item.v===1&&!!id&&validMapWork(item)};});
 return {status:o.status,raw:o.raw,items,canKeep:o.status!=='unsupported'&&nextId(raw)!==null};
}
export function keepMapSheet(state,work,options={}){
 if(!object(state)||typeof options?.canExport!=='function')return false;
 try{if(!validMapWork(work))return false;
  const original=owner(state);if(original.status==='unsupported'||!nextId(original.raw))return false;
  const candidate=clone(state),o=owner(candidate),id=nextId(o.raw);if(!id)return false;
  candidate.mapSheets=[...o.raw,{...clone(work),kind:'map-sheet',v:1,id}];const proposal=clone(candidate.mapSheets);
  if(!recoveryFitsProgressLimits(candidate)||options.canExport(candidate)!==true)return false;state.mapSheets=proposal;return id;
 }catch{return false;}
}
