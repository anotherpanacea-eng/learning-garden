import assert from 'node:assert/strict';
import {livingHubRooms} from '../dist/living-spiral-ui.mjs';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {foodView,startFood,setFoodPage,setFoodView,chooseFoodNeighbor,chooseFoodMeaning,addFoodSupport,checkFood,foodCheckMatches} from '../dist/food-links-core.mjs';
import {foodLinksPage,foodLinksNotes} from '../dist/food-links-ui.mjs';
import {foodLinkDiagram} from '../dist/food-links-art.mjs';
import {adaptivePage,adaptiveNotes} from '../dist/living-adaptive-ui.mjs';
import {startAdaptiveSpiral,inspectAdaptive,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {startBody,chooseBodyLegs,chooseBodyFeature,checkBody} from '../dist/body-clues-core.mjs';
import {startLife} from '../dist/life-stages-core.mjs';
import {startBalance,changeBalance,checkBalance} from '../dist/balance-stall-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());startAdaptiveSpiral(s);inspectAdaptive(s,0);startBody(s,'snail');chooseBodyLegs(s,'0');chooseBodyFeature(s,'shell');checkBody(s);startBalance(s,'leaf-parcel');changeBalance(s,'both',-1);checkBalance(s);startLife(s,'adult-next');s.exposures=['3x4'];const old=copy(s),suggestions=['science','reading','math'].map(k=>adaptiveSuggestion(s,k));
const r=startFood(s,'aphid-eater');chooseFoodNeighbor(s,'ladybird-larva');chooseFoodMeaning(s,'development');checkFood(s);chooseFoodMeaning(s,'energy');addFoodSupport(s,'together');checkFood(s);const rest=copy(s);delete rest.foodLinks;eq(rest,old,'unrelated habitat/body/parcel/stock/math/balance state preserved');eq(['science','reading','math'].map(k=>adaptiveSuggestion(s,k)),suggestions,'new science selections not habitat depth evidence');
for(const page of ['inspect','connect','meaning','kept'])for(const view of ['bean','aphid','ladybird-larva']){setFoodPage(s,page);setFoodView(s,view);const before=copy(s);ok(adaptivePage(s,'food').includes('food-page'),'actual siblingroute reaches newstagepack');foodLinksPage(s);foodLinksNotes(s);adaptiveNotes(s);destinationNotes(s);eq(s,before,'all12page/view renders andnotes pure');}
const raw=JSON.stringify(s),frozen=copy(s.foodLinks);eq(restoreStateResult(raw).state.foodLinks,frozen);const prepared=prepareProgressImport(raw);ok(prepared.ok);eq(prepared.state.foodLinks,frozen,'generic actual import exact');store.save(s);const first=store.active.id,other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startFood(other,'bean-eater');chooseFoodNeighbor(other,'ladybird-larva');store.save(other);eq(store.select(first,other).foodLinks,frozen,'explorer roots isolated');eq(initializeExplorerState(new ExplorerStore(disk).load()).foodLinks,frozen,'actual disk reload');
{
 const state={};const before=copy(state);foodLinksPage(state);foodLinksNotes(state);eq(state,before,'opening alone does not allocate');startFood(state,'aphid-food');ok(adaptiveNotes(state).includes('Food Links'),'newnotes withoutoldhabitat');
}
for(const payload of [null,'<script>not executable</script>',{version:77,raw:'<img src=x onerror="bad()">'}]){const state=initializeExplorerState(freshState());state.foodLinks=copy(payload);const before=copy(state);const html=foodLinksPage(state)+foodLinksNotes(state);eq(state,before);ok(!html.includes('<script>not')&&!html.includes('<img src=x'),'unavailable originals escaped');ok(prepareProgressImport(JSON.stringify(state)).ok,'optional unknown root transferable');}
{
 const state=initializeExplorerState(freshState()),visit=startFood(state,'aphid-food');visit.source.cards[1].drawing={version:25,kind:'future-bean'};visit.source.cards[1].pictureText='A retained future-picture description <still text>.';const before=copy(state);const html=foodLinksPage(state);ok(html.includes('food-picture-unavailable'),'future picture gracefully unavailable');ok(html.includes('A retained future-picture description &lt;still text&gt;.'),'own accessible text preserved');eq(foodView(state).current.id,visit.id,'otherwise understood visit remains playable');chooseFoodNeighbor(state,'bean');chooseFoodMeaning(state,'energy');eq(checkFood(state).neighborMatch,true);eq(visit.source.cards[1],before.foodLinks.rounds[0].source.cards[1]);ok(prepareProgressImport(JSON.stringify(state)).ok);
 visit.source.cards[1].drawing={version:1,kind:'unrecognised-original'};ok(foodLinkDiagram(visit.source.cards[1]).includes('food-picture-unavailable'),'unknownkind neverdispatchescurrentwrongpicture');visit.source.cards[1].drawing={version:1,kind:'bean'};ok(foodLinkDiagram(visit.source.cards[1]).includes('food-picture-unavailable'),'known kind mismatching stage falls back rather than relabelling another picture');eq(foodView(state).current.id,visit.id,'mismatched picture does not discard understood text/answers');
}
{
 const state=initializeExplorerState(freshState()),visit=startFood(state,'aphid-food');chooseFoodNeighbor(state,'bean');chooseFoodMeaning(state,'development');const c=checkFood(state);c.neighborMatch=false;c.meaningMatch=true;c.feedback='Earlier contradictory chart result';visit.source.expected={neighbor:'ladybird-larva',meaning:'energy'};visit.source.cards[1].text='Earlier chart wording retained with current visit';const old=copy(c.source),before=copy(state);const html=foodLinksNotes(state)+foodLinksPage(state);ok(html.includes('Earlier contradictory chart result'));eq(c.source,old,'check ownsoriginalsource');eq(state,before,'notes/currentrenderneverregrade');ok(!foodCheckMatches(visit));eq(prepareProgressImport(JSON.stringify(state)).state.foodLinks,state.foodLinks);
}
{
 const state=initializeExplorerState(freshState()),visit=startFood(state,'aphid-food');state.foodLinks.rounds.push({id:2,raw:'<b>old stage</b>'});state.foodLinks.current=2;const raw=copy(state.foodLinks.rounds[1]);eq(foodView(state).current.id,visit.id);chooseFoodNeighbor(state,'bean');eq(foodView(state).earlier,[raw]);ok(foodLinksPage(state).includes('&lt;b&gt;'));const dup=copy(visit);state.foodLinks.rounds.push(dup);eq(foodView(state).earlier,[raw,dup]);ok(prepareProgressImport(JSON.stringify(state)).ok);
}
{
 const state=initializeExplorerState(freshState());const original=startFood(state,'aphid-food');state.foodLinks.rounds=Array.from({length:15},(_,i)=>({...copy(original),id:i+1}));state.foodLinks.current=15;state.foodLinks.nextId=16;state.foodLinks.rounds.push({id:80,raw:'kept unknown'});const before=copy(state);foodLinksPage(state);eq(state,before,'viewnevertrimsoversizedhistory');startFood(state,'bean-eater');eq(foodView(state).rounds.length,12);eq(foodView(state).rounds[0].id,5);eq(state.foodLinks.current,81);eq(foodView(state).earlier,[{id:80,raw:'kept unknown'}]);
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),state=initializeExplorerState(off.load());startFood(state,'aphid-eater');chooseFoodNeighbor(state,'ladybird-larva');off.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null);eq(off.load().foodLinks,state.foodLinks);
}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('spiralPage(state,slug)'),'existing root delegatesactualslug');ok(!app.includes("from './food-links"),'noheldappeditneeded');ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('food-links.css'));ok(livingHubRooms().join('').includes('href="#living/food"'),'Gardenentrypresent');
console.log(`Food links integration: ${n} assertions passed.`);
