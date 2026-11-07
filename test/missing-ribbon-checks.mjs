import assert from 'node:assert/strict';
import {joinCases} from '../dist/join-pieces-core.mjs';
import {createCommonPair} from '../dist/common-cuts-core.mjs';
import {missingCases,createMissing,missingModel,changeMissing,missingExample} from '../dist/missing-ribbon-core.mjs';

// Independent authored inputs and rational cross-products, rather than model
// values, supply the arithmetic oracle. Every valid cut history is visited.
const sources=[['half-and-third',1,2,1,3],['equal-banners',2,3,4,6],['quarter-third',3,4,2,3],['sixth-quarter',5,6,3,4],['quarter-and-third',1,4,1,3]];
const product=h=>h.reduce((p,f)=>p*f,1);
function histories(d,h=[]){return [h,...[2,3].filter(f=>d*f<=12).flatMap(f=>histories(d*f,[...h,f]))];}
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
function stateAt(id,history,totalCuts=0){
 let s=createMissing(id);
 for(const f of history)s=changeMissing(s,'split-known',f);
 if(totalCuts)s=changeMissing(s,'split-total');
 return s;
}
function check(s,source,h,cuts,removed){
 const [id,an,ad,bn,bd]=source;
 // Search for the common unit independently of the implementation's gcd.
 let baseD=Math.max(ad,bd);while(baseD%ad||baseD%bd)baseD++;
 const d=baseD*(cuts?2:1),n=an*d/ad+bn*d/bd,kd=ad*product(h),kn=an*product(h),matched=d===kd;
 const snapshot=structuredClone(s),m=missingModel(s),unlocked=removed===0;
 assert.ok(m);assert.equal(m.caseId,id);
 assert.equal(m.originalTotalDenominator,baseD);assert.equal(m.originalTotalNumerator,an*baseD/ad+bn*baseD/bd);
 assert.equal(m.totalNumerator,n);assert.equal(m.totalDenominator,d);
 assert.equal(n*ad*bd,(an*bd+bn*ad)*d,'total preserves independent source sum');
 assert.equal(m.known.numerator,kn);assert.equal(m.known.denominator,kd);
 assert.equal(m.known.originalNumerator,an);assert.equal(m.known.originalDenominator,ad);
 assert.equal(m.known.numerator*ad,an*m.known.denominator);assert.equal(m.known.endpoint*ad,72*an);assert.equal(m.known.whole,72);
 assert.deepEqual(m.known.history,h);assert.equal(m.matched,matched);
 assert.equal(m.removed,removed);assert.equal(m.remaining,n-removed);assert.equal(m.remaining+m.removed,n);
 assert.equal(m.difference,matched?n-kn:null);assert.equal(m.complete,matched&&removed===kn);
 if(matched)assert.equal((n-kn)*bd,bn*d,'remaining requested difference equals independent second source');
 assert.equal(m.canSplitTotal,unlocked&&d*2<=12);assert.equal(m.canUndoTotal,unlocked&&cuts>0);
 assert.equal(m.canSplitKnown2,unlocked&&kd*2<=12);assert.equal(m.canSplitKnown3,unlocked&&kd*3<=12);
 assert.equal(m.canUndoKnown,unlocked&&h.length>0);assert.equal(m.canTake,matched&&removed<kn);
 assert.equal(m.canUndo,removed>0);assert.equal(m.canReturn,removed>0);
 assert.equal(m.right,undefined);assert.equal(m.pair,undefined);assert.equal(m.knownPair,undefined);
 assert.deepEqual(s,snapshot,'reading never changes input');
 return m;
}
assert.deepEqual(missingCases.map(c=>c.id),joinCases.map(c=>c.id));
assert.ok(Object.isFrozen(missingCases)&&missingCases.every(Object.isFrozen));
assert.equal(createMissing('unknown'),null);
const matchedUnits=new Map(),boundaries=new Set();
for(const source of sources){
 const [id,an,ad,bn,bd]=source;
 let baseD=Math.max(ad,bd);while(baseD%ad||baseD%bd)baseD++;
 assert.deepEqual(missingCases.find(c=>c.id===id),{id,totalNumerator:an*baseD/ad+bn*baseD/bd,totalDenominator:baseD,knownNumerator:an,knownDenominator:ad});
 assert.deepEqual(createMissing(id),{caseId:id,knownPair:createCommonPair(id),totalCuts:0,removed:0});
 for(const h of histories(ad))for(const cuts of baseD===6?[0,1]:[0]){
  const original=stateAt(id,h,cuts),kd=ad*product(h),kn=an*product(h),d=baseD*2**cuts;
  // Undo's visual last action is also a reachable row state at each history
  // that can be extended. Include it as well as the direct split history.
  const variants=[original];
  const nextFactor=[2,3].find(f=>kd*f<=12);
  if(nextFactor)variants.push(changeMissing(changeMissing(original,'split-known',nextFactor),'uncut-known'));
  for(const variant of variants){
   const base=freeze(variant),snapshot=structuredClone(base);
   check(base,source,h,cuts,0);
   for(const f of [2,3]){
    const split=changeMissing(base,'split-known',f);
    if(kd*f>12)assert.equal(split,null);
    else{check(split,source,[...h,f],cuts,0);check(changeMissing(split,'uncut-known'),source,h,cuts,0);assert.notStrictEqual(split.knownPair,base.knownPair);}
   }
   const uncut=changeMissing(base,'uncut-known');
   if(!h.length)assert.equal(uncut,null);else check(uncut,source,h.slice(0,-1),cuts,0);
   const totalSplit=changeMissing(base,'split-total');
   if(d*2>12)assert.equal(totalSplit,null);
   else{check(totalSplit,source,h,1,0);assert.deepEqual(changeMissing(totalSplit,'uncut-total'),base);}
   const totalUndo=changeMissing(base,'uncut-total');
   if(!cuts)assert.equal(totalUndo,null);else check(totalUndo,source,h,0,0);
   if(kd!==d){assert.equal(changeMissing(base,'take'),null);assert.equal(missingModel({...base,removed:1}),null);}
   else{
    if(!matchedUnits.has(id))matchedUnits.set(id,new Set());matchedUnits.get(id).add(d);
    for(let removed=0;removed<=kn;removed++){
     const state=freeze({...structuredClone(base),removed}),before=structuredClone(state),m=check(state,source,h,cuts,removed);
     if(m.remaining===d)boundaries.add('exact');else if(m.remaining===d+1)boundaries.add('above');else if(m.remaining===d-1)boundaries.add('below');
     const take=changeMissing(state,'take');
     if(removed===kn)assert.equal(take,null);
     else{check(take,source,h,cuts,removed+1);assert.notStrictEqual(take,state);assert.notStrictEqual(take.knownPair,state.knownPair);assert.notStrictEqual(take.knownPair.left.history,state.knownPair.left.history);assert.deepEqual(changeMissing(take,'undo'),state);}
     if(removed){
      check(changeMissing(state,'undo'),source,h,cuts,removed-1);assert.deepEqual(changeMissing(state,'return'),base);
      for(const action of ['split-known','uncut-known','split-total','uncut-total'])assert.equal(changeMissing(state,action,2),null,'cuts lock until all pieces return');
     }else{assert.equal(changeMissing(state,'undo'),null);assert.equal(changeMissing(state,'return'),null);}
     assert.deepEqual(state,before);
    }
    let live=base;
    for(let removed=1;removed<=kn;removed++){live=changeMissing(live,'take');check(live,source,h,cuts,removed);}
    assert.equal(missingModel(live).complete,true);
    for(let removed=kn-1;removed>=0;removed--){live=changeMissing(live,'undo');check(live,source,h,cuts,removed);}
    assert.deepEqual(live,base,'undo restores exact cut histories');
   }
   assert.deepEqual(base,snapshot,'frozen input survives every operation');
  }
 }
}
for(const id of ['half-and-third','equal-banners'])assert.deepEqual([...matchedUnits.get(id)].sort((a,b)=>a-b),[6,12]);
assert.deepEqual(boundaries,new Set(['above','exact','below']),'finite cases cross and land on a whole');
const initial=createMissing('half-and-third'),matched=stateAt('half-and-third',[3]);
const corrupt=[null,undefined,{},'bad',missingExample(0),{...initial,caseId:'unknown'},
 {...initial,knownPair:createCommonPair('equal-banners')},{...initial,knownPair:null},
 {...initial,knownPair:{...initial.knownPair,right:{history:[],lastAction:{type:'undo'}}}},
 {...initial,knownPair:{...initial.knownPair,right:{history:[2],lastAction:{type:'split',factor:2}}}},
 {...initial,knownPair:{...initial.knownPair,left:{history:[2],lastAction:null}}},
 {...initial,knownPair:{...initial.knownPair,left:{history:[2,2,2],lastAction:{type:'split',factor:2}}}},
 ...[-1,2,0.5,'0',null,undefined,NaN,Infinity].map(totalCuts=>({...initial,totalCuts})),
 {...createMissing('quarter-third'),totalCuts:1},
 ...[-1,0.5,4,'0',null,undefined,NaN,Infinity].map(removed=>({...matched,removed})),{...initial,removed:1}];
for(const bad of corrupt){
 assert.equal(missingModel(bad),null);
 for(const a of ['split-known','uncut-known','split-total','uncut-total','take','undo','return'])assert.equal(changeMissing(bad,a,2),null);
}
for(const factor of [0,1,4,'2',null,undefined,NaN,Infinity])assert.equal(changeMissing(initial,'split-known',factor),null);
for(const factor of [0,1,3,'2',null,NaN,Infinity])assert.equal(changeMissing(initial,'split-total',factor),null);
assert.deepEqual(changeMissing(initial,'split-total',2),changeMissing(initial,'split-total'));
for(const action of ['bad','',null,undefined])assert.equal(changeMissing(matched,action),null);
const model=missingModel(matched);model.known.history.push(2);model.known.lastAction.factor=99;
const changed=changeMissing(matched,'take');changed.knownPair.left.history.push(2);changed.knownPair.left.lastAction.factor=99;changed.knownPair.right.history.push(2);
assert.deepEqual(matched,stateAt('half-and-third',[3]),'returned arrays and action metadata are independent');
const frames=Array.from({length:5},(_,i)=>missingExample(i));
assert.deepEqual(frames.map(m=>[m.totalNumerator,m.totalDenominator,m.known.numerator,m.known.denominator,m.removed,m.remaining,m.complete]),[
 [3,4,1,2,0,3,false],[3,4,2,4,0,3,false],[3,4,2,4,1,2,false],[3,4,2,4,2,1,true],[3,4,2,4,2,1,true]
]);
for(const [i,m] of frames.entries()){
 assert.equal(m.frame,i);assert.equal(m.caseId,undefined);assert.equal(m.knownPair,undefined);
 assert.equal(m.originalTotalNumerator,3);assert.equal(m.originalTotalDenominator,4);
 assert.equal(m.known.originalNumerator,1);assert.equal(m.known.originalDenominator,2);assert.equal(m.known.endpoint,36);
 assert.equal(m.matched,i>0);assert.equal(m.difference,i>0?1:null);assert.equal(m.remaining+m.removed,3);
 assert.equal(missingModel(m),null);for(const a of ['split-known','uncut-known','split-total','uncut-total','take','undo','return'])assert.equal(changeMissing(m,a,2),null);
}
assert.deepEqual(frames[4].wrongClaim,{numerator:2,denominator:2});assert.ok(2*4>3*2,'false claim exceeds starting length');
frames[4].known.history.push(3);frames[4].wrongClaim.numerator=99;
assert.deepEqual(missingExample(4).known.history,[2]);assert.equal(missingExample(4).wrongClaim.numerator,2);
assert.deepEqual(initial,createMissing('half-and-third'));
for(const f of [-1,5,0.5,'1',null,undefined,NaN,Infinity])assert.equal(missingExample(f),null);
console.log('Find the Other Length: finite cut histories, separation counts, rational conservation, reversals, refusals and isolated examples passed.');
