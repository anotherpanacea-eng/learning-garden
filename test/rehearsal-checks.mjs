import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeRehearsalSource,rehearsalCases} from '../dist/rehearsal-content.mjs';
import {validRehearsalSource,validRehearsalWork,newRehearsalWork,changeRehearsalWork,rehearsalFrame,rehearsalScriptsView,keepRehearsalScript} from '../dist/rehearsal-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(a,m)=>{assert.ok(a,m);count++;},clone=structuredClone,yes={canExport:()=>true};
for(const job of rehearsalCases){const s=makeRehearsalSource(job.id),w=newRehearsalWork(s);ok(validRehearsalWork(s,w));eq(w.order,s.initialOrder);ok(s.cues.every(c=>w.delivery[c.id].kind==='speech'&&w.delivery[c.id].speaker===null),'No author autofill');}
const s=makeRehearsalSource('letter'),w=newRehearsalWork(s),first=s.initialOrder[0],actor=s.cast[0].id;
eq([w.teachingShown,w.rehearsalShown,w.authorShown],[false,false,false]);
let changed=changeRehearsalWork(s,w,'speaker',{id:first,speaker:actor});eq(rehearsalFrame(s,changed,0).speaker,s.cast[0]);
changed=changeRehearsalWork(s,changed,'kind',{id:first,kind:'direction'});eq(changed.delivery[first],{kind:'direction',speaker:null});
eq(changeRehearsalWork(s,changed,'speaker',{id:first,speaker:actor}),null);
changed=changeRehearsalWork(s,changed,'kind',{id:first,kind:'speech'});eq(changed.delivery[first],{kind:'speech',speaker:null});
const work={...w,extra:{retained:['work']}};work.delivery[first].extra={retained:'delivery'};
const moved=changeRehearsalWork(s,work,'move',{id:first,delta:1});eq(moved.order,[w.order[1],w.order[0],...w.order.slice(2)]);eq(moved.extra,work.extra);eq(moved.delivery[first].extra,work.delivery[first].extra);moved.extra.retained.push('detached');eq(work.extra.retained,['work']);
for(const value of [{id:first,delta:-1},{id:w.order.at(-1),delta:1},{id:'foreign',delta:1},{id:first,delta:0}])eq(changeRehearsalWork(s,w,'move',value),null);
for(const [action,value] of [['kind',{id:first,kind:'unknown'}],['speaker',{id:first,speaker:'foreign'}],['speaker',{id:first}],['invent',{}]])eq(changeRehearsalWork(s,w,action,value),null);
let flags=w;for(const action of ['teaching','rehearsal','author','teaching'])flags=changeRehearsalWork(s,flags,action);
eq([flags.teachingShown,flags.rehearsalShown,flags.authorShown],[true,true,true]);eq(newRehearsalWork(s).authorShown,false);eq(clone(flags),flags,'Copies retain disclosures');
// The same literal cue has different presentation solely from its chosen role.
const eventCue=s.cues.find(c=>c.event?.prop),at=w.order.indexOf(eventCue.id),direction=changeRehearsalWork(s,w,'kind',{id:eventCue.id,kind:'direction'});
const frame=rehearsalFrame(s,direction,at);eq(frame,{id:eventCue.id,index:at,text:eventCue.text,kind:'direction',speaker:null,event:{...eventCue.event,actor:s.cast.find(c=>c.id===eventCue.event.actor)},authorIndex:s.authorOrder.indexOf(eventCue.id),authorKind:eventCue.authorKind,authorSpeaker:null,reason:eventCue.reason});
eq(rehearsalFrame(s,w,at).event,null,'Saying direction words performs no event');
const noEvent=s.cues.find(c=>c.event===null),noEventWork=changeRehearsalWork(s,w,'kind',{id:noEvent.id,kind:'direction'});eq(rehearsalFrame(s,noEventWork,w.order.indexOf(noEvent.id)).event,null,'Direction text never infers an event');
for(const i of [-1,w.order.length,0.5,NaN])eq(rehearsalFrame(s,w,i),null);
// Historical names, optional art and literal words belong to the frozen source.
const historical=clone(s);historical.title='Earlier script';historical.cast[0].art='unknown-puppet';historical.cast[0].name='Earlier actor';historical.extra={own:['source']};const hc=historical.cues.find(c=>c.event?.prop);hc.event.prop='unknown-prop';hc.event.propName='the old folded sail';hc.text='Earlier complete direction.';hc.reason='Earlier original reason.';hc.extra={retained:true};historical.teaching[0].extra={own:'teaching'};
ok(validRehearsalSource(historical));eq(rehearsalFrame(historical,changeRehearsalWork(historical,newRehearsalWork(historical),'kind',{id:hc.id,kind:'direction'}),historical.initialOrder.indexOf(hc.id)).event.propName,'the old folded sail');
for(const mutate of [x=>x.id='constructor',x=>x.cast[0].id='__proto__',x=>x.cast[1].id=x.cast[0].id,x=>x.cues[1].id=x.cues[0].id,x=>x.initialOrder.reverse().pop(),x=>x.authorOrder[0]=x.authorOrder[1],x=>x.cues[0].authorSpeaker='foreign',x=>x.cues[0].event.actor='foreign',x=>x.cues[0].event.propName=null,x=>x.teaching[0].words='',x=>x.teaching[0].example={kind:'direction',speaker:actor,text:'A whole direction.',event:null},x=>x.title='x'.repeat(161),x=>x.cues[0].text='x'.repeat(1501),x=>delete x.cues[0],x=>delete x.cues[0].reason]){const bad=clone(s);mutate(bad);eq(validRehearsalSource(bad),false);}
const unicode=clone(s);unicode.cues[0].text='🌱'.repeat(1500);ok(validRehearsalSource(unicode),'Text bounds count code points');unicode.cues[0].text+='🌱';eq(validRehearsalSource(unicode),false);eq(validRehearsalSource(Object.create(s)),false);
for(const mutate of [x=>x.order[0]=x.order[1],x=>delete x.delivery[first],x=>x.delivery.foreign={kind:'speech',speaker:null},x=>x.delivery[first]={kind:'direction',speaker:actor},x=>x.teachingShown=1,x=>delete x.authorShown]){const bad=clone(w);mutate(bad);eq(validRehearsalWork(s,bad),false);}
const symbolDelivery=clone(w);symbolDelivery.delivery[Symbol('foreign')]={kind:'speech',speaker:null};eq(validRehearsalWork(s,symbolDelivery),false,'Delivery keys are exactly the own cue IDs');
const row={id:'rehearsal-80',source:historical,work:newRehearsalWork(historical),extra:{row:true}},raw={id:'rehearsal-900',future:{v:4}},book={unrelated:{literal:'retained'},rehearsalScripts:[raw,row]};
eq(rehearsalScriptsView({}),{status:'absent',items:[],canKeep:true});eq(rehearsalScriptsView({rehearsalScripts:{future:true}}).canKeep,false);eq(keepRehearsalScript(book,s,flags,yes),'rehearsal-901');eq(book.rehearsalScripts.slice(0,2),[raw,row]);
const duplicates={rehearsalScripts:[row,clone(row),raw,{id:'rehearsal-81',source:s,work:w}]};eq(rehearsalScriptsView(duplicates).items.map(r=>r.readable),[false,false,false,true]);eq(keepRehearsalScript(duplicates,s,w,yes),'rehearsal-901');
for(const suffix of ['0','01','2x']){const b={rehearsalScripts:[{...row,id:`rehearsal-${suffix}`}]};eq(rehearsalScriptsView(b).items[0].readable,false);}
for(const suffix of ['999999','1000000','9007199254740993','9'.repeat(400)]){const b={rehearsalScripts:[{id:`rehearsal-${suffix}`} ]};eq(rehearsalScriptsView(b).canKeep,false);eq(keepRehearsalScript(b,s,w,yes),false);}
for(const callback of [undefined,()=>false,()=>null,()=>undefined,()=>1,()=>{throw Error('refused');}]){const b=clone(book),before=clone(b),root=b.rehearsalScripts;eq(keepRehearsalScript(b,s,w,{canExport:callback}),false);eq(b,before);eq(b.rehearsalScripts===root,true,'Refusal retains root identity');}
const detached=clone(book),before=clone(detached),untouched=detached.unrelated;ok(keepRehearsalScript(detached,historical,flags,{canExport:c=>{c.rehearsalScripts[0].future.v=99;c.rehearsalScripts.at(-1).source.title='Callback rewrite';c.rehearsalScripts.length=0;c.unrelated.literal='Callback rewrite';return true;}}));eq(detached.rehearsalScripts.slice(0,-1),before.rehearsalScripts);eq(detached.rehearsalScripts.at(-1).source,historical);eq(detached.unrelated===untouched,true);eq(detached.unrelated,before.unrelated);const keptTitle=detached.rehearsalScripts.at(-1).source.title;historical.title='Later source edit';flags.order.reverse();eq(detached.rehearsalScripts.at(-1).source.title,keptTitle,'Kept source is detached');
// Exercise the actual whole-Notes report/import path, including unknown rows,
// duplicates, persistence reload and a sibling near the real byte cap.
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];ok(declaration,'Actual Notes report is available');
const report=new Function('recommendations','explorerStore',`${declaration}; return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}}),download=b=>JSON.stringify(report(b),null,2),actual={canExport:b=>prepareProgressImport(download(b)).ok};
const full=initializeExplorerState(freshState());full.rehearsalScripts=[clone(row),clone(row),clone(raw),{unknown:['earlier','exact']}];full.unrelated={payload:''};const beforeFull=clone(full);
// Size the unrelated sibling using real serialized Notes, leaving room for one
// complete new record. The imported notebook itself also remains under its cap.
const trial=clone(full);keepRehearsalScript(trial,s,w,yes);const overhead=new TextEncoder().encode(download(trial)).length;full.unrelated.payload='x'.repeat(MAX_IMPORT_BYTES-overhead-2048);ok(actual.canExport(full));eq(keepRehearsalScript(full,s,w,actual),'rehearsal-901');eq(full.rehearsalScripts.slice(0,4),beforeFull.rehearsalScripts);ok(recoveryFitsProgressLimits(full));
const imported=prepareProgressImport(download(full));ok(imported.ok);eq(imported.state.rehearsalScripts,full.rehearsalScripts);eq(imported.state.unrelated,full.unrelated);const reloaded=JSON.parse(JSON.stringify(imported.state)),redownload=prepareProgressImport(download(reloaded));ok(redownload.ok);eq(redownload.state.rehearsalScripts,full.rehearsalScripts);eq(rehearsalScriptsView(reloaded).items.map(r=>r.readable),[false,false,false,false,true]);
const capped=clone(full);capped.unrelated.payload+='x'.repeat(4096);const cappedBefore=clone(capped),cappedRoot=capped.rehearsalScripts;eq(keepRehearsalScript(capped,s,w,actual),false);eq(capped,cappedBefore);eq(capped.rehearsalScripts===cappedRoot,true);
// A proposal can pass raw notebook limits yet fail the actual Notes wrapper.
const wrapper=initializeExplorerState(freshState());wrapper.unrelated='';const probe=clone(wrapper);keepRehearsalScript(probe,s,w,yes);const rawBytes=new TextEncoder().encode(JSON.stringify(probe,null,2)).length;wrapper.unrelated='x'.repeat(MAX_IMPORT_BYTES-rawBytes-1);const wrapperProposal=clone(wrapper);ok(keepRehearsalScript(wrapperProposal,s,w,yes));ok(recoveryFitsProgressLimits(wrapperProposal));eq(actual.canExport(wrapperProposal),false);const wrapperBefore=clone(wrapper);eq(keepRehearsalScript(wrapper,s,w,actual),false);eq(wrapper,wrapperBefore);
console.log(`Rehearsal Cues: ${count} source, work, stage, history and actual Notes checks passed.`);
