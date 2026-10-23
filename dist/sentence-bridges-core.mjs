import {bridgeScene,bridgeWords} from './sentence-bridges-content.mjs';
export const initialBridges=(caseId='supper')=>({caseId,order:'AB',bridge:null,previous:null});
export function changeBridges(s,action,value){
 if(!s||!bridgeScene(s.caseId))return null;
 if(action==='scene')return bridgeScene(value)&&value!==s.caseId?initialBridges(value):null;
 if(action==='undo')return s.previous?{...s,...s.previous,previous:null}:null;
 const next={...s};
 if(action==='word'){if(!bridgeWords.includes(value)||value===s.bridge)return null;next.bridge=value;}
 else if(action==='swap')next.order=s.order==='AB'?'BA':'AB';
 else if(action==='separate'){if(s.bridge===null)return null;next.bridge=null;}
 else return null;
 next.previous={order:s.order,bridge:s.bridge};return next;
}
export function bridgesPresentation(s){
 const c=bridgeScene(s.caseId),ordered=s.order==='AB'?[['A',c.a],['B',c.b]]:[['B',c.b],['A',c.a]];
 const strips=ordered.map(([id,text],i)=>({id,text:s.bridge?(i?text.replace(/^(The|Rain) /,x=>x.toLowerCase()):text).slice(0,-1):text}));
 const output=s.bridge?c.trials[s.order+':'+s.bridge]:{trial:ordered.map(x=>x[1]).join(' '),meaning:'Two sentences. No joining word is selected.'};
 return {...output,strips};
}
export function bridgesNarration(s){const c=bridgeScene(s.caseId),p=bridgesPresentation(s);return `Our scene: ${c.context} Purpose: ${c.purpose} Sentence we are trying: ${p.trial} Meaning to notice: ${p.meaning}`;}
export function bridgesAnnouncement(s,action){
 const order=s.order==='AB'?'A then B':'B then A',separate='Two sentences. No joining word is selected.';
 if(action==='scene')return `${bridgeScene(s.caseId).title}. ${separate}`;
 if(action==='word')return `Joining word: ${s.bridge}. Trial and meaning updated.`;
 if(action==='swap')return `Sentence order: ${order}. Trial and meaning updated.`;
 if(action==='undo')return `Last change undone. Sentence order: ${order}. ${s.bridge?`Joining word: ${s.bridge}.`:separate}`;
 return separate;
}
