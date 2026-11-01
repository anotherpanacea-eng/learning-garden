import {entrances,storyNodes} from './story-content.mjs';
import {helpers} from './help-content.mjs';
import {parisStories} from './paris-library.mjs';
import {frenchStories} from './french-library.mjs';

export const PARIS_SOURCE_LIMIT=24*1024;
const own=(value,key)=>value!==null&&typeof value==='object'&&Object.hasOwn(value,key);
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const line=(value,max=4096)=>typeof value==='string'&&value.length>0&&value.length<=max;
const lines=(value,min,max)=>Array.isArray(value)&&value.length>=min&&value.length<=max&&value.every(x=>line(x));
const copy=value=>JSON.parse(JSON.stringify(value));
const focusLabels={'paris-note':'Find a detail','paris-reread':'Look inside a word','paris-narrow':'Use nearby clues','paris-infer':'Connect two clues','paris-evidence':'Point to the words','paris-sequence':'Put events in order'};
const facts=value=>Array.isArray(value)&&value.length<=12&&value.every(pair=>Array.isArray(pair)&&pair.length===2&&pair.every(x=>Number.isSafeInteger(x)&&x>=0));

export const isEnglishParis=v=>v?.entrance==='paris';
export const isFrenchParis=v=>v?.entrance==='french'||['french-bookstall','french-river','french-rooftops'].includes(v?.entrance);
export const isParisReadingVisit=v=>isEnglishParis(v)||isFrenchParis(v);
export function parisVisitStatus(visit){
 if(!isParisReadingVisit(visit))return 'other';
 if(!own(visit,'parisSource'))return 'legacy';
 return validParisSource(visit)?'current':'recovery';
}
export const parisVisitSource=visit=>isParisReadingVisit(visit)&&validParisSource(visit)?visit.parisSource:null;
export const parisNode=(visit,id)=>isParisReadingVisit(visit)?parisVisitSource(visit)?.nodes[id]:storyNodes[id];
export const parisHelper=(visit,id)=>isParisReadingVisit(visit)?parisVisitSource(visit)?.helpers[id]:helpers[id];
export const parisRoute=visit=>isParisReadingVisit(visit)?parisVisitSource(visit)?.route:visit?.route;

export function captureParisSource(route,plan=null,entranceId='paris'){
 const entrance=entrances.find(e=>e.id===entranceId);
 const french=isFrenchParis({entrance:entranceId});
 const story=plan&&(french?frenchStories:parisStories).find(s=>s.id===plan.storyId&&s.destination===plan.destination);
 if(!entrance||!Array.isArray(route)||!route.length||plan&&!story)return null;
 const nodes={},examples={};
 for(const id of route){
  const node=storyNodes[id];if(!node||node.entrance!==entranceId)return null;
  nodes[id]=copy(node);
  if(french&&node.type==='project')nodes[id].next=null;
  if(node.type==='task'){
   const helper=helpers[id];if(!helper)return null;
   nodes[id].helperId=helper.id;
   nodes[id].focusLabel=focusLabels[id]||node.readingSkill;
   examples[id]=copy(helper);
  }
 }
 const ending=plan&&!french?{title:'A small errand, a story to share',body:'Your Paris errand is done for now. You could talk about what happened, draw a postcard, or wander somewhere else.',projectTitle:entrance.ending.projectTitle,project:entrance.ending.project}:copy(entrance.ending);
 const source={version:1,route:[...route],nodes,helpers:examples,title:story?.title||entrance.title,chapter:entrance.chapter||'First Morning',ending,connections:copy(story?.connections||[])};
 return new TextEncoder().encode(JSON.stringify(source)).length<=PARIS_SOURCE_LIMIT&&validSourceShape(source,entranceId)?source:null;
}

function validHelper(h,french){
 if(!object(h)||!line(h.id,160)||h.kind!=='choice'||!lines(h.choices,2,4)||!Number.isInteger(h.answer)||h.answer<0||h.answer>=h.choices.length)return false;
 if(own(h,'answers')&&(!Array.isArray(h.answers)||!h.answers.length||h.answers.some(x=>!Number.isInteger(x)||x<0||x>=h.choices.length)))return false;
 if(own(h,'facts')&&!facts(h.facts))return false;
 if(!['title','lesson','passage','prompt','explanation'].every(key=>line(h[key])))return false;
 const m=h.model;
 return object(m)&&(!french||m.language==='fr')&&m.type==='text'&&lines(m.segments,1,12)&&line(m.clue)&&Number.isInteger(m.focus)&&m.focus>=0&&m.focus<m.segments.length;
}
function validNode(n,id,next,examples,entranceId){
 const french=isFrenchParis({entrance:entranceId});
 if(!object(n)||n.id!==id||n.entrance!==entranceId||n.next!==next||!['task','project'].includes(n.type)||!line(n.title)||!line(n.body)||!line(n.guide)||!line(n.prompt)||(!french||n.type!=='project')&&!line(n.talk)||own(n,'visual')||(french?n.language!=='fr':own(n,'language'))||own(n,'facts')&&!facts(n.facts))return false;
 if(n.type==='project')return (!own(n,'talk')||line(n.talk))&&n.kind===undefined&&lines(n.projectOptions,1,8)&&!own(examples,id);
 if(n.subject!=='Reading'||n.practiceOnly!==true||!line(n.passageId,200)||!line(n.readingSkill,200)||!line(n.focusLabel,200)||!lines(n.readingText,1,20)||!line(n.hint)||!line(n.explanation)||!line(n.helperId,160))return false;
 const h=examples[id];if(!validHelper(h,french)||h.id!==n.helperId)return false;
 if(n.kind==='choice')return lines(n.choices,2,4)&&Number.isInteger(n.answer)&&n.answer>=0&&n.answer<n.choices.length&&(!own(n,'answers')||Array.isArray(n.answers)&&n.answers.length>0&&n.answers.every(x=>Number.isInteger(x)&&x>=0&&x<n.choices.length))&&(!own(n,'answerFeedback')||object(n.answerFeedback)&&Object.keys(n.answerFeedback).length<=4&&Object.entries(n.answerFeedback).every(([key,value])=>Number.isInteger(Number(key))&&Number(key)>=0&&Number(key)<n.choices.length&&line(value)));
 if(n.kind==='order')return !own(n,'answers')&&lines(n.orderItems,3,3)&&Array.isArray(n.displayOrder)&&n.displayOrder.length===3&&new Set(n.displayOrder).size===3&&n.displayOrder.every(x=>Number.isInteger(x)&&x>=0&&x<3)&&lines(n.choices,6,6)&&n.answer===0&&(!own(n,'answerFeedback')||object(n.answerFeedback)&&Object.keys(n.answerFeedback).length<=6&&Object.entries(n.answerFeedback).every(([key,value])=>Number.isInteger(Number(key))&&Number(key)>=0&&Number(key)<6&&line(value)));
 return false;
}
function validSourceShape(source,entranceId='paris'){
 if(!object(source)||source.version!==1||!Array.isArray(source.route)||![3,7].includes(source.route.length)||new Set(source.route).size!==source.route.length||!source.route.every(id=>line(id,160))||!object(source.nodes)||!object(source.helpers)||!line(source.title)||!line(source.chapter))return false;
 if(Object.keys(source.nodes).length!==source.route.length||Object.keys(source.helpers).length!==source.route.length-1)return false;
 for(let i=0;i<source.route.length;i++){
  const id=source.route[i];if(!validNode(source.nodes[id],id,source.route[i+1]??null,source.helpers,entranceId))return false;
 }
 const e=source.ending;if(!object(e)||!['title','body','projectTitle','project'].every(key=>line(e[key])))return false;
 return Array.isArray(source.connections)&&source.connections.length<=12&&source.connections.every(c=>object(c)&&line(c.topicId,160)&&line(c.label)&&line(c.scope));
}
export function validParisSource(visit){
 if(!isParisReadingVisit(visit)||!validSourceShape(visit.parisSource,visit.entrance))return false;
 const s=visit.parisSource,r=s.route;
 const french=isFrenchParis(visit),key=french?'french':'paris',other=french?'paris':'french';
 if(own(visit,other))return false;
 if(own(visit,key)){
  const p=visit[key];
  if(!object(p)||visit.entrance!==(french?'french':'paris')||r.length!==3||!Array.isArray(visit.route)||visit.route.length!==r.length||!r.every((id,i)=>visit.route[i]===id)||!line(p.storyId,160)||!line(p.destination,160)||![1,2,3].includes(p.variant)||!line(p.reason,600)||own(p,'priorStorySeen')&&typeof p.priorStorySeen!=='boolean'||own(p,'displayed')&&typeof p.displayed!=='boolean')return false;
  if(r.slice(0,-1).some(id=>s.nodes[id][`${key}Story`]!==p.storyId||s.nodes[id][`${key}Destination`]!==p.destination||s.nodes[id][`${key}Variant`]!==p.variant))return false;
 }else if(r.length!==(french?3:7)||french&&visit.entrance==='french'||own(visit,'route'))return false;
 if(visit.recorded!==undefined&&(!Array.isArray(visit.recorded)||visit.recorded.some((id,i)=>id!==r[i])))return false;
 if(visit.drafts!==undefined&&(!object(visit.drafts)||Object.keys(visit.drafts).some(id=>!r.includes(id))))return false;
 return true;
}
