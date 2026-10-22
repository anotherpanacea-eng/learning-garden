import assert from 'node:assert/strict';
import {seedSource,validSeedSource,validSeedRun,validSeedInvestigation,seedView,seedCounts,seedReplacement,startSeed,chooseSeedPrediction,drawSeed,repeatSeed,resumeSeed,recoverSeed,browserSeedSlot} from '../dist/seed-stall-core.mjs';
import {seedPage} from '../dist/seed-stall-ui.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';

let checks=0;
const yes=(value,message)=>{assert.ok(value,message);checks++;};
const same=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
const no=(value,message)=>{assert.equal(value,false,message);checks++;};
const snap=x=>JSON.stringify(x);
const exportable=()=>true;

for(let sun=0;sun<=6;sun++){
 const source=seedSource(sun);yes(validSeedSource(source),`bag ${sun} source`);
 same(source.slots.length,6,`bag ${sun} count`);same(source.slots.filter(x=>x==='sun').length,sun,`bag ${sun} sun count`);
 for(let slot=0;slot<6;slot++){
  same(source.slots[slot],slot<sun?'sun':'moon',`bag ${sun}, slot ${slot}`);
  const oneDraw={};yes(startSeed(oneDraw,sun));yes(drawSeed(oneDraw,slot));same(seedView(oneDraw).current.runs[0].draws,[source.slots[slot]],`bag ${sun}, pictured slot ${slot} maps to recorded mark`);
 }
}
same(seedSource(-1),null);same(seedSource(7),null);
const state={other:{saved:'untouched'}};
same(seedView(state).status,'missing');
const started=startSeed(state,5,null,exportable);yes(started);same(state.other.saved,'untouched');same(seedView(state).current.source.slots,['sun','sun','sun','sun','sun','moon']);
yes(chooseSeedPrediction(state,'sun'));yes(chooseSeedPrediction(state,'moon'));same(seedView(state).current.runs[0].prediction,'moon');
for(let i=0;i<6;i++)yes(drawSeed(state,5,exportable),'unusual moon-only run remains possible');
same(seedCounts(seedView(state).current.runs[0].draws),{sun:0,moon:6});yes(validSeedInvestigation(seedView(state).current));
no(chooseSeedPrediction(state,'sun'),'prediction locked after first draw');no(drawSeed(state,0),'no seventh draw');
yes(repeatSeed(state));same(seedView(state).current.runs.at(-1),{prediction:null,draws:[]});
for(let i=0;i<6;i++)yes(drawSeed(state,0));yes(repeatSeed(state));for(let i=0;i<6;i++)yes(drawSeed(state,i));no(repeatSeed(state),'only three runs');

const earlier=structuredClone(state.seedStall.investigations[0]);
earlier.source.rule='Older safe wording about drawing with replacement.';earlier.source.explanation='Historical source explanation.';earlier.source.predictionLabels.sun='Earlier sun choice';earlier.source.extra={future:'retained'};earlier.extra={future:'retained'};earlier.runs[0].extra={future:'retained'};
yes(validSeedInvestigation(earlier),'own older wording and harmless fields accepted');
const historical={seedStall:{version:1,current:earlier.id,nextId:2,investigations:[earlier],extra:{future:'retained'}}};
yes(resumeSeed(historical,earlier.id));same(historical.seedStall.investigations[0].source.rule,'Older safe wording about drawing with replacement.');same(historical.seedStall.investigations[0].source.extra,{future:'retained'});
same(historical.seedStall.extra,{future:'retained'});same(historical.seedStall.investigations[0].runs[0].extra,{future:'retained'});
const badText=structuredClone(earlier);badText.source.rule='x'.repeat(321);no(validSeedInvestigation(badText));
const badObject=structuredClone(earlier);badObject.source.predictionLabels.sun={toString:null};no(validSeedInvestigation(badObject));
const badOne=structuredClone(earlier);badOne.source=seedSource(0);badOne.runs=[{prediction:null,draws:['sun']}];no(validSeedInvestigation(badOne),'impossible saved draw for one-mark source');
const allMoon={};yes(startSeed(allMoon,0));for(let i=0;i<6;i++)yes(drawSeed(allMoon,i));same(seedCounts(seedView(allMoon).current.runs[0].draws),{sun:0,moon:6});

const sizeState={};yes(startSeed(sizeState,3));const before=snap(sizeState);
const sunCandidate=structuredClone(sizeState);sunCandidate.seedStall.investigations[0].runs[0].draws.push('sun');
const threshold=snap(sunCandidate).length;
no(drawSeed(sizeState,3,candidate=>snap(candidate).length<=threshold),'moon actual payload exceeds sun-only threshold');same(snap(sizeState),before,'failed actual moon candidate unchanged');
yes(drawSeed(sizeState,0,candidate=>snap(candidate).length<=threshold),'sun candidate fits same threshold');
const denied=snap(sizeState);no(repeatSeed(sizeState,()=>false));same(snap(sizeState),denied);
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-01-01T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
const actualFit=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const nearLimit=s=>{const raw={id:99,rawPadding:''};s.seedStall.investigations.push(raw);const room=MAX_IMPORT_BYTES-Buffer.byteLength(JSON.stringify(report(s),null,2));yes(room>200);raw.rawPadding='€'.repeat(Math.floor((room-2)/3));yes(actualFit(s),'original full notes report importable');return s;};
const nearStart=initializeExplorerState(freshState());nearStart.seedStall={version:1,current:null,nextId:1,investigations:[]};nearLimit(nearStart);const beforeStart=snap(nearStart.seedStall);no(startSeed(nearStart,3,null,actualFit),'near-limit Start refuses based on full report');same(snap(nearStart.seedStall),beforeStart);
const nearRepeat=initializeExplorerState(freshState());yes(startSeed(nearRepeat,3));nearRepeat.seedStall.investigations[0].runs[0].draws=Array(6).fill('sun');nearLimit(nearRepeat);const beforeRepeat=snap(nearRepeat.seedStall);no(repeatSeed(nearRepeat,actualFit),'near-limit repeat refuses based on full report');same(snap(nearRepeat.seedStall),beforeRepeat);
const nearUnknown=initializeExplorerState(freshState());nearUnknown.seedStall={version:99,rawPadding:''};const unknownRoom=MAX_IMPORT_BYTES-Buffer.byteLength(JSON.stringify(report(nearUnknown),null,2));nearUnknown.seedStall.rawPadding='€'.repeat(Math.floor((unknownRoom-2)/3));yes(actualFit(nearUnknown));const beforeUnknown=snap(nearUnknown.seedStall);no(recoverSeed(nearUnknown,actualFit),'near-limit unknown-root wrapper refuses based on full report');same(snap(nearUnknown.seedStall),beforeUnknown);
const rng={items:[4294967295,11],getRandomValues(a){a[0]=this.items.shift();return a;}};same(browserSeedSlot(rng),5,'rejection sampling retries high tail');same(browserSeedSlot(null),null);
const stuck={getRandomValues(a){a[0]=4294967295;return a;}};same(browserSeedSlot(stuck),null,'failed random source cannot hang the page');
const even={};yes(startSeed(even,3));for(let i=0;i<6;i++)yes(drawSeed(even,i));const evenPage=seedPage(even);yes(evenPage.includes('Both marks have the same chance on each draw. Six draws need not end in a tie.'),'equal bag has truthful completed-run explanation');no(evenPage.includes('A bag with more of one mark'));
yes(seedPage(allMoon).includes('No prediction was recorded before this run’s first draw.'),'unset optional prediction is not presented as a deliberate selection');

const history={seedStall:{version:1,current:null,nextId:20,investigations:[]}};
for(let id=1;id<=10;id++)history.seedStall.investigations.push({id,source:seedSource(id%7),runs:[{prediction:null,draws:[]}]});
const rawA={id:30,source:{broken:true},note:'raw A'},rawB={id:31,source:{broken:true},note:'raw B'};
history.seedStall.investigations.splice(2,0,rawA);history.seedStall.investigations.splice(8,0,rawB);
const view=seedView(history);same(view.readable.length,10);same(view.unreadable.length,2);same(seedReplacement(view).entry.id,1);
const old=snap(history);no(startSeed(history,2,null),'cap requires named confirmation');same(snap(history),old);
const result=startSeed(history,2,1);yes(result);same(result.id,32,'all occupied positive IDs, including malformed, reserve identifiers');
const after=seedView(history);same(after.readable.length,10,'imported ten stays ten after one replacement');same(after.unreadable.map(x=>x.entry.note),['raw A','raw B'],'raw sibling order');same(snap(after.unreadable[0].entry),snap(rawA));same(snap(after.unreadable[1].entry),snap(rawB));
no(after.readable.some(x=>x.entry.id===1));yes(after.readable.some(x=>x.entry.id===32));
const duplicate=structuredClone(history);duplicate.seedStall.investigations.push(structuredClone(duplicate.seedStall.investigations.find(x=>x.id===2)));
same(seedView(duplicate).unreadable.filter(x=>x.entry.id===2).length,2,'duplicate ID siblings both raw');
const refusal=snap(history);no(startSeed(history,2,2,()=>false));same(snap(history),refusal,'cap refusal removes nothing');

const unknown={seedStall:{version:77,record:{older:'untouched'}}};same(seedView(unknown).status,'recovery');
const raw=snap(unknown.seedStall);no(recoverSeed(unknown,()=>false));same(snap(unknown.seedStall),raw);
yes(recoverSeed(unknown));same(snap(unknown.seedStall.recovered),raw);same(seedView(unknown).status,'ready');
console.log(`Seed Stall source and saved-work checks: ${checks} assertions passed`);
