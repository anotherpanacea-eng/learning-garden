import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ensureCafe,nextGuest,adjustBite,checkPlate,submitCafeNumber,skipCafeStage,serveCafe,supportCafe,orderFor} from '../dist/cafe-core.mjs';
import {startPostOffice,resumePostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startAdaptiveRival,setRivalInput,submitRival,solveRivalTogether,continueRival,bypassRival,validPostRival,validBrambleNotebook,setBrambleMode,setBrambleTable} from '../dist/post-rival.mjs';
import {startAdaptiveSpiral,inspectAdaptive,supportAdaptive,findAdaptive,chooseAdaptive,submitAdaptive,leaveAdaptive,setAdaptiveChoice,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {mathQuestion} from '../dist/living-adaptive-content.mjs';
import {currentSpiral,spiralState,setSpiralOption} from '../dist/living-spiral-core.mjs';
import {spiralTarget} from '../dist/living-spiral-content.mjs';
import {connectionFrom,validConnection,proposedPair} from '../dist/learning-connection-data.mjs';
import {connectionPairsShown,learningSource,connectionOffers,connectionAvailability,startConnection,activeConnection,connectionRecords} from '../dist/learning-connections.mjs';
import {connectionPanel,connectionNotes} from '../dist/learning-connections-ui.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
let checks=0;const check=(x,m)=>{assert.ok(x,m);checks++;},equal=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>{const s=freshState();ensureCafe(s);startPostOffice(s,deliveries[0].id);return s;};
function cafeSource(a=3,b=4,supported=false,wrong=false){const s=fresh();nextGuest(s);const r=s.cafe.current;r.params.guests=a;r.params.bites=b;r.params.wanted=['warm','crunchy'];for(let i=0;i<b;i++)adjustBite(s,'moon-crunch',1);check(checkPlate(s),'valid plate');if(supported)supportCafe(s);if(wrong)submitCafeNumber(s,a*b+1);check(submitCafeNumber(s,a*b),'total fits');skipCafeStage(s);s.cafe.stock['moon-crunch']=180;check(serveCafe(s),'serve actual table');return s;}
function finishGarden(s,{help=false,wrong=false}={}){const r=currentSpiral(s),n=spiralTarget(r.task);inspectAdaptive(s,n);inspectAdaptive(s,(n+1)%3);supportAdaptive(s,'science','help');supportAdaptive(s,'reading','help');check(findAdaptive(s),'find actual parcel');if(help)supportAdaptive(s,'math','help');if(wrong){chooseAdaptive(s,'math','input',String(mathQuestion(r.task).answer+1));submitAdaptive(s,'math');}chooseAdaptive(s,'math','input',String(mathQuestion(r.task).answer));check(submitAdaptive(s,'math'),'garden actual response');check(leaveAdaptive(s),'close without stock');}
function answerBramble(s,together=false){const r=s.postOffice.visits.find(v=>v.id===s.postOffice.current).rival;if(together)solveRivalTogether(s);else{setRivalInput(s,String(r.task.answer));submitRival(s);}check(continueRival(s),'archive real rival');return r;}
{
 const s=fresh(),b=structuredClone(s);for(const target of ['living','cafe','bramble']){connectionPanel(s,target);connectionOffers(s,target);}connectionNotes(s);equal(s,b,'panels pure, no new ledger');equal(connectionRecords(s),[],'no invented source history');check(!startConnection(s,'cafe','living'),'no nonexistent source');equal(s,b,'failed source atomic');
}
// All ordered facts become literal destination tasks; source data is never copied as attempts.
for(let a=1;a<=12;a++)for(let b=1;b<=12;b++){
 const s=cafeSource(a,b,true),source=learningSource(s,'cafe');check(validConnection(source),'known source provenance');equal([source.a,source.b],[a,b],'supported source revisits same family');equal(source.familiarity,'unknown','old cafe familiarity unknown');
 const beforeCafe=structuredClone(s.cafe),beforePost=structuredClone(s.postOffice);check(startConnection(s,'living','cafe'),'connected garden starts');const g=currentSpiral(s);equal([g.task.packs,g.task.bites],[a,b],'garden packs exact');equal(g.task.teaching.depths.math,1,'one-off direct form');check(g.task.teaching.familiar.math&&g.task.teaching.priorFactSeen,'target knows fact was explored');equal(g.math.count,0,'no copied garden answers');equal(s.cafe,beforeCafe,'garden start no cafe mutation');equal(s.postOffice,beforePost,'garden start no post mutation');
 finishGarden(s,{help:true});const garden=learningSource(s,'living');equal([garden.a,garden.b],[a,b],'garden supported family');check(startConnection(s,'cafe','living'),'actual next guest');equal([orderFor(s.cafe).guests,orderFor(s.cafe).bites],[a,b],'real guest quantities');equal(s.cafe.stock,beforeCafe.stock,'start grants no food');equal(s.cafe.current.total.attempts,[],'no copied cafe answer');equal(s.cafe.served,beforeCafe.served,'no supper award on start');
 check(startConnection(s,'bramble','living'),'real connected rival');const r=s.postOffice.visits.find(v=>v.id===s.postOffice.current).rival;equal([r.task.a,r.task.b],[a,b],'literal ribbon task');check(validPostRival(r)&&validBrambleNotebook(s.postOffice),'valid connected rival');equal(r.attempts,[],'no copied rival evidence');equal(s.postOffice.bramble.cursors,{add:0,subtract:0,multiply:0},'explicit connection preserves ordinary cursor');equal(s.postOffice.visits[0].packing,beforePost.visits[0].packing,'parcel untouched');equal(s.postOffice.visits[0].playback,beforePost.visits[0].playback,'flight untouched');
 const prior=structuredClone(s);check(!startConnection(s,'cafe','living')&&!startConnection(s,'bramble','living'),'waiting guest and rival refuse another connection');equal(s,prior,'repeated starts atomic');
}
for(const [a,b,outcome,expected] of [[3,4,'first-match',[4,4]],[12,4,'first-match',[12,5]],[12,12,'first-match',[11,12]],[0,7,'supported',[1,7]],[9,12,'retry',[9,12]]])equal(proposedPair(a,b,outcome),expected,'neighbor/zero boundary');
for(const [help,wrong,outcome] of [[false,false,'first-match'],[true,false,'supported'],[false,true,'retry']]){const s=cafeSource(3,4,help,wrong);equal(learningSource(s,'cafe').outcome,outcome,'coarse café classification');}
{
 const s=cafeSource();check(startConnection(s,'bramble','cafe'),'cross to Bramble');const r=answerBramble(s);equal(learningSource(s,'bramble').sourceId,r.id,'latest Bramble source');equal(learningSource(s,'bramble').familiarity,'familiar','connected family explicitly known');check(startConnection(s,'living','bramble'),'Bramble to garden');equal(currentSpiral(s).task.connection.source,'bramble','frozen cross source');equal(currentSpiral(s).math.count,0,'still no imported assessment');
}
// Manual math preferences and automatic epoch survive an explicit equal-packs search.
{
 const s=cafeSource();setAdaptiveChoice(s,'math',3);s.livingExploration.adaptive.levels.math=2;s.livingExploration.adaptive.epochs.math=0;setSpiralOption(s,'range','small');const old=structuredClone(s.livingExploration);check(startConnection(s,'living','cafe'),'one-off despite chosen deeper math');equal(s.livingExploration.adaptive.levels.math,2,'automatic depth unchanged');equal(s.livingExploration.adaptive.epochs.math,0,'math epoch unchanged');equal(s.livingExploration.adaptive.choices.math,3,'manual depth unchanged');equal(s.livingExploration.cursors.small,old.cursors.small,'ordinary number cursor unchanged');equal(currentSpiral(s).task.teaching.depths.math,1,'button promised equal packs');finishGarden(s);equal(adaptiveSuggestion(s,'math').observed,0,'other-depth task excluded');
}
// Inverse source is a related direction. Tomorrow uses actual hypothetical groups, including zero.
for(const [depth,packs,bites,sourceA,proposal] of [[2,4,3,4,'same'],[3,4,3,3,'same'],[3,1,7,0,'positive']]){
 const s=fresh();setSpiralOption(s,'range','all');setAdaptiveChoice(s,'math',depth);startAdaptiveSpiral(s);const r=currentSpiral(s);r.task.packs=packs;r.task.bites=bites;r.task.teaching.keys.math=`${depth}:${packs}x${bites}`;finishGarden(s,{help:true});const c=learningSource(s,'living');equal(c.sourceA,sourceA,'actual math relation');equal(c.proposal,proposal,'explicit zero positive bridge');equal(c.relation,depth===2?'inverse':'tomorrow','relation labelled');check(connectionPanel(s,'cafe').includes(depth===2?'Last time you found how many packs':'plan'),'honest source wording');
}
// Waiting target work and invalid source/target formats remain exact, with a visible explanation.
for(const target of ['living','cafe','bramble']){
 const s=cafeSource();startConnection(s,'living','cafe');finishGarden(s,{help:true});if(target==='living')startAdaptiveSpiral(s);else if(target==='cafe'){nextGuest(s);adjustBite(s,'moon-crunch',1);}else startAdaptiveRival(s);
 const before=structuredClone(s);check(!!connectionAvailability(s,target),'waiting explanation');check(!startConnection(s,target,target==='cafe'?'living':'cafe'),'refused waiting start');equal(s,before,'waiting work byte-equivalent');check(connectionPanel(s,target).includes('waiting'),'visible wait explanation');
}
for(const damage of [s=>s.cafe.version=99,s=>s.cafe.current={stage:'served'},s=>s.cafe.history[0].connection={version:99},s=>s.postOffice.visits[0].rival={revision:'future'},s=>s.postOffice.version=99]){
 const s=cafeSource();damage(s);const before=structuredClone(s);connectionPanel(s,'cafe');connectionPanel(s,'bramble');connectionNotes(s);equal(s,before,'malformed render remains raw');for(const target of ['cafe','bramble']){if(connectionAvailability(s,target)){check(!startConnection(s,target,'living'),'bad target refuses');equal(s,before,'bad target no reset');}}
}
// Sources exclude skipped-only, addition/subtraction and legacy/unobserved records.
{
 const s=fresh();startAdaptiveRival(s);bypassRival(s);equal(learningSource(s,'bramble'),null,'bypass-only unobserved');setBrambleMode(s,'add');startAdaptiveRival(s);answerBramble(s);equal(learningSource(s,'bramble'),null,'addition not forced into multiplication');nextGuest(s);skipCafeStage(s);equal(learningSource(s,'cafe'),null,'unclosed/unanswered café unobserved');
}
// Normalization must never discard unknown saved café work to issue a new guest.
{
 const s=cafeSource();startConnection(s,'living','cafe');finishGarden(s,{help:true});s.cafe.current=null;s.cafe.history=[{futureVersion:99,rawWork:'keep this record'}];const before=structuredClone(s);check(!!connectionAvailability(s,'cafe'),'raw history blocks connected guest');check(!startConnection(s,'cafe','living'),'no normalization bypass');equal(s,before,'raw history remains exact');equal(learningSource(s,'cafe'),null,'unknown history supplies no source');
}
{
 const s=cafeSource();s.cafe.history=[{orderIndex:0,status:'served',params:{guests:3,bites:4},total:{input:'12',attempts:[12],supported:false,skipped:false,revealed:false,steps:0}}];const before=structuredClone(s);equal(learningSource(s,'cafe'),null,'incomplete alleged success is not a source');equal(s,before,'malformed source remains raw');
}
{
 const s=cafeSource();equal(connectionPairsShown(s,'living'),[[4,4]],'actually displayed neighboring proposal exposed');startAdaptiveSpiral(s);equal(connectionPairsShown(s,'living'),[[4,4]],'proposal beside waiting work still exposed');equal(s.baseline.observations,[],'collecting exposures fabricates no assessment');
}
// Finish order wins over allocation IDs; ordinary operation/fresh turns ignore inserted connections.
{
 const s=cafeSource(),first=s.postOffice.current;startConnection(s,'bramble','cafe');const one=s.postOffice.visits[0].rival.id;startPostOffice(s,deliveries[1].id);startConnection(s,'bramble','cafe');answerBramble(s,true);resumePostOffice(s,first);answerBramble(s,true);equal(learningSource(s,'bramble').sourceId,one,'later finished older allocation is latest');
}
{
 const s=cafeSource();for(let i=0;i<12;i++){check(startConnection(s,'bramble','cafe'),'insert connection');answerBramble(s,true);check(startAdaptiveRival(s),'ordinary turn');const r=s.postOffice.visits.find(v=>v.id===s.postOffice.current).rival;equal(r.task.kind,['multiply','add','multiply','subtract'][i%4],'ordinary operation sequence preserved');answerBramble(s,true);}equal(s.postOffice.bramble.connectedRounds,12,'bounded lifetime selector offset');
}
// Provenance survives archive, explorer switching, reload, local export, off and reset.
{
 const map=new Map(),storage={get length(){return map.size;},key:i=>[...map.keys()][i]??null,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};const store=new ExplorerStore(storage);let s=store.load();Object.assign(s,cafeSource(5,7,true));startConnection(s,'bramble','cafe');answerBramble(s,true);startConnection(s,'living','bramble');chooseAdaptive(s,'science','place',1);store.save(s);const id=store.active.id,raw=JSON.stringify(s);store.add({},s);s=store.select(id,store.load());equal(JSON.stringify(s),raw,'switch exact');equal(restoreState(raw),s,'export/restore exact');const again=new ExplorerStore(storage),loaded=again.load();equal(loaded.livingExploration.current.task.connection,s.livingExploration.current.task.connection,'reload provenance exact');check(connectionNotes(loaded).includes('sourceId'),'exportable provenance notes');check(again.setPersistence(false,loaded),'saving off');check(![...map.keys()].some(k=>k.startsWith('number-garden-v1')),'saves removed');again.clearActive();equal(connectionRecords(again.load()),[],'reset removes connection provenance');
}
console.log(`${checks} cross-game learning, provenance, compatibility and inventory checks passed.`);
