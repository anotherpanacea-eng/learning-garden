import {MANIFEST_TEXT as T,MANIFEST_LINES,MANIFEST_ITEMS} from './manifest-content.mjs';
import {TILE_IDS,lineSlots,filled,whatFits,manifestView,markSupport,markCardsSeen,loadLine,answerItem} from './manifest-core.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Companion markup: **bold** and *italics*; everything else is escaped text.
const rich=x=>esc(x).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>');
const MARK={colon:':',semicolon:';',comma:',',empty:''};
const btn=(attrs,text,{disabled=false,primary=false,pressed=null}={})=>`<button type="button" class="${primary?'primary':'secondary'}" ${attrs}${pressed===null?'':` aria-pressed="${pressed}"`}${disabled?' disabled':''}>${esc(text)}</button>`;
// Today's wording is frozen into the visit when first rendered; a submit uses that snapshot.
const lineSnap=line=>structuredClone({...line,said:{...T.load}});
const itemSnap=item=>structuredClone({...item,tileNames:{...T.tiles}});
let visit=null;
export function resetManifestView(){visit=null;}
function session(state,owner){
 if(!visit||visit.state!==state||visit.owner!==owner){const v=manifestView(state);visit={state,owner,intro:v.status==='absent',longer:false,worked:{},drafts:{},tile:null,slot:null,hidden:{},loaded:{},setOpen:false,ladder:{},retry:{},notice:'',lines:Object.fromEntries(MANIFEST_LINES.map(l=>[l.id,lineSnap(l)])),items:Object.fromEntries(MANIFEST_ITEMS.map(i=>[i.id,itemSnap(i)]))};for(const l of MANIFEST_LINES){const x=v.lists[l.id];visit.drafts[l.id]=x?.shape==='completed'?{...x.entry.slots}:{};}visit.drafts.A3={};}
 return visit;
}
const crateSvg='<svg viewBox="0 0 48 36" aria-hidden="true" focusable="false"><rect x="3" y="6" width="42" height="27" rx="3" fill="#c99a5b" stroke="#6b4a24" stroke-width="2"/><path d="M3 15h42M3 24h42M16 6v27M32 6v27" stroke="#6b4a24" stroke-width="1.5"/></svg>';
function crates(list){return `<figure class="mf-crates"><div class="mf-crate-row" aria-hidden="true">${list.slice(0,7).map(c=>`<div class="mf-crate">${crateSvg}<span class="mf-frozen">${esc(c)}</span></div>`).join('')}</div><figcaption class="mf-frozen">${esc(T.crates(list.length,list))}</figcaption></figure>`;}
function slotButton(s,owner,id,n,tile,disabled){const pressed=s.slot===`${owner}:${id}`;return `<button type="button" class="mf-slot${tile?` mf-slot-${tile}`:' mf-unset'}" data-mf-slot="${owner}:${id}" aria-label="${esc(`Gap ${n}${tile?`, ${T.tiles[tile]}`:''}`)}" aria-pressed="${pressed}"${disabled?' disabled':''}>${tile&&MARK[tile]?esc(MARK[tile]):'<span aria-hidden="true"></span>'}</button>`;}
// The slot stays on the same line as the word before it.
function sentence(s,owner,snap,draft,disabled){
 let text=snap.lead,html='',n=0;
 const flush=()=>{html+=esc(text);text='';};
 for(const p of snap.parts){
  if(p.slot){n++;const cut=text.lastIndexOf(' ');html+=esc(text.slice(0,cut+1));html+=`<span class="mf-nowrap">${esc(text.slice(cut+1))}${slotButton(s,owner,p.slot,n,draft[p.slot],disabled)}</span>`;text='';}
  else if(p.fixed)text+=p.fixed;else if(p.and)text+=' and';else text+=' '+p.t;
 }
 text+='.';flush();return html;
}
function tray(s,ids,group){return `<div class="mf-tiles" role="group" aria-label="${esc(group)}">${ids.map(t=>btn(`data-mf-tile="${t}" data-mf-tray="${esc(group)}"`,T.tiles[t],{pressed:s.tile===`${group}:${t}`})).join('')}</div>`;}
function lineView(s,v,line){
 const x=v.lists[line.id],snap=s.lines[line.id],draft=s.drafts[line.id],unreadable=x?.shape==='unreadable';
 const result=x?.shape==='completed'&&!s.hidden[line.id]?`<div class="mf-result" id="mf-result-${line.id}" tabindex="-1">${crates(x.entry.crates)}<p class="mf-said mf-frozen">${esc(x.entry.said)}</p>${s.loaded[line.id]?`<div class="mf-fits"><h4>${esc(T.whatFitsTitle)}</h4><ul>${whatFits(snap).map(k=>`<li>${rich(T.whatFits[k])}</li>`).join('')}</ul></div>`:''}</div>`:'';
 return `<li class="mf-line" data-mf-line="${line.id}"><p class="mf-sentence">${sentence(s,line.id,snap,draft,unreadable)}</p>${unreadable?`<p class="mf-notice">${esc(T.unreadable)}</p>`:btn(`data-mf-load="${line.id}"`,T.loadButton,{primary:true,disabled:!filled(snap,draft)})}${result}</li>`;
}
function ladder(s,item){const n=s.ladder[item.id]||0;const steps=[item.hint,T.ladderStep2[item.ladder],T.ladderStep3].slice(0,n);return `${steps.length?`<ol class="mf-ladder" id="mf-ladder-${item.id}" tabindex="-1">${steps.map((t,i)=>`<li>${esc(t)}${i===2?` ${btn(`data-mf-skip="${item.id}"`,T.skip)}`:''}</li>`).join('')}</ol>`:''}${n<3?btn(`data-mf-stuck="${item.id}"`,T.stuck):''}`;}
function earlier(item,e){const tiles=item.id==='A3';return `<div class="mf-earlier" id="mf-feedback-${item.id}" tabindex="-1"><p class="mf-prompt mf-frozen">${esc(e.prompt)}</p><ol class="mf-offered">${e.offered.map((o,i)=>`<li${(tiles?false:e.shown[i]===e.answer)?' aria-current="true" class="mf-chosen mf-frozen"':' class="mf-frozen"'}>${esc(o)}</li>`).join('')}</ol>${tiles?`<p class="mf-chosen mf-frozen">${esc(e.answerText)}</p>`:''}${e.said.map(t=>`<p class="mf-said mf-frozen">${esc(t)}</p>`).join('')}</div>`;}
function question(s,item){
 const snap=s.items[item.id],head=`${snap.card?`<p class="mf-card">${rich(snap.card)}</p>`:''}`;
 if(snap.kind==='tiles'){const draft=s.drafts.A3;return `<p class="mf-card"><em>${sentence(s,'A3',snap,draft,false)}</em></p><p>${esc(snap.prompt)}</p>${tray(s,snap.tiles,'A3')}${btn('data-mf-check="A3"',T.check,{primary:true,disabled:!['s1','s2','s3'].every(k=>draft[k])})}`;}
 return `${snap.guided?`<ol class="mf-steps">${snap.steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:''}${head}<p>${esc(snap.prompt)}</p><div class="mf-choices">${snap.choices.map(c=>btn(`data-mf-choice="${item.id}:${c.id}"`,c.text)).join('')}</div>`;
}
function itemView(s,v,item){
 const x=v.items[item.id];let body;
 if(x?.shape==='unreadable')body=`<p class="mf-notice">${esc(T.unreadable)}</p>`;
 else{const done=x?.shape==='completed';body=`${done?earlier(item,x.entry):''}${!done||s.retry[item.id]?`${question(s,item)}${ladder(s,item)}`:btn(`data-mf-retry="${item.id}"`,T.tryAgain)}`;}
 return `<section class="mf-item" data-mf-item="${item.id}"><h3 id="mf-item-${item.id}" tabindex="-1">${item.id}</h3>${body}</section>`;
}
function card(s,c){const n=s.worked[c.id]||0;return `<section class="mf-teach"><p class="mf-label">${esc(T.languageLabel)}</p><h3>${esc(c.title)}</h3><p>${rich(c.text)}</p><details class="mf-worked" data-mf-worked="${c.id}"${n?' open':''}><summary>${esc(T.workedLabel)}</summary>${n?`<p>${rich(c.example)}</p><ol id="mf-steps-${c.id}" tabindex="-1">${c.steps.slice(0,n).map(t=>`<li>${esc(t)}</li>`).join('')}</ol>${n<c.steps.length?btn(`data-mf-next="${c.id}"`,T.nextStep):''}`:''}</details></section>`;}
export function manifestEntry(){return `<aside class="mf-entry"><h2>${esc(T.title)}</h2><p>${esc(T.hook)}</p><a class="secondary" href="#post/manifest">${esc(T.title)}</a></aside>`;}
export function manifestPage(state,owner){
 const s=session(state,owner),v=manifestView(state);
 const top=`<a class="mf-back" href="#post">${esc(T.back)}</a><h1 id="mf-heading" tabindex="-1">${esc(T.title)}</h1><p class="mf-every">${esc(T.every)}</p><p id="mf-status" class="mf-notice${s.notice?'':' sr-only'}" role="status" aria-live="polite" tabindex="-1">${esc(s.notice)}</p>`;
 if(v.status==='unknown'||v.status==='malformed')return `<div class="mf-page" data-mf-root="closed">${top}<p class="mf-notice">${esc(v.status==='unknown'?T.unknownVersion:T.unreadable)}</p><p class="mf-links"><a href="#notes">Grown-up notes</a> <a href="#post">Post Office</a></p></div>`;
 const intro=s.intro?`<section class="mf-intro"><p class="mf-label">${esc(T.storyLabel)}</p>${T.firstVisit.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`:btn('data-mf-intro',T.storyAgain);
 const story=`<section class="mf-story"><p class="mf-label">${esc(T.storyLabel)}</p><p><strong>${esc(T.hook)}</strong></p><div class="mf-length" role="group">${btn('data-mf-length="short"',T.shortLabel,{pressed:!s.longer})}${btn('data-mf-length="longer"',T.longerLabel,{pressed:s.longer})}</div>${s.longer?T.longer.map(p=>`<p>${rich(p)}</p>`).join(''):`<p>${esc(T.short)}</p>`}</section>`;
 const bench=`<section class="mf-bench"><h2>${esc(T.benchTitle)}</h2><p class="mf-label">${esc(T.storyLabel)}</p><p>${rich(T.header)}</p>${tray(s,TILE_IDS,'lines')}<ol class="mf-lines">${MANIFEST_LINES.map(l=>lineView(s,v,l)).join('')}</ol></section>`;
 const set=`<details class="mf-set" data-mf-set${s.setOpen?' open':''}><summary>${esc(T.setTitle)}</summary>${s.setOpen?MANIFEST_ITEMS.map(i=>itemView(s,v,i)).join(''):''}</details>`;
 const glossary=`<details class="mf-glossary"><summary>${esc(T.glossaryTitle)}</summary><dl>${T.glossary.map(([t,d])=>`<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl></details>`;
 const offscreen=`<aside class="mf-offscreen"><p class="mf-label">${esc(T.offScreenLabel)}</p><p>${esc(T.offScreen)}</p><p class="tiny">${esc(T.offScreenGrownUp)}</p></aside>`;
 const grown=`<details class="mf-grownup"><summary>${esc(T.grownUpTitle)}</summary>${T.grownUp.map(p=>`<p>${rich(p)}</p>`).join('')}</details>`;
 return `<div class="mf-page" data-mf-root="open">${top}${intro}${story}<div class="mf-cards">${T.cards.map(c=>card(s,c)).join('')}</div>${bench}${set}${glossary}${offscreen}${grown}</div>`;
}
export function bindManifest(state,ctx){
 const root=document.querySelector('[data-mf-root="open"]');if(!root)return;
 const owner=ctx.explorerId(),s=session(state,owner),options={canExport:ctx.canExport};
 const live=()=>root.isConnected&&document.querySelector('[data-mf-root]')===root&&visit===s&&ctx.notebook()===state&&ctx.explorerId()===owner&&ctx.isActive?.()!==false&&location.hash==='#post/manifest';
 const focus=sel=>ctx.focus?ctx.focus(sel):document.querySelector(sel)?.focus();
 const redraw=target=>{const g=root.querySelector('.mf-glossary'),p=root.querySelector('.mf-grownup'),open=[g?.open,p?.open];ctx.render();const r=document.querySelector('[data-mf-root]');if(open[0])r?.querySelector('.mf-glossary')?.setAttribute('open','');if(open[1])r?.querySelector('.mf-grownup')?.setAttribute('open','');if(target)focus(target);};
 const local=(change,target)=>{if(!live())return;change();redraw(target);};
 // A write that must land before something is shown: refusal shows nothing new.
 const write=(fn,then,target)=>{if(!live())return;const r=fn();if(r===false){s.notice=T.refused;redraw('#mf-status');return;}if(r!=='noop')ctx.save?.();s.notice='';then?.(r);redraw(target);};
 const usable=el=>{if(!live()||el.disabled||!el.isConnected||!root.contains(el))return false;const scope=el.matches('summary')?el.parentElement?.parentElement:el;return !scope?.closest('details:not([open])');};
 const on=(sel,fn)=>root.querySelectorAll(sel).forEach(el=>el.addEventListener('click',e=>{if(!usable(el))return;fn(el,e);}));
 on('[data-mf-intro]',()=>local(()=>{s.intro=true;},'.mf-intro'));
 on('[data-mf-length]',b=>local(()=>{s.longer=b.dataset.mfLength==='longer';},`[data-mf-length="${b.dataset.mfLength}"]`));
 root.querySelectorAll('[data-mf-worked] > summary').forEach(sum=>sum.addEventListener('click',e=>{e.preventDefault();if(!usable(sum))return;const id=sum.parentElement.dataset.mfWorked;if(s.worked[id]){local(()=>{s.worked[id]=0;},`[data-mf-worked="${id}"] > summary`);return;}write(()=>markCardsSeen(state,options),()=>{s.worked[id]=1;},`#mf-steps-${id}`);}));
 on('[data-mf-next]',b=>local(()=>{s.worked[b.dataset.mfNext]++;},`#mf-steps-${b.dataset.mfNext}`));
 const place=(owner,slot,tile)=>{s.drafts[owner][slot]=tile;s.tile=null;s.slot=null;if(owner!=='A3'){s.hidden[owner]=true;s.loaded[owner]=false;}};
 on('[data-mf-tile]',b=>local(()=>{const group=b.dataset.mfTray,t=b.dataset.mfTile,[o,sl]=(s.slot||'').split(':');if(s.slot&&(group==='A3')===(o==='A3'))place(o,sl,t);else{s.slot=null;s.tile=s.tile===`${group}:${t}`?null:`${group}:${t}`;}},`[data-mf-tray="${b.dataset.mfTray}"][data-mf-tile="${b.dataset.mfTile}"]`));
 on('[data-mf-slot]',b=>local(()=>{const [o,sl]=b.dataset.mfSlot.split(':'),[g,t]=(s.tile||'').split(':');if(s.tile&&(g==='A3')===(o==='A3'))place(o,sl,t);else{s.tile=null;s.slot=s.slot===b.dataset.mfSlot?null:b.dataset.mfSlot;}},`[data-mf-slot="${b.dataset.mfSlot}"]`));
 on('[data-mf-load]',b=>{const id=b.dataset.mfLoad;write(()=>loadLine(state,s.lines[id],s.drafts[id],options),()=>{s.hidden[id]=false;s.loaded[id]=true;},`#mf-result-${id}`);});
 root.querySelector('[data-mf-set] > summary')?.addEventListener('click',e=>{e.preventDefault();if(!usable(e.currentTarget))return;if(s.setOpen){local(()=>{s.setOpen=false;},'[data-mf-set] > summary');return;}
  const a1=manifestView(state).items.A1;if(a1?.shape==='unreadable'){local(()=>{s.setOpen=true;},'#mf-item-A1');return;}
  write(()=>markSupport(state,'items','A1',options,{guided:true}),()=>{s.setOpen=true;},'#mf-item-A1');});
 on('[data-mf-stuck]',b=>{const id=b.dataset.mfStuck;write(()=>markSupport(state,'items',id,options,{guided:id==='A1'}),()=>{s.ladder[id]=(s.ladder[id]||0)+1;},`#mf-ladder-${id}`);});
 on('[data-mf-skip]',b=>{const id=b.dataset.mfSkip,next=MANIFEST_ITEMS[MANIFEST_ITEMS.findIndex(x=>x.id===id)+1];local(()=>{s.ladder[id]=0;},next?`#mf-item-${next.id}`:'[data-mf-set] > summary');});
 const answered=id=>{s.retry[id]=false;s.ladder[id]=0;if(id==='A3')s.drafts.A3={};};
 on('[data-mf-choice]',b=>{const [id,c]=b.dataset.mfChoice.split(':');write(()=>answerItem(state,s.items[id],c,options),()=>answered(id),`#mf-feedback-${id}`);});
 on('[data-mf-check]',()=>write(()=>answerItem(state,s.items.A3,s.drafts.A3,options),()=>answered('A3'),'#mf-feedback-A3'));
 on('[data-mf-retry]',b=>local(()=>{const id=b.dataset.mfRetry;s.retry[id]=true;s.items[id]=itemSnap(MANIFEST_ITEMS.find(i=>i.id===id));if(id==='A3')s.drafts.A3={};},`#mf-item-${b.dataset.mfRetry}`));
}
// Grown-up notes read only the saved strings and write nothing.
export function manifestNotes(state){
 const v=manifestView(state);if(v.status==='absent')return '';
 const raw=()=>{try{return esc(JSON.stringify(v.root,null,2));}catch{return '';}};
 if(v.status!=='ready')return `<details class="panel"><summary>${esc(T.notesHeading)}</summary><p>${esc(v.status==='unknown'?T.unknownVersion:T.unreadable)}</p><pre>${raw()}</pre></details>`;
 const flag=b=>b?'yes':'no',rows=[];
 for(const l of MANIFEST_LINES){const x=v.lists[l.id];if(!x)continue;rows.push(x.shape==='completed'?`<li><p class="mf-frozen">${esc(x.entry.text)}</p><p class="mf-frozen">${esc(T.crates(x.entry.crates.length,x.entry.crates))}</p><p class="mf-frozen">${esc(x.entry.said)}</p><p>Support before this: ${flag(x.entry.supported)}</p></li>`:x.shape==='pending'?`<li><p>${l.id}: support opened before an answer: yes</p></li>`:`<li><p>${l.id}: ${esc(T.unreadable)}</p></li>`);}
 for(const i of MANIFEST_ITEMS){const x=v.items[i.id];if(!x)continue;const e=x.entry;rows.push(x.shape==='completed'?`<li><p class="mf-prompt mf-frozen">${esc(e.prompt)}</p><p class="mf-frozen">${esc(e.answerText)}</p>${e.said.map(t=>`<p class="mf-frozen">${esc(t)}</p>`).join('')}<p>Outcome: ${esc(e.outcome)}. Support before this: ${flag(e.supported)}. Guided: ${flag(e.guided)}.</p></li>`:x.shape==='pending'?`<li><p>${i.id}: support opened before an answer: yes. Guided: ${flag(e.guided)}.</p></li>`:`<li><p>${i.id}: ${esc(T.unreadable)}</p></li>`);}
 return `<details class="panel"><summary>${esc(T.notesHeading)}</summary><p>Teach card worked examples opened: ${flag(v.cardsSeen)}. A false support flag means no recorded support, not an independent attempt.</p><ul>${rows.join('')}</ul><a href="#post/manifest">${esc(T.title)}</a></details>`;
}
