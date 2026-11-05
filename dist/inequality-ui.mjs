import {inequalityFamilies,createInequalitySource} from './inequality-content.mjs';
import {newInequalityWork,changeInequalityWork,inequalitySheetsView,keepInequalitySheet,relationWords,relationSymbol,expressionText,solution,probeResult,reasoning,rayGeometry} from './inequality-core.mjs';
import {stopSpeech} from './play-media.mjs';

const visits=new WeakMap(),clone=x=>structuredClone(x);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(attrs,label,primary=false)=>`<button type="button" class="${primary?'primary':'secondary'}" ${attrs}>${esc(label)}</button>`;
const halfValues=(min,max)=>Array.from({length:(max-min)*2+1},(_,i)=>min+i/2);
const number=x=>String(Object.is(x,-0)?0:x);
const spoken=x=>number(x).replace('-','negative ').replace('.',' point ');
const rayWords=r=>`All real numbers ${r.direction==='lower'?'less than':'greater than'}${r.inclusive?' or equal to':''} ${number(r.boundary)}.`;
const equation=s=>`${expressionText(s)} ${relationSymbol(s.relation)} ${number(s.c)}`;
const expressionWords=s=>`${s.a===1?'x':s.a===-1?'negative x':spoken(s.a)+' times x'}${s.b===0?'':s.b<0?' minus '+spoken(-s.b):' plus '+spoken(s.b)}`;
const equationWords=s=>`${expressionWords(s)} ${relationWords(s.relation)} ${spoken(s.c)}`;
const speechNumbers=text=>text.replace(/-?\d+(?:\.\d+)?/g,value=>spoken(Number(value)));
const spokenRay=r=>`All real numbers ${r.direction==='lower'?'less than':'greater than'}${r.inclusive?' or equal to':''} ${spoken(r.boundary)}.`;
function slot(source,work){return {source:clone(source),work:clone(work||newInequalityWork(source)),turn:'try',folds:{},status:''};}
function getVisit(book,owner){
 let v=visits.get(book);
 if(!v||v.owner!==owner){v={owner,active:false,family:inequalityFamilies[0].id,counters:new Map(),drafts:new Map(),copies:new Map(),readonly:new Map(),key:'',screen:'draft',card:null,page:null};visits.set(book,v);}
 return v;
}
function familyDraft(v){
 const index=v.counters.get(v.family)||1;v.counters.set(v.family,index);
 const source=createInequalitySource(v.family,index),key=source.id;
 if(!v.drafts.has(key))v.drafts.set(key,slot(source));
 v.key=key;v.screen='draft';return v.drafts.get(key);
}
const current=v=>v.screen==='draft'?v.drafts.get(v.key):v.screen==='card'?v.readonly.get(v.card):null;
export const inequalityActive=(book,owner)=>visits.get(book)?.owner===owner&&visits.get(book)?.active===true;
export function openInequality(book,owner){const v=getVisit(book,owner);v.active=true;if(v.screen==='draft'&&!current(v))familyDraft(v);return true;}
export function inequalityEntry(){return `<aside class="ineq-entry"><h2>Which values fit?</h2><p>Try a rule that allows a whole range of numbers. Draw the range on a number line.</p>${button('data-equality-inequality','Explore inequalities')}</aside>`;}

function diagram(ray,label,kind){
 const g=rayGeometry(ray),lower=ray.direction==='lower',tip=lower?60:640,base=lower?78:622;
 return `<svg class="ineq-diagram" data-ineq-ray="${kind}" role="img" aria-label="${esc(`${label}. ${rayWords(ray)} The arrow continues beyond the displayed numbers.`)}" viewBox="0 0 700 160"><line class="ineq-axis" x1="60" y1="65" x2="640" y2="65"/>${[-6,-4,-2,0,2,4,6].map(x=>{const at=60+(x+6)*580/12;return `<line class="ineq-tick" x1="${at}" y1="65" x2="${at}" y2="78"/><text x="${at}" y="135" text-anchor="middle" style="font-size:48px">${number(x)}</text>`;}).join('')}<line data-ineq-segment x1="${lower?base:g.startX}" y1="65" x2="${lower?g.endX:base}" y2="65"/><polygon data-ineq-arrow points="${tip},65 ${base},57 ${base},73"/><circle data-ineq-endpoint cx="${g.boundaryX}" cy="65" r="10" fill="${ray.inclusive?'currentColor':'white'}"/></svg>`;
}
function fold(a,key,title,body){return `<details data-ineq-fold="${key}"${a.folds[key]?' open':''}><summary>${esc(title)}</summary>${body}</details>`;}
function sourceHeader(s){return `<p class="ineq-story">Help the surveyor label every number that fits.</p><div class="ineq-rule"><strong data-ineq-equation>${esc(equation(s))}</strong><p>${esc(`${expressionText(s)} ${relationWords(s.relation)} ${number(s.c)}.`)}</p></div><p class="ineq-domain">x can be any real number, including negatives and fractions.</p>`;}
function probe(a,readonly){const w=a.work,s=a.source,r=probeResult(s,w);return `<section class="ineq-probe"><h3${a.turn==='try'?' id="ineq-current-title" tabindex="-1"':''}>${a.turn==='try'?'Choose a number. Does it fit?':'Test a number against both rules'}</h3><div class="ineq-probe-controls">${button(`data-ineq-step="-1"${readonly||w.probe<=-6?' disabled':''}`,'Half a step lower')}<label>Number to try<select data-ineq-probe${readonly?' disabled':''}>${halfValues(-6,6).map(x=>`<option value="${number(x)}"${x===w.probe?' selected':''}>${number(x)}</option>`).join('')}</select></label>${button(`data-ineq-step="1"${readonly||w.probe>=6?' disabled':''}`,'Half a step higher')}</div><table data-ineq-probe-result><caption>A test of one number</caption><tbody><tr><th scope="row">x</th><td>${esc(number(w.probe))}</td></tr><tr><th scope="row">${esc(expressionText(s))}</th><td>${esc(number(r.left))} ${esc(relationSymbol(s.relation))} ${esc(number(r.right))}<br><span data-ineq-fit>${r.fits?'Fits':'Does not fit'}</span></td></tr><tr><th scope="row">Your ray</th><td data-ineq-in-ray>${r.inRay?'Includes':'Excludes'} ${esc(number(w.probe))}</td></tr></tbody></table><p>For the whole range, open the reasoning.</p></section>`;}
function draw(a,readonly){const w=a.work;return `<section class="ineq-draw"><h3 id="ineq-current-title" tabindex="-1">Where does your range begin?</h3><label>Boundary number<select data-ineq-boundary${readonly?' disabled':''}>${halfValues(-4,4).map(x=>`<option value="${number(x)}"${x===w.boundary?' selected':''}>${number(x)}</option>`).join('')}</select></label><div class="ineq-choice" role="group" aria-label="Which side of the boundary?">${['lower','higher'].map(id=>button(`data-ineq-direction="${id}" aria-pressed="${w.direction===id}"${readonly?' disabled':''}`,id==='lower'?'Lower numbers':'Higher numbers')).join('')}</div><div class="ineq-choice" role="group" aria-label="Does the boundary belong?">${[false,true].map(value=>button(`data-ineq-inclusive="${value}" aria-pressed="${w.inclusive===value}"${readonly?' disabled':''}`,value?'Include the boundary':'Leave the boundary out')).join('')}</div><p>${w.inclusive?'A filled circle includes the boundary.':'An open circle leaves the boundary out.'} The arrow continues in your chosen direction.</p></section>`;}
function reference(a,readonly){
 const s=a.source,w=a.work;
 if(!w.referenceShown)return readonly?'<p>Reasoning was not opened on this sheet. Work on a copy to open it.</p>':button('data-ineq-reference','Show reasoning');
 const ray=solution(s);return `<section class="ineq-reference"><h3 tabindex="-1">Reasoning for the source rule</h3><ol>${reasoning(s).map(row=>`<li><strong>${esc(row.equation)}</strong><p>${esc(row.text)}</p></li>`).join('')}</ol><h4>Source solution</h4>${diagram(ray,'Source solution','reference')}<p>${esc(rayWords(ray))}</p><p>The source solution and Your ray are separate. You can compare them and change your own idea.</p></section>`;
}
function activePage(a,readonly,hasCopy){const s=a.source,w=a.work;return `<h2 id="ineq-title" tabindex="-1">${esc(s.title)}</h2>${readonly?`<p class="ineq-kept">Kept sheet. Its source and your choices stay unchanged.</p>${button('data-ineq-copy',hasCopy?'Return to your copy':'Work on a copy',true)}`:''}${sourceHeader(s)}<div class="ineq-turns" role="group" aria-label="Ways to explore">${button(`data-ineq-turn="try" aria-pressed="${a.turn==='try'}"`,'Try values')}${button(`data-ineq-turn="draw" aria-pressed="${a.turn==='draw'}"`,'Draw a rule')}</div><div class="ineq-instrument"><div class="ineq-your-ray"><h3>Your ray</h3>${diagram(w,'Your ray','learner')}<p data-ineq-ray-description>${esc(rayWords(w))}</p><p class="ineq-range-note">All real numbers between the marks count. The arrow continues beyond this window.</p></div>${a.turn==='try'?probe(a,readonly):draw(a,readonly)}</div>${a.turn==='draw'?probe(a,readonly):''}<div class="ineq-keep-row">${button(`data-ineq-keep${readonly?' disabled':''}`,'Keep this sheet',true)}${reference(a,readonly)}</div><p id="ineq-status" role="status" tabindex="-1">${esc(a.status)}</p>${fold(a,'story','Why the surveyor asks',`<p>${esc(s.story)}</p>`)}${fold(a,'teaching','A different example and help',s.teaching.map(t=>`<p>${esc(t)}</p>`).join(''))}${fold(a,'notice','About this number model',`<p>${esc(s.notice)}</p>`)}<p class="ineq-return-question">If this were an equals sign, which value would make it true? Where is it on your line?</p>`;}
function shelf(book,v){const view=inequalitySheetsView(book),total=view.items.length;if(v.page===null){const last=view.items.findLast(x=>x.readable);v.page=Math.floor((last?.index??Math.max(0,total-1))/8);}v.page=Math.max(0,Math.min(v.page,Math.max(0,Math.ceil(total/8)-1)));const start=v.page*8;return `<h2 id="ineq-title" tabindex="-1">Kept sheets</h2>${view.status==='unavailable'?'<p>This saved format cannot be opened here. Its exact records stay in Notes. Your working sheets are still open.</p>':''}${total?`<p>Sheets ${start+1}–${Math.min(start+8,total)} of ${total}</p><ol start="${start+1}">${view.items.slice(start,start+8).map(item=>`<li>${item.readable?button(`data-ineq-card="${esc(item.id)}"`,`Sheet ${item.index+1}: ${item.raw.source.title}`):'<p>This sheet is unavailable here. Its original stays unchanged in Notes.</p>'}</li>`).join('')}</ol><div class="ineq-actions">${button(`data-ineq-page="-1"${start===0?' disabled':''}`,'Previous sheets')}${button(`data-ineq-page="1"${start+8>=total?' disabled':''}`,'Next sheets')}</div>`:view.status==='unavailable'?'':'<p>No sheet has been kept yet. Try a number or draw a range, then Keep this sheet.</p>'}<p id="ineq-status" role="status" tabindex="-1"></p>`;}
export function inequalityPage(book,owner){
 const v=getVisit(book,owner);
 if(v.screen==='draft'&&!current(v))familyDraft(v);
 if(v.screen==='card'){const item=inequalitySheetsView(book).items.find(x=>x.readable&&x.id===v.card);if(item){const before=v.readonly.get(item.id),bytes=JSON.stringify(item.raw);if(!before||before.raw!==item.raw||before.rawBytes!==bytes)v.readonly.set(item.id,Object.assign(slot(item.raw.source,item.raw.work),{raw:item.raw,rawBytes:bytes}));}}
 const a=v.screen==='card'&&!inequalitySheetsView(book).items.some(x=>x.readable&&x.id===v.card)?null:current(v);
 return `<section class="ineq-page" data-ineq-root><header><div class="ineq-actions">${button('data-ineq-back','Back to equality')}${button('data-ineq-draft','Your working sheet')}${button('data-ineq-shelf','Kept sheets')}${button('data-ineq-hear data-speak=""','Hear this page')}</div><h1>Which values fit?</h1></header>${v.screen==='shelf'?shelf(book,v):a?activePage(a,v.screen==='card',v.copies.has(v.card)):'<h2 id="ineq-title" tabindex="-1">This sheet is unavailable here</h2><p>Its original stays unchanged in Notes.</p><p id="ineq-status" role="status" tabindex="-1"></p>'}<details class="ineq-families" data-ineq-families><summary>Try another rule</summary><p>Keep a sheet, then try a rule with the opposite sign. What changes? Every family stays open.</p><label>Family of rules<select data-ineq-family>${inequalityFamilies.map(f=>`<option value="${esc(f.id)}"${f.id===v.family?' selected':''}>${esc(f.label)}</option>`).join('')}</select></label>${button('data-ineq-another','Another rule in this family')}<p>Each family has ten number variations. Earlier working sheets wait when you return to a variation.</p></details><footer><p>Keep a sheet to save it beyond this open page.</p><a href="#notes">Notes and download</a></footer></section>`;
}

export function bindInequality(book,ctx){
 const owner=()=>typeof ctx.explorerId==='function'?ctx.explorerId():ctx.explorerId,v=getVisit(book,owner()),root=document.querySelector('[data-ineq-root]');if(!root)return;
 const a=current(v),screen=v.screen,key=v.key,card=v.card,source=a?.source,parents=new WeakMap(),route=location.hash;
 const rawRoot=book.inequalitySheets,rawBytes=JSON.stringify(rawRoot),ancestry=[];for(let n=root;n&&n!==document;n=n.parentNode)ancestry.push([n,n.parentNode]);let expected=a?.work;
 const live=n=>visits.get(book)===v&&v.active&&inequalityActive(book,owner())&&(typeof ctx.notebook==='function'?ctx.notebook():ctx.notebook)===book&&(!ctx.isActive||ctx.isActive())&&location.hash===route&&route==='#learn/math/equality'&&root.isConnected&&document.querySelector('[data-ineq-root]')===root&&n.isConnected&&root.contains(n)&&parents.get(n)===n.parentNode&&ancestry.every(([child,parent])=>child.parentNode===parent)&&v.screen===screen&&v.key===key&&v.card===card&&current(v)===a&&a?.source===source&&a?.work===expected&&book.inequalitySheets===rawRoot&&JSON.stringify(book.inequalitySheets)===rawBytes;
 const stop=()=>stopSpeech(),focus=selector=>{const node=document.querySelector('[data-ineq-root]')?.querySelector(selector);if(node&&!node.disabled)node.focus({preventScroll:true});else document.querySelector('#ineq-title')?.focus({preventScroll:true});};
 const redraw=(selector='#ineq-title')=>{ctx.render?.();focus(selector);};
 const guard=n=>{parents.set(n,n.parentNode);for(const type of ['click','input','change','toggle','keydown','focusin'])n.addEventListener(type,e=>{if(!live(n)){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});};
 guard(root);root.querySelectorAll('button,a,select,details,summary').forEach(guard);
 function status(message){if(a)a.status=message;const node=root.querySelector('#ineq-status');if(node){node.textContent=message;node.focus({preventScroll:true});}}
 const captureFolds=()=>{v.familyOpen=!!root.querySelector('[data-ineq-families]')?.open;if(a)root.querySelectorAll('[data-ineq-fold]').forEach(n=>{a.folds[n.dataset.ineqFold]=n.open;});};
 function on(selector,fn,target='#ineq-title'){root.querySelectorAll(selector).forEach(n=>n.addEventListener('click',()=>{if(!live(n)||n.disabled)return;captureFolds();stop();if(fn(n)!==false)redraw(typeof target==='function'?target(n):target);}));}
 function change(action,value){if(screen!=='draft'||!a)return false;const next=changeInequalityWork(source,a.work,action,value);if(!next)return false;a.work=next;expected=next;return true;}
 function choose(selector,action){root.querySelector(selector)?.addEventListener('change',e=>{const n=e.currentTarget;if(!live(n)||n.disabled)return;captureFolds();stop();if(change(action,Number(n.value)))redraw(selector);});}
 on('[data-ineq-back]',()=>{v.active=false;ctx.render?.();const heading=document.querySelector('#equality-heading');heading?.focus({preventScroll:true});return false;});
 on('[data-ineq-draft]',()=>{if(!v.drafts.has(v.key))familyDraft(v);v.screen='draft';});
 on('[data-ineq-shelf]',()=>{v.screen='shelf';});
 on('[data-ineq-card]',n=>{v.card=n.dataset.ineqCard;v.screen='card';});
 on('[data-ineq-page]',n=>{v.page+=Number(n.dataset.ineqPage);},()=>v.page===0?'[data-ineq-page="1"]':'[data-ineq-page="-1"]');
 on('[data-ineq-turn]',n=>{if(!a)return false;a.turn=n.dataset.ineqTurn;},'#ineq-current-title');
 on('[data-ineq-step]',n=>change('probe',a.work.probe+Number(n.dataset.ineqStep)/2),()=>a.work.probe<=-6?'[data-ineq-step="1"]':a.work.probe>=6?'[data-ineq-step="-1"]':'[data-ineq-probe]');
 choose('[data-ineq-probe]','probe');choose('[data-ineq-boundary]','boundary');
 on('[data-ineq-direction]',n=>change('direction',n.dataset.ineqDirection),n=>`[data-ineq-direction="${n.dataset.ineqDirection}"]`);
 on('[data-ineq-inclusive]',n=>change('inclusive',n.dataset.ineqInclusive==='true'),n=>`[data-ineq-inclusive="${n.dataset.ineqInclusive}"]`);
 on('[data-ineq-reference]',()=>change('reference'),'.ineq-reference h3');
 root.querySelector('[data-ineq-family]')?.addEventListener('change',e=>{const n=e.currentTarget;if(!live(n)||!inequalityFamilies.some(f=>f.id===n.value))return;captureFolds();stop();v.family=n.value;familyDraft(v);redraw();});
 on('[data-ineq-another]',()=>{v.counters.set(v.family,(v.counters.get(v.family)||1)%10+1);familyDraft(v);});
 on('[data-ineq-copy]',()=>{if(screen!=='card'||!a?.raw)return false;let draftKey=v.copies.get(card);if(!draftKey||!v.drafts.has(draftKey)){draftKey=`copy:${card}`;const copy=slot(a.raw.source,a.raw.work);copy.turn=a.turn;copy.folds={...a.folds};v.drafts.set(draftKey,copy);v.copies.set(card,draftKey);}v.key=draftKey;v.screen='draft';});
 on('[data-ineq-keep]',()=>{
  if(screen!=='draft'||!a)return false;
  const id=keepInequalitySheet(book,source,a.work,{canExport:ctx.canExport});
  if(!id){status('This sheet has not been kept. Your working sheet is still here. The notebook may be too large or its saved format unavailable. Open Notes and download before making room.');return false;}
  let saved;try{saved=ctx.save?.();}catch{saved={ok:false};}
  const record=inequalitySheetsView(book).items.find(x=>x.readable&&x.id===id),kept=slot(record?.raw.source||source,record?.raw.work||a.work);kept.turn=a.turn;kept.folds={...a.folds};
  kept.status=saved?.enabled===false?'Kept in this open page. Saving is off; download Notes before closing.':saved?.ok===false?'Kept in this open page. Device storage did not save; download Notes before closing.':'This sheet is kept.';
  if(record)Object.assign(kept,{raw:record.raw,rawBytes:JSON.stringify(record.raw)});
  v.readonly.set(id,kept);v.drafts.delete(key);for(const [origin,draft]of v.copies)if(draft===key)v.copies.delete(origin);v.card=id;v.screen='card';v.page=null;
 },'#ineq-status');
 root.querySelectorAll('[data-ineq-fold]').forEach(n=>n.addEventListener('toggle',()=>{if(!live(n)||!a)return;stop();a.folds[n.dataset.ineqFold]=n.open;}));
 const familyFold=root.querySelector('[data-ineq-families]');if(familyFold){familyFold.open=!!v.familyOpen;familyFold.addEventListener('toggle',()=>{if(live(familyFold))v.familyOpen=familyFold.open;});}
 const hear=root.querySelector('[data-ineq-hear]');hear?.addEventListener('click',()=>{if(!live(hear))return;captureFolds();stop();
  const words=['Which values fit?'];
  if(screen==='shelf'){words.push('Kept sheets.');const view=inequalitySheetsView(book);words.push(...view.items.slice(v.page*8,v.page*8+8).map(item=>item.readable?`Sheet ${item.index+1}. ${item.raw.source.title}`:'Sheet unavailable here. Its original stays in Notes.'));}
  else if(a){const s=a.source,w=a.work,r=probeResult(s,w);words.push(s.title,'Help the surveyor label every number that fits.',equationWords(s),'x can be any real number, including negatives and fractions.',a.turn==='try'?'Try values.':'Draw a rule.','Your ray.',spokenRay(w),`Testing x equals ${spoken(w.probe)} gives ${spoken(r.left)} on the left and ${spoken(r.right)} on the right. ${r.fits?'This number fits the source rule.':'This number does not fit the source rule.'} Your ray ${r.inRay?'includes':'excludes'} this value.`);
   if(w.referenceShown)words.push('Reasoning for the source rule.',...reasoning(s).map(row=>speechNumbers(row.text)),'Source solution.',spokenRay(solution(s)));
   if(a.folds.story)words.push(s.story);if(a.folds.teaching)words.push(...s.teaching);if(a.folds.notice)words.push(s.notice);
  }
  hear.dataset.speak=words.join('\n\n');
 },{capture:true});
}
