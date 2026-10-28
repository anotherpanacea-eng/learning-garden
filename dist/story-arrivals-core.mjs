import {storyArrivalContext} from './keeper-story-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export const arrivalView=state=>storyArrivalContext(state);
export const arrivalSkipsWelcome=state=>{const v=arrivalView(state);return v.decisionStatus==='chosen'&&['mended','letter'].includes(v.choice);};
export function chooseStoryArrival(state,choice,options={}){
 if(!['storm','mended','letter'].includes(choice)||state===null||typeof state!=='object'||Array.isArray(state))return false;
 const v=arrivalView(state);if(v.decisionStatus==='chosen')return v.choice===choice;
 if(!v.canChoose)return false;
 try{
  const candidate=structuredClone(state);
  if(!Object.hasOwn(candidate,'story'))candidate.story={version:1,opening:'returning',acts:{},seenScenes:[]};
  candidate.story.arrival=choice;candidate.story.arrivalChosen=true;
  if(storyArrivalContext(candidate).status!=='ready'||!recoveryFitsProgressLimits(candidate)||typeof options?.canExport==='function'&&options.canExport(candidate)!==true)return false;
  state.story=candidate.story;return true;
 }catch{return false;}
}
