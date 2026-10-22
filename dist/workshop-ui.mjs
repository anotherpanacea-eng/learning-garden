import {circuitPage,bindCircuits} from './lantern-circuit-ui.mjs';
import {repeatDeliveriesPage,repeatDeliveriesNotes,bindRepeatDeliveries} from './repeat-deliveries-ui.mjs';
import {ribbonMatchesPage,ribbonMatchesNotes,bindRibbonMatches} from './ribbon-matches-ui.mjs';
import {sourceTrailPage,sourceTrailNotes,bindSourceTrail} from './source-trail-ui.mjs';
import {preparationClockPage,preparationClockNotes,bindPreparationClock} from './preparation-clock-ui.mjs';
import {marketChangePage,marketChangeNotes,bindMarketChange} from './market-change-ui.mjs';
import {balanceStallPage,balanceStallNotes,bindBalanceStall} from './balance-stall-ui.mjs';
import {twoWindowsPage,twoWindowsNotes,bindTwoWindows} from './two-windows-ui.mjs';
import {cartographerPage,cartographerNotes,bindCartographer} from './cartographer-ui.mjs';
import {coinCounterPage,coinCounterNotes,bindCoinCounter} from './coin-counter-ui.mjs';
import {fairTestPage,fairTestNotes,bindFairTest} from './fair-test-ui.mjs';
import {heights,surfaces,startWorkshop,resumeWorkshop,setWorkshopSetting,setWorkshopPrediction,releaseWorkshop,stepWorkshop,replayWorkshop,finishWorkshop,setWorkshopSupport,setWorkshopReading} from './workshop-core.mjs';
import {guideRail} from './garden-ui.mjs';
import {hearButton} from './play-media.mjs';
import {learningInvitations} from './learning-invitations.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(attr,label,kind='secondary',disabled=false)=>`<button type="button" class="${kind}" ${attr}${disabled?' disabled':''}>${label}</button>`;
const current=s=>s.workshop?.experiments?.find(e=>e.id===s.workshop.current)||null;
const label=(list,id)=>list.find(x=>x.id===id)?.label||id;
const name=t=>`${label(heights,t.height)}, ${label(surfaces,t.surface)}`;
const settings=e=>e.variable==='height'?{height:e.setting,surface:e.fixed}:{height:e.fixed,surface:e.setting};
const explanation='Change one thing so you can compare it. Keep the same cart and release it without a push. In our pretend model, higher ramps send the cart farther. The rough landing surface slows it more than the smooth one. Real carts need real tests: these distances are made-up examples.';
const phaseLabel=t=>!t?'Waiting at the top':t.phase===0?'Released: ready to roll':t.phase===1?'At the ramp’s foot: distance starts here':`Stopped ${t.distance} model cm from the ramp’s foot`;
export function workshopApparatus(e){
 const t=e?.pending,c=t||settings(e),height=c.height||'middle',surface=c.surface||'smooth',top={low:141,middle:107,high:73}[height]||107;
 const phase=t?.phase??0,cartX=phase===2?190+t.distance*12:phase===1?190:76,cartY=phase===0?top-15:165;
 const trails=(e?.trials||[]).slice(-6);
 const alt=`${label(heights,height)} ramp, ${label(surfaces,surface)} landing surface. ${phaseLabel(t)}. Distance is measured horizontally from the ramp’s foot at zero.`;
 return `<figure class="workshop-apparatus"><svg viewBox="0 0 600 267" role="img" aria-label="${esc(alt)}"><defs><pattern id="workshop-grain" width="12" height="8" patternUnits="userSpaceOnUse"><path d="M0 6l4-4 4 4" fill="none" stroke="#826345" stroke-width="1.5"/></pattern></defs><path d="M30 181H575" stroke="#183f39" stroke-width="3"/><path d="M45 181V${top}H80L190 181Z" fill="#d6b77d" stroke="#75593c" stroke-width="2"/><path d="M80 ${top}L190 181" stroke="#183f39" stroke-width="4"/><rect x="190" y="181" width="370" height="12" fill="${surface==='rough'?'url(#workshop-grain)':'#abc4da'}"/><path d="M190 54V215" stroke="#397958" stroke-dasharray="4 5"/><text x="193" y="45" font-size="14" fill="#183f39">Distance starts here</text><path d="M190 226H550" stroke="#183f39" stroke-width="2"/>${Array.from({length:31},(_,n)=>`<path d="M${190+n*12} 226v${n%5===0?12:6}" stroke="#183f39"/>${n%5===0?`<text x="${190+n*12}" y="256" text-anchor="middle" font-size="13" fill="#183f39">${n}</text>`:''}`).join('')}<text x="365" y="215" text-anchor="middle" font-size="13" fill="#183f39">Landing distance in model cm</text>${trails.map((row,i)=>`<path d="M${190+row.distance*12} ${194+i*3}v9" stroke="#9a5b44" stroke-width="2"/>`).join('')}<g transform="translate(${cartX},${cartY})"><rect x="-19" y="-12" width="38" height="20" rx="3" fill="#397958"/><path d="M-10-12v-19h21v19" fill="#e9b84a" stroke="#183f39"/><path d="M-10-31l10 8 11-8" fill="none" stroke="#183f39"/><circle cx="-12" cy="10" r="6" fill="#183f39"/><circle cx="12" cy="10" r="6" fill="#183f39"/></g></svg><figcaption>${esc(alt)}</figcaption></figure>`;
}
function setup(){return `<section class="workshop-sheet">${workshopApparatus({variable:'height',fixed:'smooth',setting:'low',trials:[]})}<h2>What shall we change?</h2><p>The old ramp washed into the hedge. The cart waits, wheels muddy. Choose one thing to change.</p><form id="workshop-start"><fieldset><legend>What will you change?</legend><label><input type="radio" name="variable" value="height" checked> Ramp height</label><label><input type="radio" name="variable" value="surface"> Landing surface</label></fieldset><div id="workshop-keep-surface"><label for="workshop-fixed-surface">Keep this the same: landing surface</label><select id="workshop-fixed-surface" name="fixedSurface">${surfaces.map(x=>`<option value="${x.id}">${esc(x.label)}</option>`).join('')}</select></div><div id="workshop-keep-height" hidden><label for="workshop-fixed-height">Keep this the same: ramp height</label><select id="workshop-fixed-height" name="fixedHeight">${heights.map(x=>`<option value="${x.id}">${esc(x.label)}</option>`).join('')}</select></div><button class="primary" type="submit">Start a comparison</button></form></section>`;}
function results(e){
 const rows=e.trials||[];
 if(!rows.length)return '<section class="workshop-results"><h2>Our stopping points</h2><p>Release the cart, then move it one step at a time. The first result will wait here.</p></section>';
 return `<section class="workshop-results"><h2>Our stopping points</h2><p class="tiny">Each bar starts at zero on the same scale, from 0 to 30.</p><div class="workshop-graph" role="img" aria-label="Bar graph of trial distances. The exact same values appear in the table below."><div class="workshop-scale"><span></span><div><span>0</span><span>15</span><span>30 model cm</span></div><span></span></div>${rows.map(t=>`<div class="workshop-bar-row"><span>${esc(name(t))}</span><div class="workshop-bar-track"><span style="width:${t.distance/30*100}%"></span></div><strong>${t.distance}</strong></div>`).join('')}</div><div class="workshop-table-wrap"><table><caption>Distance on the landing surface from the ramp’s foot</caption><thead><tr><th scope="col">Trial for this setting</th><th scope="col">Ramp height</th><th scope="col">Landing surface</th><th scope="col">Model cm</th></tr></thead><tbody>${rows.map(t=>`<tr><th scope="row">${t.trialNumber}</th><td>${esc(label(heights,t.height))}</td><td>${esc(label(surfaces,t.surface))}</td><td>${t.distance}</td></tr>`).join('')}</tbody></table></div><p>Which setting sent the cart farther? Do repeated trips stop at exactly the same number?</p></section>`;
}
function experiment(e){
 if(e.closed)return `<section class="workshop-sheet"><h2>An earlier comparison is kept</h2><p>${esc(e.closedReason||'This model revision is no longer available. Your earlier work is kept in notes and the download.')}</p><a class="primary" href="#workshop/new">Start a fresh comparison</a><a class="secondary" href="#notes">See kept work</a></section>`;
 const running=e.pending&&e.pending.phase<2,opts=e.variable==='height'?heights:surfaces;
 return `<section class="workshop-sheet"><p class="workshop-variable"><strong>Change:</strong> ${e.variable==='height'?'ramp height':'landing surface'} · <strong>Keep:</strong> ${esc(label(e.variable==='height'?surfaces:heights,e.fixed))}. Same cart. No added push.</p><div class="workshop-settings" role="group" aria-label="Change one setting">${opts.map(x=>`<button type="button" class="method ${e.setting===x.id?'selected':''}" data-workshop-setting="${x.id}" aria-pressed="${e.setting===x.id}"${running?' disabled':''}>${esc(x.label)}</button>`).join('')}</div><p><strong>Next release:</strong> ${esc(name(settings(e)))}.${e.pending?` <strong>Shown below:</strong> ${esc(name(e.pending))} trial ${e.pending.trialNumber}.`:""}</p>${workshopApparatus(e)}<p class="workshop-position" role="status">${esc(phaseLabel(e.pending))}</p><div class="workshop-run-controls">${!e.pending||e.pending.phase===2?button('data-workshop-release',e.trials.length?'Release a new trial':'Release the cart','primary'):button('data-workshop-step',e.pending.phase===0?'Roll to the ramp’s foot':'Show where it stops','primary')}${e.pending?.phase===2?button('data-workshop-replay','Replay this trial'):''}</div><p class="tiny">You control every step. Replaying shows the same trip again. Settings wait while a cart is rolling.</p><details id="workshop-prediction" class="workshop-prediction"><summary>An idea before the next trip</summary><p>Compared with your earlier trials, what might happen? You can change your mind or leave this blank.</p><div class="workshop-settings">${[['farther','Farther'],['shorter','A shorter distance'],['same','About the same'],['unsure','Not sure yet']].map(([id,text])=>`<button type="button" class="method ${e.prediction===id?'selected':''}" data-workshop-prediction="${id}" aria-pressed="${e.prediction===id}">${text}</button>`).join('')}${button('data-workshop-prediction="clear"','Leave it blank','text-button')}</div></details><button class="secondary" data-workshop-help>Help me think about the test</button>${e.support?.explanation?`<div class="hint"><p>${explanation}</p>${hearButton(explanation,'Hear this explanation')}</div>`:''}<details id="workshop-reading"><summary>For grown-ups: how did we read this part?</summary><div class="workshop-settings">${[['unobserved','Reading not observed'],['together','Read together'],['independent','Reported read independently']].map(([id,text])=>`<button type="button" class="method ${e.reading===id?'selected':''}" data-workshop-reading="${id}" aria-pressed="${e.reading===id}">${text}</button>`).join('')}</div><p class="tiny">A separate report; it does not assess decoding or fluency.</p></details>${results(e)}<div class="workshop-finish">${button('data-workshop-finish',e.finished?'Comparison kept. Keep exploring':'Keep this comparison','secondary',running)}<a class="secondary" href="#workshop/new">Try a different comparison</a><a class="text-button" href="#home">Take a break</a></div>${e.finished?'<p role="status">Your comparison is kept. You can continue, try another, or take a break.</p>':''}<details><summary>A paper or talking idea</summary><p>Sketch a parcel ramp. Label one thing you would change and one thing you would keep the same. What would you look for?</p><p class="tiny">Entirely optional. No real tools or construction are needed.</p></details></section>`;
}
export function workshopPage(state,slug){
 if(slug==='lantern')return circuitPage(state);
 if(slug==='repeats')return repeatDeliveriesPage(state);
 if(slug==='fractions')return ribbonMatchesPage(state);
 if(slug==='sources')return sourceTrailPage(state);
 if(slug==='clock')return preparationClockPage(state);
 if(slug==='change')return marketChangePage(state);
 if(slug==='balance')return balanceStallPage(state);
 if(slug==='fair')return fairTestPage(state);
 if(slug==='coins')return coinCounterPage(state);
 if(slug==='maps')return cartographerPage(state);
 if(slug==='windows')return twoWindowsPage(state);
 const e=current(state),showNew=slug==='new'||!e,experiments=state.workshop?.experiments||[];
 return `<div class="workshop-page"><header class="page-heading"><a class="back" href="#home">← Take a break</a><h1>The Storm Workshop</h1><p>Help a parcel find its landing place. Roll, notice, and try a change.</p>${hearButton('The storm damaged our parcel ramp. Let’s test a new one. Change one thing, release the cart without a push, and compare where it stops. You can ask for help, try again, or take a break.','Hear the workshop welcome')}</header><div class="workshop-layout"><div><nav class="workshop-table-choices" aria-label="Workshop tables"><strong>Other tables</strong><a href="#workshop/lantern">Lantern Circuit Bench</a><a href="#workshop/repeats">Repeat a Delivery Block</a><a href="#workshop/fractions">Same Amount, New Cuts</a><a href="#workshop/sources">Follow the Source Trail</a><a href="#workshop/clock">Preparation Clock</a><a href="#workshop/fair">Fair Test Bench</a><a href="#workshop/coins">Coin Counter</a><a href="#workshop/maps">Cartographer’s Table</a><a href="#workshop/windows">Two Windows story desk</a><a href="#workshop/balance">Balance Stall</a></nav>${showNew?setup():experiment(e)}</div>${guideRail(state,'{guide} says, “A surprising result is something to explore. Let’s change one thing and look closely.”')}</div>${experiments.length?`<details class="panel"><summary>Our comparisons (${experiments.length} kept)</summary><p class="tiny">Your latest 24 comparisons stay here.</p>${[...experiments].reverse().map(x=>`<p>${button(`data-workshop-resume="${esc(x.id)}"`,`${esc(x.id)}: ${x.closed?'kept earlier model':x.finished?'kept comparison':'waiting comparison'}`)}</p>`).join('')}</details>`:''}${learningInvitations('workshop')}</div>`;
}
export function workshopNotes(state){
 const fair=repeatDeliveriesNotes(state)+ribbonMatchesNotes(state)+sourceTrailNotes(state)+preparationClockNotes(state)+marketChangeNotes(state)+balanceStallNotes(state)+fairTestNotes(state)+coinCounterNotes(state)+cartographerNotes(state)+twoWindowsNotes(state),xs=state.workshop?.experiments||[];if(!xs.length)return fair;
 return fair+`<details class="panel"><summary>Storm Workshop (${xs.length} comparisons kept)</summary><p>Practice with illustrative authored model results. No physical measurements, independent experimental competence, reading level, or topic mastery is inferred. Latest 24 comparisons and 24 trial rows per comparison are retained; per-configuration counts continue after older rows are removed, so earlier counts still decide which model result comes next. Each bar uses authored model results, not measured physical data. Predictions are unscored, and notes mark any prediction chosen after a result was already shown. The full saved state is in the notes download.</p>${xs.map(e=>`<section><h3>${esc(e.id)}${e.closed?' (closed earlier model)':''}</h3><p>Model: ${esc(e.revision)}. Change: ${esc(e.variable)}. Keep: ${esc(e.fixed)}. Prediction: ${esc(e.prediction||'none')}${e.predictionAfterResults?' (after results)':''}. Reading: ${esc(e.reading||'unobserved')}. Explanation opened: ${e.support?.explanation?'yes':'no'}. Audio requested: ${e.support?.audioRequested?'yes':'no'}.</p>${e.closed?`<p>${esc(e.closedReason)} Exact kept work: <code>${esc(JSON.stringify(e))}</code></p>`:results(e)}${e.pending?`<p>Pending/replay: ${esc(phaseLabel(e.pending))}; ${esc(name(e.pending))}; frozen result ${esc(e.pending.distance)} model cm.</p>`:''}</section>`).join('')}</details>`;
}
export function bindWorkshop(state,{save,render,navigate,focus,canExport,explorerId}){
 if(document.querySelector('[data-lc-root]')){bindCircuits(state,{save,render,focus,canExport,explorerId});return;}
 bindRepeatDeliveries(state,{save,render,focus});
 if(document.querySelector('.repeat-sheet'))return;
 bindRibbonMatches(state,{save,render,navigate,focus});
 if(document.querySelector('.ribbon-match-sheet'))return;
 bindSourceTrail(state,{save,render,navigate,focus});
 if(document.querySelector('.trail-sheet'))return;
 bindPreparationClock(state,{save,render,navigate,focus});
 if(document.querySelector('.clock-sheet'))return;
 bindMarketChange(state,{save,render,navigate,focus});
 if(document.querySelector('.change-sheet'))return;
 bindBalanceStall(state,{save,render,navigate,focus});
 bindFairTest(state,{save,render,navigate,focus});
 bindCoinCounter(state,{save,render,navigate,focus});
 bindCartographer(state,{save,render,navigate,focus});
 bindTwoWindows(state,{save,render,navigate,focus});
 const redraw=()=>{const open=[...document.querySelectorAll('.workshop-page details[id][open]')].map(d=>d.id);save();render();for(const id of open){const d=document.getElementById(id);if(d)d.open=true;}};
 document.querySelectorAll('#workshop-start input[name="variable"]').forEach(r=>r.addEventListener('change',()=>{const height=r.form.elements.variable.value==='height';const a=document.getElementById('workshop-keep-surface'),b=document.getElementById('workshop-keep-height');if(a)a.hidden=!height;if(b)b.hidden=height;}));
 document.querySelector('#workshop-start')?.addEventListener('submit',event=>{event.preventDefault();const f=new FormData(event.currentTarget),variable=f.get('variable'),fixed=f.get(variable==='height'?'fixedSurface':'fixedHeight');startWorkshop(state,variable,fixed);save();navigate('#workshop');});
 document.querySelectorAll('[data-workshop-resume]').forEach(b=>b.addEventListener('click',()=>{resumeWorkshop(state,b.dataset.workshopResume);save();navigate('#workshop');}));
 const bind=(selector,fn,target)=>document.querySelectorAll(selector).forEach(b=>b.addEventListener('click',()=>{fn(b);redraw();focus(typeof target==='function'?target():target||selector);}));
 bind('[data-workshop-setting]',b=>setWorkshopSetting(state,b.dataset.workshopSetting),'[data-workshop-release]');
 bind('[data-workshop-prediction]',b=>setWorkshopPrediction(state,b.dataset.workshopPrediction==='clear'?null:b.dataset.workshopPrediction),'.workshop-prediction');
 bind('[data-workshop-release]',()=>releaseWorkshop(state),'[data-workshop-step]');
 bind('[data-workshop-step]',()=>stepWorkshop(state),()=>document.querySelector('[data-workshop-step]')?'[data-workshop-step]':'.workshop-position');
 bind('[data-workshop-replay]',()=>replayWorkshop(state),'[data-workshop-step]');
 bind('[data-workshop-help]',()=>setWorkshopSupport(state,'explanation'),'.hint');
 bind('[data-workshop-reading]',b=>setWorkshopReading(state,b.dataset.workshopReading),'[data-workshop-reading]');
 bind('[data-workshop-finish]',()=>finishWorkshop(state),'.workshop-finish');
 // Record audio support only for the explanation, not the welcome narration.
 document.querySelectorAll('.workshop-page .hint [data-speak]').forEach(b=>b.addEventListener('click',()=>{setWorkshopSupport(state,'audioRequested');save();}));
}
