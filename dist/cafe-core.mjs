import {ingredients,guests,wishes} from './cafe-content.mjs';
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const count=(x,max=30)=>integer(x,0,max)?x:0;
const blankNumber=()=>({input:'',error:'',attempts:[],supported:false,skipped:false,steps:0,revealed:false});
function cleanNumber(x){
 if(!object(x))return blankNumber();
 return {input:typeof x.input==='string'?x.input.slice(0,40):'',error:typeof x.error==='string'?x.error.slice(0,200):'',attempts:Array.isArray(x.attempts)?x.attempts.filter(v=>integer(v,0,999)).slice(-50):[],supported:x.supported===true||x.revealed===true||count(x.steps)>0||x.skipped===true,skipped:x.skipped===true,steps:count(x.steps,12),revealed:x.revealed===true};
}
const cleanRecipe=x=>Object.fromEntries(ingredients.map(a=>[a.id,object(x)?count(x[a.id],3):0]));
const stockFor=seed=>Object.fromEntries(ingredients.map((a,i)=>[a.id,2+(seed+i*3)%8]));
export function orderFor(c,index=c.current?.orderIndex??c.nextOrder){
 const seed=c.seed;
 const party=2+(Math.floor(seed/96)+index)%3,bites=2+(Math.floor(seed/288)+Math.floor(index/3))%2;
 return {index,guest:guests[(seed%guests.length+index)%guests.length],wanted:wishes[(Math.floor(seed/8)%wishes.length+index*5)%wishes.length],guests:party,bites,total:party*bites};
}
function plate(c,recipe,index){
 const order=orderFor(c,index),properties=[...new Set(ingredients.filter(a=>recipe[a.id]>0).flatMap(a=>a.properties))],n=Object.values(recipe).reduce((a,b)=>a+b,0),missingProperties=order.wanted.filter(p=>!properties.includes(p));
 return {count:n,properties,missingProperties,valid:n===order.bites&&!missingProperties.length};
}
function cleanPlateAttempts(x,c,index){return Array.isArray(x)?x.filter(a=>object(a)&&object(a.recipe)).slice(-50).map(a=>{const recipe=cleanRecipe(a.recipe);return {recipe,...plate(c,recipe,index)};}):[];}
export function ensureCafe(state){
 const old=object(state.cafe)&&state.cafe.version===1?state.cafe:{};
 const seed=integer(old.seed,1,2147483646)?old.seed:1+Math.floor(Math.random()*2147483645);
 const c=old;c.version=1;c.seed=seed;
 const savedIndices=[object(c.current)?c.current.orderIndex:null,...(Array.isArray(c.history)?c.history.filter(object).map(r=>r.orderIndex):[])].filter(v=>integer(v,0,999999999));
 c.nextOrder=Math.max(integer(c.nextOrder,0,1000000000)?c.nextOrder:0,...savedIndices.map(i=>i+1));
 const initial=stockFor(seed);c.stock=Object.fromEntries(ingredients.map(a=>[a.id,object(c.stock)&&integer(c.stock[a.id],0,30)?c.stock[a.id]:initial[a.id]]));
 c.served=count(c.served,1000000000);
 const seen=new Set();c.history=Array.isArray(c.history)?c.history.filter(r=>object(r)&&integer(r.orderIndex,0,999999999)&&r.orderIndex<c.nextOrder&&['served','skipped'].includes(r.status)&&!seen.has(r.orderIndex)&&seen.add(r.orderIndex)).slice(-24).map(r=>({orderIndex:r.orderIndex,status:r.status,recipe:cleanRecipe(r.recipe),plateAttempts:cleanPlateAttempts(r.plateAttempts,c,r.orderIndex),total:cleanNumber(r.total),shortfall:cleanNumber(r.shortfall),stockBefore:Object.fromEntries(ingredients.map(a=>[a.id,object(r.stockBefore)?count(r.stockBefore[a.id]):0]))})):[];
 const x=c.current;
 if(object(x)&&(x.served===true||x.stage==='served')&&!integer(x.orderIndex,0,999999999)){c.nextOrder=Math.max(1,c.nextOrder);x.orderIndex=c.nextOrder-1;x.recovered=true;}
 if(!object(x)||!integer(x.orderIndex,0,999999999)||x.orderIndex>=c.nextOrder)c.current=null;
 else{
  x.recipe=cleanRecipe(x.recipe);x.plateAttempts=cleanPlateAttempts(x.plateAttempts,c,x.orderIndex);x.total=cleanNumber(x.total);x.shortfall=cleanNumber(x.shortfall);
  const closed=x.orderIndex!==c.nextOrder-1||c.history.some(r=>r.orderIndex===x.orderIndex);
  if(x.served===true||x.stage==='served'||closed){x.recovered=x.recovered===true||x.stage!=='served'||x.served!==true;x.stage='served';x.served=true;}
  else{
   x.served=false;
   const p=plate(c,x.recipe,x.orderIndex),o=orderFor(c);
   if(!['plate','total','stock'].includes(x.stage)||x.stage!=='plate'&&!p.valid){x.stage='plate';x.total=blankNumber();x.shortfall=blankNumber();x.recovered=true;}
   else if(x.stage==='stock'&&!(x.total.attempts.at(-1)===o.total||x.total.skipped)){x.stage='total';x.shortfall=blankNumber();x.recovered=true;}
  }
 }
 state.cafe=c;return c;
}
export function currentRecipe(c){
 if(!c.current)return [];
 const o=orderFor(c);
 return ingredients.filter(a=>c.current.recipe[a.id]>0).map(ingredient=>{const n=c.current.recipe[ingredient.id],required=n*o.guests,stock=c.stock[ingredient.id];return {ingredient,count:n,required,stock,missing:Math.max(0,required-stock)};});
}
export function cafeSummary(state){
 const c=state.cafe;if(!c?.current)return null;
 const order=orderFor(c),items=currentRecipe(c);return {order,items,missing:items.reduce((sum,a)=>sum+a.missing,0),...plate(c,c.current.recipe,order.index)};
}
export function nextGuest(state){
 const c=ensureCafe(state);if(c.current&&c.current.stage!=='served')return false;
 if(c.nextOrder>=1000000000)return false;
 c.current={orderIndex:c.nextOrder++,stage:'plate',recipe:cleanRecipe({}),plateAttempts:[],total:blankNumber(),shortfall:blankNumber(),served:false,recovered:false};return true;
}
export function adjustBite(state,id,delta){
 const c=ensureCafe(state),x=c.current;if(!x||x.stage!=='plate'||![1,-1].includes(delta)||!ingredients.some(a=>a.id===id))return false;
 const next=x.recipe[id]+delta;if(next<0||next>3||delta>0&&cafeSummary(state).count>=orderFor(c).bites)return false;
 x.recipe[id]=next;return true;
}
export function checkPlate(state){
 const c=ensureCafe(state),x=c.current;if(!x||x.stage!=='plate')return false;
 const p=plate(c,x.recipe,x.orderIndex);x.plateAttempts.push({recipe:{...x.recipe},...p});x.plateAttempts=x.plateAttempts.slice(-50);
 if(p.valid)x.stage='total';return p.valid;
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
 const x=c.current;c.history.push({orderIndex:x.orderIndex,status,recipe:{...x.recipe},plateAttempts:JSON.parse(JSON.stringify(x.plateAttempts)),total:{...x.total,attempts:[...x.total.attempts]},shortfall:{...x.shortfall,attempts:[...x.shortfall.attempts]},stockBefore:{...c.stock}});c.history=c.history.slice(-24);
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
 c.stock=Object.fromEntries(ingredients.map(a=>[a.id,12]));return true;
}
