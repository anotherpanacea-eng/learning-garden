import {parisDestinations,parisStories} from './paris-library.mjs';
import {parisRoute,parisVisitStatus,validParisSource} from './paris-visit-source.mjs';
const owns=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
export const isParisExploration=v=>!!v&&(owns(v,'paris')||owns(v,'route'));
export function validateParisRoute(v){
 if(v?.parisSource!==undefined)return validParisSource(v)&&!!v.paris;
 if(v?.entrance!=='paris'||!v.paris||typeof v.paris!=='object'||Array.isArray(v.paris)||!Array.isArray(v.route))return false;
 const p=v.paris,s=parisStories.find(s=>s.id===p.storyId&&s.destination===p.destination),pair=s?.variants?.[p.variant];
 if(!parisDestinations.some(d=>d.id===p.destination)||![1,2,3].includes(p.variant)||!pair||typeof p.reason!=='string'||!p.reason.trim()||p.reason.length>600)return false;
 if(owns(p,'priorStorySeen')&&typeof p.priorStorySeen!=='boolean'||owns(p,'displayed')&&typeof p.displayed!=='boolean')return false;
 if(v.route.length!==3||!v.route.every((id,i)=>id===[...pair,'paris-postcard'][i]))return false;
 if(v.recorded!==undefined&&(!Array.isArray(v.recorded)||v.recorded.some((id,i)=>id!==v.route[i])))return false;
 if(v.drafts!==undefined&&(!v.drafts||typeof v.drafts!=='object'||Array.isArray(v.drafts)||Object.keys(v.drafts).some(id=>!v.route.includes(id))))return false;
 return true;
}
export function parisSupportUncertain(o){
 if(o?.entrance!=='paris'||o.subject!=='Reading')return false;
 const t=o.readingTools;return !t||typeof t!=='object'||Array.isArray(t)||['audioRequested','sentenceUsed','supportUncertain'].some(k=>typeof t[k]!=='boolean')||t.supportUncertain||!(t.focus===null||Number.isInteger(t.focus)&&t.focus>=0);
}
const explicitSupport=o=>parisSupportUncertain(o)||Number.isInteger(o.readingTools?.focus)&&o.readingTools.focus>=0||!!o.helpUsed||!!o.hinted||!!o.revealed||o.method==='together'||['together','listened'].includes(o.reading)||!!o.readingTools?.audioRequested||!!o.readingTools?.sentenceUsed||!!o.readingTools?.supportUncertain;
const retry=o=>Array.isArray(o.attempts)&&(o.attempts.length>1||o.attempts.some(a=>a!==o.answer));
function signals(state,destination){
 const g=state?.garden||{},visits=Array.isArray(g.visits)?g.visits:[],observations=Array.isArray(g.observations)?g.observations:[];
 return observations.filter(o=>{
  const v=visits.find(v=>v.id===o?.visitId);if(parisVisitStatus(v)!=='current'||!validateParisRoute(v)||v.paris.destination!==destination||!parisRoute(v).slice(0,2).includes(o.nodeId)||!v.recorded?.includes(o.nodeId))return false;
  return o.status==='answered'&&o.parisDestination===destination&&o.parisStory===v.paris.storyId&&o.parisVariant===v.paris.variant;
 }).slice(-6);
}
function suggestion(state,destination){
 const recent=signals(state,destination);if(!recent.length)return {variant:2,reason:'Begin with a little more text. You can choose any passage length.'};
 const base=recent.at(-1).parisVariant,lastSupport=recent.findLastIndex(o=>explicitSupport(o)||retry(o));
 // A later answer on the same passage cannot erase its earlier request for support.
 const latest=recent.at(-1),latestVisit=latest.visitId;
 if(lastSupport>=0&&recent[lastSupport].parisVariant===base&&recent.slice(lastSupport).every(o=>o.visitId===latestVisit))return {variant:Math.max(1,base-1),reason:base===1?'Keep a little text and explore together with any help you like. Every length is available.':'The last story used help or another try. A little less text may leave more room to explore together; every length is available.'};
 const distinct=new Set();
 for(const o of recent.slice(lastSupport+1).filter(o=>o.parisVariant===base)){
  const v=state.garden.visits.find(v=>v.id===o.visitId);
  if(o.nodeId!==parisRoute(v)[0]||o.correct!==true||o.firstCorrect!==true||o.reading!=='independent'||o.method==='together'||o.priorStorySeen!==false||o.priorPassageSeen!==false||o.familiar||explicitSupport(o)||retry(o)||o.attempts?.length!==1||o.attempts[0]!==o.answer)continue;
  distinct.add(o.parisStory);
 }
 if(distinct.size>=2)return {variant:Math.min(3,base+1),reason:base===3?'Keep the longer passages for now, or choose another length whenever you like.':'Two different new stories were answered on a first try without recorded help. A little more text is available to try; you can choose any length.'};
 return {variant:base,reason:'Keep exploring with this amount of text. Choose a different length whenever you like.'};
}
export function parisPlan(state,destination,variant='auto',storyId=null){
 if(!parisDestinations.some(d=>d.id===destination)||variant!=='auto'&&![1,2,3].includes(variant)||storyId!==null&&(typeof storyId!=='string'||!parisStories.some(s=>s.id===storyId&&s.destination===destination)))return null;
 const g=state?.garden||{},seen=Array.isArray(g.seen)?g.seen:[],visits=Array.isArray(g.visits)?g.visits:[];
 const stories=parisStories.filter(s=>s.destination===destination);
 const count=s=>{
  const displayed=visits.filter(v=>parisVisitStatus(v)==='current'&&validateParisRoute(v)&&v.paris.storyId===s.id&&(v.paris.displayed===true||v.recorded?.includes(parisRoute(v)[0]))).length;
  return Math.max(displayed,seen.some(id=>Object.values(s.variants).flat().includes(id))?1:0);
 };
 const story=storyId===null?stories.map((s,i)=>({s,i,n:count(s)})).sort((a,b)=>a.n-b.n||a.i-b.i)[0]?.s:stories.find(s=>s.id===storyId);if(!story)return null;
 const automatic=suggestion(state,destination),chosen=variant==='auto'?automatic.variant:variant;
 const reason=variant==='auto'?automatic.reason:'You chose this passage length. Every length stays available.';
 return Object.freeze({destination,storyId:story.id,variant:chosen,reason,route:Object.freeze([...story.variants[chosen],'paris-postcard'])});
}
export function priorParisStorySeen(state,storyId){
 const story=parisStories.find(s=>s.id===storyId),ids=story?Object.values(story.variants).flat():[];
 return (state?.garden?.seen||[]).some(id=>ids.includes(id));
}
