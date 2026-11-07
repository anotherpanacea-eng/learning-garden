import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeThreadSource,threadCases} from '../dist/two-threads-content.mjs';
import {validThreadSource,validThreadWork,newThreadWork,changeThreadWork,threadMap,threadSheetsView,lastThreadReading,keepThreadReading,readThreadEchoStudy,readThreadEchoWork,changeThreadEcho,findThreadEchoLink} from '../dist/two-threads-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(a,m)=>{assert.ok(a,m);count++;},clone=structuredClone,yes={canExport:()=>true};
const s=makeThreadSource(),w=newThreadWork(s),maps=(n,o)=>threadMap(n,o).map(t=>[t.positions,t.returns.map(r=>[r.from,r.to,r.gap])]);
eq(threadCases.map(c=>c.id),['second-knock']);ok(validThreadSource(s));eq(makeThreadSource('missing'),null);
eq(s.scenes.map(c=>c.id),['a1','b1','a2','b2','a3','b3','together']);
eq(w,{v:1,order:['a1','a2','a3','b1','b2','b3','together'],referenceShown:false,teachingSeen:0});
eq(maps(s,s.authorOrder),[[[1,3,5,7],[[1,3,1],[3,5,1],[5,7,1]]],[[2,4,6,7],[[2,4,1],[4,6,1]]]],'Writer positions and returns independently specified');
eq(maps(s,w.order),[[[1,2,3,7],[[3,7,3]]],[[4,5,6,7],[]]],'Grouped order still returns at the shared ending');
eq(maps(s,['together','a1','b1','a2','b2','a3','b3']),[[[1,2,4,6],[[2,4,1],[4,6,1]]],[[1,3,5,7],[[1,3,1],[3,5,1],[5,7,1]]]],'Ending-first is admissible, not repaired');
eq(maps(s.demo,s.teaching[0].order),[[[1,2,5],[[2,5,2]]],[[3,4,5],[]]]);
for(const frame of s.teaching.slice(1))eq(maps(s.demo,frame.order),[[[1,3,5],[[1,3,1],[3,5,1]]],[[2,4,5],[[2,4,1]]]]);
const firstReturn=threadMap(s,s.authorOrder)[0].returns[0];eq(firstReturn,{from:1,to:3,gap:1,fromId:'a1',toId:'a2',fromTitle:'A careful delivery',toTitle:'No answer'});
const originalWork={...w,extra:{retained:1}},moved=changeThreadWork(s,originalWork,'move',{sceneId:'a1',delta:1});eq(moved.order,['a2','a1','a3','b1','b2','b3','together']);eq(w.order[0],'a1');moved.extra.retained=2;eq(originalWork.extra,{retained:1},'Unknown work fields are detached and retained');
for(const v of [{sceneId:'a1',delta:-1},{sceneId:'together',delta:1},{sceneId:'missing',delta:1},{sceneId:'a1',delta:0}])eq(changeThreadWork(s,w,'move',v),null,'Invalid or exhausted move rejected');
let help=changeThreadWork(s,w,'reference');for(let i=0;i<6;i++)help=changeThreadWork(s,help,'teaching');eq(help.referenceShown,true);eq(help.teachingSeen,3);eq(w.teachingSeen,0);eq(changeThreadWork(s,w,'grade'),null);
for(const patch of [{order:[...w.order.slice(1),w.order[1]]},{referenceShown:1},{teachingSeen:-1},{teachingSeen:4}])eq(validThreadWork(s,{...w,...patch}),false);
// Historical source has different counts, identifiers, titles, paragraphs and memberships.
const h=clone(s);h.id='earlier source';h.title='<Earlier & complete>';h.threads=[{id:'outside',label:'Earlier outside',symbol:'dots'},{id:'inside',label:'Earlier inside',symbol:'stripe'}];h.scenes=[{id:'third',title:'Third',threadIds:['outside'],paragraphs:['Whole earlier paragraph.','Another complete paragraph.']},{id:'first',title:'First',threadIds:['inside'],paragraphs:['Own inside words.']},{id:'shared',title:'Shared',threadIds:['outside','inside'],paragraphs:['Own meeting words.']}];h.startOrder=['shared','first','third'];h.authorOrder=['third','first','shared'];h.extra={untouched:true};const hw=newThreadWork(h);ok(validThreadWork(h,hw));eq(maps(h,hw.order),[[[1,3],[[1,3,1]]],[[1,2],[]]]);eq(threadMap(h,hw.order)[0].label,'Earlier outside');
for(const mutate of [x=>x.threads[1].symbol='stripe',x=>x.scenes[1].id=x.scenes[0].id,x=>x.scenes[0].threadIds=['foreign'],x=>x.startOrder.pop(),x=>x.teaching[0].order[0]='a1',x=>x.id='constructor',x=>x.definitions[0].meaning='',x=>delete x.demo.scenes[0],x=>x.scenes[0].paragraphs[0]='x'.repeat(1501)]){const bad=clone(s);mutate(bad);eq(validThreadSource(bad),false);}
eq(threadMap(s,['a1']),null);eq(threadMap(null,[]),null);
const tooLong=clone(s);tooLong.scenes[0].title='x'.repeat(161);eq(validThreadSource(tooLong),false);const sparse=clone(s);delete sparse.definitions[1];eq(validThreadSource(sparse),false);const inherited=Object.create(s);eq(validThreadSource(inherited),false);const unchangedSource=clone(s);changeThreadWork(s,w,'move',{sceneId:'a1',delta:1});eq(s,unchangedSource,'Scene moves never rewrite the words or memberships');
const sample={id:'thread-reading-80',source:h,work:{...hw,extra:{kept:true}},outer:{original:true}},book={untouched:{hello:'world'},threadReadings:[{opaque:['raw'],id:'thread-reading-900'},sample]};
eq(threadSheetsView({}).status,'absent');eq(threadSheetsView({threadReadings:{v:2}}).canKeep,false);eq(lastThreadReading(book).index,1);eq(keepThreadReading(book,s,w,yes),'thread-reading-901');eq(book.threadReadings[0],{opaque:['raw'],id:'thread-reading-900'});eq(book.threadReadings[1],sample);eq(book.untouched,{hello:'world'});eq(lastThreadReading(book).id,'thread-reading-901');
const dup={threadReadings:[sample,clone(sample),{id:'thread-reading-81',source:s,work:w},{id:'thread-reading-82',bad:true}]};eq(threadSheetsView(dup).items.map(r=>r.readable),[false,false,true,false]);eq(lastThreadReading(dup).index,2);eq(lastThreadReading({threadReadings:[sample,clone(sample)]}),null);
for(const id of ['thread-reading-0001','thread-reading-0','thread-reading-1000000','thread-reading-2x'])eq(threadSheetsView({threadReadings:[{...sample,id}]}).items[0].readable,false);
const pages={threadReadings:Array.from({length:17},(_,i)=>({id:`thread-reading-${i+1}`,source:s,work:w}))};eq(threadSheetsView(pages).items.length,17,'No implicit shelf trimming');eq(lastThreadReading(pages).index,16,'Raw index supports third eight-record shelf page');
const ceiling={threadReadings:[sample,{id:'thread-reading-999999'}]};eq(threadSheetsView(ceiling).canKeep,false);eq(lastThreadReading(ceiling).id,'thread-reading-80');eq(keepThreadReading(ceiling,s,w,yes),false);
for(const cb of [undefined,()=>false,()=>null,()=>undefined,()=>1,()=>{throw Error('refusal');}]){const b=clone(book),before=clone(b);eq(keepThreadReading(b,s,w,{canExport:cb}),false);eq(b,before,'Refusal leaves full notebook untouched');}
const detached=clone(book),original=clone(detached);ok(keepThreadReading(detached,s,w,{canExport:c=>{c.threadReadings.length=0;c.untouched.hello='bad';return true;}}));eq(detached.threadReadings.length,original.threadReadings.length+1);eq(detached.untouched,original.untouched);eq(detached.threadReadings[0],original.threadReadings[0]);
const tooBig={opaque:'x'.repeat(5*1024*1024)},beforeBig=clone(tooBig);eq(keepThreadReading(tooBig,s,w,yes),false);eq(tooBig,beforeBig);
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];ok(declaration,'Use actual Notes report');
const report=new Function('recommendations','explorerStore',`${declaration}; return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}}),pretty=b=>JSON.stringify(report(b),null,2),actual={canExport:b=>prepareProgressImport(pretty(b)).ok};
const full=initializeExplorerState(freshState());full.opaque={payload:'x'.repeat(500000)};full.threadReadings=[{id:'thread-reading-70',future:true},clone(sample)];const oldFull=clone(full);eq(keepThreadReading(full,s,{...w,order:['together','b3','a3','b2','a2','b1','a1']},actual),'thread-reading-81');eq(full.opaque,oldFull.opaque);eq(full.threadReadings.slice(0,2),oldFull.threadReadings);const imported=prepareProgressImport(pretty(full));ok(imported.ok);eq(imported.state.threadReadings,full.threadReadings);eq(imported.state.opaque,full.opaque);ok(imported.summary.destinations.includes('Two Threads reading orders'),'Friendly actual Notes destination label');
const foreign=imported.state;eq(lastThreadReading(foreign).raw.work.order,['together','b3','a3','b2','a2','b1','a1']);eq(lastThreadReading({threadReadings:[clone(sample),{id:'thread-reading-100',unreadable:true}]}).raw.source,h);


// Optional echo material is source-owned and never changes the validity of the older reading-order artifact.
const studyView=readThreadEchoStudy(s);eq(studyView.status,'ready');const study=studyView.study;eq(study.cards.length,11);
for(const card of study.cards)ok(s.scenes.find(scene=>scene.id===card.sceneId).paragraphs[card.paragraphIndex].includes(card.text),'each current card anchors exactly in its own complete scene');
const oldSource=clone(s);delete oldSource.echoStudy;
eq(readThreadEchoStudy(oldSource),{status:'absent',study:null});eq(readThreadEchoWork(oldSource,w).status,'absent');eq(readThreadEchoWork(oldSource,{...w,echoes:{future:true}}).status,'unavailable');
const beforeRead=clone(w),emptyEcho=readThreadEchoWork(s,w);eq(emptyEcho.status,'ready');eq(emptyEcho.stored,false);eq(emptyEcho.echoes,{v:1,left:null,right:null,lens:null,links:[],referenceShown:false,teachingSeen:0});eq(w,beforeRead,'viewing an optional study creates no work field');
emptyEcho.echoes.links.push({bad:'view mutation'});eq(readThreadEchoWork(s,w).echoes.links,[],'ephemeral defaults do not share later read state');
const noEcho=x=>{const y=clone(x);delete y.echoes;return y;};
const ids=study.cards.map(c=>c.id),lenses=['words','image','idea'];
const selected=(left,right,lens,base=w,source=s)=>{let out=changeThreadEcho(source,base,'setleft',left);out=changeThreadEcho(source,out,'setright',right);return changeThreadEcho(source,out,'lens',lens);};
for(const left of ids)for(const right of ids)if(left!==right)for(const lens of lenses){
 const material=selected(left,right,lens),connected=changeThreadEcho(s,material,'connect');
 eq(connected.echoes.links,[{left,right,lens}],'any distinct ordered pair/lens is admissible, without a literary key');
 eq(noEcho(connected),w,'echo actions preserve all original arrangement/support fields');
 eq(findThreadEchoLink(connected.echoes,right,left,lens),0,'unordered identity recognizes reversed selection');
 eq(changeThreadEcho(s,selected(right,left,lens,connected),'connect'),null,'reversed duplicate is not appended');
 const focus=changeThreadEcho(s,selected(right,left,'idea',connected),'focus',{left:right,right:left,lens});
 eq([focus.echoes.left,focus.echoes.right,focus.echoes.lens],[left,right,lens],'atomic focus restores the original link orientation');
 const removed=changeThreadEcho(s,focus,'remove',{left:right,right:left,lens});eq(removed.echoes.links,[],'stable identity removes exactly the requested connection');
 eq([removed.echoes.left,removed.echoes.right,removed.echoes.lens],[left,right,lens],'removal retains visible material for reconnecting');
}
const oneSide=changeThreadEcho(s,w,'setleft',ids[0]);eq(readThreadEchoWork(s,oneSide).status,'ready');eq(oneSide.echoes.right,null);eq(oneSide.echoes.lens,null);eq(changeThreadEcho(s,oneSide,'connect'),null,'a single side and no lens are unfinished material');
const same=selected(ids[0],ids[0],'words');eq(readThreadEchoWork(s,same).status,'ready');eq(changeThreadEcho(s,same,'connect'),null,'same-card material remains visible and keepable but cannot connect');
const noLens=selected(ids[0],ids[1],null);eq(readThreadEchoWork(s,noLens).status,'ready');eq(changeThreadEcho(s,noLens,'connect'),null,'a lens must be explicitly selected');
for(const [action,value] of [['setleft','foreign'],['setright','constructor'],['lens','grade'],['focus',{left:ids[0],right:ids[1],lens:'words'}],['remove',{left:ids[0],right:ids[1],lens:'words'}],['unknown',null]])eq(changeThreadEcho(s,w,action,value),null,'invalid or missing action target refuses without mutation');
let capacity=w;for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)for(const lens of lenses)capacity=changeThreadEcho(s,selected(ids[i],ids[j],lens,capacity),'connect');
eq(capacity.echoes.links.length,165,'all natural unordered-pair/lens connections fit, without an arbitrary cap');eq(readThreadEchoWork(s,capacity).status,'ready');
const firstIdentity=capacity.echoes.links[0],lastIdentity=capacity.echoes.links.at(-1),afterFirst=changeThreadEcho(s,capacity,'remove',firstIdentity),afterLast=changeThreadEcho(s,afterFirst,'remove',lastIdentity);
eq(afterLast.echoes.links,capacity.echoes.links.slice(1,-1),'link identity survives shifting indices');
eq(capacity.echoes.links.length,165,'removal is detached');
// Unknown material in both the old owner and new optional owner survives targeted actions and copies.
const extraWork={...selected(ids[0],ids[1],'words'),future:{raw:['whole']}};extraWork.echoes.extra={nested:[1,2]};
let extraConnected=changeThreadEcho(s,extraWork,'connect');extraConnected.echoes.links[0].future={keep:'row'};
const extraChanged=changeThreadEcho(s,extraConnected,'setright',ids[2]);eq(extraChanged.future,extraWork.future);eq(extraChanged.echoes.extra,extraWork.echoes.extra);eq(extraChanged.echoes.links,extraConnected.echoes.links);
extraChanged.echoes.extra.nested.push(3);eq(extraConnected.echoes.extra.nested,[1,2],'unknown nested fields are detached');
let echoHelp=changeThreadEcho(s,extraConnected,'reference');for(let i=0;i<6;i++)echoHelp=changeThreadEcho(s,echoHelp,'teaching');eq([echoHelp.echoes.referenceShown,echoHelp.echoes.teachingSeen],[true,study.demo.steps.length]);eq([echoHelp.referenceShown,echoHelp.teachingSeen],[false,0],'echo support does not overwrite387 support');
eq(noEcho(echoHelp),noEcho(extraConnected));eq(changeThreadWork(s,echoHelp,'reference').echoes,echoHelp.echoes,'387 support changes preserve echo bytes');eq(changeThreadWork(s,echoHelp,'move',{sceneId:'a1',delta:1}).echoes,echoHelp.echoes,'scene moves preserve selected passages and support');
// Delimiters in own IDs cannot make different pairs alias.
const history=clone(h);history.echoStudy={v:1,title:'Earlier echoes',notice:'Earlier own text.',invitations:[{id:'first question',prompt:'Look again.'}],cards:[{id:'a|b',sceneId:'third',paragraphIndex:0,text:'Whole earlier'},{id:'c',sceneId:'third',paragraphIndex:1,text:'Another complete'},{id:'a',sceneId:'first',paragraphIndex:0,text:'Own inside'},{id:'b|c',sceneId:'shared',paragraphIndex:0,text:'Own meeting'}],references:[{title:'Earlier reading',left:'a|b',right:'c',lens:'words',text:'An earlier interpretation.'}],demo:{title:'Earlier miniature',text:'First a cup. Then a plate.',first:'a cup',second:'a plate',steps:['Earlier one-step example.']},future:{untouched:true}};
const historyWork=newThreadWork(history);eq(readThreadEchoStudy(history).status,'ready','historical own words/counts resolve without current-catalogue refill');
let historyLinked=changeThreadEcho(history,selected('a|b','c','words',historyWork,history),'connect');historyLinked=changeThreadEcho(history,selected('a','b|c','words',historyLinked,history),'connect');eq(historyLinked.echoes.links.length,2,'compound IDs do not collide');eq(findThreadEchoLink(historyLinked.echoes,'a','b|c','words'),1);
const duplicateAnchors=clone(history);duplicateAnchors.echoStudy.cards[1]={...duplicateAnchors.echoStudy.cards[0],id:'c'};duplicateAnchors.echoStudy.references.push(clone(duplicateAnchors.echoStudy.references[0]));eq(readThreadEchoStudy(duplicateAnchors).status,'ready','different card IDs may quote the same anchor and references may repeat pairs');
for(const mutate of [x=>x.echoStudy.v=2,x=>x.echoStudy.cards[0].sceneId='foreign',x=>x.echoStudy.cards[0].paragraphIndex=8,x=>x.echoStudy.cards[0].text='Not in this paragraph',x=>x.echoStudy.cards[1].id=x.echoStudy.cards[0].id,x=>delete x.echoStudy.cards[1],x=>x.echoStudy.references[0].right=x.echoStudy.references[0].left,x=>x.echoStudy.references[0].lens=null,x=>x.echoStudy.demo.first='not in miniature',x=>x.echoStudy.demo.second=x.echoStudy.demo.first,x=>x.echoStudy.invitations.push(clone(x.echoStudy.invitations[0]))]){
 const malformed=clone(s);mutate(malformed);eq(readThreadEchoStudy(malformed).status,'unavailable');ok(validThreadSource(malformed),'a bad optional study cannot close the old story');ok(validThreadWork(malformed,w));eq(changeThreadEcho(malformed,w,'reference'),null);
}
const unicode=clone(history);unicode.scenes[0].paragraphs[0]='café';unicode.echoStudy.cards[0].text='café';eq(readThreadEchoStudy(unicode).status,'unavailable','anchors use exact code units, not visual Unicode normalization');
const rawEcho={v:1,left:ids[0],right:'foreign',lens:'unknown',links:[{left:ids[0],right:ids[1],lens:'words',future:{row:1}},{left:'foreign',right:ids[1],lens:'idea'},null,{left:ids[1],right:ids[2],lens:'image'}],referenceShown:'future',teachingSeen:900,extra:{raw:true}};
const rawWork={...w,echoes:rawEcho},rawView=readThreadEchoWork(s,rawWork);eq(rawView.status,'unavailable');eq(rawView.stored,true);eq(rawView.rows.map(row=>[row.index,row.readable]),[[0,true],[1,false],[2,false],[3,true]],'readable stored links remain available beside placeholders');eq(rawView.preview,{left:ids[0],right:null,lens:null},'only safe current selections are previewed');
for(const action of ['setleft','setright','lens','connect','focus','remove','reference','teaching'])eq(changeThreadEcho(s,rawWork,action,ids[0]),null,'unavailable optional work is view-only');ok(validThreadWork(s,rawWork),'malformed optional work still belongs to a readable reading order');eq(changeThreadWork(s,rawWork,'reference').echoes,rawEcho,'ordinary387 edits retain malformed optional data');
for(const mutate of [x=>x.v=2,x=>x.left='foreign',x=>x.lens='unknown',x=>x.links.push({...x.links[0],left:x.links[0].right,right:x.links[0].left}),x=>delete x.links[0],x=>x.teachingSeen=study.demo.steps.length+1,x=>x.referenceShown=1]){const bad=clone(extraConnected.echoes);mutate(bad);eq(readThreadEchoWork(s,{...w,echoes:bad}).status,'unavailable');}
// Actual Notes and Keep retain optional material, including raw future fields and unfinished choices.
const echoBook=initializeExplorerState(freshState());echoBook.opaque={original:'unchanged'};
eq(keepThreadReading(echoBook,s,echoHelp,actual),'thread-reading-1');eq(keepThreadReading(echoBook,s,oneSide,actual),'thread-reading-2');eq(keepThreadReading(echoBook,s,same,actual),'thread-reading-3');eq(keepThreadReading(echoBook,s,rawWork,actual),'thread-reading-4');eq(keepThreadReading(echoBook,oldSource,w,actual),'thread-reading-5');
const echoRoundtrip=prepareProgressImport(pretty(echoBook));ok(echoRoundtrip.ok);eq(echoRoundtrip.state.threadReadings,echoBook.threadReadings,'full source-owned study/material/support/raw fields survive actual Notes');eq(echoRoundtrip.state.opaque,echoBook.opaque);
const copiedWork=clone(echoBook.threadReadings[0].work),editedCopy=changeThreadEcho(s,copiedWork,'setleft',ids[2]);eq(echoBook.threadReadings[0].work,echoHelp,'new copy edit leaves original saved bytes exact');eq([editedCopy.echoes.referenceShown,editedCopy.echoes.teachingSeen],[true,study.demo.steps.length],'help remains sticky on copies');
for(const cb of [()=>false,()=>1,()=>{throw Error('no');}]){const before=clone(echoBook);eq(keepThreadReading(echoBook,s,capacity,{canExport:cb}),false);eq(echoBook,before,'echo material adds no fallback writer on refusal');}
const echoBefore=clone(echoBook);ok(keepThreadReading(echoBook,s,capacity,{canExport:c=>{c.threadReadings[0].source.echoStudy.title='changed';c.threadReadings.at(-1).work.echoes.links.length=0;c.opaque.original='bad';return true;}}));eq(echoBook.threadReadings.slice(0,-1),echoBefore.threadReadings,'destructive callback cannot alter old source/study/work');eq(echoBook.threadReadings.at(-1).work.echoes.links.length,165);eq(echoBook.opaque,echoBefore.opaque);
console.log(`Two Threads: ${count} structural maps, immutable echo material, retained history and actual Notes checks passed.`);
