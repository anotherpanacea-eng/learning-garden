import assert from 'node:assert/strict';
import {balanceCases,balanceSource,balancePages} from '../dist/balance-stall-content.mjs';
import {validBalanceSource,validBalanceLive,validBalanceRound,validBalanceCheck,balanceView,startBalance,resumeBalance,setBalancePage,addBalanceSupport,chooseBalanceMass,balanceModel,balanceChange,changeBalance,resetBalance,checkBalance,balanceCheckMatches} from '../dist/balance-stall-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
const total=v=>v.reduce((a,b)=>a+b,0),rel=(l,r)=>l===r?'equal':l>r?'left':'right';
function oracle(src,live,side,delta){const next=copy(live),targets=side==='both'?['left','right']:[side];if(targets.some(s=>delta===1?total(next[s])===20:total(next[s])===0))return null;for(const s of targets){if(delta===1)next[s][1]++;else{const index=next[s][1]?1:0;next[s][index]--;}}const l=total(next.left)+(src.parcelSide==='left'?src.parcelMass:0),r=total(next.right)+(src.parcelSide==='right'?src.parcelMass:0);return {live:next,left:l,right:r,relation:rel(l,r)};}
eq(balanceCases.length,8);eq(balancePages,['balance','kept']);
for(const src of balanceCases){ok(validBalanceSource(src));eq(balanceModel(src,src.start).relation,'equal');const got=balanceSource(src.id);eq(got,src);got.title='synthetic alternative';ok(got.title!==src.title);}
eq(balanceSource('no-case'),null);
// Independent totals/action oracle across every mass placement and loose total.
let combinations=0,enabled=0,refusals=0;
for(const parcelSide of [null,'left','right'])for(const mass of parcelSide?Array.from({length:12},(_,i)=>i+1):[null]){
 const src={...balanceSource('two-arrangements'),kind:parcelSide?'parcel':'known',parcelSide,parcelMass:mass};
 for(let l=0;l<=20;l++)for(let r=0;r<=20;r++)for(const side of ['left','right','both'])for(const delta of [-1,1]){
  const live={left:[Math.floor(l/2),Math.ceil(l/2)],right:[Math.floor(r/3),r-Math.floor(r/3)]},before=copy(live),expected=oracle(src,live,side,delta),result=balanceChange(src,live,side,delta);combinations++;
  eq(live,before,'pure input');eq(result.ok,expected!==null,'availability');
  if(!expected){refusals++;continue;}enabled++;eq(result.live,expected.live,'exact group action');eq(result.after,{left:expected.left,right:expected.right,relation:expected.relation},'arithmetic relation');
  const oldL=l+(parcelSide==='left'?mass:0),oldR=r+(parcelSide==='right'?mass:0);eq(result.before,{left:oldL,right:oldR,relation:rel(oldL,oldR)});if(side==='both')eq(result.after.left-result.after.right,oldL-oldR,'paired change preserves signed difference');
 }
}
eq(combinations,66150);eq(enabled,62000);eq(refusals,4150);
for(let a=0;a<=20;a++)for(let b=0;b<=20-a;b++)for(const delta of [-1,1]){const live={left:[a,b],right:[0,0]},src=balanceSource('two-arrangements'),expected=oracle(src,live,'left',delta),got=balanceChange(src,live,'left',delta);eq(got.ok,expected!==null);if(expected)eq(got.live,expected.live,'all group boundaries');}
for(const x of [null,{},[1,2],{left:[1],right:[1,2]},{left:[20,1],right:[0,0]},{left:[-1,1],right:[0,0]}])ok(!validBalanceLive(x));
for(const changes of [{version:2},{kind:'unknown'},{parcelSide:'both'},{kind:'parcel',parcelSide:'left',parcelMass:0},{kind:'known',parcelSide:'left',parcelMass:1},{title:4},{start:{left:[30,0],right:[0,0]}}])ok(!validBalanceSource({...balanceSource('two-arrangements'),...changes}));
const missing={};eq(balanceView(missing).status,'missing');for(const fn of [s=>setBalancePage(s,'balance'),s=>resumeBalance(s,1),s=>addBalanceSupport(s,'help'),s=>chooseBalanceMass(s,5),resetBalance]){const before=copy(missing);eq(fn(missing),false);eq(missing,before,'only explicit Start allocates');}eq(checkBalance(missing),null);eq(changeBalance(missing,'both',-1),{ok:false,reason:'missing'});eq(missing,{});
const s={},r=startBalance(s,'leaf-parcel');ok(validBalanceRound(r));eq(r.live,{left:[0,2],right:[0,7]});eq(r.familiar,false);chooseBalanceMass(s,5);const guessed=checkBalance(s);eq([guessed.valueMatch,guessed.isolated,guessed.input.evidence.pairedRemove],[true,false,false],'correct guess does not invent method');ok(balanceCheckMatches(r));
changeBalance(s,'both',-1);eq(r.live,{left:[0,1],right:[0,6]});ok(r.evidence.pairedRemove);ok(!balanceCheckMatches(r));changeBalance(s,'both',-1);chooseBalanceMass(s,null);const isolated=checkBalance(s);eq([isolated.valueMatch,isolated.isolated],[null,true],'method does not invent answer');eq(isolated.input.live,{left:[0,0],right:[0,5]});ok(validBalanceCheck(isolated));
const snapshot=copy(r.checks);addBalanceSupport(s,'help');ok(!balanceCheckMatches(r),'support changes relevance');addBalanceSupport(s,'help');eq(r.support,['help']);addBalanceSupport(s,'reveal');resetBalance(s);eq(r.support,['help','reveal'],'reset keeps support');eq(r.evidence,{pairedAdd:false,pairedRemove:false,oneSided:false});eq(r.proposal,null);eq(r.lastAction,null);eq(r.checks,snapshot,'reset keeps frozen outcomes');ok(!balanceCheckMatches(r));
const stableModel=balanceModel(r.source,r.live);for(let m=1;m<=12;m++){chooseBalanceMass(s,m);eq(balanceModel(r.source,r.live),stableModel,'guess never drives model');}
resetBalance(s);changeBalance(s,'left',-1);eq(balanceModel(r.source,r.live).relation,'right');changeBalance(s,'both',-1);eq(balanceModel(r.source,r.live),{left:5,right:6,relation:'right'});ok(!r.evidence.pairedRemove,'paired removal while unequal not recorded as while level');ok(r.lastAction.feedback.includes('did not repair'));const fail=copy(s);eq(changeBalance(s,'both',-1).ok,false);eq(s,fail,'cannot remove absent loose weight even when parcel has mass');changeBalance(s,'right',-1);eq(balanceModel(r.source,r.live).relation,'equal');
startBalance(s,'right-parcel');changeBalance(s,'right',-1);eq(balanceModel(s.balanceStall.rounds.at(-1).source,s.balanceStall.rounds.at(-1).live).relation,'left');
const known=startBalance(s,'two-arrangements');eq(chooseBalanceMass(s,2),false);eq(addBalanceSupport(s,'reveal'),false);const kc=checkBalance(s);eq([kc.valueMatch,kc.isolated],[null,null]);for(const p of balancePages)ok(setBalancePage(s,p));eq(setBalancePage(s,'other'),false);ok(resumeBalance(s,r.id));eq(balanceView(s).current,r);eq(resumeBalance(s,99999),false);
for(const [which,delta] of [['both',0],['other',1],['left',NaN]]){const before=copy(s);eq(changeBalance(s,which,delta).ok,false);eq(s,before);}
for(const bad of [-1,0,13,'5',undefined,NaN]){const before=copy(s);eq(chooseBalanceMass(s,bad),false);eq(s,before);}
for(let i=0;i<10;i++)checkBalance(s);eq(r.checks.length,8);eq(r.checks.at(-1).source,r.source);const frozen=copy(r.checks.at(-1));r.source.title='Revised synthetic label';r.source.parcelMass=8;ok(!balanceCheckMatches(r));eq(r.checks.at(-1),frozen,'catalog/source edits do not regrade');ok(validBalanceRound(r));r.checks[0].totals={left:32,right:0};r.checks[0].relation='right';r.checks[0].valueMatch=false;r.checks[0].isolated=true;r.checks[0].feedback='Earlier contradictory recorded words';ok(validBalanceRound(r),'contradictory recorded outputs remain shapes');
for(const bad of [null,'future',{version:88,raw:'<b>kept</b>'}]){const state={balanceStall:bad},before=copy(state);eq(balanceView(state).status,'unavailable');eq(startBalance(state,'leaf-parcel'),null);eq(state,before);}
{
 const state={};for(let i=0;i<16;i++)startBalance(state,'leaf-parcel');eq(balanceView(state).rounds.length,12);eq(state.balanceStall.rounds[0].id,5);ok(state.balanceStall.rounds.at(-1).familiar);
 state.balanceStall.rounds.push({id:90,raw:'future sibling'});const raw=copy(state.balanceStall.rounds.at(-1));state.balanceStall.current=90;eq(balanceView(state).current.id,16);startBalance(state,'star-parcel');eq(state.balanceStall.current,91);eq(balanceView(state).earlier,[raw]);
 const duplicate=copy(state.balanceStall.rounds[0]);state.balanceStall.rounds.push(duplicate);eq(balanceView(state).earlier,[raw,duplicate]);const before=copy(state);balanceView(state);eq(state,before,'view never trims');
}
for(const rawId of [Number.MAX_SAFE_INTEGER,Infinity]){const state={};startBalance(state,'leaf-parcel');state.balanceStall.rounds.push({id:rawId,unknown:true});const before=copy(state);eq(startBalance(state,'leaf-parcel'),null);eq(state,before,'unsafe raw successor refuses without trim');}
{
 const state={};const visit=startBalance(state,'leaf-parcel');visit.source.id='retained-unknown-catalog-id';visit.source.question='Earlier model wording';visit.source.parcelMass=12;visit.source.start={left:[0,0],right:[0,0]};visit.live=copy(visit.source.start);ok(validBalanceRound(visit),'historical unequal setup not compared with catalog');eq(balanceModel(visit.source,visit.live).relation,'left');eq(checkBalance(state).isolated,false);
}
console.log(`Balance Stall core: ${n} assertions passed; ${combinations} independent action combinations.`);
