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
console.log('Sound trails: finite mapping, rendering, counter/model boundaries and visit-state isolation passed.');
