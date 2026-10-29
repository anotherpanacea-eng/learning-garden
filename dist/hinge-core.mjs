import {hingeCases,hingeFrames,hingeTypeText} from './hinge-content.mjs';

export const HINGE_DRAW=Object.freeze({size:260,cx:130,cy:130,unit:32,tail:8,radius:20,card:16,head:6,headHalfWidth:3});
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export const hingeCase=id=>hingeCases.find(c=>c.id===id)||null;
export function validHingePose(p){return object(p)&&Number.isInteger(p.opening)&&p.opening>=0&&p.opening<=360&&p.opening%5===0&&['goldLength','blueLength'].every(k=>Number.isInteger(p[k])&&p[k]>=1&&p[k]<=3)&&Number.isInteger(p.tilt)&&p.tilt>=0&&p.tilt<360&&p.tilt%15===0;}
export const validHingeMaterial=m=>validHingePose(m)&&!!hingeCase(m.caseId);
export function createHinge(id){const c=hingeCase(id);return c?{caseId:id,...structuredClone(c.initial)}:null;}
export function changeHingeTurn(m,delta){if(!validHingeMaterial(m)||![-90,-5,5,90].includes(delta))return null;const opening=m.opening+delta;return opening>=0&&opening<=360?{...m,opening}:null;}
export function changeHingeArm(m,side,delta){if(!validHingeMaterial(m)||!['gold','blue'].includes(side)||![-1,1].includes(delta))return null;const field=`${side}Length`,length=m[field]+delta;return length>=1&&length<=3?{...m,[field]:length}:null;}
export const turnWholeHinge=m=>validHingeMaterial(m)?{...m,tilt:(m.tilt+15)%360}:null;
export const resetHinge=m=>validHingeMaterial(m)?createHinge(m.caseId):null;

export function hingeType(degrees){
 if(!Number.isFinite(degrees)||degrees<0||degrees>360)return null;
 return degrees===0?'zero':degrees<90?'acute':degrees===90?'right':degrees<180?'obtuse':degrees===180?'straight':degrees<360?'reflex':'full';
}
const direction=degrees=>{
 const d=((degrees%360)+360)%360;
 if(d===0)return [1,0];if(d===90)return [0,-1];if(d===180)return [-1,0];if(d===270)return [0,1];
 const r=d*Math.PI/180;return [Math.cos(r),-Math.sin(r)];
};
const at=(u,r)=>[HINGE_DRAW.cx+u[0]*r,HINGE_DRAW.cy+u[1]*r];
function ray(degrees,length){
 const u=direction(degrees),solid=at(u,length*HINGE_DRAW.unit),tip=at(u,length*HINGE_DRAW.unit+HINGE_DRAW.tail);
 const base=[tip[0]-u[0]*HINGE_DRAW.head,tip[1]-u[1]*HINGE_DRAW.head],n=[-u[1]*HINGE_DRAW.headHalfWidth,u[0]*HINGE_DRAW.headHalfWidth];
 return {direction:u,solid,tip,head:[tip,[base[0]+n[0],base[1]+n[1]],[base[0]-n[0],base[1]-n[1]]]};
}
function sweep(opening,tilt){
 const from=at(direction(tilt),HINGE_DRAW.radius),to=at(direction(tilt+opening),HINGE_DRAW.radius);
 if(opening===0)return {kind:'zero',from,to,segments:[]};
 if(opening===360){const middle=at(direction(tilt+180),HINGE_DRAW.radius);return {kind:'full',from,to,segments:[{from,to:middle,large:0,sweep:0},{from:middle,to,large:0,sweep:0}]};}
 return {kind:'partial',from,to,segments:[{from,to,large:opening>180?1:0,sweep:0}]};
}
export function hingeGeometry(pose){
 if(!validHingePose(pose))return null;
 const gold=ray(pose.tilt,pose.goldLength),blue=ray(pose.tilt+pose.opening,pose.blueLength),quarter=direction(pose.tilt+90),u=gold.direction;
 const corner=r=>[at(u,r),[HINGE_DRAW.cx+(u[0]+quarter[0])*r,HINGE_DRAW.cy+(u[1]+quarter[1])*r],at(quarter,r)];
 const code=hingeType(pose.opening);
 return {pose:{...pose},pin:[HINGE_DRAW.cx,HINGE_DRAW.cy],gold,blue,sweep:sweep(pose.opening,pose.tilt),type:code,typeText:hingeTypeText[code],
  card:[[HINGE_DRAW.cx,HINGE_DRAW.cy],...corner(HINGE_DRAW.card)],rightMark:pose.opening===90?corner(8):null,
  coincident:pose.opening===0||pose.opening===360};
}
export function hingeModel(material){
 if(!validHingeMaterial(material))return null;
 const c=hingeCase(material.caseId),reference=hingeGeometry(c.reference),working=hingeGeometry(material);
 const relation=material.opening===c.reference.opening?'same':material.opening<c.reference.opening?'smaller':'larger';
 // Align only by rigid rotation. Never infer the sweep from final rays: that
 // would erase a full turn and fold a reflex turn into its complement.
 const overlay=hingeGeometry({...c.reference,tilt:material.tilt});
 return {case:c,reference,working,overlay,relation,sameEndingDirection:(material.opening-c.reference.opening)%360===0,
  canMore:material.opening<360,canBack:material.opening>0,canQuarterMore:material.opening<=270,canQuarterBack:material.opening>=90,
  canGoldShorter:material.goldLength>1,canGoldLonger:material.goldLength<3,canBlueShorter:material.blueLength>1,canBlueLonger:material.blueLength<3};
}
export function hingeExample(index){
 if(!Number.isInteger(index)||index<0||index>=hingeFrames.length)return null;
 const f=hingeFrames[index];return {index,title:f.title,text:f.text,reference:hingeGeometry(f.reference),working:hingeGeometry(f.working)};
}
