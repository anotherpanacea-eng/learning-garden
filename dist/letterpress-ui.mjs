// Original351 visual drawer and visit-only theater printing. No notebook writer is passed to this module.
import {createLetterpressVisit,changeLetterpress,letterpressPair,letterpressChoices,letterpressFill,letterpressStrip,letterpressCapitalWord,letterpressComparison} from './letterpress-core.mjs';
import {wordRoomPicture} from './word-room-ui.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fill=(v,key,values={})=>letterpressFill(v.source.copy[key],values);
const button=(action,label,value=null,{pressed=null,extra=''}={})=>`<button type="button" data-lp-action="${action}"${value===null?'':` data-lp-value="${esc(value)}"`}${pressed===null?'':` aria-pressed="${pressed}"`} ${extra}>${esc(label)}</button>`;
function stamp(v,p,kind,extra=''){
 const glyph=p[kind],name=fill(v,'choiceName',{case:kind,glyph});
 return `<span class="lp-stamp ${extra}" role="img" aria-label="${esc(name)}"><span class="lp-glyph" aria-hidden="true">${glyph}</span><span class="lp-case" aria-hidden="true">${kind}</span></span>`;
}
function pair(v,id){const p=letterpressPair(v,id);return `<div class="lp-pair" role="group" aria-label="${esc(fill(v,'pairName',p))}">${stamp(v,p,'capital')}${stamp(v,p,'lowercase')}</div>`;}
const heading=text=>`<h2 id="lp-task" tabindex="-1">${esc(text)}</h2>`;
function drawer(v){
 const c=v.source.copy,p=letterpressPair(v),work=v.letters[v.selected],target=work.direction==='capital-target'?'capital':'lowercase',offered=target==='capital'?'lowercase':'capital';
 const choose=`<details class="lp-chooser"${v.chooserOpen?' open':''}><summary data-lp-action="chooser">${esc(c.chooser)}</summary><div class="lp-alphabet">${v.source.pairs.map(x=>button('letter',x.capital,x.id,{pressed:x.id===v.selected,extra:`aria-label="${esc(fill(v,'pairName',x))}"`})).join('')}</div></details>`;
 let mat;
 if(work.tool==='model')mat=heading(fill(v,'pairHeading',p))+`<div class="lp-work-mat">${pair(v,p.id)}<p class="lp-prompt">${esc(c.modelPrompt)}</p>${button('try',c.try,null,{extra:'class="lp-primary"'})}</div>`;
 else{
  const comparison=letterpressComparison(v);
  mat=heading(fill(v,target==='capital'?'capitalTarget':'lowercaseTarget',p))+`<div class="lp-work-mat"><div class="lp-target">${stamp(v,p,target)}</div><div class="lp-choices">${letterpressChoices(v).map(x=>button('choose',x[offered],x.id,{pressed:work.choice===x.id,extra:`class="lp-choice lp-glyph" aria-label="${esc(fill(v,'choiceName',{case:offered,glyph:x[offered]}))}"`})).join('')}</div>${comparison?`<section class="lp-comparison" id="lp-comparison" tabindex="-1"><p>${esc(comparison.literal)}</p><p>${esc(comparison.text)}</p></section>`:''}<div class="lp-actions">${button('model',c.model)}${button('flip',c.flip)}</div></div>`;
 }
 return choose+mat+`<nav class="lp-actions" aria-label="${esc(c.title)}">${button('next',c.next)}${button('look',c.look)}${button('print',c.print)}</nav>`;
}
function contrast(v){
 const c=v.source.copy,id=v.contrast,ids=id==='Aa'?['a']:id==='Cc'?['c']:['b','d'];
 return `${button('back',c.back)}${heading(c.contrastNames[id])}<div class="lp-contrast-select">${Object.entries(c.contrastNames).map(([key,name])=>button('contrast',name,key,{pressed:id===key})).join('')}</div><div class="lp-work-mat"><div class="lp-contrast-pairs">${ids.map(x=>pair(v,x)).join('')}</div><p class="lp-prompt">${esc(c.contrasts[id])}</p>${id==='Aa'?`<div class="lp-size"><span class="lp-glyph" role="img" aria-label="${esc(c.smallName)}">a</span><span class="lp-glyph lp-large" role="img" aria-label="${esc(c.largeName)}">a</span></div><p>${esc(c.size)}</p>`:''}</div>`;
}
function strip(v,editable=true){
 const w=v.labels[v.label],source=v.source.labels[v.label];
 return `<div class="lp-strip" role="group" aria-label="${esc(letterpressStrip(v))}">${source.letters.map((id,i)=>{
  const p=letterpressPair(v,id),kind=w.pattern[i]===p.capital?'capital':'lowercase',glyph=w.pattern[i];
  return editable?button('place',glyph,i,{extra:`id="lp-place-${i}" class="lp-glyph" aria-label="${esc(fill(v,'placeName',{position:i+1,case:kind,glyph}))}"`}):stamp(v,p,kind);
 }).join('')}</div><p id="lp-strip-description" tabindex="-1" class="lp-strip-description">${esc(letterpressStrip(v))}</p>`;
}
function wall(v){
 const c=v.source.copy;
 return `<details class="lp-wall"${v.wallOpen?' open':''}><summary data-lp-action="wall">${esc(c.wall)}</summary><div class="lp-wall-slots">${Object.values(v.source.labels).map(w=>{
  const pattern=v.wall[w.id];
  if(!pattern)return `<p class="lp-empty">${esc(fill(v,'emptyWall',{word:w.label}))}</p>`;
  const name=fill(v,'wallName',{word:w.label,stripDescription:letterpressStrip(v,pattern,w.id)});
  return `<button type="button" data-lp-action="wallSelect" data-lp-value="${w.id}" aria-label="${esc(name)}">${wordRoomPicture(w,true)}<span class="lp-glyph">${esc(pattern)}</span></button>`;
 }).join('')}</div></details>`;
}
function printing(v){
 const c=v.source.copy,s=v.source.labels[v.label],w=v.labels[v.label],capital=letterpressCapitalWord(v),pairs=`<details class="lp-label-pairs"${w.pairsOpen?' open':''}><summary data-lp-action="pairs">${esc(c.pairs)}</summary><div class="lp-reference-pairs">${s.letters.map(id=>pair(v,id)).join('')}</div></details>`;
 const mat=w.posterOpen?`<div class="lp-poster-comparison"><div class="lp-poster lp-glyph" role="img" aria-label="${esc(fill(v,'posterName',{CAPITALWORD:capital}))}">${esc(capital)}</div>${strip(v,false)}<p>${esc(fill(v,'posterText',{word:s.label,CAPITALWORD:capital}))}</p>${button('posterBack',c.posterBack)}</div>`:`${strip(v)}<div class="lp-actions">${button('all',c.capitals,'capital')}${button('all',c.lowercase,'lowercase')}</div><div class="lp-actions">${button('poster',c.poster)}${button('pin',c.pin,null,{extra:'class="lp-primary"'})}</div>`;
 return `${button('back',c.back)}${heading(c.print)}<nav class="lp-label-choices" aria-label="${esc(c.print)}">${Object.values(v.source.labels).map(x=>button('label',x.label,x.id,{pressed:x.id===v.label})).join('')}</nav><div class="lp-print-work"><figure class="lp-prop">${wordRoomPicture(s)}<figcaption>${esc(s.meaning)}</figcaption></figure><section class="lp-print-mat"><p class="lp-prompt">${esc(fill(v,'labelPrompt',{word:s.label}))}</p>${['mop','bat'].includes(s.id)?`<p>${esc(c.newUse)}</p>`:''}${mat}</section></div>${pairs}<p id="lp-wall-result" tabindex="-1">${Object.hasOwn(v.wall,v.label)?esc(fill(v,'wallResult',{word:s.label})):''}</p>${wall(v)}`;
}
let visits=new WeakMap(),controller=null;
function visit(book,owner){let local=visits.get(book);if(!local||local.owner!==owner){local={owner,value:createLetterpressVisit()};visits.set(book,local);}return local;}
export function resetLetterpressView(){controller?.abort();visits=new WeakMap();}
export function letterpressEntry(){const v=createLetterpressVisit();return `<aside class="lp-entry"><h2>${esc(v.source.copy.title)}</h2><p>${esc(v.source.copy.entry)}</p><a class="secondary" href="#words/letterpress">${esc(v.source.copy.title)}</a></aside>`;}
export function letterpressPage(book,owner){
 const v=visit(book,owner).value,c=v.source.copy;
 return `<section class="lp-room" data-lp-root><header class="lp-header"><a href="#words">Word Garden</a><h1>${esc(c.title)}</h1></header>${v.mode==='drawer'?`<p class="lp-opening">${esc(c.opening)}</p>`:''}${v.mode==='drawer'?drawer(v):v.mode==='contrast'?contrast(v):printing(v)}<p id="lp-status" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p><p class="lp-visit">${esc(c.visit)}</p><details class="lp-grownups"><summary>${esc(c.grownupTitle)}</summary><p>${esc(v.source.grownup)}</p></details></section>`;
}
export function bindLetterpress(book,ctx){
 controller?.abort();const events=new AbortController();controller=events;
 const root=document.querySelector('[data-lp-root]');if(!root)return;
 const owner=ctx.explorerId(),local=visit(book,owner),route='#words/letterpress';
 const owned=()=>root.isConnected&&document.querySelector('[data-lp-root]')===root&&ctx.notebook()===book&&ctx.explorerId()===owner&&ctx.isActive()&&location.hash===route&&visits.get(book)===local;
 const live=el=>{const scope=el.matches('summary')?el.parentElement?.parentElement:el;return owned()&&el.isConnected&&root.contains(el)&&!el.disabled&&!scope?.closest('details:not([open])');};
 root.querySelectorAll('[data-lp-action]').forEach(el=>el.addEventListener('click',event=>{
  if(el.matches('summary'))event.preventDefault();if(!live(el))return;
  const action=el.dataset.lpAction,value=action==='place'?Number(el.dataset.lpValue):el.dataset.lpValue;
  const next=changeLetterpress(local.value,action,value);if(!next)return;local.value=next;
  ctx.stopSpeech?.();ctx.render();
  if(ctx.notebook()!==book||ctx.explorerId()!==owner||!ctx.isActive()||location.hash!==route||visits.get(book)!==local)return;
  const target=document.querySelector('[data-lp-root]');if(!target)return;
  let selector='#lp-task',message='';
  if(action==='choose')selector='#lp-comparison';
  if(action==='place'){selector='#lp-place-'+value;message=letterpressStrip(next);}
  if(action==='all'||action==='posterBack')selector='#lp-strip-description';
  if(action==='pin')selector='#lp-wall-result';
  if(['chooser','pairs','wall'].includes(action))selector='[data-lp-action="'+action+'"]';
  (target.querySelector(selector)||target.querySelector('#lp-task'))?.focus();
  const status=target.querySelector('#lp-status');if(status)status.textContent=message;
 },{signal:events.signal}));
 window.addEventListener('hashchange',()=>{if(location.hash!==route){visits.delete(book);events.abort();}},{signal:events.signal});
 ctx.stopSpeech?.();
}
