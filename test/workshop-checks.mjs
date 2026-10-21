import assert from 'node:assert/strict';
import {MODEL_REVISION,heights,surfaces,configurations,ensureWorkshop,currentWorkshop,startWorkshop,resumeWorkshop,setWorkshopSetting,setWorkshopPrediction,releaseWorkshop,stepWorkshop,replayWorkshop,finishWorkshop,setWorkshopSupport,setWorkshopReading} from '../dist/workshop-core.mjs';
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const json=x=>JSON.stringify(x);
const reload=s=>{const copy=JSON.parse(json(s));ensureWorkshop(copy);return copy;};
const complete=s=>{releaseWorkshop(s);stepWorkshop(s);stepWorkshop(s);return currentWorkshop(s);};
{
 const s={facts:{sample:[12]},baseline:{draft:{input:'synthetic'}},cafe:{current:{recipe:{pretend:2}}}},legacy=json(s);
 ensureWorkshop(s);check(currentWorkshop(s)===null&&!s.workshop.experiments.length,'normalization does not begin an experiment');
 check(!stepWorkshop(s)&&!releaseWorkshop(s)&&!finishWorkshop(s)&&!resumeWorkshop(s,'missing'),'actions without a comparison do not create one');
 check(!startWorkshop(s,'speed')&&!startWorkshop(s,'height','high'),'invalid comparison/fixed settings rejected');
 const e=startWorkshop(s);setWorkshopPrediction(s,'unsure');setWorkshopSupport(s,'explanation');setWorkshopSupport(s,'audioRequested');setWorkshopReading(s,'together');complete(s);
 const {workshop,...other}=s;check(json(other)===legacy,'investigations do not change unrelated evidence or waiting drafts');
 check(e.prediction==='unsure'&&!e.predictionAfterResults&&e.support.explanation&&e.support.audioRequested&&e.reading==='together','optional prediction, support, and separate reading report retained');
 check(setWorkshopPrediction(s,'farther')&&e.predictionAfterResults,'revision after results is disclosed');
 setWorkshopPrediction(s,null);setWorkshopPrediction(s,'shorter');check(reload(s).workshop.experiments[0].predictionAfterResults,'clearing prediction cannot erase its after-results flag');
 check(!setWorkshopPrediction(s,'correct')&&!setWorkshopReading(s,'mastered')&&!setWorkshopSupport(s,'mastery'),'unsupported evidence labels rejected');
}
check(heights.length===3&&surfaces.length===2&&configurations.length===6,'three heights and two surfaces');
for(const c of configurations){
 check(c.distances.length===3&&c.distances.every(n=>Number.isInteger(n)&&n>=0&&n<=30),'bounded authored whole-number outcomes');
 const s={},e=startWorkshop(s,'height',c.surface);setWorkshopSetting(s,c.height);
 for(let i=0;i<6;i++){
  const p=releaseWorkshop(s);check(p.distance===c.distances[i%3]&&p.trialNumber===i+1,'each configuration cycles its declared sequence');
  check(p.phase===0&&e.trials.length===i,'release records no completed trial');
  const before=json(s);ensureWorkshop(s);currentWorkshop(s);check(json(s)===before,'read/normalization never advances a trial');
  check(!setWorkshopSetting(s,c.height)&&!releaseWorkshop(s),'cannot change settings or release another cart during motion');
  stepWorkshop(s);const paused=reload(s);check(currentWorkshop(paused).pending.phase===1&&currentWorkshop(paused).pending.distance===p.distance,'paused foot phase and exact result survive reload');
  stepWorkshop(s);check(e.trials.length===i+1&&p.phase===2,'stop explicitly adds one result');
  check(!stepWorkshop(s),'repeated final step cannot credit another result');
  const count=e.counts[c.id];replayWorkshop(s);stepWorkshop(s);stepWorkshop(s);
  check(e.trials.length===i+1&&e.counts[c.id]===count&&p.distance===c.distances[i%3],'replay adds no trial or sequence count');
 }
 check(e.trials.every(t=>t.surface===c.surface)&&e.fixed===c.surface,'height comparison holds surface unchanged');
}
for(const h of heights){
 const s={},e=startWorkshop(s,'surface',h.id);complete(s);setWorkshopSetting(s,'rough');complete(s);
 check(e.trials.length===2&&e.trials.every(t=>t.height===h.id)&&new Set(e.trials.map(t=>t.surface)).size===2,'surface comparison holds selected height fixed');
 check(!setWorkshopSetting(s,'high'),'cannot set the fixed variable through the changed-variable control');
 const first=e.id;startWorkshop(s,'height','rough');check(resumeWorkshop(s,first)&&currentWorkshop(s).trials.length===2,'switching comparisons preserves results');
 check(finishWorkshop(s)&&e.finished&&e.prediction===null,'finish requires no prediction or explanation');
 check(resumeWorkshop(s,first)&&releaseWorkshop(s)&&!e.finished,'a finished comparison can be resumed and continued');
}
{
 const s={},e=startWorkshop(s);for(let n=0;n<30;n++)complete(s);
 check(e.trials.length===24&&e.trials[0].trialNumber===7&&e.counts['low-smooth']===30,'completed rows bounded while sequence counts retain all runs');
 const r=reload(s),p=releaseWorkshop(r);check(p.trialNumber===31&&p.distance===12,'sequence continues correctly after old rows are removed and reloaded');
 stepWorkshop(r);const again=reload(r);stepWorkshop(again);const a=currentWorkshop(again);replayWorkshop(again);stepWorkshop(again);stepWorkshop(again);
 check(a.trials.length===24&&a.trials.at(-1).trialNumber===31&&a.counts['low-smooth']===31,'reloaded replay cannot duplicate a completed trial');
}
{
 const s={},first=startWorkshop(s).id;for(let n=0;n<29;n++)startWorkshop(s);
 check(s.workshop.experiments.length===24&&!resumeWorkshop(s,first),'only latest 24 comparisons retained');
 const prior=s.workshop.experiments[0].id;resumeWorkshop(s,prior);
 const extra={...JSON.parse(json(currentWorkshop(s))),id:'workshop-99'};s.workshop.experiments.push(extra);ensureWorkshop(s);
 check(s.workshop.experiments.length===24&&currentWorkshop(s).id===prior,'normalization cap preserves current comparison');
 check(startWorkshop(s).id==='workshop-100','IDs continue beyond saved and trimmed records');
}
{
 const s={},e=startWorkshop(s);setWorkshopSupport(s,'explanation');setWorkshopReading(s,'independent');releaseWorkshop(s);stepWorkshop(s);
 e.revision='future-model';e.pending.revision='future-model';e.pending.distance=27;e.notes={exact:'preserve extra fields'};
 const raw=JSON.parse(json(e)),r=reload(s),closed=currentWorkshop(r),{closed:flag,closedReason,...preserved}=closed;
 check(flag&&typeof closedReason==='string'&&json(preserved)===json(raw),'unsupported model keeps every raw experiment and pending field as closed work');
 check(!releaseWorkshop(r)&&!stepWorkshop(r)&&!replayWorkshop(r)&&!setWorkshopSetting(r,'middle')&&!setWorkshopPrediction(r,null)&&!finishWorkshop(r),'unsupported experiment cannot mix model revisions through actions');
 check(resumeWorkshop(r,e.id)&&currentWorkshop(r).pending.phase===1,'closed work remains accessible at its exact saved phase');
 const fresh=startWorkshop(r);check(fresh.revision===MODEL_REVISION&&!fresh.closed&&r.workshop.experiments.length===2,'fresh comparison leaves unsupported record intact');
}
{
 const s={},e=startWorkshop(s);complete(s);e.pending.distance='broken';const before=JSON.parse(json(e));ensureWorkshop(s);
 const {closed,closedReason,...saved}=e;check(closed&&json(saved)===json(before),'malformed paused result is preserved as closed work rather than silently recomputed');
}
console.log(`${checks} Storm Workshop checks passed.`);
