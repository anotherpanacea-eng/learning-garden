// Synthetic local story notebooks only. Exercise the real whole-notebook importer.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {actTwoView,openUpstreamLetter} from '../dist/act-two-core.mjs';
import {upstreamSource} from '../dist/upstream-exchange-content.mjs';
import * as U from '../dist/upstream-exchange-core.mjs';
const clone=structuredClone;
export const upstreamReport=s=>({title:'After the Storm: observations',exportedAt:'2026-10-28T12:00:00.000Z',note:'Synthetic fictional test notebook.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic'},...s});
export const upstreamCanExport=s=>prepareProgressImport(JSON.stringify(upstreamReport(s),null,2)).ok;
const options={canExport:upstreamCanExport};
export function upstreamFixtures(){
 const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;base.story={version:1,opening:'fresh',arrival:'letter',arrivalChosen:true,acts:{},seenScenes:[]};
 const opened=clone(base);assert.ok(openUpstreamLetter(opened,options));
 const started=clone(opened);assert.ok(U.startUpstream(started,options));
 const full=clone(started);for(const q of upstreamSource.questions){assert.ok(U.selectUpstreamQuestion(full,q.id,options));assert.ok(U.postUpstreamQuestion(full,q.id,options));assert.ok(U.openUpstreamReply(full,q.id,options));}
 const missing=initializeExplorerState(freshState());
 const bad=clone(full);bad.story.upstreamExchange.draft=42;
 const mismatch=clone(full);mismatch.story.upstreamExchange.posts[0].posted.questionId=upstreamSource.questions[1].id;
 const partial=clone(started);partial.story.upstreamExchange.support=[{questionId:'height',help:'damaged',narration:false,together:false},{unexpected:'raw'}];
 const altered=clone(full),s=altered.story.upstreamExchange.source;s.id='retained-source';s.version=2;s.title='Retained fictional edition';s.post={reference:'retained fixed line',unit:'mm',step:25,max:125,estimate:120,approximate:true};s.letter=['Retained letter <synthetic> & unchanged.'];for(const p of altered.story.upstreamExchange.posts){p.posted.sourceId=s.id;p.posted.sourceVersion=s.version;}
 const badDraft=clone(bad),badSupport=clone(full),badPosts=clone(full),future=clone(full);badSupport.story.upstreamExchange.support={raw:'unreadable'};badPosts.story.upstreamExchange.posts={raw:'unreadable'};future.story.upstreamExchange.version=2;
 return {base,unopened:base,opened,started,full,missing,bad,mismatch,partial,altered,badDraft,badSupport,badPosts,future};
}
export function runChecks(){
 let count=0;const ok=(x,m)=>{assert.ok(x,m);count++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;};
 const refuse=(s,fn)=>{const before=clone(s),story=s.story;eq(fn(),false);eq(s,before);eq(s.story,story);};
 const f=upstreamFixtures();
 ok(actTwoView(f.base).letterReady);eq(actTwoView(f.base).letterVisible,false);eq(U.upstreamView(f.base).canStart,false);refuse(f.base,()=>U.startUpstream(f.base,options));
 eq(U.upstreamView(f.missing).status,'locked');ok(U.upstreamView(f.opened).canStart);ok(U.validUpstreamSource(upstreamSource));
 for(const [key,state] of Object.entries(f)){const before=clone(state);U.upstreamView(state);eq(state,before,'pure '+key);ok(upstreamCanExport(state),'actual import '+key);}
 let s=clone(f.opened);for(const o of [{},{canExport:false},{canExport:()=>false},{canExport:()=>{throw Error('synthetic');}}])refuse(s,()=>U.startUpstream(s,o));
 const sibling=s.garden;ok(U.startUpstream(s,options));eq(s.garden,sibling);eq(U.upstreamView(s).selectedQuestionId,null);eq(s.story.upstreamExchange.source,upstreamSource);ok(s.story.upstreamExchange.source!==upstreamSource);
 let calls=0;const noCall={canExport:()=>{calls++;return false;}};const first=s.story;ok(U.startUpstream(s,noCall));eq(s.story,first);eq(calls,0);
 for(const q of upstreamSource.questions){
  ok(U.selectUpstreamQuestion(s,q.id,options));ok(U.useUpstreamSupport(s,q.id,'help',options));ok(U.postUpstreamQuestion(s,q.id,options));
  const receipt=clone(U.upstreamView(s).questions.find(x=>x.id===q.id).post.posted);ok(U.useUpstreamSupport(s,q.id,'together',options));eq(U.upstreamView(s).questions.find(x=>x.id===q.id).post.posted,receipt);
  ok(U.openUpstreamReply(s,q.id,options));const ref=s.story;ok(U.openUpstreamReply(s,q.id,noCall));ok(U.postUpstreamQuestion(s,q.id,noCall));ok(U.useUpstreamSupport(s,q.id,'help',noCall));ok(U.selectUpstreamQuestion(s,q.id,noCall));eq(s.story,ref);
 }
 eq(calls,0);eq(s.story.upstreamExchange.posts.length,4);
 const noHistory=clone(f.full);noHistory.story.seenScenes=[];delete noHistory.story.arrivalChosen;delete noHistory.story.arrival;eq(U.upstreamView(noHistory).status,'ready');ok(U.selectUpstreamQuestion(noHistory,'height',options));
 // A hostile disposable callback cannot alter installed story or sibling roots.
 for(const mode of ['true','false','throw']){
  const n=clone(f.started),before=clone(n),other=n.garden;
  const result=U.selectUpstreamQuestion(n,'height',{canExport:c=>{c.story.seenScenes.push('callback-corruption');c.story.upstreamExchange.source.questions[0].question='changed';c.garden.callbackCorruption=true;if(mode==='throw')throw Error('synthetic');return mode==='true';}});
  eq(result,mode==='true');eq(n.garden,other);eq(n.garden,before.garden);eq(n.story.seenScenes,before.story.seenScenes);eq(n.story.upstreamExchange.source,before.story.upstreamExchange.source);if(mode!=='true')eq(n,before);
 }
 const over=clone(f.started);over.synthetic='x'.repeat(5*1024*1024);refuse(over,()=>U.selectUpstreamQuestion(over,'height',options));
 for(const key of ['posts','support']){
  const n=clone(f.started);n.story.upstreamExchange[key]={raw:true};const v=U.upstreamView(n);eq(v[key+'Status'],'unavailable');refuse(n,()=>key==='posts'?U.postUpstreamQuestion(n,'height',options):U.useUpstreamSupport(n,'height','help',options));
 }
 const m=clone(f.mismatch),mv=U.upstreamView(m);eq(mv.questions[0].postStatus,'unavailable');eq(mv.questions[1].postStatus,'ready');refuse(m,()=>U.postUpstreamQuestion(m,'height',options));ok(U.openUpstreamReply(m,'marks',options));
 const p=clone(f.partial);eq(U.upstreamView(p).questions[0].supportStatus,'unavailable');ok(U.upstreamView(p).sectionNotice);refuse(p,()=>U.useUpstreamSupport(p,'height','help',options));ok(U.useUpstreamSupport(p,'marks','help',options));ok(U.postUpstreamQuestion(p,'marks',options));
 for(const key of ['posts','support']){
  const n=clone(f.full);if(key==='support'){U.useUpstreamSupport(n,'height','help',options);U.useUpstreamSupport(n,'marks','help',options);}const o=n.story.upstreamExchange;o[key].push(clone(o[key][0]));eq(U.upstreamView(n).questions[0][key==='posts'?'postStatus':'supportStatus'],'unavailable');eq(U.upstreamView(n).questions[1][key==='posts'?'postStatus':'supportStatus'],'ready');
 }
 const raw=clone(f.full);raw.story.upstreamExchange.posts.push({questionId:'unknown',posted:{questionId:'marks'}});eq(U.upstreamView(raw).questions[1].postStatus,'ready');ok(U.upstreamView(raw).sectionNotice);
 const d=clone(f.full);d.story.upstreamExchange.draft={questionId:999};d.story.upstreamExchange.posts[0].replyOpened='unknown';eq(U.upstreamView(d).draftStatus,'unavailable');eq(U.upstreamView(d).questions[0].openingStatus,'unavailable');ok(U.upstreamView(d).questions[0].post);refuse(d,()=>U.openUpstreamReply(d,'height',options));refuse(d,()=>U.selectUpstreamQuestion(d,'marks',options));
 for(const size of [1,6]){const n=clone(f.started),source=n.story.upstreamExchange.source;source.questions=Array.from({length:size},(_,i)=>({...clone(source.questions[i%4]),id:'retained-'+i}));eq(U.upstreamView(n).status,'ready');ok(U.selectUpstreamQuestion(n,'retained-0',options));ok(U.postUpstreamQuestion(n,'retained-0',options));ok(U.openUpstreamReply(n,'retained-0',options));}
 eq(U.upstreamView(f.altered).source.post.unit,'mm');eq(U.upstreamView(f.altered).source.letter,['Retained letter <synthetic> & unchanged.']);
 for(const damage of [o=>o.source.questions.push(clone(o.source.questions[0])),o=>o.source.post.step=0,o=>o.source.post.estimate=240.5,o=>o.source.letter=[],o=>o.kind='future',o=>o.version=2]){const n=clone(f.started);damage(n.story.upstreamExchange);eq(U.upstreamView(n).status,'unavailable');refuse(n,()=>U.startUpstream(n,options));}
 const absent=clone(f.started);delete absent.story.upstreamExchange.posts;delete absent.story.upstreamExchange.support;delete absent.story.upstreamExchange.draft;ok(U.selectUpstreamQuestion(absent,'height',options));ok(U.postUpstreamQuestion(absent,'height',options));
 const unknown=clone(f.full);unknown.story.upstreamExchange.extra={retained:'raw'};unknown.story.upstreamExchange.posts[0].posted.extra='kept';const imported=prepareProgressImport(JSON.stringify(upstreamReport(unknown)));ok(imported.ok);eq(imported.state.story,unknown.story);
 for(const key of ['__proto__','constructor','prototype','toString','valueOf']){const report=JSON.stringify(upstreamReport(f.full));const dangerous=report.replace('"upstreamExchange":{','"upstreamExchange":{'+JSON.stringify(key)+':{},');eq(prepareProgressImport(dangerous).ok,false,'real importer rejects '+key);}
 const deep=clone(f.full);let cursor=deep.story.upstreamExchange;for(let i=0;i<65;i++){cursor.extra={};cursor=cursor.extra;}eq(upstreamCanExport(deep),false);
 return count;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`upstream exchange: ${runChecks()} checks passed`);
