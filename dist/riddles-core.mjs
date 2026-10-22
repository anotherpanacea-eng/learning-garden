import {riddles,riddleSizes,riddlePlaces} from './riddles-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),copy=structuredClone;
const bytes=x=>new TextEncoder().encode(x).length;
const code=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9-]{0,39}$/.test(x);
const text=x=>typeof x==='string'&&x.trim().length>0&&bytes(x)<=1600&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
const same=(a,b)=>a===b||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]))||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>own(b,k)&&same(a[k],b[k]));
const sizes=riddleSizes.map(s=>s.id),outcomes=['solved','shown','skipped'];
const fresh=()=>({version:1,size:'any',met:[],current:null,log:[]});
const uniqueCodes=(xs,n)=>Array.isArray(xs)&&xs.length===n&&xs.every(code)&&new Set(xs).size===n;

export function validRiddleSource(s){
 if(!object(s)||!code(s.id)||!text(s.prompt)||!code(s.answer)||!Array.isArray(s.choices)||s.choices.length!==3||!text(s.clue)||!text(s.why)||(s.place!==null&&(!object(s.place)||!text(s.place.label)||typeof s.place.href!=='string'||!/^#[a-z][a-z0-9/-]{0,80}$/.test(s.place.href))))return false;
 const codes=s.choices.map(x=>x?.code);if(!uniqueCodes(codes,3)||!codes.includes(s.answer)||!s.choices.every(c=>object(c)&&text(c.text)&&(c.code===s.answer?c.nudge===null:text(c.nudge))))return false;
 try{return bytes(JSON.stringify(s))<=16384;}catch{return false;}
}
export function validRiddleCurrent(c){
 if(!object(c)||!validRiddleSource(c.source)||c.id!==c.source.id||!uniqueCodes(c.order,3)||!same([...c.order].sort(),c.source.choices.map(x=>x.code).sort())||!Array.isArray(c.picks)||c.picks.length>3||!c.picks.every(code)||new Set(c.picks).size!==c.picks.length||!c.picks.every(x=>c.order.includes(x))||typeof c.clue!=='boolean'||![null,'solved','shown'].includes(c.outcome))return false;
 const answer=c.source.answer;return c.outcome==='solved'?c.picks.at(-1)===answer:!c.picks.includes(answer);
}
export function validRiddleFinished(r){return object(r)&&validRiddleCurrent({...r,outcome:r.outcome==='skipped'?null:r.outcome})&&outcomes.includes(r.outcome)&&Number.isSafeInteger(r.tries)&&r.tries===r.picks.length;}
export function validRiddleLegacyLog(r){return object(r)&&!own(r,'source')&&code(r.id)&&Number.isSafeInteger(r.tries)&&r.tries>=0&&r.tries<=6&&typeof r.clue==='boolean'&&outcomes.includes(r.outcome)&&(r.outcome!=='solved'||r.tries>0);}
export function validRiddles(r){return object(r)&&r.version===1&&sizes.includes(r.size)&&Array.isArray(r.met)&&own(r,'current')&&Array.isArray(r.log)&&(!own(r,'retainedRawCurrent')||Array.isArray(r.retainedRawCurrent));}
// Readable siblings stay open. Raw current/log/met values are never normalized on read.
export function riddleState(state){return !own(state,'riddles')?fresh():validRiddles(state.riddles)?state.riddles:null;}
export function riddleView(state){const r=riddleState(state);if(!r)return {status:'recovery',root:state.riddles};const met=r.met.filter(code),logs=r.log.filter(x=>validRiddleFinished(x)||validRiddleLegacyLog(x)),current=r.current===null?null:validRiddleCurrent(r.current)?r.current:null;return {status:own(state,'riddles')?'ready':'absent',root:r,met,logs,current,unavailableCurrent:r.current!==null&&current===null,rawMet:r.met.length-met.length,rawLog:r.log.length-logs.length};}
function change(state,fn){const r=riddleState(state);if(!r)return false;const result=fn(r);if(result===false)return false;state.riddles=r;return result;}
export const riddleById=id=>riddles.find(x=>x.id===id)||null;
export function riddleSource(card){const p=riddlePlaces[card.place];return {id:card.id,prompt:card.prompt,answer:card.answer,choices:copy(card.choices),clue:card.clue,why:card.why,place:p?{href:p.href,label:p.label}:null};}
export function openRiddle(state){const v=riddleView(state),c=v.root?.current;if(c===null||c===undefined)return null;if(!v.current)return {current:c,card:null};const card=c.source;return {current:c,card,choices:c.order.map(x=>card.choices.find(ch=>ch.code===x))};}
export function poolFor(size){return riddles.filter(x=>size==='any'||(size==='spanish'?x.strand==='spanish':x.band===size));}
export function chooseSize(state,size){return change(state,r=>{if(!sizes.includes(size))return false;r.size=size;return true;});}
function shuffled(xs,random){const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));if(!Number.isSafeInteger(j)||j<0||j>i)return null;[a[i],a[j]]=[a[j],a[i]];}return a;}
function draw(r,random){const pool=poolFor(r.size),c=r.current;if(!pool.length)return false;const at=c?.id?pool.findIndex(x=>x.id===c.id):-1,rotated=[...pool.slice(at+1),...pool.slice(0,at+1)];const met=r.met.filter(code);const card=rotated.find(x=>!met.includes(x.id)&&x.id!==c?.id)||rotated.find(x=>x.id!==c?.id)||rotated[0],source=riddleSource(card),order=shuffled(source.choices.map(ch=>ch.code),random);if(!order||!validRiddleSource(source))return false;r.current={id:card.id,source,order,picks:[],clue:false,outcome:null};if(!met.includes(card.id))r.met.push(card.id);return card.id;}
const finished=c=>({...copy(c),tries:c.picks.length});
export function nextRiddle(state,random=Math.random){return change(state,r=>{const old=r.current;if(old!==null&&!validRiddleCurrent(old))return false;const id=draw(r,random);if(!id)return false;if(old!==null)r.log.push(finished({...old,outcome:old.outcome||'skipped'}));return id;});}
export function replaceRawRiddle(state,random=Math.random){return change(state,r=>{const old=r.current;if(old===null||validRiddleCurrent(old))return false;const id=draw(r,random);if(!id)return false;if(!Array.isArray(r.retainedRawCurrent))r.retainedRawCurrent=[];r.retainedRawCurrent.push(copy(old));return id;});}
export function pickChoice(state,choice){const open=openRiddle(state);if(!open?.card||open.current.outcome!==null)return false;return change(state,r=>{const c=r.current;if(!c.order.includes(choice)||c.picks.includes(choice))return false;c.picks.push(choice);const fits=choice===c.source.answer;if(fits)c.outcome='solved';return {fits};});}
export function askClue(state){const open=openRiddle(state);if(!open?.card||open.current.outcome!==null)return false;return change(state,r=>{r.current.clue=true;return true;});}
export function showAnswer(state){const open=openRiddle(state);if(!open?.card||open.current.outcome!==null)return false;return change(state,r=>{r.current.outcome='shown';return true;});}
export function riddleSummary(r){const source={riddles:r},v=riddleView(source),rounds=[...v.logs,...(v.current?.outcome?[finished(v.current)]:[])],solved=rounds.filter(x=>x.outcome==='solved');return {met:new Set(v.met).size,first:solved.filter(x=>x.tries===1&&!x.clue).length,later:solved.filter(x=>x.tries>1&&!x.clue).length,clue:solved.filter(x=>x.clue).length,shown:rounds.filter(x=>x.outcome==='shown').length,skipped:rounds.filter(x=>x.outcome==='skipped').length,legacy:v.logs.filter(validRiddleLegacyLog).length,unavailable:v.rawLog+v.rawMet+(v.unavailableCurrent?1:0)+(r.retainedRawCurrent?.length||0)};}
export function commitRiddles(state,mutate,canExport=()=>true){let candidate;try{candidate=copy(state);const result=mutate(candidate);if(result===false||!recoveryFitsProgressLimits(candidate)||!canExport(candidate))return false;state.riddles=candidate.riddles;return result;}catch{return false;}}
