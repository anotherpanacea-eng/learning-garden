// Original Bramble ribbon puzzles. This module does not change packing or flight.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const clone=x=>JSON.parse(JSON.stringify(x));
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const same=(a,b)=>a===b||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(b).every(k=>Object.hasOwn(a,k)&&same(a[k],b[k]))||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]));
const keys=(x,names)=>object(x)&&Object.keys(x).length===names.length&&names.every(k=>Object.hasOwn(x,k));
function example(kind,a,b,prompt,explanation){return {kind,a,b,answer:kind==='add'?a+b:kind==='subtract'?a-b:a*b,unit:'ribbons',prompt,explanation,pictures:{kind,groups:kind==='add'?[{label:'Blue ribbons',count:a},{label:'Gold ribbons',count:b}]:kind==='subtract'?[{label:'Ready ribbons',count:a,reserved:b}]:Array.from({length:a},(_,i)=>({label:`Bundle ${i+1}`,count:b}))}};}
export const rivalTasks=freeze([
 {...example('add',6,5,'Bramble has 6 blue ribbons and 5 gold ribbons. How many ribbons are there altogether?','Put 6 blue ribbons beside 5 gold ribbons: 6 + 5 = 11 ribbons.'),practice:example('add',4,2,'Try a smaller ribbon table: 4 blue ribbons and 2 gold ribbons.','Bring the two colors together. Count 4, then 5 and 6: 4 + 2 = 6 ribbons.')},
 {...example('subtract',10,3,'Bramble has 10 ribbons. Reserve 3 for the gate bow. How many ribbons remain?','Set aside 3 of the 10 ribbons. The other 7 remain: 10 − 3 = 7 ribbons.'),practice:example('subtract',8,2,'Try a smaller ribbon table: 8 ribbons, with 2 reserved for a bow.','Set aside 2 of the 8 ribbons. Count the 6 remaining ribbons: 8 − 2 = 6.')},
 {...example('multiply',3,4,'Bramble has 3 bundles with 4 ribbons in each bundle. How many ribbons are there altogether?','Each of the 3 bundles has 4 ribbons. Count 4, 8, 12: 3 × 4 = 12 ribbons.'),practice:example('multiply',2,4,'Try a smaller ribbon table: 2 bundles with 4 ribbons in each.','Keep the equal bundles visible. Count 4, then 8: 2 × 4 = 8 ribbons.')},
]);
const parse=input=>{const s=input.trim(),n=s!==''&&/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s)?Number(s):NaN;return Number.isFinite(n)?n:null;};
const phases=['question','practice','resolved','continued','bypassed'];
export function validPostRival(r){
 if(!keys(r,['revision','task','reason','phase','input','feedback','practiceStep','supported','audioRequested','attempts','resolution'])||r.revision!=='bramble-1'||!rivalTasks.some(t=>same(t,r.task))||!['same-operation','neutral-mix'].includes(r.reason)||!phases.includes(r.phase)||typeof r.input!=='string'||typeof r.feedback!=='string'||!Number.isInteger(r.practiceStep)||r.practiceStep<0||r.practiceStep>2||typeof r.supported!=='boolean'||typeof r.audioRequested!=='boolean'||!Array.isArray(r.attempts)||r.attempts.length>24||![null,'answered','together'].includes(r.resolution))return false;
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
export function bypassRival(state){const r=current(state,['question','practice']);if(!r)return false;r.phase='bypassed';r.resolution=null;r.feedback='You take the quiet route. Your delivery is waiting where you left it.';return true;}
export function continueRival(state){const r=current(state,['resolved']);if(!r)return false;r.phase='continued';return true;}
export function noteRivalAudio(state){const r=current(state);if(!r)return false;r.audioRequested=true;r.supported=true;return true;}
