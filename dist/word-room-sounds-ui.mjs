import {soundMessageCopy as T,marketSoundCopy as M,gardenSoundCopy as G,deliverySoundCopy as D} from './word-room-sounds-content.mjs';
import {soundMessagesView,enterSoundMessages,leaveSoundMessages,chooseSoundCase,actSoundCase,currentComparison,soundKeep,soundPackets,soundPacketField} from './word-room-sounds-core.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,extra='')=>`<button type="button" data-wrs-action="${action}" ${extra}>${esc(label)}</button>`;
const names=['First place','Middle place','Last place'];
const copyFor=pack=>pack==='delivery'?D:pack==='garden'?G:pack==='market'?M:T;
const noteButton=pack=>pack==='delivery'?D.noteButton:pack==='garden'?G.noteButton:pack==='market'?"Read Dot's market note":'Read the show message';
const noteHeading=pack=>pack==='delivery'?D.noteHeading:pack==='garden'?G.noteHeading:'The show message';
const path={
  jet348:'<path d="m36 108 100-18 55-53 27 1-25 47 67 8 21 17-103 15-44 44-24-1 30-45-75 3Z" fill="#b6cecc"/><path d="m70 98-17-32 24 2 27 29m76 12 39-1" fill="#69a7ab"/><ellipse cx="187" cy="115" rx="23" ry="12" fill="#dfb553"/><ellipse cx="210" cy="115" rx="8" ry="12" fill="#183430"/>',
  kit348:'<path d="M57 93h207v75H57Z" fill="#dfb553"/><path d="m57 93 13-52h180l14 52" fill="#ba865e"/><path d="M132 41V27h60v14" fill="none" stroke-width="7"/><path d="M80 68h58v55H80Z" fill="#8db9ad"/><path d="M87 76h43v39H87Z" fill="none" stroke-dasharray="4 5"/><path d="M167 65v65m-16-65h32m-32 65h32" fill="none" stroke="#fffdf3" stroke-width="10"/><path d="m211 72 24 52m-18-64 17-8 12 21-12 15Z" fill="#b6cecc"/><path d="M139 145h47" stroke-width="6"/>',
  van348:'<path d="M28 59h174l19 23h47l27 43v35H28Z" fill="#69a7ab"/><path d="M39 72h151v68H39Z" fill="#fffdf3"/><path d="M221 94h39l19 32h-58Z" fill="#b6cecc"/><path d="M205 84v65m18-13h11" fill="none"/><circle cx="77" cy="160" r="22" fill="#183430"/><circle cx="77" cy="160" r="10" fill="#dfb553"/><circle cx="250" cy="160" r="22" fill="#183430"/><circle cx="250" cy="160" r="10" fill="#dfb553"/>',
  zip348:'<path d="M18 66h115v98H18Zm169 0h115v98H187Z" fill="#dfb553"/><ellipse cx="75" cy="67" rx="56" ry="17" fill="#183430"/><path d="M43 62V41h64v21m167 4V41h-63v25" fill="none" stroke-width="7"/><path d="M191 68h106" stroke="#183430" stroke-width="6"/><path d="M198 63v10m10-10v10m10-10v10m10-10v10m10-10v10m10-10v10m10-10v10m10-10v10m10-10v10" stroke="#fffdf3" stroke-width="3"/><rect x="284" y="60" width="10" height="20" rx="3" fill="#69a7ab"/><path d="M144 108h30m-8-8 8 8-8 8" fill="none" stroke="#397958" stroke-width="4"/>',
  jot348:'<path d="M20 57h109v99H20Zm171 0h129v99H171Z" fill="#fffdf3"/><path d="m32 70 81-14m-78 27 73-14" fill="none" stroke="#fffdf3"/><path d="m270 34-36 69 12 7 39-70Z" fill="#dfb553"/><path d="m234 103-3 16 15-9" fill="#ba865e"/><path d="m190 92 10-7 10 8 8-7m-29 24 10-6 11 7 11-6" fill="none" stroke="#183430"/><path d="M140 108h21m-8-8 8 8-8 8" fill="none" stroke="#397958" stroke-width="4"/>',
  vat348:'<path d="M55 161h219v20H55Z" fill="#ba865e"/><path d="M80 58h170l-15 100H95Z" fill="#b6cecc"/><ellipse cx="165" cy="58" rx="85" ry="24" fill="#fffdf3"/><ellipse cx="165" cy="58" rx="70" ry="15" fill="#69a7ab"/><path d="m104 89 7 54m115-54-7 54" fill="none"/>',
  ram347:'<path d="M79 119q-22-18 0-32-8-24 18-25 11-24 30-7 22-16 36 8 27-3 24 24 22 19 0 34 3 23-23 25-15 20-35 2-25 14-38-8Z" fill="#fffdf3"/><path d="M97 142v31m59-28v28" fill="none" stroke-width="8"/><ellipse cx="201" cy="91" rx="38" ry="44" fill="#ba865e"/><path d="M171 59q-38-32-43 0-2 26 25 23 17-3 4-20m68-4q34-32 43 0 6 25-22 25-17-1-5-21" fill="#dfb553"/><circle cx="191" cy="88" r="4"/><circle cx="217" cy="88" r="4"/><path d="m200 103 6 5 6-5m-6 5v10" fill="none"/><path d="M94 174h72" stroke="#397958" stroke-width="7"/>',
  lip347:'<ellipse cx="158" cy="96" rx="77" ry="77" fill="#e7bd91"/><circle cx="133" cy="70" r="5"/><circle cx="184" cy="70" r="5"/><path d="m157 79-10 22h17" fill="none"/><path d="M122 119q35-13 71 0-36 37-71 0Z" fill="#ba6861"/><path d="M126 123q33 12 63 0" fill="none"/><path d="m246 167-58-26m8-6-8 6 1 9" fill="none" stroke="#397958" stroke-width="5"/>',
  wet347:'<path d="m65 66 172 4 17 97-184 2Z" fill="#8db9ad"/><path d="m78 79 142 4m-136 67 146-1m-132-59 4 49m121-48 5 47" fill="none" stroke="#5d9489"/><ellipse cx="164" cy="173" rx="111" ry="13" fill="#a9d5e6"/><path d="M116 67q-18 24 0 24t0-24m70 36q-18 24 0 24t0-24m47-70q-17 24 0 24t0-24" fill="#69a7ab"/>',
  yam347:'<path d="M67 131Q67 89 121 87q50-28 100-23l27 22q-28 35-65 42-68 40-116 3Z" fill="#9d7852"/><path d="m93 112 14 2m19-16 12 4m28-7 15 3m-32 19 13 2m32-37 10 4m-94 44 12 1" fill="none" stroke="#6b4b35"/><ellipse cx="232" cy="78" rx="18" ry="24" transform="rotate(-25 232 78)" fill="#f9e9ba"/>',
  rod347:'<path d="M81 143v30m148-50v50" stroke="#397958" stroke-width="8"/><path d="m39 133 236-44 5 16-238 44Z" fill="#ba865e"/><path d="m48 138 219-41" fill="none" stroke="#dfb553"/>',
  pan343:'<ellipse cx="138" cy="133" rx="91" ry="25" fill="#72a4a7"/><path d="M47 130q12 48 91 48t91-48" fill="#b6cecc"/><path d="m224 132 69-24 8 15-72 27" fill="#ba865e"/>',
  pen343:'<path d="m117 153 45-112 23 10-45 112-25 20Z" fill="#69a7ab"/><path d="m117 153 23 10-25 20Z" fill="#dfb553"/><path d="m159 48 25 11m-52 81 23 10" fill="none"/>',
  cup343:'<path d="M76 75h141v68q-6 42-70 42-66 0-71-42Z" fill="#f9e9ba"/><ellipse cx="146" cy="75" rx="70" ry="17" fill="#fffdf3"/><path d="M219 91q63-8 54 42-5 24-54 19m0-43q37-5 35 17-2 10-35 11" fill="#dfb553"/>',
  bed343:'<path d="M42 95h232v69H42Z" fill="#8db9ad"/><path d="M42 46v134m232-102v102m-232-20h232" stroke-width="9"/><path d="M54 76h75v42H54Z" fill="#fffdf3"/><path d="M134 92h129v61H134Z" fill="#dfb553"/>',
  bud343:'<path d="M159 99v79m0-27q-52 4-58-31 42-6 58 31m0-12q42 6 53-24-40-6-53 24" fill="#8db9ad"/><path d="M159 32q-57 27-24 71l24 14 25-15q32-43-25-70Z" fill="#dba1a0"/><path d="m135 103 24 14 25-15m-25 15V57" fill="none"/>',
  bag343:'<path d="m114 45 39 8 40-8-9 34q52 46 42 86-61 29-125 0-9-40 29-86Z" fill="#dfb553"/><path d="m128 78 58 1m-33 1-16 60m31-60 17 54" fill="none"/><path d="m125 77-22 19m80-16 21 13" fill="none" stroke="#397958" stroke-width="6"/>',
  bug343:'<path d="m127 86-34-14m31 35-35 4m41 17-29 24m93-66 34-14m-31 35 35 4m-41 17 29 24" fill="none" stroke-width="6"/><ellipse cx="160" cy="112" rx="45" ry="53" fill="#b44e40"/><circle cx="160" cy="64" r="23" fill="#183430"/><path d="m146 49-13-17m39 17 15-17M160 89v75" fill="none"/><circle cx="141" cy="113" r="7"/><circle cx="180" cy="130" r="7"/>',
  hen343:'<path d="m67 132-22-38 45 11q42-44 82-9V67q27-20 43 1v47q3 60-69 65-68-2-79-48Z" fill="#ba865e"/><path d="m215 80 30 13-30 10" fill="#dfb553"/><circle cx="198" cy="77" r="4"/><path d="m136 180-5 13m27-14 4 14m-29-69q-4 29 37 28" fill="none"/>',
  cub343:'<ellipse cx="159" cy="144" rx="51" ry="40" fill="#ba865e"/><circle cx="119" cy="55" r="18" fill="#ba865e"/><circle cx="196" cy="55" r="18" fill="#ba865e"/><ellipse cx="159" cy="82" rx="53" ry="42" fill="#ba865e"/><ellipse cx="159" cy="97" rx="24" ry="17" fill="#f9e9ba"/><circle cx="140" cy="78" r="4"/><circle cx="179" cy="78" r="4"/><path d="m151 90 8 8 8-8Z" fill="#183430"/><ellipse cx="127" cy="176" rx="22" ry="11" fill="#dfb553"/><ellipse cx="191" cy="176" rx="22" ry="11" fill="#dfb553"/>',
  cap342:'<path d="M270 50v130m0-65h-65" fill="none" stroke="#ba865e" stroke-width="10"/><path d="M71 115q1-64 83-64 73 0 81 64Z" fill="#dfb553"/><path d="M73 114q-26 11-35 32 77 8 151-16l45-15" fill="#69a7ab"/><path d="M152 53v58m-40-48q-16 22-17 48" fill="none"/>',
  cot342:'<path d="m44 105 204-25 25 43-203 26Z" fill="#8db9ad"/><path d="m49 105 20 55m-7-8 183-23m-9-48 13 65M68 147l-13 23m193-44 19 25" fill="none" stroke-width="7"/><path d="m65 102 48-6 11 25-49 6Z" fill="#fffdf3"/>',
  map342:'<path d="m53 61 66-17 76 18 67-16v111l-67 16-76-18-66 17Z" fill="#f9e9ba"/><path d="M119 45v109m76-92v110" fill="none"/><path d="m76 132 49-28 49 16 63-41" fill="none" stroke="#b44e40" stroke-width="4" stroke-dasharray="6 6"/><path d="m215 100 12-23 13 19m-17-10v25" fill="none" stroke="#397958" stroke-width="5"/><path d="m146 81 15-13 16 14v17h-31Z" fill="#69a7ab"/>',
};
const svg=(body,alt,cls='',viewBox='0 0 320 200')=>`<svg class="wrs-picture ${cls}" viewBox="${viewBox}" role="img" aria-label="${esc(alt)}"><path d="M8 10h304v180H8Z" fill="#eaf4ef"/><path d="M8 174h304v16H8Z" fill="#ba865e"/><g stroke="#183430" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
const picture=(w,oldPicture)=>Object.hasOwn(path,w.art)?svg(path[w.art],w.alt):oldPicture(w,true);
function messagePicture(m){
 if(m.art==='delivery-message348'&&typeof m.alt==='string'&&m.alt&&m.alt.length<=4000)return svg(`<g transform="translate(0 97) scale(.5)">${path.van348}</g><g transform="translate(16 125) scale(.24)">${path.jet348}</g><g transform="translate(119 135) scale(.22)">${path.kit348}</g><g transform="translate(155 117) scale(.33)">${path.vat348}</g><path d="m247 109-8-36 18 9 16-3 20-14-1 44-21 18Z" fill="#ce8857"/><path d="m246 106 25 14 19-16-14-3-7 8-10-8Z" fill="#fff3db"/><circle cx="256" cy="98" r="2"/><circle cx="280" cy="96" r="2"/><path d="m264 107 6 5 5-6Z" fill="#183430"/><path d="M252 122q17-9 32 0l6 45h-41Z" fill="#ce8857"/><path d="M255 167v7m28-7v7" stroke-width="5"/><path d="m250 145-19 5m56-3 13 13" fill="none" stroke-width="6"/><path d="m224 145 22 8-5 9-21-8Z" fill="#dfb553"/><path d="M216 157h41v20h-41Z" fill="#fffdf3"/><path d="m223 165 4-3 4 3 6-2m-14 8 6-3 5 3" fill="none" stroke-width="1.5"/><path d="M284 173h25v14h-25Z" fill="#dfb553"/><path d="M285 174h23m-20-1v3m5-3v3m5-3v3m5-3v3" stroke-width="1.5"/><path d="m288 173 3-7h11l3 7" fill="none" stroke-width="2"/>`,m.alt,'wrs-message-picture','0 55 320 145');
 if(m.art==='garden-message347'&&typeof m.alt==='string'&&m.alt&&m.alt.length<=4000)return svg(`<path d="m10 165 83-7 18 28-86 5Z" fill="#dfb553"/><path d="m20 170 72-6m-67 13 72-6m-69 13 72-6m-70-15 10 24m7-26 10 24m8-25 9 24m8-25 9 24" fill="none" stroke="#a47843" stroke-width="1.5"/><g transform="translate(-9 127) scale(.32)">${path.yam347}</g><g transform="translate(68 40) scale(.72)">${path.ram347}</g><path d="m119 127 107-29 4 13-106 29Z" fill="#b44e40"/><path d="m157 128 6 6 8-9" fill="none" stroke="#ba865e" stroke-width="7"/><g transform="translate(239 123) scale(.25)">${path.cup343}</g><path d="M265 150q-6 8 0 8t0-8m18 9q-6 8 0 8t0-8m7-21q-6 8 0 8t0-8" fill="#69a7ab"/>`,m.alt,'wrs-message-picture','0 50 320 150');
 if(m.art==='market-message343' &&typeof m.alt==='string'&&m.alt&&m.alt.length<=4000)return svg(`<g transform="translate(-20 60) scale(.5)">${path.bud343}</g><g transform="translate(35 78) scale(.15)">${path.bug343}</g><g transform="translate(105 80) scale(.42)">${path.pen343}</g><g transform="translate(90 105) scale(.45)">${path.cup343}</g><ellipse cx="265" cy="179" rx="45" ry="11" fill="#dfb553"/><g transform="translate(195 87) scale(.45)">${path.cub343}</g>`,m.alt,'wrs-message-picture');
 if(m.art!=='show-message342'||typeof m.alt!=='string'||!m.alt||m.alt.length>4000)return `<p>Picture unavailable. ${typeof m.alt==='string'&&m.alt.length<=4000?esc(m.alt):'Read the note together.'}</p>`;
 return svg('<ellipse cx="69" cy="167" rx="49" ry="14" fill="#dfb553"/><ellipse cx="73" cy="147" rx="26" ry="22" fill="#a8a6b0"/><path d="m46 128 5-17 15 12 16-8 9 21Z" fill="#a8a6b0"/><circle cx="60" cy="132" r="2"/><circle cx="78" cy="132" r="2"/><path d="M97 159q38 3 20-31" fill="none" stroke-width="7"/><path d="m140 89 115-9 23 37-115 10Z" fill="#8db9ad"/><path d="m146 94 17 54m92-67 14 54m-108-8-13 23m121-32 13 23" fill="none" stroke-width="6"/><path d="M169 86q5-28 30-28 23 0 25 27l-34 6Z" fill="#dfb553"/><path d="m169 85-18 13 40-7" fill="#69a7ab"/><path d="M230 149h64v31q-31 11-64 0Z" fill="#b7c9ca"/><ellipse cx="262" cy="149" rx="32" ry="9" fill="#dfe9e4"/><path d="m250 150-2-43 18-8 11 49" fill="#f9e9ba"/><path d="m255 113 14 16m-15 3 15-3" fill="none" stroke="#b44e40"/>',m.alt,'wrs-message-picture');
}
function icon(position,show=false){return `<span class="wrs-icon${show?' wrs-show-label':''}" aria-hidden="true">${[0,1,2].map(i=>`<span class="${i===position?'wrs-changed':''}">${i+1}</span>`).join('')}</span>`;}
function chooser(v){
 return `<h2 id="wr-task" tabindex="-1">Choose a label game</h2><p>${esc(copyFor(v.pack).story)}</p><p>${esc(T.chooser)}</p>${v.teaching.length?button('letters',M.letters,'class="wr-primary"'):''}<div class="wrs-cases">${v.cases.map(x=>x.source?`<article>${icon(x.source.position,x.id==='show')}<h3>${esc(x.source.title)}</h3>${x.earlier?'<p>Earlier label</p>':''}<div class="wrs-modes">${['listen','read'].map(mode=>`<button type="button" data-wrs-case="${esc(x.id)}" data-wrs-mode="${mode}">${mode==='listen'?'Listen and build':'Look and read'}</button>`).join('')}</div></article>`:`<article><p>${esc(T.unavailable)}</p></article>`).join('')}</div>${v.complete?'<p class="wr-ready">Our labels are ready to revisit. What shall we read together?</p>':''}`;
}
function keeps(w){
 return `<details class="wrs-keeps"><summary>Our kept labels</summary>${[['firstKept','First kept label','restoreFirst'],['latestKept','Latest kept label','restoreLatest']].map(([key,title,action])=>{
  if(!Object.hasOwn(w,key))return '';
  const k=w[key];return soundKeep(k)?`<div class="wrs-kept"><h3>${title}</h3><p class="wrs-kept-letters">${k.slots.map(l=>esc(l??'empty')).join(' · ')}</p>${button(action,'Use these kept letters')}</div>`:`<p>${esc(T.unavailable)}</p>`;
 }).join('')||'<p>No label kept yet.</p>'}</details>`;
}
const status=()=>'<p id="wr-status" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p>';
function keptFeedback(w){
 const k=w.latestKept;if(!soundKeep(k))return '';
 return `<p class="wrs-kept-feedback" id="wrs-kept-feedback" tabindex="-1"><strong>Latest kept label: ${k.slots.map(l=>esc(l??'empty')).join(' · ')}</strong><br>${esc(T.kept)}</p>`;
}
const wordLabel=w=>`<p class="wrs-whole-word" data-wrs-word>${esc(w.label)}</p>`;
function pairView(w){
 const p=w.page==='example'?w.source.example:w.source;
 return `<h2 id="wr-task" tabindex="-1">${esc(w.page==='example'?p.title:'Change one sound')}</h2>${w.page==='example'?'<p>Three sound places</p>':''}<div class="wrs-pair">${[p.left,p.right].map((word,side)=>`<div class="${w.frame===(side===0?0:2)?'wrs-current-side':''}" aria-label="${esc(word.label)}: three letter places"><div class="wrs-print-places">${word.letters.map((l,i)=>`<span class="${w.frame===1&&i===p.position?'wrs-changed':''}">${esc(l)}</span>`).join('')}</div></div>`).join('')}</div><p class="wrs-step" data-wrs-step>${esc(p.frames[w.frame])}</p>${keptFeedback(w)}<div class="wr-actions">${button('prev','Previous step',w.frame===0?'disabled':'')}${button('next','Next step',w.frame===2?'disabled':'')}${button('back','Back to my label')}</div>`;
}
function work(w,oldPicture){
 const disclosed=w.page==='partner'?w.help.partnerCard:w.page==='contrast'?w.help.contrast&&w.help.word:w.page==='comparison'?w.help.word:w.page==='example'?w.help.example&&(![w.source.example.left.label,w.source.example.right.label].includes(w.source.right.label)||w.help.word):w.page==='work'?(w.mode!=='read'||w.help.word)&&(!w.help.picture||w.help.word):true;
 if(!disclosed)return `<h2 id="wr-task" tabindex="-1">An earlier view</h2><p>${esc(T.unavailable)}</p>${button('choose','Choose another game')}`;
 if(w.page==='setup')return `<h2 id="wr-task" tabindex="-1">Your partner’s turn</h2><div class="wrs-pass">${icon(null)}<p>${esc(T.setup)}</p>${button('partner','Show partner card','class="wr-primary"')}</div>`;
 if(w.page==='partner')return `<h2 id="wr-task" tabindex="-1">For the reading partner</h2><div class="wrs-pass">${wordLabel(w.source.right)}<p>${esc(w.source.right.guidance)}</p>${button('hidePartner','Hide card and build','class="wr-primary"')}</div>`;
 if(['example','contrast'].includes(w.page))return pairView(w);
 if(w.page==='comparison'){
  const c=currentComparison(w);
  return `<h2 id="wr-task" tabindex="-1">Compare my label</h2>${c?`<div class="wrs-comparison"><div><h3>Your label</h3><p class="wrs-kept-letters">${c.slots.map(l=>esc(l??'empty')).join(' · ')}</p></div><div><h3>Our card</h3>${wordLabel(w.source.right)}</div></div><p>${esc(T[c.result])}</p>${keptFeedback(w)}`:`<p>${esc(T.unavailable)}</p>`}${button('back','Back to my label')}`;
 }
 const r=w.source.right,visible=w.mode==='read'||w.help.word;
 return `<h2 id="wr-task" tabindex="-1">${w.mode==='read'?'Look and read':'Build the label'}</h2><p class="wrs-instruction">${esc(w.mode==='read'?T.read:T.build)}</p><div class="wrs-stage">${visible?wordLabel(r):''}${keptFeedback(w)}${status()}${w.help.picture?`<figure>${picture(r,oldPicture)}<figcaption>${esc(r.meaning)}</figcaption></figure>`:''}${w.mode==='listen'?`<div class="wrs-label" role="group" aria-label="Three letter places">${w.slots.map((l,i)=>`<button type="button" id="wrs-place-${i}" data-wrs-action="place" data-wrs-value="${i}" aria-pressed="${w.place===i}" aria-label="${names[i]}: ${esc(l??'empty')}"><span>${i+1}</span><strong>${esc(l??'·')}</strong></button>`).join('')}</div><div class="wrs-bank" role="group" aria-label="Letter bank">${w.source.alphabet.map(l=>button('letter',l,`data-wrs-value="${esc(l)}"`)).join('')}</div><div class="wr-edit">${button('clearPlace','Clear this place')}${button('clear','Clear label')}${w.slots.every(l=>l===null)?button('base','Start with the first word'):''}</div>`:button('build','Build this label','class="wr-primary"')}</div><div class="wr-actions wrs-primary-actions">${w.mode==='listen'?`${button('keep','Keep my label','class="wr-primary"')}${button('compare','Compare my label')}`:''}${!visible?button('word','Show word'):''}${!w.help.picture?button('picture','Show picture'):''}</div><div class="wr-help">${button('contrast','Change one sound')}${button('example','Show an example')}</div>${keeps(w)}`;
}
function message(m,pack){
 if(!m)return `<h2 id="wr-task" tabindex="-1">${esc(noteHeading(pack))}</h2><p>${esc(T.unavailable)}</p>${button('caseBack','Back to my label')}`;
 let end=0,passage='';for(const t of m.tokens){passage+=esc(m.text.slice(end,t.start))+`<span class="${t.role==='target'?'wr-target':''}" data-wrs-token="${t.role}">${esc(t.text)}</span>`;end=t.end;}passage+=esc(m.text.slice(end));
 return `<h2 id="wr-task" tabindex="-1">${esc(m.title)}</h2><p>${esc(pack==='delivery'?D.noteIntro:pack==='garden'?G.noteIntro:'Underlined words are our prop labels, including an earlier one. Your partner can read any words with you.')}</p><div class="wrs-message">${messagePicture(m)}<p class="wr-passage">${passage}</p><p class="wr-discuss">${esc(m.prompt)}</p></div><div class="wr-actions">${button('caseBack','Back to my label')}<a href="#loft">Make another scene in Story Loft</a></div>`;
}
function letterPage(v,oldPicture){
 if(v.root.sharedHelp.letters!==true||!v.letter?.source)return `<h2 id="wr-task" tabindex="-1">Letter sounds</h2><p>${esc(T.unavailable)}</p>${v.teaching.some(x=>x.source)?button('letters',M.letters):''}${button('caseBack','Back to my labels')}`;
 const t=v.letter.source;
 return `<h2 id="wr-task" tabindex="-1">Meet ${esc(t.glyph)}</h2><p>${esc(M.letterIntro)}</p><div class="wrs-letter-nav" role="group" aria-label="Letter cards">${v.teaching.map(x=>button('teachingLetter',x.source?x.id:'Card unavailable',`data-wrs-value="${x.source?esc(x.id):''}" aria-pressed="${x.id===v.letter.id}" ${x.source?'':'disabled'}`)).join('')}</div><section class="wrs-letter-card"><strong class="wrs-glyph">${esc(t.glyph)}</strong>${picture(t.word,oldPicture)}<div class="wrs-print-places" aria-label="${esc(t.word.label)}, ${names[t.position].toLowerCase()} highlighted">${t.word.letters.map((l,i)=>`<span class="${i===t.position?'wrs-changed':''}">${esc(l)}</span>`).join('')}</div><p>${esc(t.guidance)}</p></section>${button('caseBack','Back to my labels')}`;
}
export function soundMessagesPage(book,oldPicture){
 const v=soundMessagesView(book);
 if(!v.active)return '';
 const content=v.page==='letters'?letterPage(v,oldPicture):v.page==='message'?(v.root.sharedHelp.message?message(v.message,v.pack):`<h2 id="wr-task" tabindex="-1">${esc(noteHeading(v.pack))}</h2><p>${esc(T.unavailable)}</p>${button('message',noteButton(v.pack))}`):v.page==='case'?(v.current?work(v.current.record,oldPicture):`<p>${esc(T.unavailable)}</p>${chooser(v)}`):chooser(v);
 const localStatus=content.includes('id="wr-status"');
 return `<section class="wr-room wrs-room" data-word-room-root data-wr-sounds-active data-wrs-packet="${v.pack}"><header class="wr-header">${button('leave','Back to prop labels')}<div><h1>${esc(copyFor(v.pack).title)}</h1></div></header>${content}${localStatus?'':status()}<nav class="wrs-bottom" aria-label="Sound label games">${v.page!=='choose'?button('choose',v.current?.record.mode==='read'?'Try another way':'Choose another game'):''}${v.page!=='letters'&&v.teaching.length?button('letters',M.letters):''}${v.page!=='message'?button('message',noteButton(v.pack)):''}<a href="#notes">Grown-up notes</a></nav><p class="wrs-reminder">${esc(T.reminder)}</p><details class="wrs-grownup"><summary>For grown-ups</summary><p>${esc(T.grownup)}</p>${v.pack!=='show'?`<p>${esc(copyFor(v.pack).grownup)}</p>`:''}</details></section>`;
}
export const soundMessagesEntry=()=>`<div class="wr-actions">${soundPackets.map(pack=>button('enter',pack==='show'?T.entry:copyFor(pack).title,`data-wrs-pack="${pack}" ${pack==='show'?'class="wr-primary"':''}`)).join('')}</div>`;
export const soundMessagesNotes=book=>soundPackets.map(pack=>packetNotes(book,pack)).join('');
function packetNotes(book,pack){
 const key=soundPacketField(pack);
 if(!book?.wordRoom||!Object.hasOwn(book.wordRoom,key))return '';
 const v=soundMessagesView(book,pack),title=pack==='show'?'Sound-changing prop labels':copyFor(pack).title,helpNames={partnerCard:'Partner card',word:'Word',picture:'Picture',example:'Example',contrast:'Sound comparison',base:'Starting word'};
 if(v.status!=='ready')return `<details class="panel"><summary>${esc(title)}</summary><p>${esc(T.unavailable)}</p></details>`;
 return `<details class="panel"><summary>${esc(title)}</summary><p>${esc(T.notes)}</p><p>Shared ${pack==='delivery'?D.noteName:pack==='garden'?G.noteName:pack==='market'?'market note':'show message'}: ${v.root.sharedHelp.message?'opened':'not opened here'}.</p>${pack!=='show'?`<p>Letter cards: ${Object.hasOwn(v.root.sharedHelp,'letters')?(v.root.sharedHelp.letters?'opened here':'not opened here'):'not recorded'}. Opening a card does not mean every letter was tried.</p>`:''}${v.cases.some(x=>!x.record&&Object.hasOwn(v.root.records,x.id))?`<p>${esc(T.unavailable)}</p>`:''}${v.cases.filter(x=>x.record).map(x=>`<section><h3>${esc(x.source.title)}</h3><p>Waiting letters: ${x.record.slots.map(l=>esc(l??'empty')).join(' · ')}.</p><p>Task-local help: ${Object.entries(helpNames).filter(([k])=>x.record.help[k]).map(([,title])=>title).join(', ')||'none disclosed in this case'}.</p>${[['firstKept','First kept'],['latestKept','Latest kept']].map(([key,title])=>Object.hasOwn(x.record,key)?`<p>${title}: ${soundKeep(x.record[key])?x.record[key].slots.map(l=>esc(l??'empty')).join(' · '):'earlier material unavailable'}.</p>`:'').join('')}</section>`).join('')}</details>`;
}
export function bindSoundMessages(book,ctx,root,events){
 const owner=ctx.explorerId(),initialRoot=book.wordRoom;
 const owned=()=>root.isConnected&&document.querySelector('[data-word-room-root]')===root&&ctx.notebook()===book&&ctx.explorerId()===owner&&ctx.isActive()&&location.hash==='#words/props';
 const live=el=>owned()&&book.wordRoom===initialRoot&&el.isConnected&&root.contains(el)&&!el.closest('details:not([open])')&&(!root.querySelector('dialog[open]')||!!el.closest('dialog[open]'));
 const say=msg=>{if(!owned())return;const n=root.querySelector('#wr-status');if(n){n.textContent=msg;n.focus();}};
 const run=(el,fn,focus='#wr-task')=>{
  if(!live(el))return;
  const result=fn({canExport:ctx.canExport,isCurrent:()=>live(el)});
  if(!result.ok){if(result.error!=='stale')say(result.error==='capacity'?T.capacity:T.unavailable);return;}
  const disclosures=[...root.querySelectorAll('details[open]')].map(x=>x.className);
  const saved=result.changed===false?null:ctx.save();
  if(!owned())return;
  const note=saved?.ok===false?'Kept in this tab, but browser saving failed. Download Grown-up notes before leaving.':saved?.enabled===false?'Kept in this tab; browser saving is off. Download Grown-up notes before leaving.':'';
  ctx.render();if(ctx.notebook()!==book||ctx.explorerId()!==owner||!ctx.isActive()||location.hash!=='#words/props')return;
  const next=document.querySelector('[data-word-room-root]');if(!next)return;
  for(const d of next.querySelectorAll('details'))d.open=disclosures.includes(d.className);
  const status=next.querySelector('#wr-status');if(status)status.textContent=note;
  if(result.notice==='kept')focus=note?'#wr-status':'#wrs-kept-feedback';
  if(focus==='place')focus='#wrs-place-'+(soundMessagesView(book).current?.record.place??0);
  (next.querySelector(focus)||next.querySelector('#wr-task'))?.focus();
 };
 root.querySelectorAll('[data-wrs-case]').forEach(el=>el.addEventListener('click',()=>run(el,o=>chooseSoundCase(book,el.dataset.wrsCase,el.dataset.wrsMode,o)),{signal:events.signal}));
 root.querySelectorAll('[data-wrs-action]').forEach(el=>el.addEventListener('click',()=>{
  const action=el.dataset.wrsAction;
  if(action==='enter')return run(el,o=>enterSoundMessages(book,o,el.dataset.wrsPack||'show'));
  if(action==='leave')return run(el,o=>leaveSoundMessages(book,o));
  const value=action==='place'?Number(el.dataset.wrsValue):el.dataset.wrsValue;
  run(el,o=>actSoundCase(book,action,value,o),['place','letter','clearPlace','clear','base'].includes(action)?'place':'#wr-task');
 },{signal:events.signal}));
 window.addEventListener('hashchange',()=>{if(location.hash!=='#words/props')events.abort();},{signal:events.signal});
 ctx.stopSpeech?.();
}
