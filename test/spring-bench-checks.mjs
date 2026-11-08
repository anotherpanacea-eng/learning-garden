import assert from 'node:assert/strict';
import {springCases} from '../dist/spring-bench-content.mjs';
import {createSpring,validSpring,changeSpring,springModel,springGeometry,springPlot,springExample} from '../dist/spring-bench-core.mjs';

const eq=(a,b,message)=>assert.deepEqual(a,b,message);
const oracle=[
 {id:'A',start:6,loaded:[6,8,10,12],extensions:[0,2,4,6],released:[6,6,6,6]},
 {id:'B',start:8,loaded:[8,9,10,11],extensions:[0,1,2,3],released:[8,8,8,8]},
 {id:'C',start:6,loaded:[6,7,9,12],extensions:[0,1,3,6],released:[6,6,6,6]},
 {id:'D',start:6,loaded:[6,8,10,12,15],extensions:[0,2,4,6,9],released:[6,6,6,6,7]}
];
function change(id,work,action,value){const before=structuredClone(work),next=changeSpring(id,work,action,value);assert.ok(next,`${id} ${action} available`);eq(work,before,'transition preserves input');assert.ok(validSpring(id,next));assert.notEqual(next,work);return next;}
function refuse(id,work,action,value){const before=structuredClone(work);eq(changeSpring(id,work,action,value),null,`${action} refused/no-op`);eq(work,before,'refusal preserves input and history');}
eq(springCases.map(c=>c.id),['A','B','C','D']);
for(const o of oracle){
 const authored=springCases.find(c=>c.id===o.id);eq(authored.startLength,o.start);eq(authored.loadedLengths,o.loaded);eq(authored.releasedLengths,o.released);eq(authored.forces,o.loaded.map((_,i)=>i));
 let initial=createSpring(o.id);eq(initial,{force:1,phase:'fresh',markSteps:null,previous:null});assert.ok(validSpring(o.id,initial));
 refuse(o.id,initial,'fresh');refuse(o.id,initial,'release');refuse(o.id,initial,'force',1);refuse(o.id,initial,'undo');
 for(let force=0;force<o.loaded.length;force++){
  let work={...initial,force};
  for(const phase of ['fresh','loaded','released']){
   work={...work,phase};const m=springModel(o.id,work),length=phase==='fresh'?o.start:phase==='loaded'?o.loaded[force]:o.released[force],extension=phase==='fresh'?0:phase==='loaded'?o.extensions[force]:o.released[force]-o.start,pull=phase==='loaded'?force:0;
   eq([m.startLength,m.length,m.extension,m.pullNow,m.testForce,m.mark,m.phase],[o.start,length,extension,pull,force,null,phase]);
   eq([m.canSetForce,m.canApply,m.canRelease,m.canFresh],[phase==='fresh',phase==='fresh',phase==='loaded',phase!=='fresh']);
   eq([m.canAdd,m.canDecrease,m.canIncrease,m.canClear,m.canUndo],[true,false,false,false,false]);
   const g=springGeometry(o.id,work);eq(g,{origin:{x:44,y:65},unloadedEnd:{x:44+26*o.start,y:65},end:{x:44+26*length,y:65},proposal:null,reference:{x1:44+26*o.start,x2:44+26*length,y:180,value:extension}});
   for(const axis of ['length','extension']){
    const p=springPlot(o.id,work,axis);eq(p.loading,o.loaded.map((l,f)=>({force:f,length:l,extension:o.extensions[f],x:80+110*f,y:330-13*(axis==='length'?l:o.extensions[f])})));
    eq(p.proposal,null);eq(p.release,phase==='released'?{force:0,length,extension,x:80,y:330-13*(axis==='length'?length:extension)}:null);
   }
   for(let steps=0;steps<=20;steps++){
    const marked={...work,markSteps:steps},mm=springModel(o.id,marked),mg=springGeometry(o.id,marked);eq(mm.mark,steps/2);eq([mm.canAdd,mm.canDecrease,mm.canIncrease,mm.canClear],[false,steps>0,steps<20,true]);
    eq(mg.proposal,{x1:44+26*o.start,x2:44+26*(o.start+steps/2),y:140,value:steps/2});assert.ok(mg.proposal.x2<=512);eq(mg.reference,g.reference,'mark does not move original or current end');
    for(const axis of ['length','extension']){const value=axis==='length'?o.start+steps/2:steps/2,p=springPlot(o.id,marked,axis);eq(p.proposal,{force:pull,value,x:80+110*pull,y:330-13*value});assert.ok(p.proposal.x>=80&&p.proposal.x<=520&&p.proposal.y>=70&&p.proposal.y<=330);}
   }
   if(phase!=='fresh'){refuse(o.id,work,'force',0);refuse(o.id,work,'apply');}
   if(phase!=='loaded')refuse(o.id,work,'release');
  }
  work={...initial,force};work=change(o.id,work,'add');work=change(o.id,work,'increase');const history=structuredClone(work.previous);work=change(o.id,work,'apply');eq(work.previous,history);eq(work.markSteps,1);work=change(o.id,work,'release');eq(work.previous,history);eq(work.markSteps,1);refuse(o.id,work,'apply');refuse(o.id,work,'release');
  work=change(o.id,work,'fresh');eq(work,{force,phase:'fresh',markSteps:null,previous:null});eq(springModel(o.id,work).length,o.start,'fresh replaces spring rather than reversing retained deformation');
 }
 let work=change(o.id,initial,'add');eq(work,{...initial,markSteps:0,previous:{markSteps:null}});eq(springGeometry(o.id,work).proposal.x1,springGeometry(o.id,work).proposal.x2,'zero mark is a point');refuse(o.id,work,'add');refuse(o.id,work,'decrease');
 work=change(o.id,work,'undo');eq(work,initial,'undo Add restores no mark');
 work=change(o.id,work,'add');work=change(o.id,work,'increase');work=change(o.id,work,'clear');eq(work.previous,{markSteps:1});work=change(o.id,work,'undo');eq(work.markSteps,1);eq(work.previous,null);refuse(o.id,work,'undo');
 for(let step=1;step<20;step++)work=change(o.id,work,'increase');eq(work.markSteps,20);refuse(o.id,work,'increase');work=change(o.id,work,'decrease');eq(work.markSteps,19);work=change(o.id,work,'undo');eq(work.markSteps,20);
 const selected=change(o.id,work,'force',0);eq(selected.markSteps,20);eq(selected.previous,work.previous);
 for(const invalid of [-0,-1,.5,99,NaN,Infinity,'1',null,undefined])refuse(o.id,initial,'force',invalid);
 for(const mutate of [w=>w.force=-0,w=>w.phase='other',w=>w.markSteps=-0,w=>w.markSteps=21,w=>w.markSteps=.5,w=>w.previous={},w=>w.previous={markSteps:-0},w=>w.previous={markSteps:null,extra:1},w=>w.extra=true,w=>w[Symbol('extra')]=1]){const bad=structuredClone(initial);mutate(bad);eq(validSpring(o.id,bad),false);eq(springModel(o.id,bad),null);eq(springGeometry(o.id,bad),null);eq(springPlot(o.id,bad,'length'),null);eq(changeSpring(o.id,bad,'apply'),null);}
 refuse(o.id,initial,'unknown');eq(springPlot(o.id,initial,'force'),null);
}
for(const id of ['unknown',null,undefined,0]){eq(createSpring(id),null);eq(validSpring(id,createSpring('A')),false);eq(springModel(id,createSpring('A')),null);}
// Explicit same-length and released-reading contrasts, independent of the table loops.
const at=(id,force,phase)=>springModel(id,{force,phase,markSteps:null,previous:null});
eq([at('A',2,'loaded').length,at('B',2,'loaded').length],[10,10]);eq([at('A',2,'loaded').extension,at('B',2,'loaded').extension],[4,2]);
eq([at('C',3,'released').extension,at('D',4,'released').extension],[0,1]);
const d={force:4,phase:'released',markSteps:2,previous:null},dp=springPlot('D',d,'extension');eq(dp.loading[0],{force:0,length:6,extension:0,x:80,y:330});eq(dp.release,{force:0,length:7,extension:1,x:80,y:317});eq(dp.proposal,{force:0,value:1,x:80,y:317});eq(springGeometry('D',d).reference,{x1:200,x2:226,y:180,value:1});
const examples=[{length:5,pull:0,mark:null,reference:false,end:174},{length:7,pull:2,mark:null,reference:false,end:226},{length:7,pull:2,mark:7,reference:false,end:226},{length:7,pull:2,mark:2,reference:true,end:226},{length:5,pull:0,mark:null,reference:true,end:174}];
for(const [frame,o] of examples.entries()){const e=springExample(frame);eq(e.frame,frame);eq([e.model.id,e.model.startLength,e.model.length,e.model.extension,e.model.pullNow,e.model.testForce,e.model.mark],[null,5,o.length,o.length-5,o.pull,2,o.mark]);eq(e.showReference,o.reference);eq(e.geometry.origin,{x:44,y:65});eq(e.geometry.unloadedEnd,{x:174,y:65});eq(e.geometry.end,{x:o.end,y:65});eq(e.geometry.proposal,o.mark===null?null:{x1:174,x2:174+26*o.mark,y:140,value:o.mark});eq(e.geometry.reference,{x1:174,x2:o.end,y:180,value:o.length-5});assert.equal(typeof e.caption,'string');}
for(const frame of [-0,-1,5,.5,NaN,'0',undefined])eq(springExample(frame),null);
console.log('Spring Bench finite physics, geometry, plots and trial lifecycle checks passed.');
