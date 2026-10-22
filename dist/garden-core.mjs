import {frenchPlan,isFrenchExploration,validateFrenchRoute,validFrenchObservation,priorFrenchStorySeen} from './french-core.mjs';
import {entrances,storyNodes} from './story-content.mjs';
import {helpers,acceptsAnswer,cleanHelper} from './help-content.mjs';
import {guides,avatars} from './companions.mjs';
import {parisPlan,isParisExploration,validateParisRoute,priorParisStorySeen,parisSupportUncertain} from './paris-core.mjs';
import {cleanOrder,orderValue} from './paris-pack-core.mjs';
import {captureParisSource,isEnglishParis,parisHelper,parisNode,parisRoute,parisVisitSource,parisVisitStatus} from './paris-visit-source.mjs';
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
 if(observation&&node?.language)record.language=node.language;
 if(!readingNode(node))return;
 record.readingTools=cleanReadingTools(record.readingTools,node.readingText.length);
 record.priorPassageSeen=typeof record.priorPassageSeen==='boolean'?record.priorPassageSeen:seen.some(id=>storyNodes[id]?.passageId===node.passageId);
 if(observation){
  record.readingSkill=node.readingSkill;record.passageId=node.passageId;record.practiceOnly=node.practiceOnly===true;
  if(toolSupport(record.readingTools)||['listened','together'].includes(record.reading)||record.hinted===true||record.revealed===true||record.meaningUsed===true||record.method==='together'){record.supported=true;record.independent=false;record.freshEvidence=false;}
  if(record.practiceOnly||record.priorPassageSeen)record.freshEvidence=false;
 }
}
export function ensureGarden(state){
 const g=state.garden&&typeof state.garden==='object'&&!Array.isArray(state.garden)?state.garden:{};
 state.garden=g;
 if(!guides.some(x=>x.id===g.guide))g.guide='mira';
 if(!avatars.some(x=>x.id===g.avatar))g.avatar='fern';
 if(!Array.isArray(g.visits))g.visits=[];
 if(!Array.isArray(g.seen))g.seen=[];g.seen=g.seen.filter(id=>Object.hasOwn(storyNodes,id)||g.visits.some(v=>isEnglishParis(v)&&!!parisVisitSource(v)?.nodes[id]));
 if(!Array.isArray(g.observations))g.observations=[];
 const ids=new Set();g.visits=g.visits.filter(v=>{
  if(isEnglishParis(v)){
   if(typeof v.id!=='string'||ids.has(v.id))return false;
   ids.add(v.id);
   if(parisVisitStatus(v)!=='current')return true; // Retain old or unreadable records exactly as received.
  }
  // A malformed optional field should not cost the whole saved visit.
  if(v&&typeof v==='object'){if(v.recorded!==undefined&&!Array.isArray(v.recorded))delete v.recorded;if(v.drafts!==undefined&&(!v.drafts||typeof v.drafts!=='object'||Array.isArray(v.drafts)))delete v.drafts;}
  if(!v||typeof v.id!=='string'||(!isEnglishParis(v)&&ids.has(v.id))||!entranceById(v.entrance)||(isFrenchExploration(v)?!validateFrenchRoute(v):!isEnglishParis(v)&&isParisExploration(v)&&!validateParisRoute(v)))return false;
  if(!isEnglishParis(v))ids.add(v.id);
  const route=isEnglishParis(v)?parisRoute(v):isFrenchExploration(v)||isParisExploration(v)?v.route:null,allowed=id=>route?route.includes(id):ownNode(id,v.entrance)&&!id.startsWith('paris-explore-');
  v.recorded=Array.isArray(v.recorded)?v.recorded.filter(allowed):[];
  if(!v.drafts||typeof v.drafts!=='object'||Array.isArray(v.drafts))v.drafts={};
  for(const [id,d] of Object.entries(v.drafts)){const node=isEnglishParis(v)?parisNode(v,id):storyNodes[id];if(!allowed(id)||!cleanDraft(d))delete v.drafts[id];else{cleanHelper(d,id,isEnglishParis(v)?parisHelper(v,id)??null:helpers[id]);cleanReadingRecord(d,node,false,g.seen);if(node.kind==='order')d.order=cleanOrder(d.order);}}
  let id=route?route[0]:entranceById(v.entrance).start;const seen=new Set();
  while(id&&v.recorded.includes(id)&&!seen.has(id)){seen.add(id);id=route?route[route.indexOf(id)+1]:storyNodes[id].next;}
  v.node=id;v.finished=!id;return true;
 });
 g.observations=g.observations.filter(o=>{
  const v=g.visits.find(v=>v.id===o?.visitId);
  if(isEnglishParis(v)&&parisVisitStatus(v)!=='current')return true;
  if(!o||typeof o.visitId!=='string'||!Array.isArray(o.attempts)||!o.attempts.every(Number.isFinite))return false;
  const n=isEnglishParis(v)?parisNode(v,o.nodeId):storyNodes[o.nodeId];if(!n)return false;
  if(isEnglishParis(v)){if(!v.recorded.includes(o.nodeId))return false;}
  else{cleanHelper(o,o.nodeId,helpers[o.nodeId]);cleanReadingRecord(o,n,true,g.seen);if(o.helpUsed){o.supported=true;o.independent=false;o.freshEvidence=false;}}
  if(isFrenchExploration(v)||o.nodeId.startsWith('french-explore-')||o.nodeId==='french-postcard'||o.frenchStory!==undefined){
   if(!validFrenchObservation(o,v))return false;
   if(typeof o.priorStorySeen!=='boolean')o.priorStorySeen=true;
   return true;
  }
  const explore=o.nodeId.startsWith('paris-explore-')||o.parisDestination!==undefined||o.parisStory!==undefined||o.parisVariant!==undefined;
  if(!explore)return !v||!isParisExploration(v)||v.route.includes(o.nodeId);
  if(!v||(isEnglishParis(v)?!parisVisitSource(v):!validateParisRoute(v))||!(isEnglishParis(v)?parisRoute(v):v.route).includes(o.nodeId)||!v.recorded.includes(o.nodeId))return false;
  if(o.parisDestination!==v.paris.destination||o.parisStory!==v.paris.storyId||o.parisVariant!==v.paris.variant||o.parisSelectionReason!==v.paris.reason)return false;
  if(n.type==='task'&&(n.parisDestination!==o.parisDestination||n.parisStory!==o.parisStory||n.parisVariant!==o.parisVariant))return false;
  if(typeof o.priorStorySeen!=='boolean')o.priorStorySeen=true;
  return true;
 });
 if(!g.visits.some(v=>v.id===g.current))g.current=null;
 return g;
}
export const currentVisit=s=>ensureGarden(s).visits.find(v=>v.id===s.garden.current)||null;
export function startVisit(state,entrance,options){
 const g=ensureGarden(state),e=entranceById(entrance);if(!e)return null;
 const french=entrance==='french';
 if(french&&options!==undefined&&(!options||typeof options!=='object'||Array.isArray(options)))return null;
 const plan=french?frenchPlan(state,options?.destination??'bookstall',options?.variant??'auto',options?.storyId??null):options===undefined?null:entrance==='paris'&&options&&typeof options==='object'?parisPlan(state,options.destination,options.variant??'auto',options.storyId??null):null;
 if((french||options!==undefined)&&!plan)return null;
 let parisSource=null;
 if(entrance==='paris'){
  let route=plan?.route;
  if(!route){route=[];const seen=new Set();for(let id=e.start;id&&!seen.has(id);id=storyNodes[id]?.next){route.push(id);seen.add(id);}}
  parisSource=captureParisSource(route,plan);
  if(!parisSource){g.parisStartNotice='This Paris visit could not start because its page is too large or incomplete. Your waiting work is unchanged.';return null;}
  delete g.parisStartNotice;
 }
 let n=1;while(g.visits.some(v=>v.id===`visit-${n}`))n++;
 const v={id:`visit-${n}`,entrance,node:e.start,recorded:[],drafts:{},finished:false,createdAt:new Date().toISOString()};
 if(parisSource)v.parisSource=parisSource;
 if(plan){v[french?'french':'paris']={destination:plan.destination,storyId:plan.storyId,variant:plan.variant,reason:plan.reason};v.route=[...plan.route];v.node=v.route[0];}
 g.visits.push(v);g.current=v.id;return v;
}
export function resumeVisit(state,id){const g=ensureGarden(state);if(!g.visits.some(v=>v.id===id))return false;g.current=id;return true;}
export function storyDraft(state){
 const v=currentVisit(state);if(!v||v.finished||isEnglishParis(v)&&parisVisitStatus(v)!=='current')return null;const n=isEnglishParis(v)?parisNode(v,v.node):storyNodes[v.node];if(!n)return null;
 if(!v.drafts[n.id])v.drafts[n.id]={attempts:[],input:'',choice:null,hinted:false,revealed:false,method:null,reading:'unobserved',familiar:state.garden.seen.includes(n.id),knownFact:(n.facts||[]).some(p=>state.broad?.seenFacts?.includes(pairKey(p))),priorExposureUnknown:!!state.broad?.legacyExposureUnknown};
 if(n.kind==='order')v.drafts[n.id].order=cleanOrder(v.drafts[n.id].order);
 if(readingNode(n)){
  const d=v.drafts[n.id];
  if(v.french){
   if(v.french.priorStorySeen===undefined)v.french.priorStorySeen=priorFrenchStorySeen(state,v.french.storyId);
   if(typeof d.priorStorySeen!=='boolean')d.priorStorySeen=d.priorStorySeen===undefined?v.french.priorStorySeen:true;
  }
  if(v.paris){
   if(v.paris.priorStorySeen===undefined)v.paris.priorStorySeen=priorParisStorySeen(state,v.paris.storyId);
   if(typeof d.priorStorySeen!=='boolean')d.priorStorySeen=d.priorStorySeen===undefined?v.paris.priorStorySeen:true;
  }
  if(d.priorPassageSeen===undefined)d.priorPassageSeen=state.garden.seen.some(id=>storyNodes[id]?.passageId===n.passageId||state.garden.visits.some(other=>isEnglishParis(other)&&parisNode(other,id)?.passageId===n.passageId));
  d.readingTools=cleanReadingTools(d.readingTools,n.readingText.length);
  if(n.language==='fr')d.meaningUsed=d.meaningUsed===true||Object.entries(v.drafts).some(([id,other])=>storyNodes[id]?.passageId===n.passageId&&(other.hinted===true||other.meaningUsed===true));
 }
 return v.drafts[n.id];
}
export function useStoryReadingTool(state,action){
 const v=currentVisit(state),n=v&&(isEnglishParis(v)?parisNode(v,v.node):storyNodes[v.node]);
 if(!readingNode(n)||v.finished||!['audio','sentence-next','whole'].includes(action))return false;
 const d=storyDraft(state);if(d.helper?.open)return false;
 if(action==='audio')d.readingTools.audioRequested=true;
 else if(action==='sentence-next'){d.readingTools.sentenceUsed=true;d.readingTools.focus=d.readingTools.focus===null?0:Math.min(n.readingText.length-1,d.readingTools.focus+1);}
 else d.readingTools.focus=null;
 return true;
}
export function noteStorySeen(state){
 const v=currentVisit(state);if(!v?.node||isEnglishParis(v)&&parisVisitStatus(v)!=='current')return;
 if(v.french){
  storyDraft(state);v.french.displayed=true;
  for(const other of state.garden.visits)if(other.id!==v.id&&other.french?.storyId===v.french.storyId)for(const d of Object.values(other.drafts))d.familiar=true;
 }
 if(v.paris){
  storyDraft(state);v.paris.displayed=true;
  for(const other of state.garden.visits)if(other.id!==v.id&&other.paris?.storyId===v.paris.storyId&&parisVisitStatus(other)==='current')for(const d of Object.values(other.drafts))d.familiar=true;
 }
 if(!state.garden.seen.includes(v.node))state.garden.seen.push(v.node);
 for(const other of state.garden.visits)if(other.id!==v.id&&!(isEnglishParis(other)&&parisVisitStatus(other)!=='current')&&other.drafts?.[v.node])other.drafts[v.node].familiar=true;
 const passageId=(isEnglishParis(v)?parisNode(v,v.node):storyNodes[v.node])?.passageId;
 if(passageId)for(const other of state.garden.visits){if(isEnglishParis(other)&&parisVisitStatus(other)!=='current')continue;for(const [id,d] of Object.entries(other.drafts||{}))if((other.id!==v.id||id!==v.node)&&(isEnglishParis(other)?parisNode(other,id):storyNodes[id])?.passageId===passageId)d.priorPassageSeen=true;}
}
export function noteGardenFactExposure(state,pair,except=null){
 const key=pairKey(pair);for(const v of ensureGarden(state).visits){
  if(isEnglishParis(v)&&parisVisitStatus(v)!=='current')continue;
  for(const [id,d] of Object.entries(v.drafts||{}))if(`${v.id}:${id}`!==except&&((isEnglishParis(v)?parisNode(v,id):storyNodes[id])?.facts||[]).some(p=>pairKey(p)===key))d.knownFact=true;
 }
}
function recordStoryAttempt(n,d,value){
 d.attempts.push(value);d.error='';return acceptsAnswer(n,value);
}
export function submitStory(state,value){
 const v=currentVisit(state),n=v&&(isEnglishParis(v)?parisNode(v,v.node):storyNodes[v.node]),d=storyDraft(state);
 if(!n||!d||d.helper?.open||n.type!=='task'||n.kind==='order'||!Number.isFinite(value))return false;
 if(n.kind==='choice'&&(!Number.isInteger(value)||value<0||value>=n.choices.length))return false;
 if(n.kind==='number'&&(!Number.isInteger(value)||value<0))return false;
 return recordStoryAttempt(n,d,value);
}
export function editStoryOrder(state,action,index){
 const v=currentVisit(state),n=v&&(isEnglishParis(v)?parisNode(v,v.node):storyNodes[v.node]),d=storyDraft(state);
 if(!n||!d||v.finished||n.type!=='task'||n.kind!=='order'||d.helper?.open||d.attempts.some(a=>acceptsAnswer(n,a)))return false;
 if(action==='clear'){d.order=[];return true;}
 if(!Number.isInteger(index)||index<0||index>2)return false;
 if(action==='add'){
  if(d.order.length>=3||d.order.includes(index))return false;
  d.order.push(index);return true;
 }
 if(action==='remove'&&index<d.order.length){d.order.splice(index,1);return true;}
 return false;
}
export function submitStoryOrder(state){
 const v=currentVisit(state),n=v&&(isEnglishParis(v)?parisNode(v,v.node):storyNodes[v.node]),d=storyDraft(state);
 if(!n||!d||v.finished||n.type!=='task'||n.kind!=='order'||d.helper?.open||d.attempts.some(a=>acceptsAnswer(n,a)))return false;
 const value=orderValue(d.order);if(value===null)return false;
 return recordStoryAttempt(n,d,value);
}
export function finishStoryNode(state,skip=false){
 const v=currentVisit(state),n=v&&(isEnglishParis(v)?parisNode(v,v.node):storyNodes[v.node]),d=storyDraft(state);if(!n||!d||v.recorded.includes(n.id))return false;
 if(d.helper?.open)return false;
 const project=n.type==='project',correct=!project&&!skip&&acceptsAnswer(n,d.attempts.at(-1));
 if(!project&&!skip&&(!correct||!['knew','worked','counted','together'].includes(d.method)))return false;
 const firstCorrect=correct&&d.attempts.length===1;
 const tools=readingNode(n)?cleanReadingTools(d.readingTools,n.readingText.length):null;
 const supported=!!d.helpUsed||!!d.hinted||!!d.revealed||d.meaningUsed===true||d.method==='together'||(n.subject==='Reading'&&d.reading!=='independent')||!!tools&&toolSupport(tools);
 const independent=correct&&firstCorrect&&!supported;
 const o={...(n.language?{language:n.language,meaningUsed:d.meaningUsed===true}:{}),visitId:v.id,nodeId:n.id,entrance:v.entrance,title:n.title,subject:n.subject,prompt:n.prompt,answer:project?null:n.answer,acceptedAnswers:project?null:n.answers||[n.answer],choices:n.choices||null,attempts:[...d.attempts],
  status:project?'invitation':skip?(d.attempts.length?'explored':'skipped'):'answered',correct:project?null:correct,firstCorrect:!!firstCorrect,supported,independent:!!independent,
  freshEvidence:!!independent&&!d.familiar&&!d.knownFact&&!d.priorExposureUnknown&&!n.practiceOnly&&!d.priorPassageSeen,
  familiar:!!d.familiar,knownFact:!!d.knownFact,priorExposureUnknown:!!d.priorExposureUnknown,hinted:!!d.hinted,revealed:!!d.revealed,
  helpUsed:!!d.helpUsed,helper:d.helper?JSON.parse(JSON.stringify(d.helper)):null,
  ...(tools?{readingSkill:n.readingSkill,passageId:n.passageId,priorPassageSeen:!!d.priorPassageSeen,readingTools:tools,practiceOnly:!!n.practiceOnly}:{}),
  ...(v.french?{frenchDestination:v.french.destination,frenchStory:v.french.storyId,frenchVariant:v.french.variant,frenchSelectionReason:v.french.reason,priorStorySeen:typeof d.priorStorySeen==='boolean'?d.priorStorySeen:!!v.french.priorStorySeen}:{}),
  ...(v.paris?{parisDestination:v.paris.destination,parisStory:v.paris.storyId,parisVariant:v.paris.variant,parisSelectionReason:v.paris.reason,priorStorySeen:typeof d.priorStorySeen==='boolean'?d.priorStorySeen:!!v.paris.priorStorySeen}:{}),
  designChoice:project?d.designChoice||null:null,context:'guided-story',method:project||skip?null:d.method,reading:['independent','together','unobserved','listened'].includes(d.reading)?d.reading:'unobserved',source:'story',at:new Date().toISOString()};
 state.garden.observations.push(o);v.recorded.push(n.id);const route=isEnglishParis(v)?parisRoute(v):v.route;v.node=route?route[route.indexOf(n.id)+1]:n.next;v.finished=!v.node;
 if(v.finished)v.finishedAt=new Date().toISOString();return o;
}
export function storyDescribe(o){
 if(o.status==='invitation')return 'An unscored project invitation; completion was not checked';
 if(o.status==='skipped')return 'Left unexplored';
 if(!o.correct)return 'An idea to return to';
 const uncertain=parisSupportUncertain(o),parisSupport=o.entrance==='paris'&&o.subject==='Reading'&&(uncertain||o.reading!=='independent'||o.helpUsed||o.hinted||o.revealed||o.method==='together'||toolSupport(o.readingTools||{})||Number.isInteger(o.readingTools?.focus)&&o.readingTools.focus>=0);
 if(o.supported||parisSupport){
  if(uncertain||o.readingTools?.supportUncertain)return 'Found an answer; reading support details are uncertain';
  return o.subject==='Reading'&&!o.helpUsed&&!o.hinted&&!o.revealed&&!o.meaningUsed&&o.method!=='together'&&!toolSupport(o.readingTools||{})?'Found an answer; independent reading was not observed':'Found an answer with support';
 }
 if(!o.firstCorrect)return 'Found an answer after another try';
 if(o.familiar||o.knownFact||o.priorPassageSeen)return 'Answered after an earlier encounter';
 return o.method==='counted'?'Counted to an answer':o.method==='worked'?'Worked out an answer independently':'Reported knowing the answer';
}

export function openStoryHelp(state){
 const v=currentVisit(state),h=v&&(isEnglishParis(v)?parisHelper(v,v.node):helpers[v.node]),d=storyDraft(state);if(!h||!d)return null;
 d.helpUsed=true;d.helper??={exampleId:h.id,attempts:[],input:'',choice:null,revealed:false,steps:0,spotlight:null};d.helper.open=true;return h;
}
export function submitStoryHelp(state,value){
 const v=currentVisit(state),h=v&&(isEnglishParis(v)?parisHelper(v,v.node):helpers[v.node]),d=storyDraft(state)?.helper;
 if(!h||!d?.open||!Number.isInteger(value)||value<0||(h.kind==='choice'&&value>=h.choices.length))return false;
 d.attempts.push(value);d.error='';return acceptsAnswer(h,value);
}
