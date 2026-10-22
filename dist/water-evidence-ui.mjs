import {evidenceCards} from './water-evidence-content.mjs';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let session=null;

export function resetEvidenceShelf(){session=null;}
export function evidenceShelfState(explorerId){return session?.explorerId===explorerId?session:null;}
export function startEvidenceShelf(explorerId){
 if(typeof explorerId!=='string'||!explorerId)return false;
 session={explorerId,index:0,choices:[null,null,null],revealed:[false,false,false],clues:[false,false,false],talks:[false,false,false]};
 return true;
}
export function evidenceShelfAction(explorerId,action,value){
 const turn=evidenceShelfState(explorerId);if(!turn)return false;
 const i=turn.index;
 if(action==='page'&&Number.isInteger(value)&&value>=0&&value<evidenceCards.length){turn.index=value;return true;}
 if(action==='choice'&&Number.isInteger(value)&&value>=0&&value<evidenceCards[i].options.length){turn.choices[i]=value;return true;}
 if(action==='note'&&turn.choices[i]!==null){turn.revealed[i]=true;return true;}
 if(action==='clue'){turn.clues[i]=!turn.clues[i];return true;}
 if(action==='talk'){turn.talks[i]=!turn.talks[i];return true;}
 return false;
}

function picture(card,later){
 const base='<path d="M12 111H228" stroke="#446e5b" stroke-width="3" fill="none"/>';
 let scene='';
 if(card.id==='puddle')scene=`${base}<path d="M${later?'82 110 Q90 96 119 98 Q147 96 159 110':'42 110 Q54 89 92 94 Q116 76 148 91 Q185 89 198 110'}Z" fill="#83b9d8" stroke="#376f8c" stroke-width="3"/>`;
 if(card.id==='soil')scene=`<path d="M12 110H228V134H12Z" fill="#d4b891" stroke="#8b7357" stroke-width="2"/>${later?'<path d="M160 110 Q175 99 210 110V126H160Z" fill="#9b7455" stroke="#73543b" stroke-width="2"/><path d="M164 115l8 8m2-11l10 11m2-12l10 11m2-12l9 9" stroke="#ead9b7" stroke-width="2"/>':''}<path d="M${later?'40 110 Q55 96 82 99 Q105 94 119 110':'30 110 Q45 88 82 93 Q116 82 145 110'}Z" fill="#83b9d8" stroke="#376f8c" stroke-width="3"/>`;
 if(card.id==='dish')scene=`<path d="M24 125H216" stroke="#8b7357" stroke-width="7"/><path d="M58 35V100Q58 110 68 110H172Q182 110 182 100V35" fill="#fffdf4" stroke="#465c55" stroke-width="5"/><path d="M61 ${later?82:62}H179V100Q179 107 170 107H70Q61 107 61 100Z" fill="#83b9d8"/><path d="M61 ${later?82:62}H179" stroke="#376f8c" stroke-width="3"/>`;
 return `<svg viewBox="0 0 240 140" role="img" aria-label="${esc(later?card.after:card.before)}">${scene}</svg>`;
}

export function evidenceShelfPage(explorerId){
 const turn=evidenceShelfState(explorerId);
 if(!turn)return `<section data-evidence-root class="science-view evidence-view"><header class="science-heading"><a href="#science" class="back">← Back to Water Lab</a><p class="science-eyebrow">Water Lab</p><h1 id="evidence-intro-title" tabindex="-1">Water Evidence Shelf</h1><p>Three made-up before-and-after pictures. Notice a clue, then choose a careful explanation. No real water or equipment is needed.</p></header><div class="science-layout"><article class="science-notebook evidence-sheet"><h2>Pictures to think with</h2><p>What can you see? What might explain it? The pictures cannot show every water route.</p><button type="button" class="primary" data-evidence-start>Look at the first picture</button><p class="tiny">These choices stay while this shelf is open. They are not saved in the notebook.</p></article></div></section>`;
 const i=turn.index,card=evidenceCards[i],choice=turn.choices[i],feedback=choice===null?'':`${card.feedback}${card.reasons[choice]?` ${card.reasons[choice]}`:''}`;
 return `<section data-evidence-root data-evidence-card="${esc(card.id)}" class="science-view evidence-view"><header class="science-heading"><a href="#science" class="back">← Back to Water Lab</a><p class="science-eyebrow">Water Evidence Shelf · Picture ${i+1} of ${evidenceCards.length}</p><h1 id="evidence-card-title" tabindex="-1">${esc(card.title)}</h1><p>Look first at what changed. Then choose what might explain it.</p></header><div class="science-layout"><article class="science-notebook evidence-sheet"><p class="evidence-scene">${esc(card.scene)}</p><div class="evidence-pictures"><figure><h2>Before</h2>${picture(card,false)}<figcaption>${esc(card.before)}</figcaption></figure><figure><h2>Later</h2>${picture(card,true)}<figcaption>${esc(card.after)}</figcaption></figure></div><div class="evidence-support"><button type="button" class="secondary" data-evidence-clue aria-expanded="${turn.clues[i]}">${turn.clues[i]?'Hide the clue':'Show a clue'}</button><button type="button" class="secondary" data-evidence-talk aria-expanded="${turn.talks[i]}">${turn.talks[i]?'Hide talk idea':'Talk together'}</button></div>${turn.clues[i]?`<p id="evidence-clue" tabindex="-1" class="evidence-reveal">${esc(card.clue)}</p>`:''}${turn.talks[i]?`<p id="evidence-talk" tabindex="-1" class="evidence-reveal">${esc(card.talk)}</p>`:''}<h2 class="evidence-prompt">Which note fits these pictures best?</h2><div class="evidence-options" role="group" aria-label="Choose a note">${card.options.map((option,n)=>`<button type="button" class="science-choice ${choice===n?'selected':''}" data-evidence-choice="${n}" aria-pressed="${choice===n}">${esc(option)}</button>`).join('')}</div><button type="button" class="primary" data-evidence-note ${choice===null?'disabled':''}>Read the note</button>${turn.revealed[i]&&feedback?`<p id="evidence-feedback" tabindex="-1" class="evidence-feedback">${esc(feedback)}</p>`:''}<div class="evidence-pages">${i>0?'<button type="button" class="secondary" data-evidence-page="previous">Previous picture</button>':''}${i<evidenceCards.length-1?'<button type="button" class="primary" data-evidence-page="next">Next picture</button>':''}<a class="secondary" href="#science">Back to Water Lab</a></div><p class="tiny">These choices stay while this shelf is open. They are not saved in the notebook.</p><details class="science-sources"><summary>Grown-ups: sources and picture limits</summary><p>These are fictional drawings, not measured observations or a test of a path, soil, dish, flood barrier, or water safety. Flow, infiltration and evaporation are distinct possible routes. A lower waterline or darker soil in a drawing does not prove an exact cause or amount.</p><ul><li><a href="https://www.noaa.gov/education/resource-collections/freshwater/water-cycle" target="_blank" rel="noopener noreferrer">NOAA: The water cycle</a></li><li><a href="https://www.usgs.gov/water-science-school/science/infiltration-and-water-cycle" target="_blank" rel="noopener noreferrer">USGS: Infiltration and the Water Cycle</a></li><li><a href="https://www.usgs.gov/water-science-school/science/evaporation-and-water-cycle" target="_blank" rel="noopener noreferrer">USGS: Evaporation and the Water Cycle</a></li><li><a href="https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study" target="_blank" rel="noopener noreferrer">DfE: Science programs of study</a></li></ul><p>The words and drawings on this shelf are original Learning Garden content. No real floodwater, heating, or home experiment is requested.</p></details></article></div></section>`;
}

export function bindEvidenceShelf({render,focus,explorerId}){
 const root=document.querySelector('[data-evidence-root]');if(!root)return;
 const id=explorerId(),redraw=target=>{render();if(target)focus(target);};
 root.querySelector('[data-evidence-start]')?.addEventListener('click',()=>{if(startEvidenceShelf(id))redraw('#evidence-card-title');});
 root.querySelectorAll('[data-evidence-choice]').forEach(button=>button.addEventListener('click',()=>{const n=Number(button.dataset.evidenceChoice);if(evidenceShelfAction(id,'choice',n))redraw(`[data-evidence-choice="${n}"]`);}));
 root.querySelector('[data-evidence-note]')?.addEventListener('click',()=>{if(evidenceShelfAction(id,'note'))redraw('#evidence-feedback');});
 root.querySelector('[data-evidence-clue]')?.addEventListener('click',()=>{const opened=!evidenceShelfState(id)?.clues[evidenceShelfState(id)?.index];if(evidenceShelfAction(id,'clue'))redraw(opened?'#evidence-clue':'[data-evidence-clue]');});
 root.querySelector('[data-evidence-talk]')?.addEventListener('click',()=>{const opened=!evidenceShelfState(id)?.talks[evidenceShelfState(id)?.index];if(evidenceShelfAction(id,'talk'))redraw(opened?'#evidence-talk':'[data-evidence-talk]');});
 root.querySelectorAll('[data-evidence-page]').forEach(button=>button.addEventListener('click',()=>{const next=evidenceShelfState(id)?.index+(button.dataset.evidencePage==='next'?1:-1);if(evidenceShelfAction(id,'page',next))redraw('#evidence-card-title');}));
}
