import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {parisDestinations,parisStories,parisLibraryNodes} from '../dist/paris-library.mjs';
import {parisPlan,validateParisRoute} from '../dist/paris-core.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {ensureGarden,startVisit,currentVisit,storyDraft,noteStorySeen,submitStory,finishStoryNode,useStoryReadingTool,resumeVisit} from '../dist/garden-core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const fresh=()=>{const s=freshState();ensureGarden(s);return s;};
const json=x=>JSON.stringify(x);
function begin(s,d='bookstall',v='auto'){const visit=startVisit(s,'paris',{destination:d,variant:v});storyDraft(s);noteStorySeen(s);return visit;}
function answer(s,{reading='independent',retry=false,help=false}={}){const n=storyNodes[currentVisit(s).node],d=storyDraft(s);noteStorySeen(s);if(help)useStoryReadingTool(s,'audio');if(retry)submitStory(s,(n.answer+1)%n.choices.length);submitStory(s,n.answer);d.method='worked';d.reading=reading;return finishStoryNode(s);}
function complete(s,opts={}){const first=answer(s,opts);answer(s);finishStoryNode(s);return first;}
check(parisDestinations.length===3&&parisStories.length===6&&Object.keys(parisLibraryNodes).length===36,'three destinations, six authored stories, three variants and two questions');
for(const destination of parisDestinations){
 const s=fresh(),p=parisPlan(s,destination.id);check(p.variant===2&&p.destination===destination.id&&p.route.length===3&&Object.isFrozen(p)&&Object.isFrozen(p.route),'middle variant and immutable plan');
 for(const variant of [1,2,3]){const v=begin(s,destination.id,variant);check(validateParisRoute(v)&&v.paris.variant===variant,'every manual passage length is available');const route=[...v.route];complete(s);check(v.finished&&json(v.recorded)===json(route),'frozen route completes two tasks and postcard');}
}
{
 const s=fresh(),p=parisPlan(s,'bookstall');startVisit(s,'paris',{destination:'bookstall'});check(parisPlan(s,'bookstall').storyId===p.storyId,'undisplayed plans do not count as story encounters');
 const first=begin(s),id=first.id;check(parisPlan(s,'bookstall').storyId!==first.paris.storyId,'actual display selects another story next time');
 const frozen=json(first.route),reason=first.paris.reason;answer(s,{help:true});const r=restoreState(json(s));ensureGarden(r);check(json(currentVisit(r).route)===frozen&&currentVisit(r).paris.reason===reason&&currentVisit(r).node===first.route[1],'reload keeps exact selected route and reason after support');
 const waiting=currentVisit(r).id;begin(r,'river',3);check(resumeVisit(r,waiting)&&currentVisit(r).node===first.route[1],'paused route stays resumable after another destination');
 check(resumeVisit(s,id)&&currentVisit(s).paris.storyId===first.paris.storyId,'original route resumes');
}
{
 const s=fresh();begin(s);const a=complete(s);check(!a.priorStorySeen&&a.parisVariant===2&&a.parisSelectionReason&&a.practiceOnly&&!a.freshEvidence,'first observation records selection and fresh-story practice only');
 check(parisPlan(s,'bookstall').variant===2,'one story and two answers cannot advance');
 begin(s);complete(s);check(parisPlan(s,'bookstall').variant===3,'two distinct new stories at same variant suggest longer');
 const first=begin(s);check(storyDraft(s).priorStorySeen,'different passage length of same story is rereading');complete(s);check(parisPlan(s,'bookstall').variant===3,'finite library exhaustion does not invent further evidence');
 check(parisPlan(s,'river').variant===2,'destination evidence stays independent');
 const repeat=begin(s,'bookstall',2);check(repeat.paris.storyId!==first.paris.storyId,'repeated actual story visits balance encounters');
}
{
 for(const options of [{help:true},{retry:true},{reading:'together'},{reading:'listened'}]){
  const s=fresh();begin(s);const o=answer(s,options);check(parisPlan(s,'bookstall').variant===1,'explicit help or retry suggests one shorter step');
  answer(s);finishStoryNode(s);check(parisPlan(s,'bookstall').variant===1,'same passage second answer cannot cancel earlier help');
  for(let i=0;i<3;i++)check(parisPlan(s,'bookstall').variant===1,'same signal never ratchets repeatedly');
  const r=restoreState(json(s));ensureGarden(r);check(parisPlan(r,'bookstall').variant===1&&r.garden.observations.some(x=>x.nodeId===o.nodeId),'support suggestion survives reload');
 }
 const s=fresh();begin(s,'bookstall',3);complete(s,{help:true});check(parisPlan(s,'bookstall').variant===2,'shorter suggestion is relative to actual observed long variant');
 const p=parisPlan(s,'bookstall');begin(s,'bookstall',p.variant);complete(s,{reading:'unobserved'});check(parisPlan(s,'bookstall').variant===2,'unknown reading alone holds actual variant, not another drop');
}
{
 const s=fresh();begin(s);complete(s,{reading:'unobserved'});check(parisPlan(s,'bookstall').variant===2,'unknown report is neutral rather than evidence for a shorter text');
 begin(s);const before=parisPlan(s,'bookstall').variant;finishStoryNode(s,true);finishStoryNode(s,true);finishStoryNode(s);check(parisPlan(s,'bookstall').variant===before,'skips do not move suggestion');
 const supported=fresh();begin(supported);complete(supported,{help:true});begin(supported);finishStoryNode(supported,true);finishStoryNode(supported,true);finishStoryNode(supported);check(parisPlan(supported,'bookstall').variant===1,'skips cannot erase earlier support signal');
}
{
 const s=fresh();begin(s);answer(s,{help:true});answer(s);finishStoryNode(s);begin(s,'bookstall',2);complete(s);check(parisPlan(s,'bookstall').variant===2,'one new story after support holds current variant');
 // Rereading the formerly supported story cannot create a second unseen-story success.
 begin(s,'bookstall',2);complete(s);check(parisPlan(s,'bookstall').variant===2,'rereading cannot manufacture advancement after support');
 const copy=restoreState(json(s));ensureGarden(copy);check(parisPlan(copy,'bookstall').variant===2,'reload cannot manufacture fresh story evidence');
}
{
 const s=fresh();const a=begin(s,'river',1),d=storyDraft(s);check(d.priorStorySeen===false,'first display freezes unseen story');
 const same=parisStories.find(x=>x.id===a.paris.storyId);s.garden.seen.push(same.variants[3][0]);ensureGarden(s);check(storyDraft(s).priorStorySeen===false,'later encounters cannot rewrite frozen first-display history');
 answer(s);const second=storyDraft(s);check(second.priorStorySeen===false&&second.priorPassageSeen===true,'pair shares initial story familiarity but second text is rereading');
 answer(s);finishStoryNode(s);check(parisPlan(s,'river',3).variant===3,'manual choice overrides suggestion');
}
{
 const s=fresh();const old=startVisit(s,'paris');check(!old.paris&&!old.route&&old.node==='paris-note','old entry remains linear');const saved=json(s);const r=restoreState(saved);ensureGarden(r);check(currentVisit(r).node==='paris-note','old save retains original visit');
 const other=startVisit(s,'message');const d=storyDraft(s);submitStory(s,storyNodes[other.node].answer);d.method='worked';d.reading='independent';finishStoryNode(s);ensureGarden(s);const before=json(s.garden.observations[0]);begin(s);complete(s);ensureGarden(s);check(json(s.garden.observations[0])===before,'unrelated old observation is untouched');
 check(parisPlan(s,'unknown')===null&&parisPlan(s,'river',0)===null&&startVisit(s,'paris',{destination:'unknown'})===null,'invalid options fail without creating visits');
}
{
 const mutations=[v=>v.route.reverse(),v=>v.route[0]='message-note',v=>v.route.push('paris-postcard'),v=>v.paris.variant=3,v=>v.paris.destination='river',v=>v.paris.storyId='missing',v=>v.paris.reason=null,v=>v.paris.priorStorySeen='false',v=>v.recorded.push('message-note'),v=>v.drafts['message-note']={attempts:[]}];
 for(const mutate of mutations){const s=fresh(),v=begin(s);answer(s);mutate(v);check(!validateParisRoute(v),'tampered route or metadata fails validation');ensureGarden(s);check(!s.garden.visits.length&&!s.garden.observations.length&&s.garden.current===null,'malformed exploration and its dangling observations are removed');}
 const s=fresh();begin(s);complete(s);s.garden.observations[0].parisStory='foreign';ensureGarden(s);check(s.garden.observations.length===2,'observation with foreign metadata is rejected');
 const p=fresh();begin(p);complete(p);p.garden.visits=[];ensureGarden(p);check(!p.garden.observations.length,'dangling exploration records are rejected');
}
{
 const s=fresh(),waiting=begin(s,'bookstall',2),firstId=waiting.id;
 begin(s,'bookstall',2);complete(s);
 const reread=begin(s,'bookstall',1);check(reread.paris.storyId===waiting.paris.storyId,'least seen selects waiting story for shorter revisit');
 resumeVisit(s,firstId);check(storyDraft(s).priorStorySeen===false&&storyDraft(s).familiar===true,'later variant display preserves frozen history but marks paused task as familiar');
 complete(s);check(parisPlan(s,'bookstall').variant===2,'paused cross-variant reread cannot manufacture second unseen success');
}
console.log(checks+' Paris exploration, adaptation, route and restore checks passed.');
