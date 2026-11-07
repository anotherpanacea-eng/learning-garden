import assert from 'node:assert/strict';
import {createMagpiePictures,changeMagpiePictures,magpiePicturesModel,magpiePicturesNarration} from '../dist/magpie-pictures-core.mjs';
import {magpieScenes,magpieLessons,magpieSortCards,magpieArtDescriptions,magpieCopy} from '../dist/magpie-pictures-content.mjs';
import {magpiePicturesPage} from '../dist/magpie-pictures-ui.mjs';

const frozen=work=>{Object.values(work).filter(Array.isArray).forEach(Object.freeze);return Object.freeze(work);};
let work=frozen(createMagpiePictures());
assert.deepEqual(work,{page:'party',scene:0,ideas:[null,null,null,null,null,null],references:[false,false,false,false,false,false],lesson:0,sort:0,trays:[null,null,null,null,null,null],sortReferences:[false,false,false,false,false,false]});
assert.notEqual(createMagpiePictures().ideas,work.ideas,'visits have separate arrays');
const change=(action,value)=>{const previous=work,snapshot=structuredClone(work);work=frozen(changeMagpiePictures(work,action,value));assert.deepEqual(previous,snapshot,'actions never mutate previous work');return work;};
const noop=(action,value)=>assert.equal(changeMagpiePictures(work,action,value),work,`${action} ${String(value)} is unchanged`);

assert.equal(magpieScenes.length,6);
assert.equal(magpieLessons.length,4);
assert.equal(magpieSortCards.length,6);
assert.deepEqual(magpieScenes.map(s=>s.title),['Supper','New guests','Welcome speech','Surprise news','Easy riddle','Outside the window']);
// This finite mapping checks the authored order without deriving a verdict from a choice.
assert.deepEqual(magpieScenes.map(s=>s.choices.map(c=>c.image)),[
 ['hungry','horse-plate','horse-ride'],['leaving','greeting','ice-bowl'],
 ['butterfly-outline','butterfly-garden','nervous-speech'],['cat-bag','song-news','mend-bag'],
 ['easy-riddle','icing-card','riddle-cake'],['light-rain','rain-animals','heavy-rain']
]);
assert.deepEqual(magpieScenes.map(s=>s.referenceImage),['hungry','greeting','nervous-speech','song-news','easy-riddle','heavy-rain']);
assert.deepEqual(magpieSortCards.map(s=>[s.id,s.reference,s.image]),[
 ['cake-food','literal','cake-slice'],['cake-task','figurative','easy-riddle'],
 ['cat-news','figurative','song-news'],['cat-animal','literal','cat-bag'],
 ['ice-object','literal','ice-bowl'],['ice-talk','figurative','greeting']
]);
const art=[...magpieScenes.flatMap(s=>[s.bird,s.referenceImage,...s.choices.map(c=>c.image)]),...magpieLessons.flatMap(l=>l.images),...magpieSortCards.map(c=>c.image)];
assert.equal(Object.keys(magpieArtDescriptions).length,19);
for(const id of art)assert.equal(typeof magpieArtDescriptions[id],'string',`picture ${id} has honest words`);

noop('page','other');noop('unknown');noop('scene',0);noop('clear-idea');
for(const invalid of [-1,6,1.2,'1',null,undefined,NaN,Infinity])noop('scene',invalid);
for(const invalid of [-1,3,0.5,'0',null,undefined,false])noop('idea',invalid);
for(const action of ['lesson','sort','tray','clear-tray','sort-reference'])noop(action,1);

for(let scene=0;scene<6;scene++){
 change('scene',scene);
 for(let idea=0;idea<3;idea++){
  change('idea',idea);
  const m=magpiePicturesModel(work);
  assert.deepEqual(m.idea,magpieScenes[scene].choices[idea],'every choice has its own neutral caption and picture');
  assert.deepEqual(Object.keys(m).sort(),['page','scene','idea','reference','lesson','sortCard','tray','sortReference'].sort(),'model introduces no judgement fields');
  assert.deepEqual(Object.keys(m.idea).sort(),['image','text']);
 }
 const beforeChoice=work.ideas.slice();
 assert.equal(magpiePicturesModel(work).reference,null);
 const closed=magpiePicturesNarration(work);
 assert.ok(closed.includes(magpieScenes[scene].context));
 assert.ok(closed.includes(magpieScenes[scene].quote));
 assert.ok(closed.includes(magpieArtDescriptions[magpieScenes[scene].bird]));
 for(const choice of magpieScenes[scene].choices)assert.ok(closed.includes(choice.text));
 for(const s of magpieScenes){assert.ok(!closed.includes(s.meaning),'no closed prepared meaning');assert.ok(!closed.includes(s.clue),'no closed prepared clue');}
 for(const s of magpieScenes.filter((_,i)=>i!==scene))assert.ok(!closed.includes(s.quote),'no other scene quoted');
 change('reference');assert.deepEqual(work.ideas,beforeChoice,'reference keeps an unexpected choice');
 assert.deepEqual(magpiePicturesModel(work).reference,{text:magpieScenes[scene].meaning,clue:magpieScenes[scene].clue,image:magpieScenes[scene].referenceImage});
 assert.ok(magpiePicturesNarration(work).includes(magpieScenes[scene].meaning));
 assert.ok(magpiePicturesNarration(work).includes(magpieScenes[scene].clue));
}
assert.deepEqual(work.ideas,[2,2,2,2,2,2]);assert.deepEqual(work.references,Array(6).fill(true));
change('scene',0);change('idea','unsure');assert.equal(magpiePicturesModel(work).idea,null);
assert.ok(magpiePicturesNarration(work).includes(magpieCopy.uncertainty));noop('idea','unsure');
change('clear-idea');assert.equal(work.ideas[0],null);assert.equal(work.references[0],true);noop('clear-idea');
change('reference');assert.equal(magpiePicturesModel(work).reference,null);

const partySnapshot=structuredClone(work);
change('page','learn');noop('page','learn');
for(const action of ['scene','idea','clear-idea','reference','sort','tray','clear-tray','sort-reference'])noop(action,1);
for(const invalid of [-1,4,0.2,'1',null])noop('lesson',invalid);
for(let lesson=0;lesson<4;lesson++){
 change('lesson',lesson);const spoken=magpiePicturesNarration(work);
 assert.ok(spoken.includes(magpieLessons[lesson].text));
 for(const image of magpieLessons[lesson].images)assert.ok(spoken.includes(magpieArtDescriptions[image]));
 for(const card of magpieLessons.filter((_,i)=>i!==lesson))assert.ok(!spoken.includes(card.text));
 for(const s of magpieScenes)assert.ok(!spoken.includes(s.meaning));
}
assert.deepEqual(work.ideas,partySnapshot.ideas);assert.deepEqual(work.references,partySnapshot.references);

change('page','sort');
for(const action of ['scene','idea','clear-idea','reference','lesson'])noop(action,1);
for(const invalid of [-1,6,0.2,'1',null])noop('sort',invalid);
for(const invalid of ['other',null,0,'unsure'])noop('tray',invalid);
for(let sort=0;sort<6;sort++){
 change('sort',sort);const card=magpieSortCards[sort];
 const closed=magpiePicturesNarration(work);
 assert.ok(closed.includes(card.context));assert.ok(closed.includes(card.quote));
 assert.equal(magpiePicturesModel(work).sortReference,null);
 for(const other of magpieSortCards)assert.ok(!closed.includes(other.reason));
 const unexpected=card.reference==='literal'?'figurative':'literal';
 change('tray',unexpected);noop('tray',unexpected);
 change('sort-reference');assert.equal(work.trays[sort],unexpected);
 assert.deepEqual(magpiePicturesModel(work).sortReference,{type:card.reference,reason:card.reason,image:card.image});
 assert.ok(magpiePicturesNarration(work).includes(card.reason));
 change('sort-reference');assert.equal(work.trays[sort],unexpected);assert.equal(magpiePicturesModel(work).sortReference,null);
}
assert.deepEqual(work.trays,['figurative','literal','literal','figurative','figurative','literal']);
change('sort',0);change('clear-tray');noop('clear-tray');assert.equal(work.trays[0],null);
change('page','party');assert.equal(work.scene,0);assert.equal(work.lesson,3);assert.equal(work.sort,0);
assert.deepEqual(work.ideas,partySnapshot.ideas);assert.deepEqual(work.references,partySnapshot.references);
for(const page of ['party','learn','sort']){
 change('page',page);const spoken=magpiePicturesNarration(work);
 assert.ok(spoken.includes('Back to Riddles'));assert.ok(spoken.includes(magpieCopy.lifetime));
 assert.ok(!/cake-food|cake-task|cat-news|cat-animal|ice-object|ice-talk|fitting choice|score|mastery|correct answer/i.test(spoken));
}

// A selected picture gets a pressed state, never an answer-specific class or attribute.
const attributes=tag=>Object.fromEntries([...tag.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(([,name,value])=>[name,value??'']));
const escapeText=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(let scene=0;scene<6;scene++){
 for(let idea=0;idea<3;idea++){
  let visit=changeMagpiePictures(createMagpiePictures(),'scene',scene);
  visit=changeMagpiePictures(visit,'idea',idea);
  const markup=magpiePicturesPage(visit),buttons=[...markup.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)]
   .map(([,tag,inside])=>({attrs:attributes(tag),inside}))
   .filter(({attrs})=>attrs['data-magpie-action']==='idea'&&/^[0-2]$/.test(attrs['data-magpie-value']));
  assert.equal(buttons.length,3);
  let common=null;
  for(let i=0;i<3;i++){
   const {attrs,inside}=buttons[i];
   assert.equal(attrs['aria-pressed'],String(idea===i));
   assert.ok(!Object.hasOwn(attrs,'disabled'),'ideas remain available after selection');
   assert.equal(attrs['data-magpie-value'],String(i),'authored order stays fixed');
   assert.ok(inside.includes(escapeText(magpieScenes[scene].choices[i].text)));
   assert.ok(inside.includes(`data-magpie-art="${magpieScenes[scene].choices[i].image}"`));
   assert.ok(inside.includes('aria-hidden="true"'),'thumbnail is decorative beside its caption');
   const neutral={...attrs};delete neutral['data-magpie-value'];delete neutral['aria-pressed'];
   if(common)assert.deepEqual(neutral,common,'all ideas have identical attributes except value and pressed state');
   common=neutral;
  }
  assert.ok(!/data-magpie-reference(?:[\s>])/.test(markup),'closed reference is absent');
  assert.ok(!markup.includes(escapeText(magpieScenes[scene].meaning)),'hidden prepared meaning is not rendered or voiced');
  assert.ok(!markup.includes(escapeText(magpieScenes[scene].clue)),'hidden prepared clue is not rendered or voiced');
  assert.ok(!/\b(?:data-[\w-]*(?:fit|correct|outcome|score)|class="[^"]*\b(?:correct|incorrect|fitting|wrong)\b)/i.test(markup),'no grading marker');
  const opened=changeMagpiePictures(visit,'reference');
  assert.equal(opened.ideas[scene],idea,'opening the reading retains every chosen idea');
  const revealed=magpiePicturesPage(opened);
  assert.ok(/data-magpie-reference(?:[\s>])/.test(revealed));
  assert.ok(revealed.includes(escapeText(magpieScenes[scene].meaning)));
  assert.ok(revealed.includes(escapeText(magpieScenes[scene].clue)));
  assert.equal(changeMagpiePictures(opened,'reference').ideas[scene],idea);
 }
}
console.log('Magpie Pictures finite content, immutable choices, separate references, neutral markup and visible-page narration checks passed');
