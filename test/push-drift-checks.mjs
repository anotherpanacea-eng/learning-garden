// Fictional model inputs only. BigInt expectations do not use production arithmetic.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as c from '../dist/push-drift-core.mjs';
import {cartCases,makeCartSource} from '../dist/push-drift-content.mjs';
import {recordGivenMath} from '../dist/given-math.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {noteGardenFactExposure} from '../dist/garden-core.mjs';
import {notePendingBrambleFactExposure,startAdaptiveRival,generateRivalTask} from '../dist/post-rival.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {checkin} from '../dist/content.mjs';
import {storyNodes} from '../dist/story-content.mjs';
const eq=assert.deepEqual,ok=assert.ok,copy=structuredClone,yes={canExport:()=>true};
const oracle=(num,den)=>{let n=BigInt(num),d=BigInt(den),a=n<0n?-n:n,b=d;while(b){[a,b]=[b,a%b];}return {n:Number(n/a),d:Number(d/a)};};
const s=makeCartSource('library'),w=c.newCartWork(s);
eq(cartCases.length,6);eq(w,{v:1,masses:[1,2],forces:[0,0,0],teachingShown:false,runShown:false,historyShown:false});
for(const job of cartCases){const source=makeCartSource(job.id);ok(c.validCartSource(source));ok(c.validCartWork(source,c.newCartWork(source)));}
// Signed boundaries, reversal, six-second cumulative fractions and historical nonpreset choices.
const hist={...copy(s),id:'Earlier model é',massChoices:[3,6,8],forceChoices:[-8,-4,0,1,4,8],steps:6,v0:-4,initialMasses:[3,6],initialForces:[8,1,-4,0,-8,4],future:{raw:'source'}};
for(const [source,ms,fs] of [[s,[1,2],[4,0,-4]],[s,[2,4],[4,4,4]],[s,[2,2],[-4,4,0]],[hist,[3,6],[8,1,-4,0,-8,4]],[hist,[8,3],[-8,-8,-8,-8,-8,-8]]]){
 const work={...c.newCartWork(source),masses:ms,forces:fs},before=copy(work),trace=c.cartTrace(source,work);let sum=0;
 for(let t=0;t<=fs.length;t++){
  const prior=sum;if(t)sum+=fs[t-1];
  eq(trace.frames[t],{second:t,force:t?fs[t-1]:null,carts:ms.map(mass=>({mass,before:t?oracle(source.v0*mass+prior,mass):null,acceleration:t?oracle(fs[t-1],mass):null,change:t?oracle(fs[t-1],mass):null,velocity:oracle(source.v0*mass+sum,mass)}))});
 }
 eq(work,before);eq(trace.sameHistory,ms[0]===ms[1]||fs.every(x=>x===0));eq(trace.sameFinal,ms[0]===ms[1]||sum===0);
}
const end=c.cartTrace(s,{...w,forces:[4,0,-4]});eq([end.sameFinal,end.sameHistory],[true,false]);
eq(c.cartTrace({...s,v0:2},{...w,forces:[0,0,0]}).sameHistory,true);
const opposing=c.cartTrace({...s,v0:4},{...w,forces:[-4,-4,0]});eq(opposing.frames.slice(0,3).map(f=>f.carts.map(x=>x.velocity)),[[{n:4,d:1},{n:4,d:1}],[{n:0,d:1},{n:2,d:1}],[{n:-4,d:1},{n:0,d:1}]]);
eq(c.cartTrace(s,w).velocityBound,12);eq(c.cartTrace(s,{...w,masses:[4,4],forces:[4,-4,4]}).velocityBound,12);eq(c.cartTrace(hist,c.newCartWork(hist)).velocityBound,20);
let changed={...copy(w),future:{keep:[1]}};for(const action of ['teaching','run','history'])changed=c.changeCartWork(s,changed,action);
changed=c.changeCartWork(s,changed,'force',{index:1,value:-4});changed=c.changeCartWork(s,changed,'mass',{index:0,value:4});changed=c.changeCartWork(s,changed,'swap');
eq(changed,{v:1,masses:[2,4],forces:[0,-4,0],teachingShown:true,runShown:true,historyShown:true,future:{keep:[1]}});eq(w.forces,[0,0,0]);
for(const [action,value] of [['force',{index:3,value:4}],['force',{index:0,value:1}],['mass',{index:0,value:3}],['mass',{index:-1,value:1}],['other',null]])eq(c.changeCartWork(s,w,action,value),null);
for(const patch of [{v:2},{id:'constructor'},{steps:0},{v0:5},{massChoices:[1,1]},{forceChoices:[-4,4]},{labels:['A']},{initialForces:Array(3)},{teaching:[{words:'A'},{},{words:'C'}]}])ok(!c.validCartSource({...s,...patch}));
for(const patch of [{v:2},{masses:[1,3]},{forces:[0,0]},{historyShown:1}])ok(!c.validCartWork(s,{...w,...patch}));
ok(!c.validCartSource(Object.create(s)));eq(c.cartTrace(null,w),null);eq(c.newCartWork(null),null);
for(let i=0;i<s.teaching.length;i++){const x=c.cartExampleTrace(s,i);eq(x.velocityBound,4);eq(x.initialFrame,s.teaching[i].example.frame);eq(x.showHistory,s.teaching[i].example.history);}
const missing=copy(s);missing.teaching[0].example={future:99};delete missing.teaching[1].example;missing.teaching[2].example=null;ok(c.validCartSource(missing));eq(c.cartExampleTrace(missing,0),null);eq(c.cartExampleTrace(missing,1),null);eq(c.cartExampleTrace(missing,2),null);
const fractional=copy(hist);fractional.teaching[0].example={v:1,model:s.model,masses:[3,6],v0:0,forces:[1,1],frame:1,history:false};eq(c.cartExampleTrace(fractional,0).frames[2].carts[0].velocity,{n:2,d:3});
const examples=copy(s);examples.teaching[0].example={...examples.teaching[0].example,masses:[1,8],v0:4,forces:[8,8,8,8,8,8],frame:0};for(let i=0;i<6;i++)eq(c.cartExampleTrace(examples,i).velocityBound,52);
// Arithmetic belongs only to the proposed visible trajectory, with local constant spans.
const pairs=(work,view)=>c.cartDisplayPairs(s,work,view),run=clock=>({page:'run',clock});
eq(pairs(w,{page:'plan'}),[]);eq(pairs(w,run(0)),[]);eq(pairs({...w,forces:[4,-4,4]},run(1)),[[1,2],[1,4],[2,2]]);
eq(pairs({...w,forces:[4,-4,4]},{page:'history'}),[[1,2],[1,4],[2,2]],'Sign change breaks constant-force spans');
eq(pairs({...w,forces:[4,4,-4]},run(2)),[[1,2],[1,4],[2,2],[2,4]]);
eq(pairs({...w,forces:[4,4,4]},{page:'history'}),[[1,2],[1,4],[2,2],[2,3],[2,4],[3,4]]);
eq(c.cartDisplayPairs(hist,c.newCartWork(hist),{page:'history'}),[],'Fractional changes cannot become integer recall operands');
eq(c.cartDisplayPairs(missing,w,{page:'teaching',teachingPage:0}),[]);eq(pairs(w,run(4)),null);eq(pairs(w,{page:'foreign'}),null);eq(c.cartDisplayPairs(null,w,{page:'plan'}),null);
const t0=copy(s);t0.teaching[0].example={...s.teaching[1].example,forces:[4,4,4],frame:1,history:false};eq(c.cartDisplayPairs(t0,w,{page:'teaching',teachingPage:0}),[[1,2],[1,4],[2,2]],'Teaching frame cannot borrow work or future intervals');
// Kept snapshots retain unknown siblings and use detached strict whole-notebook preflight.
const book={unknown:{raw:['held']}},unknown=book.unknown;eq(c.cartProgramsView(book),{status:'absent',items:[],canKeep:true});eq(c.keepCartProgram(book,hist,c.newCartWork(hist),yes),'cart-program-1');const first=copy(book.cartPrograms[0]);hist.future.raw='caller';eq(book.cartPrograms[0],first);assert.equal(book.unknown,unknown);
const mixed={cartPrograms:[copy(first),{id:'cart-program-9',future:true},{id:'other',raw:[null]}],unknown:{held:true}};
eq(c.cartProgramsView(mixed).items.map(x=>[x.id,x.readable]),[['cart-program-1',true],['cart-program-9',false],[null,false]]);eq(c.keepCartProgram(mixed,s,w,yes),'cart-program-10');
const duplicate={cartPrograms:[copy(first),copy(first),{...copy(first),id:'cart-program-3'}]};eq(c.cartProgramsView(duplicate).items.map(x=>x.readable),[false,false,true]);
for(const suffix of ['999999','1000000','9007199254740993','9999999999999999999999999999999999999999']){const b={cartPrograms:[{id:`cart-program-${suffix}`,raw:'held'}]},old=copy(b);eq(c.cartProgramsView(b).canKeep,false);eq(c.keepCartProgram(b,s,w,yes),false);eq(b,old);}
for(const root of [null,{},'future']){const b={cartPrograms:root};eq(c.cartProgramsView(b).status,'unavailable');eq(c.keepCartProgram(b,s,w,yes),false);}
for(const gate of [undefined,()=>false,()=>1,()=>({ok:true}),()=>{throw Error('synthetic');}]){const b=copy(book),old=copy(b),refs={...b};eq(c.keepCartProgram(b,s,w,{canExport:gate}),false);eq(b,old);for(const k of Object.keys(refs))assert.equal(b[k],refs[k]);}
const hostile={unknown:{held:true}};eq(c.keepCartProgram(hostile,s,w,{canExport(candidate){candidate.cartPrograms[0].work.forces[0]=-4;candidate.unknown.held=false;return true;}}),'cart-program-1');eq(hostile.cartPrograms[0].work,w);eq(hostile.unknown,{held:true});
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const reportDecl=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];ok(reportDecl);
const report=Function('recommendations','explorerStore',`${reportDecl};return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const canExport=b=>prepareProgressImport(JSON.stringify(report(b),null,2)).ok;
const transfer=initializeExplorerState(freshState());transfer.syntheticRaw={payload:'x'.repeat(500000),raw:[null,'future']};transfer.cartPrograms=copy(mixed.cartPrograms);
eq(c.keepCartProgram(transfer,first.source,first.work,{canExport}),'cart-program-11');const imported=prepareProgressImport(JSON.stringify(report(transfer),null,2));ok(imported.ok);eq(imported.state.cartPrograms,transfer.cartPrograms);eq(imported.state.syntheticRaw,transfer.syntheticRaw);eq(prepareProgressImport(JSON.stringify(report(imported.state),null,2)).state.cartPrograms,transfer.cartPrograms);
const oversized={padding:'x'.repeat(MAX_IMPORT_BYTES)},old=copy(oversized);let calls=0;eq(c.keepCartProgram(oversized,s,w,{canExport:()=>{calls++;return true;}}),false);eq(calls,0);eq(oversized,old);
// Keep also checks the actual wrapper size, beyond the raw notebook's limit check.
const keepCap=freshState();keepCap.padding='';const keepProposal=copy(keepCap);ok(c.keepCartProgram(keepProposal,s,w,yes));const keepRoom=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(keepProposal,null,2)).length-40;keepCap.padding='x'.repeat(keepRoom);keepProposal.padding=keepCap.padding;ok(recoveryFitsProgressLimits(keepProposal));ok(!canExport(keepProposal));const keepBefore=copy(keepCap);eq(c.keepCartProgram(keepCap,s,w,{canExport}),false);eq(keepCap,keepBefore);
// Actual helper seam preserves answers/checks and atomically qualifies current waiting contexts.
assert.equal(c.recordCartDisplay,recordGivenMath);
const exposeDecl=app.match(/function exposeStoryFacts\([\s\S]*?\n}\n/)[0];
const expose=Function('noteLegacyExposure','noteGardenFactExposure','notePendingBrambleFactExposure','checkin',`return (${exposeDecl});`)(noteLegacyExposure,noteGardenFactExposure,notePendingBrambleFactExposure,checkin);
const options={canExport,exposeFacts:(ps,target)=>expose({facts:ps},null,target,true,false)};
const fresh=()=>initializeExplorerState(freshState());
const state=fresh();state.broad.drafts.waiting={question:{fact:[2,2]},attempts:[],raw:'held'};const visit=startPostOffice(state,deliveries[0].id);ok(startAdaptiveRival(state));visit.rival.task=generateRivalTask('multiply',2,2,0);
state.syntheticOther={raw:'held'};const before=copy(state),other=state.syntheticOther;
const shown=pairs({...w,forces:[4,0,0]},run(1));ok(c.recordCartDisplay(state,shown,options).changed);ok(state.broad.drafts.waiting.knownFact);ok(state.postOffice.visits.find(v=>v.id===visit.id).rival.priorFactShown);eq(state.broad.drafts.waiting.attempts,[]);eq(state.baseline.observations,before.baseline.observations);assert.equal(state.syntheticOther,other);ok(!Object.hasOwn(state,'cartPrograms'));
const restored=copy(state.postOffice);delete restored.visits.find(v=>v.id===visit.id).rival.priorFactShown;eq(restored,before.postOffice);eq(c.recordCartDisplay(state,shown,options),{ok:true,changed:false});
state.broad.drafts.newWaiting={question:{fact:[2,2]},attempts:[]};ok(c.recordCartDisplay(state,shown,options).changed);ok(state.broad.drafts.newWaiting.knownFact,'Repeated page qualifies newly waiting work');
const node=Object.values(storyNodes).find(n=>n.facts?.some(p=>p.every(x=>Number.isInteger(x)&&x>=2&&x<=8)));ok(node);const fact=node.facts.find(p=>p.every(x=>Number.isInteger(x)&&x>=2&&x<=8));const garden=fresh();garden.garden.visits.push({id:'synthetic',entrance:node.entrance,drafts:{[node.id]:{attempts:[],raw:true}}});const gb=copy(garden.garden);ok(c.recordCartDisplay(garden,[fact],options).ok);ok(garden.garden.visits.at(-1).drafts[node.id].knownFact);delete garden.garden.visits.at(-1).drafts[node.id].knownFact;eq(garden.garden,gb);
const waiting=()=>{const b=fresh();b.broad.drafts.matching={question:{fact:[2,2]},attempts:[]};return b;};
for(const opts of [{...options,canExport:()=>false},{...options,canExport:()=>1},{...options,exposeFacts:()=>{throw Error('synthetic');}}]){const b=waiting(),prev=copy(b);eq(c.recordCartDisplay(b,shown,opts),{ok:false,changed:false});eq(b,prev);}
const safe=waiting();ok(c.recordCartDisplay(safe,shown,{...options,canExport(candidate){candidate.broad=null;candidate.cartPrograms=[];return true;}}).ok);ok(safe.broad.drafts.matching.knownFact);ok(!Object.hasOwn(safe,'cartPrograms'));
// The raw notebook fits but actual pretty Notes wrapper pushes the disclosure over capacity.
const capped=waiting();capped.padding='';const proposed=copy(capped);ok(c.recordCartDisplay(proposed,shown,{...options,canExport:()=>true}).changed);const room=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(proposed,null,2)).length-40;capped.padding='x'.repeat(room);proposed.padding=capped.padding;ok(recoveryFitsProgressLimits(proposed));ok(!canExport(proposed));const capBefore=copy(capped);eq(c.recordCartDisplay(capped,shown,options),{ok:false,changed:false});eq(capped,capBefore);
console.log('Push & Drift: exact predictions, exposure boundaries, immutable programs and actual Notes checks passed.');
