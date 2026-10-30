// Pure model/source layer. Notebook mutations and UI are implemented separately under spec316.
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const text=(x,max)=>typeof x==='string'&&x.length>0&&x.length<=max;
const family=x=>['apples','reed','nursery'].includes(x);
export function validSeedModel(s){
 if(!object(s)||!family(s.family)||!int(s.size,1,12))return false;
 if(s.family==='nursery')return s.basketRate===null&&s.reedRate===null&&s.stock===null&&s.givenSide==='seedlings'&&Array.isArray(s.parts)&&s.parts.length===2&&s.parts.every(x=>int(x,1,12))&&int(s.total,1,200)&&s.total===(s.parts[0]+s.parts[1])*s.size;
 if(s.parts!==null||s.total!==null||!int(s.basketRate,1,12)||!int(s.reedRate,1,12)||!int(s.stock,1,200)||s.givenSide!==(s.family==='apples'?'baskets':'bundles'))return false;
 const cost=s.family==='apples'?s.basketRate:s.reedRate;
 return Math.floor(s.stock/cost)===s.size;
}
export function validSeedSource(s){
 return validSeedModel(s)&&s.format===1&&text(s.id,80)&&/^[a-z][a-z0-9-]*$/.test(s.id)&&['title','prompt','notice','rule','hint'].every(k=>text(s[k],3200))&&
  validSeedModel(s.example)&&s.example.family===s.family&&s.example.size!==s.size&&Array.isArray(s.example.steps)&&s.example.steps.length>=1&&s.example.steps.length<=6&&s.example.steps.every(x=>text(x,1600))&&
  object(s.feedback)&&['match','few','many'].every(k=>text(s.feedback[k],3200));
}
export function seedFingerprint(s){
 return validSeedModel(s)?JSON.stringify([s.format??1,s.family,s.basketRate,s.reedRate,s.parts,s.givenSide,s.stock,s.total]):null;
}
export function seedModel(s,draft){
 if(!validSeedModel(s)||!object(draft))return null;
 if(s.family==='nursery'){
  const value=draft.partValue;if(!int(value,0,12))return null;
  const shares=s.parts.map(n=>n*value),used=shares[0]+shares[1],difference=s.total-used;
  return {family:s.family,value,parts:[...s.parts],shares,used,stock:s.total,left:Math.max(0,difference),shortage:Math.max(0,-difference),fits:difference===0,relation:difference===0?'match':difference>0?'few':'many'};
 }
 const groups=draft.groups;if(!int(groups,0,12))return null;
 const apples=s.family==='apples',spend=apples?s.basketRate:s.reedRate,gain=apples?s.reedRate:s.basketRate,used=groups*spend,difference=s.stock-used,fits=groups===s.size;
 return {family:s.family,groups,spend,gain,used,received:groups*gain,stock:s.stock,sendUnit:apples?'baskets':'bundles',receiveUnit:apples?'bundles':'baskets',left:Math.max(0,difference),shortage:Math.max(0,-difference),fits,relation:fits?'match':difference>=spend?'few':'many'};
}
