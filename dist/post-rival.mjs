import {validConnection} from './learning-connection-data.mjs';
import {generateRivalTask,rivalParameters} from './post-rival-generator.mjs';
export {generateRivalTask} from './post-rival-generator.mjs';
// Original Bramble ribbon puzzles. This module does not change packing or flight.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const clone=x=>JSON.parse(JSON.stringify(x));
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const same=(a,b)=>a===b||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(b).every(k=>Object.hasOwn(a,k)&&same(a[k],b[k]))||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]));
const keys=(x,names)=>object(x)&&Object.keys(x).length===names.length&&names.every(k=>Object.hasOwn(x,k));
// Bramble-1 stores its task and practice copy. Keep their original wording on reload
// while still checking every saved number, unit and picture against the finite task.
function legacyTaskForCompare(x){
 if(Array.isArray(x))return x.map(legacyTaskForCompare);
 if(!object(x))return x;
 return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,['prompt','explanation','label'].includes(k)&&typeof v==='string'&&v.trim()&&v.length<=2000?'#saved-text':legacyTaskForCompare(v)]));
}
function example(kind,a,b,prompt,explanation){return {kind,a,b,answer:kind==='add'?a+b:kind==='subtract'?a-b:a*b,unit:'ribbons',prompt,explanation,pictures:{kind,groups:kind==='add'?[{label:'Blue ribbons',count:a},{label:'Gold ribbons',count:b}]:kind==='subtract'?[{label:'Ready ribbons',count:a,reserved:b}]:Array.from({length:a},(_,i)=>({label:`Bundle ${i+1}`,count:b}))}};}
export const rivalTasks=freeze([
 {...example('add',6,5,'Bramble has 6 blue ribbons and 5 gold ribbons. How many ribbons are there altogether?','Put 6 blue ribbons beside 5 gold ribbons: 6 + 5 = 11 ribbons.'),practice:example('add',4,2,'Try a smaller ribbon puzzle: 4 blue ribbons and 2 gold ribbons.','Bring the two colors together. Count 4, then 5 and 6: 4 + 2 = 6 ribbons.')},
 {...example('subtract',10,3,'Bramble has 10 ribbons. She uses 3 for the gate bow. How many are left?','Set aside 3 of the 10 ribbons. The other 7 remain: 10 − 3 = 7 ribbons.'),practice:example('subtract',8,2,'Try a smaller ribbon puzzle: 8 ribbons, with 2 kept for a bow.','Set aside 2 of the 8 ribbons. Count the 6 remaining ribbons: 8 − 2 = 6.')},
 {...example('multiply',3,4,'Bramble has 3 bundles with 4 ribbons in each bundle. How many ribbons are there altogether?','Each of the 3 bundles has 4 ribbons. Count 4, 8, 12: 3 × 4 = 12 ribbons.'),practice:example('multiply',2,4,'Try a smaller ribbon puzzle: 2 bundles with 4 ribbons in each.','Keep the equal bundles visible. Count 4, then 8: 2 × 4 = 8 ribbons.')},
]);
const parse=input=>{const s=input.trim(),n=s!==''&&/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s)?Number(s):NaN;return Number.isFinite(n)?n:null;};
const phases=['question','practice','resolved','continued','bypassed'];
function validLegacyRival(r){
 if(!keys(r,['revision','task','reason','phase','input','feedback','practiceStep','supported','audioRequested','attempts','resolution'])||r.revision!=='bramble-1'||!rivalTasks.some(t=>same(legacyTaskForCompare(t),legacyTaskForCompare(r.task)))||!['same-operation','neutral-mix'].includes(r.reason)||!phases.includes(r.phase)||typeof r.input!=='string'||typeof r.feedback!=='string'||!Number.isInteger(r.practiceStep)||r.practiceStep<0||r.practiceStep>2||typeof r.supported!=='boolean'||typeof r.audioRequested!=='boolean'||!Array.isArray(r.attempts)||r.attempts.length>24||![null,'answered','together'].includes(r.resolution))return false;
 if((r.audioRequested||r.phase==='practice'||r.practiceStep>0)&&!r.supported)return false;
 let priorSupport=false;
 for(let i=0;i<r.attempts.length;i++){
  const a=r.attempts[i];
  if(!keys(a,['input','value','correct','afterSupport'])||typeof a.input!=='string'||!(a.value===null||typeof a.value==='number'&&Number.isFinite(a.value))||typeof a.correct!=='boolean'||typeof a.afterSupport!=='boolean'||a.value!==parse(a.input)||a.correct!==(a.value!==null&&a.value===r.task.answer)||priorSupport&&!a.afterSupport||a.afterSupport&&!r.supported||a.correct&&i!==r.attempts.length-1)return false;
  if(!a.correct&&!r.supported)return false;
  priorSupport=a.afterSupport||!a.correct;
 }
 const answered=r.attempts.at(-1)?.correct===true,resolved=['resolved','continued'].includes(r.phase);
 if(resolved!==(r.resolution!==null)||r.resolution==='answered'&&!answered||r.resolution==='together'&&(!r.supported||answered)||answered&&r.resolution!=='answered')return false;
 return true;
}
export const rivalBlocks=v=>!!v&&!v.closed&&validPostRival(v.rival)&&['question','practice','resolved'].includes(v.rival.phase);
function visit(state){const p=state?.postOffice;if(!object(p)||p.version!==1||!Array.isArray(p.visits))return null;const v=p.visits.find(v=>object(v)&&v.id===p.current);return v&&!v.closed?v:null;}
function current(state,allowed=['question','practice','resolved']){const v=visit(state);return v&&validPostRival(v.rival)&&allowed.includes(v.rival.phase)?v.rival:null;}
export function startPostRival(state,practice=false){
 const v=visit(state);if(!v||v.completed||Object.hasOwn(v,'rival')||typeof practice!=='boolean')return false;
 const neutral={'clover-buns':'add','ember-ribbons':'subtract','purl-blankets':'multiply','moss-seeds':'add','wren-flags':'subtract','dot-stars':'multiply'};
 const observed=v.packing?.supported===true||Array.isArray(v.packing?.attempts)&&v.packing.attempts.some(a=>a?.correct===false),kind=observed?v.order?.math?.kind:neutral[v.order?.id],task=rivalTasks.find(t=>t.kind===kind);
 if(!task)return false;
 v.rival={revision:'bramble-1',task:clone(task),reason:observed?'same-operation':'neutral-mix',phase:practice?'practice':'question',input:'',feedback:'',practiceStep:0,supported:practice,audioRequested:false,attempts:[],resolution:null};return true;
}
export function setRivalInput(state,text){const r=current(state,['question']);if(!r||typeof text!=='string')return false;r.input=text;r.feedback='';return true;}
export function submitRival(state){
 const r=current(state,['question']);if(!r)return false;
 const value=parse(r.input),correct=value!==null&&value===r.task.answer;
 r.attempts.push({input:r.input,value,correct,afterSupport:r.supported});r.attempts=r.attempts.slice(-24);
 if(correct){r.phase='resolved';r.resolution='answered';r.feedback='Bramble smiles and untangles the ribbon gate. Your delivery is ready to continue.';}
 else{r.supported=true;r.phase='practice';r.practiceStep=0;r.feedback='Let’s try a different ribbon example together. Your puzzle and your parcel are waiting.';}
 return true;
}
export function openRivalPractice(state){const r=current(state,['question','practice']);if(!r)return false;r.phase='practice';r.practiceStep=0;r.supported=true;return true;}
export function stepRivalPractice(state,action){const r=current(state,['practice']);if(!r||![1,-1,'reset'].includes(action))return false;r.practiceStep=action==='reset'?0:Math.max(0,Math.min(2,r.practiceStep+action));return true;}
export function returnRivalQuestion(state){const r=current(state,['practice']);if(!r)return false;r.phase='question';return true;}
export function solveRivalTogether(state){const r=current(state,['question','practice']);if(!r)return false;r.supported=true;r.phase='resolved';r.resolution='together';r.feedback=r.task.explanation+' Bramble untangles the gate. Your delivery is ready to continue.';return true;}
export function bypassRival(state){const r=current(state,['question','practice']);if(!r||!canArchive(state,r))return false;r.phase='bypassed';r.resolution=null;r.feedback='You take the quiet route. Your delivery is waiting where you left it.';archive(state,r);return true;}
export function continueRival(state){const r=current(state,['resolved']);if(!r||!canArchive(state,r))return false;r.phase='continued';archive(state,r);return true;}
export function noteRivalAudio(state){const r=current(state);if(!r)return false;r.audioRequested=true;r.supported=true;return true;}

const methods=['recalled','worked','counting','together'];
const reasons=['new example','revisit','related example','familiar example','starting mix','connected example'];
const integer=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const MAX_ROUND=Number.MAX_SAFE_INTEGER;
const poolSizes={add:400,subtract:190,multiply:144};
const terminal=r=>['continued','bypassed'].includes(r.phase);
const roundKey=r=>`${r.task.kind}:${r.task.a}:${r.task.b}`;
// Saved wording and pictures belong to the frozen round; the page draws from a, b and answer.
// Check only those numbers, not today's generator output.
function validFrozenExample(m,withPractice=false){
 return keys(m,['kind','a','b','scene','answer','unit','prompt','explanation','pictures',...(withPractice?['practice']:[])])&&rivalParameters(m.kind,m.a,m.b)&&integer(m.scene,0,2)&&m.answer===(m.kind==='add'?m.a+m.b:m.kind==='subtract'?m.a-m.b:m.a*m.b)&&typeof m.unit==='string'&&typeof m.prompt==='string'&&typeof m.explanation==='string'&&object(m.pictures)&&(!withPractice||validFrozenExample(m.practice));
}
const validGeneratedTask=task=>validFrozenExample(task,true);
function validGeneratedRival(r){
 if(!object(r)||!keys(r,['revision','id','task','reason','phase','input','feedback','practiceStep','supported','audioRequested','attempts','resolution','method','decompositionStep',...(Object.hasOwn(r,'connection')?['connection']:[]),...(Object.hasOwn(r,'priorFactShown')?['priorFactShown']:[])])||r.revision!=='bramble-2'||!integer(r.id,1,MAX_ROUND-1)||!validGeneratedTask(r.task)||!reasons.includes(r.reason)||!phases.includes(r.phase)||typeof r.input!=='string'||typeof r.feedback!=='string'||!integer(r.practiceStep,0,2)||typeof r.supported!=='boolean'||typeof r.audioRequested!=='boolean'||!Array.isArray(r.attempts)||r.attempts.length>24||![null,'answered','together'].includes(r.resolution)||r.method!==null&&!methods.includes(r.method)||r.decompositionStep!==null&&!integer(r.decompositionStep,0,2)||(Object.hasOwn(r,'priorFactShown')&&r.priorFactShown!==true))return false;
 if(Object.hasOwn(r,'connection')&&(!validConnection(r.connection,r.task.a,r.task.b)||r.task.kind!=='multiply'||r.reason!=='connected example')||r.reason==='connected example'&&!Object.hasOwn(r,'connection'))return false;
 if((r.audioRequested||r.phase==='practice'||r.practiceStep>0||r.decompositionStep!==null||r.method==='together')&&!r.supported)return false;
 let priorSupport=false;
 for(let i=0;i<r.attempts.length;i++){
  const a=r.attempts[i];
  if(!keys(a,['input','value','correct','afterSupport'])||typeof a.input!=='string'||!(a.value===null||typeof a.value==='number'&&Number.isFinite(a.value))||typeof a.correct!=='boolean'||typeof a.afterSupport!=='boolean'||a.value!==parse(a.input)||a.correct!==(a.value!==null&&a.value===r.task.answer)||priorSupport&&!a.afterSupport||a.afterSupport&&!r.supported||a.correct&&i!==r.attempts.length-1||!a.correct&&!r.supported)return false;
  priorSupport=a.afterSupport||!a.correct;
 }
 const answered=r.attempts.at(-1)?.correct===true,resolved=['resolved','continued'].includes(r.phase);
 if(resolved!==(r.resolution!==null)||r.resolution==='answered'&&!answered||r.resolution==='together'&&(!r.supported||answered)||answered&&r.resolution!=='answered'||r.method!==null&&(!answered||!resolved))return false;
 return true;
}
export function validPostRival(r){return validLegacyRival(r)||validGeneratedRival(r);}
// Qualify only the current, unfinished generated puzzle when this exact fact is shown elsewhere.
export function notePendingBrambleFactExposure(state,pair){
 const v=visit(state),r=v?.rival;
 if(!Array.isArray(pair)||pair.length!==2||!validBrambleNotebook(state?.postOffice)||!validGeneratedRival(r)||r.task.kind!=='multiply'||!['question','practice'].includes(r.phase)||r.resolution!==null||r.priorFactShown===true)return false;
 if(!(r.task.a===pair[0]&&r.task.b===pair[1]||r.task.a===pair[1]&&r.task.b===pair[0]))return false;
 r.priorFactShown=true;return true;
}
// Pure validation. A malformed individual rival is left for visit-level recovery.
export function validBrambleNotebook(p){
 if(!object(p)||!Array.isArray(p.visits))return false;
 const rounds=p.visits.filter(object).map(v=>v.rival).filter(r=>validGeneratedRival(r));
 if(!Object.hasOwn(p,'bramble'))return rounds.length===0;
 const b=p.bramble;
 if(!keys(b,['version','nextRound','mode','table','cursors','history',...(object(b)&&Object.hasOwn(b,'connectedRounds')?['connectedRounds']:[])])||b.version!==1||!integer(b.nextRound,1,MAX_ROUND)||!['mixed','multiply','add','subtract'].includes(b.mode)||!integer(b.table,0,12)||!keys(b.cursors,['add','subtract','multiply'])||!Object.entries(poolSizes).every(([kind,size])=>integer(b.cursors[kind],0,size-1))||!Array.isArray(b.history)||b.history.length>96||!b.history.every(r=>validGeneratedRival(r)&&terminal(r)))return false;
 if(Object.hasOwn(b,'connectedRounds')&&!integer(b.connectedRounds,0,b.nextRound-1))return false;
 const ids=new Set();
 for(const r of b.history){if(ids.has(r.id)||r.id>=b.nextRound)return false;ids.add(r.id);}
 const visitIds=new Set();
 for(const r of rounds){
  if(visitIds.has(r.id)||r.id>=b.nextRound)return false;
  visitIds.add(r.id);
  const archived=b.history.find(h=>h.id===r.id);
  if(archived&&!same(archived,r))return false;
  // Every retained terminal must have been archived unless it predates the window.
  if(terminal(r)&&!archived&&b.history.length<96)return false;
 }
 return true;
}
function notebook(state){
 const p=state?.postOffice;
 if(!validBrambleNotebook(p))return null;
 if(!Object.hasOwn(p,'bramble'))p.bramble={version:1,nextRound:1,mode:'mixed',table:0,cursors:{add:0,subtract:0,multiply:0},history:[]};
 return p.bramble;
}
export function setBrambleMode(state,mode){if(!['mixed','multiply','add','subtract'].includes(mode)||!visit(state))return false;const b=notebook(state);if(!b)return false;b.mode=mode;return true;}
export function setBrambleTable(state,n){if(!integer(n,0,12)||!visit(state))return false;const b=notebook(state);if(!b)return false;b.table=n;return true;}
function canArchive(state,r){return r.revision==='bramble-1'||validBrambleNotebook(state.postOffice);}
function archive(state,r){
 if(r.revision!=='bramble-2')return;
 const b=state.postOffice.bramble;
 if(!b.history.some(h=>h.id===r.id)){b.history.push(clone(r));b.history=b.history.slice(-96);}
}
function pool(kind,table){
 if(kind==='multiply')return Array.from({length:table?12:144},(_,i)=>[table||1+Math.floor(i/12),1+i%12]);
 if(kind==='add')return Array.from({length:400},(_,i)=>[1+Math.floor(i/20),1+i%20]);
 const result=[];for(let a=2;a<=20;a++)for(let b=1;b<a;b++)result.push([a,b]);return result;
}
const pairKey=(kind,p)=>`${kind}:${p[0]}:${p[1]}`;
function selected(b){
 const id=b.nextRound-(b.connectedRounds||0),kind=b.mode==='mixed'?['multiply','add','multiply','subtract'][(id-1)%4]:b.mode;
 const pairs=pool(kind,kind==='multiply'?b.table:0),eligible=new Set(pairs.map(p=>pairKey(kind,p))),recent=b.history.slice(-3).map(roundKey),latest=new Map();
 for(const r of b.history){if(r.task.kind===kind&&r.phase!=='bypassed'&&eligible.has(roundKey(r))){latest.delete(roundKey(r));latest.set(roundKey(r),r);}}
 const evidence=[...latest.values()];
 const needs=r=>r.supported||r.attempts.some(a=>!a.correct)||['counting','together'].includes(r.method)||r.resolution==='together';
 const clean=r=>r.resolution==='answered'&&r.attempts.length===1&&r.attempts[0].correct&&!r.attempts[0].afterSupport&&!r.priorFactShown&&!needs(r);
 const fresh=()=>{
  let p;for(let i=0;i<pairs.length;i++){
   p=pairs[(b.cursors[kind]*37)%pairs.length];b.cursors[kind]=(b.cursors[kind]+1)%poolSizes[kind];
   if(!recent.includes(pairKey(kind,p)))break;
  }
  return {pair:p,reason:'new example'};
 };
 const purpose=(id-1)%3;
 if(purpose===0){
  const review=evidence.filter(needs).at(0);
  if(review){
   const p=[review.task.a,review.task.b];
   if(!recent.includes(roundKey(review)))return {kind,pair:p,reason:'revisit'};
   const related=pairs.filter(q=>!recent.includes(pairKey(kind,q))&&(q[0]===p[0]&&q[1]<p[1]||q[1]===p[1]&&q[0]<p[0]));
   if(related.length)return {kind,pair:related.at(-1),reason:'related example'};
  }
 }
 if(purpose===1){
  const comfortable=evidence.filter(r=>clean(r)&&!recent.includes(roundKey(r)));
  if(comfortable.length)return {kind,pair:[comfortable.at(-1).task.a,comfortable.at(-1).task.b],reason:'familiar example'};
 }
 if(purpose!==2){
  const starting=pairs.filter(p=>[1,2,5,10].includes(p[0])&&!recent.includes(pairKey(kind,p)));
  if(starting.length)return {kind,pair:starting[(id-1)%starting.length],reason:'starting mix'};
 }
 return {kind,...fresh()};
}
export function startAdaptiveRival(state,practice=false,connection=null){
 if(connection!==null&&!validConnection(connection))return false;
 const v=visit(state),p=state?.postOffice;
 if(!v||typeof practice!=='boolean'||Object.hasOwn(v,'rival')&&(!validPostRival(v.rival)||!['resolved','continued','bypassed'].includes(v.rival.phase))||!validBrambleNotebook(p)||p.bramble?.nextRound>=MAX_ROUND)return false;
 if(Object.hasOwn(v,'rivalLegacy')&&!validLegacyRival(v.rivalLegacy))return false;
 const b=notebook(state);if(!b)return false;
 if(v.rival){
  if(v.rival.revision==='bramble-1'){if(!Object.hasOwn(v,'rivalLegacy'))v.rivalLegacy=clone(v.rival);}
  else if(v.rival.phase==='resolved'){v.rival.phase='continued';archive(state,v.rival);}
 }
 const choice=connection?{kind:'multiply',pair:[connection.a,connection.b],reason:'connected example'}:selected(b),id=b.nextRound++;if(connection)b.connectedRounds=(b.connectedRounds||0)+1;
 v.rival={revision:'bramble-2',id,task:generateRivalTask(choice.kind,...choice.pair,(id-1)%3),reason:choice.reason,phase:practice?'practice':'question',input:'',feedback:'',practiceStep:0,supported:practice,audioRequested:false,attempts:[],resolution:null,method:null,decompositionStep:null,...(connection?{connection:clone(connection)}:{})};
 return true;
}
export function nextRivalChallenge(state){const r=current(state,['resolved','continued','bypassed']);return !!r&&startAdaptiveRival(state);}
export function setRivalMethod(state,value){
 const r=current(state,['resolved']);if(!r||r.revision!=='bramble-2'||r.resolution!=='answered'||value!==null&&!methods.includes(value))return false;
 r.method=value;if(value==='together')r.supported=true;return true;
}
export function stepRivalDecomposition(state,action){
 const r=current(state,['question','practice','resolved']);if(!r||r.revision!=='bramble-2'||![1,-1,'reset'].includes(action))return false;
 r.supported=true;r.decompositionStep=action==='reset'?0:Math.max(0,Math.min(2,(r.decompositionStep??0)+action));return true;
}
