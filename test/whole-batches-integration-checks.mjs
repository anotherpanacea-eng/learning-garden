import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {drawLetter} from '../dist/letter-trail-core.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import * as B from '../dist/whole-batches-core.mjs';
import {BATCH_CASES,BATCH_HELP} from '../dist/whole-batches-content.mjs';
import {wholeBatchesPage,wholeBatchesNotes,wholeBatchesEntry} from '../dist/whole-batches-ui.mjs';
const fresh=()=>initializeExplorerState(freshState());
let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
{
 const s=fresh(),raw=JSON.stringify(s);wholeBatchesPage(s);wholeBatchesNotes(s);destinationNotes(s);eq(JSON.stringify(s),raw,'opening and notes do not initialize an absent extension');ok(!Object.hasOwn(prepareProgressImport(raw).state,'wholeBatches'),'ordinary import leaves absent root absent');
}
for(const c of BATCH_CASES){const s=fresh();B.chooseBatchCase(s,c.id);B.setBatchCopies(s,c.copies);B.fillBatchJug(s);B.setBatchReading(s,'2-');B.setBatchUnit(s,'g');B.setBatchReference(s,'cloud',' 075 ');for(const page of ['plan','measure','message','keep']){B.setBatchPage(s,page);const raw=JSON.stringify(s),html=wholeBatchesPage(s);ok(html.includes(c.title)&&html.includes('100 mL')&&html.includes('150 mL'),'request and complete base remain visible');eq(JSON.stringify(s),raw,'render is pure');const imported=prepareProgressImport(raw);ok(imported.ok,'page imports');eq(imported.state.wholeBatches,s.wholeBatches,'source apparatus raw input and page survive import');}for(const help of BATCH_HELP){B.setBatchHelp(s,help);const raw=JSON.stringify(s);wholeBatchesPage(s);eq(JSON.stringify(s),raw,'every help rendering pure');eq(prepareProgressImport(raw).state.wholeBatches,s.wholeBatches,'support panel and draft import');}B.keepBatch(s);eq(prepareProgressImport(JSON.stringify(s)).state.wholeBatches,s.wholeBatches,'unfinished kept snapshot imports');B.makeBatchTogether(s);B.offerBatch(s);eq(prepareProgressImport(JSON.stringify(s)).state.wholeBatches,s.wholeBatches,'supported offered snapshot imports');}
{
 const s=fresh();nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional gathering story.');drawLetter(s,'post');const before=structuredClone(s);for(const c of BATCH_CASES){B.chooseBatchCase(s,c.id);B.setBatchCopies(s,3);B.fillBatchJug(s);B.checkBatchPlan(s);B.keepBatch(s);B.makeBatchTogether(s);B.offerBatch(s);wholeBatchesPage(s);}const after=structuredClone(s);delete after.wholeBatches;eq(after,before,'actual partial cafe plate delivery theatre letters and all other roots untouched');const restored=prepareProgressImport(JSON.stringify(s)).state;delete restored.wholeBatches;eq(restored,before,'import also retains unrelated work');
}
for(const raw of [null,[],3,{version:99,earlier:'<img src=x onerror="fictional()">'}]){const s=fresh();s.wholeBatches=raw;const serialized=JSON.stringify(s);ok(!B.batchState(s),'unknown format unavailable');wholeBatchesPage(s);ok(!wholeBatchesNotes(s).includes('<img src=x')&&!destinationNotes(s).includes('<img src=x'),'raw notes escaped');eq(JSON.stringify(s),serialized,'recovery view read-only');const imported=prepareProgressImport(serialized);ok(imported.ok,'unsupported root imports without destructive interpretation');eq(imported.state.wholeBatches,raw,'exact unsupported payload preserved');B.recoverBatches(s);eq(s.wholeBatches.recovered,raw,'explicit recovery retains earlier root');}
{
 const s=fresh();B.chooseBatchCase(s,'quiet-picnic');B.setBatchCopies(s,1);B.checkBatchPlan(s);B.setBatchPage(s,'plan');
 const check=s.wholeBatches.cases['quiet-picnic'].checks[0];check.assessment.matches=false;check.assessment.targetGuests=4;
 const saved=structuredClone(s.wholeBatches),html=wholeBatchesPage(s);ok(html.includes('The request is for 4; compare two places'),'recorded feedback renders as saved');eq(s.wholeBatches,saved,'render keeps recorded result unchanged');eq(prepareProgressImport(JSON.stringify(s)).state.wholeBatches,saved,'recorded result survives import');
 const bad=structuredClone(s);bad.wholeBatches.cases['rehearsal-table']={source:{title:null}};bad.wholeBatches.currentCase='rehearsal-table';const raw=structuredClone(bad.wholeBatches);
 ok(wholeBatchesPage(bad).includes('Keep the earlier record and continue'),'recovery wording promises continuation');ok(B.recoverBatches(bad),'recovery is available');eq(bad.wholeBatches.cases['quiet-picnic'],saved.cases['quiet-picnic'],'good case resumes untouched');eq(bad.wholeBatches.recovered,raw,'raw mixed payload stays in notes');B.chooseBatchCase(bad,'quiet-picnic');ok(wholeBatchesPage(bad).includes('The request is for 4; compare two places'),'recovered recorded feedback renders');
}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk);let s=initializeExplorerState(store.load());const id=store.active.id;B.chooseBatchCase(s,'rehearsal-table');B.fillBatchJug(s);B.setBatchReading(s,'2-');store.save(s);eq(new ExplorerStore(disk).load().wholeBatches,s.wholeBatches,'apparatus and raw draft reload');const other=store.add({},s);ok(!other.wholeBatches,'new explorer has separate root');s=store.select(id,other);eq(B.batchView(s).model.jug.amount,50,'original jug resumes');store.setPersistence(false,s);store.save(s);eq(store.load().wholeBatches,s.wholeBatches,'save-off remains playable in session');ok(!new ExplorerStore(disk).load().wholeBatches,'save-off work not persisted');ok(!store.clearActive().wholeBatches,'reset clears this root');
}
{
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),ending=app.match(/function endingFilm\(\)\{[\s\S]*?\n\}/)?.[0];let calls=0;const ctx=vm.createContext({state:fresh(),choosingExplorer:false,location:{hash:'#cafe/batches'},cafeSupper(){calls++;return {complete:true,round:1};}});ok(ending,'host endingFilm function extracted');vm.runInContext(ending,ctx);eq(vm.runInContext('endingFilm()',ctx),null,'gathering cannot trigger cafe supper film');eq(calls,0,'gathering does not inspect supper goal');ok(app.includes('batchDisplayedFactPairs(state)'),'only displayed guest relationships wired to exposure');ok(wholeBatchesEntry().includes('#cafe/batches'),'entry has route');
}
{
 const s=fresh(),text=h=>h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');B.chooseBatchCase(s,'quiet-picnic');B.setBatchCopies(s,1);B.checkBatchPlan(s);ok(text(wholeBatchesPage(s)).includes('The 1 complete copy makes 2 guest places and fits the request.'),'one-copy plan feedback is singular');
 B.setBatchPage(s,'message');ok(text(wholeBatchesPage(s)).includes('2 guest places need 1 complete base copy.'),'one-copy request is singular');
 B.setBatchMessage(s,'destination','quiet-picnic');B.keepBatch(s);B.setBatchPage(s,'keep');const html=wholeBatchesPage(s);ok(text(html).includes('1 complete copy · 2 requested guests.')&&text(html).includes('Message: Quiet picnic ·'),'kept snapshot reads as words');ok(!html.includes('&quot;modelVisible&quot;')&&!html.includes('<pre'),'no raw record on the child keep page');
}
console.log(`Whole-batch UI/storage integration: ${checks} passed.`);
