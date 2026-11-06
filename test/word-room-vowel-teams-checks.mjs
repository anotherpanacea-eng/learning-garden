// Independent finite phoneme/index expectations. These checks do not assess speech,
// decoding, or the teaching quality of the reviewed adult-led material.
import assert from 'node:assert/strict';
import {createSoundTrails,changeSoundTrail,soundTrailReference,soundTrailPair,TRAIL_GROWNUP} from '../dist/word-room-trails-content.mjs';
import {vowelTeamsMaterial} from '../dist/word-room-vowel-teams-content.mjs';
import {soundTrailPage} from '../dist/word-room-trails-ui.mjs';
const eq=assert.deepEqual,ok=assert.ok,copy=structuredClone;
const expected={
 seed:{letters:['s','e','e','d'],sounds:['s','i','d'],reference:'/sid/',try:false},
 feed:{letters:['f','e','e','d'],sounds:['f','i','d'],reference:'/fid/',try:false},
 meet:{letters:['m','e','e','t'],sounds:['m','i','t'],reference:'/mit/',try:false},
 meat:{letters:['m','e','a','t'],sounds:['m','i','t'],reference:'/mit/',try:false},
 bead:{letters:['b','e','a','d'],sounds:['b','i','d'],reference:'/bid/',try:true},
 head:{letters:['h','e','a','d'],sounds:['h','ɛ','d'],reference:'/hɛd/',try:true}
};
const frameLetters=[[],[0],[1,2],[3],[0,1,2,3]],frameSounds=[[],[0],[1],[2],[0,1,2]];
const earlier=Object.fromEntries(['sounds','vowels','sentences','long-o','long-u'].map(set=>[set,createSoundTrails(set)])),earlierCopies=copy(earlier);
const fresh=createSoundTrails('teams');eq(fresh.selected,'seed');eq(fresh.source.id,'teams');eq(fresh.compare,false);eq(fresh.source.grownup,TRAIL_GROWNUP);ok(!Object.hasOwn(fresh.source,'kind'));
eq(Object.keys(fresh.work),Object.keys(expected));
const selectedMap=html=>({letters:[...html.matchAll(/<g role="img" aria-label="Letter ([^"]+)"><rect class="wrt-print wrt-selected"/g)].map(m=>m[1]),sounds:[...html.matchAll(/<g role="img" aria-label="Sound (\d)"><circle class="wrt-sound wrt-selected"/g)].map(m=>Number(m[1]))});
for(const [id,e] of Object.entries(expected)){
 const word=fresh.source.words[id];eq(word.letters,e.letters);eq(word.phonemes,e.sounds);eq(word.reference,e.reference);
 eq(word.groups,[{letters:[0],sounds:[0]},{letters:[1,2],sounds:[1]},{letters:[3],sounds:[2]}]);
 eq(fresh.work[id],{count:0,frame:0,tool:e.try?'try':'model'});
 for(let frame=0;frame<=4;frame++){
  const r=soundTrailReference(fresh,id,frame);eq(r.letters,frameLetters[frame]);eq(r.sounds,frameSounds[frame]);
  const rendering=changeSoundTrail(changeSoundTrail(fresh,'word',id),'model');rendering.work[id].frame=frame;
  const html=soundTrailPage(rendering);eq(selectedMap(html),{letters:frameLetters[frame].map(n=>e.letters[n]),sounds:frameSounds[frame].map(n=>n+1)});
  eq((html.match(/aria-label="Sound [123]"/g)||[]).length,3,'ordinary phoneme map retains all three reference dots');
  ok(html.includes(`Letters ${id==='seed'||id==='feed'||id==='meet'?'e and e':'e and a'} go with Sound 2.`));
  const child=html.split('<details class="wrt-grownups">')[0];ok(!child.includes(e.reference),'IPA stays in the grown-up disclosure');
  ok(typeof word.frames[frame]==='string'&&word.frames[frame].trim(),'every selectable model frame has its own teaching');
 }
 let visit=changeSoundTrail(fresh,'word',id);visit=changeSoundTrail(visit,'try');eq(changeSoundTrail(visit,'counter',-1),null);
 for(let count=1;count<=6;count++){visit=changeSoundTrail(visit,'counter',1);eq(visit.work[id].count,count);}
 eq(changeSoundTrail(visit,'counter',1),null);eq(changeSoundTrail(visit,'counter',2),null);visit=changeSoundTrail(visit,'model');eq(changeSoundTrail(visit,'step',-1),null);
 for(let frame=1;frame<=4;frame++){visit=changeSoundTrail(visit,'step',1);eq(visit.work[id].frame,frame);}eq(changeSoundTrail(visit,'step',1),null);
 const before=copy(visit),comparison=changeSoundTrail(visit,'compare');ok(comparison);eq(changeSoundTrail(comparison,'counter',1),null);eq(changeSoundTrail(comparison,'step',1),null);eq(changeSoundTrail(comparison,'back'),before);
 const another=id==='head'?'seed':'head',switched=changeSoundTrail(visit,'word',another);eq(changeSoundTrail(switched,'word',id).work[id],before.work[id]);
 eq(Object.keys(visit.work).filter(k=>k!==id).map(k=>visit.work[k]),Object.keys(fresh.work).filter(k=>k!==id).map(k=>fresh.work[k]),'new work stays per-word');
}
for(const [a,b,changed,highlight] of [['seed','feed',[0],0],['meet','meat',[],1],['bead','head',[0,1],1]]){
 const v=changeSoundTrail(fresh,'word',a),pair=soundTrailPair(v);eq(pair.ids,[a,b]);eq(pair.highlight,{[a]:highlight,[b]:highlight});
 eq(fresh.source.words[a].phonemes.flatMap((sound,i)=>sound!==fresh.source.words[b].phonemes[i]?[i]:[]),changed);
 const other=soundTrailPair(changeSoundTrail(fresh,'word',b));eq(other,pair);
 const html=soundTrailPage(changeSoundTrail(v,'compare'));
 const selectedLetters=highlight===0?[expected[a].letters[0],expected[b].letters[0]]:[...expected[a].letters.slice(1,3),...expected[b].letters.slice(1,3)];
 eq(selectedMap(html),{letters:selectedLetters,sounds:[highlight+1,highlight+1]});
 ok(typeof fresh.source.copy.compare[a]==='string'&&fresh.source.copy.compare[a].trim());ok(typeof fresh.source.copy.compare[b]==='string'&&fresh.source.copy.compare[b].trim());
}
eq(fresh.source.words.meet.phonemes,fresh.source.words.meat.phonemes);assert.notDeepEqual(fresh.source.words.meet.letters,fresh.source.words.meat.letters);assert.notEqual(fresh.source.words.meet.meaning,fresh.source.words.meat.meaning);
eq(changeSoundTrail(fresh,'word','unknown'),null);eq(soundTrailReference(fresh,'seed',5),null);eq(createSoundTrails('unknown'),null);
// Each factory call owns detached material and per-word work; edits cannot change
// the installed material, an earlier set, or another new visit.
const isolated=createSoundTrails('teams');isolated.source.words.seed.phonemes[1]='changed';isolated.source.words.seed.groups[1].letters[0]=0;isolated.source.copy.compare.feed='changed';isolated.source.note.text='changed';isolated.work.seed.count=6;
eq(createSoundTrails('teams'),fresh);eq(vowelTeamsMaterial.words.seed.phonemes,['s','i','d']);eq(earlier,earlierCopies);
for(const [set,prior] of Object.entries(earlierCopies)){eq(createSoundTrails(set),prior);for(const id of Object.keys(prior.source.words))eq(soundTrailReference(createSoundTrails(set),id,2),soundTrailReference(prior,id,2));}
eq(createSoundTrails(),earlierCopies.sounds,'default set remains the original source');
const tokens=fresh.source.note.text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g),targets=Object.keys(expected);
for(const target of targets)eq(tokens.filter(t=>t===target).length,1);

console.log('ee/ea trails: six phoneme maps, visible grouping, pair contrasts, bounds, visit isolation and shared-reading partition passed.');
