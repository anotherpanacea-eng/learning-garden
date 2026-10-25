import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {shuttersSource} from '../dist/shutters-content.mjs';
import {SHUTTERS_BYTES,newShutters,shuttersPosition,shutterWays,shutterDice,shuttersView,startShutters,rollShutters,selectShutter,clearShutters,closeShutters,showShutterWays,explainShutters,keepShutterNote,resumeShutters,removeShutterRecord,validShuttersSource} from '../dist/shutters-core.mjs';
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;};
const admit=s=>prepareProgressImport(JSON.stringify({...s,title:'Synthetic notebook'},null,2)).ok;
// Independent include/exclude recursion, compared to production's bit-mask enumeration.
function oracle(xs,target){if(target===0)return [[]];if(!xs.length||target<0)return [];const [n,...rest]=xs;return [...oracle(rest,target),...oracle(rest,target-n).map(ys=>[n,...ys])];}
const normalize=xs=>xs.map(x=>x.join(',')).sort();
for(let mask=0;mask<512;mask++){
 const open=Array.from({length:9},(_,i)=>i+1).filter((_,i)=>mask&(1<<i));
 for(let target=1;target<=12;target++)eq(normalize(shutterWays(open,target)),normalize(oracle(open,target)),'every subset and target');
 eq(shutterDice(open),open.reduce((a,b)=>a+b,0)<=6?1:2);
}
function roll(s,faces){let i=0;ok(rollShutters(s,admit,()=>{const n=faces[i++];assert.ok(n,'correct dice count');return (n-.5)/6;}));eq(s.shutters.current.moves.at(-1).faces,faces);}
function close(s,tiles){for(const n of tiles)ok(selectShutter(s,n,admit));ok(closeShutters(s,admit));}
for(const size of [6,9]){
 ok(validShuttersSource(shuttersSource(size)));eq(shuttersPosition(newShutters(size)).open.length,size);
 const counts=Array(13).fill(0);
 for(let a=1;a<=6;a++)for(let b=1;b<=6;b++){const s=freshState();ok(startShutters(s,size,admit));roll(s,[a,b]);counts[shuttersPosition(s.shutters.current).target]++;}
 eq(counts.slice(2),[1,2,3,4,5,6,5,4,3,2,1],'uniform independent dice pair enumeration');
 const s=freshState();ok(startShutters(s,size,admit));roll(s,[3,4]);ok(selectShutter(s,1,admit));ok(selectShutter(s,6,admit));
 eq(shuttersPosition(s.shutters.current).selectedTotal,7);eq(restoreState(JSON.stringify(s)).shutters,s.shutters,'reload exact roll and draft');
 ok(selectShutter(s,1,admit));eq(s.shutters.current.selected,[6]);ok(!closeShutters(s,admit));ok(clearShutters(s,admit));
 const before=structuredClone(s);ok(!rollShutters(s,admit));eq(s,before,'cannot reroll waiting choice');
 ok(showShutterWays(s,admit));ok(s.shutters.current.support.includes('combinations'));
 const moves=structuredClone(s.shutters.current.moves);for(let i=0;i<4;i++)ok(explainShutters(s,i,admit));eq(s.shutters.current.moves,moves,'explanation does not play the waiting round');
 ok(startShutters(s,size,admit));ok(s.shutters.current.support.includes('explanation-before'));ok(resumeShutters(s,0,admit));eq(s.shutters.current.moves,moves);
 ok(startShutters(s,size===6?9:6,admit));eq(s.shutters.current.support,[],'other box explanation not falsely attributed');
 const seedRaw={version:1,current:{future:'Seed Pile unchanged'},earlier:[],notes:[],lesson:null};s.games=structuredClone(seedRaw);ok(startShutters(s,size,admit));eq(s.games,seedRaw,'cross-game root isolation');
}
const s=freshState();ok(shuttersView(s).absent);ok(!Object.hasOwn(s,'shutters'));ok(startShutters(s,6,admit));
roll(s,[3,3]);close(s,[6]);roll(s,[2,3]);close(s,[5]);roll(s,[2,2]);close(s,[4]);
eq(shuttersPosition(s.shutters.current).open,[1,2,3]);eq(shuttersPosition(s.shutters.current).dice,1,'sum6 switches to one die');
for(let face=1;face<=6;face++){const t=structuredClone(s);roll(t,[face]);eq(t.shutters.current.moves.at(-1).faces.length,1);}
roll(s,[4]);close(s,[1,3]);eq(shuttersPosition(s.shutters.current).open,[2]);roll(s,[6]);eq(shuttersPosition(s.shutters.current).phase,'blocked');ok(!rollShutters(s,admit));ok(!selectShutter(s,2,admit));
ok(keepShutterNote(s,'<b>Another way next time.</b>',admit));ok(!keepShutterNote(s,'twice',admit));eq(s.shutters.notes[0].game.source,s.shutters.current.source);
const win=freshState();ok(startShutters(win,6,admit));roll(win,[3,3]);close(win,[6]);roll(win,[2,3]);close(win,[5]);roll(win,[1,2]);close(win,[1,2]);eq(shuttersPosition(win.shutters.current).dice,2,'sum7 still needs two dice');roll(win,[3,4]);close(win,[3,4]);eq(shuttersPosition(win.shutters.current).phase,'won');ok(!rollShutters(win,admit));
const bad=structuredClone(win.shutters.current);bad.moves.push({kind:'roll',faces:[1]});eq(shuttersPosition(bad),null,'no move after ending');
const g=newShutters();g.moves=[{kind:'roll',faces:[3,4]},{kind:'close',tiles:[1,1,5]}];eq(shuttersPosition(g),null,'no duplicate shutters');g.moves=[{kind:'roll',faces:[7,0]}];eq(shuttersPosition(g),null);
for(const input of [0,7,null,NaN])eq(newShutters(input),null);
const raw={version:99,nested:{future:'preserve'}};s.shutters=raw;ok(startShutters(s,6,admit));eq(s.shutters.retained,raw);
s.shutters.current.source.model='future-shutters';const older=structuredClone(s.shutters.current);ok(startShutters(s,6,admit));eq(s.shutters.earlier.at(-1),older);
s.shutters.current.source.rule='A frozen earlier rule, not today’s copy.';ok(shuttersPosition(s.shutters.current));
let snapshot=structuredClone(s);ok(!rollShutters(s,()=>false));eq(s,snapshot,'formatted export preflight refusal atomic');
s.other={large:'x'.repeat(5*1024*1024)};snapshot=structuredClone(s);ok(!rollShutters(s,()=>true));eq(s,snapshot,'shared whole-notebook limit');delete s.other;
s.shutters.padding='x'.repeat(SHUTTERS_BYTES);snapshot=structuredClone(s);ok(!startShutters(s,9,admit));eq(s,snapshot,'no new root growth over budget');
s.shutters.earlier=[newShutters(),newShutters()];const priorBytes=JSON.stringify(s.shutters).length;ok(removeShutterRecord(s,'earlier',0,admit));ok(JSON.stringify(s.shutters).length<priorBytes&&JSON.stringify(s.shutters).length>SHUTTERS_BYTES,'partial removal above cap');ok(resumeShutters(s,0,admit),'swap can recover above cap');
const cap=freshState();ok(startShutters(cap,6,admit));cap.shutters.earlier=Array.from({length:64},()=>newShutters());snapshot=structuredClone(cap);ok(!startShutters(cap,9,admit));eq(cap,snapshot,'history cap atomic');
cap.shutters.earlier=[];cap.shutters.current.support=Array.from({length:12},(_,i)=>`unknown-${i}`);snapshot=structuredClone(cap);ok(!explainShutters(cap,0,admit));eq(cap,snapshot,'support cap atomic');
const ended=structuredClone(win.shutters.current);cap.shutters.current=ended;cap.shutters.notes=Array.from({length:24},()=>({text:'Synthetic note',game:ended}));snapshot=structuredClone(cap);ok(!keepShutterNote(cap,'one too many',admit));eq(cap,snapshot,'notes never silently evicted');
const imported=prepareProgressImport(JSON.stringify({...s,title:'Synthetic notebook'},null,2));ok(imported.ok,'actual formatted import accepts preserved root');
const missing=freshState();ok(startShutters(missing,6,admit));delete missing.shutters.lesson;ok(explainShutters(missing,0,admit));eq(missing.shutters.earlier,[],'absent lesson does not invent a retained record');
const refused=structuredClone(s);const refusedRoot=refused.shutters;const refusedCopy=structuredClone(refused);ok(!removeShutterRecord(refused,'earlier',0,()=>false));eq(refused,refusedCopy,'refused removal atomic');eq(refused.shutters,refusedRoot,'refused removal retains identity');
console.log(`Shutters: ${checks} assertions passed.`);
