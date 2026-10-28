// Exercise the real optional-map loader without importing the DOM application.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {areas} from '../dist/broad-content.mjs';
import {ensureBroad,beginTrail,trailQuestion,recordTrail,makeBroadObservation,suggestActivity} from '../dist/broad-core.mjs';
import {broadHome,activityLibrary,checkinHub,trailSummary} from '../dist/broad-ui.mjs';
const source=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const start=source.indexOf('// Optional map data must never hold'),end=source.indexOf("let screen=''",start);
assert.ok(start>=0&&end>start,'actual optional-map loader seam exists');
const loader=source.slice(start,end),realMap=JSON.parse(readFileSync(new URL('../dist/marble-map.json',import.meta.url),'utf8'));
let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},same=(a,b,m)=>{assert.equal(a,b,m);n++;};
const flush=async()=>{for(let i=0;i<10;i++)await Promise.resolve();};
function fixture({hasMapPanel=true}={}){
 const calls=[],timers=new Map(),notice={textContent:'Earlier status'},button={textContent:'Earlier button',disabled:false},state={rhythm:{version:1,synthetic:'Waiting partial bar'},other:{synthetic:'Untouched'}};
 let id=0,rendered=0;
 const sandbox={AbortController,Promise,state,render(){rendered++;},document:{querySelector:s=>hasMapPanel?(s==='[data-map-load-status]'?notice:s==='[data-map-refresh]'?button:null):null},
  setTimeout(fn,ms){const key=++id;timers.set(key,{fn,ms});return key;},clearTimeout(key){timers.delete(key);},
  fetch(url,options){return new Promise((resolve,reject)=>{calls.push({url,options,resolve,reject});options.signal.addEventListener('abort',()=>reject(Error('Synthetic map timeout')),{once:true});});}};
 vm.createContext(sandbox);vm.runInContext(loader+'\nglobalThis.probe={load:loadCurriculumMap,view:()=>({graph,graphLoading,graphLoad})};',sandbox);
 return {calls,timers,notice,button,state,probe:sandbox.probe,rendered:()=>rendered};
}
ok(!/await\s+fetch\(['"]\.\/marble-map\.json/.test(source.slice(0,start)+source.slice(end)),'map fetch awaits only inside the background helper');
ok(!/await\s+loadCurriculumMap\(/.test(source),'startup never awaits optional map readiness');
ok(source.includes('void loadCurriculumMap();'),'actual startup starts optional background load');
{
 const f=fixture(),before=structuredClone(f.state),first=f.probe.load(),second=f.probe.load();same(first,second,'simultaneous requests share one promise');eq(f.calls.length,0,'fetch starts in its scheduled microtask');ok(f.button.disabled);ok(f.notice.textContent.includes('loading'));
 await flush();eq(f.calls.length,1);eq(f.calls[0].url,'./marble-map.json');eq([...f.timers.values()].map(x=>x.ms),[10000],'bounded ten-second abort');ok(!f.calls[0].options.signal.aborted);
 f.calls[0].resolve({ok:true,json:async()=>realMap});await first;same(f.probe.view().graph,realMap,'real map retained as supplied');eq(f.probe.view().graphLoading,false);eq(f.probe.view().graphLoad,null);eq(f.button.textContent,'Show the map');eq(f.button.disabled,false);ok(f.notice.textContent.includes('ready'));eq(f.rendered(),0,'success never re-renders an activity');eq(f.state,before,'success never writes a notebook');eq(f.timers.size,0,'success clears timeout');
 ok(realMap.topics.length>0&&realMap.dependencies.length>0,'actual reference contains topics and edges');ok(typeof realMap.commit==='string'&&typeof realMap.totalTopics==='number','actual reference retains source metadata');
}
for(const kind of ['fetch-reject','non-ok','bad-json','bad-shape','empty-topics']){
 const f=fixture(),before=structuredClone(f.state),p=f.probe.load();await flush();
 if(kind==='fetch-reject')f.calls[0].reject(Error('Synthetic offline map'));
 else f.calls[0].resolve({ok:kind!=='non-ok',json:async()=>{if(kind==='bad-json')throw SyntaxError('Synthetic broken map JSON');return kind==='bad-shape'?{topics:[{}],dependencies:null}:kind==='empty-topics'?{topics:[],dependencies:[]}:realMap;}});
 await p;eq(f.probe.view().graph,null,kind+' keeps fallback available');eq(f.probe.view().graphLoading,false);eq(f.probe.view().graphLoad,null);ok(f.notice.textContent.includes('unavailable'));eq(f.button.textContent,'Try loading the map again');eq(f.button.disabled,false);eq(f.timers.size,0);eq(f.rendered(),0);eq(f.state,before);
 const retry=f.probe.load();await flush();eq(f.calls.length,2,'explicit retry starts a fresh request');f.calls[1].resolve({ok:true,json:async()=>realMap});await retry;same(f.probe.view().graph,realMap,'retry can recover actual map');eq(f.rendered(),0);eq(f.state,before);
}
{
 const f=fixture(),before=structuredClone(f.state),p=f.probe.load();await flush();const timeout=[...f.timers.values()][0];timeout.fn();await p;ok(f.calls[0].options.signal.aborted,'deadline actually aborts fetch');eq(f.probe.view().graph,null);eq(f.probe.view().graphLoading,false);eq(f.probe.view().graphLoad,null);eq(f.button.disabled,false);eq(f.state,before);eq(f.rendered(),0);eq(f.timers.size,0);
}
{
 const f=fixture({hasMapPanel:false}),before=structuredClone(f.state),p=f.probe.load();await flush();f.calls[0].resolve({ok:true,json:async()=>realMap});await p;same(f.probe.view().graph,realMap);eq(f.rendered(),0,'an absent map panel does not trigger rendering elsewhere');eq(f.state,before);
}
// A pending reference keeps ordinary first views neutral and all choices open.
const catalog=areas.flatMap(a=>a.activities.map(q=>q.id)).sort();
for(const mode of ['fresh','supported','independent']){
 const s=freshState();ensureBroad(s);
 if(mode!=='fresh')for(const a of areas){beginTrail(s,a.id);for(let i=0;i<2;i++){const q=trailQuestion(s,a.id);recordTrail(s,makeBroadObservation(q,{attempts:[q.answer],method:mode==='supported'?'together':'worked'},'checkin'));}}
 const before=structuredClone(s),homeNull=broadHome(s,null,()=>''),homeMap=broadHome(s,realMap,()=>''),hub=checkinHub(s);
 eq(homeNull,homeMap,mode+' Number Garden has the same seven open patches without map data');eq((homeNull.match(/class="area-card"/g)||[]).length,7);eq((hub.match(/data-trail="/g)||[]).length,7);ok(!/map is unavailable|map data is unavailable/i.test(homeNull+hub),'ordinary first views do not claim map failure');
 const libraryNull=activityLibrary(s,null),libraryMap=activityLibrary(s,realMap);
 for(const html of [libraryNull,libraryMap]){eq((html.match(/class="adventure-card"/g)||[]).length,catalog.length,mode+' all adventures stay available');eq([...new Set([...html.matchAll(/data-adventure="([^"]+)"/g)].map(x=>x[1]))].sort(),catalog,'suggestion refinement never removes a catalog choice');ok(!/map is unavailable|map data is unavailable/i.test(html));}
 for(const a of areas){
  const neutral=suggestActivity(s,a.id,null),ready=suggestActivity(s,a.id,realMap);eq(neutral.item.id,a.activities[mode==='fresh'?1:mode==='supported'?0:2].id,mode+' neutral same-area suggestion');ok(catalog.includes(ready.item.id),'loaded map suggestion is still an open catalog activity');
  const childReason=mode==='fresh'?'A new place to explore. Try this one.':mode==='supported'?'Next, try a smaller idea with Pip.':'Ready for something new? Try this one.';eq(neutral.childReason,childReason,'fallback child reason describes an invitation, not a map failure');
  const summaryNull=trailSummary(s,a.id,null),summaryMap=trailSummary(s,a.id,realMap);
  eq((summaryNull.match(/<p><strong>/g)||[]).length,mode==='fresh'?0:2,'summary shows only the existing two observations');eq((summaryNull.match(/<p><strong>/g)||[]).length,(summaryMap.match(/<p><strong>/g)||[]).length,'loading reference fabricates no summary observations');ok(summaryNull.includes('Choose any adventure')&&summaryMap.includes('Choose any adventure'),'every summary retains the open alternative');ok(!/map is unavailable|map data is unavailable/i.test(summaryNull+summaryMap));
 }
 eq(s,before,'null/ready views and recommendations do not fabricate or rewrite observations');
}
console.log(`Optional map startup: ${n} real-loader success, failure, retry, timeout and preservation checks passed.`);
