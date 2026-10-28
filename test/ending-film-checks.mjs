import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {arrivalSkipsWelcome,chooseStoryArrival} from '../dist/story-arrivals-core.mjs';
import {ensureGarden,startVisit,currentVisit,entranceById,finishStoryNode} from '../dist/garden-core.mjs';
import {storyEnding,gardenHome} from '../dist/garden-ui.mjs';
import {cafeSupper} from '../dist/cafe-core.mjs';
import {postOfficeView,currentPostOffice,startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startAdaptiveRival,setRivalInput,submitRival,continueRival,rivalTasks} from '../dist/post-rival.mjs';
import {frenchLessons} from '../dist/french-content.mjs';
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const controller=app.slice(app.indexOf('// Films play once per explorer:'));
function fixture(state=freshState(),{choosing=false,welcomeSeen=true}={}){
 ensureGarden(state);state.garden.welcomeFilmSeen=welcomeSeen;
 const listeners=new Set(),dialogs=[],exposures=[],lifecycle=[];let focused=0,saves=0,stopped=0;
 const focus={isConnected:true,focus(){focused++;}},main={focus(){focused++;}};
 // Map loading has its own source/browser suite; this fixture owns only films.
 const context={loadCurriculumMap(){},state,explorerStore:{active:{id:'synthetic-explorer'}},refreshKeeperVisibility(){},keeperFilmBlocked:()=>dialogs.some(d=>d.open),choosingExplorer:choosing,location:{origin:'https://synthetic.invalid',hash:'#home'},main,
 currentVisit,entranceById,cafeSupper,postOfficeView,currentPostOffice,arrivalSkipsWelcome,
 save(){saves++;},stopBell(reason){lifecycle.push(['bell-stop',reason]);},stopSpeech(){stopped++;lifecycle.push(['speech-stop']);},esc:x=>String(x),exposeStoryFacts:x=>exposures.push(x),
 document:{activeElement:focus,querySelector:()=>dialogs.find(d=>d.open)||null,body:{append:d=>dialogs.push(d)},createElement(){
  lifecycle.push(['film-dialog-created']);
  const frame={contentWindow:{},remove(){this.removed=true;}},skip={},events=new Map();
  return {open:false,frame,skip,setAttribute(){},querySelector:q=>q==='iframe'?frame:skip,addEventListener(k,f,o={}){const list=events.get(k)||[];list.push({fn:f,once:o.once});events.set(k,list);},
   showModal(){this.open=true;},close(){this.open=false;for(const e of [...(events.get('close')||[])]){if(e.once)events.set('close',(events.get('close')||[]).filter(x=>x!==e));e.fn();}},remove(){this.removed=true;}};
 }},window:{addEventListener:(k,f)=>listeners.add(f),removeEventListener:(k,f)=>listeners.delete(f)}};
 vm.createContext(context);vm.runInContext(controller,context);
 return {state,context,dialogs,listeners,exposures,lifecycle,read:code=>vm.runInContext(code,context),get saves(){return saves;},get focused(){return focused;},get stopped(){return stopped;},message(data,origin=context.location.origin,source=dialogs.at(-1).frame.contentWindow){for(const f of [...listeners])f({data,origin,source});}};
}
{
 const picker=fixture(freshState(),{choosing:true,welcomeSeen:false});eq(picker.dialogs.length,0,'chooser does not consume another explorer’s welcome');eq(picker.state.garden.welcomeFilmSeen,false,'welcome remains available');
 const active=fixture(freshState(),{welcomeSeen:false});eq(active.dialogs.length,1,'active explorer gets first-visit film');active.dialogs[0].skip.onclick();
 const switchedWelcome=app.slice(app.indexOf('function useExplorer('),app.indexOf('function useExplorer(')+1800).match(/if\((destination[^\n]+)\)requestAutomaticFilm\('welcome'\);/);
 eq(Boolean(switchedWelcome),true,'extract the actual explorer-switch welcome condition');
 for(const [destination,expected] of [['#notes',false],['#cafe/units',false],['#begin',false],['#arrive',false],['#home',true],['#cafe',true]])eq(vm.runInNewContext(switchedWelcome[1],{destination}),expected,`explorer-switch welcome at ${destination}`);
}
// Completed real routes, including legacy English/French, are eligible only at their ending.
for(const [id,options] of [['paris',undefined],['paris',{destination:'bookstall',variant:1}],['french',{destination:'bookstall',variant:1}],...frenchLessons.map(l=>[l.id,undefined])]){
 const s=freshState();ensureGarden(s);startVisit(s,id,options);let guard=0;
 while(!currentVisit(s).finished&&guard++<20)finishStoryNode(s,true);
 eq(currentVisit(s).finished,true,`${id} fixture completed`);
 const f=fixture(s);for(const hash of ['#storm/play','#storm/end']){f.context.location.hash=hash;eq(f.read('endingFilm()'),'paris',`${id}: ${hash}`);}
 eq(storyEnding(s).includes('data-film-replay="paris"'),true,`${id} replay button`);
 for(const hash of ['#storm','#storm/choose/paris','#home','#paris']){f.context.location.hash=hash;eq(f.read('endingFilm()'),null,'past completion does not trigger on unrelated pages');}
}
{
 const f=fixture();startVisit(f.state,'paris');f.context.location.hash='#storm/play';eq(f.read('endingFilm()'),null,'unfinished visit');
 f.context.location.hash='#cafe';f.state.cafe={served:6,supper:{round:1,startedAtServed:0}};eq(f.read('endingFilm()'),'cafe','first supper');f.context.location.hash='#cafe/groups';eq(f.read('endingFilm()'),null,'serving bench is not a supper ending');f.context.location.hash='#cafe';
 f.state.cafe.served=5;eq(f.read('endingFilm()'),null,'incomplete supper');f.state.cafe.served=12;f.state.cafe.supper={round:2,startedAtServed:6};eq(f.read('endingFilm()'),null,'new game plus');
 f.context.location.hash='#post';const v=startPostOffice(f.state,deliveries[0].id);startAdaptiveRival(f.state);v.postPage='bramble';
 eq(f.read('endingFilm()'),null,'unfinished challenge');setRivalInput(f.state,String(v.rival.task.answer));submitRival(f.state);
 eq(f.read('endingFilm()'),'bramble','resolved gate ending');f.context.location.hash='#post/groups';eq(f.read('endingFilm()'),null,'ribbon bench is not a gate ending');for(const hash of ['#post/messages','#post/letters','#post/letters/round','#loft/letters']){f.context.location.hash=hash;eq(f.read('endingFilm()'),null,'message work never completes or triggers a gate film');}f.context.location.hash='#post';f.context.location.hash='#post/choose';eq(f.read('endingFilm()'),null,'sorting hub is not a gate ending');f.context.location.hash='#post';continueRival(f.state);v.postPage='bramble';eq(f.read('endingFilm()'),'bramble','continued gate ending');
 v.postPage='plan';eq(f.read('endingFilm()'),null,'route planning is not gate ending');v.postPage='bramble';v.closed=true;eq(f.read('endingFilm()'),null,'closed work is not a playable gate ending');
}
{
 const f=fixture();f.state.garden.filmsSeen=[];f.state.syntheticDraft={plate:['pretend'],dialogue:'Synthetic puppet line'};
 const before=JSON.stringify(f.state.syntheticDraft),hash=f.context.location.hash;
 eq(f.read('playFilm("paris")'),true,'opens');const d=f.dialogs.at(-1);eq(f.state.garden.filmsSeen.paris,true,'once flag repairs malformed optional map');eq(f.stopped,1,'stops narration');eq(f.lifecycle,[['bell-stop','film'],['speech-stop'],['film-dialog-created']],'stops Bell playback before narration and film-frame construction');
 eq(f.read('playFilm("cafe")'),false,'does not stack dialogs');eq(f.lifecycle.length,3,'rejected stacked film does not disturb playback lifecycle');
 f.message('garden-film-finished','https://other.invalid');f.message('garden-film-finished',undefined,{});eq(d.open,true,'untrusted messages ignored');
 d.skip.onclick();eq(d.removed&&d.frame.removed,true,'skip removes iframe and dialog');eq(f.listeners.size,0,'skip removes listener');eq(f.focused,1,'focus restored');
 eq(f.read('playFilm("paris")'),false,'automatic once');eq(f.read('playFilm("paris",{replay:true})'),true,'replay always offered');f.message('garden-film-finished');eq(f.listeners.size,0,'completion cleans up');
 eq(JSON.stringify(f.state.syntheticDraft),before,'memory-only draft remains exact');eq(f.context.location.hash,hash,'replay does not navigate app');
 eq(f.read('playFilm("missing",{replay:true})'),false,'unknown film rejected');
 eq(gardenHome(f.state,false).includes('data-film-replay="welcome"'),true,'save-off home uses modal replay');
}
{
 const f=fixture();f.read('playFilm("bramble")');f.dialogs.at(-1).skip.onclick();eq(f.exposures.length,0,'skip before example is neutral');
 f.read('playFilm("bramble",{replay:true})');f.message('garden-film-example','https://other.invalid');f.message('garden-film-example',undefined,{});eq(f.exposures.length,0,'untrusted example ignored');
 f.message('garden-film-example');f.message('garden-film-example');eq(JSON.stringify(f.exposures),JSON.stringify([{facts:[[3,4]]}]),'one fixed example exposure, never a solved task');
 f.dialogs.at(-1).close();eq(f.listeners.size,0,'native close/Escape cleanup');
 f.read('playFilm("paris",{replay:true})');f.message('garden-film-example');eq(f.exposures.length,1,'other films cannot add fact exposure');
 eq(rivalTasks.some(t=>t.kind==='multiply'&&t.a===3&&t.b===4)&&/different puzzle/.test(f.read('FILMS.bramble.note')),false,'the film note cannot call a 3×4 Bramble puzzle different');
}

// The owner captured by a film prevents late examples from reaching another explorer.
{
 const f=fixture();f.read('playFilm("bramble")');f.context.explorerStore.active.id='other-explorer';f.message('garden-film-example');eq(f.exposures.length,0,'late film example cannot write to another explorer');f.dialogs.at(-1).close();
}
// If the storm film was pending, the earned café film follows its close before the page invitation.
{
 const f=fixture(freshState(),{welcomeSeen:false});f.context.location.hash='#cafe';f.state.cafe={served:6,supper:{round:1,startedAtServed:0}};f.read('requestAutomaticFilm("cafe")');f.dialogs[0].skip.onclick();eq(f.dialogs.length,2,'earned supper film follows welcome close');eq(f.dialogs[1].open,true,'supper film is open');eq(f.state.garden.filmsSeen.cafe,true,'supper once flag belongs to this explorer');f.dialogs[1].close();
}
// Closing another route/owner's film cannot focus or expose examples there.
{
 const f=fixture();f.read('playFilm("bramble")');f.context.location.hash='#arrive';f.message('garden-film-example');eq(f.exposures.length,0,'late example cannot write after route departure');f.dialogs.at(-1).close();eq(f.focused,0,'departed film cannot steal current-route focus');
 const other=fixture();other.read('playFilm("welcome",{replay:true})');other.context.explorerStore.active.id='synthetic-other';other.dialogs.at(-1).close();eq(other.focused,0,'departed film cannot focus a different owner');
}
{
 const s=freshState();eq(chooseStoryArrival(s,'letter'),true,'explicit later context fixture');const f=fixture(s,{welcomeSeen:false});eq(f.dialogs.length,0,'later arrival suppresses automatic welcome without faking seen');eq(f.state.garden.welcomeFilmSeen,false,'historical intro remains unviewed');eq(f.read('playFilm("welcome",{replay:true})'),true,'explicit historical replay remains available');f.dialogs.at(-1).close();
 const pure=fixture();delete pure.state.garden;eq(pure.read('playFilm("welcome",{replay:true})'),true,'explicit recap film works from an independent legacy route without garden initialization');eq(pure.state.garden.welcomeFilmSeen,true,'only actual opened presentation records seen');pure.dialogs.at(-1).close();
}
eq(app.includes('if(endingFilm()===film)requestAutomaticFilm(film)'),true,'queued auto-play rechecks current ending');
for(const file of ['garden-ui.mjs','cafe-ui.mjs','post-office-ui.mjs']){
 const source=fs.readFileSync(new URL(`../dist/${file}`,import.meta.url),'utf8');eq(/href="\.\/(?:storm-intro|paris-film|cafe-film|bramble-film)\.html/.test(source),false,'no destructive same-tab replay');
}
console.log(`${checks} ending-film checks passed.`);
