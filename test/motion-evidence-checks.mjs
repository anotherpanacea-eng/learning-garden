import assert from 'node:assert/strict';
import {motionView,validMotionWork,startMotion,setMotionField,showMotionHelp,checkMotion,skipMotion,revealMotionData,keepMotion,setMotionModel} from '../dist/motion-evidence-core.mjs';
import {motionLessons} from '../dist/motion-evidence-content.mjs';
import {motionPage,motionNotes} from '../dist/motion-evidence-ui.mjs';
const options={canExport:()=>true},fresh=()=>({other:{waiting:'synthetic draft'}});let checks=0;
const ok=(v,m)=>{assert.ok(v,m);checks++;};
let s=fresh();const otherRef=s.other,before=structuredClone(s);ok(motionView(s).status==='missing','passive missing view');ok(!Object.hasOwn(s,'motionEvidence'),'view allocates nothing');
for(const lesson of motionLessons){
 ok(startMotion(s,lesson.id,options),'open every lesson');let w=motionView(s).work;ok(validMotionWork(w),'fresh work valid');
 for(const q of w.source.items){
  ok(showMotionHelp(s,q.id+':hint',options),'per-item hint');ok(skipMotion(s,q.id,options),'per-item skip');
  if(w.source.newMessage&&q===w.source.items[1])ok(revealMotionData(s,options),'new data reveal');
  const right=q.choices.find(c=>c.outcome==='match');ok(setMotionField(s,q.id,right.id,options),'choice saved');ok(checkMotion(s,q.id,options).outcome==='match','finite keyed check');
  ok(motionView(s).work.checks.at(-1).helpSeenBefore.includes(q.id+':hint'),'help frozen before check');
 }
 ok(setMotionField(s,'explanation','  Original synthetic words.\n',options),'exact original draft');ok(keepMotion(s,options),'first keep');
 ok(setMotionField(s,'revision',' Revised synthetic words. ',options),'exact revision');ok(keepMotion(s,options),'latest keep');ok(motionView(s).work.drafts.explanation==='  Original synthetic words.\n','no normalization');
}
ok(s.other===otherRef&&JSON.stringify(s.other)===JSON.stringify(before.other),'foreign waiting branch unchanged');
s=fresh();startMotion(s,motionLessons[0].id,options);let w=motionView(s).work;const originalTitle=w.source.title;motionLessons[0].title='Changed live wording';ok(motionView(s).work.source.title===originalTitle,'frozen source unchanged by author update');motionLessons[0].title=originalTitle;
const first=w.source.items[0];setMotionField(s,first.id,first.choices[0].id,options);checkMotion(s,first.id,options);let old=structuredClone(motionView(s).work.checks);ok(validMotionWork(motionView(s).work),'saved outcomes validate own frozen choices');
for(let i=0;i<40;i++)checkMotion(s,first.id,options);ok(motionView(s).work.checks.length===24,'bounded recent checks');
const calls=[x=>startMotion(x,motionLessons[0].id),x=>setMotionField(x,'explanation','x'),x=>showMotionHelp(x,'hint'),x=>checkMotion(x,first.id),x=>skipMotion(x,first.id),x=>keepMotion(x),x=>revealMotionData(x)];
for(const fn of calls){const b=JSON.stringify(s);ok(fn(s)===false,'missing actual preflight refuses');ok(JSON.stringify(s)===b,'refusal unchanged');}
const fail={canExport:()=>false},q=motionView(s).work.source.items[0];
const rejected=[()=>startMotion(s,motionLessons[1].id,fail),()=>setMotionField(s,'explanation','unsaved',fail),()=>showMotionHelp(s,'q:hint',fail),()=>skipMotion(s,q.id,fail),()=>checkMotion(s,q.id,fail),()=>keepMotion(s,fail)];
for(const fn of rejected){const b=JSON.stringify(s);ok(fn()===false,'actual host refusal');ok(JSON.stringify(s)===b,'host refusal unchanged');}
const future=fresh();future.motionEvidence={version:99,raw:{unknown:'preserve'}};const futureBefore=JSON.stringify(future);ok(motionView(future).status==='unavailable','future root read-only');ok(!startMotion(future,motionLessons[0].id,options),'future start refuses');ok(JSON.stringify(future)===futureBefore,'future unchanged');
s=fresh();startMotion(s,motionLessons[0].id,options);s.motionEvidence.lessons[motionLessons[0].id]={broken:'preserve'};ok(startMotion(s,motionLessons[1].id,options),'malformed child isolates');ok(s.motionEvidence.lessons[motionLessons[0].id].broken==='preserve','malformed raw retained');
const k=motionLessons[1].id;s.motionEvidence.lessons['saved-other']=structuredClone(s.motionEvidence.lessons[k]);s.motionEvidence.lessons['saved-other'].source.id='saved-other';ok(startMotion(s,'saved-other',options),'unknown saved readable child opens');
ok(!setMotionField(s,'explanation','x'.repeat(1201),options),'text bound refuses');ok(motionView(s).work.drafts.explanation==='','bounded text never silently truncated');
console.log(`${checks} motion-evidence checks passed`);
s=fresh();startMotion(s,'arrows',options);ok(setMotionModel(s,'left',8,options),'bounded slider');ok(!setMotionModel(s,'right',3,options),'nonmodel increment refuses');let b=JSON.stringify(s);ok(!setMotionModel(s,'right',4,{canExport:()=>false}),'model host refusal');ok(JSON.stringify(s)===b,'model refusal unchanged');ok(motionPage(s).includes('−4 N · left'),'negative direction task');ok(motionPage(s,'design').includes('Start or continue this lesson'),'requested future lesson preview');ok(motionView(s).work.source.id==='arrows','preview does not switch');startMotion(s,'design',options);setMotionField(s,'explanation','Synthetic constrained choice.',options);revealMotionData(s,options);ok(motionView(s).work.firstKept.drafts.explanation==='Synthetic constrained choice.','new requirement retains original');ok(motionPage(s).includes('depth at most 3 cm'),'new constraint visible');ok(motionNotes(s).includes('Synthetic constrained choice.'),'exact notes');
console.log(`Final ${checks} assertions passed`);
