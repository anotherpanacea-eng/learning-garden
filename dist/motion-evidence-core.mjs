import {motionCase} from './motion-evidence-adaptive.mjs';
import {motionLessons} from './motion-evidence-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),str=(x,n=6000)=>typeof x==='string'&&x.length<=n;
const id=x=>str(x,80)&&/^[a-z][a-z0-9-]*$/.test(x)&&!['constructor','prototype','tostring','valueof'].includes(x);
const clone=x=>structuredClone(x),ints=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const textKeys=['title','intro','teach','meaning','teachMeaning'];
const choice=c=>obj(c)&&id(c.id)&&str(c.text)&&str(c.meaning)&&['match','different'].includes(c.outcome)&&str(c.feedback);
const item=q=>obj(q)&&id(q.id)&&['prompt','meaning','guided','hint','example','guidedMeaning','hintMeaning','exampleMeaning'].every(k=>str(q[k]))&&Array.isArray(q.choices)&&q.choices.length>=2&&q.choices.length<=6&&q.choices.every(choice)&&new Set(q.choices.map(c=>c.id)).size===q.choices.length;
function source(s){return obj(s)&&id(s.id)&&textKeys.every(k=>str(s[k]))&&Array.isArray(s.items)&&s.items.length>0&&s.items.length<=12&&s.items.every(item)&&new Set(s.items.map(q=>q.id)).size===s.items.length&&(s.data===undefined||Array.isArray(s.data)&&s.data.length<=8&&s.data.every(d=>obj(d)&&id(d.id)&&str(d.name,100)&&['shape','time','cost','depth','average'].every(k=>Number.isFinite(d[k])&&d[k]>=0)))&&(s.collisionModel===undefined||obj(s.collisionModel)&&Number.isFinite(s.collisionModel.mass)&&s.collisionModel.mass>0&&Number.isFinite(s.collisionModel.startVelocity)&&Number.isFinite(s.collisionModel.endVelocity))&&(s.newMessage===undefined||str(s.newMessage))&&(s.writing===undefined||str(s.writing));}
const help=h=>Array.isArray(h)&&h.length<=160&&new Set(h).size===h.length&&h.every(x=>str(x,100));
const rawDrafts=(d,s)=>obj(d)&&Object.keys(d).length<=14&&Object.entries(d).every(([k,v])=>['explanation','revision',...s.items.map(q=>q.id)].includes(k)&&str(v,['explanation','revision'].includes(k)?1200:80))&&str(d.explanation,1200)&&str(d.revision,1200);
function check(c,s){const q=s.items.find(q=>q.id===c?.itemId),a=q?.choices.find(a=>a.id===c?.raw);return obj(c)&&!!a&&c.outcome===a.outcome&&str(c.feedback)&&help(c.helpSeenBefore)&&c.supported===true;}
function snapshot(w){return obj(w)&&source(w.source)&&rawDrafts(w.drafts,w.source)&&help(w.help)&&Array.isArray(w.checks)&&w.checks.length<=24&&w.checks.every(c=>check(c,w.source))&&Array.isArray(w.skips)&&w.skips.length<=12&&new Set(w.skips).size===w.skips.length&&w.skips.every(id=>w.source.items.some(q=>q.id===id))&&typeof w.newData==='boolean'&&obj(w.model)&&[w.model.left,w.model.right].every(n=>ints(n,0,8)&&n%2===0);}
export function validMotionWork(w){return snapshot(w)&&(w.firstKept===undefined||snapshot(w.firstKept))&&(w.kept===undefined||snapshot(w.kept));}
function wrapper(s){return obj(s?.motionEvidence)&&s.motionEvidence.version===1&&obj(s.motionEvidence.lessons)&&str(s.motionEvidence.currentId,80);}
export function motionView(state){
 if(!Object.hasOwn(state,'motionEvidence'))return {status:'missing',work:null,lessons:motionLessons.map(s=>({id:s.id,title:s.title}))};
 if(!wrapper(state))return {status:'unavailable',work:null,lessons:[]};
 const r=state.motionEvidence,lessons=motionLessons.map(s=>({id:s.id,title:s.title,unreadable:Object.hasOwn(r.lessons,s.id)&&!validMotionWork(r.lessons[s.id])}));
 for(const [key,w] of Object.entries(r.lessons))if(id(key)&&!motionLessons.some(s=>s.id===key)&&validMotionWork(w))lessons.push({id:key,title:`Saved lesson: ${w.source.title}`});
 const w=Object.hasOwn(r.lessons,r.currentId)?r.lessons[r.currentId]:null;
 return {status:'ready',work:validMotionWork(w)?w:null,lessons};
}
function change(state,fn,o={}){try{if(Object.hasOwn(state,'motionEvidence')&&!wrapper(state))return false;const next=clone(state),r=fn(next);if(!r||!wrapper(next)||!recoveryFitsProgressLimits(next)||typeof o.canExport!=='function'||o.canExport(next)!==true)return false;state.motionEvidence=next.motionEvidence;return r;}catch{return false;}}
function workChange(s,fn,o){return change(s,next=>{const w=motionView(next).work;return w?fn(w):false;},o);}
export function startMotion(s,key,o={}){if(!id(key))return false;return change(s,next=>{next.motionEvidence??={version:1,currentId:'',lessons:{}};const r=next.motionEvidence;if(Object.hasOwn(r.lessons,key)){if(!validMotionWork(r.lessons[key]))return false;}else{const src=motionLessons.find(x=>x.id===key);if(!src)return false;r.lessons[key]={source:clone(src),drafts:{explanation:'',revision:''},help:['lesson:teach'],checks:[],skips:[],model:{left:2,right:6},newData:false};}r.currentId=key;return true;},o);}
export function setMotionField(s,key,value,o={}){if(!str(value,['explanation','revision'].includes(key)?1200:80))return false;return workChange(s,w=>{const q=w.source.items.find(q=>q.id===key);if(!['explanation','revision'].includes(key)&&(!q||!q.choices.some(c=>c.id===value)))return false;w.drafts[key]=value;return true;},o);}
export function showMotionHelp(s,code,o={}){if(!str(code,100)||!code)return false;return workChange(s,w=>{if(w.help.includes(code))return true;if(w.help.length>=160)return false;w.help.push(code);return true;},o);}
export function checkMotion(s,key,o={}){return workChange(s,w=>{const q=w.source.items.find(q=>q.id===key),a=q?.choices.find(c=>c.id===w.drafts[key]);if(!a||q===w.source.items[1]&&w.source.newMessage&&!w.newData)return false;const order=Object.entries(s.motionEvidence.lessons).reduce((max,[id,w])=>!ownedVisit(id,w)||!validMotionWork(w)?max:w.checks.reduce((n,c)=>ints(c.order,1,999999999)?Math.max(n,c.order):n,max),0)+1;if(order>999999999)return false;const record={order,skippedBefore:w.skips.includes(key),itemId:key,raw:a.id,outcome:a.outcome,feedback:a.feedback,helpSeenBefore:clone(w.help),supported:true};if(w.checks.length>=24)return false;w.checks.push(record);return {recorded:true,...record};},o);}
export function skipMotion(s,key,o={}){return workChange(s,w=>{if(!w.source.items.some(q=>q.id===key))return false;if(!w.skips.includes(key))w.skips.push(key);return true;},o);}
export const revealMotionData=(s,o={})=>workChange(s,w=>{if(!w.source.newMessage)return false;w.firstKept??=clone({source:w.source,drafts:w.drafts,help:w.help,checks:w.checks,skips:w.skips,model:w.model,newData:w.newData});w.newData=true;return true;},o);
export const keepMotion=(s,o={})=>workChange(s,w=>{const k=clone({source:w.source,drafts:w.drafts,help:w.help,checks:w.checks,skips:w.skips,model:w.model,newData:w.newData});w.firstKept??=clone(k);w.kept=k;return true;},o);
export function setMotionModel(s,key,n,o={}){if(!['left','right'].includes(key)||!ints(n,0,8)||n%2)return false;return workChange(s,w=>{w.model[key]=n;return true;},o);}

// Adaptive selection is optional: corrupt metadata never hides otherwise readable saved work.
const adaptiveKinds=['forces', 'evidence', 'design'];
const generatedKey=/^investigation-(forces|evidence|design)-([1-9][0-9]{0,5})$/;
const adaptiveMeta=a=>obj(a)&&a.version===1&&adaptiveKinds.includes(a.kind)&&ints(a.serial,1,999999)&&id(a.caseId)&&a.concept===a.kind&&(a.reason===undefined||str(a.reason))&&(a.revisit===undefined||typeof a.revisit==='boolean');
const ownedVisit=(key,w)=>{const m=key.match(generatedKey),a=w?.source?.adaptive;return !!m&&adaptiveMeta(a)&&w.source.id===key&&m[1]===a.kind&&Number(m[2])===a.serial;};
function adaptiveReady(s){if(Object.hasOwn(s,'motionEvidence')&&!wrapper(s))return false;const r=s.motionEvidence;if(!r)return true;if(Object.hasOwn(r,'exploration')&&!(obj(r.exploration)&&r.exploration.version===1&&obj(r.exploration.next)&&adaptiveKinds.every(k=>ints(r.exploration.next[k],1,999999))))return false;return Object.values(r.lessons).every(w=>!obj(w?.source)||!Object.hasOwn(w.source,'adaptive')||adaptiveMeta(w.source.adaptive));}
export function motionExploration(s){
 const ready=adaptiveReady(s),r=s.motionEvidence,candidates=[],visits=[];
 if(wrapper(s))for(const [key,w] of Object.entries(r.lessons)){
  if(!validMotionWork(w)||!ownedVisit(key,w))continue;const a=w.source.adaptive;
  visits.push({id:key,title:w.source.title,checks:w.checks.length,drafts:[w.drafts.explanation,w.drafts.revision].filter(Boolean).length,kept:Number(!!w.firstKept)+Number(!!w.kept)});
  const checked=new Set();for(const c of w.checks){if(checked.has(c.itemId))continue;checked.add(c.itemId);if(!ints(c.order,1,999999999))continue;candidates.push({tag:`${a.caseId}:${c.itemId}`,order:c.order,skipped:c.skippedBefore===true,kind:a.kind,outcome:c.outcome,help:c.helpSeenBefore.some(h=>h!=='lesson:teach')});}
 }
 const observations=[],seen=new Set();for(const c of candidates.sort((a,b)=>a.order-b.order)){if(seen.has(c.tag))continue;seen.add(c.tag);if(!c.skipped)observations.push(c);}
 const recent=observations.slice(-6),affected=recent.filter(x=>x.outcome!=='match'||x.help).at(-1);let kind=adaptiveKinds[0],reason='Try one supplied case to see which comparison is useful next.';
 if(affected){kind=affected.kind;reason='A recent first response in this family needed comparison or requested support. Revisit this concept with the optional steps.';}else if(recent.length>=3&&recent.every(x=>x.outcome==='match'&&!x.help)){kind=adaptiveKinds[(adaptiveKinds.indexOf(recent.at(-1).kind)+1)%adaptiveKinds.length];reason=`${recent.length} distinct first item checks fit without optional help; try a nearby concept contrast.`;}
 return {ready,kind,reason,count:recent.length,visits,qualification:'Supplied teaching remains support. This is local practice evidence, not mastery or independent attainment. Repeated catalog cases are revisits.'};
}
export function createMotionInvestigation(s,kind,o={}){if(!adaptiveKinds.includes(kind)||!adaptiveReady(s))return false;return change(s,next=>{next.motionEvidence??={version:1,currentId:'',lessons:{}};const r=next.motionEvidence;let serial=r.exploration?.next?.[kind]??1;for(const key of Object.keys(r.lessons)){const m=key.match(generatedKey);if(m&&m[1]===kind)serial=Math.max(serial,Number(m[2])+1);}if(serial>999998)return false;const src=motionCase(kind,serial);if(!src||Object.hasOwn(r.lessons,src.id))return false;const repeats=Object.values(r.lessons).some(w=>w?.source?.adaptive?.caseId===src.adaptive.caseId);src.adaptive.revisit=serial>6||repeats;src.adaptive.reason=motionExploration(next).reason;r.lessons[src.id]={source:clone(src),drafts:{explanation:'',revision:''},help:['lesson:teach'],checks:[],skips:[],model:{left:2,right:6},newData:false};r.exploration??={version:1,next:Object.fromEntries(adaptiveKinds.map(k=>[k,1]))};r.exploration.next[kind]=serial+1;r.currentId=src.id;return src.id;},o);}
export function removeMotionInvestigation(s,key,confirmed,o={}){if(confirmed!==true||!id(key)||!adaptiveReady(s))return false;return change(s,next=>{const r=next.motionEvidence,w=r?.lessons?.[key],a=w?.source?.adaptive;if(!validMotionWork(w)||!ownedVisit(key,w))return false;delete r.lessons[key];if(r.currentId===key)r.currentId='';return true;},o);}
