// Original visit-local ideal-ramp activity. The notebook is an identity token only.
export const liftLengths=Object.freeze([2,3,4,6]);
const prefix=[[12,6,4],[24,6,6],[12,4,4],[24,4,6],[12,3,6],[24,12,3]];
const triples=[];
for(const weight of [12,24])for(const capacity of [2,3,4,6,8,12])for(const board of liftLengths)if(liftLengths.some(l=>l<=board&&weight/l<=capacity))triples.push([weight,capacity,board]);
export const liftCases=Object.freeze([...prefix,...triples.filter(t=>!prefix.some(p=>p.every((v,i)=>v===t[i])))].map(([weight,capacity,board])=>Object.freeze({weight,capacity,board})));
export const liftDestinations=Object.freeze(['Café pantry','Library supplies','Garden stores','Lantern supplies','Post Office stores','Mill stores']);
const freshWork=()=>({ramp:2,draft:2,distance:0,started:false,delivered:false,turn:'plan',notice:null});
export const freshLiftYard=()=>({offset:0,current:0,page:'work',representation:'yard',held:null,works:Array.from({length:6},freshWork)});
export const liftJob=(s,index=s.current)=>Number.isInteger(index)&&index>=0&&index<6?liftCases[(s.offset+index)%liftCases.length]:null;
export function liftView(s){
 const work=s.works[s.current],job=liftJob(s),length=work.turn==='plan'?work.draft:work.ramp;
 const distance=work.started&&length===work.ramp?work.distance:0,force=job.weight/length;
 return {work,job,length,distance,force,height:distance/length,energy:force*distance,fullWork:force*length,stock:length<=job.board,capacity:force<=job.capacity,planned:work.turn==='plan',done:work.started&&work.distance===work.ramp,count:s.works.filter(w=>w.delivered).length};
}
export function changeLift(s,action,value){
 if(!s)return null;
 const v=liftView(s),w=v.work;
 if(action==='board'&&!liftLengths.includes(value)||action==='job'&&(!Number.isInteger(value)||value<0||value>=6)||action==='view'&&!['yard','numbers'].includes(value))return null;
 const n={...s,works:s.works.map(x=>({...x}))},q=n.works[n.current];
 if(action==='board'&&w.turn==='plan'){q.draft=value;q.notice=null;}
 else if(action==='start'&&w.turn==='plan'){
  if(!v.stock)q.notice='stock';else if(!v.capacity)q.notice='force';else{if(!w.started||w.draft!==w.ramp)q.distance=0;q.ramp=w.draft;q.started=true;q.turn='pull';q.notice=null;}
 }else if(action==='plan'&&w.started){q.turn='plan';q.draft=w.ramp;q.notice=null;}
 else if(action==='keep'&&w.started){q.turn='pull';q.draft=w.ramp;q.notice=null;}
 else if(action==='pull'&&w.started&&w.turn==='pull'&&w.distance<w.ramp&&w.ramp<=v.job.board&&v.job.weight/w.ramp<=v.job.capacity){q.distance++;if(q.distance===q.ramp)q.delivered=true;}
 else if(action==='bottom'&&w.started){q.distance=0;q.notice=null;}
 else if(action==='jobs')n.page='jobs';
 else if(action==='return')n.page='work';
 else if(action==='job'){n.current=value;n.page='work';}
 else if(action==='view')n.representation=value;
 else if(action==='next'&&v.done){const next=Array.from({length:6},(_,i)=>(s.current+1+i)%6).find(i=>!s.works[i].delivered);if(next===undefined)n.page='jobs';else{n.current=next;n.page='work';}}
 else if(action==='hold'&&v.done)n.held={weight:v.job.weight,length:w.ramp};
 else if(action==='clear')n.held=null;
 else if(action==='shift'&&v.count===6)return {...freshLiftYard(),offset:(s.offset+6)%liftCases.length,representation:s.representation,held:s.held?{...s.held}:null};
 else return null;
 return n;
}
export function liftFraction(d,L){if(d===0)return '0';if(d===L)return '1';let a=d,b=L;while(b)[a,b]=[b,a%b];return `${d/a}/${L/a}`;}
export function liftComparison(weight,length,held){
 if(!held)return 'Keep a completed trip, then try another plan to compare.';
 if(weight===held.weight&&length===held.length)return 'The load and ramp length are the same.';
 if(weight===held.weight)return `Same load and height. The ${length>held.length?'current planned':'held'} ramp is longer: it needs less pull and more rope. Whole-trip rope work stays the same.`;
 if(length===held.length)return `Same ramp and height. The ${weight>held.weight?'current':'held'} load is heavier: it needs more pull and more whole-trip work.`;
 return 'Both load weight and ramp length changed. Compare the numbers; this does not isolate the effect of ramp length.';
}
export function liftGeometry(L,d){
 const u={x:Math.sqrt(L*L-1)/L,y:-1/L},n={x:-1/L,y:-Math.sqrt(L*L-1)/L},top={x:600,y:190},foot={x:600-80*Math.sqrt(L*L-1),y:270};
 const contact={x:foot.x+80*d*u.x,y:foot.y+80*d*u.y},centre={x:contact.x+18*n.x,y:contact.y+18*n.y};
 return {u,n,top,foot,contact,centre,anchor:{x:top.x+18*n.x+64*u.x,y:top.y+18*n.y+64*u.y}};
}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const point=p=>`${p.x},${p.y}`;
const button=(a,t,extra='')=>`<button type="button" data-lift-action="${a}" ${extra}>${esc(t)}</button>`;
const offset=(p,u,n,a,b)=>({x:p.x+a*u.x+b*n.x,y:p.y+a*u.y+b*n.y});
const support=(a,b)=>`${point(a)} ${point(b)} ${b.x},286 ${a.x},286`;
export function liftDrawing(v){
 const {u,n,top,foot,centre,anchor}=liftGeometry(v.length,v.distance),low=offset(foot,u,n,0,-8),high=offset(top,u,n,0,-8);
 const rope=offset(centre,u,n,18,0),desc=`${v.length} metre sloping board, one metre rise. ${v.distance} metres of rope pulled; height gained ${liftFraction(v.distance,v.length)} metre. Required steady rope pull ${v.force} newtons; winch limit ${v.job.capacity} newtons. Drum slides, not rolls.`;
 return `<svg data-lift-drawing viewBox="0 0 740 350" role="img" aria-labelledby="lift-picture-title lift-picture-desc"><title id="lift-picture-title">Sliding delivery on a model ramp</title><desc id="lift-picture-desc">${esc(desc)}</desc><rect width="740" height="350" fill="#d8eaf2"/><path d="M0 230Q120 187 230 231T460 225T740 224V350H0Z" fill="#cbdcc5"/><path d="M160 51h69m-54-7h49m85 27h62" stroke="#fffdf5" stroke-width="10" stroke-linecap="round" opacity=".8"/><rect data-lift-ground x="0" y="286" width="740" height="64" fill="#bfd2bd"/><path d="M16 302l8-5 8 5m310 22 8-5 8 5m120-16 8-5 8 5" fill="none" stroke="#8aa889" stroke-width="2"/>
 <g class="ly-timber"><rect data-lift-platform x="610" y="200" width="110" height="12"/>${[670,710].map(x=>`<rect data-lift-leg x="${x}" y="212" width="10" height="74"/>`).join('')}<polygon data-lift-foot-support points="${support(low,offset(foot,u,n,12,-8))}"/><polygon data-lift-top-support points="${support(offset(top,u,n,-16,-8),offset(top,u,n,-8,-8))}"/><polygon data-lift-board class="${v.stock?'':'ly-unsupplied'}" points="${point(foot)} ${point(top)} ${point(high)} ${point(low)}"/></g>
 <path data-lift-slope d="M${foot.x} ${foot.y}L${top.x} ${top.y}" stroke="#183f39" stroke-width="3" fill="none"/>
 ${Array.from({length:v.length+1},(_,d)=>{const p=offset(foot,u,n,80*d,-15);return `<g data-lift-metre="${d}"><path d="M${p.x} ${p.y}l${n.x*-6} ${n.y*-6}" stroke="#183f39"/><text x="${p.x}" y="${p.y+17}" text-anchor="middle">${d}</text></g>`;}).join('')}
 <text x="402" y="325" text-anchor="middle">Metres along the ramp</text><text x="460" y="174">Top mark</text><path d="M540 174L596 188" fill="none" stroke="#b2572e" stroke-width="1.5"/><circle cx="600" cy="190" r="4" fill="#b2572e"/>
 <rect data-lift-winch-post x="${anchor.x-4}" y="${anchor.y+6}" width="8" height="${200-anchor.y-6}" fill="#766642"/><circle data-lift-winch cx="${anchor.x}" cy="${anchor.y}" r="8" fill="#183f39"/>
 <line data-lift-rope x1="${rope.x}" y1="${rope.y}" x2="${anchor.x}" y2="${anchor.y}" stroke="#9b6f2d" stroke-width="3"/>
 <g data-lift-drum transform="translate(${centre.x} ${centre.y})"><circle r="18" fill="#c5a161" stroke="#183f39" stroke-width="2"/><path d="M-10-14V14M10-14V14" stroke="#79663f" stroke-width="2"/><text y="4" text-anchor="middle" class="ly-load">${v.job.weight}N</text></g>
 <g aria-hidden="true"><path d="M730 190V270m-5-80h10m-10 80h10" stroke="#183f39" stroke-width="2"/><text x="725" y="234" text-anchor="end">1 m</text><rect x="64" y="60" width="16" height="120" fill="#fffdf5" stroke="#547970"/><rect data-lift-force x="64" y="${180-v.force*10}" width="16" height="${v.force*10}" fill="#397958"/><path data-lift-capacity d="M54 ${180-v.job.capacity*10}H98" stroke="#b2572e" stroke-width="3"/>${[0,6,12].map(t=>`<text x="44" y="${185-t*10}" text-anchor="end">${t}</text>`).join('')}<text x="80" y="45">N</text></g></svg>`;
}
export function liftWorkDrawing(v,held){
 const grid=(x,weight,L,d,label,id)=>{const F=weight/L;return `<g data-lift-grid="${id}"><text x="${x}" y="27">${label}</text><text x="${x}" y="49">${F} N × ${L} m = ${F*L} J</text>${Array.from({length:F},(_,r)=>Array.from({length:L},(_,c)=>`<rect data-lift-cell="${id}" data-filled="${c<d}" x="${x+c*18}" y="${292-(r+1)*18}" width="18" height="18" fill="${c<d?(id==='held'?'#b98b45':'#397958'):'#fffdf5'}" stroke="#547970"/>`).join('')).join('')}<path d="M${x-5} 65V297H${x+120}" fill="none" stroke="#183f39"/><text x="${x}" y="319">Rope distance (m)</text><text transform="translate(${x-23} 225) rotate(-90)">Required pull (N)</text></g>`;};
 return `<svg data-lift-work-picture viewBox="0 0 740 350" role="img" aria-labelledby="lift-grid-title lift-grid-desc"><title id="lift-grid-title">A picture of rope work</title><desc id="lift-grid-desc">Each fixed-size cell represents one joule, from one newton through one metre. Current plan ${v.force} rows and ${v.length} columns; ${v.distance} columns filled, ${v.energy} joules so far.${held?` Held completed trip ${held.weight/held.length} rows and ${held.length} filled columns, ${held.weight/held.length*held.length} joules.`:''} This represents work, not square metres.</desc><rect width="740" height="350" fill="#f0eddc"/>${grid(90,v.job.weight,v.length,v.distance,v.planned?'Current planned trip':'Current trip','current')}${held?grid(430,held.weight,held.length,held.length,'Held completed trip','held'):'<text x="430" y="80">Keep a trip to compare.</text>'}</svg>`;
}
function instruction(v){return v.work.turn==='plan'?'Choose a ramp for this delivery. More than one can work.':v.done?'Delivery reached the top mark.':'Pull the rope one metre at a time. Watch the load rise.';}
function notice(v){if(v.work.notice==='stock')return `This delivery has boards up to ${v.job.board} m. Choose a supplied board.${v.work.started?' Your current trip is still waiting.':''}`;if(v.work.notice==='force')return `This ramp needs ${v.force} N. This winch can pull up to ${v.job.capacity} N. Try a longer supplied ramp.${v.work.started?' Your current trip is still waiting.':''}`;return '';}
function controls(v,held){
 const w=v.work,different=w.started&&w.draft!==w.ramp;
 if(w.turn==='plan')return `<div class="ly-boards" role="group" aria-label="Ramp length">${liftLengths.map(L=>button('board',`${L} m`,`data-lift-value="${L}" aria-pressed="${w.draft===L}"`)).join('')}</div><p class="ly-preview">${v.length} m ramp · needs ${v.force} N of steady rope pull${!v.stock?' · Planned board—not supplied for this delivery.':''}</p>${different?`<p>Your ${w.ramp} m trip waits at ${w.distance} m of rope pulled. This preview starts at the bottom.</p>${v.stock&&v.capacity?`<p>Starting this ramp ends your waiting ${w.ramp} m trip.</p>`:''}`:''}<div class="ly-actions">${button('start',w.started&&w.draft===w.ramp?'Continue this trip':different?'Start this ramp from the bottom':'Start this ramp','class="ly-primary"')}${different?button('keep','Keep current trip'):''}</div>`;
 return `<div class="ly-actions">${button('pull','Pull rope 1 m',`class="ly-primary" ${v.done?'disabled':''}`)}${v.done?button('next','Next delivery'):''}${button('plan','Change plan')}</div><div class="ly-tools">${v.done?button('hold',held?'Replace held trip':'Keep this trip'):''}${button('bottom','Return drum to start')}</div>`;
}
function details(v,opened){return `<details data-lift-details="model" ${opened.model?'open':''}><summary>About this model</summary><p>The drum slides; it does not roll. The rope pulls parallel to the board. We imagine steady movement with no friction or winch losses, and ignore starting and stopping. A holding brake keeps each checkpoint still. Real lifting takes suitable equipment and trained people.</p><p>Newtons (N) measure force, not mass. The winch adjusts its pull; its maximum is a limit, not the force used on every ramp. These are model equipment limits, not a real lifting plan.</p></details><details data-lift-details="why" ${opened.why?'open':''}><summary>Why does the work stay the same?</summary><p>Required pull = load weight × height ÷ ramp length. A 12 N load rising 1 m needs 12 J of rope work. On a 2 m ramp it needs 6 N for 2 m; on a 4 m ramp, 3 N for 4 m.</p><p>The rope's positive work increases gravitational potential energy of the load and Earth. All forces on the drum together do zero net work: rope +${v.fullWork} J, gravity −${v.job.weight*1} J, ramp support 0 J. Its speed stays constant. This is not a speed or power simulation.</p></details><details data-lift-details="sources" ${opened.sources?'open':''}><summary>Grown-ups: sources and limits</summary><p>Supplied teaching, not an assessment or physical experiment. No steps, support requests, reading or hearing results are added to notes.</p><p><a href="https://openstax.org/books/physics/pages/5-4-inclined-planes" target="_blank" rel="noopener noreferrer">OpenStax: inclined planes</a> · <a href="https://openstax.org/books/physics/pages/9-3-simple-machines" target="_blank" rel="noopener noreferrer">simple machines</a> · <a href="https://openstax.org/books/physics/pages/9-1-work-power-and-the-work-energy-theorem" target="_blank" rel="noopener noreferrer">work and energy</a></p></details>`;}
let visit=null,motion=null;
export function stopLiftMotion(){motion?.cancel();motion=null;}
export function resetLiftYard(){stopLiftMotion();visit=null;}
function current(book,owner){if(!visit||visit.book!==book||visit.owner!==owner){stopLiftMotion();visit={book,owner,model:freshLiftYard(),details:{}};}return visit;}
export function liftYardPage(book,owner){
 const local=current(book,owner),s=local.model,v=liftView(s),held=s.held,hear=`${liftDestinations[s.current]}. Load weight ${v.job.weight} newtons. Winch limit ${v.job.capacity} newtons. ${instruction(v)} ${v.length} metre ramp, required pull ${v.force} newtons. Rope pulled ${v.distance} of ${v.length} metres. Height gained ${liftFraction(v.distance,v.length)} metre. Rope work so far ${v.energy} joules.`;
 const complete=v.count===6?`<aside class="ly-complete" role="status"><strong>All six deliveries reached the top mark. The stores are stocked for this shift!</strong>${button('shift','Another shift')}<span>Try another set of deliveries. Your held trip and view stay; these six jobs start fresh.</span></aside>`:'';
 const jobs=`<section class="ly-jobs"><h2>Six deliveries · ${v.count} reached the top</h2><p>Every job is open. Your waiting trips stay where you left them.</p>${s.works.map((w,i)=>{const j=liftJob(s,i);return button('job',`${liftDestinations[i]} · ${j.weight} N · winch ${j.capacity} N · boards up to ${j.board} m${w.delivered?' · delivered':w.started?` · ${w.distance}/${w.ramp} m pulled`:''}`,`data-lift-value="${i}"`);}).join('')}${button('return','Return to current job')}</section>`;
 const main=`<div class="ly-toolbar"><div role="group" aria-label="View">${['yard','numbers'].map(r=>button('view',r==='yard'?'Yard':'Numbers',`data-lift-value="${r}" aria-pressed="${s.representation===r}"`)).join('')}</div>${button('jobs','Other deliveries')}</div><section class="ly-turn"><h2>${liftDestinations[s.current]} <small>· ${v.work.turn==='plan'?'Plan':'Pull'}</small></h2><p class="ly-tag">Load ${v.job.weight} N · winch limit ${v.job.capacity} N · boards ${liftLengths.filter(l=>l<=v.job.board).join(', ')} m · rise 1 m</p><figure class="ly-scene">${s.representation==='yard'?liftDrawing(v):liftWorkDrawing(v,held)}<figcaption>${s.representation==='yard'?`Required pull ${v.force} N · red line: winch limit ${v.job.capacity} N. Drawing symbols are not measured equipment.`:'Each cell = 1 J. Filled columns show work so far; the rectangles represent force × distance, not square metres.'}</figcaption></figure><div class="ly-console"><p class="ly-instruction" data-lift-instruction>${instruction(v)}</p>${controls(v,held)}<p class="ly-notice" role="status">${esc(notice(v))}</p></div><dl class="ly-facts"><div><dt>${v.planned?'Planned trip · rope pulled':'Rope pulled'}</dt><dd data-lift-distance>${v.distance} of ${v.length} m</dd></div><div><dt>Height gained</dt><dd>${liftFraction(v.distance,v.length)} m</dd></div><div><dt>Required rope pull</dt><dd>${v.force} N</dd></div><div><dt>Rope work so far</dt><dd>${v.energy} J</dd></div></dl><p class="ly-whole">Whole trip: ${v.length} m of rope × ${v.force} N = ${v.fullWork} J</p><button type="button" data-speak="${esc(hear)}">Hear this turn</button></section>`;
 return `<link rel="stylesheet" href="./lift-yard.css"><section class="ly-room" data-lift-root><header><a href="#workshop">← More workshop tables</a><p class="eyebrow">Willowbank · restocking the upper storeroom</p><h1 id="lift-title" tabindex="-1">The Lift Yard</h1><p>Choose a ramp, then pull the delivery to the top mark. A longer ramp can need less pull, but more rope.</p></header>${complete}${s.page==='jobs'?jobs:main}<section class="ly-held" aria-label="Compare completed trip"><h2>Held completed trip</h2>${held?`<p>${held.weight} N load · ${held.length} m ramp · ${held.weight/held.length} N pull · ${held.weight/held.length*held.length} J whole-trip work</p>${button('clear','Clear held trip')}`:''}<p>${liftComparison(v.job.weight,v.length,held)}</p>${held?'<p>A held trip does not prove it fits today’s stock or winch.</p>':''}</section><p class="ly-local">Jobs wait between yard turns. Leaving the yard or reloading starts a fresh shift. Nothing here changes your saved learning notes.</p>${details(v,local.details)}<a class="ly-exit" href="#workshop/fair">Compare cart landings</a></section>`;
}
function pose(root){const drum=root.querySelector('[data-lift-drum]');if(!drum)return null;const m=drum.transform.baseVal.consolidate()?.matrix;return m?{x:m.e,y:m.f}:null;}
function animatePull(root,from,live){
 if(!from||!root||!live()||matchMedia('(prefers-reduced-motion: reduce)').matches||typeof requestAnimationFrame!=='function')return;
 const drum=root.querySelector('[data-lift-drum]'),rope=root.querySelector('[data-lift-rope]'),to=pose(root);if(!drum||!rope||!to)return;
 const x=+rope.getAttribute('x1')-to.x,y=+rope.getAttribute('y1')-to.y;let frame=0,start=null,ended=false;
 const draw=p=>{drum.setAttribute('transform',`translate(${p.x} ${p.y})`);rope.setAttribute('x1',p.x+x);rope.setAttribute('y1',p.y+y);};
 const owned={cancel(){if(ended)return;ended=true;cancelAnimationFrame(frame);if(live())draw(to);root.removeAttribute('data-lift-moving');}};motion=owned;root.setAttribute('data-lift-moving','true');draw(from);
 const tick=time=>{if(ended||!live()){owned.cancel();if(motion===owned)motion=null;return;}if(start===null)start=time;const t=Math.min(1,(time-start)/180),e=1-(1-t)**2;draw({x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e});if(t<1)frame=requestAnimationFrame(tick);else{ended=true;root.removeAttribute('data-lift-moving');if(motion===owned)motion=null;}};frame=requestAnimationFrame(tick);
}
export function bindLiftYard(book,{explorerId,notebook,isActive,render,stopSpeech,stopSound}){
 const root=document.querySelector('[data-lift-root]');if(!root)return;const local=current(book,explorerId()),live=()=>visit===local&&root.isConnected&&notebook()===book&&explorerId()===local.owner&&isActive();
 root.querySelectorAll('[data-lift-details]').forEach(d=>d.addEventListener('toggle',()=>{if(live())local.details[d.dataset.liftDetails]=d.open;}));
 root.querySelectorAll('[data-lift-action]').forEach(b=>b.addEventListener('click',()=>{
  if(!live()||b.disabled)return;const a=b.dataset.liftAction,value=['board','job'].includes(a)?Number(b.dataset.liftValue):b.dataset.liftValue,old=local.model,next=changeLift(old,a,value);if(!next)return;
  const from=a==='pull'&&old.representation==='yard'?pose(root):null;stopSpeech();stopSound();stopLiftMotion();for(const d of root.querySelectorAll('[data-lift-details]'))local.details[d.dataset.liftDetails]=d.open;local.model=next;render();
  const newRoot=document.querySelector('[data-lift-root]'),newLive=()=>visit===local&&newRoot?.isConnected&&notebook()===book&&explorerId()===local.owner&&isActive();if(!newLive())return;
  if(from)animatePull(newRoot,from,newLive);
  let target=newRoot.querySelector(`[data-lift-action="${a}"]${['board','job','view'].includes(a)?`[data-lift-value="${value}"]`:''}`);
  if(a==='start'||a==='keep')target=newRoot.querySelector('[data-lift-action="pull"]')||target;
  if(a==='next'||a==='job'||a==='return'||a==='shift')target=newRoot.querySelector('[data-lift-action="start"],[data-lift-action="pull"],[data-lift-action="return"]');
  if(target?.disabled)target=newRoot.querySelector('[data-lift-action="next"],[data-lift-action="start"]');
  (target||newRoot.querySelector('#lift-title'))?.focus({preventScroll:true});
 }));
}
