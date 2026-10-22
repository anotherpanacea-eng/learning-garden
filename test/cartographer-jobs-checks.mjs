import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {mapJobs,mapJobSource,validMapJobSource,mapJobFacts} from '../dist/cartographer-jobs.mjs';
import {mapView,validMapRound,startMap,startMapJob,setMapJobView,setMapPage,selectMapMark,placeMapMark,chooseMapEndpoint,appendMapMove,selectMapRoute,checkMapRoutes,mapCheckMatches,walkMap,addMapSupport} from '../dist/cartographer-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const expectedPlaces={post:{x:1,y:1},bridge:{x:4,y:1},cafe:{x:4,y:4},garden:{x:1,y:4}};
const jobs={sign:{from:'post',via:'bridge',to:'cafe',good:'eeennn',miss:'nnneee'},flowers:{from:'post',via:'garden',to:'cafe',good:'nnneee',miss:'eeennn'},notice:{from:'garden',via:'post',to:'bridge',good:'ssseee',miss:'eeesss'}};
const delta={n:[0,1],e:[1,0],s:[0,-1],w:[-1,0]};
// Independent step/event oracle, rather than asking the production predicate for expected answers.
function oracle(source,commands){let p={...expectedPlaces[source.from]},points=[{...p}],blocked=false;
 for(const command of commands){const d=delta[command],next={x:p.x+d[0],y:p.y+d[1]};if(next.x<0||next.x>5||next.y<0||next.y>5){blocked=true;break;}p=next;points.push({...p});}
 const stop=expectedPlaces[source.via],destination=expectedPlaces[source.to];let first=null;for(let i=0;i<points.length;i++)if(points[i].x===stop.x&&points[i].y===stop.y){first=i;break;}
 return {visited:first!==null,firstVisit:first,fulfilled:!blocked&&p.x===destination.x&&p.y===destination.y&&first!==null&&first<points.length-1};
}
for(const job of mapJobs){const source=mapJobSource(job.id),expected=jobs[job.id];ok(validMapJobSource(source));eq(source.places,expectedPlaces);for(const key of ['from','via','to'])eq(source[key],expected[key]);
 const good=walkMap(source.places[source.from],[...expected.good],source.places[source.to]),miss=walkMap(source.places[source.from],[...expected.miss],source.places[source.to]);eq(good.distance,6);eq(miss.distance,6);ok(good.arrived&&miss.arrived);eq(mapJobFacts(source,good),{visited:true,firstVisit:3,fulfilled:true});eq(mapJobFacts(source,miss),{visited:false,firstVisit:null,fulfilled:false},'same-distance arrival alone does not serve job');
 function visit(path){const result=walkMap(source.places[source.from],path,source.places[source.to]),before=structuredClone(result);eq(mapJobFacts(source,result),oracle(source,path),'all routes through six moves, including blocked prefixes, match independent event oracle');eq(result,before,'job check never rewrites travelled history');if(path.length<6)for(const d of ['n','e','s','w'])visit([...path,d]);}visit([]);
 const s=freshState(),r=startMapJob(s,job.id);r.a=[...expected.good];r.b=[...expected.miss];const c=checkMapRoutes(s);ok(c.bothArrived,'ordinary endpoint fact preserved');eq(c.relation,'equal');eq(c.job.a.fulfilled,true);eq(c.job.b.fulfilled,false);eq(c.job.source,source);ok(validMapRound(r));
 const snapshot=structuredClone(r);for(const view of ['map','dispatch','both']){ok(setMapJobView(s,view));eq(r.a,snapshot.a);eq(r.b,snapshot.b);eq(r.checks,snapshot.checks);ok(mapCheckMatches(r),'role visibility does not stale a route check');}
 eq(r.job.source,snapshot.job.source);eq(r.support,[],'role views do not infer help/partner performance');const before=structuredClone(s);eq(placeMapMark(s,2,2),'fixed-job');eq(s,before,'job map position edits refused without mutation');ok(!chooseMapEndpoint(s,'to','garden'));eq(s,before);ok(!setMapJobView(s,'hidden'));eq(s,before);
 c.job.a.visited=false;c.job.a.firstVisit=null;c.job.a.fulfilled=false;c.job.b.fulfilled=true;c.job.source.request='Earlier exact request wording';ok(validMapRound(r),'contradictory historical outcomes/wording remain readable');const kept=structuredClone(r.checks);mapView(s);eq(r.checks,kept,'view never regrades old job facts');ok(!mapCheckMatches(r),'different source input labels old check earlier without changing it');const next=checkMapRoutes(s);eq(next.job.a.fulfilled,true,'only explicit new check evaluates current route');eq(r.checks[0],kept[0]);
 const old=structuredClone(r),blank=startMap(s);eq(blank.job,undefined);eq(r,old,'new blank sheet leaves job and its results intact');selectMapMark(s,'post');eq(placeMapMark(s,0,0),'changed','ordinary free placement remains open');
}
{
 const source=mapJobSource('sign'),path=[...'nnneeesssnnn'];eq(path.length,12);eq(mapJobFacts(source,walkMap(source.places.post,path,source.places.cafe)),{visited:true,firstVisit:9,fulfilled:true},'early destination pass allowed before later stop and final delivery');
 const atStop=walkMap(source.places.post,[...'eee'],source.places.cafe);eq(mapJobFacts(source,atStop),{visited:true,firstVisit:3,fulfilled:false},'reaching stop without destination retains visit');
 const blocked=walkMap(source.places.post,[...'eeess'],source.places.cafe);ok(blocked.blocked!==null);eq(mapJobFacts(source,blocked),{visited:true,firstVisit:3,fulfilled:false},'blocked path preserves visited stop but never serves job');
 const edge=structuredClone(source);edge.places.bridge={x:5,y:1};edge.mapReaderText='Synthetic edge-stop map.';const edgeWalk=walkMap(edge.places.post,[...'eeeee'],edge.places.cafe);eq(mapJobFacts(edge,edgeWalk),{visited:true,firstVisit:4,fulfilled:false},'blocked prefix ending exactly at stop keeps actual visit');
 const s=freshState(),r=startMapJob(s,'sign');for(const command of path)eq(appendMapMove(s,command),'changed');eq(appendMapMove(s,'s'),'limit');eq(r.a,path);eq(checkMapRoutes(s).job.a.fulfilled,true);
}
{
 const s=freshState(),before=structuredClone(s);mapView(s);eq(s,before);eq(startMapJob(s,'unknown'),null);eq(s,before);ok(!setMapJobView(s,'map'));eq(s,before,'role view cannot invent a sheet');
 startMap(s);selectMapMark(s,'post');placeMapMark(s,1,1);selectMapMark(s,'cafe');placeMapMark(s,4,4);checkMapRoutes(s);const r=mapView(s).current;eq(r.job,undefined);eq(r.checks[0].job,undefined,'ordinary checks do not invent job facts');ok(mapCheckMatches(r));
}
{
 const s=freshState(),r=startMapJob(s,'sign');r.a=[...'eeennn'];r.b=[...'eeennn'];const c=checkMapRoutes(s);delete c.job;ok(validMapRound(r),'older check without job facts stays readable');ok(!mapCheckMatches(r),'missing historical job inputs do not masquerade as checked current job');const before=structuredClone(c);mapView(s);eq(c,before,'old arrival is never retrofitted with stop facts');
}
for(const malformed of [null,{version:99,original:'future job'},{version:1,source:{original:'unreadable'},view:'both'}]){
 const s=freshState(),r=startMapJob(s,'sign');r.job=structuredClone(malformed);const raw=structuredClone(r);eq(mapView(s).rounds.length,0);eq(mapView(s).earlier[0],raw);const next=startMapJob(s,'flowers');ok(next);eq(s.cartographer.rounds[0],raw,'unreadable job sheet retained beside new playable one');
}
{
 const s=freshState(),r=startMapJob(s,'sign');r.places.post={x:0,y:0};ok(!validMapRound(r),'active job input coherence uses its own source');const raw=structuredClone(r);startMap(s);eq(s.cartographer.rounds[0],raw,'incoherent sheet retained without reset');
}
{
 const s=freshState();s.cartographer={version:99,original:'future map root'};const before=structuredClone(s);eq(startMapJob(s,'sign'),null);ok(!setMapJobView(s,'both'));eq(s,before);
}
{
 const s=freshState();for(let i=0;i<12;i++)startMap(s);s.cartographer.rounds.splice(2,0,{id:50.5,raw:'earlier sheet'});const raw=structuredClone(s.cartographer.rounds[2]);const r=startMapJob(s,'sign');eq(r.id,51);eq(mapView(s).rounds.map(r=>r.id),[2,3,4,5,6,7,8,9,10,11,12,51],'one job start causes exactly one disclosed readable eviction');eq(s.cartographer.rounds.find(r=>r.id===50.5),raw);s.cartographer.rounds.push({id:Number.MAX_SAFE_INTEGER,raw:'exhausted'});const before=structuredClone(s);eq(startMapJob(s,'flowers'),null);eq(s,before,'unsafe new-job allocation does not patch or evict anything');ok(setMapJobView(s,'dispatch'),'existing job remains usable');
}
{
 const s=freshState(),r=startMapJob(s,'sign');r.job.extra='kept';r.job.source.extra={earlier:true};r.extra=[1,2];s.cartographer.extra=true;setMapPage(s,'route');addMapSupport(s,'audio');setMapJobView(s,'map');eq(r.job.extra,'kept');eq(r.job.source.extra,{earlier:true});eq(r.extra,[1,2]);eq(s.cartographer.extra,true);eq(mapJobSource('sign').extra,undefined,'catalog never mutated by saved work');
}
console.log(`Cartographer jobs core: ${n} assertions passed.`);
