import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),copy=structuredClone,own=(x,k)=>Object.hasOwn(x,k);
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&new TextEncoder().encode(x).length<=max;
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(x),count=x=>Number.isInteger(x)&&x>=0&&x<=12;
const raw=x=>typeof x==='string'&&x.length<=16,safe=x=>Number.isSafeInteger(x)&&x>0;
const support=x=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(k=>['help','narrationRequested','together','feedback'].includes(k));
export const collectionSource={title:'Our make-believe button collection',unit:'buttons',categories:[{id:'round',label:'Round buttons',shape:'circle',count:0},{id:'square',label:'Square buttons',shape:'square',count:0},{id:'triangle',label:'Triangular buttons',shape:'triangle',count:0}]};
export function validCollectionSource(s){return object(s)&&text(s.title,160)&&s.unit==='buttons'&&Array.isArray(s.categories)&&s.categories.length>=1&&s.categories.length<=4&&new Set(s.categories.map(c=>c?.id)).size===s.categories.length&&s.categories.every(c=>object(c)&&id(c.id)&&text(c.label,160)&&['circle','square','triangle'].includes(c.shape)&&count(c.count))&&new TextEncoder().encode(JSON.stringify(s)).length<=4096;}
const value=raw=>typeof raw==='string'&&raw.trim()!==''&&/^\d+(?:\.0+)?$/.test(raw.trim())&&count(Number(raw))?Number(raw):null;
export const collectionInputStatus=input=>input.trim()===''?'blank':value(input)===null?'invalid':'ready';
function validSnapshot(s){return object(s)&&validCollectionSource(s.source)&&object(s.table)&&object(s.bars)&&s.source.categories.every(c=>raw(s.table[c.id])&&count(s.bars[c.id]))&&[1,2].includes(s.scale)&&object(s.response)&&[null,'first','same','second'].includes(s.response.choice)&&raw(s.response.difference)&&support(s.support);}
const snapshot=w=>copy({source:w.source,table:w.table,bars:w.bars,scale:w.scale,response:w.response,support:w.support});
export function collectionResult(s,kind){
 const rows=s.source.categories.map(c=>({id:c.id,source:c.count,table:value(s.table[c.id]),bar:s.bars[c.id]}));
 const representation={rows,tableMatches:rows.every(r=>r.table===r.source),barsMatch:rows.every(r=>r.bar===r.source)};
 if(kind==='representation')return representation;
 const pair=rows.slice(0,2);if(kind!=='reading'||pair.length!==2)return null;
 const [a,b]=pair.map(r=>r.bar),answer=a===b?'same':a>b?'first':'second',difference=Math.abs(a-b),entered=value(s.response.difference);
 return {...representation,answer,difference,choiceCorrect:s.response.choice===null?null:s.response.choice===answer,differenceCorrect:s.response.difference.trim()===''?null:entered===null?false:entered===difference};
}
function resultValid(c){
 if(!object(c)||!safe(c.id)||!validSnapshot(c.snapshot)||!['representation','reading'].includes(c.kind)||!object(c.result)||!text(c.feedback,2048))return false;
 const r=collectionResult(c.snapshot,c.kind);if(!r)return false;
 return ['tableMatches','barsMatch','answer','difference','choiceCorrect','differenceCorrect'].every(k=>c.result[k]===r[k])&&Array.isArray(c.result.rows)&&c.result.rows.length===r.rows.length&&r.rows.every((row,i)=>['id','source','table','bar'].every(k=>c.result.rows[i]?.[k]===row[k]));
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function collectionView(state){
 if(!own(state,'countCollection'))return {status:'missing'};
 const w=state.countCollection;
 if(!object(w)||w.version!==1||!validSnapshot(w)||!['collect','table','chart','read'].includes(w.page)||!safe(w.nextCheckId)||!Array.isArray(w.checks)||!(w.feedbackId===null||safe(w.feedbackId)))return {status:'recovery',raw:w};
 const readable=w.checks.filter((c,i,a)=>resultValid(c)&&c.id<w.nextCheckId&&a.filter(x=>x?.id===c.id).length===1),unreadable=w.checks.filter(c=>!readable.includes(c));
 const current=snapshot(w),feedback=readable.find(c=>c.id===w.feedbackId&&same({...c.snapshot,support:[]},{...current,support:[]}));
 const kept=w.kept===null?null:object(w.kept)&&validSnapshot(w.kept.snapshot)&&(w.kept.check===null||resultValid(w.kept.check)&&same({...w.kept.check.snapshot,support:[]},{...w.kept.snapshot,support:[]}))?w.kept:null;
 return {status:'ready',work:w,readable,unreadable,feedback,kept,keptUnreadable:w.kept!==null&&!kept};
}
const newWork=()=>{const source=copy(collectionSource);return {version:1,source,page:'collect',table:Object.fromEntries(source.categories.map(c=>[c.id,''])),bars:Object.fromEntries(source.categories.map(c=>[c.id,0])),scale:1,response:{choice:null,difference:''},support:[],checks:[],nextCheckId:1,feedbackId:null,kept:null};};
const fits=(state,w,canExport)=>recoveryFitsProgressLimits({...state,countCollection:w})&&canExport({...state,countCollection:w});
export function startCollection(state,canExport=()=>true){if(own(state,'countCollection'))return false;const w=newWork();if(!validSnapshot(w)||!fits(state,w,canExport))return false;state.countCollection=w;return true;}
export function recoverCollection(state,canExport=()=>true){if(!own(state,'countCollection'))return false;const w={...newWork(),retainedRaw:copy(state.countCollection)};if(!validSnapshot(w)||!fits(state,w,canExport))return false;state.countCollection=w;return true;}
function active(state){const v=collectionView(state);return v.status==='ready'?v.work:null;}
export function editCollection(state,kind,key,input){
 const w=active(state);if(!w)return false;
 if(kind==='page'){if(!['collect','table','chart','read'].includes(input))return false;w.page=input;return true;}
 const c=w.source.categories.find(c=>c.id===key);
 if(kind==='count'){if(!c||![-1,1].includes(input)||!count(c.count+input))return false;c.count+=input;}
 else if(kind==='bar'){if(!c||![-1,1].includes(input)||!count(w.bars[key]+input))return false;w.bars[key]+=input;}
 else if(kind==='table'){if(!c||!raw(input))return false;w.table[key]=input;}
 else if(kind==='scale'){if(![1,2].includes(input))return false;w.scale=input;}
 else if(kind==='choice'){if(![null,'first','same','second'].includes(input))return false;w.response.choice=input;}
 else if(kind==='difference'){if(!raw(input))return false;w.response.difference=input;}
 else return false;
 w.feedbackId=null;return true;
}
export function supportCollection(state,kind){const w=active(state);if(!w||!['help','narrationRequested','together'].includes(kind))return false;if(!w.support.includes(kind))w.support.push(kind);return true;}
function feedbackFor(s,r,kind){
 const labels=s.source.categories.map(c=>c.label),parts=r.rows.map((row,i)=>`${labels[i]}: the collection has ${row.source}; your table ${row.table===null?(s.table[row.id].trim()===''?'is not recorded yet (blank is not zero)':'is not a whole count from 0 to 12'):`says ${row.table}`}; your bar is ${row.bar}.`);
 if(kind==='reading'){const response=s.response.choice===null?'No comparison was chosen.':r.choiceCorrect?'Your comparison fits your chart.':'Your comparison differs from your chart.';parts.unshift(`${response} ${labels[0]} bar: ${r.rows[0].bar}. ${labels[1]} bar: ${r.rows[1].bar}. The difference is ${r.difference}. ${r.differenceCorrect===null?'No difference was entered.':r.differenceCorrect?'Your difference fits.':'Your difference is another idea to check.'}`);}
 parts.push(`The bars ${r.barsMatch?'agree':'do not all agree'} with the collection. You can revise or keep this version.`);return parts.join(' ');
}
export function checkCollection(state,kind,canExport=()=>true){
 const view=collectionView(state);if(view.status!=='ready'||view.work.nextCheckId>=Number.MAX_SAFE_INTEGER)return false;
 const w=copy(view.work),s=snapshot(w),result=collectionResult(s,kind);if(!result)return false;
 const c={id:w.nextCheckId,snapshot:s,kind,result,feedback:feedbackFor(s,result,kind)};if(!resultValid(c))return false;
 w.nextCheckId++;const recent=[...view.readable,c].slice(-4);w.checks=[...view.unreadable,...recent];w.feedbackId=c.id;if(!w.support.includes('feedback'))w.support.push('feedback');if(!fits(state,w,canExport))return false;state.countCollection=w;return true;
}
export function keepCollection(state,replace=false,canExport=()=>true){
 const v=collectionView(state);if(v.status!=='ready'||v.keptUnreadable||v.work.kept!==null&&!replace)return false;
 const w=copy(v.work);w.kept={snapshot:snapshot(w),check:v.feedback?copy(v.feedback):null};if(!fits(state,w,canExport))return false;state.countCollection=w;return true;
}
