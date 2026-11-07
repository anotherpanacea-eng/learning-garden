import assert from 'node:assert/strict';
import {sharedTurnPage} from '../dist/shared-turn-ui.mjs';
import {sharedTurnJobs,sharedTurnLessons,sharedTurnCopy} from '../dist/shared-turn-content.mjs';
import {createSharedTurn,changeSharedTurn,sharedTurnDraftNumber,sharedTurnGeometry,sharedTurnModel,sharedTurnNarration} from '../dist/shared-turn-core.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≠ ${b}`);
const point=(p,angle,radius)=>{near(p[0],160+radius*Math.cos(angle*Math.PI/180));near(p[1],160-radius*Math.sin(angle*Math.PI/180));};
const frozen=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(frozen);Object.freeze(x);}return x;};
const start=frozen(createSharedTurn());
assert.deepEqual(start,{page:'build',whole:180,first:60,tilt:0,job:0,ideas:Array(8).fill(null),drafts:Array(8).fill(''),readings:Array(8).fill(false),lesson:0});
for(const [action,value] of [['page','other'],['whole',90],['whole',180],['first',60],['first',1],['first',-15],['first',195],['draft','5'],['idea',5],['job',1],['reading'],['lesson',1],['unknown']])assert.equal(changeSharedTurn(start,action,value),start);
assert.equal(changeSharedTurn(null,'page','cover'),null);
const large=changeSharedTurn(changeSharedTurn(start,'whole',360),'first',225);
assert.equal(changeSharedTurn(large,'whole',180),large);
const smaller=changeSharedTurn(large,'first',120);
assert.equal(changeSharedTurn(smaller,'whole',180).first,120);
for(const raw of ['', ' ', '60.0','1e2','-0','+60','361','0000','NaN',Array(33).fill(' ').join('')+'0'])assert.equal(sharedTurnDraftNumber(raw),null,raw);
for(const [raw,n] of [['0',0],['360',360],['060',60],[' 060 ',60],['000',0]])assert.equal(sharedTurnDraftNumber(raw),n);
assert.equal(sharedTurnDraftNumber(60),null);
let cover=changeSharedTurn(start,'page','cover');
assert.equal(changeSharedTurn(cover,'clear-idea'),cover);
for(const [action,value] of [['whole',360],['first',30],['lesson',1],['job',8],['job',-1],['idea',361],['idea',1.5],['idea',null],['draft','x'.repeat(33)],['draft',0]])assert.equal(changeSharedTurn(cover,action,value),cover);
cover=changeSharedTurn(cover,'draft','060');
cover=changeSharedTurn(cover,'idea',60);
assert.equal(cover.drafts[0],'060');
assert.equal(changeSharedTurn(cover,'idea',60),cover);
assert.equal(changeSharedTurn(cover,'draft','060'),cover);
assert.doesNotMatch(sharedTurnNarration(cover),/Your draft, not kept yet/);
cover=changeSharedTurn(cover,'draft','1e2');
assert.match(sharedTurnNarration(cover),/The draft field has text that is not a whole-number idea yet\./);
assert.equal(cover.ideas[0],60);
cover=changeSharedTurn(cover,'reading');
assert.equal(sharedTurnModel(cover).reading.missing,150);
const job1=cover;
cover=changeSharedTurn(cover,'job',1);
assert.equal(sharedTurnModel(cover).reading,null);
assert.equal(sharedTurnModel(cover).idea,null);
cover=changeSharedTurn(cover,'draft','0');cover=changeSharedTurn(cover,'idea',0);
assert.equal(sharedTurnModel(cover).idea,0);
cover=changeSharedTurn(cover,'job',0);
assert.deepEqual(cover.ideas,job1.ideas.map((n,i)=>i===1?0:n));
assert.equal(sharedTurnModel(cover).draft,'1e2');
assert.equal(sharedTurnModel(cover).reading.missing,150);
let elsewhere=changeSharedTurn(changeSharedTurn(cover,'page','learn'),'lesson',3);
assert.equal(changeSharedTurn(elsewhere,'draft','lost'),elsewhere);
assert.equal(changeSharedTurn(elsewhere,'idea',300),elsewhere);
assert.equal(changeSharedTurn(elsewhere,'job',3),elsewhere);
assert.equal(changeSharedTurn(elsewhere,'lesson',4),elsewhere);
assert.deepEqual(changeSharedTurn(elsewhere,'page','cover').drafts,cover.drafts);
const cleared=changeSharedTurn(cover,'clear-idea');
assert.equal(cleared.ideas[0],null);assert.equal(cleared.drafts[0],'');assert.equal(cleared.readings[0],true);
assert.equal(changeSharedTurn(cleared,'clear-idea'),cleared);
let rotation=start;for(let i=1;i<=4;i++){rotation=changeSharedTurn(rotation,'turn');assert.equal(rotation.tilt,(90*i)%360);assert.equal(rotation.first,60);}
assert.equal(rotation.tilt,start.tilt);
// Independently calculated finite data, not expectations derived from content.
const jobs=[[180,30,150],[180,90,90],[180,120,60],[180,150,30],[360,45,315],[360,120,240],[360,225,135],[360,300,60]];
assert.deepEqual(sharedTurnJobs.map(j=>[j.whole,j.given,j.missing]),jobs);
for(let i=0;i<8;i++){
 let w=changeSharedTurn(changeSharedTurn(start,'page','cover'),'job',i),m=sharedTurnModel(w);const [whole,given,missing]=jobs[i];
 assert.equal(m.geometry.whole,whole);assert.equal(m.geometry.first,given);assert.equal(m.geometry.second,missing);
 assert.equal(given+missing,whole);assert.equal(whole-given,missing);
 const closed=sharedTurnNarration(w);assert.match(closed,/covered label/);assert.doesNotMatch(closed,/The other part is|Together,|second part \d+ degrees/);
 assert.equal(m.reading,null);assert.equal(m.idea,null);
 w=changeSharedTurn(w,'draft','77');w=changeSharedTurn(w,'idea',17);
 const unchanged=sharedTurnModel(w).geometry;
 w=changeSharedTurn(w,'reading');m=sharedTurnModel(w);
 assert.deepEqual(m.geometry,unchanged);assert.equal(m.idea,17);assert.equal(m.draft,'77');
 assert.equal(m.reading.text,`The other part is ${missing}°. ${whole}° − ${given}° = ${missing}°. Together, ${given}° + ${missing}° = ${whole}°.`);
 assert.match(sharedTurnNarration(w),/Your idea: 17°/);assert.match(sharedTurnNarration(w),/Your draft, not kept yet: 77°/);
 w=changeSharedTurn(w,'reading');assert.equal(sharedTurnModel(w).reading,null);
 assert.doesNotMatch(sharedTurnNarration(w),/The other part is/);
 assert.doesNotMatch(JSON.stringify(m),/"(?:correct|score|fit|outcome|verdict|grade|passed)"/);
}
const unkept=changeSharedTurn(changeSharedTurn(start,'page','cover'),'draft','oops');assert.match(sharedTurnNarration(unkept),/not a whole-number idea yet/);
// Finite geometry: all build settings at every supported orientation.
for(const whole of [180,360])for(let first=0;first<=whole;first+=15)for(const tilt of [0,90,180,270]){
 const g=sharedTurnGeometry({whole,first,tilt});
 assert.equal(g.first+g.second,whole);assert.equal(g.gap,false);
 assert.deepEqual(g.rays.map(r=>r.role),['start','end','divider']);
 for(const [i,angle,length,width,headWidth] of [[0,tilt,115,10,14],[1,tilt+whole,100,6,10],[2,tilt+first,135,2,6]]){
  const r=g.rays[i];assert.equal(r.length,length);assert.equal(r.width,width);point(r.solid,angle,length);point(r.continuation,angle,152);point(r.tip,angle,155);
  const base=[(r.head[1][0]+r.head[2][0])/2,(r.head[1][1]+r.head[2][1])/2];point(base,angle,146);near(Math.hypot(r.head[1][0]-r.head[2][0],r.head[1][1]-r.head[2][1]),headWidth);
 }
 for(const [role,sweep,angle,radius] of [['whole',whole,tilt,145],['first',first,tilt,70],['second',whole-first,tilt+first,100]]){
  const a=g.arcs.find(a=>a.role===role);assert.equal(a.sweep,sweep);assert.equal(a.start,angle);assert.equal(a.radius,radius);assert.equal(a.segments.length,Math.ceil(sweep/180));
  let offset=0;for(const seg of a.segments){assert.equal(seg.large,0);assert.equal(seg.sweep,0);assert.equal(seg.radius,radius);point(seg.from,angle+offset,radius);offset+=Math.min(180,sweep-offset);point(seg.to,angle+offset,radius);}
  if(role==='whole'||sweep===0)assert.deepEqual(a.head,[]);
  else {point(a.head[0],angle+sweep,radius);const base=[(a.head[1][0]+a.head[2][0])/2,(a.head[1][1]+a.head[2][1])/2],theta=(angle+sweep)*Math.PI/180;near(a.head[0][0]-base[0],-Math.sin(theta)*8);near(a.head[0][1]-base[1],-Math.cos(theta)*8);}
 }
 const expectedNotes=whole===360&&(first===0||first===360)?[sharedTurnCopy.allRays]:[...(whole===360?[sharedTurnCopy.full]:[]),...(first===0?[sharedTurnCopy.dividerStart]:first===whole?[sharedTurnCopy.dividerEnd]:[])];
 assert.deepEqual(g.notes,expectedNotes);
}
for(const pose of [null,{},[],{whole:90,first:0},{whole:180,first:181},{whole:180,first:-1},{whole:180,first:0,tilt:15},{whole:360,first:60,gap:true},{whole:180,first:90,gap:true},{whole:180,first:60,gap:1}])assert.equal(sharedTurnGeometry(pose),null);
assert.deepEqual(sharedTurnLessons.map(l=>[l.whole,l.first,l.gap]),[[180,60,false],[360,90,false],[180,135,false],[180,60,true]]);
for(let i=0;i<4;i++)for(const tilt of [0,90,180,270]){
 let w=changeSharedTurn(changeSharedTurn(start,'page','learn'),'lesson',i);w={...w,tilt};const m=sharedTurnModel(w);
 assert.match(sharedTurnNarration(w),/Worked example/);assert.doesNotMatch(sharedTurnNarration(w),/Your idea:|Your draft/);
 if(i===3){const g=m.geometry;assert.equal(g.gap,true);assert.equal(g.second,60);assert.deepEqual(g.arcs.map(a=>[a.role,a.start-tilt,a.sweep,a.radius]),[['whole',0,180,145],['first',0,60,70],['second',120,60,100],['gap',60,60,120]]);const edge=g.rays.find(r=>r.role==='gap-edge');point(edge.solid,tilt+120,125);point(edge.continuation,tilt+120,152);point(edge.tip,tilt+120,155);assert.match(sharedTurnNarration(w),/60° \+ 60° \+ gap 60° = 180°/);}
}
// Closed references are absent, while geometry and learner-owned values stay independent.
for(let job=0;job<8;job++){
 let work=changeSharedTurn(changeSharedTurn(start,'page','cover'),'job',job);
 const closed=sharedTurnPage(work);
 assert.match(closed,/<p class="shared-turn-second-label">\?° · covered label<\/p>/);
 assert.doesNotMatch(closed,/data-shared-turn-reference|class="shared-turn-reference"|The other part is/);
 assert.match(closed,/second part covered/);
 assert.doesNotMatch(closed,/data-(?:shared-turn-)?(?:missing|answer|reference-value)=/);
 const diagram=closed.match(/<svg[\s\S]*?<\/svg>/)[0];
 work=changeSharedTurn(work,'draft',String(jobs[job][2]));work=changeSharedTurn(work,'idea',jobs[job][2]);
 const proposed=sharedTurnPage(work);
 assert.equal(proposed.match(/<svg[\s\S]*?<\/svg>/)[0],diagram);
 assert.match(proposed,new RegExp(`Your idea: ${jobs[job][2]}°`));
 assert.doesNotMatch(proposed,/data-shared-turn-reference|The other part is|shared-turn-(?:correct|wrong|success|failure)/);
 const revealed=sharedTurnPage(changeSharedTurn(work,'reading'));
 assert.match(revealed,/data-shared-turn-reference/);assert.match(revealed,new RegExp(`The other part is ${jobs[job][2]}°`));
}
assert.deepEqual(start,createSharedTurn());
assert.ok(Object.isFrozen(sharedTurnJobs)&&Object.isFrozen(sharedTurnJobs[0]));
console.log('Shared Turn finite math, immutable visit state, geometry and narration checks passed.');
