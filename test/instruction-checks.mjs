import assert from 'node:assert/strict';
import {instructionCases,instructionComparison,instructionExample} from '../dist/instruction-content.mjs';
import * as I from '../dist/instruction-core.mjs';
const copy=x=>structuredClone(x),view=s=>I.instructionView(s,'post'),work=s=>view(s).case;
const valid=s=>assert.equal(I.validInstructions(s.instructionNotes),true);
const subsets=ids=>[[],...ids.flatMap((id,i)=>subsets(ids.filter((_,j)=>j!==i)).map(rest=>[id,...rest]))];
const presentations=plan=>plan.length?presentations(plan.slice(1)).flatMap(rest=>['A','B'].map(variant=>[{actionId:plan[0],variant},...rest])):[[]];

// Independent finite oracle: compare every before/after scene and the precise stop location.
function oracle(id,strip){
 let scene=id==='pocket-note'?{note:'unfolded-table',envelope:'open'}:{arrowReady:false,cardReady:false,rabbit:'not-invited',recognized:false};
 const transitions=[];let blockedAction=null;
 for(const {actionId} of strip){
  const before=copy(scene);let blocked=false;
  if(id==='pocket-note'){
   if(actionId==='fold'){blocked=!scene.note.endsWith('table');if(!blocked)scene.note='folded-table';}
   if(actionId==='insert'){blocked=scene.note!=='folded-table'||scene.envelope!=='open';if(!blocked)scene.note='inside';}
   if(actionId==='seal'){blocked=scene.envelope!=='open';if(!blocked)scene.envelope='sealed';}
  }else{
   if(actionId==='arrow')scene.arrowReady=true;
   if(actionId==='card')scene.cardReady=true;
   if(actionId==='invite'){scene.rabbit=scene.arrowReady?'table':'fork';scene.recognized=scene.arrowReady&&scene.cardReady;}
  }
  transitions.push({actionId,before,after:copy(scene),blocked});
  if(blocked){blockedAction=actionId;break;}
 }
 return {transitions,terminalScene:scene,blockedAction,requestFulfilled:id==='pocket-note'?scene.note==='inside'&&scene.envelope==='sealed':scene.rabbit==='table'&&scene.recognized};
}
const untouched={messages:{synthetic:'retained'},letterTrail:{version:99},loft:{show:['paper']},other:{preserve:true}},before=copy(untouched);
I.instructionState(untouched);I.instructionView(untouched);I.instructionNotes(untouched);assert.deepEqual(untouched,before);
const arrived=copy(untouched);assert.equal(I.noteInstructionEntry(arrived,'post'),true);assert.equal(arrived.instructionNotes.cases['pocket-note'].seen,true);assert.equal(arrived.instructionNotes.cases['pocket-note'].familiar,false);
assert.equal(I.noteInstructionEntry(arrived,'post'),true);assert.equal(arrived.instructionNotes.cases['pocket-note'].familiar,true);assert.deepEqual({...arrived,instructionNotes:undefined},{...before,instructionNotes:undefined});
assert.deepEqual(I.instructionExposureFacts(),[]);
assert.equal(instructionCases.length,2);
assert.equal(instructionComparison.invitation,'Come and watch our puppet show at the welcome table.');
assert.equal(instructionComparison.instruction,'Put the welcome card on the table.');
assert.equal(instructionComparison.question,'Does this invite someone to watch, or tell a helper how to prepare the show?');
assert.deepEqual(instructionExample.sentences,['Put the toy in the box.','Close the box.']);
assert.ok(instructionCases[0].startingDescription.includes('too wide'));
assert.ok(instructionCases[1].readerKnowledge.includes('cannot see the table from the fork'));
let presentationCount=0,successCount=0;
for(const source of instructionCases){
 const plans=subsets(source.actions.map(a=>a.id));assert.equal(plans.length,16);
 let count=0;
 for(const plan of plans){
  const state={};I.chooseInstructionCase(state,'post',source.id);
  for(const id of plan)assert.equal(I.editInstructionPlan(state,'post','add',id),true);
  assert.deepEqual(work(state).plan,plan);assert.deepEqual(work(state).strip,[]);
  assert.equal(I.editInstructionPlan(state,'post','add',plan[0]||'invalid'),false);
  for(const strip of presentations(plan)){
   const model=I.runInstructionModel(source,strip),expected=oracle(source.id,strip);
   assert.deepEqual(model.transitions.map(({actionId,before,after,blocked})=>({actionId,before,after,blocked})),expected.transitions);
   for(const k of ['terminalScene','blockedAction','requestFulfilled'])assert.deepEqual(model[k],expected[k]);
   assert.deepEqual(model.startingScene,source.startingScene);
   assert.deepEqual(model.transitions.map(t=>t.wording),strip.slice(0,model.transitions.length).map(s=>source.actions.find(a=>a.id===s.actionId).variants[s.variant]));
   const baseline=I.runInstructionModel(source,strip.map(s=>({...s,variant:'A'})));
   assert.deepEqual(model.terminalScene,baseline.terminalScene);assert.equal(model.blockedAction,baseline.blockedAction);assert.equal(model.requestFulfilled,baseline.requestFulfilled);
   const runState={};I.chooseInstructionCase(runState,'post',source.id);
   for(const s of strip)I.editInstructionStrip(runState,'post','add',s.actionId,s.variant);
   I.tryInstructionStrip(runState,'post');const frozen=copy(work(runState).runs[0]);
   assert.deepEqual(view(runState).scene,source.startingScene);
   for(const transition of model.transitions){assert.equal(I.stepInstructionRun(runState,'post',1),true);assert.deepEqual(view(runState).scene,transition.after);}
   assert.equal(I.stepInstructionRun(runState,'post',1),false);
   for(let n=model.transitions.length;n>0;n--)assert.equal(I.stepInstructionRun(runState,'post',-1),true);
   assert.equal(I.stepInstructionRun(runState,'post',-1),false);assert.deepEqual(work(runState).runs[0],frozen);valid(runState);
   presentationCount++;count++;if(model.requestFulfilled)successCount++;
  }
  valid(state);
 }
 assert.equal(count,79);
}
assert.equal(presentationCount,158);assert.equal(successCount,24);
const pocket=instructionCases[0],welcome=instructionCases[1],strip=(...ids)=>ids.map(actionId=>({actionId,variant:'A'}));
assert.equal(I.runInstructionModel(pocket,strip('insert')).transitions[0].description,'This note is too wide for this envelope. It is still on the table.');
assert.equal(I.runInstructionModel(pocket,strip('seal','insert')).transitions[1].description,'The envelope is sealed. The note is still outside.');
assert.equal(I.runInstructionModel(pocket,strip('seal')).transitions[0].blocked,false);
for(const ids of [['invite','arrow','card'],['card','invite','arrow']]){
 const result=I.runInstructionModel(welcome,strip(...ids));assert.equal(result.terminalScene.rabbit,'fork');assert.equal(result.terminalScene.recognized,false);assert.equal(result.requestFulfilled,false);assert.equal(result.blockedAction,null);
}
const noCard=I.runInstructionModel(welcome,strip('arrow','invite','card'));assert.equal(noCard.terminalScene.rabbit,'table');assert.equal(noCard.terminalScene.recognized,false);assert.equal(noCard.requestFulfilled,false);
assert.equal(pocket.cause,'Fold the note before you put it in the envelope, because the unfolded note is too wide.');
assert.equal(pocket.reversedCause,'The note is too wide because you folded it.');
assert.equal(welcome.cause,'Put the arrow at the fork before inviting Rabbit, because Rabbit does not know the way.');
assert.equal(welcome.reversedCause,'Rabbit does not know the way because you put out the arrow.');
const noWrites={};for(const attempt of [()=>I.setInstructionText(noWrites,'post','x'.repeat(1201)),()=>I.editInstructionPlan(noWrites,'post','add','invented'),()=>I.setInstructionPage(noWrites,'post','invented'),()=>I.chooseInstructionCase(noWrites,'post','invented'),()=>I.tryInstructionStrip(noWrites,'invented')]){assert.equal(attempt(),false);assert.deepEqual(noWrites,{});}

const state=copy(untouched);I.chooseInstructionCase(state,'post','pocket-note');
assert.deepEqual(work(state).plan,[]);assert.deepEqual(work(state).strip,[]);
for(const id of ['fold','insert','seal'])I.editInstructionPlan(state,'post','add',id);
I.copyInstructionPlan(state,'post');assert.ok(work(state).support.includes('suppliedAssembly'));
I.tryInstructionStrip(state,'post');const frozen=copy(work(state).runs[0]);assert.equal(frozen.requestFulfilled,true);
I.editInstructionPlan(state,'post','later','fold');assert.deepEqual(work(state).strip,frozen.strip);assert.ok(work(state).playback);
I.editInstructionStrip(state,'post','variant','fold','B');assert.equal(work(state).playback,null);assert.deepEqual(work(state).runs[0],frozen);
assert.deepEqual(work(state).plan,['insert','fold','seal']);
I.editInstructionStrip(state,'post','earlier','seal');assert.deepEqual(work(state).plan,['insert','fold','seal']);
I.editInstructionStrip(state,'post','later','seal');I.editInstructionStrip(state,'post','remove','seal');assert.equal(work(state).strip.length,2);
I.editInstructionStrip(state,'post','add','seal');valid(state);
assert.deepEqual({messages:state.messages,letterTrail:state.letterTrail,loft:state.loft,other:state.other},before);

// Exact words, including blank oral work and Unicode, remain outside the runner.
const exact='  e\u0301 🐇\n<script>fold insert seal</script>  ';
I.setInstructionText(state,'post',exact);I.setInstructionReport(state,'post','production','dictated');I.setInstructionReport(state,'post','reading','together');
I.readInstructionWords(state,'post','Which thing?');I.setInstructionComment(state,'post','  Where?\n🐾  ');
const human=copy(work(state).humanRead),runs=copy(work(state).runs);
I.setInstructionReport(state,'post','production','typed');I.setInstructionReport(state,'post','reading','self');I.useInstructionSupport(state,'post','narration');
I.readInstructionWords(state,'post');assert.deepEqual(work(state).humanRead,human);
I.readInstructionWords(state,'post','Where?');assert.deepEqual(work(state).humanRead,{...human,question:'Where?'});
I.readInstructionWords(state,'post','Which thing?');assert.deepEqual(work(state).humanRead,human);
I.setInstructionText(state,'post','different');assert.deepEqual(work(state).humanRead,human);assert.equal(view(state).humanReadCurrent,false);assert.deepEqual(work(state).runs,runs);
I.setInstructionText(state,'post',exact);assert.equal(view(state).humanReadCurrent,false);
assert.equal(I.setInstructionText(state,'post','x'.repeat(1201)),false);assert.equal(work(state).text,exact);
assert.equal(I.setInstructionComment(state,'post','x'.repeat(401)),false);assert.equal(work(state).humanRead.comment,human.comment);
assert.equal(I.setInstructionText(state,'post','x'.repeat(1200)),true);assert.equal(I.setInstructionComment(state,'post','x'.repeat(400)),true);
I.setInstructionText(state,'post','');I.readInstructionWords(state,'post','Why?');I.keepInstructionDraft(state,'post');assert.equal(work(state).kept.at(-1).text,'');valid(state);

// Shared case work, independent desk selections, optional support and examples.
I.chooseInstructionCase(state,'loft','pocket-note');assert.equal(I.instructionView(state,'loft').case,work(state));
I.chooseInstructionCase(state,'loft','welcome-table');assert.equal(view(state).source.id,'pocket-note');
assert.equal(I.instructionView(state,'loft').source.id,'welcome-table');
const live=copy({plan:work(state).plan,strip:work(state).strip,text:work(state).text});
I.setInstructionHelp(state,'post','purpose');assert.ok(work(state).support.includes('comparison'));
I.setInstructionHelp(state,'post','cause');assert.ok(work(state).support.includes('cause'));
for(let n=0;n<8;n++)I.stepInstructionExample(state,'post');assert.equal(work(state).exampleStep,instructionExample.steps.length-1);
assert.equal(I.stepInstructionExample(state,'post',-1),true);assert.equal(work(state).exampleStep,instructionExample.steps.length-2);
assert.deepEqual({plan:work(state).plan,strip:work(state).strip,text:work(state).text},live);
I.useInstructionSupport(state,'post','narration');I.useInstructionSupport(state,'post','together');valid(state);
assert.equal(work(state).runs[0].support.includes('example'),false);

// Frozen versions embed relevant evidence; pruning cannot redirect their references.
I.tryInstructionStrip(state,'post');I.keepInstructionDraft(state,'post');const embedded=copy(work(state).kept.at(-1));
for(let n=0;n<40;n++)I.tryInstructionStrip(state,'post');assert.equal(work(state).runs.length,24);
assert.deepEqual(work(state).kept.at(-1),embedded);assert.equal(work(state).runs.some(r=>r.id===embedded.run.id),false);
assert.equal(work(state).familiar,true);assert.ok(work(state).support.includes('example'));
for(let n=0;n<25;n++)I.keepInstructionDraft(state,'post');assert.equal(work(state).kept.length,16);
const keptFirst=work(state).kept[0].id,keepCounter=work(state).nextKeepId;I.setInstructionText(state,'post','Updated exact text');
I.updateInstructionKeep(state,'post',keptFirst);assert.equal(work(state).kept[0].text,'Updated exact text');assert.equal(work(state).nextKeepId,keepCounter);valid(state);
assert.ok(I.instructionNotes(state).join('\n').includes('Updated exact text'));

// Edits and rejected operations preserve both cases' saved sources; only a new run gets today's source.
const earlier={};I.chooseInstructionCase(earlier,'loft','welcome-table');
for(const c of instructionCases){const w=earlier.instructionNotes.cases[c.id];w.source.request=`Earlier ${c.id} request.`;w.source.actions[0].variants.A=`Earlier ${c.id} sentence.`;}
const earlierSources=Object.fromEntries(Object.entries(earlier.instructionNotes.cases).map(([id,w])=>[id,copy(w.source)]));
for(const desk of ['post','loft']){
 for(const edit of [s=>I.setInstructionText(s,desk,'A fictional edit.'),s=>I.editInstructionPlan(s,desk,'add',I.instructionView(s,desk).source.actions[0].id),s=>I.tryInstructionStrip(s,desk),s=>I.keepInstructionDraft(s,desk)]){
  const changed=copy(earlier);assert.equal(edit(changed),true);
  assert.deepEqual(Object.fromEntries(Object.entries(changed.instructionNotes.cases).map(([id,w])=>[id,w.source])),earlierSources,'editing either case preserves both saved sources');
  const w=I.instructionView(changed,desk).case;if(w.runs.length)assert.deepEqual(w.runs[0].source,instructionCases.find(c=>c.id===w.source.id));valid(changed);
 }
 for(const reject of [s=>I.setInstructionText(s,desk,'x'.repeat(1201)),s=>I.setInstructionPage(s,desk,'missing'),s=>I.chooseInstructionCase(s,desk,'missing'),s=>I.editInstructionStrip(s,desk,'remove','missing'),s=>I.stepInstructionRun(s,desk,1),s=>I.updateInstructionKeep(s,desk,999)]){
  const changed=copy(earlier);assert.equal(reject(changed),false);assert.deepEqual(changed,earlier,'rejected operation leaves both cases exact');
 }
}

// Saved wording is a frozen copy: reworded content or generated text never locks a save, and the runner uses the current case.
for(const scope of ['current','run','kept','embedded']){
 const changed=copy(state),w=work(changed),source=scope==='current'?w.source:scope==='run'?w.runs.at(-1).source:scope==='kept'?w.kept.at(-1).source:w.kept.at(-1).run.source;
 source.actions[0].variants.A='Earlier wording.';source.request='Earlier request wording.';
 if(scope==='run'){w.runs.at(-1).description='Earlier result wording.';w.runs.at(-1).transitions[0].description='Earlier step wording.';}
 assert.equal(I.validInstructions(changed.instructionNotes),true,scope);assert.equal(view(changed).unsupported,false);
 assert.deepEqual(view(changed).source,pocket);
 I.tryInstructionStrip(changed,'post');assert.deepEqual(work(changed).runs.at(-1).source,pocket);valid(changed);
}
const changedPremise=copy(pocket);changedPremise.startingDescription='The unfolded note fits already.';assert.deepEqual(I.runInstructionModel(changedPremise,strip('fold','insert','seal')),I.runInstructionModel(pocket,strip('fold','insert','seal')));
// Feedback is exposure only when a consequence is displayed, not when a run is computed.
const unseen={};I.editInstructionStrip(unseen,'post','add','fold');I.tryInstructionStrip(unseen,'post');
assert.equal(work(unseen).support.includes('runFeedback'),false);assert.equal(work(unseen).runs[0].support.includes('runFeedback'),false);
I.editInstructionStrip(unseen,'post','variant','fold','B');I.tryInstructionStrip(unseen,'post');I.tryInstructionStrip(unseen,'post');
assert.equal(work(unseen).support.includes('runFeedback'),false);assert.ok(work(unseen).runs.every(r=>!r.support.includes('runFeedback')));valid(unseen);
const beforeReveal=copy(work(unseen).runs);I.stepInstructionRun(unseen,'post',1);assert.equal(work(unseen).support.includes('runFeedback'),true);assert.deepEqual(work(unseen).runs,beforeReveal);
I.tryInstructionStrip(unseen,'post');assert.equal(work(unseen).runs.at(-1).support.includes('runFeedback'),true);valid(unseen);
const emptyShown={};I.tryInstructionStrip(emptyShown,'post');assert.equal(view(emptyShown).run.transitions.length,0);assert.equal(work(emptyShown).support.includes('runFeedback'),true);assert.equal(work(emptyShown).runs[0].support.includes('runFeedback'),false);valid(emptyShown);
const historyShown={};I.editInstructionStrip(historyShown,'post','add','fold');I.tryInstructionStrip(historyShown,'post');const historyBefore=copy(work(historyShown).runs);
I.useInstructionSupport(historyShown,'post','runFeedback');assert.deepEqual(work(historyShown).runs,historyBefore);
I.tryInstructionStrip(historyShown,'post');assert.equal(work(historyShown).runs.at(-1).support.includes('runFeedback'),true);valid(historyShown);
const noHistory={};assert.equal(I.useInstructionSupport(noHistory,'post','runFeedback'),false);assert.deepEqual(noHistory,{});
// Validate recorded structure and termination, without executing today's rules or comparing prose.
const outcomes={};for(const id of ['fold','insert','seal'])I.editInstructionStrip(outcomes,'post','add',id);I.tryInstructionStrip(outcomes,'post');I.keepInstructionDraft(outcomes,'post');
const badOutcomes=[
 r=>{r.transitions=[];r.terminalScene=null;r.blockedAction='nonexistent';r.requestFulfilled=true;},
 r=>{r.transitions=[];},r=>{r.transitions.pop();},r=>{r.transitions.push(copy(r.transitions[0]));},
 r=>{r.blockedAction='nonexistent';},r=>{r.blockedAction='fold';},r=>{r.transitions[0].blocked=true;},r=>{r.transitions.at(-1).blocked=true;},
 ...['before','after','blocked','wording','description'].map(k=>r=>{delete r.transitions[0][k];}),
 ...['startingScene','terminalScene','description'].map(k=>r=>{r[k]=null;}),
 r=>{r.description={toString:'malformed'};},r=>{r.transitions[0].description={toString:'malformed'};},
 r=>{r.transitions[0].wording=4;},r=>{r.transitions[0].blocked='false';},r=>{r.transitions[0].before=[];},
 r=>{r.transitions[0].after.note={};},r=>{r.transitions[1].before=copy(r.startingScene);},r=>{r.terminalScene=copy(r.startingScene);}
];
for(const embedded of [false,true])for(const mutate of badOutcomes){
 const bad=copy(outcomes),w=bad.instructionNotes.cases['pocket-note'];mutate(embedded?w.kept[0].run:w.runs[0]);const raw=copy(bad);
 assert.equal(I.validInstructions(bad.instructionNotes),false,mutate.toString());assert.equal(view(bad).unsupported,true);assert.deepEqual(bad,raw);
}
const blocked={};I.editInstructionStrip(blocked,'post','add','insert');I.editInstructionStrip(blocked,'post','add','fold');I.tryInstructionStrip(blocked,'post');valid(blocked);
for(const mutate of [r=>{r.blockedAction=null;},r=>{r.blockedAction='fold';},r=>{r.transitions[0].blocked=false;}]){const bad=copy(blocked);mutate(bad.instructionNotes.cases['pocket-note'].runs[0]);assert.equal(I.validInstructions(bad.instructionNotes),false);}
const historical=copy(outcomes),historicalRun=historical.instructionNotes.cases['pocket-note'].runs[0];
historicalRun.startingScene={note:'inside',envelope:'open'};historicalRun.transitions[0].before=copy(historicalRun.startingScene);historicalRun.requestFulfilled=false;historicalRun.description='Earlier recorded outcome.';historicalRun.transitions[0].wording='Earlier recorded instruction.';valid(historical);
assert.equal(view(historical).run.requestFulfilled,false,'saved outcome is not recalculated under current rules');
// Actual arrivals update sticky familiarity without altering snapshots or allocating a missing root.
const arrivals={};I.setInstructionPage(arrivals,'post','plan');const arrivalsRoot=arrivals.instructionNotes;
assert.equal(arrivalsRoot.cases['welcome-table'].seen,false);I.chooseInstructionCase(arrivals,'loft','welcome-table');
assert.equal(I.noteInstructionEntry(arrivals,'loft'),true);assert.equal(arrivalsRoot.cases['welcome-table'].familiar,true);assert.equal(I.noteInstructionEntry(arrivals,'loft'),false);
I.tryInstructionStrip(arrivals,'post');I.keepInstructionDraft(arrivals,'post');const arrivalRuns=copy(work(arrivals).runs),arrivalKeeps=copy(work(arrivals).kept);
I.noteInstructionEntry(arrivals,'post');assert.deepEqual(work(arrivals).runs,arrivalRuns);assert.deepEqual(work(arrivals).kept,arrivalKeeps);valid(arrivals);
const supportedUnseen={instructionNotes:I.instructionState({})};assert.equal(I.noteInstructionEntry(supportedUnseen,'post'),true);assert.equal(work(supportedUnseen).seen,true);assert.equal(work(supportedUnseen).familiar,false);
assert.equal(I.noteInstructionEntry(supportedUnseen,'post'),true);assert.equal(work(supportedUnseen).familiar,true);valid(supportedUnseen);
const malformed=[
 x=>work(x).source.actions[0].id='unfold',x=>work(x).strip.push(copy(work(x).strip[0])),
 x=>work(x).plan=['fold','fold'],x=>work(x).runs.at(-1).transitions[0].actionId='seal',x=>work(x).runs.at(-1).requestFulfilled='yes',
 x=>work(x).runs.at(-1).support.push('future'),
 x=>work(x).runs.at(-1).priorExposureUnknown=true,x=>work(x).runs.at(-1).id+=1,
 x=>work(x).playback.cursor=99,x=>work(x).text='a'.repeat(1201),x=>work(x).humanRead.comment='a'.repeat(401),
 x=>work(x).humanRead.textRevision=work(x).textRevision+1,x=>work(x).kept.at(-1).run.id=999999999,
 x=>work(x).support.push('invented'),x=>x.instructionNotes.cases.unexpected={},x=>x.instructionNotes.selected.post='missing',
 x=>work(x).nextRunId=Infinity,x=>work(x).unexpected=true
];
for(const mutate of malformed){const bad=copy(state);mutate(bad);assert.equal(I.validInstructions(bad.instructionNotes),false,mutate.toString());const raw=copy(bad);assert.equal(I.instructionView(bad).unsupported,true);assert.equal(I.setInstructionText(bad,'post','new'),false);assert.deepEqual(bad,raw);}
const recovered={instructionNotes:{version:88,raw:'<script>uncertain</script>',nested:{exact:['  🐇\n']}}},recoveryOriginal=copy(recovered.instructionNotes);
assert.equal(I.instructionView(recovered).unsupported,true);assert.equal(I.recoverInstructions(recovered),true);assert.deepEqual(recovered.instructionNotes.recovered,recoveryOriginal);
assert.equal(work(recovered).seen,true);assert.equal(work(recovered).familiar,false);assert.equal(recovered.instructionNotes.cases['welcome-table'].seen,false);
assert.equal(I.noteInstructionEntry(recovered,'post'),true);assert.equal(work(recovered).familiar,true);assert.equal(view(recovered).priorExposureUnknown,true);assert.equal(recovered.instructionNotes.cases['welcome-table'].seen,false);assert.equal(I.noteInstructionEntry(recovered,'post'),false);
I.tryInstructionStrip(recovered,'post');I.readInstructionWords(recovered,'post');I.keepInstructionDraft(recovered,'post');
assert.equal(work(recovered).runs[0].priorExposureUnknown,true);assert.equal(work(recovered).humanRead.priorExposureUnknown,true);assert.equal(work(recovered).kept[0].priorExposureUnknown,true);
for(let n=0;n<30;n++){I.tryInstructionStrip(recovered,'post');I.keepInstructionDraft(recovered,'post');}valid(recovered);
assert.ok(work(recovered).runs.every(r=>r.priorExposureUnknown));assert.ok(work(recovered).kept.every(k=>k.priorExposureUnknown));assert.deepEqual(recovered.instructionNotes.recovered,recoveryOriginal);
const absent={};assert.equal(I.recoverInstructions(absent),false);assert.deepEqual(absent,{});
console.log('Instructions checks passed: all158 presentations/24 successes and16 plans per case; exact transitions, independent drafts, frozen playback, reports/support, bounded keeps/history and recovery.');
