import {plantStudy} from './plant-study-core.mjs';
import {FIELD_CASES,FIELD_QUANTITIES,FIELD_UNITS,FIELD_TASKS,FIELD_SOURCE_MODEL,fieldCaseById,fieldExampleCase} from './field-notebook-content.mjs';
import {PLANT_DAYS,plantObservationById,PLANT_OBSERVATIONS} from './plant-study-content.mjs';
const PAGES=['data','chart','read','keep'],READ=['draft','source','model'],ORIGINS=['kept-in-plant-study','supplied-model'],SUPPORT=['help','example','audio','together'];
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),clone=x=>JSON.parse(JSON.stringify(x));
const keys=(x,required,optional=[])=>object(x)&&required.every(k=>Object.hasOwn(x,k))&&Object.keys(x).every(k=>required.includes(k)||optional.includes(k));
const validValue=x=>x===null||Number.isInteger(x)&&x>=0&&x<=70;
const supportValid=x=>object(x)&&Object.entries(x).every(([k,v])=>SUPPORT.includes(k)&&v===true);
const supportsValid=x=>object(x)&&Object.entries(x).every(([k,v])=>FIELD_TASKS.includes(k)&&supportValid(v));
const validDays=x=>Array.isArray(x)&&x.length<=4&&new Set(x).size===x.length&&x.every(d=>PLANT_DAYS.includes(d));
function equivalent(a,b){if(a===b)return true;if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>equivalent(v,b[i]));return object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&equivalent(a[k],b[k]));}
// Saved snapshots keep their own wording; only the measured facts must still match, so a copy edit cannot lock saved work.
const sameMeasure=(a,b)=>['id','day','condition','specimen','stemMm'].every(k=>a[k]===b[k]),facts=x=>JSON.parse(JSON.stringify(x,(k,v)=>k==='feedback'?undefined:v));
function rowsValid(rows){return Array.isArray(rows)&&rows.length<=2&&new Set(rows.map(r=>r?.observation?.id)).size===rows.length&&rows.every(r=>keys(r,['observation','origin'])&&ORIGINS.includes(r.origin)&&object(r.observation)&&plantObservationById(r.observation.id)!==null&&sameMeasure(r.observation,plantObservationById(r.observation.id)));}
const rawValid=x=>typeof x==='string'&&x.length<=16;
function pendingValid(p,rows){return keys(p,['bars','modelChoice','difference'])&&object(p.bars)&&Object.keys(p.bars).length===rows.length&&rows.every(r=>Object.hasOwn(p.bars,r.observation.id)&&rawValid(p.bars[r.observation.id]))&&(p.modelChoice===null||['light','dim','same','unsure'].includes(p.modelChoice))&&rawValid(p.difference);}
function fieldsValid(s){return rowsValid(s.rows)&&pendingValid(s.pending,s.rows)&&object(s.values)&&Object.keys(s.values).length===s.rows.length&&s.rows.every(r=>Object.hasOwn(s.values,r.observation.id)&&validValue(s.values[r.observation.id]))&&(s.quantity===null||FIELD_QUANTITIES.some(q=>q.id===s.quantity))&&(s.unit===null||FIELD_UNITS.some(u=>u.id===s.unit));}
function snapshotValid(s,id){const c=fieldCaseById(id);return c&&keys(s,['caseId','question','rows','values','pending','quantity','unit','sourceModel','support','familiar'])&&s.caseId===id&&typeof s.question==='string'&&fieldsValid(s)&&object(s.sourceModel)&&s.sourceModel.id===FIELD_SOURCE_MODEL.id&&supportsValid(s.support)&&typeof s.familiar==='boolean';}
export function fieldDataResult(snapshot){
 const c=fieldCaseById(snapshot.caseId),rows=snapshot.rows.map(r=>r.observation),issues=[];
 if(rows.length<2)issues.push('missing');
 if(rows.length===2&&rows[0].day!==rows[1].day)issues.push('mixed-days');
 if(rows.length===2&&rows[0].condition===rows[1].condition)issues.push('same-condition');
 if(rows.some(r=>r.day!==c.day||r.specimen!==c.specimen))issues.push('wrong-request');
 const matches=rows.length===2&&issues.length===0,status=matches?'requested-pair':issues[0];
 const feedback=matches?`These are the requested day ${c.day}, specimen ${c.specimen} rows: one for each light condition.`:issues.map(issue=>({missing:'Choose two source rows; a missing row is not a zero.', 'mixed-days':'These rows come from different days. The question compares one day.', 'same-condition':'Both rows have the same light condition. The question asks for one of each.', 'wrong-request':`Check the labels: the requested pair is day ${c.day}, specimen ${c.specimen}.`}[issue])).join(' ');
 return {matches,status,issues,feedback};
}
export function fieldChartResult(snapshot){
 const data=fieldDataResult(snapshot),quantity={matches:snapshot.quantity==='stem',feedback:snapshot.quantity==='stem'?'The quantity label says stem length.':'The supplied task compares stem length; your current quantity label differs or is blank.'},unit={matches:snapshot.unit==='mm',feedback:snapshot.unit==='mm'?'The unit label says millimetres (mm).':'The source values are millimetres (mm); your current unit differs or is blank.'};
 const bars=snapshot.rows.map(({observation:o})=>{const entered=snapshot.values[o.id],matches=entered===null?null:entered===o.stemMm;return {id:o.id,entered,expected:o.stemMm,matches,feedback:entered===null?`Day ${o.day}, ${o.conditionLabel}, ${o.specimen}: no number entered yet; the source is ${o.stemMm} mm.`:`Day ${o.day}, ${o.conditionLabel}, ${o.specimen}: your draft says ${entered}; the supplied stem length is ${o.stemMm} mm.${matches?' The numbers agree.':' The numbers differ.'}`};});
 return {data,quantity,unit,bars,complete:bars.length===2&&bars.every(b=>b.entered!==null),faithful:bars.length===2&&quantity.matches&&unit.matches&&bars.every(b=>b.matches===true)};
}
export function fieldSourceAgreement(snapshot){return fieldChartResult(snapshot).faithful;}
export function fieldDraftReading(snapshot){if(snapshot.rows.length!==2)return null;const [a,b]=snapshot.rows.map(r=>snapshot.values[r.observation.id]);return a===null||b===null?null:a===b?'same':a>b?'first':'second';}
function resultFor(task,snapshot,response){
 if(task==='data')return response===null?fieldDataResult(snapshot):null;
 if(task==='chart')return response===null?fieldChartResult(snapshot):null;
 if(task==='draft'){
  if(!['first','second','same'].includes(response))return null;const answer=fieldDraftReading(snapshot);if(answer===null)return null;
  const [a,b]=snapshot.rows.map(r=>snapshot.values[r.observation.id]);return {correct:response===answer,answer,feedback:`This reads your draft, not the source: the first bar is ${a}, the second is ${b}. ${answer==='same'?'They are equal.':`The ${answer} bar is longer.`}`};
 }
 if(task==='source'){
  if(!['yes','differs','unsure'].includes(response))return null;const chart=fieldChartResult(snapshot),answer=chart.faithful?'yes':'differs';return {correct:response===answer,answer,faithful:chart.faithful,relevant:chart.data.matches,feedback:`${chart.faithful?'Both numerical bars, quantity and unit agree with their supplied source rows.':'Some numerical bars or labels are blank or differ from their supplied source rows.'} ${chart.data.matches?'Those rows also answer the requested question.':'Whether the pair answers the question is separate: these rows do not yet match the requested pair.'}`};
 }
 if(task==='model'){
  if(!keys(response,['choice','difference'])||!['light','dim','same','unsure'].includes(response.choice)||!validValue(response.difference))return null;
  const c=fieldCaseById(snapshot.caseId),[a,b]=c.targetIds.map(plantObservationById);return {comparisonCorrect:response.choice===c.longer,differenceCorrect:response.difference===null?null:response.difference===c.difference,answer:c.longer,difference:c.difference,feedback:`The requested supplied rows are day ${c.day}, specimen ${c.specimen}: adequate light ${a.stemMm} mm, too little light ${b.stemMm} mm. ${c.longer==='same'?'They have the same stem length.':`${c.longer==='light'?'Adequate-light':'Too-little-light'} has the longer stem.`} The absolute difference is ${c.difference} mm. This compares the invented model; stem length is not a health score.`};
 }
 return null;
}
function checkValid(check,id){return keys(check,['task','snapshot','response','result','support','practice','familiar'])&&READ.concat(['data','chart']).includes(check.task)&&snapshotValid(check.snapshot,id)&&supportValid(check.support)&&equivalent(check.support,check.snapshot.support[check.task]??{})&&check.practice===true&&typeof check.familiar==='boolean'&&resultFor(check.task,check.snapshot,check.response)!==null&&equivalent(facts(check.result),facts(resultFor(check.task,check.snapshot,check.response)));}
function keptValid(k,id){return k===null||keys(k,['draft','checks','revised'])&&snapshotValid(k.draft,id)&&object(k.checks)&&Object.entries(k.checks).every(([task,c])=>['data','chart',...READ].includes(task)&&object(c)&&c.task===task&&checkValid(c,id))&&typeof k.revised==='boolean';}
function workValid(w,id){return keys(w,['rows','values','pending','quantity','unit','support','familiar','checks','kept'])&&fieldsValid(w)&&supportsValid(w.support)&&typeof w.familiar==='boolean'&&Array.isArray(w.checks)&&w.checks.length<=24&&w.checks.every(c=>checkValid(c,id))&&keptValid(w.kept,id);}
const newWork=()=>({rows:[],values:{},pending:{bars:{},modelChoice:null,difference:''},quantity:null,unit:null,support:{},familiar:false,checks:[],kept:null});
const fresh=()=>({version:1,currentCase:FIELD_CASES[0].id,page:'data',readPrompt:'draft',sourceDay:0,exposedDays:[],exposureUnknown:false,cases:{}});
function valid(r){return keys(r,['version','currentCase','page','readPrompt','sourceDay','exposedDays','exposureUnknown','cases'],['recovered','rain'])&&r.version===1&&fieldCaseById(r.currentCase)&&PAGES.includes(r.page)&&READ.includes(r.readPrompt)&&PLANT_DAYS.includes(r.sourceDay)&&validDays(r.exposedDays)&&typeof r.exposureUnknown==='boolean'&&object(r.cases)&&Object.keys(r.cases).length<=8&&Object.entries(r.cases).every(([id,w])=>fieldCaseById(id)&&workValid(w,id));}
export function fieldNotebook(state){return state.fieldNotebook===undefined?fresh():valid(state.fieldNotebook)?state.fieldNotebook:null;}
export function ensureFieldNotebook(state){if(state.fieldNotebook===undefined)state.fieldNotebook=fresh();return fieldNotebook(state);}
export function recoverFieldNotebook(state){if(state.fieldNotebook===undefined||fieldNotebook(state))return false;const raw=state.fieldNotebook;state.fieldNotebook={...fresh(),exposureUnknown:true,recovered:raw};return true;}
export function currentFieldCase(state){const r=fieldNotebook(state);return r?{definition:fieldCaseById(r.currentCase),work:r.cases[r.currentCase]??newWork()}:null;}
function change(state,fn){const r=fieldNotebook(state);if(!r)return false;const next=clone(r);const result=fn(next);if(result===false||!valid(next))return false;state.fieldNotebook=next;return result??true;}
function work(r){return r.cases[r.currentCase]??=(newWork());}
export function chooseFieldCase(state,id){if(!fieldCaseById(id))return false;return change(state,r=>{if(!r.cases[id])r.cases[id]=newWork();else if(id!==r.currentCase)r.cases[id].familiar=true;r.currentCase=id;});}
export function nextFieldCase(state){const r=fieldNotebook(state);return r?chooseFieldCase(state,FIELD_CASES[(FIELD_CASES.findIndex(c=>c.id===r.currentCase)+1)%FIELD_CASES.length].id):false;}
export function setFieldPage(state,page){if(!PAGES.includes(page))return false;return change(state,r=>{r.page=page;});}
export function setFieldReadPrompt(state,prompt){if(!READ.includes(prompt))return false;return change(state,r=>{r.readPrompt=prompt;});}
export function setFieldSourceDay(state,day){if(!PLANT_DAYS.includes(day))return false;return change(state,r=>{r.sourceDay=day;});}
export function noteFieldExposure(state,days,unknown=false){if(!Array.isArray(days))days=[days];if(!days.every(d=>PLANT_DAYS.includes(d))||typeof unknown!=='boolean')return false;return change(state,r=>{for(const day of days)if(!r.exposedDays.includes(day))r.exposedDays.push(day);r.exposureUnknown ||= unknown;});}
export function toggleFieldRow(state,id,origin='supplied-model'){const row=plantObservationById(id);if(!row||!ORIGINS.includes(origin)||origin==='kept-in-plant-study'&&!plantStudy(state)?.observations.includes(id))return false;return change(state,r=>{const w=work(r),index=w.rows.findIndex(x=>x.observation.id===id);if(index>=0){w.rows.splice(index,1);delete w.values[id];delete w.pending.bars[id];return {selected:false};}if(w.rows.length>=2)return false;w.rows.push({observation:clone(row),origin});w.values[id]=null;w.pending.bars[id]='';return {selected:true};});}
export function setFieldQuantity(state,id){if(id!==null&&!FIELD_QUANTITIES.some(q=>q.id===id))return false;return change(state,r=>{work(r).quantity=id;});}
export function setFieldUnit(state,id){if(id!==null&&!FIELD_UNITS.some(u=>u.id===id))return false;return change(state,r=>{work(r).unit=id;});}
export function setFieldValue(state,id,value){if(!validValue(value))return false;return change(state,r=>{const w=work(r);if(!Object.hasOwn(w.values,id))return false;w.values[id]=value;w.pending.bars[id]=value===null?'':String(value);});}
export function setFieldBarInput(state,id,text){if(!rawValid(text))return false;return change(state,r=>{const w=work(r);if(!Object.hasOwn(w.values,id))return false;w.pending.bars[id]=text;});}
export function setFieldModelInput(state,field,value){if(field==='choice'&&(value===null||['light','dim','same','unsure'].includes(value)))return change(state,r=>{work(r).pending.modelChoice=value;});if(field==='difference'&&rawValid(value))return change(state,r=>{work(r).pending.difference=value;});return false;}
export function useFieldSupport(state,task,kind){if(!FIELD_TASKS.includes(task)||!SUPPORT.includes(kind))return false;return change(state,r=>{const w=work(r);w.support[task]??={};w.support[task][kind]=true;});}
function snapshot(r){const w=work(r),c=fieldCaseById(r.currentCase);return {caseId:c.id,question:c.question,rows:clone(w.rows),values:clone(w.values),pending:clone(w.pending),quantity:w.quantity,unit:w.unit,sourceModel:clone(FIELD_SOURCE_MODEL),support:clone(w.support),familiar:w.familiar};}
export function fieldDraftSnapshot(state){const r=fieldNotebook(state);if(!r)return null;return snapshot(clone(r));}
function check(state,task,response){return change(state,r=>{const w=work(r);if(task==='model'&&object(response)){if(w.pending.modelChoice===null)w.pending.modelChoice=response.choice;if(w.pending.difference===''&&response.difference!==null)w.pending.difference=String(response.difference);}const draft=snapshot(r),result=resultFor(task,draft,response);if(result===null)return false;const entry={task,snapshot:draft,response:clone(response),result:clone(result),support:clone(w.support[task]??{}),practice:true,familiar:w.familiar||w.checks.length>0};w.checks.push(entry);w.checks=w.checks.slice(-24);return clone(entry);});}
export const checkFieldData=state=>check(state,'data',null);
export const checkFieldChart=state=>check(state,'chart',null);
export const answerFieldDraft=(state,choice)=>check(state,'draft',choice);
export const answerFieldSource=(state,choice)=>check(state,'source',choice);
export const answerFieldModel=(state,choice,difference=null)=>check(state,'model',{choice,difference});
export function currentFieldChecks(state){const x=currentFieldCase(state);return x?Object.fromEntries(x.work.checks.map(c=>[c.task,c])):{};}
export function keepFieldDraft(state){return change(state,r=>{const w=work(r);w.kept={draft:snapshot(r),checks:Object.fromEntries(w.checks.map(c=>[c.task,clone(c)])),revised:w.kept!==null};return clone(w.kept);});}
export function fieldCurrentTask(state){const r=fieldNotebook(state);return r?(r.page==='read'?r.readPrompt:r.page):null;}
export function fieldDisplayedDays(state,context='notebook'){
 const r=fieldNotebook(state);if(!r)return {days:[],unknown:true};const days=new Set(),x=currentFieldCase(state),addRows=rows=>{for(const row of rows)days.add(row.observation.day);};
 if(context==='notes'){
  // The expanded notes show every valid case's raw draft/check snapshots.
  const addCheck=check=>{addRows(check.snapshot.rows);if(check.task==='model')days.add(fieldCaseById(check.snapshot.caseId).day);};
  for(const w of Object.values(r.cases)){
   addRows(w.rows);w.checks.forEach(addCheck);
   if(w.kept){addRows(w.kept.draft.rows);Object.values(w.kept.checks).forEach(addCheck);}
  }
 }
 else if(context==='planting'){if(x.work.kept)addRows(x.work.kept.draft.rows);}
 else if(context==='notebook'){
  if(r.page==='data')days.add(r.sourceDay);addRows(x.work.rows);
  if(r.page==='read'&&r.readPrompt==='model')for(const id of x.definition.targetIds)days.add(plantObservationById(id).day);
  if(x.work.support[fieldCurrentTask(state)]?.example)days.add(fieldExampleCase(x.definition.id).day);
  if(r.page==='keep'&&x.work.kept)addRows(x.work.kept.draft.rows);
 }
 return {days:[...days].sort((a,b)=>a-b),unknown:r.exposureUnknown};
}
export const fieldNotebookDisplayExposure=fieldDisplayedDays;
export function fieldSourceRows(day){return PLANT_DAYS.includes(day)?PLANT_OBSERVATIONS.filter(r=>r.day===day):[];}
