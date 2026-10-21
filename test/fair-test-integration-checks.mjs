import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {fairView,startFair,setFairPage,setFairNote,revealFair,setFairPlan,keepFair} from '../dist/fair-test-core.mjs';
import {fairTestPage,fairTestNotes} from '../dist/fair-test-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {startWorkshop,releaseWorkshop,stepWorkshop} from '../dist/workshop-core.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
let checks=0;
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(a,m)=>{assert.ok(a,m);checks++;};
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());
nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional parcel crew says hello.');startWorkshop(s);releaseWorkshop(s);stepWorkshop(s);
const other=structuredClone(s);startFair(s);setFairPlan(s,'b','high-rough');for(let n=0;n<3;n++){revealFair(s,'A');revealFair(s,'B');}setFairPage(s,'tell');
const note='\n  <img src=x onerror="bad()">\r\n An invented explanation.  ';
setFairNote(s,note);keepFair(s);
const withoutFair=structuredClone(s);delete withoutFair.fairTests;eq(withoutFair,other,'actual old Workshop, Café, Post Office, Loft and other roots untouched');
const raw=JSON.stringify(s),frozen=structuredClone(s.fairTests);
for(const page of ['plan','try','tell']){s.fairTests.page=page;const before=structuredClone(s);const html=workshopPage(s,'fair');ok(html.includes('Fair Test Bench'),'Workshop slug dispatch reaches desk');ok(html.includes('data-fair-page="'+page+'"'),'all pages stay open');fairTestNotes(s);workshopNotes(s);eq(s,before,'render/notes pure');}
s.fairTests.page='tell';eq(restoreStateResult(raw).state.fairTests,frozen,'base restore retains optional root exactly');
const prepared=prepareProgressImport(raw);ok(prepared.ok,'notes JSON import accepts new optional root');eq(prepared.state.fairTests,frozen,'prepared import retains frozen data');eq(prepared.state.fairTests.investigations[0].note,note,'transfer keeps exact original note');
store.save(s);const loaded=initializeExplorerState(new ExplorerStore(disk).load());eq(loaded.fairTests,s.fairTests,'explorer reload retains current desk');
ok(fairTestNotes(s).includes('&lt;img'),'original note HTML escaped in grown-up notes');ok(!fairTestPage(s).includes('<img src=x'),'original note never executable markup');
const bare={};ok(workshopNotes(bare)==='','no root created just to show notes');startFair(bare);ok(workshopNotes(bare).includes('Fair Test Bench'),'new desk notes show without any old Workshop experiments');
for(const payload of [{version:22,raw:'<script>bad()</script>'},null,'<b>earlier</b>']){
 const sample=initializeExplorerState(freshState());sample.fairTests=structuredClone(payload);const before=structuredClone(sample.fairTests);workshopPage(sample,'fair');workshopNotes(sample);eq(sample.fairTests,before,'unsupported envelope preserved by render/notes');ok(prepareProgressImport(JSON.stringify(sample)).ok,'opaque future state does not break import');
}
{
 const sample=initializeExplorerState(freshState());startFair(sample);const good=structuredClone(sample.fairTests.investigations[0]);sample.fairTests.investigations.push({id:3,earlier:'<bad>'});sample.fairTests.current=3;
 const before=structuredClone(sample.fairTests.investigations[1]);setFairNote(sample,'A readable sibling stays open.');eq(fairView(sample).current.id,good.id,'bad current falls back to good sibling');eq(fairView(sample).earlier,[before],'raw bad item kept');ok(workshopPage(sample,'fair').includes('Earlier work'),'partial unreadable record accessible');ok(prepareProgressImport(JSON.stringify(sample)).ok,'one bad item does not lock explorer transfer');
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const offStore=new ExplorerStore(offDisk),state=initializeExplorerState(offStore.load());startFair(state);setFairNote(state,'Session-only invented note.');offStore.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${offStore.active.id}`),null,'saving-off writes no new explorer state');eq(offStore.load().fairTests,state.fairTests,'saving-off keeps current in-memory desk');
}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes("workshopPage(state,slug)")&&app.includes('bindWorkshop(state,'),'existing app integration seam remains');
const index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');ok(index.includes('fair-test.css'),'stylesheet linked');
console.log(`Fair Test integration: ${checks} assertions passed.`);
