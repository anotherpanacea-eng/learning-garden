import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {walkCases,walkTime} from '../dist/courier-clock-content.mjs';
import {sameWalk,validWalkSource,parseWalkMinutes,walkResult,walkFeedback,clockWalkView,startClockWalk,editClockWalk,supportClockWalk,checkClockWalk,keepClockWalk,recoverClockWalk} from '../dist/courier-clock-core.mjs';
import {clockWalkPage,clockWalkNotes} from '../dist/courier-clock-ui.mjs';
import {walkClock,walkTimeline} from '../dist/courier-clock-art.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},copy=structuredClone,json=JSON.stringify,fresh=()=>initializeExplorerState(freshState());
const report=s=>JSON.stringify({title:'Synthetic clock notes',...s},null,2),fits=s=>prepareProgressImport(report(s)).ok;
let combos=0;
for(const [i,s]of walkCases.entries()){
 ok(validWalkSource(s));const duration=[25,40,20,45,20,60][i];eq((s.arrivalMinute-s.departureMinute+720)%720,duration);
 for(let offset=0;offset<=60;offset+=5)for(const endpointChoice of [null,'clock','unsure'])for(const answer of [...Array.from({length:61},(_,i)=>i),'blank','unsure']){
  const draft={source:s,offset,endpointChoice,durationInput:typeof answer==='number'?String(answer):'',durationMode:answer==='unsure'?'unsure':'input',support:[]},r=walkResult(draft);eq(r.endpointMatch,endpointChoice==='clock'?offset===duration:null);eq(r.durationMatch,typeof answer==='number'?answer===duration:null);ok(walkFeedback(draft).includes(`${duration} minutes`));combos++;
 }
 const e=s.example;eq(e.offsets,[0,15,25]);eq(e.offsets.map(o=>walkTime((e.departureMinute+o)%720)),['9:45','10:00','10:10']);
}
eq(combos,14742);
for(let m=0;m<720;m+=5){const art=walkClock(m);ok(art.includes(`data-angle="${m/2}"`));ok(art.includes(`data-angle="${m%60*6}"`));ok(art.includes(walkTime(m)));}
ok(walkTimeline(0).includes('data-x="25"'));ok(walkTimeline(60).includes('data-x="335"'));
for(let offset=0;offset<=60;offset+=5)for(const delta of [-15,-5,5,15]){const s=fresh();startClockWalk(s,'bridge-card');clockWalkView(s).work.offset=offset;const before=json(s),valid=offset+delta>=0&&offset+delta<=60;eq(editClockWalk(s,'step',delta),valid);if(valid)eq(clockWalkView(s).work.offset,offset+delta);else eq(json(s),before,'out-of-range move never clamps');}
for(const s of ['0','00','00000000',' 20 ','60'])eq(parseWalkMinutes(s).kind,'number');for(const s of ['+20','-0','2e1','20.0','２０','٢٠','61','abc'])eq(parseWalkMinutes(s).kind,'invalid');eq(parseWalkMinutes('  ').kind,'blank');
{
 const s=fresh(),before=json(s);clockWalkPage(s);clockWalkNotes(s);eq(json(s),before);ok(startClockWalk(s,'bridge-card',fits));let w=clockWalkView(s).work;eq(w.page,'learn');eq(w.offset,0);eq(w.endpointChoice,null);ok(editClockWalk(s,'page','walk',fits));ok(editClockWalk(s,'step',15,fits));ok(editClockWalk(s,'input',' 020 ',fits));ok(checkClockWalk(s,fits));eq(clockWalkView(s).feedback.result,{endpointMatch:false,durationMatch:true});ok(keepClockWalk(s,false,fits));const kept=copy(clockWalkView(s).kept);ok(editClockWalk(s,'step',5,fits));ok(editClockWalk(s,'input','15',fits));ok(checkClockWalk(s,fits));eq(clockWalkView(s).feedback.result,{endpointMatch:true,durationMatch:false});eq(clockWalkView(s).kept,kept);
 const id=clockWalkView(s).feedback.id;editClockWalk(s,'page','kept',fits);eq(clockWalkView(s).feedback.id,id,'page not judged');ok(clockWalkPage(s).includes('Check of our current draft'));supportClockWalk(s,'together',fits);ok(!clockWalkView(s).feedback);for(let i=0;i<6;i++)ok(checkClockWalk(s,fits));eq(clockWalkView(s).readableChecks.length,4);eq(clockWalkView(s).kept,kept);ok(!keepClockWalk(s,false,fits));ok(keepClockWalk(s,true,fits));
 eq(prepareProgressImport(report(s)).state.courierClockWalk,s.courierClockWalk);const check=copy(clockWalkView(s).feedback);check.snapshot=Object.fromEntries(Object.entries(check.snapshot).reverse());clockWalkView(s).work.checks.push({...check,id:100});ok(clockWalkView(s).readableChecks.some(c=>c.id===100),'key ordering harmless');ok(destinationNotes(s).includes('Courier Clock Walk'));
 const old=walkCases[2].departureMinute;walkCases[2].departureMinute=0;ok(clockWalkView(s).work);ok(clockWalkPage(s).includes('9:50'));walkCases[2].departureMinute=old;
}
{
 const s=fresh();startClockWalk(s,'bridge-card');editClockWalk(s,'input','+20');let before=json(s);ok(!checkClockWalk(s,fits));eq(json(s),before,'format refusal atomic');ok(keepClockWalk(s,false,fits),'invalid editable draft can be kept');editClockWalk(s,'durationMode','unsure');ok(checkClockWalk(s,fits));eq(clockWalkView(s).feedback.result,{endpointMatch:null,durationMatch:null});
 const w=clockWalkView(s).work,c=copy(clockWalkView(s).feedback);w.checks.push({...c,id:500,feedback:'Contradictory feedback'},{...c,id:501,result:{endpointMatch:true,durationMatch:true}});w.kept={future:'raw kept'};const raw=copy(w.checks.slice(-2));ok(prepareProgressImport(report(s)).ok);eq(clockWalkView(s).rawChecks,raw);ok(clockWalkView(s).keptUnreadable&&!keepClockWalk(s,true,fits));ok(checkClockWalk(s,fits));eq(clockWalkView(s).feedback.id,502);eq(clockWalkView(s).rawChecks,raw);
 clockWalkView(s).work.checks.push({id:Number.MAX_SAFE_INTEGER,unreadable:true});before=json(s);ok(!checkClockWalk(s,fits));eq(json(s),before);
}
{
 const s=fresh();startClockWalk(s,'lantern-note');const w=clockWalkView(s).work;w.source.id='retired-card';w.source.title='Earlier source';w.source.departureMinute=700;w.source.departureLabel='11:40';w.source.arrivalMinute=15;w.source.arrivalLabel='12:15';s.courierClockWalk.cases={'retired-card':w,'bridge-card':false};s.courierClockWalk.current='retired-card';ok(clockWalkView(s).work);ok(checkClockWalk(s,fits));ok(clockWalkView(s).feedback.feedback.includes('35 minutes'));ok(!startClockWalk(s,'bridge-card',fits));ok(startClockWalk(s,'book-slip',fits));eq(s.courierClockWalk.cases['bridge-card'],false);
 const root=copy(s.courierClockWalk);ok(recoverClockWalk(s,fits));eq(s.courierClockWalk.retainedRaw,root);ok(fits(s));
}
{
 const s=fresh();startClockWalk(s,'lantern-note');const w=clockWalkView(s).work;for(const k of Object.keys(w.source.copy))w.source.copy[k]='x'.repeat(800);w.source.extra='q'.repeat(5000);ok(validWalkSource(w.source));ok(checkClockWalk(s,fits),'feedback bound does not cap whole record/source');ok(json(clockWalkView(s).feedback).length>4096);ok(clockWalkView(s).feedback.feedback.length<=4096);eq(prepareProgressImport(report(s)).state.courierClockWalk,s.courierClockWalk);
}
for(const raw of [null,false,{version:7,earlier:'raw'}]){const s=fresh();s.courierClockWalk=raw;ok(fits(s));eq(clockWalkView(s).status,'recovery');const old=json(s);clockWalkPage(s);eq(json(s),old);ok(recoverClockWalk(s,fits));eq(s.courierClockWalk.retainedRaw,raw);}
{
 const s=fresh();startClockWalk(s,'lantern-note');editClockWalk(s,'step',5);editClockWalk(s,'page','walk');const before=json(s.courierClockWalk);s.padding='';s.padding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(report(s)));ok(fits(s));for(const fn of [()=>editClockWalk(s,'step',15,fits),()=>editClockWalk(s,'page','learn',fits),()=>supportClockWalk(s,'help',fits),()=>checkClockWalk(s,fits),()=>keepClockWalk(s,false,fits),()=>startClockWalk(s,'bridge-card',fits),()=>recoverClockWalk(s,fits)]){ok(!fn());eq(json(s.courierClockWalk),before);}
 delete s.padding;let nested={};for(let i=0;i<58;i++)nested={nested};s.courierClockWalk.extra=nested;ok(fits(s),'original depth readable');const old=json(s);ok(!recoverClockWalk(s,fits),'retained wrapper depth refusal');eq(json(s),old);
}
ok(sameWalk({a:1,b:2},{b:2,a:1}));ok(!sameWalk([1,2],[2,1]));console.log(`${n} Courier Clock checks passed, including ${combos} outcome combinations.`);
