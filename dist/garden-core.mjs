import {entrances,storyNodes} from './story-content.mjs';
import {guides,avatars} from './companions.mjs';
export const entranceById=id=>entrances.find(e=>e.id===id);
const pairKey=p=>[...p].sort((a,b)=>a-b).join('x');
const ownNode=(id,entrance)=>storyNodes[id]?.entrance===entrance;
const cleanDraft=d=>d&&typeof d==='object'&&Array.isArray(d.attempts)&&d.attempts.every(Number.isFinite);
export function ensureGarden(state){
 const g=state.garden&&typeof state.garden==='object'&&!Array.isArray(state.garden)?state.garden:{};
 state.garden=g;
 if(!guides.some(x=>x.id===g.guide))g.guide='mira';
 if(!avatars.some(x=>x.id===g.avatar))g.avatar='fern';
 if(!Array.isArray(g.seen))g.seen=[];g.seen=g.seen.filter(id=>storyNodes[id]);
 if(!Array.isArray(g.observations))g.observations=[];
 g.observations=g.observations.filter(o=>o&&storyNodes[o.nodeId]&&typeof o.visitId==='string'&&Array.isArray(o.attempts)&&o.attempts.every(Number.isFinite));
 if(!Array.isArray(g.visits))g.visits=[];
 const ids=new Set();g.visits=g.visits.filter(v=>{
  if(!v||typeof v.id!=='string'||ids.has(v.id)||!entranceById(v.entrance))return false;ids.add(v.id);
  v.recorded=Array.isArray(v.recorded)?v.recorded.filter(id=>ownNode(id,v.entrance)):[];
  if(!v.drafts||typeof v.drafts!=='object'||Array.isArray(v.drafts))v.drafts={};
  for(const [id,d] of Object.entries(v.drafts))if(!ownNode(id,v.entrance)||!cleanDraft(d))delete v.drafts[id];
  let id=entranceById(v.entrance).start;const seen=new Set();
  while(id&&v.recorded.includes(id)&&!seen.has(id)){seen.add(id);id=storyNodes[id].next;}
  v.node=id;v.finished=!id;return true;
 });
 if(!g.visits.some(v=>v.id===g.current))g.current=null;
 return g;
}
export const currentVisit=s=>ensureGarden(s).visits.find(v=>v.id===s.garden.current)||null;
export function startVisit(state,entrance){
 const g=ensureGarden(state),e=entranceById(entrance);if(!e)return null;
 let n=1;while(g.visits.some(v=>v.id===`visit-${n}`))n++;
 const v={id:`visit-${n}`,entrance,node:e.start,recorded:[],drafts:{},finished:false,createdAt:new Date().toISOString()};
 g.visits.push(v);g.current=v.id;return v;
}
export function resumeVisit(state,id){const g=ensureGarden(state);if(!g.visits.some(v=>v.id===id))return false;g.current=id;return true;}
export function storyDraft(state){
 const v=currentVisit(state);if(!v||v.finished)return null;const n=storyNodes[v.node];
 if(!v.drafts[n.id])v.drafts[n.id]={attempts:[],input:'',choice:null,hinted:false,revealed:false,method:null,reading:'unobserved',familiar:state.garden.seen.includes(n.id),knownFact:(n.facts||[]).some(p=>state.broad?.seenFacts?.includes(pairKey(p))),priorExposureUnknown:!!state.broad?.legacyExposureUnknown};
 return v.drafts[n.id];
}
export function noteStorySeen(state){
 const v=currentVisit(state);if(!v?.node)return;
 if(!state.garden.seen.includes(v.node))state.garden.seen.push(v.node);
 for(const other of state.garden.visits)if(other.id!==v.id&&other.drafts[v.node])other.drafts[v.node].familiar=true;
}
export function noteGardenFactExposure(state,pair,except=null){
 const key=pairKey(pair);for(const v of ensureGarden(state).visits)for(const [id,d] of Object.entries(v.drafts)){
  if(`${v.id}:${id}`!==except&&(storyNodes[id].facts||[]).some(p=>pairKey(p)===key))d.knownFact=true;
 }
}
export function submitStory(state,value){
 const v=currentVisit(state),n=v&&storyNodes[v.node],d=storyDraft(state);
 if(!n||n.type!=='task'||!Number.isFinite(value))return false;
 if(n.kind==='choice'&&(!Number.isInteger(value)||value<0||value>=n.choices.length))return false;
 if(n.kind==='number'&&(!Number.isInteger(value)||value<0))return false;
 d.attempts.push(value);d.error='';return value===n.answer;
}
export function finishStoryNode(state,skip=false){
 const v=currentVisit(state),n=v&&storyNodes[v.node],d=storyDraft(state);if(!n||!d||v.recorded.includes(n.id))return false;
 const project=n.type==='project',correct=!project&&!skip&&d.attempts.at(-1)===n.answer;
 if(!project&&!skip&&(!correct||!['knew','worked','counted','together'].includes(d.method)))return false;
 const firstCorrect=correct&&d.attempts.length===1;
 const supported=!!d.hinted||!!d.revealed||d.method==='together'||(n.subject==='Reading'&&d.reading!=='independent');
 const independent=correct&&firstCorrect&&!supported;
 const o={visitId:v.id,nodeId:n.id,entrance:v.entrance,title:n.title,subject:n.subject,prompt:n.prompt,answer:project?null:n.answer,choices:n.choices||null,attempts:[...d.attempts],
  status:project?'invitation':skip?(d.attempts.length?'explored':'skipped'):'answered',correct:project?null:correct,firstCorrect:!!firstCorrect,supported,independent:!!independent,
  freshEvidence:!!independent&&!d.familiar&&!d.knownFact&&!d.priorExposureUnknown,
  familiar:!!d.familiar,knownFact:!!d.knownFact,priorExposureUnknown:!!d.priorExposureUnknown,hinted:!!d.hinted,revealed:!!d.revealed,
  designChoice:project?d.designChoice||null:null,context:'guided-story',method:project||skip?null:d.method,reading:['independent','together','unobserved'].includes(d.reading)?d.reading:'unobserved',source:'story',at:new Date().toISOString()};
 state.garden.observations.push(o);v.recorded.push(n.id);v.node=n.next;v.finished=!n.next;
 if(v.finished)v.finishedAt=new Date().toISOString();return o;
}
export function storyDescribe(o){
 if(o.status==='invitation')return 'An unscored project invitation; completion was not checked';
 if(o.status==='skipped')return 'Left unexplored';
 if(!o.correct)return 'An idea to return to';
 if(o.supported)return o.subject==='Reading'&&!o.hinted&&!o.revealed&&o.method!=='together'?'Found an answer; independent reading was not observed':'Found an answer with support';
 if(!o.firstCorrect)return 'Found an answer after another try';
 if(o.familiar||o.knownFact)return 'Answered after an earlier encounter';
 return o.method==='counted'?'Counted to an answer':o.method==='worked'?'Worked out an answer independently':'Reported knowing the answer';
}
