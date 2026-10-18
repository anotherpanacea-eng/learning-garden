import {ingredients} from './cafe-content.mjs';
import {ensureCafe,orderFor,currentRecipe,checkPlate,adjustBite,submitCafeNumber,supportCafe,skipCafeStage,serveCafe,nextGuest,skipGuest,restockCafe,cafeSummary} from './cafe-core.mjs';
import {numericAnswer} from './core.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plural=(n,word)=>`${n} ${word}${n===1?'':'s'}`;
const action=(id,label,style='secondary',extra='')=>`<button type="button" class="${style}" data-cafe-action="${id}" ${extra}>${label}</button>`;
const tags=properties=>properties.map(p=>`<span class="cafe-tag">${esc(p)}</span>`).join('');
const dots=(count,color)=>Array.from({length:count},()=>`<span class="cafe-bite" style="--bite:${esc(color)}" aria-hidden="true"></span>`).join('');

function guestArt(guest){
 const silhouettes={
  'cloud-dragon':'<path d="M41 137Q10 106 39 91Q31 63 59 65Q68 29 91 56Q114 33 130 59Q169 49 163 83Q192 97 168 124L168 156H39Z" fill="#abc4da"/><path d="M44 118Q5 128 20 158Q30 173 42 154M143 139l18 29M68 140l-5 27" fill="none" stroke="#abc4da" stroke-width="16"/><path d="M64 63L57 41 79 53M122 59L139 39 136 69" fill="#e9b84a"/>',
  'umbrella-sprite':'<path d="M24 83Q100-20 176 83Q153 65 140 87Q120 68 100 88Q79 68 60 87Q45 65 24 83" fill="#da8d8d"/><path d="M100 75V159Q100 181 81 171" fill="none" stroke="#183f39" stroke-width="6"/><ellipse cx="100" cy="112" rx="39" ry="29" fill="#e9b84a"/>',
  'ribbon-giant':'<path d="M73 169Q36 136 64 108Q110 70 56 33Q105 19 126 53Q145 77 112 106Q82 136 133 169Z" fill="#da8d8d"/><path d="M54 61Q12 20 27 84L61 76M131 59Q178 17 169 85L127 77" fill="#e9b84a"/><ellipse cx="98" cy="94" rx="34" ry="29" fill="#f2d8b4"/>',
  'pebble-troll':'<path d="M35 154L30 101 52 49 107 30 153 60 174 117 155 161Z" fill="#90b9ae"/><path d="M45 153L39 177M143 155l11 22" stroke="#90b9ae" stroke-width="18"/><path d="M62 54L51 28 87 42M124 45l27-15-6 34" fill="#e9b84a"/>',
  'lantern-sprite':'<path d="M59 65H141L158 149Q100 178 42 149Z" fill="#e9b84a"/><path d="M66 58Q100 11 134 58" fill="none" stroke="#183f39" stroke-width="6"/><path d="M52 67H148M45 148H155" stroke="#397958" stroke-width="8"/><path d="M100 74V152" stroke="#fffef9" stroke-width="22" opacity=".5"/>',
  'little-comet':'<path d="M68 128Q8 102 15 34Q63 74 126 59L143 111Z" fill="#e9b84a"/><path d="M71 94Q45 73 45 56" stroke="#fffef9" stroke-width="7" fill="none"/><circle cx="113" cy="112" r="52" fill="#da8d8d"/>',
  'teacup-sprite':'<path d="M52 81H146L137 141Q100 166 64 141Z" fill="#b8d4c3"/><path d="M144 92Q188 80 174 119Q164 139 141 130" stroke="#b8d4c3" stroke-width="12" fill="none"/><ellipse cx="99" cy="66" rx="62" ry="13" fill="#da8d8d"/><ellipse cx="99" cy="60" rx="33" ry="13" fill="#e9b84a"/>',
  'star-sprite':'<path d="M100 25L119 69 169 69 137 108 152 161 100 137 49 161 63 108 30 69 81 69Z" fill="#e9b84a"/><path d="M49 163L38 177M149 162l13 16" stroke="#183f39" stroke-width="5"/>'
 };
 return `<svg class="cafe-guest-art" viewBox="0 0 200 200" role="img" aria-label="${esc(guest.name)}, an imaginary ${esc(guest.kind.replaceAll('-',' '))}"><ellipse cx="100" cy="181" rx="72" ry="9" fill="#183f39" opacity=".08"/>${silhouettes[guest.kind]||silhouettes['star-sprite']}<circle cx="85" cy="102" r="4" fill="#183f39"/><circle cx="117" cy="102" r="4" fill="#183f39"/><path d="M90 120Q101 130 113 119" fill="none" stroke="#183f39" stroke-width="3" stroke-linecap="round"/><circle cx="74" cy="115" r="7" fill="#da8d8d" opacity=".5"/><circle cx="128" cy="115" r="7" fill="#da8d8d" opacity=".5"/></svg>`;
}
function plateView(c,order){
 const selected=currentRecipe(c).flatMap(item=>Array.from({length:item.count},()=>item.ingredient));
 return `<div class="cafe-plate" role="img" aria-label="Your plate: ${esc(selected.map(a=>a.name).join(', ')||'empty')}; ${selected.length} of ${order.bites} bites"><div class="cafe-plate-inner">${Array.from({length:order.bites},(_,i)=>selected[i]?`<span class="cafe-slot filled" style="--bite:${esc(selected[i].color)}"><span aria-hidden="true">✦</span><span class="cafe-slot-name">${esc(selected[i].name)}</span></span>`:'<span class="cafe-slot"><span aria-hidden="true">+</span><span class="cafe-slot-name">An empty spot</span></span>').join('')}</div></div>`;
}
function cupboard(c,summary){
 const editable=c.current?.stage==='plate';
 return `<section class="cafe-cupboard" aria-labelledby="cafe-cupboard-title"><div class="cafe-section-heading"><h2 id="cafe-cupboard-title">The cupboard</h2><p>${editable?'Tap a jar’s + to put one bite on your plate.':'Your recipe stays the same for this order.'}</p></div>${editable?`<div class="cafe-shelf-check"><span>${summary.count} of ${summary.order.bites} bites</span>${action('check','Check my plate','primary')}</div>`:''}<div class="cafe-jars">${ingredients.map(a=>{
  const n=c.current?.recipe[a.id]||0,full=summary&&summary.count>=summary.order.bites;
  return `<article class="cafe-jar"><div class="cafe-jar-body" style="--jar:${esc(a.color)}"><span class="cafe-jar-lid" aria-hidden="true"></span><div class="cafe-jar-label"><h3>${esc(a.name)}</h3><p>${a.properties.map(esc).join(' · ')}</p><span class="cafe-jar-stock">${c.stock[a.id]} in the jar</span></div></div>${editable?`<div class="cafe-jar-controls"><button type="button" data-cafe-bite="${esc(a.id)}" data-cafe-delta="-1" aria-label="Remove ${esc(a.name)}" ${n===0?'disabled':''}>−</button><span aria-label="${plural(n,'bite')} on your plate">${n}</span><button type="button" data-cafe-bite="${esc(a.id)}" data-cafe-delta="1" aria-label="Add ${esc(a.name)}" ${full||n>=3?'disabled':''}>+</button></div>`:`<p class="cafe-fixed-count">${plural(n,'bite')} per plate</p>`}</article>`;
 }).join('')}</div>${editable?'<p class="tiny cafe-cupboard-note">You can choose a bite even if its jar needs a top-up later.</p>':''}</section>`;
}
function plateFeedback(c,summary){
 const last=c.current.plateAttempts.at(-1);if(!last)return '';
 const same=ingredients.every(a=>last.recipe[a.id]===c.current.recipe[a.id]);
 if(!same)return '<p class="cafe-feedback" role="status">Your plate has changed. Check it when you’re ready.</p>';
 const count=last.count===summary.order.bites?'The number of bites fits.':`There ${last.count===1?'is':'are'} ${plural(last.count,'bite')}; the plate needs ${summary.order.bites}.`;
 const missing=last.missingProperties.length?` Still looking for: ${last.missingProperties.map(esc).join(' and ')}.`:' Both wishes are represented.';
 return `<p class="cafe-feedback" role="status">${count}${missing} You can change any bite and check again.</p>`;
}
function numberForm(d,label){
 return `<form class="cafe-number-form" data-cafe-number-form novalidate><label for="cafe-answer">${label}</label><div class="cafe-answer-line"><input id="cafe-answer" type="text" inputmode="numeric" autocomplete="off" maxlength="3" value="${esc(d.input)}" aria-describedby="cafe-number-error"><button type="submit" class="primary">Check my number</button></div><p id="cafe-number-error" data-cafe-error role="alert"></p></form>`;
}
function totalSupport(x,order){
 const d=x.total;if(!d.supported)return '';
 const steps=Math.min(order.guests,Math.max(0,d.steps||0));
 return `<section class="cafe-help" aria-labelledby="cafe-help-title"><h3 id="cafe-help-title" tabindex="-1">One equal plate at a time</h3><p>There are ${order.guests} guests, with ${plural(order.bites,'bite')} for each guest.</p><div class="cafe-count-plates" role="img" aria-label="${order.guests} equal plates with ${order.bites} bites each; ${steps} plates counted">${Array.from({length:order.guests},(_,i)=>`<div class="cafe-count-plate ${i<steps?'counted':''}">${dots(order.bites,i<steps?'#e9b84a':'#b8d4c3')}</div>`).join('')}</div><p class="cafe-model-readout" aria-live="polite">${plural(steps,'plate')} counted: ${plural(steps*order.bites,'bite')}.</p><div class="cafe-controls">${action('step','Count the next plate','secondary',steps===order.guests?'disabled':'')}${action('recount','Count again','text-button')}</div>${d.revealed?`<p class="cafe-explanation">${order.guests} equal plates with ${plural(order.bites,'bite')} each: ${order.guests} × ${order.bites} = ${order.total} bites altogether.</p>`:action('explain','Show the equal-groups explanation','text-button')}<p class="tiny">This picture and explanation are support for your practice.</p></section>`;
}
function stockSupport(x,summary){
 const d=x.shortfall;if(!d.supported)return '';
 const steps=Math.min(summary.items.length,Math.max(0,d.steps||0)),counted=summary.items.slice(0,steps).reduce((sum,i)=>sum+i.missing,0);
 return `<section class="cafe-help" aria-labelledby="cafe-help-title"><h3 id="cafe-help-title" tabindex="-1">Check each jar’s gap</h3><p>Count only the extra bites needed. A jar with enough already needs zero extra.</p><ul class="cafe-gap-list">${summary.items.map((item,i)=>`<li class="${i<steps?'counted':''}"><strong>${esc(item.ingredient.name)}</strong><span class="cafe-gap-dots" role="img" aria-label="${item.required} needed: ${Math.min(item.stock,item.required)} already in the jar, ${item.missing} extra needed">${Array.from({length:item.required},(_,j)=>`<span class="cafe-gap-dot ${j>=item.stock?'missing':''}" aria-hidden="true"></span>`).join('')}</span><span>${i<steps?`${item.missing} extra needed`:'Not counted yet'}</span></li>`).join('')}</ul><p class="tiny">Green dots: already in the jar. Ringed yellow dots: extra needed.</p><p class="cafe-model-readout" aria-live="polite">${plural(steps,'jar')} counted: ${plural(counted,'extra bite')} so far.</p><div class="cafe-controls">${action('step','Count the next jar','secondary',steps===summary.items.length?'disabled':'')}${action('recount','Count again','text-button')}</div>${d.revealed?`<div class="cafe-explanation">${summary.items.map(i=>`<p>${esc(i.ingredient.name)}: ${i.stock>=i.required?`${i.stock} in stock covers ${i.required} needed, so 0 extra.`:`${i.required} needed − ${i.stock} in stock = ${i.missing} extra.`}</p>`).join('')}<p>Altogether, add ${plural(summary.missing,'bite')}.${summary.missing===0?' Every selected jar already has enough.':''}</p></div>`:action('explain','Show the cupboard explanation','text-button')}<p class="tiny">This picture and explanation are support for your practice.</p></section>`;
}
function stageView(c,summary){
 const x=c.current,o=summary.order;
 if(x.stage==='plate')return `<section class="cafe-work" aria-labelledby="cafe-work-title"><p class="cafe-eyebrow">Make one plate</p><h2 id="cafe-work-title" tabindex="-1">What will go together?</h2><p>Fill exactly ${plural(o.bites,'bite slot')}. Include something <strong>${esc(o.wanted[0])}</strong> and something <strong>${esc(o.wanted[1])}</strong>.</p><p class="cafe-rule">Different bites can supply the two wishes. One bite with both also works. You can repeat a bite.</p>${plateView(c,o)}<p class="cafe-plate-caption">${summary.count} of ${o.bites} bites chosen${summary.items.length?`: ${summary.items.map(i=>`${i.count} ${esc(i.ingredient.name)}`).join(', ')}`:''}.</p><div aria-live="polite">${plateFeedback(c,summary)}</div>${action('check','Check this plate','primary')}</section>`;
 if(x.stage==='total')return `<section class="cafe-work" aria-labelledby="cafe-work-title"><p class="cafe-eyebrow">For the table</p><h2 id="cafe-work-title" tabindex="-1">One plate for each guest</h2><p>Your plate includes both wishes. There are <strong>${o.guests} guests</strong>, and each needs <strong>${plural(o.bites,'bite')}</strong>.</p>${numberForm(x.total,'How many bites are needed altogether?')}${x.total.attempts.length?'<p class="cafe-feedback" role="status">That number does not match this order yet. Try another number, count the plates, or leave the number for now.</p>':''}${!x.total.supported?action('help','Count the plates together','secondary'):''}${totalSupport(x,o)}<div class="cafe-stage-skip">${action('skip-stage','Leave this number for now','text-button')}<span class="tiny">The order can continue with support.</span></div></section>`;
 const ready=x.shortfall.skipped||x.shortfall.attempts.at(-1)===summary.missing;
 return `<section class="cafe-work" aria-labelledby="cafe-work-title"><p class="cafe-eyebrow">Check the cupboard</p><h2 id="cafe-work-title" tabindex="-1">Enough for everyone?</h2><p>The table needs ${plural(o.total,'bite')}. Compare each ingredient’s needed bites with its own jar. Extra stock in one jar cannot fill a gap in another.</p><div class="cafe-stock-table"><table><caption>Selected ingredients for the whole table</caption><thead><tr><th scope="col">Ingredient</th><th scope="col">Needed</th><th scope="col">In jar</th></tr></thead><tbody>${summary.items.map(i=>`<tr><th scope="row">${esc(i.ingredient.name)}</th><td>${i.required}</td><td>${i.stock}</td></tr>`).join('')}</tbody></table></div>${ready?`<p class="cafe-feedback" role="status">${x.shortfall.skipped?'The number was left for now. ': 'That fits. '}${summary.missing===0?'Zero extra bites are needed: every selected jar has enough.':`The cupboard needs ${plural(summary.missing,'extra bite')} altogether.`}</p>${action('serve','Top up and serve','primary')}`:`${numberForm(x.shortfall,'How many extra bites need adding altogether?')}<p class="tiny">If every selected jar has enough, enter 0.</p>${x.shortfall.attempts.length?'<p class="cafe-feedback" role="status">Let’s check the gaps again. You can try another number, use the picture, or leave the number for now.</p>':''}`}${!x.shortfall.supported?action('help','Look at the cupboard gaps','secondary'):''}${stockSupport(x,summary)}${!ready?`<div class="cafe-stage-skip">${action('skip-stage','Leave this number for now','text-button')}<span class="tiny">You can still top up and serve.</span></div>`:''}</section>`;
}
export function renderCafe(state){
 const c=state.cafe,x=c?.current,summary=x?cafeSummary(state):null;
 const opening=`<header class="cafe-heading"><a class="back" href="#home">← Pause in the garden</a><p class="cafe-eyebrow">Open for make-believe</p><h1>The Almost-Right Café</h1><p>Imaginary guests. Impossible ingredients. Another way to make an order fit.</p></header>`;
 if(!summary)return `<div data-cafe-view class="cafe-game">${opening}<section class="cafe-work"><h2 id="cafe-work-title" tabindex="-1">The counter is resting</h2><p>Invite a make-believe guest whenever you like.</p>${action('next','Invite a guest','primary')}${action('restock','Restock all jars','secondary')}</section></div>`;
 const o=summary.order,served=x.stage==='served';
 const response=served?`<section class="cafe-work cafe-response"><p class="cafe-eyebrow">A place to pause</p><h2 id="cafe-work-title" tabindex="-1">${x.recovered?'This saved visit is closed':'Thank you from '+esc(o.guest.name)}</h2><p>${x.recovered?'This saved order stays closed. You can invite another guest when you like.':esc(o.guest.thanks)}</p>${!x.recovered?plateView(c,o):''}<div class="cafe-controls">${action('next','Invite the next guest','primary')}${action('restock','Restock all jars','secondary')}</div><p class="tiny">Restocking fills every jar to 12 bites. You can also leave the café here.</p></section>`:stageView(c,summary);
 return `<div data-cafe-view class="cafe-game">${opening}<div class="cafe-counter-scene"><aside class="cafe-guest">${guestArt(o.guest)}<h2>${esc(o.guest.name)}</h2><p>${esc(served?'Your make-believe guest at the counter.':o.guest.greeting)}</p></aside><aside class="cafe-ticket" aria-label="The current order"><p class="cafe-ticket-top">ALMOST-RIGHT CAFÉ<br><span>One order, many possibilities</span></p><p>“${esc(o.guest.wantedDish)}” is sold out.</p><p>Instead, include something:</p><div class="cafe-wishes">${tags(o.wanted)}</div><dl><div><dt>Guests</dt><dd>${o.guests}</dd></div><div><dt>Bites per plate</dt><dd>${o.bites}</dd></div></dl><p class="tiny">${served?'A closed order.':'One bite is one unit from a jar. All food and guests are pretend.'}</p></aside>${response}</div>${cupboard(c,summary)}<footer class="cafe-footer">${!served?action('skip-guest','Let this guest wait; invite another','secondary'):''}<a class="text-button" href="#home">Pause in the garden</a><p class="tiny">This is practice. Pictures, explanations, and leaving a number for now are welcome. There are no grades.</p><div class="cafe-story-invite"><span>Curious how Pip and Dot opened the café?</span><button type="button" class="text-button" data-start-path="cafe">Visit the introductory café story</button></div></footer></div>`;
}
function numberNote(label,d){
 return `<p><strong>${label}:</strong> ${d.attempts.length?'Answers tried: '+d.attempts.map(esc).join(', ')+'.':'No answer tried.'} ${d.skipped?'Number left for now with support. ':''}${d.supported?'Support used. ':'No support recorded. '}${d.steps?plural(d.steps,'picture step')+' counted. ':''}${d.revealed?'Explanation opened.':''}</p>`;
}
function recordNote(c,r){
 const o=orderFor(c,r.orderIndex),recipe=ingredients.filter(a=>r.recipe[a.id]>0),missing=recipe.reduce((sum,a)=>sum+Math.max(0,r.recipe[a.id]*o.guests-r.stockBefore[a.id]),0);
 return `<details class="cafe-order-note"><summary>${esc(o.guest.name)} · ${r.status==='served'?'Served':'Guest left waiting'}</summary><p>Wishes: ${o.wanted.map(esc).join(' and ')}. ${plural(o.guests,'guest')}; ${plural(o.bites,'bite')} per plate.</p><p>Plate: ${recipe.length?recipe.map(a=>`${r.recipe[a.id]} ${esc(a.name)}`).join(', '):'No bites selected'}.</p><p><strong>Plate checks:</strong> ${r.plateAttempts.length?`${r.plateAttempts.length} recorded.`:'None recorded.'}</p>${r.plateAttempts.length?`<ul>${r.plateAttempts.map((a,i)=>`<li>Check ${i+1}: ${plural(a.count,'bite')}; ${a.valid?'both wishes and bite count fit':`${a.missingProperties.length?'missing '+a.missingProperties.map(esc).join(' and ')+'; ':''}${a.count===o.bites?'bite count fits':'bite count does not fit'}`}.</li>`).join('')}</ul>`:''}${numberNote('For the table',r.total)}${numberNote('Cupboard shortfall',r.shortfall)}<p class="tiny">Table target: ${plural(o.total,'bite')}. Cupboard gap at this order: ${plural(missing,'bite')}. ${r.status==='skipped'?'This guest’s order changed no stock.':'Top-up and stock use were recorded once.'}</p></details>`;
}
export function cafeNotes(state){
 const c=state.cafe;if(!c)return '<section class="panel cafe-notebook"><h2>Café practice</h2><p>No café orders yet.</p><a href="#cafe">Visit the café</a></section>';
 const x=c.current,o=x?orderFor(c):null,waiting=x&&x.stage!=='served';
 return `<section class="panel cafe-notebook"><h2>Café practice</h2><p>All café play is practice. Plate checks, arithmetic attempts, skips, and support are recorded separately. No mastery, general level, empathy, or independent reading is inferred.</p>${waiting?`<div class="cafe-waiting-note"><h3>A guest is waiting: ${esc(o.guest.name)}</h3><p>Current step: ${esc({plate:'make a plate',total:'bites for the table',stock:'cupboard shortfall'}[x.stage]||'preparing')}.</p><p>${x.plateAttempts.length} plate checks recorded so far.</p>${numberNote('For the table',x.total)}${numberNote('Cupboard shortfall',x.shortfall)}<a href="#cafe">Continue this order</a></div>`:x?.recovered?'<p>A recovered saved visit is closed and cannot spend stock again.</p>':''}<p class="tiny">${c.served} served orders in this browser. The latest ${c.history.length} served or skipped orders are listed below, up to 24. These counts describe play, not achievement.</p>${[...c.history].reverse().map(r=>recordNote(c,r)).join('')||'<p>No served or skipped orders yet.</p>'}<a href="#cafe">Return to the café</a></section>`;
}
export function bindCafe(state,{save,render,exposeFacts,focus}){
 const view=document.querySelector('[data-cafe-view]');if(!view)return;
 const redraw=selector=>{save();render();if(selector)focus(selector);};
 view.querySelectorAll('[data-cafe-bite]').forEach(button=>button.addEventListener('click',()=>{
  adjustBite(state,button.dataset.cafeBite,Number(button.dataset.cafeDelta));
  // Keep the same jar reachable even when its add/remove button has just become disabled.
  redraw(`[data-cafe-bite="${button.dataset.cafeBite}"]:not(:disabled)`);
 }));
 const input=view.querySelector('#cafe-answer');
 input?.addEventListener('input',()=>{const x=state.cafe.current;if(!x||!['total','stock'].includes(x.stage))return;(x.stage==='total'?x.total:x.shortfall).input=input.value.slice(0,3);save();});
 view.querySelector('[data-cafe-number-form]')?.addEventListener('submit',event=>{
  event.preventDefault();const value=numericAnswer(input.value);
  if(!Number.isSafeInteger(value)||value<0||value>999){view.querySelector('[data-cafe-error]').textContent='Use a whole number from 0 to 999.';input.focus();return;}
  const stage=state.cafe.current.stage;submitCafeNumber(state,value);
  redraw(state.cafe.current.stage!==stage?'#cafe-work-title':state.cafe.current.shortfall.skipped||state.cafe.current.stage==='stock'&&state.cafe.current.shortfall.attempts.at(-1)===cafeSummary(state).missing?'[data-cafe-action="serve"]':'#cafe-answer');
 });
 view.querySelectorAll('[data-cafe-action]').forEach(button=>button.addEventListener('click',()=>{
  const id=button.dataset.cafeAction;
  if(['help','step','recount','explain'].includes(id)){
   const c=ensureCafe(state),x=c.current;if(!x||!['total','stock'].includes(x.stage))return;
   const o=orderFor(c),d=x.stage==='total'?x.total:x.shortfall,limit=x.stage==='total'?o.guests:currentRecipe(c).length;
   if(id==='help'||id==='step')d.steps=Math.min(limit,Math.max(0,d.steps||0)+1);
   if(id==='recount')d.steps=0;
   if(id==='explain')d.revealed=true;
   supportCafe(state);if(x.stage==='total')exposeFacts([[o.guests,o.bites]]);
   redraw('#cafe-help-title');return;
  }
  const actions={check:checkPlate,'skip-stage':skipCafeStage,serve:serveCafe,next:nextGuest,'skip-guest':skipGuest,restock:restockCafe};
  if(actions[id]){actions[id](state);redraw(id==='check'&&state.cafe.current.stage==='plate'?'[data-cafe-action="check"]':'#cafe-work-title');}
 }));
}
