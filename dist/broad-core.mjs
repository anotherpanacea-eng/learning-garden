import {bundleQuestionExposure,syncBundleQuestionExposure} from './bundle-broad-exposure.mjs';
import {areas} from './broad-content.mjs';
import {generatedBroad} from './broad-variants.mjs';
import {cleanBroadHelp} from './broad-help.mjs';

export const areaById = id => areas.find(a => a.id === id);
export const broadItems = () => areas.flatMap(a => [...a.checkin, ...a.activities]);
export const itemById = id => broadItems().find(q => q.id === id);
const pairKey = fact => fact && [...fact].sort((a,b) => a-b).join('x');

export function ensureBroad(state) {
  const legacyWork = [...state.baseline.observations, ...state.practice, ...state.puzzles];
  if (!state.broad || typeof state.broad !== 'object') {
    state.broad = {observations:[], activityObservations:[], trails:{}, drafts:{},
      seenItems:[], seenFacts:[], legacyExposureUnknown:legacyWork.length > 0, journey:null};
  }
  const b = state.broad;
  const valid = o => o && typeof o.questionId === 'string' && typeof o.area === 'string'
    && Array.isArray(o.attempts) && o.attempts.every(Number.isFinite);
  for (const k of ['observations','activityObservations']) {
    if (!Array.isArray(b[k])) b[k] = [];
    b[k] = b[k].filter(valid);
  }
  for (const k of ['seenItems','seenFacts']) if (!Array.isArray(b[k])) b[k] = [];
  for (const k of ['trails','drafts']) if (!b[k] || typeof b[k] !== 'object' || Array.isArray(b[k])) b[k] = {};
  if(!b.encounters||typeof b.encounters!=='object'||Array.isArray(b.encounters))b.encounters={};
  if(!Array.isArray(b.seenVariants))b.seenVariants=[];
  b.seenVariants=b.seenVariants.filter(x=>typeof x==='string'&&x.length<=300);
  if(!Array.isArray(b.closedDrafts))b.closedDrafts=[];
  b.closedDrafts=b.closedDrafts.filter(x=>x&&typeof x.key==='string'&&x.draft&&typeof x.draft==='object'&&!Array.isArray(x.draft));
  for (const [key,draft] of Object.entries(b.drafts)) {
    if (!draft || !Array.isArray(draft.attempts) || !draft.attempts.every(Number.isFinite)){delete b.drafts[key];continue;}
    if(draft.question&&!validSnapshot(draft.question,key.split(':').slice(1).join(':'))){
      // A wording/content update can invalidate a frozen question. Keep all earlier work,
      // but never score it against the replacement question or feed it to suggestions.
      b.closedDrafts.push({key,draft:structuredClone(draft)});b.draftNotice=true;
      delete b.drafts[key];continue;
    }
    if(draft.model&&!validDraftModel(draft.model))delete draft.model;
    if(draft.helper){const q=draft.question||itemById(key.split(':').slice(1).join(':'));if(q)cleanBroadHelp(q,draft);else delete draft.helper;}
    if(draft.helpUsed||draft.helper)draft.helpUsed=true;
    syncBundleQuestionExposure(state,draft.question||itemById(key.replace(/^(checkin|activity):/,'')),draft);
  }
  for (const [id,t] of Object.entries(b.trails)) {
    if (!areaById(id) || !t || !Array.isArray(t.questions) || t.questions.length > 2
      || !t.questions.every(qid => areaById(id).checkin.some(q => q.id === qid))
      || !Number.isInteger(t.index) || t.index < 0 || t.index > t.questions.length) delete b.trails[id];
  }
  if (b.journey && (!Array.isArray(b.journey.ids) || !b.journey.ids.every(id => areaById(id))
    || !Number.isInteger(b.journey.index) || b.journey.index < 0 || b.journey.index >= b.journey.ids.length)) b.journey = null;
  for (const o of legacyWork) if (o.fact && (o.attempts?.length || o.hinted || o.revealed)) {
    const key = pairKey(o.fact);
    if (!b.seenFacts.includes(key)) b.seenFacts.push(key);
  }
  for (const key of state.exposures || []) if (/^\d+x\d+$/.test(key)) {
    const canonical = pairKey(key.split('x').map(Number));
    if (!b.seenFacts.includes(canonical)) b.seenFacts.push(canonical);
  }
  return b;
}

export function beginTrail(state, id, revisit=false) {
  const b = ensureBroad(state), a = areaById(id);
  if (!a) return null;
  let t = b.trails[id];
  if (!t || (t.complete && revisit)) {
    const visits = (t?.visits || 0) + 1;
    t = {questions:[a.checkin[1].id], index:0, complete:false, visits, observationStart:b.observations.length};
    b.trails[id] = t;
  }
  const journey=b.journey;
  if(t.complete&&journey?.active&&journey.ids[journey.index]===id&&journey.index===journey.ids.length-1)journey.active=false;
  return t;
}

export function trailQuestion(state, id) {
  const t = state.broad.trails[id];
  return t && !t.complete ? itemById(t.questions[t.index]) : null;
}

const variantKey=q=>`${q.id}:${q.variant?.seed??'authored'}`;
function validDraftModel(m){
 if(!m||typeof m!=='object'||Array.isArray(m))return false;
 const n=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
 const list=(x,limit,max)=>Array.isArray(x)&&x.length<=limit&&x.every(v=>n(v,0,max));
 switch(m.type){
 case 'place':return n(m.hundreds,0,9)&&n(m.tens,0,12)&&n(m.ones,0,20);
 case 'array':return n(m.rows,1,9)&&n(m.cols,1,9)&&(m.counted===undefined||list(m.counted,81,m.rows*m.cols-1));
 case 'fraction':return n(m.parts,2,12)&&n(m.shaded,0,m.parts)&&(m.shadedPieces===undefined||list(m.shadedPieces,12,m.parts-1));
 case 'pattern':return list(m.values,10,200)&&m.values.length>=2&&n(m.step,1,9);
 case 'shape':return ['triangle','rectangle','square','hexagon'].includes(m.shape)&&n(m.turns??0,0,3)&&(m.foldAngle===undefined||Number.isFinite(m.foldAngle)&&Math.abs(m.foldAngle)<=360);
 case 'compass':return n(m.turns??0,0,3);
 case 'ruler':return n(m.max,1,20)&&n(m.start,0,m.max)&&n(m.end,m.start,m.max);
 case 'counters':return n(m.count,0,40);
 default:return false;
 }
}
function validSnapshot(q,id){
 const template=itemById(id);if(!template||!q||q.id!==id)return false;
 if(q.variant!==null&&(typeof q.variant?.seed!=='string'||q.variant.seed.length>200))return false;
 const expected=q.variant?generatedBroad(template,q.variant.seed):{...structuredClone(template),variant:null};
 return JSON.stringify(q)===JSON.stringify(expected);
}
export function instantiateBroad(state,q,mode='checkin',explorerSeed='garden'){
 const b=ensureBroad(state),kind=mode.includes('activity')?'activity':'checkin',draft=b.drafts[`${kind}:${q.id}`];
 if(validSnapshot(draft?.question,q.id))return structuredClone(draft.question);
 // Old drafts predate variants. Their authored question must stay waiting.
 if(draft){b.encounters[q.id]=Math.max(1,b.encounters[q.id]||0);return {...structuredClone(q),variant:null};}
 const n=Number.isSafeInteger(b.encounters[q.id])&&b.encounters[q.id]>=0?b.encounters[q.id]:0;
 b.encounters[q.id]=n+1;
 return n===0?{...structuredClone(q),variant:null}:generatedBroad(q,`${explorerSeed}:${q.id}:${n}`);
}
export function familiarity(state,q){
 const b=ensureBroad(state),key=variantKey(q),hasTemplate=b.seenItems.includes(q.id);
 const bundle=bundleQuestionExposure(state,q);
 const familiar=bundle.familiar||b.seenVariants.includes(key)||(hasTemplate&&!q.variant&&!b.seenVariants.some(x=>x.startsWith(`${q.id}:`)));
 return {familiar,sameKind:hasTemplate&&!familiar,knownFact:(q.facts||[q.fact]).filter(Boolean).some(f=>b.seenFacts.includes(pairKey(f))),priorExposureUnknown:!!b.legacyExposureUnknown||bundle.priorExposureUnknown};
}
export function noteBroadExposure(state,q,mode){
 const b=ensureBroad(state);if(!b.seenItems.includes(q.id))b.seenItems.push(q.id);
 const vkey=variantKey(q);if(!b.seenVariants.includes(vkey))b.seenVariants.push(vkey);
 for(const fact of (q.facts||[q.fact]).filter(Boolean)){
  const key=pairKey(fact);if(!b.seenFacts.includes(key))b.seenFacts.push(key);
  for(const [draftKey,d]of Object.entries(b.drafts)){
   const other=d.question||itemById(draftKey.replace(/^(checkin|activity):/,''));
   if((other?.facts||[other?.fact]).filter(Boolean).some(f=>pairKey(f)===key)&&draftKey!==`${mode}:${q.id}`)d.knownFact=true;
  }
 }
}
export function broadSupportLevel(active){return active.revealed?3:active.stepsSeen||active.helpUsed||active.modelUsed?2:active.hinted?1:0;}

export function noteLegacyExposure(state, fact) {
  if (!fact) return;
  noteBroadExposure(state, {id:`legacy-${pairKey(fact)}`,fact}, 'legacy');
}

export function makeBroadObservation(q, active, mode, skip=false, state=null) {
  const bundle=state?bundleQuestionExposure(state,q):{familiar:false,priorExposureUnknown:false};
  const familiar=!!active.familiar||bundle.familiar,priorExposureUnknown=!!active.priorExposureUnknown||bundle.priorExposureUnknown;
  const firstCorrect = active.attempts.length === 1 && active.attempts[0] === q.answer;
  const correct = !skip && active.attempts.at(-1) === q.answer;
  const supported = !!active.hinted || !!active.revealed || !!active.modelUsed || !!active.lessonSeen || !!active.helpUsed || !!active.stepsSeen || broadSupportLevel(active)>0 || active.method === 'together';
  const independent = correct && firstCorrect && !supported;
  return {questionId:q.id, area:q.area, skill:q.skill, topicId:q.topicId, label:q.label,
    prompt:q.prompt, answer:q.answer, choices:q.choices || null, fact:q.fact || null,
    attempts:[...active.attempts], correct, firstCorrect:!skip && firstCorrect, supported,
    independent, freshEvidence:independent && !familiar && !active.sameKind && !active.knownFact && !priorExposureUnknown,
    hinted:!!active.hinted, revealed:!!active.revealed, modelUsed:!!active.modelUsed, lessonSeen:!!active.lessonSeen,
    variant:q.variant?structuredClone(q.variant):null,sameKind:!!active.sameKind,
    helpUsed:!!active.helpUsed,helper:active.helper?structuredClone(active.helper):null,stepsSeen:!!active.stepsSeen,supportLevel:broadSupportLevel(active),
    misconceptions:Array.isArray(active.misconceptions)?structuredClone(active.misconceptions):[],
    familiar, knownFact:!!active.knownFact, priorExposureUnknown,
    method:skip?null:active.method, source:mode,
    status:skip?(active.attempts.length?'explored':'skipped'):(correct?'answered':'explored'), at:new Date().toISOString()};
}

export function recordTrail(state, o) {
  const b = ensureBroad(state), a = areaById(o.area), t = b.trails[o.area];
  b.observations.push(o);
  delete b.drafts[`checkin:${o.questionId}`];
  if (t.index === 0) {
    const next = o.status === 'skipped' ? a.checkin.find((q,i) => i>=1 && i<=2 && q.id !== o.questionId)
      : a.checkin[o.independent ? 3 : 0];
    t.questions.push(next.id);
  }
  t.index++;
  t.complete = t.index >= 2;
  const journey=b.journey;
  if(t.complete&&journey?.active&&journey.ids[journey.index]===o.area&&journey.index===journey.ids.length-1)journey.active=false;
  return t.complete;
}

export function broadDescribe(o) {
  if (!o || o.status === 'skipped') return 'Not explored yet';
  if (!o.correct) return 'Worth another look together';
  if (o.supported) return 'Found an answer with support';
  if (!o.firstCorrect) return 'Found an answer after another try';
  if(o.sameKind&&!o.familiar&&!o.knownFact)return 'Answered independently, a new example of a familiar kind of question';
  if (o.familiar || o.knownFact) return 'Answered independently after an earlier encounter';
  if (o.method === 'worked') return 'Worked it out independently';
  if (o.method === 'counted') return 'Counted independently';
  return 'Answered independently';
}

export function areaEvidence(state, id) {
  return state.broad.observations.filter(o => o.area === id);
}

export function suggestActivity(state, id, graph) {
  const a = areaById(id), start=state.broad.trails[id]?.observationStart||0;
  const obs = state.broad.observations.slice(start).filter(o => o.area===id && o.status !== 'skipped');
  const last = obs.at(-1);
  if (!last) return {item:a.activities[1], reason:'A new place to explore. No garden walk is needed first.',childReason:'A new place to explore. Try this one.'};
  const items = areas.flatMap(x => x.activities);
  const edges = graph?.dependencies || [], names = new Map((graph?.topics || []).map(t => [t.id,t.name]));
  const needsSupport = !last.correct || last.supported || !last.firstCorrect;
  if (needsSupport) {
    const edge = edges.find(e => e.topicId === last.topicId && items.some(q => q.topicId === e.prerequisiteId));
    if (edge) return {item:items.find(q => q.topicId === edge.prerequisiteId), edge,
      reason:`Marble connects ${names.get(edge.prerequisiteId)} as a foundation for ${names.get(last.topicId)}. Try a smaller related idea together.`,childReason:'Next, try a smaller idea with Pip.'};
    return {item:a.activities[0],reason:'That example needed another look. A smaller, visual activity is one possible next step.',childReason:'Next, try a smaller idea with Pip.'};
  }
  const edge = edges.find(e => e.prerequisiteId === last.topicId && items.some(q => q.topicId === e.topicId));
  if (edge) return {item:items.find(q => q.topicId === edge.topicId),edge,
    reason:`Marble links ${names.get(last.topicId)} to ${names.get(edge.topicId)}. This could be an interesting next connection.`,childReason:'Ready for something new? Try this one.'};
  return {item:a.activities[2],reason:'That example was answered independently. A different challenge could be interesting; it is a suggestion, not a level judgment.',childReason:'Ready for something new? Try this one.'};
}
