import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as D from '../dist/diffusion-tray-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
const copy=structuredClone;
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const notesReport=new Function('recommendations','explorerStore',app.split('\n').find(line=>line.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const options={canExport:state=>prepareProgressImport(JSON.stringify(notesReport(state),null,2)).ok};
const book=()=>initializeExplorerState(freshState());
const source=D.diffusionSource('left',1),work=D.newDiffusionWork(source);
const refuse=(state,s=source,w=work,opts=options)=>{const before=copy(state);assert.equal(D.keepDiffusionRun(state,s,w,opts),false);assert.deepEqual(state,before);};
const others=state=>{const result=copy(state);delete result.diffusionRuns;return result;};
assert.deepEqual(D.diffusionCases.map(s=>s.id),['left','right','even','closed']);
for(const [caseId,initialLeft] of [['left',12],['right',4],['even',8],['closed',12]]){
 for(const seed of [1,123456789,4294967295]){
  const s=D.diffusionSource(caseId,seed),original=copy(s);let w=D.newDiffusionWork(s);
  assert.ok(D.validDiffusionSource(s));assert.equal(s.particles.filter(p=>p.kindId==='circle').length,16);assert.equal(s.particles.filter(p=>p.kindId==='circle'&&p.side==='left').length,initialLeft);assert.equal(s.particles.filter(p=>p.kindId==='diamond'&&p.side==='left').length,4);
  assert.equal(s.kinds[0].canCross,caseId!=='closed');assert.equal(s.kinds[1].canCross,false);
  const totals={circle:[0,0],diamond:[0,0]};let rose=false,fell=false;
  for(let step=1;step<=40;step++){
   const old=copy(w),next=D.advanceDiffusionWork(s,w);assert.deepEqual(w,old);assert.ok(next);assert.equal(next.steps,step);assert.deepEqual(next.previous,w.current);
   for(const kind of s.kinds){
    const particles=s.particles.filter(p=>p.kindId===kind.id),before=new Map(w.current.map(p=>[p.id,p.side])),after=new Map(next.current.map(p=>[p.id,p.side]));
    let lr=0,rl=0;
    for(const p of particles){if(before.get(p.id)==='left'&&after.get(p.id)==='right')lr++;if(before.get(p.id)==='right'&&after.get(p.id)==='left')rl++;if(!kind.canCross)assert.equal(after.get(p.id),p.side);}
    totals[kind.id][0]+=lr;totals[kind.id][1]+=rl;
    const c=D.diffusionCounts(s,next).find(c=>c.kindId===kind.id);
    assert.equal(c.lastLeftToRight,lr);assert.equal(c.lastRightToLeft,rl);assert.equal(c.leftToRight,totals[kind.id][0]);assert.equal(c.rightToLeft,totals[kind.id][1]);assert.equal(c.net,totals[kind.id][0]-totals[kind.id][1]);assert.equal(c.left+c.right,particles.length);assert.equal(c.left,c.initialLeft-c.net);
    if(kind.id==='circle'){rose||=rl>lr;fell||=lr>rl;}
   }
   w=next;
  }
  if(caseId!=='closed'){assert.ok(rose);assert.ok(fell);}
  assert.deepEqual(s,original);
 }
}
const once=D.advanceDiffusionWork(source,work);
assert.deepEqual(once.crossings,[{kindId:'circle',leftToRight:6,rightToLeft:2},{kindId:'diamond',leftToRight:0,rightToLeft:0}]);
assert.equal(once.rng,3652395599,'24 draws, including blocked markers');
const closed=D.diffusionSource('closed',1);assert.equal(D.advanceDiffusionWork(closed,D.newDiffusionWork(closed)).rng,once.rng);
assert.equal(D.diffusionCounts(source,once)[0].left,8);assert.ok(D.advanceDiffusionWork(source,once),'equality does not stop motion');
const pairedSource=D.diffusionSource('left',123456789),paired=D.advanceDiffusionWork(pairedSource,D.newDiffusionWork(pairedSource));
assert.deepEqual(D.diffusionCounts(pairedSource,paired)[0],{kindId:'circle',label:'Circle markers',initialLeft:12,initialRight:4,left:12,right:4,lastLeftToRight:1,lastRightToLeft:1,leftToRight:1,rightToLeft:1,net:0});

// Independently inverted xorshift fixtures place the FIRST unsigned draw immediately
// below, exactly on, and immediately above 2^30. The blocked second marker consumes a draw.
for(const [seed,expectedSide] of [[2456591591,'right'],[1140858880,'left'],[3065357609,'left']]){
 const s=D.diffusionSource('left',seed);s.particles=[s.particles[0],s.particles[16]];
 assert.equal(D.advanceDiffusionWork(s,D.newDiffusionWork(s)).current[0].side,expectedSide);
}
let shown=work;for(let i=0;i<9;i++)shown=D.revealDiffusionExample(source,shown);
assert.equal(shown.exampleSeen,6);assert.equal(work.exampleSeen,0);assert.equal(shown.rng,work.rng);assert.deepEqual(shown.current,work.current);
source.future={synthetic:'source'};work.future={synthetic:'work'};
assert.equal(D.diffusionSource('left',1).future,undefined);assert.equal(D.diffusionSource('missing',1),null);
for(const seed of [0,-1,1.5,4294967296,NaN])assert.equal(D.diffusionSource('left',seed),null);
assert.deepEqual(D.advanceDiffusionWork(source,work).future,work.future);assert.notEqual(D.revealDiffusionExample(source,work).future,work.future);

// Earlier records own their IDs, labels, symbols, flags, order and seed. Feasible
// historical snapshots need not reproduce the currently selected pseudo-random trace.
const historical=copy(source);historical.id='old:source';historical.seed=27;historical.title='Synthetic earlier exchange';historical.teaching=['Synthetic earlier teaching.'];
historical.kinds=[{id:'old/kind',label:'Earlier markers',symbol:'diamond',canCross:true}];historical.particles=[{id:'old:B',kindId:'old/kind',side:'right'},{id:'old:A',kindId:'old/kind',side:'left'}];
let h=D.newDiffusionWork(historical);h.steps=1;h.rng=999;h.current.reverse();h.current.forEach(p=>p.side=p.side==='left'?'right':'left');h.crossings[0].leftToRight=1;h.crossings[0].rightToLeft=1;
assert.ok(D.validDiffusionWork(historical,h));assert.equal(D.diffusionCounts(historical,h)[0].label,'Earlier markers');
historical.seed=4294967295;assert.ok(D.validDiffusionWork(historical,h),'changed seed is not a replay requirement');
const changedFlags=copy(historical);changedFlags.kinds[0].canCross=false;assert.equal(D.validDiffusionWork(changedFlags,h),false,'own blocked rule applies');
const maximum=copy(closed),limit=D.newDiffusionWork(maximum);limit.steps=1000000;assert.ok(D.validDiffusionWork(maximum,limit));assert.equal(D.advanceDiffusionWork(maximum,limit),null);
for(const mutate of [s=>delete s.membraneRole,s=>s.title='🪴'.repeat(161),s=>s.context='',s=>s.notice='x'.repeat(1501),s=>s.seed=0,s=>s.seed=4294967296,s=>s.equalVolumes=false,s=>s.particles=[],s=>s.particles=Array(2),s=>s.particles.push(copy(s.particles[0])),s=>s.particles[0].kindId='missing',s=>s.particles[0].side='middle',s=>s.kinds[0].symbol='square',s=>s.kinds[1].symbol=s.kinds[0].symbol,s=>s.kinds[0].id='constructor',s=>s.kinds[0].canCross=1,s=>s.teaching=Array(2),s=>s.id='é']){
 const bad=copy(source);mutate(bad);assert.equal(D.validDiffusionSource(bad),false);assert.equal(D.newDiffusionWork(bad),null);
}
for(const key of Object.keys(source).filter(key=>key!=='future')){const bad=copy(source);delete bad[key];assert.equal(D.validDiffusionSource(bad),false,`own source ${key}`);}
assert.equal(D.validDiffusionSource(Object.create(source)),false);
for(const mutate of [w=>w.rng=0,w=>w.rng=4294967296,w=>w.steps=-1,w=>w.steps=1000001,w=>w.exampleSeen=7,w=>w.current.pop(),w=>w.current[1]=copy(w.current[0]),w=>w.previous[0].side='middle',w=>w.crossings[0].leftToRight=-1,w=>w.crossings[0].leftToRight=0.5,w=>w.crossings[0].kindId='missing',w=>w.crossings.push(copy(w.crossings[0])),w=>w.current[0].side='right',w=>w.previous[0].side='right']){
 const bad=copy(work);mutate(bad);assert.equal(D.validDiffusionWork(source,bad),false);assert.equal(D.advanceDiffusionWork(source,bad),null);assert.equal(D.revealDiffusionExample(source,bad),null);assert.equal(D.diffusionCounts(source,bad),null);
}
for(const key of ['v','steps','rng','current','previous','crossings','exampleSeen']){const bad=copy(work);delete bad[key];assert.equal(D.validDiffusionWork(source,bad),false);}
const zeroCounters=copy(work);zeroCounters.crossings[0].leftToRight=1;zeroCounters.crossings[0].rightToLeft=1;assert.equal(D.validDiffusionWork(source,zeroCounters),false);
const noLastMove=copy(work);noLastMove.steps=1;noLastMove.crossings[0].leftToRight=16;noLastMove.crossings[0].rightToLeft=16;assert.equal(D.validDiffusionWork(source,noLastMove),false);
const swapped=copy(h);swapped.steps=2;swapped.crossings[0].leftToRight=2;swapped.crossings[0].rightToLeft=2;assert.equal(D.validDiffusionWork(historical,swapped),false,'opposite-side IDs cannot each flip twice in two steps');
const missingIndividual=copy(h);missingIndividual.steps=2;missingIndividual.crossings[0].leftToRight=0;missingIndividual.crossings[0].rightToLeft=0;assert.equal(D.validDiffusionWork(historical,missingIndividual),false,'unchanged aggregate counts still require crossings for followed marker identities');
const missingPreceding=copy(h);missingPreceding.steps=3;missingPreceding.previous=copy(h.current);missingPreceding.current=historical.particles.map(({id,side})=>({id,side}));assert.equal(D.validDiffusionWork(historical,missingPreceding),false,'preceding counters must cover the previous followed-marker changes');
const sixteen=D.diffusionSource('even',1);sixteen.kinds=sixteen.kinds.slice(0,1);sixteen.particles=sixteen.particles.slice(0,16);
const impossibleSixteen=D.newDiffusionWork(sixteen);impossibleSixteen.steps=2;impossibleSixteen.current.forEach(p=>p.side=p.side==='left'?'right':'left');impossibleSixteen.crossings[0].leftToRight=16;impossibleSixteen.crossings[0].rightToLeft=16;
assert.equal(D.validDiffusionWork(sixteen,impossibleSixteen),false,'32 claimed flips exceed the two-step parity maximum of 16 opposite-side markers');
const preceding=copy(work);preceding.steps=2;preceding.crossings[0].leftToRight=1;preceding.crossings[0].rightToLeft=1;assert.equal(D.validDiffusionWork(source,preceding),false,'preceding identity snapshot forbids claimed paired first-step flips');
const lastNotCovered=copy(once);lastNotCovered.crossings[0].leftToRight=5;assert.equal(D.validDiffusionWork(source,lastNotCovered),false);

const state=book(),before=copy(state);assert.deepEqual(D.diffusionRunsView(state),{status:'absent',items:[],canKeep:true});assert.equal(D.lastDiffusionRun(state),null);assert.deepEqual(state,before);
assert.equal(D.keepDiffusionRun(state,source,work,options),'diffusion-run-1');assert.deepEqual(others(state),before);
state.diffusionRuns[0].future='synthetic outer';const original=copy(state.diffusionRuns[0]);
assert.equal(D.keepDiffusionRun(state,historical,h,options),'diffusion-run-2');assert.deepEqual(state.diffusionRuns[0],original);assert.equal(state.diffusionRuns[1].future,undefined);
historical.title='Changed after Keep';h.current=[];assert.equal(state.diffusionRuns[1].source.title,'Synthetic earlier exchange');assert.equal(state.diffusionRuns[1].work.current.length,2);
state.diffusionRuns.push({id:'diffusion-run-17',source:{v:9},future:'synthetic raw'},null,{id:'diffusion-run-03'},'synthetic raw');
assert.equal(D.keepDiffusionRun(state,source,work,options),'diffusion-run-18');assert.equal(D.lastDiffusionRun(state).index,6);
state.diffusionRuns.push(copy(state.diffusionRuns[0]));const view=D.diffusionRunsView(state);assert.equal(view.items[0].readable,false);assert.equal(view.items[7].readable,false);assert.equal(view.items[1].readable,true);assert.equal(view.items[3].raw,null);
for(let i=0;i<3;i++)assert.ok(D.keepDiffusionRun(state,source,work,options));assert.equal(D.lastDiffusionRun(state).index,10);
const imported=prepareProgressImport(JSON.stringify(notesReport(state),null,2));assert.ok(imported.ok);assert.deepEqual(imported.state.diffusionRuns,state.diffusionRuns);
for(const root of [null,{},42,'synthetic unsupported']){const b=book();b.diffusionRuns=root;assert.equal(D.diffusionRunsView(b).status,'unavailable');refuse(b);const imported=prepareProgressImport(JSON.stringify(notesReport(b),null,2));assert.ok(imported.ok);assert.deepEqual(imported.state.diffusionRuns,root);}
const exhausted=book();exhausted.diffusionRuns=[{id:'diffusion-run-999999'}];assert.equal(D.diffusionRunsView(exhausted).canKeep,false);refuse(exhausted);
const noncanonical=book();noncanonical.diffusionRuns=[{id:'diffusion-run-0009'},{id:'diffusion-run-1000000'},{id:'diffusion-run-4x'}];assert.equal(D.keepDiffusionRun(noncanonical,source,work,options),'diffusion-run-1');
refuse(state,source,work,{});refuse(state,source,work,{canExport:()=>false});refuse(state,source,work,{canExport:()=>{throw Error('Synthetic refusal');}});
const hostile=book(),held=copy(hostile);assert.equal(D.keepDiffusionRun(hostile,source,work,{canExport:c=>{c.sessions=999;c.diffusionRuns[0].work.steps=999;c.diffusionRuns=[];return true;}}),'diffusion-run-1');assert.deepEqual(others(hostile),held);assert.equal(hostile.diffusionRuns[0].work.steps,0);
const large=book();large.syntheticPadding='';const proposed=copy(large);proposed.diffusionRuns=[{id:'diffusion-run-1',source:copy(source),work:copy(work)}];const bytes=new TextEncoder().encode(JSON.stringify(proposed,null,2)).length;large.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-bytes-10);proposed.syntheticPadding=large.syntheticPadding;assert.ok(recoveryFitsProgressLimits(proposed));assert.equal(options.canExport(proposed),false,'Notes wrapper exceeds bytes while bare proposal fits');refuse(large);
const complex=book();let nested={};complex.syntheticFuture=nested;for(let i=0;i<61;i++){nested.next={};nested=nested.next;}refuse(complex);
console.log('Diffusion Tray: deterministic directional crossings, source-owned history and bounds, raw shelf, atomic Keep and actual Notes checks passed.');
