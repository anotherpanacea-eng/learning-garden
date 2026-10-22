import {returnIds,returningCase,returnTextKeys} from './returning-orders-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const copy=x=>structuredClone(x);
const integer=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
const list=(x,p)=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(p);
const bytes=x=>new TextEncoder().encode(x).length;
export const returnSupport=Object.freeze(['picturedSource','handling','help','example','narrationRequested','together','feedback']);
export const knownReturningSignatures=Object.freeze([...Array.from({length:8},(_,i)=>`bundle:0:1:${i}`),...([42,41,40,39,38,37,36,35,32,31,30,29,28,27,26,25].map(n=>`bundle:0:${Math.floor(n/10)}:${n%10}`))]);
export const startReturningModel=()=>({tableTens:4,tableOnes:2,returnedTens:0,returnedOnes:0,openTen:0});
export const returnedTotal=m=>10*m.returnedTens+m.returnedOnes;
export const tableTotal=m=>10*m.tableTens+m.tableOnes;
export const returningComplete=(source,m)=>m.returnedTens===source.returnedTens&&m.returnedOnes===source.returnedOnes;
export function parseReturningNumber(raw){if(typeof raw!=='string'||raw.length>24||!/^\s*[0-9]+\s*$/.test(raw))return null;const n=Number(raw.trim());return integer(n,0,99)?n:null;}
export function validReturningSource(s){
 if(!object(s)||s.version!==1||!returnIds.includes(s.id)||!object(s.text))return false;
 const c=returningCase(s.id);
 if(s.start!==c.start||s.target!==c.target||s.returnedTens!==1||s.returnedOnes!==c.returnedOnes)return false;
 if(Object.keys(s.text).length!==returnTextKeys.length||!returnTextKeys.every(k=>Object.hasOwn(s.text,k)&&typeof s.text[k]==='string'&&s.text[k].trim()!==''&&bytes(s.text[k])<=512))return false;
 try{return bytes(JSON.stringify(s))<=16384;}catch{return false;}
}
export function validReturningModel(m,s){return object(m)&&integer(m.tableTens,0,4)&&integer(m.tableOnes,0,12)&&integer(m.returnedTens,0,1)&&integer(m.returnedOnes,0,s.returnedOnes)&&integer(m.openTen,0,1)&&m.tableTens+m.returnedTens+m.openTen===4&&m.tableOnes+m.returnedOnes===2+10*m.openTen;}
const validSupport=s=>list(s,k=>returnSupport.includes(k))&&s.includes('picturedSource');
const validCheck=(h,id)=>{
 if(!object(h)||!validReturningSource(h.source)||h.source.id!==id||!validReturningModel(h.model,h.source)||typeof h.raw!=='string'||h.raw.length>24||!validSupport(h.support))return false;
 const n=parseReturningNumber(h.raw);
 return n!==null&&h.parsed===n&&h.numberMatches===(n===h.source.start-h.source.target)&&h.picturedComplete===returningComplete(h.source,h.model)&&typeof h.familiar==='boolean'&&typeof h.checkedPreviously==='boolean'&&typeof h.priorHistoryUnknown==='boolean';
};
const validKept=(k,id)=>k===null||object(k)&&validReturningSource(k.source)&&k.source.id===id&&validReturningModel(k.model,k.source)&&typeof k.raw==='string'&&k.raw.length<=24&&validSupport(k.support)&&typeof k.familiar==='boolean'&&typeof k.priorHistoryUnknown==='boolean'&&(k.latestCheck===null||validCheck(k.latestCheck,id));
function validDraft(w,id){
 if(!object(w)||!validReturningSource(w.source)||w.source.id!==id||!validReturningModel(w.model,w.source)||typeof w.raw!=='string'||w.raw.length>24||!validSupport(w.support)||!Array.isArray(w.checks)||w.checks.length>8||!w.checks.every(h=>validCheck(h,id))||!validKept(w.kept,id)||typeof w.familiar!=='boolean'||!(w.error===null||w.error==='syntax')||!(w.currentFeedback===null||integer(w.currentFeedback,0,w.checks.length-1)))return false;
 if(w.currentFeedback!==null&&w.checks[w.currentFeedback].raw!==w.raw)return false;
 return true;
}
export function validReturning(root){
 return object(root)&&root.version===1&&(root.active===null||returnIds.includes(root.active))&&object(root.cases)&&Object.keys(root.cases).length<=2&&Object.entries(root.cases).every(([id,w])=>returnIds.includes(id)&&validDraft(w,id))&&(root.active===null||Object.hasOwn(root.cases,root.active))&&list(root.shownBundleExamples,s=>knownReturningSignatures.includes(s));
}
export function returningState(state){return Object.hasOwn(state,'returningOrders')?(validReturning(state.returningOrders)?state.returningOrders:null):undefined;}
export function returningHistoryUnknown(state){return Object.hasOwn(state,'returningOrders')&&(returningState(state)===null||Object.hasOwn(state.returningOrders,'retainedRaw'));}
export function returningView(state){const root=returningState(state);return root===null?{unavailable:true}:root===undefined?{absent:true}:{root,work:root.active?root.cases[root.active]:null};}
const blankRoot=()=>({version:1,active:null,cases:{},shownBundleExamples:[]});
const newDraft=source=>({source:copy(source),model:startReturningModel(),raw:'',support:['picturedSource'],checks:[],currentFeedback:null,error:null,kept:null,familiar:false});
function change(state,fn){const current=returningState(state);if(!current)return false;const next=copy(current);if(!fn(next,next.active?next.cases[next.active]:null)||!validReturning(next))return false;state.returningOrders=next;return true;}
export function startReturning(state,id){
 if(!returnIds.includes(id)||returningState(state)===null)return false;
 const root=returningState(state)===undefined?blankRoot():copy(state.returningOrders);
 if(Object.hasOwn(root.cases,id))root.cases[id].familiar=true;
 else {const source=returningCase(id);if(!validReturningSource(source))return false;const draft=newDraft(source);draft.familiar=Object.keys(root.cases).length>0;root.cases[id]=draft;}
 root.active=id;
 if(!validReturning(root)||!recoveryFitsProgressLimits({...state,returningOrders:root}))return false;
 state.returningOrders=root;return true;
}
export function moveReturning(state,action){
 return change(state,(r,w)=>{
  if(!w)return false;const m=w.model,s=w.source;
  switch(action){
   case 'open':if(m.openTen||!m.tableTens)return false;m.tableTens--;m.tableOnes+=10;m.openTen=1;break;
   case 'make':if(!m.openTen||m.tableOnes<10)return false;m.tableTens++;m.tableOnes-=10;m.openTen=0;break;
   case 'return-ten':if(!m.tableTens||m.returnedTens>=s.returnedTens)return false;m.tableTens--;m.returnedTens++;break;
   case 'return-one':if(!m.tableOnes||m.returnedOnes>=s.returnedOnes)return false;m.tableOnes--;m.returnedOnes++;break;
   case 'bring-ten':if(!m.returnedTens)return false;m.returnedTens--;m.tableTens++;break;
   case 'bring-one':if(!m.returnedOnes)return false;m.returnedOnes--;m.tableOnes++;break;
   case 'reset':m.tableTens=4;m.tableOnes=2;m.returnedTens=0;m.returnedOnes=0;m.openTen=0;break;
   default:return false;
  }
  if(action!=='reset'&&!w.support.includes('handling'))w.support.push('handling');
  return true;
 });
}
export function setReturningRaw(state,raw){return typeof raw==='string'&&raw.length<=24&&change(state,(r,w)=>{if(!w)return false;w.raw=raw;w.error=null;w.currentFeedback=null;return true;});}
export function checkReturning(state){return change(state,(r,w)=>{
 if(!w)return false;const n=parseReturningNumber(w.raw);
 if(n===null){w.error='syntax';w.currentFeedback=null;return true;}
 const h={source:copy(w.source),model:copy(w.model),raw:w.raw,parsed:n,numberMatches:n===w.source.start-w.source.target,picturedComplete:returningComplete(w.source,w.model),support:[...w.support],familiar:w.familiar||w.checks.length>0,checkedPreviously:w.checks.length>0,priorHistoryUnknown:Object.hasOwn(r,'retainedRaw')};
 if(w.checks.length===8)w.checks.shift();
 w.checks.push(h);w.currentFeedback=w.checks.length-1;w.error=null;
 if(!w.support.includes('feedback'))w.support.push('feedback');
 return true;
});}
export function keepReturning(state){return change(state,(r,w)=>{if(!w)return false;w.kept={source:copy(w.source),model:copy(w.model),raw:w.raw,support:[...w.support],latestCheck:w.checks.length?copy(w.checks.at(-1)):null,familiar:w.familiar,priorHistoryUnknown:Object.hasOwn(r,'retainedRaw')};w.error=null;return true;});}
export function useReturningSupport(state,key){return ['help','example','narrationRequested','together'].includes(key)&&change(state,(r,w)=>{if(!w)return false;if(!w.support.includes(key))w.support.push(key);return true;});}
export function noteReturningExamples(state,signatures){
 if(!list(signatures,s=>knownReturningSignatures.includes(s)))return false;
 return change(state,r=>{let changed=false;for(const s of signatures)if(!r.shownBundleExamples.includes(s)){r.shownBundleExamples.push(s);changed=true;}return changed;});
}
export function recoverReturning(state){
 if(!Object.hasOwn(state,'returningOrders')||returningState(state)!==null)return false;
 const next=blankRoot();next.retainedRaw=copy(state.returningOrders);
 const notebook={...state,returningOrders:next};
 if(!recoveryFitsProgressLimits(notebook))return false;
 state.returningOrders=next;return true;
}
