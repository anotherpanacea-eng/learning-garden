import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {startClock,stepClock,checkClock} from '../dist/preparation-clock-core.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {startAdaptiveRival,setRivalInput} from '../dist/post-rival.mjs';
import {ensureTravelersArchive,setArchiveSource,setArchiveQuestion,setArchiveReplyText,setArchiveReplyChoice,answerArchiveQuestion,checkArchiveReply,keepArchiveReply} from '../dist/travelers-archive-core.mjs';
import {travelersArchivePage} from '../dist/travelers-archive-ui.mjs';
import {startAdaptiveSpiral,inspectAdaptive,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {trailView,startTrail,resumeTrail,setTrailPage,setTrailCard,chooseTrailAnswer,addTrailSupport,checkTrail,trailCheckMatches} from '../dist/source-trail-core.mjs';
import {sourceTrailPage,sourceTrailNotes} from '../dist/source-trail-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());startClock(s,'maps');stepClock(s,1);checkClock(s);ok(startPostOffice(s,'clover-buns'));ok(startAdaptiveRival(s));setRivalInput(s,'17');ensureTravelersArchive(s);setArchiveSource(s,'chronology');setArchiveQuestion(s,'photo-date');answerArchiveQuestion(s,'photo-date','not-alone');ok(setArchiveReplyText(s,'An original synthetic display reply.').ok);setArchiveReplyChoice(s,'claim','return-later');setArchiveReplyChoice(s,'evidence','both');setArchiveReplyChoice(s,'limit','both');checkArchiveReply(s);keepArchiveReply(s);startAdaptiveSpiral(s);inspectAdaptive(s,0);s.exposures=['3x4'];const before=copy(s),suggestions=['science','reading','math'].map(k=>adaptiveSuggestion(s,k));
const r=startTrail(s,'origin');chooseTrailAnswer(s,'photo');ok(checkTrail(s).outcome);addTrailSupport(s,'together');checkTrail(s);const other=copy(s);delete other.sourceTrail;eq(other,before,'actual Archive original words/source/question/checks/kept, adaptiveBramble and everyolderroot untouched');eq(['science','reading','math'].map(k=>adaptiveSuggestion(s,k)),suggestions);
for(const page of ['cards','try','kept']){setTrailPage(s,page);const exact=copy(s);ok(workshopPage(s,'sources').includes('trail-page'));sourceTrailPage(s);sourceTrailNotes(s);workshopNotes(s);destinationNotes(s);eq(s,exact,'all pages/notes pure');}
const frozen=copy(s.sourceTrail),raw=JSON.stringify(s);eq(restoreStateResult(raw).state.sourceTrail,frozen);const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.sourceTrail,frozen);store.save(s);const first=store.active.id,otherExplorer=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startTrail(otherExplorer,'reply');store.save(otherExplorer);eq(store.select(first,otherExplorer).sourceTrail,frozen);eq(initializeExplorerState(new ExplorerStore(disk).load()).sourceTrail,frozen);
for(const payload of [null,'<script>not executable</script>',{version:77,raw:'<img src=x onerror="bad()">'}]){const state=initializeExplorerState(freshState());state.sourceTrail=copy(payload);const exact=copy(state),html=sourceTrailPage(state)+sourceTrailNotes(state);eq(state,exact);ok(!html.includes('<script>not')&&!html.includes('<img src=x'));ok(prepareProgressImport(JSON.stringify(state)).ok);}
{
 const state={};sourceTrailPage(state);sourceTrailNotes(state);eq(state,{});const visit=startTrail(state,'origin');visit.source.pictureVersion=99;visit.source.photo.src='https://example.invalid/never-load-this.jpg';visit.source.photo.alt='Earlier picture <as text>';visit.source.photo.credit='Earlier own credit';visit.source.photo.url='javascript:alert(1)';visit.source.cards[0].url='data:text/html,bad';setTrailPage(state,'cards');const html=sourceTrailPage(state);ok(html.includes('Earlier picture &lt;as text&gt;'));ok(html.includes('Earlier own credit'));ok(!html.includes('<img '),'no wrong image on future source');ok(!/href=["'](?:javascript:|data:)/.test(html),'unsafe URLs are original plain text');eq(prepareProgressImport(JSON.stringify({...freshState(),...state})).state.sourceTrail,state.sourceTrail);
}
{
 const state={},visit=startTrail(state,'origin');visit.source.photo.src='https://example.invalid/never-load-this.jpg';setTrailPage(state,'cards');ok(!sourceTrailPage(state).includes('<img '),'unrecogniseddescriptor never causes networkimage');visit.source.photo.src='./assets/archive-paris-1910-ph8646.jpg';visit.source.photo.filename='another.jpg';ok(!sourceTrailPage(state).includes('<img '),'filenamealsoallowlisted');
}
{
 const state={},visit=startTrail(state,'origin');chooseTrailAnswer(state,'photo');const c=checkTrail(state);c.outcome=false;c.selectedLabel='Earlier recorded label';c.feedback='Earlier contradictory result';visit.source.title='Later source words';const exact=copy(state),html=sourceTrailPage(state)+sourceTrailNotes(state);ok(html.includes('Earlier contradictory result'));ok(html.includes('Earlier recorded label'));eq(state,exact);ok(!trailCheckMatches(visit));checkTrail(state);ok(sourceTrailPage(state).includes('Earlier recorded check'));ok(sourceTrailPage(state).includes('Latest check of this answer and support'));
}
{
 const state={},visit=startTrail(state,'origin');state.sourceTrail.rounds.push({id:2,raw:'<b>older</b>'});state.sourceTrail.current=2;const raw=copy(state.sourceTrail.rounds[1]);eq(trailView(state).current,null);eq(chooseTrailAnswer(state,'photo'),false);eq(setTrailPage(state,'try'),false);ok(resumeTrail(state,visit.id));chooseTrailAnswer(state,'photo');eq(trailView(state).earlier,[raw]);ok(sourceTrailPage(state).includes('&lt;b&gt;'));const duplicate=copy(visit);state.sourceTrail.rounds.push(duplicate);eq(trailView(state).earlier,[raw,duplicate]);
}
{
 const state={},r=startTrail(state,'origin');state.sourceTrail.rounds=Array.from({length:15},(_,i)=>({...copy(r),id:i+1}));state.sourceTrail.current=15;state.sourceTrail.nextId=16;state.sourceTrail.rounds.push({id:80,raw:'kept unknown'});const exact=copy(state),html=sourceTrailPage(state);eq(state,exact);ok(html.includes('oldest 4 readable visits'));startTrail(state,'reply');eq(trailView(state).rounds.length,12);eq(trailView(state).rounds[0].id,5);eq(state.sourceTrail.current,81);eq(trailView(state).earlier,[{id:80,raw:'kept unknown'}]);
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),state=initializeExplorerState(off.load());startTrail(state,'origin');chooseTrailAnswer(state,'photo');off.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null);eq(off.load().sourceTrail,state.sourceTrail);
}
{
 const state={},r=startTrail(state,'origin');r.source.choices.reverse();setTrailPage(state,'try');const html=sourceTrailPage(state);ok(html.indexOf('data-trail-answer="unsure"')<html.indexOf('data-trail-answer="photo"'),'saved choice order retained');state.sourceTrail.current=99;const before=copy(state);eq(chooseTrailAnswer(state,'photo'),false);eq(checkTrail(state),null);eq(setTrailPage(state,'try'),false);eq(state,before,'missing visit refuses every edit until explicit resume/start');
}
{
 const state={};startTrail(state,'origin');setTrailPage(state,'cards');const html=sourceTrailPage(state);ok(/data-trail-card-content="note"[\s\S]*?<dt>Note creator<\/dt><dd>Original game teaching material<\/dd>/.test(html),'note creator does not miscredit underlying photo');ok(html.includes('<dt>Underlying source creator</dt><dd>Identité judiciaire</dd>'));ok(html.includes('<dt>Underlying source creator</dt><dd>Archives de Paris</dd>'));
}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('workshopPage(state,slug)'));ok(!app.includes("from './source-trail"));ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('source-trail.css'));ok(travelersArchivePage(s).includes('href="#workshop/sources"'));
console.log(`Source Trail integration: ${n} assertions passed.`);
