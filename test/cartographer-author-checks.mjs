import assert from 'node:assert/strict';
import {validMapJobSource,validMapJobCheck} from '../dist/cartographer-jobs.mjs';
import {mapAuthorView,mapProblemPlan,mapAuthorOrigin} from '../dist/cartographer-author.mjs';
import {mapView,startMap,setMapAuthorOpen,chooseMapAuthor,startAuthoredMapJob,placeMapMark,selectMapMark,checkMapRoutes,mapCheckMatches,validMapRound,resumeMap} from '../dist/cartographer-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const square={post:{x:1,y:1},bridge:{x:4,y:1},cafe:{x:4,y:4},garden:{x:1,y:4}};
function setup(places=square){const s={},r=startMap(s);r.places=structuredClone(places);return {s,r};}
function draft(s,from='post',via='bridge',to='cafe'){ok(setMapAuthorOpen(s,true));for(const [field,value]of Object.entries({from,via,to}))ok(chooseMapAuthor(s,field,value));}
{
 const s={},before=structuredClone(s);eq(mapProblemPlan(null).status,'not-free');eq(startAuthoredMapJob(s),null);eq(setMapAuthorOpen(s,true),false);eq(s,before,'missing map cannot allocate through author controls');
 const r=startMap(s);const original=structuredClone(s);eq(mapProblemPlan(r).status,'missing-map');eq(setMapAuthorOpen(s,true),false);eq(chooseMapAuthor(s,'from','garden'),false);eq(startAuthoredMapJob(s),null);eq(s,original,'incomplete map refusal is nonmutating');
}
{
 const {s,r}=setup();const original=structuredClone(r),view=mapAuthorView(r);eq(view.status,'missing');eq(view.draft,{version:1,open:false,from:'post',via:'garden',to:'cafe'});mapProblemPlan(r);eq(r,original,'pure defaults/preview never add draft state');
 draft(s);r.a=[...'eeennn'];r.b=[...'nnneee'];checkMapRoutes(s);ok(mapCheckMatches(r));const routeCheck=structuredClone(r.checks[0]);chooseMapAuthor(s,'via','garden');ok(mapCheckMatches(r),'request drafting does not stale unrelated free-map route check');eq(r.checks[0],routeCheck);chooseMapAuthor(s,'via','bridge');
 const old=structuredClone(r),plan=mapProblemPlan(r);eq(plan.minimum,6);eq(plan.legs.map(l=>[l.horizontal,l.vertical,l.steps]),[[3,0,3],[0,3,3]]);eq(plan.request,'Start at Post Office. Collect a sealed parcel at Bridge, then deliver it to Café.');ok(validMapJobSource(plan.source));eq(plan.source.authored,{version:1,mapId:r.id});
 const job=startAuthoredMapJob(s);ok(job&&validMapRound(job));eq(job.id,2);eq(job.a,[]);eq(job.b,[]);eq(job.checks,[]);eq(job.support,[]);eq(job.job.view,'both');eq(s.cartographer.rounds[0],old,'creation retains full author map/routes/checks/draft');eq(s.cartographer.nextId,3,'one allocation');
 job.a=[...'eeennn'];job.b=[...'nnneee'];let checked=checkMapRoutes(s);eq(checked.job.a.fulfilled,true);eq(checked.job.b.fulfilled,false);eq(checked.job.b.visited,false);eq(checked.a.arrived,true);eq(checked.b.arrived,true,'arrival does not substitute for collection');
 job.b=[...'nnneeesssnnn'];checked=checkMapRoutes(s);eq(checked.job.b.fulfilled,true,'destination may be passed before collection and final delivery');eq(checked.job.b.firstVisit,9);eq(checked.b.steps,12);
 const frozen=structuredClone(job),check=structuredClone(checked);resumeMap(s,r.id);setMapAuthorOpen(s,false);selectMapMark(s,'bridge');eq(placeMapMark(s,5,0),'changed');chooseMapAuthor(s,'via','garden');eq(job,frozen,'changing original positions/draft never rewrites solving source/checks');eq(job.checks.at(-1),check);resumeMap(s,job.id);eq(setMapAuthorOpen(s,true),false,'author entry is only for free maps');
}
// Independent breadth-first grid distances, then every ordered triple of distinct positions.
const points=Array.from({length:36},(_,i)=>({x:i%6,y:Math.floor(i/6)})),dist=[];
for(let start=0;start<36;start++){
 const d=Array(36).fill(Infinity),queue=[start];d[start]=0;
 for(let q=0;q<queue.length;q++){const at=queue[q],p=points[at];for(const next of [{x:p.x+1,y:p.y},{x:p.x-1,y:p.y},{x:p.x,y:p.y+1},{x:p.x,y:p.y-1}])if(next.x>=0&&next.x<6&&next.y>=0&&next.y<6){const index=next.y*6+next.x;if(d[index]===Infinity){d[index]=d[at]+1;queue.push(index);}}}
 dist.push(d);
}
let triples=0;
for(let from=0;from<36;from++)for(let via=0;via<36;via++)for(let to=0;to<36;to++){
 if(new Set([from,via,to]).size!==3)continue;const fourth=points.findIndex((_,i)=>![from,via,to].includes(i));
 const r={id:1,from:'post',to:'cafe',places:{post:points[from],bridge:points[via],cafe:points[to],garden:points[fourth]},authorDraft:{version:1,open:true,from:'post',via:'bridge',to:'cafe'}};
 const plan=mapProblemPlan(r),expected=dist[from][via]+dist[via][to];eq(plan.minimum,expected,'creation lower bound agrees with independent grid search');eq(plan.status,expected<=12?'ready':'too-long');eq(!!plan.source,expected<=12,'infeasible requests never receive a creation source');if(plan.source)ok(validMapJobSource(plan.source));triples++;
}
eq(triples,42840);
for(const [places,minimum,allowed]of [
 [{post:{x:0,y:0},bridge:{x:5,y:5},cafe:{x:3,y:5},garden:{x:4,y:0}},12,true],
 [{post:{x:0,y:0},bridge:{x:5,y:5},cafe:{x:0,y:1},garden:{x:1,y:1}},19,false]
]){
 const {s,r}=setup(places);draft(s);eq(mapProblemPlan(r).minimum,minimum);const before=structuredClone(s),job=startAuthoredMapJob(s);eq(!!job,allowed);if(!allowed)eq(s,before,'over-limit creation cannot change drafts/maps or evict');else{job.a=[...'eeeeennnnnww'];const c=checkMapRoutes(s);eq(c.job.a.fulfilled,true);eq(c.a.steps,12);}
}
{
 const {s,r}=setup();draft(s);chooseMapAuthor(s,'via','post');const before=structuredClone(s);eq(mapProblemPlan(r).status,'distinct');eq(startAuthoredMapJob(s),null);eq(s,before,'duplicates can stay in draft without creating/erasing work');chooseMapAuthor(s,'via','bridge');ok(startAuthoredMapJob(s));
}
for(const raw of [null,'<script>earlier draft</script>',{version:99,from:'post'},{version:1,open:'earlier',from:'post',via:'bridge',to:'cafe'}]){
 const {s,r}=setup();r.authorDraft=structuredClone(raw);const before=structuredClone(s);eq(mapAuthorView(r).status,'unavailable');ok(validMapRound(r),'unsupported optional draft does not invalidate understood free map');eq(setMapAuthorOpen(s,true),false);eq(chooseMapAuthor(s,'via','garden'),false);eq(startAuthoredMapJob(s),null);eq(s,before);selectMapMark(s,'bridge');ok(['changed','same'].includes(placeMapMark(s,5,0)),'base map remains editable');
}
{
 const {s,r}=setup();draft(s);s.cartographer.rounds=Array.from({length:15},(_,i)=>({...structuredClone(r),id:i+1}));s.cartographer.current=1;s.cartographer.nextId=16;const raw={id:50,version:99,earlier:true};s.cartographer.rounds.push(raw);const before=structuredClone(s);mapProblemPlan(r);eq(s,before,'planning never trims oversized history');const job=startAuthoredMapJob(s);eq(job.id,51);eq(mapView(s).rounds.map(r=>r.id),[5,6,7,8,9,10,11,12,13,14,15,51]);ok(s.cartographer.rounds.includes(raw));eq(job.job.source.authored.mapId,1,'source reference remains even if disclosed cap evicts it');
}
{
 const {s,r}=setup();draft(s);s.cartographer.rounds.push({id:Number.MAX_SAFE_INTEGER,version:99});const before=structuredClone(s);eq(startAuthoredMapJob(s),null);eq(s,before,'failed allocation does not patch source or evict twice');
}
{
 const {s}=setup();draft(s);const job=startAuthoredMapJob(s);job.places={post:{x:0,y:0},bridge:{x:5,y:5},cafe:{x:0,y:1},garden:{x:1,y:1}};job.job.source.places=structuredClone(job.places);job.job.source.request='Earlier exact over-limit request.';job.job.source.authored={version:99,unknown:'retained'};ok(validMapRound(job),'new feasibility/origin rules do not revalidate old sources');job.a=[...'eeeee'];const c=checkMapRoutes(s);c.job.a.fulfilled=true;c.job.a.visited=false;c.job.a.firstVisit=null;ok(validMapJobCheck(c.job),'contradictory recorded outputs are shapes, not regraded truth');ok(validMapRound(job));eq(mapAuthorOrigin(job.job.source),{status:'unavailable',raw:job.job.source.authored});
}
eq(mapAuthorOrigin({}),{status:'missing'});eq(mapAuthorOrigin({authored:{version:1,mapId:4}}),{status:'ready',mapId:4});
console.log(`Map problem author core: ${n} assertions passed across ${triples} independent position triples.`);
