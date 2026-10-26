import {parseLinearNumber} from './linear-pathway-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {equalityFamilies,generateEqualitySource,fraction,plus,minus,times,divide,same,normalizeExpression,classification,formatNumber,evaluateExpression,exprText,normalEquation} from './equality-desk-content.mjs';
export {formatNumber,evaluateExpression,exprText,normalEquation};
const clone=x=>structuredClone(x),obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),str=(x,n=1800)=>typeof x==='string'&&x.length<=n,int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const id=x=>str(x,100)&&/^[a-z][a-z0-9-]*$/.test(x)&&!['constructor','prototype','tostring','valueof'].includes(x);
const has=(o,k)=>Object.hasOwn(o,k),keys=['one','none','every'];
const arr=(v,n)=>Array.isArray(v)&&v.length<=n;
const strings=(v,n=24)=>arr(v,n)&&v.every(x=>str(x,100));
const number=q=>obj(q)&&int(q.n,-1e12,1e12)&&int(q.d,1,1e9)&&same(q,fraction(q.n,q.d))&&q.n===fraction(q.n,q.d).n&&q.d===fraction(q.n,q.d).d;
const norm=n=>obj(n)&&number(n.m)&&number(n.b);
const equalNorm=(a,b)=>same(a.m,b.m)&&same(a.b,b.b);
const expr=e=>obj(e)&&['k','a','b','c'].every(k=>{const q=parseLinearNumber(e[k]);return q&&Math.abs(q.n)<=12*q.d&&q.d<=4&&formatNumber(q)===e[k];});
const sameRows=(a,b)=>equalNorm(a.left,b.left)&&equalNorm(a.right,b.right);
function proof(source){
 const rows=source.steps;if(!arr(rows,12)||!rows.length)return false;
 const initial={left:normalizeExpression(source.left),right:normalizeExpression(source.right)};
 for(let i=0;i<rows.length;i++){
  const row=rows[i];if(!obj(row)||!norm(row.left)||!norm(row.right)||!str(row.reason)||!['start','expand','remove-x','remove-constant','divide','conclude'].includes(row.operation))return false;
  if(i===0){if(row.operation!=='start'||!sameRows(row,initial))return false;continue;}
  const prev=rows[i-1];let expected;
  if(row.operation==='expand'){if(!sameRows(prev,initial))return false;expected=initial;}
  else if(row.operation==='remove-x'){const m=prev.right.m;expected={left:{m:minus(prev.left.m,m),b:prev.left.b},right:{m:minus(prev.right.m,m),b:prev.right.b}};}
  else if(row.operation==='remove-constant'){const b=prev.left.b;expected={left:{m:prev.left.m,b:minus(prev.left.b,b)},right:{m:prev.right.m,b:minus(prev.right.b,b)}};}
  else if(row.operation==='divide'){const d=prev.left.m;if(d.n===0)return false;expected={left:{m:divide(prev.left.m,d),b:divide(prev.left.b,d)},right:{m:divide(prev.right.m,d),b:divide(prev.right.b,d)}};}
  else if(row.operation==='conclude')expected=prev;
  else return false;
  if(!sameRows(row,expected))return false;
 }
 const last=rows.at(-1);if(last.operation!=='conclude'||last.left.b.n!==0||last.right.m.n!==0)return false;
 if(source.key==='one')return same(last.left.m,fraction(1))&&same(last.right.b,source.solution);
 return last.left.m.n===0&&(source.key==='every'?last.right.b.n===0:last.right.b.n!==0);
}
export function validEqualitySource(s){try{
 if(!obj(s)||!id(s.id)||!str(s.title,160)||!str(s.family,100)||s.domain!=='real'||!expr(s.left)||!expr(s.right)||!str(s.story)||!arr(s.teaching,12)||!s.teaching.every(t=>str(t))||!obj(s.help)||!str(s.help.hint)||!str(s.help.example)||!str(s.feedback)||!arr(s.choices,3)||s.choices.length!==3||!s.choices.every(c=>obj(c)&&keys.includes(c.id)&&str(c.label,160))||new Set(s.choices.map(c=>c.id)).size!==3||!keys.includes(s.key))return false;
 const result=classification(normalizeExpression(s.left),normalizeExpression(s.right));if(s.key!==result.key)return false;
 if(s.key==='one'){if(!number(s.solution)||!same(s.solution,result.solution))return false;const parsed=parseLinearNumber(formatNumber(s.solution));if(!parsed||!same(parsed,s.solution))return false;}else if(s.solution!==null)return false;
 return proof(s);
 }catch{return false;}}
export function validEqualityProbe(t){try{return obj(t)&&str(t.raw,40)&&parseLinearNumber(t.raw)!==null&&number(t.left)&&number(t.right)&&typeof t.equal==='boolean'&&t.equal===same(t.left,t.right);}catch{return false;}}
export function validEqualityCheck(c){return obj(c)&&validEqualitySource(c.source)&&obj(c.raw)&&keys.includes(c.raw.choice)&&str(c.raw.answer,40)&&str(c.raw.note,1200)&&strings(c.helpBefore)&&int(c.seenLineBefore,0,c.source.steps.length-1)&&arr(c.testsBefore,12)&&['match','different'].includes(c.outcome)&&str(c.feedback,6000)&&c.supported===true;}
const scalarWork=w=>obj(w)&&validEqualitySource(w.source)&&int(w.page,0,3)&&int(w.line,0,w.source.steps.length-1)&&int(w.seenLine,w.line,w.source.steps.length-1)&&str(w.input,40)&&str(w.answer,40)&&str(w.note,1200)&&str(w.choice,100)&&(w.choice===''||w.source.choices.some(c=>c.id===w.choice))&&strings(w.help)&&arr(w.tests,12);
export const validEqualityKeep=k=>scalarWork(k)&&has(k,'latestCheck');
export const validEqualityWork=w=>scalarWork(w)&&arr(w.checks,12);
function wrapper(s){const r=s?.equalityDesk;return obj(r)&&r.version===1&&str(r.current,100)&&int(r.next,1,Number.MAX_SAFE_INTEGER)&&obj(r.visits)&&Object.keys(r.visits).length<=24;}
export function equalityView(s){
 if(!has(s,'equalityDesk'))return {status:'empty',current:'',work:null,visits:[],root:null};
 const root=s.equalityDesk;if(!wrapper(s))return {status:'unavailable',current:'',work:null,visits:[],root};
 const visits=Object.entries(root.visits).map(([visitId,w])=>({id:visitId,title:validEqualitySource(w?.source)?w.source.title:visitId,readable:id(visitId)&&validEqualityWork(w)}));
 const current=root.current,work=id(current)&&has(root.visits,current)&&validEqualityWork(root.visits[current])?root.visits[current]:null;
 return {status:work?'ready':current?'unreadable':'empty',current,work,visits,root};
}
function fit(c,o){try{return recoveryFitsProgressLimits(c)&&(!o.canExport||o.canExport(c)===true);}catch{return false;}}
function commit(s,c){for(const [k,v] of Object.entries(c))s[k]=v;}
function change(s,fn,o={}){try{if(has(s,'equalityDesk')&&!wrapper(s))return false;const c=clone(s),r=fn(c);if(!r)return false;const w=equalityView(c).work;if(w&&!validEqualityWork(w))return false;o.exposeFacts?.(equalityFacts(c),c);if(!fit(c,o))return false;commit(s,c);return r;}catch{return false;}}
function workChange(s,fn,o={}){return change(s,c=>{const w=equalityView(c).work;return w?fn(w,c):false;},o);}
export function startEquality(s,family,o={}){if(!equalityFamilies.some(f=>f.id===family))return false;return change(s,c=>{
 c.equalityDesk??={version:1,current:'',next:1,visits:{}};const r=c.equalityDesk;if(Object.keys(r.visits).length>=24)return false;
 let serial=r.next;while(has(r.visits,`equality-${serial}`)){serial++;if(!Number.isSafeInteger(serial))return false;}if(serial>=Number.MAX_SAFE_INTEGER)return false;
 const source=generateEqualitySource(family,serial);if(!validEqualitySource(source))return false;const key=`equality-${serial}`;r.visits[key]={source,page:0,line:0,seenLine:0,input:'',choice:'',answer:'',note:'',help:[],tests:[],checks:[]};r.current=key;r.next=serial+1;return key;
 },o);}
export const resumeEquality=(s,key,o={})=>id(key)&&workChangeOrRoot(s,key,o);
function workChangeOrRoot(s,key,o){return change(s,c=>{if(!has(c.equalityDesk?.visits||{},key)||!validEqualityWork(c.equalityDesk.visits[key]))return false;c.equalityDesk.current=key;return true;},o);}
export const pageEquality=(s,n,o={})=>int(n,0,3)&&workChange(s,w=>{w.page=n;return true;},o);
export const lineEquality=(s,n,o={})=>workChange(s,w=>{if(!int(n,0,w.source.steps.length-1)||n>w.seenLine+1)return false;w.line=n;w.seenLine=Math.max(w.seenLine,n);return true;},o);
export const editEquality=(s,key,value,o={})=>['input','choice','answer','note'].includes(key)&&str(value,key==='note'?1200:key==='choice'?100:40)&&workChange(s,w=>{if(key==='choice'&&value!==''&&!w.source.choices.some(c=>c.id===value))return false;w[key]=value;return true;},o);
export const helpEquality=(s,key,o={})=>['hint','example'].includes(key)&&workChange(s,w=>{if(!w.help.includes(key))w.help.push(key);return true;},o);
export function probeEquality(s,raw=undefined,o={}){
 const w=equalityView(s).work;if(!w)return false;raw??=w.input;const q=parseLinearNumber(raw);if(!q)return {recorded:false,feedback:'Enter an integer, a fraction such as -3/2, or a decimal with up to three places. Use a number from -1000 to 1000; expressions are not accepted.'};
 return workChange(s,v=>{if(v.tests.length>=12)return false;v.input=raw;const left=evaluateExpression(v.source.left,q),right=evaluateExpression(v.source.right,q);const record={raw,left,right,equal:same(left,right)};v.tests.push(record);return {...clone(record),recorded:true};},o);
}
export function checkEquality(s,o={}){
 const w=equalityView(s).work;if(!w)return false;if(!keys.includes(w.choice))return {recorded:false,feedback:'Choose how many real numbers you think make the rules equal.'};
 const answer=parseLinearNumber(w.answer);if(w.choice==='one'&&!answer)return {recorded:false,feedback:'For one number, enter the x you want to test. Use an integer, fraction or decimal, not an expression.'};
 return workChange(s,v=>{
 if(v.checks.length>=12)return false;const matched=v.choice===v.source.key&&(v.choice!=='one'||same(answer,v.source.solution));let feedback=v.source.feedback;
 if(v.choice==='one'&&v.source.key!=='one')feedback=`${v.source.key==='every'?'A number can work without being the ONLY number. A witness does not prove uniqueness.':'A claimed single number does not resolve the contradictory constants.'} ${feedback}`;
 if(v.choice==='one'&&v.source.key==='one'&&!same(answer,v.source.solution)){const l=evaluateExpression(v.source.left,answer),r=evaluateExpression(v.source.right,answer);feedback=`At your x = ${formatNumber(answer)}, the left rule gives ${formatNumber(l)} and the right gives ${formatNumber(r)}. They do not agree. ${feedback}`;}
 const record={source:clone(v.source),raw:{choice:v.choice,answer:v.answer,note:v.note},helpBefore:clone(v.help),seenLineBefore:v.seenLine,testsBefore:clone(v.tests),outcome:matched?'match':'different',feedback,supported:true};if(!has(v,'firstCheck'))v.firstCheck=clone(record);v.checks.push(record);return {...clone(record),recorded:true};
 },o);
}
export const keepEquality=(s,o={})=>workChange(s,w=>{const snapshot={source:clone(w.source),page:w.page,line:w.line,seenLine:w.seenLine,input:w.input,choice:w.choice,answer:w.answer,note:w.note,help:clone(w.help),tests:clone(w.tests),latestCheck:w.checks.length?clone(w.checks.at(-1)):null};if(!has(w,'firstKept'))w.firstKept=clone(snapshot);w.kept=clone(snapshot);return true;},o);
export const removeEquality=(s,key,confirmed,o={})=>confirmed===true&&id(key)&&change(s,c=>{const r=c.equalityDesk;if(!r||!has(r.visits,key))return false;delete r.visits[key];if(r.current===key)r.current='';return true;},o);
function addPair(pairs,a,b){if(a?.d===1&&b?.d===1&&int(a.n,1,12)&&int(b.n,1,12)){pairs.set(`${a.n}x${b.n}`,[a.n,b.n]);pairs.set(`${b.n}x${a.n}`,[b.n,a.n]);}}
function evalPairs(pairs,e,x){const a=parseLinearNumber(e.a),b=parseLinearNumber(e.b),k=parseLinearNumber(e.k);addPair(pairs,a,x);addPair(pairs,k,plus(times(a,x),b));}
function sourcePairs(pairs,source,depth){if(depth>=1)for(const e of [source.left,source.right]){const k=parseLinearNumber(e.k);addPair(pairs,k,parseLinearNumber(e.a));addPair(pairs,k,parseLinearNumber(e.b));}if(depth>=source.steps.length-1&&source.key==='one')for(const e of [source.left,source.right])evalPairs(pairs,e,source.solution);}
function checkPairs(pairs,c){if(!validEqualityCheck(c)||c.source.key!=='one')return;for(const e of [c.source.left,c.source.right])evalPairs(pairs,e,c.source.solution);if(c.raw.choice==='one'){const x=parseLinearNumber(c.raw.answer);if(x)for(const e of [c.source.left,c.source.right])evalPairs(pairs,e,x);}}
export function equalityFacts(s){try{
 const w=equalityView(s).work;if(!w)return [];const pairs=new Map();
 if(w.page===0)addPair(pairs,fraction(2),fraction(3));
 if(w.page===1)for(const t of w.tests)if(validEqualityProbe(t))for(const e of [w.source.left,w.source.right])evalPairs(pairs,e,parseLinearNumber(t.raw));
 if(w.page===2)sourcePairs(pairs,w.source,w.line);
 if(w.page===3){if(w.help.includes('example'))addPair(pairs,fraction(2),fraction(3));if(has(w,'firstCheck'))checkPairs(pairs,w.firstCheck);if(w.checks.length)checkPairs(pairs,w.checks.at(-1));for(const k of [w.firstKept,w.kept])if(validEqualityKeep(k)&&validEqualityCheck(k.latestCheck))checkPairs(pairs,k.latestCheck);}
 return [...pairs.values()];
 }catch{return [];}}
export function prepareEqualityDisplay(s,o={}){try{if(!equalityView(s).work)return {ok:true,changed:false};const c=clone(s);o.exposeFacts?.(equalityFacts(c),c);const changed=JSON.stringify(c)!==JSON.stringify(s);if(!changed)return {ok:true,changed:false};if(!fit(c,o))return {ok:false,changed:false};commit(s,c);return {ok:true,changed:true};}catch{return {ok:false,changed:false};}}
