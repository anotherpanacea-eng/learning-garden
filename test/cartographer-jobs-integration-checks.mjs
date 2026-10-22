import {marks} from '../dist/cartographer-content.mjs';
import assert from 'node:assert/strict';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {mapView,startMap,startMapJob,setMapJobView,setMapPage,selectMapMark,placeMapMark,checkMapRoutes,mapCheckMatches} from '../dist/cartographer-core.mjs';
import {cartographerPage,cartographerNotes} from '../dist/cartographer-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startFair,setFairNote,revealFair} from '../dist/fair-test-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());startShow(s,'welcome');setSceneDialogue(s,'A fictional puppet carries a sign.');startPostOffice(s,deliveries[0].id);startFair(s);revealFair(s,'B');setFairNote(s,'An earlier fictional ramp note.');const blank=startMap(s);selectMapMark(s,'post');placeMapMark(s,0,0);selectMapMark(s,'cafe');placeMapMark(s,2,2);blank.a=['n','n','e','e'];checkMapRoutes(s);const oldBlank=structuredClone(blank),old=structuredClone(s);
const r=startMapJob(s,'sign');r.a=[...'eeennn'];r.b=[...'nnneee'];checkMapRoutes(s);const rest=structuredClone(s);rest.cartographer=old.cartographer;eq(rest,old,'all other games/exposure data unchanged');eq(s.cartographer.rounds[0],oldBlank,'new job never overwrites authored map');
for(const page of ['map','route','compare'])for(const view of ['map','dispatch','both']){setMapPage(s,page);setMapJobView(s,view);const before=structuredClone(s);const html=workshopPage(s,'maps');ok(html.includes('Cartographer'),'existing route hosts job');cartographerNotes(s);workshopNotes(s);eq(s,before,'all9 page/role views and notes pure');}
ok(cartographerNotes(s).includes('Original fictional job clues kept with this map'),'live notes label identifies map rather than nonexistent check');ok(cartographerPage(s).includes('Collect the market sign'),'saved map list identifies job purpose');
const raw=JSON.stringify(s),frozen=structuredClone(s.cartographer);eq(restoreStateResult(raw).state.cartographer,frozen,'generic restore preserves source/roles/commands/results');const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.cartographer,frozen,'ordinary transfer exact');store.save(s);const first=store.active.id,other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startMapJob(other,'flowers');store.save(other);eq(store.select(first,other).cartographer,frozen,'explorer switch restores own job/drafts');eq(initializeExplorerState(new ExplorerStore(disk).load()).cartographer,frozen,'actual disk reload exact');
{
 const sample=initializeExplorerState(freshState()),before=structuredClone(sample),html=cartographerPage(sample);ok(html.includes('data-map-job-start="sign"'),'catalog open before any sheet');cartographerNotes(sample);eq(sample,before,'viewing job catalog creates no map');
}
{
 const sample=structuredClone(s),round=mapView(sample).current;setMapPage(sample,'map');setMapJobView(sample,'map');let html=cartographerPage(sample);ok(!html.includes('data-map-point='),'supplied map has no movable point controls');ok(!html.includes(round.job.source.request),'Map-reader role can omit dispatch request');setMapJobView(sample,'dispatch');html=cartographerPage(sample);ok(html.includes(round.job.source.request),'dispatch request available freely');ok(!html.includes(round.job.source.mapReaderText),'dispatcher card can omit map-reader text');setMapPage(sample,'route');ok(!cartographerPage(sample).includes('data-map-endpoint='),'job endpoints fixed');
}
{
 const sample=structuredClone(s),round=mapView(sample).current;setMapPage(sample,'compare');const c=round.checks[0];let html=cartographerPage(sample);ok(html.includes('Recorded stop visited')&&html.includes('Recorded request served'),'separate job observations shown');ok(!html.includes('Thank you, map-maker! Both arrived'),'arrival-only praise suppressed for jobs');delete c.job;const before=structuredClone(c);html=cartographerPage(sample)+cartographerNotes(sample);ok(html.includes('did not record the job’s required stop'),'old checks disclose missing job facts');eq(c,before,'render never retrofits old stop outcome');ok(!mapCheckMatches(round));
}
{
 const sample=structuredClone(s),round=mapView(sample).current,c=round.checks[0];c.job.source.request='An earlier exact fictional request.';c.job.a.visited=false;c.job.a.firstVisit=null;c.job.a.fulfilled=false;c.job.b.fulfilled=true;const before=structuredClone(sample.cartographer),html=cartographerNotes(sample);ok(html.includes('An earlier exact fictional request.'),'old check shows own frozen clue wording');ok(html.includes('Recorded request served'),'old contradictory service output remains visible');eq(sample.cartographer,before);eq(prepareProgressImport(JSON.stringify(sample)).state.cartographer,before);
}
for(const job of [null,{version:99,original:'<img src=x onerror="bad()">'},{version:1,source:'<script>earlier job</script>'}]){
 const sample=structuredClone(s),round=sample.cartographer.rounds.at(-1);round.job=structuredClone(job);const before=structuredClone(round),html=cartographerPage(sample)+cartographerNotes(sample);ok(!html.includes('<img src=x')&&!html.includes('<script>earlier'),'raw job escaped');eq(round,before);eq(mapView(sample).current.id,oldBlank.id,'valid authored-map sibling remains playable');ok(prepareProgressImport(JSON.stringify(sample)).ok);startMapJob(sample,'notice');eq(sample.cartographer.rounds[1],before,'new job retains earlier raw sheet');
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),sample=initializeExplorerState(off.load());startMapJob(sample,'notice');setMapJobView(sample,'dispatch');off.save(sample);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null,'save-off writes no learner disk record');eq(off.load().cartographer,sample.cartographer,'save-off keeps in-memory job');
}
{
 const sample=structuredClone(s),round=structuredClone(r);sample.cartographer.rounds=Array.from({length:13},(_,i)=>({...structuredClone(round),id:i+1}));sample.cartographer.current=13;sample.cartographer.nextId=14;const before=structuredClone(sample.cartographer),html=cartographerPage(sample);ok(html.includes('removes the oldest 2 readable maps'),'job start exact oversized-import eviction disclosure');eq(sample.cartographer,before);startMapJob(sample,'flowers');eq(mapView(sample).rounds.map(r=>r.id),Array.from({length:12},(_,i)=>i+3));
}
{
 const sample=structuredClone(s),before=structuredClone(sample.cartographer);marks.push({id:'library',name:'Library',symbol:'L'});
 try{
  eq(mapView(sample).rounds.length,before.rounds.length,'free and supplied job sheets survive catalogue growth');
  for(const page of ['map','route','compare']){setMapPage(sample,page);const saved=structuredClone(sample.cartographer),html=cartographerPage(sample),notes=cartographerNotes(sample);ok(html.includes('Cartographer'));ok(notes.includes('Library')&&notes.includes('unplaced'));ok(!html.includes('undefined')&&!html.includes('NaN'),'job page safely reads missing point');eq(sample.cartographer,saved,'job page/notes retain original clues and outcomes');}
  const imported=prepareProgressImport(JSON.stringify(sample));ok(imported.ok);eq(imported.state.cartographer,sample.cartographer,'actual job import remains exact with new catalogue entry');
 }finally{marks.pop();}
}
console.log(`Cartographer jobs integration: ${n} assertions passed.`);
