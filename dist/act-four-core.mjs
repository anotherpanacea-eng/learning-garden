// Spec352: explicit story offers, separate from the learner's evidence and conclusions.
import {storyView} from './keeper-story-core.mjs';
import {actThreeView} from './act-three-core.mjs';
import {ledgerView,validLedgerKeep} from './ledger-gauge-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

export const actFourChapters=Object.freeze(['account','orchard','gazette','meeting']);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k);
const field=(o,k,test)=>!own(o,k)?'missing':test(o[k])?'ready':'unreadable';
const id=x=>typeof x==='string'&&x.length>0&&x.length<=160;
const visitId=x=>typeof x==='string'&&/^ledger-[1-9][0-9]*$/.test(x)&&Number.isSafeInteger(Number(x.slice(7)));
const frame=x=>['short','longer'].includes(x),page=x=>['short','longer','original'].includes(x);
function reference(r){return obj(r)&&visitId(r.visitId)&&['first','latest'].includes(r.edition)&&id(r.sourceId);}
export function validActFourOffer(r,chapter=r?.chapter){
 return chapter==='account'&&obj(r)&&r.kind==='act-four-offer'&&r.version===1&&r.chapter===chapter&&r.activity==='ledger-gauge'&&r.artifactKind==='evidence-note'&&reference(r.ref);
}
function sourceView(state,chapter){
 const result={status:'missing',retainedUnreadable:false,candidates:[]};
 if(chapter!=='account'||!obj(state)||!own(state,'ledgerGauge'))return result;
 const host=ledgerView(state);
 if(host.status==='unavailable')return {...result,status:'unreadable',retainedUnreadable:true};
 result.status='ready';
 for(const [key,work] of Object.entries(host.root.visits)){
  if(!visitId(key)||!obj(work)){result.retainedUnreadable=true;continue;}
  const editions=[];
  for(const [property,edition] of [['firstKept','first'],['kept','latest']]){
   if(!own(work,property))continue;
   const kept=work[property];
   if(!validLedgerKeep(kept)||!id(kept.source.id)){result.retainedUnreadable=true;continue;}
   editions.push({edition,kept});
  }
  // The real keep API creates equal first/latest snapshots on its first keep.
  if(editions.length===2&&JSON.stringify(editions[0].kept)===JSON.stringify(editions[1].kept))editions.shift();
  for(const {edition,kept} of editions){
   const ref={visitId:key,edition,sourceId:kept.source.id};
   result.candidates.push({key:JSON.stringify(['account',key,edition]),chapter:'account',activity:'ledger-gauge',artifactKind:'evidence-note',ref,label:`Evidence note ${key.slice(7)}, ${edition==='first'?'first kept':'latest kept'}`});
  }
 }
 return result;
}
export function actFourCandidates(state,chapter){if(chapter!=='account')return [];try{return sourceView(state,chapter).candidates;}catch{return [];}}
export function actFourView(state){
 const keeper=storyView(state),story=keeper.status==='ready'?keeper.record:null,present=story&&own(story.acts,'IV'),raw=present?story.acts.IV:null,act=obj(raw)?raw:null;
 const status=keeper.status==='unavailable'?'unavailable':!story||!present?'missing':act?'ready':'unreadable';
 const startedStatus=act?field(act,'started',x=>typeof x==='boolean'):'missing',contributionsStatus=act?field(act,'contributions',obj):'missing';
 const started=startedStatus==='ready'&&act.started===true,chapterStatus={},contributions={};
 for(const chapter of actFourChapters){const map=contributionsStatus==='ready'?act.contributions:{};chapterStatus[chapter]=field(map,chapter,r=>validActFourOffer(r,chapter));if(chapterStatus[chapter]==='ready')contributions[chapter]=map[chapter];}
 const writable=keeper.status==='ready'&&['missing','ready'].includes(status),pageVisible=started&&story.seenScenes.includes('harvest-page-revealed');
 const frameAmountStatus=story?field(story,'frameAmount',frame):'missing',pageAmountStatus=story?field(story,'pageAmount',page):'missing';
 const sources=Object.fromEntries(actFourChapters.map(chapter=>{try{return [chapter,sourceView(state,chapter)];}catch{return [chapter,{status:'unreadable',retainedUnreadable:true,candidates:[]}];}}));
 return {status,storyStatus:keeper.status,act:raw,writable,startedStatus,contributionsStatus,started,chapterStatus,contributions,count:Object.keys(contributions).length,sources,
  canStart:writable&&startedStatus!=='unreadable'&&actThreeView(state).pageVisible,canOffer:writable&&started&&contributionsStatus!=='unreadable',pageVisible,
  frameAmountStatus,pageAmountStatus,frameAmount:frameAmountStatus==='ready'?story.frameAmount:'short',pageAmount:pageAmountStatus==='ready'?story.pageAmount:'short'};
}
function mutate(state,options,change){
 if(storyView(state).status!=='ready'||typeof options?.canExport!=='function')return false;
 try{
  const candidate=structuredClone(state);
  if(change(candidate.story)===false||storyView(candidate).status!=='ready'||!recoveryFitsProgressLimits(candidate))return false;
  const proposed=structuredClone(candidate.story);
  if(options.canExport(candidate)!==true)return false;
  state.story=proposed;return true;
 }catch{return false;}
}
export function startActFour(state,options={}){
 const v=actFourView(state);if(v.started)return true;if(!v.canStart)return false;
 return mutate(state,options,story=>{if(!own(story.acts,'IV'))story.acts.IV={started:true,contributions:{}};else{story.acts.IV.started=true;if(!own(story.acts.IV,'contributions'))story.acts.IV.contributions={};}if(!story.seenScenes.includes('harvest-page-revealed'))story.seenScenes.push('harvest-page-revealed');});
}
export function revealHarvestPage(state,options={}){
 const v=actFourView(state);if(v.pageVisible)return true;if(!v.writable||!v.started)return false;
 return mutate(state,options,story=>{if(!story.seenScenes.includes('harvest-page-revealed'))story.seenScenes.push('harvest-page-revealed');});
}
export function offerActFour(state,chapter,key,options={}){
 if(chapter!=='account')return false;const v=actFourView(state);if(v.chapterStatus.account==='ready')return true;if(!v.canOffer||v.chapterStatus.account==='unreadable')return false;
 const found=actFourCandidates(state,chapter).find(c=>c.key===key);if(!found)return false;
 return mutate(state,options,story=>{const a=story.acts.IV;if(!own(a,'contributions'))a.contributions={};a.contributions.account={kind:'act-four-offer',version:1,chapter,activity:found.activity,artifactKind:found.artifactKind,ref:structuredClone(found.ref)};return validActFourOffer(a.contributions.account,chapter);});
}
