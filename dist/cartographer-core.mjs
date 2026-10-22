import {mapJobSource,validMapJob,validMapJobCheck,mapJobFacts} from './cartographer-jobs.mjs';
import {marks,directions,pages} from './cartographer-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const positive=x=>Number.isSafeInteger(x)&&x>0;
const bounded=(x,n)=>Number.isInteger(x)&&x>=0&&x<=n;
const known=id=>marks.some(m=>m.id===id);
const codes=['help','audio','together','segments'];
const samePoint=(a,b)=>!!a&&!!b&&a.x===b.x&&a.y===b.y;
export const validMapPoint=p=>object(p)&&bounded(p.x,5)&&bounded(p.y,5);
export const emptyMapPlaces=()=>Object.fromEntries(marks.map(m=>[m.id,null]));
const validCommands=x=>Array.isArray(x)&&x.length<=12&&x.every(id=>directions.some(d=>d.id===id));
const validPlaces=x=>object(x)&&Object.entries(x).every(([id,p])=>known(id)&&(p===null||validMapPoint(p)))&&new Set(Object.values(x).filter(Boolean).map(p=>`${p.x},${p.y}`)).size===Object.values(x).filter(Boolean).length;
// Stored result fields are checked for readable shapes/ranges, never regraded on load.
const validResult=x=>object(x)&&validCommands(x.commands)&&Array.isArray(x.points)&&x.points.length>=1&&x.points.length<=13&&x.points.every(validMapPoint)&&bounded(x.steps,12)&&bounded(x.distance,12)&&(x.blocked===null||Number.isInteger(x.blocked)&&x.blocked>=1&&x.blocked<=12)&&typeof x.arrived==='boolean';
const validCheck=x=>object(x)&&validPlaces(x.places)&&known(x.from)&&known(x.to)&&x.from!==x.to&&validResult(x.a)&&validResult(x.b)&&['shorter','equal','longer'].includes(x.relation)&&typeof x.bothArrived==='boolean'&&typeof x.different==='boolean'&&(x.job===undefined||validMapJobCheck(x.job));
export function validMapRound(r){return object(r)&&positive(r.id)&&validPlaces(r.places)&&known(r.from)&&known(r.to)&&r.from!==r.to&&validCommands(r.a)&&validCommands(r.b)&&Array.isArray(r.support)&&r.support.length<=codes.length&&r.support.every(c=>codes.includes(c))&&new Set(r.support).size===r.support.length&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(validCheck)&&(r.job===undefined||validMapJob(r.job,r));}
export function mapView(state){
 const root=state.cartographer;
 const base={root,rounds:[],earlier:[],current:null,page:'map',mark:'post',side:'A'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!pages.includes(root.page)||!known(root.mark)||!['A','B'].includes(root.side)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],ids=new Set();
 for(const r of root.rounds){if(validMapRound(r)&&!ids.has(r.id)){rounds.push(r);ids.add(r.id);}else earlier.push(r);}
 return {status:'ready',root,rounds,earlier,current:rounds.find(r=>r.id===root.current)||rounds.at(-1)||null,page:root.page,mark:root.mark,side:root.side};
}
function newMap(state,source=null){
 const v=mapView(state);if(v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'map',mark:'post',side:'A',current:1,nextId:1,rounds:[]};
 let id=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;id=Math.max(id,Math.floor(r.id)+1);}
 if(!positive(id)||id>=Number.MAX_SAFE_INTEGER)return null;
 const r={id,places:source?structuredClone(source.places):emptyMapPlaces(),from:source?.from||'post',to:source?.to||'cafe',a:[],b:[],support:[],checks:[]};
 if(source)r.job={version:1,source:structuredClone(source),view:'both'};
 const drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));
 root.rounds=root.rounds.filter(r=>!drop.has(r));root.rounds.push(r);root.current=id;root.nextId=id+1;root.page='map';root.mark='post';root.side='A';state.cartographer=root;return r;
}
export const startMap=state=>newMap(state);
export function startMapJob(state,id){const source=mapJobSource(id);return source?newMap(state,source):null;}
export function setMapJobView(state,view){const r=mapView(state).current;if(!r?.job||!['map','dispatch','both'].includes(view))return false;r.job.view=view;return true;}
const active=state=>{const v=mapView(state);return v.status==='unavailable'?null:v.current||startMap(state);};
export function setMapPage(state,page){if(!pages.includes(page)||!active(state))return false;state.cartographer.page=page;return true;}
export function selectMapMark(state,id){if(!known(id)||!active(state))return false;state.cartographer.mark=id;return true;}
export function placeMapMark(state,x,y){
 if(!validMapPoint({x,y}))return 'invalid';const mark=mapView(state).mark,r=active(state);if(!r)return 'invalid';if(r.job)return 'fixed-job';state.cartographer.mark=mark;
 if(marks.some(m=>m.id!==mark&&samePoint(r.places[m.id],{x,y})))return 'occupied';
 if(samePoint(r.places[mark],{x,y}))return 'same';r.places[mark]={x,y};return 'changed';
}
export function chooseMapEndpoint(state,kind,mark){if(!['from','to'].includes(kind)||!known(mark))return false;const r=active(state);if(!r||r.job||r[kind==='from'?'to':'from']===mark)return false;r[kind]=mark;return true;}
export function selectMapRoute(state,side){if(!['A','B'].includes(side)||!active(state))return false;state.cartographer.side=side;return true;}
export function addMapSupport(state,code){if(!codes.includes(code))return false;const r=mapView(state).current;if(!r)return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function resumeMap(state,id){const v=mapView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function walkMap(start,commands,target){
 if(!validMapPoint(start)||!validCommands(commands))return null;
 const points=[{x:start.x,y:start.y}];let blocked=null;
 for(let i=0;i<commands.length;i++){
  const d=directions.find(d=>d.id===commands[i]),p=points.at(-1),next={x:p.x+d.dx,y:p.y+d.dy};
  if(!validMapPoint(next)){blocked=i+1;break;}points.push(next);
 }
 const steps=points.length-1;
 return {commands:[...commands],points,steps,distance:steps,blocked,arrived:blocked===null&&samePoint(points.at(-1),target)};
}
export function mapRoutes(r){const start=r.places[r.from],target=r.places[r.to];if(!start||!target)return null;return {a:walkMap(start,r.a,target),b:walkMap(start,r.b,target)};}
export function appendMapMove(state,id){
 if(!directions.some(d=>d.id===id))return 'invalid';const v=mapView(state),r=v.current;if(v.status!=='ready'||!r)return 'missing';const paths=mapRoutes(r);if(!paths)return 'missing';
 const side=v.side.toLowerCase();if(r[side].length>=12)return 'limit';if(paths[side].blocked!==null)return 'blocked';
 if(walkMap(r.places[r.from],[...r[side],id],r.places[r.to]).blocked!==null)return 'boundary';r[side].push(id);return 'changed';
}
export function removeMapMove(state,index){const v=mapView(state),r=v.current;if(v.status!=='ready'||!r||!Number.isInteger(index)||index<0||index>=r[v.side.toLowerCase()].length)return false;r[v.side.toLowerCase()].splice(index,1);return true;}
export function clearMapRoute(state){const v=mapView(state);if(v.status!=='ready'||!v.current)return false;v.current[v.side.toLowerCase()]=[];return true;}
export function checkMapRoutes(state){
 const r=mapView(state).current;if(!r)return null;const paths=mapRoutes(r);if(!paths)return null;
 const {a,b}=paths,check={places:structuredClone(r.places),from:r.from,to:r.to,a,b,relation:a.distance<b.distance?'shorter':a.distance>b.distance?'longer':'equal',bothArrived:a.arrived&&b.arrived,different:JSON.stringify(r.a)!==JSON.stringify(r.b)};
 if(r.job)check.job={source:structuredClone(r.job.source),a:mapJobFacts(r.job.source,a),b:mapJobFacts(r.job.source,b)};
 r.checks.push(check);r.checks=r.checks.slice(-8);return check;
}
export function mapCheckMatches(r){const c=r.checks.at(-1);return !!c&&((r.job===undefined&&c.job===undefined)||(!!r.job&&!!c.job&&JSON.stringify(r.job.source)===JSON.stringify(c.job.source)))&&r.from===c.from&&r.to===c.to&&marks.every(m=>r.places[m.id]==null&&c.places[m.id]==null||samePoint(r.places[m.id],c.places[m.id]))&&r.a.join(',')===c.a.commands.join(',')&&r.b.join(',')===c.b.commands.join(',');}
