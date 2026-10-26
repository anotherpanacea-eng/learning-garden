import {hatSource} from './which-hat-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),copy=structuredClone,own=(o,k)=>Object.hasOwn(o,k);
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,79}$/.test(x)&&!['constructor','prototype','tostring','valueof'].includes(x);
const text=(x,n=3000)=>typeof x==='string'&&x.length>0&&x.length<=n;
const unique=xs=>new Set(xs).size===xs.length,record=x=>obj(x)&&Object.keys(x).every(id);
const attributes=['size','age','color','ribbon'],pages=['build','questions','kept'];
const kinds=['hint','example','together','readback','audio'];
const results=['none','several','target','other'];
export function validHatSource(s){
 return obj(s)&&s.version===1&&id(s.id)&&text(s.title,200)&&
  Array.isArray(s.hats)&&s.hats.length>=1&&s.hats.length<=12&&unique(s.hats.map(h=>h?.id))&&s.hats.every(h=>obj(h)&&id(h.id)&&text(h.label,200)&&text(h.owner,200)&&attributes.every(k=>text(h[k],100)))&&
  Array.isArray(s.tiles)&&s.tiles.length<=16&&unique(s.tiles.map(t=>t?.id))&&s.tiles.every(t=>obj(t)&&id(t.id)&&text(t.text,200)&&Number.isInteger(t.rank)&&t.rank>=0&&t.rank<=20&&typeof t.after==='boolean'&&((t.property===null&&t.value===null)||(attributes.includes(t.property)&&text(t.value,100))))&&
  obj(s.frame)&&text(s.frame.before,100)&&text(s.frame.noun,100)&&obj(s.copy)&&['welcome','job','limit','hint','example','guided','usual','other','goal','scaffold'].every(k=>text(s.copy[k]))&&obj(s.copy.results)&&results.every(k=>text(s.copy.results[k]))&&
  Array.isArray(s.questions)&&s.questions.length>=1&&s.questions.length<=20&&unique(s.questions.map(q=>q?.id))&&s.questions.every(q=>obj(q)&&id(q.id)&&['context','prompt','hint','example','explanation'].every(k=>text(q[k]))&&Array.isArray(q.choices)&&q.choices.length>=2&&q.choices.length<=8&&unique(q.choices.map(c=>c?.id))&&q.choices.every(c=>obj(c)&&id(c.id)&&text(c.text,500)&&text(c.feedback))&&q.choices.some(c=>c.id===q.key));
}
const tilesValid=(s,x)=>Array.isArray(x)&&x.length<=16&&unique(x)&&x.every(t=>s.tiles.some(a=>a.id===t));
const targetValid=(s,x)=>s.hats.some(h=>h.id===x),itemValid=(s,x)=>s.questions.some(q=>q.id===x);
function helps(h,s){
 if(h===undefined)return true;
 return obj(h)&&typeof h.observed==='boolean'&&['concept','reading'].every(channel=>
  Array.isArray(h[channel])&&h[channel].length<=64&&h[channel].every(r=>
   obj(r)&&(targetValid(s,r.forId)||itemValid(s,r.forId))&&kinds.includes(r.kind)&&
   (channel==='reading'?r.kind==='audio':r.kind!=='audio')
  )
 )&&unique([...h.concept,...h.reading].map(r=>`${r.forId}:${r.kind}`))&&h.concept.length+h.reading.length<=64;
}
export function matchHats(s,tiles){const tests=tiles.map(i=>s.tiles.find(t=>t.id===i));return s.hats.filter(h=>tests.every(t=>t.property===null||h[t.property]===t.value)).map(h=>h.id);}
export function describeHat(s,tiles){const ts=tiles.map(i=>s.tiles.find(t=>t.id===i));return [s.frame.before,...ts.filter(t=>!t.after).map(t=>t.text),s.frame.noun,...ts.filter(t=>t.after).map(t=>t.text)].join(' ');}
export function assessHat(s,tiles,target){
 const selected=tiles.map(i=>s.tiles.find(t=>t.id===i)).filter(t=>!t.after),matches=matchHats(s,tiles);
 const order=selected.every((t,i)=>i===0||selected[i-1].rank<=t.rank)?'usual':'other';
 const outcome=matches.length===0?'none':matches.length>1?'several':matches[0]===target?'target':'other';
 return {phrase:describeHat(s,tiles),matches,order,outcome,feedback:s.copy.results[outcome]};
}
export function validHatClaim(c){try{return obj(c)&&validHatSource(c.source)&&targetValid(c.source,c.target)&&tilesValid(c.source,c.tiles)&&text(c.phrase,4000)&&Array.isArray(c.matches)&&unique(c.matches)&&c.matches.every(i=>targetValid(c.source,i))&&['usual','other'].includes(c.order)&&results.includes(c.outcome)&&c.outcome===(c.matches.length===0?'none':c.matches.length>1?'several':c.matches[0]===c.target?'target':'other')&&text(c.feedback)&&helps(c.helpBefore,c.source);}catch{return false;}}
export function validHatAnswer(a){try{return obj(a)&&validHatSource(a.source)&&itemValid(a.source,a.itemId)&&['fits','again'].includes(a.outcome)&&a.source.questions.find(q=>q.id===a.itemId).choices.some(c=>c.id===a.choice)&&text(a.feedback)&&helps(a.helpBefore,a.source);}catch{return false;}}
export const validHatSkip=a=>{try{return obj(a)&&validHatSource(a.source)&&itemValid(a.source,a.itemId)&&a.outcome==='skipped'&&helps(a.helpBefore,a.source);}catch{return false;}};
const workValid=w=>obj(w)&&validHatSource(w.source)&&pages.includes(w.page)&&targetValid(w.source,w.target)&&tilesValid(w.source,w.tiles)&&itemValid(w.source,w.question)&&helps(w.support,w.source);
export function hatView(state){
 if(!own(state,'descriptions'))return {status:'ready',root:null,visits:[],work:null};
 const r=state.descriptions;
 if(!obj(r)||r.version!==1||!obj(r.visits))return {status:'unavailable',root:r,visits:[],work:null};
 const visits=Object.entries(r.visits).map(([key,w])=>({id:key,readable:id(key)&&workValid(w),title:id(key)&&workValid(w)?w.source.title:'Retained unreadable visit'}));
 return {status:'ready',root:r,visits,work:id(r.current)&&own(r.visits,r.current)&&workValid(r.visits[r.current])?r.visits[r.current]:null};
}
const result=(ok,error)=>error?{ok,error}:{ok};
function change(state,fn,o={}){try{
 if(hatView(state).status==='unavailable')return result(false,'This earlier format is retained. Download notes; other activities stay open.');
 const candidate=copy(state),r=fn(candidate);if(!r?.ok)return r||result(false,'This change is unavailable.');
 if(!recoveryFitsProgressLimits(candidate)||typeof o.canExport!=='function'||o.canExport(candidate)!==true)return result(false,'This change could not be kept while keeping your notebook exportable. Your earlier work and choices are unchanged.');
 state.descriptions=candidate.descriptions;return r;
 }catch{return result(false,'This change could not be kept safely. Earlier work is unchanged.');}}
const workChange=(s,fn,o)=>change(s,c=>{const w=hatView(c).work;return w?fn(w):result(false,'Open a readable hat visit first.');},o);
export function startHats(state,o={}){return change(state,s=>{
 s.descriptions??={version:1,current:null,nextSerial:0,visits:{}};const r=s.descriptions;
 if(Object.keys(r.visits).length>=8)return result(false,'Eight visits are kept. Download notes, then choose and confirm a readable visit to remove if you need space.');
 if(!Number.isSafeInteger(r.nextSerial)||r.nextSerial<0||r.nextSerial>=1000000)return result(false,'The new-visit counter is retained but cannot allocate another visit. Earlier readable visits stay open.');
 const source=copy(o.source??hatSource);if(!validHatSource(source))return result(false,'That source cannot create a new visit here.');
 const key=`hats-${r.nextSerial}`;if(own(r.visits,key))return result(false,'That visit id is already kept. Nothing was replaced.');
 r.visits[key]={source,page:'build',target:source.hats[0].id,tiles:[],question:source.questions[0].id,support:{observed:true,concept:[],reading:[]},claims:[],answers:{}};r.current=key;r.nextSerial++;return {...result(true),key};
 },o);}
export const resumeHats=(s,key,o={})=>change(s,c=>{const r=c.descriptions;if(!r||!id(key)||!own(r.visits,key)||!workValid(r.visits[key]))return result(false,'That visit is retained but cannot be opened here.');r.current=key;return result(true);},o);
export function editHat(s,kind,value,o={}){return workChange(s,w=>{
 if(kind==='page'){if(!pages.includes(value))return result(false,'Choose a turn.');w.page=value;}
 else if(kind==='target'){if(!targetValid(w.source,value))return result(false,'Choose a peg on this rack.');w.target=value;}
 else if(kind==='question'){if(!itemValid(w.source,value))return result(false,'Choose a question from this visit.');w.question=value;}
 else if(kind==='tile'){if(!w.source.tiles.some(t=>t.id===value))return result(false,'Choose a word from this rack.');if(w.tiles.includes(value))w.tiles=w.tiles.filter(i=>i!==value);else w.tiles.push(value);}
 else if(kind==='clear')w.tiles=[];
 else if(['earlier','later','remove'].includes(kind)){
  const i=w.tiles.indexOf(value);if(i<0)return result(false,'Choose a word in your phrase.');
  if(kind==='remove')w.tiles.splice(i,1);else {const ts=w.tiles.map(id=>w.source.tiles.find(t=>t.id===id)),after=ts[i].after,step=kind==='earlier'?-1:1;let j=i+step;while(j>=0&&j<ts.length&&ts[j].after!==after)j+=step;if(j>=0&&j<ts.length)[w.tiles[i],w.tiles[j]]=[w.tiles[j],w.tiles[i]];}
 }else return result(false,'Choose a hat action.');return result(true);
 },o);}
export const hatContext=w=>w.page==='questions'?w.question:w.target;
export function supportHat(s,kind,o={}){return workChange(s,w=>{
 if(!kinds.includes(kind))return result(false,'Choose a support.');
 const forId=hatContext(w),support=w.support??{observed:false,concept:[],reading:[]};
 const channel=kind==='audio'?'reading':'concept';if(support[channel].some(r=>r.forId===forId&&r.kind===kind))return result(true);
 if(support.concept.length+support.reading.length>=64)return result(false,'The support-request notebook is full. Nothing was removed. Download notes or start a new visit.');
 support[channel].push({forId,kind});w.support=support;return result(true);
 },o);}
export const keepHat=(s,o={})=>workChange(s,w=>{
 if(!Array.isArray(w.claims)||w.claims.length>=24)return result(false,'The earlier discoveries stay kept. Download notes or start another visit for a new discovery.');
 const claim={source:copy(w.source),target:w.target,tiles:copy(w.tiles),...assessHat(w.source,w.tiles,w.target)};
 if(w.support!==undefined)claim.helpBefore=copy(w.support);w.claims.push(claim);return {...result(true),claim:copy(claim)};
 },o);
export function answerHat(s,choice,o={}){return workChange(s,w=>{
 const q=w.source.questions.find(q=>q.id===w.question),c=q.choices.find(c=>c.id===choice);if(!c)return result(false,'Choose one of this question’s answers.');
 if(!record(w.answers))return result(false,'Earlier answers are retained. Start a new visit to answer separately.');
 const old=w.answers[q.id];if(old!==undefined&&(!obj(old)||(old.first!==undefined&&!validHatAnswer(old.first))||(old.latest!==undefined&&!validHatAnswer(old.latest))||(old.skipped!==undefined&&!validHatSkip(old.skipped))))return result(false,'This earlier item is retained exactly. Other questions stay open; start a new visit for a separate answer.');
 if(!old&&Object.keys(w.answers).length>=5)return result(false,'Five question records are kept. Download notes or start another visit.');
 const a={source:copy(w.source),itemId:q.id,choice,outcome:choice===q.key?'fits':'again',feedback:c.feedback};if(w.support!==undefined)a.helpBefore=copy(w.support);
 const slot=w.answers[q.id]??={};if(!slot.first)slot.first=copy(a);else slot.latest=copy(a);return {...result(true),answer:copy(a)};
 },o);}
export const skipHat=(s,o={})=>workChange(s,w=>{
 if(!record(w.answers))return result(false,'Earlier answers are retained. Start another visit to make new question notes.');
 const old=w.answers[w.question];if(old!==undefined&&(!obj(old)||(old.first!==undefined&&!validHatAnswer(old.first))||(old.latest!==undefined&&!validHatAnswer(old.latest))||(old.skipped!==undefined&&!validHatSkip(old.skipped))))return result(false,'This item’s earlier answers remain exact; other questions stay open.');
 if(!old&&Object.keys(w.answers).length>=5)return result(false,'Five question records are kept. Download notes or start another visit.');
 const a={source:copy(w.source),itemId:w.question,outcome:'skipped'};if(w.support!==undefined)a.helpBefore=copy(w.support);
 (w.answers[w.question]??={}).skipped=a;return result(true);
 },o);
export const removeHats=(s,key,confirmed,o={})=>change(s,c=>{const r=c.descriptions;if(confirmed!==true||!r||!id(key)||!own(r.visits,key)||!workValid(r.visits[key]))return result(false,'Choose a readable visit and confirm its removal.');delete r.visits[key];if(r.current===key)r.current=null;return result(true);},o);
