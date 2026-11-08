import {orderCases,orderCopy} from './ribbon-orders-content.mjs';
export {orderCases} from './ribbon-orders-content.mjs';
export const orderCase=id=>orderCases.find(c=>c.id===id)||null;
export function createOrder(caseId=orderCases[0].id){
 return orderCase(caseId)?{caseId,history:[]}:null;
}
function start(c){
 const packed=Math.floor(c.numerator/c.denominator);
 return {bundles:Array.from({length:packed},(_,j)=>Array.from({length:c.denominator},(_,i)=>j*c.denominator+i)),
  loose:Array.from({length:c.numerator%c.denominator},(_,i)=>packed*c.denominator+i),sent:[]};
}
function move(s,c,action){
 if(s.sent.length===c.target)return false;
 if(action==='open'&&s.bundles.length){s.loose.unshift(...s.bundles.pop());return true;}
 if(action==='whole'&&s.bundles.length&&c.target-s.sent.length>=c.denominator){s.sent.push(...s.bundles.pop());return true;}
 if(action==='piece'&&s.loose.length){s.sent.push(s.loose.shift());return true;}
 return false;
}
function guidance(m){
 if(m.target===0)return ['Choose another order.'];
 if(m.complete)return ['You can undo a move or choose another order.'];
 const lines=[];
 if(!m.packed){lines.push('There is no whole bundle to open.','There is no whole bundle to send.');}
 else if(m.needed<m.denominator){lines.push(m.loose.length?'The order needs less than one whole now. Send loose pieces.':'The order needs less than one whole now. Open a whole to get loose pieces.');}
 if(!m.loose.length&&m.needed>=m.denominator)lines.push('Open a whole to get loose pieces, or send a whole.');
 return lines;
}
const pieceCount=n=>`${n} ${n===1?'piece':'pieces'}`;
const rackCount=n=>`${pieceCount(n)} ${n===1?'stays':'stay'} on the rack.`;
function model(c,s,history){
 const sentCount=s.sent.length,remaining=c.numerator-sentCount,needed=c.target-sentCount,packed=s.bundles.length,complete=needed===0;
 const m={...c,...s,history:[...history],sentCount,remaining,needed,packed,complete,
  canOpen:!complete&&packed>0,canWhole:!complete&&packed>0&&needed>=c.denominator,canPiece:!complete&&s.loose.length>0,canUndo:history.length>0,
  currentWhole:Math.floor(remaining/c.denominator),currentRemainder:remaining%c.denominator,
  finalWhole:Math.floor((c.numerator-c.target)/c.denominator),finalRemainder:(c.numerator-c.target)%c.denominator};
 m.guidance=guidance(m);
 m.readout=c.target===0?`This order needs no ribbon. All ${c.numerator} pieces stay on the rack.`:complete?`The order is filled. ${rackCount(remaining)}`:`Sent ${sentCount} of the ${pieceCount(c.target)} requested. ${rackCount(remaining)}`;
 return m;
}
export function orderModel(work){
 if(!work||typeof work!=='object'||Array.isArray(work)||Object.keys(work).length!==2||!Object.hasOwn(work,'caseId')||!Object.hasOwn(work,'history')||!Array.isArray(work.history))return null;
 const c=orderCase(work.caseId);
 if(!c||work.history.length>c.numerator+Math.floor(c.numerator/c.denominator))return null;
 const s=start(c);
 for(const action of work.history)if(!move(s,c,action))return null;
 return {caseId:c.id,...model(c,s,work.history)};
}
export function changeOrder(work,action){
 const m=orderModel(work);
 if(!m)return null;
 if(action==='undo')return m.canUndo?{caseId:m.caseId,history:m.history.slice(0,-1)}:null;
 if(!['open','whole','piece'].includes(action)||!move(m,m,action))return null;
 return {caseId:m.caseId,history:[...work.history,action]};
}
export function orderGuidance(work){return orderModel(work)?.guidance??null;}
const numberWords=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty','twenty-one','twenty-two','twenty-three','twenty-four','twenty-five','twenty-six'];
const units={4:['quarter','quarters'],5:['fifth','fifths'],6:['sixth','sixths']};
const fractionSpeech=(n,d)=>`${numberWords[n]} ${units[d][n===1?0:1]}`;
function remainderName(q,r,d,speech=false){
 const whole=speech?numberWords[q]:q,part=speech?fractionSpeech(r,d):`${r}/${d}`;
 if(!q&&!r)return speech?'zero':'0';
 if(!q)return part;
 if(!r)return `${whole} ${q===1?'whole':'wholes'}`;
 return `${whole} ${q===1?'whole':'wholes'} and ${part}`;
}
export function orderExplanation(work){
 const m=orderModel(work);
 if(!m)return null;
 const {numerator:n,denominator:d,target:t,remaining:r,sentCount:s,finalWhole:q,finalRemainder:f}=m;
 const explanation=`Opening a whole changes its grouping, not the amount. The denominator stays ${d} because every piece is still 1/${d} of the same whole. Sending ribbon separates the stock into the order and what stays. The order takes ${t} pieces of size 1/${d} from ${n}. The final remainder is ${n-t} such pieces.`;
 const spokenExplanation=`Opening a whole changes its grouping, not the amount. The denominator stays ${numberWords[d]} because every piece is still one ${units[d][0]} of the same whole. Sending ribbon separates the stock into the order and what stays. The order takes ${numberWords[t]} pieces of size one ${units[d][0]} from ${numberWords[n]}. The final remainder is ${numberWords[n-t]} such pieces.`;
 return {text:`${m.stockName} minus ${m.orderName}. ${n}/${d} − ${t}/${d} = ${n-t}/${d}. The final remaining amount is ${remainderName(q,f,d)}. Current material: ${pieceCount(s)} sent; ${pieceCount(r)} on the rack. ${explanation}`,
  spokenText:`${m.stockSpeech} minus ${m.orderSpeech}. ${fractionSpeech(n,d)} minus ${fractionSpeech(t,d)} equals ${fractionSpeech(n-t,d)}. The final remaining amount is ${remainderName(q,f,d,true)}. Current material: ${numberWords[s]} ${s===1?'piece':'pieces'} sent; ${numberWords[r]} ${r===1?'piece':'pieces'} on the rack. ${spokenExplanation}`};
}
export function orderExample(frame){
 if(!Number.isInteger(frame)||frame<0||frame>5)return null;
 const c={numerator:9,denominator:4,target:3},history=[[],['open'],['open','piece'],['open','piece','piece'],['open','piece','piece','piece'],['open','piece','piece','piece']][frame],s=start(c);
 for(const action of history)move(s,c,action);
 return {...model(c,s,history),frame,text:orderCopy.frames[frame],spokenText:orderCopy.frames[frame],claim:frame===5?{numerator:10,denominator:4}:null};
}
