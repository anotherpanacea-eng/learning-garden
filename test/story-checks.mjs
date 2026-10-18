import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ensureBroad,noteLegacyExposure} from '../dist/broad-core.mjs';
import {entrances,storyNodes} from '../dist/story-content.mjs';
import {guides,avatars} from '../dist/companions.mjs';
import {ensureGarden,currentVisit,startVisit,resumeVisit,storyDraft,noteStorySeen,noteGardenFactExposure,submitStory,finishStoryNode} from '../dist/garden-core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const state=()=>{const s=freshState();ensureBroad(s);ensureGarden(s);return s;};
check(entrances.length===4&&Object.keys(storyNodes).length===13,'bounded story');
check(JSON.stringify(Object.values(storyNodes).filter(n=>n.type==='task'&&n.entrance!=='cafe').map(n=>n.answer))==='[0,1,2,12,2,7]','reviewed answer keys');
for(const e of entrances){
 let id=e.start;const seen=new Set();let tasks=0,projects=0;
 while(id){const n=storyNodes[id];check(n&&!seen.has(id)&&n.entrance===e.id,'own noncyclic branch');seen.add(id);
  if(n.type==='task'){tasks++;check(Number.isInteger(n.answer)&&n.answer>=0&&n.hint&&n.explanation,'authored task');if(n.kind==='choice')check(!!n.choices[n.answer],'choice key');}
  else{projects++;check(n.answer===undefined,'project has no answer key');}
  id=n.next;
 }
 check(tasks===(e.id==='cafe'?3:2)&&projects===1&&e.ending.project,'independent ending with offscreen project');
 const s=state();startVisit(s,e.id);
 while(!currentVisit(s).finished){const n=storyNodes[currentVisit(s).node];const d=storyDraft(s);noteStorySeen(s);if(n.type==='task'){submitStory(s,n.answer);d.method='worked';d.reading='independent';}else d.designChoice='Synthetic design';check(!!finishStoryNode(s),'node completes');}
 check(s.garden.observations.length===(e.id==='cafe'?4:3)&&currentVisit(s).finished,'whole own path finishes');
 const project=s.garden.observations.at(-1);check(project.status==='invitation'&&project.correct===null&&!project.independent&&!project.freshEvidence,'project not evidence of performance');
 check(!finishStoryNode(s)&&s.garden.observations.length===(e.id==='cafe'?4:3),'finished node not duplicated');
 const first=currentVisit(s).id;startVisit(s,e.id);check(storyDraft(s).familiar,'revisit remembers encounter');
 check(resumeVisit(s,first)&&currentVisit(s).finished,'ending resumes');
}
{
 const s=state();s.baseline.index=1;s.baseline.draft={questionId:'strategy',attempts:[0],hinted:true};s.practice.push({questionId:'synthetic',skill:'facts',attempts:[24],status:'answered',fact:[4,6]});
 ensureBroad(s);startVisit(s,'message');const d=storyDraft(s);submitStory(s,-1);check(!d.attempts.length,'negative choice rejected');submitStory(s,99);check(!d.attempts.length,'out-of-range choice rejected');submitStory(s,2);check(!finishStoryNode(s),'method required');d.method='worked';d.reading='together';d.hinted=true;
 const a=currentVisit(s).id,b=startVisit(s,'shelter').id;check(a!==b&&s.garden.visits.length===2,'another visit retained');
 const restored=restoreState(JSON.stringify(s));ensureBroad(restored);ensureGarden(restored);resumeVisit(restored,a);
 const dd=storyDraft(restored);check(dd.attempts[0]===2&&dd.method==='worked'&&dd.hinted&&dd.reading==='together','draft with support survives storage');
 check(restored.baseline.draft.hinted&&restored.practice.length===1,'legacy progress retained');
 const o=finishStoryNode(restored);check(o.supported&&!o.independent&&!o.freshEvidence&&o.reading==='together','supported reading retained');
 const maths=storyDraft(restored);maths.input='12';submitStory(restored,11);submitStory(restored,12);maths.method='worked';
 const m=finishStoryNode(restored);check(m.correct&&!m.firstCorrect&&!m.independent,'retry remains retry');
}
{
 const s=state();startVisit(s,'message');let d=storyDraft(s);submitStory(s,2);d.method='knew';const reading=finishStoryNode(s);check(!reading.independent&&reading.reading==='unobserved','math style method does not prove reading');
 d=storyDraft(s);const visit=currentVisit(s).id;noteGardenFactExposure(s,[4,3]);check(d.knownFact,'commuted math fact updates paused story');
 d.knownFact=false;noteGardenFactExposure(s,[3,4],`${visit}:message-markers`);check(!d.knownFact,'own exposure preserves initial snapshot');
 s.broad.drafts['checkin:synthetic']={attempts:[]};noteLegacyExposure(s,[3,4]);check(s.broad.seenFacts.includes('3x4'),'story fact can feed existing exposure store');
 submitStory(s,12);d.method='worked';d.reading='together';const o=finishStoryNode(s);check(o.independent&&o.reading==='together','independent math distinct from reading together');
}
{
 const s=state();startVisit(s,'creature');const d=storyDraft(s);d.hinted=true;submitStory(s,0);d.method='knew';d.reading='independent';const o=finishStoryNode(s);check(o.supported&&!o.independent,'hint remains support after right answer');
 check(finishStoryNode(s,true).status==='skipped','skip means unexplored');check(finishStoryNode(s).status==='invitation','project continuation is unscored');
}
{
 const s=state();for(const guide of guides)for(const avatar of avatars){s.garden.guide=guide.id;s.garden.avatar=avatar.id;ensureGarden(s);check(s.garden.guide===guide.id&&s.garden.avatar===avatar.id,'independent companion combinations');}
 s.garden.guide='bad';s.garden.avatar='bad';s.garden.visits.push({id:'bad',entrance:'bad'});ensureGarden(s);check(s.garden.guide==='mira'&&s.garden.avatar==='fern'&&!s.garden.visits.length,'malformed additions recover');
 startVisit(s,'shelter');s.garden.visits[0].node='message-markers';ensureGarden(s);check(currentVisit(s).node==='shelter-test','cursor cannot jump branches');
 s.garden.visits[0].drafts['shelter-test']={attempts:'bad'};check(storyDraft(s).attempts.length===0,'malformed draft recovers');
}
{
 const s=state();const first=startVisit(s,'creature').id;storyDraft(s);noteStorySeen(s);
 startVisit(s,'message');storyDraft(s);noteStorySeen(s);
 startVisit(s,'creature');const d=storyDraft(s);noteStorySeen(s);
 check(d.familiar,'new encounter has prior familiarity');
 resumeVisit(s,first);const paused=storyDraft(s);check(paused.familiar,'paused same-task draft updated by another visit');
 submitStory(s,0);paused.method='worked';paused.reading='independent';check(!finishStoryNode(s).freshEvidence,'paused repeat cannot become fresh evidence');
}
console.log(`${checks} First Morning checks passed.`);
