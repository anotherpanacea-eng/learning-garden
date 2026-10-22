import assert from 'node:assert/strict';
import {configurations} from '../dist/workshop-core.mjs';
import {fairView,startFair,setFairPlan,setFairPage,setFairPrediction,setFairClaim,setFairNote,addFairSupport,revealFair,selectFairTrial,resumeFair,keepFair,designFor,evidenceFor,validFairInvestigation} from '../dist/fair-test-core.mjs';
let checks=0;
const eq=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
const ok=(a,message)=>{assert.ok(a,message);checks++;};
const copy=x=>structuredClone(x),round=x=>JSON.parse(JSON.stringify(x));
const current=s=>fairView(s).current;
const finish=s=>{for(const side of ['A','B'])for(let n=0;n<3;n++)revealFair(s,side);};

for(const mission of ['height','surface'])for(const a of configurations)for(const b of configurations){
 const state={},i=startFair(state,{mission,a:a.id,b:b.id});
 const changed=['height','surface'].filter(k=>a[k]!==b[k]);
 const expected=changed.length===0?'same':changed.length===2?'confounded':changed[0]===mission?'focused':'wrong-factor';
 eq(designFor(i),{code:expected,changed},'all 72 mission/setup pairs classified by factors');
 eq(evidenceFor(i).status,'missing','no comparison before observations');
 setFairPrediction(state,'B');
 for(const [n,side] of ['A','B','B','A','A','B'].entries()){
  const row=revealFair(state,side),c=side==='A'?a:b;
  eq(row.distance,c.distances[row.index-1],'current reveal uses exact authored value');
  eq(row.setup,c.id,'row attached to its setup');
  ok(validFairInvestigation(i),'each intermediate save is readable');
  eq(fairView(round(state)).current,i,'round trip preserves exact saved work');
  if(n===0)eq(evidenceFor(i).status,'missing','one side has no evidence');
  if(n===2)eq(evidenceFor(i).status,'unbalanced','unequal repeats invite balancing');
 }
 const before=copy(i);
 eq(revealFair(state,'A'),null,'no fourth A trial');eq(revealFair(state,'B'),null,'no fourth B trial');
 eq(i,before,'exhausted reveals do not mutate work');
 eq(evidenceFor(i).counts,{A:3,B:3},'three results per side');
 ok(selectFairTrial(state,'A',1),'replay first A');ok(selectFairTrial(state,'B',1),'replay first B');
 eq(i.selected,{side:'B',index:1},'same trial index retains side identity');
 eq(i.trials,before.trials,'replay adds no evidence');
 eq(i.predictionAfterResults,false,'prediction before trials retained');
 setFairPrediction(state,'A');setFairPrediction(state,null);
 eq(i.predictionAfterResults,true,'later changes and clearing cannot erase timing');
 for(const code of ['help','audio','together']){addFairSupport(state,code);addFairSupport(state,code);}
 eq(i.support,['help','audio','together'],'support remains distinct without duplicate codes');
 eq(i.claim,null,'no claim silently assigned from numeric evidence');
 const exact='\n  A fictional delivery idea.\r\nKeep this line.  ';
 setFairNote(state,exact);setFairClaim(state,'not-enough');keepFair(state);
 eq(fairView(round(state)).current.note,exact,'exact original note and line endings');
 eq(current(state).kept,true,'bookmark does not require a winning claim');
 const frozen=copy(i);eq(setFairPlan(state,'b',b.id==='high-rough'?'low-smooth':'high-rough'),'forked','observed plan edits fork');
 eq(state.fairTests.investigations.find(x=>x.id===i.id),frozen,'fork preserves old observations, words and support');
 const next=current(state);eq([next.trials,next.note,next.prediction,next.claim,next.support,next.familiar],[[],'',null,null,[],true],'new comparison is fresh, but familiar model');
}

// Frozen historical values are not regraded against current authored distances.
for(const [A,B,status,variation] of [
 [[12,12,12],[12,12,12],'overlap',false],
 [[10,12,11],[12,14,13],'overlap',true],
 [[10,12,11],[11,13,12],'overlap',true],
 [[25,26,25],[2,3,2],'A',true],
 [[2,3,2],[25,26,25],'B',true],
]){
 const s={},i=startFair(s,{a:'low-smooth',b:'high-smooth'});finish(s);
 for(const t of i.trials)t.distance=(t.side==='A'?A:B)[t.index-1];
 i.oldMessage='Earlier display words stay opaque';i.historicalField={kept:true};
 const frozen=copy(s);eq(fairView(s).status,'ready','valid old numbers accepted');eq(fairView(s).current,i,'same observation object remains available');eq(evidenceFor(i).status,status,'summary derives from saved intervals');eq(evidenceFor(i).variation.A,variation,'variation reflects actual frozen results');eq(s,frozen,'reads and evidence never rewrite saves');eq(fairView(round(s)).current,i,'saved metadata and old outcomes survive reload');
}
{
 const s={},i=startFair(s);revealFair(s,'A');revealFair(s,'A');
 i.trials[1].index=3;i.selected={side:'A',index:3};
 eq(revealFair(s,'A').index,2,'first missing trial index is revealed, not row count plus one');
}
{
 const s={},i=startFair(s);finish(s);const valid=copy(i);
 const mutations=[x=>x.trials.push(copy(x.trials[0])),x=>x.trials[0].setup='high-rough',x=>x.trials[0].distance=-1,x=>x.trials[0].distance=31,x=>x.trials[0].distance=1.5,x=>x.selected={side:'B',index:4},x=>x.trials[0].unit='cm',x=>x.trials[0].source='measured',x=>x.note='x'.repeat(801),x=>x.claim='correct',x=>x.support=['mastered']];
 for(const mutate of mutations){const bad=copy(valid);mutate(bad);ok(!validFairInvestigation(bad),'invalid ids/bounds/enums rejected without recomputing');}
 s.fairTests.investigations.push({id:7,raw:'<b>unreadable original</b>'});s.fairTests.current=7;
 const raw=copy(s.fairTests.investigations[1]);eq(fairView(s).current.id,1,'invalid current falls back to readable sibling');eq(fairView(s).earlier,[raw],'bad item remains exactly available');setFairNote(s,'Still open');eq(fairView(s).earlier,[raw],'ordinary writes preserve unreadable sibling');
 startFair(s);eq(fairView(s).earlier,[raw],'new investigations preserve unreadable sibling');
}
{
 const s={},i=startFair(s);eq(i.familiar,false,'first explicit visit begins practice without invented familiarity');setFairPlan(s,'b','high-smooth');eq(s.fairTests.investigations.length,1,'unobserved plan edits do not fork');
 eq(setFairPlan(s,'b','high-smooth'),'changed','unchanged setting is idempotent');
 revealFair(s,'A');const first=copy(i);
 for(let n=0;n<11;n++)startFair(s);
 resumeFair(s,i.id);const before=copy(s);
 eq(setFairPlan(s,'mission','surface'),'capacity','capacity edits refuse an implicit destructive fork');eq(s,before,'refused fork preserves every observation and current selection');
 const newer=startFair(s);eq(fairView(s).investigations.length,12,'explicit new action retains twelve readable investigations');eq(fairView(s).investigations.some(x=>x.id===first.id),false,'explicit new action evicts oldest readable only');ok(newer.id>12,'ids continue beyond evicted history');
 s.fairTests.investigations.unshift({id:2,unreadable:'keep original'});const bad=copy(s.fairTests.investigations[0]);startFair(s);eq(fairView(s).earlier,[bad],'capacity eviction retains unsupported raw items');
}
for(const raw of [null,42,'future',{version:2,exact:['\n<original>']},{version:1,investigations:[]}]){
 const s={fairTests:copy(raw)},before=copy(s);
 eq(fairView(s).status,'unavailable','unavailable envelope is read-only');eq(startFair(s),null,'no automatic replacement');eq(setFairNote(s,'rewrite'),false,'cannot write unsupported root');eq(s,before,'future/raw envelope preserved exact');
}
{
 const s={elsewhere:{kept:'synthetic'}},before=copy(s);fairView(s);eq(s,before,'render accessor never creates optional root');
 eq(setFairPlan(s,'speed','fast'),'invalid','bad plan input does not create root');eq(s,before,'rejected input has no write');
 ok(setFairPage(s,'try'),'explicit page action can start notebook');eq(s.fairTests.page,'try','all pages open');eq(s.elsewhere,before.elsewhere,'other work untouched');
}
console.log(`Fair Test Bench: ${checks} assertions passed.`);
