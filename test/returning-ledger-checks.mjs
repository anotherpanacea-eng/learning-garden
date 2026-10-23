import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {returningCase} from '../dist/returning-orders-content.mjs';
import {startReturning,moveReturning,setReturningRaw,checkReturning,keepReturning,useReturningSupport,returningState} from '../dist/returning-orders-core.mjs';
import {freshRemains,moveRemains,remainsCounts,remainsSourceExamples,remainsResultExample,recordRemainsDisplay,startRemainsCase} from '../dist/returning-ledger-core.mjs';
import {prepareRemainsPage,resetRemains} from '../dist/returning-ledger-ui.mjs';
import {remainsCaptions} from '../dist/returning-ledger-content.mjs';
const fresh=()=>initializeExplorerState(freshState()),copy=structuredClone,report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-22T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
const raw=s=>JSON.stringify(report(s),null,2),fits=s=>prepareProgressImport(raw(s)).ok,bytes=s=>Buffer.byteLength(raw(s));
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
const actions=['open','close','return-ones','bring-ones','return-ten','bring-ten','place-ones','lift-ones','place-tens','lift-tens'];
for(const id of ['return-12','return-17']){
 const source=returningCase(id),seen=new Map(),q=[freshRemains(id)];while(q.length){const p=q.shift(),key=JSON.stringify(p);if(seen.has(key))continue;seen.set(key,p);const c=remainsCounts(source,p);eq(10*(c.tableTens+c.storeTens)+c.tableOnes+c.storeOnes,42,'every reachable state conserves one collection');eq(c.storeTens,p.stage==='returned'?1:0);eq(c.storeOnes,['ones-returned','returned'].includes(p.stage)?source.returnedOnes:0);if(p.tensPlaced)ok(p.onesPlaced&&p.stage==='returned');if(p.onesPlaced)ok(['ones-returned','returned'].includes(p.stage));for(const a of actions){const next=moveRemains(p,source,a);if(next)q.push(next);}}
 eq(seen.size,id==='return-12'?6:7,'exact finite mathematical states');
 const s=fresh();startReturning(s,id);moveReturning(s,'return-ten');setReturningRaw(s,'39');checkReturning(s);keepReturning(s);useReturningSupport(s,'together');setReturningRaw(s,'not yet');const old=copy(s.returningOrders.cases[id]);s.syntheticSibling={kept:'synthetic'};
 eq(startRemainsCase(s,id,fits).ok,true);eq(s.returningOrders.cases[id],old,'existing Start never marks familiar or rewrites old work');eq(s.returningOrders.shownBundleExamples,remainsSourceExamples(source));
 const before=copy(s);resetRemains();const page=prepareRemainsPage(s,'synthetic-owner',fits);ok(page.html.includes(`Return ${source.target}: one ten and ${source.returnedOnes===2?'two':'seven'} ones.`),'both target breakdown and source disclosed');eq(s,before,'already recorded source render is read-only');
 const p=moveRemains(id==='return-17'?moveRemains(freshRemains(id),source,'open'):freshRemains(id),source,'return-ones'),ones=moveRemains(p,source,'place-ones');eq(moveRemains(ones,source,'bring-ones'),null,'lift digits before changing their meaning');const returned=moveRemains(ones,source,'return-ten');ok(returned,'returning ten preserves ones digit');eq(moveRemains(returned,source,'bring-ten').onesPlaced,true);
 eq(recordRemainsDisplay(s,[remainsResultExample(source)],fits).ok,true);eq(s.returningOrders.cases[id],old);eq(s.syntheticSibling,{kept:'synthetic'});ok(fits(s));
 const inactive=copy(s);inactive.returningOrders.active=null;const oldInactive=copy(inactive);eq(startRemainsCase(inactive,id,fits).ok,true);eq(inactive,oldInactive,'inactive existing case selection changes neither active nor familiarity');
}
{
 const s=fresh(),before=copy(s);resetRemains();const v=prepareRemainsPage(s,'new',fits);ok(v.html.includes('Choose a return'));ok(!v.html.includes('remains-mark')&&!v.html.includes('one ten and'));eq(s,before,'numeric chooser creates no root');
 s.broad.drafts['activity:target']={question:{params:{type:'bundle',hundreds:0,tens:1,ones:7}},attempts:[3],input:'3',familiar:false};s.broad.drafts['activity:other']={question:{params:{type:'bundle',hundreds:0,tens:1,ones:2}},attempts:[4],input:'4',familiar:false};const other=copy(s.broad.drafts['activity:other']);eq(startRemainsCase(s,'return-17',fits).ok,true);eq(s.returningOrders.shownBundleExamples,['bundle:0:4:2','bundle:0:1:7']);eq(s.broad.drafts['activity:target'].familiar,true);eq(s.broad.drafts['activity:target'].attempts,[3]);eq(s.broad.drafts['activity:other'],other);
}
for(const root of [null,[],{version:99,synthetic:'raw'}]){const s=fresh();s.returningOrders=root;const before=copy(s);resetRemains();ok(prepareRemainsPage(s,'raw',fits).html.includes('unfamiliar format'));eq(startRemainsCase(s,'return-12',fits).ok,false);eq(s,before);eq(prepareProgressImport(raw(s)).state.returningOrders,root);}
{
 const s=fresh();startReturning(s,'return-17');s.returningOrders.shownBundleExamples=['bundle:0:4:2'];s.broad.drafts['activity:target']={question:{params:{type:'bundle',hundreds:0,tens:1,ones:7}},attempts:[17],input:'17',familiar:false};s.syntheticPadding='';s.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-bytes(s)-2);ok(fits(s));const before=copy(s);eq(recordRemainsDisplay(s,remainsSourceExamples(s.returningOrders.cases['return-17'].source),fits).ok,false,'source-already-seen target-new candidate exceeds actual pretty report');eq(s,before,'refused target and waiting familiarity remain unchanged');resetRemains();const p=prepareRemainsPage(s,'cap',fits);ok(p.refused&&!p.html.includes('remains-mark')&&!p.html.includes('Start: 42'),'initial refusal is source-free');eq(s,before);
}
for(const caps of remainsCaptions)for(const caption of caps.filter(Boolean))ok(fs.readFileSync(new URL('../docs/specs/110-write-what-remains.md',import.meta.url),'utf8').includes(caption),'all13 stage captions are exact reviewed copy');
console.log(`Write what remains: ${n} finite/state/exposure/report assertions passed.`);
