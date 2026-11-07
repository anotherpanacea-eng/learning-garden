// Visit-local explanatory model. No observation or notebook records are read or written.
import {moonlightCopy as copy,moonlightPlaces,moonlightTeaching,moonlightInvitations} from './moonlight-content.mjs';

const fields=['position','revealed','orientation','page','step','invitation'];
function readWork(work){
 try{
  if(work===null||typeof work!=='object'||![Object.prototype,null].includes(Object.getPrototypeOf(work)))return null;
  const keys=Reflect.ownKeys(work);
  if(keys.length!==fields.length||keys.some(key=>!fields.includes(key)))return null;
  const values={};
  for(const key of fields){const descriptor=Object.getOwnPropertyDescriptor(work,key);if(!descriptor||!Object.hasOwn(descriptor,'value'))return null;values[key]=descriptor.value;}
  const {position,revealed,orientation,page,step,invitation}=values;
  if(!Number.isInteger(position)||position<0||position>7||typeof revealed!=='boolean'||!['north','south'].includes(orientation)||!['explore','teaching'].includes(page)||!Number.isInteger(step)||step<0||step>3||!Number.isInteger(invitation)||invitation<0||invitation>3||page==='explore'&&step!==0)return null;
  return values;
 }catch{return null;}
}
export function createMoonlight(orientation='north'){
 return {position:0,revealed:false,orientation:orientation==='south'?'south':'north',page:'explore',step:0,invitation:0};
}
export function changeMoonlight(work,action,value){
 const next=readWork(work);if(!next)return null;
 if(action==='position'||action==='step'){
  const max=action==='position'?7:3;
  if(!Number.isInteger(value)||value<0||value>max||next.page!==(action==='position'?'explore':'teaching')||next[action]===value)return null;
  next[action]=value;return next;
 }
 if(value!==undefined)return null;
 if(action==='teaching'){
  if(next.page==='teaching')return null;
  next.page='teaching';next.step=0;return next;
 }
 if(action==='explore'){
  if(next.page==='explore')return null;
  next.page='explore';next.step=0;return next;
 }
 if(next.page!=='explore')return null;
 switch(action){
  case 'next':next.position=(next.position+1)%8;break;
  case 'previous':next.position=(next.position+7)%8;break;
  case 'reveal':next.revealed=!next.revealed;break;
  case 'flip':next.orientation=next.orientation==='north'?'south':'north';break;
  case 'invitation':next.invitation=(next.invitation+1)%4;break;
  default:return null;
 }
 return next;
}
export function moonlightModel(work){
 const current=readWork(work);if(!current)return null;
 const showingExample=current.page==='teaching',card=showingExample?moonlightTeaching[current.step]:null;
 const position=card?card.position:current.position,place=moonlightPlaces[position];
 const visible=showingExample||current.revealed;
 return {page:current.page,step:current.step,position,location:place.location,
  point:{x:170+112*Math.cos(position*Math.PI/4),y:170-112*Math.sin(position*Math.PI/4)},
  phase:visible?{code:place.code,name:place.name,description:place.description,amount:place.amount}:null,
  orientations:visible?(showingExample&&current.step===3?['north','south']:[current.orientation]):[],
  teaching:card?{title:card.title,text:card.text}:null,
  invitation:showingExample?null:moonlightInvitations[current.invitation],showingExample};
}
export function moonlightNarration(work){
 const model=moonlightModel(work);if(!model)return null;
 const place=label=>copy.placeTemplate.replace('{label}',label).replace('{location}',model.location);
 const common=[copy.model,copy.tilt,copy.above,copy.places,copy.orbitMotion];
 const ending=[copy.returnPrompt,copy.visit];
 if(model.showingExample){
  return [copy.title,copy.example,copy.stepTemplate.replace('{number}',String(model.step+1)),model.teaching.title,model.teaching.text,...common,place(copy.example),copy.sunlight,copy.viewLine,copy.earthView,
   ...model.orientations.flatMap(orientation=>[copy[orientation],model.phase.name,model.phase.amount,model.phase.description]),copy.orientation,...ending].join(' ');
 }
 return [copy.title,copy.opening,...common,model.invitation,place(copy.selected),copy.sunlight,copy.viewLine,
  ...(model.phase?[copy.earthView,model.phase.name,model.phase.amount,model.phase.description,copy[model.orientations[0]],copy.orientation]:[copy.hidden]),...ending].join(' ');
}
