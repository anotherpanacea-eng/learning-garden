import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {storyView} from './keeper-story-core.mjs';
import {makeMapReadingSource} from './map-reading-content.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k),clone=x=>structuredClone(x);
const dense=(a,max=Infinity)=>Array.isArray(a)&&a.length<=max&&Object.keys(a).length===a.length&&Array.from(a).every((_,i)=>own(a,i));
const text=(x,max,empty=false)=>typeof x==='string'&&x.length<=max&&(empty||x.trim().length>0);
const code=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!['__proto__','constructor','prototype','toString','valueOf'].includes(x);
const unique=a=>new Set(a).size===a.length;
const FLAGS=['example','comparison','narration','together'];
const freshSupport=()=>Object.fromEntries(FLAGS.map(k=>[k,false]));
const supports=x=>object(x)&&FLAGS.every(k=>own(x,k)&&typeof x[k]==='boolean');
const packetId=x=>typeof x==='string'&&/^map-reading-[1-9]\d{0,9}$/.test(x)&&Number(x.slice(12))<=1e9;
const namedList=(a,max,check)=>dense(a,max)&&unique(a.map(x=>x?.id))&&a.every(x=>object(x)&&code(x.id)&&check(x));

export function readableMapSource(s){
 return object(s)&&code(s.id)&&Number.isSafeInteger(s.version)&&s.version>0&&text(s.title,200)&&
 text(s.notice,1500)&&text(s.limitation,1500)&&['original','short','longer'].every(k=>text(s[k],12000))&&
 namedList(s.lines,12,x=>text(x.text,4000))&&s.lines.length>0&&
 namedList(s.gaps,4,x=>code(x.lineId)&&s.lines.some(l=>l.id===x.lineId))&&s.gaps.length>0;
}
export function mapTeaching(source){
 const t=source?.teaching,keys=['intro','copy','copySupport','gaps','gapSupport','gap1','gap2','gap2Support','retellings','retellingSupport','further','note','noteSupport','keep','exampleTitle'];
 return object(t)&&keys.every(k=>text(t[k],4000))&&dense(t.example,4)&&t.example.length===4&&t.example.every(x=>text(x,4000))?t:null;
}
const field=x=>object(x)&&text(x.text,4000,true)&&supports(x.supportBefore);
function writing(w,s){
 return object(w)&&dense(w.lines,s.lines.length)&&unique(w.lines.map(x=>x?.lineId))&&w.lines.every(x=>field(x)&&s.lines.some(l=>l.id===x.lineId))&&
 dense(w.gaps,s.gaps.length)&&unique(w.gaps.map(x=>x?.gapId))&&w.gaps.every(x=>object(x)&&s.gaps.some(g=>g.id===x.gapId)&&text(x.proposal,4000,true)&&text(x.reason,4000,true)&&supports(x.supportBefore))&&
 (w.comparison===null||field(w.comparison))&&(w.note===null||field(w.note))&&supports(w.support);
}
const format=p=>object(p)&&p.kind==='map-reading'&&p.version===1&&packetId(p.id);
const keptPresent=p=>object(p)&&own(p,'kept')&&p.kept!==null;
const pageVisible=state=>{try{return object(state)&&storyView(state).pageVisible===true;}catch{return false;}};
function data(p){
 const source=readableMapSource(p?.source)?p.source:null;
 const kept=source&&object(p?.kept)&&p.kept.version===1&&writing(p.kept,source)?p.kept:null;
 const draft=source&&!keptPresent(p)&&writing(p,source)?p:null;
 const readable=!!(format(p)&&source&&(kept||draft));
 return {source,kept,writing:kept||draft,readable,mutable:readable&&!keptPresent(p),helper:source?mapTeaching(source):null};
}
function owner(state){
 if(!object(state))return {status:'unsupported',raw:null};
 if(!own(state,'mapReading'))return {status:'absent',raw:[]};
 return {status:dense(state.mapReading)?'ready':'unsupported',raw:state.mapReading};
}
function nextId(raw){
 if(!dense(raw)||raw.length>=24)return null;
 let n=1;for(const p of raw)if(object(p)&&own(p,'id')&&packetId(p.id))n=Math.max(n,Number(p.id.slice(12))+1);
 return n<=1e9?`map-reading-${n}`:null;
}
function find(state,id){const r=owner(state);if(r.status!=='ready'||!packetId(id))return null;const a=r.raw.filter(p=>object(p)&&own(p,'id')&&p.id===id);return a.length===1&&format(a[0])?a[0]:null;}
export function mapReadingView(state,id=null){
 const r=owner(state),raw=Array.isArray(r.raw)?r.raw:[],counts=new Map();
 for(const p of raw)if(object(p)&&own(p,'id')&&packetId(p.id))counts.set(p.id,(counts.get(p.id)||0)+1);
 const packet=find(state,id),d=data(packet);
 return {status:r.status,raw:r.raw,packet,...d,canCreate:r.status!=='unsupported'&&nextId(raw)!==null,
  canStart:pageVisible(state),canRevise:!!d.kept&&nextId(raw)!==null,
  packets:raw.map((p,index)=>{const d=data(p),id=object(p)&&own(p,'id')&&packetId(p.id)?p.id:null,ambiguous=id!==null&&counts.get(id)>1;return {...d,index,id,ambiguous,readable:d.readable&&!ambiguous,mutable:d.mutable&&!ambiguous};})};
}
const fail=error=>({ok:false,changed:false,error});
const ok=(extra={})=>({ok:true,changed:false,...extra});
function write(state,change,options={}){
 if(!object(state)||owner(state).status==='unsupported')return fail('This saved format is retained. Other places stay open.');
 if(typeof options?.canExport!=='function')return fail('This change could not be kept while keeping your notebook exportable.');
 try{
  const candidate=clone(state),before=JSON.stringify(candidate.mapReading),result=change(candidate);
  if(!result?.ok)return result||fail('This edition cannot be changed.');
  if(before===JSON.stringify(candidate.mapReading))return {...result,changed:false};
  if(!dense(candidate.mapReading))return fail('This saved format is retained.');
  // Capture BEFORE the disposable whole-report callback: unrelated or owner
  // changes made by a callback never become notebook writes.
  const proposal=clone(candidate.mapReading);
  if(!recoveryFitsProgressLimits(candidate)||options.canExport(candidate)!==true)return fail('This change could not be kept while keeping your notebook exportable. Your earlier writing is unchanged.');
  state.mapReading=proposal;return {...result,changed:true};
 }catch{return fail('This change could not be kept safely. Your earlier writing is unchanged.');}
}
function add(c,source,work,revisedFrom){
 const r=owner(c),id=nextId(r.raw);
 if(!id)return fail(r.raw.length>=24?'Twenty-four editions are retained. Earlier editions stay open and exportable.':'A new edition could not be started.');
 const p={kind:'map-reading',version:1,id,source:clone(source),...clone(work),kept:null};
 if(revisedFrom!==undefined)p.revisedFrom=revisedFrom;
 if(!data(p).mutable)return fail('This source cannot start an edition.');
 if(!own(c,'mapReading'))c.mapReading=[];
 c.mapReading.push(p);return ok({id});
}
export function startMapReading(state,options={}){
 return write(state,c=>{
  if(!pageVisible(c))return fail('Open the first Keeper’s Page, or choose an arrival with its story context, before starting a new edition.');
  let source;try{source=makeMapReadingSource();}catch{return fail('The map source needs an authoring review before a new edition can start.');}
  return add(c,source,{lines:[],gaps:[],comparison:null,note:null,support:freshSupport()});
 },options);
}
function mutable(state,id,change,options){
 return write(state,c=>{const p=find(c,id),d=data(p);return !d.mutable?fail('This earlier edition is retained and cannot be edited.'):change(p,d);},options);
}
export function keepMapLine(state,id,lineId,value,options={}){
 return mutable(state,id,(p,d)=>{
  if(!d.source.lines.some(l=>l.id===lineId)||!text(value,4000,true))return fail('Choose a source sentence and keep your copy to 4,000 characters. Your visible words are still here.');
  const a={lineId,text:value,supportBefore:clone(p.support)},i=p.lines.findIndex(x=>x.lineId===lineId);
  if(i<0)p.lines.push(a);else p.lines[i]={...p.lines[i],...a};return ok();
 },options);
}
export function keepMapGap(state,id,gapId,proposal,reason,options={}){
 return mutable(state,id,(p,d)=>{
  if(!d.source.gaps.some(g=>g.id===gapId)||!text(proposal,4000,true)||!text(reason,4000,true))return fail('Choose a gap and keep each field to 4,000 characters. Your visible words are still here.');
  const a={gapId,proposal,reason,supportBefore:clone(p.support)},i=p.gaps.findIndex(x=>x.gapId===gapId);
  if(i<0)p.gaps.push(a);else p.gaps[i]={...p.gaps[i],...a};return ok();
 },options);
}
export function keepMapText(state,id,key,value,options={}){
 return mutable(state,id,p=>{
  if(!['comparison','note'].includes(key)||!text(value,4000,true))return fail('Keep this field to 4,000 characters. Your visible words are still here.');
  p[key]={...(object(p[key])?p[key]:{}),text:value,supportBefore:clone(p.support)};return ok();
 },options);
}
export function supportMapReading(state,id,key,options={}){
 return mutable(state,id,(p,d)=>{
  if(!FLAGS.includes(key)||key==='example'&&!d.helper)return fail('That support is not available in this saved edition.');
  p.support[key]=true;return ok();
 },options);
}
export function keepMapEdition(state,id,options={}){
 return mutable(state,id,p=>{p.kept=clone({version:1,lines:p.lines,gaps:p.gaps,comparison:p.comparison,note:p.note,support:p.support});return ok();},options);
}
export function reviseMapEdition(state,id,options={}){
 return write(state,c=>{
  const p=find(c,id),d=data(p);if(!d.readable||!d.kept)return fail('Choose a readable kept edition to revise.');
  const {lines,gaps,comparison,note,support}=d.kept;
  return add(c,d.source,{lines,gaps,comparison,note,support},id);
 },options);
}
