import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {homeContinuations,homeWelcome,homeEntryPage} from '../dist/home-entry.mjs';
import {gardenHome} from '../dist/garden-ui.mjs';
import {startVisit} from '../dist/garden-core.mjs';
import {nextGuest} from '../dist/cafe-core.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {invitations} from '../dist/loft-content.mjs';
import {startLinear,setLinearField,showLinearHelp} from '../dist/linear-pathway-core.mjs';
import {linearLessons} from '../dist/linear-pathway-content.mjs';
import {startMotion} from '../dist/motion-evidence-core.mjs';
import {motionLessons} from '../dist/motion-evidence-content.mjs';
import {startFrenchRooms} from '../dist/french-rooms-core.mjs';
import {frenchRoomsLessons} from '../dist/french-rooms-content.mjs';
import {startEvidenceVoice} from '../dist/evidence-voice-core.mjs';
import {rememberPathway} from '../dist/pathway-entry-core.mjs';
import {pathwaySubjects} from '../dist/pathway-entry-content.mjs';
import {chooseStoryArrival} from '../dist/story-arrivals-core.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const freeze=x=>{if(x&&typeof x==='object'){Object.freeze(x);for(const v of Object.values(x))freeze(v);}return x;};
const options={canExport:()=>true};
const book=freshState();book.futureSibling={version:99,data:['unchanged']};
eq(homeContinuations(freeze(structuredClone(book))),[],'missing roots do not invent a current activity');
const joined={};
for(const choice of ['storm','mended','letter']){const s=freshState();ok(chooseStoryArrival(s,choice),'explicit arrival fixture');joined[choice]=s;const before=JSON.stringify(s),welcome=homeWelcome(freeze(s));ok(welcome.title.length>0,'finite welcome');eq(JSON.stringify(s),before,'arrival welcome is pure');}
eq(homeWelcome(joined.storm).title,'The storm has passed.','storm story introduction');
eq(homeWelcome(joined.mended).body,'The first repairs happened before you arrived. There are new ideas to try together.','later repairs are inherited');
eq(homeWelcome(joined.letter).title,'A town full of possibilities.','letter arrival gets later welcome');
const progress=structuredClone(joined.storm);progress.story.seenScenes=['parcel-found'];eq(homeWelcome(progress).title,'Welcome to Willowbank.','actual progress avoids first-day framing');
for(const story of [{version:99,secret:'retained'},[],null]){const s={...freshState(),story};eq(homeWelcome(s).title,'Welcome to Willowbank.','unsupported story welcome stays neutral');}
startVisit(book,'creature');nextGuest(book);startPostOffice(book,deliveries[0].id);startShow(book,invitations[0].id);setSceneDialogue(book,'Synthetic puppet dialogue stays in the show.');
for(const [start,source] of [[startLinear,linearLessons[0]],[startMotion,motionLessons[0]],[startFrenchRooms,frenchRoomsLessons[0]]])ok(start(book,source.id,options),'current subject fixture');
ok(startEvidenceVoice(book,'clock-river',options).ok,'English current work fixture');
const item=linearLessons[0].items[0];setLinearField(book,item.id,item.fields[0].id,'-2',options);showLinearHelp(book,item.id,'hint',options);
const before=JSON.stringify(book),links=homeContinuations(freeze(structuredClone(book)));
eq(links.map(l=>l.route),['#storm/play','#cafe','#post','#loft','#learn/math','#learn/english','#learn/science','#learn/french'],'all current work resumes through existing current-owner destinations');
eq(JSON.stringify(book),before,'whole mixed book retained');
for(const subject of pathwaySubjects){const s=freshState();ok(rememberPathway(s,subject.id,subject.goals.at(-1).id,options),'explicit subject goal');const frozen=freeze(s),entries=homeContinuations(frozen);eq(entries.map(x=>x.route),[subject.goals.at(-1).route],'subject choice remains independent '+subject.id);}
const both=structuredClone(book);rememberPathway(both,'math',pathwaySubjects[0].goals[0].id,options);eq(homeContinuations(both).filter(r=>r.id==='math').map(r=>r.route),['#learn/math'],'current work takes its subject slot over remembered starting point');
const finished=structuredClone(book);finished.garden.visits.find(v=>v.id===finished.garden.current).finished=true;eq(homeContinuations(finished)[0].route,'#storm/end','finished visit goes to its ending');finished.garden.visits[0].closed=true;ok(!homeContinuations(finished).some(x=>x.id==='garden'),'closed visit not offered as editable');
for(const stage of ['plate','total','stock']){const s=structuredClone(book);s.cafe.current.stage=stage;ok(homeContinuations(s).some(x=>x.id==='cafe'),'waiting plate/question retained '+stage);}
const served=structuredClone(book);served.cafe.current.served=true;served.cafe.current.stage='served';ok(!homeContinuations(served).some(x=>x.id==='cafe'),'served order does not masquerade as waiting');
const malformed={...freshState(),garden:{current:'x',visits:[null,'bad',{id:'x',closed:true}]},postOffice:{version:99,current:'x',visits:[{id:'x'}]},cafe:{version:99,current:{stage:'plate'}},loft:{version:99},linearPathway:{version:99},evidenceVoice:[],motionEvidence:null,frenchRooms:{version:99},learningRoutes:{version:99},futureSibling:{payload:'retained'}};
const badBefore=JSON.stringify(malformed);eq(homeContinuations(freeze(malformed)),[],'unavailable entries neither block nor invent continuations');eq(JSON.stringify(malformed),badBefore,'unavailable payloads exact');
const mixed=structuredClone(book);mixed.linearPathway={version:99,privateDraft:'not on Home'};eq(homeContinuations(mixed).filter(x=>['english','science','french'].includes(x.id)).length,3,'one unavailable subject does not hide healthy ones');
const injected=structuredClone(book);injected.learningRoutes={version:1,subjects:{math:{goal:{id:'test',title:'<script>not rendered</script>',purpose:'synthetic',route:'javascript:alert(1)'}}}};delete injected.linearPathway;ok(!homeContinuations(injected).some(x=>x.id==='math'),'unsafe saved route excluded');
for(const s of [freshState(),book,joined.mended,joined.letter,malformed]){
 const before=JSON.stringify(s),html=gardenHome(freeze(structuredClone(s)),false,'','synthetic-owner');eq(JSON.stringify(s),before,'render does not mutate source');
 for(const route of ['#cafe','#loft','#post','#workshop','#living','#numbers','#facts','#words','#paris','#french','#science','#orchard/games','#desk','#town','#riddles','#archive','#studio/bells','#studio/rhythm','#explore','#storm','#pathways','#begin','#arrive','#companions','#notes'])ok(html.includes(`href="${route}"`),'retained actual destination '+route);
 ok(html.includes('data-film-replay="welcome"'),'optional welcome replay retained');ok(!html.includes('First Morning in the Learning Garden'),'no unconditional first-day label');
 for(const match of html.matchAll(/src="\.\/(icons\/[^\"]+)"/g))ok(existsSync(new URL('../dist/'+match[1],import.meta.url)),'existing icon asset '+match[1]);
}
ok(homeEntryPage(joined.letter,true).includes('Read your arrival recap again'),'chosen arrival retains its explicit recap link');
const freshHtml=homeEntryPage(freshState(),true);ok(freshHtml.indexOf('data-home-choice="town"')<freshHtml.indexOf('data-home-panel='),'three primary controls precede all panel content');
const index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');eq(index.split('href="./home-entry.css"').length,2,'one permanent Home stylesheet');
console.log(`${checks} Home entry derivation, preservation, safe navigation and copy checks passed.`);
