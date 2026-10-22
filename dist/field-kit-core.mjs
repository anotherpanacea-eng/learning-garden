import {fieldMission,FIELD_OUTCOMES} from './field-kit-content.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const safeId=n=>Number.isSafeInteger(n)&&n>0;
const printable=(x,max)=>typeof x==='string'&&x.length>0&&x.length<=max&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&x.trim().length>0;
const ownKeys=(x,required,optional=[])=>object(x)&&required.every(k=>Object.hasOwn(x,k))&&Object.keys(x).every(k=>required.includes(k)||optional.includes(k));
const copy=x=>structuredClone(x);
const supports=['read-together','narration'];
const validSupport=x=>Array.isArray(x)&&x.length<=2&&x.every(s=>supports.includes(s))&&new Set(x).size===x.length;

export function fieldEntryValid(x){
 return ownKeys(x,['id','mission','outcome','response','support'])&&safeId(x.id)&&
  ownKeys(x.mission,['id','version','title'])&&printable(x.mission.id,80)&&safeId(x.mission.version)&&printable(x.mission.title,160)&&
  typeof x.outcome==='string'&&Object.hasOwn(FIELD_OUTCOMES,x.outcome)&&printable(x.response,600)&&validSupport(x.support);
}
const validRoot=x=>ownKeys(x,['version','entries'],['recovered'])&&x.version===1&&Array.isArray(x.entries);

function analyze(root){
 const valid=[],raw=[],seen=new Set();let maxId=0;
 root.entries.forEach((entry,index)=>{
  if(safeId(entry?.id))maxId=Math.max(maxId,entry.id);
  if(!fieldEntryValid(entry)){raw.push({index,entry,reason:'unreadable'});return;}
  if(seen.has(entry.id)){raw.push({index,entry,reason:'duplicate'});return;}
  seen.add(entry.id);valid.push({index,entry});
 });
 // Imported histories can exceed this feature's display cap. Preserve older
 // entries verbatim in earlier records rather than trimming on import.
 const cutoff=Math.max(0,valid.length-24);
 for(const item of valid.slice(0,cutoff))raw.push({...item,reason:'older-than-limit'});
 raw.sort((a,b)=>a.index-b.index);
 return {entries:valid.slice(cutoff),rawEntries:raw,maxId};
}

export function fieldKitView(state){
 if(!Object.hasOwn(state,'fieldKit'))return {absent:true,unsupported:false,entries:[],rawEntries:[],maxId:0,recovered:null};
 const root=state.fieldKit;
 if(!validRoot(root))return {absent:false,unsupported:true,rawRoot:root,entries:[],rawEntries:[],maxId:0,recovered:null};
 return {absent:false,unsupported:false,...analyze(root),recovered:Object.hasOwn(root,'recovered')?root.recovered:null};
}

export function recordFieldOutcome(state,missionId,outcome,support=[]){
 const mission=fieldMission(missionId),view=fieldKitView(state);
 if(!mission||typeof outcome!=='string'||!Object.hasOwn(FIELD_OUTCOMES,outcome)||!validSupport(support)||view.unsupported||view.maxId===Number.MAX_SAFE_INTEGER)return false;
 const root=view.absent?{version:1,entries:[]}:state.fieldKit;
 const entry={id:view.maxId+1,mission:{id:mission.id,version:mission.version,title:mission.title},outcome,response:mission.replies[outcome],support:[...support]};
 if(!fieldEntryValid(entry))return false;
 if(view.entries.length>=24)root.entries.splice(view.entries[0].index,1);
 root.entries.push(entry);
 if(view.absent)state.fieldKit=root;
 return entry;
}

export function recoverFieldKit(state){
 const view=fieldKitView(state);
 if(view.absent||!view.unsupported)return false;
 state.fieldKit={version:1,entries:[],recovered:copy(state.fieldKit)};
 return true;
}
