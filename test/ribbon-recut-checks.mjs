import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {recutCases,recutCase,recutStage,recutMove} from '../dist/ribbon-recut-core.mjs';
import {recutPage,recutSession,resetRecutSession} from '../dist/ribbon-recut-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {ensureGarden} from '../dist/garden-core.mjs';
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};

eq(recutCases.length,5,'five finite ribbons');
for(const c of recutCases){
 const endpoint=24*c.numerator/c.denominator;
 for(let stage=0;stage<c.stages.length;stage++){
  const m=recutStage(c,stage),d=c.stages[stage];
  eq(m.endpoint,endpoint,`${c.id} fixed endpoint`);
  eq(m.coloredCount,endpoint*d/24,`${c.id} exact colored count`);
  eq(m.boundaries,Array.from({length:d-1},(_,i)=>(i+1)*24/d),`${c.id} equal spaces`);
  ok(m.boundaries.every(Number.isInteger),`${c.id} 24-position cuts`);
  const v={caseId:c.id,stage,lastAction:null,exampleFrame:0};
  if(stage<c.stages.length-1){const split=recutMove(v,'split'),next=recutStage(c,split.stage);eq(split.lastAction,'split');ok(m.boundaries.every(p=>next.boundaries.includes(p)),`${c.id} old cuts survive`);const joined=recutMove(split,'join');eq(recutStage(c,joined.stage),m,`${c.id} split then join returns positions and counts`);eq(joined.lastAction,'join');}else eq(recutMove(v,'split'),null,`${c.id} terminal split disabled`);
  if(stage===0)eq(recutMove(v,'join'),null,`${c.id} initial join disabled`);
 }
 const first=recutStage(c,0);eq(first.coloredCount,c.numerator,`${c.id} supplied initial fraction`);
}
eq(recutCase('unknown'),null);eq(recutMove({caseId:'unknown',stage:0},'split'),null);
resetRecutSession();const state={garden:{},workshop:{experiments:[]}};ensureGarden(state);const before=structuredClone(state);
const chooser=workshopPage(state,'recut','test-explorer');ok(chooser.includes('Choose a ribbon job'));ok(!chooser.includes('data-recut-endpoint'),'chooser does not show a countable board');
for(const c of recutCases)ok(chooser.includes(`data-recut-start="${c.id}"`),`chooser includes ${c.id}`);
eq(state,before,'page leaves all old saved roots untouched');eq(recutSession(),null,'opening creates no case');
ok(workshopPage(state).includes('href="#workshop/recut"'),'Workshop hub links to bench');
ok(!workshopNotes(state).includes('Ribbon Recut'),'no report section or saved result');
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'),ui=readFileSync(new URL('../dist/ribbon-recut-ui.mjs',import.meta.url),'utf8');
ok(app.includes('resetRecutSession()')&&app.includes('workshopPage(state,slug,explorerStore.active.id)'),'host threads route and explorer identity');
ok(index.includes('ribbon-recut.css'),'styles loaded');
ok(!ui.includes('save(')&&!ui.includes('localStorage'),'transient bench cannot persist');
console.log(`Ribbon Recut: ${n} assertions passed.`);
