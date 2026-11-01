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
