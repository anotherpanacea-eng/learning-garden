import assert from 'node:assert/strict';
import {travelersArchivePage,bindTravelersArchive} from '../dist/travelers-archive-ui.mjs';
import {ensureTravelersArchive,setArchivePage,setArchiveTask,setArchiveMap,checkArchiveMap,setArchiveOrder,checkArchiveOrder,setArchiveReplyChoice,setArchiveReplyText,checkArchiveReply} from '../dist/travelers-archive-core.mjs';
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
 emit(kind){const e={currentTarget:this,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;}};this.handlers[kind]?.(e);if(kind==='click')this.onclick?.(e);return e;}
 get value(){this.reads++;return this._value;}
 set value(x){this._value=x;}
}
function fixture(state){const input=new Node(),keep=new Node(),checkReply=new Node(),error=new Node(),count=new Node(),hear=new Node(),marker=new Node(),page=new Node({taPage:'sources'}),help=new Node({taSupport:'help'}),reading=new Node({taReading:'together'}),choice=new Node({taReplyChoice:'claim:return-later'}),source=new Node({taSource:'chronology'});
 const links=[...travelersArchivePage(state).matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([,href,label])=>({node:new Node(),href,label}));
 const singles=new Map([['#ta-reply-text',input],['[data-ta-keep]',keep],['[data-ta-reply-check]',checkReply],['#ta-writing-error',error],['#ta-writing-count',count],['[data-ta-audio="reply"] [data-speak]',hear],['#ta-reply-feedback [data-ta-earlier-check]',marker]]);
 const multiples=new Map([['a[href^="#"]',links.filter(a=>a.href.startsWith('#')).map(a=>a.node)],['[data-ta-page]',[page]],['[data-ta-support]',[help]],['[data-ta-reading]',[reading]],['[data-ta-reply-choice]',[choice]],['[data-ta-source]',[source]]]);
 const root={dataset:{taActiveTask:'reply'},querySelector:s=>singles.get(s)||null,querySelectorAll:s=>multiples.get(s)||[]};
 const old=globalThis.document;globalThis.document={querySelector:s=>s==='.ta-workspace'?root:null};let saves=0,renders=0,focus=null;bindTravelersArchive(state,{save:()=>saves++,render:()=>renders++,focus:s=>{focus=s;}});
 return {input,keep,checkReply,error,count,hear,marker,page,help,reading,choice,source,links,get saves(){return saves;},get renders(){return renders;},get focus(){return focus;},close(){if(old===undefined)delete globalThis.document;else globalThis.document=old;}};
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
for(const label of ['Back to Paris','Return to Paris','Visit the Post Office','Tell a new fictional story','Take a break in the garden','Grown-up notes']){
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
