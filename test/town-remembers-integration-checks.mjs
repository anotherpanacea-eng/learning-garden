import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {chooseBatchCase,keepBatch,checkBatchTray,batchState} from '../dist/whole-batches-core.mjs';
import {chooseSharingCase,keepSharing,checkSharing,sharingState} from '../dist/sharing-counter-core.mjs';
import {chooseRecipe,keepRecipe,checkRecipeTray,recipeState} from '../dist/measuring-recipes-core.mjs';
import {nextTownCard,startTown,chooseTown,checkTown,keepTown,asideTown,supportTown,townHistory,townState} from '../dist/town-remembers-core.mjs';
import {townPage,townInvitation,townNotes,bindTown} from '../dist/town-remembers-ui.mjs';
let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>initializeExplorerState(freshState()),earlier='2026-10-20',today='2026-10-22';
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const s=fresh(),before=JSON.stringify(s);townPage(s);townInvitation(s);townNotes(s);destinationNotes(s);eq(JSON.stringify(s),before,'empty render and notes do not allocate root');ok(!Object.hasOwn(prepareProgressImport(before).state,'townRemembers'),'empty import keeps root absent');
 chooseBatchCase(s,'rehearsal-table');const w=s.wholeBatches.cases['rehearsal-table'];w.model.portions={'cloud-water':100,'star-water':150};checkBatchTray(s);keepBatch(s);const kept=s.wholeBatches.cases['rehearsal-table'].kept;ok(typeof kept.keptDay==='string','new keep dated');ok(!Object.hasOwn(s.wholeBatches.cases['rehearsal-table'].checks[0],'keptDay'),'old-style check unchanged');kept.keptDay=earlier;
 const source=structuredClone(s.wholeBatches),raw=JSON.stringify(s);ok(townInvitation(s).includes('#town/remembers'),'home link offered');ok(townPage(s).includes('Start this errand'),'route starts at explicit Start');eq(JSON.stringify(s),raw,'offer pure');const e=startTown(s,today);ok(e,'starts from kept work');eq(s.wholeBatches,source,'start leaves source game untouched');ok(townPage(s).includes('name="town-choice"')&&townPage(s).includes('data-town-check'),'open page has controls');ok(!townPage(s).includes('town-feedback'),'choice is not a check');
 chooseTown(s,e.expected);ok(!townPage(s).includes('town-feedback'),'select alone no feedback');supportTown(s,'example');ok(townPage(s).includes('town-example-art'),'different pictured example');supportTown(s,'together');supportTown(s,'narration');const ck=checkTown(s);ok(ck.fit,'own fitting choice');ok(townPage(s).includes('town-feedback'),'check feedback visible');ok(keepTown(s),'keep without rewriting source');ok(townPage(s,String(e.id)).includes('Answer kept'),'finished visit readable');ok(townNotes(s).includes('kept on 2026-10-20; returned on 2026-10-22'),'gap in notes');ok(townNotes(s).includes('example, together, narration'),'support in notes');ok(destinationNotes(s).includes('The Town Remembers'),'global notes include errand');eq(s.wholeBatches,source,'errand actions leave source game unchanged');
 const imported=prepareProgressImport(JSON.stringify(s));ok(imported.ok,'finished errand imports');eq(imported.state.townRemembers,s.townRemembers,'import preserves exact errand');eq(imported.state.wholeBatches,s.wholeBatches,'import preserves source game');
}
{
 const s=fresh();chooseSharingCase(s,'repair-halves');s.sharingCounter.cases['repair-halves'].model={cuts:[6],selected:[0]};checkSharing(s);keepSharing(s);const w=s.sharingCounter.cases['repair-halves'];ok(typeof w.kept.keptDay==='string'&&!Object.hasOwn(w.kept.latestCheck,'keptDay'),'share date only top-level kept');delete w.kept.keptDay;ok(sharingState(s),'legacy share valid');
 chooseRecipe(s,'welcome-broth');s.measuringRecipes.cases['welcome-broth'].model.portions['cloud-water']=150;checkRecipeTray(s);keepRecipe(s);const r=s.measuringRecipes.cases['welcome-broth'];ok(typeof r.kept.keptDay==='string'&&!Object.hasOwn(r.kept.latestTray,'keptDay'),'recipe date only top-level kept');delete r.kept.keptDay;ok(recipeState(s),'legacy kitchen valid');
}
{
 const s=fresh();chooseRecipe(s,'welcome-broth');s.measuringRecipes.cases['welcome-broth'].model.portions['cloud-water']=50;keepRecipe(s);s.measuringRecipes.cases['welcome-broth'].kept.keptDay=earlier;
 let e=startTown(s,today);ok(e,'first jug errand');asideTown(s);
 for(let i=1;i<12;i++){
  const id=i<9?'welcome-broth':'lantern-supper';if(i===9)chooseRecipe(s,id);
  s.measuringRecipes.cases[id].model.portions['cloud-water']=50+50*(i%9);keepRecipe(s);s.measuringRecipes.cases[id].kept.keptDay=earlier;
  e=startTown(s,today);ok(e,`history visit ${i+1}`);asideTown(s);
 }
 eq(townHistory(s).readable.length,12,'twelve readable visits');chooseRecipe(s,'bridge-picnic');s.measuringRecipes.cases['bridge-picnic'].model.portions['cloud-water']=100;keepRecipe(s);s.measuringRecipes.cases['bridge-picnic'].kept.keptDay=earlier;
 const before=JSON.stringify(s),card=nextTownCard(s,today);eq(card.willTrim,1,'oldest finished selected for trim');ok(townPage(s).includes('oldest finished errand'),'disclosure before Start');eq(JSON.stringify(s),before,'cap view does not trim');e=startTown(s,today);ok(e,'thirteenth starts');eq(townHistory(s).readable.length,12,'one finished record trimmed');ok(!townHistory(s).readable.some(x=>x.id===1),'oldest removed');ok(townHistory(s).readable.some(x=>x.id===e.id&&x.status==='open'),'new open preserved');
}
{
 const s=fresh();chooseBatchCase(s,'rehearsal-table');s.wholeBatches.cases['rehearsal-table'].model.portions={'cloud-water':100,'star-water':150};keepBatch(s);s.wholeBatches.cases['rehearsal-table'].kept.keptDay=earlier;let e=startTown(s,today);
 const raw={...structuredClone(e),id:e.id+1,form:'future-form',status:'kept',artifact:{...e.artifact,title:'<img src=x onerror="fictional()">'}};s.townRemembers.errands.push(raw);ok(townHistory(s).raw.length===1,'future form isolated');ok(!townNotes(s).includes('<img src=x'),'raw escaped');ok(townNotes(s).includes('&lt;img src=x'),'raw visible in notes');
 const broken={...structuredClone(e),id:e.id+2,status:'kept',artifact:{...e.artifact,values:{cloud:{bad:1},star:150,c:1}}};s.townRemembers.errands.push(broken);eq(townHistory(s).raw.length,2,'bad nested value isolated');eq(prepareProgressImport(JSON.stringify(s)).state.townRemembers,s.townRemembers,'raw siblings survive import');asideTown(s);s.townRemembers.errands.push({...raw,id:e.id+3,status:'open'});eq(nextTownCard(s,today).type,'unavailable','unknown open isolated');ok(townPage(s).includes('Set aside this errand'),'unknown open offers noninterpreting aside');ok(asideTown(s),'unknown open can close');eq(startTown(s,today),false,'used artefact still used after aside');
}
{
 const disk=new Storage(),store=new ExplorerStore(disk);let s=initializeExplorerState(store.load());const id=store.active.id;chooseBatchCase(s,'rehearsal-table');s.wholeBatches.cases['rehearsal-table'].model.portions={'cloud-water':100,'star-water':150};keepBatch(s);s.wholeBatches.cases['rehearsal-table'].kept.keptDay=earlier;startTown(s,today);store.save(s);eq(new ExplorerStore(disk).load().townRemembers,s.townRemembers,'open errand reloads');const other=store.add({},s);ok(!other.townRemembers,'other explorer separate');s=store.select(id,other);ok(nextTownCard(s,today).type==='open','original explorer resumes');store.setPersistence(false,s);store.save(s);ok(!new ExplorerStore(disk).load().townRemembers,'save-off not persisted');ok(store.load().townRemembers,'save-off memory still playable');ok(!store.clearActive().townRemembers,'reset clears this root');
}
{
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),index=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');ok(app.includes('townInvitation(state)')&&app.includes("root==='town'&&slug==='remembers'")&&app.includes('bindTown(state'),'home, route and binder integrated');ok(index.includes('town-remembers.css'),'responsive styles loaded');
}
{
 const s=fresh();s.townRemembers={version:1,rotation:null,used:[],errands:[{form:'future-form',status:'open',source:'raw without an id'}]};
 const aside={handlers:{},addEventListener(type,fn){this.handlers[type]=fn;}},original=globalThis.document;let path=null,saves=0;
 globalThis.document={querySelector:selector=>selector==='[data-town-aside]'?aside:null,querySelectorAll:()=>[]};
 try{bindTown(s,{save:()=>saves++,render:()=>{},navigate:next=>{path=next;},focus:()=>{}});aside.handlers.click();}finally{globalThis.document=original;}
 eq(s.townRemembers.errands[0].status,'aside','raw open without id can be set aside through binder');eq(path,'#town/remembers','raw id uses safe continuation route');eq(saves,1,'aside persisted');
}
{
 const s=fresh();chooseBatchCase(s,'rehearsal-table');s.wholeBatches.cases['rehearsal-table'].model.portions={'cloud-water':100,'star-water':150};keepBatch(s);delete s.wholeBatches.cases['rehearsal-table'].kept.keptDay;
 const raw=Array.from({length:200},(_,i)=>({id:i+1,form:'future-form',status:'kept',source:'retained earlier record'}));s.townRemembers={version:1,rotation:null,used:[],errands:structuredClone(raw)};
 ok(startTown(s,today),'raw siblings do not impose an unrelated readable-history cap');
 ok(townState(s)&&townHistory(s).readable.length===1,'new errand stays readable beside raw siblings');
 eq(townHistory(s).raw,raw,'all raw siblings remain unchanged');
 eq(prepareProgressImport(JSON.stringify(s)).state.townRemembers,s.townRemembers,'mixed readable and raw notebook imports');
}
console.log(`Town Remembers UI/storage integration: ${checks} passed.`);
