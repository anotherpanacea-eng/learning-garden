import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {ensureBroad} from '../dist/broad-core.mjs';
import {areas} from '../dist/broad-content.mjs';
import {broadHome} from '../dist/broad-ui.mjs';
import {ensurePlantings,startOpenTask,openTasks,openNumberTaskPage,finishOpenTask} from '../dist/plantings.mjs';
import {learningInvitations} from '../dist/learning-invitations.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const s=freshState();ensureBroad(s);ensurePlantings(s);
// Fictional pending work: changing the narrative must not consume another visit.
s.cafe={pending:'synthetic-order'};s.science={pending:'synthetic-puddle'};s.postOffice={pending:'synthetic-rival'};
startOpenTask(s,'many-rectangles');Object.assign(s.plantings.openDraft,{model:{type:'array',rows:2,cols:12,item:'cup',counted:[0,4]},input:'kept idea',rectangles:[[1,24]]});
const before=structuredClone(s),html=broadHome(s,null,null);
assert.deepEqual(s,before);checks++;
for(const href of ['#wonder/estimate-seeds','#wonder/many-rectangles','#activities/measurement','#checkin','#activities','#facts'])check(html.includes(`href="${href}"`),'working entry '+href);
for(const a of areas)check(html.includes(`data-trail="${a.id}"`)&&html.includes(`href="#activities/${a.id}"`),'both entrances remain for '+a.id);
check((html.match(/data-garden-flower=/g)||[]).length===12,'interactive counting flowers remain');
const board=html.split('<section class="garden-requests"')[1].split('<section class="resume-strip"')[0];
check(!/\b19\b|#living/.test(board),'request board reveals no hidden count or future route');
check(html.includes('data-speak=')&&!html.includes('data-story-audio'),'purpose narration has no task support record');
const kept=structuredClone(s.plantings.openDraft),broad=JSON.stringify(s.broad),other=JSON.stringify([s.cafe,s.science,s.postOffice]);
openNumberTaskPage(s,'many-rectangles');assert.deepEqual(s.plantings.openDraft,kept);checks++;
for(const response of ['tried','later']){
 if(!s.plantings.openDraft)startOpenTask(s,'many-rectangles');
 check(finishOpenTask(s,response)&&!finishOpenTask(s,response),'participation acknowledged exactly once '+response);
}
check(s.plantings.pending.length===2&&JSON.stringify(s.broad)===broad,'participation stays separate from skill evidence');
check(JSON.stringify([s.cafe,s.science,s.postOffice])===other,'other pending destinations preserved');
check(openTasks().find(t=>t.id==='estimate-seeds').model.count===19,'original seed count retained');
const rectangle=openTasks().find(t=>t.id==='many-rectangles');check(rectangle.model.rows*rectangle.model.cols===24,'original rectangle task retained');
startOpenTask(s,'estimate-seeds');const closed=openNumberTaskPage(s,'estimate-seeds');check(!closed.includes('data-open-model-action')&&closed.includes('data-open-action="open-jar"'),'jar still needs explicit opening');
for(const context of ['water','orchard','measurement','cafe'])check(learningInvitations(context).includes('href="#numbers"'),'return invitation from '+context);
for(const href of ['#science','#orchard','#cafe'])check(learningInvitations('numbers').includes(`href="${href}"`),'outward invitation '+href);
console.log(`${checks} Number Garden story and saved-work checks passed.`);
