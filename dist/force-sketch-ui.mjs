import {forceScenes,forceTeaching} from './force-sketch-content.mjs';
import {createForceSketch,changeForceSketch,forceSketchModel,forceSketchNarration} from './force-sketch-core.mjs';
import {pushDriftActive} from './push-drift-ui.mjs';
import {stopSpeech} from './play-media.mjs';

const visits=new WeakMap();
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bytes=x=>{try{return JSON.stringify(x);}catch{return null;}};
const ownerOK=x=>typeof x==='string'&&x.trim().length>0;
const routeOK=r=>r==='#learn/science'||r.startsWith('#learn/science/');
function visit(book,owner,create=false){
 if(!book||typeof book!=='object'||!ownerOK(owner))return null;
 let owners=visits.get(book);if(!owners&&create){owners=new Map();visits.set(book,owners);}
 let v=owners?.get(owner);if(!v&&create){v={work:createForceSketch(),activeRoute:null,boundRoot:null,generation:0,entryNode:null,notice:'',cluesOpen:false};owners.set(owner,v);}return v;
}
export function forceSketchActive(book,owner,route=globalThis.location?.hash||''){return routeOK(route)&&visit(book,owner)?.activeRoute===route;}
const button=(attrs,label,primary=false)=>`<button type="button" class="${primary?'primary':'secondary'}" ${attrs}>${esc(label)}</button>`;
export function forceSketchEntry(){return `<aside class="fs-entry">${button('data-fs-entry','Force Sketch')}<p>Which forces act on this object? Draw them before planning its journey.</p></aside>`;}

// Only controls captured here belong to Force. The later, app-owned voice shell
// keeps its own binding, including Stop voice when it moves inside this root.
function bindingGuard(root,valid,nodes=[...root.querySelectorAll('button,input,select,a,details,summary')]){
 const captured=[root,...nodes],retired=new WeakSet(),chains=new Map();
 const chain=n=>{const list=[];for(;n;n=n.parentNode)list.push(n);return list;};
 for(const n of captured)chains.set(n,chain(n));
 const audit=records=>{for(const r of records){
  if(r.type==='attributes'){for(const n of captured)if(chains.get(n).includes(r.target))retired.add(n);continue;}
  for(const removed of r.removedNodes)for(const n of captured)if(chains.get(n).includes(removed)||removed.contains?.(n))retired.add(n);
 }};
 const observer=new MutationObserver(records=>{audit(records);if(!root.isConnected)observer.disconnect();});
 observer.observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','inert','aria-hidden','style','class']});
 return node=>{
  audit(observer.takeRecords());if(!valid()||!root.isConnected||!root.contains(node)||retired.has(node)||node.disabled)return false;
  const old=chains.get(node),now=chain(node);if(!old||old.length!==now.length||!old.every((n,i)=>n===now[i]))return false;
  for(let n=node;n?.nodeType===1;n=n.parentElement){const css=getComputedStyle(n);if(n.hidden||n.inert||n.getAttribute('aria-hidden')==='true'||css.display==='none'||['hidden','collapse'].includes(css.visibility))return false;if(n.tagName==='DETAILS'&&!n.open&&n!==node&&!n.querySelector(':scope>summary')?.contains(node))return false;}
  return node.getClientRects().length>0;
 };
}
export function bindForceSketchEntry(book,ctx={}){
 const owner=ctx.explorerId?.(),root=document.querySelector('[data-motion-root]'),node=root?.querySelector('[data-fs-entry]'),route=location.hash;
 if(!node||!ownerOK(owner)||!routeOK(route))return;
 const v=visit(book,owner,true);v.entryNode=node;
 const live=bindingGuard(root,()=>v.entryNode===node&&ctx.notebook?.()===book&&ctx.explorerId?.()===owner&&ctx.isActive?.()===true&&location.hash===route&&document.querySelector('[data-motion-root]')===root&&!forceSketchActive(book,owner)&&!pushDriftActive(book,owner),[node]);
 node.addEventListener('click',()=>{
  if(!live(node))return;
  try{if(ctx.canEnter?.()!==true){ctx.refuse?.();return;}}catch{ctx.refuse?.();return;}
  if(!live(node))return;stopSpeech();v.activeRoute=route;v.notice='';ctx.render?.();document.querySelector('#fs-heading')?.focus();
 });
}

const forceName=f=>`${f.agent} → ${f.receiver}: ${f.name}`;
const arrowWords=a=>`${forceName(a.force||a)}, ${a.amount??a.amountN} N ${a.direction}`;
function diagram(body,arrows,title,selected=null,showList=true){
 const values=arrows.map(a=>({...a,amount:a.amount??a.amountN}));
 const paths=values.map((a,i)=>{
  const parallel=values.map((b,n)=>b.direction===a.direction?n:-1).filter(n=>n>=0),slot=parallel.indexOf(i)-(parallel.length-1)/2;
  const vertical=a.direction==='up'||a.direction==='down',x=vertical?320+slot*26:a.direction==='left'?220:420,y=vertical?(a.direction==='up'?170:310):240+slot*20;
  const dx=a.direction==='left'?-1:a.direction==='right'?1:0,dy=a.direction==='up'?-1:a.direction==='down'?1:0,ex=x+dx*a.amount*20,ey=y+dy*a.amount*20;
  const hx=ex-dx*8,hy=ey-dy*8;
  return `<g data-fs-arrow="${i}" data-direction="${esc(a.direction)}" data-amount="${a.amount}" class="fs-arrow${selected===i?' fs-selected-arrow':''}"><path d="M${x} ${y}L${ex} ${ey}"/><path d="M${hx-dy*4} ${hy+dx*4}L${ex} ${ey}L${hx+dy*4} ${hy-dx*4}"/></g>`;
 }).join('');
 return `<figure class="fs-diagram"><figcaption>${esc(title)}</figcaption><div class="fs-plot"><svg viewBox="0 0 640 480" aria-hidden="true" focusable="false"><rect class="fs-symbol" x="220" y="170" width="200" height="140" rx="14"/>${paths}</svg><span class="fs-object-label">${esc(body)}</span></div><p class="fs-plot-note">Invented model, with only the described interactions.</p><p class="fs-plot-note">The box is an object symbol. Arrow tails do not show where it is touched. Same arrow scale in every diagram.</p>${showList&&values.length?`<ul class="fs-diagram-description">${values.map(a=>`<li>${esc(arrowWords(a))}</li>`).join('')}</ul>`:showList&&!values.length?'<p>No arrows drawn yet.</p>':''}</figure>`;
}
function chooser(m,showClues=true,cluesOpen=false){return `<div class="fs-choosers"><label>Scene<select data-fs-scene>${forceScenes.map(s=>`<option value="${esc(s.id)}" ${s.id===m.scene.id?'selected':''}>${esc(s.title)}</option>`).join('')}</select></label><label>Object receiving the forces<select data-fs-body>${m.scene.bodies.map(b=>`<option value="${esc(b.id)}" ${b.id===m.body.id?'selected':''}>${esc(b.name)}</option>`).join('')}</select></label></div>${showClues?`<details class="fs-clues" data-fs-clues ${cluesOpen?'open':''}><summary>Read scene clues</summary><h2>${esc(m.scene.title)}</h2><p>${esc(m.scene.clues)}</p>${m.scene.story&&m.scene.story!==m.scene.clues?`<p>${esc(m.scene.story)}</p>`:''}</details>`:''}`;}
function rows(m){return m.arrows.length?`<ol class="fs-rows">${m.arrows.map((a,i)=>`<li data-fs-row="${i}"${m.work.selected===i?' class="fs-selected-row"':''}><p>${esc(arrowWords(a))}</p><div class="fs-actions">${button(`data-fs-select="${i}" aria-pressed="${m.work.selected===i}"`,'Select')}${button(`data-fs-edit="${i}"`,'Edit')}${button(`data-fs-remove="${i}"`,'Remove')}</div></li>`).join('')}</ol>`:'<p class="fs-empty">No arrows drawn yet.</p>';}
function build(m){
 const tool=m.work.tool,editing=tool.editIndex!==null,duplicate=m.arrows.some(a=>a.forceId===tool.forceId),full=m.arrows.length>=6;
 const reason=editing?'Finish with Replace or Cancel edit.':duplicate?'That force is already drawn. Choose its row to edit it.':full?'Six arrows are drawn. Edit or remove a row before adding another.':'';
 return `<h2 id="fs-task" tabindex="-1">Build a diagram for ${esc(m.body.name)}</h2><p>Name the object receiving each force. Choose its direction and size from the scene clues.</p><div class="fs-workbench">${diagram(m.body.name,m.arrows,'Your drawing',m.work.selected,false)}<section class="fs-toolbox"><h3>${editing?`Edit arrow ${tool.editIndex+1}`:'Add a force arrow'}</h3><label>Force<select data-fs-tool-force>${m.scene.forces.map(f=>`<option value="${esc(f.id)}" ${f.id===tool.forceId?'selected':''}>${esc(forceName(f))}</option>`).join('')}</select></label><p class="fs-tool-caption">${esc(forceName(m.scene.forces.find(f=>f.id===tool.forceId)))}</p><label>Direction on the page<select data-fs-tool-direction>${['up','down','left','right'].map(d=>`<option value="${d}" ${tool.direction===d?'selected':''}>${d}</option>`).join('')}</select></label><label>Force size<select data-fs-tool-amount>${[2,4,6].map(n=>`<option value="${n}" ${tool.amount===n?'selected':''}>${n} N</option>`).join('')}</select></label><div class="fs-actions">${button(`data-fs-add ${(editing||duplicate||full)?'disabled aria-describedby="fs-add-limit"':''}`,'Add arrow',true)}${editing?button('data-fs-replace','Replace arrow',true)+button('data-fs-cancel-edit','Cancel edit'):''}</div>${reason?`<p id="fs-add-limit">${esc(reason)}</p>`:''}<p>N means newtons, a unit of force.</p></section></div><section aria-label="Your force arrows"><h3>Your arrows</h3>${rows(m)}</section><div class="fs-actions">${button('data-fs-page="compare"','Compare and revise')}${button('data-fs-reset','Reset this object')}</div>`;
}
function pair(m){return `<section class="fs-pair"><h3>Interaction pair</h3>${button(`data-fs-pair-toggle aria-expanded="${m.work.pairExpanded}"`,m.work.pairExpanded?'Close interaction view':'Explore an interaction')}${m.work.pairExpanded?`<div class="fs-pair-content"><label>Choose one force on ${esc(m.body.name)}<select data-fs-pair-force>${m.reference.map(f=>`<option value="${esc(f.id)}" ${f.id===m.work.pairForceId?'selected':''}>${esc(forceName(f))}</option>`).join('')}</select></label>${button('data-fs-pair-show','Show this interaction')}${m.work.pairShown?`<p class="fs-warning">One interaction only. These are not complete diagrams of both objects.</p><div class="fs-pair-diagrams">${diagram(m.pair.force.receiver,[m.pair.force],'One force on '+m.pair.force.receiver)}${diagram(m.pair.partner.receiver,[m.pair.partner],'Its partner on '+m.pair.partner.receiver)}</div><p>These forces are equal, opposite, and of the same kind. They act at the same time on different objects. They do not balance the forces on one object.</p>`:''}</div>`:''}</section>`;}
function compare(m){return `<h2 id="fs-task" tabindex="-1">Compare and revise</h2><p>Compare your arrows with the forces described for ${esc(m.body.name)}.</p>${button('data-fs-compare','Compare my arrows',true)}${m.work.compared?`<section class="fs-feedback" aria-label="Comparison"><ul>${m.comparison.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p>${esc(m.netText)}</p></section>`:''}<div class="fs-comparison-diagrams">${diagram(m.body.name,m.arrows,'Your drawing',m.work.selected,false)}${m.work.referenceShown?diagram(m.body.name,m.reference,'Model reference'):''}</div>${button('data-fs-reference','Show reference diagram')}${pair(m)}<div class="fs-actions">${button('data-fs-page="build"','Revise my drawing')}${button('data-fs-page="motion"','Explore motion')}</div>`;}
function motion(m){return `<h2 id="fs-task" tabindex="-1">What happens to ${esc(m.body.name)}?</h2><fieldset class="fs-predictions"><legend>Use the model’s described forces. What happens to this object’s velocity at this instant?</legend>${m.choices.map(c=>`<label><input type="radio" name="fs-prediction" data-fs-prediction="${esc(c.id)}" value="${esc(c.id)}" ${m.work.prediction===c.id?'checked':''}><span>${esc(c.label)}</span></label>`).join('')}</fieldset><div class="fs-actions">${button('data-fs-check','Check prediction',true)}${button('data-fs-motion','Show model motion')}</div>${m.work.predictionChecked?`<section class="fs-feedback" aria-label="Prediction feedback"><p>${esc(m.predictionFeedback)}</p></section>`:''}${m.work.motionShown?`<section class="fs-feedback" aria-label="Model motion"><h3>Model motion</h3><p>${esc(m.motion)}</p></section>`:''}<p>This prediction uses the described model, including any forces missing from your drawing.</p>`;}
function teaching(work){
 const t=forceTeaching[work.teachingStep];
 return `<h2 id="fs-task" tabindex="-1">${esc(t.title)}</h2><p>Separate worked example · ${work.teachingStep+1} of ${forceTeaching.length}</p><p>${esc(t.text)}</p>${t.pair?`<p class="fs-warning">One interaction only. These are not complete diagrams of both objects.</p><div class="fs-pair-diagrams">${diagram(t.pair.force.receiver,[t.pair.force],'One interaction')}${diagram(t.pair.partner.receiver,[t.pair.partner],'The other receiver')}</div>`:work.teachingStep===4?'':diagram(t.body,t.arrows,'Worked example')}<div class="fs-actions">${button(`data-fs-teach-step="-1" ${work.teachingStep===0?'disabled':''}`,'Previous')}${button(`data-fs-teach-step="1" ${work.teachingStep===forceTeaching.length-1?'disabled':''}`,'Next')}${button('data-fs-teach-close','Back to my sketch',true)}</div>`;
}
export function forceSketchPage(book,owner){
 const v=visit(book,owner,true);if(!v)return '';v.generation++;
 const m=forceSketchModel(v.work);if(!m)return '';
 return `<section class="fs-page" data-fs-root><header><div class="fs-actions">${button('data-fs-back','Motion and evidence')}</div><h1 id="fs-heading" tabindex="-1">Force Sketch</h1><p class="fs-opening">Which forces act on this object? Let’s draw them before we plan its journey.</p></header>${chooser(m,v.work.page!=='teaching',v.cluesOpen)}<nav class="fs-tabs" aria-label="Force Sketch pages">${[['build','Build'],['compare','Compare'],['motion','Motion']].map(([id,label])=>button(`data-fs-page="${id}" aria-current="${v.work.page===id?'page':'false'}"`,label)).join('')}</nav>${v.work.page==='teaching'?teaching(v.work):v.work.page==='compare'?compare(m):v.work.page==='motion'?motion(m):build(m)}<div class="fs-actions fs-help">${v.work.page!=='teaching'?button('data-fs-teaching','How force diagrams work'):''}${button(`data-fs-read data-speak="${esc(forceSketchNarration(v.work))}"`,'Hear this page and clues')}</div><p id="fs-status" role="status" aria-live="polite" tabindex="-1">${esc(v.notice)}</p><p class="fs-temporary">These sketches are temporary and are not saved in Notes. Reloading starts fresh.</p></section>`;
}

export function bindForceSketch(book,ctx={}){
 const owner=ctx.explorerId?.(),v=visit(book,owner),root=document.querySelector('[data-fs-root]');
 if(!v||!root||typeof ctx.notebook!=='function'||typeof ctx.render!=='function')return;
 const route=location.hash,generation=v.generation,work=v.work,signature=bytes(work);v.boundRoot=root;
 const current=()=>visit(book,owner)===v&&v.boundRoot===root&&v.generation===generation&&v.work===work&&signature!==null&&bytes(v.work)===signature&&ctx.notebook()===book&&ctx.explorerId?.()===owner&&ctx.isActive?.()===true&&location.hash===route&&forceSketchActive(book,owner,route)&&document.querySelector('[data-fs-root]')===root;
 const live=bindingGuard(root,current);
 for(const node of root.querySelectorAll('button,input,select,a,details,summary')){
  const guard=e=>{if(!live(node)){e.preventDefault();e.stopImmediatePropagation();}};
  for(const type of ['click','input','change'])node.addEventListener(type,guard,{capture:true});
 }
 const focus=selector=>{const next=document.querySelector('[data-fs-root]'),candidate=next?.querySelector(selector),target=candidate&&!candidate.disabled?candidate:next?.querySelector('#fs-task,#fs-heading');target?.focus({preventScroll:true});if(target){const box=target.getBoundingClientRect();if(box.top<0||box.bottom>innerHeight)target.scrollIntoView({block:'nearest'});}};
 const syncView=()=>{const clues=root.querySelector('[data-fs-clues]');if(clues)v.cluesOpen=clues.open;};
 const redraw=(selector='#fs-task')=>{syncView();stopSpeech();ctx.render();focus(selector);};
 const apply=(node,action,value,target='#fs-task')=>{
  if(!live(node))return;
  if(action==='check-prediction'&&!forceSketchModel(work).work.prediction){v.notice='Choose a prediction first, or explore another page.';redraw('#fs-status');return;}
  const next=changeForceSketch(work,action,value);
  if(!next){v.notice=action==='replace'?'That force is already drawn. Choose its row to edit it.':'This change is unavailable. Your drawing is unchanged.';redraw('#fs-status');return;}
  v.work=next;v.notice='';redraw(target);
 };
 root.querySelector('[data-fs-clues]')?.addEventListener('toggle',event=>{if(live(event.currentTarget))v.cluesOpen=event.currentTarget.open;});
 const click=(selector,action,value,target)=>root.querySelectorAll(selector).forEach(node=>node.addEventListener('click',()=>apply(node,action,typeof value==='function'?value(node):value,typeof target==='function'?target(node):target)));
 const change=(selector,action,value=n=>n.value)=>root.querySelectorAll(selector).forEach(node=>node.addEventListener('change',()=>apply(node,action,value(node),action==='prediction'?`[data-fs-prediction="${node.dataset.fsPrediction}"]`:selector)));
 change('[data-fs-scene]','scene');change('[data-fs-body]','body');change('[data-fs-tool-force]','tool-force');change('[data-fs-tool-direction]','tool-direction');change('[data-fs-tool-amount]','tool-amount',n=>Number(n.value));change('[data-fs-pair-force]','pair-force');
 change('[data-fs-prediction]','prediction',n=>n.dataset.fsPrediction);
 click('[data-fs-page]','page',n=>n.dataset.fsPage);
 click('[data-fs-add]','add',undefined,'[data-fs-tool-force]');click('[data-fs-select]','select',n=>Number(n.dataset.fsSelect),n=>`[data-fs-select="${n.dataset.fsSelect}"]`);click('[data-fs-edit]','edit',n=>Number(n.dataset.fsEdit),'[data-fs-tool-force]');click('[data-fs-remove]','remove',n=>Number(n.dataset.fsRemove),'[data-fs-tool-force]');
 click('[data-fs-replace]','replace',undefined,'[data-fs-tool-force]');click('[data-fs-cancel-edit]','cancel-edit',undefined,'[data-fs-tool-force]');click('[data-fs-compare]','compare');click('[data-fs-reference]','show-reference');click('[data-fs-check]','check-prediction');click('[data-fs-motion]','show-motion');click('[data-fs-pair-toggle]','toggle-pair',undefined,'[data-fs-pair-toggle]');click('[data-fs-pair-show]','show-pair',undefined,'[data-fs-pair-show]');
 click('[data-fs-teaching]','teaching-open');click('[data-fs-teach-step]','teaching-step',n=>Number(n.dataset.fsTeachStep));click('[data-fs-teach-close]','teaching-close');
 root.querySelector('[data-fs-reset]')?.addEventListener('click',event=>{const node=event.currentTarget;if(!live(node))return;if(!window.confirm('Start this object’s sketch again? Its drawings and choices will be cleared.'))return;if(live(node))apply(node,'reset-object',undefined,'[data-fs-tool-force]');});
 root.querySelector('[data-fs-back]')?.addEventListener('click',event=>{if(!live(event.currentTarget))return;syncView();stopSpeech();v.activeRoute=null;v.boundRoot=null;ctx.render();document.querySelector('#motion-heading')?.focus();});
}
