import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {writingTasks,taskSource} from '../dist/writing-table-content.mjs';
import {quotationTasks} from '../dist/writing-quote-content.mjs';
import * as c from '../dist/writing-table-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},copy=structuredClone;
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];
ok(declaration,'Use actual app Notes report for export preflight');
const report=new Function('recommendations','explorerStore',`${declaration}; return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const pretty=s=>JSON.stringify(report(s),null,2),options={canExport:s=>prepareProgressImport(pretty(s)).ok};
const seed=()=>initializeExplorerState(freshState()),record=s=>c.writingView(s).record;
const keys={'quote-build':['point','quote','explain'],'quote-goat':'jump','quote-fox':'choosing','quote-mole':'as-well','quote-two':'both-jumps'};
const cards={'quote-build':['goat'],'quote-goat':['goat'],'quote-fox':['cat'],'quote-mole':['mole'],'quote-two':['goat','mole']};
eq(writingTasks.filter(t=>t.bench==='point-quote').map(t=>t.id),Object.keys(keys),'Five explicit literary jobs');
eq(quotationTasks.map(t=>t.id),Object.keys(keys),'Dedicated finite sources correspond to the offered jobs');
for(const [id,key] of Object.entries(keys)){
 const s=seed();ok(c.openWritingTask(s,id,options).ok,'Open through established transaction');
 const r=record(s),src=r.source;ok(c.validWritingSource(src),'Finite source fits existing schema');eq(src.key,key,'Independent requested key');
 eq(c.writingResearchCards(src).map(card=>card.id),cards[id],'Own card order per job');
 eq(r.source,taskSource(id),'Opening freezes complete supplied source');
 if(src.kind==='choice'){
  for(const choice of src.choices){
   const result=c.writingResult(src,{choice:choice.id}),p=c.writingPreview(src,{choice:choice.id});
   eq(result.outcome,choice.id===key?'fit':'different','Check concerns this stated point');
   eq(p,[{heading:'Your choice',text:choice.text,noteIds:[choice.id]}],'Preview retains exact selected words, including a wrong pair');
   if(choice.id!==key)ok(result.feedback.includes(src.feedback.different[choice.id]),'Specific non-fit explanation retained');
  }
  eq(c.writingPreview(src,{choice:null}),[{heading:'Your choice',text:'No choice yet',noteIds:[]}],'Blank choice stays blank and uncited');
  eq(c.writingResult(src,{choice:null}).outcome,'incomplete','Existing empty choice semantics');
  for(const part of src.parts){
   const card=c.writingResearchCards(src).find(card=>card.id===part.id);ok(card,'Frozen fallback maps to own card');
   ok([card.title,card.origin,card.notice,...card.lines.map((l,i)=>`${i+1}. ${l.text}`)].every(value=>part.text.includes(value)),'Fallback preserves attribution, qualification and numbered prose');
  }
 }
}
eq(['quote-goat','quote-fox','quote-mole','quote-two'].map(id=>{const s=taskSource(id);return s.choices.findIndex(p=>p.id===s.key);}),[1,2,0,1],'Fitting positions vary');
eq(taskSource('quote-build').family,taskSource('quote-goat').family,'Same-fable return is familiar');

// This authoring check ties each exact quotation fragment to its cited span, not to document copy.
const fragments=[
 ['quote-build','quote',[['goat','g2','jumps without a second thought.']]],
 ['quote-goat','look',[['goat','g2','A thirsty goat looks over the edge.']]],
 ['quote-goat','jump',[['goat','g2','The goat jumps without a second thought.']]],
 ['quote-goat','fox-out',[['goat','g3',"The fox hops onto the goat's back, then her horns, and springs out."]]],
 ['quote-fox','boast',[['cat','c1','"I know a hundred ways to escape," says the fox.']]],
 ['quote-fox','climb',[['cat','c2','The cat is up the tree in a flash.']]],
 ['quote-fox','choosing',[['cat','c3','The fox is still choosing when the hounds reach him.']]],
 ['quote-mole','as-well',[['mole','m1','he could do it every bit as well']]],
 ['quote-mole','sculling',[['mole','m1','sculling so strongly and so easily along']]],
 ['quote-mole','laughing',[['mole','m4','he was evidently laughing']]],
 ['quote-two','descriptions',[['goat','g1','The walls are smooth and wet.'],['mole','m1','sculling so strongly and so easily along']]],
 ['quote-two','both-jumps',[['goat','g2','The goat jumps without a second thought.'],['mole','m2','He jumped up and seized the sculls']]],
 ['quote-two','one-jump',[['goat','g2','The goat jumps without a second thought.'],['mole','m1','his pride began to whisper']]]
];
for(const [taskId,noteId,expected] of fragments){
 const s=taskSource(taskId),item=(s.kind==='order'?s.parts:s.choices).find(p=>p.id===noteId),refs=c.writingReferences(s,noteId);
 eq(refs.status,'ready','An authored quotation has a working source locator');
 eq(refs.refs.map(ref=>[ref.card.id,ref.lineIds]),expected.map(([card,line])=>[card,[line]]),'Independent exact source mappings');
 for(const [cardId,lineId,fragment] of expected){
  const ref=refs.refs.find(ref=>ref.card.id===cardId),line=ref.card.lines.find(line=>line.id===lineId);
  ok(line.text.includes(fragment)&&item.text.includes(fragment),'Exact quoted words occur in selected wording and source span');
 }
}
const build=taskSource('quote-build'),orders=[['explain','point','quote'],['explain','quote','point'],['point','explain','quote'],['point','quote','explain'],['quote','explain','point'],['quote','point','explain']];
eq(build.parts.map(p=>p.id),orders[0],'Initial paragraph is uncorrected literal order');
for(const order of orders){
 const preview=c.writingPreview(build,{order});eq(preview,[{heading:'Your paragraph',text:order.map(id=>build.parts.find(p=>p.id===id).text).join(' '),noteIds:order}],'Each permutation keeps all words in one literal paragraph');
 eq(c.writingResult(build,{order}).outcome,order.join(',')==='point,quote,explain'?'fit':'different','Only this requested pattern is keyed');
 eq(preview[0].noteIds.map(id=>c.writingReferences(build,id).status),order.map(id=>id==='quote'?'ready':'none'),'Locator follows the actual quotation strip');
}
eq(build.parts.map(p=>c.writingQuoteRole(build,p.id)),['explanation','point','quote'],'Optional supplied roles use semantic enum');
for(const value of ['constructor','toString','valueOf','future',null,{},1]){
 const s=copy(build);s.parts[2].role=value;ok(c.validWritingSource(s),'Malformed display hint never closes source');eq(c.writingQuoteRole(s,'quote'),null,'Unknown role never becomes a badge');eq(c.writingReferences(s,'quote').status,'ready','Role corruption does not hide source locator');
}
const inherited=copy(build);inherited.parts[2]=Object.assign(Object.create({role:'quote'}),{id:'quote',text:build.parts[2].text});eq(c.writingQuoteRole(inherited,'quote'),null,'Only own role is authored');
const otherBench=taskSource('market-day');otherBench.parts[0].role='quote';eq(c.writingQuoteRole(otherBench,'noon'),null,'Other benches have no quote-role inference');
const badCard=taskSource('quote-two');badCard.research.cards[0].lines[0].text='';const rawCard=copy(badCard);
ok(c.validWritingSource(badCard),'Unreadable optional card remains an ordinary task');eq(c.writingResearchCards(badCard).map(c=>c.id),['mole'],'Healthy source sibling stays open');eq(c.writingReferences(badCard,'one-jump').status,'unavailable','Do not invent a partial pair locator');eq(badCard,rawCard,'Malformed optional card is not normalized');
const badRef=copy(build);badRef.research.links.quote=[{cardId:'missing',lineIds:['g2']}];ok(c.validWritingSource(badRef),'Bad locator leaves ordinary source valid');eq(c.writingReferences(badRef,'quote').status,'unavailable');eq(c.writingPreview(badRef,{order:['quote','point','explain']})[0].noteIds,['quote','point','explain'],'Broken reference cannot reorder or erase text');

const override=taskSource('quote-goat');override.preview=Object.fromEntries(override.choices.map(p=>[p.id,`Earlier preview for ${p.id}`]));
ok(c.validWritingSource(override),'Historical ordinary preview remains valid');eq(c.writingPreview(override,{choice:'look'}),[{heading:'Text to read',text:'Earlier preview for look',noteIds:['look']}],'Historical preview words are not replaced by choice text');
const after=taskSource('quote-goat');after.after='An earlier following paragraph.';
eq(c.writingPreview(after,{choice:'look'}),[{heading:'First paragraph',text:after.parts.map(p=>p.text).join(' '),noteIds:after.parts.map(p=>p.id)},{heading:'Next paragraph',text:'A thirsty goat looks over the edge. An earlier following paragraph.',noteIds:['look']}],'Historical after words and their applicable references retained');
eq(c.writingPreview(after,{choice:null})[1],{heading:'Next paragraph',text:'[Choose an opener] An earlier following paragraph.',noteIds:[]},'Historical unfinished after stays unfinished');
const oldOrder=taskSource('market-day');eq(c.writingPreview(oldOrder,{order:oldOrder.parts.map(p=>p.id)}),oldOrder.parts.map(p=>({heading:'',text:p.text})),'Other order bench preview stays exact');

const state=seed();state.syntheticNeighbour={payload:'x'.repeat(500000),future:[null,3,'held']};
c.openWritingTask(state,'bakery',options);c.keepWritingTask(state,options);const bakery=copy(record(state));
c.openWritingTask(state,'quote-build',options);eq(c.writingQuoteReturn(state),null,'Current build does not offer itself as a return');
c.openWritingTask(state,'quote-goat',options);eq(c.writingQuoteReturn(state),null,'Unkept order is not advertised as a kept paragraph');
c.openWritingTask(state,'quote-build',options);
const r=record(state),names={explain:'closing-old',point:'claim-old',quote:'words-old'};
r.source.id='earlier-quotation';r.source.title='Earlier paper';r.source.reader='An earlier reader';r.source.family='earlier-goat';
r.source.parts=r.source.parts.map(p=>({...p,id:names[p.id],role:{future:'held'}}));r.source.key=['words-old','closing-old','claim-old'];r.work.order=r.work.order.map(id=>names[id]);
r.source.research.links={'words-old':copy(r.source.research.links.quote)};
r.source.research.cards[0].title='Earlier story card';const oldLines=r.source.research.cards[0].lines;r.source.research.cards[0].lines=[oldLines[1],oldLines[2],oldLines[0]];r.source.research.future={raw:true};
ok(c.validWritingRecord(r),'Historical part IDs/key/roles/source IDs remain ordinary readable work');
eq(c.writingReferences(r.source,'words-old').refs[0].lineNumbers,[1],'Line numbering follows retained source order');
c.checkWritingTask(state,options);record(state).checks[0].outcome='fit';record(state).checks[0].feedback=['Earlier checked feedback.'];
ok(c.keepWritingTask(state,options).ok,'Historical checked outcome not semantically regraded');
const first=copy(record(state).firstKept),source=copy(record(state).source);
ok(c.setWritingMaterial(state,{part:'words-old',direction:-1},options).ok,'Move historical quotation ID');c.checkWritingTask(state,options);ok(c.keepWritingTask(state,options).ok);
eq(record(state).firstKept,first,'First kept paragraph/check exact after later edit');eq(record(state).source,source,'Frozen source remains exact');
eq(c.writingPreview(source,first.work)[0].noteIds,['closing-old','claim-old','words-old'],'First preview retains its order');
eq(c.writingPreview(source,record(state).latestKept.work)[0].noteIds,['closing-old','words-old','claim-old'],'Latest preview retains changed order');
c.openWritingTask(state,'quote-goat',options);
eq(c.writingQuoteReturn(state),{id:'quote-build',title:'Earlier paper',reader:'An earlier reader'},'Return uses retained own source, not current IDs/roles/title/key');
eq(state.writingDesk.records.bakery,bakery,'Other retained draft unchanged');
const emptyKept=copy(state);delete emptyKept.writingDesk.records['quote-build'].firstKept;delete emptyKept.writingDesk.records['quote-build'].latestKept;eq(c.writingQuoteReturn(emptyKept),null,'No kept snapshot means no kept-return promise');
const noRef=copy(state);noRef.writingDesk.records['quote-build'].source.research.links['words-old']=[{cardId:'future',lineIds:['missing']}];eq(c.writingQuoteReturn(noRef),null,'Unavailable reference omits return only');ok(c.openWritingTask(noRef,'quote-build',options).ok,'Broken optional return does not lock actual task');
const noCurrent=copy(state);noCurrent.writingDesk.currentId='missing';eq(c.writingQuoteReturn(noCurrent),null,'Return only from another active task');
state.writingDesk.records['retained-unreadable']={source:'older unreadable source',raw:[1,2]};
const original=copy(state),raw=pretty(state),imported=prepareProgressImport(raw);ok(imported.ok,'Actual Notes report imports historical paragraph and malformed sibling');
eq(imported.state.writingDesk,state.writingDesk,'Sources, text, references, checks and kept versions transfer exactly');eq(imported.state.syntheticNeighbour,state.syntheticNeighbour,'Large unrelated raw root transfers exactly');eq(prepareProgressImport(pretty(imported.state)).state.writingDesk,state.writingDesk,'Redownload/import preserves frozen history');
eq(state,original,'Notes report/import did not rewrite source notebook');
for(const action of [s=>c.openWritingTask(s,'quote-two',{canExport:()=>false}),s=>c.setWritingMaterial(s,{choice:'jump'},{canExport:()=>false}),s=>c.showWritingHelp(s,'hint',{canExport:()=>false}),s=>c.checkWritingTask(s,{canExport:()=>false}),s=>c.keepWritingTask(s,{canExport:()=>false})]){
 const s=copy(state),old=copy(s),held=s.writingDesk;eq(action(s).error,'unexportable','Refused existing preflight');eq(s,old,'Refusal preserves all notebook roots');assert.equal(s.writingDesk,held);n++;
}
const tooLarge=copy(state);tooLarge.syntheticNeighbour.payload='q'.repeat(5*1024*1024);const held=copy(tooLarge);eq(c.openWritingTask(tooLarge,'quote-two',options).error,'unexportable','Actual Notes report capacity refuses larger source');eq(tooLarge,held,'Capacity refusal keeps earlier drafts');
console.log(`Point and Quote: ${n} source, quotation, preview, history and actual Notes checks passed.`);
