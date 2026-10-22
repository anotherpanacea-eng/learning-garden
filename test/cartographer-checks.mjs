import assert from 'node:assert/strict';
import {marks,directions} from '../dist/cartographer-content.mjs';
import {mapView,startMap,setMapPage,selectMapMark,placeMapMark,chooseMapEndpoint,selectMapRoute,appendMapMove,removeMapMove,clearMapRoute,addMapSupport,resumeMap,mapRoutes,checkMapRoutes,mapCheckMatches,walkMap,validMapPoint,validMapRound} from '../dist/cartographer-core.mjs';
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;},copy=x=>structuredClone(x);
const place=(s,id,x,y)=>{selectMapMark(s,id);return placeMapMark(s,x,y);};
const blank=()=>{const s={};startMap(s);return s;};
const setup=()=>{const s=blank();place(s,'post',0,0);place(s,'cafe',2,2);return s;};
const move=(s,side,commands)=>{selectMapRoute(s,side);for(const d of commands)eq(appendMapMove(s,d),'changed','valid adjacent move appended');};
{
 const s={},before=copy(s);eq(mapView(s).status,'missing');eq(s,before,'view stays pure');eq(appendMapMove(s,'e'),'missing');eq(s,before,'a refused route command does not create a map');
 for(const p of [{x:0,y:0},{x:5,y:5}])ok(validMapPoint(p));for(const p of [{x:-1,y:0},{x:6,y:1},{x:0.5,y:0},{x:0},null])ok(!validMapPoint(p));
}
// Independent unit-step oracle covers all grid intersections and four cardinal boundaries.
const deltas={n:[0,1],e:[1,0],s:[0,-1],w:[-1,0]};
for(let x=0;x<=5;x++)for(let y=0;y<=5;y++)for(const [d,[dx,dy]]of Object.entries(deltas)){
 const nx=x+dx,ny=y+dy,inside=nx>=0&&nx<=5&&ny>=0&&ny<=5,result=walkMap({x,y},[d],{x:nx,y:ny});
 eq(result.steps,inside?1:0,'each valid segment is one interval');eq(result.distance,result.steps,'declared one model metre per interval');eq(result.blocked,inside?null:1,'boundary stops before forbidden step');eq(result.arrived,inside,'only a completed path arrives');eq(result.points,inside?[{x,y},{x:nx,y:ny}]:[{x,y}],'points follow independent direction oracle');
 const s=blank();place(s,'post',x,y);place(s,'cafe',x===0?1:0,y===0?1:0);const before=copy(s);eq(appendMapMove(s,d),inside?'changed':'boundary');if(!inside)eq(s,before,'boundary refusal leaves draft exact');
}
// Every ordered distinct endpoint pair has two in-bounds monotone orders <=10 intervals.
for(let x=0;x<=5;x++)for(let y=0;y<=5;y++)for(let tx=0;tx<=5;tx++)for(let ty=0;ty<=5;ty++){
 const horizontal=Array(Math.abs(tx-x)).fill(tx>=x?'e':'w'),vertical=Array(Math.abs(ty-y)).fill(ty>=y?'n':'s');
 for(const route of [[...horizontal,...vertical],[...vertical,...horizontal]]){const r=walkMap({x,y},route,{x:tx,y:ty});eq(r.distance,Math.abs(tx-x)+Math.abs(ty-y),'interval distance from independent sum');eq(r.arrived,true,'monotone route reaches target');eq(r.points.at(-1),{x:tx,y:ty});}
}
{
 const s=setup(),r=mapView(s).current;move(s,'A',['e','e','n','n']);move(s,'B',['n','n','e','e']);const c=checkMapRoutes(s);ok(c.bothArrived);ok(c.different);eq(c.relation,'equal','different paths can have equal lengths');ok(mapCheckMatches(r));
 const old=copy(c);selectMapRoute(s,'B');appendMapMove(s,'s');appendMapMove(s,'n');const next=checkMapRoutes(s);ok(next.bothArrived);eq(next.b.distance,6);eq(next.relation,'shorter','A shorter than B despite same final point');eq(c,old,'new check does not alter old one');
 selectMapRoute(s,'B');removeMapMove(s,0);ok(!mapCheckMatches(r),'edit invalidates current-check label, not outcome');eq(c,old);clearMapRoute(s);eq(r.b,[]);eq(r.checks.length,2,'clear keeps recorded checks');
}
{
 const s=blank();place(s,'post',0,0);place(s,'cafe',3,0);move(s,'A',['e','e','e']);move(s,'B',['e','e','e']);const r=mapView(s).current,old=copy(checkMapRoutes(s));ok(old.bothArrived);ok(!old.different,'identical valid routes remain valid');
 place(s,'cafe',5,0);place(s,'post',3,0);eq(r.a,['e','e','e'],'moving endpoints keeps all commands');const run=mapRoutes(r).a;eq(run.points,[{x:3,y:0},{x:4,y:0},{x:5,y:0}]);eq(run.blocked,3);eq(run.distance,2);eq(run.arrived,false,'blocked prefix on target is not arrival');eq(r.checks[0],old,'old geometry/result frozen after moving both ends');ok(!mapCheckMatches(r));
 selectMapRoute(s,'A');const before=copy(s);eq(appendMapMove(s,'w'),'blocked');eq(s,before);removeMapMove(s,2);ok(mapRoutes(r).a.arrived,'removal repairs blocked path');
 selectMapRoute(s,'A');clearMapRoute(s);eq(mapRoutes(r).a.distance,0);ok(!mapRoutes(r).a.arrived,'empty route cannot reach distinct mark');
}
{
 const s=setup(),r=mapView(s).current;selectMapMark(s,'bridge');const before=copy(s);eq(placeMapMark(s,2,2),'occupied');eq(s,before,'occupied point retains both positions');eq(placeMapMark(s,4,2),'changed');selectMapMark(s,'garden');placeMapMark(s,2,4);eq(r.places.bridge,{x:4,y:2});eq(r.places.garden,{x:2,y:4},'swapped coordinates identify distinct points');
 ok(chooseMapEndpoint(s,'to','garden'));eq(r.a,[]);eq(chooseMapEndpoint(s,'from','garden'),false,'same landmark cannot be both ends');
}
{
 const s=setup(),r=mapView(s).current;move(s,'A',Array.from({length:12},(_,i)=>i%2?'w':'e'));const before=copy(s);eq(appendMapMove(s,'e'),'limit');eq(s,before,'thirteenth command refused without editing');eq(mapRoutes(r).a.distance,12,'retraced edge counts on every traversal');eq(mapRoutes(r).a.points.at(-1),{x:0,y:0});
 for(let i=0;i<10;i++)checkMapRoutes(s);eq(r.checks.length,8,'bounded check history');ok(validMapRound(r));
}
{
 const s=blank(),r=mapView(s).current;eq(mapRoutes(r),null);eq(checkMapRoutes(s),null,'missing marks cannot fabricate checked route');place(s,'post',0,0);eq(mapRoutes(r),null);place(s,'cafe',0,1);move(s,'A',['n']);
 for(const code of ['help','audio','together','segments','help'])ok(addMapSupport(s,code));eq(r.support,['help','audio','together','segments'],'support idempotent');for(const page of ['map','route','compare'])ok(setMapPage(s,page));eq(setMapPage(s,'bad'),false);
 const c=checkMapRoutes(s);c.a.steps=11;c.a.distance=9;c.a.arrived=false;c.a.blocked=12;c.relation='longer';c.bothArrived=true;c.oldWords='Kept wording';const before=copy(s);ok(validMapRound(r),'valid imported output ranges accepted without recomputing truth');ok(mapCheckMatches(r),'input label check does not regrade output');eq(mapView(s).current,r);eq(s,before,'read path exact despite contradictory old outcome');
}
{
 const s=setup(),r=mapView(s).current;r.extra={keep:true};s.cartographer.extra='unknown';s.cartographer.rounds.push({id:2,payload:'<b>unreadable original</b>'});s.cartographer.current=2;const raw=copy(s.cartographer.rounds[1]);eq(mapView(s).current,r,'bad current fallback to good sibling');place(s,'garden',1,1);eq(s.cartographer.rounds[1],raw);eq(r.extra,{keep:true});const newer=startMap(s);eq(newer.id,3,'raw id not recycled');eq(s.cartographer.extra,'unknown');
 for(let i=0;i<13;i++)startMap(s);eq(mapView(s).rounds.length,12);eq(mapView(s).earlier,[raw],'raw sibling not evicted by history bound');ok(!resumeMap(s,r.id),'evicted readable round not resumed');ok(resumeMap(s,mapView(s).rounds.at(-1).id));
 const before=copy(s);s.cartographer.rounds.push({id:Number.MAX_SAFE_INTEGER+1});const exhausted=copy(s);eq(startMap(s),null);eq(s,exhausted,'unsafe raw ids refuse new round without mutation');ok(setMapPage(s,'route'),'existing round remains playable at id exhaustion');
}
{
 const s={cartographer:{version:1,page:'route',mark:'garden',side:'B',current:9,nextId:10,rounds:[{id:9,old:'unreadable'}]}},before=copy(s);
 eq(addMapSupport(s,'help'),false,'help before a readable map does not silently create one');eq(s,before,'pre-map help preserves stored page and raw work');
 eq(placeMapMark(s,2,4),'changed');eq(mapView(s).current.places.garden,{x:2,y:4},'first point creates the landmark the displayed prompt named');eq(mapView(s).current.places.post,null,'first point does not substitute Post Office');eq(s.cartographer.mark,'garden');
}
for(const bad of [null,'opaque',{version:7,rounds:[]},{version:1,page:'map',mark:'post',side:'A',current:1,nextId:0,rounds:[]}]){
 const s={cartographer:copy(bad)},before=copy(s);eq(mapView(s).status,'unavailable');eq(startMap(s),null);eq(setMapPage(s,'map'),false);eq(selectMapMark(s,'post'),false);eq(checkMapRoutes(s),null);eq(s,before,'future/invalid envelopes never mutate');
}
console.log(`Cartographer core: ${checks} assertions passed.`);
