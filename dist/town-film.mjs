// Optional local presentation. No notebook, story actions or viewing records.
const captions=[
 'Evening in Willowbank. Tonight, nothing needs mending.',
 'A cake for Ember, who acts very surprised.',
 'Bramble ties a ribbon on everything. Even on Pip.',
 "The Story Loft's first show. The ducks came anyway.",
 'The baker asks Dot something. She looks at Pip, and nods.',
 'The whole town, together, under the lanterns.',
 'A letter comes up the bridge road, from Vadoalto.',
 'There is more than one way to make a place your own.'
];
export function townFilm(){return `<section class="town-film" data-town-film aria-label="Celebration film">
 <button type="button" class="secondary" data-town-watch aria-expanded="false" aria-controls="town-film-picture">Watch the celebration film</button>
 <div id="town-film-picture" data-town-picture hidden>
 <p>A silent illustrated town evening, with cake, ribbons, a puppet show and neighbors under lanterns. A sealed letter arrives from Vadoalto.</p>
 <video controls playsinline preload="none" poster="./assets/town-film-poster.jpg" aria-label="A Town of Our Own, silent celebration film" aria-describedby="town-film-caption"></video>
 <p class="town-film-caption" id="town-film-caption" data-town-caption>Captions appear here during the film.</p>
 <div class="act-two-controls"><button type="button" class="secondary" data-town-play>Play</button><button type="button" class="secondary" data-town-replay>Replay</button><button type="button" class="secondary" data-town-hide>Hide film</button></div>
 <p data-town-status role="status"></p></div>
 <details data-town-transcript><summary>Read the film transcript</summary><ol>${captions.map(c=>`<li>${c}</li>`).join('')}</ol><p class="town-film-credit">Original After the Storm film made with Claude Motion. Lettering: Andika, SIL International (OFL-1.1).</p></details></section>`;}
let cleanup=null;
export function stopTownFilm(){cleanup?.();cleanup=null;}
export function bindTownFilm(root,live){
 stopTownFilm();const host=root.querySelector('[data-town-film]');if(!host)return;
 const video=host.querySelector('video'),panel=host.querySelector('[data-town-picture]'),watch=host.querySelector('[data-town-watch]'),play=host.querySelector('[data-town-play]'),caption=host.querySelector('[data-town-caption]'),status=host.querySelector('[data-town-status]');
 let disposed=false,loaded=false,wanted=false,serial=0,track=null,trackFailed=false;
 const listeners=[];
 const on=(el,type,fn)=>{el.addEventListener(type,fn);listeners.push(()=>el.removeEventListener(type,fn));};
 const current=()=>!disposed&&live(host),active=()=>current()&&!panel.hidden&&!document.hidden;
 const pause=()=>{wanted=false;serial++;video.pause();play.textContent='Play';};
 const failure=()=>{if(current())status.textContent='The film could not play here. You can read its transcript and continue the story.';};
 const updateCaption=()=>{if(!current())return;if(trackFailed){caption.textContent='Live captions are unavailable. Read the full transcript below.';return;}const cues=track?.track.cues;const cue=cues&&Array.from(cues).find(c=>video.currentTime>=c.startTime&&video.currentTime<c.endTime);caption.textContent=video.ended?captions.at(-1):cue?.text||'\u00a0';};
 const requestPlay=()=>{
  if(!active())return;wanted=true;const ticket=++serial;status.textContent='';
  try{Promise.resolve(video.play()).then(()=>{if(!active()||!wanted){video.pause();return;}if(ticket===serial)play.textContent='Pause';}).catch(error=>{if(error?.name==='AbortError')return;if(ticket===serial&&active()){wanted=false;play.textContent='Play';failure();}});}catch{wanted=false;failure();}
 };
 const load=()=>{if(loaded)return;loaded=true;track=document.createElement('track');track.kind='captions';track.srclang='en';track.label='English';track.src='./assets/town-film-take2.vtt';track.default=true;video.append(track);track.track.mode='hidden';on(track,'load',()=>{if(current()){track.track.mode='hidden';updateCaption();}});on(track,'error',()=>{trackFailed=true;updateCaption();});video.src='./assets/town-film-take2.mp4';};
 const hide=()=>{if(!current())return;pause();panel.hidden=true;watch.setAttribute('aria-expanded','false');watch.focus();};
 on(watch,'click',()=>{if(!current())return;panel.hidden=false;watch.setAttribute('aria-expanded','true');load();play.focus();requestPlay();});
 on(play,'click',()=>{if(!active())return;if(!video.paused)pause();else requestPlay();});
 on(host.querySelector('[data-town-replay]'),'click',()=>{if(!active())return;video.currentTime=0;requestPlay();});
 on(host.querySelector('[data-town-hide]'),'click',hide);
 on(panel,'keydown',e=>{if(e.key==='Escape'&&!panel.hidden&&current()){e.preventDefault();hide();}});
 on(host.querySelector('[data-town-transcript]'),'toggle',()=>{if(current()&&host.querySelector('[data-town-transcript]').open)pause();});
 on(video,'play',()=>{if(!active()){pause();return;}play.textContent='Pause';});
 on(video,'pause',()=>{if(current())play.textContent='Play';});
 on(video,'timeupdate',updateCaption);on(video,'seeked',updateCaption);on(video,'ended',()=>{wanted=false;updateCaption();});on(video,'error',failure);
 on(document,'visibilitychange',()=>{if(document.hidden)pause();});on(window,'pagehide',pause);on(window,'hashchange',()=>{if(!current())pause();});
 cleanup=()=>{disposed=true;pause();listeners.forEach(off=>off());};
}
