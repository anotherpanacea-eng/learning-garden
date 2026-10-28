import assert from 'node:assert/strict';
import fs from 'node:fs';
import {bothCases,bothInputMessage} from '../dist/balance-both-content.mjs';
import * as B from '../dist/balance-both-core.mjs';
import {freshState,recommendations,restoreStateResult} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {noteGardenFactExposure} from '../dist/garden-core.mjs';
import {notePendingBrambleFactExposure} from '../dist/post-rival.mjs';
import {checkin} from '../dist/content.mjs';
import {startPrice,setPriceField,preparePriceDisplay} from '../dist/slope-equation-core.mjs';
let count=0,oracleCases=0,maximumReportBytes=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(v,m)=>{assert.ok(v,m);count++;},copy=x=>structuredClone(x);
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const exposureSource=app.slice(app.indexOf('function exposeStoryFacts('),app.indexOf('function requestParis('));
const expose=new Function('noteLegacyExposure','noteGardenFactExposure','notePendingBrambleFactExposure','checkin',exposureSource+';return exposeStoryFacts;')(noteLegacyExposure,noteGardenFactExposure,notePendingBrambleFactExposure,checkin);
const report=new Function('recommendations','explorerStore',app.split('\n').find(l=>l.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const options={exposeFacts:(facts,s)=>expose({facts},null,s,true),canExport:s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok};
const make=(id=bothCases[0].id)=>{const s=initializeExplorerState(freshState());ok(B.startBoth(s,id,options));return s;};
const work=s=>B.bothView(s).work;
const scalar=(s,p,P)=>p.parcels*P+p.units+p.bags*(P+s.bagUnits);
const relation=(a,b)=>a===b?'equal':a>b?'left':'right';
const ops=[...['parcel-pair','unit-pair','open-left','open-right','parcel-left','parcel-right','unit-left','unit-right'].map(kind=>({kind})),...[2,3,4,5].map(groups=>({kind:'share',groups}))];
// Independent count oracle: no core model/change helper computes expectations.
function oracle(s,live,o){const next={left:copy(live.left),right:copy(live.right)},{kind,groups}=o;
 if(kind==='share'){if(next.left.bags||next.right.bags||Object.values(next).every(x=>x.parcels===0&&x.units===0)||Object.values(next).some(x=>x.parcels%groups||x.units%groups))return null;for(const pan of Object.values(next)){pan.parcels/=groups;pan.units/=groups;}return next;}
 if(kind.startsWith('open-')){const p=next[kind.slice(5)];if(!p.bags)return null;p.bags--;p.parcels++;p.units+=s.bagUnits;return next;}
 const [item,where]=kind.split('-'),field=item==='parcel'?'parcels':'units',targets=where==='pair'?Object.values(next):[next[where]];if(targets.some(p=>p[field]===0))return null;for(const p of targets)p[field]--;return next;
}
function verify(s,live,o){const original=copy(live),expect=oracle(s,live,o),result=B.bothChange(s,live,o);oracleCases++;
 eq(result.ok,expect!==null);if(expect){eq(result.live,expect);const left=scalar(s,expect.left,s.parcelMass),right=scalar(s,expect.right,s.parcelMass);eq(result.model,{left,right,relation:relation(left,right)});if(o.kind==='share'||o.kind.endsWith('pair')||o.kind.startsWith('open'))eq(result.model.relation,relation(scalar(s,live.left,s.parcelMass),scalar(s,live.right,s.parcelMass)));}eq(live,original,'pure changes and refusals preserve input');}
function pans(bagUnits){const all=[];for(let parcels=0;parcels<=5;parcels++)for(let units=0;units<=20;units++)for(let bags=0;bags<=3;bags++)if(parcels+bags<=5&&units+bags*bagUnits<=20)all.push({parcels,units,bags});return all;}
// Exhaustive pairs at authored bag units and mass, including both orientations,
// every removal/opening and all four whole-group divisors (1,338,672 calls).
{
 const s=copy(bothCases[0]);s.guided=[];s.example=[];s.learn=[{text:'General statement',facts:[]}];const all=pans(2);
 for(const left of all)for(const right of all)for(const o of ops)verify(s,{left,right},o);
}
// All admitted masses and bag contents, with every representable pan. Unary
// operations and relation arithmetic vary independently of the opposite pan.
for(let bagUnits=0;bagUnits<=4;bagUnits++)for(let parcelMass=1;parcelMass<=12;parcelMass++){
 const s={...copy(bothCases[0]),bagUnits,parcelMass,start:{left:{parcels:0,units:0,bags:0},right:{parcels:0,units:0,bags:0}},guided:[],example:[],learn:[{text:'General',facts:[]}]};
 for(const left of pans(bagUnits)){const right={parcels:5-left.parcels,units:20-left.units,bags:0};for(const o of ops)verify(s,{left,right},o);}
}
for(const [i,s] of bothCases.entries()){ok(B.validBothSource(s));eq(B.bothModel(s,s.start),{left:[16,15,21,18][i],right:[16,15,21,18][i],relation:'equal'});}
for(const s of bothCases){const state=make(s.id);const original=copy(work(state).source);let r;
 if(s.id==='bags-of-three')for(let i=0;i<3;i++)ok(B.moveBoth(state,{kind:'open-left'},options).ok);
 for(let i=0;i<Math.min(s.start.left.parcels+s.start.left.bags,s.start.right.parcels+s.start.right.bags);i++)ok(B.moveBoth(state,{kind:'parcel-pair'},options).ok);
 const units=Math.min(work(state).live.left.units,work(state).live.right.units);for(let i=0;i<units;i++)ok(B.moveBoth(state,{kind:'unit-pair'},options).ok);
 const groups=Math.max(work(state).live.left.parcels,work(state).live.right.parcels);if(groups>1)ok(B.moveBoth(state,{kind:'share',groups},options).ok);
 ok(B.bothIsolated(work(state).source,work(state).live));r=B.checkBoth(state,{kind:'arrangement',raw:''},options);ok(r.recorded);eq(r.proposal,null);eq(r.valueMatch,null);eq(r.isolated,true);eq(work(state).draft,'');
 r=B.checkBoth(state,{kind:'proposal',raw:String(s.parcelMass)},options);eq(r.valueMatch,true);eq(r.proposedModel,B.bothModel(s,s.start));eq(r.source,original);ok(B.validBothCheck(r));
 const frozen=copy(work(state).checks);ok(B.resetBoth(state,options));eq(work(state).live,s.start);eq(work(state).checks,frozen);eq(work(state).draft,'');eq(work(state).moves,[]);
}
{
 const s=make(),blank=copy(s);eq(B.bothView(initializeExplorerState(freshState())).status,'missing');B.bothView(s);B.bothFacts(s);eq(s,blank,'passive views pure');
 ok(B.setBothDraft(s,' 004 ',options));eq(work(s).draft,' 004 ');for(const raw of ['', ' ', '-4','4x','4.0','4.','1e1','100','１２','4\t','1234567890123']){const before=copy(s);const r=B.checkBoth(s,{kind:'proposal',raw},options);eq(r.recorded,false);eq(r.feedback,bothInputMessage);eq(s,before,'malformed actual input never checks earlier valid draft');}
 const r=B.checkBoth(s,{kind:'proposal',raw:'16'},options);eq(r.code,'pan-total');eq(r.valueMatch,false);eq(B.bothModel(work(s).source,work(s).live).relation,'equal','proposal never moves tilt');
 const first=copy(work(s).firstKept);for(let i=0;i<9;i++){const result=B.checkBoth(s,{kind:'proposal',raw:String(i)},options);ok(result.recorded);if(i>=7)ok(result.evicted&&result.feedback.includes('oldest readable'));}eq(work(s).checks.length,8);eq(work(s).firstKept,first);
 ok(B.startBoth(s,'both-sides-2',options));ok(B.moveBoth(s,{kind:'parcel-pair'},options).ok);ok(B.moveBoth(s,{kind:'parcel-pair'},options).ok);eq(B.checkBoth(s,{kind:'proposal',raw:'9'},options).code,'several-parcels');
}
{
 const s=make();ok(B.moveBoth(s,{kind:'parcel-left'},options).ok);eq(B.bothModel(work(s).source,work(s).live).relation,'right');const before=copy(work(s).live),row=copy(work(s).moves[0]);ok(B.setBothInspection(s,0,options));const snap=copy(s);ok(!B.moveBoth(s,{kind:'unit-pair'},options).ok);eq(s,snap);eq(work(s).moves[0],row);ok(B.setBothInspection(s,null,options));ok(B.undoBoth(s,options));eq(work(s).live,bothCases[0].start);eq(work(s).moves,[]);ok(!B.undoBoth(s,options));
 ok(B.moveBoth(s,{kind:'unit-left'},options).ok);eq(B.bothModel(work(s).source,work(s).live).relation,'right');const bad=copy(s);ok(!B.moveBoth(s,{kind:'share',groups:2},options).ok);eq(s,bad);
}
{
 const s=make();ok(B.setBothFolded(s,true,options));eq(B.bothFacts(s),[]);const seen=copy(work(s).support);ok(B.setBothFolded(s,false,options));eq(work(s).support,seen);for(let i=0;i<3;i++)ok(B.advanceBothLearn(s,options));ok(B.bothFacts(s).some(p=>p[0]===2&&p[1]===4));ok(!B.advanceBothLearn(s,options));
 for(const source of bothCases){ok(B.startBoth(s,source.id,options));const original=copy(work(s).live);ok(B.bothHelp(s,options));eq(work(s).helpStage,1);ok(work(s).support.hint);ok(B.bothHelp(s,options));eq(work(s).helpStage,2);ok(work(s).support.example);ok(B.bothHelp(s,options));eq(work(s).helpStage,3);ok(work(s).support.skip);eq(work(s).live,original);eq(work(s).checks.length,1);eq(work(s).checks[0].kind,'skipped');eq(work(s).checks[0].valueMatch,null);eq(work(s).firstKept,null);if(source.id==='bags-of-three')eq(B.bothFacts(s),[],'skip replaces the different worked example');const skipped=copy(work(s).checks[0]);ok(B.bothHelp(s,options));eq(work(s).helpStage,1);ok(work(s).support.skip);eq(work(s).checks,[skipped]);eq(work(s).firstKept,null);}
}
{
 const s=make('both-sides-3');ok(B.setBothDraft(s,'5',options));ok(B.noteBothSupport(s,'together',options));ok(B.noteBothSupport(s,'audio',options));ok(B.revealBoth(s,options));const before=copy(s);const display=B.prepareBothDisplay(s,options);ok(display.ok);eq(s,before,'idempotent exposure');ok(s.exposures.includes('4x5'),'source multiplication exposed');
 const old=copy(s);eq(B.prepareBothDisplay(s,{...options,canExport:()=>false}),{ok:false,changed:false});eq(s,old,'actual display preflight always required');
}
{
 const s=make('both-sides-2');s.balanceStall={version:99,raw:'synthetic earlier apparatus'};s.desk={synthetic:'pending desk'};s.postOffice={synthetic:'pending post'};s.balanceBoth.future={raw:'root preserved'};work(s).future={raw:'case preserved'};const raw=copy(s),ref=s.desk;
 for(const action of [()=>B.moveBoth(s,{kind:'parcel-pair'},{canExport:()=>false}),()=>B.setBothDraft(s,'3',{canExport:()=>false}),()=>B.bothHelp(s,{canExport:()=>false}),()=>B.startBoth(s,'both-sides-3',{canExport:()=>false}),()=>B.checkBoth(s,{kind:'proposal',raw:'3'},{canExport:()=>false})]){action();eq(s,raw,'failed mutation atomic');}
 ok(B.moveBoth(s,{kind:'parcel-pair'},options).ok);eq(s.desk,raw.desk);eq(s.desk,ref);eq(s.postOffice,raw.postOffice);eq(s.balanceStall,raw.balanceStall);eq(s.balanceBoth.future,raw.balanceBoth.future);eq(work(s).future,raw.balanceBoth.cases['both-sides-2'].future);
 const held=copy(work(s));s.balanceBoth.cases['both-sides-2']={future:'unreadable original'};ok(B.startBoth(s,'both-sides-3',options));eq(s.balanceBoth.cases['both-sides-2'],{future:'unreadable original'});ok(!B.startBoth(s,'both-sides-2',options));s.balanceBoth.cases['saved-unknown']=held;ok(B.startBoth(s,'saved-unknown',options));ok(B.bothView(s).cases.some(c=>c.id==='saved-unknown'));
 for(const payload of [null,[],4,{version:99,private:'retained raw'}]){s.balanceBoth=copy(payload);const original=copy(s);eq(B.bothView(s).status,'unavailable');ok(!B.startBoth(s,'both-sides-1',options));eq(s,original);eq(prepareProgressImport(JSON.stringify(report(s))).state.balanceBoth,payload);}
}
{
 const s=make('both-sides-2');B.checkBoth(s,{kind:'proposal',raw:'3'},options);const c=work(s).checks[0];c.valueMatch=false;c.isolated=true;c.model={left:80,right:0,relation:'right'};c.proposedModel={left:0,right:515,relation:'left'};c.feedback='Earlier contradictory recorded observations';const earlier=copy(c);work(s).source.parcelMass=7;work(s).source.question='Revised wording';ok(B.validBothWork(work(s)));eq(work(s).checks[0],earlier);ok(!B.bothCheckMatches(work(s)));const raw=copy(s.balanceBoth);eq(restoreStateResult(JSON.stringify(s)).state.balanceBoth,raw);eq(prepareProgressImport(JSON.stringify(report(s))).state.balanceBoth,raw,'real notes/report import preserves source and contradictory outcomes');
 work(s).checks.push({malformed:'raw check'});const broken=copy(s.balanceBoth.cases['both-sides-2']);eq(work(s),null);ok(!B.startBoth(s,'both-sides-2',options));ok(B.startBoth(s,'both-sides-3',options));eq(s.balanceBoth.cases['both-sides-2'],broken,'malformed checks stay raw, siblings open');
}
// Imported initial inequality: match against fixed mass and substitution relation
// are independent, including a wrong source mass that happens to balance.
{
 const s=make('both-sides-3');const w=work(s);w.source.parcelMass=4;w.source.start={left:{parcels:2,units:4,bags:0},right:{parcels:1,units:10,bags:0}};w.live=copy(w.source.start);eq(B.bothModel(w.source,w.live),{left:12,right:14,relation:'right'});
 let r=B.checkBoth(s,{kind:'proposal',raw:'6'},options);eq(r.valueMatch,false);eq(r.proposedModel,{left:16,right:16,relation:'equal'});eq(r.code,'try-substitution');ok(r.feedback.includes('not level'));eq(r.model.relation,'right');
 r=B.checkBoth(s,{kind:'proposal',raw:'4'},options);eq(r.valueMatch,true);eq(r.proposedModel,{left:12,right:14,relation:'right'});ok(r.feedback.includes('right pan'));eq(B.bothModel(work(s).source,work(s).live).relation,'right');
 const before=copy(s);ok(!B.checkBoth(s,{kind:'proposal',raw:'4x'},options).recorded);eq(s,before);
}
// Frozen ledger rows retain their own source/model across a source revision.
{
 const s=make('both-sides-3');ok(B.moveBoth(s,{kind:'parcel-left'},options).ok);const frozen=copy(work(s).moves[0]);work(s).source.parcelMass=1;ok(B.validBothWork(work(s)));eq(work(s).moves[0],frozen);ok(B.setBothInspection(s,0,options));eq(work(s).moves[0].model,frozen.model);
 const t=make('both-sides-2'),before=copy(t);const rejected={...options,exposeFacts:(pairs,c)=>{c.syntheticExposure=true;},canExport:()=>false};ok(!B.revealBoth(t,rejected));eq(t,before,'preflight sees helper changes on full clone and refuses atomically');
}
// Source admission bounds and exact authored worked products; no catalog-key
// equality or current-answer regrading enters admission.
{
 const s=copy(bothCases[0]);for(const mutate of [x=>x.parcelMass=0,x=>x.parcelMass=13,x=>x.bagUnits=5,x=>x.start.left.parcels=6,x=>x.start.left.bags=4,x=>x.start.left.units=21,x=>{x.start.left.parcels=5;x.start.left.bags=1;},x=>{x.start.left.units=20;x.start.left.bags=1;},x=>x.learn[0].facts=[[2,-1]]]){const source=copy(s);mutate(source);ok(!B.validBothSource(source));}
 eq(bothCases.map(s=>s.example.flatMap(l=>l.facts)),[[[2,4]],[[3,3]],[[3,4]],[[2,5]]]);
 const equations=[[2,4,2,1,6,10],[1,3,6,3,0,9],[3,4,2,1,10,14]];for(const [a,p,u,b,v,total] of equations){eq(a*p+u,total);eq(b*p+v,total);}eq(2*(4+1),4+6);eq(2*4+3,4+7);
 eq(B.bothSubstitution(bothCases[0],4),{left:'3 × 4 + 4',right:'4 + 12',model:{left:16,right:16,relation:'equal'}});
 eq(B.bothSubstitution(bothCases[3],4),{left:'3 × (4 + 2)',right:'4 + 14',model:{left:18,right:18,relation:'equal'}});
 const state=make('both-sides-2');ok(B.setBothGroups(state,5,options));eq(work(state).groups,5);const saved=copy(work(state));ok(B.startBoth(state,'both-sides-3',options));ok(B.startBoth(state,'both-sides-2',options));eq(work(state),saved);ok(!B.setBothGroups(state,6,options));
}
{
 const s=make('both-sides-2');work(s).source.start={left:{parcels:2,units:14,bags:3},right:{parcels:2,units:14,bags:3}};work(s).live=copy(work(s).source.start);
 for(const side of ['left','right']){for(let i=0;i<3;i++)ok(B.moveBoth(s,{kind:`open-${side}`},options).ok);for(let i=0;i<5;i++)ok(B.moveBoth(s,{kind:`parcel-${side}`},options).ok);for(let i=0;i<20;i++)ok(B.moveBoth(s,{kind:`unit-${side}`},options).ok);}
 eq(work(s).moves.length,56);const before=copy(s);ok(!B.moveBoth(s,{kind:'share',groups:2},options).ok);eq(s,before,'empty no-op never appends a path row');
}
{
 const s=make('both-sides-2'),before=copy(s);let cloneSeen=false;
 ok(!B.revealBoth(s,{...options,exposeFacts:(pairs,c)=>{cloneSeen=true;c.privateDraft='synthetic clone-only';},canExport:c=>!c.privateDraft}));ok(cloneSeen);eq(s,before);
 const passive=make('both-sides-2');ok(B.setBothFolded(passive,true,options));eq(B.bothFacts(passive),[]);eq(B.prepareBothDisplay(passive,{canExport:()=>false}),{ok:false,changed:false},'answer-bearing display gate also preflights zero-fact views');
 const old=copy(s);s.padding='x'.repeat(5*1024*1024);const full=copy(s);ok(!B.setBothDraft(s,'3',options));eq(s,full,'actual notes/import size limit refuses allocation without loss');delete s.padding;eq(s,old);
}
// Inspection hides all current teaching/help/reveal products, and selection
// exposes only the retained check actually rendered on the Kept page.
{
 const s=make();for(let i=0;i<3;i++)ok(B.advanceBothLearn(s,options));ok(B.revealBoth(s,options));ok(B.bothHelp(s,options));ok(B.bothHelp(s,options));ok(B.moveBoth(s,{kind:'parcel-pair'},options).ok);const current=copy(work(s).live);ok(B.setBothPage(s,'ledger',options));
 ok(B.setBothInspection(s,0,options));eq(work(s).page,'balance');eq(B.bothFacts(s),[],'earlier picture hides every current worked product');const inspected=copy(s);ok(!B.undoBoth(s,options));eq(s,inspected);ok(B.setBothInspection(s,null,options));eq(work(s).page,'balance');eq(work(s).live,current);ok(B.bothFacts(s).some(p=>p[0]===2&&p[1]===4));ok(B.undoBoth(s,options));eq(work(s).live,bothCases[0].start);
}
{
 const s=make('both-sides-3');for(const raw of ['5','6','7'])ok(B.checkBoth(s,{kind:'proposal',raw},options).recorded);eq(work(s).keptView,'latest');eq(B.bothFacts(s),[[4,7],[2,7]]);const history=copy({checks:work(s).checks,first:work(s).firstKept});
 ok(B.setBothKeptView(s,'first',options));eq(B.selectedBothCheck(work(s)),work(s).firstKept);eq(B.bothFacts(s),[[4,5],[2,5]]);ok(B.setBothKeptView(s,1,options));eq(B.bothFacts(s),[[4,6],[2,6]]);eq({checks:work(s).checks,first:work(s).firstKept},history,'reading retained checks never rewrites their observations');
 const before=copy(s);ok(!B.setBothKeptView(s,2,{...options,canExport:()=>false}));eq(s,before,'check selection and exposure preflight atomically');ok(!B.setBothKeptView(s,7,options));eq(s,before);
 work(s).keptView=7;const stale=copy(s);eq(B.selectedBothCheck(work(s)),work(s).checks.at(-1));eq(B.bothFacts(s),[[4,7],[2,7]]);eq(s,stale,'stale index pure fallback');delete work(s).keptView;const legacy=copy(s);eq(B.selectedBothCheck(work(s)),work(s).checks.at(-1));eq(s,legacy,'missing selection means latest without rewrite');
 ok(B.setBothKeptView(s,'first',options));ok(B.checkBoth(s,{kind:'proposal',raw:'8'},options).recorded);eq(work(s).keptView,'latest');eq(B.bothFacts(s),[[4,8],[2,8]]);
 const unshown=make('both-sides-3');B.checkBoth(unshown,{kind:'proposal',raw:'5'});B.checkBoth(unshown,{kind:'proposal',raw:'6'});unshown.exposures=[];const shown=[];ok(B.prepareBothDisplay(unshown,{...options,exposeFacts:(pairs,target)=>{shown.push(copy(pairs));target.exposures=[...new Set([...target.exposures,...pairs.map(p=>p.join('x'))])];}}).ok);eq(unshown.exposures,['4x6','2x6']);ok(shown.every(pairs=>JSON.stringify(pairs)===JSON.stringify([[4,6],[2,6]])),'unopened first check products never passed to host helper');
}
// Skip preserves access to this item's hint and worked example on return.
{
 const s=make('bags-of-three');ok(B.checkBoth(s,{kind:'arrangement',raw:''},options).recorded);const first=copy(work(s).firstKept),live=copy(work(s).live);ok(B.setBothPage(s,'balance',options));for(let i=0;i<3;i++)ok(B.bothHelp(s,options));const history=copy(work(s).checks);eq(work(s).helpStage,3);eq(B.bothFacts(s),[]);ok(B.bothHelp(s,options));eq(work(s).helpStage,1);eq(B.bothFacts(s),[]);ok(work(s).support.skip&&work(s).support.hint&&work(s).support.example);eq(work(s).checks,history);eq(work(s).firstKept,first);eq(work(s).live,live);ok(B.bothHelp(s,options));eq(work(s).helpStage,2);eq(B.bothFacts(s),[[2,5]]);eq(work(s).checks,history);eq(work(s).firstKept,first);
 const before=copy(s);ok(!B.bothHelp(s,{...options,canExport:()=>false}));eq(s,before,'repeat skip preflight remains atomic');
}
// New move rows keep only their frozen numeric model, while supported full
// historical sources and all unknown fields remain exact and readable.
{
 const s=make('both-sides-3');ok(B.moveBoth(s,{kind:'parcel-left'},options).ok);const r=work(s).moves[0];eq(r.source,{version:1,kind:'balance-both-row',id:'both-sides-3',parcelMass:5,bagUnits:2});eq(B.bothRowSource(r),r.source);eq(B.bothExpression(r.source,r.after,'left'),'3P + 1');eq(B.bothModel(r.source,r.after),{left:16,right:21,relation:'right'});ok(!B.validBothSource(r.source),'compact model is not a whole teaching/check source');
 r.source=copy(work(s).source);r.source.future={raw:'retained historical source'};r.source.parcelMass=9;r.model={left:0,right:80,relation:'left'};r.feedback='Stored historic relation stays as recorded';const old=copy(r);ok(B.validBothWork(work(s)));ok(B.checkBoth(s,{kind:'arrangement',raw:''},options).recorded);eq(work(s).checks[0].input.moves[0],old);const kept=copy(work(s).checks[0]);ok(B.setBothInspection(s,0,options));eq(work(s).moves[0],old);eq(B.bothRowSource(work(s).moves[0]),old.source);eq(prepareProgressImport(JSON.stringify(report(s),null,2)).state.balanceBoth,s.balanceBoth);eq(work(s).checks[0],kept,'inspection/import do not compact old full rows or regrade them');
}
// Proposed relations describe hypothetical arithmetic, never the real tilt.
{
 const s=make();for(const [raw,word] of [['5','left'],['3','right']]){const r=B.checkBoth(s,{kind:'proposal',raw},options);eq(r.code,'try-substitution');ok(r.feedback.includes(`The proposed ${word} total is greater.`));ok(!r.feedback.includes('is lower')&&!r.feedback.includes('model mass'));eq(r.model.relation,'equal');}
 const old=work(s).checks[0];old.feedback='The left pan has greater model mass and is lower.';const historical=copy(old);ok(B.checkBoth(s,{kind:'proposal',raw:'2'},options).recorded);eq(work(s).checks[0],historical,'saved feedback is not edited to new wording');
 const u=make('both-sides-3');work(u).source.parcelMass=4;work(u).source.start={left:{parcels:2,units:4,bags:0},right:{parcels:1,units:10,bags:0}};work(u).live=copy(work(u).source.start);const r=B.checkBoth(u,{kind:'proposal',raw:'6'},options);eq(r.code,'try-substitution');eq(r.valueMatch,false);eq(r.model.relation,'right');eq(r.proposedModel.relation,'equal');ok(r.feedback.includes('The proposed totals are equal.'));ok(!r.feedback.includes('is lower')&&!r.feedback.includes('model mass'));
}
// Genuine maximum forward paths in all four waiting cases, each retained in
// eight checks plus firstKept. Exercise the actual pretty notes/import gate at
// every move, record and repeated Skip; unrelated Price work must stay open.
{
 const s=initializeExplorerState(freshState());ok(startPrice(s,'bag',options));
 const measure=()=>{const text=JSON.stringify(report(s),null,2),bytes=Buffer.byteLength(text);maximumReportBytes=Math.max(maximumReportBytes,bytes);ok(bytes<MAX_IMPORT_BYTES);ok(prepareProgressImport(text).ok);return bytes;};
 for(const source of bothCases){ok(B.startBoth(s,source.id,options));work(s).source.start={left:{parcels:2,units:14,bags:3},right:{parcels:2,units:14,bags:3}};work(s).live=copy(work(s).source.start);
  for(const side of ['left','right']){for(let i=0;i<3;i++)ok(B.moveBoth(s,{kind:`open-${side}`},options).ok);for(let i=0;i<5;i++)ok(B.moveBoth(s,{kind:`parcel-${side}`},options).ok);for(let i=0;i<20;i++)ok(B.moveBoth(s,{kind:`unit-${side}`},options).ok);}
  eq(work(s).moves.length,56);for(let i=0;i<8;i++)ok(B.checkBoth(s,{kind:'arrangement',raw:''},options).recorded);eq(work(s).checks.length,8);eq(work(s).firstKept.input.moves.length,56);ok(work(s).checks.every(c=>c.input.moves.length===56));measure();
 }
 const full=copy(s.balanceBoth);eq(Object.keys(full.cases).length,4);ok(Object.values(full.cases).every(w=>w.moves.length===56&&w.checks.length===8&&w.firstKept.input.moves.length===56));
 for(const source of bothCases){ok(B.startBoth(s,source.id,options));const first=copy(work(s).firstKept);const ninth=B.checkBoth(s,{kind:'proposal',raw:String(source.parcelMass)},options);ok(ninth.recorded&&ninth.evicted&&ninth.feedback.includes('oldest readable'));eq(work(s).checks.length,8);eq(work(s).firstKept,first);ok(B.setBothPage(s,'balance',options));for(let cycle=0;cycle<9;cycle++){for(let stage=0;stage<3;stage++)ok(B.bothHelp(s,options));eq(work(s).checks.length,8);eq(work(s).firstKept,first);measure();}ok(work(s).checks.every(c=>c.kind==='skipped'));eq(work(s).moves.length,56);}
 const finalBytes=measure();ok(setPriceField(s,'m','2',options),'other bench can still preflight a write');ok(preparePriceDisplay(s,options).ok,'other bench can still preflight answer-bearing display');ok(B.setBothDraft(s,' 4 ',options),'current case remains editable');
 const old=copy(s);ok(!B.setBothDraft(s,'5',{...options,canExport:()=>false}));eq(s,old,'forced export refusal at maximum retention is atomic');const imported=prepareProgressImport(JSON.stringify(report(s),null,2));ok(imported.ok);eq(imported.state.balanceBoth,s.balanceBoth);
 console.log(`Maximum bounded retention: ${maximumReportBytes} peak pretty-report bytes; ${finalBytes} bytes after Skip cycling; limit ${MAX_IMPORT_BYTES}.`);
}
console.log(`Parcels on both pans: ${count} assertions passed; ${oracleCases} bounded action oracle cases. Browser, audio and educational-effect checks are separate.`);
