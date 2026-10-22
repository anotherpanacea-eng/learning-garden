import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {mapView,startMap,selectMapMark,placeMapMark,appendMapMove,selectMapRoute,checkMapRoutes,setMapPage} from '../dist/cartographer-core.mjs';
import {cartographerPage,cartographerNotes} from '../dist/cartographer-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {postOfficePage} from '../dist/post-office-ui.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startCoinRound,adjustCoin,checkCoinPayments} from '../dist/coin-counter-core.mjs';
import {startFair,revealFair} from '../dist/fair-test-core.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(a,m)=>{assert.ok(a,m);checks++;};
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());
startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional market visitor needs a map.');startCoinRound(s,'paper-star');adjustCoin(s,'dime',1);checkCoinPayments(s);startFair(s);revealFair(s,'A');const old=structuredClone(s);
const r=startMap(s);placeMapMark(s,0,0);selectMapMark(s,'cafe');placeMapMark(s,2,1);for(const d of ['e','e','n'])appendMapMove(s,d);selectMapRoute(s,'B');for(const d of ['n','e','e'])appendMapMove(s,d);checkMapRoutes(s);
const rest=structuredClone(s);delete rest.cartographer;eq(rest,old,'Post/Loft/Coin/Fair Test and all old roots unchanged');
for(const page of ['map','route','compare']){setMapPage(s,page);const before=structuredClone(s);const html=workshopPage(s,'maps');ok(html.includes('Cartographer'),'actual Workshop slug reaches table');ok(html.includes(`data-map-page="${page}"`),'all pages open');workshopNotes(s);cartographerNotes(s);eq(s,before,'page/notes render stays pure');}
ok(postOfficePage(s,'choose').includes('href="#workshop/maps"'),'Post Office has open invitation');
const raw=JSON.stringify(s),frozen=structuredClone(s.cartographer);eq(restoreStateResult(raw).state.cartographer,frozen,'generic restore retains exact optional root');const imported=prepareProgressImport(raw);ok(imported.ok,'ordinary progress import accepts map');eq(imported.state.cartographer,frozen,'import preserves geometry and checked outcomes');store.save(s);const id=store.active.id,other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startMap(other);placeMapMark(other,5,5);store.save(other);eq(store.select(id,other).cartographer,frozen,'switch explorer restores own exact map');eq(initializeExplorerState(new ExplorerStore(disk).load()).cartographer,frozen,'actual disk reload retains map');
{
 const sample=initializeExplorerState(freshState());const before=structuredClone(sample);cartographerPage(sample);cartographerNotes(sample);eq(sample,before,'missing root not created by render');
}
for(const bad of [null,'<script>unreadable</script>',{version:99,payload:'<img src=x onerror="bad()">'}]){
 const sample=initializeExplorerState(freshState());sample.cartographer=structuredClone(bad);const before=structuredClone(sample.cartographer),html=cartographerPage(sample)+cartographerNotes(sample);eq(sample.cartographer,before,'unsupported root exact');ok(!html.includes('<script>unreadable')&&!html.includes('<img src=x'),'unsupported content escaped');ok(prepareProgressImport(JSON.stringify(sample)).ok,'unsupported optional root passes through ordinary import');
}
{
 const sample=structuredClone(s);sample.cartographer.rounds.push({id:500,original:'<b>kept raw map</b>'});sample.cartographer.current=500;const raw=structuredClone(sample.cartographer.rounds.at(-1));setMapPage(sample,'route');ok(mapView(sample).current.id!==500,'good sibling remains playable');eq(sample.cartographer.rounds.at(-1),raw);ok(cartographerNotes(sample).includes('&lt;b&gt;'),'raw sibling escaped in notes');
}
{
 const sample=structuredClone(s),round=mapView(sample).current,c=round.checks[0];c.a.distance=9;c.a.steps=11;c.a.arrived=false;c.relation='longer';c.bothArrived=true;c.oldWords='Historical wording stays';const before=structuredClone(sample.cartographer);const html=cartographerNotes(sample);ok(html.includes('9'),'recorded distance remains in notes');eq(sample.cartographer,before,'notes do not regrade contradictory earlier outputs');eq(prepareProgressImport(JSON.stringify(sample)).state.cartographer,before,'exact historical output transferred');
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),sample=initializeExplorerState(off.load());startMap(sample);placeMapMark(sample,1,3);off.save(sample);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null,'save-off writes no explorer data');eq(off.load().cartographer,sample.cartographer,'save-off memory retains map');
}
{
 const sample=initializeExplorerState(freshState()),r=startMap(sample);placeMapMark(sample,0,0);selectMapMark(sample,'cafe');placeMapMark(sample,3,0);
 for(const side of ['A','B']){selectMapRoute(sample,side);for(const d of ['e','e','e'])appendMapMove(sample,d);}checkMapRoutes(sample);
 selectMapMark(sample,'cafe');placeMapMark(sample,5,0);selectMapMark(sample,'post');placeMapMark(sample,3,0);setMapPage(sample,'compare');const html=cartographerPage(sample);
 ok(html.includes('Earlier recorded check'),'old feedback labelled earlier after both endpoint edits');ok(html.includes('Post Office (0, 0)')&&html.includes('Café (3, 0)'),'old feedback shows frozen original endpoints');
 checkMapRoutes(sample);const next=cartographerPage(sample);ok(next.includes('Recorded arrival: no'),'blocked-prefix check records no arrival despite its final point');ok(next.includes('The route is not complete'),'live blocked prefix explicitly incomplete');
}
{
 const sample=structuredClone(s),round=structuredClone(sample.cartographer.rounds[0]);sample.cartographer.rounds=Array.from({length:13},(_,i)=>({...structuredClone(round),id:i+1}));sample.cartographer.nextId=14;sample.cartographer.current=13;
 const before=structuredClone(sample.cartographer);ok(cartographerPage(sample).includes('removes 2 oldest readable maps'),'oversized imported history discloses exact two-map eviction before new-sheet action');eq(sample.cartographer,before,'view does not trim oversized imported history');startMap(sample);eq(mapView(sample).rounds.map(r=>r.id),Array.from({length:12},(_,i)=>i+3),'explicit new-sheet action removes exactly the disclosed oldest maps');
}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('workshopPage(state,slug)'),'existing root adapter forwards Workshop slug');ok(!app.includes("from './cartographer"),'no held app-path workaround');ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('cartographer.css'),'stylesheet linked');
console.log(`Cartographer integration: ${checks} assertions passed.`);
