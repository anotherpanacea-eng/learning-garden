import assert from 'node:assert/strict';
import {freshState,restoreStateResult,STORAGE_KEY} from '../dist/core.mjs';
import {ensureGarden,startVisit,currentVisit,storyDraft,noteStorySeen,submitStory,finishStoryNode,openStoryHelp,submitStoryHelp,editStoryOrder,submitStoryOrder} from '../dist/garden-core.mjs';
import {parisVisitSource,parisVisitStatus,parisNode,parisHelper,PARIS_SOURCE_LIMIT} from '../dist/paris-visit-source.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {helpers} from '../dist/help-content.mjs';
import {parisStories} from '../dist/paris-library.mjs';
import {storyPage,parisRecoveryPage,gardenNotes} from '../dist/garden-ui.mjs';
import {helpPage} from '../dist/help-ui.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {prepareProgressImport,initializeExplorerState} from '../dist/progress-transfer.mjs';

const clone=x=>JSON.parse(JSON.stringify(x));
const bytes=x=>new TextEncoder().encode(JSON.stringify(x)).length;
const fresh=()=>initializeExplorerState(freshState());
class Storage{
 constructor(){this.data=new Map();this.fail=false;}
 get length(){return this.data.size;}
 key(i){return [...this.data.keys()][i]??null;}
 getItem(k){return this.data.get(k)??null;}
 setItem(k,v){if(this.fail&&k.startsWith(`${STORAGE_KEY}:`))throw Error('quota');this.data.set(k,v);}
 removeItem(k){this.data.delete(k);}
}
const store=disk=>new ExplorerStore(disk,{now:()=>new Date('2026-10-22T12:00:00Z')});
let checks=0;const check=(ok,label)=>{assert.ok(ok,label);checks++;};

// Every shipped route must be startable under the authored-copy cap.
{
 const s=fresh();
 for(const story of parisStories)for(const variant of [1,2,3]){
  const v=startVisit(s,'paris',{destination:story.destination,variant,storyId:story.id});
  check(!!v&&bytes(v.parisSource)<=PARIS_SOURCE_LIMIT,'authored exploration source is bounded');
 }
 const original=startVisit(s,'paris');
 check(!!original&&original.parisSource.route.length===7&&!Object.hasOwn(original,'route')&&bytes(original.parisSource)<=PARIS_SOURCE_LIMIT,'original source owns its seven-node order without top-level route');
}

// Paused tasks, their helper, and the second page use the captured text and key.
{
 const s=fresh(),v=startVisit(s,'paris',{destination:'bookstall',variant:2}),first=v.node;
 const original=clone(storyNodes[first]),oldHelper=clone(helpers[first]);
 const firstSource=clone(v.parisSource),second=v.route[1],secondOriginal=clone(storyNodes[second]);
 const d=storyDraft(s);d.choice=original.answer;d.readingTools.focus=original.readingText.length-1;
 try{
  storyNodes[first]={...storyNodes[first],readingText:['New sentence'],choices:[...original.choices].reverse(),answer:(original.answer+1)%original.choices.length,body:'Replacement body',hint:'Replacement hint',focusLabel:'Replacement focus'};
  helpers[first]={...helpers[first],id:'replacement-helper',title:'Replacement helper',choices:['New A','New B'],answer:0};
  storyNodes[second]={...storyNodes[second],readingText:['Different later passage'],prompt:'Replacement second prompt'};
  const saved=restoreStateResult(JSON.stringify(s));check(!saved.reason,'complete notebook restores');ensureGarden(saved.state);
  const loaded=currentVisit(saved.state),frozen=parisVisitSource(loaded),draft=storyDraft(saved.state);
  check(JSON.stringify(frozen)===JSON.stringify(firstSource)&&draft.choice===original.answer&&draft.readingTools.focus===original.readingText.length-1,'saved page and selected position survive changed catalogue and loader');
  check(storyPage(saved.state,draft).includes(original.body)&&!storyPage(saved.state,draft).includes('Replacement body'),'renderer uses saved page');
  check(openStoryHelp(saved.state)?.id===oldHelper.id&&helpPage(saved.state,storyDraft(saved.state)).includes(oldHelper.title),'smaller example uses saved helper');
  check(submitStoryHelp(saved.state,oldHelper.answer),'saved helper scores against saved key');
  storyDraft(saved.state).helper.open=false;
  check(submitStory(saved.state,original.answer),'saved page scores against original key');
  storyDraft(saved.state).method='worked';storyDraft(saved.state).reading='independent';
  check(!!finishStoryNode(saved.state),'first question finishes with saved answer');
  check(parisNode(loaded,second).prompt===secondOriginal.prompt&&parisNode(loaded,second).readingText[0]===secondOriginal.readingText[0],'later question keeps original shared passage and prompt');
  check(storyPage(saved.state,storyDraft(saved.state)).includes(secondOriginal.prompt),'second page renders saved prompt');
  const newer=startVisit(saved.state,'paris',{destination:'bookstall',variant:2,storyId:v.paris.storyId});
  check(parisNode(newer,first).body==='Replacement body','new visit receives current authored content');
 }finally{storyNodes[first]=original;helpers[first]=oldHelper;storyNodes[second]=secondOriginal;}
}

// The authored order cards and display permutation remain fixed across a partial draft and submission.
{
 const s=fresh(),v=startVisit(s,'paris',{destination:'rooftops',variant:2,storyId:'puppet-post'});
 storyDraft(s);finishStoryNode(s,true);const id=v.node,old=clone(storyNodes[id]),saved=clone(parisNode(v,id));
 editStoryOrder(s,'add',1);
 try{
  storyNodes[id]={...storyNodes[id],orderItems:['Rewritten end','Rewritten beginning','Rewritten middle'],displayOrder:[2,0,1],choices:[...old.choices].reverse(),answer:4,readingText:['Rewritten passage']};
  const restored=restoreStateResult(JSON.stringify(s));ensureGarden(restored.state);const d=storyDraft(restored.state),visit=currentVisit(restored.state);
  check(JSON.stringify(d.order)==='[1]'&&JSON.stringify(parisNode(visit,id).displayOrder)===JSON.stringify(saved.displayOrder),'partial card order and display permutation stay saved');
  check(storyPage(restored.state,d).includes(saved.orderItems[0])&&!storyPage(restored.state,d).includes('Rewritten beginning'),'order controls render saved cards');
  editStoryOrder(restored.state,'add',0);editStoryOrder(restored.state,'add',2);check(!submitStoryOrder(restored.state),'saved source rejects an incorrect card order');
  editStoryOrder(restored.state,'clear');for(const card of [0,1,2])editStoryOrder(restored.state,'add',card);
  check(submitStoryOrder(restored.state)&&storyDraft(restored.state).attempts.at(-1)===saved.answer,'saved permutation scores the completed order');
  storyDraft(restored.state).method='worked';storyDraft(restored.state).reading='independent';const o=finishStoryNode(restored.state);
  check(o?.answer===saved.answer&&JSON.stringify(o.choices)===JSON.stringify(saved.choices),'recorded order keeps saved key and choices');
 }finally{storyNodes[id]=old;}
}

// A removed catalogue entry cannot delete a captured visit or its recorded outcome.
{
 const s=fresh(),v=startVisit(s,'paris'),id=v.node,original=storyNodes[id],answer=parisNode(v,id).answer;
 storyDraft(s);submitStory(s,answer);storyDraft(s).method='worked';storyDraft(s).reading='independent';finishStoryNode(s);
 const before=clone(s.garden.observations);
 try{delete storyNodes[id];const r=restoreStateResult(JSON.stringify(s));ensureGarden(r.state);
  check(!r.reason&&r.state.garden.visits.length===1&&parisVisitStatus(currentVisit(r.state))==='current','original captured visit survives missing catalogue node');
  check(JSON.stringify(r.state.garden.observations)===JSON.stringify(before),'recorded outcome and answer wording stay unchanged');
  check(currentVisit(r.state).node===v.parisSource.route[1],'resume follows captured original route');
 }finally{storyNodes[id]=original;}
}

// Old and invalid-source records must stay raw, including helper and observation data.
{
 const s=fresh(),legacy=startVisit(s,'paris',{destination:'river',variant:1});
 storyDraft(s);legacy.drafts[legacy.node].attempts=[0,1];legacy.drafts[legacy.node].helper={exampleId:'old-helper',attempts:[2],steps:8,spotlight:4};
 delete legacy.parisSource;
 const rawBefore=clone(legacy),bad=startVisit(s,'paris');bad.parisSource.version=88;bad.drafts[bad.node]={attempts:[2],choice:3,helper:{exampleId:'not-current',attempts:[4]}};
 const badBefore=clone(bad);
 const oldObservation={visitId:legacy.id,nodeId:legacy.node,choices:['Old first','Old second'],answer:1,attempts:[0,1],correct:true,helper:{exampleId:'old-helper',attempts:[2],steps:'<img src=x onerror=alert(1)>'}};
 s.garden.observations.push(clone(oldObservation));
 const story=parisStories.find(x=>x.id===legacy.paris.storyId),oldPair=story.variants[1],oldNode=storyNodes[legacy.node];
 try{story.variants[1]=['removed-first','removed-second'];delete storyNodes[legacy.node];for(let i=0;i<2;i++)ensureGarden(s);}
 finally{story.variants[1]=oldPair;storyNodes[legacy.node]=oldNode;}
 check(parisVisitStatus(legacy)==='legacy'&&parisVisitStatus(bad)==='recovery','legacy and invalid sources remain distinct');
 check(JSON.stringify(legacy)===JSON.stringify(rawBefore)&&JSON.stringify(bad)===JSON.stringify(badBefore),'repeated loads preserve raw visits');
 check(JSON.stringify(s.garden.observations[0])===JSON.stringify(oldObservation),'old completed observation remains raw');
 const note=gardenNotes(s),recovery=parisRecoveryPage(s);
 check(note.includes('selected choice')||note.includes('attempt positions'),'notes describe positions');
 check(note.includes('Smaller-example positions tried: position 3')&&!note.includes('Replacement helper'),'notes use helper positions without current labels');
 check(note.includes('&lt;img src=x onerror=alert(1)&gt;')&&!note.includes('<img src=x'),'raw helper steps cannot insert notes markup');
 check(recovery.includes('data-paris-recovery')&&recovery.includes('data-paris-fresh-start'),'recovery offers fresh start');
 const count=s.garden.visits.length;check(!!startVisit(s,'paris')&&s.garden.visits.length===count+1&&JSON.stringify(legacy)===JSON.stringify(rawBefore),'fresh visit retains legacy record');
 storyDraft(s);noteStorySeen(s);check(JSON.stringify(legacy)===JSON.stringify(rawBefore)&&JSON.stringify(bad)===JSON.stringify(badBefore),'displaying a new visit leaves raw drafts unchanged');
 const prepared=prepareProgressImport(JSON.stringify(s)),disk=new Storage(),m=store(disk);m.load();
 check(prepared.ok&&m.importState(prepared).ok,'actual import accepts raw historical records');
 const imported=m.load();check(JSON.stringify(imported.garden.visits.find(v=>v.id===legacy.id))===JSON.stringify(rawBefore)&&JSON.stringify(imported.garden.visits.find(v=>v.id===bad.id))===JSON.stringify(badBefore),'import leaves legacy and malformed source records raw');
 check(m.setPersistence(false,imported)&&JSON.stringify(m.load().garden.visits.find(v=>v.id===legacy.id))===JSON.stringify(rawBefore),'save-off memory retains raw legacy record');
}

// PR65's question-only snapshot has no future pages or helper source; retain it as raw recovery.
{
 const disk=new Storage(),savedStore=store(disk);savedStore.load();
 const s=fresh(),v=startVisit(s,'paris',{destination:'rooftops',variant:2,storyId:'puppet-post'}),id=v.node,d=storyDraft(s);
 d.question=clone(storyNodes[id]);d.question.prompt='Synthetic earlier question';d.choice=1;d.attempts=[0];
 delete v.parisSource;const rawVisit=JSON.stringify(v);
 check(savedStore.save(s),'question-only visit saves through the explorer store');
 const story=parisStories.find(x=>x.id===v.paris.storyId),oldPair=story.variants[2],oldNode=storyNodes[id];
 try{
  story.variants[2]=['republished-first','republished-second'];delete storyNodes[id];
  const reopened=store(disk),loaded=reopened.load();initializeExplorerState(loaded);
  const kept=loaded.garden.visits.find(x=>x.id===v.id);
  check(parisVisitStatus(kept)==='legacy'&&JSON.stringify(kept)===rawVisit,'actual reload retains question-only snapshot byte-for-byte despite removed/repaired catalog');
  check(currentVisit(loaded)?.id===v.id&&storyDraft(loaded)===null&&parisRecoveryPage(loaded).includes('data-paris-recovery'),'question-only snapshot cannot be silently promoted to an interactive full visit');
  const prepared=prepareProgressImport(JSON.stringify(loaded));
  check(prepared.ok&&savedStore.importState(prepared).ok,'actual export/import accepts the question-only record');
  check(JSON.stringify(savedStore.load().garden.visits.find(x=>x.id===v.id))===rawVisit,'import retains question-only snapshot byte-for-byte without inventing parisSource');
 }finally{story.variants[2]=oldPair;storyNodes[id]=oldNode;}
}

// Old order-attempt codes identify card permutations, not a single answer choice.
{
 const s=fresh(),v=startVisit(s,'paris',{destination:'rooftops',variant:2,storyId:'puppet-post'});
 storyDraft(s);finishStoryNode(s,true);const d=storyDraft(s),id=v.node;
 d.order=[2,0];d.attempts=[0,5,7];delete v.parisSource;const raw=JSON.stringify(v);
 const notes=gardenNotes(s);
 check(notes.includes('order attempts (card positions): position 1 → position 2 → position 3; position 3 → position 2 → position 1; unreadable order'),'legacy order attempt codes decode to card positions only');
 check(notes.includes('Order card positions: position 3, position 1')&&JSON.stringify(v)===raw,'partial order positions display while raw draft stays untouched');
}

// Reject a new oversized capture without changing a waiting visit.
{
 const s=fresh(),waiting=startVisit(s,'paris'),id=waiting.node,old=storyNodes[id],before=JSON.stringify(waiting);
 try{storyNodes[id]={...old,body:'x'.repeat(25000)};check(startVisit(s,'paris')===null&&s.garden.current===waiting.id&&s.garden.visits.length===1,'oversized source leaves waiting visit intact');check(!!s.garden.parisStartNotice,'oversized source has visible notice');}
 finally{storyNodes[id]=old;}
 check(JSON.stringify(waiting)===before,'waiting visit data did not change');
}

// Two saved explorers, 200 visits, export/import, switching, save-off and quota fallback.
{
 const disk=new Storage(),m=store(disk),states=[];let s=m.load();initializeExplorerState(s);
 for(let explorer=0;explorer<2;explorer++){
  if(explorer)s=m.add({},s);
  initializeExplorerState(s);
  for(let i=0;i<100;i++)check(!!startVisit(s,'paris',i%5===0?undefined:i%5===1?{destination:'rooftops',variant:i%3+1,storyId:'puppet-post'}:{destination:['bookstall','river','rooftops'][i%3],variant:i%3+1}),'repeat visit starts');
  check(m.save(s),'100-visit explorer saves');states.push(s);
 }
 const total=states.reduce((n,x)=>n+bytes(x),0);
 check(total<3*1024*1024,`200 complete visit states stay under 3 MiB (${total})`);
 const reopened=store(disk);reopened.load();for(const profile of reopened.explorers){const loaded=reopened.select(profile.id);check(loaded.garden.visits.length===100&&loaded.garden.visits.every(v=>!!parisVisitSource(v)),'real store reload preserves captured pages');}
 const raw=JSON.stringify(states[0]),prepared=prepareProgressImport(raw);
 check(prepared.ok,'actual import preparation accepts 100-visit notebook');
 const result=m.importState(prepared);check(result.ok&&result.state.garden.visits.length===100,'actual import creates intact explorer');
 const active=m.load();check(m.setPersistence(false,active)&&m.load().garden.visits.length===100,'save off keeps captured visits in memory');
 check(m.setPersistence(true,active)&&store(disk).load().garden.visits.length===100,'saving on restores captured visits');
 disk.fail=true;const activeBefore=JSON.stringify(active);active.garden.guide='rowan';check(!m.save(active)&&!!m.warning&&m.load()===active,'quota failure retains session and warning');check(JSON.stringify(m.load()).includes('parisSource')&&JSON.stringify(active).length>=activeBefore.length,'downloadable in-memory progress remains complete');
}
console.log(`${checks} Paris saved-source checks passed.`);
