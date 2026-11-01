import {lanternCodeSource} from './lantern-codes-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),copy=structuredClone,own=(o,k)=>Object.hasOwn(o,k);
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,79}$/.test(x)&&!['constructor','prototype','tostring','valueof'].includes(x);
const text=(x,n=3000)=>typeof x==='string'&&x.length<=n,unique=xs=>new Set(xs).size===xs.length;
const record=x=>obj(x)&&Object.keys(x).every(id);
const helpKinds=['help','example','audio','together','trace'];
const helps=x=>Array.isArray(x)&&x.length<=5&&unique(x)&&x.every(k=>helpKinds.includes(k));
const outcomes=['unassigned','invisible','no-card','unlisted','ambiguous','read','read-other'];
export const observe=(pattern,rain)=>rain?pattern.replaceAll('S',''):pattern;
export const beats=(pattern,rules=lanternCodeSource.rules)=>[...pattern].reduce((n,c)=>n+(c==='S'?rules.short:rules.long),0)+Math.max(0,pattern.length-1)*rules.gap;
export function validCodeSource(s){return obj(s)&&s.version===1&&id(s.id)&&s.model==='lamp-code-v1'&&text(s.title,200)&&Array.isArray(s.messages)&&s.messages.length>=1&&s.messages.length<=8&&s.messages.every(m=>obj(m)&&id(m.id)&&text(m.label,200))&&unique(s.messages.map(m=>m.id))&&obj(s.rules)&&Number.isInteger(s.rules.maxFlashes)&&s.rules.maxFlashes>=1&&s.rules.maxFlashes<=8&&['short','long'].every(k=>Number.isInteger(s.rules[k])&&s.rules[k]>=1&&s.rules[k]<=10)&&Number.isInteger(s.rules.gap)&&s.rules.gap>=0&&s.rules.gap<=10&&s.rules.rain==='long-only'&&obj(s.copy)&&['welcome','learn','guided','build','send','compare','help','example','limit','cost','goal'].every(k=>text(s.copy[k]))&&obj(s.copy.outcomes)&&outcomes.every(k=>text(s.copy.outcomes[k]))&&Array.isArray(s.presets)&&s.presets.length<=8&&unique(s.presets.map(p=>p?.id))&&s.presets.every(p=>obj(p)&&id(p.id)&&text(p.title,200)&&validPatterns(s,p.patterns))&&new TextEncoder().encode(JSON.stringify(s)).length<65536;}
export function validPatterns(s,p){return record(p)&&Object.keys(p).length<=16&&Object.entries(p).every(([k,v])=>s.messages.some(m=>m.id===k)&&typeof v==='string'&&v.length<=s.rules.maxFlashes&&/^[SL]*$/.test(v));}
export function decode(s,patterns,card,messageId,rain){
 const raw=patterns[messageId]??'',observed=observe(raw,rain);let outcome,candidates=[];
 if(!raw)outcome='unassigned';else if(!observed)outcome='invisible';else if(card===null)outcome='no-card';else{
  candidates=s.messages.filter(m=>!!card[m.id]&&observe(card[m.id],rain)===observed).map(m=>m.id);
  outcome=candidates.length===0?'unlisted':candidates.length>1?'ambiguous':candidates[0]===messageId?'read':'read-other';
 }
 return {id:messageId,observed,candidates,outcome,feedback:s.copy.outcomes[outcome]};
}
export function assessDesign(s,patterns,rain){const views=s.messages.map(m=>observe(patterns[m.id]??'',rain)),complete=s.messages.every(m=>!!patterns[m.id]);return {complete,works:complete&&views.every(Boolean)&&unique(views),totalBeats:s.messages.reduce((n,m)=>n+beats(patterns[m.id]??'',s.rules),0),views};}
function snapshotValid(k){return obj(k)&&validCodeSource(k.source)&&validPatterns(k.source,k.patterns)&&(k.card===null||validPatterns(k.source,k.card))&&k.source.messages.some(m=>m.id===k.selected)&&typeof k.rain==='boolean';}
function workValid(w){return snapshotValid(w)&&['learn','build','send','compare'].includes(w.page)&&helps(w.support);}
export function validCodeTest(t){
 if(!snapshotValid(t)||!['send','all'].includes(t.kind)||!helps(t.helpBefore)||!Number.isSafeInteger(t.totalBeats)||t.totalBeats<0||!Array.isArray(t.rows))return false;
 const ids=t.source.messages.map(m=>m.id);
 if(t.kind==='send'?(t.rows.length!==1||t.rows[0]?.id!==t.selected):(t.rows.length!==ids.length||!unique(t.rows.map(r=>r?.id))||!ids.every(id=>t.rows.some(r=>r?.id===id))))return false;
 return t.rows.every(r=>obj(r)&&ids.includes(r.id)&&typeof r.observed==='string'&&/^[SL]{0,8}$/.test(r.observed)&&Array.isArray(r.candidates)&&r.candidates.length<=ids.length&&unique(r.candidates)&&r.candidates.every(c=>ids.includes(c))&&outcomes.includes(r.outcome)&&text(r.feedback)&&(['invisible','unassigned'].includes(r.outcome)?r.observed==='':r.observed!=='')&&(r.outcome==='read'?r.candidates.length===1&&r.candidates[0]===r.id:r.outcome==='read-other'?r.candidates.length===1&&r.candidates[0]!==r.id:r.outcome==='ambiguous'?r.candidates.length>1:r.candidates.length===0));
}
export const validKeptCode=k=>snapshotValid(k)&&helps(k.support);
export function codeView(state){
 if(!own(state,'lanternCodes'))return {status:'missing',visits:[],work:null};
 const r=state.lanternCodes;if(!obj(r)||r.version!==1||!obj(r.visits)||!(r.current===null||id(r.current)))return {status:'unavailable',visits:[],work:null};
 const visits=Object.entries(r.visits).map(([key,w])=>({id:key,readable:id(key)&&workValid(w),title:id(key)&&workValid(w)?w.source.title:'Retained unreadable visit'}));
 return {status:'ready',root:r,visits,work:id(r.current)&&own(r.visits,r.current)&&workValid(r.visits[r.current])?r.visits[r.current]:null};
}
const result=(ok,error)=>error?{ok,error}:{ok};
function change(state,fn,o={}){try{if(codeView(state).status==='unavailable')return result(false,'This earlier format is retained. Download notes; other activities stay open.');const c=copy(state),r=fn(c);if(!r?.ok)return r||result(false,'This change is unavailable.');if(!recoveryFitsProgressLimits(c)||typeof o.canExport!=='function'||o.canExport(c)!==true)return result(false,'This change could not be kept and still leave your notebook ready to download. Your earlier work is unchanged.');state.lanternCodes=c.lanternCodes;return r;}catch{return result(false,'This change could not be kept safely. Earlier work is unchanged.');}}
function workChange(state,fn,o){return change(state,s=>{const w=codeView(s).work;return w?fn(w):result(false,'Open a readable code visit first.');},o);}
export function startCodes(state,preset='blank',o={}){return change(state,s=>{
 s.lanternCodes??={version:1,current:null,nextSerial:0,visits:{}};const r=s.lanternCodes;
 if(Object.keys(r.visits).length>=8)return result(false,'Eight visits are kept. Download notes, then choose and confirm a visit to remove if you need space.');
 if(!Number.isSafeInteger(r.nextSerial)||r.nextSerial<0||r.nextSerial>=1000000)return result(false,'The new-visit counter is retained but cannot allocate another visit. Existing readable visits stay open.');
 const source=copy(o.source??lanternCodeSource);if(!validCodeSource(source))return result(false,'That source is retained but cannot create a new copy here.');const usePreset=preset!=='blank'||o.source!==undefined,p=usePreset?source.presets.find(p=>p.id===preset):null;if(usePreset&&!p)return result(false,'Choose a blank code or a ready-made comparison code.');
 const key=`code-${r.nextSerial}`;if(own(r.visits,key))return result(false,'That visit id is already kept. Nothing was replaced.');
 r.visits[key]={source,page:p?'build':'learn',patterns:p?copy(p.patterns):Object.fromEntries(source.messages.map(m=>[m.id,''])),card:null,selected:source.messages[0].id,rain:false,support:[],tests:[],kept:[]};r.current=key;r.nextSerial++;return {...result(true),key};
 },o);}
export const resumeCodes=(s,key,o={})=>change(s,c=>{const r=c.lanternCodes;if(!r||!id(key)||!own(r.visits,key)||!workValid(r.visits[key]))return result(false,'That visit is retained but cannot be opened here.');r.current=key;return result(true);},o);
export function editCodes(s,kind,value,o={}){return workChange(s,w=>{
 if(kind==='page'){if(!['learn','build','send','compare'].includes(value))return result(false,'Choose a turn.');w.page=value;}
 else if(kind==='select'){if(!w.source.messages.some(m=>m.id===value))return result(false,'Choose a message from this card.');w.selected=value;}
 else if(kind==='rain'){if(typeof value!=='boolean')return result(false,'Choose clear or rain.');w.rain=value;}
 else if(kind==='append'){if(!['S','L'].includes(value))return result(false,'Choose Short or Long.');const p=w.patterns[w.selected]??'';if(p.length>=w.source.rules.maxFlashes)return result(false,`This card allows ${w.source.rules.maxFlashes} flashes per message. Remove one before adding another.`);w.patterns[w.selected]=p+value;}
 else if(kind==='pop')w.patterns[w.selected]=(w.patterns[w.selected]??'').slice(0,-1);
 else if(kind==='clear')w.patterns[w.selected]='';else return result(false,'Choose a code action.');return result(true);
 },o);}
export const shareCodes=(s,o={})=>workChange(s,w=>{w.card=copy(w.patterns);return result(true);},o);
export const supportCodes=(s,kind,o={})=>workChange(s,w=>{if(!helpKinds.includes(kind))return result(false,'Choose a support.');if(!w.support.includes(kind))w.support.push(kind);return result(true);},o);
export function runCodeTest(s,kind='send',o={}){return workChange(s,w=>{
 if(!['send','all'].includes(kind))return result(false,'Choose a send or all-message test.');
 if(!Array.isArray(w.tests))return result(false,'The earlier test history is retained but cannot be extended. Start another visit.');
 if(w.tests.length>=24)return result(false,'Twenty-four tests are kept in this visit. Nothing was removed. Try another visit or download notes.');
 if(kind==='send'&&!w.patterns[w.selected])return result(false,'Give this message at least one flash.');
 const rows=(kind==='send'?[w.source.messages.find(m=>m.id===w.selected)]:w.source.messages).map(m=>decode(w.source,w.patterns,w.card,m.id,w.rain));
 const t={source:copy(w.source),patterns:copy(w.patterns),card:copy(w.card),selected:w.selected,rain:w.rain,kind,rows,totalBeats:assessDesign(w.source,w.patterns,w.rain).totalBeats,helpBefore:copy(w.support)};w.tests.push(t);return {...result(true),test:copy(t)};
 },o);}
export const keepCodes=(s,o={})=>workChange(s,w=>{if(!Array.isArray(w.kept)||w.kept.length>=8)return result(false,'The earlier designs stay kept. Download notes or start another visit to keep a new design.');w.kept.push(copy({source:w.source,patterns:w.patterns,card:w.card,selected:w.selected,rain:w.rain,support:w.support}));return result(true);},o);
export const removeCodes=(s,key,confirmed,o={})=>change(s,c=>{const r=c.lanternCodes;if(confirmed!==true||!r||!id(key)||!own(r.visits,key)||!workValid(r.visits[key]))return result(false,'Choose a readable visit and confirm its removal.');delete r.visits[key];if(r.current===key)r.current=null;return result(true);},o);
