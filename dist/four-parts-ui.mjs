import {productCases,productParts,makeProductSource,productCopy as T} from './four-parts-content.mjs';
import {validProductFigure,newProductWork,changeProductWork,productResult,productSheetsView,keepProductSheet} from './four-parts-core.mjs';
import {stopSpeech} from './play-media.mjs';

const visits=new WeakMap(),clone=x=>structuredClone(x),ownerOK=x=>typeof x==='string'&&x.trim().length>0;
const bytes=x=>{try{return JSON.stringify(x);}catch{return null;}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(a,t,primary=false)=>`<button type="button" class="${primary?'primary':'secondary'}" ${a}>${esc(t)}</button>`;
const term=t=>t==null?'No label':t.count===0?'0':t.power===0?String(t.count):`${t.count===1?'':t.count}x${t.power===2?'²':''}`;
const polynomial=ns=>ns.map((count,i)=>count?term({count,power:2-i}):'').filter(Boolean).join(' + ')||'0';
const spokenTerm=t=>t==null?'No label':`${t.count} ${t.power===2?'x square':t.power===1?'x strip':'unit square'}${t.count===1?'':'s'}`;
const sides=(s,x,key)=>key==='square'?[x,x]:key==='right'?[s.a,x]:key==='bottom'?[x,s.b]:[s.a,s.b];
const current=v=>v.screen==='draft'?v.drafts.get(v.key):v.screen==='card'?v.readonly.get(v.card):null;
function visit(book,owner,create=true){
 let map=visits.get(book);if(!map&&create){map=new Map();visits.set(book,map);}
 let v=map?.get(owner);if(!v&&create){v={active:false,screen:'draft',key:'',card:null,serial:0,drafts:new Map(),copies:new Map(),readonly:new Map(),catalogCase:'picture',page:0,folds:{},boundRoot:null};map.set(owner,v);}return v;
}
const slot=(source,work,caseId=null)=>({source:clone(source),work:clone(work||newProductWork(source)),caseId,stage:'build',part:'square',help:null,teachingPage:0,folds:{},status:''});
function add(v,source,work,caseId=null){const a=slot(source,work,caseId);a.ordinal=++v.serial;v.key=`draft-${v.serial}`;v.drafts.set(v.key,a);v.screen='draft';v.card=null;return a;}
export const fourPartsActive=(book,owner)=>ownerOK(owner)&&visit(book,owner,false)?.active===true;
export function openFourParts(book,owner){if(!book||typeof book!=='object'||!ownerOK(owner))return false;const v=visit(book,owner);v.active=true;if(v.screen==='draft'&&!current(v))add(v,makeProductSource(v.catalogCase),null,v.catalogCase);return true;}
export const fourPartsEntry=()=>`<aside class="fp-entry">${button('data-equality-four-parts',T.label)}<span>${esc(T.entry)}</span></aside>`;
export function fourPartsReturn(book){
 const r=productSheetsView(book).items.findLast(r=>r.readable);if(!r)return '';
 const {source:s,work:w}=r.raw;
 return `<details class="fp-parent-return"><summary>A kept print layout</summary><p>${esc(s.title)} · x = ${w.x} cm · (${w.x}+${s.a}) by (${w.x}+${s.b}) cm</p><p>Retained labels: ${productParts.map(p=>`${p.letter}: ${esc(term(w.pieces[p.key]))}`).join('; ')}.</p><p>Retained tray: ${esc(polynomial(w.total))}. This is a kept construction, not an assessment.</p></details>`;
}

function rectangle(f,tag,selected=null){
 const {x,a,b}=f,W=x+a,H=x+b,pad=1.2;
 const boxes=[[0,0,x,x],[x,0,a,x],[0,x,x,b],[x,x,a,b]];
 const grid=[];for(let i=1;i<W;i++)grid.push(`M${i} 0V${H}`);for(let i=1;i<H;i++)grid.push(`M0 ${i}H${W}`);
 return `<svg class="fp-diagram" viewBox="0 0 ${W+2*pad} ${H+2*pad}" role="img" aria-label="Four parts of a ${W} by ${H} centimeter rectangle. Picture side x is ${x}, right extension ${a}, bottom extension ${b}. A is the picture square, B the right strip, C the bottom strip, D the corner."><defs><pattern id="fp-lines-${tag}" width=".4" height=".4" patternUnits="userSpaceOnUse"><path d="M0 0L.4 .4" stroke="#665343" stroke-width=".035"/></pattern></defs><g transform="translate(${pad} ${pad})">${boxes.map(([xx,yy,w,h],i)=>`${selected!==null?`<g data-fp-pick="${productParts[i].key}">`:''}<rect class="fp-region fp-region-${i}${productParts[i].key===selected?' fp-region-selected':''}" x="${xx}" y="${yy}" width="${w}" height="${h}"/>${i===1||i===2?`<rect x="${xx}" y="${yy}" width="${w}" height="${h}" fill="url(#fp-lines-${tag})" opacity=".22"/>`:''}<text x="${xx+w/2}" y="${yy+h/2}" dominant-baseline="middle" text-anchor="middle" font-size=".65">${productParts[i].letter}</text>${selected!==null?'</g>':''}`).join('')}<path d="${grid.join('')}" class="fp-unit-grid"/><path d="M${x} 0V${H}M0 ${x}H${W}" class="fp-cuts"/><text x="${x/2}" y="-.35" text-anchor="middle" font-size=".55">${f.notation==='letters'?'x':x}</text><text x="${x+a/2}" y="-.35" text-anchor="middle" font-size=".55">${a}</text><text x="-.35" y="${x/2}" text-anchor="middle" font-size=".55">${f.notation==='letters'?'x':x}</text><text x="-.35" y="${x+b/2}" text-anchor="middle" font-size=".55">${b}</text></g></svg>`;
}
function teachingFigure(f,tag){
 if(f===null)return '';
 if(!validProductFigure(f))return `<p class="fp-note">${esc(T.pictureUnavailable)}</p>`;
 if(f.kind==='rectangle'){
  const expected=[{power:2,count:1},{power:1,count:f.a},{power:1,count:f.b},{power:0,count:f.a*f.b}];
  return rectangle(f,tag)+`<p>This drawing uses x = ${f.x} cm. ${productParts.map((p,i)=>`${p.letter}: ${f.notation==='letters'?esc(term(expected[i])):expected[i].count*f.x**expected[i].power}`).join(' · ')} square centimeters.</p>`;
 }
 const max=Math.max(...f.xs),span=max+f.strip+1.5,H=max+2;
 return `<svg class="fp-contrast" viewBox="0 0 ${span*2} ${H}" role="img" aria-label="${esc(f.xs.map(x=>`At x ${x}, the ${x} by ${x} square has area ${x*x}; the ${f.strip} by ${x} strip has area ${f.strip*x}.`).join(' '))}">${f.xs.map((x,i)=>`<g transform="translate(${i*span+.3} .3)"><rect width="${x}" height="${x}" class="fp-region fp-region-0"/><rect x="${x+.3}" width="${f.strip}" height="${x}" class="fp-region fp-region-1"/><text x="0" y="${max+1}" font-size=".7">x = ${x}</text></g>`).join('')}</svg><p>${f.xs.map(x=>`At x = ${x}: x² = ${x*x}; ${f.strip}x = ${f.strip*x}.`).join(' ')}</p>`;
}
function counter(attributes,value,max,disabled,label){
 return `<div class="fp-counter" role="group" aria-label="${esc(label)}">${[-5,-1].map(d=>button(`${attributes}="${d}" aria-label="${esc(label)}: −${-d}" ${disabled||value===null||value+d<0?'disabled':''}`,String(d).replace('-','−'))).join('')}<output>${value===null?'—':value}</output>${[1,5].map(d=>button(`${attributes}="${d}" aria-label="${esc(label)}: +${d}" ${disabled||value===null||value+d>max?'disabled':''}`,`+${d}`)).join('')}</div>`;
}
function labelList(a){return `<div class="fp-label-list">${productParts.map(p=>`<p><strong>${p.letter} · ${esc(p.label)}:</strong> ${esc(term(a.work.pieces[p.key]))}</p>`).join('')}</div>`;}
function build(a,readonly){
 const s=a.source,w=a.work,p=productParts.find(p=>p.key===a.part)||productParts[0],label=w.pieces[p.key]??null,d=sides(s,w.x,p.key);
 return `<p id="fp-instruction">${esc(T.instruction)}</p><div class="fp-board"><section class="fp-picture">${rectangle({...s,x:w.x,notation:'letters'},'current',p.key)}<p class="fp-size-readout">Whole area: (x + ${s.a})(x + ${s.b}).<br>Whole: ${w.x+s.a} cm × ${w.x+s.b} cm. Each small grid square is 1 cm².</p><div class="fp-parts" role="group" aria-label="Choose a part">${productParts.map(part=>`<button type="button" class="secondary" data-fp-part="${part.key}" aria-pressed="${a.part===part.key}" aria-label="${part.letter} · ${esc(part.label)}">${part.letter}<span class="fp-part-name"> · ${esc(part.label)}</span></button>`).join('')}</div></section><section class="fp-editor"><h2 id="fp-task" tabindex="-1">${p.letter} · ${esc(p.label)}</h2><p>${d[0]} cm × ${d[1]} cm. ${button(`data-fp-x2 ${readonly||w.x===2?'disabled':''}`,'Try x = 2')}</p><div class="fp-kinds" role="group" aria-label="Tile kind">${[[2,T.squareKind],[1,T.stripKind],[0,T.unitKind]].map(([power,name])=>`<button type="button" class="secondary" data-fp-kind="${power}" aria-pressed="${label?.power===power}" ${readonly?'disabled':''}><span class="fp-tile-symbol fp-tile-${power}" aria-hidden="true">${power===2?'x²':power===1?'x':'1'}</span><span>${esc(name)}</span></button>`).join('')}</div><p class="fp-chosen">Your label: <strong>${esc(term(label))}</strong></p>${counter('data-fp-count',label?.count??null,144,readonly,p.label+' tile count')}${button(`data-fp-clear ${readonly||!label?'disabled':''}`,T.clear)}<p class="fp-note">Clearing a label leaves the other labels and your tray unchanged.</p></section></div>`;
}
function collect(a,readonly){return `<h2 id="fp-task" tabindex="-1">${esc(T.collect)}</h2><p>${esc(T.collection)}</p>${labelList(a)}<div class="fp-tray">${[T.squareKind+'s',T.stripKind+'s',T.unitKind+'s'].map((name,i)=>`<section><h3>${esc(name)}</h3>${counter(`data-fp-total-${i}`,a.work.total[i],576,readonly,name)}</section>`).join('')}</div><p class="fp-expression">Your tray expression: ${esc(polynomial(a.work.total))}</p>`;}
function comparison(a){
 const s=a.source,w=a.work,r=productResult(s,w);
 return `<h2 id="fp-task" tabindex="-1">Three different comparisons</h2><section class="fp-comparison"><h3>Labels and their pieces</h3>${r.pieces.map((p,i)=>{const d=sides(s,w.x,p.key);return `<div class="fp-result" data-fp-result="${p.key}"><strong>${productParts[i].letter} · ${esc(productParts[i].label)}</strong><p>Your label: ${esc(term(p.proposed))}. Given dimensions: ${d[0]} × ${d[1]}; area ${p.actual} cm².</p>${p.proposed?`<p>${p.formFit?'This label describes this piece.':'This label describes a different expression.'} At x = ${w.x}, your label is ${p.proposedValue}: ${p.valueFit?'the same number at this size.':'a different number at this size.'}</p><p>The side lengths give ${esc(term(p.expected))}.</p>`:`<p>${esc(T.missing)}</p>`}</div>`;}).join('')}</section><section class="fp-comparison"><h3>Tray and your four labels</h3><p>Tray: ${esc(polynomial(w.total))}.</p><p>${r.labelsComplete?`Sum of labels: ${esc(polynomial(r.labelsTotal))}. ${r.collectionFit?'These counts gather your four labels.':'These counts do not yet gather your four labels.'}`:'A label is still missing, so there is not yet a complete set to gather.'}</p></section><section class="fp-comparison"><h3>Tray and the whole rectangle</h3><p>${r.wholeFit?'These counts describe the whole plan.':'These counts describe a different expression.'} The four given pieces gather to ${esc(polynomial(r.wholeCoefficients))}.</p><p>We compare the square, x-strip and unit counts. One matching number alone does not explain the whole expression.</p><p>${esc(s.explanation)}</p>${r.wholeFit&&r.pieces.some(p=>p.formFit===false)?`<p>${esc(T.generalFit)} ${r.stripSwap?esc(T.swapped):''}</p>`:''}${r.wholeFit&&r.pieces.some(p=>p.proposed===null)?'<p>Your tray describes the whole area. Some pieces still have no labels.</p>':''}<h3>At x = ${w.x}</h3><p>Your tray: ${r.trayTotal} cm². Whole rectangle: ${r.wholeTotal} cm².</p>${!r.wholeFit&&r.valueFit?`<p class="fp-point-only">${esc(T.pointOnly)}</p>`:''}</section>`;
}
function help(a){
 if(a.help==='teaching'){
  a.teachingPage=Math.max(0,Math.min(a.source.teaching.length-1,a.teachingPage));const p=a.source.teaching[a.teachingPage];
  return `<section class="fp-help"><h2 id="fp-task" tabindex="-1">How the four parts work · ${a.teachingPage+1} of ${a.source.teaching.length}</h2><p>${esc(p.words)}</p>${teachingFigure(p.figure,`teaching-${a.teachingPage}`)}<div class="fp-actions">${button(`data-fp-teach-step="-1" ${a.teachingPage===0?'disabled':''}`,'Previous')}${button(`data-fp-teach-step="1" ${a.teachingPage===a.source.teaching.length-1?'disabled':''}`,'Next')}${button('data-fp-close-help','Back to my layout',true)}</div></section>`;
 }
 const e=a.source.example;return `<section class="fp-help"><h2 id="fp-task" tabindex="-1">${esc(T.example)}</h2>${e.words.map(p=>`<p>${esc(p)}</p>`).join('')}${teachingFigure({kind:'rectangle',...e,notation:'numbers'},'example')}${button('data-fp-close-help','Back to my layout',true)}</section>`;
}
function narration(a){
 if(!a)return `${T.label}. Choose a working draft or a kept layout.`;
 const s=a.source,w=a.work,out=[T.label,s.title,s.story,`Whole area is x plus ${s.a}, times x plus ${s.b}. Current x is ${w.x}. Whole dimensions ${w.x+s.a} by ${w.x+s.b} centimeters.`,...productParts.map(p=>`${p.letter}, ${p.label}: ${spokenTerm(w.pieces[p.key])}.`),`Your tray has ${w.total[0]} x squares, ${w.total[1]} x strips and ${w.total[2]} unit squares.`];
 if(a.help==='teaching')out.push(s.teaching[a.teachingPage]?.words||'');else if(a.help==='example')out.push(...s.example.words);else if(a.stage==='compare'&&w.referenceShown){const r=productResult(s,w);out.push(`Your tray at x ${w.x} gives ${r.trayTotal} square centimeters. The whole gives ${r.wholeTotal}.`,r.wholeFit?'The tray describes the whole expression.':r.valueFit?T.pointOnly:'The tray describes a different expression.',s.explanation);}
 return out.join(' ');
}
function shelf(book,v){
 const view=productSheetsView(book),last=Math.max(0,Math.ceil(view.items.length/8)-1);v.page=Math.max(0,Math.min(last,v.page));
 return `<section><h2 id="fp-task" tabindex="-1">${esc(T.shelf)}</h2>${view.status==='unavailable'?`<p>${esc(T.unknown)}</p>`:!view.items.length?'<p>No layout is kept yet. You can keep an unfinished construction.</p>':view.items.slice(v.page*8,v.page*8+8).map(r=>r.readable?`<article class="fp-kept-row">${button(`data-fp-card="${r.id}"`,r.raw.source.title)}<p>${esc(polynomial(r.raw.work.total))} · x = ${r.raw.work.x}</p></article>`:`<p class="fp-note">Earlier layout ${r.index+1} stays unchanged in Notes; this format cannot be opened here.</p>`).join('')}<div class="fp-actions">${button(`data-fp-earlier ${v.page===0?'disabled':''}`,'Earlier layouts')}<span>${v.page+1} / ${last+1}</span>${button(`data-fp-later ${v.page===last?'disabled':''}`,'Later layouts')}</div></section>`;
}
export function fourPartsPage(book,owner){
 const v=visit(book,owner);if(v.screen==='draft'&&!current(v))add(v,makeProductSource(v.catalogCase),null,v.catalogCase);
 if(v.screen==='card'){
  const row=productSheetsView(book).items.find(r=>r.readable&&r.id===v.card),old=v.readonly.get(v.card);
  if(row&&(!old||old.raw!==row.raw||old.rawBytes!==bytes(row.raw))){const a=slot(row.raw.source,row.raw.work);Object.assign(a,{raw:row.raw,rawBytes:bytes(row.raw)});v.readonly.set(v.card,a);}else if(!row)v.readonly.delete(v.card);
 }
 const a=current(v),ro=v.screen==='card',unknown=productSheetsView(book).status==='unavailable';
 const stageLabel=a?.stage==='collect'?T.collect:a?.stage==='compare'?T.compare:T.build;
 return `<section class="fp-page" data-fp-root><header class="fp-heading"><nav class="fp-actions fp-topbar">${button('data-fp-back',T.back)}<details class="fp-tools" data-fp-fold="tools" ${(a?.folds||v.folds).tools?'open':''}><summary>Layouts & reading</summary><div class="fp-actions">${button('data-fp-working',T.working)}${button('data-fp-shelf',T.shelf)}${button(`data-fp-hear data-speak="${esc(narration(a))}"`,T.hear)}</div></details></nav><h1 id="fp-heading" tabindex="-1">${esc(T.label)}</h1>${a?`<p><span class="fp-job-name">${esc(a.source.title)} · </span>right +${a.source.a} cm, below +${a.source.b} cm</p>`:''}</header>${unknown?`<p class="fp-note">${esc(T.unknown)}</p>`:''}${v.screen==='shelf'?shelf(book,v):!a?`<h2 id="fp-task" tabindex="-1">Earlier layout retained</h2><p>${esc(T.unknown)}</p>`:`${ro?`<p class="fp-note">${esc(T.readOnly)}</p><div class="fp-actions">${button('data-fp-copy',T.copy,true)}${button('data-fp-another-copy',T.another)}</div>`:''}<div class="fp-size" role="group" aria-label="Change the picture side x"><strong>Picture side x:</strong>${button(`data-fp-x="-1" aria-label="Decrease x (−)" ${ro||a.work.x===1?'disabled':''}`,'−')}<output aria-live="polite">${a.work.x} cm</output>${button(`data-fp-x="1" aria-label="Increase x (+)" ${ro||a.work.x===12?'disabled':''}`,'+')}</div><nav class="fp-stages" aria-label="Print layout pages">${[['build',T.build],['collect',T.collect],['compare',T.compare]].map(([key,label])=>button(`data-fp-stage="${key}" aria-current="${a.stage===key&&!a.help?'page':'false'}" ${ro&&key==='compare'&&!a.work.referenceShown?'disabled':''}`,label)).join('')}</nav>${a.help?help(a):a.stage==='compare'?comparison(a):a.stage==='collect'?collect(a,ro):build(a,ro)}<div class="fp-help-choices">${button(`data-fp-help="teaching" ${ro&&!a.work.teachingShown?'disabled':''}`,T.teaching)}${button(`data-fp-help="example" ${ro&&!a.work.exampleShown?'disabled':''}`,T.example)}</div><div class="fp-actions fp-primary-actions">${!ro?button('data-fp-keep',T.keep,true):''}${!a.help&&a.stage==='build'?button('data-fp-next','Gather tiles'):!a.help&&a.stage==='collect'?button(`data-fp-next ${ro&&!a.work.referenceShown?'disabled':''}`,'Compare'):''}</div>`}<p id="fp-status" role="status" tabindex="-1">${esc(a?.status||'')}</p>${button('data-fp-reopen hidden','Reopen saved layouts')}<details class="fp-drafts" data-fp-fold="drafts" ${(a?.folds||v.folds).drafts?'open':''}><summary>Other print jobs and working drafts</summary><label>Print job<select data-fp-case><option value="" ${!a?.caseId?'selected':''}>Kept layout / blank draft</option>${productCases.map(c=>`<option value="${c.id}" ${a?.caseId===c.id?'selected':''}>${esc(c.title)}</option>`).join('')}</select></label><label>Working drafts<select data-fp-draft>${[...v.drafts].map(([key,d])=>`<option value="${key}" ${key===v.key?'selected':''}>${esc(d.source.title)} · draft ${d.ordinal}</option>`).join('')}</select></label>${button('data-fp-blank',T.blank)}<p>${esc(T.session)}</p></details>${a?`<details data-fp-fold="plan" ${a.folds.plan?'open':''}><summary>The printing plan</summary><h3>${esc(a.source.title)}</h3><p>${esc(a.source.story)}</p><p>${esc(T.sizeNote)}</p></details>`:''}<footer><details data-fp-fold="grownup" ${(a?.folds||v.folds).grownup?'open':''}><summary>For grown-ups</summary><p>${esc(T.grownup)}</p></details><a class="secondary" href="#notes">Notes and download</a></footer></section>`;
}

export function bindFourParts(book,ctx={}){
 const owner=()=>typeof ctx.explorerId==='function'?ctx.explorerId():null,v=ownerOK(owner())?visit(book,owner(),false):null,root=document.querySelector('[data-fp-root]');
 if(!root||!v||typeof ctx.notebook!=='function'||typeof ctx.isActive!=='function'||typeof ctx.canExport!=='function'||typeof ctx.render!=='function')return;
 v.boundRoot=root;const a=current(v),source=a?.source,screen=v.screen,key=v.key,card=v.card,route=location.hash,rootChain=[],chains=new WeakMap();
 for(let n=root;n&&n!==document;n=n.parentNode)rootChain.push([n,n.parentNode]);
 let work=a?.work,sourceBytes=bytes(source),workBytes=bytes(work),raw=book.areaProducts,rawBytes=bytes(raw),present=Object.hasOwn(book,'areaProducts');
 const chain=n=>{const out=[];for(let p=n;p&&p!==root;p=p.parentNode)out.push([p,p.parentNode]);return out;};
 const attached=n=>chains.has(n)&&n.isConnected&&root.contains(n)&&rootChain.every(([c,p])=>c.parentNode===p)&&chains.get(n).every(([c,p])=>c.parentNode===p);
 const visible=n=>{for(let p=n;p;p=p.parentElement){const css=getComputedStyle(p);if(p.hidden||p.getAttribute?.('aria-hidden')==='true'||css.display==='none'||['hidden','collapse'].includes(css.visibility))return false;if(p.tagName==='DETAILS'&&!p.open&&p!==n&&!p.querySelector(':scope > summary')?.contains(n))return false;}return true;};
 const connected=()=>visit(book,owner(),false)===v&&v.boundRoot===root&&fourPartsActive(book,owner())&&ctx.notebook()===book&&ctx.isActive()===true&&location.hash===route&&route==='#learn/math/equality'&&root.isConnected&&document.querySelector('[data-fp-root]')===root;
 const live=n=>{try{return connected()&&attached(n)&&visible(n)&&!n.disabled&&v.screen===screen&&v.key===key&&v.card===card&&current(v)===a&&a?.source===source&&a?.work===work&&bytes(source)===sourceBytes&&bytes(work)===workBytes&&sourceBytes!==null&&workBytes!==null&&Object.hasOwn(book,'areaProducts')===present&&book.areaProducts===raw&&bytes(raw)===rawBytes&&rawBytes!==null&&(screen!=='card'||productSheetsView(book).items.some(r=>r.readable&&r.id===card&&r.raw===a.raw&&bytes(r.raw)===a.rawBytes));}catch{return false;}};
 const message=t=>{if(a)a.status=t;const n=root.querySelector('#fp-status');if(n)n.textContent=t;};
 const staleMessage=()=>{try{if(connected()&&(Object.hasOwn(book,'areaProducts')!==present||book.areaProducts!==raw||bytes(book.areaProducts)!==rawBytes)){message(T.stale);const refresh=root.querySelector('[data-fp-reopen]');if(refresh)refresh.hidden=false;}}catch{}};
 const guard=n=>{chains.set(n,chain(n));for(const type of ['click','change','input','keydown','focusin'])n.addEventListener(type,e=>{if(!live(n)){const target=e.target?.closest?.('[data-fp-reopen]');const refresh=target&&connected()&&attached(target)&&visible(target)&&!target.disabled;if(!refresh){staleMessage();e.preventDefault();e.stopImmediatePropagation();}}},true);};
 guard(root);root.querySelectorAll('button,a,select,details,summary,svg,[data-fp-pick]').forEach(guard);
 root.querySelector('[data-fp-reopen]')?.addEventListener('click',e=>{const n=e.currentTarget;if(!connected()||!attached(n)||!visible(n)||n.disabled)return;if(a)a.status='';stopSpeech();ctx.render();document.querySelector('#fp-task,#fp-heading')?.focus();});
 const adopt=()=>{work=a?.work;workBytes=bytes(work);sourceBytes=bytes(source);raw=book.areaProducts;rawBytes=bytes(raw);present=Object.hasOwn(book,'areaProducts');};
 const folds=()=>root.querySelectorAll('[data-fp-fold]').forEach(n=>{if(attached(n))(a?.folds||v.folds)[n.dataset.fpFold]=n.open;});
 const redraw=(target='#fp-task')=>{ctx.render();const r=document.querySelector('[data-fp-root]'),n=r?.querySelector(target),take=n&&!n.disabled&&visible(n)?n:r?.querySelector('#fp-task,#fp-heading');take?.focus({preventScroll:true});if(take){const box=take.getBoundingClientRect();if(box.top<0||box.bottom>innerHeight)take.scrollIntoView({block:'nearest'});}};
 const change=(action,value)=>{if(screen!=='draft'||!a)return false;const next=changeProductWork(source,a.work,action,value);if(!next)return false;a.work=next;adopt();return true;};
 function on(selector,fn,target='#fp-task'){root.querySelectorAll(selector).forEach(n=>n.addEventListener('click',()=>{if(!live(n))return;folds();message('');stopSpeech();if(fn(n)!==false)redraw(typeof target==='function'?target(n):target);}));}
 function select(selector,fn){root.querySelectorAll(selector).forEach(n=>n.addEventListener('change',()=>{if(!live(n))return;folds();message('');stopSpeech();if(fn(n)!==false)redraw(selector);}));}
 const stage=name=>{if(!a||!['build','collect','compare'].includes(name))return false;if(name==='compare'&&screen==='draft'&&!change('reference'))return false;if(name==='compare'&&!a.work.referenceShown)return false;a.stage=name;a.help=null;return true;};
 on('[data-fp-back]',()=>{v.active=false;ctx.render();document.querySelector('#equality-heading')?.focus();return false;});
 on('[data-fp-working]',()=>{v.folds.tools=false;if(a)a.folds.tools=false;v.screen='draft';v.card=null;if(current(v))current(v).folds.tools=false;});on('[data-fp-shelf]',()=>{v.folds.tools=false;if(a)a.folds.tools=false;v.screen='shelf';v.card=null;});
 on('[data-fp-card]',n=>{v.card=n.dataset.fpCard;v.screen='card';});
 on('[data-fp-earlier]',()=>{v.page--;},'[data-fp-later]');on('[data-fp-later]',()=>{v.page++;},'[data-fp-earlier]');
 on('[data-fp-stage]',n=>stage(n.dataset.fpStage));on('[data-fp-next]',()=>stage(a.stage==='build'?'collect':'compare'));
 on('[data-fp-part]',n=>{a.part=n.dataset.fpPart;},n=>`[data-fp-part="${n.dataset.fpPart}"]`);
 on('[data-fp-pick]',n=>{a.part=n.dataset.fpPick;},n=>`[data-fp-part="${n.dataset.fpPick}"]`);
 on('[data-fp-kind]',n=>change('kind',{part:a.part,power:Number(n.dataset.fpKind)}),n=>`[data-fp-kind="${n.dataset.fpKind}"]`);
 on('[data-fp-count]',n=>change('count',{part:a.part,delta:Number(n.dataset.fpCount)}),n=>`[data-fp-count="${a.work.pieces[a.part]?.count===0?1:a.work.pieces[a.part]?.count===144?-1:n.dataset.fpCount}"]`);
 on('[data-fp-clear]',()=>change('clear',a.part));
 for(let i=0;i<3;i++)on(`[data-fp-total-${i}]`,n=>change('total',{index:i,delta:Number(n.getAttribute(`data-fp-total-${i}`))}),n=>`[data-fp-total-${i}="${a.work.total[i]===0?1:a.work.total[i]===576?-1:n.getAttribute(`data-fp-total-${i}`)}"]`);
 on('[data-fp-x]',n=>change('x',a.work.x+Number(n.dataset.fpX)),n=>`[data-fp-x="${a.work.x===1?1:a.work.x===12?-1:n.dataset.fpX}"]`);
 on('[data-fp-x2]',()=>change('x',2));
 on('[data-fp-help]',n=>{const name=n.dataset.fpHelp;if(!a||!['teaching','example'].includes(name))return false;if(screen==='draft'){if(!change(name))return false;}else if(!a.work[name+'Shown'])return false;a.help=name;});
 on('[data-fp-close-help]',()=>{a.help=null;});on('[data-fp-teach-step]',n=>{a.teachingPage+=Number(n.dataset.fpTeachStep);});
 select('[data-fp-case]',n=>{if(!productCases.some(c=>c.id===n.value))return false;v.catalogCase=n.value;const found=[...v.drafts].findLast(([,d])=>d.caseId===n.value);if(found){v.key=found[0];v.screen='draft';v.card=null;}else add(v,makeProductSource(n.value),null,n.value);});
 select('[data-fp-draft]',n=>{if(!v.drafts.has(n.value))return false;v.key=n.value;v.screen='draft';v.card=null;});
 on('[data-fp-blank]',()=>{const s=a?.source||makeProductSource(v.catalogCase);add(v,s,null,a?a.caseId:v.catalogCase);});
 function copy(another){if(screen!=='card'||!a?.raw)return false;let k=v.copies.get(card);if(another||!k||!v.drafts.has(k)){add(v,a.raw.source,a.raw.work);k=v.key;v.copies.set(card,k);}v.key=k;v.screen='draft';v.card=null;return true;}
 on('[data-fp-copy]',()=>copy(false));on('[data-fp-another-copy]',()=>copy(true));
 on('[data-fp-keep]',()=>{
  if(screen!=='draft'||!a)return false;const id=keepProductSheet(book,source,a.work,{canExport:ctx.canExport});if(!id){message(T.refused);return false;}adopt();
  let saved;try{saved=ctx.save?.();}catch{saved=null;}
  const row=productSheetsView(book).items.find(r=>r.readable&&r.id===id);if(!row)return false;
  const kept=slot(row.raw.source,row.raw.work);Object.assign(kept,{raw:row.raw,rawBytes:bytes(row.raw),stage:a.stage,help:a.help,teachingPage:a.teachingPage,part:a.part,folds:{...a.folds},status:saved?.enabled===true&&saved?.ok===true?T.keptSaved:saved?.enabled===false?T.keptSession:T.keptUncertain});v.readonly.set(id,kept);v.screen='card';v.card=id;v.page=Math.floor(row.index/8);
 },'#fp-status');
 root.querySelectorAll('[data-fp-fold]').forEach(n=>n.addEventListener('toggle',()=>{if(live(n))(a?.folds||v.folds)[n.dataset.fpFold]=n.open;}));
}
