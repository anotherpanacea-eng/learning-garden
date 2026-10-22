import {BATCH_CASES,BATCH_INGREDIENTS,BATCH_MODEL,BATCH_PAGES,BATCH_UNITS,BATCH_SUPPORT,BATCH_HELP,batchById} from './whole-batches-content.mjs';
import {recipeScale} from './measuring-recipes-core.mjs';
import {localDay,validDay} from './town-day.mjs';
// Concrete saved enums and fields live here: no mutator touches another extension.
const IDS=BATCH_INGREDIENTS.map(x=>x.id),KINDS=['plan','contrast','reference','reading','message','tray'];
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,required,optional=[])=>obj(x)&&required.every(k=>Object.hasOwn(x,k))&&Object.keys(x).every(k=>required.includes(k)||optional.includes(k));
const clone=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));
const same=(a,b)=>a===b||(Array.isArray(a)&&Array.isArray(b)?a.length===b.length&&a.every((v,i)=>same(v,b[i])):obj(a)&&obj(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k])));
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const amount=(n,max=500)=>integer(n,0,max)&&n%50===0;
const text=x=>typeof x==='string'&&x.length<=24;
const pair=x=>keys(x,IDS)&&IDS.every(id=>amount(x[id]));
const supportValid=x=>obj(x)&&x.visual===true&&Object.entries(x).every(([k,v])=>BATCH_SUPPORT.includes(k)&&v===true);
function sourceValid(s,c){return keys(s,['id','title','purpose','destination','guests','copies','modelId','revision','unit','baseGuests','base','targets'])&&s.id===c.id&&typeof s.title==='string'&&typeof s.purpose==='string'&&typeof s.destination==='string'&&typeof s.modelId==='string'&&integer(s.guests,0,6)&&integer(s.copies,0,3)&&Number.isSafeInteger(s.revision)&&s.revision>=0&&text(s.unit)&&integer(s.baseGuests,0,6)&&resultPair(s.base)&&resultPair(s.targets);}
export function parseBatchReading(value){if(!text(value)||!/^\d+$/.test(value.trim()))return null;const n=Number(value.trim());return integer(n,0,500)?n:null;}
export const parseBatchNumber=parseBatchReading;
export function batchSources(model){return Object.fromEntries(IDS.map(id=>[id,1000-model.portions[id]-(model.jug.ingredient===id?model.jug.amount:0)]));}
function modelValid(m){return keys(m,['jug','portions'])&&keys(m.jug,['ingredient','amount'])&&amount(m.jug.amount)&&(m.jug.amount===0?m.jug.ingredient===null:IDS.includes(m.jug.ingredient))&&pair(m.portions)&&Object.values(batchSources(m)).every(n=>amount(n,1000));}
const REFERENCE=['cloud','star'],MESSAGE=['destination','guests','cloud','cloudUnit','star','starUnit'];
const short=id=>id==='cloud-water'?'cloud':id==='star-water'?'star':REFERENCE.includes(id)?id:null;
function messageValue(field,value){return value===null||(field==='destination'?BATCH_CASES.some(c=>c.id===value):field.endsWith('Unit')?BATCH_UNITS.includes(value):field==='guests'?[2,4,6].includes(value):integer(value,0,500));}
const messageValid=m=>keys(m,MESSAGE)&&MESSAGE.every(k=>messageValue(k,m[k]));
const readingValid=r=>keys(r,['text','unit'])&&text(r.text)&&(r.unit===null||BATCH_UNITS.includes(r.unit));
const referenceValid=r=>keys(r,REFERENCE)&&REFERENCE.every(k=>text(r[k]));
const contrastValid=r=>keys(r,REFERENCE)&&REFERENCE.every(k=>amount(r[k],200));
const draftFields=['copies','selectedIngredient','model','reading','reference','contrast','message'];
function draftValid(d){return keys(d,draftFields)&&integer(d.copies,0,3)&&IDS.includes(d.selectedIngredient)&&modelValid(d.model)&&(d.model.jug.amount===0||d.selectedIngredient===d.model.jug.ingredient)&&readingValid(d.reading)&&referenceValid(d.reference)&&contrastValid(d.contrast)&&messageValid(d.message);}
const draft=w=>Object.fromEntries(draftFields.map(k=>[k,clone(w[k])]));
export function batchPlanAssessment(c,w){return {copies:w.copies,targetCopies:c.copies,guests:w.copies*2,targetGuests:c.guests,matches:w.copies===c.copies,totals:Object.fromEntries(IDS.map(id=>[id,w.copies*c.base[id]]))};}
export function batchReadingAssessment(model,reading){const n=parseBatchReading(reading.text);return n===null?null:{readNumber:n,actualAmount:model.jug.amount,numberRead:n===model.jug.amount,unitNamed:reading.unit==='mL'};}
export function batchMessageAssessment(c,m){const fields=Object.fromEntries(MESSAGE.map(k=>[k,m[k]===(k==='destination'?c.id:k==='guests'?c.guests:k.endsWith('Unit')?'mL':c.targets[k==='cloud'?'cloud-water':'star-water'])]));return {fields,complete:MESSAGE.every(k=>m[k]!==null),matches:Object.values(fields).every(Boolean)};}
export function batchTrayAssessment(c,w){const ingredients=Object.fromEntries(IDS.map(id=>[id,{amount:w.model.portions[id],target:c.targets[id],status:w.model.portions[id]<c.targets[id]?'below':w.model.portions[id]>c.targets[id]?'above':'matches'}]));const portionsMatch=IDS.every(id=>ingredients[id].status==='matches'),jugEmpty=w.model.jug.amount===0,planFit=w.copies===c.copies,messageFit=batchMessageAssessment(c,w.message).matches;return {ingredients,portionsMatch,jugEmpty,planFit,messageFit,ready:portionsMatch&&jugEmpty&&planFit&&messageFit};}
export function batchReferenceAssessment(r){const cloud=parseBatchReading(r.cloud),star=parseBatchReading(r.star);return cloud===null||star===null?null:{cloud:{amount:cloud,target:100,matches:cloud===100},star:{amount:star,target:150,matches:star===150},matches:cloud===100&&star===150};}
export function batchContrastAssessment(r){return {cloud:{extra:r.cloud,amount:200+r.cloud,target:300,matches:r.cloud===100},star:{extra:r.star,amount:300+r.star,target:450,matches:r.star===150},matches:r.cloud===100&&r.star===150};}
function assess(c,d,kind){return kind==='plan'?batchPlanAssessment(c,d):kind==='reading'?batchReadingAssessment(d.model,d.reading):kind==='message'?batchMessageAssessment(c,d.message):kind==='reference'?batchReferenceAssessment(d.reference):kind==='contrast'?batchContrastAssessment(d.contrast):batchTrayAssessment(c,d);}
const boolean=x=>typeof x==='boolean';
const resultPair=x=>keys(x,IDS)&&IDS.every(id=>integer(x[id],0,500));
const resultPart=x=>keys(x,['amount','target','matches'])&&integer(x.amount,0,500)&&integer(x.target,0,500)&&boolean(x.matches);
function assessmentValid(kind,a){
 if(kind==='plan')return keys(a,['copies','targetCopies','guests','targetGuests','matches','totals'])&&integer(a.copies,0,3)&&integer(a.targetCopies,0,3)&&integer(a.guests,0,6)&&integer(a.targetGuests,0,6)&&boolean(a.matches)&&resultPair(a.totals);
 if(kind==='reading')return keys(a,['readNumber','actualAmount','numberRead','unitNamed'])&&integer(a.readNumber,0,500)&&integer(a.actualAmount,0,500)&&boolean(a.numberRead)&&boolean(a.unitNamed);
 if(kind==='message')return keys(a,['fields','complete','matches'])&&keys(a.fields,MESSAGE)&&MESSAGE.every(k=>boolean(a.fields[k]))&&boolean(a.complete)&&boolean(a.matches);
 if(kind==='reference'||kind==='contrast')return keys(a,['cloud','star','matches'])&&REFERENCE.every(k=>kind==='reference'?resultPart(a[k]):keys(a[k],['extra','amount','target','matches'])&&integer(a[k].extra,0,200)&&integer(a[k].amount,0,500)&&integer(a[k].target,0,500)&&boolean(a[k].matches))&&boolean(a.matches);
 return kind==='tray'&&keys(a,['ingredients','portionsMatch','jugEmpty','planFit','messageFit','ready'])&&keys(a.ingredients,IDS)&&IDS.every(id=>keys(a.ingredients[id],['amount','target','status'])&&integer(a.ingredients[id].amount,0,500)&&integer(a.ingredients[id].target,0,500)&&['below','above','matches'].includes(a.ingredients[id].status))&&['portionsMatch','jugEmpty','planFit','messageFit','ready'].every(k=>boolean(a[k]));
}
function checkValid(s,c){return keys(s,['kind','source','input','target','assessment','support','previouslyChecked','practice','modelVisible'])&&KINDS.includes(s.kind)&&sourceValid(s.source,c)&&draftValid(s.input)&&keys(s.target,['guests','copies','amounts'])&&integer(s.target.guests,0,6)&&integer(s.target.copies,0,3)&&resultPair(s.target.amounts)&&(s.kind!=='reading'||parseBatchReading(s.input.reading.text)!==null)&&(s.kind!=='reference'||batchReferenceAssessment(s.input.reference)!==null)&&assessmentValid(s.kind,s.assessment)&&supportValid(s.support)&&boolean(s.previouslyChecked)&&s.practice===true&&s.modelVisible===true;}
function artifactValid(s,c,kept=false){return keys(s,['source','input','assessment','support','practice','modelVisible'],kept?['keptDay']:[])&&(!Object.hasOwn(s,'keptDay')||validDay(s.keptDay))&&sourceValid(s.source,c)&&draftValid(s.input)&&assessmentValid('tray',s.assessment)&&supportValid(s.support)&&s.practice===true&&s.modelVisible===true;}
const latest=(w,kind)=>w.checks.findLast(s=>s.kind===kind)||null;
function workValid(c,w){return keys(w,['source',...draftFields,'helpTopic','exampleStep','support','checks','checkedKinds','kept','offered','feedback','inputError'])&&sourceValid(w.source,c)&&draftValid(draft(w))&&(w.helpTopic===null||BATCH_HELP.includes(w.helpTopic))&&supportValid(w.support)&&(w.exampleStep===null||integer(w.exampleStep,0,3)&&w.support.workedExample===true)&&Array.isArray(w.checks)&&w.checks.length<=24&&w.checks.every(s=>checkValid(s,c))&&keys(w.checkedKinds,KINDS)&&KINDS.every(k=>typeof w.checkedKinds[k]==='boolean'&&(!w.checks.some(s=>s.kind===k)||w.checkedKinds[k]))&&(w.kept===null||artifactValid(w.kept,c,true))&&(w.offered===null||artifactValid(w.offered,c)&&w.offered.assessment.ready)&&keys(w.feedback,KINDS)&&KINDS.every(k=>typeof w.feedback[k]==='boolean'&&(!w.feedback[k]||latest(w,k)&&same(latest(w,k).input,draft(w))))&&['','reading-invalid','reference-invalid'].includes(w.inputError)&&(w.inputError!=='reading-invalid'||parseBatchReading(w.reading.text)===null&&!w.feedback.reading)&&(w.inputError!=='reference-invalid'||batchReferenceAssessment(w.reference)===null&&!w.feedback.reference);}
function valid(r){return keys(r,['version','currentCase','page','cases'],['recovered'])&&r.version===1&&BATCH_PAGES.includes(r.page)&&obj(r.cases)&&Object.keys(r.cases).length<=3&&Object.entries(r.cases).every(([id,w])=>batchById(id)&&workValid(batchById(id),w))&&(r.currentCase===null||batchById(r.currentCase)&&Object.hasOwn(r.cases,r.currentCase))&&(r.page==='choose'||r.currentCase!==null);}
const fresh=()=>({version:1,currentCase:null,page:'choose',cases:{}});
export function batchState(state){return !Object.hasOwn(state,'wholeBatches')?fresh():valid(state.wholeBatches)?state.wholeBatches:null;}
export function recoverBatches(state){if(!Object.hasOwn(state,'wholeBatches')||batchState(state))return false;const original=state.wholeBatches,cases=Object.entries(obj(original?.cases)?original.cases:{}).filter(([id,w])=>batchById(id)&&workValid(batchById(id),w));state.wholeBatches={...fresh(),cases:clone(Object.fromEntries(cases)),recovered:original};return true;}
function change(state,fn){const r=batchState(state);if(!r)return false;const next=clone(r),result=fn(next);if(result===false||!valid(next))return false;state.wholeBatches=next;return result??true;}
const work=r=>r.currentCase?r.cases[r.currentCase]:null;
const emptyModel=()=>({jug:{ingredient:null,amount:0},portions:Object.fromEntries(IDS.map(id=>[id,0]))});
const flags=()=>Object.fromEntries(KINDS.map(k=>[k,false]));
const newWork=c=>({source:clone(c),copies:0,selectedIngredient:IDS[0],model:emptyModel(),reading:{text:'',unit:null},reference:{cloud:'',star:''},contrast:{cloud:100,star:100},message:Object.fromEntries(MESSAGE.map(k=>[k,null])),helpTopic:null,exampleStep:null,support:{visual:true},checks:[],checkedKinds:flags(),kept:null,offered:null,feedback:flags(),inputError:''});
function edit(w){w.feedback=flags();w.inputError='';}
function editWork(state,fn){return change(state,r=>{const w=work(r);if(!w)return false;const result=fn(w,batchById(r.currentCase));if(result===false)return false;edit(w);return result;});}
export function chooseBatchCase(state,id){const c=batchById(id);if(!c)return false;return change(state,r=>{if(!Object.hasOwn(r.cases,id))r.cases[id]=newWork(c);r.currentCase=id;r.page='plan';});}
export function setBatchPage(state,page){if(!BATCH_PAGES.includes(page))return false;return change(state,r=>{if(page!=='choose'&&!work(r))return false;r.page=page;if(work(r))work(r).inputError='';});}
export function setBatchCopies(state,n){if(!integer(n,0,3))return false;return editWork(state,w=>{w.copies=n;});}
export function chooseBatchIngredient(state,id){if(!IDS.includes(id))return false;return editWork(state,w=>{if(w.model.jug.amount||w.selectedIngredient===id)return false;w.selectedIngredient=id;});}
export function fillBatchJug(state){return editWork(state,w=>{if(w.model.jug.amount===500||batchSources(w.model)[w.selectedIngredient]<50)return false;w.model.jug={ingredient:w.selectedIngredient,amount:w.model.jug.amount+50};w.support.handling=true;});}
export function returnBatchJug(state,all=false){if(typeof all!=='boolean')return false;return editWork(state,w=>{if(!w.model.jug.amount)return false;w.model.jug.amount-=all?w.model.jug.amount:50;if(!w.model.jug.amount)w.model.jug.ingredient=null;w.support.handling=true;});}
export function pourBatchJug(state){return editWork(state,w=>{const j=w.model.jug;if(!j.amount||w.model.portions[j.ingredient]+j.amount>500)return false;w.model.portions[j.ingredient]+=j.amount;w.model.jug={ingredient:null,amount:0};w.support.handling=true;});}
export function returnBatchPortion(state,id,all=false){if(!IDS.includes(id)||typeof all!=='boolean')return false;return editWork(state,w=>{if(!w.model.portions[id])return false;if(all)w.model.portions[id]=0;else{const j=w.model.jug;if(j.amount===500||j.amount&&j.ingredient!==id)return false;w.model.portions[id]-=50;w.model.jug={ingredient:id,amount:j.amount+50};w.selectedIngredient=id;}w.support.handling=true;});}
export function resetBatchApparatus(state){return editWork(state,w=>{w.model=emptyModel();w.support.handling=true;});}
export function setBatchReading(state,value){if(!text(value))return false;return editWork(state,w=>{w.reading.text=value;});}
export function setBatchUnit(state,unit){if(unit!==null&&!BATCH_UNITS.includes(unit))return false;return editWork(state,w=>{w.reading.unit=unit;});}
export function setBatchMessage(state,field,value){if(!MESSAGE.includes(field)||!messageValue(field,value))return false;return editWork(state,w=>{w.message[field]=value;});}
export function setBatchReference(state,id,value){const k=short(id);if(!k||!text(value))return false;return editWork(state,w=>{w.reference[k]=value;});}
export function adjustBatchContrast(state,id,delta){const k=short(id);if(!k||![-50,50].includes(delta))return false;return editWork(state,w=>{const n=w.contrast[k]+delta;if(!amount(n,200))return false;w.contrast[k]=n;});}
export function useBatchSupport(state,kind){if(!BATCH_SUPPORT.includes(kind)||kind==='visual'||kind==='handling'||kind.endsWith('Feedback'))return false;return change(state,r=>{const w=work(r);if(!w)return false;w.support[kind]=true;if(kind==='workedExample'&&w.exampleStep===null)w.exampleStep=0;});}
export function setBatchHelp(state,topic){if(topic!==null&&!BATCH_HELP.includes(topic))return false;return change(state,r=>{const w=work(r);if(!w)return false;w.helpTopic=topic;w.inputError='';if(topic)w.support[topic]=true;if(topic==='example'){w.support.workedExample=true;if(w.exampleStep===null)w.exampleStep=0;}});}
export function stepBatchExample(state,delta){if(![-1,1].includes(delta))return false;return change(state,r=>{const w=work(r);if(!w)return false;w.support.workedExample=true;w.exampleStep=Math.max(0,Math.min(3,(w.exampleStep??0)+delta));});}
function check(state,kind){return change(state,r=>{const w=work(r),c=batchById(r.currentCase);if(!w)return false;const assessment=assess(c,w,kind);if(assessment===null){w.inputError=kind+'-invalid';w.feedback[kind]=false;return {valid:false,error:'Use a whole number from 0 to 500. Blank or malformed entries remain drafts.'};}const s={kind,source:clone(w.source),input:draft(w),target:{guests:c.guests,copies:c.copies,amounts:clone(c.targets)},assessment,support:clone(w.support),previouslyChecked:w.checkedKinds[kind],practice:true,modelVisible:true};w.checks.push(s);if(w.checks.length>24){const redundant=w.checks.findIndex((s,i)=>w.checks.slice(i+1).some(t=>t.kind===s.kind));w.checks.splice(redundant,1);}w.checkedKinds[kind]=true;w.feedback[kind]=true;w.inputError='';w.support[kind+'Feedback']=true;if(kind==='reading')w.support.readingReveal=true;return clone(s);});}
export const checkBatchReading=state=>check(state,'reading');
export const checkBatchPlan=state=>check(state,'plan');
export const checkBatchTray=state=>check(state,'tray');
export const checkBatchMessage=state=>check(state,'message');
export const checkBatchReference=state=>check(state,'reference');
export const checkBatchContrast=state=>check(state,'contrast');
function artifact(c,w){return {source:clone(w.source),input:draft(w),assessment:batchTrayAssessment(c,w),support:clone(w.support),practice:true,modelVisible:true};}
export function keepBatch(state){return change(state,r=>{const w=work(r);if(!w)return false;w.kept={...artifact(batchById(r.currentCase),w),keptDay:localDay()};return clone(w.kept);});}
export function offerBatch(state){return change(state,r=>{const w=work(r);if(!w||!batchTrayAssessment(batchById(r.currentCase),w).ready)return false;if(w.offered&&same(w.offered.input,draft(w))&&same(w.offered.support,w.support))return false;w.offered=artifact(batchById(r.currentCase),w);return clone(w.offered);});}
export function makeBatchTogether(state){return editWork(state,(w,c)=>{w.support.together=true;w.copies=c.copies;w.model={jug:{ingredient:null,amount:0},portions:clone(c.targets)};w.message={destination:c.id,guests:c.guests,cloud:c.targets['cloud-water'],cloudUnit:'mL',star:c.targets['star-water'],starUnit:'mL'};});}
export function batchView(state){const r=batchState(state);if(!r)return null;const w=work(r),c=batchById(r.currentCase);if(!w)return {case:null,work:null};const j=w.model.jug,sources=batchSources(w.model),assessment=Object.fromEntries(KINDS.map(k=>[k,assess(c,w,k)])),latestChecks=Object.fromEntries(KINDS.map(k=>[k,latest(w,k)]));return {case:c,work:w,model:w.model,sources,assessment,latestChecks,currentFeedback:Object.fromEntries(KINDS.map(k=>[k,w.feedback[k]?latestChecks[k]:null])),inputError:w.inputError,keptEarlier:!!w.kept&&!same(w.kept.input,draft(w)),offeredEarlier:!!w.offered&&!same(w.offered.input,draft(w)),scale:recipeScale(j.amount),example:w.exampleStep===null?null:{step:w.exampleStep,copies:c.copies===2?1:2,guests:(c.copies===2?1:2)*2,cloud:(c.copies===2?1:2)*100,star:(c.copies===2?1:2)*150,notice:'Separate supplied worked example; your tray is unchanged.'},actions:{fill:{enabled:j.amount<500&&sources[w.selectedIngredient]>=50,reason:j.amount===500?'The jug is at its 500 mL capacity.':sources[w.selectedIngredient]<50?'This source does not have 50 mL available.':''},returnJug:{enabled:j.amount>0,reason:j.amount===0?'The jug is empty.':''},pour:{enabled:j.amount>0&&w.model.portions[j.ingredient]+j.amount<=500,reason:j.amount===0?'The jug is empty.':w.model.portions[j.ingredient]+j.amount>500?'That preparation jar would exceed its 500 mL capacity.':''},chooseIngredient:{enabled:j.amount===0,reason:j.amount>0?'Return or pour this ingredient first.':''},returnPortions:Object.fromEntries(IDS.map(id=>[id,{enabled:w.model.portions[id]>=50&&j.amount<500&&(!j.amount||j.ingredient===id),reason:w.model.portions[id]===0?'This preparation jar is empty.':j.amount===500?'The jug is at its 500 mL capacity.':j.amount>0&&j.ingredient!==id?'Return or pour this ingredient first.':''}])),offer:{enabled:assessment.tray.ready}}};}
// The compact strip renders the base and current plan on every open task page.
// Plan feedback also renders its frozen earlier guest relation. Optional help
// contributes only its visible rows; ingredient sums never enter fact profiles.
export function batchDisplayedFactPairs(state,options=null){
 const r=batchState(state),v=batchView(state);if(!r||!v?.work||r.page==='choose')return [];
 const {copies,base,example,reference}=options??{copies:true,base:true,example:v.work.helpTopic==='example',reference:v.work.helpTopic==='reference'};
 const counts=[];if(base)counts.push(1);if(copies&&v.work.copies)counts.push(v.work.copies);
 if(options===null&&['message','keep'].includes(r.page))counts.push(v.case.copies);
 if(options===null&&v.work.helpTopic==='copies')counts.push(2);
 if(options===null&&r.page==='keep')for(const record of [v.work.kept,v.work.offered])if(record?.input.copies)counts.push(record.input.copies);
 if(options===null&&r.page==='plan'&&v.latestChecks.plan?.input.copies)counts.push(v.latestChecks.plan.input.copies);
 if(example&&v.example)counts.push(v.example.copies);if(reference)counts.push(2);
 return [...new Set(counts)].map(n=>[n,2]);
}
