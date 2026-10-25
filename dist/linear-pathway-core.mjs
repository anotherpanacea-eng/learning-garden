import {linearLessons,linearRecommendations} from './linear-pathway-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const clone=x=>structuredClone(x),obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),str=(x,n=1800)=>typeof x==='string'&&x.length<=n;
const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const id=x=>str(x,80)&&/^[a-z][a-z0-9-]*$/.test(x)&&!['constructor','prototype','tostring','valueof'].includes(x);
const list=(x,fn,n=24)=>Array.isArray(x)&&x.length<=n&&x.every(fn);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const rational=(n,d)=>{const g=gcd(Math.abs(n),d);return {n:n/g,d:d/g};};
export function parseLinearNumber(raw){
 if(!str(raw,40))return null;const s=raw.trim();let n,d;
 if(/^[+-]?\d{1,4}\/\d{1,4}$/.test(s)){const parts=s.split('/');n=Number(parts[0]);d=Number(parts[1]);if(d<1||d>1000)return null;}
 else if(/^[+-]?\d{1,4}(?:\.\d{1,3})?$/.test(s)){const sign=s.startsWith('-')?-1:1,t=s.replace(/^[+-]/,'').split('.');d=t[1]?10**t[1].length:1;n=sign*(Number(t[0])*d+Number(t[1]||0));}
 else return null;
 if(Math.abs(n/d)>1000)return null;return rational(n,d);
}
const eq=(a,b)=>a.n*b.d===b.n*a.d;
export const formatLinearNumber=q=>q.d===1?String(q.n):`${q.n}/${q.d}`;
export function linearValue(model,x){const a=parseLinearNumber(model.m),b=parseLinearNumber(model.b);return rational(a.n*x*b.d+b.n*a.d,a.d*b.d);}
const valueBound=q=>q&&q.n>=-6*q.d&&q.n<=16*q.d;
const model=m=>obj(m)&&parseLinearNumber(m.m)!==null&&parseLinearNumber(m.b)!==null&&str(m.title,160)&&str(m.xUnit,80)&&str(m.yUnit,80)&&valueBound(linearValue(m,0))&&valueBound(linearValue(m,6));
const item=i=>obj(i)&&id(i.id)&&int(i.page,1,3)&&str(i.prompt)&&list(i.fields,f=>obj(f)&&id(f.id)&&str(f.label,160)&&parseLinearNumber(f.answer)!==null,6)&&i.fields.length>0&&new Set(i.fields.map(f=>f.id)).size===i.fields.length&&list(i.guidance,t=>str(t),8)&&str(i.hint)&&str(i.example)&&str(i.explanation);
export function validLinearSource(s){return obj(s)&&id(s.id)&&str(s.title,160)&&str(s.idea)&&list(s.teach,t=>str(t),8)&&s.teach.length>0&&model(s.model)&&(s.model.comparison===undefined||obj(s.model.comparison)&&Object.hasOwn(s.model.comparison,'m')&&Object.hasOwn(s.model.comparison,'b')&&parseLinearNumber(s.model.comparison.m)!==null&&parseLinearNumber(s.model.comparison.b)!==null&&model({...s.model,...s.model.comparison}))&&(s.bridge===undefined||['numberline','halves'].includes(s.bridge))&&list(s.items,item,8)&&s.items.length>0&&new Set(s.items.map(i=>i.id)).size===s.items.length;}
const rawFields=x=>obj(x)&&Object.keys(x).length<=6&&Object.entries(x).every(([k,v])=>id(k)&&str(v,40));
const drafts=x=>obj(x)&&Object.keys(x).length<=8&&Object.entries(x).every(([k,v])=>id(k)&&rawFields(v));
const helps=x=>obj(x)&&Object.keys(x).length<=8&&Object.entries(x).every(([k,v])=>id(k)&&list(v,t=>['hint','example'].includes(t),2)&&new Set(v).size===v.length);
const check=c=>obj(c)&&item(c.item)&&rawFields(c.raw)&&list(c.helpBefore,t=>['hint','example'].includes(t),2)&&['match','different'].includes(c.outcome)&&str(c.feedback,6000)&&c.supported===true&&int(c.page,0,3);
const checksMap=x=>obj(x)&&Object.keys(x).length<=8&&Object.entries(x).every(([k,c])=>id(k)&&check(c));
const skip=k=>obj(k)&&id(k.itemId)&&int(k.page,0,3)&&list(k.helpBefore,t=>['hint','example'].includes(t),2);
const recommendation=x=>linearRecommendations.some(([code])=>code===x);
const snapshot=w=>obj(w)&&validLinearSource(w.source)&&int(w.page,0,3)&&int(w.x,0,6)&&drafts(w.drafts)&&helps(w.help)&&list(w.checks,check)&&checksMap(w.firstChecks)&&list(w.skips,skip)&&list(w.visited,x=>int(x,0,3),4)&&str(w.note,1200)&&(w.recommendation===''||id(w.recommendation));
export const validLinearWork=w=>snapshot(w)&&(w.firstKept===undefined||snapshot(w.firstKept))&&(w.kept===undefined||snapshot(w.kept));
const wrapper=s=>obj(s?.linearPathway)&&s.linearPathway.version===1&&obj(s.linearPathway.lessons)&&str(s.linearPathway.currentId,80);
export function linearView(state){
 if(!Object.hasOwn(state,'linearPathway'))return {status:'missing',work:null,lessons:linearLessons.map(s=>({id:s.id,title:s.title}))};
 if(!wrapper(state))return {status:'unavailable',work:null,lessons:[]};
 const r=state.linearPathway,lessons=linearLessons.map(s=>({id:s.id,title:s.title,unreadable:Object.hasOwn(r.lessons,s.id)&&!validLinearWork(r.lessons[s.id])}));
 for(const [key,w] of Object.entries(r.lessons))if(id(key)&&!linearLessons.some(s=>s.id===key)&&validLinearWork(w))lessons.push({id:key,title:`Saved lesson: ${w.source.title}`});
 const w=Object.hasOwn(r.lessons,r.currentId)?r.lessons[r.currentId]:null;return {status:'ready',work:validLinearWork(w)?w:null,lessons};
}
const fits=(s,o)=>recoveryFitsProgressLimits(s)&&typeof o.canExport==='function'&&o.canExport(s)===true;
function change(state,fn,o={}){try{if(Object.hasOwn(state,'linearPathway')&&!wrapper(state))return false;const candidate=clone(state),result=fn(candidate);if(!result||!wrapper(candidate)||!fits(candidate,o))return false;state.linearPathway=candidate.linearPathway;return result;}catch{return false;}}
function workChange(s,fn,o){return change(s,c=>{const w=linearView(c).work;return w?fn(w):false;},o);}
export function startLinear(s,key,o={}){if(!id(key))return false;return change(s,c=>{c.linearPathway??={version:1,currentId:'',lessons:{}};const r=c.linearPathway;if(Object.hasOwn(r.lessons,key)){if(!validLinearWork(r.lessons[key]))return false;}else{const source=linearLessons.find(t=>t.id===key);if(!source)return false;r.lessons[key]={source:clone(source),page:0,x:0,drafts:{},help:{},checks:[],firstChecks:{},skips:[],visited:[0],note:'',recommendation:''};}r.currentId=key;return true;},o);}
export const setLinearPage=(s,n,o={})=>int(n,0,3)&&workChange(s,w=>{w.page=n;if(!w.visited.includes(n))w.visited.push(n);return true;},o);
export const setLinearX=(s,n,o={})=>int(n,0,6)&&workChange(s,w=>{w.x=n;return true;},o);
export const setLinearField=(s,k,f,v,o={})=>id(k)&&id(f)&&str(v,40)&&workChange(s,w=>{const i=w.source.items.find(t=>t.id===k);if(!i?.fields.some(t=>t.id===f))return false;w.drafts[k]??={};w.drafts[k][f]=v;return true;},o);
export const showLinearHelp=(s,k,kind,o={})=>['hint','example'].includes(kind)&&workChange(s,w=>{if(!w.source.items.some(i=>i.id===k))return false;w.help[k]??=[];if(!w.help[k].includes(kind))w.help[k].push(kind);return true;},o);
export function evaluateLinear(source,key,raw={}){
 const bad=feedback=>({outcome:'uncheckable',feedback});if(!validLinearSource(source))return bad('This earlier lesson cannot be checked here.');const i=source.items.find(t=>t.id===key);if(!i)return bad('Choose an item to check.');if(!obj(raw))return bad('Enter values in the labeled fields.');
 const parsed=i.fields.map(f=>parseLinearNumber(raw[f.id]??''));if(parsed.some(x=>x===null))return bad('Use a signed number, a decimal with up to 3 decimal places, or a fraction such as -3/2 (positive denominator). Type a minus with the - key. No units or expressions. Keep values between -1000 and 1000.');
 const matched=i.fields.filter((f,n)=>eq(parsed[n],parseLinearNumber(f.answer)));
 if(matched.length===i.fields.length)return {outcome:'match',feedback:`These values fit. ${i.explanation}`};
 return {outcome:'different',feedback:`${matched.length?`Fitting field${matched.length===1?'':'s'}: ${matched.map(f=>f.label).join('; ')}. `:''}Check the other values against this lesson’s rule. Revisit Together, or choose Hint or Different example for support.`};
}
export function checkLinear(s,k,o={}){const w=linearView(s).work;if(!w)return false;const result=evaluateLinear(w.source,k,w.drafts[k]);if(result.outcome==='uncheckable')return {...result,recorded:false};return workChange(s,c=>{const i=c.source.items.find(t=>t.id===k),record={item:clone(i),raw:Object.fromEntries(i.fields.map(f=>[f.id,c.drafts[k]?.[f.id]??''])),helpBefore:clone(c.help[k]||[]),page:c.page,...result,supported:true};c.firstChecks[k]??=clone(record);c.checks=[...c.checks,record].slice(-24);return {...record,recorded:true};},o);}
export const skipLinear=(s,k,o={})=>workChange(s,w=>{if(!w.source.items.some(i=>i.id===k))return false;w.skips=[...w.skips,{itemId:k,page:w.page,helpBefore:clone(w.help[k]||[])}].slice(-24);return true;},o);
export const setLinearNote=(s,v,o={})=>str(v,1200)&&workChange(s,w=>{w.note=v;return true;},o);
export const setLinearRecommendation=(s,v,o={})=>recommendation(v)&&workChange(s,w=>{w.recommendation=v;return true;},o);
export const keepLinear=(s,o={})=>workChange(s,w=>{const {firstKept,kept,...k}=w;w.firstKept??=clone(k);w.kept=clone(k);return true;},o);
export function linearFacts(s){const w=linearView(s).work;if(!w)return [];const pairs=new Map(),add=(a,b)=>{if(int(a,1,12)&&int(b,1,12))for(const p of [[a,b],[b,a]])pairs.set(p.join('x'),p);};const models=[w.source.model,...(w.source.model.comparison?[w.source.model.comparison]:[])];for(const m of models){const q=parseLinearNumber(m.m);if(q&&q.d===1&&q.n>0)for(let x=1;x<=6;x++)add(q.n,x);}if(w.source.id==='equal'&&w.page<2)add(2,4);return [...pairs.values()];}
export function prepareLinearDisplay(s,o={}){try{if(linearLessons.some(t=>t.id===o.entryLesson)&&s.linearPathway?.currentId!==o.entryLesson)return {ok:true,changed:false};const facts=linearFacts(s);if(!facts.length)return {ok:true,changed:false};const candidate=clone(s);o.exposeFacts?.(facts,candidate);if(!fits(candidate,o))return {ok:false,changed:false};const before=JSON.stringify(s);o.exposeFacts?.(facts,s);return {ok:true,changed:JSON.stringify(s)!==before};}catch{return {ok:false,changed:false};}}
