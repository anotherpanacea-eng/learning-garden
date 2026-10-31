// Spec337: visible word pieces, retained glossary revisions and supported jobs.
import {makeLongWordSource} from './long-word-workshop-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {validPipsJob} from './pips-copy-core.mjs';
import {stainedMapRows,validStainedWork,sameStainedWork,stainedJobResult} from './stained-map-core.mjs';

const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(o,k)=>Object.hasOwn(o,k),clone=structuredClone;
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(x)&&!['constructor','prototype','toString','valueOf'].includes(x);
const text=x=>typeof x==='string'&&[...x].length<=4000;
const small=x=>text(x)&&x.length>0&&[...x].length<=160;
const feedback=x=>typeof x==='string'&&[...x].length<=16000;
const list=x=>Array.isArray(x)&&x.length<=64;
const help=x=>list(x)&&x.every(id)&&new Set(x).size===x.length;
const jobHelp=x=>obj(x)&&typeof x.hint==='boolean'&&typeof x.example==='boolean';
const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>v===b[i]);
const picked=(p,k)=>own(p,k)?p[k]:null;
const normalized=(p,k)=>picked(p,k)??null;
const field=(r,k,valid)=>!own(r,k)?'missing':valid(r[k])?'ready':'unreadable';
const jobId=k=>['F1','F2','F3'].includes(k);
const validJob=s=>validPipsJob(s)&&jobId(s.id);
function base(s){try{return obj(s)&&s.v===1&&id(s.id)&&text(s.title)&&obj(s.copy)&&new TextEncoder().encode(JSON.stringify(s)).length<=96*1024;}catch{return false;}}
function wordSource(w){
 if(!obj(w)||!id(w.id)||!small(w.text)||!['meaning','sentence','clue'].every(k=>text(w[k]))||!list(w.pieces))return null;
 const pieces=stainedMapRows(w.pieces,p=>small(p.text));
 if(!pieces.length||pieces.length!==w.pieces.length)return null;
 const e=w.example;
 if(!obj(e)||!text(e.title)||!list(e.steps)||!e.steps.every(text)||!list(e.order)||new Set(e.order).size!==e.order.length||!e.order.every(k=>pieces.some(p=>p.id===k)))return null;
 return {...w,pieces};
}
function wordsSource(s){return base(s)&&list(s.words)?stainedMapRows(s.words,w=>!!wordSource(w)).map(wordSource):[];}
function glossarySource(s){
 if(!base(s)||!list(s.glossary)||!['glossaryIncomplete','glossaryDiscussion','glossaryMatching','partialMatching','partialNotice'].every(k=>text(s.copy[k])))return null;
 const lines=stainedMapRows(s.glossary,g=>['title','before','flagged','hint'].every(k=>text(g[k]))&&list(g.frame)&&g.frame.length===2&&g.frame.every(text)&&list(g.choices)&&id(g.fits)&&obj(g.feedback)&&list(g.example)&&g.example.every(text)).flatMap(g=>{
  const choices=stainedMapRows(g.choices,c=>small(c.text)&&feedback(g.feedback[c.id]));
  return choices.some(c=>c.id===g.fits)?[{...g,choices,partial:choices.length!==g.choices.length}]:[];
 });
 return {lines,copy:s.copy,partial:lines.length!==s.glossary.length||lines.some(g=>g.partial)};
}
const order=o=>list(o)&&o.every(id)&&new Set(o).size===o.length;
const validOrder=(s,o)=>order(o)&&o.length<=s.pieces.length&&o.every(k=>s.pieces.some(p=>p.id===k));
export const longWordText=(s,o)=>s&&validOrder(s,o)?o.map(k=>s.pieces.find(p=>p.id===k).text).join(''):null;
export const validLongWordCheck=c=>obj(c)&&order(c.order)&&['empty','different','matches'].includes(c.status)&&small(c.target)&&text(c.text)&&feedback(c.feedback)&&help(c.helpBefore);
export const validLongWordKeep=k=>obj(k)&&order(k.order)&&help(k.helpBefore)&&(!own(k,'check')||k.check===null||validLongWordCheck(k.check)&&same(k.order,k.check.order));
const row=r=>obj(r)&&id(r.id)&&text(r.before)&&(r.chosen===null||text(r.chosen))&&feedback(r.feedback)&&['unchosen','different','matches'].includes(r.status);
export const validLongGlossaryCheck=c=>obj(c)&&obj(c.picks)&&list(c.rows)&&c.rows.every(row)&&new Set(c.rows.map(r=>r.id)).size===c.rows.length&&['incomplete','discussion','matching'].includes(c.status)&&['full','partial'].includes(c.coverage)&&help(c.helpBefore)&&text(c.summary)&&(!own(c,'notice')||text(c.notice));
export const validLongGlossaryKeep=k=>obj(k)&&obj(k.picks)&&help(k.helpBefore)&&(!own(k,'check')||k.check===null||validLongGlossaryCheck(k.check)&&k.check.rows.every(r=>normalized(k.picks,r.id)===normalized(k.check.picks,r.id)));
const validJobCheck=(s,c)=>obj(c)&&validStainedWork(s,c.work)&&jobHelp(c.help)&&['incomplete','different','fit'].includes(c.outcome)&&Array.isArray(c.feedback)&&c.feedback.length<=128&&c.feedback.every(feedback)&&c.supported===true&&c.guided===true;
const validJobKeep=(s,k)=>obj(k)&&validStainedWork(s,k.work)&&jobHelp(k.help)&&(k.check===null||validJobCheck(s,k.check)&&sameStainedWork(k.work,k.check.work));
function missing(source,record,present){return {source,record:present?record:null,status:!source?'unavailable':!present?'missing':!obj(record)?'unreadable':'ready',draftStatus:'missing',helpStatus:'missing',checkStatus:'missing',firstStatus:'missing',latestStatus:'missing',last:null,currentCheck:null,earlier:false,partial:false};}
function wordEntry(source,record,present){
 const e=missing(source,record,present);if(e.status!=='ready')return e;
 e.draftStatus=field(record,'order',o=>validOrder(source,o));e.helpStatus=field(record,'help',help);
 e.checkStatus=field(record,'check',c=>c===null||validLongWordCheck(c));e.last=e.checkStatus==='ready'?record.check??null:null;
 e.firstStatus=field(record,'firstKept',k=>k===null||validLongWordKeep(k));e.latestStatus=field(record,'latestKept',k=>k===null||validLongWordKeep(k));
 const current=e.last&&e.draftStatus==='ready'&&same(e.last.order,record.order)&&e.last.text===longWordText(source,record.order)&&e.last.target===source.text;
 e.currentCheck=current?e.last:null;e.earlier=!!e.last&&!current;e.partial=e.checkStatus==='unreadable';return e;
}
const glossaryWork=r=>obj(r)&&obj(r.picks)&&help(r.help);
function glossaryEntry(source,record,present){
 const e=missing(source,record,present);e.playable=[];e.opaque=[];
 if(e.status!=='ready')return e;
 e.draftStatus=obj(record.picks)?'ready':'unreadable';e.helpStatus=field(record,'help',help);
 e.checkStatus=field(record,'check',c=>c===null||validLongGlossaryCheck(c));e.last=e.checkStatus==='ready'?record.check??null:null;
 e.firstStatus=field(record,'firstKept',k=>k===null||validLongGlossaryKeep(k));e.latestStatus=field(record,'latestKept',k=>k===null||validLongGlossaryKeep(k));
 if(e.draftStatus==='ready'){
  e.playable=source.lines.filter(g=>normalized(record.picks,g.id)===null||g.choices.some(c=>c.id===picked(record.picks,g.id)));
  e.opaque=source.lines.filter(g=>!e.playable.includes(g));
 }
 e.partial=source.partial||e.opaque.length>0||e.checkStatus==='unreadable'||e.draftStatus==='ready'&&Object.keys(record.picks).some(k=>!source.lines.some(g=>g.id===k));
 const coverage=e.partial?'partial':'full';
 const current=e.last&&e.playable.length>0&&e.last.rows.length===e.playable.length&&e.last.coverage===coverage&&e.playable.every(g=>{
  const row=e.last.rows.find(r=>r.id===g.id),choice=g.choices.find(c=>c.id===picked(record.picks,g.id));
  return row&&row.before===g.flagged&&row.chosen===(choice?.text??null)&&normalized(e.last.picks,g.id)===normalized(record.picks,g.id);
 });
 e.currentCheck=current?e.last:null;e.earlier=!!e.last&&!current;return e;
}
function jobEntry(source,record,present){
 const e=missing(source,record,present);if(e.status!=='ready')return e;
 e.draftStatus=field(record,'work',w=>validStainedWork(source,w));e.helpStatus=field(record,'help',jobHelp);
 e.checkStatus=field(record,'checks',cs=>Array.isArray(cs)&&cs.every(c=>validJobCheck(source,c)));
 e.last=e.checkStatus==='ready'?record.checks.at(-1)??null:null;
 e.firstStatus=field(record,'firstKept',k=>k===null||validJobKeep(source,k));e.latestStatus=field(record,'latestKept',k=>k===null||validJobKeep(source,k));
 e.currentCheck=e.last&&e.draftStatus==='ready'&&sameStainedWork(e.last.work,record.work)?e.last:null;e.earlier=!!e.last&&!e.currentCheck;e.partial=e.checkStatus==='unreadable';return e;
}
export function longWordView(state){
 const empty={status:'new',root:null,source:null,view:'arrival',words:[],jobs:[],glossary:null,currentWord:null,currentJob:null,currentLine:null,wordsPartial:false,jobsPartial:false};
 if(!obj(state)||!own(state,'longWordWorkshop'))return empty;
 const r=state.longWordWorkshop;
 if(!obj(r)||r.v!==1||obj(r.source)&&r.source.v!==1)return {...empty,status:'unsupported',root:r};
 const source=base(r.source)?r.source:null,offeredWords=wordsSource(source),offeredJobs=source?stainedMapRows(source.jobs,validJob):[];
 const wordKeys=offeredWords.map(w=>w.id),jobKeys=offeredJobs.map(j=>j.id);
 if(obj(r.words))for(const key of Object.keys(r.words))if(id(key)&&!wordKeys.includes(key))wordKeys.push(key);
 if(obj(r.jobs))for(const key of Object.keys(r.jobs))if(id(key)&&!jobKeys.includes(key))jobKeys.push(key);
 const words=wordKeys.map(key=>{
  const stored=obj(r.words)&&own(r.words,key),record=stored?r.words[key]:null,e=wordEntry(offeredWords.find(w=>w.id===key)??null,record,stored);
  if(own(r,'words')&&!obj(r.words))e.status='unreadable';return {id:key,stored,...e};
 });
 const jobs=jobKeys.map(key=>{
  const stored=obj(r.jobs)&&own(r.jobs,key),record=stored?r.jobs[key]:null;
  const s=stored?(obj(record)&&validJob(record.source)&&record.source.id===key?record.source:null):offeredJobs.find(j=>j.id===key)??null;
  const e=jobEntry(s,record,stored);if(own(r,'jobs')&&!obj(r.jobs))e.status='unreadable';return {id:key,stored,...e};
 });
 const glossary=glossaryEntry(glossarySource(source),r.glossary,own(r,'glossary'));
 const currentWord=words.find(w=>w.id===r.activeWord)??null,currentJob=jobs.find(j=>j.id===r.activeJob)??null;
 const currentLine=glossary.source?.lines.find(g=>g.id===glossary.record?.activeLine)??glossary.source?.lines[0]??null;
 return {status:'ready',root:r,source,view:['words','glossary','jobs'].includes(r.view)?r.view:'arrival',words,jobs,glossary,currentWord,currentJob,currentLine,
  wordsPartial:!list(source?.words)||offeredWords.length!==source.words.length||own(r,'words')&&!obj(r.words)||words.some(e=>['unavailable','unreadable'].includes(e.status)),
  jobsPartial:!list(source?.jobs)||offeredJobs.length!==source.jobs.length||own(r,'jobs')&&!obj(r.jobs)||jobs.some(e=>['unavailable','unreadable'].includes(e.status))};
}

const fail=error=>({ok:false,error});
function mutate(state,fn,options={},create=false){
 if(!obj(state)||typeof options?.canExport!=='function')return fail('capacity');
 try{
  const candidate=clone(state);
  if(!own(candidate,'longWordWorkshop')){
   if(!create)return fail('unavailable');
   candidate.longWordWorkshop={v:1,view:'jobs',source:makeLongWordSource(),words:{},jobs:{}};
  }
  const r=candidate.longWordWorkshop;if(!obj(r)||r.v!==1||!base(r.source))return fail('unavailable');
  const result=fn(r,candidate);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(candidate))return fail('capacity');
  const proposal=clone(r);if(options.canExport(candidate)!==true)return fail('capacity');
  state.longWordWorkshop=proposal;return result;
 }catch{return fail('capacity');}
}
function openWord(r,candidate,key){
 const e=longWordView(candidate).words.find(w=>w.id===key);if(!e?.source)return fail('unavailable');
 if(!own(r,'words'))r.words={};if(!obj(r.words))return fail('unavailable');
 if(!own(r.words,key))r.words[key]={order:[],help:[]};
 const updated=wordEntry(e.source,r.words[key],true);if(updated.draftStatus!=='ready'||updated.helpStatus!=='ready')return fail('unavailable');
 r.view='words';r.activeWord=key;return {ok:true};
}
function openGlossary(r,candidate){
 const s=longWordView(candidate).glossary.source;if(!s?.lines.length)return fail('unavailable');
 if(!own(r,'glossary'))r.glossary={picks:{},help:[],activeLine:s.lines[0].id};
 if(!glossaryWork(r.glossary))return fail('unavailable');r.view='glossary';return {ok:true};
}
export function openLongWordSection(state,section,options){return mutate(state,(r,candidate)=>{
 if(section==='words'){
  const v=longWordView(candidate),key=v.words.find(w=>w.id===r.activeWord&&w.source)?.id??v.words.find(w=>w.source)?.id;
  return key?openWord(r,candidate,key):fail('unavailable');
 }
 if(section==='glossary')return openGlossary(r,candidate);
 if(section!=='jobs'||!longWordView(candidate).jobs.length)return fail('unavailable');r.view='jobs';r.activeJob=null;return {ok:true};
},options,true);}
export function openLongWord(state,key,options){return mutate(state,(r,c)=>id(key)?openWord(r,c,key):fail('selection'),options,true);}
export function selectLongLine(state,key,options){return mutate(state,(r,candidate)=>{
 const opened=openGlossary(r,candidate);if(!opened.ok)return opened;
 const e=longWordView(candidate).glossary;if(!e.source.lines.some(g=>g.id===key))return fail('selection');r.glossary.activeLine=key;return {ok:true};
},options,true);}
function editWord(state,key,fn,options){return mutate(state,(r,candidate)=>{
 const e=longWordView(candidate).words.find(w=>w.id===key);
 if(e?.status!=='ready'||e.draftStatus!=='ready'||e.helpStatus!=='ready')return fail('unavailable');
 const result=fn(e.record,e.source,e);return result.ok&&(!validOrder(e.source,e.record.order)||!help(e.record.help))?fail('capacity'):result;
},options);}
export function appendLongPiece(state,key,pieceId,options){return editWord(state,key,(r,s)=>{
 if(!s.pieces.some(p=>p.id===pieceId)||r.order.includes(pieceId))return fail('selection');r.order.push(pieceId);return {ok:true};
},options);}
export function moveLongPiece(state,key,pieceId,delta,options){return editWord(state,key,r=>{
 const at=r.order.indexOf(pieceId),to=at+delta;if(![-1,1].includes(delta)||at<0||to<0||to>=r.order.length)return fail('selection');
 [r.order[at],r.order[to]]=[r.order[to],r.order[at]];return {ok:true};
},options);}
export function removeLongPiece(state,key,pieceId,options){return editWord(state,key,r=>{
 const at=r.order.indexOf(pieceId);if(at<0)return fail('selection');r.order.splice(at,1);return {ok:true};
},options);}
export function clearLongWord(state,key,options){return editWord(state,key,r=>{r.order=[];return {ok:true};},options);}
export function useLongWordHelp(state,key,options){return editWord(state,key,r=>{
 if(r.help.includes('example'))return {ok:true,changed:false};r.help.push('example');return {ok:true};
},options);}
export function checkLongWord(state,key,options){return editWord(state,key,(r,s,e)=>{
 if(e.checkStatus==='unreadable')return fail('unavailable');const value=longWordText(s,r.order),status=!r.order.length?'empty':value===s.text?'matches':'different';
 const c={...(obj(r.check)?r.check:{}),order:clone(r.order),status,target:s.text,text:value,feedback:longWordView(state).source.copy['word'+status[0].toUpperCase()+status.slice(1)],helpBefore:clone(r.help)};
 if(!validLongWordCheck(c))return fail('capacity');r.check=c;return {ok:true,...c};
},options);}
export function keepLongWord(state,key,options){return editWord(state,key,(r,s,e)=>{
 if(e.latestStatus==='unreadable')return fail('unavailable');const k={...(obj(r.latestKept)?r.latestKept:{}),order:clone(r.order),helpBefore:clone(r.help),check:e.currentCheck?clone(e.currentCheck):null};
 if(!validLongWordKeep(k))return fail('capacity');if(!own(r,'firstKept')||r.firstKept===null)r.firstKept=clone(k);r.latestKept=k;return {ok:true};
},options);}
export function restoreLongWord(state,key,edition,options){return editWord(state,key,(r,s)=>{
 if(!['first','latest'].includes(edition))return fail('selection');const k=r[edition+'Kept'];if(!validLongWordKeep(k)||!validOrder(s,k.order))return fail('unavailable');r.order=clone(k.order);return {ok:true};
},options);}
function editGlossary(state,fn,options){return mutate(state,(r,candidate)=>{
 const e=longWordView(candidate).glossary;if(e?.status!=='ready'||e.draftStatus!=='ready'||e.helpStatus!=='ready')return fail('unavailable');
 const result=fn(e.record,e.source,e);return result.ok&&!glossaryWork(e.record)?fail('capacity'):result;
},options);}
export function setLongGlossaryChoice(state,key,choice,options){return editGlossary(state,(r,s,e)=>{
 const line=e.playable.find(g=>g.id===key);if(!line||choice!==null&&!line.choices.some(c=>c.id===choice))return fail('selection');r.picks[key]=choice;return {ok:true};
},options);}
export function useLongGlossaryHelp(state,key,options){return editGlossary(state,(r,s,e)=>{
 if(!e.playable.some(g=>g.id===key))return fail('unavailable');const flag=key+'-example';if(r.help.includes(flag))return {ok:true,changed:false};r.help.push(flag);return {ok:true};
},options);}
export function checkLongGlossary(state,options){return editGlossary(state,(r,s,e)=>{
 if(e.checkStatus==='unreadable'||!e.playable.length)return fail('unavailable');
 const rows=e.playable.map(g=>{const value=normalized(r.picks,g.id),c=g.choices.find(c=>c.id===value);return {id:g.id,before:g.flagged,chosen:c?.text??null,status:value===null?'unchosen':value===g.fits?'matches':'different',feedback:c?g.feedback[c.id]:s.copy.glossaryIncomplete};});
 const status=rows.some(r=>r.status==='unchosen')?'incomplete':rows.some(r=>r.status==='different')?'discussion':'matching',coverage=e.partial?'partial':'full';
 const summary=coverage==='partial'?(status==='matching'?s.copy.partialMatching:s.copy.partialNotice+' '+s.copy['glossary'+status[0].toUpperCase()+status.slice(1)]):s.copy['glossary'+status[0].toUpperCase()+status.slice(1)];
 const c={...(obj(r.check)?r.check:{}),picks:clone(r.picks),rows,status,coverage,helpBefore:clone(r.help),summary,...(coverage==='partial'?{notice:s.copy.partialNotice}:{})};
 if(coverage==='full')delete c.notice;
 if(!validLongGlossaryCheck(c))return fail('capacity');r.check=c;return {ok:true,...c};
},options);}
export function keepLongGlossary(state,options){return editGlossary(state,(r,s,e)=>{
 if(e.latestStatus==='unreadable'||!e.playable.length)return fail('unavailable');const k={...(obj(r.latestKept)?r.latestKept:{}),picks:clone(r.picks),helpBefore:clone(r.help),check:e.currentCheck?clone(e.currentCheck):null};
 if(!validLongGlossaryKeep(k))return fail('capacity');if(!own(r,'firstKept')||r.firstKept===null)r.firstKept=clone(k);r.latestKept=k;return {ok:true};
},options);}
export function restoreLongGlossary(state,edition,options){return editGlossary(state,(r,s,e)=>{
 if(!['first','latest'].includes(edition))return fail('selection');const k=r[edition+'Kept'];if(!validLongGlossaryKeep(k))return fail('unavailable');
 for(const g of e.playable){const value=normalized(k.picks,g.id);if(value===null||g.choices.some(c=>c.id===value))r.picks[g.id]=clone(value);}return {ok:true};
},options);}
export function openLongJob(state,key,options){
 if(key==='F4')return openLongWordSection(state,'glossary',options);
 return mutate(state,(r,candidate)=>{
  if(!jobId(key))return fail('selection');if(!own(r,'jobs'))r.jobs={};if(!obj(r.jobs))return fail('unavailable');
  if(!own(r.jobs,key)){const source=stainedMapRows(r.source.jobs,validJob).find(j=>j.id===key);if(!source)return fail('unavailable');r.jobs[key]={source:clone(source),work:{choice:null},help:{hint:false,example:false},checks:[]};}
  const e=longWordView(candidate).jobs.find(j=>j.id===key);if(e?.status!=='ready'||e.draftStatus!=='ready'||e.helpStatus!=='ready')return fail('unavailable');r.view='jobs';r.activeJob=key;return {ok:true};
 },options,true);
}
function editJob(state,key,fn,options){return mutate(state,(r,candidate)=>{
 const e=longWordView(candidate).jobs.find(j=>j.id===key);if(e?.status!=='ready'||e.draftStatus!=='ready'||e.helpStatus!=='ready')return fail('unavailable');return fn(e.record,e.source,e);
},options);}
export function answerLongJob(state,key,choice,options){return editJob(state,key,(r,s)=>{
 if(choice!==null&&!s.choices.some(c=>c.id===choice))return fail('selection');r.work.choice=choice;return {ok:true};
},options);}
export function useLongJobHelp(state,key,flag,options){return editJob(state,key,r=>{
 if(!['hint','example'].includes(flag))return fail('selection');if(r.help[flag])return {ok:true,changed:false};r.help[flag]=true;return {ok:true};
},options);}
export function checkLongJob(state,key,options){return editJob(state,key,(r,s,e)=>{
 if(e.checkStatus==='unreadable')return fail('unavailable');const result=stainedJobResult(s,r.work);if(!result)return fail('unavailable');
 const c={work:clone(r.work),help:clone(r.help),...result,supported:true,guided:true};if(!validJobCheck(s,c))return fail('capacity');r.checks??=[];r.checks.push(c);return {ok:true,...result};
},options);}
export function keepLongJob(state,key,options){return editJob(state,key,(r,s,e)=>{
 if(e.latestStatus==='unreadable')return fail('unavailable');const k={...(obj(r.latestKept)?r.latestKept:{}),work:clone(r.work),help:clone(r.help),check:e.currentCheck?clone(e.currentCheck):null};
 if(!validJobKeep(s,k))return fail('capacity');if(!own(r,'firstKept')||r.firstKept===null)r.firstKept=clone(k);r.latestKept=k;return {ok:true};
},options);}
export function restoreLongJob(state,key,edition,options){return editJob(state,key,(r,s)=>{
 if(!['first','latest'].includes(edition))return fail('selection');const k=r[edition+'Kept'];if(!validJobKeep(s,k))return fail('unavailable');r.work.choice=clone(k.work.choice);for(const flag of ['hint','example'])r.help[flag] ||= k.help[flag];return {ok:true};
},options);}
export function skipLongJob(state,key,options){return mutate(state,r=>{
 if(!jobId(key)||r.view!=='jobs'||r.activeJob!==key)return fail('selection');r.activeJob=null;return {ok:true};
},options);}
