import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as F from '../dist/ferry-core.mjs';
import {ferryCases,ferryFrames,ferryCopy} from '../dist/ferry-content.mjs';

// Hand-authored constants and example oracles, separate from the model's output.
const CASES=[['riding',2,0,1,2],['with-ferry',2,1,-1,2],['against-ferry',2,-1,1,8],['side-by-side',2,0,2,2],['opposite-boats',1,0,-2,2],['hold-bank',-1,1,0,2]];
const KEYS=['bank','ferry','courier','other'],FRAMES=['bank','ferry','other'];
const EXAMPLES=[[0,'bank',[0,-4,-2,6]],[1,'bank',[0,-2,0,7]],[1,'ferry',[2,0,2,9]],[2,'ferry',[0,0,2,8]]];
export function runFerryChecks(){
 let checks=0,states=0;const ok=(x,m)=>{checks++;assert.ok(x,m);},eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
 const sources=structuredClone(ferryCases),examples=structuredClone(ferryFrames);
 eq(ferryCases.length,6);eq(ferryFrames.length,4);eq(F.FERRY_FRAMES,FRAMES);eq(F.FERRY_OBJECTS,KEYS);
 eq([F.FERRY_DRAW.width,F.FERRY_DRAW.cx,F.FERRY_DRAW.positionUnit,F.FERRY_DRAW.velocityUnit,F.FERRY_DRAW.head,F.FERRY_DRAW.headHalfWidth,F.FERRY_DRAW.shaftWidth],[600,300,12,40,14,7,4]);
 for(const [id,f,w,o,d] of CASES){
  const c=F.ferryCase(id);eq([c.ferryVelocity,c.courierWalk,c.otherVelocity,c.courierStart],[f,w,o,d]);
  eq(F.createFerry(id),{caseId:id,time:0,frame:'bank'});eq(F.resetFerry({caseId:id,time:6,frame:'other'}),F.createFerry(id));
  for(let t=0;t<=6;t++)for(const frame of FRAMES){
   states++;const material={caseId:id,time:t,frame},before=structuredClone(material),m=F.ferryModel(material);ok(F.validFerryMaterial(material));eq(m.material,material);ok(m.material!==material,'model material is its own value');eq(m.canBack,t>0);eq(m.canForward,t<6);
   const x=[0,-4+f*t,-4+d+(f+w)*t,6+o*t],v=[0,f,f+w,o],j=KEYS.indexOf(frame);
   eq(m.courierDeckPosition,d+w*t);ok(d+w*t>=2&&d+w*t<=8,'courier stays on the actual deck');
   eq(m.observer.id,frame);eq(m.observer.position,x[j]);eq(m.observer.velocity,v[j]);
   for(let i=0;i<4;i++){
    const k=KEYS[i],body=m.byId[k],q=x[i]-x[j],u=v[i]-v[j];eq(m.objects[i],body);eq(m.world[k],{position:x[i],velocity:v[i]});
    eq([body.id,body.bankPosition,body.bankVelocity,body.position,body.velocity,body.speed],[k,x[i],v[i],q,u,Math.abs(u)]);
    eq(body.x,300+12*q,'actual drawing coordinate follows selected observer origin');eq(body.direction,u<0?'left':u>0?'right':'still');
    eq(body.position,(i===0?0:i===1?-4:i===2?-4+d:6)-(j===0?0:j===1?-4:6)+u*t,'relative initial position plus relative velocity times time');
    for(let h=0;h<4;h++)eq(body.position-m.byId[KEYS[h]].position,x[i]-x[h],'rigid view translation preserves all pair separations');
    if(t<6){const next=F.ferryModel(F.stepFerryClock(material,1));eq(next.byId[k].position-body.position,u,'one-second finite difference equals signed relative velocity');}
    for(const target of FRAMES){const switched=target===frame?m:F.ferryModel(F.setFerryFrame(material,target));eq(switched.world,m.world,'frame switch never changes bank-referenced source event');eq(switched.material.time,t,'view switch cannot step time');}
   }
   eq([m.byId[frame].position,m.byId[frame].velocity],[0,0],'observer fixed at its own origin');
   eq(m.deck,{from:300+12*(x[1]-x[j]-1),to:300+12*(x[1]-x[j]+9)});eq(m.deck.to-m.deck.from,120,'same10m deck in every view');
   eq(m.otherHull,{from:300+12*(x[3]-x[j]-1),to:300+12*(x[3]-x[j]+1)});eq(m.otherHull.to-m.otherHull.from,24,'other hull not copied from ferry');
   const extents=[m.byId.bank.x-8,m.byId.bank.x+8,m.byId.courier.x-8,m.byId.courier.x+8,m.deck.from-2,m.deck.to+2,m.otherHull.from-2,m.otherHull.to+2];ok(extents.every(x=>x>=60&&x<=540),'all specified shape extents fit meter scene');
   const u=v[2]-v[j],a=m.velocityArrow;eq(a.from,[300,0],'velocity arrow has fixed own zero, not courier position');eq(a.tip,[300+40*u,0]);
   if(!u){eq(a.kind,'zero');eq(a.head,[]);eq(a.shaftEnd,[300,0],'zero is a point, not a short directional arrow');}
   else{
    eq(a.kind,'arrow');eq(a.shaftEnd,[300+40*u-Math.sign(u)*14,0]);eq(a.head,[[300+40*u,0],[300+40*u-Math.sign(u)*14,-7],[300+40*u-Math.sign(u)*14,7]]);
    eq(Math.abs(a.head[1][0]-a.tip[0]),14);eq(a.head[2][1]-a.head[1][1],14);ok(Math.sign(a.tip[0]-a.from[0])===Math.sign(u),'arrow points with relative velocity');ok(Math.abs(a.tip[0]-a.from[0])>=40,'smallest nonzero direction remains substantial');
    ok(Math.min(a.from[0],a.tip[0])<=a.shaftEnd[0]&&a.shaftEnd[0]<=Math.max(a.from[0],a.tip[0]),'head extends backward within signed extent; shaft ends at its base');
   }
   ok([a.from,a.tip,a.shaftEnd,...a.head].every(p=>p[0]>=60&&p[0]<=540&&Math.abs(p[1])<=7),'velocity head and shaft remain within separate lane');
   eq(m.positionTicks.map(x=>[x.value,x.x]),[[-20,60],[-10,180],[0,300],[10,420],[20,540]]);eq(m.velocityTicks.map(x=>[x.value,x.x]),[[-4,140],[0,300],[4,460]],'velocity has separate units and scale');
   eq(F.setFerryTime(material,t),null,'same-time no-op refused');eq(F.setFerryFrame(material,frame),null,'same-view no-op refused');eq(F.stepFerryClock(material,-1),t?{...material,time:t-1}:null);eq(F.stepFerryClock(material,1),t<6?{...material,time:t+1}:null);eq(material,before,'no material mutation');
  }
 }
 // Positive position with leftward velocity; zero position with nonzero velocity.
 const bankFromFerry=F.ferryModel({caseId:'riding',time:1,frame:'ferry'}).byId.bank;eq([bankFromFerry.position,bankFromFerry.velocity],[2,-2]);
 const courierAtBank=F.ferryModel({caseId:'riding',time:1,frame:'bank'}).byId.courier;eq([courierAtBank.position,courierAtBank.velocity],[0,2]);
 const same=F.ferryModel({caseId:'side-by-side',time:4,frame:'ferry'});eq([same.byId.other.position,same.byId.other.velocity],[10,0],'same velocity does not collapse distinct origins');
 for(let t=0;t<=6;t++){
  const b=F.ferryModel({caseId:'hold-bank',time:t,frame:'bank'}),o=F.ferryModel({caseId:'hold-bank',time:t,frame:'other'});
  for(const k of KEYS){eq(o.byId[k].position,b.byId[k].position-6);eq(o.byId[k].velocity,b.byId[k].velocity,'equal-velocity observers change origins, not relative velocity');}
  eq([b.byId.courier.velocity,F.ferryModel({caseId:'hold-bank',time:t,frame:'ferry'}).byId.courier.velocity],[0,1]);
 }
 const seed=F.createFerry('with-ferry');
 for(const bad of [null,undefined,[],17,'riding',{}, {...seed,caseId:'__proto__'}, {...seed,caseId:'unknown'}, {...seed,time:-1},{...seed,time:7},{...seed,time:.5},{...seed,time:'1'},{...seed,time:NaN},{...seed,time:Infinity},{...seed,frame:'courier'},{...seed,frame:0}]){ok(!F.validFerryMaterial(bad));eq(F.ferryModel(bad),null);eq(F.stepFerryClock(bad,1),null);eq(F.setFerryFrame(bad,'ferry'),null);eq(F.resetFerry(bad),null);}
 for(const value of [-1,7,.5,NaN,Infinity,'1',null])eq(F.setFerryTime(seed,value),null);
 for(const value of [-2,0,2,.5,'1',null])eq(F.stepFerryClock(seed,value),null);
 for(const value of ['courier','unknown',null,0])eq(F.setFerryFrame(seed,value),null);
 for(const value of ['unknown','__proto__',null]){eq(F.ferryCase(value),null);eq(F.createFerry(value),null);}
 for(let i=0;i<4;i++){const ex=F.ferryExample(i),[time,frame,positions]=EXAMPLES[i];eq([ex.caseId,ex.time,ex.frame],['riding',time,frame]);eq(ex.model.objects.map(o=>o.position),positions);eq(F.createFerry('with-ferry'),seed,'examples never overwrite working material');}
 for(const bad of [-1,4,.5,'0',null,NaN])eq(F.ferryExample(bad),null);
 eq([F.ferrySigned(-3),F.ferrySigned(0),F.ferrySigned(-0),F.ferrySigned(4)],['−3','0','0','+4']);eq(F.ferrySigned(NaN),null);eq(F.ferryDirection(Infinity),null);
 ok(ferryCopy.explanation.includes('{observer}')&&!ferryCopy.explanation.includes('another moving origin'),'shared explanation fits bank and equal-velocity views');
 eq(ferryCases,sources,'source cases unchanged');eq(ferryFrames,examples,'example sources unchanged');return {checks,states,cases:CASES.length,frames:EXAMPLES.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(runFerryChecks())+' Ferry core/math checks passed');
