import {makeCrossingSource,crossingIds} from './french-ferry-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
// The optional frenchFerry root and its frozen crossings under spec 327.
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const text=(x,max)=>typeof x==='string'&&x.length>0&&x.length<=max;
const bool=x=>typeof x==='boolean';
const own=(x,k)=>Object.hasOwn(x,k),clone=x=>structuredClone(x);
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,39}$/.test(x);
const unique=list=>new Set(list).size===list.length;
const pair=(x,a,b,max)=>object(x)&&text(x[a],max)&&text(x[b],max);
const KINDS=['count','to','from','time'],MAX_SOURCE=32*1024,MAX_COUNT=99;
const DETAIL={count:'count',time:'time',to:'place',from:'place'};
export function validCrossingSource(s){
 try{
  if(!object(s)||s.format!==1||!id(s.crossing)||!pair(s.title,'fr','en',80)||!text(s.note,400))return false;
  if(new TextEncoder().encode(JSON.stringify(s)).length>MAX_SOURCE)return false;
  if(!Array.isArray(s.cards)||s.cards.length!==8||!s.cards.every(c=>pair(c,'fr','en',80)&&id(c.id)&&KINDS.includes(c.kind))||!unique(s.cards.map(c=>c.id)))return false;
  if(!KINDS.every(k=>s.cards.filter(c=>c.kind===k).length===2))return false;
  if(!Array.isArray(s.steps)||s.steps.length!==5||!unique(s.steps.map(x=>x.id)))return false;
  const four=s.steps.slice(0,4),ask=s.steps[4];
  if(!four.every(x=>object(x)&&id(x.id)&&KINDS.includes(x.kind)&&pair(x,'fr','en',200)&&s.cards.some(c=>c.id===x.fit&&c.kind===x.kind)))return false;
  // Every step has a right-kind card with the wrong detail.
  if(!four.every(x=>s.cards.some(c=>c.kind===x.kind&&c.id!==x.fit)))return false;
  if(!object(ask)||ask.kind!=='ask'||!id(ask.id)||!text(ask.prompt,200)||!pair(ask.say,'fr','en',200)||!pair(ask.answer,'fr','en',200)||!['clock','euro'].includes(ask.choiceKind))return false;
  if(!Array.isArray(ask.choices)||ask.choices.length!==3||!ask.choices.every(c=>object(c)&&id(c.id)&&text(c.label,40)&&int(c.value,1,99))||!unique(ask.choices.map(c=>c.id))||!ask.choices.some(c=>c.id===ask.fit))return false;
  const f=s.feedback;if(!object(f)||!object(f.kind)||!object(f.detail)||!KINDS.every(k=>text(f.kind[k],300))||!['count','time','place'].every(k=>text(f.detail[k],300)))return false;
  if(!['aForDou','deForOu','sounds','fit','fit5'].every(k=>text(f[k],300)))return false;
  return pair(s.ending,'fr','en',200);
 }catch{return false;}
}
// One feedback id per pick, in the spec's precedence.
export function feedbackFor(s,stepIndex,cardId){
 const step=s.steps[stepIndex];if(!step)return null;
 if(step.kind==='ask')return cardId===step.fit?'fit5':'sounds';
 const card=s.cards.find(c=>c.id===cardId);if(!card)return null;
 if(card.id===step.fit)return 'fit';
 if(step.kind==='from'&&card.kind==='to')return 'a-for-dou';
 if(step.kind==='to'&&card.kind==='from')return 'de-for-ou';
 if(card.kind!==step.kind)return `kind-${card.kind}`;
 return `detail-${DETAIL[step.kind]}`;
}
export function feedbackLine(s,fid){
 const f=s.feedback;if(!fid)return '';
 if(fid.startsWith('kind-'))return f.kind[fid.slice(5)]||'';
 if(fid.startsWith('detail-'))return f.detail[fid.slice(7)]||'';
 return {fit:f.fit,fit5:f.fit5,sounds:f.sounds,'a-for-dou':f.aForDou,'de-for-ou':f.deForOu}[fid]||'';
}
const choiceIds=(s,i)=>i===4?s.steps[4].choices.map(c=>c.id):s.cards.map(c=>c.id);
const fits=(s,i,pick)=>pick===s.steps[i].fit;
function validStep(s,i,x){
 if(!object(x)||!Array.isArray(x.picks)||!x.picks.every(p=>choiceIds(s,i).includes(p)))return false;
 if(!bool(x.fitted)||x.fitted!==(x.picks.length>0&&fits(s,i,x.picks.at(-1))))return false;
 if(!bool(x.wordsShown)||!bool(x.meaning)||!int(x.listens,0,MAX_COUNT)||!int(x.modelListens,0,MAX_COUNT)||!bool(x.speechStarted))return false;
 if(![null,'said','not-now'].includes(x.said))return false;
 // A step is said only after its fitting pick, except step 5, which is said before its answer.
 if(i<4&&x.said!==null&&!x.fitted)return false;
 if(i===4&&x.picks.length>0&&x.said===null)return false;
 return true;
}
export function validCrossing(c){
 try{
  if(!object(c)||!int(c.tryId,1,Number.MAX_SAFE_INTEGER)||!validCrossingSource(c.source)||!bool(c.voice))return false;
  const s=c.source;if(!Array.isArray(c.steps)||c.steps.length!==5||!c.steps.every((x,i)=>validStep(s,i,x)))return false;
  if(!['started','crossed'].includes(c.state)||!text(c.at,40))return false;
  if((c.state==='crossed')!==c.steps.every(x=>x.fitted))return false;
  return true;
 }catch{return false;}
}
// The current step: the first one not yet fitted and said; steps 1 to 4 are said after fitting, step 5 before.
export function currentStep(c){
 for(let i=0;i<4;i++){const x=c.steps[i];if(!x.fitted)return {index:i,phase:'answer'};if(x.said===null)return {index:i,phase:'say'};}
 const x=c.steps[4];if(x.said===null)return {index:4,phase:'say'};if(!x.fitted)return {index:4,phase:'answer'};
 return {index:5,phase:'end'};
}
const rootShape=r=>object(r)&&r.v===1;
const rootReadable=r=>rootShape(r)&&object(r.crossings)&&Array.isArray(r.earlier)&&int(r.nextTry,1,Number.MAX_SAFE_INTEGER)&&bool(r.taughtSeen);
const records=r=>[...Object.values(r.crossings),...r.earlier];
const blank={status:'new',crossings:{},taughtSeen:false};
export function frenchFerryView(state){
 if(!object(state)||!own(state,'frenchFerry'))return {...blank,crossings:Object.fromEntries(crossingIds.map(k=>[k,{label:'none',crossing:null,present:false}]))};
 const r=state.frenchFerry;
 if(!rootShape(r))return {...blank,status:'unsupported'};
 if(!rootReadable(r))return {...blank,status:'unavailable'};
 const crossings={};
 for(const k of crossingIds){
  const present=own(r.crossings,k),c=present?r.crossings[k]:null,readable=present&&validCrossing(c)&&c.source.crossing===k;
  const before=r.earlier.some(e=>validCrossing(e)&&e.source.crossing===k&&e.state==='crossed');
  const label=readable?(c.state==='crossed'?'crossed':before?'before':'started'):before?'before':present?'started':'none';
  crossings[k]={label,crossing:readable?c:null,present,readable,familiar:r.earlier.some(e=>validCrossing(e)&&e.source.crossing===k)};
 }
 return {status:'ready',crossings,taughtSeen:r.taughtSeen,earlier:r.earlier.map(e=>({readable:validCrossing(e),crossing:validCrossing(e)?e:null}))};
}
const fail=error=>({ok:false,error});
const now=()=>new Date().toISOString();
function change(state,fn,options={}){
 try{const next=clone(state),result=fn(next);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(next)||!options.canExport||!options.canExport(next))return fail('capacity');
  state.frenchFerry=next.frenchFerry;return result;
 }catch{return fail('capacity');}
}
const ensure=next=>{if(!own(next,'frenchFerry'))next.frenchFerry={v:1,crossings:{},earlier:[],nextTry:1,taughtSeen:false};const r=next.frenchFerry;return rootReadable(r)?r:null;};
const emptyStep=()=>({picks:[],fitted:false,wordsShown:false,meaning:false,listens:0,modelListens:0,speechStarted:false,said:null});
function freeze(r,key,voice){
 const source=makeCrossingSource(key);if(!validCrossingSource(source))return null;
 // Try ids are never reused, including ids held by records this version can't read.
 if(records(r).some(e=>object(e)&&e.tryId===r.nextTry))return null;
 const c={tryId:r.nextTry,source:clone(source),voice:voice===true,steps:[0,1,2,3,4].map(emptyStep),state:'started',at:now()};
 r.nextTry++;return c;
}
// Opening a crossing creates only that crossing and marks the teaching card seen in the same write.
export function openCrossing(state,key,{voice=false}={},options){return change(state,next=>{
 if(!crossingIds.includes(key))return fail('selection');
 const r=ensure(next);if(!r)return fail('unavailable');
 if(own(r.crossings,key))return own(state,'frenchFerry')?{ok:true,changed:false}:{ok:true};
 const c=freeze(r,key,voice);if(!c)return fail('unavailable');r.crossings[key]=c;r.taughtSeen=true;return {ok:true};
},options);}
function edit(state,key,fn,options){return change(state,next=>{
 const r=ensure(next);if(!r||!crossingIds.includes(key))return fail('unavailable');const c=r.crossings[key];
 if(!validCrossing(c)||c.source.crossing!==key)return fail('unavailable');
 const result=fn(c,r);if(!result.ok||result.changed===false)return result;c.at=now();return validCrossing(c)?result:fail('unavailable');
},options);}
// A pick on the current step; its feedback id is returned so the line shows only after the write.
export function pickAnswer(state,key,choiceId,options){return edit(state,key,c=>{
 const at=currentStep(c);if(at.phase!=='answer')return fail('not-now');
 const s=c.source,x=c.steps[at.index];if(!choiceIds(s,at.index).includes(choiceId))return fail('selection');
 x.picks.push(choiceId);x.fitted=fits(s,at.index,choiceId);
 if(c.steps.every(y=>y.fitted))c.state='crossed';
 return {ok:true,step:at.index,fitted:x.fitted,feedback:feedbackFor(s,at.index,choiceId)};
},options);}
// I said it or Not this time: recorded as the explorer's own choice; either one moves on.
export function sayAnswer(state,key,said,options){return edit(state,key,c=>{
 if(!['said','not-now'].includes(said))return fail('selection');
 const at=currentStep(c);if(at.phase!=='say')return fail('not-now');
 c.steps[at.index].said=said;return {ok:true,step:at.index};
},options);}
// Support is marked on the current step before the words or the English show.
export function useFerrySupport(state,key,kind,options){return edit(state,key,c=>{
 const field={words:'wordsShown',meaning:'meaning'}[kind];if(!field)return fail('selection');
 const at=currentStep(c);if(at.index>4)return fail('not-now');
 const x=c.steps[at.index];if(x[field])return {ok:true,changed:false};x[field]=true;return {ok:true};
},options);}
// Hear Madame Roux, Hear her again and Hear her answer count as listens; Hear how it sounds as model listens. Neither is support.
export function countListen(state,key,kind,options){return edit(state,key,c=>{
 const field={listen:'listens',model:'modelListens'}[kind];if(!field)return fail('selection');
 const at=currentStep(c);if(at.index>4)return fail('not-now');
 const x=c.steps[at.index];if(x[field]>=MAX_COUNT)return {ok:true,changed:false};x[field]++;return {ok:true};
},options);}
// Only the host's garden-speech-start event from her control on this step, with her words hidden, sets speechStarted.
export function markSpeechStarted(state,key,stepIndex,options){return edit(state,key,c=>{
 const at=currentStep(c);if(at.index!==stepIndex||at.phase!=='answer')return fail('not-now');
 const x=c.steps[at.index];if(x.wordsShown||x.speechStarted)return {ok:true,changed:false};
 x.speechStarted=true;return {ok:true};
},options);}
export function startCrossingAgain(state,key,{voice=false}={},options){return change(state,next=>{
 const r=ensure(next);if(!r||!crossingIds.includes(key)||!own(r.crossings,key))return fail('unavailable');
 r.earlier.push(r.crossings[key]);delete r.crossings[key];
 const c=freeze(r,key,voice);if(!c)return fail('unavailable');r.crossings[key]=c;return {ok:true};
},options);}
