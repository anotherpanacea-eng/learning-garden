import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {startCoinRound,adjustCoin,selectCoinMat,checkCoinPayments} from '../dist/coin-counter-core.mjs';
import {startFood} from '../dist/food-links-core.mjs';
import {startLife} from '../dist/life-stages-core.mjs';
import {startAdaptiveSpiral,inspectAdaptive,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {changeView,startChange,setChangePage,chooseTenderRelation,chooseReturn,zeroReturn,adjustReturnCoin,exchangeReturnCoins,addChangeSupport,checkChange,changeCheckMatches} from '../dist/market-change-core.mjs';
import {marketChangePage,marketChangeNotes} from '../dist/market-change-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());startCoinRound(s,'seed-tag');for(let i=0;i<3;i++)adjustCoin(s,'nickel',1);selectCoinMat(s,'B');adjustCoin(s,'dime',1);adjustCoin(s,'nickel',1);ok(checkCoinPayments(s).fulfilled);startFood(s,'aphid-food');startLife(s,'adult-next');startAdaptiveSpiral(s);inspectAdaptive(s,0);s.exposures=['3x4'];const before=copy(s),suggestions=['science','reading','math'].map(k=>adaptiveSuggestion(s,k));
const r=startChange(s,'label-quarter');chooseTenderRelation(s,'above');adjustReturnCoin(s,'dime',1);for(let i=0;i<3;i++)adjustReturnCoin(s,'penny',1);ok(checkChange(s).fulfilled);addChangeSupport(s,'together');checkChange(s);const other=copy(s);delete other.marketChange;eq(other,before,'old A/B, habitat, food/stages, stock and all other roots untouched');eq(['science','reading','math'].map(k=>adaptiveSuggestion(s,k)),suggestions,'new money answers do not become habitat evidence');
for(const page of ['read','coins','return','kept']){setChangePage(s,page);const exact=copy(s);ok(workshopPage(s,'change').includes('change-page'),'actual Workshop slug reaches mode');marketChangePage(s);marketChangeNotes(s);workshopNotes(s);destinationNotes(s);eq(s,exact,'all pages/notes pure');}
const frozen=copy(s.marketChange),raw=JSON.stringify(s);eq(restoreStateResult(raw).state.marketChange,frozen);const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.marketChange,frozen);store.save(s);const first=store.active.id,otherExplorer=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startChange(otherExplorer,'leaf-short');chooseReturn(otherExplorer,'short');store.save(otherExplorer);eq(store.select(first,otherExplorer).marketChange,frozen,'explorers isolate roots');eq(initializeExplorerState(new ExplorerStore(disk).load()).marketChange,frozen,'actual disk reload');
{
 const state={},exact=copy(state);marketChangePage(state);marketChangeNotes(state);eq(state,exact,'view never allocates');startChange(state,'ribbon-exact');ok(workshopNotes(state).includes('Market Change')||workshopNotes(state).includes('Market change'),'new notes without old Workshop');
}
for(const payload of [null,'<script>not executable</script>',{version:77,raw:'<img src=x onerror="bad()">'}]){const state=initializeExplorerState(freshState());state.marketChange=copy(payload);const exact=copy(state),html=marketChangePage(state)+marketChangeNotes(state);eq(state,exact);ok(!html.includes('<script>not')&&!html.includes('<img src=x'),'future original text escaped');ok(prepareProgressImport(JSON.stringify(state)).ok);}
{
 const state=initializeExplorerState(freshState()),visit=startChange(state,'leaf-short');visit.source.price=8;visit.source.tender={penny:0,nickel:0,dime:1,quarter:0};visit.source.drawingVersion=24;visit.source.denominations[0].name='Retained coin label <as text>';chooseTenderRelation(state,'above');adjustReturnCoin(state,'penny',1);adjustReturnCoin(state,'penny',1);ok(checkChange(state).fulfilled,'fresh checks use own earlier price/tender');setChangePage(state,'coins');const exact=copy(state),html=marketChangePage(state);ok(html.includes('Retained coin label &lt;as text&gt;'),'future drawing retains own labels');ok(!html.includes('<svg class="coin-face"'),'unknown picture version never dispatches current coin art');eq(state,exact);eq(prepareProgressImport(JSON.stringify(state)).state.marketChange,state.marketChange);
}
{
 const state=initializeExplorerState(freshState()),visit=startChange(state,'ribbon-exact');chooseTenderRelation(state,'exact');zeroReturn(state);const c=checkChange(state);c.actualRelation='below';c.shortage=3;c.returned.value=42;c.changeMatch=false;c.feedback='Earlier contradictory money result';const old=copy(c.source);visit.source.title='Later words on current visit';const exact=copy(state),html=marketChangePage(state)+marketChangeNotes(state);ok(html.includes('Earlier contradictory money result'));eq(c.source,old);eq(state,exact,'render does not regrade recorded fields');ok(!changeCheckMatches(visit));eq(prepareProgressImport(JSON.stringify(state)).state.marketChange,state.marketChange);
}
{
 const state=initializeExplorerState(freshState()),visit=startChange(state,'ribbon-dime');state.marketChange.rounds.push({id:2,raw:'<b>old money</b>'});state.marketChange.current=2;const raw=copy(state.marketChange.rounds[1]);eq(changeView(state).current.id,visit.id);adjustReturnCoin(state,'penny',1);eq(changeView(state).earlier,[raw]);ok(marketChangePage(state).includes('&lt;b&gt;'));const dup=copy(visit);state.marketChange.rounds.push(dup);eq(changeView(state).earlier,[raw,dup]);ok(prepareProgressImport(JSON.stringify(state)).ok);
}
{
 const state=initializeExplorerState(freshState()),original=startChange(state,'ribbon-exact');state.marketChange.rounds=Array.from({length:15},(_,i)=>({...copy(original),id:i+1}));state.marketChange.current=15;state.marketChange.nextId=16;state.marketChange.rounds.push({id:80,raw:'kept unknown'});const exact=copy(state),html=marketChangePage(state);eq(state,exact,'view never trims oversized history');ok(html.includes('oldest 4 readable visits'),'exact capacity warning');startChange(state,'leaf-short');eq(changeView(state).rounds.length,12);eq(changeView(state).rounds[0].id,5);eq(state.marketChange.current,81);eq(changeView(state).earlier,[{id:80,raw:'kept unknown'}]);
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),state=initializeExplorerState(off.load());startChange(state,'ribbon-exact');zeroReturn(state);off.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null);eq(off.load().marketChange,state.marketChange);
}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('workshopPage(state,slug)'));ok(!app.includes("from './market-change"),'no held root edit');ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('market-change.css'));ok(readFileSync(new URL('../dist/coin-counter-ui.mjs',import.meta.url),'utf8').includes('href="#workshop/change"'),'old Coin Counter invitation');
console.log(`Market change integration: ${n} assertions passed.`);
