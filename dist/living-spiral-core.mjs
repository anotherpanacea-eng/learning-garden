import {starterIngredients} from './cafe-content.mjs';
import {currentRecipe} from './cafe-core.mjs';
import {spiralAnimals,spiralCases,spiralCase,spiralReasons,spiralTarget,spiralMatch} from './living-spiral-content.mjs';
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const int=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const food=id=>starterIngredients.some(a=>a.id===id);
const reason=id=>spiralReasons.some(r=>r.id===id);
const animal=id=>id==='mix'||spiralAnimals.some(a=>a.id===id);
const ranges=['small','all'];
export const spiralClosed=r=>r.carried||r.left;
export const hasSpiral=state=>Object.hasOwn(state,'livingExploration');
export const spiralReady=r=>r.inspected.includes(spiralTarget(r.task))&&r.inspected.length>=2&&(r.matched||r.explained);
export function validSpiralRound(r){
 if(!object(r)||r.revision!=='habitat-round-1'||!int(r.id,0,999999999)||!object(r.task)||!spiralCase(r.task.caseId)||
  !int(r.task.rotation,0,2)||!ranges.includes(r.task.range)||!food(r.task.ingredientId)||typeof r.task.familiar!=='boolean'||
  !int(r.task.packs,r.task.range==='small'?2:1,r.task.range==='small'?5:12)||!int(r.task.bites,r.task.range==='small'?2:1,r.task.range==='small'?5:12)||
  !int(r.place,0,2)||!Array.isArray(r.inspected)||r.inspected.length>3||new Set(r.inspected).size!==r.inspected.length||!r.inspected.every(n=>int(n,0,2))||
  !(r.answerPlace===null||int(r.answerPlace,0,2))||!(r.answerReason===null||reason(r.answerReason))||
  !['matched','explained','vocabulary','audioRequested','found','mathMatched','mathHelp','carried','left'].every(k=>typeof r[k]==='boolean')||
  typeof r.input!=='string'||r.input.length>20||!Array.isArray(r.attempts)||r.attempts.length>24||!r.attempts.every(a=>object(a)&&int(a.place,0,2)&&reason(a.reason)&&typeof a.afterHelp==='boolean'&&typeof a.afterVocabulary==='boolean'&&(!a.afterHelp||r.explained)&&(!a.afterVocabulary||r.vocabulary))||
  !Array.isArray(r.mathAttempts)||r.mathAttempts.length>24||!r.mathAttempts.every(a=>object(a)&&int(a.value,0,999)&&typeof a.afterHelp==='boolean'&&(!a.afterHelp||r.mathHelp))||
  r.found&&!spiralReady(r)||r.carried&&(!r.found||!(r.mathMatched||r.mathHelp)||r.left)||!r.found&&(r.mathHelp||r.mathMatched||r.mathAttempts.length))return false;
 return true;
}
// Validation is pure; unknown or damaged records remain exportable and cannot issue stock.
export function spiralState(state){
 const s=state.livingExploration;
 if(!object(s)||s.version!==1||!int(s.nextRound,0,1000000000)||!object(s.options)||!animal(s.options.animal)||!ranges.includes(s.options.range)||!(s.options.ingredient==='needed'||food(s.options.ingredient))||
  !object(s.cursors)||!int(s.cursors.mix,0,2)||!int(s.cursors.small,0,15)||!int(s.cursors.all,0,143)||!spiralAnimals.every(a=>int(s.cursors[a.id],0,2))||
  !Array.isArray(s.offered)||s.offered.length>spiralCases.length||new Set(s.offered).size!==s.offered.length||!s.offered.every(spiralCase)||
  !Array.isArray(s.history)||s.history.length>24||!s.history.every(r=>validSpiralRound(r)&&spiralClosed(r))||
  !(s.current===null&&s.nextRound===0||validSpiralRound(s.current)&&s.current.id===s.nextRound-1))return null;
 const ids=s.history.map(r=>r.id);if(new Set(ids).size!==ids.length||ids.some((id,i)=>id>=s.nextRound-1||i>0&&id<=ids[i-1]))return null;
 return s;
}
export const currentSpiral=state=>spiralState(state)?.current||null;
function ensure(state){
 if(!hasSpiral(state))state.livingExploration={version:1,nextRound:0,options:{animal:'mix',range:'small',ingredient:'needed'},cursors:{mix:0,snail:0,woodlouse:0,butterfly:0,small:0,all:0},offered:[],current:null,history:[]};
 return spiralState(state);
}
const open=state=>{const r=currentSpiral(state);return r&&!spiralClosed(r)?r:null;};
export function setSpiralOption(state,key,value){
 if(!(['animal','range','ingredient'].includes(key))||(key==='animal'?!animal(value):key==='range'?!ranges.includes(value):value!=='needed'&&!food(value)))return false;
 const s=ensure(state);if(!s)return false;s.options[key]=value;return true;
}
export function parcelPair(range,cursor){const n=range==='all'?(cursor*37+13)%144:(cursor*5+1)%16,side=range==='all'?12:4,min=range==='all'?1:2;return [min+Math.floor(n/side),min+n%side];}
function chooseIngredient(state,index){
 const c=state.cafe;if(!object(c?.stock)||!starterIngredients.every(a=>int(c.stock[a.id],0,180)))return null;
 const shortages=currentRecipe(c).filter(x=>food(x.ingredient.id)&&x.missing>0).sort((a,b)=>b.missing-a.missing);
 if(shortages.length)return shortages[0].ingredient.id;
 const sorted=starterIngredients.map((a,i)=>({id:a.id,n:c.stock[a.id],tie:(i-index%8+8)%8})).sort((a,b)=>a.n-b.n||a.tie-b.tie);return sorted[0].id;
}
export function startSpiral(state){
 // Do not create an exploration record on a failed start or normalize the café.
 const existing=hasSpiral(state)?spiralState(state):null;if(hasSpiral(state)&&!existing||existing?.current&&!spiralClosed(existing.current)||existing?.nextRound>=1000000000)return false;
 const ingredient=existing?.options.ingredient&&existing.options.ingredient!=='needed'?existing.options.ingredient:chooseIngredient(state,existing?.nextRound||0);if(!ingredient||!int(state.cafe?.stock?.[ingredient],0,180))return false;
 const s=ensure(state),a=s.options.animal==='mix'?['snail','woodlouse','butterfly'][s.cursors.mix]:s.options.animal;
 const cases=spiralCases.filter(c=>c.animal===a),c=cases[s.cursors[a]],range=s.options.range,[packs,bites]=parcelPair(range,s.cursors[range]);
 const r={revision:'habitat-round-1',id:s.nextRound,task:{caseId:c.id,rotation:s.nextRound%3,range,ingredientId:ingredient,packs,bites,familiar:s.offered.includes(c.id)},place:0,inspected:[],answerPlace:null,answerReason:null,attempts:[],matched:false,explained:false,vocabulary:false,audioRequested:false,found:false,input:'',mathAttempts:[],mathMatched:false,mathHelp:false,carried:false,left:false};
 if(s.current)s.history=[...s.history,s.current].slice(-24);
 s.current=r;s.nextRound++;s.cursors[a]=(s.cursors[a]+1)%3;if(s.options.animal==='mix')s.cursors.mix=(s.cursors.mix+1)%3;s.cursors[range]=(s.cursors[range]+1)%(range==='all'?144:16);
 if(!s.offered.includes(c.id))s.offered.push(c.id);return true;
}
export function selectSpiralPlace(state,n){const r=open(state);if(!r||!int(n,0,2))return false;r.place=n;return true;}
export function inspectSpiral(state){const r=open(state);if(!r)return false;if(!r.inspected.includes(r.place))r.inspected.push(r.place);return true;}
export function chooseSpiral(state,key,value){const r=open(state);if(!r||!(key==='answerPlace'?int(value,0,2):key==='answerReason'&&reason(value)))return false;r[key]=value;return true;}
export function compareSpiral(state){const r=open(state);if(!r||r.answerPlace===null||!r.answerReason||r.found)return false;r.attempts.push({place:r.answerPlace,reason:r.answerReason,afterHelp:r.explained,afterVocabulary:r.vocabulary});r.attempts=r.attempts.slice(-24);if(spiralMatch(r.task,r.attempts.at(-1)))r.matched=true;return true;}
export function supportSpiral(state,kind){const r=open(state);if(!r||!['explained','vocabulary','audioRequested'].includes(kind))return false;r[kind]=true;return true;}
export function findSpiral(state){const r=open(state);if(!r||r.found||!spiralReady(r))return false;r.found=true;return true;}
export function inputSpiral(state,value){const r=open(state);if(!r?.found||typeof value!=='string'||value.length>20)return false;r.input=value;return true;}
export function submitSpiralCount(state){const r=open(state);if(!r?.found||!/^\d{1,3}$/.test(r.input.trim()))return false;const value=Number(r.input.trim());r.mathAttempts.push({value,afterHelp:r.mathHelp});r.mathAttempts=r.mathAttempts.slice(-24);if(value===r.task.packs*r.task.bites)r.mathMatched=true;return true;}
export function helpSpiralCount(state){const r=open(state);if(!r?.found)return false;r.mathHelp=true;return true;}
export function carrySpiral(state){const r=open(state),n=r&&state.cafe?.stock?.[r.task.ingredientId];if(!r?.found||!(r.mathMatched||r.mathHelp)||!int(n,0,180)||n+r.task.packs*r.task.bites>180)return false;state.cafe.stock[r.task.ingredientId]+=r.task.packs*r.task.bites;r.carried=true;return true;}
export function leaveSpiral(state){const r=open(state);if(!r)return false;r.left=true;return true;}
export function spiralPairsShown(state){const r=currentSpiral(state);return r?.found?[[r.task.packs,r.task.bites]]:[];}
