import assert from 'node:assert/strict';
import {PLANT_DAYS,PLANT_CONDITIONS,PLANT_SPECIMENS,PLANT_MODEL,PLANT_OBSERVATIONS,plantObservation,plantObservationById,plantQuestions,waterComparisonQuestion} from '../dist/plant-study-content.mjs';
import {plantStudy,ensurePlantStudy,recoverPlantStudy,currentPlantObservation,setPlantPage,setPlantDay,setPlantSpecimen,recordPlantObservation,setPlantPrediction,usePlantSupport,answerPlantQuestion,choosePlantLocation,carryPlantPlan,notePlantExposure,notePlantExposureUnknown} from '../dist/plant-study-core.mjs';
let checks=0;
const check=(value,message)=>{assert.ok(value,message);checks++;};
const equal=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
const copy=x=>JSON.parse(JSON.stringify(x));
const beforeRows={0:{light:[20,19],dim:[20,19]},2:{light:[25,24],dim:[34,32]},4:{light:[31,29],dim:[49,46]},6:{light:[38,36],dim:[65,61]}};
equal(PLANT_DAYS,[0,2,4,6],'four relative model days');
equal(PLANT_CONDITIONS.map(c=>c.id),['light','dim'],'adequate versus inadequate light');
equal(PLANT_SPECIMENS,['A','B'],'two individually labelled specimens');
check(PLANT_OBSERVATIONS.length===16,'bounded authored observations');
check(new Set(PLANT_OBSERVATIONS.map(o=>o.id)).size===16,'sixteen unique references');
check(PLANT_MODEL.notice.includes('invented')&&PLANT_MODEL.notice.includes('not measured'),'explicit model provenance');
check(PLANT_MODEL.controls.includes('Already-emerged')&&PLANT_MODEL.controls.includes('suitable moisture')&&PLANT_MODEL.controls.includes('does not mean identical watering volumes'),'emergence and suitable-moisture controls');
for(const day of PLANT_DAYS)for(const condition of PLANT_CONDITIONS)for(const [i,specimen] of PLANT_SPECIMENS.entries()){
 const row=plantObservation(day,condition.id,specimen);
 equal(row.stemMm,beforeRows[day][condition.id][i],'reviewed illustrative stem length');
 check(plantObservationById(row.id)===row,'same canonical row reference');
 check(Object.isFrozen(row)&&Object.isFrozen(row.sources),'authored data is immutable');
 check(row.stemWidthMm>0&&row.stemWidthMm<row.leafSpreadMm&&row.leafSpreadMm<row.stemMm,'coherent picture geometry');
 check(row.description.includes(`${row.stemMm} mm`)&&row.description.includes(`${row.leafSpreadMm} mm`)&&row.description.includes(`${row.stemWidthMm} mm`),'text equivalence includes all art measurements');
 equal(row.notice,PLANT_MODEL.notice,'each carried row labels illustrative data');
 equal(row.sources,PLANT_MODEL.sources,'each row retains pattern sources');
 check(!row.leafColour.includes('yellow'),'dim is paler green, not fully yellow');
 const other=plantObservation(day,condition.id==='light'?'dim':'light',specimen);
 if(day===0)equal([row.stemMm,row.leafSpreadMm,row.leafColour,row.stemWidthMm,row.stemForm],[other.stemMm,other.leafSpreadMm,other.leafColour,other.stemWidthMm,other.stemForm],'starting pictures match');
 else if(condition.id==='dim')check(row.stemMm>other.stemMm&&row.leafSpreadMm<other.leafSpreadMm&&row.stemWidthMm<other.stemWidthMm&&row.leafColour==='paler green','later dim picture longer but thinner and paler');
}
for(const args of [[1,'light','A'],[0,'bright','A'],[0,'light','C']])equal(plantObservation(...args),null,'unknown observation rejected');
{
 const s={cafe:{draft:'unchanged'},loft:{dialogue:'fictional'},postOffice:{pending:'keep'}};
 const original=copy(s);check(plantStudy(s)!==null,'missing root has read-only default');equal(s,original,'read leaves absent root absent');
 const detached=plantStudy(s);detached.shownDays.push(6);equal(plantStudy(s).shownDays,[],'missing-root defaults not shared');
 ensurePlantStudy(s);const serialized=JSON.stringify(s);plantStudy(s);currentPlantObservation(s);equal(JSON.stringify(s),serialized,'render selectors read only');
 check(setPlantPrediction(s,'dim'),'unscored prediction kept');const first=copy(s.plantStudy.prediction.first);
 equal(first.timing,'before-later-days','no later picture observed');
 check(!('correct' in first)&&!('independent' in first),'prediction has no achievement claim');
 setPlantDay(s,0);setPlantPrediction(s,'similar');equal(s.plantStudy.prediction.latest.timing,'before-later-days','day-zero source allowed before-looking');
 usePlantSupport(s,'audio');setPlantDay(s,4);setPlantPrediction(s,'light');
 equal(s.plantStudy.prediction.first,first,'first prediction exact after revisions');
 equal(s.plantStudy.prediction.latest,{choice:'light',timing:'after-later-days',shownDays:[0,4],support:{audio:true}},'latest retains actual timing and narration');
 setPlantDay(s,0);setPlantPrediction(s,'unsure');equal(s.plantStudy.prediction.latest.timing,'after-later-days','return to day zero cannot erase earlier-looking');
 equal(s.cafe,original.cafe,'unrelated cafe intact');equal(s.loft,original.loft,'unrelated authored show intact');equal(s.postOffice,original.postOffice,'pending post intact');
 for(const day of PLANT_DAYS)for(const c of PLANT_CONDITIONS)for(const sp of PLANT_SPECIMENS){setPlantDay(s,day);setPlantSpecimen(s,c.id,sp);const row=recordPlantObservation(s);equal(row.id,plantObservation(day,c.id,sp).id,'keep exact selected source');recordPlantObservation(s);}
 equal(s.plantStudy.observations.length,16,'all possible rows, duplicates idempotent');equal(new Set(s.plantStudy.observations).size,16,'no repeated row refs');
 for(const page of ['predict','observe','compare','plan'])check(setPlantPage(s,page)&&plantStudy(s).page===page,'pages always open');
 equal(s.plantStudy.prediction.first,first,'browsing and table do not become prediction responses');
 const before=copy(s);for(const action of [()=>setPlantPage(s,'grade'),()=>setPlantDay(s,9),()=>setPlantSpecimen(s,'sun','A'),()=>setPlantPrediction(s,'correct'),()=>usePlantSupport(s,'mastery'),()=>usePlantSupport(s,'help','unknown'),()=>answerPlantQuestion(s,'unknown','visible'),()=>choosePlantLocation(s,'best'),()=>carryPlantPlan(s,'fake')])check(action()===false,'unknown finite action rejects');equal(s,before,'invalid actions preserve every root');
}
for(const day of PLANT_DAYS){
 const s={};setPlantDay(s,day);const qs=plantQuestions(day);check(qs.length===2,'two source-linked questions per day');
 for(const q of qs){
  check(q.prompt.includes(`day ${day}`),'question names exact source day');
  check(q.choices.every(c=>q.feedback[c.id]&&typeof c.label==='string'),'every authored alternative has explanatory feedback');
  check(q.choices.some(c=>c.id===q.answer),'authored answer present');
  const before=copy(s);check(!answerPlantQuestion(s,q.id,'imaginary'),'unknown response rejected');equal(s,before,'invalid answer not an attempt');
  usePlantSupport(s,'help',q.id);usePlantSupport(s,'together');
  for(const choice of q.choices){const result=answerPlantQuestion(s,q.id,choice.id);equal(result,{correct:choice.id===q.answer,feedback:q.feedback[choice.id]},'finite choice points to explanatory feedback');}
  const attempts=plantStudy(s).questions[q.id].attempts;check(attempts[0].support.help&&attempts[0].support.together&&attempts[0].practice&&!attempts[0].familiar,'first supported practice distinct');
  check(attempts[1].familiar,'retry remains familiar');check(attempts.every(a=>!('independent' in a)&&!('mastery' in a)),'no independent experiment claim');
  for(let i=0;i<30;i++)answerPlantQuestion(s,q.id,q.answer);
  equal(plantStudy(s).questions[q.id].attempts.length,24,'bounded recent question attempts');
  check(plantStudy(s).questions[q.id].support.help,'support remains sticky across retries');
 }
 const mismatched=plantQuestions(day===6?0:6)[0];const before=copy(s);check(!answerPlantQuestion(s,mismatched.id,mismatched.answer),'cannot answer against different visible day');equal(s,before,'same-day guard preserves state');
 if(day===0){const q=qs[1];equal(q.answer,'later','starting picture cannot show later change');check(q.feedback.later.includes('matching'),'day-zero equality explained');}
}
{
 const s={};ensurePlantStudy(s);answerPlantQuestion(s,'water','confounded');usePlantSupport(s,'example','water');const result=answerPlantQuestion(s,'water','controlled');check(result.correct&&result.feedback.includes('no water results'),'fair water comparison only, no results invented');
 check(waterComparisonQuestion.feedback.confounded.includes('either change could matter'),'confound explicitly explained');
 const before=copy(s);check(!carryPlantPlan(s,'day-6-dim-A'),'plan needs location and kept source');equal(s,before,'failed carry unchanged');
 choosePlantLocation(s,'dim');check(!carryPlantPlan(s,'day-6-dim-A'),'unkept source cannot be silently copied');setPlantDay(s,6);setPlantSpecimen(s,'dim','A');recordPlantObservation(s);usePlantSupport(s,'audio');const plan=carryPlantPlan(s,'day-6-dim-A');
 check(plan.location==='dim'&&plan.observation.stemMm===65&&plan.notice===PLANT_MODEL.notice,'any location retained with exact invented source');
 check(plan.sourceSupport.global.audio&&plan.sourceSupport.questions.water.example,'frozen support provenance carried');
 check(!('correct' in plan)&&!('success' in plan),'plan never a success label');
 const frozen=copy(s.plantStudy.plan);setPlantDay(s,0);choosePlantLocation(s,'light');usePlantSupport(s,'help');setPlantPrediction(s,'unsure');answerPlantQuestion(s,'water','confounded');equal(s.plantStudy.plan,frozen,'plan frozen across later source/support/choice changes');
 plan.observation.stemMm=999;equal(s.plantStudy.plan,frozen,'returned copy cannot mutate frozen carried work');
 const serialized=JSON.stringify(s);const restored=JSON.parse(serialized);equal(plantStudy(restored),s.plantStudy,'exact JSON transfer');equal(JSON.stringify(restored),serialized,'restoring does not regenerate days');
 const reordered=JSON.parse(serialized);reordered.plantStudy.plan.observation=Object.fromEntries(Object.entries(reordered.plantStudy.plan.observation).reverse());check(plantStudy(reordered),'semantic source validation permits JSON key reordering');
 const forged=copy(s);forged.plantStudy.plan.observation.stemMm++;equal(plantStudy(forged),null,'invented snapshot cannot silently change authored source');
}
for(const raw of [null,[],{version:99,work:'keep'},{version:1,day:6},'<future payload>']){
 const s={plantStudy:copy(raw),cafe:{keep:true}};const before=copy(s);equal(plantStudy(s),null,'unknown state unavailable');equal(ensurePlantStudy(s),null,'ensure preserves unknown state');check(!setPlantDay(s,6)&&!setPlantPrediction(s,'dim')&&!recoverPlantStudy({}),'no overwrite absent or unknown work');equal(s,before,'unknown raw root unchanged before recovery');
 check(recoverPlantStudy(s),'explicit fresh start available');equal(s.plantStudy.recovered,raw,'exact original retained for recovery');check(plantStudy(s),'fresh recovered root valid');equal(s.cafe,before.cafe,'recovery preserves other work');check(!recoverPlantStudy(s),'recovery cannot repeatedly replace valid draft');
}
{
 const s={};ensurePlantStudy(s);setPlantPage(s,'plan');setPlantSpecimen(s,'dim','B');setPlantPrediction(s,'light');const first=copy(s.plantStudy.prediction.first),selection=[s.plantStudy.page,s.plantStudy.day,s.plantStudy.condition,s.plantStudy.specimen];
 notePlantExposure(s,6);equal([s.plantStudy.page,s.plantStudy.day,s.plantStudy.condition,s.plantStudy.specimen],selection,'cross-loop exposure preserves exact investigation selection');setPlantPrediction(s,'dim');equal(s.plantStudy.prediction.first,first,'later source exposure preserves first prediction');equal(s.plantStudy.prediction.latest.timing,'after-later-days','revision after other-loop source is after-looking');
 const uncertain={};notePlantExposureUnknown(uncertain);setPlantPrediction(uncertain,'unsure');equal(uncertain.plantStudy.prediction.latest.timing,'unknown','unknown earlier exposure cannot manufacture before-looking');notePlantExposure(uncertain,2);setPlantPrediction(uncertain,'light');equal(uncertain.plantStudy.prediction.latest.timing,'after-later-days','known later source wins over uncertain earlier exposure');
 const invalid={plantStudy:{version:99,earlier:'exact'}};const raw=copy(invalid);check(!notePlantExposure(invalid,6)&&!notePlantExposureUnknown(invalid),'cross-loop hooks leave unsupported roots unavailable');equal(invalid,raw,'unknown earlier work exact');recoverPlantStudy(invalid);setPlantPrediction(invalid,'unsure');equal(invalid.plantStudy.prediction.latest.timing,'unknown','explicit recovery does not assert before-looking');
 const old={};ensurePlantStudy(old);setPlantPrediction(old,'dim');check(!Object.hasOwn(old.plantStudy,'exposureUnknown')&&!Object.hasOwn(old.plantStudy.prediction.first,'exposureUnknown'),'old valid format stays compatible without a migration');check(plantStudy(JSON.parse(JSON.stringify(old))),'old and extended snapshots validate');
}
console.log(`Plant study checks passed: ${checks}`);
