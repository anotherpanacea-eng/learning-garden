// Authored question forms; legacy visits keep their original questions and records.
import {starterIngredients} from './cafe-content.mjs';
import {spiralCases,spiralCase,spiralAnimal,spiralPlaces,spiralTarget,spiralReasons} from './living-spiral-content.mjs';
export const strands=['science','reading','math'];
export const depths={science:['Match a need','Use picture evidence','Notice a change'],reading:['Find a named tag','Follow a sequence','Read between the lines'],math:['Equal packs','Find the pack count','Plan tomorrow']};
export const tags=['leaf','star','shell'];
export const methods=['knew','worked','counted','together','unreported'];
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
export const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
export const taskKey=(task,strand)=>strand==='science'?`${task.caseId}:${task.teaching.depths.science}`:strand==='reading'?`${task.teaching.depths.reading}:${task.teaching.noteVariant}`:`${task.teaching.depths.math}:${task.packs}x${task.bites}`;
const catalogs={science:new Set(spiralCases.flatMap(c=>[1,2,3].map(d=>`${c.id}:${d}`))),reading:new Set([1,2,3].flatMap(d=>[0,1,2].map(v=>`${d}:${v}`))),math:new Set([1,2,3].flatMap(d=>Array.from({length:144},(_,i)=>`${d}:${1+Math.floor(i/12)}x${1+i%12}`)))};
export function freshAdaptive(){return {version:1,levels:{science:1,reading:1,math:1},epochs:{science:0,reading:0,math:0},choices:{science:'auto',reading:'auto',math:'auto'},offered:{science:[],reading:[],math:[]}};}
export function validAdaptiveProfile(a,nextRound){return object(a)&&a.version===1&&['levels','epochs','choices','offered'].every(k=>object(a[k]))&&strands.every(k=>integer(a.levels[k],1,3)&&integer(a.epochs[k],0,nextRound)&&['auto',1,2,3].includes(a.choices[k])&&Array.isArray(a.offered[k])&&a.offered[k].length<=catalogs[k].size&&new Set(a.offered[k]).size===a.offered[k].length&&a.offered[k].every(x=>catalogs[k].has(x)));}
export function scienceQuestion(task){
 const depth=task.teaching.depths.science,ps=spiralPlaces(task),target=spiralTarget(task),a=spiralAnimal(spiralCase(task.caseId).animal),nectar=a.reason==='nectar';
 const changed=nectar?{...ps[target],kind:'buds',nectar:false,observation:'After: these flowers are now tightly closed. No open nectar-bearing flowers are pictured here.'}:{...ps[target],damp:false,observation:'After: the leaf litter under this cover is now dry. Cover remains, but the moisture shown before is gone.'};
 return {depth,target,answer:depth===1?a.reason:depth===2?String(target):'recheck',prompt:depth===1?'Which need does this place meet?':depth===2?'Which pictured observation supports your place?':'What would you check after this change?',options:depth===1?spiralReasons.map(x=>({id:x.id,text:x.label})):depth===2?ps.map((p,i)=>({id:String(i),text:p.observation})):[{id:'recheck',text:nectar?'Look for open flowers with nectar again.':'Look for damp cover on land again.'},{id:'unchanged',text:'The old place must still meet every need.'},{id:'no-need',text:nectar?'The adult no longer needs food.':'This animal no longer needs damp shelter.'}],changed};
}
export function noteQuestion(task){
 const d=task.teaching.depths.reading,v=task.teaching.noteVariant,target=tags[v],other=tags[(v+1)%3],last=tags[(v+2)%3];
 const food=starterIngredients.find(x=>x.id===task.ingredientId).name;
 const sentences=d===1?[`Find the ${target}-tagged parcel for the café.`]:d===2?[`First, leave the ${other}-tagged seed parcel for the planting team.`,`Next, find the ${target}-tagged food parcel for the café.`,`The ${last}-tagged tool parcel stays for the repair team.`]:tags.map(tag=>tag===target?`The ${tag}-tagged parcel holds sealed food: ${food}.`:tag===other?`The ${tag}-tagged parcel holds seeds for the new beds.`:`The ${tag}-tagged parcel holds tools for fixing the storm shelter.`);
 // Stable tag order puts the supporting sentence in a different position in each variant.
 return {depth:d,target,sentences,evidence:d===3?sentences.findIndex(s=>s.includes('sealed')):null,prompt:d===3?'Which parcel would help the hungry café neighbors? Which sentence is your clue?':d===2?'Which tag should we find next for the café?':'Which tag names our café parcel?',explanation:`The ${target} tag is our café delivery. ${sentences[d===3?sentences.findIndex(s=>s.includes('sealed')):d===2?1:0]}`};
}
export function mathQuestion(task){
 const {packs:p,bites:b}=task,d=task.teaching.depths.math,total=p*b;
 return {depth:d,answer:d===1?total:d===2?p:(p-1)*b,prompt:d===1?`Today’s delivery has ${p} equal packs, with ${b} bites in each. How many bites altogether?`:d===2?`Today’s delivery has ${total} bites. Each sealed pack holds ${b} bites. How many equal packs are there?`:`Today’s delivery has ${p} packs of ${b} bites. Tomorrow we plan one fewer pack. How many bites would tomorrow’s delivery have?`,explanation:d===1?`${p} × ${b} = ${total} bites.`:d===2?`${total} ÷ ${b} = ${p} packs. ${p} × ${b} = ${total} bites.`:`Tomorrow: ${p} − 1 = ${p-1} packs. ${p-1} × ${b} = ${(p-1)*b} bites. Today we still carry all ${total} bites.`};
}
export const scienceReady=r=>r.inspected.includes(spiralTarget(r.task))&&r.inspected.length>=2&&(r.science.matched||r.science.help)&&(r.task.teaching.depths.science!==3||r.science.changedShown);
export const readingReady=r=>scienceReady(r)&&(r.reading.matched||r.reading.help);
const correct=(r,k,v)=>k==='science'?v.place===spiralTarget(r.task)&&v.detail===scienceQuestion(r.task).answer:k==='reading'?v.tag===noteQuestion(r.task).target&&v.evidence===noteQuestion(r.task).evidence:v===mathQuestion(r.task).answer;
export const correctResponse=correct;
function validResponse(r,k,a){
 if(!object(a)||typeof a.correct!=='boolean'||!['afterHelp','afterAudio','afterVocabulary','afterTogether'].every(x=>typeof a[x]==='boolean'))return false;
 const v=a.value,q=k==='science'?scienceQuestion(r.task):k==='reading'?noteQuestion(r.task):mathQuestion(r.task);
 if(k==='science'?!object(v)||!integer(v.place,0,2)||!q.options.some(x=>x.id===v.detail):k==='reading'?!object(v)||!tags.includes(v.tag)||!(q.depth===3?integer(v.evidence,0,2):v.evidence===null):!integer(v,0,999))return false;
 return a.correct===correct(r,k,v)&&(!a.afterTogether||k==='math')&&(!a.afterHelp||r[k].help)&&(!a.afterAudio||r[k].audio)&&(!a.afterVocabulary||k==='science'&&r.science.vocabulary);
}
export function validAdaptiveRound(r){
 if(!object(r)||r.revision!=='habitat-round-2'||!integer(r.id,0,999999999)||!object(r.task))return false;
 const t=r.task,h=t.teaching;
 if(!spiralCase(t.caseId)||!integer(t.rotation,0,2)||!['small','all'].includes(t.range)||!starterIngredients.some(x=>x.id===t.ingredientId)||typeof t.familiar!=='boolean'||!integer(t.packs,t.range==='small'?2:1,t.range==='small'?5:12)||!integer(t.bites,t.range==='small'?2:1,t.range==='small'?5:12)||!object(h)||h.version!==1||!integer(h.noteVariant,0,2)||typeof h.priorFactSeen!=='boolean'||!['depths','keys','familiar','reasons'].every(k=>object(h[k]))||!strands.every(k=>integer(h.depths[k],1,3)&&h.keys[k]===taskKey(t,k)&&typeof h.familiar[k]==='boolean'&&typeof h.reasons[k]==='string'&&h.reasons[k].length>0&&h.reasons[k].length<=400))return false;
 if(!integer(r.place,0,2)||!Array.isArray(r.inspected)||r.inspected.length>3||new Set(r.inspected).size!==r.inspected.length||!r.inspected.every(n=>integer(n,0,2))||!['found','carried','left'].every(k=>typeof r[k]==='boolean'))return false;
 for(const k of strands){
  const s=r[k];if(!object(s)||!['matched','help','audio'].every(x=>typeof s[x]==='boolean')||!integer(s.count,0,1000000000)||!Array.isArray(s.attempts)||s.attempts.length!==Math.min(s.count,24)||!(s.count===0?s.first===null:validResponse(r,k,s.first))||!s.attempts.every(a=>validResponse(r,k,a))||s.matched!==!!s.attempts.at(-1)?.correct)return false;
  if(s.count<=24&&s.count>0&&JSON.stringify(s.first)!==JSON.stringify(s.attempts[0]))return false;
  if(s.attempts.slice(0,-1).some(a=>a.correct))return false;
 }
 const s=r.science,n=r.reading,m=r.math,sq=scienceQuestion(t),nq=noteQuestion(t);
 if(!(s.place===null||integer(s.place,0,2))||!(s.detail===null||sq.options.some(x=>x.id===s.detail))||typeof s.vocabulary!=='boolean'||typeof s.changedShown!=='boolean'||s.count&&t.teaching.depths.science===3&&!s.changedShown||!(n.tag===null||tags.includes(n.tag))||!(n.evidence===null||nq.depth===3&&integer(n.evidence,0,2))||typeof m.input!=='string'||m.input.length>20||!methods.includes(m.method))return false;
 if(!scienceReady(r)&&(n.count||n.help||n.audio||r.found)||r.found&&!readingReady(r)||!r.found&&(m.count||m.help||m.audio)||r.carried&&(!r.found||!(m.matched||m.help)||r.left))return false;
 return true;
}
