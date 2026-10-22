import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {lifeView,startLife,setLifePage,setLifeView,chooseLifeNeighbor,chooseLifeMeaning,addLifeSupport,checkLife,lifeCheckMatches} from '../dist/life-stages-core.mjs';
import {lifeStagesPage,lifeStagesNotes} from '../dist/life-stages-ui.mjs';
import {lifeStageDiagram} from '../dist/life-stages-art.mjs';
import {adaptivePage,adaptiveNotes} from '../dist/living-adaptive-ui.mjs';
import {startAdaptiveSpiral,inspectAdaptive,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {startBody,chooseBodyLegs,chooseBodyFeature,checkBody} from '../dist/body-clues-core.mjs';
import {startBalance,changeBalance,checkBalance} from '../dist/balance-stall-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());startAdaptiveSpiral(s);inspectAdaptive(s,0);startBody(s,'snail');chooseBodyLegs(s,'0');chooseBodyFeature(s,'shell');checkBody(s);startBalance(s,'leaf-parcel');changeBalance(s,'both',-1);checkBalance(s);s.exposures=['3x4'];const old=copy(s),suggestions=['science','reading','math'].map(k=>adaptiveSuggestion(s,k));
const r=startLife(s,'egg-before');chooseLifeNeighbor(s,'adult');chooseLifeMeaning(s,'same');checkLife(s);chooseLifeMeaning(s,'offspring');addLifeSupport(s,'together');checkLife(s);const rest=copy(s);delete rest.lifeStages;eq(rest,old,'unrelated habitat/body/parcel/stock/math/balance state preserved');eq(['science','reading','math'].map(k=>adaptiveSuggestion(s,k)),suggestions,'new science selections not habitat depth evidence');
for(const page of ['inspect','connect','meaning','kept'])for(const view of ['egg','larva','pupa','adult']){setLifePage(s,page);setLifeView(s,view);const before=copy(s);ok(adaptivePage(s,'stages').includes('life-page'),'actual siblingroute reaches newstagepack');lifeStagesPage(s);lifeStagesNotes(s);adaptiveNotes(s);destinationNotes(s);eq(s,before,'all16page/view renders andnotes pure');}
const raw=JSON.stringify(s),frozen=copy(s.lifeStages);eq(restoreStateResult(raw).state.lifeStages,frozen);const prepared=prepareProgressImport(raw);ok(prepared.ok);eq(prepared.state.lifeStages,frozen,'generic actual import exact');store.save(s);const first=store.active.id,other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startLife(other,'pupa-next');chooseLifeNeighbor(other,'adult');store.save(other);eq(store.select(first,other).lifeStages,frozen,'explorer roots isolated');eq(initializeExplorerState(new ExplorerStore(disk).load()).lifeStages,frozen,'actual disk reload');
{
 const state={};const before=copy(state);lifeStagesPage(state);lifeStagesNotes(state);eq(state,before,'opening alone does not allocate');startLife(state,'egg-next');ok(adaptiveNotes(state).includes('Life stages')||adaptiveNotes(state).includes('life stages'),'newnotes withoutoldhabitat');
}
for(const payload of [null,'<script>not executable</script>',{version:77,raw:'<img src=x onerror="bad()">'}]){const state=initializeExplorerState(freshState());state.lifeStages=copy(payload);const before=copy(state);const html=lifeStagesPage(state)+lifeStagesNotes(state);eq(state,before);ok(!html.includes('<script>not')&&!html.includes('<img src=x'),'unavailable originals escaped');ok(prepareProgressImport(JSON.stringify(state)).ok,'optional unknown root transferable');}
{
 const state=initializeExplorerState(freshState()),visit=startLife(state,'egg-next');visit.source.stages[0].drawing={version:25,kind:'future-egg'};visit.source.stages[0].pictureText='A retained future-picture description <still text>.';const before=copy(state);const html=lifeStagesPage(state);ok(html.includes('life-picture-unavailable'),'future picture gracefully unavailable');ok(html.includes('A retained future-picture description &lt;still text&gt;.'),'own accessible text preserved');eq(lifeView(state).current.id,visit.id,'otherwise understood visit remains playable');chooseLifeNeighbor(state,'larva');chooseLifeMeaning(state,'same');eq(checkLife(state).neighborMatch,true);eq(visit.source.stages[0],before.lifeStages.rounds[0].source.stages[0]);ok(prepareProgressImport(JSON.stringify(state)).ok);
 visit.source.stages[0].drawing={version:1,kind:'unrecognised-original'};ok(lifeStageDiagram(visit.source.stages[0]).includes('life-picture-unavailable'),'unknownkind neverdispatchescurrentwrongpicture');visit.source.stages[0].drawing={version:1,kind:'larva'};ok(lifeStageDiagram(visit.source.stages[0]).includes('life-picture-unavailable'),'known kind mismatching stage falls back rather than relabelling another picture');eq(lifeView(state).current.id,visit.id,'mismatched picture does not discard understood text/answers');
}
{
 const state=initializeExplorerState(freshState()),visit=startLife(state,'egg-next');chooseLifeNeighbor(state,'larva');chooseLifeMeaning(state,'same');const c=checkLife(state);c.neighborMatch=false;c.meaningMatch=true;c.feedback='Earlier contradictory chart result';visit.source.expected={neighbor:'adult',meaning:'offspring'};visit.source.stages[0].text='Earlier chart wording retained with current visit';const old=copy(c.source),before=copy(state);const html=lifeStagesNotes(state)+lifeStagesPage(state);ok(html.includes('Earlier contradictory chart result'));eq(c.source,old,'check ownsoriginalsource');eq(state,before,'notes/currentrenderneverregrade');ok(!lifeCheckMatches(visit));eq(prepareProgressImport(JSON.stringify(state)).state.lifeStages,state.lifeStages);
}
{
 const state=initializeExplorerState(freshState()),visit=startLife(state,'egg-next');state.lifeStages.rounds.push({id:2,raw:'<b>old stage</b>'});state.lifeStages.current=2;const raw=copy(state.lifeStages.rounds[1]);eq(lifeView(state).current.id,visit.id);chooseLifeNeighbor(state,'larva');eq(lifeView(state).earlier,[raw]);ok(lifeStagesPage(state).includes('&lt;b&gt;'));const dup=copy(visit);state.lifeStages.rounds.push(dup);eq(lifeView(state).earlier,[raw,dup]);ok(prepareProgressImport(JSON.stringify(state)).ok);
}
{
 const state=initializeExplorerState(freshState());const original=startLife(state,'egg-next');state.lifeStages.rounds=Array.from({length:15},(_,i)=>({...copy(original),id:i+1}));state.lifeStages.current=15;state.lifeStages.nextId=16;state.lifeStages.rounds.push({id:80,raw:'kept unknown'});const before=copy(state);lifeStagesPage(state);eq(state,before,'viewnevertrimsoversizedhistory');startLife(state,'larva-before');eq(lifeView(state).rounds.length,12);eq(lifeView(state).rounds[0].id,5);eq(state.lifeStages.current,81);eq(lifeView(state).earlier,[{id:80,raw:'kept unknown'}]);
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),state=initializeExplorerState(off.load());startLife(state,'adult-before');chooseLifeNeighbor(state,'pupa');off.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null);eq(off.load().lifeStages,state.lifeStages);
}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('spiralPage(state,slug)'),'existing root delegatesactualslug');ok(!app.includes("from './life-stages"),'noheldappeditneeded');ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('life-stages.css'));ok(adaptivePage(s).includes('href="#living/stages"'),'Gardenentrypresent');
console.log(`Life stages integration: ${n} assertions passed.`);
