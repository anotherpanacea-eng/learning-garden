import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {foodForkSource} from '../dist/food-fork-content.mjs';
import {validForkSource,startFork,forkView,setForkPage,setForkEvidence,setForkAnswer,setForkSupport,checkFork,forkLiveRow,assessForkRow} from '../dist/food-fork-core.mjs';
import {forkPage,forkNotes} from '../dist/food-fork-ui.mjs';
import {adaptivePage,adaptiveNotes} from '../dist/living-adaptive-ui.mjs';
import {prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';

const clone=structuredClone,roundTrip=x=>JSON.parse(JSON.stringify(x));
const report=state=>({title:'After the Storm: observations',exportedAt:'2026-10-22T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'fern',color:'green',symbol:'leaf'},recommendation:{route:'garden'},...state});
const canExport=state=>prepareProgressImport(JSON.stringify(report(state),null,2)).ok;
const row=(state,id)=>state.foodFork.source.rows.find(r=>r.id===id);
const select=(state,id,food,eater)=>{assert.equal(setForkAnswer(state,id,'food',food,canExport),true);assert.equal(setForkAnswer(state,id,'eater',eater,canExport),true);};
let checks=0;const ok=(truth,message)=>{assert.ok(truth,message);checks++;};

ok(validForkSource(foodForkSource),'authored source valid');
ok(new TextEncoder().encode(JSON.stringify(foodForkSource)).length<=16*1024,'authored source fits frozen cap');
for(const view of ['initial','closer'])for(const r of foodForkSource.rows)for(const food of foodForkSource.cards)for(const eater of foodForkSource.cards){const expected=view==='closer'&&r.closer?r.closer.expected:r.initial.expected;const result=assessForkRow(foodForkSource,r,view,{food:food.id,eater:eater.id,notEnough:false});ok(result.outcome===!!(expected&&food.id===expected.food&&eater.id===expected.eater),`finite ${view}/${r.id}/${food.id}/${eater.id}`);}
const fresh=freshState();ok(!Object.hasOwn(fresh,'foodFork'),'optional root absent');
ok(adaptivePage(fresh,'fork').includes('data-fork-start'),'route entry exists before allocation');
ok(startFork(fresh,canExport),'start');ok(forkView(fresh).status==='ready','ready');
ok(fresh.foodFork.source.id===foodForkSource.id,'frozen source ID');
const old={foodLinks:{marker:'old-food'},lifeStages:{marker:'old-stage'},bodyClues:{marker:'old-body'},livingExploration:{marker:'old-exploration'}};
Object.assign(fresh,clone(old));const oldBytes=JSON.stringify(old);
ok(setForkPage(fresh,'build',canExport),'build page');
const initialPage=forkPage(fresh);ok(initialPage.includes('this displayed slip support')&&initialPage.includes('Check what these displayed slips support'),'immediate source question and check action');
ok(initialPage.includes('Our shared food-arrow picture')&&initialPage.includes('This displayed slip'),'shared board and slips');
select(fresh,'sap','bean','aphid');select(fresh,'ladybird','aphid','ladybird-larva');select(fresh,'hoverfly','aphid','hoverfly-larva');
ok(checkFork(fresh,canExport),'initial check');
let v=forkView(fresh);ok(forkLiveRow(v,row(fresh,'sap')).solid,'sap live solid');ok(forkLiveRow(v,row(fresh,'ladybird')).solid,'ladybird live solid');
ok(!forkLiveRow(v,row(fresh,'hoverfly')).solid,'general slip cannot support exact hoverfly pair');
ok(fresh.foodFork.checks.at(-1).outcomes.hoverfly.feedback.includes('closer study'),'source-specific initial feedback');
ok(setForkEvidence(fresh,'closer',canExport),'closer slip');ok(forkLiveRow(forkView(fresh),row(fresh,'hoverfly')).status==='unchecked','switch does not regrade');
ok(checkFork(fresh,canExport),'closer check');ok(forkLiveRow(forkView(fresh),row(fresh,'hoverfly')).solid,'specific source supports pair');
ok(fresh.foodFork.checks[0].outcomes.hoverfly.outcome===false,'old result retained');
ok(setForkAnswer(fresh,'hoverfly','food','bean',canExport),'revise edge');ok(forkLiveRow(forkView(fresh),row(fresh,'hoverfly')).status==='unchecked','revision requires recheck');
ok(JSON.stringify(Object.fromEntries(Object.keys(old).map(k=>[k,fresh[k]])))===oldBytes,'older roots unchanged');

const uncertain=freshState();ok(startFork(uncertain,canExport),'uncertain start');
ok(setForkAnswer(uncertain,'hoverfly','notEnough',true,canExport),'explicit not enough');ok(checkFork(uncertain,canExport),'uncertain check');
v=forkView(uncertain);ok(v.readable.length===1&&v.root.checks[0].outcomes.hoverfly.outcome===true,'general slip explicit uncertainty fits');
ok(!forkLiveRow(v,row(uncertain,'hoverfly')).solid,'uncertainty has no solid arrow');
ok(forkPage(uncertain).includes('general note does not establish'),'normal uncertainty feedback visible');

const contradictory=roundTrip(uncertain);contradictory.foodFork.page='build';contradictory.foodFork.answers.hoverfly={food:'aphid',eater:'hoverfly-larva',notEnough:false};
contradictory.foodFork.checks[0].answers.hoverfly=clone(contradictory.foodFork.answers.hoverfly);contradictory.foodFork.checks[0].outcomes.hoverfly={outcome:true,feedback:'Imported historical claim'};
v=forkView(contradictory);ok(v.status==='ready','contradictory history admitted');ok(forkLiveRow(v,row(contradictory,'hoverfly')).status==='recorded-only','historical flag cannot become live claim');
ok(!forkPage(contradictory).includes('Solid: supported by this displayed slip'),'diagram no solid claim');
ok(forkNotes(contradictory).includes('Imported historical claim'),'raw historical feedback retained in notes');
ok(JSON.stringify(roundTrip(contradictory)).includes('Imported historical claim'),'exact JSON retains history');
const rawAfter=roundTrip(fresh);rawAfter.foodFork.answers.hoverfly={food:'aphid',eater:'hoverfly-larva',notEnough:false};rawAfter.foodFork.checks.push({id:rawAfter.foodFork.nextCheck,broken:true});rawAfter.foodFork.nextCheck++;
const rawAfterBytes=JSON.stringify(rawAfter.foodFork.checks.at(-1));
ok(forkView(rawAfter).unreadable.length===1,'raw check after latest readable retained');
ok(forkLiveRow(forkView(rawAfter),row(rawAfter,'sap')).solid,'last readable support survives later raw sibling');
ok(JSON.stringify(rawAfter.foodFork.checks.at(-1))===rawAfterBytes,'later raw sibling remains exact');
const reordered=roundTrip(rawAfter),prior=reordered.foodFork.checks.at(-2).answers.sap;
reordered.foodFork.answers.sap={notEnough:prior.notEnough,eater:prior.eater,food:prior.food,importedUnknown:'still raw'};
ok(forkLiveRow(forkView(reordered),row(reordered,'sap')).solid,'known answer fields compare independent of imported object order and extra key');
const wrongCopy=roundTrip(uncertain);wrongCopy.foodFork.page='build';wrongCopy.foodFork.checks[0].outcomes.hoverfly.feedback='Unsupported imported praise';
ok(!forkPage(wrongCopy).includes('Current check: Unsupported imported praise'),'live wording comes from frozen slip, not imported feedback');ok(forkNotes(wrongCopy).includes('Unsupported imported praise'),'recorded feedback still exported unchanged');

const malformed=roundTrip(fresh);malformed.foodFork.page='build';malformed.foodFork.answers.sap={food:'missing',eater:'aphid',notEnough:false};malformed.foodFork.checks.push({bad:'check'});
const sapRaw=JSON.stringify(malformed.foodFork.answers.sap),badRaw=JSON.stringify(malformed.foodFork.checks.at(-1));
v=forkView(malformed);ok(v.status==='ready'&&v.unreadable.length===1,'malformed sibling does not recover whole root');
ok(forkPage(malformed).includes('unreadable saved proposal'),'unreadable known row unavailable');ok(!setForkAnswer(malformed,'sap','food','bean',canExport),'refuse malformed overwrite');
ok(setForkAnswer(malformed,'ladybird','food','aphid',canExport),'other row remains open');ok(JSON.stringify(malformed.foodFork.answers.sap)===sapRaw&&JSON.stringify(malformed.foodFork.checks.at(-1))===badRaw,'raw siblings unchanged');
for(let i=0;i<15;i++)ok(checkFork(malformed,canExport),`rolling check ${i}`);
v=forkView(malformed);ok(v.readable.length===12&&v.unreadable.length===1,'12 readable roll; malformed check untouched');
ok(JSON.stringify(malformed.foodFork.checks.find(c=>c?.bad==='check'))===badRaw,'raw malformed check stays exact');

const alternate=roundTrip(freshState());ok(startFork(alternate,canExport),'alternate start');const src=alternate.foodFork.source;src.id='saved-alternate';src.cards=src.cards.map((c,i)=>({...c,id:`saved${i}`,label:`Saved card ${i}`}));const ids=src.cards.map(c=>c.id);src.rows=src.rows.map((r,i)=>({...r,id:`savedrow${i}`,prompt:`Saved prompt ${i}`,initial:{...r.initial,expected:r.initial.expected?{food:ids[[0,1,1][i]],eater:ids[[1,2,3][i]]}:null},closer:r.closer?{...r.closer,expected:{food:ids[1],eater:ids[3]}}:undefined})).map(r=>{if(r.closer===undefined)delete r.closer;return r;});
alt: {ok(validForkSource(src),'admit saved IDs/copy independent of current catalog');ok(forkView(alternate).status==='ready','alternate saved source resumes');ok(setForkAnswer(alternate,'savedrow0','food','saved0',canExport),'alternate answer');ok(adaptivePage(alternate,'fork').includes('Saved prompt 0'),'alternate rendered own prompt');}

const recovery=freshState();recovery.foodFork={version:99,source:{future:true},retainedRaw:{older:{nested:true}}};const raw=JSON.stringify(recovery.foodFork);
ok(forkView(recovery).status==='recovery','future root recovery');ok(adaptivePage(recovery,'fork').includes('data-fork-confirm')&&!adaptivePage(recovery,'fork').includes('data-fork-start'),'explicit separate board only');
ok(startFork(recovery,canExport,true),'confirmed new start possible');ok(JSON.stringify(recovery.foodFork.retainedRaw)===raw,'whole old root nested exact');
ok(prepareProgressImport(JSON.stringify(report(recovery),null,2)).ok,'actual transfer admits nested raw');
const importSource=report(malformed),prepared=prepareProgressImport(JSON.stringify(importSource,null,2));ok(prepared.ok,'actual loader accepts malformed siblings');
ok(JSON.stringify(prepared.state.foodFork)===JSON.stringify(malformed.foodFork),'loader preserves malformed raw exactly');ok(destinationNotes(prepared.state).includes('Food-link Fork Board'),'actual notes render');

const refusal=freshState();ok(startFork(refusal,canExport),'refusal start');const before=JSON.stringify(refusal.foodFork);
ok(!setForkPage(refusal,'build',()=>false),'actual report callback refusal');ok(JSON.stringify(refusal.foodFork)===before,'atomic page refusal');
ok(!setForkSupport(refusal,'helpOpened',()=>false),'help support refuses full report');ok(!setForkSupport(refusal,'narrationRequested',()=>false),'Hear support refuses full report');ok(JSON.stringify(refusal.foodFork)===before,'refused support leaves root exact');
ok(!startFork(refusal,()=>false,true),'recovery wrapper refused');ok(JSON.stringify(refusal.foodFork)===before,'atomic recovery refusal');
// Candidate state still fits, but pretty report metadata crosses the real import limit.
const near=freshState();ok(startFork(near,()=>true),'near-limit source starts without report');
const stateSize=new TextEncoder().encode(JSON.stringify(near,null,2)).length,reportSize=new TextEncoder().encode(JSON.stringify(report(near),null,2)).length;
near.padding='x'.repeat(MAX_IMPORT_BYTES-stateSize-Math.floor((reportSize-stateSize)/2)-20);
ok(new TextEncoder().encode(JSON.stringify(near,null,2)).length<MAX_IMPORT_BYTES&&new TextEncoder().encode(JSON.stringify(report(near),null,2)).length>MAX_IMPORT_BYTES,'state fits while actual report exceeds limit');
const beforeNear=JSON.stringify(near.foodFork);ok(!setForkPage(near,'build',canExport),'formatted report limit refuses write');ok(JSON.stringify(near.foodFork)===beforeNear,'near-limit refusal atomic');
console.log(`Food-link Fork Board: ${checks} focused assertions passed.`);
