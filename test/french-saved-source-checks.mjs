import assert from 'node:assert/strict';
import {freshState,restoreStateResult} from '../dist/core.mjs';
import {ensureGarden,startVisit,currentVisit,storyDraft,noteStorySeen,submitStory,finishStoryNode,openStoryHelp,editStoryOrder,submitStoryOrder} from '../dist/garden-core.mjs';
import {parisVisitSource,parisVisitStatus,parisNode,parisHelper,PARIS_SOURCE_LIMIT} from '../dist/paris-visit-source.mjs';
import {frenchStories} from '../dist/french-library.mjs';
import {frenchEntrances} from '../dist/french-content.mjs';
import {entrances,storyNodes} from '../dist/story-content.mjs';
import {helpers} from '../dist/help-content.mjs';
import {frenchPlan,priorFrenchStorySeen} from '../dist/french-core.mjs';
import {storyPage,storyEnding,parisRecoveryPage,gardenNotes,frenchLanding} from '../dist/garden-ui.mjs';
import {helpPage} from '../dist/help-ui.mjs';
import {prepareProgressImport,initializeExplorerState,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
const clone=x=>JSON.parse(JSON.stringify(x)),json=JSON.stringify,bytes=x=>new TextEncoder().encode(json(x)).length;
const fresh=()=>initializeExplorerState(freshState());
let checks=0;const check=(ok,label)=>{assert.ok(ok,label);checks++;};
const options=s=>({destination:s.destination,storyId:s.id,variant:1});
function answered(s){const v=currentVisit(s),n=parisNode(v,v.node),d=storyDraft(s);noteStorySeen(s);d.method='worked';d.reading='independent';submitStory(s,n.answer);return finishStoryNode(s);}
// All thirty routes capture their complete bilingual source without growing the authored limit.
for(const e of frenchEntrances){const v=startVisit(fresh(),e.id);check(parisVisitStatus(v)==='current'&&bytes(v.parisSource)<=PARIS_SOURCE_LIMIT,'original French capture fits');}
for(const story of frenchStories)for(const variant of [1,2,3]){const v=startVisit(fresh(),'french',{...options(story),variant});check(parisVisitStatus(v)==='current'&&bytes(v.parisSource)<=PARIS_SOURCE_LIMIT,'exploration capture fits');}
{
 const s=fresh(),story=frenchStories.find(s=>storyNodes[s.variants[1][1]].kind==='order'),v=startVisit(s,'french',options(story));
 const [first,second,project]=v.route,n=clone(parisNode(v,first)),next=clone(parisNode(v,second)),h=clone(parisHelper(v,first)),source=clone(v.parisSource);
 const originals=[first,second,project].map(id=>storyNodes[id]),oldHelper=helpers[first],oldTitle=story.title,entry=entrances.find(e=>e.id==='french'),oldEnding=clone(entry.ending);
 const d=storyDraft(s);noteStorySeen(s);d.choice=n.answer;d.readingTools.focus=n.readingText.length-1;d.readingTools.sentenceUsed=true;openStoryHelp(s);d.helper.choice=h.answer;d.helper.attempts=[h.answer];
 ensureGarden(s);const before=json(v);
 try{
  storyNodes[first]={...n,readingText:['Nouveau texte.'],prompt:'Replacement question',choices:['New A','New B'],answer:1,hint:'New meaning',readingSkill:'New focus'};
  storyNodes[second]={...next,orderItems:['Changed one','Changed two','Changed three'],displayOrder:[2,1,0],readingText:['New passage']};
  helpers[first]={...h,id:'changed-helper',title:'Changed helper',choices:['Changed choice','Other choice'],answer:1};story.title='Changed story title';entry.ending={...entry.ending,title:'Changed ending'};
  const r=restoreStateResult(json(s));ensureGarden(r.state);const current=currentVisit(r.state);
  check(json(current)===before,'catalog edits leave paused source and drafts byte equal');
  check(helpPage(r.state,storyDraft(r.state)).includes(h.title)&&!helpPage(r.state,storyDraft(r.state)).includes('Changed helper'),'helper renders its captured title');
  storyDraft(r.state).helper.open=false;
  check(storyPage(r.state,storyDraft(r.state)).includes(n.prompt)&&!storyPage(r.state,storyDraft(r.state)).includes('Replacement question'),'old question retains its wording');
  check(submitStory(r.state,n.answer),'old key still fits');storyDraft(r.state).method='worked';finishStoryNode(r.state);
  check(parisNode(current,current.node).readingText[0]===next.readingText[0],'second task retains its whole passage');
  editStoryOrder(r.state,'add',1);const partial=json(current.drafts[second]);ensureGarden(r.state);
  check(json(current.drafts[second])===partial,'partial order survives load');
  editStoryOrder(r.state,'clear');for(const i of [0,1,2])editStoryOrder(r.state,'add',i);check(submitStoryOrder(r.state),'order uses old items and key');storyDraft(r.state).method='worked';finishStoryNode(r.state);finishStoryNode(r.state);
  check(storyEnding(r.state,current).includes(oldEnding.title)&&!storyEnding(r.state,current).includes('Changed ending'),'ending remains captured');
  check(json(current.parisSource)===json(source),'completed source unchanged');
  check(!!startVisit(r.state,'french',options(story))&&parisNode(currentVisit(r.state),first).prompt==='Replacement question','new visit uses changed source');
  delete storyNodes[first];const restored=restoreStateResult(json(s));ensureGarden(restored.state);check(parisVisitStatus(currentVisit(restored.state))==='current','catalog node removal cannot delete captured work');
 }finally{[first,second,project].forEach((id,i)=>storyNodes[id]=originals[i]);helpers[first]=oldHelper;story.title=oldTitle;entry.ending=oldEnding;}
}
// Legacy wording is never reconstructed, even when IDs still match. Retired IDs keep encounters.
{
 const s=fresh(),story=frenchStories[0],v=startVisit(s,'french',options(story));answered(s);delete v.parisSource;const before=json(v),obs=json(s.garden.observations),ids=[...v.route],oldVariants=clone(story.variants),nodes=ids.map(id=>storyNodes[id]);
 try{
  ids.forEach(id=>delete storyNodes[id]);story.variants[1]=['new-french-page-one','new-french-page-two'];
  for(let i=0;i<2;i++)ensureGarden(s);
  check(json(v)===before&&json(s.garden.observations)===obs,'retired legacy route and observations stay unchanged');
  check(s.garden.seen.includes(ids[0])&&priorFrenchStorySeen(s,story.id),'retired node still retains story encounter');
  check(parisRecoveryPage(s).includes('Choose another French story')&&!parisRecoveryPage(s).includes('data-paris-fresh-start'),'repaired route uses explicit chooser, never substitutes');
  check(frenchPlan(s,story.destination).storyId!==story.id,'earlier story encounter influences fresh selection without current node membership');
  check(prepareProgressImport(json(s)).ok,'actual import accepts retained retired legacy work');
  check(gardenNotes(s).includes('position')&&!gardenNotes(s).includes('New meaning'),'legacy notes use stored positions');
 }finally{story.variants=oldVariants;ids.forEach((id,i)=>storyNodes[id]=nodes[i]);}
 startVisit(s,'french',options(story));check(storyDraft(s).priorStorySeen===true,'reintroduced story cannot become new after old IDs disappear');
}
for(const mutate of [v=>v.parisSource.version=99,v=>v.parisSource=null,v=>v.parisSource.nodes[v.route[0]].language='en',v=>v.parisSource.helpers[v.route[0]].model.language='en']){
 const s=fresh(),v=startVisit(s,'french',options(frenchStories[0]));mutate(v);const raw=json(v);startVisit(s,'french-bookstall');s.garden.current=v.id;ensureGarden(s);
 check(parisVisitStatus(v)==='recovery'&&json(v)===raw&&s.garden.visits.length===2,'unreadable source keeps raw record and readable sibling');
 check(prepareProgressImport(json(s)).ok,'unreadable source is still exportable/importable');
}
{
 const s=fresh();for(const story of [frenchStories[0],frenchStories[3]]){startVisit(s,'french',options(story));answered(s);finishStoryNode(s,true);finishStoryNode(s);}
 check(frenchPlan(s,'rooftops').variant===2,'two captured independent stories can invite more text');
 const ids=s.garden.visits.map(v=>v.route[0]),old=ids.map(id=>storyNodes[id]);try{ids.forEach(id=>storyNodes[id]={...storyNodes[id],answer:(storyNodes[id].answer+1)%3});ensureGarden(s);check(frenchPlan(s,'rooftops').variant===2,'suggestion uses saved keys after current keys change');}finally{ids.forEach((id,i)=>storyNodes[id]=old[i]);}
 s.garden.visits.forEach(v=>delete v.parisSource);ensureGarden(s);check(frenchPlan(s,'rooftops').variant===1,'legacy results cannot create a new reading suggestion');
}
{
 const s=fresh(),v=startVisit(s,'french',options(frenchStories[0])),before=json(v),id=v.node,n=storyNodes[id];try{storyNodes[id]={...n,body:'x'.repeat(25000)};check(!startVisit(s,'french',options(frenchStories[0]))&&json(v)===before,'oversized new capture leaves waiting visit untouched');check(frenchLanding(s).includes(s.garden.frenchStartNotice),'French capture refusal is visible');}finally{storyNodes[id]=n;}
}
class Storage{constructor(){this.data=new Map();this.fail=false;}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){if(this.fail)throw Error('quota');this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk),states=[];let s=store.load();
 for(let explorer=0;explorer<2;explorer++){if(explorer)s=store.add({},s);initializeExplorerState(s);for(let i=0;i<100;i++)startVisit(s,i%5===0?'french-bookstall':'french',i%5===0?undefined:{...options(frenchStories[i%9]),variant:i%3+1});check(store.save(s),'100 French visits save');states.push(s);}
 check(states.reduce((n,s)=>n+bytes(s),0)<3*1024*1024,'200 French visits fit the representative storage budget');
 const reopened=new ExplorerStore(disk);reopened.load();for(const profile of reopened.explorers){const r=reopened.select(profile.id);ensureGarden(r);check(r.garden.visits.length===100&&r.garden.visits.every(v=>parisVisitStatus(v)==='current'),'real store reload and switching preserve captured visits');}
 for(const state of states){const report=JSON.stringify({title:'Synthetic notes',exportedAt:'2026-10-22T12:00:00Z',...state},null,2),prepared=prepareProgressImport(report);check(new TextEncoder().encode(report).length<MAX_IMPORT_BYTES&&prepared.ok,'formatted repeated-visit report passes actual import caps');check(store.importState(prepared).state.garden.visits.length===100,'actual explorer import preserves French copies');}
 const active=store.load();check(store.setPersistence(false,active)&&store.load().garden.visits.length===100,'saving off retains in-memory copies');check(store.setPersistence(true,active),'saving on retains work');disk.fail=true;check(!store.save(active)&&!!store.warning&&store.load()===active,'quota failure retains work and visible warning');check(prepareProgressImport(json(active)).ok,'in-memory work still exportable after quota failure');disk.fail=false;check(store.clearActive().garden?.visits===undefined,'explicit reset clears active visits');
}
console.log(`${checks} French whole-visit source checks passed.`);
