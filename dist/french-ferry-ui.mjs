import {ferryText as T,crossingIds} from './french-ferry-content.mjs';
import * as core from './french-ferry-core.mjs';
import {hearButton,localVoices,chooseLocalVoice,speechPreferences} from './play-media.mjs';
// Le bac at #bac: the teaching cards, two crossings and the grown-up notes (spec 327).
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Authored text may carry <i>, <i lang='fr'> and <b>; everything else is escaped.
const rich=x=>esc(x).replace(/&lt;i lang=&#39;fr&#39;&gt;/g,"<i lang='fr'>").replace(/&lt;(\/?)(i|b)&gt;/g,'<$1$2>');
const NB=' ';
const quoted=x=>`«${NB}${x}${NB}»`;
const fr=(x,tag='span')=>`<${tag} lang='fr'>${esc(x)}</${tag}>`;
const button=(action,label,extra='')=>`<button type='button' data-ferry-action='${action}'${extra}>${label}</button>`;
let views=new WeakMap();
function local(state,owner){let v=views.get(state);if(!v||v.owner!==owner){v={owner,open:null,card:null,again:''};views.set(state,v);}return v;}
// A usable local French voice: none, or a saved choice that is unavailable, counts as no voice.
export function frenchVoiceAvailable(voices,preferred=speechPreferences().voice){
 try{return !!chooseLocalVoice(voices,preferred,'fr')&&localVoices(voices,'fr').length>0;}catch{return false;}
}
const deviceVoices=()=>{try{return window.speechSynthesis?.getVoices?.()||[];}catch{return [];}};
const hear=(text,label,voice,extra='')=>voice?hearButton(text,label,'fr').replace('<button ',`<button ${extra} `):'';
function teachingCard(voice){
 const rows=T.teaching.map(r=>`<tr><th scope='row'>${fr(r.fr)}${hear(r.say,T.controls.hear,voice)}</th><td>${esc(r.en)}</td><td>${rich(r.note)}</td></tr>`).join('');
 const d=T.dot;
 return `<section class='ferry-card' aria-labelledby='ferry-teach-title'><h2 id='ferry-teach-title' tabindex='-1'>${esc(T.teachingLink)}</h2>${voice?'':`<p class='ferry-novoice'>${esc(T.controls.noVoice)}</p>`}
 <table class='ferry-table'><tbody>${rows}</tbody></table>
 <p><b>${esc(T.difference.title)}</b> ${rich(T.difference.text)}</p>
 <p><b>${esc(T.dot.title)}</b> Madame Roux: ${fr(quoted(d.question.fr))}${hear(d.question.fr,T.controls.hear,voice)} ${esc(d.question.en)} Dot: ${fr(quoted(d.answer.fr))}${hear(d.answer.fr,T.controls.hear,voice)} ${esc(d.answer.en)} Dot: "${rich(d.line)}"</p></section>`;
}
function soundsCard(voice){
 return `<section class='ferry-card' aria-labelledby='ferry-sounds-title'><h2 id='ferry-sounds-title' tabindex='-1'>${esc(T.soundsLink)}</h2>${voice?'':`<p class='ferry-novoice'>${esc(T.controls.noVoice)}</p>`}
 <table class='ferry-table'><tbody>${T.sounds.map(r=>`<tr><th scope='row'>${fr(r.fr)}${hear(r.fr,T.controls.hear,voice)}</th><td>${esc(r.en)}</td></tr>`).join('')}</tbody></table>
 <p><b>${esc(T.soundsNote.title)}</b> ${rich(T.soundsNote.text)}</p></section>`;
}
function clockArt(hour){
 const a=(hour%12)/12*2*Math.PI,x=50+Math.sin(a)*24,y=50-Math.cos(a)*24;
 return `<svg class='ferry-clock' viewBox='0 0 100 100' aria-hidden='true'><circle cx='50' cy='50' r='44'/>${[...Array(12)].map((_,i)=>{const t=i/12*2*Math.PI;return `<line x1='${50+Math.sin(t)*36}' y1='${50-Math.cos(t)*36}' x2='${50+Math.sin(t)*42}' y2='${50-Math.cos(t)*42}'/>`;}).join('')}<line class='ferry-hand-hour' x1='50' y1='50' x2='${x.toFixed(1)}' y2='${y.toFixed(1)}'/><line class='ferry-hand-minute' x1='50' y1='50' x2='50' y2='14'/></svg>`;
}
// Her line: hidden until asked for, or shown without marking when there is no French voice.
function herLine(line,x,i,voice,listenLabel){
 const controls=voice?hear(line.fr,x.listens?T.controls.again:listenLabel,voice,`data-ferry-her='${i}'`):`<p class='ferry-novoice'>${esc(T.controls.noVoice)}</p>`;
 const shown=x.wordsShown||!voice;
 return `<div class='ferry-her'>${controls}${shown?`<p class='ferry-line'>Madame Roux: ${fr(quoted(line.fr))}</p>`:`<p class='ferry-hidden'>${esc(T.controls.hidden)}</p>${button('words',esc(T.controls.show))}`}
 ${x.meaning?`<p class='ferry-gloss'>${esc(line.en)}</p>`:''}</div>`;
}
function stepView(c,voice){
 const s=c.source,at=core.currentStep(c);
 if(at.phase==='end')return `<div class='ferry-step' data-ferry-step='end'><p class='ferry-line' tabindex='-1' data-ferry-focus>Madame Roux: ${fr(quoted(s.ending.fr))}</p><p class='ferry-gloss'>${esc(s.ending.en)}</p></div>`;
 const i=at.index,x=c.steps[i],step=s.steps[i],last=x.picks.at(-1),fid=last?core.feedbackFor(s,i,last):null;
 const meaning=x.meaning?'':button('meaning',esc(T.controls.meaning));
 const feedback=fid&&!x.fitted?`<p class='ferry-feedback'>${esc(core.feedbackLine(s,fid))}</p>`:'';
 if(i<4&&at.phase==='answer'){
  const cards=s.cards.map(card=>`<button type='button' class='ferry-answer' data-ferry-card='${card.id}' aria-pressed='${last===card.id}' lang='fr'>${esc(card.fr)}${x.meaning?`<span class='ferry-gloss' lang='en'>${esc(card.en)}</span>`:''}</button>`).join('');
  return `<div class='ferry-step' data-ferry-step='${i}' tabindex='-1' data-ferry-focus>${herLine(step,x,i,voice,T.controls.listen)}${meaning}<div class='ferry-answers'>${cards}</div>${feedback}</div>`;
 }
 if(i<4){
  const card=s.cards.find(k=>k.id===step.fit);
  return `<div class='ferry-step' data-ferry-step='${i}' tabindex='-1' data-ferry-focus><p class='ferry-fit'>${esc(s.feedback.fit)}</p><p class='ferry-say'>${fr(card.fr,'strong')}</p><p>${esc(T.controls.saying)}</p>
  ${hear(card.fr,T.controls.model,voice,"data-ferry-model")}<div class='ferry-said'>${button('said',esc(T.controls.said))}${button('not-now',esc(T.controls.notNow))}</div></div>`;
 }
 if(at.phase==='say')return `<div class='ferry-step' data-ferry-step='4' tabindex='-1' data-ferry-focus><p>${esc(step.prompt)}</p><p class='ferry-say'>${fr(quoted(step.say.fr),'strong')}</p>${x.meaning?`<p class='ferry-gloss'>${esc(step.say.en)}</p>`:''}<p>${esc(T.controls.step5Saying)}</p>
  ${hear(step.say.fr,T.controls.model,voice,"data-ferry-model")}${meaning}<div class='ferry-said'>${button('said',esc(T.controls.said))}${button('not-now',esc(T.controls.notNow))}</div></div>`;
 const choices=step.choices.map(ch=>`<button type='button' class='ferry-answer ferry-number' data-ferry-card='${ch.id}' aria-pressed='${last===ch.id}'>${step.choiceKind==='clock'?clockArt(ch.value):''}<span>${esc(ch.label)}</span></button>`).join('');
 return `<div class='ferry-step' data-ferry-step='4' tabindex='-1' data-ferry-focus>${herLine(step.answer,x,4,voice,T.controls.hearAnswer)}${meaning}<div class='ferry-answers ferry-three'>${choices}</div>${feedback}</div>`;
}
function crossingView(key,entry,v,voice){
 if(!entry.present)return '';
 if(!entry.crossing)return `<section class='ferry-crossing'><p>${esc(T.exceptions.unreadable)}</p>${button('again',esc(T.exceptions.startAgain))}</section>`;
 const c=entry.crossing,s=c.source;
 return `<section class='ferry-crossing' aria-labelledby='ferry-crossing-title'><h2 id='ferry-crossing-title' tabindex='-1'>${fr(s.title.fr)} · ${esc(s.title.en)}</h2>
 <aside class='ferry-dot'><p><b>Dot:</b> ${esc(s.note)}</p></aside>${stepView(c,voice)}
 ${v.again===key?`<p>${esc(T.exceptions.afterAgain)}</p>`:''}${button('again',esc(T.exceptions.startAgain))}</section>`;
}
export function frenchFerryPage(state,owner='',voices=deviceVoices()){
 const view=core.frenchFerryView(state),v=local(state,owner),voice=frenchVoiceAvailable(voices);
 // On return, an opened crossing that isn't crossed is shown again.
 if(!v.open&&view.status==='ready')v.open=crossingIds.find(k=>view.crossings[k].present&&view.crossings[k].label!=='crossed')||null;
 const head=`<header class='ferry-heading'><h1 id='ferry-title' tabindex='-1'>${fr(T.heading.fr)} · ${esc(T.heading.en)}</h1></header>`;
 const status=`<p class='ferry-status' id='ferry-status' role='status' aria-live='polite'></p>`;
 if(view.status==='unsupported'||view.status==='unavailable')return `<section class='ferry-page' data-ferry-root>${head}<p>${esc(T.exceptions.unreadable)}</p>${status}</section>`;
 const links=`<p class='ferry-links'>${button('card-teaching',esc(T.teachingLink),` aria-pressed='${v.card==='teaching'}'`)}${button('card-sounds',esc(T.soundsLink),` aria-pressed='${v.card==='sounds'}'`)}</p>`;
 const list=`<section class='ferry-list' aria-labelledby='ferry-list-title'><h2 id='ferry-list-title'>${esc(T.crossings)}</h2>${crossingIds.map(k=>{const e=view.crossings[k],src=e.crossing?.source;const title=src?src.title:k==='morning'?{fr:'Le bac du matin',en:'The morning ferry'}:{fr:"Le bac de l'après-midi",en:'The afternoon ferry'};
  return `<div class='ferry-entry'>${button(`open-${k}`,`<span>${fr(title.fr)} · ${esc(title.en)}</span>`,` aria-pressed='${v.open===k}'`)}<span class='ferry-label'>${esc(T.labels[e.label]||T.labels.none)}</span></div>`;}).join('')}</section>`;
 // The teaching card shows before the first crossing on a first visit, and from its link at any time.
 const card=v.card==='sounds'?soundsCard(voice):v.card==='teaching'||(!view.taughtSeen&&!v.open)?teachingCard(voice):'';
 const open=v.open&&view.crossings[v.open]?crossingView(v.open,view.crossings[v.open],v,voice):'';
 return `<section class='ferry-page' data-ferry-root>${head}<p class='ferry-opening'>${esc(T.opening)}</p>${links}${card}${list}${open}${status}</section>`;
}
export function frenchFerryNotes(state){
 let view;try{view=core.frenchFerryView(state);}catch{return '';}
 if(!state||typeof state!=='object'||!Object.hasOwn(state,'frenchFerry'))return '';
 let raw;try{raw=JSON.stringify(state.frenchFerry,null,2);}catch{raw='Original data remains in the full notebook download.';}
 const lines=view.status==='ready'?crossingIds.map(k=>{const e=view.crossings[k],c=e.crossing,title=c?c.source.title.fr:k==='morning'?'Le bac du matin':"Le bac de l'après-midi";
  const word=c?.state==='crossed'?'crossed':e.present?'started':'not started';
  if(!c)return `<p>The ferry crossing (French): <span lang='fr'>${esc(title)}</span> ${esc(word)}.</p>`;
  const extra=!c.voice?', no French voice':c.steps.some(x=>x.wordsShown)?', words shown':'';
  const heard=c.steps.filter(x=>x.speechStarted&&!x.wordsShown).length,said=c.steps.filter(x=>x.said==='said').length;
  return `<p>The ferry crossing (French): <span lang='fr'>${esc(title)}</span> ${esc(word)}${esc(extra)}; French speech started with her words hidden on ${heard} of 5; said aloud ${said} of 5 (the explorer's own choice of button).</p>`;}).join(''):'';
 return `<details class='panel'><summary>${esc(T.homeLink)}</summary>${lines}<p>${rich(T.grownUp)}</p><details><summary>Saved data</summary><pre>${esc(raw)}</pre></details></details>`;
}
let controller;
export function bindFrenchFerry(state,ctx={}){
 controller?.abort();controller=new AbortController();const signal=controller.signal;
 const root=document.querySelector('[data-ferry-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',route='#bac',v=local(state,owner);
 // The root this binding expects: advanced after its own writes, so an outside replacement is still refused.
 let ownedRoot=state.frenchFerry;
 const owned=()=>root.isConnected&&document.querySelector('[data-ferry-root]')===root&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&(!ctx.isActive||ctx.isActive())&&state.frenchFerry===ownedRoot;
 const live=el=>owned()&&location.hash===route&&el.isConnected&&root.contains(el);
 const options={canExport:ctx.canExport};
 const say=message=>{const n=document.querySelector('#ferry-status');if(n)n.textContent=message;};
 const stop=()=>ctx.stopSpeech?.();
 const voiceNow=()=>frenchVoiceAvailable(deviceVoices());
 function redraw(target,message=''){ctx.render?.();const next=document.querySelector('[data-ferry-root]');if(!next||location.hash!==route)return;say(message);const f=next.querySelector(target)||next.querySelector('#ferry-title');f?.focus({preventScroll:true});}
 function write(fn){const result=fn();if(!result.ok){say(result.error==='unavailable'?T.exceptions.unreadable:T.exceptions.refused);return null;}if(result.changed!==false){ownedRoot=state.frenchFerry;ctx.save?.();}return result;}
 // The try and step a Hear tap came from, so a late start event can't mark another try.
 let heard=null;
 // Controls follow the device's voices; the stored voice flag never changes.
 const rendered=voiceNow();
 try{window.speechSynthesis?.addEventListener?.('voiceschanged',()=>{if(owned()&&location.hash===route&&voiceNow()!==rendered)redraw('[data-ferry-focus]');},{signal});}catch{}
 // Listens are counted before speech; a refused count doesn't block listening.
 root.addEventListener('click',ev=>{const b=ev.target.closest?.('[data-speak-lang="fr"]');if(!b||!live(b)||!v.open)return;
  const c=core.frenchFerryView(state).crossings[v.open]?.crossing;if(!c)return;
  const kind=b.hasAttribute('data-ferry-her')?'listen':b.hasAttribute('data-ferry-model')?'model':null;
  if(kind==='listen')heard={key:v.open,tryId:c.tryId,step:Number(b.dataset.ferryHer)};
  if(kind)write(()=>core.countListen(state,v.open,kind,options));},{capture:true,signal});
 root.addEventListener('garden-speech-start',ev=>{const b=ev.target.closest?.('[data-ferry-her]');if(!b||!live(b)||!v.open)return;
  const step=Number(b.dataset.ferryHer),c=core.frenchFerryView(state).crossings[v.open]?.crossing;
  if(!c||!heard||heard.key!==v.open||heard.tryId!==c.tryId||heard.step!==step)return;
  write(()=>core.markSpeechStarted(state,v.open,step,options));},{signal});
 root.addEventListener('click',ev=>{
  const el=ev.target.closest?.('[data-ferry-action],[data-ferry-card]');if(!el||!live(el))return;
  const key=v.open;
  if(el.dataset.ferryCard){stop();const r=write(()=>core.pickAnswer(state,key,el.dataset.ferryCard,options));if(!r)return;
   const c=core.frenchFerryView(state).crossings[key].crossing,line=core.feedbackLine(c.source,r.feedback);
   return redraw(r.fitted?'[data-ferry-focus]':`[data-ferry-card='${el.dataset.ferryCard}']`,line);}
  const a=el.dataset.ferryAction;
  if(a==='card-teaching'||a==='card-sounds'){stop();const card=a.slice(5);v.card=v.card===card?null:card;return redraw(v.card?`#ferry-${card==='teaching'?'teach':'sounds'}-title`:`[data-ferry-action='${a}']`);}
  if(a.startsWith('open-')){stop();const k=a.slice(5);if(!write(()=>core.openCrossing(state,k,{voice:voiceNow()},options)))return;v.open=k;v.card=null;v.again='';return redraw('[data-ferry-focus]');}
  if(a==='words'||a==='meaning'){if(!write(()=>core.useFerrySupport(state,key,a,options)))return;return redraw(a==='words'?'.ferry-line':'[data-ferry-focus]');}
  if(a==='said'||a==='not-now'){stop();if(!write(()=>core.sayAnswer(state,key,a,options)))return;return redraw('[data-ferry-focus]');}
  if(a==='again'){stop();if(!write(()=>core.startCrossingAgain(state,key,{voice:voiceNow()},options)))return;v.again=key;return redraw('[data-ferry-focus]',T.exceptions.afterAgain);}
 },{signal});
}
