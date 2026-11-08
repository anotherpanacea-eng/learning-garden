import assert from 'node:assert/strict';
import {orderCases,createOrder,orderModel,changeOrder,orderExample,orderExplanation,orderGuidance} from '../dist/ribbon-orders-core.mjs';

const expected=[['quarters-gathering',17,4,7],['sixths-path',26,6,11],['quarters-without-trade',23,4,15],['fifths-crossing',7,5,4],['whole-stock',8,4,3],['all-ribbon',5,4,5],['no-order',7,4,0]];
assert.deepEqual(orderCases.map(c=>[c.id,c.numerator,c.denominator,c.target]),expected);
assert.equal(createOrder().caseId,expected[0][0]);
const key=(p,l,s)=>`${p},${l},${s}`;
const count=m=>key(m.packed,m.loose.length,m.sentCount);
function inventory(m,n,d){
 const ids=[...m.bundles.flat(),...m.loose,...m.sent];
 assert.deepEqual([...ids].sort((a,b)=>a-b),Array.from({length:n},(_,i)=>i));
 assert.equal(new Set(ids).size,n);
 assert(m.bundles.every(b=>b.length===d));
 assert.equal(m.remaining,n-m.sent.length);
 assert.equal(m.currentWhole,Math.floor(m.remaining/d));
 assert.equal(m.currentRemainder,m.remaining%d);
}
let states=0,edges=0;
for(const [id,n,d,t] of expected){
 // Independent count-state graph. Keep one route to each count state, rather
 // than enumerating equivalent action permutations.
 const queue=[{p:Math.floor(n/d),l:n%d,s:0,path:[]}],seen=new Set();
 for(let i=0;i<queue.length;i++){
  const v=queue[i],k=key(v.p,v.l,v.s);
  if(seen.has(k))continue;
  seen.add(k);states++;
  const work={caseId:id,history:v.path},before=JSON.stringify(work),m=orderModel(work);
  assert(m);assert.equal(count(m),k);inventory(m,n,d);
  assert.equal(m.finalWhole,Math.floor((n-t)/d));assert.equal(m.finalRemainder,(n-t)%d);
  assert.equal(m.needed,t-v.s);assert.equal(m.complete,v.s===t);assert.equal(m.canUndo,v.path.length>0);
  const candidates={open:v.s<t&&v.p>0?{p:v.p-1,l:v.l+d,s:v.s}:null,
   whole:v.s<t&&v.p>0&&t-v.s>=d?{p:v.p-1,l:v.l,s:v.s+d}:null,
   piece:v.s<t&&v.l>0?{p:v.p,l:v.l-1,s:v.s+1}:null};
  assert.equal(m.canOpen,!!candidates.open);assert.equal(m.canWhole,!!candidates.whole);assert.equal(m.canPiece,!!candidates.piece);
  for(const [action,next] of Object.entries(candidates)){
   const result=changeOrder(work,action);
   if(!next){assert.equal(result,null);continue;}
   edges++;assert(result);const after=orderModel(result);
   assert.equal(count(after),key(next.p,next.l,next.s));inventory(after,n,d);
   assert.deepEqual(changeOrder(result,'undo'),work);
   assert.deepEqual(orderModel(changeOrder(result,'undo')),m);
   if(action==='open'){
    assert.deepEqual(after.loose,[...m.bundles.at(-1),...m.loose]);assert.deepEqual(after.sent,m.sent);
   }else if(action==='whole')assert.deepEqual(after.sent,[...m.sent,...m.bundles.at(-1)]);
   else assert.deepEqual(after.sent,[...m.sent,m.loose[0]]);
   queue.push({...next,path:[...v.path,action]});
  }
  assert.equal(JSON.stringify(work),before);
  assert.equal(changeOrder(work,'unknown'),null);
  assert.equal(orderExplanation(work).text.includes(`${n-t}/${d}`),true);
  assert.equal(orderExplanation(work).spokenText.includes('undefined'),false);
  assert.deepEqual(orderGuidance(work),m.guidance);
  if(m.complete){assert.equal(m.remaining,n-t);assert.deepEqual(m.guidance.length,1);}
  // Models and their nested material/history are fresh, including on replay.
  m.bundles[0]?.push(999);m.loose.push(999);m.sent.push(999);m.history.push('bad');m.guidance.push('bad');
  inventory(orderModel(work),n,d);assert.deepEqual(orderModel(work).history,v.path);
 }
 assert([...seen].some(k=>Number(k.split(',')[2])===t));
}
function run(id,actions){let work=createOrder(id);for(const a of actions){work=changeOrder(work,a);assert(work);}return orderModel(work);}
// Sending existing loose pieces before opening changes the actual ID order.
const routeA=run('quarters-gathering',['whole','open','piece','piece','piece']);
const routeB=run('quarters-gathering',['piece','whole','open','piece','piece']);
assert(routeA.complete&&routeB.complete);assert.equal(routeA.remaining,10);assert.equal(routeB.remaining,10);
assert.notDeepEqual(routeA.sent,routeB.sent);
assert.equal(run('quarters-without-trade',['whole','whole','whole','piece','piece','piece']).remaining,8);
assert.equal(run('quarters-without-trade',['whole','whole','whole','piece','piece','piece']).finalRemainder,0);
assert.equal(run('fifths-crossing',['open','piece','piece','piece','piece']).finalWhole,0);
assert.equal(run('all-ribbon',['whole','piece']).remaining,0);
const zero=orderModel(createOrder('no-order'));assert(zero.complete&&!zero.canOpen&&!zero.canWhole&&!zero.canPiece&&!zero.canUndo);
for(const bad of [null,{},[],{caseId:'unknown',history:[]},{caseId:expected[0][0],history:'open'},
 {caseId:expected[0][0],history:['piece','piece']},{caseId:expected[0][0],history:['undo']},
 {caseId:expected[0][0],history:['bad']},{caseId:expected[0][0],history:new Array(1)},
 {caseId:'no-order',history:['open']},{caseId:expected[0][0],history:[],extra:0}]){
 assert.equal(orderModel(bad),null);assert.equal(changeOrder(bad,'open'),null);assert.equal(orderExplanation(bad),null);
}
assert.equal(changeOrder(createOrder(),'undo'),null);assert.equal(createOrder('unknown'),null);
const frames=[[2,1,0],[1,5,0],[1,4,1],[1,3,2],[1,2,3],[1,2,3]];
frames.forEach(([p,l,s],frame)=>{
 const m=orderExample(frame);assert.equal(count(m),key(p,l,s));inventory(m,9,4);assert.equal(m.frame,frame);
 assert.equal(Object.hasOwn(m,'caseId'),false);assert.equal(orderModel(m),null);assert.equal(changeOrder(m,'piece'),null);
 assert.equal(m.remaining,9-s);assert.equal(m.text.length>0,true);assert.equal(m.spokenText.length>0,true);
 assert.deepEqual(m.claim,frame===5?{numerator:10,denominator:4}:null);
 m.loose.push(999);inventory(orderExample(frame),9,4);
});
for(const frame of [-1,6,0.5,'1',null])assert.equal(orderExample(frame),null);
assert.notEqual(orderExample(5).claim.numerator,orderExample(5).remaining);
console.log(`Ribbon Orders: ${states} reachable count states and ${edges} edges, IDs, undo, routes, boundaries and six frames passed.`);

// One piece can be sent, or be all that remains, before the order is finished.
const oneSent={caseId:'all-ribbon',history:['piece']};
assert.match(orderExplanation(oneSent).text,/Current material: 1 piece sent;/);
const oneLeft={caseId:'all-ribbon',history:['open','piece','piece','piece','piece']};
assert.match(orderModel(oneLeft).readout,/1 piece stays on the rack/);
assert.match(orderExplanation(oneLeft).spokenText,/one piece on the rack/);
