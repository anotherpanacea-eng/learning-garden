import {marks} from './cartographer-content.mjs';
const town={post:{x:1,y:1},bridge:{x:4,y:1},cafe:{x:4,y:4},garden:{x:1,y:4}};
const mapReaderText='I have the town map. Post Office is at (1,1), Bridge at (4,1), Café at (4,4), and Garden at (1,4). Read across first, then up. North is up and east is right. Each move travels one interval.';
export const mapJobs=[
 {id:'sign',title:'Collect the market sign',request:'Start at Post Office. Collect the market sign at Bridge, then bring it to Café.',from:'post',via:'bridge',to:'cafe'},
 {id:'flowers',title:'Bring welcome flowers',request:'Start at Post Office. Collect the welcome flowers at Garden before taking them to Café.',from:'post',via:'garden',to:'cafe'},
 {id:'notice',title:'Carry the garden notice',request:'Start at Garden. Collect the notice at Post Office, then take it to Bridge.',from:'garden',via:'post',to:'bridge'},
];
export function mapJobSource(id){const job=mapJobs.find(x=>x.id===id);return job?{version:1,...structuredClone(job),mapReaderText,places:structuredClone(town)}:null;}
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),text=(x,max)=>typeof x==='string'&&x.length<=max;
const known=id=>marks.some(m=>m.id===id),point=p=>object(p)&&Number.isInteger(p.x)&&p.x>=0&&p.x<=5&&Number.isInteger(p.y)&&p.y>=0&&p.y<=5;
const samePoint=(a,b)=>!!a&&!!b&&a.x===b.x&&a.y===b.y;
export function validMapJobSource(s){
 return object(s)&&s.version===1&&typeof s.id==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(s.id)&&text(s.title,120)&&text(s.mapReaderText,800)&&text(s.request,600)&&object(s.places)&&Object.entries(s.places).every(([id,p])=>known(id)&&(p===null||point(p)))&&new Set(Object.values(s.places).filter(Boolean).map(p=>`${p.x},${p.y}`)).size===Object.values(s.places).filter(Boolean).length&&[s.from,s.via,s.to].every(id=>known(id)&&point(s.places[id]))&&new Set([s.from,s.via,s.to]).size===3;
}
export function validMapJob(job,round){
 return object(job)&&job.version===1&&validMapJobSource(job.source)&&['map','dispatch','both'].includes(job.view)&&round.from===job.source.from&&round.to===job.source.to&&marks.every(m=>round.places[m.id]==null&&job.source.places[m.id]==null||samePoint(round.places[m.id],job.source.places[m.id]));
}
const validFacts=f=>object(f)&&typeof f.visited==='boolean'&&(f.firstVisit===null||Number.isInteger(f.firstVisit)&&f.firstVisit>=0&&f.firstVisit<=12)&&typeof f.fulfilled==='boolean';
// Read historical booleans as recorded; do not derive them from old routes to admit a save.
export const validMapJobCheck=job=>object(job)&&validMapJobSource(job.source)&&validFacts(job.a)&&validFacts(job.b);
export function mapJobFacts(source,result){
 const last=result.points.length-1,index=result.points.findIndex(p=>samePoint(p,source.places[source.via]));
 const visited=index>=0,complete=result.blocked===null&&result.points.length===result.commands.length+1;
 return {visited,firstVisit:visited?index:null,fulfilled:complete&&samePoint(result.points.at(-1),source.places[source.to])&&visited&&index<last};
}
