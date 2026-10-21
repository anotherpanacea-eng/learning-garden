import assert from 'node:assert/strict';
import {bundleCases,bundleKinds,bundleUnits,bundlePages,bundleExample} from '../dist/bundle-exchange-content.mjs';
import * as B from '../dist/bundle-exchange-core.mjs';
const copy=x=>JSON.parse(JSON.stringify(x)),view=s=>B.bundleView(s),work=s=>view(s).work;
const checkValid=s=>assert.equal(B.validBundle(s.bundleExchange),true);
const make=id=>{const s={};B.chooseBundleCase(s,id);return s;};
const modelKey=m=>`${m.wrapped},${m.loose},${m.frame}`;
const actions=[
 ['move',s=>B.moveBundleCounter(s,1),m=>m.loose>0&&m.frame<10,m=>({wrapped:m.wrapped,loose:m.loose-1,frame:m.frame+1})],
 ['return',s=>B.moveBundleCounter(s,-1),m=>m.frame>0,m=>({wrapped:m.wrapped,loose:m.loose+1,frame:m.frame-1})],
 ['return-frame',B.returnBundleFrame,m=>m.frame>0,m=>({wrapped:m.wrapped,loose:m.loose+m.frame,frame:0})],
 ['wrap',B.wrapBundle,m=>m.frame===10,m=>({wrapped:m.wrapped+1,loose:m.loose,frame:0})],
 ['unwrap',B.unwrapBundle,m=>m.wrapped>0&&m.frame===0,m=>({wrapped:m.wrapped-1,loose:m.loose,frame:10})],
 ['count',B.countBundleTogether,m=>m.loose>0&&m.frame<10,m=>{const n=Math.min(m.loose,10-m.frame);return {wrapped:m.wrapped,loose:m.loose-n,frame:m.frame+n};}]
];
const absent={other:{kept:true}},original=copy(absent);B.bundleState(absent);B.bundleView(absent);B.bundleHistoryUnknown(absent);assert.equal(B.noteBundleExamples(absent,[]),false);assert.deepEqual(absent,original);
assert.equal(bundleCases.length,7);assert.equal(bundleKinds.length,4);assert.equal(bundleUnits.length,3);
let stateCount=0;
for(const c of bundleCases){
 const models=[];
 for(let wrapped=0;wrapped<=4;wrapped++)for(let frame=0;frame<=10;frame++){const loose=c.total-10*wrapped-frame;if(loose>=0&&loose<=42)models.push({wrapped,loose,frame});}
 stateCount+=models.length;
 const allKeys=new Set(models.map(modelKey));
 for(const m of models){
  const base=make(c.id);work(base).model=copy(m);checkValid(base);
  for(const [name,act,enabled,result] of actions){const s=copy(base),before=copy(s);assert.equal(act(s),enabled(m),`${c.id} ${modelKey(m)} ${name}`);if(!enabled(m))assert.deepEqual(s,before);else{assert.deepEqual(work(s).model,result(m));checkValid(s);}}
  const s=copy(base);B.rearrangeBundleTogether(s);assert.deepEqual(work(s).model,{wrapped:Math.floor(c.total/10),loose:c.total%10,frame:0});assert.equal(work(s).history.length,0);checkValid(s);
  // The same reversible graph reaches all-loose from each grouping.
  const back=copy(base);if(work(back).model.frame)B.returnBundleFrame(back);while(work(back).model.wrapped){B.unwrapBundle(back);B.returnBundleFrame(back);}assert.deepEqual(work(back).model,{wrapped:0,loose:c.total,frame:0});
 }
 // Enumerate reachability from all-loose using the actual native transitions.
 const start=make(c.id);work(start).model={wrapped:0,loose:c.total,frame:0};const reached=new Set([modelKey(work(start).model)]),pending=[start];
 while(pending.length){const s=pending.pop();for(const [,act] of actions){const next=copy(s);if(act(next)){const key=modelKey(work(next).model);if(!reached.has(key)){reached.add(key);pending.push(next);}}}}
 assert.deepEqual(reached,allKeys,c.id);
}
assert.equal(stateCount,158);
for(const raw of ['0','99',' 027 ','00000','000000000000000000000007'])assert.notEqual(B.parseBundleNumber(raw),null,raw);
for(const raw of ['',' ','100','117','-1','+1','1.0','.5','1e1','1 2','１','١','0x10','7\n2','0000000000000000000000000'])assert.equal(B.parseBundleNumber(raw),null,raw);
// Every available form separates numeric and unit outcomes for every finite collection.
for(const c of bundleCases)for(const kind of bundleKinds){
 const s=make(c.id),target=view(s).targets[kind];if(!target.available){assert.equal(B.checkBundle(s,kind),false);assert.equal(work(s).history.length,0);continue;}
 for(const numberMatches of [false,true])for(const unitMatches of [false,true]){
  B.setBundleText(s,kind,numberMatches?` 0${target.value} `:String((target.value+1)%100));B.setBundleUnit(s,kind,unitMatches?target.unit:bundleUnits.find(u=>u!==target.unit));B.checkBundle(s,kind);
  assert.deepEqual(view(s).feedback[kind].outcomes,{numberMatches,unitMatches});assert.equal(view(s).feedback[kind].practice,true);checkValid(s);
 }
}
const s=make('twenty-seven');
for(const m of [{wrapped:2,loose:7,frame:0},{wrapped:1,loose:17,frame:0},{wrapped:1,loose:7,frame:10},{wrapped:0,loose:27,frame:0}]){
 // New fixture avoids pretending synthetic edits were user operations.
 const t=make('twenty-seven');work(t).model=m;assert.equal(view(t).targets['wrapped-count'].value,m.wrapped);assert.equal(view(t).targets['total-count'].value,27);assert.equal(view(t).targets['tens-digit'].value,2);assert.equal(view(t).targets['tens-value'].value,20);B.keepBundle(t);checkValid(t);
}
B.setBundleText(s,'total-count','117');B.checkBundle(s,'total-count');assert.ok(work(s).errors['total-count']);assert.equal(work(s).history.length,0);B.setBundleText(s,'total-count','27');assert.equal(work(s).errors['total-count'],null);B.checkBundle(s,'total-count');
B.setBundleText(s,'wrapped-count','1');B.checkBundle(s,'wrapped-count');B.setBundleText(s,'tens-digit','20');B.checkBundle(s,'tens-digit');assert.equal(view(s).feedback['tens-digit'].outcomes.numberMatches,false);B.setBundleText(s,'tens-value','2');B.checkBundle(s,'tens-value');assert.equal(view(s).feedback['tens-value'].outcomes.numberMatches,false);
const totalId=work(s).currentFeedback['total-count'];B.moveBundleCounter(s,1);assert.equal(work(s).currentFeedback['wrapped-count'],null);assert.equal(work(s).currentFeedback['total-count'],totalId);B.setBundleUnit(s,'tens-value','digit');assert.equal(work(s).currentFeedback['tens-value'],null);assert.equal(work(s).currentFeedback['total-count'],totalId);checkValid(s);
B.keepBundle(s);const frozenKeep=copy(work(s).kept),frozenHistory=copy(work(s).history);B.countBundleTogether(s);B.useBundleSupport(s,'narration');assert.deepEqual(work(s).kept,frozenKeep);assert.deepEqual(work(s).history,frozenHistory);assert.ok(work(s).support.includes('countedFill'));assert.ok(work(s).support.includes('together'));B.rearrangeBundleTogether(s);assert.equal(work(s).drafts['total-count'].text,'27');assert.deepEqual(work(s).kept,frozenKeep);checkValid(s);
// Full support snapshot precedes feedback, and repeat history survives cap trimming.
B.setBundleText(s,'tens-digit','2');B.checkBundle(s,'tens-digit');const last=work(s).history.at(-1);assert.ok(last.support.includes('suppliedArrangement'));assert.ok(last.support.includes('narration'));assert.equal(last.checkedPreviously,true);
for(let i=0;i<100;i++)B.checkBundle(s,'total-count');assert.equal(work(s).history.length,24);for(const kind of bundleKinds)assert.ok(work(s).history.some(h=>h.kind===kind));checkValid(s);
const raw=copy(s);B.setBundleText(s,'total-count',' malformed ');assert.equal(B.setBundleText(s,'total-count','x'.repeat(25)),false);B.chooseBundleCase(s,'empty');for(const page of bundlePages)assert.equal(B.setBundlePage(s,page),true);B.keepBundle(s);assert.equal(B.wrapBundle(s),false);assert.equal(B.checkBundle(s,'tens-digit'),false);B.chooseBundleCase(s,'twenty-seven');assert.equal(work(s).drafts['total-count'].text,' malformed ');assert.equal(work(s).familiar,true);checkValid(s);
// Visible digit/value explanations are sticky support before later checks, including case changes.
const digits=make('thirteen');B.setBundleText(digits,'total-count','13');B.checkBundle(digits,'total-count');const earlierDigitsCheck=copy(work(digits).history[0]);
assert.equal(work(digits).support.includes('digits'),false);B.setBundlePage(digits,'digits');assert.equal(work(digits).support.includes('digits'),true);assert.deepEqual(work(digits).history[0],earlierDigitsCheck);
B.checkBundle(digits,'total-count');assert.equal(work(digits).history.at(-1).support.includes('digits'),true);assert.equal(work(digits).history[0].support.includes('digits'),false);checkValid(digits);
B.chooseBundleCase(digits,'twenty-seven');assert.equal(work(digits).support.includes('digits'),true);assert.equal(work(digits).history.length,0);B.setBundleText(digits,'tens-digit','2');B.checkBundle(digits,'tens-digit');assert.equal(work(digits).history[0].support.includes('digits'),true);checkValid(digits);
B.chooseBundleCase(digits,'thirteen');assert.deepEqual(work(digits).history[0],earlierDigitsCheck);B.setBundlePage(digits,'read');assert.equal(work(digits).support.includes('digits'),true);checkValid(digits);
const forgedDigits=make('thirteen');B.setBundlePage(forgedDigits,'digits');work(forgedDigits).support=work(forgedDigits).support.filter(k=>k!=='digits');assert.equal(B.validBundle(forgedDigits.bundleExchange),false);
const seven=make('seven');B.countBundleTogether(seven);assert.deepEqual(work(seven).model,{wrapped:0,loose:0,frame:7});assert.equal(B.wrapBundle(seven),false);assert.equal(view(seven).targets['tens-digit'].available,false);assert.equal(view(seven).targets['tens-value'].value,0);checkValid(seven);
for(const c of ['twenty','thirty']){const z=make(c);B.rearrangeBundleTogether(z);assert.equal(work(z).model.loose,0);const total=view(z).targets['total-count'].value;B.unwrapBundle(z);assert.equal(view(z).targets['total-count'].value,total);checkValid(z);}
// Current wording corrections preserve historical wording while semantic changes fail.
const editorial=copy(raw);work(editorial).source.title='A revised title';work(editorial).source.request='Revised source request.';checkValid(editorial);assert.notEqual(work(editorial).history[0].source.title,work(editorial).source.title);
const badMutations=[
 w=>w.source.total=28,w=>w.model.frame=11,w=>w.model.loose++,w=>w.drafts['total-count'].unit='ones',w=>w.drafts['total-count'].text='x'.repeat(25),
 w=>w.history.at(-1).outcomes.numberMatches=false,w=>w.history.at(-1).target.value=99,w=>w.history.at(-1).practice=false,w=>w.history.at(-1).priorExposureUnknown=true,
 w=>w.history.at(-1).support.push('invented'),w=>w.history.at(-1).support=w.history.at(-1).support.filter(x=>x!=='narration'),w=>w.history.at(-1).checkedPreviously=false,
 w=>w.currentFeedback['total-count']=w.history.find(h=>h.kind==='total-count').id,w=>w.kept.outcomes['total-count'].numberMatches=false,w=>w.unexpected=true
];
for(const mutate of badMutations){const bad=copy(raw);mutate(work(bad));assert.equal(B.validBundle(bad.bundleExchange),false);assert.equal(B.bundleState(bad),null);}
const first=make('thirteen');B.setBundleText(first,'total-count','13');B.checkBundle(first,'total-count');const forged=copy(first);const forgedWork=work(forged);forgedWork.history[0].checkedPreviously=true;forgedWork.history[0].support.push('feedback:total-count');assert.equal(B.validBundle(forged.bundleExchange),false);
const selector=copy(first);work(selector).drafts['total-count'].text='12';assert.equal(B.validBundle(selector.bundleExchange),false);
const example=make('thirteen'),before=copy(work(example).model);for(let i=0;i<5;i++)B.stepBundleExample(example);assert.equal(work(example).exampleStep,3);assert.deepEqual(work(example).model,before);assert.equal(work(example).history.length,0);assert.equal(bundleExample.total,16);for(const step of bundleExample.steps)assert.equal(10*step.wrapped+step.loose+step.frame,16);checkValid(example);
for(const signature of B.knownBundleSignatures){assert.equal(B.noteBundleExamples(example,[signature]),true);assert.equal(B.noteBundleExamples(example,[signature]),false);}assert.equal(example.bundleExchange.shownBundleExamples.length,6);
for(const signatures of [['bundle:0:0:7'],['bundle:0:1:17'],['bundle:0:2:7','bundle:0:2:7'],['bundle:1:0:0'],['unknown']]){const before=copy(example);assert.equal(B.noteBundleExamples(example,signatures),false);assert.deepEqual(example,before);}
assert.equal(B.bundleSignature(2,7), 'bundle:0:2:7');assert.equal(B.bundleSignature(1,17),null);assert.equal(B.bundleSignature(1,7,10),null);assert.equal(B.bundleSignature(0,7),null);
for(const sigs of [['bundle:0:2:7','bundle:0:2:7'],['unknown']]){const bad=copy(example);bad.bundleExchange.shownBundleExamples=sigs;assert.equal(B.validBundle(bad.bundleExchange),false);}
const recovered={bundleExchange:{version:8,raw:'<unknown>',shownBundleExamples:['unknown']}};const recoveredRaw=copy(recovered.bundleExchange);assert.equal(B.bundleHistoryUnknown(recovered),true);assert.equal(B.recoverBundle(recovered),true);assert.deepEqual(recovered.bundleExchange.recovered,recoveredRaw);assert.equal(B.bundleHistoryUnknown(recovered),true);B.setBundleText(recovered,'total-count','13');B.checkBundle(recovered,'total-count');B.keepBundle(recovered);for(let i=0;i<40;i++)B.checkBundle(recovered,'total-count');checkValid(recovered);assert.ok(work(recovered).history.every(h=>h.priorExposureUnknown));assert.equal(work(recovered).kept.priorExposureUnknown,true);assert.deepEqual(recovered.bundleExchange.recovered,recoveredRaw);
console.log('Bundle Exchange checks passed: all 158 conserved models and action boundaries/reachability; four independent forms, units, syntax, frozen support/history/keeps, exact examples and recovery.');
