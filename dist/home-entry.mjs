import {guides,avatars,portrait,gardenScene} from './companions.mjs';
import {hearButton} from './play-media.mjs';
import {arrivalView} from './story-arrivals-core.mjs';
import {linearView} from './linear-pathway-core.mjs';
import {evidenceVoiceView} from './evidence-voice-core.mjs';
import {motionView} from './motion-evidence-core.mjs';
import {frenchRoomsView} from './french-rooms-core.mjs';
import {loftState} from './loft-core.mjs';
import {pathwayView,safePathwayRoute} from './pathway-entry-core.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const choices=[['continue','Continue something'],['questions','Follow a question'],['town','Explore town']];
const places=[
 ['#cafe','Almost-Right Café','cafe'],['#loft','Story Loft','loft'],['#post','Willow Post Office','post'],['#workshop','Storm Workshop','workshop'],
 ['#living','Living Garden','living'],['#numbers','Number Garden','numbers'],['#facts','Facts through 12 × 12','numbers'],['#words','Word Garden','words'],
 ['#paris','Paris stories in English','paris'],['#french','Paris stories in French','paris'],['#bac','The ferry crossing (French)','paris'],['#mercado','The River Market (Spanish)','paris'],['#science','Water Lab','science'],['#orchard/games','Games Table','games'],
 ['#desk','Keeper’s Desk','desk'],['#town/remembers','Town stories','town'],['#riddles','Riddles in the hedge','riddles'],['#archive','Travelers’ Archive','paris'],
 ['#studio/bells','Bell Studio','bells'],['#studio/rhythm','Rhythm Studio','rhythm'],['#explore','Choose a curiosity','explore'],['#storm','Story paths','story'],
 ['#pathways','Subject starting points','notes']
];
const artFiles={cafe:'cafe',loft:'story-paths',post:'post-office',workshop:'workshop',living:'explore',numbers:'number-garden',words:'notes',paris:'story-paths',science:'water-lab',games:'explore',desk:'notes',town:'story-paths',riddles:'notes',bells:'workshop',rhythm:'workshop',explore:'explore',story:'story-paths',notes:'notes'};
const icon=name=>`<img src="./icons/${artFiles[name]||'notes'}.svg" width="30" height="30" alt="" aria-hidden="true">`;
const entry=(id,label,route)=>({id,label,route});
export function homeContinuations(book){
 if(!object(book))return [];const entries=[],g=book.garden;
 const visit=object(g)&&Array.isArray(g.visits)?g.visits.find(v=>object(v)&&typeof g.current==='string'&&v.id===g.current):null;
 if(visit&&visit.closed!==true)entries.push(entry('garden',visit.finished===true?'Your visit ending':'Your garden visit',visit.finished===true?'#storm/end':'#storm/play'));
 const order=object(book.cafe)&&book.cafe.version===1&&book.cafe.current;
 if(object(order)&&order.served!==true&&['plate','total','stock'].includes(order.stage))entries.push(entry('cafe','Your café order','#cafe'));
 const p=book.postOffice,delivery=object(p)&&p.version===1&&Array.isArray(p.visits)?p.visits.find(v=>object(v)&&typeof p.current==='string'&&v.id===p.current):null;
 if(delivery&&delivery.closed!==true)entries.push(entry('post','Your delivery','#post'));
 if(loftState(book)?.draft)entries.push(entry('loft','Your puppet show','#loft'));
 for(const [subject,label,read] of [['math','Your math investigation',linearView],['english','Your reading and writing',evidenceVoiceView],['science','Your science investigation',motionView],['french','Your French visit',frenchRoomsView]]){
  if(read(book).work)entries.push(entry(subject,label,`#learn/${subject}`));
  else{const goal=pathwayView(book,subject).goal;if(goal&&safePathwayRoute(goal.route))entries.push(entry(subject,`Your ${subject==='english'?'English':subject==='french'?'French':subject} starting point`,goal.route));}
 }
 return entries;
}
export function homeWelcome(book){
 const v=arrivalView(book);
 if(v.decisionStatus==='chosen'&&v.choice==='mended')return {title:'Welcome to Willowbank.',body:'The first repairs happened before you arrived. There are new ideas to try together.'};
 if(v.decisionStatus==='chosen'&&v.choice==='letter')return {title:'A town full of possibilities.',body:'There are stories, questions, and neighbors to meet. Choose where you would like to begin.'};
 if(v.hasStoryProgress||v.status==='unavailable'||v.decisionStatus==='unreadable')return {title:'Welcome to Willowbank.',body:'Pick up an idea, follow a question, or find another way to help.'};
 return {title:'The storm has passed.',body:'Our neighbors are safe. Will you help make the garden welcoming again?'};
}
let view=null;
function current(book,owner){if(!view||view.book!==book||view.owner!==owner)view={book,owner,choice:homeContinuations(book).length?'continue':'questions'};return view;}
const link=(route,label,art='')=>`<a href="${esc(route)}">${art}${esc(label)}</a>`;
export function homeEntryPage(book,persist,parcel='',owner=''){
 const v=current(book,owner),welcome=homeWelcome(book),guide=guides.find(g=>g.id===book.garden?.guide)||guides[0],avatar=avatars.find(a=>a.id===book.garden?.avatar)||avatars.find(a=>a.id==='sky'),resumes=homeContinuations(book),arrival=arrivalView(book);
 return `<div class="home-entry" data-home-entry><header class="home-welcome"><div><h1>${esc(welcome.title)}</h1><p>${esc(welcome.body)}</p><div class="home-companion">${portrait(guide.id,true)}<span>With ${esc(guide.name)}</span>${portrait(avatar.id,true)}</div>${hearButton(`${welcome.title} ${welcome.body}`,'Hear about Willowbank')}</div><div class="home-scene" aria-hidden="true">${gardenScene()}</div></header>
 <nav class="home-ways" aria-label="Ways to explore">${choices.map(([id,label])=>`<button type="button" data-home-choice="${id}" aria-pressed="${v.choice===id}" aria-controls="home-panel-${id}">${esc(label)}</button>`).join('')}</nav>
 <section class="home-panel" data-home-panel="continue" id="home-panel-continue" aria-labelledby="home-title-continue" ${v.choice!=='continue'?'hidden':''}><h2 id="home-title-continue" tabindex="-1">Pick up an idea</h2>${resumes.length?`<p>These places are open in your notebook. Choose one to return.</p><div class="home-returns">${resumes.map(r=>link(r.route,r.label)).join('')}</div>`:'<p>No place is open here yet. Follow a question, or explore town.</p>'}</section>
 <section class="home-panel" data-home-panel="questions" id="home-panel-questions" aria-labelledby="home-title-questions" ${v.choice!=='questions'?'hidden':''}><h2 id="home-title-questions" tabindex="-1">What are you wondering?</h2><p>Choose a question. You can ask for help or try another.</p><a href="#journeys">Follow an idea through town</a><div class="home-questions"><button type="button" data-start-path="creature">${icon('living')}What does a tiny neighbor need?</button><button type="button" data-start-path="message">${icon('post')}Can a note help someone find the way?</button><button type="button" data-start-path="shelter">${icon('workshop')}What makes a good hideaway?</button>${link('#science/ice','What changes when ice melts?',icon('science'))}</div></section>
 <section class="home-panel" data-home-panel="town" id="home-panel-town" aria-labelledby="home-title-town" ${v.choice!=='town'?'hidden':''}><h2 id="home-title-town" tabindex="-1">Where shall we go?</h2><p>Every place is open. Choose one and see what you can try.</p><div class="home-places">${places.map(([route,label,art])=>link(route,label,icon(art))).join('')}</div></section>
 ${parcel?`<div class="home-story">${parcel}</div>`:''}
 ${arrival.decisionStatus==='chosen'?`<p class="home-arrival-link">${link('#arrive','Read your arrival recap again')}</p>`:''}
 <details class="home-options"><summary>Choose how to begin</summary><div class="home-options-links">${link('#pathways','Choose a starting point by subject')}${link('#begin','Café and reading amounts')}${arrival.decisionStatus!=='chosen'?link('#arrive','Where shall we join the story?'):''}${link('#companions','Choose your guide')}${link('#notes','Grown-up notes')}<button type="button" data-film-replay="welcome">Watch the storm pass</button></div></details>
 <p class="home-save-note">${persist?'Saving is on in this browser.':'Saving is off. Your place lasts while this page stays open.'} Every place is open; there is no hurry.</p></div>`;
}
// Applied at the actual app binding sites, including directly retained callbacks.
export function ownHomeAction(element,action,{notebook,explorerId,isActive=()=>true}){
 const root=element.closest('[data-home-entry]');if(!root)return action;
 const book=notebook(),owner=explorerId(),route=location.hash;
 return event=>{if(!root.isConnected||!element.isConnected||!root.contains(element)||element.closest('[hidden]')||notebook()!==book||explorerId()!==owner||!isActive()||location.hash!==route)return;return action(event);};
}
export function bindHomeEntry(book,{notebook,explorerId,isActive}){
 const root=document.querySelector('[data-home-entry]');if(!root)return;
 const owner=explorerId(),route=location.hash,v=current(book,owner),live=()=>root.isConnected&&notebook()===book&&explorerId()===owner&&isActive()&&location.hash===route;
 root.addEventListener('click',event=>{if(!live()||event.target.closest?.('[hidden]')){event.preventDefault();event.stopImmediatePropagation();}},{capture:true});
 root.querySelectorAll('[data-home-choice]').forEach(b=>b.onclick=ownHomeAction(b,()=>{
  const choice=b.dataset.homeChoice;if(!choices.some(([id])=>id===choice))return;v.choice=choice;
  root.querySelectorAll('[data-home-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  root.querySelectorAll('[data-home-panel]').forEach(p=>p.hidden=p.dataset.homePanel!==choice);
  root.querySelector(`#home-title-${choice}`)?.focus();
 },{notebook,explorerId,isActive}));
}
