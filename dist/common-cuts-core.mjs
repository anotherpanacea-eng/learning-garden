import {commonCopy} from './common-cuts-content.mjs';

const fraction=(numerator,denominator)=>Object.freeze({numerator,denominator});
export const commonCases=Object.freeze([
 ['half-and-third','Two gathering tags',1,2,1,3],
 ['equal-banners','Two names for equal banners',2,3,4,6],
 ['quarter-third','Ribbon tails',3,4,2,3],
 ['sixth-quarter','Close lengths',5,6,3,4],
 ['quarter-and-third','Small labels',1,4,1,3]
].map(([id,title,a,b,c,d])=>Object.freeze({id,title,left:fraction(a,b),right:fraction(c,d),request:commonCopy.request})));
export const commonCase=id=>commonCases.find(c=>c.id===id)||null;
const initialRow=()=>({history:[],lastAction:null});
export function createCommonPair(caseId){return commonCase(caseId)?{caseId,left:initialRow(),right:initialRow()}:null;}

function rowModel(original,row){
 if(!row||!Array.isArray(row.history))return null;
 let denominator=original.denominator,multiplier=1;
 for(const factor of row.history){
  if((factor!==2&&factor!==3)||denominator*factor>12)return null;
  denominator*=factor;multiplier*=factor;
 }
 const action=row.lastAction;
 if(action===null){if(row.history.length)return null;}
 else if(!action||!['split','undo'].includes(action.type)||(action.type==='split'&&(![2,3].includes(action.factor)||action.factor!==row.history.at(-1))))return null;
 const boundaries=Array.from({length:denominator-1},(_,i)=>(i+1)*72/denominator);
 const oldDenominator=action?.type==='split'?denominator/action.factor:denominator;
 const solidBoundaries=boundaries.filter(p=>Number.isInteger(p*oldDenominator/72));
 const newBoundaries=boundaries.filter(p=>!solidBoundaries.includes(p));
 return {originalNumerator:original.numerator,originalDenominator:original.denominator,
  numerator:original.numerator*multiplier,coloredCount:original.numerator*multiplier,denominator,
  endpoint:72*original.numerator/original.denominator,whole:72,boundaries,solidBoundaries,newBoundaries,
  history:[...row.history],lastAction:action?{...action}:null,
  canSplit2:denominator*2<=12,canSplit3:denominator*3<=12,canUndo:row.history.length>0};
}
export function commonPairModel(pair){
 const c=commonCase(pair?.caseId);if(!c)return null;
 const left=rowModel(c.left,pair.left),right=rowModel(c.right,pair.right);
 return left&&right?{caseId:c.id,left,right}:null;
}
const cloneRow=row=>({history:[...row.history],lastAction:row.lastAction?{...row.lastAction}:null});
function move(pair,side,factor,undo){
 const model=commonPairModel(pair);
 if(!model||!['left','right'].includes(side))return null;
 if(undo?!model[side].canUndo:!([2,3].includes(factor)&&model[side].denominator*factor<=12))return null;
 const next={caseId:pair.caseId,left:cloneRow(pair.left),right:cloneRow(pair.right)};
 if(undo){next[side].history.pop();next[side].lastAction={type:'undo'};}
 else{next[side].history.push(factor);next[side].lastAction={type:'split',factor};}
 return next;
}
export const splitCommonPair=(pair,side,factor)=>move(pair,side,factor,false);
export const undoCommonPair=(pair,side)=>move(pair,side,null,true);
export function compareCommonPair(pair){
 const m=commonPairModel(pair);if(!m)return null;
 const {left:a,right:b}=m,matched=a.denominator===b.denominator;
 const relation=Math.sign(a.originalNumerator*b.originalDenominator-b.originalNumerator*a.originalDenominator);
 const symbol=relation>0?'>':relation<0?'<':'=';
 const meaning=relation>0?'A reaches farther':relation<0?'B reaches farther':'The colored ends match';
 const text=matched?`Both ribbons now use ${a.denominator} equal pieces for the same-sized whole. A has ${a.numerator} of those pieces colored; B has ${b.numerator}. ${a.numerator}/${a.denominator} ${symbol} ${b.numerator}/${b.denominator}. ${meaning}. The amounts did not change when the pieces got smaller.`:`A uses ${a.denominator} pieces in its whole; B uses ${b.denominator}. Those pieces have different sizes. Comparing just the colored-piece counts will not settle the amount. Try matching the piece sizes, or compare the fixed ends.`;
 return {matched,text,relation,symbol,meaning,left:a,right:b};
}
// The separate example has no live case ID and cannot be passed to pair actions.
export function commonExample(frame){
 if(!Number.isInteger(frame)||frame<0||frame>2)return null;
 const left=frame===1?{history:[2],lastAction:{type:'split',factor:2}}:{history:[],lastAction:frame===2?{type:'undo'}:null};
 return {frame,left:rowModel(fraction(1,2),left),right:rowModel(fraction(1,4),initialRow()),text:commonCopy.exampleFrames[frame]};
}
