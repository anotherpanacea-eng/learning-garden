import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {windowsView,startWindows,setWindowsPage,chooseWindowClaim,chooseWindowRelation,toggleWindowLine,checkWindowClaim,chooseWindowCard,checkWindowMessage,setWindowWords,keepWindowWords} from '../dist/two-windows-core.mjs';
import {twoWindowsPage,twoWindowsNotes} from '../dist/two-windows-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {loftPage} from '../dist/loft-ui.mjs';
import {postOfficePage} from '../dist/post-office-ui.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {startMap,placeMapMark} from '../dist/cartographer-core.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(x,m)=>{assert.ok(x,m);count++;};
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional puppet sees one side of a sign.');startMap(s);placeMapMark(s,0,0);const old=structuredClone(s);
const r=startWindows(s,'sign');chooseWindowClaim(s,'sign-inferred');chooseWindowRelation(s,'inferred');toggleWindowLine(s,'sign-B1');checkWindowClaim(s);chooseWindowCard(s,'sign-note-left');setWindowWords(s,'  My fictional note.\nExactly kept.  ');checkWindowMessage(s);keepWindowWords(s);const rest=structuredClone(s);delete rest.twoWindows;eq(rest,old,'all previous games/drafts/exposure data untouched');
for(const page of ['read','compare','message']){setWindowsPage(s,page);const before=structuredClone(s);const html=workshopPage(s,'windows');ok(html.includes('Two Windows'),'existing Workshop slug reaches reader desk');ok(html.includes('Original fiction'),'source kind explicit');workshopNotes(s);twoWindowsNotes(s);eq(s,before,'all actual pages/notes pure');}
ok(loftPage(s).includes('href="#workshop/windows"'),'stage links to story desk');ok(postOfficePage(s,'choose').includes('href="#workshop/windows"'),'Post links to same desk');
const raw=JSON.stringify(s),frozen=structuredClone(s.twoWindows);eq(restoreStateResult(raw).state.twoWindows,frozen,'generic restore keeps exact source packs/results/prose');const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.twoWindows,frozen,'ordinary transfer keeps exact writing and feedback');store.save(s);const first=store.active.id,other=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startWindows(other,'baskets','long');store.save(other);eq(store.select(first,other).twoWindows,frozen,'explorer switching restores its own records');eq(initializeExplorerState(new ExplorerStore(disk).load()).twoWindows,frozen,'actual disk reload keeps exact data');
{
 const sample=initializeExplorerState(freshState()),before=structuredClone(sample);twoWindowsPage(sample);twoWindowsNotes(sample);eq(sample,before,'missing desk view makes no visit');
}
for(const raw of [null,'<script>opaque original</script>',{version:99,payload:'<img src=x onerror="bad()">'}]){const sample=initializeExplorerState(freshState());sample.twoWindows=structuredClone(raw);const before=structuredClone(sample.twoWindows),html=twoWindowsPage(sample)+twoWindowsNotes(sample);eq(sample.twoWindows,before);ok(!html.includes('<script>opaque')&&!html.includes('<img src=x'),'opaque work escaped');ok(prepareProgressImport(JSON.stringify(sample)).ok,'opaque optional desk does not close transfer');}
{
 const sample=structuredClone(s),round=windowsView(sample).current;round.source.title='Earlier source title';round.source.accounts[0].lines[0].text='Earlier exact fictional wording.';round.claimChecks[0].classificationFits=false;round.claimChecks[0].expected='unknown';round.claimChecks[0].feedback='Earlier feedback that differs from today';round.messageChecks[0].fits=false;round.messageChecks[0].text='Earlier supplied wording';round.messageChecks[0].feedback='Earlier reader feedback';const before=structuredClone(sample.twoWindows),html=twoWindowsNotes(sample);ok(html.includes('Earlier source title')&&html.includes('Earlier exact fictional wording.'),'old frozen source displayed');ok(html.includes('Earlier feedback that differs from today')&&html.includes('Earlier supplied wording'),'old recorded outcome/feedback not regenerated');eq(sample.twoWindows,before);eq(prepareProgressImport(JSON.stringify(sample)).state.twoWindows,before,'old outcome contradictions do not block import');
}
{
 const sample=structuredClone(s);sample.twoWindows.rounds.push({id:500,original:'<b>kept unreadable visit</b>'});sample.twoWindows.current=500;const raw=structuredClone(sample.twoWindows.rounds.at(-1));chooseWindowRelation(sample,'unknown');eq(sample.twoWindows.rounds.at(-1),raw);ok(windowsView(sample).current.id!==500,'readable sibling remains playable');ok(twoWindowsNotes(sample).includes('&lt;b&gt;kept'),'raw sibling escaped');
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),sample=initializeExplorerState(off.load());startWindows(sample,'flags');setWindowWords(sample,'Session-only fictional words');off.save(sample);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null,'save-off writes no learner record');eq(off.load().twoWindows,sample.twoWindows,'save-off retains session in memory');
}
{
 const sample=structuredClone(s),round=structuredClone(sample.twoWindows.rounds[0]);sample.twoWindows.rounds=Array.from({length:13},(_,i)=>({...structuredClone(round),id:i+1}));sample.twoWindows.current=13;sample.twoWindows.nextId=14;const before=structuredClone(sample.twoWindows);ok(twoWindowsPage(sample).includes('oldest 2 readable visits'),'oversized import discloses exact eviction');eq(sample.twoWindows,before,'view does not trim oversized history');startWindows(sample,'baskets');eq(windowsView(sample).rounds.map(r=>r.id),Array.from({length:12},(_,i)=>i+3),'new action evicts exactly disclosed visits');
}
{
 const sample=structuredClone(s),round=windowsView(sample).current;setWindowsPage(sample,'message');
 round.messageChecks=[structuredClone(round.messageChecks.find(c=>c.card!==null))];const html=twoWindowsPage(sample),fit=html.indexOf('Supplied card fit for the reader'),feedback=html.indexOf('windows-feedback'),own=html.indexOf('Own words at this moment (ungraded, not part of this card check');
 ok(fit>=0&&fit<feedback&&feedback<own,'supplied card verdict precedes explicitly ungraded own prose');
 round.source.reader.knows='b';ok(twoWindowsPage(sample).includes('knows only account B'),'frozen reader knowledge drives context');
 setWindowsPage(sample,'compare');const c=round.claimChecks[0];c.evidenceFits=null;c.lines=['sign-B1'];let text=twoWindowsPage(sample);ok(text.includes('Reread both accounts for the missing detail')&&!text.includes('Recorded useful lines'),'unknown guidance keeps selection separate from proof of missing fact');
 c.evidenceFits=false;c.used=[];text=twoWindowsPage(sample);ok(text.includes('No recorded useful lines.'),'empty useful set does not misreport selected lines');
}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('workshopPage(state,slug)'),'uses existing root adapter');ok(!app.includes("from './two-windows"),'held app is not adapted');ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('two-windows.css'),'stylesheet linked');
console.log(`Two Windows integration: ${count} assertions passed.`);
