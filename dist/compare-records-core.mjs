import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {compareSource} from './compare-records-content.mjs';
export {newReferenceView} from './reference-scales-content.mjs';
export {recordGivenMath} from './given-math.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&[Object.prototype,null].includes(Object.getPrototypeOf(x));
const dense=(x,max=Infinity)=>Array.isArray(x)&&x.length<=max&&Reflect.ownKeys(x).length===x.length+1&&Array.from(x).every((_,i)=>own(x,i));
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
const reserved=new Set(['__proto__','constructor','prototype','toString','valueOf']);
const code=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!reserved.has(x);
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const pair=p=>dense(p,2)&&p.length===2&&p.every(n=>integer(n,1,12));
const itemId=x=>typeof x==='string'&&/^comparison-[1-9]\d{0,5}$/.test(x)&&Number(x.slice(11))<=999999;
const clone=structuredClone;
function validBaseSource(s){
 return object(s)&&s.v===1&&code(s.id)&&text(s.title,160)&&text(s.origin,1000)&&text(s.notice,1000)&&text(s.purpose,1000)
  &&object(s.axis)&&integer(s.axis.max,1,240)&&integer(s.axis.tick,1,240)&&integer(s.axis.max/s.axis.tick,2,8)
  &&dense(s.groups,2)&&s.groups.length===2&&new Set(s.groups.map(g=>g?.id)).size===2
  &&s.groups.every(g=>object(g)&&code(g.id)&&text(g.label,160)&&dense(g.records,12)&&g.records.length>=3
   &&new Set(g.records.map(r=>r?.id)).size===g.records.length&&g.records.every(r=>object(r)&&code(r.id)&&integer(r.value,0,s.axis.max)&&(!own(r,'note')||text(r.note,1000))));
}
// The reserved family never falls back to the legacy minutes interpretation.
export const isReferenceScaleMode=source=>typeof source?.model==='string'&&source.model.startsWith('reference-scales-v');
const owns=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
function validTeaching(w){
 return owns(w,['steps','factsByStep'])&&dense(w.steps,8)&&w.steps.length>0&&w.steps.every(s=>text(s,1000))&&dense(w.factsByStep,8)&&w.factsByStep.length===w.steps.length
  &&w.factsByStep.every(ps=>dense(ps,24)&&ps.every(pair)&&new Set(ps.map(p=>[...p].sort((a,b)=>a-b).join('x'))).size===ps.length);
}
export function validReferenceScaleSource(s){
 if(!validBaseSource(s)||!owns(s,['v','id','title','origin','notice','purpose','axis','groups','model','referenceScales'])||s.model!=='reference-scales-v1')return false;
 const r=s.referenceScales;
 if(!owns(s.axis,['max','tick'])||!s.groups.every(g=>owns(g,['id','label','records'])&&g.records.every(v=>owns(v,['id','value'])))||!owns(r,['v','unit','reference','adjustableGroupId','adjustment','check','copy','teaching','glossary'])||r.v!==1||r.unit!=='g'||!integer(r.reference,0,s.axis.max)||!code(r.adjustableGroupId))return false;
 if(!owns(r.adjustment,['min','max'])||!integer(r.adjustment.min,-120,0)||!integer(r.adjustment.max,0,120)||!owns(r.check,['reference','groups'])||!integer(r.check.reference,0,s.axis.max))return false;
 const check={...s,groups:r.check.groups};
 if(!validBaseSource(check)||!r.check.groups.every(g=>owns(g,['id','label','records'])&&g.records.every(v=>owns(v,['id','value'])))||!r.check.groups.every(g=>s.groups.some(a=>a.id===g.id)))return false;
 for(const groups of [s.groups,r.check.groups]){const g=groups.find(g=>g.id===r.adjustableGroupId);if(!g||!g.records.every(v=>v.value+r.adjustment.min>=0&&v.value+r.adjustment.max<=s.axis.max))return false;}
 return owns(r.copy,['intro','limit','reflection'])&&['intro','limit','reflection'].every(k=>text(r.copy[k],1000))&&validTeaching(r.teaching)
  &&dense(r.glossary,8)&&r.glossary.length>0&&r.glossary.every(g=>owns(g,['term','meaning'])&&text(g.term,80)&&text(g.meaning,1000));
}
export function validCompareSource(s){return isReferenceScaleMode(s)?validReferenceScaleSource(s):validBaseSource(s);}
export function validReferenceScaleWork(w){
 if(!validBaseWork(w)||!validReferenceScaleSource(w.source)||!owns(w,['referenceView']))return false;
 const v=w.referenceView,a=w.source.referenceScales.adjustment;
 return owns(v,['v','referenceShown','adjustmentShown','adjustment','checkShown'])&&v.v===1&&['referenceShown','adjustmentShown','checkShown'].every(k=>typeof v[k]==='boolean')&&integer(v.adjustment,a.min,a.max);
}
export function referenceScaleStage(work,check=false){
 if(!validReferenceScaleWork(work))return null;
 const source=clone(work.source),r=source.referenceScales;
 if(check)source.groups=clone(r.check.groups);
 return {source,reference:check?r.check.reference:r.reference,groupId:r.adjustableGroupId,adjustment:work.referenceView.adjustment};
}
export function referenceScalePreview(work,check=false){
 const stage=referenceScaleStage(work,check);if(!stage)return null;
 const records=stage.source.groups.find(g=>g.id===stage.groupId).records.map(r=>({...r,value:r.value+stage.adjustment}));
 return {groupId:stage.groupId,records,summary:recordSummary(records)};
}
export function comparisonNote(source){
 if(!validCompareSource(source)||!object(source.comparison))return null;const c=source.comparison;
 if(!code(c.groupId)||!code(c.recordId)||!text(c.note,1000))return null;
 const groupIndex=source.groups.findIndex(g=>g.id===c.groupId);if(groupIndex<0)return null;
 const recordIndex=source.groups[groupIndex].records.findIndex(r=>r.id===c.recordId);if(recordIndex<0)return null;
 return {...c,groupIndex,recordIndex,record:source.groups[groupIndex].records[recordIndex]};
}
export function compareWorked(source){
 if(!validCompareSource(source))return null;const w=isReferenceScaleMode(source)?source.referenceScales.teaching:source.worked;
 return validTeaching(w)?w:null;
}
function validBaseWork(w){
 return object(w)&&validCompareSource(w.source)&&['mean','median','range'].includes(w.focus)
  &&['aside','workingsShown','secondaryWorkingsSeen','narration'].every(k=>own(w,k)&&typeof w[k]==='boolean')
  &&integer(w.workedSeen,0,8)&&[null,'typical','total','variation'].includes(w.purpose);
}
export function validCompareWork(w){return isReferenceScaleMode(w?.source)?validReferenceScaleWork(w):validBaseWork(w);}
const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return a;};
export function compareRatio(n,d){
 if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d===0)throw new RangeError('Record ratios require safe integers and a nonzero denominator.');
 const g=gcd(Math.abs(n),Math.abs(d));return {n:n/g*(d<0?-1:1),d:Math.abs(d)/g};
}
export const compareNumber=r=>r.n/r.d;
export function formatCompare(r){
 const {n,d}=compareRatio(r.n,r.d);let rest=d;while(rest%2===0)rest/=2;while(rest%5===0)rest/=5;if(rest!==1)return `${n}/${d}`;
 const a=Math.abs(n);let value=String(Math.floor(a/d)),rem=a%d;if(rem){value+='.';while(rem){rem*=10;value+=Math.floor(rem/d);rem%=d;}}return (n<0?'-':'')+value;
}
export function recordSummary(records){
 if(!dense(records,12)||!records.length||!records.every(r=>object(r)&&integer(r.value,0,240)))return null;
 const ordered=records.map((r,index)=>({...r,index})).sort((a,b)=>a.value-b.value||a.index-b.index),n=ordered.length,total=ordered.reduce((sum,r)=>sum+r.value,0),middle=Math.floor(n/2);
 return {n,total,mean:compareRatio(total,n),median:n%2?compareRatio(ordered[middle].value,1):compareRatio(ordered[middle-1].value+ordered[middle].value,2),min:ordered[0].value,max:ordered[n-1].value,range:ordered[n-1].value-ordered[0].value,ordered};
}
export function secondarySummary(work){
 if(!validCompareWork(work)||!work.aside)return null;const note=comparisonNote(work.source);if(!note)return null;
 return recordSummary(work.source.groups[note.groupIndex].records.filter((_,i)=>i!==note.recordIndex));
}
export function compareGeometry(source){
 if(!validCompareSource(source))return null;
 const placed=source.groups.map(group=>{
  const points=group.records.map((r,index)=>({...r,index})).sort((a,b)=>a.value-b.value||a.index-b.index).map(r=>({...r,x:60+500*r.value/source.axis.max}));
  const assigned=[];for(const p of points){let lane=0;while(assigned.some(q=>q.lane===lane&&500*Math.abs(p.value-q.value)<16*source.axis.max))lane++;assigned.push({...p,lane});}return assigned;
 });
 const lanes=1+Math.max(...placed.flatMap(ps=>ps.map(p=>p.lane))),band=110+20*lanes,baselines=[40+20*lanes,40+20*lanes+band],height=2*band+40,count=source.axis.max/source.axis.tick;
 return {lanes,band,baselines,height,ticks:Array.from({length:count+1},(_,i)=>({value:i*source.axis.tick,x:60+500*i/count,label:i===0||i===count||count%2===0&&i===count/2})),groups:source.groups.map((g,i)=>({id:g.id,label:g.label,baseline:baselines[i],points:placed[i].map(p=>({...p,y:baselines[i]-20*p.lane}))}))};
}
export function compareDisplayPairs(work,view={}){
 if(!validCompareWork(work))return [];const pairs=new Map(),add=(a,b)=>{if(pair([a,b])){const p=[a,b].sort((a,b)=>a-b);pairs.set(p.join('x'),p);}};
 const summary=s=>{add(s.n,compareNumber(s.mean));if(s.n%2===0)add(2,compareNumber(s.median));};
 const scales=isReferenceScaleMode(work.source),visible=!scales||view.page!==2||work.referenceView.checkShown;
 if(work.workingsShown&&[0,1,2].includes(view.page)&&visible){
  const stage=scales?referenceScaleStage(work,view.page===2&&work.referenceView.checkShown):null;
  for(const g of (stage?.source||work.source).groups)summary(recordSummary(g.records));
  if(scales&&work.referenceView.adjustmentShown&&(view.page===2||work.referenceView.referenceShown))summary(referenceScalePreview(work,view.page===2&&work.referenceView.checkShown).summary);
  if(!scales&&view.page!==0&&(view.mutable||work.secondaryWorkingsSeen)){const s=secondarySummary(work);if(s)summary(s);}
 }
 const w=compareWorked(work.source);
 if(view.page===0&&view.workedOpen&&w){const indices=view.mutable?integer(view.step,0,w.steps.length-1)?[view.step]:[]:Array.from({length:Math.min(work.workedSeen,w.steps.length)},(_,i)=>i);for(const i of indices)for(const p of w.factsByStep[i])add(...p);}
 return [...pairs.values()];
}
function owner(state){if(!object(state))return {status:'unsupported',raw:null};if(!own(state,'compareRecords'))return {status:'absent',raw:[]};return {status:Array.isArray(state.compareRecords)?'ready':'unsupported',raw:state.compareRecords};}
function nextId(raw){if(!dense(raw)||raw.length>=24)return null;let n=1;for(const item of raw)if(object(item)&&own(item,'id')&&itemId(item.id))n=Math.max(n,Number(item.id.slice(11))+1);return n<=999999?`comparison-${n}`:null;}
export function compareRecordsView(state){
 const o=owner(state),raw=Array.isArray(o.raw)?o.raw:[],counts=new Map();for(const item of raw)if(object(item)&&own(item,'id')&&itemId(item.id))counts.set(item.id,(counts.get(item.id)||0)+1);
 const items=Array.from(raw,(item,index)=>{const id=object(item)&&own(item,'id')&&itemId(item.id)?item.id:null,ambiguous=!!id&&counts.get(id)>1;return {raw:item,id,index,ambiguous,readable:!ambiguous&&object(item)&&item.kind==='record-comparison'&&item.v===1&&!!id&&validCompareWork(item)};});
 return {status:o.status,raw:o.raw,items,canKeep:o.status!=='unsupported'&&nextId(raw)!==null};
}
export function keepComparison(state,work,options={}){
 if(!object(state)||typeof options?.canExport!=='function')return false;
 try{if(!validCompareWork(work))return false;const original=owner(state);if(original.status==='unsupported'||!nextId(original.raw))return false;
  const candidate=clone(state),o=owner(candidate),id=nextId(o.raw);if(!id)return false;
  candidate.compareRecords=[...o.raw,{...clone(work),kind:'record-comparison',v:1,id}];const proposal=clone(candidate.compareRecords);
  if(!recoveryFitsProgressLimits(candidate)||options.canExport(candidate)!==true)return false;state.compareRecords=proposal;return id;
 }catch{return false;}
}
