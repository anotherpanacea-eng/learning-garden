import {returningState,startReturning,noteReturningExamples,validReturningSource} from './returning-orders-core.mjs';
import {noteBundleDisplay} from './bundle-broad-exposure.mjs';
export const freshRemains=caseId=>({caseId,stage:'source',onesPlaced:false,tensPlaced:false,turn:'picture'});
export const remainsSourceExamples=s=>validReturningSource(s)?['bundle:0:4:2',`bundle:0:${Math.floor(s.target/10)}:${s.returnedOnes}`]:[];
export const remainsResultExample=s=>validReturningSource(s)?`bundle:0:${Math.floor((s.start-s.target)/10)}:${(s.start-s.target)%10}`:null;
export function remainsCounts(s,p){const exchange=s.returnedOnes===7,opened=exchange&&p.stage!=='source',ones=['ones-returned','returned'].includes(p.stage),ten=p.stage==='returned';return {tableTens:4-Number(opened)-Number(ten),tableOnes:2+10*Number(opened)-(ones?s.returnedOnes:0),storeTens:Number(ten),storeOnes:ones?s.returnedOnes:0,useTens:opened?3:4,useOnes:opened?12:2,opened};}
export function moveRemains(p,s,action){
 if(!p||!validReturningSource(s))return null;const n={...p},blank=!p.onesPlaced&&!p.tensPlaced,exchange=s.returnedOnes===7;
 switch(action){
 case 'open':if(!exchange||p.stage!=='source'||!blank)return null;n.stage='opened';break;
 case 'close':if(p.stage!=='opened'||!blank)return null;n.stage='source';break;
 case 'return-ones':if(p.stage!==(exchange?'opened':'source')||!blank)return null;n.stage='ones-returned';break;
 case 'bring-ones':if(p.stage!=='ones-returned'||!blank)return null;n.stage=exchange?'opened':'source';break;
 case 'return-ten':if(p.stage!=='ones-returned')return null;n.stage='returned';break;
 case 'bring-ten':if(p.stage!=='returned'||p.tensPlaced)return null;n.stage='ones-returned';break;
 case 'place-ones':if(!['ones-returned','returned'].includes(p.stage)||p.onesPlaced)return null;n.onesPlaced=true;break;
 case 'lift-ones':if(!p.onesPlaced||p.tensPlaced)return null;n.onesPlaced=false;break;
 case 'place-tens':if(p.stage!=='returned'||!p.onesPlaced||p.tensPlaced)return null;n.tensPlaced=true;break;
 case 'lift-tens':if(!p.tensPlaced)return null;n.tensPlaced=false;break;
 default:return null;
 }return n;
}
function expose(candidate,examples){const changed=noteReturningExamples(candidate,examples);return (changed?noteBundleDisplay(candidate,[]):false)||changed;}
function commit(state,candidate){state.returningOrders=candidate.returningOrders;state.broad=candidate.broad;}
export function recordRemainsDisplay(state,examples,canExport=()=>true){
 const candidate=structuredClone(state);if(!expose(candidate,examples))return {ok:true,changed:false};if(!canExport(candidate))return {ok:false,changed:false};commit(state,candidate);return {ok:true,changed:true};
}
export function startRemainsCase(state,id,canExport=()=>true){
 const candidate=structuredClone(state),root=returningState(candidate);if(root===null)return {ok:false,changed:false};
 const created=!root?.cases[id];if(created&&!startReturning(candidate,id))return {ok:false,changed:false};
 const source=returningState(candidate)?.cases[id]?.source,examples=remainsSourceExamples(source);if(!examples.length)return {ok:false,changed:false};
 const changed=expose(candidate,examples)||created;if(!changed)return {ok:true,changed:false};if(!canExport(candidate))return {ok:false,changed:false};commit(state,candidate);return {ok:true,changed:true};
}
