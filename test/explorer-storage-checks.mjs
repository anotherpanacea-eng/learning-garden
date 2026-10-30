import assert from 'node:assert/strict';
import {ExplorerStore,REGISTRY_KEY,SAVE_KEY,EXPLORER_COLORS,EXPLORER_SYMBOLS} from '../dist/explorer-storage.mjs';
import {freshState,restoreState,restoreStateResult,recommendations,STORAGE_KEY} from '../dist/core.mjs';
let checks=0;
const check=(value,label)=>{assert.ok(value,label);checks++;};
const equal=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
class Storage{
 constructor(entries={}){this.data=new Map(Object.entries(entries));this.fail=()=>false;this.log=[];}
 get length(){return this.data.size;}
 key(i){return [...this.data.keys()][i]??null;}
 getItem(k){if(this.fail('get',k))throw new Error('Synthetic read failure');return this.data.get(k)??null;}
 setItem(k,v){this.log.push(['set',k,v]);if(this.fail('set',k))throw new Error('Synthetic quota failure');this.data.set(k,v);}
 removeItem(k){this.log.push(['remove',k]);if(this.fail('remove',k))throw new Error('Synthetic removal failure');this.data.delete(k);}
}
const options={now:()=>new Date('2026-01-02T03:04:05.000Z')};
const store=storage=>new ExplorerStore(storage,options);
const key=id=>`${STORAGE_KEY}:${id}`;
const copies=storage=>[...storage.data.keys()].filter(k=>/^number-garden-(backup|kept)-/.test(k));
const legacy={...freshState(),garden:{avatar:'reed',guide:'rowan',seen:['synthetic-story']},cafe:{served:3},facts:{seen:['2x3']}};
const raw=JSON.stringify(legacy,null,2);

for(const malformed of ['bad json','{}',JSON.stringify({...freshState(),practice:[{}]})]){const r=restoreStateResult(malformed);check(!!r.reason,'restore failure has reason');equal(r.state,freshState(),'failure returns fresh');equal(restoreState(malformed),r.state,'compatibility restore API');}
equal(restoreStateResult(raw).reason,null,'valid restore');

{
 const disk=new Storage({[STORAGE_KEY]:raw,unrelated:'keep'}),m=store(disk),s=m.load();
 equal(s.cafe,{served:3},'legacy cafe retained');equal(m.active.avatar,'reed','legacy avatar copied');equal(disk.data.get(STORAGE_KEY),raw,'legacy remains byte identical');equal(disk.data.get(key(m.active.id)),raw,'migration state key is byte identical');check(copies(disk).some(k=>disk.data.get(k)===raw),'backup is byte identical');
 const writes=disk.log.filter(x=>x[0]==='set').map(x=>x[1]);check(writes.at(-1)===REGISTRY_KEY,'registry is committed last');check(!m.needsChooser,'one explorer no chooser');equal(disk.data.get('unrelated'),'keep','unrelated storage untouched');
 s.plantings={plots:[],pending:[]};check(m.save(s),'additive fields save');const count=copies(disk).length;check(m.save(s),'second save');equal(copies(disk).length,count,'no repeated addition backups');equal(store(disk).load().cafe,s.cafe,'reload preserves destination');
 check(m.keptCopies().some(c=>c.key===STORAGE_KEY&&c.raw===raw),'legacy offered for download');check(!m.removeCopy(REGISTRY_KEY),'recovery remove cannot erase registry');
}
for(const phase of ['backup','state','registry']){
 const disk=new Storage({[STORAGE_KEY]:raw});disk.fail=(op,k)=>op==='set'&&(phase==='backup'?k.startsWith('number-garden-backup-'):phase==='state'?k.startsWith(`${STORAGE_KEY}:`):k===REGISTRY_KEY);
 const m=store(disk),s=m.load();equal(s.cafe,{served:3},phase+' in memory migration');check(!!m.warning,phase+' warning');equal(disk.data.get(STORAGE_KEY),raw,phase+' original retained');equal(disk.data.get(REGISTRY_KEY),undefined,phase+' no partial registry');s.cafe.served=8;check(!m.save(s),phase+' future save blocked');equal(disk.data.get(STORAGE_KEY),raw,phase+' no overwrite');
 disk.fail=()=>false;const retry=store(disk),restored=retry.load();equal(restored.cafe,{served:3},phase+' retry restores original');check(!!disk.data.get(REGISTRY_KEY),phase+' retry commits');
}
{
 const disk=new Storage({[STORAGE_KEY]:'{ unreadable'}),m=store(disk),s=m.load();check(!!m.warning,'invalid legacy warning');check(m.keptCopies().some(x=>x.raw==='{ unreadable'),'invalid legacy preserved');check(m.save(s),'fresh session can save after keeping invalid');equal(disk.data.get(STORAGE_KEY),'{ unreadable','invalid original read only');
}
{
 const disk=new Storage(),original=store(disk);original.load();const id=original.active.id;disk.data.set(key(id),'unreadable progress');disk.fail=(op,k)=>op==='set'&&k.startsWith('number-garden-kept-');const m=store(disk),s=m.load();check(!!m.warning,'unreadable explorer warning');s.sessions=5;check(!m.save(s),'backup failure blocks fresh overwrite');equal(disk.data.get(key(id)),'unreadable progress','failed keep retains source');disk.fail=()=>false;check(m.save(s),'retry succeeds after retained copy');check(m.keptCopies().some(c=>c.raw==='unreadable progress'),'raw corrupt bytes available');equal(JSON.parse(disk.data.get(key(id))).sessions,5,'new state saved only after preservation');
}
for(const failKeep of [false,true]){
 const invalid=JSON.stringify({version:1,activeId:'../../other',explorers:[{id:'../../other'}]});const disk=new Storage({[REGISTRY_KEY]:invalid});disk.fail=(op,k)=>failKeep&&op==='set'&&k.startsWith('number-garden-kept-');const m=store(disk),s=m.load();check(!!m.warning,'registry failure warning');check(/^explorer-\d+$/.test(m.active.id),'safe generated ID');check(!disk.log.some(x=>x[1].includes('../')),'invalid paths never used');if(failKeep){check(!m.save(s),'bad registry keep failure blocks save');equal(disk.data.get(REGISTRY_KEY),invalid,'bad registry retained');}else check(m.keptCopies().some(c=>c.raw===invalid),'bad registry kept before replacement');
}
{
 const disk=new Storage(),m=store(disk),first=m.load(),a=m.active.id;first.practice=[{questionId:'synthetic-fact',skill:'facts',attempts:[6],status:'answered',fact:[2,3],correct:false,supported:true,firstCorrect:false}];first.cafe={served:4,current:{stage:'plate',recipe:[{id:'synthetic-food',count:1}]}};first.garden.seen=['synthetic-reading'];first.broad={seenItems:['synthetic-item'],seenFacts:['2x3']};first.voice={id:'local-choice',rate:0.8};check(m.save(first),'first profile saves');
 const second=m.add({avatar:'fern',color:'blue',symbol:'shell'},first),b=m.active.id;check(a!==b,'different IDs');equal(second.garden.avatar,'fern','chosen avatar on fresh state');equal(second.practice,[],'practice isolated');equal(second.cafe,undefined,'cafe isolated');equal(second.garden.seen,undefined,'reading isolated');equal(second.broad,undefined,'familiarity isolated');equal(second.voice,undefined,'voice isolated');check(recommendations(first).route==='facts'&&recommendations(second).route==='mixed','recommendations isolated');second.sessions=8;m.save(second);
 equal(m.select(a,second),first,'switch returns original session');equal(m.active.id,a,'switch selects profile');equal(m.select('bad-id'),null,'unknown selection rejected');equal(m.active.id,a,'unknown selection unchanged');
 const reopened=store(disk);reopened.load();check(reopened.needsChooser,'two explorers ask on reopening');equal(reopened.select(b).sessions,8,'second session survives reload');check(!reopened.needsChooser,'selection dismisses chooser');
 check(m.setPersistence(false,first),'save off');equal([...disk.data.keys()],[SAVE_KEY],'off removes all managed copies');equal(disk.data.get(SAVE_KEY),'off','off preference retained');equal(m.select(b).sessions,8,'off retains second in memory');equal(m.select(a).cafe.served,4,'off retains first in memory');const log=disk.log.length;first.sessions=22;check(m.save(first),'off save updates memory');equal(disk.log.length,log,'off performs no writes');equal(store(disk).load().sessions,0,'off reload fresh');
 check(m.setPersistence(true,first),'saving on restores in memory explorers');equal(store(disk).load().sessions,22,'active saved after on');equal(store(disk).select(b).sessions,8,'inactive also saved after on');
 const cleared=m.clearActive();equal(cleared.practice,[],'clear active new notebook');equal(m.select(b).sessions,8,'clear active keeps other explorer');m.select(a);m.clearAll();equal(m.explorers.length,1,'clear all removes explorer list');equal(m.load().practice,[],'clear all fresh');equal(disk.data.get(SAVE_KEY),'on','clear all preserves preference');
}
{
 const disk=new Storage(),m=store(disk),s=m.load();s.plantings={plots:[],pending:[]};check(m.save(s),'new explorer saves plantings');m.add({},s);check(m.save(m.load()),'added explorer saves');equal(copies(disk),[],'new explorers create no backup or kept copies');
}
{
 const disk=new Storage({[REGISTRY_KEY]:'broken'});disk.fail=(op,k)=>op==='set'&&k.startsWith('number-garden-kept-');const m=store(disk),s=m.load();check(!m.setPersistence(true,s),'enable cannot bypass invalid registry preservation');equal(disk.data.get(REGISTRY_KEY),'broken','enable leaves invalid registry untouched');
}
{
 const disk=new Storage({unrelated:'untouched'}),m=store(disk),s=m.load();const recovery='number-garden-kept-explorer-1-example';disk.data.set(recovery,'synthetic unreadable');check(m.removeCopy(recovery),'explicit recovery remove');check(!disk.data.has(recovery),'recovery removed');disk.fail=(op)=>op==='remove';check(!m.setPersistence(false,s),'off removal failure reported');check(!!m.warning,'removal failure warning');equal(disk.data.get('unrelated'),'untouched','unrelated retained during failure');
}
{
 const unavailable=new ExplorerStore(undefined,options),s=unavailable.load();check(!!unavailable.warning,'no storage warning');equal(s.version,1,'no storage in memory state');check(!unavailable.save(s),'no storage cannot claim save');
 const disk=new Storage();disk.fail=op=>op==='get';const m=store(disk);equal(m.load().version,1,'read failure keeps app usable');check(!!m.warning,'read failure visible');check(!m.save(m.load()),'read failure blocks writes');
}
{
 const disk=new Storage(),m=store(disk);m.load();const first={...m.active},firstId=first.id;
 const duplicate=m.add(first);check(!!duplicate,'duplicate requested picture still creates explorer');equal(m.active.avatar,first.avatar,'duplicate retains requested avatar');equal(m.active.color,first.color,'duplicate tries next symbol before changing color');check(m.active.symbol!==first.symbol,'duplicate changes symbol');equal(m.explorers.find(p=>p.id===firstId),first,'existing picture unchanged');
 const again=m.add(first);check(!!again,'second duplicate safely resolves');check(new Set(m.explorers.map(p=>`${p.avatar}:${p.color}:${p.symbol}`)).size===3,'all new pictures distinguishable');
}
{
 const disk=new Storage(),m=store(disk);m.load();const requested={avatar:'sky',color:'gold',symbol:'leaf'};
 for(let i=1;i<36;i++)check(!!m.add(requested),'same avatar combination available');
 equal(m.explorers.filter(p=>p.avatar==='sky').length,36,'all same avatar combinations used');
 check(!!m.add(requested),'falls back when avatar exhausted');check(m.active.avatar!=='sky','fallback uses different avatar');
 while(m.explorers.length<108)check(!!m.add(requested),'remaining avatar combination available');
 const before=JSON.stringify(m.registry),memoryBefore=m.memory.size,activeId=m.active.id,diskBefore=[...disk.data];
 equal(m.add(requested),null,'all combinations full returns null');equal(JSON.stringify(m.registry),before,'full list preserved');equal(m.memory.size,memoryBefore,'no extra session on exhaustion');equal(m.active.id,activeId,'full list keeps active explorer');equal([...disk.data],diskBefore,'no storage mutation on exhaustion');check(m.warning.includes('All explorer pictures are in use'),'full list has useful warning');
 check(new Set(m.explorers.map(p=>`${p.avatar}:${p.color}:${p.symbol}`)).size===108,'every visible combination unique');
}
equal(EXPLORER_COLORS.length,6,'six colors');equal(EXPLORER_SYMBOLS.length,6,'six symbols');
console.log(`${checks} explorer storage checks passed.`);

// Two independent loaded tabs share one synthetic browser store.
for(const operation of ['save','clearActive','clearAll','off','on','add','select','import','remove']){
 const disk=new Storage(),a=store(disk),sa=a.load(),b=store(disk),sb=b.load();
 sa.syntheticWork={from:'tab A'};check(a.save(sa),'winning tab saves '+operation);
 sb.syntheticWork={from:'tab B'};const before=[...disk.data],local=JSON.stringify(sb);
 const actions={save:()=>b.save(sb),clearActive:()=>b.clearActive(),clearAll:()=>b.clearAll(),off:()=>b.setPersistence(false,sb),on:()=>b.setPersistence(true,sb),add:()=>b.add({},sb),select:()=>b.select(b.active.id,sb),import:()=>b.importState({ok:true,raw:JSON.stringify(freshState()),state:freshState()}),remove:()=>b.removeCopy(STORAGE_KEY)};
 actions[operation]();equal([...disk.data],before,'stale '+operation+' leaves every saved byte intact');check(b.conflict,'stale '+operation+' has conflict');check(b.warning.includes('Download this tab’s notes'),'conflict offers recovery');equal(JSON.stringify(b.load()),local,'local unsaved notebook preserved '+operation);check(!b.save(sb),'conflict is sticky');check(!b.setPersistence(true,sb),'cannot toggle through conflict');equal(store(disk).load().syntheticWork,{from:'tab A'},'fresh reload sees winning work');
}
{
 const disk=new Storage(),a=store(disk),sa=a.load();a.add({},sa);a.select('explorer-1');
 const b=store(disk);b.load();const sb=b.select('explorer-2');
 sa.syntheticWork={from:'one'};check(a.save(sa),'other tab active selection does not block first explorer');
 sb.syntheticWork={from:'two'};check(b.save(sb),'different explorers can save independently');
 const fresh=store(disk);equal(fresh.load().syntheticWork,{from:'two'},'second explorer saved');equal(fresh.select('explorer-1').syntheticWork,{from:'one'},'first explorer saved');
 // Clearing all or turning saving off must also check inactive notebooks.
 const c=store(disk),sc=c.load();sc.syntheticWork={from:'newer one'};c.save(sc);
 const before=[...disk.data];check(!b.setPersistence(false,sb),'inactive changed notebook prevents deleting all saves');equal([...disk.data],before,'other explorer save retained on stale off');
}
for(const operation of ['clear','off','add','import']){
 const disk=new Storage(),a=store(disk),sa=a.load();sa.sessions=1;a.save(sa);const b=store(disk),sb=b.load();
 if(operation==='clear')a.clearActive();
 if(operation==='off')a.setPersistence(false,sa);
 if(operation==='add')a.add({},sa);
 if(operation==='import')a.importState({ok:true,raw:JSON.stringify(freshState()),state:freshState()});
 const before=[...disk.data];sb.sessions=22;check(!b.save(sb),'stale tab cannot resurrect after '+operation);equal([...disk.data],before,'newer '+operation+' remains intact');
}
{
 const disk=new Storage(),a=store(disk),sa=a.load(),b=store(disk);b.load();
 sa.sessions=3;a.save(sa);check(!b.checkForUpdates(),'notification check detects external change without writing');const before=[...disk.data];check(!b.checkForUpdates(),'repeat notification remains blocked');equal([...disk.data],before,'notification check never writes');
}
console.log(`${checks} explorer storage checks including two-tab recovery passed.`);
{
 const disk=new Storage(),a=store(disk),sa=a.load();a.setPersistence(false,sa);const b=store(disk),sb=b.load();
 a.setPersistence(true,sa);sa.sessions=9;a.save(sa);const before=[...disk.data];
 check(!b.setPersistence(true,sb),'tab opened with saving off cannot overwrite later persistent work');equal([...disk.data],before,'off-start stale enable leaves disk untouched');
}
{
 const disk=new Storage({[STORAGE_KEY]:raw}),get=disk.getItem.bind(disk);let armed=true,winner;
 disk.getItem=k=>{if(armed&&k===STORAGE_KEY){armed=false;const a=store(disk);winner=a.load();winner.sessions=17;a.save(winner);}return get(k);};
 const b=store(disk);b.load();check(b.conflict,'migration notices registry changed after its initial read');const before=[...disk.data];check(!b.save(b.load()),'second migration cannot replace newer registry');equal([...disk.data],before,'raced migration leaves winning copy untouched');equal(store(disk).load().sessions,17,'winning migration progress retained');
}
console.log(`${checks} explorer storage checks including initialization races passed.`);

for(const saving of [false,true]){
 const disk=new Storage(),a=store(disk),first=a.load();first.syntheticWork={from:'local first'};a.save(first);const second=a.add({},first),other=a.active.id;second.syntheticWork={from:'local second'};a.save(second);
 if(!saving)a.setPersistence(false,second);a.select('explorer-1',second);const b=store(disk),remote=b.load();b.setPersistence(true,remote);remote.syntheticWork={from:'remote'};b.save(remote);
 check(!a.checkForUpdates(),'sibling change pauses '+saving+' saving session');const before=[...disk.data];
 equal(a.select(other,first).syntheticWork,{from:'local second'},'other in-memory notebook remains available for export');equal(a.select('explorer-1',second).syntheticWork,{from:'local first'},'first local notebook remains available for export');equal([...disk.data],before,'recovery switching never writes saved data');check(!a.save(first),'switching does not lift pause');
}
console.log(`${checks} explorer storage checks including multi-notebook recovery passed.`);
