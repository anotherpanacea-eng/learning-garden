import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {labelCases} from '../dist/exhibit-label-content.mjs';
import {validLabelSource,labelView,labelText,labelSpeech,validLabelResponse,startLabel,moveLabel,wordLabel,supportLabel,askLabel,keepLabel,recoverLabels} from '../dist/exhibit-label-core.mjs';
import {labelPage,labelNotes} from '../dist/exhibit-label-ui.mjs';
const clone=structuredClone,raw=JSON.stringify,fresh=()=>initializeExplorerState(freshState());let checks=0;
const ok=(a,m)=>{assert.ok(a,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const report=s=>JSON.stringify({title:'Synthetic Exhibit notes',...s},null,2),fits=s=>prepareProgressImport(report(s)).ok;
function* permutations(a){if(!a.length){yield [];return;}for(let i=0;i<a.length;i++)for(const tail of permutations(a.filter((_,j)=>j!==i)))yield [a[i],...tail];}

for(const source of labelCases){ok(validLabelSource(source));ok(Buffer.byteLength(raw(source))<12*1024);for(const order of permutations(['object','use','claim']))for(const wording of ['broad','careful']){
 const model={source,order,wording,support:[]},expected=order.map(r=>r==='claim'?source.sentences.claim[wording]:source.sentences[r]).join(' ');
 eq(labelText(model),expected);eq(labelSpeech(model),(wording==='broad'?source.copy.draftWarning+' ':'')+expected);
 const response={snapshot:clone(model),openingText:source.visitor.openings[order[0]],claimText:source.visitor.claims[wording]};ok(validLabelResponse(response));
 const changed=clone(response);changed.claimText=source.visitor.claims[wording==='broad'?'careful':'broad'];ok(!validLabelResponse(changed),'contradictory imported prose is not live');
}}
{
 const s=fresh(),before=raw(s);labelPage(s,null,'synthetic');labelNotes(s);eq(raw(s),before,'opening/notes do not allocate');
 ok(startLabel(s,'writing-board',fits));const w=labelView(s,'writing-board').selected.work;eq(w.source,labelCases[0]);eq(w.order,['claim','object','use']);
 ok(askLabel(s,'writing-board',fits));const response=clone(labelView(s,'writing-board').selected.currentResponse);ok(response);
 ok(moveLabel(s,'writing-board','claim',1,fits));ok(!labelView(s,'writing-board').selected.currentResponse,'old response marked earlier');eq(labelView(s,'writing-board').selected.response,response);
 ok(wordLabel(s,'writing-board','careful',fits));ok(askLabel(s,'writing-board',fits));eq(labelView(s,'writing-board').selected.currentResponse.claimText,labelCases[0].visitor.claims.careful);
 ok(keepLabel(s,'writing-board',false,fits));const kept=clone(labelView(s,'writing-board').selected.kept);ok(wordLabel(s,'writing-board','broad',fits));eq(labelView(s,'writing-board').selected.kept,kept,'kept source/order/response immutable after live edit');
 ok(!keepLabel(s,'writing-board',false,fits));ok(keepLabel(s,'writing-board',true,fits));
 ok(supportLabel(s,'writing-board','help',fits));ok(labelView(s,'writing-board').selected.response,'support after response leaves it valid');
 ok(askLabel(s,'writing-board',fits));ok(supportLabel(s,'writing-board','example',fits));ok(keepLabel(s,'writing-board',true,fits));ok(!labelView(s,'writing-board').selected.keptUnreadable,'kept response retains its earlier support snapshot while kept source remains readable');
 ok(startLabel(s,'scribe-palette',fits));eq(labelView(s,'scribe-palette').selected.work.source,labelCases[1]);
 eq(prepareProgressImport(report(s)).state.exhibitLabels,s.exhibitLabels,'actual generic importer retains full source and sibling case');
 const authored=labelCases[0].title;labelCases[0].title='Changed current catalog';ok(labelPage(s,'writing-board','synthetic').includes(authored));labelCases[0].title=authored;
}
{
 const s=fresh();ok(startLabel(s,'writing-board',fits));const w=labelView(s,'writing-board').selected.work;w.source.id='retired-label';w.source.title='An earlier complete source';s.exhibitLabels.cases={'retired-label':w};ok(labelView(s,'retired-label').selected);ok(askLabel(s,'retired-label',fits));ok(prepareProgressImport(report(s)).ok);
 s.exhibitLabels.cases['writing-board']={future:'raw sibling'};ok(!startLabel(s,'writing-board',fits));ok(startLabel(s,'scribe-palette',fits));eq(s.exhibitLabels.cases['writing-board'],{future:'raw sibling'});
 const good=labelView(s,'retired-label').selected.work;good.lastResponse={...clone(good.lastResponse),claimText:'This says the opposite.'};const unreadable=clone(good.lastResponse);
 ok(labelView(s,'retired-label').selected.responseUnreadable);ok(askLabel(s,'retired-label',fits));eq(labelView(s,'retired-label').selected.work.earlierRawResponses,[unreadable]);
 labelView(s,'retired-label').selected.work.kept={unreadable:true};ok(labelView(s,'retired-label').selected.keptUnreadable);ok(!keepLabel(s,'retired-label',true,fits));eq(labelView(s,'retired-label').selected.work.kept,{unreadable:true});
 const imported=prepareProgressImport(report(s));ok(imported.ok);eq(imported.state.exhibitLabels,s.exhibitLabels);
}
{
 const s=fresh();startLabel(s,'writing-board',fits);askLabel(s,'writing-board',fits);const w=labelView(s,'writing-board').selected.work;
 w.lastResponse.snapshot=Object.fromEntries(Object.entries(w.lastResponse.snapshot).reverse());ok(labelView(s,'writing-board').selected.currentResponse,'object key order does not change a response');
 const extra=clone(w.lastResponse);extra.snapshot.source.title='Older source title';extra.openingText=extra.snapshot.source.visitor.openings[extra.snapshot.order[0]];w.lastResponse=extra;ok(labelView(s,'writing-board').selected.responseUnreadable,'response cannot claim a different current source');
}
{
 const s=fresh();startLabel(s,'writing-board',fits);const w=labelView(s,'writing-board').selected.work;delete w.lastResponse;delete w.kept;w.earlierRawResponses={future:'unreadable history'};
 ok(labelView(s,'writing-board').selected,'missing response/kept fields do not hide a sound draft');ok(moveLabel(s,'writing-board','claim',1,fits));eq(labelView(s,'writing-board').selected.work.earlierRawResponses,{future:'unreadable history'});ok(keepLabel(s,'writing-board',false,fits),'empty kept slot remains usable');ok(askLabel(s,'writing-board',fits),'new response can coexist with unreadable history');eq(labelView(s,'writing-board').selected.work.earlierRawResponses,{future:'unreadable history'});
 labelView(s,'writing-board').selected.work.lastResponse={future:'raw response'};const before=raw(s.exhibitLabels);ok(!askLabel(s,'writing-board',fits),'cannot append over a malformed history slot');eq(raw(s.exhibitLabels),before);
}
{
 const s=fresh();startLabel(s,'writing-board',fits);const w=labelView(s,'writing-board').selected.work;w.source.sentences.object='<img src=x onerror=alert(1)>';w.source.sourceCard.recordUrl='https://other.example/art/collection/search/545112';
 ok(validLabelSource(w.source),'printable imported prose remains self-contained');const html=labelPage(s,'writing-board','synthetic')+labelNotes(s);ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'),'saved prose escaped on activity and notes');ok(!html.includes('<img src=x onerror=alert(1)>'),'imported prose never becomes an element');ok(!html.includes('href="https://other.example'),'non-Met record address is never a link');
}
{
 const s=fresh();startLabel(s,'writing-board',fits);s.padding='';s.padding='x'.repeat(MAX_IMPORT_BYTES-1-Buffer.byteLength(report(s)));ok(fits(s),'near-cap actual formatted report accepted');const before=raw(s.exhibitLabels);
 for(const fn of [()=>wordLabel(s,'writing-board','careful',fits),()=>supportLabel(s,'writing-board','help',fits),()=>askLabel(s,'writing-board',fits),()=>keepLabel(s,'writing-board',false,fits),()=>startLabel(s,'scribe-palette',fits),()=>recoverLabels(s,fits)]){ok(!fn(),'growing near-cap write refuses');eq(raw(s.exhibitLabels),before,'refusal is atomic');}
 for(const fn of [()=>moveLabel(s,'writing-board','claim',1,()=>false),()=>wordLabel(s,'writing-board','careful',()=>false),()=>supportLabel(s,'writing-board','help',()=>false),()=>askLabel(s,'writing-board',()=>false),()=>keepLabel(s,'writing-board',false,()=>false),()=>startLabel(s,'scribe-palette',()=>false),()=>recoverLabels(s,()=>false)]){ok(!fn(),'every write consults host preflight');eq(raw(s.exhibitLabels),before);}
}
for(const root of [false,{version:8,cases:{}},null]){
 const s=fresh();s.exhibitLabels=root;ok(prepareProgressImport(report(s)).ok,'nonobject optional root admitted raw');eq(labelView(s).status,'recovery');const before=raw(s);labelPage(s,null,'synthetic');eq(raw(s),before);ok(recoverLabels(s,fits));eq(s.exhibitLabels.retainedRaw,root);ok(prepareProgressImport(report(s)).ok);
}
{
 const s=fresh();s.exhibitLabels={version:1,cases:{},retainedRaw:{old:true}};const prior=clone(s.exhibitLabels);ok(recoverLabels(s,fits));eq(s.exhibitLabels.retainedRaw,prior,'nested recovery keeps whole old root');
}
console.log(`${checks} Exhibit Label checks passed across 24 complete order/wording combinations.`);
