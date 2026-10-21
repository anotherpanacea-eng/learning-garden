import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ensureCafe,nextGuest} from '../dist/cafe-core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {spiralCases,spiralPlaces,spiralTarget} from '../dist/living-spiral-content.mjs';
import {startSpiral,leaveSpiral,currentSpiral,spiralState,validSpiralRound,setSpiralOption,carrySpiral} from '../dist/living-spiral-core.mjs';
import {ensurePlantings,startOpenTask} from '../dist/plantings.mjs';
import {startLiving} from '../dist/living-core.mjs';
import {scienceQuestion,noteQuestion,mathQuestion,strands,scienceReady,readingReady} from '../dist/living-adaptive-content.mjs';
import {startAdaptiveSpiral,adaptiveSuggestion,setAdaptiveChoice,inspectAdaptive,chooseAdaptive,revealAdaptiveChange,supportAdaptive,submitAdaptive,findAdaptive,carryAdaptive,leaveAdaptive,adaptivePairsShown,setAdaptivePage} from '../dist/living-adaptive-core.mjs';
import {adaptivePage,adaptiveNotes} from '../dist/living-adaptive-ui.mjs';
let checks=0;const check=(x,m)=>{assert.ok(x,m);checks++;},equal=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>{const s=freshState();ensureCafe(s);return s;};
const choose=(s,k,f,v)=>check(chooseAdaptive(s,k,f,v),'choose '+k+' '+f);
function answer(s,k,wrong=false){const r=currentSpiral(s),t=r.task;
 if(k==='science'){const q=scienceQuestion(t);choose(s,k,'place',wrong?(q.target+1)%3:q.target);choose(s,k,'detail',q.answer);if(q.depth===3)check(revealAdaptiveChange(s),'show change');}
 else if(k==='reading'){const q=noteQuestion(t);choose(s,k,'tag',wrong?['leaf','star','shell'].find(x=>x!==q.target):q.target);if(q.depth===3)choose(s,k,'evidence',q.evidence);}
 else choose(s,k,'input',String(mathQuestion(t).answer+(wrong?1:0)));
 check(submitAdaptive(s,k),'submit '+k);check(validSpiralRound(r),'valid after '+k);
}
function openNote(s,help=false){const r=currentSpiral(s),n=spiralTarget(r.task);check(inspectAdaptive(s,n)&&inspectAdaptive(s,(n+1)%3),'inspect contrast');if(help)check(supportAdaptive(s,'science','help'),'science together');else answer(s,'science');check(scienceReady(r),'science resolved');}
function openMath(s,help=false){openNote(s,help);if(help)check(supportAdaptive(s,'reading','help'),'read together');else answer(s,'reading');check(readingReady(currentSpiral(s))&&findAdaptive(s),'find parcel');}
function finish(s,help=false){openMath(s,help);if(help)check(supportAdaptive(s,'math','help'),'math together');else answer(s,'math');const r=currentSpiral(s);s.cafe.stock[r.task.ingredientId]=0;check(carryAdaptive(s),'carry');check(spiralState(s),'valid closed state');}
{
 const s=fresh(),before=structuredClone(s);adaptivePage(s);adaptiveNotes(s);equal(s,before,'render pure before start');check(startAdaptiveSpiral(s),'new starter');check(currentSpiral(s).revision==='habitat-round-2','new revision');const frozen=structuredClone(currentSpiral(s));
 for(const k of strands)check(setAdaptiveChoice(s,k,3),'next depth');setSpiralOption(s,'range','all');setSpiralOption(s,'animal','butterfly');equal(currentSpiral(s),frozen,'next choices preserve waiting work');
 const b=structuredClone(s);check(!startAdaptiveSpiral(s)&&!findAdaptive(s)&&!carryAdaptive(s)&&!submitAdaptive(s,'reading'),'closed stages reject');equal(s,b,'failed actions atomic');
 openMath(s);choose(s,'math','input','13');check(supportAdaptive(s,'math','audio'),'math audio');const paused=structuredClone(s);equal(restoreState(JSON.stringify(s)),paused,'pending restored exact');adaptivePage(s,'visit');adaptiveNotes(s);equal(s,paused,'all render/notes pure');
 check(!carrySpiral(s),'legacy carry cannot act on v2');
}
// Every authored setting, position, and science depth has one defensible answer.
for(const c of spiralCases)for(let rotation=0;rotation<3;rotation++)for(let d=1;d<=3;d++){
 const s=fresh();setAdaptiveChoice(s,'science',d);startAdaptiveSpiral(s);const r=currentSpiral(s);r.task.caseId=c.id;r.task.rotation=rotation;r.task.teaching.keys.science=`${c.id}:${d}`;
 const q=scienceQuestion(r.task);check(q.options.filter(x=>x.id===q.answer).length===1,'unique science detail');openNote(s);check(r.science.matched,'case matched');setAdaptivePage(s,'read');const html=adaptivePage(s,'visit');check(html.includes('data-adapt-tag'),'note visible');if(d===3){setAdaptivePage(s,'compare');const scienceHtml=adaptivePage(s,'visit');check(scienceHtml.includes('Before:')&&scienceHtml.includes('After:'),'two supplied conditions');check(q.changed.damp===false&&q.changed.nectar===false,'changed need resource explicitly absent');}
}
for(let d=1;d<=3;d++)for(let v=0;v<3;v++){
 const s=fresh();setAdaptiveChoice(s,'reading',d);startAdaptiveSpiral(s);const r=currentSpiral(s);r.task.teaching.noteVariant=v;r.task.teaching.keys.reading=`${d}:${v}`;openNote(s);setAdaptivePage(s,'read');const q=noteQuestion(r.task),html=adaptivePage(s,'visit');check(html.includes(q.sentences[0]),'note text rendered');check(!html.includes('data-adapt-find'),'tag not exposed in find before response');answer(s,'reading');check(findAdaptive(s),'tag finds parcel');if(d===3)check(q.sentences[q.evidence].includes('sealed'),'sentence supports inference');
}
equal([0,1,2].map(v=>noteQuestion({ingredientId:'moon-crunch',teaching:{depths:{reading:3},noteVariant:v}}).evidence),[0,1,2],'inference evidence spans all sentence positions');
// Every fact through 12x12, every math form, including tomorrow's zero plan.
for(let d=1;d<=3;d++)for(let p=1;p<=12;p++)for(let b=1;b<=12;b++){
 const s=fresh();setSpiralOption(s,'range','all');setAdaptiveChoice(s,'math',d);startAdaptiveSpiral(s);const r=currentSpiral(s);r.task.packs=p;r.task.bites=b;r.task.teaching.keys.math=`${d}:${p}x${b}`;openMath(s,true);
 setAdaptivePage(s,'pack');const q=mathQuestion(r.task),html=adaptivePage(s,'visit');check(!html.includes(`Carry today’s ${p*b} bites`),'carry hides answer before solving');
 if(d===2){check(html.includes('pack count is hidden'),'inverse hides groups');check(!html.includes(`aria-label="${p} packs, ${b} bites per pack"`)||p===1,'no grouped answer in inverse image');equal(adaptivePairsShown(s),[[1,b]],'unit only before inverse solution');}
 answer(s,'math');equal(q.answer,d===1?p*b:d===2?p:(p-1)*b,'question form answer');s.cafe.stock[r.task.ingredientId]=0;check(carryAdaptive(s),'carry all quantities');equal(s.cafe.stock[r.task.ingredientId],p*b,'full original stock even inverse/tomorrow');const closed=structuredClone(s);check(!carryAdaptive(s),'carry once');equal(s,closed,'second carry atomic');
}
// Separate strands promote only at next explicit start, then reset just their epoch.
{
 const s=fresh();startAdaptiveSpiral(s);finish(s);equal(adaptiveSuggestion(s,'science').level,1,'one answer insufficient');startAdaptiveSpiral(s);finish(s);for(const k of strands)equal(adaptiveSuggestion(s,k).level,2,'two new tasks suggest '+k);
 const closed=structuredClone(currentSpiral(s));check(startAdaptiveSpiral(s),'apply next suggestion');equal(s.livingExploration.history.at(-1),closed,'closed task unchanged');for(const k of strands){equal(currentSpiral(s).task.teaching.depths[k],2,'depth applied '+k);equal(s.livingExploration.adaptive.epochs[k],2,'epoch reset '+k);}
 openNote(s);answer(s,'reading',true);answer(s,'reading');findAdaptive(s);answer(s,'math');leaveAdaptive(s);equal(adaptiveSuggestion(s,'reading').level,2,'single retry holds');equal(adaptiveSuggestion(s,'science').level,2,'no cross-strand inference');
 startAdaptiveSpiral(s);openNote(s);answer(s,'reading',true);answer(s,'reading');findAdaptive(s);answer(s,'math');leaveAdaptive(s);equal(adaptiveSuggestion(s,'reading').level,1,'two distinct retries suggest smaller note');equal(adaptiveSuggestion(s,'science').level,3,'science clean independently deepens');equal(adaptiveSuggestion(s,'math').level,3,'math clean independently deepens');
}
// Support is response-scoped. Help after a clean response does not rewrite it.
for(const kind of ['help','audio','vocabulary']){
 const s=fresh();startAdaptiveSpiral(s);supportAdaptive(s,'science',kind);openNote(s);leaveAdaptive(s);const r=currentSpiral(s);check(r.science.first['after'+(kind==='help'?'Help':kind==='audio'?'Audio':'Vocabulary')],'scoped first support');equal(adaptiveSuggestion(s,'science').level,1,'support neutral');
}
{
 const s=fresh();startAdaptiveSpiral(s);openNote(s);const first=structuredClone(currentSpiral(s).science.first);supportAdaptive(s,'science','help');supportAdaptive(s,'science','audio');equal(currentSpiral(s).science.first,first,'later support immutable');leaveAdaptive(s);startAdaptiveSpiral(s);openNote(s);leaveAdaptive(s);equal(adaptiveSuggestion(s,'science').level,2,'later help does not erase prior response');equal(adaptiveSuggestion(s,'reading').observed,0,'unanswered reading unobserved');equal(adaptiveSuggestion(s,'math').observed,0,'unanswered math unobserved');
}
{
 const s=fresh();startAdaptiveSpiral(s);openNote(s,true);leaveAdaptive(s);equal(adaptiveSuggestion(s,'science').observed,0,'help without response unobserved');startAdaptiveSpiral(s);finish(s,true);for(const k of strands)equal(adaptiveSuggestion(s,k).observed,0,'help-only not assessed');
}
// A later method edit cannot erase support reported when answering.
{
 const s=fresh();for(let i=0;i<2;i++){startAdaptiveSpiral(s);openMath(s);choose(s,'math','method','together');answer(s,'math');choose(s,'math','method','knew');leaveAdaptive(s);check(currentSpiral(s).math.first.afterTogether,'together at response retained');}
 equal(adaptiveSuggestion(s,'math').level,1,'method edit cannot manufacture promotion');equal(adaptiveSuggestion(s,'math').newMatches,0,'together responses neutral');
}
// Repeated wrong responses cannot become a first-try match after snapshot trimming.
{
 const s=fresh();startAdaptiveSpiral(s);openMath(s);for(let i=0;i<28;i++)answer(s,'math',true);answer(s,'math');const r=currentSpiral(s);equal(r.math.count,29,'total retained');equal(r.math.attempts.length,24,'recent bounded');check(!r.math.first.correct,'first wrong immutable');check(r.math.attempts.at(-1).correct,'latest correct');leaveAdaptive(s);equal(adaptiveSuggestion(s,'math').retries,1,'wrong to right remains retry');check(!submitAdaptive(s,'math'),'closed cannot respond');
}
// Familiar-key thresholds and latest assessed outcome per key.
{
 const s=fresh();startAdaptiveSpiral(s);finish(s);const template=structuredClone(currentSpiral(s));
 const make=(id,key,familiar,kind)=>{const r=structuredClone(template);r.id=id;r.task.teaching.keys.science=key;r.task.caseId=key.split(':')[0];r.task.teaching.familiar.science=familiar;const q=scienceQuestion(r.task);r.inspected=[q.target,(q.target+1)%3];r.science.place=q.target;r.science.detail=q.answer;r.science.first.value={place:q.target,detail:q.answer};r.science.first.correct=kind!=='retry';if(kind==='retry')r.science.first.value.place=(q.target+1)%3;r.science.attempts=[structuredClone(r.science.first)];r.science.count=1;r.science.matched=kind!=='retry';r.reading={count:0,first:null,attempts:[],matched:false,help:false,audio:false,tag:null,evidence:null};r.found=false;r.carried=false;r.left=true;r.math={count:0,first:null,attempts:[],matched:false,help:false,audio:false,input:'',method:'unreported'};return r;};
 const cases=spiralCases.slice(0,4).map(c=>c.id+':1');const install=rs=>{s.livingExploration.history=rs.slice(0,-1);s.livingExploration.current=rs.at(-1);s.livingExploration.nextRound=rs.at(-1).id+1;check(spiralState(s),'synthetic assessed state valid');};
 install([make(0,cases[0],true,'clean'),make(1,cases[1],true,'clean')]);equal(adaptiveSuggestion(s,'science').level,1,'two familiar insufficient');install([...s.livingExploration.history,s.livingExploration.current,make(2,cases[2],true,'clean')]);equal(adaptiveSuggestion(s,'science').level,2,'three familiar invite');
 install([make(0,cases[0],false,'clean'),make(1,cases[0],true,'clean')]);equal(adaptiveSuggestion(s,'science').observed,1,'duplicate task counts once');equal(adaptiveSuggestion(s,'science').newMatches,0,'later familiar replaces original new');
 install([make(0,cases[0],false,'retry'),make(1,cases[1],false,'retry'),make(2,cases[2],false,'clean'),make(3,cases[3],false,'clean')]);equal(adaptiveSuggestion(s,'science').level,2,'later clean run supersedes old retries');
 install([make(0,cases[0],false,'clean'),make(1,cases[1],false,'clean'),make(2,cases[2],false,'retry')]);equal(adaptiveSuggestion(s,'science').level,1,'latest single retry holds over promotion');
}
// Preserve every original record; old open v1 must finish before a new v2.
{
 const s=fresh();startLiving(s);const original=structuredClone(s.livingGarden);startSpiral(s);const v1=structuredClone(currentSpiral(s)),before=structuredClone(s);check(!startAdaptiveSpiral(s),'legacy open not overwritten');equal(s,before,'legacy failed start pure');leaveSpiral(s);const closed=structuredClone(currentSpiral(s));startAdaptiveSpiral(s);equal(s.livingGarden,original,'original investigation exact');equal(s.livingExploration.history[0],closed,'v1 retained exact');check(v1.revision==='habitat-round-1','old starter unchanged');check(adaptivePage(s,'visit')&&adaptiveNotes(s),'mixed notes render');
}
// Familiarity offered only when visible, product exposure separate from relation familiarity.
for(const d of [1,2,3]){
 const s=fresh();setAdaptiveChoice(s,'math',d);s.exposures=['2x3','3x2'];startAdaptiveSpiral(s);const r=currentSpiral(s),p=s.livingExploration.adaptive;check(r.task.packs===2&&r.task.bites===3,'first frozen pair');check(r.task.teaching.priorFactSeen,'prior fact');equal(r.task.teaching.familiar.math,d===1,'direct vs new inverse relation');equal(p.offered.reading.length,0,'note not yet offered');equal(p.offered.math.length,0,'math not yet offered');openNote(s,true);equal(p.offered.reading.length,1,'note visible');supportAdaptive(s,'reading','help');findAdaptive(s);equal(p.offered.math.length,1,'math visible');
}
// Corrupt/unknown raw formats block actions, render recovery, and remain byte-equivalent.
for(const damage of [s=>s.livingExploration.adaptive.version=99,s=>s.livingExploration.adaptive.offered.math=['wrong'],s=>s.livingExploration.current.task.teaching.depths.math=9,s=>s.livingExploration.current.science.first={},s=>s.livingExploration.current.revision='future',s=>delete s.livingExploration.adaptive]){
 const s=fresh();startAdaptiveSpiral(s);damage(s);const before=structuredClone(s);check(!spiralState(s),'bad state blocked');for(const fn of [startAdaptiveSpiral,findAdaptive,carryAdaptive,leaveAdaptive])check(!fn(s),'no bypass');adaptivePage(s,'visit');adaptiveNotes(s);equal(s,before,'raw malformed state retained');
}
{
 const s=fresh();startAdaptiveSpiral(s);openMath(s,true);supportAdaptive(s,'math','help');const r=currentSpiral(s);s.cafe.stock[r.task.ingredientId]=180;const b=structuredClone(s);check(!carryAdaptive(s),'cap');equal(s,b,'cap atomic');check(leaveAdaptive(s),'leave full parcel');equal(s.cafe,b.cafe,'leave no stock or guest changes');
}
// Manual deeper choices do not certify or move the separate automatic suggestion.
{
 const s=fresh();for(const k of strands)setAdaptiveChoice(s,k,3);for(let i=0;i<3;i++){startAdaptiveSpiral(s);finish(s);}for(const k of strands)equal(adaptiveSuggestion(s,k).level,1,'manual depth remains separate '+k);
}
// Retention stays bounded, and help-only play does not become evidence.
{
 const s=fresh();for(let i=0;i<32;i++){startAdaptiveSpiral(s);finish(s,true);}equal(s.livingExploration.history.length,24,'latest24 closed visits');check(spiralState(s),'long-running adaptive state valid');for(const k of strands)equal(adaptiveSuggestion(s,k).observed,0,'help-only history stays unobserved '+k);
}
// Carry changes only the frozen ingredient, never a waiting guest, partial plate or plan.
{
 const s=fresh();nextGuest(s);ensurePlantings(s);startOpenTask(s,'many-rectangles');s.plantings.openDraft.model={type:'array',rows:2,cols:12,item:'cup',counted:[1]};startLiving(s);s.livingGarden.inspected=['log'];
 const before=structuredClone(s);startAdaptiveSpiral(s);openMath(s,true);supportAdaptive(s,'math','help');const r=currentSpiral(s);s.cafe.stock[r.task.ingredientId]=0;const beforeCarry=structuredClone(s);check(carryAdaptive(s),'carry to waiting guest');const expected=structuredClone(beforeCarry.cafe);expected.stock[r.task.ingredientId]=r.task.packs*r.task.bites;equal(s.cafe,expected,'only stock entry changes');equal(s.plantings,before.plantings,'pending planting exact');equal(s.livingGarden,before.livingGarden,'original habitat exact');equal(s.baseline,before.baseline,'assessment unaffected');
}
// Real ExplorerStore retains exact paused v2 work in separate anonymous slots.
{
 const map=new Map(),storage={get length(){return map.size;},key:i=>[...map.keys()][i]??null,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
 const store=new ExplorerStore(storage),s=store.load();ensureCafe(s);startAdaptiveSpiral(s);openMath(s,true);chooseAdaptive(s,'math','input','17');store.save(s);const id=store.active.id,raw=JSON.stringify(s);const other=store.add({},s);check(other,'add explorer');check(!store.load().livingExploration,'separate explorer');const back=store.select(id,store.load());equal(JSON.stringify(back),raw,'switch returns exact pending work');const restored=new ExplorerStore(storage);equal(JSON.stringify(restored.load()),raw,'device reload exact');check(restored.setPersistence(false,restored.load()),'save off');check(![...map.keys()].some(k=>k.startsWith('number-garden-v1')),'saved records removed');check(restored.load().livingExploration,'memory remains with saving off');restored.clearActive();check(!restored.load().livingExploration,'clear current explorer');
}
console.log(`${checks} adaptive Living Garden content, evidence, compatibility and supply checks passed.`);
