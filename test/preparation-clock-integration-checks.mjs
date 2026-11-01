import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {startAdaptiveRival,setRivalInput} from '../dist/post-rival.mjs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {startChange,chooseReturn} from '../dist/market-change-core.mjs';
import {startAdaptiveSpiral,inspectAdaptive,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {clockView,startClock,setClockPage,chooseClockReading,chooseClockSetting,stepClock,addClockSupport,checkClock,clockCheckMatches} from '../dist/preparation-clock-core.mjs';
import {preparationClockPage,preparationClockNotes} from '../dist/preparation-clock-ui.mjs';
import {preparationClockDiagram} from '../dist/preparation-clock-art.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());ok(startPostOffice(s,'clover-buns'));ok(startAdaptiveRival(s));setRivalInput(s,'17');startChange(s,'leaf-short');chooseReturn(s,'short');startAdaptiveSpiral(s);inspectAdaptive(s,0);s.exposures=['3x4'];const before=copy(s),suggestions=['science','reading','math'].map(k=>adaptiveSuggestion(s,k));
const r=startClock(s,'maps');chooseClockReading(s,19);stepClock(s,1);ok(checkClock(s).fulfilled);addClockSupport(s,'together');checkClock(s);const other=copy(s);delete other.preparationClock;eq(other,before,'all older games and suggestions untouched');eq(['science','reading','math'].map(k=>adaptiveSuggestion(s,k)),suggestions);
for(const page of ['read','set','kept']){setClockPage(s,page);const exact=copy(s);ok(workshopPage(s,'clock').includes('clock-page'));preparationClockPage(s);preparationClockNotes(s);workshopNotes(s);destinationNotes(s);eq(s,exact,'pages and notes pure');}
const frozen=copy(s.preparationClock),raw=JSON.stringify(s);eq(restoreStateResult(raw).state.preparationClock,frozen);const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.preparationClock,frozen);store.save(s);const first=store.active.id,otherExplorer=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startClock(otherExplorer,'books');store.save(otherExplorer);eq(store.select(first,otherExplorer).preparationClock,frozen);eq(initializeExplorerState(new ExplorerStore(disk).load()).preparationClock,frozen);
for(const payload of [null,'<script>not executable</script>',{version:77,raw:'<img src=x onerror="bad()">'}]){const state=initializeExplorerState(freshState());state.preparationClock=copy(payload);const exact=copy(state),html=preparationClockPage(state)+preparationClockNotes(state);eq(state,exact);ok(!html.includes('<script>not')&&!html.includes('<img src=x'));ok(prepareProgressImport(JSON.stringify(state)).ok);}
{
 const state={};preparationClockPage(state);preparationClockNotes(state);eq(state,{});const visit=startClock(state,'labels');visit.source.drawingVersion=24;visit.source.pictureText='Earlier fixed picture <as text>';visit.source.departureLabel='09:30';setClockPage(state,'read');const html=preparationClockPage(state);ok(html.includes('Earlier fixed picture &lt;as text&gt;'));ok(!html.includes('<svg'));setClockPage(state,'set');ok(preparationClockPage(state).includes('09:30'));ok(preparationClockPage(state).includes('Model clock label'));eq(prepareProgressImport(JSON.stringify({...freshState(),...state})).state.preparationClock,state.preparationClock);
}
{
 const state={},visit=startClock(state,'maps');chooseClockReading(state,19);stepClock(state,1);const c=checkClock(state);c.readingMatch=false;c.fulfilled=true;c.readingLabel='Earlier recorded label';c.modelPictureText='Earlier recorded description';c.feedback='Earlier contradictory result';visit.source.title='Later source words';const exact=copy(state),html=preparationClockPage(state)+preparationClockNotes(state);ok(html.includes('Earlier contradictory result'));ok(html.includes('Earlier recorded label'));ok(html.includes('Earlier recorded description'));eq(state,exact);ok(!clockCheckMatches(visit));checkClock(state);const withEarlier=preparationClockPage(state);ok(withEarlier.includes('Earlier recorded check'));ok(withEarlier.includes('Latest check of these choices'));
}
{
 const state={},visit=startClock(state,'labels');state.preparationClock.rounds.push({id:2,raw:'<b>older</b>'});state.preparationClock.current=2;const raw=copy(state.preparationClock.rounds[1]);eq(clockView(state).current.id,visit.id);stepClock(state,1);eq(clockView(state).earlier,[raw]);ok(preparationClockPage(state).includes('&lt;b&gt;'));const duplicate=copy(visit);state.preparationClock.rounds.push(duplicate);eq(clockView(state).earlier,[raw,duplicate]);
}
{
 const state={},r=startClock(state,'labels');state.preparationClock.rounds=Array.from({length:15},(_,i)=>({...copy(r),id:i+1}));state.preparationClock.current=15;state.preparationClock.nextId=16;state.preparationClock.rounds.push({id:80,raw:'kept unknown'});const exact=copy(state),html=preparationClockPage(state);eq(state,exact);ok(html.includes('oldest 4 readable visits'));startClock(state,'maps');eq(clockView(state).rounds.length,12);eq(clockView(state).rounds[0].id,5);eq(state.preparationClock.current,81);eq(clockView(state).earlier,[{id:80,raw:'kept unknown'}]);
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),state=initializeExplorerState(off.load());startClock(state,'labels');chooseClockSetting(state,'clock');off.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null);eq(off.load().preparationClock,state.preparationClock);
}
for(let slot=0;slot<24;slot++){const svg=preparationClockDiagram(slot);ok(svg.includes(`data-clock-slot="${slot}"`));ok(svg.includes(`data-angle="${Math.floor(slot/2)*30+(slot%2?15:0)}"`));ok(svg.includes(`data-angle="${slot%2?180:0}"`));ok(!svg.includes('9:30'),'no default digital readout');}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('workshopPage(state,slug)'));ok(!app.includes("from './preparation-clock"));ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('preparation-clock.css'));ok(readFileSync(new URL('../dist/post-office-ui.mjs',import.meta.url),'utf8').includes('href="#workshop/clock"'));
console.log(`Preparation Clock integration: ${n} assertions passed.`);
