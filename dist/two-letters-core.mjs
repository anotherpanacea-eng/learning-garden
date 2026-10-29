import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {twoLettersSource} from './two-letters-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k);
const clone=x=>structuredClone(x);
const dense=(x,max=Infinity)=>Array.isArray(x)&&x.length<=max&&Object.keys(x).length===x.length&&Array.from(x).every((_,i)=>own(x,i));
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
const reserved=new Set(['__proto__','constructor','prototype','toString','valueOf']);
const code=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!reserved.has(x);
const SUPPORT=['help','comparison','narration','together'],OUTCOMES=['fits','alternative','other'],MAX_ID=1e9;
const sheetId=x=>typeof x==='string'&&/^two-letters-[1-9]\d{0,9}$/.test(x)&&Number(x.slice(12))<=MAX_ID;
const strings=(x,max,count,min=0)=>dense(x,count)&&x.length>=min&&x.every(v=>text(v,max));
// Optional helpers are deliberately outside the base source grammar.
export function readableLettersSource(s){
 if(!object(s)||!code(s.id)||!Number.isSafeInteger(s.version)||s.version<1||!text(s.title,160)||!text(s.origin,160)||!text(s.notice,1000)||!text(s.context,1000)||!dense(s.letters,2)||!s.letters.length||!dense(s.questions,13)||!s.questions.length)return false;
 const letterIds=new Set(),questionIds=new Set();
 for(const l of s.letters){if(!object(l)||!code(l.id)||letterIds.has(l.id)||!text(l.title,300)||!text(l.reader,300)||!text(l.purpose,300)||!dense(l.parts,20)||!l.parts.length)return false;letterIds.add(l.id);}
 for(const q of s.questions){
  if(!object(q)||!code(q.id)||questionIds.has(q.id)||!['gap','item'].includes(q.kind)||!letterIds.has(q.letterId)||!text(q.prompt,1000)||!(text(q.line,1000)||q.kind==='item'&&q.line==='')||!text(q.hint,600)||!text(q.explanation,600)||!strings(q.guidedSteps,600,3)||!dense(q.options,3)||q.options.length<2)return false;
  questionIds.add(q.id);const ids=new Set();let fitting=0;
  for(const o of q.options){if(!object(o)||!code(o.id)||ids.has(o.id)||!text(o.text,600)||!OUTCOMES.includes(o.outcome)||!code(o.reason)||!text(o.feedback,1000))return false;ids.add(o.id);if(o.outcome==='fits')fitting++;}
  if(fitting!==1)return false;
 }
 const gaps=new Map();
 for(const l of s.letters)for(const p of l.parts){
  if(!object(p)||own(p,'text')===own(p,'questionId'))return false;
  if(own(p,'text')){if(!text(p.text,1000))return false;}
  else{const q=s.questions.find(q=>q.id===p.questionId);if(!q||q.kind!=='gap'||q.letterId!==l.id)return false;gaps.set(q.id,(gaps.get(q.id)||0)+1);}
 }
 return s.questions.every(q=>q.kind!=='gap'||gaps.get(q.id)===1);
}
export const lettersQuestion=(source,id)=>readableLettersSource(source)?source.questions.find(q=>q.id===id)||null:null;
export function lettersCards(source){
 const cards=source?.cards;if(!readableLettersSource(source)||!dense(cards,3)||!cards.length)return null;const ids=new Set();
 return cards.every(c=>{if(!object(c)||!code(c.id)||ids.has(c.id)||!text(c.title,160)||!text(c.text,1000)||!strings(c.steps,600,3,1))return false;ids.add(c.id);return true;})?cards:null;
}
export function lettersComparison(source){const c=source?.comparison;return readableLettersSource(source)&&object(c)&&text(c.shared,1000)&&text(c.differences,1000)?c:null;}
export const lettersHelpExample=source=>readableLettersSource(source)&&text(source.helpExample,1000)?source.helpExample:null;
export const readableLettersSupport=s=>object(s)&&SUPPORT.every(k=>own(s,k)&&typeof s[k]==='boolean');
const freshSupport=()=>Object.fromEntries(SUPPORT.map(k=>[k,false]));
export function readableLettersAnswers(answers,source){
 if(!readableLettersSource(source)||!dense(answers,source.questions.length))return false;const ids=new Set();
 return answers.every(a=>{const q=object(a)&&source.questions.find(q=>q.id===a.questionId);if(!q||ids.has(a.questionId)||!q.options.some(o=>o.id===a.choiceId)||!OUTCOMES.includes(a.outcome)||!readableLettersSupport(a.supportBefore)||!own(a,'afterFeedback')||typeof a.afterFeedback!=='boolean')return false;ids.add(a.questionId);return true;});
}
export const readableLettersKeep=(kept,source)=>object(kept)&&kept.version===1&&readableLettersAnswers(kept.answers,source)&&readableLettersSupport(kept.support);
const keptPresent=s=>object(s)&&own(s,'kept')&&s.kept!==null;
const sheetFormat=s=>object(s)&&s.kind==='two-letters'&&s.version===1&&own(s,'id')&&sheetId(s.id);
const draft=s=>sheetFormat(s)&&readableLettersSource(s.source)&&readableLettersAnswers(s.answers,s.source)&&readableLettersSupport(s.support);
function desk(state){if(!object(state))return {status:'unsupported',raw:null};if(!own(state,'twoLetters'))return {status:'absent',raw:[]};return {status:dense(state.twoLetters)?'ready':'unsupported',raw:state.twoLetters};}
function idCounts(raw){const counts=new Map();if(Array.isArray(raw))for(const s of raw)if(object(s)&&own(s,'id')&&sheetId(s.id))counts.set(s.id,(counts.get(s.id)||0)+1);return counts;}
function nextId(raw){if(!dense(raw)||raw.length>=24)return null;let n=1;for(const s of raw)if(object(s)&&own(s,'id')&&sheetId(s.id))n=Math.max(n,Number(s.id.slice(12))+1);return n<=MAX_ID?`two-letters-${n}`:null;}
function uniqueSheet(state,id){const r=desk(state);if(r.status!=='ready'||!sheetId(id))return null;const found=r.raw.filter(s=>object(s)&&own(s,'id')&&s.id===id);return found.length===1&&sheetFormat(found[0])?found[0]:null;}
function sheetData(s){
 const source=readableLettersSource(s?.source)?s.source:null,blocked=keptPresent(s),kept=source&&readableLettersKeep(s?.kept,source)?s.kept:null;
 const readable=sheetFormat(s)&&!!source&&(!!kept||!blocked&&draft(s));
 return {source,answers:kept?.answers||(!blocked&&source&&readableLettersAnswers(s?.answers,source)?s.answers:null),support:kept?.support||(!blocked&&readableLettersSupport(s?.support)?s.support:null),kept,keptPresent:blocked,unreadableKept:blocked&&!kept,readable:!!readable,mutable:!!readable&&!blocked};
}
export function lettersView(state,id=null){
 const r=desk(state),raw=Array.isArray(r.raw)?r.raw:[],counts=idCounts(raw),sheet=uniqueSheet(state,id),data=sheetData(sheet);
 const sheets=raw.map((s,index)=>{const id=object(s)&&own(s,'id')&&sheetId(s.id)?s.id:null,ambiguous=!!id&&counts.get(id)>1,d=sheetData(s);return {...d,id,index,ambiguous,readable:d.readable&&!ambiguous,mutable:r.status==='ready'&&d.mutable&&!ambiguous};});
 return {status:r.status,raw:r.raw,sheets,sheet,...data,id:sheet?.id||null,index:sheet?raw.indexOf(sheet):-1,ambiguous:sheetId(id)&&(counts.get(id)||0)>1,mutable:r.status==='ready'&&data.mutable,canCreate:r.status!=='unsupported'&&nextId(raw)!==null,canRevise:!!data.kept&&r.status==='ready'&&nextId(raw)!==null,unreadableCount:sheets.filter(s=>!s.readable).length};
}
// Capture only this owner's proposal before giving a disposable whole notebook to
// the report gate. Callback changes can never leak into the committed notebook.
function write(state,change,options={}){
 if(!object(state)||typeof options?.canExport!=='function')return false;
 try{
  const candidate=clone(state),r=desk(candidate);if(r.status==='unsupported')return false;
  const before=JSON.stringify(own(candidate,'twoLetters')?candidate.twoLetters:undefined),result=change(candidate);if(result===false)return false;
  const after=candidate.twoLetters;if(before===JSON.stringify(after))return result??true;
  if(!dense(after))return false;const proposal=clone(after);
  if(!recoveryFitsProgressLimits(candidate)||options.canExport(candidate)!==true)return false;
  state.twoLetters=proposal;return result??true;
 }catch{return false;}
}
function addSheet(candidate,source,answers,support,revisedFrom=null){
 const r=desk(candidate),id=nextId(r.raw);if(r.status==='unsupported'||!id)return false;
 const sheet={kind:'two-letters',version:1,id,source:clone(source),answers:clone(answers),support:clone(support),kept:null};if(!draft(sheet))return false;
 if(revisedFrom!==null)sheet.revisedFrom=revisedFrom;
 if(!own(candidate,'twoLetters'))candidate.twoLetters=[];candidate.twoLetters.push(sheet);return id;
}
export function createLettersPage(state,source,options={}){return write(state,c=>addSheet(c,source,[],freshSupport()),options);}
function mutableChange(state,id,change,options){return write(state,c=>{const s=uniqueSheet(c,id);return s&&!keptPresent(s)&&draft(s)?change(s):false;},options);}
export function chooseLettersWords(state,id,questionId,choiceId,options={}){
 return mutableChange(state,id,s=>{
  const q=lettersQuestion(s.source,questionId),choice=q?.options.find(o=>o.id===choiceId);if(!choice)return false;
  const index=s.answers.findIndex(a=>a.questionId===questionId),old=s.answers[index];
  if(old&&old.choiceId===choiceId&&old.outcome===choice.outcome&&SUPPORT.every(k=>old.supportBefore[k]===s.support[k]))return true;
  const answer={...old,questionId,choiceId,outcome:choice.outcome,supportBefore:clone(s.support),afterFeedback:!!old};
  if(index===-1)s.answers.push(answer);else s.answers[index]=answer;return true;
 },options);
}
export function useLettersSupport(state,id,key,options={}){
 return mutableChange(state,id,s=>{if(!SUPPORT.includes(key))return false;if(s.support[key])return true;if(key==='comparison'&&!lettersComparison(s.source))return false;s.support[key]=true;return true;},options);
}
export const keepLettersPage=(state,id,options={})=>mutableChange(state,id,s=>{s.kept={version:1,answers:clone(s.answers),support:clone(s.support)};return true;},options);
export function reviseLettersPage(state,id,options={}){return write(state,c=>{const s=uniqueSheet(c,id);return s&&readableLettersSource(s.source)&&readableLettersKeep(s.kept,s.source)?addSheet(c,s.source,s.kept.answers,s.kept.support,id):false;},options);}
