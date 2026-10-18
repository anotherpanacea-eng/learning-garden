import assert from 'node:assert/strict';
import {broadItems,ensureBroad,makeBroadObservation,broadSupportLevel,instantiateBroad} from '../dist/broad-core.mjs';
import {generatedBroad,broadFeedback} from '../dist/broad-variants.mjs';
import {broadHelper,broadHelperLimit,openBroadHelp,submitBroadHelp,broadHelpModelAction,renderBroadHelp,cleanBroadHelp} from '../dist/broad-help.mjs';
import {freshState,restoreState} from '../dist/core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
for(const authored of broadItems())for(const q of [authored,generatedBroad(authored,'help-a'),generatedBroad(authored,'help-b')]){
 check(Array.isArray(q.steps)&&q.steps.length>0&&q.childLesson.length>20,'partial steps and child explanation '+q.id);
 const h=broadHelper(q);check(h?.id&&Number.isInteger(h.answer)&&h.answer>=0&&(!h.choices||h.choices[h.answer]),'helper valid '+q.id);
 check(h.prompt!==q.prompt&&h.explanation!==q.solution&&h.model&&broadHelperLimit(h)>0,'parallel example '+q.id);
 const a={attempts:[],method:'worked'},before=JSON.stringify(a.attempts);openBroadHelp(q,a);check(a.helpUsed&&a.helper.open,'help opens');
 broadHelpModelAction(q,a,'step');broadHelpModelAction(q,a,'spot:0');check(renderBroadHelp(q,a).includes('Your question')&&renderBroadHelp(q,a).includes('Return to my question'),'render all kinds');
 check(submitBroadHelp(q,a,h.answer)&&a.helper.attempts.length===1&&JSON.stringify(a.attempts)===before,'helper cannot answer original');
 a.helper.open=false;a.attempts.push(q.answer);const o=makeBroadObservation(q,a,'checkin');check(o.supported&&!o.independent&&!o.freshEvidence&&o.supportLevel===2&&o.helper.attempts.length===1,'separate supported evidence');
 for(const [value,x]of Object.entries(q.misconceptions)){check(Number(value)!==q.answer,'misconception not answer');const f=broadFeedback(q,Number(value));check(f.message===x.message&&f.misconception===x.label,'targeted recorded feedback');}
 check(broadFeedback(q,-100).misconception===null,'unmatched generic');
 if(q.kind==='choice')check(Object.keys(q.misconceptions).length===q.choices.length-1,'each distractor feedback');
 for(const [extra,level]of [[{},0],[{hinted:true},1],[{stepsSeen:true},2],[{modelUsed:true},2],[{helpUsed:true},2],[{hinted:true,helpUsed:true,revealed:true},3]])check(broadSupportLevel(extra)===level,'support ladder');
 const dirty={helpUsed:false,helper:{exampleId:h.id,open:true,steps:1e20,spotlight:NaN,attempts:[-1,null,h.answer],input:{bad:1},choice:1e20,revealed:'no'}};cleanBroadHelp(q,dirty);check(dirty.helpUsed&&dirty.helper.steps===broadHelperLimit(h)&&dirty.helper.spotlight===null&&dirty.helper.choice===null&&dirty.helper.input===''&&dirty.helper.revealed===false,'malformed helper cleaned');
}
// Generated numbers, rather than authored numbers, drive specific feedback.
const value=generatedBroad(broadItems().find(q=>q.id==='number-anchor'),'target');check(broadFeedback(value,value.params.tens).message.includes(String(value.params.tens)),'value feedback uses operand');
const ribbon=generatedBroad(broadItems().find(q=>q.id==='measurement-anchor'),'target');check(broadFeedback(ribbon,ribbon.params.start+ribbon.params.length).misconception==='the end mark','ribbon end feedback');
// A corrupt frozen question can never supply enormous or unknown render models.
for(const mutate of [q=>q.model.rows=1e12,q=>q.prompt={},q=>q.variant.seed='a'.repeat(201),q=>q.params.type='unknown']){
 const s=freshState();ensureBroad(s);const template=broadItems().find(q=>q.id==='operations-anchor'),q=generatedBroad(template,'safe');mutate(q);s.broad.drafts[`checkin:${q.id}`]={question:q,attempts:[]};const restored=restoreState(JSON.stringify(s));ensureBroad(restored);check(!restored.broad.drafts[`checkin:${q.id}`],'corrupt frozen draft removed safely');check(Number.isInteger(instantiateBroad(restored,template).answer),'usable authored recovery');
}
const dirtyState=freshState();ensureBroad(dirtyState);dirtyState.broad.seenVariants=[null,{},'number-anchor:authored'];dirtyState.broad.drafts['checkin:number-anchor']={attempts:[],model:{type:'place',hundreds:1e20,tens:2,ones:1}};ensureBroad(dirtyState);check(!dirtyState.broad.drafts['checkin:number-anchor'].model&&dirtyState.broad.seenVariants.length===1,'malformed active model and familiarity cleaned');
console.log(`${checks} Number Garden helper checks passed.`);
