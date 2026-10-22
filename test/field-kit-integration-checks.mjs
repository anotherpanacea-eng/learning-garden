import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,STORAGE_KEY} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {FIELD_MISSIONS,FIELD_OUTCOMES} from '../dist/field-kit-content.mjs';
import {fieldKitView,recordFieldOutcome} from '../dist/field-kit-core.mjs';
import {fieldKitPage,fieldKitEntry,fieldKitNotes,resetFieldKitTurn} from '../dist/field-kit-ui.mjs';

let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>initializeExplorerState(freshState()),copy=structuredClone;
const escaped=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

{
 const state=fresh(),before=copy(state);
 for(const m of FIELD_MISSIONS){
  const html=fieldKitPage(state,m.id,'explorer-1');
  for(const phrase of [m.title,m.purpose,m.materials,m.safety,m.contrast,m.missing,...m.steps])ok(html.includes(escaped(phrase)),`${m.id} exact card copy renders`);
  ok(html.includes(m.hostHash),`${m.id} returns to host`);
  ok(fieldKitEntry(m.id).includes(`#field/${m.id}`),`${m.id} host entry links to card`);
  ok(html.includes('data-field-print')&&html.includes('data-field-together')&&html.includes('data-field-narration'),`${m.id} native support and print controls`);
  ok(html.includes('class="field-after field-no-print" hidden'),'adult outcomes start in the hidden After part');
 }
 const index=fieldKitPage(state,'','explorer-1');
 ok(index.includes('data-field-index')&&FIELD_MISSIONS.every(m=>index.includes(`#field/${m.id}`)),'index lists all five open cards');
 ok(fieldKitPage(state,'retired','explorer-1').includes('data-field-unknown'),'unknown route returns index notice');
 fieldKitNotes(state);destinationNotes(state);
 eq(state,before,'view, notes and route never allocate optional root');
 ok(!Object.hasOwn(prepareProgressImport(JSON.stringify(state)).state,'fieldKit'),'ordinary import leaves optional root absent');
}

{
 const state=fresh(),unrelated=copy(state);
 for(const m of FIELD_MISSIONS)for(const outcome of Object.keys(FIELD_OUTCOMES))recordFieldOutcome(state,m.id,outcome);
 const root=copy(state.fieldKit),index=fieldKitPage(state,'','explorer-1');
 for(const entry of root.entries)ok(index.includes(escaped(entry.response)),`index history shows ${entry.mission.id}/${entry.outcome}`);
 eq(state.fieldKit,root,'history render does not edit frozen outcomes');
 const preserved=copy(state);delete preserved.fieldKit;eq(preserved,unrelated,'recording fifteen reports changes only Field Kit');
 const prepared=prepareProgressImport(JSON.stringify(state));ok(prepared.ok,'actual notes import accepts optional root');
 eq(prepared.state.fieldKit,root,'import keeps frozen responses exactly');
 ok(prepared.summary.destinations.includes('Field Kit'),'import preview names Field Kit');
 ok(destinationNotes(state).includes('adult-reported offscreen'),'grown-up notes label source boundary');
}

{
 const state=fresh(),entry=recordFieldOutcome(state,'jug','done');
 entry.mission={id:'retired-card',version:8,title:'Earlier <retired> card'};
 entry.response='Earlier <supplied> reply, kept as saved.';
 const before=copy(state.fieldKit),index=fieldKitPage(state,'','explorer-1');
 ok(index.includes('Earlier &lt;retired&gt; card'),'retired frozen title is readable at index');
 ok(index.includes('Earlier &lt;supplied&gt; reply'),'retired frozen reply is readable and escaped');
 ok(!index.includes('Earlier <supplied> reply'),'imported text is not inserted as markup');
 ok(fieldKitPage(state,'retired-card','explorer-1').includes('data-field-unknown'),'retired route falls back to index');
 eq(state.fieldKit,before,'retired render leaves history untouched');
}

{
 const state=fresh();recordFieldOutcome(state,'cress','surprised',['read-together']);
 const raw={id:80,mission:{id:'old',version:1,title:'Malformed <source>'},outcome:{future:'code'},response:'bad',support:[]};
 state.fieldKit.entries.push(raw);const before=copy(state.fieldKit);
 const page=fieldKitPage(state,'cress','explorer-1'),notes=fieldKitNotes(state);
 ok(page.includes('data-field-entry="1"'),'good sibling remains on card');
 ok(page.includes('Malformed &lt;source&gt;'),'bad sibling is safely shown only as raw record');
 ok(!page.includes('Malformed <source>'),'raw record cannot inject markup');
 ok(notes.includes('Earlier records kept for recovery'),'recovery visible in notes');
 eq(state.fieldKit,before,'render and notes do not repair raw sibling');
 const imported=prepareProgressImport(JSON.stringify(state));ok(imported.ok,'mixed root transfers');eq(imported.state.fieldKit,before,'import retains exact raw sibling');
}

class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk),state=initializeExplorerState(store.load()),first=store.active.id;
 recordFieldOutcome(state,'weather','not-today');store.save(state);
 eq(new ExplorerStore(disk).load().fieldKit,state.fieldKit,'saved adult outcome reloads');
 const other=store.add({},state);ok(!Object.hasOwn(other,'fieldKit'),'new explorer has no inherited Field Kit');
 eq(store.select(first,other).fieldKit,state.fieldKit,'original explorer retains its record');
 store.setPersistence(false,state);recordFieldOutcome(state,'walk','done');store.save(state);
 eq(store.load().fieldKit,state.fieldKit,'save-off remains usable in memory');
 ok(!Object.hasOwn(new ExplorerStore(disk).load(),'fieldKit'),'save-off data is absent from new disk session');
 ok(!Object.hasOwn(store.clearActive(),'fieldKit'),'explicit explorer reset removes optional root');
}

{
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 const style=readFileSync(new URL('../dist/field-kit.css',import.meta.url),'utf8');
 const index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 ok(app.includes("root==='field'"),'Field Kit route is wired');
 ok(app.includes('resetFieldKitTurn()'),'leaving Field Kit clears pending turn support');
 for(const id of FIELD_MISSIONS.map(m=>m.id))ok(app.includes(`fieldKitEntry('${id}')`),`${id} host page has entry`);
 ok(index.includes('./field-kit.css')&&style.includes('@media print')&&style.includes('.field-card-main[hidden]{display:block!important}'),'local print stylesheet reveals complete card');
 resetFieldKitTurn();
 eq(fieldKitView(fresh()).entries,[],'turn reset does not allocate storage');
}
console.log(`Field Kit UI/storage integration: ${checks} assertions passed.`);
