import {orchardFoods} from './cafe-content.mjs';
import {investigateFood,collectFood} from './cafe-core.mjs';
import {foodArt,qualityIcons,hearButton} from './play-media.mjs';
import {gatheringShelf} from './forage-ui.mjs';
import {guideRail} from './garden-ui.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const places=['The starry branch','The curling vine','The wobbling bush'];
const observations={
 'star-berry':['A star on a leafy branch. What might it be like?','Tap: it squishes flat, then gently springs back. This pretend berry is soft.','Imagine a cool, sweet bite, soft as a cloud.'],
 'spiral-pod':['A curled pod hangs beside a leaf. What could be inside?','Tap: the pod snaps into crisp little curls. It is crunchy.','Imagine a warm, tangy bite. It is warm, crunchy, and tangy.'],
 'wobble-fruit':['Something wobbles when its branch moves. What could it be?','Tap: it wobbles and squishes. This pretend fruit is soft.','Imagine a cool, tangy bite, soft as jelly.']
};
export function orchardPage(state,id){
 const c=state.cafe,food=orchardFoods.find(f=>f.id===id),known=c.discoveries||[],steps=c.orchard?.steps||{};
 const opening='<header class="cafe-heading"><a class="back" href="#cafe"><span aria-hidden="true">←</span> Back to the waiting café</a><h1>The Cloud Orchard</h1><p>Look, imagine, and bring a pretend food back to the café jars.</p></header>';
 const hub=`<div class="orchard-scene"><svg viewBox="0 0 800 320" aria-hidden="true"><path d="M0 245Q150 190 300 249Q480 180 800 231V320H0Z" fill="#b8d4c3"/><path d="M140 270Q120 170 175 70M165 150l-60-70M163 170l70-75M616 273q45-90-5-172" fill="none" stroke="#8b7651" stroke-width="16"/><path d="M351 280q-49-80 15-125q58-50 60 21q-9 34-38 15" fill="none" stroke="#397958" stroke-width="9"/><g fill="#90b9ae"><ellipse cx="114" cy="72" rx="65" ry="47"/><ellipse cx="188" cy="65" rx="80" ry="54"/><ellipse cx="238" cy="112" rx="55" ry="43"/><ellipse cx="619" cy="215" rx="86" ry="65"/></g><g fill="#fffef9"><ellipse cx="400" cy="50" rx="85" ry="23"/><ellipse cx="485" cy="72" rx="62" ry="18"/></g></svg>${orchardFoods.map((f,i)=>`<a class="orchard-find orchard-find-${i}" href="#orchard/${f.id}" aria-label="Explore ${places[i].toLowerCase()}">${foodArt(f.id)}<span>${places[i]}</span>${known.includes(f.id)?'<small>In your jars</small>':''}</a>`).join('')}</div><p class="orchard-invitation">Choose somewhere to look. Your guest and plate will wait.</p>`;
 let body=hub+gatheringShelf(state);
 if(food){const step=Math.min(2,steps[food.id]||0),line=observations[food.id][step];body=`<section class="orchard-closeup" aria-labelledby="orchard-title"><a class="back" href="#orchard"><span aria-hidden="true">←</span> Look somewhere else</a><h2 id="orchard-title" tabindex="-1">${esc(food.name)}</h2><div class="orchard-specimen orchard-step-${step}">${foodArt(food.id,food.name,step)}</div><p class="orchard-observation">${esc(line)}</p>${hearButton(line)}${step===2?`<div class="orchard-qualities">${qualityIcons(food.properties)}</div>`:''}<div class="orchard-actions">${step>0?`<button class="secondary" data-orchard-restart="${food.id}">Look again from the start</button>`:''}${step<2?`<button class="primary" data-orchard-investigate="${food.id}">${step===0?'Investigate this food':'Imagine a taste'}</button>`:known.includes(food.id)?`<p class="cafe-feedback" role="status">This food is in your jar. Gather more when its jar runs low.</p><a href="#cafe" class="primary">Cook with our discoveries</a><a href="#orchard/gather/${food.id}" class="secondary">Gather more of this food</a>`:`<button class="primary" data-orchard-collect="${food.id}">Bring 6 bites to the jar</button>`}</div><p class="tiny">Make-believe only. No real tasting or food preparation is needed.</p></section>`;}
 return `<div class="orchard-view">${opening}<div class="orchard-layout"><div>${body}</div>${guideRail(state,'{guide} says, “A discovery can begin with looking closely. Our guest can wait while we explore.”')}</div></div>`;
}
export function bindOrchard(state,{save,render,focus}){
 document.querySelectorAll('[data-orchard-restart]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.orchardRestart;if(!orchardFoods.some(f=>f.id===id))return;state.cafe.orchard.steps[id]=0;save();render();focus('#orchard-title');}));
 document.querySelectorAll('[data-orchard-investigate]').forEach(b=>b.addEventListener('click',()=>{investigateFood(state,b.dataset.orchardInvestigate);save();render();focus('#orchard-title');}));
 document.querySelectorAll('[data-orchard-collect]').forEach(b=>b.addEventListener('click',()=>{collectFood(state,b.dataset.orchardCollect);save();render();focus('#orchard-title');}));
}
