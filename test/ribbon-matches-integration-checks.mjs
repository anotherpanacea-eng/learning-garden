import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import * as old from '../dist/fraction-trail-core.mjs';
import {renderFractionTrail} from '../dist/fraction-trail-ui.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {startAdaptiveRival,setRivalInput} from '../dist/post-rival.mjs';
import {startClock,stepClock,checkClock} from '../dist/preparation-clock-core.mjs';
import {startTrail,chooseTrailAnswer,checkTrail} from '../dist/source-trail-core.mjs';
import {startAdaptiveSpiral,inspectAdaptive,adaptiveSuggestion} from '../dist/living-adaptive-core.mjs';
import {matchView,startMatch,resumeMatch,setMatchPage,startMatchFlag,moveMatchFlag,chooseMatchProposal,chooseMatchNumerator,addMatchSupport,checkMatch,matchCheckMatches} from '../dist/ribbon-matches-core.mjs';
import {ribbonMatchesPage,ribbonMatchesNotes} from '../dist/ribbon-matches-ui.mjs';
import {ribbonMatchesDiagram} from '../dist/ribbon-matches-art.mjs';
import {ribbonMatchCases} from '../dist/ribbon-matches-content.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());old.chooseTrailCase(s,'same-half');old.prepareTrailPartition(s,4);old.startTrailFlag(s);old.moveTrailFlag(s,1);old.moveTrailFlag(s,1);old.setTrailReading(s,' 2/4 ');old.checkTrail(s,'reading');old.keepTrail(s);old.setTrailPage(s,'keep');ok(s.fractionTrail.cases['same-half'].kept);ok(startPostOffice(s,'clover-buns'));ok(startAdaptiveRival(s));setRivalInput(s,'17');startClock(s,'maps');stepClock(s,1);checkClock(s);startTrail(s,'origin');chooseTrailAnswer(s,'photo');checkTrail(s);startAdaptiveSpiral(s);inspectAdaptive(s,0);s.exposures=['3x4'];const before=copy(s),suggestions=['science','reading','math'].map(k=>adaptiveSuggestion(s,k));
const r=startMatch(s,'third-sixths');startMatchFlag(s);moveMatchFlag(s,1);moveMatchFlag(s,1);chooseMatchNumerator(s,2);ok(checkMatch(s).fulfilled);addMatchSupport(s,'together');checkMatch(s);const other=copy(s);delete other.ribbonMatches;eq(other,before,'actual oldcut/flag/rawreading/check/kept plusclock/sources/Post/Bramble andeveryolderroot untouched');eq(['science','reading','math'].map(k=>adaptiveSuggestion(s,k)),suggestions);
for(const page of ['make','name','kept']){setMatchPage(s,page);const exact=copy(s);ok(workshopPage(s,'fractions').includes('ribbon-match-page'));ribbonMatchesPage(s);ribbonMatchesNotes(s);workshopNotes(s);destinationNotes(s);eq(s,exact,'all pages/notes pure');}
const frozen=copy(s.ribbonMatches),raw=JSON.stringify(s);eq(restoreStateResult(raw).state.ribbonMatches,frozen);const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.ribbonMatches,frozen);store.save(s);const first=store.active.id,otherExplorer=store.add({avatar:'fern',color:'rose',symbol:'shell'},s);startMatch(otherExplorer,'sixths-third');store.save(otherExplorer);eq(store.select(first,otherExplorer).ribbonMatches,frozen);eq(initializeExplorerState(new ExplorerStore(disk).load()).ribbonMatches,frozen);
for(const payload of [null,'<script>not executable</script>',{version:77,raw:'<img src=x onerror="bad()">'}]){const state=initializeExplorerState(freshState());state.ribbonMatches=copy(payload);const exact=copy(state),html=ribbonMatchesPage(state)+ribbonMatchesNotes(state);eq(state,exact);ok(!html.includes('<script>not')&&!html.includes('<img src=x'));ok(prepareProgressImport(JSON.stringify(state)).ok);}
{
 const state={};ribbonMatchesPage(state);ribbonMatchesNotes(state);eq(state,{});const visit=startMatch(state,'half-quarters');visit.source.drawingVersion=99;visit.source.referencePictureText='Earlier reference <as text>';startMatchFlag(state);moveMatchFlag(state,1);setMatchPage(state,'name');const html=ribbonMatchesPage(state);ok(html.includes('Earlier reference &lt;as text&gt;'));ok(!html.includes('<svg'));ok(html.includes('Supplied working-position label'));eq(prepareProgressImport(JSON.stringify({...freshState(),...state})).state.ribbonMatches,state.ribbonMatches);
}
{
 const state={},visit=startMatch(state,'third-sixths');startMatchFlag(state);moveMatchFlag(state,1);chooseMatchNumerator(state,1);const c=checkMatch(state);eq([c.amountMatch,c.namingMatch],[false,true]);c.amountMatch=true;c.namingMatch=null;c.fulfilled=true;c.workingLabel='Earlier recorded label';c.referencePictureText='Earlier recorded reference';c.feedback='Earlier contradictory result';visit.source.title='Later source words';const exact=copy(state),html=ribbonMatchesPage(state)+ribbonMatchesNotes(state);ok(html.includes('Earlier contradictory result'));ok(html.includes('Earlier recorded label'));ok(html.includes('Earlier recorded reference'));eq(state,exact);ok(!matchCheckMatches(visit));checkMatch(state);ok(ribbonMatchesPage(state).includes('Earlier recorded check'));ok(ribbonMatchesPage(state).includes('Latest check of these choices'));
}
{
 const state={},visit=startMatch(state,'half-quarters');state.ribbonMatches.rounds.push({id:2,raw:'<b>older</b>'});state.ribbonMatches.current=2;const raw=copy(state.ribbonMatches.rounds[1]),before=copy(state);eq(matchView(state).current,null);eq(startMatchFlag(state),false);eq(checkMatch(state),null);eq(setMatchPage(state,'name'),false);eq(state,before);ok(resumeMatch(state,visit.id));startMatchFlag(state);eq(matchView(state).earlier,[raw]);ok(ribbonMatchesPage(state).includes('&lt;b&gt;'));const duplicate=copy(visit);state.ribbonMatches.rounds.push(duplicate);eq(matchView(state).earlier,[raw,duplicate]);
}
{
 const state={},r=startMatch(state,'half-quarters');state.ribbonMatches.rounds=Array.from({length:15},(_,i)=>({...copy(r),id:i+1}));state.ribbonMatches.current=15;state.ribbonMatches.nextId=16;state.ribbonMatches.rounds.push({id:80,raw:'kept unknown'});const exact=copy(state),html=ribbonMatchesPage(state);eq(state,exact);ok(html.includes('oldest 4 readable visits'));startMatch(state,'third-sixths');eq(matchView(state).rounds.length,12);eq(matchView(state).rounds[0].id,5);eq(state.ribbonMatches.current,81);eq(matchView(state).earlier,[{id:80,raw:'kept unknown'}]);
}
{
 const offDisk=new Storage();offDisk.setItem('number-garden-save','off');const off=new ExplorerStore(offDisk),state=initializeExplorerState(off.load());startMatch(state,'half-quarters');startMatchFlag(state);off.save(state);eq(offDisk.getItem(`${STORAGE_KEY}:${off.active.id}`),null);eq(off.load().ribbonMatches,state.ribbonMatches);
}
for(const source of ribbonMatchCases)for(const index of [null,...Array.from({length:source.workingDenominator+1},(_,i)=>i)]){const art=ribbonMatchesDiagram(source,index),rows=[...art.matchAll(/data-whole-left="([^"]+)" data-whole-width="([^"]+)" data-whole-height="([^"]+)"/g)].map(m=>m.slice(1));eq(rows,[['24','312','34'],['24','312','34']],'sharedexactunitgeometry');eq((art.match(/data-ribbon-match-endpoint=/g)||[]).length,index===null?1:2,'absentflagnotdrawn');const cuts=[...art.matchAll(/<g class="ribbon-match-cuts">([\s\S]*?)<\/g>/g)].map(m=>[...m[1].matchAll(/x1="([^"]+)"/g)].map(v=>Number(v[1])));eq(cuts,[source.referenceDenominator,source.workingDenominator].map(d=>Array.from({length:d-1},(_,i)=>24+(12/d)*(i+1)*26)),'actualcutlinesagreewith12tickintervaloracle');}
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes('workshopPage(state,slug)'));ok(!app.includes("from './ribbon-matches"));ok(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('ribbon-matches.css'));ok(renderFractionTrail(s).html.includes('href="#workshop/fractions"'));
console.log(`Ribbon Matches integration: ${n} assertions passed.`);
