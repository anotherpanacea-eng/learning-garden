// Spec 604 · Act V opening. Act V starts once Act IV has ended, frees Page 5 and lets the explorer choose a project path.
// The path is a code at story.acts.V.path; a saved code from another version is read as no path
// and changes only when the explorer chooses a path.
import {storyView} from './keeper-story-core.mjs';
import {actFourView} from './act-four-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {seasonForMonth} from './act-two-core.mjs';
export const actFivePaths=Object.freeze(['night-garden','gazette','sky-night','travelling-show','courier-route','sponge-again']);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k);
const field=(o,k,test)=>!own(o,k)?'missing':test(o[k])?'ready':'unreadable';
const pathCode=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(x);
const frame=x=>['short','longer'].includes(x);
const PAGE_SCENE='next-keeper-page-revealed',END_SCENE='question-of-our-own';
// Spec605 · each path's project: Make (the explorer says a first version is made), Change (changed one thing, or kept as
// it was) and Keep (one of the path's three limit cards). Codes only; the story never reads or scores the work itself.
export const actFiveChanges=Object.freeze(['changed','kept']);
export const actFiveLimits=Object.freeze({'night-garden':['one-hedge','fell-asleep','smallest-visitors'],gazette:['few-people','news-after','column-unchecked'],'sky-night':['cloudy','one-roof','blurry'],'travelling-show':['local-jokes','spanish-words','one-town'],'courier-route':['one-season','goat','spring-floods'],'sponge-again':['daytime','few-months','frogs-hide']});
const season=x=>['spring','summer','autumn','winter'].includes(x);
// A saved project is read by shape. A well-formed code today's lists don't know still counts as chosen (it was stated),
// and the UI names it plainly; nothing is rewritten.
function projectRecord(raw){
 if(raw===undefined)return {status:'missing',made:false,change:null,limit:null,complete:false};
 if(!obj(raw))return {status:'unreadable',made:false,change:null,limit:null,complete:false};
 const madeOk=!own(raw,'made')||raw.made===true,changeOk=!own(raw,'change')||pathCode(raw.change),limitOk=!own(raw,'limit')||pathCode(raw.limit);
 if(!madeOk||!changeOk||!limitOk)return {status:'unreadable',made:false,change:null,limit:null,complete:false};
 const made=raw.made===true,change=own(raw,'change')?raw.change:null,limit=own(raw,'limit')?raw.limit:null;
 return {status:'ready',made,change,limit,complete:made&&change!==null&&limit!==null};
}

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
  frameAmountStatus,frameAmount:frameAmountStatus==='ready'?story.frameAmount:'short',...projectsView(act,started)};
}
function projectsView(act,started){
 const projectsStatus=act?field(act,'projects',obj):'missing',map=projectsStatus==='ready'?act.projects:{};
 const projects=Object.fromEntries(actFivePaths.map(id=>[id,projectsStatus==='unreadable'?{status:'unreadable',made:false,change:null,limit:null,complete:false}:projectRecord(map[id])]));
 const endedStatus=act?field(act,'ended',x=>typeof x==='boolean'):'missing',ended=started&&endedStatus==='ready'&&act.ended===true;
 const keptStatus=act?field(act,'kept',pathCode):'missing',kept=keptStatus==='ready'?act.kept:null;
 const seasonStatus=act?field(act,'season',season):'missing';
 return {projectsStatus,projects,endedStatus,ended,keptStatus,kept,keptKnown:actFivePaths.includes(kept),season:seasonStatus==='ready'?act.season:null};
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
 if(!actFivePaths.includes(path))return false;const v=actFiveView(state);if(v.path===path&&v.pathStatus==='ready')return true;if(!v.canChoose||v.ended)return false;
 return mutate(state,options,story=>{story.acts.V.path=path;});
}

// Project writes: only on the chosen path, in step order, before the ending. A repeat of the same value is a no-op.
function projectWrite(state,path,options,ready,apply){
 const v=actFiveView(state);if(!actFivePaths.includes(path))return false;const p=v.projects[path];
 if(!v.canChoose||v.path!==path||v.ended||v.endedStatus==='unreadable'||v.projectsStatus==='unreadable'||p.status==='unreadable'||!ready(p))return false;
 return mutate(state,options,story=>{const a=story.acts.V;if(!own(a,'projects'))a.projects={};if(!own(a.projects,path))a.projects[path]={};apply(a.projects[path]);});
}
export function markActFiveMade(state,path,options={}){
 if(actFiveView(state).projects[path]?.made&&actFiveView(state).path===path)return true;
 return projectWrite(state,path,options,()=>true,r=>{r.made=true;});
}
export function setActFiveChange(state,path,change,options={}){
 if(!actFiveChanges.includes(change))return false;if(actFiveView(state).projects[path]?.change===change&&actFiveView(state).path===path)return true;
 return projectWrite(state,path,options,p=>p.made,r=>{r.change=change;});
}
export function keepActFiveLimit(state,path,limit,options={}){
 if(!actFiveLimits[path]?.includes(limit))return false;if(actFiveView(state).projects[path]?.limit===limit&&actFiveView(state).path===path)return true;
 return projectWrite(state,path,options,p=>p.made&&p.change!==null,r=>{r.limit=limit;});
}
// The ending binds one complete project. It wears the season it ended in (120 §6); a saved season is never replaced.
export function canEndActFive(v,path){return v.writable&&v.started&&!v.ended&&v.endedStatus!=='unreadable'&&v.keptStatus!=='unreadable'&&actFivePaths.includes(path)&&v.projects[path]?.complete===true;}
export function endActFive(state,path,month,options={}){
 const v=actFiveView(state);if(v.ended)return v.kept===path;const selected=seasonForMonth(month);if(!canEndActFive(v,path)||!selected)return false;
 return mutate(state,options,story=>{const a=story.acts.V;a.ended=true;a.kept=path;if(!own(a,'season'))a.season=selected;if(!story.seenScenes.includes(END_SCENE))story.seenScenes.push(END_SCENE);});
}
