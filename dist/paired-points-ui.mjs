import {PAIRED_TEXT as T} from './paired-points-content.mjs';
import {pairedSource,pairedView,sourceCase,workedExample,patternExample,createPairedChart,placePairedPoint,undoPairedPoint,usePairedSupport,checkPairedChart,keepPairedChart,revisePairedChart} from './paired-points-core.mjs';
import {hearButton} from './play-media.mjs';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(attrs,label,{primary=false,disabled=false,selected=null}={})=>`<button type="button" class="${primary?'primary':'secondary'}" ${attrs}${disabled?' disabled':''}${selected===null?'':` aria-pressed="${selected}"`}>${esc(label)}</button>`;
const count=(n,noun)=>`${n} ${noun}${n===1?'':'s'}`;
const progress=v=>`${v.placements.length} of ${v.case.rows.length} ${v.case.rows.length===1?'record':'records'} placed.`;
const waiting=n=>`${count(n,'record')} ${n===1?'is':'are'} still waiting.`;
const rowLabel=(v,index)=>`Record ${index+1}`;
let visit=null;
export function resetPairedVisit(){visit=null;}
function session(state,owner){
 if(!visit||visit.state!==state||visit.owner!==owner)visit={state,owner,id:null,source:null,x:'',y:'',helper:null,step:0,overlay:false,notice:''};
 return visit;
}
function status(s){return `<p id="pp-status" class="pp-notice${s.notice?'':' sr-only'}" role="status" aria-live="polite" tabindex="-1">${esc(s.notice)}</p>`;}
function footer(){return '<footer class="pp-actions"><a href="#living/collection">My Count Collection</a><a href="#learn/math">Math explorations</a><a href="#notes">Grown-up notes</a></footer>';}
function sourceContext(source){return `<section class="pp-source-context" aria-label="This chart’s frozen records"><h2>${esc(source.title)}</h2><p><strong>${esc(source.origin)}</strong></p><p>${esc(source.notice)}</p><p>${esc(source.context)}</p><p class="pp-source-key"><strong>X:</strong> ${esc(source.axes.x.label)} · <strong>Y:</strong> ${esc(source.axes.y.label)}</p></section>`;}
function supportText(s){return `<ul class="pp-support"><li>Worked example opened: ${s.worked?'yes':'no'}</li><li>Example pattern comparison opened: ${s.patterns?'yes':'no'}</li><li>Narration requested: ${s.narration?'yes':'no'}</li><li>Working together reported: ${s.together?'yes':'no'}</li><li>Earlier table feedback seen: ${s.feedback?'yes':'no'}</li></ul>`;}
function raw(value){try{return JSON.stringify(value,null,2)??String(value);}catch{return 'Earlier value retained in the notebook.';}}
function rawDetails(value){return `<details class="pp-raw-details"><summary>Original paired-point notes, including retained unreadable values</summary><pre>${esc(raw(value))}</pre></details>`;}
export function pairedEntry(){return `<aside class="pp-entry"><div><h2>${T.title}</h2><p>${T.invitation} ${T.introduction}</p></div><a class="secondary" href="#learn/math/paired">Paired points</a></aside>`;}
function sheetList(v){return v.sheets.length?`<section class="pp-history"><h2>Earlier charts</h2><div class="pp-source-list">${v.sheets.map(item=>item.readable&&!item.ambiguous?button(`data-pp-open="${esc(item.id)}"`,`${item.case.title} · ${item.id} · ${item.placements.length} of ${item.case.rows.length} ${item.case.rows.length===1?'record':'records'} placed · ${item.kept?'Kept chart':'In progress'}`):'<p>Earlier chart kept · its original stays in your notes.</p>').join('')}</div></section>`:'';}
function chooser(s,v){const source=pairedSource();return `${sourceContext(source)}<section class="pp-chooser"><h2 id="pp-chooser-heading" tabindex="-1">Which records shall we plot?</h2><div class="pp-source-list" role="group" aria-label="Choose practice records">${source.datasets.map(c=>button(`data-pp-source="${esc(c.id)}"`,c.title,{selected:s.source===c.id,disabled:v.status==='unsupported'})).join('')}</div>${button('data-pp-start','Start this chart',{primary:true,disabled:!s.source||!v.canCreate})}${v.status==='unsupported'?`<p>${T.unsupported}</p>`:!v.canCreate?`<p>${T.capacity}</p>`:''}</section>${sheetList(v)}`;}

// Every plot, including worked and pattern examples, uses this source-owned map.
const position=(source,x,y)=>({x:72+384*x/source.axes.x.max,y:320-296*y/source.axes.y.max});
function ticks(max){const step=[1,2,5,10,20].find(n=>Math.ceil(max/n)<=5);const result=[];for(let n=0;n<max;n+=step)result.push(n);if(result.length>1&&max-result.at(-1)<step/2)result.pop();result.push(max);return result;}
function plot(source,placements,{cardPairs=[],attrs='',caption='',stage=null}={}){
 const xMax=source.axes.x.max,yMax=source.axes.y.max;
 const grid=[...Array.from({length:xMax+1},(_,x)=>{const p=position(source,x,0);return `<path d="M${p.x} 24V320"/>`;}),...Array.from({length:yMax+1},(_,y)=>{const p=position(source,0,y);return `<path d="M72 ${p.y}H456"/>`;}),].join('');
 const labels=ticks(xMax).map(x=>{const p=position(source,x,0);return `<text x="${p.x}" y="362" text-anchor="middle">${x}</text>`;}).join('')+ticks(yMax).map(y=>{const p=position(source,0,y);return `<text x="60" y="${p.y}" text-anchor="end" dominant-baseline="middle">${y}</text>`;}).join('');
 const squares=cardPairs.map((p,i)=>{const at=position(source,p.x,p.y);return `<rect class="pp-source-point" x="${at.x-12}" y="${at.y-12}" width="24" height="24" data-x="${p.x}" data-y="${p.y}" data-record="${i+1}" fill="none" stroke="currentColor" stroke-width="4"><title>Record ${i+1}: (${p.x}, ${p.y})</title></rect>`;}).join('');
 const circles=placements.map((p,i)=>{const at=position(source,p.x,p.y);return `<circle class="pp-own-point" cx="${at.x}" cy="${at.y}" r="8" data-x="${p.x}" data-y="${p.y}" data-record="${i+1}"><title>Record ${i+1}: (${p.x}, ${p.y})</title></circle>`;}).join('');
 let example='';if(stage){const at=position(source,stage.stage==='origin'?0:stage.row.x,stage.stage==='point'?stage.row.y:0),across=position(source,stage.row.x,0);example=`${stage.stage==='origin'?'':`<path class="pp-example-path" d="M72 320H${across.x}${stage.stage==='point'?`V${at.y}`:''}" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="9 7"/>`}<rect class="pp-example-point" x="${at.x-12}" y="${at.y-12}" width="24" height="24" fill="none" stroke="currentColor" stroke-width="4"/>`;}
 const diagram=stage?`Worked example. Stage: ${stage.stage}. Diagram position: (${stage.stage==='origin'?0:stage.row.x}, ${stage.stage==='point'?stage.row.y:0}). This record's pair is (${stage.row.x}, ${stage.row.y}).`:`${count(placements.length,'placed point')}; ${count(cardPairs.length,'record pair')}.`;
 const summary=`${source.axes.x.label} across, 0 to ${xMax}; ${source.axes.y.label} up, 0 to ${yMax}. ${diagram}`;
 return `<figure class="pp-plot"><div class="pp-axis-labels"><span>Y · ${esc(source.axes.y.label)}</span></div><svg ${attrs} viewBox="0 0 480 380" role="img" aria-label="${esc(summary)}"><g class="pp-grid" fill="none" stroke="currentColor" stroke-width="1">${grid}</g><path class="pp-axes" d="M72 24V320H456" fill="none" stroke="currentColor" stroke-width="3"/><g class="pp-ticks" font-size="36" fill="currentColor">${labels}</g>${squares}${circles}${example}</svg><div class="pp-axis-labels pp-x-label">X · ${esc(source.axes.x.label)}</div><figcaption>${esc(caption)}</figcaption></figure>`;
}
function pairTable(source,pairs,{caption,attr='',rows=null}={}){return `<table ${attr}><caption>${esc(caption)}</caption><thead><tr><th scope="col">Record</th><th scope="col">${esc(source.axes.x.label)}</th><th scope="col">${esc(source.axes.y.label)}</th></tr></thead><tbody>${pairs.map((p,i)=>`<tr${rows?` data-record-id="${esc(rows[i].id)}"`:''}><th scope="row">${i+1}</th><td>${p.x}</td><td>${p.y}</td></tr>`).join('')}</tbody></table>`;}
function comparisonText(check,v){
 const missing=v.case.rows.length-check.placements.length;
 if(!check.placements.length)return 'No placed pairs were recorded.';
 return `${check.matches.every(Boolean)?T.matching:T.differences}${missing?' '+waiting(missing):''}`;
}
function comparison(v,check,{historical=false}={}){
 if(historical)return `<p>Recorded ${count(check.placements.length,'point')}. Recorded complete: ${check.complete?'yes':'no'}.</p><ol>${check.placements.map((p,i)=>`<li>Record ${i+1}: (${p.x}, ${p.y}); recorded pair agreement: ${check.matches[i]?'yes':'no'}.</li>`).join('')}</ol>${supportText(check.supportBefore)}`;
 return `<section class="pp-comparison"><h2 id="pp-comparison-heading" tabindex="-1">Your points and these records</h2><p>${esc(T.compareExplanation)}</p><p><strong>Your point · solid circle</strong> / <strong>Record pair · hollow square</strong></p><p>${esc(comparisonText(check,v))}</p>${check.placements.map((p,i)=>check.matches[i]?'':`<p>Record ${i+1}: your point is (${p.x}, ${p.y}); its card is (${v.case.rows[i].x}, ${v.case.rows[i].y}).</p>`).join('')}<p>${esc(T.comparisonLimit)}</p></section>`;
}
function history(v){
 const rawCount=Array.isArray(v.sheet?.checks)?v.sheet.checks.length:0,retained=Math.max(0,rawCount-v.checks.length);
 return rawCount||v.checks.length?`<details class="pp-history"><summary>Earlier record comparisons (${rawCount})</summary><p>These are your earlier comparisons, kept as they were.</p>${retained?`<p>${retained} earlier ${retained===1?'comparison cannot':'comparisons cannot'} be shown here. ${retained===1?'Its original stays':'Their originals stay'} in your notes.</p>`:''}${v.checks.map((c,i)=>`<section><h3>Comparison ${i+1}</h3>${comparison(v,c,{historical:true})}</section>`).join('')}</details>`:'';
}
function rowCard(v){const n=v.placements.length;return `<section class="pp-card"><h2 id="pp-row-heading" tabindex="-1">${v.kept?'Kept chart':v.next?`Record ${n+1}`:'Every record has a point.'}</h2><p id="pp-progress">${esc(progress(v))}</p>${!v.kept&&v.next?`<p class="pp-pair" id="pp-row-values"><strong>${esc(v.source.axes.x.label)}: ${v.next.x}</strong><strong>${esc(v.source.axes.y.label)}: ${v.next.y}</strong></p><p>${T.instruction}</p>`:`<p>${esc(v.kept?T.readOnly:T.complete)}</p>`}</section>`;}
function selectors(v,s){return `<div class="pp-fields">${['x','y'].map(axis=>`<label>${axis.toUpperCase()} · ${esc(v.source.axes[axis].label)}<select data-pp-${axis} aria-describedby="pp-row-heading${v.next?' pp-row-values':''} pp-progress"${!v.next?' disabled':''}><option value="">Choose</option>${Array.from({length:v.source.axes[axis].max+1},(_,n)=>`<option value="${n}"${s[axis]===String(n)?' selected':''}>${n}</option>`).join('')}</select></label>`).join('')}</div><p class="pp-place-help">${T.chooseBoth}</p><div class="pp-actions">${button('data-pp-place','Place this point',{primary:true,disabled:!v.next||s.x===''||s.y===''} )}${button('data-pp-undo','Back one record',{disabled:!v.placements.length})}</div>`;}
function narration(v,s){
 // Garden story first, then the chart's own frozen source; historical sources keep their own wording.
 const base=[`Willowbank story. ${T.invitation} Chart source.`,v.source.title,v.source.origin,v.source.notice,v.source.context,`X: ${v.source.axes.x.label}. Y: ${v.source.axes.y.label}.`];
 if(s.helper==='worked'){const helper=workedExample(v.source,v.sheet.caseId);return base.concat(`Worked example · Record ${v.case.rows.findIndex(r=>r.id===helper.rowId)+1} from ${v.case.title}`,helper.steps.slice(0,s.step+1).map(x=>x.text)).join(' ');}
 if(s.helper==='patterns'){const p=patternExample(v.source);return base.concat('Same axes, different patterns. Example charts · your own points are on your chart.',p.caseIds.map(id=>sourceCase(v.source,id).title),p.paragraphs).join(' ');}
 base.push(v.next?`Record ${v.placements.length+1}. ${v.source.axes.x.label}: ${v.next.x}. ${v.source.axes.y.label}: ${v.next.y}. ${T.instruction}`:T.complete,progress(v));
 if(s.overlay&&v.checks.length){const c=v.checks.at(-1);base.push(T.compareExplanation,comparisonText(c,v),...c.placements.map((p,i)=>c.matches[i]?'':`Record ${i+1}: your point is (${p.x}, ${p.y}); its card is (${v.case.rows[i].x}, ${v.case.rows[i].y}).`),T.comparisonLimit);}
 return base.join(' ');
}
function supportControls(v,s){return `<div class="pp-actions">${hearButton(narration(v,s),'Hear this turn').replace('<button','<button data-pp-hear')}${button('data-pp-together',v.support.together?'Working together reported':"We're working together")}</div>`;}
function helpers(v,s){
 if(s.helper==='worked'){
  const h=workedExample(v.source,v.sheet.caseId);if(!h)return '';
  const row=v.case.rows.find(r=>r.id===h.rowId),index=v.case.rows.indexOf(row),step=h.steps[s.step];
  return `<section class="pp-example" data-pp-example="${esc(step.stage)}"><h2 id="pp-worked-heading" tabindex="-1">How a pair becomes a point</h2><p><strong>Worked example · Record ${index+1} from ${esc(v.case.title)}</strong></p>${plot(v.source,[],{stage:{stage:step.stage,row},caption:'Worked example · your own points are on your chart'})}<ol>${h.steps.slice(0,s.step+1).map(x=>`<li>${esc(x.text)}</li>`).join('')}</ol><div class="pp-actions">${button('data-pp-worked-step="-1"','Back',{disabled:s.step===0})}${button('data-pp-worked-step="1"','Next',{disabled:s.step===h.steps.length-1})}${button('data-pp-worked-close','Return to my points')}</div>${supportControls(v,s)}</section>`;
 }
 const p=patternExample(v.source);if(!p)return '';
 return `<section class="pp-patterns"><h2 id="pp-patterns-heading" tabindex="-1">Same axes, different patterns</h2><p><strong>Example charts · your own points are on your chart</strong></p><div class="pp-pattern-grid">${p.caseIds.map(id=>{const c=sourceCase(v.source,id);return `<article class="pp-pattern-card"><h3>${esc(c.title)}</h3>${plot(v.source,[],{cardPairs:c.rows,attrs:`data-pp-pattern-plot data-case="${esc(id)}"`,caption:c.title})}<details><summary>Read ${esc(c.title)} records</summary>${pairTable(v.source,c.rows,{caption:c.title,rows:c.rows})}</details></article>`;}).join('')}</div>${p.paragraphs.map(text=>`<p>${esc(text)}</p>`).join('')}${button('data-pp-patterns-close','Back to my chart')}${supportControls(v,s)}</section>`;
}
function chart(v,s){
 if(!v.readable)return `<section><h2 id="pp-row-heading" tabindex="-1">Earlier chart kept</h2><p>${T.unreadable}</p>${button('data-pp-choose','Choose other records')}</section>`;
 if(v.mutable&&s.helper)return `${sourceContext(v.source)}${helpers(v,s)}`;
 const compareDisabled=!v.placements.length||v.checkStatus!=='ready',worked=workedExample(v.source,v.sheet.caseId),patterns=patternExample(v.source),overlay=s.overlay&&v.checks.length&&!v.kept;
 return `${sourceContext(v.source)}<div class="pp-workspace">${plot(v.source,v.placements,{cardPairs:overlay?v.case.rows:[],attrs:'data-pp-own-plot',caption:'Your points · same axes as the record table'})}<div class="pp-controls">${rowCard(v)}${v.mutable?selectors(v,s):''}</div></div>${overlay?comparison(v,v.checks.at(-1)):''}<div class="pp-actions">${v.mutable?`${button('data-pp-compare','Compare with these records',{disabled:compareDisabled})}${button('data-pp-keep','Keep this chart')}`:button('data-pp-revise','Revise as a new chart',{primary:true,disabled:!v.canRevise})}${button('data-pp-choose','Choose other records')}</div>${v.kept?'<p>Your earlier chart stays kept. This opens a separate copy using its same records.</p>':''}${v.mutable?`<p>${!v.placements.length?T.compareEmpty:v.checkStatus==='capacity'?T.checkCapacity:v.checkStatus==='malformed'?T.malformedChecks:T.keepExplanation}</p><div class="pp-actions">${worked?button('data-pp-worked','How a pair becomes a point'):''}${patterns?button('data-pp-patterns','Compare patterns'):''}</div>${!worked||!patterns?`<p>${T.helperUnavailable}</p>`:''}${supportControls(v,s)}`:`${!v.canRevise?`<p>${T.capacity}</p>`:''}`}<div class="pp-tables"><details><summary>Read all these records</summary>${pairTable(v.source,v.case.rows,{caption:v.case.title,attr:'data-pp-source-table',rows:v.case.rows})}</details><details><summary>Your placed points</summary>${pairTable(v.source,v.placements,{caption:'Your placed points',attr:'data-pp-own-table',rows:v.case.rows})}<p>${T.overlapping}</p></details></div>${history(v)}<details class="pp-about"><summary>Grown-up details</summary>${supportText(v.support)}<p>${T.grownUp}</p><p>What do the axes measure? Which two numbers belong to one record? What can these pairs tell us, and what can’t they tell us yet?</p></details>`;
}
export function pairedPage(state,owner){const s=session(state,owner),v=pairedView(state,s.id);return `<div class="pp-page" data-pp-root="${s.id?'chart':'chooser'}"><header class="pp-header"><h1>${T.title}</h1>${!s.id?`<p class="pp-intro">${T.invitation} ${T.introduction}</p>`:''}</header>${status(s)}${s.id?chart(v,s):chooser(s,v)}${footer()}</div>`;}

export function bindPairedPoints(state,ctx){
 const root=document.querySelector('[data-pp-root]');if(!root)return;
 const owner=ctx.explorerId(),s=session(state,owner),options={canExport:ctx.canExport};
 const live=()=>root.isConnected&&visit===s&&location.hash==='#learn/math/paired'&&ctx.explorerId()===owner&&ctx.notebook()===state&&ctx.isActive?.()!==false;
 const stop=()=>{ctx.stopSpeech?.();ctx.stopSound?.();};
 const focus=selector=>{if(ctx.focus)ctx.focus(selector);else document.querySelector(selector)?.focus();};
 const notify=(text,move=true)=>{if(!live())return;s.notice=text;const n=root.querySelector('#pp-status');if(n){n.textContent=text;n.classList.remove('sr-only');if(move)n.focus();}};
 const refresh=target=>{ctx.render();if(target)focus(typeof target==='function'?target():target);};
 const local=(change,target)=>{if(!live())return;stop();change();refresh(target);};
 const failure=(type='normal')=>{const v=pairedView(state,s.id);return v.status==='unsupported'?T.unsupported:s.id&&!v.readable?T.unreadable:s.id&&!v.mutable&&type!=='revise'?T.readOnly:(type==='create'||type==='revise')&&!v.canCreate?T.capacity:type==='check'&&v.checkStatus==='capacity'?T.checkCapacity:type==='check'&&v.checkStatus==='malformed'?T.malformedChecks:T.safety;};
 const action=(change,{target='#pp-row-heading',message='',type='normal'}={})=>{
  if(!live())return false;stop();const before=state.pairedPoints,result=change();if(result===false){notify(failure(type));return false;}
  let saved=null;if(state.pairedPoints!==before)saved=ctx.save?.();s.notice=saved?.ok===false?T.saveFailure:message;refresh(saved?.ok===false?'#pp-status':target);return result;
 };
 const all=(selector,fn)=>root.querySelectorAll(selector).forEach(b=>b.addEventListener('click',()=>{if(live()&&!b.disabled)fn(b);}));
 all('[data-pp-source]',b=>local(()=>{s.source=b.dataset.ppSource;s.notice='';},'[data-pp-start]'));
 all('[data-pp-start]',()=>action(()=>{const id=createPairedChart(state,pairedSource(),s.source,options);if(!id)return false;Object.assign(s,{id,x:'',y:'',helper:null,step:0,overlay:false});return id;},{type:'create'}));
 all('[data-pp-open]',b=>local(()=>{Object.assign(s,{id:b.dataset.ppOpen,x:'',y:'',helper:null,step:0,overlay:false,notice:''});},'#pp-row-heading'));
 all('[data-pp-choose]',()=>local(()=>{Object.assign(s,{id:null,source:null,x:'',y:'',helper:null,step:0,overlay:false,notice:''});},'#pp-chooser-heading'));
 for(const axis of ['x','y'])root.querySelector(`[data-pp-${axis}]`)?.addEventListener('change',e=>{if(!live())return;s[axis]=e.target.value;const place=root.querySelector('[data-pp-place]');if(place)place.disabled=s.x===''||s.y===''||!pairedView(state,s.id).next;});
 all('[data-pp-place]',()=>action(()=>{if(s.x===''||s.y===''||!placePairedPoint(state,s.id,Number(s.x),Number(s.y),options))return false;s.x='';s.y='';s.overlay=false;return true;},{target:()=>pairedView(state,s.id).next?'[data-pp-x]':'#pp-row-heading'}));
 all('[data-pp-undo]',()=>action(()=>{if(!undoPairedPoint(state,s.id,options))return false;s.x='';s.y='';s.overlay=false;return true;}));
 all('[data-pp-compare]',()=>action(()=>{if(!checkPairedChart(state,s.id,options))return false;s.overlay=true;return true;},{type:'check',target:'#pp-comparison-heading'}));
 all('[data-pp-keep]',()=>action(()=>{if(!keepPairedChart(state,s.id,options))return false;s.overlay=false;s.helper=null;return true;},{target:'#pp-status',message:T.kept}));
 all('[data-pp-revise]',()=>action(()=>{const id=revisePairedChart(state,s.id,options);if(!id)return false;Object.assign(s,{id,x:'',y:'',helper:null,step:0,overlay:false});return id;},{type:'revise',message:T.revised}));
 all('[data-pp-worked]',()=>action(()=>{if(!usePairedSupport(state,s.id,'worked',options))return false;s.helper='worked';s.step=0;return true;},{target:'#pp-worked-heading'}));
 all('[data-pp-patterns]',()=>action(()=>{if(!usePairedSupport(state,s.id,'patterns',options))return false;s.helper='patterns';return true;},{target:'#pp-patterns-heading'}));
 all('[data-pp-worked-step]',b=>local(()=>{const h=workedExample(pairedView(state,s.id).source,pairedView(state,s.id).sheet.caseId);s.step=Math.max(0,Math.min(h.steps.length-1,s.step+Number(b.dataset.ppWorkedStep)));},'#pp-worked-heading'));
 all('[data-pp-worked-close]',()=>local(()=>{s.helper=null;},'[data-pp-worked]'));
 all('[data-pp-patterns-close]',()=>local(()=>{s.helper=null;},'[data-pp-patterns]'));
 all('[data-pp-together]',()=>action(()=>usePairedSupport(state,s.id,'together',options),{target:'[data-pp-together]',message:'Working together is reported for this chart.'}));
 // Capture commits the request before play-media's native bubble listener. A
 // refused first request stops propagation without exposing its speech text.
 root.addEventListener('click',event=>{
  const hear=event.target.closest?.('[data-pp-hear]');if(!hear||!root.contains(hear))return;
  if(!live()){event.preventDefault();event.stopImmediatePropagation();return;}
  stop();const before=state.pairedPoints;
  if(!usePairedSupport(state,s.id,'narration',options)){event.preventDefault();event.stopImmediatePropagation();notify(failure());return;}
  if(state.pairedPoints!==before){const saved=ctx.save?.();if(saved?.ok===false)notify(T.saveFailure,false);}
 },{capture:true});
}

export function pairedNotes(state){
 if(state===null||typeof state!=='object'||!Object.hasOwn(state,'pairedPoints'))return '';
 try{
  const v=pairedView(state);return `<section class="pp-notes"><h2>Paired points</h2>${v.status==='unsupported'?`<p>${T.unsupported}</p>`:v.sheets.map(item=>{if(!item.readable)return `<p>${T.unreadable}</p>`;const sheet=pairedView(state,item.id);return `<article><h3>${esc(sheet.source.title)} · ${esc(item.id)}</h3><p>${esc(sheet.source.origin)}</p><p>${esc(sheet.source.notice)}</p><p>${esc(sheet.source.context)}</p><p>X: ${esc(sheet.source.axes.x.label)} (0–${sheet.source.axes.x.max}); Y: ${esc(sheet.source.axes.y.label)} (0–${sheet.source.axes.y.max}).</p><p>${esc(sheet.case.title)} · ${esc(progress(sheet))} ${sheet.kept?'Kept chart':'In progress'}.</p>${pairTable(sheet.source,sheet.placements,{caption:'Recorded plotted pairs'})}${supportText(sheet.support)}${history(sheet)}</article>`;}).join('')||'<p>No charts have been started.</p>'}<p>${T.grownUp}</p>${rawDetails(state.pairedPoints)}</section>`;
 }catch{return `<section class="pp-notes"><h2>Paired points</h2><p>${T.unreadable}</p>${rawDetails(state.pairedPoints)}</section>`;}
}
