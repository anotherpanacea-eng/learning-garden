import {joiningView,noteJoiningExamples,startJoiningOrder} from './joining-orders-core.mjs';
import {noteBundleDisplay} from './bundle-broad-exposure.mjs';

export const freshLedger=()=>({stage:'separate',onesPlaced:false,tensPlaced:false,turn:'picture'});
export const ledgerSourceExamples=source=>source?.id==='steady-orders'
 ?['bundle:0:2:4','bundle:0:1:3']
 :source?.id==='full-frame-orders'?['bundle:0:2:4','bundle:0:1:7']:[];
export const ledgerResultExample=source=>source?.id==='steady-orders'
 ?'bundle:0:3:7':source?.id==='full-frame-orders'?'bundle:0:4:1':null;

export function moveLedger(session,source,action){
 if(!session||!ledgerResultExample(source))return null;
 const next={...session},exchange=source.id==='full-frame-orders';
 switch(action){
  case 'join':
   if(next.stage!=='separate')return null;
   next.stage='joined';break;
  case 'separate':
   if(next.stage!=='joined'||next.onesPlaced||next.tensPlaced)return null;
   next.stage='separate';break;
  case 'wrap':
   if(!exchange||next.stage!=='joined'||next.onesPlaced||next.tensPlaced)return null;
   next.stage='wrapped';break;
  case 'unwrap':
   if(!exchange||next.stage!=='wrapped'||next.onesPlaced||next.tensPlaced)return null;
   next.stage='joined';break;
  case 'place-ones':
   if(next.onesPlaced||next.tensPlaced||next.stage!==(exchange?'wrapped':'joined'))return null;
   next.onesPlaced=true;break;
  case 'lift-ones':
   if(!next.onesPlaced||next.tensPlaced)return null;
   next.onesPlaced=false;break;
  case 'place-tens':
   if(!next.onesPlaced||next.tensPlaced)return null;
   next.tensPlaced=true;break;
  case 'lift-tens':
   if(!next.tensPlaced)return null;
   next.tensPlaced=false;break;
  default:return null;
 }
 return next;
}

function stageExposure(candidate,examples){
 const shown=noteJoiningExamples(candidate,examples);
 // Hash navigation has already parked any broad question in state.broad.drafts.
 const synced=shown?noteBundleDisplay(candidate,[]):false;
 return shown||synced;
}
function commit(state,candidate){
 state.joiningOrders=candidate.joiningOrders;
 state.broad=candidate.broad;
}
export function recordLedgerDisplay(state,examples,canExport=()=>true){
 if(!examples.length)return {ok:true,changed:false};
 const candidate=structuredClone(state);
 if(!stageExposure(candidate,examples))return {ok:true,changed:false};
 if(!canExport(candidate))return {ok:false,changed:false};
 commit(state,candidate);
 return {ok:true,changed:true};
}
export function startLedgerCase(state,id,canExport=()=>true){
 const candidate=structuredClone(state);
 if(!startJoiningOrder(candidate,id))return {ok:false,changed:false};
 const view=joiningView(candidate),examples=ledgerSourceExamples(view.source);
 if(!examples.length)return {ok:false,changed:false};
 stageExposure(candidate,examples);
 if(!canExport(candidate))return {ok:false,changed:false};
 commit(state,candidate);
 return {ok:true,changed:true};
}
