import {joinCases} from './join-pieces-core.mjs';
import {createCommonPair,commonPairModel,splitCommonPair,undoCommonPair,commonExample} from './common-cuts-core.mjs';

const gcd=(a,b)=>b?gcd(b,a%b):a;
export const missingCases=Object.freeze(joinCases.map(({id,left:a,right:b})=>{
 const totalDenominator=a.denominator*b.denominator/gcd(a.denominator,b.denominator);
 return Object.freeze({id,totalNumerator:a.numerator*(totalDenominator/a.denominator)+b.numerator*(totalDenominator/b.denominator),
  totalDenominator,knownNumerator:a.numerator,knownDenominator:a.denominator});
}));
export function createMissing(caseId){
 const knownPair=createCommonPair(caseId);
 return knownPair?{caseId,knownPair,totalCuts:0,removed:0}:null;
}
function material(originalTotalNumerator,originalTotalDenominator,totalCuts,known,removed){
 const scale=2**totalCuts,totalNumerator=originalTotalNumerator*scale,totalDenominator=originalTotalDenominator*scale;
 const matched=known.denominator===totalDenominator,unlocked=removed===0;
 return {originalTotalNumerator,originalTotalDenominator,totalNumerator,totalDenominator,known,matched,removed,
  remaining:totalNumerator-removed,difference:matched?totalNumerator-known.numerator:null,
  complete:matched&&removed===known.numerator,
  canSplitTotal:unlocked&&totalDenominator*2<=12,canUndoTotal:unlocked&&totalCuts>0,
  canSplitKnown2:unlocked&&known.canSplit2,canSplitKnown3:unlocked&&known.canSplit3,
  canUndoKnown:unlocked&&known.canUndo,canTake:matched&&removed<known.numerator,
  canUndo:removed>0,canReturn:removed>0};
}
export function missingModel(state){
 const source=missingCases.find(c=>c.id===state?.caseId);
 if(!source||state.knownPair?.caseId!==source.id)return null;
 const pair=commonPairModel(state.knownPair);
 if(!pair||pair.right.history.length||pair.right.lastAction!==null)return null;
 if(state.totalCuts!==0&&!(state.totalCuts===1&&source.totalDenominator===6))return null;
 const removed=state.removed;
 if(!Number.isInteger(removed)||removed<0||removed>pair.left.numerator)return null;
 const model=material(source.totalNumerator,source.totalDenominator,state.totalCuts,pair.left,removed);
 return removed&&!model.matched?null:{caseId:source.id,...model};
}
const clonePair=pair=>({caseId:pair.caseId,...Object.fromEntries(['left','right'].map(side=>[side,
 {history:[...pair[side].history],lastAction:pair[side].lastAction?{...pair[side].lastAction}:null}]))});
export function changeMissing(state,action,factor){
 const model=missingModel(state);
 if(!model)return null;
 let knownPair=clonePair(state.knownPair),totalCuts=state.totalCuts,removed=state.removed;
 if(action==='split-known'){
  if(removed||![2,3].includes(factor))return null;
  knownPair=splitCommonPair(knownPair,'left',factor);
  if(!knownPair)return null;
 }else if(action==='uncut-known'){
  if(!model.canUndoKnown)return null;
  knownPair=undoCommonPair(knownPair,'left');
 }else if(action==='split-total'){
  if(!model.canSplitTotal||(factor!==undefined&&factor!==2))return null;
  totalCuts++;
 }else if(action==='uncut-total'){
  if(!model.canUndoTotal)return null;
  totalCuts--;
 }else if(action==='take'){
  if(!model.canTake)return null;
  removed++;
 }else if(action==='undo'){
  if(!model.canUndo)return null;
  removed--;
 }else if(action==='return'){
  if(!model.canReturn)return null;
  removed=0;
 }else return null;
 return {caseId:state.caseId,knownPair,totalCuts,removed};
}
// A separate supplied picture: it has no case ID or live pair to act upon.
export function missingExample(frame){
 if(!Number.isInteger(frame)||frame<0||frame>4)return null;
 const known=commonExample(frame===0?0:1).left,removed=frame<2?0:frame===2?1:2;
 return {frame,...material(3,4,0,known,removed),...(frame===4?{wrongClaim:{numerator:2,denominator:2}}:{})};
}
