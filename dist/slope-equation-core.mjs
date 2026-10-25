import {priceCards} from './slope-equation-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const clone=x=>structuredClone(x),obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),str=(x,n=800)=>typeof x==='string'&&x.length<=n;
const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const id=x=>str(x,80)&&/^[a-z][a-z0-9-]*$/.test(x)&&!['constructor','prototype','tostring','valueof'].includes(x);
const model=x=>obj(x)&&int(x.m,1,3)&&int(x.b,0,3)&&6*x.m+x.b<=20;
export const priceTotal=(s,x)=>s.m*x+s.b;
export function validPriceSource(s){return model(s)&&id(s.id)&&str(s.title,100)&&s.title.length>0&&int(s.target,0,20)&&int((s.target-s.b)/s.m,0,6)&&model(s.comparison)&&str(s.comparison.title,100)&&str(s.comparison.explanation,800)&&(s.carryDistance===undefined||int(s.carryDistance,0,6));}
const help=h=>Array.isArray(h)&&h.every(x=>str(x,80));
const drafts=d=>obj(d)&&['m','b','distance'].every(k=>str(d[k],40))&&str(d.note,800);
const check=c=>obj(c)&&['rule','distance'].includes(c.kind)&&obj(c.raw)&&Object.values(c.raw).every(x=>str(x,40))&&['match','different'].includes(c.outcome)&&str(c.feedback,1000)&&help(c.helpSeenBefore)&&c.supported===true;
const snapshot=k=>obj(k)&&validPriceSource(k.source)&&drafts(k.drafts)&&help(k.help)&&Array.isArray(k.checks)&&k.checks.every(check)&&int(k.page,0,3)&&int(k.x,0,6)&&['blank','typed'].includes(k.noteKind);
export function validPriceWork(w){return obj(w)&&validPriceSource(w.source)&&int(w.page,0,3)&&int(w.x,0,6)&&drafts(w.drafts)&&help(w.help)&&Array.isArray(w.checks)&&w.checks.every(check)&&(w.kept===undefined||snapshot(w.kept))&&(w.firstKept===undefined||snapshot(w.firstKept));}
function wrapper(s){return obj(s?.slopeBench)&&s.slopeBench.version===1&&obj(s.slopeBench.cases)&&str(s.slopeBench.currentId,80);}
export function priceView(state){
 if(!Object.hasOwn(state,'slopeBench'))return {status:'missing',work:null,cards:priceCards.map(s=>({id:s.id,title:s.title}))};
 if(!wrapper(state))return {status:'unavailable',work:null,cards:[]};
 const r=state.slopeBench,cards=priceCards.map(s=>({id:s.id,title:s.title,unreadable:Object.hasOwn(r.cases,s.id)&&!validPriceWork(r.cases[s.id])}));
 for(const [key,w] of Object.entries(r.cases))if(id(key)&&!priceCards.some(s=>s.id===key)&&validPriceWork(w))cards.push({id:key,title:`Saved card: ${w.source.title}`});
 const w=Object.hasOwn(r.cases,r.currentId)?r.cases[r.currentId]:null;
 return {status:'ready',work:validPriceWork(w)?w:null,cards};
}
function fits(s,o){return recoveryFitsProgressLimits(s)&&(!o.canExport||o.canExport(s)===true);}
function change(state,fn,o={}){try{if(Object.hasOwn(state,'slopeBench')&&!wrapper(state))return false;const candidate=clone(state),result=fn(candidate);if(!result||!wrapper(candidate)||!fits(candidate,o))return false;state.slopeBench=candidate.slopeBench;return result;}catch{return false;}}
export function startPrice(state,key,o={}){if(!id(key))return false;return change(state,s=>{s.slopeBench??={version:1,currentId:'',cases:{}};const r=s.slopeBench;if(Object.hasOwn(r.cases,key)){if(!validPriceWork(r.cases[key]))return false;}else{const source=priceCards.find(x=>x.id===key);if(!source)return false;r.cases[key]={source:clone(source),page:0,x:0,drafts:{m:'',b:'',distance:'',note:''},help:[],checks:[]};}r.currentId=key;return true;},o);}
function workChange(state,fn,o){return change(state,s=>{const w=priceView(s).work;return w?fn(w):false;},o);}
export const setPricePage=(s,n,o={})=>int(n,0,3)&&workChange(s,w=>{w.page=n;return true;},o);
export const setPriceX=(s,n,o={})=>int(n,0,6)&&workChange(s,w=>{w.x=n;return true;},o);
export const setPriceField=(s,k,v,o={})=>['m','b','distance','note'].includes(k)&&str(v,k==='note'?800:40)&&workChange(s,w=>{w.drafts[k]=v;return true;},o);
export const showPriceHelp=(s,o={})=>workChange(s,w=>{const code=`page-${w.page}`;if(!w.help.includes(code))w.help.push(code);return true;},o);
export function priceInteger(v){return typeof v==='string'&&/^\d{1,4}$/.test(v.trim())?Number(v.trim()):null;}
export function evaluatePrice(source,kind,d){
 const bad=feedback=>({outcome:'uncheckable',feedback});
 if(!validPriceSource(source))return bad('This saved price card cannot be checked here.');
 const {m,b,target}=source;
 if(kind==='rule'){
  const a=priceInteger(d.m),c=priceInteger(d.b);if(c===null&&d.b?.trim()==='')return bad('Use 0 for no starting charge. Enter whole numbers without units.');if(a===null||c===null)return bad('Enter whole numbers from 0 to 9999, without units, signs or decimals.');
  let feedback;if(a===m&&c===b)return {outcome:'match',feedback:`This rule fits the card: y = ${m} × x + ${b}. Each kilometer adds ${m} coins; the starting charge is ${b} coins.`};
  if(a===b&&c===m)feedback='The rate and starting charge are swapped. m is the amount added for each kilometer; b is the amount at zero kilometers.';
  else if(a===m)feedback='The rate matches. Look at the total at zero kilometers to find the starting charge.';
  else if(c===b)feedback='The starting charge matches. Compare two distances one kilometer apart to find how much the total changes.';
  else if(a===m+b)feedback='That is the total at one kilometer, including the starting charge. The slope is only the extra cost for one more kilometer.';
  else if(a===target)feedback='That number is a total price. The slope describes the change in total for one extra kilometer.';
  else feedback='Compare zero kilometers with one kilometer: which amount stays fixed, and which amount is added again?';
  return {outcome:'different',feedback};
 }
 if(kind!=='distance')return bad('Choose a question to check.');
 const n=priceInteger(d.distance);if(n===null)return bad('Enter a whole-number distance without units, signs or decimals.');
 if(priceTotal(source,n)===target)return {outcome:'match',feedback:`${n} kilometers fits: ${m} × ${n} + ${b} = ${target} coins. One input makes this particular total.`};
 let feedback;if(n===target)feedback='That is the total in coins, rather than the distance. Remove the starting charge, then share the rest into the per-kilometer groups.';
 else if(n===target-b)feedback=`You removed the starting charge. Now divide those ${target-b} coins by ${m} coins per kilometer.`;
 else if(source.carryDistance!==undefined&&n===source.carryDistance)feedback=`Check this card’s own rate and starting charge: ${m} × ${n} + ${b} = ${priceTotal(source,n)} coins, rather than ${target}.`;
 else if(n>6)feedback='That distance is outside this card’s model.';
 else feedback=`At ${n} kilometers this card gives ${m} × ${n} + ${b} = ${priceTotal(source,n)} coins. Compare that with ${target} coins.`;
 if(n>6)feedback+=' The model covers 0–6 kilometers.';
 return {outcome:'different',feedback};
}
export function checkPrice(state,kind,o={}){const w=priceView(state).work;if(!w)return false;const answer=evaluatePrice(w.source,kind,w.drafts);if(answer.outcome==='uncheckable')return {...answer,recorded:false};return workChange(state,c=>{const record={kind,raw:kind==='rule'?{m:c.drafts.m,b:c.drafts.b}:{distance:c.drafts.distance},...answer,helpSeenBefore:clone(c.help),supported:true};c.checks=[...c.checks,record].slice(-24);return {...record,recorded:true};},o);}
export const keepPrice=(s,o={})=>workChange(s,w=>{const k={source:clone(w.source),drafts:clone(w.drafts),help:clone(w.help),checks:clone(w.checks),page:w.page,x:w.x,noteKind:w.drafts.note.trim()?'typed':'blank'};w.firstKept??=clone(k);w.kept=k;return true;},o);
export function priceFacts(state){const w=priceView(state).work;if(!w)return [];const rates=[w.source.m,...(w.page===3?[w.source.comparison.m]:[])],pairs=new Map();for(const m of rates)for(let x=1;x<=6;x++)for(const pair of [[m,x],[x,m]])pairs.set(pair.join('x'),pair);return [...pairs.values()];}
// Preflight the exact existing host exposure operation, then apply it to the same
// notebook synchronously. This preserves other games' object references.
export function preparePriceDisplay(state,o={}){const facts=priceFacts(state);if(!facts.length)return {ok:true,changed:false};try{const candidate=clone(state);o.exposeFacts?.(facts,candidate);if(!fits(candidate,o))return {ok:false,changed:false};const before=JSON.stringify(state);o.exposeFacts?.(facts,state);return {ok:true,changed:JSON.stringify(state)!==before};}catch{return {ok:false,changed:false};}}
