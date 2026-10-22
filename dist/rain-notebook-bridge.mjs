import {rainNotebook,rainNotebookInvitation,inviteRainNotebook,rainNotebookDisplayExposure,rainNotebookKnownExposure,noteRainNotebookExposure} from './rain-notebook-core.mjs';
import {noteRainDisplayExposure} from './rain-paths-core.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Render only a real completed result. The binder captures its exact wrapper after
// Rain Paths has registered what its source table actually displayed.
export function rainNotebookInvitationPanel(state,{origin,caseId}={}){
 const source=rainNotebookInvitation(state,caseId,origin);if(!source)return '';
 const notebook=rainNotebook(state),existing=!!notebook?.cases[caseId];
 return `<section class="rp-notebook-invitation" data-rnb-invitation data-rnb-case="${esc(caseId)}" data-rnb-origin="${esc(origin)}"><h3>Make a rain chart from these counts</h3><p>${origin==='kept-completed'?'Use this kept result.':'Use this finished run.'} Choose useful rows, build two bars and compare what they show.</p>${notebook?`<button type="button" class="secondary" data-rnb-open>${existing?'Go back to this case’s chart':'Make a rain chart'}</button>${existing?'<p>Going back keeps your chart and your place.</p><p>Start a new chart? Your old bars and answers will be cleared. Kept charts and earlier checks stay safe.</p><button type="button" class="text-button" data-rnb-replace>Start a new chart</button>':''}`:'<p>The earlier notebook format needs a recovery step before a chart can open. Its original record is still kept.</p><a href="#living/notebook/rain">Open the rain chart record</a>'}<p data-rnb-status role="status" tabindex="-1"></p></section>`;
}
function visible(el){return !!el.getClientRects().length;}
export function bindRainNotebookInvitations(state,ctx){
 if(!document.querySelector('.rp-workspace'))return;
 document.querySelectorAll('[data-rnb-invitation]').forEach(panel=>{
  let shown=null;
  const capture=()=>{if(visible(panel))shown=rainNotebookInvitation(state,panel.dataset.rnbCase,panel.dataset.rnbOrigin);};
  // Rain Paths' earlier toggle listener emits exposure first. An unopened kept
  // table is not captured, and its original shown wrapper is never refreshed by a click.
  for(let p=panel.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.addEventListener('toggle',capture);
  // Narration records support without rendering, which would cut off speech.
  // Capture the still-visible table after Rain Paths has recorded that support.
  document.querySelectorAll('[data-rp-audio] [data-speak]').forEach(b=>b.addEventListener('click',capture));
  capture();
  const open=replace=>{
   const result=shown&&inviteRainNotebook(state,shown,{replace});
   if(!result){const status=panel.querySelector('[data-rnb-status]');if(status){status.textContent='This source or notebook changed. Return to the result and open a fresh invitation; your chart is unchanged.';status.focus?.();}return;}
   ctx.save();ctx.navigate('#living/notebook/rain');
  };
  panel.querySelector('[data-rnb-open]')?.addEventListener('click',()=>open(false));
  panel.querySelector('[data-rnb-replace]')?.addEventListener('click',()=>open(true));
 });
}

// Replay only independently validated water-chart flags. Use view:'known' before
// Rain predictions/recovery; use notebook/notes only when that material is shown.
// No cress-day hook belongs here and ordinary tables/bars expose no fact pairs.
export function syncRainNotebookExposure(state,{view='known',rootExposer}={}){
 const known=rainNotebookKnownExposure(state),shown=['notebook','notes','source'].includes(view)?rainNotebookDisplayExposure(state,view):{results:false,unknown:false,facts:[]};
 const exposure={results:known.results||shown.results,unknown:known.unknown||shown.unknown,facts:[]};
 if(shown.results||shown.unknown)noteRainNotebookExposure(state,shown);
 if(exposure.results||exposure.unknown)(rootExposer||((e)=>noteRainDisplayExposure(state,e)))(exposure);
 return exposure;
}
