// Spec326: explicit story contributions, never an assessment of the host work.
import {storyView} from './keeper-story-core.mjs';
import {actTwoView,seasonForMonth} from './act-two-core.mjs';
import {validSeedSnapshot} from './seed-exchange-core.mjs';
import {validWalkSource} from './courier-clock-core.mjs';
import {upstreamView} from './upstream-exchange-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

export const actThreeChapters=Object.freeze(['market','seeds','route','letters']);
const kinds={market:['river-market','cargo-errand'],seeds:['seed-exchange','exchange-plan'],route:['courier-clock-walk','kept-walk'],letters:['upstream-post','posted-question']};
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k);
const id=x=>typeof x==='string'&&x.length>0&&x.length<=160;
const positive=x=>Number.isSafeInteger(x)&&x>0;
const field=(o,k,test)=>!own(o,k)?'missing':test(o[k])?'ready':'unreadable';
const frame=x=>['short','longer'].includes(x),page=x=>['short','longer','original'].includes(x);
const season=x=>['spring','summer','autumn','winter'].includes(x);
const serial=x=>typeof x==='string'&&/^exchange-[1-9][0-9]{0,8}$/.test(x);

function reference(chapter,r){
 if(!obj(r))return false;
 if(chapter==='market')return positive(r.tryId)&&frame(r.amount);
 if(chapter==='seeds')return serial(r.visitId)&&['first','latest'].includes(r.edition)&&id(r.sourceId);
 if(chapter==='route')return id(r.caseId)&&id(r.sourceId);
 return chapter==='letters'&&id(r.questionId)&&id(r.sourceId)&&positive(r.sourceVersion);
}
export function validActThreeOffer(r,chapter=r?.chapter){
 return actThreeChapters.includes(chapter)&&obj(r)&&r.kind==='act-three-offer'&&r.version===1&&r.chapter===chapter&&r.activity===kinds[chapter][0]&&r.artifactKind===kinds[chapter][1]&&reference(chapter,r.ref);
}

function sourceView(state,chapter){
 const result={status:'missing',retainedUnreadable:false,candidates:[]};
 const add=(ref,label,identity)=>result.candidates.push({key:JSON.stringify([chapter,...identity]),chapter,activity:kinds[chapter][0],artifactKind:kinds[chapter][1],ref,label});
 // The market adapter joins after spec324's real runtime lands. Spec326 permits
 // the other three chapters first; an invented Spanish save is not a substitute.
 if(chapter==='market')return result;
 if(chapter==='letters'){
  const v=upstreamView(state);if(v.status!=='ready')return {...result,status:v.status==='missing'?'missing':'unreadable',retainedUnreadable:v.status==='unavailable'};
  result.status='ready';result.retainedUnreadable=v.sectionNotice===true;
  for(const q of v.questions){if(q.postStatus==='unavailable')result.retainedUnreadable=true;if(q.postStatus!=='ready')continue;
   const p=q.post.posted,ref={questionId:p.questionId,sourceId:p.sourceId,sourceVersion:p.sourceVersion};
   if(reference(chapter,ref)&&id(q.source.label))add(ref,q.source.label,[ref.sourceId,ref.sourceVersion,ref.questionId]);else result.retainedUnreadable=true;
  }
  return result;
 }
 const key=chapter==='seeds'?'seedExchange':'courierClockWalk';if(!own(state,key))return result;
 const root=state[key],map=chapter==='seeds'?'visits':'cases';
 if(!obj(root)||root.version!==1||!obj(root[map]))return {...result,status:'unreadable',retainedUnreadable:true};
 result.status='ready';
 for(const [key,work] of Object.entries(root[map])){
  if(!obj(work)||!(chapter==='seeds'?serial(key):id(key))){result.retainedUnreadable=true;continue;}
  if(chapter==='seeds'){
   for(const [property,edition] of [['firstKept','first'],['latestKept','latest']]){
    if(!own(work,property)||work[property]===null)continue;const kept=work[property];let valid=false;
    try{valid=validSeedSnapshot(kept)&&id(kept.source.id);}catch{}
    if(valid)add({visitId:key,edition,sourceId:kept.source.id},kept.source.title,[key,edition]);else result.retainedUnreadable=true;
   }
  }else if(own(work,'kept')&&work.kept!==null){
   const kept=work.kept;let valid=false;try{valid=obj(kept)&&obj(kept.snapshot)&&validWalkSource(kept.snapshot.source);}catch{}
   if(valid)add({caseId:key,sourceId:kept.snapshot.source.id},kept.snapshot.source.title,[key]);else result.retainedUnreadable=true;
  }
 }
 return result;
}
export function actThreeCandidates(state,chapter){if(!actThreeChapters.includes(chapter))return [];try{return sourceView(state,chapter).candidates;}catch{return [];}}
export function actThreeView(state){
 const keeper=storyView(state),story=keeper.status==='ready'?keeper.record:null,present=story&&own(story.acts,'III'),raw=present?story.acts.III:null,act=obj(raw)?raw:null;
 const status=keeper.status==='unavailable'?'unavailable':!story?'missing':!present?'missing':act?'ready':'unreadable';
 const startedStatus=act?field(act,'started',x=>typeof x==='boolean'):'missing',endedStatus=act?field(act,'ended',x=>typeof x==='boolean'):'missing',contributionsStatus=act?field(act,'contributions',obj):'missing',seasonStatus=act?field(act,'season',season):'missing';
 const ended=!!act&&act.ended===true,started=ended||!!act&&act.started===true,chapterStatus={},contributions={};
 for(const chapter of actThreeChapters){const map=contributionsStatus==='ready'?act.contributions:{};chapterStatus[chapter]=field(map,chapter,r=>validActThreeOffer(r,chapter));if(chapterStatus[chapter]==='ready')contributions[chapter]=map[chapter];}
 const count=Object.keys(contributions).length,writable=keeper.status==='ready'&&['missing','ready'].includes(status),pageReady=ended,pageVisible=pageReady&&story.seenScenes.includes('ways-page-revealed');
 const frameAmountStatus=story?field(story,'frameAmount',frame):'missing',pageAmountStatus=story?field(story,'pageAmount',page):'missing';
 const sources=Object.fromEntries(actThreeChapters.map(chapter=>{try{return [chapter,sourceView(state,chapter)];}catch{return [chapter,{status:'unreadable',retainedUnreadable:true,candidates:[]}];}}));
 return {status,storyStatus:keeper.status,act:raw,writable,startedStatus,endedStatus,contributionsStatus,seasonStatus,started,ended,chapterStatus,contributions,count,sources,
  canStart:writable&&actTwoView(state).letterVisible&&startedStatus!=='unreadable',canOffer:writable&&started&&contributionsStatus!=='unreadable',canSend:writable&&started&&endedStatus!=='unreadable'&&count>=3,
  pageReady,pageVisible,frameAmountStatus,pageAmountStatus,frameAmount:frameAmountStatus==='ready'?story.frameAmount:'short',pageAmount:pageAmountStatus==='ready'?story.pageAmount:'short',season:seasonStatus==='ready'?act.season:null};
}
function mutate(state,options,change){
 if(storyView(state).status!=='ready'||typeof options?.canExport!=='function')return false;
 try{const candidate=structuredClone(state);if(change(candidate.story)===false||storyView(candidate).status!=='ready'||!recoveryFitsProgressLimits(candidate))return false;const proposed=structuredClone(candidate.story);if(options.canExport(candidate)!==true)return false;state.story=proposed;return true;}catch{return false;}
}
export function startActThree(state,options={}){
 const v=actThreeView(state);if(v.started)return true;if(!v.canStart)return false;
 return mutate(state,options,story=>{if(!own(story.acts,'III'))story.acts.III={started:true,contributions:{},ended:false};else story.acts.III.started=true;});
}
export function offerActThree(state,chapter,key,options={}){
 if(!actThreeChapters.includes(chapter))return false;const v=actThreeView(state);if(v.chapterStatus[chapter]==='ready')return true;if(!v.canOffer||v.chapterStatus[chapter]==='unreadable')return false;
 const found=actThreeCandidates(state,chapter).find(c=>c.key===key);if(!found)return false;
 return mutate(state,options,story=>{const a=story.acts.III;if(!own(a,'contributions'))a.contributions={};a.contributions[chapter]={kind:'act-three-offer',version:1,chapter,activity:found.activity,artifactKind:found.artifactKind,ref:structuredClone(found.ref)};return validActThreeOffer(a.contributions[chapter],chapter);});
}
export function sendActThree(state,month,options={}){
 const v=actThreeView(state);if(v.ended)return true;const selected=seasonForMonth(month);if(!v.canSend||!selected)return false;
 return mutate(state,options,story=>{const a=story.acts.III;a.ended=true;if(!own(a,'season'))a.season=selected;if(!story.seenScenes.includes('both-ways-sent'))story.seenScenes.push('both-ways-sent');});
}
export function revealWaysPage(state,options={}){
 const v=actThreeView(state);if(v.pageVisible)return true;if(!v.writable||!v.pageReady)return false;
 return mutate(state,options,story=>{if(!story.seenScenes.includes('ways-page-revealed'))story.seenScenes.push('ways-page-revealed');});
}
