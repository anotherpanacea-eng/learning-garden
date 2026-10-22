// A bounded bridge for the complete bundle-total examples actually shown at this table.
import {areas} from './broad-content.mjs';
import {authoredBroadParams} from './broad-variants.mjs';
import {bundleState,bundleHistoryUnknown,knownBundleSignatures,noteBundleExamples} from './bundle-exchange-core.mjs';
import {joiningState,joiningHistoryUnknown,joiningBundleSignatures} from './joining-orders-core.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const authored=id=>areas.flatMap(a=>[...a.checkin,...a.activities]).find(q=>q.id===id);
export function bundleQuestionParams(question){
 if(!object(question))return null;
 let p;
 if(object(question.variant)&&Object.hasOwn(question.variant,'params'))p=question.variant.params;
 else if(Object.hasOwn(question,'params'))p=question.params;
 else try{p=authoredBroadParams(question);}catch{return null;}
 return object(p)&&p.type==='bundle'&&p.hundreds===0&&Number.isInteger(p.tens)&&p.tens>=1&&p.tens<=9&&Number.isInteger(p.ones)&&p.ones>=0&&p.ones<=9?p:null;
}
export function bundleQuestionExposure(state,question){
 const p=bundleQuestionParams(question);
 if(!p)return {familiar:false,priorExposureUnknown:false};
 const signature=`bundle:0:${p.tens}:${p.ones}`;
 const root=Object.hasOwn(state,'bundleExchange')?bundleState(state):null;
 const joining=Object.hasOwn(state,'joiningOrders')?joiningState(state):null;
 return {familiar:!!root&&knownBundleSignatures.includes(signature)&&root.shownBundleExamples.includes(signature)||!!joining&&joiningBundleSignatures.includes(signature)&&joining.shownBundleExamples.includes(signature),priorExposureUnknown:knownBundleSignatures.includes(signature)&&bundleHistoryUnknown(state)||joiningBundleSignatures.includes(signature)&&joiningHistoryUnknown(state)};
}
export function syncBundleQuestionExposure(state,question,draft){
 if(!draft||typeof draft!=='object')return false;
 const exposure=bundleQuestionExposure(state,question);let changed=false;
 for(const key of ['familiar','priorExposureUnknown'])if(exposure[key]&&!draft[key]){draft[key]=true;changed=true;}
 return changed;
}
export function noteBundleDisplay(state,examples,live=null){
 let changed=noteBundleExamples(state,examples);
 for(const [key,draft] of Object.entries(state.broad?.drafts||{})){
  const question=draft?.question||authored(key.replace(/^(checkin|activity):/,''));
  if(syncBundleQuestionExposure(state,question,draft))changed=true;
 }
 if(live&&syncBundleQuestionExposure(state,live.question,live.active))changed=true;
 return changed;
}
