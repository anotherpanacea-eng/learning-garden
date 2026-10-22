import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {startVisit,storyDraft,storyQuestion,ensureGarden,submitStory,finishStoryNode,useStoryReadingTool} from '../dist/garden-core.mjs';
import {storyPage} from '../dist/garden-ui.mjs';
import {compileParisPacks,cleanOrder,orderValue,ORDER_PERMUTATIONS} from '../dist/paris-pack-core.mjs';
import {puppetPostPack} from '../dist/packs/puppet-post.mjs';
import {parisPacks} from '../dist/packs/index.mjs';
import {parisStories,parisLibraryNodes,parisLibraryHelpers} from '../dist/paris-library.mjs';

let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const clone=x=>structuredClone(x);
const base={stories:[{id:'existing-story'}],nodes:{'old-task':{id:'old-task',passageId:'old-passage'}},helpers:{'old-task':{id:'old-help'}}};
const before=JSON.stringify(base),source=JSON.stringify(puppetPostPack);
const compiled=compileParisPacks([puppetPostPack],base);
check(JSON.stringify(base)===before&&JSON.stringify(puppetPostPack)===source,'successful compilation changes neither base nor source data');
check(compiled.stories.length===2&&Object.keys(compiled.nodes).length===7&&Object.keys(compiled.helpers).length===7,'one story compiles six tasks and helper links');
check(compiled.stories[0]===base.stories[0]&&compiled.nodes['old-task']===base.nodes['old-task'],'existing entries remain intact');
check(compiled.stories!==base.stories&&compiled.nodes!==base.nodes&&compiled.helpers!==base.helpers,'composition uses new catalogs');
const catalog=compiled.stories[1];
check(catalog.id==='puppet-post'&&catalog.packId==='puppet-post'&&catalog.destination==='rooftops'&&!!catalog.invitation,'public pack metadata reaches catalog');
check(catalog.connections.length===1&&catalog.connections[0].topicId==='mt_VEwM7ClYYE'&&catalog.connections[0].scope.includes('unobserved'),'only scoped sequence connection is included');
check(Object.isFrozen(ORDER_PERMUTATIONS)&&ORDER_PERMUTATIONS.every(Object.isFrozen),'permutation convention cannot be mutated');
check(JSON.stringify(ORDER_PERMUTATIONS)==='[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]','six lexicographic permutation indexes');
for(let i=0;i<ORDER_PERMUTATIONS.length;i++){
  const order=ORDER_PERMUTATIONS[i];
  check(orderValue(order)===i,'each complete permutation has its stable numeric value');
  const copy=cleanOrder(order);copy.reverse();check(JSON.stringify(order)===JSON.stringify(ORDER_PERMUTATIONS[i]),'order normalization returns a clone');
}
for(const invalid of [null,{},'012',0,[0,0,1],[0,1,3],[-1,0,1],[0,1,2,3],[0,1,'2'],[0,1,true],Array(3),[undefined]]){
  check(orderValue(invalid)===null,'invalid arrangement is never an answer');
  check(cleanOrder(invalid).length===0,'invalid draft has empty cards');
}
for(const partial of [[],[0],[2,1]]){
  check(JSON.stringify(cleanOrder(partial))===JSON.stringify(partial)&&cleanOrder(partial)!==partial,'valid partial card order survives as clone');
  check(orderValue(partial)===null,'partial arrangement is not submitted');
}
for(const variant of [1,2,3]){
  const [firstId,lastId]=catalog.variants[variant],first=compiled.nodes[firstId],last=compiled.nodes[lastId];
  check(first.kind==='choice'&&first.answer===1&&first.next===lastId&&last.next==='paris-postcard','reviewed evidence key and two-task route');
  check(first.entrance==='paris'&&first.type==='task'&&first.subject==='Reading'&&first.practiceOnly&&last.practiceOnly,'generated tasks stay reading practice');
  check(first.parisVariant===variant&&first.parisStory===catalog.id&&first.parisDestination===catalog.destination&&first.packId==='puppet-post','generated adaptation metadata');
  check(first.passageId===last.passageId&&first.passageId.endsWith(`-${variant}`),'questions share passage only within their variant');
  check(JSON.stringify(first.readingText)===JSON.stringify(puppetPostPack.stories[0].passages[variant])&&JSON.stringify(first.readingText)===JSON.stringify(last.readingText),'connected text remains intact on both questions');
  const count=first.readingText.join(' ').split(/\s+/).length;
  check(count>=[0,30,45,70][variant]&&count<=[0,40,65,95][variant],'authored passage meets its length band');
  check(first.readingText.includes(first.choices[first.answer]),'correct evidence sentence occurs verbatim in all variants');
  check(last.kind==='order'&&last.orderItems.length===3&&last.displayOrder.length===3&&new Set(last.displayOrder).size===3&&JSON.stringify(last.displayOrder)!=='[0,1,2]'&&last.answer===0,'order node starts from non-answer display order');
  check(last.choices.length===6&&new Set(last.choices).size===6,'all possible arrangements have readable observation choices');
  for(let i=0;i<6;i++)check(last.choices[i]===ORDER_PERMUTATIONS[i].map(n=>last.orderItems[n]).join(' → '),'observation choice matches canonical permutation index');
  check(compiled.helpers[firstId].id!==compiled.helpers[lastId].id&&compiled.helpers[firstId].passage!==first.readingText.join(' '),'helpers are separate examples, not original answers');
  check(!Object.hasOwn(first,'helper')&&!Object.hasOwn(first,'connections')&&!Object.hasOwn(last,'items'),'source-only fields do not leak into generated nodes');
}

function rejects(mutator,pattern=/packs\[/){
  const pack=clone(puppetPostPack);mutator(pack);
  const snapshot=JSON.stringify(pack),input=clone(base),inputSnapshot=JSON.stringify(input);
  assert.throws(()=>compileParisPacks([pack],input),pattern);checks++;
  check(JSON.stringify(input)===inputSnapshot&&JSON.stringify(pack)===snapshot,'rejected compilation has no partial registration or input mutation');
}
rejects(p=>p.version=2,/version/);
rejects(p=>p.id='Bad ID',/\.id/);
rejects(p=>p.title=' ',/title/);
rejects(p=>p.stories=[],/stories/);
rejects(p=>p.stories[0].id='existing-story',/story ID collides/);
rejects(p=>p.stories[0].destination='moon',/destination/);
rejects(p=>p.stories[0].invitation='',/invitation/);
rejects(p=>delete p.stories[0].passages[3],/passages.3/);
rejects(p=>p.stories[0].passages[4]=['Unexpected variant.'],/passages.4/);
rejects(p=>p.stories[0].passages[1]=[''],/passages.1/);
rejects(p=>p.stories[0].passages[1]=Array(2),/passages.1/);
rejects(p=>p.stories[0].questions.pop(),/questions/);
rejects(p=>p.stories[0].questions[0].answer=3,/answer/);
rejects(p=>p.stories[0].questions[0].answer='1',/answer/);
rejects(p=>p.stories[0].questions[0].choices=['Same',' Same '],/unique/);
rejects(p=>p.stories[0].questions[0].type='numeric',/type/);
rejects(p=>p.stories[0].questions[0].prompt='',/prompt/);
rejects(p=>p.stories[0].questions[0].helper='missing',/helper/);
rejects(p=>p.stories[0].questions[1].items=['One','Two'],/items/);
rejects(p=>p.stories[0].questions[1].items=['One','One','Three'],/unique/);
rejects(p=>p.stories[0].questions[1].items=['One','Two',''],/items/);
rejects(p=>p.stories[0].questions[1].answer=0,/reserved/);
for(const field of ['id','kind','entrance','next','practiceOnly','readingText','passageId','parisVariant','packId','orderItems','displayOrder'])rejects(p=>p.stories[0].questions[0][field]='override',/reserved/);
rejects(p=>p.helpers['puppet-evidence'].id='old-help',/helper ID collides/);
rejects(p=>p.helpers['old-task']=p.helpers['puppet-evidence'],/helper key collides/);
rejects(p=>p.helpers['puppet-evidence'].answer=5,/answer/);
rejects(p=>p.helpers['puppet-evidence'].model.focus=-1,/focus/);
rejects(p=>p.helpers['puppet-evidence'].model.type='html',/type/);
rejects(p=>p.helpers['puppet-evidence'].kind='order',/kind/);
rejects(p=>p.helpers['puppet-evidence'].script='unsafe',/reserved/);
rejects(p=>p.stories[0].connections[0].topicId='fake',/topicId/);
rejects(p=>p.stories[0].connections[0].scope='',/scope/);
rejects(p=>p.stories[0].connections.push(clone(p.stories[0].connections[0])),/duplicate topic/);
{
  const next=clone(puppetPostPack);next.id='second-pack';
  assert.throws(()=>compileParisPacks([puppetPostPack,next],base),/helper key collides/);checks++;
  assert.throws(()=>compileParisPacks([puppetPostPack,puppetPostPack],base),/duplicate pack/);checks++;
  const collision=clone(base);collision.nodes['paris-explore-puppet-post-1-1']={id:'occupied'};
  const snapshot=JSON.stringify(collision);assert.throws(()=>compileParisPacks([puppetPostPack],collision),/task ID collides/);checks++;
  check(JSON.stringify(collision)===snapshot,'generated task collision leaves base untouched');
  collision.nodes={elsewhere:{passageId:'paris-explore-puppet-post-passage-2'}};
  const snapshot2=JSON.stringify(collision);assert.throws(()=>compileParisPacks([puppetPostPack],collision),/passage ID collides/);checks++;
  check(JSON.stringify(collision)===snapshot2,'late variant collision leaves base untouched');
  const pack=clone(puppetPostPack),second=clone(pack.stories[0]);pack.stories.push(second);
  assert.throws(()=>compileParisPacks([pack],base),/story ID collides/);checks++;
  check(JSON.stringify(base)===before,'duplicate story after valid data still leaves base untouched');
  assert.throws(()=>compileParisPacks(Array(1)),/plain object/);checks++;
  for(const topicId of ['mt_qw6mhOl-Qy','mt__underscore']){
    const pack=clone(puppetPostPack);pack.stories[0].connections[0].topicId=topicId;
    check(compileParisPacks([pack]).stories[0].connections[0].topicId===topicId,'Marble ID syntax preserves hyphens and underscores');
  }
}
check(parisPacks.length===1&&parisStories.length===7&&Object.keys(parisLibraryNodes).length===42,'registered pack appends to six original stories');
check(parisStories.slice(0,6).every(s=>!s.packId)&&parisStories.at(-1).id==='puppet-post','legacy story order and metadata are preserved');
check(Object.keys(parisLibraryHelpers).length===42,'all generated and legacy tasks have helpers');
{
 const s=freshState(),v=startVisit(s,'paris',{destination:'rooftops',variant:2,storyId:'puppet-post'}),d=storyDraft(s),id=v.node,original=structuredClone(storyNodes[id]);
 useStoryReadingTool(s,'sentence-next');useStoryReadingTool(s,'sentence-next');
 const before=JSON.stringify(d),saved=JSON.stringify(s),updated=clone(puppetPostPack);
 updated.stories[0].questions[0].prompt='A revised pack question';
 const replacement=compileParisPacks([updated]).nodes[id];
 replacement.readingText=['A shorter revised passage.'];replacement.readingSkill='Revised skill';replacement.practiceOnly=false;
 try{
  Object.assign(storyNodes[id],replacement);
  const r=restoreState(saved);ensureGarden(r);const draft=storyDraft(r);
  check(JSON.stringify(draft)===before,'a republished pack preserves the frozen question and reading focus on reload');
  check(storyQuestion(r).prompt===original.prompt&&storyPage(r,draft).includes(original.prompt),'republished pack renders the earlier prompt');
  submitStory(r,original.answer);draft.method='worked';draft.reading='independent';const o=finishStoryNode(r);
  ensureGarden(r);
  check(o.readingSkill===original.readingSkill&&o.practiceOnly===original.practiceOnly&&o.readingTools.focus===1,'observation normalization uses frozen reading metadata and sentence count');
 }finally{Object.assign(storyNodes[id],original);}
}
console.log(`${checks} story-pack validation, content and permutation checks passed.`);
