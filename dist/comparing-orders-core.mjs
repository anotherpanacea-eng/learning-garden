import {comparisonModes,comparisonSignatures,comparisonSource,comparisonSupport,comparisonTextKeys} from './comparing-orders-content.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const copy=x=>structuredClone(x);
const bits=x=>Number.isInteger(x)&&x>=0&&x<=1;
const bytes=x=>new TextEncoder().encode(x).length;
const unique=(x,p)=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(p);
const supportValid=x=>unique(x,s=>comparisonSupport.includes(s))&&x.includes('picturedSource');
const choiceCodes={compare:['both','extra','remaining'],return:['extra','start','remaining']};
export const fittingMeaning=mode=>mode==='compare'?'extra':'remaining';

export function validComparisonSource(s){
 if(!object(s)||s.version!==1||s.id!=='crate-23-11'||s.pip!==23||s.other!==11||s.pipTens!==2||s.pipOnes!==3||s.otherTens!==1||s.otherOnes!==1||s.answer!==12||!object(s.text)||!object(s.choiceOrder))return false;
 if(!comparisonTextKeys.every(k=>typeof s.text[k]==='string'&&s.text[k].trim()&&bytes(s.text[k])<=512))return false;
 for(const mode of comparisonModes)if(!unique(s.choiceOrder[mode],x=>choiceCodes[mode].includes(x))||s.choiceOrder[mode].length!==3)return false;
 try{return bytes(JSON.stringify(s))<=16384;}catch{return false;}
}
export const blankModel=mode=>mode==='compare'?{pairedTens:0,pairedOnes:0}:{storeTens:0,storeOnes:0};
export function validComparisonModel(mode,m){return object(m)&&comparisonModes.includes(mode)&&(mode==='compare'?bits(m.pairedTens)&&bits(m.pairedOnes):bits(m.storeTens)&&bits(m.storeOnes));}
export const modelComplete=(mode,m)=>mode==='compare'?m.pairedTens===1&&m.pairedOnes===1:m.storeTens===1&&m.storeOnes===1;
export const modelCount=(mode,m)=>mode==='compare'?10*m.pairedTens+m.pairedOnes:10*m.storeTens+m.storeOnes;
export function parseComparisonNumber(raw){if(typeof raw!=='string'||raw.length>24||!/^[\t\n\r ]*[0-9]+[\t\n\r ]*$/.test(raw))return null;const n=Number(raw.trim());return Number.isInteger(n)&&n>=0&&n<=99?n:null;}
const choiceValid=(mode,v)=>v===null||choiceCodes[mode].includes(v);
export function validComparisonCheck(h,mode){
 if(!object(h)||h.mode!==mode||!validComparisonSource(h.source)||!validComparisonModel(mode,h.model)||typeof h.raw!=='string'||h.raw.length>24||!choiceCodes[mode].includes(h.meaningChoice)||!supportValid(h.support))return false;
 const n=parseComparisonNumber(h.raw);
 return n!==null&&h.parsed===n&&h.numberMatches===(n===12)&&h.meaningMatches===(h.meaningChoice===fittingMeaning(mode))&&h.modelComplete===modelComplete(mode,h.model)&&typeof h.familiar==='boolean'&&typeof h.checkedPreviously==='boolean'&&typeof h.priorHistoryUnknown==='boolean';
}
export function readableChecks(w,mode){return Array.isArray(w?.checks)?w.checks.map((h,i)=>validComparisonCheck(h,mode)?i:null).filter(i=>i!==null):[];}
export function validComparisonKept(k,mode){return object(k)&&k.mode===mode&&validComparisonSource(k.source)&&validComparisonModel(mode,k.model)&&typeof k.raw==='string'&&k.raw.length<=24&&choiceValid(mode,k.meaningChoice)&&supportValid(k.support)&&typeof k.familiar==='boolean'&&typeof k.priorHistoryUnknown==='boolean'&&(k.latestCheck===null||validComparisonCheck(k.latestCheck,mode));}
export function validComparisonMode(w,mode){return object(w)&&validComparisonModel(mode,w.model)&&typeof w.raw==='string'&&w.raw.length<=24&&choiceValid(mode,w.meaningChoice)&&supportValid(w.support)&&Array.isArray(w.checks)&&typeof w.familiar==='boolean'&&(w.error===null||w.error==='syntax')&&(w.currentFeedback===null||Number.isInteger(w.currentFeedback)&&w.currentFeedback>=0&&w.currentFeedback<w.checks.length);}
export function comparisonState(state){
 if(!Object.hasOwn(state,'comparisonSupplies'))return undefined;
 const r=state.comparisonSupplies;
 return object(r)&&r.version===1&&comparisonModes.includes(r.active)&&(!Object.hasOwn(r,'page')||['picture','answer'].includes(r.page))&&validComparisonSource(r.source)&&object(r.modes)&&unique(r.shownBundleExamples,x=>comparisonSignatures.includes(x))?r:null;
}
export function comparisonHistoryUnknown(state){return Object.hasOwn(state,'comparisonSupplies')&&(comparisonState(state)===null||Object.hasOwn(state.comparisonSupplies,'retainedRaw'));}
export function comparisonView(state){const root=comparisonState(state);if(root===undefined)return {absent:true};if(root===null)return {unavailable:true};return {root,mode:root.active,work:validComparisonMode(root.modes[root.active],root.active)?root.modes[root.active]:null};}
const freshMode=mode=>({model:blankModel(mode),raw:'',meaningChoice:null,support:['picturedSource'],checks:[],currentFeedback:null,kept:null,familiar:false,error:null});
export const freshComparisonRoot=()=>({version:1,active:'compare',source:comparisonSource(),modes:{compare:freshMode('compare'),return:freshMode('return')},shownBundleExamples:[]});
export function startComparison(state){if(comparisonState(state)!==undefined)return false;state.comparisonSupplies=freshComparisonRoot();return true;}
export function recoverComparison(state){if(!Object.hasOwn(state,'comparisonSupplies'))return false;const r=comparisonState(state);if(r&&validComparisonMode(r.modes[r.active],r.active))return false;const old=copy(state.comparisonSupplies);state.comparisonSupplies={...freshComparisonRoot(),retainedRaw:old};return true;}
export function switchComparison(state,mode){const r=comparisonState(state);if(!r||!comparisonModes.includes(mode)||!validComparisonMode(r.modes[mode],mode))return false;if(r.active!==mode){r.active=mode;r.page='picture';r.modes[mode].familiar=true;r.modes[comparisonModes.find(x=>x!==mode)].familiar=true;}return true;}
export function setComparisonPage(state,page){const r=comparisonState(state);if(!r||!['picture','answer'].includes(page)||!validComparisonMode(r.modes[r.active],r.active))return false;r.page=page;return true;}
function current(state){const r=comparisonState(state);return r&&validComparisonMode(r.modes[r.active],r.active)?{r,w:r.modes[r.active],mode:r.active}:null;}
export function moveComparison(state,action){const x=current(state);if(!x)return false;const {w,mode}=x,m=w.model;
 const field=mode==='compare'?{ten:'pairedTens',one:'pairedOnes'}:{ten:'storeTens',one:'storeOnes'};
 if(action==='reset'){w.model=blankModel(mode);return true;}
 const [verb,kind]=action.split('-'),key=field[kind];if(!key||!['add','undo'].includes(verb))return false;
 if(verb==='add'){if(m[key]!==0)return false;m[key]=1;}else{if(m[key]!==1)return false;m[key]=0;}
 if(!w.support.includes('handling'))w.support.push('handling');return true;
}
export function setComparisonRaw(state,raw){const x=current(state);if(!x||typeof raw!=='string'||raw.length>24)return false;x.w.raw=raw;x.w.error=null;x.w.currentFeedback=null;return true;}
export function selectComparisonMeaning(state,code){const x=current(state);if(!x||!choiceValid(x.mode,code))return false;x.w.meaningChoice=code;x.w.error=null;x.w.currentFeedback=null;return true;}
export function useComparisonSupport(state,key){const x=current(state);if(!x||!['help','together','narrationRequested'].includes(key))return false;if(!x.w.support.includes(key))x.w.support.push(key);return true;}
export function checkComparison(state,allowOverCap=false){const x=current(state);if(!x)return false;const {r,w,mode}=x,n=parseComparisonNumber(w.raw);
 if(n===null||!choiceCodes[mode].includes(w.meaningChoice)){w.error='syntax';w.currentFeedback=null;return true;}
 const indices=readableChecks(w,mode);
 if(indices.length>8&&!allowOverCap)return false;
 if(indices.length>=8)w.checks.splice(indices[0],1);
 const h={mode,source:copy(r.source),model:copy(w.model),raw:w.raw,meaningChoice:w.meaningChoice,parsed:n,numberMatches:n===12,meaningMatches:w.meaningChoice===fittingMeaning(mode),modelComplete:modelComplete(mode,w.model),support:[...w.support],familiar:w.familiar||indices.length>0,checkedPreviously:indices.length>0,priorHistoryUnknown:Object.hasOwn(r,'retainedRaw')||w.checks.some(v=>!validComparisonCheck(v,mode))};
 w.checks.push(h);w.currentFeedback=w.checks.length-1;w.error=null;w.familiar=true;
 if(!w.support.includes('feedback'))w.support.push('feedback');return true;
}
export function keepComparison(state,replace=false){const x=current(state);if(!x)return false;const {r,w,mode}=x;if(w.kept!==null&&!replace||w.kept===null&&replace||w.kept!==null&&replace&&!validComparisonKept(w.kept,mode))return false;const last=readableChecks(w,mode).at(-1);w.kept={mode,source:copy(r.source),model:copy(w.model),raw:w.raw,meaningChoice:w.meaningChoice,support:[...w.support],latestCheck:last===undefined?null:copy(w.checks[last]),familiar:w.familiar,priorHistoryUnknown:Object.hasOwn(r,'retainedRaw')||w.checks.some(v=>!validComparisonCheck(v,mode))};w.error=null;return true;}
export function comparisonDisplaySignatures(root){if(!root||!validComparisonSource(root.source)||!comparisonModes.includes(root.active))return [];
 const mode=root.active,w=root.modes?.[mode];if(!validComparisonMode(w,mode))return [];
 if(mode==='compare')return ['bundle:0:2:3','bundle:0:1:1'];
 const m=w.model,tableTens=2-m.storeTens,tableOnes=3-m.storeOnes;
 const parts=['bundle:0:2:3',`bundle:0:${tableTens}:${tableOnes}`,`bundle:0:${m.storeTens}:${m.storeOnes}`];
 return [...new Set(parts.filter(s=>comparisonSignatures.includes(s)))];
}
export function noteComparisonExamples(state,examples){const r=comparisonState(state);if(!r||!unique(examples,s=>comparisonSignatures.includes(s)))return false;let changed=false;for(const s of examples)if(!r.shownBundleExamples.includes(s)){r.shownBundleExamples.push(s);changed=true;}return changed;}
