import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {writingTasks,taskSource} from '../dist/writing-table-content.mjs';
import * as c from '../dist/writing-table-core.mjs';
import {writingPage,writingNotes} from '../dist/writing-table-ui.mjs';
const copy=structuredClone;
export const cohesionIds=['holding-parcel','holding-unclear','holding-fix','holding-roof','holding-rain','holding-show','holding-short','holding-mill','holding-either'];
export const cohesionKeys={'holding-parcel':['parcel','package','it','bundle'],'holding-unclear':['it'],'holding-fix':'bun','holding-roof':'contrast','holding-rain':'result','holding-show':'addition','holding-short':'short','holding-mill':'mill','holding-either':'either'};
export const cohesionReport=s=>({title:'After the Storm: observations',exportedAt:'2026-10-31T12:00:00.000Z',note:'Synthetic supplied practice.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:recommendations(s),...s});
const options={canExport:s=>prepareProgressImport(JSON.stringify(cohesionReport(s),null,2)).ok};
export function cohesionSeed(){const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={payload:'Synthetic retained neighbour'};return s;}
export function fullCohesionNotebook(){
 const s=cohesionSeed();
 for(const t of writingTasks){c.openWritingTask(s,t.id,{canExport:()=>true});const r=c.writingView(s).record,src=r.source;
  if(src.kind==='sort')r.work={placements:copy(src.key)};
  else if(src.kind==='order')r.work={order:copy(src.key)};
  else if(src.kind==='break')r.work={boundary:src.key};
  else if(src.kind==='tap')r.work={taps:copy(cohesionKeys[t.id])};
  else r.work={choice:src.key};
  c.checkWritingTask(s,{canExport:()=>true});c.keepWritingTask(s,{canExport:()=>true});
  for(let i=1;i<30;i++)c.checkWritingTask(s,{canExport:()=>true});
  c.keepWritingTask(s,{canExport:()=>true});
 }
 return s;
}
export function cohesionFixtures(){
 const historical=cohesionSeed();c.openWritingTask(historical,'join-time',options);historical.writingDesk.records['join-time'].source.feedback.different.earlierUnused='Retained unused historical feedback.';
 const bad=cohesionSeed();c.openWritingTask(bad,'holding-parcel',options);bad.writingDesk.records['future-source']={source:{v:99,kind:'future'},work:{opaque:['retained']}};
 return {fresh:cohesionSeed(),full:fullCohesionNotebook(),historical,bad};
}
export function runCohesionChecks(){
 let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
 eq(writingTasks.length,24,'whole open shelf has twenty-four tasks');eq(writingTasks.filter(x=>x.bench==='holding').map(x=>x.id),cohesionIds,'independent nine-task order');
 for(const id of cohesionIds){
  const src=taskSource(id);ok(c.validWritingSource(src),id+' source readable');eq(src.key,cohesionKeys[id],'authored key');eq(src.teach.length,5,'card, example title and three manual steps');
  const selectable=src.kind==='tap'?src.parts.filter(x=>x.tap===true):src.choices;
  eq(Object.keys(src.feedback.different).sort(),selectable.filter(x=>!(Array.isArray(src.key)?src.key.includes(x.id):src.key===x.id)).map(x=>x.id).sort(),'authored feedback covers exactly non-key options');
  if(src.kind==='choice'){
   const correct=src.choices.find(x=>x.id===cohesionKeys[id]);ok(!src.choices.every(x=>x.id===correct.id||x.text.length<correct.text.length),'fitting answer is not the sole longest option');
   for(const choice of src.choices){const r=c.writingResult(src,{choice:choice.id});eq(r.outcome,choice.id===cohesionKeys[id]?'fit':'different','independent choice oracle');eq(r.feedback.at(-1),'Your draft is still here. You can change it.','continued exploration after every check');}
   if(src.preview)for(const choice of src.choices)eq(c.writingPreview(src,{choice:choice.id})[0].text,src.preview[choice.id],'literal chosen replacement, not a corrected choice');
  }else{
   for(let mask=0;mask<2**selectable.length;mask++){
    const taps=selectable.filter((x,i)=>mask&(1<<i)).map(x=>x.id),expected=cohesionKeys[id],fit=taps.length===expected.length&&expected.every(k=>taps.includes(k)),r=c.writingResult(src,{taps});
    eq(r.outcome,!taps.length?'incomplete':fit?'fit':'different','independent unordered subset oracle');
    const wrong=selectable.filter(x=>taps.includes(x.id)&&!expected.includes(x.id)).map(x=>src.feedback.different[x.id]);
    eq(r.feedback.filter(x=>wrong.includes(x)),wrong,'extra-word feedback follows draft order');
    if(expected.some(k=>!taps.includes(k)))ok(r.feedback.includes(src.feedback.missing),'missing feedback does not name untapped targets');
   }
   eq(c.writingResult(src,{taps:[...cohesionKeys[id]].reverse()}).outcome,'fit','tap order is ungraded');
   ok(c.sameWritingWork({taps:cohesionKeys[id]},{taps:[...cohesionKeys[id]].reverse()}),'matching kept check compares tap sets');
  }
  const s=cohesionSeed(),neighbour=copy(s.syntheticOther);ok(c.openWritingTask(s,id,options).ok,'explicit open');const r=c.writingView(s).record;
  if(src.kind==='tap')for(const tap of cohesionKeys[id])ok(c.setWritingMaterial(s,{tap},options).ok,'actual toggle action');
  else ok(c.setWritingMaterial(s,{choice:cohesionKeys[id]},options).ok,'actual choice action');
  ok(c.checkWritingTask(s,options).ok,'actual check');eq(c.writingView(s).record.checks.at(-1).outcome,'fit');ok(c.keepWritingTask(s,options).ok,'actual Keep');const first=copy(c.writingView(s).record.firstKept);
  if(src.kind==='tap'){ok(c.setWritingMaterial(s,{clear:true},options).ok,'Clear taps');eq(c.writingView(s).record.work.taps,[]);}
  else c.setWritingMaterial(s,{choice:src.choices.find(x=>x.id!==cohesionKeys[id]).id},options);
  c.checkWritingTask(s,options);c.keepWritingTask(s,options);eq(c.writingView(s).record.firstKept,first,'first kept version survives new edits/checks');eq(s.syntheticOther,neighbour,'unrelated root exact');
  const before=copy(s);ok(!c.setWritingMaterial(s,src.kind==='tap'?{tap:cohesionKeys[id][0]}:{choice:cohesionKeys[id]},{canExport:()=>false}).ok,'real mutation refuses failed preflight');eq(s,before,'refusal retains whole notebook');
 }
 const historical=cohesionFixtures().historical,unused=copy(historical.writingDesk.records['join-time'].source);ok(c.validWritingSource(unused),'unused historical feedback remains readable');c.setWritingMaterial(historical,{choice:'later'},options);c.checkWritingTask(historical,options);ok(!c.writingView(historical).record.checks.at(-1).feedback.includes(unused.feedback.different.earlierUnused),'unselectable feedback never displayed');eq(c.writingView(historical).record.source,unused,'historical source exact after check');
 const imported=prepareProgressImport(JSON.stringify(cohesionReport(historical),null,2));ok(imported.ok,'actual Notes format imports');eq(imported.state.writingDesk,historical.writingDesk,'historical unused feedback survives transfer');
 const opaque=cohesionSeed();c.openWritingTask(opaque,'bakery',options);opaque.writingDesk.records.bakery.source.preview={earlier:['opaque']};const retained=copy(opaque.writingDesk.records.bakery.source);ok(c.validWritingSource(retained),'non-choice opaque preview remains readable');ok(writingPage(opaque,'synthetic').includes('Waiting strips'),'ordinary sort preview remains visible');ok(c.setWritingMaterial(opaque,{strip:'bread',heading:'sale'},options).ok,'historical sort stays editable');eq(opaque.writingDesk.records.bakery.source,retained,'opaque field survives edit');const opaqueImport=prepareProgressImport(JSON.stringify(cohesionReport(opaque),null,2));ok(opaqueImport.ok,'opaque source exports in real Notes format');eq(opaqueImport.state.writingDesk.records.bakery.source,retained,'opaque field survives Notes transfer');
 const old=cohesionSeed();c.openWritingTask(old,'holding-parcel',options);const r=c.writingView(old).record;r.source.parts=[{id:'earlier-box',text:'Box',tap:true},{id:'space',text:' and '},{id:'earlier-it',text:'it',tap:true}];r.source.key=['earlier-it'];r.source.feedback.missing='An earlier target is waiting.';r.source.feedback.different={'earlier-box':'An earlier different word.',earlierUnused:'Kept opaque line.'};
 ok(c.validWritingRecord(r),'historical tap source has its own words/key');c.setWritingMaterial(old,{tap:'earlier-it'},options);c.checkWritingTask(old,options);eq(c.writingView(old).record.checks.at(-1).outcome,'fit','historical tap uses own key, not current catalogue');
 const raw=copy(old);writingPage(old,'synthetic');writingNotes(old);eq(old,raw,'readers do not normalize historical source');
 const s=fullCohesionNotebook();eq(Object.keys(s.writingDesk.records).length,24);ok(Object.values(s.writingDesk.records).every(r=>r.checks.length===24&&r.count===30&&r.firstKept&&r.latestKept),'all twenty-four maximum retained histories and versions');
 const report=cohesionReport(s),restored=prepareProgressImport(JSON.stringify(report,null,2));ok(restored.ok,'maximum authored notebook fits actual Notes import');eq(restored.state.writingDesk,s.writingDesk,'full sources and checks transfer exact');
 const next=cohesionSeed();for(const task of writingTasks){ok(c.nextWritingTask(next,options).ok);eq(next.writingDesk.currentId,task.id);}c.nextWritingTask(next,options);eq(next.writingDesk.currentId,'bakery','whole twenty-four task order wraps');
 console.log(`Writing cohesion: ${n} checks passed (nine tasks, tap subsets, old-source compatibility, snapshots and actual full-history transfer).`);return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runCohesionChecks();
