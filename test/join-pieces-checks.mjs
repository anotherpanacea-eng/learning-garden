import assert from 'node:assert/strict';
import {commonCases,createCommonPair} from '../dist/common-cuts-core.mjs';
import {joinCases,createJoin,joinModel,changeJoin,joinExample} from '../dist/join-pieces-core.mjs';

// Independent fraction inputs and arithmetic: expected values never come from
// the parent or joining model. Enumerate cut histories, not just denominators.
const sources=[['half-and-third',1,2,1,3],['equal-banners',2,3,4,6],['quarter-third',3,4,2,3],['sixth-quarter',5,6,3,4],['quarter-and-third',1,4,1,3]];
const product=h=>h.reduce((p,f)=>p*f,1);
function histories(d,h=[]){return [h,...[2,3].filter(f=>d*f<=12).flatMap(f=>histories(d*f,[...h,f]))];}
function cutState(id,a,b){
 let state=createJoin(id);
 for(const [side,history] of [['left',a],['right',b]])for(const factor of history)state=changeJoin(state,'split',side,factor);
 return state;
}
function freeze(value){if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;}
function check(state,source,aHistory,bHistory,sequence){
 const [id,an,ad,bn,bd]=source,aDen=ad*product(aHistory),bDen=bd*product(bHistory),aNum=an*product(aHistory),bNum=bn*product(bHistory);
 const aMoved=sequence.filter(x=>x==='A').length,bMoved=sequence.filter(x=>x==='B').length,matched=aDen===bDen;
 const before=structuredClone(state),m=joinModel(state);
 assert.ok(m);assert.equal(m.caseId,id);assert.equal(m.matched,matched);assert.equal(m.denominator,matched?aDen:null);
 assert.equal(m.count,sequence.length);assert.deepEqual(m.sequence,sequence);
 assert.equal(m.fullNumerator,matched?aNum+bNum:null);
 assert.equal(m.complete,matched&&aMoved===aNum&&bMoved===bNum);
 assert.equal(m.wholeCount,matched?Math.floor(sequence.length/aDen):0);
 assert.equal(m.remainder,matched?sequence.length%aDen:0);
 for(const [row,n,d,num,den,moved,history] of [[m.left,an,ad,aNum,aDen,aMoved,aHistory],[m.right,bn,bd,bNum,bDen,bMoved,bHistory]]){
  assert.equal(row.originalNumerator,n);assert.equal(row.originalDenominator,d);
  assert.equal(row.numerator,num);assert.equal(row.denominator,den);
  assert.equal(row.moved,moved);assert.equal(row.remaining,num-moved);assert.equal(row.remaining+row.moved,num);
  assert.equal(row.numerator*d,n*row.denominator,'cutting preserves rational amount');
  assert.equal(row.endpoint*d,72*n);assert.equal(row.whole,72);assert.deepEqual(row.history,history);
 }
 if(matched){
  assert.equal((m.left.remaining+m.right.remaining+m.count)*ad*bd,(an*bd+bn*ad)*aDen,'available plus output conserves original sum');
  assert.equal(m.fullNumerator*ad*bd,(an*bd+bn*ad)*aDen,'full sum is exact at chosen denominator');
 }
 assert.deepEqual(state,before,'reading a model preserves state');
 return m;
}
assert.strictEqual(joinCases,commonCases,'reuse actual catalogue');
assert.equal(createJoin('unknown'),null);
const seenUnits=new Map();
for(const source of sources){
 const [id,an,ad,bn,bd]=source;
 assert.deepEqual(createJoin(id),{pair:createCommonPair(id),moves:[]});
 for(const aHistory of histories(ad))for(const bHistory of histories(bd)){
  const base=freeze(cutState(id,aHistory,bHistory)),before=structuredClone(base);
  const aDen=ad*product(aHistory),bDen=bd*product(bHistory),aNum=an*product(aHistory),bNum=bn*product(bHistory);
  check(base,source,aHistory,bHistory,[]);
  assert.equal(changeJoin(base,'undo'),null);assert.equal(changeJoin(base,'return'),null);
  for(const [side,den,history] of [['left',aDen,aHistory],['right',bDen,bHistory]]){
   for(const factor of [2,3]){
    const next=changeJoin(base,'split',side,factor);
    if(den*factor>12){assert.equal(next,null);continue;}
    assert.notStrictEqual(next,base);
    const ah=side==='left'?[...aHistory,factor]:aHistory,bh=side==='right'?[...bHistory,factor]:bHistory;
    check(next,source,ah,bh,[]);
    const back=changeJoin(next,'uncut',side);
    check(back,source,aHistory,bHistory,[]);
   }
   const uncut=changeJoin(base,'uncut',side);
   if(!history.length)assert.equal(uncut,null);
   else check(uncut,source,side==='left'?aHistory.slice(0,-1):aHistory,side==='right'?bHistory.slice(0,-1):bHistory,[]);
  }
  if(aDen!==bDen){
   assert.equal(changeJoin(base,'move','left'),null);assert.equal(changeJoin(base,'move','right'),null);
   assert.equal(joinModel({...base,moves:['A']}),null);
  }else{
   if(!seenUnits.has(id))seenUnits.set(id,new Set());seenUnits.get(id).add(aDen);
   // Every reachable transfer-count pair; each available outgoing move, undo
   // and return must conserve exactly the independent rational quantity.
   for(let a=0;a<=aNum;a++)for(let b=0;b<=bNum;b++){
    const sequence=[...Array(a).fill('A'),...Array(b).fill('B')],state=freeze({pair:base.pair,moves:sequence});
    const snapshot=structuredClone(state);
    check(state,source,aHistory,bHistory,sequence);
    for(const [side,code,moved,limit] of [['left','A',a,aNum],['right','B',b,bNum]]){
     const next=changeJoin(state,'move',side);
     if(moved===limit)assert.equal(next,null,'empty tray refuses move');
     else{check(next,source,aHistory,bHistory,[...sequence,code]);assert.notStrictEqual(next.pair,state.pair);assert.deepEqual(changeJoin(next,'undo'),state);}
     if(sequence.length){assert.equal(changeJoin(state,'split',side,2),null);assert.equal(changeJoin(state,'split',side,3),null);assert.equal(changeJoin(state,'uncut',side),null);}
    }
    if(sequence.length){
     const undo=changeJoin(state,'undo');check(undo,source,aHistory,bHistory,sequence.slice(0,-1));
     assert.deepEqual(changeJoin(state,'return'),base,'return restores both recut trays');
    }
    assert.deepEqual(state,snapshot);
   }
   // All-A-first, all-B-first and alternating orders exercise real transitions
   // and complete reversal, including a whole boundary before completion.
   const alternating=[];for(let i=0;i<Math.max(aNum,bNum);i++){if(i<aNum)alternating.push('A');if(i<bNum)alternating.push('B');}
   for(const sequence of [[...Array(aNum).fill('A'),...Array(bNum).fill('B')],[...Array(bNum).fill('B'),...Array(aNum).fill('A')],alternating]){
    let state=base;
    for(let i=0;i<sequence.length;i++){
     state=changeJoin(state,'move',sequence[i]==='A'?'left':'right');
     const m=check(state,source,aHistory,bHistory,sequence.slice(0,i+1));
     if(i+1===aDen){assert.equal(m.wholeCount,1);assert.equal(m.remainder,0);}
     if(i+1===aDen+1){assert.equal(m.wholeCount,1);assert.equal(m.remainder,1);}
    }
    assert.equal(joinModel(state).complete,true);assert.deepEqual(changeJoin(state,'return'),base);
    for(let i=sequence.length-1;i>=0;i--){state=changeJoin(state,'undo');check(state,source,aHistory,bHistory,sequence.slice(0,i));}
    assert.deepEqual(state,base,'reverse every transfer recovers exact cuts');
   }
  }
  assert.deepEqual(base,before,'actions accept frozen inputs without mutation');
 }
}
for(const id of ['half-and-third','equal-banners'])assert.deepEqual([...seenUnits.get(id)].sort((a,b)=>a-b),[6,12]);
const initial=createJoin('half-and-third'),matched=cutState('half-and-third',[3],[2]);
const corruptPairs=[null,{}, {...initial.pair,caseId:'unknown'}, {...initial.pair,left:{history:[5],lastAction:null}}, {...initial.pair,left:{history:[2],lastAction:null}}, {...initial.pair,right:{history:[3,3],lastAction:{type:'split',factor:3}}}];
const badStates=[null,undefined,{},'bad',...corruptPairs.map(pair=>({pair,moves:[]})),{pair:initial.pair},{...initial,moves:{}},{...initial,moves:'A'}, {...matched,moves:['C']},{...matched,moves:[null]},{...matched,moves:Array(1)},{...matched,moves:Array(4).fill('A')},{...matched,moves:Array(3).fill('B')},{...initial,moves:['A']}];
for(const bad of badStates){
 assert.equal(joinModel(bad),null);
 for(const action of ['split','uncut','move','undo','return'])assert.equal(changeJoin(bad,action,'left',2),null);
}
for(const side of ['A','rightish',null,0,undefined])for(const action of ['split','uncut','move'])assert.equal(changeJoin(matched,action,side,2),null);
for(const factor of [0,1,4,'2',null,undefined,NaN,Infinity])assert.equal(changeJoin(initial,'split','left',factor),null);
for(const action of ['wrong','',null,undefined])assert.equal(changeJoin(matched,action,'left',2),null);
// Returned models and states own their mutable arrays/rows.
const model=joinModel(matched);model.sequence.push('A');model.left.history.push(3);model.left.lastAction.factor=99;
assert.deepEqual(matched,cutState('half-and-third',[3],[2]));
const moved=changeJoin(matched,'move','left');moved.pair.left.history.push(2);moved.pair.right.lastAction.factor=99;
assert.deepEqual(matched,cutState('half-and-third',[3],[2]));
const frames=Array.from({length:5},(_,i)=>joinExample(i));
assert.deepEqual(frames.map(m=>[m.left.numerator,m.left.denominator,m.right.numerator,m.right.denominator,m.sequence]),[
 [1,2,1,4,[]],[2,4,1,4,[]],[2,4,1,4,['A','A']],[2,4,1,4,['A','A','B']],[2,4,1,4,['A','A','B']]
]);
for(const [i,m] of frames.entries()){
 assert.equal(m.frame,i);assert.equal(m.caseId,undefined);assert.equal(m.matched,i>0);
 assert.equal(m.count,i<2?0:i===2?2:3);assert.equal(m.complete,i>=3);
 assert.equal(m.left.endpoint,36);assert.equal(m.right.endpoint,18);assert.equal(m.left.whole,m.right.whole);
 assert.equal(m.left.remaining+m.left.moved,m.left.numerator);assert.equal(m.right.remaining+m.right.moved,m.right.numerator);
 assert.equal(joinModel(m),null);for(const action of ['move','split','uncut','undo','return'])assert.equal(changeJoin(m,action,'left',2),null);
}
assert.deepEqual(frames[4].wrongClaim,{numerator:2,denominator:6});
assert.ok(2*2<6,'false claim is shorter than original half');assert.ok(2*4<3*6,'false claim is shorter than joined three quarters');
assert.equal(frames[0].fullNumerator,null);assert.equal(frames[1].fullNumerator,3);
assert.equal(frames[2].left.remaining,0);assert.equal(frames[2].right.remaining,1);assert.equal(frames[3].right.remaining,0);
for(const frame of [-1,5,0.5,'1',null,undefined,NaN])assert.equal(joinExample(frame),null);
frames[4].sequence.push('A');frames[4].left.history.push(3);assert.equal(joinExample(4).count,3);assert.deepEqual(joinExample(4).left.history,[2]);
assert.deepEqual(initial,createJoin('half-and-third'),'separate examples never change live work');
console.log('Join the Pieces: exhaustive recuts and transfer counts, conservation, reversals, refusals and separate teaching frames passed.');
