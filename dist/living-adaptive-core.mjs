import {spiralState,currentSpiral,hasSpiral,startSpiral,setSpiralOption,spiralClosed} from './living-spiral-core.mjs';
import {strands,depths,methods,integer,freshAdaptive,taskKey,scienceQuestion,noteQuestion,correctResponse,scienceReady,readingReady} from './living-adaptive-content.mjs';
const profile=state=>spiralState(state)?.adaptive||freshAdaptive();
const closedRounds=s=>s?[...s.history,...(s.current&&spiralClosed(s.current)?[s.current]:[])]:[];
export function adaptiveSuggestion(state,k){
 const s=spiralState(state),p=profile(state),level=p.levels[k],latest=new Map();
 for(const r of closedRounds(s))if(r.revision==='habitat-round-2'&&r.id>=p.epochs[k]&&r.task.teaching.depths[k]===level&&r[k].count)latest.set(r.task.teaching.keys[k],r);
 const visits=[...latest.values()].sort((a,b)=>a.id-b.id).slice(-6);
 let clean=[],retry=[];
 for(const r of visits){const x=r[k],first=x.first;
  if(x.count>1||!first.correct){clean=[];retry.push(r);}
  else if(first.afterHelp||first.afterAudio||first.afterVocabulary||first.afterTogether||k==='math'&&x.method==='together')continue;
  else{retry=[];clean.push(r);}
 }
 const newMatches=clean.filter(r=>!r.task.teaching.familiar[k]).length,familiarMatches=clean.length-newMatches;
 let next=level,reason='A fresh start at the first trail. Pictures and help stay open.';
 if(visits.length){reason='Keep this trail and try another example.';if(retry.length>=2){next=Math.max(1,level-1);reason='Two different tasks needed another try. Try a smaller step with help open.';}else if(retry.length===1)reason='The latest task needed another try. Keep this trail and try another example.';else if(newMatches>=2){next=Math.min(3,level+1);reason='Two different new tasks matched on the first response without scoped support. Try a deeper question.';}else if(familiarMatches>=3){next=Math.min(3,level+1);reason='Three different familiar tasks matched first try without scoped support. Try a deeper question from familiar practice.';}else if(!clean.length)reason='Recent answers used support. Keep this trail, with pictures and help open.';}
 if(level===3&&next===3&&clean.length>=2)reason='Keep exploring this deeper trail in different settings. This small history is practice, not mastery.';
 return {level:next,reason,observed:visits.length,newMatches,familiarMatches,retries:retry.length};
}
export function setAdaptiveChoice(state,k,value){
 if(!strands.includes(k)||!['auto',1,2,3].includes(value)||hasSpiral(state)&&!spiralState(state))return false;
 if(!hasSpiral(state)&&!setSpiralOption(state,'animal','mix'))return false;
 const s=spiralState(state);s.adaptive||=freshAdaptive();s.adaptive.choices[k]=value;return true;
}
function priorFact(state,a,b){const keys=[`${a}x${b}`,`${b}x${a}`];return (Array.isArray(state.exposures)&&state.exposures.some(x=>keys.includes(x)))||(Array.isArray(state.broad?.seenFacts)&&state.broad.seenFacts.some(x=>keys.includes(x)));}
const blank=()=>({count:0,first:null,attempts:[],matched:false,help:false,audio:false});
function offer(state,k){const s=spiralState(state),key=s.current.task.teaching.keys[k];if(!s.adaptive.offered[k].includes(key))s.adaptive.offered[k].push(key);}
export function startAdaptiveSpiral(state){
 if(hasSpiral(state)&&!spiralState(state))return false;
 const old=profile(state),plans=Object.fromEntries(strands.map(k=>[k,adaptiveSuggestion(state,k)]));
 // The legacy starter alone owns case, stock, history and quantity selection.
 if(!startSpiral(state))return false;
 const s=spiralState(state),r=s.current,t=r.task,p=structuredClone(old),h={version:1,depths:{},keys:{},familiar:{},reasons:{},noteVariant:r.id%3,priorFactSeen:priorFact(state,t.packs,t.bites)};
 for(const k of strands){if(p.levels[k]!==plans[k].level){p.levels[k]=plans[k].level;p.epochs[k]=r.id;}h.depths[k]=p.choices[k]==='auto'?p.levels[k]:p.choices[k];h.reasons[k]=p.choices[k]==='auto'?plans[k].reason:`Chosen trail: ${depths[k][h.depths[k]-1]}. Automatic suggestion stays separate.`;}
 t.teaching=h;for(const k of strands){h.keys[k]=taskKey(t,k);h.familiar[k]=p.offered[k].includes(h.keys[k])||(k==='math'&&h.depths.math===1&&h.priorFactSeen);}
 s.adaptive=p;s.current={revision:'habitat-round-2',id:r.id,task:t,place:0,inspected:[],science:{...blank(),place:null,detail:null,changedShown:false,vocabulary:false},reading:{...blank(),tag:null,evidence:null},math:{...blank(),input:'',method:'unreported'},found:false,carried:false,left:false};
 offer(state,'science');return true;
}
const open=state=>{const r=currentSpiral(state);return r?.revision==='habitat-round-2'&&!spiralClosed(r)?r:null;};
function visible(r,k){return k==='science'||k==='reading'&&scienceReady(r)||k==='math'&&r.found;}
function advance(state){const r=open(state);if(scienceReady(r))offer(state,'reading');if(r.found)offer(state,'math');}
export function inspectAdaptive(state,n){const r=open(state);if(!r||!integer(n,0,2))return false;r.place=n;if(!r.inspected.includes(n))r.inspected.push(n);advance(state);return true;}
export function chooseAdaptive(state,k,field,value){
 const r=open(state);if(!r||!strands.includes(k)||!visible(r,k))return false;
 const valid=k==='science'?field==='place'?integer(value,0,2):field==='detail'&&scienceQuestion(r.task).options.some(x=>x.id===value):k==='reading'?field==='tag'?['leaf','star','shell'].includes(value):field==='evidence'&&r.task.teaching.depths.reading===3&&integer(value,0,2):field==='input'?typeof value==='string'&&value.length<=20:field==='method'&&methods.includes(value);
 if(!valid)return false;r[k][field]=value;return true;
}
export function revealAdaptiveChange(state){const r=open(state);if(!r||r.task.teaching.depths.science!==3)return false;r.science.changedShown=true;return true;}
export function supportAdaptive(state,k,kind){
 const r=open(state);if(!r||!strands.includes(k)||!visible(r,k)||!['help','audio','vocabulary'].includes(kind)||kind==='vocabulary'&&k!=='science')return false;
 r[k][kind]=true;if(k==='science'&&kind==='help'&&r.task.teaching.depths.science===3)r.science.changedShown=true;advance(state);return true;
}
export function submitAdaptive(state,k){
 const r=open(state);if(!r||!strands.includes(k)||!visible(r,k)||r[k].matched||r[k].count>=1000000000)return false;
 const x=r[k];let value;
 if(k==='science'){if(x.place===null||x.detail===null||r.task.teaching.depths.science===3&&!x.changedShown)return false;value={place:x.place,detail:x.detail};}
 else if(k==='reading'){if(x.tag===null||r.task.teaching.depths.reading===3&&x.evidence===null)return false;value={tag:x.tag,evidence:x.evidence};}
 else{if(!/^\d{1,3}$/.test(x.input.trim()))return false;value=Number(x.input.trim());}
 const a={value,correct:correctResponse(r,k,value),afterHelp:x.help,afterAudio:x.audio,afterVocabulary:k==='science'&&x.vocabulary,afterTogether:k==='math'&&x.method==='together'};
 if(!x.count)x.first=structuredClone(a);x.count++;x.attempts=[...x.attempts,a].slice(-24);x.matched=a.correct;advance(state);return true;
}
export function findAdaptive(state){const r=open(state);if(!r||r.found||!readingReady(r))return false;r.found=true;advance(state);return true;}
export function carryAdaptive(state){const r=open(state),n=r&&state.cafe?.stock?.[r.task.ingredientId];if(!r?.found||!(r.math.matched||r.math.help)||!integer(n,0,180)||n+r.task.packs*r.task.bites>180)return false;state.cafe.stock[r.task.ingredientId]+=r.task.packs*r.task.bites;r.carried=true;return true;}
export function leaveAdaptive(state){const r=open(state);if(!r)return false;r.left=true;return true;}
export function adaptivePairsShown(state){const r=currentSpiral(state);if(!r||r.revision!=='habitat-round-2')return r?.found?[[r.task.packs,r.task.bites]]:[];if(!r.found)return [];const {packs:p,bites:b}=r.task,d=r.task.teaching.depths.math;if(d===2)return r.math.matched||r.math.help?[[1,b],[p,b]]:[[1,b]];return d===3?[[p,b],[p-1,b]]:[[p,b]];}
