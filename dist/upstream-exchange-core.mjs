import {storyView} from './keeper-story-core.mjs';
import {actTwoView} from './act-two-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {upstreamSource} from './upstream-exchange-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k);
const text=(x,max)=>typeof x==='string'&&x.length>0&&x.length<=max;
const id=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!['__proto__','constructor','prototype','toString','valueOf'].includes(x);
const dense=(x,min,max,test)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)&&test(x[i])).every(Boolean);
const lines=(x,max)=>dense(x,1,max,v=>text(v,2000));
const number=x=>Number.isSafeInteger(x)&&x>=0;
const flags=x=>object(x)&&['help','narration','together'].every(k=>typeof x[k]==='boolean');
const emptySupport=()=>({help:false,narration:false,together:false});
export function validUpstreamSource(s){
 if(!object(s)||!id(s.id)||!Number.isSafeInteger(s.version)||s.version<1||!text(s.title,200)||!text(s.origin,200)||!lines(s.letter,12)||!object(s.post))return false;
 const p=s.post;if(!text(p.reference,500)||!text(p.unit,40)||!['step','max','estimate'].every(k=>number(p[k]))||p.step<=0||p.max<=0||!Number.isInteger(p.max/p.step)||p.max/p.step>20||p.estimate>p.max||p.approximate!==true)return false;
 return dense(s.questions,1,6,q=>object(q)&&id(q.id)&&text(q.label,100)&&text(q.question,1000)&&lines(q.short,8)&&lines(q.longer,8)&&lines(q.help,8))&&new Set(s.questions.map(q=>q.id)).size===s.questions.length;
}
function register(owner,key,qid,source,valid){
 if(!own(owner,key))return {status:'missing',record:null,notice:false};
 const rows=owner[key];if(!Array.isArray(rows))return {status:'unavailable',record:null,notice:true};
 const ids=new Set(source.questions.map(q=>q.id));let notice=false;const found=[];
 for(let i=0;i<rows.length;i++){const r=rows[i];if(!own(rows,i)||!object(r)||!ids.has(r.questionId)){notice=true;continue;}if(r.questionId===qid)found.push(r);}
 if(!found.length)return {status:'missing',record:null,notice};
 if(found.length!==1||!valid(found[0]))return {status:'unavailable',record:null,notice:true};
 return {status:'ready',record:found[0],notice};
}
function receipt(r,s,qid){const p=r.posted;return object(p)&&p.kind==='local-postbag-question'&&p.version===1&&p.sourceId===s.id&&p.sourceVersion===s.version&&p.questionId===qid&&flags(p.supportBefore);}
export function upstreamView(state){
 const parent=storyView(state),story=parent.status==='ready'?parent.record:null,present=!!story&&own(story,'upstreamExchange'),owner=present?story.upstreamExchange:null;
 const valid=object(owner)&&owner.kind==='local-upstream-exchange'&&owner.version===1&&validUpstreamSource(owner.source);
 const status=parent.status!=='ready'?'locked':!present?'missing':valid?'ready':'unavailable',source=valid?owner.source:upstreamSource;
 const draftStatus=!valid||!own(owner,'draft')?'missing':object(owner.draft)&&(owner.draft.questionId===null||source.questions.some(q=>q.id===owner.draft.questionId))?'ready':'unavailable';
 const selectedQuestionId=draftStatus==='ready'?owner.draft.questionId:null;
 let sectionNotice=false;
 const questions=source.questions.map(q=>{
  const p=valid?register(owner,'posts',q.id,source,r=>receipt(r,source,q.id)):{status:'missing',record:null};
  const s=valid?register(owner,'support',q.id,source,r=>flags(r)):{status:'missing',record:null};
  const openingStatus=p.status!=='ready'?'missing':!own(p.record,'replyOpened')?'missing':typeof p.record.replyOpened==='boolean'?'ready':'unavailable';
  sectionNotice ||= !!p.notice||!!s.notice;
  return {id:q.id,source:q,postStatus:p.status,supportStatus:s.status,post:p.record,openingStatus,replyOpened:openingStatus==='unavailable'?null:p.record?.replyOpened===true,support:s.record?{help:s.record.help,narration:s.record.narration,together:s.record.together}:emptySupport(),canPost:status==='ready'&&draftStatus!=='unavailable'&&p.status==='missing'&&s.status!=='unavailable',canOpen:status==='ready'&&p.status==='ready'&&openingStatus!=='unavailable',canSupport:status==='ready'&&s.status!=='unavailable'};
 });
 return {status,owner:valid?owner:null,source,questions,question:source.questions.find(q=>q.id===selectedQuestionId)||null,selectedQuestionId,draftStatus,postsStatus:valid&&own(owner,'posts')&&!Array.isArray(owner.posts)?'unavailable':'ready',supportStatus:valid&&own(owner,'support')&&!Array.isArray(owner.support)?'unavailable':'ready',sectionNotice,canStart:status==='missing'&&actTwoView(state).letterVisible,canSelect:status==='ready'&&draftStatus!=='unavailable'};
}
// Preflight receives a disposable notebook. Never install anything it changes.
function mutate(state,options,change){
 if(storyView(state).status!=='ready'||typeof options?.canExport!=='function')return false;
 try{const candidate=structuredClone(state);change(candidate.story);if(!recoveryFitsProgressLimits(candidate))return false;const proposedStory=structuredClone(candidate.story);if(options.canExport(candidate)!==true)return false;state.story=proposedStory;return true;}catch{return false;}
}
export function startUpstream(state,options={}){
 const v=upstreamView(state);if(v.status==='ready')return true;if(!v.canStart)return false;
 return mutate(state,options,s=>{s.upstreamExchange={kind:'local-upstream-exchange',version:1,source:structuredClone(upstreamSource),draft:{questionId:null},support:[],posts:[]};});
}
export function selectUpstreamQuestion(state,qid,options={}){
 const v=upstreamView(state);if(!v.canSelect||!v.questions.some(q=>q.id===qid))return false;if(v.selectedQuestionId===qid)return true;
 return mutate(state,options,s=>{const o=s.upstreamExchange;o.draft={...(o.draft||{}),questionId:qid};});
}
export function postUpstreamQuestion(state,qid,options={}){
 const v=upstreamView(state),q=v.questions.find(q=>q.id===qid);if(v.status!=='ready'||!q)return false;if(q.postStatus==='ready')return true;if(!q.canPost)return false;
 return mutate(state,options,s=>{const o=s.upstreamExchange;if(!own(o,'posts'))o.posts=[];o.posts.push({questionId:qid,posted:{kind:'local-postbag-question',version:1,sourceId:v.source.id,sourceVersion:v.source.version,questionId:qid,supportBefore:{...q.support}},replyOpened:false});});
}
export function openUpstreamReply(state,qid,options={}){
 const v=upstreamView(state),q=v.questions.find(q=>q.id===qid);if(!q?.canOpen)return false;if(q.replyOpened)return true;
 return mutate(state,options,s=>{s.upstreamExchange.posts.find(p=>p?.questionId===qid).replyOpened=true;});
}
export function useUpstreamSupport(state,qid,key,options={}){
 if(!['help','narration','together'].includes(key))return false;const v=upstreamView(state),q=v.questions.find(q=>q.id===qid);if(!q?.canSupport)return false;if(q.support[key])return true;
 return mutate(state,options,s=>{const o=s.upstreamExchange;if(!own(o,'support'))o.support=[];let r=o.support.find(x=>x?.questionId===qid);if(!r){r={questionId:qid,...emptySupport()};o.support.push(r);}r[key]=true;});
}
