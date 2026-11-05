import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {frenchQuestionCases,makeFrenchQuestionSource} from '../dist/french-questions-content.mjs';
import {validQuestionSource,validQuestionWork,newQuestionWork,changeQuestionWork,compareQuestion,questionSheetsView,keepQuestionSheet} from '../dist/french-questions-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},clone=structuredClone,yes={canExport:()=>true};
const expected=[
 ['cafe','a',[['blue','the kitchen'],['blue','the living room'],['red','the kitchen'],['red','the living room']]],
 ['jardin','b',[['blue','the kitchen'],['red','the living room'],['blue','the living room'],['red','the kitchen']]],
 ['bibliotheque','c',[['red','the kitchen'],['red','the living room'],['blue','the living room'],['blue','the kitchen']]],
 ['atelier','d',[['blue','the living room'],['blue','the kitchen'],['red','the living room'],['red','the kitchen']]]
];
eq(frenchQuestionCases.map(c=>c.id),expected.map(c=>c[0]),'Four open visits');
for(const [caseId,target,parcels] of expected){
 const s=makeFrenchQuestionSource(caseId),w=newQuestionWork(s);ok(validQuestionSource(s),'Finite reviewed source valid');
 eq([s.targetId,s.parcels.map(p=>[p.colour.en,p.room.en])],[target,parcels],'Independent case-specific parcel arrangement');
 eq(s.parcels.map(p=>compareQuestion(s,{...w,selected:p.id}).matches),['a','b','c','d'].map(id=>id===target),'Targets fit A/B/C/D respectively');
 eq(s.questions.map(q=>q.id),['colour','room','destination'],'Stable supplied question order');
 const blank=clone(w);eq(compareQuestion(s,w).matches,null,'No invented feedback for an unselected parcel');eq(w,blank,'Comparison helper does not expose support or change draft');
 const book={};eq(keepQuestionSheet(book,s,w,yes),1,'A blank conversation may be kept');eq(book.frenchQuestionSheets.items[0].work,w,'Blank work stays blank');
}
eq(makeFrenchQuestionSource('missing'),null,'Unknown case does not silently choose a source');
const s=makeFrenchQuestionSource(),w=newQuestionWork(s);
eq(w,{v:1,asked:[],selected:null,meaningShown:false,compared:false,speechRequests:0},'Fresh work infers no reading, reply or chosen parcel');
let conversation=changeQuestionWork(s,w,'ask','destination');conversation=changeQuestionWork(s,conversation,'ask','room');conversation=changeQuestionWork(s,conversation,'ask','destination');
eq(conversation.asked,['destination','room','destination'],'Useful, redundant and repeated questions remain in literal order');eq(w.asked,[],'Session edits return a detached work value');
eq(conversation.compared,false,'Asking questions does not open source comparison');
const surprise=changeQuestionWork(s,conversation,'select','d');eq([surprise.selected,compareQuestion(s,surprise).matches,surprise.compared],['d',false,false],'Unexpected parcel remains chosen without automatic comparison');
const compared=changeQuestionWork(s,surprise,'compare');eq([compared.selected,compared.compared],['d',true],'Explicit comparison retains unexpected parcel and marks support');
eq(changeQuestionWork(s,compared,'select','a').compared,true,'Later selection cannot clear prior comparison exposure');
eq(changeQuestionWork(s,w,'compare'),null,'No selected parcel cannot produce an invented comparison');
eq(changeQuestionWork(s,compared,'select',null).selected,null,'Selection can return to blank without losing the conversation');
eq(changeQuestionWork(s,changeQuestionWork(s,w,'meaning'),'meaning',false).meaningShown,true,'English support is sticky');
eq(changeQuestionWork(s,{...w,speechRequests:99},'speech').speechRequests,99,'Request counter saturates without blocking later requested speech');
let full=w;for(let i=0;i<32;i++)full=changeQuestionWork(s,full,'ask','colour');eq(full.asked.length,32,'32 requests retained, including repeats');const held=clone(full);eq(changeQuestionWork(s,full,'ask','room'),null,'History cap refuses without dropping earlier questions');eq(full,held,'Cap leaves work unchanged');
for(const [action,value] of [['ask','foreign'],['select','foreign'],['select',undefined],['other',1]])eq(changeQuestionWork(s,w,action,value),null,'Unresolving/new controls refused safely');
const extras=changeQuestionWork(s,{...w,future:{raw:['held']}},'ask','room');eq(extras.future,{raw:['held']},'Unknown work fields survive edits');

// Historical source shape, labels, ids, order, counts and target are independent of today's catalogue.
const historical=clone(s);historical.id='Earlier source é';historical.title='<Earlier visit>';historical.titleMeaning='An earlier visit';historical.future={raw:['keep']};
historical.questions=[{...historical.questions[2],id:'old destination'},{...historical.questions[1],id:'old room'}];
historical.parcels=[{...historical.parcels[0],id:'old target'},{...clone(historical.parcels[0]),id:'old duplicate'},{...historical.parcels[2],id:'old red'}];historical.targetId='old target';
const hw={v:1,asked:['old room','old destination','old room'],selected:'old duplicate',meaningShown:true,compared:true,speechRequests:2,future:{kept:'exact'}};
ok(validQuestionWork(historical,hw),'Foreign own-source names and counts are usable');
eq(compareQuestion(historical,hw).matches,true,'Different IDs with the same displayed dimensions both fit');
eq(compareQuestion({...historical,targetId:'old red'},hw).matches,false,'Own-source altered target controls comparison, not a catalogue key');
eq(changeQuestionWork(historical,hw,'ask','old destination').asked,['old room','old destination','old room','old destination'],'Historical questions remain askable in their own order');
for(const [key,value] of [['v',2],['id','constructor'],['title',''],['titleMeaning',''],['questions',[]],['questions',Array(2)],['parcels',[]],['targetId','unresolved']])eq(validQuestionSource({...s,[key]:value}),false,'Malformed required source is unavailable without a fabricated source');
eq(validQuestionSource({...s,questions:[s.questions[0],s.questions[0]]}),false,'Duplicate own question IDs do not resolve ambiguously');
eq(validQuestionSource({...s,parcels:[s.parcels[0],s.parcels[0]]}),false,'Duplicate own parcel IDs do not resolve ambiguously');
eq(validQuestionSource(Object.create(s)),false,'Own fields required');
eq(validQuestionSource({...s,id:'é'.repeat(80)}),true,'ID bound counts Unicode code points without a catalogue regex');
eq(validQuestionSource({...s,id:'é'.repeat(81)}),false,'ID length bounded');
eq(validQuestionSource({...s,title:'x'.repeat(1501)}),false,'Source text length bounded');
for(const [key,value] of [['v',2],['selected','unresolved'],['asked',['unresolved']],['asked',Array(1)],['meaningShown',1],['compared','yes'],['speechRequests',100]])eq(validQuestionWork(s,{...w,[key]:value}),false,'Malformed work remains uneditable without regrading');
eq(newQuestionWork(null),null,'Bad source cannot initialize a substitute work');eq(compareQuestion(s,{...w,selected:'missing'}),null,'Bad retained selection does not invent feedback');

const book={other:{unknown:['held']},notes:'n'.repeat(500000)},before=clone(book);
eq(questionSheetsView(book),{status:'absent',items:[],canKeep:true},'View never creates a root');eq(book,before,'Pure view leaves whole notebook exact');
eq(keepQuestionSheet(book,historical,hw,yes),1,'Keep appends first own-source conversation');
eq(book.frenchQuestionSheets.next,2,'Allocator advances monotonically');
const first=clone(book.frenchQuestionSheets.items[0]);eq(first,{v:1,id:1,source:historical,work:hw},'Source/work unknowns frozen exactly');
historical.future.raw.push('caller');hw.future.kept='caller';eq(book.frenchQuestionSheets.items[0],first,'Kept source/work have no caller aliases');
const copied=changeQuestionWork(first.source,first.work,'select','old red');eq(keepQuestionSheet(book,first.source,copied,yes),2,'Changed copy becomes a distinct sheet');eq(book.frenchQuestionSheets.items[0],first,'Earlier kept version remains unchanged');
eq([book.other,book.notes],[before.other,before.notes],'Keep preserves unrelated raw root and large Notes');
const prior=clone(book),draft=clone(w);
for(const options of [{},null,{canExport:null},{canExport:()=>undefined},{canExport:()=>null},{canExport:()=>1},{canExport:()=>({ok:true})},{canExport:()=>false},{canExport:()=>{throw Error('refuse');}}]){
 eq(keepQuestionSheet(book,s,w,options),false,'Only explicit true from real preflight permits commit');eq(book,prior,'Refusal leaves all roots exact');eq(w,draft,'Refusal leaves working conversation unchanged');
}
const mutable={other:{held:true}};const unrelated=mutable.other;
eq(keepQuestionSheet(mutable,s,w,{canExport:c=>{c.frenchQuestionSheets.items[0].source.note.fr='mutated preflight candidate';c.frenchQuestionSheets.items[0].work.selected='d';c.frenchQuestionSheets.extra='candidate-only';c.other.held=false;return true;}}),1,'Preflight receives disposable candidate');
eq(mutable.frenchQuestionSheets,{v:1,next:2,items:[{v:1,id:1,source:s,work:w}]},'Callback mutation cannot rewrite preflighted proposal');assert.equal(mutable.other,unrelated);n++;eq(mutable.other.held,true,'Callback mutation cannot replace unrelated root');
const mixed={frenchQuestionSheets:{v:1,next:5,items:[{v:99,id:3,raw:'future'},clone(first),{id:'foreign',raw:['keep']}],future:{held:['exact']}}};
const earlier=clone(mixed.frenchQuestionSheets);
eq(questionSheetsView(mixed).items.map(i=>[i.id,i.index,i.readable]),[[3,0,false],[1,1,true],[null,2,false]],'Unreadable siblings remain represented beside a healthy history item');
eq(keepQuestionSheet(mixed,s,w,yes),5,'Own monotone allocator allows gaps without reusing a reserved ID');
eq(mixed.frenchQuestionSheets.items.slice(0,3),earlier.items,'Append preserves unreadable/future siblings');eq(mixed.frenchQuestionSheets.future,earlier.future,'Root optional fields preserved');eq(mixed.frenchQuestionSheets.next,6,'Next allocator remains separate from item count');
const duplicate={frenchQuestionSheets:{v:1,next:4,items:[clone(first),clone(first),{...clone(first),id:3}]}};
eq(questionSheetsView(duplicate).items.map(i=>i.readable),[false,false,true],'Duplicate IDs do not hide unique siblings');
for(const next of [undefined,0,1,3.5,Number.MAX_SAFE_INTEGER]){const b={frenchQuestionSheets:{v:1,next,items:[clone(first)]}},old=clone(b);eq(questionSheetsView(b).canKeep,false,'Malformed/exhausted allocator refuses only new Keep');eq(questionSheetsView(b).items[0].readable,true,'Readable history stays available despite bad allocation metadata');eq(keepQuestionSheet(b,s,w,yes),false,'Do not replace allocator or reuse earlier id');eq(b,old,'Bad allocation metadata remains raw');}
for(const value of [null,'future',{v:2,next:1,items:[]},{v:1,next:1,items:'future'}]){const b={frenchQuestionSheets:value,other:'held'},old=clone(b);eq(questionSheetsView(b).status,'unavailable','Unknown wrapper remains opaque');eq(keepQuestionSheet(b,s,w,yes),false,'Unsupported root refuses Keep');eq(b,old,'Unsupported root remains exact');}
const huge={notes:'x'.repeat(5*1024*1024)},hugeBefore=clone(huge);let calls=0;
eq(keepQuestionSheet(huge,s,w,{canExport:()=>{calls++;return true;}}),false,'Shared notebook capacity refuses without pruning');eq(calls,0,'Oversized candidate does not reach export callback');eq(huge,hugeBefore,'Capacity refusal leaves Notes exact');

// Actual app report + actual import are used, rather than a surrogate byte-only export check.
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];ok(declaration,'Actual report declaration available');
const report=new Function('recommendations','explorerStore',`${declaration}; return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const pretty=b=>JSON.stringify(report(b),null,2),actual={canExport:b=>prepareProgressImport(pretty(b)).ok};
const transfer=initializeExplorerState(freshState());transfer.syntheticNeighbour={payload:'n'.repeat(500000),raw:['keep',null,3]};transfer.frenchQuestionSheets=clone(mixed.frenchQuestionSheets);
eq(keepQuestionSheet(transfer,first.source,first.work,actual),6,'Keep passes actual pretty Notes preflight with historical source and large raw sibling');
const raw=clone(transfer),imported=prepareProgressImport(pretty(transfer));ok(imported.ok,'Actual Notes report imports');
eq(imported.state.frenchQuestionSheets,transfer.frenchQuestionSheets,'All retained sources/order/replies/work and unreadable siblings transfer exactly');eq(imported.state.syntheticNeighbour,transfer.syntheticNeighbour,'Large unrelated Notes transfer exactly');eq(prepareProgressImport(pretty(imported.state)).state.frenchQuestionSheets,transfer.frenchQuestionSheets,'Second report/import preserves frozen conversations');eq(transfer,raw,'Report and import did not rewrite source notebook');
console.log(`French parcel questions: ${n} source, conversation, preservation and actual Notes checks passed.`);
