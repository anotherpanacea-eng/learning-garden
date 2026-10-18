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
export function hearButton(text,label='Hear it'){return `<button type="button" class="hear-button secondary" data-speak="${esc(text)}"><span aria-hidden="true">◖))</span> ${esc(label)}</button>`;}
let activeSpeech=null, selectedVoice='', speakingRate=1, removeVoiceListener=()=>{};
export const localEnglishVoices=voices=>voices.filter(v=>v.localService===true&&/^en(?:[-_]|$)/i.test(v.lang));
const voiceKey=v=>v.voiceURI||`${v.name}|${v.lang}`;
export function chooseLocalVoice(voices,preferred=''){
 const local=localEnglishVoices(voices);
 const score=v=>(/premium|enhanced|natural|neural/i.test(v.name)?4:0)+(v.default?2:0);
 return local.find(v=>voiceKey(v)===preferred)||local.reduce((best,v)=>!best||score(v)>score(best)?v:best,null);
}
export function stopSpeech(){if(activeSpeech){activeSpeech.onend=null;activeSpeech.onerror=null;activeSpeech=null;}try{window.speechSynthesis?.cancel();}catch{}}
export function resetSpeechPreferences(){stopSpeech();selectedVoice='';speakingRate=1;}
export function bindSpeech(){
 removeVoiceListener();removeVoiceListener=()=>{};
 const buttons=[...document.querySelectorAll('[data-speak]')];if(!buttons.length)return;
 let controls=document.querySelector('.speech-controls');if(!controls){
  controls=document.createElement('div');controls.className='speech-controls';controls.hidden=true;
  controls.innerHTML=`<button type="button" class="text-button" data-stop-speech>Stop voice</button><span role="status" data-speech-status></span><details class="voice-settings"><summary>Voice &amp; speed</summary><label>Reading voice<select data-reading-voice></select></label><label>Reading speed<select data-reading-speed><option value="0.8">Slower</option><option value="1">Natural pace</option><option value="1.15">A little faster</option></select></label><button type="button" class="secondary" data-preview-voice>Try this voice</button><p class="tiny">Choose a voice you enjoy. Choices last until this page is refreshed. Only local English voices offered by this browser appear here.</p><details><summary>Better voices on iPad</summary><p class="tiny">In iPad Settings, open Accessibility, then Spoken Content (or Read &amp; Speak), then Voices → English. Download an enhanced or premium voice if offered, then reopen this page. Safari may offer a different selection from Siri or Speak Screen.</p></details></details>`;
  document.querySelector('main').append(controls);
 }
 const speech=window.speechSynthesis,status=controls.querySelector('[data-speech-status]'),voiceSelect=controls.querySelector('[data-reading-voice]'),speedSelect=controls.querySelector('[data-reading-speed]');
 const voices=()=>{try{return speech?.getVoices?.()||[];}catch{return [];}};
 function refreshVoices(){
  const available=localEnglishVoices(voices()),chosen=chooseLocalVoice(available,selectedVoice);
  voiceSelect.replaceChildren();
  for(const voice of available){const option=document.createElement('option');option.value=voiceKey(voice);option.textContent=`${voice.name} (${voice.lang})${voice.default?' — device default':''}`;voiceSelect.append(option);}
  if(chosen)voiceSelect.value=voiceKey(chosen);
  else{const option=document.createElement('option');option.textContent='No local English voices available';voiceSelect.append(option);}
  voiceSelect.disabled=!chosen;controls.querySelector('[data-preview-voice]').disabled=!chosen;
 }
 function stopped(message){stopSpeech();controls.classList.remove('speech-playing');status.textContent=message;}
 controls.querySelector('[data-stop-speech]').onclick=()=>stopped('Voice stopped.');
 voiceSelect.onchange=()=>{selectedVoice=voiceSelect.value;stopped('Voice selected. Tap Try this voice to listen.');};
 speedSelect.value=String(speakingRate);speedSelect.onchange=()=>{speakingRate=Number(speedSelect.value);stopped('Speed selected. Tap Try this voice to listen.');};
 function speak(text){
  stopped('');refreshVoices();const voice=chooseLocalVoice(voices(),selectedVoice);
  if(!voice||!window.SpeechSynthesisUtterance){status.textContent='A local English voice is not available yet. Try Hear again after voices load, or read together.';return;}
  const utterance=new window.SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=speakingRate;
  utterance.onend=()=>{if(activeSpeech!==utterance)return;activeSpeech=null;controls.classList.remove('speech-playing');status.textContent='Finished reading.';};
  utterance.onerror=()=>{if(activeSpeech!==utterance)return;activeSpeech=null;controls.classList.remove('speech-playing');status.textContent='This local voice could not play. Try another voice, or read together.';};
  activeSpeech=utterance;controls.classList.add('speech-playing');status.textContent=`Reading with ${voice.name}. You can stop whenever you like.`;
  try{speech.speak(utterance);}catch{utterance.onerror();}
 }
 controls.querySelector('[data-preview-voice]').onclick=()=>speak('Welcome to the garden. What shall we discover together today?');
 refreshVoices();
 if(speech?.addEventListener){speech.addEventListener('voiceschanged',refreshVoices);removeVoiceListener=()=>speech.removeEventListener('voiceschanged',refreshVoices);}
 for(const button of buttons)button.addEventListener('click',()=>{
  controls.hidden=false;button.insertAdjacentElement('afterend',controls);speak(button.dataset.speak);
 });
}
