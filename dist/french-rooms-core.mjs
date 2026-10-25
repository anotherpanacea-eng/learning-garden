import {frenchRoomsLessons} from './french-rooms-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),str=(x,n=6000)=>typeof x==='string'&&x.length<=n;
const id=x=>str(x,80)&&/^[a-z][a-z0-9-]*$/.test(x)&&!['constructor','prototype','tostring','valueof'].includes(x);
const clone=x=>structuredClone(x),ints=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const textKeys=['title','intro','teach','meaning','teachMeaning'];
const choice=c=>obj(c)&&id(c.id)&&str(c.text)&&str(c.meaning)&&['match','different'].includes(c.outcome)&&str(c.feedback);
const item=q=>obj(q)&&id(q.id)&&['prompt','meaning','guided','hint','example','guidedMeaning','hintMeaning','exampleMeaning'].every(k=>str(q[k]))&&Array.isArray(q.choices)&&q.choices.length>=2&&q.choices.length<=6&&q.choices.every(choice)&&new Set(q.choices.map(c=>c.id)).size===q.choices.length;
function source(s){return obj(s)&&id(s.id)&&textKeys.every(k=>str(s[k]))&&Array.isArray(s.items)&&s.items.length>0&&s.items.length<=12&&s.items.every(item)&&new Set(s.items.map(q=>q.id)).size===s.items.length&&Array.isArray(s.rooms)&&s.rooms.length<=8&&s.rooms.every(r=>obj(r)&&id(r.id)&&str(r.name,100)&&Array.isArray(r.objects)&&r.objects.length<=12&&r.objects.every(p=>Array.isArray(p)&&p.length===2&&id(p[0])&&str(p[1],150)))&&(s.newMessage===undefined||str(s.newMessage)&&str(s.newMeaning))&&(s.writing===undefined||str(s.writing));}
const help=h=>Array.isArray(h)&&h.length<=160&&new Set(h).size===h.length&&h.every(x=>str(x,100));
const rawDrafts=(d,s)=>obj(d)&&Object.keys(d).length<=14&&Object.entries(d).every(([k,v])=>['explanation','revision',...s.items.map(q=>q.id)].includes(k)&&str(v,['explanation','revision'].includes(k)?1200:80))&&str(d.explanation,1200)&&str(d.revision,1200);
function check(c,s){const q=s.items.find(q=>q.id===c?.itemId),a=q?.choices.find(a=>a.id===c?.raw);return obj(c)&&!!a&&c.outcome===a.outcome&&str(c.feedback)&&help(c.helpSeenBefore)&&c.supported===true;}
function snapshot(w){return obj(w)&&source(w.source)&&rawDrafts(w.drafts,w.source)&&help(w.help)&&Array.isArray(w.checks)&&w.checks.length<=24&&w.checks.every(c=>check(c,w.source))&&Array.isArray(w.skips)&&w.skips.length<=12&&new Set(w.skips).size===w.skips.length&&w.skips.every(id=>w.source.items.some(q=>q.id===id))&&typeof w.newData==='boolean'&&obj(w.model)&&str(w.model.selected,80);}
export function validFrenchRoomsWork(w){return snapshot(w)&&(w.firstKept===undefined||snapshot(w.firstKept))&&(w.kept===undefined||snapshot(w.kept));}
function wrapper(s){return obj(s?.frenchRooms)&&s.frenchRooms.version===1&&obj(s.frenchRooms.lessons)&&str(s.frenchRooms.currentId,80);}
export function frenchRoomsView(state){
 if(!Object.hasOwn(state,'frenchRooms'))return {status:'missing',work:null,lessons:frenchRoomsLessons.map(s=>({id:s.id,title:s.title}))};
 if(!wrapper(state))return {status:'unavailable',work:null,lessons:[]};
 const r=state.frenchRooms,lessons=frenchRoomsLessons.map(s=>({id:s.id,title:s.title,unreadable:Object.hasOwn(r.lessons,s.id)&&!validFrenchRoomsWork(r.lessons[s.id])}));
 for(const [key,w] of Object.entries(r.lessons))if(id(key)&&!frenchRoomsLessons.some(s=>s.id===key)&&validFrenchRoomsWork(w))lessons.push({id:key,title:`Saved lesson: ${w.source.title}`});
 const w=Object.hasOwn(r.lessons,r.currentId)?r.lessons[r.currentId]:null;
 return {status:'ready',work:validFrenchRoomsWork(w)?w:null,lessons};
}
function change(state,fn,o={}){try{if(Object.hasOwn(state,'frenchRooms')&&!wrapper(state))return false;const next=clone(state),r=fn(next);if(!r||!wrapper(next)||!recoveryFitsProgressLimits(next)||typeof o.canExport!=='function'||o.canExport(next)!==true)return false;state.frenchRooms=next.frenchRooms;return r;}catch{return false;}}
function workChange(s,fn,o){return change(s,next=>{const w=frenchRoomsView(next).work;return w?fn(w):false;},o);}
export function startFrenchRooms(s,key,o={}){if(!id(key))return false;return change(s,next=>{next.frenchRooms??={version:1,currentId:'',lessons:{}};const r=next.frenchRooms;if(Object.hasOwn(r.lessons,key)){if(!validFrenchRoomsWork(r.lessons[key]))return false;}else{const src=frenchRoomsLessons.find(x=>x.id===key);if(!src)return false;r.lessons[key]={source:clone(src),drafts:{explanation:'',revision:''},help:['lesson:teach'],checks:[],skips:[],model:{selected:''},newData:false};}r.currentId=key;return true;},o);}
export function setFrenchRoomsField(s,key,value,o={}){if(!str(value,['explanation','revision'].includes(key)?1200:80))return false;return workChange(s,w=>{const q=w.source.items.find(q=>q.id===key);if(!['explanation','revision'].includes(key)&&(!q||!q.choices.some(c=>c.id===value)))return false;w.drafts[key]=value;return true;},o);}
export function showFrenchRoomsHelp(s,code,o={}){if(!str(code,100)||!code)return false;return workChange(s,w=>{if(w.help.includes(code))return true;if(w.help.length>=160)return false;w.help.push(code);return true;},o);}
export function checkFrenchRooms(s,key,o={}){return workChange(s,w=>{const q=w.source.items.find(q=>q.id===key),a=q?.choices.find(c=>c.id===w.drafts[key]);if(!a||q===w.source.items[1]&&w.source.newMessage&&!w.newData)return false;const record={itemId:key,raw:a.id,outcome:a.outcome,feedback:a.feedback,helpSeenBefore:clone(w.help),supported:true};w.checks=[...w.checks,record].slice(-24);return {recorded:true,...record};},o);}
export function skipFrenchRooms(s,key,o={}){return workChange(s,w=>{if(!w.source.items.some(q=>q.id===key))return false;if(!w.skips.includes(key))w.skips.push(key);return true;},o);}
export const revealFrenchRoomsData=(s,o={})=>workChange(s,w=>{if(!w.source.newMessage)return false;w.firstKept??=clone({source:w.source,drafts:w.drafts,help:w.help,checks:w.checks,skips:w.skips,model:w.model,newData:w.newData});w.newData=true;return true;},o);
export const keepFrenchRooms=(s,o={})=>workChange(s,w=>{const k=clone({source:w.source,drafts:w.drafts,help:w.help,checks:w.checks,skips:w.skips,model:w.model,newData:w.newData});w.firstKept??=clone(k);w.kept=k;return true;},o);
export function setFrenchRoomsSelection(s,key,o={}){if(!id(key))return false;return workChange(s,w=>{if(!w.source.rooms.some(r=>r.id===key||r.objects.some(p=>p[0]===key)))return false;w.model.selected=key;return true;},o);}
