import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {ensureCafe,nextGuest,orderFor,adjustBite,checkPlate,reviseCafePlate,submitCafeNumber,supportCafe,skipCafeStage} from '../dist/cafe-core.mjs';
import {renderCafe} from '../dist/cafe-ui.mjs';
import {frenchLessons} from '../dist/french-content.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {helpers} from '../dist/help-content.mjs';
import {ensureGarden,startVisit,currentVisit,storyDraft,noteStorySeen,submitStory,finishStoryNode,useStoryReadingTool,openStoryHelp,storyDescribe} from '../dist/garden-core.mjs';
import {parisPlan} from '../dist/paris-core.mjs';
import {frenchLanding,storyPage,gardenNotes} from '../dist/garden-ui.mjs';
import {localVoices,localEnglishVoices,chooseLocalVoice,hearButton} from '../dist/play-media.mjs';
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
const json=JSON.stringify;
{
 let s=freshState();ensureCafe(s);s.cafe.seed=192;s.cafe.range='small';nextGuest(s);
 check(!reviseCafePlate(s),'cannot revise before multiplication');
 const o=orderFor(s.cafe),food=ingredients.find(a=>o.wanted.every(p=>a.properties.includes(p)));
 for(let i=0;i<o.bites;i++)adjustBite(s,food.id,1);
 check(checkPlate(s),'accepted plate reaches multiplication');
 submitCafeNumber(s,o.total+1);supportCafe(s);s.cafe.current.total.input='17';s.cafe.current.total.steps=1;
 const identity=json(orderFor(s.cafe)),total=json(s.cafe.current.total),stock=json(s.cafe.stock),next=s.cafe.nextOrder;
 for(let i=0;i<3;i++){
  check(renderCafe(s).includes('data-cafe-action="revise-plate"'),'multiplication has revision control');
  check(reviseCafePlate(s)&&s.cafe.current.stage==='plate','return to editor');
  check(!submitCafeNumber(s,o.total),'must validate revised plate before multiplication');
  check(adjustBite(s,food.id,-1),'accepted plate becomes editable');
  s=restoreState(json(s));ensureCafe(s);
  check(s.cafe.current.stage==='plate'&&json(s.cafe.current.total)===total,'edited plate and arithmetic survive reload');
  check(!checkPlate(s),'invalid revised plate does not advance');
  adjustBite(s,food.id,1);check(checkPlate(s),'correct revised plate returns to multiplication');
  check(json(orderFor(s.cafe))===identity&&json(s.cafe.stock)===stock&&s.cafe.nextOrder===next,'same guest/order, no supplies spent or new order');
  check(json(s.cafe.current.total)===total&&s.cafe.current.plateAttempts.length===3+2*i,'total input, attempts, support and plate history retained');
 }
 skipCafeStage(s);const closed=json(s.cafe);check(!reviseCafePlate(s)&&json(s.cafe)===closed,'stock stage cannot reopen');
 s.cafe.current.stage='served';s.cafe.current.served=true;check(!reviseCafePlate(s),'served order cannot reopen');
 check(!reviseCafePlate(freshState()),'missing guest cannot reopen');
}
{
 const voices=[{lang:'en-US',localService:true,name:'English',voiceURI:'en'},{lang:'fr-FR',localService:true,name:'French',voiceURI:'fr'},{lang:'fr-CA',localService:false,name:'Remote',voiceURI:'remote'},{lang:'de-DE',localService:true,name:'German'}];
 check(localEnglishVoices(voices).length===1&&localVoices(voices,'fr').length===1,'local language filters');
 check(chooseLocalVoice(voices,'en','fr').voiceURI==='fr','English preference cannot override French');
 check(chooseLocalVoice(voices.filter(v=>v.lang!=='fr-FR'),'','fr')===null,'French never falls back to English or remote voice');
 check(chooseLocalVoice(voices).voiceURI==='en','English API default unchanged');
 check(hearButton('Bonjour','Hear French','fr').includes('data-speak-lang="fr"'),'button carries narration language');
}
check(frenchLessons.length===3,'three authored French errands');
for(const lesson of frenchLessons){
 let s=freshState();ensureGarden(s);const english=json(parisPlan(s,'bookstall'));startVisit(s,lesson.id);
 check(frenchLanding(s).includes(`data-resume-visit="${currentVisit(s).id}"`),'unfinished French visit can resume from French hub');
 for(let i=0;i<2;i++){
  const v=currentVisit(s),n=storyNodes[v.node],d=storyDraft(s);noteStorySeen(s);
  check(n.language==='fr'&&n.practiceOnly&&n.readingText.length===4,'French task with bounded connected text');
  check(n.choices.length===3&&new Set(n.choices).size===3&&n.choices[n.answer],'unique authored choices');
  check(helpers[n.id]&&n.hint.includes(lesson.meaning),'smaller example and aligned English meaning');
  const html=storyPage(s,d);check(html.includes('lang="fr"')&&html.includes('data-speak-lang="fr"')&&html.includes('English meaning & word help'),'French language marks, audio and explicit support action');
  if(i===0){d.hinted=true;useStoryReadingTool(s,'sentence-next');useStoryReadingTool(s,'audio');}
  s=restoreState(json(s));ensureGarden(s);const restored=storyDraft(s);
  if(i===0)check(restored.hinted&&restored.readingTools.sentenceUsed&&restored.readingTools.audioRequested,'meaning and reading support survive reload');
  submitStory(s,n.answer);restored.method='worked';restored.reading='independent';const result=finishStoryNode(s);
  check(result.language==='fr'&&!result.freshEvidence&&result.practiceOnly,'French record explicitly labelled and practice only');
  if(i===0)check(result.supported&&!result.independent,'meaning help cannot become unsupported reading');
  else check(result.priorPassageSeen&&result.supported&&!result.independent&&result.meaningUsed&&storyDescribe(result)==='Found an answer with support','second question retains earlier passage translation support');
 }
 check(finishStoryNode(s).status==='invitation'&&currentVisit(s).finished,'French route reaches own unscored ending');
 check(json(parisPlan(s,'bookstall'))===english,'French work cannot change English suggestions or story selection');
 s.garden.observations.at(-1).language='en';
 s=restoreState(json(s));ensureGarden(s);check(currentVisit(s).finished&&s.garden.observations.every(o=>o.language==='fr'),'completed French routes and language survive export/restore');
 check(gardenNotes(s).includes('English meaning and word help opened.')&&gardenNotes(s).includes('English meaning was opened earlier'),'grown-up notes name translation support');
 const obs=s.garden.observations[0];obs.language='en';obs.supported=false;obs.independent=true;obs.readingTools={audioRequested:false,sentenceUsed:false,focus:null,supportUncertain:false};
 ensureGarden(s);check(obs.language==='fr'&&obs.supported&&!obs.independent,'authored language and explicit support repaired on restore');
 startVisit(s,lesson.id);check(storyDraft(s).familiar&&storyDraft(s).priorPassageSeen,'returning to French lesson records familiarity');
 const d=storyDraft(s);openStoryHelp(s);check(d.helpUsed&&d.helper.open,'existing smaller-example support works');
}
console.log(`French and café revision checks: ${checks} passed`);
