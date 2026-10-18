import assert from 'node:assert/strict';
import {POST_REVISION,places,recipients,deliveries} from '../dist/post-office-content.mjs';
import {ensurePostOffice,currentPostOffice,startPostOffice,resumePostOffice,setPostCourier,setPostComposer,clauseText,appendPostClause,editPostClause,setPostPackingInput,submitPostPacking,packPostTogether,restartPostRoute,stepPostRoute,setPostPrediction,setPostReading,setPostSupport,stepPostHelp} from '../dist/post-office-core.mjs';
let checks=0;
const check=(value,message)=>{assert.ok(value,message);checks++;};
const json=x=>JSON.stringify(x),copy=x=>JSON.parse(json(x));
const reload=s=>{const r=copy(s);ensurePostOffice(r);return r;};
const pack=(s,n=currentPostOffice(s).order.math.answer)=>{setPostPackingInput(s,String(n));submitPostPacking(s);};
const route=(s,ids)=>{for(const id of ids)check(appendPostClause(s,id),`add ${id}`);};
const run=s=>{let n=0;while(stepPostRoute(s)){if(++n>7)throw Error('A route did not stop');}return currentPostOffice(s);};
check(places.length===4&&recipients.length===6&&deliveries.length===6,'four landmarks and six original recipients/orders');
check(new Set(deliveries.map(d=>d.id)).size===6&&new Set(recipients.map(r=>r.id)).size===6,'unique authored IDs');
check(places.every(p=>typeof p.name==='string'&&Number.isFinite(p.x)&&Number.isFinite(p.y))&&recipients.every(r=>typeof r.name==='string'&&typeof r.emoji==='string'&&places.some(p=>p.id===r.place)),'illustrated content has labelled locations and recipient pictures');
check(Object.isFrozen(deliveries)&&deliveries.every(d=>Object.isFrozen(d)&&Object.isFrozen(d.math.pictures.groups)),'authored catalog is immutable');
for(const d of deliveries){
 const m=d.math,g=m.pictures.groups;
 check(m.answer===(m.kind==='add'?m.a+m.b:m.kind==='subtract'?m.a-m.b:m.a*m.b),'authored operation is correct');
 check(m.kind==='add'?g.length===2&&g[0].count===m.a&&g[1].count===m.b:m.kind==='subtract'?g.length===1&&g[0].count===m.a&&g[0].reserved===m.b:g.length===m.a&&g.every(x=>x.count===m.b),'pictures show addends, visible reserves, or exact equal groups');
 check(d.start==='post'&&recipients.find(r=>r.id===d.recipient).place===d.destination,'explicit start and consistent recipient destination');
 check(d.helper.destination!==d.destination&&d.helper.recipient!==d.recipient&&recipients.find(r=>r.id===d.helper.recipient).place===d.helper.destination&&d.helper.clauses.length===2,'separate helper demonstrates a different valid delivery');
 for(const waypoint of [false,true]){
  const s={},v=startPostOffice(s,d.id),other=places.find(p=>p.id!==d.destination&&p.id!=='post').id;
  check(v.revision===POST_REVISION&&v.order!==d&&json(v.order)===json(d),'visit freezes an exact independent content snapshot');
  pack(s);check(v.packing.packed&&!v.packing.supported&&v.packing.attempts.length===1,'correct independent packing retained');
  route(s,waypoint?[`go:${other}`,`then:${d.destination}`,'there',`give:${d.recipient}`]:[`go:${d.destination}`,`give:${d.recipient}`]);
  run(s);check(v.completed&&v.playback.status==='delivered'&&v.playback.location===d.destination&&v.checks.length===1,'direct and optional-waypoint messages deliver equally');
  const before=json(s);ensurePostOffice(s);currentPostOffice(s);check(json(s)===before,'normalization does not execute or change completed work');
  check(!stepPostRoute(s)&&v.checks.length===1,'repeated final step never duplicates completion or summary');
  restartPostRoute(s);check(v.clauses.length===(waypoint?4:2)&&v.playback.location==='post'&&v.playback.referent===null,'restart preserves draft and clears location reference');
  run(s);check(v.completed&&v.checks.length===1,'replay never duplicates a completed delivery summary');
 }
}
{
 const s={cafe:{guest:'synthetic',plate:{cloud:2}},baseline:{input:'draft'},facts:{'3x4':{count:1}}},before=json(s);
 check(!currentPostOffice(s)&&!s.postOffice.visits.length,'reading state begins no visit');
 check(!startPostOffice(s,'missing')&&!stepPostRoute(s)&&!appendPostClause(s,'go:cafe')&&!resumePostOffice(s,'missing'),'invalid or absent visit actions create no work');
 const v=startPostOffice(s,deliveries[0].id);
 route(s,['go:cafe','give:clover']);setPostPrediction(s,'cafe');
 check(v.prediction==='cafe'&&!v.predictionAfterSupport,'prediction can precede support and execution');
 stepPostRoute(s);check(v.playback.cursor===0&&v.playback.location==='post'&&v.playback.feedback.includes('sorting counter'),'unpacked route clearly requests packing without advancing');
 check(setPostComposer(s,'place','hill')&&setPostComposer(s,'recipient','wren')&&!setPostComposer(s,'place','moon')&&!setPostComposer(s,'other','cafe'),'composer selections validate their IDs');
 setPostPackingInput(s,' 007.5 ');submitPostPacking(s);
 check(v.packing.attempts[0].input===' 007.5 '&&v.packing.attempts[0].value===7.5&&!v.packing.packed&&v.packing.error,'wrong raw numeric attempt retained without losing draft');
 setPostPackingInput(s,'');submitPostPacking(s);check(v.packing.attempts.at(-1).value===null&&!v.packing.packed,'empty input is not numeric zero');
 setPostPackingInput(s,'Infinity');submitPostPacking(s);check(v.packing.attempts.at(-1).value===null,'nonfinite input is not a numeric attempt');
 pack(s);check(v.packing.attempts.length===4&&v.packing.packed&&!v.packing.error,'correct retry packs same order');
 stepPostRoute(s);check(v.playback.cursor===1&&v.playback.location==='cafe'&&v.playback.active===0&&!v.completed,'one manual action executes exactly one clause');
 const saved=copy(s),r=reload(s),rv=currentPostOffice(r);check(json(r)===json(saved)&&rv.composer.place==='hill'&&rv.composer.recipient==='wren','paused route, input, attempts, prediction and not-yet-added composer selections reload exactly');
 stepPostRoute(r);check(rv.completed&&rv.playback.status==='delivered'&&rv.order.id===v.order.id,'paused handoff resumes without restarting');
 setPostPrediction(r,'hill');setPostPrediction(r,null);setPostPrediction(r,'cafe');check(rv.predictionAfterSupport,'after-execution prediction flag is sticky');
 const {postOffice,...rest}=s;check(json(rest)===before,'post actions preserve every unrelated waiting draft and learning record');
}
{
 const s={},v=startPostOffice(s,deliveries[1].id);packPostTogether(s);route(s,['there',`give:${v.order.recipient}`]);
 stepPostRoute(s);check(v.playback.status==='clarify'&&v.playback.location==='post'&&v.playback.referent===null&&v.checks.length===1&&!v.completed,'there never borrows printed destination or previous delivery reference');
 check(!stepPostRoute(s),'clarification remains stopped until revision or restart');
 const attempts=json(v.packing),checksBefore=json(v.checks);editPostClause(s,0,'remove');appendPostClause(s,'go:hill');editPostClause(s,1,'up');
 check(v.playback.location==='post'&&v.playback.cursor===0&&v.playback.referent===null&&json(v.packing)===attempts&&json(v.checks)===checksBefore,'editing/removing/reordering resets execution but preserves packing and checks');
 run(s);check(v.completed&&v.playback.status==='delivered','revised route succeeds with same parcel');
 editPostClause(s,1,'remove');appendPostClause(s,'there');restartPostRoute(s);stepPostRoute(s);stepPostRoute(s);
 check(v.playback.location==='hill'&&v.playback.status==='ended'&&v.completed,'named place establishes there and completion stays sticky on edited replay');
 restartPostRoute(s);check(v.playback.referent===null,'run restart clears referent');
 const first=v.id;startPostOffice(s,deliveries[0].id);packPostTogether(s);route(s,['there']);stepPostRoute(s);
 check(currentPostOffice(s).playback.status==='clarify'&&currentPostOffice(s).playback.location==='post','reference never carries to another delivery');
 check(resumePostOffice(s,first)&&currentPostOffice(s).id===first,'earlier visit resumes');
}
{
 const s={},v=startPostOffice(s,deliveries[0].id);pack(s);
 route(s,['go:hill','give:ember','then:cafe','give:clover']);run(s);
 check(!v.completed&&v.playback.status==='clarify'&&v.playback.cursor===2&&v.playback.location==='hill'&&v.playback.feedback.includes('Clover'),'different recipient cannot receive requested parcel even when present');
 editPostClause(s,1,'remove');run(s);check(v.completed,'remove mistaken handoff and deliver same packed parcel');
 const t={},w=startPostOffice(t,deliveries[0].id);pack(t);route(t,['go:orchard','give:clover']);run(t);
 check(!w.completed&&w.playback.feedback.includes('Almost-Right Café'),'absent target prompts its exact waiting location');
 const u={},a=startPostOffice(u,deliveries[0].id);pack(u);route(u,['go:cafe','give:clover','then:hill']);run(u);
 check(a.playback.location==='cafe'&&a.playback.cursor===2&&a.playback.feedback.includes('unused'),'valid handoff stops before unused remaining instructions');
 const n={},b=startPostOffice(n,deliveries[0].id);pack(n);stepPostRoute(n);check(b.playback.status==='ended'&&!b.completed&&b.playback.feedback.includes('Add an instruction'),'empty route requests an instruction without pretending to deliver');
 appendPostClause(n,'go:post');stepPostRoute(n);check(b.playback.location==='post'&&b.playback.referent==='post'&&b.playback.status==='ended','named current place is a valid no-op and establishes reference');
 appendPostClause(n,'there');stepPostRoute(n);stepPostRoute(n);check(b.playback.location==='post'&&b.playback.status==='ended','there can repeat named current place');
}
{
 const s={},v=startPostOffice(s,deliveries[2].id);route(s,['go:orchard','give:purl']);pack(s);setPostReading(s,'independent');stepPostRoute(s);
 const routeBefore=json({clauses:v.clauses,packing:v.packing,playback:v.playback});stepPostHelp(s,1);stepPostHelp(s,1);stepPostHelp(s,1);
 check(v.helperStep===2&&v.support.helper&&v.reading==='independent'&&json({clauses:v.clauses,packing:v.packing,playback:v.playback})===routeBefore,'helper is bounded and isolated, retaining the explicit reading report and separate support flags');
 stepPostHelp(s,-1);stepPostHelp(s,'reset');check(v.helperStep===0&&v.support.helper,'resetting helper does not erase support');
 check(setPostReading(s,'unobserved')&&setPostReading(s,'independent')&&v.support.helper&&!setPostReading(s,'mastered'),'reported reading can change without erasing separate helper support');
 setPostSupport(s,'audioRequested');check(v.support.audioRequested&&v.reading==='independent'&&!setPostSupport(s,'audioPlayed'),'narration records only a request and never infers listening or changes the explicit reading report');
 check(!('freshEvidence'in v)&&!('independentDecoding'in v)&&!('mastery'in v),'no reading-evidence or mastery classification is derived');
 setPostPrediction(s,'orchard');check(v.predictionAfterSupport,'prediction after helper or narration is marked');
 const t={},w=startPostOffice(t,deliveries[0].id);setPostReading(t,'independent');packPostTogether(t);check(w.packing.supported&&w.reading==='independent'&&setPostReading(t,'together')&&w.packing.supported,'math support and explicit reading report remain separate');
 check(setPostCourier(t,'rider')&&t.postOffice.courier==='rider'&&!setPostCourier(t,'film-character'),'courier appearance is independent and validated');
 check(setPostCourier(t,'witch')&&json(w.order)===json(deliveries[0]),'both appearances preserve identical delivery content');
}
{
 const s={},v=startPostOffice(s,deliveries[0].id);for(let i=0;i<6;i++)appendPostClause(s,'go:post');
 check(!appendPostClause(s,'go:cafe')&&!appendPostClause(s,'go:moon')&&!appendPostClause(s,'go:cafe:extra')&&!appendPostClause(s,'give:unknown')&&v.clauses.length===6,'six-clause bound and finite grammar enforced');
 check(!editPostClause(s,0,'up')&&!editPostClause(s,5,'down')&&!editPostClause(s,-1,'remove')&&!editPostClause(s,0,'replace'),'invalid edit actions preserve draft');
 check(clauseText('there')==='Go there'&&clauseText('then:hill').includes('Then go')&&clauseText('give:purl').includes('Purl')&&clauseText('bad')==='Unknown instruction','finite clauses have readable text');
 for(let i=0;i<30;i++){setPostPackingInput(s,'1');submitPostPacking(s);}
 check(v.packing.attempts.length===24&&!v.packing.packed,'packing attempts bounded separately');
 packPostTogether(s);for(let i=0;i<30;i++){restartPostRoute(s);run(s);}
 check(v.checks.length===24&&!v.completed,'route checks bounded separately without manufacturing completion');
}
{
 const s={},v=startPostOffice(s,deliveries[0].id);setPostPackingInput(s,'8');route(s,['go:cafe','give:clover']);pack(s);stepPostRoute(s);
 v.revision='willow-future';v.order.request='Synthetic future wording';v.extra={exact:['retained',7]};const before=copy(v),r=reload(s),a=currentPostOffice(r),{closed,closedReason,...original}=a;
 check(closed&&typeof closedReason==='string'&&json(original)===json(before),'unsupported revision retains exact frozen order, route, input and cursor as closed work');
 check(!stepPostRoute(r)&&!packPostTogether(r)&&!restartPostRoute(r)&&!setPostComposer(r,'place','hill')&&!setPostReading(r,'together')&&!stepPostHelp(r,1),'closed visit cannot mutate through gameplay actions');
 const fresh=startPostOffice(r,deliveries[1].id);check(fresh.revision===POST_REVISION&&r.postOffice.visits.length===2&&r.postOffice.visits[0].closed,'fresh visit retains unavailable earlier work');
 const snapshotState={},snapshot=startPostOffice(snapshotState,deliveries[0].id);snapshot.order.title='Synthetic saved title';snapshot.order.request='Synthetic frozen wording';snapshot.recipientLocations.ember='post';const snapshotBefore=json(snapshotState);
 check(json(reload(snapshotState))===snapshotBefore,'valid saved request and recipient locations remain frozen rather than being refreshed from catalog');
 const pictureState={},picture=startPostOffice(pictureState,deliveries[0].id);picture.order.math.pictures.groups[0].count=99;const pictureBefore=copy(picture);ensurePostOffice(pictureState);const {closed:pictureClosed,closedReason:pictureReason,...pictureSaved}=picture;
 check(pictureClosed&&json(pictureSaved)===json(pictureBefore),'inconsistent packing picture is retained closed rather than silently redrawn');
 const oversizedState={},oversized=startPostOffice(oversizedState,deliveries[2].id);oversized.order.math.a=1000000;oversized.order.math.answer=5000000;oversized.order.math.pictures.groups[0].count=1000000;const rawOversized=copy(oversized);ensurePostOffice(oversizedState);const {closed:oversizedClosed,closedReason:oversizedReason,...oversizedSaved}=oversized;
 check(oversizedClosed&&json(oversizedSaved)===json(rawOversized),'out-of-range saved packing values close the exact raw visit before picture rendering');
 const malformedPacking={},packingVisit=startPostOffice(malformedPacking,deliveries[0].id);packingVisit.packing.attempts=[{input:'synthetic retained input',value:'not a number',correct:false,extra:{exact:7}}];const rawPacking=copy(packingVisit);ensurePostOffice(malformedPacking);const {closed:packingClosed,closedReason:packingReason,...packingSaved}=packingVisit;
 check(packingClosed&&json(packingSaved)===json(rawPacking),'malformed packing closes whole visit while retaining every raw attempt field');
 const t={},w=startPostOffice(t,deliveries[0].id);w.clauses=['go:unavailable'];const raw=copy(w);ensurePostOffice(t);const {closed:flag,closedReason:reason,...kept}=w;
 check(flag&&json(kept)===json(raw),'malformed draft is preserved exactly without reinterpretation');
 const future={version:9,current:'future-77',nextVisit:78,courier:'future-style',visits:[{id:'future-77',packing:{input:' 24 '},clauses:['future:cloud'],playback:{cursor:2,location:'cloud'}}],extra:{exact:true}};
 const u={postOffice:copy(future)};ensurePostOffice(u);check(u.postOffice.version===1&&u.postOffice.current===null&&json(u.postOffice.kept.payload)===json(future),'unsupported root schema archives complete future paused payload');
 startPostOffice(u,deliveries[0].id);check(json(reload(u).postOffice.kept.payload)===json(future),'fresh visit and exact reload retain complete archived root payload');
 for(const malformed of [null,7,[],{version:1,current:null,courier:'witch',visits:'bad'}]){const a={postOffice:copy(malformed)};ensurePostOffice(a);check(json(a.postOffice.kept.payload)===json(malformed),'unreadable root payload retained verbatim');}
 const bad={postOffice:{version:1,current:'post-1',nextVisit:2,courier:'witch',visits:[{id:'post-1',unexpected:'exact'},null]}};ensurePostOffice(bad);check(bad.postOffice.visits.every(v=>v.closed)&&bad.postOffice.visits[1].kept===null,'malformed visits including nonobjects remain inspectable closed work');
}
{
 const s={},first=startPostOffice(s,deliveries[0].id).id;for(let i=0;i<29;i++)startPostOffice(s,deliveries[i%6].id);
 check(s.postOffice.visits.length===24&&!resumePostOffice(s,first)&&s.postOffice.nextVisit===31,'latest 24 visits retained with monotonically increasing IDs');
 const old=s.postOffice.visits[0].id;resumePostOffice(s,old);const extra=copy(currentPostOffice(s));extra.id='post-99';s.postOffice.visits.push(extra);ensurePostOffice(s);
 check(s.postOffice.visits.length===24&&currentPostOffice(s).id===old,'retention preserves current waiting visit');
 check(startPostOffice(s,deliveries[0].id).id==='post-100','IDs advance beyond saved content rather than colliding');
 const s2={},a=startPostOffice(s2,deliveries[0].id);route(s2,['go:cafe']);setPostPackingInput(s2,' 8 ');const before=json(a);startPostOffice(s2,deliveries[1].id);resumePostOffice(s2,a.id);
 check(json(currentPostOffice(s2))===before,'starting/resuming another order preserves exact pending work');
}
console.log(`${checks} Willow Post Office checks passed.`);
