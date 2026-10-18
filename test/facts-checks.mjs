import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ensureFacts,allFacts,orderedKey,startFact,startFactsMix,currentFact,submitFact,setFactMethod,showFactModel,revealFact,stepFactModel,finishFact,advanceFacts,setFactsRow,factsSummary,factPairsShown,splitFact,factsRecordLimit} from '../dist/facts-core.mjs';
import {factsPage,factsNotes} from '../dist/facts-ui.mjs';
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
const same=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
const fresh=()=>{const s=freshState();ensureFacts(s);return s;};
const copy=s=>JSON.parse(JSON.stringify(s));
const stable=(s,fn)=>{const before=JSON.stringify(s),html=fn();check(JSON.stringify(s)===before,'render is read-only');return html;};
check(allFacts.length===144&&new Set(allFacts.map(p=>orderedKey(...p))).size===144,'all 144 ordered facts');
{
 const s=fresh(),before=JSON.stringify(s);ensureFacts(s);check(!s.facts.current&&s.facts.nextVisit===0,'initialization never starts');
 check(JSON.stringify(s)===before,'repeat ensure stable');
 const html=stable(s,()=>factsPage(s));check((html.match(/data-facts-pair=/g)||[]).length===156,'matrix144 plus twelve row alternatives');
 check(html.includes('horizontally scrollable table')&&html.includes('scope="col"')&&html.includes('scope="row"'),'contained labelled matrix with headers');
 check(!html.includes('1 × 1 = 1'),'matrix shows operands without answer keys');
 stable(s,()=>factsPage(s,'play'));stable(s,()=>factsNotes(s));
 check(!startFact(s,0,1)&&!startFact(s,13,1)&&!startFact(s,1,1.5),'factor boundaries');
 check(!submitFact(s,1)&&!finishFact(s)&&!advanceFacts(s)&&!showFactModel(s)&&!revealFact(s),'no implicit active question');
 check(s.facts.seen.length===0,'viewing map does not encounter facts');
}
for(const [a,b] of allFacts){
 const s=fresh();startFact(s,a,b,'2026-01-01');let d=currentFact(s);
 same(s.facts.seen,[orderedKey(a,b)],'explicit open encounters only ordered question');
 check(d.a===a&&d.b===b&&d.opened,'ordered pair retained');
 same(factPairsShown(s),[[a,b]],'question exposure only');
 check(!submitFact(s,-1)&&!submitFact(s,'4')&&!submitFact(s,1.2)&&!submitFact(s,1000),'invalid numbers rejected');
 check(submitFact(s,a*b,'2026-01-01'),'whole-number answer accepted');
 check(!submitFact(s,a*b),'no extra attempt after correct answer');
 check(setFactMethod(s,'recalled')&&finishFact(s),'optional recalled report');
 const r=s.facts.observations.at(-1);check(r.correct&&r.reportedRecall&&r.attempts[0].correct,'correct unsupported explicit first recall reported');
 check(r.day==='2026-01-01'&&r.attempts[0].day==='2026-01-01','day retained on observation and attempt');
 check(!finishFact(s)&&!advanceFacts(s),'finish idempotent and single visit closed');
 const reverse=factsSummary(s).find(c=>c.a===b&&c.b===a);if(a!==b)check(reverse.latest===null&&!reverse.seen,'no reverse observation or ordered encounter inference');
 const legacy=JSON.stringify(s.baseline);ensureFacts(s);check(JSON.stringify(s.baseline)===legacy,'baseline unchanged');
}
{
 const s=fresh();startFact(s,8,7);submitFact(s,55);submitFact(s,56);setFactMethod(s,'recalled');finishFact(s);
 check(!s.facts.observations.at(-1).reportedRecall,'second-try recalled report is not first-attempt recall');
 const r=s.facts.observations.at(-1);same(r.attempts.map(t=>t.correct),[false,true],'correctness retained for each attempt');
}
for(const support of ['array','groups','reveal','together']){
 const s=fresh();startFact(s,12,7,'2026-01-01');
 if(support==='reveal')revealFact(s);else if(support!=='together')showFactModel(s,support);
 submitFact(s,84,'2026-01-01');setFactMethod(s,support==='together'?'together':'recalled');
 if(support==='together')setFactMethod(s,'recalled');
 finishFact(s);check(s.facts.observations.at(-1).supported&&!s.facts.observations.at(-1).reportedRecall,'support permanently suppresses recall qualification');
 const restored=copy(s);ensureFacts(restored);check(restored.facts.observations.at(-1).supported&&!restored.facts.observations.at(-1).reportedRecall,'support survives reload');
}
{
 const s=fresh();startFact(s,9,8);submitFact(s,72);setFactMethod(s,'recalled');showFactModel(s);finishFact(s);
 check(!s.facts.observations.at(-1).reportedRecall,'model opened after answer remains question support');
 startFact(s,7,6);submitFact(s,42);finishFact(s);check(s.facts.observations.at(-1).method===null&&!s.facts.observations.at(-1).reportedRecall,'finishing without method does not infer recall');
 startFact(s,6,8);finishFact(s,'skipped');const r=s.facts.observations.at(-1);check(r.correct===null&&r.attempts.length===0&&r.method===null,'unanswered skip remains unknown');
}
{
 const s=fresh();startFact(s,12,12);showFactModel(s);check(currentFact(s).supported&&currentFact(s).steps===0,'model opens as support before counting');
 for(let i=1;i<=12;i++){check(stepFactModel(s,1)&&currentFact(s).steps===i,'count twelve rows');}
 check(!stepFactModel(s,1)&&!stepFactModel(s,99),'model step bounds');
 check(stepFactModel(s,'reset')&&currentFact(s).steps===0&&currentFact(s).supported,'recount cannot erase support');
 same(factPairsShown(s),[[12,12],[10,12],[2,12]],'all displayed split pairs exposed');
 const seen=s.facts.seen;check(seen.includes('10x12')&&seen.includes('2x12')&&!seen.includes('12x10'),'split encounters stay ordered');
 const html=stable(s,()=>factsPage(s,'play'));check((html.match(/class="facts-counter"/g)||[]).length===144,'12x12 has exactly144 visual counters');
 check(html.includes('12 rows')&&html.includes('10 × 12')&&html.includes('2 × 12'),'large model and split text equivalents');
 const frozen=copy(s);ensureFacts(frozen);same(frozen.facts.current,s.facts.current,'opened model survives draft reload');
}
for(const [a,b] of allFacts){
 const parts=splitFact(a,b);check(parts.every(p=>p[0]>=1&&p[0]<=12&&p[1]===b)&&parts.reduce((sum,p)=>sum+p[0]*p[1],0)===a*b,'every split has valid nonzero whole groups and correct product');
}
{
 const s=fresh();const seen=new Set();
 for(let visit=0;visit<72;visit++){
  const x=startFactsMix(s,'2026-01-01');check(x.pairs.length===6&&new Set(x.pairs.map(p=>orderedKey(...p))).size===6,'mixed set six distinct ordered questions');
  if(visit===0)check(new Set(x.pairs.map(p=>p[0])).size>1&&new Set(x.pairs.map(p=>p[1])).size>1,'initial mixed set varies both factors');
  for(let i=0;i<6;i++){
   const d=currentFact(s);seen.add(orderedKey(d.a,d.b));submitFact(s,d.a*d.b,'2026-01-01');setFactMethod(s,'recalled');finishFact(s);if(i<5)check(advanceFacts(s),'explicit next question');
  }
 }
 check(seen.size===144,'mixed coverage reaches all144 despite growing familiar review pool');
}
{
 const s=fresh(),seen=new Set();
 for(let visit=0;visit<72;visit++){
  startFactsMix(s);for(let i=0;i<6;i++){const d=currentFact(s);seen.add(orderedKey(d.a,d.b));submitFact(s,0);finishFact(s,'skipped');if(i<5)advanceFacts(s);}
 }
 check(seen.size===144,'focus and repeated uncertainty never starve rotated coverage');
}
{
 const s=fresh();startFactsMix(s);let d=currentFact(s);d.input='12';submitFact(s,0);showFactModel(s);stepFactModel(s,1);
 const restored=restoreState(JSON.stringify(s));ensureFacts(restored);
 same(restored.facts.current,s.facts.current,'input, attempts, step, support, ordered plan, and visit restore');
 const count=s.facts.observations.length;startFact(s,11,11);check(s.facts.observations.length===count+1&&s.facts.observations.at(-1).status==='changed','new fact retains prior open question observation');
 check(s.facts.observations.at(-1).supported,'changing question keeps support');
}
{
 const s=fresh();s.exposures=['8x3'];s.broad={seenFacts:['7x4'],legacyExposureUnknown:false};
 startFact(s,3,8);check(currentFact(s).legacyKnown&&!currentFact(s).ownPrior&&!currentFact(s).priorExposureUnknown,'canonical legacy encounters recognized without reversal assessment');
 startFact(s,4,7);check(currentFact(s).legacyKnown,'broad canonical encounters recognized');
 const unknown=fresh();startFact(unknown,3,8);check(currentFact(unknown).priorExposureUnknown,'missing outside encounter history remains unknown');
}
{
 const s=fresh();for(const when of ['2026-01-01','2026-01-01','2026-01-02']){startFact(s,6,7,when);submitFact(s,42,when);setFactMethod(s,'recalled');finishFact(s);}
 const c=factsSummary(s).find(c=>c.key==='6x7');same(c.days,['2026-01-01','2026-01-02'],'repeated-day observations count distinct days only');
 check(c.records.length===3&&c.latest.ownPrior,'repeated observations and encounter history retained');
 const notes=stable(s,()=>factsNotes(s));check(notes.includes('2 distinct days')&&notes.includes('not mastery'),'notes disclose repeated-day limits and no mastery');
}
{
 const s=fresh();startFact(s,1,1);submitFact(s,1);finishFact(s);
 for(let i=0;i<factsRecordLimit+2;i++){startFact(s,12,12);finishFact(s,'skipped');}
 check(s.facts.observations.length===factsRecordLimit,'observation cap enforced');check(s.facts.seen.includes('1x1'),'ordered encounter survives observation eviction');
 const forgotten=factsSummary(s).find(c=>c.key==='1x1');check(forgotten.latest===null&&forgotten.seen,'evicted evidence is not presented as known');
 const notes=stable(s,()=>factsNotes(s));check(notes.includes('576')&&notes.includes('older records may be absent'),'record cap disclosed');
}
{
 for(const invalid of [null,[],{version:1,seen:{},observations:{},current:[]}]){
  const s=freshState();s.facts=invalid;s.unrelated={synthetic:true};const legacy=JSON.stringify({baseline:s.baseline,practice:s.practice,unrelated:s.unrelated});ensureFacts(s);
  check(s.facts.version===1&&!s.facts.current&&Array.isArray(s.facts.seen),'malformed extension recovered without starting');
  check(JSON.stringify({baseline:s.baseline,practice:s.practice,unrelated:s.unrelated})===legacy,'legacy and unrelated state preserved');
 }
 const s=fresh();startFact(s,4,5);submitFact(s,20);setFactMethod(s,'recalled');finishFact(s);
 const bad=copy(s);bad.facts.observations[0].attempts.push({...bad.facts.observations[0].attempts[0],value:21});bad.facts.observations[0].reportedRecall=true;ensureFacts(bad);
 check(!bad.facts.observations[0].reportedRecall,'malformed extra attempts cannot establish first-attempt recall');
 const supported=copy(s);supported.facts.observations[0].model=true;supported.facts.observations[0].supported=false;ensureFacts(supported);check(!supported.facts.observations[0].reportedRecall&&supported.facts.observations[0].supported,'inconsistent model flag conservatively retains support');
 const wrong=copy(s);wrong.facts.current.pairs=[[0,5]];ensureFacts(wrong);check(!wrong.facts.current,'invalid draft plan safely rejected');
 const bounds=fresh();startFact(bounds,3,4);currentFact(bounds).steps=99;currentFact(bounds).revealed=true;currentFact(bounds).supported=false;ensureFacts(bounds);check(currentFact(bounds).steps===0&&currentFact(bounds).supported,'malformed steps bounded and reveal sticky');
 check(!setFactsRow(bounds,13)&&setFactsRow(bounds,12)&&bounds.facts.row===12,'row selector bounds');
}
{
 const s=fresh();startFact(s,5,6);submitFact(s,30);setFactMethod(s,'recalled');finishFact(s);
 const duplicate=copy(s),r=copy(duplicate.facts.observations[0]);r.model=true;r.supported=true;duplicate.facts.observations.push(r);ensureFacts(duplicate);
 check(duplicate.facts.observations.length===1&&duplicate.facts.observations[0].supported&&!duplicate.facts.observations[0].reportedRecall,'duplicate observation conflict conservatively preserves support without recall');
 ensureFacts(duplicate);check(!duplicate.facts.observations[0].reportedRecall,'duplicate recovery remains conservative after another normalization');
 const unknown=copy(s);unknown.facts.observations[0].day='2026-02-30';unknown.facts.observations[0].attempts[0].day=null;ensureFacts(unknown);
 check(unknown.facts.observations[0].day===null&&unknown.facts.observations[0].attempts[0].day===null,'missing or impossible saved days do not fabricate an observation today');
 check(factsSummary(unknown).find(c=>c.key==='5x6').days.length===0,'unknown dates do not count as distinct observation days');
 check(factsNotes(unknown).includes('Day not recorded'),'unknown day disclosed');
}
console.log(`${checks} multiplication-garden checks passed.`);
