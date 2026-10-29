// Original synthetic297 material: mathematical invariants, not learner grading.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {hingeCases,hingeFrames,hingeCopy} from '../dist/hinge-content.mjs';
import * as H from '../dist/hinge-core.mjs';
export function runHingeChecks(){
 let checks=0,states=0;
 const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},near=(a,b,m)=>{assert.ok(Math.abs(a-b)<1e-8,`${m}: ${a} vs ${b}`);checks++;};
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 const normAngle=x=>((x%360)+360)%360;
 const angleOf=(point,pin)=>normAngle(Math.atan2(pin[1]-point[1],point[0]-pin[0])*180/Math.PI);
 const tuples=p=>[p.opening,p.goldLength,p.blueLength,p.tilt];
 const fixtureOracle=[['same-turn',[60,2,2,0],[60,1,3,0]],['tips-trick',[110,1,1,0],[45,3,3,0]],['tilted-square',[90,2,3,0],[110,3,1,60]],['near-right',[85,2,2,0],[95,2,2,0]],['straight',[180,2,2,15],[150,3,3,15]],['long-way',[270,2,2,0],[90,2,2,0]],['full-turn',[360,2,2,0],[0,1,3,0]]];
 eq(hingeCases.map(c=>[c.id,tuples(c.reference),tuples(c.initial)]),fixtureOracle,'exact independently reviewed finite fixtures');
 eq(hingeFrames.map(f=>[tuples(f.reference),tuples(f.working)]),[[[60,1,1,0],[60,1,1,0]],[[60,1,1,0],[60,3,3,0]],[[110,1,1,0],[45,3,3,0]],[[60,2,2,0],[60,2,2,120]],[[0,2,3,0],[360,2,3,0]]],'all five exact worked frames');
 const sourceBefore=structuredClone(hingeCases),framesBefore=structuredClone(hingeFrames);
 const boundaries=[[0,'zero'],[5,'acute'],[85,'acute'],[90,'right'],[95,'obtuse'],[175,'obtuse'],[180,'straight'],[185,'reflex'],[270,'reflex'],[355,'reflex'],[360,'full']];
 for(const [n,name] of boundaries)eq(H.hingeType(n),name,'hand-authored boundary '+n);
 for(const n of [-1,361,NaN,Infinity,undefined,null,'90'])eq(H.hingeType(n),null,'invalid type input');
 for(const value of [null,undefined,[],{},false,0,'material',{caseId:'missing',opening:60,goldLength:1,blueLength:1,tilt:0}]){
  eq(H.hingeModel(value),null,'invalid material does not become a model');eq(H.changeHingeTurn(value,5),null);eq(H.changeHingeArm(value,'gold',1),null);eq(H.turnWholeHinge(value),null);eq(H.resetHinge(value),null);
 }
 eq(H.createHinge('missing'),null);eq(H.hingeExample(-1),null);eq(H.hingeExample(5),null);eq(H.hingeExample(1.5),null);
 for(const c of hingeCases){const m=H.createHinge(c.id),before=structuredClone(m);ok(H.validHingeMaterial(m));eq(H.changeHingeTurn(m,0),null,'no-op/unsupported delta refused');eq(H.changeHingeTurn(m,7),null,'off-grid delta refused');eq(H.changeHingeArm(m,'other',1),null);eq(H.changeHingeArm(m,'gold',0),null);eq(m,before,'invalid controls never mutate original material');eq(H.resetHinge(H.turnWholeHinge(m)),m,'reset exact own authored case');}
 const seed=H.createHinge('same-turn');
 for(let opening=0;opening<=360;opening+=5)for(let tilt=0;tilt<360;tilt+=15)for(let goldLength=1;goldLength<=3;goldLength++)for(let blueLength=1;blueLength<=3;blueLength++){
  const p={...seed,opening,tilt,goldLength,blueLength},before=structuredClone(p),g=H.hingeGeometry(p);states++;
  for(const [name,length] of [['gold',goldLength],['blue',blueLength]]){
   near(distance(g[name].solid,g.pin),length*32,'radial visible length');near(distance(g[name].tip,g.pin),length*32+8,'radial arrow tip');near(distance(g[name].solid,g[name].tip),8,'total continuation includes arrowhead');
   near(distance(g[name].head[0],g[name].head[1]),Math.sqrt(45),'six by six backwards arrowhead');
   for(const point of g[name].head){ok(distance(point,g.pin)<=104+1e-8,'all arrowhead vertices stay in bounded reach');ok(point.every(x=>x>=26-1e-8&&x<=234+1e-8),'all directions fit260viewBox');}
  }
  near(distance(g.sweep.from,g.pin),20,'fixed sweep radius independent of arm size');near(distance(g.sweep.to,g.pin),20,'fixed sweep end radius');
  // Recover ray direction from rendered endpoints rather than the stored label.
  const measured=normAngle(angleOf(g.blue.solid,g.pin)-angleOf(g.gold.solid,g.pin));near(Math.min(Math.abs(measured-opening%360),Math.abs(measured-opening%360-360)),0,'counterclockwise endpoint direction');
  eq(g.coincident,opening===0||opening===360,'only these selected sweeps have coincident rays');
  if(opening===0){eq(g.sweep.kind,'zero');eq(g.sweep.segments.length,0,'no turn has no arc');}
  else if(opening===360){eq(g.sweep.kind,'full');eq(g.sweep.segments.length,2,'full turn has two actual half arcs');eq(g.sweep.from,g.sweep.to,'full circle returns to same point');near(distance(g.sweep.segments[0].to,g.sweep.from),40,'half-circle intermediate is antipodal');}
  else{eq(g.sweep.kind,'partial');eq(g.sweep.segments.length,1);eq(g.sweep.segments[0].large,opening>180?1:0,'reflex uses larger sweep');}
  ok(g.sweep.segments.every(s=>s.sweep===0),'counterclockwise SVG sweep flag');eq(!!g.rightMark,opening===90,'reflex perpendicular rays are not marked as a selected right angle');
  near(distance(g.card[0],g.card[1]),16,'quarter card leg');near(distance(g.card[0],g.card[3]),16,'other card leg');near(distance(g.card[1],g.card[3]),16*Math.SQRT2,'card corner remains square at every tilt');
  const turned=H.turnWholeHinge(p);eq(turned.opening,opening,'rigid turn preserves selected sweep');eq([turned.goldLength,turned.blueLength],[goldLength,blueLength]);eq(turned.tilt,(tilt+15)%360,'whole orientation wraps without resetting the sweep');
  for(const side of ['gold','blue'])for(const delta of [-1,1]){const next=H.changeHingeArm(p,side,delta),length=p[side+'Length']+delta;if(length<1||length>3)eq(next,null,'length endpoint refuses');else{eq(next.opening,opening,'either visible length preserves turn');eq(next.tilt,tilt);eq(next[side+'Length'],length);}}
  for(const delta of [-90,-5,5,90]){const next=H.changeHingeTurn(p,delta),target=opening+delta;if(target<0||target>360)eq(next,null,'no quarter-step overshoot/clamp');else{eq(next.opening,target);eq([next.goldLength,next.blueLength,next.tilt],[goldLength,blueLength,tilt],'changing turn holds lengths/orientation');}}
  eq(p,before,'pure model/control operations do not mutate input');
 }
 for(const c of hingeCases)for(let opening=0;opening<=360;opening+=5)for(let tilt=0;tilt<360;tilt+=15){
  const m={...H.createHinge(c.id),opening,tilt},view=H.hingeModel(m),o=view.overlay;
  eq(o.pose.opening,c.reference.opening,'rigid reference alignment preserves selected measure');eq([o.pose.goldLength,o.pose.blueLength],[c.reference.goldLength,c.reference.blueLength],'overlay never rescales');eq(o.gold.direction,view.working.gold.direction,'aligned common starting ray');
  near(distance(o.blue.solid,o.pin),c.reference.blueLength*32,'aligned reference original visible length');
  eq(view.relation,opening===c.reference.opening?'same':opening<c.reference.opening?'smaller':'larger');
 }
 const tip=H.hingeModel(H.createHinge('tips-trick'));
 for(const endpoint of ['solid','tip'])ok(distance(tip.working.gold[endpoint],tip.working.blue[endpoint])>distance(tip.reference.gold[endpoint],tip.reference.blue[endpoint]),'smaller45degree model has larger actual '+endpoint+' gap');
 const full=H.createHinge('full-turn');eq(H.hingeModel(full).relation,'smaller');ok(H.hingeModel(full).sameEndingDirection,'zero and full share final direction');
 let turn=full;for(let i=0;i<4;i++)turn=H.changeHingeTurn(turn,90);eq(turn.opening,360,'four quarter steps construct one full selected turn');eq(H.hingeModel(turn).relation,'same');eq(H.changeHingeTurn(turn,5),null,'never wraps360into0');
 for(let i=0;i<5;i++){const ex=H.hingeExample(i);eq(ex.reference.pose,hingeFrames[i].reference);eq(ex.working.pose,hingeFrames[i].working);eq(H.createHinge('same-turn'),seed,'example never replaces working material');}
 const two=H.hingeExample(1),four=H.hingeExample(3),five=H.hingeExample(4);
 eq(two.reference.pose.opening,two.working.pose.opening,'longer arms worked invariant');eq(four.reference.pose.opening,four.working.pose.opening,'rotated worked invariant');ok(four.reference.pose.tilt!==four.working.pose.tilt,'worked rotation is not cosmetic label');eq([five.reference.sweep.kind,five.working.sweep.kind],['zero','full']);
 ok(hingeCopy.units.includes('360')&&hingeCopy.units.includes('90°'),'visible mathematical unit definition');ok(hingeCopy.notice.includes('not a tool for measuring real objects'),'no physical measuring claim');
 eq(hingeCases,sourceBefore,'reference/catalog never mutated');eq(hingeFrames,framesBefore,'worked sources never mutated');
 return {checks,states,cases:hingeCases.length,frames:hingeFrames.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(runHingeChecks())+' Hinge core/math checks passed');
