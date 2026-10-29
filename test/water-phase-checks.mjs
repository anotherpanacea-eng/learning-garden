import assert from 'node:assert/strict';
import {phaseStages,phaseStage,phaseStep,phaseDots,phaseRadius,phaseTemperature,waterPhasePage,resetWaterPhase} from '../dist/water-phase.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
const expected=[[-5,12,0],[0,12,0],[0,8,4],[0,4,8],[0,0,12],[5,0,12]];
for(let i=0;i<6;i++){
 const s=phaseStage(i),ds=phaseDots(i);assert.deepEqual([s.temperature,s.solid,s.liquid],expected[i]);checks++;
 ok(ds.length===12&&new Set(ds.map(d=>d.id)).size===12,'twelve unique identities');
 ok(ds.every(d=>d.radius===phaseRadius),'fixed radius');
 assert.deepEqual(ds.filter(d=>d.phase==='liquid').map(d=>d.id),Array.from({length:s.liquid},(_,j)=>j+1));checks++;
 for(let a=0;a<12;a++)for(let b=a+1;b<12;b++)ok(Math.hypot(ds[a].x-ds[b].x,ds[a].y-ds[b].y)>=2*phaseRadius+4,'no overlapping dots');
 ok(phaseStep(i,1)===Math.min(5,i+1)&&phaseStep(i,-1)===Math.max(0,i-1),'both directions and bounds');
 ok(!/more energy has entered|has reached|still zero|all the ice has melted/i.test(s.body),'state-neutral copy');
}
for(const bad of [-1,6,NaN,null,'2',1.5])ok(phaseStage(bad)===null&&phaseDots(bad)===null&&phaseStep(bad,1)===null,'invalid stage isolated');
for(const bad of [0,2,null,'1'])ok(phaseStep(2,bad)===null,'invalid direction isolated');
assert.deepEqual(phaseDots(0),phaseDots(1));checks++;assert.deepEqual(phaseDots(4),phaseDots(5));checks++;
const footprint=ds=>(Math.max(...ds.map(d=>d.x))-Math.min(...ds.map(d=>d.x))+2*phaseRadius)*(Math.max(...ds.map(d=>d.y))-Math.min(...ds.map(d=>d.y))+2*phaseRadius);
ok(footprint(phaseDots(5))<footprint(phaseDots(0)),'liquid footprint smaller at identical scale');
const notebook={science:{version:99,visits:'retained'},large:'x'.repeat(550000)},before=JSON.stringify(notebook);const html=waterPhasePage(notebook,'synthetic');ok(JSON.stringify(notebook)===before,'page never changes saved records');ok(!/<video|\.mp4|<audio|fetch\(/i.test(html),'withheld movie absent');ok(html.includes('not equal energy or time')&&html.includes('Stage 1 of 6'),'categorical stage and initial label');ok(html.includes('minus five degrees Celsius'),'accessible temperature');ok(phaseTemperature(0)==='zero degrees Celsius','zero label');ok(html.includes('<table>')&&html.match(/<tr>/g).length===7,'six-row equivalent table');resetWaterPhase();ok(phaseStages.length===6,'finite model');console.log(`${checks} Water phase source assertions passed`);
