// Spec330: source-owned supplied practice; no independent spelling or story inference.
import {makeStainedMapSource} from './stained-map-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),clone=structuredClone;
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(x)&&!['constructor','prototype','toString','valueOf'].includes(x);
const text=x=>typeof x==='string'&&[...x].length<=4000;
const lines=x=>Array.isArray(x)&&x.length<=64&&x.every(text);
// Derived feedback includes a source label and message, plus an aggregate line.
const feedbackLines=x=>Array.isArray(x)&&x.length<=128&&x.every(line=>typeof line==='string'&&[...line].length<=16000);
const rows=x=>Array.isArray(x)&&x.length<=64;
const help=x=>object(x)&&typeof x.hint==='boolean'&&typeof x.example==='boolean';
const sourceSize=x=>{try{return object(x)&&new TextEncoder().encode(JSON.stringify(x)).length<=96*1024;}catch{return false;}};
const sourceBase=s=>sourceSize(s)&&s.format===1&&id(s.id);
const named=x=>object(x)&&id(x.id)&&text(x.text);
const card=x=>object(x)&&id(x.id)&&['title','text','example'].every(k=>text(x[k]))&&lines(x.steps);
export const stainedMapTables=Object.freeze(['map','histories','families']);
export function stainedMapRows(list,valid){
 if(!rows(list))return [];const counts=new Map();for(const row of list)if(object(row)&&id(row.id))counts.set(row.id,(counts.get(row.id)||0)+1);
 return list.filter(row=>object(row)&&id(row.id)&&counts.get(row.id)===1&&valid(row));
}
export const stainedMapCards=source=>stainedMapRows(source?.cards,card);
function benchSource(source,kind){
 if(!sourceBase(source)||!stainedMapTables.includes(kind))return null;
 const choices=stainedMapRows(kind==='map'?source.tiles:kind==='histories'?source.historyPlaces:source.familyWords,x=>named(x)&&(kind!=='map'||['letters','none'].includes(x.kind)));
 const raw=kind==='map'?source.labels:kind==='histories'?source.histories:source.families;
 const parts=stainedMapRows(raw,x=>id(x.key)&&choices.some(c=>c.id===x.key)&&(kind==='map'?['before','after','complete','note'].every(k=>text(x[k]))&&Number.isInteger(x.stains)&&x.stains>=0&&x.stains<=2&&typeof x.capitalStart==='boolean':text(x.word)&&(kind==='histories'?text(x.note):text(x.letter))));
 const keys=kind==='map'?['incomplete','mapFitOne','mapFitTwo','mapMissingOne','mapMissingTwo','mapDifferent','mapNoneFit','mapNoneDifferent','mapComplete']:['incomplete',kind==='histories'?'historyDifferent':'familyDifferent','mappingComplete'];
 if(!parts.length||!choices.length||!object(source.copy)||!keys.every(k=>text(source.copy[k])))return null;
 return {kind,parts,choices,copy:source.copy,retainedUnreadable:!rows(raw)||parts.length!==raw.length||choices.length!==(kind==='map'?source.tiles:kind==='histories'?source.historyPlaces:source.familyWords).length};
}
export function validStainedJob(s){
 if(!sourceSize(s)||s.v!==1||!id(s.id)||!['choice','match'].includes(s.kind)||!['title','prompt','hint','example','explanation'].every(k=>text(s[k]))||!lines(s.steps)||!rows(s.teach)||!s.teach.every(card)||!rows(s.parts)||!rows(s.choices)||!object(s.different)||!Object.values(s.different).every(text))return false;
 const p=stainedMapRows(s.parts,named),c=stainedMapRows(s.choices,named);
 if(p.length!==s.parts.length||c.length!==s.choices.length||!c.length||stainedMapRows(s.teach,card).length!==s.teach.length)return false;
 return s.kind==='choice'?c.some(x=>x.id===s.key):p.length>0&&object(s.key)&&p.every(x=>own(s.key,x.id)&&c.some(y=>y.id===s.key[x.id]));
}
const pick=(w,k)=>own(w.placements,k)?w.placements[k]:null;
const emptyWork=s=>s.kind==='choice'?{choice:null}:{placements:Object.fromEntries(s.parts.map(p=>[p.id,null]))};
export function validStainedWork(s,w){
 if(!s||!object(w))return false;
 if(s.kind==='choice')return own(w,'choice')&&(w.choice===null||s.choices.some(c=>c.id===w.choice));
 return object(w.placements)&&Object.entries(w.placements).every(([k,v])=>s.parts.some(p=>p.id===k)&&(v===null||s.choices.some(c=>c.id===v)));
}
export function sameStainedWork(a,b){
 if(!object(a)||!object(b))return false;
 if(own(a,'choice')||own(b,'choice'))return own(a,'choice')&&own(b,'choice')&&a.choice===b.choice;
 if(!object(a.placements)||!object(b.placements))return false;
 return [...new Set([...Object.keys(a.placements),...Object.keys(b.placements)])].every(k=>(pick(a,k)??null)===(pick(b,k)??null));
}
const validCheck=(s,c)=>object(c)&&validStainedWork(s,c.work)&&['incomplete','different','fit'].includes(c.outcome)&&feedbackLines(c.feedback)&&c.supported===true&&c.guided===true&&(!s.v||help(c.help));
export const validStainedSnapshot=(s,k)=>object(k)&&validStainedWork(s,k.work)&&(!s.v||help(k.help))&&(k.check===null||validCheck(s,k.check)&&sameStainedWork(k.work,k.check.work));
const field=(r,k,valid)=>!object(r)||!own(r,k)?'missing':valid(r[k])?'ready':'unreadable';
function recordView(s,raw,present){
 const status=!s?'unavailable':!present?'missing':!object(raw)?'unreadable':'ready';
 const draftStatus=status==='ready'?field(raw,'work',w=>validStainedWork(s,w)):'missing';
 const helpStatus=s?.v&&status==='ready'?field(raw,'help',help):'missing';
 const checksStatus=status==='ready'?field(raw,'checks',Array.isArray):'missing';
 const firstStatus=status==='ready'?field(raw,'firstKept',k=>k===null||validStainedSnapshot(s,k)):'missing',latestStatus=status==='ready'?field(raw,'latestKept',k=>k===null||validStainedSnapshot(s,k)):'missing';
 const checks=checksStatus==='ready'?raw.checks.filter(c=>validCheck(s,c)):[],last=checks.at(-1)??null;
 return {status,source:s,record:present?raw:null,draftStatus,helpStatus,checksStatus,firstStatus,latestStatus,last,earlier:last&&draftStatus==='ready'?!sameStainedWork(last.work,raw.work):false,retainedUnreadable:checksStatus==='ready'&&checks.length!==raw.checks.length};
}
export function stainedMapView(state){
 const present=object(state)&&own(state,'spellings'),r=present?state.spellings:null;
 if(!present)return {status:'new',root:null,source:null,tables:{},jobs:[],current:null,view:'choose'};
 if(!object(r)||r.v!==1)return {status:'unsupported',root:r,source:null,tables:{},jobs:[],current:null,view:'choose'};
 const source=sourceBase(r.source)?r.source:null,tables={};
 for(const kind of stainedMapTables){const s=benchSource(source,kind),container=object(r.benches)?r.benches:null;tables[kind]=recordView(s,container?.[kind],!!container&&own(container,kind));if(own(r,'benches')&&!container)tables[kind].status='unreadable';}
 const offered=source?stainedMapRows(source.jobs,validStainedJob):[],keys=[...offered.map(s=>s.id)];
 if(object(r.items))for(const k of Object.keys(r.items))if(id(k)&&!keys.includes(k))keys.push(k);
 const jobs=keys.map(key=>{const has=object(r.items)&&own(r.items,key),raw=has?r.items[key]:null,s=has?(object(raw)&&validStainedJob(raw.source)&&raw.source.id===key?raw.source:null):offered.find(s=>s.id===key);const view=recordView(s,raw,has);if(own(r,'items')&&!object(r.items))view.status='unreadable';return {id:key,...view};});
 return {status:'ready',root:r,source,tables,jobs,current:jobs.find(j=>j.id===r.currentId)??null,view:[...stainedMapTables,'practice'].includes(r.view)?r.view:'choose'};
}
const failure=error=>({ok:false,error});
function mutate(state,fn,options={}){
 if(!object(state)||typeof options.canExport!=='function')return failure('capacity');
 try{const next=clone(state);if(!own(next,'spellings'))next.spellings={v:1,source:makeStainedMapSource(),view:'choose',currentId:null,benches:{},items:{}};
  if(!object(next.spellings)||next.spellings.v!==1)return failure('unavailable');
  const result=fn(next.spellings,next);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(next))return failure('capacity');const proposed=clone(next.spellings);if(options.canExport(next)!==true)return failure('capacity');state.spellings=proposed;return result;
 }catch{return failure('capacity');}
}
function ensureMap(owner,key){if(!own(owner,key))owner[key]={};return object(owner[key])?owner[key]:null;}
function ensureDraft(s,r){
 if(!object(r))return false;if(!own(r,'work'))r.work=emptyWork(s);if(!validStainedWork(s,r.work))return false;
 if(s.v){if(!own(r,'help'))r.help={hint:false,example:false};if(!help(r.help))return false;}return true;
}
export function openStainedTable(state,kind,options){return mutate(state,r=>{
 if(kind==='practice'){r.view='practice';return {ok:true};}
 const s=benchSource(r.source,kind),b=ensureMap(r,'benches');if(!s||!b)return failure('unavailable');
 if(!own(b,kind))b[kind]={work:emptyWork(s),checks:[],firstKept:null,latestKept:null};
 if(!ensureDraft(s,b[kind]))return failure('unavailable');r.view=kind;return {ok:true};
 },options);}
export function openStainedJob(state,key,options){return mutate(state,r=>{
 const items=ensureMap(r,'items');if(!items)return failure('unavailable');
 if(!own(items,key)){const source=stainedMapRows(r.source?.jobs,validStainedJob).find(s=>s.id===key),copy=r.source?.copy;if(!source||!object(copy)||!text(copy.incomplete)||!text(copy.partDifferent))return failure('unavailable');items[key]={source:{...clone(source),copy:{incomplete:copy.incomplete,partDifferent:copy.partDifferent}},work:emptyWork(source),help:{hint:false,example:false},checks:[],firstKept:null,latestKept:null};}
 const item=items[key];if(!object(item)||!validStainedJob(item.source)||item.source.id!==key||!ensureDraft(item.source,item))return failure('unavailable');r.view='practice';r.currentId=key;return {ok:true};
 },options);}
function editRecord(state,kind,key,fn,options){return mutate(state,(r,next)=>{
 const v=stainedMapView(next),entry=kind==='job'?v.jobs.find(x=>x.id===key):v.tables[key];
 if(!entry||entry.status!=='ready'||entry.draftStatus!=='ready'||kind==='job'&&entry.helpStatus!=='ready')return failure('unavailable');
 return fn(entry.record,entry.source,r);
 },options);}
export function placeStainedCard(state,table,partId,choiceId,options){return editRecord(state,'bench',table,(r,s)=>{
 if(!s.parts.some(p=>p.id===partId)||(choiceId!==null&&!s.choices.some(c=>c.id===choiceId)))return failure('selection');r.work.placements[partId]=choiceId;return {ok:true};
 },options);}
export function answerStainedJob(state,key,partId,choiceId,options){return editRecord(state,'job',key,(r,s)=>{
 if(choiceId!==null&&!s.choices.some(c=>c.id===choiceId))return failure('selection');
 if(s.kind==='choice')r.work.choice=choiceId;else{if(!s.parts.some(p=>p.id===partId))return failure('selection');r.work.placements[partId]=choiceId;}return {ok:true};
 },options);}
export function stainedLabel(label,tile){
 if(!label.stains)return label.before+label.after;
 if(!tile||tile.kind==='none')return label.before+'▢'.repeat(label.stains)+label.after;
 const letters=label.capitalStart?tile.text.charAt(0).toUpperCase()+tile.text.slice(1):tile.text;return label.before+letters+label.after;
}
function mappingOutcome(s,w){const missing=s.parts.some(p=>(pick(w,p.id)??null)===null),different=s.parts.some(p=>(pick(w,p.id)??null)!==null&&pick(w,p.id)!==p.key);return missing?'incomplete':different?'different':'fit';}
export function stainedBenchResult(s,w){
 if(!s||!validStainedWork(s,w))return null;const outcome=mappingOutcome(s,w),c=s.copy,feedback=outcome==='incomplete'?[c.incomplete]:[];
 for(const part of s.parts){const selected=pick(w,part.id)??null;if(selected===null)continue;let line;
  if(s.kind==='map'){const tile=s.choices.find(t=>t.id===selected),fit=selected===part.key;
   line=!part.stains?(fit?c.mapNoneFit:c.mapNoneDifferent):fit?(part.stains===2?c.mapFitTwo:c.mapFitOne):tile.kind==='none'?(part.stains===2?c.mapMissingTwo:c.mapMissingOne):c.mapDifferent;
   feedback.push(stainedLabel(part,null)+': '+line);
  }else if(selected!==part.key)feedback.push(part.word+': '+(s.kind==='histories'?c.historyDifferent:c.familyDifferent));
 }
 if(outcome==='fit')feedback.push(s.kind==='map'?c.mapComplete:c.mappingComplete);
 return {outcome,feedback};
}
export function stainedJobResult(s,w){
 if(!validStainedJob(s)||!validStainedWork(s,w)||!object(s.copy)||!text(s.copy.incomplete)||!text(s.copy.partDifferent))return null;
 const outcome=s.kind==='choice'?(w.choice===null?'incomplete':w.choice===s.key?'fit':'different'):s.parts.some(p=>(pick(w,p.id)??null)===null)?'incomplete':s.parts.some(p=>pick(w,p.id)!==s.key[p.id])?'different':'fit';
 const feedback=outcome==='incomplete'?[s.copy.incomplete]:[];
 if(s.kind==='choice'){if(outcome==='different')feedback.push(own(s.different,w.choice)?s.different[w.choice]:s.copy.partDifferent);}
 else for(const p of s.parts){const selected=pick(w,p.id)??null;if(selected!==null&&selected!==s.key[p.id])feedback.push(p.text+': '+(own(s.different,p.id)?s.different[p.id]:s.copy.partDifferent));}
 if(s.kind==='match'||outcome!=='incomplete')feedback.push(s.explanation);return {outcome,feedback};
}
function checkRecord(state,kind,key,options){return editRecord(state,kind,key,(r,s)=>{
 if(own(r,'checks')&&!Array.isArray(r.checks))return failure('unavailable');const result=kind==='job'?stainedJobResult(s,r.work):stainedBenchResult(s,r.work);if(!result)return failure('unavailable');
 if(!own(r,'checks'))r.checks=[];r.checks.push({work:clone(r.work),...(kind==='job'?{help:clone(r.help)}:{}),...result,supported:true,guided:true});return {ok:true,...result};
 },options);}
export const checkStainedTable=(state,table,options)=>checkRecord(state,'bench',table,options);
export const checkStainedJob=(state,key,options)=>checkRecord(state,'job',key,options);
function keepRecord(state,kind,key,options){return editRecord(state,kind,key,(r,s)=>{
 if(own(r,'latestKept')&&r.latestKept!==null&&!validStainedSnapshot(s,r.latestKept))return failure('unavailable');
 const last=Array.isArray(r.checks)?r.checks.filter(c=>validCheck(s,c)).at(-1):null,snapshot={work:clone(r.work),...(kind==='job'?{help:clone(r.help)}:{}),check:validCheck(s,last)&&sameStainedWork(last.work,r.work)?clone(last):null};
 if(!own(r,'firstKept')||r.firstKept===null)r.firstKept=clone(snapshot);r.latestKept=snapshot;return {ok:true};
 },options);}
export const keepStainedTable=(state,table,options)=>keepRecord(state,'bench',table,options);
export const keepStainedJob=(state,key,options)=>keepRecord(state,'job',key,options);
function restoreRecord(state,kind,key,edition,options){return editRecord(state,kind,key,(r,s)=>{
 if(!['first','latest'].includes(edition))return failure('selection');const snapshot=r[edition+'Kept'];if(!validStainedSnapshot(s,snapshot))return failure('unavailable');r.work=clone(snapshot.work);if(kind==='job')for(const flag of ['hint','example'])r.help[flag] ||= snapshot.help[flag];return {ok:true};
 },options);}
export const restoreStainedTable=(state,table,edition,options)=>restoreRecord(state,'bench',table,edition,options);
export const restoreStainedJob=(state,key,edition,options)=>restoreRecord(state,'job',key,edition,options);
export function useStainedHelp(state,key,flag,options){return editRecord(state,'job',key,r=>{if(!['hint','example'].includes(flag))return failure('selection');if(r.help[flag])return {ok:true,changed:false};r.help[flag]=true;return {ok:true};},options);}
