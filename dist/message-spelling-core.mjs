import {messageCase} from './message-content.mjs';
import {messageState,currentMessage,chooseMessageCase,setMessageText} from './message-core.mjs';
import {spellingCaseIds,spellingReaders,spellingCopy as T} from './message-spelling-content.mjs';
import {wordListShelfView} from './word-list-shelf-core.mjs';
import {pipsCopyView} from './pips-copy-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const own=(o,k)=>Object.hasOwn(o,k),obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),clone=structuredClone;
const text=x=>typeof x==='string'&&[...x].length<=4000;
const safeId=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(x)&&!['constructor','prototype','toString','valueOf'].includes(x);
const helpKeys=['teaching','reference','audio'];
const freshHelp=reference=>({teaching:false,reference:!!reference,audio:false});
const validHelp=x=>obj(x)&&helpKeys.every(k=>typeof x[k]==='boolean');
const validText=x=>typeof x==='string'&&x.length<=600;
const validSnapshot=x=>obj(x)&&validText(x.text)&&validHelp(x.helpBefore);
export const validSpellingReference=x=>obj(x)&&['word-list-shelf','pips-copy'].includes(x.origin)&&safeId(x.itemId)&&['label','word','clue'].every(k=>text(x[k]));
function validSource(s,id){return obj(s)&&s.caseId===id&&['reader','purpose','question','checkQuestion','contrast'].every(k=>text(s[k]))&&obj(s.teaching)&&text(s.teaching.text)&&Array.isArray(s.teaching.steps)&&s.teaching.steps.length<=4&&s.teaching.steps.every(text);}
function makeSource(id){const c=messageCase(id);return {caseId:id,reader:spellingReaders[id],purpose:c.request,question:c.question,checkQuestion:T.question,teaching:{text:T.teaching,steps:[...T.steps]},contrast:T.contrast};}

// Each sibling is read independently; a malformed optional record never invalidates
// the legacy message notebook, and readers never substitute today's source text.
export function spellingView(state,id){
 const m=messageState(state),work=m?.cases[id]?.post;
 if(!spellingCaseIds.includes(id)||!work)return {status:'missing',work:null,record:null};
 if(!own(work,'spelling'))return {status:'missing',work,record:null};
 const r=work.spelling;
 if(!obj(r)||r.format!==1)return {status:'unreadable',work,record:r};
 const sourceReadable=validSource(r.source,id),referenceReadable=r.reference===null||validSpellingReference(r.reference),helpReadable=validHelp(r.help),firstReadable=r.first===null||validSnapshot(r.first),latestReadable=r.latest===null||validSnapshot(r.latest);
 return {status:sourceReadable&&referenceReadable&&helpReadable&&firstReadable&&latestReadable?'ready':'unreadable',work,record:r,
  source:sourceReadable?r.source:null,reference:referenceReadable?r.reference:null,help:helpReadable?r.help:null,
  first:firstReadable?r.first:null,latest:latestReadable?r.latest:null,
  sourceReadable,referenceReadable,helpReadable,firstReadable,latestReadable};
}
const failure=error=>({ok:false,error});
function edit(state,change,options={}){
 if(!obj(state)||typeof options.canExport!=='function')return failure('capacity');
 try{
  const candidate=clone(state),r=change(candidate);
  if(!r.ok||r.changed===false)return r;
  if(!messageState(candidate)||!recoveryFitsProgressLimits(candidate))return failure('capacity');
  const proposal=clone(candidate.messages);
  if(options.canExport(candidate)!==true)return failure('capacity');
  state.messages=proposal;return r;
 }catch{return failure('capacity');}
}
export function selectSpellingMessage(state,id,options){
 if(!spellingCaseIds.includes(id))return failure('selection');
 return edit(state,c=>chooseMessageCase(c,'post',id)?{ok:true}:failure('unavailable'),options);
}
export function createSpellingMessage(state,id,reference,options){
 if(!spellingCaseIds.includes(id)||!(reference===null||validSpellingReference(reference)))return failure('selection');
 return edit(state,c=>{
  if(!chooseMessageCase(c,'post',id))return failure('unavailable');
  const w=currentMessage(c,'post').work;
  if(own(w,'spelling'))return failure('waiting');
  w.spelling={format:1,source:makeSource(id),reference:clone(reference),help:freshHelp(reference),first:null,latest:null};
  return {ok:true};
 },options);
}
// The guarded shared original handler also serves ordinary Post Office messages.
// It does not create a bridge and does not change Loft/letter adapter semantics.
export function setPostMessageOriginal(state,value,options){
 if(!validText(value))return failure('selection');
 return edit(state,c=>{
  const w=currentMessage(c,'post')?.work;if(!w)return failure('unavailable');
  if(w.original===value)return {ok:true,changed:false};
  return setMessageText(c,'post','original',value)?{ok:true}:failure('unavailable');
 },options);
}
function editBridge(state,id,change,options){return edit(state,c=>{const v=spellingView(c,id);return v.status==='ready'?change(v.record,v.work):failure('unavailable');},options);}
export function noteSpellingHelp(state,id,key,options){
 if(!helpKeys.includes(key))return failure('selection');
 return editBridge(state,id,r=>{
  if(r.help[key])return {ok:true,changed:false};
  if(key==='reference'&&r.reference===null)return failure('selection');
  r.help[key]=true;return {ok:true};
 },options);
}
const sameSnapshot=(a,b)=>!!a&&a.text===b.text&&helpKeys.every(k=>a.helpBefore[k]===b.helpBefore[k]);
export function keepSpellingMessage(state,id,options){return editBridge(state,id,(r,w)=>{
 const snap={text:w.original,helpBefore:clone(r.help)};
 if(sameSnapshot(r.latest,snap))return {ok:true,changed:false};
 if(r.first===null)r.first=clone(snap);
 r.latest=snap;return {ok:true};
},options);}
export function restoreSpellingMessage(state,id,edition,options){
 if(!['first','latest'].includes(edition))return failure('selection');
 return editBridge(state,id,(r,w)=>{
  const snap=r[edition];if(!snap)return failure('unavailable');
  if(w.original===snap.text)return {ok:true,changed:false};
  w.original=snap.text;w.feedback=null;return {ok:true};
 },options);
}

// References are authored material. No placements, selected answers or checks move.
export function wordShelfSpellingReference(state,wordId,trayId){
 const s=wordListShelfView(state).shelf?.source,w=s?.words.find(x=>x.id===wordId),clue=w?.clues.find(x=>x.trayId===trayId),tray=s?.trays.find(x=>x.id===trayId);
 const r=w&&clue&&tray?{origin:'word-list-shelf',itemId:w.id,label:tray.label,word:w.text,clue:clue.note}:null;
 return validSpellingReference(r)?clone(r):null;
}
export function pipsSpellingReference(state,slotId){
 const s=pipsCopyView(state).postcard?.source,slot=s?.parts.find(x=>x.id===slotId),choice=slot?.choices.find(x=>x.id===slot.key);
 if(!choice||!slot.context)return null;
 const r={origin:'pips-copy',itemId:slot.id,label:slot.context.before+choice.text+slot.context.after,word:choice.text,clue:slot.clue};
 return validSpellingReference(r)?r:null;
}

// Pending carries/turns are memory only, never Web Storage or notebook fields.
let sessions=new WeakMap();
export function resetSpellingMessageView(){sessions=new WeakMap();}
export function spellingSession(state,explorerId){
 let s=sessions.get(state);
 if(!s||s.explorerId!==explorerId){s={explorerId,pending:null,turn:'plan',typed:false,step:0,dirty:false,notice:''};sessions.set(state,s);}
 return s;
}
export function stageSpellingReference(state,explorerId,reference){
 if(!validSpellingReference(reference))return false;
 const s=spellingSession(state,explorerId);s.pending=clone(reference);s.turn='plan';s.typed=false;s.notice='';return true;
}
export function spellingReferenceBack(reference){return reference?.origin==='pips-copy'?'#library/copy':'#library/word-list';}
