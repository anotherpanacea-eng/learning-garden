import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {coinView,startCoinRound,setCoinPage,adjustCoin,selectCoinMat,checkCoinPayments} from '../dist/coin-counter-core.mjs';
import {coinCounterPage,coinCounterNotes} from '../dist/coin-counter-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {renderCafe} from '../dist/cafe-ui.mjs';
import {startFair,revealFair} from '../dist/fair-test-core.mjs';
import {startWorkshop,releaseWorkshop,stepWorkshop} from '../dist/workshop-core.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
let checks=0;
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;};
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());
nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional market puppet rehearses.');startWorkshop(s);releaseWorkshop(s);stepWorkshop(s);startFair(s);revealFair(s,'A');
const old=structuredClone(s);startCoinRound(s,'paper-star');adjustCoin(s,'nickel',1);adjustCoin(s,'nickel',1);selectCoinMat(s,'B');adjustCoin(s,'dime',1);checkCoinPayments(s);
const rest=structuredClone(s);delete rest.coinCounter;eq(rest,old,'old Café/Post/Loft/Workshop/Fair Test and other data untouched');
for(const page of ['coins','make','compare']){setCoinPage(s,page);const before=structuredClone(s);const html=workshopPage(s,'coins');ok(html.includes('The Coin Counter'),'actual Workshop slug reaches counter');ok(html.includes('data-coin-page="'+page+'"'),'each page remains open');workshopNotes(s);coinCounterNotes(s);eq(s,before,'render/notes do not change saved data');}
ok(renderCafe(s).includes('href="#workshop/coins"'),'Café invitation links into correct root branch');
const raw=JSON.stringify(s),frozen=structuredClone(s.coinCounter);eq(restoreStateResult(raw).state.coinCounter,frozen,'generic restore preserves optional root');
const imported=prepareProgressImport(raw);ok(imported.ok,'full notes import accepts new root');eq(imported.state.coinCounter,frozen,'frozen currency checks retained in import');
store.save(s);const first=store.active.id;const other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);ok(other,'another synthetic explorer created');startCoinRound(other,'paper-boat');store.save(other);const original=store.select(first,other);eq(original.coinCounter,frozen,'explorer switching restores its own exact counter');
const reload=initializeExplorerState(new ExplorerStore(disk).load());eq(reload.coinCounter,frozen,'actual disk reload retains exact mats/checks');
{
 const fresh={};const before=structuredClone(fresh);coinCounterPage(fresh);coinCounterNotes(fresh);eq(fresh,before,'missing root view stays missing');startCoinRound(fresh);ok(workshopNotes(fresh).includes('Coin Counter'),'new notes show without old Workshop data');
}
for(const payload of [null,'<script>not executable</script>',{version:88,raw:'<img src=x onerror="bad()">'}]){
 const sample=initializeExplorerState(freshState());sample.coinCounter=structuredClone(payload);const before=structuredClone(sample.coinCounter);const html=coinCounterPage(sample)+coinCounterNotes(sample);eq(sample.coinCounter,before,'future/invalid envelope untouched by render');ok(!html.includes('<img src=x')&&!html.includes('<script>not'),'raw payload escaped');ok(prepareProgressImport(JSON.stringify(sample)).ok,'opaque unsupported optional root does not close import');
}
{
 const sample=initializeExplorerState(freshState());const r=startCoinRound(sample);sample.coinCounter.rounds.push({id:2,raw:'<b>earlier malformed round</b>'});sample.coinCounter.current=2;const before=structuredClone(sample.coinCounter.rounds[1]);setCoinPage(sample,'make');adjustCoin(sample,'penny',1);eq(coinView(sample).current.id,r.id,'bad current still leaves readable sibling playable');eq(coinView(sample).earlier,[before],'bad sibling stays exact');ok(coinCounterPage(sample).includes('&lt;b&gt;'),'bad sibling shown escaped');ok(prepareProgressImport(JSON.stringify(sample)).ok,'one bad round does not block transfer');
}
{
 const sample=initializeExplorerState(freshState()),r=startCoinRound(sample);checkCoinPayments(sample);r.price=24;r.checks[0].a.value=49;r.checks[0].a.count=17;r.checks[0].aRelation='above';r.checks[0].earlierWords='An earlier check sentence';const before=structuredClone(sample.coinCounter);const html=coinCounterNotes(sample);ok(html.includes('17 coins, 49 cents'),'notes show recorded outcome without current regrade');eq(sample.coinCounter,before,'notes keep historical result exact');eq(prepareProgressImport(JSON.stringify(sample)).state.coinCounter,before,'historical price/outcomes transfer unchanged');
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),state=initializeExplorerState(off.load());startCoinRound(state);adjustCoin(state,'dime',1);off.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null,'save-off writes no explorer record');eq(off.load().coinCounter,state.coinCounter,'save-off session keeps counter in memory');
}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes("workshopPage(state,slug)"),'root delegates actual Workshop slug');ok(!app.includes("from './coin-counter"),'no new app routing edit needed');
ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('coin-counter.css'),'new stylesheet linked');
console.log(`Coin Counter integration: ${checks} assertions passed.`);
