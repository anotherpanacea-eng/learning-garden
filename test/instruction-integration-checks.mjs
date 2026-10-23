import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice,setPostPackingInput} from '../dist/post-office-core.mjs';
import {startAdaptiveRival,setRivalInput} from '../dist/post-rival.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {drawLetter} from '../dist/letter-trail-core.mjs';
import {chooseMessageCase,setMessageText} from '../dist/message-core.mjs';
import {messagePage} from '../dist/message-ui.mjs';
import {chooseTrailCase,setTrailReading,keepTrail} from '../dist/fraction-trail-core.mjs';
import {chooseBundleCase,setBundleText} from '../dist/bundle-exchange-core.mjs';
import {itemById} from '../dist/broad-core.mjs';
import {instructionCases,instructionPages,instructionHelpTopics} from '../dist/instruction-content.mjs';
import * as I from '../dist/instruction-core.mjs';
import {renderInstructions,instructionNotes,instructionEntry,preserveInstructionBreaks} from '../dist/instruction-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};const fresh=()=>initializeExplorerState(freshState());
{
 const s=fresh(),before=JSON.stringify(s);I.instructionState(s);for(const desk of ['post','loft'])renderInstructions(s,desk);instructionNotes(s);destinationNotes(s);eq(JSON.stringify(s),before,'missing-root readers stay pure');ok(!Object.hasOwn(prepareProgressImport(before).state,'instructionNotes'),'absent root stays absent through import');
}
const raw='  Fold once.\n\n🐇 <img src=x onerror="fictional()"> é e\u0301  ';
for(const c of instructionCases)for(const desk of ['post','loft']){const s=fresh();I.chooseInstructionCase(s,desk,c.id);I.setInstructionText(s,desk,raw);I.setInstructionReport(s,desk,'production','dictated');I.setInstructionReport(s,desk,'reading','together');I.readInstructionWords(s,desk,'Which thing?');I.setInstructionComment(s,desk,'  A fictional reader asks: where?\n');for(const page of instructionPages){I.setInstructionPage(s,desk,page);for(const topic of [null,...instructionHelpTopics]){I.setInstructionHelp(s,desk,topic);const before=JSON.stringify(s),view=renderInstructions(s,desk);eq(view.facts,[],'no unrelated whole-number facts');ok(view.html.includes(c.request),'request stays available');ok(view.html.includes(c.readerKnowledge),'reader knowledge preserved');ok(!view.html.includes('<img src=x'),'original words are escaped');eq(JSON.stringify(s),before,'render records no work or support');const imported=prepareProgressImport(before);ok(imported.ok,'every desk/page/help imports');eq(imported.state.instructionNotes,s.instructionNotes,'source/raw words/comments/reports/help exact');}}I.keepInstructionDraft(s,desk);eq(prepareProgressImport(JSON.stringify(s)).state.instructionNotes,s.instructionNotes,'unfinished kept version transfers');}
{
 const s=fresh();I.chooseInstructionCase(s,'post','pocket-note');I.editInstructionPlan(s,'post','add','fold');I.editInstructionPlan(s,'post','add','insert');I.editInstructionPlan(s,'post','add','seal');eq(I.instructionView(s,'post').case.strip,[],'plan does not silently write sentences');I.copyInstructionPlan(s,'post');I.tryInstructionStrip(s,'post');I.stepInstructionRun(s,'post',1);const run=structuredClone(I.instructionView(s,'post').run);I.setInstructionText(s,'post',raw);I.readInstructionWords(s,'post','Why?');I.setInstructionComment(s,'post','  Keep the outside spaces.  ');I.keepInstructionDraft(s,'post');const kept=structuredClone(I.instructionView(s,'post').case.kept[0]);I.setInstructionText(s,'loft','A revised fictional message.');eq(I.instructionView(s,'post').case.text,'A revised fictional message.','two desks share selected case text');eq(I.instructionView(s,'post').humanReadCurrent,false,'human comment belongs to earlier exact draft');eq(I.instructionView(s,'post').run,run,'original prose never changes supplied run');eq(I.instructionView(s,'post').case.kept[0],kept,'kept version frozen');I.chooseInstructionCase(s,'loft','welcome-table');eq(I.instructionView(s,'post').source.id,'pocket-note','desk case selections separate');I.editInstructionPlan(s,'post','earlier','seal');eq(I.instructionView(s,'post').run,run,'plan reorder does not alter supplied playback');I.editInstructionStrip(s,'post','earlier','seal');eq(I.instructionView(s,'post').run,null,'strip edit clears current playback');ok(I.instructionView(s,'post').case.runs.some(x=>x.id===run.id),'earlier frozen run remains');I.updateInstructionKeep(s,'post',kept.id);ok(I.instructionView(s,'post').case.kept[0].text!==kept.text,'only explicit update replaces chosen version');
}
{
 const s=fresh();nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);setPostPackingInput(s,'2-');startAdaptiveRival(s,false);setRivalInput(s,'3-');startShow(s,'welcome');setSceneDialogue(s,'A fictional puppet line.');drawLetter(s,'post');chooseMessageCase(s,'post','basket');setMessageText(s,'post','original','  A fictional earlier note.\n');chooseTrailCase(s,'repair-thirds');setTrailReading(s,'2-');keepTrail(s);chooseBundleCase(s,'twenty-seven');setBundleText(s,'total-count','2-');const q={...structuredClone(itemById('number-foundation')),variant:null};s.broad.drafts['checkin:number-foundation']={question:q,attempts:[],input:'2-',model:structuredClone(q.model),familiar:false};const before=structuredClone(s);
 for(const desk of ['post','loft'])for(const c of instructionCases){I.chooseInstructionCase(s,desk,c.id);for(const a of c.actions)I.editInstructionStrip(s,desk,'add',a.id,'B');I.tryInstructionStrip(s,desk);I.stepInstructionRun(s,desk,1);I.setInstructionText(s,desk,raw);I.readInstructionWords(s,desk,'Where?');I.setInstructionComment(s,desk,'A fictional comment.');I.keepInstructionDraft(s,desk);renderInstructions(s,desk);}
 const after=structuredClone(s);delete after.instructionNotes;eq(after,before,'café/Bramble/delivery/messages/letters/Loft/math drafts exact');const imported=prepareProgressImport(JSON.stringify(s));ok(imported.ok,'full notebook import');delete imported.state.instructionNotes;eq(imported.state,before,'unrelated game histories untouched through transfer');
}
for(const payload of [null,[],9,{version:99,raw:'<img src=x onerror="fictional()">'}]){const s=fresh();s.instructionNotes=payload;const before=JSON.stringify(s);for(const desk of ['post','loft'])ok(renderInstructions(s,desk).html.length>0,'unsupported has recovery view');ok(!destinationNotes(s).includes('<img src=x'),'unsupported notes escaped');eq(JSON.stringify(s),before,'unsupported root reads unchanged');eq(prepareProgressImport(before).state.instructionNotes,payload,'unsupported root transfers exact');I.recoverInstructions(s);I.tryInstructionStrip(s,'post');I.keepInstructionDraft(s,'post');eq(I.instructionView(s,'post').run.priorExposureUnknown,true,'recovered run retains uncertainty');eq(I.instructionView(s,'post').case.kept[0].priorExposureUnknown,true,'recovered keep retains uncertainty');eq(prepareProgressImport(JSON.stringify(s)).state.instructionNotes,s.instructionNotes,'recovered payload exact');}
for(const [raw,visible,expected] of [['A\rB\r\nC','A\n\nB\nC','A\r\n\nB\r\nC'],['A\rX\nB','A\n\nB','A\r\n\nB'],['\nFirst line','\nFirst line!','\nFirst line!'],['\r\nFirst\r\nSecond\rThird','\nFirst!\nSecond\nThird','\r\nFirst!\r\nSecond\rThird'],['A\r\nB','A\nB','A\r\nB'],['🐇\r\nFold','🐇\nFold twice','🐇\r\nFold twice']])eq(preserveInstructionBreaks(raw,visible),expected,'untouched imported linebreaks survive native textarea normalization');
for(const target of ['outcome','step','embedded','termination']){
 const s=fresh();chooseMessageCase(s,'post','basket');setMessageText(s,'post','original','A fictional waiting note.');
 I.editInstructionStrip(s,'post','add','fold');I.tryInstructionStrip(s,'post');I.keepInstructionDraft(s,'post');
 const w=s.instructionNotes.cases['pocket-note'];
 if(target==='termination'){w.runs[0].transitions=[];w.runs[0].terminalScene=null;w.runs[0].blockedAction='nonexistent';w.runs[0].requestFulfilled=true;}
 else if(target==='step')w.runs[0].transitions[0].description={toString:'malformed'};
 else (target==='embedded'?w.kept[0].run:w.runs[0]).description={toString:'malformed'};
 const before=JSON.stringify(s),messages=structuredClone(s.messages);
 ok(destinationNotes(s).includes('saved material is unavailable'),'shared notes survive malformed frozen descriptions');
 for(const desk of ['post','loft'])ok(renderInstructions(s,desk).html.includes('An earlier notebook is retained'),'malformed run uses unavailable path');
 ok(destinationNotes(s).includes('A fictional waiting note.'),'shared notes keep other writing available');
 ok(messagePage(s,'post').includes('msg-workspace'),'other game still opens');eq(s.messages,messages,'other saved work untouched');
 eq(JSON.stringify(s),before,'unreadable outcome retained exact during rendering');if(target==='termination')eq(prepareProgressImport(before).state.instructionNotes,s.instructionNotes,'unreadable outcome still transfers');
 ok(setMessageText(s,'post','original','A fictional revised note.'),'other game remains editable');
}
for(const target of ['current','run','kept','embedded']){
 const s=fresh();I.editInstructionStrip(s,'post','add','fold');I.tryInstructionStrip(s,'post');I.keepInstructionDraft(s,'post');
 const w=s.instructionNotes.cases['pocket-note'];
 const source=target==='current'?w.source:target==='run'?w.runs[0].source:target==='kept'?w.kept[0].source:w.kept[0].run.source;
 source.actions[0].variants.A={toString:'malformed'};
 const before=JSON.stringify(s);
 ok(destinationNotes(s).includes('saved material is unavailable'),`${target} malformed source leaves notes readable`);
 for(const desk of ['post','loft'])ok(renderInstructions(s,desk).html.includes('An earlier notebook is retained'),`${target} malformed source uses recovery view`);
 eq(JSON.stringify(s),before,`${target} malformed source stays exact on reads`);
 ok(!prepareProgressImport(before).ok,`${target} hostile source is rejected at the import boundary`);
}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk);let s=initializeExplorerState(store.load());const id=store.active.id;I.chooseInstructionCase(s,'post','welcome-table');I.editInstructionStrip(s,'post','add','invite');I.tryInstructionStrip(s,'post');I.stepInstructionRun(s,'post',1);I.setInstructionText(s,'post',raw);I.readInstructionWords(s,'post','Where?');I.setInstructionComment(s,'post','\n A fictional reply. ');I.keepInstructionDraft(s,'post');store.save(s);eq(new ExplorerStore(disk).load().instructionNotes,s.instructionNotes,'exact raw/run/cursor reload');const other=store.add({},s);ok(!other.instructionNotes,'new explorer separate');s=store.select(id,other);eq(I.instructionView(s,'post').case.text,raw,'selected explorer resumes');store.setPersistence(false,s);store.save(s);eq(store.load().instructionNotes,s.instructionNotes,'save-off memory playable');ok(!new ExplorerStore(disk).load().instructionNotes,'save-off removes disk');ok(!store.clearActive().instructionNotes,'reset removes active notebook');
}
{
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),ending=app.match(/function endingFilm\(\)\{[\s\S]*?\n\}/)?.[0];for(const hash of ['#post/instructions','#loft/instructions']){let calls=0;const ctx=vm.createContext({state:fresh(),choosingExplorer:false,location:{hash},currentPostOffice(){calls++;return {closed:false,rival:{phase:'resolved'}};},postOfficeView(){return 'bramble';}});ok(ending,'host endingFilm function extracted');vm.runInContext(ending,ctx);eq(vm.runInContext('endingFilm()',ctx),null,'instruction desk does not trigger ending film');eq(calls,0,'instruction desk never inspects pending rival');}
}
for(const desk of ['post','loft'])ok(instructionEntry(desk).includes(`#${desk}/instructions`),'entry reaches correct desk');console.log(`Instructions for a Reader app/storage integration: ${n} passed.`);
