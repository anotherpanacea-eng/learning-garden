import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {drawLetter} from '../dist/letter-trail-core.mjs';
import {chooseRecipe,fillRecipeJug} from '../dist/measuring-recipes-core.mjs';
import {ARCHIVE_PAGES,ARCHIVE_QUESTIONS,ARCHIVE_EVENTS,ARCHIVE_SOURCES} from '../dist/travelers-archive-content.mjs';
import {travelersArchive,setArchivePage,setArchiveTask,setArchiveQuestion,setArchiveMap,checkArchiveMap,setArchiveOrder,checkArchiveOrder,answerArchiveQuestion,setArchiveReplyChoice,setArchiveReplyText,checkArchiveReply,keepArchiveReply,recoverTravelersArchive} from '../dist/travelers-archive-core.mjs';
import {travelersArchivePage,travelersArchiveNotes,travelersArchiveEntry} from '../dist/travelers-archive-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};const fresh=()=>initializeExplorerState(freshState());
{
 const s=fresh();nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional archive show.');drawLetter(s,'post');chooseRecipe(s,'welcome-broth');fillRecipeJug(s);const before=structuredClone(s);delete before.travelersArchive;
 for(const page of ARCHIVE_PAGES){setArchivePage(s,page);const raw=JSON.stringify(s);ok(travelersArchivePage(s).includes('Travelers'),'page available');eq(JSON.stringify(s),raw,'render creates no response');const imported=prepareProgressImport(raw);ok(imported.ok,'each page imports');eq(imported.state.travelersArchive,s.travelersArchive,'current page source and raw draft exact');}
 for(const q of ARCHIVE_QUESTIONS){setArchiveQuestion(s,q.id);answerArchiveQuestion(s,q.id,q.choices[0].id);}
 setArchiveOrder(s,ARCHIVE_EVENTS.map(e=>e.id).reverse());checkArchiveOrder(s);setArchiveMap(s,'photo','austerlitz');checkArchiveMap(s,'photo');setArchiveReplyChoice(s,'claim','return-later');setArchiveReplyText(s,'\n\r\nA fictional café reply 🌱\r\n');checkArchiveReply(s);keepArchiveReply(s);const after=structuredClone(s);delete after.travelersArchive;eq(after,before,'café stock/plate, parcel, recipes, letters and authored story remain exact');eq(prepareProgressImport(JSON.stringify(s)).state.travelersArchive,s.travelersArchive,'all exact source/check/Unicode/kept records transfer');
}
for(const text of ['\n\r\nA fictional note.\r\n','<script>fictional()</script>\nCafé 🌱','  Words  with spaces\n\n']){const s=fresh();setArchivePage(s,'reply');setArchiveReplyText(s,text);keepArchiveReply(s);const raw=JSON.stringify(s);ok(!travelersArchivePage(s).includes('<script>fictional()'),'typed text escapes safely');eq(prepareProgressImport(raw).state.travelersArchive.reply.text,text,'exact spaces/newlines/codepoints preserved on transfer');eq(prepareProgressImport(raw).state.travelersArchive.kept.reply.text,text,'exact frozen writing preserved');eq(JSON.stringify(s),raw,'render keeps raw original');}
for(const payload of [null,[],3,{version:99,earlier:'<img src=x onerror="fictional()">'}]){const s=fresh();s.travelersArchive=payload;const raw=JSON.stringify(s);ok(!travelersArchive(s),'unknown unavailable');ok(!travelersArchiveNotes(s).includes('<img src=x')&&!destinationNotes(s).includes('<img src=x'),'unknown notes escaped');travelersArchivePage(s);eq(JSON.stringify(s),raw,'unavailable read-only');const imported=prepareProgressImport(raw);ok(imported.ok,'future root imports');eq(imported.state.travelersArchive,payload,'full raw record preserved');recoverTravelersArchive(s);eq(s.travelersArchive.recovered,payload,'explicit recovery retains original');ok(s.travelersArchive.familiar&&s.travelersArchive.exposureUnknown,'recovery never creates untouched assessment');}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk);let s=initializeExplorerState(store.load());const id=store.active.id;setArchivePage(s,'reply');setArchiveReplyText(s,'\nA fictional pending letter 🌱\n');store.save(s);eq(new ExplorerStore(disk).load().travelersArchive,s.travelersArchive,'raw writing/current turn reload');const other=store.add({},s);ok(!other.travelersArchive,'new explorer separate');s=store.select(id,other);eq(s.travelersArchive.reply.text,'\nA fictional pending letter 🌱\n','same explorer resumes exact words');store.setPersistence(false,s);store.save(s);eq(store.load().travelersArchive,s.travelersArchive,'save-off remains playable in session');ok(!new ExplorerStore(disk).load().travelersArchive,'save-off not persisted');ok(!store.clearActive().travelersArchive,'reset clears only active archive');
}
const photo=ARCHIVE_SOURCES.find(s=>s.id==='photo');ok(photo.image.license==='CC0 1.0'&&photo.image.filename==='lpdp_30184-10.jpg','exact hero visual and rights metadata named');ok(fs.existsSync(new URL('../dist/assets/archive-paris-1910-ph8646.jpg',import.meta.url)),'local source image included');ok(travelersArchiveEntry().includes('#archive'),'entry reaches archive');
console.log(`Travelers Archive UI/storage integration: ${checks} passed.`);
