import assert from 'node:assert/strict';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {motionView,skipMotion,validMotionWork,startMotion,createMotionInvestigation,removeMotionInvestigation,motionExploration,setMotionField,checkMotion,showMotionHelp,revealMotionData,keepMotion} from '../dist/motion-evidence-core.mjs';
import {motionCase} from '../dist/motion-evidence-adaptive.mjs';
import {motionPage,motionNotes} from '../dist/motion-evidence-ui.mjs';
let count=0;const ok=(v,m)=>{assert.ok(v,m);count++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;};
const fresh=()=>initializeExplorerState(freshState()),report=s=>({title:'Synthetic notes',exportedAt:'2026-10-25T00:00:00Z',note:'Synthetic practice only',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s}),o={canExport:s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok};
const w=s=>motionView(s).work;const kinds=['forces', 'evidence', 'design'];
let s=fresh(),before=structuredClone(s);motionExploration(s);motionPage(s);motionNotes(s);eq(s,before,'render, notes and suggestion are pure');
for(const kind of kinds)for(let n=1;n<=6;n++){
 const local=fresh(),id=createMotionInvestigation(local,kind,o);ok(id,'creation passes actual pretty-report preflight');
 // Cycle explicitly through the bounded catalog, independently of live saved text.
 for(let i=1;i<n;i++)ok(createMotionInvestigation(local,kind,o));
 const work=w(local),src=work.source;eq(src.adaptive.caseId,`${kind}-${n}`);ok(validMotionWork(work));eq(src.items.filter(q=>q.choices.filter(a=>a.outcome==='match').length!==1),[],'exactly one matching supplied choice per item');
 for(const q of src.items){ok(q.guided&&q.hint&&q.example,'item support complete');if(src.newMessage&&q===src.items[1])ok(revealMotionData(local,o));const answer=q.choices.find(a=>a.outcome==='match');ok(setMotionField(local,q.id,answer.id,o));eq(checkMotion(local,q.id,o).outcome,'match');}
 ok(o.canExport(local),'completed visit remains importable');
}
s=fresh();const oldRef=s.baseline;ok(startMotion(s,'arrows',o));const fixed=structuredClone(s.motionEvidence.lessons['arrows']);let id=createMotionInvestigation(s,kinds[2],o);ok(id);eq(s.motionEvidence.lessons['arrows'],fixed,'fixed source untouched');ok(s.baseline===oldRef,'foreign root reference retained');
ok(setMotionField(s,'explanation','  Original synthetic words.\n',o));ok(keepMotion(s,o));ok(revealMotionData(s,o));ok(setMotionField(s,'revision',' Revised synthetic words. ',o));ok(keepMotion(s,o));const saved=structuredClone(w(s));ok(createMotionInvestigation(s,kinds[1],o));ok(startMotion(s,id,o));eq(w(s),saved,'new case preserves all original/revised/kept work');
const imported=prepareProgressImport(JSON.stringify(report(s),null,2));ok(imported.ok);eq(imported.state.motionEvidence,s.motionEvidence,'actual import retains full frozen source/history');
const raw=structuredClone(s);raw.motionEvidence.lessons[id].source.title='<img src=x onerror=alert(1)>';ok(motionPage(raw).includes('&lt;img'),'imported source text escaped');
for(const fn of [x=>createMotionInvestigation(x,kinds[0]),x=>removeMotionInvestigation(x,id,true),x=>createMotionInvestigation(x,kinds[0],{canExport:()=>false}),x=>removeMotionInvestigation(x,id,true,{canExport:()=>false})]){const b=structuredClone(s);eq(fn(s),false);eq(s,b,'missing or refusing actual preflight is atomic');}
let b=structuredClone(s);eq(removeMotionInvestigation(s,id,false,o),false);eq(s,b,'cancelled removal writes nothing');eq(removeMotionInvestigation(s,'arrows',true,o),false);eq(s,b,'fixed lesson protected');ok(removeMotionInvestigation(s,id,true,o));ok(!Object.hasOwn(s.motionEvidence.lessons,id));eq(s.motionEvidence.lessons['arrows'],fixed);ok(!w(s),'removing current selects no unrelated lesson');
s=fresh();id=createMotionInvestigation(s,kinds[0],o);s.motionEvidence.lessons[id].source.adaptive={version:99,raw:'retain'};ok(w(s),'malformed optional metadata leaves work readable');ok(!motionExploration(s).ready);b=structuredClone(s);eq(createMotionInvestigation(s,kinds[0],o),false);eq(s,b);ok(setMotionField(s,'explanation','still writable',o),'ordinary saved work remains editable');
s=fresh();id=createMotionInvestigation(s,kinds[0],o);s.motionEvidence.exploration={version:99,raw:'retain'};ok(w(s));b=structuredClone(s);eq(createMotionInvestigation(s,kinds[0],o),false);eq(s,b);ok(startMotion(s,'arrows',o),'bad optional root metadata isolates selection');
s=fresh();id=createMotionInvestigation(s,kinds[0],o);delete s.motionEvidence.exploration;const rawId=id.replace(/-1$/,'-700');s.motionEvidence.lessons[rawId]={broken:'keep exactly'};const nextId=createMotionInvestigation(s,kinds[0],o);ok(nextId.endsWith('-701'),'missing counters allocate above ALL raw sibling keys');eq(s.motionEvidence.lessons[rawId],{broken:'keep exactly'});
// Repeated guesses and repeated catalog visits never multiply a distinct first observation.
s=fresh();id=createMotionInvestigation(s,kinds[0],o);let q=w(s).source.items[0];ok(setMotionField(s,q.id,q.choices.find(a=>a.outcome==='match').id,o));for(let i=0;i<24;i++)ok(checkMotion(s,q.id,o));b=structuredClone(s);eq(checkMotion(s,q.id,o),false,'full check history refuses');eq(s,b,'no automatic truncation');eq(motionExploration(s).count,1);for(let i=0;i<6;i++)ok(createMotionInvestigation(s,kinds[0],o));q=w(s).source.items[0];ok(w(s).source.adaptive.revisit,'catalog repeat labelled');ok(setMotionField(s,q.id,q.choices.find(a=>a.outcome==='match').id,o));ok(checkMotion(s,q.id,o));eq(motionExploration(s).count,1,'same case/item first response counted once across visits');
s=fresh();id=createMotionInvestigation(s,kinds[2],o);q=w(s).source.items[0];ok(showMotionHelp(s,q.id+':hint',o));ok(setMotionField(s,q.id,q.choices.find(a=>a.outcome==='match').id,o));ok(checkMotion(s,q.id,o));eq(motionExploration(s).kind,kinds[2],'supported revisit targets affected concept');ok(createMotionInvestigation(s,kinds[0],o),'open override still available');
// Real import/report boundary is stricter than raw notebook serialization.
s=fresh();id=createMotionInvestigation(s,kinds[0],o);s.syntheticPadding='';let trial=structuredClone(s);ok(createMotionInvestigation(trial,kinds[1],o));const bytes=x=>new TextEncoder().encode(JSON.stringify(x,null,2)).length;s.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-bytes(report(trial))+1);ok(o.canExport(s),'earlier state fits report');b=structuredClone(s);eq(createMotionInvestigation(s,kinds[1],o),false);eq(s,b,'one-byte report overflow never evicts history');ok(removeMotionInvestigation(s,id,true,o),'explicit selected removal can free capacity');
console.log(`${count} adaptive motion source/persistence/report checks passed`);
const number=text=>Number(text.split(' ')[0]);
for(let n=1;n<=6;n++){
 const force=motionCase('forces',n),m=force.forceCase,answers=force.items.map(q=>number(q.choices.find(c=>c.outcome==='match').text));
 eq(answers,[m.right-m.left,(m.right-m.left)/m.mass,m.velocity+(m.right-m.left)/m.mass*m.seconds],'all signed model keys derive from frozen physical numbers');
 ok(force.items.every(q=>q.choices.every(c=>/^[-−+]?\d+ (N|m\/s²|m\/s)$/.test(c.text))),'all numeric distractors retain the item units');
 for(const kind of ['evidence','design']){
  const src=motionCase(kind,n),model=src.collisionModel;
  ok(model.mass===2&&model.endVelocity===0&&model.startVelocity!==0,'controlled constant-mass stopping model');
  for(const d of src.data)ok(Math.abs(d.average-model.mass*Math.abs(model.endVelocity-model.startVelocity)/d.time)<1e-7,'average magnitude formula');
  if(kind==='design'){
   const winners=['initial','revised'].map((key,i)=>{const limit=src.constraints[key],fitting=src.data.filter(d=>d.cost<=limit.cost&&d.depth<=limit.depth),minimum=Math.min(...fitting.map(d=>d.average)),winner=fitting.filter(d=>d.average===minimum);eq(winner.length,1,'brief has a unique optimum');eq(src.items[i].choices.find(c=>c.outcome==='match').text,winner[0].name,'constraint key independently derived');return winner[0].id;});ok(winners[0]!==winners[1],'changing brief changes the fitting winner');
  }
  const state=fresh();createMotionInvestigation(state,kind,o);state.motionEvidence.lessons[state.motionEvidence.currentId].source=src;const html=motionPage(state);ok(html.includes(`${model.startVelocity} m/s → 0 m/s`),'caption uses actual frozen starting velocity');
 }
}
console.log(`Final ${count} adaptive motion assertions passed`);

s=fresh();ok(startMotion(s,'arrows',o));q=motionView(s).work.source.items[0];ok(setMotionField(s,q.id,q.choices.find(c=>c.outcome==='match').id,o));for(let n=0;n<24;n++)ok(checkMotion(s,q.id,o));eq(motionExploration(s).count,0,'legacy retained checks cannot prove which attempt was first');eq(motionExploration(s).kind,kinds[0]);console.log(`Legacy provenance included: ${count} assertions passed`);

s=fresh();const oldest=createMotionInvestigation(s,kinds[0],o);createMotionInvestigation(s,kinds[2],o);q=motionView(s).work.source.items[0];showMotionHelp(s,q.id+':hint',o);setMotionField(s,q.id,q.choices[0].id,o);checkMotion(s,q.id,o);startMotion(s,oldest,o);q=motionView(s).work.source.items[0];showMotionHelp(s,q.id+':hint',o);setMotionField(s,q.id,q.choices[0].id,o);checkMotion(s,q.id,o);eq(motionExploration(s).kind,kinds[0],'latest affected concept follows response order when resuming older visit');
s=fresh();const original=createMotionInvestigation(s,kinds[0],o);for(let n=0;n<6;n++)createMotionInvestigation(s,kinds[0],o);q=motionView(s).work.source.items[0];setMotionField(s,q.id,q.choices.find(c=>c.outcome==='match').id,o);checkMotion(s,q.id,o);startMotion(s,original,o);q=motionView(s).work.source.items[0];setMotionField(s,q.id,q.choices.find(c=>c.outcome==='different').id,o);checkMotion(s,q.id,o);eq(motionExploration(s).count,1);ok(!motionExploration(s).reason.includes('needed comparison'),'earliest actual response retained across repeated catalog visits');
console.log(`Chronology included: ${count} assertions passed`);

for(let n=1;n<=6;n++){const src=motionCase('forces',n);ok(src.items[0].guided.includes('left 8 N and right 2 N'));ok(src.items[1].guided.includes('−6 N'));ok(src.items[2].example.includes('−2 m/s with acceleration +3'));for(const kind of ['evidence','design']){const c=motionCase(kind,n);ok(c.data.every(d=>d.shape<=d.depth),'lasting deformation bounded by toy depth');ok(c.teach.includes('not the stopping distance'));}}console.log(`Review repairs included: ${count} assertions passed`);

s=fresh();createMotionInvestigation(s,kinds[2],o);q=motionView(s).work.source.items[0];setMotionField(s,q.id,q.choices.find(c=>c.outcome==='different').id,o);checkMotion(s,q.id,o);const beforeSkip=motionExploration(s);skipMotion(s,q.id,o);eq(motionExploration(s).count,beforeSkip.count,'later skip does not erase earlier firstcheck');eq(motionExploration(s).kind,kinds[2]);s=fresh();createMotionInvestigation(s,kinds[1],o);q=motionView(s).work.source.items[0];skipMotion(s,q.id,o);setMotionField(s,q.id,q.choices.find(c=>c.outcome==='match').id,o);checkMotion(s,q.id,o);ok(motionView(s).work.checks[0].skippedBefore);eq(motionExploration(s).count,0,'check after a prior skip supplies no success');console.log(`Skip provenance included: ${count} assertions passed`);
