import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ensureBroad,beginTrail,trailQuestion,makeBroadObservation,recordTrail} from '../dist/broad-core.mjs';
import {areas} from '../dist/broad-content.mjs';
import {ensurePlantings,earnPlanting,plantSeed,startOpenTask,openTasks,openNumberTaskPage,finishOpenTask,plantingPage} from '../dist/plantings.mjs';
import {spoken,chooseLocalVoice} from '../dist/play-media.mjs';
import {renderModel} from '../dist/broad-ui.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const fresh=()=>{const s=freshState();ensureBroad(s);ensurePlantings(s);return s;};
for(const area of areas){
 const s=fresh();beginTrail(s,area.id);
 for(let i=0;i<2;i++){const q=trailQuestion(s,area.id);recordTrail(s,makeBroadObservation(q,{attempts:[]},'checkin',true));}
 const event=`walk:${area.id}:${s.broad.trails[area.id].visits}`;
 check(s.broad.trails[area.id].complete&&earnPlanting(s,event,area.id),'skipped walk earns participation');
 check(!earnPlanting(s,event,area.id)&&s.plantings.pending.length===1,'same walk cannot earn twice');
 const evidence=JSON.stringify(s.broad);check(plantSeed(s,event,0,0),'packet plants');
 check(!plantSeed(s,event,0,1)&&s.plantings.plots.length===1,'planted packet cannot be spent twice');
 const r=restoreState(JSON.stringify(s));ensurePlantings(r);check(!earnPlanting(r,event,area.id),'placed event survives reload dedup');
 check(JSON.stringify(s.broad)===evidence,'planting never changes evidence');
}
{
 const s=fresh();for(const kind of ['hint','model','helper']){check(earnPlanting(s,`help:${kind}`,null,kind),'first help grows a decoration');check(!earnPlanting(s,`help:${kind}`,null,kind),'same help never earns twice');}
 for(let i=0;i<14;i++)earnPlanting(s,`visit:${i}`,'number');
 for(let i=0;i<12;i++)check(plantSeed(s,s.plantings.pending[0].event,0,i),'first bed slot plants');
 check(!plantSeed(s,s.plantings.pending[0].event,0,0),'occupied plot rejects packet');
 check(!plantSeed(s,s.plantings.pending[0].event,2,0),'cannot jump over the next bed');
 check(plantSeed(s,s.plantings.pending[0].event,1,0),'filled first bed opens another');
 check(plantingPage(s,1).includes('Earlier patch'),'previous beds remain reachable');
}
for(const task of openTasks()){
 const s=fresh(),before=JSON.stringify(s.broad);startOpenTask(s,task.id);const event=s.plantings.openDraft.event;
 openNumberTaskPage(s,task.id);openNumberTaskPage(s,task.id);check(s.plantings.openDraft.event===event,'rerender keeps invitation identity');
 check(finishOpenTask(s,'later')&&!finishOpenTask(s,'later'),'Not today acknowledges only once');
 check(s.plantings.pending.length===1&&JSON.stringify(s.broad)===before,'open visit grows one plant without skill records');
 check(!('correct' in s.plantings.openRecords[0])&&!('attempts' in s.plantings.openRecords[0]),'open invitation has no scoring');
 startOpenTask(s,task.id);check(s.plantings.openDraft.event!==event,'explicit revisit has a new invitation');
}
for(const [id,bad] of [['many-rectangles',{type:'array'}],['estimate-seeds',{type:'counters',count:Infinity}],['wonder-fractions',{type:'fraction',parts:2,shaded:12}],['wonder-patterns',{type:'pattern',values:[1,2],step:'bad'}]]){
 const s=fresh();startOpenTask(s,id);s.plantings.openDraft.model=bad;check(!/NaN|undefined|Infinity/.test(openNumberTaskPage(s,id)),'bad open model recovers alone');
}
{
 const s=fresh();startOpenTask(s,'many-rectangles');s.plantings.openDraft.model={type:'array',rows:2,cols:12,item:'cup'};
 const html=openNumberTaskPage(s,'many-rectangles');check(html.includes('2 rows')&&html.includes('Try 1 row of 24')&&html.includes('Try 4 rows of 6'),'wide rectangles provide more than two geometric shapes');
 const q=areas.find(a=>a.id==='geometry').checkin[0];const html2=renderModel(q,{},false,{mode:'checkin'});check(!html2.includes('aria-label="triangle'),'shape identification accessible description does not name its answer');
}
for(const [input,expected] of [['7 × 8 = __','7 times 8 equals blank'],['12 ÷ 3 − 1','12 divided by 3 minus 1'],['A 3-by-4 bed is 12 cm by 2 m.','A 3 by 4 bed is 12 centimeters by 2 meters.'],['Come explore with Pip.','Come explore with Pip.']])check(spoken(input)===expected,'English math speech '+input);
check(spoken('Le ruban mesure 3 cm. 4 × 2 = 8','fr')==='Le ruban mesure 3 cm. 4 × 2 = 8','French text stays French');
check(chooseLocalVoice([{name:'Remote',lang:'en-US',localService:false}])===null,'no remote voice fallback');
console.log(`${checks} planting, open invitation, recovery and speech checks passed.`);
