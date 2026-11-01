import {balancePages,balanceSource} from './balance-stall-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),positive=x=>Number.isSafeInteger(x)&&x>0;
const text=(x,max)=>typeof x==='string'&&x.length<=max,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x);
const bounded=(x,max)=>Number.isInteger(x)&&x>=0&&x<=max,side=x=>['left','right','both'].includes(x),relation=x=>['equal','left','right'].includes(x);
const sum=x=>x[0]+x[1],groups=x=>Array.isArray(x)&&x.length===2&&x.every(n=>bounded(n,20))&&sum(x)<=20;
export const validBalanceLive=x=>object(x)&&groups(x.left)&&groups(x.right);
const mass=x=>Number.isInteger(x)&&x>=1&&x<=12,maybeMass=x=>x===null||mass(x),maybeBool=x=>x===null||typeof x==='boolean';
const codes=['help','audio','together','reveal'],support=x=>Array.isArray(x)&&x.length<=4&&x.every(c=>codes.includes(c))&&new Set(x).size===x.length;
const evidence=x=>object(x)&&['pairedAdd','pairedRemove','oneSided'].every(k=>typeof x[k]==='boolean');
const modelShape=x=>object(x)&&bounded(x.left,32)&&bounded(x.right,32)&&relation(x.relation);
const action=x=>x===null||object(x)&&side(x.side)&&[1,-1].includes(x.delta)&&modelShape(x.before)&&modelShape(x.after)&&text(x.feedback,1000);
const freshEvidence=()=>({pairedAdd:false,pairedRemove:false,oneSided:false});
export function validBalanceSource(s){
 return object(s)&&s.version===1&&id(s.id)&&text(s.title,160)&&text(s.question,600)&&text(s.help,2000)&&validBalanceLive(s.start)&&
  (s.kind==='known'&&s.parcelSide===null&&s.parcelMass===null||s.kind==='parcel'&&['left','right'].includes(s.parcelSide)&&mass(s.parcelMass));
}
// Historical outcomes are admitted for readable shapes, never regraded on load.
export function validBalanceCheck(c){return object(c)&&validBalanceSource(c.source)&&object(c.input)&&validBalanceLive(c.input.live)&&maybeMass(c.input.proposal)&&evidence(c.input.evidence)&&action(c.input.lastAction)&&support(c.input.support)&&object(c.totals)&&bounded(c.totals.left,32)&&bounded(c.totals.right,32)&&relation(c.relation)&&maybeBool(c.valueMatch)&&maybeBool(c.isolated)&&text(c.feedback,2000);}
export function validBalanceRound(r){return object(r)&&positive(r.id)&&validBalanceSource(r.source)&&validBalanceLive(r.live)&&maybeMass(r.proposal)&&evidence(r.evidence)&&action(r.lastAction)&&support(r.support)&&typeof r.familiar==='boolean'&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(validBalanceCheck);}
export function balanceView(state){
 const root=state.balanceStall,base={root,rounds:[],earlier:[],current:null,page:'balance'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!balancePages.includes(root.page)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],used=new Set();for(const r of root.rounds){if(validBalanceRound(r)&&!used.has(r.id)){rounds.push(r);used.add(r.id);}else earlier.push(r);}
 return {...base,status:'ready',rounds,earlier,current:rounds.find(r=>r.id===root.current)||rounds.at(-1)||null,page:root.page};
}
export function startBalance(state,caseId){
 const source=balanceSource(caseId),v=balanceView(state);if(!source||v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'balance',current:1,nextId:1,seen:[],rounds:[]};let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const round={id:next,source,live:structuredClone(source.start),proposal:null,evidence:freshEvidence(),lastAction:null,support:[],familiar:root.seen.includes(source.id),checks:[]};
 const drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));root.rounds=root.rounds.filter(r=>!drop.has(r));root.rounds.push(round);root.current=next;root.nextId=next+1;root.page='balance';if(!root.seen.includes(source.id))root.seen.push(source.id);state.balanceStall=root;return round;
}
const active=state=>balanceView(state).current;
export function resumeBalance(state,id){const v=balanceView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function setBalancePage(state,page){const v=balanceView(state);if(v.status!=='ready'||!balancePages.includes(page))return false;v.root.page=page;return true;}
export function addBalanceSupport(state,code){const r=active(state);if(!r||!codes.includes(code)||code==='reveal'&&r.source.kind!=='parcel')return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function chooseBalanceMass(state,value){const r=active(state);if(!r||r.source.kind!=='parcel'||!maybeMass(value))return false;r.proposal=value;return true;}
export function balanceModel(source,live){
 if(!validBalanceSource(source)||!validBalanceLive(live))return null;
 const left=sum(live.left)+(source.parcelSide==='left'?source.parcelMass:0),right=sum(live.right)+(source.parcelSide==='right'?source.parcelMass:0);
 return {left,right,relation:left===right?'equal':left>right?'left':'right'};
}
const relationWords=r=>r==='equal'?'The balance is level; both sides have the same mass.':`The ${r} pan is heavier and lower.`;
export function balanceChange(source,live,which,delta){
 if(!side(which)||![1,-1].includes(delta)||!validBalanceSource(source)||!validBalanceLive(live))return {ok:false,reason:'invalid'};
 const targets=which==='both'?['left','right']:[which],before=balanceModel(source,live);
 if(targets.some(s=>delta===1?sum(live[s])>=20:sum(live[s])===0))return {ok:false,reason:delta===1?'limit':'empty',feedback:delta===1?'Each pan holds at most 20 loose unit weights. Neither pan changed.':'Remove only an available loose unit weight. Neither pan changed.'};
 const next=structuredClone(live);for(const s of targets){if(delta===1)next[s][1]++;else if(next[s][1]>0)next[s][1]--;else next[s][0]--;}
 const after=balanceModel(source,next),verb=delta===1?'added to':'removed from';
 const feedback=which==='both'?`One unit was ${verb} each side. Both totals ${delta===1?'rose':'dropped'} by one. ${relationWords(after.relation)}${before.relation!=='equal'?' The earlier difference remains; changing both by the same amount did not repair it.':''}`:`One unit was ${verb} the ${which} pan only. ${relationWords(after.relation)}`;
 return {ok:true,live:next,before,after,feedback};
}
export function changeBalance(state,which,delta){
 const r=active(state);if(!r)return {ok:false,reason:'missing'};const result=balanceChange(r.source,r.live,which,delta);if(!result.ok)return result;
 r.live=result.live;r.lastAction={side:which,delta,before:result.before,after:result.after,feedback:result.feedback};
 if(which==='both'&&result.before.relation==='equal')r.evidence[delta===1?'pairedAdd':'pairedRemove']=true;else if(which!=='both')r.evidence.oneSided=true;
 return result;
}
export function resetBalance(state){const r=active(state);if(!r)return false;r.live=structuredClone(r.source.start);r.proposal=null;r.evidence=freshEvidence();r.lastAction=null;return true;}
export function checkBalance(state){
 const r=active(state);if(!r)return null;const model=balanceModel(r.source,r.live),parcel=r.source.kind==='parcel',valueMatch=parcel&&r.proposal!==null?r.proposal===r.source.parcelMass:null,isolated=parcel?sum(r.live[r.source.parcelSide])===0&&model.relation==='equal':null;
 const answer=!parcel?'These arrangements are kept for comparison.':r.proposal===null?'No parcel mass was proposed; that stays unobserved.':valueMatch?'The proposed whole-parcel mass fits this model.':'The proposed whole-parcel mass differs from this model. Change the idea or explore the same balance again.';
 const feedback=`${relationWords(model.relation)} ${answer}${parcel?` ${isolated?'The parcel is alone on its pan and the balance is level.':'The parcel is not currently alone on a level balance.'}`:''} Paired removal from a level balance tried: ${r.evidence.pairedRemove?'yes':'no'}. This describes an action, not how an answer was inferred.`;
 const c={source:structuredClone(r.source),input:{live:structuredClone(r.live),proposal:r.proposal,evidence:structuredClone(r.evidence),lastAction:structuredClone(r.lastAction),support:[...r.support]},totals:{left:model.left,right:model.right},relation:model.relation,valueMatch,isolated,feedback};
 r.checks.push(c);r.checks=r.checks.slice(-8);state.balanceStall.page='kept';return c;
}
export function balanceCheckMatches(r,c=r.checks.at(-1)){return !!c&&JSON.stringify(c.source)===JSON.stringify(r.source)&&JSON.stringify(c.input)===JSON.stringify({live:r.live,proposal:r.proposal,evidence:r.evidence,lastAction:r.lastAction,support:r.support});}
