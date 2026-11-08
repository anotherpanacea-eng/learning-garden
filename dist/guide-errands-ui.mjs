// Spec 600 · Guide errands. A strip between the header and <main>, outside every activity's markup,
// so an activity re-render never touches it. It renders finite copy and ordinary links, and writes nothing.
import {guides,portrait} from './companions.mjs';
import {ERRAND_UI} from './guide-errands-content.mjs';
import {errandView} from './guide-errands-core.mjs';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const guideOf=state=>guides.find(g=>g.id===state?.garden?.guide)||guides[0];
const named=(text,guide)=>text.replaceAll('{guide}',()=>guide.name);

export function guideErrandsHTML(view,state){
 if(!view)return '';
 const guide=guideOf(state),ui=ERRAND_UI[view.kind];
 const cards=view.items.map(item=>`<li class="ge-card"><p>${esc(named(item.line,guide))}</p><a class="ge-go" href="${esc(item.to)}">${esc(item.label)}</a></li>`).join('');
 return `<div class="ge-face">${portrait(guide.id,true)}</div><details class="ge-details" data-ge-kind="${view.kind}"><summary>${esc(named(ui.summary,guide))}</summary><p class="ge-lead">${esc(named(ui.lead,guide))}</p><ul class="ge-cards">${cards}</ul><p class="ge-free">${esc(ui.free)}</p></details>`;
}

// getState returns the active explorer's state, or null while no explorer is chosen.
export function installGuideErrands(getState,doc=globalThis.document,win=globalThis.window){
 if(!doc?.querySelector)return null;
 const main=doc.querySelector('main#main');
 if(!main)return null;
 if(!doc.querySelector('link[data-guide-errands]')){const link=doc.createElement('link');link.rel='stylesheet';link.href='./guide-errands.css';link.dataset.guideErrands='';doc.head.append(link);}
 let strip=doc.getElementById('guide-errands');
 if(!strip){strip=doc.createElement('aside');strip.id='guide-errands';strip.className='guide-errands';strip.setAttribute('aria-label',ERRAND_UI.region);main.before(strip);}
 const update=()=>{
  let html='';
  try{const state=getState();html=state?guideErrandsHTML(errandView(win.location.hash||'#home',state),state):'';}catch{html='';}
  strip.innerHTML=html;strip.hidden=!html;
 };
 // Run after the shell's own hashchange handler has rendered the route.
 win.addEventListener('hashchange',()=>win.setTimeout(update,0));
 update();
 return update;
}
