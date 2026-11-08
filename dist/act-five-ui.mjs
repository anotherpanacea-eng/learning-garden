// Spec 604 · Act V opening: Page 5, the blank pages, and six project paths. Choosing a path is story progress only.
import {actFiveContent as C} from './act-five-content.mjs';
import {actFivePaths,actFiveView,startActFive,revealNextKeeperPage,chooseActFivePath,markActFiveMade,setActFiveChange,keepActFiveLimit,canEndActFive,endActFive} from './act-five-core.mjs';
import {blankPagesScene,bindingScene} from './act-five-art.mjs';
import {setActTwoFrameAmount} from './act-two-core.mjs';
import {guides} from './companions.mjs';
import {courierPresets,postCourierIdentity} from './post-office-content.mjs';
import {hearButton,stopSpeech} from './play-media.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=x=>esc(x).replace(/\*([^*]+)\*/g,'<em>$1</em>');
const button=(attrs,label,primary=false)=>`<button type="button" class="${primary?'primary':'secondary'}" ${attrs}>${esc(label)}</button>`;
const link=(href,label,primary=false)=>`<a class="${primary?'primary':'secondary'}" href="${esc(href)}">${esc(label)}</a>`;
const heading=text=>`<h1 id="act-five-heading" tabindex="-1">${esc(text)}</h1>`;
// The guide and courier names, as Act III resolves them; an unrecognized saved choice gets the plain role name.
function named(state,line){
 const guide=(guides.find(g=>g.id===state.garden?.guide)||guides[0]).name,courier=courierPresets.some(p=>p.id===state.postOffice?.courier)?`the ${postCourierIdentity(state).title.toLowerCase()}`:'the courier';
 return line.replaceAll('{guide}',()=>guide).replace(/(^|[.!?]\s+)\{courier\}/g,(_,prefix)=>prefix+courier[0].toUpperCase()+courier.slice(1)).replaceAll('{courier}',()=>courier);
}
const reading=(state,lines)=>`<div class="a5-reading" data-act-five-read>${lines.map(x=>`<p>${rich(named(state,x))}</p>`).join('')}</div>`;
const hear=()=>hearButton('',C.ui.hear,'en');
const pathById=id=>C.paths.find(p=>p.id===id);
let notice={text:'',route:null};
export function resetActFiveView(){notice={text:'',route:null};}

export function actFiveRoute(hash){
 if(hash==='#almanac/next-keeper')return {part:'page'};
 if(hash==='#almanac/question-of-our-own')return {part:'ending'};
 if(hash==='#almanac/own-question'||hash.startsWith('#almanac/own-question/')){const id=hash.split('/')[2];return actFivePaths.includes(id)?{part:'path',path:id}:{part:'hub'};}
 return null;
}
function amounts(v){const bad=v.frameAmountStatus==='unreadable';return `<div class="a5-controls" role="group" aria-label="${esc(C.title)}">${['short','longer'].map(x=>button(`data-a5-frame-amount="${x}" aria-pressed="${v.frameAmount===x}"${bad?' disabled':''}`,C.ui[x])).join('')}</div>${bad?`<p role="status">${esc(C.messages.badPreference)}</p>`:''}`;}
const status=text=>`<p id="act-five-status" class="a5-status" role="status" aria-live="polite" tabindex="-1">${esc(text)}</p>`;
function steps(state){const S=C.steps;return `<section class="a5-steps" aria-labelledby="a5-steps-title"><h2 id="a5-steps-title">${esc(S.title)}</h2><p>${esc(S.intro)}</p><ol>${S.list.map(x=>`<li><strong>${esc(x.name)}.</strong> ${esc(x.does)}${x.line?` <span data-act-five-read>${rich(named(state,x.line))}</span>`:''}</li>`).join('')}</ol><p>${esc(S.switching)}</p></section>`;}
function hub(state,v){
 if(!v.started)return `${heading(C.title)}<p>${esc(C.messages.unreached)}</p>${v.canStart?button('data-a5-start',C.ui.start,true):''}`;
 const cards=C.paths.map(p=>`<li class="a5-path" data-a5-path="${p.id}" data-a5-current="${v.path===p.id}"><h3>${esc(p.title)}</h3><p class="a5-invite">${esc(p.invitation)}</p>${v.path===p.id?`<p class="a5-current">${esc(C.chosen.yours)}</p>`:''}<a class="${v.path===p.id?'primary':'secondary'}" href="#almanac/own-question/${p.id}">${esc(C.ui.open)}<span class="sr-only">: ${esc(p.title)}</span></a></li>`).join('');
 return `${heading(C.title)}<p class="a5-question">${esc(C.question)}</p>${amounts(v)}${reading(state,[C.hook,...C.opening[v.frameAmount]])}${hear()}<div class="a5-controls">${v.pageVisible?link('#almanac/next-keeper',C.ui.reread):button('data-a5-reveal',C.ui.reveal)}</div>${v.ended?`<div class="a5-controls">${link('#almanac/question-of-our-own',C.ending.reread,true)}</div>`:''}${v.earlierPath?`<p>${esc(C.chosen.earlier)}</p>`:''}<section aria-labelledby="a5-paths-title"><h2 id="a5-paths-title">${esc(C.ui.paths)}</h2><ul class="a5-paths">${cards}</ul></section>${steps(state)}`;
}
function page(state,v){
 const P=C.page;
 if(!v.pageVisible)return `${heading(P.title)}<p>${esc(C.messages.unreached)}</p>${v.started?button('data-a5-reveal',C.ui.reveal,true):''}`;
 return `${heading(P.title)}${reading(state,[P.reveal])}${blankPagesScene(P.scene,P.caption,P.heading)}<article class="a5-page-leaf" data-a5-page-leaf><span class="a5-edge">${esc(P.edge)}</span>${reading(state,P.lines)}</article>${reading(state,[P.guide])}${hear()}<div class="a5-controls">${link('#almanac/own-question',C.ui.village,true)}</div>`;
}
function path(state,v,id){
 const p=pathById(id),K=C.chosen,mine=v.path===id;
 const jobs=p.jobs.map(j=>`<li><span class="a5-tier">${esc(j.tier)}</span>${j.href?`<a href="${esc(j.href)}">${esc(j.host)}</a>`:`<span data-a5-off-screen>${esc(K.offScreen)}</span>`}${reading(state,[j.line])}</li>`).join('');
 const choose=mine?`<p class="a5-current" data-a5-chosen>${esc(K.yours)}</p>${reading(state,[C.steps.list[0].line])}`:v.canChoose&&!v.ended?button(`data-a5-choose="${id}"`,v.path?K.switchTo:K.choose,true):'';
 return `${link('#almanac/own-question',C.ui.back)}${heading(p.title)}<p class="a5-invite">${esc(p.invitation)}</p>${amounts(v)}${reading(state,p[v.frameAmount])}${hear()}<details class="a5-note"><summary>Keeper's note</summary><p data-act-five-read>${esc(p.keeperNote)}</p></details><section class="a5-choose" id="act-five-choose" tabindex="-1">${choose}</section>${project(state,v,id)}<section aria-labelledby="a5-jobs-title"><h2 id="a5-jobs-title">${esc(K.jobsTitle)}</h2><p>${esc(K.jobsIntro)}</p><ul class="a5-jobs">${jobs}</ul></section><aside class="a5-ask">${reading(state,[C.steps.list[1].line])}<p>${esc(K.ask)}</p>${link(K.askHref,K.askLabel)}</aside><p>${esc(C.steps.switching)}</p>`;
}
// Spec605 · the chosen path's project. Each step appears once the one before it is done; after the ending it is a record.
const changeText=code=>C.project.changes.find(c=>c.id===code)?.text||C.project.changeEarlier;
const limitText=(id,code)=>pathById(id)?.limits.find(l=>l.id===code)?.text||C.project.limitEarlier;
const radios=(name,legend,items,current,locked,shown=false)=>`<fieldset><legend${shown?'':' class="sr-only"'}>${esc(legend)}</legend>${items.map(x=>`<label><input type="radio" name="${name}" value="${esc(x.id)}"${x.id===current?' checked':''}${locked?' disabled':''}> <span data-act-five-read>${esc(x.text)}</span></label>`).join('')}</fieldset>`;
function project(state,v,id){
 const P=C.project,pr=v.projects[id],p=pathById(id),mine=v.path===id,locked=v.ended;
 if(pr.status==='unreadable'||v.projectsStatus==='unreadable')return `<section class="a5-project"><h2>${esc(P.title)}</h2><p>${esc(C.messages.unreadableAct)}</p></section>`;
 if(!mine)return pr.status==='ready'?`<section class="a5-project"><h2>${esc(P.title)}</h2><p>${esc(P.otherPath)}</p></section>`:'';
 const make=pr.made?`<p class="a5-done">${esc(P.madeDone)}</p>`:locked?'':`${reading(state,[C.steps.list[2].line])}${button('data-a5-made',P.made,true)}`;
 const show=pr.made?`<div class="a5-step"><h3>${esc(P.showTitle)}</h3><p class="a5-show" data-act-five-read>${rich(named(state,p.show))}</p></div>`:'';
 const change=pr.made?`<div class="a5-step" id="a5-change" tabindex="-1"><h3>${esc(P.changeTitle)}</h3>${reading(state,[C.steps.list[4].line])}${radios('a5-change',P.changeTitle,P.changes,pr.change,locked)}${pr.change&&!P.changes.some(c=>c.id===pr.change)?`<p>${esc(P.changeEarlier)}</p>`:''}${locked?'':button('data-a5-change-save',P.changeSave)}</div>`:'';
 const keep=pr.made&&pr.change?`<div class="a5-step" id="a5-keep" tabindex="-1"><h3>${esc(P.keepTitle)}</h3>${reading(state,[C.steps.list[5].line])}${radios('a5-limit',P.keepIntro,p.limits,pr.limit,locked,true)}${pr.limit&&!p.limits.some(l=>l.id===pr.limit)?`<p>${esc(P.limitEarlier)}</p>`:''}${locked?'':button('data-a5-limit-save',P.keepSave)}</div>`:'';
 const card=pr.complete?`<article class="a5-card" id="a5-project-page" tabindex="-1" data-act-five-read><h3>${esc(P.pageTitle)}: ${esc(p.title)}</h3><p>${esc(P.pageMade)}</p><p>${esc(changeText(pr.change))}</p><p>${esc(P.pageLimit.replace('{limit}',limitText(id,pr.limit)))}</p></article>${v.ended&&v.kept===id?`<p class="a5-done">${esc(P.bound)}</p>${link('#almanac/question-of-our-own',C.ending.reread,true)}`:canEndActFive(v,id)?button('data-a5-end',P.bind,true):''}`:'';
 return `<section class="a5-project" id="a5-project" tabindex="-1" aria-labelledby="a5-project-title"><h2 id="a5-project-title">${esc(P.title)}</h2><p>${esc(P.intro)}</p><div class="a5-step"><h3>${esc(C.steps.list[2].name)}</h3>${make}</div>${show}${change}${keep}${card}</section>`;
}
function ending(state,v){
 const E=C.ending;
 if(!v.ended)return `${heading(E.title)}<p>${esc(C.messages.endUnreached)}</p>${link('#almanac/own-question',C.ui.back)}`;
 const pr=v.keptKnown?v.projects[v.kept]:null,title=v.keptKnown?pathById(v.kept).title:E.earlierProject,limit=pr&&pr.limit?limitText(v.kept,pr.limit).replace(/\.$/,''):E.earlierLimit;
 const almanac=E.almanac.replace('{project}',title).replace('{limit}',limit);
 return `${heading(E.title)}${bindingScene(E.scene,E.caption,C.page.heading,v.season)}${amounts(v)}${reading(state,[...E[v.frameAmount],...(v.season?[E.seasons[v.season]]:[]),almanac,E.between])}${hear()}<div class="a5-controls">${link('#almanac/keepers',C.ui.keepers,true)}${link('#home',E.pause)}</div>`;
}
export function actFivePage(state,{part='hub',path:id=null,blocked=false}={}){
 const v=actFiveView(state);let body;
 if(['unavailable','unreadable'].includes(v.status)||!v.started&&v.startedStatus==='unreadable')body=`${heading(C.title)}<p>${esc(C.messages.unreadableAct)}</p>`;
 else if(part==='page')body=page(state,v);
 else if(part==='ending')body=ending(state,v);
 else body=part==='path'&&v.started&&pathById(id)?path(state,v,id):hub(state,v);
 return `<div class="act-five-page" data-act-five-root data-keeper-story lang="en"${blocked?' hidden':''}>${status(notice.route===(typeof location==="undefined"?null:location.hash)?notice.text:'')}${body}<footer class="a5-controls">${link('#almanac/keepers',C.ui.keepers)}${link('#explore',C.ui.explore)}</footer></div>`;
}
// Continue the story: under the Act IV ending and on the Keeper's Pages, once the meeting has ended.
export function actFiveInvitation(state,{blocked=false}={}){
 const v=actFiveView(state);if(!v.canStart&&!v.started)return '';
 return `<aside class="a5-invitation" data-act-five-root data-keeper-story lang="en"${blocked?' hidden':''}>${status('')}<div class="a5-controls">${v.started?link('#almanac/own-question',C.ui.start,true):button('data-a5-start',C.ui.start,true)}${v.pageVisible?link('#almanac/next-keeper',C.ui.reread):''}</div></aside>`;
}
export function actFiveNotes(state){
 const v=actFiveView(state);if(v.status==='missing'&&!v.canStart)return '';
 const bad=['unavailable','unreadable'].includes(v.status)||v.startedStatus==='unreadable';
 const done=actFivePaths.filter(id=>v.projects[id].complete).length,text=!v.started?'not started':`started, Page 5 ${v.pageVisible?'read':'not yet read'}, ${v.path?`project path: ${pathById(v.path).title}`:v.earlierPath?'a project path from an earlier version':'no project path chosen yet'}, ${done} project${done===1?'':'s'} kept with a limit${v.ended?', a project is bound into the Keeper\'s Pages':''}`;
 return `<details class="panel" data-act-five-notes><summary>${esc(C.title)}</summary><p>${esc(bad?C.messages.unreadableAct:C.notes.line.replace('{state}',text))}</p><p>${esc(C.notes.details)}</p></details>`;
}
export function bindActFive(state,ctx){
 const root=document.querySelector('[data-act-five-root]');if(!root)return;
 const owner=ctx.explorerId?.(),record=state.story,route=location.hash;
 const live=el=>root.isConnected&&el.isConnected&&root.contains(el)&&!el.disabled&&state.story===record&&(!ctx.notebook||ctx.notebook()===state)&&ctx.explorerId?.()===owner&&ctx.isActive?.()!==false&&location.hash===route&&!document.querySelector('dialog.welcome-film[open]');
 const focus=selector=>ctx.focus?ctx.focus(selector):document.querySelector(selector)?.focus();
 const options={canExport:ctx.canExport};
 function commit(fn,destination=null,target='#act-five-heading'){
  if(fn()!==true){notice={text:C.messages.refused,route};const el=root.querySelector('#act-five-status');if(el)el.textContent=C.messages.refused;return focus('#act-five-status');}
  stopSpeech();const saved=ctx.save?.(),text=saved?.enabled===false||saved?.ok===false?saved.message||'':'';notice={text,route:destination||route};
  const next=text?'#act-five-status':target;
  if(destination&&destination!==location.hash){window.addEventListener('hashchange',()=>{if(ctx.explorerId?.()===owner&&location.hash===destination)focus(next);},{once:true});location.hash=destination;}
  else{ctx.render();focus(next);}
 }
 const on=(selector,fn)=>document.querySelectorAll(selector).forEach(el=>el.addEventListener('click',e=>{if(!live(el)){e.stopImmediatePropagation();return;}fn(el);}));
 // Read-aloud speaks the visible prose only, captured at the moment Hear is pressed, as in Act IV.
 root.querySelectorAll('[data-speak]').forEach(el=>el.addEventListener('click',e=>{if(!live(el)){e.preventDefault();e.stopImmediatePropagation();return;}el.dataset.speak=[...root.querySelectorAll('[data-act-five-read]')].filter(x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden'&&!x.closest('details:not([open])')).map(x=>x.innerText).join(' ');},{capture:true}));
 on('[data-a5-start]',()=>commit(()=>startActFive(state,options),'#almanac/next-keeper'));
 on('[data-a5-reveal]',()=>commit(()=>revealNextKeeperPage(state,options),'#almanac/next-keeper'));
 on('[data-a5-choose]',el=>commit(()=>chooseActFivePath(state,el.getAttribute('data-a5-choose'),options),null,'#act-five-choose'));
 const id=actFiveRoute(route)?.path;
 const checked=name=>root.querySelector(`input[name="${name}"]:checked`)?.value;
 on('[data-a5-made]',()=>commit(()=>markActFiveMade(state,id,options),null,'#a5-change'));
 on('[data-a5-change-save]',()=>{const c=checked('a5-change');if(!c)return;commit(()=>setActFiveChange(state,id,c,options),null,'#a5-keep');});
 on('[data-a5-limit-save]',()=>{const l=checked('a5-limit');if(!l)return;commit(()=>keepActFiveLimit(state,id,l,options),null,'#a5-project-page');});
 on('[data-a5-end]',()=>commit(()=>endActFive(state,id,new Date().getMonth(),options),'#almanac/question-of-our-own'));
 on('[data-a5-frame-amount]',el=>{const value=el.getAttribute('data-a5-frame-amount');commit(()=>setActTwoFrameAmount(state,value,options),null,`[data-a5-frame-amount="${value}"]`);});
}
