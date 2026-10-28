import {storyView} from './keeper-story-core.mjs';
import {validRecordKeep} from './town-record-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export const actTwoChapters=['market','garden','birthday','show'];
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k);
const str=(x,n=160)=>typeof x==='string'&&x.length<=n,id=x=>str(x)&&x.length>0;
const int=(x,a=0,b=1000000000)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const numericId=x=>int(x,1),liquids=['cloud-water','star-water'];
const kinds={market:['coin-counter','coin-idea'],garden:['town-record','record-plan'],birthday:['whole-batches','tray-idea'],show:['story-loft','shared-show']};
const field=(o,k,valid)=>!own(o,k)?'missing':valid(o[k])?'ready':'unreadable';
const amount=x=>['short','longer'].includes(x);
const container=x=>(Array.isArray(x)||obj(x))&&Object.keys(x).length<=200000;
const step=(x,max=500)=>int(x,0,max)&&x%50===0;
const pair=(x,valid)=>obj(x)&&liquids.every(k=>own(x,k)&&valid(x[k]));
const referenceValid=(chapter,r)=>{
 if(!obj(r))return false;
 if(chapter==='market')return numericId(r.roundId)&&id(r.request);
 if(chapter==='garden')return id(r.visitId)&&['first','latest'].includes(r.edition)&&id(r.sourceId);
 if(chapter==='birthday')return id(r.caseId)&&['kept','offered'].includes(r.edition)&&id(r.sourceId);
 return chapter==='show'&&['draft','shelf'].includes(r.edition)&&numericId(r.showId);
};
export function validActTwoOffer(r,chapter=r?.chapter){return actTwoChapters.includes(chapter)&&obj(r)&&r.kind==='act-two-offer'&&r.version===1&&r.chapter===chapter&&r.activity===kinds[chapter][0]&&r.artifactKind===kinds[chapter][1]&&referenceValid(chapter,r.ref);}
function batchArtifact(a,key){
 if(!obj(a)||!obj(a.source)||!obj(a.input)||!obj(a.assessment)||typeof a.assessment.ready!=='boolean'||!obj(a.support)||!Object.values(a.support).every(v=>typeof v==='boolean')||a.practice!==true||a.modelVisible!==true)return false;
 const s=a.source,w=a.input,m=w.model;
 if(s.id!==key||!id(s.id)||!['title','purpose','destination','modelId','unit'].every(k=>str(s[k],500))||!int(s.revision,0,Number.MAX_SAFE_INTEGER)||!int(s.guests,0,6)||!int(s.baseGuests,0,6)||!int(s.copies,0,3)||!pair(s.base,x=>int(x,0,500))||!pair(s.targets,x=>int(x,0,500)))return false;
 if(!int(w.copies,0,3)||!liquids.includes(w.selectedIngredient)||!obj(m)||!obj(m.jug)||!step(m.jug.amount)||!pair(m.portions,step)||!(m.jug.amount===0?m.jug.ingredient===null:liquids.includes(m.jug.ingredient)&&w.selectedIngredient===m.jug.ingredient)||!liquids.every(k=>1000-m.portions[k]-(m.jug.ingredient===k?m.jug.amount:0)>=0))return false;
 if(!obj(w.reference)||!['cloud','star'].every(k=>str(w.reference[k],24))||!obj(w.reading)||!str(w.reading.text,24)||!(w.reading.unit===null||str(w.reading.unit))||!obj(w.contrast)||!['cloud','star'].every(k=>step(w.contrast[k],200))||!obj(w.message))return false;
 return ['destination','cloudUnit','starUnit'].every(k=>w.message[k]===null||str(w.message[k]))&&(w.message.guests===null||int(w.message.guests,0,6))&&['cloud','star'].every(k=>w.message[k]===null||int(w.message[k],0,500));
}
function sharedShow(s,version){return obj(s)&&numericId(s.id)&&s.shared===true&&id(s.invitation)&&Array.isArray(s.frames)&&s.frames.length>=1&&s.frames.length<=12&&(version!==1||s.frames.length===3)&&s.frames.every(f=>obj(f)&&['actor','place','action','prop'].every(k=>id(f[k]))&&(!own(f,'dialogue')||str(f.dialogue,400)));}
function duplicates(rows){const counts=new Map();for(const x of rows)if(numericId(x?.id))counts.set(x.id,(counts.get(x.id)||0)+1);return new Set([...counts].filter(([,n])=>n>1).map(([key])=>key));}
function sourceView(state,chapter){
 const roots={market:'coinCounter',garden:'townRecord',birthday:'wholeBatches',show:'loft'},name=roots[chapter],base={status:'missing',retainedUnreadable:false,candidates:[]};
 if(!name||!obj(state)||!own(state,name))return base;
 const r=state[name];if(!obj(r)||!(chapter==='show'?[1,2].includes(r.version):r.version===1))return {...base,status:'unavailable',retainedUnreadable:true};
 const add=(ref,label,address)=>{base.candidates.push({key:JSON.stringify([chapter,...address]),chapter,activity:kinds[chapter][0],artifactKind:kinds[chapter][1],ref,label});};
 // Only bound the containers this reader traverses. Opaque malformed siblings
 // cannot invalidate a supported identity in another saved item.
 base.status='ready';
 if(chapter==='market'){
  if(!Array.isArray(r.rounds)||!container(r.rounds))return {...base,status:'unreadable',retainedUnreadable:true};
  const repeated=duplicates(r.rounds);
  for(const x of r.rounds){const coins=v=>obj(v)&&['penny','nickel','dime','quarter'].every(k=>!own(v,k)||int(v[k],0,25));if(obj(x)&&numericId(x.id)&&!repeated.has(x.id)&&id(x.request)&&int(x.price,1,25)&&coins(x.a)&&coins(x.b))add({roundId:x.id,request:x.request},`Coin idea ${x.id}`,[x.id]);else base.retainedUnreadable=true;}
 }else if(chapter==='garden'){
  if(!obj(r.visits)||!container(r.visits))return {...base,status:'unreadable',retainedUnreadable:true};
  for(const [visitId,v] of Object.entries(r.visits)){if(!id(visitId)||!obj(v)){base.retainedUnreadable=true;continue;}for(const [key,edition] of [['firstKept','first'],['kept','latest']]){if(!own(v,key)||v[key]===null)continue;let valid=false;try{valid=validRecordKeep(v[key])&&id(v[key].source.id);}catch{}if(valid)add({visitId,edition,sourceId:v[key].source.id},`Record plan ${visitId} · ${edition==='first'?'first':'latest'} kept`,[visitId,edition]);else base.retainedUnreadable=true;}}
 }else if(chapter==='birthday'){
  if(!obj(r.cases)||!container(r.cases))return {...base,status:'unreadable',retainedUnreadable:true};
  for(const [caseId,v] of Object.entries(r.cases)){if(!id(caseId)||!obj(v)){base.retainedUnreadable=true;continue;}for(const edition of ['kept','offered']){if(!own(v,edition)||v[edition]===null)continue;if(batchArtifact(v[edition],caseId))add({caseId,edition,sourceId:v[edition].source.id},`Tray idea ${caseId} · ${edition==='kept'?'kept plan':'offered tray'}`,[caseId,edition]);else base.retainedUnreadable=true;}}
 }else{
  if(own(r,'draft')&&r.draft!==null){if(sharedShow(r.draft,r.version))add({edition:'draft',showId:r.draft.id},`Show ${r.draft.id} · shared draft`,['draft',r.draft.id]);else if(!obj(r.draft)||r.draft.shared!==false)base.retainedUnreadable=true;}
  if(own(r,'shelf')){if(!Array.isArray(r.shelf)||!container(r.shelf))base.retainedUnreadable=true;else{const repeated=duplicates(r.shelf);for(const s of r.shelf){if(sharedShow(s,r.version)&&!repeated.has(s.id))add({edition:'shelf',showId:s.id},`Show ${s.id} · shared shelf`,['shelf',s.id]);else if(!obj(s)||s.shared!==false||repeated.has(s.id))base.retainedUnreadable=true;}}}
 }
 return base;
}
export function actTwoCandidates(state,chapter){try{return sourceView(state,chapter).candidates;}catch{return [];}}
export function seasonForMonth(month){return int(month,0,11)?month===11||month<2?'winter':month<5?'spring':month<8?'summer':'autumn':null;}
export function actTwoView(state){
 const keeper=storyView(state),story=keeper.status==='ready'?keeper.record:null,exists=story&&own(story.acts,'II'),raw=exists?story.acts.II:null,act=obj(raw)?raw:null;
 const status=keeper.status==='unavailable'?'unavailable':!exists?'missing':act?'ready':'unreadable';
 const startedStatus=act?field(act,'started',x=>typeof x==='boolean'):'missing',endedStatus=act?field(act,'ended',x=>typeof x==='boolean'):'missing',contributionsStatus=act?field(act,'contributions',obj):'missing',seasonStatus=act?field(act,'season',x=>['spring','summer','autumn','winter'].includes(x)):'missing';
 const ended=!!act&&act.ended===true,started=ended||!!act&&act.started===true,contributions={},chapterStatus={};
 for(const chapter of actTwoChapters){const map=contributionsStatus==='ready'?act.contributions:{};chapterStatus[chapter]=field(map,chapter,r=>validActTwoOffer(r,chapter));if(chapterStatus[chapter]==='ready')contributions[chapter]=map[chapter];}
 const count=Object.keys(contributions).length,writable=['missing','ready'].includes(status)&&keeper.status==='ready',pageReady=ended,pageVisible=pageReady&&story.seenScenes.includes('flood-ledger-revealed'),letterReady=pageVisible,letterVisible=letterReady&&story.seenScenes.includes('vadoalto-letter-one-read');
 const frameAmountStatus=story?field(story,'frameAmount',amount):'missing',letterAmountStatus=story?field(story,'letterAmount',amount):'missing';
 const sources=Object.fromEntries(actTwoChapters.map(chapter=>{try{return [chapter,sourceView(state,chapter)];}catch{return [chapter,{status:'unreadable',retainedUnreadable:true,candidates:[]}];}}));
 return {status,storyStatus:keeper.status,pageOneVisible:keeper.pageVisible,act:raw,startedStatus,endedStatus,contributionsStatus,seasonStatus,started,ended,canStart:writable&&keeper.pageVisible&&startedStatus!=='unreadable',canOffer:writable&&started&&contributionsStatus!=='unreadable',canCelebrate:writable&&started&&endedStatus!=='unreadable'&&count>=3,count,contributions,chapterStatus,sources,pageReady,pageVisible,letterReady,letterVisible,stormAdded:pageVisible&&story.seenScenes.includes('storm-mark-added'),frameAmount:frameAmountStatus==='ready'?story.frameAmount:'short',frameAmountStatus,pageAmount:keeper.pageAmount,letterAmount:letterAmountStatus==='ready'?story.letterAmount:'short',letterAmountStatus,season:seasonStatus==='ready'?act.season:null};
}
function mutate(state,options,fn){try{if(storyView(state).status!=='ready')return false;const candidate=structuredClone(state);if(fn(candidate)===false||storyView(candidate).status!=='ready'||!recoveryFitsProgressLimits(candidate)||typeof options?.canExport==='function'&&options.canExport(candidate)!==true)return false;state.story=candidate.story;return true;}catch{return false;}}
export function startActTwo(state,options={}){const v=actTwoView(state);if(v.started)return true;if(!v.canStart)return false;return mutate(state,options,c=>{if(!own(c.story.acts,'II'))c.story.acts.II={started:true,contributions:{},ended:false};else c.story.acts.II.started=true;});}
export function offerActTwo(state,chapter,key,options={}){if(!actTwoChapters.includes(chapter))return false;const v=actTwoView(state);if(v.chapterStatus[chapter]==='ready')return true;if(!v.canOffer||v.chapterStatus[chapter]==='unreadable')return false;const found=actTwoCandidates(state,chapter).find(x=>x.key===key);if(!found)return false;return mutate(state,options,c=>{const a=c.story.acts.II;if(!own(a,'contributions'))a.contributions={};a.contributions[chapter]={kind:'act-two-offer',version:1,chapter,activity:found.activity,artifactKind:found.artifactKind,ref:structuredClone(found.ref)};return validActTwoOffer(a.contributions[chapter],chapter);});}
export function celebrateActTwo(state,month,options={}){const v=actTwoView(state);if(v.ended)return true;const season=seasonForMonth(month);if(!v.canCelebrate||!season)return false;return mutate(state,options,c=>{const a=c.story.acts.II;a.ended=true;if(!own(a,'season'))a.season=season;if(!c.story.seenScenes.includes('town-celebrated'))c.story.seenScenes.push('town-celebrated');});}
function scene(state,name,eligible,options){const v=actTwoView(state);if(!v[eligible])return false;if(state.story.seenScenes.includes(name))return true;return mutate(state,options,c=>{c.story.seenScenes.push(name);});}
export const revealFloodLedger=(state,options={})=>scene(state,'flood-ledger-revealed','pageReady',options);
export const openUpstreamLetter=(state,options={})=>scene(state,'vadoalto-letter-one-read','letterReady',options);
export const addStormMark=(state,options={})=>scene(state,'storm-mark-added','pageVisible',options);
function preference(state,key,value,allowed,eligible,preserveBad,options){const v=actTwoView(state);if(!eligible(v)||!allowed.includes(value)||storyView(state).status!=='ready')return false;if(preserveBad&&own(state.story,key)&&!allowed.includes(state.story[key]))return false;if(state.story[key]===value)return true;return mutate(state,options,c=>{c.story[key]=value;});}
export const setActTwoPageAmount=(state,value,options={})=>preference(state,'pageAmount',value,['short','longer','original'],v=>v.pageVisible,false,options);
export const setActTwoFrameAmount=(state,value,options={})=>preference(state,'frameAmount',value,['short','longer'],v=>v.started||storyView(state).pageVisible,true,options);
export const setLetterAmount=(state,value,options={})=>preference(state,'letterAmount',value,['short','longer'],v=>v.letterVisible,true,options);
