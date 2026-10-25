import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {generatedLinearSource,linearChallenges} from '../dist/linear-pathway-generator.mjs';
import * as p from '../dist/linear-pathway-core.mjs';
import {linearPage,linearNotes} from '../dist/linear-pathway-ui.mjs';
const o={canExport:s=>prepareProgressImport(JSON.stringify(s,null,2)).ok},clone=x=>structuredClone(x);let n=0;
const ok=(v,m)=>{assert.ok(v,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
for(const [kind] of linearChallenges){const models=new Set();for(let serial=0;serial<48;serial++){
 const s=generatedLinearSource(serial,kind);ok(p.validLinearSource(s),`${kind}/${serial}`);models.add(JSON.stringify([s.model,s.items[1].prompt,s.items[1].fields]));
 for(let x=0;x<=6;x++){const a=p.linearValue(s.model,x);ok(a.n>=-6*a.d&&a.n<=16*a.d);}
 for(const item of s.items){const raw=Object.fromEntries(item.fields.map(f=>[f.id,f.answer]));eq(p.evaluateLinear(s,item.id,raw).outcome,'match');}
 const t=2+Math.floor(serial/16),m=Number(s.model.m.includes('/')?s.model.m.split('/')[0]/s.model.m.split('/')[1]:s.model.m),b=Number(s.model.b);
 if(kind==='revisit')eq(s.items[1].fields[0].answer,p.formatLinearNumber(p.linearValue(s.model,t)));
 if(kind==='unknown'){eq(s.items[1].fields.find(f=>f.id==='x').answer,String(t));eq(p.parseLinearNumber(s.items[1].fields[0].answer),p.parseLinearNumber(String(m*t)));}
 if(kind==='contrast'){
  const a=x=>p.linearValue(s.model,x),b=x=>p.linearValue(s.model.comparison,x),less=(x,y)=>x.n*y.d<y.n*x.d;
  eq(a(t),b(t));ok(less(a(t-1),b(t-1)));ok(less(b(t+1),a(t+1)));
  eq(s.items[2].fields.map(f=>p.parseLinearNumber(f.answer)),[a(t-1),b(t-1),a(t+1),b(t+1)]);
 }
}eq(models.size,48,'each cycle has48 genuinely different parameter/unknown cases');}
for(const bad of [-1,1000000,1.5,NaN])eq(generatedLinearSource(bad,'unknown'),null);
const create=(s,k='revisit')=>{const key=p.createLinearInvestigation(s,k,o);ok(key);return key;};
const solve=(s,{wrong=false,help=false}={})=>{const w=p.linearView(s).work,i=w.source.items.find(i=>i.id==='own');if(help)ok(p.showLinearHelp(s,'own','hint',o));for(const f of i.fields)ok(p.setLinearField(s,'own',f.id,wrong?'999':f.answer,o));ok(p.checkLinear(s,'own',o));};
{
 const s=freshState(),before=clone(s);linearPage(s);linearNotes(s);p.linearSuggestion(s);eq(s,before,'read paths pure');eq(p.linearSuggestion(s).challenge,'revisit');
 const keys=[];for(let i=0;i<3;i++){keys.push(create(s,'unknown'));solve(s);}
 eq(p.linearSuggestion(s).challenge,'contrast');eq(p.linearSuggestion(s).count,3);const first=clone(s.linearPathway.lessons[keys[0]]);
 p.startLinear(s,keys[0],o);solve(s,{wrong:true,help:true});eq(s.linearPathway.lessons[keys[0]].firstChecks.own,first.firstChecks.own);eq(p.linearSuggestion(s).challenge,'contrast','retry/help after first check adds no promotion/demotion');
 const a=create(s,'contrast');solve(s,{help:true});const b=create(s,'contrast');solve(s,{wrong:true});eq(p.linearSuggestion(s).challenge,'revisit');
 p.setLinearPage(s,3,o);p.setLinearNote(s,'First exact <synthetic> prose',o);p.keepLinear(s,o);p.setLinearNote(s,'Latest exact words',o);p.keepLinear(s,o);const work=clone(p.linearView(s).work);eq(work.firstKept.note,'First exact <synthetic> prose');eq(work.kept.note,'Latest exact words');
 const copy=prepareProgressImport(JSON.stringify(s,null,2));ok(copy.ok);eq(copy.state.linearPathway,s.linearPathway);const old=clone(s);linearPage(s,keys[0]);p.prepareLinearDisplay(s,{...o,entryLesson:keys[0],exposeFacts:()=>{throw Error('hidden preview must not expose');}});eq(s,old,'generated preview is pure');ok(linearPage(s,keys[0]).includes('Start or continue'));ok(!linearPage(s,keys[0]).includes('data-linear-x'));
 for(const fn of [()=>p.createLinearInvestigation(s,'unknown',{canExport:()=>false}),()=>p.removeLinearInvestigation(s,b,true,{canExport:()=>false})]){ok(!fn());eq(s,old,'refused mutation atomic');}
 ok(!p.removeLinearInvestigation(s,b,false,o));eq(s,old,'cancel preserves all');ok(!p.removeLinearInvestigation(s,'zero',true,o));ok(p.removeLinearInvestigation(s,b,true,o));ok(!Object.hasOwn(s.linearPathway.lessons,b));eq(s.linearPathway.lessons[keys[0]],{...first,help:{own:['hint']},checks:s.linearPathway.lessons[keys[0]].checks,drafts:s.linearPathway.lessons[keys[0]].drafts},'removal preserves unselected work');eq(create(s),'investigation-5','removal does not reset serial');
}
{
 const s=freshState();create(s);s.linearPathway.exploration={version:99,raw:'held'};const held=clone(s.linearPathway.exploration);ok(!p.createLinearInvestigation(s,'revisit',o));ok(p.setLinearPage(s,2,o));eq(s.linearPathway.exploration,held);ok(p.startLinear(s,'zero',o));
 delete s.linearPathway.exploration;s.linearPathway.lessons['investigation-11']={future:'unreadable'};eq(create(s),'investigation-12');eq(s.linearPathway.lessons['investigation-11'],{future:'unreadable'});
 s.linearPathway.exploration.nextSerial=11;const old=clone(s);ok(!p.createLinearInvestigation(s,'unknown',o));eq(s,old,'raw collision cannot overwrite');s.linearPathway.exploration.nextSerial=1000000;ok(!p.createLinearInvestigation(s,'unknown',o));ok(!p.linearSuggestion(s).canCreate);
}
{
 const s=freshState();create(s);solve(s);const first=clone(p.linearView(s).work.firstChecks.own);s.linearPathway.exploration.nextSerial=48;create(s);solve(s,{wrong:true});eq(p.linearSuggestion(s).count,1,'same mathematical case does not count as distinct');
 const w=p.linearView(s).work;for(let i=0;i<23;i++)ok(p.checkLinear(s,'own',o));const old=clone(s);ok(!p.checkLinear(s,'own',o));eq(s,old,'check limit refuses without dropping records');for(let i=0;i<24;i++)ok(p.skipLinear(s,'own',o));const after=clone(s);ok(!p.skipLinear(s,'own',o));eq(s,after,'skip limit refuses without dropping records');eq(s.linearPathway.lessons['investigation-0'].firstChecks.own,first);
}
{
 const s=freshState();const key=create(s,'revisit');const source=clone(s.linearPathway.lessons[key].source);s.linearPathway.lessons[key].source.idea='Frozen imported variation';const before=clone(s);ok(p.startLinear(s,key,o));eq(s.linearPathway.lessons[key].source,before.linearPathway.lessons[key].source,'continue never regenerates');
 let calls=0;const expose=(facts,c)=>{calls++;c.syntheticFacts=facts;};ok(p.prepareLinearDisplay(s,{...o,exposeFacts:expose}).ok);eq(calls,0,'fractional displayed rate adds no whole fact');s.linearPathway.lessons[key].source.model.m='2';ok(p.prepareLinearDisplay(s,{...o,exposeFacts:expose}).ok);eq(calls,2,'current positive model preflights then invokes actual hook');ok(s.syntheticFacts.some(([a,b])=>a===2&&b===4));
}

{const s=freshState();p.startLinear(s,'views',o);let calls=0;ok(p.prepareLinearDisplay(s,{...o,entryLesson:'bogus',exposeFacts:(facts,c)=>{calls++;c.syntheticFacts=facts;}}).ok);eq(calls,2,'unknown deep route displays current model and still qualifies actual facts');ok(linearPage(s,'bogus').includes('data-linear-x'));}


{
 const s=freshState(),olderA=create(s,'unknown'),olderB=create(s,'unknown'),newer=[];
 for(let i=0;i<3;i++){newer.push(create(s,'unknown'));solve(s);}
 eq(p.linearSuggestion(s).challenge,'contrast');p.startLinear(s,olderA,o);solve(s,{wrong:true});eq(s.linearPathway.lessons[olderA].firstChecks.own.order,4,'first response on older visit gets current response order');eq(p.linearSuggestion(s).challenge,'unknown');p.startLinear(s,olderB,o);solve(s,{help:true});eq(s.linearPathway.lessons[olderB].firstChecks.own.order,5);eq(p.linearSuggestion(s).challenge,'revisit','new first responses in older visits inform actual recent need');
 const first=clone(s.linearPathway.lessons[olderB].firstChecks.own);solve(s);eq(s.linearPathway.lessons[olderB].firstChecks.own,first);ok(!Object.hasOwn(p.linearView(s).work.checks.at(-1),'order'),'retry has no new first-response order');
 delete s.linearPathway.lessons[olderA].firstChecks.own.order;const raw=clone(s);eq(p.linearSuggestion(s).challenge,'unknown','legacy missing order is older fallback');eq(s,raw,'suggestion never backfills historical order');
}
{
 const s=freshState(),older=create(s,'revisit');s.linearPathway.exploration.nextSerial=48;create(s,'revisit');solve(s);p.startLinear(s,older,o);solve(s,{wrong:true});eq(p.linearSuggestion(s).count,1,'same math case deduplicates by earliest actual response even when created later');eq(p.linearSuggestion(s).challenge,'revisit');
 const before=clone(s);s.linearPathway.lessons[older].firstChecks.own.order=Number.MAX_SAFE_INTEGER;const held=clone(s);create(s,'unknown');const w=p.linearView(s).work;for(const f of w.source.items[1].fields)p.setLinearField(s,'own',f.id,f.answer,o);const saved=clone(s);ok(!p.checkLinear(s,'own',o));eq(s,saved,'unrepresentable next response order refuses atomically');
}
console.log(`Adaptive linear: ${n} source, arithmetic, distinct evidence, retention, preview and actual import assertions passed.`);
