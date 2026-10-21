import assert from 'node:assert/strict';
import {freshState,recommendations,STORAGE_KEY} from '../dist/core.mjs';
import {puppets,settings,actions,props,invitations,audienceQuestions,sceneCaption} from '../dist/loft-content.mjs';
import {validScene,validShow,validLoft,loftState,startShow,chooseScene,setScenePart,moveScene,performShow,stepShow,meetAudience,spotlightScene,nextAudienceQuestion,chooseAudienceQuestion,reviseShow,reopenShow,noteLoftAudio} from '../dist/loft-core.mjs';
import {sceneArt} from '../dist/loft-art.mjs';
import {loftPage,loftNotes} from '../dist/loft-ui.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {prepareProgressImport,initializeExplorerState} from '../dist/progress-transfer.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {nextGuest} from '../dist/cafe-core.mjs';
import {startVisit} from '../dist/garden-core.mjs';
import {startAdaptiveSpiral} from '../dist/living-adaptive-core.mjs';
let checks=0;const check=(x,m)=>{assert.ok(x,m);checks++;},equal=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const snapshot=x=>JSON.stringify(x),copy=structuredClone;
function finish(s){check(performShow(s),'perform');check(!meetAudience(s),'cannot finish at scene 1');check(!stepShow(s,-1),'cannot step before scene 1');check(stepShow(s,1)&&stepShow(s,1),'next scenes');check(!stepShow(s,1),'cannot step beyond scene 3');check(meetAudience(s),'meet audience');}
{
 const s=freshState(),before=snapshot(s);check(loftPage(s).includes('Choose a starting idea'),'open entry');loftNotes(s);loftState(s);equal(snapshot(s),before,'absent rendering and getters are pure');check(!noteLoftAudio(s)&&!performShow(s)&&!chooseScene(s,0),'no action without a show');equal(snapshot(s),before,'failed actions keep state absent');
}
let combinations=0;
for(const actor of puppets)for(const place of settings)for(const action of actions)for(const prop of props){
 const f={actor:actor.id,place:place.id,action:action.id,prop:prop.id},caption=sceneCaption(f);
 check(validScene(f),'all catalog combinations valid');check(caption.includes(actor.name)&&caption.includes(prop.phrase)&&caption.endsWith('.'),'caption names the chosen puppet and prop');
 const art=sceneArt(f);check(art.includes(`aria-label="${caption}"`)&&art.includes(`loft-action-${action.id}`),'scene text equivalent and action match');combinations++;
}
check(!sceneCaption({actor:'unknown'}),'unknown scene never fabricates a caption');
for(const idea of invitations){
 const s=freshState();check(startShow(s,idea.id),'each starter open');const d=loftState(s).draft;check(validShow(d)&&validLoft(s.loft),'valid starter');equal(d.frames,idea.frames.map(f=>({...f,dialogue:''})),'starter pictures exact with empty dialogue');check(d.frames!==idea.frames&&d.frames[0]!==idea.frames[0],'starter detached');
 const before=snapshot(s);loftPage(s);loftNotes(s);equal(snapshot(s),before,'render pure on starter');finish(s);check(s.loft.draft.shared&&s.loft.shelf.length===1,'finished arrangement saved');check(loftPage(s).includes('A question from the front row'),'audience loop');
 for(let i=0;i<3;i++){check(spotlightScene(s,i),'every scene welcome');check(loftPage(s).includes(`You chose scene ${i+1}`),'reflection identifies selected scene, not correctness');}
 for(let i=0;i<audienceQuestions.length;i++){check(chooseAudienceQuestion(s,i),'every question available');check(loftPage(s).includes(audienceQuestions[i].text),'authored audience question');check(nextAudienceQuestion(s),'questions cycle');}
 check(reviseShow(s,1),'revise exact scene');equal(s.loft.draft.selected,1,'correct editor scene');const old=copy(s.loft.shelf[0]);
 const another=puppets.find(p=>p.id!==s.loft.draft.frames[1].actor).id;check(setScenePart(s,'actor',another),'edit after show');check(!s.loft.draft.shared,'edited arrangement no longer labelled performed');equal(s.loft.shelf[0],old,'shelf snapshot is detached');equal(s.loft.draft.changes,1,'one actual edit');check(!setScenePart(s,'actor',another),'identical value not an edit');
 const a=copy(s.loft.draft.frames[1]);check(moveScene(s,-1),'move earlier');equal(s.loft.draft.frames[0],a,'scene moved with all choices');equal(s.loft.draft.selected,0,'selection follows scene');check(!moveScene(s,-1),'earlier bound');check(moveScene(s,1)&&moveScene(s,1)&&!moveScene(s,1),'later bound');
 check(noteLoftAudio(s),'audio request recorded');check(loftNotes(s).includes('Narration requested: yes'),'request explicitly named');
 const beforeInvalid=snapshot(s);for(const [k,v] of [['actor','invented'],['__proto__','x'],['place',{}],['prop','missing']])check(!setScenePart(s,k,v),'invalid editor input');check(!moveScene(s,2)&&!chooseScene(s,-1)&&!spotlightScene(s,1)&&!meetAudience(s),'mode and index gates');equal(snapshot(s),beforeInvalid,'rejected operations leave state exact');
}
{
 const s=freshState();startShow(s,'welcome');setScenePart(s,'actor','dragon');setScenePart(s,'prop','teacup');const first=copy(s.loft.draft);check(startShow(s,'open'),'start another saves unfinished work');equal(s.loft.shelf[0],first,'unfinished show preserved exact');
 const second=copy(s.loft.draft);check(reopenShow(s,first.id),'reopen shelf show');equal(s.loft.draft.frames,first.frames,'restored picture choices');check(s.loft.draft!==s.loft.shelf.find(x=>x.id===first.id),'reopened draft detached');check(s.loft.shelf.some(x=>x.id===second.id),'previous working show kept');
 setScenePart(s,'prop','umbrella');const work=copy(s.loft.draft);check(!reopenShow(s,first.id),'cannot accidentally reopen over same working show');equal(s.loft.draft,work,'unsaved edits not lost to current shelf button');
 for(let i=0;i<30;i++)check(startShow(s,invitations[i%invitations.length].id),'repeatable new shows');check(s.loft.shelf.length===12&&s.loft.nextId===33,'bounded shelf and increasing ids');check(validLoft(s.loft),'valid after many shows');
 const oldest=s.loft.shelf[0].id;check(reopenShow(s,oldest),'oldest can reopen even when shelving current trims it');equal(s.loft.draft.id,oldest,'target copied before shelf trim');
}
{
 const s=initializeExplorerState(freshState());nextGuest(s);startVisit(s,'french',{destination:'bookstall',variant:1});startAdaptiveSpiral(s);const before=copy(s),rec=recommendations(s);
 startShow(s,'picnic');chooseScene(s,1);setScenePart(s,'actor','dragon');finish(s);spotlightScene(s,0);nextAudienceQuestion(s);noteLoftAudio(s);reviseShow(s,0);moveScene(s,1);
 const {loft,...other}=s;equal(other,before,'all other destinations and support remain untouched');equal(recommendations(s),rec,'multiplication suggestions unchanged');
 const restored=prepareProgressImport(snapshot(s));check(restored.ok&&restored.summary.destinations.includes('Story Loft'),'import preview includes theatre');equal(restored.state.loft,s.loft,'import round trip exact');check(destinationNotes(s).includes('picture stories and revision'),'shared notes include theatre');
}
for(const raw of [null,[],7,'<synthetic>',{version:9,unavailable:{draft:'kept'}},{version:1,nextId:2,draft:{id:1},shelf:[]}] ){
 const s={...freshState(),loft:copy(raw)},before=snapshot(s);check(loftState(s)===null,'unknown/invalid extension blocked');check(loftPage(s).includes('earlier theatre notebook is kept'),'visible recovery');loftNotes(s);
 for(const fn of [()=>startShow(s,'welcome'),()=>performShow(s),()=>reopenShow(s,1),()=>noteLoftAudio(s)])check(!fn(),'unsupported edits refused');equal(snapshot(s),before,'invalid payload exact');
 const imported=prepareProgressImport(before);check(imported.ok,'invalid/future theatre remains importable for recovery');equal(imported.state.loft,raw,'unsupported original imported verbatim');
}
class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
{
 const disk=new Storage(),m=new ExplorerStore(disk),s=m.load(),id=m.active.id;startShow(s,'delivery');chooseScene(s,2);setScenePart(s,'actor','kitten');performShow(s);stepShow(s,1);m.save(s);
 const reload=new ExplorerStore(disk);equal(reload.load().loft,s.loft,'paused performance and draft save exactly');const other=m.add({},s);check(!other.loft,'new explorer separate');equal(m.select(id,other).loft,s.loft,'switch returns to exact show');
 m.setPersistence(false,s);check(![...disk.data.keys()].some(k=>k.startsWith(STORAGE_KEY)),'save-off removes theatre storage');equal(m.select(id).loft,s.loft,'working theatre remains in memory');check(!m.clearActive().loft,'active reset clears theatre');
}
console.log(`${checks} Story Loft checks passed across ${combinations} scene combinations.`);
