import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {frenchStoryData} from '../dist/french-story-data.mjs';
import {frenchStories,frenchPlaces,frenchLibraryNodes} from '../dist/french-library.mjs';
import {frenchPlan,validateFrenchRoute} from '../dist/french-core.mjs';
import {parisVisitStatus} from '../dist/paris-visit-source.mjs';
import {parisPlan} from '../dist/paris-core.mjs';
import {ensureGarden,startVisit,storyDraft,currentVisit,noteStorySeen,submitStory,submitStoryOrder,editStoryOrder,finishStoryNode,useStoryReadingTool,storyDescribe} from '../dist/garden-core.mjs';
import {frenchLanding,storyPage,gardenNotes,storyHub} from '../dist/garden-ui.mjs';
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
const json=JSON.stringify,fresh=()=>{const s=freshState();ensureGarden(s);return s;};
function answer(s,mutate=()=>{}){
 const d=storyDraft(s),n=storyNodes[currentVisit(s).node];noteStorySeen(s);d.method='worked';d.reading='independent';mutate(d,n);
 if(n.kind==='order'){for(const i of [0,1,2])editStoryOrder(s,'add',i);submitStoryOrder(s);}else submitStory(s,n.answer);
 return finishStoryNode(s);
}
function visit(s,story,variant,mutate=()=>{}){
 startVisit(s,'french',{destination:story.destination,storyId:story.id,variant});const o=answer(s,mutate);
 finishStoryNode(s,true);finishStoryNode(s);return o;
}
check(frenchStories.length===9&&new Set(frenchStories.map(s=>s.id)).size===9,'nine distinct new stories');
for(const place of frenchPlaces)check(frenchStories.filter(s=>s.destination===place.id).length===3,'three stories per destination');
for(const data of frenchStoryData)for(const v of [1,2,3]){
 const s=fresh(),p=frenchPlan(s,data.destination,v,data.id);startVisit(s,'french',{destination:data.destination,variant:v,storyId:data.id});
 check(validateFrenchRoute(currentVisit(s))&&json(currentVisit(s).route)===json(p.route),'exact frozen authored route');
 check(data.meanings[v]&&data.passages[v].every(x=>typeof x==='string'&&x.trim())&&data.passages[v].length>=4,'authored full passage and matching translation');
 for(let i=0;i<2;i++){
  const d=storyDraft(s),n=storyNodes[currentVisit(s).node];
  check(n.language==='fr'&&n.frenchVariant===v&&n.frenchStory===data.id&&n.practiceOnly,'task provenance');
  check(storyPage(s,d).includes('data-speak-lang="fr"')&&n.hint.includes(data.meanings[v]),'French audio and exact variant meaning');
  const o=answer(s);check(o.correct&&o.language==='fr'&&o.frenchStory===data.id&&!o.freshEvidence,'authored answer completes as practice');
  check(i===0?o.priorStorySeen===false:o.priorPassageSeen===true,'second question is rereading');
 }
 check(finishStoryNode(s).status==='invitation'&&currentVisit(s).finished,'two questions plus unscored ending');
 const restored=restoreState(json(s));ensureGarden(restored);check(currentVisit(restored).finished&&restored.garden.observations.length===3,'completed routes restore once');
}
{
 const s=fresh(),before=json(s),p=frenchPlan(s,'bookstall');
 check(p.variant===1&&json(s)===before&&json(p)===json(frenchPlan(s,'bookstall')),'planning is stable and does not mark stories seen');
 startVisit(s,'french',{destination:'bookstall'});storyDraft(s);noteStorySeen(s);
 check(frenchPlan(s,'bookstall').storyId!==p.storyId,'displaying an unfinished story invites another story');
 const frozen=json(currentVisit(s).route);visit(s,frenchStories[3],3);
 check(json(s.garden.visits[0].route)===frozen,'other selections cannot change paused route');
 check(frenchLanding(s).includes('data-resume-visit="visit-1"'),'unfinished story exposed on French hub');
 check(storyHub(s,'french',{destination:'rooftops',variant:2,storyId:frenchStories[6].id}).includes('data-new-visit="french"')===false,'no confirmation is needed when current visit ended');
}
{
 const s=fresh(),english=json(parisPlan(s,'bookstall'));
 visit(s,frenchStories[0],1);check(frenchPlan(s,'river').variant===1,'one new story is sparse evidence');
 visit(s,frenchStories[3],1);check(frenchPlan(s,'rooftops').variant===2,'two independent first questions on new stories suggest more French across places');
 visit(s,frenchStories[1],2);visit(s,frenchStories[4],2);check(frenchPlan(s,'rooftops').variant===3,'two further new stories at current variant suggest paragraph');
 const o=visit(s,frenchStories[6],3,d=>{d.hinted=true;});check(o.supported&&frenchPlan(s,'river').variant===2,'meaning support suggests one smaller step');
 check(json(parisPlan(s,'bookstall'))===english,'French observations cannot affect English suggestions');
 const r=restoreState(json(s));ensureGarden(r);check(frenchPlan(r,'river').variant===2,'suggestion survives reload');
 check(gardenNotes(r).includes('French story:')&&gardenNotes(r).includes('Suggestion:'),'provenance and selection reason visible in notes');
}
for(const kind of ['hint','reveal','audio','sentence','helper','together','retry','meaning']){
 const s=fresh();startVisit(s,'french',{destination:'bookstall',variant:3});
 const apply=d=>{if(kind==='hint')d.hinted=true;if(kind==='reveal')d.revealed=true;if(kind==='audio')useStoryReadingTool(s,'audio');if(kind==='sentence')useStoryReadingTool(s,'sentence-next');if(kind==='helper')d.helpUsed=true;if(kind==='together')d.reading='together';if(kind==='retry')submitStory(s,(storyNodes[currentVisit(s).node].answer+1)%3);if(kind==='meaning')d.meaningUsed=true;};
 answer(s,apply);answer(s);finishStoryNode(s);
 check(frenchPlan(s,'river').variant===2,`${kind} remains a barrier after the second question`);
}
{
 const s=fresh();startVisit(s,'french',{destination:'bookstall',variant:2});answer(s,d=>{d.hinted=true;});
 let r=restoreState(json(s));ensureGarden(r);const d=storyDraft(r);
 check(d.meaningUsed&&!d.hinted,'earlier translation carries without automatically reopening hint');
 const o=answer(r);check(o.supported&&!o.independent&&storyDescribe(o)==='Found an answer with support','inherited translation records support');
}
{
 const s=fresh();visit(s,frenchStories[0],1);visit(s,frenchStories[0],2);visit(s,frenchStories[3],2);
 check(frenchPlan(s,'rooftops').variant===2,'other variants of a familiar story cannot manufacture a new story');
 s.garden.observations.push(...JSON.parse(json(s.garden.observations)));
 check(frenchPlan(s,'rooftops').variant===2,'duplicating observations cannot create distinct new stories');
}
{
 const s=fresh();visit(s,frenchStories[0],2, d=>{d.reading='unobserved';});
 check(frenchPlan(s,'river').variant===1,'unobserved reading does not change the default');
 startVisit(s,'french',{destination:'river',variant:3});finishStoryNode(s,true);finishStoryNode(s,true);finishStoryNode(s);
 check(frenchPlan(s,'bookstall').variant===1,'skips do not change suggestions');
}
{
 const s=fresh();visit(s,frenchStories[0],1);visit(s,frenchStories[3],1);
 for(const v of s.garden.visits)delete v.french.priorStorySeen;
 check(frenchPlan(s,'rooftops').variant===1,'missing exposure provenance cannot credit advancement');
}
for(const mutate of [v=>v.french=null,v=>v.french=false,v=>delete v.french,v=>v.route.reverse(),v=>v.route=['paris-note','paris-reread','paris-postcard'],v=>v.french.variant=99,v=>v.paris={destination:'bookstall'},v=>v.recorded=['french-postcard']]){
 const s=fresh();startVisit(s,'french',{destination:'bookstall'});answer(s);mutate(s.garden.visits[0]);
 const r=restoreState(json(s));ensureGarden(r);check(r.garden.visits.length===1&&r.garden.observations.length===1&&parisVisitStatus(r.garden.visits[0])==='recovery'&&frenchPlan(r,'river').variant===1,'invalid French metadata/route stays raw in recovery and cannot inform suggestions');
}
for(const field of ['frenchDestination','frenchStory','frenchVariant','frenchSelectionReason']){
 const s=fresh();startVisit(s,'french',{destination:'bookstall'});answer(s);s.garden.observations[0][field]='forged';
 ensureGarden(s);check(s.garden.observations.length===0,'mismatched French observation provenance rejected');
}
{
 const s=fresh();startVisit(s,'french-bookstall');const original=currentVisit(s).id;storyDraft(s).choice=1;
 let r=restoreState(json(s));ensureGarden(r);check(currentVisit(r).id===original&&storyDraft(r).choice===1,'legacy French visit remains resumable');
 r.garden.visits[0].route=['french-bookstall-1','french-bookstall-2','french-bookstall-postcard'];ensureGarden(r);check(r.garden.visits.length===1&&parisVisitStatus(r.garden.visits[0])==='recovery','stray route cannot turn original French into exploration; raw work remains');
 const e=fresh();startVisit(e,'paris',{destination:'bookstall'});answer(e);const prior=json(e.garden.visits[0]);
 startVisit(e,'french',{destination:'river'});check(json(e.garden.visits[0])===prior&&validateFrenchRoute(currentVisit(e)),'English and French paused routes coexist');
 check(!startVisit(e,'french',null)&&!startVisit(e,'french',{destination:'unknown'})&&!frenchPlan(e,'river',4),'invalid plan requests rejected');
}
console.log(`${checks} French exploration, adaptation, content and restore checks passed.`);
