// Spec 344: the Rod Tray's saved work. A notebook keeps its own retained source; drafts, checks, support and
// teaching are codes, integers, booleans and explicit unknown nulls. Validation is structural and never rescoring.
import {rodTraySource} from './rod-tray-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>x!==null&&typeof x==='object'&&Object.hasOwn(x,k);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const fields=(x,ks)=>obj(x)&&ks.every(k=>own(x,k));
const code=x=>typeof x==='string'&&/^[A-Za-z0-9-]{1,40}$/.test(x);
const text=(x,n=1200)=>typeof x==='string'&&x.trim().length>0&&x.length<=n&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
const dense=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const signed=x=>Number.isSafeInteger(x)&&x>=-12&&x<=12;
const count=x=>Number.isSafeInteger(x)&&x>=0&&x<=12;
const result=(ok,changed=false,codeValue=ok?'unchanged':'unreadable')=>({ok,changed,code:codeValue});
export const ROD_MAX=12;
export const SUPPORT_FLAGS=Object.freeze(['hint','helper','line']);
export const TEACH_IDS=Object.freeze(['T1','T2','T3','T4']);
export const HELPER_IDS=Object.freeze(['adding','takeNegative','takePositive']);
export const ROD_ACTIONS=Object.freeze(['addRed','addBlack','takeRed','takeBlack','addPair','pairOff','startAgain','answerDown','answerUp']);
const fresh=ks=>Object.fromEntries(ks.map(k=>[k,false]));

export function validRodSource(s){
 if(!fields(s,['id','version','cases','helpers','teach','lines'])||!code(s.id)||!Number.isSafeInteger(s.version)||s.version<1)return false;
 if(!obj(s.helpers)||!HELPER_IDS.every(k=>fields(s.helpers[k],['sentence','steps'])&&text(s.helpers[k].sentence,80)&&dense(s.helpers[k].steps,1,3)&&s.helpers[k].steps.every(t=>fields(t,['red','black','text'])&&count(t.red)&&count(t.black)&&text(t.text))))return false;
 if(!obj(s.teach)||!TEACH_IDS.every(k=>fields(s.teach[k],['title','text','steps'])&&text(s.teach[k].title,160)&&text(s.teach[k].text)&&dense(s.teach[k].steps,1,5)&&s.teach[k].steps.every(t=>text(t))))return false;
 if(!fields(s.lines,['nonMatch'])||!text(s.lines.nonMatch))return false;
 if(!dense(s.cases,1,6)||new Set(s.cases.map(c=>c?.id)).size!==s.cases.length)return false;
 return s.cases.every(c=>fields(c,['id','title','start','op','operand','result','sentence','helper','prompt','guided','hint','explanation','feedback'])&&code(c.id)&&text(c.title,160)&&signed(c.start)&&['add','take'].includes(c.op)&&signed(c.operand)&&signed(c.result)&&text(c.sentence,80)&&HELPER_IDS.includes(c.helper)&&text(c.prompt)&&dense(c.guided,0,3)&&c.guided.every(t=>text(t))&&text(c.hint)&&text(c.explanation)&&dense(c.feedback,2,2)&&c.feedback.every(f=>fields(f,['value','line'])&&signed(f.value)&&text(f.line)));
}
const caseOf=(s,id)=>s.cases.find(c=>c.id===id)||null;
const validDraft=e=>fields(e,['caseId','red','black','answer'])&&count(e.red)&&count(e.black)&&(e.answer===null||signed(e.answer));
const nullableFlag=x=>x===null||typeof x==='boolean';
function validSnapshot(x){
 if(!fields(x,['answer','matches','red','black','helpBefore'])||!signed(x.answer)||typeof x.matches!=='boolean'||!count(x.red)||!count(x.black))return false;
 const h=x.helpBefore;return fields(h,['guided','hint','helper','line','teach'])&&typeof h.guided==='boolean'&&SUPPORT_FLAGS.every(k=>nullableFlag(h[k]))&&fields(h.teach,TEACH_IDS)&&TEACH_IDS.every(k=>nullableFlag(h.teach[k]));
}
const validCheck=e=>fields(e,['caseId','first','latest','count'])&&Number.isSafeInteger(e.count)&&e.count>=1&&e.count<=1e9&&validSnapshot(e.first)&&validSnapshot(e.latest);
const validSupport=e=>fields(e,['caseId',...SUPPORT_FLAGS])&&SUPPORT_FLAGS.every(k=>typeof e[k]==='boolean');
// A section is a dense list with at most one readable entry per case; anything else for a case is kept raw and unreadable.
function section(r,key,validate,s){
 if(!own(r,key))return {status:'ready',readable:[],unreadable:[]};const value=r[key];
 if(!dense(value,0,1000))return {status:'unreadable',readable:[],unreadable:[]};
 const counts=new Map();for(const e of value)if(obj(e)&&own(e,'caseId'))counts.set(e.caseId,(counts.get(e.caseId)||0)+1);
 const readable=[],unreadable=[];for(const e of value)(validate(e)&&!!caseOf(s,e.caseId)&&counts.get(e.caseId)===1?readable:unreadable).push(e);
 return {status:'ready',readable,unreadable};
}
// Teaching exposure: absent reads as all false; an unreadable value is unknown (null), never false.
function teachingView(r){
 if(!own(r,'teaching'))return {status:'ready',flags:fresh(TEACH_IDS)};
 if(!obj(r.teaching))return {status:'unreadable',flags:Object.fromEntries(TEACH_IDS.map(k=>[k,null]))};
 return {status:'ready',flags:Object.fromEntries(TEACH_IDS.map(k=>[k,own(r.teaching,k)?(typeof r.teaching[k]==='boolean'?r.teaching[k]:null):false]))};
}
export function readRodTray(state){
 if(!own(state,'rodTray'))return {status:'missing',root:null,source:rodTraySource};
 const r=state.rodTray;
 if(!fields(r,['kind','version'])||r.kind!=='rod-tray'||r.version!==1)return {status:'unsupported',root:r};
 if(!own(r,'source')||!validRodSource(r.source))return {status:'unreadable',root:r};
 const s=r.source;
 return {status:'ready',root:r,source:s,drafts:section(r,'drafts',validDraft,s),checks:section(r,'checks',validCheck,s),support:section(r,'support',validSupport,s),teaching:teachingView(r)};
}
const entry=(sec,id)=>sec.readable.find(e=>e.caseId===id)||null;
const bad=(sec,id)=>sec.status!=='ready'||sec.unreadable.some(e=>obj(e)&&e.caseId===id);
const EMPTY={red:0,black:0,answer:null};
// One case through its retained source. A missing root reads through today's source with an empty tray.
export function rodCaseView(stateOrView,id){
 const v=stateOrView?.status?stateOrView:readRodTray(stateOrView);
 if(v.status!=='ready'&&v.status!=='missing')return {status:v.status};
 const c=caseOf(v.source,id);if(!c)return {status:'no-case'};
 if(v.status==='missing')return {status:'ready',case:c,draft:{...EMPTY},draftReadable:true,check:null,checkReadable:true,support:fresh(SUPPORT_FLAGS),supportReadable:true,teach:fresh(TEACH_IDS),teachingReadable:true};
 const d=entry(v.drafts,id),k=entry(v.checks,id),sp=entry(v.support,id);
 const draftReadable=!bad(v.drafts,id),checkReadable=!bad(v.checks,id),supportReadable=!bad(v.support,id);
 return {status:'ready',case:c,draft:draftReadable?(d?{red:d.red,black:d.black,answer:d.answer}:{...EMPTY}):null,draftReadable,check:checkReadable?k:null,checkReadable,
  support:supportReadable?(sp?Object.fromEntries(SUPPORT_FLAGS.map(f=>[f,sp[f]])):fresh(SUPPORT_FLAGS)):Object.fromEntries(SUPPORT_FLAGS.map(f=>[f,null])),supportReadable,
  teach:{...v.teaching.flags},teachingReadable:v.teaching.status==='ready'};
}
// The worth of a tray is red minus black. The page never shows it; checks compare only the chosen answer.
export const trayWorth=t=>t.red-t.black;
export const rodMatches=(c,answer)=>answer===c.result;
// The line shown after a check: the explanation, a targeted line, or the general line, all from the retained source.
export function rodFeedback(source,c,answer){if(answer===c.result)return c.explanation;const f=c.feedback.find(x=>x.value===answer);return f?f.line:source.lines.nonMatch;}
// A saved check's line follows its saved matches, never a fresh comparison with the case's result.
export function rodSavedFeedback(source,c,snap){if(snap.matches)return c.explanation;const f=c.feedback.find(x=>x.value===snap.answer);return f?f.line:source.lines.nonMatch;}
// The move on the number line: from start, by the operand's effect.
export function rodMove(c){const delta=c.op==='add'?c.operand:-c.operand;return {from:c.start,to:c.start+delta,delta,through:c.start*(c.start+delta)<0};}
// Tray actions. A limit refuses without writing; Pair them off on one kind (or nothing) is a no-op.
export function applyRodAction(t,action){
 const x={...t};
 switch(action){
  case 'addRed':if(x.red>=ROD_MAX)return {refused:'full'};x.red++;break;
  case 'addBlack':if(x.black>=ROD_MAX)return {refused:'full'};x.black++;break;
  case 'takeRed':if(x.red<=0)return {refused:'no-red'};x.red--;break;
  case 'takeBlack':if(x.black<=0)return {refused:'no-black'};x.black--;break;
  case 'addPair':if(x.red>=ROD_MAX||x.black>=ROD_MAX)return {refused:'full'};x.red++;x.black++;break;
  case 'pairOff':{const n=Math.min(x.red,x.black);if(!n)return {tray:x,paired:0};x.red-=n;x.black-=n;return {tray:x,paired:n};}
  case 'startAgain':x.red=0;x.black=0;break;
  case 'answerDown':x.answer=x.answer===null?-1:Math.max(-ROD_MAX,x.answer-1);break;
  case 'answerUp':x.answer=x.answer===null?1:Math.min(ROD_MAX,x.answer+1);break;
  default:return {refused:'invalid-choice'};
 }
 return {tray:x};
}
function commit(state,root,gate){try{const candidate=structuredClone(state);candidate.rodTray=root;if(typeof gate!=='function'||!recoveryFitsProgressLimits(candidate)||gate(candidate)!==true)return result(false,false,'report-safety');state.rodTray=root;return result(true,true,'changed');}catch{return result(false,false,'report-safety');}}
// The root appears with the first change, holding its own copy of the whole case set.
function writable(state){
 const v=readRodTray(state);
 if(v.status==='missing')return {v,root:{kind:'rod-tray',version:1,source:structuredClone(rodTraySource),drafts:[],checks:[],support:[],teaching:fresh(TEACH_IDS)}};
 if(v.status!=='ready')return {refusal:result(false,false,v.status)};
 return {v,root:structuredClone(v.root)};
}
function replace(root,key,id,e){if(!Array.isArray(root[key]))root[key]=[];const list=root[key],i=list.findIndex(x=>obj(x)&&x.caseId===id);if(i<0)list.push(e);else list[i]=e;}
export function rodAction(state,id,action,gate){
 const w=writable(state);if(w.refusal)return w.refusal;
 const c=rodCaseView(w.v,id);if(c.status!=='ready')return result(false,false,'invalid-choice');if(!c.draftReadable)return result(false,false,'unreadable');
 const step=applyRodAction(c.draft,action);if(step.refused)return result(false,false,step.refused);
 const t=step.tray,base={...result(true),paired:step.paired??null};
 if(t.red===c.draft.red&&t.black===c.draft.black&&t.answer===c.draft.answer)return {...base,code:action==='pairOff'?'no-pairs':'unchanged'};
 const old=w.v.status==='ready'?entry(w.v.drafts,id):null;
 replace(w.root,'drafts',id,{...(old?structuredClone(old):{}),caseId:id,red:t.red,black:t.black,answer:t.answer});
 return {...commit(state,w.root,gate),paired:step.paired??null};
}
// The help shown before a check. Guided steps count as help by design; unreadable support or teaching stays null.
function helpBefore(c){return {guided:c.case.guided.length>0,hint:c.support.hint,helper:c.support.helper,line:c.support.line,teach:{...c.teach}};}
const sameSnapshot=(a,b)=>a.answer===b.answer&&a.red===b.red&&a.black===b.black&&a.helpBefore.guided===b.helpBefore.guided&&SUPPORT_FLAGS.every(k=>a.helpBefore[k]===b.helpBefore[k])&&TEACH_IDS.every(k=>a.helpBefore.teach[k]===b.helpBefore.teach[k]);
export function rodCheck(state,id,gate){
 const w=writable(state);if(w.refusal)return w.refusal;
 const c=rodCaseView(w.v,id);if(c.status!=='ready')return result(false,false,'invalid-choice');
 if(!c.draftReadable||!c.checkReadable)return result(false,false,'unreadable');
 if(c.draft.answer===null)return result(false,false,'no-answer');
 const snap={answer:c.draft.answer,matches:rodMatches(c.case,c.draft.answer),red:c.draft.red,black:c.draft.black,helpBefore:helpBefore(c)};
 if(c.check&&sameSnapshot(c.check.latest,snap))return result(true,false,'no-op');
 if(c.check&&c.check.count>=1e9)return result(false,false,'count-cap');
 replace(w.root,'checks',id,c.check?{...structuredClone(c.check),latest:snap,count:c.check.count+1}:{caseId:id,first:snap,latest:structuredClone(snap),count:1});
 return commit(state,w.root,gate);
}
export function rodSupport(state,id,flag,gate){
 const w=writable(state);if(w.refusal)return w.refusal;if(!SUPPORT_FLAGS.includes(flag))return result(false,false,'invalid-choice');
 const c=rodCaseView(w.v,id);if(c.status!=='ready')return result(false,false,'invalid-choice');if(!c.supportReadable)return result(false,false,'unreadable');
 if(c.support[flag]===true)return result(true);
 const old=w.v.status==='ready'?entry(w.v.support,id):null;
 replace(w.root,'support',id,{...(old?structuredClone(old):{caseId:id,...fresh(SUPPORT_FLAGS)}),caseId:id,[flag]:true});
 return commit(state,w.root,gate);
}
export function rodTeaching(state,card,gate){
 const w=writable(state);if(w.refusal)return w.refusal;if(!TEACH_IDS.includes(card))return result(false,false,'invalid-choice');
 const t=w.v.status==='ready'?w.v.teaching:{status:'ready',flags:fresh(TEACH_IDS)};
 if(t.status!=='ready'||t.flags[card]===null)return result(false,false,'unreadable');if(t.flags[card]===true)return result(true);
 if(!obj(w.root.teaching))w.root.teaching={};w.root.teaching[card]=true;
 return commit(state,w.root,gate);
}
