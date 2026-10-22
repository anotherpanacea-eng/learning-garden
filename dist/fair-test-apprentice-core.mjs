import {apprenticePages,apprenticeSource} from './fair-test-apprentice-content.mjs';
import {fairView} from './fair-test-core.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),positive=x=>Number.isSafeInteger(x)&&x>0;
const text=(x,max)=>typeof x==='string'&&x.length<=max,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x);
const heights=['low','middle','high'],surfaces=['smooth','rough'],codes=['help','audio','together'];
const values=x=>Array.isArray(x)&&x.length===3&&x.every(n=>Number.isInteger(n)&&n>=0&&n<=30);
const config=(source,key)=>source.model.find(c=>c.id===key);
const pair=(x,s)=>object(x)&&['a','b'].every(k=>!!config(s,x[k]));
export function validApprenticeSource(s){
 if(!object(s)||s.version!==1||!id(s.id)||!text(s.title,120)||!text(s.question,600)||!text(s.claim,600)||!['height','surface'].includes(s.mission)||!Array.isArray(s.model)||s.model.length!==6)return false;
 if(!s.model.every(c=>object(c)&&heights.includes(c.height)&&surfaces.includes(c.surface)&&c.id===`${c.height}-${c.surface}`&&values(c.distances)&&c.unit==='model-cm'&&c.source==='authored-ramp')||new Set(s.model.map(c=>c.id)).size!==6||!pair(s.original,s))return false;
 return Array.isArray(s.cards)&&s.cards.length===4&&s.cards.every(c=>object(c)&&id(c.id)&&text(c.text,600)&&typeof c.fits==='boolean'&&text(c.feedback,1200))&&new Set(s.cards.map(c=>c.id)).size===4;
}
const chosen=(s,x)=>x===null||s.cards.some(c=>c.id===x);
const input=(x,s)=>pair(x,s)&&chosen(s,x.card)&&text(x.words,800);
// Historical outputs are bounded records, never regraded or compared with current metadata.
function validCheck(c,s){
 if(!object(c)||!['demonstration','card','words'].includes(c.kind)||!input(c.input,s)||!text(c.feedback,1200))return false;
 if(c.kind==='demonstration')return object(c.values)&&values(c.values.a)&&values(c.values.b)&&typeof c.focused==='boolean'&&c.card===null;
 if(c.values!==null||c.focused!==null)return false;
 if(c.kind==='words')return c.card===null;
 return object(c.card)&&s.cards.some(x=>x.id===c.card.id)&&text(c.card.text,600)&&typeof c.card.fits==='boolean'&&text(c.card.feedback,1200);
}
export function validApprenticeRound(r){
 if(!object(r)||!positive(r.id)||!validApprenticeSource(r.source)||typeof r.familiar!=='boolean'||!pair(r.repair,r.source)||!chosen(r.source,r.selectedCard)||!text(r.words,800))return false;
 const s=r.source;if(!['a','b'].every(k=>config(s,r.repair[k])[s.mission]===config(s,s.original[k])[s.mission]))return false;
 return Array.isArray(r.support)&&r.support.length<=3&&r.support.every(c=>codes.includes(c))&&new Set(r.support).size===r.support.length&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(c=>validCheck(c,s));
}
export function apprenticeView(state){
 const parent=fairView(state),root=state.fairTests?.apprentice,base={root,rounds:[],earlier:[],current:null,page:'notice',open:state.fairTests?.apprenticeOpen===true};
 if(parent.status==='unavailable')return {...base,status:'unavailable'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!apprenticePages.includes(root.page)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],seen=new Set();for(const r of root.rounds){if(validApprenticeRound(r)&&!seen.has(r.id)){rounds.push(r);seen.add(r.id);}else earlier.push(r);}
 return {...base,status:'ready',rounds,earlier,current:rounds.find(r=>r.id===root.current)||rounds.at(-1)||null,page:root.page};
}
function bench(state){const v=fairView(state);if(v.status==='unavailable')return null;if(v.status==='missing')state.fairTests={version:1,page:'plan',current:1,nextId:1,seen:false,investigations:[]};return state.fairTests;}
export function setApprenticeOpen(state,open){if(typeof open!=='boolean'||fairView(state).status==='unavailable')return false;if(!open&&state.fairTests===undefined)return true;bench(state).apprenticeOpen=open;return true;}
export function startApprentice(state,key){
 const source=apprenticeSource(key),v=apprenticeView(state);if(!source||v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'notice',current:1,nextId:1,seen:[],rounds:[]};let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const r={id:next,source,repair:{...source.original},selectedCard:null,words:'',support:[],familiar:root.seen.includes(key),checks:[]};
 const drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));root.rounds=root.rounds.filter(x=>!drop.has(x));root.rounds.push(r);root.current=next;root.nextId=next+1;root.page='notice';if(!root.seen.includes(key))root.seen.push(key);
 const parent=bench(state);parent.apprentice=root;parent.apprenticeOpen=true;return r;
}
const active=state=>apprenticeView(state).current;
export function setApprenticePage(state,page){if(!apprenticePages.includes(page)||!active(state))return false;state.fairTests.apprentice.page=page;return true;}
export function changeApprenticeRepair(state,side,key){const r=active(state);if(!r||!['a','b'].includes(side))return false;const c=config(r.source,key),old=config(r.source,r.source.original[side]);if(!c||c[r.source.mission]!==old[r.source.mission])return false;r.repair[side]=key;return true;}
export function chooseApprenticeCard(state,key){const r=active(state);if(!r||!chosen(r.source,key))return false;r.selectedCard=key;return true;}
export function setApprenticeWords(state,words){const r=active(state);if(!r||!text(words,800))return false;r.words=words;return true;}
export function addApprenticeSupport(state,code){const r=active(state);if(!r||!codes.includes(code))return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function resumeApprentice(state,id){const v=apprenticeView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
const snapshot=r=>({a:r.repair.a,b:r.repair.b,card:r.selectedCard,words:r.words});
const record=(r,c)=>{r.checks.push(c);r.checks=r.checks.slice(-8);return c;};
export function apprenticeDemonstration(source,repair){
 const a=config(source,repair.a),b=config(source,repair.b),target=source.mission,other=target==='height'?'surface':'height';
 const focused=a[target]!==b[target]&&a[other]===b[other];
 return {values:{a:[...a.distances],b:[...b.distances]},focused,feedback:focused?`Moss: The ${other} stays the same and ${target} changes. This comparison isolates ${target} within our authored model. These examples are not a promise about every real cart.`:`Moss: This comparison does not isolate ${target}. Keep ${other} the same while the ${target} settings differ. The original shown distances remain observations.`};
}
export function checkApprenticeDemonstration(state){const r=active(state);if(!r)return null;return record(r,{kind:'demonstration',input:snapshot(r),...apprenticeDemonstration(r.source,r.repair),card:null});}
export function checkApprenticeCard(state){const r=active(state),card=r?.source.cards.find(c=>c.id===r.selectedCard);if(!card)return null;return record(r,{kind:'card',input:snapshot(r),values:null,focused:null,card:structuredClone(card),feedback:card.feedback});}
export function keepApprenticeWords(state){const r=active(state);if(!r)return null;return record(r,{kind:'words',input:snapshot(r),values:null,focused:null,card:null,feedback:'Your exact words are kept for a person to read. The app has not assessed their meaning or quality.'});}
export function apprenticeCheckMatches(r,c){if(!c)return false;return c.kind==='demonstration'?r.repair.a===c.input.a&&r.repair.b===c.input.b:c.kind==='card'?r.selectedCard===c.input.card:r.words===c.input.words;}
