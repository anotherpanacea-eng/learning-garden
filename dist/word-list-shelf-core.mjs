// Spec336: source-owned spelling clues; all participation is supported.
import {makeWordListShelfSource} from './word-list-shelf-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {stainedMapRows,validStainedJob,validStainedWork,sameStainedWork,stainedJobResult} from './stained-map-core.mjs';

const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k), clone=structuredClone;
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(x)&&!['constructor','prototype','toString','valueOf'].includes(x);
const text=x=>typeof x==='string'&&[...x].length<=4000;
const list=x=>Array.isArray(x)&&x.length<=64;
const helpSet=x=>list(x)&&x.every(id)&&new Set(x).size===x.length;
const jobHelp=x=>obj(x)&&typeof x.hint==='boolean'&&typeof x.example==='boolean';
const sourceBase=s=>{try{return obj(s)&&s.v===1&&id(s.id)&&new TextEncoder().encode(JSON.stringify(s)).length<=96*1024;}catch{return false;}};
const jobId=x=>id(x)&&!['shelf','jobs'].includes(x);
const summaryKeys=['incomplete','discussion','listedSummary','partialIncomplete','partialDiscussion','partialListed','partial','listed','discuss','unplaced'];
const copyReady=c=>obj(c)&&summaryKeys.every(k=>text(c[k]));
const value=(placements,key)=>own(placements,key)?placements[key]:null;
const readyField=(r,key,test)=>!own(r,key)?'missing':test(r[key])?'ready':'unreadable';

export function wordListShelfSource(source) {
 if(!sourceBase(source)||!copyReady(source.copy)||!list(source.trays)||!list(source.words))return null;
 const trays=stainedMapRows(source.trays,t=>text(t.label)&&text(t.description));
 let partial=trays.length!==source.trays.length;
 const words=stainedMapRows(source.words,w=>text(w.text)&&list(w.clues)).flatMap(w=>{
  // Count addresses before validating bodies, including malformed duplicates.
  const counts=new Map();
  for(const c of w.clues)if(obj(c)&&id(c.trayId))counts.set(c.trayId,(counts.get(c.trayId)||0)+1);
  const clues=w.clues.filter(c=>obj(c)&&id(c.trayId)&&counts.get(c.trayId)===1&&text(c.note)&&trays.some(t=>t.id===c.trayId));
  partial ||= clues.length!==w.clues.length;
  return clues.length?[{...w,clues,sentence:text(w.sentence)?w.sentence:null}]:[];
 });
 partial ||= words.length!==source.words.length;
 return words.length&&trays.length?{words,trays,copy:source.copy,partial}:null;
}

const shelfWork=w=>obj(w)&&obj(w.placements)&&helpSet(w.help);
const rowRecord=r=>obj(r)&&id(r.id)&&['unplaced','listed','discuss'].includes(r.outcome)&&typeof r.feedback==='string'&&[...r.feedback].length<=16000;
export const validWordListCheck=c=>obj(c)&&obj(c.placements)&&list(c.rows)&&c.rows.every(rowRecord)&&['incomplete','discussion','listed'].includes(c.status)&&['full','partial'].includes(c.coverage)&&helpSet(c.helpBefore);
export const validWordListKeep=k=>obj(k)&&obj(k.placements)&&helpSet(k.helpBefore)&&(!own(k,'check')||k.check===null||validWordListCheck(k.check));
function playable(s,placements) {
 return s.words.filter(w=>value(placements,w.id)===null||s.trays.some(t=>t.id===value(placements,w.id)));
}
export function sameWordListPlacements(s,a,b) {
 if(!s||!obj(a)||!obj(b))return false;
 // Opaque cards are excluded; current opaque data is never restored over.
 return playable(s,a).every(w=>value(a,w.id)===value(b,w.id));
}
function shelfEntry(source,record,present) {
 const status=!source?'unavailable':!present?'missing':!obj(record)?'unreadable':'ready';
 if(status!=='ready')return {status,source,record:present?record:null,playable:[],opaque:[],last:null,earlier:false};
 const draftStatus=shelfWork(record)?'ready':'unreadable';
 const checksStatus=readyField(record,'checks',cs=>Array.isArray(cs)&&cs.every(validWordListCheck));
 const last=checksStatus==='ready'?record.checks.at(-1)??null:null;
 const words=draftStatus==='ready'?playable(source,record.placements):[];
 const opaque=draftStatus==='ready'?source.words.filter(w=>!words.includes(w)):[];
 const coverage=source.partial||opaque.length?'partial':'full';
 const sameRows=!!last&&last.rows.length===words.length&&words.every(w=>last.rows.filter(row=>row.id===w.id).length===1);
 return {status,source,record,draftStatus,checksStatus,playable:words,opaque,
  firstStatus:readyField(record,'firstKept',k=>k===null||validWordListKeep(k)),
  latestStatus:readyField(record,'latestKept',k=>k===null||validWordListKeep(k)),
  last,earlier:!!last&&(!words.length||!sameRows||coverage!==last.coverage||!sameWordListPlacements(source,record.placements,last.placements)),
  partial:source.partial||opaque.length>0||checksStatus==='unreadable'};
}

export const validWordListJob=s=>validStainedJob(s)&&s.kind==='choice'&&jobId(s.id)&&obj(s.copy)&&text(s.copy.incomplete)&&text(s.copy.partDifferent);
const feedback=x=>Array.isArray(x)&&x.length<=128&&x.every(t=>typeof t==='string'&&[...t].length<=16000);
const validJobCheck=(s,c)=>obj(c)&&validStainedWork(s,c.work)&&jobHelp(c.help)&&['incomplete','different','fit'].includes(c.outcome)&&feedback(c.feedback)&&c.supported===true&&c.guided===true;
const validJobKeep=(s,k)=>obj(k)&&validStainedWork(s,k.work)&&jobHelp(k.help)&&(k.check===null||validJobCheck(s,k.check)&&sameStainedWork(k.work,k.check.work));
function jobEntry(source,record,present) {
 const status=!source?'unavailable':!present?'missing':!obj(record)?'unreadable':'ready';
 if(status!=='ready')return {status,source,record:present?record:null,last:null,earlier:false};
 const draftStatus=readyField(record,'work',w=>validStainedWork(source,w)),helpStatus=readyField(record,'help',jobHelp);
 const checksStatus=readyField(record,'checks',cs=>Array.isArray(cs)&&cs.every(c=>validJobCheck(source,c)));
 const last=checksStatus==='ready'?record.checks.at(-1)??null:null;
 return {status,source,record,draftStatus,helpStatus,checksStatus,last,
  earlier:!!last&&(draftStatus!=='ready'||!sameStainedWork(record.work,last.work)),
  firstStatus:readyField(record,'firstKept',k=>k===null||validJobKeep(source,k)),
  latestStatus:readyField(record,'latestKept',k=>k===null||validJobKeep(source,k)),partial:checksStatus==='unreadable'};
}
export function wordListShelfView(state) {
 if(!obj(state)||!own(state,'wordListShelf'))return {status:'new',root:null,source:null,view:'arrival',shelf:null,jobs:[],current:null};
 const r=state.wordListShelf;
 if(!obj(r)||r.v!==1)return {status:'unsupported',root:r,source:null,view:'arrival',shelf:null,jobs:[],current:null};
 const source=sourceBase(r.source)?r.source:null;
 const offered=source?stainedMapRows(source.jobs,validWordListJob):[];
 const keys=offered.map(j=>j.id);
 if(obj(r.jobs))for(const key of Object.keys(r.jobs))if(jobId(key)&&!keys.includes(key))keys.push(key);
 const jobs=keys.map(key=>{
  const present=obj(r.jobs)&&own(r.jobs,key),record=present?r.jobs[key]:null;
  // Existing records must bring their own source; never reconstruct one.
  const s=present?(obj(record)&&validWordListJob(record.source)&&record.source.id===key?record.source:null):offered.find(j=>j.id===key);
  const e=jobEntry(s,record,present);
  if(own(r,'jobs')&&!obj(r.jobs))e.status='unreadable';
  return {id:key,stored:present,...e};
 });
 const shelf=shelfEntry(wordListShelfSource(source),r.shelf,own(r,'shelf'));
 return {status:'ready',root:r,source,view:['shelf','jobs'].includes(r.view)||jobs.some(j=>j.id===r.view)?r.view:'arrival',shelf,jobs,
  current:jobs.find(j=>j.id===r.view)??null,
  jobsPartial:!list(source?.jobs)||source.jobs.length!==offered.length||own(r,'jobs')&&(!obj(r.jobs)||Object.keys(r.jobs).some(k=>!jobId(k)))||jobs.some(j=>['unavailable','unreadable'].includes(j.status))};
}

const failure=error=>({ok:false,error});
function mutate(state,fn,options={},create=false) {
 if(!obj(state)||typeof options.canExport!=='function')return failure('capacity');
 try {
  const candidate=clone(state);
  if(!own(candidate,'wordListShelf')){
   if(!create)return failure('unavailable');
   candidate.wordListShelf={v:1,view:'jobs',source:makeWordListShelfSource(),jobs:{}};
  }
  const r=candidate.wordListShelf;
  if(!obj(r)||r.v!==1)return failure('unavailable');
  const result=fn(r,candidate);
  if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(candidate))return failure('capacity');
  // The callback receives a disposable whole-notebook clone. Capture our root
  // first: even a mutating callback cannot change the installed proposal.
  const proposal=clone(r);
  if(options.canExport(candidate)!==true)return failure('capacity');
  state.wordListShelf=proposal;
  return result;
 }catch{return failure('capacity');}
}
export function openWordListShelf(state,options) {
 return mutate(state,(r,candidate)=>{
  const v=wordListShelfView(candidate),s=v.shelf.source;
  if(!s)return failure('unavailable');
  if(!own(r,'shelf'))r.shelf={placements:Object.fromEntries(s.words.map(w=>[w.id,null])),help:[],checks:[]};
  if(!shelfWork(r.shelf))return failure('unavailable');
  r.view='shelf';return {ok:true};
 },options,true);
}
export function openWordListJobs(state,options) {
 return mutate(state,(r,candidate)=>{
  if(!wordListShelfView(candidate).jobs.length)return failure('unavailable');
  r.view='jobs';return {ok:true};
 },options,true);
}
export function openWordListJob(state,key,options) {
 return mutate(state,r=>{
  if(!jobId(key))return failure('selection');
  if(!own(r,'jobs'))r.jobs={};
  if(!obj(r.jobs))return failure('unavailable');
  if(!own(r.jobs,key)){
   const s=sourceBase(r.source)?stainedMapRows(r.source.jobs,validWordListJob).find(j=>j.id===key):null;
   if(!s)return failure('unavailable');
   r.jobs[key]={source:clone(s),work:{choice:null},help:{hint:false,example:false},checks:[]};
  }
  const e=jobEntry(r.jobs[key]?.source,r.jobs[key],true);
  if(!validWordListJob(e.source)||e.source.id!==key||e.draftStatus!=='ready'||e.helpStatus!=='ready')return failure('unavailable');
  r.view=key;return {ok:true};
 },options,true);
}
export function skipWordListJob(state,key,options) {
 return mutate(state,(r,candidate)=>{
  if(!jobId(key)||r.view!==key||!wordListShelfView(candidate).jobs.some(j=>j.id===key))return failure('selection');
  r.view='jobs';return {ok:true};
 },options);
}
function editShelf(state,fn,options) {
 return mutate(state,(r,candidate)=>{
  const e=wordListShelfView(candidate).shelf;
  if(e?.status!=='ready'||e.draftStatus!=='ready'||!e.playable.length)return failure('unavailable');
  return fn(r.shelf,e.source,e);
 },options);
}
export function placeWordListCard(state,key,trayId,options) {
 return editShelf(state,(r,s,e)=>{
  if(!e.playable.some(w=>w.id===key)||trayId!==null&&!s.trays.some(t=>t.id===trayId))return failure('selection');
  r.placements[key]=trayId;return {ok:true};
 },options);
}
export function useWordListShelfHelp(state,key,options) {
 return editShelf(state,r=>{
  if(!['contrast','example'].includes(key))return failure('selection');
  if(r.help.includes(key))return {ok:true,changed:false};
  r.help.push(key);return {ok:true};
 },options);
}
export function wordListShelfResult(s,record) {
 if(!s||!shelfWork(record))return null;
 const words=playable(s,record.placements);if(!words.length)return null;
 const rows=words.map(w=>{
  const selected=value(record.placements,w.id),clue=w.clues.find(c=>c.trayId===selected);
  const outcome=selected===null?'unplaced':clue?'listed':'discuss';
  const note=outcome==='listed'?s.copy.listed+' '+clue.note:s.copy[outcome];
  return {id:w.id,word:w.text,trayId:selected,trayLabel:s.trays.find(t=>t.id===selected)?.label??null,outcome,feedback:note};
 });
 const status=rows.some(r=>r.outcome==='unplaced')?'incomplete':rows.some(r=>r.outcome==='discuss')?'discussion':'listed';
 const coverage=s.partial||words.length!==s.words.length?'partial':'full';
 const key=coverage==='partial'?'partial'+status[0].toUpperCase()+status.slice(1):status==='listed'?'listedSummary':status;
 return {placements:clone(record.placements),rows,status,coverage,helpBefore:clone(record.help),summary:s.copy[key],...(coverage==='partial'?{notice:s.copy.partial}:{})};
}
export function checkWordListShelf(state,options) {
 return editShelf(state,(r,s,e)=>{
  if(e.checksStatus==='unreadable')return failure('unavailable');
  const result=wordListShelfResult(s,r);if(!result)return failure('unavailable');
  r.checks??=[];r.checks.push(result);return {ok:true,...result};
 },options);
}
export function keepWordListShelf(state,options) {
 return editShelf(state,(r,s,e)=>{
  if(e.latestStatus==='unreadable')return failure('unavailable');
  const k={placements:clone(r.placements),helpBefore:clone(r.help),check:e.last&&!e.earlier?clone(e.last):null};
  if(!own(r,'firstKept')||r.firstKept===null)r.firstKept=clone(k);
  r.latestKept=k;return {ok:true};
 },options);
}
export function restoreWordListShelf(state,edition,options) {
 return editShelf(state,(r,s,e)=>{
  if(!['first','latest'].includes(edition))return failure('selection');
  const k=r[edition+'Kept'];if(!validWordListKeep(k))return failure('unavailable');
  for(const w of e.playable){
   const selected=value(k.placements,w.id);
   if(selected===null||s.trays.some(t=>t.id===selected))r.placements[w.id]=clone(selected);
  }
  return {ok:true};
 },options);
}

function editJob(state,key,fn,options) {
 return mutate(state,(r,candidate)=>{
  const e=wordListShelfView(candidate).jobs.find(j=>j.id===key);
  if(e?.status!=='ready'||e.draftStatus!=='ready'||e.helpStatus!=='ready')return failure('unavailable');
  return fn(e.record,e.source,e);
 },options);
}
export function answerWordListJob(state,key,choice,options) {
 return editJob(state,key,(r,s)=>{
  if(choice!==null&&!s.choices.some(c=>c.id===choice))return failure('selection');
  r.work.choice=choice;return {ok:true};
 },options);
}
export function useWordListJobHelp(state,key,flag,options) {
 return editJob(state,key,r=>{
  if(!['hint','example'].includes(flag))return failure('selection');
  if(r.help[flag])return {ok:true,changed:false};
  r.help[flag]=true;return {ok:true};
 },options);
}
export function checkWordListJob(state,key,options) {
 return editJob(state,key,(r,s,e)=>{
  if(e.checksStatus==='unreadable')return failure('unavailable');
  const result=stainedJobResult(s,r.work);if(!result)return failure('unavailable');
  r.checks??=[];r.checks.push({work:clone(r.work),help:clone(r.help),...result,supported:true,guided:true});
  return {ok:true,...result};
 },options);
}
export function keepWordListJob(state,key,options) {
 return editJob(state,key,(r,s,e)=>{
  if(e.latestStatus==='unreadable')return failure('unavailable');
  const k={work:clone(r.work),help:clone(r.help),check:e.last&&!e.earlier?clone(e.last):null};
  if(!own(r,'firstKept')||r.firstKept===null)r.firstKept=clone(k);
  r.latestKept=k;return {ok:true};
 },options);
}
export function restoreWordListJob(state,key,edition,options) {
 return editJob(state,key,(r,s)=>{
  if(!['first','latest'].includes(edition))return failure('selection');
  const k=r[edition+'Kept'];if(!validJobKeep(s,k))return failure('unavailable');
  r.work.choice=clone(k.work.choice);
  for(const flag of ['hint','example'])r.help[flag] ||= k.help[flag];
  return {ok:true};
 },options);
}
