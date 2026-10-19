import {roots,parts,blooms,extras,questions} from './word-garden-content.mjs';
const bases=[...roots,'helpful'],object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export const pairId=(base,part)=>`${base}:${part}`;
export const validPair=id=>typeof id==='string'&&bases.some(b=>parts.some(p=>pairId(b,p.id)===id));
export function resultFor(id){
 if(!validPair(id))return null;const [base,part]=id.split(':'),cutting=parts.find(p=>p.id===part),bloom=blooms.find(w=>w.base===base&&w.part===part),extra=extras.find(w=>w.base===base&&w.part===part);
 return {...(bloom||extra||{}),id,base,part,cutting,kind:bloom?'bloom':extra?'real':'wonder',word:bloom?.id||extra?.word||null};
}
const uniqueList=(xs,allowed)=>Array.isArray(xs)&&new Set(xs).size===xs.length&&xs.every(x=>allowed(x));
const fresh=()=>({version:1,grown:[],discoveries:[],seen:[],draft:{base:'pack',part:'re',result:null,questionId:'again',choice:null}});
export function validWords(w){
 if(!object(w)||Object.keys(w).sort().join(',')!=='discoveries,draft,grown,seen,version'||w.version!==1||!uniqueList(w.grown,id=>blooms.some(b=>b.id===id))||!uniqueList(w.discoveries,id=>validPair(id)&&resultFor(id).kind!=='bloom')||!uniqueList(w.seen,id=>questions.some(q=>q.id===id)))return false;
 const d=w.draft,q=questions.find(q=>q.id===d?.questionId);
 return object(d)&&Object.keys(d).sort().join(',')==='base,choice,part,questionId,result'&&bases.includes(d.base)&&parts.some(p=>p.id===d.part)&&(d.result===null||validPair(d.result))&&!!q&&(d.choice===null||Number.isInteger(d.choice)&&d.choice>=0&&d.choice<q.choices.length);
}
// Absent work is fresh. Unknown/present-invalid work is never normalized or replaced.
export function wordState(state){return !Object.hasOwn(state,'words')?fresh():validWords(state.words)?state.words:null;}
function change(state,fn){const w=wordState(state);if(!w||!fn(w))return false;state.words=w;return true;}
export function chooseBase(state,base){return change(state,w=>{if(!bases.includes(base))return false;w.draft.base=base;return true;});}
export function choosePart(state,part){return change(state,w=>{if(!parts.some(p=>p.id===part))return false;w.draft.part=part;return true;});}
export function tryWord(state){return change(state,w=>{const r=resultFor(pairId(w.draft.base,w.draft.part));if(!r)return false;w.draft.result=r.id;const xs=r.kind==='bloom'?w.grown:w.discoveries,id=r.kind==='bloom'?r.word:r.id;if(!xs.includes(id))xs.push(id);return true;});}
export function replayWord(state,id){if(!validPair(id))return false;return change(state,w=>{const r=resultFor(id);if(!(r.kind==='bloom'?w.grown.includes(r.word):w.discoveries.includes(id)))return false;w.draft.base=r.base;w.draft.part=r.part;w.draft.result=id;return true;});}
export function addAnotherPart(state){return change(state,w=>{if(!w.grown.includes('helpful'))return false;w.draft.base='helpful';w.draft.part='un';return true;});}
export function chooseQuestion(state,id){return change(state,w=>{if(!questions.some(q=>q.id===id))return false;w.draft.questionId=id;w.draft.choice=null;if(!w.seen.includes(id))w.seen.push(id);return true;});}
export function nextQuestion(state){const w=wordState(state);if(!w)return false;const current=questions.findIndex(q=>q.id===w.draft.questionId),rotated=[...questions.slice(current+1),...questions.slice(0,current+1)];return chooseQuestion(state,(rotated.find(q=>!w.seen.includes(q.id))||rotated[0]).id);}
export function discussWord(state,choice){return change(state,w=>{const q=questions.find(q=>q.id===w.draft.questionId);if(!Number.isInteger(choice)||choice<0||choice>=q.choices.length)return false;w.draft.choice=choice;if(!w.seen.includes(q.id))w.seen.push(q.id);return true;});}
