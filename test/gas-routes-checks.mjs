import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as C from '../dist/gas-routes-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
const copy=structuredClone,book=()=>initializeExplorerState(freshState());
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const notesReport=new Function('recommendations','explorerStore',app.split('\n').find(line=>line.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const options={canExport:b=>prepareProgressImport(JSON.stringify(notesReport(b),null,2)).ok};
const s=C.gasSource('oxygen'),w=C.newGasWork(s),change=(work,a,v,source=s)=>C.changeGasWork(source,work,a,v);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≈ ${b}`);
assert.equal(C.gasSource('missing'),null);assert.deepEqual(w,{v:1,at:'outside',seen:['outside'],guide:[],referenceShown:false,exampleSeen:0});
for(const source of C.gasCases){
 assert.ok(C.validGasSource(source));assert.ok(C.validGasWork(source,C.newGasWork(source)));
 for(let i=0;i<4;i++){
  const g=C.gasLegGeometry(source,source.legs[i].id),a=source.nodes[i],b=source.nodes[i+1];
  // Independent expected horizontal endpoints and triangle, in both directions.
  const sign=source.id==='oxygen'?1:-1;
  assert.deepEqual(g.start,{x:a.x+sign*63,y:230});assert.deepEqual(g.end,{x:b.x-sign*63,y:230});
  assert.deepEqual(g.head,[g.end,{x:g.end.x-sign*25.2,y:230+sign*8.4},{x:g.end.x-sign*25.2,y:230-sign*8.4}]);
  near(g.radius,63);near(g.fontSize,87.5);near(g.strokeWidth,5.6);assert.ok(g.fontSize*280/source.world.width>=16);
 }
}
assert.equal(C.gasLegGeometry(s,'missing'),null);
let edited=change(w,'station','cell');assert.deepEqual(edited.seen,['outside','cell']);edited=change(edited,'station','outside');assert.deepEqual(edited.seen,['outside','cell']);assert.equal(edited.at,'outside');assert.deepEqual(w.seen,['outside']);
edited=change(edited,'label',{legId:'leg-3',methodId:'air'});edited=change(edited,'label',{legId:'leg-1',methodId:'blood'});
edited.guide[0].future={entry:1};edited.future={work:2};s.nodes[0].future={node:3};s.future={source:4};
const before=copy({s,edited});edited=change(edited,'label',{legId:'leg-3',methodId:'diffusion'});assert.deepEqual(edited.guide,[{legId:'leg-3',methodId:'diffusion',future:{entry:1}},{legId:'leg-1',methodId:'blood'}]);assert.deepEqual(before.s,s);assert.equal(before.edited.guide[0].methodId,'air');
const removed=change(edited,'remove','leg-1');assert.deepEqual(removed.guide,[edited.guide[0]]);assert.deepEqual(removed.future,{work:2});assert.notEqual(removed.guide[0].future,edited.guide[0].future);
const supported=change(edited,'reference');assert.equal(supported.referenceShown,true);assert.equal(edited.referenceShown,false);let helped=supported;for(let i=0;i<10;i++)helped=change(helped,'example');assert.equal(helped.exampleSeen,4);assert.deepEqual(helped.guide,edited.guide);assert.deepEqual(helped.seen,edited.seen);
for(const [a,v] of [['station','unknown'],['label',{legId:'leg-1',methodId:'missing'}],['label',{legId:'missing',methodId:'air'}],['remove','missing'],['unknown',null]])assert.equal(change(edited,a,v),null);
// Historical counts, own punctuation IDs, repeated labels, partial guides, help lengths.
function historical(count,methods=2){
 const h=copy(s);h.id='earlier/source!';h.world={width:2000,height:1000};
 const positions=[[150,200],[650,200],[1150,200],[1650,200],[1650,750],[1150,750],[650,750],[150,750]];
 h.nodes=positions.slice(0,count).map(([x,y],i)=>({id:`stop[${i}]!`,label:'Historical stop',art:['outside','sac','blood','cell'][i%4],description:'An earlier description.',x,y,future:{node:i}}));
 h.methods=Array.from({length:methods},(_,i)=>({id:`method:${i}/?`,label:'Earlier method',description:'A historical method.',future:i}));
 h.legs=h.nodes.slice(1).map((n,i)=>({id:`link.${i}#`,from:h.nodes[i].id,to:n.id,methodId:h.methods[i%methods].id,text:'An earlier reference.',future:i}));h.teaching=Array.from({length:count},(_,i)=>`Historical help ${i}.`);return h;
}
for(let count=2;count<=8;count++)for(const methods of [1,6]){const h=historical(count,methods);assert.ok(C.validGasSource(h),`historical ${count}/${methods}`);let hw=C.newGasWork(h);hw=C.changeGasWork(h,hw,'station',h.nodes.at(-1).id);assert.deepEqual(hw.seen,[h.nodes[0].id,h.nodes.at(-1).id]);hw=C.changeGasWork(h,hw,'label',{legId:h.legs.at(-1).id,methodId:h.methods.at(-1).id});assert.ok(C.validGasWork(h,hw));for(let i=0;i<10;i++)hw=C.changeGasWork(h,hw,'example');assert.equal(hw.exampleSeen,count);}
// Independent 3-4-5 diagonal expectations and reversal; no x-order assumption.
const diagonal=historical(2);diagonal.nodes[0].x=200;diagonal.nodes[0].y=200;diagonal.nodes[1].x=600;diagonal.nodes[1].y=500;
for(const reverse of [false,true]){const d=copy(diagonal);if(reverse){d.nodes.reverse();d.legs[0].from=d.nodes[0].id;d.legs[0].to=d.nodes[1].id;}assert.ok(C.validGasSource(d));const g=C.gasLegGeometry(d,d.legs[0].id),sign=reverse?-1:1;near(g.start.x,d.nodes[0].x+sign*72);near(g.start.y,d.nodes[0].y+sign*54);near(g.end.x,d.nodes[1].x-sign*72);near(g.end.y,d.nodes[1].y-sign*54);near(g.head[1].x,g.end.x-sign*(28.8+7.2));near(g.head[1].y,g.end.y-sign*21.6+sign*9.6);near(g.headWidth,24);near(g.headLength,36);}
for(const mutate of [x=>x.world.width=999,x=>x.world.height=1001,x=>x.world.width=1400.5,x=>x.nodes[0].x=75,x=>x.nodes[1].x=200,x=>x.nodes[0].y=Infinity,x=>x.nodes[1].id=x.nodes[0].id,x=>x.legs[0].from='cell',x=>x.legs[0].to='outside',x=>x.legs[0].methodId='missing',x=>x.methods[0].id='constructor',x=>x.nodes=Array(2),x=>x.legs=Array(4),x=>x.methods=Array(1),x=>x.teaching=Array(2),x=>x.teaching=[''],x=>x.gas.symbol='url',x=>x.title='',x=>x.id='__proto__',x=>x.nodes[0].description='x'.repeat(1501)]){const bad=copy(s);mutate(bad);assert.equal(C.validGasSource(bad),false);assert.equal(C.newGasWork(bad),null);}
const blocked=historical(3);blocked.nodes[0]={...blocked.nodes[0],x:200,y:200};blocked.nodes[1]={...blocked.nodes[1],x:1200,y:200};blocked.nodes[2]={...blocked.nodes[2],x:700,y:250};assert.equal(C.validGasSource(blocked),false,'long center segment cannot pass through unrelated station');
for(const key of Object.keys(s).filter(k=>k!=='future')){const bad=copy(s);delete bad[key];assert.equal(C.validGasSource(bad),false,`source owns ${key}`);}assert.equal(C.validGasSource(Object.create(s)),false);
for(const mutate of [x=>x.v=2,x=>x.at='missing',x=>x.seen=['cell'],x=>x.seen=['outside','outside'],x=>x.seen=Array(1),x=>x.guide=Array(1),x=>x.guide=[{legId:'leg-1',methodId:'missing'}],x=>x.guide=[{legId:'leg-1',methodId:'air'},{legId:'leg-1',methodId:'blood'}],x=>x.referenceShown=1,x=>x.exampleSeen=5,x=>x.exampleSeen=-1]){const bad=copy(w);mutate(bad);assert.equal(C.validGasWork(s,bad),false);}for(const key of Object.keys(w)){const bad=copy(w);delete bad[key];assert.equal(C.validGasWork(s,bad),false);}
const b=book(),empty=copy(b);assert.deepEqual(C.gasGuidesView(b),{status:'absent',items:[],canKeep:true});assert.equal(C.lastGasGuide(b),null);assert.deepEqual(b,empty);
assert.equal(C.keepGasGuide(b,s,edited,options),'gas-guide-1');b.gasGuides[0].future={outer:1};const first=copy(b.gasGuides[0]);const h=historical(3),hw=C.newGasWork(h);assert.equal(C.keepGasGuide(b,h,hw,options),'gas-guide-2');assert.deepEqual(b.gasGuides[0],first);assert.equal(b.gasGuides[1].future,undefined);h.nodes[0].label='Changed';hw.at=h.nodes[1].id;assert.equal(b.gasGuides[1].source.nodes[0].label,'Historical stop');assert.equal(b.gasGuides[1].work.at,'stop[0]!');
b.gasGuides.push({id:'gas-guide-17',source:{}},null,{id:'gas-guide-03'},'synthetic raw');assert.equal(C.keepGasGuide(b,s,w,options),'gas-guide-18');b.gasGuides.push(copy(first));let view=C.gasGuidesView(b);assert.equal(view.items[0].readable,false);assert.equal(view.items[7].readable,false);assert.equal(view.items[1].readable,true);assert.equal(view.items.length,8);assert.equal(view.items[3].raw,null);for(let i=0;i<3;i++)assert.ok(C.keepGasGuide(b,s,w,options));assert.equal(C.lastGasGuide(b).index,10);assert.equal(C.gasGuidesView(b).items.slice(8,16).length,3);
const imported=prepareProgressImport(JSON.stringify(notesReport(b),null,2));assert.ok(imported.ok);assert.deepEqual(imported.state.gasGuides,b.gasGuides);
const refusal=(state,opts=options)=>{const before=copy(state);assert.equal(C.keepGasGuide(state,s,w,opts),false);assert.deepEqual(state,before);};
for(const root of [null,{},'synthetic unsupported',42]){const state=book();state.gasGuides=root;assert.equal(C.gasGuidesView(state).status,'unavailable');refusal(state);const roundtrip=prepareProgressImport(JSON.stringify(notesReport(state),null,2));assert.ok(roundtrip.ok);assert.deepEqual(roundtrip.state.gasGuides,root);}
const exhausted=book();exhausted.gasGuides=[{id:'gas-guide-999999'}];refusal(exhausted);const noncanonical=book();noncanonical.gasGuides=[{id:'gas-guide-0009'},{id:'gas-guide-1000000'},{id:'gas-guide-4x'}];assert.equal(C.keepGasGuide(noncanonical,s,w,options),'gas-guide-1');
refusal(b,{});refusal(b,{canExport:()=>false});refusal(b,{canExport:()=>{throw Error('Synthetic refusal');}});refusal(b,{canExport:c=>{c.gasGuides=[];c.sessions=-1;return false;}});
const hostile=book(),untouched=copy(hostile);assert.equal(C.keepGasGuide(hostile,s,edited,{canExport:c=>{c.sessions=999;c.gasGuides[0].work.guide=[];c.gasGuides=[];return true;}}),'gas-guide-1');const rest=copy(hostile);delete rest.gasGuides;assert.deepEqual(rest,untouched);assert.deepEqual(hostile.gasGuides[0].work,edited);
const capacity=book();capacity.syntheticOtherRoom={retained:'unchanged'};for(let i=0;i<25;i++)assert.ok(C.keepGasGuide(capacity,s,helped,options));const roundtrip=prepareProgressImport(JSON.stringify(notesReport(capacity),null,2));assert.ok(roundtrip.ok);assert.deepEqual(roundtrip.state.gasGuides,capacity.gasGuides);assert.deepEqual(capacity.syntheticOtherRoom,{retained:'unchanged'});
const large=book();large.syntheticPadding='';const proposal=copy(large);proposal.gasGuides=[{id:'gas-guide-1',source:copy(s),work:copy(w)}];const paddedBytes=new TextEncoder().encode(JSON.stringify(proposal,null,2)).length;large.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-paddedBytes-10);proposal.syntheticPadding=large.syntheticPadding;assert.ok(recoveryFitsProgressLimits(proposal));assert.equal(options.canExport(proposal),false,'Notes wrapper exceeds limit though bare proposal fits');refusal(large);
const tooLarge=book();tooLarge.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES);let called=false;refusal(tooLarge,{canExport:()=>{called=true;return true;}});assert.equal(called,false,'shared bounds precede callback');
console.log('Air and blood: numeric direction/diagonal geometry, source-owned historical paths, immutable choices, raw shelf recovery and atomic real Notes limits passed.');
