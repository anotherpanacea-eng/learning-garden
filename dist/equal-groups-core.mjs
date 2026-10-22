import {GROUP_CASES,GROUP_UNKNOWNS,caseById,groupPrompt} from './equal-groups-content.mjs';
const PLACES=['cafe','bramble'],SUPPORT=['visual','moves','counters','equations','together','audio','example','check'];
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const whole=(x,max)=>Number.isInteger(x)&&x>=0&&x<=max;
const clone=x=>JSON.parse(JSON.stringify(x));
const supportValid=s=>object(s)&&Object.entries(s).every(([k,v])=>SUPPORT.includes(k)&&typeof v==='boolean');
const mergeSupport=(...items)=>Object.assign({},...items.map(s=>Object.fromEntries(Object.entries(s||{}).filter(([,v])=>v===true))));
export function modelTray(c,model){return c.total-model.groups.reduce((sum,n)=>sum+n,0);}
const modelValid=(c,m)=>object(m)&&Array.isArray(m.groups)&&m.groups.length<=12&&m.groups.every(n=>whole(n,12))&&modelTray(c,m)>=0;
export function arrangementFits(c,model){return modelValid(c,model)&&model.groups.length===c.groups&&model.groups.every(n=>n===c.each)&&modelTray(c,model)===0;}
const contextValid=x=>object(x)&&typeof x.familiar==='boolean'&&supportValid(x.priorSupport);
function attemptValid(c,a){return object(a)&&whole(a.answer,144)&&typeof a.correct==='boolean'&&typeof a.arrangementFit==='boolean'&&a.practice===true&&modelValid(c,a.model)&&supportValid(a.support)&&contextValid(a.context)&&(a.method===null||typeof a.method==='string'&&a.method.length<=80);}
function draftValid(c,d){return object(d)&&typeof d.input==='string'&&d.input.length<=80&&Array.isArray(d.attempts)&&d.attempts.length<=24&&d.attempts.every(a=>attemptValid(c,a))&&supportValid(d.support)&&d.support.visual===true&&(d.method===null||typeof d.method==='string'&&d.method.length<=80)&&(d.exampleStep===null||whole(d.exampleStep,2))&&typeof d.feedback==='string'&&typeof d.error==='string'&&contextValid(d.context);}
function workValid(c,w){return object(w)&&GROUP_UNKNOWNS.includes(w.unknown)&&modelValid(c,w.model)&&object(w.drafts)&&GROUP_UNKNOWNS.every(k=>draftValid(c,w.drafts[k]))&&Array.isArray(w.seen)&&w.seen.length<=3&&new Set(w.seen).size===w.seen.length&&w.seen.every(k=>GROUP_UNKNOWNS.includes(k))&&typeof w.familiar==='boolean'&&(w.provenance===null||object(w.provenance)&&PLACES.includes(w.provenance.source)&&GROUP_UNKNOWNS.includes(w.provenance.unknown)&&object(w.provenance.case)&&w.provenance.case.id===c.id&&['groups','each','total'].every(k=>w.provenance.case[k]===c[k])&&modelValid(c,w.provenance.model)&&supportValid(w.provenance.support));}
export function groupState(state){
 const r=state.equalGroups;
 if(!object(r)||r.version!==1||!object(r.selected)||!object(r.cases)||Object.keys(r.cases).length>6)return null;
 if(!PLACES.every(p=>object(r.selected[p])&&(r.selected[p].caseId===null||caseById(r.selected[p].caseId))&&GROUP_UNKNOWNS.includes(r.selected[p].unknown)))return null;
 for(const [id,places] of Object.entries(r.cases)){
  const c=caseById(id);
  if(!c||!object(places)||Object.keys(places).some(p=>!PLACES.includes(p)||!workValid(c,places[p])))return null;
 }
 if(PLACES.some(p=>r.selected[p].caseId&&!r.cases[r.selected[p].caseId]?.[p]))return null;
 return r;
}
const fresh=()=>({version:1,selected:{cafe:{caseId:null,unknown:'total'},bramble:{caseId:null,unknown:'total'}},cases:{}});
export function ensureEqualGroups(state){if(state.equalGroups===undefined)state.equalGroups=fresh();return groupState(state);}
export function recoverGroupState(state){if(groupState(state))return false;const old=state.equalGroups;state.equalGroups=fresh();if(old!==undefined)state.equalGroups.recovered=old;return true;}
const newDraft=()=>({input:'',attempts:[],support:{visual:true},method:null,exampleStep:null,feedback:'',error:'',context:{familiar:false,priorSupport:{}}});
function newWork(c,unknown,model){return {unknown,model:model?clone(model):{groups:Array(unknown==='groups'?0:c.groups).fill(0)},drafts:Object.fromEntries(GROUP_UNKNOWNS.map(k=>[k,newDraft()])),seen:[],familiar:false,provenance:null};}
export function currentGroupWork(state,place){const r=groupState(state);if(!r||!PLACES.includes(place))return null;const sel=r.selected[place],c=caseById(sel.caseId),w=c&&r.cases[c.id]?.[place];return w?{case:c,unknown:w.unknown,model:w.model,work:w,draft:w.drafts[w.unknown]}:null;}
export function chooseGroupCase(state,place,id){const r=ensureEqualGroups(state),c=caseById(id);if(!r||!PLACES.includes(place)||!c)return false;r.cases[id]??={};const unknown=r.selected[place].unknown;r.cases[id][place]??=newWork(c,unknown);r.selected[place]={caseId:id,unknown};return chooseGroupUnknown(state,place,unknown);}
export function chooseGroupUnknown(state,place,unknown){const r=ensureEqualGroups(state);if(!r||!PLACES.includes(place)||!GROUP_UNKNOWNS.includes(unknown))return false;r.selected[place].unknown=unknown;const current=currentGroupWork(state,place);if(current){current.work.unknown=unknown;if(current.work.seen.includes(unknown))current.work.drafts[unknown].context.familiar=true;}return true;}
function priorContext(r,c,place,unknown){let familiar=false,support={};for(const p of PLACES){const w=r.cases[c.id]?.[p];if(!w)continue;if(w.provenance){familiar=true;support=mergeSupport(support,w.provenance.support);}for(const k of w.seen){if(p===place&&k===unknown)continue;familiar=true;support=mergeSupport(support,w.drafts[k].support,w.drafts[k].context.priorSupport);}}return {familiar,priorSupport:support};}
export function noteGroupView(state,place){const r=groupState(state),x=currentGroupWork(state,place);if(!x)return false;const prior=priorContext(r,x.case,place,x.unknown);x.draft.context.familiar ||= prior.familiar||x.work.familiar;x.draft.context.priorSupport=mergeSupport(x.draft.context.priorSupport,prior.priorSupport);if(!x.work.seen.includes(x.unknown))x.work.seen.push(x.unknown);return true;}
export function useGroupSupport(state,place,kind){const x=currentGroupWork(state,place);if(!x||!SUPPORT.includes(kind))return false;noteGroupView(state,place);x.draft.support[kind]=true;if(kind==='example'&&x.draft.exampleStep===null)x.draft.exampleStep=0;return true;}
export function moveGroupModel(state,place,action,index){
 const x=currentGroupWork(state,place);if(!x)return false;const g=x.model.groups,tray=modelTray(x.case,x.model);let changed=false;
 if(action==='add-group'&&g.length<12){g.push(0);changed=true;}
 else if(action==='remove-group'&&whole(index,g.length-1)&&g[index]===0){g.splice(index,1);changed=true;}
 else if(action==='in'&&whole(index,g.length-1)&&g[index]<12&&tray>0){g[index]++;changed=true;}
 else if(action==='out'&&whole(index,g.length-1)&&g[index]>0){g[index]--;changed=true;}
 else if(action==='scoop'&&x.unknown!=='each'&&whole(index,g.length-1)&&g[index]+x.case.each<=12&&tray>=x.case.each){g[index]+=x.case.each;changed=true;}
 else if(action==='round'&&g.length>0&&tray>=g.length&&g.every(n=>n<12)){for(let i=0;i<g.length;i++)g[i]++;changed=true;}
 else if(action==='reset'&&g.some(n=>n>0)){g.fill(0);changed=true;}
 if(changed){useGroupSupport(state,place,'moves');for(const d of Object.values(x.work.drafts))d.feedback='';x.draft.error='';}return changed;
}
export function setGroupInput(state,place,value){const x=currentGroupWork(state,place);if(!x||typeof value!=='string')return false;x.draft.input=value.slice(0,80);x.draft.error='';x.draft.feedback='';return true;}
export function setGroupMethod(state,place,method){const x=currentGroupWork(state,place);if(!x||!(method===null||typeof method==='string'))return false;x.draft.method=method===null?null:method.slice(0,80);if(method==='together')useGroupSupport(state,place,'together');const last=x.draft.attempts.at(-1);if(last){last.method=x.draft.method;if(method==='together')last.support.together=true;}return true;}
export function stepGroupExample(state,place,delta){const x=currentGroupWork(state,place);if(!x||![-1,1].includes(delta))return false;useGroupSupport(state,place,'example');x.draft.exampleStep=Math.max(0,Math.min(2,x.draft.exampleStep+delta));return true;}
export function checkGroupArrangement(state,place){const x=currentGroupWork(state,place);if(!x)return false;useGroupSupport(state,place,'check');const fits=arrangementFits(x.case,x.model);const u=place==='bramble'?{group:'bundle',groups:'bundles',objects:'ribbons',prep:'in'}:{group:'plate',groups:'plates',objects:'bites',prep:'on'};x.draft.feedback=fits?`The arrangement fits: all the ${u.objects} are in equal ${u.groups}.`:x.unknown==='groups'?`Use all ${x.case.total} ${u.objects}. Put ${x.case.each} ${u.prep} each ${u.group}. Every ${u.group} needs that same amount.`:x.unknown==='each'?`Share all ${x.case.total} ${u.objects} among ${x.case.groups} ${u.groups}. Each ${u.group} needs the same amount.`:`Make ${x.case.groups} ${u.groups} with ${x.case.each} ${u.objects} ${u.prep} each. Keep exploring. Your arrangement stays as you made it.`;x.draft.error='';return {fits};}
export function submitGroupAnswer(state,place){
 const x=currentGroupWork(state,place);if(!x)return false;const text=x.draft.input.trim();if(!/^\d{1,3}$/.test(text)||!whole(Number(text),144)){x.draft.error='Use a whole number from 0 to 144.';return {valid:false};}
 noteGroupView(state,place);const answer=Number(text),correct=answer===groupPrompt(x.case,place,x.unknown).answer,fit=arrangementFits(x.case,x.model);
 x.draft.attempts.push({answer,correct,arrangementFit:fit,model:clone(x.model),support:clone(x.draft.support),context:clone(x.draft.context),method:null,practice:true});x.draft.attempts=x.draft.attempts.slice(-24);x.draft.method=null;x.draft.error='';x.draft.feedback=correct?(fit?'That number fits, and your equal groups fit too.':'That number fits. Your pictured groups can still be changed to fit the story.'):'That number does not fit this question yet. You can change your number, your groups, or ask for help.';return {valid:true,correct,arrangementFit:fit};
}
export function carryGroupWork(state,source){const r=groupState(state),x=currentGroupWork(state,source);if(!x)return false;const target=source==='cafe'?'bramble':'cafe',id=x.case.id;let reused=!!r.cases[id][target];if(!reused){const next=GROUP_UNKNOWNS[(GROUP_UNKNOWNS.indexOf(x.unknown)+1)%3],w=newWork(x.case,next,x.model),prior=priorContext(r,x.case,target,next);w.familiar=true;w.provenance={source,unknown:x.unknown,case:clone(x.case),model:clone(x.model),support:mergeSupport(prior.priorSupport,x.draft.support)};w.drafts[next].context={familiar:true,priorSupport:clone(w.provenance.support)};r.cases[id][target]=w;}r.selected[target]={caseId:id,unknown:r.cases[id][target].unknown};return {target,reused};}
