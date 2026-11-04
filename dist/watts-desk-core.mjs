import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(o,k)=>Object.hasOwn(o,k);
const object=o=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&[Object.prototype,null].includes(Object.getPrototypeOf(o));
const owns=(o,keys)=>object(o)&&keys.every(k=>own(o,k));
const dense=a=>Array.isArray(a)&&Reflect.ownKeys(a).length===a.length+1&&Array.from(a).every((_,i)=>own(a,i));
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const text=(s,max)=>typeof s==='string'&&s.trim().length>0&&s.length<=max;
const id=s=>text(s,80)&&/^[\x21-\x7e]+$/.test(s)&&!['__proto__','constructor','prototype','toString','valueOf'].includes(s);
const copy=structuredClone;
const sheetNumber=s=>typeof s==='string'&&/^power-sheet-[1-9]\d{0,5}$/.test(s)?Number(s.slice(12)):null;
export function wattsSource(){return {
 v:1,model:'watts-desk-v1',title:'The Watts Desk',
 origin:'These are invented constant-power winches, not instructions for real machines. Energy comes from an outside source and goes into the gravitational store of the load and Earth.',
 limit:'We ignore losses. The source loses exactly the energy the load gains. We are counting energy delivered to the load, not a real motor’s electricity use. No load weight or height is being calculated here. Our model seconds move when you press a button. They do not measure how fast you tap.',
 machines:[{id:'reed',label:'Reed',watts:20},{id:'willow',label:'Willow',watts:40},{id:'oak',label:'Oak',watts:60}],
 maxSeconds:60,stepSeconds:5,axisMax:3600,targets:[600,1200],
 teaching:[
 'Reed transfers 20 joules each second. Over 5 seconds it transfers 100 joules: 20 watts × 5 seconds = 100 joules.',
 'Willow transfers 40 joules each second. Over the same 5 seconds it transfers 200 joules. Equal time; different energy amounts.',
 'Let Reed run 10 seconds instead. It now transfers 200 joules too. Equal energy can take different times.'
 ],glossary:[{term:'Energy',meaning:'An amount that can be stored and transferred. We count it in joules here.'},{term:'Power',meaning:'How quickly energy is transferred. One watt means one joule each second.'},{term:'Ideal model',meaning:'A deliberately simplified number model. Here we leave out losses, start-up changes and real machine limits.'}]
};}
export function validWattsSource(s){
 if(!owns(s,['v','model','title','origin','limit','machines','maxSeconds','stepSeconds','axisMax','targets','teaching','glossary'])||s.v!==1||s.model!=='watts-desk-v1'||!text(s.title,160)||!text(s.origin,1000)||!text(s.limit,1000))return false;
 if(!integer(s.maxSeconds,5,120)||!integer(s.stepSeconds,1,20)||s.maxSeconds%s.stepSeconds!==0||!integer(s.axisMax,1,14400))return false;
 if(!dense(s.machines)||!integer(s.machines.length,2,4)||new Set(s.machines.map(m=>m?.id)).size!==s.machines.length||!s.machines.every(m=>owns(m,['id','label','watts'])&&id(m.id)&&text(m.label,160)&&integer(m.watts,13,120)&&m.watts*s.maxSeconds<=s.axisMax))return false;
 return dense(s.targets)&&integer(s.targets.length,1,4)&&new Set(s.targets).size===s.targets.length&&s.targets.every(t=>integer(t,1,s.axisMax)&&s.machines.every(m=>t%(m.watts*s.stepSeconds)===0&&t/m.watts<=s.maxSeconds))
  &&dense(s.teaching)&&integer(s.teaching.length,1,5)&&s.teaching.every(t=>text(t,1000))
  &&dense(s.glossary)&&integer(s.glossary.length,1,6)&&s.glossary.every(g=>owns(g,['term','meaning'])&&text(g.term,80)&&text(g.meaning,1000));
}
export function freshWattsWork(source=wattsSource()){
 if(!validWattsSource(source))return null;
 const zeros=()=>source.machines.map(m=>({machineId:m.id,seconds:0}));
 return {v:1,mode:'durations',target:source.targets.at(-1),durations:zeros(),jobDurations:zeros(),workedShown:false,exampleSeen:0,finishedShown:false};
}
export function validWattsWork(source,w){
 if(!validWattsSource(source)||!owns(w,['v','mode','target','durations','jobDurations','workedShown','exampleSeen','finishedShown'])||w.v!==1||!['durations','job'].includes(w.mode)||!source.targets.includes(w.target)||!['workedShown','finishedShown'].every(k=>typeof w[k]==='boolean')||!integer(w.exampleSeen,0,source.teaching.length))return false;
 return ['durations','jobDurations'].every(key=>dense(w[key])&&w[key].length===source.machines.length&&new Set(w[key].map(d=>d?.machineId)).size===source.machines.length&&w[key].every(d=>{
  if(!owns(d,['machineId','seconds']))return false;const machine=source.machines.find(m=>m.id===d.machineId);
  return !!machine&&integer(d.seconds,0,source.maxSeconds)&&d.seconds%source.stepSeconds===0&&(key==='durations'||d.seconds*machine.watts<=w.target);
 }));
}
export function changeWattsWork(source,work,action,value){
 if(!validWattsWork(source,work))return null;
 const w=copy(work);
 if(action==='mode'){if(!['durations','job'].includes(value))return null;w.mode=value;}
 else if(action==='target'){
  if(!source.targets.includes(value))return null;
  if(w.target!==value){w.target=value;w.jobDurations=w.jobDurations.map(d=>({...d,seconds:0}));w.finishedShown=false;}
 }else if(action==='time'){
  if(!owns(value,['id','delta'])||![-source.stepSeconds,source.stepSeconds].includes(value.delta))return null;
  const list=w.mode==='job'?w.jobDurations:w.durations,d=list.find(d=>d.machineId===value.id);if(!d)return null;d.seconds+=value.delta;
 }else if(action==='worked'){if(value!==undefined)return null;w.workedShown=!w.workedShown;}
 else if(action==='example'){if(value!==undefined||w.exampleSeen>=source.teaching.length)return null;w.exampleSeen++;}
 else if(action==='finished'){if(value!==undefined)return null;w.finishedShown=true;}
 else if(action==='restart'){if(value!==undefined)return null;const key=w.mode==='job'?'jobDurations':'durations';w[key]=w[key].map(d=>({...d,seconds:0}));if(w.mode==='job')w.finishedShown=false;}
 else return null;
 return validWattsWork(source,w)?w:null;
}
export function wattsResults(source,work,finished=false){
 if(!validWattsWork(source,work)||typeof finished!=='boolean')return null;
 const list=work.mode==='job'?work.jobDurations:work.durations;
 return source.machines.map(m=>{const seconds=finished?work.target/m.watts:list.find(d=>d.machineId===m.id).seconds;return {id:m.id,label:m.label,watts:m.watts,seconds,joules:m.watts*seconds};});
}
function nextId(raw){if(!dense(raw)||raw.length>=12)return null;let max=0;for(const item of raw){const n=object(item)&&own(item,'id')?sheetNumber(item.id):null;if(n!==null)max=Math.max(max,n);}return max<999999?`power-sheet-${max+1}`:null;}
export function powerNotesView(state){
 if(!object(state))return {status:'unavailable',items:[],canKeep:false};
 if(!own(state,'powerNotes'))return {status:'absent',items:[],canKeep:true};
 const raw=state.powerNotes;
 if(!dense(raw))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();for(const r of raw)if(object(r)&&own(r,'id')&&sheetNumber(r.id)!==null)counts.set(r.id,(counts.get(r.id)||0)+1);
 const items=raw.map((r,index)=>{const id=object(r)&&own(r,'id')&&sheetNumber(r.id)!==null?r.id:null;return {raw:r,index,id,readable:!!id&&counts.get(id)===1&&owns(r,['source','work'])&&validWattsWork(r.source,r.work)};});
 return {status:'ready',items,canKeep:nextId(raw)!==null};
}
export function keepPowerSheet(state,source,work,options={}){
 if(!object(state)||typeof options?.canExport!=='function'||!validWattsWork(source,work))return false;
 try{
  const view=powerNotesView(state);if(!view.canKeep)return false;
  const raw=view.status==='absent'?[]:state.powerNotes,id=nextId(raw),proposal=copy([...raw,{id,source,work}]),candidate=copy(state);candidate.powerNotes=copy(proposal);
  if(!recoveryFitsProgressLimits(candidate)||options.canExport(candidate)!==true)return false;
  state.powerNotes=proposal;return id;
 }catch{return false;}
}
export function lastPowerSheet(state){return powerNotesView(state).items.filter(i=>i.readable).at(-1)||null;}
