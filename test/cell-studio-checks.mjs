import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as C from '../dist/cell-studio-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
const copy=structuredClone;
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const notesReport=new Function('recommendations','explorerStore',app.split('\n').find(line=>line.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const options={canExport:state=>prepareProgressImport(JSON.stringify(notesReport(state),null,2)).ok};
const book=()=>initializeExplorerState(freshState());
const source=C.cellSource('leaf'),work=C.newCellWork(source);
const refuse=(state,s=source,w=work,opts=options)=>{const before=copy(state);assert.equal(C.keepCellModel(state,s,w,opts),false);assert.deepEqual(state,before);};
const others=state=>{const result=copy(state);delete result.cellModels;return result;};
assert.deepEqual(C.cellCases.map(s=>s.id),['leaf','root','cheek']);
const expected={leaf:['wall','membrane','cytoplasm','nucleus','vacuole','mitochondria','ribosomes','chloroplasts'],root:['wall','membrane','cytoplasm','nucleus','vacuole','mitochondria','ribosomes'],cheek:['membrane','cytoplasm','nucleus','mitochondria','ribosomes']};
for(const {id} of C.cellCases){
 const s=C.cellSource(id),original=copy(s),w=C.newCellWork(s);
 assert.ok(C.validCellSource(s));assert.deepEqual(s.parts.filter(p=>p.present).map(p=>p.id),expected[id]);
 // All combinations are valid illustrations, irrespective of reference presence.
 for(let mask=0;mask<256;mask++){
  const ids=s.parts.map(p=>p.id).filter((_,i)=>mask&(1<<i));let draft=w;
  for(const id of ids)draft=C.changeCellWork(s,draft,'part',id);
  assert.deepEqual(draft.selectedIds,ids);assert.ok(C.validCellWork(s,draft));
  const state=book();assert.equal(C.keepCellModel(state,s,draft,options),'cell-model-1');assert.deepEqual(state.cellModels[0].work,draft);
  for(const id of ids)draft=C.changeCellWork(s,draft,'part',id);
  assert.deepEqual(draft.selectedIds,[]);
 }
 assert.deepEqual(s,original);assert.deepEqual(w.selectedIds,[]);
 let shown=w;for(let i=0;i<8;i++)shown=C.changeCellWork(s,shown,'example');
 assert.equal(shown.exampleSeen,3);assert.equal(w.exampleSeen,0);
 assert.equal(C.changeCellWork(s,shown,'compare').comparisonShown,true);
 assert.equal(C.changeCellWork(s,C.changeCellWork(s,shown,'compare'),'compare').comparisonShown,true);
 assert.deepEqual(shown.selectedIds,[],'teaching and compare never autofill');
}
assert.match(source.parts.find(p=>p.id==='nucleus').role,/most.*DNA.*mitochondria.*chloroplasts/);
assert.match(source.parts.find(p=>p.id==='mitochondria').role,/Transfer chemical energy.*ATP.*do not create energy/);
assert.match(source.parts.find(p=>p.id==='vacuole').role,/these plant cells.*Animal cells can have smaller/);
assert.match(source.microscopeNotice,/Ribosomes cannot be resolved.*Mitochondria usually cannot/);
source.future={synthetic:'retained source'};work.future={synthetic:'retained work'};
assert.equal(C.cellSource('leaf').future,undefined);assert.equal(C.cellSource('unknown'),null);
const changed=C.changeCellWork(source,work,'part','wall');assert.deepEqual(changed.future,work.future);assert.notEqual(changed.future,work.future);
assert.equal(C.changeCellWork(source,work,'part','missing'),null);assert.equal(C.changeCellWork(source,work,'reset'),null);

// Historical snapshots own their IDs, text, order and length, including renamed parts.
const historical=copy(source);historical.id='earlier:source!';historical.title='Synthetic earlier cell';historical.parts=[{...historical.parts[5],id:'old:energy'}, {...historical.parts[1],id:'old/boundary'}];historical.teaching=['Synthetic earlier teaching.'];
assert.ok(C.validCellSource(historical));let h=C.newCellWork(historical);h=C.changeCellWork(historical,h,'part','old/boundary');assert.deepEqual(h.selectedIds,['old/boundary']);
const narrow=copy(historical);narrow.parts=narrow.parts.slice(0,1);assert.ok(C.validCellSource(narrow));
const wide=copy(source);wide.teaching=Array.from({length:6},(_,i)=>`Synthetic frame ${i}`);assert.ok(C.validCellSource(wide));
for(const mutate of [s=>s.parts=[],s=>s.parts.push(copy(s.parts[0])),s=>s.parts[0].symbol='unknown',s=>s.parts[1].symbol=s.parts[0].symbol,s=>s.parts[1].id=s.parts[0].id,s=>s.parts[0].present=1,s=>s.parts[0].id='constructor',s=>s.parts[0].id='prototype',s=>s.parts[0].id='__proto__',s=>s.id='é',s=>delete s.notice,s=>s.title='🪴'.repeat(161),s=>s.job='x'.repeat(1501),s=>s.context='',s=>s.teaching=Array(3),s=>s.parts=Array(3),s=>s.v=2,s=>s.outline='square']){const bad=copy(source);mutate(bad);assert.equal(C.validCellSource(bad),false);}
for(const key of Object.keys(source).filter(k=>k!=='future')){const bad=copy(source);delete bad[key];assert.equal(C.validCellSource(bad),false,`own source ${key}`);}
assert.equal(C.validCellSource(Object.create(source)),false);
for(const key of ['id','label','role','symbol','present']){const bad=copy(source);bad.parts[0]=Object.create(bad.parts[0]);Object.assign(bad.parts[0],source.parts[0]);delete bad.parts[0][key];assert.equal(C.validCellSource(bad),false);}
for(const mutate of [w=>w.selectedIds=['wall','wall'],w=>w.selectedIds=['missing'],w=>w.selectedIds=Array(1),w=>w.exampleSeen=-1,w=>w.exampleSeen=4,w=>w.exampleSeen=1.5,w=>w.comparisonShown=1,w=>w.v=2]){const bad=copy(work);mutate(bad);assert.equal(C.validCellWork(source,bad),false);assert.equal(C.changeCellWork(source,bad,'example'),null);}
for(const key of ['v','selectedIds','exampleSeen','comparisonShown']){const bad=copy(work);delete bad[key];assert.equal(C.validCellWork(source,bad),false);}
assert.equal(C.validCellWork(source,Object.create(work)),false);assert.equal(C.newCellWork(null),null);

const state=book(),before=copy(state);assert.deepEqual(C.cellModelsView(state),{status:'absent',items:[],canKeep:true});assert.equal(C.lastCellModel(state),null);assert.deepEqual(state,before);
assert.equal(C.keepCellModel(state,source,work,options),'cell-model-1');assert.deepEqual(others(state),before);
state.cellModels[0].future={synthetic:'outer only'};const original=copy(state.cellModels[0]);
assert.equal(C.keepCellModel(state,historical,h,options),'cell-model-2');assert.deepEqual(state.cellModels[0],original);assert.equal(state.cellModels[1].future,undefined);
historical.title='Modified after Keep';h.selectedIds=[];assert.equal(state.cellModels[1].source.title,'Synthetic earlier cell');assert.deepEqual(state.cellModels[1].work.selectedIds,['old/boundary']);
state.cellModels.push({id:'cell-model-17',source:{v:9},future:'synthetic'},null,{id:'cell-model-03'},'synthetic raw');
assert.equal(C.keepCellModel(state,source,work,options),'cell-model-18');assert.equal(C.lastCellModel(state).index,6);
state.cellModels.push(copy(state.cellModels[0]));let view=C.cellModelsView(state);assert.equal(view.items[0].readable,false);assert.equal(view.items[7].readable,false);assert.equal(view.items[2].readable,false);assert.equal(view.items[3].raw,null);assert.equal(view.items[1].readable,true);
for(let i=0;i<3;i++)assert.ok(C.keepCellModel(state,source,work,options));assert.equal(C.lastCellModel(state).index,10);assert.equal(state.cellModels.length,11);
const imported=prepareProgressImport(JSON.stringify(notesReport(state),null,2));assert.ok(imported.ok);assert.deepEqual(imported.state.cellModels,state.cellModels,'real Notes round trip keeps raw siblings and unknown fields');
for(const root of [null,{},'synthetic unsupported root',42]){const b=book();b.cellModels=root;assert.equal(C.cellModelsView(b).status,'unavailable');refuse(b);const result=prepareProgressImport(JSON.stringify(notesReport(b),null,2));assert.ok(result.ok);assert.deepEqual(result.state.cellModels,root);}
const exhausted=book();exhausted.cellModels=[{id:'cell-model-999999'}];assert.equal(C.cellModelsView(exhausted).canKeep,false);refuse(exhausted);
const noncanonical=book();noncanonical.cellModels=[{id:'cell-model-0009'},{id:'cell-model-1000000'},{id:'cell-model-4x'}];assert.equal(C.keepCellModel(noncanonical,source,work,options),'cell-model-1');
refuse(state,source,work,{});refuse(state,source,work,{canExport:()=>false});refuse(state,source,work,{canExport:()=>{throw Error('Synthetic refusal');}});
const hostile=book(),held=copy(hostile);assert.equal(C.keepCellModel(hostile,source,work,{canExport:c=>{c.sessions=999;c.cellModels[0].work.selectedIds=['wall'];c.cellModels=[];return true;}}),'cell-model-1');assert.deepEqual(others(hostile),held);assert.deepEqual(hostile.cellModels[0].work.selectedIds,[]);
const large=book();large.syntheticPadding='';const proposed=copy(large);proposed.cellModels=[{id:'cell-model-1',source:copy(source),work:copy(work)}];const bytes=new TextEncoder().encode(JSON.stringify(proposed,null,2)).length;large.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-bytes-10);proposed.syntheticPadding=large.syntheticPadding;assert.ok(recoveryFitsProgressLimits(proposed));assert.equal(options.canExport(proposed),false,'Notes wrapper exceeds bytes while bare state fits');refuse(large);
const complex=book();let nested={};complex.syntheticFuture=nested;for(let i=0;i<61;i++){nested.next={};nested=nested.next;}refuse(complex);
console.log('Cell Studio: finite biology, 768 arbitrary drawings, frozen historical work, raw shelf and actual Notes preflight checks passed.');
