import {doubleSource} from './willow-double-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const copy=structuredClone,own=(x,k)=>Object.hasOwn(x,k),object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const safe=n=>Number.isSafeInteger(n)&&n>0;
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(x);
const text=x=>typeof x==='string'&&x.trim().length>0&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&new TextEncoder().encode(x).length<=500;
const sourceSize=s=>{try{return new TextEncoder().encode(JSON.stringify(s)).length;}catch{return Infinity;}};
const keys=['intro','predictionPrompt','help','requestMatch','requestMismatch','oneClueInvite','bothClueInvite','neitherClueInvite','talk'];
const connectors=['both','one-or-both'];
const parcel=(source,parcelId)=>source.parcels.find(p=>p.id===parcelId);
const basket=(source,basketId)=>source.baskets.find(b=>b.id===basketId);

export function validDoubleSource(s){
 if(!object(s)||s.version!==1||!id(s.id)||!text(s.request)||!Array.isArray(s.clues)||s.clues.length!==2||!s.clues.every(c=>object(c)&&id(c.id)&&text(c.label)&&text(c.question)&&((c.feature==='stamp'&&['star','circle'].includes(c.value))||(c.feature==='wrap'&&['blue','yellow'].includes(c.value))))||new Set(s.clues.map(c=>c.id)).size!==2||new Set(s.clues.map(c=>c.feature)).size!==2)return false;
 if(!Array.isArray(s.baskets)||s.baskets.length!==2||!s.baskets.every(b=>object(b)&&id(b.id)&&text(b.label))||new Set(s.baskets.map(b=>b.id)).size!==2)return false;
 if(!Array.isArray(s.parcels)||s.parcels.length<1||s.parcels.length>8||!s.parcels.every(p=>object(p)&&id(p.id)&&text(p.title)&&['star','circle'].includes(p.stamp)&&['blue','yellow'].includes(p.wrap))||new Set(s.parcels.map(p=>p.id)).size!==s.parcels.length)return false;
 if(!object(s.requestRule)||!connectors.includes(s.requestRule.connector)||!basket(s,s.requestRule.then)||!basket(s,s.requestRule.else)||s.requestRule.then===s.requestRule.else||!object(s.text)||!keys.every(k=>text(s.text[k])))return false;
 return sourceSize(s)<=12*1024;
}

function sourceKey(s){return JSON.stringify({version:s.version,id:s.id,request:s.request,clues:s.clues.map(c=>[c.id,c.feature,c.value,c.label,c.question]),baskets:s.baskets.map(b=>[b.id,b.label]),parcels:s.parcels.map(p=>[p.id,p.title,p.stamp,p.wrap]),requestRule:[s.requestRule.connector,s.requestRule.then,s.requestRule.else],text:keys.map(k=>s.text[k])});}
export function doubleOutcome(s,connector,parcelId){
 if(!validDoubleSource(s)||!connectors.includes(connector))return null;
 const p=parcel(s,parcelId);if(!p)return null;
 const stampClue=s.clues.find(c=>c.feature==='stamp'),wrapClue=s.clues.find(c=>c.feature==='wrap');
 const stampObserved=p.stamp,wrapObserved=p.wrap,stampYes=stampObserved===stampClue.value,wrapYes=wrapObserved===wrapClue.value;
 const combinedYes=connector==='both'?stampYes&&wrapYes:stampYes||wrapYes;
 const requestYes=s.requestRule.connector==='both'?stampYes&&wrapYes:stampYes||wrapYes;
 const branch=combinedYes?'then':'otherwise',actualBasket=combinedYes?s.requestRule.then:s.requestRule.else,requestedBasket=requestYes?s.requestRule.then:s.requestRule.else;
 return {stampObserved,stampYes,wrapObserved,wrapYes,combinedYes,branch,actualBasket,requestedBasket,matches:actualBasket===requestedBasket};
}

const supportValid=s=>object(s)&&typeof s.helpOpened==='boolean'&&typeof s.together==='boolean';
function checkValid(c){
 if(!object(c)||!safe(c.id)||!validDoubleSource(c.source)||!id(c.parcelId)||!connectors.includes(c.connector)||![null,'unsure',...c.source.baskets.map(b=>b.id)].includes(c.prediction)||!supportValid(c.support)||c.practiceOnly!==true)return false;
 const expected=doubleOutcome(c.source,c.connector,c.parcelId);return !!expected&&Object.keys(expected).every(k=>c[k]===expected[k]);
}
function checksView(r){const readable=[],unreadable=[];let previous=0;for(const [index,check] of r.checks.entries()){if(checkValid(check)&&check.id>previous&&check.id<r.nextCheck){readable.push({index,check});previous=check.id;}else unreadable.push({index,check});}return {readable,unreadable};}
function validRoot(r){return object(r)&&r.version===1&&validDoubleSource(r.source)&&[null,...connectors].includes(r.connector)&&id(r.selectedParcel)&&!!parcel(r.source,r.selectedParcel)&&[null,'unsure',...r.source.baskets.map(b=>b.id)].includes(r.prediction)&&['ready','stamp','wrap','combined','result'].includes(r.phase)&&(r.phase==='ready'||r.connector!==null)&&Array.isArray(r.checks)&&safe(r.nextCheck)&&supportValid(r.support);}
export function doubleView(state){
 if(!own(state,'willowDoubleCheck'))return {status:'missing',root:null,readable:[],unreadable:[]};
 const root=state.willowDoubleCheck;if(!validRoot(root))return {status:'recovery',root,readable:[],unreadable:[]};
 const {readable,unreadable}=checksView(root),last=root.checks.at(-1),resultAvailable=root.phase==='result'&&checkValid(last)&&readable.at(-1)?.index===root.checks.length-1&&last.parcelId===root.selectedParcel&&last.connector===root.connector&&sourceKey(last.source)===sourceKey(root.source);
 return {status:'ready',root,readable,unreadable,resultAvailable,result:resultAvailable?last:null,needsEviction:readable.length>=8,oldest:readable[0]||null};
}
const fresh=()=>({version:1,source:copy(doubleSource),connector:null,selectedParcel:doubleSource.parcels[0].id,prediction:null,phase:'ready',checks:[],nextCheck:1,support:{helpOpened:false,together:false}});
function fits(state,root,canExport){const candidate={...state,willowDoubleCheck:root};try{return recoveryFitsProgressLimits(candidate)&&canExport(candidate)===true;}catch{return false;}}
export function startDouble(state,canExport=()=>true,replace=false){const v=doubleView(state);if(v.status!=='missing'&&!replace)return false;const root=fresh();if(v.status!=='missing')root.retainedRaw=copy(state.willowDoubleCheck);if(!fits(state,root,canExport))return false;state.willowDoubleCheck=root;return true;}
function change(state,canExport,mutate){const v=doubleView(state);if(v.status!=='ready')return false;const root=copy(v.root);if(mutate(root,v)===false||!fits(state,root,canExport))return false;state.willowDoubleCheck=root;return true;}
export function selectDoubleConnector(state,connector,canExport=()=>true){return change(state,canExport,r=>{if(![null,...connectors].includes(connector))return false;r.connector=connector;r.phase='ready';r.prediction=null;});}
export function selectDoubleParcel(state,parcelId,canExport=()=>true){return change(state,canExport,r=>{if(!parcel(r.source,parcelId))return false;r.selectedParcel=parcelId;r.phase='ready';r.prediction=null;});}
export function predictDouble(state,prediction,canExport=()=>true){return change(state,canExport,r=>{if(r.phase!=='ready'||r.connector===null||![null,'unsure',...r.source.baskets.map(b=>b.id)].includes(prediction))return false;r.prediction=prediction;});}
export function restartDouble(state,canExport=()=>true){return change(state,canExport,r=>{r.phase='ready';r.prediction=null;});}
export function supportDouble(state,kind,canExport=()=>true){return change(state,canExport,r=>{if(!['helpOpened','together'].includes(kind))return false;r.support[kind]=true;});}
export function stepDouble(state,canExport=()=>true,confirmedEviction=false){
 return change(state,canExport,(r,v)=>{
  if(r.connector===null||r.phase==='result')return false;
  if(r.phase==='ready'){r.phase='stamp';return true;}
  if(r.phase==='stamp'){r.phase='wrap';return true;}
  if(r.phase==='wrap'){r.phase='combined';return true;}
  if(r.phase!=='combined'||v.needsEviction&&!confirmedEviction)return false;
  const outcome=doubleOutcome(r.source,r.connector,r.selectedParcel);if(!outcome)return false;
  const occupied=new Set(r.checks.map(c=>object(c)&&safe(c.id)?c.id:null));let newId=r.nextCheck;while(occupied.has(newId)&&newId<Number.MAX_SAFE_INTEGER)newId++;
  if(newId>=Number.MAX_SAFE_INTEGER||occupied.has(newId))return false;
  const check={id:newId,source:copy(r.source),parcelId:r.selectedParcel,connector:r.connector,prediction:r.prediction,...outcome,support:copy(r.support),practiceOnly:true};if(!checkValid(check))return false;
  if(v.needsEviction)r.checks.splice(v.oldest.index,1);
  r.checks.push(check);r.nextCheck=newId+1;r.phase='result';return true;
 });
}
export function doubleBasketLabel(source,basketId){return basket(source,basketId)?.label||'basket';}
