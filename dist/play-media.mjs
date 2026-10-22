// Original food drawings, redundant quality symbols, and optional device-local speech.
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shapes={
 'moon-crunch':'<path d="M66 15A34 34 0 1 0 67 84Q35 81 31 51Q29 29 66 15" fill="#e9b84a"/><path d="m33 38 8 6m-15 15 10 1m4 18 9-5" stroke="#947628"/>',
 'comet-crisp':'<path d="m74 40-59-25 23 34-24 7 32 14Z" fill="#e9b84a"/><path d="m70 28 23 25-22 27-26-26Z" fill="#da8d8d"/><path d="m68 38 12 14-12 15-12-15Z" fill="#fffef9"/>',
 'cloud-puff':'<path d="M24 75Q5 70 14 52Q9 31 31 32Q37 10 56 27Q78 16 82 39Q105 46 86 69Q65 90 24 75Z" fill="#e2cf9f"/><path d="M24 54q8-13 18-5m13-13q13-2 14 11" fill="none" stroke="#fffef9" stroke-width="5"/>',
 'sun-swirl':'<circle cx="50" cy="51" r="32" fill="#e5a36f"/><path d="M48 30q29 0 23 25q-7 22-29 13q-18-8-10-23q8-14 23-8q14 7 3 17q-7 7-13-1" fill="none" stroke="#fff3cf" stroke-width="6"/>',
 'frost-snap':'<path d="m50 10 31 23 10 29-35 29-37-20-8-32Z" fill="#abc4da"/><path d="M50 22v56M24 40l50 25M25 66l48-28M43 28l7 7 8-7m-15 44 7-9 8 9" stroke="#fffef9" stroke-width="4" fill="none"/>',
 'rain-chip':'<path d="M49 12Q18 44 17 62Q15 91 49 91Q83 91 82 62Q78 39 49 12" fill="#b4a6c8"/><path d="m48 39-9 17 14 10-10 14" fill="none" stroke="#fffef9" stroke-width="5"/>',
 'mist-mallow':'<rect x="19" y="22" width="63" height="64" rx="22" fill="#b8d4c3"/><path d="M27 44q23-18 48 0M28 64q24 18 46-1" fill="none" stroke="#fffef9" stroke-width="5"/>',
 'dew-drop':'<path d="M50 12Q80 39 80 63A30 30 0 0 1 20 63Q20 39 50 12" fill="#90b9ae"/><path d="M37 40q-13 14-7 29" stroke="#fffef9" stroke-width="6" stroke-linecap="round" fill="none"/>',
 'star-berry':'<path d="m50 18 12 20 25 1-16 19 6 25-27-12-24 13 4-27-17-17 25-3Z" fill="#d47d8b"/><path d="M44 21q-3-18 14-15M41 19Q21 8 23 25q11 6 19-1" fill="#397958" stroke="#397958" stroke-width="3"/><g fill="#fff3cf"><circle cx="38" cy="47" r="3"/><circle cx="60" cy="49" r="3"/><circle cx="49" cy="62" r="3"/></g>',
 'spiral-pod':'<path d="M16 69Q8 24 41 17Q76 4 88 40Q106 78 65 87Q32 98 16 69" fill="#e9b84a"/><path d="M30 67Q13 34 45 30Q74 22 76 51Q79 76 50 74Q29 72 40 49Q48 35 59 48Q68 61 51 61" stroke="#8b643b" stroke-width="5" fill="none"/><path d="m74 18 7-12m-6 12 14 2" stroke="#397958" stroke-width="4"/>',
 'wobble-fruit':'<path d="M25 30Q50 8 77 30Q94 46 75 61Q94 87 53 91Q9 93 25 65Q9 49 25 30" fill="#b4a6c8"/><path d="M35 39q17-11 31 0M33 75q21 10 38-4" fill="none" stroke="#fffef9" stroke-width="5"/><path d="M51 21q-3-16 12-17" fill="none" stroke="#397958" stroke-width="5"/>'
};
export function foodArt(id,label='',phase=0){return `<svg class="food-art food-phase-${phase}" viewBox="0 0 100 105" ${label?`role="img" aria-label="${esc(label)}"`:'aria-hidden="true"'}><ellipse cx="50" cy="96" rx="35" ry="5" fill="#183f39" opacity=".1"/><g stroke="#183f39" stroke-width="1.5" stroke-linejoin="round">${shapes[id]||shapes['cloud-puff']}</g></svg>`;}
const symbols={warm:'☀',cold:'❄',crunchy:'ϟ',soft:'☁',sweet:'✿',tangy:'✧'};
export function qualityIcons(properties){return properties.map(p=>`<span class="quality-symbol"><span aria-hidden="true">${symbols[p]||'•'}</span> ${esc(p)}</span>`).join('');}
export function hearButton(text,label='Hear it',language='en'){return `<button type="button" class="hear-button secondary" data-speak-lang="${language==='fr'?'fr':'en'}" data-speak="${esc(text)}"><span aria-hidden="true">◖))</span> <span${language==='fr'?' lang="fr"':''}>${esc(label)}</span></button>`;}
let activeSpeech=null, selectedVoice='', speakingRate=1, removeVoiceListener=()=>{};
let removeSpeechRequestListener=()=>{};
const fractionWords={2:['half','halves'],3:['third','thirds'],4:['quarter','quarters'],5:['fifth','fifths'],6:['sixth','sixths'],8:['eighth','eighths'],10:['tenth','tenths'],12:['twelfth','twelfths']};
export function spoken(text,language='en'){
 if(language==='fr')return String(text);
 return String(text).replace(/__/g,' blank ').replace(/×/g,' times ').replace(/÷/g,' divided by ').replace(/−/g,' minus ').replace(/=/g,' equals ').replace(/(\d+(?:\.\d+)?)\s*cm\b/g,(_,n)=>`${n} centimeter${Number(n)===1?'':'s'}`).replace(/(\d+(?:\.\d+)?)\s*m\b/g,(_,n)=>`${n} meter${Number(n)===1?'':'s'}`).replace(/(\d+)-by-(\d+)/g,'$1 by $2').replace(/\b(\d+)\/(\d+)\b/g,(x,top,bottom)=>{const name=fractionWords[bottom];return name?`${top} ${name[top==='1'?0:1]}`:`${top} over ${bottom}`;}).replace(/ {2,}/g,' ').trim();
}
export const speechPreferences=()=>({voice:selectedVoice,rate:speakingRate});
export function setSpeechPreferences(p){stopSpeech();selectedVoice=typeof p?.voice==='string'?p.voice:'';speakingRate=[0.8,1,1.15].includes(p?.rate)?p.rate:1;}
function changedPreference(){document.dispatchEvent(new CustomEvent('garden-speech-preference',{detail:speechPreferences()}));}
export const localVoices=(voices,language='en')=>voices.filter(v=>v.localService===true&&(language==='fr'?/^fr(?:[-_]|$)/i:/^en(?:[-_]|$)/i).test(v.lang));
export const localEnglishVoices=voices=>localVoices(voices,'en');
const voiceKey=v=>v.voiceURI||`${v.name}|${v.lang}`;
export function chooseLocalVoice(voices,preferred='',language='en'){
 const local=localVoices(voices,language);
 if(preferred){
  const chosen=local.find(v=>voiceKey(v)===preferred);if(chosen)return chosen;
  // A known choice for the other passage language does not replace its voice.
  // An absent or nonlocal choice must never silently become a different voice.
  if(!localVoices(voices,language==='fr'?'en':'fr').some(v=>voiceKey(v)===preferred))return null;
 }
 const score=v=>(/premium|enhanced|natural|neural/i.test(v.name)?4:0)+(v.default?2:0);
 return local.reduce((best,v)=>!best||score(v)>score(best)?v:best,null);
}
export function stopSpeech(){
 if(activeSpeech){activeSpeech.onstart=null;activeSpeech.onend=null;activeSpeech.onerror=null;activeSpeech=null;
  document.querySelectorAll('.speech-playing').forEach(controls=>{controls.classList.remove('speech-playing');controls.querySelector('[data-speech-status]').textContent='Voice stopped. Tap a Hear button to listen again.';});
 }
 try{window.speechSynthesis?.cancel();}catch{}
}
export function resetSpeechPreferences(){stopSpeech();selectedVoice='';speakingRate=1;}
export function bindSpeech(){
 removeVoiceListener();removeVoiceListener=()=>{};
 removeSpeechRequestListener();removeSpeechRequestListener=()=>{};
 const buttons=[...document.querySelectorAll('[data-speak]')];if(!buttons.length)return;
 let controls=document.querySelector('.speech-controls');if(!controls){
  controls=document.createElement('div');controls.className='speech-controls';controls.hidden=true;
  controls.innerHTML=`<button type="button" class="text-button" data-stop-speech>Stop voice</button><span role="status" data-speech-status></span><details class="voice-settings"><summary>Voice &amp; speed</summary><label>Reading voice<select data-reading-voice aria-describedby="voice-availability"></select></label><p id="voice-availability" class="tiny" role="status" data-voice-availability></p><label>Reading speed<select data-reading-speed><option value="0.8">Slower</option><option value="1">Natural pace</option><option value="1.15">A little faster</option></select></label><button type="button" class="secondary" data-preview-voice>Try this voice</button><button type="button" class="text-button" data-refresh-voices>Refresh voice list</button><p class="tiny">Only voices this browser identifies as local for this passage’s language appear. Voice and speed belong to this explorer. Changing a system voice does not choose it here. If the browser plays a different sound from the named voice, stop and try another preview, or read together.</p><details><summary>Grown-ups: find and preview device voices</summary><ol class="tiny"><li>On Mac, open System Settings → Accessibility → Read &amp; Speak (Spoken Content on older versions) → System voice. On iPhone or iPad, open Settings → Accessibility → Read &amp; Speak (or Spoken Content) → Voices, then English or French.</li><li>Preview voices in those settings. If a free enhanced or premium download is offered, let it finish while online. You can also keep an installed voice; no purchase is needed.</li><li>Return here and choose Refresh voice list. If needed, reopen the browser or reload after saving or downloading your notes. Choose an available local voice above and tap Try this voice before reading.</li></ol><p class="tiny">Siri, Speak Screen and each browser may offer different voices. A downloaded system voice is not guaranteed to appear here. An unavailable saved choice stays selected until you choose another local voice or Automatic. Automatic names the local voice it will use; voice quality labels are not a guarantee. Without a local voice, read together. All activities work without audio.</p></details></details>`;
  document.querySelector('main').append(controls);
 }
 let activeLanguage='en';
 const languageName=()=>activeLanguage==='fr'?'French':'English';
 const speech=window.speechSynthesis,status=controls.querySelector('[data-speech-status]'),availability=controls.querySelector('[data-voice-availability]'),voiceSelect=controls.querySelector('[data-reading-voice]'),speedSelect=controls.querySelector('[data-reading-speed]');
 const voices=()=>{try{return speech?.getVoices?.()||[];}catch{return [];}};
 function refreshVoices(){
  const all=voices(),available=localVoices(all,activeLanguage),chosen=chooseLocalVoice(all,selectedVoice,activeLanguage),automaticVoice=chooseLocalVoice(all,'',activeLanguage),exact=available.some(v=>voiceKey(v)===selectedVoice),otherLanguage=!exact&&localVoices(all,activeLanguage==='fr'?'en':'fr').some(v=>voiceKey(v)===selectedVoice),missing=!!selectedVoice&&!exact&&!otherLanguage;
  voiceSelect.replaceChildren();
  const automatic=document.createElement('option');automatic.value='';automatic.textContent=`Automatic local ${languageName()}${automaticVoice?`: ${automaticVoice.name}`:''}`;voiceSelect.append(automatic);
  if(missing){const option=document.createElement('option');option.value=selectedVoice;option.textContent='Saved voice (unavailable in this browser)';voiceSelect.append(option);}
  for(const voice of available){const option=document.createElement('option');option.value=voiceKey(voice);option.textContent=`${voice.name} (${voice.lang})${voice.default?' (device default)':''}`;voiceSelect.append(option);}
  voiceSelect.value=exact||missing?selectedVoice:'';
  availability.textContent=missing?`Your saved voice is unavailable for ${languageName()} in this browser. Refresh after voices load, or choose another local voice or Automatic. We won’t switch to another voice without telling you.`:chosen?`${selectedVoice&&!exact?'Your saved choice is for the other language. This passage uses automatic local speech. ':''}${languageName()} voice to preview: ${chosen.name}.`:`${otherLanguage?'Your saved choice is for the other language and is kept. ':''}No local ${languageName()} voices are available yet. Refresh after voices load, or read together.`;
  voiceSelect.disabled=!available.length&&!selectedVoice;controls.querySelector('[data-preview-voice]').disabled=!chosen;
  return chosen;
 }
 function stopped(message){stopSpeech();controls.classList.remove('speech-playing');status.textContent=message;}
 controls.querySelector('[data-stop-speech]').onclick=()=>stopped('Voice stopped.');
 voiceSelect.onchange=()=>{selectedVoice=voiceSelect.value;changedPreference();stopped('Voice selected. Tap Try this voice to listen.');refreshVoices();};
 speedSelect.value=String(speakingRate);speedSelect.onchange=()=>{speakingRate=Number(speedSelect.value);changedPreference();stopped('Speed selected. Tap Try this voice to listen.');};
 controls.querySelector('[data-refresh-voices]').onclick=()=>{stopped('Voice list refreshed. Tap Try this voice to listen.');refreshVoices();};
 function speak(text,language=activeLanguage,origin=null){
  activeLanguage=language==='fr'?'fr':'en';
  stopped('');const voice=refreshVoices();
  if(!voice||!window.SpeechSynthesisUtterance){status.textContent=!voice?availability.textContent:'This browser cannot play local narration. Read together instead.';return false;}
  const utterance=new window.SpeechSynthesisUtterance(spoken(text,activeLanguage));utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=speakingRate;
  utterance.onstart=()=>{if(activeSpeech===utterance&&origin?.isConnected)origin.dispatchEvent(new CustomEvent('garden-speech-start',{bubbles:true}));};
  utterance.onend=()=>{if(activeSpeech!==utterance)return;activeSpeech=null;controls.classList.remove('speech-playing');status.textContent='Finished reading.';};
  utterance.onerror=()=>{if(activeSpeech!==utterance)return;activeSpeech=null;controls.classList.remove('speech-playing');status.textContent='This local voice could not play. Try another voice, or read together.';};
  activeSpeech=utterance;controls.classList.add('speech-playing');status.textContent=`${selectedVoice&&voiceKey(voice)!==selectedVoice?'Your saved choice is for the other language. ':''}Requested local voice: ${voice.name}. You can stop whenever you like.`;
  try{speech.speak(utterance);return true;}catch{utterance.onerror();return false;}
 }
 const requested=e=>{e.detail.accepted=speak(e.detail?.text||'',e.detail?.language||'en');};
 document.addEventListener('garden-speak-request',requested);
 removeSpeechRequestListener=()=>document.removeEventListener('garden-speak-request',requested);
 controls.querySelector('[data-preview-voice]').onclick=()=>speak(activeLanguage==='fr'?'Bienvenue à Paris. Que découvrons-nous aujourd’hui ?':'Welcome to the garden. What shall we discover together today?');
 refreshVoices();
 const voicesChanged=()=>{const voice=refreshVoices();if(!activeSpeech&&!controls.hidden)status.textContent=voice?'Voice list updated. Tap a Hear button or Try this voice to listen.':availability.textContent;};
 if(speech?.addEventListener){speech.addEventListener('voiceschanged',voicesChanged);removeVoiceListener=()=>speech.removeEventListener('voiceschanged',voicesChanged);}
 for(const button of buttons)button.addEventListener('click',()=>{
  controls.hidden=false;button.insertAdjacentElement('afterend',controls);speak(button.dataset.speak,button.dataset.speakLang||'en',button);
 });
}
