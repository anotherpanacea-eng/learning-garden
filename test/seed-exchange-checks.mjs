import assert from 'node:assert/strict';
import {makeSeedSource} from '../dist/seed-exchange-content.mjs';
import {validSeedSource,validSeedModel,seedModel,seedFingerprint} from '../dist/seed-exchange-core.mjs';
let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
for(const family of ['apples','reed','nursery'])for(let k=1;k<=12;k++)for(let serial=1;serial<=6;serial++){
 const s=makeSeedSource(serial,{family,size:k}),before=JSON.stringify(s);
 ok(validSeedSource(s),'every generated source is bounded and reachable');
 ok(Object.isFrozen(s)&&Object.isFrozen(s.example),'source/example cannot mutate the catalog');
 ok(s.example.size!==k,'worked example uses a different size');
 for(let value=0;value<=12;value++){
  const m=seedModel(s,family==='nursery'?{partValue:value}:{groups:value});
  ok(m.fits===(value===k),'construction fits exactly its derived target');
  ok(m.left>=0&&m.shortage>=0,'no negative physical stock');
  if(family==='nursery'){
   ok(m.shares[0]===5*value&&m.shares[1]===3*value,'towns receive their own equal parts');
   ok(m.used+m.left-m.shortage===s.total,'seedling conservation includes shortage');
  }else{
   const cost=family==='apples'?3:2,received=family==='apples'?2:3;
   ok(m.received===received*value&&m.used===cost*value,'different units scale together');
   ok(m.used+m.left-m.shortage===s.stock,'trade stock conservation includes shortage');
   ok(m.fits===(s.stock>=m.used&&s.stock-m.used<cost),'fit independently equals maximal whole groups');
  }
 }
 ok(JSON.stringify(s)===before,'pure model reads preserve frozen source');
 const duplicate=structuredClone(s);duplicate.id='another-card';duplicate.prompt='A later authored prompt.';
 ok(seedFingerprint(s)===seedFingerprint(duplicate),'ids and prose do not make distinct quantity evidence');
}
const old=structuredClone(makeSeedSource(1,{family:'apples',size:6}));old.basketRate=4;old.reedRate=7;old.stock=26;
ok(validSeedSource(old),'readable old source need not match current rates');
const m=seedModel(old,{groups:6});ok(m.fits&&m.used===24&&m.received===42&&m.left===2,'old source drives the actual model');
const nursery=structuredClone(makeSeedSource(1,{family:'nursery',size:10}));nursery.parts=[2,1];nursery.total=30;
ok(validSeedSource(nursery),'old nursery shares can have different part counts');
ok(seedModel(nursery,{partValue:10}).shares.join(',')==='20,10','old nursery model retains its parts');
const bad=structuredClone(old);bad.basketRate=1;bad.stock=13;bad.size=12;
ok(!validSeedModel(bad),'unreachable historical stock remains unavailable');
nursery.total=40;ok(!validSeedModel(nursery),'nonintegral part value is unavailable');
for(const value of [-1,13,NaN,1.5,'1',null])ok(seedModel(old,{groups:value})===null,'invalid material value rejected');
for(const serial of [0,-1,999999999,NaN,1.5])ok(makeSeedSource(serial)===null,'unsafe creation serial rejected');
ok(makeSeedSource(1,{family:'other'})===null,'unknown current family cannot create');
ok(makeSeedSource(1,{size:13})===null,'current size stays within controls');
console.log(`Seed exchange source/model: ${checks} checks passed. Notebook/controller/browser layers remain under construction.`);
