// Spec 600 · guide errands. Pure checks: act gating against real story saves, exact-route lookup,
// spoiler boundaries, link targets and the no-write contract. Not a learning or coverage claim.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {ERRAND_HUBS,ERRAND_ROOMS,ERRAND_UI} from '../dist/guide-errands-content.mjs';
import {actReached,errandView} from '../dist/guide-errands-core.mjs';
import {guideErrandsHTML} from '../dist/guide-errands-ui.mjs';
import {rooms} from '../dist/room-registry.mjs';
import {guides} from '../dist/companions.mjs';
import {freshState} from '../dist/core.mjs';
import {canExport,pageOne} from './act-two-checks.mjs';
import {actThreeHosts} from './act-three-checks.mjs';
import {actFourHosts} from './act-four-checks.mjs';
import {startActTwo} from '../dist/act-two-core.mjs';
import {startActThree} from '../dist/act-three-core.mjs';
import {startActFour} from '../dist/act-four-core.mjs';

const options={canExport};
// Names and events that belong to a later act; an item that mentions one must not show before that act.
const LATER=[
 {act:2,words:[/birthday/i,/grandmother/i,/\bstay\b.*Dot|Dot.*\bstay\b/i]},
 {act:3,words:[/Nuria/,/Vadoalto/,/L[ée]on/,/Les Saules/,/upstream/i,/carrizo/i,/third page/i]},
 {act:4,words:[/Gazette/,/wet corner/i,/low corner/i,/reeds (are|coming|growing)/i,/fourth page/i,/two stories/i,/low fields/i]},
];
// Independent of the core: one errand per destination, the first that fits the act.
const expected=(list,act)=>{const out=[];for(const i of list)if(i.minAct<=act&&!out.some(o=>o.to===i.to))out.push(i);return out;};
const deepFreeze=x=>{if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.freeze(x);for(const v of Object.values(x))deepFreeze(v);}return x;};

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const roomRoutes=new Set(rooms.map(r=>r.route)),places=new Set(rooms.flatMap(r=>r.places));

 // Content shape: every link is a real room, never the page it sits on, and Act I always has something to offer.
 const items=[];
 for(const [route,room] of Object.entries(ERRAND_ROOMS)){
  ok(roomRoutes.has(route),`${route} is a registered room`);
  for(const act of [1,2,3,4]){const n=expected(room.onward,act).length;ok(n>=2&&n<=3,`${route} shows two or three onward errands at Act ${act}`);}
  ok(expected(room.onward,1).length>=2,`${route} offers two different destinations before any act is started`);
  for(const i of room.onward){items.push([route,i]);ok(i.to!==route,`${route} never sends the explorer back to itself`);}
 }
 for(const [hub,list] of Object.entries(ERRAND_HUBS)){
  ok(places.has(hub),`${hub} is a registered place page`);
  ok(expected(list,1).length>=3,`${hub} has three different destinations before any act is started`);
  for(const i of list){items.push([hub,i]);ok(rooms.some(r=>r.route===i.to&&r.places.includes(hub)),`${hub} errand ${i.id} links a room on that place page`);}
 }
 const ids=new Set();
 for(const [where,i] of items){
  ok(['id','to','label','line','minAct'].every(k=>Object.hasOwn(i,k))&&Object.keys(i).length===5,`${where} ${i.id} has exactly the five fields`);
  ok([1,2,3,4].includes(i.minAct),`${where} ${i.id} names an act from 1 to 4`);
  ok(roomRoutes.has(i.to),`${where} ${i.id} links a registered room`);
  ok(!ids.has(i.id),`${i.id} is unique`);ids.add(i.id);
  ok(i.line.includes('{guide}')||/^[A-Z]/.test(i.line),`${i.id} line is a sentence`);
  for(const {act,words} of LATER)for(const w of words)if(w.test(i.line)||w.test(i.label))ok(i.minAct>=act,`${i.id} mentions ${w} so waits for Act ${act}`);
  ok(!/supplied|provenance|recorded as support|exportable/i.test(i.line+i.label),`${i.id} uses child-facing words`);
 }
 for(const [where,list] of [...Object.entries(ERRAND_ROOMS).map(([r,v])=>[r,v.onward]),...Object.entries(ERRAND_HUBS)])
  list.forEach((x,k)=>list.slice(0,k).forEach(y=>{if(y.to===x.to)ok(y.minAct>x.minAct,`${where}: ${y.id} is a later-act variant listed before ${x.id}`);}));
 // Hubs list later-act errands first, so an explorer further on sees them before the act-agnostic ones.
 for(const [hub,list] of Object.entries(ERRAND_HUBS))ok(list.every((x,k)=>k===0||list[k-1].minAct>=x.minAct),`${hub} lists later acts first`);

 // Act gating from real story saves, built through each act's own start action.
 const fresh=freshState();
 eq(actReached(fresh),1,'a fresh notebook reads as Act I');
 eq(actReached({}),1,'a missing story reads as Act I');
 eq(actReached({story:'broken'}),1,'an unreadable story reads as Act I');
 eq(actReached(null),1,'no state reads as Act I');
 const two=pageOne();ok(startActTwo(two,options));eq(actReached(two),2,'Act II started');
 const three=actThreeHosts();ok(startActThree(three,options));eq(actReached(three),3,'Act III started');
 const four=actFourHosts();ok(startActFour(four,options));eq(actReached(four),4,'Act IV started');

 // Exact-route lookup only.
 for(const bad of ['#home','#notes','#cafe/groups/x','#cafe/groups?x','','not-a-route',null,42,'#CAFE/groups'])eq(errandView(bad,fresh),null,`no strip for ${String(bad)}`);
 for(const [route,room] of Object.entries(ERRAND_ROOMS)){
  for(const [state,act] of [[fresh,1],[two,2],[three,3],[four,4]]){
   const v=errandView(route,state);
   eq(v,{kind:'room',route,act,items:expected(room.onward,act)},`${route} at Act ${act}`);
   eq(new Set(v.items.map(i=>i.to)).size,v.items.length,`${route} at Act ${act} shows each destination once`);
  }
 }
 for(const [hub,list] of Object.entries(ERRAND_HUBS)){
  for(const [state,act] of [[fresh,1],[two,2],[three,3],[four,4]]){
   eq(errandView(hub,state)?.items,expected(list,act).slice(0,3),`${hub} at Act ${act} shows the first three destinations that fit`);
  }
 }

 // Rendering: no write, guide name filled in, every string escaped, unknown guide falls back to the first.
 for(const state of [fresh,two,three,four]){
  const before=structuredClone(state);deepFreeze(state);
  for(const route of [...Object.keys(ERRAND_ROOMS),...Object.keys(ERRAND_HUBS)]){const html=guideErrandsHTML(errandView(route,state),state);ok(html.length>0&&!html.includes('{guide}'),`${route} renders with a guide name`);}
  eq(state,before,'rendering every strip leaves the notebook unchanged');
 }
 for(const g of guides){const html=guideErrandsHTML(errandView(Object.keys(ERRAND_ROOMS)[0],fresh),{garden:{guide:g.id}});ok(html.includes(g.name),`${g.id} is named`);}
 ok(guideErrandsHTML(errandView(Object.keys(ERRAND_ROOMS)[0],fresh),{garden:{guide:'nobody'}}).includes(guides[0].name),'an unknown guide falls back to the first guide');
 eq(guideErrandsHTML(null,fresh),'','no view renders nothing');
 const hostile={kind:'room',route:'#x',act:1,items:[{id:'h',to:'#cafe/groups"><img src=x onerror=alert(1)>',label:'<b>go</b>',line:'<script>x</script> {guide}',minAct:1}]};
 const html=guideErrandsHTML(hostile,fresh);
 ok(!html.includes('<script>')&&!html.includes('<b>')&&!html.includes('"><img'),'hostile strings are escaped');
 ok(['region','room','hub'].every(k=>Object.hasOwn(ERRAND_UI,k)),'ui copy has region, room and hub');
 return n;
}
if(import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`guide-errands checks: ${runChecks()} passed`);
