import assert from 'node:assert/strict';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {startFair,setFairPage,setFairNote,revealFair} from '../dist/fair-test-core.mjs';
import {apprenticeView,startApprentice,setApprenticeOpen,setApprenticePage,changeApprenticeRepair,chooseApprenticeCard,setApprenticeWords,checkApprenticeDemonstration,checkApprenticeCard,keepApprenticeWords} from '../dist/fair-test-apprentice-core.mjs';
import {fairTestPage,fairTestNotes} from '../dist/fair-test-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startMap,placeMapMark} from '../dist/cartographer-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());
startFair(s);revealFair(s,'A');setFairPage(s,'tell');setFairNote(s,'  Earlier real draft.\nExactly kept.  ');startShow(s,'welcome');setSceneDialogue(s,'A fictional puppet helps the crew.');startPostOffice(s,deliveries[0].id);startMap(s);placeMapMark(s,0,0);
const old=structuredClone(s),r=startApprentice(s,'height');changeApprenticeRepair(s,'b','high-smooth');chooseApprenticeCard(s,'height-useful');setApprenticeWords(s,'\n  Our fictional words.\r\n<&>  ');checkApprenticeDemonstration(s);checkApprenticeCard(s);keepApprenticeWords(s);
const before=structuredClone(s);delete before.fairTests.apprentice;delete before.fairTests.apprenticeOpen;eq(before,old,'all ordinary investigations and other games/exposures unchanged');
for(const page of ['notice','show','explain']){setApprenticePage(s,page);const before=structuredClone(s);const html=workshopPage(s,'fair');ok(html.includes('Moss'),'existing Fair route reaches apprentice');fairTestNotes(s);workshopNotes(s);eq(s,before,'all parent/child renders and notes pure');}
const frozen=structuredClone(s.fairTests.apprentice),raw=JSON.stringify(s);eq(restoreStateResult(raw).state.fairTests.apprentice,frozen,'generic restore preserves all nested work');const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.fairTests.apprentice,frozen,'ordinary transfer preserves exact prose/results/model');
store.save(s);const first=store.active.id,other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startApprentice(other,'surface');store.save(other);eq(store.select(first,other).fairTests.apprentice,frozen,'explorer switch restores own source/checks');eq(initializeExplorerState(new ExplorerStore(disk).load()).fairTests.apprentice,frozen,'actual disk reload preserves work');
setApprenticeOpen(s,false);eq(s.fairTests.page,old.fairTests.page);eq(s.fairTests.investigations,old.fairTests.investigations,'close restores same base draft');ok(fairTestPage(s).includes('fair-note'),'base Tell page still available');setApprenticeOpen(s,true);
{
 const sample=initializeExplorerState(freshState()),before=structuredClone(sample);fairTestPage(sample);fairTestNotes(sample);eq(sample,before,'merely viewing bench creates no apprentice');setApprenticeOpen(sample,true);fairTestPage(sample);eq(sample.fairTests.apprentice,undefined,'open catalog creates no encounter');eq(sample.fairTests.investigations,[]);
}
for(const value of [null,'<script>opaque apprentice</script>',{version:99,original:'<img src=x onerror="bad()">'}]){
 const sample=structuredClone(s);sample.fairTests.apprentice=structuredClone(value);const before=structuredClone(value),html=fairTestPage(sample)+fairTestNotes(sample);ok(!html.includes('<script>opaque')&&!html.includes('<img src=x'),'raw child escaped');eq(sample.fairTests.apprentice,before);ok(prepareProgressImport(JSON.stringify(sample)).ok,'raw child does not close transfer');setApprenticeOpen(sample,false);ok(fairTestPage(sample).includes('fair-note'),'opaque child can return to base without reset');eq(sample.fairTests.apprentice,before);
}
{
 const sample=structuredClone(s),round=apprenticeView(sample).current;round.source.claim='Earlier original apprentice wording';round.source.model[0].distances=[2,2,2];round.checks[0].values={a:[30,30,30],b:[0,0,0]};round.checks[0].focused=false;round.checks[0].feedback='Earlier exact demonstration feedback';round.checks[1].card.fits=false;round.checks[1].card.text='Earlier supplied card text';round.checks[1].feedback='Earlier card feedback';const before=structuredClone(sample.fairTests.apprentice),html=fairTestNotes(sample);ok(html.includes('Earlier original apprentice wording')&&html.includes('Earlier exact demonstration feedback'),'old source/feedback displayed');ok(html.includes('Earlier supplied card text')&&html.includes('Earlier card feedback'),'old contradictory card output displayed');eq(sample.fairTests.apprentice,before,'notes do not regrade');eq(prepareProgressImport(JSON.stringify(sample)).state.fairTests.apprentice,before);
}
{
 const sample=structuredClone(s);sample.fairTests.apprentice.rounds.push({id:70,original:'<b>earlier raw work</b>'});sample.fairTests.apprentice.current=70;const before=structuredClone(sample.fairTests.apprentice.rounds.at(-1));setApprenticeWords(sample,'New fictional words');eq(sample.fairTests.apprentice.rounds.at(-1),before);ok(fairTestNotes(sample).includes('&lt;b&gt;earlier raw work'),'raw sibling retained escaped');
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),sample=initializeExplorerState(off.load());startApprentice(sample,'careful');setApprenticeWords(sample,'Session-only fictional explanation');off.save(sample);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null,'save-off no learner disk record');eq(off.load().fairTests.apprentice,sample.fairTests.apprentice,'save-off keeps session');
}
{
 const sample=structuredClone(s),round=structuredClone(sample.fairTests.apprentice.rounds[0]);sample.fairTests.apprentice.rounds=Array.from({length:13},(_,i)=>({...structuredClone(round),id:i+1}));sample.fairTests.apprentice.current=13;sample.fairTests.apprentice.nextId=14;const before=structuredClone(sample.fairTests.apprentice),html=fairTestPage(sample);ok(/oldest 2 readable/i.test(html),'oversized import discloses exact2 eviction');eq(sample.fairTests.apprentice,before,'view never trims oversized history');startApprentice(sample,'surface');eq(apprenticeView(sample).rounds.map(r=>r.id),Array.from({length:12},(_,i)=>i+3));
}
console.log(`Fair Test apprentice integration: ${n} assertions passed.`);
