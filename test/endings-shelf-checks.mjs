// Independent spec331 keys, supplied examples, recovery and real Notes preflight.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {makeEndingsShelfSource} from '../dist/endings-shelf-content.mjs';
import * as E from '../dist/endings-shelf-core.mjs';
import * as S from '../dist/stained-map-core.mjs';
import {endingsShelfPage} from '../dist/endings-shelf-ui.mjs';
const clone=structuredClone;
const key={precious:'cious',official:'cial',essential:'tial',significant:'ant',possible:'ible',cautious:'tious',comfortable:'able'};
const jobKey={b1:'spacious',b2:'cautious',b3:'partial',b4:'magnificent',b5:'dependable',b6:'terribly'};
const report=s=>({title:'After the Storm: observations',note:'Synthetic spelling source checks.',exportedAt:'2026-10-31T12:00:00.000Z',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic report'},...s});
export const canExportEndings=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const options={canExport:canExportEndings},fresh=()=>initializeExplorerState(freshState());
export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},yes=r=>ok(r.ok,JSON.stringify(r));
 const refused=(s,fn)=>{const before=clone(s);eq(fn().ok,false);eq(s,before,'refusal is atomic across the whole notebook');};
 const open=()=>{const s=fresh();yes(E.openEndingsTable(s,'letter',options));return s;};
 const fill=s=>{for(const [id,ending] of Object.entries(key))yes(E.placeEndingsWord(s,id,ending,options));};
 const source=makeEndingsShelfSource(),copy=source.copy;
 eq(Object.fromEntries(source.letter.gaps.map(g=>[g.id,g.key])),key);
 eq(Object.fromEntries(source.jobs.map(j=>[j.id,j.key])),jobKey);
 eq(source.letter.gaps.map(g=>g.note),[
  'Precious is one to learn by heart.',
  'Office ends in -ce, and i before the ending is a vowel letter.',
  'The letter before the ending is n, a consonant letter. After a consonant letter, -tial is common.',
  'Here the c is hard, like cat. Significant ends in -ant.',
  'Possible is one of the -ible words to remember.',
  'Caution is in the family, so -tious is likely.',
  'Comfort is a whole word, so -able is likely.'
 ]);
 eq(source.cards.find(c=>c.id==='card-7').text,'In significant and elegant, hard c and g go with -ant. After soft c or g, -ent is usual. Some words need a dictionary.');
 eq(source.cards.find(c=>c.id==='card-8').text,'A familiar whole word can help: comfort becomes comfortable. Many other words use -ible, such as visible. These are clues, with exceptions.');
 eq(source.cards.find(c=>c.id==='card-10').text,'For these -able and -ible words, change the final e to y: comfortable becomes comfortably; terrible becomes terribly.');

 eq(source.jobs.map(j=>j.choices.findIndex(c=>c.id===j.key)),[1,0,2,1,0,2]);
 for(const j of source.jobs)eq(j.copy,{incomplete:copy.jobIncomplete,partDifferent:copy.neutral});
 eq(source.jobs.map(j=>j.teach[0].id),['card-5','card-5-tious','card-6','card-7','card-8','card-10']);
 eq(source.jobs[3].parts.map(p=>p.text),['The c in this word sounds soft, as in city.']);
 eq(source.jobs[0].steps,['The root is space.','It ends in -ce.','Swap -ce for -cious.']);
 eq(source.jobs[1].teach[0].steps,['Ambition is in the word family.','A -tion family is a clue: -tious is usual.','Ambitious.']);
 eq(source.pairs.map(p=>[p.front,p.back]),[['observant','observance'],['innocent','innocence'],['reasonable','reasonably'],['visible','visibly']]);
 eq(source.cards.at(-1).title,'From -able/-ible to -ably/-ibly');
 ok(!JSON.stringify(source.story).includes('offitial')&&!JSON.stringify(source.story).includes('precioss'),'story never narrates written trial choices');
 eq(source.story.longer[0],'"Dear friends upstream," the librarian reads aloud. "We have a precious map of our valley. It is not official, but it is essential to us."');
 const other=makeEndingsShelfSource();other.letter.gaps[0].note='Synthetic changed note';eq(makeEndingsShelfSource(),source,'factory produces independent sources');
 {
  const s=fresh(),before=clone(s);eq(E.endingsShelfView(s).status,'new');eq(s,before,'arrival lookup is pure');
  yes(E.openEndingsTable(s,'pairs',options));ok(!Object.hasOwn(s.endingsShelf,'letter')&&!Object.keys(s.endingsShelf.items).length,'pairs create no assessed work');
  const held=clone(s);eq(E.endingsShelfView(s).pairs.length,4);eq(s,held,'pair lookup remains pure');
 }
 // Every actual tray choice/null, literal strings and exact mismatch feedback.
 for(const g of source.letter.gaps){const choices=source.letter.trays.find(t=>t.id===g.trayId).choices;
  for(const choice of [null,...choices]){
   const s=open();yes(E.placeEndingsWord(s,g.id,choice?.id??null,options));const l=E.endingsShelfView(s).letter.source;
   eq(E.endingsWord(l,l.parts.find(p=>p.id===g.id),choice),g.prefix+(choice?.text??'[ending]'));
   const result=E.checkEndingsLetter(s,options);yes(result);eq(result.outcome,'incomplete');
   eq(result.feedback,choice&&choice.id!==key[g.id]?[copy.incomplete,g.prefix+'[ending]: '+g.different]:[copy.incomplete]);
  }
 }
 {
  const s=open();yes(E.keepEndingsLetter(s,options));const first=clone(s.endingsShelf.letter.firstKept);eq(first.check,null);
  fill(s);yes(E.checkEndingsLetter(s,options));eq(E.endingsShelfView(s).letter.last.feedback,["This version fits the letter's notes."]);yes(E.keepEndingsLetter(s,options));const latest=clone(s.endingsShelf.letter.latestKept);eq(s.endingsShelf.letter.firstKept,first);
  yes(E.placeEndingsWord(s,'precious','tious',options));eq(E.endingsShelfView(s).letter.earlier,true);yes(E.checkEndingsLetter(s,options));eq(E.endingsShelfView(s).letter.last.feedback,[copy.different,'pre[ending]: Precious is one to learn by heart.']);
  yes(E.openEndingsTable(s,'pairs',options));yes(E.openEndingsTable(s,'letter',options));eq(E.endingsShelfView(s).letter.earlier,false,'selection-only return preserves check scope');
  yes(E.restoreEndingsLetter(s,'latest',options));eq(s.endingsShelf.letter.work.placements,key);eq(s.endingsShelf.letter.latestKept,latest);yes(E.restoreEndingsLetter(s,'first',options));eq(s.endingsShelf.letter.work,first.work);
 }
 for(const j of source.jobs){
  const s=fresh();yes(E.openEndingsJob(s,j.id,options));yes(E.checkEndingsJob(s,j.id,options));eq(s.endingsShelf.items[j.id].checks.at(-1).feedback,[copy.jobIncomplete]);
  yes(E.keepEndingsJob(s,j.id,options));const first=clone(s.endingsShelf.items[j.id].firstKept);
  for(const c of j.choices){yes(E.answerEndingsJob(s,j.id,c.id,options));yes(E.checkEndingsJob(s,j.id,options));const result=s.endingsShelf.items[j.id].checks.at(-1);eq(result.outcome,c.id===jobKey[j.id]?'fit':'different');eq(result.feedback,c.id===jobKey[j.id]?[j.explanation]:[j.different[c.id]??copy.neutral,j.explanation]);eq([result.supported,result.guided],[true,true]);}
  yes(E.useEndingsHelp(s,j.id,'hint',options));yes(E.useEndingsHelp(s,j.id,'example',options));yes(E.restoreEndingsJob(s,j.id,'first',options));eq(s.endingsShelf.items[j.id].help,{hint:true,example:true});eq(s.endingsShelf.items[j.id].firstKept,first);
 }
 // A damaged source address is not a replacement answer or a reason to discard its raw placement.
 {
  const s=open();fill(s);s.endingsShelf.source.letter.gaps.push({...source.letter.gaps[0],note:17});
  s.endingsShelf.letter.work.placements.precious={future:['Synthetic raw value']};s.endingsShelf.letter.work.placements.retired={raw:'Synthetic earlier gap'};
  const opaque=clone(s.endingsShelf.letter.work.placements);let v=E.endingsShelfView(s);eq(v.letter.source.parts.length,6);eq(v.letter.source.partial,true);eq(v.letter.source.segments.filter(x=>x.unavailable).length,1);
  yes(E.checkEndingsLetter(s,options));eq(s.endingsShelf.letter.checks.at(-1).feedback,[copy.partialFit,copy.partial]);yes(E.keepEndingsLetter(s,options));
  yes(E.placeEndingsWord(s,'official','tial',options));yes(E.checkEndingsLetter(s,options));eq(s.endingsShelf.letter.checks.at(-1).feedback,[copy.different,'offi[ending]: '+source.letter.gaps[1].different,copy.partial]);
  s.endingsShelf.letter.work.placements.retired={raw:'Synthetic current opaque value'};yes(E.restoreEndingsLetter(s,'latest',options));eq(s.endingsShelf.letter.work.placements.retired,{raw:'Synthetic current opaque value'});eq(s.endingsShelf.letter.work.placements.precious,opaque.precious);eq(s.endingsShelf.letter.work.placements.official,'cial');eq(s.endingsShelf.letter.latestKept.work.placements.retired,opaque.retired);
  refused(s,()=>E.placeEndingsWord(s,'precious','cious',options));
  s.endingsShelf.source.letter.gaps=[];refused(s,()=>E.checkEndingsLetter(s,options));yes(E.openEndingsJob(s,'b1',options));
 }
 {
  const s=open();s.endingsShelf.source.letter.gaps=[...source.letter.gaps.slice(0,2)].reverse();s.endingsShelf.source.letter.segments=[{gapId:'official'},{text:' then '},{gapId:'precious'}];s.endingsShelf.source.letter.gaps[0].key='tial';s.endingsShelf.source.copy.empty='[old gap]';
  yes(E.placeEndingsWord(s,'official','tial',options));yes(E.placeEndingsWord(s,'precious','cious',options));yes(E.checkEndingsLetter(s,options));eq(E.endingsShelfView(s).letter.last.outcome,'fit','old own key and count are usable');
  const checks=clone(s.endingsShelf.letter.checks);s.endingsShelf.source.letter.gaps[0].key='cial';eq(E.endingsShelfView(s).letter.last.outcome,'fit','historical outcomes are not regraded');eq(s.endingsShelf.letter.checks,checks);
  const l=E.endingsShelfView(s).letter.source;eq(E.endingsWord(l,l.parts[0],null),'offi[old gap]','older source owns its empty marker');
 }
 {
  const s=open();s.endingsShelf.letter.firstKept={future:true};yes(E.keepEndingsLetter(s,options));eq(s.endingsShelf.letter.firstKept,{future:true});s.endingsShelf.letter.latestKept={future:true};refused(s,()=>E.keepEndingsLetter(s,options));s.endingsShelf.letter.checks={future:true};refused(s,()=>E.checkEndingsLetter(s,options));yes(E.placeEndingsWord(s,'precious','cious',options));
  delete s.endingsShelf.letter.latestKept;yes(E.keepEndingsLetter(s,options));eq(s.endingsShelf.letter.latestKept.check,null,'unreadable checks allow an unchecked keep');yes(E.openEndingsJob(s,'b1',options));s.endingsShelf.source=null;yes(E.answerEndingsJob(s,'b1','spacious',options));yes(E.checkEndingsJob(s,'b1',options));eq(E.endingsShelfView(s).current.last.outcome,'fit','own job source survives missing collection');
 }
 // Root and job addressing stay independent, including ids that resemble internal names.
 {
  const s=fresh();yes(E.openEndingsTable(s,'practice',options));s.endingsShelf.source.jobs=[{...source.jobs[0],id:'letter'}];yes(E.openEndingsJob(s,'letter',options));yes(E.answerEndingsJob(s,'letter','spacious',options));yes(E.checkEndingsJob(s,'letter',options));eq(E.endingsShelfView(s).current.last.outcome,'fit');ok(!Object.hasOwn(s.endingsShelf,'letter'));
  const t=open();t.endingsShelf.source.letter.gaps=[{...source.letter.gaps[0],id:'hasOwnProperty'}];t.endingsShelf.source.letter.segments=[{gapId:'hasOwnProperty'}];t.endingsShelf.letter.work={placements:{}};yes(E.checkEndingsLetter(t,options));eq(E.endingsShelfView(t).letter.last.outcome,'incomplete');
 }
 for(const order of ['endings-first','stained-first']){
  const s=fresh();if(order==='stained-first')yes(S.openStainedTable(s,'map',options));
  const prior=clone(s);yes(E.openEndingsTable(s,'letter',options));const {endingsShelf,...rest}=s;eq(rest,prior,order+' changes only its own root');yes(S.openStainedTable(s,'map',options));const kept=clone(s.spellings);yes(E.placeEndingsWord(s,'precious','cious',options));eq(s.spellings,kept);
  const reportResult=prepareProgressImport(JSON.stringify(report(s),null,2));ok(reportResult.ok);eq(reportResult.state.endingsShelf,s.endingsShelf);eq(reportResult.state.spellings,s.spellings);
 }
 {
  const s=fresh();s.spellings={v:99,raw:'Synthetic future'};yes(E.openEndingsTable(s,'letter',options));eq(s.spellings,{v:99,raw:'Synthetic future'});s.endingsShelf={v:99,raw:{future:true}};const before=clone(s);eq(E.endingsShelfView(s).status,'unsupported');eq(s,before);refused(s,()=>E.openEndingsTable(s,'letter',options));
 }
 for(const cb of [undefined,()=>false,()=>{throw Error('Synthetic refusal');}]){
  const s=fresh(),o=cb?{canExport:cb}:{};refused(s,()=>E.openEndingsTable(s,'letter',o));yes(E.openEndingsTable(s,'letter',options));refused(s,()=>E.placeEndingsWord(s,'precious','cious',o));refused(s,()=>E.checkEndingsLetter(s,o));refused(s,()=>E.keepEndingsLetter(s,o));
 }
 {
  const s=fresh(),prior=clone(s);yes(E.openEndingsTable(s,'letter',{canExport:c=>{ok(canExportEndings(c));c.endingsShelf={v:99};c.spellings={synthetic:true};return true;}}));eq(s.endingsShelf.v,1);const {endingsShelf,...rest}=s;eq(rest,prior,'callback cannot change proposal or unrelated roots');
 }
 {
  const s=open();let low=0,high=MAX_IMPORT_BYTES;while(low<high){const mid=Math.floor((low+high+1)/2);s.syntheticPadding='x'.repeat(mid);if(canExportEndings(s))low=mid;else high=mid-1;}s.syntheticPadding='x'.repeat(low);ok(canExportEndings(s));refused(s,()=>E.checkEndingsLetter(s,options));
 }
 {
  const s=open(),base=source.letter.gaps[0];s.endingsShelf.source.letter.gaps=Array.from({length:64},(_,i)=>({...base,id:'gap-'+i}));s.endingsShelf.source.letter.segments=s.endingsShelf.source.letter.gaps.map(g=>({gapId:g.id}));s.endingsShelf.letter.work={placements:Object.fromEntries(s.endingsShelf.source.letter.gaps.map(g=>[g.id,'tious']))};yes(E.checkEndingsLetter(s,options));eq(E.endingsShelfView(s).letter.last.feedback.length,65);yes(E.keepEndingsLetter(s,options));eq(E.endingsShelfView(s).letter.latestStatus,'ready');s.endingsShelf.source.letter.trays.push({id:'unused',choices:null});yes(E.checkEndingsLetter(s,options));eq(E.endingsShelfView(s).letter.last.feedback.length,66);yes(E.keepEndingsLetter(s,options));eq(E.endingsShelfView(s).letter.latestStatus,'ready');
 }
 {
  const s=open();s.endingsShelf.source.letter.gaps=[{...source.letter.gaps[0],prefix:'x'.repeat(4000),different:'y'.repeat(4000)}];s.endingsShelf.source.letter.segments=[{gapId:'precious'}];s.endingsShelf.letter.work={placements:{precious:'tious'}};yes(E.checkEndingsLetter(s,options));ok(E.endingsShelfView(s).letter.last.feedback[1].length>4000);yes(E.keepEndingsLetter(s,options));eq(E.endingsShelfView(s).letter.latestStatus,'ready');
 }
 {
  const s=fresh();yes(E.openEndingsTable(s,'practice',options));s.endingsShelf.source.jobs[2].prompt=17;s.endingsShelf.source.pairs[1].spoken=null;s.endingsShelf.source.cards[0].text=17;
  const before=clone(s),v=E.endingsShelfView(s);eq([v.jobs.length,v.pairs.length,v.cards.length],[5,3,5]);eq([v.jobsPartial,v.pairsPartial,v.cardsPartial],[true,true,true]);eq(s,before,'partial-list notice lookups remain pure');
  s.endingsShelf.items='Synthetic unreadable container';eq(E.endingsShelfView(s).jobsPartial,true);s.endingsShelf.items={};yes(E.openEndingsJob(s,'b1',options));s.endingsShelf.items.b1.checks={future:true};eq(E.endingsShelfView(s).current.partial,true,'non-array checks get a notice');
 }
 {
  const s=fresh();yes(E.openEndingsJob(s,'b1',options));yes(E.keepEndingsJob(s,'b1',options));const first=clone(s.endingsShelf.items.b1.firstKept),future={raw:'Synthetic later-format work'};s.endingsShelf.items.b1.work.futureField=clone(future);yes(E.answerEndingsJob(s,'b1','spacious',options));yes(E.restoreEndingsJob(s,'b1','first',options));eq(s.endingsShelf.items.b1.work.futureField,future,'restoring a known choice preserves unknown current work');eq(s.endingsShelf.items.b1.firstKept,first,'older snapshot remains unchanged');
  s.endingsShelf.items.b1.source.different={};yes(E.answerEndingsJob(s,'b1','spaceous',options));yes(E.checkEndingsJob(s,'b1',options));eq(s.endingsShelf.items.b1.checks.at(-1).feedback[0],'Have another look at this one.');s.endingsShelf.items.b1.source.choices.push({id:'hasOwnProperty',text:'Synthetic older response'});yes(E.answerEndingsJob(s,'b1','hasOwnProperty',options));yes(E.checkEndingsJob(s,'b1',options));eq(s.endingsShelf.items.b1.checks.at(-1).feedback[0],'Have another look at this one.','inherited feedback is never prose');
 }
 {
  const s=open();s.endingsShelf.source.letter.trays[0].choices[0].text='$&';yes(E.placeEndingsWord(s,'precious','cious',options));const html=endingsShelfPage(s);ok(html.includes('Chosen: $&amp;'),'saved choice text is a literal replacement value');ok(!html.includes('Chosen: {ending}'));
 }
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log('Endings Shelf checks:',runChecks());
