// Spec 358 source checks: room registry, the new-for-you rules, the shelf and the Workshop groups.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rooms} from '../dist/room-registry.mjs';
import {localDay,addDays,validRooms,touchRooms,newRooms,newShelf,newRoomsPage,placeNames} from '../dist/new-for-you.mjs';

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

// First use, opening and the explorer-local record.
const monday='2026-10-27',tuesday='2026-10-28',wednesday='2026-10-29';
const a={version:1,other:{kept:true}};
ok(touchRooms(a,'#home',monday),'first use writes a record');
equal(a.rooms,{opened:{},since:addDays(monday,-3),lastDay:monday},'first use starts three days back');
equal(a.other,{kept:true},'other notebook keys untouched');
ok(!touchRooms(a,'#home',monday),'a second render the same day changes nothing');
const room=rooms.find(r=>r.added>=addDays(monday,-3)&&r.added<=monday)||rooms[0];
ok(touchRooms(a,room.route,monday),'opening a room changes the record');
equal(a.rooms.opened[room.route],monday,'opened today');
ok(!touchRooms(a,room.route,tuesday)||a.rooms.opened[room.route]===monday,'an opened date is never moved');
ok(!newRooms(a,monday).some(r=>r.route===room.route),'an opened room is not new');

// Shared device: A leaves Monday; B uses the device Tuesday; A returns Wednesday with since still Monday.
const A={version:1},B={version:1};
touchRooms(A,'#home',monday);touchRooms(B,'#home',tuesday);
equal(A.rooms.lastDay,monday,'B never moves A');
touchRooms(A,'#home',wednesday);
equal([A.rooms.since,A.rooms.lastDay],[monday,wednesday],'A’s since is A’s previous visit');
touchRooms(A,'#home',wednesday);
equal(A.rooms.since,monday,'since holds for the rest of the day');

// New for you.
const fresh=newRooms({version:1},'2026-11-01');
ok(fresh.every(r=>r.added>='2026-10-29'),'only rooms added since');
ok(fresh.every((r,i)=>!i||fresh[i-1].added>=r.added),'newest first');
equal(newRooms({version:1,rooms:{opened:{},since:'2026-11-02',lastDay:'2026-11-02'}},'2026-11-02'),rooms.filter(r=>r.added>='2026-11-02'),'nothing older than since');

// Restore: shape only, never registry membership.
for(const bad of [null,[],'x',{opened:[],since:monday,lastDay:monday},{opened:{'not a route':monday},since:monday,lastDay:monday},{opened:{},since:'2026-02-30',lastDay:'2026-03-01'},{opened:{},since:tuesday,lastDay:monday},{opened:{'#workshop/design':'yesterday'},since:monday,lastDay:monday}]){
 ok(!validRooms(bad),`rejects ${JSON.stringify(bad)}`);
 const book={version:1,rooms:bad,kept:[1]};touchRooms(book,'#home',wednesday);
 equal([book.rooms.since,book.rooms.opened,book.kept],[addDays(wednesday,-3),{},[1]],`fresh record replaces ${JSON.stringify(bad)}; other keys kept`);
}
const future={version:1,rooms:{opened:{'#gone/room':monday,'#workshop/design':monday},since:monday,lastDay:monday}};
ok(validRooms(future.rooms),'unknown well-formed routes are valid');
touchRooms(future,'#home',tuesday);
equal(future.rooms.opened['#gone/room'],monday,'a removed or newer room’s opened date is kept');

// Shelf and #new page.
const many={version:1,rooms:{opened:{},since:'2026-10-18',lastDay:'2026-11-01'}};
const shelf=newShelf(many,'2026-11-01');
equal((shelf.match(/class="nfy-card"/g)||[]).length,4,'at most four cards');
ok(shelf.includes('href="#new"')&&shelf.includes(`(${newRooms(many,'2026-11-01').length})`),'a link to every new room');
equal(newShelf({version:1,rooms:{opened:Object.fromEntries(rooms.map(r=>[r.route,'2026-11-01'])),since:'2026-10-18',lastDay:'2026-11-01'}},'2026-11-01'),'','no shelf and no empty state when nothing is new');
equal((newRoomsPage(many,'2026-11-01').match(/class="nfy-card"/g)||[]).length,newRooms(many,'2026-11-01').length,'#new lists every new room');
ok(newRoomsPage({version:1,rooms:{opened:Object.fromEntries(rooms.map(r=>[r.route,'2026-11-01'])),since:'2026-10-18',lastDay:'2026-11-01'}},'2026-11-01').includes('Nothing new right now.'),'#new says when nothing is new');

// Workshop groups: every current table exactly once, links unchanged.
const ui=readFileSync(new URL('../dist/workshop-ui.mjs',import.meta.url),'utf8');
const shelves=ui.slice(ui.indexOf('const workshopShelves=['),ui.indexOf('];',ui.indexOf('const workshopShelves=['))+2);
const groupRoutes=[...shelves.matchAll(/\['(#[^']+)','/g)].map(m=>m[1]);
equal(groupRoutes.length,22,'22 tables');
equal(new Set(groupRoutes).size,22,'each table once');
equal(groupRoutes.filter(r=>!rooms.some(x=>x.route===r&&x.places.includes('#workshop'))),[],'every grouped table is a registered Workshop room');
equal([...shelves.matchAll(/^ \['([^']+)',\[/gm)].map(m=>m[1]),['Build and test','Measure, count and share','Maps, sources and stories'],'three groups in order');

console.log(`New for you: ${checks} registry, rule, restore, shelf and Workshop checks passed.`);
