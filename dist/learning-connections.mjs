import {ingredients,guests,wishes} from './cafe-content.mjs';
import {ensureCafe,nextGuest,orderFor} from './cafe-core.mjs';
import {spiralState,spiralClosed} from './living-spiral-core.mjs';
import {startAdaptiveSpiral} from './living-adaptive-core.mjs';
import {validPostVisit} from './post-office-core.mjs';
import {validBrambleNotebook,validPostRival,startAdaptiveRival} from './post-rival.mjs';
import {connectionFrom,validConnection,connectionSources} from './learning-connection-data.mjs';
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const knownConnection=(x,a,b)=>!Object.hasOwn(x,'connection')||validConnection(x.connection,a,b);
const params=p=>object(p)&&positivePair(p.guests,p.bites)&&guests.some(g=>g.id===p.guestId)&&Array.isArray(p.wanted)&&p.wanted.length===2&&wishes.some(w=>w.every(x=>p.wanted.includes(x)));
const totalDraft=d=>object(d)&&typeof d.input==='string'&&Array.isArray(d.attempts)&&d.attempts.every(n=>integer(n,0,999))&&['supported','skipped','revealed'].every(k=>typeof d[k]==='boolean')&&integer(d.steps,0,144);
const cafeOrder=r=>object(r)&&integer(r.orderIndex,0,999999999)&&params(r.params)&&object(r.recipe)&&ingredients.every(a=>integer(r.recipe[a.id],0,12))&&totalDraft(r.total)&&totalDraft(r.shortfall);
const positivePair=(a,b)=>integer(a,1,12)&&integer(b,1,12);
const same=(a,b)=>a===b||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k]))||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]));
function knownCafe(c){
 if(!object(c)||c.version!==1||!integer(c.seed,1,2147483646)||!Array.isArray(c.history)||c.history.length>24)return false;
 // Existing normalization is a read-only probe on a copy: never discard raw work to issue a connection.
 const trial={cafe:structuredClone(c)};ensureCafe(trial);return same(c,trial.cafe);
}
export const connectionNames={living:'Living Garden',cafe:'the café',bramble:'Bramble’s ribbon gate'};
function gardenSource(state){
 const s=spiralState(state);if(!s)return null;
 const rounds=[...s.history,...(s.current&&spiralClosed(s.current)?[s.current]:[])];
 for(const r of rounds.slice().reverse())if(r.revision==='habitat-round-2'&&(r.math.count||r.math.help)&&r.found){
  const t=r.task,m=r.math,d=t.teaching.depths.math,first=m.first,supported=!!first&&(first.afterHelp||first.afterAudio||first.afterVocabulary||first.afterTogether)||m.method==='together',outcome=m.count>1||first&&!first.correct?'retry':!first?'explored':supported?'supported':'first-match';
  return connectionFrom('living',r.id,d===1?'direct':d===2?'inverse':'tomorrow',d===3?t.packs-1:t.packs,t.bites,outcome,t.teaching.familiar.math?'familiar':'new');
 }
 return null;
}
function cafeSource(state){
 const c=state.cafe;if(!knownCafe(c))return null;
 for(const r of c.history.slice().reverse()){
  const p=r?.params,d=r?.total;if(!cafeOrder(r)||!['served','skipped'].includes(r?.status)||!integer(r.orderIndex,0,999999999)||!positivePair(p?.guests,p?.bites)||!knownConnection(r,p.guests,p.bites)||!object(d)||!Array.isArray(d.attempts)||!d.attempts.length||d.attempts.length>50||!d.attempts.every(n=>integer(n,0,999))||!['supported','skipped','revealed'].every(k=>typeof d[k]==='boolean')||!integer(d.steps,0,144))continue;
  const outcome=d.attempts.length>1||d.attempts[0]!==p.guests*p.bites?'retry':d.supported||d.skipped||d.revealed||d.steps>0?'supported':'first-match';
  return connectionFrom('cafe',r.orderIndex,'direct',p.guests,p.bites,outcome,Object.hasOwn(r,'connection')?'familiar':'unknown');
 }
 return null;
}
function brambleSource(state){
 const p=state.postOffice;if(p?.version!==1||!validBrambleNotebook(p)||!p.bramble)return null;
 // Append/finish order, not allocation ID: two waiting deliveries may finish out of order.
 for(const r of p.bramble.history.slice().reverse())if(r.task.kind==='multiply'&&(r.attempts.length||r.resolution==='together')){
  const outcome=r.attempts.length>1||r.attempts.some(a=>!a.correct)?'retry':!r.attempts.length?'explored':r.supported||r.audioRequested||r.attempts[0].afterSupport||r.method==='together'?'supported':'first-match';
  return connectionFrom('bramble',r.id,'direct',r.task.a,r.task.b,outcome,Object.hasOwn(r,'connection')?'familiar':'unknown');
 }
 return null;
}
export function learningSource(state,source){return source==='living'?gardenSource(state):source==='cafe'?cafeSource(state):source==='bramble'?brambleSource(state):null;}
export function connectionPairsShown(state,target){return connectionOffers(state,target).map(c=>[c.a,c.b]);}
export function connectionOffers(state,target){return connectionSources.filter(k=>k!==target).map(k=>learningSource(state,k)).filter(Boolean);}
export function connectionAvailability(state,target){
 if(target==='living'){const exists=Object.hasOwn(state,'livingExploration'),s=spiralState(state);if(exists&&!s)return 'An earlier garden search could not be opened. Grown-ups can find it in the notes.';if(s?.current&&!spiralClosed(s.current))return 'Our waiting garden search comes first. Finish it or leave its parcel, then bring this idea.';return '';}
 if(target==='cafe'){
  const c=state.cafe;if(!knownCafe(c)||!integer(c.seed,1,2147483646)||!integer(c.nextOrder,0,999999999)||!Array.isArray(c.history)||!object(c.stock)||c.current!==null&&(!cafeOrder(c.current)||!['plate','total','stock','served'].includes(c.current.stage)||typeof c.current.served!=='boolean')||!ingredients.every(a=>integer(c.stock[a.id],0,180))||[...c.history,...(c.current?[c.current]:[])].some(r=>!object(r)||!knownConnection(r,r.params?.guests,r.params?.bites)))return 'An earlier café order could not be opened. Grown-ups can find it in the notes.';
  if(c.current&&c.current.stage!=='served')return 'Our guest and plate are waiting. Finish this order, then invite the connected table.';return '';
 }
 if(target==='bramble'){
  const p=state.postOffice;if(p?.version!==1||!validBrambleNotebook(p))return 'Choose a delivery at Willow Post Office first.';const v=p.visits.find(v=>v?.id===p.current);if(!object(v)||v.closed||!validPostVisit(v))return 'Choose a delivery at Willow Post Office first.';
  if(Object.hasOwn(v,'rival')&&(!validPostRival(v.rival)||!['resolved','continued','bypassed'].includes(v.rival.phase)))return 'Bramble’s puzzle is waiting at the Post Office. Finish it there, or choose “Take the quiet route.”';return '';
 }
 return 'Choose a connected destination.';
}
export function startConnection(state,target,source){
 if(!connectionSources.includes(target)||!connectionSources.includes(source)||source===target||connectionAvailability(state,target))return false;
 const c=learningSource(state,source);if(!c)return false;
 // Existing starters may normalize a destination; failures must leave the real roots exact.
 const trial=structuredClone(state);let success=false,key;
 if(target==='living'){key='livingExploration';success=startAdaptiveSpiral(trial,c);}
 else if(target==='bramble'){key='postOffice';success=startAdaptiveRival(trial,false,c)&&validBrambleNotebook(trial.postOffice);}
 else{key='cafe';const cursor=trial.cafe.allIndex;success=nextGuest(trial);if(success)trial.cafe.allIndex=cursor;if(success){const x=trial.cafe.current;x.params.guests=c.a;x.params.bites=c.b;x.connection=structuredClone(c);success=orderFor(trial.cafe).guests===c.a&&orderFor(trial.cafe).bites===c.b;}}
 if(!success)return false;state[key]=trial[key];return true;
}
export function activeConnection(state,target){
 if(target==='living'){const r=spiralState(state)?.current,c=r?.task?.connection;return validConnection(c,r?.task?.packs,r?.task?.bites)?c:null;}
 if(target==='cafe'){const r=state.cafe?.current,c=r?.connection;return validConnection(c,r?.params?.guests,r?.params?.bites)?c:null;}
 if(target==='bramble'){const p=state.postOffice,r=Array.isArray(p?.visits)?p.visits.find(v=>v?.id===p.current)?.rival:null;return validPostRival(r)&&validConnection(r.connection,r.task.a,r.task.b)?r.connection:null;}return null;
}
export function connectionRecords(state){
 const s=spiralState(state),p=state.postOffice,c=state.cafe,records=[];
 if(s)for(const r of [...s.history,...(s.current?[s.current]:[])])if(r.task?.connection)records.push({target:'living',id:r.id,c:r.task.connection});
 if(Array.isArray(c?.history))for(const r of c.history)if(Object.hasOwn(r,'connection'))records.push({target:'cafe',id:r.orderIndex,c:r.connection});
 if(c?.current&&Object.hasOwn(c.current,'connection')&&!records.some(r=>r.target==='cafe'&&r.id===c.current.orderIndex))records.push({target:'cafe',id:c.current.orderIndex,c:c.current.connection});
 if(p?.version===1&&validBrambleNotebook(p)){const rounds=[...(p.bramble?.history||[])];for(const v of p.visits)if(v?.rival&&!rounds.some(r=>r.id===v.rival.id))rounds.push(v.rival);for(const r of rounds)if(Object.hasOwn(r,'connection'))records.push({target:'bramble',id:r.id,c:r.connection});}
 return records;
}
