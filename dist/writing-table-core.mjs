import {taskSource,writingTasks} from './writing-table-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k),clone=x=>structuredClone(x);
const placed=(w,k)=>own(w.placements,k)?w.placements[k]:null;
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(x);
const text=x=>typeof x==='string'&&Array.from(x).length<=4000;
const integer=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const ids=xs=>Array.isArray(xs)&&xs.length<=12&&xs.every(id)&&new Set(xs).size===xs.length;
const parts=xs=>Array.isArray(xs)&&xs.length>0&&xs.length<=12&&xs.every(x=>object(x)&&id(x.id)&&text(x.text))&&new Set(xs.map(x=>x.id)).size===xs.length;
const lines=xs=>Array.isArray(xs)&&xs.length<=12&&xs.every(text);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function validWritingSource(s){
 if(!object(s)||s.v!==1||!id(s.id)||!id(s.family)||!['sort','order','break','choice'].includes(s.kind)||!['title','reader','prompt','hint','example'].every(k=>text(s[k]))||!lines(s.teach)||!parts(s.parts)||!Array.isArray(s.choices)||s.choices.length>12||s.choices.length&&!parts(s.choices))return false;
 if(['after','changes'].some(k=>own(s,k)&&!text(s[k]))||own(s,'steps')&&(!lines(s.steps)||s.steps.length>3))return false;
 if(!object(s.feedback)||!text(s.feedback.fit)||!text(s.feedback.general)||!object(s.feedback.different)||Object.values(s.feedback.different).some(x=>!text(x)))return false;
 const p=s.parts.map(x=>x.id),c=s.choices.map(x=>x.id);
 if(s.kind==='sort')return c.length>0&&object(s.key)&&p.every(k=>own(s.key,k)&&c.includes(s.key[k]));
 if(s.kind==='order')return ids(s.key)&&s.key.length===p.length&&s.key.every(k=>p.includes(k));
 return typeof s.key==='string'&&(s.kind==='break'?p.slice(1):c).includes(s.key);
}
export function validWritingWork(s,w){
 if(!validWritingSource(s)||!object(w))return false;
 const p=s.parts.map(x=>x.id);
 if(s.kind==='sort')return object(w.placements)&&Object.entries(w.placements).every(([k,v])=>p.includes(k)&&(v===null||s.choices.some(x=>x.id===v)));
 if(s.kind==='order')return ids(w.order)&&w.order.length===p.length&&w.order.every(k=>p.includes(k));
 return s.kind==='break'?(w.boundary===null||p.slice(1).includes(w.boundary)):(w.choice===null||s.choices.some(x=>x.id===w.choice));
}
const help=h=>object(h)&&['hint','example','narration','together'].every(k=>typeof h[k]==='boolean');
const validCheck=(s,c)=>object(c)&&validWritingWork(s,c.work)&&help(c.help)&&['fit','different','incomplete'].includes(c.outcome)&&c.supported===true&&c.guided===true&&Array.isArray(c.feedback)&&c.feedback.length<=14&&c.feedback.every(x=>typeof x==='string'&&Array.from(x).length<=16000);
export const validWritingRecord=r=>object(r)&&validWritingSource(r.source)&&validWritingWork(r.source,r.work)&&help(r.help)&&Array.isArray(r.checks)&&r.checks.length<=24&&r.checks.every(c=>validCheck(r.source,c))&&integer(r.count,r.checks.length,1000000);
export const validWritingSnapshot=(s,k)=>object(k)&&validWritingWork(s,k.work)&&help(k.help)&&(k.check===null||validCheck(s,k.check)&&sameWritingWork(k.work,k.check.work));
const rootShape=r=>object(r)&&r.v===1&&object(r.records)&&Object.keys(r.records).length<=64&&typeof r.currentId==='string';
export function writingView(state){
 const r=state?.writingDesk;
 if(!state||!own(state,'writingDesk'))return {status:'new',record:null,records:[],familiar:false};
 if(!rootShape(r))return {status:'unsupported',record:null,records:[],familiar:false};
 const records=Object.entries(r.records).map(([key,value])=>({id:key,readable:id(key)&&validWritingRecord(value),title:validWritingRecord(value)?value.source.title:null}));
 const record=own(r.records,r.currentId)&&validWritingRecord(r.records[r.currentId])?r.records[r.currentId]:null;
 const familiar=!!record&&Object.entries(r.records).some(([key,x])=>key!==r.currentId&&validWritingRecord(x)&&x.source.family===record.source.family);
 return {status:'ready',record,records,familiar};
}
function initialWork(s){
 return s.kind==='sort'?{placements:Object.fromEntries(s.parts.map(x=>[x.id,null]))}:s.kind==='order'?{order:s.parts.map(x=>x.id)}:s.kind==='break'?{boundary:null}:{choice:null};
}
const fail=error=>({ok:false,error});
function change(state,mutate,options={}){
 try{
  const next=clone(state),result=mutate(next);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(next)||options.canExport&&!options.canExport(next))return fail('unexportable');
  state.writingDesk=next.writingDesk;return result;
 }catch{return fail('unexportable');}
}
function edit(state,mutate,options){return change(state,next=>{const r=writingView(next).record;if(!r)return fail('unavailable');const result=mutate(r);return !result.ok||validWritingRecord(r)?result:fail('unavailable');},options);}
export function openWritingTask(state,taskId,options){return change(state,next=>{
 if(!id(taskId))return fail('selection');
 if(!own(next,'writingDesk'))next.writingDesk={v:1,currentId:'',records:{}};
 const r=next.writingDesk;if(!rootShape(r))return fail('unavailable');
 if(own(r.records,taskId)){
  if(!validWritingRecord(r.records[taskId]))return fail('unavailable');
  if(r.currentId===taskId)return {ok:true,changed:false};
 }else{
  if(Object.keys(r.records).length>=64)return fail('full');
  const source=taskSource(taskId);if(!validWritingSource(source))return fail('selection');
  r.records[taskId]={source,work:initialWork(source),help:{hint:false,example:false,narration:false,together:false},checks:[],count:0};
 }
 r.currentId=taskId;return {ok:true};
 },options);}
export function nextWritingTask(state,options){const at=writingTasks.findIndex(x=>x.id===state?.writingDesk?.currentId);return openWritingTask(state,writingTasks[(at+1)%writingTasks.length].id,options);}
export function setWritingMaterial(state,action,options){return edit(state,r=>{
 const s=r.source,w=r.work;if(!object(action))return fail('material');
 if(s.kind==='sort'){
  if(!s.parts.some(x=>x.id===action.strip)||action.heading!==null&&!s.choices.some(x=>x.id===action.heading))return fail('material');
  if(placed(w,action.strip)===action.heading)return {ok:true,changed:false};
  w.placements[action.strip]=action.heading;
 }else if(s.kind==='order'){
  const at=w.order.indexOf(action.part),to=at+action.direction;
  if(at<0||![-1,1].includes(action.direction)||to<0||to>=w.order.length)return fail('material');
  [w.order[at],w.order[to]]=[w.order[to],w.order[at]];
 }else if(s.kind==='break'){
  if(action.boundary!==null&&!s.parts.slice(1).some(x=>x.id===action.boundary))return fail('material');
  if(w.boundary===action.boundary)return {ok:true,changed:false};w.boundary=action.boundary;
 }else{
  if(action.choice!==null&&!s.choices.some(x=>x.id===action.choice))return fail('material');
  if(w.choice===action.choice)return {ok:true,changed:false};w.choice=action.choice;
 }
 return {ok:true};
 },options);}
export function showWritingHelp(state,kind,options){return edit(state,r=>{
 if(!['hint','example','narration','together'].includes(kind))return fail('selection');
 if(r.help[kind])return {ok:true,changed:false};r.help[kind]=true;return {ok:true};
 },options);}
export function writingResult(s,w){
 if(!validWritingWork(s,w))return null;
 let outcome='different',feedback=[];
 if(s.kind==='sort'){
  const pending=s.parts.filter(x=>!placed(w,x.id));
  outcome=pending.length?'incomplete':s.parts.every(x=>placed(w,x.id)===s.key[x.id])?'fit':'different';
  for(const part of s.parts){const selected=placed(w,part.id);if(selected&&selected!==s.key[part.id])feedback.push(`${part.text} Under ${s.choices.find(x=>x.id===selected).text}; this sentence is about ${s.choices.find(x=>x.id===s.key[part.id]).text}.`);}
 }else if(s.kind==='order')outcome=same(w.order,s.key)?'fit':'different';
 else{const picked=s.kind==='break'?w.boundary:w.choice;outcome=picked===null?'incomplete':picked===s.key?'fit':'different';if(outcome==='different'&&own(s.feedback.different,picked))feedback.push(s.feedback.different[picked]);}
 if(outcome==='fit')feedback.unshift(s.feedback.fit);
 else if(outcome==='incomplete')feedback.unshift('Some parts are still waiting. You can keep this version or keep arranging.');
 else{feedback.push(s.feedback.general);if(s.feedback.general!=='Your draft is still here. You can change it.')feedback.push('Your draft is still here. You can change it.');}
 return {outcome,feedback};
}
export function checkWritingTask(state,options){return edit(state,r=>{
 const result=writingResult(r.source,r.work),c={work:clone(r.work),help:clone(r.help),...result,supported:true,guided:true};
 r.checks.push(c);if(r.checks.length>24)r.checks.splice(1,r.checks.length-24);r.count=Math.min(1000000,r.count+1);return {ok:true,check:clone(c)};
 },options);}
export function keepWritingTask(state,options){return edit(state,r=>{
 if(['firstKept','latestKept'].some(k=>own(r,k)&&!validWritingSnapshot(r.source,r[k])))return fail('kept-unavailable');
 const last=r.checks.at(-1),snapshot={work:clone(r.work),help:clone(r.help),check:last&&sameWritingWork(last.work,r.work)?clone(last):null};
 if(!own(r,'firstKept'))r.firstKept=clone(snapshot);
 r.latestKept={...(r.latestKept?clone(r.latestKept):{}),...snapshot};return {ok:true};
 },options);}
export function sameWritingWork(a,b){
 if(!object(a)||!object(b))return false;
 if(own(a,'placements')||own(b,'placements'))return object(a.placements)&&object(b.placements)&&[...new Set([...Object.keys(a.placements),...Object.keys(b.placements)])].every(k=>placed(a,k)===placed(b,k));
 if(own(a,'order')||own(b,'order'))return Array.isArray(a.order)&&Array.isArray(b.order)&&same(a.order,b.order);
 if(own(a,'boundary')||own(b,'boundary'))return own(a,'boundary')&&own(b,'boundary')&&a.boundary===b.boundary;
 return own(a,'choice')&&own(b,'choice')&&a.choice===b.choice;
}
// No grading in previews: this always describes the exact supplied arrangement, including mistakes.
export function writingPreview(s,w){
 if(!validWritingWork(s,w))return [];
 if(s.kind==='sort')return [...s.choices.map(h=>({heading:h.text,text:s.parts.filter(p=>placed(w,p.id)===h.id).map(p=>p.text).join(' ')})),{heading:'Waiting strips',text:s.parts.filter(p=>!placed(w,p.id)).map(p=>p.text).join(' ')}];
 if(s.kind==='order')return w.order.map(k=>({heading:'',text:s.parts.find(p=>p.id===k).text}));
 if(s.kind==='break'){
  const at=w.boundary===null?-1:s.parts.findIndex(p=>p.id===w.boundary);
  return (at<0?[s.parts]:[s.parts.slice(0,at),s.parts.slice(at)]).map(ps=>({heading:'',text:ps.map(p=>p.text).join(' ')}));
 }
 if(s.after){const opener=s.choices.find(c=>c.id===w.choice)?.text;return [{heading:'First paragraph',text:s.parts.map(p=>p.text).join(' ')},{heading:'Next paragraph',text:opener?`${opener} ${s.after}`:`[Choose an opener] ${s.after}`}];}
 return [{heading:'Supplied text',text:s.parts.map(p=>p.text).join(' ')},{heading:'Your choice',text:s.choices.find(c=>c.id===w.choice)?.text||'No choice yet'}];
}
