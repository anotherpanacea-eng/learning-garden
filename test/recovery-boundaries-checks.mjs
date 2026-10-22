import assert from 'node:assert/strict';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {startWillowWalk} from '../dist/willow-path-core.mjs';
import {recoverFieldKit} from '../dist/field-kit-core.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(x,m)=>{assert.ok(x,m);count++;};
const bytes=s=>new TextEncoder().encode(JSON.stringify(s,null,2)).length;
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-22T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
for(const key of ['willowPath','fieldKit']){
 const recover=(s,cb)=>key==='willowPath'?startWillowWalk(s,'two',cb):recoverFieldKit(s,cb);
 for(const depth of [58,59]){
  const s=initializeExplorerState(freshState());let raw='kept';for(let i=0;i<depth;i++)raw=[raw];s[key]=raw;ok(canExport(s),'earlier report is importable');const old=structuredClone(s);
  eq(recover(s,canExport),depth===58);if(depth===59)eq(s,old,'depth refusal leaves entire notebook unchanged');else{ok(canExport(s));eq(key==='willowPath'?s[key].retainedRaw:s[key].recovered,old[key]);}
 }
 // Tune against actual UTF-8, pretty-serialized candidate bytes, including
 // multibyte source characters. No permanent size registry or hash is needed.
 const source=initializeExplorerState(freshState());source[key]={version:99,unicode:'🌱',padding:''};const trial=structuredClone(source);ok(recover(trial));
 source[key].padding='x'.repeat(MAX_IMPORT_BYTES-bytes(trial));const coreEdge=structuredClone(source);ok(recover(coreEdge));eq(bytes(coreEdge),MAX_IMPORT_BYTES,'exact shared byte boundary admitted');ok(!canExport(coreEdge),'real report metadata also needs headroom');
 const before=structuredClone(source);ok(prepareProgressImport(JSON.stringify(source,null,2)).ok);const hostSource=structuredClone(before),over=bytes(report(hostSource))-MAX_IMPORT_BYTES;if(over>0)hostSource[key].padding=hostSource[key].padding.slice(0,-over);ok(canExport(hostSource));const hostBefore=structuredClone(hostSource);ok(!recover(hostSource,canExport),'host callback protects actual report');eq(hostSource,hostBefore,'report-limit refusal is atomic');
 const above=structuredClone(before);above[key].padding+='x';ok(prepareProgressImport(JSON.stringify(above,null,2)).ok);const old=structuredClone(above);ok(!recover(above),'one byte over core boundary refused even without callback');eq(above,old);
 const exactReport=structuredClone(before),extra=bytes(report(coreEdge))-MAX_IMPORT_BYTES;exactReport[key].padding=exactReport[key].padding.slice(0,-extra);ok(recover(exactReport,canExport));eq(bytes(report(exactReport)),MAX_IMPORT_BYTES,'exact report boundary admitted');ok(canExport(exactReport));
 const small=initializeExplorerState(freshState());small[key]={version:99,earlier:'kept'};const prior=structuredClone(small);ok(!recover(small,()=>false));eq(small,prior,'explicit callback refusal atomic');ok(recover(small,canExport));ok(canExport(small));
}
// Ordinary fresh/replacement walks do not acquire recovery gating.
{
 const s=initializeExplorerState(freshState());ok(startWillowWalk(s,'two',()=>false));ok(startWillowWalk(s,'solo',()=>false));eq(s.willowPath.walk.mode,'solo');
}
console.log(`${count} retained-raw recovery depth/UTF-8/report-boundary checks passed.`);
