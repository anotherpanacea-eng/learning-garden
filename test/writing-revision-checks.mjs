import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {writingTasks,taskSource} from '../dist/writing-table-content.mjs';
import * as c from '../dist/writing-table-core.mjs';
import {revisionCopy} from '../dist/writing-revision-content.mjs';
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(a,m)=>{assert.ok(a,m);checks++;},clone=structuredClone;
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];
ok(declaration,'actual app Notes report seam available');
const report=new Function('recommendations','explorerStore',`${declaration}; return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const pretty=s=>JSON.stringify(report(s),null,2),options={canExport:s=>prepareProgressImport(pretty(s)).ok},seed=()=>initializeExplorerState(freshState()),record=s=>c.writingView(s).record;
const keys={
 'pencil-notice':{time:'use',place:'use',flour:'aside',pause:'aside',front:'use'},
 'pencil-courier':{time:'aside',place:'aside',flour:'use',pause:'use',front:'aside'},
 'pencil-changes':{spelling:'edit',location:'revise',period:'edit',order:'revise'},
 'pencil-edit':'bread','pencil-plan':'arrival','pencil-taste':'both'
};
const ids=Object.keys(keys);
eq(writingTasks.filter(t=>t.bench==='revision').map(t=>t.id),ids,'six independent supplied jobs in authored order');
for(const id of ids){
 const s=seed();ok(c.openWritingTask(s,id,options).ok,'explicit task opens');const r=record(s),source=clone(r.source);
 eq(r.source.key,keys[id],id+' has independently specified fitting material');eq(r.source.family,id,'new reader is not a seen-family inference');eq(r.source.teach.length,5,'intro and three parts of a different worked example');
 if(r.source.kind==='sort')for(const [strip,heading]of Object.entries(keys[id]))ok(c.setWritingMaterial(s,{strip,heading},options).ok,'move supplied strip');
 else{
  for(const choice of r.source.choices){const w={choice:choice.id},result=c.writingResult(source,w);eq(result.outcome,choice.id===keys[id]?'fit':'different','choice checked against independent intended job');
   const preview=c.writingPreview(source,w);
   if(id==='pencil-edit')eq(preview[0].text,`The bakery sells ${choice.text}.`,'editing preview elects exact spelling without correction');
   else eq(preview.at(-1),{heading:'Your choice',text:choice.text},'plan/taste previews retain every elected claim literally');
  }
  ok(c.setWritingMaterial(s,{choice:keys[id]},options).ok);
 }
 const check=c.checkWritingTask(s,options);ok(check.ok);eq(check.check.outcome,'fit');eq([check.check.supported,check.check.guided],[true,true],'shown teaching never becomes an independent result');
 ok(c.keepWritingTask(s,options).ok);eq(record(s).source,source,'work/check/keep never replaces frozen source');
}
const visitor=taskSource('pencil-notice'),courier=taskSource('pencil-courier'),stripIds=['time','place','flour','pause','front'];
eq(visitor.parts,courier.parts,'different readers get identical material');eq(visitor.parts.map(p=>p.text),['The bakery opens at seven in the morning.','The bakery is on the square, next to the post office.','Leave flour sacks at the side door.','Deliveries pause from noon to one in the afternoon.','Visitors use the front door.'],'story values agree with established bakery and unambiguous delivery interval');
const grouping=[];
for(const source of [visitor,courier])for(let code=0;code<243;code++){
 let n=code;const placements={},assigned=[];for(const id of stripIds){const index=n%3;n=Math.floor(n/3);placements[id]=[null,'use','aside'][index];assigned.push(index);}
 const view=c.writingNoticePreview(source,{placements});
 grouping.push({actual:[view.keep.parts.map(p=>p.id),view.aside.parts.map(p=>p.id),view.waiting.map(p=>p.id)],expected:[stripIds.filter((_,i)=>assigned[i]===1),stripIds.filter((_,i)=>assigned[i]===2),stripIds.filter((_,i)=>assigned[i]===0)]});
}
eq(grouping.map(g=>g.actual),grouping.map(g=>g.expected),'every complete/partial/unexpected notice arrangement preserves the actual selected material');
eq(c.writingNoticePreview(visitor,{placements:keys['pencil-courier']}).keep.parts.map(p=>p.id),['flour','pause'],'visitor preview never autocorrects the courier subset');
eq(c.writingNoticePreview(visitor,{placements:{}}).waiting.length,5,'all unplaced source parts remain visible');
eq(c.writingNoticePreview(taskSource('bakery'),{placements:{}}),null,'ordinary sources keep their original generic preview');
eq(c.writingNoticePreview(taskSource('pencil-changes'),{placements:{}}),null,'change-purpose sort is not falsely rendered as a notice');
eq(c.writingNoticePreview({...visitor,redPencil:{v:1,keepId:'use',asideId:'use'}},{placements:{}}),null,'ambiguous heading hints fall back');
for(const hint of [undefined,null,{v:99},{v:1,keepId:'missing',asideId:'aside'},Object.create({v:1,keepId:'use',asideId:'aside'})]){
 const source=clone(visitor);if(hint===undefined)delete source.redPencil;else source.redPencil=hint;
 ok(c.validWritingSource(source),'opaque optional metadata never changes record source readability');eq(c.writingNoticePreview(source,{placements:{}}),null,'opaque optional metadata selects generic fallback');
 eq(c.writingPreview(source,{placements:{flour:'use'}})[0].text,'Leave flour sacks at the side door.','fallback still shows exact unexpected supplied placement');
}
const historical=clone(visitor);historical.id='earlier-notice';historical.title='An earlier reader request';historical.reader='An earlier fictional reader';historical.redPencil.keepId='kept';historical.redPencil.asideId='out';historical.redPencil.unknown={retained:true};historical.choices=[{id:'kept',text:'Earlier main page'},{id:'out',text:'Earlier side pile'},{id:'extra',text:'Earlier extra heading'}];historical.parts.push({id:'earlier',text:'A sixth source line.',unknown:'exact'});historical.key={time:'kept',place:'kept',flour:'out',pause:'out',front:'kept',earlier:'extra'};historical.unknown={exact:['source']};
const historicalWork={placements:{time:'out',flour:'kept',earlier:'extra'},unknown:{exact:['work']}};
const hBefore=clone([historical,historicalWork]),hv=c.writingNoticePreview(historical,historicalWork);
eq([hv.keep.id,hv.keep.text,hv.aside.id,hv.aside.text],['kept','Earlier main page','out','Earlier side pile'],'historical labels and heading IDs are own-source');eq(hv.keep.parts.map(p=>p.id),['flour']);eq(hv.aside.parts.map(p=>p.id),['time']);eq(hv.other,[{id:'extra',text:'Earlier extra heading',parts:[historical.parts.at(-1)]}],'additional historical headings never lose their parts');eq(hv.waiting.map(p=>p.id),['place','pause','front']);eq([historical,historicalWork],hBefore,'preview does not rewrite source/work/unknown fields');
const labels=clone(visitor);labels.redPencil.destinationLabels.use='Put on the earlier page';labels.redPencil.destinationLabels.aside=null;eq(c.writingRevisionDestinationLabel(labels,'use'),'Put on the earlier page');eq(c.writingRevisionDestinationLabel(labels,'aside'),'Choose: Set aside for this reader','one bad optional label does not hide destination');eq(c.writingRevisionDestinationLabel(labels,'missing'),null);labels.redPencil.destinationLabels.use='x'.repeat(161);eq(c.writingRevisionDestinationLabel(labels,'use'),'Choose: On this notice','overlong label falls back individually');
const s=seed();ok(c.openWritingTask(s,'pencil-notice',options).ok);eq(c.writingOtherReader(s,record(s).source),{status:'ready',taskId:'pencil-courier',label:'Make a notice for the courier'},'catalogue destination available only by explicit opening');
const badPreview=clone(visitor);badPreview.redPencil.keepId='missing';eq(c.writingNoticePreview(badPreview,{placements:{}}),null);eq(c.writingOtherReader(s,badPreview).status,'ready','reader invitation survives unreadable optional preview hint');
const linkSource=clone(visitor);linkSource.redPencil.otherReader={taskId:'earlier-target',label:'Visit the earlier reader'};eq(c.writingOtherReader(s,linkSource),{status:'absent'},'unknown missing target supplies no invented reader');
s.writingDesk.records['earlier-target']={...clone(record(s)),source:historical,work:historicalWork,checks:[],count:0};eq(c.writingOtherReader(s,linkSource),{status:'ready',taskId:'earlier-target',label:'Visit the earlier reader'},'retained historical record resolves before catalogue');s.writingDesk.records['earlier-target']={opaque:'retained'};eq(c.writingOtherReader(s,linkSource),{status:'unavailable',taskId:'earlier-target',label:'Visit the earlier reader'},'unreadable retained target remains unavailable rather than replaced');
s.writingDesk.records['pencil-courier']={opaque:'retained'};eq(c.writingOtherReader(s,visitor).status,'unavailable','unreadable current-catalogue target is not a license to regenerate');const noReader=clone(visitor);noReader.redPencil.otherReader.label='';eq(c.writingOtherReader(s,noReader),{status:'absent'});delete noReader.redPencil.otherReader;eq(c.writingOtherReader(s,noReader),{status:'absent'});
const state=seed();state.syntheticNeighbour={payload:'x'.repeat(500000)};ok(c.openWritingTask(state,'pencil-notice',options).ok);ok(c.setWritingMaterial(state,{strip:'pause',heading:'use'},options).ok);ok(c.checkWritingTask(state,options).ok);ok(c.keepWritingTask(state,options).ok);const first=clone(record(state).firstKept),checked=clone(record(state).checks[0]);ok(checked.feedback.some(t=>t.startsWith('Deliveries pause from noon to one in the afternoon. ')),'revision mismatch identifies the exact own line before its reason');
for(const [strip,heading]of Object.entries(keys['pencil-notice']))c.setWritingMaterial(state,{strip,heading},options);c.keepWritingTask(state,options);eq(record(state).firstKept,first,'first kept unexpected notice remains exact');eq(record(state).checks[0],checked,'editing/keeping does not regrade a past check');eq(record(state).latestKept.check,null,'changed arrangement does not reuse earlier check as current');
const retainedVisitor=clone(state.writingDesk.records['pencil-notice']);c.openWritingTask(state,'pencil-courier',options);eq(c.writingView(state).familiar,false,'courier is not labelled seen just because visitor was opened');eq(state.writingDesk.records['pencil-notice'],retainedVisitor,'other-reader opening preserves original complete draft');
state.writingDesk.records['unreadable-sibling']={opaque:{exact:true}};const historicalRecord=clone(retainedVisitor);historicalRecord.source=historical;historicalRecord.work=historicalWork;historicalRecord.checks=[];historicalRecord.count=0;delete historicalRecord.firstKept;delete historicalRecord.latestKept;state.writingDesk.records['earlier-notice']=historicalRecord;
const imported=prepareProgressImport(pretty(state));ok(imported.ok,'actual pretty Notes report transfers with large unrelated sibling');eq(imported.state.writingDesk,state.writingDesk,'all sources, checks, versions, historical IDs and unreadable siblings survive');eq(imported.state.syntheticNeighbour,state.syntheticNeighbour);eq(prepareProgressImport(pretty(imported.state)).state.writingDesk,state.writingDesk,'redownload imports without today-catalogue normalization');
const original=clone(state);const refused={canExport:()=>false};for(const fn of [()=>c.openWritingTask(state,'pencil-plan',refused),()=>c.setWritingMaterial(state,{strip:'time',heading:'use'},refused),()=>c.showWritingHelp(state,'hint',refused),()=>c.checkWritingTask(state,refused),()=>c.keepWritingTask(state,refused)]){eq(fn().error,'unexportable','real report refusal stops transaction');eq(state,original,'refusal preserves complete notebook');}
const cap=seed();c.openWritingTask(cap,'pencil-notice',options);for(let i=0;i<63;i++)cap.writingDesk.records['earlier-'+i]={opaque:i};const capBefore=clone(cap);eq(c.openWritingTask(cap,'pencil-courier',options).error,'full');eq(cap,capBefore,'full shelf does not replace or evict');ok(c.openWritingTask(cap,'pencil-notice',options).ok,'retained target stays open at capacity');
const full=seed();full.syntheticLarge='x'.repeat(MAX_IMPORT_BYTES);const fullBefore=clone(full);eq(c.openWritingTask(full,'pencil-notice',options).error,'unexportable');eq(full,fullBefore,'shared size refusal changes no root');
const fallback=clone(historical);delete fallback.feedback.different.time;const feedback=c.writingResult(fallback,{placements:{time:'extra',place:'kept',flour:'out',pause:'out',front:'kept',earlier:'extra'}}).feedback;ok(feedback.some(t=>t.startsWith('The bakery opens at seven in the morning. Under Earlier extra heading; compare with Earlier main page.')),'missing authored per-line note uses neutral own-heading fallback');
ok(revisionCopy.messageLabel&&revisionCopy.together&&revisionCopy.unavailableReader,'complete bench framing available without a new prose editor');
console.log(`The Red Pencil: ${checks} behavioral checks passed, including all486 notice arrangements.`);
