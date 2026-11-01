import {soundMessagesPage,soundMessagesEntry,soundMessagesNotes,bindSoundMessages} from './word-room-sounds-ui.mjs';
import {soundMessagesView} from './word-room-sounds-core.mjs';
import {makeWordRoomSource} from './word-room-content.mjs';
import {wordRoomView, wordRoomWord, validWordRoomDraft, wordRoomSiblings, wordRoomExample, chooseWordRoomWord,
  chooseWordRoomText, setWordRoomPage, editWordRoomDraft, checkWordRoomLabel, keepWordRoomLabel,
  recoverWordRoom} from './word-room-core.mjs';

const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button = (action, label, attrs = '') => `<button type="button" data-wr-action="${action}" ${attrs}>${esc(label)}</button>`;
const ordinal = ['first','middle','last'];
const placeNames = ['First letter','Middle letter','Last letter'];
const soundNames = ['First sound','Middle sound','Last sound','Whole word'];
const grownup = 'This room has no recorded phonics demonstrations. Model the word and its three sounds yourself. Letter names and sounds are different. Each word here uses three letters for three sound positions; that is not a rule for every English word. Family endings are not single sounds or suffixes. The shared texts include words we have not taught here. Help, pictures and copied labels are welcome; the saved labels do not establish independent reading, spelling or comprehension.';
const unavailable = 'Earlier material is kept in the download but cannot be shown here.';
const refusal = "We couldn't keep this change. Your earlier work is still here. Download Grown-up notes to keep a copy.";
const opening = "Dot found the theater's props and little pictures after the storm. Their labels washed away. Can we make some new ones?";
const entry = 'Read together with a grown-up. Say each word, point to its three sounds, then put the sounds together.';
const route = '#words/props';

// Original silhouettes, including separate before/after scenes for actions.
const puppet = (x,y,seated=false) => `<g transform="translate(${x} ${y})"><path d="M45 10V0m24 10V0" stroke="#53675e"/><circle cx="57" cy="31" r="19" fill="#e6b581"/><path d="m40 50-7 44h48l-8-44Z" fill="#b4a6c8"/><path d="m38 59-17 24m56-24 17 24"/><path d="${seated?'m44 94 21 4 8 23m0-27 19 4 3 23':'m44 94-4 27m30-27 4 27'}"/><path d="m34 123 12 1m23-1 12 1"/><circle cx="50" cy="30" r="2" fill="#183f39"/><circle cx="64" cy="30" r="2" fill="#183f39"/><path d="M51 39q6 5 12 0" fill="none"/></g>`;
const cat = '<path d="M153 159q63 25 48-29" fill="none" stroke="#cf9561" stroke-width="15"/><ellipse cx="133" cy="133" rx="32" ry="41" fill="#d9a36d"/><path d="m103 84 1-29 21 16m17 1 21-17-1 32" fill="#d9a36d"/><ellipse cx="133" cy="91" rx="35" ry="29" fill="#dfac78"/><path d="m108 63 3 14 11-3m27 0 11-11-3 15" fill="#e8c5ae"/><circle cx="121" cy="89" r="3"/><circle cx="146" cy="89" r="3"/><path d="m129 99 5 4 5-4m-5 4v5m-26-7-20-3m21 11-21 4m69-12 20-3m-21 11 21 4M116 169h17m5 0h16" fill="none"/>';
const drawings = {
  cat: `<path d="M218 122h80v54h-80Z" fill="#ba865e"/><path d="m218 122 12-16h65l3 16m-80 27h80m-40-27v54" fill="none"/>${cat}`,
  mat: '<path d="m38 86 227 0 25 70H18Z" fill="#8eb7a3"/><path d="m43 96 215 0m-220 12h225m-230 13h234m-239 13h243m-250 13h257M54 89l-16 61m52-61-9 61m46-61-3 61m43-61 4 61m37-61 11 61m30-61 18 61" stroke="#eaf4ef" stroke-width="2"/><path d="m23 156-6 10m25-10-5 10m25-10-4 10m25-10-3 10m25-10-2 10m25-10v10m25-10 2 10m25-10 3 10m25-10 4 10m25-10 5 10m25-10 6 10"/>',
  sat: `<path d="M18 163h125m31 0h127M235 125h45v7h-45Zm4 7v29m35-29v29" fill="#ba865e"/><text x="45" y="23" stroke="none">Before</text><text x="215" y="23" stroke="none">After</text>${puppet(19,35)}${puppet(179,35,true)}`,
  bat: '<path d="m83 148 19 13 29-44q37-42 83-89l-24-16q-40 53-75 96Z" fill="#d7ae70"/><path d="m78 153 23 15m14-57 14 10" fill="none"/><circle cx="239" cy="143" r="25" fill="#fffdf3"/><path d="M223 125q20 18 0 36m31-36q-20 18 0 36" fill="none" stroke="#b93e2c" stroke-width="2"/>',
  pin: '<circle cx="99" cy="102" r="57" fill="#e9b84a"/><path d="M64 101q35-54 70 0-35 54-70 0Z" fill="#fffdf3"/><circle cx="99" cy="101" r="13" fill="#b4a6c8"/><ellipse cx="239" cy="104" rx="38" ry="51" fill="#b8c7ca"/><path d="m215 83 41 42m-39-40q17-13 31-2m10 42-8 7-8-12" fill="none"/>',
  tin: '<path d="M71 74h178v78q-89 32-178 0Z" fill="#b7c9ca"/><ellipse cx="160" cy="75" rx="89" ry="24" fill="#dfe7e5"/><ellipse cx="160" cy="70" rx="91" ry="23" fill="#cedbdb"/><path d="M85 101v42m14-37v35m-20-54q81 22 162 0" fill="none" stroke="#f7fbf7" stroke-width="5"/>',
  fin: '<path d="m221 105 58-46v92Z" fill="#88b6c1"/><ellipse cx="147" cy="105" rx="91" ry="50" fill="#b6d7d7"/><path d="m120 62 31-40 38 43Z" fill="#e9b84a" stroke-width="5"/><circle cx="85" cy="96" r="5"/><path d="m69 116 15 3M224 18 166 42m3-13-3 13 13-1" fill="none"/>',
  bin: '<path d="m53 69 211 0-17 97H71Z" fill="#b48d65"/><ellipse cx="158" cy="69" rx="105" ry="24" fill="#6c6551"/><path d="m144 50 56 8-12 35-59-6Z" fill="#b4a6c8"/><circle cx="104" cy="58" r="24" fill="#e9b84a"/><path d="M82 112h32m87 0h32m-161 29h172" fill="none"/>',
  hop: `<text x="45" y="23" stroke="none">Before</text><text x="215" y="23" stroke="none">After</text><path d="M18 173h125m31 0h127m-82-20-5 9m72-9 5 9" fill="none"/>${puppet(19,46)}${puppet(179,27)}`,
  mop: '<path d="m167 22-9 104" stroke="#ba865e" stroke-width="11"/><path d="M132 122h51v12h-51Z" fill="#719a8b"/><path d="m133 132-18 38m27-38-9 42m20-42-1 43m12-43 10 42m-1-42 19 38" fill="none" stroke="#bccfce" stroke-width="10"/>',
  top: '<path d="M150 35h18v36h-18Z" fill="#ba865e"/><path d="m96 95 64-43 65 43-65 73Z" fill="#b4a6c8"/><ellipse cx="160" cy="94" rx="64" ry="15" fill="#e9b84a"/><path d="M155 165h10l-5 12Z" fill="#ba865e"/><path d="M85 105q-35 14 4 28m148-28q35 14-4 28" fill="none"/>',
  pop: '<text x="45" y="23" stroke="none">Before</text><text x="215" y="23" stroke="none">After</text><circle cx="80" cy="105" r="46" fill="#d9e9ed"/><path d="M57 84q10-15 23-14" fill="none" stroke="#fff" stroke-width="7"/><path d="m235 56 7 22m-44-3 19 15m-28 20 26-1m-14 41 20-22m19 28 2-24m32 15-15-24m34-14-26-5m9-29-19 15" fill="none" stroke="#88b6c1" stroke-width="5"/>',
};
const sceneDrawings = {
  'scene-props-v1': `<g transform="translate(-18 28) scale(.8)">${drawings.mat}</g><g transform="translate(-10 15) scale(.8)">${cat}</g><g transform="translate(140 52) scale(.55)">${drawings.bat}</g>`,
  'scene-box-v1': '<path d="m227 79 79 0-8 88h-63Z" fill="#b48d65"/><ellipse cx="266" cy="79" rx="39" ry="12" fill="#6c6551"/><path d="M23 109h94v48q-47 19-94 0Z" fill="#b7c9ca"/><ellipse cx="70" cy="109" rx="47" ry="13" fill="#e7eeee"/><circle cx="68" cy="96" r="17" fill="#e9b84a"/><path d="m62 90 10 10m-10-10 8-2" fill="none"/><path d="m204 128 24-19v38Z" fill="#88b6c1"/><ellipse cx="171" cy="127" rx="43" ry="25" fill="#b6d7d7"/><path d="m158 106 14-21 17 20Z" fill="#e9b84a"/><circle cx="143" cy="123" r="3"/>',
  'scene-puppet-v1': `<g transform="translate(-18 26) scale(.8)">${puppet(55,9)}</g><g transform="translate(50 62) scale(.62)">${drawings.mop}</g><g transform="translate(160 85) scale(.48)">${drawings.top}</g><g transform="translate(100 4) scale(.6)"><path d="m235 25 7 22m-44-3 19 15m-28 20 26-1m-14 41 20-22m19 28 2-24m32 15-15-24m34-14-26-5m9-29-19 15" fill="none" stroke="#88b6c1" stroke-width="5"/></g>`,
};
function scenePicture(text) {
  if(!Object.hasOwn(sceneDrawings,text.art)||typeof text.alt!=='string'||!text.alt||text.alt.length>500)return '';
  return `<svg class="wr-scene-picture" viewBox="0 0 320 200" role="img" aria-label="${esc(text.alt)}"><path d="M10 18h300v170H10Z" fill="#eaf4ef"/><path d="M10 171h300v17H10Z" fill="#e4d7ad"/><g fill="#183f39" stroke="#183f39" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${sceneDrawings[text.art]}</g></svg>`;
}
export function wordRoomPicture(word, small = false) {
  const known = Object.hasOwn(drawings, word?.art), alt = known ? word.alt : "Picture unavailable. Read the card's meaning.";
  return `<svg class="wr-picture${small?' wr-picture-small':''}" viewBox="0 0 320 200" role="img" aria-label="${esc(alt)}"><path d="M10 18q150-24 300 0v170H10Z" fill="#eaf4ef" stroke="none"/><path d="M10 171h300v17H10Z" fill="#e4d7ad" stroke="none"/><g fill="#183f39" stroke="#183f39" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" font-size="14" font-family="Trebuchet MS,Verdana,sans-serif">${known?drawings[word.art]:'<path d="M116 54h88v106h-88Z" fill="#fffdf3"/><path d="M135 83h50m-50 22h50m-50 22h31" fill="none"/>'}</g></svg>`;
}
function letters(word, count = 3, point = null) {
  return `<div class="wr-word-pieces" aria-label="${esc(word.label)}: three letter places">${word.letters.map((letter,i)=>`<span class="wr-word-piece${point===i||point===3?' wr-pointed':''}">${i<count?esc(letter):'<span aria-hidden="true">·</span>'}</span>`).join('')}</div>`;
}

let views = new WeakMap(), controller = null;
function view(book, owner) {
  let v = views.get(book);
  if (!v || v.owner !== owner || v.root !== book.wordRoom) {v={owner,root:book.wordRoom,mode:'main',checked:null,exampleId:null,frame:0,otherId:null,dialog:null};views.set(book,v);}
  return v;
}
export function resetWordRoomView() {controller?.abort();views=new WeakMap();}
function choices(v, primary = true) {
  const suggest = ['mat','sat'].every(id=>wordRoomWord(v.source,id) && (!Object.hasOwn(v.root?.drafts||{},id) || validWordRoomDraft(v.root.drafts[id],v.source.alphabet)));
  return `<section class="wr-chooser"><h2 id="${primary?'wr-task':'wr-choices'}" tabindex="-1">Choose a card or a scene</h2><p>Choose a prop or a little scene. They are all open.</p>${suggest?'<p class="wr-suggestion">Try <strong>mat</strong>, then <strong>sat</strong>. What changes at the start?</p>':''}<div class="wr-shelf">${v.words.map(x=>x.word?`<button type="button" data-wr-word="${esc(x.id)}" class="wr-card">${wordRoomPicture(x.word,true)}<span>${esc(x.word.label)}</span></button>`:`<p class="wr-card-paused">${esc(x.id)}: ${unavailable}</p>`).join('')}</div><div class="wr-scene-choices">${v.texts.map(x=>x.text?button('text',x.text.title,`data-wr-value="${esc(x.id)}"`):`<p>${unavailable}</p>`).join('')}</div></section>`;
}
function comparisonButtons(v) {
  const siblings=wordRoomSiblings(v.source,v.word.id);
  return siblings.length?`<details class="wr-comparisons"><summary>Compare a word</summary><div>${siblings.map(w=>button('compare',`Compare ${v.word.label} and ${w.label}`,`data-wr-value="${esc(w.id)}"`)).join('')}</div></details>`:'';
}
function help(v) {
  return `<div class="wr-help">${button('point','Point through the word')}${button('example','Show a different example')}</div>${comparisonButtons(v)}`;
}
function result(v, local) {
  const r=local.checked;if(!r)return '';
  const word=r.id&&wordRoomWord(v.source,r.id);
  const message=r.kind==='match'?`${r.label}. This label matches our card. Say the word together.`:r.kind==='other'?`You made ${r.label}. We have a picture for that label too. Keep it, or keep working on ${v.word.label}.`:r.kind==='unavailable'?"An earlier card has this label, but we can't open that card here. The other pictures are still open.":`${r.label}. We don't have an open picture for this label here. You can change a letter or try another card.`;
  return `<section class="wr-result" aria-labelledby="wr-result-title"><h3 id="wr-result-title" tabindex="-1">${esc(r.label)}</h3>${word&&r.kind==='other'?wordRoomPicture(word,true):''}<p>${esc(message)}</p><div class="wr-actions">${word?button('keep',r.kind==='match'?'Put the label with this picture':'Keep this other label','class="wr-primary"'):button('change','Change a letter')}${button('dismiss','Back to my prop')}</div></section>`;
}
function work(v, local) {
  const w=v.word,d=v.draft;
  if(!w)return choices(v);
  if(!d)return `<h2 id="wr-task" tabindex="-1">${esc(w.label)}</h2>${wordRoomPicture(w)}<p>${v.hasDraft?unavailable:'This card has no label draft yet.'}</p>${!v.hasDraft?button('start','Start this label','class="wr-primary"'):''}${choices(v,false)}`;
  if(local.mode==='example') {
    const e=wordRoomWord(v.source,local.exampleId),part=local.frame;
    if(!e)return `<h2 id="wr-task" tabindex="-1">Show a different example</h2><p>This prop box has no different example to show. We can still make our label together.</p>${button('local-back','Back to my label')}`;
    const line=part===0?`${e.meaning} Say ${e.label} together.`:`Point to the ${ordinal[part-1]} sound. Your grown-up says it. Put ${e.letters[part-1]} in the ${ordinal[part-1]} place.${part===3?' Say the sounds, then the whole word together.':''}`;
    return `<h2 id="wr-task" tabindex="-1">A different label: ${esc(e.label)}. Your label is waiting.</h2><div class="wr-work"><figure>${wordRoomPicture(e)}</figure><div>${letters(e,part,part?part-1:null)}<p>${esc(line)}</p><div class="wr-actions">${button('example-prev','Previous example part',part===0?'disabled':'')}${button('example-next','Next example part',part===3?'disabled':'')}${button('local-back','Back to my label')}</div></div></div>`;
  }
  if(local.mode==='contrast') {
    const other=wordRoomWord(v.source,local.otherId);
    if(!other)return choices(v);
    return `<h2 id="wr-task" tabindex="-1">${esc(w.label)} and ${esc(other.label)}</h2><p>Point to the first letter in each word. Ask your grown-up to say both words clearly. What sound changes?</p><div class="wr-contrast">${[w,other].map(x=>`<figure>${wordRoomPicture(x,true)}${letters(x,3,0)}<figcaption>${esc(x.meaning)}</figcaption></figure>`).join('')}</div><p>The last two letters match. The first letters are different.</p>${button('local-back','Back to my label')}`;
  }
  if(local.mode==='point') {
    const p=d.point??0;
    return `<h2 id="wr-task" tabindex="-1">${soundNames[p]}</h2><div class="wr-work"><figure>${wordRoomPicture(w)}</figure><div>${letters(w,3,p)}<p>Ask your grown-up to say the sounds while you point from left to right. Then say the word together.</p><div class="wr-actions">${button('point-prev','Previous place',p===0?'disabled':'')}${button('point-next','Next place',p===3?'disabled':'')}${button('point-whole','The whole word')}${button('local-back','Back to my label')}</div></div></div>`;
  }
  const build=v.page==='build';
  return `<h2 id="wr-task" tabindex="-1">${build?'Make a label':esc(w.label)}</h2><div class="wr-work"><figure>${wordRoomPicture(w)}<figcaption>${esc(w.meaning)}</figcaption></figure><div class="wr-table">${build?`<p>Choose a place, then tap a letter.</p>${d.modelShown?`<div class="wr-model">${letters(w)}</div>`:''}<div class="wr-places" role="group" aria-label="Letter places">${d.slots.map((letter,i)=>`<button type="button" id="wr-place-${i}" data-wr-place="${i}" aria-pressed="${d.place===i}" aria-label="${placeNames[i]}: ${letter||'empty'}; choose this place."><span>${i+1}</span><strong>${letter?esc(letter):'·'}</strong></button>`).join('')}</div><div class="wr-bank" role="group" aria-label="Letter bank">${v.source.alphabet.map(letter=>button('letter',letter,`data-wr-value="${letter}"`)).join('')}</div>${button('try','Try this label','class="wr-primary"')}<div class="wr-edit">${button('clear-place','Clear this place')}${button('clear','Clear label')}${button('model',d.modelShown?'Hide the word':'Show the word')}</div>${result(v,local)}`:`${letters(w)}${button('build','Make a label','class="wr-primary"')}`}${help(v)}</div></div>`;
}
function reading(v) {
  const t=v.currentText;if(!t)return choices(v);
  let at=0,passage='';
  for(const token of t.tokens){passage+=esc(t.text.slice(at,token.start));passage+=token.role==='target'?`<strong class="wr-target">${esc(token.text)}</strong>`:esc(token.text);at=token.end;}
  passage+=esc(t.text.slice(at));
  const cards=v.words.filter(x=>x.word&&x.word.textId===t.id).map(x=>x.word);
  return `<h2 id="wr-task" tabindex="-1">${esc(t.title)}</h2><p>Underlined words are our prop words. Your grown-up supplies the other words.</p><div class="wr-reading-board"><div class="wr-reading-pictures" role="group" aria-label="${esc(t.title)}">${scenePicture(t)||cards.map(w=>wordRoomPicture(w,true)).join('')}</div><div class="wr-reading-copy"><p class="wr-passage">${passage}</p><p class="wr-discuss">${esc(t.prompt)}</p></div></div><div class="wr-actions">${button('back','Back')}${button('choose','Choose a little scene')}<a href="#loft">Make a scene in Story Loft</a></div>`;
}
export function wordRoomPage(book, owner) {
  if(soundMessagesView(book).active)return soundMessagesPage(book,wordRoomPicture);
  const v=wordRoomView(book),local=view(book,owner),header='<header class="wr-header"><a href="#words">Word Garden</a><div><h1>Word Workshop</h1><span>The Prop Box</span></div></header>';
  if(v.status==='unsupported')return `<section class="wr-room" data-word-room-root>${header}<h2 id="wr-task" tabindex="-1">The Prop Box</h2><p>This earlier prop box cannot open here. It is kept in Grown-up notes. The rest of Word Garden is open.</p>${button('recover','Start a fresh prop box')}<a href="#notes">Grown-up notes</a><p id="wr-status" role="status" tabindex="-1"></p>${recoveryDialog(local)}</section>`;
  const choose=v.page==='choose',target=v.word?`<p class="wr-waiting">Our prop: <strong>${esc(v.word.label)}</strong>.</p>`:'';
  const ready=v.complete?`<section class="wr-ready" tabindex="-1" aria-label="The prop box is ready"><p>The prop box has all its labels. What scene shall we make?</p><div class="wr-actions">${v.texts.some(x=>x.text)?button('scenes','Read a little scene'):''}${button('revisit','Visit a label again')}<a href="#loft">Make another scene</a></div></section>`:'';
  const latest=makeWordRoomSource(),upgrade=v.root&&v.source.id===latest.id&&v.source.revision<latest.revision;
  const nav=v.word?`<nav class="wr-steps" aria-label="Word Workshop pages">${[['meet','Meet the prop'],['build','Make a label'],['read','Read together']].filter(([key])=>key!=='build'||v.draft).map(([key,label])=>button(key,label,`aria-current="${v.page===key?'step':'false'}"`)).join('')}</nav>`:'';
  return `<section class="wr-room" data-word-room-root data-wr-page="${v.page}">${header}${choose?`<p class="wr-opening">${opening}</p><p>${entry}</p>${soundMessagesEntry()}`:''}${target}${nav}${choose?ready:''}${v.page==='read'?reading(v):choose?choices(v):work(v,local)}${!choose?ready:''}<p id="wr-status" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p>${!choose?`<div class="wr-bottom">${local.mode==='main'&&v.draft&&['meet','build'].includes(v.page)?`${button(v.page==='meet'?'choose':'meet',v.page==='meet'?'Back to the prop box':'Back: meet the prop')}${button(v.page==='meet'?'build':'read',v.page==='meet'?'Next: make a label':'Next: read together')}`:''}${button('choose','Choose another prop')}${button('choose','Choose a little scene')}</div>`:''}<details class="wr-gallery"><summary>Our labels</summary><p>Labels we have put with props. We can visit any one again.</p><div>${v.gallery.map(id=>`<button type="button" data-wr-word="${esc(id)}">${esc(wordRoomWord(v.source,id).label)}</button>`).join('')}</div></details><details class="wr-grownups"><summary>For grown-ups</summary><p>${grownup}</p>${v.word?`<p>${esc(v.word.guidance)}</p>`:''}${v.words.some(x=>!x.word)?'<p>An earlier prop card cannot open here, so we cannot call this whole box finished. The other props and scenes are still open.</p>':''}${v.root?button('recover',upgrade?'Open the newer prop box':'Start a fresh prop box'):''}<a href="#notes">Grown-up notes</a></details>${recoveryDialog(local)}</section>`;
}
function recoveryDialog(local) {
  return local.dialog?`<dialog class="wr-dialog" aria-labelledby="wr-confirm-title"><h2 id="wr-confirm-title">Start a fresh prop box</h2><p>Start with this version's prop box? Its drafts, labels and sound games will start fresh. Your earlier box will be kept in the Grown-up notes download.</p><div class="wr-actions">${button('cancel','Cancel')}${button('confirm','Open a fresh prop box','class="wr-primary"')}</div></dialog>`:'';
}
export function wordRoomNotes(book) {
  if(!book||!Object.hasOwn(book,'wordRoom'))return '';
  try {
    const v=wordRoomView(book),labels=v.gallery.map(id=>wordRoomWord(v.source,id).label);
    return `<details class="panel"><summary>Word Workshop: Prop Box</summary><p>These are supported label encounters, not independent reading, spelling or comprehension results.</p><p>${v.status==='unsupported'?unavailable:labels.length?`Labels placed: ${esc(labels.join(', '))}.`:'No readable labels have been placed.'}</p>${v.word&&v.draft?`<p>Waiting label: ${esc(v.word.label)}. Letters: ${esc(v.draft.slots.map(x=>x||'empty').join(', '))}.</p>`:''}${v.root&&typeof v.root==='object'&&Object.hasOwn(v.root,'recovered')?'<p>Earlier prop boxes are kept unchanged in this download.</p>':''}<a href="${route}">Open Word Workshop</a>${soundMessagesNotes(book)}</details>`;
  } catch {return `<details class="panel"><summary>Word Workshop: Prop Box</summary><p>${unavailable}</p><a href="${route}">Open Word Workshop</a>${soundMessagesNotes(book)}</details>`;}
}

export function bindWordRoom(book, ctx) {
  controller?.abort();const events=new AbortController();controller=events;
  const root=document.querySelector('[data-word-room-root]');if(!root)return;
  bindSoundMessages(book,ctx,root,events);
  if(soundMessagesView(book).active)return;
  const owner=ctx.explorerId(),local=view(book,owner),initialRoot=book.wordRoom;
  const owned=()=>root.isConnected&&document.querySelector('[data-word-room-root]')===root&&ctx.notebook()===book&&ctx.explorerId()===owner&&ctx.isActive()&&location.hash===route;
  const live=el=>owned()&&book.wordRoom===initialRoot&&el.isConnected&&root.contains(el)&&!el.closest('details:not([open])')&&(!root.querySelector('dialog[open]')||!!el.closest('dialog[open]'));
  const say=message=>{if(!owned())return;const n=root.querySelector('#wr-status');if(n){n.textContent=message;n.focus();}};
  const redraw=(message='',selector='#wr-task')=>{
    const disclosures=[...root.querySelectorAll('details[open]')].map(x=>x.className);
    ctx.render();
    if(ctx.notebook()!==book||ctx.explorerId()!==owner||!ctx.isActive()||location.hash!==route)return;
    const next=document.querySelector('[data-word-room-root]');if(!next)return;
    for(const d of next.querySelectorAll('details'))d.open=disclosures.includes(d.className);
    const status=next.querySelector('#wr-status');if(status)status.textContent=message;
    const focus=next.querySelector(selector)||next.querySelector('#wr-task');if(focus&&!focus.closest('details:not([open])'))focus.focus();
  };
  const options=el=>({canExport:ctx.canExport,isCurrent:()=>live(el)});
  const act=(el,fn,{message='',focus='#wr-task',mode='main'}={})=>{
    if(!live(el))return;
    const r=fn(options(el));
    if(!r.ok){if(r.error!=='stale'){const message=r.error==='capacity'?refusal:unavailable;if(local.dialog){local.dialog=null;redraw(message,'#wr-status');}else say(message);}return;}
    local.root=book.wordRoom;local.checked=null;local.mode=mode;local.dialog=null;
    const persisted=r.changed===false?null:ctx.save();
    if(!owned())return;
    const note=persisted?.ok===false?"Kept in this tab, but browser saving failed. Download Grown-up notes before leaving.":persisted?.enabled===false?"Kept in this tab; browser saving is off. Download Grown-up notes before leaving.":'';
    const feedback=r.notice==='text-unavailable'?'That earlier scene cannot open here. Choose another scene or return to your label.':message;
    redraw(`${feedback}${note?' '+note:''}`,focus);
  };
  root.querySelectorAll('[data-wr-word]').forEach(el=>el.addEventListener('click',()=>act(el,o=>chooseWordRoomWord(book,el.dataset.wrWord,o))));
  root.querySelectorAll('[data-wr-place]').forEach(el=>el.addEventListener('click',()=>act(el,o=>editWordRoomDraft(book,'place',Number(el.dataset.wrPlace),o),{focus:`#wr-place-${el.dataset.wrPlace}`})));
  root.querySelectorAll('[data-wr-action]').forEach(el=>el.addEventListener('click',()=>{
    if(!live(el))return;
    const a=el.dataset.wrAction,v=wordRoomView(book),d=v.draft;
    if(a==='text')return act(el,o=>chooseWordRoomText(book,el.dataset.wrValue,o));
    if(a==='scenes'||a==='revisit')return act(el,o=>setWordRoomPage(book,'choose',o),{focus:a==='scenes'?'.wr-scene-choices button':'.wr-shelf button'});
    if(['choose','meet','build','read','back'].includes(a))return act(el,o=>setWordRoomPage(book,a,o));
    if(a==='start')return act(el,o=>chooseWordRoomWord(book,v.word.id,o));
    if(['letter','clear-place','clear','model'].includes(a)) {
      const value=a==='letter'?el.dataset.wrValue:a==='model'?!d.modelShown:null;
      return act(el,o=>editWordRoomDraft(book,a,value,o),{focus:`#wr-place-${d.place}`,message:a==='letter'?`${placeNames[d.place]}: ${value}.`:''});
    }
    if(a==='try') {
      const r=checkWordRoomLabel(book);if(!r.ok)return say(unavailable);
      if(r.kind==='incomplete')return act(el,o=>editWordRoomDraft(book,'place',r.place,o),{focus:`#wr-place-${r.place}`,message:`The ${ordinal[r.place]} place is empty. Choose a letter for it.`});
      local.checked=r;return redraw('','#wr-result-title');
    }
    if(a==='keep') {
      const receipt=local.checked,label=receipt?.label,already=v.gallery.includes(receipt?.id);
      return act(el,o=>keepWordRoomLabel(book,receipt,o),{message:already?'That label is already in our box. We can use it again.':`The ${label} label is with its picture.`,focus:'.wr-ready'});
    }
    if(a==='dismiss'||a==='change'){local.checked=null;return redraw('','#wr-place-'+(d?.place??0));}
    if(a==='point')return act(el,o=>editWordRoomDraft(book,'point',d.point??0,o),{mode:'point'});
    if(['point-prev','point-next','point-whole'].includes(a))return act(el,o=>editWordRoomDraft(book,'point',a==='point-whole'?3:(d.point??0)+(a==='point-prev'?-1:1),o),{mode:'point'});
    if(a==='example'){local.checked=null;local.mode='example';local.exampleId=wordRoomExample(v.source,v.word.id)?.id||null;local.frame=0;return redraw();}
    if(a==='example-prev'||a==='example-next'){local.frame=Math.max(0,Math.min(3,local.frame+(a==='example-prev'?-1:1)));return redraw();}
    if(a==='compare'){if(!wordRoomSiblings(v.source,v.word.id).some(x=>x.id===el.dataset.wrValue))return;local.checked=null;local.mode='contrast';local.otherId=el.dataset.wrValue;return redraw();}
    if(a==='local-back'){local.mode='main';return redraw();}
    if(a==='recover'){local.dialog={root:book.wordRoom};return redraw('','.wr-dialog [data-wr-action="cancel"]');}
    if(a==='cancel'){local.dialog=null;return redraw('','[data-wr-action="recover"]');}
    if(a==='confirm') {
      if(!local.dialog||local.dialog.root!==book.wordRoom)return;
      return act(el,o=>recoverWordRoom(book,true,o));
    }
  }));
  const dialog=root.querySelector('dialog');
  if(dialog){dialog.showModal();dialog.addEventListener('cancel',e=>{e.preventDefault();if(live(dialog)){local.dialog=null;redraw('','[data-wr-action="recover"]');}});}
  window.addEventListener('hashchange',()=>{if(location.hash!==route){views.delete(book);events.abort();}},{signal:events.signal});
  ctx.stopSpeech?.();
}
