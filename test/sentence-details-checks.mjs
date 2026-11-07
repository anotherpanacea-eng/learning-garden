// Original fictional scenes only. Expected sentences and notes were transcribed independently.
import assert from 'node:assert/strict';
import {detailCopy as copy,detailTeaching,detailModel,detailScenes,detailScene} from '../dist/sentence-details-content.mjs';
import {initialDetails,changeDetails,detailsPresentation,detailsNarration,detailsAnnouncement} from '../dist/sentence-details-core.mjs';

const expected=[
 ['parcel','parcel','crate',
  'The parcel rests beside the crate.',
  'The parcel that has a star label rests beside the crate.',
  'The parcel rests beside the crate that has a star label.'],
 ['scarf','courier','gardener',
  'The courier waits beside the gardener.',
  'The courier who is wearing a striped scarf waits beside the gardener.',
  'The courier waits beside the gardener who is wearing a striped scarf.'],
 ['spoon','kitten','bunny',
  'The kitten sits beside the bunny.',
  'The kitten that is carrying a spoon sits beside the bunny.',
  'The kitten sits beside the bunny that is carrying a spoon.'],
 ['tag','basket','stool',
  'The basket sits beside the stool.',
  'The basket that has a circle tag sits beside the stool.',
  'The basket sits beside the stool that has a circle tag.'],
 ['moon','lantern','boat',
  'The lantern rests beside the boat.',
  'The lantern that has a painted moon rests beside the boat.',
  'The lantern rests beside the boat that has a painted moon.'],
 ['bridge','book','map',
  'The book lies beside the map.',
  'The book which shows a bridge lies beside the map.',
  'The book lies beside the map which shows a bridge.']
];
const notes=[
 [
  ['This version gives the star-label detail to the parcel.','That agrees with the parcel’s label in our scene.','The detail is about the parcel, as this reader requested.'],
  ['This version gives the star-label detail to the crate.','Our scene gives the crate a plain label, not a star. Moving the words does not change the crate.','This tells the reader about the crate instead of the parcel’s label.']],
 [
  ['In this version, the courier is the person wearing the striped scarf.','That agrees with our scene.','The added detail describes the courier, as requested.'],
  ['In this version, the gardener is the person wearing the striped scarf.','Our gardener’s scarf is plain. The sentence and the scene disagree about that detail.','This adds a description of the gardener, not the courier’s scarf.']],
 [
  ['This version describes the kitten as carrying a spoon.','The kitten has empty paws in our scene; the bunny carries the spoon.','This tells the helper about the kitten instead of the bunny.'],
  ['This version describes the bunny as carrying a spoon.','That agrees with the bunny in our scene.','The detail is about the bunny, as the helper requested.']],
 [
  ['This version gives the circle-tag detail to the basket.','The basket’s circle tag agrees with that description.','It describes the basket’s tag for the stock keeper.'],
  ['This version gives the circle-tag detail to the stool.','The stool has a triangle tag in our scene.','It describes a tag on the stool instead of the basket’s tag.']],
 [
  ['This version gives the painted-moon detail to the lantern.','Our lantern has a painted star. The boat has the moon.','This describes a mark on the lantern rather than the boat’s mark.'],
  ['This version gives the painted-moon detail to the boat.','That agrees with the boat in our scene.','It describes the boat’s mark, as its passenger requested.']],
 [
  ['This version says the book shows a bridge.','Our book shows a bridge, so this agrees with the scene. The map shows one too.','This version adds the requested information about the book.'],
  ['This version says the map shows a bridge.','That also agrees with the scene. Both things show a bridge.','It describes the map, while this reader asked about the book.']]
];
const frozen=o=>{assert.ok(Object.isFrozen(o));for(const v of Object.values(o))if(v&&typeof v==='object')frozen(v);};
[copy,detailTeaching,detailModel,detailScenes].forEach(frozen);
assert.deepEqual(detailScenes.map(s=>s.id),expected.map(s=>s[0]));
assert.equal(detailScene('unknown'),null);
assert.deepEqual(initialDetails(),{caseId:'parcel',drafts:{}});
let saved=initialDetails();
for(const [index,[id,left,right,base,...sentences]] of expected.entries()){
 const scene=detailScene(id),snapshot=structuredClone(scene);
 assert.deepEqual(Object.keys(scene.trials),[left,right]);
 assert.deepEqual(scene.entities.map(e=>e.id),[left,right]);
 assert.deepEqual(scene.base.filter(t=>Object.hasOwn(t,'noun')).map(t=>t.noun),[left,right]);
 assert.equal(scene.base.filter(t=>t.detail).length,0);
 let state=id==='parcel'?initialDetails():changeDetails(initialDetails(),'scene',id);
 assert.equal(detailsPresentation(state).sentence,base);
 assert.equal(detailsPresentation(state).meaning,copy.separateMeaning);
 assert.equal(detailsPresentation(state).sceneNote,'');
 assert.equal(detailsPresentation(state).purposeNote,'');
 assert.equal(detailsPresentation(state).canUndo,false);
 assert.deepEqual(state.drafts,{});
 assert.equal(changeDetails(state,'scene',id),null);
 assert.equal(changeDetails(state,'remove'),null);
 assert.equal(changeDetails(state,'undo'),null);
 for(const [side,anchor] of [left,right].entries()){
  const tokens=scene.trials[anchor].tokens;
  assert.equal(tokens.map(t=>t.text).join(''),sentences[side]);
  assert.deepEqual(tokens.filter(t=>t.detail!==true),scene.base);
  assert.deepEqual(tokens.filter(t=>Object.hasOwn(t,'noun')).map(t=>t.noun),[left,right]);
  assert.equal(tokens.filter(t=>t.detail===true).length,1);
  const at=tokens.findIndex(t=>t.detail===true);
  assert.equal(tokens[at-1].noun,anchor);
  assert.equal(tokens[at].text,' '+scene.clause);
  for(const entity of scene.entities)assert.equal(tokens.find(t=>t.noun===entity.id).text,entity.text);
  const before=structuredClone(state),attached=changeDetails(state,'attach',anchor);
  assert.deepEqual(state,before,'attach leaves its input unchanged');
  const p=detailsPresentation(attached);
  assert.equal(p.sentence,sentences[side]);
  assert.deepEqual([p.meaning,p.sceneNote,p.purposeNote],notes[index][side]);
  assert.equal(p.anchor,anchor);assert.equal(p.canUndo,true);
  assert.equal(changeDetails(attached,'attach',anchor),null);
  assert.equal(detailsAnnouncement(attached,'attach'),`Detail attached to ${scene.entities[side].label}. Sentence and meaning updated.`);
  assert.equal(detailsPresentation(changeDetails(attached,'undo')).anchor,before.drafts[id]?.anchor??null);
  const removed=changeDetails(attached,'remove');
  assert.equal(detailsPresentation(removed).sentence,base);
  assert.equal(detailsAnnouncement(removed,'remove'),'Detail removed. The base sentence is showing.');
  const undone=changeDetails(removed,'undo');
  assert.equal(detailsPresentation(undone).anchor,anchor);
  assert.equal(detailsPresentation(undone).canUndo,false);
  assert.equal(changeDetails(undone,'undo'),null);
  assert.equal(detailsAnnouncement(undone,'undo'),'Last detail move undone.');
  state=attached;
 }
 assert.deepEqual(detailScene(id),snapshot,'trials do not mutate the source');
 scene.base[0].text='changed';scene.entities[0].feature.text='changed';
 assert.deepEqual(detailScene(id),snapshot,'factories return detached nested content');
 const p=detailsPresentation(state);p.tokens[0].text='changed';p.scene.trials[left].meaning='changed';
 assert.equal(detailsPresentation(state).sentence,sentences[1]);
 saved=id==='parcel'?saved:changeDetails(saved,'scene',id);
 saved=changeDetails(saved,'attach',right);
}
// Scene paging preserves all six current trials and each scene's single Undo.
for(const [id,,right] of expected){
 if(saved.caseId!==id)saved=changeDetails(saved,'scene',id);
 assert.equal(detailsPresentation(saved).anchor,right);
 assert.equal(detailsPresentation(saved).canUndo,true);
 const undone=changeDetails(saved,'undo');
 assert.equal(detailsPresentation(undone).anchor,null);
 assert.equal(changeDetails(undone,'undo'),null);
 assert.equal(detailsAnnouncement(saved,'scene'),`${detailScene(id).title}. Your trial is here.`);
}
const frozenState=Object.freeze({caseId:'parcel',drafts:Object.freeze({parcel:Object.freeze({anchor:'crate',previous:Object.freeze({anchor:null})})})});
assert.equal(detailsPresentation(changeDetails(frozenState,'undo')).anchor,null);
assert.equal(detailsPresentation(frozenState).anchor,'crate');
assert.deepEqual(initialDetails(),{caseId:'parcel',drafts:{}},'each reset starts without trials');
const extras={...initialDetails(),extra:{nested:['preserved']}};
const moved=changeDetails(extras,'attach','parcel');
moved.extra.nested.push('separate');assert.deepEqual(extras.extra.nested,['preserved']);
moved.drafts.parcel.previous.anchor='crate';assert.deepEqual(extras.drafts,{});
const ownless=Object.create({caseId:'parcel',drafts:{}});
const draftless=Object.create({parcel:{anchor:'parcel',previous:null}});
const invalid=[null,[],{},ownless,{caseId:'parcel',drafts:draftless},
 {caseId:'unknown',drafts:{}},{caseId:'parcel',drafts:[]},
 {caseId:'parcel',drafts:{unknown:{anchor:null,previous:null}}},
 {caseId:'parcel',drafts:{scarf:{anchor:'parcel',previous:null}}},
 {caseId:'parcel',drafts:{scarf:{anchor:'courier',previous:{anchor:'crate'}}}},
 {caseId:'parcel',drafts:{parcel:null}},
 {caseId:'parcel',drafts:{parcel:{anchor:null}}},
 {caseId:'parcel',drafts:{parcel:{anchor:false,previous:null}}},
 {caseId:'parcel',drafts:{parcel:{anchor:'parcel',previous:[]}}},
 {caseId:'parcel',drafts:{parcel:{anchor:'parcel',previous:{}}}},
 {caseId:'parcel',drafts:{parcel:{anchor:'parcel',previous:{anchor:null,extra:true}}}},
 {caseId:'parcel',drafts:{parcel:{anchor:'parcel',previous:null,extra:true}}},
 {caseId:'parcel',drafts:{parcel:Object.create({anchor:'parcel',previous:null})}},
 {caseId:'parcel',drafts:{parcel:{anchor:'parcel',previous:Object.create({anchor:null})}}},
 Object.defineProperty({drafts:{}},'caseId',{get(){throw Error('must not throw');}}),
 {caseId:'parcel',drafts:Object.defineProperty({},'scarf',{get(){throw Error('must not throw');}})},
 {caseId:'parcel',drafts:{scarf:Object.defineProperty({previous:null},'anchor',{get(){throw Error('must not throw');}})}}
];
for(const state of invalid){
 assert.equal(changeDetails(state,'scene','scarf'),null);
 assert.equal(changeDetails(state,'attach','parcel'),null);
 assert.equal(detailsPresentation(state),null);
 assert.equal(detailsNarration(state),null);
 assert.equal(detailsAnnouncement(state,'scene'),null);
}
for(const action of ['scene','attach'])for(const value of ['unknown','__proto__',1,null,{},undefined])assert.equal(changeDetails(initialDetails(),action,value),null);
assert.equal(changeDetails(initialDetails(),'attach','courier'),null);
assert.equal(changeDetails(initialDetails(),'unknown'),null);
assert.equal(detailsAnnouncement(initialDetails(),'unknown'),null);

// Exact ordered narration: no alternate trial, grown-up copy or unelected card.
const initial=initialDetails();
const prefix='Our imagined scene: The star label A parcel with a star label rests beside a crate with a plain label. The crate has no star label. The picture and scene facts stay the same when you change the words. For this reader: Describe the parcel’s label for the delivery driver. Detail to move: that has a star label Sentence we are trying: The parcel rests beside the crate. No detail is attached. Choose a noun for the detail to describe. Meaning to notice: The base sentence names the two figures and where they are. It does not attach the movable detail to either noun.';
assert.equal(detailsNarration(initial),prefix);
assert.equal(detailsNarration(initial,null),prefix);
for(const flag of [false,0,1,'true',{},null])assert.equal(detailsNarration(initial,{teachingOpen:flag,modelOpen:flag}),prefix);
for(let i=0;i<4;i++){
 assert.equal(detailsNarration(initial,{teachingOpen:true,teachingPage:i}),`${prefix} Teaching card ${i+1} of 4 ${detailTeaching[i]}`);
 assert.equal(detailsNarration(initial,{modelOpen:true,modelPage:i}),`${prefix} Model part ${i+1} of 4 ${detailModel[i].title} ${detailModel[i].text}`);
}
for(const [input,index] of [[-8,0],[99,3],[NaN,0],[Infinity,0],[-Infinity,0],['2',0],[undefined,0],[1.9,1]]){
 assert.equal(detailsNarration(initial,{teachingOpen:true,teachingPage:input,modelOpen:true,modelPage:input}),`${prefix} Teaching card ${index+1} of 4 ${detailTeaching[index]} Model part ${index+1} of 4 ${detailModel[index].title} ${detailModel[index].text}`);
}
const attached=changeDetails(initial,'attach','crate'),scene=detailScene('parcel');
const attachedSpeech=`Our imagined scene: The star label ${scene.context} ${copy.sceneNotice} For this reader: ${scene.purpose} Detail to move: ${scene.clause} Sentence we are trying: The parcel rests beside the crate that has a star label. In this version, the detail describes: the crate Meaning to notice: ${notes[0][1][0]} Beside the scene: ${notes[0][1][1]} Beside the request: ${notes[0][1][2]}`;
assert.equal(detailsNarration(attached,{teachingOpen:false,modelOpen:false}),attachedSpeech);
assert.ok(!attachedSpeech.includes(expected[0][4]));
assert.ok(!attachedSpeech.includes(copy.grownup));
assert.deepEqual(initial,initialDetails(),'presentation and narration never materialize drafts');
console.log('Sentence details: finite content, attachment lifecycle, detached state, validation and elected narration passed.');
