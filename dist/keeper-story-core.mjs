import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {keeperPageAmounts} from './keeper-story-content.mjs';
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const own=(o,key)=>Object.hasOwn(o,key);
const safeCount=(n,max=1000000000)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
const code=v=>typeof v==='string'&&v.length<=160;
const clone=v=>structuredClone(v);
export function freshStory(){return {version:1,opening:'fresh',arrival:'storm',acts:{},seenScenes:[]};}
function returningStory(){return {version:1,opening:'returning',acts:{},seenScenes:[]};}
function supportedStory(s){
 return object(s)&&s.version===1&&['fresh','returning'].includes(s.opening)&&(!own(s,'arrival')||['storm','mended','letter'].includes(s.arrival))&&object(s.acts)&&Array.isArray(s.seenScenes)&&s.seenScenes.length<=10000&&s.seenScenes.every(code);
}
// Context belongs to an explicit choice, never the default structural storm.
// This helper deliberately reads no activity root and does not call storyView.
export function storyArrivalContext(state){
 const present=object(state)&&own(state,'story'),s=present?state.story:null;
 const base={status:'missing',decisionStatus:'missing',choice:null,canChoose:true,reason:'eligible',hasStoryProgress:false,inheritedActI:false,inheritedActII:false,inheritedPageOne:false,inheritedPageTwo:false,inheritedLetter:false};
 if(!present)return base;
 if(!supportedStory(s))return {...base,status:'unavailable',decisionStatus:'unreadable',canChoose:false,reason:'unavailable'};
 const hasStoryProgress=Object.keys(s.acts).length>0||s.seenScenes.length>0,common={...base,status:'ready',hasStoryProgress};
 if(s.arrivalChosen===true&&own(s,'arrival')){const later=s.arrival!=='storm',letter=s.arrival==='letter';return {...common,decisionStatus:'chosen',choice:s.arrival,canChoose:false,reason:'chosen',inheritedActI:later,inheritedActII:letter,inheritedPageOne:later,inheritedPageTwo:letter,inheritedLetter:letter};}
 if(own(s,'arrivalChosen')&&s.arrivalChosen!==false||own(s,'arrival')&&s.arrival!=='storm')return {...common,decisionStatus:'unreadable',canChoose:false,reason:'unreadable'};
 return {...common,decisionStatus:'undecided',canChoose:!hasStoryProgress,reason:hasStoryProgress?'progress':'eligible'};
}
function validSupper(s,served){return object(s)&&Number.isSafeInteger(s.round)&&s.round>=1&&s.round<=166666667&&safeCount(s.startedAtServed)&&s.startedAtServed<=served;}
function readableReceipt(r){return object(r)&&r.kind==='cafe-first-supper'&&r.version===1&&safeCount(r.served)&&(!own(r,'supper')||validSupper(r.supper,r.served));}
// A successful table service owns this cumulative counter. No answer, hint, film or bounded history is read.
export function firstSupperReceipt(state){
 const c=state?.cafe;if(!object(c)||c.version!==1||!safeCount(c.served)||c.served<6)return null;
 const receipt={kind:'cafe-first-supper',version:1,served:c.served};
 if(validSupper(c.supper,c.served))receipt.supper={round:c.supper.round,startedAtServed:c.supper.startedAtServed};
 return receipt;
}
export function storyView(state){
 const present=object(state)&&own(state,'story'),record=present?state.story:null,receipt=firstSupperReceipt(state),arrival=storyArrivalContext(state);
 const base={record,opening:'returning',parcelFound:false,parcelAvailable:false,oldMapRevealed:false,actIStatus:'missing',actI:null,receiptStatus:'missing',ended:false,receipt,eligible:receipt!==null,pageReady:false,pageVisible:false,pageAmount:'short',inheritedActI:arrival.inheritedActI,inheritedActII:arrival.inheritedActII,inheritedPageOne:arrival.inheritedPageOne,inheritedPageTwo:arrival.inheritedPageTwo,inheritedLetter:arrival.inheritedLetter};
 if(!present)return {status:'missing',...base};
 if(!supportedStory(record))return {status:'unavailable',...base};
 const hasAct=own(record.acts,'I'),act=hasAct?record.acts.I:null,known=object(act)&&typeof act.ended==='boolean';
 const ended=known&&act.ended===true,parcelFound=record.seenScenes.includes('parcel-found'),oldMapRevealed=record.seenScenes.includes('old-map-revealed')||record.seenScenes.includes('inherited-map-read'),eligible=ended||receipt!==null,pageReady=arrival.inheritedPageOne||parcelFound&&eligible;
 return {status:'ready',...base,opening:record.opening,parcelFound,parcelAvailable:parcelFound||arrival.inheritedPageOne,oldMapRevealed,actIStatus:hasAct?known?'ready':'unreadable':'missing',actI:act,receiptStatus:known&&own(act,'receipt')?readableReceipt(act.receipt)?'ready':'unreadable':'missing',ended,eligible,pageReady,pageVisible:pageReady&&oldMapRevealed,pageAmount:keeperPageAmounts.includes(record.pageAmount)?record.pageAmount:'short'};
}
function canChange(state){return ['missing','ready'].includes(storyView(state).status);}
function mutate(state,options,fn){
 if(!object(state)||!canChange(state))return false;
 try{
  const candidate=clone(state);if(!own(candidate,'story'))candidate.story=returningStory();
  if(fn(candidate)===false||!supportedStory(candidate.story)||!recoveryFitsProgressLimits(candidate)||typeof options?.canExport==='function'&&options.canExport(candidate)!==true)return false;
  state.story=candidate.story;return true;
 }catch{return false;}
}
function captureInto(candidate){
 const v=storyView(candidate);if(v.status!=='ready'||!v.receipt||v.actIStatus==='unreadable')return false;
 if(v.ended)return true;
 const previous=v.actIStatus==='ready'?candidate.story.acts.I:{};
 candidate.story.acts.I={...previous,ended:true,receipt:clone(v.receipt)};return true;
}
// Existing reached endings stay reached even if their old provenance is absent or unknown.
export function captureFirstSupper(state,options={}){
 const v=storyView(state);if(v.status==='unavailable'||v.actIStatus==='unreadable')return false;
 if(v.ended)return true;
 if(!v.receipt)return false;
 return mutate(state,options,candidate=>captureInto(candidate));
}
export function keepParcel(state,options={}){
 const v=storyView(state);if(v.status==='unavailable')return false;
 if(v.parcelAvailable)return true;
 return mutate(state,options,candidate=>{
  candidate.story.seenScenes.push('parcel-found');
  const current=storyView(candidate);if(current.receipt&&current.actIStatus!=='unreadable')captureInto(candidate);
  return true;
 });
}
export function revealOldMap(state,options={}){
 const v=storyView(state);if(v.status!=='ready'||!v.pageReady)return false;
 if(v.oldMapRevealed)return true;
 if(v.inheritedPageOne)return mutate(state,options,candidate=>{candidate.story.seenScenes.push('inherited-map-read');});
 return mutate(state,options,candidate=>{
  candidate.story.seenScenes.push('old-map-revealed');
  const current=storyView(candidate);if(current.receipt&&current.actIStatus!=='unreadable')captureInto(candidate);
  return true;
 });
}
export function setPageAmount(state,amount,options={}){
 const v=storyView(state);if(v.status!=='ready'||!v.pageVisible||!keeperPageAmounts.includes(amount))return false;
 if(v.record.pageAmount===amount)return true;
 return mutate(state,options,candidate=>{candidate.story.pageAmount=amount;return true;});
}
