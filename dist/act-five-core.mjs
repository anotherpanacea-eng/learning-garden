// Spec 604 · Act V opening. Act V starts once Act IV has ended, frees Page 5 and lets the explorer choose a project path.
// The path is a code at story.acts.V.path; a saved code from another version is read as no path
// and changes only when the explorer chooses a path.
import {storyView} from './keeper-story-core.mjs';
import {actFourView} from './act-four-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export const actFivePaths=Object.freeze(['night-garden','gazette','sky-night','travelling-show','courier-route','sponge-again']);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k);
const field=(o,k,test)=>!own(o,k)?'missing':test(o[k])?'ready':'unreadable';
const pathCode=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(x);
const frame=x=>['short','longer'].includes(x);
const PAGE_SCENE='next-keeper-page-revealed';

export function actFiveView(state){
 const keeper=storyView(state),story=keeper.status==='ready'?keeper.record:null,present=story&&own(story.acts,'V'),raw=present?story.acts.V:null,act=obj(raw)?raw:null;
 const status=keeper.status==='unavailable'?'unavailable':!story||!present?'missing':act?'ready':'unreadable';
 const startedStatus=act?field(act,'started',x=>typeof x==='boolean'):'missing',started=startedStatus==='ready'&&act.started===true;
 const pathStatus=act?field(act,'path',pathCode):'missing',saved=pathStatus==='ready'?act.path:null,path=actFivePaths.includes(saved)?saved:null;
 const writable=keeper.status==='ready'&&['missing','ready'].includes(status),frameAmountStatus=story?field(story,'frameAmount',frame):'missing';
 return {status,storyStatus:keeper.status,act:raw,writable,startedStatus,started,pathStatus,path,earlierPath:saved!==null&&path===null,
  pageVisible:started&&story.seenScenes.includes(PAGE_SCENE),
  canStart:writable&&startedStatus!=='unreadable'&&actFourView(state).ended,
  canChoose:writable&&started&&pathStatus!=='unreadable',
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
const reveal=story=>{if(!story.seenScenes.includes(PAGE_SCENE))story.seenScenes.push(PAGE_SCENE);};
// Continue the story: starts Act V and frees Page 5 together, as Act IV's start frees Page 4 (352).
export function startActFive(state,options={}){
 const v=actFiveView(state);if(v.started)return true;if(!v.canStart)return false;
 return mutate(state,options,story=>{if(!own(story.acts,'V'))story.acts.V={started:true};else story.acts.V.started=true;reveal(story);});
}
export function revealNextKeeperPage(state,options={}){
 const v=actFiveView(state);if(v.pageVisible)return true;if(!v.writable||!v.started)return false;
 return mutate(state,options,reveal);
}
// Choosing again is allowed at any time; nothing else in the act changes, so nothing is lost by switching.
export function chooseActFivePath(state,path,options={}){
 if(!actFivePaths.includes(path))return false;const v=actFiveView(state);if(v.path===path&&v.pathStatus==='ready')return true;if(!v.canChoose)return false;
 return mutate(state,options,story=>{story.acts.V.path=path;});
}
