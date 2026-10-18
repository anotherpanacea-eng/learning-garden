import assert from 'node:assert/strict';
import fs from 'node:fs';
import {areas} from '../dist/broad-content.mjs';
import * as b from '../dist/broad-core.mjs';
import {freshState,restoreState} from '../dist/core.mjs';
import {adjustModel,renderModel} from '../dist/broad-ui.mjs';
let checks=0;
const check=(x,m)=>{assert.ok(x,m);checks++;};
const state=()=>{const s=freshState();b.ensureBroad(s);return s;};
const active=(q,extra={})=>({attempts:[q.answer],method:'worked',...extra});
const graph=JSON.parse(fs.readFileSync(new URL('../dist/marble-map.json',import.meta.url),'utf8'));
const ids=new Set(graph.topics.map(t=>t.id));
check(areas.length===7&&b.broadItems().length===49,'content counts');
check(new Set(b.broadItems().map(q=>q.id)).size===49,'unique ids');
for(const q of b.broadItems())check(ids.has(q.topicId)&&Number.isFinite(q.answer)&&(q.kind!=='choice'||!!q.choices[q.answer]),q.id);
check(graph.dependencies.every(e=>ids.has(e.topicId)&&ids.has(e.prerequisiteId)),'map endpoints');
for(const a of areas){
  for(const path of ['independent','support','retry','skip']){
    const s=state();b.beginTrail(s,a.id);const q=b.trailQuestion(s,a.id);
    const x=active(q,path==='support'?{hinted:true}:path==='retry'?{attempts:[-1,q.answer]}:path==='skip'?{attempts:[]}:{});
    b.recordTrail(s,b.makeBroadObservation(q,x,'checkin',path==='skip'));
    check(b.trailQuestion(s,a.id).id===a.checkin[path==='independent'?3:path==='skip'?2:0].id,a.id+' '+path);
  }
  const s=state();b.beginTrail(s,a.id);for(let i=0;i<2;i++){const q=b.trailQuestion(s,a.id);b.recordTrail(s,b.makeBroadObservation(q,active(q),'checkin'));}
  check(s.broad.trails[a.id].complete,'pair completes');
  b.beginTrail(s,a.id,true);for(let i=0;i<2;i++){const q=b.trailQuestion(s,a.id);b.recordTrail(s,b.makeBroadObservation(q,{attempts:[]},'checkin',true));}
  check(b.suggestActivity(s,a.id,graph).item.id===a.activities[1].id,'skip-only revisit neutral');
  const afterTeaching=b.makeBroadObservation(a.activities[1],active(a.activities[1],{lessonSeen:true}),'activity');
  check(afterTeaching.supported&&!afterTeaching.freshEvidence&&!afterTeaching.independent,'teaching distinct');
}
const s=state();s.broad.journey={ids:areas.map(a=>a.id),index:6,active:true};b.beginTrail(s,'reasoning');
for(let i=0;i<2;i++){const q=b.trailQuestion(s,'reasoning');b.recordTrail(s,b.makeBroadObservation(q,{attempts:[]},'checkin',true));}
check(!s.broad.journey.active,'last pair finishes journey');
s.broad.journey.active=true;b.beginTrail(s,'reasoning');check(!s.broad.journey.active,'completed final area finishes revisit journey');
const old=freshState();old.practice.push({questionId:'old',skill:'facts',attempts:[24],status:'answered',fact:[6,4]});old.baseline.draft={questionId:'groups',attempts:[],hinted:true};
const migrated=restoreState(JSON.stringify(old));b.ensureBroad(migrated);check(migrated.practice.length===1&&migrated.baseline.draft.hinted,'legacy retained');
const q=b.itemById('operations-anchor');check(b.familiarity(migrated,q).knownFact&&b.familiarity(migrated,q).priorExposureUnknown,'legacy commuted fact carried');
const paused=state();paused.broad.drafts['checkin:operations-anchor']={attempts:[]};b.noteLegacyExposure(paused,[6,4]);check(paused.broad.drafts['checkin:operations-anchor'].knownFact,'paused draft exposed by commuted pair');
const n=areas[0].activities[2],x={model:{type:'place',hundreds:3,tens:10,ones:7}};adjustModel(n,x,'trade-tens');check(x.model.hundreds===4&&x.model.tens===0&&x.model.ones===7,'hundreds trade invariant');
for(const a of areas)for(const q of a.activities){const x={};for(const action of ['reset','row-add','shade-add','pattern-next','turn','end-right','counter-add'])adjustModel(q,x,action);check(renderModel(q,x,true).includes('Reset the picture'),'model renders '+q.id);}
const sym=areas.find(a=>a.id==='geometry').checkin[1];check(!renderModel(sym,{},false).includes('#b93e2c'),'symmetry unmarked');
console.log(checks+' expanded-math checks passed.');
