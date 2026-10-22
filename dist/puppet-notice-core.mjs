import {noticeCases} from './puppet-notice-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),clone=structuredClone;
const safe=x=>Number.isSafeInteger(x)&&x>0,id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(x),bytes=x=>new TextEncoder().encode(x).length;
const text=(x,n)=>typeof x==='string'&&x.length>0&&bytes(x)<=n,mark=x=>[null,'.','?','!'].includes(x);
export const sameNotice=(a,b)=>a===b||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>sameNotice(x,b[i]))||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>own(b,k)&&sameNotice(a[k],b[k]));
const codes=['help','example','narrationRequested','together','modelReply'],support=x=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(k=>codes.includes(k));
const tokens=x=>Array.isArray(x)&&x.length>=2&&x.length<=6&&new Set(x.map(t=>t?.id)).size===x.length&&x.every(t=>object(t)&&id(t.id)&&typeof t.word==='string'&&/^[A-Za-z]{1,24}$/.test(t.word));
const order=(x,ts)=>Array.isArray(x)&&x.length===ts.length&&new Set(x).size===x.length&&x.every(k=>ts.some(t=>t.id===k));
export function validNoticeSource(s){
 if(!object(s)||s.version!==1||s.model!=='word-ticket-v1'||!id(s.id)||!text(s.title,160)||!text(s.purpose,1600)||!tokens(s.tokens)||!order(s.initialOrder,s.tokens)||!object(s.copy)||!object(s.copy.markLabels)||!['intro','help','fallback','unfinished','capitalYes','capitalNo','nameCapitalNote','endingPrefix','responsePrompt'].every(k=>text(s.copy[k],1600))||!['period','question','exclamation','none'].every(k=>text(s.copy.markLabels[k],1600)))return false;
 if(!Array.isArray(s.scripts)||s.scripts.length>12||new Set(s.scripts.map(r=>r?.id)).size!==s.scripts.length||!s.scripts.every(r=>object(r)&&id(r.id)&&order(r.order,s.tokens)&&r.mark!==null&&mark(r.mark)&&['statement','question','surprise'].includes(r.kind)&&typeof r.purposeFit==='boolean'&&text(r.reply,640))||new Set(s.scripts.map(r=>JSON.stringify([r.order,r.mark]))).size!==s.scripts.length)return false;
 const e=s.example;return object(e)&&tokens(e.tokens)&&Array.isArray(e.frames)&&e.frames.length===3&&e.frames.every(f=>object(f)&&order(f.order,e.tokens)&&typeof f.capitalFirst==='boolean'&&mark(f.mark)&&text(f.caption,640)&&(f.reply===null||text(f.reply,640)))&&bytes(JSON.stringify(s))<=16*1024;
}
export function noticeWords(s){const words=s.order.map(k=>s.source.tokens.find(t=>t.id===k).word);if(s.capitalFirst)words[0]=words[0][0].toUpperCase()+words[0].slice(1);return words;}
export function renderNotice(s){return noticeWords(s).join(' ')+(s.mark??'');}
const validSnapshot=s=>object(s)&&validNoticeSource(s.source)&&order(s.order,s.source.tokens)&&typeof s.capitalFirst==='boolean'&&mark(s.mark)&&support(s.support);
const snapshot=w=>clone({source:w.source,order:w.order,capitalFirst:w.capitalFirst,mark:w.mark,support:w.support});
export function noticeResult(s){
 const rendered=renderNotice(s),script=s.source.scripts.find(r=>r.mark===s.mark&&sameNotice(r.order,s.order)),firstCapital=/^[A-Z]/.test(rendered),c=s.source.copy,label=c.markLabels[s.mark==='.'?'period':s.mark==='?'?'question':s.mark==='!'?'exclamation':'none'];
 return {rendered,scriptId:script?.id??null,purposeFit:script?.purposeFit??null,firstCapital,endingCode:s.mark,reply:script?.reply??c.fallback,feedback:[...(s.mark===null?[c.unfinished]:[]),firstCapital?c.capitalYes:c.capitalNo,c.nameCapitalNote,c.endingPrefix+' '+label].join(' ')};
}
function validResponse(r){
 if(!object(r)||!safe(r.id)||!validSnapshot(r.snapshot)||!text(r.rendered,150)||!text(r.reply,1600)||!text(r.feedback,16*1024))return false;
 const expected=noticeResult(r.snapshot);return ['rendered','scriptId','purposeFit','firstCapital','endingCode','reply','feedback'].every(k=>r[k]===expected[k]);
}
function workView(w,key){
 if(!object(w)||!validSnapshot(w)||w.source.id!==key||!['arrange','read','kept'].includes(w.page)||!Array.isArray(w.responses)||!safe(w.nextResponseId)||!(w.feedbackId===null||safe(w.feedbackId)))return null;
 const ids=new Map();for(const r of w.responses)if(safe(r?.id))ids.set(r.id,(ids.get(r.id)||0)+1);
 const readable=w.responses.filter(r=>validResponse(r)&&ids.get(r.id)===1),raw=w.responses.filter(r=>!readable.includes(r)),feedback=readable.find(r=>r.id===w.feedbackId&&sameNotice(r.snapshot,snapshot(w)));
 const kept=w.kept===null?null:object(w.kept)&&validSnapshot(w.kept.snapshot)&&(w.kept.response===null||validResponse(w.kept.response)&&sameNotice(w.kept.snapshot,w.kept.response.snapshot))?w.kept:null;
 return {work:w,readable,raw,feedback,kept,keptUnreadable:w.kept!==null&&!kept};
}
export function noticeView(state){
 if(!own(state,'puppetNotices'))return {status:'missing',cases:[],unreadable:[]};const root=state.puppetNotices;
 if(!object(root)||root.version!==1||!(root.current===null||id(root.current))||!object(root.cases))return {status:'recovery',root,cases:[],unreadable:[]};
 const cases=[],unreadable=[];for(const [key,w] of Object.entries(root.cases)){const v=id(key)&&workView(w,key);if(v)cases.push({id:key,...v});else unreadable.push({id:key,raw:w});}
 return {status:'ready',root,cases,unreadable,...(cases.find(c=>c.id===root.current)||{})};
}
function fits(state,root,canExport){try{const c={...state,puppetNotices:root};return recoveryFitsProgressLimits(c)&&canExport(c)===true;}catch{return false;}}
const fresh=()=>({version:1,current:null,cases:{}});
export function startNotice(state,key,canExport=()=>true){const v=noticeView(state);if(v.status==='recovery'||!id(key))return false;const root=v.status==='missing'?fresh():clone(v.root);if(own(root.cases,key)){if(!workView(root.cases[key],key))return false;}else{const source=noticeCases.find(c=>c.id===key);if(!source)return false;root.cases[key]={source:clone(source),page:'arrange',order:[...source.initialOrder],capitalFirst:false,mark:null,support:[],responses:[],nextResponseId:1,feedbackId:null,kept:null};}root.current=key;if(!fits(state,root,canExport))return false;state.puppetNotices=root;return true;}
function change(state,fn,canExport){const v=noticeView(state);if(!v.work)return false;const root=clone(v.root),w=root.cases[root.current];if(fn(w,v)===false||!workView(w,root.current)||!fits(state,root,canExport))return false;state.puppetNotices=root;return true;}
export function editNotice(state,kind,key,value,canExport=()=>true){return change(state,w=>{if(kind==='page'){if(!['arrange','read','kept'].includes(value))return false;w.page=value;return true;}if(kind==='move'){const at=w.order.indexOf(key),to=at+value;if(![-1,1].includes(value)||at<0||to<0||to>=w.order.length)return false;[w.order[at],w.order[to]]=[w.order[to],w.order[at]];}else if(kind==='capital'){if(typeof value!=='boolean')return false;w.capitalFirst=value;}else if(kind==='mark'){if(!mark(value))return false;w.mark=value;}else return false;w.feedbackId=null;},canExport);}
export function supportNotice(state,kind,canExport=()=>true){return change(state,w=>{if(!codes.includes(kind)||kind==='modelReply')return false;if(!w.support.includes(kind)){w.support.push(kind);w.feedbackId=null;}},canExport);}
export function tryNotice(state,canExport=()=>true){return change(state,(w,v)=>{const occupied=w.responses.reduce((n,r)=>safe(r?.id)?Math.max(n,r.id):n,0),next=Math.max(w.nextResponseId,occupied+1);if(!safe(next)||next>=Number.MAX_SAFE_INTEGER)return false;if(!w.support.includes('modelReply'))w.support.push('modelReply');const s=snapshot(w),r={id:next,snapshot:s,...noticeResult(s)};if(!validResponse(r))return false;const recent=v.readable.slice(-3);w.responses=clone(v.work.responses.filter(x=>v.raw.includes(x)||recent.includes(x)));w.responses.push(r);w.nextResponseId=next+1;w.feedbackId=next;},canExport);}
export function keepNotice(state,replace=false,canExport=()=>true){return change(state,(w,v)=>{if(v.keptUnreadable||w.kept!==null&&!replace)return false;w.kept={snapshot:snapshot(w),response:v.feedback?clone(v.feedback):null};},canExport);}
export function recoverNotice(state,canExport=()=>true){if(!own(state,'puppetNotices'))return false;const root={...fresh(),retainedRaw:clone(state.puppetNotices)};if(!fits(state,root,canExport))return false;state.puppetNotices=root;return true;}
