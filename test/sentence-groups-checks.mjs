// Independent feature/reference oracle. English meaning receives complete content review;
// source tests check composition and disclosure without maintaining a second copy packet.
import assert from 'node:assert/strict';
import {groupScenes,groupScene,groupTeaching,groupCopy} from '../dist/sentence-groups-content.mjs';
import {initialGroups,changeGroups,groupsPresentation,groupsNarration} from '../dist/sentence-groups-core.mjs';

const all=['a','b','c'];
const expected=[
 {id:'couriers-mixed',kind:'courier',label:'Courier',features:['blue bag','gold bag','blue bag'],target:'blue bag',matches:['a','c'],extra:'conflicts'},
 {id:'couriers-all',kind:'courier',label:'Courier',features:['blue bag','blue bag','blue bag'],target:'blue bag',matches:all,extra:'fits'},
 {id:'parcels-mixed',kind:'parcel',label:'Parcel',features:['plain label','star label','star label'],target:'star label',matches:['b','c'],extra:'conflicts'},
 {id:'parcels-all',kind:'parcel',label:'Parcel',features:['star label','star label','star label'],target:'star label',matches:all,extra:'fits'},
 {id:'books-mixed',kind:'book',label:'Book',features:['red cover','red cover','green cover'],target:'red cover',matches:['a','b'],extra:'conflicts'},
 {id:'books-all',kind:'book',label:'Book',features:['red cover','red cover','red cover'],target:'red cover',matches:all,extra:'fits'}
];
const sorted=xs=>[...xs].sort();
const labels=row=>all.map(id=>`${row.label} ${id.toUpperCase()}`);
const frozen=value=>{assert.ok(Object.isFrozen(value),'source is frozen');for(const item of Object.values(value))if(item&&typeof item==='object')frozen(item);};
const step=(state,action,value)=>{
 const before=structuredClone(state),next=changeGroups(state,action,value);
 assert.deepEqual(state,before,`${action} does not mutate its input`);
 assert.ok(next,`${action} is available`);return next;
};
const at=id=>step(initialGroups(),'scene',id);
const formState=(row,form)=>{let state=at(row.id);if(form!=='plain')state=step(state,'attach');if(form==='extra')state=step(state,'commas');return state;};
const marked=(state,ids)=>ids.reduce((work,id)=>step(work,'mark',id),state);
const sameSet=(actual,wanted,message)=>assert.deepEqual(sorted(actual),sorted(wanted),message);
// Runtime selects authored form literals; this independently composes their grammar.
const compose=(scene,form)=>form==='plain'?`${scene.noun} ${scene.predicate}`:form==='identify'?`${scene.noun} ${scene.clause} ${scene.predicate}`:`${scene.noun}, ${scene.clause}, ${scene.predicate}`;
const sourceBefore=JSON.stringify([groupScenes,groupTeaching,groupCopy]);
[groupScenes,groupTeaching,groupCopy].forEach(frozen);
assert.deepEqual(sorted(groupScenes.map(scene=>scene.id)),sorted(expected.map(row=>row.id)));
assert.equal(groupScene('unknown'),null);

const fresh=initialGroups();
assert.equal(fresh.page,'message');assert.equal(fresh.teachingStep,0);
assert.deepEqual(fresh.drafts,{});
assert.deepEqual(groupsPresentation(fresh).marked,[]);
assert.equal(groupsPresentation(fresh).form,'plain');
assert.equal(groupsPresentation(fresh).canUndo,false);
assert.notEqual(initialGroups(),fresh,'sessions are fresh objects');
const freshBefore=structuredClone(fresh);groupsPresentation(fresh);groupsNarration(fresh);
assert.deepEqual(fresh,freshBefore,'readers do not materialize absent drafts');

for(const row of expected){
 const scene=groupScene(row.id),names=labels(row);
 assert.deepEqual(scene.members.map(member=>member.id),all);
 assert.deepEqual(scene.members.map(member=>member.label),names);
 assert.deepEqual(scene.members.map(member=>member.kind),all.map(()=>row.kind));
 assert.deepEqual(scene.members.map(member=>member.feature.text),row.features);
 sameSet(scene.matches,row.matches,`${row.id}: authored matches agree with reviewed table`);
 sameSet(scene.members.filter(member=>member.feature.id===scene.targetFeature).map(member=>member.id),row.matches,`${row.id}: match IDs agree with source features`);
 sameSet(scene.members.filter(member=>member.feature.text===row.target).map(member=>member.id),row.matches,`${row.id}: printed feature facts agree independently`);
 for(const form of ['plain','identify','extra']){
  const state=formState(row,form),p=groupsPresentation(state),message=compose(scene,form),reference=form==='identify'?row.matches:all,status=form==='plain'?'omitted':form==='identify'?'fits':row.extra;
  assert.equal(p.form,form);assert.equal(p.message,message);
  assert.equal(scene.forms[form].sentence,message);
  sameSet(p.reference,reference,`${row.id}/${form}: independent reference oracle`);
  sameSet(scene.forms[form].reference,reference);
  assert.equal(p.status,status);assert.equal(scene.forms[form].status,status);
  assert.equal((p.message.match(/,/g)||[]).length,form==='extra'?2:0);
  assert.ok(!/\s,/.test(p.message),'commas attach to the preceding word');
  assert.equal(p.canAttach,form==='plain');assert.equal(p.canRemove,form!=='plain');assert.equal(p.canCommas,form!=='plain');
  assert.equal(p.verdict,null);

  const build=groupsNarration(state);
  assert.ok(build.includes(message),'Build speaks the current sentence');
  assert.ok(build.includes(scene.factsIntro),'Build speaks the current source introduction');
  for(const fact of scene.facts)assert.ok(build.includes(fact),'Build speaks source facts even with facts drawer closed');
  assert.ok(build.includes(groupCopy.noneMarked)&&build.includes(groupCopy.hint));
  assert.ok(!build.includes(groupCopy.messageIncludes)&&!build.includes(p.explanation),'Build does not narrate hidden interpretation');
  assert.ok(!build.includes(groupCopy.matched)&&!build.includes(groupCopy.compare));

  const revealed=step(state,'page','meaning'),meaning=groupsNarration(revealed);
  assert.deepEqual(groupsPresentation(revealed).marked,[],'reveal never supplies a response');
  assert.equal(groupsPresentation(revealed).verdict,null,'reveal is not a check');
  assert.ok(meaning.includes(p.explanation)&&meaning.includes(groupCopy.messageIncludes));
  for(const id of reference)assert.ok(meaning.includes(`${row.label} ${id.toUpperCase()}`));
  assert.ok(!meaning.includes(groupCopy.matched)&&!meaning.includes(groupCopy.compare));

  // All eight possible marked sets, including empty and reversed insertion order.
  for(let mask=0;mask<8;mask++){
   const selected=all.filter((_,i)=>mask&(1<<i)).reverse(),trial=marked(state,selected),checked=step(trial,'check'),cp=groupsPresentation(checked);
   sameSet(cp.marked,selected,'checking preserves the child’s exact set');
   sameSet(cp.reference,reference);
   const matches=sorted(selected).join(',')===sorted(reference).join(',');
   assert.equal(cp.verdict,matches?groupCopy.matched:groupCopy.compare);
   assert.equal(cp.message,message,'check does not rewrite wording');
   assert.ok(groupsNarration(checked).includes(cp.verdict));
   const back=step(checked,'page','message');
   assert.ok(!groupsNarration(back).includes(p.explanation),'earlier reveal does not leak back into Build narration');
   assert.ok(!groupsNarration(back).includes(cp.verdict),'earlier checked feedback is hidden on Build');
  }
 }
}

// Wording Undo restores wording only, preserving marks and sticky help context.
let work=marked(at('couriers-mixed'),['a']);
assert.equal(changeGroups(work,'commas'),null);assert.equal(changeGroups(work,'remove'),null);assert.equal(changeGroups(work,'undo'),null);
work=step(work,'attach');assert.equal(changeGroups(work,'attach'),null);
work=step(work,'check');work=step(work,'page','message');work=step(work,'mark','b');
assert.equal(groupsPresentation(work).verdict,null,'changing marks clears checked feedback');
work=step(work,'commas');
assert.equal(work.page,'message');assert.equal(groupsPresentation(work).work.shown,false);assert.equal(groupsPresentation(work).work.checked,false);
assert.equal(groupsPresentation(work).work.helpSeen,true);
work=step(work,'mark','c');work=step(work,'undo');
assert.equal(groupsPresentation(work).form,'identify');sameSet(groupsPresentation(work).marked,all);
assert.equal(groupsPresentation(work).canUndo,false);assert.equal(changeGroups(work,'undo'),null);
work=step(work,'commas');work=step(work,'remove');
assert.equal(groupsPresentation(work).form,'plain');assert.equal(groupsPresentation(work).work.commas,false);
work=step(work,'undo');assert.equal(groupsPresentation(work).form,'extra');sameSet(groupsPresentation(work).marked,all);
work=step(work,'remove');work=step(work,'attach');assert.equal(groupsPresentation(work).form,'identify','restoring detail starts without commas');

// Each scene holds its own wording, marks, support context and single Undo.
let cached=initialGroups();const drafts=new Map();
for(const [index,row] of expected.entries()){
 cached=step(cached,'scene',row.id);cached=step(cached,'attach');
 if(index%2===0)cached=step(cached,'commas');
 cached=step(cached,'mark',all[index%3]);
 drafts.set(row.id,structuredClone(groupsPresentation(cached).work));
}
for(const row of [...expected].reverse()){
 cached=step(cached,'scene',row.id);assert.deepEqual(groupsPresentation(cached).work,drafts.get(row.id));
 const same=step(cached,'scene',row.id);assert.equal(same.page,'message');assert.deepEqual(same.drafts,cached.drafts);
}

// The separate five-step lantern model cannot replace practice wording/marks.
assert.equal(groupTeaching.length,5);
let teaching=step(step(marked(formState(expected[2],'extra'),['c']),'page','meaning'),'teaching-open');
const waiting=structuredClone(groupsPresentation(teaching).work);
const waitingMessage=groupsPresentation(teaching).message;
assert.equal(teaching.beforeHelp,'meaning');assert.equal(waiting.teachingSeen,true);
for(let i=0;i<5;i++){
 const card=groupTeaching[i],spoken=groupsNarration(teaching),featureNames=i===4?['silver handle','silver handle','silver handle']:['silver handle','wooden handle','silver handle'];
 assert.equal(teaching.teachingStep,i);
 assert.deepEqual(card.members.map(member=>member.feature.text),featureNames);
 assert.deepEqual(card.members.map(member=>member.label),['Lantern A','Lantern B','Lantern C']);
 assert.ok(card.blocks.some(block=>block.kind==='sentence'),'teaching includes separate sentence blocks');
 for(const block of card.blocks){assert.ok(['sentence','comment'].includes(block.kind));assert.ok(spoken.includes(block.text));}
 assert.ok(spoken.includes(card.title));
 for(const fact of card.facts)assert.ok(spoken.includes(fact),'teaching speaks its current example facts');
 assert.ok(!spoken.includes(waitingMessage)&&!spoken.includes(groupCopy.yourMarks)&&!spoken.includes(groupCopy.messageIncludes),'teaching narrates only its separate example');
 assert.deepEqual(groupsPresentation(teaching).work,waiting,'teaching navigation preserves exact waiting work');
 assert.equal(changeGroups(teaching,'mark','a'),null);assert.equal(changeGroups(teaching,'commas'),null);
 if(i<4)teaching=step(teaching,'teaching-step',1);
}
const upper=changeGroups(teaching,'teaching-step',1);if(upper)assert.equal(upper.teachingStep,4);
for(let i=0;i<4;i++)teaching=step(teaching,'teaching-step',-1);
const lower=changeGroups(teaching,'teaching-step',-1);if(lower)assert.equal(lower.teachingStep,0);
const returned=step(teaching,'teaching-close');assert.equal(returned.page,'meaning');assert.deepEqual(groupsPresentation(returned).work,waiting);
assert.equal(step(step(returned,'teaching-open'),'scene','parcels-mixed').page,'message','scene choice leaves teaching even for current scene');

const normal=groupsNarration(work),talk=groupsNarration(work,{talkOpen:true}),grown=groupsNarration(work,{grownupOpen:true});
assert.ok(!normal.includes(groupCopy.talk));assert.ok(talk.includes(groupCopy.talk));
assert.ok(!normal.includes(groupCopy.grownup));assert.ok(grown.includes(groupCopy.grownup));
assert.equal(groupsNarration(work,{factsOpen:false}),groupsNarration(work,{factsOpen:true}),'native facts remain narrated regardless of drawer position');
assert.equal(groupsNarration(work,{talkOpen:'true',grownupOpen:1}),normal,'only elected boolean drawers append narration');

// Invalid states and actions stay inert; an unsaved new activity needs no migration machinery.
const base=at('couriers-mixed'),held=step(base,'attach'),draft=structuredClone(groupsPresentation(held).work);
const invalid=[null,[],{}, {...base,caseId:'unknown'}, {...base,page:'other'}, {...base,beforeHelp:'teaching'}, {...base,teachingStep:-1}, {...base,teachingStep:5}, {...base,teachingStep:0.5}, {...base,drafts:[]}, {...base,drafts:{unknown:draft}}];
for(const edit of [d=>delete d.marked,d=>d.marked=['a','a'],d=>d.marked=['d'],d=>d.marked='a',d=>d.attached=1,d=>{d.attached=false;d.commas=true;},d=>d.checked='yes',d=>d.shown=null,d=>d.helpSeen=0,d=>d.teachingSeen=[],d=>d.previous={},d=>d.previous={attached:false,commas:true}]){
 const bad=structuredClone(draft);edit(bad);invalid.push({...base,drafts:{'couriers-mixed':bad}});
 // Validate cached drafts too, not only the current scene.
 invalid.push({...base,drafts:{'parcels-all':bad}});
}
for(const bad of invalid){
 assert.doesNotThrow(()=>groupsPresentation(bad));assert.equal(groupsPresentation(bad),null);
 assert.doesNotThrow(()=>groupsNarration(bad));assert.equal(groupsNarration(bad),null);
 assert.doesNotThrow(()=>changeGroups(bad,'attach'));assert.equal(changeGroups(bad,'attach'),null);
}
for(const [action,value] of [['unknown'],['scene','unknown'],['scene',{}],['mark','unknown'],['mark',{}],['page','teaching'],['page',null],['teaching-step',2],['teaching-step','1'],['teaching-step',NaN]]){
 const before=structuredClone(held);assert.equal(changeGroups(held,action,value),null);assert.deepEqual(held,before);
}
const frozenWork=structuredClone(held);const freeze=value=>{for(const v of Object.values(value))if(v&&typeof v==='object')freeze(v);return Object.freeze(value);};freeze(frozenWork);
assert.equal(groupsPresentation(step(frozenWork,'commas')).form,'extra','changes accept immutable input');
const changed=step(held,'mark','b');changed.drafts['couriers-mixed'].marked.push('c');
assert.deepEqual(groupsPresentation(held).marked,[],'new responses do not alias earlier work');
assert.equal(JSON.stringify([groupScenes,groupTeaching,groupCopy]),sourceBefore,'all trials and teaching leave source facts unchanged');
assert.deepEqual(initialGroups().drafts,{},'reset creates no retained trials');
console.log('Sentence groups checks passed: finite meanings, reversible work, disclosure, teaching and malformed boundaries.');
