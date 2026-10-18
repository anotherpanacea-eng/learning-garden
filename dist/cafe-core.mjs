import {ingredients,orchardFoods,guests,wishes} from './cafe-content.mjs';
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const count=(x,max=30)=>integer(x,0,max)?x:0;
const copy=x=>JSON.parse(JSON.stringify(x));
const blankNumber=()=>({input:'',error:'',attempts:[],supported:false,skipped:false,steps:0,revealed:false});
function cleanNumber(x){
 if(!object(x))return blankNumber();
 return {input:typeof x.input==='string'?x.input.slice(0,40):'',error:typeof x.error==='string'?x.error.slice(0,200):'',attempts:Array.isArray(x.attempts)?x.attempts.filter(v=>integer(v,0,999)).slice(-50):[],supported:x.supported===true||x.revealed===true||count(x.steps,144)>0||x.skipped===true,skipped:x.skipped===true,steps:count(x.steps,144),revealed:x.revealed===true};
}
export const availableIngredients=c=>ingredients.filter(a=>!a.orchard||c.discoveries?.includes(a.id));
function cleanRecipe(x,c){
 const available=new Set(availableIngredients(c).map(a=>a.id));let remaining=12;
 return Object.fromEntries(ingredients.map(a=>{const n=available.has(a.id)&&object(x)?Math.min(remaining,count(x[a.id],12)):0;remaining-=n;return [a.id,n];}));
}
const stockFor=seed=>Object.fromEntries(ingredients.map((a,i)=>[a.id,a.orchard?0:2+(seed+i*3)%8]));
function legacyParams(c,index){
 const seed=c.seed;
 return {guestId:guests[(seed%guests.length+index)%guests.length].id,wanted:[...wishes[(Math.floor(seed/8)%wishes.length+index*5)%wishes.length]],guests:2+(Math.floor(seed/96)+index)%3,bites:2+(Math.floor(seed/288)+Math.floor(index/3))%2};
}
function cleanParams(p){
 if(!object(p)||!guests.some(g=>g.id===p.guestId)||!integer(p.guests,1,12)||!integer(p.bites,1,12)||!Array.isArray(p.wanted)||p.wanted.length!==2||!wishes.some(w=>w.every(v=>p.wanted.includes(v))))return null;
 return {guestId:p.guestId,wanted:[...p.wanted],guests:p.guests,bites:p.bites};
}
export function orderFor(c,index=c.current?.orderIndex??c.nextOrder){
 const record=c.current?.orderIndex===index?c.current:c.history?.find(r=>r.orderIndex===index);
 const p=cleanParams(record?.params)||legacyParams(c,index);
 return {index,guest:guests.find(g=>g.id===p.guestId),wanted:[...p.wanted],guests:p.guests,bites:p.bites,total:p.guests*p.bites};
}
function plate(c,recipe,index){
 const order=orderFor(c,index),properties=[...new Set(ingredients.filter(a=>recipe[a.id]>0).flatMap(a=>a.properties))],n=Object.values(recipe).reduce((a,b)=>a+b,0),missingProperties=order.wanted.filter(p=>!properties.includes(p));
 return {count:n,properties,missingProperties,valid:n===order.bites&&!missingProperties.length};
}
function cleanPlateAttempts(x,c,index){return Array.isArray(x)?x.filter(a=>object(a)&&object(a.recipe)).slice(-50).map(a=>{const recipe=cleanRecipe(a.recipe,c);return {recipe,...plate(c,recipe,index)};}):[];}
function repairFor(c,recipe,index){
 const p=plate(c,recipe,index);if(p.valid)return null;
 const property=p.missingProperties[0],difference=orderFor(c,index).bites-p.count;
 return {kind:property?'ingredient':'count',target:property||Math.abs(difference),missingProperty:property||null,needed:property?null:Math.abs(difference),direction:difference>=0?'add':'remove',recipe:{...recipe},attempts:[],supported:false,open:true};
}
function repairCorrect(r,value){return r.kind==='count'?value===r.target:ingredients.some(a=>a.id===value&&a.properties.includes(r.target));}
function cleanRepair(raw,c,index){
 if(!object(raw)||!object(raw.recipe))return null;
 const r=repairFor(c,cleanRecipe(raw.recipe,c),index);if(!r)return null;
 r.supported=raw.supported===true;r.open=raw.open===true;
 r.attempts=Array.isArray(raw.attempts)?raw.attempts.filter(object).map(a=>a.value).filter(v=>r.kind==='count'?integer(v,0,12):ingredients.some(a=>a.id===v)).slice(-50).map(value=>({value,correct:repairCorrect(r,value)})):[];
 return r;
}
const sameRecipe=(a,b)=>ingredients.every(i=>a[i.id]===b[i.id]);
export function ensureCafe(state){
 const old=object(state.cafe)&&state.cafe.version===1?state.cafe:{};
 const seed=integer(old.seed,1,2147483646)?old.seed:1+Math.floor(Math.random()*2147483645);
 const c=old;c.version=1;c.seed=seed;
 c.range=['all','small'].includes(c.range)?c.range:'all';c.allIndex=count(c.allIndex,1000000000);
 c.discoveries=Array.isArray(c.discoveries)?[...new Set(c.discoveries.filter(id=>orchardFoods.some(a=>a.id===id)))]:[];
 const orchard=object(c.orchard)?c.orchard:{};
 c.orchard={selected:orchardFoods.some(a=>a.id===orchard.selected)?orchard.selected:null,steps:Object.fromEntries(orchardFoods.map(a=>[a.id,object(orchard.steps)?count(orchard.steps[a.id],2):0]))};
 const savedIndices=[object(c.current)?c.current.orderIndex:null,...(Array.isArray(c.history)?c.history.filter(object).map(r=>r.orderIndex):[])].filter(v=>integer(v,0,999999999));
 c.nextOrder=Math.max(integer(c.nextOrder,0,1000000000)?c.nextOrder:0,...savedIndices.map(i=>i+1));
 const initial=stockFor(seed);c.stock=Object.fromEntries(ingredients.map(a=>[a.id,object(c.stock)&&integer(c.stock[a.id],0,30)?c.stock[a.id]:initial[a.id]]));
 c.served=count(c.served,1000000000);
 // Freeze pre-expansion records using the original small-order formula first.
 for(const r of [c.current,...(Array.isArray(c.history)?c.history:[])])if(object(r)&&integer(r.orderIndex,0,999999999))r.params=cleanParams(r.params)||legacyParams(c,r.orderIndex);
 const seen=new Set();c.history=Array.isArray(c.history)?c.history.filter(r=>object(r)&&integer(r.orderIndex,0,999999999)&&r.orderIndex<c.nextOrder&&['served','skipped'].includes(r.status)&&!seen.has(r.orderIndex)&&seen.add(r.orderIndex)).slice(-24).map(r=>({...r,params:cleanParams(r.params),recipe:cleanRecipe(r.recipe,c),plateAttempts:cleanPlateAttempts(r.plateAttempts,c,r.orderIndex),total:cleanNumber(r.total),shortfall:cleanNumber(r.shortfall),repair:cleanRepair(r.repair,c,r.orderIndex),repairHistory:Array.isArray(r.repairHistory)?r.repairHistory.map(q=>cleanRepair(q,c,r.orderIndex)).filter(Boolean).slice(-24):[],stockBefore:Object.fromEntries(ingredients.map(a=>[a.id,object(r.stockBefore)?count(r.stockBefore[a.id]):0]))})):[];
 const x=c.current;
 if(object(x)&&(x.served===true||x.stage==='served')&&!integer(x.orderIndex,0,999999999)){c.nextOrder=Math.max(1,c.nextOrder);x.orderIndex=c.nextOrder-1;x.params=legacyParams(c,x.orderIndex);x.recovered=true;}
 if(!object(x)||!integer(x.orderIndex,0,999999999)||x.orderIndex>=c.nextOrder)c.current=null;
 else{
  x.recipe=cleanRecipe(x.recipe,c);x.plateAttempts=cleanPlateAttempts(x.plateAttempts,c,x.orderIndex);x.total=cleanNumber(x.total);x.shortfall=cleanNumber(x.shortfall);
  x.repair=cleanRepair(x.repair,c,x.orderIndex);x.repairHistory=Array.isArray(x.repairHistory)?x.repairHistory.map(r=>cleanRepair(r,c,x.orderIndex)).filter(Boolean).slice(-24):[];
  if(x.repair&&!sameRecipe(x.repair.recipe,x.recipe))x.repair.open=false;
  const closed=x.orderIndex!==c.nextOrder-1||c.history.some(r=>r.orderIndex===x.orderIndex);
  if(x.served===true||x.stage==='served'||closed){x.recovered=x.recovered===true||x.stage!=='served'||x.served!==true;x.stage='served';x.served=true;}
  else{
   x.served=false;
   const p=plate(c,x.recipe,x.orderIndex),o=orderFor(c);
   if(!['plate','total','stock'].includes(x.stage)||x.stage!=='plate'&&!p.valid){x.stage='plate';x.total=blankNumber();x.shortfall=blankNumber();x.recovered=true;}
   else if(x.stage==='stock'&&!(x.total.attempts.at(-1)===o.total||x.total.skipped)){x.stage='total';x.shortfall=blankNumber();x.recovered=true;}
  }
  if(x.stage!=='plate'&&x.repair)x.repair.open=false;
 }
 state.cafe=c;return c;
}
export function currentRecipe(c){
 if(!c.current)return [];
 const o=orderFor(c);
 return availableIngredients(c).filter(a=>c.current.recipe[a.id]>0).map(ingredient=>{const n=c.current.recipe[ingredient.id],required=n*o.guests,stock=c.stock[ingredient.id];return {ingredient,count:n,required,stock,missing:Math.max(0,required-stock)};});
}
export function cafeSummary(state){
 const c=state.cafe;if(!c?.current)return null;
 const order=orderFor(c),items=currentRecipe(c);return {order,items,missing:items.reduce((sum,a)=>sum+a.missing,0),...plate(c,c.current.recipe,order.index)};
}
export function setCafeRange(state,range){if(!['all','small'].includes(range))return false;ensureCafe(state).range=range;return true;}
export function nextGuest(state){
 const c=ensureCafe(state);if(c.current&&c.current.stage!=='served')return false;
 if(c.nextOrder>=1000000000)return false;
 const params=legacyParams(c,c.nextOrder);
 if(c.range==='all'){const cell=(c.seed%144+(c.allIndex%144)*37)%144;params.guests=1+Math.floor(cell/12);params.bites=1+cell%12;c.allIndex++;}
 c.current={orderIndex:c.nextOrder++,params,stage:'plate',recipe:cleanRecipe({},c),plateAttempts:[],total:blankNumber(),shortfall:blankNumber(),repair:null,repairHistory:[],served:false,recovered:false};return true;
}
export function adjustBite(state,id,delta){
 const c=ensureCafe(state),x=c.current;if(!x||x.stage!=='plate'||![1,-1].includes(delta)||!availableIngredients(c).some(a=>a.id===id))return false;
 const next=x.recipe[id]+delta;if(next<0||next>12||delta>0&&cafeSummary(state).count>=orderFor(c).bites)return false;
 x.recipe[id]=next;if(x.repair)x.repair.open=false;return true;
}
export function checkPlate(state){
 const c=ensureCafe(state),x=c.current;if(!x||x.stage!=='plate')return false;
 const p=plate(c,x.recipe,x.orderIndex);x.plateAttempts.push({recipe:{...x.recipe},...p});x.plateAttempts=x.plateAttempts.slice(-50);
 if(p.valid){x.stage='total';if(x.repair)x.repair.open=false;}
 else{if(x.repair){x.repair.open=false;x.repairHistory.push(copy(x.repair));x.repairHistory=x.repairHistory.slice(-24);}x.repair=repairFor(c,x.recipe,x.orderIndex);}
 return p.valid;
}
export function repairQuestion(state){
 const c=state.cafe,x=c?.current,r=x?.repair;if(!x||x.stage!=='plate'||!r?.open||!sameRecipe(r.recipe,x.recipe))return null;
 const choices=r.kind==='ingredient'?availableIngredients(c):null;
 return {...r,attempts:r.attempts.map(a=>({...a})),choices,prompt:r.kind==='ingredient'?'Which ingredient could add something '+r.missingProperty+'?':'How many bites do we need to '+(r.direction==='add'?'add to':'remove from')+' this plate?',explanation:r.kind==='ingredient'?'A bite with '+r.missingProperty+' can supply that missing wish. Check its other qualities and the number of bites when you revise your plate.':'The plate has '+plate(c,r.recipe,x.orderIndex).count+' bites and needs '+orderFor(c).bites+'. '+(r.direction==='add'?'Add':'Remove')+' '+r.needed+' bites, then check the wishes too.'};
}
export function answerRepair(state,value){
 const c=ensureCafe(state),q=repairQuestion(state);if(!q||(q.kind==='count'?!integer(value,0,12):!availableIngredients(c).some(a=>a.id===value)))return false;
 const correct=repairCorrect(q,value);c.current.repair.attempts.push({value,correct});c.current.repair.attempts=c.current.repair.attempts.slice(-50);return correct;
}
export function helpRepair(state){const c=ensureCafe(state);if(!repairQuestion(state))return false;c.current.repair.supported=true;return true;}
export function leaveRepair(state){const c=ensureCafe(state);if(!repairQuestion(state))return false;c.current.repair.open=false;return true;}
export function investigateFood(state,id){
 const c=ensureCafe(state);if(!orchardFoods.some(a=>a.id===id))return false;c.orchard.selected=id;
 c.orchard.steps[id]=Math.min(2,c.orchard.steps[id]+1);return true;
}
export function collectFood(state,id){
 const c=ensureCafe(state);if(!orchardFoods.some(a=>a.id===id)||c.orchard.steps[id]!==2||c.discoveries.includes(id))return false;
 c.discoveries.push(id);c.stock[id]=Math.max(c.stock[id],6);return true;
}
export function submitCafeNumber(state,value){
 const c=ensureCafe(state),x=c.current;if(!x||!['total','stock'].includes(x.stage)||!integer(value,0,999))return false;
 const total=x.stage==='total',d=total?x.total:x.shortfall,answer=total?orderFor(c).total:cafeSummary(state).missing;
 d.error='';d.attempts.push(value);d.attempts=d.attempts.slice(-50);if(value===answer&&total)x.stage='stock';return value===answer;
}
export function supportCafe(state){
 const c=ensureCafe(state),x=c.current;if(!x||!['total','stock'].includes(x.stage))return false;
 (x.stage==='total'?x.total:x.shortfall).supported=true;return true;
}
export function skipCafeStage(state){
 const c=ensureCafe(state),x=c.current;if(!x||!['total','stock'].includes(x.stage))return false;
 const total=x.stage==='total',d=total?x.total:x.shortfall;d.supported=true;d.skipped=true;if(total)x.stage='stock';return true;
}
function record(c,status){
 const x=c.current;c.history.push({orderIndex:x.orderIndex,params:copy(x.params),status,recipe:{...x.recipe},plateAttempts:copy(x.plateAttempts),total:{...x.total,attempts:[...x.total.attempts]},shortfall:{...x.shortfall,attempts:[...x.shortfall.attempts]},repair:x.repair?copy(x.repair):null,repairHistory:copy(x.repairHistory),stockBefore:{...c.stock}});c.history=c.history.slice(-24);
}
export function serveCafe(state){
 const c=ensureCafe(state),x=c.current;if(!x||x.stage!=='stock'||x.served)return false;
 const summary=cafeSummary(state);if(!x.shortfall.skipped&&x.shortfall.attempts.at(-1)!==summary.missing)return false;
 record(c,'served');for(const item of summary.items)c.stock[item.ingredient.id]=item.stock+item.missing-item.required;
 x.served=true;x.stage='served';c.served++;return true;
}
export function skipGuest(state){
 const c=ensureCafe(state);if(!c.current||c.current.stage==='served')return false;
 record(c,'skipped');c.current=null;return nextGuest(state);
}
export function restockCafe(state){
 const c=ensureCafe(state);if(c.current&&c.current.stage!=='served')return false;
 const available=new Set(availableIngredients(c).map(a=>a.id));c.stock=Object.fromEntries(ingredients.map(a=>[a.id,available.has(a.id)?12:c.stock[a.id]]));return true;
}
