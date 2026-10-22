import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {circuitCases,circuitLinks} from '../dist/lantern-circuit-content.mjs';
import * as c from '../dist/lantern-circuit-core.mjs';
import {circuitDrawing} from '../dist/lantern-circuit-art.mjs';
import {circuitPage,circuitNotes} from '../dist/lantern-circuit-ui.mjs';
let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const seed=()=>initializeExplorerState(freshState()),clone=structuredClone;
const report=s=>({title:'Synthetic observations',exportedAt:'2026-01-01T00:00:00.000Z',note:'Synthetic test',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},...s});
const actual=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const work=s=>c.circuitView(s).work;
const table=['open','open','open','open','open','bypass','glow','bypass','open','glow','bypass','bypass','open','bypass','bypass','bypass'];
// Independent path traversal includes the internal filament only after checking wire-only bypass.
function reachable(mask,filament){const edges=[[0,2],[0,3],[1,2],[1,3]].filter((_,i)=>mask&(1<<i));if(filament)edges.push([2,3]);const seen=new Set([0]);for(let changed=true;changed;){changed=false;for(const [a,b]of edges)if(seen.has(a)!==seen.has(b)){seen.add(a);seen.add(b);changed=true;}}return seen.has(1);}
for(let mask=0;mask<16;mask++){
 eq(c.circuitStatus(mask),table[mask]);eq(c.circuitStatus(mask),reachable(mask,false)?'bypass':reachable(mask,true)?'glow':'open');
 const art=circuitDrawing(mask);eq((art.match(/data-lc-wire=/g)||[]).length,[1,2,4,8].filter(b=>mask&b).length);
 for(const b of [1,4,8])eq(art.includes(`data-lc-gap="${b}"`),!!(mask&2&&mask&b));
 eq(art.includes('data-lc-pause'),table[mask]==='bypass');ok(art.includes('height="36" data-lc-channel'));ok(art.includes('height="17" data-lc-tip'));ok(!art.includes('stroke-width="5"'));
 if(mask&4)ok(art.includes('M55 235 H155 V175 H250 V160 L265 145'));
 if(mask===15){ok(art.includes('V89 Q113 95 105 101 V229 Q113 235 105 241 V260 H184 Q190 252 196 260'));ok(art.includes('M95 95h20'));ok(art.includes('M95 235h20'));ok(art.includes('M190 250v20'));}
 const s=seed();ok(c.startCircuit(s,'open-table',actual));work(s).mask=mask;
 for(const link of circuitLinks){const t=clone(s);ok(c.setCircuitLink(t,link.key,true,actual));eq(work(t).mask,mask|link.bit);ok(c.setCircuitLink(t,link.key,true,actual));eq(work(t).mask,mask|link.bit);ok(c.setCircuitLink(t,link.key,false,actual));eq(work(t).mask,mask&~link.bit);ok(c.setCircuitLink(t,link.key,false,actual));eq(work(t).mask,mask&~link.bit);}
 for(const p of ['learn','connect','kept']){ok(c.setCircuitPage(s,p,actual));eq(work(s).page,p);ok(circuitPage(s).includes('Lantern Circuit Bench'));}
 ok(c.keepCircuit(s,false,actual));const keep=clone(work(s).kept);ok(c.setCircuitLink(s,'ps',!(mask&1),actual));eq(work(s).kept,keep);ok(!c.keepCircuit(s,false,actual));ok(c.keepCircuit(s,true,actual));ok(actual(s));
}
eq(c.circuitStatus(-1),null);eq(c.circuitStatus(16),null);eq(c.circuitStatus('9'),null);
for(const source of circuitCases){ok(c.validCircuitSource(source));const s=seed(),prior=clone(s);ok(!Object.hasOwn(s,'lanternCircuits'));circuitPage(s);circuitNotes(s);eq(s,prior);ok(c.startCircuit(s,source.id,actual));eq(work(s).source,source);eq(work(s).mask,source.initialMask);eq(work(s).page,'learn');const clean=clone(s);for(const attempt of [()=>c.setCircuitPage(s,'bad',actual),()=>c.setCircuitLink(s,'wrong',true,actual),()=>c.setCircuitLink(s,'ps',1,actual),()=>c.startCircuit(s,'not-in-pack',actual)]){ok(!attempt());eq(s,clean);}}
{
 const s=seed();c.startCircuit(s,'one-lead',actual);const w=work(s);w.source.title='An older own-source title';w.source.copy.reference='An older reference';w.source.copy.wireLabels.nt='<own & earlier > label';w.source.example.frames=[{mask:15,caption:'Old paused example'},{mask:6,caption:'Old reverse example'},{mask:0,caption:'Old empty example'}];w.source.future={kept:true};ok(c.validCircuitSource(w.source));ok(c.keepCircuit(s,false,actual));const frozen=clone(work(s).kept);work(s).source.title='Later current source';work(s).mask=9;const kept=c.circuitView(s).kept;eq(kept.source.title,'An older own-source title');eq(kept.mask,1);const file=prepareProgressImport(JSON.stringify(report(s),null,2));ok(file.ok);eq(file.state.lanternCircuits,s.lanternCircuits);ok(circuitPage(s).includes('An older reference'));ok(circuitPage(s).includes('&lt;own &amp; earlier &gt; label'));ok(!circuitPage(s).includes('<own & earlier > label'));const before=clone(file.state);ok(destinationNotes(file.state).includes('Lantern Circuit Bench'));ok(destinationNotes(file.state).includes('An older own-source title')||destinationNotes(file.state).includes('Later current source'));eq(file.state,before,'notes are pure');eq(kept,frozen);
 s.lanternCircuits.cases['retired-id']=clone(work(s));s.lanternCircuits.cases['retired-id'].source.id='retired-id';s.lanternCircuits.cases['retired-id'].kept=null;ok(c.startCircuit(s,'retired-id',actual));eq(work(s).source.title,'Later current source');
 const raw={source:{future:2},mask:9,kept:{future:'untouched'}};s.lanternCircuits.cases['same-contact']=clone(raw);ok(!c.startCircuit(s,'same-contact',actual));eq(s.lanternCircuits.cases['same-contact'],raw);ok(c.startCircuit(s,'reverse-pair',actual));work(s).kept={source:{future:2},mask:9};const bad=clone(work(s).kept);ok(c.circuitView(s).keptUnreadable);ok(!c.keepCircuit(s,true,actual));ok(c.setCircuitLink(s,'ps',true,actual));eq(work(s).kept,bad);ok(circuitPage(s).includes('Earlier'));ok(actual(s));
 const old=clone(s.lanternCircuits);ok(c.recoverCircuits(s,actual));eq(s.lanternCircuits.retainedRaw,old);eq(s.lanternCircuits.cases,{});ok(actual(s));
}
for(const raw of [false,17,'future',[{raw:true}],{version:8,kept:'future'}]){const s=seed();s.lanternCircuits=clone(raw);const parsed=prepareProgressImport(JSON.stringify(report(s),null,2));ok(parsed.ok);eq(parsed.state.lanternCircuits,raw);eq(c.circuitView(s).status,'recovery');ok(c.recoverCircuits(s,actual));eq(s.lanternCircuits.retainedRaw,raw);ok(actual(s));}
{
 const s=seed();c.startCircuit(s,'one-lead',actual);const original=clone(s),mutations=[()=>c.startCircuit(s,'open-table',()=>false),()=>c.setCircuitLink(s,'nt',true,()=>false),()=>c.setCircuitPage(s,'connect',()=>false),()=>c.keepCircuit(s,false,()=>false),()=>c.recoverCircuits(s,()=>false)];for(const fn of mutations){ok(!fn());eq(s,original);}
 s.padding='';s.padding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(JSON.stringify(report(s),null,2)));eq(Buffer.byteLength(JSON.stringify(report(s),null,2)),MAX_IMPORT_BYTES);ok(actual(s));const before=clone(s);ok(!c.startCircuit(s,'open-table',actual));eq(s,before);ok(!c.keepCircuit(s,false,actual));eq(s,before);ok(!c.recoverCircuits(s,actual));eq(s,before);let observed=false;ok(!c.setCircuitLink(s,'nt',true,candidate=>{observed=true;eq(work(candidate).mask,9);eq(work(s).mask,1);return false;}));ok(observed);eq(s,before);
}
{
 const s=seed();let deep={};s.lanternCircuits=deep;for(let i=0;i<59;i++){deep.next={};deep=deep.next;}const before=clone(s);ok(!c.recoverCircuits(s,actual));eq(s,before,'recovery wrapper over depth bound is atomic');
 const long=clone(circuitCases[0]);for(const k of ['reference','idea','contacts','limit','help','talk'])long.copy[k]='é'.repeat(600);for(const k of ['open','glow','bypass']){long.copy.status[k]={title:'x'.repeat(1200),text:'x'.repeat(1200)};long.copy.loop[k]='x'.repeat(1200);}for(const k of circuitLinks)long.copy.wireLabels[k.key]='x'.repeat(1200);for(const f of long.example.frames)f.caption='x'.repeat(1200);ok(c.validCircuitSource(long));long.copy.help+='x';ok(!c.validCircuitSource(long));long.copy.help='Control\nline';ok(!c.validCircuitSource(long));long.copy.help='short';long.future='x'.repeat(33000);ok(!c.validCircuitSource(long));
 const wrong=seed();c.startCircuit(wrong,'one-lead');work(wrong).source.model='future-model';eq(c.circuitView(wrong).readable.length,0);ok(!c.startCircuit(wrong,'one-lead'));ok(c.startCircuit(wrong,'open-table'));eq(c.circuitView(wrong).unreadable.length,1);
}
console.log(`${n} Lantern Circuit checks passed: all16 topologies, own-source boards, raw/Keep and actual-report boundaries.`);
