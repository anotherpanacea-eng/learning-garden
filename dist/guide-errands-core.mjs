// Spec 600 · Guide errands. Pure reads only: no save root, no write, no familiarity or exposure change.
import {ERRAND_HUBS,ERRAND_ROOMS} from './guide-errands-content.mjs';
import {actTwoView} from './act-two-core.mjs';
import {actThreeView} from './act-three-core.mjs';
import {actFourView} from './act-four-core.mjs';

// The furthest act this explorer's story has reached: an act they started, or Act II inherited by arriving with the
// upstream letter (spec 249). An unreadable story reads as Act I, so only act-agnostic lines show.
export function actReached(state){
 const read=(view,key)=>{try{return view(state)?.[key]===true;}catch{return false;}};
 if(read(actFourView,'started'))return 4;
 if(read(actThreeView,'started'))return 3;
 if(read(actTwoView,'started')||read(actTwoView,'inheritedActII'))return 2;
 return 1;
}

// Exact route match only: a deeper route, a query or an unknown route shows nothing.
const routeOf=hash=>typeof hash==='string'&&/^#[a-z0-9/-]+$/.test(hash)?hash:null;

// One errand per destination: the first that fits this act. A later-act line is listed before its start-of-story
// counterpart for the same room, so an explorer further on sees the story version instead of both.
export function fittingErrands(list,act){
 const seen=new Set(),out=[];
 for(const item of list){if(item.minAct>act||seen.has(item.to))continue;seen.add(item.to);out.push(item);}
 return out;
}

export function errandView(hash,state){
 const route=routeOf(hash);
 if(!route)return null;
 const act=actReached(state);
 if(Object.hasOwn(ERRAND_ROOMS,route)){
  const items=fittingErrands(ERRAND_ROOMS[route].onward,act);
  return items.length?{kind:'room',route,act,items}:null;
 }
 if(Object.hasOwn(ERRAND_HUBS,route)){
  const items=fittingErrands(ERRAND_HUBS[route],act).slice(0,3);
  return items.length?{kind:'hub',route,act,items}:null;
 }
 return null;
}
