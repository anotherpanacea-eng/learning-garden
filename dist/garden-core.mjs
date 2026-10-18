import {entrances,storyNodes} from './story-content.mjs';
import {helpers,acceptsAnswer,cleanHelper} from './help-content.mjs';
import {guides,avatars} from './companions.mjs';
export const entranceById=id=>entrances.find(e=>e.id===id);
const pairKey=p=>[...p].sort((a,b)=>a-b).join('x');
const ownNode=(id,entrance)=>storyNodes[id]?.entrance===entrance;
const cleanDraft=d=>d&&typeof d==='object'&&Array.isArray(d.attempts)&&d.attempts.every(Number.isFinite);
const readingNode=n=>Array.isArray(n?.readingText)&&n.type==='task';
const toolSupport=t=>t.audioRequested||t.sentenceUsed||t.supportUncertain;
function cleanReadingTools(raw,length){
 const tools={audioRequested:false,sentenceUsed:false,focus:null,supportUncertain:false};
 if(raw===undefined)return tools;
 if(!raw||typeof raw!=='object'||Array.isArray(raw)){tools.supportUncertain=true;return tools;}
 for(const key of ['audioRequested','sentenceUsed','supportUncertain']){
  if(typeof raw[key]==='boolean')tools[key]=tools[key]||raw[key];else tools.supportUncertain=true;
 }
 if(raw.focus!==null){
  if(Number.isInteger(raw.focus)&&raw.focus>=0&&raw.focus<length){tools.focus=raw.focus;tools.sentenceUsed=true;}
  else tools.supportUncertain=true;
 }
 return tools;
}
function cleanReadingRecord(record,node,observation=false,seen=[]){
 if(!readingNode(node))return;
 record.readingTools=cleanReadingTools(record.readingTools,node.readingText.length);
 record.priorPassageSeen=typeof record.priorPassageSeen==='boolean'?record.priorPassageSeen:seen.some(id=>storyNodes[id]?.passageId===node.passageId);
 if(observation){
  record.readingSkill=node.readingSkill;record.passageId=node.passageId;record.practiceOnly=node.practiceOnly===true;
  if(toolSupport(record.readingTools)||record.reading==='listened'){record.supported=true;record.independent=false;record.freshEvidence=false;}
  if(record.practiceOnly||record.priorPassageSeen)record.freshEvidence=false;
 }
}
export function ensureGarden(state){
 const g=state.garden&&typeof state.garden==='object'&&!Array.isArray(state.garden)?state.garden:{};
 state.garden=g;
 if(!guides.some(x=>x.id===g.guide))g.guide='mira';
 if(!avatars.some(x=>x.id===g.avatar))g.avatar='fern';
 if(!Array.isArray(g.seen))g.seen=[];g.seen=g.seen.filter(id=>storyNodes[id]);
 if(!Array.isArray(g.observations))g.observations=[];
 g.observations=g.observations.filter(o=>o&&storyNodes[o.nodeId]&&typeof o.visitId==='string'&&Array.isArray(o.attempts)&&o.attempts.every(Number.isFinite));
 for(const o of g.observations){cleanHelper(o,o.nodeId);cleanReadingRecord(o,storyNodes[o.nodeId],true,g.seen);if(o.helpUsed){o.supported=true;o.independent=false;o.freshEvidence=false;}}
 if(!Array.isArray(g.visits))g.visits=[];
 const ids=new Set();g.visits=g.visits.filter(v=>{
  if(!v||typeof v.id!=='string'||ids.has(v.id)||!entranceById(v.entrance))return false;ids.add(v.id);
  v.recorded=Array.isArray(v.recorded)?v.recorded.filter(id=>ownNode(id,v.entrance)):[];
  if(!v.drafts||typeof v.drafts!=='object'||Array.isArray(v.drafts))v.drafts={};
  for(const [id,d] of Object.entries(v.drafts)){if(!ownNode(id,v.entrance)||!cleanDraft(d))delete v.drafts[id];else{cleanHelper(d,id);cleanReadingRecord(d,storyNodes[id],false,g.seen);}}
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
 if(readingNode(n)){
  const d=v.drafts[n.id];
  if(d.priorPassageSeen===undefined)d.priorPassageSeen=state.garden.seen.some(id=>storyNodes[id].passageId===n.passageId);
  d.readingTools=cleanReadingTools(d.readingTools,n.readingText.length);
 }
 return v.drafts[n.id];
}
export function useStoryReadingTool(state,action){
 const v=currentVisit(state),n=v&&storyNodes[v.node];
 if(!readingNode(n)||v.finished||!['audio','sentence-next','whole'].includes(action))return false;
 const d=storyDraft(state);if(d.helper?.open)return false;
 if(action==='audio')d.readingTools.audioRequested=true;
 else if(action==='sentence-next'){d.readingTools.sentenceUsed=true;d.readingTools.focus=d.readingTools.focus===null?0:Math.min(n.readingText.length-1,d.readingTools.focus+1);}
 else d.readingTools.focus=null;
 return true;
}
export function noteStorySeen(state){
 const v=currentVisit(state);if(!v?.node)return;
 if(!state.garden.seen.includes(v.node))state.garden.seen.push(v.node);
 for(const other of state.garden.visits)if(other.id!==v.id&&other.drafts[v.node])other.drafts[v.node].familiar=true;
 const passageId=storyNodes[v.node].passageId;
 if(passageId)for(const other of state.garden.visits)for(const [id,d] of Object.entries(other.drafts))if((other.id!==v.id||id!==v.node)&&storyNodes[id]?.passageId===passageId)d.priorPassageSeen=true;
}
export function noteGardenFactExposure(state,pair,except=null){
 const key=pairKey(pair);for(const v of ensureGarden(state).visits)for(const [id,d] of Object.entries(v.drafts)){
  if(`${v.id}:${id}`!==except&&(storyNodes[id].facts||[]).some(p=>pairKey(p)===key))d.knownFact=true;
 }
}
export function submitStory(state,value){
 const v=currentVisit(state),n=v&&storyNodes[v.node],d=storyDraft(state);
 if(!n||d.helper?.open||n.type!=='task'||!Number.isFinite(value))return false;
 if(n.kind==='choice'&&(!Number.isInteger(value)||value<0||value>=n.choices.length))return false;
 if(n.kind==='number'&&(!Number.isInteger(value)||value<0))return false;
 d.attempts.push(value);d.error='';return acceptsAnswer(n,value);
}
export function finishStoryNode(state,skip=false){
 const v=currentVisit(state),n=v&&storyNodes[v.node],d=storyDraft(state);if(!n||!d||v.recorded.includes(n.id))return false;
 if(d.helper?.open)return false;
 const project=n.type==='project',correct=!project&&!skip&&acceptsAnswer(n,d.attempts.at(-1));
 if(!project&&!skip&&(!correct||!['knew','worked','counted','together'].includes(d.method)))return false;
 const firstCorrect=correct&&d.attempts.length===1;
 const tools=readingNode(n)?cleanReadingTools(d.readingTools,n.readingText.length):null;
 const supported=!!d.helpUsed||!!d.hinted||!!d.revealed||d.method==='together'||(n.subject==='Reading'&&d.reading!=='independent')||!!tools&&toolSupport(tools);
 const independent=correct&&firstCorrect&&!supported;
 const o={visitId:v.id,nodeId:n.id,entrance:v.entrance,title:n.title,subject:n.subject,prompt:n.prompt,answer:project?null:n.answer,acceptedAnswers:project?null:n.answers||[n.answer],choices:n.choices||null,attempts:[...d.attempts],
  status:project?'invitation':skip?(d.attempts.length?'explored':'skipped'):'answered',correct:project?null:correct,firstCorrect:!!firstCorrect,supported,independent:!!independent,
  freshEvidence:!!independent&&!d.familiar&&!d.knownFact&&!d.priorExposureUnknown&&!n.practiceOnly&&!d.priorPassageSeen,
  familiar:!!d.familiar,knownFact:!!d.knownFact,priorExposureUnknown:!!d.priorExposureUnknown,hinted:!!d.hinted,revealed:!!d.revealed,
  helpUsed:!!d.helpUsed,helper:d.helper?JSON.parse(JSON.stringify(d.helper)):null,
  ...(tools?{readingSkill:n.readingSkill,passageId:n.passageId,priorPassageSeen:!!d.priorPassageSeen,readingTools:tools,practiceOnly:!!n.practiceOnly}:{}),
  designChoice:project?d.designChoice||null:null,context:'guided-story',method:project||skip?null:d.method,reading:['independent','together','unobserved','listened'].includes(d.reading)?d.reading:'unobserved',source:'story',at:new Date().toISOString()};
 state.garden.observations.push(o);v.recorded.push(n.id);v.node=n.next;v.finished=!n.next;
 if(v.finished)v.finishedAt=new Date().toISOString();return o;
}
export function storyDescribe(o){
 if(o.status==='invitation')return 'An unscored project invitation; completion was not checked';
 if(o.status==='skipped')return 'Left unexplored';
 if(!o.correct)return 'An idea to return to';
 if(o.supported){
  if(o.readingTools?.supportUncertain)return 'Found an answer; reading support details are uncertain';
  return o.subject==='Reading'&&!o.helpUsed&&!o.hinted&&!o.revealed&&o.method!=='together'&&!toolSupport(o.readingTools||{})?'Found an answer; independent reading was not observed':'Found an answer with support';
 }
 if(!o.firstCorrect)return 'Found an answer after another try';
 if(o.familiar||o.knownFact||o.priorPassageSeen)return 'Answered after an earlier encounter';
 return o.method==='counted'?'Counted to an answer':o.method==='worked'?'Worked out an answer independently':'Reported knowing the answer';
}

export function openStoryHelp(state){
 const v=currentVisit(state),h=v&&helpers[v.node],d=storyDraft(state);if(!h||!d)return null;
 d.helpUsed=true;d.helper??={exampleId:h.id,attempts:[],input:'',choice:null,revealed:false,steps:0,spotlight:null};d.helper.open=true;return h;
}
export function submitStoryHelp(state,value){
 const v=currentVisit(state),h=v&&helpers[v.node],d=storyDraft(state)?.helper;
 if(!h||!d?.open||!Number.isInteger(value)||value<0||(h.kind==='choice'&&value>=h.choices.length))return false;
 d.attempts.push(value);d.error='';return acceptsAnswer(h,value);
}
