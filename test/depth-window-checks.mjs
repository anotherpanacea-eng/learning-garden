import assert from 'node:assert/strict';
import {depthDefaults,depthCopy,depthPressureText,depthReadingText} from '../dist/depth-window-content.mjs';
import {createDepth,validDepth,cloneDepth,changeDepth,depthModel,compareDepth,depthTankGeometry,depthFace,depthExample} from '../dist/depth-window-core.mjs';

const eq=assert.deepEqual;
const fields=['level','a','b','width'];
const choices={level:[0,1,2,3,4,5,6],a:[1,2,3,4,5,6],b:[1,2,3,4,5,6],width:['narrow','wide']};
const defaults={level:5,a:4,b:2,width:'narrow'};
eq(createDepth(),defaults);eq(depthDefaults,defaults);assert.ok(Object.isFrozen(depthDefaults));assert.ok(Object.isFrozen(depthCopy.frames));
const first=createDepth(),second=createDepth();first.level=0;eq(second,defaults);
let states=0,edges=0,maxDepth=0,maxPressure=0;
for(const level of choices.level)for(const a of choices.a)for(const b of choices.b)for(const width of choices.width){
 const work={level,a,b,width},before={...work},m=depthModel(work),g=depthTankGeometry(work);
 states++;assert.ok(validDepth(work));eq(m.work,work);assert.notEqual(m.work,work);eq([m.level,m.a,m.b,m.width,m.empty],[level,a,b,width,level===0]);
 const copy=cloneDepth(work);eq(copy,work);assert.notEqual(copy,work);copy.level=(level+1)%7;eq(work,before);
 const left=width==='narrow'?180:100,right=width==='narrow'?420:500;
 eq(g.tank,{xLeft:left,tankSpan:right-left,top:50,bottom:400});
 eq(g.surfaceY,level===0?null:400-50*level);
 eq(g.water,level===0?null:{x:left,y:400-50*level,width:right-left,height:50*level});
 eq(g.ruler,{x:565,ticks:[0,1,2,3,4,5,6,7].map(height=>({height,y:400-50*height}))});
 for(const [key,height,index] of [['a',a,1],['b',b,2]]){
  const status=height>level?'dry':height===level?'surface':'water',depth=height>level?null:level-height,pressure=depth===null?null:98*depth;
  eq(m.gauges[key],{height,status,depth,pressureTenths:pressure});
  eq(g.gauges[key],{x:left+(right-left)*index/3,y:400-50*height,bracket:status==='dry'?null:{x:key==='a'?left-24:right+24,y1:400-50*level,y2:400-50*height,zero:status==='surface'}});
  if(depth!==null){maxDepth=Math.max(maxDepth,depth);maxPressure=Math.max(maxPressure,pressure);}
  const reading=depthReadingText(m.gauges[key],key.toUpperCase());assert.ok(reading.includes(`height ${height} ${height===1?'meter':'meters'} above bottom`));
  if(status==='dry')assert.ok(reading.includes('No water reading'));
  else if(status==='surface')assert.ok(reading.includes('0 kilopascals extra relative to air. Air pressure is still present.'));
  else assert.ok(reading.includes(`${depth} ${depth===1?'meter':'meters'} below surface`));
  for(const face of ['top','bottom','left','right']){
   const f=depthFace(work,key,face),horizontal=face==='top'||face==='bottom';
   eq([f.probe,f.orientation,f.status,f.reading],[key,face,status,m.gauges[key]]);
   eq(f.segment,horizontal?{x1:120,y1:105,x2:180,y2:105}:{x1:150,y1:75,x2:150,y2:135});
   eq(f.backing,{top:{x:120,y:105,width:60,height:20},bottom:{x:120,y:85,width:60,height:20},left:{x:150,y:75,width:20,height:60},right:{x:130,y:75,width:20,height:60}}[face]);
   if(status!=='water'){eq(f.arrow,null);continue;}
   const arrow=f.arrow,dx=arrow.x2-arrow.x1,dy=arrow.y2-arrow.y1;
   eq([arrow.x1,arrow.y1],{top:[150,45],bottom:[150,165],left:[90,105],right:[210,105]}[face]);eq([arrow.x2,arrow.y2],[150,105]);
   eq(dx*(f.segment.x2-f.segment.x1)+dy*(f.segment.y2-f.segment.y1),0,'arrow normal to face');
   eq(dx*dx+dy*dy,3600,'direction arrows have fixed length');
   const bx=f.backing.x+f.backing.width/2-150,by=f.backing.y+f.backing.height/2-105;
   assert.ok(bx*dx+by*dy>0,'backing beyond face from arrow start');
   eq(arrow.head[0],{x:150,y:105});eq(arrow.head.length,3);
   for(const point of arrow.head.slice(1))assert.ok((150-point.x)*dx+(105-point.y)*dy>0,'arrowhead wings behind inward tip');
   const [u,v]=arrow.head.slice(1);eq((u.x+v.x)/2,150-dx/5);eq((u.y+v.y)/2,105-dy/5);
   assert.ok((u.x-v.x)**2+(u.y-v.y)**2>0,'arrowhead has visible wings');
  }
 }
 for(const field of fields){
  eq(changeDepth(work,field,work[field]),null);
  for(const value of choices[field])if(value!==work[field]){
   const next=changeDepth(work,field,value);edges++;eq(next,{...work,[field]:value});assert.notEqual(next,work);assert.ok(validDepth(next));eq(work,before);
  }
 }
 eq(work,before);
}
eq([states,edges,maxDepth,maxPressure],[504,8568,5,490]);
for(const [tenths,text] of [[0,'0'],[98,'9.8'],[196,'19.6'],[294,'29.4'],[392,'39.2'],[490,'49']])eq(depthPressureText(tenths),text);
const invalid=[null,undefined,[],{},'water',{...defaults,extra:1},{...defaults,level:-1},{...defaults,level:7},{...defaults,a:0},{...defaults,b:7},{...defaults,width:'other'}];
for(const field of ['level','a','b'])for(const value of ['1',null,undefined,NaN,Infinity,1.5])invalid.push({...defaults,[field]:value});
for(const work of invalid){eq(validDepth(work),false);eq(cloneDepth(work),null);eq(depthModel(work),null);eq(depthTankGeometry(work),null);eq(depthFace(work,'a','top'),null);eq(changeDepth(work,'level',2),null);eq(compareDepth(work,defaults),null);eq(compareDepth(defaults,work),null);}
for(const field of fields)for(const value of [null,undefined,NaN,Infinity,'bad',{},[],false])eq(changeDepth(defaults,field,value),null);
for(const field of ['other',null,undefined,1])eq(changeDepth(defaults,field,2),null);
for(const probe of ['A','c',null,undefined])eq(depthFace(defaults,probe,'top'),null);
for(const face of ['Top','front',null,undefined])eq(depthFace(defaults,'a',face),null);
// Every changed-field mask, with classification independent of displayed prose.
for(let mask=0;mask<16;mask++){
 const pin={...defaults},current={...defaults},changed=[];
 for(const [index,field] of fields.entries())if(mask&(1<<index)){current[field]={level:6,a:3,b:1,width:'wide'}[field];changed.push(field);}
 const result=compareDepth(pin,current);eq(result.changed,changed);eq(result.kind,changed.length===0?'same':changed.length===1?changed[0]:'multiple');eq(result.pinned,depthModel(pin));eq(result.current,depthModel(current));assert.ok(result.text.length>0);
 result.pinned.work.level=0;result.current.work.a=6;eq(pin,defaults);eq(current.a,mask&2?3:4);
}
for(const [level,a,b,phrase] of [[0,1,1,'Both locations still have no water reading'],[1,2,3,'Both locations still have no water reading'],[2,1,3,'Gauge A keeps the same depth and reading; Gauge B still has no water reading'],[2,3,2,'Gauge B keeps the same depth and reading; Gauge A still has no water reading'],[2,1,2,'both depths stayed the same']]){
 const pin={level,a,b,width:'narrow'},current={...pin,width:'wide'},c=compareDepth(pin,current);eq(c.kind,'width');eq(c.pinned.gauges,c.current.gauges);assert.ok(c.text.includes(phrase));
}
for(const [oldLevel,level,a,b,phrase] of [[4,0,1,2,'now has no water'],[0,1,2,3,'below both locations'],[0,2,1,2,'now has water'],[4,2,1,3,'waterline moved'],[2,3,3,1,'waterline moved']]){
 const c=compareDepth({level:oldLevel,a,b,width:'narrow'},{level,a,b,width:'narrow'});eq(c.kind,'level');assert.ok(c.text.toLowerCase().includes(phrase));
}
const crossing=compareDepth({level:2,a:3,b:1,width:'narrow'},{level:3,a:3,b:1,width:'narrow'});eq([crossing.pinned.gauges.a.depth,crossing.pinned.gauges.a.pressureTenths,crossing.current.gauges.a.depth,crossing.current.gauges.a.pressureTenths],[null,null,0,0]);
const expectedExamples=[[4,3,1,'narrow',98,294],[4,1,1,'narrow',294,294],[4,1,1,'wide',294,294],[6,1,1,'wide',490,490],[6,6,1,'wide',0,490],[5,6,1,'wide',null,392]];
for(const [frame,[level,a,b,width,pa,pb]] of expectedExamples.entries()){
 const example=depthExample(frame);eq(example.work,{level,a,b,width});eq(example.previousLevel,frame===3?4:null);eq(typeof example.text,'string');assert.ok(example.text.length>0);const m=depthModel(example.work);eq([m.gauges.a.pressureTenths,m.gauges.b.pressureTenths],[pa,pb]);
 example.work.level=0;eq(depthExample(frame).work,{level,a,b,width});
}
for(const frame of [-1,6,.5,NaN,'0',null,undefined])eq(depthExample(frame),null);
console.log('Depth Window: 504 states, 8568 valid single-field changes, comparisons, geometry, directions and detached examples passed.');
