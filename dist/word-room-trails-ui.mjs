// Original350 touch work mat; source and counters are visit-local, never learner records.
import {soundTrailPair,soundTrailReference,soundTrailCounterLine} from './word-room-trails-content.mjs';
import {soundWordPicture} from './word-room-sounds-ui.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,text,value=null,{disabled=false,pressed=null}={})=>'<button type="button" data-wrt-action="'+action+'"'+(value===null?'':' data-wrt-value="'+esc(value)+'"')+(disabled?' disabled':'')+(pressed===null?'':' aria-pressed="'+pressed+'"')+'>'+esc(text)+'</button>';
const drawings={
 fox350:'<path d="m60 138-30-31q-10 54 40 54" fill="#ce8857"/><path d="m38 129 13 22-19-9" fill="#fffdf3"/><path d="m94 104-5-69 43 22 41-1 47-25-9 73-57 39Z" fill="#ce8857"/><path d="m99 99 55 32 52-33-39-5-13 17-16-17Z" fill="#fffdf3"/><path d="M112 135q37-17 65 0l14 45H99Z" fill="#ce8857"/><circle cx="127" cy="86" r="4"/><circle cx="181" cy="85" r="4"/><path d="m145 104 11 9 9-10Z" fill="#183430"/>',
 fog350:'<path d="M70 42v128m90-145v145m93-121v121" stroke="#ba865e" stroke-width="8"/><path d="m34 96 36-65 36 65Zm83-15 43-68 45 68Zm103 24 33-62 38 62Z" fill="#8eb7a3"/><path d="M16 115q38-20 77-3t80-6 133 8v57H16Z" fill="#d3e4e1" fill-opacity=".9"/><path d="M23 135h96m36 8h127M54 159h154" stroke="#fffdf3" stroke-width="8"/>',
 quit350:'<path d="M11 174h124m50 0h124" stroke="#ba865e" stroke-width="7"/><circle cx="47" cy="59" r="18" fill="#e6b581"/><path d="m34 79-9 55h45l-8-55Z" fill="#b4a6c8"/><path d="m33 96 44 16m-41 21-7 33m30-33 5 33" fill="none" stroke-width="6"/><path d="M81 147h26v26H81Zm0-26h26v26H81Zm4-25h26v25H85Z" fill="#e9b84a"/><path d="M188 147h26v26h-26Zm0-26h26v26h-26Zm0-26h26v26h-26Z" fill="#e9b84a"/><circle cx="273" cy="59" r="18" fill="#e6b581"/><path d="m260 79-9 55h45l-8-55Z" fill="#b4a6c8"/><path d="m254 96-18 16m51-13 18 9m-43 25-6 33m30-33 6 33" fill="none" stroke-width="6"/><path d="M143 113h32m-8-8 8 8-8 8" fill="none" stroke="#397958" stroke-width="4"/>',
 mix350:'<path d="M14 84h59q-2 48-30 48T14 84m65 0h59q-2 48-30 48T79 84m120 13h108q-2 65-54 65t-54-65" fill="#f9e9ba"/><ellipse cx="43" cy="85" rx="29" ry="9" fill="#fffdf3"/><ellipse cx="108" cy="85" rx="29" ry="9" fill="#fffdf3"/><ellipse cx="253" cy="98" rx="53" ry="16" fill="#fffdf3"/><g fill="#b44e40"><circle cx="32" cy="82" r="5"/><circle cx="47" cy="84" r="5"/><circle cx="56" cy="80" r="5"/><circle cx="219" cy="95" r="5"/><circle cx="252" cy="102" r="5"/><circle cx="280" cy="92" r="5"/></g><g fill="#69a7ab"><circle cx="95" cy="83" r="5"/><circle cx="108" cy="79" r="5"/><circle cx="121" cy="84" r="5"/><circle cx="234" cy="104" r="5"/><circle cx="264" cy="92" r="5"/><circle cx="286" cy="103" r="5"/></g><path d="m257 34-16 63m-12-11q-5 17 19 25" fill="none" stroke="#ba865e" stroke-width="8"/><path d="M151 105h34m-8-8 8 8-8 8" fill="none" stroke="#397958" stroke-width="4"/>',
 quiz350:'<circle cx="83" cy="53" r="25" fill="#e6b581"/><path d="m63 82-16 80h73l-14-80Z" fill="#b4a6c8"/><path d="m62 104 60 27m-16-31 12 32" fill="none" stroke-width="7"/><path d="m129 63 141 8-7 100-141-8Z" fill="#fffdf3"/><text x="147" y="133" fill="#183430" stroke="none" font-size="37">? ? ?</text>'
};
function picture(w,c){
 if(w.art==='kit348')return soundWordPicture(w)||'<p>'+esc(c.pictureFallback)+'</p>';
 if(!Object.hasOwn(drawings,w.art))return '<p>'+esc(c.pictureFallback)+'</p>';
 return '<svg class="wrt-picture" viewBox="0 0 320 190" role="img" aria-label="'+esc(w.alt)+'"><g stroke="#183430" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">'+drawings[w.art]+'</g></svg>';
}
function connector(w,g){
 const names=g.sounds.map(n=>'Sound '+(n+1)).join(' and ');
 return (g.letters.length===1?'Letter '+w.letters[g.letters[0]]+' goes with ':'Letters '+g.letters.map(n=>w.letters[n]).join(' and ')+' go with ')+names+'.';
}
function model(v,id=v.selected,frame=v.work[id].frame){
 const r=soundTrailReference(v,id,frame),w=r.word,letterX=i=>160+(i-(w.letters.length-1)/2)*54,dotX=i=>160+(i-(w.phonemes.length-1)/2)*60;
 let svg='';
 for(const g of w.groups){
  const x=g.letters.reduce((n,i)=>n+letterX(i),0)/g.letters.length,active=frame===4||frame>0&&w.groups[frame-1]===g,cls=active?' wrt-linked':'';
  if(g.letters.length>1)svg+='<path class="wrt-link'+cls+'" d="M'+letterX(g.letters[0])+' 65H'+letterX(g.letters.at(-1))+'M'+x+' 65v16"/>';
  else svg+='<path class="wrt-link'+cls+'" d="M'+x+' 63v18"/>';
  for(const n of g.sounds)svg+='<path class="wrt-link'+cls+'" d="M'+x+' 81  '+dotX(n)+' 117"/>';
 }
 for(const[i,l]of w.letters.entries())svg+='<g role="img" aria-label="Letter '+esc(l)+'"><rect class="wrt-print'+(r.letters.includes(i)?' wrt-selected':'')+'" x="'+(letterX(i)-22)+'" y="12" width="44" height="48" rx="4"/><text x="'+letterX(i)+'" y="47" aria-hidden="true" class="wrt-glyph">'+esc(l)+'</text></g>';
 for(let i=0;i<w.phonemes.length;i++)svg+='<g role="img" aria-label="Sound '+(i+1)+'"><circle class="wrt-sound'+(r.sounds.includes(i)?' wrt-selected':'')+'" cx="'+dotX(i)+'" cy="137" r="18"/><text x="'+dotX(i)+'" y="143" class="wrt-number" aria-hidden="true">'+(i+1)+'</text></g>';
 return '<figure class="wrt-model"><figcaption>'+esc(v.source.copy.model)+'</figcaption><svg class="wrt-map" viewBox="0 0 320 170" role="group" aria-label="'+esc(w.label+': '+v.source.copy.model)+'" aria-describedby="wrt-map-'+id+'"><desc id="wrt-map-'+id+'">'+esc(w.groups.map(g=>connector(w,g)).join(' '))+'</desc>'+svg+'</svg></figure>';
}
function printed(w){return '<div class="wrt-print-only" aria-label="'+esc(w.label)+'">'+w.letters.map(l=>'<span>'+esc(l)+'</span>').join('')+'</div>';}
export function soundTrailPage(v){
 const c=v.source.copy,w=v.source.words[v.selected],a=v.work[v.selected],pair=soundTrailPair(v);
 let task;
 if(v.compare){
  task='<h2 id="wr-task" tabindex="-1">'+esc(pair.title)+'</h2><p>'+esc(pair.text)+'</p><div class="wrt-pair">'+pair.ids.map(id=>'<section><h3>'+esc(id)+'</h3>'+model(v,id,Object.hasOwn(pair.highlight,id)?pair.highlight[id]+1:4)+'</section>').join('')+'</div><div class="wrt-actions">'+button('back',c.compareBack)+'</div>';
 }else{
  const figures='<figure class="wrt-prop">'+picture(w,c)+'<figcaption>'+esc(w.meaning)+'</figcaption></figure>';
  let mat;
  if(a.tool==='try'){
   const counters=Array.from({length:a.count},(_,i)=>'<span class="wrt-counter" role="img" aria-label="Counter '+(i+1)+'"><i aria-hidden="true">'+(i+1)+'</i></span>').join('');
   mat='<h3>'+esc(c.own)+'</h3>'+printed(w)+'<p class="wrt-prompt">'+esc(c.newUse[w.id]||c.tryPrompt)+'</p><div class="wrt-counters" role="group" aria-label="'+esc(c.own)+'">'+counters+'</div><p id="wrt-count" tabindex="-1" role="status" aria-live="polite" aria-atomic="true">'+esc(soundTrailCounterLine(a.count))+'</p><div class="wrt-counter-actions">'+button('counter',c.add,1,{disabled:a.count===6})+button('counter',c.take,-1,{disabled:a.count===0})+'</div><div class="wrt-actions">'+button('model',c.show)+'</div>';
  }else mat=model(v)+'<p id="wrt-step" tabindex="-1" class="wrt-prompt">'+esc(w.frames[a.frame])+'</p><div class="wrt-actions">'+button('step',c.prev,-1,{disabled:a.frame===0})+button('step',c.next,1,{disabled:a.frame===4})+button('try',c.try)+'</div>';
  task='<h2 id="wr-task" tabindex="-1">'+esc(w.label)+'</h2><div class="wrt-work">'+figures+'<section class="wrt-mat">'+mat+'</section></div>'+(pair?'<div class="wrt-actions">'+button('compare',c.compare[w.id])+'</div>':'');
 }
 const choices='<nav class="wrt-words" aria-label="Choose a word">'+Object.keys(v.source.words).map(id=>button('word',id,id,{pressed:v.selected===id})).join('')+'</nav>';
 return '<section class="wr-room wrt-room" data-word-room-root data-wrt-root data-wrt-word="'+v.selected+'"><header class="wr-header">'+button('leave',c.back)+'<div><h1>'+esc(c.title)+'</h1></div></header><p class="wrt-opening">'+esc(c.opening)+'</p>'+choices+'<div class="wrt-task">'+task+'</div><p class="wrt-visit">'+esc(c.visit)+'</p><details class="wrt-grownups"><summary>'+esc(c.grownupTitle)+'</summary><p>'+esc(v.source.grownup)+'</p><p>'+esc(v.source.guide[w.id])+'</p><p>'+esc(w.reference)+'</p></details></section>';
}
