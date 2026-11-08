import {areas} from './broad-content.mjs';
// Curriculum-only helpers. No notebook, storage, navigation or network access.
const pin='96a7933754af672e1bfdbf7ecb05c325860c6e0d';
const attribution='Marble Skill Taxonomy (v1) © Generative Spark, Inc. (Marble), https://withmarble.com';
const idPattern=/^mt_[A-Za-z0-9_-]+$/;
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const keys=(value,names)=>object(value)&&Object.keys(value).length===names.length&&names.every(name=>Object.hasOwn(value,name));
const text=value=>typeof value==='string'&&value.trim().length>0;
const compare=(a,b)=>a.localeCompare(b,'en');
const topicOrder=(a,b)=>compare(a.subject,b.subject)||compare(a.domain,b.domain)||compare(a.name,b.name)||compare(a.id,b.id);
const neighborOrder=(a,b)=>compare(a.topic.name,b.topic.name)||compare(a.topic.id,b.topic.id);

// Strict local hash syntax only; destination reachability is checked against the
// actual app in the build's route audit, rather than a second router registry.
export function isAtlasActivityRoute(route){
 if(typeof route!=='string'||!/^#[a-z][a-z0-9-]*(?:\/[a-z0-9][a-z0-9_-]*)*$/.test(route))return false;
 const [root,id,...extra]=route.slice(1).split('/');
 if(root==='checkin')return !extra.length&&areas.some(a=>a.id===id);
 if(root==='adventure')return !extra.length&&areas.some(a=>a.activities.some(q=>q.id===id&&q.lesson));
 return true;
}

export function atlasRoute(hash){
 if(typeof hash!=='string'||!(hash==='#atlas'||hash.startsWith('#atlas/')))return null;
 if(hash==='#atlas')return {kind:'index'};
 let id;try{id=decodeURIComponent(hash.slice(7));}catch{return {kind:'unknown'};}
 return idPattern.test(id)?{kind:'topic',id}:{kind:'unknown'};
}

export function readAtlas(value){
 if(!keys(value,['version','source','topics','edges','references'])||value.version!==1)return null;
 const s=value.source;
 if(!keys(s,['commit','attribution','databaseLicense','contentLicense'])||s.commit!==pin||s.attribution!==attribution||s.databaseLicense!=='ODbL-1.0'||s.contentLicense!=='CC-BY-SA-4.0')return null;
 if(!Array.isArray(value.topics)||value.topics.length!==1590||!Array.isArray(value.edges)||value.edges.length!==3221||!Array.isArray(value.references))return null;
 const ids=new Set(),subjects=new Set(),domains=new Set();
 for(const t of value.topics){
  if(!keys(t,['id','name','subject','domain'])||typeof t.id!=='string'||!idPattern.test(t.id)||ids.has(t.id)||![t.name,t.subject,t.domain].every(text))return null;
  ids.add(t.id);subjects.add(t.subject);domains.add(`${t.subject} / ${t.domain}`);
 }
 if(subjects.size!==8||domains.size!==54)return null;
 const seen=new Set(),degree=new Map([...ids].map(id=>[id,0])),dependents=new Map([...ids].map(id=>[id,[]]));
 for(const e of value.edges){
  if(!keys(e,['topicId','prerequisiteId','strength'])||!ids.has(e.topicId)||!ids.has(e.prerequisiteId)||e.topicId===e.prerequisiteId||!['hard','soft'].includes(e.strength))return null;
  const key=`${e.topicId}>${e.prerequisiteId}`;if(seen.has(key))return null;seen.add(key);
  degree.set(e.topicId,degree.get(e.topicId)+1);dependents.get(e.prerequisiteId).push(e.topicId);
 }
 const queue=[...ids].filter(id=>degree.get(id)===0);
 for(let i=0;i<queue.length;i++)for(const child of dependents.get(queue[i])){degree.set(child,degree.get(child)-1);if(degree.get(child)===0)queue.push(child);}
 if(queue.length!==ids.size)return null;
 for(const r of value.references){
  if(!keys(r,['topicId','game','gameName','kind','scope','route','source'])||!ids.has(r.topicId)||![r.game,r.gameName,r.scope].every(text)||!['authored-task','scoped-practice','explanation'].includes(r.kind)||!isAtlasActivityRoute(r.route)||typeof r.source!=='string'||!/^(?:[A-Za-z0-9_-]+\/)+[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(r.source))return null;
 }
 return value;
}

export function atlasRows(catalog,filters={}){
 const query=String(filters.query??'').trim().slice(0,80).toLocaleLowerCase('en');
 const subjects=[...new Set(catalog.topics.map(t=>t.subject))].sort(compare);
 const domains=[...new Set(catalog.topics.filter(t=>!filters.subject||t.subject===filters.subject).map(t=>`${t.subject} / ${t.domain}`))].sort(compare);
 const counts=new Map();for(const r of catalog.references)counts.set(r.topicId,(counts.get(r.topicId)||0)+1);
 const matches=catalog.topics.filter(t=>(!query||t.name.toLocaleLowerCase('en').includes(query)||t.id.toLocaleLowerCase('en').includes(query))&&(!filters.subject||t.subject===filters.subject)&&(!filters.domain||`${t.subject} / ${t.domain}`===filters.domain)&&(!filters.linkedOnly||counts.has(t.id))).sort(topicOrder);
 const pages=Math.max(1,Math.ceil(matches.length/20));
 const requested=Number.isFinite(Number(filters.page))?Math.floor(Number(filters.page)):1;
 const page=Math.max(1,Math.min(pages,requested));
 return {rows:matches.slice((page-1)*20,page*20).map(t=>({...t,linked:counts.has(t.id),referenceCount:counts.get(t.id)||0})),total:matches.length,totalTopics:catalog.topics.length,page,pages,subjects,domains};
}

export function atlasTopic(catalog,id){
 const byId=new Map(catalog.topics.map(t=>[t.id,t])),topic=byId.get(id);if(!topic)return null;
 const buildsOn=[],usedBy=[];
 for(const e of catalog.edges){if(e.topicId===id)buildsOn.push({topic:byId.get(e.prerequisiteId),strength:e.strength});if(e.prerequisiteId===id)usedBy.push({topic:byId.get(e.topicId),strength:e.strength});}
 return {topic,references:catalog.references.filter(r=>r.topicId===id),buildsOn:buildsOn.sort(neighborOrder),usedBy:usedBy.sort(neighborOrder)};
}
