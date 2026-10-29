// Original finite, visit-local Switch Table model; no notebook operations.
export const switchLayouts=Object.freeze([
 {id:'lamp',title:'Switch beside the lamp'},
 {id:'cell',title:'Switch near the cell'},
 {id:'left',title:'Switch on the left'},
 {id:'two',title:'Two switches, one loop'}
].map(Object.freeze));
export const freshSwitchTable=()=>({layout:'lamp',a:false,b:false,representation:'sketch',trace:false});
export function validSwitchTable(s){return !!s&&switchLayouts.some(x=>x.id===s.layout)&&typeof s.a==='boolean'&&typeof s.b==='boolean'&&['sketch','symbols'].includes(s.representation)&&typeof s.trace==='boolean';}
export function changeSwitchTable(s,action,value){
 if(!validSwitchTable(s))return null;
 if(action==='reset')return freshSwitchTable();
 if(action==='layout'&&switchLayouts.some(x=>x.id===value))return {...s,layout:value};
 if(action==='representation'&&['sketch','symbols'].includes(value))return {...s,representation:value};
 if(['a','b','trace'].includes(action)&&typeof value==='boolean'&&(action!=='b'||s.layout==='two'))return {...s,[action]:value};
 return null;
}
export function switchTableModel(s){
 if(!validSwitchTable(s))return null;
 const nodes={P:{x:290,y:260,label:'Cell positive end'},N:{x:230,y:260,label:'Cell negative end'},BR:{x:420,y:260,label:'Bottom right wire bend'},TR:{x:420,y:70,label:'Top right wire bend'},T:{x:270,y:70,label:'Bulb tip contact'},S:{x:210,y:70,label:'Bulb side contact'},TL:{x:60,y:70,label:'Top left wire bend'},BL:{x:60,y:260,label:'Bottom left wire bend'}},edges=[];
 const edge=(id,from,to,kind='wire',active=true,owner=null)=>edges.push({id,from,to,kind,active,owner});
 const bridge=(id,from,to,p0,p1,closed)=>{
  nodes[id+'0']={x:p0[0],y:p0[1],label:`Switch ${id} first contact`};nodes[id+'1']={x:p1[0],y:p1[1],label:`Switch ${id} second contact`};
  edge(id+'-lead-0',from,id+'0');edge(id+'-bridge',id+'0',id+'1','switch',closed,id);edge(id+'-lead-1',id+'1',to);
 };
 edge('cell', 'N','P','cell');edge('wire-p-br','P','BR');
 if(s.layout==='two')bridge('B','BR','TR',[420,175],[420,125],s.b);else edge('wire-br-tr','BR','TR');
 if(s.layout==='lamp')bridge('A','T','TR',[320,70],[370,70],s.a);else edge('wire-tr-t','TR','T');
 edge('filament','T','S','filament');edge('wire-s-tl','S','TL');
 if(['left','two'].includes(s.layout))bridge('A','TL','BL',[60,125],[60,175],s.a);else edge('wire-tl-bl','TL','BL');
 if(s.layout==='cell')bridge('A','BL','N',[110,260],[160,260],s.a);else edge('wire-bl-n','BL','N');
 const on=s.a&&(s.layout!=='two'||s.b),open=[...(!s.a?['A']:[]),...(s.layout==='two'&&!s.b?['B']:[])];
 return {nodes,edges,on,open,layout:switchLayouts.find(x=>x.id===s.layout),switches:s.layout==='two'?['A','B']:['A']};
}

export const switchCaptions=Object.freeze([
 {start:.3,end:5.9,text:'A switch: two contacts, a gap between them, and a metal bridge that can close it.'},
 {start:6,end:12.6,text:'Closed: the path is complete. The charges move all round at once, and the bulb glows.'},
 {start:12.6,end:15.6,text:'Open: the path is broken. Everything stops, and the bulb goes dark.'},
 {start:15.6,end:19.6,text:'Closed: on. Open: off. A switch makes no electricity. It only makes or breaks the path.'}
].map(Object.freeze));
const filmFraming='This short edited example repeats settled pictures so there is time to read. The dots stand for charges already around the circuit. The current begins almost together around a small circuit; charges do not race from the cell to the bulb. The film’s “everything stops” means the steady current, not all tiny motion. This is a model, not measured speed or brightness.';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn=(action,label,attrs='')=>`<button type="button" data-switch-action="${action}" ${attrs}>${esc(label)}</button>`;
const gaps=m=>m.open.length===2?'switches A and B':`switch ${m.open[0]}`;
const summary=m=>`Model bulb ${m.on?'on: complete path':'off: open path'}`;
const traceText=m=>m.on?'The whole complete loop is marked together.':`The path is broken at ${gaps(m)}. Wires stay neutral; every open gap is marked.`;
const switchText=(s,m)=>m.switches.map(id=>`Switch ${id} ${s[id.toLowerCase()]?'closed':'open'}`).join('; ');
let visit=null,filmCleanup=null,filmPause=null;
export function pauseSwitchFilm(){filmPause?.();}
export function stopSwitchFilm(){filmCleanup?.();filmCleanup=null;filmPause=null;}
export function resetSwitchTable(){stopSwitchFilm();visit=null;}
function current(book,owner){if(!visit||visit.book!==book||visit.owner!==owner)visit={book,owner,model:freshSwitchTable(),film:false,details:{},status:''};return visit;}
export function switchTableDrawing(s){
 const m=switchTableModel(s);if(!m)return '';
 const symbol=s.representation==='symbols',label=`${m.layout.title}. ${switchText(s,m)}. Model bulb ${m.on?'on':'off'}.`;
 const segment=e=>{
  const a=m.nodes[e.from],b=m.nodes[e.to],attrs=`data-switch-edge="${e.id}" data-from="${e.from}" data-to="${e.to}" data-kind="${e.kind}" data-connected="${e.active}"`,highlight=s.trace&&m.on?' st-complete':'';
  if(e.kind==='wire')return `<path ${attrs} class="st-wire${highlight}" d="M${a.x} ${a.y}L${b.x} ${b.y}"/>`;
  if(e.kind==='switch'){
   const vertical=a.x===b.x,tip=e.active?b:{x:vertical?a.x+30:a.x+35,y:vertical?(a.y+b.y)/2:a.y-28};
   return `<g ${attrs} class="st-contact${highlight}" data-switch-contact="${e.owner}">${s.trace&&!e.active?`<ellipse data-switch-gap="${e.owner}" class="st-gap" cx="${(a.x+b.x)/2}" cy="${(a.y+b.y)/2}" rx="${vertical?28:38}" ry="${vertical?38:28}"/>`:''}<path data-switch-blade d="M${a.x} ${a.y}L${tip.x} ${tip.y}"/><circle data-contact-end="first" cx="${a.x}" cy="${a.y}" r="4"/><circle data-contact-end="second" cx="${b.x}" cy="${b.y}" r="4"/><text aria-hidden="true" x="${vertical?a.x-17:(a.x+b.x)/2}" y="${vertical?a.y-10:a.y+26}" text-anchor="middle">${e.owner}</text></g>`;
  }
  if(e.kind==='cell')return `<g ${attrs} class="st-cell${highlight}">${symbol?'<path data-component-path d="M230 260H250M250 247V273M270 238V282M270 260H290"/>':'<rect x="230" y="242" width="53" height="36" rx="3"/><path data-component-path d="M283 252H290V268H283"/>'}<text aria-hidden="true" x="230" y="305" text-anchor="middle">−</text><text aria-hidden="true" x="290" y="305" text-anchor="middle">+</text></g>`;
  return `<g ${attrs} class="st-bulb${highlight}">${m.on?`<circle data-switch-glow cx="240" cy="${symbol?70:51}" r="43" class="st-glow"/>`:''}${symbol?'<path data-component-path d="M210 70H218M262 70H270M224 54L256 86M224 86L256 54"/><circle class="st-symbol-lamp" cx="240" cy="70" r="22"/>':'<path class="st-glass" d="M210 70C180 5 300 5 270 70L266 92H214Z"/><path data-component-path d="M210 70H220L225 58L235 80L245 58L255 80L260 70H270"/><circle cx="210" cy="70" r="3"/><circle cx="270" cy="70" r="3"/>'}</g>`;
 };
 return `<svg data-switch-drawing viewBox="0 0 480 325" role="img" aria-labelledby="switch-picture-title switch-picture-desc"><title id="switch-picture-title">${esc(label)}</title><desc id="switch-picture-desc">${symbol?'Circuit symbols':'Connection sketch'}. One cell and one filament bulb in a single loop. ${m.switches.length===2?'Two switches':'One switch'}. ${m.on?'Complete path':`Path broken at ${gaps(m)}`}. The two views show the same connections. ${s.trace?traceText(m):''}</desc>${m.edges.map(segment).join('')}</svg>`;
}
function tables(s,m){return `<table data-switch-connections><caption>Connections in the current model</caption><thead><tr><th>Component</th><th>First contact</th><th>Second contact</th><th>Connection</th></tr></thead><tbody>${m.edges.map(e=>`<tr data-switch-row="${e.id}"><th>${e.owner?'Switch '+e.owner:e.kind==='wire'?'Wire':e.kind==='cell'?'Cell':'Bulb filament'}</th><td>${esc(m.nodes[e.from].label)}</td><td>${esc(m.nodes[e.to].label)}</td><td>${e.active?'Connected':'Open gap'}</td></tr>`).join('')}</tbody></table><table data-switch-states><caption>${s.layout==='two'?'Both switches must close':'One switch in this loop'}</caption><thead><tr><th>Switch A</th><th>Switch B</th><th>Model bulb</th></tr></thead><tbody>${(s.layout==='two'?[[false,false],[false,true],[true,false],[true,true]]:[[false,null],[true,null]]).map(([a,b])=>`<tr><td>${a?'Closed':'Open'}</td><td>${b===null?'Not used':b?'Closed':'Open'}</td><td>${a&&(b===null||b)?'On':'Off'}</td></tr>`).join('')}</tbody></table>`;}
function moviePage(){return `<section class="st-movie" data-switch-movie><h2>A switch up close · edited excerpt</h2><p>${filmFraming}</p><video controls playsinline muted preload="none" poster="./assets/switch-excerpt.jpg" aria-label="A switch up close, silent edited excerpt" aria-describedby="switch-current-caption"></video><p class="st-caption" id="switch-current-caption" data-switch-caption>Read the complete transcript below at any time.</p><div class="st-movie-controls">${btn('play','Play','disabled')}${btn('replay','Replay','disabled')}${btn('retry','Retry loading')}${btn('return','Return to the switch table')}</div><p data-switch-load-status role="status"></p><details data-switch-transcript><summary>Read the complete film transcript</summary><ol>${switchCaptions.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ol><p>Edited excerpt from the original <em>After the Storm</em> film made with Claude Motion; lettering Andika (SIL, OFL 1.1), rendered in the picture only.</p></details></section>`;}
export function switchTablePage(book,owner){
 const v=current(book,owner),s=v.model,m=switchTableModel(s),openText=m.on?'The switch contacts join, and there is a complete conducting loop through the bulb and cell.':`${m.open.length===2?'Switches A and B are open.':`Switch ${m.open[0]} is open.`} Any open switch breaks this single loop.`,hear=`${m.layout.title}. ${switchText(s,m)}. ${summary(m)}. ${openText} ${s.layout==='two'?'Both switches must close.':''}`;
 return `<link rel="stylesheet" href="./switch-table.css"><section class="st-room" data-switch-root><header><a href="#workshop/lantern">← Back to the Lantern Circuit Bench</a><p class="eyebrow">Storm Workshop · lanterns for the gathering</p><h1 id="switch-title" tabindex="-1">The Switch Table</h1>${v.film?'':'<p>Moss is preparing pretend battery lanterns. Can you make the path complete, then break it somewhere else?</p>'}</header>${v.film?moviePage():`<div class="st-workbench"><figure class="st-picture">${switchTableDrawing(s)}<figcaption><strong>One cell · one filament bulb</strong><span>${s.representation==='symbols'?'Standard circuit symbols':'Explanatory connection sketch'}</span><span>${switchText(s,m)}</span></figcaption></figure><section class="st-controls" aria-label="Change the lantern loop"><label for="switch-layout">Switch positions</label><select id="switch-layout" data-switch-layout>${switchLayouts.map(x=>`<option value="${x.id}" ${s.layout===x.id?'selected':''}>${x.title}</option>`).join('')}</select><h2 data-switch-result>${summary(m)}</h2><p class="st-result-explanation">${openText}</p><div class="st-toggle-controls">${m.switches.map(id=>btn(id.toLowerCase(),`${s[id.toLowerCase()]?'Open':'Close'} switch ${id}`,`aria-pressed="${s[id.toLowerCase()]}"`)).join('')}</div><p class="st-layout-note">${s.layout==='two'?'Both switches must close. Switch B adds another possible gap.':'Moving this switch within the same loop keeps its setting. The one-switch drawing has plain wire where B would be.'}</p><div class="st-views" role="group" aria-label="Drawing style">${['sketch','symbols'].map(k=>btn(k,k==='sketch'?'Connection sketch':'Circuit symbols',`aria-pressed="${s.representation===k}"`)).join('')}</div><div class="st-tools">${btn('trace',s.trace?'Hide path':'Show path',`aria-pressed="${s.trace}"`)}${btn('reset','Start again')}</div>${s.trace?`<p class="st-trace-note">${traceText(m)}</p>`:''}<p class="st-status" role="status">${esc(v.status)}</p><button type="button" class="st-hear" data-speak="${esc(hear)}">Hear this turn</button></section></div><div class="st-invitation">${btn('watch','Watch a switch up close')}<span>Optional silent edited example · 20 seconds</span></div><details data-switch-details="connections" ${v.details.connections?'open':''}><summary>${v.details.connections?'Hide the connections and switch table':'Read the connections and switch table'}</summary>${tables(s,m)}</details><details data-switch-details="idea" ${v.details.idea?'open':''}><summary>What changes, and what stays the same?</summary><p>The sketch and circuit symbols show the same connections. Neither is a photograph. The cell provides energy; charges are already throughout the circuit. A switch makes or breaks a conducting path, not electricity. No measured current, brightness, temperature or signal speed is shown.</p><p>Which changes break a connection? Which just move where it is drawn? Tell someone what you noticed. No answer or conversation is recorded.</p></details><details data-switch-details="grownups" ${v.details.grownups?'open':''}><summary>Grown-ups: model and sources</summary><p>This is supplied teaching in an ideal steady-state screen model. No real equipment is needed. This is not a physical result, timed assessment, independent explanation or mastery claim. The charge-flow response is rapid but not literally instantaneous. Settings and conversation stay local to this visit. Future tasks must not treat absence of an exposure record as proof the example was unfamiliar.</p><p>Bulb side and tip are separate contacts joined by the filament. Here the sketch lays out their connections; it does not show literal apparatus positions. In the standard symbols the long cell plate is positive. A one-switch layout replaces the second switch with plain wire; its remembered setting is not a hidden physical gap.</p><a href="https://spark.iop.org/electrical-flow-all-together-now" target="_blank" rel="noopener noreferrer">IOP: current around a loop</a> · <a href="https://spark.iop.org/do-electrical-charges-move-instantly" target="_blank" rel="noopener noreferrer">IOP: a rapid, finite response</a></details>`}</section>`;
}
export function bindSwitchTable(book,{explorerId,notebook,isActive,render,beforePlay,stopSound,stopSpeech}){
 const root=document.querySelector('[data-switch-root]');if(!root)return;const v=current(book,explorerId()),live=()=>visit===v&&root.isConnected&&notebook()===book&&explorerId()===v.owner&&isActive();
 function redraw(action){render();document.querySelector(action==='layout'?'[data-switch-layout]':`[data-switch-action="${action}"]`)?.focus({preventScroll:true});}
 root.querySelectorAll('[data-switch-details]').forEach(d=>d.addEventListener('toggle',()=>{if(live()){v.details[d.dataset.switchDetails]=d.open;if(d.dataset.switchDetails==='connections')d.querySelector('summary').textContent=d.open?'Hide the connections and switch table':'Read the connections and switch table';}}));
 root.querySelector('[data-switch-layout]')?.addEventListener('change',e=>{if(!live())return;const next=changeSwitchTable(v.model,'layout',e.target.value);if(!next)return;stopSound();stopSpeech();v.model=next;v.status=`${switchLayouts.find(x=>x.id===next.layout).title}. ${next.layout==='two'?'Switch B is now in the loop.':'This drawing has one switch and plain wire elsewhere.'}`;redraw('layout');});
 root.querySelectorAll('[data-switch-action]').forEach(b=>b.addEventListener('click',()=>{
  if(!live()||b.disabled)return;const a=b.dataset.switchAction;if(v.film&&!['return'].includes(a))return;
  stopSound();stopSpeech();for(const d of root.querySelectorAll('[data-switch-details]'))v.details[d.dataset.switchDetails]=d.open;
  if(a==='watch'){v.film=true;redraw('return');return;}if(a==='return'){v.film=false;stopSwitchFilm();redraw('watch');return;}
  const next=changeSwitchTable(v.model,['sketch','symbols'].includes(a)?'representation':a,['sketch','symbols'].includes(a)?a:['a','b','trace'].includes(a)?!v.model[a]:undefined);if(!next)return;v.model=next;v.status=summary(switchTableModel(next));redraw(a);
 }));
 root.addEventListener('click',e=>{if(e.target.closest?.('[data-speak]')&&!live()){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 if(v.film){bindSwitchMovie(root,()=>live()&&v.film,beforePlay);root.addEventListener('keydown',e=>{if(e.key==='Escape'&&live()){e.preventDefault();v.film=false;stopSwitchFilm();redraw('watch');}});}
}
function bindSwitchMovie(root,live,beforePlay){
 stopSwitchFilm();const video=root.querySelector('video'),play=root.querySelector('[data-switch-action=play]'),replay=root.querySelector('[data-switch-action=replay]'),retry=root.querySelector('[data-switch-action=retry]'),status=root.querySelector('[data-switch-load-status]'),caption=root.querySelector('[data-switch-caption]');
 let disposed=false,revision=0,playRevision=0,wanted=false,controller=null,source=null,track=null,playTask=null;const off=[];
 const on=(target,event,fn)=>{target.addEventListener(event,fn);off.push(()=>target.removeEventListener(event,fn));};
 const current=()=>!disposed&&live(),active=()=>current()&&!document.hidden;
 const pause=()=>{wanted=false;playRevision++;video.pause();if(current())play.textContent='Play';};filmPause=pause;
 const detach=()=>{video.removeAttribute('src');track?.remove();track=null;video.load();if(source){URL.revokeObjectURL(source);source=null;}};
 const failure=()=>{if(current())status.textContent='The film could not play here. Read the transcript or return to the table.';};
 const updateCaption=()=>{if(current())caption.textContent=(video.ended?switchCaptions.at(-1):switchCaptions.find(c=>video.currentTime>=c.start&&video.currentTime<c.end))?.text||'\u00a0';};
 const requestPlay=()=>{if(!active()||!source)return;wanted=true;const serial=++playRevision,task={serial,revision};playTask=task;try{Promise.resolve(video.play()).then(()=>{if(playTask!==task)return;playTask=null;if(!active()||!wanted||serial!==playRevision||task.revision!==revision)video.pause();}).catch(e=>{if(playTask===task)playTask=null;if(e?.name!=='AbortError'&&current()&&serial===playRevision&&task.revision===revision){wanted=false;failure();}});}catch{playTask=null;wanted=false;failure();}};
 const load=async auto=>{
  if(!current())return;pause();controller?.abort();const rev=++revision;detach();controller=new AbortController();const signal=controller.signal;play.disabled=true;replay.disabled=true;status.textContent='Loading the short film…';wanted=auto&&!matchMedia('(prefers-reduced-motion: reduce)').matches;const ticket=playRevision;
  try{const response=await fetch('./assets/switch-excerpt.mp4',{signal});if(!response.ok)throw Error('Unavailable');const blob=await response.blob();if(!current()||rev!==revision)return;
   source=URL.createObjectURL(new Blob([blob],{type:'video/mp4'}));video.muted=true;video.src=source;track=document.createElement('track');track.kind='captions';track.srclang='en';track.label='English';track.src='./assets/switch-excerpt.vtt';video.append(track);track.track.mode='hidden';play.disabled=false;replay.disabled=false;status.textContent='';if(wanted&&ticket===playRevision&&active())requestPlay();
  }catch(e){if(current()&&rev===revision){wanted=false;status.textContent='';if(e?.name!=='AbortError')failure();}}
 };
 on(play,'click',()=>{if(!active()||play.disabled)return;if(video.paused)requestPlay();else pause();});on(replay,'click',()=>{if(!active()||replay.disabled)return;video.currentTime=0;requestPlay();});on(retry,'click',()=>{if(current())void load(false);});
 on(video,'play',()=>{if(!active()||(playTask&&(!wanted||playTask.serial!==playRevision||playTask.revision!==revision))){pause();return;}wanted=true;beforePlay();play.textContent='Pause';});on(video,'pause',()=>{wanted=false;playRevision++;if(current())play.textContent='Play';});on(video,'ended',()=>{wanted=false;updateCaption();});on(video,'timeupdate',updateCaption);on(video,'seeked',updateCaption);on(video,'error',failure);
 on(root.querySelector('[data-switch-transcript]'),'toggle',e=>{if(e.target.open&&current())pause();});on(document,'visibilitychange',()=>{if(document.hidden)pause();});on(window,'pagehide',pause);
 filmCleanup=()=>{disposed=true;wanted=false;revision++;playRevision++;controller?.abort();off.forEach(fn=>fn());video.pause();detach();};void load(true);
}
