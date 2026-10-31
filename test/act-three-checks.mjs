import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState} from '../dist/core.mjs';
import {chooseStoryArrival} from '../dist/story-arrivals-core.mjs';
import {openUpstreamLetter} from '../dist/act-two-core.mjs';
import {startSeedExchange,keepSeedExchange} from '../dist/seed-exchange-core.mjs';
import {startClockWalk,keepClockWalk} from '../dist/courier-clock-core.mjs';
import {walkCases} from '../dist/courier-clock-content.mjs';
import {startUpstream,postUpstreamQuestion,upstreamView} from '../dist/upstream-exchange-core.mjs';
import {canExport} from './act-two-checks.mjs';
import * as A from '../dist/act-three-core.mjs';

const options={canExport},clone=structuredClone;
export function actThreeSeed(){const state=freshState();assert.ok(chooseStoryArrival(state,'letter',options));assert.ok(openUpstreamLetter(state,options));return state;}
export function actThreeHosts(){
 const state=actThreeSeed();assert.ok(startSeedExchange(state,{family:'apples',size:3},options).ok);assert.ok(keepSeedExchange(state,options).ok);
 assert.ok(startClockWalk(state,walkCases[0].id,canExport));assert.ok(keepClockWalk(state,false,canExport));
 assert.ok(startUpstream(state,options));assert.ok(postUpstreamQuestion(state,upstreamView(state).questions[0].id,options));return state;
}
export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
 const unchanged=(state,fn,label)=>{const before=clone(state);eq(fn(),false,label);eq(state,before,label+' preserves the whole notebook');};
 for(const state of [null,false,3,'old',[],{},freshState()]){const before=clone(state);eq(A.actThreeView(state).started,false);for(const chapter of A.actThreeChapters)eq(A.actThreeCandidates(state,chapter),[]);eq(state,before,'pure readers');}
 {
  const state=actThreeHosts(),before=clone(state);ok(A.actThreeView(state).canStart);eq(A.actThreeCandidates(state,'seeds').map(c=>c.ref.edition),['first','latest'],'both retained editions, even on one source');eq(A.actThreeCandidates(state,'route').length,1,'unchecked walk counts');eq(A.actThreeCandidates(state,'letters').length,1,'posted question without reply counts');eq(A.actThreeCandidates(state,'market'),[],'market reader awaits actual spec324 runtime');eq(state,before,'host reads do not initialize or normalize');
  ok(A.startActThree(state,options));const hosts=clone({seedExchange:state.seedExchange,courierClockWalk:state.courierClockWalk,upstreamExchange:state.story.upstreamExchange});
  for(const chapter of ['seeds','route','letters']){const candidate=A.actThreeCandidates(state,chapter)[0];ok(A.offerActThree(state,chapter,candidate.key,options));ok(A.validActThreeOffer(state.story.acts.III.contributions[chapter]));}
  eq(A.actThreeView(state).count,3);ok(A.actThreeView(state).canSend);ok(A.sendActThree(state,3,options));eq(state.story.acts.III.season,'spring');eq(A.actThreeView(state).pageVisible,false,'ending alone does not reveal the page');ok(A.revealWaysPage(state,options));ok(A.actThreeView(state).pageVisible);
  eq({seedExchange:state.seedExchange,courierClockWalk:state.courierClockWalk,upstreamExchange:state.story.upstreamExchange},hosts,'story actions do not rewrite any host');
  const reached=clone(state.story);delete state.seedExchange;delete state.courierClockWalk;delete state.story.upstreamExchange;ok(A.actThreeView(state).ended);ok(A.actThreeView(state).pageVisible,'host deletion never revokes a reveal');
  const withoutHosts=clone(state);ok(A.sendActThree(state,10,options));ok(A.revealWaysPage(state,options));eq(state,withoutHosts,'replay does not refresh season or scenes');eq(state.story.acts.III,reached.acts.III);
 }
 // Every receipt subset, independently of current host saves. An imported market
 // receipt tests retention, not a claim that the deferred market reader exists.
 const refs={market:{tryId:7,amount:'short'},seeds:{visitId:'exchange-1',edition:'latest',sourceId:'earlier-seed-source'},route:{caseId:'earlier-walk',sourceId:'earlier-walk-source'},letters:{questionId:'earlier-question',sourceId:'earlier-letter',sourceVersion:2}};
 const kinds={market:['river-market','cargo-errand'],seeds:['seed-exchange','exchange-plan'],route:['courier-clock-walk','kept-walk'],letters:['upstream-post','posted-question']};
 const receipt=chapter=>({kind:'act-three-offer',version:1,chapter,activity:kinds[chapter][0],artifactKind:kinds[chapter][1],ref:clone(refs[chapter])});
 for(let mask=0;mask<16;mask++){
  const state=actThreeSeed();ok(A.startActThree(state,options));let count=0;
  for(let i=0;i<4;i++)if(mask&(1<<i)){count++;state.story.acts.III.contributions[A.actThreeChapters[i]]=receipt(A.actThreeChapters[i]);}
  eq(A.actThreeView(state).count,count);eq(A.actThreeView(state).canSend,count>=3);
  if(count>=3)ok(A.sendActThree(state,6,options));else unchanged(state,()=>A.sendActThree(state,6,options),'fewer than three chapters');
 }
 {
  const state=actThreeHosts();ok(A.startActThree(state,options));const candidate=A.actThreeCandidates(state,'seeds')[0];ok(A.offerActThree(state,'seeds',candidate.key,options));const before=clone(state);
  ok(A.offerActThree(state,'seeds',A.actThreeCandidates(state,'seeds')[1].key,options));eq(state,before,'first receipt remains unchanged');
  unchanged(state,()=>A.offerActThree(state,'letters','not-an-address',options),'missing candidate');unchanged(state,()=>A.offerActThree(state,'not-a-chapter',candidate.key,options),'unknown chapter');
 }
 {
  const state=actThreeHosts(),work=state.seedExchange.visits['exchange-1'];work.source=null;work.draft=null;state.seedExchange.nextSerial='unreadable';work.latestKept={broken:true};
  eq(A.actThreeCandidates(state,'seeds').length,1,'readable first edition survives broken draft and sibling');eq(A.actThreeCandidates(state,'seeds')[0].ref.edition,'first');ok(A.actThreeView(state).sources.seeds.retainedUnreadable);
  const walk=state.courierClockWalk.cases[walkCases[0].id];walk.page='future';walk.source=null;walk.checks=null;walk.nextCheckId=null;eq(A.actThreeCandidates(state,'route').length,1,'kept walk survives every unrelated current field');
  walk.kept.snapshot.source.title='An earlier route';eq(A.actThreeCandidates(state,'route')[0].label,'An earlier route','frozen label, not current catalog');
  state.courierClockWalk.version=99;eq(A.actThreeCandidates(state,'route'),[],'unknown host is not guessed');
 }
 {
  const state=actThreeHosts(),questions=upstreamView(state).questions;ok(postUpstreamQuestion(state,questions[1].id,options));state.story.upstreamExchange.posts.push(clone(state.story.upstreamExchange.posts[0]));
  const before=clone(state);eq(A.actThreeCandidates(state,'letters').map(c=>c.ref.questionId),[questions[1].id],'all duplicated identities omitted, other question survives');eq(state,before,'duplicate history retained');
 }
 for(const raw of [null,4,[],false,'future']){const state=actThreeSeed();state.story.acts.III=clone(raw);unchanged(state,()=>A.startActThree(state,options),'unreadable act');}
 for(const chapter of A.actThreeChapters){const state=actThreeHosts();ok(A.startActThree(state,options));state.story.acts.III.contributions[chapter]={kind:'earlier-format'};const before=clone(state);eq(A.actThreeView(state).chapterStatus[chapter],'unreadable');unchanged(state,()=>A.offerActThree(state,chapter,'anything',options),'bad receipt retained');eq(state,before);}
 {
  const state=actThreeSeed();state.story.acts.III={started:true,ended:true,contributions:'broken',season:{kept:true}};state.story.acts.I='unreadable';state.story.acts.II=null;
  ok(A.actThreeView(state).started);ok(A.actThreeView(state).ended,'later ending survives unreadable prior acts and receipts');ok(A.revealWaysPage(state,options));eq(A.actThreeView(state).season,null);eq(state.story.acts.III.season,{kept:true});
 }
 for(const mode of ['missing','false','throw']){
  const state=actThreeHosts(),o=mode==='missing'?{}:{canExport:mode==='false'?()=>false:()=>{throw Error('synthetic refusal');}};
  unchanged(state,()=>A.startActThree(state,o),'start preflight '+mode);ok(A.startActThree(state,options));
  unchanged(state,()=>A.offerActThree(state,'route',A.actThreeCandidates(state,'route')[0].key,o),'offer preflight '+mode);
  for(const chapter of ['seeds','route','letters'])ok(A.offerActThree(state,chapter,A.actThreeCandidates(state,chapter)[0].key,options));
  unchanged(state,()=>A.sendActThree(state,2,o),'ending preflight '+mode);ok(A.sendActThree(state,2,options));unchanged(state,()=>A.revealWaysPage(state,o),'reveal preflight '+mode);
 }
 {
  const state=actThreeSeed();ok(A.startActThree(state,{canExport:c=>{c.story={discarded:true};return true;}}));ok(A.actThreeView(state).started,'only the proposal before preflight is committed');
  const before=clone(state);state.story.seenScenes.push('ways-page-revealed');eq(A.actThreeView(state).pageVisible,false,'a scene does not imply the ending');state.story=before.story;
 }
 console.log(`Act III foundation: ${n} source-owner, receipt, preservation and preflight assertions passed; market reader and presentation remain in progress.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runChecks();
