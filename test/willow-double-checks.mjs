import assert from 'node:assert/strict';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {doubleSource} from '../dist/willow-double-content.mjs';
import * as D from '../dist/willow-double-core.mjs';
import {doublePage,doubleCheckNotes} from '../dist/willow-double-ui.mjs';

let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;};
const state=()=>initializeExplorerState(freshState());
const report=s=>({title:'Synthetic notes',exportedAt:'2026-10-22T00:00:00.000Z',note:'Synthetic only',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
const fits=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const started=(connector='one-or-both')=>{const s=state();ok(D.startDouble(s,fits));ok(D.selectDoubleConnector(s,connector,fits));return s;};
const run=(s,confirmed=false)=>{for(let i=0;i<3;i++)ok(D.stepDouble(s,fits));ok(D.stepDouble(s,fits,confirmed));return D.doubleView(s).result;};

{
 const s=state(),before=structuredClone(s);ok(D.validDoubleSource(doubleSource));doublePage(s);doubleCheckNotes(s);eq(s,before,'render and notes allocate no root');ok(!doublePage(s).includes('data-double-parcel="star-blue"'));
 ok(D.startDouble(s,fits));eq(s.willowDoubleCheck.connector,null);eq(s.willowDoubleCheck.phase,'ready');ok(!D.stepDouble(s,fits));ok(doublePage(s).includes('data-double-parcel="circle-blue"'));
 const imported=prepareProgressImport(JSON.stringify(report(s),null,2));ok(imported.ok);eq(imported.state.willowDoubleCheck.connector,null,'partial source survives import');
}
for(const connector of ['both','one-or-both'])for(const p of doubleSource.parcels){
 const s=started(connector);ok(D.selectDoubleParcel(s,p.id,fits));ok(D.predictDouble(s,'unsure',fits));
 ok(D.stepDouble(s,fits));eq(s.willowDoubleCheck.phase,'stamp');ok(!D.predictDouble(s,'lantern',fits),'prediction freezes after disclosure');
 ok(D.stepDouble(s,fits));eq(s.willowDoubleCheck.phase,'wrap');ok(D.stepDouble(s,fits));eq(s.willowDoubleCheck.phase,'combined');
 const o=D.doubleOutcome(s.willowDoubleCheck.source,connector,p.id);eq(o.stampYes,p.stamp==='star');eq(o.wrapYes,p.wrap==='blue');eq(o.combinedYes,connector==='both'?p.stamp==='star'&&p.wrap==='blue':p.stamp==='star'||p.wrap==='blue');
 ok(D.stepDouble(s,fits));const v=D.doubleView(s);ok(v.resultAvailable);eq(v.result.actualBasket,o.combinedYes?'lantern':'leaf');eq(v.result.requestedBasket,p.stamp==='star'||p.wrap==='blue'?'lantern':'leaf');eq(v.result.practiceOnly,true);eq(v.result.prediction,'unsure');
 const a=structuredClone(v.result);ok(D.selectDoubleConnector(s,connector==='both'?'one-or-both':'both',fits));eq(s.willowDoubleCheck.phase,'ready');eq(s.willowDoubleCheck.prediction,null);eq(D.doubleView(s).readable[0].check,a,'connector edit does not regrade prior run');
}
{
 const s=started('both');D.selectDoubleParcel(s,'star-yellow',fits);const first=run(s);eq(first.actualBasket,'leaf');eq(first.requestedBasket,'lantern');
 ok(D.restartDouble(s,fits));ok(D.selectDoubleConnector(s,'one-or-both',fits));const second=run(s);eq(second.actualBasket,'lantern');eq(second.requestedBasket,'lantern');
 eq(D.doubleView(s).readable[0].check,first,'changing only connector keeps old source/outcome');
 const old=structuredClone(s.willowDoubleCheck);s.willowDoubleCheck.checks.at(-1).actualBasket='wrong';const v=D.doubleView(s);ok(!v.resultAvailable,'malformed final slot does not borrow older matching run');eq(v.readable.length,1);ok(doublePage(s,'trace').includes('This earlier result cannot be read here'));ok(!doublePage(s,'trace').includes('Your rule sent Yellow parcel'));
 ok(D.restartDouble(s,fits));eq(s.willowDoubleCheck.checks.at(-1).actualBasket,'wrong','restart retains raw last slot');eq(s.willowDoubleCheck.checks[0],old.checks[0]);
}
{
 const s=started();D.selectDoubleParcel(s,'circle-yellow',fits);run(s);const first=structuredClone(D.doubleView(s).result),original=structuredClone(s.willowDoubleCheck.source);
 doubleSource.request='Changed current author request';doubleSource.parcels[3].title='Changed author title';try{eq(s.willowDoubleCheck.source,original);eq(D.doubleView(s).result.requestedBasket,'leaf');ok(doublePage(s,'trace').includes(original.request));}finally{doubleSource.request=original.request;doubleSource.parcels[3].title=original.parcels[3].title;}
 ok(D.restartDouble(s,fits));s.willowDoubleCheck.source.parcels[3].title='Older source title';s.willowDoubleCheck.source.text.requestMatch='Earlier author wording.';ok(D.doubleView(s).readable[0].check.source.parcels[3].title===first.source.parcels[3].title);run(s);eq(D.doubleView(s).readable[0].check.source.parcels[3].title,'Yellow parcel, circle stamp');eq(D.doubleView(s).result.source.parcels[3].title,'Older source title');ok(doublePage(s,'trace').includes('Earlier author wording.'));
 const altered=structuredClone(s.willowDoubleCheck.source);altered.parcels=[{...altered.parcels[0],id:'own-card',title:'Older own card',stamp:'circle',wrap:'yellow'}];altered.baskets=[{id:'basket-a',label:'Old A'},{id:'basket-b',label:'Old B'}];altered.requestRule={connector:'both',then:'basket-a',else:'basket-b'};altered.clues=[{id:'old-stamp',feature:'stamp',value:'circle',label:'a circle stamp',question:'Circle stamp?'},{id:'old-wrap',feature:'wrap',value:'yellow',label:'a yellow wrap',question:'Yellow wrap?'}];altered.future={raw:'<synthetic>'};ok(D.validDoubleSource(altered),'historical wording, IDs and harmless raw fields are admitted');
 const custom=state();ok(D.startDouble(custom,fits));custom.willowDoubleCheck.source=altered;custom.willowDoubleCheck.selectedParcel='own-card';ok(D.selectDoubleConnector(custom,'both',fits));const result=run(custom);eq(result.actualBasket,'basket-a');eq(result.requestedBasket,'basket-a');ok(doublePage(custom,'trace').includes('Older own card'));ok(!doublePage(custom,'trace').includes('<synthetic>'));eq(result.source.future,altered.future);
}
{
 const s=started();for(let i=0;i<8;i++){run(s);ok(D.restartDouble(s,fits));}
 eq(D.doubleView(s).readable.length,8);for(let i=0;i<3;i++)ok(D.stepDouble(s,fits));const before=structuredClone(s);ok(!D.stepDouble(s,fits),'ninth run requires confirmation');eq(s,before);ok(D.stepDouble(s,fits,true));eq(D.doubleView(s).readable.length,8);eq(D.doubleView(s).readable[0].check.id,2,'exactly oldest readable removed');
 const raw={id:10,bad:'<img src=x onerror=alert(1)>'};s.willowDoubleCheck.checks.splice(2,0,raw);ok(D.restartDouble(s,fits));for(let i=0;i<3;i++)ok(D.stepDouble(s,fits));ok(D.stepDouble(s,fits,true));eq(s.willowDoubleCheck.checks.find(x=>x.bad),raw,'raw sibling retained');eq(D.doubleView(s).result.id,11,'occupied raw ID skipped');eq(D.doubleView(s).unreadable.length,1);ok(!doubleCheckNotes(s).includes('<img src=x'));
 const oversized=state();ok(D.startDouble(oversized,fits));oversized.willowDoubleCheck.checks=structuredClone([...s.willowDoubleCheck.checks,...s.willowDoubleCheck.checks.slice(0,4).map((c,i)=>({...c,id:12+i}))]);oversized.willowDoubleCheck.checks.sort((a,b)=>(a.id||0)-(b.id||0));oversized.willowDoubleCheck.nextCheck=100;eq(D.doubleView(oversized).status,'ready','oversized imported history is not normalized');ok(D.doubleView(oversized).readable.length>8);const snap=structuredClone(oversized);doublePage(oversized,'trace');eq(oversized,snap);
}
{
 const s=started(),post=structuredClone(s.postOffice),prior=structuredClone(s.willowDoubleCheck);ok(D.startDouble(s,fits,true));eq(s.willowDoubleCheck.retainedRaw,prior);eq(s.postOffice,post);
 const nested=structuredClone(s.willowDoubleCheck);ok(D.startDouble(s,fits,true));eq(s.willowDoubleCheck.retainedRaw,nested);
 for(const raw of [null,7,'<synthetic>',{version:2,source:'later',retainedRaw:['old']}]){const t=state();t.willowDoubleCheck=raw;const importResult=prepareProgressImport(JSON.stringify(report(t),null,2));ok(importResult.ok);eq(importResult.state.willowDoubleCheck,raw);ok(!doubleCheckNotes(t).includes('<synthetic>'));ok(D.startDouble(t,fits,true));eq(t.willowDoubleCheck.retainedRaw,raw);}
}
{
 const s=started();const before=structuredClone(s);ok(!D.supportDouble(s,'helpOpened',()=>false));eq(s,before);ok(!D.selectDoubleParcel(s,'star-yellow',()=>false));eq(s,before);ok(!D.stepDouble(s,()=>false));eq(s,before);
 for(let i=0;i<3;i++)ok(D.stepDouble(s,fits));const atCombined=structuredClone(s);ok(!D.stepDouble(s,()=>false));eq(s,atCombined);
 s.willowDoubleCheck.nextCheck=Number.MAX_SAFE_INTEGER;const max=structuredClone(s);ok(!D.stepDouble(s,fits));eq(s,max,'ID exhaustion is atomic');
 const last=structuredClone(s);last.willowDoubleCheck.nextCheck=Number.MAX_SAFE_INTEGER-1;ok(D.stepDouble(last,fits),'last ID with a safe next value remains usable');eq(last.willowDoubleCheck.checks.at(-1).id,Number.MAX_SAFE_INTEGER-1);eq(last.willowDoubleCheck.nextCheck,Number.MAX_SAFE_INTEGER);
 const t=started();for(let i=0;i<3;i++)ok(D.stepDouble(t,fits));const expected=structuredClone(t);ok(D.stepDouble(expected,()=>true));const size=x=>new TextEncoder().encode(JSON.stringify(x,null,2)).length;
 const added=size(report(expected))-size(report(t));ok(added>2);t.padding='x'.repeat(Math.max(0,MAX_IMPORT_BYTES-size(report(t))-Math.floor(added/2)));ok(fits(t),'pre-state and actual notes report fit');const beforeCap=structuredClone(t);ok(!D.stepDouble(t,fits),'actual report limit blocks final append');eq(t,beforeCap);
}
console.log(`${checks} Willow Double Check finite rows, source, history, recovery and preflight checks passed.`);
