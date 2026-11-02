// Spec 358 source checks: room registry, the new-for-you rules, the shelf and the Workshop groups.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rooms} from '../dist/room-registry.mjs';
import {localDay,addDays,validRooms,touchRooms,newRooms,newShelf,newRoomsPage,placeNames,roomsKey,readRooms,setActiveRooms,mergeRooms} from '../dist/new-for-you.mjs';

let checks=0;
const equal=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
const ok=(a,label)=>{assert.ok(a,label);checks++;};
const day=/^\d{4}-\d{2}-\d{2}$/;

// Registry shape.
equal(new Set(rooms.map(r=>r.route)).size,rooms.length,'routes are unique');
for(const r of rooms){
 ok(/^#[a-z]+(\/[a-z0-9-]+)+$/.test(r.route),`${r.route}: a room route`);
 ok(typeof r.title==='string'&&r.title.trim()===r.title&&r.title.length>0,`${r.route}: a title`);
 ok(day.test(r.added)&&r.added>='2026-10-18'&&r.added<=localDay(),`${r.route}: a literal shipped date`);
 ok(r.places.length>0&&r.places.every(p=>placeNames[p]),`${r.route}: every place has a name`);
 ok(Object.isFrozen(r)&&Object.isFrozen(r.places),`${r.route}: frozen`);
}
ok(Object.isFrozen(rooms),'registry frozen');

// Dates.
equal(addDays('2026-11-01',-3),'2026-10-29','days back across a month');
equal(addDays('2026-02-28',1),'2026-03-01','days forward across February');
equal(localDay(new Date(2026,0,5,23,59)),'2026-01-05','local calendar date');

// First use, opening and the explorer-local record. touchRooms never mutates; the notebook is never involved.
const E='2026-10-20T12:00:00.000Z',monday='2026-10-27',tuesday='2026-10-28',wednesday='2026-10-29';
let a=touchRooms(null,'#home',E,monday);
equal(a,{explorer:E,opened:{},since:addDays(monday,-3),lastDay:monday},'first use starts three days back');
equal(touchRooms(a,'#home',E,monday),a,'a second render the same day changes nothing');
const room=rooms.find(r=>r.added>=addDays(monday,-3)&&r.added<=monday)||rooms[0];
const opened=touchRooms(a,room.route,E,monday);
equal(opened.opened[room.route],monday,'opened today');
equal(a.opened,{},'the earlier record is not mutated');
equal(touchRooms(opened,room.route,E,tuesday).opened[room.route],monday,'an opened date is never moved');
ok(!newRooms(opened,monday).some(r=>r.route===room.route),'an opened room is not new');
equal(touchRooms(opened,'#home','2026-10-25T09:00:00.000Z',monday).opened,{},'a reused explorer id with another profile starts fresh');
equal(roomsKey('explorer-2'),'learning-garden-rooms-v1:explorer-2','record key outside the notebook prefix');
equal(readRooms(JSON.stringify(opened),E),opened,'reads its own record');
equal(readRooms(JSON.stringify(opened),'other'),null,'ignores another profile’s record');
equal(readRooms('{not json',E),null,'ignores unreadable storage');

// Shared device: A leaves Monday; B uses the device Tuesday; A returns Wednesday with since still Monday.
let A=touchRooms(null,'#home',E,monday);const B=touchRooms(null,'#home','b',tuesday);
equal([A.lastDay,B.lastDay],[monday,tuesday],'separate records');
A=touchRooms(A,'#home',E,wednesday);
equal([A.since,A.lastDay],[monday,wednesday],'A’s since is A’s previous visit');
equal(touchRooms(A,'#home',E,wednesday).since,monday,'since holds for the rest of the day');

// New for you.
const fresh=newRooms(touchRooms(null,'#home',E,'2026-11-01'),'2026-11-01');
ok(fresh.length&&fresh.every(r=>r.added>='2026-10-29'),'only rooms added since');
ok(fresh.every((r,i)=>!i||fresh[i-1].added>=r.added),'newest first');
equal(newRooms(null,'2026-11-01'),[],'no record (picker showing): nothing is new');
setActiveRooms(null);equal(newRooms(),[],'no active record by default');

// Restore: shape only, never registry membership.
for(const bad of [null,[],'x',{explorer:E,opened:[],since:monday,lastDay:monday},{explorer:E,opened:{'not a route':monday},since:monday,lastDay:monday},{explorer:E,opened:{},since:'2026-02-30',lastDay:'2026-03-01'},{explorer:E,opened:{},since:tuesday,lastDay:monday},{explorer:E,opened:{'#workshop/design':'yesterday'},since:monday,lastDay:monday},{opened:{},since:monday,lastDay:monday}]){
 ok(!validRooms(bad),`rejects ${JSON.stringify(bad)}`);
 equal(touchRooms(bad,'#home',E,wednesday),{explorer:E,opened:{},since:addDays(wednesday,-3),lastDay:wednesday},`fresh record replaces ${JSON.stringify(bad)}`);
}
const kept={explorer:E,opened:{'#gone/room':monday,'#workshop/design':monday},since:monday,lastDay:monday};
ok(validRooms(kept),'unknown well-formed routes are valid');
equal(touchRooms(kept,'#home',E,tuesday).opened['#gone/room'],monday,'a removed or newer room’s opened date is kept');

// Two copies of one record (this page and another tab): opened rooms are never lost.
const tabA={explorer:E,opened:{'#words/letterpress':'2026-11-01'},since:'2026-10-29',lastDay:'2026-11-01'};
const tabB={explorer:E,opened:{'#library/beat':'2026-11-01','#words/letterpress':'2026-10-31'},since:'2026-10-29',lastDay:'2026-11-01'};
equal(mergeRooms(tabA,tabB).opened,{'#words/letterpress':'2026-10-31','#library/beat':'2026-11-01'},'union of opened rooms at their earliest date');
equal(mergeRooms(tabA,{...tabB,since:'2026-10-30',lastDay:'2026-11-02'}).lastDay,'2026-11-02','the later visit day wins');
equal(mergeRooms(tabA,{...tabB,since:'2026-10-30',lastDay:'2026-11-02'}).since,'2026-10-30','with its since');
equal(mergeRooms(null,tabB),tabB,'storage alone');equal(mergeRooms(tabA,null),tabA,'memory alone');
equal(mergeRooms({...tabA,explorer:'old profile'},tabB),tabB,'a stale profile copy never wins over storage');

// Shelf and #new page.
const all=Object.fromEntries(rooms.map(r=>[r.route,'2026-11-01']));
const many={explorer:E,opened:{},since:'2026-10-18',lastDay:'2026-11-01'},none={...many,opened:all};
const shelf=newShelf(many,'2026-11-01');
equal((shelf.match(/class="nfy-card"/g)||[]).length,4,'at most four cards');
ok(shelf.includes('href="#new"')&&shelf.includes(`(${newRooms(many,'2026-11-01').length})`),'a link to every new room');
equal(newShelf(none,'2026-11-01'),'','no shelf and no empty state when nothing is new');
equal((newRoomsPage(many,'2026-11-01').match(/class="nfy-card"/g)||[]).length,newRooms(many,'2026-11-01').length,'#new lists every new room');
ok(newRoomsPage(none,'2026-11-01').includes('Nothing new right now.'),'#new says when nothing is new');

// Workshop groups: every current table exactly once, links unchanged.
const ui=readFileSync(new URL('../dist/workshop-ui.mjs',import.meta.url),'utf8');
const shelves=ui.slice(ui.indexOf('const workshopShelves=['),ui.indexOf('];',ui.indexOf('const workshopShelves=['))+2);
const groupRoutes=[...shelves.matchAll(/\['(#[^']+)','/g)].map(m=>m[1]);
equal(groupRoutes.length,22,'22 tables');
equal(new Set(groupRoutes).size,22,'each table once');
equal(groupRoutes.filter(r=>!rooms.some(x=>x.route===r&&x.places.includes('#workshop'))),[],'every grouped table is a registered Workshop room');
equal([...shelves.matchAll(/^ \['([^']+)',\[/gm)].map(m=>m[1]),['Build and test','Measure, count and share','Maps, sources and stories'],'three groups in order');

console.log(`New for you: ${checks} registry, rule, restore, shelf and Workshop checks passed.`);
