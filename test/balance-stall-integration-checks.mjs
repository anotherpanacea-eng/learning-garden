import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {balanceView,startBalance,resumeBalance,setBalancePage,addBalanceSupport,chooseBalanceMass,changeBalance,resetBalance,checkBalance,balanceCheckMatches} from '../dist/balance-stall-core.mjs';
import {balanceStallPage,balanceStallNotes} from '../dist/balance-stall-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {startAdaptiveSpiral,inspectAdaptive,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {startBody,chooseBodyLegs,chooseBodyFeature,checkBody} from '../dist/body-clues-core.mjs';
import {startMap,placeMapMark,checkMapRoutes,setMapAuthorOpen} from '../dist/cartographer-core.mjs';
import {startCoinRound,adjustCoin,checkCoinPayments} from '../dist/coin-counter-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());startAdaptiveSpiral(s);inspectAdaptive(s,0);startBody(s,'snail');chooseBodyLegs(s,'0');chooseBodyFeature(s,'shell');checkBody(s);startMap(s);placeMapMark(s,1,1);checkMapRoutes(s);startCoinRound(s,'paper-star');adjustCoin(s,'dime',1);checkCoinPayments(s);s.exposures=['3x5'];const old=copy(s),suggestions=['science','reading','math'].map(k=>adaptiveSuggestion(s,k));
const r=startBalance(s,'leaf-parcel');chooseBalanceMass(s,5);checkBalance(s);changeBalance(s,'both',-1);changeBalance(s,'both',-1);addBalanceSupport(s,'together');checkBalance(s);const rest=copy(s);delete rest.balanceStall;eq(rest,old,'all other games/stock/facts/habitat preserved');eq(['science','reading','math'].map(k=>adaptiveSuggestion(s,k)),suggestions,'new model is not habitat suggestion evidence');
for(const page of ['balance','kept']){setBalancePage(s,page);const before=copy(s);ok(workshopPage(s,'balance').includes('balance-'),'actual Workshop seam reaches stall');balanceStallPage(s);balanceStallNotes(s);workshopNotes(s);destinationNotes(s);eq(s,before,'page/notes are pure');}
const raw=JSON.stringify(s),frozen=copy(s.balanceStall);eq(restoreStateResult(raw).state.balanceStall,frozen,'generic restore keeps optional state');const prepared=prepareProgressImport(raw);ok(prepared.ok);eq(prepared.state.balanceStall,frozen,'actual generic import keeps sources/method/proposal/outcomes');store.save(s);const first=store.active.id,other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startBalance(other,'right-parcel');changeBalance(other,'right',-1);store.save(other);eq(store.select(first,other).balanceStall,frozen,'explorers isolated');eq(initializeExplorerState(new ExplorerStore(disk).load()).balanceStall,frozen,'actual reload exact');
{
 const state={};const before=copy(state);balanceStallPage(state);balanceStallNotes(state);eq(state,before,'view missing state does not allocate');startBalance(state,'two-arrangements');ok(workshopNotes(state).includes('Balance'),'notes without old ramp');
}
for(const payload of [null,'<script>not executable</script>',{version:99,raw:'<img src=x onerror="bad()">'}]){const state=initializeExplorerState(freshState());state.balanceStall=copy(payload);const before=copy(state);const html=balanceStallPage(state)+balanceStallNotes(state);eq(state,before,'unsupported state not rewritten');ok(!html.includes('<script>not')&&!html.includes('<img src=x'),'raw escaped');ok(prepareProgressImport(JSON.stringify(state)).ok,'opaque optional state remains transferable');}
{
 const state=initializeExplorerState(freshState()),round=startBalance(state,'leaf-parcel');chooseBalanceMass(state,5);const result=checkBalance(state);result.totals={left:32,right:0};result.relation='right';result.valueMatch=false;result.isolated=true;result.feedback='Earlier contradictory recorded result';const source=copy(result.source);round.source.title='Revised source wording';round.source.parcelMass=12;const before=copy(state);const html=balanceStallNotes(state)+balanceStallPage(state);ok(html.includes('Earlier contradictory recorded result'),'stored feedback stays stored');eq(state,before,'history not recomputed');eq(result.source,source,'own old source unchanged');eq(prepareProgressImport(JSON.stringify(state)).state.balanceStall,state.balanceStall,'contradictory outcomes transfer');ok(!balanceCheckMatches(round),'changed source not current');
}
{
 const state=initializeExplorerState(freshState()),round=startBalance(state,'leaf-parcel');state.balanceStall.rounds.push({id:2,raw:'<b>unreadable original</b>'});state.balanceStall.current=2;const before=copy(state.balanceStall.rounds[1]);eq(balanceView(state).current.id,round.id);changeBalance(state,'both',-1);eq(balanceView(state).earlier,[before]);ok(balanceStallPage(state).includes('&lt;b&gt;'),'raw sibling shown escaped');ok(prepareProgressImport(JSON.stringify(state)).ok);const duplicate=copy(round);state.balanceStall.rounds.push(duplicate);eq(balanceView(state).earlier,[before,duplicate],'duplicate remains raw');const frozen=copy(state);balanceStallPage(state);balanceStallNotes(state);eq(state,frozen);
}
{
 const state=initializeExplorerState(freshState());for(let i=0;i<12;i++)startBalance(state,'leaf-parcel');const base=copy(state.balanceStall.rounds[0]);for(let i=13;i<=15;i++)state.balanceStall.rounds.push({...copy(base),id:i});state.balanceStall.current=15;state.balanceStall.nextId=16;state.balanceStall.rounds.push({id:80,raw:'kept sibling'});const before=copy(state);const html=balanceStallPage(state);ok(html.includes('4'),'oversized capacity disclosure available');eq(state,before,'render no cap trimming');startBalance(state,'star-parcel');eq(balanceView(state).rounds.length,12);eq(balanceView(state).rounds[0].id,5);eq(balanceView(state).earlier,[{id:80,raw:'kept sibling'}]);eq(state.balanceStall.current,81,'single safe allocation');
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),state=initializeExplorerState(off.load());startBalance(state,'ribbon-parcel');changeBalance(state,'both',-1);off.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null);eq(off.load().balanceStall,state.balanceStall,'save-off in-memory retained');
}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('workshopPage(state,slug)'));ok(!app.includes("from './balance-stall"),'no held app edit required');ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('balance-stall.css'));ok(workshopPage(s).includes('href="#workshop/balance"'),'Workshop entry visible');
console.log(`Balance Stall integration: ${n} assertions passed.`);
