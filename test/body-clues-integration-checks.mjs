import assert from 'node:assert/strict';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {startAdaptiveSpiral,inspectAdaptive,supportAdaptive,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {bodyView,startBody,setBodyPage,setBodyView,chooseBodyLegs,chooseBodyFeature,addBodySupport,checkBody,resumeBody} from '../dist/body-clues-core.mjs';
import {bodyDiagram} from '../dist/body-clues-art.mjs';
import {bodyCluesPage,bodyCluesNotes} from '../dist/body-clues-ui.mjs';
import {adaptivePage,adaptiveNotes} from '../dist/living-adaptive-ui.mjs';
import {startFair,setFairNote} from '../dist/fair-test-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());startAdaptiveSpiral(s);inspectAdaptive(s,0);supportAdaptive(s,'science','help');startFair(s);setFairNote(s,'An earlier fictional model note.');s.exposures=['2x5'];const old=structuredClone(s),suggestions=['science','reading','math'].map(k=>adaptiveSuggestion(s,k));
const r=startBody(s,'snail');chooseBodyLegs(s,'0');chooseBodyFeature(s,'rings');checkBody(s);chooseBodyFeature(s,'shell');addBodySupport(s,'together');checkBody(s);const rest=structuredClone(s);delete rest.bodyClues;eq(rest,old,'body module never touches existing habitat/parcel/stock/math/other games');eq(['science','reading','math'].map(k=>adaptiveSuggestion(s,k)),suggestions,'key checks do not become habitat suggestion evidence');
for(const page of ['inspect','key','keep'])for(const view of ['body','detail']){
 setBodyPage(s,page);setBodyView(s,view);const before=structuredClone(s);ok(adaptivePage(s,'bodies').includes('body-page'),'real allowed route reaches new pack');bodyCluesPage(s);bodyCluesNotes(s);adaptiveNotes(s);destinationNotes(s);eq(s,before,'all six page/view pairs and actual notes are pure');
}
ok(adaptivePage(s,'').includes('href="#living/bodies"'),'hub has new key invitation');ok(destinationNotes(s).includes('Living Garden body clues'),'actual grown-up notebook includes new records');
const frozen=structuredClone(s.bodyClues),raw=JSON.stringify(s);eq(restoreStateResult(raw).state.bodyClues,frozen,'generic restore preserves exact new branch');const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.bodyClues,frozen,'actual transfer preserves frozen pictures/key/support/results');store.save(s);const first=store.active.id,other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startBody(other,'worm');store.save(other);eq(store.select(first,other).bodyClues,frozen,'explorers retain their own picture trails');eq(initializeExplorerState(new ExplorerStore(disk).load()).bodyClues,frozen,'disk reload retains exact source and checks');
{
 const sample=initializeExplorerState(freshState()),before=structuredClone(sample);bodyCluesPage(sample);bodyCluesNotes(sample);adaptivePage(sample,'bodies');destinationNotes(sample);eq(sample,before,'opening an empty picture desk creates no branch, attempts or trim');
}
{
 const sample=structuredClone(s),round=bodyView(sample).current,c=round.checks[0];c.source.inspection='Earlier exact picture description.';c.source.label='Earlier adult label';c.named={id:'earlier',label:'Earlier recorded leaf'};c.features={legs:false,body:true};c.feedback='Earlier exact feedback.';delete c.support;const before=structuredClone(sample.bodyClues),html=bodyCluesPage(sample)+bodyCluesNotes(sample);ok(html.includes(c.source.inspection)&&html.includes(c.feedback)&&html.includes(c.named.label),'historical check displays its own source/label/feedback');eq(sample.bodyClues,before,'contradictory saved outputs are not regraded');eq(prepareProgressImport(JSON.stringify(sample)).state.bodyClues,before);
}
{
 const sample=structuredClone(s),round=bodyView(sample).current;
 round.source.key.push({id:'synthetic-fifth',legs:'6',body:'new_clue',label:'Synthetic fifth leaf',clue:'Synthetic fifth clue'});
 setBodyPage(sample,'key');const page=bodyCluesPage(sample),notes=bodyCluesNotes(sample);
 ok(page.includes('Our 5-picture key'),'current visit describes its frozen expanded key');
 ok(notes.includes('Synthetic fifth clue'),'notes show the expanded saved source');
 eq(round.checks[0].source.key.length,4,'older check retains its original four-entry source');
 chooseBodyLegs(sample,'other');const outsidePage=bodyCluesPage(sample);
 ok(outsidePage.includes('This is outside our 5-picture key.'),'outside leg branch renders the saved key size');
 ok(!outsidePage.includes('${r.source.key.length}'),'outside leg branch has no raw interpolation');
 checkBody(sample);const outsideRecord=bodyCluesPage(sample);
 ok(outsideRecord.includes('This trail stops outside our 5-picture key.'),'recorded outside trail renders the saved key size');
 ok(!outsideRecord.includes('${c.source.key.length}'),'outside record has no raw interpolation');
}
for(const raw of [null,'<script>opaque earlier body work</script>',{version:99,original:'<img src=x onerror="bad()">'}]){
 const sample=structuredClone(s);sample.bodyClues=structuredClone(raw);const before=structuredClone(sample.bodyClues),html=bodyCluesPage(sample)+bodyCluesNotes(sample)+adaptivePage(sample,'bodies');eq(sample.bodyClues,before);ok(!html.includes('<script>opaque')&&!html.includes('<img src=x'),'unreadable/future payload remains escaped');ok(prepareProgressImport(JSON.stringify(sample)).ok,'unreadable optional pack does not block generic import');
}
{
 const sample=structuredClone(s);sample.livingExploration={version:99,earlier:'retained habitat'};const before=structuredClone(sample);ok(adaptivePage(sample,'bodies').includes('body-page'),'body route occurs before old habitat future guard');eq(sample,before);const broken=structuredClone(r);broken.id=50;broken.source.drawing.version=2;sample.bodyClues.rounds.push(broken);sample.bodyClues.current=50;ok(bodyCluesPage(sample).includes('Earlier'),'unreadable drawing retained visibly');eq(sample.bodyClues.rounds.at(-1),broken);ok(startBody(sample,'woodlouse'));eq(sample.livingExploration,before.livingExploration,'new pack does not repair/replace unrelated future habitat');
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),sample=initializeExplorerState(off.load());startBody(sample,'ladybird');chooseBodyLegs(sample,'6');chooseBodyFeature(sample,'cases');checkBody(sample);off.save(sample);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null,'save-off writes no learner record');eq(off.load().bodyClues,sample.bodyClues,'save-off retains in-memory work');
}
{
 const sample=structuredClone(s);sample.bodyClues.rounds[0].futureField={kept:'exact'};sample.bodyClues.futureRoot='kept';const original=structuredClone(sample.bodyClues);setBodyPage(sample,'inspect');setBodyView(sample,'body');resumeBody(sample,1);eq(sample.bodyClues.rounds[0].futureField,original.rounds[0].futureField);eq(prepareProgressImport(JSON.stringify(sample)).state.bodyClues.futureRoot,'kept');
}
{
 const sample=structuredClone(s),source=sample.bodyClues.rounds[0].source;source.bodyText='Earlier exact body accessible text <safe>';source.detailText='Earlier exact detail accessible text <safe>';ok(bodyDiagram(source,'body').includes('Earlier exact body accessible text &lt;safe&gt;'),'body alt uses frozen source wording');ok(bodyDiagram(source,'detail').includes('Earlier exact detail accessible text &lt;safe&gt;'),'detail alt uses frozen source wording');ok(!bodyDiagram(source,'detail').includes('Enlarged'),'same-scale detail makes no enlargement claim');
}
console.log(`Body clues integration: ${n} assertions passed.`);
