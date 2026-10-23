import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {hearButton,stopSpeech,bindSpeech} from './play-media.mjs';

// Original fixed story. Grid units describe the drawing, never device centimeters.
export const scaleSource=Object.freeze({id:'post-garden-scale-v1',east:8,north:4,total:12});
export const scaleOpening='The visitor wants a smaller drawing of the same route. Try another edge key, then compare the maps.';
export const scaleSourceText='Invented town route: Post Office → Garden. Go 8 m east, then 4 m north. The route is 12 m long.';
export const scalePurpose='Our purpose: change the drawing, keep the route.';
export const scaleDisclosure='Invented distances, not a real journey. These drawings cannot predict real travel. Screen edges are not measured centimeters.';
export const scaleCaption='Count line intervals along the route, not dots or filled squares.';
export const scaleComparison='The 4 m key uses fewer map edges. Both drawings still represent 8 m east, then 4 m north: the same 12 m route.';
export const scaleRefusal='This picture needs room in your notes to mark its supplied number facts. Nothing was changed. Open Grown-up notes to download your work, or return to the map table.';
export const initialScale=()=>({key:2,compare:false,undo:null});
export function changeScale(view,action,value){
 if(action==='undo')return view.undo?{...view.undo,undo:null}:null;
 const next={key:view.key,compare:view.compare};
 if(action==='key'&&[2,4].includes(value)&&value!==view.key)next.key=value;
 else if(action==='compare')next.compare=!view.compare;
 else return null;
 return {...next,undo:{key:view.key,compare:view.compare}};
}
export const scaleKeys=view=>view.compare?[view.key,view.key===2?4:2]:[view.key];
export const scaleGeometry=key=>({east:8/key,north:4/key,edges:12/key});
export function scaleReadouts(key){const g=scaleGeometry(key);return [`East: ${g.east} edges × ${key} m = 8 m.`,`North: ${g.north} ${g.north===1?'edge':'edges'} × ${key} m = 4 m.`,`Route: ${g.edges} edges × ${key} m = 12 m.`];}
export function scaleDisplayPairs(view){return scaleKeys(view).flatMap(k=>k===2?[[1,2],[4,2],[2,2],[6,2]]:[[2,4],[1,4],[3,4]]);}
export function scaleNarration(view){return [scaleOpening,scaleSourceText,scalePurpose,scaleDisclosure,...scaleKeys(view).flatMap(k=>[`1 edge represents ${k} m.`,...scaleReadouts(k),`One edge: ${k} m. P: Post Office. G: Garden.`,scaleCaption]),...(view.compare?[scaleComparison]:[])].join(' ');}
export const scaleAnnouncement=(view,action)=>action==='undo'?'The previous drawing view is restored.':action==='compare'?view.compare?'Both edge keys are shown for the same town route.':'Only the selected edge key is shown.':`The drawing now uses ${view.key} m per edge. The town route is unchanged.`;
const own=(o,k)=>Object.hasOwn(o,k),object=o=>o!==null&&typeof o==='object'&&!Array.isArray(o),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// The shared helpers own only exposure additions here. They are not a migration.
// Compare everything else, including records nested inside their Broad/Garden roots.
function preservesEarlierWork(before,after){
 const rest=structuredClone(after);
 const appended=(old,next)=>Array.isArray(next)&&(old===undefined||Array.isArray(old)&&old.length<=next.length&&old.every((v,i)=>same(v,next[i])));
 const restore=(target,source,key)=>{if(own(source,key))target[key]=structuredClone(source[key]);else delete target[key];};
 const flag=(old,next,key)=>{if(object(old)&&object(next)&&next[key]===true)restore(next,old,key);};
 for(const key of ['broad','garden']){
  if(!own(before,key)){delete rest[key];continue;}
  if(!object(before[key])||!object(rest[key]))return false;
  // New root fields are normal helper initialization. Existing values stay protected.
  for(const field of Object.keys(rest[key]))if(!own(before[key],field))delete rest[key][field];
 }
 if(own(before,'broad')){
  for(const key of ['seenItems','seenFacts','seenVariants'])if(own(before.broad,key)){
   if(!appended(before.broad[key],after.broad[key]))return false;
   restore(rest.broad,before.broad,key);
  }
  if(object(before.broad.drafts)&&object(rest.broad.drafts))for(const [id,d]of Object.entries(before.broad.drafts))flag(d,rest.broad.drafts[id],'knownFact');
 }
 if(own(before,'garden')&&Array.isArray(before.garden.visits)&&Array.isArray(rest.garden.visits))for(let i=0;i<before.garden.visits.length;i++){
  const a=before.garden.visits[i],b=rest.garden.visits[i];
  if(object(a)&&object(b)&&a.id===b.id&&object(a.drafts)&&object(b.drafts))for(const [id,d]of Object.entries(a.drafts))flag(d,b.drafts[id],'knownFact');
 }
 if(!appended(before.exposures,after.exposures))return false;
 restore(rest,before,'exposures');
 flag(before.baseline?.draft,rest.baseline?.draft,'exposed');
 if(Array.isArray(before.postOffice?.visits)&&Array.isArray(rest.postOffice?.visits))for(let i=0;i<before.postOffice.visits.length;i++){
  const a=before.postOffice.visits[i],b=rest.postOffice.visits[i];
  if(object(a)&&object(b)&&a.id===b.id)flag(a.rival,b.rival,'priorFactShown');
 }
 return same(before,rest);
}
export function recordScaleDisplay(notebook,view,{exposeFacts,canExport}={}){
 try{
  const candidate=structuredClone(notebook);
  if(!recoveryFitsProgressLimits(candidate)||typeof exposeFacts!=='function'||typeof canExport!=='function')return {ok:false,changed:false};
  exposeFacts(scaleDisplayPairs(view),candidate);
  if(!preservesEarlierWork(notebook,candidate)||!recoveryFitsProgressLimits(candidate)||canExport(candidate)!==true)return {ok:false,changed:false};
  let changed=false;
  for(const key of ['broad','garden','exposures','baseline','postOffice'])if(!same(notebook[key],candidate[key])){notebook[key]=candidate[key];changed=true;}
  return {ok:true,changed};
 }catch{return {ok:false,changed:false};}
}

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy=s=>esc(s).replace(/(\d+) m\b/g,'$1\u00a0m');
let visit=null;
export function resetScaleSession(){visit=null;}
export function scaleEntry(){return '<aside class="scale-entry"><a class="secondary" href="#workshop/scale">Same route, different scale</a><p>Keep a town route fixed while its drawing changes.</p></aside>';}
const links='<footer><a href="#workshop">Workshop</a><a href="#notes">Grown-up notes</a></footer>';
function heading(){return '<header><a href="#workshop/maps">← Cartographer’s Table</a><h1 id="scale-title" tabindex="-1">Same route, different scale</h1></header>';}
const button=(action,label,attrs='')=>`<button type="button" data-scale-action="${action}" ${attrs}>${label}</button>`;
function mapArt(key){
 const g=scaleGeometry(key),pitch=44,x=18,y=153,bend=x+g.east*pitch,end=y-g.north*pitch;
 const line=(x1,y1,x2,y2,cls)=>`<path d="M${x1} ${y1}L${x2} ${y2}" class="${cls}"/>`;
 let grid='';for(let i=0;i<=5;i++)grid+=line(x+i*pitch,y-3*pitch,x+i*pitch,y,'scale-grid');for(let i=0;i<=3;i++)grid+=line(x,y-i*pitch,x+5*pitch,y-i*pitch,'scale-grid');
 let ticks='';for(let i=1;i<g.east;i++)ticks+=line(x+i*pitch,y-5,x+i*pitch,y+5,'scale-tick');for(let i=1;i<g.north;i++)ticks+=line(bend-5,y-i*pitch,bend+5,y-i*pitch,'scale-tick');
 const alt=`1 edge represents ${key} meters. P is Post Office; G is Garden. ${g.east} east edges represent 8 meters; ${g.north} north ${g.north===1?'edge represents':'edges represent'} 4 meters. ${g.edges} traveled edges represent the same 12 meter route. North is up; east is right.`;
 return `<svg viewBox="0 0 256 218" role="img" aria-label="${esc(alt)}"><text x="8" y="16">↑ North</text>${grid}<polyline points="${x},${y} ${bend},${y} ${bend},${end}" class="scale-route"/>${ticks}<path d="M${x+20} ${y-5}l7 5-7 5M${bend-5} ${y-19}l5-7 5 7" class="scale-arrow"/><circle cx="${x}" cy="${y}" r="12" class="scale-marker"/><text x="${x}" y="${y+5}" text-anchor="middle" class="scale-letter">P</text><path d="M${bend} ${end-15}l15 15-15 15-15-15Z" class="scale-marker"/><text x="${bend}" y="${end+5}" text-anchor="middle" class="scale-letter">G</text>${line(x,y+24,x+pitch,y+24,'scale-bracket')}${line(x,y+19,x,y+29,'scale-bracket')}${line(x+pitch,y+19,x+pitch,y+29,'scale-bracket')}<text x="${x}" y="${y+50}">One edge: ${key} m</text><text x="248" y="${y+50}" text-anchor="end">East →</text></svg>`;
}
function figure(key){return `<figure class="scale-sheet" data-scale-key="${key}"><h2>1 edge represents ${key} m</h2>${mapArt(key)}<p>P: Post Office · G: Garden</p><div class="scale-readouts">${scaleReadouts(key).map(t=>`<p>${copy(t)}</p>`).join('')}</div><figcaption>${scaleCaption}</figcaption></figure>`;}
function body(view){return `<p>${scaleOpening}</p><section class="scale-source"><p>${copy(scaleSourceText)}</p><p><strong>${scalePurpose}</strong></p></section><p>${scaleDisclosure}</p><div class="scale-controls"><div class="scale-key-controls" role="group" aria-label="Distance represented by one edge">${[2,4].map(k=>button('key',`${k} m per edge${view.key===k?'<span>✓ Selected</span>':''}`,`data-scale-value="${k}" aria-pressed="${view.key===k}"`)).join('')}</div><div class="scale-view-controls">${button('compare',view.compare?'Show one map':'Compare both maps')}${button('undo','Undo last change',view.undo?'':'disabled')}</div>${view.undo?'':'<p>No change to undo.</p>'}</div><div class="scale-maps${view.compare?' scale-compare':''}">${scaleKeys(view).map(figure).join('')}</div>${view.compare?`<p class="scale-comparison">${copy(scaleComparison)}</p>`:''}${hearButton('Request this view’s current reading.','Hear this view')}${links}`;}
export function scalePage(notebook,owner,options){
 const fresh=!visit||visit.notebook!==notebook||visit.owner!==owner;
 const active=typeof document==='undefined'?null:document.activeElement;
 const action=!fresh&&active?.matches('[data-scale-action]')?active.dataset.scaleAction:null,value=active?.dataset.scaleValue;
 if(fresh){const view=initialScale(),result=recordScaleDisplay(notebook,view,options);visit={notebook,owner,view:result.ok?view:null};if(result.changed)options.save?.();}
 const html=`<section class="scale-page" ${visit.view?'data-scale-root':'data-scale-blocked'}>${heading()}${visit.view?`<div data-scale-view>${body(visit.view)}</div><p id="scale-status" role="status" aria-live="polite" tabindex="-1"></p>`:`<p id="scale-status" role="status" tabindex="-1">${scaleRefusal}</p><a href="#notes">Grown-up notes</a><a href="#workshop/maps">Back to Cartographer’s Table</a>`}</section>`;
 if(fresh&&typeof document!=='undefined'){const captured=visit;queueMicrotask(()=>{if(visit===captured&&location.hash==='#workshop/scale')document.querySelector(visit.view?'#scale-title':'#scale-status')?.focus();});}
 if(action){const captured=visit;queueMicrotask(()=>{if(visit===captured&&location.hash==='#workshop/scale')document.querySelector(`[data-scale-action="${action}"]${value?`[data-scale-value="${value}"]`:''}:not(:disabled)`)?.focus();});}
 return html;
}
export function bindScale({notebook,explorerId,isActive,save,render,focus,...options}){
 const root=document.querySelector('[data-scale-root]');if(!root||!visit?.view)return;
 const captured=visit;
 const live=element=>element.isConnected&&root.isConnected&&root.contains(element)&&document.querySelector('[data-scale-root]')===root&&location.hash==='#workshop/scale'&&isActive()&&visit===captured&&notebook()===captured.notebook&&explorerId()===captured.owner;
 const refuse=()=>{stopSpeech();const status=root.querySelector('#scale-status');status.textContent=scaleRefusal;focus('#scale-status');};
 root.querySelectorAll('[data-scale-action]').forEach(b=>b.addEventListener('click',()=>{
  if(!live(b))return;const action=b.dataset.scaleAction,next=changeScale(visit.view,action,Number(b.dataset.scaleValue));if(!next)return;
  const result=recordScaleDisplay(captured.notebook,next,options);if(!result.ok){refuse();return;}
  stopSpeech();visit.view=next;if(result.changed)save();
  root.querySelector('[data-scale-view]').innerHTML=body(next);
  bindScale({notebook,explorerId,isActive,save,render,focus,...options});bindSpeech();
  root.querySelector('#scale-status').textContent=scaleAnnouncement(next,action).replace(/(\d+) m\b/g,'$1\u00a0m');
  focus(action==='undo'?'#scale-title':action==='key'?`[data-scale-action="key"][data-scale-value="${next.key}"]`:'[data-scale-action="compare"]');
 }));
 root.querySelectorAll('[data-speak]').forEach(b=>b.addEventListener('click',e=>{
  if(!live(b)){e.preventDefault();e.stopImmediatePropagation();return;}
  const result=recordScaleDisplay(captured.notebook,visit.view,options);
  if(!result.ok){e.preventDefault();e.stopImmediatePropagation();refuse();return;}
  if(result.changed)save();b.dataset.speak=scaleNarration(visit.view);
 },{capture:true}));
}
