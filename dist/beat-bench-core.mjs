// Spec341: printed, supported comparisons. No speech or attainment inference.
import {makeBeatBenchSource} from './beat-bench-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {stainedMapRows,stainedMapCards,validStainedJob,validStainedWork,sameStainedWork,stainedJobResult} from './stained-map-core.mjs';
import {wordListShelfSource,wordListShelfResult,sameWordListPlacements,validWordListCheck,validWordListKeep} from './word-list-shelf-core.mjs';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),clone=structuredClone;
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(x)&&!['constructor','prototype','toString','valueOf'].includes(x);
const text=x=>typeof x==='string'&&x.trim().length>0&&[...x].length<=4000;
const word=x=>text(x)&&[...x].length<=160;
const list=x=>Array.isArray(x)&&x.length<=64;
const sized=x=>{try{return obj(x)&&new TextEncoder().encode(JSON.stringify(x)).length<=96*1024;}catch{return false;}};
const envelope=s=>sized(s)&&s.v===1&&id(s.id);
const help=x=>obj(x)&&typeof x.hint==='boolean'&&typeof x.example==='boolean';
const helpSet=x=>list(x)&&x.every(id)&&new Set(x).size===x.length;
const range=(r,w)=>obj(r)&&Number.isInteger(r.start)&&Number.isInteger(r.end)&&r.start>=0&&r.start<r.end&&r.end<=[...w].length;
const card=c=>obj(c)&&['title','text','example'].every(k=>text(c[k]))&&Array.isArray(c.steps)&&c.steps.length<=4&&c.steps.every(text);
const feedback=x=>Array.isArray(x)&&x.length<=128&&x.every(t=>typeof t==='string'&&[...t].length<=16000);
const pointer={fer:'currentFerId',meanings:'currentMeaningId',practice:'currentJobId'};
const groupList={fer:'fer',meanings:'meanings',practice:'jobs'};
const groups=Object.keys(pointer),views=['choose',...groups,'letters','wall'];
const field=(r,k,valid)=>!obj(r)||!own(r,k)?'missing':valid(r[k])?'ready':'unreadable';
const failure=error=>({ok:false,error});
export function validBeatCase(s){
 if(!validStainedJob(s)||!groups.includes(s.section)||!['title','prompt','guide','contextLabel','pictureId','pictureAlt','hint','example','explanation'].every(k=>text(s[k]))||!s.steps.every(text)||s.teach.length>16||!s.teach.every(card)||!s.parts.every(p=>text(p.text))||!s.choices.every(c=>text(c.text))||!Object.values(s.different).every(text)||!obj(s.copy)||!text(s.copy.incomplete)||!text(s.copy.partDifferent))return false;
 if(s.section==='fer')return ['base','ending'].every(k=>text(s[k]))&&word(s.word)&&range(s.stress,s.word)&&text(s.stress.label)&&text(s.stress.note);
 if(s.section==='meanings')return id(s.pairId)&&word(s.word);
 return true;
}
export const validBeatCheck=(s,c)=>obj(c)&&validStainedWork(s,c.work)&&help(c.help)&&['incomplete','different','fit'].includes(c.outcome)&&feedback(c.feedback)&&c.supported===true&&c.guided===true;
export const validBeatKeep=(s,k)=>obj(k)&&validStainedWork(s,k.work)&&help(k.help)&&(k.check===null||validBeatCheck(s,k.check)&&sameStainedWork(k.work,k.check.work));
function caseEntry(s,r,present){
 const status=!s?'unavailable':!present?'missing':!obj(r)?'unreadable':'ready';
 const draftStatus=status==='ready'?field(r,'work',w=>validStainedWork(s,w)):'missing',helpStatus=status==='ready'?field(r,'help',help):'missing';
 const checksStatus=status==='ready'?field(r,'checks',Array.isArray):'missing',checks=checksStatus==='ready'?r.checks.filter(c=>validBeatCheck(s,c)):[],last=checks.at(-1)??null;
 return {status,source:s,record:present?r:null,draftStatus,helpStatus,checksStatus,checks,last,earlier:!!last&&(draftStatus!=='ready'||!sameStainedWork(r.work,last.work)),firstStatus:status==='ready'?field(r,'firstKept',k=>k===null||validBeatKeep(s,k)):'missing',latestStatus:status==='ready'?field(r,'latestKept',k=>k===null||validBeatKeep(s,k)):'missing',retainedUnreadable:checksStatus==='ready'&&checks.length!==r.checks.length};
}
const summaryKeys=['incomplete','discussion','listedSummary','partialIncomplete','partialDiscussion','partialListed','partial','listed','discuss','unplaced'];
export function beatWallSource(raw){
 const s=wordListShelfSource(raw);
 if(!s||!summaryKeys.every(k=>text(s.copy[k])))return null;
 const trays=s.trays.filter(t=>text(t.label)&&text(t.description));
 let partial=s.partial||trays.length!==s.trays.length;
 const words=s.words.flatMap(w=>{
  const clues=w.clues.filter(c=>text(c.note)&&trays.some(t=>t.id===c.trayId));
  partial ||= clues.length!==w.clues.length;
  return word(w.text)&&clues.length?[{...w,clues,sentence:text(w.sentence)?w.sentence:null}]:[];
 });
 partial ||= words.length!==s.words.length;
 return words.length&&trays.length?{...s,trays,words,partial}:null;
}
const placement=(p,k)=>own(p,k)?p[k]:null;
const wallWork=r=>obj(r)&&obj(r.placements)&&helpSet(r.help);
const wallCheck=c=>validWordListCheck(c)&&c.rows.every(r=>typeof r.feedback==='string'&&[...r.feedback].length<=16000)&&(!own(c,'summary')||typeof c.summary==='string'&&[...c.summary].length<=16000)&&(!own(c,'notice')||typeof c.notice==='string'&&[...c.notice].length<=16000);
const wallKeep=k=>validWordListKeep(k)&&(k.check===undefined||k.check===null||wallCheck(k.check));
function wallEntry(s,r,present){
 const status=!s?'unavailable':!present?'missing':!obj(r)?'unreadable':'ready';
 const draftStatus=status==='ready'&&wallWork(r)?'ready':status==='ready'?'unreadable':'missing';
 const checksStatus=status==='ready'?field(r,'checks',Array.isArray):'missing',checks=checksStatus==='ready'?r.checks.filter(wallCheck):[],last=checks.at(-1)??null;
 const playable=draftStatus==='ready'?s.words.filter(w=>placement(r.placements,w.id)===null||s.trays.some(t=>t.id===placement(r.placements,w.id))):[],opaque=draftStatus==='ready'?s.words.filter(w=>!playable.includes(w)):[];
 const coverage=s?.partial||opaque.length?'partial':'full',sameRows=!!last&&last.rows.length===playable.length&&playable.every(w=>last.rows.filter(row=>row.id===w.id).length===1);
 return {status,source:s,record:present?r:null,draftStatus,helpStatus:status==='ready'?field(r,'help',helpSet):'missing',checksStatus,checks,last,playable,opaque,partial:!!s?.partial||opaque.length>0,earlier:!!last&&(!playable.length||!sameRows||last.coverage!==coverage||!sameWordListPlacements(s,r.placements,last.placements)),firstStatus:status==='ready'?field(r,'firstKept',k=>k===null||wallKeep(k)):'missing',latestStatus:status==='ready'?field(r,'latestKept',k=>k===null||wallKeep(k)):'missing',retainedUnreadable:checksStatus==='ready'&&checks.length!==r.checks.length};
}
function offers(s){
 const bounded=groups.flatMap(g=>list(s?.[groupList[g]])?s[groupList[g]]:[]),counts=new Map();
 for(const c of bounded)if(obj(c)&&id(c.id))counts.set(c.id,(counts.get(c.id)||0)+1);
 return Object.fromEntries(groups.map(g=>[g,list(s?.[groupList[g]])?s[groupList[g]].filter(c=>obj(c)&&counts.get(c.id)===1&&validBeatCase(c)&&c.section===g):[]]));
}
function emptyView(status,root=null){return {status,root,source:null,view:'choose',groups:{fer:[],meanings:[],practice:[]},cases:[],current:null,wall:null,cards:[],letters:[],lookalikes:[]};}
export function beatBenchView(state){
 if(!obj(state)||!own(state,'beatBench'))return emptyView('new');
 const r=state.beatBench;
 if(!obj(r)||r.v!==1||!obj(r.source)||r.source.v!==1)return emptyView('unsupported',r);
 const source=envelope(r.source)?r.source:null,offered=offers(source),recordMap=obj(r.records)&&Object.keys(r.records).length<=64?r.records:null;
 const keys=[...groups.flatMap(g=>offered[g].map(s=>s.id))];
 if(recordMap)for(const k of Object.keys(recordMap))if(id(k)&&!keys.includes(k))keys.push(k);
 const entries=keys.map(key=>{
  const present=!!recordMap&&own(recordMap,key),record=present?recordMap[key]:null,s=present?(obj(record)&&validBeatCase(record.source)&&record.source.id===key?record.source:null):groups.flatMap(g=>offered[g]).find(s=>s.id===key);
  const entry={id:key,stored:present,offered:groups.some(g=>offered[g].some(source=>source.id===key)),...caseEntry(s,record,present)};
  if(own(r,'records')&&!recordMap)entry.status='unreadable';
  return entry;
 });
 const grouped=Object.fromEntries(groups.map(g=>[g,entries.filter(e=>e.source?.section===g)]));
 const view=views.includes(r.view)?r.view:'choose',current=pointer[view]?grouped[view].find(e=>e.id===r[pointer[view]])??null:null;
 const cards=source&&Array.isArray(source.cards)&&source.cards.length<=16?stainedMapCards(source).filter(card):[];
 const letters=source?stainedMapRows(source.letters,c=>word(c.word)&&text(c.sentence)&&range(c.pair,c.word)&&text(c.note)):[];
 const lookalikes=source?stainedMapRows(source.lookalikes,c=>word(c.word)&&word(c.form)&&text(c.note)):[];
 return {status:'ready',root:r,source,view,groups:grouped,cases:entries,current,wall:wallEntry(source?beatWallSource(source.wall):null,r.wall,own(r,'wall')),cards,letters,lookalikes};
}
function mutate(state,fn,options={},create=false){
 if(!obj(state)||typeof options.canExport!=='function')return failure('capacity');
 try{
  const candidate=clone(state);
  if(!own(candidate,'beatBench')){
   if(!create)return failure('unavailable');
   candidate.beatBench={v:1,source:makeBeatBenchSource(),view:'choose',currentFerId:null,currentMeaningId:null,currentJobId:null,records:{}};
  }
  const r=candidate.beatBench;
  if(!obj(r)||r.v!==1||!obj(r.source)||r.source.v!==1)return failure('unavailable');
  const result=fn(r,candidate);
  if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(candidate))return failure('capacity');
  const proposal=clone(r);
  if(options.canExport(candidate)!==true)return failure('capacity');
  state.beatBench=proposal;return result;
 }catch{return failure('capacity');}
}
export function openBeatBench(state,view,options){return mutate(state,(r,candidate)=>{
 if(!views.includes(view))return failure('selection');
 if(view==='wall'){
  const s=beatBenchView(candidate).wall.source;
  if(!s)return failure('unavailable');
  if(!own(r,'wall'))r.wall={currentWordId:s.words[0].id,placements:{},help:[],checks:[]};
 }
 r.view=view;return {ok:true};
 },options,true);}
export function openBeatCase(state,key,options){return mutate(state,(r,candidate)=>{
 if(!id(key))return failure('selection');
 if(!own(r,'records'))r.records={};
 if(!obj(r.records)||Object.keys(r.records).length>64)return failure('unavailable');
 const e=beatBenchView(candidate).cases.find(c=>c.id===key);
 if(!e?.source)return failure('unavailable');
 if(!own(r.records,key)){
  if(Object.keys(r.records).length>=64)return failure('collection');
  r.records[key]={source:clone(e.source),work:e.source.kind==='choice'?{choice:null}:{placements:{}},help:{hint:false,example:false},checks:[]};
 }
 r.view=e.source.section;r[pointer[e.source.section]]=key;return {ok:true};
 },options,true);}
function editCase(state,key,fn,options){return mutate(state,(r,candidate)=>{
 const e=beatBenchView(candidate).cases.find(c=>c.id===key);
 if(!e||e.status!=='ready'||e.draftStatus!=='ready'||e.helpStatus!=='ready')return failure('unavailable');
 return fn(e.record,e.source,e,r);
 },options);}
export function answerBeatCase(state,key,choice,partId,options){return editCase(state,key,(r,s)=>{
 if(choice!==null&&!s.choices.some(c=>c.id===choice))return failure('selection');
 if(s.kind==='choice')r.work.choice=choice;
 else{if(!s.parts.some(p=>p.id===partId))return failure('selection');r.work.placements[partId]=choice;}
 return {ok:true};
 },options);}
export function useBeatHelp(state,key,flag,options){return editCase(state,key,r=>{
 if(!['hint','example'].includes(flag))return failure('selection');
 if(r.help[flag])return {ok:true,changed:false};
 r.help[flag]=true;return {ok:true};
 },options);}
export function checkBeatCase(state,key,options){return editCase(state,key,(r,s,e)=>{
 if(e.checksStatus==='unreadable')return failure('unavailable');
 const result=stainedJobResult(s,r.work);if(!result)return failure('unavailable');
 r.checks??=[];r.checks.push({work:clone(r.work),help:clone(r.help),...result,supported:true,guided:true});return {ok:true,...result};
 },options);}
export function keepBeatCase(state,key,options){return editCase(state,key,(r,s,e)=>{
 if(e.latestStatus==='unreadable')return failure('unavailable');
 const k={work:clone(r.work),help:clone(r.help),check:e.last&&!e.earlier?clone(e.last):null};
 if(!own(r,'firstKept')||r.firstKept===null)r.firstKept=clone(k);
 r.latestKept=k;return {ok:true};
 },options);}
export function restoreBeatCase(state,key,edition,options){return editCase(state,key,(r,s)=>{
 if(!['first','latest'].includes(edition))return failure('selection');
 const k=r[edition+'Kept'];if(!validBeatKeep(s,k))return failure('unavailable');
 r.work=clone(k.work);for(const flag of ['hint','example'])r.help[flag] ||= k.help[flag];return {ok:true};
 },options);}
export function skipBeatCase(state,key,options){return mutate(state,(r,candidate)=>{
 const v=beatBenchView(candidate),e=v.cases.find(c=>c.id===key);
 if(!e?.source||r.view!==e.source.section||r[pointer[e.source.section]]!==key)return failure('selection');
 r.view='choose';return {ok:true};
 },options);}
function editWall(state,fn,options){return mutate(state,(r,candidate)=>{
 const e=beatBenchView(candidate).wall;
 if(e?.status!=='ready'||e.draftStatus!=='ready'||!e.playable.length)return failure('unavailable');
 return fn(e.record,e.source,e,r);
 },options);}
export function selectBeatWallWord(state,key,options){return editWall(state,(r,s)=>{
 if(!s.words.some(w=>w.id===key))return failure('selection');
 r.currentWordId=key;return {ok:true};
 },options);}
export function placeBeatWallCard(state,key,trayId,options){return editWall(state,(r,s,e)=>{
 if(!e.playable.some(w=>w.id===key)||trayId!==null&&!s.trays.some(t=>t.id===trayId))return failure('selection');
 r.placements[key]=trayId;return {ok:true};
 },options);}
export function useBeatWallHelp(state,flag,options){return editWall(state,(r,s,e,root)=>{
 if(!['hint','example'].includes(flag)||!text(root.source.wall?.help?.[flag]))return failure('selection');
 if(r.help.includes(flag))return {ok:true,changed:false};
 if(r.help.length>=64)return failure('collection');
 r.help.push(flag);return {ok:true};
 },options);}
export function checkBeatWall(state,options){return editWall(state,(r,s,e)=>{
 if(e.checksStatus==='unreadable')return failure('unavailable');
 const result=wordListShelfResult(s,r);if(!result)return failure('unavailable');
 r.checks??=[];r.checks.push(result);return {ok:true,...result};
 },options);}
export function keepBeatWall(state,options){return editWall(state,(r,s,e)=>{
 if(e.latestStatus==='unreadable')return failure('unavailable');
 const k={placements:clone(r.placements),helpBefore:clone(r.help),check:e.last&&!e.earlier?clone(e.last):null};
 if(!own(r,'firstKept')||r.firstKept===null)r.firstKept=clone(k);
 r.latestKept=k;return {ok:true};
 },options);}
export function restoreBeatWall(state,edition,options){return editWall(state,(r,s,e)=>{
 if(!['first','latest'].includes(edition))return failure('selection');
 const k=r[edition+'Kept'];if(!wallKeep(k))return failure('unavailable');
 for(const w of e.playable){const p=placement(k.placements,w.id);if(p===null||s.trays.some(t=>t.id===p))r.placements[w.id]=clone(p);}
 return {ok:true};
 },options);}
