import assert from 'node:assert/strict';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {sortingSource} from '../dist/sorting-desk-content.mjs';
import * as D from '../dist/sorting-desk-core.mjs';
import {sortingPage,sortingNotes} from '../dist/sorting-desk-ui.mjs';

let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(v,m)=>{assert.ok(v,m);checks++;};
const seed=()=>initializeExplorerState(freshState());
const report=s=>({title:'Synthetic notes',exportedAt:'2026-10-22T00:00:00.000Z',note:'Synthetic only',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
const preflight=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const ready=(s,condition='stamp-star',then='lantern',otherwise='leaf')=>{ok(D.startSorting(s,preflight));ok(D.setSortingProgram(s,'condition',condition));ok(D.setSortingProgram(s,'then',then));ok(D.setSortingProgram(s,'else',otherwise));};
const run=s=>{ok(D.stepSorting(s,preflight));ok(D.stepSorting(s,preflight));return D.sortingView(s).latest;};

{
 const s=seed(),before=structuredClone(s);sortingPage(s);sortingNotes(s);eq(s,before,'view does not allocate');ok(D.validSortingSource(sortingSource));ok(!sortingPage(s).includes('star-yellow'),'first route does not disclose cards');
 ready(s);eq(D.sortingView(s).status,'ready');ok(sortingPage(s).includes('data-sorting-parcel="star-yellow"'));
}
{
 const s=seed();ok(D.startSorting(s,preflight));ok(D.setSortingProgram(s,'condition','wrap-blue'));eq(s.sortingDesk.program,{condition:'wrap-blue',then:null,else:null});
 const saved=prepareProgressImport(JSON.stringify(report(s),null,2));ok(saved.ok);eq(saved.state.sortingDesk.program,s.sortingDesk.program,'partial selector survives real loader');ok(!D.stepSorting(s),'partial rule cannot disclose condition');ok(!D.setSortingPrediction(s,'lantern'));
 ok(D.setSortingProgram(s,'then','lantern'));ok(D.setSortingProgram(s,'else','leaf'));ok(D.setSortingPrediction(s,'leaf'));ok(D.stepSorting(s));eq(s.sortingDesk.phase,'condition');ok(!D.setSortingPrediction(s,'lantern'),'post-disclosure prediction refused');eq(s.sortingDesk.prediction,'leaf');ok(D.restartSortingTrace(s));eq(s.sortingDesk.prediction,null);ok(D.setSortingPrediction(s,'lantern'));ok(D.stepSorting(s));ok(D.stepSorting(s,preflight));eq(D.sortingView(s).latest.prediction,'lantern');
 const earlier=structuredClone(D.sortingView(s).latest);ok(D.setSortingProgram(s,'condition','stamp-star'));eq(s.sortingDesk.phase,'ready');eq(s.sortingDesk.prediction,null);eq(D.sortingView(s).readable[0].check,earlier);
}
for(const condition of ['stamp-star','stamp-circle','wrap-blue','wrap-yellow'])for(const then of ['lantern','leaf'])for(const otherwise of ['lantern','leaf'])for(const parcel of sortingSource.parcels){
 const s=seed();ready(s,condition,then,otherwise);ok(D.chooseSortingParcel(s,parcel.id));const first=run(s),yes=parcel[condition.startsWith('stamp-')?'stamp':'wrap']===condition.split('-')[1],actual=yes?then:otherwise,requested=parcel.stamp==='star'?'lantern':'leaf';
 eq(first.yes,yes);eq(first.actual,actual);eq(first.requested,requested);eq(first.matches,actual===requested);eq(first.branch,yes?'then':'else');eq(first.practiceOnly,true);ok(D.sortingView(s).resultAvailable);
}
{
 const s=seed();ready(s);run(s);
 s.sortingDesk.program={else:'leaf',then:'lantern',condition:'stamp-star'};
 eq(D.sortingView(s).resultAvailable,true,'saved program key order does not hide a matching result');
 const loaded=prepareProgressImport(JSON.stringify(report(s),null,2));ok(loaded.ok);ok(sortingPage(loaded.state).includes('Your rule sent this parcel'));
 const one=seed();ready(one);one.sortingDesk.source.parcels=[one.sortingDesk.source.parcels[0]];run(one);
 ok(!sortingPage(one).includes(one.sortingDesk.source.text.counterexample),'single-card saved source offers no unavailable contrast');
}
{
 const s=seed();ready(s,'wrap-blue');D.chooseSortingParcel(s,'star-blue');eq(run(s).matches,true);D.restartSortingTrace(s);D.chooseSortingParcel(s,'circle-yellow');eq(run(s).matches,true);D.restartSortingTrace(s);D.chooseSortingParcel(s,'star-yellow');eq(run(s).matches,false,'counterexample discloses color-rule mismatch');
 ok(D.supportSorting(s,'helpOpened'));ok(D.supportSorting(s,'together'));D.restartSortingTrace(s);D.chooseSortingParcel(s,'circle-blue');const check=run(s);eq(check.support.helpOpened,true);eq(check.support.together,true);eq(s.sortingSource,undefined,'no extra root');
}
{
 const s=seed();ready(s);const first=run(s);ok(D.keepSortingRun(s,preflight));const kept=structuredClone(s.sortingDesk.kept);eq(kept.check,first);
 for(let n=0;n<13;n++){ok(D.restartSortingTrace(s));run(s);}eq(D.sortingView(s).readable.length,12);eq(D.sortingView(s).readable[0].check.id,3);eq(s.sortingDesk.kept,kept,'kept run survives window rolloff');
 const raw={id:'bad',html:'<img src=x onerror=alert(1)>'};s.sortingDesk.checks.splice(3,0,raw);const old=structuredClone(raw);ok(D.restartSortingTrace(s));run(s);eq(D.sortingView(s).readable.length,12);eq(s.sortingDesk.checks.find(x=>x.id==='bad'),old,'malformed sibling retained exactly');eq(D.sortingView(s).unreadable.length,1);ok(!sortingNotes(s).includes('<img src=x'));
 const one=structuredClone(s);s.sortingDesk.checks.at(-1).actual='wrong';eq(D.sortingView(s).resultAvailable,false,'malformed latest result cannot display earlier run as current');ok(sortingPage(s).includes('cannot be displayed'));eq(s.sortingDesk.checks.at(-1).actual,'wrong');eq(one.sortingDesk.kept,kept);
}
{
 const s=seed();ready(s);const frozen=structuredClone(s.sortingDesk.source);sortingSource.request='Later author copy';sortingSource.parcels[0].title='Later title';try{eq(s.sortingDesk.source,frozen);eq(D.sortingView(s).status,'ready');ok(sortingPage(s).includes(frozen.request));run(s);eq(D.sortingView(s).latest.requested,'lantern');}finally{sortingSource.request=frozen.request;sortingSource.parcels[0].title=frozen.parcels[0].title;}
 const oldPost=structuredClone(s.postOffice),oldDesk=structuredClone(s.sortingDesk);ok(D.startSorting(s,preflight,true));eq(s.sortingDesk.retainedRaw,oldDesk,'whole earlier desk retained');eq(s.postOffice,oldPost,'delivery root unchanged');
}
{
 const s=seed();ready(s);const old=structuredClone(s.sortingDesk);ok(!D.startSorting(s,()=>false,true));eq(s.sortingDesk,old,'failed separate desk is atomic');ok(D.startSorting(s,preflight,true));eq(s.sortingDesk.retainedRaw,old,'readable restart nests entire old root');const nested=structuredClone(s.sortingDesk);ok(D.startSorting(s,preflight,true));eq(s.sortingDesk.retainedRaw,nested,'nested recovery retains prior raw');
 for(const raw of [null,17,'<img src=x>',{version:2,source:'old',retainedRaw:['first']}]){const t=seed();t.sortingDesk=raw;const prepared=prepareProgressImport(JSON.stringify(report(t),null,2));ok(prepared.ok);eq(prepared.state.sortingDesk,raw);ok(!sortingNotes(t).includes('<img src=x>'));ok(D.startSorting(t,preflight,true));eq(t.sortingDesk.retainedRaw,raw);}
}
{
 const s=seed();ready(s);s.sortingDesk.kept={bad:'<script>synthetic</script>'};const before=structuredClone(s);ok(D.sortingView(s).keptUnreadable);run(s);ok(!D.keepSortingRun(s,preflight),'unreadable kept copy cannot be overwritten');eq(s.sortingDesk.kept,before.sortingDesk.kept);ok(preflight(s));
 const deep=seed();let raw='old';for(let i=0;i<59;i++)raw=[raw];deep.sortingDesk=raw;const old=structuredClone(deep);ok(!D.startSorting(deep,preflight,true),'nested depth preflight refuses atomically');eq(deep,old);
}
{
 const s=seed();ready(s);ok(D.stepSorting(s,()=>false));eq(s.sortingDesk.phase,'condition');const atCondition=structuredClone(s);ok(!D.stepSorting(s,()=>false));eq(s,atCondition,'formatted report callback refusal leaves condition/work unchanged');
 s.sortingDesk.nextCheck=Number.MAX_SAFE_INTEGER;const max=structuredClone(s);ok(!D.stepSorting(s,preflight));eq(s,max,'ID exhaustion leaves record intact');
 const trial=seed();ready(trial);D.stepSorting(trial);trial.padding='';const candidate=structuredClone(trial);D.stepSorting(candidate,()=>true);const size=x=>new TextEncoder().encode(JSON.stringify(x,null,2)).length;
 trial.padding='x'.repeat(MAX_IMPORT_BYTES-size(candidate));const raw=structuredClone(trial);ok(D.stepSorting(raw,()=>true),'raw candidate fits exactly');eq(size(raw),MAX_IMPORT_BYTES);ok(!preflight(raw),'actual formatted report exceeds import cap');const hold=structuredClone(trial);ok(!D.stepSorting(trial,preflight));eq(trial,hold);
}
{
 class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
 const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());ready(s);run(s);ok(store.save(s));const id=store.active.id;const reloaded=new ExplorerStore(disk).load();eq(reloaded.sortingDesk,s.sortingDesk);const imported=store.importState(prepareProgressImport(JSON.stringify(report(s),null,2)));ok(imported.ok);eq(imported.state.sortingDesk,s.sortingDesk);const other=initializeExplorerState(store.add({},imported.state));eq(other.sortingDesk,undefined);eq(store.select(id,other).sortingDesk,s.sortingDesk);ok(store.setPersistence(false,other));ok(D.startSorting(other));ok(store.save(other));eq(disk.getItem('number-garden-v1:'+store.active.id),null,'save-off persists no new root');eq(store.clearActive().sortingDesk,undefined,'reset clears optional root');
 const rawRoot={version:7,source:'<synthetic earlier desk>',retainedRaw:['old',false]},rawState=seed();rawState.sortingDesk=rawRoot;
 const rawImported=store.importState(prepareProgressImport(JSON.stringify(report(rawState),null,2)));ok(rawImported.ok,'malformed root imports through actual explorer store');eq(rawImported.state.sortingDesk,rawRoot);ok(!sortingNotes(rawImported.state).includes('<synthetic earlier desk>'),'raw notes are escaped');
}
console.log(`${checks} sorting desk finite programs, save, recovery and import checks passed.`);
