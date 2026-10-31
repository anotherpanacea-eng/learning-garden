import {makeCargaSource,makeCaminoSource,CAMINO_BUTTONS} from './river-market-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
// The optional spanish root, La carga's frozen errand under spec 324 and El camino's under spec 328.
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const text=(x,max)=>typeof x==='string'&&x.length>0&&x.length<=max;
const bool=x=>typeof x==='boolean';
const own=(x,k)=>Object.hasOwn(x,k),clone=x=>structuredClone(x);
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,39}$/.test(x);
const AMOUNTS=['short','longer'],GRAMMAR=['articles','hay','sounds'],MAX_PICKS=12,MAX_SOURCE=48*1024;
const unique=list=>new Set(list).size===list.length;
const pair=(x,max)=>object(x)&&text(x.es,max)&&text(x.en,max);
export function validCargaSource(s){
 try{
  if(!object(s)||s.format!==1||s.errand!=='carga'||!AMOUNTS.includes(s.amount)||!text(s.title,80)||!text(s.titleEn,80)||!text(s.prompt,400))return false;
  if(new TextEncoder().encode(JSON.stringify(s)).length>MAX_SOURCE)return false;
  if(!Array.isArray(s.sentences)||!s.sentences.length||s.sentences.length>12||!s.sentences.every(x=>pair(x,600)&&id(x.id))||!unique(s.sentences.map(x=>x.id)))return false;
  if(!Array.isArray(s.words)||s.words.length>60||!s.words.every(x=>pair(x,120)))return false;
  if(!Array.isArray(s.phrasebook)||s.phrasebook.length>60||!s.phrasebook.every(x=>pair(x,120)))return false;
  if(!Array.isArray(s.places)||s.places.length<2||s.places.length>6||!s.places.every(p=>object(p)&&id(p.id)&&text(p.label,80)&&text(p.en,80))||!unique(s.places.map(p=>p.id)))return false;
  const places=new Set(s.places.map(p=>p.id));
  if(!Array.isArray(s.items)||!s.items.length||s.items.length>12||!s.items.every(i=>object(i)&&id(i.id)&&id(i.kind)&&text(i.label,80)&&text(i.en,80))||!unique(s.items.map(i=>i.id)))return false;
  const kinds=[...new Set(s.items.map(i=>i.kind))];
  if(!object(s.targets)||Object.keys(s.targets).length!==kinds.length||!kinds.every(k=>own(s.targets,k)&&places.has(s.targets[k])))return false;
  const f=s.feedback;if(!object(f)||!pair(f.all,400)||f.all.id!=='all'||!Array.isArray(f.wrong)||f.wrong.length>36)return false;
  if(!f.wrong.every(w=>pair(w,400)&&id(w.id)&&kinds.includes(w.kind)&&places.has(w.place)&&w.place!==s.targets[w.kind])||!unique(f.wrong.map(w=>w.id))||!unique(f.wrong.map(w=>w.kind+'|'+w.place)))return false;
  // Every possible misplacement has its own line.
  if(!kinds.every(k=>[...places].filter(p=>p!==s.targets[k]).every(p=>f.wrong.some(w=>w.kind===k&&w.place===p))))return false;
  // Grammar notes and the boat line were added to the frozen source later; an older source without them stays readable.
  if(own(s,'grammar')&&!(object(s.grammar)&&Object.keys(s.grammar).length===GRAMMAR.length&&GRAMMAR.every(k=>own(s.grammar,k)&&object(s.grammar[k])&&text(s.grammar[k].title,80)&&text(s.grammar[k].text,1000))))return false;
  if(own(s,'boatLine')&&!pair(s.boatLine,400))return false;
  const q=s.question;if(!pair(q,400)||!Array.isArray(q.choices)||q.choices.length<2||q.choices.length>6)return false;
  if(!q.choices.every(c=>object(c)&&id(c.id)&&text(c.es,80)&&text(c.nudge,600))||!unique(q.choices.map(c=>c.id))||!q.choices.some(c=>c.id===q.fit))return false;
  return true;
 }catch{return false;}
}
const placements=(s,p,complete)=>object(p)&&Object.keys(p).length===s.items.length&&s.items.every(i=>own(p,i.id)&&(p[i.id]===null?!complete:s.places.some(x=>x.id===p[i.id])));
const support=x=>object(x)&&bool(x.meaning)&&bool(x.narration)&&bool(x.oneAtATime);
const outcome=(s,o)=>object(o)&&bool(o.all)&&Array.isArray(o.lines)&&o.lines.length<=36&&o.lines.every(l=>s.feedback.wrong.some(w=>w.id===l))&&unique(o.lines)&&(o.all===(o.lines.length===0));
export function validErrand(e){
 try{
  if(!object(e)||!int(e.tryId,1,Number.MAX_SAFE_INTEGER)||!validCargaSource(e.source))return false;
  const s=e.source;
  if(!object(e.task)||!placements(s,e.task.placements,false))return false;
  const t=e.taskEvidence;if(!object(t)||!int(t.submissions,0,9999)||!Array.isArray(t.hints)||t.hints.length>37||!unique(t.hints))return false;
  if(!t.hints.every(h=>h==='all'||s.feedback.wrong.some(w=>w.id===h)))return false;
  if(t.firstSubmission===null){if(t.submissions!==0)return false;}
  else if(!object(t.firstSubmission)||t.submissions<1||!placements(s,t.firstSubmission.placements,true)||!outcome(s,t.firstSubmission.outcome)||!support(t.firstSubmission.support))return false;
  if(e.answer!==null){const a=e.answer;if(t.firstSubmission===null||!object(a)||!Array.isArray(a.picks)||!a.picks.length||a.picks.length>MAX_PICKS||!a.picks.every(p=>s.question.choices.some(c=>c.id===p))||a.fitted!==(a.picks.at(-1)===s.question.fit))return false;}
  if(!support(e.support)||!['started','done'].includes(e.state)||!bool(e.familiar)||!text(e.at,40))return false;
  if(e.state==='done'&&!(e.answer?.fitted&&allInPlace(s,e.task.placements)))return false;
  return true;
 }catch{return false;}
}
const CAMINO_NODES=['muelle','puente','plaza','panaderia','cafe','correos'],CAMINO_LINES=['nothing','stays','correos'],MAX_MOVES=32,MAX_COUNT=9999;
const move=x=>CAMINO_BUTTONS.includes(x)||x==='back';
export function validCaminoSource(s){
 try{
  if(!object(s)||s.format!==1||s.errand!=='camino'||!AMOUNTS.includes(s.amount)||!text(s.title,80)||!text(s.titleEn,80)||!text(s.prompt,400)||!text(s.place,80)||!text(s.group,80)||!text(s.invitation,400))return false;
  if(new TextEncoder().encode(JSON.stringify(s)).length>MAX_SOURCE)return false;
  if(!Array.isArray(s.sentences)||!s.sentences.length||s.sentences.length>12||!s.sentences.every(x=>pair(x,600)&&id(x.id))||!unique(s.sentences.map(x=>x.id)))return false;
  if(!Array.isArray(s.words)||s.words.length>60||!s.words.every(x=>pair(x,120)))return false;
  if(!Array.isArray(s.phrasebook)||s.phrasebook.length>60||!s.phrasebook.every(x=>pair(x,120)))return false;
  if(!Array.isArray(s.map)||s.map.length!==CAMINO_NODES.length||!s.map.every((n,i)=>object(n)&&n.id===CAMINO_NODES[i]&&text(n.label,80)&&text(n.en,80)))return false;
  if(!Array.isArray(s.buttons)||s.buttons.length!==CAMINO_BUTTONS.length||!s.buttons.every((b,i)=>object(b)&&b.id===CAMINO_BUTTONS[i]&&text(b.es,40)&&text(b.arrow,4)))return false;
  if(s.start!=='muelle'||s.goal!=='panaderia'||s.wrong!=='correos')return false;
  const m=s.moves;if(!object(m)||Object.keys(m).length!==4||!['muelle','puente','plaza','correos'].every(n=>own(m,n)&&object(m[n])&&Object.keys(m[n]).length===4&&CAMINO_BUTTONS.every(b=>own(m[n],b)&&(['nothing','stays'].includes(m[n][b])||(CAMINO_NODES.includes(m[n][b])&&m[n][b]!=='muelle'&&m[n][b]!=='cafe')))))return false;
  if(!object(s.back)||s.back.from!=='correos'||s.back.to!=='plaza'||!text(s.back.label,80))return false;
  const f=s.feedback;if(!object(f)||!pair(f.start,400)||!pair(f.nothing,400)||!text(f.nothing.lead,200)||!text(f.nothing.tail,200)||!object(f.stays)||!text(f.stays.text,400)||!pair(f.correos,400)||!text(f.correos.hint,400)||!pair(f.panaderia,400))return false;
  if(!['start','nothing','stays','correos','panaderia'].every(k=>f[k].id===k))return false;
  if(!(object(s.grammar)&&Object.keys(s.grammar).length===1&&object(s.grammar.directions)&&text(s.grammar.directions.title,80)&&text(s.grammar.directions.text,1000)))return false;
  const q=s.question;if(!pair(q,400)||!Array.isArray(q.choices)||q.choices.length<2||q.choices.length>6)return false;
  if(!q.choices.every(c=>object(c)&&id(c.id)&&text(c.es,80)&&text(c.nudge,600))||!unique(q.choices.map(c=>c.id))||!q.choices.some(c=>c.id===q.fit))return false;
  return true;
 }catch{return false;}
}
const moveList=x=>Array.isArray(x)&&x.length<=MAX_MOVES&&x.every(move);
export function validCaminoErrand(e){
 try{
  if(!object(e)||!int(e.tryId,1,Number.MAX_SAFE_INTEGER)||!validCaminoSource(e.source))return false;
  const s=e.source,k=e.task;
  if(!object(k)||!['muelle','puente','plaza','panaderia','correos'].includes(k.at)||!moveList(k.moves)||!int(k.moveCount,0,MAX_COUNT)||k.moves.length>k.moveCount||(k.moveCount<=MAX_MOVES&&k.moves.length!==k.moveCount))return false;
  const t=e.taskEvidence;if(!object(t)||!Array.isArray(t.hints)||t.hints.length>CAMINO_LINES.length||!unique(t.hints)||!t.hints.every(h=>CAMINO_LINES.includes(h)))return false;
  const a=t.firstArrival;
  if(a!==null&&!(object(a)&&[s.wrong,s.goal].includes(a.destination)&&moveList(a.moves)&&a.moves.length>=1&&int(a.moveCount,1,k.moveCount)&&a.moves.length<=a.moveCount&&support(a.support)))return false;
  if(a===null&&[s.wrong,s.goal].includes(k.at))return false;
  if(e.answer!==null){const x=e.answer;if(a===null||!object(x)||!Array.isArray(x.picks)||!x.picks.length||x.picks.length>MAX_PICKS||!x.picks.every(p=>s.question.choices.some(c=>c.id===p))||x.fitted!==(x.picks.at(-1)===s.question.fit))return false;}
  if(!support(e.support)||!['started','done'].includes(e.state)||!bool(e.familiar)||!text(e.at,40))return false;
  if(e.state==='done'&&!(e.answer?.fitted&&k.at===s.goal))return false;
  return true;
 }catch{return false;}
}
const VALID={carga:validErrand,camino:validCaminoErrand},MAKE={carga:makeCargaSource,camino:makeCaminoSource},SOURCE={carga:validCargaSource,camino:validCaminoSource};
const kindOf=e=>validErrand(e)?'carga':validCaminoErrand(e)?'camino':null;
export const ERRANDS=Object.freeze(['carga','camino']);
export const allInPlace=(s,p)=>s.items.every(i=>p[i.id]===s.targets[i.kind]);
// Marisol's lines for a complete placement: one per kind and wrong place, in companion order.
export function cargaOutcome(s,p){
 const lines=s.feedback.wrong.filter(w=>s.items.some(i=>i.kind===w.kind&&p[i.id]===w.place)).map(w=>w.id);
 return {all:lines.length===0,lines};
}
const rootShape=r=>object(r)&&r.v===1;
const rootReadable=r=>rootShape(r)&&AMOUNTS.includes(r.amount)&&object(r.errands)&&Array.isArray(r.earlier)&&int(r.nextTry,1,Number.MAX_SAFE_INTEGER)&&bool(r.boatLineSeen);
// Every current and retained record of either errand, for try-id collisions.
const tries=r=>[...ERRANDS.filter(k=>own(r.errands,k)).map(k=>r.errands[k]),...r.earlier];
// Done before and familiarity are decided per errand.
const doneBefore=(r,k='carga')=>r.earlier.some(e=>VALID[k](e)&&e.state==='done');
// Any retained try of the same errand had its note opened, finished or not.
const seenBefore=(r,k='carga')=>r.earlier.some(VALID[k]);
const NO_CAMINO=Object.freeze({camino:null,caminoReadable:false,caminoPresent:false,caminoLabel:'none',caminoFamiliar:false,canStartCaminoAgain:false});
export function riverMarketView(state){
 if(!object(state)||!own(state,'spanish'))return {status:'new',amount:'short',carga:null,cargaReadable:false,label:'none',earlier:[],familiar:false,boatLinePending:false,canStartAgain:false,...NO_CAMINO};
 const r=state.spanish;
 if(!rootShape(r))return {status:'unsupported',amount:'short',carga:null,cargaReadable:false,label:'none',earlier:[],familiar:false,boatLinePending:false,canStartAgain:false,...NO_CAMINO};
 if(!rootReadable(r))return {status:'unavailable',amount:'short',carga:null,cargaReadable:false,label:'none',earlier:[],familiar:false,boatLinePending:false,canStartAgain:false,...NO_CAMINO};
 const present=own(r.errands,'carga'),e=present?r.errands.carga:null,readable=present&&validErrand(e);
 const earlier=r.earlier.map(x=>{const kind=kindOf(x);return {readable:kind!==null,kind,errand:kind?x:null};});
 const cPresent=own(r.errands,'camino'),c=cPresent?r.errands.camino:null,cReadable=cPresent&&validCaminoErrand(c),cBefore=doneBefore(r,'camino');
 const camino={camino:cReadable?c:null,caminoReadable:cReadable,caminoPresent:cPresent,caminoLabel:cReadable?(c.state==='done'?'done':'started'):cBefore?'before':cPresent?'started':'none',caminoFamiliar:cReadable?c.familiar:seenBefore(r,'camino'),canStartCaminoAgain:cPresent};
 const before=doneBefore(r),label=readable?(e.state==='done'?'done':'started'):before?'before':present?'started':'none';
 const anyDone=(readable&&e.state==='done')||before;
 return {status:'ready',amount:r.amount,carga:readable?e:null,cargaReadable:readable,cargaPresent:present,label,earlier,familiar:readable?e.familiar:seenBefore(r),boatLinePending:anyDone&&!r.boatLineSeen,canStartAgain:present,...camino};
}
// A duplicated tryId makes every record sharing it ineligible for a story receipt, while each stays readable here.
export function riverMarketTries(state){
 const v=riverMarketView(state);if(v.status!=='ready')return [];
 // Count every shape-readable tryId, readable body or not, before filtering, so an unreadable copy still makes the address ambiguous.
 const r=state.spanish,count=new Map();
 for(const e of tries(r))if(object(e)&&int(e.tryId,1,Number.MAX_SAFE_INTEGER))count.set(e.tryId,(count.get(e.tryId)||0)+1);
 // Colliding ids are excluded across both errands before filtering to La carga, which alone is chapter evidence.
 return tries(r).filter(validErrand).filter(e=>count.get(e.tryId)===1);
}
const fail=error=>({ok:false,error});
const now=()=>new Date().toISOString();
function change(state,fn,options={}){
 try{const next=clone(state),result=fn(next);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(next)||!options.canExport||!options.canExport(next))return fail('capacity');
  state.spanish=next.spanish;return result;
 }catch{return fail('capacity');}
}
const ensure=next=>{if(!own(next,'spanish'))next.spanish={v:1,amount:'short',errands:{},earlier:[],nextTry:1,boatLineSeen:false};const r=next.spanish;return rootReadable(r)?r:null;};
function freezeErrand(r,k='carga'){
 const source=MAKE[k](r.amount);if(!SOURCE[k](source))return null;
 if(tries(r).some(e=>object(e)&&e.tryId===r.nextTry))return null;
 const task=k==='carga'?{placements:Object.fromEntries(source.items.map(i=>[i.id,null]))}:{at:source.start,moves:[],moveCount:0};
 const evidence=k==='carga'?{firstSubmission:null,submissions:0,hints:[]}:{firstArrival:null,hints:[]};
 const e={tryId:r.nextTry,source:clone(source),task,taskEvidence:evidence,answer:null,support:{meaning:false,narration:false,oneAtATime:false},state:'started',familiar:seenBefore(r,k),at:now()};
 r.nextTry++;return e;
}
function edit(state,fn,options,k='carga'){return change(state,next=>{
 const r=ensure(next);if(!r)return fail('unavailable');const e=r.errands[k];if(!VALID[k](e))return fail('unavailable');
 const result=fn(e,r);if(!result.ok||result.changed===false)return result;e.at=now();return VALID[k](e)?result:fail('unavailable');
},options);}
export function setRiverAmount(state,amount,options){return change(state,next=>{
 if(!AMOUNTS.includes(amount))return fail('amount');const r=ensure(next);if(!r)return fail('unavailable');
 if(own(next,'spanish')&&r.amount===amount&&own(state,'spanish'))return {ok:true,changed:false};r.amount=amount;return {ok:true};
},options);}
// Opening the note freezes La carga at the current amount; an open errand is left as it is.
export function openCarga(state,options){return change(state,next=>{
 const r=ensure(next);if(!r)return fail('unavailable');
 if(own(r.errands,'carga'))return own(state,'spanish')?{ok:true,changed:false}:{ok:true};
 const e=freezeErrand(r);if(!e)return fail('unavailable');r.errands.carga=e;return {ok:true};
},options);}
export function placeItem(state,itemId,placeId,options){return edit(state,e=>{
 const s=e.source;if(e.state==='done')return fail('done');
 if(!s.items.some(i=>i.id===itemId)||(placeId!==null&&!s.places.some(p=>p.id===placeId)))return fail('selection');
 if(e.task.placements[itemId]===placeId)return {ok:true,changed:false};e.task.placements[itemId]=placeId;return {ok:true};
},options);}
// With items still on the landing nothing is recorded; otherwise hints are set before Marisol's line shows.
export function submitCarga(state,options){
 const v=riverMarketView(state);const e=v.carga;
 if(e&&e.state!=='done'&&e.source.items.some(i=>e.task.placements[i.id]===null))return {ok:true,changed:false,incomplete:true};
 return edit(state,e=>{
  const s=e.source;if(e.state==='done')return fail('done');
  const result=cargaOutcome(s,e.task.placements),t=e.taskEvidence;
  if(t.submissions>=9999)return fail('capacity');
  if(t.firstSubmission===null)t.firstSubmission={placements:clone(e.task.placements),outcome:clone(result),support:clone(e.support)};
  t.submissions++;
  for(const h of result.all?['all']:result.lines)if(!t.hints.includes(h))t.hints.push(h);
  if(result.all&&e.answer?.fitted)e.state='done';
  return {ok:true,outcome:result};
 },options);
}
export function answerCarga(state,choiceId,options){return edit(state,e=>{
 const s=e.source;if(e.state==='done')return fail('done');if(e.taskEvidence.firstSubmission===null)return fail('not-yet');
 if(!s.question.choices.some(c=>c.id===choiceId))return fail('selection');
 const a=e.answer||{picks:[],fitted:false};if(a.picks.length>=MAX_PICKS)return fail('capacity');
 a.picks.push(choiceId);a.fitted=choiceId===s.question.fit;e.answer=a;
 if(a.fitted&&allInPlace(s,e.task.placements)&&e.taskEvidence.submissions>0&&cargaOutcome(s,e.task.placements).all)e.state='done';
 return {ok:true,fitted:a.fitted};
},options);}
// Support is recorded before it shows; meaning marks the task and the question as supported.
export function useRiverSupport(state,kind,options,errand='carga'){if(!ERRANDS.includes(errand))return fail('selection');return edit(state,e=>{
 if(!['meaning','narration','oneAtATime'].includes(kind))return fail('selection');
 if(e.support[kind])return {ok:true,changed:false};e.support[kind]=true;return {ok:true};
},options,errand);}
// Opening Mi cuaderno or one of its Details notes shows English for every opened errand, so meaning is recorded for each in one write.
export function useCuadernoSupport(state,options){return change(state,next=>{
 const r=ensure(next);if(!r)return fail('unavailable');
 const open=ERRANDS.filter(k=>own(r.errands,k)&&VALID[k](r.errands[k])&&!r.errands[k].support.meaning);
 if(!open.length)return {ok:true,changed:false};
 for(const k of open){r.errands[k].support.meaning=true;r.errands[k].at=now();}
 return {ok:true};
},options);}
export function startCargaAgain(state,options){return change(state,next=>{
 const r=ensure(next);if(!r)return fail('unavailable');if(!own(r.errands,'carga'))return fail('unavailable');
 r.earlier.push(r.errands.carga);delete r.errands.carga;
 const e=freezeErrand(r);if(!e)return fail('unavailable');r.errands.carga=e;return {ok:true};
},options);}
export function seeBoatLine(state,options){return change(state,next=>{
 const r=ensure(next);if(!r)return fail('unavailable');if(r.boatLineSeen)return {ok:true,changed:false};
 if(!riverMarketView(next).boatLinePending)return fail('not-yet');r.boatLineSeen=true;return {ok:true};
},options);}
export function cargaLines(e,ids){const s=e.source;return ids.map(h=>h==='all'?s.feedback.all:s.feedback.wrong.find(w=>w.id===h)).filter(Boolean);}

// El camino (spec 328).
export function openCamino(state,options){return change(state,next=>{
 const r=ensure(next);if(!r)return fail('unavailable');
 if(own(r.errands,'camino'))return own(state,'spanish')?{ok:true,changed:false}:{ok:true};
 const e=freezeErrand(r,'camino');if(!e)return fail('unavailable');r.errands.camino=e;return {ok:true};
},options);}
// One press is one move, resolved from the frozen table; a hint is recorded before its line shows.
export function moveTeo(state,button,options){return edit(state,e=>{
 const s=e.source,k=e.task,t=e.taskEvidence;if(e.state==='done')return fail('done');
 if(!move(button))return fail('selection');if(k.at===s.goal)return fail('arrived');
 if(k.moveCount>=MAX_COUNT)return fail('capacity');
 let to,line;
 if(button==='back'){if(k.at!==s.back.from)return fail('selection');to=s.back.to;}
 else{const cell=s.moves[k.at][button];if(cell==='nothing'||cell==='stays'){to=k.at;line=cell;}else to=cell;}
 const from=k.at;
 if(to!==from&&to===s.wrong)line='correos';else if(to!==from&&to===s.goal)line='panaderia';
 k.at=to;k.moves=[...k.moves,button].slice(-MAX_MOVES);k.moveCount++;
 if(line&&line!=='panaderia'&&!t.hints.includes(line))t.hints.push(line);
 if(t.firstArrival===null&&(to===s.wrong||to===s.goal))t.firstArrival={destination:to,moves:clone(k.moves),moveCount:k.moveCount,support:clone(e.support)};
 if(to===s.goal&&e.answer?.fitted)e.state='done';
 return {ok:true,at:to,line:line||null};
},options,'camino');}
export function answerCamino(state,choiceId,options){return edit(state,e=>{
 const s=e.source;if(e.state==='done')return fail('done');if(e.taskEvidence.firstArrival===null)return fail('not-yet');
 if(!s.question.choices.some(c=>c.id===choiceId))return fail('selection');
 const a=e.answer||{picks:[],fitted:false};if(a.picks.length>=MAX_PICKS)return fail('capacity');
 a.picks.push(choiceId);a.fitted=choiceId===s.question.fit;e.answer=a;
 if(a.fitted&&e.task.at===s.goal)e.state='done';
 return {ok:true,fitted:a.fitted};
},options,'camino');}
export function startCaminoAgain(state,options){return change(state,next=>{
 const r=ensure(next);if(!r)return fail('unavailable');if(!own(r.errands,'camino'))return fail('unavailable');
 r.earlier.push(r.errands.camino);delete r.errands.camino;
 const e=freezeErrand(r,'camino');if(!e)return fail('unavailable');r.errands.camino=e;return {ok:true};
},options);}
export function caminoLine(e,id){const f=e.source.feedback;return own(f,id)?f[id]:null;}
