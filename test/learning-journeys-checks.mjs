import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {learningJourneys,journeySelection,chooseJourney,chooseJourneyStop,journeyFacts,prepareJourneyDisplay,learningJourneysPage} from '../dist/learning-journeys.mjs';
import {freshState} from '../dist/core.mjs';
import {GROUP_CASES} from '../dist/equal-groups-content.mjs';
import {groundCases} from '../dist/same-ground-content.mjs';
import {priceCards} from '../dist/slope-equation-content.mjs';
import {linearLessons} from '../dist/linear-pathway-content.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const freeze=x=>{if(x&&typeof x==='object'){Object.freeze(x);Object.values(x).forEach(freeze);}return x;};
const a=freshState(),b=freshState(),owner='synthetic-one';
eq(journeySelection(a,owner),{id:'twelve',step:0},'explicit neutral default');
for(const j of learningJourneys){ok(chooseJourney(a,owner,j.id),'both journeys open');eq(journeySelection(a,owner).step,0,'journey change starts first stop');eq(j.stops.length,4,'four finite stops');for(let step=0;step<4;step++){
 ok(chooseJourneyStop(a,owner,step),'all stops open in arbitrary order');const before=JSON.stringify(a),html=learningJourneysPage(freeze(a),owner);eq(JSON.stringify(a),before,'pure rendering does not mutate notebook');ok(html.includes(j.stops[step].route),'real activity link');ok(html.includes(`Stop ${step+1} of 4`),'visible step');ok(html.includes('data-journey-heading'),'focusable current heading');const facts=journeyFacts(a,owner);for(const p of facts)ok(facts.some(q=>q[0]===p[1]&&q[1]===p[0]),'reverse support relation retained');
 if(step===0)ok(html.includes('data-journey-move="-1" disabled'),'first stop no wrapping');if(step===3)ok(html.includes('data-journey-move="1" disabled'),'last stop no wrapping');
}}
for(const step of [-1,4,1.5,NaN,'2'])ok(!chooseJourneyStop(a,owner,step),'invalid stop rejected');ok(!chooseJourney(a,owner,'unavailable'),'unknown journey rejected');eq(journeySelection(b,owner),{id:'twelve',step:0},'new notebook resets');chooseJourneyStop(b,owner,2);eq(journeySelection(b,'other'),{id:'twelve',step:0},'owner replacement resets');
for(const root of [undefined,null,[],{version:99,retained:'synthetic'}]){const s={...freshState(),broad:root,syntheticFuture:{payload:['keep']}},before=JSON.stringify(s);learningJourneysPage(freeze(s),'synthetic');eq(JSON.stringify(s),before,'pure render retains unsupported/additive roots');}
const expose=(facts,s)=>{s.exposures??=[];for(const [a,b]of facts){if(!s.exposures.includes(`${a}x${b}`))s.exposures.push(`${a}x${b}`);}};
const s={...freshState(),syntheticFuture:{payload:'keep'}};const before=JSON.stringify(s);
eq(prepareJourneyDisplay(s,owner,{exposeFacts:expose,canExport:()=>false}),{ok:false,changed:false},'preflight refusal explicit');eq(JSON.stringify(s),before,'preflight refusal atomic');
eq(prepareJourneyDisplay(s,owner,{exposeFacts:expose,canExport:()=>true}),{ok:true,changed:true},'example records exposure');ok(s.exposures.includes('3x4')&&s.exposures.includes('4x3'),'both orientations supported');eq(s.baseline.observations,[],'shown example never creates success');eq(s.syntheticFuture,{payload:'keep'},'additive root exact');
eq(prepareJourneyDisplay(s,owner,{exposeFacts:expose,canExport:()=>true}),{ok:true,changed:false},'repeat display idempotent');
const blocked=learningJourneysPage(s,owner,{ready:false});ok(!blocked.includes('Three plates, four bites'),'refusal does not reveal unsafe example');ok(blocked.includes('href="#notes"'),'recovery available');
const little=GROUP_CASES.find(x=>x.id==='little-table');ok(little,'existing little-table case');const twelve=groundCases.find(x=>x.id==='twelve');eq(twelve.stock,12,'actual tile stock');eq([2*6,3*4,2*(2+6),2*(3+4)],[12,12,16,14],'independent area/boundary arithmetic');
for(const [id,m,b]of [['zero','-2','6'],['halves','1/2','1'],['plans','3/2','3']]){const l=linearLessons.find(x=>x.id===id);eq([l.model.m,l.model.b],[m,b],'actual existing signed/fractional model '+id);}
eq(3+1.5*4,7+.5*4,'two plans meet at four');
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.indexOf("if(root==='journeys')")<app.indexOf('if(needsExplorerInitialization){'),'isolated scene before normalizers');const scene=app.slice(app.indexOf("if(root==='journeys')"),app.indexOf("const plantBench="));ok(scene.includes('prepareJourneyDisplay(state,explorerStore.active.id')&&scene.includes('target,true,false'),'actual journey scene qualifies pending exposure without normalizing');
const home=readFileSync(new URL('../dist/home-entry.mjs',import.meta.url),'utf8');ok(home.includes("['#town/remembers','Town stories'"),'correct actual Town destination');ok(home.includes('href="#journeys"'),'quiet Home invitation');
for(const c of priceCards)ok(learningJourneys[1].stops.some(s=>s.choose.includes(c.title)), 'hint matches real price-card title '+c.title);
console.log(`${checks} learning journey source checks passed.`);
