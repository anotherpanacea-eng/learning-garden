import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {energySizes,energyFamilies,energyCases,freshEnergyBook,energyView,energyGoal,changeEnergyBook,energyBookDrawing,energyScene,millEnergyPage,resetMillEnergy} from '../dist/mill-energy.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const step=(s,a,v)=>{const before=JSON.stringify(s),n=changeEnergyBook(s,a,v);ok(n,`valid ${a}`);eq(JSON.stringify(s),before,'input left unchanged');return n;};
eq(energyCases.length,18);eq(energySizes,[8,12,16]);eq(energyFamilies,['grind','closed','spread','rub','split','leave']);
const run=(s,a,n=1)=>{for(let i=0;i<n;i++)s=step(s,a);return s;};
for(let index=0;index<18;index++){
 let s={...freshEnergyBook(),current:index},c=energyCases[index],n=c.size,t=n/4;
 if(c.kind==='grind'){s=run(s,'pour',n/4);s=run(s,'grind',n/2);}
 if(c.kind==='closed')for(const a of['pour','gate','grind'])s=step(s,a);
 if(c.kind==='spread'){s=run(s,'pour',n/2);s=run(s,'grind',n);}
 if(c.kind==='rub'){s=run(s,'pour',Math.ceil(t/2));s=run(s,'rub',t);}
 if(c.kind==='split'){s=run(s,'pour',t);s=run(s,'grind',t);s=run(s,'rub',t);}
 if(c.kind==='leave'){s=run(s,'pour',Math.ceil(t/2));s=run(s,'grind',t);if(energyView(s).work.moving)s=step(s,'rub');ok(!energyView(s).met,'open gate is not a still-water end state');const counts=energyView(s);s=step(s,'gate');eq(energyView(s).total,counts.total,'gate-last completion transfers no energy');}
 const v=energyView(s);ok(v.met&&v.work.done,'each target is actually feasible');eq(v.count,1);s=step(s,'keep');const kept=JSON.stringify(s.held);s=step(s,'restart');eq(s.works[index].done,true,'restart keeps earlier met flag');eq(s.works[index].lastAction,'restart');eq(s.works[index].waiting,n);eq(JSON.stringify(s.held),kept,'restart keeps immutable reference');s=step(s,'view','book');eq(s.works[index].lastAction,'restart','view keeps feedback');s=step(s,'size',energySizes[(energySizes.indexOf(n)+1)%3]);eq(JSON.stringify(s.held),kept,'other size keeps reference');
}
let allocations=0;
for(const N of energySizes)for(let p=0;p<=N/2;p++)for(let G=0;G<=2*p;G++)for(let A=0;A<=2*p-G;A++)for(const gate of[true,false]){
 const W=N-2*p,K=2*p-G-A,index=energySizes.indexOf(N)*6,s={...freshEnergyBook(),current:index};s.works[index]={waiting:W,moving:K,grinding:G,rubbing:A,gate,closedGrind:false,done:false,lastAction:null};allocations++;
 for(const a of['pour','grind','rub','gate']){
  const before=JSON.stringify(s),n=changeEnergyBook(s,a);eq(JSON.stringify(s),before,'every allocated input immutable');
  const blocked=a==='pour'?(!gate||W<2):a==='gate'?false:K===0;
  if(blocked){eq(n,null,'disabled step cannot act');continue;}
  ok(n,'valid allocated transition');const v=energyView(n),w=v.work;ok([w.waiting,w.moving,w.grinding,w.rubbing].every(x=>Number.isInteger(x)&&x>=0),'nonnegative integer ledger');eq(w.waiting+w.moving+w.grinding+w.rubbing,N,'no created/lost tracked energy');eq(w.waiting%2,0);eq(v.high+v.low,N/2,'same high-plus-low water portions');eq(w.lastAction,a,'request owns last feedback');
 }
 const v=energyView(s),book=energyBookDrawing(v),scene=energyScene(v);eq((book.match(/ data-energy-chip=/g)||[]).length,N,'all emitted filled cells account for whole budget');ok([...book.matchAll(/ data-energy-chip="[^"]+"[^>]+/g)].every(m=>m[0].includes('width="18" height="18"')),'fixed energy square size');eq((book.match(/fill="url\(#energy-current-rub\)"/g)||[]).length,A,'every rubbing chip uses pattern fill');eq((book.match(/data-energy-tag="grinding"/g)||[]).length,G,'solid thermal chips correspond to grinding');eq((scene.match(/data-energy-water-place="high"/g)||[]).length,W/2);eq((scene.match(/data-energy-water-place="low"/g)||[]).length,p);ok(book.includes(`energy-current-rub`)&&energyBookDrawing(v,'held').includes('energy-held-rub'),'separate current/held drawing ids');
}
// These equal ledgers arose through different last steps.
let a=freshEnergyBook(),b=freshEnergyBook();for(const x of['pour','grind','pour'])a=step(a,x);for(const x of['pour','pour','grind'])b=step(b,x);for(const k of['waiting','moving','grinding','rubbing'])eq(a.works[0][k],b.works[0][k]);eq(a.works[0].lastAction,'pour');eq(b.works[0].lastAction,'grind');
let s=freshEnergyBook();s=step(s,'job',3);for(const x of['pour','rub','rub'])s=step(s,x);ok(energyView(s).met);s=step(s,'pour');s=step(s,'grind');ok(!energyView(s).met&&s.works[3].done,'continued grinding invalidates rub-only current goal without inventing a new attempt');
s=freshEnergyBook();for(let i=0;i<6;i++)s.works[i].done=true;s=step(s,'size',12);s=step(s,'pour');const other=JSON.stringify(s.works.slice(6));s=step(s,'size',8);s=step(s,'keep');const h=JSON.stringify(s.held);s=step(s,'fresh-six');ok(s.works.slice(0,6).every(w=>!w.done&&w.waiting===8));eq(JSON.stringify(s.works.slice(6)),other,'new six replaces only selected batch size');eq(JSON.stringify(s.held),h);eq(changeEnergyBook(s,'fresh-six'),null);
for(const [a,v]of[['size',9],['size','8'],['job',-1],['job',6],['job',1.5],['view','unknown'],['unknown',0]])eq(changeEnergyBook(s,a,v),null);
const book=new Proxy({}, {get(){throw Error('notebook may not be read');},set(){throw Error('notebook may not be written');}});resetMillEnergy();const html=millEnergyPage(book,'synthetic');ok(html.includes('data-energy-root')&&html.includes('Grind at least 4 steps.'));ok(!/<audio|<video|<script|<iframe/.test(html),'no embedded media/runtime');ok(!html.includes('<link'),'turn rerenders do not remove/reinsert stylesheets');eq((readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').match(/href="\.\/mill-energy\.css"/g)||[]).length,1,'one permanent page-level stylesheet');resetMillEnergy();
console.log(checks,'mill-energy source assertions;',allocations,'reachable ledger/gate allocations; actual browser/subject/release gates separate');
