import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as C from '../dist/living-layers-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
const copy=structuredClone;
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const notesReport=new Function('recommendations','explorerStore',app.split('\n').find(line=>line.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const options={canExport:state=>prepareProgressImport(JSON.stringify(notesReport(state),null,2)).ok};
const book=()=>initializeExplorerState(freshState());
const source=C.layerSource('heart'),work=C.newLayerWork(source);
const refuse=(state,s=source,w=work,opts=options)=>{const before=copy(state);assert.equal(C.keepLayerGuide(state,s,w,opts),false);assert.deepEqual(state,before);};
const others=state=>{const result=copy(state);delete result.layerGuides;return result;};
function* permutations(ids){if(!ids.length){yield [];return;}for(let i=0;i<ids.length;i++)for(const tail of permutations(ids.filter((_,j)=>i!==j)))yield [ids[i],...tail];}
assert.deepEqual(C.layerCases.map(s=>s.id),['heart','leaf']);
for(const {id} of C.layerCases){
 const s=C.layerSource(id),original=copy(s),empty=C.newLayerWork(s);
 assert.ok(C.validLayerSource(s));
 assert.deepEqual(s.nodes.map(n=>n.kind),['cell','tissue','organ','system','organism']);
 assert.deepEqual(new Set(s.trayIds),new Set(s.nodes.map(n=>n.id)));
 assert.equal(s.nodes.find(n=>n.kind==='organ').others.length,id==='heart'?3:2);
 assert.ok(s.nodes.find(n=>n.kind==='system').others.length>0);
 assert.deepEqual(s.teaching.map(t=>t.art),['none','none','none','none','none','yeast']);
 let count=0;
 for(const order of permutations(s.nodes.map(n=>n.id))){
  let w=empty;
  for(const node of order)w=C.changeLayerWork(s,w,'add',node);
  assert.deepEqual(w.order,order);assert.ok(C.validLayerWork(s,w));
  const before=copy(w),reversed=C.changeLayerWork(s,w,'direction','whole-to-part');
  assert.deepEqual(reversed.order,order);assert.deepEqual(w,before);
  const shown=C.changeLayerWork(s,reversed,'compare');assert.equal(shown.comparisonShown,true);assert.deepEqual(shown.order,order);
  const state=book();assert.equal(C.keepLayerGuide(state,s,shown,options),'layer-guide-1');assert.deepEqual(state.layerGuides[0].work,shown);
  const earlier=C.changeLayerWork(s,shown,'earlier',order[2]);assert.deepEqual(earlier.order,[order[0],order[2],order[1],order[3],order[4]]);
  assert.deepEqual(C.changeLayerWork(s,earlier,'later',order[2]).order,order);
  const removed=C.changeLayerWork(s,shown,'remove',order[2]);assert.deepEqual(removed.order,order.filter((_,i)=>i!==2));assert.equal(removed.comparisonShown,true);
  assert.deepEqual(shown.order,order);count++;
 }
 assert.equal(count,120);
 assert.equal(C.keepLayerGuide(book(),s,empty,options),'layer-guide-1');
 const partial=C.changeLayerWork(s,empty,'add',s.trayIds[0]);assert.equal(C.keepLayerGuide(book(),s,partial,options),'layer-guide-1');
 for(const action of ['earlier','later'])assert.equal(C.changeLayerWork(s,partial,action,s.trayIds[0]),null);
 assert.equal(C.changeLayerWork(s,partial,'add',s.trayIds[0]),null);
 let shown=empty;for(let i=0;i<10;i++)shown=C.changeLayerWork(s,shown,'example');assert.equal(shown.exampleSeen,6);assert.deepEqual(shown.order,[]);
 assert.deepEqual(s,original);assert.deepEqual(empty,{v:1,direction:'part-to-whole',order:[],exampleSeen:0,comparisonShown:false});
}
// Catalogue mutation cannot change a subsequently opened source.
const catalogueLabel=C.layerCases[0].nodes[0].label;
C.layerCases[0].nodes[0].label='Synthetic catalogue mutation';assert.equal(C.layerSource('heart').nodes[0].label,catalogueLabel);
C.layerCases[0].nodes[0].label=catalogueLabel;
assert.equal(C.layerSource('unknown'),null);
source.future={synthetic:'source'};work.future={synthetic:'work'};
const changed=C.changeLayerWork(source,work,'example');assert.deepEqual(changed.future,work.future);assert.notEqual(changed.future,work.future);
for(const action of ['add','remove','earlier','later','direction','unsupported'])assert.equal(C.changeLayerWork(source,work,action,'missing'),null);
// Historical source arrays, including unusual repeated kinds, are authoritative.
const historical=copy(source);historical.id='earlier:source!';historical.title='Synthetic earlier path';historical.nodes=[{...historical.nodes[4],id:'old:whole',label:'Earlier whole'}, {...historical.nodes[0],id:'old/part',role:'Earlier selected role.'}];historical.trayIds=['old/part','old:whole'];historical.teaching=[{text:'Earlier explanation.',art:'none'}];
assert.ok(C.validLayerSource(historical));let h=C.newLayerWork(historical);h=C.changeLayerWork(historical,h,'add','old/part');assert.deepEqual(h.order,['old/part']);
const six=copy(source);six.nodes.reverse();six.nodes.push({...six.nodes[0],id:'earlier:six',label:'Synthetic sixth context'});six.trayIds=six.nodes.map(n=>n.id).reverse();six.teaching=Array.from({length:8},(_,i)=>({text:`Synthetic frame ${i}`,art:'none'}));assert.ok(C.validLayerSource(six));let sixWork=C.newLayerWork(six);for(const id of six.trayIds)sixWork=C.changeLayerWork(six,sixWork,'add',id);assert.deepEqual(sixWork.order,six.trayIds);
for(const mutate of [s=>s.nodes=[],s=>s.nodes=s.nodes.slice(0,1),s=>s.nodes=Array(5),s=>s.nodes.push(copy(s.nodes[0])),s=>s.nodes[0].kind='unknown',s=>s.nodes[0].art='https://invalid.test/art',s=>s.nodes[0].id='constructor',s=>s.nodes[0].id='__proto__',s=>s.id='é',s=>s.title='🪴'.repeat(161),s=>s.context='x'.repeat(1501),s=>s.notice='',s=>s.trayIds.pop(),s=>s.trayIds[0]=s.trayIds[1],s=>s.trayIds=Array(5),s=>s.teaching=Array(2),s=>s.teaching[0].art='heart',s=>s.nodes[2].others[0].role='',s=>s.v=2]){const bad=copy(source);mutate(bad);assert.equal(C.validLayerSource(bad),false);}
for(const key of Object.keys(source).filter(k=>k!=='future')){const bad=copy(source);delete bad[key];assert.equal(C.validLayerSource(bad),false,`own source ${key}`);}
for(const [part,keys] of [['nodes',['id','label','kind','levelLabel','role','art','others']],['teaching',['text','art']]])for(const key of keys){const bad=copy(source);delete bad[part][0][key];assert.equal(C.validLayerSource(bad),false);}
assert.equal(C.validLayerSource(Object.create(source)),false);
for(const mutate of [w=>w.order=['h-cell','h-cell'],w=>w.order=['missing'],w=>w.order=Array(1),w=>w.exampleSeen=-1,w=>w.exampleSeen=7,w=>w.exampleSeen=1.5,w=>w.comparisonShown=1,w=>w.direction='up',w=>w.v=2]){const bad=copy(work);mutate(bad);assert.equal(C.validLayerWork(source,bad),false);assert.equal(C.changeLayerWork(source,bad,'compare'),null);}
for(const key of ['v','direction','order','exampleSeen','comparisonShown']){const bad=copy(work);delete bad[key];assert.equal(C.validLayerWork(source,bad),false);}
assert.equal(C.validLayerWork(source,Object.create(work)),false);assert.equal(C.newLayerWork(null),null);
const state=book(),before=copy(state);assert.deepEqual(C.layerGuidesView(state),{status:'absent',items:[],canKeep:true});assert.equal(C.lastLayerGuide(state),null);assert.deepEqual(state,before);
assert.equal(C.keepLayerGuide(state,source,work,options),'layer-guide-1');assert.deepEqual(others(state),before);
state.layerGuides[0].future={synthetic:'outer only'};const original=copy(state.layerGuides[0]);
assert.equal(C.keepLayerGuide(state,historical,h,options),'layer-guide-2');assert.equal(C.keepLayerGuide(state,six,sixWork,options),'layer-guide-3');assert.deepEqual(state.layerGuides[0],original);assert.equal(state.layerGuides[1].future,undefined);
historical.title='Modified after Keep';h.order=[];assert.equal(state.layerGuides[1].source.title,'Synthetic earlier path');assert.deepEqual(state.layerGuides[1].work.order,['old/part']);
state.layerGuides.push({id:'layer-guide-17',source:{v:9},future:'synthetic'},null,{id:'layer-guide-03'},'synthetic raw');
assert.equal(C.keepLayerGuide(state,source,work,options),'layer-guide-18');assert.equal(C.lastLayerGuide(state).index,7);
state.layerGuides.push(copy(state.layerGuides[0]));const view=C.layerGuidesView(state);assert.equal(view.items[0].readable,false);assert.equal(view.items[8].readable,false);assert.equal(view.items[3].readable,false);assert.equal(view.items[4].raw,null);assert.equal(view.items[1].readable,true);
for(let i=0;i<3;i++)assert.ok(C.keepLayerGuide(state,source,work,options));assert.equal(C.lastLayerGuide(state).index,11);assert.equal(state.layerGuides.length,12);
const imported=prepareProgressImport(JSON.stringify(notesReport(state),null,2));assert.ok(imported.ok);assert.deepEqual(imported.state.layerGuides,state.layerGuides,'real Notes round trip retains raw siblings and frozen unknowns');
for(const root of [null,{},'synthetic unsupported root',42]){const b=book();b.layerGuides=root;assert.equal(C.layerGuidesView(b).status,'unavailable');refuse(b);const result=prepareProgressImport(JSON.stringify(notesReport(b),null,2));assert.ok(result.ok);assert.deepEqual(result.state.layerGuides,root);}
for(const invalidBook of [null,[],42]){assert.equal(C.layerGuidesView(invalidBook).canKeep,false);assert.equal(C.keepLayerGuide(invalidBook,source,work,options),false);}
const exhausted=book();exhausted.layerGuides=[{id:'layer-guide-999999'}];assert.equal(C.layerGuidesView(exhausted).canKeep,false);refuse(exhausted);
const noncanonical=book();noncanonical.layerGuides=[{id:'layer-guide-0009'},{id:'layer-guide-1000000'},{id:'layer-guide-4x'}];assert.equal(C.keepLayerGuide(noncanonical,source,work,options),'layer-guide-1');
refuse(state,source,work,{});refuse(state,source,work,{canExport:()=>false});refuse(state,source,work,{canExport:()=>1});refuse(state,source,work,{canExport:()=>{throw Error('Synthetic refusal');}});
const hostile=book(),held=copy(hostile);assert.equal(C.keepLayerGuide(hostile,source,work,{canExport:c=>{c.sessions=999;c.layerGuides[0].source.nodes=[];c.layerGuides[0].work.order=['missing'];c.layerGuides=[];return true;}}),'layer-guide-1');assert.deepEqual(others(hostile),held);assert.deepEqual(hostile.layerGuides[0].work.order,[]);assert.deepEqual(hostile.layerGuides[0].source,source);
const large=book();large.syntheticPadding='';const proposed=copy(large);proposed.layerGuides=[{id:'layer-guide-1',source:copy(source),work:copy(work)}];const bytes=new TextEncoder().encode(JSON.stringify(proposed,null,2)).length;large.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-bytes-10);proposed.syntheticPadding=large.syntheticPadding;assert.ok(recoveryFitsProgressLimits(proposed));assert.equal(options.canExport(proposed),false,'Notes wrapper exceeds bytes while bare state fits');refuse(large);
const complex=book();let nested={};complex.syntheticFuture=nested;for(let i=0;i<61;i++){nested.next={};nested=nested.next;}refuse(complex);
console.log('Living Layers: 240 arbitrary complete orders, partial drafts, immutable actions, historical snapshots, raw shelf and real Notes preflight/transfer passed.');
