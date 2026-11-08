// Spec 606 · Act VI opening. Act VI starts once Act V has ended (a project bound into the Keeper's Pages). Chapter 1 is a
// scene with jobs; chapter 2 keeps the exchange plan as a code at story.acts.VI.plan. A saved code from another version is
// read as no plan and changes only when the explorer keeps a plan.
import {storyView} from './keeper-story-core.mjs';
import {actFiveView} from './act-five-core.mjs';
import {actFourPlans} from './act-four-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {seasonForMonth} from './act-two-core.mjs';
export const actSixChapters=Object.freeze(['exchange','routes','long-rain','journey']);
export const actSixPlans=Object.freeze(['full','small']);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k);
const field=(o,k,test)=>!own(o,k)?'missing':test(o[k])?'ready':'unreadable';
const code=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(x);
const frame=x=>['short','longer'].includes(x);
const SCENE='nurias-list';

export function actSixView(state){
 const keeper=storyView(state),story=keeper.status==='ready'?keeper.record:null,present=story&&own(story.acts,'VI'),raw=present?story.acts.VI:null,act=obj(raw)?raw:null;
 const status=keeper.status==='unavailable'?'unavailable':!story||!present?'missing':act?'ready':'unreadable';
 const startedStatus=act?field(act,'started',x=>typeof x==='boolean'):'missing',started=startedStatus==='ready'&&act.started===true;
 const planStatus=act?field(act,'plan',code):'missing',saved=planStatus==='ready'?act.plan:null,plan=actSixPlans.includes(saved)?saved:null;
 const writable=keeper.status==='ready'&&['missing','ready'].includes(status),frameAmountStatus=story?field(story,'frameAmount',frame):'missing';
 return {status,storyStatus:keeper.status,act:raw,writable,startedStatus,started,planStatus,plan,earlierPlan:saved!==null&&plan===null,
  canStart:writable&&startedStatus!=='unreadable'&&actFiveView(state).ended,
  canKeepPlan:writable&&started&&planStatus!=='unreadable',
  frameAmountStatus,frameAmount:frameAmountStatus==='ready'?story.frameAmount:'short',...rainView(story,act,started,writable,planStatus,plan)};
}
// Spec607 · the long rain. Sending the warning is the chapter's one write (acts.VI.warned) and counts as the rain having
// played. The Act IV plan is read here by shape (spec 120 §12's fallback), not through Act IV's view: absent, one of today's
// three plans, a well-formed code from another version, or malformed. Only an absent plan can be written, by explicit choice.
export function storyPlanKind(story){
 if(!obj(story)||!own(story,'plan'))return {kind:'absent',plan:null};
 const p=story.plan;if(actFourPlans.includes(p))return {kind:'known',plan:p};
 return typeof p==='string'&&/^[a-z][a-z-]{0,39}$/.test(p)?{kind:'later',plan:null}:{kind:'malformed',plan:null};
}
function rainView(story,act,started,writable,planStatus,plan){
 const warnedStatus=act?field(act,'warned',x=>x===true):'missing',warned=started&&warnedStatus==='ready',storyPlan=storyPlanKind(story);
 const rainOpen=started&&plan!==null;
 // Spec608 · the first journey opens once the warning is sent; sending the first parcel (acts.VI.journey) is its one write.
 const journeyStatus=act?field(act,'journey',x=>x===true):'missing',journey=warned&&journeyStatus==='ready';
 return {warnedStatus,warned,storyPlan,rainOpen,canWarn:writable&&rainOpen&&!warned&&warnedStatus!=='unreadable',canChooseStoryPlan:writable&&warned&&storyPlan.kind==='absent',
  journeyStatus,journey,canSendParcel:writable&&warned&&!journey&&journeyStatus!=='unreadable',...endingView(act,started,writable,plan,warned,journey)};
}
// Spec609 · the ending opens when an exchange plan is kept, the long rain has played and the first journey is made (120 §6).
// Reading Hollis's letter after supper ends the act; it wears the season it ended in, and a saved season is never replaced.
const season=x=>['spring','summer','autumn','winter'].includes(x);
function endingView(act,started,writable,plan,warned,journey){
 const endedStatus=act?field(act,'ended',x=>typeof x==='boolean'):'missing',ended=started&&endedStatus==='ready'&&act.ended===true;
 const seasonStatus=act?field(act,'season',season):'missing';
 return {endedStatus,ended,season:seasonStatus==='ready'?act.season:null,seasonStatus,
  canEnd:writable&&started&&!ended&&endedStatus!=='unreadable'&&seasonStatus!=='unreadable'&&plan!==null&&warned&&journey};
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
// Continue the story after the Act V ending: Nuria's letter and the opening. One atomic write; Act V is untouched.
export function startActSix(state,options={}){
 const v=actSixView(state);if(v.started)return true;if(!v.canStart)return false;
 return mutate(state,options,story=>{if(!own(story.acts,'VI'))story.acts.VI={started:true};else story.acts.VI.started=true;if(!story.seenScenes.includes(SCENE))story.seenScenes.push(SCENE);});
}
// Keep it, or Make it smaller. Not yet writes nothing. Keeping again switches the plan; the same plan again is a no-op.
export function keepExchangePlan(state,plan,options={}){
 if(!actSixPlans.includes(plan))return false;const v=actSixView(state);if(v.plan===plan&&v.planStatus==='ready')return true;if(!v.canKeepPlan)return false;
 return mutate(state,options,story=>{story.acts.VI.plan=plan;});
}

// Send: Sprout taps it; Seedling and Sapling may first choose or build the French card. Sending again is a no-op.
export function sendWarning(state,options={}){
 const v=actSixView(state);if(v.warned)return true;if(!v.canWarn)return false;
 return mutate(state,options,story=>{story.acts.VI.warned=true;});
}
// The meeting, offered again: only when no Act IV plan was ever stored, and only by the explorer's choice. Any saved worry is
// left exactly as it was; a present plan, readable or not, is never overwritten (spec 120 §12).
export function chooseRainPlan(state,plan,options={}){
 if(!actFourPlans.includes(plan))return false;const v=actSixView(state);if(!v.canChooseStoryPlan)return false;
 return mutate(state,options,story=>{if(own(story,'plan'))return false;story.plan=plan;});
}

// Send the first parcel under the kept exchange plan. Any depth's job, or none, may come first; the story never checks them.
export function sendFirstParcel(state,options={}){
 const v=actSixView(state);if(v.journey)return true;if(!v.canSendParcel)return false;
 return mutate(state,options,story=>{story.acts.VI.journey=true;});
}

export function endActSix(state,month,options={}){
 const v=actSixView(state);if(v.ended)return true;const selected=seasonForMonth(month);if(!v.canEnd||!selected)return false;
 return mutate(state,options,story=>{const a=story.acts.VI;a.ended=true;if(!own(a,'season'))a.season=selected;if(!story.seenScenes.includes('ways-open'))story.seenScenes.push('ways-open');});
}
