import {RHYTHM_SONG_SOURCE,SONG_UNITS} from './rhythm-song-content.mjs';
import {RHYTHM_MODEL,rhythmNoteById,rhythmSourceById} from './rhythm-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k);
const clone=x=>structuredClone(x);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const SUPPORT=['referenceRequested','responseRequested','exampleShown','teachingShown','feedbackSeen'];
const MAX_ID=1e9;
const visitId=id=>typeof id==='string'&&/^rhythm-[1-9]\d{0,9}$/.test(id)&&Number(id.slice(7))<=MAX_ID;
const array=(a,max)=>Array.isArray(a)&&a.length<=max&&Object.keys(a).length===a.length;
const text=(s,max=500)=>typeof s==='string'&&s.length>0&&s.length<=max;
// Only these stable v1 semantics are consumed from a saved model. Playback
// uses the current bounded sound settings, so unused historic audio metadata
// cannot make an otherwise readable source or kept version disappear.
const model=m=>object(m)&&m.id==='rhythm-four-beat-v1'&&m.beats===4&&m.beatSeconds===.5;
export const validRhythmSequence=s=>array(s,4)&&Array.from(s).every(id=>!!rhythmNoteById(id))&&s.reduce((n,id)=>n+rhythmNoteById(id).beats,0)<=4;
export const readableSupport=s=>object(s)&&SUPPORT.every(k=>own(s,k)&&typeof s[k]==='boolean');
export function readableSource(s){return object(s)&&s.version===1&&text(s.id,160)&&text(s.title)&&text(s.prompt)&&model(s.model)&&(['own','echo'].includes(s.kind))&&(s.kind==='own'?s.target===null:validRhythmSequence(s.target)&&rhythmFacts(s.target).usedBeats===4);}
export function rhythmFacts(sequence){
 if(!validRhythmSequence(sequence))return null;
 const usedBeats=sequence.reduce((n,id)=>n+rhythmNoteById(id).beats,0),rests=sequence.filter(id=>id==='rq').length;
 return {usedBeats,spaceBeats:4-usedBeats,attacks:sequence.length-rests,rests,occupiedSeconds:usedBeats*.5};
}
const facts=f=>object(f)&&['usedBeats','spaceBeats','attacks','rests'].every(k=>Number.isSafeInteger(f[k])&&f[k]>=0&&f[k]<=4)&&[0,.5,1,1.5,2].includes(f.occupiedSeconds);
export const readableAttempt=a=>object(a)&&a.version===1&&readableSource(a.source)&&validRhythmSequence(a.sequence)&&facts(a.facts)&&readableSupport(a.supportBefore)&&typeof a.familiar==='boolean'&&(a.source.kind==='own'?a.outcome===null:['match','different'].includes(a.outcome));
export const readableKeep=k=>object(k)&&k.version===1&&readableSource(k.source)&&validRhythmSequence(k.sequence)&&readableSupport(k.supportBefore);
const freshSupport=()=>Object.fromEntries(SUPPORT.map(k=>[k,false]));
const rootReady=r=>object(r)&&r.version===1&&object(r.visits);
const fresh=()=>({version:1,current:null,next:1,visits:{}});
const currentId=r=>rootReady(r)&&visitId(r.current)&&own(r.visits,r.current)?r.current:null;
const editable=w=>object(w)&&readableSource(w.source)&&validRhythmSequence(w.sequence)&&readableSupport(w.support);
function allocation(r){
 if(!rootReady(r)||!Number.isSafeInteger(r.next)||r.next<1||r.next>MAX_ID||Object.keys(r.visits).length>=24)return null;
 let n=r.next;while(n<=MAX_ID&&own(r.visits,`rhythm-${n}`))n++;
 return n<=MAX_ID?n:null;
}
export function rhythmView(state){
 const present=object(state)&&own(state,'rhythm'),root=present?state.rhythm:null;
 const status=!present?'absent':rootReady(root)?'ready':'unsupported';
 const id=currentId(root),current=id===null?null:root.visits[id];
 const source=readableSource(current?.source)?current.source:null;
 const sequence=validRhythmSequence(current?.sequence)?current.sequence:null;
 const support=readableSupport(current?.support)?current.support:null;
 const visits=object(root?.visits)?Object.entries(root.visits).map(([id,w])=>({id,source:readableSource(w?.source)?w.source:null,editable:rootReady(root)&&visitId(id)&&editable(w)})):[];
 return {status,root,currentId:id,current,source,sequence,support,editable:status==='ready'&&editable(current),readableChecks:Array.isArray(current?.checks)?current.checks.filter(readableAttempt):[],kept:readableKeep(current?.kept)?current.kept:null,visits,canAllocate:status==='absent'||allocation(root)!==null};
}
// Prepare against the complete actual notebook, then commit only the owned root.
// Capture that root before calling the report probe: a callback cannot smuggle
// another destination, or its own changes to the proposed root, into the commit.
function change(state,fn,options={}){
 if(!object(state))return false;
 try{
  const candidate=clone(state),before=JSON.stringify(own(candidate,'rhythm')?candidate.rhythm:undefined);
  const result=fn(candidate);if(result===false)return false;
  const after=own(candidate,'rhythm')?candidate.rhythm:undefined;
  if(before===JSON.stringify(after))return true;
  const proposed=clone(after);
  if(!recoveryFitsProgressLimits(candidate)||typeof options?.canExport==='function'&&options.canExport(candidate)!==true)return false;
  state.rhythm=proposed;return true;
 }catch{return false;}
}
function workChange(state,fn,options){return change(state,c=>{const r=c.rhythm,id=currentId(r);if(!id||!editable(r.visits[id]))return false;return fn(r.visits[id],r);},options);}
export function chooseRhythm(state,id,options={}){
 const currentSource=rhythmView(state).source;
 const source=rhythmSourceById(id)||(options.newVersion&&currentSource?.id===id?currentSource:null);if(!source)return false;
 return change(state,c=>{
  if(!own(c,'rhythm'))c.rhythm=fresh();const r=c.rhythm;if(!rootReady(r))return false;
  if(!options.newVersion){
   const previous=Object.entries(r.visits).reverse().find(([key,w])=>visitId(key)&&editable(w)&&w.source.id===id);
   if(previous){r.current=previous[0];return true;}
  }
  const n=allocation(r);if(n===null)return false;
  const key=`rhythm-${n}`;r.visits[key]={source:clone(source),sequence:[],support:freshSupport(),checks:[],kept:null};r.current=key;r.next=Math.min(n+1,MAX_ID);return true;
 },options);
}
export function selectRhythmVisit(state,id,options={}){return change(state,c=>{const r=c.rhythm;if(!rootReady(r)||!visitId(id)||!own(r.visits,id))return false;r.current=id;return true;},options);}
export function editRhythm(state,action,payload,options={}){
 return workChange(state,w=>{
  const s=w.sequence;
  if(action==='append'){
   if(!rhythmNoteById(payload))return false;const next=[...s,payload];if(!validRhythmSequence(next))return false;w.sequence=next;
  }else if(action==='replace'){
   const i=payload?.index,code=payload?.code;if(!Number.isSafeInteger(i)||i<0||i>=s.length||!rhythmNoteById(code))return false;
   if(s[i]===code)return true;const next=[...s];next[i]=code;if(!validRhythmSequence(next))return false;w.sequence=next;
  }else if(action==='move'){
   const i=payload?.index,d=payload?.delta;if(!Number.isSafeInteger(i)||![-1,1].includes(d)||i<0||i>=s.length||i+d<0||i+d>=s.length)return false;
   if(s[i]===s[i+d])return true;[s[i],s[i+d]]=[s[i+d],s[i]];
  }else if(action==='remove'){
   if(!Number.isSafeInteger(payload)||payload<0||payload>=s.length)return false;s.splice(payload,1);
  }else if(action==='clear'){
   if(!s.length)return true;w.sequence=[];
  }else return false;
  return true;
 },options);
}
export function useRhythmSupport(state,key,options={}){
 if(!SUPPORT.includes(key)||key==='feedbackSeen')return false;
 return workChange(state,w=>{
  if(key==='referenceRequested'&&(w.source.kind!=='echo'||!w.source.target.some(id=>id!=='rq')))return true;
  if(key==='responseRequested'&&!w.sequence.some(id=>id!=='rq'))return true;
  if(key==='exampleShown'&&w.source.kind!=='echo')return false;
  w.support[key]=true;return true;
 },options);
}
// Historical readers are independent of the current clip catalog. New presentation
// eligibility separately ensures the retained source actually describes this file.
export function readableRhythmSong(note){
 const source=note?.source;
 return object(note)&&note.version===1&&note.offered===true&&typeof note.soundRequested==='boolean'&&object(source)&&text(source.id,160)&&text(source.title)&&object(source.model)&&source.model.id==='song-four-beat-eighths-v1'&&source.model.beats===4&&source.model.beatSeconds===.5&&array(source.examples,16)&&source.examples.length>0&&source.examples.every(e=>object(e)&&text(e.id,160)&&array(e.pattern,8)&&e.pattern.length>0&&e.pattern.every(c=>typeof c==='string'&&own(SONG_UNITS,c))&&e.pattern.reduce((n,c)=>n+SONG_UNITS[c],0)===8);
}
export function compatibleRhythmSong(note){return readableRhythmSong(note)&&note.source.id===RHYTHM_SONG_SOURCE.id&&same(note.source.examples.map(e=>e.pattern),RHYTHM_SONG_SOURCE.examples.map(e=>e.pattern));}
export function rhythmSongView(state){
 const r=state?.rhythm,note=r?.song;
 return {status:!object(state)||own(state,'rhythm')&&!rootReady(r)?'unsupported':!own(r||{},'song')?'absent':readableRhythmSong(note)?'ready':'unreadable',note:readableRhythmSong(note)?note:null,compatible:compatibleRhythmSong(note)};
}
export function rhythmSongSnapshot(note){
 if(!readableRhythmSong(note))return null;
 return {version:1,source:{id:note.source.id,title:note.source.title,model:{id:note.source.model.id,beats:note.source.model.beats,beatSeconds:note.source.model.beatSeconds},examples:note.source.examples.map(e=>({id:e.id,pattern:[...e.pattern]}))},offered:true,soundRequested:note.soundRequested};
}
export function offerRhythmSong(state,options={}){
 return change(state,c=>{
  if(!own(c,'rhythm'))c.rhythm=fresh();const r=c.rhythm;if(!rootReady(r))return false;
  if(own(r,'song'))return compatibleRhythmSong(r.song);
  r.song={version:1,source:clone(RHYTHM_SONG_SOURCE),offered:true,soundRequested:false};return true;
 },options);
}
export function requestRhythmSongSound(state,options={}){
 return change(state,c=>{const r=c.rhythm;if(!rootReady(r)||!compatibleRhythmSong(r.song))return false;r.song.soundRequested=true;return true;},options);
}
export function checkRhythm(state,options={}){
 return workChange(state,(w,r)=>{
  if(!own(w,'checks'))w.checks=[];
  if(!array(w.checks,24)||w.checks.length>=24)return false;
  const attempt={version:1,source:clone(w.source),sequence:[...w.sequence],facts:rhythmFacts(w.sequence),outcome:w.source.kind==='echo'?(same(w.sequence,w.source.target)?'match':'different'):null,supportBefore:clone(w.support),familiar:w.checks.some(readableAttempt),songBefore:rhythmSongSnapshot(r.song)};
  w.checks.push(attempt);w.support.feedbackSeen=true;return true;
 },options);
}
export function keepRhythm(state,options={}){
 return workChange(state,(w,r)=>{
  if(!own(w,'kept'))w.kept=null;
  if(w.kept!==null&&(!readableKeep(w.kept)||options.replace!==true))return false;
  const kept={version:1,source:clone(w.source),sequence:[...w.sequence],supportBefore:clone(w.support),songBefore:rhythmSongSnapshot(r.song)};
  if(same(w.kept,kept))return true;w.kept=kept;return true;
 },options);
}
export function rhythmPlaybackPlan(sequence){
 if(!validRhythmSequence(sequence))return null;
 let beat=0;
 const events=sequence.map((code,index)=>{const n=rhythmNoteById(code),start=beat*.5,duration=n.beats*.5,event={index,code,id:code,beat,start,duration,toneSeconds:code==='rq'?0:duration-RHYTHM_MODEL.gap,frequency:code==='rq'?null:RHYTHM_MODEL.frequency};beat+=n.beats;return event;});
 return {modelId:RHYTHM_MODEL.id,duration:sequence.length?2:0,hasSound:sequence.some(id=>id!=='rq'),events,beats:sequence.length?[0,.5,1,1.5]:[]};
}
