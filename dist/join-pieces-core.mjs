import {commonCases,createCommonPair,commonPairModel,splitCommonPair,undoCommonPair,commonExample} from './common-cuts-core.mjs';

export const joinCases=commonCases;
export function createJoin(caseId){
 const pair=createCommonPair(caseId);
 return pair?{pair,moves:[]}:null;
}

// Counts belong to one chosen piece size; an unmatched pair cannot have moves.
function materialModel(pair,moves){
 const matched=pair.left.denominator===pair.right.denominator;
 if(!Array.isArray(moves)||(!matched&&moves.length))return null;
 let a=0,b=0;
 for(const source of moves){
  if(source==='A')a++;
  else if(source==='B')b++;
  else return null;
 }
 if(a>pair.left.numerator||b>pair.right.numerator)return null;
 const denominator=matched?pair.left.denominator:null,count=moves.length;
 return {left:{...pair.left,moved:a,remaining:pair.left.numerator-a},
  right:{...pair.right,moved:b,remaining:pair.right.numerator-b},matched,denominator,count,
  sequence:[...moves],complete:matched&&a===pair.left.numerator&&b===pair.right.numerator,
  fullNumerator:matched?pair.left.numerator+pair.right.numerator:null,
  wholeCount:matched?Math.floor(count/denominator):0,remainder:matched?count%denominator:0};
}
export function joinModel(state){
 const pair=commonPairModel(state?.pair);
 if(!pair)return null;
 const material=materialModel(pair,state.moves);
 return material?{caseId:pair.caseId,...material}:null;
}
const clonePair=model=>({caseId:model.caseId,...Object.fromEntries(['left','right'].map(side=>[side,
 {history:[...model[side].history],lastAction:model[side].lastAction?{...model[side].lastAction}:null}]))});
export function changeJoin(state,action,side,factor){
 const model=joinModel(state);
 if(!model)return null;
 let pair=clonePair(model),moves=[...state.moves];
 if(action==='split'||action==='uncut'){
  if(moves.length)return null;
  pair=action==='split'?splitCommonPair(pair,side,factor):undoCommonPair(pair,side);
  if(!pair)return null;
 }else if(action==='move'){
  if(!['left','right'].includes(side)||!model.matched||!model[side].remaining)return null;
  moves.push(side==='left'?'A':'B');
 }else if(action==='undo'){
  if(!moves.length)return null;
  moves.pop();
 }else if(action==='return'){
  if(!moves.length)return null;
  moves=[];
 }else return null;
 return {pair,moves};
}

// Teaching material uses the parent's separate half-and-quarter example,
// never a live case. Its models have no pair and cannot enter live actions.
export function joinExample(frame){
 if(!Number.isInteger(frame)||frame<0||frame>4)return null;
 const pair=commonExample(frame===0?0:1);
 const moves=frame<2?[]:frame===2?['A','A']:['A','A','B'];
 return {frame,...materialModel(pair,moves),...(frame===4?{wrongClaim:{numerator:2,denominator:6}}:{})};
}
