// Frozen source-owned views; only explicit Keep writes to the book.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {lensCases,lensSource} from './lens-bench-content.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&[...x].length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const list=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=x=>new Set(x).size===x.length;
const range=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max;
const integer=(x,min,max)=>Number.isInteger(x)&&range(x,min,max);
const center=(s,c)=>fields(c,['x','y'])&&range(c.x,0,s.world.width)&&range(c.y,0,s.world.height);
// This helper deliberately does not revalidate the source (teaching uses it).
const viewShape=(s,v)=>fields(v,['objectiveId','focusId','center'])&&s.objectives.some(o=>o.id===v.objectiveId)&&s.focus.some(f=>f.id===v.focusId)&&center(s,v.center);
export function validLensSource(s){
 try{
  if(!fields(s,['v','model','id','title','context','notice','returnQuestion','photoQuestion','annotation','world','eyepiece','objectives','marks','targetId','focus','initialFocusId','teaching','photo'])||s.v!==1||s.model!=='lens-bench-v1'||!id(s.id)||!text(s.title,160)||!['context','notice','returnQuestion','photoQuestion','annotation'].every(k=>text(s[k],1500)))return false;
  const w=s.world;
  if(!fields(w,['width','height','baseDiameter','baseObjectiveId','center'])||!range(w.width,100,10000)||!range(w.height,100,10000)||!range(w.baseDiameter,16,Math.min(w.width,w.height))||!center(s,w.center)||!integer(s.eyepiece,1,30))return false;
  if(!list(s.objectives,1,6)||!s.objectives.every(o=>fields(o,['id','label','power'])&&id(o.id)&&text(o.label,160)&&integer(o.power,1,100))||!unique(s.objectives.map(o=>o.id))||!s.objectives.some(o=>o.id===w.baseObjectiveId))return false;
  if(!list(s.focus,1,7)||!s.focus.every(f=>fields(f,['id','label','blur'])&&id(f.id)&&text(f.label,160)&&range(f.blur,0,12))||!unique(s.focus.map(f=>f.id))||!s.focus.some(f=>f.id===s.initialFocusId))return false;
  if(!list(s.marks,1,40)||!s.marks.every(m=>fields(m,['id','label','art','x','y','size'])&&id(m.id)&&text(m.label,160)&&['ring','box','cross','zigzag'].includes(m.art)&&range(m.size,Number.MIN_VALUE,100)&&range(m.x,m.size,w.width-m.size)&&range(m.y,m.size,w.height-m.size))||!unique(s.marks.map(m=>m.id))||!s.marks.some(m=>m.id===s.targetId))return false;
  const p=s.photo;
  return list(s.teaching,1,8)&&s.teaching.every(t=>fields(t,['text','view'])&&text(t.text,1500)&&viewShape(s,t.view))&&fields(p,['art','title','sourceTitle','caption','alt','credit','license','captureLabel','notice','zooms'])&&p.art==='onion120-v1'&&['title','sourceTitle','captureLabel'].every(k=>text(p[k],160))&&['caption','alt','credit','license','notice'].every(k=>text(p[k],1500))&&list(p.zooms,1,5)&&p.zooms.every(z=>range(z,1,8))&&unique(p.zooms)&&p.zooms.includes(1);
 }catch{return false;}
}
export function validLensWork(s,w){
 try{if(!validLensSource(s)||!fields(w,['v','view','pin','exampleSeen','photoShown','photoView'])||w.v!==1||!viewShape(s,w.view)||(w.pin!==null&&!viewShape(s,w.pin))||!integer(w.exampleSeen,0,s.teaching.length)||typeof w.photoShown!=='boolean'||!fields(w.photoView,['zoom','x','y'])||!s.photo.zooms.includes(w.photoView.zoom))return false;
  const H=0.5/w.photoView.zoom;return range(w.photoView.x,H,1-H)&&range(w.photoView.y,H,1-H);
 }catch{return false;}
}
export function newLensWork(s){return validLensSource(s)?{v:1,view:{objectiveId:s.world.baseObjectiveId,focusId:s.initialFocusId,center:structuredClone(s.world.center)},pin:null,exampleSeen:0,photoShown:false,photoView:{zoom:1,x:0.5,y:0.5}}:null;}
export function lensMetrics(s,v){
 if(!validLensSource(s)||!viewShape(s,v))return null;
 const power=s.objectives.find(o=>o.id===v.objectiveId).power,base=s.objectives.find(o=>o.id===s.world.baseObjectiveId).power,diameter=s.world.baseDiameter*base/power,scale=400/diameter,sigma=s.focus.find(f=>f.id===v.focusId).blur*scale;
 return {total:s.eyepiece*power,diameter,scale,sigma,limited:sigma>200};
}
export function projectLensPoint(s,v,p){const m=lensMetrics(s,v);return m&&fields(p,['x','y'])&&Number.isFinite(p.x)&&Number.isFinite(p.y)?{x:200+(p.x-v.center.x)*m.scale,y:200+(p.y-v.center.y)*m.scale}:null;}
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const directions={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]};
export function changeLensWork(s,w,action,value){
 if(!validLensWork(s,w))return null;
 try{
  const next=structuredClone(w),v=next.view;
  switch(action){
   case 'objective':if(!s.objectives.some(o=>o.id===value))return null;v.objectiveId=value;break;
   case 'focus':{if(value!==1&&value!==-1)return null;const i=s.focus.findIndex(f=>f.id===v.focusId);v.focusId=s.focus[clamp(i+value,0,s.focus.length-1)].id;break;}
   case 'pan':{if(!own(directions,value))return null;const [x,y]=directions[value],step=lensMetrics(s,v).diameter/4;v.center.x=clamp(v.center.x+x*step,0,s.world.width);v.center.y=clamp(v.center.y+y*step,0,s.world.height);break;}
   case 'tap':{if(!fields(value,['x','y'])||!Number.isFinite(value.x)||!Number.isFinite(value.y)||(value.x-200)**2+(value.y-200)**2>200**2)return null;const scale=lensMetrics(s,v).scale;v.center.x=clamp(v.center.x+(value.x-200)/scale,0,s.world.width);v.center.y=clamp(v.center.y+(value.y-200)/scale,0,s.world.height);break;}
   case 'pin':next.pin=structuredClone(v);break;
   case 'example':next.exampleSeen=Math.min(s.teaching.length,next.exampleSeen+1);break;
   case 'photo':next.photoShown=true;break;
   case 'photoZoom':{if(!s.photo.zooms.includes(value))return null;next.photoView.zoom=value;const H=0.5/value;next.photoView.x=clamp(next.photoView.x,H,1-H);next.photoView.y=clamp(next.photoView.y,H,1-H);break;}
   case 'photoPan':{if(!own(directions,value))return null;const [x,y]=directions[value],p=next.photoView,H=0.5/p.zoom,step=1/(4*p.zoom);p.x=clamp(p.x+x*step,H,1-H);p.y=clamp(p.y+y*step,H,1-H);break;}
   default:return null;
  }
  return validLensWork(s,next)?next:null;
 }catch{return null;}
}
const viewNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^lens-view-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(10)):null;
export function lensViewsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'lensViews'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.lensViews))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.lensViews){const n=viewNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.lensViews,(raw,index)=>{const n=viewNumber(raw);return {raw,index,id:n===null?null:raw.id,readable:n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validLensWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export const lastLensView=book=>lensViewsView(book).items.findLast(item=>item.readable)??null;
export function keepLensView(book,source,work,options={}){
 if(!validLensWork(source,work)||typeof options?.canExport!=='function')return false;
 const view=lensViewsView(book);if(!view.canKeep)return false;
 try{
  const max=view.items.reduce((n,item)=>Math.max(n,viewNumber(item.raw)??0),0),newId=`lens-view-${max+1}`,candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.lensViews;
  records.push({id:newId,source:structuredClone(source),work:structuredClone(work)});candidate.lensViews=records;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;
  book.lensViews=proposal;return newId;
 }catch{return false;}
}
