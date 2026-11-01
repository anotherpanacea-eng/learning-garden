import assert from 'node:assert/strict';
import {createSoundTrails,changeSoundTrail,soundTrailReference,soundTrailCounterLine} from '../dist/word-room-trails-content.mjs';
import {soundTrailPage} from '../dist/word-room-trails-ui.mjs';
// Independent phoneme and index expectations from the reviewed finite inventory.
const expected={fox:{sounds:['f','ɑ','k','s'],groups:[[[0],[0]],[[1],[1]],[[2],[2,3]]]},fog:{sounds:['f','ɑ or ɔ','g'],groups:[[[0],[0]],[[1],[1]],[[2],[2]]]},kit:{sounds:['k','ɪ','t'],groups:[[[0],[0]],[[1],[1]],[[2],[2]]]},quit:{sounds:['k','w','ɪ','t'],groups:[[[0,1],[0,1]],[[2],[2]],[[3],[3]]]},mix:{sounds:['m','ɪ','k','s'],groups:[[[0],[0]],[[1],[1]],[[2],[2,3]]]},quiz:{sounds:['k','w','ɪ','z'],groups:[[[0,1],[0,1]],[[2],[2]],[[3],[3]]]}};
let v=createSoundTrails();const original=structuredClone(v);
assert.deepEqual(Object.keys(v.work),Object.keys(expected));
for(const[id,e]of Object.entries(expected)){
 const w=v.source.words[id];assert.deepEqual(w.phonemes,e.sounds);
 assert.deepEqual(w.groups.map(g=>[g.letters,g.sounds]),e.groups);
 assert.equal(w.frames.length,5);
 for(let frame=0;frame<5;frame++){
  const r=soundTrailReference(v,id,frame),groups=frame===4?e.groups:frame?[e.groups[frame-1]]:[];
  assert.deepEqual(r.letters,groups.flatMap(g=>g[0]));assert.deepEqual(r.sounds,groups.flatMap(g=>g[1]));
 }
 const selected=changeSoundTrail(v,'word',id),html=soundTrailPage(selected);
 assert.ok(html.includes(w.meaning));assert.ok(html.includes('aria-label="'+w.alt+'"'));
 assert.equal(html.includes('class="wrt-map"'),!['mix','quiz'].includes(id));
}
v=changeSoundTrail(v,'try');assert.equal(changeSoundTrail(v,'counter',-1),null);
for(let i=1;i<=6;i++){v=changeSoundTrail(v,'counter',1);assert.equal(v.work.fox.count,i);}
assert.equal(changeSoundTrail(v,'counter',1),null);assert.deepEqual(original,createSoundTrails());
v=changeSoundTrail(v,'model');assert.equal(changeSoundTrail(v,'counter',-1),null);assert.equal(changeSoundTrail(v,'step',-1),null);
for(let i=1;i<=4;i++){v=changeSoundTrail(v,'step',1);assert.equal(v.work.fox.frame,i);}
assert.equal(changeSoundTrail(v,'step',1),null);
v=changeSoundTrail(v,'compare');assert.ok(soundTrailPage(v).includes('fox and fog'));assert.equal(changeSoundTrail(v,'counter',1),null);
v=changeSoundTrail(v,'back');assert.equal(v.work.fox.count,6);assert.equal(v.work.fox.frame,4);
v=changeSoundTrail(v,'word','mix');assert.equal(changeSoundTrail(v,'compare'),null);assert.equal(v.work.mix.tool,'try');
v=changeSoundTrail(v,'counter',1);v=changeSoundTrail(v,'word','fox');assert.equal(v.work.fox.count,6);v=changeSoundTrail(v,'word','mix');assert.equal(v.work.mix.count,1);
assert.equal(changeSoundTrail(v,'word','unknown'),null);assert.equal(changeSoundTrail(v,'counter',2),null);
assert.equal(soundTrailCounterLine(1),'You placed 1 counter.');assert.equal(soundTrailCounterLine(0),'You placed 0 counters.');
// These inspect rendered semantics, not the renderer's source spelling.
const selectedMap=html=>({letters:[...html.matchAll(/<g role="img" aria-label="Letter ([^"]+)"><rect class="wrt-print wrt-selected"/g)].map(m=>m[1]),sounds:[...html.matchAll(/<g role="img" aria-label="Sound (\d)"><circle class="wrt-sound wrt-selected"/g)].map(m=>Number(m[1]))});
for(const[id,frames]of Object.entries({fox:[{letters:['f'],sounds:[1]},{letters:['o'],sounds:[2]},{letters:['x'],sounds:[3,4]}],quit:[{letters:['q','u'],sounds:[1,2]},{letters:['i'],sounds:[3]},{letters:['t'],sounds:[4]}]})){
 let t=changeSoundTrail(createSoundTrails(),'word',id);
 for(const e of frames){t=changeSoundTrail(t,'step',1);assert.deepEqual(selectedMap(soundTrailPage(t)),e);}
}
for(const[id,desc]of Object.entries({fox:'Letter f goes with Sound 1. Letter o goes with Sound 2. Letter x goes with Sound 3 and Sound 4.',quit:'Letters q and u go with Sound 1 and Sound 2. Letter i goes with Sound 3. Letter t goes with Sound 4.',quiz:'Letters q and u go with Sound 1 and Sound 2. Letter i goes with Sound 3. Letter z goes with Sound 4.'})){
 let t=changeSoundTrail(createSoundTrails(),'word',id);t=changeSoundTrail(t,'model');const html=soundTrailPage(t);assert.ok(html.includes('>'+desc+'</desc>'));
 const visible=html.slice(0,html.indexOf('<details class="wrt-grownups"'));assert.ok(!/[ɑɪɔ]|\/kw|\/fɑ/.test(visible));
}
for(const[id,expected]of Object.entries({fox:{letters:['x','f','o','g'],sounds:[3,4,1,2,3]},quit:{letters:['k','i','t','q','u'],sounds:[1,2,3,1,2]}})){
 let t=changeSoundTrail(createSoundTrails(),'word',id);t=changeSoundTrail(t,'compare');assert.deepEqual(selectedMap(soundTrailPage(t)),expected);
}
let t=changeSoundTrail(createSoundTrails(),'try');t=changeSoundTrail(t,'counter',1);const html=soundTrailPage(t);
assert.ok(html.includes('class="wrt-counter" role="img" aria-label="Counter 1"'));assert.ok(!html.includes('aria-label="Sound '));
assert.match(html,/<p id="wr-status"[^>]*><\/p>/,'announcement region starts empty so host can fill it after redraw');
console.log('Sound trails: finite mapping, rendering, counter/model boundaries and visit-state isolation passed.');

// Spec353 independent reference inventory; do not use the source factory as its own oracle.
const vowelOracle={cap:['k','æ','p'],cape:['k','eɪ','p'],kit:['k','ɪ','t'],kite:['k','aɪ','t'],pin:['p','ɪ','n'],pine:['p','aɪ','n']};
let vowels=createSoundTrails('vowels');const vowelBefore=structuredClone(vowels);
assert.deepEqual(Object.keys(vowels.work),Object.keys(vowelOracle));assert.equal(vowels.selected,'cap');
assert.deepEqual(vowels.source.guide,{});assert.equal(vowels.source.grownup,createSoundTrails().source.grownup);
assert.equal(createSoundTrails('unknown'),null);
for(const[id,sounds]of Object.entries(vowelOracle)){
 const w=vowels.source.words[id],groups=[[[0],[0]],[id.length===4?[1,3]:[1],[1]],[[2],[2]]];
 assert.equal(w.label,id);assert.deepEqual(w.letters,[...id]);assert.deepEqual(w.phonemes,sounds);assert.deepEqual(w.groups.map(g=>[g.letters,g.sounds]),groups);
 assert.equal(w.frames.length,5);assert.equal(vowels.work[id].tool,['pin','pine'].includes(id)?'try':'model');
 for(let frame=0;frame<5;frame++){
  const r=soundTrailReference(vowels,id,frame),active=frame===4?groups:frame?[groups[frame-1]]:[];
  assert.deepEqual(r.letters,active.flatMap(g=>g[0]));assert.deepEqual(r.sounds,active.flatMap(g=>g[1]));
 }
 let state=changeSoundTrail(vowels,'word',id);state=changeSoundTrail(state,'try');assert.equal(changeSoundTrail(state,'counter',-1),null);
 for(let n=1;n<=6;n++){state=changeSoundTrail(state,'counter',1);assert.equal(state.work[id].count,n);}
 assert.equal(changeSoundTrail(state,'counter',1),null);state=changeSoundTrail(state,'model');assert.equal(state.work[id].count,6);
 for(let n=1;n<=4;n++)state=changeSoundTrail(state,'step',1);assert.equal(changeSoundTrail(state,'step',1),null);
 const comparison=changeSoundTrail(state,'compare');assert.equal(comparison.work[id].count,6);assert.deepEqual(changeSoundTrail(comparison,'back').work,state.work);
 const text=soundTrailPage(state);assert.ok(text.includes((id.length===4?'Letters '+id[1]+' and e go':'Letter '+id[1]+' goes')+' with Sound 2.'));
 assert.equal((text.match(/class="wrt-sound wrt-selected"/g)||[]).length,3);assert.ok(text.includes(w.meaning));
 if(id.length===4){assert.equal((text.match(/class="wrt-crossing-gap"/g)||[]).length,1);state.work[id].frame=2;const r=soundTrailReference(state);assert.deepEqual(r.letters,[1,3]);assert.deepEqual(r.sounds,[1]);}
}
for(const[a,b]of[['cap','cape'],['kit','kite'],['pin','pine']]){
 const pair=Object.values(vowels.source.pairs).find(p=>p.ids[0]===a);assert.deepEqual(pair.ids,[a,b]);assert.deepEqual(pair.highlight,{[a]:1,[b]:1});
 assert.equal(vowelOracle[a][0],vowelOracle[b][0]);assert.equal(vowelOracle[a][2],vowelOracle[b][2]);assert.notEqual(vowelOracle[a][1],vowelOracle[b][1]);
}
let oldKit=changeSoundTrail(createSoundTrails(),'word','kit');oldKit=changeSoundTrail(oldKit,'try');oldKit=changeSoundTrail(oldKit,'counter',1);
let newKit=changeSoundTrail(vowels,'word','kit');newKit=changeSoundTrail(newKit,'step',1);assert.equal(oldKit.work.kit.count,1);assert.equal(oldKit.work.kit.frame,0);assert.equal(newKit.work.kit.count,0);assert.equal(newKit.work.kit.frame,1);
assert.deepEqual(vowels,vowelBefore);const separate=createSoundTrails('vowels');separate.source.words.cape.phonemes[1]='changed';assert.deepEqual(vowels.source.words.cape.phonemes,['k','eɪ','p']);
assert.deepEqual(vowels.source.note.text.match(/[A-Za-z]+/g).map(x=>x.toLowerCase()).sort(),['a','a','a','a','a','a','and','and','by','cap','cape','kit','kite','pin','pine'].sort());
console.log('Final e: six literal three-phoneme maps, thirty frames, nonadjacent grouping, three vowel contrasts, bounds, visit copies and independent kit work passed.');

// Spec354: independent six-word context/phoneme inventory, not source-derived expectations.
const sentenceOracle={
 have:{label:'have',display:'have',sounds:['h','æ','v'],context:'We have a cape.',groups:[[[0],[0]],[[1],[1]],[[2,3],[2]]]},
 cave:{label:'cave',display:'cave',sounds:['k','eɪ','v'],context:'The puppet waits by a cave.',groups:[[[0],[0]],[[1,3],[1]],[[2],[2]]]},
 give:{label:'give',display:'give',sounds:['g','ɪ','v'],context:'Please give the puppet a cape.',groups:[[[0],[0]],[[1],[1]],[[2,3],[2]]]},
 five:{label:'five',display:'five',sounds:['f','aɪ','v'],context:'There are five stars.',groups:[[[0],[0]],[[1,3],[1]],[[2],[2]]]},
 'live-here':{label:'live',display:'live here',sounds:['l','ɪ','v'],context:'The puppets live here by the river.',groups:[[[0],[0]],[[1],[1]],[[2,3],[2]]]},
 'live-show':{label:'live',display:'live show',sounds:['l','aɪ','v'],context:'We are watching a live show.',groups:[[[0],[0]],[[1,3],[1]],[[2],[2]]]}
};
const sentences=createSoundTrails('sentences'),sentenceBefore=structuredClone(sentences);
assert.deepEqual(Object.keys(sentences.work),Object.keys(sentenceOracle));assert.equal(sentences.selected,'have');
assert.deepEqual(sentences.source.guide,{});assert.equal(sentences.source.grownup,original.source.grownup);
for(const[id,e]of Object.entries(sentenceOracle)){
 const w=sentences.source.words[id];assert.equal(w.id,id);assert.equal(w.label,e.label);assert.equal(w.displayLabel,e.display);assert.equal(w.context,e.context);
 assert.deepEqual(w.letters,[...e.label]);assert.deepEqual(w.phonemes,e.sounds);assert.equal(w.reference,'/'+e.sounds.join('')+'/');assert.deepEqual(w.groups.map(g=>[g.letters,g.sounds]),e.groups);assert.equal(w.frames.length,5);
 assert.equal(sentences.work[id].tool,id.startsWith('live-')?'try':'model');
 let state=changeSoundTrail(sentences,'word',id);state=changeSoundTrail(state,'model');
 for(let frame=0;frame<5;frame++){
  const active=frame===4?e.groups:frame?[e.groups[frame-1]]:[],r=soundTrailReference(state,id,frame);
  assert.deepEqual(r.letters,active.flatMap(g=>g[0]));assert.deepEqual(r.sounds,active.flatMap(g=>g[1]));
  const h=soundTrailPage(state);
  assert.deepEqual(selectedMap(h),{letters:active.flatMap(g=>g[0]).sort((a,b)=>a-b).map(i=>e.label[i]),sounds:active.flatMap(g=>g[1]).sort((a,b)=>a-b).map(i=>i+1)});
  assert.ok(h.includes('>'+e.context+'</p>'));assert.ok(h.includes('>'+w.frames[frame]+'</p>'));assert.ok(h.includes('aria-label="'+e.display+': Our sound model"'));
  if(frame<4)state=changeSoundTrail(state,'step',1);
 }
 assert.equal(changeSoundTrail(state,'step',1),null);state=changeSoundTrail(state,'try');assert.equal(changeSoundTrail(state,'counter',-1),null);
 for(let n=0;n<6;n++)state=changeSoundTrail(state,'counter',1);assert.equal(changeSoundTrail(state,'counter',1),null);
 const compared=changeSoundTrail(state,'compare');assert.deepEqual(changeSoundTrail(compared,'back'),state);
}
for(const[a,b]of[['have','cave'],['give','five'],['live-here','live-show']]){
 const pair=Object.values(sentences.source.pairs).find(p=>p.ids[0]===a);assert.deepEqual(pair.ids,[a,b]);assert.deepEqual(pair.highlight,{[a]:1,[b]:1});
 const h=soundTrailPage(changeSoundTrail(changeSoundTrail(sentences,'word',a),'compare'));
 assert.deepEqual(selectedMap(h),{letters:[a,b].flatMap(id=>sentenceOracle[id].groups[1][0].map(i=>sentenceOracle[id].label[i])),sounds:[2,2]});
 for(const id of[a,b]){assert.ok(h.includes('>'+sentenceOracle[id].display+'</h3>'));assert.ok(h.includes('>'+sentenceOracle[id].context+'</p>'));}
}
assert.equal(changeSoundTrail(sentences,'word','live'),null);assert.equal(changeSoundTrail(sentences,'word','__proto__'),null);
const sentenceCopy=createSoundTrails('sentences');sentenceCopy.source.words['live-here'].phonemes[1]='changed';assert.deepEqual(sentences,sentenceBefore);
assert.deepEqual(createSoundTrails(),original);assert.deepEqual(createSoundTrails('vowels'),vowelBefore);
assert.deepEqual(sentences.source.note.text.match(/[A-Za-z]+/g).map(x=>x.toLowerCase()),['we','have','five','stars','please','give','them','to','the','puppets','they','live','by','the','cave','tonight','is','a','live','show']);
const noteHtml=soundTrailPage(sentences);assert.ok(noteHtml.includes('<p>We have five stars. Please give them to the puppets.</p><p>They live by the cave. Tonight is a live show.</p>'));
console.log('Words in sentences: six context/phoneme maps, thirty rendered frames, three comparisons, same-print live separation, bounds, source copies and shared-note paragraphs passed.');

// Spec355: literal phoneme expectations independent of the production source.
const longOOracle={not:['n','ɑ','t'],note:['n','oʊ','t'],hop:['h','ɑ','p'],hope:['h','oʊ','p'],rod:['r','ɑ','d'],rode:['r','oʊ','d']};
const longO=createSoundTrails('long-o'),longOBefore=structuredClone(longO);
assert.deepEqual(Object.keys(longO.work),Object.keys(longOOracle));assert.equal(longO.selected,'not');assert.equal(longO.source.grownup,original.source.grownup);assert.deepEqual(longO.source.guide,{});
for(const[id,sounds]of Object.entries(longOOracle)){
 const w=longO.source.words[id],groups=[[[0],[0]],[id.length===4?[1,3]:[1],[1]],[[2],[2]]];
 assert.equal(w.label,id);assert.deepEqual(w.letters,[...id]);assert.deepEqual(w.phonemes,sounds);assert.equal(w.reference,'/'+sounds.join('')+'/');assert.deepEqual(w.groups.map(g=>[g.letters,g.sounds]),groups);assert.equal(w.frames.length,5);
 assert.equal(longO.work[id].tool,['rod','rode'].includes(id)?'try':'model');
 let state=changeSoundTrail(changeSoundTrail(longO,'word',id),'model');
 for(let frame=0;frame<5;frame++){
  const active=frame===4?groups:frame?[groups[frame-1]]:[],r=soundTrailReference(state,id,frame),h=soundTrailPage(state);
  assert.deepEqual(r.letters,active.flatMap(g=>g[0]));assert.deepEqual(r.sounds,active.flatMap(g=>g[1]));
  assert.deepEqual(selectedMap(h),{letters:active.flatMap(g=>g[0]).sort((a,b)=>a-b).map(i=>id[i]),sounds:active.flatMap(g=>g[1]).map(i=>i+1)});
  assert.ok(h.includes('>'+w.context+'</p>'),'context stays with the actual task');
  if(frame<4)state=changeSoundTrail(state,'step',1);
 }
 const compared=changeSoundTrail(state,'compare');assert.deepEqual(changeSoundTrail(compared,'back'),state);
}
for(const[a,b]of[['not','note'],['hop','hope'],['rod','rode']]){
 const p=Object.values(longO.source.pairs).find(p=>p.ids[0]===a);assert.deepEqual(p.ids,[a,b]);assert.deepEqual(p.highlight,{[a]:1,[b]:1});
 const h=soundTrailPage(changeSoundTrail(changeSoundTrail(longO,'word',a),'compare'));assert.deepEqual(selectedMap(h),{letters:['o','o','e'],sounds:[2,2]});
}
let rod=changeSoundTrail(longO,'word','rod');rod=changeSoundTrail(rod,'counter',1);rod=changeSoundTrail(rod,'word','rode');assert.equal(rod.work.rode.count,0);assert.equal(rod.work.rod.count,1);
assert.deepEqual(longO,longOBefore);const longOCopy=createSoundTrails('long-o');longOCopy.source.words.note.phonemes[1]='changed';assert.deepEqual(longO,longOBefore);
assert.deepEqual(createSoundTrails(),original);assert.deepEqual(createSoundTrails('vowels'),vowelBefore);assert.deepEqual(createSoundTrails('sentences'),sentenceBefore);
assert.deepEqual(longO.source.note.text.match(/[A-Za-z]+/g).map(x=>x.toLowerCase()),['do','not','hop','by','the','rod','a','note','says','we','rode','home','we','hope','to','rest']);
console.log('Long o: six reference maps, thirty rendered frames, vowel comparisons, independent rod/rode work, source copies and shared-note word sequence passed.');

// Spec356: independently enumerated printed positions, with no supplied phoneme count.
const uGroups={tub:[[0],[1],[2]],tube:[[0],[1,3],[2]],cub:[[0],[1],[2]],cube:[[0],[1,3],[2]],cut:[[0],[1],[2]],cute:[[0],[1,3],[2]]};
const longU=createSoundTrails('long-u'),uBefore=structuredClone(longU);
assert.equal(longU.source.kind,'spellings');assert.equal(longU.selected,'tub');assert.deepEqual(Object.keys(longU.work),Object.keys(uGroups));
for(const[id,groups]of Object.entries(uGroups)){
 const w=longU.source.words[id];assert.deepEqual(w.letters,[...id]);assert.deepEqual(w.spellingGroups,groups);
 assert.equal(Object.hasOwn(w,'phonemes'),false);assert.equal(Object.hasOwn(w,'groups'),false);assert.equal(w.frames.length,5);
 assert.equal(longU.work[id].tool,['cut','cute'].includes(id)?'try':'model');
 let state=changeSoundTrail(changeSoundTrail(longU,'word',id),'model');
 for(let frame=0;frame<5;frame++){
  assert.equal(soundTrailReference(state,id,frame),null,'spelling view never supplies a zero-sound reference');
  const h=soundTrailPage(state),active=frame===4?groups:frame?[groups[frame-1]]:[];
  assert.deepEqual(selectedMap(h),{letters:active.flat().sort((a,b)=>a-b).map(i=>id[i]),sounds:[]});
  assert.ok(h.includes('aria-label="'+id+': Our spelling pattern"'));assert.ok(!h.includes('aria-label="Sound '));
  assert.ok(h.includes(id.length===3?'Letter u has no final e with it in this spelling.':'Letters u and e go together in this spelling pattern.'));
  if(frame<4)state=changeSoundTrail(state,'step',1);
 }
 state=changeSoundTrail(state,'try');for(let n=0;n<6;n++)state=changeSoundTrail(state,'counter',1);
 assert.equal(changeSoundTrail(state,'counter',1),null);assert.deepEqual(changeSoundTrail(changeSoundTrail(state,'compare'),'back'),state);
 assert.equal(changeSoundTrail(state,'model').work[id].count,6);
}
for(const[a,b]of[['tub','tube'],['cub','cube'],['cut','cute']]){
 const state=changeSoundTrail(changeSoundTrail(longU,'word',a),'compare'),pair=Object.values(longU.source.pairs).find(p=>p.ids[0]===a);
 assert.deepEqual(pair.ids,[a,b]);assert.deepEqual(pair.highlight,{[a]:1,[b]:1});
 assert.deepEqual(selectedMap(soundTrailPage(state)),{letters:['u','u','e'],sounds:[]});
}
const uTokens=longU.source.note.text.match(/[A-Za-z]+/g).map(x=>x.toLowerCase());assert.equal(uTokens.length,20);
for(const word of Object.keys(uGroups))assert.equal(uTokens.filter(t=>t===word).length,1);
assert.deepEqual(uTokens.filter(t=>!Object.hasOwn(uGroups,t)).sort(),['put','a','by','the','our','looks','out','a','paper','flag','a','can','carry','water'].sort());
assert.equal(longU.source.words.cub.art,longU.source.words.cute.art);assert.notEqual(longU.source.words.cub.alt,longU.source.words.cute.alt);
const uCopy=createSoundTrails('long-u');uCopy.source.words.cube.spellingGroups[1].push(2);assert.deepEqual(longU,uBefore);
assert.deepEqual(createSoundTrails(),original);assert.deepEqual(createSoundTrails('vowels'),vowelBefore);assert.deepEqual(createSoundTrails('sentences'),sentenceBefore);assert.deepEqual(createSoundTrails('long-o'),longOBefore);
console.log('u/final e: six independent spelling groups, thirty rendered frames without reference sound counts, three comparisons, counters, source isolation and supported-note partition passed.');
