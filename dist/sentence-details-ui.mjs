import {detailCopy as copy,detailTeaching,detailModel,detailScenes} from './sentence-details-content.mjs';
import {detailsPresentation,detailsNarration} from './sentence-details-core.mjs';
import {hearButton} from './play-media.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const initialDetailsView=()=>({teachingOpen:false,modelOpen:false,teachingPage:0,modelPage:0,grownupOpen:false});
export const detailPage=(value,length)=>Number.isFinite(value)?Math.max(0,Math.min(length-1,Math.trunc(value))):0;
const button=(action,label,value='',pressed=null,disabled=false)=>`<button type="button" data-details-action="${action}" data-details-value="${esc(value)}"${pressed===null?'':` aria-pressed="${pressed}"`}${disabled?' disabled':''}>${esc(label)}</button>`;
const count=(label,n,total)=>`${esc(label)} ${n+1} of ${total}`;
// Original decorative schematics: all identifying facts also have visible captions.
function art(entity){
 const bodies={
 parcel:'<rect x="25" y="37" width="70" height="54" rx="5"/><path d="M60 37v54M25 48h70"/>',
 crate:'<rect x="22" y="37" width="76" height="54" rx="3"/><path d="M24 43h72M24 84h72M30 39v50M90 39v50"/>',
 courier:'<circle cx="60" cy="30" r="15"/><path d="M38 91V65q0-20 22-20t22 20v26M44 91v-21M76 91v-21"/>',
 gardener:'<circle cx="60" cy="30" r="15"/><path d="M38 91V65q0-20 22-20t22 20v26M44 91v-21M76 91v-21"/>',
 kitten:'<path d="M37 42 35 19l20 13h10l20-13-2 23q9 27-23 27T37 42Z"/><ellipse cx="60" cy="84" rx="26" ry="20"/><path d="M42 81v13M78 81v13"/><circle cx="49" cy="46" r="2"/><circle cx="71" cy="46" r="2"/>',
 bunny:'<ellipse cx="47" cy="26" rx="8" ry="23"/><ellipse cx="73" cy="26" rx="8" ry="23"/><ellipse cx="60" cy="55" rx="25" ry="22"/><ellipse cx="60" cy="89" rx="27" ry="17"/><path d="M42 84v13M78 84v13"/><circle cx="49" cy="53" r="2"/><circle cx="71" cy="53" r="2"/>',
 basket:'<path d="M23 54h74L87 96H33ZM37 54q0-45 23-45t23 45"/><path d="M27 65h66M30 78h60M44 56v37M76 56v37"/>',
 stool:'<path d="M23 52q37-12 74 0v12H23ZM34 64l-7 36M86 64l7 36M40 86h40"/>',
 lantern:'<path d="M44 25q0-26 16-26t16 26M32 36h56l-5 58H37ZM27 36l12-13h42l12 13M31 96h58"/>',
 boat:'<path d="M15 69h90L87 97H36ZM60 69V15l33 46H60"/>',
 book:'<path d="M18 29q24-9 42 3 18-12 42-3v68q-25-9-42 2-17-11-42-2ZM60 32v67"/>',
 map:'<path d="m15 31 30-7 30 9 30-7v67l-30 7-30-9-30 7ZM45 24v67M75 33v67"/>'
 };
 const marks={star:'<path d="m0-10 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z"/>',plain:'<rect x="-12" y="-8" width="24" height="16" rx="2"/>',stripes:'<rect x="-19" y="-5" width="38" height="12"/><path d="m-13-5 5 12m5-12 5 12m5-12 5 12"/>',empty:'',spoon:'<ellipse cx="0" cy="-8" rx="5" ry="8"/><path d="M0 0v18"/>',circle:'<circle r="10"/>',triangle:'<path d="m0-11 12 22h-24Z"/>',moon:'<path d="M5-12a13 13 0 1 0 0 24Q-9 0 5-12Z"/>',bridge:'<path d="M-14 10v-20M14 10v-20M-14-3q14 17 28 0M-16 6h32"/>'};
 const at=['courier','gardener'].includes(entity.kind)?'60 54':entity.kind==='bunny'?'82 84':entity.kind==='book'?'38 65':entity.kind==='map'?'59 64':entity.kind==='boat'?'60 83':'60 70';
 return `<svg viewBox="0 0 120 112" aria-hidden="true" focusable="false"><ellipse cx="60" cy="105" rx="43" ry="4" fill="#dce8dc" stroke="none"/><g fill="#fff9e9" stroke="#244d47" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${bodies[entity.kind]||''}<g transform="translate(${at})" fill="#f0c86e">${marks[entity.feature.icon]||''}</g></g></svg>`;
}
function sentence(p){return p.tokens.map((token,i)=>{
 if(token.detail)return '';
 const next=p.tokens[i+1];
 if(token.noun){const noun=`<span data-details-noun="${esc(token.noun)}">${esc(token.text)}</span>`;return next?.detail?`<span class="details-linked">${noun}<span data-details-clause>${esc(next.text)}</span></span>`:noun;}
 return esc(token.text);
 }).join('');}
export function detailsView(state,ui){
 const p=detailsPresentation(state),s=p.scene,index=detailScenes.findIndex(x=>x.id===s.id),teaching=detailPage(ui.teachingPage,detailTeaching.length),model=detailPage(ui.modelPage,detailModel.length),selected=s.entities.find(x=>x.id===p.anchor);
 const panel=(kind,label,page,items,prev,next)=>`<details data-details-panel="${kind}"${ui[kind+'Open']?' open':''}><summary>${esc(label)}</summary><h3 id="details-${kind}-title" tabindex="-1">${count(copy[kind+'Count'],page,items.length)}${kind==='model'?`: ${esc(items[page].title)}`:''}</h3><p>${esc(kind==='model'?items[page].text:items[page])}</p><div class="details-paging">${button(kind+'-prev',prev,'',null,page===0)}${button(kind+'-next',next,'',null,page===items.length-1)}</div></details>`;
 return `<p class="details-opening">${esc(copy.opening)}</p><div class="details-layout"><section class="details-scene"><h2 id="details-scene-title" tabindex="-1">${esc(copy.scene)}: ${esc(s.title)}</h2><div class="details-picture">${s.entities.map(e=>`<figure id="details-figure-${esc(e.id)}" tabindex="-1" data-details-entity="${esc(e.id)}"${p.anchor===e.id?' class="details-described"':''}>${art(e)}<figcaption><strong>${esc(e.label)}</strong><span>${esc(e.feature.text)}</span></figcaption></figure>`).join('')}</div><p>${esc(s.context)}</p><p class="details-scene-notice">${esc(copy.sceneNotice)}</p><aside class="details-purpose"><h3>${esc(copy.purpose)}</h3><p>${esc(s.purpose)}</p></aside><p>${count(copy.sceneCount,index,detailScenes.length)}</p><div class="details-paging">${button('scene-prev',copy.previousScene,'',null,index===0)}${button('scene-next',copy.nextScene,'',null,index===detailScenes.length-1)}</div></section><section class="details-work"><h2>${esc(copy.detail)}</h2><p class="details-paper">${esc(s.clause)}</p><div class="details-attachments">${s.entities.map(e=>button('attach',`${copy.attach} ${e.label}`,e.id,p.anchor===e.id)).join('')}</div><h2 id="details-sentence-title" tabindex="-1">${esc(copy.sentence)}</h2><p data-details-sentence class="details-sentence">${sentence(p)}</p>${selected?`<p class="details-link"><span aria-hidden="true">↳ </span>${esc(copy.pointsTo)}: <a href="#details-figure-${esc(selected.id)}" data-details-link="${esc(selected.id)}">${esc(selected.label)}</a></p>`:`<p>${esc(copy.noDetail)}</p><p>${esc(copy.leftWaiting)}</p>`}<div class="details-notes"><section><h3>${esc(copy.meaning)}</h3><p>${esc(p.meaning)}</p></section>${p.anchor?`<section><h3>${esc(copy.sceneNote)}</h3><p>${esc(p.sceneNote)}</p></section><section><h3>${esc(copy.purposeNote)}</h3><p>${esc(p.purposeNote)}</p></section>`:''}</div><div class="details-edits">${button('remove',copy.remove,'',null,!p.anchor)}${!p.anchor?`<p>${esc(copy.noDetail)}</p>`:''}${button('undo',copy.undo,'',null,!p.canUndo)}${!p.canUndo?`<p>${esc(copy.noUndo)}</p>`:''}</div>${hearButton(detailsNarration(state,ui),copy.hear)}${panel('teaching',copy.teaching,teaching,detailTeaching,copy.previousTeaching,copy.nextTeaching)}${panel('model',copy.model,model,detailModel,copy.previousModel,copy.nextModel)}<p>${esc(copy.returnPrompt)}</p><details data-details-panel="grownup"${ui.grownupOpen?' open':''}><summary>${esc(copy.grownupLabel)}</summary><p>${esc(copy.grownup)}</p></details></section></div><p class="details-visit">${esc(copy.visit)}</p>`;
}
