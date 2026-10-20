import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {ensureGarden,startVisit,currentVisit,entranceById,finishStoryNode} from '../dist/garden-core.mjs';
import {storyEnding,gardenHome} from '../dist/garden-ui.mjs';
import {cafeSupper} from '../dist/cafe-core.mjs';
import {postOfficeView,currentPostOffice,startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startAdaptiveRival,setRivalInput,submitRival,continueRival} from '../dist/post-rival.mjs';
import {frenchLessons} from '../dist/french-content.mjs';
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const controller=app.slice(app.indexOf('// Films play once per explorer:'));
function fixture(state=freshState(),{choosing=false,welcomeSeen=true}={}){
 ensureGarden(state);state.garden.welcomeFilmSeen=welcomeSeen;
 const listeners=new Set(),dialogs=[],exposures=[];let focused=0,saves=0,stopped=0;
 const focus={isConnected:true,focus(){focused++;}},main={focus(){focused++;}};
 const context={state,choosingExplorer:choosing,location:{origin:'https://synthetic.invalid',hash:'#home'},main,
 currentVisit,entranceById,cafeSupper,postOfficeView,currentPostOffice,
 save(){saves++;},stopSpeech(){stopped++;},esc:x=>String(x),exposeStoryFacts:x=>exposures.push(x),
 document:{activeElement:focus,querySelector:()=>dialogs.find(d=>d.open)||null,body:{append:d=>dialogs.push(d)},createElement(){
  const frame={contentWindow:{},remove(){this.removed=true;}},skip={},events={};
  return {open:false,frame,skip,setAttribute(){},querySelector:q=>q==='iframe'?frame:skip,addEventListener:(k,f)=>events[k]=f,
   showModal(){this.open=true;},close(){this.open=false;events.close();},remove(){this.removed=true;}};
 }},window:{addEventListener:(k,f)=>listeners.add(f),removeEventListener:(k,f)=>listeners.delete(f)}};
 vm.createContext(context);vm.runInContext(controller,context);
 return {state,context,dialogs,listeners,exposures,read:code=>vm.runInContext(code,context),get saves(){return saves;},get focused(){return focused;},get stopped(){return stopped;},message(data,origin=context.location.origin,source=dialogs.at(-1).frame.contentWindow){for(const f of [...listeners])f({data,origin,source});}};
}
{
 const picker=fixture(freshState(),{choosing:true,welcomeSeen:false});eq(picker.dialogs.length,0,'chooser does not consume another explorer’s welcome');eq(picker.state.garden.welcomeFilmSeen,false,'welcome remains available');
 const active=fixture(freshState(),{welcomeSeen:false});eq(active.dialogs.length,1,'active explorer gets first-visit film');active.dialogs[0].skip.onclick();
 eq(app.includes("if(destination!=='#notes')playFilm('welcome');"),true,'switching to an explorer offers their own welcome without interrupting notes imports');
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
 eq(f.read('endingFilm()'),'bramble','resolved gate ending');f.context.location.hash='#post/groups';eq(f.read('endingFilm()'),null,'ribbon bench is not a gate ending');f.context.location.hash='#post';f.context.location.hash='#post/choose';eq(f.read('endingFilm()'),null,'sorting hub is not a gate ending');f.context.location.hash='#post';continueRival(f.state);v.postPage='bramble';eq(f.read('endingFilm()'),'bramble','continued gate ending');
 v.postPage='plan';eq(f.read('endingFilm()'),null,'route planning is not gate ending');v.postPage='bramble';v.closed=true;eq(f.read('endingFilm()'),null,'closed work is not a playable gate ending');
}
{
 const f=fixture();f.state.garden.filmsSeen=[];f.state.syntheticDraft={plate:['pretend'],dialogue:'Synthetic puppet line'};
 const before=JSON.stringify(f.state.syntheticDraft),hash=f.context.location.hash;
 eq(f.read('playFilm("paris")'),true,'opens');const d=f.dialogs.at(-1);eq(f.state.garden.filmsSeen.paris,true,'once flag repairs malformed optional map');eq(f.stopped,1,'stops narration');
 eq(f.read('playFilm("cafe")'),false,'does not stack dialogs');
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
}
eq(app.includes('if(endingFilm()===film)playFilm(film)'),true,'queued auto-play rechecks current ending');
for(const file of ['garden-ui.mjs','cafe-ui.mjs','post-office-ui.mjs']){
 const source=fs.readFileSync(new URL(`../dist/${file}`,import.meta.url),'utf8');eq(/href="\.\/(?:storm-intro|paris-film|cafe-film|bramble-film)\.html/.test(source),false,'no destructive same-tab replay');
}
console.log(`${checks} ending-film checks passed.`);
