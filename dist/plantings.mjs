// Participation changes the garden; these records are never skill evidence.
import {areas} from './broad-content.mjs';
import {renderModel,adjustModel} from './broad-ui.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kinds={number:'sunflower',operations:'strawberry',fractions:'water-lily',patterns:'moss-stone',geometry:'tulip',measurement:'bean',reasoning:'mushroom'};
const decorations=['birdbath','bench','scarecrow'];
const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
const integer=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
export function ensurePlantings(state){
 if(!obj(state.plantings))state.plantings={};const p=state.plantings;
 const seen=new Set(),slots=new Set();
 const valid=x=>obj(x)&&typeof x.event==='string'&&x.event.length>0&&x.event.length<=180&&
  (kinds[x.area]===x.kind||decorations.includes(x.kind))&&!seen.has(x.event);
 p.plots=(Array.isArray(p.plots)?p.plots:[]).filter(x=>{if(!valid(x)||!integer(x.bed,0,1000000000)||!integer(x.slot,0,11)||slots.has(`${x.bed}:${x.slot}`))return false;seen.add(x.event);slots.add(`${x.bed}:${x.slot}`);return true;}).map(x=>({event:x.event,bed:x.bed,slot:x.slot,kind:x.kind,area:kinds[x.area]?x.area:null,at:typeof x.at==='string'?x.at:''}));
 p.pending=(Array.isArray(p.pending)?p.pending:[]).filter(x=>{if(!valid(x))return false;seen.add(x.event);return true;}).map(x=>({event:x.event,kind:x.kind,area:kinds[x.area]?x.area:null,at:typeof x.at==='string'?x.at:''}));
 p.nextVisit=integer(p.nextVisit,0,1000000000)?p.nextVisit:0;
 p.openRecords=(Array.isArray(p.openRecords)?p.openRecords:[]).filter(x=>obj(x)&&typeof x.taskId==='string'&&typeof x.event==='string'&&['tried','later'].includes(x.response)).map(x=>({taskId:x.taskId,event:x.event,response:x.response,at:typeof x.at==='string'?x.at:''}));
 if(!obj(p.openDraft)||!openTasks().some(t=>t.id===p.openDraft.taskId)||typeof p.openDraft.event!=='string')p.openDraft=null;
 return p;
}
export function earnPlanting(state,event,area,helpKind=null){
 const p=ensurePlantings(state),kind=helpKind?({hint:'birdbath',model:'bench',helper:'scarecrow'}[helpKind]):kinds[area];
 if(!kind||typeof event!=='string'||event.length>180||[...p.plots,...p.pending].some(x=>x.event===event))return false;
 p.pending.push({event,kind,area:kinds[area]?area:null,at:new Date().toISOString()});return true;
}
export function plantSeed(state,event,bed,slot){
 const p=ensurePlantings(state),index=p.pending.findIndex(x=>x.event===event),lastBed=Math.floor(p.plots.length/12);
 if(index<0||!integer(bed,0,lastBed)||!integer(slot,0,11)||p.plots.some(x=>x.bed===bed&&x.slot===slot))return false;
 const seed=p.pending.splice(index,1)[0];p.plots.push({...seed,bed,slot});return true;
}
function plantArt(kind){
 const stems='<path d="M40 76V37m0 27q-25-20-22-5q4 13 22 5m0-9q23-20 22-4q-6 10-22 4" fill="#75a183" stroke="#397958" stroke-width="2"/>';
 const head=kind==='strawberry'?'<path d="M22 28q18-12 36 0q-3 32-18 39q-15-8-18-39" fill="#da8d8d"/><path d="m25 25 15 10 15-10-15-7Z" fill="#397958"/><path d="m33 41 2 2m12 3 2 2m-11 8 2 2" stroke="#fffef9" stroke-width="3"/>':kind==='water-lily'?'<ellipse cx="40" cy="59" rx="32" ry="17" fill="#90b9ae"/><path d="m40 53-19-14 14 1 5-20 7 20 14-1Z" fill="#da8d8d"/>':kind==='moss-stone'?'<path d="M10 67Q4 31 39 27Q72 26 72 67Z" fill="#abc4da"/><path d="M13 42q14-21 28-12q17-8 25 11" fill="none" stroke="#75a183" stroke-width="10"/>':kind==='mushroom'?'<path d="M33 72V40h15v32" fill="#e2cf9f"/><path d="M9 43q29-56 62 0Z" fill="#da8d8d"/><g fill="#fffef9"><circle cx="31" cy="31" r="4"/><circle cx="46" cy="25" r="4"/><circle cx="56" cy="36" r="4"/></g>':kind==='birdbath'?'<path d="M35 73V44h10v29M13 32q27 30 54 0Z" fill="#abc4da" stroke="#183f39" stroke-width="2"/><path d="M17 32h46" stroke="#397958" stroke-width="4"/>':kind==='bench'?'<path d="M15 34h50v17H15Zm-3 22h56v9H12Z" fill="#e2cf9f" stroke="#183f39" stroke-width="2"/><path d="M21 63v14m38-14v14" stroke="#183f39" stroke-width="4"/>':kind==='scarecrow'?'<path d="M40 75V35M13 40h54" stroke="#8b643b" stroke-width="5"/><path d="m26 36 14 9 14-9-3 26H29Z" fill="#abc4da"/><circle cx="40" cy="24" r="12" fill="#e2cf9f"/><path d="M23 16h34l-7-8H32Z" fill="#e9b84a"/>':kind==='bean'?`${stems}<path d="M39 74q-18-19 0-32q18-12 0-29" fill="none" stroke="#397958" stroke-width="4"/><ellipse cx="28" cy="40" rx="7" ry="14" fill="#90b9ae"/>`:`${stems}${kind==='tulip'?'<path d="m23 20 8 10 9-15 9 15 8-10v18q-17 22-34 0Z" fill="#da8d8d"/>':'<g fill="#e9b84a">'+Array.from({length:8},(_,i)=>`<circle cx="${40+15*Math.cos(i*Math.PI/4)}" cy="${30+15*Math.sin(i*Math.PI/4)}" r="9"/>`).join('')+'</g><circle cx="40" cy="30" r="10" fill="#8b643b"/>'}`;
 return `<svg viewBox="0 0 80 85" aria-hidden="true">${head}</svg>`;
}
export function seedOffer(state){const p=ensurePlantings(state);return p.pending.length?'<section class="seed-offer"><h2>A seed packet is waiting</h2><p>Taking part helps the storm garden grow. Every way of trying belongs here.</p><a class="primary" href="#regrow">Plant it</a></section>':'';}
export function plantingPage(state,requested=0){
 const p=ensurePlantings(state),last=Math.floor(p.plots.length/12),bed=integer(requested,0,last)?requested:last,seed=p.pending[0];
 return `<div class="page-heading"><a class="back" href="#numbers">← Number Garden</a><h1>After the rain, we plant.</h1><p>The storm left bare patches. Every kind of taking part can bring something back.</p></div><section class="regrowth-panel"><p>${seed?`${decorations.includes(seed.kind)?`A ${esc(seed.kind)} is ready for the garden.`:`A packet of ${esc(seed.kind.replaceAll('-',' '))} seeds is ready.`} Tap an empty patch to plant it.`:'Take a garden walk, try an adventure, or explore an open question. A seed packet will wait here.'}</p><div class="regrowth-bed" aria-label="A garden bed with three rows of four patches">${Array.from({length:12},(_,slot)=>{const planted=p.plots.find(x=>x.bed===bed&&x.slot===slot);return planted?`<div class="planted-patch" aria-label="${esc(planted.kind)}">${plantArt(planted.kind)}<span>${esc(planted.kind.replaceAll('-',' '))}</span></div>`:`<button class="empty-patch" data-plant-slot="${slot}" data-plant-bed="${bed}" ${!seed?'disabled':''} aria-label="Plant in row ${Math.floor(slot/4)+1}, column ${slot%4+1}"><span aria-hidden="true">＋</span><span>Plant here</span></button>`;}).join('')}</div><nav class="summary-links" aria-label="Garden beds">${bed>0?`<a class="secondary" href="#regrow/${bed-1}">Earlier patch</a>`:''}${bed<last?`<a class="secondary" href="#regrow/${bed+1}">Next patch</a>`:''}</nav><p class="tiny">Plants stay when you take a break. They never measure what you know.</p><a class="secondary" href="#activities">Find somewhere to explore</a></section>`;
}
export function openTasks(){
 return [...areas.map(a=>({id:`wonder-${a.id}`,area:a.id,title:`Wonder in ${a.place}`,prompt:a.activities[2].wonder,format:'wonder',model:structuredClone(a.activities[1].model)})),
 {id:'which-array',area:'operations',title:'Which one could be different?',prompt:'Choose an array that could be the odd one out. There is more than one way to explain your choice.',format:'which',model:{type:'array',rows:2,cols:6,item:'flower'}},
 {id:'estimate-seeds',area:'number',title:'A jar before we count',prompt:'About how many seeds might there be? Make an estimate together, then open the jar and count.',format:'estimate',model:{type:'counters',count:19,item:'seed'}},
 {id:'many-rectangles',area:'operations',title:'Many ways to make twenty-four',prompt:'Can you make 24 in three different rectangles? Keep the arrangements you want to talk about.',format:'many',model:{type:'array',rows:3,cols:8,item:'cup'}},
 {id:'shape-counterexample',area:'geometry',title:'Does every four-sided shape fold the same?',prompt:'Pip thinks every four-sided shape has four mirror lines. Try a shape or a fold that could change Pip’s mind.',format:'counterexample',model:{type:'shape',shape:'rectangle',turns:0}}];
}
export function startOpenTask(state,id){
 const p=ensurePlantings(state),task=openTasks().find(x=>x.id===id);if(!task)return null;
 if(p.openDraft?.taskId!==id){p.nextVisit++;p.openDraft={taskId:id,event:`open:${id}:${p.nextVisit}`,model:structuredClone(task.model),rectangles:[],input:'',opened:false,choice:null};}
 return task;
}
function cleanOpenModel(task,d){
 const base=task.model,m=d.model,maxSide=task.format==='many'?24:9;
 const whole=(v,a,b)=>integer(v,a,b);
 const valid=obj(m)&&m.type===base.type&&(m.type==='array'?whole(m.rows,1,maxSide)&&whole(m.cols,1,maxSide):
 m.type==='counters'?whole(m.count,0,40):m.type==='place'?whole(m.hundreds,0,9)&&whole(m.tens,0,12)&&whole(m.ones,0,20):
 m.type==='fraction'?whole(m.parts,2,12)&&whole(m.shaded,0,m.parts)&&(!m.shadedPieces||Array.isArray(m.shadedPieces)&&m.shadedPieces.every(n=>whole(n,0,m.parts-1))):
 m.type==='pattern'?Array.isArray(m.values)&&m.values.length>=2&&m.values.length<=10&&m.values.every(v=>whole(v,0,1000))&&whole(m.step,1,20):
 m.type==='shape'?['triangle','square','rectangle','hexagon'].includes(m.shape)&&whole(m.turns,0,3):
 m.type==='compass'?whole(m.turns,0,3):m.type==='ruler'?whole(m.max,1,20)&&whole(m.start,0,m.max)&&whole(m.end,m.start,m.max):false);
 if(!valid){d.model=structuredClone(base);return;}
 if(m.type==='array'){m.counted=Array.isArray(m.counted)?[...new Set(m.counted.filter(n=>integer(n,0,m.rows*m.cols-1)))]:[];}
 if(m.type==='fraction'&&m.shadedPieces){m.shadedPieces=[...new Set(m.shadedPieces)];m.shaded=m.shadedPieces.length;}
 if(m.foldAngle!==undefined&&!Number.isFinite(m.foldAngle))delete m.foldAngle;

}
export function openNumberTaskPage(state,id){
 const task=startOpenTask(state,id);if(!task)return '<p>This invitation is resting. <a href="#activities">Choose another.</a></p>';
 const d=state.plantings.openDraft;cleanOpenModel(task,d);const rectangles=Array.isArray(d.rectangles)?d.rectangles.filter(x=>Array.isArray(x)&&x.length===2&&x.every(n=>integer(n,1,24))&&x[0]*x[1]===24).slice(0,3):[];d.rectangles=rectangles;
 const model=task.format==='estimate'&&!d.opened?'<div class="estimate-jar" role="img" aria-label="A closed seed jar, with seeds partly overlapping">✿ · ✿ · ✿<br> · ✿ · ✿ ·<br>✿ · ✿ · ✿</div><label for="open-estimate">Our estimate</label><input id="open-estimate" inputmode="numeric" value="'+esc(/^\d{0,3}$/.test(d.input)?d.input:'')+'"><button class="secondary" data-open-action="open-jar">Open the jar</button>':renderModel(task,{model:d.model},true,{mode:'activity'}).replaceAll('data-model-action=','data-open-model-action=').replaceAll('Pip’s example','Our model').replaceAll("Pip's example",'Our model').replace('This is Our model. Change it to explore. Your turn uses new numbers.','Change this model to explore your ideas. No answer is scored.');
 return `<div class="page-heading"><a class="back" href="#activities/${task.area}">← More adventures</a><h1>${esc(task.title)}</h1><p>Talk, draw, build, or change your mind. This invitation has no scored answer.</p></div><article class="activity open-number-task"><h2>${esc(task.prompt)}</h2>${task.format==='which'?`<div class="choices">${[[2,6],[3,4],[4,3],[5,2]].map(([r,c],i)=>`<button class="choice ${d.choice===i?'selected':''}" data-open-array="${i}" aria-pressed="${d.choice===i}">${r} rows of ${c}</button>`).join('')}</div><p>Dot asks: What makes your choice different? Could someone defend another choice?</p>`:''}${model}${task.format==='many'?`<div class="summary-links">${[[1,24],[2,12],[3,8],[4,6]].map(([r,c])=>`<button class="secondary" data-open-rectangle="${r},${c}">Try ${r} ${r===1?'row':'rows'} of ${c}</button>`).join('')}</div><button class="secondary" data-open-action="keep-rectangle">Keep this rectangle</button><p class="tiny">We can keep up to three different rectangles with 24 places to discuss. Turning a rectangle keeps the same shape.</p><ul>${rectangles.map(([r,c])=>`<li>${r} rows of ${c}</li>`).join('')}</ul>`:''}${task.format==='estimate'&&d.opened?`<p>Our estimate: ${esc(d.input||'we wondered aloud')}. Count what is in the open jar, then compare together.</p>`:''}<p>Dot wonders: How would you explain your idea? Another answer may have a good reason, too.</p><div class="summary-links"><button class="primary" data-open-finish="tried">We tried it</button><button class="secondary" data-open-finish="later">Not today</button></div><p class="tiny">These buttons remember only that you visited the invitation, not what you know or what you made.</p></article>`;
}
export function finishOpenTask(state,response){
 const p=ensurePlantings(state),d=p.openDraft,task=d&&openTasks().find(x=>x.id===d.taskId);if(!task||!['tried','later'].includes(response))return false;
 p.openRecords.push({taskId:task.id,event:d.event,response,at:new Date().toISOString()});earnPlanting(state,d.event,task.area);p.openDraft=null;return true;
}
export function bindPlantings(state,{save,render,navigate,focus}){
 document.querySelectorAll('[data-plant-slot]').forEach(b=>b.onclick=()=>{const p=ensurePlantings(state);if(p.pending[0])plantSeed(state,p.pending[0].event,Number(b.dataset.plantBed),Number(b.dataset.plantSlot));save();render();focus?.('.regrowth-panel');});
 document.querySelectorAll('[data-open-finish]').forEach(b=>b.onclick=()=>{if(finishOpenTask(state,b.dataset.openFinish)){save();navigate('#regrow');}});
 document.querySelectorAll('[data-open-model-action]').forEach(b=>b.onclick=()=>{const d=state.plantings.openDraft,task=openTasks().find(t=>t.id===d?.taskId);if(!task)return;adjustModel(task,d,b.dataset.openModelAction);save();render();focus?.('.picture-playground');});
 document.querySelectorAll('[data-open-array]').forEach(b=>b.onclick=()=>{const d=state.plantings.openDraft,i=Number(b.dataset.openArray),pair=[[2,6],[3,4],[4,3],[5,2]][i];if(!d||!pair)return;d.choice=i;d.model={type:'array',rows:pair[0],cols:pair[1],item:'flower'};save();render();focus?.(`[data-open-array="${i}"]`);});
 document.querySelectorAll('[data-open-rectangle]').forEach(b=>b.onclick=()=>{const d=state.plantings.openDraft;if(!d||d.taskId!=='many-rectangles')return;const pair=b.dataset.openRectangle.split(',').map(Number);if(pair.length!==2||pair.some(n=>!integer(n,1,24))||pair[0]*pair[1]!==24)return;d.model={type:'array',rows:pair[0],cols:pair[1],item:'cup'};save();render();focus?.('.picture-playground');});
 document.querySelector('#open-estimate')?.addEventListener('input',e=>{state.plantings.openDraft.input=e.target.value.replace(/\D/g,'').slice(0,3);save();});
 document.querySelectorAll('[data-open-action]').forEach(b=>b.onclick=()=>{const d=state.plantings.openDraft;if(!d)return;if(b.dataset.openAction==='open-jar')d.opened=true;else if(d.model.rows*d.model.cols===24){d.rectangles??=[];if(d.rectangles.length<3&&!d.rectangles.some(([r,c])=>Math.min(r,c)===Math.min(d.model.rows,d.model.cols)&&Math.max(r,c)===Math.max(d.model.rows,d.model.cols)))d.rectangles.push([d.model.rows,d.model.cols]);}save();render();focus?.('.open-number-task');});
}
