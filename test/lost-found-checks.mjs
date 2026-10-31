// Spec 333: the ladder mystery's checker, saved root, extensions and real Notes preflight.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {lostFoundCopy as T,makeLadderSource} from '../dist/lost-found-content.mjs';
import * as C from '../dist/lost-found-core.mjs';
import {lostFoundPage,lostFoundNotes,lostFoundSummary} from '../dist/lost-found-ui.mjs';
const clone=structuredClone;
const report=s=>({title:'After the Storm: observations',note:'Synthetic Lost and Found checks.',exportedAt:'2026-10-31T12:00:00.000Z',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic report'},...s});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const options={canExport},fresh=()=>initializeExplorerState(freshState());
const ANSWER={pip:['bucket','orchard'],bramble:['rope','footbridge'],miller:['ladder','mill-roof']};
export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},yes=r=>{ok(r.ok,JSON.stringify(r));return r;};
 const refused=(s,fn)=>{const before=clone(s);eq(fn().ok,false);eq(s,before,'a refusal leaves the notebook unchanged');};
 // The enumerator reproduces the spec's counts from the frozen source.
 const src=makeLadderSource(),all=C.activeClues(src,2);ok(C.validSource(src));
 eq(C.arrangements(src).length,36);eq(C.fitting(src,all.slice(0,2)).length,4);eq(C.fitting(src,C.activeClues(src,1)).length,2);eq(C.fitting(src,all).length,1);
 eq(all.map((_,i)=>C.fitting(src,all.filter((__,j)=>j!==i)).length),[2,2,2,2]);eq(C.fitting(src,all)[0],ANSWER);eq(all.map(c=>c.id),['roof','rope','pip','ladder-roof']);
 ok(new TextEncoder().encode(JSON.stringify(src)).length<=32*1024);
 // Does it fit? order, active round only, never the answer.
 eq(C.checkAnswer(src,1,null).result,'missing');eq(C.checkAnswer(src,1,{pip:['bucket',null],bramble:['rope','footbridge'],miller:['ladder','mill-roof']}).result,'missing');
 eq(C.checkAnswer(src,1,{pip:['rope','orchard'],bramble:['rope','footbridge'],miller:['ladder','orchard']}).result,'duplicate');
 eq(C.checkAnswer(src,1,{pip:['bucket','footbridge'],bramble:['rope','orchard'],miller:['ladder','mill-roof']}).result,'rope');
 eq(C.checkAnswer(src,1,{pip:['bucket','mill-roof'],bramble:['rope','footbridge'],miller:['ladder','orchard']}).result,'roof');
 const ladderPip={pip:['ladder','orchard'],bramble:['rope','footbridge'],miller:['bucket','mill-roof']};
 eq(C.checkAnswer(src,1,ladderPip).result,'fits','round 1 ignores the round-2 clue');eq(C.checkAnswer(src,2,ladderPip).result,'ladder-roof');eq(C.checkAnswer(src,2,ANSWER).result,'fits');
 // Another way that fits every round-1 clue and differs from the child's answer.
 for(const a of [null,ANSWER,ladderPip,{pip:['rope',null]}]){const w=C.anotherWay(src,a);ok(C.activeClues(src,1).every(c=>C.holds(c.pred,w)));if(a&&a.pip?.[1])ok(JSON.stringify(w)!==JSON.stringify(a));}
 eq(C.arrangementText(src,ladderPip),'Pip had the ladder at the orchard; Bramble had the rope at the footbridge; the miller had the bucket at the mill roof');
 // Rendering makes no write; Start sorting creates the root.
 const s=fresh(),before=clone(s);lostFoundPage(s);lostFoundNotes(s);C.lostFoundView(s);eq(s,before);ok(!Object.hasOwn(s,'mysteries'));
 yes(C.startLadder(s,options));eq(Object.keys(s.mysteries),['v','cases']);eq(s.mysteries.cases.ladder.round,1);eq(C.startLadder(s,options).changed,false);
 // Sort: kept as chosen, support recorded with it, never a constraint.
 yes(C.sortSentence(s,'pip-ladder','saw',options));const r=()=>s.mysteries.cases.ladder;eq(r().sort,{'pip-ladder':'saw'});eq(r().why,['pip-ladder']);
 eq(C.sortSentence(s,'pip-ladder','think',options).changed,false);eq(r().sort['pip-ladder'],'saw','a choice stays as chosen');
 refused(s,()=>C.sortSentence(s,'baker-ladder','saw',options));
 for(const [id,c] of [['miller-roof','think'],['miller-wind','saw'],['dot-bridge','think']])yes(C.sortSentence(s,id,c,options));
 ok(!C.roundSorted(r(),1));yes(C.sortForMe(s,options));eq(r().skipped,[1]);eq(r().why.length,5);eq(r().sort['pip-orchard'],undefined,'Sort them for me shows the authored sort without writing over the child');ok(C.roundSorted(r(),1));
 eq(C.checkAnswer(r().source,1,ladderPip).result,'fits','wrong sorts never change the clues');
 // Marks: the game never changes one; Clear removes only its grid.
 yes(C.setMark(s,'t:pip:ladder','no',options));yes(C.setMark(s,'p:miller:mill-roof','yes',options));r().marks['x:other']='yes';
 refused(s,()=>C.setMark(s,'t:nobody:ladder','yes',options));
 yes(C.answerTellYet(s,'yes',options));yes(C.nextClue(s,options));eq(r().marks['t:pip:ladder'],'no');eq(r().marks['p:miller:mill-roof'],'yes');
 eq(C.nextMark(null),'no');eq(C.nextMark('no'),'yes');eq(C.nextMark('yes'),null);
 yes(C.clearMarks(s,'t',options));eq(r().marks,{'p:miller:mill-roof':'yes','x:other':'yes'});
 // Answers and the first check, kept once with its support.
 yes(C.sortSentence(s,'baker-ladder','saw',options));for(const [row,[t,q]] of Object.entries(ladderPip)){yes(C.setAnswer(s,row,0,t,options));yes(C.setAnswer(s,row,1,q,options));}
 eq(yes(C.checkLadder(s,options)).result,'ladder-roof');eq(r().firstCheck,{round:2,answer:ladderPip,result:'ladder-roof',support:{why:true,skipped:true}});
 refused(s,()=>C.seeReveal(s,options));
 yes(C.setAnswer(s,'pip',0,'bucket',options));yes(C.setAnswer(s,'miller',0,'ladder',options));eq(yes(C.checkLadder(s,options)).result,'fits');eq(r().checks,2);eq(r().firstCheck.result,'ladder-roof','first check kept once');
 yes(C.seeReveal(s,options));yes(C.lookBack(s,'no',options));eq(C.lostFoundView(s).cases[0].status,'solved');
 eq(lostFoundSummary(C.lostFoundView(s)),'Lost and Found Board: Who borrowed what? solved, with sorting help.');
 const g=fresh();eq(lostFoundSummary(C.lostFoundView(g)),'Lost and Found Board: Who borrowed what? not started.');
 // The Why? on a first sort is recorded before it shows; a refused sort shows nothing and writes nothing.
 const w=fresh();yes(C.startLadder(w,options));refused(w,()=>C.sortSentence(w,'miller-roof','saw',{canExport:()=>false}));refused(w,()=>C.openWhy(w,'miller-roof',{canExport:()=>false}));
 // A retained source with no alternative or no unique final conclusion cannot supply this explanation.
 for(const damage of ['contradiction','decided-first','ambiguous-final']){
  const damaged=fresh();yes(C.startLadder(damaged,options));yes(C.sortForMe(damaged,options));yes(C.checkLadder(damaged,options));const dr=damaged.mysteries.cases.ladder;
  if(damage==='contradiction')dr.source.clues[1].pred={kind:'place',row:'miller',place:'orchard'};
  if(damage==='decided-first')dr.source.clues[3].round=1;
  if(damage==='ambiguous-final')dr.source.clues[3].pred={kind:'place',row:'miller',place:'mill-roof'};
  dr.skipped=[1];dr.tellYet='yes';const saved=clone(damaged.mysteries);
  ok(C.validCase(dr),'the original frozen source remains structurally readable: '+damage);
  ok(!C.caseWritable(dr),'unsupported explanation is read-only: '+damage);
  refused(damaged,()=>C.checkLadder(damaged,options));eq(damaged.mysteries,saved);eq(C.lostFoundView(damaged).cases[0].record.firstCheck,saved.cases.ladder.firstCheck,'historical check stays readable and is not regraded');
  eq(prepareProgressImport(JSON.stringify(report(damaged),null,2)).state.mysteries,saved,'raw damaged source survives actual Notes transfer');
 }
 eq(C.arrangementText(src,null),null,'no arrangement is not formatted as a proof');
 const decided=clone(src);decided.clues[3].round=1;eq(C.anotherWay(decided,ANSWER),null,'the same complete answer is not another way');
 // A frozen source resumes unchanged after content changes.
 const f=fresh();yes(C.startLadder(f,options));const fs=f.mysteries.cases.ladder.source;fs.title='An older title';fs.clues[0].text='The miller stayed up top.';fs.rows[2].label='Mill keeper';
 eq(C.lostFoundView(f).cases[0].source.title,'An older title');ok(C.lostFoundView(f).cases[0].writable);
 for(const x of fs.sentences.filter(x=>x.round===1))yes(C.sortSentence(f,x.id,x.sort,options));
 eq(C.checkAnswer(fs,1,{pip:['bucket','mill-roof'],bramble:['rope','footbridge'],miller:['ladder','orchard']}).clue.text,'The miller stayed up top.');
 // Unknown ids, extra fields, an unreadable case and an unknown v stay exact.
 const u=fresh();yes(C.startLadder(u,options));const L=u.mysteries.cases.ladder;L.sort.unknown='saw';L.marks['q:odd']='no';L.extra={kept:[1]};L.written=['later'];u.mysteries.cases.other={anything:true};u.mysteries.later=3;
 const ub=clone(u.mysteries);yes(C.sortSentence(u,'miller-roof','saw',options));const ua=clone(u.mysteries);delete ua.cases.ladder.sort['miller-roof'];ua.cases.ladder.why=[];ua.cases.ladder.at=ub.cases.ladder.at;eq(ua,ub,'unknown fields and ids preserved');
 eq(prepareProgressImport(JSON.stringify(report(u),null,2)).state.mysteries,u.mysteries,'import keeps the root exactly');
 const bad=fresh();yes(C.startLadder(bad,options));bad.mysteries.cases.ladder.checks=2;const badRoot=clone(bad.mysteries);eq(C.lostFoundView(bad).cases[0].status,'unreadable');
 refused(bad,()=>C.sortSentence(bad,'miller-roof','saw',options));refused(bad,()=>C.startLadder(bad,options));ok(lostFoundPage(bad).length);eq(bad.mysteries,badRoot);
 const v=fresh();v.mysteries={v:4,later:true};eq(C.lostFoundView(v).status,'unsupported');refused(v,()=>C.startLadder(v,options));ok(lostFoundPage(v).includes('uses a format this version cannot read'));ok(lostFoundNotes(v).includes('Download')||lostFoundNotes(v).length);
 for(const value of [null,0,'x',[],{v:1,cases:[]},{v:1,cases:{ladder:7}}]){const y=fresh();y.mysteries=value;ok(typeof lostFoundNotes(y)==='string');ok(typeof lostFoundPage(y)==='string');}
 // setAside and unknown rounds.
 const a=fresh();yes(C.startLadder(a,options));for(const x of a.mysteries.cases.ladder.source.sentences.filter(x=>x.round===1))yes(C.sortSentence(a,x.id,x.sort,options));yes(C.checkLadder(a,options));
 a.mysteries.cases.ladder.setAside=['ladder-roof'];const ab=clone(a.mysteries);ok(!C.lostFoundView(a).cases[0].writable);refused(a,()=>C.checkLadder(a,options));eq(a.mysteries,ab);
 const imported=prepareProgressImport(JSON.stringify(report(a),null,2));ok(imported.ok);refused(imported.state,()=>C.checkLadder(imported.state,options));eq(imported.state.mysteries,ab);
 a.mysteries.cases.ladder.setAside=[];ok(C.lostFoundView(a).cases[0].writable);yes(C.checkLadder(a,options));
 // Inert I HEARD sorts and unknown answer rows: kept exactly, the case stays writable, and Check reads only the declared rows.
 const h=fresh();yes(C.startLadder(h,options));for(const x of h.mysteries.cases.ladder.source.sentences.filter(x=>x.round===1))yes(C.sortSentence(h,x.id,x.sort,options));
 h.mysteries.cases.ladder.sort.future='heard';h.mysteries.cases.ladder.answer={future:{kept:true},pip:['bucket','orchard'],bramble:['rope','footbridge'],miller:['ladder','mill-roof']};
 const hi=prepareProgressImport(JSON.stringify(report(h),null,2));ok(hi.ok);eq(hi.state.mysteries,h.mysteries,'I HEARD and unknown rows import exactly');ok(C.lostFoundView(hi.state).cases[0].writable,'I HEARD leaves the case writable');
 yes(C.checkLadder(hi.state,options));eq(hi.state.mysteries.cases.ladder.firstCheck.result,'fits','unknown rows are not checked');eq(hi.state.mysteries.cases.ladder.answer.future,{kept:true});eq(hi.state.mysteries.cases.ladder.sort.future,'heard');
 eq(C.checkAnswer(h.mysteries.cases.ladder.source,2,{future:{kept:true},pip:['ladder','orchard'],bramble:['rope','footbridge'],miller:['bucket','mill-roof']}).result,'ladder-roof');
 const k=fresh();yes(C.startLadder(k,options));k.mysteries.cases.ladder.source.clues[3].round=3;ok(C.lostFoundView(k).cases[0].status==='started'&&!C.lostFoundView(k).cases[0].writable);refused(k,()=>C.sortSentence(k,'miller-roof','saw',options));
 // Real preflight refusal: the capacity limit, on an existing notebook.
 const q=fresh();yes(C.startLadder(q,options));q.filler='x'.repeat(MAX_IMPORT_BYTES);refused(q,()=>C.sortSentence(q,'miller-roof','saw',options));eq(C.sortSentence(q,'miller-roof','saw',options).error,'capacity');
 // Copy: every string is on the 333 sheet or 122's companion, the companion lines match 122 exactly, no em-dash.
 const flat=f=>readFileSync(new URL(f,import.meta.url),'utf8').replace(/\*\*/g,'');const s333=flat('../docs/content/333-lost-and-found-first-slice-text.md'),s122=flat('../docs/content/122-lost-and-found-text.md');
 const plain=x=>x.replace(/\*\*/g,'');
 const fromSheet=[T.title,T.laterVisit,T.reopenSteps,T.why,T.cluesRule,T.choose,T.unreadable,T.unknownVersion,T.notesLink,T.capacity,...Object.values(T.status),'Whoever had the ladder was on the mill roof.'];
 for(const x of fromSheet)ok(s333.includes(x),'333 sheet: '+x);
 const from122=[...T.firstVisit,...T.steps,T.next,T.startSorting,T.saw,T.think,T.skip,T.skipped,T.cellHelp,T.listMode,T.clear,T.clearAsk,T.clearYes,T.clearNo,T.clues,T.answerStep,T.check,T.reveal,T.fits,T.broken,T.missing,T.duplicate,T.tellQuestion,T.tellYes,T.tellNot,T.tellNotLine,T.tellYesLine,T.nextClue,T.hubLink,T.invitation,...T.grownUps.map(x=>x.replace(/\*/g,'')),src.note,src.worked,...src.reveal,src.lookingBack.question,...src.lookingBack.choices.flatMap(c=>[c.label,c.response]),...src.sentences.flatMap(x=>[x.text.slice(1,-1),x.why,x.writer]),...src.clues.filter(c=>c.round===1).map(c=>c.text)];
 for(const x of from122)ok(s122.replace(/\*/g,'').includes(plain(x).replace(/\*/g,'')),'122 companion: '+x);
 const every=JSON.stringify([T,src]);ok(!every.includes('—'),'no em-dash');
 return n;
}
if(import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Lost and Found checks: ${runChecks()} passed.`);
