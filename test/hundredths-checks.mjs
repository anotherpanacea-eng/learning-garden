import assert from 'node:assert/strict';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {startTenths,toggleTenthsPart,checkTenths} from '../dist/tenths-core.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {hundredthsCases,relation,hundredthsName} from '../dist/hundredths-content.mjs';
import * as H from '../dist/hundredths-core.mjs';
import {hundredthsPage,hundredthsNotes} from '../dist/hundredths-ui.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {setBrambleMode,setBrambleTable,startAdaptiveRival,generateRivalTask,notePendingBrambleFactExposure,validPostRival,setRivalInput,submitRival,continueRival} from '../dist/post-rival.mjs';
import {learningSource} from '../dist/learning-connections.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(x,m)=>{assert.ok(x,m);count++;};
const seed=()=>initializeExplorerState(freshState());
const report=s=>JSON.stringify({title:'Synthetic report',exportedAt:'2026-10-22T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s},null,2);
const preflight=s=>prepareProgressImport(report(s)).ok;
const bytes=x=>new TextEncoder().encode(JSON.stringify(x,null,2)).length;
{
 const s=seed(),before=structuredClone(s),page=hundredthsPage(s);hundredthsNotes(s);eq(s,before,'chooser and notes do not allocate');eq(hundredthsCases.length,6);ok(page.includes('0.3 + 0.05'),'chooser notation is supplied');ok(!page.includes('30/100 = 0.30'),'chooser does not show complete equivalence');
 eq(hundredthsCases.map(c=>c.kind),['build','build','build','compare','compare','compare']);eq(hundredthsCases.map(c=>c.kind==='build'?c.target:relation(c.left,c.right)),[30,35,35,'same','greater','less']);
 for(const n of [0,5,30,35,40,100])ok(hundredthsName(n).includes(n===100?'1.00':`0.${String(n).padStart(2,'0')}`));
}
for(const source of hundredthsCases){
 const initial=seed();ok(H.startHundredths(initial,source.id,preflight));eq(H.hundredthsView(initial).work.source,source);eq(initial.tenthsTable,undefined,'Tenths v1 is untouched');
 ok(!H.hundredthsView(initial).work.sourceShown);ok(H.markHundredthsDisplayed(initial));eq(H.hundredthsFacts(initial),source.kind==='compare'&&[source.left,source.right].some(n=>n>=30&&n<40)?[[10,10],[3,10]]:[[10,10]]); // facts follow the current picture, not targets
 const frozen=structuredClone(H.hundredthsView(initial).work.source);
 if(source.kind==='build')for(let n=0;n<=100;n++){
  const s=structuredClone(initial),w=H.hundredthsView(s).work;w.response.amount=n;
  ok(H.checkHundredths(s));const c=w.checks[0];eq(c.outcome,n===source.target?'matches':'different');ok(c.feedbackText.includes(hundredthsName(n)));eq(c.source,frozen);ok(c.practiceOnly);ok(c.priorExposureUnknown);eq(c.feedbackShown,false);ok(H.markHundredthsDisplayed(s));ok(H.hundredthsView(s).work.checks[0].feedbackShown);eq(H.hundredthsView(s).status,'ready');
 } else for(const candidate of ['less','same','greater']){
  const s=structuredClone(initial);ok(H.chooseHundredths(s,candidate));ok(H.checkHundredths(s));const c=H.hundredthsView(s).work.checks[0];eq(c.outcome,candidate===relation(source.left,source.right)?'matches':'different');eq(c.response.choice,candidate);eq(c.source,frozen);ok(c.feedbackText.includes(`${source.left}/100`));ok(c.feedbackText.includes(`${source.right}/100`));
 }
}
{
 const s=seed();H.startHundredths(s,'three-tenths');ok(!H.moveHundredths(s,-1));ok(!H.moveHundredths(s,101));for(let i=0;i<10;i++)ok(H.moveHundredths(s,10));eq(H.hundredthsView(s).work.response.amount,100);ok(!H.moveHundredths(s,1));ok(!H.moveHundredths(s,10));ok(H.moveHundredths(s,-1));eq(H.hundredthsView(s).work.response.amount,99);ok(H.clearHundredths(s));eq(H.hundredthsView(s).work.response.amount,0);ok(H.checkHundredths(s),'zero needs explicit Check');eq(H.hundredthsView(s).work.checks[0].outcome,'different');
 H.supportHundredths(s,'help');H.supportHundredths(s,'together');H.supportHundredths(s,'narrationRequested');H.checkHundredths(s);eq(H.hundredthsView(s).work.checks[1].support,['feedback','help','together','narrationRequested']);H.keepHundredths(s);const kept=structuredClone(H.hundredthsView(s).work.kept);for(let i=0;i<5;i++)H.checkHundredths(s);eq(H.hundredthsView(s).work.checks.length,4);eq(H.hundredthsView(s).work.kept,kept);eq(kept.latestCheck.id,2);H.hundredthsView(s).work.nextCheckId=Number.MAX_SAFE_INTEGER;const before=structuredClone(s);ok(!H.checkHundredths(s));eq(s,before);
}
{
 const s=seed();H.startHundredths(s,'thirty-five');H.markHundredthsDisplayed(s);eq(H.hundredthsFacts(s),[[10,10]],'target alone does not expose row fact');H.checkHundredths(s);eq(H.hundredthsFacts(s),[[10,10]],'feedback not mounted yet');H.markHundredthsDisplayed(s);eq(H.hundredthsFacts(s),[[10,10],[3,10]],'visible frozen feedback supplies row fact');
 const t=seed();H.startHundredths(t,'three-tenths');H.markHundredthsDisplayed(t);H.supportHundredths(t,'help');eq(H.hundredthsFacts(t),[[10,10],[3,10]],'visible frozen help supplies row fact');
}
{
 const s=seed();H.startHundredths(s,'thirty-five');H.moveHundredths(s,10);H.checkHundredths(s);const w=H.hundredthsView(s).work,c=structuredClone(w.checks[0]);ok(H.moveHundredths(s,1));eq(w.feedbackId,null,'edit hides current feedback');eq(w.checks[0],c,'earlier check frozen');H.keepHundredths(s);eq(w.kept.latestCheck,c);eq(w.kept.response.amount,11);const today=hundredthsCases.find(c=>c.id==='thirty-five'),oldTitle=today.title;today.title='Changed catalog title';try{eq(H.hundredthsView(s).work.source.title,oldTitle);eq(H.hundredthsView(s).work.checks[0],c);}finally{today.title=oldTitle;}
 const idx=hundredthsCases.indexOf(today);hundredthsCases.splice(idx,1);try{ok(H.hundredthsView(s).readable.some(x=>x.id==='thirty-five'));ok(H.startHundredths(s,'thirty-five'));}finally{hundredthsCases.splice(idx,0,today);}ok(H.hundredthsView(s).work.familiar);
}
{
 const s=seed();H.startHundredths(s,'same-names');ok(!H.checkHundredths(s),'untouched comparison is not an answer');ok(!H.chooseHundredths(s,'wrong'));H.chooseHundredths(s,'same');H.checkHundredths(s);eq(H.hundredthsView(s).work.checks[0].outcome,'matches');H.chooseHundredths(s,'less');eq(H.hundredthsView(s).work.feedbackId,null);H.keepHundredths(s);eq(H.hundredthsView(s).work.kept.response.choice,'less');
}
{
 const s=seed();H.startHundredths(s,'three-tenths');const source=structuredClone(H.hundredthsView(s).work.source);s.hundredthsBridge.cases['bad-case']={source:'raw'};const before=structuredClone(s);ok(!H.startHundredths(s,'bad-case'));eq(s,before);ok(H.startHundredths(s,'thirty-five',preflight));eq(s.hundredthsBridge.cases['bad-case'],before.hundredthsBridge.cases['bad-case']);
 for(let i=0;i<8;i++){const w=structuredClone(s.hundredthsBridge.cases['three-tenths']);w.source.id=`retired-${i}`;s.hundredthsBridge.cases[w.source.id]=w;}eq(H.hundredthsView(s).readable.length,10,'readable retired records survive finite current pack');
 s.hundredthsBridge.cases['three-and-five']={raw:'<script>synthetic</script>'};const raw=structuredClone(s);ok(!H.startHundredths(s,'three-and-five'));eq(s,raw);ok(H.recoverHundredths(s,preflight));eq(s.hundredthsBridge.recovered,raw.hundredthsBridge);ok(preflight(s));eq(source.wholeId,'repair-whole-one');
}
{
 for(const raw of [null,[],17,'old-format']){const s=seed();s.hundredthsBridge=raw;const before=structuredClone(s);hundredthsPage(s);hundredthsNotes(s);eq(s,before);ok(!H.recoverHundredths(s,()=>false));eq(s,before);ok(H.recoverHundredths(s,preflight));eq(s.hundredthsBridge.recovered,raw);}
 const s=seed();let raw='kept';for(let i=0;i<59;i++)raw=[raw];s.hundredthsBridge=raw;ok(preflight(s));const before=structuredClone(s);ok(!H.recoverHundredths(s,preflight));eq(s,before,'depth-bound refusal atomic');
}
{
 const s=seed();s.hundredthsBridge={version:99,padding:''};const trial=structuredClone(s);H.recoverHundredths(trial);s.hundredthsBridge.padding='x'.repeat(MAX_IMPORT_BYTES-bytes(trial)+1);const before=structuredClone(s);ok(!H.recoverHundredths(s));eq(s,before,'byte-boundary recovery atomic');
 const t=seed();H.startHundredths(t,'three-tenths');t.hundredthsBridge.cases.retired=structuredClone(t.hundredthsBridge.cases['three-tenths']);t.hundredthsBridge.cases.retired.source.id='retired';t.hundredthsBridge.cases.retired.padding='';const test=structuredClone(t);H.startHundredths(test,'thirty-five');t.hundredthsBridge.cases.retired.padding='x'.repeat(MAX_IMPORT_BYTES-bytes(test)+1);const old=structuredClone(t);ok(!H.startHundredths(t,'thirty-five'));eq(t,old,'allocation bound applies beside readable case');
}
{
 const s=seed();s.fixturePadding='';const trial=structuredClone(s);ok(H.startHundredths(trial,'three-tenths'));s.fixturePadding='x'.repeat(MAX_IMPORT_BYTES-bytes(trial));const raw=structuredClone(s);ok(H.startHundredths(raw,'three-tenths'),'raw candidate fits');ok(bytes(raw)<=MAX_IMPORT_BYTES);ok(!preflight(raw),'actual formatted report too large');const before=structuredClone(s);ok(!H.startHundredths(s,'three-tenths',preflight));eq(s,before,'actual report refusal atomic');
}
{
 const s=seed();H.startHundredths(s,'thirty-five');H.moveHundredths(s,10);H.checkHundredths(s);const good=structuredClone(s.hundredthsBridge.cases['thirty-five']);H.startHundredths(s,'three-tenths');s.hundredthsBridge.cases['three-tenths'].helpOpen=true;s.hundredthsBridge.cases['thirty-five'].checks[0].outcome='matches';const imported=prepareProgressImport(JSON.stringify(s));ok(imported.ok);const v=H.hundredthsView(imported.state);eq(v.unreadable.map(x=>x.id),['thirty-five','three-tenths']);eq(imported.state.hundredthsBridge,s.hundredthsBridge,'raw invalid siblings retained');ok(H.startHundredths(imported.state,'same-names'));eq(imported.state.hundredthsBridge.cases['thirty-five'],s.hundredthsBridge.cases['thirty-five']);eq(good.checks[0].outcome,'different');
}
{
 const s=seed();ok(startTenths(s,'four-decimal'));ok(toggleTenthsPart(s,0));ok(checkTenths(s));const old=JSON.stringify(s.tenthsTable);ok(H.startHundredths(s,'three-tenths',preflight));ok(H.moveHundredths(s,10));ok(H.checkHundredths(s));eq(JSON.stringify(s.tenthsTable),old,'Tenths v1 bytes unchanged by bridge work');ok(preflight(s));
}
{
 class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
 const storage=new Storage(),store=new ExplorerStore(storage),a=initializeExplorerState(store.load()),aId=store.active.id;H.startHundredths(a,'same-names');H.chooseHundredths(a,'same');H.checkHundredths(a);H.keepHundredths(a);ok(store.save(a));const b=initializeExplorerState(store.add({},a));eq(b.hundredthsBridge,undefined);const selected=store.select(aId,b);eq(selected.hundredthsBridge,a.hundredthsBridge);const reloaded=new ExplorerStore(storage).load();eq(reloaded.hundredthsBridge,a.hundredthsBridge);const prepared=prepareProgressImport(report(a));ok(prepared.ok);const imported=store.importState(prepared);ok(imported.ok);eq(imported.state.hundredthsBridge,a.hundredthsBridge);ok(store.setPersistence(false,imported.state));H.chooseHundredths(imported.state,'less');ok(store.save(imported.state));eq(storage.getItem('number-garden-v1:'+store.active.id),null);eq(store.clearActive().hundredthsBridge,undefined);
}
{
 const s=seed();H.startHundredths(s,'same-names');H.chooseHundredths(s,'less');H.checkHundredths(s);
 const c=s.hundredthsBridge.cases['same-names'].checks[0];c.response.choice=null;c.outcome='different';
 ok(prepareProgressImport(JSON.stringify(s)).ok,'synthetic malformed comparison remains importable');
 eq(H.hundredthsView(s).unreadable.map(x=>x.id),['same-names'],'checked null choice is unreadable, not phantom wrong answer');
 ok(H.startHundredths(s,'three-tenths'),'valid sibling remains open');eq(s.hundredthsBridge.cases['same-names'].checks[0],c,'invalid sibling bytes stay raw');
}
{
 const s=seed();H.startHundredths(s,'three-tenths');s.fixturePadding='';
 const room=MAX_IMPORT_BYTES-bytes(JSON.parse(report(s)))-120;s.fixturePadding='x'.repeat(room);
 ok(preflight(s),'source report fits before new check');const before=structuredClone(s);
 ok(!H.checkHundredths(s,preflight),'new check refused before report overflow');eq(s,before,'check refusal atomic');
 ok(!H.keepHundredths(s,preflight),'new kept copy refused before report overflow');eq(s,before,'Keep refusal atomic');
 const shown=seed();H.startHundredths(shown,'three-tenths');shown.fixturePadding='';
 shown.fixturePadding='x'.repeat(MAX_IMPORT_BYTES-bytes(JSON.parse(report(shown)))-24);
 const withVisibleFact=c=>{const preview=structuredClone(c);H.markHundredthsDisplayed(preview);preview.exposures=['10x10'];return preflight(preview);};
 ok(preflight(shown),'report fits before full-panel display');const prior=structuredClone(shown);
 ok(!H.markHundredthsDisplayed(shown,withVisibleFact),'display flag and imminent fact require room together');eq(shown,prior,'failed display recording leaves save unchanged');
}
{
 const s=seed(),v=startPostOffice(s,'clover-buns');ok(!!v);ok(setBrambleMode(s,'multiply'));ok(setBrambleTable(s,10));ok(startAdaptiveRival(s));
 const r=v.rival;r.task=generateRivalTask('multiply',10,10,r.task.scene);eq([r.task.a,r.task.b],[10,10]);ok(!notePendingBrambleFactExposure(s,[3,10]));ok(notePendingBrambleFactExposure(s,[10,10]));ok(!notePendingBrambleFactExposure(s,[10,10]));
 ok(r.priorFactShown&&validPostRival(r)&&!r.supported,'related fact is separate from requested help');
 setRivalInput(s,'100');submitRival(s);ok(r.attempts[0].correct&&!r.attempts[0].afterSupport,'attempt chronology remains exact');continueRival(s);
 eq(learningSource(s,'bramble'),null,'exposed round cannot become a positive connection source');
}
for(const [field,value] of [['id','A'],['wholeId','-bad'],['title','é'.repeat(81)],['request','🌱'.repeat(101)],['wholeLabel','x'.repeat(161)],['help','x'.repeat(801)]])ok(!H.validHundredthsSource({...hundredthsCases[0],[field]:value}));
console.log(`${count} hundredths source, picture, frozen-work and transfer assertions passed.`);
