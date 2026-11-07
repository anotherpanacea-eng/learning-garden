// Invented algebra only. BigInt fractions provide independent numerical expectations.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as c from '../dist/rule-mixer-core.mjs';
import {mixerCases,makeMixerSource} from '../dist/rule-mixer-content.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {noteGardenFactExposure} from '../dist/garden-core.mjs';
import {notePendingBrambleFactExposure,startAdaptiveRival,generateRivalTask} from '../dist/post-rival.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {checkin} from '../dist/content.mjs';
import {storyNodes} from '../dist/story-content.mjs';
const eq=assert.deepEqual,ok=assert.ok,copy=structuredClone,yes={canExport:()=>true};
function q(n,d=1){n=BigInt(n);d=BigInt(d);if(d<0n){n=-n;d=-d;}let a=n<0n?-n:n,b=d;while(b)[a,b]=[b,a%b];return {n:Number(n/a),d:Number(d/a)};}
const evaluate=(r,p)=>q(BigInt(r.a)*BigInt(p.x.n)*BigInt(p.y.d)+BigInt(r.b)*BigInt(p.y.n)*BigInt(p.x.d),BigInt(p.x.d)*BigInt(p.y.d));
const s=makeMixerSource(),w=c.newMixerWork(s),view=(page,patch={})=>({page,previewOpen:true,checkOpen:true,referenceOpen:true,teachingPage:0,...patch});
eq(w,{v:1,factors:[1,1],op:'add',pair:null,previewShown:false,checkShown:false,referenceShown:false,teachingShown:false,note:''});
const expected={sum:{x:q(4),y:q(3)},difference:{x:q(4),y:q(1)},scale:{x:q(2),y:q(3)},thirds:{x:q(4,3),y:q(4,3)}};
for(const job of mixerCases){
 const source=makeMixerSource(job.id),work=c.newMixerWork(source);ok(c.validMixerSource(source));ok(c.validMixerWork(source,work));
 const ref=c.mixerReference(source);eq(ref.kind,job.id==='separated'?'none':job.id==='repeated'?'line':'one');
 if(expected[job.id]){eq(ref.pair,expected[job.id]);eq(ref.check.kind,'both');eq(c.checkMixerPair(source,ref.pair).kind,'both');}
 for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)for(const op of ['add','subtract']){
  const r=c.mixRows(source,[a,b],op),sign=op==='add'?1:-1;
  eq(r.row,{a:a*source.rows[0].a+sign*b*source.rows[1].a,b:a*source.rows[0].b+sign*b*source.rows[1].b,c:a*source.rows[0].c+sign*b*source.rows[1].c});
  eq(r.scaled.map(r=>[r.a,r.b,r.c]),source.rows.map((r,i)=>['a','b','c'].map(k=>(i===0?a:b)*r[k])));
  for(const p of r.products){eq(p.value,p.left*p.right);eq(p.pair,p.left!==0&&p.right!==0&&Math.abs(p.left)<=12&&Math.abs(p.right)<=12?[Math.abs(p.left),Math.abs(p.right)]:null);}
  if(a===0&&b===0){eq(r.kind,'tautology');eq(r.tautology,'uninformative');eq(r.lost,[0,1]);}
  if((a===0)!==(b===0))ok(r.kind==='one'||r.kind==='two','one surviving nondegenerate row cannot disappear');
  if(r.kind==='tautology'&&a!==0&&b!==0){eq(ref.kind,'line');eq(r.tautology,'line');}
  if(r.kind==='contradiction')eq(ref.kind,'none');
 }
 for(const page of source.teaching){ok(c.validMixerExample(page.example));const e=page.example;if(e.pair&&e.check)eq(c.checkMixerPair({...source,rows:e.rows},e.pair).kind,e.factors.every(x=>x===0)?'neither':'both');}
}
eq(c.mixRows(makeMixerSource('sum'),[1,1],'add').row,{a:2,b:0,c:8});
eq(c.mixRows(makeMixerSource('difference'),[1,1],'subtract').row,{a:1,b:0,c:4});
eq(c.mixRows(makeMixerSource('scale'),[1,2],'add').row,{a:7,b:0,c:14});
eq(c.mixRows(makeMixerSource('separated'),[2,1],'subtract').kind,'contradiction');
eq(c.mixRows(makeMixerSource('repeated'),[2,1],'subtract').tautology,'line');
// Historical own-source rows exercise both reference elimination branches, axis-only,
// negative coefficients, inconsistent proportional columns and exact fractional results.
const old={...copy(s),id:'Historical rules',title:'Earlier title',future:{literal:true}};
const vectors=[];for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)if(a||b)vectors.push([a,b]);
for(const [a,b] of vectors)for(const [d,e] of vectors)for(const [f,g] of [[4,7],[0,0],[-24,24]]){
 const source={...old,rows:[{label:'Same label',a,b,c:f},{label:'Same label',a:d,b:e,c:g}]};ok(c.validMixerSource(source));
 const ref=c.mixerReference(source),D=a*e-d*b,ca=a*g-d*f,cb=b*g-e*f;
 eq(ref.determinant.value,D);eq(ref.crossA.value,ca);eq(ref.crossB.value,cb);eq(ref.kind,D?'one':ca===0&&cb===0?'line':'none');
 if(D){
  const p={x:q(f*e-g*b,D),y:q(a*g-d*f,D)};eq(ref.pair,p);eq(ref.check.kind,'both');
  eq(evaluate(source.rows[0],p),q(f));eq(evaluate(source.rows[1],p),q(g));
  if(ref.mix)ok(ref.solves[0].coefficient>0,'sign-normalized elimination has positive surviving coefficient');
  else eq(new Set(ref.solves.map(s=>s.variable)),new Set(['x','y']));
 }else{eq(ref.pair,null);ok(ref.mix);ok(ref.mix.factors.every(x=>x!==0),'D0 route keeps original nonzero factors');}
}
for(const [p,kind] of [[{x:q(4),y:q(3)},'both'],[{x:q(7),y:q(0)},'first'],[{x:q(1),y:q(0)},'second'],[{x:q(0),y:q(0)},'neither']]){
 const result=c.checkMixerPair(s,p);eq(result.kind,kind);result.rows.forEach((r,i)=>{eq(r.sum,evaluate(s.rows[i],p));eq(r.ax.numerator.value,s.rows[i].a*p.x.n);eq(r.by.numerator.value,s.rows[i].b*p.y.n);});
}
eq(c.checkMixerPair(s,null),null);eq(c.checkMixerPair(s,{x:{n:2,d:2},y:q(3)}),null);
let work=c.changeMixerWork(s,w,'pair',{x:{n:8,d:6,future:'x'},y:{n:0,d:12}});eq(work.pair,{x:{n:4,d:3,future:'x'},y:q(0)});
work.future={held:true};for(const action of ['preview','check','reference','teaching'])work=c.changeMixerWork(s,work,action);
work=c.changeMixerWork(s,work,'pair',null);ok(work.checkShown&&work.previewShown&&work.referenceShown&&work.teachingShown);eq(work.future,{held:true});ok(c.validMixerWork(s,work));
const prior=copy(work);eq(c.changeMixerWork(s,work,'check'),null);eq(c.changeMixerWork(s,work,'factor',{index:0,value:4}),null);eq(c.changeMixerWork(s,work,'note','x'.repeat(1501)),null);eq(work,prior);
ok(c.validMixerWork(s,{...w,note:'🌱'.repeat(1500)}));ok(!c.validMixerWork(s,{...w,note:'🌱'.repeat(1501)}));
for(const patch of [{id:'constructor'},{title:''},{rows:[{label:'A',a:0,b:0,c:3},s.rows[1]]},{rows:[{label:'A',a:7,b:0,c:3},s.rows[1]]},{rows:[{label:'A',a:1,b:0,c:25},s.rows[1]]},{teaching:[{words:'one'},{words:'two'}]},{teaching:[{words:'one'},{words:''},{words:'three'}]}])ok(!c.validMixerSource({...s,...patch}));
const sparse=copy(s);delete sparse.rows[0];ok(!c.validMixerSource(sparse));
const inherited=Object.create(s);ok(!c.validMixerSource(inherited));
ok(!c.validMixerWork(s,{...w,pair:{x:{n:0,d:2},y:q(1)}}));ok(!c.validMixerWork(s,{...w,pair:{x:q(25),y:q(1)}}));
const brokenExample=copy(s);brokenExample.teaching[0].example={future:true};ok(c.validMixerSource(brokenExample));eq(c.mixerDisplayPairs(brokenExample,w,view('teaching')),[]);ok(c.mixerDisplay(brokenExample,w,view('teaching')).teaching.unavailable);
delete brokenExample.teaching[0].example;ok(c.validMixerSource(brokenExample));eq(c.mixerDisplayPairs(brokenExample,w,view('teaching')),[]);
// Only products of the actually visible layer are qualified; sticky flags are history.
const factSource=makeMixerSource('scale'),factWork={...c.newMixerWork(factSource),factors:[1,3],pair:{x:q(2),y:q(3)},previewShown:true,checkShown:true,referenceShown:true};
eq(c.mixerDisplayPairs(factSource,factWork,view('mix',{previewOpen:false})),[]);
eq(c.mixerDisplayPairs(factSource,factWork,view('pair',{checkOpen:false})),[]);
eq(c.mixerDisplayPairs(factSource,factWork,view('explain',{referenceOpen:false})),[]);
eq(c.mixerDisplayPairs(factSource,factWork,view('mix')),[[1,1],[1,2],[1,8],[3,3],[3,1]]);
eq(c.mixerDisplayPairs(factSource,factWork,view('pair')),[[1,2],[2,3],[3,2],[1,3]]);
eq(c.mixerDisplayPairs(factSource,factWork,view('teaching')) ,[[1,1],[1,6],[1,2],[1,4]]);
eq(Object.keys(c.mixerDisplay(factSource,factWork,view('pair'))),['check']);
const wide={...old,rows:[{label:'A',a:6,b:-6,c:24},{label:'B',a:-5,b:1,c:-24}]},ww={...c.newMixerWork(wide),factors:[0,-3],pair:{x:q(24,11),y:q(0)}};
eq(c.mixerDisplayPairs(wide,ww,view('mix')),[[3,5],[3,1]],'zero operands and constants above 12 yield no magnitude fact');
eq(c.mixerDisplayPairs(wide,ww,view('pair')),[],'large coordinate numerator is not a small fact; denominator conversions are unshown');
const book={other:{raw:true}};eq(c.keepMixerSheet(book,old,work,yes),'rule-mix-1');const first=copy(book.ruleMixerSheets[0]);old.title='Changed local title';work.note='Changed local writing';eq(book.ruleMixerSheets[0],first);
const mixed={ruleMixerSheets:[first,{id:'rule-mix-900',future:true},{...copy(first),id:'rule-mix-777'},{...copy(first),id:'rule-mix-777'},null]};
eq(c.mixerSheetsView(mixed).items.map(r=>r.readable),[true,false,false,false,false]);eq(c.keepMixerSheet(mixed,s,w,yes),'rule-mix-901');
for(const suffix of ['999999','1000000','9007199254740993']){const b={ruleMixerSheets:[{id:'rule-mix-'+suffix}]},prev=copy(b);eq(c.keepMixerSheet(b,s,w,yes),false);eq(b,prev);}
for(const raw of [null,{},'future']){const b={ruleMixerSheets:raw},prev=copy(b);eq(c.keepMixerSheet(b,s,w,yes),false);eq(b,prev);}
for(const opts of [{},{canExport:()=>false},{canExport:()=>1},{canExport:()=>{throw Error('invented');}}]){const b={other:true},prev=copy(b);eq(c.keepMixerSheet(b,s,w,opts),false);eq(b,prev);}
const hostile={other:{held:true}};ok(c.keepMixerSheet(hostile,s,w,{canExport(candidate){candidate.ruleMixerSheets=[];candidate.other=null;return true;}}));eq(hostile.other,{held:true});eq(hostile.ruleMixerSheets.length,1);
// Actual app Notes serialization and waiting-question callback, not a surrogate.
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const decl=app.match(/^function notesReport\(notebook\)\{.*\}$/m)[0],report=Function('recommendations','explorerStore',decl+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const canExport=b=>prepareProgressImport(JSON.stringify(report(b),null,2)).ok;
const exposeDecl=app.match(/function exposeStoryFacts\([\s\S]*?\n}\n/)[0];
const expose=Function('noteLegacyExposure','noteGardenFactExposure','notePendingBrambleFactExposure','checkin','return ('+exposeDecl+');')(noteLegacyExposure,noteGardenFactExposure,notePendingBrambleFactExposure,checkin);
const opts={canExport,exposeFacts:(pairs,target)=>expose({facts:pairs},null,target,true,false)},fresh=()=>initializeExplorerState(freshState());
const shown=c.mixerDisplayPairs(factSource,factWork,view('mix'));
const state=fresh();state.broad.drafts.waiting={question:{fact:[3,3]},attempts:[],raw:'held'};const visit=startPostOffice(state,deliveries[0].id);ok(startAdaptiveRival(state));visit.rival.task=generateRivalTask('multiply',3,3,0);const before=copy(state);
ok(c.recordMixerDisplay(state,shown,opts).changed);ok(state.broad.drafts.waiting.knownFact);ok(state.postOffice.visits[0].rival.priorFactShown);eq(state.broad.drafts.waiting.attempts,[]);eq(state.baseline.observations,before.baseline.observations);ok(!Object.hasOwn(state,'ruleMixerSheets'));
eq(c.recordMixerDisplay(state,shown,{...opts,canExport:()=>false}),{ok:true,changed:false});
state.broad.drafts.newWaiting={question:{fact:[3,3]},attempts:[]};ok(c.recordMixerDisplay(state,shown,opts).changed);ok(state.broad.drafts.newWaiting.knownFact);
const eligible=new Set(shown.flatMap(([a,b])=>[`${a},${b}`,`${b},${a}`]));
const node=Object.values(storyNodes).find(n=>n.facts?.length&&n.facts.every(p=>!eligible.has(p.join(','))));ok(node);
const garden=fresh();garden.garden.visits.push({id:'invented',entrance:node.entrance,drafts:{[node.id]:{attempts:[],raw:'held'}}});const heldGarden=copy(garden.garden);ok(c.recordMixerDisplay(garden,shown,opts).ok);eq(garden.garden,heldGarden);
const waiting=()=>{const b=fresh();b.broad.drafts.waiting={question:{fact:[3,3]},attempts:[]};return b;};
for(const options of [{...opts,canExport:()=>false},{...opts,canExport:()=>1},{...opts,exposeFacts:()=>{throw Error('invented');}}]){const b=waiting(),old=copy(b);eq(c.recordMixerDisplay(b,shown,options),{ok:false,changed:false});eq(b,old);}
const captured=waiting();ok(c.recordMixerDisplay(captured,shown,{...opts,canExport(b){b.broad=null;b.ruleMixerSheets=[];return true;}}).ok);ok(captured.broad.drafts.waiting.knownFact);ok(!Object.hasOwn(captured,'ruleMixerSheets'));
const transfer=fresh();transfer.ruleMixerSheets=copy(mixed.ruleMixerSheets);transfer.syntheticOther={literal:'held'};eq(c.keepMixerSheet(transfer,s,w,{canExport}),'rule-mix-902');const restored=prepareProgressImport(JSON.stringify(report(transfer),null,2));ok(restored.ok);eq(restored.state.ruleMixerSheets,transfer.ruleMixerSheets);eq(restored.state.syntheticOther,transfer.syntheticOther);
// Actual pretty Notes can fail while the raw notebook remains below its limit.
const cap=waiting();cap.padding='';const proposal=copy(cap);ok(c.recordMixerDisplay(proposal,shown,{...opts,canExport:()=>true}).changed);const room=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(proposal,null,2)).length-40;cap.padding='x'.repeat(room);proposal.padding=cap.padding;ok(recoveryFitsProgressLimits(proposal));ok(!canExport(proposal));const oldCap=copy(cap);eq(c.recordMixerDisplay(cap,shown,opts),{ok:false,changed:false});eq(cap,oldCap);
const keepCap=fresh();keepCap.padding='';const kept=copy(keepCap);ok(c.keepMixerSheet(kept,s,w,yes));const keepRoom=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(kept,null,2)).length-40;keepCap.padding='x'.repeat(keepRoom);kept.padding=keepCap.padding;ok(recoveryFitsProgressLimits(kept));ok(!canExport(kept));const oldKeep=copy(keepCap);eq(c.keepMixerSheet(keepCap,s,w,{canExport}),false);eq(keepCap,oldKeep);
console.log('Rule Mixer: exact row operations, own-source work, visible arithmetic and actual Notes/given-math boundaries passed.');
