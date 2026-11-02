// Spec 359 source checks: roomShelf keeps entries byte for byte and moves entries with a new room first.
import assert from 'node:assert/strict';
import {roomShelf,touchRooms} from '../dist/new-for-you.mjs';

let checks=0;
const equal=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
const ok=(a,label)=>{assert.ok(a,label);checks++;};
const grid=html=>html.slice(html.indexOf('<div class="room-shelf-grid">')+29,html.lastIndexOf('</div></section>'));
const E='2026-10-20T12:00:00.000Z',today='2026-11-01';
const fresh=touchRooms(null,'#home',E,today); // since 2026-10-29
const entries=['<aside class="a"><a href="#numbers/seeds">Old</a></aside>','','<aside class="b"><a href="#desk/rods">Rods</a></aside>','<p>no link</p>','<aside class="c"><a href="#words/letterpress">Press</a></aside>'];

equal(roomShelf('T',[],fresh,today),'','nothing to render');
equal(roomShelf('T',['','  '],fresh,today),'','only empty entries');
const html=roomShelf('More rooms',entries,fresh,today);
ok(html.startsWith('<section class="room-shelf" aria-labelledby="room-shelf-')&&html.includes('>More rooms</h2>'),'labeled section');
equal(grid(html),entries[2]+entries[4]+entries[0]+entries[3],'new entries first in stable order; others keep order; empty dropped');
equal(grid(roomShelf('T',entries,null,today)),entries[0]+entries[2]+entries[3]+entries[4],'no explorer chosen: order unchanged');
const opened=touchRooms(touchRooms(fresh,'#desk/rods',E,today),'#words/letterpress',E,today);
equal(grid(roomShelf('T',entries,opened,today)),entries[0]+entries[2]+entries[3]+entries[4],'opened rooms are not promoted');
// Any link counts: the letter entry links Messages first and the changing letter round second.
const letter='<aside class="msg-entry"><a href="#post/messages">Messages</a> <a href="#post/letters/round">Round</a></aside>',other='<aside><a href="#post/packing">Pack</a></aside>';
const roundNew={explorer:E,opened:{'#post/messages':'2026-10-21','#post/packing':'2026-10-21'},since:'2026-10-19',lastDay:today};
equal(grid(roomShelf('T',[other,letter],roundNew,today)),letter+other,'promoted when its second link is new');
ok(roomShelf('A&B',[entries[0]],fresh,today).includes('A&amp;B'),'title escaped');
console.log(`Room shelves: ${checks} checks passed.`);
