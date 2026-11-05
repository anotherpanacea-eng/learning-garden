import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as C from '../dist/photo-study-core.mjs';
import {lensSource,newLensWork,keepLensView} from '../dist/lens-bench-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
const copy=structuredClone;
// Use the actual app's Notes exporter and importer, rather than a local wrapper substitute.
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const notesReport=new Function('recommendations','explorerStore',app.split('\n').find(line=>line.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const options={canExport:b=>prepareProgressImport(JSON.stringify(notesReport(b),null,2)).ok};
const book=()=>initializeExplorerState(freshState());
const lens=lensSource('crossed'),s=C.photoStudySource(lens.photo,{zoom:2,x:.25,y:.75}),w=C.newPhotoStudyWork(s);
const change=(work,a,v,source=s)=>C.changePhotoStudyWork(source,work,a,v);
const refusal=(b,opts=options)=>{const before=copy(b);assert.equal(C.keepPhotoStudy(b,s,w,opts),false);assert.deepEqual(b,before);};
assert.ok(C.validPhotoStudySource(s));assert.ok(C.validPhotoStudyWork(s,w));
assert.deepEqual(w,{v:1,strokes:[],labels:[],caption:'',exampleSeen:0});
assert.deepEqual(C.decodeStudyPoints('0,750 1000,0 14,28'),[{x:0,y:750},{x:1000,y:0},{x:14,y:28}]);
assert.equal(C.encodeStudyPoints([{x:0,y:750},{x:1000,y:0}]),'0,750 1000,0');
for(const value of ['', ' 1,2','1,2 ','01,2','1,02','-1,2','1.0,2','1,2  3,4','1,2\n','1e2,2','2001,2','1,Infinity','<path/>',[],null])assert.equal(C.decodeStudyPoints(value),null,JSON.stringify(value));
for(const value of [[],Array(1),[{x:-1,y:0}],[{x:0.5,y:0}],[{x:2001,y:0}],[{x:0,y:Infinity}]])assert.equal(C.encodeStudyPoints(value),null);
const dot=change(w,'addStroke',{points:'10,20'});assert.deepEqual(dot.strokes,[{id:'s1',points:'10,20'}]);assert.equal(w.strokes.length,0);
let edited=change(dot,'addLabel');assert.deepEqual(edited.labels,[{id:'l1',kind:'notice',text:'',at:null}]);
edited=change(edited,'labelText',{id:'l1',text:'A border  '});edited=change(edited,'labelKind',{id:'l1',kind:'question'});edited=change(edited,'placeLabel',{id:'l1',at:{x:1000,y:750}});edited=change(edited,'caption','Which patch?  ');
assert.deepEqual(edited.labels,[{id:'l1',kind:'question',text:'A border  ',at:{x:1000,y:750}}]);assert.equal(edited.caption,'Which patch?  ');
const beforeHelp=copy(edited);for(let i=0;i<8;i++)edited=change(edited,'example');assert.equal(edited.exampleSeen,4);assert.deepEqual(edited.strokes,beforeHelp.strokes);assert.deepEqual(edited.labels,beforeHelp.labels);assert.equal(edited.caption,beforeHelp.caption);
const cleared=change(edited,'clear');assert.deepEqual(cleared.strokes,[]);assert.deepEqual(cleared.labels,[]);assert.equal(cleared.caption,'Which patch?  ');assert.equal(cleared.exampleSeen,4);
assert.deepEqual(change(edited,'removeStroke','s1').strokes,[]);assert.deepEqual(change(edited,'removeLabel','l1').labels,[]);
assert.equal(change(change(dot,'addStroke',{points:'1,2'}),'removeStroke','s1').strokes[0].id,'s2');assert.equal(change(change(dot,'removeStroke','s1'),'addStroke',{points:'1,2'}).strokes[0].id,'s1');
for(const [a,v] of [['addStroke',{points:'1001,0'}],['addLabel','answer'],['labelKind',{id:'l1',kind:'correct'}],['labelText',{id:'missing',text:''}],['placeLabel',{id:'l1',at:{x:0,y:751}}],['removeStroke','missing'],['removeLabel','missing'],['caption',null],['unknown',0]])assert.equal(change(edited,a,v),null);
const unicode='🟩';assert.ok(change(w,'caption',unicode.repeat(600)));assert.equal(change(w,'caption',unicode.repeat(601)),null);assert.ok(change(edited,'labelText',{id:'l1',text:unicode.repeat(160)}));assert.equal(change(edited,'labelText',{id:'l1',text:unicode.repeat(161)}),null);
// Every accepted action preserves unknown fields and leaves its inputs untouched.
s.future={synthetic:'source'};s.photo.future={synthetic:'photo'};s.paper.future={synthetic:'paper'};w.future={synthetic:'work'};
const initial=copy({s,w}),future=change(w,'caption','Kept text');assert.deepEqual({s,w},initial);assert.deepEqual(future.future,w.future);assert.notEqual(future.future,w.future);assert.deepEqual(C.photoStudySource(lens.photo,{zoom:1,x:.5,y:.5}).photo,lens.photo);assert.equal(lens.photo.future,undefined);
// Historical paper and example each use their own bounds, titles, zooms and help count.
const old=copy(s);old.id='earlier/source!';old.title='Earlier drawing';old.paper={width:130,height:170,future:4};old.photo.zooms=[1,1.3,8];old.photoView={zoom:8,x:.0625,y:.9375};old.teaching=['Earlier final frame.'];old.example.paper={width:1500,height:1800};old.example.strokes=[{id:'earlier-line',points:'1500,1800 0,0'}];old.example.labels[0].at={x:1500,y:1800};assert.ok(C.validPhotoStudySource(old));let ow=C.newPhotoStudyWork(old);ow=C.changePhotoStudyWork(old,ow,'addStroke',{points:'130,170'});assert.ok(ow);assert.equal(C.changePhotoStudyWork(old,ow,'addStroke',{points:'131,170'}),null);assert.equal(C.changePhotoStudyWork(old,ow,'example').exampleSeen,1);
for(const count of [1,2,3,8]){const h=copy(old);h.teaching=Array(count).fill('Historical frame.');assert.ok(C.validPhotoStudySource(h));let hw=C.newPhotoStudyWork(h);for(let i=0;i<10;i++)hw=C.changePhotoStudyWork(h,hw,'example');assert.equal(hw.exampleSeen,count);}
for(const mutate of [x=>x.paper.width=99,x=>x.paper.height=2001,x=>x.paper.width=100.5,x=>x.photo.art='url',x=>x.photo.zooms=[2],x=>x.photo.zooms=[1,1],x=>x.photo.zooms=Array(2),x=>x.photoView.x=.249,x=>x.photoView.zoom=3,x=>x.teaching=[],x=>x.teaching=Array(2),x=>x.teaching=[''],x=>x.id='constructor',x=>x.title='',x=>x.context='',x=>x.example.labels[0].at.x=1001,x=>x.example.strokes[0].points='0,751']){const bad=copy(s);mutate(bad);assert.equal(C.validPhotoStudySource(bad),false);assert.equal(C.newPhotoStudyWork(bad),null);}
for(const key of Object.keys(s).filter(k=>k!=='future')){const bad=copy(s);delete bad[key];assert.equal(C.validPhotoStudySource(bad),false,`source owns ${key}`);}
assert.equal(C.validPhotoStudySource(Object.create(s)),false);
for(const mutate of [x=>x.v=2,x=>x.exampleSeen=5,x=>x.exampleSeen=-1,x=>x.strokes=Array(1),x=>x.labels=Array(1),x=>x.strokes=[{id:'toString',points:'1,2'}],x=>x.strokes=[{id:'a',points:'1,2'},{id:'a',points:'2,3'}],x=>x.labels=[{id:'a',kind:'notice',text:'',at:null},{id:'a',kind:'idea',text:'',at:null}]]){const bad=copy(w);mutate(bad);assert.equal(C.validPhotoStudyWork(s,bad),false);}
for(const key of ['v','strokes','labels','caption','exampleSeen']){const bad=copy(w);delete bad[key];assert.equal(C.validPhotoStudyWork(s,bad),false);}
const points=n=>Array.from({length:n},(_,i)=>`${i%1001},${i%751}`).join(' ');
const full=copy(w);full.strokes=Array.from({length:8},(_,i)=>({id:`s${i+1}`,points:points(i===7?416:512)}));assert.ok(C.validPhotoStudyWork(s,full));assert.equal(full.strokes.reduce((n,x)=>n+C.decodeStudyPoints(x.points).length,0),4000);assert.equal(change(full,'addStroke',{points:'0,0'}),null);assert.equal(C.decodeStudyPoints(points(513)),null);
const manyStrokes=copy(w);manyStrokes.strokes=Array.from({length:128},(_,i)=>({id:`s${i+1}`,points:'0,0'}));assert.ok(C.validPhotoStudyWork(s,manyStrokes));assert.equal(change(manyStrokes,'addStroke',{points:'0,0'}),null);
let manyLabels=copy(w);for(let i=0;i<32;i++)manyLabels=change(manyLabels,'addLabel');assert.equal(manyLabels.labels.length,32);assert.equal(change(manyLabels,'addLabel'),null);
const bytes=x=>new TextEncoder().encode(JSON.stringify(x)).length;
const budgetSource=copy(s),budgetWork=copy(w);budgetWork.syntheticPadding='';const base=bytes({source:budgetSource,work:budgetWork});budgetWork.syntheticPadding='x'.repeat(100000-base);assert.equal(bytes({source:budgetSource,work:budgetWork}),100000);assert.ok(C.validPhotoStudyWork(budgetSource,budgetWork));budgetWork.syntheticPadding+='x';assert.equal(C.validPhotoStudyWork(budgetSource,budgetWork),false);
const combined=copy(s);combined.syntheticPadding='x'.repeat(96000);assert.ok(C.validPhotoStudySource(combined));assert.equal(C.validPhotoStudyWork(combined,full),false,'individually valid geometry exceeds combined bytes; never shortened');assert.equal(full.strokes.length,8);
// Preserve raw slots, reserve unreadable canonical numbers, and make duplicates unreadable.
const b=book(),empty=copy(b);assert.deepEqual(C.photoStudiesView(b),{status:'absent',items:[],canKeep:true});assert.equal(C.lastPhotoStudy(b),null);assert.deepEqual(b,empty);
assert.equal(C.keepPhotoStudy(b,s,w,options),'photo-study-1');b.photoStudies[0].future='outer only';const first=copy(b.photoStudies[0]);assert.equal(C.keepPhotoStudy(b,old,ow,options),'photo-study-2');assert.deepEqual(b.photoStudies[0],first);assert.equal(b.photoStudies[1].future,undefined);old.title='Changed';ow.caption='Changed';assert.equal(b.photoStudies[1].source.title,'Earlier drawing');assert.equal(b.photoStudies[1].work.caption,'');
b.photoStudies.push({id:'photo-study-17',source:{}},null,{id:'photo-study-03'},'synthetic raw');assert.equal(C.keepPhotoStudy(b,s,w,options),'photo-study-18');b.photoStudies.push(copy(first));let shelf=C.photoStudiesView(b);assert.equal(shelf.items[0].readable,false);assert.equal(shelf.items[7].readable,false);assert.equal(shelf.items[1].readable,true);assert.equal(shelf.items.length,8);
for(let i=0;i<3;i++)assert.ok(C.keepPhotoStudy(b,s,w,options));assert.equal(C.lastPhotoStudy(b).index,10);assert.equal(C.photoStudiesView(b).items.slice(8,16).length,3,'pages address raw slots, not readable records');
const imported=prepareProgressImport(JSON.stringify(notesReport(b),null,2));assert.ok(imported.ok);assert.deepEqual(imported.state.photoStudies,b.photoStudies);
for(const root of [null,{},'synthetic unsupported',42]){const state=book();state.photoStudies=root;assert.equal(C.photoStudiesView(state).status,'unavailable');refusal(state);const transport=prepareProgressImport(JSON.stringify(notesReport(state),null,2));assert.ok(transport.ok);assert.deepEqual(transport.state.photoStudies,root);}
const exhausted=book();exhausted.photoStudies=[{id:'photo-study-999999'}];assert.equal(C.photoStudiesView(exhausted).canKeep,false);refusal(exhausted);
const noncanonical=book();noncanonical.photoStudies=[{id:'photo-study-0009'},{id:'photo-study-1000000'},{id:'photo-study-4x'}];assert.equal(C.keepPhotoStudy(noncanonical,s,w,options),'photo-study-1');
refusal(b,{});refusal(b,{canExport:()=>false});refusal(b,{canExport:()=>{throw Error('Synthetic refusal');}});
const hostile=book(),untouched=copy(hostile);assert.equal(C.keepPhotoStudy(hostile,s,w,{canExport:c=>{c.sessions=999;c.photoStudies[0].work.caption='hostile';c.photoStudies=[];return true;}}),'photo-study-1');const rest=copy(hostile);delete rest.photoStudies;assert.deepEqual(rest,untouched);assert.deepEqual(hostile.photoStudies[0].work,w);
refusal(b,{canExport:c=>{c.photoStudies.length=0;c.sessions=-1;return false;}});
// Twenty full compact studies plus another room fit the real shared Notes budget.
const capacity=book();assert.ok(keepLensView(capacity,lens,newLensWork(lens),options));for(let i=0;i<20;i++)assert.ok(C.keepPhotoStudy(capacity,s,full,options));const measured=bytes(notesReport(capacity));assert.ok(measured<MAX_IMPORT_BYTES);assert.ok(bytes({source:s,work:full})<100000);const capacityImport=prepareProgressImport(JSON.stringify(notesReport(capacity),null,2));assert.ok(capacityImport.ok);assert.deepEqual(capacityImport.state.photoStudies,capacity.photoStudies);assert.equal(capacityImport.state.lensViews.length,1);
const large=book();large.syntheticPadding='';const proposal=copy(large);proposal.photoStudies=[{id:'photo-study-1',source:copy(s),work:copy(w)}];const paddedBytes=new TextEncoder().encode(JSON.stringify(proposal,null,2)).length;large.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-paddedBytes-10);proposal.syntheticPadding=large.syntheticPadding;assert.ok(recoveryFitsProgressLimits(proposal));assert.equal(options.canExport(proposal),false,'real Notes wrapper exceeds limit although bare candidate fits');refusal(large);
const near=copy(capacity);near.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(notesReport(near),null,2)).length-100);assert.ok(options.canExport(near));refusal(near);assert.equal(near.photoStudies.length,20);assert.equal(near.lensViews.length,1);
console.log(`Photo studies: independent geometry, limits, historical snapshots, immutable actions, raw shelf and atomic real Notes round-trip passed; 20 full compact studies + Lens sibling measured ${measured} compact Notes bytes.`);
