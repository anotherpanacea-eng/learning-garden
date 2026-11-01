// Spec 358: which rooms are new for this explorer. Pure rules plus the home shelf, the #new page and New marks.
import {rooms} from './room-registry.mjs';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const pad=n=>String(n).padStart(2,'0');
export const localDay=(now=new Date())=>`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
const validDay=d=>{if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;const [y,m,n]=d.split('-').map(Number),t=new Date(y,m-1,n);return t.getFullYear()===y&&t.getMonth()===m-1&&t.getDate()===n;};
export function addDays(day,n){const [y,m,d]=day.split('-').map(Number);return localDay(new Date(y,m-1,d+n));}
const byRoute=new Map(rooms.map(r=>[r.route,r]));
export const roomFor=route=>byRoute.get(route)||null;

// The record lives beside the notebook, never in it: entering a room must leave every notebook root unchanged.
// Shape only, never registry membership: a removed or newer room's opened date is kept (spec 358, Restore).
export function validRooms(v){
 return object(v)&&typeof v.explorer==='string'&&object(v.opened)&&Object.entries(v.opened).every(([k,d])=>/^#[^\s#]+$/.test(k)&&validDay(d))&&validDay(v.since)&&validDay(v.lastDay)&&v.since<=v.lastDay;
}
export const roomsKey=id=>`number-garden-v1:${id}:rooms`;
const fresh=(explorer,today)=>({explorer,opened:{},since:addDays(today,-3),lastDay:today});
// explorer is the profile's createdAt, so a reused explorer id never inherits an old record.
export function readRooms(raw,explorer){try{const v=JSON.parse(raw);return validRooms(v)&&v.explorer===explorer?v:null;}catch{return null;}}

// First use, a new day and opening a room, for the chosen explorer only. Returns the next record; never mutates.
export function touchRooms(record,route,explorer,today=localDay()){
 let r=validRooms(record)&&record.explorer===explorer?record:fresh(explorer,today);
 if(r.lastDay<today)r={...r,since:r.lastDay,lastDay:today};
 const room=roomFor(route);
 if(room&&!r.opened[room.route])r={...r,opened:{...r.opened,[room.route]:today}};
 return r;
}

// The chosen explorer's record, set by the app after each touch; null while the picker shows.
let active=null;
export function setActiveRooms(record){active=validRooms(record)?record:null;}

// Newest first; registry order breaks ties.
export function newRooms(record=active,today=localDay()){
 if(!validRooms(record))return [];
 const r=record.lastDay<today?{...record,since:record.lastDay}:record;
 return rooms.map((room,i)=>[room,i]).filter(([room])=>room.added>=r.since&&!r.opened[room.route]).sort((a,b)=>b[0].added.localeCompare(a[0].added)||a[1]-b[1]).map(([room])=>room);
}

export const placeNames=Object.freeze({'#cafe':'the Café','#science':'the Water Lab','#workshop':'the Workshop','#post':'the Post Office','#numbers':'the Number Garden','#words':'the Word Garden','#desk':'the Keeper’s Desk','#living':'the Living Garden','#loft':'the Story Loft','#orchard':'the Cloud Orchard','#field':'the Field Kit','#almanac':'the Keeper’s Pages','#archive':'the Travelers’ Archive','#learn':'Choose a starting point','#pathways/math':'the math starting points','#pathways/english':'the English starting points','#pathways/science':'the science starting points','#pathways/french':'the French starting points'});
const where=room=>placeNames[room.places[0]]||'';
const card=room=>`<a class="nfy-card" href="${esc(room.route)}" data-nfy-room><strong>${esc(room.title)}</strong><small>in ${esc(where(room))}</small></a>`;

export function newShelf(record=active,today=localDay()){
 const list=newRooms(record,today);
 if(!list.length)return '';
 return `<section class="nfy-shelf" aria-labelledby="nfy-title"><h2 id="nfy-title"><span class="nfy-dot" aria-hidden="true"></span>New for you</h2><div class="nfy-cards">${list.slice(0,4).map(card).join('')}</div>${list.length>4?`<a class="nfy-all" href="#new">See all new rooms (${list.length})</a>`:''}</section>`;
}

export function newRoomsPage(record=active,today=localDay()){
 const list=newRooms(record,today);
 return `<div class="nfy-page"><header class="page-heading"><a class="back" href="#home"><span aria-hidden="true">←</span> Back to the garden</a><h1 tabindex="-1">New rooms</h1><p>${list.length?'Rooms added since your last visit that you have not opened yet.':'Nothing new right now. Every room stays open.'}</p></header>${list.length?`<div class="nfy-cards nfy-list">${list.map(card).join('')}</div>`:''}</div>`;
}

// Marks every link to a new room, and each top-bar place that links one. Idempotent; safe to run after any render.
export function markNewRooms(doc,record=active,today=localDay()){
 const list=newRooms(record,today),fresh=new Set(list.map(r=>r.route)),places=new Set(list.flatMap(r=>r.places));
 for(const a of doc.querySelectorAll('main a[href^="#"]')){
  const on=fresh.has(a.getAttribute('href'))&&!a.hasAttribute('data-nfy-room'),mark=a.querySelector(':scope > .nfy-mark');
  if(on&&!mark)a.insertAdjacentHTML('beforeend','<span class="nfy-mark"><span aria-hidden="true"><span class="nfy-dot"></span>New</span><span class="sr-only">, new</span></span>');
  else if(!on&&mark)mark.remove();
 }
 for(const a of doc.querySelectorAll('.header nav a[href^="#"]')){
  const on=places.has(a.getAttribute('href')),dot=a.querySelector(':scope > .nfy-place');
  if(on&&!dot)a.insertAdjacentHTML('beforeend','<span class="nfy-dot nfy-place" aria-hidden="true"></span><span class="sr-only nfy-place">, something new inside</span>');
  else if(!on&&dot)a.querySelectorAll(':scope > .nfy-place').forEach(x=>x.remove());
 }
}
