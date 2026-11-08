import assert from 'node:assert/strict';
import {groupCases,groupCopy} from '../dist/group-pieces-content.mjs';
import {groupCase,createGroup,groupModel,previewGroup,applyGroup,undoGroup,compareGroup,groupExample} from '../dist/group-pieces-core.mjs';

// Authored starting counts and integer group construction are the oracle, not
// the model's returned counts or its list of candidate factors.
const cases=[
 ['six-eighths',6,8],['eighteen-twentyfourths',18,24],['fourteen-twentyfirsts',14,21],
 ['five-twelfths',5,12],['zero-twelfths',0,12],['whole-twelfths',12,12]
];
const partition=(count,size)=>{let groups=0,left=count;while(left>=size){groups++;left-=size;}return {groups,left};};
const copy=value=>JSON.parse(JSON.stringify(value));
assert.deepEqual(groupCases.map(c=>[c.id,c.numerator,c.denominator]),cases);
assert.ok(Object.isFrozen(groupCases)&&groupCases.every(Object.isFrozen));
assert.ok(Object.isFrozen(groupCopy)&&Object.isFrozen(groupCopy.frames));
assert.equal(groupCopy.frames.length,6);
assert.ok(['story','instruction','visit','grownUp'].every(key=>typeof groupCopy[key]==='string'&&groupCopy[key].length>0));
let histories=0,previews=0;
for(const [id,n0,d0] of cases){
 assert.equal(groupCase(id),groupCases.find(c=>c.id===id));
 assert.deepEqual(createGroup(id),{caseId:id,history:[]});
 function visit(history,n,d){
  histories++;
  const work=Object.freeze({caseId:id,history:Object.freeze([...history])});
  const original=copy(work),product=history.reduce((a,b)=>a*b,1);
  const expectedSizes=Array.from({length:d-1},(_,i)=>i+2);
  assert.deepEqual(groupModel(work),{caseId:id,numerator:n,denominator:d,originalNumerator:n0,originalDenominator:d0,
   history,originalPiecesPerCurrent:product,canUndo:history.length>0,groupSizes:expectedSizes});
  assert.equal(n*d0,n0*d,'every history keeps the original endpoint');
  assert.equal(d*product,d0);
  assert.equal(n*product,n0);
  let smallest=null;
  for(let size=2;size<=d;size++){
   previews++;
   const whole=partition(d,size),colored=partition(n,size),fits=whole.left===0&&colored.left===0;
   if(fits&&smallest===null)smallest=size;
   assert.deepEqual(previewGroup(work,size),{factor:size,wholeGroups:whole.groups,wholeRemainder:whole.left,
    coloredGroups:colored.groups,coloredRemainder:colored.left,fits,
    nextNumerator:fits?colored.groups:null,nextDenominator:fits?whole.groups:null});
   const next=applyGroup(work,size);
   if(fits){
    assert.deepEqual(next,{caseId:id,history:[...history,size]});
    assert.ok(whole.groups<d,'every successful grouping strictly reduces the denominator');
    assert.equal(colored.groups*d,n*whole.groups,'grouping preserves the amount');
    assert.deepEqual(undoGroup(next),work,'undo returns exactly one history step');
    visit([...history,size],colored.groups,whole.groups);
   }else assert.equal(next,null,'incomplete groups cannot be applied');
  }
  const comparison=compareGroup(work);
  assert.equal(comparison.suggestedFactor,smallest);
  assert.equal(comparison.simplest,smallest===null);
  assert.ok(comparison.text.includes(`${n0}/${d0}`)&&comparison.text.includes(`${n}/${d}`));
  if(d===1)assert.ok(comparison.text.includes(n===0?'0/1 = 0':'1/1 = one whole'));
  else if(smallest===null)assert.ok(comparison.text.includes(`from 2 to ${d}`)&&comparison.text.includes(`both ${n} and ${d}`),'simplest name has a finite divisibility justification');
  else assert.ok(comparison.text.includes(`Group size ${smallest}`)&&comparison.text.includes(`of ${n} and ${d}`));
  assert.deepEqual(undoGroup(work),history.length?{caseId:id,history:history.slice(0,-1)}:null);
  for(const bad of [null,undefined,0,1,-2,1.5,d+1,'2',NaN,Infinity,[],{}]){
   assert.equal(previewGroup(work,bad),null);
   assert.equal(applyGroup(work,bad),null);
  }
  assert.deepEqual(work,original,'preview, comparison, application and undo never mutate work');
  const detached=groupModel(work);detached.history.push(99);detached.groupSizes.length=0;
  assert.deepEqual(work,original,'model arrays do not alias work');
 }
 visit([],n0,d0);
}
assert.equal(histories,43,'all independently reachable histories covered');
assert.equal(previews,145,'every candidate preview of every reachable history covered');

// Different routes retain their own undo steps while reaching the same fraction.
for(const route of [[2,3],[3,2],[6]]){
 const work={caseId:'eighteen-twentyfourths',history:route};
 assert.deepEqual([groupModel(work).numerator,groupModel(work).denominator],[3,4]);
}
assert.equal(compareGroup({caseId:'eighteen-twentyfourths',history:[2]}).simplest,false,'9/12 is simpler, but not simplest');
assert.deepEqual([groupModel(applyGroup(createGroup('fourteen-twentyfirsts'),7)).numerator,
 groupModel(applyGroup(createGroup('fourteen-twentyfirsts'),7)).denominator],[2,3]);
const badWork=[null,undefined,[],{},'six-eighths',{caseId:'missing',history:[]},
 {caseId:'six-eighths',history:null},{caseId:'six-eighths',history:'2'},
 ...[[1],[0],[-2],[2.5],['2'],[3],[4],[9],[2,2],[2,2,2],Array(3)].map(history=>({caseId:'six-eighths',history}))];
for(const work of badWork){
 const before=structuredClone(work);
 for(const fn of [groupModel,compareGroup,undoGroup])assert.equal(fn(work),null);
 assert.equal(previewGroup(work,2),null);assert.equal(applyGroup(work,2),null);
 assert.deepEqual(work,before,'invalid work remains untouched');
}
for(const id of [undefined,null,0,{},'missing']){assert.equal(groupCase(id),null);assert.equal(createGroup(id),null);}
const fresh=createGroup('six-eighths');fresh.history.push(2);
assert.deepEqual(createGroup('six-eighths').history,[],'fresh work does not share a history');

const exampleExpected=[
 [6,9,null,null,false],[6,9,3,[3,0,2,0,true,2,3],false],
 [2,3,3,null,false],[6,9,2,[4,1,3,0,false,null,null],false],
 [6,9,9,[1,0,0,6,false,null,null],false],[3,6,null,null,true]
];
const live={caseId:'eighteen-twentyfourths',history:[2]},before=copy(live),livePreview=previewGroup(live,3);
for(let frame=0;frame<6;frame++){
 const [n,d,factor,p,changed]=exampleExpected[frame],e=groupExample(frame);
 assert.deepEqual([e.frame,e.originalNumerator,e.originalDenominator,e.numerator,e.denominator,e.factor,e.changedAmount],[frame,6,9,n,d,factor,changed]);
 assert.equal(typeof e.text,'string');assert.ok(e.text.length>0);
 assert.equal('caseId' in e,false);assert.equal(applyGroup(e,3),null);
 assert.deepEqual(e.preview,p?{factor,wholeGroups:p[0],wholeRemainder:p[1],coloredGroups:p[2],coloredRemainder:p[3],fits:p[4],nextNumerator:p[5],nextDenominator:p[6]}:null);
 assert.equal(n*9===6*d,!changed,'only the subtraction contrast changes the endpoint');
 e.numerator=99;if(e.preview)e.preview.coloredGroups=99;
 assert.equal(groupExample(frame).numerator,n,'example values do not share mutable frames');
}
assert.equal(previewGroup(createGroup('zero-twelfths'),12).fits,true,'zero colored groups leave no pieces');
assert.equal(groupExample(4).preview.fits,false,'zero complete colored groups can still leave six colored pieces');
assert.deepEqual(live,before);assert.deepEqual(previewGroup(live,3),livePreview,'separate example preserves live preview');
for(const frame of [-1,6,0.5,'1',null,undefined,NaN,Infinity])assert.equal(groupExample(frame),null);
console.log(`Group Pieces: ${histories} reachable histories and ${previews} previews passed, including invalid inputs and six separate examples.`);
