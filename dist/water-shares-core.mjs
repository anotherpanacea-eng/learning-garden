import {makeWaterSource,waterFamilies} from './water-shares-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),copy=structuredClone,own=(x,k)=>Object.hasOwn(x,k);
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,79}$/.test(x)&&!['constructor','prototype','tostring','valueof'].includes(x);
const text=(x,n=4000)=>typeof x==='string'&&x.length>0&&x.length<=n,unique=x=>new Set(x).size===x.length;
const integer=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const record=x=>obj(x)&&Object.keys(x).every(id),pages=['meet','build','reader','kept'],outcomes=['missing','total','rows','match'];
export const viewWater=(s,key)=>s.views.find(v=>v.id===key);
export function validWaterSource(s){try{return obj(s)&&s.version===1&&id(s.id)&&text(s.title,200)&&id(s.family)&&integer(s.cups,1,1000)&&
 Array.isArray(s.views)&&s.views.length>=1&&s.views.length<=8&&unique(s.views.map(v=>v?.id))&&s.views.every(v=>obj(v)&&id(v.id)&&text(v.label,200)&&text(v.whole,500)&&text(v.description)&&integer(v.totalHalf,1,2000)&&Array.isArray(v.rows)&&v.rows.length>=1&&v.rows.length<=8&&unique(v.rows.map(r=>r?.id))&&v.rows.every(r=>obj(r)&&id(r.id)&&text(r.label,300)&&text(r.detail)&&integer(r.units,0,v.totalHalf))&&v.rows.reduce((n,r)=>n+r.units,0)===v.totalHalf)&&
 Array.isArray(s.cards)&&s.cards.length>=1&&s.cards.length<=12&&unique(s.cards.map(c=>c?.id))&&s.cards.every(c=>obj(c)&&id(c.id)&&text(c.title,300)&&text(c.text)&&text(c.pictureDescription))&&
 obj(s.copy)&&(s.copy.percent===undefined||text(s.copy.percent))&&['welcome','model','zoom','half','help','example','goal','limit','support','sources'].every(k=>text(s.copy[k]))&&obj(s.copy.checks)&&outcomes.every(k=>text(s.copy.checks[k]))&&
 obj(s.question)&&id(s.question.id)&&!s.views.some(v=>v.id===s.question.id)&&viewWater(s,s.question.view)&&['context','prompt','hint','example','together'].every(k=>text(s.question[k]))&&Array.isArray(s.question.choices)&&s.question.choices.length>=2&&s.question.choices.length<=8&&unique(s.question.choices.map(c=>c?.id))&&s.question.choices.every(c=>obj(c)&&id(c.id)&&text(c.text,1000)&&text(c.feedback))&&s.question.choices.some(c=>c.id===s.question.key)&&
 Array.isArray(s.sources)&&s.sources.length<=8&&s.sources.every(r=>obj(r)&&text(r.label,300)&&text(r.url,1000)&&r.url.startsWith('https://'));}catch{return false;}}
const valuesValid=(s,key,values)=>{const v=viewWater(s,key);return !!v&&record(values)&&Object.entries(values).every(([k,n])=>v.rows.some(r=>r.id===k)&&(n===null||integer(n,0,v.totalHalf)));};
export function valuesWater(w,key=w.view){const v=viewWater(w.source,key),given=w.bars?.[key]??{};return Object.fromEntries(v.rows.map(r=>[r.id,own(given,r.id)?given[r.id]:null]));}
const context=w=>w.page==='reader'?w.source.question.id:w.view;
const kindValid=(s,k)=>['hint','example','together','one','fill','half','percent','zoom','teach','audio','meaning'].includes(k)||s.cards.some(c=>k===`card-${c.id}`);
function helps(h,s){return h===undefined||(obj(h)&&typeof h.observed==='boolean'&&['concept','reading'].every(channel=>Array.isArray(h[channel])&&h[channel].length<=64&&h[channel].every(r=>obj(r)&&(r.forId===s.question.id||viewWater(s,r.forId))&&kindValid(s,r.kind)&&(channel==='reading'?['audio','meaning'].includes(r.kind):!['audio','meaning'].includes(r.kind))))&&h.concept.length+h.reading.length<=64&&unique([...h.concept,...h.reading].map(r=>`${r.forId}:${r.kind}`)));}
const helpFor=(w,key)=>w.help===undefined?undefined:{observed:w.help.observed,concept:copy(w.help.concept.filter(r=>r.forId===key)),reading:copy(w.help.reading.filter(r=>r.forId===key))};
const barsValid=w=>record(w.bars)&&Object.entries(w.bars).every(([key,v])=>valuesValid(w.source,key,v));
const workValid=w=>obj(w)&&validWaterSource(w.source)&&pages.includes(w.page)&&viewWater(w.source,w.view)&&barsValid(w)&&helps(w.help,w.source);
export function waterView(state){
 if(!own(state,'waterShares'))return {status:'ready',root:null,visits:[],work:null};
 const r=state.waterShares;if(!obj(r)||r.version!==1||!obj(r.visits))return {status:'unavailable',root:r,visits:[],work:null};
 const visits=Object.entries(r.visits).map(([key,w])=>({id:key,readable:id(key)&&workValid(w),title:id(key)&&workValid(w)?w.source.question.prompt:'Retained unreadable water visit'}));
 return {status:'ready',root:r,visits,work:id(r.current)&&own(r.visits,r.current)&&workValid(r.visits[r.current])?r.visits[r.current]:null};
}
export function assessWater(s,key,values){const v=viewWater(s,key),missing=v.rows.filter(r=>values[r.id]===undefined||values[r.id]===null).map(r=>r.id),sumHalf=v.rows.reduce((n,r)=>n+(values[r.id]??0),0),wrongRows=v.rows.filter(r=>values[r.id]!==null&&values[r.id]!==undefined&&values[r.id]!==r.units).map(r=>r.id),outcome=missing.length?'missing':sumHalf!==v.totalHalf?'total':wrongRows.length?'rows':'match';return {outcome,sumHalf,missing,wrongRows,feedback:s.copy.checks[outcome]};}
const availability=x=>x===undefined||typeof x==='boolean';
export function validWaterAnswer(a){try{return obj(a)&&validWaterSource(a.source)&&a.itemId===a.source.question.id&&['fits','again'].includes(a.outcome)&&a.source.question.choices.some(c=>c.id===a.choice)&&text(a.feedback)&&helps(a.helpBefore,a.source)&&availability(a.tableAvailable);}catch{return false;}}
export function validWaterSkip(a){try{return obj(a)&&validWaterSource(a.source)&&a.itemId===a.source.question.id&&a.outcome==='skipped'&&helps(a.helpBefore,a.source)&&availability(a.tableAvailable);}catch{return false;}}
const sameSource=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const replyFitsWork=(a,w)=>validWaterAnswer(a)&&a.itemId===w.source.question.id&&sameSource(a.source,w.source);
export function waterReply(w){if(!obj(w.answer))return null;if(own(w.answer,'latest'))return replyFitsWork(w.answer.latest,w)?w.answer.latest:null;return replyFitsWork(w.answer.first,w)?w.answer.first:null;}
const answerSlotReadable=w=>obj(w.answer)&&['first','latest'].every(k=>!own(w.answer,k)||replyFitsWork(w.answer[k],w))&&(!own(w.answer,'skipped')||(validWaterSkip(w.answer.skipped)&&sameSource(w.answer.skipped.source,w.source)));
export const waterReady=w=>w.view===w.source.question.view&&assessWater(w.source,w.view,valuesWater(w)).outcome==='match'&&waterReply(w)?.outcome==='fits';
export function validWaterCheck(r){try{
 if(!obj(r)||!validWaterSource(r.source)||!valuesValid(r.source,r.view,r.values)||!outcomes.includes(r.outcome)||!text(r.feedback)||!helps(r.helpBefore,r.source)||!availability(r.tableAvailable))return false;
 const v=viewWater(r.source,r.view),missing=v.rows.filter(x=>r.values[x.id]===undefined||r.values[x.id]===null).map(x=>x.id),sum=v.rows.reduce((n,x)=>n+(r.values[x.id]??0),0),ids=v.rows.map(x=>x.id);
 if(!Array.isArray(r.missing)||!unique(r.missing)||r.missing.length!==missing.length||!r.missing.every(i=>missing.includes(i))||r.sumHalf!==sum||!Array.isArray(r.wrongRows)||!unique(r.wrongRows)||!r.wrongRows.every(i=>ids.includes(i)))return false;
 return r.outcome===(missing.length?'missing':sum!==v.totalHalf?'total':r.wrongRows.length?'rows':'match');
 }catch{return false;}}
export function validWaterKeep(k){try{return validWaterCheck(k)&&typeof k.fulfilled==='boolean'&&(k.answer===null||validWaterAnswer(k.answer))&&k.fulfilled===(k.outcome==='match'&&k.view===k.source.question.view&&k.answer?.outcome==='fits'&&sameSource(k.answer.source,k.source));}catch{return false;}}
const result=(ok,error)=>error?{ok,error}:{ok};
function change(state,fn,o={}){try{if(waterView(state).status==='unavailable')return result(false,'That earlier format is retained. Download notes; other activities stay open.');const c=copy(state),r=fn(c);if(!r?.ok)return r||result(false,'That change is unavailable.');if(!recoveryFitsProgressLimits(c)||typeof o.canExport!=='function'||o.canExport(c)!==true)return result(false,'This change could not be kept while keeping your notebook exportable. Your earlier work and visible quantities are unchanged.');state.waterShares=c.waterShares;return r;}catch{return result(false,'This change could not be kept safely. Earlier work is unchanged.');}}
const workChange=(s,fn,o)=>change(s,c=>{const w=waterView(c).work;return w?fn(w):result(false,'Open a readable water visit first.');},o);
export function startWater(s,o={}){return change(s,c=>{
 c.waterShares??={version:1,current:null,nextSerial:0,visits:{}};const r=c.waterShares;
 if(Object.keys(r.visits).length>=8)return result(false,'Eight visits are kept. Download notes, then choose and confirm a readable visit to remove if you need space.');
 if(!integer(r.nextSerial,0,999999))return result(false,'The visit counter is retained but cannot allocate a new visit. Earlier readable visits stay open.');
 const source=copy(o.source??makeWaterSource(o.family??waterFamilies[r.nextSerial%waterFamilies.length].id,o.cups??(Math.floor(r.nextSerial/waterFamilies.length)%2?200:100)));
 if(!validWaterSource(source))return result(false,'Choose an available visitor and model size.');
 const key=`water-${r.nextSerial}`;if(own(r.visits,key))return result(false,'That visit id is already kept. Nothing was replaced.');
 r.visits[key]={source,page:'meet',view:source.question.view,bars:Object.fromEntries(source.views.map(v=>[v.id,Object.fromEntries(v.rows.map(row=>[row.id,null]))])),help:{observed:true,concept:[],reading:[]},answer:{},checks:[],kept:[]};r.current=key;r.nextSerial++;return {...result(true),key};
 },o);}
export const resumeWater=(s,key,o={})=>change(s,c=>{const r=c.waterShares;if(!r||!id(key)||!own(r.visits,key)||!workValid(r.visits[key]))return result(false,'That visit stays retained but cannot be opened here.');r.current=key;return result(true);},o);
export function editWater(s,kind,value,o={}){return workChange(s,w=>{
 if(kind==='page'){if(!pages.includes(value))return result(false,'Choose a water turn.');w.page=value;}
 else if(kind==='view'){if(!viewWater(w.source,value))return result(false,'Choose a whole from this source.');w.view=value;}
 else if(kind==='clear')w.bars[w.view]=Object.fromEntries(viewWater(w.source,w.view).rows.map(r=>[r.id,null]));
 else if(kind==='bar'||kind==='step'){
  const v=viewWater(w.source,w.view);if(!obj(value)||!v.rows.some(r=>r.id===value.row))return result(false,'Choose a row from this view.');
  let units=value.units;if(kind==='step'){if(!integer(value.delta,-2000,2000))return result(false,'Choose a whole number of half-cup steps.');units=(valuesWater(w)[value.row]??0)+value.delta;}
  if(units!==null&&!integer(units,0,v.totalHalf))return result(false,'Enter a quantity from zero to this whole, in half-cup steps.');
  w.bars[w.view]??={};w.bars[w.view][value.row]=units;
 }else return result(false,'Choose a water action.');return result(true);
 },o);}
function observe(w,kind,forId=context(w)){
 if(!kindValid(w.source,kind))return result(false,'Choose a support from this source.');
 const h=w.help??{observed:false,concept:[],reading:[]},channel=['audio','meaning'].includes(kind)?'reading':'concept';
 if(!h[channel].some(r=>r.forId===forId&&r.kind===kind)){
  if(h.concept.length+h.reading.length>=64)return result(false,'The support-request notebook is full. Nothing was removed. Download notes or start another visit.');h[channel].push({forId,kind});
 }w.help=h;return result(true);
}
export const supportWater=(s,kind,o={})=>workChange(s,w=>{
 const r=observe(w,kind,['one','fill'].includes(kind)?w.view:context(w));if(!r.ok)return r;
 if(kind==='one'||kind==='fill'){
  const v=viewWater(w.source,w.view),values=valuesWater(w);w.bars[w.view]??={};
  const rows=kind==='fill'?v.rows:[v.rows.find(r=>values[r.id]!==r.units)??v.rows[0]];
  for(const row of rows)w.bars[w.view][row.id]=row.units;
 }return result(true);
 },o);
function graphRecord(w){const values=valuesWater(w),r={source:copy(w.source),view:w.view,values,...assessWater(w.source,w.view,values),tableAvailable:true};if(w.help!==undefined)r.helpBefore=helpFor(w,w.view);return r;}
export const checkWater=(s,o={})=>workChange(s,w=>{
 if(!Array.isArray(w.checks)||w.checks.length>=16)return result(false,'Earlier checks stay kept. Download notes or start another visit for a new check.');const check=graphRecord(w);w.checks.push(check);return {...result(true),check:copy(check)};
 },o);
export function answerWater(s,choice,o={}){return workChange(s,w=>{
 const q=w.source.question,c=q.choices.find(c=>c.id===choice);if(!c)return result(false,'Choose one of this reader’s answers.');
 if(!answerSlotReadable(w))return result(false,'Earlier responses are retained. Start another visitor to answer separately.');
 const a={source:copy(w.source),itemId:q.id,choice,outcome:choice===q.key?'fits':'again',feedback:c.feedback,tableAvailable:true};if(w.help!==undefined)a.helpBefore=helpFor(w,q.id);
 if(!own(w.answer,'first'))w.answer.first=copy(a);else w.answer.latest=copy(a);return {...result(true),answer:copy(a)};
 },o);}
export const skipWater=(s,o={})=>workChange(s,w=>{
 if(!answerSlotReadable(w))return result(false,'Earlier responses are retained. Other diagrams and visitors stay open.');
 const a={source:copy(w.source),itemId:w.source.question.id,outcome:'skipped',tableAvailable:true};if(w.help!==undefined)a.helpBefore=helpFor(w,w.source.question.id);w.answer.skipped=a;return result(true);
 },o);
export const keepWater=(s,o={})=>workChange(s,w=>{
 if(!Array.isArray(w.kept)||w.kept.length>=16)return result(false,'Earlier diagrams stay kept. Download notes or start another visit to keep a new one.');
 const answer=waterReply(w),kept={...graphRecord(w),answer:answer?copy(answer):null,fulfilled:waterReady(w)};w.kept.push(kept);return {...result(true),kept:copy(kept)};
 },o);
export const removeWater=(s,key,confirmed,o={})=>change(s,c=>{const r=c.waterShares;if(confirmed!==true||!r||!id(key)||!own(r.visits,key)||!workValid(r.visits[key]))return result(false,'Choose a readable visit and confirm its removal.');delete r.visits[key];if(r.current===key)r.current=null;return result(true);},o);
