import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as C from '../dist/lens-bench-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
const copy=structuredClone;
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const notesReport=new Function('recommendations','explorerStore',app.split('\n').find(line=>line.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const options={canExport:b=>prepareProgressImport(JSON.stringify(notesReport(b),null,2)).ok};
const book=()=>initializeExplorerState(freshState());
const s=C.lensSource('crossed'),w=C.newLensWork(s),original=copy(s);
const change=(w,a,v,source=s)=>C.changeLensWork(source,w,a,v);
const refuse=(b,opts=options)=>{const before=copy(b);assert.equal(C.keepLensView(b,s,w,opts),false);assert.deepEqual(b,before);};
for(const source of C.lensCases){assert.ok(C.validLensSource(source));assert.ok(C.validLensWork(source,C.newLensWork(source)));}
assert.equal(C.lensSource('missing'),null);s.future={synthetic:'retained'};w.future={synthetic:'retained'};
assert.equal(C.lensSource('crossed').future,undefined);assert.notEqual(s.marks,C.lensSource('crossed').marks);
assert.deepEqual(C.lensMetrics(s,w.view),{total:40,diameter:400,scale:1,sigma:1,limited:false});
let zoomed=change(w,'objective','o10');assert.deepEqual(C.lensMetrics(s,zoomed.view),{total:100,diameter:160,scale:2.5,sigma:2.5,limited:false});
const high=change(zoomed,'objective','o40');assert.deepEqual(C.lensMetrics(s,high.view),{total:400,diameter:40,scale:10,sigma:10,limited:false});
assert.equal(C.lensMetrics(s,zoomed.view).diameter/C.lensMetrics(s,high.view).diameter,4);
assert.equal((C.lensMetrics(s,zoomed.view).diameter/C.lensMetrics(s,high.view).diameter)**2,16);
assert.deepEqual(C.projectLensPoint(s,high.view,{x:210,y:190}),{x:300,y:100});
assert.deepEqual(change(high,'tap',{x:300,y:100}).view.center,{x:210,y:190});
assert.deepEqual(change(high,'tap',{x:400,y:200}).view.center,{x:220,y:200});
assert.equal(change(high,'tap',{x:400,y:201}),null);assert.equal(change(high,'tap',{x:NaN,y:200}),null);
assert.deepEqual(change(high,'pan','right').view.center,{x:210,y:200});
let edge=copy(high);edge.view.center={x:399,y:1};assert.deepEqual(change(edge,'pan','right').view.center,{x:400,y:1});assert.deepEqual(change(edge,'pan','up').view.center,{x:399,y:0});
let soft=change(high,'focus',-1);assert.equal(soft.view.focusId,'f0');assert.equal(C.lensMetrics(s,soft.view).sigma,30);assert.equal(change(soft,'focus',-1).view.focusId,'f0');
let clear=change(high,'focus',1);assert.equal(C.lensMetrics(s,clear.view).sigma,0);for(let i=0;i<8;i++)clear=change(clear,'focus',1);assert.equal(clear.view.focusId,'f4');
let pinned=change(high,'pin');const pin=copy(pinned.pin);pinned=change(pinned,'pan','left');assert.deepEqual(pinned.pin,pin);assert.notEqual(pinned.pin,pin);
let taught=copy(pinned);for(let i=0;i<12;i++)taught=change(taught,'example');assert.equal(taught.exampleSeen,7);assert.deepEqual(taught.view,pinned.view);assert.deepEqual(taught.pin,pinned.pin);assert.deepEqual(taught.photoView,pinned.photoView);
assert.deepEqual(w.view,{objectiveId:'o4',focusId:'f1',center:{x:200,y:200}});assert.deepEqual(w.future,{synthetic:'retained'});assert.notEqual(taught.future,w.future);
let photo=change(high,'photo');photo=change(photo,'photoZoom',4);photo=change(photo,'photoPan','left');assert.deepEqual(photo.photoView,{zoom:4,x:.4375,y:.5});
for(let i=0;i<20;i++)photo=change(photo,'photoPan','right');assert.deepEqual(photo.photoView,{zoom:4,x:.875,y:.5});
photo=change(photo,'photoZoom',2);assert.deepEqual(photo.photoView,{zoom:2,x:.75,y:.5});photo=change(photo,'photoZoom',1);assert.deepEqual(photo.photoView,{zoom:1,x:.5,y:.5});assert.deepEqual(photo.view,high.view);assert.equal(photo.photoShown,true);assert.equal(high.photoShown,false);
for(const [action,value] of [['objective','missing'],['objective',4],['focus',0],['focus',2],['pan','constructor'],['photoPan','diagonal'],['photoZoom',3],['tap',{}],['reset',null]])assert.equal(change(w,action,value),null);
assert.equal(C.lensMetrics(s,{objectiveId:'missing',focusId:'f0',center:{x:0,y:0}}),null);
// Historical snapshots own all lens numbers, IDs, frame views and photograph zooms.
const old=copy(original);old.id='earlier/source!';old.title='Synthetic historical practice';old.world={width:1000,height:600,baseDiameter:200,baseObjectiveId:'low!',center:{x:700,y:400}};old.eyepiece=7;old.objectives=[{id:'low!',label:'Earlier low',power:3},{id:'high!',label:'Earlier high',power:11}];old.focus=[{id:'earlier-focus',label:'Earlier focus',blur:2}];old.initialFocusId='earlier-focus';old.marks=[{id:'old-mark',label:'Earlier mark',art:'cross',x:50,y:50,size:3}];old.targetId='old-mark';old.teaching=[{text:'Synthetic earlier frame.',view:{objectiveId:'high!',focusId:'earlier-focus',center:{x:30,y:20}}}];old.photo.zooms=[1,1.3,8];
assert.ok(C.validLensSource(old));let ow=C.newLensWork(old);ow=C.changeLensWork(old,ow,'objective','high!');assert.equal(C.lensMetrics(old,ow.view).total,77);assert.equal(C.lensMetrics(old,ow.view).diameter,600/11);assert.ok(C.validLensWork(old,ow));
for(const count of [1,2,3,4,5,6]){const h=copy(old);h.objectives=Array.from({length:count},(_,i)=>({id:`historical-${i}`,label:'Historical objective',power:i+1}));h.world.baseObjectiveId=h.objectives[0].id;h.teaching[0].view.objectiveId=h.objectives.at(-1).id;assert.ok(C.validLensSource(h));}
const extreme=copy(old);extreme.world.baseDiameter=16;extreme.objectives=[{id:'low!',label:'Low',power:1},{id:'high!',label:'High',power:100}];extreme.focus[0].blur=12;const ew=C.newLensWork(extreme);ew.view.objectiveId='high!';assert.equal(C.lensMetrics(extreme,ew.view).sigma,30000);assert.ok(C.lensMetrics(extreme,ew.view).limited);assert.ok(C.validLensWork(extreme,ew));
const boundary=copy(extreme);boundary.focus[0].blur=.08;assert.equal(C.lensMetrics(boundary,ew.view).sigma,200);assert.equal(C.lensMetrics(boundary,ew.view).limited,false);boundary.focus[0].blur=.08000000000000002;const held=copy(ew);assert.ok(C.lensMetrics(boundary,ew.view).limited);assert.deepEqual(ew,held);
for(const zoom of old.photo.zooms){const h=C.newLensWork(old),H=.5/zoom;h.photoView={zoom,x:H,y:1-H};assert.ok(C.validLensWork(old,h));h.photoView.x=H-Number.EPSILON;assert.equal(C.validLensWork(old,h),false);}
for(const mutate of [x=>x.objectives=[],x=>x.focus=[],x=>x.marks=[],x=>x.teaching=[],x=>x.photo.zooms=[2],x=>x.photo.zooms=[1,1],x=>x.photo.zooms=Array(2),x=>x.world.baseDiameter=15,x=>x.world.width=99,x=>x.marks[0].size=0,x=>x.marks[0].x=0,x=>x.objectives[0].power=1.5,x=>x.focus[0].blur=13,x=>x.teaching[0].view.focusId='missing',x=>x.photo.art='url',x=>x.photo.sourceTitle='',x=>x.annotation='',x=>x.targetId='missing',x=>x.objectives[0].id='constructor',x=>x.marks=Array(2),x=>x.focus[1].id=x.focus[0].id,x=>x.world.center.x=Infinity]){const bad=copy(original);mutate(bad);assert.equal(C.validLensSource(bad),false);assert.equal(C.newLensWork(bad),null);}
for(const key of Object.keys(original)){const bad=copy(original);delete bad[key];assert.equal(C.validLensSource(bad),false,`source owns ${key}`);}
for(const [field,keys] of [['world',['width','height','baseDiameter','baseObjectiveId','center']],['photo',['art','title','sourceTitle','caption','alt','credit','license','captureLabel','notice','zooms']]])for(const key of keys){const bad=copy(original);delete bad[field][key];assert.equal(C.validLensSource(bad),false);}
assert.equal(C.validLensSource(Object.create(original)),false);
for(const mutate of [x=>x.view.center.x=-1,x=>x.view.objectiveId='missing',x=>x.pin={},x=>x.exampleSeen=8,x=>x.exampleSeen=-1,x=>x.photoShown=1,x=>x.photoView.zoom=3,x=>x.photoView.x=.49,x=>x.v=2]){const bad=copy(w);mutate(bad);assert.equal(C.validLensWork(s,bad),false);assert.equal(change(bad,'example'),null);}
for(const key of ['v','view','pin','exampleSeen','photoShown','photoView']){const bad=copy(w);delete bad[key];assert.equal(C.validLensWork(s,bad),false);}
// Keep reserves canonical IDs even for unreadable records and preserves every raw slot.
const b=book(),before=copy(b);assert.deepEqual(C.lensViewsView(b),{status:'absent',items:[],canKeep:true});assert.equal(C.lastLensView(b),null);assert.deepEqual(b,before);
assert.equal(C.keepLensView(b,s,w,options),'lens-view-1');b.lensViews[0].future={synthetic:'outer only'};const first=copy(b.lensViews[0]);assert.equal(C.keepLensView(b,old,ow,options),'lens-view-2');assert.deepEqual(b.lensViews[0],first);assert.equal(b.lensViews[1].future,undefined);assert.deepEqual(b.lensViews[0].source.future,s.future);
old.title='Changed after Keep';ow.view.center.x=100;assert.equal(b.lensViews[1].source.title,'Synthetic historical practice');assert.equal(b.lensViews[1].work.view.center.x,700);
b.lensViews.push({id:'lens-view-17',source:{}},null,{id:'lens-view-03'},'synthetic raw');assert.equal(C.keepLensView(b,s,w,options),'lens-view-18');b.lensViews.push(copy(first));assert.equal(C.lensViewsView(b).items[0].readable,false);assert.equal(C.lensViewsView(b).items[7].readable,false);assert.equal(C.lensViewsView(b).items[1].readable,true);
for(let i=0;i<3;i++)assert.ok(C.keepLensView(b,s,w,options));assert.equal(C.lastLensView(b).index,10);assert.equal(b.lensViews.length,11);
const imported=prepareProgressImport(JSON.stringify(notesReport(b),null,2));assert.ok(imported.ok);assert.deepEqual(imported.state.lensViews,b.lensViews);
for(const root of [null,{},'synthetic unsupported',42]){const state=book();state.lensViews=root;assert.equal(C.lensViewsView(state).status,'unavailable');refuse(state);const transport=prepareProgressImport(JSON.stringify(notesReport(state),null,2));assert.ok(transport.ok);assert.deepEqual(transport.state.lensViews,root);}
const exhausted=book();exhausted.lensViews=[{id:'lens-view-999999'}];assert.equal(C.lensViewsView(exhausted).canKeep,false);refuse(exhausted);
const noncanonical=book();noncanonical.lensViews=[{id:'lens-view-0009'},{id:'lens-view-1000000'},{id:'lens-view-4x'}];assert.equal(C.keepLensView(noncanonical,s,w,options),'lens-view-1');
refuse(b,{});refuse(b,{canExport:()=>false});refuse(b,{canExport:()=>{throw Error('Synthetic refusal');}});
const hostile=book(),unchanged=copy(hostile);assert.equal(C.keepLensView(hostile,s,w,{canExport:c=>{c.sessions=999;c.lensViews[0].work.view.center.x=1;c.lensViews=[];return true;}}),'lens-view-1');const other=copy(hostile);delete other.lensViews;assert.deepEqual(other,unchanged);assert.deepEqual(hostile.lensViews[0].work,w);
const large=book();large.syntheticPadding='';const proposed=copy(large);proposed.lensViews=[{id:'lens-view-1',source:copy(s),work:copy(w)}];const bytes=new TextEncoder().encode(JSON.stringify(proposed,null,2)).length;large.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-bytes-10);proposed.syntheticPadding=large.syntheticPadding;assert.ok(recoveryFitsProgressLimits(proposed));assert.equal(options.canExport(proposed),false,'real Notes wrapper exceeds limit while bare candidate fits');refuse(large);
const deep=book();let nested={};deep.syntheticFuture=nested;for(let i=0;i<61;i++){nested.next={};nested=nested.next;}refuse(deep);
// A same-dimension alternate onion file was verified wrong; pin this one media identity.
const jpeg=fs.readFileSync(new URL('../dist/assets/lens-bench/onion-epidermis.jpg',import.meta.url));assert.equal(jpeg.length,1085598);assert.equal(createHash('sha256').update(jpeg).digest('hex'),'15240a45f7dc30b9d1470bfce296bf1887a08d71bb085df971010e8ea57a2195');
console.log('Lens Bench: source-owned lens/blur/projection and photo math, immutable history, raw shelf and real Notes atomic preflight passed.');
