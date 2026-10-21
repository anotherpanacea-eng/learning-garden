// Original, bounded ribbon-supply questions. No learner record or network is used.
const integer=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
export function rivalParameters(kind,a,b){
 return kind==='multiply'?integer(a,1,12)&&integer(b,1,12):kind==='add'?integer(a,1,20)&&integer(b,1,20):kind==='subtract'&&integer(a,2,20)&&integer(b,1,a-1);
}
function example(kind,a,b,scene){
 const answer=kind==='add'?a+b:kind==='subtract'?a-b:a*b;
 const location=['at the ribbon gate','beside the parcel shelf','at the wrapping table'][scene];
 const prompt=kind==='add'?`Bramble has ${a} blue ${a===1?'ribbon':'ribbons'} and ${b} gold ${b===1?'ribbon':'ribbons'} ${location}. How many ribbons are there altogether?`:kind==='subtract'?`Bramble has ${a} ribbons ${location}. Reserve ${b} for a bow. How many ribbons remain?`:`Bramble has ${a} ${a===1?'bundle':'bundles'} ${location}, with ${b} ${b===1?'ribbon':'ribbons'} in each bundle. How many ribbons are there altogether?`;
 const explanation=kind==='add'?`Bring the colors together: ${a} + ${b} = ${answer} ${answer===1?'ribbon':'ribbons'}.`:kind==='subtract'?`Set aside ${b} of the ${a} ribbons: ${a} − ${b} = ${answer} ${answer===1?'ribbon':'ribbons'}.`:`There ${a===1?'is':'are'} ${a} equal ${a===1?'bundle':'bundles'} of ${b} ${b===1?'ribbon':'ribbons'}: ${a} × ${b} = ${answer} ${answer===1?'ribbon':'ribbons'}.`;
 return {kind,a,b,scene,answer,unit:'ribbons',prompt,explanation,pictures:{kind,groups:kind==='add'?[{label:'Blue ribbons',count:a},{label:'Gold ribbons',count:b}]:kind==='subtract'?[{label:'Ready ribbons',count:a,reserved:b}]:Array.from({length:a},(_,i)=>({label:`Bundle ${i+1}`,count:b}))}};
}
export function generateRivalTask(kind,a,b,scene=0){
 if(!rivalParameters(kind,a,b)||!integer(scene,0,2))return null;
 let x,y;
 if(kind==='multiply'){x=a>1?Math.max(1,Math.floor(a/2)):1;y=b>1?Math.max(1,Math.floor(b/2)):a===1?2:1;}
 else if(kind==='add'){x=a>1?Math.max(1,Math.floor(a/2)):1;y=b>1?Math.max(1,Math.floor(b/2)):a===1?2:1;}
 else {x=a>2?Math.max(2,Math.floor(a/2)):3;y=Math.min(b,x-1);if(x-y===a-b&&y<x-1)y++;}
 const practice=example(kind,x,y,(scene+1)%3);
 practice.prompt=`A different worked example. ${practice.prompt}`;
 return {...example(kind,a,b,scene),practice};
}
