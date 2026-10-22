import {MESSAGE_CATALOG,messageCase,messageCard,messageClue} from './message-content.mjs';
import {messageState,chooseMessageCase,currentMessage,carryMessage} from './message-core.mjs';

export const LETTER_KINDS=['detail','pair','reader'];
const PLACES=['post','loft'],EXPOSURES=['fresh','familiar','unknown'],SUPPORT=['help','audio','example'];
const MAX_COUNT=1000000,MAX_ID=1000000000;
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,required,optional=[])=>object(x)&&required.every(k=>Object.hasOwn(x,k))&&Object.keys(x).every(k=>required.includes(k)||optional.includes(k));
const bounded=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const clone=x=>structuredClone(x);
const support=()=>({help:false,audio:false,example:false});
const supportValid=x=>keys(x,SUPPORT)&&SUPPORT.every(k=>typeof x[k]==='boolean');
const mergeSupport=(...items)=>Object.fromEntries(SUPPORT.map(k=>[k,items.some(x=>x?.[k]===true)]));
const kindOf=c=>c.kind||'detail';
const readingValid=x=>Array.isArray(x)&&x.length<=2&&new Set(x).size===x.length&&x.every(r=>['self','together'].includes(r));
const initialSuggestion=()=>({kind:'detail',reason:'Try a letter that needs one useful detail. All three kinds are open.'});
const fresh=()=>({version:1,nextId:1,selected:{post:null,loft:null},seen:{},suggested:initialSuggestion(),recent:[],episodes:[]});
const suggestionValid=x=>keys(x,['kind','reason'])&&LETTER_KINDS.includes(x.kind)&&typeof x.reason==='string'&&x.reason.length<=600;
const permutation=(list,expected)=>Array.isArray(list)&&list.length===expected.length&&new Set(list).size===list.length&&expected.every(id=>list.includes(id));
function snapshotValid(x){
 if(!keys(x,['episodeId','caseId','kind','mode','cardId','clueId','fits','clueRelevant','priorExposure','reading','support','qualifies']))return false;
 const c=messageCase(x.caseId),card=c&&messageCard(c,x.cardId),clue=c&&messageClue(c,x.clueId);
 if(!c||!bounded(x.episodeId,1,MAX_ID)||x.kind!==kindOf(c)||!['supplied','human'].includes(x.mode)||!EXPOSURES.includes(x.priorExposure)||!readingValid(x.reading)||!supportValid(x.support)||typeof x.qualifies!=='boolean')return false;
 if(x.mode==='human')return x.cardId===null&&x.clueId===null&&x.fits===null&&x.clueRelevant===null&&!x.qualifies;
 if((x.cardId!==null&&!card)||(x.clueId!==null&&!clue)||x.fits!==(card?card.fits:null)||x.clueRelevant!==(clue?clue.relevant:null))return false;
 return x.qualifies===(x.priorExposure==='fresh'&&x.fits===true&&x.clueRelevant===true&&!x.support.help&&!x.support.example);
}
function episodeValid(e){
 if(!keys(e,['id','caseId','cardOrder','clueOrder','priorExposure','notebook','firstKept'])||!bounded(e.id,1,MAX_ID)||!EXPOSURES.includes(e.priorExposure))return false;
 const c=messageCase(e.caseId),r=messageState({messages:e.notebook});
 if(!c||!r||!permutation(e.cardOrder,c.cards.map(x=>x.id))||!permutation(e.clueOrder,c.clues.map(x=>x.id))||Object.keys(r.cases).length!==1||!r.cases[c.id]||!Object.keys(r.cases[c.id]).length)return false;
 if(PLACES.some(p=>r.selected[p]!==null&&r.selected[p]!==c.id))return false;
 return e.firstKept===null||snapshotValid(e.firstKept)&&e.firstKept.episodeId===e.id&&e.firstKept.caseId===c.id&&(e.firstKept.priorExposure===e.priorExposure||e.priorExposure==='fresh'&&['familiar','unknown'].includes(e.firstKept.priorExposure));
}
export function letterState(state){
 const r=state.letterTrail;
 if(!keys(r,['version','nextId','selected','seen','suggested','recent','episodes'],['recovered'])||r.version!==1||!bounded(r.nextId,1,MAX_ID)||!keys(r.selected,PLACES)||!object(r.seen)||Object.keys(r.seen).length>MESSAGE_CATALOG.length||!suggestionValid(r.suggested)||!Array.isArray(r.recent)||r.recent.length>6||!r.recent.every(snapshotValid)||new Set(r.recent.map(x=>x.episodeId)).size!==r.recent.length||!Array.isArray(r.episodes)||r.episodes.length>26||!r.episodes.every(episodeValid)||new Set(r.episodes.map(e=>e.id)).size!==r.episodes.length)return null;
 if(Object.entries(r.seen).some(([id,n])=>!messageCase(id)||!bounded(n,1,MAX_COUNT)))return null;
 if(r.episodes.some(e=>e.id>=r.nextId||!r.seen[e.caseId])||r.recent.some(x=>x.episodeId>=r.nextId||!r.seen[x.caseId]))return null;
 for(const p of PLACES){const id=r.selected[p];if(id!==null&&(!bounded(id,1,MAX_ID)||!r.episodes.some(e=>e.id===id&&e.notebook.selected[p]===e.caseId&&e.notebook.cases[e.caseId]?.[p])))return null;}
 for(const x of r.recent){const e=r.episodes.find(e=>e.id===x.episodeId);if(e&&JSON.stringify(e.firstKept)!==JSON.stringify(x))return null;}
 return r;
}
export function ensureLetters(state){if(state.letterTrail===undefined)state.letterTrail=fresh();return letterState(state);}
export function recoverLetters(state){if(letterState(state))return false;const old=state.letterTrail;state.letterTrail=fresh();if(old!==undefined)state.letterTrail.recovered=old;return true;}
export function letterSuggestion(state){const r=letterState(state);return r?{...r.suggested}:null;}
export function currentLetter(state,place){
 const r=letterState(state);if(!r||!PLACES.includes(place))return null;
 const episode=r.episodes.find(e=>e.id===r.selected[place]);if(!episode)return null;
 const adapter={messages:episode.notebook},x=currentMessage(adapter,place);
 return x?{episode,case:x.case,work:x.work,adapter}:null;
}
function priorContext(state,id){
 if(state.messages===undefined)return {exposure:'fresh',support:support(),reading:[]};
 const r=messageState(state);if(!r)return {exposure:'unknown',support:support(),reading:[]};
 const works=Object.values(r.cases[id]||{}),readings=[];
 const items=[];
 for(const w of works){items.push(w.support,w.context.priorSupport,w.provenance?.support,...w.attempts.flatMap(a=>[a.support,a.context.priorSupport]));for(const reading of [w.reading,...w.context.priorReading,w.provenance?.reading,...w.attempts.flatMap(a=>[a.reading,...a.context.priorReading])])if(['self','together'].includes(reading)&&!readings.includes(reading))readings.push(reading);}
 return {exposure:works.length?'familiar':'fresh',support:mergeSupport(...items),reading:readings};
}
function ordered(ids,seed){const offset=seed%ids.length;return [...ids.slice(offset),...ids.slice(0,offset)];}
function prune(r){const ids=new Set([...r.episodes.slice(-24).map(e=>e.id),...PLACES.map(p=>r.selected[p]).filter(x=>x!==null)]);r.episodes=r.episodes.filter(e=>ids.has(e.id));}
export function drawLetter(state,place,kind='auto'){
 if(!PLACES.includes(place)||!['auto',...LETTER_KINDS].includes(kind))return false;
 const r=ensureLetters(state);if(!r||r.nextId>=MAX_ID)return false;
 const chosen=kind==='auto'?r.suggested.kind:kind,previous=r.episodes.find(e=>e.id===r.selected[place])?.caseId;
 const candidates=MESSAGE_CATALOG.filter(c=>kindOf(c)===chosen&&((r.seen[c.id]||0)<MAX_COUNT));if(!candidates.length)return false;
 const least=Math.min(...candidates.map(c=>r.seen[c.id]||0));let pool=candidates.filter(c=>(r.seen[c.id]||0)===least);if(pool.length>1)pool=pool.filter(c=>c.id!==previous);
 const c=pool[(r.nextId-1)%pool.length],prior=priorContext(state,c.id),exposure=(r.seen[c.id]||0)>0?'familiar':prior.exposure;
 const adapter={};chooseMessageCase(adapter,place,c.id);const work=currentMessage(adapter,place).work;
 work.context={familiar:exposure!=='fresh',priorSupport:prior.support,priorReading:prior.reading};
 const episode={id:r.nextId++,caseId:c.id,cardOrder:ordered(c.cards.map(x=>x.id),r.nextId-2),clueOrder:ordered(c.clues.map(x=>x.id),r.nextId-2),priorExposure:exposure,notebook:adapter.messages,firstKept:null};
 r.seen[c.id]=(r.seen[c.id]||0)+1;r.episodes.push(episode);r.selected[place]=episode.id;prune(r);return episode;
}
export function selectLetter(state,place,id){
 if(!PLACES.includes(place))return false;const r=letterState(state),e=r?.episodes.find(e=>e.id===id);if(!e)return false;
 if(!e.notebook.cases[e.caseId][place]){const source=PLACES.find(p=>e.notebook.cases[e.caseId][p]);if(!carryMessage({messages:e.notebook},source))return false;}
 e.notebook.selected[place]=e.caseId;r.selected[place]=id;return true;
}
export function carryLetter(state,place){const x=currentLetter(state,place);if(!x)return false;const result=carryMessage(x.adapter,place);if(!result)return false;state.letterTrail.selected[result.target]=x.episode.id;return result;}
function evidence(e){
 // A second desk or a later selection cannot erase help already seen in this letter.
 const works=Object.values(e.notebook.cases[e.caseId]),readings=[],items=[];
 for(const w of works){items.push(w.support,w.context.priorSupport,w.provenance?.support,...w.attempts.flatMap(a=>[a.support,a.context.priorSupport]));for(const reading of [w.reading,...w.context.priorReading,w.provenance?.reading,...w.attempts.flatMap(a=>[a.reading,...a.context.priorReading])])if(['self','together'].includes(reading)&&!readings.includes(reading))readings.push(reading);}
 return {reading:readings,support:mergeSupport(...items)};
}
function keepContext(state,r,e){
 // A paused fresh draft may have become familiar at another desk or in a later round.
 // Freeze the original source, but take a conservative snapshot of all still-known context.
 const legacy=priorContext(state,e.caseId),observations=[legacy];
 for(const other of r.episodes.filter(x=>x.caseId===e.caseId)){observations.push(evidence(other));if(other.firstKept)observations.push(other.firstKept);}
 observations.push(...r.recent.filter(x=>x.caseId===e.caseId));
 const reading=[];for(const item of observations)for(const value of item.reading)if(!reading.includes(value))reading.push(value);
 let exposure=e.priorExposure;
 if(exposure==='fresh')exposure=legacy.exposure==='unknown'?'unknown':legacy.exposure==='familiar'||r.seen[e.caseId]>1?'familiar':'fresh';
 return {priorExposure:exposure,reading,support:mergeSupport(...observations.map(x=>x.support))};
}
export function keepLetter(state,place,mode='supplied'){
 if(!['supplied','human'].includes(mode))return false;const x=currentLetter(state,place);if(!x)return false;
 // The episode marker survives the shorter recent window, so reopening is never a new observation.
 const r=state.letterTrail,e=x.episode;if(e.firstKept)return {snapshot:clone(e.firstKept),repeated:true,suggestion:letterSuggestion(state)};
 const card=mode==='supplied'?messageCard(x.case,x.work.cardId):null,clue=mode==='supplied'?messageClue(x.case,x.work.clueId):null,observed=keepContext(state,r,e);
 const snapshot={episodeId:e.id,caseId:e.caseId,kind:kindOf(x.case),mode,cardId:card?.id||null,clueId:clue?.id||null,fits:card?card.fits:null,clueRelevant:clue?clue.relevant:null,...observed,qualifies:mode==='supplied'&&observed.priorExposure==='fresh'&&card?.fits===true&&clue?.relevant===true&&!observed.support.help&&!observed.support.example};
 e.firstKept=clone(snapshot);r.recent.push(snapshot);r.recent=r.recent.slice(-6);
 if(mode==='supplied'&&snapshot.fits===true&&snapshot.clueRelevant===true){
  const index=LETTER_KINDS.indexOf(snapshot.kind),own=mergeSupport(...Object.values(e.notebook.cases[e.caseId]).map(w=>w.support)),helped=own.help||own.example;
  if(helped)r.suggested={kind:LETTER_KINDS[Math.max(0,index-1)],reason:'You used a hint or a different example. A letter with fewer details is ready next. Every kind stays open.'};
  else {const successes=new Set(r.recent.filter(a=>a.kind===snapshot.kind&&a.qualifies).map(a=>a.caseId));
   if(snapshot.qualifies&&successes.size>=2&&index<2)r.suggested={kind:LETTER_KINDS[index+1],reason:'You helped two new readers with a useful detail. Want to try a new kind of letter?'};
   else r.suggested={kind:snapshot.kind,reason:'Keep exploring this kind of message, or choose another kind whenever you like.'};
  }
 }
 return {snapshot:clone(snapshot),repeated:false,suggestion:letterSuggestion(state)};
}
