import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {noteGardenFactExposure} from '../dist/garden-core.mjs';
import {notePendingBrambleFactExposure} from '../dist/post-rival.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {startLinear,prepareLinearDisplay} from '../dist/linear-pathway-core.mjs';
let n=0;const ok=(v,m)=>{assert.ok(v,m);n++;};
const options={canExport:c=>prepareProgressImport(JSON.stringify(c,null,2)).ok,exposeFacts:(pairs,s)=>{for(const pair of pairs){noteLegacyExposure(s,pair,{normalize:false});noteGardenFactExposure(s,pair,null,{normalize:false});notePendingBrambleFactExposure(s,pair);s.exposures??=[];const k=pair.join('x');if(!s.exposures.includes(k))s.exposures.push(k);}}};
for(const retained of [false,true]){
 const s=freshState();
 if(retained){s.garden={guide:'future-guide',seen:['future-node'],observations:[{future:'observation'}],visits:[{id:'future-visit',entrance:'future-entrance',drafts:{future:{text:'  Keep\r\nthis  '}}}],current:'future-visit'};s.broad={observations:[{future:'retain'}],activityObservations:[],trails:{future:{raw:1}},drafts:{future:{raw:'retain',question:{facts:'future format'}},pending:{question:{facts:[[2,3]]},attempts:[]}},closedDrafts:[{future:'retain'}],seenItems:[],seenVariants:[],seenFacts:[],encounters:{future:8}};}
 const garden=structuredClone(s.garden),raw=retained?structuredClone(s.broad):null;
 ok(startLinear(s,'views',options),'minimal direct math start');const before=JSON.stringify(s);ok(prepareLinearDisplay(s,options).ok,'actual report accepts shown facts');ok(JSON.stringify(s)!==before,'visible facts recorded');
 ok(JSON.stringify(s.garden)===JSON.stringify(garden),'garden not normalized or allocated');
 ok(s.broad.seenFacts.includes('2x3'),'canonical fact marker');ok(!s.exposures.includes('2x7'),'unshown products not marked');
 for(const key of ['observations','activityObservations','trails','closedDrafts','encounters'])if(retained)ok(JSON.stringify(s.broad[key])===JSON.stringify(raw[key]),'unrelated broad '+key+' retained');
 if(retained){ok(JSON.stringify(s.broad.drafts.future)===JSON.stringify(raw.drafts.future),'unknown draft retained');ok(s.broad.drafts.pending.knownFact===true,'matching waiting fact qualified');}
 else ok(!Object.hasOwn(s.broad,'trails')&&!Object.hasOwn(s.broad,'observations'),'only exposure fields allocated');
 const exact=JSON.stringify(s);ok(prepareLinearDisplay(s,{...options,canExport:()=>false}).ok===false,'preflight refusal');ok(JSON.stringify(s)===exact,'refusal unchanged');
}
const [nodeId,node]=Object.entries(storyNodes).find(([,x])=>x.facts?.length);
const g={garden:{guide:'future',visits:[{id:'known',entrance:node.entrance,drafts:{[nodeId]:{attempts:[]}}},{id:'future',entrance:'future',drafts:{[nodeId]:{raw:'retain'}}},null],seen:['future']}};
const future=g.garden.visits[1];noteGardenFactExposure(g,node.facts[0],null,{normalize:false});ok(g.garden.visits[0].drafts[nodeId].knownFact===true,'readable story draft qualified');ok(g.garden.visits[1]===future&&!future.drafts[nodeId].knownFact,'unknown story source not interpreted');ok(g.garden.seen[0]==='future','unknown seen id not filtered');
const bad=freshState();bad.broad={seenFacts:'unreadable'};ok(startLinear(bad,'views',options),'math source can open beside unreadable exposure field');const prior=JSON.stringify(bad);ok(prepareLinearDisplay(bad,options).ok===false,'unreadable exposure cannot be overwritten');ok(JSON.stringify(bad)===prior,'unreadable exposure refusal atomic');
console.log(`Subject fact exposure: ${n} direct-entry preservation, qualification and refusal assertions passed.`);
