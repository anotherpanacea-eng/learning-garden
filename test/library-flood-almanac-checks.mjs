import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {floodAlmanacPack} from '../dist/packs/flood-almanac.mjs';
import {parisPacks} from '../dist/packs/index.mjs';
import {parisStories} from '../dist/paris-library.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {helpers} from '../dist/help-content.mjs';
import {freshState,restoreStateResult} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {startVisit,currentVisit,storyDraft,openStoryHelp,submitStoryHelp,submitStory,finishStoryNode,editStoryOrder,submitStoryOrder,ensureGarden} from '../dist/garden-core.mjs';
import {parisNode,parisHelper,parisVisitSource,PARIS_SOURCE_LIMIT} from '../dist/paris-visit-source.mjs';
import {storyPage} from '../dist/garden-ui.mjs';

const clone=structuredClone;
const reviewed=readFileSync(new URL('../docs/library-flood-almanac-content.md',import.meta.url),'utf8').split('```js\n')[1].split('\n```')[0];
const installed=readFileSync(new URL('../dist/packs/flood-almanac.mjs',import.meta.url),'utf8').trimEnd();
assert.equal(installed,reviewed,'installed plain-data module is exactly the independently reviewed content');
assert.equal(parisPacks.filter(p=>p.id==='flood-almanac').length,1);
const story=floodAlmanacPack.stories[0],catalog=parisStories.find(s=>s.id==='flood-almanac');
assert.equal(story.destination,'bookstall');
assert.equal(catalog.destination,'bookstall');
assert.deepEqual(story.connections,[{topicId:'mt_VEwM7ClYYE',label:'Relating dated information',scope:'Only ordering three dated pieces of information in one nonfiction passage is practiced. Story retelling, central message, independent reading and mastery remain unobserved.'}]);
assert.equal(Object.hasOwn(story,'image'),false);
assert.equal(story.questions[0].answer,1);
assert.deepEqual(story.questions[1].items,['The Seine reached its highest mark','The government formed a flood commission','The Seine returned to its riverbed']);
for(const variant of [1,2,3]){
 const passage=story.passages[variant],route=catalog.variants[variant],first=storyNodes[route[0]],second=storyNodes[route[1]];
 assert.equal(route.length,2);
 assert.equal(first.next,route[1]);assert.equal(second.next,'paris-postcard');
 assert.equal(first.practiceOnly,true);assert.equal(second.practiceOnly,true);
 assert.deepEqual(first.readingText,passage);assert.deepEqual(second.readingText,passage);
 for(const choice of story.questions[0].choices)assert.equal(passage.filter(sentence=>sentence===choice).length,1,'each offered sentence occurs once in every passage');
 assert.ok(passage.some(sentence=>sentence.includes('Archives de Paris chronology')&&sentence.includes('Musée Carnavalet photograph')));
 assert.ok(passage.some(sentence=>sentence.includes('real Paris')&&sentence.includes('imagined')));
 assert.ok(passage.length>=[0,6,8,10][variant]&&passage.length<=[0,7,9,12][variant]);
 assert.ok(passage.join(' ').split(/\s+/).length<=[0,100,140,180][variant]);
 assert.ok(passage.every(sentence=>sentence.trim().split(/\s+/).length<=18));
 assert.equal(second.orderItems.length,3);assert.notDeepEqual(second.displayOrder,[0,1,2]);
 assert.equal(helpers[route[0]].id,'flood-almanac-evidence');assert.equal(helpers[route[1]].id,'flood-almanac-sequence');
}
assert.equal(story.passages[3][0],story.questions[0].choices[2],'long passage opens with March, while date order starts with January');

class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const state=initializeExplorerState(freshState()),visit=startVisit(state,'paris',{destination:'bookstall',variant:3,storyId:'flood-almanac'});
assert.ok(visit);assert.ok(new TextEncoder().encode(JSON.stringify(visit.parisSource)).length<=PARIS_SOURCE_LIMIT);
assert.equal(visit.parisSource.connections[0].topicId,'mt_VEwM7ClYYE');
const [firstId,secondId]=visit.route;
const frozen=clone(visit.parisSource),originalFirst=storyNodes[firstId],originalSecond=storyNodes[secondId],originalHelper=helpers[firstId];
storyDraft(state).choice=story.questions[0].answer;
try{
 storyNodes[firstId]={...originalFirst,body:'Later catalog title',readingText:['Later passage'],choices:[...originalFirst.choices].reverse(),answer:0};
 storyNodes[secondId]={...originalSecond,readingText:['Later second passage'],orderItems:[...originalSecond.orderItems].reverse(),displayOrder:[2,0,1]};
 helpers[firstId]={...originalHelper,title:'Later helper',answer:0};
 catalog.connections[0]={...catalog.connections[0],label:'Later connection'};
 const disk=new Storage(),store=new ExplorerStore(disk);store.load();store.save(state);
 const loaded=new ExplorerStore(disk).load();ensureGarden(loaded);
 const retained=currentVisit(loaded),draft=storyDraft(loaded);
 assert.deepEqual(parisVisitSource(retained),frozen,'actual storage loader retains full visit source');
 assert.equal(draft.choice,1);assert.ok(storyPage(loaded,draft).includes(story.passages[3][0]));
 assert.equal(openStoryHelp(loaded).title,originalHelper.title);assert.equal(parisHelper(retained,firstId).title,originalHelper.title);
 assert.equal(submitStoryHelp(loaded,originalHelper.answer),true);
 storyDraft(loaded).helper.open=false;
 assert.equal(submitStory(loaded,story.questions[0].answer),true);
 storyDraft(loaded).method='worked';storyDraft(loaded).reading='independent';
 const firstObservation=finishStoryNode(loaded);
 assert.equal(firstObservation?.correct,true);assert.equal(firstObservation?.freshEvidence,false);
 assert.deepEqual(parisNode(retained,secondId).readingText,story.passages[3],'second question rereads the originally chosen passage');
 editStoryOrder(loaded,'add',0);assert.deepEqual(storyDraft(loaded).order,[0]);
 const exported=JSON.stringify(loaded),prepared=prepareProgressImport(exported);
 assert.equal(prepared.ok,true);assert.deepEqual(prepared.state.garden.visits.find(v=>v.id===visit.id).parisSource,frozen);
 const imported=restoreStateResult(exported);assert.equal(imported.reason,null);ensureGarden(imported.state);
 assert.deepEqual(storyDraft(imported.state).order,[0]);
 for(const index of [1,2])assert.equal(editStoryOrder(imported.state,'add',index),true);
 assert.equal(submitStoryOrder(imported.state),true);
 storyDraft(imported.state).method='worked';storyDraft(imported.state).reading='together';
 const secondObservation=finishStoryNode(imported.state);
 assert.equal(secondObservation?.correct,true);assert.equal(secondObservation?.freshEvidence,false);
 assert.equal(currentVisit(imported.state).node,'paris-postcard');
 assert.deepEqual(parisVisitSource(currentVisit(imported.state)),frozen);
 const later=startVisit(imported.state,'paris',{destination:'bookstall',variant:3,storyId:'flood-almanac'});
 assert.equal(parisNode(later,firstId).body,'Later catalog title','a fresh visit uses later authored copy');
 assert.notEqual(parisVisitSource(later).connections[0].label,frozen.connections[0].label);
}finally{
 storyNodes[firstId]=originalFirst;storyNodes[secondId]=originalSecond;helpers[firstId]=originalHelper;catalog.connections[0]=story.connections[0];
}

// A missing installed story does not reassign a saved visit's words or outcome.
const old=initializeExplorerState(freshState()),oldVisit=startVisit(old,'paris',{destination:'bookstall',variant:1,storyId:'flood-almanac'});
const node=oldVisit.node,originalNode=storyNodes[node],position=parisStories.indexOf(catalog);
storyDraft(old);submitStory(old,story.questions[0].answer);storyDraft(old).method='worked';storyDraft(old).reading='together';finishStoryNode(old);
const originalRaw=JSON.stringify(oldVisit),originalObservations=JSON.stringify(old.garden.observations);
try{
 delete storyNodes[node];parisStories.splice(position,1);
 const restored=restoreStateResult(JSON.stringify(old));assert.equal(restored.reason,null);ensureGarden(restored.state);
 assert.equal(JSON.stringify(restored.state.garden.visits[0]),originalRaw);
 assert.equal(JSON.stringify(restored.state.garden.observations),originalObservations);
 assert.ok(storyDraft(restored.state));
}finally{storyNodes[node]=originalNode;parisStories.splice(position,0,catalog);}
console.log('Library flood almanac: reviewed bytes, all lengths, frozen loader/transfer, changed catalog, and removed story passed.');
