import {pavingCases,pavingCopy} from './garden-paving-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),copy=structuredClone;
const bytes=x=>new TextEncoder().encode(x).length,safe=x=>Number.isSafeInteger(x)&&x>0,id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(x);
const text=(x,n)=>typeof x==='string'&&x.trim()!==''&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&bytes(x)<=n;
const size=x=>Number.isInteger(x)&&x>=1&&x<=11;
const codes=['help','example','narrationRequested','together','feedback'],supports=x=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(k=>codes.includes(k));
export const samePaving=(a,b)=>a===b||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>samePaving(x,b[i]))||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>own(b,k)&&samePaving(a[k],b[k]));
const tokens=['n','next','oldCount','rowCount','columnCount','cornerCount','addedNow','totalNow','addedNeeded','targetTotal'];
const line=x=>text(x,800)&&[...x.matchAll(/\{([^{}]+)\}/g)].every(m=>tokens.includes(m[1]));
export function validPavingSource(s){return object(s)&&s.version===1&&s.model==='square-growth-v1'&&id(s.id)&&text(s.title,160)&&size(s.n)&&text(s.request,800)&&object(s.copy)&&Object.keys(pavingCopy).every(k=>line(s.copy[k]))&&object(s.example)&&size(s.example.n)&&samePaving(s.example.masks,[0,3,7])&&Array.isArray(s.example.captions)&&s.example.captions.length===3&&s.example.captions.every(x=>text(x,800))&&bytes(JSON.stringify(s))<=24*1024;}
export function pavingCounts(s){const n=s.source.n,p=s.patches;return {n,next:n+1,oldCount:n*n,rowCount:p.row?n:0,columnCount:p.column?n:0,cornerCount:p.corner?1:0,addedNow:n*Number(p.row)+n*Number(p.column)+Number(p.corner),totalNow:n*n+n*Number(p.row)+n*Number(p.column)+Number(p.corner),addedNeeded:2*n+1,targetTotal:(n+1)**2};}
export function pavingText(template,s){const values=pavingCounts(s);return template.replace(/\{(n|next|oldCount|rowCount|columnCount|cornerCount|addedNow|totalNow|addedNeeded|targetTotal)\}/g,(_,k)=>String(values[k]));}
export function parsePaving(input){const s=input.trim();return s===''?{kind:'blank',value:null}:!/^[0-9]+$/.test(s)||Number(s)>144?{kind:'invalid',value:null}:{kind:'number',value:Number(s)};}
const validDraft=x=>typeof x==='string'&&bytes(x)<=8&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
const patches=x=>object(x)&&['row','column','corner'].every(k=>typeof x[k]==='boolean');
const validSnapshot=s=>object(s)&&validPavingSource(s.source)&&patches(s.patches)&&validDraft(s.addedInput)&&validDraft(s.totalInput)&&['input','unsure'].includes(s.addedMode)&&['input','unsure'].includes(s.totalMode)&&supports(s.support);
export const pavingSnapshot=w=>copy({source:w.source,patches:w.patches,addedInput:w.addedInput,totalInput:w.totalInput,addedMode:w.addedMode,totalMode:w.totalMode,support:w.support});
export function pavingResult(s){const a=s.addedMode==='unsure'?{kind:'unsure'}:parsePaving(s.addedInput),t=s.totalMode==='unsure'?{kind:'unsure'}:parsePaving(s.totalInput),c=pavingCounts(s);if(a.kind==='invalid'||t.kind==='invalid')return null;return {addedFit:a.kind==='number'?a.value===c.addedNeeded:null,totalFit:t.kind==='number'?t.value===c.targetTotal:null,modelComplete:s.patches.row&&s.patches.column&&s.patches.corner,addedNow:c.addedNow,totalNow:c.totalNow};}
export function pavingFeedback(s,r=pavingResult(s)){if(!r)return null;const c=s.source.copy,k=x=>x===null?'Blank':x?'Fits':'Different';return [c['added'+k(r.addedFit)],c['total'+k(r.totalFit)],c[r.modelComplete?'modelComplete':'modelIncomplete'],pavingText(c.counts,s),c.ending].join(' ');}
function validCheck(c){if(!object(c)||!safe(c.id)||!validSnapshot(c.snapshot)||!object(c.result)||!text(c.feedback,4096)||c.practiceOnly!==true||c.priorExposureUnknown!==true)return false;const r=pavingResult(c.snapshot);return r!==null&&Object.keys(r).every(k=>c.result[k]===r[k])&&c.feedback===pavingFeedback(c.snapshot,r);}
function workView(w,key){
 if(!object(w)||!validSnapshot(w)||w.source.id!==key||!['learn','build','kept'].includes(w.page)||!Array.isArray(w.checks)||!safe(w.nextCheckId)||!(w.feedbackId===null||safe(w.feedbackId)))return null;
 const ids=new Map();for(const c of w.checks)if(safe(c?.id))ids.set(c.id,(ids.get(c.id)||0)+1);
 const readableChecks=w.checks.filter(c=>validCheck(c)&&ids.get(c.id)===1),rawChecks=w.checks.filter(c=>!readableChecks.includes(c)),feedback=readableChecks.find(c=>c.id===w.feedbackId&&samePaving(c.snapshot,pavingSnapshot(w)));
 const kept=w.kept===null?null:object(w.kept)&&validSnapshot(w.kept.snapshot)&&(w.kept.check===null||validCheck(w.kept.check)&&samePaving(w.kept.snapshot,w.kept.check.snapshot))?w.kept:null;
 return {work:w,readableChecks,rawChecks,feedback,kept,keptUnreadable:w.kept!==null&&!kept};
}
export function pavingView(state){if(!own(state,'gardenPaving'))return {status:'missing',readable:[],unreadable:[]};const root=state.gardenPaving;if(!object(root)||root.version!==1||!(root.current===null||id(root.current))||!object(root.cases))return {status:'recovery',root,readable:[],unreadable:[]};const readable=[],unreadable=[];for(const [key,w]of Object.entries(root.cases)){const v=id(key)&&workView(w,key);(v?readable:unreadable).push(v?{id:key,...v}:{id:key,raw:w});}return {status:'ready',root,readable,unreadable,...(readable.find(x=>x.id===root.current)||{})};}
export const pavingMask=p=>Number(p.row)+2*Number(p.column)+4*Number(p.corner);
export const maskPatches=m=>({row:!!(m&1),column:!!(m&2),corner:!!(m&4)});
function picturePairs(s){const n=s.source.n,p=s.patches;return [[n,n],...(p.row?[[n+1,n]]:[]),...(p.column?[[n,n+1]]:[]),...(p.row&&p.column&&p.corner?[[n+1,n+1]]:[])];}
const checkPairs=c=>[...picturePairs(c.snapshot),[c.snapshot.source.n+1,c.snapshot.source.n+1]];
export function pavingDisplayPairs(state,display={kind:'current',step:0}){
 const v=pavingView(state);if(v.status!=='ready')return [];let pairs=[];
 const history=c=>{for(const r of c.readableChecks.slice(-4))pairs.push(...checkPairs(r));};
 const kept=c=>{if(c.kept){pairs.push(...picturePairs(c.kept.snapshot));if(c.kept.check)pairs.push(...checkPairs(c.kept.check));}};
 if(display.kind==='notes')for(const c of v.readable){pairs.push(...picturePairs(c.work));history(c);kept(c);}
 else if(v.work){
  const w=v.work;
  if(display.kind==='history')history(v);
  else if(display.kind==='current'&&w.page==='kept')kept(v);
  else if(display.kind==='example'||display.kind==='current'&&w.page==='learn'){const step=display.kind==='example'?display.step:0;if(!Number.isInteger(step)||step<0||step>2)return [];pairs.push(...picturePairs({source:{n:w.source.example.n},patches:maskPatches(w.source.example.masks[step])}));}
  else {pairs.push(...picturePairs(w));if(v.feedback)pairs.push(...checkPairs(v.feedback));}
 }
 return pairs.filter((p,i)=>pairs.findIndex(q=>p[0]===q[0]&&p[1]===q[1])===i);
}
const fresh=()=>({version:1,current:null,cases:{}});
function prepared(state,root,options={}){try{const candidate=copy(state);candidate.gardenPaving=root;if(!recoveryFitsProgressLimits(candidate))return null;const pairs=pavingDisplayPairs(candidate,options.display);if(pairs.length)options.exposeFacts?.(pairs,candidate);return recoveryFitsProgressLimits(candidate)&&(options.canExport?.(candidate)??true)===true?candidate:null;}catch{return null;}}
function install(state,candidate){for(const [key,value]of Object.entries(candidate))if(!samePaving(state[key],value))state[key]=value;}
export function preflightPavingDisplay(state,options={}){if(!own(state,'gardenPaving'))return true;const candidate=prepared(state,copy(state.gardenPaving),options);if(!candidate)return false;install(state,candidate);return true;}
export function startPaving(state,key,options={}){const v=pavingView(state);if(v.status==='recovery'||!id(key))return false;const root=v.status==='missing'?fresh():copy(v.root);if(own(root.cases,key)){if(!workView(root.cases[key],key))return false;}else{const source=pavingCases.find(s=>s.id===key);if(!source||!validPavingSource(source))return false;root.cases[key]={source:copy(source),page:'learn',patches:maskPatches(0),addedInput:'',totalInput:'',addedMode:'input',totalMode:'input',support:[],checks:[],nextCheckId:1,feedbackId:null,kept:null};}root.current=key;const candidate=prepared(state,root,options);if(!candidate)return false;install(state,candidate);return true;}
function change(state,fn,options){const v=pavingView(state);if(!v.work)return false;const root=copy(v.root),w=root.cases[root.current];if(fn(w,v)===false||!workView(w,root.current))return false;const candidate=prepared(state,root,options);if(!candidate)return false;install(state,candidate);return true;}
export function editPaving(state,kind,value,options={}){return change(state,w=>{if(kind==='page'){if(!['learn','build','kept'].includes(value))return false;w.page=value;return true;}if(kind==='patch'){if(!['row','column','corner'].includes(value))return false;w.patches[value]=!w.patches[value];}else if(kind==='addedInput'||kind==='totalInput'){if(!validDraft(value))return false;w[kind]=value;w[kind==='addedInput'?'addedMode':'totalMode']='input';}else if(kind==='addedMode'||kind==='totalMode'){if(!['input','unsure'].includes(value))return false;w[kind]=value;}else return false;w.feedbackId=null;},options);}
export function supportPaving(state,kind,options={}){return change(state,w=>{const requested=Array.isArray(kind)?kind:[kind];if(!requested.length||requested.some(k=>!codes.includes(k)||k==='feedback'))return false;for(const k of requested)if(!w.support.includes(k)){w.support.push(k);w.feedbackId=null;}},options);}
export function checkPaving(state,options={}){return change(state,(w,v)=>{if(!pavingResult(w))return false;const occupied=w.checks.reduce((n,c)=>safe(c?.id)?Math.max(n,c.id):n,0),next=Math.max(w.nextCheckId,occupied+1);if(!safe(next)||next>=Number.MAX_SAFE_INTEGER)return false;if(!w.support.includes('feedback'))w.support.push('feedback');const snapshot=pavingSnapshot(w),r={id:next,snapshot,result:pavingResult(snapshot),feedback:pavingFeedback(snapshot),practiceOnly:true,priorExposureUnknown:true};if(!validCheck(r))return false;const recent=v.readableChecks.slice(-3);w.checks=copy(v.work.checks.filter(c=>v.rawChecks.includes(c)||recent.includes(c)));w.checks.push(r);w.nextCheckId=next+1;w.feedbackId=next;},options);}
export function keepPaving(state,replace=false,options={}){return change(state,(w,v)=>{if(v.keptUnreadable||w.kept!==null&&!replace)return false;w.kept={snapshot:pavingSnapshot(w),check:v.feedback?copy(v.feedback):null};},options);}
export function recoverPaving(state,options={}){if(!own(state,'gardenPaving'))return false;const root={...fresh(),retainedRaw:copy(state.gardenPaving)},candidate=prepared(state,root,options);if(!candidate)return false;install(state,candidate);return true;}
