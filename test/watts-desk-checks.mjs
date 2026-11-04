// Synthetic notebooks and model values only.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as c from '../dist/watts-desk-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
const copy=structuredClone;
const notebook=()=>initializeExplorerState(freshState());
const report=s=>({title:'Synthetic notebook',exportedAt:'2026-11-04T12:00:00.000Z',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
export function runWattsChecks(){
 const source=c.wattsSource(),fresh=c.freshWattsWork(source);
 assert(c.validWattsSource(source));assert(c.validWattsWork(source,fresh));assert.equal(fresh.target,1200);
 assert.deepEqual(c.wattsResults(source,fresh).map(r=>r.joules),[0,0,0]);assert.notEqual(c.wattsSource(),source);
 const original=copy(fresh);let durationStates=0;
 // Independent finite arithmetic: 13 choices per machine, with fixed common axis.
 for(let a=0;a<=60;a+=5)for(let b=0;b<=60;b+=5)for(let d=0;d<=60;d+=5){
  const w=copy(fresh);w.durations.forEach((r,i)=>r.seconds=[a,b,d][i]);assert(c.validWattsWork(source,w));
  const results=c.wattsResults(source,w);assert.deepEqual(results.map(r=>r.joules),[20*a,40*b,60*d]);
  for(const [i,r] of results.entries()){
   assert.equal(r.seconds,[a,b,d][i]);assert(r.joules<=3600);assert.equal(r.joules+(-r.joules),0,'source loss balances load gain');
   for(const delta of [-5,5]){const next=c.changeWattsWork(source,w,'time',{id:r.id,delta});const expect=r.seconds+delta>=0&&r.seconds+delta<=60;assert.equal(next!==null,expect);if(next){assert.equal(next.durations[i].seconds,r.seconds+delta);assert.notEqual(next.durations,w.durations);}}
   assert(!(r.watts>=1&&r.watts<=12&&r.seconds>=1&&r.seconds<=12));
  }durationStates++;
 }
 assert.equal(durationStates,2197);
 for(const [target,limits,count] of [[600,[30,15,10],84],[1200,[60,30,20],455]]){
  let n=0;
  for(let a=0;a<=limits[0];a+=5)for(let b=0;b<=limits[1];b+=5)for(let d=0;d<=limits[2];d+=5){
   let w=copy(fresh);w.mode='job';w.target=target;w.jobDurations.forEach((r,i)=>r.seconds=[a,b,d][i]);assert(c.validWattsWork(source,w));
   assert.deepEqual(c.wattsResults(source,w).map(r=>r.joules),[20*a,40*b,60*d]);
   const shown=c.changeWattsWork(source,w,'finished');assert(shown.finishedShown);assert.deepEqual(shown.jobDurations,w.jobDurations);
   assert.deepEqual(c.wattsResults(source,shown,true).map(r=>r.seconds),limits);assert.deepEqual(c.wattsResults(source,shown,true).map(r=>r.joules),[target,target,target]);
   for(const [i,m] of source.machines.entries())for(const delta of [-5,5])assert.equal(c.changeWattsWork(source,w,'time',{id:m.id,delta})!==null,[a,b,d][i]+delta>=0&&[a,b,d][i]+delta<=limits[i]);n++;
  }assert.equal(n,count);
 }
 assert.deepEqual(fresh,original);
 let w=c.changeWattsWork(source,fresh,'time',{id:'reed',delta:5});w=c.changeWattsWork(source,w,'mode','job');w=c.changeWattsWork(source,w,'time',{id:'oak',delta:5});w=c.changeWattsWork(source,w,'finished');
 const smaller=c.changeWattsWork(source,w,'target',600);assert.deepEqual(smaller.durations,w.durations);assert(smaller.jobDurations.every(d=>d.seconds===0));assert.equal(smaller.finishedShown,false);
 assert.deepEqual(c.changeWattsWork(source,w,'mode','durations').jobDurations,w.jobDurations);
 for(const [action,value] of [['mode','wrong'],['target',601],['target','600'],['time',{id:'missing',delta:5}],['time',{id:'reed',delta:1}],['worked',false],['example',1],['finished',true],['unknown',undefined]]){const before=copy(w);assert.equal(c.changeWattsWork(source,w,action,value),null);assert.deepEqual(w,before);}
 w=c.changeWattsWork(source,w,'worked');assert(w.workedShown);for(let i=1;i<=3;i++){w=c.changeWattsWork(source,w,'example');assert.equal(w.exampleSeen,i);}assert.equal(c.changeWattsWork(source,w,'example'),null);
 const old=copy(source);old.title='A frozen earlier model';old.machines=[{id:'old-a',label:'Earlier one',watts:13,extra:{retained:true}},{id:'old-b',label:'Earlier two',watts:26}];old.maxSeconds=20;old.stepSeconds=1;old.axisMax=520;old.targets=[26,260];old.teaching=['Earlier reviewed example'];old.opaque={retained:['source']};
 assert(c.validWattsSource(old));let ow=c.freshWattsWork(old);assert.equal(ow.target,260);ow.opaque={retained:['work']};ow.durations[0].opaque='duration';ow=c.changeWattsWork(old,ow,'time',{id:'old-a',delta:1});assert.deepEqual(ow.opaque,{retained:['work']});assert.equal(ow.durations[0].opaque,'duration');
 assert.deepEqual(c.wattsResults(old,ow,true).map(r=>r.seconds),[20,10]);old.machines[1].watts=13;assert(c.validWattsSource(old));assert.deepEqual(c.wattsResults(old,ow,true).map(r=>r.seconds),[20,20]);
 for(const damage of [s=>s.v=2,s=>s.model='watts-desk-v2',s=>delete s.title,s=>s.title='',s=>s.machines=Array(3),s=>s.machines[0].id='constructor',s=>s.machines[1].id=s.machines[0].id,s=>s.machines[0].watts=12,s=>s.machines[0].watts=121,s=>s.stepSeconds=7,s=>s.maxSeconds=121,s=>s.axisMax=3599,s=>s.targets=[601],s=>s.targets=[600,600],s=>s.targets=[3600],s=>s.teaching=[],s=>s.glossary[0].term='x'.repeat(81)]){const bad=copy(source);damage(bad);assert.equal(c.validWattsSource(bad),false);assert.equal(c.freshWattsWork(bad),null);}
 for(const damage of [w=>w.v=2,w=>delete w.mode,w=>w.durations[0].seconds=1,w=>w.durations[0].seconds=65,w=>w.durations[1].machineId='reed',w=>w.jobDurations[2].seconds=25,w=>w.workedShown=1,w=>w.exampleSeen=4,w=>w.finishedShown=null]){const bad=copy(fresh);damage(bad);assert.equal(c.validWattsWork(source,bad),false);assert.equal(c.changeWattsWork(source,bad,'worked'),null);}
 const refuse=(s,gate=canExport)=>{const before=copy(s),refs={...s};assert.equal(c.keepPowerSheet(s,source,fresh,{canExport:gate}),false);assert.deepEqual(s,before);for(const key of Object.keys(refs))assert.equal(s[key],refs[key]);};
 const state=notebook(),before=copy(state),refs={...state};assert.equal(c.powerNotesView(state).status,'absent');assert.equal(c.lastPowerSheet(state),null);
 for(const gate of [undefined,null,()=>false,()=>1,()=>{throw Error('Synthetic refusal');}]){const before=copy(state);assert.equal(c.keepPowerSheet(state,source,fresh,{canExport:gate}),false);assert.deepEqual(state,before);}
 assert.equal(c.keepPowerSheet(state,old,ow,{canExport}),'power-sheet-1');for(const key of Object.keys(refs))assert.equal(state[key],refs[key]);
 const kept=copy(state.powerNotes);old.opaque.retained.push('changed');ow.opaque.retained.push('changed');assert.deepEqual(state.powerNotes,kept);
 state.powerNotes.push({id:'power-sheet-17',source:{v:99},work:null});assert.equal(c.keepPowerSheet(state,source,fresh,{canExport}),'power-sheet-18');assert.equal(c.lastPowerSheet(state).index,2);
 state.powerNotes.push(copy(state.powerNotes[2]));assert(c.powerNotesView(state).items.slice(2).every(i=>!i.readable));assert.equal(c.lastPowerSheet(state).id,'power-sheet-1');
 while(state.powerNotes.length<12)assert(c.keepPowerSheet(state,source,fresh,{canExport}));refuse(state);
 const imported=prepareProgressImport(JSON.stringify(report(state),null,2));assert(imported.ok);assert.deepEqual(imported.state.powerNotes,state.powerNotes);assert.equal(c.powerNotesView(imported.state).items.length,12);
 for(const raw of [null,false,7,'Earlier format',{v:99},Array(1),Object.assign([],{extra:true})]){const s=notebook();s.powerNotes=raw;assert.equal(c.powerNotesView(s).status,'unavailable');refuse(s);assert.equal(c.lastPowerSheet(s),null);}
 {const s=notebook(),symbol=Symbol('synthetic');s.powerNotes=Object.assign([],{[symbol]:true});const raw=s.powerNotes;assert.equal(c.keepPowerSheet(s,source,fresh,{canExport}),false);assert.equal(s.powerNotes,raw);assert.equal(raw[symbol],true);}
 {const s=notebook();s.powerNotes=[{id:'power-sheet-999999',v:99}];refuse(s);}
 {const s=notebook();s.powerNotes=[{id:'power-sheet-099999',v:99},{id:'power-sheet-1000000',v:99},{id:'power-sheet-25',v:99}];assert.equal(c.keepPowerSheet(s,source,fresh,{canExport}),'power-sheet-26');}
 {const s=notebook();assert(c.keepPowerSheet(s,source,fresh,{canExport(candidate){candidate.powerNotes=[];candidate.practice=[];candidate.injected=true;return true;}}));assert.equal(s.powerNotes.length,1);assert.equal(s.injected,undefined);}
 // The real pretty Notes wrapper can exceed the limit while the notebook alone fits.
 {const s=notebook(),candidate=copy(s);assert(c.keepPowerSheet(candidate,source,fresh,{canExport:()=>true}));const bytes=v=>new TextEncoder().encode(JSON.stringify(v,null,2)).length;candidate.syntheticOther='';s.syntheticOther='x'.repeat(MAX_IMPORT_BYTES-bytes(candidate)-20);candidate.syntheticOther=s.syntheticOther;assert(recoveryFitsProgressLimits(candidate));assert.equal(canExport(candidate),false);refuse(s);}
 {const s=notebook();s.syntheticOther='x'.repeat(600000);assert(c.keepPowerSheet(s,source,fresh,{canExport}));assert.equal(s.syntheticOther.length,600000);s.syntheticOther='x'.repeat(MAX_IMPORT_BYTES);refuse(s);}
 // Support disclosure and keeping never alter attempts, exposure, other roots, or save policy.
 for(const policy of ['off','quota']){const s=notebook();s.syntheticPolicy=policy;const prior=copy(s);let draft=c.changeWattsWork(source,fresh,'worked');draft=c.changeWattsWork(source,draft,'example');draft=c.changeWattsWork(source,draft,'finished');assert(c.keepPowerSheet(s,source,draft,{canExport}));delete s.powerNotes;assert.deepEqual(s,prior);}
 assert.deepEqual(before,refs);console.log('Watts Desk: finite arithmetic, transitions, frozen history, ownership and real Notes transport passed.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runWattsChecks();
