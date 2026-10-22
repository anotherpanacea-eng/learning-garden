import {sortingSource} from './sorting-desk-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const copy=structuredClone,object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k);
const safe=n=>Number.isSafeInteger(n)&&n>0;
const validText=(x,max=500)=>typeof x==='string'&&x.trim().length>0&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&new TextEncoder().encode(x).length<=max;
const validId=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(x);
const conditions=['stamp-star','stamp-circle','wrap-blue','wrap-yellow'];
const sourceBytes=s=>{try{return new TextEncoder().encode(JSON.stringify(s)).length;}catch{return Infinity;}};
const labels=s=>new Map(s.baskets.map(b=>[b.id,b.label]));
const parcelOf=(s,id)=>s.parcels.find(p=>p.id===id);
const complete=p=>object(p)&&conditions.includes(p.condition)&&validId(p.then)&&validId(p.else);
function validProgram(p,s){return object(p)&&[null,...conditions].includes(p.condition)&&[null,...s.baskets.map(b=>b.id)].includes(p.then)&&[null,...s.baskets.map(b=>b.id)].includes(p.else);}
export function validSortingSource(s){
 if(!object(s)||s.version!==1||!validId(s.id)||!validText(s.request)||!Array.isArray(s.baskets)||s.baskets.length!==2||!s.baskets.every(b=>object(b)&&validId(b.id)&&validText(b.label))||new Set(s.baskets.map(b=>b.id)).size!==2||!Array.isArray(s.parcels)||s.parcels.length<1||s.parcels.length>8||!s.parcels.every(p=>object(p)&&validId(p.id)&&validText(p.title)&&['star','circle'].includes(p.stamp)&&['blue','yellow'].includes(p.wrap))||new Set(s.parcels.map(p=>p.id)).size!==s.parcels.length)return false;
 if(!object(s.requestRule)||!complete(s.requestRule)||!validProgram(s.requestRule,s)||!object(s.text)||!['intro','help','predictionPrompt','otherBranch','fit','mismatch','counterexample'].every(k=>validText(s.text[k])))return false;
 return sourceBytes(s)<=12*1024;
}
const validSupport=x=>object(x)&&typeof x.helpOpened==='boolean'&&typeof x.together==='boolean'&&typeof x.narrationRequested==='boolean';
const feature=c=>c.startsWith('stamp-')?'stamp':'wrap';
const value=c=>c.slice(c.indexOf('-')+1);
export function sortingOutcome(source,program,parcelId){
 if(!validSortingSource(source)||!validProgram(program,source)||!complete(program))return null;
 const parcel=parcelOf(source,parcelId);if(!parcel)return null;
 const input=feature(program.condition),observed=parcel[input],yes=observed===value(program.condition),branch=yes?'then':'else',actual=program[branch];
 const requestYes=parcel[feature(source.requestRule.condition)]===value(source.requestRule.condition),requested=source.requestRule[requestYes?'then':'else'];
 return {input,observed,yes,branch,actual,requested,matches:actual===requested};
}
function validCheck(c,s){
 if(!object(c)||!safe(c.id)||!validId(c.parcelId)||!validProgram(c.program,s)||!complete(c.program)||![null,'unsure',...s.baskets.map(b=>b.id)].includes(c.prediction)||!validSupport(c.support)||c.practiceOnly!==true)return false;
 const expected=sortingOutcome(s,c.program,c.parcelId);return !!expected&&['input','observed','yes','branch','actual','requested','matches'].every(k=>c[k]===expected[k]);
}
function checksView(r){
 const readable=[],unreadable=[];let previous=0;
 for(const [index,check] of r.checks.entries()){
  if(validCheck(check,r.source)&&check.id>previous&&check.id<r.nextCheck){readable.push({index,check});previous=check.id;}
  else unreadable.push({index,check});
 }
 return {readable,unreadable};
}
function validRoot(r){return object(r)&&r.version===1&&validSortingSource(r.source)&&validProgram(r.program,r.source)&&validId(r.selectedParcel)&&!!parcelOf(r.source,r.selectedParcel)&&[null,'unsure',...r.source.baskets.map(b=>b.id)].includes(r.prediction)&&['ready','condition','result'].includes(r.phase)&&(r.phase==='ready'||complete(r.program))&&Array.isArray(r.checks)&&safe(r.nextCheck)&&validSupport(r.support)&&own(r,'kept');}
export function sortingView(state){
 if(!own(state,'sortingDesk'))return {status:'missing',root:null,readable:[],unreadable:[],kept:null};
 const root=state.sortingDesk;if(!validRoot(root))return {status:'recovery',root,readable:[],unreadable:[],kept:null};
 const {readable,unreadable}=checksView(root);if(readable.length>12)return {status:'recovery',root,readable:[],unreadable:[],kept:null};
 const kept=root.kept===null?null:object(root.kept)&&validSortingSource(root.kept.source)&&validCheck(root.kept.check,root.kept.source)?root.kept:null;
 const latest=readable.at(-1)?.check||null;
 const sameProgram=latest?.program.condition===root.program.condition&&latest?.program.then===root.program.then&&latest?.program.else===root.program.else;
 const resultAvailable=root.phase==='result'&&readable.at(-1)?.index===root.checks.length-1&&latest?.parcelId===root.selectedParcel&&sameProgram;
 return {status:'ready',root,readable,unreadable,kept,keptUnreadable:root.kept!==null&&!kept,resultAvailable,latest};
}
const fresh=()=>({version:1,source:copy(sortingSource),program:{condition:null,then:null,else:null},selectedParcel:sortingSource.parcels[0].id,prediction:null,phase:'ready',checks:[],nextCheck:1,support:{helpOpened:false,together:false,narrationRequested:false},kept:null});
const fits=(state,root,canExport)=>{const candidate={...state,sortingDesk:root};return recoveryFitsProgressLimits(candidate)&&canExport(candidate);};
export function startSorting(state,canExport=()=>true,replace=false){
 const view=sortingView(state);if(view.status!=='missing'&&!replace)return false;
 const root=fresh();if(view.status!=='missing')root.retainedRaw=copy(state.sortingDesk);
 if(!validSortingSource(root.source)||!fits(state,root,canExport))return false;
 state.sortingDesk=root;return true;
}
function change(state,mutate){const v=sortingView(state);if(v.status!=='ready')return false;const root=copy(v.root);if(mutate(root)===false)return false;state.sortingDesk=root;return true;}
export function setSortingProgram(state,part,choice){return change(state,r=>{if(!['condition','then','else'].includes(part)||!validProgram({...r.program,[part]:choice},r.source))return false;r.program[part]=choice;r.phase='ready';r.prediction=null;});}
export function chooseSortingParcel(state,id){return change(state,r=>{if(!parcelOf(r.source,id))return false;r.selectedParcel=id;r.phase='ready';r.prediction=null;});}
export function setSortingPrediction(state,prediction){return change(state,r=>{if(r.phase!=='ready'||!complete(r.program)||![null,'unsure',...r.source.baskets.map(b=>b.id)].includes(prediction))return false;r.prediction=prediction;});}
export function restartSortingTrace(state){return change(state,r=>{r.phase='ready';r.prediction=null;});}
export function supportSorting(state,kind){return change(state,r=>{if(!['helpOpened','together','narrationRequested'].includes(kind))return false;r.support[kind]=true;});}
export function stepSorting(state,canExport=()=>true){
 const v=sortingView(state);if(v.status!=='ready'||!complete(v.root.program))return false;
 const root=copy(v.root);
 if(root.phase==='ready'){root.phase='condition';state.sortingDesk=root;return true;}
 if(root.phase!=='condition'||root.nextCheck>=Number.MAX_SAFE_INTEGER)return false;
 const outcome=sortingOutcome(root.source,root.program,root.selectedParcel);if(!outcome)return false;
 const check={id:root.nextCheck,parcelId:root.selectedParcel,program:copy(root.program),prediction:root.prediction,...outcome,support:copy(root.support),practiceOnly:true};
 if(!validCheck(check,root.source))return false;
 if(v.readable.length>=12)root.checks.splice(v.readable[0].index,1);
 root.checks.push(check);root.nextCheck++;root.phase='result';
 if(!fits(state,root,canExport))return false;
 state.sortingDesk=root;return true;
}
export function keepSortingRun(state,canExport=()=>true){
 const v=sortingView(state);if(v.status!=='ready'||v.root.phase!=='result'||!v.resultAvailable||v.keptUnreadable)return false;
 const root=copy(v.root);root.kept={source:copy(root.source),check:copy(v.latest)};
 if(!fits(state,root,canExport))return false;state.sortingDesk=root;return true;
}
export const sortingBasketLabel=(source,id)=>labels(source).get(id)||'basket';
