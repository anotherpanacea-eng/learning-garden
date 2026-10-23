import {gatheringCases,gatheringCase} from './gathering-budget-content.mjs';

export {gatheringCases,gatheringCase};
export const emptyBasket=()=>[0,0,0,0];
export function basketStatus(c,counts){
 if(!c||!Array.isArray(counts)||counts.length!==c.items.length||counts.some((n,i)=>!Number.isInteger(n)||n<0||n>c.items[i].stock))return null;
 const cost=counts.reduce((sum,n,i)=>sum+n*c.items[i].price,0);
 const have=c.needs.map((_,k)=>counts.reduce((sum,n,i)=>sum+n*c.items[i].units[k],0));
 const budgetFit=cost<=c.limit,requestFit=have.every((n,k)=>n>=c.needs[k].minimum);
 return {cost,have,budgetFit,requestFit,working:budgetFit&&requestFit,left:budgetFit?c.limit-cost:null,over:budgetFit?null:cost-c.limit};
}
export function adjustBasket(c,counts,itemId,delta){
 const item=c?.items.find(x=>x.id===itemId),index=c?.items.indexOf(item);
 if(!item||![1,-1].includes(delta)||!basketStatus(c,counts))return null;
 const next=[...counts];next[index]+=delta;
 return basketStatus(c,next)?next:null;
}
// A cost idea is optional and never participates in the basket's two fit checks.
export function costIdea(raw,mode='number'){
 if(mode==='blank'||mode==='unsure')return {valid:true,value:null};
 if(mode!=='number'||typeof raw!=='string'||raw.length>2)return {valid:false,value:null};
 if(raw==='')return {valid:true,value:null};
 if(!/^[0-9]{1,2}$/.test(raw))return {valid:false,value:null};
 return {valid:true,value:Number(raw)};
}
export function checkBasket(c,counts,raw='',mode='blank'){
 const status=basketStatus(c,counts),idea=costIdea(raw,mode);
 if(!status||!idea.valid)return null;
 return {...status,idea:idea.value,ideaFit:idea.value===null?null:idea.value===status.cost};
}
