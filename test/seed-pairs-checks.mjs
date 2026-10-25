import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as P from '../dist/seed-pairs-core.mjs';
import {pairSource,pairInputMessage} from '../dist/seed-pairs-content.mjs';
import {freshState,recommendations,restoreStateResult} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {noteGardenFactExposure} from '../dist/garden-core.mjs';
import {notePendingBrambleFactExposure} from '../dist/post-rival.mjs';
import {checkin} from '../dist/content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {startAdaptiveRival,setBrambleMode} from '../dist/post-rival.mjs';
import {generateRivalTask} from '../dist/post-rival-generator.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(x,m)=>{assert.ok(x,m);count++;},copy=x=>structuredClone(x);
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const exposure=app.slice(app.indexOf('function exposeStoryFacts('),app.indexOf('function requestParis('));
const expose=new Function('noteLegacyExposure','noteGardenFactExposure','notePendingBrambleFactExposure','checkin',exposure+';return exposeStoryFacts;')(noteLegacyExposure,noteGardenFactExposure,notePendingBrambleFactExposure,checkin);
const report=new Function('recommendations','explorerStore',app.split('\n').find(l=>l.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const options={exposeFacts:(pairs,s)=>expose({facts:pairs},null,s,true),canExport:s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok};
const make=()=>{const s=initializeExplorerState(freshState());ok(P.startPairs(s,options));return s;};
const root=s=>P.pairView(s).root,work=s=>P.pairView(s).work,current=s=>P.pairView(s).current;
const keyRaw=t=>t.kind==='choice'?[t.key]:t.key.map(String);
const source=pairSource();ok(P.validPairSource(source));eq(source.order.length,10);ok(Object.values(source.tasks).every(P.validPairTask));eq(source.tasks['path-ss'].wrong[0].key,[8,15]);eq(2/6+1/5,8/15);
// Enumerate physical ordered positions independently, including every supported
// composition. Count categories directly from marks, not model formula helpers.
for(let suns=0;suns<=6;suns++)for(const mode of ['keep','return']){
 const bag=[...Array(suns).fill('sun'),...Array(6-suns).fill('moon')],ordered={ss:0,sm:0,ms:0,mm:0};
 for(let first=0;first<6;first++)for(let second=0;second<6;second++){
  if(mode==='keep'&&first===second)continue;
  ordered[bag[first][0]+bag[second][0]]++;
 }
 const theory=P.pairTheory(bag,mode);eq(theory.paths,ordered);eq(theory.denominator,mode==='keep'?30:36);eq(theory.categories,{ss:ordered.ss,mixed:ordered.sm+ordered.ms,mm:ordered.mm});eq(Object.values(ordered).reduce((a,b)=>a+b,0),theory.denominator);
 if(mode==='keep'){eq(theory.expected,{ss:ordered.ss/2,mixed:(ordered.sm+ordered.ms)/2,mm:ordered.mm/2});eq(Object.values(theory.expected).reduce((a,b)=>a+b,0),15);}else eq(theory.expected,null);
 for(let first=0;first<6;first++){
  const remaining=P.pairRemaining(bag,mode,first),expect=[0,1,2,3,4,5].filter(i=>mode==='return'||i!==first);eq(remaining.indices,expect);eq(remaining.slots,expect.map(i=>bag[i]));eq(remaining.indices.length,mode==='keep'?5:6);
  const s=make();root(s).source.slots=copy(bag);ok(P.setPairMode(s,mode,options));ok(P.beginPairRun(s,mode,options));ok(P.choosePairPrediction(s,'ss',options));ok(P.drawPairFirst(s,first,options));eq(current(s).pending,first);const before=copy(s);ok(!P.choosePairPrediction(s,'mm',options));ok(!P.drawPairFirst(s,0,options));eq(s,before);
  for(let secondIndex=0;secondIndex<expect.length;secondIndex++){
   const t=copy(s);ok(P.drawPairSecond(t,secondIndex,options));eq(current(t).pairs,[{first,second:expect[secondIndex]}]);eq(current(t).pending,null);const tally=P.pairTallies(current(t),bag),code=bag[first]===bag[expect[secondIndex]]?(bag[first]==='sun'?'ss':'mm'):'mixed';eq(tally,{ss:code==='ss'?1:0,mixed:code==='mixed'?1:0,mm:code==='mm'?1:0,total:1});
  }
  const t=copy(s);ok(!P.drawPairSecond(t,expect.length,options));eq(t,s,'out-of-pool index refuses atomically');
 }
}
eq(P.pairTheory(source.slots,'keep').paths,{ss:2,sm:8,ms:8,mm:12});eq(P.pairTheory(source.slots,'return').paths,{ss:4,sm:8,ms:8,mm:16});
// Deliberate paths never create a random result, and all live arithmetic follows
// the frozen bag, including zero paths and omitted absent first branches.
for(let suns=0;suns<=6;suns++)for(const mode of ['keep','return']){
 const s=make();root(s).source.slots=[...Array(suns).fill('sun'),...Array(6-suns).fill('moon')];ok(P.setPairMode(s,mode,options));ok(P.setPairPage(s,'tree',options));
 for(const first of ['sun','moon']){
  const before=copy(s),present=root(s).source.slots.includes(first);eq(!!P.choosePairBranch(s,'first',first,options),present);if(!present){eq(s,before);continue;}
  for(const second of ['sun','moon']){ok(P.choosePairBranch(s,'second',second,options));const b=P.pairBranch(root(s));const n=root(s).source.slots.filter(x=>x===first).length,secondN=root(s).source.slots.filter(x=>x===second).length-(mode==='keep'&&first===second?1:0);eq([b.firstNumerator,b.secondNumerator,b.numerator,b.denominator],[n,secondN,n*secondN,mode==='keep'?30:36]);eq(b.possible,secondN>0);eq(root(s).runs,[]);}
 }
}
// Every finite question has a complete ladder, stable key and own question bag.
// Rational equivalents use integer cross-products and never a float tolerance.
for(const t of Object.values(source.tasks)){
 const s=make();ok(P.selectPairTask(s,t.id,options));eq(work(s).source,t);eq(work(s).checks,[]);eq(work(s).source.slots,source.slots);
 for(let stage=1;stage<=3;stage++){ok(P.pairHelp(s,options));eq(work(s).helpStage,stage);}ok(work(s).support.hint&&work(s).support.example&&work(s).support.skip);eq(work(s).checks,[]);eq(work(s).firstKept,null);const draft=copy(work(s).draft);ok(P.pairHelp(s,options));eq(work(s).helpStage,1);eq(work(s).draft,draft);ok(work(s).support.skip);
 let r=P.checkPair(s,keyRaw(t),options);ok(r.recorded&&r.correct);ok(P.validPairCheck(r));eq(r.source,t);ok(r.support.skip);eq(work(s).checkView,'latest');const first=copy(work(s).firstKept);
 if(t.kind==='fraction')for(const multiple of [2,3,7]){r=P.checkPair(s,t.key.map(n=>String(n*multiple)),options);ok(r.recorded&&r.correct,'equivalent rational accepted');}
 const wrong=t.kind==='choice'?[t.options.find(o=>o.id!==t.key).id]:t.kind==='fraction'?['999','1']:['999','999','999'];r=P.checkPair(s,wrong,options);ok(r.recorded&&!r.correct);eq(work(s).firstKept,first);
 for(let i=0;i<6;i++)ok(P.checkPair(s,keyRaw(t),options).recorded);eq(work(s).checks.length,4);eq(work(s).firstKept,first);ok(P.checkPair(s,keyRaw(t),options).evicted);ok(P.selectPairCheck(s,'first',options));eq(P.selectedPairCheck(work(s)),first);ok(P.selectPairCheck(s,0,options));eq(P.selectedPairCheck(work(s)),work(s).checks[0]);ok(P.selectPairCheck(s,null,options));eq(P.selectedPairCheck(work(s)),null);eq(work(s).draft,keyRaw(t));
}
{
 const s=make();ok(P.selectPairTask(s,'after-sun',options));ok(P.setPairDraft(s,0,' 01 ',options));ok(P.setPairDraft(s,1,' 5 ',options));eq(work(s).draft,[' 01 ',' 5 ']);
 for(const raw of [['','5'],['1','0'],['x','5'],['1.0','5'],['-1','5'],['1000','5'],['１２','5'],['1','1e1'],['1','12345'],['1\t','5'],['1'],null]){const before=copy(s);const r=P.checkPair(s,raw,options);ok(!r.recorded);eq(r.feedback,pairInputMessage);eq(s,before,'invalid actual DOM input cannot check stale valid draft');}
 for(const raw of ['x','1.0','12345','-1']){const before=copy(s);ok(!P.setPairDraft(s,0,raw,options));eq(s,before);}
 let r=P.checkPair(s,['2','6'],options);eq(r.code,'reused-first');ok(P.selectPairTask(s,'after-moon',options));eq(P.checkPair(s,['1','5'],options).code,'copied-sun-branch');ok(P.selectPairTask(s,'path-ss',options));eq(P.checkPair(s,['8','15'],options).code,'added-path');ok(P.selectPairTask(s,'path-mixed',options));eq(P.checkPair(s,['8','30'],options).code,'one-order');
}
// RNG rejection boundaries: each admitted Uint32 maps uniformly into the
// requested pool. Reject the high tail, never reuse a six-choice result mod5.
for(const size of [5,6]){
 const limit=Math.floor(4294967296/size)*size;
 for(let n=0;n<30;n++)eq(P.randomPairIndex(size,{getRandomValues:a=>{a[0]=n;}}),n%size);
 let calls=0;eq(P.randomPairIndex(size,{getRandomValues:a=>{a[0]=calls++===0?limit:limit-1;}}),(limit-1)%size);eq(calls,2);
 calls=0;eq(P.randomPairIndex(size,{getRandomValues:a=>{calls++;a[0]=4294967295;}}),null);eq(calls,32);
 eq(P.randomPairIndex(size,{getRandomValues:()=>{throw Error('Synthetic entropy unavailable');}}),null);eq(P.randomPairIndex(size,{}),null);
}
eq(P.randomPairIndex(4),null);
// Three sets per rule,15 completed pairs each. Pending firsts survive modes,
// page changes and actual restore. Missing trials are not observations.
{
 const s=make();for(const mode of ['keep','return'])for(let run=0;run<3;run++){
  ok(P.beginPairRun(s,mode,options));ok(P.choosePairPrediction(s,'mixed',options));const id=current(s).id;for(let i=0;i<15;i++){ok(P.drawPairFirst(s,i%6,options));if(i===0){const pending=copy(current(s));ok(P.setPairMode(s,mode==='keep'?'return':'keep',options));ok(P.setPairPage(s,'tree',options));ok(P.setPairMode(s,mode,options));eq(current(s),pending);ok(P.beginPairRun(s,mode,options));eq(current(s).id,id,'new set resumes unfinished one');eq(restoreStateResult(JSON.stringify(s)).state.seedPairs,s.seedPairs);}ok(P.drawPairSecond(s,i%(mode==='keep'?5:6),options));}
  eq(current(s).pairs.length,15);eq(P.pairTallies(current(s),root(s).source.slots).total,15);const before=copy(s);ok(!P.drawPairFirst(s,0,options));ok(!P.drawPairSecond(s,0,options));ok(!P.choosePairPrediction(s,null,options));eq(s,before);
 }
 eq(root(s).runs.length,6);for(const mode of ['keep','return']){const before=copy(s);ok(!P.beginPairRun(s,mode,options));eq(s,before);}for(const row of root(s).runs){ok(P.selectPairRun(s,row.id,options));eq(current(s).id,row.id);}
 eq(prepareProgressImport(JSON.stringify(report(s),null,2)).state.seedPairs,s.seedPairs);
}
// Reader and malformed-sibling boundaries never regrade old checks or change
// raw/unknown work. Existing modes and other destinations stay accessible.
{
 const s=make();s.seedStall={version:99,raw:'synthetic older experiment'};s.desk={synthetic:'waiting'};root(s).future={raw:'root extension'};work(s).future={raw:'task extension'};ok(P.checkPair(s,['2','6'],options).recorded);const c=work(s).checks[0];c.correct=false;c.feedback='Earlier recorded outcome';c.source.prompt='Earlier prompt';const old=copy(c);root(s).source.slots=Array(6).fill('moon');ok(P.validPairCheck(c));ok(P.selectPairTask(s,'first-sun',options));eq(work(s).checks[0],old);const separate=P.checkPair(s,['2','6'],options);ok(separate.correct);eq(separate.source.slots,source.slots,'question bag stays independent of experiment bag');eq(separate.context.experimentSlots,Array(6).fill('moon'));eq(work(s).checks[0],old);
 root(s).tasks['broken-task']={raw:'preserve'};root(s).source.order.push('broken-task');root(s).tasks['path-ss']={raw:'broken prior question'};ok(P.selectPairTask(s,'after-sun',options));ok(!P.selectPairTask(s,'broken-task',options));ok(!P.selectPairTask(s,'path-ss',options));eq(root(s).tasks['path-ss'],{raw:'broken prior question'});ok(P.beginPairRun(s,'keep',options));const run=current(s);run.future='retained';ok(P.drawPairFirst(s,2,options));ok(P.drawPairSecond(s,0,options));const malformed={id:99,mode:'keep',pairs:'raw'},duplicate=copy(current(s));root(s).runs.push(malformed,duplicate);const raw=copy(root(s).runs);eq(P.pairView(s).readableRuns.length,0);eq(P.pairView(s).unreadableRuns.length,3);ok(P.selectPairTask(s,'after-moon',options));eq(root(s).runs,raw);ok(P.beginPairRun(s,'return',options));eq(root(s).runs.slice(0,3),raw);
 const before=copy(s);P.pairView(s);P.pairFacts(s);P.pairBranch(root(s));eq(s,before,'readers pure');eq(prepareProgressImport(JSON.stringify(report(s),null,2)).state.seedPairs,s.seedPairs);eq(s.seedStall,{version:99,raw:'synthetic older experiment'});eq(s.desk,{synthetic:'waiting'});
 for(const payload of [null,[],2,{version:99,raw:'later mode'}, {...copy(root(s)),source:{version:3,raw:'later model'}}]){s.seedPairs=copy(payload);const held=copy(s);eq(P.pairView(s).status,'unavailable');ok(!P.startPairs(s,options));ok(!P.beginPairRun(s,'keep',options));eq(s,held);eq(prepareProgressImport(JSON.stringify(report(s),null,2)).state.seedPairs,payload);}
}
// Visible products alone qualify current helpers before answer-bearing changes.
{
 const s=make();ok(P.selectPairTask(s,'path-mixed',options));ok(P.setPairFolded(s,true,options));eq(P.pairFacts(s),[]);ok(P.pairHelp(s,options));eq(P.pairFacts(s),[]);ok(P.pairHelp(s,options));eq(P.pairFacts(s),[[1,2],[3,2],[2,1]]);ok(P.pairHelp(s,options));eq(P.pairFacts(s),[],'Skip hides the different example');ok(P.choosePairBranch(s,'first','sun',options));ok(P.choosePairBranch(s,'second','moon',options));eq(P.pairFacts(s),[[2,4],[6,5]]);ok(s.exposures.includes('2x4'));ok(P.setPairPage(s,'results',options));eq(P.pairFacts(s),[]);ok(P.setPairPage(s,'tree',options));ok(P.checkPair(s,['16','30'],options).recorded);eq(P.pairFacts(s),[[2,4],[6,5],[4,2]]);ok(P.selectPairCheck(s,null,options));eq(P.pairFacts(s),[[2,4],[6,5]]);ok(P.setPairFolded(s,false,options));for(let i=1;i<source.learn.length;i++)ok(P.advancePairLearn(s,options));ok(P.pairFacts(s).some(p=>p[0]===3&&p[1]===2));
 const held=copy(s);eq(P.preparePairDisplay(s,{...options,canExport:()=>false}),{ok:false,changed:false});eq(s,held);
}
// A shown example qualifies waiting original and Bramble tasks, preserving
// their object references. Hidden or refused examples qualify neither.
{
 const s=make();const v=startPostOffice(s,'purl-blankets');ok(v);ok(setBrambleMode(s,'multiply'));ok(startAdaptiveRival(s));v.rival.task=generateRivalTask('multiply',3,4,0);v.rival.input='7';s.baseline.draft={questionId:'groups',attempts:[],input:'',hinted:false,revealed:false};const baseline=s.baseline,rival=v.rival;ok(P.selectPairTask(s,'path-mm',options));ok(!s.baseline.draft.exposed&&!rival.priorFactShown);ok(P.pairHelp(s,options));const before=copy(s);ok(!P.pairHelp(s,{...options,canExport:()=>false}));eq(s,before);ok(P.pairHelp(s,options));ok(s.baseline.draft.exposed);ok(rival.priorFactShown);eq(s.baseline,baseline);eq(s.postOffice.visits[0].rival,rival);eq(s.baseline.observations,[]);eq(s.practice,[]);eq(s.puzzles,[]);
}
// One malformed historical check makes only its own question unavailable.
{
 const s=make();ok(P.checkPair(s,['2','6'],options).recorded);work(s).checks.push({raw:'unreadable historical response'});const held=copy(root(s).tasks['first-sun']);eq(P.pairView(s).work,null);ok(!P.selectPairTask(s,'first-sun',options));ok(P.selectPairTask(s,'after-sun',options));ok(P.beginPairRun(s,'keep',options));ok(P.drawPairFirst(s,0,options));ok(P.drawPairSecond(s,0,options));eq(root(s).tasks['first-sun'],held);eq(prepareProgressImport(JSON.stringify(report(s),null,2)).state.seedPairs,s.seedPairs);
}
// Results supplies theoretical fractions even without deliberate tree paths.
// Record that support precisely, separately from tree exploration, and never
// rewrite an earlier checked result when the theory is later visited.
{
 const s=make();ok(!root(s).theorySeen&&!root(s).treeSeen);ok(P.selectPairTask(s,'path-ss',options));ok(P.checkPair(s,['1','15'],options).recorded);const old=copy(work(s).checks[0]);ok(!old.support.theory&&!old.support.tree);ok(P.selectPairCheck(s,null,options));ok(P.setPairPage(s,'results',options));ok(root(s).theorySeen&&!root(s).treeSeen);eq(work(s).checks[0],old);ok(P.setPairPage(s,'tree',options));ok(P.checkPair(s,['1','15'],options).recorded);ok(work(s).checks.at(-1).support.theory);ok(!work(s).checks.at(-1).support.tree);eq(work(s).checks[0],old);
 const t=make();root(t).tasks['first-sun']={raw:'held'};ok(P.setPairPage(t,'results',options));ok(root(t).theorySeen);ok(P.selectPairTask(t,'after-sun',options));ok(P.checkPair(t,['1','5'],options).recorded);ok(work(t).checks.at(-1).support.theory);
 const u=make(),before=copy(u);ok(!P.setPairPage(u,'results',{...options,canExport:()=>false}));eq(u,before);
}
// Clone preflight failures cannot modify other notebook aliases, exposure flags
// or the root. Actual report/import limits apply even when no products show.
{
 const s=make();const alias=s.baseline,other=copy(s.seedStall),before=copy(s);const deny={...options,canExport:()=>false};for(const f of [()=>P.setPairPage(s,'tree',deny),()=>P.beginPairRun(s,'keep',deny),()=>P.setPairDraft(s,0,'2',deny),()=>P.checkPair(s,['2','6'],deny),()=>P.pairHelp(s,deny),()=>P.choosePairBranch(s,'first','sun',deny)]){f();eq(s,before);}
 ok(P.beginPairRun(s,'keep',options));ok(P.drawPairFirst(s,0,options));const pending=copy(s);ok(!P.drawPairSecond(s,0,deny));eq(s,pending);eq(s.baseline,alias);eq(s.seedStall,other);
 const first=initializeExplorerState(freshState()),held=copy(first);ok(!P.startPairs(first,deny));eq(first,held);
 const full=copy(s);s.padding='x'.repeat(5*1024*1024);const padded=copy(s);ok(!P.setPairDraft(s,0,'4',options));eq(s,padded);delete s.padding;eq(s,full);
}
// Real maximum retention is deliberately compact: one task source per record,
// numeric slot pairs, no catalog copied into every trial or checked response.
{
 const s=make();for(const mode of ['keep','return'])for(let n=0;n<3;n++){ok(P.beginPairRun(s,mode,options));for(let i=0;i<15;i++){ok(P.drawPairFirst(s,i%6,options));ok(P.drawPairSecond(s,i%(mode==='keep'?5:6),options));}}
 for(const t of Object.values(source.tasks)){ok(P.selectPairTask(s,t.id,options));for(let stage=0;stage<3;stage++)ok(P.pairHelp(s,options));for(let c=0;c<7;c++)ok(P.checkPair(s,keyRaw(t),options).recorded);eq(work(s).checks.length,4);ok(P.validPairCheck(work(s).firstKept));}
 const text=JSON.stringify(report(s),null,2),bytes=Buffer.byteLength(text);ok(bytes<300000,'bounded lesson leaves substantial shared notebook headroom');const imported=prepareProgressImport(text);ok(imported.ok);eq(imported.state.seedPairs,s.seedPairs);ok(P.setPairPage(s,'draw',options));ok(P.preparePairDisplay(s,options).ok);console.log(`Seed pair maximum retained report: ${bytes} bytes.`);
}
console.log(`Seed pairs core: ${count} assertions passed. Runtime browser/audio and learning-effect validation are separate.`);
