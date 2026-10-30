import assert from 'node:assert/strict';
import {makeSeedSource} from '../dist/seed-exchange-content.mjs';
import {validSeedSource,validSeedModel,seedModel,seedFingerprint,validSeedWork,validSeedSnapshot,seedReady,seedCourierList,seedExchangeView,seedSuggestion,startSeedExchange,openSeedExchange,setSeedMaterial,setSeedNote,showSeedHelp,checkSeedExchange,keepSeedExchange,removeSeedExchange} from '../dist/seed-exchange-core.mjs';
let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
for(const family of ['apples','reed','nursery'])for(let k=1;k<=12;k++)for(let serial=1;serial<=6;serial++){
 const s=makeSeedSource(serial,{family,size:k}),before=JSON.stringify(s);
 ok(validSeedSource(s),'every generated source is bounded and reachable');
 ok(Object.isFrozen(s)&&Object.isFrozen(s.example),'source/example cannot mutate the catalog');
 ok(s.example.size!==k,'worked example uses a different size');
 for(let value=0;value<=12;value++){
  const m=seedModel(s,family==='nursery'?{partValue:value}:{groups:value});
  ok(m.fits===(value===k),'construction fits exactly its derived target');
  ok(m.left>=0&&m.shortage>=0,'no negative physical stock');
  if(family==='nursery'){
   ok(m.shares[0]===5*value&&m.shares[1]===3*value,'towns receive their own equal parts');
   ok(m.used+m.left-m.shortage===s.total,'seedling conservation includes shortage');
  }else{
   const cost=family==='apples'?3:2,received=family==='apples'?2:3;
   ok(m.received===received*value&&m.used===cost*value,'different units scale together');
   ok(m.used+m.left-m.shortage===s.stock,'trade stock conservation includes shortage');
   ok(m.fits===(s.stock>=m.used&&s.stock-m.used<cost),'fit independently equals maximal whole groups');
  }
 }
 ok(JSON.stringify(s)===before,'pure model reads preserve frozen source');
 const duplicate=structuredClone(s);duplicate.id='another-card';duplicate.prompt='A later authored prompt.';
 ok(seedFingerprint(s)===seedFingerprint(duplicate),'ids and prose do not make distinct quantity evidence');
}
const old=structuredClone(makeSeedSource(1,{family:'apples',size:6}));old.basketRate=4;old.reedRate=7;old.stock=26;
ok(validSeedSource(old),'readable old source need not match current rates');
const m=seedModel(old,{groups:6});ok(m.fits&&m.used===24&&m.received===42&&m.left===2,'old source drives the actual model');
const nursery=structuredClone(makeSeedSource(1,{family:'nursery',size:10}));nursery.parts=[2,1];nursery.total=30;
ok(validSeedSource(nursery),'old nursery shares can have different part counts');
ok(seedModel(nursery,{partValue:10}).shares.join(',')==='20,10','old nursery model retains its parts');
const bad=structuredClone(old);bad.basketRate=1;bad.stock=13;bad.size=12;
ok(!validSeedModel(bad),'unreachable historical stock remains unavailable');
nursery.total=40;ok(!validSeedModel(nursery),'nonintegral part value is unavailable');
for(const value of [-1,13,NaN,1.5,'1',null])ok(seedModel(old,{groups:value})===null,'invalid material value rejected');
for(const serial of [0,-1,999999999,NaN,1.5])ok(makeSeedSource(serial)===null,'unsafe creation serial rejected');
ok(makeSeedSource(1,{family:'other'})===null,'unknown current family cannot create');
ok(makeSeedSource(1,{size:13})===null,'current size stays within controls');


const equal=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
const clone=x=>structuredClone(x),working=s=>seedExchangeView(s).work;
for(const family of ['apples','reed','nursery']){
 const story={acts:{kept:true}},s={story};
 ok(startSeedExchange(s,{family,size:3}).ok,'start a named family');
 ok(s.story===story,'adopting candidate preserves other-root identity');
 ok(validSeedWork(working(s)),'fresh work is readable');
 ok(setSeedNote(s,'Keep <these> exact words & punctuation.\nSecond line.').ok,'own note accepts literal markup/newline');
 ok(keepSeedExchange(s).ok,'unfinished work can be kept');
 const first=clone(working(s).firstKept),source=clone(working(s).source);
 ok(first.status==='working'&&first.checks.length===0&&validSeedSnapshot(first),'unfinished first snapshot truthful and readable');
 ok(checkSeedExchange(s).record.supported===true,'even no-hint first construction is supported');
 ok(showSeedHelp(s,'hint').ok,'hint exposure retained separately');
 ok(setSeedMaterial(s,3).ok&&checkSeedExchange(s).ok&&seedReady(working(s)),'new fitting check marks current construction');
 const matched=clone(working(s).checks.at(-1));
 equal(matched.helpBefore,{hint:true,example:false},'response-time optional support frozen');
 ok(showSeedHelp(s,'example').ok,'later example exposure stored');
 equal(working(s).checks.at(-1),matched,'later example never changes earlier check');
 ok(keepSeedExchange(s).ok&&working(s).latestKept.status==='fits','fitting kept courier card');
 equal(working(s).firstKept,first,'first snapshot never rewritten');
 equal(working(s).source,source,'edits/help/checks/keeps preserve frozen teaching');
 ok(setSeedMaterial(s,2).ok&&setSeedMaterial(s,3).ok,'edit away and back');
 const reopened=JSON.parse(JSON.stringify(s));
 ok(!seedReady(working(reopened)),'old matching construction cannot resurrect stamp after reload');
 equal(working(reopened).checks.at(-1),matched,'readiness invalidation does not regrade historical checks');
 ok(keepSeedExchange(reopened).ok&&working(reopened).latestKept.status==='working','unfinished revision stays possible');
 equal(working(reopened).firstKept,first,'first words remain exact through serialization and revision');
 const frozen=JSON.stringify(reopened);seedExchangeView(reopened);seedSuggestion(reopened,family);seedCourierList(source,working(reopened).draft);
 ok(JSON.stringify(reopened)===frozen,'views/suggestions/list are pure');
 delete working(reopened).ready;ok(!seedReady(working(reopened)),'absent readiness is false');
 working(reopened).latestKept.extraFuture={retained:'exact'};
 ok(keepSeedExchange(reopened).ok&&working(reopened).latestKept.extraFuture.retained==='exact','additive snapshot data survives intentional revision');
 working(reopened).firstKept={format:99,raw:'do not rewrite'};
 const unknownFirst=clone(working(reopened).firstKept);
 ok(setSeedMaterial(reopened,1).ok,'readable working material stays open beside unknown kept version');
 const before=JSON.stringify(reopened);ok(keepSeedExchange(reopened).error==='kept-unavailable'&&JSON.stringify(reopened)===before,'Keep cannot overwrite unknown first kept version');
 equal(working(reopened).firstKept,unknownFirst,'unknown snapshot exact');
}
const s={other:{held:'exact'}};startSeedExchange(s,{size:2});const id=s.seedExchange.currentId;
for(const mutate of [()=>setSeedMaterial(s,2,{canExport:()=>false}),()=>setSeedNote(s,'Refused words',{canExport:()=>false}),()=>showSeedHelp(s,'hint',{canExport:()=>false}),()=>checkSeedExchange(s,{canExport:()=>false}),()=>keepSeedExchange(s,{canExport:()=>false}),()=>startSeedExchange(s,{size:4},{canExport:()=>false}),()=>removeSeedExchange(s,id,true,{canExport:()=>false})]){
 const before=JSON.stringify(s);ok(mutate().error==='unexportable'&&JSON.stringify(s)===before,'candidate refusal is byte-for-byte nonmutating');
}
ok(setSeedNote(s,'x'.repeat(1201)).error==='note-length','note limit refuses whole proposed text');
for(let i=0;i<24;i++)ok(checkSeedExchange(s).ok,'bounded check appended');
let before=JSON.stringify(s);ok(checkSeedExchange(s).error==='check-cap'&&JSON.stringify(s)===before,'check cap never prunes history');
const future=clone(s);future.seedExchange.version=99;before=JSON.stringify(future);
ok(seedExchangeView(future).status==='unsupported'&&!startSeedExchange(future).ok&&JSON.stringify(future)===before,'unknown root stays unchanged/exportable');
const siblings=clone(s);siblings.seedExchange.visits['exchange-2']={format:99,foreign:{held:'exact'}};siblings.seedExchange.visits['another-future-id']={raw:'exact'};siblings.seedExchange.nextSerial=3;
ok(seedExchangeView(siblings).visits.filter(x=>!x.readable).length===2&&working(siblings),'one bad entry leaves readable work open');
ok(startSeedExchange(siblings,{family:'reed',size:4}).ok,'new work coexists with unknown sibling');
equal(siblings.seedExchange.visits['exchange-2'],{format:99,foreign:{held:'exact'}},'unknown sibling unaltered');
const collision=clone(s);collision.seedExchange.nextSerial=1;before=JSON.stringify(collision);ok(startSeedExchange(collision).error==='collision'&&JSON.stringify(collision)===before,'occupied serial never reused');
for(const n of [null,0,-1,999999999,1.5]){const state=clone(s);state.seedExchange.nextSerial=n;before=JSON.stringify(state);ok(startSeedExchange(state).error==='counter'&&JSON.stringify(state)===before,'bad counter is not reset');}
const capacity={};for(let i=1;i<=12;i++)ok(startSeedExchange(capacity,{size:(i-1)%12+1}).ok,'retained slot can open');
before=JSON.stringify(capacity);ok(startSeedExchange(capacity).error==='visit-cap'&&JSON.stringify(capacity)===before,'capacity leaves all retained work intact');
ok(removeSeedExchange(capacity,'exchange-1',false).error==='confirmation','removal is explicit');
ok(removeSeedExchange(capacity,'exchange-1',true).ok&&startSeedExchange(capacity).id==='exchange-13','removal frees slot but not number');
const huge={other:'x'.repeat(5*1024*1024)};before=JSON.stringify(huge);ok(startSeedExchange(huge).error==='unexportable'&&JSON.stringify(huge)===before,'default byte preflight applies without caller callback');

function visit(size,serialValue,match=true,hint=false){const state={};startSeedExchange(state,{size});const w=clone(working(state));w.source=clone(makeSeedSource(serialValue,{size}));w.help.hint=hint;w.draft.groups=match?size:0;const recorded={seedExchange:{version:1,currentId:'exchange-1',nextSerial:2,visits:{'exchange-1':w}}};checkSeedExchange(recorded);return working(recorded);}
// Use actual mutations to record each first response, not a fabricated success count.
const a=visit(6,1,false),b=visit(4,2),c=visit(5,3),history={seedExchange:{version:1,currentId:'exchange-3',nextSerial:4,visits:{'exchange-1':a,'exchange-2':b,'exchange-3':c}}};
equal(seedSuggestion(history,'apples'),{size:5,reason:'same',count:3},'older mismatch blocks increase but not access');
const duplicate=clone(a);duplicate.checks=[];duplicate.draft.groups=6;const dstate={seedExchange:{version:1,currentId:'exchange-9',nextSerial:10,visits:{'exchange-9':duplicate}}};checkSeedExchange(dstate);history.seedExchange.visits['exchange-9']=working(dstate);
equal(seedSuggestion(history,'apples'),{size:5,reason:'smaller',count:3},'new duplicate uses oldest retained first check');
ok(openSeedExchange(history,'exchange-1').ok,'old visit can reopen');
equal(seedSuggestion(history,'apples'),{size:5,reason:'smaller',count:3},'reopen does not reorder creation history');
ok(removeSeedExchange(history,'exchange-1',true).ok,'explicit deletion changes retained history');
equal(seedSuggestion(history,'apples'),{size:7,reason:'more',count:3},'only retained checked representatives inform suggestion');
equal(seedSuggestion(history,'nursery'),{size:1,reason:'new',count:0},'other families never inherit a level');
const suggested=seedSuggestion(history,'apples');ok(startSeedExchange(history,{family:'apples',size:12}).ok&&working(history).source.size===12&&suggested.size!==12,'manual size overrides suggestion');
const helped={seedExchange:{version:1,currentId:'exchange-1',nextSerial:2,visits:{'exchange-1':visit(4,1,true,true)}}};
equal(seedSuggestion(helped,'apples'),{size:3,reason:'smaller',count:1},'first optional help suggests smaller supported work');
const identity={};startSeedExchange(identity,{size:3});const original=identity.seedExchange.visits['exchange-1'];identity.seedExchange.visits['exchange-4']=clone(original);identity.seedExchange.currentId='exchange-4';identity.seedExchange.nextSerial=5;
ok(seedExchangeView(identity).familiar,'retained earlier matching source is familiar');removeSeedExchange(identity,'exchange-1',true);ok(!seedExchangeView(identity).familiar,'no lifetime novelty claim after removal');
const oldList=seedCourierList(old,{groups:6});equal(oldList.map(x=>x.value),[24,42,2],'restored rules drive current courier quantities');
console.log(`Seed exchange source/model/notebook: ${checks} checks passed. Browser and implementation review remain pending.`);
