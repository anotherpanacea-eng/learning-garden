import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ensureBroad,noteLegacyExposure} from '../dist/broad-core.mjs';
import {helpers,acceptsAnswer,helperLimit} from '../dist/help-content.mjs';
import {parisStories} from '../dist/paris-library.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {ensureGarden,currentVisit,startVisit,resumeVisit,storyDraft,openStoryHelp,submitStoryHelp,submitStory,finishStoryNode,noteGardenFactExposure} from '../dist/garden-core.mjs';
import {helpPage} from '../dist/help-ui.mjs';
import {storyPage,gardenNotes} from '../dist/garden-ui.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const fresh=()=>{const s=freshState();ensureBroad(s);ensureGarden(s);return s;};
function reach(s,id){const n=storyNodes[id];if(n.parisStory){s.garden.seen=parisStories.filter(x=>x.destination===n.parisDestination&&x.id!==n.parisStory).map(x=>x.variants[1][0]);startVisit(s,'paris',{destination:n.parisDestination,variant:n.parisVariant});}else startVisit(s,n.entrance);let steps=0;while(currentVisit(s)?.node!==id&&steps++<10){storyDraft(s);finishStoryNode(s,true);}assert.equal(currentVisit(s)?.node,id,'helper fixture reaches requested task');}
check(Object.values(storyNodes).filter(n=>n.type==='task').every(n=>helpers[n.id]),'every scored story task has help');
for(const [id,h] of Object.entries(helpers)){
 const s=fresh();reach(s,id);const d=storyDraft(s);d.input='Synthetic waiting input';d.choice=1;d.method='worked';d.reading='together';
 const n=storyNodes[id],wrong=n.kind==='number'?999:n.choices.findIndex((_,i)=>!acceptsAnswer(n,i));submitStory(s,wrong);
 const original=JSON.stringify(d.attempts),visit=currentVisit(s).id;
 check(openStoryHelp(s)===h&&d.helpUsed,'explicit opening marks support');
 check(!finishStoryNode(s,true)&&!submitStory(s,n.answer),'open helper cannot finish or answer original');
 check(helpPage(s,d).includes('Return to my question')&&helperLimit(h)>0,'helper representation renders');
 check(!submitStoryHelp(s,h.kind==='choice'?h.choices.findIndex((_,i)=>!acceptsAnswer(h,i)):999)&&submitStoryHelp(s,h.answer),'helper permits retry');
 check(JSON.stringify(d.attempts)===original&&currentVisit(s).node===id,'example never advances original');
 const restored=restoreState(JSON.stringify(s));ensureBroad(restored);ensureGarden(restored);const rd=storyDraft(restored);
 check(rd.helper.open&&rd.helper.attempts.at(-1)===h.answer&&rd.input==='Synthetic waiting input'&&rd.choice===1&&rd.method==='worked'&&rd.reading==='together','open helper and original survive reload');
 rd.helper.open=false;submitStory(restored,n.answer);rd.method='knew';rd.reading='independent';const o=finishStoryNode(restored);
 check(o.helpUsed&&o.supported&&!o.independent&&!o.freshEvidence&&o.helper.attempts.length===2,'helper attempts separate from evidence');
 check(gardenNotes(restored).includes('Smaller example opened.'),'notes show help separately');
 o.helper={exampleId:h.id,open:false};ensureGarden(restored);check(gardenNotes(restored).includes('Example answers tried: None'),'malformed recorded helper repaired without discarding original observation');
}
for(let i=0;i<4;i++){
 const s=fresh();reach(s,'cafe-substitute');const d=storyDraft(s),valid=[0,2].includes(i);
 check(submitStory(s,i)===valid,'each menu option accepted correctly');
 check(storyPage(s,d).includes(storyNodes['cafe-substitute'].answerFeedback[i]),'each menu option explains fit');
 d.method='worked';d.reading='independent';const o=finishStoryNode(s);check(!!o===valid,'UI and recording share acceptance');
 if(valid)check(o.correct&&o.firstCorrect&&o.acceptedAnswers.includes(i),'alternative gets correct evidence');
}
{
 const s=fresh();reach(s,'message-markers');const first=currentVisit(s).id,d=storyDraft(s);openStoryHelp(s);submitStoryHelp(s,6);d.helper.open=false;
 const other=startVisit(s,'cafe').id;storyDraft(s);finishStoryNode(s,true);const cd=storyDraft(s);
 noteLegacyExposure(s,[3,4]);noteGardenFactExposure(s,[3,4]);check(d.knownFact&&cd.knownFact,'commuted café exposure updates paused original story');
 resumeVisit(s,first);check(storyDraft(s).helpUsed&&storyDraft(s).helper.attempts[0]===6,'switching paths preserves helper');
 const h=helpers['message-markers'];for(const pair of h.facts){noteLegacyExposure(s,pair);noteGardenFactExposure(s,pair);}check(s.broad.seenFacts.includes('2x3'),'smaller example registers fact');
 d.helper={exampleId:'wrong',open:true};ensureGarden(s);check(d.helpUsed&&!d.helper,'malformed helper recovers without erasing support');
 openStoryHelp(s);Object.assign(d.helper,{steps:900,spotlight:-3,attempts:['bad',6],choice:'bad'});ensureGarden(s);check(d.helper.steps===2&&d.helper.spotlight===null&&d.helper.attempts.length===1&&d.helper.choice===null,'helper restored values bounded');
 d.helper.open=false;submitStory(s,12);d.method='knew';const o=finishStoryNode(s);check(o.firstCorrect&&!o.independent&&o.supported,'first original answer after help stays supported');
 resumeVisit(s,other);check(currentVisit(s).node==='cafe-portions','waiting café cursor retained');
}
{
 const s=fresh();reach(s,'cafe-portions');const d=storyDraft(s);submitStory(s,12);d.method='counted';check(finishStoryNode(s).correct,'four equal groups');
 const sd=storyDraft(s);submitStory(s,2);sd.method='worked';check(finishStoryNode(s).correct,'stock shortfall');check(finishStoryNode(s).status==='invitation'&&currentVisit(s).finished,'café own unscored ending');
 const old=fresh();old.baseline.index=2;old.practice.push({questionId:'synthetic',skill:'facts',attempts:[24],status:'answered',fact:[4,6]});delete old.garden;const r=restoreState(JSON.stringify(old));ensureGarden(r);check(r.baseline.index===2&&r.practice.length===1&&!r.garden.visits.length,'legacy records unaffected');
}
console.log(`${checks} responsive-help and café checks passed.`);
