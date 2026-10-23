import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {hearButton,stopSpeech,bindSpeech} from './play-media.mjs';
export const initialUnits=()=>({amountMl:300,unit:'mL',undo:null});
export const unitsCopy={purpose:'Read a recipe and a jug when their labels use different units.',source:'Supplied recipe label: 0.35 L = 350 mL.',reference:'1 L = 1000 mL. A milliliter is the smaller unit, so the same amount needs more milliliters than liters.',capacity:'Jug capacity: 1 L = 1000 mL. The most this jug can hold.',partition:'20 equal small spaces; 21 marks.',key:'Each small space: 50 mL = 0.05 L. Count spaces from zero, not marks.',reserve:'The empty space inside the jug is not reserve liquid.',ledger:'Jug + reserve = 1000 mL.',disclosure:'Pretend liquid, exact picture amounts. This straight-sided jug is a model, not a real measuring tool.',details:'Real pouring and reading can be uncertain. This model omits splashes, liquid left on surfaces and the curved liquid surface.'};
export const unitsRefusal='This picture needs room in your notes to mark its supplied number facts. Nothing was changed. Open Grown-up notes to download your work, or return to Measuring Kitchen.';
export const unitsReading=v=>`In the jug: ${v.amountMl} mL = ${v.amountMl===300?'0.30':'0.35'} L. ${v.amountMl/50} small spaces reach the liquid level.`;
export const unitsReserve=v=>`Reserve outside the jug: ${1000-v.amountMl} mL.`;
export const unitsAxis=v=>Array.from({length:11},(_,i)=>v.unit==='mL'?String(i*100):i===10?'1.0':`0.${i}`);
export function changeUnits(v,action,value){if(action==='undo')return v.undo?{...v.undo,undo:null}:null;const next={amountMl:v.amountMl,unit:v.unit};if(action==='unit'){if(!['mL','L'].includes(value)||value===v.unit)return null;next.unit=value;}else if(action==='add'&&v.amountMl===300)next.amountMl=350;else if(action==='return'&&v.amountMl===350)next.amountMl=300;else return null;return {...next,undo:{amountMl:v.amountMl,unit:v.unit}};}
export function unitsFacts(v){const n=v.amountMl/50,pairs=[[1,1000],[.05,1000],[.35,1000],[1,50],[1,.05],[20,50],[20,.05],[n,50],[n,.05],...(v.amountMl===300?[[.3,1000]]:[]),...Array.from({length:11},(_,i)=>[i*2,v.unit==='mL'?50:.05])];return [...new Map(pairs.map(p=>[p.join('x'),p])).values()];}
const digits=['zero','one','two','three','four','five','six','seven','eight','nine'];
const decimal=s=>s.includes('.')?s.split('.').map((part,i)=>i?[...part].map(x=>digits[+x]).join(' '):digits[+part]).join(' point '):s;
export const unitsSpoken=s=>s.replace(/(\d+(?:\.\d+)?)\s*mL\b/g,(_,n)=>`${n} milliliters`).replace(/(\d+(?:\.\d+)?)\s*L\b/g,(_,n)=>`${decimal(n)} liters`);
export const unitsNarration=v=>unitsSpoken([unitsCopy.purpose,unitsCopy.source,unitsCopy.reference,unitsCopy.capacity,`Jug scale: ${v.unit==='mL'?'milliliters':'liters'}.`,...unitsAxis(v).map(x=>`${x} ${v.unit}.`),unitsCopy.partition,unitsCopy.key,unitsReading(v),unitsReserve(v),unitsCopy.reserve,unitsCopy.ledger,unitsCopy.disclosure,unitsCopy.details].join(' '));
export const unitsAnnouncement=(v,a)=>a==='undo'?'The previous amount and unit label are restored.':a==='unit'?`The jug scale now uses ${v.unit==='L'?'liters':'milliliters'}. The liquid amount stayed the same.`:a==='add'?'50 mL moved from reserve to jug. In the jug: 350 mL = 0.35 L.':'50 mL moved from jug to reserve. In the jug: 300 mL = 0.30 L.';
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
export function recordUnitsDisplay(notebook,view,{exposeFacts,canExport}={}){
 try{
  const candidate=structuredClone(notebook);
  if(!recoveryFitsProgressLimits(candidate)||typeof exposeFacts!=='function'||typeof canExport!=='function')return {ok:false,changed:false};
  exposeFacts(unitsFacts(view),candidate);
  if(!preservesEarlierWork(notebook,candidate)||!recoveryFitsProgressLimits(candidate)||canExport(candidate)!==true)return {ok:false,changed:false};
  let changed=false;
  for(const key of ['broad','garden','exposures','baseline','postOffice'])if(!same(notebook[key],candidate[key])){notebook[key]=candidate[key];changed=true;}
  return {ok:true,changed};
 }catch{return {ok:false,changed:false};}
}

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy=s=>esc(s).replace(/(\d) (mL|L)\b/g,'$1\u00a0$2');
let visit=null;
export function resetUnits(){visit=null;}
export function unitsEntry(){return '<aside class="units-entry"><a class="secondary" href="#cafe/units">Same pour, new unit</a><p>Compare a recipe label with a jug label.</p></aside>';}
const heading=()=>'<header><a href="#cafe/recipes">← Back to Measuring Kitchen</a><h1 id="units-title" tabindex="-1">Same pour, new unit</h1></header>';
function jug(v){const bottom=310,top=50,height=v.amountMl/1000*260,surface=bottom-height,labels=unitsAxis(v);const alt=unitsSpoken(`Jug capacity: 1 L = 1000 mL. ${unitsReading(v)} ${unitsCopy.partition} Selected scale unit: ${v.unit==='L'?'liters':'milliliters'}. ${unitsReserve(v)} ${unitsCopy.reserve}`);return `<svg viewBox="0 0 260 350" role="img" aria-label="${esc(alt)}"><rect class="units-liquid" x="96" y="${surface}" width="108" height="${height}"/>${Array.from({length:21},(_,i)=>{const y=bottom-i*13;return `<path class="units-tick" d="M${i%2?84:78} ${y}H94"/>${i%2?'':`<text x="65" y="${y+6}" text-anchor="end">${labels[i/2]}</text>`}`;}).join('')}<path class="units-vessel" d="M96 ${top}V${bottom}H204V${top}"/><path class="units-handle" d="M208 75H228Q254 75 254 105V230Q254 255 228 255H208"/><path class="units-surface" d="M96 ${surface}H220"/></svg>`;}
const button=(a,label,disabled=false)=>`<button type="button" data-units-action="${a}"${disabled?' disabled':''}>${copy(label)}</button>`;
function body(v){return `<p>${unitsCopy.purpose}</p><p class="units-source">${copy(unitsCopy.source)}</p><p>${copy(unitsCopy.reference)}</p><p><strong>Change the unit label:</strong><br>the liquid stays still.</p><div class="units-options" role="group" aria-label="Unit used on the jug scale">${['mL','L'].map(u=>`<button type="button" data-units-action="unit" data-units-value="${u}" aria-label="${u}, ${u==='mL'?'milliliters':'liters'}" aria-pressed="${v.unit===u}">${u}${v.unit===u?'<span aria-hidden="true"> ✓ Selected</span>':''}</button>`).join('')}</div><div class="units-layout"><figure><h2>Jug scale: ${v.unit==='mL'?'mL (milliliters)':'L (liters)'}</h2><p><strong>${copy(unitsCopy.capacity.split('. ')[0])}.</strong><br>The most this jug can hold.</p>${jug(v)}<figcaption>${unitsCopy.partition}</figcaption><p>${copy(unitsCopy.key)}</p></figure><section class="units-reading"><h2>${copy(unitsReading(v))}</h2><p>${copy(unitsReserve(v))}</p><p>${unitsCopy.reserve}</p><p>${copy(unitsCopy.ledger)}</p><p><strong>${copy('Move one 50 mL measure:')}<br>the liquid level changes.</strong></p><div class="units-transfer">${button('add','Add 50 mL',v.amountMl===350)}${button('return','Return 50 mL',v.amountMl===300)}</div><p>${copy('This example moves between 300 mL and 350 mL.')}</p>${button('undo','Undo last change',!v.undo)}${v.undo?'':'<p>No change to undo.</p>'}</section></div><p>${unitsCopy.disclosure}</p><p>${unitsCopy.details}</p>${hearButton('Request the current admitted view.','Hear this view')}<footer><a href="#numbers/tenths">Tenths Table</a><a href="#numbers/hundredths">Hundredths Bridge</a><a href="#notes">Grown-up notes</a></footer>`;}
export function unitsPage(notebook,owner,options){const fresh=!visit||visit.notebook!==notebook||visit.owner!==owner;if(fresh){const view=initialUnits(),result=recordUnitsDisplay(notebook,view,options);visit={notebook,owner,view:result.ok?view:null};if(result.changed)options.save?.();}const html=`<section class="units-page" ${visit.view?'data-units-root':'data-units-blocked'}>${heading()}${visit.view?`<div data-units-view>${body(visit.view)}</div><p id="units-status" role="status" aria-live="polite" tabindex="-1">A supplied example. Try changing the unit label.</p>`:`<p id="units-status" role="status" tabindex="-1">${unitsRefusal}</p><a href="#notes">Grown-up notes</a><a href="#cafe/recipes">Back to Measuring Kitchen</a>`}</section>`;if(fresh&&typeof document!=='undefined'){const captured=visit;queueMicrotask(()=>{if(visit===captured&&location.hash==='#cafe/units')document.querySelector(visit.view?'#units-title':'#units-status')?.focus();});}return html;}
export function bindUnits({notebook,explorerId,isActive,save,focus,...options}){const root=document.querySelector('[data-units-root]');if(!root||!visit?.view)return;const captured=visit;
 const live=el=>el.isConnected&&root.isConnected&&root.contains(el)&&document.querySelector('[data-units-root]')===root&&location.hash==='#cafe/units'&&isActive()&&visit===captured&&notebook()===captured.notebook&&explorerId()===captured.owner;
 const refuse=()=>{stopSpeech();root.querySelector('#units-status').textContent=unitsRefusal;focus('#units-status');};
 root.querySelectorAll('[data-units-action]').forEach(b=>b.addEventListener('click',()=>{if(!live(b))return;const a=b.dataset.unitsAction,next=changeUnits(visit.view,a,b.dataset.unitsValue);if(!next)return;const result=recordUnitsDisplay(captured.notebook,next,options);if(!result.ok){refuse();return;}stopSpeech();visit.view=next;if(result.changed)save();root.querySelector('[data-units-view]').innerHTML=body(next);bindUnits({notebook,explorerId,isActive,save,focus,...options});bindSpeech();root.querySelector('#units-status').textContent=copy(unitsAnnouncement(next,a)).replaceAll('&amp;','&');focus(a==='undo'?'#units-title':a==='unit'?`[data-units-action="unit"][data-units-value="${next.unit}"]`:a==='add'?'[data-units-action="return"]':'[data-units-action="add"]');}));
 root.querySelectorAll('[data-speak]').forEach(b=>b.addEventListener('click',e=>{if(!live(b)){e.preventDefault();e.stopImmediatePropagation();return;}const result=recordUnitsDisplay(captured.notebook,visit.view,options);if(!result.ok){e.preventDefault();e.stopImmediatePropagation();refuse();return;}if(result.changed)save();b.dataset.speak=unitsNarration(visit.view);},{capture:true}));
}
