import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {estimateSource} from './courier-estimates-content.mjs';

const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const dense=(x,max=Infinity)=>Array.isArray(x)&&x.length<=max&&Reflect.ownKeys(x).length===x.length+1&&Array.from(x).every((_,i)=>own(x,i));
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
const reserved=new Set(['__proto__','constructor','prototype','toString','valueOf']);
const code=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!reserved.has(x);
const half=(x,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=max&&Number.isSafeInteger(x*2);
const axis=a=>object(a)&&text(a.label,160)&&Number.isSafeInteger(a.max)&&a.max>0&&a.max<=100;
const axes=a=>object(a)&&axis(a.x)&&axis(a.y);
const list=(xs,max)=>dense(xs,12)&&xs.length>0&&new Set(xs).size===xs.length&&xs.every(x=>half(x,max));
const rowList=(rs,a)=>{
 if(!dense(rs,12)||!rs.length)return false;
 const ids=new Set();
 return rs.every(r=>{if(!object(r)||!code(r.id)||ids.has(r.id)||!half(r.x,a.x.max)||!half(r.y,a.y.max))return false;ids.add(r.id);return true;});
};
const paragraphs=xs=>dense(xs,8)&&xs.length>0&&xs.every(x=>text(x,1000));
const itemId=x=>typeof x==='string'&&/^estimate-[1-9]\d{0,5}$/.test(x)&&Number(x.slice(9))<=999999;
const support=x=>object(x)&&['worked','gaps','rise','narration'].every(k=>own(x,k)&&typeof x[k]==='boolean');
const clone=x=>structuredClone(x);

export const estimateValue=(line,x)=>line.rate*x+line.start;
export function validEstimateSource(s){
 return object(s)&&s.v===1&&code(s.id)&&text(s.title,160)&&text(s.origin,1000)&&text(s.notice,1000)&&text(s.context,1000)&&axes(s.axes)&&rowList(s.rows,s.axes)
  &&list(s.starts,20)&&list(s.rates,20)&&list(s.requests,Math.min(20,s.axes.x.max))
  &&Math.max(...s.starts)+Math.max(...s.rates)*s.axes.x.max<=s.axes.y.max
  &&object(s.teaching)&&paragraphs(s.teaching.questions);
}
export function workedEstimate(source){
 if(!validEstimateSource(source))return null;
 const w=source.worked;
 return object(w)&&w.v===1&&axes(w.axes)&&rowList(w.rows,w.axes)&&object(w.line)&&half(w.line.start,20)&&half(w.line.rate,20)
  &&estimateValue(w.line,w.axes.x.max)<=w.axes.y.max&&paragraphs(w.steps)?w:null;
}
export function validEstimateLine(source,line){return validEstimateSource(source)&&object(line)&&source.starts.includes(line.start)&&source.rates.includes(line.rate);}
export function estimateRange(source,x){
 if(!validEstimateSource(source)||!half(x,source.axes.x.max))return null;
 const low=Math.min(...source.rows.map(r=>r.x)),high=Math.max(...source.rows.map(r=>r.x));
 return x<low||x>high?'outside':x===low||x===high?'edge':source.rows.some(r=>r.x===x)?'observed':'inside';
}
function validDraft(d){
 if(!object(d)||!validEstimateSource(d.source)||!validEstimateLine(d.source,d.line)||!(d.pin===null||validEstimateLine(d.source,d.pin))
  ||!code(d.recordId)||!d.source.rows.some(r=>r.id===d.recordId)||!d.source.requests.includes(d.requestX)||!support(d.support))return false;
 const r=d.result;
 return r===null||object(r)&&d.source.requests.includes(r.x)&&validEstimateLine(d.source,r.line)&&(r.pin===null||validEstimateLine(d.source,r.pin));
}
export function readableEstimate(item){return object(item)&&item.kind==='courier-estimate'&&item.v===1&&itemId(item.id)&&validDraft(item);}

// Supplied arithmetic is familiarity, never a new recall response. Use the
// operands actually displayed, not coincidences among the recorded trip values.
export function courierDisplayPairs(work,view={}){
 if(!validDraft(work))return [];
 const pairs=new Map(),add=(rate,x)=>{if(Number.isInteger(rate)&&rate>=1&&rate<=12&&Number.isInteger(x)&&x>=1&&x<=12){const p=[rate,x].sort((a,b)=>a-b);pairs.set(p.join('x'),p);}};
 const row=work.source.rows.find(r=>r.id===work.recordId);
 add(work.line.rate,row.x);if(work.pin)add(work.pin.rate,row.x);
 if(view.rise)add(work.line.rate,Math.min(2,work.source.axes.x.max));
 if(view.page===1&&view.gaps)for(const r of work.source.rows)add(work.line.rate,r.x);
 if(view.page===2&&work.result?.x===work.requestX){add(work.result.line.rate,work.result.x);if(work.result.pin)add(work.result.pin.rate,work.result.x);}
 if(view.page===0&&view.worked){const example=workedEstimate(work.source),step=view.step;if(example&&Number.isInteger(step)&&step>=0&&step<example.steps.length)add(example.line.rate,example.rows[Math.min(step,example.rows.length-1)].x);}
 return [...pairs.values()];
}

export {recordGivenMath as recordCourierDisplay} from './given-math.mjs';
function owner(state){
 if(!object(state))return {status:'unsupported',raw:null};
 if(!own(state,'courierEstimates'))return {status:'absent',raw:[]};
 return {status:Array.isArray(state.courierEstimates)?'ready':'unsupported',raw:state.courierEstimates};
}
function nextId(raw){
 if(!dense(raw)||raw.length>=24)return null;
 let n=1;for(const item of raw)if(object(item)&&own(item,'id')&&itemId(item.id))n=Math.max(n,Number(item.id.slice(9))+1);
 return n<=999999?`estimate-${n}`:null;
}
export function estimatesView(state){
 const o=owner(state),raw=Array.isArray(o.raw)?o.raw:[],counts=new Map();
 for(const item of raw)if(object(item)&&own(item,'id')&&itemId(item.id))counts.set(item.id,(counts.get(item.id)||0)+1);
 const items=Array.from(raw,(item,index)=>{
  const id=object(item)&&own(item,'id')&&itemId(item.id)?item.id:null,ambiguous=!!id&&counts.get(id)>1;
  return {raw:item,id,index,ambiguous,readable:!ambiguous&&readableEstimate(item)};
 });
 return {status:o.status,raw:o.raw,items,canKeep:o.status!=='unsupported'&&nextId(raw)!==null};
}

// The export gate sees a disposable whole-notebook candidate. Capture the owner
// before calling it so callback edits cannot substitute different saved work.
export function keepEstimate(state,draft,options={}){
 if(!object(state)||typeof options?.canExport!=='function')return false;
 try{
  if(!validDraft(draft))return false;
  const original=owner(state);if(original.status==='unsupported'||!nextId(original.raw))return false;
  const candidate=clone(state),o=owner(candidate),id=o.status==='unsupported'?null:nextId(o.raw);if(!id)return false;
  const item={...clone(draft),kind:'courier-estimate',v:1,id};if(!readableEstimate(item))return false;
  candidate.courierEstimates=[...o.raw,item];
  const proposal=clone(candidate.courierEstimates);
  if(!recoveryFitsProgressLimits(candidate)||options.canExport(candidate)!==true)return false;
  state.courierEstimates=proposal;return id;
 }catch{return false;}
}
