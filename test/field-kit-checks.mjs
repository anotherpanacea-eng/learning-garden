import assert from 'node:assert/strict';
import {FIELD_MISSIONS,FIELD_OUTCOMES} from '../dist/field-kit-content.mjs';
import {fieldKitView,fieldEntryValid,recordFieldOutcome,recoverFieldKit} from '../dist/field-kit-core.mjs';

const copy=structuredClone;
let checks=0;
const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
const ok=(value,message)=>{assert.ok(value,message);checks++;};

eq(FIELD_MISSIONS.map(m=>m.id),['jug','cress','notice','weather','walk'],'complete five-card pack');
eq(Object.keys(FIELD_OUTCOMES),['done','surprised','not-today'],'three adult outcomes');
for(const mission of FIELD_MISSIONS){
 ok(mission.steps.length>=3&&mission.steps.length<=4,`${mission.id} has practical steps`);
 for(const part of ['title','purpose','materials','safety','contrast','missing','host','hostHash'])ok(typeof mission[part]==='string'&&mission[part].length>0,`${mission.id} has ${part}`);
 for(const outcome of Object.keys(FIELD_OUTCOMES))ok(typeof mission.replies[outcome]==='string'&&mission.replies[outcome].length>40,`${mission.id} ${outcome} exact reply`);
 ok(!/[—]|\bneighbour\b|\bmould\b/i.test([mission.title,mission.purpose,mission.materials,...mission.steps,mission.safety,mission.contrast,mission.missing,...Object.values(mission.replies)].join(' ')),`${mission.id} uses new-copy house style`);
}
ok(FIELD_MISSIONS.find(m=>m.id==='cress').safety.includes('Seeds and these experiment plants are not for eating'),'cress seed safety');
ok(FIELD_MISSIONS.find(m=>m.id==='cress').safety.includes('If mold appears'),'cress mold disposal');
ok(FIELD_MISSIONS.find(m=>m.id==='weather').safety.includes('Never look straight at the sun'),'weather sun safety');
ok(FIELD_MISSIONS.find(m=>m.id==='walk').safety.includes('At a window, do not open or climb'),'walk window safety');

const state={unrelated:{draft:'fictional earlier work'}};
eq(fieldKitView(state).entries,[],'absent root has no entries');
ok(!Object.hasOwn(state,'fieldKit'),'view does not allocate root');
ok(!recordFieldOutcome(state,'absent','done'),'unknown mission is rejected');
ok(!recordFieldOutcome(state,'jug',{toString:null}),'malformed outcome object is rejected safely');
ok(!Object.hasOwn(state,'fieldKit'),'invalid action allocates nothing');
const original=copy(state.unrelated);
for(const mission of FIELD_MISSIONS)for(const outcome of Object.keys(FIELD_OUTCOMES)){
 const entry=recordFieldOutcome(state,mission.id,outcome,outcome==='done'?['read-together','narration']:[]);
 ok(fieldEntryValid(entry),`${mission.id} ${outcome} entry validates`);
 eq(entry.response,mission.replies[outcome],`${mission.id} ${outcome} saves exact authored reply`);
 eq(entry.mission,{id:mission.id,version:1,title:mission.title},`${mission.id} freezes mission source`);
}
eq(state.unrelated,original,'Field Kit leaves unrelated state alone');
eq(fieldKitView(state).entries.length,15,'all fifteen outcomes remain readable');
const frozen=copy(state.fieldKit.entries[0]);
state.fieldKit.entries[0].mission={id:'retired-card',version:7,title:'Earlier card <frozen>'};
state.fieldKit.entries[0].response='Earlier supplied reply <frozen>';
ok(fieldKitView(state).entries[0].entry.response==='Earlier supplied reply <frozen>','frozen retired source and reply remain readable');
ok(fieldEntryValid(state.fieldKit.entries[0]),'no current-catalog requirement');
state.fieldKit.entries[0]=frozen;

const mixed={fieldKit:{version:1,entries:[copy(frozen),{id:20,mission:{id:'old',version:1,title:'Old'},outcome:{toString:null},response:'bad',support:[]}, {...copy(frozen),id:21,mission:{id:'retired',version:2,title:'An older card'},response:'Earlier <reply>'},{...copy(frozen),id:21,response:'duplicate'}, {id:Number.MAX_SAFE_INTEGER,raw:'future'}]}};
const saved=copy(mixed.fieldKit),v=fieldKitView(mixed);
eq(v.entries.map(x=>x.entry.id),[1,21],'good siblings survive malformed outcome, duplicate and future raw');
eq(v.rawEntries.map(x=>x.reason),['unreadable','duplicate','unreadable'],'bad siblings are retained separately');
eq(mixed.fieldKit,saved,'view never rewrites raw siblings');
ok(!recordFieldOutcome(mixed,'jug','done'),'future safe maximum id prevents reuse of a lower id');
eq(mixed.fieldKit,saved,'exhausted action keeps original root');

const overflow={fieldKit:{version:1,entries:Array.from({length:25},(_,i)=>({...copy(frozen),id:i+1}))}};
const before=copy(overflow.fieldKit);
eq(fieldKitView(overflow).entries.map(x=>x.entry.id),Array.from({length:24},(_,i)=>i+2),'newest 24 imported entries readable');
eq(fieldKitView(overflow).rawEntries[0].entry.id,1,'oldest imported overflow preserved');
eq(overflow.fieldKit,before,'import view does not trim');
const appended=recordFieldOutcome(overflow,'walk','not-today');
eq(appended.id,26,'new id considers all imported entries');
eq(overflow.fieldKit.entries.find(x=>x.id===1),before.entries[0],'older raw overflow remains exact');
ok(!overflow.fieldKit.entries.some(x=>x.id===2),'only first readable entry removed on explicit choice');
eq(fieldKitView(overflow).entries.at(-1).entry.id,26,'new entry remains readable');

for(const raw of [null,3,{version:9,entries:[{id:1}]},{version:1,entries:'not an array'}]){
 const s={fieldKit:copy(raw)},earlier=copy(s.fieldKit);
 ok(fieldKitView(s).unsupported,'unknown root unavailable');
 ok(!recordFieldOutcome(s,'jug','done'),'unknown root blocks outcome');
 eq(s.fieldKit,earlier,'unknown root untouched before recovery');
 ok(recoverFieldKit(s),'explicit recovery succeeds');
 eq(s.fieldKit.recovered,earlier,'original root retained under recovery');
 ok(fieldEntryValid(recordFieldOutcome(s,'jug','not-today')),'new outcome works after recovery');
}
console.log(`Field Kit content/core: ${checks} assertions passed.`);
