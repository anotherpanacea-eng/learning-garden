import {lanternCases} from './lantern-line-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),clone=structuredClone;
const safe=x=>Number.isSafeInteger(x)&&x>0,id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(x);
const text=(x,max)=>typeof x==='string'&&x.trim()!==''&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&new TextEncoder().encode(x).length<=max;
const same=(a,b)=>a===b||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]))||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>own(b,k)&&same(a[k],b[k]));
const fraction=x=>object(x)&&[1,2,3,4,6,12].includes(x.denominator)&&Number.isInteger(x.numerator)&&x.numerator>=0&&x.numerator<=x.denominator;
const supports=x=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(k=>['help','example','guides','narrationRequested','together','feedback'].includes(k));
export function validLanternSource(s){return object(s)&&s.version===1&&id(s.id)&&text(s.title,160)&&s.wholeId==='lantern-walk-one'&&s.unitTicks===12&&Array.isArray(s.markers)&&s.markers.length===2&&new Set(s.markers.map(m=>m?.id)).size===2&&s.markers.every(m=>fraction(m)&&id(m.id)&&text(m.label,160)&&['circle','triangle'].includes(m.shape))&&object(s.copy)&&['intro','comparison','help'].every(k=>text(s.copy[k],1600))&&Array.isArray(s.copy.exampleSteps)&&s.copy.exampleSteps.length===3&&s.copy.exampleSteps.every(x=>text(x,1600))&&object(s.example)&&fraction(s.example.first)&&fraction(s.example.second)&&new TextEncoder().encode(JSON.stringify(s)).length<=12*1024;}
function validSnapshot(s){return object(s)&&validLanternSource(s.source)&&object(s.indices)&&s.source.markers.every(m=>s.indices[m.id]===null||Number.isInteger(s.indices[m.id])&&s.indices[m.id]>=0&&s.indices[m.id]<=m.denominator)&&[null,'first','same','second'].includes(s.choice)&&(s.guide===null||s.source.markers.some(m=>m.id===s.guide))&&supports(s.support);}
const snapshot=w=>clone({source:w.source,indices:w.indices,choice:w.choice,guide:w.guide,support:w.support});
export function lanternResult(s){
 const placement=s.source.markers.map(m=>s.indices[m.id]===null?null:s.indices[m.id]===m.numerator);
 const [a,b]=s.source.markers,ai=s.indices[a.id],bi=s.indices[b.id];
 const relation=ai===null||bi===null?null:ai*b.denominator===bi*a.denominator?'same':ai*b.denominator>bi*a.denominator?'first':'second';
 return {placement,relation,orderMatches:relation===null||s.choice===null?null:s.choice===relation};
}
function validCheck(c){
 if(!object(c)||!safe(c.id)||!validSnapshot(c.snapshot)||!object(c.result)||!text(c.feedback,3200))return false;
 const r=lanternResult(c.snapshot);return Array.isArray(c.result.placement)&&same(c.result.placement,r.placement)&&c.result.relation===r.relation&&c.result.orderMatches===r.orderMatches;
}
function workView(w,key){
 if(!object(w)||!validSnapshot(w)||w.source.id!==key||!['place','compare','kept'].includes(w.page)||!Array.isArray(w.checks)||!safe(w.nextCheckId)||!(w.feedbackId===null||safe(w.feedbackId)))return null;
 const ids=new Map();for(const c of w.checks)if(safe(c?.id))ids.set(c.id,(ids.get(c.id)||0)+1);
 const readableChecks=w.checks.filter(c=>validCheck(c)&&ids.get(c.id)===1),rawChecks=w.checks.filter(c=>!readableChecks.includes(c));
 const feedback=readableChecks.find(c=>c.id===w.feedbackId&&same(c.snapshot,snapshot(w)));
 const kept=w.kept===null?null:object(w.kept)&&validSnapshot(w.kept.snapshot)&&(w.kept.check===null||validCheck(w.kept.check)&&same(w.kept.snapshot,w.kept.check.snapshot))?w.kept:null;
 return {work:w,readableChecks,rawChecks,feedback,kept,keptUnreadable:w.kept!==null&&!kept};
}
export function lanternView(state){
 if(!own(state,'lanternLine'))return {status:'missing',readable:[],unreadable:[]};
 const root=state.lanternLine;
 if(!object(root)||root.version!==1||!(root.current===null||id(root.current))||!object(root.cases))return {status:'recovery',root,readable:[],unreadable:[]};
 const readable=[],unreadable=[];for(const [key,value] of Object.entries(root.cases)){const v=id(key)&&workView(value,key);(v?readable:unreadable).push(v?{id:key,...v}:{id:key,raw:value});}
 const current=readable.find(v=>v.id===root.current);
 return {status:'ready',root,readable,unreadable,...(current||{})};
}
const fits=(state,root,canExport)=>{const next={...state,lanternLine:root};return recoveryFitsProgressLimits(next)&&canExport(next);};
const freshRoot=()=>({version:1,current:null,cases:{}});
const freshWork=source=>({source:clone(source),page:'place',indices:Object.fromEntries(source.markers.map(m=>[m.id,null])),choice:null,guide:null,support:[],checks:[],nextCheckId:1,feedbackId:null,kept:null});
export function startLantern(state,key,canExport=()=>true){
 const v=lanternView(state);if(v.status==='recovery'||!id(key))return false;
 const root=v.status==='missing'?freshRoot():clone(v.root);
 if(own(root.cases,key)){if(!workView(root.cases[key],key))return false;}
 else{const source=lanternCases.find(s=>s.id===key);if(!source||!validLanternSource(source))return false;root.cases[key]=freshWork(source);}
 root.current=key;if(!fits(state,root,canExport))return false;state.lanternLine=root;return true;
}
export function recoverLantern(state,canExport=()=>true){if(!own(state,'lanternLine'))return false;const root={...freshRoot(),retainedRaw:clone(state.lanternLine)};if(!fits(state,root,canExport))return false;state.lanternLine=root;return true;}
function change(state,mutate,canExport){
 const v=lanternView(state);if(!v.work)return false;const root=clone(v.root),w=root.cases[root.current];if(!mutate(w,v)||!workView(w,root.current)||!fits(state,root,canExport))return false;state.lanternLine=root;return true;
}
export function editLantern(state,kind,key,value,canExport=()=>true){return change(state,w=>{
 if(kind==='page'){if(!['place','compare','kept'].includes(value))return false;w.page=value;return true;}
 const marker=w.source.markers.find(m=>m.id===key);
 if(kind==='zero'){if(!marker)return false;w.indices[key]=0;}
 else if(kind==='move'){if(!marker||![-1,1].includes(value)||w.indices[key]===null)return false;const n=w.indices[key]+value;if(n<0||n>marker.denominator)return false;w.indices[key]=n;}
 else if(kind==='choice'){if(![null,'first','same','second'].includes(value))return false;w.choice=value;}
 else if(kind==='guide'){if(value!==null&&!w.source.markers.some(m=>m.id===value))return false;w.guide=value;if(value!==null&&!w.support.includes('guides'))w.support.push('guides');}
 else return false;
 w.feedbackId=null;return true;
 },canExport);}
export function supportLantern(state,kind,canExport=()=>true){return change(state,w=>{if(!['help','example','narrationRequested','together'].includes(kind))return false;if(!w.support.includes(kind))w.support.push(kind);w.feedbackId=null;return true;},canExport);}
function feedback(s,r){
 const parts=s.source.markers.map((m,i)=>s.indices[m.id]===null?`${m.label} has no position yet. Its requested stop is ${m.numerator}/${m.denominator}.`:`${m.label} is at ${s.indices[m.id]}/${m.denominator}; its requested stop is ${m.numerator}/${m.denominator}. ${r.placement[i]?'That placement fits.':'You can move it or keep this version.'}`);
 if(r.relation===null)parts.push('Place both markers before checking their order. Your choice stays available.');
 else{parts.push(r.relation==='same'?'Both markers are at the same horizontal point.':`${s.source.markers[r.relation==='first'?0:1].label} is farther from Gate 0 on this line.`);parts.push(r.orderMatches===null?'No order choice was made.':r.orderMatches?'Your order choice fits this line.':'Your order choice differs from this line.');}
 parts.push('These are separate checks of requested placements and reading the line you made.');return parts.join(' ');
}
export function checkLantern(state,canExport=()=>true){return change(state,(w,v)=>{
 const occupied=w.checks.reduce((n,c)=>safe(c?.id)?Math.max(n,c.id):n,0),next=Math.max(w.nextCheckId,occupied+1);if(!safe(next)||next>=Number.MAX_SAFE_INTEGER)return false;
 if(!w.support.includes('feedback'))w.support.push('feedback');const s=snapshot(w),result=lanternResult(s),c={id:next,snapshot:s,result,feedback:feedback(s,result)};if(!validCheck(c))return false;
 const kept=v.readableChecks.slice(-3);w.checks=clone(v.work.checks.filter(c=>v.rawChecks.includes(c)||kept.includes(c)));w.checks.push(c);w.nextCheckId=next+1;w.feedbackId=next;return true;
 },canExport);}
export function keepLantern(state,replace=false,canExport=()=>true){return change(state,(w,v)=>{if(v.keptUnreadable||w.kept!==null&&!replace)return false;w.kept={snapshot:snapshot(w),check:v.feedback?clone(v.feedback):null};return true;},canExport);}
