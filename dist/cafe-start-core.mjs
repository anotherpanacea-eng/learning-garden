// Optional starting preferences never reinterpret saved choices or task evidence.
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export const cafeStartBands=Object.freeze([
 {id:'sprout',label:'Sprout: 2–4 guests, 2–3 bites each',range:'small'},
 {id:'seedling',label:'Seedling: all facts, 1–12',range:'all'},
 {id:'sapling',label:'Sapling: same full range, 1–12',range:'all'}
]);
export function cafeStartingBand(state){return object(state?.garden)&&object(state.garden.start)?cafeStartBands.find(x=>x.id===state.garden.start.math)||null:null;}
export function followsCafeStart(state){return object(state?.garden)&&state.garden.cafeStart==='follow'&&cafeStartingBand(state)!==null;}
export function effectiveCafeRange(state){return followsCafeStart(state)?cafeStartingBand(state).range:state?.cafe?.range==='small'?'small':'all';}
export function applyCafeStart(state,band){
 if(!cafeStartBands.some(x=>x.id===band)||!object(state?.garden)||Object.hasOwn(state.garden,'start')&&!object(state.garden.start))return false;
 state.garden.start={...(state.garden.start||{}),math:band};state.garden.cafeStart='follow';return true;
}
export function chooseCafeLocal(state){if(object(state?.garden))state.garden.cafeStart='local';}
