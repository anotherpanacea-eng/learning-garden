import {windowPages,windowRelations,windowSource} from './two-windows-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const positive=x=>Number.isSafeInteger(x)&&x>0;
const text=(x,max)=>typeof x==='string'&&x.length<=max;
const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x);
const relation=x=>windowRelations.some(r=>r.id===x);
const report=x=>['unobserved','together','reported-independent'].includes(x);
const supportCodes=['help','audio','together','example'];
const ids=(x,max)=>Array.isArray(x)&&x.length<=max&&x.every(id)&&new Set(x).size===x.length;
export const sourceLines=s=>s.accounts.flatMap(a=>a.lines);
export function validWindowSource(s){
 if(!object(s)||s.version!==1||!id(s.id)||!['short','long'].includes(s.form)||!text(s.title,120)||!text(s.focus,300)||!Array.isArray(s.accounts)||s.accounts.length!==2)return false;
 if(!['a','b'].every(key=>s.accounts.some(a=>object(a)&&a.id===key&&text(a.name,80)&&Array.isArray(a.lines)&&a.lines.length>=3&&a.lines.length<=5&&a.lines.every(l=>object(l)&&id(l.id)&&text(l.text,600)))))return false;
 const lines=sourceLines(s),lineIds=lines.map(l=>l.id);if(new Set(lineIds).size!==lines.length)return false;
 if(!Array.isArray(s.claims)||s.claims.length!==4||!s.claims.every(c=>object(c)&&id(c.id)&&text(c.text,600)&&relation(c.kind)&&text(c.explanation,1200)&&Array.isArray(c.groups)&&c.groups.length<=12&&c.groups.every(g=>ids(g,10)&&g.length>0&&g.every(k=>lineIds.includes(k))))||new Set(s.claims.map(c=>c.id)).size!==4)return false;
 const r=s.reader;return object(r)&&text(r.name,80)&&['a','b'].includes(r.knows)&&text(r.question,600)&&text(r.original,600)&&Array.isArray(r.cards)&&r.cards.length===4&&r.cards.every(c=>object(c)&&id(c.id)&&text(c.text,600)&&typeof c.fits==='boolean'&&text(c.feedback,1200))&&new Set(r.cards.map(c=>c.id)).size===4;
}
const validClaimCheck=(c,s)=>object(c)&&s.claims.some(x=>x.id===c.claim)&&relation(c.classification)&&relation(c.expected)&&ids(c.lines,10)&&ids(c.used,10)&&[...c.lines,...c.used].every(k=>sourceLines(s).some(l=>l.id===k))&&typeof c.classificationFits==='boolean'&&(typeof c.evidenceFits==='boolean'||c.evidenceFits===null)&&text(c.feedback,1200);
const validMessageCheck=(c,s)=>object(c)&&(c.card===null||s.reader.cards.some(x=>x.id===c.card))&&text(c.text,600)&&text(c.words,1200)&&(typeof c.fits==='boolean'||c.fits===null)&&text(c.feedback,1200);
export function validWindowRound(r){
 if(!object(r)||!positive(r.id)||!validWindowSource(r.source)||typeof r.familiar!=='boolean'||!r.source.claims.some(c=>c.id===r.currentClaim)||!object(r.answers))return false;
 const lineIds=sourceLines(r.source).map(l=>l.id);
 return r.source.claims.every(c=>{const a=r.answers[c.id];return object(a)&&(a.classification===null||relation(a.classification))&&ids(a.lines,10)&&a.lines.every(k=>lineIds.includes(k));})&&(r.selectedCard===null||r.source.reader.cards.some(c=>c.id===r.selectedCard))&&text(r.words,1200)&&report(r.reading)&&Array.isArray(r.support)&&r.support.length<=4&&r.support.every(c=>supportCodes.includes(c))&&new Set(r.support).size===r.support.length&&Array.isArray(r.claimChecks)&&r.claimChecks.length<=8&&r.claimChecks.every(c=>validClaimCheck(c,r.source))&&Array.isArray(r.messageChecks)&&r.messageChecks.length<=8&&r.messageChecks.every(c=>validMessageCheck(c,r.source));
}
export function windowsView(state){
 const root=state.twoWindows,base={root,rounds:[],earlier:[],current:null,page:'read',account:'a'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!windowPages.includes(root.page)||!['a','b'].includes(root.account)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],seen=new Set();for(const r of root.rounds){if(validWindowRound(r)&&!seen.has(r.id)){rounds.push(r);seen.add(r.id);}else earlier.push(r);}
 return {status:'ready',root,rounds,earlier,current:rounds.find(r=>r.id===root.current)||rounds.at(-1)||null,page:root.page,account:root.account};
}
const newRoot=()=>({version:1,page:'read',account:'a',current:1,nextId:1,seen:[],rounds:[]});
export function startWindows(state,caseId,form='short'){
 const source=windowSource(caseId,form),v=windowsView(state);if(!source||v.status==='unavailable')return null;const root=v.root||newRoot();let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const frozen=structuredClone(source),r={id:next,source:frozen,familiar:root.seen.includes(source.id),currentClaim:frozen.claims[0].id,answers:Object.fromEntries(frozen.claims.map(c=>[c.id,{classification:null,lines:[]}])),selectedCard:null,words:'',reading:'unobserved',support:[],claimChecks:[],messageChecks:[]};
 const drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));root.rounds=root.rounds.filter(x=>!drop.has(x));root.rounds.push(r);root.current=next;root.nextId=next+1;root.page='read';root.account='a';if(!root.seen.includes(source.id))root.seen.push(source.id);state.twoWindows=root;return r;
}
const active=state=>windowsView(state).current;
export function setWindowsPage(state,page){if(!windowPages.includes(page)||windowsView(state).status==='unavailable')return false;if(!state.twoWindows)state.twoWindows=newRoot();state.twoWindows.page=page;return true;}
export function setWindowsAccount(state,account){if(!['a','b'].includes(account)||!active(state))return false;state.twoWindows.account=account;return true;}
export function chooseWindowClaim(state,id){const r=active(state);if(!r?.source.claims.some(c=>c.id===id))return false;r.currentClaim=id;return true;}
export function nextWindowClaim(state){const r=active(state);if(!r)return null;const i=r.source.claims.findIndex(c=>c.id===r.currentClaim);return r.source.claims[(i+1)%r.source.claims.length].id;}
export function chooseWindowRelation(state,value){const r=active(state);if(!r||(value!==null&&!relation(value)))return false;r.answers[r.currentClaim].classification=value;return true;}
export function toggleWindowLine(state,id){const r=active(state);if(!r||!sourceLines(r.source).some(l=>l.id===id))return false;const a=r.answers[r.currentClaim];a.lines=a.lines.includes(id)?a.lines.filter(k=>k!==id):[...a.lines,id];return true;}
export function chooseWindowCard(state,id){const r=active(state);if(!r||(id!==null&&!r.source.reader.cards.some(c=>c.id===id)))return false;r.selectedCard=id;return true;}
export function setWindowWords(state,value){const r=active(state);if(!r||!text(value,1200))return false;r.words=value;return true;}
export function setWindowReading(state,value){const r=active(state);if(!r||!report(value))return false;r.reading=value;return true;}
export function addWindowSupport(state,code){const r=active(state);if(!r||!supportCodes.includes(code))return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function resumeWindows(state,id){const v=windowsView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
// New explicit checks use the visit's frozen authored metadata, never today's catalog.
export function evaluateWindowClaim(source,claimId,answer){
 const c=source.claims.find(c=>c.id===claimId);if(!c||!relation(answer?.classification))return null;
 const match=c.groups.find(group=>group.every(k=>answer.lines.includes(k))),useful=new Set(c.groups.flat());
 return {claim:claimId,classification:answer.classification,lines:[...answer.lines],expected:c.kind,classificationFits:answer.classification===c.kind,evidenceFits:c.kind==='unknown'?null:!!match,used:c.kind==='unknown'?[]:match?[...match]:answer.lines.filter(k=>useful.has(k)),feedback:c.explanation};
}
export function checkWindowClaim(state){const r=active(state);if(!r)return null;const c=evaluateWindowClaim(r.source,r.currentClaim,r.answers[r.currentClaim]);if(!c)return null;r.claimChecks.push(c);r.claimChecks=r.claimChecks.slice(-8);return c;}
export function checkWindowMessage(state){const r=active(state),card=r?.source.reader.cards.find(c=>c.id===r.selectedCard);if(!card)return null;const c={card:card.id,text:card.text,words:r.words,fits:card.fits,feedback:card.feedback};r.messageChecks.push(c);r.messageChecks=r.messageChecks.slice(-8);return c;}
export function keepWindowWords(state){const r=active(state);if(!r)return null;const c={card:null,text:'',words:r.words,fits:null,feedback:'These are your words for a person to read. The app has not assessed their meaning or quality.'};r.messageChecks.push(c);r.messageChecks=r.messageChecks.slice(-8);return c;}
const sameSet=(a,b)=>a.length===b.length&&a.every(k=>b.includes(k));
export function windowClaimMatches(r,c=r.claimChecks.at(-1)){if(!c||c.claim!==r.currentClaim)return false;const a=r.answers[r.currentClaim];return a.classification===c.classification&&sameSet(a.lines,c.lines);}
export function windowMessageMatches(r,c=r.messageChecks.at(-1)){return !!c&&r.words===c.words&&(c.card===null||r.selectedCard===c.card);}
