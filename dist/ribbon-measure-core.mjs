import {ribbonMeasureCase,ribbonMeasureCopy} from './ribbon-measure-content.mjs';
export const ribbonUnit=288;
export const groupPartitions=Object.freeze([1,2,3,4,6]);
const gcd=(a,b)=>b?gcd(b,a%b):a;
export function ribbonFraction(n,d){if(!Number.isSafeInteger(n)||n<0||!Number.isSafeInteger(d)||d<=0)return null;const g=gcd(n,d);return {n:n/g,d:d/g};}
const fractionText=f=>f.d===1?String(f.n):`${f.n}/${f.d}`;
function quantity(n,d,noun,alias=false){
 const f=ribbonFraction(n,d);if(!f)return null;
 if(!f.n)return `0 ${noun}s`;
 if(f.n===f.d)return `1 ${noun}`;
 if(f.n<f.d)return `${fractionText(f)} of one ${noun}`;
 const whole=Math.floor(f.n/f.d),rem=f.n%f.d;
 return rem?`${whole} ${rem}/${f.d} ${noun}s${alias?` (${fractionText(f)} groups)`:''}`:`${whole} ${noun}s`;
}
export const ribbonLengthName=coordinates=>quantity(coordinates,ribbonUnit,'length unit');
export const ribbonGroupName=(n,d)=>quantity(n,d,'measuring group',true);
export function createRibbonMeasure(caseId){return ribbonMeasureCase(caseId)?{caseId,cuts:[],pieces:[]}:null;}

function derive(state,amount,group){
 if(!state||!Array.isArray(state.cuts)||!Array.isArray(state.pieces))return null;
 let q=1;for(const factor of state.cuts){if(![2,3].includes(factor)||q*factor>6)return null;q*=factor;}
 let covered=0;const segments=[];
 for(const part of state.pieces){if(!groupPartitions.includes(part)||!Number.isInteger(group/part))return null;const end=covered+group/part;if(end>amount)return null;segments.push({q:part,start:covered,end,length:group/part});covered=end;}
 const gap=amount-covered;
 return {caseId:state.caseId,unit:ribbonUnit,rulerEnd:2*ribbonUnit,amount,group,q,
  cuts:[...state.cuts],pieces:[...state.pieces],segments,covered,gap,
  groupCount:ribbonFraction(covered,group),pieceLength:group/q,
  canLay:group/q<=gap,canLift:state.pieces.length>0,canUndo:state.cuts.length>0,
  canSplit2:q*2<=6,canSplit3:q*3<=6,complete:covered===amount,
  unfillableGap:gap>0&&gap<group/6};
}
export function ribbonMeasureModel(state){const c=ribbonMeasureCase(state?.caseId);return c?derive(state,ribbonUnit*c.amount.n/c.amount.d,ribbonUnit*c.group.n/c.group.d):null;}
function change(state,fn){const m=ribbonMeasureModel(state);if(!m)return null;const next={caseId:state.caseId,cuts:[...state.cuts],pieces:[...state.pieces]};return fn(next,m)&&ribbonMeasureModel(next)?next:null;}
export const splitRibbonMeasure=(s,factor)=>change(s,(n,m)=>{if(![2,3].includes(factor)||m.q*factor>6)return false;n.cuts.push(factor);return true;});
export const undoRibbonSplit=s=>change(s,(n,m)=>{if(!m.canUndo)return false;n.cuts.pop();return true;});
export const layRibbonPiece=s=>change(s,(n,m)=>{if(!m.canLay)return false;n.pieces.push(m.q);return true;});
export const liftRibbonPiece=s=>change(s,(n,m)=>{if(!m.canLift)return false;n.pieces.pop();return true;});
export const returnRibbonPieces=s=>change(s,n=>{n.pieces=[];return true;});
export function ribbonLayAdvice(state){
 const m=ribbonMeasureModel(state);if(!m)return null;
 if(m.complete)return 'The ribbon is fully measured. Use Lift last piece or Return all pieces to try another way.';
 if(m.canLay)return '';
 if(m.unfillableGap)return `The gap is ${ribbonGroupName(m.gap,m.group)}, smaller than any piece this board offers. Use Lift last piece to try another way.`;
 if(m.q===4)return 'A smaller offered piece fits. Use Undo last split to change the template, or Lift last piece.';
 return `This piece reaches beyond the ribbon’s end. Try splitting the measuring group.${m.canLift?' Or use Lift last piece.':''}`;
}
export function ribbonPieceName(state){const m=ribbonMeasureModel(state);return m?`Each selected piece is ${m.q===1?'one whole measuring group':ribbonGroupName(1,m.q)}, or ${ribbonLengthName(m.pieceLength)}.`:null;}
export function ribbonPieceTally(state){const m=ribbonMeasureModel(state);if(!m)return null;const names={1:'whole-group',2:'half-group',3:'third-group',4:'quarter-group',6:'sixth-group'};return groupPartitions.map(q=>{const n=m.pieces.filter(p=>p===q).length;return n?`${n} ${names[q]} piece${n===1?'':'s'}`:null;}).filter(Boolean).join('; ');}
export function ribbonReading(state){
 const m=ribbonMeasureModel(state);if(!m)return null;
 if(!m.pieces.length)return m.canLay?'Lay a piece to begin measuring the ribbon.':ribbonLayAdvice(state);
 return `${ribbonPieceTally(state)}. Together: ${ribbonGroupName(m.covered,m.group)}. Check: ${ribbonGroupName(m.covered,m.group)} times ${ribbonLengthName(m.group)} per measuring group measures ${ribbonLengthName(m.covered)}.${m.complete?'':' The ribbon is not fully measured yet.'}`;
}
export function ribbonCompletion(state){const m=ribbonMeasureModel(state);return m?.complete?`This measures all of the ribbon (${ribbonLengthName(m.amount)}). Together these pieces make ${ribbonGroupName(m.covered,m.group)}. Each whole measuring group is ${ribbonLengthName(m.group)}.`:null;}
// A separately authored example is not a live case accepted by action helpers.
export function ribbonMeasureExample(index){
 if(!Number.isInteger(index)||index<0||index>3)return null;
 const states=[{cuts:[],pieces:[]},{cuts:[],pieces:[1]},{cuts:[2],pieces:[1]},{cuts:[2],pieces:[1,2]}];
 return {...derive({caseId:'worked-example',...states[index]},144,96),index,displayIndex:index+1,text:ribbonMeasureCopy.exampleFrames[index],showSixths:index>=2};
}
