// Original, authored ramp model. Distances are illustrative, not measured data.
export const MODEL_REVISION='ramp-1';
export const heights=Object.freeze([{id:'low',label:'Low'},{id:'middle',label:'Middle'},{id:'high',label:'High'}].map(Object.freeze));
export const surfaces=Object.freeze([{id:'smooth',label:'Smooth'},{id:'rough',label:'Rough'}].map(Object.freeze));
export const configurations=Object.freeze([
 ['low','smooth',[12,13,12]],['low','rough',[5,6,5]],
 ['middle','smooth',[19,18,19]],['middle','rough',[9,10,9]],
 ['high','smooth',[26,25,26]],['high','rough',[14,15,14]],
].map(([height,surface,distances])=>Object.freeze({id:`${height}-${surface}`,height,surface,distances:Object.freeze(distances)})));
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const integer=(x,min=0)=>Number.isSafeInteger(x)&&x>=min;
const has=(list,value)=>list.some(x=>x.id===value);
const predictions=new Set(['farther','shorter','same','unsure']);
const readings=new Set(['unobserved','together','independent']);
const configuration=id=>configurations.find(c=>c.id===id);
const idNumber=id=>typeof id==='string'&&/^workshop-\d+$/.test(id)?Number(id.slice(9)):0;
function close(e,reason){e.closed=true;e.closedReason=reason;return e;}
function validTrial(t,e){
 const c=object(t)&&configuration(t.configurationId);
 return !!c&&t.revision===e.revision&&t.height===c.height&&t.surface===c.surface&&integer(t.trialNumber,1)&&integer(t.distance)&&t.distance<=30&&
  (e.variable==='height'?c.surface===e.fixed:c.height===e.fixed);
}
function normalizeExperiment(e){
 // Keep every unsupported model field, including pending work, verbatim.
 if(e.revision!==MODEL_REVISION)return close(e,'This comparison uses an older or unavailable model. Its saved work is kept here; start a fresh comparison to investigate again.');
 if(e.closed===true)return e;
 if(!['height','surface'].includes(e.variable)||!has(e.variable==='height'?surfaces:heights,e.fixed)||!has(e.variable==='height'?heights:surfaces,e.setting))return close(e,'The saved comparison settings could not be safely continued. Its work has been kept.');
 if(!Array.isArray(e.trials)||e.trials.some(t=>!validTrial(t,e))||e.pending!==null&&(!validTrial(e.pending,e)||![0,1,2].includes(e.pending.phase)))return close(e,'The saved trial could not be safely continued. Its exact work has been kept.');
 e.trials=e.trials.slice(-24);
 e.counts=object(e.counts)?e.counts:{};
 for(const c of configurations){
  const largest=Math.max(0,...e.trials.filter(t=>t.configurationId===c.id).map(t=>t.trialNumber),e.pending?.configurationId===c.id?e.pending.trialNumber:0);
  e.counts[c.id]=Math.max(integer(e.counts[c.id])?e.counts[c.id]:0,largest);
 }
 if(e.pending){
  const alreadyRecorded=e.trials.some(t=>t.configurationId===e.pending.configurationId&&t.trialNumber===e.pending.trialNumber);
  // committed remains true even if a replay's old row is outside the retained table.
  e.pending.committed=e.pending.committed===true||alreadyRecorded;
  if(e.pending.phase===2&&!e.pending.committed)return close(e,'The saved stopping point has no matching completed trial. Its exact work has been kept.');
 }
 e.prediction=predictions.has(e.prediction)?e.prediction:null;
 e.predictionAfterResults=e.predictionAfterResults===true;
 e.support={...(object(e.support)?e.support:{}),explanation:e.support?.explanation===true,audioRequested:e.support?.audioRequested===true};
 e.reading=readings.has(e.reading)?e.reading:'unobserved';
 e.finished=e.finished===true;
 return e;
}
function trim(w){
 if(w.experiments.length<=24)return;
 const current=w.experiments.find(e=>e.id===w.current),latest=w.experiments.slice(-24);
 if(current&&!latest.includes(current))latest[0]=current;
 w.experiments=latest;
}
export function ensureWorkshop(state){
 const w=object(state.workshop)?state.workshop:{};
 const seen=new Set();
 w.experiments=(Array.isArray(w.experiments)?w.experiments:[]).filter(e=>{
  if(!object(e)||typeof e.id!=='string'||seen.has(e.id))return false;
  seen.add(e.id);return true;
 }).map(normalizeExperiment);
 w.version=1;
 w.nextExperiment=Math.max(integer(w.nextExperiment,1)?w.nextExperiment:1,1,...w.experiments.map(e=>idNumber(e.id)+1));
 if(!w.experiments.some(e=>e.id===w.current))w.current=null;
 trim(w);state.workshop=w;return w;
}
export function currentWorkshop(state){
 const w=ensureWorkshop(state);return w.experiments.find(e=>e.id===w.current)||null;
}
export function startWorkshop(state,variable='height',fixed='smooth'){
 if(!['height','surface'].includes(variable)||!has(variable==='height'?surfaces:heights,fixed))return null;
 const w=ensureWorkshop(state),e={id:`workshop-${w.nextExperiment++}`,revision:MODEL_REVISION,variable,fixed,setting:variable==='height'?'low':'smooth',prediction:null,predictionAfterResults:false,support:{explanation:false,audioRequested:false},reading:'unobserved',trials:[],counts:Object.fromEntries(configurations.map(c=>[c.id,0])),pending:null,finished:false};
 w.experiments.push(e);w.current=e.id;trim(w);return e;
}
export function resumeWorkshop(state,id){
 const w=ensureWorkshop(state);if(!w.experiments.some(e=>e.id===id))return false;
 w.current=id;return true;
}
const active=state=>{const e=currentWorkshop(state);return e&&!e.closed?e:null;};
const inMotion=e=>e.pending&&e.pending.phase<2;
export function setWorkshopSetting(state,value){
 const e=active(state);if(!e||inMotion(e)||!has(e.variable==='height'?heights:surfaces,value))return false;
 e.setting=value;return true;
}
export function setWorkshopPrediction(state,value){
 const e=active(state);if(!e||value!==null&&!predictions.has(value))return false;
 e.prediction=value;
 if(e.trials.length)e.predictionAfterResults=true;
 return true;
}
export function releaseWorkshop(state){
 const e=active(state);if(!e||inMotion(e))return null;
 const c=configuration(e.variable==='height'?`${e.setting}-${e.fixed}`:`${e.fixed}-${e.setting}`);
 const n=e.counts[c.id];if(n>=Number.MAX_SAFE_INTEGER)return null;
 e.counts[c.id]=n+1;e.finished=false;
 e.pending={configurationId:c.id,height:c.height,surface:c.surface,distance:c.distances[n%3],revision:MODEL_REVISION,trialNumber:n+1,phase:0,committed:false};
 return e.pending;
}
export function stepWorkshop(state){
 const e=active(state),p=e?.pending;if(!p||p.phase===2)return null;
 p.phase++;
 if(p.phase===2&&!p.committed){
  const {phase,committed,...trial}=p;e.trials.push(trial);e.trials=e.trials.slice(-24);p.committed=true;
 }
 return p;
}
export function replayWorkshop(state){
 const e=active(state),p=e?.pending;if(!p||p.phase!==2)return null;
 p.phase=0;return p;
}
export function finishWorkshop(state){
 const e=active(state);if(!e||inMotion(e))return false;e.finished=true;return true;
}
export function setWorkshopSupport(state,key){
 const e=active(state);if(!e||!['explanation','audioRequested'].includes(key))return false;
 e.support[key]=true;return true;
}
export function setWorkshopReading(state,value){
 const e=active(state);if(!e||!readings.has(value))return false;e.reading=value;return true;
}
