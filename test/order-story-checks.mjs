import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {parisStories} from '../dist/paris-library.mjs';
import {parisPlan,validateParisRoute} from '../dist/paris-core.mjs';
import {ORDER_PERMUTATIONS,orderValue,cleanOrder} from '../dist/paris-pack-core.mjs';
import {ensureGarden,startVisit,currentVisit,storyDraft,noteStorySeen,submitStory,editStoryOrder,submitStoryOrder,finishStoryNode,useStoryReadingTool,openStoryHelp,submitStoryHelp,resumeVisit} from '../dist/garden-core.mjs';
import {helpers} from '../dist/help-content.mjs';
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
const json=JSON.stringify;
const fresh=()=>{const s=freshState();ensureGarden(s);return s;};
const begin=(s,variant=2)=>startVisit(s,'paris',{destination:'rooftops',variant,storyId:'puppet-post'});
function orderTask(s,variant=2){
 const v=begin(s,variant);check(v&&validateParisRoute(v),'new pack has a valid explicit route');
 let n=storyNodes[v.node],d=storyDraft(s);noteStorySeen(s);submitStory(s,n.answer);d.method='worked';d.reading='independent';
 check(!!finishStoryNode(s),'first evidence task can finish');n=storyNodes[currentVisit(s).node];d=storyDraft(s);noteStorySeen(s);
 check(n.kind==='order'&&n.orderItems.length===3&&d.order.length===0,'second task starts with three unselected cards');return {n,d,v};
}
function arrange(s,values){check(editStoryOrder(s,'clear'),'clear is an edit');for(const value of values)check(editStoryOrder(s,'add',value),'unique available card can be added');}
check(ORDER_PERMUTATIONS.length===6&&json(ORDER_PERMUTATIONS[0])==='[0,1,2]','stable numbering starts with canonical arrangement');
for(const [index,permutation] of ORDER_PERMUTATIONS.entries()){
 check(orderValue(permutation)===index,'all six arrangements have distinct stable values');
 const s=fresh(),{n,d}=orderTask(s);arrange(s,permutation);
 check(d.attempts.length===0,'edits never count as submitted attempts');
 check(submitStoryOrder(s)===(index===0),'only canonical arrangement is accepted');
 check(json(d.attempts)===json([index])&&n.choices[index]===permutation.map(i=>n.orderItems[i]).join(' → '),'numeric attempt retains its human-readable arrangement');
 check(!submitStory(s,0)&&d.attempts.length===1,'ordinary numeric submission cannot bypass card validation');
 if(index===0){
  const saved=json(d.order);check(!editStoryOrder(s,'clear')&&!editStoryOrder(s,'remove',0)&&!editStoryOrder(s,'add',0)&&!submitStoryOrder(s),'success locks all order actions and resubmission');
  check(json(d.order)===saved&&d.attempts.length===1&&!finishStoryNode(s),'success still needs a method report');
  d.method='worked';d.reading='independent';const o=finishStoryNode(s);
  check(o.correct&&o.firstCorrect&&!o.freshEvidence&&o.priorPassageSeen&&o.practiceOnly,'rereading task remains practice even when correct independently');
  check(json(o.attempts)==='[0]'&&o.choices.length===6,'observation exports numeric attempts and readable choices');
 }else{
  check(!finishStoryNode(s),'wrong arrangement cannot advance');arrange(s,[0,1,2]);check(submitStoryOrder(s),'wrong arrangement may be revised');
  d.method='worked';d.reading='independent';const o=finishStoryNode(s);check(o.correct&&!o.firstCorrect&&!o.independent&&json(o.attempts)===json([index,0]),'retry history survives correction');
 }
}
{
 const s=fresh(),{d}=orderTask(s);check(!submitStoryOrder(s)&&d.attempts.length===0,'empty arrangement is not submitted');
 check(editStoryOrder(s,'add',2)&&editStoryOrder(s,'add',0),'partial arrangement may be built');
 check(!editStoryOrder(s,'add',2)&&!editStoryOrder(s,'add',3)&&!editStoryOrder(s,'add',-1)&&!editStoryOrder(s,'add',1.5)&&!editStoryOrder(s,'remove',2)&&!editStoryOrder(s,'unknown',0),'invalid or duplicate editing actions are rejected');
 check(!submitStoryOrder(s)&&!d.attempts.length,'partial arrangement is not an attempt');
 const copy=restoreState(json(s));ensureGarden(copy);const restored=storyDraft(copy);
 check(json(restored.order)==='[2,0]'&&!restored.attempts.length,'partial arrangement persists through save and restore');
 check(editStoryOrder(copy,'remove',0)&&json(restored.order)==='[0]','remove index names selected position rather than card identity');
 check(editStoryOrder(copy,'clear')&&restored.order.length===0,'clear resets partial selection without an attempt');
 check(editStoryOrder(copy,'add',1)&&editStoryOrder(copy,'add',2)&&editStoryOrder(copy,'add',0)&&!editStoryOrder(copy,'add',0),'three slots cannot overfill');
}
for(const invalid of [null,{},'012',[0,0,1],[-1,0,1],[0,1,3],[0,1,2,0],[0,1,'2'],[0.5,1,2]]){
 check(orderValue(invalid)===null&&json(cleanOrder(invalid))==='[]','malformed order is not a complete answer or valid partial draft');
 const s=fresh(),{d}=orderTask(s);d.order=invalid;ensureGarden(s);
 check(storyDraft(s).order.length===0&&!submitStoryOrder(s)&&!d.attempts.length,'malformed saved draft resets without inventing an attempt');
}
{
 const partial=[2,0],copy=cleanOrder(partial);check(json(copy)===json(partial)&&copy!==partial,'valid partial draft is copied');
 const s=fresh(),{d}=orderTask(s);arrange(s,[0,1,2]);submitStoryOrder(s);d.method='worked';d.reading='independent';d.order=[0,0,0];
 const r=restoreState(json(s));ensureGarden(r);check(json(storyDraft(r).attempts)==='[0]'&&storyDraft(r).order.length===0,'normalization preserves an already submitted correct attempt');
 check(!editStoryOrder(r,'add',1)&&!submitStoryOrder(r)&&!!finishStoryNode(r),'a restored correct attempt stays locked and may finish');
}
{
 const s=fresh(),{n,d}=orderTask(s);editStoryOrder(s,'add',2);const initial=json(d.order),h=openStoryHelp(s);
 check(!!h&&d.helpUsed&&d.helper.open,'order task offers a smaller authored example');
 check(!editStoryOrder(s,'add',0)&&!editStoryOrder(s,'remove',0)&&!editStoryOrder(s,'clear')&&!submitStoryOrder(s)&&!useStoryReadingTool(s,'audio'),'open helper protects original order and reading controls');
 check(json(d.order)===initial&&!d.attempts.length,'helper opening does not submit or alter the waiting order');
 submitStoryHelp(s,helpers[n.id].answer);d.helper.open=false;useStoryReadingTool(s,'audio');useStoryReadingTool(s,'sentence-next');arrange(s,[0,1,2]);submitStoryOrder(s);d.method='worked';d.reading='independent';
 const o=finishStoryNode(s);check(o.correct&&o.supported&&!o.independent&&!o.freshEvidence&&o.helpUsed&&o.readingTools.audioRequested&&o.readingTools.sentenceUsed,'helper and reading-tool support stay separate from reported independent reading');
 check(!editStoryOrder(s,'clear')&&!submitStoryOrder(s),'order actions reject the postcard and finished nodes');finishStoryNode(s);check(!editStoryOrder(s,'add',0)&&!submitStoryOrder(s),'finished visit rejects order actions');
}
{
 const s=fresh();for(const variant of [1,2,3]){
  const p=parisPlan(s,'rooftops',variant,'puppet-post');check(p.storyId==='puppet-post'&&p.variant===variant&&p.route.length===3,'specific story shortcut keeps every passage length available');
 }
 const count=s.garden.visits.length;
 for(const id of ['missing','',4,{},'travelling-book'])check(parisPlan(s,'rooftops','auto',id)===null&&startVisit(s,'paris',{destination:'rooftops',storyId:id})===null,'shortcut rejects unknown, wrong-destination or malformed story ID');
 check(s.garden.visits.length===count,'invalid shortcut leaves visits unchanged');
 const waiting=begin(s,1),draft=storyDraft(s);draft.input='synthetic waiting marker';const next=startVisit(s,'paris',{destination:'river',variant:3});
 check(next.id!==waiting.id&&resumeVisit(s,waiting.id)&&storyDraft(s).input==='synthetic waiting marker'&&currentVisit(s).paris.storyId==='puppet-post','explicit selection preserves another waiting visit');
 const ordinary=fresh(),first=parisPlan(ordinary,'rooftops');check(first.storyId===parisStories.find(x=>x.destination==='rooftops').id,'least-encountered default retains existing first story');
 for(let i=0;i<2;i++){const v=startVisit(ordinary,'paris',{destination:'rooftops'});storyDraft(ordinary);noteStorySeen(ordinary);check(v.paris.storyId!=='puppet-post','older unseen stories remain first in rotation');}
 check(parisPlan(ordinary,'rooftops').storyId==='puppet-post','new pack joins least-encountered rotation');
}
{
 const s=fresh(),v=startVisit(s,'paris');storyDraft(s);const before=json(v);s.practice.push({questionId:'synthetic-legacy-practice',skill:'facts',attempts:[6],status:'answered',fact:[2,3]});const other=json(s.practice);
 const r=restoreState(json(s));ensureGarden(r);check(json(currentVisit(r))===before&&json(r.practice)===other,'legacy linear Paris and unrelated records retain their content');
 begin(r,3);check(currentVisit(r).route.every(id=>storyNodes[id]),'new packed route coexists with legacy saves');
}
console.log(checks+' ordering, support, pack selection and restore checks passed.');
