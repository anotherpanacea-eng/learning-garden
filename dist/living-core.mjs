import {habitatPlace,habitatReasons,habitatMatch,habitatParcel} from './living-content.mjs';
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const reason=id=>habitatReasons.some(r=>r.id===id);
const choice=x=>object(x)&&!!habitatPlace(x.place)&&reason(x.reason)&&typeof x.afterHelp==='boolean';
export const hasLivingRecord=state=>Object.hasOwn(state,'livingGarden');
// Unknown/malformed records remain untouched, including in the ordinary notes export.
export function livingVisit(state){
 const v=state.livingGarden;
 if(!object(v)||v.version!==1||v.revision!=='snail-v1'||!habitatPlace(v.place)||
  !Array.isArray(v.inspected)||v.inspected.length>3||new Set(v.inspected).size!==v.inspected.length||!v.inspected.every(habitatPlace)||
  !(v.answerPlace===null||habitatPlace(v.answerPlace))||!(v.answerReason===null||reason(v.answerReason))||
  !Array.isArray(v.attempts)||v.attempts.length>24||!v.attempts.every(choice)||
  !['matched','explained','audioRequested','found','carried'].every(k=>typeof v[k]==='boolean')||
  v.carried&&!v.found||v.found&&!searchReady(v))return null;
 return v;
}
export function searchReady(v){return v.inspected.includes('log')&&v.inspected.some(id=>id!=='log')&&(v.explained||v.matched);}
export function startLiving(state){
 if(hasLivingRecord(state))return false;
 state.livingGarden={version:1,revision:'snail-v1',place:'sunny',inspected:[],answerPlace:null,answerReason:null,attempts:[],matched:false,explained:false,audioRequested:false,found:false,carried:false};return true;
}
export function selectLivingPlace(state,id){const v=livingVisit(state);if(!v||!habitatPlace(id))return false;v.place=id;return true;}
export function inspectLiving(state){const v=livingVisit(state);if(!v)return false;if(!v.inspected.includes(v.place))v.inspected.push(v.place);return true;}
export function chooseLiving(state,field,value){const v=livingVisit(state);if(!v||!['answerPlace','answerReason'].includes(field)||(field==='answerPlace'?!habitatPlace(value):!reason(value)))return false;v[field]=value;return true;}
export function compareLiving(state){
 const v=livingVisit(state);if(!v||!v.answerPlace||!v.answerReason)return false;
 v.attempts.push({place:v.answerPlace,reason:v.answerReason,afterHelp:v.explained});v.attempts=v.attempts.slice(-24);if(habitatMatch(v.attempts.at(-1)))v.matched=true;return true;
}
export function helpLiving(state){const v=livingVisit(state);if(!v)return false;v.explained=true;return true;}
export function audioLiving(state){const v=livingVisit(state);if(!v)return false;v.audioRequested=true;return true;}
export function findLivingParcel(state){const v=livingVisit(state);if(!v||!searchReady(v)||v.found)return false;v.found=true;return true;}
export function carryLivingParcel(state){
 const v=livingVisit(state),stock=state.cafe?.stock,n=stock?.[habitatParcel.ingredientId];
 if(!v?.found||v.carried||!Number.isSafeInteger(n)||n<0||n+habitatParcel.total>180)return false;
 // The existing café is initialized by the app; do not normalize its waiting order here.
 stock[habitatParcel.ingredientId]=n+habitatParcel.total;v.carried=true;return true;
}
