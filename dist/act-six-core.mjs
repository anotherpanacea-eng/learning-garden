// Spec 606 · Act VI opening. Act VI starts once Act V has ended (a project bound into the Keeper's Pages). Chapter 1 is a
// scene with jobs; chapter 2 keeps the exchange plan as a code at story.acts.VI.plan. A saved code from another version is
// read as no plan and changes only when the explorer keeps a plan.
import {storyView} from './keeper-story-core.mjs';
import {actFiveView} from './act-five-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export const actSixChapters=Object.freeze(['exchange','routes']);
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
  frameAmountStatus,frameAmount:frameAmountStatus==='ready'?story.frameAmount:'short'};
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
