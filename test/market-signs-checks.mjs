import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {marketSignsCollection} from '../dist/market-signs-content.mjs';
import * as c from '../dist/market-signs-core.mjs';
import {marketSignsPage,marketSignsNotes} from '../dist/market-signs-ui.mjs';
const copy=structuredClone;
export function signsSeed(){const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.syntheticOther={exact:['retained',false]};return s;}
export const signsReport=s=>({title:'After the Storm: observations',exportedAt:'2026-10-31T12:00:00.000Z',note:'Synthetic supplied sign practice.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:recommendations(s),...s});
const options={canExport:s=>prepareProgressImport(JSON.stringify(signsReport(s),null,2)).ok};
const choiceKeys={B1:'a',B2:'c',B3:'b',B4:'c',B6:'a',E1:'a',E3:'c',E4:'b'};
const matchKey={re:'again',pre:'before',un:'not',dis:'not',mis:'wrongly',anti:'against',auto:'self',super:'more'};
const wordOrder=['fig','flour','fresh','fudge'];
const supplied=['reopen','reuse','preheat','prepay','preview','unsold','unwrapped','unnamed','unnoticed','dislike','disobey','misprint','mislabel','misspell','antifreeze','autograph','autopilot','superstar','supermarket'];
const workFor=s=>s.kind==='choice'?{choice:choiceKeys[s.id]}:s.kind==='match'?{placements:copy(matchKey)}:{order:copy(wordOrder)};
export function fullSignsNotebook(){
 const s=signsSeed();c.openMarketBench(s,'prefix',options);
 for(const p of s.signs.source.prefix.prefixes)for(const b of s.signs.source.prefix.parts){c.setMarketPrefix(s,{prefixId:p.id},options);c.setMarketPrefix(s,{partId:b.id},options);c.keepMarketSign(s,options);}
 for(const id of [...Object.keys(choiceKeys),'B5','E2']){c.openMarketJob(s,id,options);const r=c.marketSignsView(s).record;r.work=workFor(r.source);for(let i=0;i<16;i++)c.checkMarketJob(s,options);c.keepMarketVersion(s,options);}
 return s;
}
export function runMarketSignsChecks(){
 let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
 const source=marketSignsCollection();eq(source.prefix.prefixes.length,8);eq(source.prefix.parts.length,19);ok(c.validMarketPrefix(source.prefix));
 const all=[];let cases=0;
 for(const p of source.prefix.prefixes)for(const b of source.prefix.parts){const d={prefixId:p.id,partId:b.id,kept:[]},r=c.marketPrefixResult(source.prefix,d),label=p.text+b.text;eq(r.label,label,'literal own-letter join');eq(r.kind,supplied.includes(label)?'supplied':'discovery','independent nineteen-word oracle');eq(r.boundary,['misspell','unnamed','unnoticed'].includes(label)?p.text.at(-1):null,'only supplied double-letter joins marked');all.push(label);cases++;}
 eq(cases,152);eq(source.prefix.joins.map(j=>source.prefix.prefixes.find(p=>p.id===j.prefixId).text+source.prefix.parts.find(b=>b.id===j.partId).text),supplied);ok(all.includes('review'),'real unlisted combination is still an open discovery');
 const book=c.marketBook(source.dictionary);eq(book.entries.length,34);eq(book.pages.map(p=>[p.entries[0].word,p.entries.at(-1).word]),[['fair','fudge'],['heard','honey'],['knife','knot'],['wall','world'],['wrap','wrong']]);const names=book.entries.map(e=>e.word);eq(names.map(x=>x.toLowerCase()),names.map(x=>x.toLowerCase()).sort(),'independent ASCII page order');
 const s=signsSeed(),other=copy(s.syntheticOther);ok(c.openMarketBench(s,'prefix',options).ok);ok(c.setMarketPrefix(s,{prefixId:'re'},options).ok);ok(c.setMarketPrefix(s,{partId:'view'},options).ok);ok(c.keepMarketSign(s,options).ok);const prefix=copy(s.signs.prefix);
 ok(c.openMarketBench(s,'dictionary',options).ok);eq(s.signs.dictionary.targetId,null,'no free default correct target');ok(!c.checkMarketPage(s,options).ok,'cannot check before choosing word');
 for(const entry of book.entries){ok(c.setMarketBook(s,{targetId:entry.id},options).ok);for(const page of book.pages){ok(c.setMarketBook(s,{pageId:page.id},options).ok);ok(c.checkMarketPage(s,options).ok);eq(s.signs.dictionary.last.outcome,page.id===entry.pageId?'fit':'different','all own entry/page cases');}}
 eq(s.signs.prefix,prefix,'book never clears waiting or kept signs');eq(s.syntheticOther,other,'other roots exact');const earlier=copy(s.signs.dictionary.last);c.setMarketBook(s,{targetId:'fresh'},options);eq(s.signs.dictionary.last,earlier,'page selection never rescored earlier result');
 eq(source.jobs.map(j=>j.id),['B1','B2','B3','B4','B5','B6','E1','E2','E3','E4']);
 for(const job of source.jobs){ok(c.validMarketJob(job),'authored source readable '+job.id);if(job.kind==='choice'){
  eq(job.key,choiceKeys[job.id],'independent choice key');const right=job.choices.find(x=>x.id===choiceKeys[job.id]);ok(!job.choices.every(x=>x.id===right.id||x.text.length<right.text.length),'answer not solely longest');for(const ch of job.choices){const r=c.marketJobResult(job,{choice:ch.id});eq(r.outcome,ch.id===choiceKeys[job.id]?'fit':'different');if(ch.id!==choiceKeys[job.id])ok(r.feedback.includes(job.different[ch.id]),'specific feedback retained');}eq(c.marketJobResult(job,{choice:null}).outcome,'incomplete');
 }else if(job.kind==='match'){
  eq(job.key,matchKey);eq(job.choices.length,7,'negative meaning shared');eq(c.marketJobResult(job,{placements:matchKey}).outcome,'fit');for(const p of job.parts)for(const dest of job.choices){const placements={...matchKey,[p.id]:dest.id};eq(c.marketJobResult(job,{placements}).outcome,dest.id===matchKey[p.id]?'fit':'different','all56 individual placements');}eq(c.marketJobResult(job,{placements:{un:'not',dis:'not'}}).outcome,'incomplete','shared destination allowed in partial work');
 }else{
  const permutations=a=>a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(b=>[v,...b])):[[]];for(const order of permutations(job.parts.map(p=>p.id)))eq(c.marketJobResult(job,{order}).outcome,JSON.stringify(order)===JSON.stringify(wordOrder)?'fit':'different','all24 word orders');
 }
 const state=signsSeed();ok(c.openMarketJob(state,job.id,options).ok);const record=c.marketSignsView(state).record;record.work=workFor(job);ok(c.checkMarketJob(state,options).ok);ok(record!==c.marketSignsView(state).record,'transaction owns a fresh root');const checked=c.marketSignsView(state).record.checks.at(-1);ok(checked.supported&&checked.guided,'supplied guided only');ok(c.keepMarketVersion(state,options).ok);const first=copy(c.marketSignsView(state).record.firstKept);c.showMarketHelp(state,'hint',options);c.keepMarketVersion(state,options);eq(c.marketSignsView(state).record.firstKept,first,'first keep never overwritten');
 }
 const historical=signsSeed();c.openMarketJob(historical,'B1',options);let old=c.marketSignsView(historical).record;old.source.key='c';old.source.prompt='Earlier supplied question, whose own choice c fits.';old.source.different.earlierUnused='Retained unused feedback.';const oldSource=copy(old.source);c.setMarketWork(historical,{choice:'c'},options);c.checkMarketJob(historical,options);eq(c.marketSignsView(historical).record.checks.at(-1).outcome,'fit','historical key is authoritative');eq(c.marketSignsView(historical).record.source,oldSource,'older wording and unused fields exact');
 historical.signs.source.jobs=historical.signs.source.jobs.filter(j=>j.id!=='B1');ok(c.marketSignsView(historical).record,'earlier job stays readable outside shelf');c.nextMarketJob(historical,options);eq(historical.signs.currentId,'B2','Earlier job Next starts first readable retained job');
 const absentDraft=signsSeed();c.openMarketBench(absentDraft,'dictionary',options);delete absentDraft.signs.dictionary;const readBefore=copy(absentDraft);const v=c.marketSignsView(absentDraft);eq(v.dictionaryDraft.targetId,null);eq(absentDraft,readBefore,'default presentation does not create draft');c.openMarketBench(absentDraft,'dictionary',options);ok(Object.hasOwn(absentDraft.signs,'dictionary'),'explicit same-view opening creates missing draft');
 absentDraft.signs.dictionary.targetId='missing-earlier-word';ok(c.setMarketBook(absentDraft,{targetId:'honey'},options).ok,'dangling target recoverable by explicit choice');const raw=copy(absentDraft);c.marketSignsView(absentDraft);eq(absentDraft,raw,'readers pure');
 const damaged=signsSeed();c.openMarketBench(damaged,'dictionary',options);damaged.signs.source.dictionary.pages[0].entries[0]={id:'fair',word:77};const broken=copy(damaged.signs.source.dictionary.pages[0].entries[0]);ok(c.setMarketBook(damaged,{targetId:'honey'},options).ok,'one malformed entry leaves other book words open');eq(damaged.signs.source.dictionary.pages[0].entries[0],broken);damaged.signs.records['future-job']={source:{v:99},work:{opaque:['kept']}};const sibling=copy(damaged.signs.records['future-job']);ok(c.openMarketJob(damaged,'E1',options).ok);eq(damaged.signs.records['future-job'],sibling,'unknown job sibling exact');
 for(const action of [x=>c.openMarketBench(x,'prefix',{canExport:()=>false}),x=>c.openMarketJob(x,'E2',{canExport:()=>{throw Error('synthetic refusal');}})]){const x=signsSeed(),before=copy(x);ok(!action(x).ok);eq(x,before,'failed preflight keeps full state');}
 const unknown=signsSeed();unknown.signs={v:99,opaque:['keep']};const unknownBefore=copy(unknown);ok(!c.openMarketBench(unknown,'prefix',options).ok);eq(unknown,unknownBefore,'unknown root never reset');
 const full=fullSignsNotebook();eq(full.signs.prefix.kept.length,152);eq(Object.keys(full.signs.records).length,10);ok(Object.values(full.signs.records).every(r=>r.checks.length===12&&r.count===16&&r.firstKept&&r.latestKept));const imported=prepareProgressImport(JSON.stringify(signsReport(full),null,2));ok(imported.ok,'maximum authored history imports through actual Notes format');eq(imported.state.signs,full.signs,'full frozen collection, drafts, histories and keeps transfer exact');
 for(const x of [signsSeed(),s,historical,absentDraft,damaged,unknown,full]){const unchanged=copy(x);const page=marketSignsPage(x,'synthetic'),notes=marketSignsNotes(x);ok(page.includes('Market Signs'),'real page renders each retained shape');ok(typeof notes==='string');eq(x,unchanged,'page and Notes readers preserve every root');}
 const altered=copy(historical);altered.signs.currentId='B1';altered.signs.view='practice';ok(marketSignsPage(altered,'synthetic').includes(oldSource.prompt),'real reader uses retained prompt, not current question');
 const partial=signsSeed();c.openMarketJob(partial,'B2',options);partial.signs.records.B2.firstKept={opaque:['earlier version']};const opaque=copy(partial.signs.records.B2.firstKept);ok(marketSignsPage(partial).includes('This earlier version stays in Notes'),'bad kept version contained');ok(c.setMarketWork(partial,{choice:'c'},options).ok,'current job editable beside bad version');eq(partial.signs.records.B2.firstKept,opaque,'bad version stays exact');
 const refused=copy(full),before=copy(refused);ok(!c.setMarketPrefix(refused,{clear:true},{canExport:()=>false}).ok);eq(refused,before,'refused real edit preserves maximum notebook');
 console.log(`Market Signs: ${n} checks passed (152 joins,170 page cases,56 matching placements,24 orders, saved sources and full Notes transfer).`);return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runMarketSignsChecks();
