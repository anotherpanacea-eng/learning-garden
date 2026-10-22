import assert from 'node:assert/strict';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {startAdaptiveSpiral,inspectAdaptive,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {startBody,chooseBodyLegs,chooseBodyFeature,checkBody} from '../dist/body-clues-core.mjs';
import {mapView,startMap,setMapPage,setMapAuthorOpen,chooseMapAuthor,startAuthoredMapJob,resumeMap,selectMapMark,placeMapMark,checkMapRoutes} from '../dist/cartographer-core.mjs';
import {cartographerPage,cartographerNotes} from '../dist/cartographer-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const square={post:{x:1,y:1},bridge:{x:4,y:1},cafe:{x:4,y:4},garden:{x:1,y:4}};
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());startAdaptiveSpiral(s);inspectAdaptive(s,0);startBody(s,'woodlouse');chooseBodyLegs(s,'14');chooseBodyFeature(s,'plates');checkBody(s);const oldOther=structuredClone(s),suggestions=['science','reading','math'].map(k=>adaptiveSuggestion(s,k));
const free=startMap(s);for(const [id,p]of Object.entries(square)){selectMapMark(s,id);placeMapMark(s,p.x,p.y);}free.a=[...'eeennn'];free.b=[...'nnneee'];checkMapRoutes(s);const original=structuredClone(free);setMapAuthorOpen(s,true);chooseMapAuthor(s,'from','post');chooseMapAuthor(s,'via','bridge');chooseMapAuthor(s,'to','cafe');const authored=structuredClone(free);delete authored.authorDraft;eq(authored,original,'conditions do not overwrite ordinary endpoints/routes/checks');
for(const page of ['map','route','compare']){setMapPage(s,page);const before=structuredClone(s),html=workshopPage(s,'maps');ok(html.includes('Cartographer'),'same actual Workshop route');cartographerPage(s);cartographerNotes(s);workshopNotes(s);destinationNotes(s);eq(s,before,'all pages and actual notes pure');}
ok(cartographerNotes(s).includes('Current request draft'),'parent notes include actual retained draft');ok(cartographerNotes(s).includes('Start at Post Office. Collect a sealed parcel at Bridge, then deliver it to Café.'),'parent notes distinguish generated draft request');
const savedFree=structuredClone(free),job=startAuthoredMapJob(s);eq(s.cartographer.rounds[0],savedFree,'creation retains original author work');const other=structuredClone(s);delete other.cartographer;eq(other,oldOther,'no other game, parcel, stock, math exposure or body record changed');eq(['science','reading','math'].map(k=>adaptiveSuggestion(s,k)),suggestions,'not habitat evidence');
job.a=[...'eeennn'];job.b=[...'nnneee'];checkMapRoutes(s);for(const page of ['map','route','compare']){setMapPage(s,page);const before=structuredClone(s),html=cartographerPage(s);ok(html.includes(`data-map-author-origin="${free.id}"`),'referenced map available on all solving pages');cartographerNotes(s);eq(s,before);}
const raw=JSON.stringify(s),frozen=structuredClone(s.cartographer);eq(restoreStateResult(raw).state.cartographer,frozen);const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.cartographer,frozen,'actual import retains optional drafts, frozen task, origin and outcomes');store.save(s);const first=store.active.id,another=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startMap(another);store.save(another);eq(store.select(first,another).cartographer,frozen,'explorers retain distinct map problems');eq(initializeExplorerState(new ExplorerStore(disk).load()).cartographer,frozen,'disk reload exact');
{
 const sample=initializeExplorerState(freshState()),before=structuredClone(sample);cartographerPage(sample);cartographerNotes(sample);workshopPage(sample,'maps');eq(sample,before,'viewing empty author entrance creates no map/draft');
}
{
 const sample=structuredClone(s),r=sample.cartographer.rounds[0];delete r.authorDraft;const before=structuredClone(r),html=cartographerNotes(sample);ok(!html.includes('Current request draft'),'pure defaults are not a historical author record');eq(r,before);
}
for(const raw of [null,'<script>opaque old draft</script>',{version:99,original:'<img src=x onerror="bad()">'}]){
 const sample=structuredClone(s),r=sample.cartographer.rounds[0];r.authorDraft=structuredClone(raw);resumeMap(sample,r.id);setMapPage(sample,'map');const before=structuredClone(sample.cartographer),html=cartographerPage(sample)+cartographerNotes(sample);ok(html.includes('Kept delivery draft'),'unsupported optional draft retained visibly');ok(!html.includes('<script>opaque')&&!html.includes('<img src=x'),'unreadable child escaped');ok(html.includes('data-map-point='),'base map remains playable');eq(sample.cartographer,before);ok(prepareProgressImport(JSON.stringify(sample)).ok);eq(prepareProgressImport(JSON.stringify(sample)).state.cartographer,before);
}
for(const origin of [null,'<script>old origin</script>',{version:99,mapId:1},{version:1,mapId:999}]){
 const sample=structuredClone(s),r=sample.cartographer.rounds[1];r.job.source.authored=structuredClone(origin);resumeMap(sample,r.id);const before=structuredClone(sample.cartographer),html=cartographerPage(sample)+cartographerNotes(sample);ok(!html.includes('<script>old origin'));ok(!html.includes('data-map-author-origin="999"'),'expired reference does not invent a target');eq(sample.cartographer,before);ok(prepareProgressImport(JSON.stringify(sample)).ok,'optional origin never blocks understood job');
}
{
 const sample=structuredClone(s),r=sample.cartographer.rounds[1],c=r.checks[0];c.job.source.request='Earlier exact authored request.';c.job.source.authored={version:99,old:'source'};c.job.a.fulfilled=false;c.job.b.fulfilled=true;const before=structuredClone(sample.cartographer),html=cartographerPage(sample)+cartographerNotes(sample);ok(html.includes(c.job.source.request),'old check uses own request wording');eq(sample.cartographer,before);eq(prepareProgressImport(JSON.stringify(sample)).state.cartographer,before,'contradictory output/raw origin survive actual import');
}
{
 const sample=structuredClone(s),r=structuredClone(free);sample.cartographer.rounds=Array.from({length:15},(_,i)=>({...structuredClone(r),id:i+1}));sample.cartographer.current=1;sample.cartographer.nextId=16;sample.cartographer.page='map';const before=structuredClone(sample.cartographer),html=cartographerPage(sample);ok(html.includes('oldest 4 readable maps'),'exact oversized cap disclosed');ok(html.includes('also removes the map you are authoring from'),'source eviction warning precedes action');eq(sample.cartographer,before);startAuthoredMapJob(sample);ok(cartographerPage(sample).includes('Referenced map 1 is no longer in the retained list'),'new job keeps its own source after disclosed origin eviction');
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),sample=initializeExplorerState(off.load());const r=startMap(sample);r.places=structuredClone(square);setMapAuthorOpen(sample,true);chooseMapAuthor(sample,'via','bridge');startAuthoredMapJob(sample);off.save(sample);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null);eq(off.load().cartographer,sample.cartographer,'save-off keeps in-memory author/solver work');
}
{
 const sample=structuredClone(s),r=sample.cartographer.rounds[0];r.authorDraft.extra={kept:'exact'};r.extra='kept';resumeMap(sample,r.id);chooseMapAuthor(sample,'via','garden');setMapAuthorOpen(sample,false);eq(r.authorDraft.extra,{kept:'exact'});eq(r.extra,'kept');eq(prepareProgressImport(JSON.stringify(sample)).state.cartographer.rounds[0].authorDraft,r.authorDraft);
}
{
 for(const target of [2,3]){const sample=structuredClone(s),r=sample.cartographer.rounds[1];const another=structuredClone(r);another.id=3;sample.cartographer.rounds.push(another);r.job.source.authored={version:1,mapId:target};resumeMap(sample,2);const before=structuredClone(sample.cartographer),html=cartographerPage(sample);ok(!html.includes(`data-map-author-origin="${target}"`),'self/other-job origin cannot masquerade as editable free map');ok(html.includes('does not point to a different readable free map'),'odd reference has explicit explanation');eq(sample.cartographer,before,'odd metadata remains exact and job playable');}
}
console.log(`Map problem author integration: ${n} assertions passed.`);
