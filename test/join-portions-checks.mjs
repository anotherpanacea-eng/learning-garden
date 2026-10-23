import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {portionCases,portionCase,portionModel,movePortion} from '../dist/join-portions-core.mjs';
import {portionsPage,portionsSession,resetPortionsSession} from '../dist/join-portions-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
eq(portionCases.length,4);let states=0;
for(const c of portionCases){
 eq(portionCase(c.id),c);eq(portionModel(c,-1),null);eq(portionModel(c,c.b+1),null);eq(portionModel(c,.5),null);
 for(let k=0;k<=c.b;k++){
  const m=portionModel(c,k),visit={caseId:c.id,k,view:'join',exampleFrame:0,lastAction:null};states++;
  eq(m.trayCount+m.waitingCount,c.a+c.b);eq(m.tray.length,c.a+k);eq(m.waiting.length,c.b-k);eq(m.rowCount,Math.ceil((c.a+c.b)/c.d));eq(m.denominator,c.d);
  const ids=[...m.tray,...m.waiting].map(x=>x.id);eq(new Set(ids).size,c.a+c.b,'each piece exists once');
  eq(m.tray.filter(x=>x.origin==='a').map(x=>x.id),Array.from({length:c.a},(_,i)=>`A${i+1}`));
  eq(m.tray.filter(x=>x.origin==='b').map(x=>x.slot),Array.from({length:k},(_,i)=>c.a+i));
  eq(m.waiting.map(x=>x.slot),Array.from({length:c.b-k},(_,i)=>k+i));
  eq(264/c.d*c.d,264,'fixed whole width');
  for(const action of ['move','return']){const moved=movePortion(visit,action),allowed=action==='move'?k<c.b:k>0;
   eq(!!moved,allowed,'no clamp at bounds');if(moved){eq(moved.k,k+(action==='move'?1:-1));eq(portionModel(c,movePortion(moved,action==='move'?'return':'move').k),m,'opposite action restores all positions and counts');}}
 }
 eq(portionModel(c,c.b).trayCount,c.a+c.b,'authored full sum');
}
eq(states,12);eq(portionCase('future'),null);eq(movePortion({caseId:'future',k:0},'move'),null);eq(movePortion({caseId:'past-one',k:0},'split'),null);
resetPortionsSession();ok(portionsPage('synthetic-owner').includes('Choose a portion job'));eq(portionsSession(),null,'chooser allocates no visit');resetPortionsSession();
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
ok(app.includes('else if(portionsBench)html=portionsPage(explorerStore.active.id)'));
const appenders=app.split('\n').filter(line=>line.includes('html+=learningInvitations(context)')||line.includes('html+=connectionPanel(state,target)'));eq(appenders.length,2,'both actual invitation and connection appenders found');for(const line of appenders){const end=line.indexOf('){');ok(end>0&&line.trimStart().startsWith('if('),'actual appender condition extracted');const condition=line.slice(0,end);ok(condition.includes('!comparisonBench')&&condition.includes('!portionsBench'),'each actual appender condition retains comparison and portions exclusions');}
const hostBind=app.match(/function bind\(\)\{[\s\S]*?\n\}/)?.[0];ok(hostBind,'ordinary host bind function extracted');ok(hostBind.indexOf('bindPortions({')>=0&&hostBind.indexOf(' bindSpeech();')>=0&&hostBind.indexOf('bindPortions({')<hostBind.indexOf(' bindSpeech();'),'stale Hear guard binds before speech');
console.log(`Join the Portions: ${n} source/model checks passed across ${states} live states.`);
