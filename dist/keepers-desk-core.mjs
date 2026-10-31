import {deskSource} from './keepers-desk-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const clone=x=>structuredClone(x),object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(o,k)=>Object.hasOwn(o,k);
const text=(v,n=4000)=>typeof v==='string'&&v.length<=n;
const integer=(v,max=1e9)=>Number.isSafeInteger(v)&&v>=0&&v<=max;
const stepIds=['cost','crossings','records','recommendation'];
const mechanical=['number','budget','rule','ratio','share'];
const outcomes=['match','different','interpretation','uncheckable','skipped'];
const format={number:'Enter a whole number, such as 130.',ratio:'Use two whole numbers separated by a colon, such as 1:3.',share:'Use a fraction, decimal or percent, such as 1/4, 0.25 or 25%.',rule:'Use whole numbers, L, +, −, × and brackets to write a linear rule.'};
const large='That expression is too large to check here. Use a shorter linear rule with whole numbers.';
const mismatch='This answer does not match the model yet. Compare the quantities or open a hint.';
const id=x=>text(x,80)&&/^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(x);
const safePair=p=>p.every(n=>n<=BigInt(Number.MAX_SAFE_INTEGER)&&n>=-BigInt(Number.MAX_SAFE_INTEGER));
function groupedNumber(s){return /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(s)?s.replaceAll(',',''):null;}
// Exact affine pairs are checked at each operation, so nonlinear cancellation is not accepted.
export function parseAffine(input){
 if(!text(input,160))return {ok:false,error:large};
 const s=input.replaceAll('−','-').replaceAll('×','*').replaceAll('l','L');let p=0,tokens=[];
 while(p<s.length){if(/\s/.test(s[p])){p++;continue;}const m=s.slice(p).match(/^(?:\d[\d,]*|L|[()+*\-])/);if(!m)return {ok:false,error:format.rule};const raw=m[0];if(/^\d/.test(raw)){const n=groupedNumber(raw);if(n===null)return {ok:false,error:format.rule};tokens.push({kind:'n',value:BigInt(n)});}else tokens.push({kind:raw});p+=raw.length;if(tokens.length>96)return {ok:false,error:large};}
 let at=0,depth=0;const peek=()=>tokens[at]?.kind,fail=message=>{throw Error(message);},bounded=pair=>{if(!safePair(pair))fail(large);return pair;};
 function atom(){if(++depth>12)fail(large);let r;const k=peek();if(k==='+'||k==='-'){at++;const a=atom();r=k==='-'?a.map(n=>-n):a;}else if(k==='n'){r=[0n,tokens[at++].value];}else if(k==='L'){at++;r=[1n,0n];}else if(k==='('){at++;r=sum();if(peek()!==')')fail(format.rule);at++;}else fail(format.rule);depth--;return bounded(r);}
 function product(){let a=atom();while(peek()==='*'||['L','('].includes(peek())){if(peek()==='*')at++;const b=atom();if(a[0]!==0n&&b[0]!==0n)fail(format.rule);a=bounded([a[0]*b[1]+a[1]*b[0],a[1]*b[1]]);}return a;}
 function sum(){let a=product();while(peek()==='+'||peek()==='-'){const op=tokens[at++].kind,b=product();a=bounded([a[0]+(op==='+'?b[0]:-b[0]),a[1]+(op==='+'?b[1]:-b[1])]);}return a;}
 try{if(!tokens.length)return {ok:false,error:format.rule};const [a,b]=sum();if(at!==tokens.length)return {ok:false,error:format.rule};return {ok:true,coefficient:Number(a),constant:Number(b)};}catch(e){return {ok:false,error:e.message};}
}
const gcd=(a,b)=>{while(b){[a,b]=[b,a%b];}return a;};
export function parseShare(input){
 if(!text(input,160))return {ok:false,error:large};let s=input.trim();if(s.includes(':'))return {ok:false,error:'Use fraction notation here, such as 1/4, rather than a colon. Compare farm carts with all crossings.'};let n,d;
 if(/^\d+\s*\/\s*\d+$/.test(s)){const a=s.split('/');n=BigInt(a[0].trim());d=BigInt(a[1].trim());if(d===0n)return {ok:false,error:format.share};}
 else {const percent=s.endsWith('%');if(percent)s=s.slice(0,-1).trim();if(!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return {ok:false,error:format.share};const [whole,decimal='']=s.split('.');n=BigInt((whole||'0')+decimal);d=10n**BigInt(decimal.length);if(percent)d*=100n;}
 const g=gcd(n,d);return {ok:true,numerator:n/g,denominator:d/g};
}
function parseRatio(value){if(!text(value,160)||!/^\s*\d+\s*:\s*\d+\s*$/.test(value))return null;const [a,b]=value.split(':').map(x=>BigInt(x.trim()));return {a,b};}
function whole(value,length=false){if(!text(value,160))return null;let s=value.trim();if(length)s=s.replace(/^L\s*=\s*/i,'').replace(/\s*(?:metres?|meters?|m)\s*$/i,'');else s=s.replace(/\s*coins?\s*$/i,'');s=s.trim();const n=groupedNumber(s);if(n===null)return null;const v=Number(n);return Number.isSafeInteger(v)?v:null;}
const result=(outcome,feedback,code=outcome)=>({outcome,feedback,code});
export function checkDeskValue(source,taskId,value){
 const t=source.tasks.find(t=>t.id===taskId);if(!t)return result('uncheckable','This saved question is not available to check.','missing');const m=source.model;
 if(t.kind==='number'){
 const n=whole(value,t.id==='1d');if(n===null)return result('uncheckable',format.number,'format');let answer;
 if(t.id==='1a')answer=m.bridge.setup+m.bridge.rate*m.bridge.length;
 else if(t.id==='1b')answer=m.causeway.setup+m.causeway.rate*m.causeway.length;
 else if(t.id==='1d'){const rate=m.causeway.rate-m.bridge.rate;if(rate===0)return result('uncheckable','These saved rules do not have one crossing length.','model');answer=(m.bridge.setup-m.causeway.setup)/rate;}
 else return result('uncheckable','This saved numerical question has no checker.','missing');
 if(n===answer)return result('match','This answer matches the model.');
 let reply=mismatch;
 if(t.id==='1a'||t.id==='1b'){const a=t.id==='1a'?m.bridge:m.causeway;if(n===a.rate*a.length)reply='That is the per-meter part. Include the setup once.';else if(n===a.setup+a.rate)reply='That is one meter. Compare it with this crossing’s length.';else if(n===(a.setup+a.rate)*a.length)reply='The setup is paid once, not for every meter.';}
 if(t.id==='1d'){if(n===m.bridge.setup-m.causeway.setup)reply='That is the difference in setup costs. How many extra meters use it up?';else if(n===m.causeway.rate-m.bridge.rate)reply='That is the extra cost per meter. Compare it with the setup difference.';else if(n===m.bridge.setup+m.bridge.rate*answer)reply='That is a shared cost. The question asks for the length.';}
 return result('different',reply);
 }
 if(t.kind==='budget'){
 if(!object(value)||!['bridge','causeway','both'].every(k=>['fits','not'].includes(value[k])))return result('uncheckable','Complete all three fund comparisons before checking.','format');
 const a=m.bridge.setup+m.bridge.rate*m.bridge.length,b=m.causeway.setup+m.causeway.rate*m.causeway.length,expected={bridge:a<=m.fund?'fits':'not',causeway:b<=m.fund?'fits':'not',both:a+b<=m.fund?'fits':'not'},matches=Object.fromEntries(Object.keys(expected).map(k=>[k,value[k]===expected[k]]));
 return {...result(Object.values(matches).every(Boolean)?'match':'different',Object.entries(matches).map(([k,match])=>`${k==='both'?'Both together':k==='bridge'?'Footbridge':'Causeway'}: ${match?'matches the fund comparison':'compare this total with the fund'}.`).join(' ')),comparisons:matches};
 }
 if(t.kind==='rule'){const v=parseAffine(value);if(!v.ok)return result('uncheckable',v.error,'format');const plan=m[t.plan];return v.coefficient===plan.rate&&v.constant===plan.setup?result('match','This answer matches the model.'):result('different',mismatch+' The fixed part is paid once; the coefficient is how much one extra meter adds.');}
 if(t.kind==='ratio'){
 const v=parseRatio(value);if(!v||v.a===0n&&v.b===0n)return result('uncheckable',format.ratio,'format');const day=m[t.day],a=BigInt(day.carts),b=BigInt(day.walkers),g=gcd(a,b);
 if(v.a===a/g&&v.b===b/g)return result('match','This answer matches the model.');
 if(v.a*b===v.b*a)return result('different','Those parts give an equivalent ratio. Can both still be divided by the same common factor?');
 if(v.a*a===v.b*b)return result('different','Farm carts were asked for first, so farm carts go first: carts to walkers.');
 if(a-v.a>0n&&a-v.a===b-v.b)return result('different','Taking the same amount off both parts changes the comparison. Divide both parts by the same number instead.');
 return result('different',mismatch);
 }
 if(t.kind==='share'){const v=parseShare(value);if(!v.ok)return result('uncheckable',v.error,'format');const day=m[t.day],a=BigInt(day.carts),b=BigInt(day.walkers);if(v.numerator*(a+b)===v.denominator*a)return result('match','This answer matches the model.');if(v.numerator*b===v.denominator*a)return result('different','That compares carts with walkers. Which count includes everyone?');return result('different',mismatch);}
 if(t.kind==='choice'){const c=t.choices.find(c=>c.id===value);return c?result('interpretation',c.reply||'Your reading is kept.'):result('uncheckable','Choose one reading to keep.','format');}
 if(t.kind==='multi'){if(!Array.isArray(value)||value.some(x=>!t.choices.some(c=>c.id===x)))return result('uncheckable','Choose any of these questions, or keep none for now.','format');return result('interpretation',value.length?value.map(x=>t.choices.find(c=>c.id===x).reply).join(' '):'No questions chosen yet; you can add one later.');}
 if(t.kind==='source'){
 if(!object(value)||!source.sourceKinds.some(c=>c.id===value.kind)||!object(value.cards)||!t.claims.every(c=>['can','cannot'].includes(value.cards[c.id])))return result('uncheckable','Choose a kind and a place for each claim card.','format');
 return result('interpretation',source.records.find(r=>r.id===t.recordId)?.reply||'Your reading is kept.');
 }
 return result('uncheckable','This saved question has no checker.','missing');
}
function validSource(s){
 try{
 const strings=(o,keys)=>object(o)&&keys.every(k=>text(o[k]));
 const stringList=(a,n=40)=>Array.isArray(a)&&a.length<=n&&a.every(v=>text(v));
 const choiceList=(a,n=30)=>Array.isArray(a)&&a.length<=n&&new Set(a.map(c=>c?.id)).size===a.length&&a.every(c=>strings(c,['label'])&&id(c.id)&&(!own(c,'reply')||text(c.reply)));
 if(!object(s)||s.id!=='bridge-or-ford'||s.version!==1||!strings(s,['title','label','question','equalityContrast','costContrast','ratioContrast'])||!strings(s.arrival,['title','body','speaker','words','recap','welcome'])||!strings(s.plans,['bridge','causeway'])||!stringList(s.equality)||!Array.isArray(s.steps)||s.steps.length>12||!Array.isArray(s.tasks)||s.tasks.length>64||!Array.isArray(s.records)||s.records.length>20||!choiceList(s.sourceKinds)||!object(s.recommendation))return false;
 const rec=s.recommendation;
 if(!stringList(rec.fields,8)||!choiceList(rec.plans)||!strings(rec,['response','closure'])||!object(rec.starters)||!['reason','objection','uncertainty'].every(k=>stringList(rec.starters[k]))||!object(rec.objections)||!Object.values(rec.objections).every(v=>text(v)))return false;
 const model=s.model;if(!object(model)||!integer(model.fund,1e6))return false;
 for(const k of ['bridge','causeway']){const p=model[k];if(!object(p)||!['setup','rate','length'].every(n=>integer(p[n],10000)))return false;}
 for(const k of ['saturday','tuesday'])if(!object(model[k])||!integer(model[k].carts,1e6)||!integer(model[k].walkers,1e6)||model[k].carts+model[k].walkers===0)return false;
 if(!s.records.every(r=>strings(r,['title','kind','date','text','reply'])&&id(r.id)&&(!own(r,'entries')||stringList(r.entries,40))))return false;
 if(!s.steps.every(x=>object(x)&&stepIds.includes(x.id)&&text(x.title)&&stringList(x.learn,30)&&stringList(x.guided,12)))return false;
 if(new Set(s.steps.map(x=>x.id)).size!==s.steps.length||new Set(s.tasks.map(x=>x.id)).size!==s.tasks.length)return false;
 return s.tasks.every(t=>{
 if(!object(t)||!id(t.id)||!stepIds.includes(t.stepId)||!s.steps.some(x=>x.id===t.stepId)||!['number','budget','rule','ratio','share','choice','multi','source'].includes(t.kind)||!text(t.prompt)||own(t,'intro')&&!text(t.intro))return false;
 if(mechanical.includes(t.kind)&&!strings(t,['hint','example']))return false;
 if(['choice','multi','budget'].includes(t.kind)&&!choiceList(t.choices))return false;
 if(['choice','multi'].includes(t.kind)&&!t.choices.every(c=>text(c.reply)))return false;
 if(t.kind==='rule'&&(!['bridge','causeway'].includes(t.plan)||!stringList(t.tiles,30)))return false;
 if(['ratio','share'].includes(t.kind)&&!['saturday','tuesday'].includes(t.day))return false;
 if(t.kind==='source'&&(!id(t.recordId)||!s.records.some(r=>r.id===t.recordId)||!choiceList(t.claims,12)))return false;
 return true;
 });
 }catch{return false;}
}
function validDraft(v){return text(v,1000)||Array.isArray(v)&&v.length<=64&&v.every(x=>text(x,80))||object(v)&&Object.keys(v).length<=20&&Object.values(v).every(x=>text(x,1000)||object(x)&&Object.keys(x).length<=20&&Object.values(x).every(y=>text(y,80)));}
function validAttempt(a){return object(a)&&validDraft(a.value)&&outcomes.includes(a.outcome)&&text(a.feedback,12000)&&text(a.code,80)&&object(a.support)&&integer(a.priorAttempts)&&typeof a.familiar==='boolean';}
function validStep(s){
 try{return object(s)&&object(s.drafts)&&Object.entries(s.drafts).length<=64&&Object.entries(s.drafts).every(([k,v])=>id(k)&&validDraft(v))&&integer(s.shownLearn,30)&&Array.isArray(s.shownGuided)&&s.shownGuided.length<=64&&s.shownGuided.every(id)&&typeof s.folded==='boolean'&&Array.isArray(s.support)&&s.support.length<=200000&&s.support.every(x=>object(x)&&text(x.code,80)&&(!x.taskId||id(x.taskId))&&(!own(x,'count')||Number.isSafeInteger(x.count)&&x.count>0))&&object(s.help)&&Object.entries(s.help).every(([k,v])=>id(k)&&integer(v,3))&&object(s.attempts)&&Object.entries(s.attempts).every(([k,v])=>id(k)&&Array.isArray(v)&&v.length<=32&&v.every(validAttempt))&&object(s.first)&&Object.entries(s.first).every(([k,v])=>id(k)&&validAttempt(v))&&object(s.counts)&&Object.entries(s.counts).every(([k,v])=>id(k)&&integer(v))&&Object.entries(s.attempts).every(([k,a])=>!a.length||own(s.first,k)&&integer(s.counts[k])&&s.counts[k]>=a.length)&&(!own(s,'trials')||Array.isArray(s.trials)&&s.trials.length<=20&&s.trials.every(v=>object(v)&&integer(v.length,100)&&integer(v.bridge,2e6)&&integer(v.causeway,2e6)));}catch{return false;}
}
function validRecommendation(r){
 const fields=['plan','reason','objection','uncertainty'];
 const kept=k=>object(k)&&fields.every(f=>text(k[f],1000))&&text(k.planId,80)&&text(k.objectionCode,80)&&text(k.objectionQuestion)&&object(k.support);
 return object(r)&&object(r.draft)&&fields.every(k=>text(r.draft[k],1000))&&text(r.planId,80)&&text(r.objectionCode,80)&&(!r.first||kept(r.first))&&(!r.kept||kept(r.kept));
}
export function deskView(state){
 if(!own(state,'desk'))return {status:'missing',record:null,source:null,steps:{}};
 const d=state.desk;if(!object(d)||d.version!==1||typeof d.arrived!=='boolean'||!validSource(d.source)||!object(d.steps)||!object(d.location))return {status:'unavailable',record:d,source:null,steps:{}};
 return {status:'ready',record:d,source:d.source,steps:Object.fromEntries(stepIds.map(k=>[k,validStep(d.steps[k])?d.steps[k]:null])),recommendation:validRecommendation(d.recommendation)?d.recommendation:null};
}
function mutate(state,options,fn){
 try{const previous=deskView(state),candidate=clone(state),r=fn(candidate);if(!r)return false;const after=deskView(candidate);if(after.status!=='ready'||Object.entries(previous.steps).some(([key,step])=>step&&!after.steps[key]))return false;if(!recoveryFitsProgressLimits(candidate)||options?.canExport&&options.canExport(candidate)!==true)return false;state.desk=candidate.desk;return r;}catch{return false;}
}
const freshStep=()=>({drafts:{},shownLearn:0,shownGuided:[],folded:false,support:[],help:{},attempts:{},first:{},counts:{},trials:[]});
export function startDesk(state,options={}){if(deskView(state).status!=='missing')return false;return mutate(state,options,c=>{c.desk={version:1,arrived:options.arrived!==false,source:clone(deskSource),location:{stepId:null,taskId:null},steps:Object.fromEntries(stepIds.map(k=>[k,freshStep()])),recommendation:{draft:{plan:'',reason:'',objection:'',uncertainty:''},planId:'custom',objectionCode:'custom',first:null,kept:null}};return true;});}
function getTask(v,taskId){return v.source?.tasks.find(t=>t.id===taskId);}
function opened(v,stepId,taskId){const s=v.steps[stepId],def=v.source.steps.find(s=>s.id===stepId);if(!s||!def)return false;if(s.folded)return true;s.shownLearn=Math.max(s.shownLearn,1);const first=v.source.tasks.find(t=>t.stepId===stepId);if(taskId===first?.id||stepId==='recommendation'){const code=first?.id||'recommendation';if(!s.shownGuided.includes(code))s.shownGuided.push(code);}return true;}
export function setDeskLocation(state,stepId,taskId=null,options={}){return mutate(state,options,c=>{const v=deskView(c);if(v.status!=='ready')return false;if(stepId===null&&taskId===null){v.record.location={stepId:null,taskId:null};return true;}if(!v.steps[stepId]||taskId!==null&&!v.source.tasks.some(t=>t.stepId===stepId&&t.id===taskId))return false;if(!opened(v,stepId,taskId))return false;v.record.location={stepId,taskId};return true;});}
export function setDeskDraft(state,taskId,value,options={}){if(!validDraft(value))return false;return mutate(state,options,c=>{const v=deskView(c),t=getTask(v,taskId),s=t&&v.steps[t.stepId];if(!s||typeof value==='string'&&value.length>160)return false;s.drafts[taskId]=clone(value);return true;});}
export function showDeskLearn(state,stepId,options={}){return mutate(state,options,c=>{const v=deskView(c),s=v.steps[stepId],def=v.source?.steps.find(x=>x.id===stepId);if(!s||!def)return false;s.folded=false;opened(v,stepId,v.record.location.taskId);s.shownLearn=Math.min(def.learn.length,s.shownLearn+1);return true;});}
// Repeated explicit support actions coalesce. Old log entries and earlier snapshots are not normalized on load.
function supportEvent(s,code,taskId=null){
 const existing=s.support.find(e=>e.code===code&&(e.taskId||null)===taskId);
 if(existing){const next=(existing.count??1)+1;if(!Number.isSafeInteger(next))return false;existing.count=next;}
 else s.support.push({code,...(taskId?{taskId}:{}),count:1});
 return true;
}
function compactSupport(events){
 const found=new Map();for(const e of events){const key=JSON.stringify([e.code,e.taskId||null]),current=found.get(key),n=e.count??1;if(current)current.count+=n;else found.set(key,{code:e.code,...(e.taskId?{taskId:e.taskId}:{}),count:n});}
 return [...found.values()];
}
export function foldDeskLearn(state,stepId,folded,options={}){return mutate(state,options,c=>{const v=deskView(c),s=v.steps[stepId];if(!s||typeof folded!=='boolean')return false;if(!folded&&s.folded&&!supportEvent(s,'show-how'))return false;s.folded=folded;if(!folded)opened(v,stepId,v.record.location.taskId);return true;});}
export function addDeskSupport(state,stepId,code,taskId=null,options={}){if(!id(code)||taskId!==null&&!id(taskId))return false;return mutate(state,options,c=>{const v=deskView(c),s=v.steps[stepId];if(!s)return false;return supportEvent(s,code,taskId);});}
export function deskHelp(state,taskId,options={}){
 const current=deskView(state),task=getTask(current,taskId),step=task&&current.steps[task.stepId];
 if(!step||!mechanical.includes(task.kind))return false;
 if(step.help[taskId]===3)return {outcome:'skipped',feedback:'Leave this question open. Your other work stays here.',recorded:false};
 return mutate(state,options,c=>{const v=deskView(c),t=getTask(v,taskId),s=t&&v.steps[t.stepId];if(!s)return false;const rung=(s.help[taskId]||0)+1;s.help[taskId]=rung;if(!supportEvent(s,rung===1?'hint':rung===2?'similar-example':'skip',taskId))return false;if(rung===3)return recordTask(v,t,'skipped','Leave this question open. Your other work stays here.','skip');return rung;});
}
function supportSnapshot(v,stepId){const s=v.steps[stepId],def=v.source.steps.find(x=>x.id===stepId);return {learn:Array.from({length:Math.min(s.shownLearn,def.learn.length)},(_,i)=>i),guided:clone(s.shownGuided),guidedLines:s.shownGuided.length?def.guided.map((_,i)=>i):[],events:compactSupport(s.support)};}
function recordTask(v,t,outcome,feedback,code){const s=v.steps[t.stepId],prior=s.counts[t.id]||0;if(prior>=1e9)return false;const value=own(s.drafts,t.id)?clone(s.drafts[t.id]):t.kind==='multi'?[]:'';const a={value,outcome,feedback,code,support:supportSnapshot(v,t.stepId),priorAttempts:prior,familiar:prior>0};if(!own(s.first,t.id))s.first[t.id]=clone(a);s.attempts[t.id]=[...(s.attempts[t.id]||[]),a].slice(-32);s.counts[t.id]=prior+1;return a;}
export function keepDeskTask(state,taskId,options={}){
 const v=deskView(state),t=getTask(v,taskId),step=t&&v.steps[t.stepId];
 if(!step||v.record.location.stepId!==t.stepId||v.record.location.taskId!==taskId)return false;
 const value=own(step.drafts,taskId)?step.drafts[taskId]:t.kind==='multi'?[]:'',checked=checkDeskValue(v.source,taskId,value);
 if(checked.outcome==='uncheckable')return {...checked,recorded:false};
 return mutate(state,options,c=>{const view=deskView(c),task=getTask(view,taskId);return recordTask(view,task,checked.outcome,checked.feedback,checked.code);});
}
export function addDeskTrial(state,length,options={}){const n=whole(String(length),true);if(n===null||n<0||n>100)return false;return mutate(state,options,c=>{const v=deskView(c),s=v.steps.cost;if(!s)return false;const m=v.source.model,row={length:n,bridge:m.bridge.setup+m.bridge.rate*n,causeway:m.causeway.setup+m.causeway.rate*n};s.trials=[...s.trials,row].slice(-20);if(!supportEvent(s,'trial-table','1d'))return false;return row;});}
export function setDeskRecommendation(state,field,value,options={}){
 if(!['plan','reason','objection','uncertainty'].includes(field)||!text(value,1000))return false;
 return mutate(state,options,c=>{const v=deskView(c),r=v.recommendation,s=v.steps.recommendation;if(!r||!s)return false;
 // Editing chosen words does not change the plan or the question visible beside its answer.
 if(field==='plan'&&own(options,'planId')){
 if(!v.source.recommendation.plans.some(p=>p.id===options.planId))return false;
 r.planId=options.planId;if(!r.draft.objection.trim())r.objectionCode=r.planId;
 }
 if(field==='objection'&&own(options,'objectionCode')){
 if(!own(v.source.recommendation.objections,options.objectionCode))return false;
 if(!r.draft.objection.trim()&&value.trim())r.objectionCode=options.objectionCode;
 }
 r.draft[field]=value;
 if(options.supplied&&!supportEvent(s,'supplied-'+field))return false;
 return true;});
}
export function useDeskObjection(state,options={}){return mutate(state,options,c=>{const v=deskView(c),r=v.recommendation;if(!r)return false;r.objectionCode=r.planId;r.draft.objection='';return true;});}
export function keepDeskRecommendation(state,options={}){return mutate(state,options,c=>{const v=deskView(c),r=v.recommendation;if(!r||!v.steps.recommendation||!Object.values(r.draft).every(x=>x.trim()))return false;if(v.record.location.stepId!=='recommendation')return false;const kept={...clone(r.draft),planId:r.planId,objectionCode:r.objectionCode,objectionQuestion:v.source.recommendation.objections[r.objectionCode]||r.objectionCode,support:supportSnapshot(v,'recommendation')};if(!r.first)r.first=clone(kept);r.kept=kept;return kept;});}
