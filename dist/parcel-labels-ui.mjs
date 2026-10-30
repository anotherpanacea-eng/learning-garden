import {makeParcelSource, parcelFamilies, parcelQuantities, parcelEndings} from './parcel-labels-content.mjs';
import {parcelLabelsView, parcelLabel, parcelReady, validParcelWork, validParcelSnapshot, startParcel, openParcel, setParcelPiece,
  setParcelMessage, showParcelHelp, checkParcel, keepParcel, removeParcel} from './parcel-labels-core.mjs';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button = (attributes, label, kind = '') => `<button type="button" ${attributes}${kind ? ` class="${kind}"` : ''}>${esc(label)}</button>`;
const destination = s => s.destination === 'cafe' ? 'the café' : 'the garden';
// Original silhouettes: bread rolls, flowerpots, cut daisies, and recognizably different fruits.
const drawings = {
  bun: '<path fill="#dfab68" d="M7 44C4 9 57 6 59 44Z"/><path d="m20 23 5 10m8-14 5 11m7-9 4 10"/>',
  cup: '<path fill="#86b8c0" d="M12 16h34v31q-17 14-34 0Z"/><path fill="none" d="M47 22h7q15 14-8 19M7 55h45"/>',
  pot: '<path fill="#c7946d" d="m13 22 6 34h28l6-34"/><path fill="#dfb18c" d="M9 14h48v12H9Z"/><path d="M30 36h8m-4-4v8"/>',
  box: '<path fill="#dcb982" d="M6 19 32 8l27 11v32L32 61 6 49Z"/><path fill="none" d="m6 19 26 12 27-12M32 31v30M20 13l26 12v12"/>',
  dish: '<ellipse fill="#b9d4ca" cx="32" cy="35" rx="29" ry="19"/><ellipse fill="#eef5e9" cx="32" cy="33" rx="21" ry="12"/>',
  brush: '<path fill="#b28d65" d="M27 5h10v30H27Z"/><path fill="#e7c76f" d="M12 33h40v25H12Z"/><path d="M13 40h39m-32 0v18m8-18v18m8-18v18m8-18v18"/>',
  berry: '<path fill="#cf647a" d="M10 19Q32 8 54 19q3 19-22 41Q7 40 10 19Z"/><path fill="#779a6a" d="m32 7 4 11 12-5-7 11-10-3-11 3-7-11 15 5Z"/><path stroke="#fff7dd" d="m21 31 2 2m17-2 2 2m-10 7 2 2m-3 8 2 2"/>',
  cherry: '<path fill="none" d="M31 34Q25 15 45 5"/><path fill="#679a6b" d="M42 8q-18-4-17 9 12 1 17-9Z"/><circle fill="#c5626c" cx="31" cy="46" r="15"/>',
  daisy: '<path fill="none" stroke="#5b8860" d="M32 27v35m0-13Q14 34 14 48q9 9 18 4"/><g fill="#fffdf2"><ellipse cx="32" cy="23" rx="10" ry="19"/><ellipse cx="32" cy="23" rx="10" ry="19" transform="rotate(60 32 23)"/><ellipse cx="32" cy="23" rx="10" ry="19" transform="rotate(120 32 23)"/></g><circle fill="#e2ba55" cx="32" cy="23" r="9"/>',
  tray: '<path fill="#a4bca9" d="M6 25h52v29H6Z"/><path fill="#e8ead5" d="M12 30h40v18H12Z"/><path fill="none" d="M6 31H1v14h5m52-14h5v14h-5"/>',
  key: '<circle fill="#e0bf66" cx="18" cy="20" r="14"/><circle fill="#f8faf4" cx="18" cy="20" r="5"/><path fill="#e0bf66" d="m26 30 25 26 9-9-6-6-5 4-5-5 4-5-6-6-5 4-5-8Z"/>',
  toy: '<path fill="#97b6ca" d="M11 28h43v29H11Z"/><path fill="#d9b978" d="M19 28V9h27v19"/><path fill="#e3c58b" d="M19 9 32 2l14 7"/><circle fill="#759a87" cx="27" cy="43" r="7"/><path fill="#f7ecd4" d="M44 38h6v12h-6Z"/>',
};
export function parcelPicture(source) {
  const count = source.count, label = count === 1 ? `1 pictured object; it is called ${source.base}` : `${count} pictured objects; one is called ${source.base}`;
  const picture = drawings[source.art] || '<path fill="#c5cdb4" d="M10 12h44v44H10Z"/><path d="M22 25h20M22 35h20M22 45h12"/>';
  return `<svg class="parcel-picture" viewBox="0 0 360 205" role="img" aria-label="${esc(label)}"><path class="parcel-paper" d="M12 12h336v181H12Z"/><path class="parcel-twine" d="M12 112h336M182 12v181"/>${Array.from({length:count},(_,i)=>`<g data-parcel-object transform="translate(${[45,148,251][i%3]} ${i<3?24:115})" stroke="#294e46" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round">${picture}</g>`).join('')}</svg>`;
}
const request = (s, label) => `Please send ${s.count} <strong data-parcel-preview>${label ? esc(label) : '<span aria-hidden="true">___</span><span class="sr-only">choose an ending</span>'}</strong> to ${destination(s)}.`;
function keptVersion(k, name) {
  if (!validParcelSnapshot(k)) return `<p>${esc(name)} is retained in a format this version cannot show. Download Notes to keep the original.</p>`;
  return `<section><h3>${esc(name)}</h3><p>${request(k.source,k.label)}</p><p class="parcel-own-text">${esc(k.ownMessage) || 'No original message kept.'}</p><p>${parcelReady(k)?'Kept label: ready when checked.':'Kept draft; no current matching check.'} ${k.checks.length} supported checks retained in this version.</p></section>`;
}
function choices(v, currentId) {
  const word = v.work;
  return `<details data-parcel-disclosure="more"${word ? '' : ' open'}><summary>Another parcel or a saved label</summary><p>Twelve words, with familiar returns. Choose the spelling pattern you want to explore. These choices do not assign a reading level.</p><div class="parcel-selectors"><label>Spelling pattern<select data-parcel-family>${parcelFamilies.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label><label>Quantity<select data-parcel-quantity>${parcelQuantities.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label></div><p data-parcel-one-note hidden>This pattern is for more than one. For one, keep the whole word.</p>${button('data-parcel-start',word ? 'Another parcel' : 'Start a parcel','primary')}${!v.canCreate?'<p>New parcels are paused: the saved counter, an occupied id or the twelve retained slots needs attention. Download your notes before removing any selected readable parcel. Your current work remains available.</p>':''}${v.visits.length?`<h2>Saved parcels</h2><div class="parcel-saved">${v.visits.map(x=>x.readable?button(`data-parcel-open="${esc(x.id)}" aria-pressed="${x.id===currentId}"`,`${x.id} · ${x.source.count} · ${x.source.base}`):`<p>${esc(x.id)} is retained but unreadable here.</p>`).join('')}</div><label>Parcel to remove (optional)<select data-parcel-remove-choice><option value="">Choose a saved parcel</option>${v.visits.filter(x=>x.readable).map(x=>`<option value="${esc(x.id)}">${esc(x.id)} · ${esc(x.source.base)}</option>`).join('')}</select></label>${button('data-parcel-remove','Remove selected parcel')}`:''}<p><a href="#notes">Download your notes</a>. Removing a parcel never reuses its number.</p></details>`;
}
export function parcelLabelsPage(state) {
  const v = parcelLabelsView(state), w = v.work;
  const heading = '<header><a href="#words">Back to Word Garden</a><h1 id="parcel-heading" tabindex="-1">Parcel labels</h1><p>The café and garden are sharing supplies. Make a label for the reader.</p></header>';
  if (v.status === 'unsupported') return `<div class="parcel-page" data-parcel-root>${heading}<p>This saved format is kept unchanged. Parcel actions are unavailable here; the rest of the garden is open.</p><a href="#notes">Download your notes</a></div>`;
  const source = w?.source || makeParcelSource(1), label = w ? parcelLabel(w) : '';
  return `<div class="parcel-page" data-parcel-root>${heading}<div class="parcel-work"><figure>${parcelPicture(source)}<figcaption class="parcel-label-tag"><span>Your label</span><p>${request(source,label)}</p>${w&&parcelReady(w)?'<strong class="parcel-stamp">Label ready</strong>':''}</figcaption></figure><section class="parcel-pieces" aria-labelledby="parcel-task"><h2 id="parcel-task" tabindex="-1">One is called: <strong>${esc(source.base)}</strong></h2>${w?`<p>Choose the pieces, then check your label.</p><div class="parcel-stems" role="group" aria-label="Word piece">${source.trimmed===null?`<span class="parcel-word">${esc(source.base)}</span>`:button(`data-parcel-stem="keep" aria-pressed="${w.draft.stem==='keep'}"`,`Keep ${source.base}`)+button(`data-parcel-stem="trim" aria-pressed="${w.draft.stem==='trim'}"`,`Take off final y: ${source.trimmed}`)}</div><div class="parcel-endings" role="group" aria-label="Ending">${parcelEndings.map(([id,name])=>button(`data-parcel-ending="${id}" aria-pressed="${w.draft.ending===id}"`,name)).join('')}</div><div class="parcel-actions">${button(`data-parcel-check aria-disabled="${w.draft.ending===null}"`,'Check this label','primary')}${button(`data-parcel-keep aria-disabled="${w.draft.ending===null}"`,'Keep this parcel')}</div>${button('data-parcel-help','Show this spelling pattern')}`:'<p>Start a parcel to try the word pieces. You can choose a pattern below.</p>'}</section></div>${w?.help?`<aside class="parcel-help" id="parcel-help" tabindex="-1"><h2>${esc(source.count===1?'One whole word':source.patternName)}</h2><p>${esc(source.workedExample)}</p><p>Common patterns have exceptions. A dictionary or a grown-up can help with other words. Look at the letter just before final y: a,e,i,o,u are vowel letters; r,s,p in these examples are consonant letters.</p></aside>`:''}${w?.checks.length?`<section class="parcel-feedback" id="parcel-feedback" tabindex="-1"><h2>Last checked: ${esc(w.checks.at(-1).label)}</h2><p>${esc(w.checks.at(-1).feedback)}</p><p>The base and pieces were supplied: this is supported spelling practice.</p></section>`:''}<p id="parcel-status" role="status" tabindex="-1"></p>${w?`<details data-parcel-disclosure="writing"><summary>Your own message (optional)</summary><label>A person can read this; it is not automatically marked.<textarea data-parcel-message maxlength="600" rows="3">${esc(w.ownMessage)}</textarea></label><p>Keep this parcel to retain a version of your label and message.</p>${Object.hasOwn(w,'firstKept')?keptVersion(w.firstKept,'First kept version'):''}${Object.hasOwn(w,'latestKept')?keptVersion(w.latestKept,'Latest kept version'):''}</details>`:''}${choices(v,state.parcelLabels?.currentId)}<p class="parcel-boundary">In Word Garden you can invent words. Here we use the usual spellings so a reader can recognize the supplies.</p><p>Try a paper café or garden note with a grown-up. Change the number and read the new label together.</p><a href="#notes">Grown-up notes</a></div>`;
}
export function parcelLabelsNotes(state) {
  if (!Object.hasOwn(state,'parcelLabels')) return '';
  const v = parcelLabelsView(state);
  return `<details class="panel"><summary>Parcel labels: supplied spelling practice</summary><p>Supplied pieces, optional help, and corrections are not independent decoding or writing evidence.</p>${v.visits.filter(x=>x.readable).map(x=>{const w=state.parcelLabels.visits[x.id];return `<h3>${esc(x.id)} · ${esc(w.source.base)}</h3><p>Current label: ${esc(parcelLabel(w)) || 'No ending chosen'}.</p><p class="parcel-own-text">${esc(w.ownMessage)}</p>${Object.hasOwn(w,'firstKept')?keptVersion(w.firstKept,'First kept version'):''}${Object.hasOwn(w,'latestKept')?keptVersion(w.latestKept,'Latest kept version'):''}`;}).join('')}<details><summary>Exact retained parcel material</summary><pre>${esc(JSON.stringify(state.parcelLabels,null,2))}</pre></details><a href="#words/endings">Open Parcel labels</a></details>`;
}

const errors = {
  'unexportable':'This change could not be kept in an exportable notebook. Your earlier work is unchanged.',
  'unavailable':'This saved material cannot be changed here. Other readable parcels and Notes remain available.',
  'selection':'Choose one of the available pieces or patterns.', 'choose-ending':'Choose an ending, including No ending, before checking or keeping.',
  'visit-cap':'Twelve parcels are retained. Download your notes, then explicitly remove a selected parcel to open another.',
  'check-cap':'This parcel retains 24 checks. You can edit or keep it, or open Another parcel below. Earlier checks are unchanged.',
  'collision':'That parcel number is already occupied. Existing work is unchanged; download Notes or open a readable saved parcel.',
  'counter':'The saved parcel counter is unavailable or exhausted. Existing parcels and Notes are still open.',
  'kept-unavailable':'An earlier kept version cannot be read here. It has not been overwritten. Download Notes to retain it.',
  'message-length':'Keep this message to 600 characters. Your visible words have not been saved.',
};
let controller = null, pendingNavigation = () => false;
export const guardParcelLabelsNavigation = () => pendingNavigation();
export function bindParcelLabels(state, ctx = {}) {
  controller?.abort(); controller = new AbortController(); pendingNavigation = () => false;
  const root = document.querySelector('[data-parcel-root]'); if (!root) return;
  const owner = ctx.explorerId?.(), route = '#words/endings', originalId = state.parcelLabels?.currentId;
  let dirty = false;
  const owned = () => root.isConnected && (!ctx.notebook || ctx.notebook() === state) && ctx.explorerId?.() === owner && (!ctx.isActive || ctx.isActive());
  const live = el => owned() && location.hash === route && el.isConnected && root.contains(el) && !el.closest('details:not([open])');
  const say = (text, take = false) => {const n=root.querySelector('#parcel-status');if(n){n.textContent=text;if(take)n.focus();}};
  const persistence = () => {const r=ctx.save?.();return r?.enabled===false?'Kept for this visit; browser saving is off. Download Notes to retain it.':r?.ok===false?'Kept in this tab, but browser saving failed. Download Notes before leaving.':r?.ok===true?'Saved on this device.':'Kept in this tab.';};
  const unsaved = () => {
    say('Your visible message has not been saved. Edit it to try again, or copy it before restoring the last saved words.');
    const status=root.querySelector('#parcel-status'), restore=document.createElement('button');restore.type='button';restore.dataset.parcelRestore='';restore.textContent='Restore last saved words';
    restore.addEventListener('click',()=>{if(!live(restore)||!window.confirm('Discard the visible unsaved words and restore the last saved message?'))return;dirty=false;redraw('Last saved words restored.','#parcel-heading');});status?.append(restore);
  };
  const redraw = (message, target, forceMore=false) => {
    const open=[...root.querySelectorAll('[data-parcel-disclosure][open]')].map(x=>x.dataset.parcelDisclosure);
    const selected=[...root.querySelectorAll('select')].map(x=>[x.getAttribute('data-parcel-family')!==null?'[data-parcel-family]':x.getAttribute('data-parcel-quantity')!==null?'[data-parcel-quantity]':'[data-parcel-remove-choice]',x.value]);
    ctx.render?.();
    const next=document.querySelector('[data-parcel-root]');if(!next||ctx.notebook&&ctx.notebook()!==state||ctx.explorerId?.()!==owner||location.hash!==route)return;
    if(state.parcelLabels?.currentId===originalId){for(const d of next.querySelectorAll('[data-parcel-disclosure]'))d.open=open.includes(d.dataset.parcelDisclosure);for(const [selector,value] of selected){const select=next.querySelector(selector);if(select&&[...select.options].some(x=>x.value===value))select.value=value;}}
    const quantity=next.querySelector('[data-parcel-quantity]'),note=next.querySelector('[data-parcel-one-note]');if(note&&quantity)note.hidden=quantity.value!=='one';
    if(forceMore)next.querySelector('[data-parcel-disclosure="more"]')?.setAttribute('open','');
    const status=next.querySelector('#parcel-status');if(status)status.textContent=message;
    const focus=next.querySelector(target)||next.querySelector('#parcel-heading');if(focus&&!focus.closest('details:not([open])'))focus.focus();
  };
  const act = (el, fn, message, target, forceMore=false) => {
    if(!live(el))return;if(dirty){unsaved();return;}
    const result=fn();if(!result.ok){say(errors[result.error]||'This change was not kept.',true);return;}
    const saved=result.changed===false?'':persistence();redraw(`${result.changed===false?'No change was needed.':message} ${saved}`,target,forceMore);
  };
  const on = (selector, fn) => root.querySelectorAll(selector).forEach(el=>el.addEventListener('click',()=>{if(live(el))fn(el);}));
  const options = {canExport:ctx.canExport};
  on('[data-parcel-stem]',el=>act(el,()=>setParcelPiece(state,'stem',el.dataset.parcelStem,options),'Word piece changed.',`[data-parcel-stem="${el.dataset.parcelStem}"]`));
  on('[data-parcel-ending]',el=>act(el,()=>setParcelPiece(state,'ending',el.dataset.parcelEnding,options),'Ending changed.',`[data-parcel-ending="${el.dataset.parcelEnding}"]`));
  on('[data-parcel-check]',el=>act(el,()=>checkParcel(state,options),'Check kept. You can change the pieces.','#parcel-feedback'));
  on('[data-parcel-help]',el=>act(el,()=>showParcelHelp(state,options),'Spelling help shown.','#parcel-help'));
  on('[data-parcel-keep]',el=>act(el,()=>keepParcel(state,options),'Version kept. Earlier first-kept work is retained.','#parcel-heading'));
  on('[data-parcel-start]',el=>act(el,()=>startParcel(state,{family:root.querySelector('[data-parcel-family]').value,quantity:root.querySelector('[data-parcel-quantity]').value},options),'New parcel opened. Earlier parcels are retained.','#parcel-task'));
  on('[data-parcel-open]',el=>act(el,()=>openParcel(state,el.dataset.parcelOpen,options),'Saved parcel opened.','#parcel-task'));
  on('[data-parcel-remove]',el=>{
    if(dirty){unsaved();return;}const key=root.querySelector('[data-parcel-remove-choice]').value,w=state.parcelLabels?.visits?.[key];
    if(!validParcelWork(w)){say('Choose a readable saved parcel to remove.',true);return;}
    if(!window.confirm(`Remove ${key} (${w.source.base})? This removes its source, message, ${w.checks.length} checks and all first/latest kept versions. Download Notes first to keep a copy.`))return;
    act(el,()=>removeParcel(state,key,true,options),'Only the selected parcel was removed.','#parcel-heading',true);
  });
  const input=root.querySelector('[data-parcel-message]');
  input?.addEventListener('input',()=>{if(!live(input))return;const r=setParcelMessage(state,input.value,options);if(r.ok){dirty=false;input.removeAttribute('aria-invalid');say(persistence());}else{dirty=true;input.setAttribute('aria-invalid','true');unsaved();}});
  const quantity=root.querySelector('[data-parcel-quantity]');quantity?.addEventListener('change',()=>{if(live(quantity))root.querySelector('[data-parcel-one-note]').hidden=quantity.value!=='one';});
  root.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{if(!live(a)){e.preventDefault();return;}if(dirty){e.preventDefault();unsaved();}}));
  document.addEventListener('click',e=>{if(!dirty||!owned())return;const control=e.target.closest?.('button,a,input,select');if(!control||root.contains(control)&&!control.matches('a'))return;e.preventDefault();e.stopImmediatePropagation();unsaved();},{capture:true,signal:controller.signal});
  pendingNavigation=()=>{if(!dirty||!owned()||location.hash===route)return false;history.replaceState(null,'',route);unsaved();return true;};
  window.addEventListener('beforeunload',e=>{if(dirty&&owned()){e.preventDefault();e.returnValue='';}},{signal:controller.signal});
}
