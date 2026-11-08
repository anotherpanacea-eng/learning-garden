import assert from 'node:assert/strict';
import {wholeCases,wholeCopy} from '../dist/whole-bundles-content.mjs';
import {wholeCase,createWhole,wholeModel,changeWhole,wholeNames,wholeExample} from '../dist/whole-bundles-core.mjs';

// Independent stock and endpoint oracle: neither the case catalog nor the
// implementation's material builder supplies the expected arithmetic.
const stock=[
 ['seven-quarters',7,4,0,1,3],['eleven-quarters',11,4,0,2,3],
 ['three-and-two-fifths',17,5,3,3,2],['two-and-one-eighth',17,8,2,2,1],
 ['five-fifths',5,5,0,1,0],['two-thirds',2,3,0,0,2],
 ['zero-quarters',0,4,0,0,0],['two-wholes-thirds',6,3,2,2,0]
];
function checkMaterial(m,n,d,initial,p,q,r){
 assert.ok(m);
 assert.equal(m.numerator,n);assert.equal(m.denominator,d);assert.equal(m.initialPacked,initial);
 assert.equal(m.packed,p);assert.equal(m.loose,n-p*d);assert.equal(m.totalPieces,n);
 assert.equal(m.unitSize,1/d);assert.equal(m.canonicalWhole,q);assert.equal(m.canonicalRemainder,r);
 assert.equal(m.canBundle,n-p*d>=d);assert.equal(m.canOpen,p>0);
 assert.equal(p*d+m.loose,n);assert.equal(q*d+r,n);
 assert.equal(m.rows.length,n===0?1:Math.ceil(n/d));
 const ids=[];
 for(let j=0;j<m.rows.length;j++){
  const row=m.rows[j],expectedIds=[];
  for(let id=j*d;id<(j+1)*d&&id<n;id++)expectedIds.push(id);
  assert.deepEqual(row,{index:j,start:j,end:j+1,pieceIds:expectedIds,bundled:j<p,filled:expectedIds.length});
  assert.ok(row.filled<=d);
  // Every piece occupies the same unit width in a one-whole row. Bundling
  // changes the role of complete rows, never these coordinates or IDs.
  for(let slot=0;slot<row.filled;slot++){
   const left=48+504*slot/d,right=48+504*(slot+1)/d;
   assert.ok(left>=48&&right<=552);
   assert.ok(Math.abs((right-left)/504-m.unitSize)<1e-12);
  }
  ids.push(...row.pieceIds);
 }
 assert.deepEqual(ids,Array.from({length:n},(_,id)=>id));
 const lastRow=n===0?0:Math.ceil(n/d)-1;
 assert.deepEqual(m.flag,{row:lastRow,x:48+504*(n-lastRow*d)/d});
 if(n&&n%d===0)assert.equal(m.flag.x,552,'whole amounts end on their last full row');
}
assert.deepEqual(wholeCases.map(c=>c.id),stock.map(s=>s[0]));
assert.ok(Object.isFrozen(wholeCases)&&wholeCases.every(Object.isFrozen));
assert.ok(Object.isFrozen(wholeCopy)&&Object.isFrozen(wholeCopy.frames)&&Object.isFrozen(wholeCopy.frameSpeech));
assert.equal(wholeCopy.frames.length,6);assert.equal(wholeCopy.frameSpeech.length,6);
let states=0,edges=0;
for(const [id,n,d,initial,q,r] of stock){
 const c=wholeCase(id);
 assert.equal(c.numerator,n);assert.equal(c.denominator,d);assert.equal(c.initialPacked,initial);
 assert.ok(c.title&&c.sourceWords);assert.ok(c.sourceNumeral===null||typeof c.sourceNumeral==='string');
 assert.deepEqual(createWhole(id),{caseId:id,packed:initial});
 if(initial&&r){
  assert.equal(c.sourceNumeral,`${initial} ${r}/${d}`);
  assert.doesNotMatch(c.sourceWords,/\d/,'mixed start words do not disclose adjacent numerals');
 }
 for(let p=0;p<=q;p++){
  states++;
  const work=Object.freeze({caseId:id,packed:p}),before=structuredClone(work),m=wholeModel(work);
  assert.equal(m.caseId,id);checkMaterial(m,n,d,initial,p,q,r);
  const names=wholeNames(work);
  assert.equal(names.whole,q);assert.equal(names.remainder,r);
  assert.equal(names.numerator,n);assert.equal(names.denominator,d);
  assert.equal(names.mixedLabel,q>0&&r>0?`${q} ${r}/${d}`:null);
  assert.ok(names.text.includes(`${n}/${d}`),'original denominator retained in the name');
  assert.ok(names.text.includes(`${p} × ${d} + ${n-p*d} = ${n}`),'current decomposition is distinct from canonical q/r');
  assert.match(names.spokenText,/plus/,'finite equation has authored operator speech');
  assert.doesNotMatch(names.spokenText,/\d+ \d+\/\d+/,'mixed numeral is not read as adjacent numbers');
  if(n===0){assert.match(names.text,/0\/4 = 0/);assert.equal(names.mixedLabel,null);}
  if(q===0&&r>0){assert.match(names.text,/less than one whole/);assert.equal(names.mixedLabel,null);}
  if(n>0&&r===0){assert.ok(names.text.includes(`${n}/${d} = ${q}`));assert.equal(names.mixedLabel,null);}
  for(const [action,delta,inverse] of [['bundle',1,'open'],['open',-1,'bundle']]){
   const changed=changeWhole(work,action),next=p+delta;
   if(next<0||next>q)assert.equal(changed,null);
   else{
    edges++;
    assert.deepEqual(changed,{caseId:id,packed:next});assert.notStrictEqual(changed,work);
    const moved=wholeModel(changed);checkMaterial(moved,n,d,initial,next,q,r);
    assert.equal((moved.packed*d+moved.loose)*d,n*d,'rational amount conserved');
    assert.deepEqual(changeWhole(changed,inverse),work,'each directed edge has an exact inverse');
    assert.deepEqual(moved.flag,m.flag);
    assert.deepEqual(moved.rows.map(row=>row.pieceIds),m.rows.map(row=>row.pieceIds));
   }
  }
  assert.deepEqual(work,before);
  // A caller can alter a returned diagram without changing later reads.
  m.rows[0].pieceIds.push(999);m.rows[0].filled=99;m.flag.x=-1;
  checkMaterial(wholeModel(work),n,d,initial,p,q,r);
 }
 let work=createWhole(id);
 while(wholeModel(work).canBundle)work=changeWhole(work,'bundle');
 assert.equal(work.packed,q);
 while(wholeModel(work).canOpen)work=changeWhole(work,'open');
 assert.equal(work.packed,0);
 while(work.packed<initial)work=changeWhole(work,'bundle');
 assert.deepEqual(work,createWhole(id),'both endpoints reachable and initial direction reversible');
}
assert.equal(states,19);assert.equal(edges,22);
const noncanonical=wholeModel({caseId:'eleven-quarters',packed:1});
assert.deepEqual([noncanonical.packed,noncanonical.loose,noncanonical.canonicalWhole,noncanonical.canonicalRemainder],[1,7,2,3]);
assert.equal(noncanonical.canBundle,true);
const malformed=[null,undefined,{},[],['seven-quarters',0],'seven-quarters',1,
 {caseId:'unknown',packed:0},{caseId:'seven-quarters'},
 ...[-1,2,0.5,'0',null,undefined,NaN,Infinity,-Infinity].map(packed=>({caseId:'seven-quarters',packed})),
 {caseId:'zero-quarters',packed:1},{caseId:'two-thirds',packed:1},wholeExample(0)];
for(const bad of malformed){
 assert.equal(wholeModel(bad),null);assert.equal(wholeNames(bad),null);
 for(const action of ['bundle','open','bad'])assert.equal(changeWhole(bad,action),null);
}
for(const id of ['unknown',undefined,null,0,{}]){assert.equal(wholeCase(id),null);assert.equal(createWhole(id),null);}
for(const action of ['bad','',null,undefined,0,{},'Bundle'])assert.equal(changeWhole(createWhole('eleven-quarters'),action),null);
for(const frame of [-1,6,0.5,'0',null,undefined,NaN,Infinity])assert.equal(wholeExample(frame),null);
for(const [frame,p] of [0,1,2,1,0,2].entries()){
 const example=wholeExample(frame);
 checkMaterial(example,7,3,0,p,2,1);
 assert.equal(example.caseId,undefined);assert.equal(example.frame,frame);
 assert.ok(example.text&&example.spokenText);
 assert.equal(wholeModel(example),null);assert.equal(changeWhole(example,'bundle'),null);assert.equal(changeWhole(example,'open'),null);
 assert.deepEqual(example.claim,frame===5?{numerator:3,denominator:3}:null);
 if(frame===5){
  assert.notEqual(example.claim.numerator*3,7*example.claim.denominator,'different claim does not equal reference');
  assert.equal(example.claim.numerator,example.claim.denominator,'claim names one whole');
  assert.match(example.spokenText,/as though two plus one equals three thirds/,'authored false-claim speech expands grouped units');
  example.claim.numerator=99;assert.equal(wholeExample(frame).claim.numerator,3);
 }
 if(frame===4)assert.match(example.spokenText,/times three, plus one/);
 example.rows[0].pieceIds.push(999);assert.equal(wholeExample(frame).rows[0].pieceIds.length,3);
}
console.log('Wholes and Pieces: all 19 states, 22 directed edges, conserved units, diagrams, names, refusals and six isolated examples passed.');
