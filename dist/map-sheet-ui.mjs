import {mapSheetSource,mapWorked,mapOtherWidth,resizeMapWork,divideMap,formatMapRatio,mapNumber,sheetGeometry,mapDisplayPairs,mapSheetsView,keepMapSheet,recordGivenMath} from './map-sheet-core.mjs';
import {MAP_TEXT} from './map-sheet-content.mjs';
import {hearButton} from './play-media.mjs';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy=structuredClone;
const ratio=(n,d)=>divideMap(n,d),fmt=formatMapRatio;
const unit=(n,name)=>`${n} ${name}${Number(n)===1?'':'s'}`;
const cm=r=>`${fmt(r)} ${r.n===r.d?'centimeter':'centimeters'}`;
const button=(attrs,text,{pressed=null,disabled=false}={})=>`<button type="button" ${attrs}${pressed===null?'':` aria-pressed="${pressed}"`}${disabled?' disabled':''}>${esc(text)}</button>`;
const newUI=()=>({page:0,workedOpen:false,step:0,sourceOpen:false});
const names=['Fit the route','See the detail','Read it back'];
let visit=null,bindingGeneration=0;
export function resetMapSheetVisit(){visit=null;bindingGeneration++;}
function session(state,owner){
 if(!visit||visit.state!==state||visit.owner!==owner)visit={state,owner,slots:new Map(),keptUI:new Map(),current:null,qualified:new Set(),notice:''};
 return visit;
}
function active(s,state){
 if(!s.current)return null;
 if(s.current.kind==='draft'){const slot=s.slots.get(s.current.key);return slot?{...slot,key:s.current.key,mutable:true}:null;}
 const found=mapSheetsView(state).items.find(i=>i.id===s.current.id&&i.readable);
 if(!found)return null;
 if(!s.keptUI.has(found.id))s.keptUI.set(found.id,newUI());
 return {work:found.raw,ui:s.keptUI.get(found.id),id:found.id,mutable:false};
}
function draft(source){return {source,key:20,inset:false,readbackShown:false,workedSeen:0,narration:false};}
function slotKey(family,width){return `${family}|${width}`;}
function footer(){return `<footer class="ms-actions"><a href="#workshop/maps">Cartographer’s Table</a><a href="#workshop/scale">Same route, different scale</a><a href="#learn/math">Math explorations</a><a href="#notes">Grown-up notes</a></footer>`;}
export function mapSheetEntry(){return `<aside class="ms-invitation"><a href="#learn/math/map-sheet">A Map That Fits</a><p>Choose a scale for the whole route, then a closer view for the detail.</p></aside>`;}
function sourceFold(w,ui){
 const s=w.source,resized=Number.isInteger(s.resizedFromWidthCm)&&s.resizedFromWidthCm>0&&s.resizedFromWidthCm<=100;
 return `<details data-ms-source-fold${ui.sourceOpen?' open':''}><summary>Source and distances</summary><h3>${resized?'Earlier source wording':'Source wording'}</h3><p>${esc(s.origin)}</p><p>${esc(s.notice)}</p><p>${esc(s.purpose)}</p><p>Current main path: ${esc(s.route.from)} to ${esc(s.route.to)}, ${unit(s.route.lengthM,'meter')}. Usable paper width: ${unit(s.sheetWidthCm,'centimeter')}.</p></details>`;
}
function keyControls(w,mutable){
 return `<section class="ms-key"><p><strong>1 centimeter on paper represents ${unit(w.key,'meter')} on the ground.</strong></p>${mutable?`<div class="ms-keys" role="group" aria-label="Choose the scale">${w.source.keys.map(k=>button(`data-ms-key="${k}" aria-label="1 centimeter represents ${unit(k,'meter')}"`,`1 cm for ${k} m`,{pressed:k===w.key})).join('')}</div>`:''}</section>`;
}
function fitPicture(w){
 const s=w.source,g=sheetGeometry(w),end=g.routeEnd,clipped=!g.fits;
 const description=`Simulated paper, not a ruler. ${unit(s.sheetWidthCm,'centimeter')} usable width. ${s.route.from} to ${s.route.to}: ${unit(s.route.lengthM,'meter')}. At 1 centimeter for ${unit(w.key,'meter')}, the drawing needs ${cm(g.routeCm)}. ${clipped?'Only its prefix is shown; it continues beyond the paper.':'The complete route fits.'}`;
 return `<figure class="ms-paper-figure"><svg viewBox="0 0 500 240" role="img" aria-label="${esc(description)}"><rect class="ms-desk" x="24" y="26" width="452" height="154" rx="12"/><rect data-ms-paper class="ms-paper" x="40" y="40" width="${g.paperEnd-40}" height="125"/><line data-ms-route class="ms-route" x1="40" y1="110" x2="${end}" y2="110"/><circle cx="40" cy="110" r="5" class="ms-point"/><text x="40" y="92" class="ms-svg-label">A</text>${clipped?`<path data-ms-overflow class="ms-continuation" d="M${end-12} 100l12 10-12 10"/>`:`<circle cx="${end}" cy="110" r="5" class="ms-point"/><text x="${end}" y="148" text-anchor="end" class="ms-svg-label">B</text>`}<path class="ms-width" d="M40 193v10M40 198H${g.paperEnd}M${g.paperEnd} 193v10"/><text x="${(40+g.paperEnd)/2}" y="231" text-anchor="middle" class="ms-svg-label">${s.sheetWidthCm} cm</text></svg><figcaption>A: ${esc(s.route.from)}. ${clipped?`Visible part only · continues to ${esc(s.route.to)}.`:`B: ${esc(s.route.to)}.`} The screen picture represents paper centimeters; measuring your screen will not measure this paper.</figcaption></figure>`;
}
function fitReading(w){
 const s=w.source,g=sheetGeometry(w);
 return `<section class="ms-card"><h3>How much paper?</h3><p class="ms-equation">${s.route.lengthM} ÷ ${w.key} = <strong>${cm(g.routeCm)}</strong>.</p><p class="ms-fit-answer">${g.fits?g.spareCm.n===0?'The whole route fits, filling the usable width.':`The whole route fits. It leaves ${cm(g.spareCm)} of the width.`:`The route needs ${cm(g.routeCm)}; only ${unit(s.sheetWidthCm,'centimeter')} are available. The arrow means the drawing continues beyond the paper.`}</p><p>Try a different key. The ${unit(s.route.lengthM,'meter')} route stays the same.</p></section>`;
}
function detailPicture(w,key,kind){
 const s=w.source,height=80*s.features.length+80;
 const drawn=s.features.map((f,i)=>{const length=ratio(f.widthM,key),shown=Math.min(mapNumber(length),s.detailWidthCm),end=40+420*shown/s.detailWidthCm,y=60+80*i,clipped=mapNumber(length)>s.detailWidthCm;return `<g><text x="40" y="${y-20}" class="ms-svg-label">${i+1}</text><rect data-ms-feature="${esc(f.id)}" class="ms-feature" x="40" y="${y-7}" width="${end-40}" height="14"/>${clipped?`<path class="ms-continuation" d="M448 ${y-10}l12 10-12 10"/>`:''}</g>`;}).join('');
 const title=kind==='inset'?'Inset':'Overview detail',y=80*s.features.length+20,pitch=420/s.detailWidthCm;
 const description=`${title}, 1 centimeter for ${unit(key,'meter')}. Window width ${unit(s.detailWidthCm,'centimeter')}. ${s.features.map(f=>`${f.label}: ${unit(f.widthM,'meter')} across, ${cm(ratio(f.widthM,key))} drawn`).join('. ')}. All windows use equal paper-unit pitch.`;
 return `<figure class="ms-detail"><h3>${title} · 1 cm for ${key} m</h3><svg data-ms-${kind}-window viewBox="0 0 500 ${height}" role="img" aria-label="${esc(description)}"><rect class="ms-paper" x="40" y="16" width="420" height="${height-28}"/>${drawn}<path class="ms-width" d="M40 ${y-5}v10M40 ${y}H${40+pitch}M${40+pitch} ${y-5}v10"/><text x="${40+pitch+12}" y="${y+8}" class="ms-svg-label">1 cm</text></svg><figcaption>Each window represents ${unit(s.detailWidthCm,'centimeter')} of paper across.</figcaption><ol class="ms-feature-readings">${s.features.map(f=>{const length=ratio(f.widthM,key);return `<li><strong>${esc(f.label)} · ${unit(f.widthM,'meter')} across.</strong> ${f.widthM} ÷ ${key} = ${cm(length)} on paper.${mapNumber(length)>s.detailWidthCm?` This strip needs ${cm(length)}. Only ${unit(s.detailWidthCm,'centimeter')} are shown; the arrow marks the continuation.`:''}</li>`;}).join('')}</ol></figure>`;
}
function detailPage(c){
 const {work:w,mutable}=c,s=w.source,relation=s.insetKey<w.key?'closer':s.insetKey===w.key?'same':'farther';
 return `<p>Both strips keep the same ground widths. Compare their drawings.</p>${mutable?button('data-ms-inset',w.inset?'Hide inset':relation==='closer'?'Add a closer inset':'Add another inset',{pressed:w.inset}):!w.inset?'<p>Try this map again to add an inset.</p>':''}<div class="ms-detail-pair">${detailPicture(w,w.key,'overview')}${w.inset?detailPicture(w,s.insetKey,'inset'):''}</div>${w.inset?`<section class="ms-card"><p>${relation==='closer'?'The same ground feature takes more paper at the closer scale.':relation==='same'?'These two views use the same scale.':'This inset uses a farther scale. The same feature takes less paper.'}</p><p>Inset drawn length = <strong>${fmt(ratio(w.key,s.insetKey))} × overview drawn length</strong>.</p><p>Which drawing gives you more room for a label? Say what you would use each one for.</p></section>`:''}<p>Fitting the whole route and showing a small feature are different jobs. A map can use an overview and a closer inset.</p>`;
}
function readbackPage(c){
 const {work:w,mutable}=c,s=w.source,r=s.readback,length=ratio(r.groundM,w.key),other=mapOtherWidth(s);
 return `<section class="ms-card"><h3>A visitor measures a different path</h3><p>On a map drawn at your chosen key, the ${esc(r.from)}-to-${esc(r.to)} path measures <strong>${cm(length)}</strong> on paper.</p><p>How far does that stand for? Say it or write on paper.</p>${w.readbackShown?`<section class="ms-calculation"><h3 id="ms-calculation" tabindex="-1">One way</h3><p>Each centimeter represents ${unit(w.key,'meter')}.</p><p class="ms-equation">${fmt(length)} × ${w.key} = <strong>${unit(r.groundM,'meter')}</strong>.</p><p>If you change the key, the drawing gets smaller or larger. The ground distance stays the same.</p><p>The answer is in meters on the ground, not centimeters on paper.</p></section>`:mutable?button('data-ms-readback','Show one way'):'<p>Try this map again to open the calculation.</p>'}</section>${mutable&&other!==null?`<section class="ms-return"><p>The route is unchanged. Will your chosen key still work with the new paper width?</p>${button('data-ms-resize',other<s.sheetWidthCm?'Try this on the smaller sheet':'Try the wider sheet')}</section>`:''}`;
}
function teaching(c){
 const {work:w,ui,mutable}=c,helper=mapWorked(w.source);
 if(!helper)return '<p>Earlier teaching is retained in your notes. This map is still open.</p>';
 if(!mutable&&!w.workedSeen)return '';
 const control=button('data-ms-worked',ui.workedOpen?'Close example':mutable?'Show a different example':'Earlier teaching',{pressed:ui.workedOpen});
 if(!ui.workedOpen)return control;
 return `<section class="ms-teaching"><h3 id="ms-teaching" tabindex="-1">Different example</h3>${mutable?`<p>${esc(helper.steps[ui.step])}</p><div class="ms-actions">${button('data-ms-step="-1"','Previous step',{disabled:ui.step===0})}${button('data-ms-step="1"','Next step',{disabled:ui.step===helper.steps.length-1})}</div>`:`<ol>${helper.steps.slice(0,w.workedSeen).map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`}${control}</section>`;
}
function chooser(s,state){
 const v=mapSheetsView(state);
 return `<section><h2 id="ms-chooser" tabindex="-1">Which sheet shall we try?</h2><p>${esc(MAP_TEXT.invitation)}</p><div class="ms-actions">${button('data-ms-start="wide"','Start the wide sheet')}${button('data-ms-start="small"','Start the small sheet')}</div>${s.slots.size?`<h3>Unkept models in this visit</h3><div class="ms-history">${[...s.slots].map(([key,slot],i)=>button(`data-ms-resume="${esc(key)}"`,`Continue model ${i+1} · ${slot.work.source.title}`)).join('')}</div>`:''}<h3>Earlier kept maps</h3><div class="ms-history">${v.items.length?v.items.map(i=>i.readable?button(`data-ms-open="${esc(i.id)}"`,`Map ${i.index+1} · ${i.raw.source.title}`):'<p>Earlier map retained · its original stays in your notes.</p>').join(''):'<p>No kept maps yet.</p>'}</div>${v.status==='unsupported'?'<p>Earlier maps stay in your notes. This format cannot accept another kept map here.</p>':''}</section>`;
}
export function mapSheetPage(state,owner){
 const s=session(state,owner),c=active(s,state);
 const instruction=!c?'':c.ui.page===0?'Choose a scale for this sheet.':c.ui.page===1?sheetGeometry(c.work).fits?'The route fits. What about the detail?':'What happens to the detail?':'Read a map length back into ground meters.';
 return `<div class="ms-page" data-ms-root${c&&!c.mutable?' data-ms-kept':''}><header><a href="#learn/math">Back to math explorations</a><h1>A Map That Fits</h1><p>Made-up practice map. Screen centimeters are simulated, not a ruler.</p></header>${c?`<section data-ms-turn><h2 id="ms-heading" tabindex="-1">${names[c.ui.page]}</h2><p class="ms-instruction">${instruction}</p><p class="ms-context">${esc(c.work.source.route.from)} → ${esc(c.work.source.route.to)} · ${unit(c.work.source.route.lengthM,'meter')} · ${unit(c.work.source.sheetWidthCm,'centimeter')} usable paper</p><nav class="ms-tabs" aria-label="Map turns">${names.map((name,i)=>button(`data-ms-page="${i}"`,name,{pressed:c.ui.page===i})).join('')}</nav>${keyControls(c.work,c.mutable)}${c.ui.page===0?`<div class="ms-fit-grid">${fitPicture(c.work)}${fitReading(c.work)}</div>${teaching(c)}`:c.ui.page===1?detailPage(c):readbackPage(c)}${sourceFold(c.work,c.ui)}<div class="ms-actions ms-primary-actions">${button(`data-ms-page="${c.ui.page-1}"`,'Previous',{disabled:c.ui.page===0})}${button(`data-ms-page="${c.ui.page+1}"`,'Next',{disabled:c.ui.page===2})}${c.mutable?button('data-ms-keep','Keep this map'):button(`data-ms-again="${esc(c.id)}"`,'Try this map again')}${hearButton('','Hear this turn').replace('<button','<button data-ms-hear')}${button('data-ms-choose','Choose a sheet')}</div><p class="ms-session-note">${c.mutable?'Unkept changes stay in this visit. Keep a map before leaving if you want it later.':'This kept map stays as it was. Try it again to change a choice or open more teaching.'}</p></section>`:chooser(s,state)}<p id="ms-status" role="status" tabindex="-1" class="ms-status${s.notice?'':' sr-only'}">${esc(s.notice)}</p>${footer()}</div>`;
}

export function bindMapSheet(state,ctx){
 const root=document.querySelector('[data-ms-root]');if(!root)return;
 const owner=ctx.explorerId(),s=session(state,owner),generation=++bindingGeneration;
 const live=node=>root.isConnected&&node?.isConnected&&visit===s&&generation===bindingGeneration&&location.hash==='#learn/math/map-sheet'&&ctx.notebook()===state&&ctx.explorerId()===owner&&ctx.isActive?.()!==false;
 let rollback=null;
 const snapshot=()=>{const slots=new Map(s.slots),keptUI=new Map(s.keptUI);if(s.current?.kind==='draft'&&slots.has(s.current.key))slots.set(s.current.key,copy(slots.get(s.current.key)));if(s.current?.kind==='kept'&&keptUI.has(s.current.id))keptUI.set(s.current.id,copy(keptUI.get(s.current.id)));return {current:s.current,slots,keptUI};};
 const show=(focus='#ms-heading',scroll=false)=>{
  ctx.stopSpeech?.();ctx.stopSound?.();const c=active(s,state),pairs=c?mapDisplayPairs(c.work,{...c.ui,mutable:c.mutable}).filter(p=>!s.qualified.has(p.join('x'))):[];
  const ready=recordGivenMath(state,pairs,{canExport:ctx.canExport,exposeFacts:ctx.exposeFacts});
  if(!ready.ok){if(rollback){s.current=rollback.current;s.slots=rollback.slots;s.keptUI=rollback.keptUI;}s.notice=rollback?.current?'That view could not open. Your current drawing and choices are still here. Open Grown-up notes to download your work.':'This drawing could not open without changing earlier number notes. Nothing was changed. Open Grown-up notes to download your work, or return to the map table.';ctx.render();document.querySelector('#ms-status')?.focus();return;}
  for(const pair of pairs)s.qualified.add(pair.join('x'));if(ready.changed)ctx.save?.();ctx.render();const target=document.querySelector(focus)||document.querySelector('#ms-heading');target?.focus({preventScroll:true});if(scroll)target?.scrollIntoView({block:'start'});
 };
 const perform=(node,fn)=>{if(!live(node)||node.disabled)return;rollback=snapshot();s.notice='';try{fn(node);}finally{rollback=null;}};
 const each=(selector,fn)=>root.querySelectorAll(selector).forEach(node=>node.addEventListener('click',()=>perform(node,fn)));
 const editable=fn=>{const c=active(s,state);if(c?.mutable)fn(c);};
 each('[data-ms-start]',b=>{const source=mapSheetSource(b.dataset.msStart);if(!source)return;const key=slotKey('authored',source.sheetWidthCm);if(!s.slots.has(key))s.slots.set(key,{work:draft(source),ui:newUI(),family:'authored'});s.current={kind:'draft',key};show('#ms-heading',true);});
 each('[data-ms-resume]',b=>{if(s.slots.has(b.dataset.msResume)){s.current={kind:'draft',key:b.dataset.msResume};show('#ms-heading',true);}});
 each('[data-ms-open]',b=>{if(mapSheetsView(state).items.some(i=>i.id===b.dataset.msOpen&&i.readable)){const id=b.dataset.msOpen,ui=s.keptUI.get(id)||newUI();s.keptUI.set(id,{...ui,workedOpen:false});s.current={kind:'kept',id};show('#ms-heading',true);}});
 each('[data-ms-again]',b=>{const item=mapSheetsView(state).items.find(i=>i.id===b.dataset.msAgain&&i.readable);if(!item)return;const family=`again:${item.id}`,key=slotKey(family,item.raw.source.sheetWidthCm);if(!s.slots.has(key)){const {source,key:selected,inset,readbackShown,workedSeen,narration}=item.raw;s.slots.set(key,{work:copy({source,key:selected,inset,readbackShown,workedSeen,narration}),ui:newUI(),family});}s.current={kind:'draft',key};show('#ms-heading',true);});
 each('[data-ms-choose]',()=>{s.current=null;show('#ms-chooser',true);});
 each('[data-ms-page]',b=>{const c=active(s,state),page=Number(b.dataset.msPage);if(c&&Number.isInteger(page)&&page>=0&&page<=2){c.ui.page=page;show('#ms-heading',true);}});
 each('[data-ms-key]',b=>editable(c=>{const key=Number(b.dataset.msKey);if(c.work.source.keys.includes(key)){c.work.key=key;show(`[data-ms-key="${key}"]`);}}));
 each('[data-ms-inset]',()=>editable(c=>{c.work.inset=!c.work.inset;show('[data-ms-inset]');}));
 each('[data-ms-readback]',()=>editable(c=>{c.work.readbackShown=true;show('#ms-calculation');}));
 each('[data-ms-worked]',()=>{const c=active(s,state);if(!c)return;const helper=mapWorked(c.work.source);if(!helper||!c.mutable&&!c.work.workedSeen)return;c.ui.workedOpen=!c.ui.workedOpen;if(c.mutable&&c.ui.workedOpen)c.work.workedSeen=Math.max(c.work.workedSeen,c.ui.step+1);show(c.ui.workedOpen?'#ms-teaching':'[data-ms-worked]');});
 each('[data-ms-step]',b=>editable(c=>{const helper=mapWorked(c.work.source),step=c.ui.step+Number(b.dataset.msStep);if(helper&&Number.isInteger(step)&&step>=0&&step<helper.steps.length){c.ui.step=step;c.work.workedSeen=Math.max(c.work.workedSeen,step+1);show('#ms-teaching');}}));
 each('[data-ms-resize]',()=>editable(c=>{const resized=resizeMapWork(c.work);if(!resized)return;const key=slotKey(c.family,resized.source.sheetWidthCm);if(s.slots.has(key))s.notice='Your earlier draft is still here. Its choices have not been replaced.';else s.slots.set(key,{work:resized,ui:newUI(),family:c.family});s.current={kind:'draft',key};show('#ms-heading',true);}));
 each('[data-ms-keep]',()=>editable(c=>{const id=keepMapSheet(state,c.work,{canExport:ctx.canExport});if(!id){const v=mapSheetsView(state);s.notice=v.status==='unsupported'?'Earlier maps stay in your notes. This format cannot accept another kept map here.':!v.canKeep?'Your earlier maps are safe. This notebook cannot keep another map here. You can keep exploring in this visit and download your notes.':'This map could not be kept. Nothing was changed. Your choices are still here. Open Grown-up notes to download your work.';show('#ms-status');return;}s.slots.delete(c.key);s.keptUI.set(id,{...c.ui,workedOpen:false});s.current={kind:'kept',id};const saved=ctx.save?.();s.notice=saved?.enabled===false?'Map kept for this session. Saving on this device is off.':saved?.ok===false?'This map is in this session, but it could not be saved on this device. Download your notes.':'Map kept. Its distances, paper width and choices stay together.';show('#ms-status');}));
 root.querySelector('[data-ms-source-fold]')?.addEventListener('toggle',event=>{if(live(event.target)){const c=active(s,state);if(c)c.ui.sourceOpen=event.target.open;ctx.stopSpeech?.();}});
 root.addEventListener('click',event=>{const hear=event.target.closest?.('[data-ms-hear]');if(!hear)return;const c=active(s,state);if(!live(hear)||!c){event.preventDefault();event.stopImmediatePropagation();return;}if(c.mutable)c.work.narration=true;hear.dataset.speak=root.querySelector('[data-ms-turn]').innerText.replaceAll('×',' times ').replaceAll('÷',' divided by ');},true);
}

// Adult map notes only; never rendered as a child activity.
export function mapSheetNotes(state){
 if(!Object.hasOwn(state,'mapSheets'))return '';
 try{const v=mapSheetsView(state);return `<details class="ms-notes"><summary>A Map That Fits · kept maps</summary><p>Selected representations of invented distances, not grades, independent conversion evidence, surveying or a story plan. Spoken and paper answers are not captured. Given integer facts qualify matching waiting work, not recall attempts. Unkept choices are session-only.</p>${v.items.filter(i=>i.readable).map(i=>`<p>${esc(i.raw.source.title)} · ${esc(i.id)}. ${i.raw.source.route.lengthM}meters on ${i.raw.source.sheetWidthCm}centimeters of paper,1centimeter for ${i.raw.key}meters. Inset: ${i.raw.inset}; calculation disclosed: ${i.raw.readbackShown}; teaching extent: ${i.raw.workedSeen}; narration requested: ${i.raw.narration}.</p>`).join('')}<details><summary>Original map notes, including retained unreadable values</summary><pre>${esc(JSON.stringify(state.mapSheets,null,2))}</pre></details></details>`;}catch{return '<p>Earlier map notes retained unchanged in the download.</p>';}
}
// End adult map notes.
