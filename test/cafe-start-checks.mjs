import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ensureCafe,nextGuest,setCafeRange,skipGuest,orderFor,adjustBite,checkPlate,submitCafeNumber} from '../dist/cafe-core.mjs';
import {effectiveCafeRange,applyCafeStart,followsCafeStart} from '../dist/cafe-start-core.mjs';
import {cafeStartPanel} from '../dist/cafe-start-ui.mjs';
import {renderCafe} from '../dist/cafe-ui.mjs';
import {startAdaptiveSpiral,inspectAdaptive,supportAdaptive,findAdaptive,leaveAdaptive} from '../dist/living-adaptive-core.mjs';
import {startConnection,learningSource} from '../dist/learning-connections.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(x,m)=>{assert.ok(x,m);count++;};
const seed=()=>initializeExplorerState(freshState());
for(const range of ['small','all']){
 const s=seed();s.cafe.range=range;const before=structuredClone(s);
 eq(effectiveCafeRange(s),range);cafeStartPanel(s);renderCafe(s);eq(s,before,'legacy render preserves whole state');
}
for(const bad of [null,[],42,'sprout']){
 const s=seed();s.garden.start=bad;s.garden.cafeStart='follow';const b=structuredClone(s);eq(effectiveCafeRange(s),'all');ok(!applyCafeStart(s,'sprout'));eq(s,b,'invalid container preserved');
}
for(const band of [undefined,null,[],{},'unknown',false]){
 const s=seed();s.garden.start={math:band,privateFuture:'synthetic'};s.garden.cafeStart='follow';s.cafe.range='small';const b=structuredClone(s);eq(effectiveCafeRange(s),'small');cafeStartPanel(s);eq(s,b);
}
for(const band of ['sprout','seedling','sapling']){
 const s=seed();s.garden.start={future:'kept'};const cafe=structuredClone(s.cafe);ok(applyCafeStart(s,band));eq(s.cafe,cafe,'apply touches no cafe work');eq(s.garden.start.future,'kept');eq(effectiveCafeRange(s),band==='sprout'?'small':'all');
 ok(nextGuest(s));const o=orderFor(s.cafe);if(band==='sprout')ok(o.guests>=2&&o.guests<=4&&o.bites>=2&&o.bites<=3);
 eq(restoreState(JSON.stringify(s)).garden,s.garden,'preferences survive restore');
 for(const stage of ['plate','total','stock','repair']){const t=structuredClone(s);if(stage==='repair')checkPlate(t);else if(stage!=='plate'){const o=orderFor(t.cafe),item=ingredients.find(i=>o.wanted.every(p=>i.properties.includes(p)));for(let j=0;j<o.bites;j++)adjustBite(t,item.id,1);ok(checkPlate(t));if(stage==='stock')ok(submitCafeNumber(t,o.total));}const old=structuredClone(t.cafe);ok(applyCafeStart(t,band==='sprout'?'sapling':'sprout'));eq(t.cafe,old);ok(!nextGuest(t));eq(t.cafe,old,'refused next guest atomic');}
 setCafeRange(s,'all');eq(effectiveCafeRange(s),'all');ok(!followsCafeStart(s));ok(applyCafeStart(s,'sprout'));eq(effectiveCafeRange(s),'small');
 const html=renderCafe(s);ok(html.includes('data-cafe-range="small" aria-pressed="true"'));ok(!html.includes('Sprout'),'no band on child page');setCafeRange(s,'small');eq(s.garden.cafeStart,'local','selected button still overrides');
}
{
 const s=seed();ok(applyCafeStart(s,'seedling'));const pairs=new Set();
 ok(nextGuest(s));for(let i=0;i<144;i++){const o=orderFor(s.cafe);pairs.add(`${o.guests}x${o.bites}`);if(i===70){const cursor=s.cafe.allIndex;applyCafeStart(s,'sprout');ok(skipGuest(s));eq(s.cafe.allIndex,cursor);applyCafeStart(s,'sapling');eq(s.cafe.allIndex,cursor);}ok(skipGuest(s));}
 eq(pairs.size,144,'full rotation survives small-pool interlude');
}
{
 const s=seed();ok(startAdaptiveSpiral(s));inspectAdaptive(s,0);inspectAdaptive(s,1);inspectAdaptive(s,2);supportAdaptive(s,'science','help');supportAdaptive(s,'reading','help');ok(findAdaptive(s));supportAdaptive(s,'math','help');ok(leaveAdaptive(s));const source=learningSource(s,'living');ok(source);const before=structuredClone(s);ok(applyCafeStart(s,'sapling'));const cursor=s.cafe.allIndex;ok(startConnection(s,'cafe','living'));eq([orderFor(s.cafe).guests,orderFor(s.cafe).bites],[source.a,source.b]);eq(s.cafe.allIndex,cursor);eq(s.livingExploration,before.livingExploration);eq(s.exposures,before.exposures);
}
{
 class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
 const disk=new Storage(),store=new ExplorerStore(disk),a=initializeExplorerState(store.load()),aId=store.active.id;applyCafeStart(a,'sprout');ok(store.save(a));const b=initializeExplorerState(store.add({},a));applyCafeStart(b,'sapling');setCafeRange(b,'small');ok(store.save(b));const bId=store.active.id;
 eq(effectiveCafeRange(store.select(aId,b)),'small');eq(store.load().garden.cafeStart,'follow');eq(store.select(bId,a).garden.cafeStart,'local');const reload=new ExplorerStore(disk);eq(reload.load().garden.cafeStart,'local');eq(reload.select(aId).garden.start.math,'sprout');
 const prepared=prepareProgressImport(JSON.stringify(a));ok(prepared.ok);const imported=reload.importState(prepared);ok(imported.ok);eq(imported.state.garden.start.math,'sprout');eq(effectiveCafeRange(imported.state),'small');eq(reload.explorers.length,3,'import is separate explorer');
 const bad=new ExplorerStore({getItem(){throw Error('Synthetic unavailable storage');}}),t=initializeExplorerState(bad.load());applyCafeStart(t,'sprout');ok(!bad.save(t));ok(bad.warning);eq(effectiveCafeRange(t),'small','failed saving still permits local session');
}
console.log(`${count} cafe starting preference, legacy, rotation and frozen-work checks passed.`);
