// Spec 333: frozen case validation, the predicate checker, the 36-arrangement enumerator and the saved root.
import {makeLadderSource} from './lost-found-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),clone=structuredClone;
const id=x=>typeof x==='string'&&/^[a-z0-9-]{1,40}$/.test(x);
const text=x=>typeof x==='string'&&x.length>=1&&x.length<=600;
const count=x=>Number.isInteger(x)&&x>=0&&x<=9999;
const named=x=>object(x)&&id(x.id)&&text(x.label);
const distinct=list=>new Set(list.map(x=>x.id)).size===list.length;
const MAX=32*1024;
export const ROUNDS=Object.freeze([1,2]);
function predOk(p,s){
 if(!object(p))return false;const row=r=>s.rows.some(x=>x.id===r),thing=t=>s.things.some(x=>x.id===t),place=q=>s.places.some(x=>x.id===q);
 if(p.kind==='place')return row(p.row)&&place(p.place);
 if(p.kind==='thing-place')return thing(p.thing)&&place(p.place);
 if(p.kind==='thing')return row(p.row)&&thing(p.thing);
 return false;
}
// Validate the saved source on its own terms, never against today's catalog.
export function validSource(s){
 try{if(!object(s)||new TextEncoder().encode(JSON.stringify(s)).length>MAX)return false;}catch{return false;}
 if(s.format!==1||!id(s.id)||!Number.isInteger(s.model)||!text(s.title)||!text(s.note)||!text(s.worked))return false;
 for(const k of ['rows','things','places'])if(!Array.isArray(s[k])||s[k].length!==3||!s[k].every(named)||!distinct(s[k]))return false;
 if(!Array.isArray(s.clues)||!s.clues.length||s.clues.length>12||!distinct(s.clues))return false;
 if(!s.clues.every(c=>object(c)&&id(c.id)&&Number.isInteger(c.order)&&Number.isInteger(c.round)&&text(c.text)&&predOk(c.pred,s)))return false;
 if(!Array.isArray(s.sentences)||!s.sentences.length||s.sentences.length>16||!distinct(s.sentences))return false;
 if(!s.sentences.every(x=>object(x)&&id(x.id)&&Number.isInteger(x.round)&&text(x.writer)&&text(x.text)&&['saw','think'].includes(x.sort)&&text(x.why)&&(x.clue===null||s.clues.some(c=>c.id===x.clue))))return false;
 if(!Array.isArray(s.reveal)||!s.reveal.every(text)||!object(s.lookingBack)||!text(s.lookingBack.question)||!Array.isArray(s.lookingBack.choices)||!s.lookingBack.choices.length||!s.lookingBack.choices.every(c=>object(c)&&id(c.id)&&text(c.label)&&text(c.response))||!distinct(s.lookingBack.choices))return false;
 return true;
}
const ordered=s=>[...s.clues].sort((a,b)=>a.order-b.order);
export const activeClues=(s,round)=>ordered(s).filter(c=>c.round<=round);
function perms(list){if(list.length<2)return [list];return list.flatMap((x,i)=>perms([...list.slice(0,i),...list.slice(i+1)]).map(p=>[x,...p]));}
// An arrangement maps each row to [thingId, placeId].
export function arrangements(s){
 const out=[];for(const t of perms(s.things.map(x=>x.id)))for(const p of perms(s.places.map(x=>x.id)))out.push(Object.fromEntries(s.rows.map((r,i)=>[r.id,[t[i],p[i]]])));return out;
}
export function holds(pred,a){
 if(pred.kind==='place')return a[pred.row][1]===pred.place;
 if(pred.kind==='thing')return a[pred.row][0]===pred.thing;
 if(pred.kind==='thing-place')return Object.values(a).some(([t,q])=>t===pred.thing&&q===pred.place);
 return false;
}
export const fitting=(s,clues)=>arrangements(s).filter(a=>clues.every(c=>holds(c.pred,a)));
const sameArrangement=(a,b)=>!!a&&!!b&&Object.keys(a).every(r=>a[r][0]===b[r]?.[0]&&a[r][1]===b[r]?.[1]);
// Does it fit? Missing first, then duplicates, then the first broken active clue in clue order.
export function checkAnswer(s,round,answer){
 const rows=s.rows.map(r=>r.id);if(!object(answer)||rows.some(r=>!Array.isArray(answer[r])||answer[r][0]==null||answer[r][1]==null))return {result:'missing'};
 const things=rows.map(r=>answer[r][0]),places=rows.map(r=>answer[r][1]);
 if(new Set(things).size!==3||new Set(places).size!==3)return {result:'duplicate'};
 const broken=activeClues(s,round).find(c=>!holds(c.pred,answer));return broken?{result:broken.id,clue:broken}:{result:'fits'};
}
export function anotherWay(s,answer){const ways=fitting(s,activeClues(s,1));return ways.find(a=>!sameArrangement(a,answer))??ways[0]??null;}
export function arrangementText(s,a){
 const label=(list,k)=>list.find(x=>x.id===k)?.label??k;
 return s.rows.map(r=>`${r.label} had the ${label(s.things,a[r.id][0])} at ${label(s.places,a[r.id][1])}`).join('; ');
}
// Case records.
const validAnswer=(a,s)=>a===null||object(a)&&Object.entries(a).every(([r,v])=>!s.rows.some(x=>x.id===r)||Array.isArray(v)&&v.length===2&&(v[0]===null||s.things.some(t=>t.id===v[0]))&&(v[1]===null||s.places.some(p=>p.id===v[1])));
const validCheck=(c,s)=>object(c)&&ROUNDS.includes(c.round)&&validAnswer(c.answer,s)&&typeof c.result==='string'&&(['fits','missing','duplicate'].includes(c.result)||id(c.result))&&object(c.support)&&typeof c.support.why==='boolean'&&typeof c.support.skipped==='boolean';
export function validCase(r){
 if(!object(r)||!validSource(r.source))return false;const s=r.source;
 if(!object(r.sort)||!Object.values(r.sort).every(v=>v==='saw'||v==='think'))return false;
 if(!Array.isArray(r.skipped)||!r.skipped.every(x=>Number.isInteger(x))||!Array.isArray(r.why)||!r.why.every(x=>typeof x==='string'))return false;
 if(!object(r.marks)||!Object.values(r.marks).every(v=>v==='yes'||v==='no'))return false;
 if(!Number.isInteger(r.round)||![null,'yes','not-yet'].includes(r.tellYet)||!validAnswer(r.answer,s))return false;
 if(!count(r.checks)||(r.checks===0)!==(r.firstCheck===null)||r.firstCheck!==null&&!validCheck(r.firstCheck,s))return false;
 if(typeof r.revealSeen!=='boolean'||!(r.lookingBack===null||s.lookingBack.choices.some(c=>c.id===r.lookingBack))||typeof r.at!=='string')return false;
 return true;
}
// Extensions that would change how an answer is checked make a readable case read-only.
export function caseWritable(r){
 if(!validCase(r))return false;
 if(own(r,'setAside')&&!(Array.isArray(r.setAside)&&r.setAside.length===0))return false;
 return ROUNDS.includes(r.round)&&r.source.clues.every(c=>ROUNDS.includes(c.round))&&r.source.sentences.every(x=>ROUNDS.includes(x.round));
}
export function lostFoundView(state){
 const present=object(state)&&own(state,'mysteries'),root=present?state.mysteries:null;
 if(present&&(!object(root)||root.v!==1))return {status:'unsupported',root,cases:[]};
 const cases=root&&object(root.cases)?root.cases:{},rawCases=root&&own(root,'cases')&&!object(root.cases);
 const kept=own(cases,'ladder'),raw=kept?cases.ladder:null,readable=kept&&validCase(raw);
 const ladder={id:'ladder',kept,raw,record:readable?raw:null,status:rawCases||kept&&!readable?'unreadable':!kept?'new':raw.revealSeen?'solved':'started',writable:!rawCases&&(!kept||caseWritable(raw)),source:readable?raw.source:makeLadderSource()};
 return {status:root?'ready':'new',root,cases:[ladder]};
}
const failure=error=>({ok:false,error});
function mutate(state,fn,options={}){
 if(!object(state)||typeof options.canExport!=='function')return failure('capacity');
 try{const candidate=clone(state);if(!own(candidate,'mysteries'))candidate.mysteries={v:1,cases:{}};
  const root=candidate.mysteries;if(!object(root)||root.v!==1)return failure('unavailable');if(!own(root,'cases'))root.cases={};if(!object(root.cases))return failure('unavailable');
  const result=fn(root,candidate);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(candidate))return failure('capacity');const proposal=clone(root);if(options.canExport(candidate)!==true)return failure('capacity');state.mysteries=proposal;return result;
 }catch{return failure('capacity');}
}
const now=()=>new Date().toISOString();
export function startLadder(state,options){return mutate(state,root=>{
 if(own(root.cases,'ladder'))return caseWritable(root.cases.ladder)?{ok:true,changed:false}:failure('unavailable');
 root.cases.ladder={source:makeLadderSource(),sort:{},skipped:[],why:[],marks:{},round:1,tellYet:null,answer:null,firstCheck:null,checks:0,revealSeen:false,lookingBack:null,at:now()};return {ok:true};
},options);}
function edit(state,fn,options){return mutate(state,root=>{const r=root.cases.ladder;if(!caseWritable(r))return failure('unavailable');const res=fn(r,r.source);if(res.ok&&res.changed!==false)r.at=now();return res;},options);}
const roundSentences=(s,round)=>s.sentences.filter(x=>x.round===round);
export const roundSorted=(r,round)=>r.skipped.includes(round)||roundSentences(r.source,round).every(x=>own(r.sort,x.id));
// A first sort records the choice and the support of showing its Why? together, before the line shows.
export function sortSentence(state,sid,choice,options){return edit(state,(r,s)=>{
 const x=s.sentences.find(y=>y.id===sid);if(!x||x.round>r.round||!['saw','think'].includes(choice))return failure('selection');
 if(own(r.sort,sid)||r.skipped.includes(x.round))return {ok:true,changed:false};r.sort[sid]=choice;if(!r.why.includes(sid))r.why.push(sid);return {ok:true};
},options);}
export function openWhy(state,sid,options){return edit(state,(r,s)=>{
 if(!s.sentences.some(y=>y.id===sid))return failure('selection');if(r.why.includes(sid))return {ok:true,changed:false};r.why.push(sid);return {ok:true};
},options);}
export function sortForMe(state,options){return edit(state,(r,s)=>{
 if(r.skipped.includes(r.round))return {ok:true,changed:false};r.skipped.push(r.round);for(const x of roundSentences(s,r.round))if(!r.why.includes(x.id))r.why.push(x.id);return {ok:true};
},options);}
export const cellIds=s=>[...s.rows.flatMap(r=>s.things.map(t=>`t:${r.id}:${t.id}`)),...s.rows.flatMap(r=>s.places.map(p=>`p:${r.id}:${p.id}`))];
export function setMark(state,cell,mark,options){return edit(state,(r,s)=>{
 if(!cellIds(s).includes(cell)||![null,'yes','no'].includes(mark))return failure('selection');
 if((r.marks[cell]??null)===mark)return {ok:true,changed:false};if(mark===null)delete r.marks[cell];else r.marks[cell]=mark;return {ok:true};
},options);}
export const nextMark=m=>m==null?'no':m==='no'?'yes':null;
export function clearMarks(state,grid,options){return edit(state,(r,s)=>{
 if(!['t','p'].includes(grid))return failure('selection');const ids=cellIds(s).filter(c=>c.startsWith(grid+':')),gone=ids.filter(c=>own(r.marks,c));
 if(!gone.length)return {ok:true,changed:false};for(const c of gone)delete r.marks[c];return {ok:true};
},options);}
export function answerTellYet(state,choice,options){return edit(state,r=>{
 if(!['yes','not-yet'].includes(choice)||r.round!==1||!roundSorted(r,1))return failure('selection');if(r.tellYet!==null)return {ok:true,changed:false};r.tellYet=choice;return {ok:true};
},options);}
export function nextClue(state,options){return edit(state,r=>{
 if(r.tellYet===null)return failure('selection');if(r.round===2)return {ok:true,changed:false};r.round=2;return {ok:true};
},options);}
export function setAnswer(state,row,slot,value,options){return edit(state,(r,s)=>{
 if(!s.rows.some(x=>x.id===row)||![0,1].includes(slot))return failure('selection');const list=slot===0?s.things:s.places;if(value!==null&&!list.some(x=>x.id===value))return failure('selection');
 const a=r.answer??Object.fromEntries(s.rows.map(x=>[x.id,[null,null]]));if(!Array.isArray(a[row]))a[row]=[null,null];if(a[row][slot]===value)return {ok:true,changed:false};a[row][slot]=value;r.answer=a;return {ok:true};
},options);}
export function checkLadder(state,options){return edit(state,(r,s)=>{
 if(!roundSorted(r,r.round))return failure('selection');const c=checkAnswer(s,r.round,r.answer);
 if(r.firstCheck===null)r.firstCheck={round:r.round,answer:clone(r.answer),result:c.result,support:{why:r.why.length>0,skipped:r.skipped.length>0}};r.checks=Math.min(9999,r.checks+1);return {ok:true,...c};
},options);}
export function seeReveal(state,options){return edit(state,(r,s)=>{
 if(r.revealSeen)return {ok:true,changed:false};if(r.round!==2||checkAnswer(s,2,r.answer).result!=='fits')return failure('selection');r.revealSeen=true;return {ok:true};
},options);}
export function lookBack(state,choice,options){return edit(state,(r,s)=>{
 if(!r.revealSeen||!s.lookingBack.choices.some(c=>c.id===choice))return failure('selection');if(r.lookingBack===choice)return {ok:true,changed:false};r.lookingBack=choice;return {ok:true};
},options);}
