// Spec 322 §7: the look choice in Grown-up notes. It shares no form or button with the café starting amounts.
import {styleOf,chooseStyle,styleRefusal} from './style-core.mjs';
import {fieldJournalCafe} from './style-frames.mjs';
import {guests} from './cafe-content.mjs';
export const STYLE_COPY=Object.freeze({
 heading:'How the town looks',
 explanation:'Change this any time. Your guide, your work and how hard things are stay the same.',
 options:Object.freeze([
  Object.freeze({code:'storybook',name:'Storybook',description:'Bright pictures and playful lines.'}),
  Object.freeze({code:'field-journal',name:'Field Journal',description:'Notebook pages, maps and quieter lines.'}),
 ]),
 button:'Use this look',
 caption:'One café order, shown both ways.',
 saved:'Look changed for this explorer.',
 same:'This explorer already uses this look.',
 unreadable:'This look can’t be saved for this explorer.',
});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function previewCard(code,name){
 const puff=guests.find(g=>g.id==='puff'),line=code==='field-journal'?fieldJournalCafe.puff.greeting:puff.greeting;
 return `<figure class="style-preview-card" data-style-preview="${code}"><div class="cafe-counter-scene style-preview-scene"><aside class="cafe-guest"><h3>${esc(puff.name)}</h3><p>${esc(line)}</p></aside><aside class="cafe-ticket"><p class="cafe-ticket-top">ALMOST-RIGHT CAFÉ</p><p>“${esc(puff.wantedDish)}” is sold out.</p></aside></div><figcaption>${esc(name)}</figcaption></figure>`;
}
export function stylePanel(state){
 const current=styleOf(state);
 return `<section class="panel style-panel" aria-labelledby="style-panel-title"><h2 id="style-panel-title">${STYLE_COPY.heading}</h2><p>${STYLE_COPY.explanation}</p><form id="style-form"><fieldset><legend class="sr-only">${STYLE_COPY.heading}</legend>${STYLE_COPY.options.map(o=>`<label class="style-option"><input type="radio" name="style" value="${o.code}"${current===o.code?' checked':''}><span><strong>${o.name}</strong> · ${o.description}</span></label>`).join('')}</fieldset><button type="submit" class="secondary">${STYLE_COPY.button}</button></form><p id="style-status" role="status" tabindex="-1"></p><div class="style-preview" role="group" aria-label="${STYLE_COPY.caption}"><p class="tiny">${STYLE_COPY.caption}</p><div class="style-preview-pair">${STYLE_COPY.options.map(o=>previewCard(o.code,o.name)).join('')}</div></div></section>`;
}
// Returns the status line shown after a submit; the caller saves and re-renders only on 'saved'.
export function submitStyle(state,style){
 if(chooseStyle(state,style))return 'saved';
 return styleRefusal(state,style);
}
export function bindStylePanel(state,{save,render,focus}){
 document.querySelector('#style-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  const value=document.querySelector('#style-form input[name="style"]:checked')?.value;
  const result=submitStyle(state,value);
  if(result==='saved'){save();render();}
  const status=document.querySelector('#style-status');if(status)status.textContent=STYLE_COPY[result];
  focus('#style-status');
 });
}
// End of the look choice panel.
