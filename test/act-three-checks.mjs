import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {chooseStoryArrival} from '../dist/story-arrivals-core.mjs';
import {revealOldMap,setPageAmount,storyView} from '../dist/keeper-story-core.mjs';
import {keeperPages} from '../dist/keeper-story-ui.mjs';
import {actTwoPage} from '../dist/act-two-ui.mjs';
import {openUpstreamLetter,revealFloodLedger,actTwoView,setActTwoFrameAmount,setActTwoPageAmount} from '../dist/act-two-core.mjs';
import {startSeedExchange,keepSeedExchange} from '../dist/seed-exchange-core.mjs';
import {startClockWalk,keepClockWalk} from '../dist/courier-clock-core.mjs';
import {walkCases} from '../dist/courier-clock-content.mjs';
import {startUpstream,postUpstreamQuestion,upstreamView} from '../dist/upstream-exchange-core.mjs';
import {canExport} from './act-two-checks.mjs';
import * as A from '../dist/act-three-core.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {actThreeContent as C} from '../dist/act-three-content.mjs';
import {actThreeRoute,actThreePage,actThreeNotes,resetActThreeView} from '../dist/act-three-ui.mjs';

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
 {
  for(const chapter of ['seeds','letters']){const state=actThreeHosts();(chapter==='seeds'?state.seedExchange:state.story.upstreamExchange).version=99;const before=clone(state);eq(A.actThreeCandidates(state,chapter),[],'unsupported '+chapter+' source is not guessed');eq(state,before,'unsupported source remains exact');}
  const state=actThreeHosts();ok(A.startActThree(state,options));let html=actThreePage(state,{part:'chapter',chapter:'route'});ok(html.includes('The courier sets off'),'courier starts a sentence with a capital');ok(setActTwoFrameAmount(state,'longer',options));html=actThreePage(state,{part:'chapter',chapter:'route'});ok(html.includes('The courier sets off with a map'),'courier after a full stop is capitalized');
  const kept=state.courierClockWalk.cases[walkCases[0].id].kept.snapshot;kept.source.title='Route $& $`';html=actThreePage(state,{part:'chapter',chapter:'route'});ok(html.includes('Route $&amp; $`'),'frozen label replacement metacharacters remain literal');
  state.story.upstreamExchange.support=[{questionId:upstreamView(state).questions[0].id,help:'future'}];eq(A.actThreeCandidates(state,'letters').length,1,'unreadable support does not hide a readable post');eq(A.actThreeView(state).sources.letters.retainedUnreadable,false,'support-only damage is not a claim of unreadable posted work');
  for(const row of [null,{questionId:'future-question'}]){state.story.upstreamExchange.posts.push(row);const before=clone(state);eq(A.actThreeView(state).sources.letters.retainedUnreadable,true,'unreadable post rows are visible as retained work');eq(A.actThreeCandidates(state,'letters').length,1,'readable posted sibling remains offerable');eq(state,before,'raw post sibling retained');state.story.upstreamExchange.posts.pop();}
  html=actThreePage(state,{part:'chapter',chapter:'market'});ok(!html.includes('href="#mercado"'),'unbuilt market route is not offered as a destination');
  state.story.acts.III={started:'later',ended:false};html=actThreePage(state,{part:'hub'});ok(html.includes(C.messages.unreadableAct.replaceAll("'","&#39;")),'unreadable start gets recovery guidance');ok(!html.includes('href="#almanac/upstream-letter"'),'no false unopened-letter recovery for unreadable start');
 }
 for(const raw of [null,4,[],false,'future']){const state=actThreeSeed();state.story.acts.III=clone(raw);unchanged(state,()=>A.startActThree(state,options),'unreadable act');}
 for(const chapter of A.actThreeChapters){const state=actThreeHosts();ok(A.startActThree(state,options));state.story.acts.III.contributions[chapter]={kind:'earlier-format'};const before=clone(state);eq(A.actThreeView(state).chapterStatus[chapter],'unreadable');unchanged(state,()=>A.offerActThree(state,chapter,'anything',options),'bad receipt retained');eq(state,before);}
 {
  const state=actThreeSeed();state.story.acts.III={started:true,ended:true,contributions:'broken',season:{kept:true}};state.story.acts.I='unreadable';state.story.acts.II=null;
  ok(A.actThreeView(state).started);ok(A.actThreeView(state).ended,'later ending survives unreadable prior acts and receipts');ok(A.revealWaysPage(state,options));eq(A.actThreeView(state).season,null);eq(state.story.acts.III.season,{kept:true});
  ok(setActTwoFrameAmount(state,'longer',options),'reached Act III keeps frame choice available');ok(setActTwoPageAmount(state,'original',options),'Page 3 choice survives unreadable earlier acts');eq(A.actThreeView(state).frameAmount,'longer');eq(A.actThreeView(state).pageAmount,'original');
  for(const [key,setter] of [['frameAmount',setActTwoFrameAmount],['pageAmount',setActTwoPageAmount]]){state.story[key]={earlier:'kept'};unchanged(state,()=>setter(state,'short',options),'malformed Act III reading choice');eq(A.actThreeView(state)[key],'short');}
 }
 {
  const state=actThreeSeed();state.story.acts.III={started:true,ended:true,contributions:{}};ok(A.revealWaysPage(state,options));ok(revealOldMap(state,options));ok(revealFloodLedger(state,options));state.story.pageAmount={retained:'future reading format'};const before=clone(state);
  ok(storyView(state).pageAmountLocked,'third page makes preservation consistent on the earlier map');eq(actTwoView(state).pageAmountStatus,'unreadable','Page 2 advertises its actual write refusal');unchanged(state,()=>setPageAmount(state,'longer',options),'Page 1 cannot overwrite the third-page retained choice');unchanged(state,()=>setActTwoPageAmount(state,'longer',options),'Page 2 cannot overwrite the third-page retained choice');
  ok(/data-keeper-amount="longer"[^>]*disabled/.test(keeperPages(state)),'Page 1 disables the unavailable preference');ok(/data-act-two-page-amount="longer"[^>]*disabled/.test(actTwoPage(state,{part:'flood-ledger'})),'Page 2 disables the unavailable preference');eq(state,before,'all three page readers retain the raw preference');
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
 {
  const state=actThreeSeed();let low=0,high=MAX_IMPORT_BYTES;
  while(low<high){const mid=Math.floor((low+high+1)/2);state.syntheticPadding='x'.repeat(mid);if(canExport(state))low=mid;else high=mid-1;}
  state.syntheticPadding='x'.repeat(low);ok(canExport(state),'preimage fits the actual shared import limit');unchanged(state,()=>A.startActThree(state,options),'story growth at the shared export limit');
 }
 {
  const state=actThreeHosts(),before=clone(state);resetActThreeView();
  for(const mode of [{part:'hub'},{part:'chapter',chapter:'route'},{part:'ending'},{part:'page'}]){const html=actThreePage(state,mode);ok(!html.includes('Hollis'),'unreached Page 3 identity is not rendered');}
  eq(state,before,'render and Notes do not start a story');actThreeNotes(state);eq(state,before);
  ok(A.startActThree(state,options));let html=actThreePage(state,{part:'hub'});eq((html.match(/class="a3-stop /g)||[]).length,4,'four chapter entrances');ok(html.includes('0 of 4 chapters have work in this story.'));ok(!html.includes('data-a3-send'),'no disabled ending button before three contributions');
  ok(setActTwoFrameAmount(state,'longer',options));html=actThreePage(state,{part:'chapter',chapter:'market'});ok(html.includes('<span lang="es">¡Pan, cestas, miel!</span>'),'reviewed market phrase carries its language');ok(!html.includes('¡Gracias!'),'uncommissioned chapter jobs are absent');
  html=actThreePage(state,{part:'chapter',chapter:'seeds'});ok(html.includes('<span lang="es">Carrizo</span>'));ok(!html.includes('check:')&&!html.includes('can slow water'),'unsettled ecological claim is absent');
  html=actThreePage(state,{part:'chapter',chapter:'letters'});ok(!html.includes("<summary>Keeper's note</summary>"),'unreviewed cross-language note is absent');
  for(const chapter of ['seeds','route','letters'])ok(A.offerActThree(state,chapter,A.actThreeCandidates(state,chapter)[0].key,options));
  html=actThreePage(state,{part:'hub'});ok(html.includes('data-a3-send'),'explicit ending action after three contributions');ok(!html.includes('Hollis'));
  ok(A.sendActThree(state,8,options));html=actThreePage(state,{part:'ending'});ok(html.includes('act-three-ending.svg'));ok(html.includes(C.ending.alt));ok(!html.includes('Hollis'),'the ending does not reveal Page 3 itself');
  html=actThreePage(state,{part:'page'});ok(html.includes('data-a3-reveal'));ok(!html.includes('Hollis'));ok(A.revealWaysPage(state,options));html=actThreePage(state,{part:'page'});ok(html.includes("Hollis&#39;s page"));ok(html.includes('Hollis taught me'));ok(html.includes('data-a3-page-leaf'));
  const visible=clone(state);actThreePage(state,{part:'page'});actThreeNotes(state);eq(state,visible,'all reached readers remain pure');
  const walk=state.courierClockWalk.cases[walkCases[0].id];walk.kept.snapshot.source.title='<img src=x onerror=alert(1)>';delete state.story.acts.III.contributions.route;html=actThreePage(state,{part:'chapter',chapter:'route'});ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'),'frozen labels render as text');ok(!html.includes('<img src=x'));
  state.story.acts.III.ended=false;state.story.acts.III.contributions='retained';html=actThreePage(state,{part:'hub'});ok(!html.includes('0 of 4 chapters'),'unreadable contribution map is not counted as zero');ok(html.includes(C.messages.unreadableAct.replaceAll("'","&#39;")));ok(!actThreeNotes(state).includes('started, 0 of 4'),'Notes do not invent an empty count');
 }
 for(const [hash,expected] of [['#almanac/beyond',{part:'hub'}],['#almanac/beyond/seeds',{part:'chapter',chapter:'seeds'}],['#almanac/beyond/unknown',{part:'hub'}],['#almanac/beyond/route/extra',{part:'hub'}],['#almanac/both-ways',{part:'ending'}],['#almanac/the-ways',{part:'page'}],['#almanac/beyond-ish',null],['#almanac/both-ways/extra',null]])eq(actThreeRoute(hash),expected,'bounded route '+hash);
 {
  const sources=['../docs/content/326-both-ways-across-willow-bridge-text.md','../docs/content/120-story/act-3.md','../docs/content/120-keeper-of-the-ways-text.md'].map(p=>readFileSync(new URL(p,import.meta.url),'utf8')).join('\n');
  const plain=s=>s.replace(/\*/g,'');const allowedTemplates=new Set(Object.values(C.candidate).concat([C.notes.line]));
  const leafs=x=>Array.isArray(x)?x.flatMap(leafs):x&&typeof x==='object'?Object.values(x).flatMap(leafs):typeof x==='string'?[x]:[];
  for(const text of leafs(C)){if(text.startsWith('#')||allowedTemplates.has(text))continue;ok(plain(sources).includes(plain(text)),'finite authored string traces to a named reviewed source: '+text);}
 }
 console.log(`Act III: ${n} source-owner, receipt, preservation, finite-text and presentation assertions passed; the market reader waits for the separately commissioned runtime.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runChecks();
