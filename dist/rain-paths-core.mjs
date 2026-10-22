import {RAIN_MODEL,RAIN_CASES,RAIN_PAGES,RAIN_ROUTES,RAIN_SUPPORT,RAIN_COLUMNS,rainCaseById,rainQuestions} from './rain-paths-content.mjs';
const VIEW_DEFAULTS={tray:'A',planTray:'A',question:'factor'};
const viewChoices={tray:['A','B'],planTray:['A','B'],question:['factor','runoff','columns','difference']};
const viewsValid=v=>keys(v,Object.keys(VIEW_DEFAULTS))&&Object.entries(v).every(([k,value])=>viewChoices[k].includes(value));
const TASKS=['global','prediction','factor','runoff','columns','difference','plan'],CHOICES=['A','B','same','unsure'],TRAYS=['A','B'];
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,required,optional=[])=>object(x)&&required.every(k=>Object.hasOwn(x,k))&&Object.keys(x).every(k=>required.includes(k)||optional.includes(k));
const whole=(n,max)=>Number.isInteger(n)&&n>=0&&n<=max;
const clone=x=>JSON.parse(JSON.stringify(x));
// Saved snapshots are matched on ids and counts, not display wording, so a copy edit cannot strand a save.
const wordless=x=>JSON.parse(JSON.stringify(x,(k,v)=>k==='label'||k==='notice'?undefined:v));
function same(a,b){if(a===b)return true;if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]));return object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k]));}
const supportValid=s=>object(s)&&Object.entries(s).every(([k,v])=>RAIN_SUPPORT.includes(k)&&v===true);
const taskSupportValid=s=>keys(s,TASKS)&&TASKS.every(k=>supportValid(s[k]));
const newSupport=()=>Object.fromEntries(TASKS.map(k=>[k,{}]));
const mergedSupport=(w,task)=>({...w.support.global,...w.support[task]});
const modelSource=()=>({id:RAIN_MODEL.id,capacity:RAIN_MODEL.capacity,batchSize:RAIN_MODEL.batchSize,notice:RAIN_MODEL.notice});
function ledgers(c,progress){
 return c.trays.map(t=>{
  const row={id:t.id,cover:t.cover,priorStored:t.priorStored,newRainTotal:c.newRainTotal,cloudRemaining:c.newRainTotal,surfaceNew:0,storedNew:0,runoffNew:0,emptySlots:12-t.priorStored};
  for(let step=0;step<progress;step++){
   if(step%3===0){row.cloudRemaining-=4;row.surfaceNew+=4;}
   else if(step%3===1){const entering=t.cover==='open'?Math.min(row.surfaceNew,row.emptySlots):0;row.surfaceNew-=entering;row.storedNew+=entering;row.emptySlots-=entering;}
   else{row.runoffNew+=row.surfaceNew;row.surfaceNew=0;}
  }
  return row;
 });
}
const shown=(c,progress)=>({config:clone(c),progress,rows:ledgers(c,progress)});
const shownValid=(c,s)=>keys(s,['config','progress','rows'])&&same(wordless(s.config),wordless(c))&&whole(s.progress,3*c.newRainTotal/4)&&same(s.rows,ledgers(c,s.progress));
function sourceValid(s){
 const c=object(s)&&rainCaseById(s.caseId);
 return !!c&&keys(s,['caseId','model','config','rows','support','familiar'])&&same(wordless(s.model),wordless(modelSource()))&&same(wordless(s.config),wordless(c))&&same(s.rows,ledgers(c,3*c.newRainTotal/4))&&taskSupportValid(s.support)&&typeof s.familiar==='boolean';
}
// A carried completed result is valid independently of the live optional root.
export const rainResultSourceValid=sourceValid;
function predictionValid(p){return p===null||keys(p,['choice','timing','resultsExposed','exposureUnknown','support','familiar'])&&CHOICES.includes(p.choice)&&typeof p.resultsExposed==='boolean'&&typeof p.exposureUnknown==='boolean'&&p.timing===(p.resultsExposed?'after-results':p.exposureUnknown?'unknown':'before-results')&&supportValid(p.support)&&typeof p.familiar==='boolean';}
function responseValid(task,value){
 if(task==='factor')return rainQuestions('cover-12')[0].choices.some(c=>c.id===value);
 if(task==='runoff')return CHOICES.includes(value);
 if(task==='columns')return Array.isArray(value)&&value.length<=2&&new Set(value).size===value.length&&value.every(v=>RAIN_COLUMNS.some(c=>c.id===v));
 return task==='difference'&&typeof value==='string'&&value.length<=16;
}
const responseCorrect=(c,task,response)=>{const answer=rainQuestions(c.id).find(q=>q.id===task).answer;return task==='columns'?response.length===2&&answer.every(v=>response.includes(v)):task==='difference'?Number(response.trim())===answer:response===answer;};
function checkValid(c,a){
 return keys(a,['task','response','shown','source','support','familiar','practice','correct'])&&['factor','runoff','columns','difference'].includes(a.task)&&responseValid(a.task,a.response)&&shownValid(c,a.shown)&&(a.source===null||sourceValid(a.source)&&a.source.caseId===c.id)&&((a.source===null)===(a.shown.progress<3*c.newRainTotal/4))&&((a.task==='factor')||(a.shown.progress===3*c.newRainTotal/4&&a.source!==null))&&supportValid(a.support)&&typeof a.familiar==='boolean'&&a.practice===true&&typeof a.correct==='boolean'&&(a.task!=='difference'||/^\d{1,2}$/.test(a.response.trim())&&whole(Number(a.response.trim()),24));
}
function planValid(p,trayId,c){return p===null||keys(p,['source','trayId','route','sent','support','familiar'])&&sourceValid(p.source)&&p.source.caseId===c.id&&p.trayId===trayId&&RAIN_ROUTES.includes(p.route)&&whole(p.sent,p.source.rows.find(r=>r.id===trayId).runoffNew)&&p.sent%4===0&&supportValid(p.support)&&typeof p.familiar==='boolean';}
function workValid(c,w){
 return keys(w,['config','progress','prediction','support','familiar','restarted','pending','checks','keptResult','plans','keptPlans'],['views'])&&(!Object.hasOwn(w,'views')||viewsValid(w.views))&&same(wordless(w.config),wordless(c))&&whole(w.progress,3*c.newRainTotal/4)&&keys(w.prediction,['first','latest'])&&predictionValid(w.prediction.first)&&predictionValid(w.prediction.latest)&&((w.prediction.first===null)===(w.prediction.latest===null))&&taskSupportValid(w.support)&&typeof w.familiar==='boolean'&&typeof w.restarted==='boolean'&&keys(w.pending,['factor','runoff','columns','difference'])&&(w.pending.factor===null||responseValid('factor',w.pending.factor))&&(w.pending.runoff===null||responseValid('runoff',w.pending.runoff))&&responseValid('columns',w.pending.columns)&&responseValid('difference',w.pending.difference)&&Array.isArray(w.checks)&&w.checks.length<=24&&w.checks.every(a=>checkValid(c,a))&&(w.keptResult===null||sourceValid(w.keptResult)&&w.keptResult.caseId===c.id)&&keys(w.plans,TRAYS)&&keys(w.keptPlans,TRAYS)&&TRAYS.every(t=>planValid(w.plans[t],t,c)&&planValid(w.keptPlans[t],t,c)&&(w.keptPlans[t]===null||w.keptPlans[t].sent===w.keptPlans[t].source.rows.find(r=>r.id===t).runoffNew));
}
function valid(r){return keys(r,['version','page','currentCase','resultsExposed','exposureUnknown','cases'],['recovered'])&&r.version===1&&RAIN_PAGES.includes(r.page)&&rainCaseById(r.currentCase)&&typeof r.resultsExposed==='boolean'&&typeof r.exposureUnknown==='boolean'&&object(r.cases)&&Object.keys(r.cases).length<=4&&Object.entries(r.cases).every(([id,w])=>rainCaseById(id)&&workValid(rainCaseById(id),w));}
const fresh=()=>({version:1,page:'predict',currentCase:'cover-12',resultsExposed:false,exposureUnknown:false,cases:{}});
const freshWork=(c,familiar)=>({views:{...VIEW_DEFAULTS},config:clone(c),progress:0,prediction:{first:null,latest:null},support:newSupport(),familiar,restarted:false,pending:{factor:null,runoff:null,columns:[],difference:''},checks:[],keptResult:null,plans:{A:null,B:null},keptPlans:{A:null,B:null}});
// Read helpers do not create roots, record responses, or register display exposure.
export function rainPaths(state){return state.rainPaths===undefined?fresh():valid(state.rainPaths)?state.rainPaths:null;}
export function ensureRainPaths(state){if(state.rainPaths===undefined)state.rainPaths=fresh();return rainPaths(state);}
export function recoverRainPaths(state){if(state.rainPaths===undefined||rainPaths(state))return false;const original=state.rainPaths;state.rainPaths={...fresh(),exposureUnknown:true,recovered:original};return true;}
function change(state,fn){const current=rainPaths(state);if(!current)return false;const next=clone(current),result=fn(next);if(result===false||!valid(next))return false;state.rainPaths=next;return result??true;}
function selected(r){const c=rainCaseById(r.currentCase);r.cases[c.id]??=freshWork(c,r.resultsExposed||r.exposureUnknown);return {c,w:r.cases[c.id]};}
const familiar=(r,w)=>r.resultsExposed||r.exposureUnknown||w.familiar||w.restarted;
function resultFor(r,c,w){return {caseId:c.id,model:modelSource(),config:clone(w.config),rows:ledgers(c,w.progress),support:clone(w.support),familiar:familiar(r,w)};}
export function currentRainView(state,id){
 const r=rainPaths(state),c=r&&rainCaseById(id??r.currentCase);if(!c)return null;
 const w=r.cases[c.id]??freshWork(c,r.resultsExposed||r.exposureUnknown),batches=c.newRainTotal/4,complete=w.progress===3*batches;
 return clone({case:c,work:w,views:w.views??VIEW_DEFAULTS,progress:w.progress,batches,batch:complete?batches:Math.floor(w.progress/3)+1,phase:complete?'complete':['bring','opening','outlet'][w.progress%3],complete,trays:ledgers(c,w.progress),keptResult:w.keptResult,plans:w.plans});
}
export function rainResult(state,id){const r=rainPaths(state),v=currentRainView(state,id);return r&&v?.complete?clone(resultFor(r,v.case,v.work)):null;}
export function chooseRainCase(state,id){if(!rainCaseById(id))return false;return change(state,r=>{r.currentCase=id;const {w}=selected(r);w.familiar ||= r.resultsExposed||r.exposureUnknown;});}
export function setRainView(state,key,value){if(!Object.hasOwn(viewChoices,key)||!viewChoices[key].includes(value))return false;return change(state,r=>{const {w}=selected(r);w.views={...VIEW_DEFAULTS,...w.views,[key]:value};});}
export function setRainPage(state,page){if(!RAIN_PAGES.includes(page))return false;return change(state,r=>{r.page=page;});}
export function setRainPrediction(state,choice){if(!CHOICES.includes(choice))return false;return change(state,r=>{const {w}=selected(r),p={choice,timing:r.resultsExposed?'after-results':r.exposureUnknown?'unknown':'before-results',resultsExposed:r.resultsExposed,exposureUnknown:r.exposureUnknown,support:mergedSupport(w,'prediction'),familiar:familiar(r,w)};if(w.prediction.first===null)w.prediction.first=clone(p);w.prediction.latest=p;});}
export function useRainSupport(state,kind,task='global'){if(!RAIN_SUPPORT.includes(kind)||!TASKS.includes(task))return false;return change(state,r=>{selected(r).w.support[task][kind]=true;});}
export function nextRainPhase(state){return change(state,r=>{const {c,w}=selected(r);if(w.progress>=3*c.newRainTotal/4)return false;w.progress++;return {phase:currentRainView({rainPaths:r}).phase,rows:ledgers(c,w.progress)};});}
export function restartRainCase(state){return change(state,r=>{const {w}=selected(r);w.progress=0;w.familiar=true;w.restarted=true;});}
export function setRainPending(state,task,value){if(!responseValid(task,value))return false;return change(state,r=>{selected(r).w.pending[task]=clone(value);});}
export function submitRainComparison(state,task){
 if(!['factor','runoff','columns','difference'].includes(task))return false;
 return change(state,r=>{const {c,w}=selected(r),response=w.pending[task],complete=w.progress===3*c.newRainTotal/4;
  if(task!=='factor'&&!complete)return false;
  if(response===null||task==='columns'&&response.length!==2)return {valid:false,error:'Choose a response first.'};
  if(task==='difference'&&(!/^\d{1,2}$/.test(response.trim())||!whole(Number(response.trim()),24)))return {valid:false,error:'Enter a whole number from 0 to 24.'};
  const correct=responseCorrect(c,task,response),snapshot={task,response:clone(response),shown:shown(c,w.progress),source:complete?resultFor(r,c,w):null,support:mergedSupport(w,task),familiar:familiar(r,w)||w.checks.some(a=>a.task===task),practice:true,correct};
  w.checks.push(snapshot);w.checks=w.checks.slice(-24);
  return {valid:true,correct,feedback:rainQuestions(c.id).find(q=>q.id===task).feedback,snapshot:clone(snapshot)};
 });
}
export function keepRainResult(state){return change(state,r=>{const {c,w}=selected(r);if(w.progress!==3*c.newRainTotal/4)return false;if(w.keptResult===null)w.keptResult=resultFor(r,c,w);return clone(w.keptResult);});}
function planView(p){if(!p)return null;const total=p.source.rows.find(r=>r.id===p.trayId).runoffNew,cup=p.route==='holding12'?Math.min(12,p.sent):0;return clone({...p,total,reserve:total-p.sent,cup,lowPath:p.sent-cup,complete:p.sent===total});}
export function rainPlanView(state,trayId,id){const v=currentRainView(state,id);return v&&TRAYS.includes(trayId)?planView(v.work.plans[trayId]):null;}
export function chooseRainPlan(state,trayId,route='straight'){
 if(!TRAYS.includes(trayId)||!RAIN_ROUTES.includes(route))return false;
 return change(state,r=>{const {c,w}=selected(r);if(w.plans[trayId]!==null)return planView(w.plans[trayId]);const source=w.progress===3*c.newRainTotal/4?resultFor(r,c,w):(w.keptResult??w.plans.A?.source??w.plans.B?.source??null);if(source===null)return false;w.plans[trayId]={source:clone(source),trayId,route,sent:0,support:mergedSupport(w,'plan'),familiar:familiar(r,w)};return planView(w.plans[trayId]);});
}
export function setRainPlanRoute(state,trayId,route){if(!TRAYS.includes(trayId)||!RAIN_ROUTES.includes(route))return false;return change(state,r=>{const {w}=selected(r),p=w.plans[trayId];if(!p)return false;p.route=route;p.sent=0;p.support=mergedSupport(w,'plan');p.familiar=true;return planView(p);});}
export function nextRainPlan(state,trayId){if(!TRAYS.includes(trayId))return false;return change(state,r=>{const {w}=selected(r),p=w.plans[trayId];if(!p)return false;const total=p.source.rows.find(row=>row.id===trayId).runoffNew;if(p.sent>=total)return false;p.sent=Math.min(total,p.sent+4);p.support={...p.support,...mergedSupport(w,'plan')};return planView(p);});}
export function keepRainPlan(state,trayId){if(!TRAYS.includes(trayId))return false;return change(state,r=>{const {w}=selected(r),p=w.plans[trayId];if(!p||!planView(p).complete)return false;p.support={...p.support,...mergedSupport(w,'plan')};w.keptPlans[trayId]=clone(p);return planView(p);});}
// Descriptors concern the actual representation, never arbitrary co-occurring counts.
// The caller selects only the view/representation it really displays, then sends facts
// to the existing shared exposure hook. This helper never creates arithmetic answers.
export function rainDisplayExposure(state,{view='machine',trayId=null,storageArray=view==='machine',priorArray=view==='machine',batchGroups=false}={}){
 const r=rainPaths(state),v=currentRainView(state);if(!r||!v)return {results:false,unknown:state.rainPaths!==undefined,facts:[]};
 if(!['machine','compare','plan','kept','notes','example'].includes(view))return {results:false,unknown:false,facts:[]};
 const plan=TRAYS.includes(trayId)?v.work.plans[trayId]:null;
 let results=false,facts=[];
 if(view==='machine'){results=v.progress>0;if(storageArray)facts.push([3,4]);if(priorArray&&v.case.trays.some(t=>t.priorStored===8))facts.push([2,4]);if(batchGroups)facts.push([v.batches,4]);}
 else if(view==='compare'){results=v.progress>0;}
 else if(view==='plan'){results=!!plan;if(plan&&storageArray&&plan.route==='holding12')facts.push([3,4]);}
 else if(view==='kept'){results=!!v.work.keptResult||TRAYS.some(t=>v.work.keptPlans[t]!==null);if(results&&storageArray)facts.push([3,4]);if(results&&priorArray&&v.case.trays.some(t=>t.priorStored===8))facts.push([2,4]);}
 else if(view==='notes'){results=Object.values(r.cases).some(w=>w.progress>0||w.keptResult!==null||TRAYS.some(t=>w.plans[t]!==null||w.keptPlans[t]!==null));if(batchGroups)for(const c of RAIN_CASES)if(r.cases[c.id])facts.push([c.newRainTotal/4,4]);if(storageArray&&Object.keys(r.cases).length)facts.push([3,4]);if(priorArray&&Object.entries(r.cases).some(([id])=>rainCaseById(id).trays.some(t=>t.priorStored===8)))facts.push([2,4]);}
 else if(view==='example'){results=true;if(storageArray)facts.push([3,4]);if(batchGroups)facts.push([3,4]);}
 facts=facts.filter((p,i)=>facts.findIndex(q=>same(q,p))===i);return {results,unknown:r.exposureUnknown,facts};
}
export function noteRainDisplayExposure(state,exposure){if(!keys(exposure,['results','unknown','facts'])||typeof exposure.results!=='boolean'||typeof exposure.unknown!=='boolean'||!Array.isArray(exposure.facts)||!exposure.facts.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isInteger(n)&&n>=1&&n<=12)))return false;return change(state,r=>{r.resultsExposed ||= exposure.results;r.exposureUnknown ||= exposure.unknown;if(r.resultsExposed||r.exposureUnknown)for(const w of Object.values(r.cases))w.familiar=true;});}
