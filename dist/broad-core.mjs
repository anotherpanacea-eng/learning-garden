import {areas} from './broad-content.mjs';

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
  for (const [key,draft] of Object.entries(b.drafts)) {
    if (!draft || !Array.isArray(draft.attempts) || !draft.attempts.every(Number.isFinite)) delete b.drafts[key];
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
    t = {questions:[a.checkin[visits % 2 === 1 ? 1 : 2].id], index:0, complete:false, visits, observationStart:b.observations.length};
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

export function familiarity(state, q) {
  const b = ensureBroad(state);
  return {familiar:b.seenItems.includes(q.id), knownFact:!!q.fact && b.seenFacts.includes(pairKey(q.fact)),
    priorExposureUnknown:!!b.legacyExposureUnknown};
}

export function noteBroadExposure(state, q, mode) {
  const b = ensureBroad(state);
  if (!b.seenItems.includes(q.id)) b.seenItems.push(q.id);
  if (q.fact) {
    const key = pairKey(q.fact);
    if (!b.seenFacts.includes(key)) b.seenFacts.push(key);
    // Preserve what happened while a check-in was paused in a different activity.
    for (const [draftKey,d] of Object.entries(b.drafts)) {
      const other = itemById(draftKey.replace(/^(checkin|activity):/,''));
      if (other?.fact && pairKey(other.fact) === key && draftKey !== `${mode}:${q.id}`) d.knownFact = true;
    }
  }
}

export function noteLegacyExposure(state, fact) {
  if (!fact) return;
  noteBroadExposure(state, {id:`legacy-${pairKey(fact)}`,fact}, 'legacy');
}

export function makeBroadObservation(q, active, mode, skip=false) {
  const firstCorrect = active.attempts.length === 1 && active.attempts[0] === q.answer;
  const correct = !skip && active.attempts.at(-1) === q.answer;
  const supported = !!active.hinted || !!active.revealed || !!active.modelUsed || !!active.lessonSeen || active.method === 'together';
  const independent = correct && firstCorrect && !supported;
  return {questionId:q.id, area:q.area, skill:q.skill, topicId:q.topicId, label:q.label,
    prompt:q.prompt, answer:q.answer, choices:q.choices || null, fact:q.fact || null,
    attempts:[...active.attempts], correct, firstCorrect:!skip && firstCorrect, supported,
    independent, freshEvidence:independent && !active.familiar && !active.knownFact && !active.priorExposureUnknown,
    hinted:!!active.hinted, revealed:!!active.revealed, modelUsed:!!active.modelUsed, lessonSeen:!!active.lessonSeen,
    familiar:!!active.familiar, knownFact:!!active.knownFact, priorExposureUnknown:!!active.priorExposureUnknown,
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
  if (!last) return {item:a.activities[1], reason:'A new place to explore. No check-in is needed.'};
  const items = areas.flatMap(x => x.activities);
  const edges = graph?.dependencies || [], names = new Map((graph?.topics || []).map(t => [t.id,t.name]));
  const needsSupport = !last.correct || last.supported || !last.firstCorrect;
  if (needsSupport) {
    const edge = edges.find(e => e.topicId === last.topicId && items.some(q => q.topicId === e.prerequisiteId));
    if (edge) return {item:items.find(q => q.topicId === edge.prerequisiteId), edge,
      reason:`Marble connects ${names.get(edge.prerequisiteId)} as a foundation for ${names.get(last.topicId)}. Try a smaller related idea together.`};
    return {item:a.activities[0],reason:'That example needed another look. A smaller, visual activity is one possible next step.'};
  }
  const edge = edges.find(e => e.prerequisiteId === last.topicId && items.some(q => q.topicId === e.topicId));
  if (edge) return {item:items.find(q => q.topicId === edge.topicId),edge,
    reason:`Marble links ${names.get(last.topicId)} to ${names.get(edge.topicId)}. This could be an interesting next connection.`};
  return {item:a.activities[2],reason:'That example was answered independently. A different challenge could be interesting; it is a suggestion, not a level judgment.'};
}
