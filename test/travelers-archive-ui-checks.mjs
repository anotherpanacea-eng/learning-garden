import assert from 'node:assert/strict';
import {ensureTravelersArchive,setArchivePage,setArchiveTask,setArchiveMap,checkArchiveMap,setArchiveOrder,checkArchiveOrder,setArchiveReplyChoice,setArchiveReplyText,checkArchiveReply} from '../dist/travelers-archive-core.mjs';
// One document persists across renders, just like the static main navigation.
const oldDocument=globalThis.document,documentListeners=[];
let workspace=null;
globalThis.document={querySelector:s=>s==='.ta-workspace'?workspace:null,addEventListener:(kind,fn,capture)=>documentListeners.push({kind,fn,capture})};
const {travelersArchivePage,bindTravelersArchive}=await import('../dist/travelers-archive-ui.mjs');
let n=0;const check=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},copy=x=>JSON.parse(JSON.stringify(x));
const earlierTag=html=>html.match(/<p class="ta-earlier-check"[^>]*>/)?.[0]??'';
{
 const s={};ensureTravelersArchive(s);setArchivePage(s,'place-dates');setArchiveTask(s,'map');setArchiveMap(s,'photo','grands-augustins');checkArchiveMap(s,'photo');check(earlierTag(travelersArchivePage(s)).includes('hidden'),'unchanged map feedback current');const checks=copy(s.travelersArchive.checks);setArchiveMap(s,'photo','austerlitz');check(!earlierTag(travelersArchivePage(s)).includes('hidden'),'changed map clearly earlier');eq(s.travelersArchive.checks,checks,'render/edit does not recheck map');setArchiveMap(s,'photo','grands-augustins');check(earlierTag(travelersArchivePage(s)).includes('hidden'),'restored exact map matches prior checked response');
 setArchiveTask(s,'order');setArchiveOrder(s,['river-peak','commission','river-returns']);checkArchiveOrder(s);check(earlierTag(travelersArchivePage(s)).includes('hidden'),'unchanged order current');const orderChecks=copy(s.travelersArchive.checks);setArchiveOrder(s,['commission','river-peak','river-returns']);check(!earlierTag(travelersArchivePage(s)).includes('hidden'),'changed order labels earlier check');eq(s.travelersArchive.checks,orderChecks,'order edit does not fabricate another check');
 setArchivePage(s,'reply');setArchiveReplyChoice(s,'claim','return-later');checkArchiveReply(s);check(earlierTag(travelersArchivePage(s)).includes('hidden'),'unchanged reply current');const replyChecks=copy(s.travelersArchive.checks);setArchiveReplyChoice(s,'claim','all-dry');check(!earlierTag(travelersArchivePage(s)).includes('hidden'),'changed reply labels earlier check');eq(s.travelersArchive.checks,replyChecks,'reply edit has not regraded');
}
// A focused controller probe: browsers normalize textarea line endings, so untouched
// imported text must not be read back and overwritten by an unrelated button.
class Node{
 constructor(dataset={}){this.dataset=dataset;this.handlers={};this.disabled=false;this.textContent='';this.hidden=true;this._value='';this.reads=0;}
 addEventListener(kind,fn){this.handlers[kind]=fn;}
 closest(selector){return selector==='a[href^="#"]'&&this.href?.startsWith('#')?this:null;}
 emit(kind,target=this){const e={target,currentTarget:this,defaultPrevented:false,stopped:false,preventDefault(){this.defaultPrevented=true;},stopImmediatePropagation(){this.stopped=true;}};for(const l of documentListeners.filter(l=>l.kind===kind&&l.capture)){if(!e.stopped)l.fn(e);}if(!e.stopped){this.handlers[kind]?.(e);if(kind==='click')this.onclick?.(e);}for(const l of documentListeners.filter(l=>l.kind===kind&&!l.capture)){if(!e.stopped)l.fn(e);}return e;}
 get value(){this.reads++;return this._value;}
 set value(x){this._value=x;}
}
function fixture(state){const input=new Node(),keep=new Node(),checkReply=new Node(),error=new Node(),count=new Node(),hear=new Node(),marker=new Node(),page=new Node({taPage:'sources'}),help=new Node({taSupport:'help'}),reading=new Node({taReading:'together'}),choice=new Node({taReplyChoice:'claim:return-later'}),source=new Node({taSource:'chronology'});
 const links=[...travelersArchivePage(state).matchAll(/<a\b([^>]*href="([^"]+)"[^>]*)>([^<]+)<\/a>/g)].map(([,attrs,href,label])=>({node:Object.assign(new Node(),{href,target:attrs.includes('target="_blank"')?'_blank':''}),href,label}));
 const singles=new Map([['#ta-reply-text',input],['[data-ta-keep]',keep],['[data-ta-reply-check]',checkReply],['#ta-writing-error',error],['#ta-writing-count',count],['[data-ta-audio="reply"] [data-speak]',hear],['#ta-reply-feedback [data-ta-earlier-check]',marker]]);
 const multiples=new Map([['a[href^="#"]',links.filter(a=>a.href.startsWith('#')).map(a=>a.node)],['[data-ta-page]',[page]],['[data-ta-support]',[help]],['[data-ta-reading]',[reading]],['[data-ta-reply-choice]',[choice]],['[data-ta-source]',[source]]]);
 const root={dataset:{taActiveTask:'reply'},querySelector:s=>singles.get(s)||null,querySelectorAll:s=>multiples.get(s)||[]};
 workspace=root;let saves=0,renders=0,focus=null;const bind=()=>bindTravelersArchive(state,{save:()=>saves++,render:()=>renders++,focus:s=>{focus=s;}});bind();
 return {input,keep,checkReply,error,count,hear,marker,page,help,reading,choice,source,links,bind,get saves(){return saves;},get renders(){return renders;},get focus(){return focus;},close(){workspace=null;}};
}
const mainNav=Object.assign(new Node(),{href:'#storm'});
check(!mainNav.emit('click').defaultPrevented,'main navigation allowed before archive is rendered');
{
 const s={};setArchivePage(s,'reply');const f=fixture(s);try{
  f.bind();f.bind();const listenerCount=documentListeners.length;eq(listenerCount,1,'one delegated listener across repeated binds');
  f.input.value='🐈'.repeat(2001);f.input.emit('input');const before=copy(s),saves=f.saves;
  check(mainNav.emit('click',{closest:s=>mainNav.closest(s)}).defaultPrevented,'main-nav link outside workspace blocks overlimit words even from a nested span');
  eq(f.focus,'#ta-reply-text','main-nav guard focuses words');eq(s,before,'main-nav guard preserves state');eq(f.input._value,'🐈'.repeat(2001),'main-nav guard preserves visible words');eq(f.saves,saves,'main-nav guard does not save invalid words');eq(f.renders,0,'main-nav guard does not rerender');
  check(mainNav.emit('click').stopped,'blocked click cannot reach the app same-hash rerender handler');
  f.input.value='Fictional valid words';f.input.emit('input');check(!mainNav.emit('click').defaultPrevented,'main-nav link allowed with valid words');
  f.input.value='🐈'.repeat(2001);f.input.emit('input');f.close();check(!mainNav.emit('click').defaultPrevented,'detached archive guard does not block main navigation');
  bindTravelersArchive(s,{});check(!mainNav.emit('click').defaultPrevented,'off-screen archive bind does not block main navigation');eq(documentListeners.length,listenerCount,'repeated and off-screen binds add no document listeners');
  const next={};setArchivePage(next,'reply');const g=fixture(next);try{check(!mainNav.emit('click').defaultPrevented,'new archive uses its current guard instead of stale invalid words');}finally{g.close();}
 }finally{f.close();}
}
{
 const s={};setArchivePage(s,'reply');const exact='\n\nFictional first line\r\nSecond\rThird 🐈 e\u0301\n';setArchiveReplyText(s,exact);
 const html=travelersArchivePage(s);check(html.includes('aria-describedby="ta-writing-help ta-writing-count ta-writing-error">\n\n\nFictional'),'extra markup newline protects actual leading newlines from HTML stripping');
 const f=fixture(s);f.input.value=exact.replace(/\r\n?/g,'\n');try{
  eq(f.input.reads,0,'binding never reads normalized textarea value');
  for(const [node,label] of [[f.keep,'keep'],[f.checkReply,'check'],[f.help,'help'],[f.source,'source choice'],[f.reading,'reading report'],[f.choice,'reply card'],[f.page,'page']]){node.emit('click');eq(s.travelersArchive.reply.text,exact,`${label} preserves untouched imported exact text`);eq(f.input.reads,0,`${label} never commits normalized DOM text`);}
  eq(s.travelersArchive.kept.reply.text,exact,'untouched kept snapshot preserves CRLF/CR/leading newline');
 }finally{f.close();}
}
{
 const s={};setArchivePage(s,'reply');setArchiveReplyText(s,'Fictional earlier words');checkArchiveReply(s);const f=fixture(s);try{
  f.input.value='  Actual edit 🐈\n';f.input.emit('input');eq(s.travelersArchive.reply.text,'  Actual edit 🐈\n','actual input commits exact entered value');check(!f.marker.hidden,'typing updates earlier-check label without rerender');eq(f.renders,0,'input preserves caret by avoiding render');check(f.saves===1,'valid actual input saved');
  const stateBefore=copy(s),checksBefore=copy(s.travelersArchive.checks),rendersBefore=f.renders;
  f.input.value='🐈'.repeat(2001);f.input.emit('input');eq(s,stateBefore,'overlimit input leaves last valid state exact');check(f.keep.disabled&&f.checkReply.disabled,'overlimit keep and check disabled');check(f.error.textContent.includes('Nothing was shortened'),'overlimit explicit message');eq(f.input._value,'🐈'.repeat(2001),'overlimit words remain visible, not truncated');
  for(const node of [f.keep,f.checkReply,f.help,f.source,f.choice,f.page])node.emit('click');eq(s,stateBefore,'unresolved overlimit edit blocks archive actions');eq(s.travelersArchive.checks,checksBefore,'blocked check not recorded');eq(f.renders,rendersBefore,'invalid words not lost to rerender');eq(f.focus,'#ta-reply-text','blocked action points to words');
  f.input.value='🐈'.repeat(2000);f.input.emit('input');check(!f.keep.disabled&&!f.checkReply.disabled,'2000 actual Unicode codepoints can be kept');eq(s.travelersArchive.reply.text.length,4000,'no UTF16 truncation');f.keep.emit('click');eq(s.travelersArchive.kept.reply.text,'🐈'.repeat(2000),'valid edited words kept');
 }finally{f.close();}
}
for(const label of ['Back to Paris','Return to Paris','Visit the Post Office','Tell a new fictional story','Take a break','Grown-up notes']){
 const s={};setArchivePage(s,'reply');setArchiveReplyText(s,'Fictional earlier words');const f=fixture(s);try{
  const link=f.links.find(a=>a.label===label);check(link?.href.startsWith('#'),`${label} is an in-app hash link`);
  const before=copy(s),saves=f.saves;f.input.value='🐈'.repeat(2001);f.input.emit('input');f.error.textContent='';
  for(const a of f.links.filter(a=>!a.href.startsWith('#')))check(!a.node.emit('click').defaultPrevented,'external source link remains available with overlimit words');
  eq(f.focus,null,'external source links do not focus words');
  check(link.node.emit('click').defaultPrevented,`${label} prevents navigation with overlimit words`);eq(s,before,`${label} leaves state unchanged`);eq(f.focus,'#ta-reply-text',`${label} focuses overlimit words`);check(f.error.textContent.includes('Nothing was shortened'),`${label} shows writing error`);eq(f.input._value,'🐈'.repeat(2001),`${label} preserves visible overlimit words`);eq(f.saves,saves,`${label} does not save invalid words`);eq(f.renders,0,`${label} does not rerender`);
  f.input.value='Fictional valid edit';f.input.emit('input');const valid=copy(s),validSaves=f.saves;check(!link.node.emit('click').defaultPrevented,`${label} permits navigation with valid words`);eq(s,valid,`${label} leaves valid state unchanged`);eq(f.saves,validSaves,`${label} does not add a save`);eq(f.renders,0,`${label} does not rerender valid words`);
 }finally{f.close();}
}
console.log(`Travelers Archive UI checks passed: ${n}`);
if(oldDocument===undefined)delete globalThis.document;else globalThis.document=oldDocument;
