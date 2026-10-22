import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {cartographerPage} from '../dist/cartographer-ui.mjs';
import * as maps from '../dist/cartographer-core.mjs';
import * as I from '../dist/instruction-core.mjs';
import * as archive from '../dist/travelers-archive-core.mjs';
import * as old from '../dist/fraction-trail-core.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {startAdaptiveRival,setRivalInput} from '../dist/post-rival.mjs';
import {startClock,stepClock,checkClock} from '../dist/preparation-clock-core.mjs';
import {startTrail,chooseTrailAnswer,checkTrail} from '../dist/source-trail-core.mjs';
import {startMatch,startMatchFlag,moveMatchFlag,chooseMatchNumerator,checkMatch} from '../dist/ribbon-matches-core.mjs';
import {repeatView,startRepeat,setRepeatPage,setRepeatArrow,setRepeatCount,beginRepeat,stepRepeat,checkRepeat} from '../dist/repeat-deliveries-core.mjs';
import {repeatCases} from '../dist/repeat-deliveries-content.mjs';
import {repeatDeliveriesPage,repeatDeliveriesNotes} from '../dist/repeat-deliveries-ui.mjs';
import {repeatDeliveryMap} from '../dist/repeat-deliveries-art.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());
old.chooseTrailCase(s,'same-half');old.prepareTrailPartition(s,4);old.startTrailFlag(s);old.moveTrailFlag(s,1);old.moveTrailFlag(s,1);old.setTrailReading(s,' 2/4 ');old.checkTrail(s,'reading');old.keepTrail(s);old.setTrailPage(s,'keep');
ok(startPostOffice(s,'clover-buns'));ok(startAdaptiveRival(s));setRivalInput(s,'17');s.postOffice.visits[0].packing.input='8';eq(s.postOffice.visits[0].rival.input,'17');
startClock(s,'maps');stepClock(s,1);checkClock(s);startTrail(s,'origin');chooseTrailAnswer(s,'photo');checkTrail(s);startMatch(s,'third-sixths');startMatchFlag(s);moveMatchFlag(s,1);moveMatchFlag(s,1);chooseMatchNumerator(s,2);checkMatch(s);
I.chooseInstructionCase(s,'post','pocket-note');I.editInstructionStrip(s,'post','add','fold');I.tryInstructionStrip(s,'post');I.stepInstructionRun(s,'post',1);I.setInstructionText(s,'post','  Original synthetic instructions.\n');I.readInstructionWords(s,'post','Where?');I.setInstructionComment(s,'post','  A synthetic reader comment.  ');I.keepInstructionDraft(s,'post');
archive.ensureTravelersArchive(s);archive.setArchiveReplyText(s,'  Original synthetic archive reply.\n');archive.setArchiveReplyChoice(s,'claim','return-later');archive.checkArchiveReply(s);archive.keepArchiveReply(s);
const free=maps.startMap(s);free.places={post:{x:1,y:1},bridge:{x:4,y:1},cafe:{x:4,y:4},garden:{x:1,y:4}};free.a=[...'eeennn'];free.b=[...'nnneee'];maps.checkMapRoutes(s);maps.setMapAuthorOpen(s,true);maps.chooseMapAuthor(s,'via','bridge');const job=maps.startAuthoredMapJob(s);ok(job);job.a=[...'eeennn'];maps.checkMapRoutes(s);
const before=copy(s),r=startRepeat(s,'flowers-out');setRepeatArrow(s,0,'e');setRepeatArrow(s,1,'n');setRepeatCount(s,3);beginRepeat(s);for(let i=0;i<6;i++)stepRepeat(s);ok(checkRepeat(s).fulfilled);const without=copy(s);delete without.repeatDeliveries;eq(without,before,'all older roots, pending actual Post/Bramble and prior activities preserved');
for(const page of ['map','block','trace','kept']){setRepeatPage(s,page);const exact=copy(s);ok(workshopPage(s,'repeats').includes('repeat-sheet'));repeatDeliveriesPage(s);repeatDeliveriesNotes(s);workshopNotes(s);destinationNotes(s);eq(s,exact,'render/notes pure');}
const frozen=copy(s.repeatDeliveries),raw=JSON.stringify(s);eq(restoreStateResult(raw).state.repeatDeliveries,frozen);const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.repeatDeliveries,frozen);store.save(s);const first=store.active.id,other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startRepeat(other,'basket-back');store.save(other);eq(store.select(first,other).repeatDeliveries,frozen);eq(initializeExplorerState(new ExplorerStore(disk).load()).repeatDeliveries,frozen);
for(const payload of [null,'<script>not executable</script>',{version:77,raw:'<img src=x onerror="bad()">'}]){const state=initializeExplorerState(freshState());state.repeatDeliveries=copy(payload);const exact=copy(state),html=repeatDeliveriesPage(state)+repeatDeliveriesNotes(state);eq(state,exact);ok(!html.includes('<script>not')&&!html.includes('<img src=x'));ok(prepareProgressImport(JSON.stringify(state)).ok);}
{
const state={},visit=startRepeat(state,'sign-out');visit.source.id='earlier-map';visit.source.drawingVersion=99;visit.source.pictureText='Earlier picture <as text>';setRepeatArrow(state,0,'e');setRepeatArrow(state,1,'n');setRepeatCount(state,2);beginRepeat(state);stepRepeat(state);setRepeatPage(state,'trace');const html=repeatDeliveriesPage(state);ok(!html.includes('<svg'));ok(html.includes('Earlier picture &lt;as text&gt;'));ok(html.includes('(2, 1)'));ok(checkRepeat(state));eq(prepareProgressImport(JSON.stringify({...freshState(),...state})).state.repeatDeliveries,state.repeatDeliveries);
}
{
const state={},visit=startRepeat(state,'sign-out');const c=checkRepeat(state);c.input.count=2;c.input.run={cursor:6};c.expanded=['w','w','w','w'];c.trace={commands:['w'],points:[{x:4,y:3}],steps:6,distance:0,blocked:2,arrived:true};c.attempted=0;c.travelled=6;c.deliveryMatch=true;c.fulfilled=false;c.traceDescription='Earlier contradictory path';c.feedback='Earlier exact feedback';visit.source.title='Later title';const exact=copy(state);ok(repeatView(state).current);const html=repeatDeliveriesPage(state)+repeatDeliveriesNotes(state);ok(html.includes('Earlier contradictory path'));ok(html.includes('Earlier exact feedback'));ok(html.includes('data-repeat-courier-x="4" data-repeat-courier-y="3"'));eq(state,exact,'recorded trace displayed without replay');
}
{
const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),state=initializeExplorerState(off.load());startRepeat(state,'sign-out');off.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null);eq(off.load().repeatDeliveries,state.repeatDeliveries);
}
for(const source of repeatCases){const svg=repeatDeliveryMap(source);for(const m of source.marks){const p=source.places[m.id];ok(svg.includes(`data-repeat-landmark="${m.id}" data-x="${p.x}" data-y="${p.y}"`));ok(svg.includes(`x="${44+p.x*56}" y="${304-p.y*56+6}"`));}ok(svg.includes('viewBox="0 0 360 364"'));}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('workshopPage(state,slug)'));ok(!app.includes("from './repeat-deliveries"));ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('repeat-deliveries.css'));ok(cartographerPage(s).includes('href="#workshop/repeats"'));ok(repeatDeliveriesPage(s).includes('href="#workshop/maps"'));
console.log(`Repeat Deliveries integration: ${n} assertions passed.`);
