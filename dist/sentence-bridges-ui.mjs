import {bridgeScenes,bridgeScene,bridgeWords,bridgeOpening,bridgeTeaching} from './sentence-bridges-content.mjs';
import {initialBridges,changeBridges,bridgesPresentation,bridgesNarration,bridgesAnnouncement} from './sentence-bridges-core.mjs';
import {hearButton,stopSpeech,bindSpeech} from './play-media.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let session=null,owner=null;
export function resetBridgesSession(){session=null;owner=null;}
function current(id){if(owner!==id||!session){session=initialBridges();owner=id;}return session;}
const button=(action,value,label,selected=false,disabled=false)=>`<button type="button" data-bridges-action="${action}" data-bridges-value="${value}"${['scene','word'].includes(action)?` aria-pressed="${selected}"`:''}${disabled?' disabled':''}>${selected?'<span aria-hidden="true">✓ </span>':''}${esc(label)}</button>`;
function view(s){const c=bridgeScene(s.caseId),p=bridgesPresentation(s);return `<header><a href="#loft">Story Loft</a><h1>Sentence Bridges</h1><p>${esc(bridgeOpening)}</p></header><div class="bridges-layout"><section class="bridges-source"><h2>Our scene</h2><h3>${esc(c.title)}</h3><p>${esc(c.context)}</p><p><strong>Purpose:</strong> ${esc(c.purpose)}</p><h2>Choose a scene</h2><div class="bridges-scenes">${bridgeScenes.map(x=>button('scene',x.id,x.label,s.caseId===x.id)).join('')}</div><p>Another scene starts its two separate sentences. This visit is not saved.</p></section><section class="bridges-trial"><h2>Choose a joining word</h2><div class="bridges-words">${bridgeWords.map(w=>button('word',w,w,s.bridge===w)).join('')}</div><div class="bridges-assembly" aria-label="Supplied sentence strips"><p class="bridges-strip"><span class="bridges-id">${p.strips[0].id}</span> ${esc(p.strips[0].text)}</p>${s.bridge?`<div class="bridges-span">${esc(s.bridge)}</div>`:'<div class="bridges-gap" aria-hidden="true"></div>'}<p class="bridges-strip"><span class="bridges-id">${p.strips[1].id}</span> ${esc(p.strips[1].text)}</p></div><h2 id="bridges-trial-title" tabindex="-1">Sentence we are trying</h2><p class="bridges-output">${esc(p.trial)}</p><aside class="bridges-meaning"><h2>Meaning to notice</h2><p>${esc(p.meaning)}</p></aside><div class="bridges-edits">${button('swap','','Swap sentence order')}${button('separate','','Separate sentences',false,!s.bridge)}${!s.bridge?'<p>The sentences are already separate.</p>':''}${button('undo','','Undo last change',false,!s.previous)}${!s.previous?'<p>No change to undo.</p>':''}</div>${hearButton(bridgesNarration(s),'Hear this trial')}<details class="bridges-teaching"><summary>What do these joining words do?</summary><p>${esc(bridgeTeaching)}</p><p>Here each starting strip has a subject and a verb.</p></details><details class="bridges-talk"><summary>Talk together</summary><p>Which words came from our scene? What connection does your joining word add? What would need to change in the scene for another reading to fit?</p></details></section></div><footer><a href="#loft">Return to Story Loft</a><a href="#post/messages">Try a message for a reader</a><a href="#post/instructions">Try an instruction strip</a></footer>`;}
export function bridgesEntry(){return '<p class="bridges-entry"><a class="secondary" href="#loft/bridges">Sentence Bridges: keep the scene, change the relation</a></p>';}
export function bridgesPage(explorerId){return `<section class="bridges-page"><div data-bridges-view>${view(current(explorerId))}</div><p id="bridges-status" role="status" aria-live="polite"></p></section>`;}
export function bindBridges({explorerId,focus}){
 const root=document.querySelector('.bridges-page');if(!root)return;
 const capturedOwner=explorerId(),capturedSession=current(capturedOwner);
 const live=()=>root.isConnected&&document.querySelector('.bridges-page')===root&&location.hash==='#loft/bridges'&&explorerId()===capturedOwner&&owner===capturedOwner&&session===capturedSession;
 root.querySelectorAll('[data-bridges-action]').forEach(b=>b.addEventListener('click',()=>{
  if(!live())return;const action=b.dataset.bridgesAction,next=changeBridges(session,action,b.dataset.bridgesValue);if(!next)return;
  const teaching=root.querySelector('.bridges-teaching').open,talk=root.querySelector('.bridges-talk').open;
  stopSpeech();session=next;root.querySelector('[data-bridges-view]').innerHTML=view(session);
  root.querySelector('.bridges-teaching').open=teaching;root.querySelector('.bridges-talk').open=talk;
  bindBridges({explorerId,focus});bindSpeech();
  root.querySelector('#bridges-status').textContent=bridgesAnnouncement(session,action);
  focus(action==='word'?`[data-bridges-action="word"][data-bridges-value="${session.bridge}"]`:action==='scene'?`[data-bridges-action="scene"][data-bridges-value="${session.caseId}"]`:action==='swap'?'[data-bridges-action="swap"]':'#bridges-trial-title');
 }));
 root.querySelectorAll('[data-speak]').forEach(b=>b.addEventListener('click',e=>{if(!live()){e.preventDefault();e.stopImmediatePropagation();return;}b.dataset.speak=bridgesNarration(session);},{capture:true}));
}
