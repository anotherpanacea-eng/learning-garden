import {frenchPlaces,frenchStories,frenchLibraryNodes} from './french-library.mjs';
const owns=(o,k)=>!!o&&Object.prototype.hasOwnProperty.call(o,k);
export const isFrenchExploration=v=>!!v&&(v.entrance==='french'||owns(v,'french'));
export function validateFrenchRoute(v){
 if(v?.entrance!=='french'||!v.french||typeof v.french!=='object'||Array.isArray(v.french)||owns(v,'paris')||!Array.isArray(v.route))return false;
 const p=v.french,s=frenchStories.find(s=>s.id===p.storyId&&s.destination===p.destination),pair=s?.variants[p.variant];
 if(!frenchPlaces.some(d=>d.id===p.destination)||![1,2,3].includes(p.variant)||!pair||typeof p.reason!=='string'||!p.reason.trim()||p.reason.length>600)return false;
 if(['priorStorySeen','displayed'].some(k=>owns(p,k)&&typeof p[k]!=='boolean'))return false;
 if(v.route.length!==3||!v.route.every((id,i)=>id===[...pair,'french-postcard'][i]))return false;
 if(v.recorded!==undefined&&(!Array.isArray(v.recorded)||v.recorded.some((id,i)=>id!==v.route[i])))return false;
 if(v.drafts!==undefined&&(!v.drafts||typeof v.drafts!=='object'||Array.isArray(v.drafts)||Object.keys(v.drafts).some(id=>!v.route.includes(id))))return false;
 return true;
}
export function validFrenchObservation(o,v){
 if(!o||typeof o!=='object'||!validateFrenchRoute(v)||!v.recorded?.includes(o.nodeId)||!v.route.includes(o.nodeId))return false;
 const p=v.french,n=frenchLibraryNodes[o.nodeId];
 return o.language==='fr'&&o.frenchDestination===p.destination&&o.frenchStory===p.storyId&&o.frenchVariant===p.variant&&o.frenchSelectionReason===p.reason&&
  (n.type!=='task'||n.frenchDestination===p.destination&&n.frenchStory===p.storyId&&n.frenchVariant===p.variant);
}
const supported=o=>o.supported===true||!!o.helpUsed||!!o.hinted||!!o.revealed||o.meaningUsed===true||o.method==='together'||['together','listened'].includes(o.reading)||!!o.readingTools?.audioRequested||!!o.readingTools?.sentenceUsed||!!o.readingTools?.supportUncertain;
const retry=o=>Array.isArray(o.attempts)&&(o.attempts.length>1||o.attempts.some(a=>a!==o.answer));
function suggestion(state){
 const visits=state?.garden?.visits||[],seen=new Set();
 const recent=(state?.garden?.observations||[]).filter(o=>{
  const v=visits.find(v=>v.id===o?.visitId),key=`${o?.visitId}:${o?.nodeId}`;
  if(seen.has(key)||!validFrenchObservation(o,v)||o.status!=='answered'||!v.route.slice(0,2).includes(o.nodeId)||!['independent','together','listened'].includes(o.reading))return false;
  seen.add(key);return true;
 }).slice(-8);
 if(!recent.length)return {variant:1,reason:'Start with short sentences. Choose any amount of French whenever you like.'};
 const latest=recent.at(-1),base=latest.frenchVariant,lastSupport=recent.findLastIndex(o=>supported(o)||retry(o));
 if(lastSupport>=0&&recent[lastSupport].frenchVariant===base&&recent.slice(lastSupport).every(o=>o.visitId===latest.visitId))return {variant:Math.max(1,base-1),reason:base===1?'Keep short sentences and any help you like. Every story and text choice stays open.':'The last story used help or another try. Try fewer sentences for the next errand, or choose any amount yourself.'};
 const distinct=new Set();
 for(const o of recent.slice(lastSupport+1)){
  const v=visits.find(v=>v.id===o.visitId),n=frenchLibraryNodes[o.nodeId];
  if(o.frenchVariant!==base||o.nodeId!==v.route[0]||o.correct!==true||o.firstCorrect!==true||o.reading!=='independent'||o.priorStorySeen!==false||v.french.priorStorySeen!==false||o.priorPassageSeen!==false||o.familiar||supported(o)||retry(o)||o.answer!==n.answer||o.attempts?.length!==1||o.attempts[0]!==n.answer)continue;
  distinct.add(o.frenchStory);
 }
 if(distinct.size>=2)return {variant:Math.min(3,base+1),reason:base===3?'Keep exploring short paragraphs, or choose another amount whenever you like.':'Two different new stories were answered on the first try. They were reported as read independently, with no help recorded. A little more connected French is ready to try. Every choice stays open.'};
 return {variant:base,reason:'Keep exploring with this amount of French. There is no need to move on until you want to.'};
}
export function frenchPlan(state,destination,variant='auto',storyId=null){
 if(!frenchPlaces.some(d=>d.id===destination)||variant!=='auto'&&![1,2,3].includes(variant)||storyId!==null&&!frenchStories.some(s=>s.id===storyId&&s.destination===destination))return null;
 const visits=state?.garden?.visits||[],seen=state?.garden?.seen||[],count=s=>Math.max(visits.filter(v=>validateFrenchRoute(v)&&v.french.storyId===s.id&&(v.french.displayed===true||v.recorded?.includes(v.route[0]))).length,seen.some(id=>Object.values(s.variants).flat().includes(id))?1:0);
 const stories=frenchStories.filter(s=>s.destination===destination),story=storyId?stories.find(s=>s.id===storyId):stories.map((s,i)=>({s,i,n:count(s)})).sort((a,b)=>a.n-b.n||a.i-b.i)[0]?.s;
 if(!story)return null;const auto=suggestion(state),chosen=variant==='auto'?auto.variant:variant;
 return Object.freeze({destination,storyId:story.id,variant:chosen,reason:variant==='auto'?auto.reason:'You chose this amount of French. Every choice stays available.',route:Object.freeze([...story.variants[chosen],'french-postcard'])});
}
export function priorFrenchStorySeen(state,storyId){
 const story=frenchStories.find(s=>s.id===storyId),ids=story?Object.values(story.variants).flat():[];
 return (state?.garden?.seen||[]).some(id=>ids.includes(id));
}
