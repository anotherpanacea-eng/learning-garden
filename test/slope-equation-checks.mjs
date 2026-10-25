import assert from 'node:assert/strict';
import {priceCards} from '../dist/slope-equation-content.mjs';
import * as p from '../dist/slope-equation-core.mjs';
import {freshState,restoreStateResult} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {pricePage,priceNotes} from '../dist/slope-equation-ui.mjs';
let n=0;const ok=(b,msg)=>{assert.ok(b,msg);n++;},eq=(a,b,msg)=>{assert.deepEqual(a,b,msg);n++;};const clone=x=>structuredClone(x);
for(const source of priceCards){ok(p.validPriceSource(source));for(let x=0;x<=6;x++){eq(p.priceTotal(source,x),source.m*x+source.b);ok(p.priceTotal(source,x)<=20);}
 for(let m=0;m<=21;m++)for(let b=0;b<=21;b++)eq(p.evaluatePrice(source,'rule',{m:String(m),b:String(b)}).outcome,m===source.m&&b===source.b?'match':'different');
 for(let x=0;x<=30;x++)eq(p.evaluatePrice(source,'distance',{distance:String(x)}).outcome,p.priceTotal(source,x)===source.target?'match':'different');
 for(const bad of ['', '-1','4 km','4.2','4.5.','1e2','10000','Infinity','<b>4</b>']){eq(p.evaluatePrice(source,'rule',{m:bad,b:'0'}).outcome,'uncheckable');eq(p.evaluatePrice(source,'distance',{distance:bad}).outcome,'uncheckable');}
}
const make=()=>{const s=freshState();ok(p.startPrice(s,'bag'));return s;};
{
 const s=make(),original=clone(s);p.priceView(s);pricePage(s);priceNotes(s);eq(s,original,'passive render is pure');
 ok(p.setPricePage(s,1));ok(p.setPriceField(s,'m','3'));ok(p.setPriceField(s,'b','2'));const a=p.checkPrice(s,'rule');ok(a.feedback.includes('swapped'));eq(a.helpSeenBefore,[]);ok(a.supported);const first=clone(s.slopeBench.cases.bag.checks[0]);
 ok(p.showPriceHelp(s));p.setPriceField(s,'m','2');p.setPriceField(s,'b','3');const b=p.checkPrice(s,'rule');eq(b.outcome,'match');eq(b.helpSeenBefore,['page-1']);eq(s.slopeBench.cases.bag.checks[0],first,'later help does not rewrite earlier context');
 p.setPriceField(s,'m','');const before=clone(s);eq(p.checkPrice(s,'rule').recorded,false);eq(s,before,'input error is not an attempt');
 ok(p.setPricePage(s,3));ok(p.setPriceField(s,'note','A synthetic <script> note'));ok(p.keepPrice(s));const kept=clone(s.slopeBench.cases.bag.firstKept);p.setPriceField(s,'note','A second synthetic <script> note');ok(p.keepPrice(s));eq(s.slopeBench.cases.bag.firstKept,kept);eq(s.slopeBench.cases.bag.kept.noteKind,'typed');
 ok(pricePage(s).includes('&lt;script&gt;'));ok(priceNotes(s).includes('&lt;script&gt;'));eq(restoreStateResult(JSON.stringify(s)).state.slopeBench,s.slopeBench);eq(prepareProgressImport(JSON.stringify(s)).state.slopeBench,s.slopeBench,'actual import retains all frozen work');
 const saved=clone(s.slopeBench.cases.bag);ok(p.startPrice(s,'journey'));p.setPriceField(s,'b','0');p.checkPrice(s,'rule');p.startPrice(s,'bag');eq(s.slopeBench.cases.bag,saved,'card changes preserve waiting page/drafts/first snapshot');
}
{
 const s=make();s.desk={synthetic:'pending case'};s.postOffice={synthetic:'pending delivery'};s.slopeBench.extra={synthetic:1};s.slopeBench.cases.bag.extra={synthetic:'kept'};const before=clone(s);ok(!p.setPriceField(s,'m','2',{canExport:()=>false}));eq(s,before,'refused mutation atomic');ok(p.setPriceX(s,4));eq(s.desk,before.desk);eq(s.postOffice,before.postOffice);eq(s.slopeBench.extra,before.slopeBench.extra);eq(s.slopeBench.cases.bag.extra,before.slopeBench.cases.bag.extra);
 const held=clone(s.slopeBench.cases.bag);s.slopeBench.cases.bag={future:'raw'};ok(p.startPrice(s,'journey'),'bad sibling does not block another card');eq(s.slopeBench.cases.bag,{future:'raw'});ok(!p.startPrice(s,'bag'));s.slopeBench.cases.saved=held;ok(p.startPrice(s,'saved'),'unknown supported key can resume');ok(p.priceView(s).cards.some(c=>c.id==='saved'));eq(s.slopeBench.cases.saved,held);s.slopeBench.currentId='missing';eq(p.priceView(s).work,null);ok(p.startPrice(s,'journey'));
 s.slopeBench.version=99;const raw=clone(s);eq(p.priceView(s).status,'unavailable');ok(!p.startPrice(s,'bag'));ok(!p.setPricePage(s,1));eq(s,raw);ok(priceNotes(s).includes('retained unchanged'));
}
{
 const s=make();const w=s.slopeBench.cases.bag;p.setPriceField(s,'m','2');p.setPriceField(s,'b','3');p.checkPrice(s,'rule');const kept=clone(w.checks); // w is intentionally an old object; re-read live work.
 const oldChecks=clone(s.slopeBench.cases.bag.checks);s.slopeBench.cases.bag.source.m=1;s.slopeBench.cases.bag.source.target=7;eq(p.priceView(s).status,'ready');eq(s.slopeBench.cases.bag.checks,oldChecks,'saved result not regraded against altered source');
 const frozen=clone(s.slopeBench.cases.bag.source.comparison);p.startPrice(s,'journey');s.slopeBench.cases.journey.source.m=3;s.slopeBench.cases.journey.source.b=1;p.startPrice(s,'bag');eq(p.priceView(s).work.source.comparison,frozen,'comparison never reads sibling');
}
{
 const pair={...clone(priceCards[0]),m:2,b:2,target:10};ok(p.validPriceSource(pair));eq(p.evaluatePrice(pair,'rule',{m:'2',b:'2'}).outcome,'match','correct precedes swap');
 for(const edit of [s=>s.m=0,s=>s.b=4,s=>{s.m=3;s.b=3;},s=>s.target=10,s=>s.comparison.b=4,s=>s.comparison.explanation={},s=>s.id='__proto__']){const src=clone(priceCards[0]);edit(src);ok(!p.validPriceSource(src));}
 for(const source of priceCards){const x=source.target;const a=p.evaluatePrice(source,'distance',{distance:String(x)});ok(a.feedback.includes('total in coins'));ok(a.feedback.includes('0–6'));}
 ok(p.evaluatePrice(priceCards[2],'distance',{distance:'4'}).feedback.includes('14 coins'));
}
{
 const s=make(),before=clone(s);let calls=0;const expose=(pairs,target)=>{calls++;target.exposures=pairs.map(x=>x.join('x'));target.baseline.pendingSynthetic=true;};
 eq(p.preparePriceDisplay(s,{exposeFacts:expose,canExport:()=>false}),{ok:false,changed:false});eq(s,before,'exposure refusal leaves all pending state unchanged');eq(calls,1);
 const r=p.preparePriceDisplay(s,{exposeFacts:expose,canExport:c=>prepareProgressImport(JSON.stringify(c)).ok});ok(r.ok&&r.changed);ok(s.exposures.includes('2x4')&&s.exposures.includes('4x2'));eq(s.baseline.pendingSynthetic,true);const raw=clone(s.slopeBench);p.preparePriceDisplay(s,{exposeFacts:expose});eq(s.slopeBench,raw,'display changes no task responses');
 p.setPricePage(s,3);ok(p.priceFacts(s).some(x=>x[0]===2&&x[1]===6));s.slopeBench.version=99;eq(p.priceFacts(s),[]);
}
console.log(`Courier’s Price: ${n} finite math, draft, source, exposure and preservation assertions passed.`);
