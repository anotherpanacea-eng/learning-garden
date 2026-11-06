// Optional weather-station film. Visit-local only; no notebook or viewing record.
export const waterRingFilmCaptions=Object.freeze([
 {start:.2,end:2.2,text:'The weather station, by the brook.'},
 {start:2.2,end:4.4,text:'The Sun warms a puddle. Look closer.'},
 {start:4.4,end:7,text:'Some of the water evaporates into water vapor.'},
 {start:7.2,end:9.8,text:'Water vapor is invisible. There is nothing to see.'},
 {start:9.8,end:12.3,text:'Air carrying the vapor rises.'},
 {start:12.3,end:15,text:'Higher up, the air is cooler.'},
 {start:15.2,end:18,text:'In the cooler air, the vapor condenses into tiny drops.'},
 {start:18,end:20.6,text:'Lots of tiny drops together are what we see as a cloud.'},
 {start:20.6,end:23,text:'This cloud is liquid drops, not vapor.'},
 {start:23.2,end:25.6,text:'Tiny drops bump together and join into bigger drops.'},
 {start:25.6,end:28,text:'Big drops fall as rain.'},
 {start:28,end:31,text:'The rain gauge measures the rain as a depth, in millimeters.'},
 {start:31.2,end:33.8,text:'It runs into the brook and ground, supplying water to the tree.'},
 {start:33.8,end:37,text:'Then some evaporates again. No start, no end, and no water used up.'}
].map(Object.freeze));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,text,disabled=false)=>`<button type="button" class="secondary" data-water-ring-action="${action}"${disabled?' disabled':''}>${text}</button>`;
const failed='The film did not load. You can read its words below, try again, or go back.';
let cleanup=null,pauseCurrent=null;
export function pauseWaterRingFilm(){pauseCurrent?.();}
export function stopWaterRingFilm(){const stop=cleanup;cleanup=null;pauseCurrent=null;stop?.(false);}
export function waterRingFilmEntry(){return `<aside class="wt-water-film-invitation"><h2>Watch the water cycle film</h2><p>The film shows the same loop in moving pictures. The ring above is complete without it.</p><button type="button" class="secondary" data-water-ring-watch>Watch the water cycle film</button><span>Optional silent film · 37 seconds</span><p data-water-ring-status role="status"></p></aside>`;}

export function openWaterRingFilm(weatherRoot,{live,beforePlay=()=>{}}){
 const watch=weatherRoot?.querySelector('[data-water-ring-watch]'),entryStatus=weatherRoot?.querySelector('[data-water-ring-status]');
 const shown=node=>!!node?.isConnected&&!node.closest('[hidden],[inert]')&&node.getClientRects().length>0&&getComputedStyle(node).visibility!=='hidden';
 if(!weatherRoot?.isConnected||!live()||!shown(watch)||watch.disabled||document.querySelector('dialog[open]'))return false;
 if(weatherRoot.querySelector('drawn-howto .dh-open[aria-busy]')){
  if(entryStatus)entryStatus.textContent='The drawing is loading. Try the film in a moment.';
  return false;
 }
 stopWaterRingFilm();
 if(entryStatus)entryStatus.textContent='';
 const drawingToggle=weatherRoot.querySelector('drawn-howto [data-dh="toggle"]');
 if(drawingToggle?.textContent==='Pause'&&!drawingToggle.disabled&&shown(drawingToggle))drawingToggle.click();
 // Keep the weather DOM (including unsaved choices and the drawing step) intact.
 const dialog=document.createElement('dialog');dialog.className='wt-ring-movie';dialog.dataset.waterRingMovie='';
 dialog.setAttribute('aria-labelledby','water-ring-film-title');
 dialog.innerHTML=`<h2 id="water-ring-film-title">The water cycle at the weather station</h2><p>This is a drawn film, not a weather report. It shows one simple path for water.</p><video controls playsinline muted preload="none" poster="./media/water-ring-poster.jpg" aria-label="The water cycle at the weather station, silent film" aria-describedby="water-ring-film-caption"></video><p id="water-ring-film-caption" class="wt-ring-caption" data-water-ring-caption>Read the film's words below at any time.</p><div class="wt-ring-controls">${button('play','Play',true)}${button('replay','Replay',true)}${button('retry','Retry loading')}${button('return','Back to the weather page')}</div><p data-water-ring-load-status role="status"></p><details data-water-ring-transcript><summary>Show the words</summary><h3>The film's words</h3><ol>${waterRingFilmCaptions.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ol></details><p class="wt-ring-credit">Corrected derivative of the original <em>After the Storm</em> film made with Claude Motion. Andika lettering rendered in the picture, SIL Open Font License 1.1. No authoring player or font files included.</p>`;
 weatherRoot.append(dialog);
 const video=dialog.querySelector('video'),play=dialog.querySelector('[data-water-ring-action="play"]'),replay=dialog.querySelector('[data-water-ring-action="replay"]'),retry=dialog.querySelector('[data-water-ring-action="retry"]'),back=dialog.querySelector('[data-water-ring-action="return"]'),transcript=dialog.querySelector('[data-water-ring-transcript]'),status=dialog.querySelector('[data-water-ring-load-status]'),caption=dialog.querySelector('[data-water-ring-caption]');
 let disposed=false,revision=0,playRevision=0,wanted=false,controller=null,source=null,track=null,playTask=null,observer;
 const off=[],invalid=new Set(),guarded=[watch,video,play,replay,retry,back,transcript];
 const ancestry=node=>{const result=[];for(let p=node;p&&p!==document;p=p.parentNode)result.push([p,p.parentNode]);return result;};
 const chains=new Map(guarded.map(node=>[node,ancestry(node)]));
 const intact=node=>!invalid.has(node)&&chains.get(node)?.every(([n,p])=>n.parentNode===p);
 const on=(node,event,fn)=>{node.addEventListener(event,fn);off.push(()=>node.removeEventListener(event,fn));};
 const audit=records=>{
  for(const record of records)for(const removed of record.removedNodes){
   if(removed===weatherRoot||removed.contains?.(weatherRoot)||removed===dialog||removed.contains?.(dialog)){dispose(false);return;}
   for(const node of guarded)if(removed===node||removed.contains?.(node))invalid.add(node);
  }
 };
 const current=()=>{
  if(disposed)return false;
  if(observer)audit(observer.takeRecords());
  if(disposed)return false;
  if(!live()||!weatherRoot.isConnected||dialog.parentNode!==weatherRoot||!dialog.open){dispose(false);return false;}
  return true;
 };
 const active=node=>current()&&!document.hidden&&intact(node)&&shown(node)&&!node.disabled;
 const pause=()=>{wanted=false;playRevision++;video.pause();if(!disposed)play.textContent='Play';};
 const detach=()=>{video.removeAttribute('src');track?.remove();track=null;video.load();if(source){URL.revokeObjectURL(source);source=null;}};
 function dispose(focus){
  if(disposed)return;disposed=true;wanted=false;revision++;playRevision++;controller?.abort();observer?.disconnect();off.forEach(fn=>fn());video.pause();detach();
  if(dialog.open)dialog.close();dialog.remove();
  if(cleanup===dispose){cleanup=null;pauseCurrent=null;}
  if(focus&&live()&&intact(watch)&&weatherRoot.contains(watch)&&shown(watch)&&!watch.disabled)watch.focus();
 }
 const failure=()=>{if(current())status.textContent=failed;};
 const updateCaption=()=>{if(current())caption.textContent=(video.ended?waterRingFilmCaptions.at(-1):waterRingFilmCaptions.find(c=>video.currentTime>=c.start&&video.currentTime<c.end))?.text||'\u00a0';};
 const requestPlay=()=>{
  if(!active(video)||!source)return;wanted=true;const ticket={serial:++playRevision,revision};playTask=ticket;
  try{Promise.resolve(video.play()).then(()=>{
   if(playTask!==ticket)return;playTask=null;
   if(!active(video)||!wanted||ticket.serial!==playRevision||ticket.revision!==revision)video.pause();
  }).catch(error=>{if(playTask===ticket)playTask=null;if(error?.name!=='AbortError'&&current()&&ticket.serial===playRevision&&ticket.revision===revision){wanted=false;failure();}});}
  catch{playTask=null;wanted=false;failure();}
 };
 const load=async auto=>{
  if(!current())return;pause();controller?.abort();const rev=++revision;detach();controller=new AbortController();play.disabled=true;replay.disabled=true;status.textContent='Loading the water cycle film…';
  wanted=auto&&!matchMedia('(prefers-reduced-motion: reduce)').matches;const ticket=playRevision;
  try{
   const response=await fetch('./media/water-ring.mp4',{signal:controller.signal});if(!response.ok)throw Error('Unavailable');
   const blob=await response.blob();if(!current()||rev!==revision)return;
   source=URL.createObjectURL(new Blob([blob],{type:'video/mp4'}));video.muted=true;video.src=source;
   track=document.createElement('track');track.kind='captions';track.srclang='en';track.label='English';track.src='./media/water-ring.vtt';video.append(track);track.track.mode='hidden';
   play.disabled=false;replay.disabled=false;status.textContent='';if(wanted&&ticket===playRevision&&active(video))requestPlay();
  }catch(error){if(current()&&rev===revision){wanted=false;if(error?.name!=='AbortError')failure();}}
 };
 on(play,'click',()=>{if(!active(play))return;if(video.paused)requestPlay();else pause();});
 on(replay,'click',()=>{if(!active(replay))return;video.currentTime=0;requestPlay();});
 on(retry,'click',()=>{if(active(retry))void load(false);});
 on(back,'click',()=>{if(active(back))dialog.close();});
 on(dialog,'close',()=>dispose(true));
 on(video,'play',()=>{
  if(!active(video)||(playTask&&(!wanted||playTask.serial!==playRevision||playTask.revision!==revision))){pause();return;}
  wanted=true;beforePlay();if(current())play.textContent='Pause';
 });
 on(video,'pause',()=>{if(!video.paused)return;wanted=false;playRevision++;if(!disposed)play.textContent='Play';});
 on(video,'ended',()=>{wanted=false;if(!disposed)play.textContent='Play';updateCaption();});
 on(video,'timeupdate',updateCaption);on(video,'seeked',updateCaption);on(video,'error',failure);
 on(transcript,'toggle',()=>{if(transcript.open&&active(transcript))pause();});
 on(document,'visibilitychange',()=>{if(document.hidden)pause();});on(window,'pagehide',pause);on(document,'garden-speech-start',pause);
 observer=new MutationObserver(audit);observer.observe(document.documentElement,{childList:true,subtree:true});
 cleanup=dispose;pauseCurrent=pause;
 try{dialog.showModal();back.focus();}catch{dispose(false);if(entryStatus&&live())entryStatus.textContent=failed;return false;}
 void load(true);return true;
}
