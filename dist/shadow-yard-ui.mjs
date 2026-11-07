// Visit-local measurements; displayed products are prepared through given-math.
import {shadowCopy as copy,shadowCases,shadowTemplates as templates} from './shadow-yard-content.mjs';
import {initialShadowYard,changeShadowYard,shadowYardModel,shadowYardPairs,shadowYardNarration} from './shadow-yard-core.mjs';
import {recordGivenMath} from './given-math.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bytes=x=>JSON.stringify(x),clone=x=>structuredClone(x),route='#workshop/copy-frame';
const text=(key,values={})=>templates[key].replace(/\{(\w+)\}/g,(_,k)=>String(values[k]));
let visit=null;
const existing=(book,owner)=>visit?.book===book&&visit.owner===owner?visit:null;
export const shadowYardActive=(book,owner)=>existing(book,owner)?.active===true;
export const shadowYardEntry=()=>`<aside class="sy-entry"><button type="button" data-shadow-yard-entry>${esc(copy.title)}</button><span>${esc(copy.entry)}</span></aside>`;
export function openShadowYard(book,owner){if(!book||typeof book!=='object'||typeof owner!=='string'||!owner.trim())return false;if(!existing(book,owner)){resetShadowYard();visit={book,owner,active:true,work:initialShadowYard(),pending:null,request:null,ready:null,saveNotice:'',bound:null,unbind:null};}else visit.active=true;return true;}
export function closeShadowYard(){if(visit){visit.active=false;visit.ready=null;visit.unbind?.();visit.unbind=null;visit.bound=null;}}
export function resetShadowYard(){visit?.unbind?.();visit=null;}
export function prepareShadowYardDisplay(book,owner,options={}){
 const v=existing(book,owner);if(!v?.active)return {active:false,ok:true,changed:false};v.ready=null;
 const proposed=v.request??(v.pending?null:v.work);if(!proposed)return {active:true,ok:false,changed:false};
 const work=v.work,pending=v.pending,request=v.request,snapshot=bytes([work,pending,request]);
 const live=()=>{try{return visit===v&&v.active&&v.work===work&&v.pending===pending&&v.request===request&&bytes([v.work,v.pending,v.request])===snapshot&&options.notebook?.()===book&&options.explorerId?.()===owner&&options.isActive?.()===true&&(typeof location==='undefined'||location.hash===route);}catch{return false;}};
 let result={ok:false,changed:false};
 try{if(live())result=recordGivenMath(book,shadowYardPairs(proposed),{exposeFacts:(pairs,target)=>{if(!live())throw Error('Replaced visit');options.exposeFacts(pairs,target);if(!live())throw Error('Replaced visit');},canExport:candidate=>{if(!live())return false;const ok=options.canExport(candidate);return live()&&ok===true;}});}catch{}
 if(!live())return {active:shadowYardActive(book,owner),ok:false,changed:result.changed};
 if(!result.ok){v.pending=clone(proposed);v.request=null;return {active:true,ok:false,changed:false};}
 let saveNotice=v.saveNotice;
 if(result.changed){let saved;try{saved=options.save?.();}catch{}if(!live())return {active:shadowYardActive(book,owner),ok:false,changed:true};saveNotice=saved?.enabled===true&&saved?.ok===true?'':copy.sessionOnly;}
 v.work=proposed;v.pending=null;v.request=null;v.saveNotice=saveNotice;v.ready=v.work;return {active:true,...result};
}
const button=(action,label,disabled=false,extra='')=>`<button type="button" data-sy-action="${action}"${disabled?' disabled':''}${extra?' '+extra:''}>${esc(label)}</button>`;
function diagram(p,given,caption){
 const height=given?p.A:p.h,shadow=given?p.B:p.C,scale=p.scale,x=25,y=210,w=shadow*scale,h=height===null?null:height*scale;
 const label=given?(p.example?copy.exampleGiven:copy.given):(p.example?copy.exampleProposed:copy.proposed);
 const aria=given?text('givenAria',{height,shadow}):height===null?text(p.example?'exampleEmptyAria':'emptyAria',{shadow}):text(p.example?'exampleAria':'proposalAria',{height,shadow});
 const corner=height!==null&&shadow>0?Math.min(10,.4*Math.min(h,w)):0;
 return `<figure class="sy-figure ${given?'sy-given':'sy-proposed'}" data-sy-diagram="${given?'given':'proposed'}"><figcaption>${esc(label)}</figcaption><svg class="sy-diagram" viewBox="0 0 260 240" role="img" aria-label="${esc(aria+' '+caption)}"><path class="sy-ground" d="M15 210H245"/>${h!==null&&shadow>0?`<path class="sy-guide" data-sy-hypotenuse d="M${x} ${y-h}L${x+w} ${y}"/>`:''}<line class="sy-shadow" data-sy-shadow data-sy-leg="shadow" x1="${x}" y1="${y}" x2="${x+w}" y2="${y}"/>${h!==null?`<line class="sy-post" data-sy-post data-sy-leg="height" x1="${x}" y1="${y}" x2="${x}" y2="${y-h}"/>`:''}${corner?`<path class="sy-corner" data-sy-right-angle d="M${x} ${y-corner}h${corner}v${corner}"/>`:''}</svg><div class="sy-measurements">${height===null?`<p>${esc(p.example?copy.exampleEmpty:copy.empty)}</p>`:`<p>${esc(text('height',{height}))}</p>`}<p>${esc(text('shadow',{shadow}))}</p></div></figure>`;
}
function pictures(m){const caption=m.picture.example?m.caption:m.source.context+' '+m.caption;return `<div class="sy-pictures">${diagram(m.picture,true,caption)}${diagram(m.picture,false,caption)}</div><p class="sy-caption">${esc(m.caption)}</p>`;}
function build(w,m){const n=m.draft.heightHalf;return `<section class="sy-build"><label class="sy-selector">Choose a case <select data-sy-case>${shadowCases.map(c=>`<option value="${esc(c.id)}"${w.caseId===c.id?' selected':''}>${esc(c.title)}</option>`).join('')}</select></label><h2 id="sy-task" tabindex="-1">${esc(copy.task)}</h2><p class="sy-context">${esc(m.source.context)}</p><div class="sy-controls"><div class="sy-height-controls" role="group" aria-label="Proposed height">${n===null?button('choose',copy.choose):''}${button('less',copy.less,n===null||n===1)}<output data-sy-height aria-label="Proposed height">${n===null?'No height chosen':`${m.height} m`}</output>${button('more',copy.more,n===null||n===48)}${button('clear',copy.clear,n===null)}</div><div class="sy-actions">${button('compare',copy.compare)}</div></div>${pictures(m)}${m.result?`<section class="sy-result" data-sy-result data-sy-kind="${m.result}" aria-live="polite">${m.ratioLines.length?`<div data-sy-ratios>${m.ratioLines.map(s=>`<p>${esc(s)}</p>`).join('')}</div>`:''}${m.productLines.length?`<div data-sy-products>${m.productLines.map(s=>`<p>${esc(s)}</p>`).join('')}</div><p>${esc(copy.crossNote)}</p>`:''}<p>${esc(copy[m.result])}</p></section>`:''}<div class="sy-actions sy-help-actions">${button('teaching',copy.teaching)}${button('example',copy.example)}</div><p class="sy-return-prompt">${esc(copy.returnPrompt)}</p></section>`;}
function help(w,m){return `<section class="sy-help">${m.waiting?`<p class="sy-waiting">${esc(m.waiting)}</p>`:''}<p class="sy-step">${esc(text('step',{number:w.step+1}))}</p><h2 id="sy-task" tabindex="-1">${esc(m.help.title)}</h2><nav class="sy-actions sy-steps" aria-label="Choose a step">${Array.from({length:4},(_,i)=>button(`step-${i}`,`Step ${i+1}`,false,`aria-current="${w.step===i?'step':'false'}"`)).join('')}</nav><p class="sy-lesson">${esc(m.help.text)}</p>${w.view==='example'?pictures(m):''}${w.view==='example'&&w.step===3?`<p>${esc(copy.crossNote)}</p>`:''}<div class="sy-actions">${button('previous','Previous step',w.step===0)}${button('next','Next step',w.step===3)}${button('build',copy.build)}</div></section>`;}
export function shadowYardPage(book,owner){const v=existing(book,owner);if(!v?.active)return '';const ready=v.ready===v.work&&!v.pending&&!v.request,w=v.work,m=ready?shadowYardModel(w):null;
 return `<section class="sy-page" data-shadow-yard-root><header><div class="sy-topbar">${button('return',copy.back)}${ready?button('hear',copy.hear,false,`data-speak="${esc(shadowYardNarration(w))}"`):''}</div><h1 id="shadow-yard-title" tabindex="-1">${esc(copy.title)}</h1><p>${esc(copy.opening)}</p><p class="sy-model">${esc(copy.model)}</p></header>${!ready?`<section class="sy-refusal" data-sy-pending><h2 id="sy-task" tabindex="-1">Your earlier proposal is still here</h2><p>${esc(copy.refusal)}</p><div class="sy-actions">${button('retry','Retry view')}<a data-sy-notes href="#notes">Grown-up notes</a>${button('return',copy.back)}</div></section>`:w.view==='build'?build(w,m):help(w,m)}${ready&&v.saveNotice?`<p class="sy-notice" role="status">${esc(v.saveNotice)}</p>`:''}<p class="sy-visit">${esc(copy.visit)}</p><details><summary>For grown-ups</summary><p>${esc(copy.grownup)}</p></details></section>`;
}
function visible(node){if(!node?.isConnected||!node.getClientRects().length)return false;for(let p=node;p;p=p.parentElement){const css=getComputedStyle(p);if(p.hidden||p.inert||p.getAttribute('aria-hidden')==='true'||css.display==='none'||['hidden','collapse'].includes(css.visibility))return false;if(p.tagName==='DETAILS'&&!p.open&&p!==node&&!p.querySelector(':scope>summary')?.contains(node))return false;}return true;}
export function bindShadowYard(book,ctx){const owner=ctx.explorerId?.(),v=existing(book,owner),root=document.querySelector('[data-shadow-yard-root]');if(!v?.active||!root)return;v.unbind?.();v.bound=root;
 const work=v.work,pending=v.pending,request=v.request,stateBytes=bytes([work,pending,request]),controls=[root,...root.querySelectorAll('button,a,select,summary')],invalid=new Set(),chains=new Map();
 for(const node of controls){const chain=[];for(let n=node;n&&n!==document;n=n.parentNode)chain.push([n,n.parentNode]);chains.set(node,chain);}
 const audit=records=>{for(const record of records)for(const removed of record.removedNodes)for(const node of controls)if(removed===node||removed.contains?.(node))invalid.add(node);};
 const observer=new MutationObserver(audit);observer.observe(document.documentElement,{childList:true,subtree:true});let retired=false;
 const live=node=>{audit(observer.takeRecords());try{return !retired&&visit===v&&v.active&&v.bound===root&&v.work===work&&v.pending===pending&&v.request===request&&bytes([v.work,v.pending,v.request])===stateBytes&&ctx.notebook?.()===book&&ctx.explorerId?.()===owner&&ctx.isActive?.()===true&&location.hash===route&&document.querySelector('[data-shadow-yard-root]')===root&&!invalid.has(root)&&!invalid.has(node)&&chains.get(node)?.every(([n,p])=>n.parentNode===p)&&root.contains(node)&&visible(node)&&!node.disabled;}catch{return false;}};
 const stop=()=>{ctx.stopSpeech?.();ctx.stopSound?.();};
 const redraw=(selector='#sy-task')=>{ctx.render?.();const nextRoot=document.querySelector('[data-shadow-yard-root]');let node=nextRoot?.querySelector(selector);if(!node||node.disabled||!visible(node))node=nextRoot?.querySelector('#sy-task')??nextRoot?.querySelector('#shadow-yard-title');if(node){node.focus({preventScroll:true});const box=node.getBoundingClientRect();if(box.top<0||box.bottom>innerHeight)node.scrollIntoView({block:'nearest'});}};
 const propose=(next,focus)=>{if(!next)return;stop();v.request=next;v.pending=null;v.ready=null;redraw(focus);};
 for(const node of controls)node.addEventListener('click',event=>{if(!live(node)){event.preventDefault();event.stopImmediatePropagation();}},true);
 root.querySelector('[data-sy-case]')?.addEventListener('change',event=>{if(!live(event.currentTarget)||!v.ready||v.pending)return;propose(changeShadowYard(v.work,'case',event.currentTarget.value),'[data-sy-case]');});
 root.querySelectorAll('[data-sy-action]').forEach(node=>node.addEventListener('click',()=>{if(!live(node))return;const action=node.dataset.syAction;
  if(action==='return'){stop();ctx.onReturn?.();return;}
  if(action==='retry'){stop();v.request=clone(v.pending??v.work);v.pending=null;v.ready=null;redraw();return;}
  if(!v.ready||v.pending)return;
  if(action==='hear'){stop();node.dataset.speak=shadowYardNarration(v.work);return;}
  const step=action.startsWith('step-')?Number(action.slice(5)):action==='previous'?v.work.step-1:action==='next'?v.work.step+1:null;
  const next=changeShadowYard(v.work,step===null?action:'step',step===null?undefined:step);
  propose(next,v.work.view!=='build'||['teaching','example'].includes(action)?'#sy-task':`[data-sy-action="${action}"]`);
 }));
 v.unbind=()=>{retired=true;observer.disconnect();};
}
