// Spec286 synthetic retention and finite-copy oracles. No learner data.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import * as f from '../dist/feeding-board-core.mjs';
const copy=structuredClone;
export const feedingReport=s=>({title:'After the Storm: observations',exportedAt:'2026-10-28T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:recommendations(s),...s});
export const feedingCanExport=s=>prepareProgressImport(JSON.stringify(feedingReport(s),null,2)).ok;
const allow=()=>true;
export function feedingFixtures(){
 const base=initializeExplorerState(freshState());base.syntheticOther={payload:'x'.repeat(512000),raw:{version:99,note:'Synthetic unrelated raw sibling'}};
 const partial=copy(base);f.createFeedingBoard(partial,feedingCanExport);f.setSortDraft(partial,'rabbit','carnivore',feedingCanExport);f.checkSort(partial,'rabbit',feedingCanExport);f.setSortDraft(partial,'rabbit','herbivore',feedingCanExport);f.checkSort(partial,'rabbit',feedingCanExport);f.setSortDraft(partial,'cow','omnivore',feedingCanExport);
 const damaged=copy(partial);damaged.feedingBoard.sorts.push({caseId:'fox',future:'Synthetic unreadable observation'});
 const historical=copy(partial),a=historical.feedingBoard.source.animals.find(x=>x.id==='ladybird');a.name='Earlier larval beetle';a.scientificName='Earlier retained species';a.usualDiet='Earlier retained food note.';a.art={kind:'earlier-art',version:7,description:'Earlier larval beetle drawing.'};
 historical.feedingBoard.draft.sorts=historical.feedingBoard.draft.sorts.filter(x=>x.caseId!=='rabbit');
 const refusal=copy(partial);refusal.syntheticOther.payload='';const proposed=copy(refusal);f.noteFeedingSupport(proposed,'cow','source',allow);refusal.syntheticOther.payload='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(JSON.stringify(proposed,null,2))-32);
 return {base,partial,damaged,historical,refusal};
}
export function runFeedingBoardChecks(){
 let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
 const fresh=()=>{const s=feedingFixtures().base;ok(f.createFeedingBoard(s,feedingCanExport).ok,'explicit Start');return s;};
 const refused=(s,fn,m)=>{const before=copy(s),root=s.feedingBoard,other=s.syntheticOther,r=fn();ok(!r.ok,m);eq(s,before,'refusal is atomic');assert.equal(s.feedingBoard,root);assert.equal(s.syntheticOther,other);n+=2;return r;};
 const noop=(s,fn)=>{const before=copy(s),root=s.feedingBoard;const r=fn();eq([r.ok,r.changed],[true,false],'identity preserving no-op');eq(s,before);assert.equal(s.feedingBoard,root);n++;};
 const view=(s,id)=>f.feedingCaseView(s,id),record=(s,id)=>view(s,id).record;
 {const s=feedingFixtures().base,before=copy(s);eq(f.readFeedingBoard(s).status,'missing');eq(s,before,'entry is read-only');refused(s,()=>f.createFeedingBoard(s),'missing whole-report callback refuses');refused(s,()=>f.createFeedingBoard(s,()=>{throw Error('Synthetic report refusal');}));}
 const source=fresh().feedingBoard.source,md=readFileSync(new URL('../docs/content/286-feeding-board-text.md',import.meta.url),'utf8');
 const rows=md.split('\n').filter(x=>/^\| [a-z]+ \/ \*\*/.test(x)).map(x=>x.split('|').slice(1,-1).map(y=>y.trim()));
 eq(source.animals.length,14);eq(source.contrasts.length,4);eq(rows.length,14);
 const clean=x=>x.replaceAll('**','').replaceAll('*','');
 for(let i=0;i<14;i++){
  const a=source.animals[i],row=rows[i],identity=row[0].split(' / ');eq([a.id,a.name,a.scientificName],identity.map(clean));eq(a.foods.map(x=>x.label),clean(row[1]).split(' · '));eq(a.usualDiet,row[2].match(/\*\*(.*?)\*\*/)[1]);eq(a.art.description,clean(row[3]));
  const reply=md.split('\n').find(x=>x.startsWith('| '+a.name+' |')).split('|').slice(2,-1).map(x=>clean(x.trim()));
  eq(a.feedback.map(x=>x.text),reply.slice(0,3),'all three authored basket replies');eq(a.hint,reply[3]);
  for(const b of source.baskets){const s=fresh(),other=s.syntheticOther;ok(f.setSortDraft(s,a.id,b.id,feedingCanExport).ok);eq(s.feedingBoard.sorts,[],'draft is ungraded');ok(f.checkSort(s,a.id,feedingCanExport).ok);eq(record(s,a.id).first.outcome,b.id===a.basketId?'fits':'other');eq(record(s,a.id).first.feedbackCode,a.feedback.find(x=>x.basketId===b.id).code);assert.equal(s.syntheticOther,other);n++;}
 }
 eq(['herbivore','carnivore','omnivore'].map(id=>source.animals.filter(a=>a.basketId===id).length),[4,4,6]);
 eq(source.contrasts.map(c=>c.options.findIndex(o=>o.outcome==='fits')),[0,2,1,0]);
 for(const c of source.contrasts){const section=md.split('### '+c.id+' · ')[1].split('\n### ')[0].split('\n## ')[0];const authored=[...section.matchAll(/- ([abc]) \/ (fits|other)[^:]*: \*\*(.*?)\*\* Feedback: \*\*(.*?)\*\*/g)];eq(c.options.map(o=>[o.id,o.outcome,o.text,o.feedback]),authored.map(m=>m.slice(1)));for(const o of c.options){const s=fresh();ok(f.setIdeaDraft(s,c.id,o.id,feedingCanExport).ok);ok(f.checkIdea(s,c.id,feedingCanExport).ok);eq(record(s,c.id).first.outcome,o.outcome);eq(s.feedingBoard.sorts,[],'contrast never moves animals');}}
 {
  const s=fresh();refused(s,()=>f.checkSort(s,'rabbit',feedingCanExport),'Check requires a persisted draft');ok(f.setSortDraft(s,'rabbit','carnivore',feedingCanExport).ok);noop(s,()=>f.setSortDraft(s,'rabbit','carnivore',()=>{throw Error('No-op must not preflight');}));ok(f.checkSort(s,'rabbit',feedingCanExport).ok);const first=copy(record(s,'rabbit').first);eq(first.afterFeedback,false);eq(first.teachingBefore,false);eq(view(s,'rabbit').draftStatus,'checked');
  noop(s,()=>f.checkSort(s,'rabbit',()=>{throw Error('Unchanged check must not preflight');}));ok(f.noteFeedingTeaching(s,feedingCanExport).ok);ok(f.checkSort(s,'rabbit',feedingCanExport).ok);eq(record(s,'rabbit').checkCount,2);eq(record(s,'rabbit').latest.teachingBefore,true);eq(record(s,'rabbit').latest.afterFeedback,true);noop(s,()=>f.checkSort(s,'rabbit',allow));
  for(const flag of ['clue','example','source','narration','together']){ok(f.noteFeedingSupport(s,'rabbit',flag,feedingCanExport).ok);eq(record(s,'rabbit').first,first,'later support preserves first');ok(f.checkSort(s,'rabbit',feedingCanExport).ok);eq(record(s,'rabbit').latest.supportBefore[flag],true);}
  ok(f.setSortDraft(s,'rabbit','herbivore',feedingCanExport).ok);eq(view(s,'rabbit').draftStatus,'changed');eq(record(s,'rabbit').latest.basketId,'carnivore','moving draft preserves actual checked basket');ok(f.checkSort(s,'rabbit',feedingCanExport).ok);eq(record(s,'rabbit').first,first);eq(record(s,'rabbit').latest.outcome,'fits');eq(record(s,'rabbit').checkCount,8);
  record(s,'rabbit').checkCount=1e9;ok(f.setSortDraft(s,'rabbit','carnivore',feedingCanExport).ok);refused(s,()=>f.checkSort(s,'rabbit',feedingCanExport),'count cap refuses another changed check');ok(f.setSortDraft(s,'cow','herbivore',feedingCanExport).ok);ok(f.checkSort(s,'cow',feedingCanExport).ok,'cap isolates one case');
 }
 {
  const s=fresh();s.feedingBoard.source.animals=s.feedingBoard.source.animals.slice(0,1);s.feedingBoard.source.contrasts=[];s.feedingBoard.source.baskets=s.feedingBoard.source.baskets.slice(0,1);const a=s.feedingBoard.source.animals[0];a.feedback=a.feedback.slice(0,1);a.name='Earlier rabbit wording';a.art={kind:'future-original',version:7,description:'Earlier labelled drawing'};s.feedingBoard.source.helpers={teaching:null};ok(f.validFeedingSource(s.feedingBoard.source),'smaller coherent historical source and unknown art');ok(f.setSortDraft(s,'rabbit','herbivore',feedingCanExport).ok);ok(f.checkSort(s,'rabbit',feedingCanExport).ok);record(s,'rabbit').first.outcome='other';const before=copy(s);f.readFeedingBoard(s);eq(s,before,'literal historic outcomes never regraded');eq(record(s,'rabbit').first.outcome,'other');delete s.feedingBoard.draft;eq(view(s,'rabbit').draft,null,'old checked case has no manufactured draft');eq(view(s,'rabbit').draftStatus,'waiting');
 }
 {
  const s=feedingFixtures().damaged,raw=copy(s.feedingBoard.sorts[1]);ok(f.setSortDraft(s,'fox','omnivore',feedingCanExport).ok);refused(s,()=>f.checkSort(s,'fox',feedingCanExport),'unreadable record cannot be overwritten');ok(f.setSortDraft(s,'cow','herbivore',feedingCanExport).ok);ok(f.checkSort(s,'cow',feedingCanExport).ok);eq(s.feedingBoard.sorts[1],raw,'raw damage survives sibling writes');s.feedingBoard.support.push({caseId:'cow',clue:'future'});refused(s,()=>f.checkSort(s,'cow',feedingCanExport),'unreadable support blocks target check');refused(s,()=>f.noteFeedingSupport(s,'cow','source',feedingCanExport));ok(f.setSortDraft(s,'elephant','herbivore',feedingCanExport).ok);ok(f.checkSort(s,'elephant',feedingCanExport).ok);
  s.feedingBoard.ideas={future:'Synthetic raw section'};ok(f.setIdeaDraft(s,'large-small','a',feedingCanExport).ok);refused(s,()=>f.checkIdea(s,'large-small',feedingCanExport));ok(f.setSortDraft(s,'beaver','herbivore',feedingCanExport).ok);ok(f.checkSort(s,'beaver',feedingCanExport).ok);const before=copy(s);f.readFeedingBoard(s);eq(s,before);
 }
 {
  const s=fresh(),source=copy(s.feedingBoard.source);noop(s,()=>f.createFeedingBoard(s,()=>{throw Error('Existing source never recreated');}));eq(s.feedingBoard.source,source,'Start never refreshes frozen source');
  const a=s.feedingBoard.source.animals[0];a.feedback[0].outcome='other';a.feedback[1].outcome='fits';a.basketId='carnivore';a.feedback[1].text='Earlier retained supplied feedback.';a.feedback[1].code='earlier-reply';ok(f.setSortDraft(s,'rabbit','carnivore',feedingCanExport).ok);ok(f.checkSort(s,'rabbit',feedingCanExport).ok);eq(record(s,'rabbit').first.outcome,'fits','Check uses own frozen earlier key');eq(record(s,'rabbit').first.feedbackCode,'earlier-reply');
  refused(s,()=>f.setSortDraft(s,'rabbit','future-choice',feedingCanExport),'invalid choice retains draft and record');const raw=copy(s.feedingBoard);s.feedingBoard.source.animals=null;refused(s,()=>f.setSortDraft(s,'rabbit','herbivore',feedingCanExport),'unreadable source retained');eq(s.feedingBoard.sorts,raw.sorts);
 }
 for(const raw of [null,{kind:'feeding-board',version:99},'Synthetic future root']){const s=feedingFixtures().base;s.feedingBoard=raw;refused(s,()=>f.createFeedingBoard(s,feedingCanExport),'unsupported raw retained');}
 {
  const s=fresh();for(const fn of [()=>f.setSortDraft(s,'rabbit','carnivore',()=>false),()=>f.noteFeedingTeaching(s,()=>false),()=>f.noteFeedingSupport(s,'rabbit','source',()=>false)])refused(s,fn,'whole candidate preflight refuses');
  let whole;ok(f.setSortDraft(s,'rabbit','herbivore',candidate=>{whole=candidate;return feedingCanExport(candidate);}).ok);ok(whole.syntheticOther.payload.length===512000,'callback sees whole notebook');ok(whole!==s,'callback sees clone');refused(s,()=>f.checkSort(s,'rabbit',()=>false));
  const transfer=prepareProgressImport(JSON.stringify(feedingReport(s),null,2));ok(transfer.ok);eq(transfer.state.feedingBoard,s.feedingBoard);eq(transfer.state.syntheticOther,s.syntheticOther);
 }
 {
  const s=initializeExplorerState(freshState());s.syntheticOther={payload:''};const proposed=copy(s);ok(f.createFeedingBoard(proposed,allow).ok);const size=Buffer.byteLength(JSON.stringify(proposed,null,2));s.syntheticOther.payload='x'.repeat(MAX_IMPORT_BYTES-size-32);const raw=copy(s);ok(f.createFeedingBoard(raw,allow).ok);ok(recoveryFitsProgressLimits(raw),'raw post-Start fits');ok(!feedingCanExport(raw),'real metadata-bearing pretty report refuses');refused(s,()=>f.createFeedingBoard(s,feedingCanExport),'actual report-only boundary');
 }
 console.log(`Feeding Board: ${n} finite-copy, draft, retention and whole-notebook checks passed.`);return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runFeedingBoardChecks();
