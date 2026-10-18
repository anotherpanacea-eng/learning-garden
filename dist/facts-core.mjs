// Ordered multiplication practice. This extension never rewrites baseline or other observations.
const LIMIT=576,MAX_VISIT=1000000000;
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const integer=(x,lo,hi)=>Number.isSafeInteger(x)&&x>=lo&&x<=hi;
export const orderedKey=(a,b)=>`${a}x${b}`;
export const allFacts=Array.from({length:144},(_,i)=>[1+Math.floor(i/12),1+i%12]);
const methods=['recalled','worked','counting','together'];
const dayNow=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const day=value=>{if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;const d=new Date(value+'T12:00:00');return !Number.isNaN(d.getTime())&&`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`===value?value:null;};
const pair=p=>Array.isArray(p)&&p.length===2&&p.every(n=>integer(n,1,12));
const keyValid=k=>typeof k==='string'&&pair(k.split('x').map(Number))&&k===orderedKey(...k.split('x').map(Number));
const visitNumber=id=>typeof id==='string'&&/^facts-[1-9]\d{0,9}$/.test(id)&&Number(id.slice(6))<=MAX_VISIT?Number(id.slice(6)):0;
export function splitFact(a,b){
 if(a===1)return [[1,b]];
 const first=a>10?10:a>5?5:a>2?2:1;
 return [[first,b],[a-first,b]];
}
export function factPairsShown(state){
 const x=state.facts?.current,d=x?.drafts?.[x.index];if(!d?.opened)return [];
 const pairs=[[d.a,d.b],...(d.model||d.revealed?splitFact(d.a,d.b):[])],seen=new Set();
 return pairs.filter(p=>{const k=orderedKey(...p);if(seen.has(k))return false;seen.add(k);return true;});
}
function attempts(values){
 return Array.isArray(values)?values.filter(a=>object(a)&&integer(a.value,0,999)).slice(-30).map(a=>({value:a.value,day:day(a.day),supported:a.supported===true||a.model===true||a.revealed===true||a.method==='together',model:a.model===true,revealed:a.revealed===true,method:methods.includes(a.method)?a.method:null})):[];
}
function draft(raw,a,b){
 const d=object(raw)?raw:{};
 const tries=attempts(d.attempts).map(t=>({...t,correct:t.value===a*b,method:t.value===a*b?t.method:null}));
 const model=d.model===true,revealed=d.revealed===true,steps=integer(d.steps,0,a)?d.steps:0;
 const method=tries.at(-1)?.correct&&methods.includes(d.method)?d.method:null;
 return {a,b,opened:d.opened===true,input:typeof d.input==='string'?d.input.slice(0,3):'',attempts:tries,method,
  model,revealed,steps,modelMode:d.modelMode==='groups'?'groups':'array',supported:d.supported===true||model||revealed||steps>0||method==='together'||tries.some(t=>t.supported),
  ownPrior:d.ownPrior===true,legacyKnown:d.legacyKnown===true,priorExposureUnknown:d.priorExposureUnknown!==false,
  recorded:d.recorded===true};
}
function cleanRecord(raw){
 if(!object(raw)||!integer(raw.a,1,12)||!integer(raw.b,1,12)||!visitNumber(raw.visitId)||!integer(raw.item,0,5)||!['recorded','skipped','changed'].includes(raw.status))return null;
 const d=draft({...raw,opened:true},raw.a,raw.b);
 return observation(d,raw.visitId,raw.item,raw.status,day(raw.day));
}
export function ensureFacts(state){
 const old=object(state.facts)&&state.facts.version===1?state.facts:{};
 const seen=Array.isArray(old.seen)?[...new Set(old.seen.filter(keyValid))]:[];
 const observations=Array.isArray(old.observations)?old.observations.map(cleanRecord).filter(Boolean).slice(-LIMIT):[];
 const ids=new Map();for(const r of observations){const prior=ids.get(r.id);if(!prior){ids.set(r.id,r);continue;}prior.model=prior.model||r.model;prior.revealed=prior.revealed||r.revealed;prior.supported=prior.supported||r.supported;prior.method=null;prior.reportedRecall=false;prior.priorExposureUnknown=true;}const records=[...ids.values()];
 for(const r of records)if(!seen.includes(orderedKey(r.a,r.b)))seen.push(orderedKey(r.a,r.b));
 let current=null;const x=old.current;
 if(object(x)&&visitNumber(x.id)&&Array.isArray(x.pairs)&&[1,6].includes(x.pairs.length)&&x.pairs.every(pair)){
  const unique=new Set(x.pairs.map(p=>orderedKey(...p)));
  if(unique.size===x.pairs.length){
   const index=integer(x.index,0,x.pairs.length-1)?x.index:0;
   const drafts=x.pairs.map(([a,b],i)=>draft(Array.isArray(x.drafts)?x.drafts[i]:null,a,b));
   current={id:x.id,mode:x.pairs.length===6?'mixed':'single',pairs:x.pairs.map(p=>[...p]),index,day:day(x.day),drafts,finished:x.finished===true,anySupport:x.anySupport===true||drafts.some(d=>d.supported)};
   // An opened saved item remains encountered; malformed missing drafts are not called fresh.
   for(const d of drafts)if(d.opened&&!seen.includes(orderedKey(d.a,d.b)))seen.push(orderedKey(d.a,d.b));
   for(let i=0;i<drafts.length;i++)if(records.some(r=>r.id===`${x.id}:${i}`))drafts[i].recorded=true;
   if(current.finished)drafts.forEach(d=>{if(d.opened)d.recorded=true;});
  }
 }
 const maximum=Math.max(0,...records.map(r=>visitNumber(r.visitId)),current?visitNumber(current.id):0);
 const result=old;result.version=1;result.seen=seen;result.observations=records;result.current=current;
 result.nextVisit=integer(old.nextVisit,0,MAX_VISIT)?Math.max(old.nextVisit,maximum):maximum;
 result.cursor=integer(old.cursor,0,143)?old.cursor:0;result.row=integer(old.row,1,12)?old.row:1;
 state.facts=result;return result;
}
export function currentFact(state){const f=state.facts,x=f?.current;return x?.drafts?.[x.index]||null;}
function outsideEncounter(state,a,b){
 const k=[a,b].sort((x,y)=>x-y).join('x'),broad=state.broad;
 const canonical=list=>Array.isArray(list)&&list.some(value=>typeof value==='string'&&/^\d+x\d+$/.test(value)&&value.split('x').map(Number).sort((x,y)=>x-y).join('x')===k);
 return {legacyKnown:canonical(state.exposures)||canonical(broad?.seenFacts),priorExposureUnknown:broad?.legacyExposureUnknown===true||!Array.isArray(state.exposures)&&!Array.isArray(broad?.seenFacts)};
}
function encounter(f,pairs){for(const p of pairs){const k=orderedKey(...p);if(!f.seen.includes(k))f.seen.push(k);}}
function openCurrent(state){
 const f=state.facts,x=f.current,d=currentFact(state);if(!d||d.opened)return;
 d.opened=true;d.ownPrior=f.seen.includes(orderedKey(d.a,d.b));Object.assign(d,outsideEncounter(state,d.a,d.b));encounter(f,[[d.a,d.b]]);
}
function observation(d,visitId,item,status,recordDay){
 const correct=d.attempts.length?d.attempts.at(-1).value===d.a*d.b:null;
 const firstCorrect=d.attempts.length===1&&d.attempts[0].value===d.a*d.b;
 const supported=d.supported||d.model||d.revealed||d.method==='together'||d.attempts.some(t=>t.supported);
 return {id:`${visitId}:${item}`,visitId,item,a:d.a,b:d.b,day:recordDay,status,
  attempts:d.attempts.map(t=>({...t,correct:t.value===d.a*d.b})),method:d.method,model:d.model,revealed:d.revealed,supported,
  correct,firstCorrect,reportedRecall:status==='recorded'&&correct===true&&firstCorrect&&d.method==='recalled'&&!supported,
  ownPrior:d.ownPrior,legacyKnown:d.legacyKnown,priorExposureUnknown:d.priorExposureUnknown};
}
export function finishFact(state,status='recorded'){
 const f=ensureFacts(state),x=f.current,d=currentFact(state);if(!x||!d?.opened||d.recorded||x.finished||!['recorded','skipped','changed'].includes(status))return false;
 const r=observation(d,x.id,x.index,status,d.attempts.at(-1)?.day||x.day||dayNow());
 f.observations.push(r);f.observations=f.observations.slice(-LIMIT);d.recorded=true;
 x.anySupport=x.anySupport||d.supported;if(x.index===x.pairs.length-1||status==='changed')x.finished=true;return true;
}
function start(state,pairs,mode,when){
 const f=ensureFacts(state);if(f.nextVisit>=MAX_VISIT)return null;
 if(f.current&&!f.current.finished)finishFact(state,'changed');
 const c=state.facts;c.current={id:`facts-${++c.nextVisit}`,mode,pairs:pairs.map(p=>[...p]),index:0,day:day(when)||dayNow(),drafts:pairs.map(([a,b])=>draft(null,a,b)),finished:false,anySupport:false};
 openCurrent(state);return c.current;
}
export function startFact(state,a,b,when=dayNow()){if(!integer(a,1,12)||!integer(b,1,12))return null;return start(state,[[a,b]],'single',when);}
export function mixedFacts(state){
 const f=state.facts,latest=new Map();for(const r of f.observations)latest.set(orderedKey(r.a,r.b),r);
 const focus=allFacts.filter(p=>{const r=latest.get(orderedKey(...p));return r&&(!r.correct||r.supported||!r.reportedRecall);});
 focus.sort((a,b)=>{
  const ia=f.observations.findLastIndex(r=>r.a===a[0]&&r.b===a[1]),ib=f.observations.findLastIndex(r=>r.a===b[0]&&r.b===b[1]);return ia-ib;
 });
 const review=allFacts.filter(p=>latest.get(orderedKey(...p))?.correct===true);
 const chosen=[],keys=new Set(),add=p=>{const k=orderedKey(...p);if(keys.has(k))return false;keys.add(k);chosen.push(p);return true;};
 focus.slice(0,2).forEach(add);
 for(let i=0;i<review.length&&chosen.length<4;i++)add(review[(f.cursor+i)%review.length]);
 let consumed=0;while(chosen.length<6&&consumed<144){add(allFacts[((f.cursor+consumed)%144)*37%144]);consumed++;}
 return {pairs:chosen,cursor:(f.cursor+consumed)%144};
}
export function startFactsMix(state,when=dayNow()){
 ensureFacts(state);const selected=mixedFacts(state),visit=start(state,selected.pairs,'mixed',when);if(visit)state.facts.cursor=selected.cursor;return visit;
}
export function advanceFacts(state){
 const f=ensureFacts(state),x=f.current,d=currentFact(state);if(!x||x.finished||!d?.recorded||x.index>=x.pairs.length-1)return false;
 x.index++;openCurrent(state);return true;
}
export function submitFact(state,value,when=dayNow()){
 ensureFacts(state);const x=state.facts.current,d=currentFact(state);if(!x||x.finished||!d?.opened||d.recorded||!integer(value,0,999)||d.attempts.at(-1)?.correct)return false;
 d.attempts.push({value,correct:value===d.a*d.b,day:day(when)||dayNow(),model:d.model,revealed:d.revealed,supported:d.supported,method:null});d.attempts=d.attempts.slice(-30);d.method=null;return true;
}
export function setFactMethod(state,value){
 ensureFacts(state);const d=currentFact(state);if(!d||d.recorded||!d.attempts.at(-1)?.correct||value!==null&&!methods.includes(value))return false;
 d.method=value;d.attempts.at(-1).method=value;if(value==='together'){d.supported=true;d.attempts.at(-1).supported=true;state.facts.current.anySupport=true;}return true;
}
export function showFactModel(state,mode='array'){
 ensureFacts(state);const x=state.facts.current,d=currentFact(state);if(!x||x.finished||!d?.opened||d.recorded||!['array','groups'].includes(mode))return false;
 d.model=true;d.modelMode=mode;d.supported=true;x.anySupport=true;encounter(state.facts,[[d.a,d.b],...splitFact(d.a,d.b)]);return true;
}
export function revealFact(state){
 ensureFacts(state);const x=state.facts.current,d=currentFact(state);if(!x||x.finished||!d?.opened||d.recorded)return false;
 d.revealed=true;d.supported=true;x.anySupport=true;encounter(state.facts,[[d.a,d.b],...splitFact(d.a,d.b)]);return true;
}
export function stepFactModel(state,change){
 ensureFacts(state);const d=currentFact(state);if(!d?.model||d.recorded||![-1,1,'reset'].includes(change))return false;
 const next=change==='reset'?0:d.steps+change;if(!integer(next,0,d.a))return false;d.steps=next;d.supported=true;return true;
}
export function setFactsRow(state,row){const f=ensureFacts(state);if(!integer(row,1,12))return false;f.row=row;return true;}
export function factsSummary(state){
 const f=state.facts;if(!f)return [];
 return allFacts.map(([a,b])=>{const records=f.observations.filter(r=>r.a===a&&r.b===b),latest=records.at(-1)||null;
  return {a,b,key:orderedKey(a,b),seen:f.seen.includes(orderedKey(a,b)),latest,days:[...new Set(records.map(r=>r.day).filter(Boolean))].sort(),records};});
}
export const factsRecordLimit=LIMIT;
