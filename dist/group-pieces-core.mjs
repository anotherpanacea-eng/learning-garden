import {groupCases,groupCopy} from './group-pieces-content.mjs';

export const groupCase=id=>groupCases.find(c=>c.id===id)||null;
export const createGroup=caseId=>groupCase(caseId)?{caseId,history:[]}:null;
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const factorFits=(n,d,g)=>Number.isInteger(g)&&g>=2&&g<=d&&n%g===0&&d%g===0;

export function groupModel(work){
 if(!object(work)||!Array.isArray(work.history))return null;
 const c=groupCase(work.caseId);if(!c)return null;
 let n=c.numerator,d=c.denominator,originalPiecesPerCurrent=1;
 for(const g of work.history){
  if(!factorFits(n,d,g))return null;
  n/=g;d/=g;originalPiecesPerCurrent*=g;
 }
 return {caseId:c.id,numerator:n,denominator:d,originalNumerator:c.numerator,originalDenominator:c.denominator,
  history:[...work.history],originalPiecesPerCurrent,canUndo:work.history.length>0,
  groupSizes:Array.from({length:d-1},(_,i)=>i+2)};
}

function previewCounts(n,d,g){
 if(!Number.isInteger(g)||g<2||g>d)return null;
 const wholeRemainder=d%g,coloredRemainder=n%g,fits=wholeRemainder===0&&coloredRemainder===0;
 return {factor:g,wholeGroups:Math.floor(d/g),wholeRemainder,coloredGroups:Math.floor(n/g),coloredRemainder,
  fits,nextNumerator:fits?n/g:null,nextDenominator:fits?d/g:null};
}
export function previewGroup(work,g){const m=groupModel(work);return m?previewCounts(m.numerator,m.denominator,g):null;}
export function applyGroup(work,g){
 const p=previewGroup(work,g);return p?.fits?{caseId:work.caseId,history:[...work.history,g]}:null;
}
export function undoGroup(work){
 const m=groupModel(work);return m?.canUndo?{caseId:work.caseId,history:work.history.slice(0,-1)}:null;
}
export function compareGroup(work){
 const m=groupModel(work);if(!m)return null;
 const {numerator:n,denominator:d,originalNumerator:n0,originalDenominator:d0,originalPiecesPerCurrent:g}=m;
 const suggestedFactor=m.groupSizes.find(f=>factorFits(n,d,f))??null,simplest=suggestedFactor===null;
 const pieces=g===1?'original piece':'original pieces';
 const explanation=`${n0}/${d0} = ${n}/${d}. Each current piece contains ${g} ${pieces}. Dividing both counts by the same factor keeps the colored amount unchanged. Fewer pieces are larger pieces, not a smaller amount.`;
 const conclusion=d===1?(n===0?'0 of 1 piece is colored: 0/1 = 0.':'1 of 1 piece is colored: 1/1 = one whole.'):
  simplest?`No group size from 2 to ${d} fits both ${n} and ${d}, so ${n}/${d} is the simplest whole-number name.`:
  `Group size ${suggestedFactor} fits both counts: it is a common factor of ${n} and ${d}. This is one possible next grouping.`;
 return {text:`${explanation} ${conclusion}`,simplest,suggestedFactor};
}

// This example has no caseId, so it cannot be applied to live work.
export function groupExample(frame){
 if(!Number.isInteger(frame)||frame<0||frame>5)return null;
 const numerator=frame===2?2:frame===5?3:6,denominator=frame===2?3:frame===5?6:9;
 const factor=frame===1||frame===2?3:frame===3?2:frame===4?9:null;
 return {frame,originalNumerator:6,originalDenominator:9,numerator,denominator,factor,
  preview:[1,3,4].includes(frame)?previewCounts(6,9,factor):null,text:groupCopy.frames[frame],changedAmount:frame===5};
}
