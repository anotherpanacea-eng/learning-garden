import {makeSeedSource} from './seed-exchange-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
// Original frozen model and local notebook handling under spec316.
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const text=(x,max)=>typeof x==='string'&&x.length>0&&x.length<=max;
const family=x=>['apples','reed','nursery'].includes(x);
export function validSeedModel(s){
 if(!object(s)||!family(s.family)||!int(s.size,1,12))return false;
 if(s.family==='nursery')return s.basketRate===null&&s.reedRate===null&&s.stock===null&&s.givenSide==='seedlings'&&Array.isArray(s.parts)&&s.parts.length===2&&s.parts.every(x=>int(x,1,12))&&int(s.total,1,200)&&s.total===(s.parts[0]+s.parts[1])*s.size;
 if(s.parts!==null||s.total!==null||!int(s.basketRate,1,12)||!int(s.reedRate,1,12)||!int(s.stock,1,200)||s.givenSide!==(s.family==='apples'?'baskets':'bundles'))return false;
 const cost=s.family==='apples'?s.basketRate:s.reedRate;
 return Math.floor(s.stock/cost)===s.size;
}
export function validSeedSource(s){
 return validSeedModel(s)&&s.format===1&&object(s.labels)&&['send','receive','left','shortage','seedLeft'].every(k=>text(s.labels[k],120))&&Array.isArray(s.labels.towns)&&s.labels.towns.length===2&&s.labels.towns.every(x=>text(x,80))&&text(s.id,80)&&/^[a-z][a-z0-9-]*$/.test(s.id)&&['title','prompt','notice','rule','hint'].every(k=>text(s[k],3200))&&
  validSeedModel(s.example)&&s.example.family===s.family&&s.example.size!==s.size&&Array.isArray(s.example.steps)&&s.example.steps.length>=1&&s.example.steps.length<=6&&s.example.steps.every(x=>text(x,1600))&&
  object(s.feedback)&&['match','few','many'].every(k=>text(s.feedback[k],3200));
}
export function seedFingerprint(s){
 return validSeedModel(s)?JSON.stringify([s.format??1,s.family,s.basketRate,s.reedRate,s.parts,s.givenSide,s.stock,s.total]):null;
}
export function seedModel(s,draft){
 if(!validSeedModel(s)||!object(draft))return null;
 if(s.family==='nursery'){
  const value=draft.partValue;if(!int(value,0,12))return null;
  const shares=s.parts.map(n=>n*value),used=shares[0]+shares[1],difference=s.total-used;
  return {family:s.family,value,parts:[...s.parts],shares,used,stock:s.total,left:Math.max(0,difference),shortage:Math.max(0,-difference),fits:difference===0,relation:difference===0?'match':difference>0?'few':'many'};
 }
 const groups=draft.groups;if(!int(groups,0,12))return null;
 const apples=s.family==='apples',spend=apples?s.basketRate:s.reedRate,gain=apples?s.reedRate:s.basketRate,used=groups*spend,difference=s.stock-used,fits=groups===s.size;
 return {family:s.family,groups,spend,gain,used,received:groups*gain,stock:s.stock,sendUnit:apples?'baskets':'bundles',receiveUnit:apples?'bundles':'baskets',left:Math.max(0,difference),shortage:Math.max(0,-difference),fits,relation:fits?'match':difference>=spend?'few':'many'};
}

const own=(x,k)=>Object.hasOwn(x,k),clone=x=>structuredClone(x),string=(x,max)=>typeof x==='string'&&x.length<=max;
const serial=id=>typeof id==='string'&&/^exchange-[1-9][0-9]{0,8}$/.test(id)&&int(Number(id.slice(9)),1,999999998)?Number(id.slice(9)):null;
const rootShape=r=>object(r)&&r.version===1&&object(r.visits)&&Object.keys(r.visits).length<=12;
const help=h=>object(h)&&typeof h.hint==='boolean'&&typeof h.example==='boolean';
const construction=d=>object(d)&&(int(d.groups,0,12)||int(d.partValue,0,12));
const check=c=>object(c)&&construction(c.draft)&&['match','different'].includes(c.outcome)&&c.supported===true&&help(c.helpBefore)&&text(c.feedback,3200);
export const validSeedWork=w=>object(w)&&validSeedSource(w.source)&&!!seedModel(w.source,w.draft)&&string(w.ownNote,1200)&&help(w.help)&&(w.ready===undefined||typeof w.ready==='boolean')&&Array.isArray(w.checks)&&w.checks.length<=24&&w.checks.every(check);
const list=l=>Array.isArray(l)&&l.length<=5&&l.every(x=>object(x)&&text(x.label,120)&&int(x.value,0,288)&&['baskets','bundles','seedlings'].includes(x.unit));
export const validSeedSnapshot=k=>object(k)&&k.format===1&&validSeedWork(k)&&list(k.list)&&['working','fits'].includes(k.status);
const work=(r,key)=>rootShape(r)&&serial(key)&&own(r.visits,key)&&validSeedWork(r.visits[key])?r.visits[key]:null;
export const sameSeedConstruction=(s,a,b)=>s.family==='nursery'?a.partValue===b.partValue:a.groups===b.groups;
export function seedReady(w){if(!validSeedWork(w)||w.ready!==true)return false;const last=w.checks.at(-1);return !!last&&last.outcome==='match'&&sameSeedConstruction(w.source,w.draft,last.draft);}
export function seedCourierList(s,draft){
 const m=seedModel(s,draft);if(!m||!object(s.labels))return [];
 const unit=s.family==='nursery'?'seedlings':m.sendUnit,tail={label:m.shortage?s.labels.shortage:s.family==='nursery'?s.labels.seedLeft:s.labels.left,value:m.shortage||m.left,unit};
 return s.family==='nursery'?[...m.shares.map((value,i)=>({label:`Seedlings for ${s.labels.towns[i]}`,value,unit})),tail]:[{label:s.labels.send,value:m.used,unit:m.sendUnit},{label:s.labels.receive,value:m.received,unit:m.receiveUnit},tail];
}
export function seedSuggestion(state,selectedFamily){
 const r=state?.seedExchange,groups=new Map();
 if(rootShape(r))for(const [key,w]of Object.entries(r.visits)){
  const n=serial(key);if(!n||!validSeedWork(w)||w.source.family!==selectedFamily||!w.checks.length)continue;
  const fp=seedFingerprint(w.source),g=groups.get(fp);
  if(!g)groups.set(fp,{newest:n,earliest:n,w});else{g.newest=Math.max(g.newest,n);if(n<g.earliest){g.earliest=n;g.w=w;}}
 }
 const recent=[...groups.values()].sort((a,b)=>b.newest-a.newest).slice(0,3);
 if(!recent.length)return {size:1,reason:'new',count:0};
 const first=g=>g.w.checks[0],assisted=c=>c.helpBefore.hint||c.helpBefore.example,last=recent[0].w.source.size;
 if(first(recent[0]).outcome==='different'||assisted(first(recent[0])))return {size:Math.max(1,last-1),reason:'smaller',count:recent.length};
 if(recent.length===3&&recent.every(g=>first(g).outcome==='match'&&!assisted(first(g))))return {size:Math.min(12,last+1),reason:'more',count:3};
 return {size:last,reason:'same',count:recent.length};
}
export function seedExchangeView(state){
 if(!own(state,'seedExchange'))return {status:'new',work:null,visits:[],canCreate:true,reason:'',familiar:false};
 const r=state.seedExchange;
 if(!rootShape(r))return {status:'unsupported',work:null,visits:[],canCreate:false,reason:'unavailable',familiar:false};
 const visits=Object.entries(r.visits).map(([key,w])=>({id:key,readable:!!serial(key)&&validSeedWork(w),source:serial(key)&&validSeedWork(w)?w.source:null})),w=work(r,r.currentId);
 const reason=typeof r.currentId!=='string'?'unavailable':Object.keys(r.visits).length>=12?'visit-cap':!int(r.nextSerial,1,999999998)?'counter':own(r.visits,`exchange-${r.nextSerial}`)?'collision':r.nextSerial<=Math.max(0,...Object.keys(r.visits).map(k=>serial(k)||0))?'counter':'';
 return {status:'ready',work:w,visits,canCreate:!reason,reason,familiar:!!w&&visits.some(v=>v.readable&&serial(v.id)<serial(r.currentId)&&seedFingerprint(v.source)===seedFingerprint(w.source))};
}
const fail=error=>({ok:false,error});
function change(state,fn,options={}){
 try{const next=clone(state),result=fn(next);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(next)||options.canExport&&!options.canExport(next))return fail('unexportable');
  state.seedExchange=next.seedExchange;return result;
 }catch{return fail('unexportable');}
}
function edit(state,fn,options){return change(state,next=>{const r=next.seedExchange,w=work(r,r?.currentId);if(!w)return fail('unavailable');const result=fn(w);return !result.ok||validSeedWork(w)?result:fail('unavailable');},options);}
export function startSeedExchange(state,selection={},options){return change(state,next=>{
 if(!own(next,'seedExchange'))next.seedExchange={version:1,nextSerial:1,currentId:'',visits:{}};
 const r=next.seedExchange,v=seedExchangeView(next);if(!v.canCreate)return fail(v.reason);
 const source=makeSeedSource(r.nextSerial,selection);if(!source||!validSeedSource(source))return fail('selection');
 const id=`exchange-${r.nextSerial}`;r.visits[id]={source:clone(source),draft:source.family==='nursery'?{partValue:0}:{groups:0},ownNote:'',help:{hint:false,example:false},ready:false,checks:[]};r.currentId=id;r.nextSerial++;return {ok:true,id};
 },options);}
export function openSeedExchange(state,id,options){return change(state,next=>{const r=next.seedExchange;if(!work(r,id))return fail('unavailable');if(r.currentId===id)return {ok:true,changed:false};r.currentId=id;return {ok:true};},options);}
export function setSeedMaterial(state,value,options){return edit(state,w=>{
 if(!int(value,0,12))return fail('material');const key=w.source.family==='nursery'?'partValue':'groups';if(w.draft[key]===value)return {ok:true,changed:false};w.draft[key]=value;w.ready=false;return {ok:true};
 },options);}
export function setSeedNote(state,note,options){return edit(state,w=>{if(!string(note,1200))return fail('note-length');if(w.ownNote===note)return {ok:true,changed:false};w.ownNote=note;return {ok:true};},options);}
export function showSeedHelp(state,kind,options){return edit(state,w=>{if(!['hint','example'].includes(kind))return fail('selection');if(w.help[kind])return {ok:true,changed:false};w.help[kind]=true;return {ok:true};},options);}
export function checkSeedExchange(state,options){return edit(state,w=>{
 if(w.checks.length>=24)return fail('check-cap');const m=seedModel(w.source,w.draft),record={draft:clone(w.draft),outcome:m.fits?'match':'different',supported:true,helpBefore:clone(w.help),feedback:w.source.feedback[m.relation]};
 w.checks.push(record);w.ready=m.fits;return {ok:true,record:clone(record)};
 },options);}
export function keepSeedExchange(state,options){return edit(state,w=>{
 if(['firstKept','latestKept'].some(k=>own(w,k)&&!validSeedSnapshot(w[k])))return fail('kept-unavailable');
 const snapshot={format:1,source:clone(w.source),draft:clone(w.draft),ownNote:w.ownNote,help:clone(w.help),ready:seedReady(w),checks:clone(w.checks),list:seedCourierList(w.source,w.draft),status:seedReady(w)?'fits':'working'};
 if(!own(w,'firstKept'))w.firstKept=clone(snapshot);
 w.latestKept={...(w.latestKept?clone(w.latestKept):{}),...snapshot};return {ok:true};
 },options);}
export function removeSeedExchange(state,id,confirmed,options){if(confirmed!==true)return fail('confirmation');return change(state,next=>{const r=next.seedExchange;if(!work(r,id))return fail('unavailable');delete r.visits[id];if(r.currentId===id)r.currentId='';return {ok:true};},options);}
