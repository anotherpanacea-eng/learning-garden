import {riddles,riddleSizes} from './riddles-content.mjs';
// Saved riddle work holds codes only. Text comes from the current cards at render time.
// Reading never repairs or fills in saved data; an unreadable notebook is kept as it is.
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const code=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9-]{0,39}$/.test(x);
const codes=(xs,min=0,max=200)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&xs.every(code)&&new Set(xs).size===xs.length;
const sizes=riddleSizes.map(s=>s.id),outcomes=['solved','shown','skipped'];
const fresh=()=>({version:1,size:'any',met:[],current:null,log:[]});
const validRound=r=>object(r)&&code(r.id)&&Number.isInteger(r.tries)&&r.tries>=0&&typeof r.clue==='boolean'&&outcomes.includes(r.outcome);
function validCurrent(c){
 if(c===null)return true;
 if(!object(c)||!code(c.id)||!codes(c.order,2,6)||!codes(c.picks,0,6)||!c.picks.every(p=>c.order.includes(p))||typeof c.clue!=='boolean'||![null,'solved','shown'].includes(c.outcome))return false;
 return c.outcome!=='solved'||c.picks.length>0;
}
export function validRiddles(r){return object(r)&&r.version===1&&sizes.includes(r.size)&&codes(r.met)&&Array.isArray(r.log)&&r.log.every(validRound)&&validCurrent(r.current);}
// Absent work reads as fresh without being created; present but unreadable work reads as null.
export function riddleState(state){return !Object.hasOwn(state,'riddles')?fresh():validRiddles(state.riddles)?state.riddles:null;}
function change(state,fn){const r=riddleState(state);if(!r)return false;const result=fn(r);if(result===false)return false;state.riddles=r;return result;}
export const riddleById=id=>riddles.find(x=>x.id===id)||null;
// The current card, if today's cards can still show it exactly as it was saved.
export function openRiddle(state){
 const r=riddleState(state),c=r?.current;if(!c)return null;const card=riddleById(c.id);
 if(!card||c.order.length!==card.choices.length||!c.order.every(x=>card.choices.some(ch=>ch.code===x)))return {current:c,card:null};
 return {current:c,card,choices:c.order.map(x=>card.choices.find(ch=>ch.code===x))};
}
export function poolFor(size){return riddles.filter(x=>size==='any'||x.band===size);}
export function chooseSize(state,size){return change(state,r=>{if(!sizes.includes(size))return false;r.size=size;return true;});}
function shuffled(xs,random){const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
// Unmet cards come first, in authored order after the current one; then the rotation repeats.
export function nextRiddle(state,random=Math.random){return change(state,r=>{
 const pool=poolFor(r.size),c=r.current;if(!pool.length)return false;
 const at=c?pool.findIndex(x=>x.id===c.id):-1,rotated=[...pool.slice(at+1),...pool.slice(0,at+1)];
 const card=rotated.find(x=>!r.met.includes(x.id)&&x.id!==c?.id)||rotated.find(x=>x.id!==c?.id)||rotated[0];
 if(c&&c.outcome===null)r.log.push({id:c.id,tries:c.picks.length,clue:c.clue,outcome:'skipped'});
 r.current={id:card.id,order:shuffled(card.choices.map(ch=>ch.code),random),picks:[],clue:false,outcome:null};
 if(!r.met.includes(card.id))r.met.push(card.id);
 return card.id;
});}
export function pickChoice(state,choice){const open=openRiddle(state);if(!open?.card||open.current.outcome!==null)return false;return change(state,r=>{
 const c=r.current;if(!c.order.includes(choice)||c.picks.includes(choice))return false;c.picks.push(choice);
 const fits=choice===open.card.answer;if(fits){c.outcome='solved';r.log.push({id:c.id,tries:c.picks.length,clue:c.clue,outcome:'solved'});}
 return {fits};
});}
export function askClue(state){const open=openRiddle(state);if(!open?.card||open.current.outcome!==null)return false;return change(state,r=>{r.current.clue=true;return true;});}
export function showAnswer(state){const open=openRiddle(state);if(!open?.card||open.current.outcome!==null)return false;return change(state,r=>{const c=r.current;c.outcome='shown';r.log.push({id:c.id,tries:c.picks.length,clue:c.clue,outcome:'shown'});return true;});}
export function riddleSummary(r){
 const solved=r.log.filter(x=>x.outcome==='solved');
 return {met:r.met.length,first:solved.filter(x=>x.tries===1&&!x.clue).length,later:solved.filter(x=>x.tries>1&&!x.clue).length,clue:solved.filter(x=>x.clue).length,shown:r.log.filter(x=>x.outcome==='shown').length,skipped:r.log.filter(x=>x.outcome==='skipped').length};
}
