import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {drawLetter} from '../dist/letter-trail-core.mjs';
import {trailCases,trailPages,trailHelpTopics} from '../dist/fraction-trail-content.mjs';
import * as T from '../dist/fraction-trail-core.mjs';
import {renderFractionTrail,fractionTrailNotes,fractionTrailEntry} from '../dist/fraction-trail-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const fresh=()=>initializeExplorerState(freshState());
{
 const s=fresh(),before=JSON.stringify(s);T.trailView(s);renderFractionTrail(s);fractionTrailNotes(s);destinationNotes(s);eq(JSON.stringify(s),before,'readers lazy');ok(!Object.hasOwn(prepareProgressImport(before).state,'fractionTrail'),'absent root stays absent through import');
}
for(const c of trailCases){const s=fresh();T.chooseTrailCase(s,c.id);T.setTrailReading(s,'2-');for(const p of trailPages){T.setTrailPage(s,p);for(const h of [null,...trailHelpTopics]){T.setTrailHelp(s,h);const before=JSON.stringify(s),view=renderFractionTrail(s);ok(view.html.includes(c.request),'every turn keeps exact request');eq(view.facts,[],'fraction grid supplies no whole-number fact pairs');eq(JSON.stringify(s),before,'render read-only');eq(prepareProgressImport(before).state.fractionTrail,s.fractionTrail,'case/page/help raw state transfers');}}T.keepTrail(s);eq(prepareProgressImport(JSON.stringify(s)).state.fractionTrail,s.fractionTrail,'unfinished keep transfers');}
{
 const s=fresh();nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional ribbon show.');drawLetter(s,'post');s.futurePacking={pending:['fictional parcel'],raw:'2-'};const before=structuredClone(s);
 for(const c of trailCases){T.chooseTrailCase(s,c.id);T.prepareTrailTogether(s);T.setTrailReading(s,'2-');T.checkTrail(s,'spaces');T.checkTrail(s,'stop');T.keepTrail(s);renderFractionTrail(s);}
 const after=structuredClone(s);delete after.fractionTrail;eq(after,before,'waiting café/post/letters/Loft and opaque future work untouched');const imported=prepareProgressImport(JSON.stringify(s));delete imported.state.fractionTrail;eq(imported.state,before,'import preserves unrelated work');
}
for(const payload of [null,[],4,{version:99,raw:'<img src=x onerror="fictional()">'}]){const s=fresh();s.fractionTrail=payload;const before=JSON.stringify(s);ok(renderFractionTrail(s).html.includes('cannot play'),'unsupported root unavailable');ok(!destinationNotes(s).includes('<img src=x'),'unsupported note escaped');eq(JSON.stringify(s),before,'unsupported reads unchanged');eq(prepareProgressImport(before).state.fractionTrail,payload,'unsupported import exact');T.recoverTrail(s);T.prepareTrailTogether(s);T.checkTrail(s,'stop');T.keepTrail(s);eq(T.trailView(s).kept.priorExposureUnknown,true,'recovery keeps unknown');ok(fractionTrailNotes(s).includes('Earlier encounters are unknown'),'recovery notes qualified');eq(prepareProgressImport(JSON.stringify(s)).state.fractionTrail,s.fractionTrail,'recovered root exact');}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk);let s=initializeExplorerState(store.load());const id=store.active.id;T.chooseTrailCase(s,'past-one');T.prepareTrailTogether(s);T.setTrailReading(s,'2-');store.save(s);eq(new ExplorerStore(disk).load().fractionTrail,s.fractionTrail,'reload exact');const other=store.add({},s);ok(!other.fractionTrail,'new explorer separate');s=store.select(id,other);eq(T.trailView(s).flagTicks,15,'selected explorer resumes');store.setPersistence(false,s);store.save(s);eq(store.load().fractionTrail,s.fractionTrail,'save-off current session preserved');ok(!new ExplorerStore(disk).load().fractionTrail,'save-off disk removed');ok(!store.clearActive().fractionTrail,'reset removes active trail');
}
{
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),ending=app.slice(app.indexOf('function endingFilm(){'),app.indexOf("if(!choosingExplorer)playFilm('welcome');"));let calls=0;const ctx=vm.createContext({state:fresh(),choosingExplorer:false,location:{hash:'#cafe/fractions'},cafeSupper(){calls++;return {complete:true,round:1};}});vm.runInContext(ending,ctx);eq(vm.runInContext('endingFilm()',ctx),null,'fraction route triggers no supper film');eq(calls,0,'no supper inspection');
}
ok(fractionTrailEntry().includes('#cafe/fractions'),'entry reachable');console.log(`Fraction Trail app/storage integration: ${n} passed.`);
