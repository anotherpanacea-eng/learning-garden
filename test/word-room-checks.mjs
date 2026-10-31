import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {makeWordRoomSource} from '../dist/word-room-content.mjs';
import * as w from '../dist/word-room-core.mjs';
import {freshState} from '../dist/core.mjs';
import {prepareProgressImport, MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';

let checks = 0;
const ok = (x, message) => { assert.ok(x, message); checks++; };
const eq = (a, b, message) => { assert.deepEqual(a, b, message); checks++; };
const cp = x => structuredClone(x), options = {canExport: () => true};
const source = makeWordRoomSource();
const initialOrder = ['mat','sat','cat','bat','fin','pin','tin','bin','mop','top','pop','hop'];
eq(Object.keys(source.words), initialOrder, 'authored order is explicit');
eq(source.alphabet, [...'abcfhimnopst'], 'authored bank');
for (const [id, word] of Object.entries(source.words)) {
  ok(w.wordRoomWord(source, id), id + ': readable literal source');
  eq(word.letters.join(''), word.label, id + ': all three letter positions');
  eq(word.art, id, id + ': exact art mapping');
}
const originalTexts = JSON.parse(readFileSync(new URL('../docs/content/phonics/shared-texts.json', import.meta.url), 'utf8')).texts;
for (const t of originalTexts) {
  ok(w.wordRoomText(source, t.id), t.id + ': readable text');
  eq(source.texts[t.id].text, t.text, 'shared body is exact');
  eq(source.texts[t.id].tokens, t.tokens, 'spans and support roles stay exact');
}
eq(source.texts.puppet.prompt, 'What can the puppet do?', 'ability question follows the actual passage');
ok(!Object.values(source.words).some(x => Object.hasOwn(x, 'sounds')), 'no frozen pronunciation model');

const book = {words: {legacy: true}, parcelLabels: {future: 'kept'}, untouched: ['synthetic']};
const original = cp(book);
eq(w.wordRoomView(book).status, 'new'); eq(book, original, 'render never creates the root');
ok(w.chooseWordRoomWord(book, 'mat', options).ok);
eq(book.wordRoom.drafts.mat, {slots:[null,null,null], place:0, modelShown:true, point:null});
function spell(target, label) {
  ok(w.chooseWordRoomWord(target, 'mat', options).ok);
  for (const [i, letter] of [...label].entries()) {
    ok(w.editWordRoomDraft(target, 'place', i, options).ok);
    ok(w.editWordRoomDraft(target, 'letter', letter, options).ok);
  }
}
spell(book, 'sat');
let receipt = w.checkWordRoomLabel(book);
eq([receipt.kind, receipt.id], ['other', 'sat'], 'another word is a discovery');
const waiting = cp(book.wordRoom.drafts.mat);
ok(w.keepWordRoomLabel(book, receipt, options).ok);
eq(book.wordRoom.selectedId, 'mat'); eq(book.wordRoom.drafts.mat, waiting, 'discovery preserves waiting target and tiles');
ok(!Object.hasOwn(book.wordRoom.drafts, 'sat'), 'discovery does not invent another draft');
eq(book.wordRoom.gallery, ['sat']);
eq(w.keepWordRoomLabel(book, receipt, options).error, 'stale', 'committed receipt cannot repeat');
receipt = w.checkWordRoomLabel(book);
ok(w.editWordRoomDraft(book, 'place', 0, options).ok); ok(w.editWordRoomDraft(book, 'letter', 'b', options).ok);
const afterEdit = cp(book);
eq(w.keepWordRoomLabel(book, receipt, options).error, 'stale', 'same-view edit invalidates Keep');
eq(book, afterEdit);
ok(w.chooseWordRoomWord(book, 'fin', options).ok); ok(w.chooseWordRoomWord(book, 'mat', options).ok);
eq(book.wordRoom.drafts.mat.slots, ['b','a','t'], 'per-card draft returns');
eq(book.words, original.words); eq(book.parcelLabels, original.parcelLabels); eq(book.untouched, original.untouched);

// Classify the complete finite tile space without calling it a dictionary or speech assessment.
const labels = new Map(Object.values(source.words).map(x => [x.label, x.id]));
for (const a of source.alphabet) for (const b of source.alphabet) for (const c of source.alphabet) {
  book.wordRoom.drafts.mat.slots = [a,b,c];
  const r = w.checkWordRoomLabel(book), label = a+b+c;
  eq([r.kind,r.id,r.label], [labels.has(label) ? label==='mat'?'match':'other' : 'outside',labels.get(label)||null,label]);
}
book.wordRoom.drafts.mat.slots = ['m',null,'t'];
eq(w.checkWordRoomLabel(book).place, 1, 'first empty place');
eq(w.wordRoomSiblings(source,'mat').map(x=>x.id), ['sat','cat','bat'], 'all siblings including the authored pair');
eq(w.wordRoomExample(source,'mat').id, 'fin'); eq(w.wordRoomExample(source,'fin').id, 'mat');

const textFirst = {};
ok(w.chooseWordRoomText(textFirst,'box',options).ok);
eq([textFirst.wordRoom.selectedId,textFirst.wordRoom.page,Object.keys(textFirst.wordRoom.drafts)], [null,'read',[]]);
ok(w.setWordRoomPage(textFirst,'back',options).ok); eq(textFirst.wordRoom.page,'choose');
ok(w.chooseWordRoomWord(textFirst,'mat',options).ok);
textFirst.wordRoom.source.texts.props = {future:'opaque text'};
ok(w.setWordRoomPage(textFirst,'read',options).ok); eq(textFirst.wordRoom.page,'choose'); eq(textFirst.wordRoom.textId,'box');
const badSibling = cp(textFirst.wordRoom.source.texts.props);
ok(w.chooseWordRoomText(textFirst,'box',options).ok); eq(textFirst.wordRoom.source.texts.props,badSibling);

const damaged = cp(book);
damaged.wordRoom.source.words.pin = false;
damaged.wordRoom.gallery = ['sat','sat',17,{future:true},'absent'];
ok(w.validWordRoomRoot(damaged.wordRoom)); eq(w.wordRoomView(damaged).gallery,['sat']);
ok(w.chooseWordRoomWord(damaged,'cat',options).ok); eq(damaged.wordRoom.source.words.pin,false);
eq(damaged.wordRoom.gallery,['sat','sat',17,{future:true},'absent'],'bad gallery entries remain exact');
ok(!w.wordRoomView(damaged).complete, 'unreadable required word pauses milestone');
damaged.wordRoom.drafts.cat = {future:'draft'};
ok(w.chooseWordRoomWord(damaged,'cat',options).ok); eq(damaged.wordRoom.drafts.cat,{future:'draft'});
ok(w.wordRoomView(damaged).draftUnreadable);
const unknownSound = cp(source); unknownSound.words.mat.sounds = false;
ok(w.wordRoomWord(unknownSound,'mat'), 'unused old sound metadata is opaque');

const old = {wordRoom:{version:1,source:{id:'earlier-box',revision:4,alphabet:['z','i','p'],words:{zip:{id:'zip',label:'zip',letters:['z','i','p'],textId:null,meaning:'An earlier label.',alt:'An earlier picture.',art:'unknown-zip',guidance:'Read together.'}},texts:{}},selectedId:null,textId:null,page:'choose',drafts:{},gallery:[]}};
ok(w.chooseWordRoomWord(old,'zip',options).ok);
for (const [i,letter] of [...'zip'].entries()) { ok(w.editWordRoomDraft(old,'place',i,options).ok); ok(w.editWordRoomDraft(old,'letter',letter,options).ok); }
ok(w.keepWordRoomLabel(old,w.checkWordRoomLabel(old),options).ok); ok(w.wordRoomView(old).complete,'one-word retained collection can finish');
eq(w.wordRoomView(old).source.alphabet,['z','i','p'],'old bank remains playable');

const duplicate = cp(book); duplicate.wordRoom.source.words.alias = {...cp(source.words.mat),id:'alias'};
duplicate.wordRoom.drafts.mat.slots = [...'mat'];
eq(w.checkWordRoomLabel(duplicate).id,'mat','chosen target has match priority');
ok(w.chooseWordRoomWord(duplicate,'alias',options).ok); duplicate.wordRoom.drafts.alias.slots=[...'mat'];
eq(w.checkWordRoomLabel(duplicate).id,'alias','aliases are not merged');

for (const value of [null,false,17,'future',[],{version:99},{version:1}]) {
  const b={wordRoom:cp(value),other:{kept:true}}, before=cp(b);
  eq(w.wordRoomView(b).status,'unsupported'); eq(b,before);
  eq(w.chooseWordRoomWord(b,'mat',options).error,'unavailable'); eq(b,before);
  eq(w.recoverWordRoom(b,false,options).error,'confirmation'); eq(b,before);
  ok(w.recoverWordRoom(b,true,options).ok); eq(b.wordRoom.recovered,value); eq(b.other,{kept:true});
}
const beforeRefusal=cp(book);
eq(w.chooseWordRoomWord(book,'fin',{canExport:()=>false}).error,'capacity'); eq(book,beforeRefusal);
eq(w.chooseWordRoomWord(book,'fin',{}).error,'capacity'); eq(book,beforeRefusal,'no unchecked mutation without preflight');
eq(w.recoverWordRoom(book,true,{canExport:()=>false}).error,'capacity'); eq(book,beforeRefusal);

// This is a real raw-notebook import preflight; the native suite additionally uses the app's actual Notes report.
const bounded=freshState(), boundedOptions={canExport:b=>prepareProgressImport(JSON.stringify(b,null,2)).ok};
ok(w.chooseWordRoomWord(bounded,'mat',boundedOptions).ok);
for(const [i,letter] of [...'mat'].entries()){ok(w.editWordRoomDraft(bounded,'place',i,boundedOptions).ok);ok(w.editWordRoomDraft(bounded,'letter',letter,boundedOptions).ok);}
bounded.padding='';bounded.padding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(JSON.stringify(bounded,null,2)));
ok(prepareProgressImport(JSON.stringify(bounded,null,2)).ok,'real parser accepts exact raw-notebook boundary');
const rootBefore=bounded.wordRoom, boundedReceipt=w.checkWordRoomLabel(bounded);
eq(w.keepWordRoomLabel(bounded,boundedReceipt,boundedOptions).error,'capacity');
ok(bounded.wordRoom===rootBefore,'refusal preserves actual root identity'); eq(bounded.wordRoom.gallery,[]);

const tmp=mkdtempSync(join(tmpdir(),'word-room-catalog-'));
try {
  writeFileSync(join(tmp,'word-room-core.mjs'),readFileSync(new URL('../dist/word-room-core.mjs',import.meta.url)));
  const changed=readFileSync(new URL('../dist/word-room-content.mjs',import.meta.url),'utf8').replace('A mat lies on the floor.','A different current catalog sentence.');
  writeFileSync(join(tmp,'word-room-content.mjs'),changed);
  const current=await import(pathToFileURL(join(tmp,'word-room-core.mjs')).href);
  const fresh={};ok(current.chooseWordRoomWord(fresh,'mat',options).ok);
  eq(current.wordRoomView(fresh).word.meaning,'A different current catalog sentence.','fixture actually changes new content');
  eq(current.wordRoomView(book).word.meaning,source.words.mat.meaning,'old work never reconstructed from edited catalog');
  const kept=cp(book.wordRoom);ok(current.recoverWordRoom(book,true,options).ok);
  eq(book.wordRoom.recovered,kept,'explicit update retains exact earlier box');
  eq(book.wordRoom.source.words.mat.meaning,'A different current catalog sentence.');
} finally { rmSync(tmp,{recursive:true,force:true}); }

console.log(`Prop Box core: ${checks} checks passed (finite labels, drafts, frozen sources, partial readability, recovery and real preflight).`);
