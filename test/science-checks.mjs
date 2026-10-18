import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {missions,WATER_LAB_URL} from '../dist/science-content.mjs';
import {ensureScience,startScience,resumeScience,currentScience,setPrediction,toggleObservation,setScienceReading,advanceScience,scienceBack,scienceFrame,openScienceExplanation,noteScienceExternal,stayScienceLocal} from '../dist/science-core.mjs';
import {ensureGarden} from '../dist/garden-core.mjs';
import {scienceHome,sciencePage,scienceNotes} from '../dist/science-ui.mjs';
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
const fresh=()=>{const s=freshState();ensureGarden(s);ensureScience(s);return s;};
const snapshot=s=>JSON.stringify(s);
check(missions.length===3&&new Set(missions.map(m=>m.id)).size===3,'three independently authored missions');
check(WATER_LAB_URL==='https://withmarble.com/water-lab/','fixed external URL');
{
 const s=fresh(),before=snapshot(s);check(!currentScience(s)&&s.science.visits.length===0,'initialization never starts a visit');
 check(scienceHome(s).includes('Water')&&snapshot(s)===before,'hub rendering does not start a visit');
 check(!startScience(s,'bad')&&!advanceScience(s)&&!noteScienceExternal(s),'invalid actions rejected');
}
for(const m of missions){
 check(m.frames.length===3&&m.instructions.length===3&&m.predictions.length===3&&m.observations.length===4,'bounded reviewed mission content');
 const s=fresh(),v=startScience(s,m.id);check(v.stage==='wonder'&&!v.completed,'explicit start');
 check(!setPrediction(s,99)&&!toggleObservation(s,0),'invalid indices/stage rejected');
 check(advanceScience(s)&&v.prediction===null,'prediction optional');
 const at=snapshot(s.science);noteScienceExternal(s);check(v.externalLinkOpened&&v.stage==='explore'&&!v.completed,'link selected does not advance or complete');
 check(!s.garden.observations.length&&!s.broad&&!s.baseline.observations.length,'science does not claim assessment evidence');
 check(advanceScience(s)&&v.stage==='notice','explicit return advances');
 check(toggleObservation(s,0)&&toggleObservation(s,0)&&!v.observations.length,'reported observations toggle separately');
 setScienceReading(s,'together');check(advanceScience(s)&&v.stage==='explain'&&v.explanationOpened,'explanation is teaching');
 const renderedBefore=snapshot(s);check(sciencePage(s).length>100&&scienceNotes(s).length>100&&snapshot(s)===renderedBefore,'page and notes are read only');
 check(!scienceFrame(s,-1)&&scienceFrame(s,1)&&scienceFrame(s,1)&&!scienceFrame(s,1),'frames stay bounded');
 check(scienceFrame(s,'reset')&&v.frame===0&&v.explanationOpened,'reset cannot erase teaching');
 check(advanceScience(s)&&v.stage==='ending'&&v.completed,'visit can finish with no answers/reports');
 check(!advanceScience(s)&&s.science.visits.length===1,'ending cannot duplicate records');
 check(scienceBack(s)&&v.stage==='explain'&&v.completed,'completed visit can review earlier steps');
 const r=restoreState(JSON.stringify(s));ensureScience(r);check(currentScience(r).stage==='explain'&&currentScience(r).completed,'intentional completed review survives reload');
}
{
 const s=fresh(),v=startScience(s,'melt');check(noteScienceExternal(s)&&v.stage==='wonder'&&!v.completed,'source link selection recorded at any visit stage without advancing');setPrediction(s,0);openScienceExplanation(s);scienceFrame(s,1);
 scienceBack(s);scienceBack(s);scienceBack(s);check(v.stage==='wonder'&&v.prediction===0&&v.explanationOpened,'back retains original idea and teaching');
 setPrediction(s,1);check(v.predictionAfterTeaching,'revised prediction marked after teaching');
 setPrediction(s,null);setPrediction(s,2);const r=restoreState(JSON.stringify(s));ensureScience(r);check(currentScience(r).prediction===2&&currentScience(r).predictionAfterTeaching&&currentScience(r).explanationOpened,'prediction timing/support survive clearing and reload');
 advanceScience(r);check(stayScienceLocal(r)&&currentScience(r).stage==='notice'&&currentScience(r).stayedLocal&&currentScience(r).externalLinkOpened,'local path retains prior explicit source selection');
 toggleObservation(r,3);setScienceReading(r,'independent');const old=currentScience(r).id;startScience(r,'warm');check(resumeScience(r,old)&&currentScience(r).observations[0]===3&&currentScience(r).reading==='independent','switching preserves report and reading separately');
}
{
 const s=fresh();s.baseline.index=2;s.baseline.draft={questionId:'synthetic',attempts:[9]};s.cafe={version:1,synthetic:'retained'};const legacy=snapshot({baseline:s.baseline,cafe:s.cafe});
 s.science=[];ensureScience(s);check(snapshot({baseline:s.baseline,cafe:s.cafe})===legacy,'bad science extension preserves legacy state');
 const v=startScience(s,'evaporate');v.stage='bad';v.prediction=99;v.observations=[0,0,77,'1'];v.reading='bad';v.frame=-7;v.predictionAfterTeaching=true;ensureScience(s);
 check(v.stage==='wonder'&&v.prediction===null&&snapshot(v.observations)==='[0]'&&v.reading==='unobserved'&&v.frame===0&&v.explanationOpened,'malformed additions recover conservatively');
 v.stage='ending';v.completed=false;ensureScience(s);check(v.completed,'ending establishes reached-ending flag');
 v.stage='bad';ensureScience(s);check(v.stage==='ending'&&v.completed,'malformed completed cursor closes safely');
 s.science.visits.push({...v},{id:'visit-99',missionId:'missing'},{id:'bad',missionId:'melt'});ensureScience(s);check(s.science.visits.length===1,'duplicate and unknown visits filtered');
}
{
 const s=fresh();const first=startScience(s,'melt').id;for(let n=0;n<29;n++)startScience(s,missions[n%3].id);
 check(s.science.visits.length===24&&new Set(s.science.visits.map(v=>v.id)).size===24&&!resumeScience(s,first),'retained visits bounded with unique IDs');
 const prior=s.science.visits[0].id;resumeScience(s,prior);s.science.visits.push({id:'visit-99',missionId:'melt',stage:'wonder'});ensureScience(s);
 check(s.science.visits.length===24&&currentScience(s).id===prior,'current visit retained during recovery cap');
 const before=snapshot(s);JSON.stringify({...s});check(snapshot(s)===before,'exportable without transformation or mutation');
 const reset=fresh();check(!reset.science.visits.length&&reset.science.current===null,'fresh reset has no science visits');
}
console.log(`${checks} science expedition checks passed.`);
