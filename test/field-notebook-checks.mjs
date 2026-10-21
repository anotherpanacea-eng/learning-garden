import assert from 'node:assert/strict';
import {FIELD_CASES,FIELD_SOURCE_MODEL,fieldExample,fieldCaseById} from '../dist/field-notebook-content.mjs';
import {PLANT_MODEL,plantObservationById} from '../dist/plant-study-content.mjs';
import {ensurePlantStudy,setPlantDay,setPlantSpecimen,recordPlantObservation} from '../dist/plant-study-core.mjs';
import {fieldNotebook,currentFieldCase,chooseFieldCase,nextFieldCase,setFieldPage,setFieldReadPrompt,setFieldSourceDay,noteFieldExposure,toggleFieldRow,setFieldQuantity,setFieldUnit,setFieldValue,setFieldBarInput,setFieldModelInput,useFieldSupport,fieldDraftSnapshot,fieldDataResult,fieldChartResult,fieldDraftReading,fieldSourceAgreement,checkFieldData,checkFieldChart,answerFieldDraft,answerFieldSource,answerFieldModel,currentFieldChecks,keepFieldDraft,recoverFieldNotebook,fieldDisplayedDays,fieldSourceRows} from '../dist/field-notebook-core.mjs';
let checks=0;
const check=(x,m)=>{assert.ok(x,m);checks++;};
const equal=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const copy=x=>JSON.parse(JSON.stringify(x));
function selectPair(s,c){for(const id of currentFieldCase(s).work.rows.map(r=>r.observation.id))toggleFieldRow(s,id);for(const id of c.targetIds)toggleFieldRow(s,id);}
function build(s,c){chooseFieldCase(s,c.id);selectPair(s,c);setFieldQuantity(s,'stem');setFieldUnit(s,'mm');for(const id of c.targetIds)setFieldValue(s,id,plantObservationById(id).stemMm);}
check(FIELD_CASES.length===8&&new Set(FIELD_CASES.map(c=>c.id)).size===8,'eight finite stable cases');
for(const c of FIELD_CASES){
 const pair=c.targetIds.map(plantObservationById);check(pair.every(r=>r.day===c.day&&r.specimen===c.specimen),'requested exact day/specimen');equal(pair.map(r=>r.condition),['light','dim'],'one per condition');equal(c.difference,Math.abs(pair[0].stemMm-pair[1].stemMm),'derived absolute difference');
 if(c.day===0)equal([c.longer,c.difference],['same',0],'both day-zero cases tie');
 const s={cafe:{stock:'fictional'},loft:{writing:'fictional draft'}};const unrelated=copy(s);build(s,c);
 const draft=fieldDraftSnapshot(s);check(fieldDataResult(draft).matches,'exact pair relevant');check(fieldChartResult(draft).faithful,'exact quantity/unit/values faithful');
 const dataCheck=checkFieldData(s),chartCheck=checkFieldChart(s);check(dataCheck.practice&&!dataCheck.familiar,'first check supported practice without familiarity');check(chartCheck.familiar,'later check retains familiar context');
 const reading=fieldDraftReading(draft);check(answerFieldDraft(s,reading).result.correct,'reads current matching draft');check(answerFieldSource(s,'yes').result.correct,'matching bars and labels agree');
 const answer=answerFieldModel(s,c.longer,c.difference);check(answer.result.comparisonCorrect&&answer.result.differenceCorrect,'requested source answer correct');check(answer.result.feedback.includes('not a health score'),'model comparison names length limitation');
 const kept=keepFieldDraft(s);equal(kept.draft.sourceModel,FIELD_SOURCE_MODEL,'kept model source exact');equal(kept.draft.sourceModel.notice,PLANT_MODEL.notice,'kept notice explicit');
 const oldKept=copy(s.fieldNotebook.cases[c.id].kept),oldChecks=copy(s.fieldNotebook.cases[c.id].checks);useFieldSupport(s,'chart','help');setFieldValue(s,c.targetIds[0],0);setFieldUnit(s,'cm');
 equal(s.fieldNotebook.cases[c.id].kept,oldKept,'later labels/number/support changes cannot rewrite kept draft');equal(s.fieldNotebook.cases[c.id].checks,oldChecks,'later work cannot rewrite checked snapshots');
 kept.draft.values[c.targetIds[0]]=999;equal(s.fieldNotebook.cases[c.id].kept,oldKept,'returned kept clone not shared');
 check(keepFieldDraft(s).revised,'explicit second keep marked revised');
 equal(s.cafe,unrelated.cafe,'cafe stock untouched');equal(s.loft,unrelated.loft,'authored story untouched');
 const originalOrder=currentFieldCase(s).work.rows.map(r=>r.observation.id);for(const id of originalOrder)toggleFieldRow(s,id);for(const id of originalOrder.reverse())toggleFieldRow(s,id);check(fieldDataResult(fieldDraftSnapshot(s)).matches,'reverse order retains relevance');
 check(fieldNotebook(JSON.parse(JSON.stringify(s))),'exact export/import validates');
}
{
 const s={},before=copy(s);fieldNotebook(s);currentFieldCase(s);fieldDraftSnapshot(s);fieldDisplayedDays(s);equal(s,before,'all read helpers leave missing root absent');
 const d=fieldNotebook(s);d.exposedDays.push(6);equal(fieldNotebook(s).exposedDays,[],'missing defaults unshared');
 check(fieldDataResult(fieldDraftSnapshot(s)).status==='missing','empty pair missing');
 const one='day-0-light-A',two='day-2-dim-A';toggleFieldRow(s,one);equal(currentFieldCase(s).work.values[one],null,'new value blank');equal(fieldDraftReading(fieldDraftSnapshot(s)),null,'one bar cannot generate reading answer');const saved=copy(s);check(!answerFieldDraft(s,'first'),'incomplete chart creates no synthetic attempt');equal(s,saved,'missing answer does not create work');
 toggleFieldRow(s,two);check(fieldDataResult(fieldDraftSnapshot(s)).issues.includes('mixed-days'),'mixed days distinct');check(fieldDataResult(fieldDraftSnapshot(s)).issues.includes('wrong-request'),'wrong requested day retained separately');
 const beforeThird=copy(s);check(!toggleFieldRow(s,'day-4-light-A'),'third row rejected at limit');equal(s,beforeThird,'limit does not replace existing selection');
 setFieldValue(s,one,0);setFieldValue(s,two,70);equal(fieldDraftReading(fieldDraftSnapshot(s)),'second','reads wrong 0/70 values literally');check(answerFieldDraft(s,'second').result.correct,'wrong source copying can still be read correctly');check(!fieldSourceAgreement(fieldDraftSnapshot(s)),'wrong values and blank labels not faithful');
 for(const bad of [-1,71,Infinity,NaN,1.5,'20',false,undefined]){const snap=copy(s);check(!setFieldValue(s,one,bad),'invalid integer and coercion rejected');equal(s,snap,'invalid value unchanged');}
 setFieldValue(s,one,null);equal(currentFieldCase(s).work.values[one],null,'blank remains distinct from real zero');toggleFieldRow(s,one);toggleFieldRow(s,one);equal(currentFieldCase(s).work.values[one],null,'readding source starts blank');equal(currentFieldCase(s).work.values[two],70,'retained row keeps its own number');
 toggleFieldRow(s,two);toggleFieldRow(s,'day-0-light-B');check(fieldDataResult(fieldDraftSnapshot(s)).issues.includes('same-condition'),'same condition twice identified');check(fieldDataResult(fieldDraftSnapshot(s)).issues.includes('wrong-request'),'wrong specimen not hidden');
 const snapshot=copy(s);check(!toggleFieldRow(s,'day-6-dim-A','kept-in-plant-study'),'cannot pretend row was previously kept');equal(s,snapshot,'false origin does not mutate');
 ensurePlantStudy(s);setPlantDay(s,0);setPlantSpecimen(s,'light','A');recordPlantObservation(s);toggleFieldRow(s,one);toggleFieldRow(s,one,'kept-in-plant-study');equal(currentFieldCase(s).work.rows.find(r=>r.observation.id===one).origin,'kept-in-plant-study','verified origin preserved');
 const plant=copy(s.plantStudy);setFieldPage(s,'chart');checkFieldChart(s);keepFieldDraft(s);equal(s.plantStudy,plant,'notebook actions never change plant draft');
}
{
 const s={},c=FIELD_CASES.find(c=>c.day===6&&c.specimen==='B');build(s,c);chooseFieldCase(s,FIELD_CASES[0].id);selectPair(s,c);setFieldQuantity(s,'stem');setFieldUnit(s,'mm');for(const id of c.targetIds)setFieldValue(s,id,plantObservationById(id).stemMm);
 const chart=fieldChartResult(fieldDraftSnapshot(s));check(!chart.data.matches&&chart.faithful,'faithfully represented irrelevant pair stays irrelevant');const source=answerFieldSource(s,'yes');check(source.result.correct&&source.result.faithful&&!source.result.relevant,'source agreement independent from requested pair');
 const model=answerFieldModel(s,'same',0);check(model.result.comparisonCorrect&&model.result.differenceCorrect,'original-model answer uses requested day zero even when draft differs');
 check(model.result.feedback.includes('20 mm')&&model.result.feedback.includes('0 mm'),'feedback explicitly reads requested source');
 setFieldUnit(s,'cm');const label=checkFieldChart(s).result;check(!label.unit.matches&&label.quantity.matches&&label.bars.every(b=>b.matches),'unit distinguished from numerical fidelity');
 setFieldQuantity(s,'leaf');check(!checkFieldChart(s).result.quantity.matches,'quantity independently checked');
 for(const id of currentFieldCase(s).work.rows.map(r=>r.observation.id))setFieldValue(s,id,38);equal(fieldDraftReading(fieldDraftSnapshot(s)),'same','equal wrong draft reads as equal');
 const first=checkFieldChart(s);useFieldSupport(s,'chart','example');const second=checkFieldChart(s);check(!first.support.example&&second.support.example,'support frozen at time of check');equal(currentFieldChecks(s).chart,second,'latest per-task check retained');
 for(let i=0;i<40;i++)checkFieldData(s);equal(currentFieldCase(s).work.checks.length,24,'total case history capped at24');check(currentFieldCase(s).work.checks.every(c=>c.familiar),'repeated history remains familiar after cap');
}
{
 const s={};chooseFieldCase(s,FIELD_CASES[0].id);setFieldSourceDay(s,0);equal(fieldDisplayedDays(s),{days:[0],unknown:false},'data page exposes only browsed packet initially');
 toggleFieldRow(s,'day-4-light-A');equal(fieldDisplayedDays(s).days,[0,4],'selected row also visible on data page');setFieldPage(s,'chart');equal(fieldDisplayedDays(s).days,[4],'chart includes selected source, not hidden browser packet');
 setFieldPage(s,'read');setFieldReadPrompt(s,'draft');equal(fieldDisplayedDays(s).days,[4],'reading draft does not reveal requested source');setFieldReadPrompt(s,'model');equal(fieldDisplayedDays(s).days,[0,4],'model read shows requested pair plus selected row');
 useFieldSupport(s,'model','example');equal(fieldDisplayedDays(s).days,[0,4,6],'visible different-case example included');const example=fieldExample(FIELD_CASES[0].id);check(example.definition.id!==FIELD_CASES[0].id&&example.rows.every(r=>r.day===6),'worked example exact different case');
 setFieldReadPrompt(s,'source');equal(fieldDisplayedDays(s).days,[4],'example hidden when its task hidden');keepFieldDraft(s);equal(fieldDisplayedDays(s,'planting').days,[4],'planting corner exposes only currently kept rows');
 toggleFieldRow(s,'day-4-light-A');equal(fieldDisplayedDays(s,'planting').days,[4],'frozen corner survives removed draft row');setFieldPage(s,'keep');equal(fieldDisplayedDays(s).days,[4],'kept page shows carried old source');
 noteFieldExposure(s,[4,0,4],true);equal(s.fieldNotebook.exposedDays,[4,0],'unique bounded recorded exposures');check(s.fieldNotebook.exposureUnknown,'uncertainty sticky');noteFieldExposure(s,[6],false);check(s.fieldNotebook.exposureUnknown,'known day does not erase uncertainty');
 const before=copy(s);check(!noteFieldExposure(s,[9]),'unknown day rejected');equal(s,before,'invalid exposure unchanged');
 chooseFieldCase(s,FIELD_CASES[1].id);equal(fieldDisplayedDays(s,'planting').days,[],'no fallback to other-case kept draft');
 for(let i=0;i<16;i++)nextFieldCase(s);check(Object.keys(s.fieldNotebook.cases).length===8,'cycling bounded to eight cases');check(currentFieldCase(s).work.familiar,'replayed case labelled familiar');
 for(const day of [0,2,4,6])equal(fieldSourceRows(day).length,4,'four accurate source rows per day');equal(fieldSourceRows(9),[],'no invented source packet');
}
{
 const s={};build(s,FIELD_CASES[0]);checkFieldChart(s);keepFieldDraft(s);const raw=copy(s.fieldNotebook);
 const corruptions=[r=>r.version=3,r=>r.extra=true,r=>r.exposedDays=[9],r=>r.readPrompt='pass',r=>r.cases[r.currentCase].rows[0].observation=null,r=>r.cases[r.currentCase].rows[0].observation.stemMm=999,r=>r.cases[r.currentCase].values.extra=2,r=>r.cases[r.currentCase].checks[0].result.faithful=false,r=>r.cases[r.currentCase].checks[0].snapshot.unit='future',r=>r.cases[r.currentCase].kept.checks.chart=null];
 for(const corrupt of corruptions){const altered=copy(raw);corrupt(altered);const wrapper={fieldNotebook:altered,postOffice:{pending:'keep'}};const before=copy(wrapper);equal(fieldNotebook(wrapper),null,'corrupted or unsupported state unavailable, no crash');equal(fieldDisplayedDays(wrapper),{days:[],unknown:true},'unavailable exposure unknown without trusting raw payload');check(!setFieldPage(wrapper,'data')&&!checkFieldData(wrapper),'unavailable actions refuse mutation');equal(wrapper,before,'malformed exact payload preserved');check(recoverFieldNotebook(wrapper),'explicit recovery works');equal(wrapper.fieldNotebook.recovered,altered,'raw recovery exact');check(fieldNotebook(wrapper)&&fieldNotebook(wrapper).exposureUnknown,'recovery valid but uncertain prior exposure sticky');equal(wrapper.postOffice,before.postOffice,'pending delivery preserved');}
 const reorder=copy(s);reorder.fieldNotebook.cases[raw.currentCase].rows[0].observation=Object.fromEntries(Object.entries(reorder.fieldNotebook.cases[raw.currentCase].rows[0].observation).reverse());check(fieldNotebook(reorder),'semantic equality accepts source key reordering');
 for(const rawRoot of [null,[],false,5,'future']){const wrapper={fieldNotebook:rawRoot};equal(fieldNotebook(wrapper),null,'nonobject root unavailable');check(recoverFieldNotebook(wrapper),'nonobject root recoverable');equal(wrapper.fieldNotebook.recovered,rawRoot,'nonobject exact retained');}
}
{
 const s={};chooseFieldCase(s,FIELD_CASES[0].id);setFieldSourceDay(s,6);
 equal(fieldDisplayedDays(s,'notes'),{days:[],unknown:false},'notes do not infer exposure from an unopened packet day number');
 toggleFieldRow(s,'day-4-light-A');checkFieldData(s);keepFieldDraft(s);toggleFieldRow(s,'day-4-light-A');
 chooseFieldCase(s,'light-day-6-B');answerFieldModel(s,'dim',25);
 chooseFieldCase(s,'light-day-2-A');toggleFieldRow(s,'day-2-light-A');
 equal(fieldDisplayedDays(s,'notes').days,[2,4,6],'expanded notes include all case rows, old checks, kept drafts and model-answer feedback');
 equal(fieldDisplayedDays(s,'notebook').days,[2,6],'ordinary data view unchanged by hidden case history');
 equal(fieldDisplayedDays(s,'planting').days,[],'planting view remains current kept draft only');
 const onlyKept={};chooseFieldCase(onlyKept,'light-day-6-A');answerFieldModel(onlyKept,'dim');keepFieldDraft(onlyKept);
 onlyKept.fieldNotebook.cases['light-day-6-A'].checks=[];
 equal(fieldDisplayedDays(onlyKept,'notes').days,[6],'kept model-check feedback alone exposes requested source day');
 const unavailable={fieldNotebook:{version:99,cases:{untrusted:{rows:[{observation:{day:6}}]}}}};
 equal(fieldDisplayedDays(unavailable,'notes'),{days:[],unknown:true},'unknown notes retain uncertainty without trusting raw source-like rows');
 recoverFieldNotebook(unavailable);
 equal(fieldDisplayedDays(unavailable,'notes'),{days:[],unknown:true},'recovered raw payload is not parsed as known exposure');
}
{
 const s={},c=FIELD_CASES[2];build(s,c);const id=c.targetIds[0],other=c.targetIds[1],committed=plantObservationById(id).stemMm;
 check(setFieldBarInput(s,id,'not yet'),'raw unfinished bar text kept');
 check(setFieldModelInput(s,'choice','dim'),'pending model choice kept');
 check(setFieldModelInput(s,'difference','2e'),'unfinished optional difference kept');
 const pending=copy(currentFieldCase(s).work.pending);
 setFieldPage(s,'read');setFieldReadPrompt(s,'source');useFieldSupport(s,'source','help');setFieldUnit(s,'cm');setFieldQuantity(s,'leaf');setFieldSourceDay(s,6);noteFieldExposure(s,[6]);
 equal(currentFieldCase(s).work.pending,pending,'page/help/labels/source/exposure actions preserve exact pending input');
 equal(currentFieldCase(s).work.values[id],committed,'raw invalid text never coerces to committed bar');
 const checked=checkFieldChart(s);equal(checked.snapshot.pending,pending,'checks freeze raw draft as well as committed values');
 equal(checked.result.bars.find(b=>b.id===id).entered,committed,'chart grading uses committed finite value');
 const kept=keepFieldDraft(s);equal(kept.draft.pending,pending,'kept draft freezes pending input');
 setFieldBarInput(s,id,'-');setFieldModelInput(s,'difference','later');setFieldModelInput(s,'choice','unsure');
 equal(checked.snapshot.pending,pending,'later raw input cannot mutate old checked snapshot');
 equal(kept.draft.pending,pending,'later raw input cannot mutate old kept snapshot');
 const before=copy(s);check(!answerFieldModel(s,'dim','later'),'invalid raw response cannot become accepted numerical answer');equal(s,before,'rejected answer leaves pending draft exact');
 for(const invalid of ['x'.repeat(17),12,null,undefined]){const old=copy(s);check(!setFieldBarInput(s,id,invalid),'rawbar type/length bounded');equal(s,old,'rejected rawbar retains existing draft');}
 for(const [field,value] of [['difference','x'.repeat(17)],['difference',12],['choice','correct'],['unknown','dim']]){const old=copy(s);check(!setFieldModelInput(s,field,value),'pending model inputs finite/bounded');equal(s,old,'invalid pending model input leaves draft exact');}
 check(!setFieldBarInput(s,'future-source','12'),'cannot attach raw text to unselected source');
 setFieldValue(s,id,0);equal(currentFieldCase(s).work.pending.bars[id],'0','explicit zero synchronizes raw field');setFieldValue(s,id,null);equal(currentFieldCase(s).work.pending.bars[id],'','explicit blank synchronizes raw field');
 setFieldBarInput(s,id,'12?');const untouched=currentFieldCase(s).work.pending.bars[other];toggleFieldRow(s,id);check(!Object.hasOwn(currentFieldCase(s).work.pending.bars,id),'removing row removes only its raw input');equal(currentFieldCase(s).work.pending.bars[other],untouched,'other row raw input retained');toggleFieldRow(s,id);equal(currentFieldCase(s).work.pending.bars[id],'','newly readded row raw input blank');
 const serialized=JSON.stringify(s);equal(JSON.stringify(JSON.parse(serialized)),serialized,'raw draft survives exact transfer');check(fieldNotebook(JSON.parse(serialized)),'raw partial inputs valid after reload');
 chooseFieldCase(s,FIELD_CASES[3].id);chooseFieldCase(s,c.id);equal(currentFieldCase(s).work.pending.modelChoice,'unsure','case revisits preserve pending model choice');equal(currentFieldCase(s).work.pending.difference,'later','case revisits preserve unfinished difference');
 const corrupt=copy(s);corrupt.fieldNotebook.cases[c.id].pending.bars[id]=42;equal(fieldNotebook(corrupt),null,'nonstring raw value makes root unavailable without normalization');
}
{
 const s={},c=FIELD_CASES[2];build(s,c);checkFieldChart(s);answerFieldModel(s,c.longer,c.difference);keepFieldDraft(s);
 const drift=copy(s),w=drift.fieldNotebook.cases[c.id];
 for(const snap of [w.kept.draft,...w.checks.map(x=>x.snapshot)]){snap.question='An earlier wording of this question';snap.sourceModel.notice='An earlier notice';}
 w.rows[0].observation.description='An earlier description';w.checks.at(-1).result.feedback='Earlier feedback wording';
 check(fieldNotebook(drift),'a later wording edit to questions, notices, rows or feedback leaves saved work openable');
 const t={};chooseFieldCase(t,FIELD_CASES[0].id);chooseFieldCase(t,FIELD_CASES[0].id);check(!currentFieldCase(t).work.familiar,'pressing the current case again does not mark it familiar');
 chooseFieldCase(t,FIELD_CASES[1].id);chooseFieldCase(t,FIELD_CASES[0].id);check(currentFieldCase(t).work.familiar,'returning from another case marks it familiar');
}
console.log(`Field Notebook checks passed: ${checks}`);
