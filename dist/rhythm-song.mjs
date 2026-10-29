import {SONG_COPY as C,SONG_PATTERNS,SONG_NOTE_LABELS,SONG_UNITS,SONG_WORDS} from './rhythm-song-content.mjs';
import {readableRhythmSong,requestRhythmSongSound} from './rhythm-core.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(key,text,disabled=false)=>`<button type="button" class="secondary" data-song-${key}${disabled?' disabled':''}>${text}</button>`;
export function songSupport(note,{when='current',present=true}={}){
 const suffix=when==='check'?' before this check':when==='keep'?' before this kept version':'';
 if(!readableRhythmSong(note))return `<p>${present?'No readable song note captured'+suffix+'.':'This earlier record has no song note.'}</p>`;
 return `<p>Song made available in this notebook${suffix}: ${esc(note.source.title)}.${note.soundRequested?` Song sound requested${suffix}.`:''}</p>`;
}
export function rhythmSongPage(){return `<section class="rhythm-paper rhythm-song" data-rhythm-song>
 <h2 id="rhythm-song-title" tabindex="-1">Fill the Bar</h2><p>${C.before}</p>
 <div class="song-stage"><div class="song-screen"><video muted playsinline preload="none" tabindex="0" poster="./assets/fill-the-bar-poster.jpg" aria-label="Fill the Bar, a song about four-beat bars" aria-describedby="song-picture-note"></video>
 <p class="song-lyric" data-song-lyric>Words appear here as each line arrives.</p>
 <p>The words follow each line, rather than each tap.</p></div><div class="song-console"><p id="song-picture-note">Sound starts when you choose Sound on. Sound never restarts the picture.</p>
 <div class="rhythm-controls">${button('play','Play',true)}${button('replay','Replay',true)}<button type="button" class="secondary" data-song-sound aria-pressed="false" disabled>Sound on</button>${button('retry','Try loading again')}</div>
 <label class="song-position">Position in the song <input type="range" data-song-seek min="0" max="125.034" step="0.1" value="0" aria-valuetext="0 minutes, 0 seconds" disabled><span data-song-time>0:00 / 2:05</span></label>
 <p data-song-status role="status"></p><p data-song-sound-status role="status"></p>
 ${button('return','Return to my rhythm')}</div></div>
 <details data-song-words><summary>Read the song words</summary><div class="song-words">${SONG_WORDS.map(line=>`<p>${esc(line)}</p>`).join('')}</div></details>
 <details><summary>The song's patterns</summary><p>In the studio you can use whole, half and quarter notes and quarter rests.</p>${SONG_PATTERNS.map(p=>`<figure class="song-pattern"><figcaption>${esc(p.title)}</figcaption><div class="song-counts" aria-hidden="true"><span>1</span><span>2</span><span>3</span><span>4</span></div><div class="song-blocks" aria-hidden="true">${p.pattern.map(code=>`<span class="song-block song-${code}" style="grid-column:span ${SONG_UNITS[code]}">${code==='w'?'1':code==='h'?'1/2':code==='e'?'1/8':code==='rq'?'rest · 1/4':'1/4'}</span>`).join('')}</div><p>${esc(p.text)}</p>${p.id==='eighths'?`<p>${SONG_NOTE_LABELS.e}</p>`:''}</figure>`).join('')}</details>
 <details><summary>A rest belongs to one part</summary><p>${C.rest}</p></details>
 <details><summary>Shorter notes, the same steady beat</summary><p>${C.lengths}</p></details>
 <p>${C.invitationAfter}</p><p class="song-credit">Original song made with ElevenLabs Music; adult stock spoken voices from ElevenLabs; original picture made with Claude Motion.</p>
 </section>`;}
let cleanup=null,pauseCurrent=null;
export function pauseRhythmSong(){pauseCurrent?.();}
export function stopRhythmSong(){cleanup?.();cleanup=null;pauseCurrent=null;}
export function bindRhythmSong(state,ctx,{autoplay=false}={}){
 stopRhythmSong();const root=document.querySelector('[data-rhythm-root]'),host=root?.querySelector('[data-rhythm-song]');if(!host)return;
 const owner=ctx.explorerId(),video=host.querySelector('video'),play=host.querySelector('[data-song-play]'),sound=host.querySelector('[data-song-sound]'),retry=host.querySelector('[data-song-retry]'),seek=host.querySelector('[data-song-seek]'),status=host.querySelector('[data-song-status]'),soundStatus=host.querySelector('[data-song-sound-status]'),lyric=host.querySelector('[data-song-lyric]'),clock=host.querySelector('[data-song-time]');
 let disposed=false,loading=null,controller=null,url=null,track=null,trackFailed=false,wanted=false,serial=0;
 const listeners=[],on=(el,type,fn)=>{el.addEventListener(type,fn);listeners.push(()=>el.removeEventListener(type,fn));};
 const current=()=>!disposed&&root.isConnected&&document.querySelector('[data-rhythm-root]')===root&&location.hash==='#studio/rhythm'&&ctx.notebook()===state&&ctx.explorerId()===owner&&ctx.isActive?.()!==false&&ctx.activeTurn();
 const active=()=>current()&&!document.hidden&&!root.hidden&&!document.querySelector('dialog.welcome-film[open]');
 const updateSound=()=>{sound.textContent=video.muted?'Sound on':'Sound off';sound.setAttribute('aria-pressed',String(!video.muted));};
 const pause=()=>{wanted=false;serial++;video.pause();play.textContent='Play';};pauseCurrent=pause;
 const fail=()=>{if(current()){status.textContent=C.failure;retry.hidden=false;}};
 const timeText=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 const caption=()=>{if(!current())return;if(trackFailed){lyric.textContent='Live lyrics are unavailable. Read the song words below.';return;}const cues=track?.track.cues&&Array.from(track.track.cues),cue=cues?.find(c=>video.currentTime>=c.startTime&&video.currentTime<c.endTime);lyric.textContent=video.ended||cues?.length&&video.currentTime>=cues.at(-1).endTime?SONG_WORDS.at(-1):cue?.text||'\u00a0';};
 const updateTime=()=>{if(!current())return;if(!active()&&!video.paused)pause();const t=video.currentTime,d=Number.isFinite(video.duration)?video.duration:125.034;seek.value=String(t);seek.setAttribute('aria-valuetext',`${Math.floor(t/60)} minutes, ${Math.floor(t%60)} seconds`);clock.textContent=`${timeText(t)} / ${timeText(d)}`;caption();};
 const playNow=()=>{if(!active()||!url)return;ctx.stopTones?.();ctx.stopSpeech?.();wanted=true;const ticket=++serial;try{Promise.resolve(video.play()).then(()=>{if(!active()||!wanted){video.pause();return;}if(ticket===serial)play.textContent='Pause';}).catch(error=>{if(error?.name==='AbortError')return;if(ticket===serial&&active()){wanted=false;play.textContent='Play';fail();}});}catch{wanted=false;fail();}};
 const load=()=>{
  if(loading)return loading;controller=new AbortController();status.textContent='Loading the song…';retry.hidden=true;
  loading=(async()=>{const response=await fetch('./assets/fill-the-bar.mp4',{signal:controller.signal});if(!response.ok)throw Error('Song unavailable');const blob=await response.blob();if(!current()){if(!disposed){loading=null;status.textContent='';}return false;}
   url=URL.createObjectURL(new Blob([blob],{type:'video/mp4'}));const ownTrack=document.createElement('track');track=ownTrack;trackFailed=false;ownTrack.kind='captions';ownTrack.srclang='en';ownTrack.label='English';ownTrack.src='./assets/fill-the-bar.vtt';ownTrack.default=true;video.append(ownTrack);ownTrack.track.mode='hidden';
   on(ownTrack,'load',()=>{if(current()&&track===ownTrack){ownTrack.track.mode='hidden';caption();}});on(ownTrack,'error',()=>{if(track===ownTrack){trackFailed=true;caption();}});video.src=url;return true;
  })().catch(error=>{loading=null;if(!disposed){status.textContent='';if(error?.name!=='AbortError')fail();}return false;});return loading;
 };
 const detachSource=()=>{video.removeAttribute('src');video.load();track?.remove();track=null;if(url){URL.revokeObjectURL(url);url=null;}};
 on(video,'loadedmetadata',()=>{if(!current())return;host.querySelectorAll('[data-song-play],[data-song-replay],[data-song-sound],[data-song-seek]').forEach(e=>e.disabled=false);seek.max=String(video.duration);status.textContent='';updateTime();});
 on(play,'click',()=>{if(!active())return;if(video.paused)playNow();else pause();});
 on(host.querySelector('[data-song-replay]'),'click',()=>{if(active()){video.currentTime=0;playNow();}});
 on(sound,'click',()=>{if(!active())return;if(video.muted){const before=state.rhythm;if(!requestRhythmSongSound(state,{canExport:ctx.canExport})){soundStatus.textContent=C.refusal;return;}if(state.rhythm!==before)ctx.save();if(!active())return;try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}video.muted=false;soundStatus.textContent=video.paused?'Sound will join when the song plays.':'';}else{video.muted=true;soundStatus.textContent='';}updateSound();});
 on(seek,'input',()=>{if(!active()||!Number.isFinite(video.duration))return;pause();video.currentTime=Math.max(0,Math.min(video.duration,Number(seek.value)));updateTime();});
 on(retry,'click',()=>{if(!active())return;pause();controller?.abort();detachSource();loading=null;video.muted=true;updateSound();host.querySelectorAll('[data-song-play],[data-song-replay],[data-song-sound],[data-song-seek]').forEach(e=>e.disabled=true);void load();});
 on(host.querySelector('[data-song-return]'),'click',()=>{if(current())ctx.onReturn();});
 on(host,'keydown',e=>{if(!current())return;if(e.key==='Escape'){e.preventDefault();ctx.onReturn();}else if(e.code==='Space'&&e.target===video){e.preventDefault();if(video.paused)playNow();else pause();}});
 on(host.querySelector('[data-song-words]'),'toggle',()=>{if(current()&&host.querySelector('[data-song-words]').open)pause();});
 on(video,'play',()=>{if(!active()){pause();return;}play.textContent='Pause';});on(video,'pause',()=>{if(current())play.textContent='Play';});on(video,'timeupdate',updateTime);on(video,'seeked',updateTime);on(video,'ended',()=>{wanted=false;updateTime();});on(video,'error',fail);
 on(document,'visibilitychange',()=>{if(document.hidden)pause();});on(window,'pagehide',pause);on(window,'hashchange',()=>{if(!current())pause();});
 cleanup=()=>{disposed=true;pause();controller?.abort();listeners.forEach(off=>off());detachSource();};
 video.muted=true;video.volume=.5;updateSound();const ticket=++serial;wanted=autoplay;void load().then(ready=>{if(ready&&ticket===serial&&wanted&&active())playNow();});
}
