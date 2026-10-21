import assert from 'node:assert/strict';
import {BELL_MODEL,BELL_NOTES,BELL_CARDS,BELL_PAIRS} from '../dist/bell-studio-content.mjs';
import * as b from '../dist/bell-studio-core.mjs';
let count=0;const ok=(v,m)=>{assert.ok(v,m);count++;},eq=(a,c,m)=>{assert.deepEqual(a,c,m);count++;},copy=x=>structuredClone(x);
const fresh=(id='cafe-gather')=>{const s={other:{pending:'fictional delivery',stock:7}};b.chooseBellCard(s,id);return s;};
const put=(s,notes)=>{b.clearBellSequence(s);for(const n of notes)b.appendBellSlot(s,n);};
const current=s=>b.bellView(s).work;
eq(BELL_NOTES.map(n=>n.frequency),[220,330,440,null],'three exact pure-tone choices and silent rest');
eq([BELL_MODEL.slotSeconds,BELL_MODEL.toneSeconds,BELL_MODEL.peakGain],[.5,.35,.025],'common fixed timing and low digital gain');
ok(Object.isFrozen(BELL_CARDS[0].model),'shared catalogue immutable');
{
 const s={};const before=copy(s);b.bellState(s);b.bellView(s);eq(s,before,'missing root read-only');ok(b.ensureBellStudio(s));eq(b.bellState(s).page,'choose');ok(!b.setBellPage(s,'make'),'cannot enter absent draft');
}
const examples={
 'cafe-gather':{good:[['low','low','rest','high','high'],['middle','middle','rest','middle','middle']],bad:[[],['rest','rest','rest','rest','rest'],['low','high','rest','high','high'],['low','low','high','high']]},
 'post-arrival':{good:[['low','middle','high'],['middle','low','high']],bad:[[],['high','middle','low'],['low','rest','high'],['low','low','low']]},
 'garden-return':{good:[['low','middle','high','low','middle','high'],['high','high','middle','high','high','middle']],bad:[[],['low','middle','high','low','high','middle'],['low','rest','high','low','rest','high'],['low','middle','high']]},
 'own-call':{good:[['low'],['rest','high','rest'],Array(8).fill('middle')],bad:[[],['rest'],Array(8).fill('rest')]}
};
for(const c of BELL_CARDS){
 const s=fresh(c.id);eq(current(s).sequence,[],'every card starts empty');
 for(const seq of examples[c.id].good){put(s,seq);ok(b.bellArrangementAssessment(c,seq).matches,`${c.id} valid alternative`);ok(b.checkBellArrangement(s).assessment.matches,'action uses actual arrangement');ok(b.bellView(s).arrangementFeedback.includes('fits'))}
 for(const seq of examples[c.id].bad){put(s,seq);ok(!b.bellArrangementAssessment(c,seq).matches,`${c.id} nonmatching but retained`);const checked=b.checkBellArrangement(s);ok(!checked.assessment.matches);ok(b.keepBellCall(s),'incomplete/all-rest work may be kept');eq(current(s).sequence,seq,'check/keep do not repair sequence');}
 const kept=copy(current(s).kept);b.useBellSupport(s,'together');b.appendBellSlot(s,'high');eq(current(s).kept,kept,'later support/edit do not mutate kept draft');
 eq(s.other,{pending:'fictional delivery',stock:7},'only own destination changes');
}
{
 const s=fresh('own-call');for(const n of ['low','middle','high','rest','high','low','middle','rest'])ok(b.appendBellSlot(s,n));const full=copy(s);ok(!b.appendBellSlot(s,'low'),'eighth slot preserved at limit');eq(s,full,'invalid append atomic');
 ok(b.selectBellSlot(s,0));ok(!b.moveBellSlot(s,-1));ok(b.replaceBellSlot(s,'high'));eq(current(s).sequence[0],'high');ok(b.moveBellSlot(s,1));eq(current(s).selected,1);eq(current(s).sequence.slice(0,2),['middle','high']);ok(b.removeBellSlot(s));eq(current(s).sequence.length,7);ok(b.inspectBellSlot(s,1));eq(current(s).inspect,0);ok(b.inspectBellSlot(s,-1));eq(current(s).inspect,0,'manual inspection bounded');
 b.clearBellSequence(s);eq([current(s).selected,current(s).inspect],[null,null]);ok(!b.inspectBellSlot(s,1));ok(!b.removeBellSlot(s));
 for(const fn of [()=>b.appendBellSlot(s,'5000'),()=>b.replaceBellSlot(s,'unknown'),()=>b.selectBellSlot(s,0),()=>b.selectBellSlot(s,'0'),()=>b.moveBellSlot(s,2),()=>b.setBellPage(s,'audio'),()=>b.useBellSupport(s,'mastered')]){const before=copy(s);ok(!fn());eq(s,before,'bad argument atomic');}
}
{
 const s=fresh('post-arrival');put(s,['low','middle','high']);b.checkBellArrangement(s);const old=copy(current(s).checks[0]);b.saveBellBefore(s);const before=copy(current(s).before);b.selectBellSlot(s,2);b.replaceBellSlot(s,'low');eq(current(s).before,before);eq(current(s).checks[0],old);eq(b.bellView(s).arrangementFeedback,'','edit suppresses stale current check');eq(b.bellView(s).priorArrangement,old,'old check explicitly prior');eq(b.bellView(s).changes.positions,[{position:3,before:'high',current:'low'}]);b.keepBellCall(s);eq(current(s).kept.assessment.matches,false,'kept current assessment differs from earlier matching check');eq(current(s).kept.latestArrangement,old);b.useBellSupport(s,'ladder');eq(current(s).checks[0].support,old.support,'later help never retroactive');b.checkBellArrangement(s);ok(current(s).checks.at(-1).familiar,'repeat rule check marked familiar');
}
for(const pair of BELL_PAIRS){
 const s=fresh('own-call');ok(b.chooseBellPair(s,pair.id));ok(!b.checkBellComparison(s),'pending response not an attempt');
 for(const response of ['higher','lower','same','not-sure']){b.setBellComparisonResponse(s,response);const result=b.checkBellComparison(s);eq(result.assessment.relation,pair.id==='rise'?'higher':pair.id==='fall'?'lower':'same');eq(result.assessment.match,response==='not-sure'?null:response===result.assessment.relation);ok(b.bellView(s).comparisonFeedback.includes('does not tell us what someone heard'));}
 const old=copy(current(s).checks.at(-1));b.setBellComparisonResponse(s,'higher');eq(b.bellView(s).comparisonFeedback,'');eq(b.bellView(s).priorComparison,old);b.chooseBellPair(s,pair.id==='rise'?'fall':'rise');eq(current(s).response,null,'different pair starts own pending answer');eq(current(s).checks.at(-1),old);b.keepBellCall(s);eq(current(s).kept.latestComparison,old,'kept prior comparison remains source-labelled');
}
{
 const s=fresh('own-call');put(s,['low','rest','high']);b.selectBellSlot(s,1);b.inspectBellSlot(s,1);b.saveBellBefore(s);b.chooseBellPair(s,'fall');b.setBellComparisonResponse(s,'not-sure');b.setBellPage(s,'compare');const first=copy(s);b.chooseBellCard(s,'post-arrival');put(s,['middle']);b.chooseBellCard(s,'own-call');b.setBellPage(s,'compare');eq(current(s).sequence,first.bellStudio.cards['own-call'].sequence);eq(current(s).selected,1);eq(current(s).response,'not-sure');ok(current(s).familiar);eq(b.bellState(JSON.parse(JSON.stringify(s))),s.bellStudio,'saved page/inspection/pending/source/before survive restore');const frozen=copy(s);b.bellState(s);b.bellView(s);eq(s,frozen,'view/render adds no answer');
 for(let i=0;i<40;i++){b.checkBellArrangement(s);b.setBellComparisonResponse(s,'same');b.checkBellComparison(s);}eq(current(s).checks.length,24);ok(current(s).checks.some(x=>x.kind==='arrangement'));ok(current(s).checks.some(x=>x.kind==='comparison'));b.keepBellCall(s);const kept=copy(current(s).kept);for(let i=0;i<4;i++)b.nextBellCard(s);eq(current(s).kept,kept,'card cycle preserves kept version');
}
{
 for(const n of ['low','middle','high']){const p=b.bellPlaybackPlan([n]);eq(p.slots[0].frequency,BELL_NOTES.find(x=>x.id===n).frequency);eq(p.duration,.5);}
 const seq=['low','rest','high','middle','low','rest','middle','high'],p=b.bellPlaybackPlan(seq);eq(p.duration,4);eq(p.slots.at(-1).start,3.5);eq(p.slots[1].frequency,null);eq(p.slots[1].toneSeconds,0);seq[0]='high';eq(p.sequence[0],'low','plan isolated from later edits');eq(b.bellPlaybackPlan([]).hasSound,false);eq(b.bellPlaybackPlan(['rest']).hasSound,false);for(const v of [null,{},['440'],Array(9).fill('low'),[undefined],Array(2),Object.assign(['low'],{extra:'high'})])eq(b.bellPlaybackPlan(v),null);
}
const invalid=[null,[],{}, {version:99,private:'<fictional>'}];
{
 const s=fresh('post-arrival');put(s,['low','middle','high']);b.checkBellArrangement(s);b.saveBellBefore(s);b.chooseBellPair(s,'same');b.setBellComparisonResponse(s,'same');b.checkBellComparison(s);b.keepBellCall(s);
 const mutations=[r=>r.extra=true,r=>r.currentCard='other',r=>r.page='audio',r=>r.cards['post-arrival'].source.model.peakGain=1,r=>r.cards['post-arrival'].sequence.push('5000'),r=>r.cards['post-arrival'].sequence=Array(9).fill('low'),r=>r.cards['post-arrival'].selected=9,r=>r.cards['post-arrival'].inspect=-1,r=>r.cards['post-arrival'].response='correct',r=>r.cards['post-arrival'].support.audioRequested=false,r=>r.cards['post-arrival'].support.remote=true,r=>r.cards['post-arrival'].checks[0].assessment.matches=false,r=>r.cards['post-arrival'].checks[1].assessment.match=false,r=>r.cards['post-arrival'].checks[1].pair.sequence=['high','low'],r=>r.cards['post-arrival'].checks=Array(25).fill(r.cards['post-arrival'].checks[0]),r=>r.cards['post-arrival'].before.sequence[0]='alien',r=>r.cards['post-arrival'].kept.assessment.matches=false,r=>r.cards['post-arrival'].sequence[2]='low',r=>r.cards['post-arrival'].response='lower',r=>r.cards['post-arrival'].kept.latestComparison=null,r=>r.cards['post-arrival'].sequence=Array(3),r=>delete r.cards['post-arrival'].checks[0],r=>delete r.cards['post-arrival'].checks[1].pair.sequence[0]];
 for(const mutate of mutations){const r=copy(s.bellStudio);mutate(r);invalid.push(r);}
}
for(const raw of invalid){const s={bellStudio:raw,other:{pending:'fictional'}},before=copy(s);eq(b.bellState(s),null,'unknown/malformed/semantically wrong root unavailable');eq(b.bellView(s),null);ok(!b.chooseBellCard(s,'own-call'),'ordinary action never normalizes unknown root');eq(s,before,'exact payload retained');ok(b.recoverBellStudio(s));eq(s.bellStudio.recovered,raw,'explicit recovery keeps full source');ok(b.bellState(s));ok(b.chooseBellCard(s,'own-call'));eq(s.bellStudio.recovered,raw,'later own action preserves recovery');eq(s.other,{pending:'fictional'});}
console.log(`bell studio core: ${count} checks passed`);
