import {instructionCases,instructionCase,instructionPages,instructionHelpTopics,instructionQuestions,instructionProductionReports,instructionReadingReports,instructionExample} from './instruction-content.mjs';

const clone=x=>structuredClone(x);
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,ks)=>object(x)&&Object.keys(x).length===ks.length&&ks.every(k=>Object.hasOwn(x,k));
const same=(a,b)=>a===b||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>same(x,b[i]))||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k]));
const desks=['post','loft'];
export const instructionSequenceLimit=1_000_000_000;
export const instructionSupport=['suppliedAssembly','comparison','cause','example','narration','together','runFeedback','humanRead',...instructionHelpTopics.map(k=>`help:${k}`)];
const text=(x,n)=>typeof x==='string'&&x.length<=n;
const integer=(x,min=0,max=instructionSequenceLimit)=>Number.isInteger(x)&&x>=min&&x<=max;
const supports=x=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(k=>instructionSupport.includes(k));
const action=(source,id)=>source.actions.find(a=>a.id===id);
const validPlan=(source,x)=>Array.isArray(x)&&x.length<=3&&new Set(x).size===x.length&&x.every(id=>!!action(source,id));
const validStrip=(source,x)=>Array.isArray(x)&&x.length<=3&&new Set(x.map(s=>s?.actionId)).size===x.length&&x.every(s=>keys(s,['actionId','variant'])&&!!action(source,s.actionId)&&['A','B'].includes(s.variant));

// A saved source is a frozen copy of what was shown. Check its ids, never its wording.
// The runner always uses the current case, so saved wording is never executed.
function validSource(source){
 const canonical=instructionCase(source?.id);
 return !!canonical&&Array.isArray(source.actions)&&same(source.actions.map(a=>a?.id),canonical.actions.map(a=>a.id))&&source.actions.every(a=>object(a.variants));
}
export function describeInstructionScene(id,scene){
 if(id==='pocket-note')return `${scene.note==='inside'?'The note is inside the envelope.':scene.note==='folded-table'?'The folded note is on the table.':'The unfolded note is on the table; it is too wide for this envelope.'} The envelope is ${scene.envelope}.`;
 return `${scene.arrowReady?'The arrow is at the fork.':'The arrow is not at the fork.'} ${scene.cardReady?'The welcome card is on the table.':'The welcome card is not on the table.'} ${scene.rabbit==='not-invited'?'Rabbit has not been invited.':scene.rabbit==='fork'?'Rabbit is waiting at the fork and has not recognized the welcome table.':scene.recognized?'Rabbit reached and recognized the welcome table.':'Rabbit reached the table but could not identify it as the welcome table.'}`;
}
function transition(id,scene,actionId){
 const after=clone(scene);let blocked=false,description='';
 if(id==='pocket-note'){
  if(actionId==='fold'){
   if(scene.note==='inside'){blocked=true;description='The note is inside the envelope, not on the table. It cannot be folded on the table now.';}
   else {after.note='folded-table';description='The note is folded once. It now fits this envelope and is still on the table.';}
  }else if(actionId==='insert'){
   if(scene.envelope==='sealed'){blocked=true;description='The envelope is sealed. The note is still outside.';}
   else if(scene.note==='unfolded-table'){blocked=true;description='This note is too wide for this envelope. It is still on the table.';}
   else if(scene.note!=='folded-table'){blocked=true;description='The note is not on the table to put inside.';}
   else {after.note='inside';description='The folded note is inside the open envelope.';}
  }else if(scene.envelope!=='open'){blocked=true;description='The envelope is already sealed.';}
  else {after.envelope='sealed';description=scene.note==='inside'?'The envelope is sealed with the note inside.':'The envelope is sealed, but the note is still outside.';}
 }else if(actionId==='arrow'){
  after.arrowReady=true;description='The arrow sign is at the fork.';
 }else if(actionId==='card'){
  after.cardReady=true;description='The welcome card is on the table.';
 }else{
  after.rabbit=scene.arrowReady?'table':'fork';after.recognized=scene.arrowReady&&scene.cardReady;
  description=!scene.arrowReady?'Rabbit sets out immediately and stops at the fork. Rabbit does not know which way to go.':!scene.cardReady?'Rabbit follows the arrow and reaches the table, but cannot identify it as the welcome table.':'Rabbit follows the arrow, reaches the table and recognizes the welcome place.';
 }
 return {after,blocked,description};
}
// This accepts action IDs only. Original text is never parsed or passed to this runner.
export function runInstructionModel(given,strip){
 const source=instructionCase(given?.id);
 if(!source||!validStrip(source,strip))return null;
 let scene=clone(source.startingScene),blockedAction=null;const transitions=[];
 for(const s of strip){
  const before=clone(scene),next=transition(source.id,scene,s.actionId);
  transitions.push({...clone(s),wording:action(source,s.actionId).variants[s.variant],before,after:clone(next.after),blocked:next.blocked,description:next.description});
  scene=next.after;if(next.blocked){blockedAction=s.actionId;break;}
 }
 const requestFulfilled=source.id==='pocket-note'?scene.note==='inside'&&scene.envelope==='sealed':scene.rabbit==='table'&&scene.recognized;
 let description=describeInstructionScene(source.id,scene);
 if(source.id==='welcome-table'&&scene.rabbit!=='not-invited'&&!scene.recognized&&(scene.arrowReady||scene.cardReady))description+=' Later preparations do not repeat the invitation or move Rabbit; the earlier consequence remains.';
 description+=requestFulfilled?' The stated request is fulfilled.':' The stated request is not fulfilled. You may keep this unfinished or unexpected version.';
 return {startingScene:clone(source.startingScene),transitions,terminalScene:scene,blockedAction,requestFulfilled,description};
}
function freshWork(source){return {source:clone(source),page:'purpose',plan:[],strip:[],text:'',textRevision:0,productionReport:'not-stated',readingReport:'unknown',humanRead:null,helpTopic:null,exampleStep:0,support:[],seen:false,familiar:false,runs:[],kept:[],nextRunId:1,nextKeepId:1,playback:null};}
const fresh=()=>({version:1,selected:{post:'pocket-note',loft:'pocket-note'},cases:Object.fromEntries(instructionCases.map(c=>[c.id,freshWork(c)]))});
const commonKeys=['source','plan','strip','text','textRevision','productionReport','readingReport','support','familiar','priorExposureUnknown'];
const common=(w,unknown)=>({source:clone(w.source),plan:[...w.plan],strip:clone(w.strip),text:w.text,textRevision:w.textRevision,productionReport:w.productionReport,readingReport:w.readingReport,support:[...w.support],familiar:w.familiar,priorExposureUnknown:unknown});
function validCommon(s,source,unknown){return validSource(s.source)&&s.source.id===source.id&&validPlan(s.source,s.plan)&&validStrip(s.source,s.strip)&&text(s.text,1200)&&integer(s.textRevision)&&instructionProductionReports.includes(s.productionReport)&&instructionReadingReports.includes(s.readingReport)&&supports(s.support)&&typeof s.familiar==='boolean'&&s.priorExposureUnknown===unknown;}
const runKeys=['id','source','strip','productionReport','readingReport','support','familiar','priorExposureUnknown','startingScene','transitions','terminalScene','blockedAction','requestFulfilled','description'];
function validRun(run,source,unknown){
 if(!keys(run,runKeys)||!integer(run.id,1)||!validSource(run.source)||run.source.id!==source.id||!validStrip(run.source,run.strip)||!supports(run.support)||!instructionProductionReports.includes(run.productionReport)||!instructionReadingReports.includes(run.readingReport)||typeof run.familiar!=='boolean'||run.priorExposureUnknown!==unknown)return false;
 // A frozen run keeps its outcome as recorded: check ids and shape, never re-run it or compare its text.
 const t=run.transitions;
 return Array.isArray(t)&&t.length<=run.strip.length&&t.every((x,i)=>object(x)&&x.actionId===run.strip[i].actionId&&x.variant===run.strip[i].variant&&object(x.after))&&object(run.startingScene)&&typeof run.requestFulfilled==='boolean';
}
const humanKeys=['text','textRevision','question','comment','productionReport','readingReport','support','priorExposureUnknown'];
function validHuman(h,w,unknown){return h===null||keys(h,humanKeys)&&text(h.text,1200)&&integer(h.textRevision)&&h.textRevision<=w.textRevision&&instructionQuestions.includes(h.question)&&text(h.comment,400)&&instructionProductionReports.includes(h.productionReport)&&instructionReadingReports.includes(h.readingReport)&&supports(h.support)&&h.priorExposureUnknown===unknown&&(h.textRevision!==w.textRevision||h.text===w.text);}
function validWork(w,id,unknown){
 const workKeys=['source','page','plan','strip','text','textRevision','productionReport','readingReport','humanRead','helpTopic','exampleStep','support','seen','familiar','runs','kept','nextRunId','nextKeepId','playback'];
 if(!keys(w,workKeys)||w.source?.id!==id||!validCommon({...w,priorExposureUnknown:unknown},w.source,unknown)||!instructionPages.includes(w.page)||!(w.helpTopic===null||instructionHelpTopics.includes(w.helpTopic))||!integer(w.exampleStep,0,instructionExample.steps.length-1)||typeof w.seen!=='boolean'||!Array.isArray(w.runs)||w.runs.length>24||!Array.isArray(w.kept)||w.kept.length>16||!integer(w.nextRunId,1)||!integer(w.nextKeepId,1)||!validHuman(w.humanRead,w,unknown))return false;
 let previous=null;
 for(const run of w.runs){
  if(!validRun(run,w.source,unknown)||run.id>=w.nextRunId||previous&&run.id!==previous.id+1)return false;
  previous=run;
 }
 if(w.runs.length!==Math.min(24,w.nextRunId-1)||w.runs.length&&w.runs.at(-1).id!==w.nextRunId-1)return false;
 let priorId=0;
 for(const kept of w.kept){
  if(!keys(kept,['id',...commonKeys,'run','humanRead'])||!integer(kept.id,1)||kept.id<=priorId||kept.id>=w.nextKeepId||!validCommon(kept,w.source,unknown)||kept.textRevision>w.textRevision||!validHuman(kept.humanRead,kept,unknown))return false;
  if(kept.run!==null&&(!validRun(kept.run,kept.source,unknown)||!same(kept.strip,kept.run.strip)||kept.run.id>=w.nextRunId))return false;
  priorId=kept.id;
 }
 if(w.kept.length!==Math.min(16,w.nextKeepId-1)||w.kept.length&&w.kept.at(-1).id!==w.nextKeepId-1)return false;
 if(w.playback!==null){
  if(!keys(w.playback,['runId','cursor']))return false;
  const run=w.runs.find(r=>r.id===w.playback.runId);
  if(!run||!same(run.strip,w.strip)||!integer(w.playback.cursor,0,run.transitions.length))return false;
 }
 return true;
}
export function validInstructions(root){
 if(!object(root)||!keys(root,['version','selected','cases',...(Object.hasOwn(root,'recovered')?['recovered']:[])])||root.version!==1||!keys(root.selected,desks)||!keys(root.cases,instructionCases.map(c=>c.id))||!desks.every(d=>!!instructionCase(root.selected[d])))return false;
 return Object.entries(root.cases).every(([id,w])=>validWork(w,id,Object.hasOwn(root,'recovered')));
}
export function instructionState(state){return !Object.hasOwn(state,'instructionNotes')?fresh():validInstructions(state.instructionNotes)?state.instructionNotes:null;}
export function instructionView(state,desk='post'){
 const root=instructionState(state);
 if(!root)return {unsupported:true,raw:state.instructionNotes};
 if(!desks.includes(desk))return null;
 const w=root.cases[root.selected[desk]],run=w.playback?w.runs.find(r=>r.id===w.playback.runId):null,cursor=w.playback?.cursor??0;
 const source=instructionCase(w.source.id);
 return {unsupported:false,root,case:w,source,run,cursor,scene:run?(cursor?run.transitions[cursor-1].after:run.startingScene):source.startingScene,humanRead:w.humanRead,humanReadCurrent:!!w.humanRead&&w.humanRead.textRevision===w.textRevision,priorExposureUnknown:Object.hasOwn(root,'recovered')};
}
// Called for an actual route arrival, never during a read/render. A first arrival starts the notebook.
export function noteInstructionEntry(state,desk){
 if(!desks.includes(desk))return false;
 if(!Object.hasOwn(state,'instructionNotes'))state.instructionNotes=fresh();
 const root=instructionState(state);if(!root)return false;
 const w=root.cases[root.selected[desk]];
 if(w.seen){if(w.familiar)return false;w.familiar=true;}else w.seen=true;
 return true;
}
function change(state,desk,fn){
 if(!desks.includes(desk))return false;
 const root=instructionState(state);if(!root)return false;
 for(const c of Object.values(root.cases))c.source=clone(instructionCase(c.source.id));
 const w=root.cases[root.selected[desk]];
 if(!fn(root,w))return false;
 w.seen=true;state.instructionNotes=root;return true;
}
const support=(w,kind)=>{if(!w.support.includes(kind))w.support.push(kind);};
export function chooseInstructionCase(state,desk,id){return change(state,desk,(r)=>{if(!instructionCase(id))return false;const w=r.cases[id];if(w.seen)w.familiar=true;w.seen=true;r.selected[desk]=id;return true;});}
export function setInstructionPage(state,desk,page){return change(state,desk,(r,w)=>{if(!instructionPages.includes(page))return false;w.page=page;return true;});}
function edit(items,operation,id,make){
 const index=items.findIndex(x=>(typeof x==='string'?x:x.actionId)===id);
 if(operation==='add'){if(index!==-1)return false;items.push(make(id));return true;}
 if(index===-1)return false;
 if(operation==='remove'){items.splice(index,1);return true;}
 const target=index+(operation==='earlier'?-1:operation==='later'?1:0);
 if(target===index||target<0||target>=items.length)return false;
 [items[index],items[target]]=[items[target],items[index]];return true;
}
export function editInstructionPlan(state,desk,operation,id){return change(state,desk,(r,w)=>!!action(w.source,id)&&edit(w.plan,operation,id,x=>x));}
export function editInstructionStrip(state,desk,operation,id,variant='A'){return change(state,desk,(r,w)=>{
 if(!action(w.source,id)||!['A','B'].includes(variant))return false;
 if(operation==='variant'){
  const s=w.strip.find(s=>s.actionId===id);if(!s||s.variant===variant)return false;s.variant=variant;
 }else if(!edit(w.strip,operation,id,actionId=>({actionId,variant})))return false;
 support(w,'suppliedAssembly');w.playback=null;return true;
});}
export function copyInstructionPlan(state,desk){return change(state,desk,(r,w)=>{w.strip=w.plan.map(actionId=>({actionId,variant:'A'}));support(w,'suppliedAssembly');w.playback=null;return true;});}
export function tryInstructionStrip(state,desk){return change(state,desk,(r,w)=>{
 if(w.nextRunId>=instructionSequenceLimit)return false;
 const run={id:w.nextRunId++,source:clone(w.source),strip:clone(w.strip),productionReport:w.productionReport,readingReport:w.readingReport,support:[...w.support],familiar:w.familiar,priorExposureUnknown:Object.hasOwn(r,'recovered'),...runInstructionModel(w.source,w.strip)};
 w.runs.push(run);w.runs=w.runs.slice(-24);w.playback={runId:run.id,cursor:0};if(!run.transitions.length)support(w,'runFeedback');w.familiar=true;return true;
});}
export function stepInstructionRun(state,desk,direction){return change(state,desk,(r,w)=>{
 if(![-1,1].includes(direction)||!w.playback)return false;
 const run=w.runs.find(x=>x.id===w.playback.runId),cursor=w.playback.cursor+direction;
 if(cursor<0||cursor>run.transitions.length)return false;w.playback.cursor=cursor;if(cursor>0)support(w,'runFeedback');return true;
});}
// An older run is selected only while its complete strip is still the current strip.
// Other earlier runs remain readable as frozen snapshots in the history.
export function selectInstructionRun(state,desk,id){return change(state,desk,(r,w)=>{const run=w.runs.find(x=>x.id===id);if(!run||!same(run.strip,w.strip))return false;w.playback={runId:id,cursor:0};return true;});}
export function setInstructionText(state,desk,value){return change(state,desk,(r,w)=>{if(!text(value,1200)||w.textRevision>=instructionSequenceLimit)return false;if(w.text!==value){w.text=value;w.textRevision++;}return true;});}
export function setInstructionReport(state,desk,kind,value){return change(state,desk,(r,w)=>{if(kind==='production'&&instructionProductionReports.includes(value))w.productionReport=value;else if(kind==='reading'&&instructionReadingReports.includes(value))w.readingReport=value;else return false;return true;});}
export function readInstructionWords(state,desk,question){return change(state,desk,(r,w)=>{
 if(question!==undefined&&!instructionQuestions.includes(question))return false;
 if(w.humanRead&&w.humanRead.textRevision===w.textRevision&&w.humanRead.text===w.text){
  if(question!==undefined)w.humanRead.question=question;
  return true;
 }
 support(w,'humanRead');
 w.humanRead={text:w.text,textRevision:w.textRevision,question:question??'What happens first?',comment:'',productionReport:w.productionReport,readingReport:w.readingReport,support:[...w.support],priorExposureUnknown:Object.hasOwn(r,'recovered')};return true;
});}
export function setInstructionComment(state,desk,value){return change(state,desk,(r,w)=>{if(!w.humanRead||!text(value,400))return false;w.humanRead.comment=value;return true;});}
export function useInstructionSupport(state,desk,kind){return change(state,desk,(r,w)=>{if(!['narration','together','comparison','cause','runFeedback'].includes(kind)||kind==='runFeedback'&&!w.runs.length)return false;support(w,kind);return true;});}
export function setInstructionHelp(state,desk,topic){return change(state,desk,(r,w)=>{
 if(topic!==null&&!instructionHelpTopics.includes(topic))return false;w.helpTopic=topic;
 if(topic){support(w,`help:${topic}`);if(topic==='purpose')support(w,'comparison');if(topic==='cause')support(w,'cause');if(topic==='example')support(w,'example');}return true;
});}
export function stepInstructionExample(state,desk,direction=1){return change(state,desk,(r,w)=>{const next=w.exampleStep+direction;if(![-1,1].includes(direction)||next<0||next>=instructionExample.steps.length)return false;w.helpTopic='example';support(w,'help:example');support(w,'example');w.exampleStep=next;return true;});}
function keptSnapshot(r,w,id){return {id,...common(w,Object.hasOwn(r,'recovered')),run:w.playback?clone(w.runs.find(run=>run.id===w.playback.runId)):null,humanRead:clone(w.humanRead)};}
export function keepInstructionDraft(state,desk){return change(state,desk,(r,w)=>{if(w.nextKeepId>=instructionSequenceLimit)return false;w.kept.push(keptSnapshot(r,w,w.nextKeepId++));w.kept=w.kept.slice(-16);return true;});}
export function updateInstructionKeep(state,desk,id){return change(state,desk,(r,w)=>{const i=w.kept.findIndex(k=>k.id===id);if(i===-1)return false;w.kept[i]=keptSnapshot(r,w,id);return true;});}
export function recoverInstructions(state){if(!Object.hasOwn(state,'instructionNotes')||validInstructions(state.instructionNotes))return false;const root=fresh();root.recovered=clone(state.instructionNotes);root.cases[root.selected.post].seen=true;state.instructionNotes=root;return true;}
export const instructionExposureFacts=()=>[];
export function instructionNotes(state){
 const root=instructionState(state);if(!root)return ['Instructions for a Reader: saved material is unavailable; the exact original payload remains in the local export.'];
 const lines=['Instructions for a Reader — shared Post/Loft notebook.','Supplied strips are supplied assembly. Production and reading reports are reports, not verified independence or comprehension.','Local history keeps at most 24 runs and 16 kept versions per case; current work is separate. Oral work may have a blank draft.'];
 if(Object.hasOwn(root,'recovered'))lines.push('Earlier unsupported history was retained under recovery. Prior exposure is unknown.');
 for(const w of Object.values(root.cases)){
  lines.push(w.source.title,`Request: ${w.source.request}`,`Plan: ${w.plan.join(' → ')||'(empty)'}`,`Supplied strip: ${w.strip.map(s=>action(w.source,s.actionId).variants[s.variant]).join(' ')||'(empty)'}`,`Own words (exact):\n${w.text}`,`Production report: ${w.productionReport}; reading report: ${w.readingReport}.`, `Seen: ${w.seen}; familiar: ${w.familiar}; displayed support: ${w.support.join(', ')||'none recorded'}.`);
  if(w.humanRead)lines.push(`Human-read snapshot${w.humanRead.textRevision===w.textRevision?' (current)':' (earlier draft)'}:\n${w.humanRead.text}`,`Human question: ${w.humanRead.question}`,`Human comment (exact):\n${w.humanRead.comment}`);
  for(const run of w.runs)lines.push(`Run ${run.id} (local sequence): ${run.strip.map(s=>action(run.source,s.actionId).variants[s.variant]).join(' ')||'(empty)'}`,run.description,`Contemporaneous support: ${run.support.join(', ')||'none recorded'}; production ${run.productionReport}; reading ${run.readingReport}; familiar ${run.familiar}; prior exposure unknown ${run.priorExposureUnknown}.`);
  for(const k of w.kept)lines.push(`Kept version ${k.id} (local sequence):\n${k.text}`,`Plan: ${k.plan.join(' → ')||'(empty)'}`,`Supplied strip: ${k.strip.map(s=>action(k.source,s.actionId).variants[s.variant]).join(' ')||'(empty)'}`,`Production ${k.productionReport}; reading ${k.readingReport}; support ${k.support.join(', ')||'none recorded'}; prior exposure unknown ${k.priorExposureUnknown}.`,...(k.run?[`Embedded run ${k.run.id}: ${k.run.description}`]:[]),...(k.humanRead?[`Embedded human-read snapshot:\n${k.humanRead.text}`,`Question: ${k.humanRead.question}`,`Comment (exact):\n${k.humanRead.comment}`]:[]));
 }
 return lines;
}
