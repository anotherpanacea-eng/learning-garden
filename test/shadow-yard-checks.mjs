import assert from 'node:assert/strict';
import {initialShadowYard,changeShadowYard,shadowYardModel,shadowYardPairs,shadowYardNarration} from '../dist/shadow-yard-core.mjs';
import {shadowCase} from '../dist/shadow-yard-content.mjs';
const clone=x=>structuredClone(x);
const tasks=[['flagpost',1,2,6,3],['courtyard',2,3,9,6],['bridge',3,2,5,7.5],['garden',4,6,3,2],['moments',2,3,9,null],['overhead',1,0,0,null]];
const work=(id,n,compare=true)=>({caseId:id,drafts:{[id]:{heightHalf:n,compare}},view:'build',step:0});
const gcd=(a,b)=>b?gcd(b,a%b):a;
const frac=(a,b)=>{const g=gcd(a,b);return b/g===1?`${a/g}`:`${a/g}/${b/g}`;};
for(const [id,A,B,C,answer] of tasks){
 for(const n of [null,...Array.from({length:48},(_,i)=>i+1)]){
  const w=work(id,n),before=JSON.stringify(w),m=shadowYardModel(w),h=n===null?null:n/2;
  assert.deepEqual([m.source.A,m.source.B,m.source.C],[A,B,C]);assert.equal(m.height,h);
  const expected=id==='moments'?'unestablished':id==='overhead'?'zero':n===null?'incomplete':h===answer?'match':'different';
  assert.equal(m.result,expected,`${id} ${n}`);
  assert.deepEqual(m.picture,{A,B,C,h,example:false,scale:Math.min(190/Math.max(A,h||A),200/Math.max(B,C,1))});
  if(answer!==null&&n!==null){
   assert.deepEqual(m.ratioLines,[`Height/shadow: ${A}/${B} = ${frac(A,B)}.`,`Height/shadow: ${h}/${C} = ${frac(n,2*C)}.`]);
   const products=[[A,C],[h,B]];
   assert.deepEqual(m.productLines,products.map(([a,b])=>`${a} × ${b} = ${a*b} square ${a*b===1?'meter':'meters'}.`));
   const expectedPairs=products.filter(p=>p.every(v=>Number.isInteger(v)&&v>=1&&v<=12));
   assert.deepEqual(shadowYardPairs(w),expectedPairs);
   const speech=shadowYardNarration(w);for(const text of [...m.ratioLines,...m.productLines])assert.ok(speech.includes(text));
  }else{assert.deepEqual(m.ratioLines,[]);assert.deepEqual(m.productLines,[]);assert.deepEqual(shadowYardPairs(w),[]);}
  const pre=work(id,n,false),pm=shadowYardModel(pre);assert.equal(pm.result,null);assert.deepEqual(pm.ratioLines,[]);assert.deepEqual(pm.productLines,[]);assert.deepEqual(shadowYardPairs(pre),[]);assert.ok(!shadowYardNarration(pre).includes(' × '));
  assert.equal(JSON.stringify(w),before);
 }
}
// All help steps expose only elected material, with example solution first at index2.
for(const view of ['teaching','example'])for(let step=0;step<4;step++){
 const w={...work('bridge',15),view,step},m=shadowYardModel(w),speech=shadowYardNarration(w);
 assert.deepEqual(m.ratioLines,[]);assert.deepEqual(m.productLines,[]);assert.ok(speech.includes(m.help.text));assert.ok(speech.includes(`Step ${step+1} of 4.`));assert.ok(!speech.includes('independent mastery'));
 assert.ok(!speech.includes('3 × 5 = 15'));
 assert.deepEqual(shadowYardPairs(w),view==='example'&&step>=2?[[3,6]]:[]);
 if(view==='example'){assert.equal(m.picture.h,step>=2?4.5:null);assert.equal(m.picture.example,true);if(step<2)assert.ok(!speech.includes('4.5'));}
 else assert.equal(m.picture,null);
 const empty={...w,drafts:{}};assert.equal(shadowYardModel(empty).waiting,'');assert.ok(!shadowYardNarration(empty).includes('Your proposal waits'));
}
// Transitions retain per-case proposals, compare and elected help state independently.
let w=initialShadowYard();assert.deepEqual(w,{caseId:'flagpost',drafts:{},view:'build',step:0});
for(const a of ['less','more','clear','build'])assert.equal(changeShadowYard(w,a),null);
w=changeShadowYard(w,'compare');assert.equal(shadowYardModel(w).result,'incomplete');assert.equal(changeShadowYard(w,'clear'),null);
w=changeShadowYard(w,'choose');assert.deepEqual(w.drafts.flagpost,{heightHalf:2,compare:false});
assert.equal(changeShadowYard(w,'choose'),null);w=changeShadowYard(w,'more');w=changeShadowYard(w,'compare');
const kept=clone(w);w=changeShadowYard(w,'case','bridge');assert.equal(shadowYardModel(w).height,null);w=changeShadowYard(w,'choose');w=changeShadowYard(w,'case','flagpost');assert.deepEqual(w.drafts.flagpost,kept.drafts.flagpost);
w=changeShadowYard(w,'teaching');w=changeShadowYard(w,'step',3);assert.equal(changeShadowYard(w,'teaching'),null);
for(const a of ['case','choose','less','more','clear','compare'])assert.equal(changeShadowYard(w,a,'bridge'),null);
w=changeShadowYard(w,'example');assert.equal(w.step,0);w=changeShadowYard(w,'build');assert.equal(w.step,0);assert.deepEqual(w.drafts.flagpost,kept.drafts.flagpost);
assert.equal(changeShadowYard(work('flagpost',1),'less'),null);assert.equal(changeShadowYard(work('flagpost',48),'more'),null);
assert.equal(changeShadowYard(w,'step',1),null);assert.equal(changeShadowYard(w,'case','flagpost'),null);assert.equal(changeShadowYard(w,'case','unknown'),null);assert.equal(changeShadowYard(w,'nonsense'),null);
const cleared=changeShadowYard(w,'clear');assert.deepEqual(cleared.drafts.flagpost,{heightHalf:null,compare:false});assert.equal(w.drafts.flagpost.compare,true);
// Returned structures and source cases do not share state with callers or the module.
const m=shadowYardModel(w);m.source.A=99;m.draft.heightHalf=48;m.picture.A=99;assert.equal(shadowYardModel(w).source.A,1);assert.equal(shadowCase('flagpost').A,1);assert.equal(w.drafts.flagpost.heightHalf,3);
const selected=changeShadowYard(w,'case','bridge');selected.drafts.flagpost.heightHalf=48;assert.equal(w.drafts.flagpost.heightHalf,3);
const invalid=[null,[],{},42,'work',Object.create(w),{...w,extra:1},{...w,caseId:'unknown'},{...w,view:'bad'},{...w,step:1},{...w,step:NaN},{...w,drafts:[]},{...w,drafts:{unknown:{heightHalf:1,compare:false}}},{...w,drafts:Object.create({flagpost:{heightHalf:1,compare:false}})}];
for(const heightHalf of [0,49,1.5,NaN,Infinity,undefined,'2'])invalid.push({...w,drafts:{flagpost:{heightHalf,compare:false}}});
for(const d of [null,[],{},Object.create({heightHalf:1,compare:false}),{heightHalf:1,compare:0},{heightHalf:1,compare:false,extra:1}])invalid.push({...w,drafts:{flagpost:d}});
const getter={...w};Object.defineProperty(getter,'caseId',{get(){throw Error('unexpected getter');},enumerable:true});invalid.push(getter);
for(const bad of invalid){assert.equal(shadowYardModel(bad),null);assert.equal(shadowYardPairs(bad),null);assert.equal(shadowYardNarration(bad),null);assert.equal(changeShadowYard(bad,'choose'),null);}
for(const bad of [-1,4,1.5,NaN,'1',null])assert.equal(changeShadowYard({...w,view:'teaching'},'step',bad),null);
for(const [id]of tasks)for(let n=1;n<=48;n++){const pairs=shadowYardPairs(work(id,n));assert.equal(new Set(pairs.map(p=>p.join('x'))).size,pairs.length);}
console.log('Shadow Yard core: 294 proposal/condition states, pre-Compare boundaries, help, transitions, strict validation and detached data passed.');
