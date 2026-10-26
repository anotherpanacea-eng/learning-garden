import assert from 'node:assert/strict';
import {freshState,recommendations,restoreStateResult} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {makeWaterSource,waterFamilies,waterSource} from '../dist/water-shares-content.mjs';
import * as W from '../dist/water-shares-core.mjs';

let checks=0,gridCases=0;
const ok=(value,label)=>{assert.ok(value,label);checks++;};
const eq=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
const clone=structuredClone,source=clone(waterSource);
const seed=()=>initializeExplorerState(freshState());
// The actual pretty-notes envelope, containing only synthetic observations.
const report=state=>({title:'After the Storm: observations',exportedAt:'2026-01-01T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(state),...state});
const serialize=state=>JSON.stringify(report(state),null,2);
const options={canExport:state=>prepareProgressImport(serialize(state)).ok};
const work=state=>W.waterView(state).work;
const accept=(result,label)=>{ok(result?.ok,label||result?.error);return result;};
function refuse(state,action,label){const before=clone(state);ok(!action().ok,label);eq(state,before,`${label}: exact atomic refusal`);}
function make(s=source){const state=seed();accept(W.startWater(state,{...options,source:s}));return state;}
const edit=(state,kind,value)=>accept(W.editWater(state,kind,value,options));
const bar=(state,row,units)=>edit(state,'bar',{row,units});
function fill(state,viewId){edit(state,'view',viewId);for(const row of W.viewWater(work(state).source,viewId).rows)bar(state,row.id,row.units);}
function roundTrip(state,label){const before=clone(state.waterShares),result=prepareProgressImport(serialize(state));ok(result.ok,`${label}: actual report imports`);eq(result.state.waterShares,before,`${label}: import keeps exact root`);eq(restoreStateResult(JSON.stringify(state)).state.waterShares,before,`${label}: ordinary restore keeps opaque root`);return result.state;}

// These numbers, row identifiers and request positions are independently
// transcribed from spec 240. No production matching helper supplies the oracle.
const tables=[
 {cups:100,id:'all',total:200,rows:[['saline',195],['fresh',5]]},
 {cups:100,id:'fresh',total:200,rows:[['ice',138],['ground',60],['other',2]]},
 {cups:200,id:'all',total:400,rows:[['saline',390],['fresh',10]]},
 {cups:200,id:'fresh',total:400,rows:[['ice',276],['ground',120],['other',4]]}
];
const tableSources=new Map([100,200].map(cups=>[cups,makeWaterSource('fresh-amount',cups)]));
function oracle(table,values){
 const missing=table.rows.filter(([id])=>values[id]===null).map(([id])=>id);
 const sumHalf=table.rows.reduce((n,[id])=>n+(values[id]===null?0:values[id]),0);
 const wrongRows=table.rows.filter(([id,units])=>values[id]!==units).map(([id])=>id);
 return {outcome:missing.length?'missing':sumHalf!==table.total?'total':wrongRows.length?'rows':'match',sumHalf,missing,wrongRows};
}
function compare(table,values){
 const got=W.assessWater(tableSources.get(table.cups),table.id,values),expected=oracle(table,values);
 eq(got.outcome,expected.outcome,'independent graph diagnostic precedence');
 eq(got.sumHalf,expected.sumHalf,'independent integer partial/complete sum');
 eq(got.missing,expected.missing,'null is unentered; zero is entered');
 if(!expected.missing.length&&expected.sumHalf===table.total)eq(got.wrongRows,expected.wrongRows,'total-preserving wrong rows are named');
 eq(got.feedback,source.copy.checks[expected.outcome],'source-owned diagnostic text');gridCases++;
}
for(const table of tables){
 const s=makeWaterSource('fresh-amount',table.cups),v=W.viewWater(s,table.id);
 ok(W.validWaterSource(s),'authored source readable');
 eq(v.rows.map(r=>[r.id,r.units]),table.rows,'pinned independent model table');eq(v.totalHalf,table.total);
 eq(table.rows.reduce((sum,[,n])=>sum+n,0),table.total,'each own whole closes exactly');
 if(table.id==='all'){
  const domain=[null,...Array.from({length:table.total+1},(_,i)=>i)];
  for(const saline of domain)for(const fresh of domain)compare(table,{saline,fresh});
 }else{
  const values=table.rows.map(([,n])=>[...new Set([null,0,table.total,n-2,n-1,n,n+1,n+2].filter(x=>x===null||x>=0&&x<=table.total))]);
  for(const ice of values[0])for(const ground of values[1])for(const other of values[2])compare(table,{ice,ground,other});
  for(let ice=0;ice<=table.total;ice++){
   const ground=table.total-ice;compare(table,{ice,ground,other:0});
  }
 }
}
eq(tables[2].rows.map(([,n])=>n),tables[0].rows.map(([,n])=>2*n),'doubling total doubles every all-water amount');
eq(tables[3].rows.map(([,n])=>n),tables[1].rows.map(([,n])=>2*n),'doubling total doubles every freshwater amount');
ok(/only.*freshwater/i.test(W.viewWater(source,'fresh').whole),'zoom names its narrower denominator');
ok(/all.*water/i.test(W.viewWater(source,'all').whole),'all-water view names its denominator');
ok(/not.*more water|not.*added more|not more water/i.test(source.copy.zoom),'equal drawn scale does not create water');

const families=['fresh-amount','fresh-store','other-share','which-whole','drinking','two-trays','ice-counts','underground'];
eq(waterFamilies.map(f=>f.id),families,'eight openly selected recurring request families');
const positions={100:[0,2,1,0,2,1,0,2],200:[2,1,0,2,1,0,2,1]};
const fits=[[/2½ model cups/,/5 model cups/],/Ice caps, glaciers and permanent snow/,/Several smaller stores.*ground ice.*soil moisture.*rivers/,/69% is of freshwater/,/Low salt does not establish drinking safety/,/fresh amount doubles from 2½ to 5/,/Ice is still water.*counted/,/Some groundwater is fresh.*some is saline/];
const views=['all','fresh','fresh','fresh','all','all','fresh','fresh'],positionCounts=[0,0,0];
for(const cups of [100,200])for(const [i,family] of families.entries()){
 const s=makeWaterSource(family,cups),q=s.question,keyPosition=q.choices.findIndex(c=>c.id===q.key);
 ok(W.validWaterSource(s));eq(s.id,`${family}-${cups}`);eq(s.cups,cups);eq(q.view,views[i]);
 eq(q.choices.length,3);eq(keyPosition,positions[cups][i],'authored fitting-choice position');positionCounts[keyPosition]++;
 ok((Array.isArray(fits[i])?fits[i][cups===100?0:1]:fits[i]).test(q.choices[keyPosition].text),'question fit agrees with independent science/whole contract');
 ok(q.choices.every(c=>c.feedback.length>20),'each tempting alternative has feedback');ok(q.hint&&q.example&&q.together,'guided help belongs to frozen source');
 const state=make(s);edit(state,'page','reader');
 for(const c of q.choices){accept(W.answerWater(state,c.id,options));const a=W.waterReply(work(state));ok(W.validWaterAnswer(a));eq(a.outcome,c.id===q.key?'fits':'again');eq(a.feedback,c.feedback);eq(a.source,s);eq(a.itemId,q.id);eq(a.tableAvailable,true);}
 roundTrip(state,`question ${s.id}`);
}
eq(positionCounts,[5,5,6],'sixteen keys are balanced across all three positions');
ok(source.cards.find(c=>c.id==='ground').text.includes('saturated zone'),'groundwater definition names saturated spaces');
ok(/soil moisture.*above.*water table/i.test(source.cards.find(c=>c.id==='other').text),'Other distinguishes soil moisture above water table');
ok(/ground ice.*permafrost/i.test(source.cards.find(c=>c.id==='other').text),'Other explicitly contains frozen ground');
ok(/not.*safe to drink|does not.*safe to drink/i.test(source.cards.find(c=>c.id==='other').text),'Other is not a drinking-safety claim');
eq(makeWaterSource('absent',100),null);eq(makeWaterSource('fresh-amount',150),null);

// Half units, native-control operations, view retention and frozen observations.
{
 const state=make();eq(work(state).source,source);eq(work(state).help,{observed:true,concept:[],reading:[]});
 eq(W.valuesWater(work(state),'all'),{saline:null,fresh:null});
 bar(state,'saline',195);bar(state,'fresh',0);accept(W.checkWater(state,options));
 const partial=clone(work(state).checks.at(-1));ok(W.validWaterCheck(partial));eq(partial.outcome,'total');eq(partial.sumHalf,195);eq(partial.tableAvailable,true);
 edit(state,'step',{row:'fresh',delta:1});eq(W.valuesWater(work(state)).fresh,1,'one half-cup increment is one stored integer');
 edit(state,'step',{row:'fresh',delta:-1});eq(W.valuesWater(work(state)).fresh,0);
 for(const units of [-1,201,0.5,NaN,Infinity,'5'])refuse(state,()=>W.editWater(state,'bar',{row:'fresh',units},options),'invalid quantity refused');
 bar(state,'fresh',null);accept(W.checkWater(state,options));eq(work(state).checks.at(-1).outcome,'missing');
 fill(state,'all');accept(W.checkWater(state,options));const matching=clone(work(state).checks.at(-1));eq(matching.outcome,'match');
 fill(state,'fresh');edit(state,'view','all');eq(W.valuesWater(work(state)),{saline:195,fresh:5},'switching views preserves separate graph');
 edit(state,'clear',null);eq(W.valuesWater(work(state)),{saline:null,fresh:null});eq(W.valuesWater(work(state),'fresh'),{ice:138,ground:60,other:2},'clear is limited to current view');
 eq(work(state).checks[0],partial);eq(work(state).checks[2],matching,'later bar changes do not rewrite check');
 roundTrip(state,'graph editing and checks');
 const key=state.waterShares.current,frozen=clone(work(state));accept(W.startWater(state,{...options,family:'fresh-store',cups:200}));
 eq(state.waterShares.visits[key],frozen,'new request preserves prior graph and results');accept(W.resumeWater(state,key,options));eq(work(state),frozen);
}

// Fulfillment belongs to an immutable keep-time snapshot, scoped to this reader.
{
 const state=make();fill(state,'all');ok(!W.waterReady(work(state)),'chart alone is not ready');
 accept(W.keepWater(state,options));const beforeAnswer=clone(work(state).kept[0]);ok(W.validWaterKeep(beforeAnswer));eq(beforeAnswer.fulfilled,false);eq(beforeAnswer.answer,null);
 edit(state,'page','reader');accept(W.answerWater(state,source.question.key,options));ok(W.waterReady(work(state)),'matching requested chart plus fitting reply is ready');
 accept(W.keepWater(state,options));const fulfilled=clone(work(state).kept[1]);eq(fulfilled.fulfilled,true);eq(fulfilled.answer,W.waterReply(work(state)));eq(fulfilled.tableAvailable,true);
 eq(work(state).kept[0],beforeAnswer,'later answer cannot fulfill earlier keep');
 fill(state,'fresh');accept(W.keepWater(state,options));eq(work(state).kept[2].outcome,'match');eq(work(state).kept[2].fulfilled,false,'a different whole does not fulfill reader');
 edit(state,'page','reader');accept(W.answerWater(state,source.question.choices.find(c=>c.id!==source.question.key).id,options));
 ok(!W.waterReady(work(state)),'wrong retry removes current readiness');eq(work(state).kept[1],fulfilled,'earlier fulfilled keep stays fulfilled after wrong retry');
 edit(state,'view','all');bar(state,'fresh',4);eq(work(state).kept[1],fulfilled);roundTrip(state,'immutable requested-view fulfillment');
}

// Observation channels and first/latest timing are independent of later help.
{
 const state=make();bar(state,'fresh',1);let admitted=false;
 accept(W.supportWater(state,'one',{canExport:candidate=>{admitted=true;eq(work(candidate).help.concept,[{forId:'all',kind:'one'}],'support is already recorded when revealed bars are admitted');eq(W.valuesWater(work(candidate)),{saline:195,fresh:1},'show one bar does not silently fill the other');eq(W.valuesWater(work(state)),{saline:null,fresh:1},'live draft waits for admission');return options.canExport(candidate);}}));ok(admitted);
 accept(W.supportWater(state,'fill',options));eq(W.valuesWater(work(state)),{saline:195,fresh:5});
 const reader=make();edit(reader,'page','reader');accept(W.supportWater(reader,'fill',options));eq(work(reader).help.concept,[{forId:'all',kind:'fill'}],'bar-reveal support belongs to its graph even from reader turn');accept(W.answerWater(reader,source.question.key,options));eq(work(reader).answer.first.helpBefore.concept,[],'graph reveal is not relabeled as reader help');accept(W.checkWater(reader,options));eq(work(reader).checks[0].helpBefore.concept,[{forId:'all',kind:'fill'}]);
}
{
 const state=make();fill(state,'all');accept(W.checkWater(state,options));const unhelped=clone(work(state).checks[0]);
 for(const kind of ['hint','example','together','one','fill','half','zoom','teach','card-ice','meaning','audio'])accept(W.supportWater(state,kind,options));
 const graphHelp=clone(work(state).help);accept(W.supportWater(state,'audio',options));eq(work(state).help,graphHelp,'duplicate requests consume no slot');
 accept(W.checkWater(state,options));const helped=work(state).checks.at(-1);
 eq(unhelped.helpBefore,{observed:true,concept:[],reading:[]});ok(helped.helpBefore.concept.every(h=>h.forId==='all'));ok(helped.helpBefore.reading.every(h=>h.forId==='all'));
 eq(helped.helpBefore.reading.map(r=>r.kind).sort(),['audio','meaning'],'reading channels are distinct from concept help');
 edit(state,'page','reader');const wrong=source.question.choices.find(c=>c.id!==source.question.key).id;accept(W.answerWater(state,wrong,options));const first=clone(work(state).answer.first);
 eq(first.outcome,'again');eq(first.helpBefore.concept,[],'graph help does not masquerade as reader help');
 accept(W.supportWater(state,'hint',options));accept(W.supportWater(state,'audio',options));accept(W.answerWater(state,source.question.key,options));const latest=clone(work(state).answer.latest);
 eq(work(state).answer.first,first);eq(latest.outcome,'fits');eq(latest.helpBefore.concept,[{forId:source.question.id,kind:'hint'}]);eq(latest.helpBefore.reading,[{forId:source.question.id,kind:'audio'}]);
 accept(W.skipWater(state,options));ok(W.validWaterSkip(work(state).answer.skipped));eq(work(state).answer.first,first);eq(work(state).answer.latest,latest);eq(W.waterReply(work(state)),latest,'later skip preserves answered latest');
 roundTrip(state,'first/latest/skip and support-before');
 const skipped=make();edit(skipped,'page','reader');accept(W.skipWater(skipped,options));ok(!work(skipped).answer.first&&!work(skipped).answer.latest);eq(W.waterReply(work(skipped)),null);
}

// Retired sources own their identifiers, row counts, quantities, text and keys.
{
 const old=clone(source);old.id='earlier-model';old.family='retired-family';old.cups=12;
 old.views=[{...old.views[0],id:'earlier-whole',totalHalf:24,rows:[{...old.views[0].rows[0],id:'earlier-a',units:7},{...old.views[0].rows[1],id:'earlier-b',units:8},{...old.views[0].rows[1],id:'earlier-c',units:9}]}];
 old.question={...old.question,id:'earlier-question',view:'earlier-whole',key:'earlier-choice',choices:old.question.choices.slice(0,2).map((c,i)=>({...c,id:i?'earlier-other':'earlier-choice',text:`Earlier choice ${i}`,feedback:`Earlier feedback ${i}`}))};
 old.copy.checks.match='Earlier graph match';ok(W.validWaterSource(old),'retired source does not require today’s rows or quantities');
 const state=make(old);old.views[0].rows[0].units=99;eq(work(state).source.views[0].rows[0].units,7,'start takes an independent source copy');
 fill(state,'earlier-whole');accept(W.checkWater(state,options));eq(work(state).checks[0].feedback,'Earlier graph match');
 edit(state,'page','reader');accept(W.answerWater(state,'earlier-choice',options));accept(W.keepWater(state,options));eq(work(state).kept[0].fulfilled,true);
 // Historic diagnostics/outcomes remain readable without being regraded.
 const check=clone(work(state).checks[0]);check.values['earlier-a']=8;check.values['earlier-b']=7;check.outcome='match';check.feedback='Earlier recorded rule';
 ok(W.validWaterCheck(check),'record is checked for structure and sums, not today’s key/rules');
 const answer=clone(work(state).answer.first);answer.outcome='again';answer.feedback='Earlier answer interpretation';ok(W.validWaterAnswer(answer),'saved answer outcome is not regraded');
 const before=clone(work(state));W.waterView(state);W.waterReady(work(state));W.waterReply(work(state));eq(work(state),before,'retired source reads never refresh');roundTrip(state,'retired selected source');
 delete work(state).help;ok(work(state),'missing older help stays readable');accept(W.supportWater(state,'hint',options));eq(work(state).help.observed,false,'new request does not claim earlier tracking');
}

for(const mutate of [s=>s.version=99,s=>s.views=[],s=>s.views[1].id=s.views[0].id,s=>s.views[0].rows[1].id=s.views[0].rows[0].id,s=>s.views[0].rows[0].units=0.5,s=>s.views[0].totalHalf=-1,s=>s.question.view='absent',s=>s.question.key='absent',s=>s.question.choices[1].id=s.question.choices[0].id]){const bad=clone(source);mutate(bad);ok(!W.validWaterSource(bad),'bad source identity/integer/bound rejected');}
{
 const state=make();fill(state,'all');accept(W.checkWater(state,options));const saved=clone(work(state).checks[0]);
 for(const mutate of [c=>c.view='absent',c=>c.values.fresh=0.5,c=>c.values.fresh=-1,c=>c.sumHalf++,c=>c.missing=['absent'],c=>c.wrongRows=['absent'],c=>c.outcome='future',c=>c.tableAvailable='unknown']){const bad=clone(saved);mutate(bad);ok(!W.validWaterCheck(bad),'malformed saved check stays raw');}
 edit(state,'page','reader');accept(W.answerWater(state,source.question.key,options));const answer=clone(work(state).answer.first);
 for(const mutate of [a=>a.itemId='other-reader',a=>a.choice='absent',a=>a.outcome='future',a=>a.tableAvailable='unknown']){const bad=clone(answer);mutate(bad);ok(!W.validWaterAnswer(bad),'malformed answer cannot supply readiness');}
 accept(W.keepWater(state,options));const kept=clone(work(state).kept[0]);ok(W.validWaterKeep(kept));
 for(const mutate of [k=>k.fulfilled='yes',k=>k.answer=null,k=>k.answer.itemId='another-reader']){const bad=clone(kept);mutate(bad);ok(!W.validWaterKeep(bad),'kept fulfillment agrees with its own recorded response');}
}

// Every entry point admits the candidate through the actual report before commit.
{
 const state=make(),key=state.waterShares.current;
 const actions=[o=>W.startWater(state,o),o=>W.resumeWater(state,key,o),o=>W.editWater(state,'page','reader',o),o=>W.editWater(state,'view','fresh',o),o=>W.editWater(state,'bar',{row:'saline',units:1},o),o=>W.editWater(state,'step',{row:'saline',delta:1},o),o=>W.editWater(state,'clear',null,o),o=>W.supportWater(state,'fill',o),o=>W.checkWater(state,o),o=>W.answerWater(state,'a',o),o=>W.skipWater(state,o),o=>W.keepWater(state,o),o=>W.removeWater(state,key,true,o)];
 for(const action of actions){refuse(state,()=>action({}),'missing report preflight');refuse(state,()=>action({canExport:()=>false}),'rejected report preflight');}
 const before=clone(state);let called=false;refuse(state,()=>W.editWater(state,'bar',{row:'saline',units:19},{canExport:candidate=>{called=true;eq(W.valuesWater(work(candidate)).saline,19);eq(state,before,'live state unchanged during admission');return false;}}),'candidate admission');ok(called);
 for(const action of [()=>W.editWater(state,'page','absent',options),()=>W.editWater(state,'view','absent',options),()=>W.editWater(state,'bar',{row:'absent',units:1},options),()=>W.supportWater(state,'absent',options),()=>W.answerWater(state,'absent',options),()=>W.resumeWater(state,'absent',options),()=>W.removeWater(state,key,false,options)])refuse(state,action,'invalid or unconfirmed operation');
 state.syntheticPadding='';state.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(serialize(state)));eq(Buffer.byteLength(serialize(state)),MAX_IMPORT_BYTES);ok(options.canExport(state),'actual pretty report fits exact shared byte boundary');
 refuse(state,()=>W.keepWater(state,options),'new keep exceeds actual pretty report boundary');refuse(state,()=>W.checkWater(state,options),'new check exceeds report boundary');refuse(state,()=>W.answerWater(state,'a',options),'answer exceeds report boundary');refuse(state,()=>W.startWater(state,options),'new visit exceeds report boundary');
}

// Bounds refuse without eviction. Only a confirmed, named readable visit is removed.
{
 const state=make();for(let i=0;i<16;i++)accept(W.checkWater(state,options));refuse(state,()=>W.checkWater(state,options),'seventeenth check refuses');
 for(let i=0;i<16;i++)accept(W.keepWater(state,options));refuse(state,()=>W.keepWater(state,options),'seventeenth keep refuses');
 const key=state.waterShares.current,old=clone(work(state));for(let i=1;i<8;i++)accept(W.startWater(state,options));eq(W.waterView(state).visits.length,8);eq(state.waterShares.visits[key],old);refuse(state,()=>W.startWater(state,options),'ninth visit refuses');
 const previous=clone(state.waterShares.visits),serial=state.waterShares.nextSerial;accept(W.removeWater(state,key,true,options));delete previous[key];eq(state.waterShares.visits,previous);eq(state.waterShares.nextSerial,serial);accept(W.startWater(state,options));eq(Object.keys(state.waterShares.visits).length,8);roundTrip(state,'capacity and named removal');
}
{
 const expanded=clone(source);expanded.views.push(...Array.from({length:5},(_,i)=>({...clone(source.views[0]),id:`earlier-view-${i}`})));ok(W.validWaterSource(expanded),'retired additional view contexts readable');
 const state=make(expanded),count=()=>work(state).help.concept.length+work(state).help.reading.length;
 const kinds=['hint','example','together','one','fill','half','zoom','teach','card-ice','meaning','audio'];
 outer:for(const v of expanded.views){edit(state,'view',v.id);for(const kind of kinds){accept(W.supportWater(state,kind,options));if(count()===64)break outer;}}
 eq(count(),64);const held=clone(work(state).help);const last=work(state).help.concept.at(-1)||work(state).help.reading.at(-1);accept(W.supportWater(state,last.kind,options));eq(work(state).help,held,'repeat at request limit needs no slot');
 const unused=kinds.find(kind=>![...held.concept,...held.reading].some(h=>h.forId===work(state).view&&h.kind===kind));ok(unused);refuse(state,()=>W.supportWater(state,unused,options),'sixty-fifth distinct request refuses');roundTrip(state,'request capacity');
}

// Optional malformed records stay raw while graph work and healthy siblings open.
{
 const state=make(),key=state.waterShares.current;work(state).checks=[{future:'raw check'}];work(state).kept=[{future:'raw keep'}];work(state).answer={first:{future:'raw answer'}};
 const raw=clone({checks:work(state).checks,kept:work(state).kept,answer:work(state).answer});bar(state,'saline',17);eq(work(state).checks,raw.checks);eq(work(state).kept,raw.kept);eq(work(state).answer,raw.answer);eq(W.waterReply(work(state)),null);ok(!W.waterReady(work(state)));
 refuse(state,()=>W.answerWater(state,'a',options),'unreadable earlier answer not replaced');refuse(state,()=>W.skipWater(state,options),'unreadable response is not extended');
 const bad=clone(work(state));bad.source.version=99;state.waterShares.visits['future-visit']=bad;state.waterShares.visits['bad key']={future:'raw sibling'};const siblings=clone(state.waterShares.visits);
 refuse(state,()=>W.resumeWater(state,'future-visit',options),'future source stays read-only');bar(state,'fresh',3);eq(state.waterShares.visits['future-visit'],siblings['future-visit']);eq(state.waterShares.visits['bad key'],siblings['bad key']);
 work(state).checks={future:'non-array history'};work(state).kept={future:'non-array history'};bar(state,'fresh',4);refuse(state,()=>W.checkWater(state,options),'non-array check history not replaced');refuse(state,()=>W.keepWater(state,options),'non-array keeps not replaced');roundTrip(state,'raw optional histories and siblings');
 accept(W.startWater(state,options));accept(W.answerWater(state,work(state).source.question.key,options));accept(W.resumeWater(state,key,options));
}
{
 const state=make();fill(state,'all');edit(state,'page','reader');accept(W.answerWater(state,source.question.key,options));
 work(state).answer.first.itemId='another-reader';eq(W.waterReply(work(state)),null,'misfiled answer supplies no readiness');ok(!W.waterReady(work(state)));accept(W.keepWater(state,options));eq(work(state).kept.at(-1).fulfilled,false,'misfiled answer cannot fulfill keep');refuse(state,()=>W.answerWater(state,source.question.key,options),'misfiled response not extended');roundTrip(state,'misfiled response retained');
}
{
 const state=make();fill(state,'all');accept(W.answerWater(state,source.question.key,options));
 const first=clone(work(state).answer.first);work(state).answer.latest={future:'raw latest response'};
 eq(W.waterReply(work(state)),null,'unreadable explicit latest cannot revive an earlier fitting response');ok(!W.waterReady(work(state)));accept(W.keepWater(state,options));eq(work(state).kept.at(-1).fulfilled,false);
 eq(work(state).answer.first,first);refuse(state,()=>W.skipWater(state,options),'skip does not extend an unreadable latest');roundTrip(state,'unreadable latest retains earlier first');
}
for(const raw of [null,[],42,'old root',{version:2,current:null,visits:{}}]){
 const state=seed();state.waterShares=clone(raw);const before=clone(state);eq(W.waterView(state).status,'unavailable');eq(state,before);refuse(state,()=>W.startWater(state,options),'opaque future root not replaced');roundTrip(state,'unknown optional root');
}
{
 const state=make(),key=state.waterShares.current;state.waterShares.current='bad key';const before=clone(state);eq(W.waterView(state).work,null);eq(state,before);accept(W.resumeWater(state,key,options));ok(work(state),'bad pointer does not lock readable sibling');
}
{
 const state=seed();state.seedStall={version:99,held:'Synthetic waiting format'};state.futureDestination={nested:[1,{held:'Synthetic foreign work'}]};const foreign=clone(state);
 accept(W.startWater(state,options));fill(state,'all');accept(W.supportWater(state,'together',options));accept(W.checkWater(state,options));edit(state,'page','reader');accept(W.answerWater(state,'a',options));accept(W.skipWater(state,options));accept(W.keepWater(state,options));
 const before=clone(state);W.waterView(state);W.viewWater(work(state).source,'all');W.valuesWater(work(state));W.assessWater(work(state).source,'all',W.valuesWater(work(state)));W.waterReply(work(state));W.waterReady(work(state));eq(state,before,'all pure reads preserve state exactly');
 const after=clone(state);delete after.waterShares;eq(after,foreign,'only the new root changes');const restored=roundTrip(state,'foreign-root isolation');delete restored.waterShares;eq(restored,foreign,'real report import preserves foreign roots');
}
console.log(`${checks} Hundred Cups source checks passed: ${gridCases} independently assessed diagrams, all 16 reader settings, frozen observations, request fulfillment, limits and actual-report recovery boundaries.`);
