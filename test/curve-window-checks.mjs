// Invented windows only. Independent BigInt and polynomial expectations.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as c from '../dist/curve-window-core.mjs';
import {curveCases,makeCurveSource} from '../dist/curve-window-content.mjs';
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
function q(n,d=1){n=BigInt(n);d=BigInt(d);let a=n<0n?-n:n,b=d;while(b)[a,b]=[b,a%b];return {n:Number(n/a),d:Number(d/a)};}
const sign=x=>Math.sign(x.n),multiply=(a,b)=>q(BigInt(a.n)*BigInt(b.n),BigInt(a.d)*BigInt(b.d));
const s=makeCurveSource(),w=c.newCurveWork(s),compare=(probe4=-16)=>({page:'compare',probe4});
const zeroes=(open,explain=false)=>({page:'zeroes',probe4:-16,zeroModelOpen:open,zeroExplainOpen:explain});
eq(w,{v:1,points:[],fold4:null,zeroIdea:'unsure',bands:[],referenceShown:false,crossingsShown:false,teachingShown:false});
for(const job of curveCases){const source=makeCurveSource(job.id);ok(c.validCurveSource(source));ok(source.teaching.every(p=>c.validCurveExample(p.example)));ok(c.validCurveWork(source,c.newCurveWork(source)));}
const historical={...copy(s),id:'Earlier square rule',axes:{xMin:-8,xMax:8,yMin:-16,yMax:144,xTick:1,yTick:16},plotXs:[-8,0,8],future:{literal:true}};
for(let h=-3;h<=3;h++)for(let k=-9;k<=9;k++){
 const model={...copy(historical),h,k,plotXs:[-8,h,8]};ok(c.validCurveSource(model));
 const ref=c.curveReference(model,-32,{zeroes:true});eq(ref.vertex,{x:h,y:k});eq(ref.zeroes.count,k<0?2:k===0?1:0);
 for(let x4=-32;x4<=32;x4+=5){const r=c.curveCalculation(model,x4);eq(r.changed,q(x4-4*h,4));eq(r.square,q((x4-4*h)**2,16));eq(r.y,q((x4-4*h)**2+16*k,16));}
 // The control has an independent product form, proving coefficient identity.
 const L=-8,R=8,yl=(L-h)**2+k,yr=(R-h)**2+k,cy=(L-h)*(R-h)+k;
 eq(ref.curve.left.y,q(yl));eq(ref.curve.control.y,q(cy));eq(ref.curve.right.y,q(yr));
 eq(2*(cy-yl),2*(L-h)*(R-L));eq(yl-2*cy+yr,(R-L)**2);
 for(const b of ref.zeroes.bands){
  const a=c.curveCalculation(model,b.lo4).y,z=c.curveCalculation(model,b.hi4).y;
  ok(b.lo4<=b.hi4&&b.lo4>=-32&&b.hi4<=32);ok(sign(multiply(a,z))<=0);
  if(ref.zeroes.kind==='intervals'){eq(b.hi4-b.lo4,1);ok(b.hi4<=4*h||b.lo4>=4*h);ok(a.n!==0&&z.n!==0);}
  else{eq(b.lo4,b.hi4);eq(a,q(0));}
 }
}
const between=makeCurveSource('between'),roots=c.curveReference(between,-16,{zeroes:true}).zeroes;
eq(roots.bands,[{lo4:-10,hi4:-9},{lo4:1,hi4:2}]);eq(roots.endpoints.map(e=>e.y),[q(1,4),q(-7,16),q(-7,16),q(1,4)]);
const teaching=c.curveTeachingReference(s,5);eq(teaching.probe.y,q(-7,16));eq(teaching.zeroes.bands,[{lo4:-6,hi4:-5},{lo4:5,hi4:6}]);
const sparse={...copy(s),k:-9,axes:{...s.axes,yMin:-12},plotXs:[-4,0,4]},sw=c.newCurveWork(sparse);
eq(c.curveDisplayPairs(sparse,sw,{page:'plot'}),[]);eq(c.curveDisplayPairs(sparse,sw,compare()),[[4,4]]);
eq(c.curveDisplayPairs(sparse,sw,zeroes(false)),[]);eq(c.curveDisplayPairs(sparse,sw,zeroes(true)),[[4,4]]);eq(c.curveDisplayPairs(sparse,sw,zeroes(true,true)),[[3,3],[4,4]]);
ok(c.curveDisplayPairs(s,w,compare(7)).some(p=>p[0]===7));ok(c.curveDisplayPairs(s,w,compare(7)).some(p=>p[0]===4));eq(c.curveDisplayPairs(historical,c.newCurveWork(historical),compare(31)),[[4,4],[8,8]]);
for(const patch of [{h:4},{k:10},{plotXs:[-4,0,3]},{plotXs:[-4,0,0,4]},{plotXs:[-4,.5,4]},{id:'constructor'},{axes:{...s.axes,yMax:3}},{teaching:[{words:'one'},{},{words:'three'}]}])ok(!c.validCurveSource({...s,...patch}));
const oldExample=copy(s);oldExample.teaching[0].example={future:9};ok(c.validCurveSource(oldExample));eq(c.curveTeachingReference(oldExample,0),null);eq(c.curveDisplayPairs(oldExample,c.newCurveWork(oldExample),{page:'teaching',teachingPage:0}),[]);
delete oldExample.teaching[0].example;ok(c.validCurveSource(oldExample));eq(c.curveTeachingReference(oldExample,0),null);
let work=c.changeCurveWork(s,w,'add-point',{x:-4,y:26});work=c.changeCurveWork(s,work,'add-point',{x:-4,y:-6});work=c.changeCurveWork(s,work,'fold',3);work=c.changeCurveWork(s,work,'idea','none');work=c.changeCurveWork(s,work,'add-band',{lo4:-8,hi4:8});
ok(c.validCurveWork(s,work),'unexpected points and broad band are constructions, not wrong-save errors');
const unchanged=copy(work);eq(c.changeCurveWork(s,work,'add-band',{lo4:8,hi4:-8}),null);eq(work,unchanged);eq(c.changeCurveWork(s,work,'add-point',{x:.25,y:0}),null);
work.future={literal:'held'};work.bands[0].future=true;work=c.changeCurveWork(s,work,'replace-band',{index:0,lo4:0,hi4:0});ok(work.bands[0].future);
for(const action of ['reference','zeroes','teaching'])work=c.changeCurveWork(s,work,action);
work=c.changeCurveWork(s,work,'fold',null);ok(work.referenceShown&&work.crossingsShown&&work.teachingShown);eq(work.future,{literal:'held'});
ok(c.validCurveWork(s,{...w,crossingsShown:true,referenceShown:false}),'historical request flags validate independently');
const book={other:{raw:true}};eq(c.keepCurveSheet(book,s,work,yes),'curve-sheet-1');const first=copy(book.curveSheets[0]);work.points[0].y=0;eq(book.curveSheets[0],first);
const mixed={curveSheets:[first,{id:'curve-sheet-900',future:true},{...copy(first),id:'curve-sheet-777'},{...copy(first),id:'curve-sheet-777'},null]};eq(c.curveSheetsView(mixed).items.map(r=>r.readable),[true,false,false,false,false]);eq(c.keepCurveSheet(mixed,s,w,yes),'curve-sheet-901');
for(const suffix of ['999999','1000000','9007199254740993']){const b={curveSheets:[{id:'curve-sheet-'+suffix}]},prev=copy(b);eq(c.keepCurveSheet(b,s,w,yes),false);eq(b,prev);}
for(const raw of [null,{},'future']){const b={curveSheets:raw},prev=copy(b);eq(c.keepCurveSheet(b,s,w,yes),false);eq(b,prev);}
for(const opts of [{},{canExport:()=>false},{canExport:()=>1},{canExport:()=>{throw Error('invented');}}]){const b={other:true},prev=copy(b);eq(c.keepCurveSheet(b,s,w,opts),false);eq(b,prev);}
const hostile={other:{held:true}};ok(c.keepCurveSheet(hostile,s,w,{canExport(candidate){candidate.curveSheets=[];candidate.other=null;return true;}}));eq(hostile.other,{held:true});eq(hostile.curveSheets.length,1);
// Actual app Notes report and exposure callback, not a reduced surrogate.
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const decl=app.match(/^function notesReport\(notebook\)\{.*\}$/m)[0],report=Function('recommendations','explorerStore',decl+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const canExport=b=>prepareProgressImport(JSON.stringify(report(b),null,2)).ok;
const exposeDecl=app.match(/function exposeStoryFacts\([\s\S]*?\n}\n/)[0];
const expose=Function('noteLegacyExposure','noteGardenFactExposure','notePendingBrambleFactExposure','checkin','return ('+exposeDecl+');')(noteLegacyExposure,noteGardenFactExposure,notePendingBrambleFactExposure,checkin);
const opts={canExport,exposeFacts:(pairs,target)=>expose({facts:pairs},null,target,true,false)},fresh=()=>initializeExplorerState(freshState());
const state=fresh();state.broad.drafts.waiting={question:{fact:[3,3]},attempts:[],raw:'held'};const visit=startPostOffice(state,deliveries[0].id);ok(startAdaptiveRival(state));visit.rival.task=generateRivalTask('multiply',3,3,0);const before=copy(state);
const shown=c.curveDisplayPairs(s,w,compare());ok(c.recordCurveDisplay(state,shown,opts).changed);ok(state.broad.drafts.waiting.knownFact);ok(state.postOffice.visits[0].rival.priorFactShown);eq(state.broad.drafts.waiting.attempts,[]);eq(state.baseline.observations,before.baseline.observations);ok(!Object.hasOwn(state,'curveSheets'));
eq(c.recordCurveDisplay(state,shown,{...opts,canExport:()=>false}),{ok:true,changed:false},'already-qualified no-op is not a second capacity gate');
state.broad.drafts.newWaiting={question:{fact:[3,3]},attempts:[]};ok(c.recordCurveDisplay(state,shown,opts).changed);ok(state.broad.drafts.newWaiting.knownFact);
const node=Object.values(storyNodes).find(n=>n.facts?.length&&n.facts.every(p=>p[0]!==p[1]));ok(node);const garden=fresh();garden.garden.visits.push({id:'invented',entrance:node.entrance,drafts:{[node.id]:{attempts:[],raw:'held'}}});const heldGarden=copy(garden.garden);ok(c.recordCurveDisplay(garden,shown,opts).ok);eq(garden.garden,heldGarden,'unrelated actual Garden question is not falsely marked by square facts');
const waiting=()=>{const b=fresh();b.broad.drafts.waiting={question:{fact:[3,3]},attempts:[]};return b;};
for(const options of [{...opts,canExport:()=>false},{...opts,canExport:()=>1},{...opts,exposeFacts:()=>{throw Error('invented');}}]){const b=waiting(),old=copy(b);eq(c.recordCurveDisplay(b,shown,options),{ok:false,changed:false});eq(b,old);}
const captured=waiting();ok(c.recordCurveDisplay(captured,shown,{...opts,canExport(b){b.broad=null;b.curveSheets=[];return true;}}).ok);ok(captured.broad.drafts.waiting.knownFact);ok(!Object.hasOwn(captured,'curveSheets'));
const transfer=fresh();transfer.curveSheets=copy(mixed.curveSheets);transfer.syntheticOther={literal:'held'};eq(c.keepCurveSheet(transfer,s,w,{canExport}),'curve-sheet-902');const restored=prepareProgressImport(JSON.stringify(report(transfer),null,2));ok(restored.ok);eq(restored.state.curveSheets,transfer.curveSheets);eq(restored.state.syntheticOther,transfer.syntheticOther);
// The raw notebook fits, but actual pretty Notes metadata makes disclosure too large.
const cap=waiting();cap.padding='';const proposal=copy(cap);ok(c.recordCurveDisplay(proposal,shown,{...opts,canExport:()=>true}).changed);const room=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(proposal,null,2)).length-40;cap.padding='x'.repeat(room);proposal.padding=cap.padding;ok(recoveryFitsProgressLimits(proposal));ok(!canExport(proposal));const oldCap=copy(cap);eq(c.recordCurveDisplay(cap,shown,opts),{ok:false,changed:false});eq(cap,oldCap);
const keepCap=fresh();keepCap.padding='';const kept=copy(keepCap);ok(c.keepCurveSheet(kept,s,w,yes));const keepRoom=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(kept,null,2)).length-40;keepCap.padding='x'.repeat(keepRoom);kept.padding=keepCap.padding;ok(recoveryFitsProgressLimits(kept));ok(!canExport(kept));const oldKeep=copy(keepCap);eq(c.keepCurveSheet(keepCap,s,w,{canExport}),false);eq(keepCap,oldKeep);
console.log('Curve Window: exact graphs, source-owned proposals, exposure boundaries and actual Notes checks passed.');
