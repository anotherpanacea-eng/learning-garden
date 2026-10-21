import assert from 'node:assert/strict';
import {freshState,STORAGE_KEY} from '../dist/core.mjs';
import {prepareProgressImport,initializeExplorerState,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {ExplorerStore,REGISTRY_KEY} from '../dist/explorer-storage.mjs';
import {startVisit} from '../dist/garden-core.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {setBrambleMode,setBrambleTable,startAdaptiveRival,openRivalPractice} from '../dist/post-rival.mjs';
import {startAdaptiveSpiral,supportAdaptive} from '../dist/living-adaptive-core.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {chooseBase,choosePart,tryWord} from '../dist/word-garden-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {progressTransferPanel} from '../dist/progress-transfer-ui.mjs';
import {storyHub} from '../dist/garden-ui.mjs';
let checks=0;const check=(x,m)=>{assert.ok(x,m);checks++;},equal=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
class Storage{
 constructor(){this.data=new Map();this.fail=()=>false;this.writes=[];}
 get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}
 getItem(k){if(this.fail('get',k))throw Error('Synthetic read failure');return this.data.get(k)??null;}
 setItem(k,v){if(this.fail('set',k))throw Error('Synthetic quota failure');this.data.set(k,v);this.writes.push(k);}
 removeItem(k){if(this.fail('remove',k))throw Error('Synthetic removal failure');this.data.delete(k);}
}
const make=disk=>{const m=new ExplorerStore(disk,{now:()=>new Date('2026-01-02T03:04:05Z')});m.load();return m;};
const key=id=>`${STORAGE_KEY}:${id}`;
const original=freshState();
original.practice=[{questionId:'synthetic-fact',skill:'facts',attempts:[14,12],fact:[3,4],status:'answered',correct:true,firstCorrect:false,supported:true,independent:false,hinted:true,method:'together'}];
initializeExplorerState(original);nextGuest(original);adjustBite(original,ingredients[0].id,1);
startVisit(original,'paris',{destination:'bookstall',variant:1});startVisit(original,'french',{destination:'bookstall',variant:1});
startPostOffice(original,deliveries[0].id);setBrambleMode(original,'multiply');setBrambleTable(original,12);startAdaptiveRival(original);openRivalPractice(original);
startAdaptiveSpiral(original);supportAdaptive(original,'science','help');
chooseBase(original,'help');choosePart(original,'ful');tryWord(original);
original.futureNotebook={version:7,payload:['untouched',false]};
const report={title:'Synthetic old-compatible notes',exportedAt:'2026-01-01',explorer:{avatar:original.garden.avatar,color:'gold',symbol:'leaf'},recommendation:{route:'visual'},...original};
const raw=JSON.stringify(report,null,2),prepared=prepareProgressImport(raw);
check(prepared.ok,'historical report accepted');equal(prepared.summary.tasks,1,'count preview');check(!('title'in prepared.state)&&!('explorer'in prepared.state),'report metadata is not live state');
const normal=initializeExplorerState(structuredClone(original));equal(prepared.state,normal,'same complete state as ordinary restore, all destinations and support retained');
check(prepareProgressImport(JSON.stringify(original)).ok,'raw state accepted');check(prepareProgressImport('\uFEFF'+JSON.stringify(original)).ok,'BOM accepted');
check(prepared.state.garden.visits.some(v=>v.entrance==='french'),'French visit fixture retained');check(prepared.state.garden.visits.some(v=>v.entrance==='paris'),'English visit fixture retained');
for(const bad of ['bad','[]','{}',JSON.stringify({...freshState(),version:2}),JSON.stringify({...freshState(),practice:[{}]}),JSON.stringify({...freshState(),baseline:{index:8,observations:[],complete:false}}),JSON.stringify({...freshState(),sessions:1e100}),JSON.stringify({...freshState(),broad:[]}),JSON.stringify({...freshState(),words:null}),' '.repeat(MAX_IMPORT_BYTES+1),JSON.stringify(freshState()).replace('"sessions":0','"sessions":1e400'),'{"__proto__":{},"version":1}'])check(!prepareProgressImport(bad).ok,'reject invalid file');
let deep={};for(let i=0;i<65;i++)deep={child:deep};check(!prepareProgressImport(JSON.stringify({...freshState(),deep})).ok,'reject excessive depth');
check(!prepareProgressImport(JSON.stringify({...freshState(),large:Array(200001).fill(0)})).ok,'reject excessive nodes');
{
 const disk=new Storage(),m=make(disk),before=new Map(disk.data),active=m.active.id,session=structuredClone(m.load());
 prepareProgressImport(raw);equal(disk.data,before,'preview/cancel do not write storage');equal(m.load(),session,'preview does not mutate current explorer');
 const result=m.importState(prepared);check(result.ok&&!result.temporary,'persistent import succeeds');check(m.active.id!==active,'new id');check(m.active.color!=='gold'||m.active.symbol!=='leaf'||m.active.avatar!==m.explorers[0].avatar,'new unique marker');equal(result.state.garden.avatar,m.active.avatar,'profile avatar consistent');equal(disk.data.get(key(active)),before.get(key(active)),'existing explorer file exact');equal(m.memory.get(active),session,'existing session exact');equal(result.state.practice,original.practice,'support/retry distinctions unchanged');equal(result.state.futureNotebook,original.futureNotebook,'unknown data retained');check(m.keptCopies().some(c=>c.raw===raw),'exact original file recoverable');
 check(disk.writes.at(-1)===REGISTRY_KEY,'registry committed last');
 const reload=make(disk);equal(reload.load(),result.state,'reload exact');
 const first=m.active.id;check(m.importState(prepared).ok,'repeat file supported');check(m.active.id!==first&&m.explorers.length===3,'repeat creates distinct explorer, not merged');
}
for(const phase of ['recovery','state','registry']){
 const disk=new Storage(),m=make(disk),before=new Map(disk.data),active=m.active.id;
 disk.fail=(op,k)=>op==='set'&&(phase==='recovery'?k.startsWith('number-garden-kept-'):phase==='state'?k===key('explorer-2'):k===REGISTRY_KEY);
 check(!m.importState(prepared).ok,phase+' failure reported');equal(m.active.id,active,phase+' current explorer untouched');equal(m.explorers.length,1,phase+' no session registration');equal(disk.data,before,phase+' failed writes rolled back');
 disk.fail=()=>false;check(m.importState(prepared).ok,phase+' retry succeeds');
}
{
 const disk=new Storage(),m=make(disk),before=new Map(disk.data);let committed=false,failed=false;
 const baseSet=disk.setItem.bind(disk);disk.setItem=(k,v)=>{baseSet(k,v);if(k===REGISTRY_KEY&&JSON.parse(v).explorers.length===2)committed=true;};
 disk.fail=(op,k)=>{if(op==='get'&&k===REGISTRY_KEY&&committed&&!failed){failed=true;return true;}return false;};
 check(!m.importState(prepared).ok,'post-write verification failure reported');equal(disk.data,before,'verified rollback restores exact old registry, cleans new keys');
}
{
 const disk=new Storage(),m=make(disk);let committed=false;
 const baseSet=disk.setItem.bind(disk);disk.setItem=(k,v)=>{baseSet(k,v);if(k===REGISTRY_KEY&&JSON.parse(v).explorers.length===2)committed=true;};
 disk.fail=(op,k)=>committed&&op==='get'&&k===REGISTRY_KEY;
 const r=m.importState(prepared);check(!r.ok&&r.message.includes('may have been saved'),'uncertain outcome explicit');equal(m.explorers.length,1,'uncertain import not activated');check(disk.data.has(key('explorer-2'))&&[...disk.data.values()].includes(raw),'uncertain commit keeps new state and raw recovery');check(!m.importState(prepared).ok,'further persistent import blocked');const uncertainDisk=new Map(disk.data);check(!m.setPersistence(true,m.load())&&!m.setPersistence(false,m.load()),'uncertain outcome cannot re-enable or remove saved copies');m.clearActive();m.clearAll();equal(disk.data,uncertainDisk,'uncertain reset cannot remove preserved copies');
 disk.fail=()=>false;const reload=make(disk);equal(reload.explorers.length,2,'uncertain committed import is recoverable on reload');equal(reload.load().words,original.words,'no dangling registry pointer');
}
{
 const disk=new Storage(),m=make(disk),other=make(disk);other.add();const snapshot=new Map(disk.data);
 check(!m.importState(prepared).ok,'stale registry detected');equal(disk.data,snapshot,'another tab explorers retained');check(!m.save(m.load()),'ordinary save blocked after detected conflict');check(!m.setPersistence(true,m.load()),'save toggle cannot clear conflict');equal(disk.data,snapshot,'later actions preserve newer registry');
}
{
 const disk=new Storage(),m=make(disk);m.setPersistence(false,m.load());const before=new Map(disk.data);const r=m.importState(prepared);
 check(r.ok&&r.temporary,'save-off import explicit');equal(disk.data,before,'save-off import no writes');check(m.keptCopies().some(c=>c.raw===raw),'memory recovery available');
 check(m.setPersistence(true,r.state),'saving on persists import and recovery');const reload=make(disk);equal(reload.load().words,original.words,'save-on reload');check(reload.keptCopies().some(c=>c.raw===raw),'save-on raw file persisted');
 m.clearActive();check(!m.keptCopies().some(c=>c.raw===raw),'reset removes memory and persistent import recovery');
}
{
 const disk=new Storage(),m=make(disk);m.setPersistence(false,m.load());m.importState(prepared);const copy=m.keptCopies().find(c=>c.raw===raw);check(m.removeCopy(copy.key),'memory recovery removable');check(!m.keptCopies().some(c=>c.raw===raw),'removed memory recovery stays removed');
 m.importState(prepared);m.clearAll();check(!m.keptCopies().some(c=>c.raw===raw),'clear all removes session recovery');
}
{
 const html=progressTransferPanel({candidate:prepared,message:'<synthetic>',reading:false},false);
 check(html.includes('type="file"')&&html.includes('Add as a separate explorer')&&html.includes('session'),'accessible confirm and save-off guidance');check(!html.includes('<synthetic>')&&html.includes('&lt;synthetic&gt;'),'status escaped');
}
{
 const bad={...freshState(),broad:{observations:[{questionId:'synthetic',area:'number',attempts:[1],misconceptions:[null]}]}};
 check(!prepareProgressImport(JSON.stringify(bad)).ok,'reject unreadable optional notes before commit');
 const disk=new Storage(),m=make(disk),before=new Map(disk.data);
 disk.fail=(op,k)=>{if(op==='set'&&k===key('explorer-2')){const next=JSON.parse(disk.data.get(REGISTRY_KEY));next.explorers.push({id:'explorer-2',avatar:'sky',color:'rose',symbol:'acorn',createdAt:'2026-01-02'});disk.data.set(REGISTRY_KEY,JSON.stringify(next));return true;}return false;};
 check(!m.importState(prepared).ok,'intervening registry on failed write rejected');check([...disk.data.values()].includes(raw),'recovery retained when another registry references allocated id');check(!m.save(m.load()),'intervening registry blocks later save');
 equal(disk.data.get(key('explorer-1')),before.get(key('explorer-1')),'existing progress file never changed');
}
for(const label of [{toString:null},{unexpected:'object'}])check(!prepareProgressImport(JSON.stringify({...freshState(),practice:[{questionId:'synthetic',skill:'facts',attempts:[1],status:'answered',label}]})).ok,'invalid original task text rejected before commit');
{
 const hostile=structuredClone(original);hostile.garden.visits[0].id='<img src=x onerror=alert(1)>"';
 const r=prepareProgressImport(JSON.stringify(hostile));check(r.ok,'hostile visit id still imports');check(!storyHub(r.state).includes('<img'),'imported visit id is escaped in the story hub');
}
console.log(`${checks} progress transfer checks passed.`);
