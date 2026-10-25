import assert from 'node:assert/strict';
import fs from 'node:fs';
import {learningPlaces,learningInvitations,learningExplore,placeMatches} from '../dist/learning-invitations.mjs';
import {workshopApparatus,workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {startWorkshop,releaseWorkshop,stepWorkshop,ensureWorkshop,configurations,setWorkshopSupport} from '../dist/workshop-core.mjs';
import {ensureGarden} from '../dist/garden-core.mjs';
import {freshState,recommendations,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
const graph=JSON.parse(fs.readFileSync(new URL('../dist/marble-map.json',import.meta.url),'utf8'));
const byId=new Map(graph.topics.map(t=>[t.id,t]));
let checks=0;
const check=(x,message)=>{assert.ok(x,message);checks++;};
const equal=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
for(const p of learningPlaces){
 check(/^#(?:desk|loft|words|living|numbers|post|workshop|science|cafe|orchard|paris|activities\/(?:measurement|fractions))$/.test(p.href),'destination has a working app route');
 check(learningInvitations(p.id).includes('#explore'),'every place can reach the directory');
 for(const topic of p.topics){check(byId.has(topic.id),'topic link exists in bundled graph');check(topic.scope.length>40,'partial match has explanatory scope');check(placeMatches(topic.id).some(x=>x.id===p.id),'map can reach matched activity');}
}
equal(graph.topics.filter(t=>t.focus).length,25,'math focus targets unchanged');
for(const d of graph.dependencies){check(byId.has(d.topicId)&&byId.has(d.prerequisiteId),'every prerequisite endpoint exists');}
check(learningExplore(graph).includes('original story connections'),'thematic bridges labelled separately');
for(const c of configurations){
 const s=freshState();ensureGarden(s);const e=startWorkshop(s,'height',c.surface);e.setting=c.height;
 const before=JSON.stringify(s),rec=recommendations(s);
 const html=workshopPage(s);equal(JSON.stringify(s),before,'render does not mutate state or release a cart');
 check(html.includes('Waiting at the top'),'waiting phase has text equivalent');
 releaseWorkshop(s);const top=workshopApparatus(e);check(top.includes('Released: ready to roll'),'release phase is named');
 stepWorkshop(s);check(workshopApparatus(e).includes('translate(190,165)'),'cart at zero at ramp foot');
 stepWorkshop(s);const distance=c.distances[0],picture=workshopApparatus(e);
 check(picture.includes(`translate(${190+distance*12},165)`),'cart stopping position agrees with model distance');
 check(picture.includes(`Stopped ${distance} model cm`),'picture has exact text stopping distance');
 const done=workshopPage(s);check(done.includes(`<td>${distance}</td>`),'table agrees with picture');
 check(done.includes(`width:${distance/30*100}%`),'bar uses the same zero-based 0–30 scale');
 equal(recommendations(s),rec,'Workshop cannot affect multiplication suggestions');
 setWorkshopSupport(s,'audioRequested');check(workshopNotes(s).includes('Audio requested: yes'),'support visible in parent notes');
}
const kept=freshState();ensureGarden(kept);const e=startWorkshop(kept);releaseWorkshop(kept);stepWorkshop(kept);e.revision='future-ramp';ensureWorkshop(kept);
check(workshopPage(kept).includes('An earlier comparison is kept'),'unsupported model has visible recovery');
check(workshopNotes(kept).includes('future-ramp'),'old model and exact work remain readable');
class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=store.load();ensureGarden(s);const one=startWorkshop(s);releaseWorkshop(s);stepWorkshop(s);store.save(s);
const reloaded=new ExplorerStore(disk).load();equal(reloaded.workshop,s.workshop,'real explorer storage preserves pending Workshop');
const id=store.active.id,next=store.add({avatar:'sky',color:'blue',symbol:'shell'},s);check(!next.workshop,'second explorer starts separately');equal(store.select(id,next).workshop.current,one.id,'switching back keeps pending experiment');
store.setPersistence(false,s);check(![...disk.data.keys()].some(k=>k.startsWith(STORAGE_KEY)),'saving off removes persisted Workshop state');
equal(store.select(id).workshop.current,one.id,'saving off keeps current session in memory');
const reset=store.clearActive();check(!reset.workshop,'reset clears Workshop with the explorer');
console.log(`${checks} learning-invitation, rendering and storage checks passed.`);
