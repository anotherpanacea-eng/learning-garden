import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {areas} from '../dist/broad-content.mjs';
import {learningPlaces} from '../dist/learning-invitations.mjs';
import {readAtlas,atlasRoute,atlasRows,atlasTopic,isAtlasActivityRoute} from '../dist/grownup-atlas-core.mjs';
const root=new URL('../',import.meta.url),read=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const [catalog,source,dependencies,declarations]=await Promise.all(['dist/grownup-atlas.json','curriculum/marble/topics.json','curriculum/marble/dependencies.json','curriculum/atlas.json'].map(read));
assert.equal(readAtlas(catalog),catalog);
assert.deepEqual(catalog.source,Object.fromEntries(['commit','attribution','databaseLicense','contentLicense'].map(k=>[k,declarations.source[k]])));
assert.deepEqual(catalog.topics,source.topics.map(t=>({id:t.id,name:t.name,subject:t.subject,domain:t.domain})));
assert.deepEqual(catalog.edges,dependencies.dependencies.map(e=>({topicId:e.topicId,prerequisiteId:e.prerequisiteId,strength:e.strength})));
const games=new Map(declarations.games.map(g=>[g.id,g]));
const refs=[];
for(const area of areas){
 for(const q of area.checkin)refs.push({topicId:q.topicId,game:'numbers',kind:'authored-task',source:'dist/broad-content.mjs',route:`#checkin/${area.id}`,scope:`${q.title}: an authored ${area.name.toLowerCase()} task with variants/help. Task-specific answers do not establish full-topic coverage, independent recall or placement.`});
 for(const q of area.activities)refs.push({topicId:q.topicId,game:'numbers',kind:'authored-task',source:'dist/broad-content.mjs',route:`#adventure/${q.id}`,scope:`${q.title}: an authored ${area.name.toLowerCase()} task with variants/help. Task-specific answers do not establish full-topic coverage, independent recall or placement.`});
}
for(const p of learningPlaces)for(const t of p.topics)refs.push({topicId:t.id,game:p.id,kind:p.id==='water'?'explanation':'scoped-practice',source:'dist/learning-invitations.mjs',route:p.href,scope:t.scope});
refs.push(...declarations.manualReferences.map(r=>({...r,route:games.get(r.game).route})));
assert.deepEqual(catalog.references,refs.map(r=>({topicId:r.topicId,game:r.game,gameName:games.get(r.game).name,kind:r.kind,scope:r.scope,route:r.route,source:r.source})));
const bytes=await readFile(new URL('dist/grownup-atlas.json',root));
assert.equal(bytes.toString(),JSON.stringify(catalog)+'\n','Compact deterministic JSON');
assert.deepEqual(new Set(catalog.references.map(r=>r.kind)),new Set(['authored-task','scoped-practice','explanation']));
for(const route of new Set(catalog.references.map(r=>r.route)))assert.equal(isAtlasActivityRoute(route),true,route);

assert.equal(atlasRoute('#map'),null);assert.equal(atlasRoute('#atlas-other'),null);
assert.deepEqual(atlasRoute('#atlas'),{kind:'index'});
const first=catalog.topics[0];
assert.deepEqual(atlasRoute(`#atlas/${first.id}`),{kind:'topic',id:first.id});
assert.deepEqual(atlasRoute('#atlas/%6Dt_AzTrT5ySCx'),{kind:'topic',id:'mt_AzTrT5ySCx'});
for(const route of ['#atlas/','#atlas/%','#atlas/mt_x/y','#atlas/mt_x%2Fy','#atlas/mt_x%5Cy','#atlas/mt_x%252Fy','#atlas/MT_x','#atlas/mt_x?query=1','#atlas/mt_x#notes','#atlas/<script>'])assert.deepEqual(atlasRoute(route),{kind:'unknown'},route);
for(const route of ['javascript:alert(1)','https://example.com','#//evil','#cafe/../notes','#cafe/%2fnotes','#cafe?x=1','#cafe/<svg>','#checkin/not-real','#adventure/not-real','#adventure/number-foundation/extra'])assert.equal(isAtlasActivityRoute(route),false,route);

const all=atlasRows(catalog),linkedIds=new Set(refs.map(r=>r.topicId));
assert.equal(all.total,1590);assert.equal(all.rows.length,20);assert.equal(all.pages,80);assert.equal(all.subjects.length,8);assert.equal(all.domains.length,54);
assert.equal(atlasRows(catalog,{linkedOnly:true}).total,linkedIds.size);
assert.equal(atlasRows(catalog,{page:80}).rows.length,10);
assert.equal(atlasRows(catalog,{page:1000}).page,80);assert.equal(atlasRows(catalog,{page:-10}).page,1);
assert.equal(atlasRows(catalog,{query:'  '+first.id.toUpperCase()+'  '}).rows[0].id,first.id);
assert.equal(atlasRows(catalog,{query:'no matching source topic 108'}).total,0);
assert.equal(atlasRows(catalog,{query:'no matching source topic 108',page:900}).page,1);
assert.equal(atlasRows(catalog,{query:'x'.repeat(80)+'AI'}).total,0);
for(const subject of all.subjects){
 const expected=catalog.topics.filter(t=>t.subject===subject);
 const result=atlasRows(catalog,{subject});assert.equal(result.total,expected.length);
 assert(result.domains.every(d=>d.startsWith(subject+' / ')));
 for(const domain of result.domains){
  const filtered=atlasRows(catalog,{subject,domain,linkedOnly:true});
  assert.equal(filtered.total,expected.filter(t=>`${t.subject} / ${t.domain}`===domain&&linkedIds.has(t.id)).length);
 }
}
const ordered=catalog.topics.slice().sort((a,b)=>['subject','domain','name','id'].map(k=>a[k].localeCompare(b[k],'en')).find(n=>n!==0)||0);
assert.deepEqual(all.rows.map(t=>t.id),ordered.slice(0,20).map(t=>t.id));
assert.equal(atlasTopic(catalog,'mt_absent'),null);
for(const strength of ['hard','soft']){
 const edge=catalog.edges.find(e=>e.strength===strength);
 assert(atlasTopic(catalog,edge.topicId).buildsOn.some(n=>n.topic.id===edge.prerequisiteId&&n.strength===strength));
 assert(atlasTopic(catalog,edge.prerequisiteId).usedBy.some(n=>n.topic.id===edge.topicId&&n.strength===strength));
}
for(const topic of catalog.topics){
 const detail=atlasTopic(catalog,topic.id);
 assert.equal(detail.buildsOn.length,catalog.edges.filter(e=>e.topicId===topic.id).length);
 assert.equal(detail.usedBy.length,catalog.edges.filter(e=>e.prerequisiteId===topic.id).length);
 assert.deepEqual(detail.references,catalog.references.filter(r=>r.topicId===topic.id));
 const comparator=(a,b)=>a.topic.name.localeCompare(b.topic.name,'en')||a.topic.id.localeCompare(b.topic.id,'en');
 assert.deepEqual(detail.buildsOn,detail.buildsOn.slice().sort(comparator));assert.deepEqual(detail.usedBy,detail.usedBy.slice().sort(comparator));
}
const malformed=change=>{const copy=structuredClone(catalog);change(copy);assert.equal(readAtlas(copy),null);};
for(const value of [null,[],{},'text',1])assert.equal(readAtlas(value),null);
for(const mutate of [c=>c.version=2,c=>c.source.commit='other',c=>c.source.databaseLicense='MIT',c=>c.source.attribution='',c=>c.topics.pop(),c=>c.edges.pop(),c=>c.topics[1].id=c.topics[0].id,c=>c.topics[0].id='mt_bad/id',c=>c.topics[0].description='unreviewed',c=>c.topics[0].name='',c=>c.edges[0].topicId='mt_absent',c=>c.edges[0].prerequisiteId=c.edges[0].topicId,c=>c.edges[0].strength='required',c=>c.edges[1]={...c.edges[0]},c=>c.edges[0].reason='raw',c=>c.references[0].topicId='mt_absent',c=>c.references[0].kind='mastered',c=>c.references[0].scope=' ',c=>c.references[0].route='javascript:alert(1)',c=>c.references[0].route='#checkin/not-real',c=>c.references[0].source='../secret',c=>c.references[0].gameName=null,c=>c.references[0].answer='private'])malformed(mutate);
malformed(c=>{const [a,b]=c.topics;c.edges[0]={topicId:a.id,prerequisiteId:b.id,strength:'hard'};c.edges[1]={topicId:b.id,prerequisiteId:a.id,strength:'soft'};});
// Source text is data: rendering must escape it, rather than silently changing names/scopes.
const hostile=structuredClone(catalog);hostile.topics[0].name='<img src=x onerror=alert(1)>';hostile.references[0].scope='<svg onload=alert(1)>';
assert.equal(readAtlas(hostile),hostile);assert.equal(atlasTopic(hostile,hostile.topics[0].id).topic.name,hostile.topics[0].name);
const preserved=['curriculum/topic-coverage.csv','docs/learning-atlas.md','dist/marble-map.json'];
const before=await Promise.all(preserved.map(p=>readFile(new URL(p,root))));
const check=spawnSync(process.execPath,['scripts/build-learning-atlas.mjs','--check'],{cwd:root,encoding:'utf8'});
assert.equal(check.status,0,check.stderr||check.stdout);
for(let i=0;i<preserved.length;i++)assert.deepEqual(await readFile(new URL(preserved[i],root)),before[i],preserved[i]);
console.log(`Grown-up atlas checks passed: exact source projection, ${refs.length} references, ${linkedIds.size} linked topics, routing, validation, filters and direct edges; ${bytes.length} JSON bytes.`);
