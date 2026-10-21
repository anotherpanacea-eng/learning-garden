import assert from 'node:assert/strict';
import {trailCases,trailExample,changedWhole} from '../dist/fraction-trail-content.mjs';
import * as T from '../dist/fraction-trail-core.mjs';
const copy=x=>JSON.parse(JSON.stringify(x));
const view=s=>T.trailView(s);
const work=s=>view(s).case;
const checkValid=s=>assert.equal(T.validTrail(s.fractionTrail),true);
const s={other:{untouched:true}},original=copy(s);
T.trailState(s);T.trailView(s);assert.deepEqual(s,original);
assert.equal(trailCases.length,6);
assert.deepEqual(T.trailExposureFacts(),[]);
// Exhaust all 2^11 first-whole cut sets, and every boundary on both wholes.
for(let mask=0;mask<2048;mask++){
 const cuts=Array.from({length:11},(_,i)=>i+1).filter((_,i)=>mask&(1<<i));
 const state={};T.chooseTrailCase(state,'repair-thirds');const w=work(state);w.cuts=cuts;
 const first=[0,...cuts,12],widths=first.slice(1).map((v,i)=>v-first[i]),equal=widths.every(n=>n===widths[0]);
 const boundaries=[...first,...first.slice(1).map(v=>v+12)];
 assert.deepEqual(view(state).boundaries,boundaries);
 assert.equal(view(state).equalSpaces,equal);assert.equal(view(state).spaceCountMatches,cuts.length===2);
 assert.equal(view(state).partitionMatches,equal&&cuts.length===2);
 for(let i=0;i<boundaries.length;i++){
  w.markerIndex=i;w.readingText=`${boundaries[i]}/12`;
  const v=view(state);assert.equal(v.flagTicks,boundaries[i]);assert.equal(v.pointMatches,boundaries[i]===8);
  T.checkTrail(state,'reading');assert.equal(view(state).feedback.reading.outcomes.readingMatches,true);
  // Clear history for this direct synthetic model mutation; each trial is independent.
  w.history=[];w.nextCheckId=1;w.checkedKinds={spaces:false,stop:false,reading:false};w.currentFeedback={spaces:null,stop:null,reading:null};w.support=w.support.filter(x=>!x.startsWith('feedback:'));
 }
 checkValid(state);
}
for(const c of trailCases){const state={};T.chooseTrailCase(state,c.id);assert.equal(work(state).markerIndex,null);T.prepareTrailTogether(state);assert.equal(view(state).ready,true);assert.equal(work(state).history.length,0);checkValid(state);}
// Correct target location and actual reading remain different checks on unequal thirds.
const u={};T.chooseTrailCase(u,'repair-thirds');T.startTrailFlag(u);T.moveTrailFlag(u,1);T.setTrailReading(u,'1/4');T.checkTrail(u,'reading');assert.equal(view(u).feedback.reading.outcomes.readingMatches,true);T.checkTrail(u,'stop');assert.deepEqual(view(u).feedback.stop.outcomes,{flagPresent:true,pointMatches:false,partitionMatches:false});T.moveTrailFlag(u,1);T.checkTrail(u,'stop');assert.deepEqual(view(u).feedback.stop.outcomes,{flagPresent:true,pointMatches:true,partitionMatches:false});T.checkTrail(u,'spaces');assert.deepEqual(view(u).feedback.spaces.outcomes,{spaceCountMatches:true,equalSpaces:false});checkValid(u);
const n={};T.checkTrail(n,'reading');assert.equal(work(n).history.length,0);assert.ok(work(n).inputError);T.setTrailReading(n,'bad');T.keepTrail(n);assert.equal(work(n).kept.readingText,'bad');assert.equal(work(n).kept.markerIndex,null);checkValid(n);
for(const raw of ['0','0/4','0/6','02/04',' 01 / 02 ','48/24','3','49/24']){const parsed=T.parseTrailReading(raw);assert.equal(!!parsed,raw!=='49/24');}
for(const raw of ['',' ','-1','+1','.5','1.0','1e0','1/0','1/25','1/2/3','1\n/2','½','１/２','1 / 2 x'])assert.equal(T.parseTrailReading(raw),null,raw);
const r={};T.chooseTrailCase(r,'same-half');T.prepareTrailTogether(r);T.setTrailReading(r,' 02/04 ');T.checkTrail(r,'reading');T.keepTrail(r);const kept=copy(work(r).kept);T.prepareTrailPartition(r,4);assert.equal(work(r).markerIndex,null);assert.equal(work(r).readingText,' 02/04 ');T.startTrailFlag(r);T.moveTrailFlag(r,1);T.moveTrailFlag(r,1);assert.equal(view(r).flagTicks,6);assert.deepEqual(work(r).kept,kept);T.prepareTrailPartition(r,6);T.startTrailFlag(r);for(let i=0;i<3;i++)T.moveTrailFlag(r,1);assert.equal(view(r).flagTicks,6);assert.deepEqual(work(r).kept,kept);checkValid(r);
T.chooseTrailCase(r,'past-one');assert.deepEqual(work(r).cuts,[]);T.prepareTrailPartition(r,4);T.startTrailFlag(r);for(let i=0;i<5;i++)T.moveTrailFlag(r,1);assert.equal(view(r).flagTicks,15);T.setTrailReading(r,'5/4');T.checkTrail(r,'reading');T.checkTrail(r,'stop');assert.equal(view(r).ready,true);checkValid(r);
for(let i=0;i<100;i++)T.checkTrail(r,i%9===0?'spaces':'reading');assert.equal(work(r).history.length,24);assert.ok(work(r).history.some(x=>x.kind==='stop'));checkValid(r);
const frozen=copy(work(r).history);T.useTrailSupport(r,'narration');assert.deepEqual(work(r).history,frozen);T.setTrailReading(r,' malformed ');T.chooseTrailCase(r,'quarter-stop');T.chooseTrailCase(r,'past-one');assert.equal(work(r).readingText,' malformed ');assert.equal(work(r).familiar,true);checkValid(r);
// Serialized source wording is preserved, while semantics and all derived results are verified.
const editorial=copy(r);for(const w of Object.values(editorial.fractionTrail.cases)){const change=x=>{x.source.title='Earlier title';x.source.request='Earlier wording';};change(w);w.history.forEach(change);if(w.kept)change(w.kept);}checkValid(editorial);
for(const mutate of [x=>x.fractionTrail.cases['past-one'].source.target.numerator=6,x=>work(x).cuts=[3,3],x=>work(x).markerIndex=99,x=>work(x).history.at(-1).outcomes.readingMatches=false,x=>work(x).currentFeedback.stop=999,x=>work(x).unexpected=true,x=>work(x).history.at(-1).support.push('invented')]){const bad=copy(r);mutate(bad);assert.equal(T.validTrail(bad.fractionTrail),false);assert.equal(T.trailState(bad),null);}
const rawReload=copy(n);assert.equal(T.validTrail(rawReload.fractionTrail),true);assert.equal(work(rawReload).readingText,'bad');
const ordering=copy(r);const current=ordering.fractionTrail.cases['past-one'];current.source=Object.fromEntries(Object.entries(current.source).reverse());checkValid(ordering);
const chronology={};T.checkTrail(chronology,'spaces');const badChronology=copy(chronology),badWork=work(badChronology);badWork.history[0].support.push('feedback:spaces');badWork.history[0].checkedPreviously=true;assert.equal(T.validTrail(badChronology.fractionTrail),false);
const selectors={};T.checkTrail(selectors,'spaces');const spaceId=work(selectors).currentFeedback.spaces;T.startTrailFlag(selectors);assert.equal(work(selectors).currentFeedback.spaces,spaceId);T.setTrailReading(selectors,'0');T.checkTrail(selectors,'reading');T.setTrailReading(selectors,'0/4');assert.equal(work(selectors).currentFeedback.reading,null);assert.equal(work(selectors).currentFeedback.spaces,spaceId);T.toggleTrailCut(selectors,1);assert.equal(work(selectors).currentFeedback.spaces,null);checkValid(selectors);
const recovered={fractionTrail:{version:9,raw:'<unknown>'}};assert.equal(T.recoverTrail(recovered),true);assert.deepEqual(recovered.fractionTrail.recovered,{version:9,raw:'<unknown>'});T.prepareTrailTogether(recovered);T.checkTrail(recovered,'stop');T.keepTrail(recovered);assert.equal(work(recovered).history[0].priorExposureUnknown,true);assert.equal(work(recovered).kept.priorExposureUnknown,true);for(let i=0;i<40;i++)T.checkTrail(recovered,'spaces');checkValid(recovered);assert.equal(work(recovered).history.every(x=>x.priorExposureUnknown),true);
const example={};T.stepTrailExample(example);const before=copy({cuts:work(example).cuts,markerIndex:work(example).markerIndex});for(let i=0;i<6;i++)T.stepTrailExample(example);assert.equal(work(example).exampleStep,4);assert.deepEqual({cuts:work(example).cuts,markerIndex:work(example).markerIndex},before);assert.deepEqual(trailExample.target,{numerator:1,denominator:3});T.setTrailHelp(example,'changed-whole');assert.ok(work(example).support.includes('changedWhole'));assert.ok(changedWhole.caption.includes('different'));checkValid(example);
console.log('Fraction Trail checks passed: all 2048 partitions and every boundary, six requests, independent checks, syntax, immutable keeps, chronology, capped history and recovery.');
