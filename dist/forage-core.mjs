import {ensureCafe,availableIngredients,currentRecipe} from './cafe-core.mjs';
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const tripId=index=>'forage-'+index;
function trailChoices(c,id,index){
 const foods=availableIngredients(c).map(a=>a.id),others=foods.filter(v=>v!==id),offset=(c.seed+index)%others.length;
 const choices=[id,others[offset],others[(offset+1)%others.length]],rotate=index%3;
 return choices.slice(rotate).concat(choices.slice(0,rotate));
}
function cleanTrip(raw,c,nextTrip){
 if(!object(raw)||!integer(raw.index,0,999999999)||raw.id!==tripId(raw.index)||raw.index>=nextTrip||raw.index<nextTrip-24||!availableIngredients(c).some(a=>a.id===raw.ingredientId)||!integer(raw.baskets,2,6)||!integer(raw.bites,2,6))return null;
 const allowed=new Set(availableIngredients(c).map(a=>a.id));
 const choices=Array.isArray(raw.choices)&&raw.choices.length===3&&new Set(raw.choices).size===3&&raw.choices.includes(raw.ingredientId)&&raw.choices.every(v=>allowed.has(v))?[...raw.choices]:trailChoices(c,raw.ingredientId,raw.index);
 const searchChoices=Array.isArray(raw.searchChoices)?raw.searchChoices.filter(v=>choices.includes(v)).slice(-50):[];
 const collected=raw.collected===true||raw.stage==='packed',found=searchChoices.includes(raw.ingredientId);
 const steps=integer(raw.steps,0,raw.baskets)?raw.steps:0;
 return {id:raw.id,index:raw.index,ingredientId:raw.ingredientId,stage:collected?'packed':found?'harvest':'search',choices,searchChoices,baskets:raw.baskets,bites:raw.bites,total:raw.baskets*raw.bites,input:typeof raw.input==='string'?raw.input.slice(0,40):'',error:typeof raw.error==='string'?raw.error.slice(0,200):'',attempts:Array.isArray(raw.attempts)?raw.attempts.filter(v=>integer(v,0,999)).slice(-50):[],supported:raw.supported===true||raw.revealed===true||steps>0,revealed:raw.revealed===true,steps,collected,guided:true,...(collected?{supplied:raw.baskets*raw.bites}:{})};
}
export function ensureForage(state){
 const c=ensureCafe(state),raw=object(c.foraging)&&c.foraging.version===1?c.foraging:{};
 const saved=Array.isArray(raw.trips)?raw.trips:[];
 const indices=saved.filter(object).map(t=>t.index).filter(i=>integer(i,0,999999999));
 const nextTrip=Math.max(integer(raw.nextTrip,0,1000000000)?raw.nextTrip:0,...indices.map(i=>i+1));
 const unique=new Map();
 for(const entry of saved){const t=cleanTrip(entry,c,nextTrip);if(t){const old=unique.get(t.id);if(!old||t.collected||!old.collected)unique.set(t.id,t);}}
 const trips=[...unique.values()].sort((a,b)=>a.index-b.index).slice(-24);
 c.foraging={version:1,nextTrip,currentId:trips.some(t=>t.id===raw.currentId)?raw.currentId:null,trips};
 return c.foraging;
}
export function currentForage(state){
 const f=state.cafe?.foraging;return f?.trips?.find(t=>t.id===f.currentId)||null;
}
export function resumeForage(state,id){
 const f=ensureForage(state);if(!f.trips.some(t=>t.id===id))return false;f.currentId=id;return true;
}
function harvestSize(c,id,index){
 const gap=currentRecipe(c).find(i=>i.ingredient.id===id)?.missing||12;
 if(gap>36)return [6,6];
 const pairs=[];for(let baskets=2;baskets<=6;baskets++)for(let bites=2;bites<=6;bites++)if(baskets*bites>=gap)pairs.push([baskets,bites]);
 const total=Math.min(...pairs.map(([a,b])=>a*b)),best=pairs.filter(([a,b])=>a*b===total);
 return best[(c.seed+index)%best.length];
}
export function startForage(state,ingredientId){
 const f=ensureForage(state),c=state.cafe;if(f.nextTrip>=1000000000||!availableIngredients(c).some(a=>a.id===ingredientId)||c.stock[ingredientId]>144)return false;
 const index=f.nextTrip++,[baskets,bites]=harvestSize(c,ingredientId,index);
 const trip={id:tripId(index),index,ingredientId,stage:'search',choices:trailChoices(c,ingredientId,index),searchChoices:[],baskets,bites,total:baskets*bites,input:'',error:'',attempts:[],supported:false,revealed:false,steps:0,collected:false,guided:true};
 f.trips.push(trip);f.trips=f.trips.slice(-24);f.currentId=trip.id;return true;
}
export function chooseForage(state,ingredientId){
 ensureForage(state);const trip=currentForage(state);if(!trip||trip.stage!=='search'||!trip.choices.includes(ingredientId))return false;
 trip.searchChoices.push(ingredientId);trip.searchChoices=trip.searchChoices.slice(-50);
 if(ingredientId===trip.ingredientId){trip.stage='harvest';return true;}return false;
}
export function submitHarvest(state,value){
 ensureForage(state);const trip=currentForage(state);if(!trip||trip.stage!=='harvest'||!integer(value,0,999))return false;
 trip.error='';trip.attempts.push(value);trip.attempts=trip.attempts.slice(-50);return value===trip.total;
}
export function supportHarvest(state,{reveal=false}={}){
 ensureForage(state);const trip=currentForage(state);if(!trip||trip.stage!=='harvest')return false;trip.supported=true;if(reveal)trip.revealed=true;return true;
}
export function stepHarvest(state){
 ensureForage(state);const trip=currentForage(state);if(!trip||trip.stage!=='harvest')return false;trip.supported=true;trip.steps=Math.min(trip.baskets,trip.steps+1);return true;
}
export function packHarvest(state){
 ensureForage(state);const trip=currentForage(state),c=state.cafe;
 if(!trip||trip.stage!=='harvest'||trip.collected||!trip.searchChoices.includes(trip.ingredientId)||!trip.supported&&trip.attempts.at(-1)!==trip.total)return false;
 if(c.stock[trip.ingredientId]+trip.total>180){trip.error='This jar holds 180 bites. Keep this harvest here and use some from the jar first.';return false;}
 c.stock[trip.ingredientId]+=trip.total;trip.collected=true;trip.stage='packed';trip.supplied=trip.total;trip.error='';return true;
}
