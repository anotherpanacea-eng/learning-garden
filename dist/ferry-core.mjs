import {ferryCases,ferryFrames,ferryNames} from './ferry-content.mjs';

export const FERRY_FRAMES=Object.freeze(['bank','ferry','other']);
export const FERRY_OBJECTS=Object.freeze(['bank','ferry','courier','other']);
export const FERRY_DRAW=Object.freeze({width:600,min:-20,max:20,cx:300,positionUnit:12,velocityUnit:40,head:14,headHalfWidth:7,shaftWidth:4,deckMin:-1,deckMax:9,otherMin:-1,otherMax:1});
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export const ferryCase=id=>ferryCases.find(c=>c.id===id)||null;
export const validFerryMaterial=m=>object(m)&&!!ferryCase(m.caseId)&&Number.isInteger(m.time)&&m.time>=0&&m.time<=6&&FERRY_FRAMES.includes(m.frame);
export const createFerry=id=>ferryCase(id)?{caseId:id,time:0,frame:'bank'}:null;
export function setFerryTime(m,time){return validFerryMaterial(m)&&Number.isInteger(time)&&time>=0&&time<=6&&time!==m.time?{...m,time}:null;}
export const stepFerryClock=(m,delta)=>validFerryMaterial(m)&&[-1,1].includes(delta)?setFerryTime(m,m.time+delta):null;
export const setFerryFrame=(m,frame)=>validFerryMaterial(m)&&FERRY_FRAMES.includes(frame)&&frame!==m.frame?{...m,frame}:null;
export const resetFerry=m=>validFerryMaterial(m)?createFerry(m.caseId):null;
export const ferryDirection=n=>!Number.isFinite(n)?null:n<0?'left':n>0?'right':'still';
export const ferrySigned=n=>!Number.isFinite(n)?null:n<0?`−${Math.abs(n)}`:n>0?`+${n}`:'0';
const xAt=q=>FERRY_DRAW.cx+FERRY_DRAW.positionUnit*q;
function arrow(u){
 const d=FERRY_DRAW,from=[d.cx,0],tip=[d.cx+d.velocityUnit*u,0];
 if(u===0)return {kind:'zero',from,shaftEnd:[...from],tip,head:[]};
 const base=[tip[0]-Math.sign(u)*d.head,0];
 return {kind:'arrow',from,shaftEnd:base,tip,head:[tip,[base[0],-d.headHalfWidth],[base[0],d.headHalfWidth]]};
}
export function ferryModel(material){
 if(!validFerryMaterial(material))return null;
 const c=ferryCase(material.caseId),t=material.time;
 const world={bank:{position:0,velocity:0},ferry:{position:-4+c.ferryVelocity*t,velocity:c.ferryVelocity},courier:{position:-4+c.courierStart+(c.ferryVelocity+c.courierWalk)*t,velocity:c.ferryVelocity+c.courierWalk},other:{position:6+c.otherVelocity*t,velocity:c.otherVelocity}};
 const observer=world[material.frame],objects=FERRY_OBJECTS.map(id=>{
  const position=world[id].position-observer.position,velocity=world[id].velocity-observer.velocity;
  return {id,name:ferryNames[id],bankPosition:world[id].position,bankVelocity:world[id].velocity,position,velocity,speed:Math.abs(velocity),direction:ferryDirection(velocity),x:xAt(position)};
 });
 const byId=Object.fromEntries(objects.map(o=>[o.id,o])),f=byId.ferry,o=byId.other,d=FERRY_DRAW;
 return {material:{...material},case:c,observer:{id:material.frame,name:ferryNames[material.frame],...observer},world,objects,byId,
  courierDeckPosition:c.courierStart+c.courierWalk*t,
  deck:{from:xAt(f.position+d.deckMin),to:xAt(f.position+d.deckMax)},otherHull:{from:xAt(o.position+d.otherMin),to:xAt(o.position+d.otherMax)},velocityArrow:arrow(byId.courier.velocity),
  positionTicks:[-20,-10,0,10,20].map(value=>({value,x:xAt(value)})),velocityTicks:[-4,0,4].map(value=>({value,x:d.cx+d.velocityUnit*value})),canBack:t>0,canForward:t<6};
}
export function ferryExample(index){
 if(!Number.isInteger(index)||index<0||index>=ferryFrames.length)return null;
 const frame=ferryFrames[index],model=ferryModel({caseId:frame.caseId,time:frame.time,frame:frame.frame});
 return {...structuredClone(frame),model};
}
