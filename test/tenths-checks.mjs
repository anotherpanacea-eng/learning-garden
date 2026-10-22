import assert from 'node:assert/strict';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {tenthsCases,tenthsNames} from '../dist/tenths-content.mjs';
import * as T from '../dist/tenths-core.mjs';
import {tenthsPage,tenthsNotes} from '../dist/tenths-ui.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(x,m)=>{assert.ok(x,m);count++;};
const seed=()=>initializeExplorerState(freshState()),preflight=s=>prepareProgressImport(JSON.stringify({title:'Synthetic report',exportedAt:'2026-10-22T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s},null,2)).ok;
{
 const s=seed(),before=structuredClone(s);tenthsPage(s);tenthsNotes(s);eq(s,before,'view never allocates');ok(!tenthsPage(s).includes('Seven tenths in decimal writing'),'chooser avoids translation title');eq(tenthsCases.length,8);
}
for(const source of tenthsCases){
 const initial=seed();ok(T.startTenths(initial,source.id));const frozen=structuredClone(initial.tenthsTable.cases[source.id].source);
 for(let mask=0;mask<1024;mask++){
  const s=structuredClone(initial);for(let i=0;i<10;i++)if(mask&(1<<i))ok(T.toggleTenthsPart(s,i));
  const v=T.tenthsView(s),selected=v.work.selected.length;eq(v.work.source,frozen);ok(T.checkTenths(s));const c=v.work.checks[0];eq(c.matches,selected===source.targetTenths);eq(c.support,[]);eq(c.familiar,false);ok(c.practiceOnly);ok(c.feedbackText.includes(tenthsNames(selected)));eq(T.tenthsView(s).status,'ready');
  const model=structuredClone(v.work.selected);if(model.length){ok(T.toggleTenthsPart(s,model[0]));eq(v.work.feedbackId,null,'edits hide feedback');}ok(T.clearTenths(s));eq(v.work.selected,[]);eq(c.selected.length,selected,'earlier response unchanged');
 }
}
{
 const s=seed();T.startTenths(s,'four-fraction');for(let i=0;i<4;i++)T.toggleTenthsPart(s,i);T.checkTenths(s);const first=structuredClone(T.tenthsView(s).work.checks[0]);eq(first.familiar,false);T.keepTenths(s);const kept=structuredClone(T.tenthsView(s).work.kept);
 for(let i=0;i<5;i++)T.checkTenths(s);eq(T.tenthsView(s).work.checks.length,4);eq(T.tenthsView(s).work.kept,kept);eq(kept.latestCheck.id,1);T.startTenths(s,'four-decimal');T.checkTenths(s);ok(T.tenthsView(s).work.checks[0].familiar,'same supplied amount carries across notation');eq(first.support,[]);eq(s.tenthsTable.cases['four-fraction'].checks.at(-1).support,['feedback']);
 T.supportTenths(s,'help');T.startTenths(s,'whole-decimal');T.checkTenths(s);ok(T.tenthsView(s).work.checks[0].familiar,'help supplied whole equivalence');ok(T.tenthsView(s).work.checks[0].feedbackText.includes('10/10 = 1.0 = 1'));T.tenthsView(s).work.nextCheckId=Number.MAX_SAFE_INTEGER;const old=structuredClone(s);ok(!T.checkTenths(s));eq(s,old);
}
{
 const s=seed();T.startTenths(s,'seven-decimal');T.supportTenths(s,'help');T.supportTenths(s,'together');T.supportTenths(s,'narrationRequested');T.checkTenths(s);eq(T.tenthsView(s).work.checks[0].support,['help','together','narrationRequested']);eq(T.tenthsView(s).work.checks[0].familiar,false,'unrelated help pairs do not mark seven');
 const old=structuredClone(s),idx=tenthsCases.findIndex(x=>x.id==='seven-decimal'),source=tenthsCases.splice(idx,1)[0];try{eq(T.tenthsView(s).status,'ready');eq(T.tenthsView(s).work.source,old.tenthsTable.cases['seven-decimal'].source);ok(T.startTenths(s,'seven-decimal'));}finally{tenthsCases.splice(idx,0,source);}
 s.tenthsTable.cases['zero-decimal']={version:99,raw:'<script>synthetic</script>'};const before=structuredClone(s);ok(!T.startTenths(s,'zero-decimal'));eq(s,before);ok(T.startTenths(s,'zero-fraction'));eq(s.tenthsTable.cases['zero-decimal'],before.tenthsTable.cases['zero-decimal']);ok(T.tenthsView(s).unreadable.length===1);ok(preflight(s));
 for(let i=0;i<12;i++){const w=structuredClone(s.tenthsTable.cases['zero-fraction']);w.source.id=`retired-${i}`;s.tenthsTable.cases[w.source.id]=w;}eq(T.tenthsView(s).readable.length,14,'extra saved sources survive current chooser count');
}
{
 const s=seed();T.startTenths(s,'four-fraction');const v=T.tenthsView(s),before=structuredClone(s);eq(T.startTenths(s,'seven-decimal',()=>false),false);eq(s,before,'allocation callback refusal atomic');v.root.cases.bad={source:'raw'};const prior=structuredClone(s);ok(T.recoverTenths(s,preflight));eq(s.tenthsTable.recovered,prior.tenthsTable);ok(preflight(s));
 for(const raw of [null,[],17,'earlier']){const t=seed();t.tenthsTable=raw;const old=structuredClone(t);tenthsPage(t);tenthsNotes(t);eq(t,old);ok(!T.recoverTenths(t,()=>false));eq(t,old);ok(T.recoverTenths(t,preflight));eq(t.tenthsTable.recovered,raw);ok(preflight(t));}
 const t=seed();let raw='kept';for(let i=0;i<59;i++)raw=[raw];t.tenthsTable=raw;ok(preflight(t));const old=structuredClone(t);ok(!T.recoverTenths(t,preflight));eq(t,old);
}
{
 const s=seed();s.tenthsTable={version:99,padding:''};const trial=structuredClone(s);T.recoverTenths(trial);const size=x=>new TextEncoder().encode(JSON.stringify(x,null,2)).length;s.tenthsTable.padding='x'.repeat(MAX_IMPORT_BYTES-size(trial)+1);const prior=structuredClone(s);ok(!T.recoverTenths(s));eq(s,prior,'byte-boundary recovery atomic');
 const t=seed();T.startTenths(t,'one-fraction');t.tenthsTable.cases.earlier=structuredClone(t.tenthsTable.cases['one-fraction']);t.tenthsTable.cases.earlier.source.id='earlier';t.tenthsTable.cases.earlier.padding='';const probe=structuredClone(t);T.startTenths(probe,'four-decimal');t.tenthsTable.cases.earlier.padding='x'.repeat(MAX_IMPORT_BYTES-size(probe)+1);const old=structuredClone(t);ok(!T.startTenths(t,'four-decimal'));eq(t,old,'allocation bound applies alongside readable current case');
}
{
 // The raw state can still fit while the host's formatted notes wrapper does not.
 const s=seed();s.fixturePadding='';const trial=structuredClone(s);ok(T.startTenths(trial,'four-decimal'));
 const size=x=>new TextEncoder().encode(JSON.stringify(x,null,2)).length;
 s.fixturePadding='x'.repeat(MAX_IMPORT_BYTES-size(trial));const raw=structuredClone(s);ok(T.startTenths(raw,'four-decimal'),'raw candidate exactly fits');ok(size(raw)===MAX_IMPORT_BYTES);ok(!preflight(raw),'formatted actual-report fields cross the byte boundary');const old=structuredClone(s);ok(!T.startTenths(s,'four-decimal',preflight));eq(s,old,'actual-report refusal is atomic');
}

{
 class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
 const storage=new Storage(),store=new ExplorerStore(storage),a=initializeExplorerState(store.load()),aId=store.active.id;T.startTenths(a,'zero-decimal');T.checkTenths(a);T.keepTenths(a);ok(store.save(a));const b=initializeExplorerState(store.add({},a));eq(b.tenthsTable,undefined);const selected=store.select(aId,b);eq(selected.tenthsTable,a.tenthsTable);const reloaded=new ExplorerStore(storage).load();eq(reloaded.tenthsTable,a.tenthsTable);const prepared=prepareProgressImport(JSON.stringify(a));ok(prepared.ok);const imported=store.importState(prepared);ok(imported.ok);eq(imported.state.tenthsTable,a.tenthsTable);eq(store.explorers.length,3);const unrelated=structuredClone(a);delete unrelated.tenthsTable;T.startTenths(a,'whole-fraction');const after=structuredClone(a);delete after.tenthsTable;eq(after,unrelated,'no other-game changes');ok(store.setPersistence(false,imported.state));T.toggleTenthsPart(imported.state,0);ok(store.save(imported.state));eq(storage.getItem('number-garden-v1:'+store.active.id),null,'save off keeps no explorer copy');eq(store.clearActive().tenthsTable,undefined,'confirmed explorer reset removes optional root');
}
for(const [field,value] of [['id','A'],['wholeId','-bad'],['title','é'.repeat(81)],['request','🌱'.repeat(101)],['wholeLabel','x'.repeat(161)]]){const source={...tenthsCases[0],[field]:value};ok(!T.validTenthsSource(source));}
console.log(`${count} tenths fixed-whole, subset, notation, frozen work and transfer checks passed.`);
