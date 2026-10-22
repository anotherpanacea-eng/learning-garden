import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {entrances,storyNodes} from '../dist/story-content.mjs';
import {helpers,acceptsAnswer} from '../dist/help-content.mjs';
import {ensureGarden,currentVisit,startVisit,resumeVisit,storyDraft,noteStorySeen,submitStory,finishStoryNode,openStoryHelp,submitStoryHelp,useStoryReadingTool,storyDescribe} from '../dist/garden-core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const json=x=>JSON.stringify(x);
const fresh=()=>{const s=freshState();ensureGarden(s);return s;};
const ids=['paris-note','paris-reread','paris-narrow','paris-infer','paris-evidence','paris-sequence'];
const tools=()=>({audioRequested:false,sentenceUsed:false,focus:null,supportUncertain:false});
function reach(s,id){startVisit(s,'paris');while(currentVisit(s).node!==id){check(!!finishStoryNode(s,true),'earlier node can be left unexplored');}return storyDraft(s);}
function answer(s,reading='independent'){const d=storyDraft(s),n=storyNodes[currentVisit(s).node];submitStory(s,n.answer);d.method='worked';d.reading=reading;return finishStoryNode(s);}
check(entrances.find(e=>e.id==='paris')?.start===ids[0],'Paris has its own entrance');
check(json(ids.map(id=>storyNodes[id]?.answer))==='[1,2,0,2,0,1]','all six passage answer keys match reviewed readings');
check(json(ids.map(id=>helpers[id]?.answer))==='[0,1,1,0,1,1]','all six smaller-example keys match their texts');
for(const id of ids){
 const n=storyNodes[id],h=helpers[id];check(n?.type==='task'&&n.entrance==='paris'&&n.practiceOnly===true,'six Paris tasks are practice only');
 check(Array.isArray(n.readingText)&&n.readingText.length>=2&&n.readingText.every(s=>typeof s==='string'&&/[.!?]$/.test(s)),'source is connected full sentences');
 const words=n.readingText.join(' ').split(/\s+/).length;check(words>=25&&words<=65&&n.readingSkill&&n.passageId,'bounded passage has an explicit target and identity');
 check(n.kind==='choice'&&Number.isInteger(n.answer)&&!!n.choices[n.answer]&&n.hint&&n.explanation,'authored question has answer, hint and explanation');
 check(h?.kind==='choice'&&h.passage&&h.model?.type==='text'&&h.passage.split(/\s+/).length<words&&acceptsAnswer(h,h.answer),'each task has a different smaller keyed text helper');
 check(h.passage!==n.readingText.join(' ')&&h.id!==id,'helper uses a different example');
}
check(storyNodes['paris-postcard']?.type==='project'&&storyNodes['paris-postcard'].practiceOnly===true&&storyNodes['paris-postcard'].answer===undefined,'postcard remains an unscored invitation');
check(storyNodes['paris-infer'].passageId===storyNodes['paris-evidence'].passageId&&json(storyNodes['paris-infer'].readingText)===json(storyNodes['paris-evidence'].readingText),'inference and evidence deliberately share the available passage');
{
 const s=fresh();startVisit(s,'paris');
 for(const id of ids){check(currentVisit(s).node===id,'own ordered task sequence');storyDraft(s);noteStorySeen(s);const o=answer(s);
  check(o.correct&&!o.freshEvidence&&o.practiceOnly&&o.readingSkill===storyNodes[id].readingSkill&&o.passageId===storyNodes[id].passageId,'correct practice records target without fresh evidence');
 }
 check(currentVisit(s).node==='paris-postcard'&&finishStoryNode(s).status==='invitation'&&currentVisit(s).finished,'all six tasks reach their own unscored ending');
 const before=json(s);check(!useStoryReadingTool(s,'audio')&&!useStoryReadingTool(s,'sentence-next')&&!finishStoryNode(s)&&json(s)===before,'finished route cannot use tools or duplicate records');
 const r=restoreState(json(s));ensureGarden(r);check(currentVisit(r).finished&&r.garden.observations.length===7,'completed ending restores without duplicates');
}
{
 const s=fresh();startVisit(s,'paris');for(let i=0;i<6;i++)check(finishStoryNode(s,true).status==='skipped','each reading task can be skipped');
 check(finishStoryNode(s).status==='invitation'&&currentVisit(s).finished&&s.garden.observations.every(o=>!o.freshEvidence),'skip path reaches ending without performance claims');
}
{
 const s=fresh(),d=reach(s,ids[0]),n=storyNodes[ids[0]],text=json(n.readingText);d.input='Synthetic waiting input';d.choice=1;
 check(json(d.readingTools)===json(tools()),'fresh tools start unused');
 check(useStoryReadingTool(s,'sentence-next')&&d.readingTools.focus===0&&d.readingTools.sentenceUsed,'sentence focus starts at zero');
 for(let i=0;i<n.readingText.length+3;i++)useStoryReadingTool(s,'sentence-next');
 check(d.readingTools.focus===n.readingText.length-1,'sentence focus caps at final sentence');
 check(useStoryReadingTool(s,'whole')&&d.readingTools.focus===null&&d.readingTools.sentenceUsed,'whole passage clears focus but retains support use');
 const unavailableAudioRequest=()=>{useStoryReadingTool(s,'audio');return [].length>0;};
 check(!unavailableAudioRequest()&&d.readingTools.audioRequested,'request records support even with no available voice');
 check(d.input==='Synthetic waiting input'&&d.choice===1&&!d.attempts.length&&currentVisit(s).node===ids[0]&&json(n.readingText)===text,'tools never answer, advance, select, edit passage or discard form draft');
 const visit=currentVisit(s).id;startVisit(s,'message');resumeVisit(s,visit);const r=restoreState(json(s));ensureGarden(r);const rd=storyDraft(r);
 check(rd.readingTools.audioRequested&&rd.readingTools.sentenceUsed&&rd.readingTools.focus===null&&rd.input===d.input&&rd.choice===1,'tools and answer draft survive pause, route change and reload');
 const o=answer(r);check(o.supported&&!o.independent&&!o.freshEvidence&&o.reading==='independent'&&o.method==='worked'&&o.readingTools.audioRequested&&o.readingTools.sentenceUsed,'later independent self-report cannot remove reading-tool support');
 check(storyDescribe(o)==='Found an answer with support','description identifies actual tool support rather than an unobserved-reading report');
}
{
 const s=fresh(),d=reach(s,ids[1]);openStoryHelp(s);ensureGarden(s);const before=json(d),node=currentVisit(s).node;
 check(!useStoryReadingTool(s,'audio')&&!useStoryReadingTool(s,'sentence-next')&&json(d)===before,'tools cannot mutate waiting original while helper is open');
 const h=helpers[node];check(submitStoryHelp(s,h.answer)&&!finishStoryNode(s)&&currentVisit(s).node===node&&!d.attempts.length,'finishing helper never answers original');
 d.helper.open=false;const o=answer(s);check(o.helpUsed&&o.supported&&!o.independent&&!o.freshEvidence,'helper support remains separate and permanent');
 const old=fresh();startVisit(old,'message');const od=storyDraft(old),snapshot=json(od);check(!useStoryReadingTool(old,'audio')&&!useStoryReadingTool(old,'whole')&&json(od)===snapshot,'older tasks do not acquire reading tools');
}
{
 for(const reading of ['listened','together','unobserved']){const s=fresh();reach(s,ids[0]);const o=answer(s,reading);check(o.reading===reading&&o.method==='worked'&&o.supported&&!o.independent&&!o.freshEvidence,'reported reading mode preserved separately from answer method');}
 const s=fresh(),d=reach(s,ids[2]),n=storyNodes[ids[2]];submitStory(s,n.choices.findIndex((_,i)=>i!==n.answer));const o=answer(s);check(o.correct&&!o.firstCorrect&&!o.independent&&!o.freshEvidence&&o.attempts.length===2,'retry is retained as retry');
}
{
 const base=tools(),cases=[null,[],7,'bad',{}, {...base,audioRequested:'yes'},{...base,sentenceUsed:0},{...base,supportUncertain:null},{...base,focus:99},{...base,focus:-1},{...base,focus:0.5},{...base,focus:undefined}];
 for(const bad of cases){const s=fresh(),d=reach(s,ids[0]);d.readingTools=bad;ensureGarden(s);const t=storyDraft(s).readingTools;
  check(t.supportUncertain&&!t.audioRequested&&!t.sentenceUsed&&t.focus===null,'malformed tool metadata retains unknown support without invented use');
  const o=answer(s);check(o.supported&&!o.independent&&!o.freshEvidence&&o.readingTools.supportUncertain,'unknown support blocks independent evidence');
 }
 const s=fresh(),d=reach(s,ids[0]);d.readingTools={...base,audioRequested:true,sentenceUsed:true,focus:900};ensureGarden(s);
 check(d.readingTools.audioRequested&&d.readingTools.sentenceUsed&&d.readingTools.supportUncertain&&d.readingTools.focus===null,'invalid focus cannot clear retained audio/sentence flags');
 d.readingTools={...base,focus:0};ensureGarden(s);check(d.readingTools.sentenceUsed&&d.readingTools.focus===0,'valid non-null focus implies sentence use');
 const absent=fresh(),ad=reach(absent,ids[0]);delete ad.readingTools;ensureGarden(absent);const ao=answer(absent);check(!ao.readingTools.supportUncertain&&!ao.supported&&ao.independent&&!ao.freshEvidence,'absent legacy metadata defaults unused; practice remains nonfresh');
}
{
 const s=fresh();reach(s,ids[0]);const o=answer(s);o.readingTools=null;o.supported=false;o.independent=true;o.freshEvidence=true;ensureGarden(s);
 check(o.readingTools===null&&!o.supported&&o.independent&&o.freshEvidence,'captured Paris observation keeps malformed historical support fields raw');
 check(storyDescribe(o).includes('uncertain'),'notes interpret missing support cautiously without changing stored flags');
 o.readingTools={...tools(),audioRequested:true};o.supported=false;o.independent=true;ensureGarden(s);check(o.readingTools.audioRequested&&!o.supported&&o.independent&&o.freshEvidence,'captured Paris audio history is not regraded on load');
 check(storyDescribe(o)==='Found an answer with support','notes acknowledge recorded audio even if old support flag disagrees');
 o.readingTools=tools();o.reading='listened';o.supported=false;o.independent=true;ensureGarden(s);check(o.reading==='listened'&&!o.supported&&o.independent,'captured Paris reading report is not regraded on load');
}
{
 const s=fresh(),d=reach(s,'paris-infer');check(!d.priorPassageSeen,'first shared-passage encounter starts without prior passage');noteStorySeen(s);ensureGarden(s);check(!d.priorPassageSeen,'own first display does not become earlier exposure');d.hinted=true;answer(s);
 const e=storyDraft(s);check(currentVisit(s).node==='paris-evidence'&&e.priorPassageSeen,'evidence task knows inference passage was already shown');const o=answer(s);
 check(o.priorPassageSeen&&!o.freshEvidence&&storyDescribe(o).includes('earlier encounter'),'record and description retain passage familiarity');
 const first=currentVisit(s).id;reach(s,'paris-infer');noteStorySeen(s);const other=currentVisit(s).id;resumeVisit(s,first);resumeVisit(s,other);check(storyDraft(s).priorPassageSeen,'revisit of previously shown passage remains familiar');
}
{
 const s=fresh();reach(s,'paris-infer');const first=currentVisit(s).id,paused=storyDraft(s);noteStorySeen(s);reach(s,'paris-infer');noteStorySeen(s);resumeVisit(s,first);
 check(paused.priorPassageSeen&&storyDraft(s).priorPassageSeen,'another visit updates paused shared-passage familiarity');
 const r=restoreState(json(s));ensureGarden(r);check(storyDraft(r).priorPassageSeen,'prior passage flag is sticky across reload');
 delete storyDraft(r).priorPassageSeen;ensureGarden(r);check(storyDraft(r).priorPassageSeen,'missing restored familiarity derives conservatively from seen passage IDs');
 const observation=answer(r);observation.priorPassageSeen='broken';ensureGarden(r);check(observation.priorPassageSeen&&!observation.freshEvidence,'malformed recorded familiarity derives conservatively from seen IDs');
}
{
 const s=fresh();s.cafe={synthetic:'waiting stock and trip fixture'};s.science={synthetic:'waiting mission fixture'};s.facts={synthetic:'waiting fact fixture'};s.baseline.index=2;s.practice.push({questionId:'synthetic',skill:'facts',status:'answered',fact:[4,6],attempts:[24]});
 const untouched=json({cafe:s.cafe,science:s.science,facts:s.facts,baseline:s.baseline,practice:s.practice});
 startVisit(s,'message');const old=storyDraft(s);submitStory(s,storyNodes[currentVisit(s).node].answer);old.method='worked';old.reading='independent';const observation=finishStoryNode(s);ensureGarden(s);const oldSnapshot=json(observation);
 reach(s,ids[0]);useStoryReadingTool(s,'audio');answer(s);ensureGarden(s);
 check(json(observation)===oldSnapshot&&!old.readingTools,'earlier node and observation flags remain unchanged');
 check(json({cafe:s.cafe,science:s.science,facts:s.facts,baseline:s.baseline,practice:s.practice})===untouched,'reading visit preserves all unrelated state');
 const r=restoreState(json(s));ensureGarden(r);check(r.baseline.index===2&&r.practice.length===1&&r.cafe.synthetic===s.cafe.synthetic,'old saves and other extensions survive restore');
}
console.log(checks+' Paris reading, tools and evidence checks passed.');
