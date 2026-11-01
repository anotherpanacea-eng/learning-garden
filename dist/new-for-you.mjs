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

// Shape only, never registry membership: a removed or newer room's opened date is kept (spec 358, Restore).
export function validRooms(v){
 return object(v)&&object(v.opened)&&Object.entries(v.opened).every(([k,d])=>/^#[^\s#]+$/.test(k)&&validDay(d))&&validDay(v.since)&&validDay(v.lastDay)&&v.since<=v.lastDay;
}
const fresh=today=>({opened:{},since:addDays(today,-3),lastDay:today});
// The record as it would be today, without changing the notebook.
function view(book,today){const r=validRooms(book?.rooms)?book.rooms:fresh(today);return r.lastDay<today?{...r,since:r.lastDay,lastDay:today}:r;}

// First use, a new day and opening a room. Call only for the chosen explorer. Returns true when the notebook changed.
export function touchRooms(book,route,today=localDay()){
 if(!object(book))return false;
 const before=JSON.stringify(book.rooms??null),r=view(book,today),room=roomFor(route);
 book.rooms={opened:{...r.opened},since:r.since,lastDay:r.lastDay};
 if(room&&!book.rooms.opened[room.route])book.rooms.opened[room.route]=today;
 return JSON.stringify(book.rooms)!==before;
}

// Newest first; registry order breaks ties.
export function newRooms(book,today=localDay()){
 const r=view(book,today);
 return rooms.map((room,i)=>[room,i]).filter(([room])=>room.added>=r.since&&!r.opened[room.route]).sort((a,b)=>b[0].added.localeCompare(a[0].added)||a[1]-b[1]).map(([room])=>room);
}

export const placeNames=Object.freeze({'#cafe':'the Café','#science':'the Water Lab','#workshop':'the Workshop','#post':'the Post Office','#numbers':'the Number Garden','#words':'the Word Garden','#desk':'the Keeper’s Desk','#living':'the Living Garden','#loft':'the Story Loft','#orchard':'the Cloud Orchard','#field':'the Field Kit','#almanac':'the Keeper’s Pages','#archive':'the Travelers’ Archive','#learn':'Choose a starting point','#pathways/math':'the math starting points','#pathways/english':'the English starting points','#pathways/science':'the science starting points','#pathways/french':'the French starting points'});
const where=room=>placeNames[room.places[0]]||'';
const card=room=>`<a class="nfy-card" href="${esc(room.route)}" data-nfy-room><strong>${esc(room.title)}</strong><small>in ${esc(where(room))}</small></a>`;

export function newShelf(book,today=localDay()){
 const list=newRooms(book,today);
 if(!list.length)return '';
 return `<section class="nfy-shelf" aria-labelledby="nfy-title"><h2 id="nfy-title"><span class="nfy-dot" aria-hidden="true"></span>New for you</h2><div class="nfy-cards">${list.slice(0,4).map(card).join('')}</div>${list.length>4?`<a class="nfy-all" href="#new">See all new rooms (${list.length})</a>`:''}</section>`;
}

export function newRoomsPage(book,today=localDay()){
 const list=newRooms(book,today);
 return `<div class="nfy-page"><header class="page-heading"><a class="back" href="#home"><span aria-hidden="true">←</span> Back to the garden</a><h1 tabindex="-1">New rooms</h1><p>${list.length?'Rooms added since your last visit that you have not opened yet.':'Nothing new right now. Every room stays open.'}</p></header>${list.length?`<div class="nfy-cards nfy-list">${list.map(card).join('')}</div>`:''}</div>`;
}

// Marks every link to a new room, and each top-bar place that links one. Idempotent; safe to run after any render.
export function markNewRooms(doc,book,{active=true,today=localDay()}={}){
 const list=active?newRooms(book,today):[],fresh=new Set(list.map(r=>r.route)),places=new Set(list.flatMap(r=>r.places));
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
