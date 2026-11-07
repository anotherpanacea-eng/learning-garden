import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {writingTasks,taskSource} from '../dist/writing-table-content.mjs';
import * as c from '../dist/writing-table-core.mjs';
const clone=structuredClone,seed=()=>initializeExplorerState(freshState()),record=s=>c.writingView(s).record;
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(v,m)=>{assert.ok(v,m);checks++;};
// Independent examples transcribed from the reviewed finite material.
const fixtures=[
 ['voice-basket',{start:'basket',verb:'past',finish:'by-pip'},'The basket was carried by Pip.'],
 ['voice-bowls',{start:'bowls',verb:'plural',finish:'by-kittens'},'The bowls are washed by the kittens.'],
 ['voice-bell',{start:'dot',verb:'rang',finish:'bell'},'Dot rang the bell.'],
 ['voice-letters',{start:'letters',verb:'ongoing',finish:'by-dot'},'The letters are being sorted by Dot.'],
 ['voice-parcel',{start:'parcel',verb:'past',finish:'time'},'The parcel was moved before dinner.'],
 ['voice-wind',{start:'wind',verb:'scattered',finish:'seeds'},'Wind scattered the seeds.']
],ids=[...fixtures.map(f=>f[0]),'voice-busy','voice-truth'];
eq(writingTasks.length,52);eq(writingTasks.filter(t=>t.bench==='voice').map(t=>t.id),ids);
for(const id of ids){const s=taskSource(id),work=s.kind==='sort'?{placements:{}}:{choice:null};ok(c.validWritingSource(s));ok(c.validWritingWork(s,work));s.title='Detached synthetic title';eq(taskSource(id).title===s.title,false,'factory source detaches');}
for(const [id,key,sentence] of fixtures){
 const source=taskSource(id),base={placements:clone(key)},state=seed();eq(c.writingVoiceStudy(source),{status:'ready',study:source.spotlight});eq(source.key,key);eq(c.writingVoicePreview(source,base).text,sentence);eq(c.writingResult(source,base).outcome,'fit');
 eq(c.writingVoicePreview(source,{placements:{}}).text,'[Start] [Verb phrase] [Finish].');eq(c.writingVoicePreview(source,{placements:{verb:key.verb}}).text,`[Start] ${source.choices.find(x=>x.id===key.verb).text} [Finish].`,'later slot stays lowercase');
 ok(c.openWritingTask(state,id).ok);const empty=clone(record(state).work);ok(c.keepWritingTask(state).ok,'incomplete Keep requires no check');const first=clone(record(state).firstKept);
 for(const strip of ['start','verb','finish']){
  ok(c.setWritingMaterial(state,{strip,heading:key[strip]}).ok,'each of eighteen slot updates');eq(record(state).work.placements[strip],key[strip]);
  eq(c.setWritingMaterial(state,{strip,heading:key[strip]}),{ok:true,changed:false},'no-op');
 }
 eq(c.writingVoicePreview(source,record(state).work).text,sentence);ok(c.checkWritingTask(state).ok);ok(c.keepWritingTask(state).ok);eq(record(state).firstKept,first);eq(c.writingPreview(record(state).source,first.work)[0].text,'[Start] [Verb phrase] [Finish].');eq(c.writingPreview(record(state).source,record(state).latestKept.work)[0].text,sentence);
 const wrong=source.choices.find(x=>x.id!==key.start).id;ok(c.setWritingMaterial(state,{strip:'start',heading:wrong}).ok,'replacement');const result=c.writingResult(source,record(state).work);eq(result.outcome,'different');ok(result.feedback.includes(`Start: ${source.feedback.different.start}`));ok(!result.feedback.some(x=>x.includes('Under ')),'voice comparison never interpolates hidden key');
 ok(c.setWritingMaterial(state,{strip:'start',heading:null}).ok);eq(c.writingResult(source,record(state).work).outcome,'incomplete');eq(c.writingVoicePreview(source,record(state).work).complete,false);
 const duplicate={placements:{start:key.start,verb:key.start,finish:key.start}};ok(c.validWritingWork(source,duplicate));const preview=c.writingVoicePreview(source,duplicate);eq(preview.slots.map(s=>s.phraseId),[key.start,key.start,key.start],'unexpected duplicate remains literal');eq(preview.complete,true);eq(c.writingResult(source,duplicate).outcome,'different');
 const before=clone([source,base]);c.writingVoicePreview(source,base);c.writingResult(source,base);eq([source,base],before,'pure views');eq(c.writingVoicePreview(source,{placements:{unknown:'bad'}}),null);eq(empty,{placements:{start:null,verb:null,finish:null}});
}
const basket=taskSource('voice-basket');
for(const [id,verb] of [['voice-basket','now'],['voice-bowls','singular'],['voice-bell','rings'],['voice-letters','sorted']]){const s=taskSource(id),work={placements:{...s.key,verb}};eq(c.writingResult(s,work).outcome,'different','time/number contrasts');}
for(const [id,key] of [['voice-busy','no'],['voice-truth','wording']]){const s=taskSource(id);eq(c.writingVoiceStudy(s),{status:'absent'});for(const choice of s.choices)eq(c.writingResult(s,{choice:choice.id}).outcome,choice.id===key?'fit':'different');}
eq(c.writingVoiceStudy(taskSource('bakery')),{status:'absent'});
for(const kindId of ['quote-build','holding-parcel','break-noon']){const s=taskSource(kindId);s.bench='voice';eq(c.writingVoiceStudy(s).status,'unavailable');const st=seed();c.openWritingTask(st,kindId);record(st).source=s;eq(c.checkWritingTask(st).error,'unavailable');ok(c.keepWritingTask(st).ok);}
const historical=clone(basket);historical.id='earlier-voice';historical.parts.reverse();historical.choices.find(p=>p.id==='pip').text='  éclair';historical.choices.find(p=>p.id==='past').text='was carried';historical.choices.find(p=>p.id==='by-pip').text='by an earlier doer!';historical.key.start='pip';historical.spotlight.original='Earlier source starting sentence.';historical.feedback.fit='Earlier version fits its own brief.';historical.extra={future:true};historical.spotlight.extra={future:true};
eq(c.writingVoiceStudy(historical).status,'ready','history needs no canonical wording');const hw={placements:clone(historical.key),unknown:{opaque:[1,null]}};eq(c.writingVoicePreview(historical,hw).text,'  Éclair was carried by an earlier doer!');eq(c.writingVoicePreview(historical,hw).slots.map(s=>s.id),['start','verb','finish'],'packet order, not parts display order');eq(c.writingResult(historical,hw).feedback,['Earlier version fits its own brief.']);
for(const terminal of ['.','?','!']){const s=clone(historical);s.choices.find(p=>p.id==='by-pip').text='by an earlier doer'+terminal;eq(c.writingVoicePreview(s,hw).text,'  Éclair was carried by an earlier doer'+terminal);}
const inheritedPlacements={placements:Object.create({start:'basket'})};eq(c.writingVoicePreview(basket,inheritedPlacements).slots[0].phraseId,null,'inherited placements never fill blanks');
// Optional failures leave base work readable; no replacement with current factory metadata.
const malformed=[s=>delete s.spotlight,s=>s.spotlight=null,s=>s.spotlight.v=2,s=>delete s.spotlight.original,s=>s.spotlight.original=' ',s=>s.spotlight.context='x'.repeat(4001),s=>s.spotlight.slots=['verb','start','finish'],s=>s.spotlight.slots=['start',,'finish'],s=>s.spotlight.demo.steps=['one','two','three'],s=>s.spotlight.demo.steps=['one','two',,'four'],s=>delete s.spotlight.demo.contrast,s=>s.feedback.fit=' ',s=>s.feedback.general='',s=>delete s.feedback.different.start,s=>s.feedback.different.verb=' ',s=>s.parts[0].text=''];
for(const mutate of malformed){
 const s=clone(basket);mutate(s);ok(c.validWritingSource(s),'optional display cannot close ordinary source');eq(c.writingVoiceStudy(s).status,'unavailable');eq(c.writingVoicePreview(s,{placements:{}}),null);eq(c.writingResult(s,{placements:{}}),null);
 const st=seed();c.openWritingTask(st,basket.id);record(st).source=s;record(st).work.unknown={opaque:'preserved'};const before=clone(st);eq(c.checkWritingTask(st).error,'unavailable');eq(st,before);ok(c.keepWritingTask(st).ok,'unavailable study still Keepable');eq(record(st).source,s);ok(c.writingPreview(s,record(st).work).every(block=>block.heading==='Earlier phrase choices'));
}
for(const mutate of [s=>s.spotlight=Object.create(s.spotlight),s=>s.spotlight.demo=Object.create(s.spotlight.demo),s=>s.parts[0]=Object.create(s.parts[0]),s=>s.choices[0]=Object.create(s.choices[0]),s=>s.feedback=Object.create(s.feedback),s=>s.feedback.different=Object.create(s.feedback.different)]){const s=clone(basket);mutate(s);ok(c.validWritingSource(s));eq(c.writingVoiceStudy(s).status,'unavailable','display fields and key must be own');}
const inheritedKey=clone(basket);inheritedKey.key=Object.create(inheritedKey.key);eq(c.writingVoiceStudy(inheritedKey).status,'unavailable','inherited key targets unavailable');
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];ok(declaration,'actual Notes seam');const report=new Function('recommendations','explorerStore',`${declaration}; return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}}),pretty=s=>JSON.stringify(report(s),null,2),options={canExport:s=>prepareProgressImport(pretty(s)).ok};
const st=seed();st.unrelated={source:'synthetic parent'};ok(c.openWritingTask(st,'bakery',options).ok);const parent=clone(record(st));ok(c.openWritingTask(st,'voice-basket',options).ok);record(st).source=clone(historical);record(st).work=clone(hw);record(st).unknown={source:'opaque'};ok(c.showWritingHelp(st,'example',options).ok);ok(record(st).help.example,'example help recorded before presentation');ok(c.checkWritingTask(st,options).ok);ok(c.keepWritingTask(st,options).ok);const first=clone(record(st).firstKept);c.setWritingMaterial(st,{strip:'finish',heading:null},options);c.keepWritingTask(st,options);eq(record(st).firstKept,first);eq(record(st).latestKept.work.placements.finish,null);ok(!Object.hasOwn(first,'source'),'snapshots do not gain source');
record(st).source.spotlight={v:99,opaque:['retained']};record(st).work.spotlight={future:['opaque']};record(st).latestKept.unknown={saved:true};const raw=clone(st),restored=prepareProgressImport(pretty(st));ok(restored.ok);eq(restored.state.writingDesk,st.writingDesk,'actual Notes retains malformed optional source, opaque work, checks and snapshots');eq(st,raw);eq(restored.state.unrelated,st.unrelated);eq(restored.state.writingDesk.records.bakery,parent);
const denied={canExport:()=>false},before=clone(st);for(const f of [()=>c.setWritingMaterial(st,{strip:'start',heading:null},denied),()=>c.keepWritingTask(st,denied),()=>c.nextWritingTask(st,denied)]){eq(f().error,'unexportable');eq(st,before,'refused save preserves notebook');}
const nav=seed();c.openWritingTask(nav,'voice-basket');c.setWritingMaterial(nav,{strip:'start',heading:'pip'});const waiting=clone(record(nav));for(const id of ids.slice(1).concat(ids[0])){ok(c.nextWritingTask(nav).ok);eq(nav.writingDesk.currentId,id);}eq(record(nav),waiting,'return preserves waiting source and work');for(const [from,to] of [['quote-two','bakery'],['summary-lantern','summary-knock']]){c.openWritingTask(nav,from);c.nextWritingTask(nav);eq(nav.writingDesk.currentId,to);}
console.log(`Sentence Spotlight: ${checks} behavioral checks passed.`);
