import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const defs={
 'steady-orders':{id:'steady-orders',title:'Dot brings 3 ones',request:"Pip's order has 24 seed counters. Dot's order has 13 seed counters. Join both orders. How many individual counters are there altogether?",pip:24,dot:13,total:37},
 'full-frame-orders':{id:'full-frame-orders',title:'Dot brings 7 ones',request:"Pip's order has 24 seed counters. Dot's order has 17 seed counters. Join both orders. How many individual counters are there altogether?",pip:24,dot:17,total:41}
};
export const joiningCases=Object.values(defs);
export const joiningSupport=['picturedSource','joined','handling','help','example','narrationRequested','together','feedback'];
export const joiningBundleSignatures=Object.freeze(['bundle:0:2:4','bundle:0:1:3','bundle:0:1:7','bundle:0:3:7','bundle:0:4:1','bundle:0:3:0']);
const clone=x=>JSON.parse(JSON.stringify(x));
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,expected)=>object(x)&&Object.keys(x).sort().join('|')===expected.slice().sort().join('|');
const same=(a,b)=>a===b||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>same(x,b[i]))||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k]));
const bounded=x=>typeof x==='string'&&x.length>0&&x.length<=300;
const bool=x=>typeof x==='boolean';
const safe=x=>Number.isSafeInteger(x)&&x>0;
const list=(x,p)=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(p);
const known=id=>typeof id==='string'&&Object.hasOwn(defs,id)?defs[id]:null;
export function parseJoiningTotal(raw){if(typeof raw!=='string'||raw.length>24||!/^\s*[0-9]+\s*$/.test(raw))return null;const n=Number(raw.trim());return Number.isSafeInteger(n)&&n>=0&&n<=99?n:null;}
function sourceValid(source){const c=known(source?.id);return !!c&&keys(source,['id','title','request','pip','dot','total'])&&bounded(source.title)&&bounded(source.request)&&source.pip===c.pip&&source.dot===c.dot&&source.total===c.total;}
function modelValid(model,source){
 if(!keys(model,['joined','loosePip','looseDot','framePip','frameDot','newTenPip','newTenDot'])||!bool(model.joined))return false;
 for(const name of ['loosePip','looseDot','framePip','frameDot','newTenPip','newTenDot'])if(!Number.isInteger(model[name])||model[name]<0||model[name]>10)return false;
 if(model.loosePip+model.framePip+model.newTenPip!==4||model.looseDot+model.frameDot+model.newTenDot!==source.dot%10)return false;
 if(model.framePip+model.frameDot>10||![0,10].includes(model.newTenPip+model.newTenDot))return false;
 if(!model.joined&&(model.loosePip!==4||model.looseDot!==source.dot%10||model.framePip||model.frameDot||model.newTenPip||model.newTenDot))return false;
 return true;
}
const supportValid=s=>list(s,x=>joiningSupport.includes(x))&&s.includes('picturedSource');
function snapshotValid(s,w){return object(s)&&sourceValid(s.source)&&s.source.id===w.source.id&&modelValid(s.model,s.source)&&typeof s.raw==='string'&&s.raw.length<=24&&supportValid(s.support)&&s.support.every(x=>w.support.includes(x));}
function validCheck(h,w,unknown){
 if(!keys(h,['id','source','model','raw','support','outcome','feedbackText','joined','regrouped','familiar','checkedPreviously','priorExposureUnknown'])||!safe(h.id)||!snapshotValid(h,w)||!keys(h.outcome,['numberMatches'])||!bool(h.outcome.numberMatches)||!bounded(h.feedbackText)||parseJoiningTotal(h.raw)===null||h.outcome.numberMatches!==(parseJoiningTotal(h.raw)===h.source.total)||h.joined!==h.model.joined||h.regrouped!==(h.model.newTenPip+h.model.newTenDot===10)||!bool(h.familiar)||!bool(h.checkedPreviously)||h.priorExposureUnknown!==unknown)return false;
 return true;
}
function validWork(w,id,unknown){
 if(!keys(w,['source','model','raw','support','helpOpen','exampleOpen','error','feedbackId','history','nextCheckId','kept','familiar'])||w.source?.id!==id||!snapshotValid(w,w)||!bool(w.helpOpen)||!bool(w.exampleOpen)||!bool(w.familiar)||!['needs-number',null].includes(w.error)||w.error==='needs-number'&&parseJoiningTotal(w.raw)!==null||!Array.isArray(w.history)||w.history.length>8||!safe(w.nextCheckId)||w.helpOpen&&!w.support.includes('help')||w.exampleOpen&&!w.support.includes('example'))return false;
 let previous=0;
 for(const h of w.history){if(!validCheck(h,w,unknown)||h.id<=previous||h.id>=w.nextCheckId)return false;previous=h.id;}
 if(w.support.includes('feedback')!==(w.history.length>0))return false;
 if(w.feedbackId!==null){const latest=w.history.at(-1);if(!latest||w.feedbackId!==latest.id||latest.raw!==w.raw)return false;}
 if(w.kept!==null){
  const k=w.kept;
  if(!keys(k,['source','model','raw','support','latestCheck','familiar','priorExposureUnknown'])||!snapshotValid(k,w)||!bool(k.familiar)||k.priorExposureUnknown!==unknown)return false;
  if(k.latestCheck!==null){if(!validCheck(k.latestCheck,w,unknown)||k.latestCheck.id>=w.nextCheckId)return false;const matching=w.history.find(h=>h.id===k.latestCheck.id);if(matching&&!same(matching,k.latestCheck))return false;}
 }
 return true;
}
export function validJoiningOrders(root){
 if(!keys(root,['version','currentCase','cases','shownBundleExamples',...(object(root)&&Object.hasOwn(root,'recovered')?['recovered']:[])])||root.version!==1||!known(root.currentCase)||!object(root.cases)||!Object.hasOwn(root.cases,root.currentCase)||Object.keys(root.cases).length>2||!list(root.shownBundleExamples,s=>joiningBundleSignatures.includes(s)))return false;
 const unknown=Object.hasOwn(root,'recovered');return Object.entries(root.cases).every(([id,w])=>!!known(id)&&validWork(w,id,unknown));
}
export function joiningState(state){return Object.hasOwn(state,'joiningOrders')?validJoiningOrders(state.joiningOrders)?state.joiningOrders:null:undefined;}
export function joiningHistoryUnknown(state){return Object.hasOwn(state,'joiningOrders')&&(joiningState(state)===null||Object.hasOwn(state.joiningOrders,'recovered'));}
// Exact complete bundle examples displayed in either Join picture or its written-ledger turn.
export function noteJoiningExamples(state,signatures){if(!Object.hasOwn(state,'joiningOrders')||!list(signatures,s=>joiningBundleSignatures.includes(s)))return false;const root=joiningState(state);if(!root)return false;let changed=false;for(const signature of signatures)if(!root.shownBundleExamples.includes(signature)){root.shownBundleExamples.push(signature);changed=true;}return changed;}
export function joiningView(state){const root=joiningState(state);if(root===null)return {unsupported:true,raw:state.joiningOrders};if(root===undefined)return {absent:true};const work=root.cases[root.currentCase];return {root,work,source:work.source,model:work.model,feedback:work.history.find(h=>h.id===work.feedbackId)||null,priorExposureUnknown:Object.hasOwn(root,'recovered')};}
function initialModel(source){return {joined:false,loosePip:4,looseDot:source.dot%10,framePip:0,frameDot:0,newTenPip:0,newTenDot:0};}
function newWork(source,familiar=false){return {source:clone(source),model:initialModel(source),raw:'',support:['picturedSource'],helpOpen:false,exampleOpen:false,error:null,feedbackId:null,history:[],nextCheckId:1,kept:null,familiar};}
function change(state,fn){const root=joiningState(state);if(!root||!fn(root,root.cases[root.currentCase]))return false;state.joiningOrders=root;return true;}
const mark=(w,fact)=>{if(!w.support.includes(fact))w.support.push(fact);};
export function startJoiningOrder(state,id){const source=known(id),root=joiningState(state);if(!source||root===null)return false;if(root===undefined){state.joiningOrders={version:1,currentCase:id,cases:{[id]:newWork(source)},shownBundleExamples:[]};return true;}if(root.cases[id])root.cases[id].familiar=true;else root.cases[id]=newWork(source,true);root.currentCase=id;return true;}
export function joinOrders(state){return change(state,(r,w)=>{if(w.model.joined)return false;w.model.joined=true;mark(w,'joined');return true;});}
export function moveJoiningOne(state,origin,toFrame){return change(state,(r,w)=>{if(!w.model.joined||!['pip','dot'].includes(origin)||typeof toFrame!=='boolean')return false;const cap=w.model.framePip+w.model.frameDot;const loose=origin==='pip'?'loosePip':'looseDot',frame=origin==='pip'?'framePip':'frameDot';if(toFrame&&(w.model[loose]===0||cap===10)||!toFrame&&w.model[frame]===0)return false;w.model[loose]+=toFrame?-1:1;w.model[frame]+=toFrame?1:-1;mark(w,'handling');return true;});}
export function wrapJoiningTen(state){return change(state,(r,w)=>{const m=w.model;if(!m.joined||m.framePip+m.frameDot!==10||m.newTenPip+m.newTenDot)return false;m.newTenPip=m.framePip;m.newTenDot=m.frameDot;m.framePip=0;m.frameDot=0;mark(w,'handling');return true;});}
export function unwrapJoiningTen(state){return change(state,(r,w)=>{const m=w.model;if(!m.joined||m.newTenPip+m.newTenDot!==10||m.framePip+m.frameDot!==0)return false;m.framePip=m.newTenPip;m.frameDot=m.newTenDot;m.newTenPip=0;m.newTenDot=0;mark(w,'handling');return true;});}
export function resetJoiningModel(state){return change(state,(r,w)=>{if(!w.model.joined)return false;w.model=initialModel(w.source);return true;});}
export function setJoiningTotal(state,raw){return change(state,(r,w)=>{if(typeof raw!=='string'||raw.length>24)return false;w.raw=raw;w.error=null;w.feedbackId=null;return true;});}
export function checkJoiningTotal(state){return change(state,(r,w)=>{if(!safe(w.nextCheckId)||w.nextCheckId>=Number.MAX_SAFE_INTEGER)return false;const n=parseJoiningTotal(w.raw);if(n===null){w.error='needs-number';return true;}const matched=n===w.source.total,model=clone(w.model),s=w.source;const feedbackText=`Your proposed number ${matched?'matches':'differs from'} the given total: ${s.pip} + ${s.dot} = ${s.total} individual counters.${matched?'':' You can revise or keep it.'}`;const h={id:w.nextCheckId++,source:clone(s),model,raw:w.raw,support:[...w.support],outcome:{numberMatches:matched},feedbackText,joined:model.joined,regrouped:model.newTenPip+model.newTenDot===10,familiar:w.familiar||w.history.length>0||Object.keys(r.cases).length>1,checkedPreviously:w.history.length>0,priorExposureUnknown:Object.hasOwn(r,'recovered')};w.history.push(h);if(w.history.length>8)w.history.shift();w.feedbackId=h.id;w.error=null;mark(w,'feedback');return true;});}
export function keepJoiningDraft(state){return change(state,(r,w)=>{w.kept={source:clone(w.source),model:clone(w.model),raw:w.raw,support:[...w.support],latestCheck:w.history.length?clone(w.history.at(-1)):null,familiar:w.familiar||w.history.length>0||Object.keys(r.cases).length>1,priorExposureUnknown:Object.hasOwn(r,'recovered')};return true;});}
export function useJoiningSupport(state,fact){return change(state,(r,w)=>{if(!['narrationRequested','together'].includes(fact))return false;mark(w,fact);return true;});}
export function openJoiningHelp(state,kind){return change(state,(r,w)=>{if(!['help','example'].includes(kind))return false;if(kind==='help')w.helpOpen=true;else w.exampleOpen=true;mark(w,kind);return true;});}
export function recoverJoiningOrders(state,canExport=()=>true){if(!Object.hasOwn(state,'joiningOrders')||joiningState(state)!==null)return false;const raw=clone(state.joiningOrders),source=defs['steady-orders'];const root={version:1,currentCase:source.id,cases:{[source.id]:newWork(source,true)},shownBundleExamples:[],recovered:raw},candidate={...state,joiningOrders:root};if(!recoveryFitsProgressLimits(candidate)||!canExport(candidate))return false;state.joiningOrders=root;return true;}
