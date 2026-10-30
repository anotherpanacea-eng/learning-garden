import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {generatedLinearSource} from '../dist/linear-pathway-generator.mjs';
import * as p from '../dist/linear-pathway-core.mjs';
import {linearPage,linearNotes} from '../dist/linear-pathway-ui.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const clone=x=>structuredClone(x),o={canExport:x=>prepareProgressImport(JSON.stringify(x)).ok};
// Independent spec oracle: work in half-token integers and repeated per-turn addition.
const catalog={revisit:[1,0,-1,2,-2,3,-4,4],unknown:[1,-1,2,-2,3,-3,4,-4],contrast:[1,0,-1,2,-2,3,-3,4]};
const number=raw=>raw.includes('/')?Number(raw.split('/')[0])/Number(raw.split('/')[1]):Number(raw);
const sequence=(startHalf,rateHalf)=>Array.from({length:7},(_,x)=>{let n=startHalf;for(let i=0;i<x;i++)n+=rateHalf;return n/2;});
for(const kind of Object.keys(catalog)){
 const signs=new Set();
 for(let serial=0;serial<48;serial++){
  const k=serial,t=2+Math.floor(k/16),rateHalf=catalog[kind][Math.floor(k/2)%8],m=rateHalf/2;
  let baseHalf=m<0?Math.max(0,-12-6*rateHalf):m===0?8:-6;
  if(kind==='contrast')baseHalf=Math.max(baseHalf,-12-6*(rateHalf-1)-t);
  const startHalf=baseHalf+2*(k%2),a=sequence(startHalf,rateHalf),b=kind==='contrast'?sequence(startHalf+t,rateHalf-1):null;
  const source=generatedLinearSource(serial,kind);signs.add(Math.sign(m));ok(p.validLinearSource(source),'valid bounded signed source');eq(number(source.model.m),m,'oracle rate');eq(number(source.model.b),startHalf/2,'oracle start');
  for(let x=0;x<=6;x++){const actual=p.linearValue(source.model,x);eq(actual.n/actual.d,a[x],'repeated-addition output');ok(a[x]>=-6&&a[x]<=16,'primary within fixed axes');if(b){const q=p.linearValue({...source.model,...source.model.comparison},x);eq(q.n/q.d,b[x],'independent comparison output');ok(b[x]>=-6&&b[x]<=16,'comparison within axes');}}
  const expected=kind==='revisit'?{guided:{m,b:startHalf/2},own:{height:a[t]},return:{change:2*m,b:startHalf/2}}:kind==='unknown'?{guided:{height:a[t]},own:{product:m*t,x:t},return:{m}}:{guided:{start:t/2,rate:.5},own:{x:t,height:a[t]},return:{'a-before':a[t-1],'b-before':b[t-1],'a-after':a[t+1],'b-after':b[t+1]}};
  for(const item of source.items){eq(Object.fromEntries(item.fields.map(f=>[f.id,number(f.answer)])),expected[item.id],'independent answer oracle '+kind+'/'+serial+'/'+item.id);}
  if(kind==='unknown'){ok(m!==0,'no zero-rate inversion');eq((a[t]-startHalf/2)/m,t,'signed inverse substitutes');}
  if(b){eq(a[t],b[t],'intersection at stated whole turn');ok(a[t-1]<b[t-1]&&a[t+1]>b[t+1],'ordering changes even for falling accounts');}
  if(m===0){ok(a.every(y=>y===startHalf/2)&&startHalf!==0,'steady account need not have zero balance');ok(source.teach.join(' ').includes('every permitted whole-turn input from 0 to 6'),'zero uses finite domain');ok(source.teach.join(' ').includes('never reached'),'unreachable target distinguished');}
  if(m<0){ok(source.teach[0].includes('lowers the balance'),'negative rate described as decrease');if(kind!=='contrast')ok(source.items[1].example.includes('(−5/2)x = −15'),'negative-rate worked example');}
  if(kind==='contrast'&&m<=0)ok(source.items[1].example.includes('Both accounts fall, but A falls less per turn.'),'falling comparison example is explicit');
 }
 eq([...signs].sort(),kind==='unknown'?[-1,1]:[-1,0,1],'required rate directions');
 for(const serial of [48,50,52,999999]){const source=generatedLinearSource(serial,kind);ok(p.validLinearSource(source),'later serial retains valid bounded source');}
}
const old=JSON.parse(readFileSync(new URL('./fixtures/linear-before-signed.json',import.meta.url),'utf8')),imported=prepareProgressImport(JSON.stringify(old));ok(imported.ok,'pre-change fixture imports');for(const [key,value]of Object.entries(old))eq(imported.state[key],value,'historical root restored exactly: '+key);
const state=clone(imported.state),frozen=clone(state.linearPathway.lessons);
for(const [key,w] of Object.entries(frozen)){
 ok(p.startLinear(state,key,o),'historical visit opens');eq(p.linearView(state).work.source,w.source,'old source not regenerated');eq(p.linearView(state).work.firstChecks,w.firstChecks,'old first check exact');eq(p.linearView(state).work.firstKept,w.firstKept,'old first kept version exact');eq(p.linearView(state).work.kept,w.kept,'old latest kept version exact');
}
const untouched=clone(state);linearPage(state);linearNotes(state);p.linearSuggestion(state);eq(state,untouched,'all read paths retain historical content');
const created=p.createLinearInvestigation(state,'revisit',o);ok(created,'new visit after historical catalog');eq(state.linearPathway.lessons['investigation-47'],frozen['investigation-47'],'new generation leaves old positive comparison intact');eq(state.syntheticFuture,old.syntheticFuture,'additive sibling retained');
for(const bad of [()=>p.createLinearInvestigation(state,'unknown',{canExport:()=>false}),()=>p.setLinearField(state,'own','height','999',{canExport:()=>false})]){const before=clone(state);ok(!bad(),'refused action returns false');eq(state,before,'refusal atomic');}
const createAt=(s,serial,kind)=>{if(s.linearPathway)s.linearPathway.exploration.nextSerial=serial;else s.linearPathway={version:1,currentId:'',lessons:{},exploration:{version:1,nextSerial:serial}};return p.createLinearInvestigation(s,kind,o);};
const solve=s=>{const item=p.linearView(s).work.source.items.find(i=>i.id==='own');for(const f of item.fields)ok(p.setLinearField(s,'own',f.id,f.answer,o),'synthetic fitting response');ok(p.checkLinear(s,'own',o),'supported own check');};
const constant=freshState();createAt(constant,2,'revisit');solve(constant);createAt(constant,18,'revisit');solve(constant);eq(p.linearSuggestion(constant).count,1,'same constant model at different inputs cannot inflate evidence');
for(const serial of [2,4]){const s=freshState();createAt(s,serial,'revisit');let calls=0;const before=clone(s);ok(p.prepareLinearDisplay(s,{...o,exposeFacts:()=>calls++}).ok,'zero/negative display allowed');eq(calls,0,'zero/negative rate does not invent positive facts');eq(s,before,'no exposure mutation for zero/negative');}
console.log(`${checks} independent signed/zero Linear arithmetic, preservation and evidence checks passed.`);
