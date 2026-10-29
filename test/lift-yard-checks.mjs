import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {liftLengths,liftCases,freshLiftYard,liftJob,liftView,changeLift,liftFraction,liftComparison,liftGeometry,liftDrawing,liftWorkDrawing,liftYardPage,resetLiftYard} from '../dist/lift-yard.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},equal=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},near=(a,b)=>ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
equal(liftCases.length,28);equal(new Set(liftCases.map(j=>JSON.stringify(j))).size,28);equal(liftCases.slice(0,6).map(j=>[j.weight,j.capacity,j.board]),[[12,6,4],[24,6,6],[12,4,4],[24,4,6],[12,3,6],[24,12,3]]);
const attribute=(s,k)=>{const v=s.match(new RegExp(`${k}="([^"]+)"`));assert.ok(v,k);return v[1];};
const tag=(s,attr)=>s.match(new RegExp(`<[^>]+ ${attr}(?:=\"[^\"]*\")?[^>]*>`))[0];
const circleRect=(c,r)=>Math.hypot(c.x-Math.max(r.x,Math.min(c.x,r.x+r.w)),c.y-Math.max(r.y,Math.min(c.y,r.y+r.h)))-18;
const circlePolygon=(c,points)=>{
 const p=points.trim().split(/\s+/).map(s=>s.split(',').map(Number));let min=Infinity;
 for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((c.x-a[0])*dx+(c.y-a[1])*dy)/(dx*dx+dy*dy)));min=Math.min(min,Math.hypot(c.x-a[0]-t*dx,c.y-a[1]-t*dy));}
 return min-18;
};
for(let index=0;index<28;index++){
 const base={...freshLiftYard(),offset:index},job=liftJob(base);ok(liftLengths.some(L=>L<=job.board&&job.weight/L<=job.capacity),'every case solvable');
 for(const L of liftLengths){
  let s=changeLift(base,'board',L),v=liftView(s);equal(v.length,L);equal(v.force,job.weight/L);equal(v.fullWork,job.weight*1);ok(Number.isInteger(v.force),'integer force');equal(v.distance,0);equal(v.stock,L<=job.board);equal(v.capacity,job.weight/L<=job.capacity);
  const freshHTML=(()=>{const b={};resetLiftYard();return liftYardPage(b,'synthetic');})();ok(!freshHTML.includes('trip waits at')&&!freshHTML.includes('Keep current trip'),'unstarted has no waiting trip');
  const before=JSON.stringify(s);let started=changeLift(s,'start');equal(JSON.stringify(s),before,'immutable transition');
  if(!v.stock||!v.capacity){equal(started.works[0].notice,!v.stock?'stock':'force');equal(started.works[0].started,false);equal(started.works[0].distance,0);ok(!v.stock?v.capacity:true,'unavailable board always passes capacity');}
  else{
   s=started;equal(s.works[0].turn,'pull');for(let d=0;d<=L;d++){
    v=liftView(s);equal(v.distance,d);near(v.height,d/L);equal(v.energy,job.weight*d/L);equal(v.done,d===L);equal(v.count,d===L?1:0);
    if(d<L)s=changeLift(s,'pull');else equal(changeLift(s,'pull'),null,'last pull cannot repeat');
   }
   const held=changeLift(s,'hold');equal(held.held,{weight:job.weight,length:L});s=changeLift(held,'bottom');equal(liftView(s).count,1);equal(s.held,held.held);equal(s.works[0].distance,0);equal(changeLift(s,'next'),null,'previous delivery does not enable Next');s=changeLift(s,'pull');const active=s.works[0].distance;
   s=changeLift(s,'plan');s=changeLift(s,'board',L===6?2:6);const trial=liftView(s),attempt=changeLift(s,'start');
   if(!trial.stock||!trial.capacity){equal(attempt.works[0].distance,active);equal(attempt.works[0].ramp,L);s=attempt;}
   s=changeLift(s,'keep');equal(s.works[0].distance,active);equal(s.works[0].ramp,L);equal(liftView(s).count,1);equal(s.held,{weight:job.weight,length:L});
  }
  // Inspect emitted picture geometry separately from model flags and geometry helper.
  for(let d=0;d<=L;d++){
   const picture=liftDrawing({...v,job,length:L,distance:d,force:job.weight/L,stock:L<=job.board}),slope=attribute(tag(picture,'data-lift-slope'),'d').match(/[+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?/gi).map(Number),[fx,fy,tx,ty]=slope;
   near(Math.hypot(tx-fx,ty-fy),80*L);near(fy-ty,80);near(ty,190);near(fy,270);
   const transform=attribute(tag(picture,'data-lift-drum'),'transform').match(/[+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?/gi).map(Number),c={x:transform[0],y:transform[1]},ux=(tx-fx)/(80*L),uy=(ty-fy)/(80*L),nx=uy,ny=-ux;
   near(c.x-18*nx,fx+80*d*ux);near(c.y-18*ny,fy+80*d*uy);near((fy+18*ny)-c.y,80*d/L);
   const rope=tag(picture,'data-lift-rope'),a={x:+attribute(rope,'x1'),y:+attribute(rope,'y1')},b={x:+attribute(rope,'x2'),y:+attribute(rope,'y2')};near(Math.hypot(a.x-c.x,a.y-c.y),18);near((b.x-a.x)*uy-(b.y-a.y)*ux,0);near(Math.hypot(b.x-c.x,b.y-c.y),80*(L-d)+64);ok(286-c.y-18>13,'ground clear');ok(circleRect(c,{x:610,y:200,w:110,h:12})>12,'platform clear');ok(Math.hypot(b.x-c.x,b.y-c.y)-26>=38-1e-8,'winch clear');
   for(const id of ['data-lift-foot-support','data-lift-top-support'])ok(circlePolygon(c,attribute(tag(picture,id),'points'))>=8-1e-8,'actual drum clears support polygon');
   const post=tag(picture,'data-lift-winch-post');ok(+attribute(post,'y')-b.y<8,'winch touches post');near(+attribute(post,'y')+Number(attribute(post,'height')),200);equal((picture.match(/data-lift-metre=/g)||[]).length,L+1);
   const grid=liftWorkDrawing({...v,job,length:L,distance:d,force:job.weight/L,energy:job.weight*d/L,planned:true},{weight:24,length:6}),cells=[...grid.matchAll(/<rect data-lift-cell="current"[^>]*>/g)].map(m=>m[0]);equal(cells.length,job.weight);equal(cells.filter(c=>attribute(c,'data-filled')==='true').length,job.weight/L*d);ok(cells.every(c=>attribute(c,'width')==='18'&&attribute(c,'height')==='18'),'fixed cell sizes');ok(grid.includes('not square metres'),'work not physical area');
  }
 }
}
let s=freshLiftYard(),offsets=[];
for(let shift=0;shift<14;shift++){
 offsets.push(s.offset);equal(new Set(Array.from({length:6},(_,i)=>JSON.stringify(liftJob(s,i)))).size,6);
 for(let i=0;i<6;i++){s=changeLift(s,'job',i);const j=liftJob(s),L=liftLengths.find(L=>L<=j.board&&j.weight/L<=j.capacity);s=changeLift(changeLift(s,'board',L),'start');for(let d=0;d<L;d++)s=changeLift(s,'pull');s=changeLift(s,'hold');}
 equal(liftView(s).count,6);const held={...s.held};s=changeLift(s,'view','numbers');s=changeLift(s,'shift');equal(s.held,held);equal(s.representation,'numbers');ok(s.works.every(w=>!w.started&&!w.delivered&&w.distance===0),'explicit shift resets six only');
}
equal(new Set(offsets).size,14);equal(s.offset,0);
s=changeLift(changeLift(freshLiftYard(),'start'),'pull');const partial={...s.works[0]};s=changeLift(s,'jobs');s=changeLift(s,'job',3);s=changeLift(s,'view','numbers');s=changeLift(s,'jobs');s=changeLift(s,'job',0);equal(s.works[0],partial,'tag chooser and representation retain trip');equal(changeLift(s,'shift'),null);for(const [a,x] of [['board',0],['board','2'],['job',-1],['job',6],['job',.5],['view','bad'],['not-an-action',null]])equal(changeLift(s,a,x),null,'invalid action refused');
equal(liftFraction(2,6),'1/3');equal(liftFraction(0,6),'0');equal(liftFraction(6,6),'1');ok(liftComparison(24,6,{weight:12,length:3}).includes('Both'),'both variables distinguished');ok(liftComparison(12,6,{weight:12,length:3}).includes('current planned'),'direction explicit');ok(liftComparison(24,6,{weight:12,length:6}).includes('current load'),'load direction');
const book={workshop:{revision:99,opaque:'kept'},fairTests:{version:99,opaque:'kept'},science:{version:99},other:'z'.repeat(550000)},raw=JSON.stringify(book);resetLiftYard();const html=liftYardPage(book,'synthetic-owner');equal(JSON.stringify(book),raw,'identity-only page never normalizes saved data');ok(!/<video|\.mp4|<audio/.test(html),'no film or audio in305');
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.indexOf("if(hash==='#workshop/lift')")<app.indexOf('if(needsExplorerInitialization)'),'early route precedes legacy initialization');ok(app.includes('stopLiftMotion();pauseWaterFilm()'),'existing global stops own finite movement');
console.log(`${checks} Lift Yard source assertions passed; actual browser/subject/hosted gates separate`);
