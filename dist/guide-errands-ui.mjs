// Spec 600 · Guide errands. A strip between the header and <main>, outside every activity's markup,
// so an activity re-render never touches it. It renders finite copy and ordinary links, and writes nothing.
import {guides,portrait} from './companions.mjs';
import {hearButton,bindSpeech} from './play-media.mjs';
import {ERRAND_UI} from './guide-errands-content.mjs';
import {errandView} from './guide-errands-core.mjs';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const guideOf=state=>guides.find(g=>g.id===state?.garden?.guide)||guides[0];
const named=(text,guide)=>text.replaceAll('{guide}',()=>guide.name);

// The exact passage the Hear button reads: the visible lead and each errand's line, with the guide named.
export function guideErrandsSpeech(view,state){
 if(!view)return '';
 const guide=guideOf(state),ui=ERRAND_UI[view.kind];
 return [ui.lead,...view.items.map(item=>item.line)].map(text=>named(text,guide)).join(' ');
}

export function guideErrandsHTML(view,state){
 if(!view)return '';
 const guide=guideOf(state),ui=ERRAND_UI[view.kind];
 const cards=view.items.map(item=>`<li class="ge-card"><p>${esc(named(item.line,guide))}</p><a class="ge-go" href="${esc(item.to)}">${esc(item.label)}</a></li>`).join('');
 return `<div class="ge-face">${portrait(guide.id,true)}</div><details class="ge-details" data-ge-kind="${view.kind}"><summary>${esc(named(ui.summary,guide))}</summary><p class="ge-lead">${esc(named(ui.lead,guide))}</p>${hearButton(guideErrandsSpeech(view,state),ui.hear)}<ul class="ge-cards">${cards}</ul><p class="ge-free">${esc(ui.free)}</p></details>`;
}

// getState returns the active explorer's state, or null while no explorer is chosen.
export function installGuideErrands(getState,doc=globalThis.document,win=globalThis.window){
 if(!doc?.querySelector)return null;
 const main=doc.querySelector('main#main');
 if(!main)return null;
 if(!doc.querySelector('link[data-guide-errands]')){const link=doc.createElement('link');link.rel='stylesheet';link.href='./guide-errands.css';link.dataset.guideErrands='';doc.head.append(link);}
 let strip=doc.getElementById('guide-errands');
 if(!strip){strip=doc.createElement('aside');strip.id='guide-errands';strip.className='guide-errands';strip.setAttribute('aria-label',ERRAND_UI.region);main.before(strip);}
 let last=null;
 const update=()=>{
  let html='';
  try{const state=getState();html=state?guideErrandsHTML(errandView(win.location.hash||'#home',state),state):'';}catch{html='';}
  // Unchanged content is left alone, so an open strip stays open while an activity re-renders.
  if(html===last)return;
  // Hear moves the page's shared voice controls next to the pressed button; hand them back to <main> before
  // replacing the strip, so the next page's Hear buttons keep working.
  const controls=strip.querySelector('.speech-controls');if(controls)main.append(controls);
  last=html;strip.innerHTML=html;strip.hidden=!html;
  if(html)bindSpeech();
 };
 // Route changes, and shell renders that keep the hash (the explorer chooser, a same-route explorer switch).
 win.addEventListener('hashchange',()=>win.setTimeout(update,0));
 if(typeof win.MutationObserver==='function')new win.MutationObserver(()=>win.queueMicrotask(update)).observe(main,{childList:true});
 update();
 return update;
}
