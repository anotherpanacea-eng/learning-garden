import {missions} from './science-content.mjs';
export const missionById=id=>missions.find(m=>m.id===id);
const stages=['wonder','explore','notice','explain','ending'];
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const index=(x,n)=>Number.isInteger(x)&&x>=0&&x<n;
const readingModes=['unobserved','together','independent'];
const visitNumber=id=>typeof id==='string'&&/^visit-[1-9]\d{0,8}$/.test(id)?Number(id.slice(6)):null;
function retain(s){
 if(s.visits.length<=24)return;
 const current=s.visits.find(v=>v.id===s.current),recent=s.visits.slice(-24);
 if(current&&!recent.includes(current)){recent.shift();recent.unshift(current);}
 s.visits=recent;
}
export function ensureScience(state){
 const s=object(state.science)&&state.science.version===1?state.science:{version:1,current:null,visits:[]};
 if(!Array.isArray(s.visits))s.visits=[];
 const ids=new Set();s.visits=s.visits.filter(v=>{
  if(!object(v)||!visitNumber(v.id)||ids.has(v.id)||!missionById(v.missionId))return false;
  ids.add(v.id);const m=missionById(v.missionId);
  v.completed=v.completed===true||v.stage==='ending';
  if(!stages.includes(v.stage))v.stage=v.completed?'ending':'wonder';
  v.explanationOpened=v.explanationOpened===true||v.predictionAfterTeaching===true||v.completed||v.stage==='explain';
  v.prediction=index(v.prediction,m.predictions.length)?v.prediction:null;
  v.predictionAfterTeaching=v.predictionAfterTeaching===true;
  v.observations=Array.isArray(v.observations)?[...new Set(v.observations.filter(i=>index(i,m.observations.length)))]:[];
  v.reading=readingModes.includes(v.reading)?v.reading:'unobserved';
  v.externalLinkOpened=v.externalLinkOpened===true;v.stayedLocal=v.stayedLocal===true;
  v.frame=index(v.frame,m.frames.length)?v.frame:0;
  return true;
 });
 if(!s.visits.some(v=>v.id===s.current))s.current=null;
 retain(s);state.science=s;return s;
}
export function currentScience(state){
 const s=ensureScience(state);return s.visits.find(v=>v.id===s.current)||null;
}
export function startScience(state,missionId){
 const s=ensureScience(state);if(!missionById(missionId))return null;
 const number=Math.max(0,...s.visits.map(v=>visitNumber(v.id)))+1;if(number>999999999)return null;
 const v={id:`visit-${number}`,missionId,stage:'wonder',prediction:null,predictionAfterTeaching:false,observations:[],reading:'unobserved',externalLinkOpened:false,stayedLocal:false,explanationOpened:false,frame:0,completed:false};
 s.visits.push(v);s.current=v.id;retain(s);return v;
}
export function resumeScience(state,id){const s=ensureScience(state);if(!s.visits.some(v=>v.id===id))return false;s.current=id;return true;}
export function setPrediction(state,value){
 const v=currentScience(state);if(!v||v.stage!=='wonder'||value!==null&&!index(value,missionById(v.missionId).predictions.length))return false;
 v.prediction=value;if(v.explanationOpened)v.predictionAfterTeaching=true;return true;
}
export function toggleObservation(state,value){
 const v=currentScience(state);if(!v||v.stage!=='notice'||!index(value,missionById(v.missionId).observations.length))return false;
 v.observations=v.observations.includes(value)?v.observations.filter(i=>i!==value):[...v.observations,value];return true;
}
export function setScienceReading(state,value){const v=currentScience(state);if(!v||!readingModes.includes(value))return false;v.reading=value;return true;}
export function advanceScience(state){
 const v=currentScience(state);if(!v||v.stage==='ending')return false;
 v.stage=stages[stages.indexOf(v.stage)+1];
 if(v.stage==='explain')v.explanationOpened=true;
 if(v.stage==='ending')v.completed=true;return true;
}
export function scienceBack(state){
 const v=currentScience(state);if(!v||v.stage==='wonder')return false;
 v.stage=stages[stages.indexOf(v.stage)-1];return true;
}
export function scienceFrame(state,action){
 const v=currentScience(state);if(!v||v.stage!=='explain'||![-1,1,'reset'].includes(action))return false;
 const next=action==='reset'?0:v.frame+action;if(!index(next,missionById(v.missionId).frames.length))return false;
 v.frame=next;v.explanationOpened=true;return true;
}
export function openScienceExplanation(state){
 const v=currentScience(state);if(!v)return false;v.stage='explain';v.explanationOpened=true;return true;
}
export function noteScienceExternal(state){const v=currentScience(state);if(!v)return false;v.externalLinkOpened=true;return true;}
export function stayScienceLocal(state){const v=currentScience(state);if(!v||v.stage!=='explore')return false;v.stayedLocal=true;return advanceScience(state);}
